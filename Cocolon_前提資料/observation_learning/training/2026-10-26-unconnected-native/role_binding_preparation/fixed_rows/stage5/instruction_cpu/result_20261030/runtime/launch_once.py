from pathlib import Path
import json,os,subprocess,time
p=Path('/workspace/cocolon_instruction_probe_pack_20261030');start=time.monotonic()
env=dict(os.environ,HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1',PYTHONUNBUFFERED='1')
command=['timeout','--signal=TERM','--kill-after=10s','1790s','python3.12','-B',str(p/'run_inference_once.py'),'--execute','--source-commit','928513c4bf2b150ad64d2b8624bb06be2a4dd65f']
(p/'gpu_launch.json').write_text(json.dumps(dict(command=command,started_unix=time.time(),max_gpu_process_seconds=1800,max_process_usd=.14,retry=False),indent=2)+'\n')
with (p/'gpu.log').open('x') as log:result=subprocess.run(command,env=env,stdout=log,stderr=subprocess.STDOUT)
(p/'gpu.exit').write_text(str(result.returncode)+'\n')
(p/'gpu_elapsed.json').write_text(json.dumps(dict(seconds=time.monotonic()-start,exit_code=result.returncode),indent=2)+'\n')
