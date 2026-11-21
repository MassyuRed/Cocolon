"""Launch reset9 once; preserve launch errors and never retry a model run."""
import ast,hashlib,json,os,subprocess,sys,time
from pathlib import Path
PACK=Path('/workspace/cocolon_reset9_pack_20261028')
SOURCE=sys.argv[1]
assert len(SOURCE)==40 and all(c in '0123456789abcdef' for c in SOURCE)
assert not Path('/workspace/cocolon_reset9_launch.lock').exists()
assert not Path('/workspace/cocolon_reset9_run_20261028').exists()
assert not Path('/workspace/cocolon_reset9_gpu.log').exists()
assert not Path('/workspace/cocolon_reset9_gpu.exit').exists()
for name in ['run_reset9.py','prepare_reset9.py','consume_named9.py','export_reset9.py']:
 ast.parse((PACK/name).read_text())
with Path('/workspace/cocolon_reset9_launch.lock').open('x') as f:f.write('initialization_only_d431_once_source='+SOURCE)
env=dict(os.environ,CUDA_VISIBLE_DEVICES='0',HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1',TOKENIZERS_PARALLELISM='false')
cmd=['timeout','--signal=TERM','--kill-after=10s','590s','/workspace/cocolon_venv/bin/python','-B',str(PACK/'run_reset9.py'),'--pack',str(PACK),'--execute','--source-commit',SOURCE]
(PACK/'launch.json').write_text(json.dumps(dict(command=cmd,started_utc=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),retry=False)))
with open('/workspace/cocolon_reset9_gpu.log','x') as log:
 result=subprocess.run(cmd,env=env,cwd=PACK,stdout=log,stderr=subprocess.STDOUT)
Path('/workspace/cocolon_reset9_gpu.exit').write_text(str(result.returncode))
