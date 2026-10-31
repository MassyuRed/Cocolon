"""Approved one-shot CPU preparation; no pretrained model or forward."""
import os
os.environ.update(CUDA_VISIBLE_DEVICES='', HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1')
import copy
import gzip
import importlib.metadata
import json
from pathlib import Path
import sys
import time
sys.dont_write_bytecode = True
import consume_stage5 as stage

W = Path('/workspace')
HERE = Path(__file__).resolve().parent
OUT = W / 'cocolon_stage5_prepared_20261030'
OLD = W / 'cocolon_rehearsal13_cpu_20261029'
PACK = W / 'cocolon_fixedrows5_pack_20261029'
INITIAL = W / 'cocolon_rehearsal13_run_20261029/adapter'

def main():
    start = time.monotonic()
    plan = json.loads((HERE / 'plan.json').read_text())
    stage.need(plan['status'] == 'MASH_EXPLICITLY_APPROVED_ONCE' and plan['max_updates'] == 19, 'approval_required')
    stage.need(not OUT.exists(), 'cpu_output_already_exists')
    for name, digest in plan['source_sha256'].items():
        stage.need(stage.sha(HERE / name) == digest, 'source_changed:' + name)
    old = json.loads(gzip.decompress((OLD / 'prepared_cpu.json.gz').read_bytes()))
    stage.need(all(stage.sha(p) == h for p, h in old['frozen'].items()), 'old_frozen_changed')
    stage.need(stage.sha(OLD / 'train_messages11.jsonl') == plan['original_train_sha256'] and
               stage.sha(OLD / 'eval_inputs11.json') == plan['original_eval_sha256'], 'original_input_changed')
    stage.need(stage.sha(INITIAL / 'adapter_model.safetensors') == plan['initial_adapter_sha256'], 'initial_adapter_changed')
    owner = stage.load('stage5_old_loader_cpu', PACK / 'run_fixed_rows5.py')
    _, _, helper, bound = owner.owners()
    import torch
    from transformers import AutoTokenizer
    stage.need(not torch.cuda.is_initialized(), 'cpu_only')
    stage.need({n: importlib.metadata.version(n) for n in helper.PINS} == helper.PINS, 'dependency_changed')
    tokenizer = AutoTokenizer.from_pretrained(helper.MODEL, revision=helper.REVISION, local_files_only=True, trust_remote_code=False)
    rows = helper.read_jsonl(OLD / 'train_messages11.jsonl')
    cases = json.loads((OLD / 'eval_inputs11.json').read_text())
    stage.need([r['id'] for r in rows] == [c['case_id'] for c in cases] == plan['evaluation_order'], 'case_identity')
    train = []
    encoded = {}
    counts = []
    teacher_records = {}
    for row in rows[:2]:
        parts = stage.split_teacher(row['messages'][-1]['content'])
        stage.need(stage.compact(stage.assemble_values(parts)) == row['messages'][-1]['content'], 'teacher_not_lossless')
        previous = []
        records = []
        for i, values in enumerate(parts, 1):
            messages = stage.build_messages(row['messages'][:-1], i, previous)
            text = stage.compact(values)
            full = messages + [{'role': 'assistant', 'content': text}]
            item, prefix = helper.encode_training(tokenizer, full, context=8192)
            stage.need(prefix + stage.CAPS[row['id']][i - 1] <= 8192, 'stage_context')
            cid = row['id'] + '/stage' + str(i)
            train.append(dict(id=cid, origin_id=row['id'], stage=i, training_only_gold_previous=True, messages=full))
            encoded[cid] = item
            target_ids = item['input_ids'][prefix:]
            stage.need(target_ids.count(tokenizer.eos_token_id) == 1, 'eos_supervision')
            counts.append(dict(case_id=cid, prompt_tokens=prefix, target_tokens=len(target_ids), total_tokens=len(item['input_ids']), cap=stage.CAPS[row['id']][i - 1]))
            raw = dict(case_id=cid, raw_text=text, raw_utf8_sha256=stage.text_sha(text), finish_reason='stop', eos_reached=True,
                       provider='CPU_TEACHER_NOT_MODEL', model=helper.MODEL, revision=helper.REVISION, adapter_revision='CPU_TEACHER_ONLY',
                       input_tokens=prefix, output_tokens=len(target_ids), output_token_ids=target_ids,
                       usage=dict(prompt_tokens=prefix, completion_tokens=len(target_ids)), seconds=0.)
            records.append(dict(case_id=row['id'], stage=i, messages=messages, messages_sha256=stage.text_sha(stage.compact(messages)), raw=raw))
            previous.append(dict(stage=i, values=copy.deepcopy(values)))
        projected = stage.project(row['id'], row['messages'][:-1], records, cpu_teacher=True)
        stage.need(projected['raw_text'] == row['messages'][-1]['content'], 'projected_teacher_bytes_changed')
        teacher_records[row['id']] = records
    for row in rows[2:]:
        item, prefix = helper.encode_training(tokenizer, row['messages'], context=8192)
        stage.need(item == old['encoded'][row['id']] and row['messages'][:-1] == next(c['messages'] for c in cases if c['case_id'] == row['id']), 'old9_tokens_changed')
        encoded[row['id']] = item
        train.append(row)
        counts.append(dict(case_id=row['id'], prompt_tokens=prefix, target_tokens=len(item['input_ids']) - prefix, total_tokens=len(item['input_ids']), cap=2560))
    stage.need(len(train) == 19 and set(plan['update_order']) == set(encoded) and len(plan['update_order']) == 19, 'training_schedule')
    # Provenance/chain failures must be rejected before any receiver call.
    negatives = []
    cid = rows[0]['id']
    for kind in ['missing', 'duplicate', 'swap_equal_arity', 'wrong_adapter', 'prompt_chain', 'unfinished', 'wrong_usage', 'raw_hash']:
        bad = copy.deepcopy(teacher_records[cid])
        if kind == 'missing': bad.pop()
        elif kind == 'duplicate': bad.append(bad[0])
        elif kind == 'swap_equal_arity': bad[1], bad[2] = bad[2], bad[1]
        elif kind == 'wrong_adapter': bad[2]['raw']['adapter_revision'] = 'other'
        elif kind == 'prompt_chain': bad[3]['messages'][1]['content'] += ' '
        elif kind == 'unfinished': bad[3]['raw']['finish_reason'] = 'length'
        elif kind == 'wrong_usage': bad[1]['raw']['usage']['completion_tokens'] += 1
        else: bad[0]['raw']['raw_utf8_sha256'] = '0' * 64
        try: stage.project(cid, rows[0]['messages'][:-1], bad, cpu_teacher=True)
        except ValueError as exc: negatives.append(dict(kind=kind, rejected=str(exc)))
        else: raise AssertionError('invalid_chain_accepted:' + kind)
    consumer = stage.load('stage5_existing_consumer_cpu', PACK / 'consume_fixed_rows5.py')
    own = consumer.owners(owner.ROOT)
    OUT.mkdir()
    checks = []
    for row in rows[:2]:
        records = teacher_records[row['id']]
        projected = stage.project(row['id'], row['messages'][:-1], records, cpu_teacher=True)
        item, saved = consumer.read_raw(own, row['id'], projected)
        stage.need(item['meaning_adopted'] and item['body_available'], 'cpu_teacher_meaning_or_body')
        provenance = stage.verify_snapshot_receipt(item, saved, projected)
        consumer.save_cold(owner.ROOT, own, row['id'], item, saved, OUT)
        stage.need(item['cold_file_status'] == 'COLD_FULL_OUTCOME_IDENTICAL', 'cpu_cold_failed')
        on_disk = json.loads((OUT / (row['id'] + '_saved.json')).read_text())
        stage.verify_snapshot_receipt(item, on_disk, projected)
        stage.write(OUT / (row['id'] + '_teacher_stages.json'), records)
        stage.write(OUT / (row['id'] + '_teacher_projection.json'), projected)
        checks.append(dict(case_id=row['id'], provenance=provenance, outcome=item))
    baseline = json.loads((W / 'cocolon_rehearsal13_run_20261029/cmee/diagnosis.json').read_text())
    old_checks = []
    for cid in plan['evaluation_order'][2:]:
        raw = helper.read_jsonl(W / 'cocolon_rehearsal13_run_20261029' / ('after_' + cid + '.jsonl'))[0]
        item, _ = consumer.read_raw(own, cid, raw)
        prior = next(x for x in baseline['cases'] if x['case_id'] == cid)
        stage.need(item['meaning_adopted'] and item['body_available'], 'old9_saved_raw_failed')
        for key in ['receipt', 'checkpoint', 'outcome', 'meaning_adopted', 'body_available']:
            stage.need(item[key] == prior[key], 'old9_outcome_changed:' + cid + ':' + key)
        old_checks.append(dict(case_id=cid, receipt_checkpoint_full_outcome_identical=True))
    frozen = {**old['frozen'], **{str(p): h for p, h in bound.items()}}
    for p in [INITIAL / 'adapter_model.safetensors', INITIAL / 'adapter_config.json', OLD / 'train_messages11.jsonl', OLD / 'eval_inputs11.json', HERE / 'plan.json', *[HERE / n for n in plan['source_sha256']]]:
        frozen[str(p)] = stage.sha(p)
    stage.need(all(stage.sha(p) == h for p, h in frozen.items()), 'frozen_changed')
    from safetensors.torch import load_file
    weights = load_file(str(INITIAL / 'adapter_model.safetensors'), device='cpu')
    stage.need(len(weights) == 112 and all(v.dtype == torch.float32 and torch.isfinite(v).all() for v in weights.values()), 'initial_112F32')
    stage.need(not torch.cuda.is_initialized(), 'cuda_initialized')
    prepared = dict(status='CPU_STAGE5_READY_NO_MODEL', encoded=encoded, frozen=frozen, counts=counts,
                    dependencies=helper.PINS, order=plan['update_order'], original_cases=cases, teacher_records=teacher_records)
    (OUT / 'prepared_cpu.json.gz').write_bytes(gzip.compress((stage.compact(prepared) + '\n').encode(), mtime=0))
    (OUT / 'train19.jsonl').write_text(''.join(stage.compact(x) + '\n' for x in train))
    result = dict(status=prepared['status'], seconds=time.monotonic() - start, counts=counts, teacher_checks=checks, old9_checks=old_checks,
                  negatives=negatives, prepared_sha256=stage.sha(OUT / 'prepared_cpu.json.gz'), source_sha256=plan['source_sha256'],
                  model_loads=0, model_forwards=0, updates=0, generations=0, cuda_initialized=False, product_credit=0)
    stage.write(OUT / 'cpu_summary.json', result)
    print(stage.compact({k: v for k, v in result.items() if k not in ['teacher_checks', 'counts']}), flush=True)

if __name__ == '__main__':
    main()
