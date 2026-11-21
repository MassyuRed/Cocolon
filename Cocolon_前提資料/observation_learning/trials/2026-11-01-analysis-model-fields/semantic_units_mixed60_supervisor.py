"""One fixed GPU comparison, exact saved-before reuse, and lossless result export."""
from pathlib import Path
from collections import Counter
import hashlib
import json
import shutil
import subprocess
import time
import zipfile

w = Path('/workspace')
r = w / 'analysis-mixed60-20261102'
prepared = w / 'analysis-mixed60-prepared-20261102'
prior = w / 'analysis-unknown58-lr1-20261102'
api = w / 'analysis-parent56-api-20261102'
sha = lambda path: hashlib.sha256(Path(path).read_bytes()).hexdigest()
assert sha(prepared / 'semantic_units_mixed60_plan.json') == 'e64ccdcd1565a8dfd2ddd6602f9057a04e75e24c962640a4ae79dfdb8c21260e'
assert sha(w / 'semantic_units_mixed60_run.py') == '9d22d870bd40e0fedfb218041760d97fa3cc6a68efbf731c88920033050d09ec'
assert not r.exists()
pack = json.loads((prepared / 'semantic_units_mixed60_plan.json').read_text())
old = json.loads((prior / 'semantic_units_unknown58_lr1_plan.json').read_text())
old_report = json.loads((prior / 'result/report.json').read_text())
assert pack['teachers'][:58] == old['teachers'] and len(pack['teachers']) == 60
counts = Counter(pack['plan']['update_order'])
assert len(pack['plan']['update_order']) == 66 and counts['MX01'] == counts['MX02'] == 4
assert all(counts[row['id']] == 1 for row in old['teachers'])
assert (prior / 'run.exit').read_text() == '0'
assert old_report['status'] == 'COMPLETE_NOT_ADOPTED_PENDING_RAW_READ'
assert old_report['updates_completed'] == 64 and old_report['new_calls'] == 16
assert old_report['adapter_sha256'] == pack['plan']['initial_weights_sha256']
for key in ('model', 'revision', 'context_tokens', 'max_new_tokens', 'request_seconds', 'learning_rate', 'seed', 'training_objective'):
    assert pack['plan'][key] == old['plan'][key]
manifest = json.loads((prior / 'api_source_manifest.json').read_text())
assert len(manifest) == 2134 and all(sha(api / name) == value for name, value in manifest.items())
loader = (api / 'ai/tools/serve_emlis_natural_reply.py').read_bytes()
assert hashlib.sha1(b'blob ' + str(len(loader)).encode() + b'\0' + loader).hexdigest() == '722525c2a1f1afe0a5f0902e0bddf5b602db8a1a'
for name, expected in (('adapter_model.safetensors', pack['plan']['initial_weights_sha256']), ('adapter_config.json', pack['plan']['initial_config_sha256'])):
    assert sha(prior / 'result/adapter' / name) == expected
apps = subprocess.check_output(['nvidia-smi', '--query-compute-apps=pid,used_memory', '--format=csv,noheader'], text=True)
assert not apps.strip()
r.mkdir()
for name in ('semantic_units_mixed60_plan.json', 'semantic_units_mixed60_cpu.json'):
    shutil.copyfile(prepared / name, r / name)
(r / 'cpu_teachers').mkdir()
cpu_files = sorted(prepared.glob('teacher_*.candidate.json'))
assert len(cpu_files) == 60
for source in cpu_files:
    shutil.copyfile(source, r / 'cpu_teachers' / source.name)
for name in ('semantic_units_mixed60_run.py', 'semantic_units_mixed60_prepare.py', 'semantic_units_mixed60_supervisor.py'):
    shutil.copyfile(w / name, r / name)
(r / 'api_source_manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
reused = []
for row in pack['evaluation'][:16]:
    assert not row['pre_generation_required']
    base = prior / 'result' / ('after_' + row['probe_id'])
    request = json.loads(Path(str(base) + '.request.json').read_text())
    response = json.loads(Path(str(base) + '.response.json').read_text())
    raw = Path(str(base) + '.raw.txt').read_bytes()
    assert request['messages'] == row['messages'] and request['request_ref'] == row['request_ref']
    assert response['raw'].encode() == raw and response['raw_sha256'] == hashlib.sha256(raw).hexdigest()
    matching = [call for call in old_report['calls'] if call['phase'] == 'after' and call['probe_id'] == row['probe_id']]
    assert len(matching) == 1 and matching[0]['raw_sha256'] == response['raw_sha256']
    assert Path(str(base) + '.candidate.json').exists() == (matching[0]['admission'] == 'RETURNED')
    for suffix in ('.request.json', '.response.json', '.raw.txt', '.candidate.json'):
        source = Path(str(base) + suffix)
        if source.exists():
            shutil.copyfile(source, r / ('before_' + row['probe_id'] + suffix))
    reused.append(dict(probe_id=row['probe_id'], source=str(base), raw_sha256=response['raw_sha256'], messages_sha256=request['messages_sha256'], adapter_sha256=old_report['adapter_sha256']))
assert len(reused) == 16 and len(pack['evaluation']) == 20
assert all(row['pre_generation_required'] for row in pack['evaluation'][16:])
(r / 'reused_before.json').write_text(json.dumps(reused, indent=2) + '\n')
shutil.copyfile(prior / 'adaptive_loss.py', r / 'adaptive_loss.py')
prior_hashes = {str(w / run / 'result/adapter' / name): sha(w / run / 'result/adapter' / name)
                for run in ('analysis-parent56-20261102', 'analysis-unknown58-20261102', 'analysis-unknown58-lr1-20261102')
                for name in ('adapter_model.safetensors', 'adapter_config.json')}
(r / 'source_identity.json').write_text(json.dumps(dict(api_commit=pack['api_commit'], cocolon_source_commit=pack['cocolon_source_commit'], runtime_scope='Verified filtered2134 source files, not a full Git checkout.', loader_blob='722525c2a1f1afe0a5f0902e0bddf5b602db8a1a', reused_before=16, prior_hashes=prior_hashes), indent=2) + '\n')
(r / 'gpu-before.json').write_text(json.dumps(dict(compute_apps=apps)))
cmd = ['timeout', '--signal=TERM', '--kill-after=10s', '890s', str(w / 'analysis-probe-20261102/venv/bin/python'), str(r / 'semantic_units_mixed60_run.py'), '--api-root', str(api), '--plan', str(r / 'semantic_units_mixed60_plan.json'), '--plan-sha256', sha(r / 'semantic_units_mixed60_plan.json'), '--initial-dir', str(prior / 'result/adapter'), '--adaptive-loss', str(r / 'adaptive_loss.py'), '--out', str(r / 'result')]
start = time.monotonic()
with (r / 'run.log').open('w') as handle:
    exit_code = subprocess.run(cmd, stdout=handle, stderr=subprocess.STDOUT).returncode
(r / 'run.exit').write_text(str(exit_code))
(r / 'gpu-after.json').write_text(json.dumps(dict(process_seconds=time.monotonic()-start, exit=exit_code, prior_unchanged=prior_hashes == {name: sha(name) for name in prior_hashes}, compute_apps=subprocess.check_output(['nvidia-smi', '--query-compute-apps=pid,used_memory', '--format=csv,noheader'], text=True))))
files = [path for path in r.rglob('*') if path.is_file()]
(r / 'manifest.json').write_text(json.dumps({str(path.relative_to(r)): sha(path) for path in files}, indent=2))
files.append(r / 'manifest.json')
archive = w / 'cocolon-analysis-mixed60-result-20261102.zip'
with zipfile.ZipFile(archive, 'x', zipfile.ZIP_DEFLATED) as handle:
    for path in files:
        handle.write(path, str(path.relative_to(r)))
export = {}
for path in files:
    item = dict(bytes=path.stat().st_size, sha256=sha(path))
    if path.suffix == '.safetensors':
        item['binary'] = True
    else:
        item['text'] = path.read_bytes().decode('utf-8')
    export[str(path.relative_to(r))] = item
(w / 'mixed60-export.json').write_text(json.dumps(dict(original_zip_sha256=sha(archive), files=export), ensure_ascii=False))
if exit_code == 0:
    subprocess.run(['python', str(w / 'export_numeric_weights.py'), str(r / 'result/adapter/adapter_model.safetensors'), str(w / 'mixed60-numeric')], check=True)
links = [w / 'mixed60-export.json', w / 'mixed60-numeric/header.json'] + sorted((w / 'mixed60-numeric').glob('parameters-*.json'))
(w / 'mixed60-recovery.html').write_text('<meta charset=utf-8><h1>Mixed60 result recovery</h1>' + ''.join('<p><a href=' + str(path.relative_to(w)) + '>' + path.name + '</a></p>' for path in links if path.exists()))
print(json.dumps(dict(exit=exit_code, members=len(files), archive=archive.name, bytes=archive.stat().st_size)))
