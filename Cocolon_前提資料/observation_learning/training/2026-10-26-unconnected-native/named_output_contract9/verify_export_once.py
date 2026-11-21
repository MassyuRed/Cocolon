"""One local archive inspection for this run; no network/model/SQL."""
from pathlib import Path
import hashlib,json,struct,zipfile
import numpy as np
B=Path(__file__).parent;P=B/'recovered/cocolon_namedoutput9_weights_and_originals.zip';OUT=B/'recovered/full'
def sha(b):return hashlib.sha256(b).hexdigest()
with zipfile.ZipFile(P) as z:
 assert z.testzip() is None
 m=json.loads(z.read('manifest.json'));assert len(z.namelist())==len(m)+1
 for r in m:
  b=z.read(r['path']);assert len(b)==r['bytes'] and sha(b)==r['sha256'],r['path']
 assert z.read('cpu/cpu_originals.zip')==(B/'recovered/cpu_originals.zip').read_bytes()
 for n in ['api_source_manifest.json','namedoutput9.plan.json','launch_once.py']:
  assert z.read('runtime/'+n)==(B/'bound'/n).read_bytes()
 for n in ['ai/services/ai_inference/cocolon_meaning_experience_engine/model_candidate_source.py','ai/tests/test_cmee_named_reference_candidate.py']:
  assert z.read('result/source/api/'+n)==(B/'api'/n).read_bytes()
 report=json.loads(z.read('run/run.json'));diagnosis=json.loads(z.read('runtime/cmee_result/diagnosis.json'))
 shapes={}
 for n in ['initial_loaded_tensors.json','reloaded_tensors.json']:
  rows=json.loads(z.read('run/'+n));assert len(rows)==112 and all(r['dtype']=='torch.float32' and r['finite'] for r in rows)
  shapes[n]={r['name'].replace('.default.weight','.weight'):r['shape'] for r in rows}
 assert shapes['initial_loaded_tensors.json']==shapes['reloaded_tensors.json']
 paths=[n for n in z.namelist() if n.endswith('/adapter_model.safetensors') and n.startswith('run/')]
 checks=[]
 for n in paths:
  b=z.read(n);hsize=struct.unpack('<Q',b[:8])[0];h=json.loads(b[8:8+hsize]);h.pop('__metadata__',None)
  assert len(h)==112 and {name:v['shape'] for name,v in h.items()}==shapes['reloaded_tensors.json']
  count=0
  for name,v in h.items():
   assert v['dtype']=='F32';s,e=v['data_offsets'];a=np.frombuffer(b,offset=8+hsize+s,count=(e-s)//4,dtype='<f4')
   assert a.size==np.prod(v['shape']) and np.isfinite(a).all();count+=a.size
  assert count==3833856
  checks.append(dict(path=n,sha256=sha(b),tensors=len(h),parameters=count,dtype='F32',all_finite=True,shapes_match_initial_and_reload=True))
  if '/adapter/' in n:assert sha(b)==report['adapter_sha256']['adapter_model.safetensors']
 for call in report['calls']:
  b=z.read('run/'+call['path']);assert sha(b)==call['raw_sha256'];raw=json.loads(b)
  assert sha(raw['raw_text'].encode())==raw['raw_utf8_sha256']
 z.extractall(OUT)
 result=dict(full_archive_bytes=P.stat().st_size,full_archive_sha256=sha(P.read_bytes()),payloads=len(m),members=len(m)+1,
  crc_hash_size_all_verified=True,cpu_archive_exact=True,api_source_test_remote_verified_bytes_exact=True,plan_and_manifest_exact=True,
  weights=checks,optimizer_steps=report['optimizer_steps_completed'],generations=report['model_calls_completed'],
  meaning_adopted=diagnosis['meaning_adopted_count'],body_available=diagnosis['body_available_count'],
  model_loads=0,training_updates=0,new_generations=0,sql_operations=0,product_credit=0,automatic_progression=False)
(B/'external_verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(result))
