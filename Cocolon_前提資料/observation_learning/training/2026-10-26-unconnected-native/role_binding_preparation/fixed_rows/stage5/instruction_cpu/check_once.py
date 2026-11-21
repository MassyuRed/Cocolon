"""One CPU-only prompt consistency check; no model, forward or CMEE call."""
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
from prompt_stage_only import build_messages, project, FIELDS

W = Path('/workspace')
HERE = Path(__file__).resolve().parent
OUT = W / 'cocolon_stage5_instruction_final_20261030'
OLD = W / 'cocolon_stage5_prepared_20261030'
RUN = W / 'cocolon_stage5_run_20261030'
ORIGINAL = W / 'cocolon_rehearsal13_cpu_20261029'
SOURCE_HASH = '92bf81c1ca52a72480753010efc911fc132c74f4208a533853feb70fc5650713'
def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(name, p):
    spec = importlib.util.spec_from_file_location(name, p)
    m = importlib.util.module_from_spec(spec)
    sys.modules[name] = m
    spec.loader.exec_module(m)
    return m
def compact(v): return json.dumps(v,ensure_ascii=False,separators=(',',':'),allow_nan=False)
def write(p, v): p.write_text(json.dumps(v,ensure_ascii=False,indent=2,allow_nan=False)+'\n')

def main():
    started = time.monotonic()
    assert not OUT.exists(), 'fresh_output_required'
    sfile = W / 'cocolon_stage5_pack_20261030/consume_stage5.py'
    assert sha(sfile) == SOURCE_HASH
    s = load('stage5_frozen_instruction_source', sfile)
    owner = load('stage5_frozen_owner_instruction', W / 'cocolon_fixedrows5_pack_20261029/run_fixed_rows5.py')
    _, _, helper, bound = owner.owners()
    old = json.loads(gzip.decompress((OLD / 'prepared_cpu.json.gz').read_bytes()))
    assert all(sha(p) == h for p,h in old['frozen'].items())
    assert all(sha(p) == h for p,h in bound.items())
    closed = json.loads((RUN / 'run.json').read_text())
    assert closed['status'] == 'STOPPED_NOT_ADOPTED_NO_RETRY'
    model_hash = closed['adapter_sha256']['adapter_model.safetensors']
    assert sha(RUN / 'adapter/adapter_model.safetensors') == model_hash
    import torch
    from transformers import AutoTokenizer
    assert not torch.cuda.is_initialized()
    tokenizer = AutoTokenizer.from_pretrained(helper.MODEL,revision=helper.REVISION,local_files_only=True,trust_remote_code=False)
    original_rows = helper.read_jsonl(ORIGINAL / 'train_messages11.jsonl')
    rows = helper.read_jsonl(OLD / 'train19.jsonl')
    checks = []
    proposed = []
    syntax_sources = []
    projection_checks = []
    for row in original_rows[:2]:
        original = json.loads(row['messages'][1]['content'])
        base = row['messages'][:-1]
        parts = s.split_teacher(row['messages'][-1]['content'])
        assert s.compact(s.assemble_values(parts)) == row['messages'][-1]['content']
        previous = []
        originals = []
        records = []
        for i, part in enumerate(parts,1):
            cid = row['id']+'/stage'+str(i)
            oldrow = next(x for x in rows if x['id']==cid)
            expected_prompt = s.build_messages(base,i,previous)
            assert oldrow['messages'][:-1] == expected_prompt
            messages = build_messages(base,i,previous)
            payload = json.loads(messages[1]['content'])
            assert payload['original_request'] == {k:v for k,v in original.items() if k not in ('model_output_format','output_spec')}
            expected_semantics = {k:v for k,v in original['output_spec'].items() if k not in ('notation','shape','output_types')}
            assert payload['final_packet_semantics'] == expected_semantics
            assert payload['final_format_reference']['model_output_format'] == original['model_output_format']
            assert payload['previous_candidate_stages'] == previous
            assert payload['stage_output_contract']['root_fields_in_order'] == FIELDS[i-1]
            assert payload['stage_output_contract']['root_arity'] == len(part)
            assert not any(key in payload for key in ['output_spec','reference_only_full_packet_output_spec'])
            assert 'root=[format,v,a,q,c]' not in messages[1]['content']
            assert 'Write c.updates before c.prose' not in messages[1]['content']
            assert '出力形式はcocolon.cmee.fixed_rows_comparison.v1です。' not in messages[0]['content']
            target = oldrow['messages'][-1]['content']
            assert target == s.compact(part)
            encoded,prefix = helper.encode_training(tokenizer,messages+[dict(role='assistant',content=target)],context=8192)
            old_encoded = old['encoded'][cid]
            old_prefix = next(x['prompt_tokens'] for x in old['counts'] if x['case_id']==cid)
            assert encoded['input_ids'][prefix:] == old_encoded['input_ids'][old_prefix:]
            assert encoded['labels'][prefix:] == old_encoded['labels'][old_prefix:]
            assert prefix+s.CAPS[row['id']][i-1] <= 8192
            assert encoded['input_ids'][prefix:].count(tokenizer.eos_token_id)==1
            target_ids=encoded['input_ids'][prefix:]
            raw=dict(case_id=cid,raw_text=target,raw_utf8_sha256=s.text_sha(target),finish_reason='stop',eos_reached=True,
                     provider='CPU_TEACHER_NOT_MODEL',model=helper.MODEL,revision=helper.REVISION,adapter_revision='CPU_TEACHER_ONLY',
                     input_tokens=prefix,output_tokens=len(target_ids),output_token_ids=target_ids,
                     usage=dict(prompt_tokens=prefix,completion_tokens=len(target_ids)),seconds=0.)
            records.append(dict(case_id=row['id'],stage=i,messages=messages,messages_sha256=s.text_sha(compact(messages)),raw=raw))
            proposed.append(dict(id=cid,messages=messages+[dict(role='assistant',content=target)],training_only_gold_previous=True))
            checks.append(dict(case_id=cid,old_prompt_tokens=old_prefix,new_prompt_tokens=prefix,
                               target_tokens=len(encoded['input_ids'])-prefix,cap=s.CAPS[row['id']][i-1],
                               target_plus_eos_ids_identical=True,material_prior_request_identical=True,
                               all_non_syntax_requirements_identical=True,unique_active_root=True,
                               old_messages_sha256=s.text_sha(s.compact(expected_prompt)),new_messages_sha256=s.text_sha(s.compact(messages))))
            previous.append(dict(stage=i,values=copy.deepcopy(part)))
            originals.append(dict(stage=i,original_system=base[0]['content'],original_output_spec=original['output_spec']))
        projected=project(s,row['id'],base,records,cpu_teacher=True)
        assert projected['raw_text']==row['messages'][-1]['content']
        assert projected['stage_bundle_sha256']==s.text_sha(compact(records))
        # Old messages must never be substituted to satisfy the old chain checker.
        bad=copy.deepcopy(records)
        bad[1]['messages']=next(x for x in rows if x['id']==row['id']+'/stage2')['messages'][:-1]
        bad[1]['messages_sha256']=s.text_sha(compact(bad[1]['messages']))
        try: project(s,row['id'],base,bad,cpu_teacher=True)
        except ValueError as exc: assert str(exc)=='stage_prompt_chain'
        else: raise AssertionError('old_prompt_substitution_accepted')
        projection_checks.append(dict(case_id=row['id'],exact_current_chain=True,teacher_packet_bytes_identical=True,
                                      bundle_sha256_actual_records=True,old_prompt_substitution_rejected=True))
        syntax_sources.append(dict(case_id=row['id'],original_syntax=originals,
                                   reconstructed_teacher_sha256=s.text_sha(s.compact(s.assemble_values(parts)))))
    differences = []
    for call in closed['calls']:
        raw = helper.read_jsonl(RUN / call['path'])[0]
        actual_messages = json.loads((RUN/(call['path']+'.messages.json')).read_text())
        train = next(x for x in rows if x['id']==raw['case_id'])
        trained_prompt = train['messages'][:-1]
        a = json.loads(actual_messages[1]['content'])
        t = json.loads(trained_prompt[1]['content'])
        differing = [k for k in t if t[k]!=a[k]]
        assert all(k=='previous_candidate_stages' for k in differing)
        differences.append(dict(case_id=raw['case_id'],training_prompt_equals_actual=actual_messages==trained_prompt,
                                differing_user_keys=differing,input_tokens=raw['input_tokens'],
                                prior_stage_difference_cannot_explain_stage1=raw['case_id'].endswith('stage1')))
    old9=[]
    for row in original_rows[2:]:
        item,prefix=helper.encode_training(tokenizer,row['messages'],context=8192)
        assert item==old['encoded'][row['id']]
        old9.append(row['id'])
    assert len(checks)==10 and len(old9)==9
    assert not torch.cuda.is_initialized()
    assert all(sha(p)==h for p,h in old['frozen'].items())
    assert sha(RUN/'adapter/adapter_model.safetensors')==model_hash
    OUT.mkdir()
    (OUT/'candidate_train10.jsonl').write_text(''.join(compact(x)+'\n' for x in proposed))
    write(OUT/'original_syntax_reference.json',syntax_sources)
    result=dict(status='CPU_INSTRUCTION_CONSISTENCY_CONFIRMED_NOT_MODEL_IMPROVEMENT',seconds=time.monotonic()-started,
                source_sha256={n:sha(HERE/n) for n in ['prompt_stage_only.py','check_once.py']},
                previous_run_unchanged=True,previous_saved_weight_sha256=model_hash,checks=checks,
                old9_encoding_unchanged=old9,actual_vs_training= differences,
                projection_checks=projection_checks,
                max_new_prompt_plus_cap=max(x['new_prompt_tokens']+x['cap'] for x in checks),
                complete_teacher_bytes_identical='2/2',model_loads=0,model_forwards=0,updates=0,generations=0,
                new_cmee_calls=0,cuda_initialized=False,product_credit=0,
                limits=['Instruction inconsistency is real; causal effect on generation remains untested.',
                        'S1 training and evaluation prompts were already equal; teacher-forced to free-generation failure remains.',
                        'Same stage5 split/join, original material/prior and all non-syntax requirements/teacher values retained.',
                        'No new model result, new acceptance or old9 regression claim.'])
    write(OUT/'report.json',result)
    print(compact({k:v for k,v in result.items() if k not in ['checks','actual_vs_training','old9_encoding_unchanged']}),flush=True)

if __name__=='__main__': main()
