"""One CPU preparation: fixed bytes/tokens and gold2/baseline2 on exact API7b9."""
import argparse
import hashlib
import importlib.metadata
import importlib.util
import json
import os
from pathlib import Path
import sys
import time

sys.dont_write_bytecode = True
HERE = Path(__file__).resolve().parent


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    sys.modules[name] = result
    spec.loader.exec_module(result)
    return result


def main(bundle, cmee_root, runtime):
    started = time.monotonic()
    runner = load('fit8_preparation_runner', HERE / 'run_fit8.py')
    plan, prior, rows, bound = runner.validate(bundle)
    report = dict(status='CPU_STATIC_FIT8_READY_NO_MODEL', optimizer_steps=8,
                  training_order=runner.ORDER, frozen_auxiliary_rows=4, original19_and_eval_unchanged=True,
                  pretrained_model_loads=0, model_forwards=0, generations=0, sql_operations=0,
                  initial_adapter_sha256=plan['initial_adapter_sha256'], model_calls_planned=6,
                  all_inputs_unchanged=True, runtime_check_performed=False)
    if runtime:
        assert os.environ.get('CUDA_VISIBLE_DEVICES') == ''
        assert os.environ.get('HF_HUB_OFFLINE') == os.environ.get('TRANSFORMERS_OFFLINE') == '1'
        assert not (HERE / 'cpu_check.json').exists(), 'CPU_fit8_already_performed_no_retry'
        helper = prior.module('fit8_cpu_immutable_helper', bundle / 'support/run_pilot.py')
        assert {name: importlib.metadata.version(name) for name in helper.PINS} == helper.PINS
        from transformers import AutoTokenizer
        import torch
        assert not torch.cuda.is_initialized()
        tokenizer = AutoTokenizer.from_pretrained(helper.MODEL, revision=helper.REVISION, local_files_only=True, trust_remote_code=False)
        encoded = {}
        records = []
        for row in rows:
            item, prefix = helper.encode_training(tokenizer, row['messages'], context=8192)
            assert item['labels'][:prefix] == [-100] * prefix and item['labels'][prefix:] == item['input_ids'][prefix:]
            assert item['input_ids'][prefix:].count(tokenizer.eos_token_id) == 1
            assert len(helper.chat_token_ids(tokenizer, row['messages'][:-1], generation_prompt=True)) == prior.PROMPT_TOKENS[row['id']]
            assert prefix + runner.CAPS[row['id']] <= 8192
            encoded[row['id']] = item
            records.append(dict(case_id=row['id'], prompt_tokens=prefix, target_tokens=len(item['input_ids']) - prefix,
                                total_tokens=len(item['input_ids']), all_target_and_eos_supervised=True))
        consumer = load('fit8_preflight_consumer', HERE / 'consume_fit8.py')
        old, (v, native, Engine, semantic, prep) = consumer.owners(bundle, cmee_root)
        from cocolon_meaning_experience_engine.model_candidate_source import build_model_messages
        from cocolon_meaning_experience_engine.named_reference_wire import SCHEMA
        full = {row['case_id']: row for row in json.loads((bundle / 'archive/runtime/eval_inputs.json').read_text())}
        train = {row['id']: row for row in helper.read_jsonl(bundle / 'archive/runtime/train_messages.jsonl')}
        controls = []
        exact = 0
        for cid in runner.FULL_IDS:
            request, prior_snapshot = v.reconstruct_request({'native_case': native[cid]})
            assert build_model_messages(request, prior_snapshot, candidate_format=SCHEMA) == full[cid]['messages']
            ids = helper.chat_token_ids(tokenizer, full[cid]['messages'], generation_prompt=True)
            assert len(ids) + runner.CAPS[cid] <= 8192
            exact += 1
            target = train[cid]['messages'][-1]['content']
            item, prefix = helper.encode_training(tokenizer, train[cid]['messages'], context=8192)
            teacher = dict(raw_text=target, finish_reason='stop', provider='frozen_teacher_control',
                           model=helper.MODEL, revision=helper.REVISION, adapter_revision=plan['initial_adapter_sha256'],
                           usage={'prompt_tokens': prefix, 'completion_tokens': len(item['input_ids']) - prefix}, seconds=0.0)
            outcome, _ = consumer.read_raw(v, native, Engine, semantic, prep, cid, teacher)
            assert outcome['meaning_adopted'] and outcome['body_available'], 'full_teacher_control_failed:' + cid
            controls.append(dict(case_id=cid, source='FROZEN_TEACHER_CONTROL_NOT_MODEL', result=outcome))
            actual = json.loads((bundle / 'archive/run' / ('after_' + cid + '.jsonl')).read_text())
            assert actual['case_id'] == cid and actual['adapter_revision'] == plan['initial_adapter_sha256']
            assert hashlib.sha256(actual['raw_text'].encode()).hexdigest() == actual['raw_utf8_sha256']
            outcome, _ = consumer.read_raw(v, native, Engine, semantic, prep, cid, actual)
            controls.append(dict(case_id=cid, source='SAVED_2DFD_RAW_CURRENT_API_RECHECK_NOT_NEW_GENERATION', result=outcome))
        assert all(runner.sha(path) == digest for path, digest in bound.items()) and not torch.cuda.is_initialized()
        report.update(status='CPU_FIT8_READY_NO_MODEL', runtime_check_performed=True,
                      current_api_commit=plan['api_commit'], current_cmee_manifest_sha256=runner.sha(cmee_root / 'restore_payload.json'),
                      full2_messages_exact=exact, gold2_meaning_and_body=2,
                      baseline2_new_model_calls=0, tokenizer_records=records,
                      series_tokens=sum(len(encoded[cid]['input_ids']) for cid in runner.ORDER),
                      cuda_initialized=False, controls=controls)
    report['seconds'] = time.monotonic() - started
    destination = HERE / ('cpu_check.json' if runtime else 'static_cpu_check.json')
    assert not destination.exists(), 'fit8_cpu_report_already_exists'
    runner.write(destination, report)
    print(json.dumps({key: value for key, value in report.items() if key not in ('controls', 'tokenizer_records')}, ensure_ascii=False), flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--bundle-root', required=True, type=Path)
    parser.add_argument('--cmee-root', required=True, type=Path)
    parser.add_argument('--runtime-check', action='store_true')
    args = parser.parse_args()
    main(args.bundle_root.resolve(), args.cmee_root.resolve(), args.runtime_check)
