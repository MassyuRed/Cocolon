"""Mash-approved once: saved weights, no training, revised staged prompts, existing CMEE/cold."""
import argparse
import copy
import gc
import gzip
import importlib.metadata
import json
import math
import os
from pathlib import Path
import random
import signal
import sys
import time
import traceback
from unittest.mock import patch
sys.dont_write_bytecode = True
import hashlib
import importlib.util
import prompt_stage_only as syntax
STAGE_FILE = Path('/workspace/cocolon_stage5_pack_20261030/consume_stage5.py')
STAGE_SHA = '92bf81c1ca52a72480753010efc911fc132c74f4208a533853feb70fc5650713'
assert hashlib.sha256(STAGE_FILE.read_bytes()).hexdigest() == STAGE_SHA, 'frozen_stage_source_changed'
_spec = importlib.util.spec_from_file_location('frozen_instruction_stage', STAGE_FILE)
stage = importlib.util.module_from_spec(_spec)
sys.modules[_spec.name] = stage
_spec.loader.exec_module(stage)

W = Path('/workspace')
HERE = Path(__file__).resolve().parent
CPU = W / 'cocolon_stage5_prepared_20261030'
PACK = W / 'cocolon_fixedrows5_pack_20261029'
OUT = W / 'cocolon_instruction_probe_run_20261030'
INITIAL = W / 'cocolon_stage5_run_20261030/adapter'
CHECK = W / 'cocolon_stage5_instruction_final_20261030'
CHECK_SOURCE = W / 'cocolon_stage5_instruction_final_pack_20261030'

def execute(source_commit):
    plan = json.loads((HERE / 'plan.json').read_text())
    stage.need(plan['status'] == 'MASH_EXPLICITLY_APPROVED_ONCE', 'explicit_instruction_probe_approval_required')
    stage.need((plan['max_updates'], plan['max_model_loads'], plan['max_total_model_calls'], plan['max_gpu_process_seconds']) == (0, 1, 19, 1800), 'approved_envelope_changed')
    for name, digest in plan['source_sha256'].items():
        stage.need(stage.sha(HERE / name) == digest, 'source_identity:' + name)
    stage.need(type(source_commit) is str and len(source_commit) == 40 and all(c in '0123456789abcdef' for c in source_commit), 'source_commit_required')
    summary = json.loads((CHECK / 'report.json').read_text())
    stage.need(summary['status'] == 'CPU_INSTRUCTION_CONSISTENCY_CONFIRMED_NOT_MODEL_IMPROVEMENT', 'cpu_pass_required')
    stage.need(summary['source_sha256']['prompt_stage_only.py'] == plan['prompt_source_sha256'] == stage.sha(HERE / 'prompt_stage_only.py'), 'prompt_identity')
    stage.need(summary['source_sha256']['check_once.py'] == plan['cpu_check_source_sha256'] == stage.sha(CHECK_SOURCE / 'check_once.py'), 'cpu_source_identity')
    stage.need(plan['stage_caps'] == stage.CAPS and plan['new_cases'] == stage.FULL, 'stage_caps_or_cases_changed')
    prior_summary = json.loads((CPU / 'cpu_summary.json').read_text())
    stage.need(stage.sha(CPU / 'prepared_cpu.json.gz') == prior_summary['prepared_sha256'], 'old_cpu_payload_changed')
    cpu = json.loads(gzip.decompress((CPU / 'prepared_cpu.json.gz').read_bytes()))
    stage.need(cpu['status'] == 'CPU_STAGE5_READY_NO_MODEL', 'cpu_payload_status')
    stage.need(all(stage.sha(p) == h for p, h in cpu['frozen'].items()), 'frozen_changed_before_model')
    extra_paths = [HERE / 'plan.json', CHECK / 'report.json', CHECK_SOURCE / 'check_once.py',
                   INITIAL / 'adapter_model.safetensors', INITIAL / 'adapter_config.json',
                   STAGE_FILE, *[HERE / n for n in plan['source_sha256']]]
    prior_run = json.loads((INITIAL.parent / 'run.json').read_text())
    stage.need(prior_run['status'] == 'STOPPED_NOT_ADOPTED_NO_RETRY' and
               prior_run['adapter_sha256']['adapter_model.safetensors'] == plan['saved_adapter_sha256'], 'prior_run_identity')
    extra_paths.append(INITIAL.parent / 'run.json')
    for call in prior_run['calls']:
        path = INITIAL.parent / call['path']
        stage.need(stage.sha(path) == call['raw_sha256'], 'before_raw_changed')
        extra_paths.extend([path, path.with_name(path.name + '.messages.json')])
    extra_frozen = {str(p): stage.sha(p) for p in extra_paths}
    parent = (Path('/proc') / str(os.getppid()) / 'cmdline').read_bytes().split(bytes([0]))
    stage.need(parent[0].rsplit(b'/', 1)[-1] == b'timeout' and
               all(v in parent for v in [b'--signal=TERM', b'--kill-after=10s', b'1790s']), 'bounded_parent_required')
    loader = stage.load('stage5_frozen_loader', PACK / 'run_fixed_rows5.py')
    _, prior, helper, bound = loader.owners()
    stage.need(all(stage.sha(p) == h for p, h in bound.items()), 'old_owner_changed')
    stage.need(stage.sha(INITIAL / 'adapter_model.safetensors') == plan['saved_adapter_sha256'], 'initial_changed')
    stage.need(os.environ.get('HF_HUB_OFFLINE') == os.environ.get('TRANSFORMERS_OFFLINE') == '1', 'offline_required')
    OUT.mkdir(exist_ok=False)
    started = time.monotonic()
    deadline = started + 1800
    report = dict(status='STARTED_ONCE', source_commit=source_commit, plan=plan, started_unix=time.time(),
                  model_loads_started=0, model_loads_completed=0, training_forwards_started=0,
                  training_forwards_completed=0, optimizer_steps_started=0, optimizer_steps_completed=0,
                  model_calls_started=0, model_calls_completed=0, calls=[], cases=[],
                  retry=False, automatic_progression=False, product_credit=0)
    model = optimizer = trainable = initial = ids = labels = loss = original_generate = generate = None
    def checkpoint():
        report['elapsed_seconds'] = time.monotonic() - started
        stage.write(OUT / 'run.json', report)
    def stop(*args):
        raise TimeoutError('instruction_probe_deadline_no_retry')
    signal.signal(signal.SIGTERM, stop)
    signal.signal(signal.SIGALRM, stop)
    signal.setitimer(signal.ITIMER_REAL, 1800)
    checkpoint()
    try:
        import torch
        from transformers import AutoTokenizer, StoppingCriteria, StoppingCriteriaList
        stage.need({n: importlib.metadata.version(n) for n in helper.PINS} == helper.PINS == cpu['dependencies'], 'dependency_changed')
        stage.need(os.environ.get('RUNPOD_POD_ID') == 'vgkm402msgroiu' and torch.cuda.device_count() == 1, 'pod_changed')
        report['gpu'] = helper.gpu_profile(torch, {'minimum_free_gib': 14})
        stage.need(report['gpu']['name'] == 'NVIDIA RTX A5000', 'gpu_changed')
        torch.cuda.reset_peak_memory_stats()
        tokenizer = AutoTokenizer.from_pretrained(helper.MODEL, revision=helper.REVISION, local_files_only=True, trust_remote_code=False)
        recovery = prior.module('stage5_adapter_owner', loader.BUNDLE / 'support/run_expanded15_recovery.py')
        recovery.OLDPACK = loader.BUNDLE / 'support'
        recovery.ORIGIN = loader.BUNDLE / 'archive/run'
        owner, _, _ = recovery.owner_with_checked_suffixes()
        report['model_loads_started'] = 1
        checkpoint()
        model, tensors = owner.load_expanded_adapter(helper, INITIAL, helper.adapter_hashes(INITIAL), trainable=False)
        stage.need(not model.training and not any(p.requires_grad for p in model.parameters()), 'nontraining_load_required')
        report['model_loads_completed'] = 1
        stage.write(OUT / 'loaded_tensors.json', tensors)
        report['adapter_sha256'] = helper.adapter_hashes(INITIAL)
        stage.need(report['adapter_sha256']['adapter_model.safetensors'] == plan['saved_adapter_sha256'], 'loaded_weight_identity')
        stage.write(OUT / 'extra_frozen.json', extra_frozen)
        checkpoint()
        adapter = plan['saved_adapter_sha256']
        cases = cpu['original_cases']
        stage.need([c['case_id'] for c in cases] == plan['evaluation_order'], 'eval_order_changed')
        visible = os.environ.get('CUDA_VISIBLE_DEVICES')
        try:
            consumer = stage.load('stage5_existing_consumer_gpu', PACK / 'consume_fixed_rows5.py')
            own = consumer.owners(loader.ROOT)
        finally:
            if visible is None: os.environ.pop('CUDA_VISIBLE_DEVICES', None)
            else: os.environ['CUDA_VISIBLE_DEVICES'] = visible
        cmee_out = OUT / 'cmee'
        cmee_out.mkdir()
        diagnosis = dict(cases=[], provenance=[], product_credit=0, automatic_progression=False)

        def infer(case, filename):
            nonlocal original_generate, generate
            stage.need(time.monotonic() < deadline - 5 and report['model_calls_started'] < 19, 'deadline_or_call_limit')
            prefix = helper.chat_token_ids(tokenizer, case['messages'], generation_prompt=True)
            stage.need(len(prefix) + case['max_new_tokens'] <= 8192, 'live_context_exceeded_no_truncation')
            stop_at = min(deadline, time.monotonic() + 180)
            triggered = False
            original_generate = model.generate
            class Bounded(StoppingCriteria):
                def __call__(self, *args, **kwargs):
                    nonlocal triggered
                    triggered = time.monotonic() >= stop_at
                    return triggered
            def generate(*args, **kwargs):
                kwargs['stopping_criteria'] = StoppingCriteriaList([*list(kwargs.get('stopping_criteria') or []), Bounded()])
                return original_generate(*args, **kwargs)
            path = OUT / filename
            stage.write(OUT / (filename + '.messages.json'), case['messages'])
            report['model_calls_started'] += 1
            checkpoint()
            signal.setitimer(signal.ITIMER_REAL, max(0.001, stop_at - time.monotonic()))
            with patch.object(model, 'generate', generate):
                helper.evaluate(model, tokenizer, [case], path,
                                {'context_tokens': 8192, 'max_new_tokens': case['max_new_tokens']}, adapter_revision=adapter)
            signal.setitimer(signal.ITIMER_REAL, max(0.001, deadline - time.monotonic()))
            raw = helper.read_jsonl(path)[0]
            stage.need(raw['input_tokens'] == len(prefix), 'actual_prefix_count_changed')
            report['model_calls_completed'] += 1
            report['calls'].append(dict(case_id=case['case_id'], path=path.name, raw_sha256=stage.sha(path),
                                        messages_sha256=stage.text_sha(stage.compact(case['messages'])),
                                        adapter_sha256=adapter, output_tokens=raw['output_tokens'],
                                        eos_reached=raw['eos_reached'], seconds=raw['seconds'], timeout_triggered=triggered))
            checkpoint()
            stage.need(not triggered and time.monotonic() < stop_at, 'call_deadline_no_retry')
            original_generate = generate = None
            return raw

        for case in cases[:2]:
            cid = case['case_id']
            previous = []
            records = []
            failed = None
            for number in range(1, 6):
                messages = syntax.build_messages(case['messages'], number, previous)
                single = dict(case_id=cid + '/stage' + str(number), messages=messages, max_new_tokens=stage.CAPS[cid][number - 1])
                raw = infer(single, 'stage' + str(number) + '_' + cid + '.jsonl')
                record = dict(case_id=cid, stage=number, messages=messages, messages_sha256=stage.text_sha(stage.compact(messages)), raw=raw)
                records.append(record)
                stage.write(OUT / (cid + '_stages.json'), records)
                try:
                    stage.need(raw['finish_reason'] == 'stop' and raw['eos_reached'] is True, 'stage_not_finished')
                    values = stage.stage_values(raw['raw_text'], number)
                except (ValueError, TypeError, KeyError) as exc:
                    failed = dict(stage=number, reason=str(exc), finish_reason=raw['finish_reason'])
                    break
                previous.append(dict(stage=number, values=values))
            if failed is not None:
                item = dict(case_id=cid, meaning_adopted=False, body_available=False,
                            cold_file_status='NO_ADOPTED_SNAPSHOT', stage_failure=failed, new_cmee_calls=0)
            else:
                projected = syntax.project(stage, cid, case['messages'], records)
                stage.write(OUT / (cid + '_derived_projection.json'), projected)
                item, saved = consumer.read_raw(own, cid, projected)
                if saved is not None:
                    diagnosis['provenance'].append(dict(case_id=cid, **stage.verify_snapshot_receipt(item, saved, projected)))
                    consumer.save_cold(loader.ROOT, own, cid, item, saved, cmee_out)
                    stage.verify_snapshot_receipt(item, json.loads((cmee_out / (cid + '_saved.json')).read_text()), projected)
            diagnosis['cases'].append(item)
            report['cases'].append(dict(case_id=cid, stages_completed=len(records), stage_failure=failed,
                                        meaning_adopted=item['meaning_adopted'], body_available=item['body_available']))
            stage.write(cmee_out / 'diagnosis.json', diagnosis)
            checkpoint()
        stage.need(len(diagnosis['cases']) == 2 and all(c['meaning_adopted'] and c['body_available'] and
                   c['cold_file_status'] == 'COLD_FULL_OUTCOME_IDENTICAL' for c in diagnosis['cases']),
                   'new_pair_failed_skip_old9_no_retry')
        for case in cases[2:]:
            raw = infer(case, 'after_' + case['case_id'] + '.jsonl')
            item, saved = consumer.read_raw(own, case['case_id'], raw, fixed=False)
            consumer.save_cold(loader.ROOT, own, case['case_id'], item, saved, cmee_out)
            diagnosis['cases'].append(item)
            stage.write(cmee_out / 'diagnosis.json', diagnosis)
        stage.need(len(diagnosis['cases']) == 11 and all(c['meaning_adopted'] and c['body_available'] and
                   c['cold_file_status'] == 'COLD_FULL_OUTCOME_IDENTICAL' for c in diagnosis['cases']),
                   'old9_regression_no_retry')
        stage.need(helper.adapter_hashes(INITIAL) == report['adapter_sha256'], 'inference_changed_weights')
        report['status'] = 'MACHINE_COMPLETE_PENDING_ROOT_CONTENT_REVIEW'
    except BaseException as exc:
        report.update(status='STOPPED_NOT_ADOPTED_NO_RETRY', error_type=type(exc).__name__, reason=str(exc), traceback=traceback.format_exc())
    finally:
        original_generate = generate = model = optimizer = trainable = initial = ids = labels = loss = None
        gc.collect()
        if 'torch' in sys.modules and sys.modules['torch'].cuda.is_initialized():
            t = sys.modules['torch']
            report['peak_allocated_bytes'] = t.cuda.max_memory_allocated()
            report['peak_reserved_bytes'] = t.cuda.max_memory_reserved()
            t.cuda.empty_cache()
            report['post_release_allocated_bytes'] = t.cuda.memory_allocated()
        try:
            stage.need(all(stage.sha(p) == h for p, h in cpu['frozen'].items()), 'frozen_changed')
            if 'adapter_sha256' in report:
                stage.need(helper.adapter_hashes(INITIAL) == report['adapter_sha256'], 'new_adapter_changed')
            stage.need(all(stage.sha(p) == h for p, h in extra_frozen.items()), 'execution_sources_or_before_changed')
            report['frozen_inputs_and_saved_weights_unchanged'] = True
        except BaseException as exc:
            report.update(status='STOPPED_IDENTITY_UNVERIFIED_NO_RETRY', identity_error=str(exc))
        signal.setitimer(signal.ITIMER_REAL, 0)
        report['processing_seconds'] = time.monotonic() - started
        report['process_cost_usd'] = report['processing_seconds'] * .28 / 3600
        checkpoint()
    print(stage.compact({k: report.get(k) for k in ['status', 'model_loads_completed', 'optimizer_steps_completed',
                                                   'model_calls_completed', 'processing_seconds', 'process_cost_usd', 'reason']}), flush=True)
    return 0 if report['status'] == 'MACHINE_COMPLETE_PENDING_ROOT_CONTENT_REVIEW' else 1

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--source-commit')
    args = parser.parse_args()
    if not args.execute:
        parser.error('explicit --execute required')
    raise SystemExit(execute(args.source_commit))
