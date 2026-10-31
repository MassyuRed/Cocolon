from pathlib import Path
import os,subprocess,json,time
p=Path('/workspace/cocolon_cache_prefix_shop_pack_20261030')
started=time.monotonic()
command=['timeout','--signal=TERM','--kill-after=10s','170s','python3.12','-B',str(p/'run_cache_prefix_shop.py'),'--execute','--source-commit','a79f2525149cf12ea25fc05241da7e2eb19c269f']
env=dict(os.environ,HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
with (p/'gpu.log').open('xb') as log: result=subprocess.run(command,stdout=log,stderr=subprocess.STDOUT,env=env)
(p/'gpu.exit').write_text(str(result.returncode)+chr(10))
(p/'gpu_elapsed.json').write_text(json.dumps({'exit_code':result.returncode,'outer_seconds':time.monotonic()-started,'command':command,'source_commit':command[-1],'retry':False},indent=2)+chr(10))
