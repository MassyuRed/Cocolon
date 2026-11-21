"""CPU-only curriculum coverage and first divergent token audit. No GPU run."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import shutil
import sys
from dataclasses import replace

_, api_arg, root_arg, sources_arg = sys.argv[:4]
api, root, sources = Path(api_arg), Path(root_arg), Path(sources_arg)
ce = Path('/workspace/analysis-actor-ownership-ce20-20261105')
fit = Path('/workspace/analysis-actor-ownership-fit4-20261105')
runner = Path('/workspace/actor_ownership_ce20_trial.py')
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert sha(runner) == '88e0cd713fd9c0828d73ca51cdb5c1261c065299809e294b1846de5afe0e5599'
original_argv = sys.argv[:]
sys.argv = [str(runner), 'prepare', str(api), str(root)]
spec = importlib.util.spec_from_file_location('ce_owner', runner)
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)
sys.argv = original_argv


def main():
    base.check_api()
    assert not root.exists(), 'do_not_restart_or_replace_partial_root'
    assert sha(ce/'pack.json') == '48844581bd6a52799693b84b35612c0df380004178dbe3414152949299a54a25'
    previous = json.loads((ce/'pack.json').read_text())
    added = json.loads(sources.read_text())['examples']
    assert len(previous['teachers']) == 14 and len(added) == 6
    teachers = copy.deepcopy(previous['teachers'])
    for i, row in enumerate(added, 1):
        snap = base.make_snapshot(teachers[0]['snapshot'], teachers[0]['owner'], row['text'], 19100+i)
        teachers.append(dict(id=row['id'], owner=teachers[0]['owner'], snapshot=snap,
            assistant_target=base.target(row['text'].rstrip('。'), row['actor'], row['target'], row['negative'])))
    keys = ('id', 'owner', 'snapshot', 'assistant_target')
    assert [{k:x[k] for k in keys} for x in teachers[:14]] == [{k:x[k] for k in keys} for x in previous['teachers']]
    excluded = [x['snapshot']['members'][0]['original']['memo'] for x in previous['evaluation']]
    excluded += [x['row']['snapshot']['members'][0]['original']['memo']
        for x in json.loads(base.PRIOR.read_text())['cases']]
    assert not set(x['text'] for x in added) & set(excluded)
    from transformers import AutoTokenizer
    from serve_emlis_natural_reply import MODEL, REVISION, PINS
    from importlib.metadata import version
    assert {n:version(n) for n in PINS} == PINS
    tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION,
        local_files_only=True, trust_remote_code=False)
    root.mkdir()
    shutil.copyfile(__file__, root/'runner.py')
    shutil.copyfile(runner, root/'ce_owner.py')
    shutil.copyfile(sources, root/'independent_sources.json')
    encoded, audit = {}, []
    for row in teachers:
        p = base.service.prepare_cumulative_category_units(row['owner'], row['snapshot'], prompt_version=base.PROFILE)
        messages = p.messages()
        if 'messages' in row:
            assert row['messages'] == messages and row['request_ref'] == p.request_ref
        prompt = tokenizer.apply_chat_template(messages, enable_thinking=False,
            add_generation_prompt=True, tokenize=True, return_dict=False, truncation=False)
        full = tokenizer.apply_chat_template(messages+[dict(role='assistant',content=row['assistant_target'])],
            enable_thinking=False, add_generation_prompt=False, tokenize=True, return_dict=False, truncation=False)
        assert full[:len(prompt)] == prompt and len(prompt)+2048 <= 8192 and len(full) <= 8192
        assert tokenizer.decode(full[len(prompt):],skip_special_tokens=False,
            clean_up_tokenization_spaces=False) == row['assistant_target']+'<|im_end|>\n'
        response = base.admission.AnalysisModelQuotedParentUnitsResponse(p.request_ref,
            base.admission.digest(messages), hashlib.sha256(row['assistant_target'].encode()).hexdigest(),
            'stop', row['assistant_target'])
        value = replace(p,response=response)
        a,c = base.service.build_cumulative_quoted_parent_candidates(row['owner'], row['snapshot'], model_input=value)
        saved = base.service.serialize_cumulative_quoted_parent_candidates(row['owner'], row['snapshot'],
            model_input=value, artifact=a, coverage=c)
        with base.guard_saved():
            assert base.service.reload_cumulative_quoted_parent_candidates(row['owner'], row['snapshot'], saved) == (a,c)
        (root/(row['id']+'.candidate.json')).write_text(saved)
        row.update(messages=messages, request_ref=p.request_ref)
        encoded[row['id']] = dict(input_ids=full, labels=[-100]*len(prompt)+full[len(prompt):], prompt_tokens=len(prompt))
        audit.append(dict(id=row['id'],input_tokens=len(prompt),target_tokens=len(full)-len(prompt),saved_replay=True))
    # Inspect the exact generated branch against the existing OT06 teacher.
    teacher = next(x for x in teachers if x['id']=='OT06')
    case = next(x for x in json.loads((fit/'trained.json').read_text())['cases'] if x['row']['id']=='OT06')
    assert case['request']['messages'] == teacher['messages']
    generated = tokenizer.apply_chat_template(teacher['messages']+[dict(role='assistant',content=case['response']['raw'])],
        enable_thinking=False,add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
    gold = encoded['OT06']['input_ids']
    i = next(i for i,(a,b) in enumerate(zip(gold,generated)) if a!=b)
    start = encoded['OT06']['prompt_tokens']
    assert i >= start
    first = dict(id='OT06',target_token_index=i-start,gold_token_id=gold[i],generated_token_id=generated[i],
        gold_token=tokenizer.decode([gold[i]]),generated_token=tokenizer.decode([generated[i]]),
        gold_context=tokenizer.decode(gold[max(start,i-8):i+8]),
        generated_context=tokenizer.decode(generated[max(start,i-8):i+8]))
    base.write(root/'teachers.json',dict(teachers=teachers,update_order=None,initial_adapter=None,
        status='CPU_ONLY_NOT_TRAINED',normal_adoption=False))
    base.write(root/'encoded.json',encoded)
    base.write(root/'first_divergence.json',first)
    base.write(root/'report.json',dict(status='COMPLETE_CPU_ONLY',old14_exact=True,new6=6,teachers=20,
        new_generation=0,model_loads=0,new_training=0,normal_adoption=False,audit=audit,
        ce_owner_sha256=sha(runner),sources_sha256=sha(sources)))
    base.write(root/'manifest.json',{str(p.relative_to(root)):sha(p) for p in root.rglob('*') if p.is_file()})
    print('CPU only complete: old14 exact, new6 admitted/replayed/masked, first OT06 token inspected, model0/training0')


if __name__=='__main__':
    main()
