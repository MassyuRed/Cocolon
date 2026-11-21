"""Proposed finite current-prompt alignment trial; requires a new approval file."""
import argparse
import copy
import gc
import gzip
import hashlib
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
import importlib.util
import prompt_source_index as syntax
assert hashlib.sha256(Path('/workspace/cocolon_stage5_pack_20261030/consume_stage5.py').read_bytes()).hexdigest() == '92bf81c1ca52a72480753010efc911fc132c74f4208a533853feb70fc5650713', 'frozen_stage_source_changed'
_stage_spec = importlib.util.spec_from_file_location('aligned19_frozen_stage_gpu', '/workspace/cocolon_stage5_pack_20261030/consume_stage5.py')
stage = importlib.util.module_from_spec(_stage_spec)
sys.modules[_stage_spec.name] = stage
_stage_spec.loader.exec_module(stage)

W = Path('/workspace')
HERE = Path(__file__).resolve().parent
CPU = W / 'cocolon_aligned19_cpu_20261030'
PACK = W / 'cocolon_fixedrows5_pack_20261029'
OUT = W / 'cocolon_aligned19_run_20261030'
INITIAL = W / 'cocolon_stage5_run_20261030/adapter'

def execute(source_commit):
    plan = json.loads((HERE / 'proposal.json').read_text())
    approval = json.loads((HERE / 'approved_plan.json').read_text())
    stage.need(approval['status'] == 'MASH_EXPLICITLY_APPROVED_ONCE' and approval['proposal_sha256'] == stage.sha(HERE / 'proposal.json') and approval['proposal'] == plan, 'new_exact_proposal_approval_required')
    stage.need(plan['status'] == 'PROPOSED_NEEDS_NEW_MASH_APPROVAL', 'proposal_status')
    approval_digest = stage.sha(HERE / 'approved_plan.json')
    stage.need((plan['max_updates'], plan['max_model_loads'], plan['max_generations'], plan['max_gpu_process_seconds']) == (19, 2, 19, 2700), 'approved_envelope_changed')
    for name, digest in plan['source_sha256'].items():
        stage.need(stage.sha(HERE / name) == digest, 'source_identity:' + name)
    stage.need(type(source_commit) is str and len(source_commit) == 40 and all(c in '0123456789abcdef' for c in source_commit), 'source_commit_required')
    summary = json.loads((CPU / 'cpu_summary.json').read_text())
    stage.need(summary['status'] == 'CPU_ALIGNED19_READY_NO_MODEL' and summary['source_sha256'] == plan['source_sha256'], 'cpu_pass_required')
    stage.need(summary['proposal_sha256'] == stage.sha(HERE / 'proposal.json'), 'cpu_proposal_changed')
    stage.need(plan['stage_caps'] == stage.CAPS and plan['new_cases'] == stage.FULL, 'caps_or_new_cases_changed')
    stage.need(stage.sha(CPU / 'prepared_cpu.json.gz') == summary['prepared_sha256'], 'cpu_payload_changed')
    cpu = json.loads(gzip.decompress((CPU / 'prepared_cpu.json.gz').read_bytes()))
    stage.need(cpu['status'] == 'CPU_ALIGNED19_READY_NO_MODEL' and cpu['order'] == plan['update_order'], 'cpu_schedule_changed')
    stage.need(all(stage.sha(p) == h for p, h in cpu['frozen'].items()), 'frozen_changed_before_model')
    parent = (Path('/proc') / str(os.getppid()) / 'cmdline').read_bytes().split(bytes([0]))
    stage.need(parent[0].rsplit(b'/', 1)[-1] == b'timeout' and
               all(v in parent for v in [b'--signal=TERM', b'--kill-after=10s', b'2690s']), 'bounded_parent_required')
    loader = stage.load('stage5_frozen_loader', PACK / 'run_fixed_rows5.py')
    _, prior, helper, bound = loader.owners()
    stage.need(all(stage.sha(p) == h for p, h in bound.items()), 'old_owner_changed')
    stage.need(stage.sha(INITIAL / 'adapter_model.safetensors') == plan['initial_adapter_sha256'], 'initial_changed')
    stage.need(os.environ.get('HF_HUB_OFFLINE') == os.environ.get('TRANSFORMERS_OFFLINE') == '1', 'offline_required')
    OUT.mkdir(exist_ok=False)
    started = time.monotonic()
    deadline = started + 2700
    report = dict(status='STARTED_ONCE', source_commit=source_commit, plan=plan, started_unix=time.time(),
                  approval=approval, approval_sha256=approval_digest, experimental_initial_not_adopted=True,
                  model_loads_started=0, model_loads_completed=0, training_forwards_started=0,
                  training_forwards_completed=0, optimizer_steps_started=0, optimizer_steps_completed=0,
                  model_calls_started=0, model_calls_completed=0, calls=[], cases=[],
                  retry=False, automatic_progression=False, product_credit=0)
    model = optimizer = trainable = initial = ids = labels = loss = original_generate = generate = None
    def checkpoint():
        report['elapsed_seconds'] = time.monotonic() - started
        stage.write(OUT / 'run.json', report)
    def stop(*args):
        raise TimeoutError('stage5_deadline_no_retry')
    signal.signal(signal.SIGTERM, stop)
    signal.signal(signal.SIGALRM, stop)
    signal.setitimer(signal.ITIMER_REAL, 2700)
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
        model, tensors = owner.load_expanded_adapter(helper, INITIAL, helper.adapter_hashes(INITIAL), trainable=True)
        report['model_loads_completed'] = 1
        stage.write(OUT / 'initial_loaded_tensors.json', tensors)
        trainable = [(n, p) for n, p in model.named_parameters() if p.requires_grad]
        stage.need(len(trainable) == 112, 'trainable_scope_changed')
        initial = {n: p.detach().cpu().clone() for n, p in trainable}
        random.seed(20261024)
        torch.manual_seed(20261024)
        torch.cuda.manual_seed_all(20261024)
        model.config.use_cache = False
        model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={'use_reentrant': False})
        model.enable_input_require_grads()
        model.train()
        optimizer = torch.optim.AdamW([p for _, p in trainable], lr=5e-5, weight_decay=0.)
        with (OUT / 'training.jsonl').open('x') as stream:
            for step, cid in enumerate(plan['update_order'], 1):
                stage.need(time.monotonic() < deadline - 5 and step <= 19, 'deadline_or_update_limit')
                item = cpu['encoded'][cid]
                ids = torch.tensor([item['input_ids']], dtype=torch.long, device='cuda:0')
                labels = torch.tensor([item['labels']], dtype=torch.long, device='cuda:0')
                optimizer.zero_grad(set_to_none=True)
                report['training_forwards_started'] = step
                checkpoint()
                loss = helper.teacher_loss(model, input_ids=ids, attention_mask=torch.ones_like(ids), labels=labels, encoded=item)
                report['training_forwards_completed'] = step
                stage.need(torch.isfinite(loss).item(), 'nonfinite_loss')
                loss.backward()
                norm = float(torch.nn.utils.clip_grad_norm_([p for _, p in trainable], 1., error_if_nonfinite=True).cpu())
                stage.need(math.isfinite(norm) and norm > 0, 'invalid_gradient')
                report['optimizer_steps_started'] = step
                checkpoint()
                optimizer.step()
                report['optimizer_steps_completed'] = step
                stream.write(json.dumps(dict(step=step, id=cid, loss=float(loss.detach().cpu()), gradient_norm=norm,
                                             target_tokens=sum(v != -100 for v in item['labels']),
                                             loss_type='complete_assistant_plus_eos_ce')) + '\n')
                stream.flush()
                ids = labels = loss = None
                checkpoint()
        optimizer.zero_grad(set_to_none=True)
        optimizer = None
        stage.need(all(torch.isfinite(p).all().item() for _, p in trainable), 'nonfinite_weights')
        report['changed_tensors'] = sum(not torch.equal(initial[n], p.detach().cpu()) for n, p in trainable)
        stage.need(report['changed_tensors'] > 0, 'no_weight_change')
        model.save_pretrained(OUT / 'adapter', safe_serialization=True)
        report['adapter_sha256'] = helper.adapter_hashes(OUT / 'adapter')
        checkpoint()
        model = trainable = initial = None
        gc.collect()
        torch.cuda.empty_cache()
        report['model_loads_started'] = 2
        checkpoint()
        model, tensors = owner.load_expanded_adapter(helper, OUT / 'adapter', report['adapter_sha256'], trainable=False)
        stage.need(not model.training and not any(p.requires_grad for p in model.parameters()), 'nontraining_reload_required')
        report['model_loads_completed'] = 2
        stage.write(OUT / 'reloaded_tensors.json', tensors)
        adapter = report['adapter_sha256']['adapter_model.safetensors']
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
        stage.need(helper.adapter_hashes(OUT / 'adapter') == report['adapter_sha256'], 'inference_changed_weights')
        report['status'] = 'MACHINE_COMPLETE_PENDING_ROOT_CONTENT_REVIEW'
    except BaseException as exc:
        report.update(status='STOPPED_NOT_ADOPTED_NO_RETRY', error_type=type(exc).__name__, reason=str(exc), traceback=traceback.format_exc())
        if model is not None and report['optimizer_steps_started'] and 'adapter_sha256' not in report:
            try:
                optimizer = ids = labels = loss = None
                gc.collect()
                model.save_pretrained(OUT / 'partial_adapter', safe_serialization=True)
                report['partial_adapter_not_adopted'] = True
            except BaseException as save_error:
                report['partial_adapter_preservation_error'] = str(save_error)
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
            stage.need(all(stage.sha(p) == h for p, h in cpu['frozen'].items()) and stage.sha(HERE / 'approved_plan.json') == approval_digest, 'frozen_or_approval_changed')
            if 'adapter_sha256' in report:
                stage.need(helper.adapter_hashes(OUT / 'adapter') == report['adapter_sha256'], 'new_adapter_changed')
            report['frozen_inputs_and_initial_weights_unchanged'] = True
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
