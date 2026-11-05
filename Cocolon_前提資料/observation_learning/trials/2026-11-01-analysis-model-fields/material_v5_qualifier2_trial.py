"""One trial targeting both omitted qualifiers in the unchanged RU02 teacher.

Full mean CE on all16 remains. The union of the two complete qualifier objects,
including their preceding commas, receives one coefficient1 mean-CE term.
No new gold, prompt, decoder constraint, meaning gate or normal model adoption.
"""
from dataclasses import asdict
import gc
import hashlib
import importlib.util
import inspect
import json
import os
from pathlib import Path
import random
import shutil
import signal
import subprocess
import sys
import threading
import time
import traceback
import zipfile

sys.dont_write_bytecode = True
os.environ['HF_HUB_OFFLINE'] = '1'
os.environ['TRANSFORMERS_OFFLINE'] = '1'
W = Path('/workspace')
PARENT = W / 'analysis-material-v5-residual2-20261105'
ROOT = W / 'analysis-material-v5-qualifier2-20261105'
PREVIOUS = W / 'material_v5_aligned16_trial.py'
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert sha(PREVIOUS) == '1fc65428f0772a017cfe71d2443ebf32d97e98137e851d2888eab4e645aa27e6'
spec = importlib.util.spec_from_file_location('previous_aligned16', PREVIOUS)
p = importlib.util.module_from_spec(spec)
spec.loader.exec_module(p)
h = p.h
INITIAL = PARENT / 'train/adapter'
WEIGHTS = '0587db632df33896d853191816106f13ef41e91440f19fdf08025f587ac3e99f'
CONFIG = 'a36e96af06b79cf1b2b9b36b528ee06b05cf82d21b7b4872f25d2d07aa9d0269'
PAIRS = {'RU02': 'YREASON01', 'AT04': 'AT04', 'AT11': 'AT11', 'AT17': 'AT17', 'AT24': 'AT24'}
LIMIT = 900
write = h.write


def check():
    p.check()
    assert sha(INITIAL / 'adapter_model.safetensors') == WEIGHTS
    assert sha(INITIAL / 'adapter_config.json') == CONFIG
    if (ROOT / 'cpu.json').exists():
        assert sha(__file__) == json.loads((ROOT / 'cpu.json').read_text())['runner_sha256']


def prepared(row):
    value = p.prepare_input(row)
    assert value.messages() == row['messages'] and value.request_ref == row['request_ref']
    return value


def prepare():
    start = time.monotonic()
    check()
    assert not ROOT.exists(), 'do_not_restart_root'
    from importlib.metadata import version
    from transformers import AutoTokenizer
    from serve_emlis_natural_reply import MODEL, REVISION, PINS
    assert {n: version(n) for n in PINS} == PINS
    tok = AutoTokenizer.from_pretrained(MODEL, revision=REVISION, local_files_only=True, trust_remote_code=False)
    parent_manifest = json.loads((PARENT / 'manifest.json').read_text())
    assert all(sha(PARENT / n) == v['sha256'] for n, v in parent_manifest.items())
    pack = json.loads((PARENT / 'pack.json').read_text())
    assert len(pack['teachers']) == 16 and len(pack['evaluation']) == 30
    encoded = json.loads((PARENT / 'encoded.json').read_text())
    for name in ('before', 'after', 'teacher_targets'):
        (ROOT / name).mkdir(parents=True, exist_ok=False)
    selected = {}
    already_matching = []
    by_eval = {r['id']: r for r in pack['evaluation']}
    for row in pack['teachers']:
        value = prepared(row)
        prompt = tok.apply_chat_template(value.messages(), enable_thinking=False, add_generation_prompt=True, tokenize=True, return_dict=False, truncation=False)
        full = tok.apply_chat_template(value.messages() + [dict(role='assistant', content=row['assistant_target'])], enable_thinking=False, add_generation_prompt=False, tokenize=True, return_dict=False, truncation=False)
        e = encoded[row['id']]
        assert full == e['input_ids'] and full[:len(prompt)] == prompt
        assert e['labels'] == [-100] * len(prompt) + full[len(prompt):]
        assert e['loss_start'] == len(prompt) - 1
        assert e['logits_positions'] == len(full) - len(prompt) + 1
        assert len(full) <= 8192 and len(prompt) + 2048 <= 8192
        assert tok.decode(full[len(prompt):], skip_special_tokens=False, clean_up_tokenization_spaces=False) == row['assistant_target'] + '<|im_end|>\n'
        target_receipt = h.bind_save(row, value, p.v.make_response(value, row['assistant_target']), ROOT / 'teacher_targets', row['id'])
        assert target_receipt['candidate'] == 'RETURNED'
        if row['id'] not in PAIRS:
            continue
        erow = by_eval[PAIRS[row['id']]]
        assert row['messages'] == erow['messages'] and row['request_ref'] == erow['request_ref']
        raw = (PARENT / 'after' / (erow['id'] + '.raw.txt')).read_text()
        if json.loads(row['assistant_target']) == json.loads(raw):
            already_matching.append(row['id'])
            continue
        assert row['id'] == 'RU02', 'only_observed_residual_row'
        target = row['assistant_target']
        prompt_text = tok.apply_chat_template(value.messages(), enable_thinking=False, add_generation_prompt=True, tokenize=False)
        full_text = tok.apply_chat_template(value.messages() + [dict(role='assistant', content=target)], enable_thinking=False, add_generation_prompt=False, tokenize=False)
        assert full_text.startswith(prompt_text)
        assert full_text[len(prompt_text):] == target + '<|im_end|>\n'
        with_offsets = tok(full_text, add_special_tokens=False, return_offsets_mapping=True)
        assert with_offsets['input_ids'] == full
        offsets = with_offsets['offset_mapping']; assert len(offsets) == len(full)
        parts = []
        parsed = json.loads(target)
        for scope, kind in [('WRITTEN_REASON', 'REASON_MARKER'), ('ATTRIBUTIVE_CONTENT', 'NEGATION')]:
            matches = [(u, q) for f in parsed['fields'] for u in f['units'] if u['scope_role'] == scope for q in u['qualifiers'] if q['kind'] == kind]
            assert len(matches) == 1
            unit, qualifier = matches[0]
            assert unit['qualifiers'].index(qualifier) > 0
            serialized = json.dumps(qualifier, ensure_ascii=False, sort_keys=True, separators=(',', ':'))
            assert target.count(serialized) == 1
            lo = target.index(serialized) - 1; hi = lo + 1 + len(serialized)
            assert target[lo:hi] == ',' + serialized
            absolute_start, absolute_end = len(prompt_text) + lo, len(prompt_text) + hi
            positions = [j for j, (a, b) in enumerate(offsets) if a < b and b > absolute_start and a < absolute_end]
            assert positions and positions == list(range(positions[0], positions[-1] + 1))
            assert all(len(prompt) <= j < len(full) for j in positions)
            indices = [j - len(prompt) for j in positions]
            assert all(0 <= i < len(full) - len(prompt) for i in indices)
            assert all(e['labels'][j] == full[j] for j in positions)
            parts.append(dict(scope_role=scope, qualifier_kind=kind, target_char_start=lo, target_char_end=hi, rendered_char_start=absolute_start, rendered_char_end=absolute_end, absolute_positions=positions, ce_indices=indices, token_ids=[full[j] for j in positions], token_offsets=[offsets[j] for j in positions], boundary_overlap_positions=[j for j in positions if offsets[j][0] < absolute_start or offsets[j][1] > absolute_end]))
        union = sorted({i for part in parts for i in part['ce_indices']})
        assert union and len(union) == sum(len(part['ce_indices']) for part in parts)
        common = 0
        while common < min(len(target), len(raw)) and target[common] == raw[common]:
            common += 1
        assert common == parts[0]['target_char_start'] and target[common] == ',' and raw[common] == ']'
        selected[row['id']] = dict(evaluation_id=erow['id'], prompt_tokens=len(prompt), parts=parts, ce_indices=union, first_character_divergence=common, selection='UNION_TOKEN_MEAN_NOT_EQUAL_OBJECT_WEIGHT', original_generated_ids_observed=False)
    baseline = []
    for row in pack['evaluation']:
        key = row['id']; value = prepared(row)
        for src in (PARENT / 'after').glob(key + '.*'):
            shutil.copyfile(src, ROOT / 'before' / src.name)
        req = json.loads((ROOT / 'before' / (key + '.request.json')).read_text())
        res = json.loads((ROOT / 'before' / (key + '.response.json')).read_text())
        raw = (ROOT / 'before' / (key + '.raw.txt')).read_text()
        assert req['messages'] == value.messages() and req['request_ref'] == value.request_ref
        assert res == asdict(p.v.make_response(value, raw, res['finish_reason'])) and res['finish_reason'] == 'stop'
        receipt = h.bind_save(row, value, p.v.make_response(value, raw), ROOT / 'before', key)
        for suffix in ('.candidate.json', '.typed.json', '.projection.json'):
            original = PARENT / 'after' / (key + suffix); copied = ROOT / 'before' / (key + suffix)
            assert original.exists() == copied.exists()
            if original.exists():
                assert original.read_bytes() == copied.read_bytes()
        baseline.append(dict(id=key, **receipt))
    assert sum(v['candidate'] == 'RETURNED' for v in baseline) == 30
    assert sum(v['typed'] == 'RETURNED' for v in baseline) == 19
    write(ROOT / 'pack.json', pack)
    write(ROOT / 'encoded.json', encoded)
    assert list(selected) == ['RU02']
    assert set(already_matching) == {'AT04', 'AT11', 'AT17', 'AT24'}
    write(ROOT / 'spans.json', selected)
    write(ROOT / 'before/report.json', dict(calls=baseline, reused_responses=30))
    shutil.copyfile(__file__, ROOT / 'runner.py')
    shutil.copyfile(PREVIOUS, ROOT / 'previous_runner.py')
    write(ROOT / 'cpu.json', dict(status='CPU_PASSED_NO_MODEL', seconds=time.monotonic() - start, runner_sha256=sha(__file__), teachers_unchanged=16, selected_rows=len(selected), selected_spans=len(selected['RU02']['parts']), selected_union_tokens=len(selected['RU02']['ce_indices']), target_character_spans=[[v['target_char_start'], v['target_char_end']] for v in selected['RU02']['parts']], already_matching_teacher_ids=already_matching, before_responses=30, before_candidates=30, before_typed=19, model_loads=0, model_forwards=0, max_seconds=LIMIT, normal_adoption=False))
    write(ROOT / 'cpu_manifest.json', {str(q.relative_to(ROOT)): sha(q) for q in ROOT.rglob('*') if q.is_file()})
    print((ROOT / 'cpu.json').read_text())


def deadline():
    return json.loads((ROOT / 'deadline.json').read_text())['monotonic_deadline']


def arm(end):
    def expired(*_):
        raise TimeoutError('qualifier2_bounded_deadline')
    signal.signal(signal.SIGALRM, expired)
    signal.signal(signal.SIGTERM, expired)
    signal.setitimer(signal.ITIMER_REAL, max(.001, end - time.monotonic()))


def train():
    check(); arm(deadline())
    import torch
    import torch.nn.functional as F
    from transformers import Qwen3_5ForConditionalGeneration
    from peft import PeftModel, get_peft_model_state_dict
    from safetensors.torch import load_file
    from serve_emlis_natural_reply import MODEL, REVISION
    pack = json.loads((ROOT / 'pack.json').read_text()); encoded = json.loads((ROOT / 'encoded.json').read_text()); selected = json.loads((ROOT / 'spans.json').read_text())
    assert list(selected) == ['RU02']
    directory = ROOT / 'train'; directory.mkdir()
    report = dict(status='STARTED', model_loads=1, updates=0, measurement_forwards=0, steps=[], measurements=[], span_measurements=[], selected_ids=list(selected), coefficient=1.0)
    model = None
    try:
        random.seed(pack['seed']); torch.manual_seed(pack['seed']); torch.cuda.manual_seed_all(pack['seed'])
        model = Qwen3_5ForConditionalGeneration.from_pretrained(MODEL, revision=REVISION, dtype=torch.bfloat16, device_map={'': 0}, attn_implementation='sdpa', local_files_only=True, trust_remote_code=False)
        model = PeftModel.from_pretrained(model, INITIAL, is_trainable=True, local_files_only=True)
        saved = load_file(INITIAL / 'adapter_model.safetensors'); loaded = get_peft_model_state_dict(model)
        assert len(saved) == len(loaded) == 112 and all(torch.equal(saved[k], loaded[k].detach().cpu()) for k in saved)
        del saved, loaded
        trainable = [q for q in model.parameters() if q.requires_grad]
        assert len(trainable) == 112 and sum(q.numel() for q in trainable) == 3833856
        assert all(m.p == 0 for m in model.modules() if isinstance(m, torch.nn.Dropout))
        assert getattr(getattr(model.config, 'text_config', model.config), 'attention_dropout', None) == 0
        torch.cuda.reset_peak_memory_stats()
        model.config.use_cache = False; model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={'use_reentrant': False}); model.enable_input_require_grads()
        def losses(key):
            e = encoded[key]; x = torch.tensor([e['input_ids']], device='cuda:0')
            out = model(input_ids=x, attention_mask=torch.ones_like(x), logits_to_keep=e['logits_positions'], use_cache=False)
            gold = torch.tensor(e['labels'][e['loss_start'] + 1:], device='cuda:0')
            assert out.logits.shape[:2] == (1, e['logits_positions']) and (gold >= 0).all()
            ce = F.cross_entropy(out.logits[0, :-1].float(), gold, reduction='none')
            assert torch.isfinite(ce).all()
            return ce
        def measure(phase):
            model.eval(); values = {}; local = {}
            with torch.no_grad():
                for key in pack['measurement_ids']:
                    assert time.monotonic() < deadline()
                    ce = losses(key); values[key] = float(ce.mean()); report['measurement_forwards'] += 1
                    if key in selected:
                        row = selected[key]
                        local[key] = dict(union_mean=float(ce[row['ce_indices']].mean()), parts=[dict(kind=part['qualifier_kind'], mean_ce=float(ce[part['ce_indices']].mean()), tokens=len(part['ce_indices'])) for part in row['parts']])
            report['measurements'].append(dict(phase=phase, losses=values, mean=sum(values.values()) / len(values)))
            report['span_measurements'].append(dict(phase=phase, losses=local)); write(directory / 'report.json', report)
        measure('before')
        optimizer = torch.optim.AdamW(trainable, lr=pack['learning_rate'], weight_decay=0.)
        model.train()
        for step, key in enumerate(pack['update_order'], 1):
            assert time.monotonic() < deadline()
            optimizer.zero_grad(set_to_none=True); ce = losses(key)
            loss = ce.mean()
            indices = selected[key]['ce_indices'] if key in selected else None
            extra = ce[indices].mean() if indices is not None else None
            if extra is not None:
                loss = loss + extra
            loss.backward()
            assert all(q.grad is None or torch.isfinite(q.grad).all() for q in trainable)
            norm = torch.nn.utils.clip_grad_norm_(trainable, 1.); assert torch.isfinite(norm)
            optimizer.step(); report['updates'] = step
            report['steps'].append(dict(id=key, step=step, mean_ce=float(ce.mean().detach()), selected_tokens=len(indices) if indices is not None else 0, extra_union_mean_ce=float(extra.detach()) if extra is not None else None, objective=float(loss.detach()), gradient_norm=float(norm)))
            write(directory / 'report.json', report)
        optimizer.zero_grad(set_to_none=True); optimizer = None
        measure('after')
        assert report['updates'] == 16 and report['measurement_forwards'] == 32
        model.save_pretrained(directory / 'adapter', safe_serialization=True)
        saved = load_file(directory / 'adapter/adapter_model.safetensors'); actual = get_peft_model_state_dict(model)
        assert len(saved) == len(actual) == 112 and all(torch.isfinite(v).all() and torch.equal(v, actual[k].detach().cpu()) for k, v in saved.items())
        report.update(status='COMPLETE_NOT_ADOPTED', weights_sha256=sha(directory / 'adapter/adapter_model.safetensors'), config_sha256=sha(directory / 'adapter/adapter_config.json'), peak_allocated_gib=torch.cuda.max_memory_allocated() / 2**30)
    except BaseException:
        report.update(status='FAILED_NO_RETRY', traceback=traceback.format_exc()); raise
    finally:
        signal.setitimer(signal.ITIMER_REAL, 0)
        try:
            if model is not None and report['status'] != 'COMPLETE_NOT_ADOPTED':
                model.save_pretrained(directory / 'partial_adapter', safe_serialization=True)
        except BaseException:
            report['partial_save_error'] = traceback.format_exc()
        finally:
            write(directory / 'report.json', report)


def after():
    check(); arm(deadline())
    from serve_emlis_natural_reply import load_generator
    trained = json.loads((ROOT / 'train/report.json').read_text()); assert trained['status'] == 'COMPLETE_NOT_ADOPTED'
    report = dict(status='STARTED', model_loads=1, calls=[])
    try:
        generator = load_generator(str(ROOT / 'train/adapter'), threading.Event(), weights_sha256=trained['weights_sha256'], config_sha256=trained['config_sha256'])
        for row in json.loads((ROOT / 'pack.json').read_text())['evaluation']:
            assert time.monotonic() < deadline()
            key = row['id']; value = prepared(row)
            write(ROOT / 'after' / (key + '.request.json'), dict(request_ref=value.request_ref, messages=value.messages(), messages_sha256=hashlib.sha256(h.canonical(value.messages()).encode()).hexdigest()))
            raw, finish = generator(value.messages(), min(deadline(), time.monotonic() + 45))
            (ROOT / 'after' / (key + '.raw.txt')).write_text(raw)
            response = p.v.make_response(value, raw, finish)
            write(ROOT / 'after' / (key + '.response.json'), asdict(response))
            assert finish == 'stop'
            report['calls'].append(dict(id=key, finish=finish, **h.bind_save(row, value, response, ROOT / 'after', key)))
            write(ROOT / 'after/report.json', report)
        report['status'] = 'COMPLETE_PENDING_SEMANTIC_REVIEW'
    finally:
        write(ROOT / 'after/report.json', report)


def run():
    check()
    assert all(sha(ROOT / n) == v for n, v in json.loads((ROOT / 'cpu_manifest.json').read_text()).items())
    assert not subprocess.check_output(['nvidia-smi', '--query-compute-apps=pid', '--format=csv,noheader'], text=True).strip()
    with (ROOT / 'run_started.json').open('x') as f:
        json.dump(dict(started=time.time(), max_seconds=LIMIT), f)
    write(ROOT / 'deadline.json', dict(monotonic_deadline=time.monotonic() + LIMIT))
    with (ROOT / 'training_started.json').open('x') as f:
        json.dump(dict(started=time.time()), f)
    report = dict(status='STARTED', stages=[], normal_adoption=False)
    try:
        for phase in ('train', 'after'):
            with (ROOT / (phase + '.log')).open('w') as log:
                result = subprocess.run([sys.executable, __file__, phase], stdout=log, stderr=subprocess.STDOUT, timeout=max(.001, deadline() - time.monotonic()) + 30)
            report['stages'].append(dict(phase=phase, exit=result.returncode)); write(ROOT / 'run_report.json', report)
            assert result.returncode == 0, phase
        report['status'] = 'COMPLETE_PENDING_FULL_REVIEW_NOT_ADOPTED'
    except BaseException:
        report.update(status='FAILED_NO_RETRY_NOT_ADOPTED', traceback=traceback.format_exc()); raise
    finally:
        report['elapsed_since_run_start'] = time.time() - json.loads((ROOT / 'run_started.json').read_text())['started']
        report['initial_unchanged'] = sha(INITIAL / 'adapter_model.safetensors') == WEIGHTS and sha(INITIAL / 'adapter_config.json') == CONFIG
        write(ROOT / 'run_report.json', report)


def collect():
    check()
    import analysis_cumulative_service as service
    rows = json.loads((ROOT / 'pack.json').read_text())['evaluation']; saved = []; comparisons = []
    for phase in ('before', 'after'):
        for row in rows:
            key = row['id']; directory = ROOT / phase; rp = directory / (key + '.response.json')
            if not rp.exists():
                continue
            value = prepared(row); response = json.loads(rp.read_text()); raw = (directory / (key + '.raw.txt')).read_text(); req = json.loads((directory / (key + '.request.json')).read_text())
            assert response == asdict(p.v.make_response(value, raw, response['finish_reason'])) and req['messages'] == value.messages() and req['request_ref'] == value.request_ref
            replayed = []
            with h.guard_saved():
                for suffix, reader, kwargs in [('.candidate.json', service.reload_cumulative_quoted_parent_candidates, {}), ('.typed.json', service.reload_cumulative_written_role_map, dict(with_action=row.get('with_action', False)))]:
                    f = directory / (key + suffix)
                    if f.exists():
                        artifact, coverage = reader(row['owner'], row['snapshot'], f.read_text(), **kwargs); replayed.append(suffix)
                        if suffix == '.typed.json':
                            projection = dict(graph=asdict(artifact.graph), text=artifact.safe_text_projection(authenticated_owner_scope=row['owner']), diagram=artifact.safe_projection(authenticated_owner_scope=row['owner']))
                            assert h.canonical(projection) == h.canonical(json.loads((directory / (key + '.projection.json')).read_text()))
            saved.append(dict(phase=phase, id=key, replayed=replayed))
    for row in rows:
        key = row['id']; a = ROOT / 'before' / (key + '.projection.json'); b = ROOT / 'after' / (key + '.projection.json')
        item = dict(id=key, before_typed=a.exists(), after_typed=b.exists())
        if a.exists() and b.exists():
            aa, bb = json.loads(a.read_text()), json.loads(b.read_text())
            item.update(graph_equal=aa['graph'] == bb['graph'], visible_equal=p.visible(aa) == p.visible(bb))
        comparisons.append(item)
    write(ROOT / 'collection.json', dict(saved=saved, comparisons=comparisons, gpu=subprocess.check_output(['nvidia-smi', '--query-gpu=memory.used,utilization.gpu', '--format=csv,noheader'], text=True).strip(), compute_apps=subprocess.check_output(['nvidia-smi', '--query-compute-apps=pid', '--format=csv,noheader'], text=True).strip()))
    write(ROOT / 'manifest.json', {str(q.relative_to(ROOT)): dict(bytes=q.stat().st_size, sha256=sha(q)) for q in ROOT.rglob('*') if q.is_file() and q.name != 'manifest.json'})
    archive = W / 'cocolon-analysis-material-v5-qualifier2-20261105.zip'
    with zipfile.ZipFile(archive, 'x', zipfile.ZIP_DEFLATED) as z:
        for q in sorted(ROOT.rglob('*')):
            if q.is_file():
                z.write(q, str(q.relative_to(ROOT)))
    print(json.dumps(dict(archive=str(archive), bytes=archive.stat().st_size, sha256=sha(archive))))


if __name__ == '__main__':
    {'prepare': prepare, 'train': train, 'after': after, 'run': run, 'collect': collect}[sys.argv[1]]()
