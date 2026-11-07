"""Preserve one approved run, its weights, exact input/source and CPU/CMEE evidence."""
from pathlib import Path
import gzip
import hashlib
import json
import zipfile

W = Path('/workspace')
RUN = W / 'cocolon_rehearsal13_run_20261029'
CPU = W / 'cocolon_rehearsal13_cpu_20261029'
PACK = W / 'cocolon_rehearsal13_pack_20261029'
SOURCE = '385114bde2ea0d8904d6a73f9c80bb5af56a654c'
report = json.loads((RUN / 'run.json').read_text())
assert report['status'] in ('RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW', 'STOPPED_NO_RETRY',
                            'STOPPED_IDENTITY_UNVERIFIED_NO_RETRY')
diagnosis = None
if report['status'] == 'RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW':
    assert (report['optimizer_steps_completed'], report['model_loads_completed'], report['model_calls_completed']) == (13, 2, 11)
    diagnosis = json.loads((RUN / 'cmee/diagnosis.json').read_text())
    assert len(diagnosis['cases']) == 11
assert report['source_commit'] == SOURCE

def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

files = {}
def tree(prefix, root):
    for path in sorted(root.rglob('*')):
        if path.is_file() and '__pycache__' not in path.parts:
            files[prefix + '/' + str(path.relative_to(root))] = path

tree('run', RUN)
tree('source', PACK)
tree('cpu', CPU)
cpu = json.loads(gzip.decompress((CPU / 'prepared_cpu.json.gz').read_bytes()))
for name, digest in cpu['frozen'].items():
    path = Path(name)
    assert sha(path) == digest
    files['frozen_originals/' + str(path.relative_to(W))] = path
for path in sorted((W / 'cocolon_joint_role18_run_20261029').glob('after_*.jsonl')):
    files['baseline_f493_old9/' + path.name] = path
for path in sorted((W / 'cocolon_shape2_run_20261029').glob('before_*.jsonl')):
    files['baseline_f493_shape2/' + path.name] = path
files['baseline_f493_shape2/diagnosis.json'] = W / 'cocolon_shape2_run_20261029/cmee/diagnosis.json'
for name in ('rehearsal13-gpu.log', 'rehearsal13-gpu.exit', 'rehearsal13-cmee.log',
             'rehearsal13-cmee.exit', 'rehearsal13-cpu.log', 'rehearsal13-cpu.exit'):
    path = W / name
    if path.is_file():
        files['logs/' + name] = path
files['source/export_rehearsal13.py'] = Path(__file__)
manifest = dict(schema='cocolon.rehearsal13_original_archive.v1', runtime_source_commit=SOURCE,
                proposal_source_commit='4b3cdc8cd096ae7c13e3c28401d49c1e6ee580af',
                api_runtime_commit='c920f81a2540b23a36d4bd83f9149e29d00ac407',
                base_model='Qwen/Qwen3.5-4B', base_revision='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a',
                initial_adapter_sha256='f4932d3a2bac1d8e78d0bf86579868e29546914512234d31556840eb28a85c19',
                final_adapter_sha256=report.get('adapter_sha256'), base_weights_included=False,
                optimizer_rng_resume_included=False, files=[])
for name, path in files.items():
    manifest['files'].append(dict(path=name, bytes=path.stat().st_size, sha256=sha(path)))
out = W / 'cocolon-rehearsal13-weights-originals-20261029.zip'
with zipfile.ZipFile(out, 'x', zipfile.ZIP_DEFLATED) as archive:
    for name, path in files.items():
        archive.write(path, name)
    archive.writestr('manifest.json', json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
with zipfile.ZipFile(out) as archive:
    assert archive.testzip() is None
    assert set(archive.namelist()) == set(files) | {'manifest.json'}
    for item in manifest['files']:
        data = archive.read(item['path'])
        assert len(data) == item['bytes'] and hashlib.sha256(data).hexdigest() == item['sha256']
receipt = dict(archive=out.name, bytes=out.stat().st_size, sha256=sha(out), payload_count=len(files),
               member_count=len(files)+1, raw_status=report['status'],
               model_loads_completed=report['model_loads_completed'], model_calls_completed=report['model_calls_completed'],
               optimizer_steps_completed=report['optimizer_steps_completed'], processing_seconds=report['processing_seconds'],
               process_cost_usd=report['process_cost_usd'],
               full2=diagnosis['full2'] if diagnosis else None, old9=diagnosis.get('old9') if diagnosis else None,
               baseline7_preserved=diagnosis.get('baseline7_preserved') if diagnosis else None)
(W / 'rehearsal13-export-receipt.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=2)+'\n')
print(json.dumps(receipt, ensure_ascii=False), flush=True)
