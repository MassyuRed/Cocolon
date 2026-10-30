"""Independent read-only recovered archive verification; never loads a model."""
import hashlib
import json
from pathlib import Path
import struct
import sys
import zipfile
import numpy as np

archive = Path(sys.argv[1])
destination = Path(sys.argv[2])
digest = lambda b: hashlib.sha256(b).hexdigest()
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    names = z.namelist()
    assert len(names) == len(set(names))
    manifest = json.loads(z.read('archive_manifest.json'))
    assert set(names) == {x['path'] for x in manifest} | {'archive_manifest.json'}
    for x in manifest:
        b = z.read(x['path'])
        assert len(b) == x['bytes'] and digest(b) == x['sha256']
        assert not Path(x['path']).is_absolute() and '..' not in Path(x['path']).parts
    z.extractall(destination)

pack = destination / 'cocolon_stage5_pack_20261030'
run = destination / 'cocolon_stage5_run_20261030'
r = json.loads((run / 'run.json').read_text())
plan = json.loads((pack / 'plan.json').read_text())
assert r['plan'] == plan
for name, sha in plan['source_sha256'].items():
    assert digest((pack / name).read_bytes()) == sha
assert 0 <= r['optimizer_steps_completed'] <= 19
assert 0 <= r['model_loads_completed'] <= 2
assert 0 <= r['model_calls_completed'] <= r['model_calls_started'] <= 19
assert r['processing_seconds'] <= 2700
assert r['process_cost_usd'] <= .21
assert r['frozen_inputs_and_initial_weights_unchanged']
training = [json.loads(x) for x in (run / 'training.jsonl').read_text().splitlines()]
assert [x['id'] for x in training] == plan['update_order'][:len(training)]
assert len(training) == r['optimizer_steps_completed']
assert all(np.isfinite(x['loss']) and np.isfinite(x['gradient_norm']) for x in training)

def tensors(path):
    b = path.read_bytes()
    n = struct.unpack('<Q', b[:8])[0]
    h = json.loads(b[8:8 + n])
    result = {}
    for key, meta in h.items():
        if key == '__metadata__': continue
        assert meta['dtype'] == 'F32'
        a, end = meta['data_offsets']
        value = np.frombuffer(b[8+n+a:8+n+end], dtype='<f4')
        assert value.size == np.prod(meta['shape']) and np.isfinite(value).all()
        result[key] = (meta['shape'], value)
    assert len(result) == 112
    return result

initial_path = destination / 'cocolon_rehearsal13_run_20261029/adapter/adapter_model.safetensors'
new_path = run / 'adapter/adapter_model.safetensors'
assert digest(initial_path.read_bytes()) == plan['initial_adapter_sha256']
before = tensors(initial_path)
after = tensors(new_path)
assert before.keys() == after.keys()
assert all(before[k][0] == after[k][0] for k in before)
changed = sum(not np.array_equal(before[k][1], after[k][1]) for k in before)
assert changed == r['changed_tensors'] and changed > 0
assert digest(new_path.read_bytes()) == r['adapter_sha256']['adapter_model.safetensors']

for call in r['calls']:
    p = run / call['path']
    assert digest(p.read_bytes()) == call['raw_sha256']
    raw = json.loads(p.read_text())
    messages = json.loads((run / (call['path'] + '.messages.json')).read_text())
    text = json.dumps(messages, ensure_ascii=False, separators=(',', ':'), allow_nan=False)
    assert digest(text.encode()) == call['messages_sha256']
    assert raw['raw_utf8_sha256'] == digest(raw['raw_text'].encode())
    assert raw['adapter_revision'] == r['adapter_sha256']['adapter_model.safetensors']
    assert raw['output_tokens'] == len(raw['output_token_ids']) == call['output_tokens']
    assert raw['usage'] == dict(prompt_tokens=raw['input_tokens'], completion_tokens=raw['output_tokens'])

summary = dict(status=r['status'], archive_bytes=archive.stat().st_size, archive_sha256=digest(archive.read_bytes()),
               members=len(manifest)+1, all_crc_bytes_sha_verified=True, source_exact=True,
               updates=r['optimizer_steps_completed'], model_loads=r['model_loads_completed'],
               actual_generations=r['model_calls_completed'], tensors=112, parameters=sum(x[1].size for x in after.values()),
               all_f32_finite=True, changed_tensors=changed, initial_sha256=digest(initial_path.read_bytes()),
               new_sha256=digest(new_path.read_bytes()), frozen_inputs_and_initial_unchanged=True,
               processing_seconds=r['processing_seconds'], process_cost_usd=r['process_cost_usd'], cases=r['cases'],
               retry=False, model_loads_for_this_verifier=0)
print(json.dumps(summary, indent=2, ensure_ascii=False))
