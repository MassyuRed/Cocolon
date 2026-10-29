"""One-off exact-file recovery for the already completed continuation17 run."""
from pathlib import Path
import gzip
import hashlib
import json
import zipfile

W = Path('/workspace')
PACK = W / 'cocolon_continuation17_pack_20261030'
CPU = W / 'cocolon_continuation17_cpu_20261030'
OUT = W / 'cocolon_continuation17_run_20261030'
DEST = W / 'cocolon-cont17-weights-originals-20261030.zip'
assert (PACK / 'gpu.exit').exists(), 'run still executing; no recovery snapshot'
r = json.loads((OUT / 'run.json').read_text())
assert r['status'] != 'STARTED_ONCE' and 'processing_seconds' in r
assert not DEST.exists(), 'archive already exists; do not replace'
sha = lambda b: hashlib.sha256(b).hexdigest()
prepared = json.loads(gzip.decompress((CPU / 'prepared_cpu.json.gz').read_bytes()))
payloads = {}
for label, root in [('run', OUT), ('runtime', PACK), ('cpu', CPU)]:
    for p in sorted(root.rglob('*')):
        if p.is_file():
            payloads[label + '/' + p.relative_to(root).as_posix()] = p.read_bytes()
references = []
for name, expected in prepared['frozen'].items():
    p = Path(name)
    b = p.read_bytes()
    assert sha(b) == expected, 'frozen changed: ' + name
    if p.suffix == '.safetensors':
        references.append(dict(path=name, bytes=len(b), sha256=sha(b),
                               included=False, reason='historical frozen weight; initial adapter separately preserved'))
    else:
        payloads['frozen/' + p.relative_to(W).as_posix()] = b
initial = W / 'cocolon_rehearsal13_run_20261029/adapter/adapter_model.safetensors'
assert sha(initial.read_bytes()) == r['plan']['initial_adapter_sha256']
identity = dict(initial_adapter_sha256=sha(initial.read_bytes()), frozen_unchanged=True,
                initial_archive_library_file_id='libfile_9623b67a65588191926a1bb0a0ea5797',
                run_source_commit=r['source_commit'], historical_frozen_weights=references,
                pretrained_model=r['plan']['model'], revision=r['plan']['revision'],
                base_model_weights_included=False, cuda_initialized_by_export=False,
                new_model_loads=0, forwards=0, updates=0, generations=0, cmee_calls=0)
payloads['post_identity.json'] = (json.dumps(identity, ensure_ascii=False, indent=2) + '\n').encode()
manifest = dict(schema='cocolon.continuation17.recovery.v1',
                files=[dict(path=n, bytes=len(b), sha256=sha(b)) for n, b in sorted(payloads.items())])
with zipfile.ZipFile(DEST, 'x', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as z:
    for n, b in sorted(payloads.items()):
        z.writestr(n, b)
    z.writestr('archive_manifest.json', json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
with zipfile.ZipFile(DEST) as z:
    assert z.testzip() is None
    assert len(z.namelist()) == len(set(z.namelist())) == len(payloads) + 1
    for f in manifest['files']:
        b = z.read(f['path'])
        assert len(b) == f['bytes'] and sha(b) == f['sha256']
print('RECOVERY_COMPLETE', DEST.name, DEST.stat().st_size, sha(DEST.read_bytes()),
      'members', len(payloads) + 1, 'status', r['status'], 'initial_unchanged', identity['initial_adapter_sha256'])
