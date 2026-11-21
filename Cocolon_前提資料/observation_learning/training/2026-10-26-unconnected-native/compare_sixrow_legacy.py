import os
os.environ.update(CUDA_VISIBLE_DEVICES='',HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
from pathlib import Path
import subprocess,sys,json,hashlib,time
r=Path('/workspace/cocolon_sixrow_cpu_20261026');a=r/'legacy-01';a.mkdir(exist_ok=False);t=time.monotonic()
try:
 for name,base in [('before','/workspace/cocolon_quote_reception_fixed_api_20261025'),('after','/workspace/cocolon_sixrow_api_20261026')]:
  subprocess.run([sys.executable,str(r/'capture_sixrow_legacy.py'),base,str(a/(name+'.json'))],check=True,stdout=(a/(name+'.log')).open('w'),stderr=subprocess.STDOUT)
 b=(a/'before.json').read_bytes();c=(a/'after.json').read_bytes(); rows=json.loads(c);assert len(rows)==18
 report=dict(status='LEGACY_18_FULL_BYTE_EQUAL' if b==c else 'LEGACY_DRIFT_STOP',equal=b==c,records=18,chair=2,daily_variants=16,components=['semantic_snapshot','meaning_json','native_bindings_json','surface_proposal_json','question_proposal_json','outcome','legacy_messages','quote_messages'],before_sha256=hashlib.sha256(b).hexdigest(),after_sha256=hashlib.sha256(c).hexdigest(),bytes=len(c),seconds=time.monotonic()-t,model_calls=0)
except BaseException:
 import traceback
 report=dict(status='LEGACY_CAPTURE_ERROR_PRESERVED',error=traceback.format_exc(),seconds=time.monotonic()-t)
(a/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
