"""One untrained near-transfer comparison, no learning or normal adoption."""
from dataclasses import asdict
import hashlib
import importlib.util
import json
import os
from pathlib import Path
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
ROOT = W / 'analysis-material-v5-qualifier-near4-20261105'
PARENT_RUNNER = W / 'material_v5_qualifier2_trial.py'
INPUT = W / 'analysis_qualifier_near4_private_inputs.json'
INPUT_SHA = 'd164bad983fc12e03159a88c30cd7ab745546ddd7e8896b7d294074fd9a82b40'
PARENT_SHA = '06b31fc677e247812ef0326325c0e3c797f06192089099b321269ba162eb8cea'
LIMIT = 600
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert sha(PARENT_RUNNER) == PARENT_SHA
spec = importlib.util.spec_from_file_location('qualifier_parent', PARENT_RUNNER)
q = importlib.util.module_from_spec(spec); spec.loader.exec_module(q)
h = q.h; v = q.p.v; write = h.write


def check():
    q.check()
    assert sha(INPUT) == INPUT_SHA
    if (ROOT / 'cpu.json').exists():
        assert sha(__file__) == json.loads((ROOT / 'cpu.json').read_text())['runner_sha256']


def prepare():
    started = time.monotonic(); check(); assert not ROOT.exists()
    from transformers import AutoTokenizer
    from serve_emlis_natural_reply import MODEL, REVISION, PINS
    from importlib.metadata import version
    assert {n: version(n) for n in PINS} == PINS
    parent = q.ROOT
    assert all(sha(parent / n) == e['sha256'] for n, e in json.loads((parent / 'manifest.json').read_text()).items())
    run = json.loads((parent / 'run_report.json').read_text())
    assert run['status'] == 'COMPLETE_PENDING_FULL_REVIEW_NOT_ADOPTED'
    pack = json.loads((parent / 'pack.json').read_text())
    matching = {}
    for key, ek in q.PAIRS.items():
        gold = next(json.loads(r['assistant_target']) for r in pack['teachers'] if r['id'] == key)
        matching[key] = json.loads((parent / 'after' / (ek + '.raw.txt')).read_text()) == gold
    assert all(matching.values())
    collection = json.loads((parent / 'collection.json').read_text())
    old = [x for x in collection['comparisons'] if x['before_typed']]
    assert len(old) == 19 and all(x['after_typed'] and x['graph_equal'] and x['visible_equal'] for x in old)
    assert not [x for x in collection['comparisons'] if x['after_typed'] and not x['before_typed']]
    originals = json.loads(q.p.SOURCE.read_text())['teachers'] + pack['teachers'] + pack['evaluation']
    seen = {(m['original']['memo'], m['original']['memo_action']) for r in originals for m in r['snapshot']['members']}
    rows = json.loads(INPUT.read_text())['rows']; assert len(rows) == 4
    assert {r['id'] for r in rows} == {'QF01', 'QF02', 'QF03', 'QF04'}
    for name in ('before', 'after'):
        (ROOT / name).mkdir(parents=True, exist_ok=False)
    tok = AutoTokenizer.from_pretrained(MODEL, revision=REVISION, local_files_only=True, trust_remote_code=False)
    audits = []
    for row in rows:
        assert row['training_use'] is False and 'assistant_target' not in row
        members = row['snapshot']['members']; assert len(members) == 1
        original = members[0]['original']
        assert (original['memo'], original['memo_action']) not in seen
        value = q.p.prepare_input(row)
        row.update(messages=value.messages(), request_ref=value.request_ref)
        prompt = tok.apply_chat_template(value.messages(), enable_thinking=False, add_generation_prompt=True, tokenize=True, return_dict=False, truncation=False)
        assert len(prompt) + 2048 <= 8192
        audits.append(dict(id=row['id'], prompt_tokens=len(prompt)))
    trained = json.loads((parent / 'train/report.json').read_text())
    assert trained['status'] == 'COMPLETE_NOT_ADOPTED'
    models = dict(before=dict(path=str(q.INITIAL), weights_sha256=q.WEIGHTS, config_sha256=q.CONFIG), after=dict(path=str(parent / 'train/adapter'), weights_sha256=trained['weights_sha256'], config_sha256=trained['config_sha256']))
    for item in models.values():
        assert sha(Path(item['path']) / 'adapter_model.safetensors') == item['weights_sha256']
        assert sha(Path(item['path']) / 'adapter_config.json') == item['config_sha256']
    write(ROOT / 'pack.json', dict(evaluation=rows, models=models, no_training=True, no_exact_json_gold=True))
    shutil.copyfile(INPUT, ROOT / 'private_inputs.json')
    shutil.copyfile(__file__, ROOT / 'runner.py')
    write(ROOT / 'cpu.json', dict(status='CPU_PASSED_NO_MODEL', seconds=time.monotonic() - started, runner_sha256=sha(__file__), input_sha256=INPUT_SHA, new_untrained_sources=4, audits=audits, parent_teacher_matches=matching, parent_graph_visible_preserved=19, model_loads=0, model_forwards=0, diagnostic_forwards=0, updates=0, planned_model_loads=2, planned_new_generations=8, max_seconds=LIMIT, normal_adoption=False))
    write(ROOT / 'cpu_manifest.json', {str(f.relative_to(ROOT)): sha(f) for f in ROOT.rglob('*') if f.is_file()})
    print((ROOT / 'cpu.json').read_text())


def deadline():
    return json.loads((ROOT / 'deadline.json').read_text())['monotonic_deadline']


def arm():
    def expired(*_):
        raise TimeoutError('near4_bounded_deadline')
    signal.signal(signal.SIGALRM, expired); signal.signal(signal.SIGTERM, expired)
    signal.setitimer(signal.ITIMER_REAL, max(.001, deadline() - time.monotonic()))


def phase(name):
    check(); arm()
    from serve_emlis_natural_reply import load_generator
    pack = json.loads((ROOT / 'pack.json').read_text()); model = pack['models'][name]
    report = dict(status='STARTED', model_loads=1, calls=[], updates=0)
    try:
        generator = load_generator(model['path'], threading.Event(), weights_sha256=model['weights_sha256'], config_sha256=model['config_sha256'])
        for row in pack['evaluation']:
            value = q.p.prepare_input(row)
            assert value.messages() == row['messages'] and value.request_ref == row['request_ref']
            directory = ROOT / name; key = row['id']
            write(directory / (key + '.request.json'), dict(request_ref=value.request_ref, messages=value.messages(), messages_sha256=hashlib.sha256(h.canonical(value.messages()).encode()).hexdigest()))
            raw, finish = generator(value.messages(), min(deadline(), time.monotonic() + 45))
            (directory / (key + '.raw.txt')).write_text(raw)
            response = v.make_response(value, raw, finish)
            write(directory / (key + '.response.json'), asdict(response))
            assert finish == 'stop'
            report['calls'].append(dict(id=key, finish=finish, **h.bind_save(row, value, response, directory, key)))
            write(directory / 'report.json', report)
        report['status'] = 'COMPLETE_PENDING_ROOT_SEMANTIC_REVIEW'
    finally:
        write(ROOT / name / 'report.json', report)


def run():
    check()
    assert all(sha(ROOT / n) == e for n, e in json.loads((ROOT / 'cpu_manifest.json').read_text()).items())
    assert not subprocess.check_output(['nvidia-smi', '--query-compute-apps=pid', '--format=csv,noheader'], text=True).strip()
    with (ROOT / 'run_started.json').open('x') as f:
        json.dump(dict(started=time.time(), max_seconds=LIMIT), f)
    write(ROOT / 'deadline.json', dict(monotonic_deadline=time.monotonic() + LIMIT))
    report = dict(status='STARTED', stages=[], updates=0, normal_adoption=False)
    try:
        for name in ('before', 'after'):
            with (ROOT / (name + '.log')).open('w') as log:
                done = subprocess.run([sys.executable, __file__, name], stdout=log, stderr=subprocess.STDOUT, timeout=max(.001, deadline() - time.monotonic()) + 30)
            report['stages'].append(dict(phase=name, exit=done.returncode)); write(ROOT / 'run_report.json', report)
            assert done.returncode == 0
        report['status'] = 'COMPLETE_PENDING_ROOT_SEMANTIC_REVIEW_NOT_ADOPTED'
    except BaseException:
        report.update(status='FAILED_NO_RETRY_NOT_ADOPTED', traceback=traceback.format_exc()); raise
    finally:
        report['seconds'] = time.time() - json.loads((ROOT / 'run_started.json').read_text())['started']
        models = json.loads((ROOT / 'pack.json').read_text())['models']
        report['both_adapters_unchanged'] = all(sha(Path(x['path']) / 'adapter_model.safetensors') == x['weights_sha256'] and sha(Path(x['path']) / 'adapter_config.json') == x['config_sha256'] for x in models.values())
        write(ROOT / 'run_report.json', report)


def collect():
    check()
    import analysis_cumulative_service as service
    saved = []; pack = json.loads((ROOT / 'pack.json').read_text())
    for name in ('before', 'after'):
        for row in pack['evaluation']:
            key = row['id']; d = ROOT / name; rp = d / (key + '.response.json')
            if not rp.exists():
                continue
            value = q.p.prepare_input(row); raw = (d / (key + '.raw.txt')).read_text(); response = json.loads(rp.read_text()); request = json.loads((d / (key + '.request.json')).read_text())
            assert response == asdict(v.make_response(value, raw, response['finish_reason']))
            assert request['messages'] == value.messages() and request['request_ref'] == value.request_ref
            replayed = []
            with h.guard_saved():
                for suffix, reader, kwargs in [('.candidate.json', service.reload_cumulative_quoted_parent_candidates, {}), ('.typed.json', service.reload_cumulative_written_role_map, dict(with_action=False))]:
                    f = d / (key + suffix)
                    if f.exists():
                        artifact, coverage = reader(row['owner'], row['snapshot'], f.read_text(), **kwargs); replayed.append(suffix)
                        if suffix == '.typed.json':
                            projection = dict(graph=asdict(artifact.graph), text=artifact.safe_text_projection(authenticated_owner_scope=row['owner']), diagram=artifact.safe_projection(authenticated_owner_scope=row['owner']))
                            assert projection == json.loads((d / (key + '.projection.json')).read_text())
            saved.append(dict(phase=name, id=key, replayed=replayed))
    write(ROOT / 'collection.json', dict(saved=saved, gpu=subprocess.check_output(['nvidia-smi', '--query-gpu=memory.used,utilization.gpu', '--format=csv,noheader'], text=True).strip(), compute_apps=subprocess.check_output(['nvidia-smi', '--query-compute-apps=pid', '--format=csv,noheader'], text=True).strip()))
    write(ROOT / 'manifest.json', {str(f.relative_to(ROOT)): dict(bytes=f.stat().st_size, sha256=sha(f)) for f in ROOT.rglob('*') if f.is_file() and f.name != 'manifest.json'})
    archive = W / 'cocolon-analysis-material-v5-qualifier-near4-20261105.zip'
    with zipfile.ZipFile(archive, 'x', zipfile.ZIP_DEFLATED) as z:
        for f in sorted(ROOT.rglob('*')):
            if f.is_file():
                z.write(f, str(f.relative_to(ROOT)))
    print(json.dumps(dict(archive=str(archive), bytes=archive.stat().st_size, sha256=sha(archive))))


if __name__ == '__main__':
    if sys.argv[1] in ('before', 'after'):
        phase(sys.argv[1])
    else:
        {'prepare': prepare, 'run': run, 'collect': collect}[sys.argv[1]]()
