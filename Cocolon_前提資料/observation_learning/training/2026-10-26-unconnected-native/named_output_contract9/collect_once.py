from pathlib import Path
import subprocess,os,time
b=Path('/workspace');p=b/'cocolon_namedoutput9_pack_20261028';u=b/'cocolon_namedoutput9_upload_20261028'
end=time.monotonic()+660
while not (b/'cocolon_namedoutput9_gpu.exit').exists():
 if time.monotonic()>end:raise TimeoutError('GPU exit not received; no retry')
 time.sleep(1)
env=dict(os.environ,CUDA_VISIBLE_DEVICES='',HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
py='/workspace/cocolon_venv/bin/python'
subprocess.run([py,'-B',str(p/'consume_named9.py'),'--root',str(b/'cocolon_namedoutput9_root_20261028'),'--run',str(b/'cocolon_namedoutput9_run_20261028'),'--out',str(p/'cmee_result')],env=env,check=True,timeout=180)
subprocess.run([py,'-B',str(u/'export_namedoutput9.py')],env=env,check=True,timeout=180)
(b/'cocolon_namedoutput9_collect.exit').write_text('0\n')
