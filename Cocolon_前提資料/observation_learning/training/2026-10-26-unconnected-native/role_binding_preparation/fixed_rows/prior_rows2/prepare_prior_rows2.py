"""One CPU-only comparison: present prior fields use the existing output row orders."""
import copy
import gzip
import hashlib
import importlib.metadata
import importlib.util
import json
import os
from pathlib import Path
import sys
import time

os.environ.update(CUDA_VISIBLE_DEVICES='', HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1')
sys.dont_write_bytecode = True
W = Path('/workspace')
OLD = W / 'cocolon_rehearsal13_cpu_20261029'
OUT = W / 'cocolon_prior_rows2_cpu_20261029'
PACK = W / 'cocolon_fixedrows5_pack_20261029'
ADAPTER = W / 'cocolon_rehearsal13_run_20261029/adapter'
ADAPTER_SHA = '114466411f36f0eef7a2dceaec7f5190544ac8545eb6b2f6a3d0446b70f90b66'
FULL = ['FT-BOOK-AFTER-ANSWER', 'FT-SHOP-AFTER-ANSWER']
OLD_DESCRIPTION = 'prior_adopted_interpretation remains read-only, in the original named format.'
NEW_DESCRIPTION = ('prior_adopted_interpretation is read-only. Only its meaning_packet.a, q, '
    'c.claims with their time/mode/polarity/pred/subject, and c.relations use the same row orders '
    'as this output. Its outer objects, c field names and other present fields including unknowns '
    'remain unchanged. Its v is the saved prior version, not an output-format example. '
    'It has no question/prose fields; do not add them to the prior. Prior aliases '
    'and quote names are local there, not declarations for your output.')


def dumps(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':'), allow_nan=False)


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec); sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


def prior_rows(prior, shape, inverse=False):
    """No fields, nulls, references or meanings are supplied when absent."""
    value = copy.deepcopy(prior); packet = value['meaning_packet']; c = packet['c']
    def row(item, family):
        keys = shape[family]
        if inverse:
            assert isinstance(item, list) and len(item) == len(keys)
            return dict(zip(keys, item))
        assert isinstance(item, dict) and list(item) == keys, (family, list(item), keys)
        return [item[k] for k in keys]
    if inverse:
        assert len(packet['a']) == len({x[0] for x in packet['a']})
        packet['a'] = dict(packet['a'])
        packet['q'] = [row(q, 'q') for q in packet['q']]
        c['claims'] = [row(x, 'claim') for x in c['claims']]
        for claim in c['claims']:
            for key in ('time', 'mode', 'polarity', 'pred', 'subject'):
                claim[key] = row(claim[key], key)
        c['relations'] = [row(x, 'relation') for x in c['relations']]
    else:
        packet['a'] = [[key, val] for key, val in packet['a'].items()]
        packet['q'] = [row(q, 'q') for q in packet['q']]
        for claim in c['claims']:
            for key in ('time', 'mode', 'polarity', 'pred', 'subject'):
                claim[key] = row(claim[key], key)
        c['claims'] = [row(x, 'claim') for x in c['claims']]
        c['relations'] = [row(x, 'relation') for x in c['relations']]
    return value


def main():
    started = time.monotonic(); OUT.mkdir(exist_ok=False)
    original = json.loads(gzip.decompress((OLD / 'prepared_cpu.json.gz').read_bytes()))
    assert original['status'] == 'CPU_REHEARSAL13_READY_NO_MODEL'
    assert all(sha(p) == h for p, h in original['frozen'].items())
    runner = load('prior_rows2_existing_runner', PACK / 'run_fixed_rows5.py')
    _, _, helper, bound = runner.owners()
    assert all(sha(p) == h for p, h in bound.items())
    dependencies = {name: importlib.metadata.version(name) for name in helper.PINS}
    assert dependencies == helper.PINS
    import torch
    from transformers import AutoTokenizer
    assert not torch.cuda.is_initialized()
    tokenizer = AutoTokenizer.from_pretrained(helper.MODEL, revision=helper.REVISION,
                                             local_files_only=True, trust_remote_code=False)
    rows = helper.read_jsonl(OLD / 'train_messages11.jsonl')
    evaluations = json.loads((OLD / 'eval_inputs11.json').read_text())
    counts, derived, prior_reports = [], [], []
    for row, evaluation in zip(rows, evaluations):
        cid = row['id']; assert cid == evaluation['case_id']
        new = copy.deepcopy(row)
        if cid in FULL:
            old_user = json.loads(row['messages'][1]['content']); user = copy.deepcopy(old_user)
            shape = user['output_spec']['shape']; prior = old_user['prior_adopted_interpretation']
            assert set(prior['meaning_packet']['c']) == {'claims','conflicts','core','relations','schema','unknowns','updates'}
            user['prior_adopted_interpretation'] = prior_rows(prior, shape)
            restored = prior_rows(user['prior_adopted_interpretation'], shape, inverse=True)
            assert dumps(restored) == dumps(prior)
            description = user['output_spec']['output_types']; assert description.count(OLD_DESCRIPTION) == 1
            user['output_spec']['output_types'] = description.replace(OLD_DESCRIPTION, NEW_DESCRIPTION)
            undo = copy.deepcopy(user); undo['prior_adopted_interpretation'] = restored
            undo['output_spec']['output_types'] = description
            assert dumps(undo) == row['messages'][1]['content']
            new['messages'][1]['content'] = dumps(user)
            assert new['messages'][0] == row['messages'][0] and new['messages'][-1] == row['messages'][-1]
            prior_reports.append(dict(case_id=cid, prior_before_bytes=len(dumps(prior).encode()),
                prior_after_bytes=len(dumps(user['prior_adopted_interpretation']).encode()),
                original_prior_sha256=hashlib.sha256(dumps(prior).encode()).hexdigest(),
                restored_prior_sha256=hashlib.sha256(dumps(restored).encode()).hexdigest(),
                all_values_names_order_and_types_restored=True, added_missing_fields=0,
                changed_user_paths=['prior_adopted_interpretation.meaning_packet.a',
                    'prior_adopted_interpretation.meaning_packet.q',
                    'prior_adopted_interpretation.meaning_packet.c.claims',
                    'prior_adopted_interpretation.meaning_packet.c.relations','output_spec.output_types']))
        else:
            assert new == row
        encoded, prompt = helper.encode_training(tokenizer, new['messages'], context=8192)
        previous = next(x for x in original['counts'] if x['case_id'] == cid)
        prefix = next(i for i, value in enumerate(encoded['labels']) if value != -100)
        assert prefix == prompt and encoded['labels'][:prompt] == [-100] * prompt
        assert encoded['labels'][prompt:] == encoded['input_ids'][prompt:]
        old_encoded = original['encoded'][cid]; old_prompt = previous['prompt_tokens']
        assert encoded['input_ids'][prompt:] == old_encoded['input_ids'][old_prompt:]
        assert encoded['input_ids'][prompt:].count(tokenizer.eos_token_id) == 1
        if cid not in FULL:
            assert encoded == old_encoded and prompt == old_prompt
        assert prompt + runner.CAP[cid] <= 8192
        derived.append(new)
        evaluation['messages'] = new['messages'][:-1]
        counts.append(dict(case_id=cid, old_prompt_tokens=old_prompt, prompt_tokens=prompt,
            total_train_tokens=len(encoded['input_ids']), cap=runner.CAP[cid],
            prompt_plus_cap=prompt+runner.CAP[cid], target_tokens_unchanged=True,
            old9_entire_messages_and_tokens_unchanged=cid not in FULL))
    (OUT / 'train_messages11.jsonl').write_text(''.join(dumps(x)+'\n' for x in derived))
    (OUT / 'eval_inputs11.json').write_text(json.dumps(evaluations,ensure_ascii=False,indent=2)+'\n')
    for name in ('README.md', 'adapter_config.json', 'adapter_model.safetensors'):
        assert sha(ADAPTER / name) == json.loads((ADAPTER.parent / 'run.json').read_text())['adapter_sha256'][name]
    assert sha(ADAPTER / 'adapter_model.safetensors') == ADAPTER_SHA
    assert all(sha(p) == h for p, h in original['frozen'].items())
    report = dict(status='CPU_PRIOR_ROWS2_PASSED_NO_MODEL', seconds=time.monotonic()-started,
        source_sha256=sha(__file__), dependencies=dependencies, source_basis='b2d55b90d8998c571de002dfc4ef128832461713',
        previous_cpu_sha256=sha(OLD/'prepared_cpu.json.gz'), prior_roundtrips=prior_reports, counts=counts,
        unchanged_teacher_cmee='Existing rehearsal13 teacher2 saved/cold full outcomes retained; no new CMEE execution',
        teacher_meaning_body=original['teacher_cmee'], model_loads=0, model_forwards=0,
        training_updates=0, generations=0, cmee_executions=0, adapter_sha256=ADAPTER_SHA,
        prior_packet_fields_added=0, old9_unchanged=True, target11_unchanged=True,
        product_credit=0, automatic_progression=False)
    payload=(dumps(report)+'\n').encode();(OUT/'cpu_full.json.gz').write_bytes(gzip.compress(payload,mtime=0))
    summary={k:v for k,v in report.items() if k!='teacher_meaning_body'}
    summary['cpu_full_sha256']=sha(OUT/'cpu_full.json.gz')
    (OUT/'cpu_summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
    print(dumps(summary),flush=True)


if __name__ == '__main__':
    main()
