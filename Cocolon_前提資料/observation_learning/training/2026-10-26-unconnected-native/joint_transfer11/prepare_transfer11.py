"""Check fixed training/evaluation messages, token labels and actual CMEE teachers on CPU."""
import argparse
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
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


def main(bundle, initial_adapter, cmee_root, runtime):
    started = time.monotonic()
    runner = load('transfer11_cpu_runner', HERE / 'run_transfer11.py')
    plan, prior, rows, bound = runner.validate(bundle, initial_adapter)
    report = dict(status='CPU_STATIC_TRANSFER11_NO_MODEL', optimizer_steps=11,
        training_order=runner.ORDER, original19_and_eval_unchanged=True,
        initial_adapter_sha256=plan['initial_adapter_sha256'], model_calls_planned=11,
        pretrained_model_loads=0, model_forwards=0, generations=0, sql_operations=0)
    if runtime:
        assert os.environ.get('CUDA_VISIBLE_DEVICES') == ''
        assert os.environ.get('HF_HUB_OFFLINE') == os.environ.get('TRANSFORMERS_OFFLINE') == '1'
        assert not (HERE / 'cpu_check.json').exists(), 'CPU_already_performed'
        helper = load('transfer11_cpu_helper', bundle / 'support/run_pilot.py')
        assert {k:importlib.metadata.version(k) for k in helper.PINS} == helper.PINS
        import torch
        from transformers import AutoTokenizer
        assert not torch.cuda.is_initialized()
        tokenizer = AutoTokenizer.from_pretrained(helper.MODEL, revision=helper.REVISION,
            local_files_only=True, trust_remote_code=False)
        by_id = {row['id']:row for row in rows}
        encoded = {}
        records = []
        for cid in dict.fromkeys(runner.ORDER):
            row = by_id[cid]
            item, prefix = helper.encode_training(tokenizer, row['messages'], context=8192)
            assert item['labels'][:prefix] == [-100] * prefix
            assert item['labels'][prefix:] == item['input_ids'][prefix:]
            assert item['input_ids'][prefix:].count(tokenizer.eos_token_id) == 1
            encoded[cid] = item
            records.append(dict(case_id=cid,prompt_tokens=prefix,target_tokens=len(item['input_ids'])-prefix,
                total_tokens=len(item['input_ids']),all_target_and_eos_supervised=True))
        consumer = load('transfer11_cpu_consumer', HERE / 'consume_transfer11.py')
        old, (v,native,Engine,semantic,prep) = consumer.owners(bundle,cmee_root)
        from cocolon_meaning_experience_engine.model_candidate_source import build_model_messages
        from cocolon_meaning_experience_engine.named_reference_wire import SCHEMA
        evaluation = {x['case_id']:x for x in json.loads((bundle/'archive/runtime/eval_inputs.json').read_text())}
        controls = []
        for cid in runner.FULL_IDS + runner.OLD_IDS:
            request, prior_snapshot = v.reconstruct_request({'native_case':native[cid]})
            fmt = SCHEMA if cid in runner.FULL_IDS else prep.QUOTE_CANDIDATE_SCHEMA
            assert build_model_messages(request,prior_snapshot,candidate_format=fmt) == evaluation[cid]['messages']
            prefix = len(helper.chat_token_ids(tokenizer,evaluation[cid]['messages'],generation_prompt=True))
            assert prefix + runner.CAPS[cid] <= 8192
            target = by_id[cid]['messages'][-1]['content']
            item, label_prefix = helper.encode_training(tokenizer,by_id[cid]['messages'],context=8192)
            assert prefix == label_prefix
            raw = dict(raw_text=target,finish_reason='stop',provider='frozen_teacher_control',
                model=helper.MODEL,revision=helper.REVISION,adapter_revision=plan['initial_adapter_sha256'],
                usage={'prompt_tokens':prefix,'completion_tokens':len(item['input_ids'])-prefix},seconds=0.)
            outcome, _ = consumer.read_raw(v,native,Engine,semantic,prep,cid,raw)
            assert outcome['meaning_adopted'] and outcome['body_available'], 'teacher_failed:'+cid
            controls.append(dict(case_id=cid,source='FROZEN_TEACHER_CONTROL_NOT_MODEL',format=fmt,
                prompt_tokens=prefix,max_new_tokens=runner.CAPS[cid],result=outcome))
        assert all(runner.sha(p)==h for p,h in bound.items()) and not torch.cuda.is_initialized()
        report.update(status='CPU_TRANSFER11_READY_NO_MODEL',current_api_commit=plan['api_commit'],
            current_cmee_manifest_sha256=runner.sha(cmee_root/'restore_payload.json'),evaluation_messages_exact=11,
            gold11_meaning_and_body=11,tokenizer_records=records,controls=controls,
            series_tokens=sum(len(encoded[cid]['input_ids']) for cid in runner.ORDER),cuda_initialized=False)
    report['seconds'] = time.monotonic()-started
    target = HERE / ('cpu_check.json' if runtime else 'static_cpu_check.json')
    assert not target.exists()
    runner.write(target,report)
    print(json.dumps({k:v for k,v in report.items() if k not in ['controls','tokenizer_records']},ensure_ascii=False),flush=True)


if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--bundle-root',required=True,type=Path)
    parser.add_argument('--initial-adapter',required=True,type=Path)
    parser.add_argument('--cmee-root',required=True,type=Path)
    parser.add_argument('--runtime-check',action='store_true')
    args=parser.parse_args()
    main(args.bundle_root.resolve(),args.initial_adapter.resolve(),args.cmee_root.resolve(),args.runtime_check)
