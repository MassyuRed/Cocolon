"""A separately approved single rehearsal13 run; no model effects while proposed."""
import argparse
import gc
import gzip
import hashlib
import importlib.metadata
import importlib.util
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
W = Path('/workspace')
HERE = Path(__file__).resolve().parent
CPU = W / 'cocolon_rehearsal13_cpu_20261029'
PACK = W / 'cocolon_fixedrows5_pack_20261029'
OUT = W / 'cocolon_rehearsal13_run_20261029'

def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def need(ok, reason):
    if not ok:
        raise ValueError(reason)

def write(p, value):
    p = Path(p)
    tmp = p.with_suffix(p.suffix + '.tmp')
    tmp.write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + '\n')
    tmp.replace(p)

def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module

def execute(source):
    plan = json.loads((HERE / 'plan.json').read_text())
    need(plan['status'] == 'MASH_EXPLICITLY_APPROVED_ONCE', 'separate_rehearsal13_approval_required')
    need((plan['max_updates'], plan['max_model_loads'], plan['max_generations'], plan['max_process_seconds']) ==
         (13, 2, 11, 2700), 'approved_envelope_changed')
    need(sha(__file__) == plan['runner_sha256'], 'runner_identity_changed')
    need(len(source) == 40 and all(c in '0123456789abcdef' for c in source), 'source_commit_required')
    need(sha(CPU / 'prepared_cpu.json.gz') == plan['prepared_cpu_sha256'], 'cpu_identity_changed')
    cpu = json.loads(gzip.decompress((CPU / 'prepared_cpu.json.gz').read_bytes()))
    need(cpu['status'] == 'CPU_REHEARSAL13_READY_NO_MODEL' and cpu['order'] == plan['update_order'], 'cpu_or_schedule_changed')
    need(all(sha(p) == h for p, h in cpu['frozen'].items()), 'frozen_changed')
    prior_runner = load('rehearsal13_frozen_loader', PACK / 'run_fixed_rows5.py')
    _, prior, helper, bound = prior_runner.owners()
    need(all(sha(p) == h for p, h in bound.items()), 'old_source_changed')
    need(helper.MODEL == plan['model'] and helper.REVISION == plan['revision'] and
         prior_runner.INITIAL_SHA == plan['initial_adapter_sha256'], 'model_or_adapter_changed')
    need(sha(CPU / 'train_messages11.jsonl') == plan['train_messages_sha256'] and
         sha(CPU / 'eval_inputs11.json') == plan['eval_inputs_sha256'], 'messages_changed')
    parent = (Path('/proc') / str(os.getppid()) / 'cmdline').read_bytes().split(bytes([0]))
    need(parent[0].rsplit(b'/', 1)[-1] == b'timeout' and
         all(v in parent for v in (b'--signal=TERM', b'--kill-after=10s', b'2690s')), 'bounded_parent_required')
    OUT.mkdir(exist_ok=False)
    started = time.monotonic()
    deadline = started + 2700
    report = dict(status='STARTED_ONCE', source_commit=source, plan=plan, started_unix=time.time(),
                  model_loads_started=0, model_loads_completed=0, optimizer_steps_started=0,
                  optimizer_steps_completed=0, training_forwards_completed=0,
                  model_calls_started=0, model_calls_completed=0, calls=[],
                  retry=False, automatic_progression=False, product_credit=0)
    model = optimizer = trainable = initial = ids = labels = loss = original_generate = generate = None
    def checkpoint():
        report['elapsed_seconds'] = time.monotonic() - started
        write(OUT / 'run.json', report)
    def stop(*args):
        raise TimeoutError('rehearsal13_deadline_no_retry')
    signal.signal(signal.SIGTERM, stop)
    signal.signal(signal.SIGALRM, stop)
    signal.setitimer(signal.ITIMER_REAL, 2700)
    checkpoint()
    try:
        need(os.environ.get('HF_HUB_OFFLINE') == os.environ.get('TRANSFORMERS_OFFLINE') == '1', 'offline_required')
        import torch
        from transformers import AutoTokenizer, StoppingCriteria, StoppingCriteriaList
        need({n: importlib.metadata.version(n) for n in helper.PINS} == helper.PINS == cpu['dependencies'], 'dependency_changed')
        need(os.environ.get('RUNPOD_POD_ID') == 'vgkm402msgroiu' and torch.cuda.device_count() == 1, 'pod_changed')
        report['gpu'] = helper.gpu_profile(torch, {'minimum_free_gib': 14})
        need(report['gpu']['name'] == 'NVIDIA RTX A5000', 'gpu_changed')
        torch.cuda.reset_peak_memory_stats()
        tokenizer = AutoTokenizer.from_pretrained(helper.MODEL, revision=helper.REVISION,
                                                 local_files_only=True, trust_remote_code=False)
        recovery = prior.module('rehearsal13_adapter_owner', prior_runner.BUNDLE / 'support/run_expanded15_recovery.py')
        recovery.OLDPACK = prior_runner.BUNDLE / 'support'
        recovery.ORIGIN = prior_runner.BUNDLE / 'archive/run'
        owner, _, _ = recovery.owner_with_checked_suffixes()
        report['model_loads_started'] = 1
        checkpoint()
        model, tensors = owner.load_expanded_adapter(helper, prior_runner.INITIAL,
                                                     helper.adapter_hashes(prior_runner.INITIAL), trainable=True)
        report['model_loads_completed'] = 1
        write(OUT / 'initial_loaded_tensors.json', tensors)
        trainable = [(n, p) for n, p in model.named_parameters() if p.requires_grad]
        need(len(trainable) == 112, 'trainable_scope_changed')
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
                need(time.monotonic() < deadline - 5 and step <= 13, 'deadline_or_update_limit')
                item = cpu['encoded'][cid]
                ids = torch.tensor([item['input_ids']], dtype=torch.long, device='cuda:0')
                labels = torch.tensor([item['labels']], dtype=torch.long, device='cuda:0')
                optimizer.zero_grad(set_to_none=True)
                loss = helper.teacher_loss(model, input_ids=ids, attention_mask=torch.ones_like(ids), labels=labels, encoded=item)
                report['training_forwards_completed'] = step
                need(torch.isfinite(loss).item(), 'nonfinite_loss')
                loss.backward()
                norm = float(torch.nn.utils.clip_grad_norm_([p for _, p in trainable], 1., error_if_nonfinite=True).cpu())
                need(math.isfinite(norm) and norm > 0, 'invalid_gradient')
                report['optimizer_steps_started'] = step
                checkpoint()
                optimizer.step()
                report['optimizer_steps_completed'] = step
                stream.write(json.dumps(dict(step=step, id=cid, loss=float(loss.detach().cpu()),
                                             gradient_norm=norm, target_tokens=sum(v != -100 for v in item['labels']),
                                             loss_type='complete_assistant_plus_eos_ce')) + '\n')
                stream.flush()
                ids = labels = loss = None
                checkpoint()
        optimizer.zero_grad(set_to_none=True)
        optimizer = None
        need(all(torch.isfinite(p).all().item() for _, p in trainable), 'nonfinite_weights')
        report['changed_tensors'] = sum(not torch.equal(initial[n], p.detach().cpu()) for n, p in trainable)
        need(report['changed_tensors'] > 0, 'no_weight_change')
        model.save_pretrained(OUT / 'adapter', safe_serialization=True)
        report['adapter_sha256'] = helper.adapter_hashes(OUT / 'adapter')
        checkpoint()
        model = trainable = initial = None
        gc.collect()
        torch.cuda.empty_cache()
        report['model_loads_started'] = 2
        checkpoint()
        model, tensors = owner.load_expanded_adapter(helper, OUT / 'adapter', report['adapter_sha256'], trainable=False)
        need(not model.training and not any(p.requires_grad for p in model.parameters()), 'nontraining_reload_required')
        report['model_loads_completed'] = 2
        write(OUT / 'reloaded_tensors.json', tensors)
        cases = json.loads((CPU / 'eval_inputs11.json').read_text())
        need([c['case_id'] for c in cases] == plan['evaluation_order'], 'evaluation_order_changed')
        for case in cases:
            need(time.monotonic() < deadline - 5 and report['model_calls_started'] < 11, 'deadline_or_call_limit')
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
            path = OUT / ('after_' + case['case_id'] + '.jsonl')
            report['model_calls_started'] += 1
            checkpoint()
            with patch.object(model, 'generate', generate):
                helper.evaluate(model, tokenizer, [case], path,
                                {'context_tokens': 8192, 'max_new_tokens': case['max_new_tokens']},
                                adapter_revision=report['adapter_sha256']['adapter_model.safetensors'])
            raw = helper.read_jsonl(path)[0]
            report['model_calls_completed'] += 1
            report['calls'].append(dict(phase='after', case_id=case['case_id'], path=path.name,
                                        raw_sha256=sha(path), adapter_sha256=report['adapter_sha256']['adapter_model.safetensors'],
                                        eos_reached=raw['eos_reached'],
                                        output_tokens=raw['output_tokens'], seconds=raw['seconds'], timeout_triggered=triggered))
            checkpoint()
            need(not triggered and time.monotonic() < stop_at, 'call_deadline_no_retry')
            original_generate = generate = None
        need(helper.adapter_hashes(OUT / 'adapter') == report['adapter_sha256'], 'inference_changed_weights')
        need(sha(prior_runner.INITIAL / 'adapter_model.safetensors') == prior_runner.INITIAL_SHA, 'initial_changed')
        report['status'] = 'RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW'
    except BaseException as exc:
        report.update(status='STOPPED_NO_RETRY', error_type=type(exc).__name__, reason=str(exc), traceback=traceback.format_exc())
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
            need(all(sha(p) == h for p, h in cpu['frozen'].items()), 'frozen_changed')
            report['frozen_inputs_unchanged'] = True
        except BaseException as exc:
            report.update(status='STOPPED_IDENTITY_UNVERIFIED_NO_RETRY', identity_error=str(exc))
        signal.setitimer(signal.ITIMER_REAL, 0)
        report['processing_seconds'] = time.monotonic() - started
        report['process_cost_usd'] = report['processing_seconds'] * .28 / 3600
        checkpoint()
    print(json.dumps({k: report.get(k) for k in ('status', 'model_loads_completed', 'optimizer_steps_completed',
                                              'model_calls_completed', 'processing_seconds', 'process_cost_usd')}), flush=True)
    return 0 if report['status'] == 'RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW' else 1

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--source-commit')
    args = parser.parse_args()
    if not args.execute:
        parser.error('explicit --execute and separate Mash approval required')
    raise SystemExit(execute(args.source_commit))
