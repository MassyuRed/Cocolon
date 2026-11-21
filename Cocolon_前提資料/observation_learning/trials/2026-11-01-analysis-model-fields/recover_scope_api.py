"""Restore the exact historical2134 source tree; one old test predates API pin."""
from pathlib import Path
import hashlib,json
w=Path('/workspace');api=w/'analysis-api-20261103';old=w/'analysis-other62-restored-20261103'
p=api/'ai/tests/test_analysis_model_units.py';before=hashlib.sha256(p.read_bytes()).hexdigest()
original=p.read_bytes();assert hashlib.sha1(b'blob '+str(len(original)).encode()+b'\0'+original).hexdigest()=='59cac7fed534b838a308493d2ee298a0780b74e9'
source=w/'historical_test_analysis_model_units.py';b=source.read_bytes()
assert hashlib.sha256(b).hexdigest()=='40abefd135d57c05052d14c2254d8536c5624daace4b1eccbd9719c3e43707eb'
p.write_bytes(b)
m=json.loads((old/'api_source_manifest.json').read_text())
assert len(m)==2134 and all(hashlib.sha256((api/n).read_bytes()).hexdigest()==h for n,h in m.items())
(w/'api-restoration-correction.json').write_text(json.dumps(dict(status='EXACT_HISTORICAL_2134_MATCHED',product_source_pin='86d19b6d834676a602b036c89357dfed1003bb2b',exception_test_path='ai/tests/test_analysis_model_units.py',exception_test_origin_commit='cddf185594b5eeffcf72a92dcc2a2c5a44ff8b4c',exception_test_sha256=hashlib.sha256(b).hexdigest(),original_api_test_sha256=before,model_loads=0,new_generations=0,training_updates=0),indent=2))
print('Exact historical2134 restored; one historical test, all product source matched.')
