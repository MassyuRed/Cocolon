"""Eighteen local-binding/full/anchor updates, save/reload, full2 plus old9 calls."""
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
OUTPUT = Path('/workspace/cocolon_joint_role18_run_20261029')
PLAN = 'role18.plan.json'
PRIOR_RUNNER = '19f870c07115dbb8e7a11118a3060f76e618304a44f2d2660e745ad514e08dd3'
FULL_IDS = ['FT-BOOK-AFTER-ANSWER', 'FT-SHOP-AFTER-ANSWER']
AUX_IDS = ['AUX-A-FT-BOOK-AFTER-ANSWER', 'AUX-B-FT-BOOK-AFTER-ANSWER',
           'AUX-A-FT-SHOP-AFTER-ANSWER', 'AUX-B-FT-SHOP-AFTER-ANSWER']
OLD_IDS = ['TRAIN-SERVICE-CHAIR-01-INITIAL', 'TRAIN-SERVICE-CHAIR-01-CORRECTION', 'TRAIN-SERVICE-CHAIR-02-INITIAL', 'TRAIN-SERVICE-CHAIR-02-CORRECTION', 'TRAIN-SERVICE-CHAIR-03-INITIAL', 'TRAIN-SERVICE-CHAIR-03-CORRECTION', 'TRAIN-DAILY-CALM-01-INITIAL', 'TRAIN-DAILY-CALM-02-INITIAL', 'TRAIN-DAILY-CALM-03-INITIAL']
ORDER = ['TRAIN-SERVICE-CHAIR-01-INITIAL', 'LOCAL-ROLE_TO_EVIDENCE-FT-BOOK-AFTER-ANSWER-no_contact', 'LOCAL-ROLE_TO_EVIDENCE-FT-BOOK-AFTER-ANSWER-statement_concession', 'LOCAL-ROLE_TO_EVIDENCE-FT-BOOK-AFTER-ANSWER-returned_concession', 'LOCAL-CLAIM_TO_ATTACHED_ADD-FT-BOOK-AFTER-ANSWER-no_contact', 'LOCAL-CLAIM_TO_ATTACHED_ADD-FT-BOOK-AFTER-ANSWER-continuing_concern', 'LOCAL-END_UPDATES_AND_PROSE-FT-BOOK-AFTER-ANSWER-final', 'FT-BOOK-AFTER-ANSWER', 'TRAIN-SERVICE-CHAIR-01-CORRECTION', 'LOCAL-ROLE_TO_EVIDENCE-FT-SHOP-AFTER-ANSWER-perceived_realization', 'LOCAL-ROLE_TO_EVIDENCE-FT-SHOP-AFTER-ANSWER-answer_joy', 'LOCAL-ROLE_TO_EVIDENCE-FT-SHOP-AFTER-ANSWER-felt_distance', 'LOCAL-CLAIM_TO_ATTACHED_ADD-FT-SHOP-AFTER-ANSWER-perceived_realization', 'LOCAL-CLAIM_TO_ATTACHED_ADD-FT-SHOP-AFTER-ANSWER-felt_distance', 'LOCAL-CLAIM_TO_ATTACHED_ADD-FT-SHOP-AFTER-ANSWER-answer_sadness', 'LOCAL-END_UPDATES_AND_PROSE-FT-SHOP-AFTER-ANSWER-final', 'FT-SHOP-AFTER-ANSWER', 'TRAIN-DAILY-CALM-01-INITIAL']
INITIAL_ADAPTER = {'README.md': '7716b0151793769140a76026939437398273346aefc3e5f75bb8ab2833b42885', 'adapter_config.json': '1b7074d4d5af35ca36911aa33e4e26173f469f475f1d6eb2cc68f3df9cadc244', 'adapter_model.safetensors': 'afaa2c2e2f7263792d5cf9930bb2fac0bf44bdccd04ff2ffa8049a2cfd2f12d2'}
CAPS = {'TRAIN-SERVICE-CHAIR-01-INITIAL': 2560, 'TRAIN-SERVICE-CHAIR-01-CORRECTION': 2560, 'TRAIN-SERVICE-CHAIR-02-INITIAL': 2560, 'TRAIN-SERVICE-CHAIR-02-CORRECTION': 2560, 'TRAIN-SERVICE-CHAIR-03-INITIAL': 2560, 'TRAIN-SERVICE-CHAIR-03-CORRECTION': 2560, 'TRAIN-DAILY-CALM-01-INITIAL': 2560, 'TRAIN-DAILY-CALM-02-INITIAL': 2560, 'TRAIN-DAILY-CALM-03-INITIAL': 2560, 'FT-BOOK-AFTER-ANSWER': 3712, 'FT-SHOP-AFTER-ANSWER': 3584}
FIXED = {'schema': 'cocolon.joint_role18_once.v1', 'pod_id': 'vgkm402msgroiu', 'expected_gpu_name': 'NVIDIA RTX A5000', 'gpu_hourly_usd': 0.28, 'max_seconds': 2700, 'parent_timeout_seconds': 2690, 'parent_kill_after_seconds': 10, 'max_process_usd': 0.21, 'per_generation_seconds': 180, 'context_tokens': 8192, 'optimizer_steps': 18, 'update_order': ['TRAIN-SERVICE-CHAIR-01-INITIAL', 'LOCAL-ROLE_TO_EVIDENCE-FT-BOOK-AFTER-ANSWER-no_contact', 'LOCAL-ROLE_TO_EVIDENCE-FT-BOOK-AFTER-ANSWER-statement_concession', 'LOCAL-ROLE_TO_EVIDENCE-FT-BOOK-AFTER-ANSWER-returned_concession', 'LOCAL-CLAIM_TO_ATTACHED_ADD-FT-BOOK-AFTER-ANSWER-no_contact', 'LOCAL-CLAIM_TO_ATTACHED_ADD-FT-BOOK-AFTER-ANSWER-continuing_concern', 'LOCAL-END_UPDATES_AND_PROSE-FT-BOOK-AFTER-ANSWER-final', 'FT-BOOK-AFTER-ANSWER', 'TRAIN-SERVICE-CHAIR-01-CORRECTION', 'LOCAL-ROLE_TO_EVIDENCE-FT-SHOP-AFTER-ANSWER-perceived_realization', 'LOCAL-ROLE_TO_EVIDENCE-FT-SHOP-AFTER-ANSWER-answer_joy', 'LOCAL-ROLE_TO_EVIDENCE-FT-SHOP-AFTER-ANSWER-felt_distance', 'LOCAL-CLAIM_TO_ATTACHED_ADD-FT-SHOP-AFTER-ANSWER-perceived_realization', 'LOCAL-CLAIM_TO_ATTACHED_ADD-FT-SHOP-AFTER-ANSWER-felt_distance', 'LOCAL-CLAIM_TO_ATTACHED_ADD-FT-SHOP-AFTER-ANSWER-answer_sadness', 'LOCAL-END_UPDATES_AND_PROSE-FT-SHOP-AFTER-ANSWER-final', 'FT-SHOP-AFTER-ANSWER', 'TRAIN-DAILY-CALM-01-INITIAL'], 'generation_order': ['FT-BOOK-AFTER-ANSWER', 'FT-SHOP-AFTER-ANSWER', 'TRAIN-SERVICE-CHAIR-01-INITIAL', 'TRAIN-SERVICE-CHAIR-01-CORRECTION', 'TRAIN-SERVICE-CHAIR-02-INITIAL', 'TRAIN-SERVICE-CHAIR-02-CORRECTION', 'TRAIN-SERVICE-CHAIR-03-INITIAL', 'TRAIN-SERVICE-CHAIR-03-CORRECTION', 'TRAIN-DAILY-CALM-01-INITIAL', 'TRAIN-DAILY-CALM-02-INITIAL', 'TRAIN-DAILY-CALM-03-INITIAL'], 'max_model_calls': 11, 'max_new_tokens_by_case': {'TRAIN-SERVICE-CHAIR-01-INITIAL': 2560, 'TRAIN-SERVICE-CHAIR-01-CORRECTION': 2560, 'TRAIN-SERVICE-CHAIR-02-INITIAL': 2560, 'TRAIN-SERVICE-CHAIR-02-CORRECTION': 2560, 'TRAIN-SERVICE-CHAIR-03-INITIAL': 2560, 'TRAIN-SERVICE-CHAIR-03-CORRECTION': 2560, 'TRAIN-DAILY-CALM-01-INITIAL': 2560, 'TRAIN-DAILY-CALM-02-INITIAL': 2560, 'TRAIN-DAILY-CALM-03-INITIAL': 2560, 'FT-BOOK-AFTER-ANSWER': 3712, 'FT-SHOP-AFTER-ANSWER': 3584}, 'model_loads': 2, 'learning_rate': 5e-05, 'seed': 20261024, 'gradient_clip': 1.0, 'weight_decay': 0.0, 'training_loss': 'original_full_assistant_ce_including_eos', 'optimizer_resume': False, 'initial_adapter_sha256': 'afaa2c2e2f7263792d5cf9930bb2fac0bf44bdccd04ff2ffa8049a2cfd2f12d2', 'api_commit': '7b9ee073de03940ba71587297d8600b2b6094dd1', 'output_directory': '/workspace/cocolon_joint_role18_run_20261029', 'unconditional_full2_and_old9': True, 'old9_baseline_on_initial_adapter_measured': False, 'retry': False, 'automatic_progression': False, 'product_credit': 0, 'sql_operations': 0, 'gpu_lifecycle_operations': 0, 'local_tasks': 13, 'local_tasks_sha256': '4aec0be06138ec94b52534148219372cfc608de93b2ba0b13cbabf24e814707f'}


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


def validate(bundle, initial_adapter, execution=False):
    plan = json.loads((HERE / PLAN).read_text())
    extra = {'runner_sha256', 'preparer_sha256', 'consumer_sha256', 'cpu_check_sha256',
             'gpu_run_authorized', 'approval_basis'}
    require(set(plan) == set(FIXED) | extra, 'role18_plan_keys')
    for key, value in FIXED.items():
        require(type(plan[key]) is type(value) and plan[key] == value, 'role18_plan_changed:' + key)
    for name, key in [('run_role18.py', 'runner_sha256'), ('prepare_role18.py', 'preparer_sha256'), ('consume_role18.py', 'consumer_sha256')]:
        require(sha(HERE / name) == plan[key], 'role18_source_changed:' + name)
    require(type(plan['gpu_run_authorized']) is bool, 'role18_authorization_type')
    require((plan['gpu_run_authorized'] and isinstance(plan['approval_basis'], str) and plan['approval_basis'].strip())
            or (not plan['gpu_run_authorized'] and plan['approval_basis'] is None), 'role18_approval_basis')
    require(not execution or plan['gpu_run_authorized'], 'role18_execute_disabled')
    require(sha(bundle / 'diagnostic/run_auxiliary_diagnostic.py') == PRIOR_RUNNER, 'prior_diagnostic_source_changed')
    prior = load('role18_prior_diagnostic', bundle / 'diagnostic/run_auxiliary_diagnostic.py')
    _, rows, bound = prior.validate(bundle / 'archive', bundle / 'support')
    require([row['id'] for row in rows] == AUX_IDS, 'role18_auxiliary_rows')
    rows = [json.loads(line) for line in (bundle / 'archive/runtime/train_messages.jsonl').read_text().splitlines()]
    require(len(rows) == 19, 'role18_original19_rows')
    local_path = HERE / 'auxiliary_train_messages.jsonl'
    require(sha(local_path) == FIXED['local_tasks_sha256'], 'role18_local_tasks_changed')
    local_rows = [json.loads(line) for line in local_path.read_text().splitlines()]
    require(len(local_rows) == 13, 'role18_local_task_count')
    rows = rows + local_rows
    require(len(rows) == 32 and len({row['id'] for row in rows}) == 32 and set(ORDER) <= {row['id'] for row in rows}, 'role18_rows')
    bound[local_path] = FIXED['local_tasks_sha256']
    bound.update({initial_adapter / name: digest for name, digest in INITIAL_ADAPTER.items()})
    require(all(sha(path) == digest for path,digest in bound.items()), 'role18_initial_or_inputs_changed')
    if execution:
        require(plan['cpu_check_sha256'] is not None and sha(HERE / 'cpu_check.json') == plan['cpu_check_sha256'], 'role18_cpu_evidence_missing')
        check = json.loads((HERE / 'cpu_check.json').read_text())
        require(check['status'] == 'CPU_ROLE18_READY_NO_MODEL' and check['optimizer_steps'] == 18 and check['evaluation_messages_exact'] == 11, 'role18_cpu_not_ready')
    bound.update({HERE / PLAN: sha(HERE / PLAN), HERE / 'run_role18.py': plan['runner_sha256'],
                  HERE / 'prepare_role18.py': plan['preparer_sha256'], HERE / 'consume_role18.py': plan['consumer_sha256']})
    return plan, prior, rows, bound


def execute(bundle, initial_adapter, cmee_root, source):
    plan, prior, rows, bound = validate(bundle, initial_adapter, True)
    require(len(source) == 40 and all(ch in '0123456789abcdef' for ch in source), 'role18_source_commit_required')
    args = (Path('/proc') / str(os.getppid()) / 'cmdline').read_bytes().split(bytes([0]))
    require(args[0].rsplit(b'/', 1)[-1] == b'timeout' and all(x in args for x in (b'--signal=TERM', b'--kill-after=10s', b'2690s')), 'role18_parent_timeout_required')
    OUTPUT.mkdir(exist_ok=False)
    started = time.monotonic()
    deadline = started + 2700
    report = dict(status='STARTED_ONCE', source_commit=source, plan=plan, started_unix=time.time(),
                  optimizer_steps_started=0, optimizer_steps_completed=0, training_forwards_completed=0,
                  model_loads_started=0, model_loads_completed=0, model_calls_started=0, model_calls_completed=0,
                  calls=[], retry=False, product_credit=0, automatic_progression=False,
                  sql_operations=0, gpu_lifecycle_operations=0)
    model = optimizer = trainable = initial = original_generate = generate = ids = labels = value = None

    def checkpoint():
        report['elapsed_seconds'] = time.monotonic() - started
        write(OUTPUT / 'run.json', report)

    def stop(*_):
        raise TimeoutError('role18_deadline_no_retry')

    signal.signal(signal.SIGALRM, stop)
    signal.signal(signal.SIGTERM, stop)
    signal.setitimer(signal.ITIMER_REAL, 2700)
    checkpoint()
    try:
        require(os.environ.get('HF_HUB_OFFLINE') == os.environ.get('TRANSFORMERS_OFFLINE') == '1', 'role18_offline_required')
        cpu = json.loads((HERE / 'cpu_check.json').read_text())
        require(sha(cmee_root / 'restore_payload.json') == cpu['current_cmee_manifest_sha256'], 'role18_cmee_context_changed')
        helper = prior.module('role18_immutable_helper', bundle / 'support/run_pilot.py')
        from transformers import AutoTokenizer, StoppingCriteria, StoppingCriteriaList
        import importlib.metadata
        import torch
        require({name: importlib.metadata.version(name) for name in helper.PINS} == helper.PINS, 'role18_dependency_changed')
        require(os.environ.get('RUNPOD_POD_ID') == plan['pod_id'] and torch.cuda.device_count() == 1, 'role18_pod_or_gpu_count')
        report['gpu'] = helper.gpu_profile(torch, {'minimum_free_gib': 14})
        require(report['gpu']['name'] == plan['expected_gpu_name'], 'role18_gpu_changed')
        torch.cuda.reset_peak_memory_stats()
        tokenizer = AutoTokenizer.from_pretrained(helper.MODEL, revision=helper.REVISION, local_files_only=True, trust_remote_code=False)
        encoded = {row['id']: helper.encode_training(tokenizer, row['messages'], context=8192)[0] for row in rows}
        recovery = prior.module('role18_existing_suffix_owner', bundle / 'support/run_expanded15_recovery.py')
        recovery.OLDPACK = bundle / 'support'
        recovery.ORIGIN = bundle / 'archive/run'
        owner, _, _ = recovery.owner_with_checked_suffixes()
        report['model_loads_started'] = 1
        checkpoint()
        model, tensors = owner.load_expanded_adapter(helper, initial_adapter, INITIAL_ADAPTER, trainable=True)
        report['model_loads_completed'] = 1
        write(OUTPUT / 'initial_loaded_tensors.json', tensors)
        trainable = [(name, parameter) for name, parameter in model.named_parameters() if parameter.requires_grad]
        require(len(trainable) == 112, 'role18_trainable_scope')
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
                require(time.monotonic() < deadline - 5, 'role18_deadline_before_update')
                item = encoded[cid]
                ids = torch.tensor([item['input_ids']], dtype=torch.long, device='cuda:0')
                labels = torch.tensor([item['labels']], dtype=torch.long, device='cuda:0')
                optimizer.zero_grad(set_to_none=True)
                value = helper.teacher_loss(model, input_ids=ids, attention_mask=torch.ones_like(ids), labels=labels, encoded=item)
                report['training_forwards_completed'] = step
                require(torch.isfinite(value).item(), 'role18_nonfinite_loss')
                value.backward()
                norm = float(torch.nn.utils.clip_grad_norm_([parameter for _, parameter in trainable], 1., error_if_nonfinite=True).cpu())
                require(math.isfinite(norm) and norm > 0, 'role18_gradient')
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
        require(all(torch.isfinite(parameter).all().item() for _, parameter in trainable), 'role18_nonfinite_weights')
        report['changed_tensors'] = sum(not torch.equal(initial[name], parameter.detach().cpu()) for name, parameter in trainable)
        require(report['changed_tensors'] > 0, 'role18_no_weight_change')
        model.save_pretrained(OUTPUT / 'adapter', safe_serialization=True)
        report['adapter_sha256'] = helper.adapter_hashes(OUTPUT / 'adapter')
        initial = trainable = model = None
        gc.collect()
        torch.cuda.empty_cache()
        report['model_loads_started'] = 2
        checkpoint()
        model, tensors = owner.load_expanded_adapter(helper, OUTPUT / 'adapter', report['adapter_sha256'], trainable=False)
        report['model_loads_completed'] = 2
        require(not any(parameter.requires_grad for parameter in model.parameters()), 'role18_reload_trainable')
        write(OUTPUT / 'reloaded_tensors.json', tensors)
        by_id = {row['case_id']: row for row in json.loads((bundle / 'archive/runtime/eval_inputs.json').read_text())}
        cases = [by_id[cid] for cid in FULL_IDS + OLD_IDS]
        for case in cases:
            require(time.monotonic() < deadline - 5 and report['model_calls_started'] < 11, 'role18_deadline_before_call')
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
            call['candidate_format'] = 'named' if cid in FULL_IDS else 'quote'
            report['calls'].append(call)
            report['model_calls_completed'] += 1
            checkpoint()
            require(not triggered and time.monotonic() < stop_at, 'role18_call_deadline_no_retry')
        require(helper.adapter_hashes(OUTPUT / 'adapter') == report['adapter_sha256'], 'role18_weights_changed_during_inference')
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
            require(all(sha(path) == digest for path, digest in bound.items()), 'role18_frozen_inputs_changed')
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
    parser.add_argument('--initial-adapter', required=True, type=Path)
    parser.add_argument('--cmee-root', required=True, type=Path)
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--source-commit', default='')
    args = parser.parse_args()
    if args.execute:
        raise SystemExit(execute(args.bundle_root.resolve(), args.initial_adapter.resolve(), args.cmee_root.resolve(), args.source_commit))
    validate(args.bundle_root.resolve(), args.initial_adapter.resolve())
    print('ROLE18_STATIC_VALIDATED_NO_MODEL')

