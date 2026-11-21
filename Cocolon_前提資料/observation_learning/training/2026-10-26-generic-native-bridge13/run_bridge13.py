"""One proposed interface bridge; default is tokenizer-only CPU preparation."""
import argparse
import gc
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
from unittest.mock import patch

sys.dont_write_bytecode = True
LEGACY = Path('/workspace/cocolon_4b_service_binding_legacy_reference_20261025')
NATIVE = Path('/workspace/cocolon_4b_quote_joint_pack_20261026')
INITIAL = Path('/workspace/cocolon_4b_quote_joint_fit12_20261026/adapter')
OUTPUT = Path('/workspace/cocolon_4b_generic_native_bridge13_result_20261026')
WEIGHT = '45779ad97111dd2d91c1f7f1a4b0ca697ef0586c5190cd56b1b7675fe540dab6'
HELPER = '2f659078c05bee6d7b32f50aae8b9eebc03c767d4a3be084bc17e9e3ccc4c10d'
JOINT = 'c5dd1679c605e020e4dad56951c79d7c0661a1279a34a0ae0d47666d639d7128'
ORDER = [9, 0, 1, 2, 9, 3, 4, 5, 9, 6, 7, 8, 9]


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def dump(p, value):
    p = Path(p)
    tmp = p.with_suffix(p.suffix + '.tmp')
    tmp.write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + '\n')
    tmp.replace(p)


def require(value, reason):
    if not value:
        raise ValueError(reason)


def validate_plan(plan, *, execute=False):
    fixed = dict(schema='cocolon.generic_native_bridge13.plan.v1', initial_adapter_sha256=WEIGHT,
        training_rows=10, generic_rows=1, native_rows=9, optimizer_steps=13,
        training_order=ORDER, learning_rate=5e-5, context_tokens=8192, max_new_tokens=2560,
        max_seconds=1800, per_generation_seconds=180, max_model_calls=11,
        gpu_hourly_usd=0.26, max_process_usd=0.13, seed=20261024,
        generic_full_loss_weight=1.0, native_daily_full_loss_weight=0.5,
        native_daily_surface_loss_weight=0.5, minimum_free_gib=14,
        retry=False, automatic_progression=False, cmee_generic_adoption=False,
        service_sql_calls=0, new_teacher_text=False)
    for k, v in fixed.items():
        require(type(plan.get(k)) is type(v) and plan[k] == v, 'fixed_plan_mismatch:' + k)
    require(plan['max_seconds'] * plan['gpu_hourly_usd'] / 3600 <= plan['max_process_usd'], 'budget_mismatch')
    if execute:
        require(plan.get('gpu_run_authorized') is True and plan.get('status') == 'AUTHORIZED_ONCE', 'new_gpu_not_authorized')
    return plan


def prepare(pack):
    plan = validate_plan(json.loads((pack / 'bridge13.plan.json').read_text()))
    require(sha(__file__) == plan['runner_sha256'], 'runner_changed')
    for name, spec in plan['payloads'].items():
        p = pack / name
        require(p.is_file() and not p.is_symlink() and sha(p) == spec['sha256'] and p.stat().st_size == spec['bytes'], 'payload_changed:' + name)
    require(os.environ.get('HF_HUB_OFFLINE') == os.environ.get('TRANSFORMERS_OFFLINE') == '1', 'offline_cache_required')
    require(sha(LEGACY / 'run_pilot.py') == HELPER and sha(NATIVE / 'run_quote_joint_fit.py') == JOINT, 'helper_changed')
    sys.path.insert(0, str(LEGACY))
    import run_pilot as r
    versions = {name: importlib.metadata.version(name) for name in r.PINS}
    require(versions == r.PINS, 'dependency_changed')
    spec = importlib.util.spec_from_file_location('bridge_native_joint', NATIVE / 'run_quote_joint_fit.py')
    joint = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(joint)
    rows = r.read_jsonl(pack / 'bridge_train_messages.jsonl')
    native = r.read_jsonl(NATIVE / 'train_messages.jsonl')
    provenance = json.loads((pack / 'generic_teacher_provenance.json').read_text())
    require(rows[:9] == native and len(rows) == 10, 'native_nine_changed')
    require(rows[9] == dict(id=provenance['id'], messages=provenance['messages']), 'generic_teacher_changed')
    require(provenance['id'] == 'FT-UDON-INITIAL' and provenance['origin'] == 'KAREN_EDIT_OF_EXISTING_RECORD', 'teacher_provenance_changed')
    require(all([m['role'] for m in x['messages']] == ['system', 'user', 'assistant'] for x in rows), 'training_roles')
    cases = r.read_jsonl(pack / 'bridge_eval_inputs.jsonl')
    require(len(cases) == 11 and [x['case_id'] for x in cases[:9]] == [x['id'] for x in rows[:9]], 'evaluation_scope')
    require([x['messages'] for x in cases[:9]] == [x['messages'][:-1] for x in rows[:9]], 'native_evaluation_changed')
    require(cases[9]['messages'] == rows[9]['messages'][:-1] and cases[10]['case_id'] == 'EFREE-E05', 'generic_evaluation_changed')
    pair = r.read_jsonl(Path('/workspace/cocolon_4b_instruction_pair4_pack_20261026/instruction_pair4_cases.jsonl'))
    require([x['messages'] for x in cases[9:]] == [x['messages'] for x in pair[:2]], 'baseline_comparator_changed')
    require(all([m['role'] for m in x['messages']] == ['system', 'user'] for x in cases), 'eval_teacher_leak')
    weights = r.adapter_hashes(INITIAL)
    require(weights['adapter_model.safetensors'] == WEIGHT, 'initial_adapter_changed')
    from transformers import AutoTokenizer
    tokenizer = AutoTokenizer.from_pretrained(r.MODEL, revision=r.REVISION, local_files_only=True, trust_remote_code=False)
    encoded, stats, masks = [], [], {}
    for index, row in enumerate(rows):
        item, prefix = r.encode_training(tokenizer, row['messages'], context=8192)
        completion = len(item['input_ids']) - prefix
        require(prefix + 2560 <= 8192 and completion <= 2560, 'no_truncation_token_limits')
        start, count = r.assistant_loss_window(item)
        require(all(v == -100 for v in item['labels'][:prefix]) and item['labels'][prefix:] == item['input_ids'][prefix:], 'loss_scope')
        require(tokenizer.eos_token_id in item['labels'][prefix:], 'eos_not_supervised')
        stats.append(dict(id=row['id'], prompt_tokens=prefix, assistant_eos_tokens=completion,
            full_tokens=len(item['input_ids']), loss_start=start, logits_positions=count))
        encoded.append(item)
        if 6 <= index <= 8:
            text = row['messages'][-1]['content']
            tok = tokenizer(text, add_special_tokens=False, return_offsets_mapping=True)
            masks[index] = joint.select_surface(item['input_ids'], prefix, tok['input_ids'], tok['offset_mapping'], text)
    eval_stats = []
    for row in cases:
        ids = r.chat_token_ids(tokenizer, row['messages'], generation_prompt=True)
        require(len(ids) + 2560 <= 8192, 'eval_context_exceeded')
        eval_stats.append(dict(case_id=row['case_id'], input_tokens=len(ids), input_token_ids=ids))
    report = dict(schema='cocolon.bridge13.cpu_preflight.v1', status='CPU_READY_GPU_NOT_EXECUTED',
        runner_sha256=sha(__file__), payloads=plan['payloads'], dependency_versions=versions,
        adapter_sha256=weights, model=r.MODEL, revision=r.REVISION, rows=stats,
        surface_masks={str(k): {a: b for a, b in v.items() if a not in {'input_ids', 'labels'}} for k, v in masks.items()},
        evaluations=eval_stats, training_order=ORDER, all_source_messages_preserved=True,
        prompt_supervised=False, truncation=False, model_weights_loaded=False,
        model_forward_calls=0, training_updates=0, new_generations=0, sql_calls=0)
    return plan, r, joint, tokenizer, rows, encoded, masks, cases, report


def execute(pack, args):
    validate_plan(json.loads((pack / 'bridge13.plan.json').read_text()), execute=True)
    started = time.monotonic()
    deadline = started + 1800
    def timeout(*_):
        raise TimeoutError('bridge13_deadline_no_retry')
    signal.signal(signal.SIGALRM, timeout)
    signal.signal(signal.SIGTERM, timeout)
    signal.setitimer(signal.ITIMER_REAL, 1800)
    plan, r, joint, tokenizer, rows, encoded, masks, cases, pre = prepare(pack)
    require(pre == json.loads((pack / 'bridge13_cpu_preflight.json').read_text()), 'preflight_changed')
    OUTPUT.mkdir(exist_ok=False)
    report = dict(status='STARTED_ONCE', source_commit=args.source_commit, plan=plan,
        optimizer_steps_completed=0, model_calls_started=0, model_calls_completed=0,
        initial_adapter_sha256=pre['adapter_sha256'], product_accepted=False, cmee_generic_adoption=False,
        automatic_progression=False, strict_optimizer_resume=False, retry=False)
    def checkpoint():
        report['seconds'] = time.monotonic() - started
        dump(OUTPUT / 'run.json', report)
    checkpoint()
    try:
        import torch
        from peft import PeftModel
        from transformers import StoppingCriteria, StoppingCriteriaList
        require(torch.cuda.device_count() == 1, 'single_gpu_required')
        report['gpu'] = r.gpu_profile(torch, plan)
        require('A4500' in report['gpu']['name'], 'existing_a4500_only')
        config = json.loads((INITIAL / 'adapter_config.json').read_text())
        require(config.get('base_model_name_or_path') == r.MODEL and set(config.get('target_modules', [])) == r.EXPECTED_TARGETS and config.get('r') == 8 and config.get('lora_alpha') == 16 and config.get('lora_dropout') == 0 and config.get('bias') == 'none', 'adapter_config_changed')
        random.seed(plan['seed'])
        torch.manual_seed(plan['seed'])
        torch.cuda.manual_seed_all(plan['seed'])
        torch.cuda.reset_peak_memory_stats()
        model = PeftModel.from_pretrained(r.load_base(), INITIAL, is_trainable=True, local_files_only=True)
        trainable = [(n, p) for n, p in model.named_parameters() if p.requires_grad]
        require(len(trainable) == 32 and all('lora_' in n and '.self_attn.' in n and torch.isfinite(p).all().item() for n, p in trainable), 'trainable_scope')
        model.config.use_cache = False
        model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={'use_reentrant': False})
        model.enable_input_require_grads()
        model.train()
        optimizer = torch.optim.AdamW([p for _, p in trainable], lr=5e-5, weight_decay=0.)
        with (OUTPUT / 'training.jsonl').open('x') as stream:
            for step, index in enumerate(ORDER, 1):
                item = encoded[index]
                ids = torch.tensor([item['input_ids']], dtype=torch.long, device='cuda:0')
                labels = torch.tensor([item['labels']], dtype=torch.long, device='cuda:0')
                mask = masks.get(index)
                surface_labels = None if mask is None else torch.tensor([mask['labels']], dtype=torch.long, device='cuda:0')
                optimizer.zero_grad(set_to_none=True)
                losses = joint.backward_objective(model, input_ids=ids, attention_mask=torch.ones_like(ids), labels=labels,
                    encoded=item, teacher_loss=r.teacher_loss, surface_encoded=mask, surface_labels=surface_labels)
                norm = float(torch.nn.utils.clip_grad_norm_([p for _, p in trainable], 1., error_if_nonfinite=True).cpu())
                require(math.isfinite(norm) and norm > 0, 'invalid_gradient')
                optimizer.step()
                report['optimizer_steps_completed'] = step
                stream.write(json.dumps(dict(step=step, id=rows[index]['id'], gradient_norm=norm, **losses)) + '\n')
                stream.flush()
                checkpoint()
                del ids, labels, surface_labels
        optimizer.zero_grad(set_to_none=True)
        del optimizer
        require(all(torch.isfinite(p).all().item() for _, p in trainable), 'nonfinite_saved_weights')
        model.save_pretrained(OUTPUT / 'adapter', safe_serialization=True)
        report['adapter_sha256'] = r.adapter_hashes(OUTPUT / 'adapter')
        checkpoint()
        joint.archive(OUTPUT, r)
        del trainable, model
        gc.collect()
        torch.cuda.empty_cache()
        model, tensor_stats = r.load_saved_adapter(OUTPUT / 'adapter', report['adapter_sha256'])
        dump(OUTPUT / 'reloaded_tensors.json', tensor_stats)
        actual_generate = model.generate
        call_deadline = deadline
        triggered = False
        class Bounded(StoppingCriteria):
            def __call__(self, *_a, **_kw):
                nonlocal triggered
                triggered = time.monotonic() >= call_deadline
                return triggered
        def generate(*a, **kw):
            kw['stopping_criteria'] = StoppingCriteriaList([*list(kw.get('stopping_criteria') or []), Bounded()])
            return actual_generate(*a, **kw)
        for index, case in enumerate(cases):
            require(time.monotonic() < deadline - 15, 'insufficient_remaining_time')
            call_deadline = min(deadline - 10, time.monotonic() + 180)
            triggered = False
            report['model_calls_started'] += 1
            checkpoint()
            raw_path = OUTPUT / f'case{index + 1}_raw.jsonl'
            with patch.object(model, 'generate', generate):
                r.evaluate(model, tokenizer, [case], raw_path, plan, adapter_revision=report['adapter_sha256']['adapter_model.safetensors'])
            raw = r.read_jsonl(raw_path)
            require(len(raw) == 1, 'raw_count')
            report['model_calls_completed'] += 1
            checkpoint()
            require(not triggered and raw[0]['eos_reached'], 'deadline_or_non_eos_no_retry')
        (OUTPUT / 'after_native_fit.jsonl').write_bytes(b''.join((OUTPUT / f'case{i}_raw.jsonl').read_bytes() for i in range(1, 10)))
        report.update(status='BRIDGE13_RAW_COMPLETE_PENDING_CONTENT_AND_NATIVE_CMEE_REVIEW', peak_allocated_bytes=torch.cuda.max_memory_allocated(), peak_reserved_bytes=torch.cuda.max_memory_reserved())
    except BaseException as exc:
        report.update(status='STOPPED_NO_RETRY', error_type=type(exc).__name__, reason=str(exc))
    finally:
        signal.setitimer(signal.ITIMER_REAL, 0)
        try:
            report['initial_adapter_unchanged'] = r.adapter_hashes(INITIAL) == pre['adapter_sha256']
            report['saved_adapter_unchanged_after_generation'] = (
                r.adapter_hashes(OUTPUT / 'adapter') == report['adapter_sha256']
                if 'adapter_sha256' in report else None)
            report['fixed_sources_unchanged'] = (
                sha(LEGACY / 'run_pilot.py') == HELPER
                and sha(NATIVE / 'run_quote_joint_fit.py') == JOINT
                and sha(__file__) == plan['runner_sha256']
                and all(sha(pack / n) == s['sha256'] for n, s in plan['payloads'].items()))
            if (not report['initial_adapter_unchanged'] or not report['fixed_sources_unchanged']
                    or report['saved_adapter_unchanged_after_generation'] is False):
                report.update(status='STOPPED_IDENTITY_MISMATCH_NO_RETRY')
        except (OSError, ValueError, KeyError) as exc:
            report.update(status='STOPPED_IDENTITY_UNVERIFIED_NO_RETRY', identity_error_type=type(exc).__name__)
        checkpoint()
        joint.archive(OUTPUT, r)
    print(report['status'], report['optimizer_steps_completed'], report['model_calls_completed'], flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--pack', type=Path, required=True)
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--source-commit')
    args = parser.parse_args()
    if args.execute:
        require(args.source_commit and len(args.source_commit) == 40 and all(x in '0123456789abcdef' for x in args.source_commit), 'source_commit_required')
        execute(args.pack.resolve(), args)
    else:
        require(os.environ.get('CUDA_VISIBLE_DEVICES') == '', 'cpu_only_required')
        *_, pre = prepare(args.pack.resolve())
        path = args.pack / 'bridge13_cpu_preflight.json'
        require(not path.exists(), 'preflight_already_exists')
        dump(path, pre)
        print('CPU_READY', [(x['id'], x['prompt_tokens'], x['assistant_eos_tokens']) for x in pre['rows']], flush=True)
        print('MODEL/FORWARD/TRAINING/GENERATION/SQL 0; GPU PLAN STILL REQUIRES MASH DECISION', flush=True)
