"""Finite CPU check for input-derived source identity guidance. No model/forward."""
import os
os.environ.update(CUDA_VISIBLE_DEVICES='', HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1')
import copy
import gzip
import hashlib
import importlib.util
import json
from pathlib import Path
import sys
import time
sys.dont_write_bytecode = True
import prompt_source_index as candidate

W = Path('/workspace')
HERE = Path(__file__).resolve().parent
OUT = W / 'cocolon_source_index_cpu_20261030'
PREPARED = W / 'cocolon_stage5_prepared_20261030'
PROBE = W / 'cocolon_instruction_probe_run_20261030'
SHA_STAGE = '92bf81c1ca52a72480753010efc911fc132c74f4208a533853feb70fc5650713'
SHA_PROMPT = '5796284d6eea6888592bfa28a8be2807819f223b18179faf0ec93f46779297a6'

def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(name, p):
    spec = importlib.util.spec_from_file_location(name, p)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[name] = mod
    spec.loader.exec_module(mod)
    return mod
def write(p, v): p.write_text(json.dumps(v, ensure_ascii=False, indent=2, allow_nan=False)+'\n')

def main():
    start = time.monotonic()
    assert not OUT.exists(), 'fresh_output_required'
    stage_path = W / 'cocolon_stage5_pack_20261030/consume_stage5.py'
    prompt_path = W / 'cocolon_instruction_probe_pack_20261030/prompt_stage_only.py'
    assert sha(stage_path) == SHA_STAGE and sha(prompt_path) == SHA_PROMPT
    stage = load('frozen_stage_source_index', stage_path)
    frozen_prompt = load('frozen_prompt_source_index', prompt_path)
    loader = load('frozen_loader_source_index', W / 'cocolon_fixedrows5_pack_20261029/run_fixed_rows5.py')
    _, _, helper, bound = loader.owners()
    old = json.loads(gzip.decompress((PREPARED/'prepared_cpu.json.gz').read_bytes()))
    frozen = {**old['frozen'], **{str(p): h for p,h in bound.items()},
              **json.loads((PROBE/'extra_frozen.json').read_text())}
    for p in sorted(PROBE.glob('stage1*')): frozen[str(p)] = sha(p)
    assert all(sha(p) == h for p,h in frozen.items())
    import torch
    from transformers import AutoTokenizer
    assert not torch.cuda.is_initialized()
    tokenizer = AutoTokenizer.from_pretrained(helper.MODEL, revision=helper.REVISION, local_files_only=True, trust_remote_code=False)
    rows = helper.read_jsonl(W/'cocolon_rehearsal13_cpu_20261029/train_messages11.jsonl')
    expected = helper.read_jsonl(W/'cocolon_stage5_instruction_final_20261030/candidate_train10.jsonl')
    checks, teachers, encoded_rows, negative, guides = [], [], [], [], []
    for row in rows[:2]:
        cid = row['id']; base = row['messages'][:-1]
        original = json.loads(base[1]['content'])
        guide = candidate.source_identity_guide(original)
        parts = stage.split_teacher(row['messages'][-1]['content'])
        aliases = dict(parts[0][2])
        assert len(aliases) == len(parts[0][2])
        source_map = {s['source_id']:s['text_fields'] for s in original['material']['sources']}
        assert set(aliases.values()) == set(source_map) | {guide['prior_snapshot_ref']}
        for qid, alias, field, text in parts[0][3]:
            source_id = aliases[alias[1:]]
            assert source_id in source_map and field in source_map[source_id]
            assert source_map[source_id][field].count(text) == 1
        guides.append(dict(case_id=cid, guide=guide, aliases=len(aliases), quotes=len(parts[0][3]), teacher_source_fields_exact=True))
        previous, records = [], []
        for i, values in enumerate(parts, 1):
            baseline = frozen_prompt.build_messages(base, i, previous)
            assert baseline == next(x for x in expected if x['id']==cid+'/stage'+str(i))['messages'][:-1]
            messages = candidate.build_messages(base, i, previous)
            payload = json.loads(messages[1]['content'])
            if i == 1:
                assert payload.pop('source_identity_guide') == guide
                assert payload['stage_output_contract']['row_fields'].pop('alias') == ['alias_name','actual_identity']
                assert payload == json.loads(baseline[1]['content'])
                assert messages[0] == baseline[0]
            else: assert messages == baseline
            target = stage.compact(values)
            assert target == next(x for x in expected if x['id']==cid+'/stage'+str(i))['messages'][-1]['content']
            item, prefix = helper.encode_training(tokenizer, messages+[dict(role='assistant',content=target)], context=8192)
            old_item, old_prefix = helper.encode_training(tokenizer, baseline+[dict(role='assistant',content=target)], context=8192)
            assert item['input_ids'][prefix:] == old_item['input_ids'][old_prefix:]
            assert item['labels'][prefix:] == old_item['labels'][old_prefix:]
            assert prefix + stage.CAPS[cid][i-1] <= 8192
            token_ids = item['input_ids'][prefix:]
            assert token_ids.count(tokenizer.eos_token_id) == 1
            raw = dict(case_id=cid+'/stage'+str(i),raw_text=target,raw_utf8_sha256=stage.text_sha(target),finish_reason='stop',eos_reached=True,
                       provider='CPU_TEACHER_NOT_MODEL',model=helper.MODEL,revision=helper.REVISION,adapter_revision='CPU_TEACHER_ONLY',
                       input_tokens=prefix,output_tokens=len(token_ids),output_token_ids=token_ids,
                       usage=dict(prompt_tokens=prefix,completion_tokens=len(token_ids)),seconds=0.)
            records.append(dict(case_id=cid,stage=i,messages=messages,messages_sha256=stage.text_sha(stage.compact(messages)),raw=raw))
            encoded_rows.append(dict(id=raw['case_id'],messages=messages+[dict(role='assistant',content=target)],training_only_gold_previous=True))
            checks.append(dict(case_id=raw['case_id'],old_prompt_tokens=old_prefix,new_prompt_tokens=prefix,target_tokens=len(token_ids),
                               prompt_plus_cap=prefix+stage.CAPS[cid][i-1],target_eos_unchanged=True,material_semantics_unchanged=True))
            previous.append(dict(stage=i,values=copy.deepcopy(values)))
        projected = candidate.project(stage,cid,base,records,cpu_teacher=True)
        assert projected['raw_text'] == row['messages'][-1]['content']
        bad = copy.deepcopy(records); bad[0]['messages'] = frozen_prompt.build_messages(base,1,[])
        bad[0]['messages_sha256'] = stage.text_sha(stage.compact(bad[0]['messages']))
        try: candidate.project(stage,cid,base,bad,cpu_teacher=True)
        except ValueError as exc: assert str(exc)=='stage_prompt_chain'
        else: raise AssertionError('old_prompt_substitution_accepted')
        teachers.append(dict(case_id=cid,exact_reassembly=True,old_prompt_substitution_rejected=True,
                             teacher_sha256=stage.text_sha(projected['raw_text'])))
        for kind in ['duplicate_source','snapshot_source_collision','field_value_not_string']:
            bad = copy.deepcopy(original)
            if kind=='duplicate_source': bad['material']['sources'][1]['source_id']=bad['material']['sources'][0]['source_id']
            elif kind=='snapshot_source_collision': bad['prior_adopted_interpretation']['snapshot_ref']=bad['material']['sources'][0]['source_id']
            else: bad['material']['sources'][1]['text_fields']['answer_text_private']=None
            try: candidate.source_identity_guide(bad)
            except ValueError as exc: negative.append(dict(case_id=cid,kind=kind,rejected=str(exc)))
            else: raise AssertionError('bad_source_guide_accepted')
    for row in rows[2:]:
        item, _ = helper.encode_training(tokenizer,row['messages'],context=8192)
        assert item == old['encoded'][row['id']]
    assert not torch.cuda.is_initialized() and all(sha(p)==h for p,h in frozen.items())
    OUT.mkdir()
    (OUT/'candidate_train10.jsonl').write_text(''.join(stage.compact(x)+'\n' for x in encoded_rows))
    write(OUT/'source_guides.json',guides)
    write(OUT/'frozen_sha256.json',frozen)
    result = dict(status='CPU_SOURCE_GUIDANCE_VERIFIED_NOT_MODEL_IMPROVEMENT',seconds=time.monotonic()-start,
                  source_sha256={n:sha(HERE/n) for n in ['prompt_source_index.py','check_source_index.py']},
                  frozen_files_unchanged=len(frozen),checks=checks,teachers=teachers,negative=negative,
                  old9_encoding_unchanged=[x['id'] for x in rows[2:]],
                  max_prompt_plus_cap=max(x['prompt_plus_cap'] for x in checks),
                  model_loads=0,model_forwards=0,updates=0,generations=0,new_cmee_calls=0,cuda_initialized=False,
                  product_credit=0,automatic_progression=False,
                  limitations=['CPU teacher reassembly is not free generation or new CMEE evidence.',
                               'Only stage1 metadata guidance changed; stages2-5 are byte-identical for the same previous candidates.',
                               'Earlier SHOP stage1 bound identities correctly, so latest failure is not proof of a learned-weight incapacity.',
                               'Frozen receiver, teacher, token caps and acceptance remain unchanged. New paid run requires separate bounded approval.'])
    write(OUT/'report.json',result)
    print(stage.compact({k:v for k,v in result.items() if k not in ['checks','negative','old9_encoding_unchanged']}),flush=True)

if __name__ == '__main__': main()
