"""One bounded composition-teaching trial, preserving prior RU02 qualifier objective.

Full mean CE on24 rows with prior RU02 union coefficient1 unchanged.
Four original teachers are reused; four independently authored teaching sources
are added. Held QF checking sources/raw never enter training. No gate changes.
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
PARENT = W / 'analysis-material-v5-qualifier2-20261105'
NEAR = W / 'analysis-material-v5-qualifier-near4-20261105'
INPUT = W / 'analysis_composition4_private_teachers.json'
INPUT_SHA = '6f92b1e106cedfb9d5cd3d380d79477b95567aba970b0c62cdd70cdc66767a2e'
ROOT = W / 'analysis-material-v5-composition24-20261105'
PREVIOUS = W / 'material_v5_aligned16_trial.py'
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert sha(PREVIOUS) == '1fc65428f0772a017cfe71d2443ebf32d97e98137e851d2888eab4e645aa27e6'
spec = importlib.util.spec_from_file_location('previous_aligned16', PREVIOUS)
p = importlib.util.module_from_spec(spec)
spec.loader.exec_module(p)
h = p.h
INITIAL = PARENT / 'train/adapter'
WEIGHTS = '7ba4e6e07f69e377b99052d1a795bfa833476c46ae643ec1abc2b638ca64efaa'
CONFIG = '933c124413a8486d79a5da3c151321cf8d0e1622165b6241ddde38939933721c'
PAIRS = {'RU02': 'YREASON01', 'AT04': 'AT04', 'AT11': 'AT11', 'AT17': 'AT17', 'AT24': 'AT24'}
LIMIT = 900
write = h.write


def check():
    p.check()
    assert sha(INPUT) == INPUT_SHA
    assert sha(INITIAL / 'adapter_model.safetensors') == WEIGHTS
    assert sha(INITIAL / 'adapter_config.json') == CONFIG
    if (ROOT / 'cpu.json').exists():
        assert sha(__file__) == json.loads((ROOT / 'cpu.json').read_text())['runner_sha256']


def prepared(row):
    value = p.prepare_input(row)
    assert value.messages() == row['messages'] and value.request_ref == row['request_ref']
    return value


def prepare():
    started = time.monotonic(); check(); assert not ROOT.exists(), 'do_not_restart_root'
    import copy
    from importlib.metadata import version
    from transformers import AutoTokenizer
    from serve_emlis_natural_reply import MODEL, REVISION, PINS
    assert {n: version(n) for n in PINS} == PINS
    tok = AutoTokenizer.from_pretrained(MODEL, revision=REVISION, local_files_only=True, trust_remote_code=False)
    for parent in (PARENT, NEAR):
        assert all(sha(parent / n) == v['sha256'] for n, v in json.loads((parent / 'manifest.json').read_text()).items())
    pack = json.loads((PARENT / 'pack.json').read_text())
    assert len(pack['teachers']) == 16 and len(pack['evaluation']) == 30
    original = json.loads(p.SOURCE.read_text()); assert len(original['teachers']) == 90
    originals = {r['id']: r for r in original['teachers']}
    new = json.loads(INPUT.read_text()); assert new['reuse_ids'] == ['AT03','AT08','ST03','AT29'] and len(new['rows']) == 4
    held = json.loads((NEAR / 'pack.json').read_text())['evaluation']; assert len(held) == 4
    seen = {(m['original']['memo'],m['original']['memo_action']) for r in original['teachers'] + pack['evaluation'] + held for m in r['snapshot']['members']}
    for r in new['rows']:
        assert r['training_use'] is True and r['id'].startswith('CP')
        assert all((m['original']['memo'],m['original']['memo_action']) not in seen for m in r['snapshot']['members'])
    teachers = []
    # Preserve the original16 order; interleave the eight added composition contrasts.
    base_rows = copy.deepcopy(pack['teachers'])
    extra = [copy.deepcopy(originals[k]) for k in new['reuse_ids']] + copy.deepcopy(new['rows'])
    for i,row in enumerate(base_rows):
        teachers.append(row)
        if i % 2 == 1: teachers.append(extra[i//2])
    assert len(teachers) == 24 and len({r['id'] for r in teachers}) == 24
    for name in ('before','after','teacher_targets'): (ROOT / name).mkdir(parents=True, exist_ok=False)
    encoded = {}; audits = []
    old_encoded = json.loads((PARENT / 'encoded.json').read_text())
    for row in teachers:
        value = p.prepare_input(row)
        row.update(messages=value.messages(),request_ref=value.request_ref)
        prompt = tok.apply_chat_template(value.messages(),enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
        full = tok.apply_chat_template(value.messages()+[dict(role='assistant',content=row['assistant_target'])],enable_thinking=False,add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
        assert full[:len(prompt)] == prompt and len(prompt)<len(full)<=8192 and len(prompt)+2048<=8192
        assert tok.decode(full[len(prompt):],skip_special_tokens=False,clean_up_tokenization_spaces=False)==row['assistant_target']+'<|im_end|>\n'
        encoded[row['id']] = dict(input_ids=full,labels=[-100]*len(prompt)+full[len(prompt):],loss_start=len(prompt)-1,logits_positions=len(full)-len(prompt)+1)
        if row['id'] in old_encoded: assert encoded[row['id']] == old_encoded[row['id']]
        if row['id'] in new['reuse_ids']: assert row['assistant_target'] == originals[row['id']]['assistant_target']
        receipt = h.bind_save(row,value,p.v.make_response(value,row['assistant_target']),ROOT/'teacher_targets',row['id'])
        assert receipt['candidate']=='RETURNED'
        audits.append(dict(id=row['id'],prompt_tokens=len(prompt),target_tokens=len(full)-len(prompt),**receipt))
    evaluation = copy.deepcopy(pack['evaluation']) + copy.deepcopy(held)
    baseline = []
    for row in evaluation:
        key=row['id']; value=prepared(row); parent=NEAR if key.startswith('QF') else PARENT
        for src in (parent/'after').glob(key+'.*'): shutil.copyfile(src,ROOT/'before'/src.name)
        raw=(ROOT/'before'/(key+'.raw.txt')).read_text(); res=json.loads((ROOT/'before'/(key+'.response.json')).read_text()); req=json.loads((ROOT/'before'/(key+'.request.json')).read_text())
        assert req['messages']==value.messages() and req['request_ref']==value.request_ref
        assert res==asdict(p.v.make_response(value,raw,res['finish_reason'])) and res['finish_reason']=='stop'
        receipt=h.bind_save(row,value,p.v.make_response(value,raw),ROOT/'before',key)
        for suffix in ('.candidate.json','.typed.json','.projection.json'):
            a=parent/'after'/(key+suffix); b=ROOT/'before'/(key+suffix)
            assert a.exists()==b.exists()
            if a.exists(): assert a.read_bytes()==b.read_bytes()
        baseline.append(dict(id=key,**receipt))
    for row in teachers:
        if row['id'].startswith('CP'): evaluation.append(copy.deepcopy(row))
    assert len(evaluation)==38 and sum(r['typed']=='RETURNED' for r in baseline)==19
    pack.update(teachers=teachers,evaluation=evaluation,update_order=[r['id'] for r in teachers],measurement_ids=[r['id'] for r in teachers],initial_weights_sha256=WEIGHTS,initial_config_sha256=CONFIG,new_calls=38,model_loads=2,max_seconds=LIMIT,new_teaching_sources=4,reused_teaching_sources=4,held_checking_sources_not_trained=4,normal_adoption=False)
    write(ROOT/'pack.json',pack);write(ROOT/'encoded.json',encoded)
    shutil.copyfile(PARENT/'spans.json',ROOT/'spans.json')
    shutil.copyfile(INPUT,ROOT/'private_teaching_inputs.json');shutil.copyfile(__file__,ROOT/'runner.py')
    write(ROOT/'before/report.json',dict(calls=baseline,reused_responses=34))
    write(ROOT/'teacher_audit.json',audits)
    write(ROOT/'cpu.json',dict(status='CPU_PASSED_NO_MODEL',seconds=time.monotonic()-started,runner_sha256=sha(__file__),input_sha256=INPUT_SHA,teachers=24,original90_unchanged=True,original16_encoded_unchanged=True,existing4_targets_bytes_unchanged=True,new_independent_teaching=4,held4_not_trained=True,before_responses=34,before_candidates=34,before_typed=19,model_loads=0,model_forwards=0,planned_updates=24,planned_measurements=48,planned_new_generations=38,max_seconds=LIMIT,normal_adoption=False))
    write(ROOT/'cpu_manifest.json',{str(f.relative_to(ROOT)):sha(f) for f in ROOT.rglob('*') if f.is_file()})
    print((ROOT/'cpu.json').read_text())


def deadline():
    return json.loads((ROOT / 'deadline.json').read_text())['monotonic_deadline']


def arm(end):
    def expired(*_):
        raise TimeoutError('composition24_bounded_deadline')
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
        assert report['updates'] == 24 and report['measurement_forwards'] == 48
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
    archive = W / 'cocolon-analysis-material-v5-composition24-20261105.zip'
    with zipfile.ZipFile(archive, 'x', zipfile.ZIP_DEFLATED) as z:
        for q in sorted(ROOT.rglob('*')):
            if q.is_file():
                z.write(q, str(q.relative_to(ROOT)))
    print(json.dumps(dict(archive=str(archive), bytes=archive.stat().st_size, sha256=sha(archive))))


if __name__ == '__main__':
    {'prepare': prepare, 'train': train, 'after': after, 'run': run, 'collect': collect}[sys.argv[1]]()
