"""Proposed once-only SHOP prefix comparison. Approval is required before 4B load.

Use the real generate cache path, forcing only the already preserved raw prefix.
Compare its two saved positions with full-prefix no-cache logits. No new free
token, candidate, optimizer, backward, CMEE, or product adoption is produced.
"""
import argparse
import gc
import hashlib
import importlib.metadata
import importlib.util
import inspect
import json
import math
import os
from pathlib import Path
import signal
import sys
import time
import traceback

sys.dont_write_bytecode = True
W = Path('/workspace')
HERE = Path(__file__).resolve().parent
OUT = W / 'cocolon_cache_prefix_shop_run_20261030'
CPU = W / 'cocolon_continuation17_cpu_20261030'
PRIOR_RUN = W / 'cocolon_continuation17_run_20261030'
PACK = W / 'cocolon_fixedrows5_pack_20261029'
CASE = 'FT-SHOP-AFTER-ANSWER'

def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def need(ok, message):
    if not ok:
        raise ValueError(message)

def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module

def write(path, value):
    path = Path(path)
    tmp = path.with_suffix(path.suffix + '.tmp')
    tmp.write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + '\n')
    tmp.replace(path)

def execute(source):
    plan = json.loads((HERE / 'plan.json').read_text())
    need(plan['status'] == 'MASH_EXPLICITLY_APPROVED_ONCE', 'new_paid_prefix_comparison_approval_required')
    need((plan['max_process_seconds'], plan['max_model_loads'], plan['max_core_forwards'],
          plan['max_forced_replays'], plan['max_free_generations'], plan['max_updates']) ==
         (180, 1, 476, 1, 0, 0), 'approved_envelope_changed')
    need(sha(__file__) == plan['runner_sha256'], 'runner_changed')
    need(len(source) == 40 and all(c in '0123456789abcdef' for c in source), 'source_commit_required')
    parent = (Path('/proc') / str(os.getppid()) / 'cmdline').read_bytes().split(bytes([0]))
    need(parent[0].rsplit(b'/', 1)[-1] == b'timeout' and
         all(x in parent for x in (b'--signal=TERM', b'--kill-after=10s', b'170s')), '180s_parent_required')
    need(os.environ.get('HF_HUB_OFFLINE') == os.environ.get('TRANSFORMERS_OFFLINE') == '1', 'offline_required')
    need(sha(HERE / 'prefix_points.json') == plan['prefix_points_sha256'], 'points_changed')
    points = json.loads((HERE / 'prefix_points.json').read_text())
    selected = next(c for c in points['cases'] if c['case_id'] == CASE)
    need([p['raw_prefix_tokens'] for p in selected['points']] == [292, 473], 'positions_changed')
    need(sha(CPU / 'train_messages11.jsonl') == plan['train_messages_sha256'], 'messages_changed')
    prior_run = json.loads((PRIOR_RUN / 'run.json').read_text())
    need(prior_run['status'] == 'STOPPED_NO_RETRY' and prior_run['source_commit'] == plan['prior_run_source'], 'prior_identity_changed')
    raw_path = PRIOR_RUN / ('after_' + CASE + '.jsonl')
    need(sha(raw_path) == selected['raw_file_sha256'], 'raw_changed')
    raw = json.loads(raw_path.read_text())
    need(raw['adapter_revision'] == plan['adapter_files_sha256']['adapter_model.safetensors'], 'raw_adapter_changed')
    library_files = {W / n: h for n, h in plan['installed_source_sha256'].items()}
    need(all(sha(p) == h for p, h in library_files.items()), 'installed_source_changed')
    adapter = PRIOR_RUN / 'adapter'
    need(all(sha(adapter / n) == h for n, h in plan['adapter_files_sha256'].items()), 'adapter_changed')
    old = load('prefix_shop_existing_loader', PACK / 'run_fixed_rows5.py')
    _, prior, helper, bound = old.owners()
    need(all(sha(p) == h for p, h in bound.items()), 'existing_owner_changed')
    OUT.mkdir(exist_ok=False)
    started = time.monotonic()
    report = dict(status='STARTED_ONCE', source_commit=source, plan=plan, started_unix=time.time(),
                  model_loads_started=0, model_loads_completed=0, core_forwards_started=0,
                  core_forwards_completed=0, cached_forwards_started=0, uncached_forwards_started=0,
                  generate_api_calls_started=0, forced_replays_completed=0, forced_prefix_tokens=0,
                  free_generations=0, updates=0, new_cmee_calls=0, comparisons=[], retry=False,
                  product_credit=0, automatic_progression=False)
    model = core = processor = None
    cached_rows, reference_rows = {}, {}
    handles = []
    def checkpoint():
        report['elapsed_seconds'] = time.monotonic() - started
        write(OUT / 'run.json', report)
    def expired(*_):
        raise TimeoutError('prefix_shop_deadline_no_retry')
    signal.signal(signal.SIGALRM, expired)
    signal.signal(signal.SIGTERM, expired)
    signal.setitimer(signal.ITIMER_REAL, 180)
    checkpoint()
    try:
        import torch
        from safetensors.torch import save_file
        from transformers import AutoTokenizer, GenerationConfig, GenerationMixin, LogitsProcessorList
        need({n: importlib.metadata.version(n) for n in helper.PINS} == helper.PINS, 'dependencies_changed')
        for name, expected in plan['generation_methods_sha256'].items():
            need(hashlib.sha256(inspect.getsource(getattr(GenerationMixin, name)).encode()).hexdigest() == expected,
                 'installed_generation_method_changed')
        need(os.environ.get('RUNPOD_POD_ID') == 'vgkm402msgroiu' and torch.cuda.device_count() == 1, 'pod_changed')
        report['gpu'] = helper.gpu_profile(torch, {'minimum_free_gib': 14})
        need(report['gpu']['name'] == 'NVIDIA RTX A5000', 'gpu_changed')
        torch.cuda.reset_peak_memory_stats()
        tokenizer = AutoTokenizer.from_pretrained(helper.MODEL, revision=helper.REVISION, local_files_only=True, trust_remote_code=False)
        recovery = prior.module('prefix_shop_adapter_owner', old.BUNDLE / 'support/run_expanded15_recovery.py')
        recovery.OLDPACK = old.BUNDLE / 'support'
        recovery.ORIGIN = old.BUNDLE / 'archive/run'
        owner, _, _ = recovery.owner_with_checked_suffixes()
        report['model_loads_started'] = 1
        checkpoint()
        model, tensors = owner.load_expanded_adapter(helper, adapter, plan['adapter_files_sha256'], trainable=False)
        report['model_loads_completed'] = 1
        need(not model.training and not any(p.requires_grad for p in model.parameters()), 'nontraining_required')
        core = model.get_base_model()
        need(type(core).__name__ == 'Qwen3_5ForConditionalGeneration', 'core_class_changed')
        write(OUT / 'loaded_tensors.json', tensors)
        rows = [json.loads(line) for line in (CPU / 'train_messages11.jsonl').read_text().splitlines()]
        row = next(x for x in rows if x['id'] == CASE)
        prompt = helper.chat_token_ids(tokenizer, row['messages'][:-1], generation_prompt=True)
        raw_ids = raw['output_token_ids']
        gold = tokenizer.encode(row['messages'][-1]['content'], add_special_tokens=False)
        need(len(prompt) == 4447 and len(raw_ids) == 3584, 'length_changed')
        need(raw_ids[:292] == gold[:292] and raw_ids[292] != gold[292], 'first_divergence_changed')
        point_map = {p['raw_prefix_tokens']: p for p in selected['points']}
        for n, point in point_map.items():
            need(hashlib.sha256(json.dumps(prompt + raw_ids[:n], separators=(',', ':')).encode()).hexdigest() == point['input_ids_sha256'], 'point_input_changed')
        write(OUT / 'points.json', selected)
        def save_vectors(name, values):
            path = OUT / name
            tmp = path.with_suffix('.tmp')
            save_file(values, str(tmp), metadata={'purpose': 'diagnostic logits only; not model weights'})
            tmp.replace(path)
        def before_forward(module, args, kwargs):
            need(report['core_forwards_started'] < 476, 'forward_limit')
            report['core_forwards_started'] += 1
            key = 'cached_forwards_started' if kwargs.get('use_cache') is True else 'uncached_forwards_started'
            report[key] += 1
        def after_forward(module, args, kwargs, output):
            report['core_forwards_completed'] += 1
        handles.append(core.register_forward_pre_hook(before_forward, with_kwargs=True))
        handles.append(core.register_forward_hook(after_forward, with_kwargs=True))
        def describe(scores, observed, teacher=None):
            scores = scores.float()
            need(torch.isfinite(scores).all().item(), 'nonfinite_logit')
            values, ids = torch.topk(scores, 5)
            actual_logit = float(scores[observed])
            result = dict(argmax=int(torch.argmax(scores)), observed_id=observed,
                          observed_rank=int((scores > scores[observed]).sum()) + 1,
                          observed_logit=actual_logit, top1_minus_observed=float(values[0]) - actual_logit,
                          top1_top2_margin=float(values[0] - values[1]),
                          top5=[dict(id=int(i), logit=float(v), text=tokenizer.decode([int(i)], skip_special_tokens=False)) for i, v in zip(ids, values)])
            if teacher is not None:
                result['teacher_id'] = teacher
                result['teacher_rank'] = int((scores > scores[teacher]).sum()) + 1
                result['teacher_logit'] = float(scores[teacher])
            return result
        class ForcedRawPrefix:
            def __init__(self):
                self.callbacks = 0
                self.seen = set()
            def __call__(self, input_ids, scores):
                n = input_ids.shape[1] - len(prompt)
                need(input_ids.shape[0] == scores.shape[0] == 1 and 0 <= n <= 473, 'callback_shape_or_limit')
                need(n == self.callbacks and input_ids[0].tolist() == prompt + raw_ids[:n], 'forced_prefix_changed')
                self.callbacks += 1
                if n in point_map:
                    cached_rows[str(n)] = scores[0].detach().float().cpu().contiguous()
                    need(torch.isfinite(cached_rows[str(n)]).all().item(), 'nonfinite_cached_logit')
                    save_vectors('cached_logits.safetensors', cached_rows)
                    self.seen.add(n)
                    report['cached_points_saved'] = sorted(self.seen)
                    checkpoint()
                if n == 473:
                    need(self.seen == {292, 473}, 'comparison_missing')
                need(torch.isfinite(scores[0, raw_ids[n]]).item(), 'forced_token_has_nonfinite_score')
                scores.fill_(-float('inf'))
                scores[0, raw_ids[n]] = 0
                report['forced_prefix_tokens'] = n + 1
                return scores
        processor = ForcedRawPrefix()
        eos = model.generation_config.eos_token_id or tokenizer.eos_token_id
        eos_ids = {eos} if isinstance(eos, int) else set(eos)
        need(not any(t in eos_ids for t in raw_ids[:474]), 'eos_inside_fixed_prefix')
        settings = GenerationConfig(do_sample=False, num_beams=1, max_new_tokens=474,
            eos_token_id=eos, pad_token_id=tokenizer.pad_token_id if tokenizer.pad_token_id is not None else tokenizer.eos_token_id,
            use_cache=True)
        batch = torch.tensor([prompt], dtype=torch.long, device='cuda:0')
        report['generate_api_calls_started'] = 1
        checkpoint()
        with torch.inference_mode():
            replay = model.generate(input_ids=batch, attention_mask=torch.ones_like(batch),
                                    generation_config=settings, logits_processor=LogitsProcessorList([processor]))
        need(replay[0].tolist() == prompt + raw_ids[:474], 'replay_output_changed')
        report['forced_replays_completed'] = 1
        replay = None
        need(report['cached_forwards_started'] == 474 and report['uncached_forwards_started'] == 0 and
             set(cached_rows) == {'292', '473'}, 'cached_replay_counts_changed')
        report['stage'] = 'CACHED_REPLAY_COMPLETE_UNCACHED_REFERENCES_PENDING'
        checkpoint()
        # Full-prefix references run only after generate has left its decode-
        # optimization and PEFT preparation contexts. No reference forward is
        # nested inside the cached decode callback.
        for n in sorted(point_map):
            full = torch.tensor([prompt + raw_ids[:n]], dtype=torch.long, device='cuda:0')
            attention = torch.ones_like(full)
            positions = core._prepare_position_ids_for_generation(full, {'attention_mask': attention, 'use_cache': False})
            prepared = core.prepare_inputs_for_generation(full, attention_mask=attention,
                position_ids=positions, past_key_values=None, use_cache=False,
                logits_to_keep=1, is_first_iteration=True)
            need(prepared['input_ids'].tolist() == full.tolist() and prepared.get('past_key_values') is None,
                 'reference_prefix_changed')
            with torch.inference_mode():
                output = model(**prepared, return_dict=True)
            reference_rows[str(n)] = output.logits[0, -1].detach().float().cpu().contiguous()
            cached_logits, reference_logits = cached_rows[str(n)], reference_rows[str(n)]
            need(cached_logits.shape == reference_logits.shape, 'logit_shape_changed')
            save_vectors('uncached_logits.safetensors', reference_rows)
            delta = (cached_logits - reference_logits).abs()
            observed = raw_ids[n]
            teacher = gold[n] if n == 292 else None
            report['comparisons'].append(dict(label=point_map[n]['label'], raw_prefix_tokens=n,
                total_input_tokens=full.shape[1], input_ids_sha256=point_map[n]['input_ids_sha256'],
                cached=describe(cached_logits, observed, teacher), uncached=describe(reference_logits, observed, teacher),
                max_abs_logit_difference=float(delta.max()), mean_abs_logit_difference=float(delta.mean()),
                same_argmax=bool(cached_logits.argmax() == reference_logits.argmax()),
                teacher_at_syntax_point_not_used_as_gold=True))
            full = attention = positions = prepared = output = delta = cached_logits = reference_logits = None
            checkpoint()
        need(report['cached_forwards_started'] == 474 and report['uncached_forwards_started'] == 2 and
             report['core_forwards_started'] == report['core_forwards_completed'] == 476 and
             report['forced_prefix_tokens'] == 474 and len(report['comparisons']) == 2, 'forward_or_replay_counts_changed')
        need(helper.adapter_hashes(adapter) == plan['adapter_files_sha256'], 'weights_changed')
        report['status'] = 'DIAGNOSTIC_COMPLETE_NO_ADOPTION_NO_FREE_GENERATION'
    except BaseException as exc:
        report.update(status='STOPPED_NO_RETRY', error_type=type(exc).__name__, reason=str(exc), traceback=traceback.format_exc())
    finally:
        for handle in handles:
            handle.remove()
        handles.clear()
        model = core = processor = cached_logits = reference_logits = None
        cached_rows.clear()
        reference_rows.clear()
        gc.collect()
        if 'torch' in sys.modules and sys.modules['torch'].cuda.is_initialized():
            torch = sys.modules['torch']
            report['peak_allocated_bytes'] = torch.cuda.max_memory_allocated()
            report['peak_reserved_bytes'] = torch.cuda.max_memory_reserved()
            torch.cuda.empty_cache()
        try:
            need(all(sha(p) == h for p, h in bound.items()) and
                 all(sha(p) == h for p, h in library_files.items()) and
                 helper.adapter_hashes(adapter) == plan['adapter_files_sha256'] and
                 sha(raw_path) == selected['raw_file_sha256'] and
                 sha(CPU / 'train_messages11.jsonl') == plan['train_messages_sha256'], 'source_input_or_weight_changed')
            report['inputs_source_weights_unchanged'] = True
        except BaseException as exc:
            report.update(status='STOPPED_IDENTITY_UNVERIFIED_NO_RETRY', identity_error=str(exc))
        signal.setitimer(signal.ITIMER_REAL, 0)
        report['processing_seconds'] = time.monotonic() - started
        report['process_cost_usd'] = report['processing_seconds'] * .28 / 3600
        checkpoint()
    print(json.dumps({k: report.get(k) for k in ('status', 'core_forwards_completed', 'forced_replays_completed', 'free_generations', 'processing_seconds', 'process_cost_usd')}), flush=True)
    return 0 if report['status'] == 'DIAGNOSTIC_COMPLETE_NO_ADOPTION_NO_FREE_GENERATION' else 1

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--source-commit')
    args = parser.parse_args()
    if not args.execute:
        parser.error('explicit --execute and new Mash approval required')
    raise SystemExit(execute(args.source_commit))
