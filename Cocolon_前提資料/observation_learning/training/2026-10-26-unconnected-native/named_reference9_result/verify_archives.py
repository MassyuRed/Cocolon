"""Pod-external verification of original archives and portable F32 weights."""
from pathlib import Path
import array, hashlib, json, math, struct, sys, zipfile

ROOT = Path(__file__).resolve().parent
RESULT = ROOT / 'result'

def sha(b):
    return hashlib.sha256(b).hexdigest()

def verify_zip(path):
    with zipfile.ZipFile(path) as z:
        assert z.testzip() is None
        manifest = json.loads(z.read('manifest.json'))
        assert len(z.namelist()) == len(set(z.namelist()))
        assert set(z.namelist()) == {r['path'] for r in manifest} | {'manifest.json'}
        for row in manifest:
            data = z.read(row['path'])
            assert len(data) == row['bytes'] and sha(data) == row['sha256'], row['path']
        return dict(bytes=path.stat().st_size, sha256=sha(path.read_bytes()),
                    payloads=len(manifest), members=len(z.namelist()), crc=True, all_hash_sizes=True)

small = RESULT / 'runtime_originals.zip'
full = RESULT / 'weights_and_originals.zip'
checks = dict(runtime=verify_zip(small), weights_and_originals=verify_zip(full))
with zipfile.ZipFile(ROOT.parent/'named_work/result/weights_and_originals.zip') as initial_zip:
    initial_bytes = initial_zip.read('run/adapter/adapter_model.safetensors')
assert sha(initial_bytes) == '284f1df77c828982bdb7c2480f3f269b71dc9d69a29ea36b48dc6d25ab807d23'
initial_size = struct.unpack('<Q', initial_bytes[:8])[0]
initial_header = json.loads(initial_bytes[8:8+initial_size])
initial_shapes = {k:v['shape'] for k,v in initial_header.items() if k != '__metadata__'}
with zipfile.ZipFile(small) as zs, zipfile.ZipFile(full) as zf:
    report = json.loads(zf.read('run/run.json'))
    assert report['source_commit'] == 'bc8d3c471aefb960d81c8a692873ce183dd2d789'
    assert report['plan'] == json.loads((ROOT/'pack/named9.plan.json').read_text())
    assert report['initial_284f_and_sources_unchanged']
    for call in report['calls']:
        b = zf.read('run/'+call['path'])
        assert sha(b) == call['raw_sha256']
        raw = json.loads(b)
        assert sha(raw['raw_text'].encode()) == raw['raw_utf8_sha256']
    for n in zs.namelist():
        if n != 'manifest.json':
            assert zs.read(n) == zf.read(n), n
    assert zf.read('cpu/cpu_originals.zip') == (ROOT/'recovered_cpu/cpu_originals.zip').read_bytes()
    weights = []
    for n in zf.namelist():
        if not n.endswith('/adapter_model.safetensors'):
            continue
        b = zf.read(n)
        if n.startswith('run/adapter/'):
            assert sha(b) == report['adapter_sha256']['adapter_model.safetensors']
        elif n.startswith('run/partial_adapter/'):
            assert sha(b) == report['partial_adapter_sha256']['adapter_model.safetensors']
        size = struct.unpack('<Q', b[:8])[0]
        header = json.loads(b[8:8+size])
        tensors = {k:v for k,v in header.items() if k != '__metadata__'}
        assert len(tensors) == 112
        assert {k:v['shape'] for k,v in tensors.items()} == initial_shapes
        spans, count = [], 0
        for name, t in tensors.items():
            assert t['dtype'] == 'F32'
            start, end = t['data_offsets']
            elements = math.prod(t['shape'])
            assert end-start == elements*4
            a = array.array('f')
            a.frombytes(b[8+size+start:8+size+end])
            if sys.byteorder != 'little':
                a.byteswap()
            assert len(a) == elements and all(math.isfinite(x) for x in a), name
            spans.append((start,end)); count += elements
        spans.sort()
        assert spans[0][0] == 0 and spans[-1][1] == len(b)-8-size
        assert all(a[1] == c[0] for a,c in zip(spans,spans[1:]))
        assert count == 3833856
        weights.append(dict(path=n,sha256=sha(b),bytes=len(b),tensors=112,
                            parameters=count,dtype='F32',all_finite=True,contiguous=True))
    assert weights
    zf.extractall(RESULT/'expanded')
checks.update(weights=weights, runtime_full_payloads_identical=True, cpu_originals_identical=True,
              saved_weight_matches_run=True, initial_284f_shapes_identical=True,
              plan_identical=True, raw_hashes_match_run=True,
              model_loads=0, generations=0, sql_operations=0)
(RESULT/'external_verification.json').write_text(json.dumps(checks,indent=2)+'\n')
print(json.dumps(checks,indent=2))
