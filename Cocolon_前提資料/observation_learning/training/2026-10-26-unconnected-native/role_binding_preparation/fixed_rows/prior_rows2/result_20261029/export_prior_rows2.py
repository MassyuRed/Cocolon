"""Recover exact inference originals; unchanged weights remain in the verified prior archive."""
from pathlib import Path
import gzip
import hashlib
import json
import zipfile

W = Path('/workspace')
RUN = W / 'cocolon_prior_rows2_run_20261029'
CPU = W / 'cocolon_prior_rows2_cpu_20261029'
PACK = W / 'cocolon_prior_rows2_pack_20261029'
ADAPTER = W / 'cocolon_rehearsal13_run_20261029/adapter'
SOURCE = '943ee425ef7796b92ed9ee56f71fbb241ea2e45f'


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


report = json.loads((RUN / 'run.json').read_text())
assert report['source_commit'] == SOURCE
assert report['status'] in ('RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW',
                            'STOPPED_NO_RETRY', 'STOPPED_IDENTITY_UNVERIFIED_NO_RETRY')
diagnosis = None
if report['status'] == 'RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW':
    assert (report['model_loads_completed'], report['optimizer_steps_completed'], report['model_calls_completed']) == (1, 0, 2)
    diagnosis = json.loads((RUN / 'cmee/diagnosis.json').read_text())
    assert len(diagnosis['cases']) == 2

files = {}


def tree(prefix, root):
    for path in sorted(root.rglob('*')):
        if path.is_file() and '__pycache__' not in path.parts:
            files[prefix + '/' + str(path.relative_to(root))] = path


tree('run', RUN); tree('source', PACK); tree('cpu', CPU)
prior_cpu = json.loads(gzip.decompress((W / 'cocolon_rehearsal13_cpu_20261029/prepared_cpu.json.gz').read_bytes()))
weight_refs = []
for name, digest in prior_cpu['frozen'].items():
    path = Path(name); assert sha(path) == digest
    if path.suffix == '.safetensors':
        weight_refs.append(dict(original_path=name, bytes=path.stat().st_size, sha256=digest,
                                reason='Already preserved unchanged in rehearsal13 archive'))
    else:
        files['frozen_originals/' + str(path.relative_to(W))] = path
for name, digest in report['plan']['adapter_files_sha256'].items():
    path = ADAPTER / name; assert sha(path) == digest
    if path.suffix == '.safetensors':
        weight_refs.append(dict(original_path=str(path), bytes=path.stat().st_size, sha256=digest,
                                reason='Exact unchanged adapter used in this inference'))
    else:
        files['adapter_metadata/' + name] = path
baseline = W / 'cocolon_rehearsal13_run_20261029'
for path in sorted(baseline.glob('after_FT-*.jsonl')):
    files['baseline_rehearsal13/' + path.name] = path
files['baseline_rehearsal13/diagnosis.json'] = baseline / 'cmee/diagnosis.json'
for name in ('prior-rows2-gpu.log', 'prior-rows2-gpu.exit', 'prior-rows2-cmee.log',
             'prior-rows2-cmee.exit', 'prior-rows2-launch.log'):
    path = W / name
    if path.is_file():
        files['logs/' + name] = path
files['source/export_prior_rows2.py'] = Path(__file__)
manifest = dict(schema='cocolon.prior_rows2_original_archive.v1', runtime_source_commit=SOURCE,
    proposal_source_commit='5c21326cf80be2c04c9ece3b9474bb0105a7532f',
    base_model='Qwen/Qwen3.5-4B', base_revision='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a',
    adapter_sha256=report['plan']['adapter_sha256'], new_weights_created=False,
    base_weights_included=False, adapter_weights_included=False,
    unchanged_weights_archive=dict(library_file_id='libfile_9623b67a65588191926a1bb0a0ea5797',
        name='cocolon-rehearsal13-weights-originals-20261029.zip', bytes=60053438,
        sha256='71741059ee92e627ea4183186b554d04ffc245ae857c6fd1bf1654217b6498d9'),
    unchanged_weight_refs=weight_refs, files=[])
for name, path in files.items():
    manifest['files'].append(dict(path=name, bytes=path.stat().st_size, sha256=sha(path)))
out = W / 'cocolon-prior-rows2-originals-20261029.zip'
with zipfile.ZipFile(out, 'x', zipfile.ZIP_DEFLATED) as archive:
    for name, path in files.items():
        archive.write(path, name)
    archive.writestr('manifest.json', json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
with zipfile.ZipFile(out) as archive:
    assert archive.testzip() is None and set(archive.namelist()) == set(files) | {'manifest.json'}
    for item in manifest['files']:
        data = archive.read(item['path'])
        assert len(data) == item['bytes'] and hashlib.sha256(data).hexdigest() == item['sha256']
receipt = dict(archive=out.name, bytes=out.stat().st_size, sha256=sha(out), payload_count=len(files),
    member_count=len(files)+1, raw_status=report['status'], model_loads_completed=report['model_loads_completed'],
    model_calls_completed=report['model_calls_completed'], optimizer_steps_completed=report['optimizer_steps_completed'],
    processing_seconds=report['processing_seconds'], process_cost_usd=report['process_cost_usd'],
    full2=diagnosis['full2'] if diagnosis else None, new_weights_created=False,
    weights_preserved_in=manifest['unchanged_weights_archive'])
(W / 'prior-rows2-export-receipt.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=2)+'\n')
print(json.dumps(receipt, ensure_ascii=False), flush=True)
