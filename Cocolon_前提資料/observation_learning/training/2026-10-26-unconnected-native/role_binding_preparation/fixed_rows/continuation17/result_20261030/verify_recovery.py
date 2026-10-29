"""Independent CPU-only verification of the downloaded exact-file recovery."""
from pathlib import Path
import hashlib
import json
import struct
import sys
import zipfile
import numpy as np

archive = Path(sys.argv[1]).resolve()
dest = Path(sys.argv[2]).resolve()
dest.mkdir(exist_ok=False)
sha = lambda b: hashlib.sha256(b).hexdigest()
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    names = z.namelist()
    assert len(names) == len(set(names))
    manifest = json.loads(z.read('archive_manifest.json'))
    assert set(names) == {f['path'] for f in manifest['files']} | {'archive_manifest.json'}
    for f in manifest['files']:
        b = z.read(f['path'])
        assert len(b) == f['bytes'] and sha(b) == f['sha256'], f['path']
        path = dest / f['path']
        assert path.resolve().is_relative_to(dest)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(b)
    (dest / 'archive_manifest.json').write_bytes(z.read('archive_manifest.json'))
r = json.loads((dest / 'run/run.json').read_text())
plan = json.loads((dest / 'runtime/plan.json').read_text())
assert r['plan'] == plan and plan['status'] == 'MASH_EXPLICITLY_APPROVED_ONCE'
assert sha((dest / 'runtime/run_continuation17.py').read_bytes()) == plan['runner_sha256']
assert sha((dest / 'cpu/prepared_cpu.json.gz').read_bytes()) == plan['prepared_cpu_sha256']
assert r['source_commit'] == '3928b9571bc5465998c0c528d207177e212aca03'
assert r['retry'] is False and r['processing_seconds'] <= plan['max_process_seconds']
post = json.loads((dest / 'post_identity.json').read_text())
assert post['initial_adapter_sha256'] == plan['initial_adapter_sha256']
assert post['frozen_unchanged'] is True and r['frozen_inputs_unchanged'] is True
training = [json.loads(s) for s in (dest / 'run/training.jsonl').read_text().splitlines()]
assert [x['id'] for x in training] == plan['update_order'][:len(training)]
assert len(training) == r['optimizer_steps_completed'] <= 17
tensors = []
for path in sorted((dest / 'run').glob('**/*.safetensors')):
    b = path.read_bytes()
    length = struct.unpack('<Q', b[:8])[0]
    h = json.loads(b[8:8+length]); data = b[8+length:]
    entries = [(n,v) for n,v in h.items() if n != '__metadata__']
    assert len(entries) == 112
    for n,v in entries:
        assert v['dtype'] == 'F32'
        a,c = v['data_offsets']; arr = np.frombuffer(data[a:c], dtype='<f4')
        assert arr.size == np.prod(v['shape']) and np.isfinite(arr).all()
    tensors.append(dict(path=path.relative_to(dest).as_posix(), count=len(entries),
                        dtype='F32', all_finite=True, sha256=sha(b)))
    if path.parent.name == 'adapter':
        assert sha(b) == r['adapter_sha256']['adapter_model.safetensors']
for c in r['calls']:
    assert sha((dest / 'run' / c['path']).read_bytes()) == c['raw_sha256']
verification = dict(archive=archive.name, bytes=archive.stat().st_size,
                    sha256=sha(archive.read_bytes()), members=len(names), payloads=len(manifest['files']),
                    all_crc_bytes_sha256_identical=True, source_plan_prepared_identical=True,
                    completed_updates=len(training), raw_calls=len(r['calls']), tensors=tensors,
                    cuda_used=False, model_loads=0, forwards=0, updates=0, generations=0, cmee_calls=0)
(dest / 'verification.json').write_text(json.dumps(verification, indent=2) + '\n')
print(json.dumps(verification, ensure_ascii=False, indent=2))
