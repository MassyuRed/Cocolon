"""CPU only: reconcile two output-shape descriptions; preserve teacher values."""
import copy
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import sys
import time
import zipfile

os.environ.update(CUDA_VISIBLE_DEVICES='', HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1')
sys.dont_write_bytecode = True
W = Path('/workspace')
OUT = W / 'cocolon_shape2_cpu_20261029'
OLD = W / 'cocolon_fixed_rows_cpu_v2_20261029'
PACK = W / 'cocolon_fixedrows5_pack_20261029'
FULL = ['FT-BOOK-AFTER-ANSWER', 'FT-SHOP-AFTER-ANSWER']
OLD_SUBJECT = 'subject={bind:OMITTED,entity:null,ev:[]};'
NEW_SUBJECT = 'subject is the fixed subject row ["OMITTED",[],null];'

def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def write(p, v):
    Path(p).write_text(json.dumps(v, ensure_ascii=False, indent=2, allow_nan=False) + '\n')

def load(name, p):
    spec = importlib.util.spec_from_file_location(name, p)
    m = importlib.util.module_from_spec(spec)
    sys.modules[name] = m
    spec.loader.exec_module(m)
    return m

def change(messages):
    result = copy.deepcopy(messages)
    before = json.loads(result[1]['content'])
    after = copy.deepcopy(before)
    assert after['output_spec']['shape']['root'] == ['v', 'a', 'q', 'c']
    assert after['output_spec']['axes_requirements'].count(OLD_SUBJECT) == 1
    after['output_spec']['shape']['root'] = ['format', 'v', 'a', 'q', 'c']
    after['output_spec']['axes_requirements'] = after['output_spec']['axes_requirements'].replace(OLD_SUBJECT, NEW_SUBJECT)
    restored = copy.deepcopy(after)
    restored['output_spec']['shape']['root'] = ['v', 'a', 'q', 'c']
    restored['output_spec']['axes_requirements'] = restored['output_spec']['axes_requirements'].replace(NEW_SUBJECT, OLD_SUBJECT)
    assert restored == before
    result[1]['content'] = json.dumps(after, ensure_ascii=False, separators=(',', ':'), allow_nan=False)
    assert result[0] == messages[0] and result[2:] == messages[2:]
    return result

def main():
    started = time.monotonic()
    OUT.mkdir(exist_ok=False)
    runner = load('shape2_existing_runner', PACK / 'run_fixed_rows5.py')
    _, prior, helper, bound = runner.owners()
    import torch
    from transformers import AutoTokenizer
    from safetensors.torch import load_file
    assert not torch.cuda.is_initialized()
    tokenizer = AutoTokenizer.from_pretrained(helper.MODEL, revision=helper.REVISION, local_files_only=True, trust_remote_code=False)
    train = {r['id']: r for r in helper.read_jsonl(OLD / 'train_messages.jsonl')}
    evaluation = {r['case_id']: r for r in json.loads((OLD / 'eval_inputs.json').read_text())}
    changed_train, changed_eval, checks = [], [], []
    for cid in FULL:
        row = copy.deepcopy(train[cid])
        row['messages'] = change(row['messages'])
        ev = copy.deepcopy(evaluation[cid])
        ev['messages'] = change(ev['messages'])
        assert row['messages'][:-1] == ev['messages']
        assert row['messages'][-1] == train[cid]['messages'][-1]
        old_encoded, old_prompt = helper.encode_training(tokenizer, train[cid]['messages'], context=8192)
        encoded, prompt = helper.encode_training(tokenizer, row['messages'], context=8192)
        assert old_encoded['input_ids'][old_prompt:] == encoded['input_ids'][prompt:]
        assert encoded['labels'][:prompt] == [-100] * prompt
        assert encoded['labels'][prompt:] == encoded['input_ids'][prompt:]
        assert encoded['input_ids'][prompt:].count(tokenizer.eos_token_id) == 1
        assert prompt + ev['max_new_tokens'] <= 8192
        changed_train.append(row)
        changed_eval.append(ev)
        checks.append(dict(case_id=cid, old_prompt_tokens=old_prompt, prompt_tokens=prompt,
                          total_tokens=len(encoded['input_ids']), supervised=len(encoded['input_ids'])-prompt,
                          max_new_tokens=ev['max_new_tokens'], cap_total=prompt+ev['max_new_tokens'],
                          teacher_utf8_sha256=hashlib.sha256(row['messages'][-1]['content'].encode()).hexdigest(),
                          encoded=encoded, teacher_unchanged=True, material_prior_semantics_unchanged=True))
    # No old prompt, target or generation setting changes. Recompute all nine with the same tokenizer.
    old_counts = []
    for cid in runner.OLD:
        item, prompt = helper.encode_training(tokenizer, train[cid]['messages'], context=8192)
        frozen = next(r for r in helper.read_jsonl(runner.BUNDLE/'archive/runtime/train_messages.jsonl') if r['id']==cid)
        assert train[cid] == frozen and evaluation[cid]['messages'] == frozen['messages'][:-1]
        prior_count = next(v for v in json.loads((PACK/'prepared_cpu.json').read_text())['counts'] if v['case_id']==cid)
        assert (prompt, len(item['input_ids']), sum(v!=-100 for v in item['labels'])) == (prior_count['prompt_tokens'], prior_count['total_tokens'], prior_count['supervised'])
        old_counts.append(dict(case_id=cid, prompt_tokens=prompt, total_tokens=len(item['input_ids']), unchanged=True))
    write(OUT/'eval_inputs2.json', changed_eval)
    with (OUT/'train_messages2.jsonl').open('x') as stream:
        for row in changed_train:
            stream.write(json.dumps(row, ensure_ascii=False, separators=(',', ':'))+'\n')
    consumer = load('shape2_existing_consumer', PACK/'consume_fixed_rows5.py')
    own = consumer.owners(runner.ROOT)
    teachers = []
    cold_dir = OUT/'teacher_cmee'
    cold_dir.mkdir()
    for cid in FULL:
        row = next(r for r in changed_train if r['id']==cid)
        raw = dict(raw_text=row['messages'][-1]['content'], finish_reason='stop', provider='CPU_FROZEN_TEACHER_NOT_MODEL', model=helper.MODEL,
                   revision=helper.REVISION, adapter_revision='cpu_teacher', usage={'prompt_tokens':0,'completion_tokens':0}, seconds=0.)
        item, saved = consumer.read_raw(own,cid,raw)
        assert item['meaning_adopted'] and item['body_available']
        consumer.save_cold(runner.ROOT,own,cid,item,saved,cold_dir)
        teachers.append(item)
    weights = load_file(str(runner.INITIAL/'adapter_model.safetensors'), device='cpu')
    assert len(weights)==112 and all(t.dtype==torch.float32 and torch.isfinite(t).all() for t in weights.values())
    assert sha(runner.INITIAL/'adapter_model.safetensors') == runner.INITIAL_SHA
    assert all(sha(p)==h for p,h in bound.items())
    frozen = {str(p):h for p,h in bound.items()}
    for p in (Path(__file__), PACK/'prepared_cpu.json', OUT/'eval_inputs2.json', OUT/'train_messages2.jsonl'):
        frozen[str(p)] = sha(p)
    report = dict(status='CPU_SHAPE2_PASSED_NO_MODEL', counts=checks, old9=old_counts,
                  teacher_cmee=teachers, frozen=frozen, seconds=time.monotonic()-started,
                  initial_adapter_sha256=runner.INITIAL_SHA, model_loads=0, model_forwards=0, updates=0, generations=0,
                  actual_model_effect_unverified=True, added_observation_material=0, contract_changes=0)
    write(OUT/'cpu_check.json', report)
    write(OUT/'cpu_summary.json', {k:([dict((a,b) for a,b in v.items() if a!='encoded') for v in val] if k=='counts' else val) for k,val in report.items() if k not in ('teacher_cmee','frozen')})
    target = W/'cocolon-shape2-cpu-20261029.zip'
    files = list(sorted(p for p in OUT.rglob('*') if p.is_file()))
    manifest = [dict(path=str(p.relative_to(OUT)), bytes=p.stat().st_size, sha256=sha(p)) for p in files]
    with zipfile.ZipFile(target, 'x', zipfile.ZIP_DEFLATED) as z:
        for p in files:z.write(p,str(p.relative_to(OUT)))
        z.writestr('prepare_shape2.py',Path(__file__).read_bytes())
        z.writestr('manifest.json',json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    with zipfile.ZipFile(target) as z:assert z.testzip() is None
    print(json.dumps(dict(status=report['status'],seconds=report['seconds'],counts=[{k:v for k,v in x.items() if k!='encoded'} for x in checks],old9_unchanged=True,teacher_meaning_body_cold_replay='2/2',model_effect=0,archive=target.name,archive_bytes=target.stat().st_size,archive_sha256=sha(target)),ensure_ascii=False),flush=True)

if __name__=='__main__':
    main()
