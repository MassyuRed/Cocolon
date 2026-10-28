from pathlib import Path
import os,subprocess,json,time
p=Path('/workspace/cocolon_reset9_pack_20261028')
lock=Path('/workspace/cocolon_reset9_launch.lock')
with lock.open('x') as f:f.write('new_initialization_only_unit_source6eb760ab
')
assert not Path('/workspace/cocolon_reset9_run_20261028').exists()
env=dict(os.environ,CUDA_VISIBLE_DEVICES='0',HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1',TOKENIZERS_PARALLELISM='false')
cmd=['timeout','--signal=TERM','--kill-after=10s','590s','/workspace/cocolon_venv/bin/python','-B',str(p/'run_reset9.py'),'--pack',str(p),'--execute','--source-commit','6eb760abfbab78a52d25719814aab32e73c901c8']
(p/'launch.json').write_text(json.dumps(dict(command=cmd,started_utc=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),retry=False)))
with open('/workspace/cocolon_reset9_gpu.log','x') as log:
 r=subprocess.run(cmd,env=env,cwd=p,stdout=log,stderr=subprocess.STDOUT)
Path('/workspace/cocolon_reset9_gpu.exit').write_text(str(r.returncode))
