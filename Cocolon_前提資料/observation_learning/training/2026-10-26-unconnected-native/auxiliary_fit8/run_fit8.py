"""Eight full-CE auxiliary updates, save/reload, then four FIT and two full calls."""
import argparse
import gc
import hashlib
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
HERE = Path(__file__).resolve().parent
OUTPUT = Path('/workspace/cocolon_auxiliary_fit8_run_20261029')
PLAN = 'fit8.plan.json'
PRIOR_RUNNER = '19f870c07115dbb8e7a11118a3060f76e618304a44f2d2660e745ad514e08dd3'
FULL_IDS = ['FT-BOOK-AFTER-ANSWER', 'FT-SHOP-AFTER-ANSWER']
AUX_IDS = ['AUX-A-FT-BOOK-AFTER-ANSWER', 'AUX-B-FT-BOOK-AFTER-ANSWER',
           'AUX-A-FT-SHOP-AFTER-ANSWER', 'AUX-B-FT-SHOP-AFTER-ANSWER']
ORDER = AUX_IDS * 2
CAPS = dict(zip(AUX_IDS + FULL_IDS, [2816, 1024, 2816, 1024, 3712, 3584]))
FIXED = dict(schema='cocolon.auxiliary_fit8_once.v1', pod_id='vgkm402msgroiu',
             expected_gpu_name='NVIDIA RTX A5000', gpu_hourly_usd=0.28,
             max_seconds=1500, parent_timeout_seconds=1490, parent_kill_after_seconds=10,
             max_process_usd=0.117, per_generation_seconds=180, context_tokens=8192,
             optimizer_steps=8, update_order=ORDER, generation_order=AUX_IDS + FULL_IDS,
             max_model_calls=6, max_new_tokens_by_case=CAPS, model_loads=2,
             learning_rate=5e-5, seed=20261024, gradient_clip=1.0, weight_decay=0.0,
             training_loss='original_full_assistant_ce_including_eos', optimizer_resume=False,
             initial_adapter_sha256='2dfd7dbd2613aca8682601a140c1bbcc82e0b22de052dece60c6a60ad1a1cea4',
             api_commit='7b9ee073de03940ba71587297d8600b2b6094dd1', output_directory=str(OUTPUT),
             unconditional_full2_after_auxiliary4=True, old9_regression_tested=False,
             retry=False, automatic_progression=False, product_credit=0,
             sql_operations=0, gpu_lifecycle_operations=0)


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def require(ok, reason):
    if not ok:
        raise ValueError(reason)


def write(path, value):
    temp = path.with_suffix(path.suffix + '.tmp')
    temp.write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + '\n', encoding='utf-8')
    temp.replace(path)


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    sys.modules[name] = result
    spec.loader.exec_module(result)
    return result


def validate(bundle, execution=False):
    plan = json.loads((HERE / PLAN).read_text())
    extra = {'runner_sha256', 'preparer_sha256', 'consumer_sha256', 'cpu_check_sha256',
             'gpu_run_authorized', 'approval_basis'}
    require(set(plan) == set(FIXED) | extra, 'fit8_plan_keys')
    for key, value in FIXED.items():
        require(type(plan[key]) is type(value) and plan[key] == value, 'fit8_plan_changed:' + key)
    for name, key in [('run_fit8.py', 'runner_sha256'), ('prepare_fit8.py', 'preparer_sha256'), ('consume_fit8.py', 'consumer_sha256')]:
        require(sha(HERE / name) == plan[key], 'fit8_source_changed:' + name)
    require(type(plan['gpu_run_authorized']) is bool, 'fit8_authorization_type')
    require((plan['gpu_run_authorized'] and isinstance(plan['approval_basis'], str) and plan['approval_basis'].strip())
            or (not plan['gpu_run_authorized'] and plan['approval_basis'] is None), 'fit8_approval_basis')
    require(not execution or plan['gpu_run_authorized'], 'fit8_execute_disabled')
    require(sha(bundle / 'diagnostic/run_auxiliary_diagnostic.py') == PRIOR_RUNNER, 'prior_diagnostic_source_changed')
    prior = load('fit8_prior_diagnostic', bundle / 'diagnostic/run_auxiliary_diagnostic.py')
    _, rows, bound = prior.validate(bundle / 'archive', bundle / 'support')
    require([row['id'] for row in rows] == AUX_IDS and prior.ADAPTER['adapter_model.safetensors'] == FIXED['initial_adapter_sha256'], 'fit8_initial_or_rows')
    if execution:
        require(plan['cpu_check_sha256'] is not None and sha(HERE / 'cpu_check.json') == plan['cpu_check_sha256'], 'fit8_cpu_evidence_missing')
        check = json.loads((HERE / 'cpu_check.json').read_text())
        require(check['status'] == 'CPU_FIT8_READY_NO_MODEL' and check['optimizer_steps'] == 8 and check['full2_messages_exact'] == 2, 'fit8_cpu_not_ready')
    bound.update({HERE / PLAN: sha(HERE / PLAN), HERE / 'run_fit8.py': plan['runner_sha256'],
                  HERE / 'prepare_fit8.py': plan['preparer_sha256'], HERE / 'consume_fit8.py': plan['consumer_sha256']})
    return plan, prior, rows, bound


def execute(bundle, cmee_root, source):
    plan, prior, rows, bound = validate(bundle, True)
    require(len(source) == 40 and all(ch in '0123456789abcdef' for ch in source), 'fit8_source_commit_required')
    args = (Path('/proc') / str(os.getppid()) / 'cmdline').read_bytes().split(bytes([0]))
    require(args[0].rsplit(b'/', 1)[-1] == b'timeout' and all(x in args for x in (b'--signal=TERM', b'--kill-after=10s', b'1490s')), 'fit8_parent_timeout_required')
    OUTPUT.mkdir(exist_ok=False)
    started = time.monotonic()
    deadline = started + 1500
    report = dict(status='STARTED_ONCE', source_commit=source, plan=plan, started_unix=time.time(),
                  optimizer_steps_started=0, optimizer_steps_completed=0, training_forwards_completed=0,
                  model_loads_started=0, model_loads_completed=0, model_calls_started=0, model_calls_completed=0,
                  auxiliary_calls=[], full_calls=[], retry=False, product_credit=0, automatic_progression=False,
                  sql_operations=0, gpu_lifecycle_operations=0)
    model = optimizer = trainable = initial = original_generate = generate = ids = labels = value = None

    def checkpoint():
        report['elapsed_seconds'] = time.monotonic() - started
        write(OUTPUT / 'run.json', report)

    def stop(*_):
        raise TimeoutError('fit8_deadline_no_retry')

    signal.signal(signal.SIGALRM, stop)
    signal.signal(signal.SIGTERM, stop)
    signal.setitimer(signal.ITIMER_REAL, 1500)
    checkpoint()
    try:
        require(os.environ.get('HF_HUB_OFFLINE') == os.environ.get('TRANSFORMERS_OFFLINE') == '1', 'fit8_offline_required')
        cpu = json.loads((HERE / 'cpu_check.json').read_text())
        require(sha(cmee_root / 'restore_payload.json') == cpu['current_cmee_manifest_sha256'], 'fit8_cmee_context_changed')
        helper = prior.module('fit8_immutable_helper', bundle / 'support/run_pilot.py')
        from transformers import AutoTokenizer, StoppingCriteria, StoppingCriteriaList
        import importlib.metadata
        import torch
        require({name: importlib.metadata.version(name) for name in helper.PINS} == helper.PINS, 'fit8_dependency_changed')
        require(os.environ.get('RUNPOD_POD_ID') == plan['pod_id'] and torch.cuda.device_count() == 1, 'fit8_pod_or_gpu_count')
        report['gpu'] = helper.gpu_profile(torch, {'minimum_free_gib': 14})
        require(report['gpu']['name'] == plan['expected_gpu_name'], 'fit8_gpu_changed')
        torch.cuda.reset_peak_memory_stats()
        tokenizer = AutoTokenizer.from_pretrained(helper.MODEL, revision=helper.REVISION, local_files_only=True, trust_remote_code=False)
        encoded = {row['id']: helper.encode_training(tokenizer, row['messages'], context=8192)[0] for row in rows}
        recovery = prior.module('fit8_existing_suffix_owner', bundle / 'support/run_expanded15_recovery.py')
        recovery.OLDPACK = bundle / 'support'
        recovery.ORIGIN = bundle / 'archive/run'
        owner, _, _ = recovery.owner_with_checked_suffixes()
        report['model_loads_started'] = 1
        checkpoint()
        model, tensors = owner.load_expanded_adapter(helper, bundle / 'archive/run/adapter', prior.ADAPTER, trainable=True)
        report['model_loads_completed'] = 1
        write(OUTPUT / 'initial_loaded_tensors.json', tensors)
        trainable = [(name, parameter) for name, parameter in model.named_parameters() if parameter.requires_grad]
        require(len(trainable) == 112, 'fit8_trainable_scope')
        initial = {name: parameter.detach().cpu().clone() for name, parameter in trainable}
        random.seed(plan['seed'])
        torch.manual_seed(plan['seed'])
        torch.cuda.manual_seed_all(plan['seed'])
        model.config.use_cache = False
        model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={'use_reentrant': False})
        model.enable_input_require_grads()
        model.train()
        optimizer = torch.optim.AdamW([parameter for _, parameter in trainable], lr=5e-5, weight_decay=0.)
        with (OUTPUT / 'training.jsonl').open('x') as stream:
            for step, cid in enumerate(ORDER, 1):
                require(time.monotonic() < deadline - 5, 'fit8_deadline_before_update')
                item = encoded[cid]
                ids = torch.tensor([item['input_ids']], dtype=torch.long, device='cuda:0')
                labels = torch.tensor([item['labels']], dtype=torch.long, device='cuda:0')
                optimizer.zero_grad(set_to_none=True)
                value = helper.teacher_loss(model, input_ids=ids, attention_mask=torch.ones_like(ids), labels=labels, encoded=item)
                report['training_forwards_completed'] = step
                require(torch.isfinite(value).item(), 'fit8_nonfinite_loss')
                value.backward()
                norm = float(torch.nn.utils.clip_grad_norm_([parameter for _, parameter in trainable], 1., error_if_nonfinite=True).cpu())
                require(math.isfinite(norm) and norm > 0, 'fit8_gradient')
                report['optimizer_steps_started'] = step
                checkpoint()
                optimizer.step()
                report['optimizer_steps_completed'] = step
                stream.write(json.dumps(dict(step=step, id=cid, loss=float(value.detach().cpu()), gradient_norm=norm,
                                             target_tokens=sum(label != -100 for label in item['labels']), loss_type='full_assistant_ce_including_eos')) + '\n')
                stream.flush()
                ids = labels = value = None
                checkpoint()
        optimizer.zero_grad(set_to_none=True)
        optimizer = None
        require(all(torch.isfinite(parameter).all().item() for _, parameter in trainable), 'fit8_nonfinite_weights')
        report['changed_tensors'] = sum(not torch.equal(initial[name], parameter.detach().cpu()) for name, parameter in trainable)
        require(report['changed_tensors'] > 0, 'fit8_no_weight_change')
        model.save_pretrained(OUTPUT / 'adapter', safe_serialization=True)
        report['adapter_sha256'] = helper.adapter_hashes(OUTPUT / 'adapter')
        initial = trainable = model = None
        gc.collect()
        torch.cuda.empty_cache()
        report['model_loads_started'] = 2
        checkpoint()
        model, tensors = owner.load_expanded_adapter(helper, OUTPUT / 'adapter', report['adapter_sha256'], trainable=False)
        report['model_loads_completed'] = 2
        require(not any(parameter.requires_grad for parameter in model.parameters()), 'fit8_reload_trainable')
        write(OUTPUT / 'reloaded_tensors.json', tensors)
        cases = [{'case_id': row['id'], 'messages': row['messages'][:-1]} for row in rows]
        by_id = {row['case_id']: row for row in json.loads((bundle / 'archive/runtime/eval_inputs.json').read_text())}
        cases += [by_id[cid] for cid in FULL_IDS]
        for case in cases:
            require(time.monotonic() < deadline - 5 and report['model_calls_started'] < 6, 'fit8_deadline_before_call')
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

            cid = case['case_id']
            path = OUTPUT / ('after_' + cid + '.jsonl')
            report['model_calls_started'] += 1
            checkpoint()
            with patch.object(model, 'generate', generate):
                helper.evaluate(model, tokenizer, [case], path, {'context_tokens': 8192, 'max_new_tokens': CAPS[cid]}, adapter_revision=report['adapter_sha256']['adapter_model.safetensors'])
            raw = helper.read_jsonl(path)[0]
            call = dict(case_id=cid, path=path.name, raw_sha256=sha(path), eos_reached=raw['eos_reached'],
                        seconds=raw['seconds'], output_tokens=raw['output_tokens'], timeout_triggered=triggered)
            if cid in AUX_IDS:
                row = next(row for row in rows if row['id'] == cid)
                mismatch = None if raw['parsed'] is None else prior.differences(helper.strict_json(row['messages'][-1]['content']), raw['parsed'])
                call.update(complete_json=raw['parsed'] is not None, literal_teacher_json_match=mismatch == [],
                            literal_mismatch_count=None if mismatch is None else len(mismatch), gold_A_conditioned=cid.startswith('AUX-B-'),
                            cmee_adoption='NOT_APPLICABLE_PARTIAL_PROJECTION')
                report['auxiliary_calls'].append(call)
            else:
                report['full_calls'].append(call)
            report['model_calls_completed'] += 1
            checkpoint()
            require(not triggered and time.monotonic() < stop_at, 'fit8_call_deadline_no_retry')
        require(helper.adapter_hashes(OUTPUT / 'adapter') == report['adapter_sha256'], 'fit8_weights_changed_during_inference')
        report['status'] = 'RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW'
    except BaseException as exc:
        report.update(status='STOPPED_NO_RETRY', error_type=type(exc).__name__, reason=str(exc), traceback=traceback.format_exc())
        if model is not None and report['optimizer_steps_started'] > 0 and 'adapter_sha256' not in report:
            try:
                ids = labels = value = optimizer = None
                gc.collect()
                model.save_pretrained(OUTPUT / 'partial_adapter', safe_serialization=True)
                report['partial_adapter_not_adopted'] = True
            except BaseException as save_error:
                report['partial_adapter_preservation_error'] = str(save_error)
    finally:
        if 'torch' in sys.modules and sys.modules['torch'].cuda.is_initialized():
            report['peak_allocated_bytes'] = sys.modules['torch'].cuda.max_memory_allocated()
            report['peak_reserved_bytes'] = sys.modules['torch'].cuda.max_memory_reserved()
        original_generate = generate = model = optimizer = trainable = initial = ids = labels = value = None
        gc.collect()
        if 'torch' in sys.modules and sys.modules['torch'].cuda.is_initialized():
            sys.modules['torch'].cuda.empty_cache()
            report['post_release_allocated_bytes'] = sys.modules['torch'].cuda.memory_allocated()
        try:
            require(all(sha(path) == digest for path, digest in bound.items()), 'fit8_frozen_inputs_changed')
            report['initial_adapter_and_frozen_inputs_unchanged'] = True
        except BaseException as exc:
            report.update(status='STOPPED_IDENTITY_UNVERIFIED_NO_RETRY', identity_error=str(exc))
        signal.setitimer(signal.ITIMER_REAL, 0)
        report['processing_seconds'] = time.monotonic() - started
        report['process_cost_usd'] = report['processing_seconds'] * .28 / 3600
        checkpoint()
    print(json.dumps({key: report.get(key) for key in ('status', 'optimizer_steps_completed', 'model_calls_completed', 'processing_seconds', 'process_cost_usd')}), flush=True)
    return 0 if report['status'] == 'RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW' else 1


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--bundle-root', required=True, type=Path)
    parser.add_argument('--cmee-root', required=True, type=Path)
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--source-commit', default='')
    args = parser.parse_args()
    if args.execute:
        raise SystemExit(execute(args.bundle_root.resolve(), args.cmee_root.resolve(), args.source_commit))
    validate(args.bundle_root.resolve())
    print('FIT8_STATIC_VALIDATED_NO_MODEL')
