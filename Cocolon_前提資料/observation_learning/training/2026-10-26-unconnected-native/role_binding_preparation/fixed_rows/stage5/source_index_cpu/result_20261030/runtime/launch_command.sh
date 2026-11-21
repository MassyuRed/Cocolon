python3.12 - <<'PY'
from pathlib import Path
import hashlib,json,os,subprocess,sys,time,urllib.request,urllib.parse
p=Path('/workspace/cocolon_source_index_probe_pack_20261030');p.mkdir(exist_ok=False)
commit='2e3a607199b79d8cf0bde92bece8abf3a3630e99'
base='https://raw.githubusercontent.com/MassyuRed/Cocolon/'+commit+'/'+urllib.parse.quote('Cocolon_前提資料/observation_learning/training/2026-10-26-unconnected-native/role_binding_preparation/fixed_rows/stage5/source_index_cpu/')
for name,relative in {'plan.json':'execution_20261030/plan.json','run_source_index_once.py':'run_source_index_once.py','prompt_source_index.py':'prompt_source_index.py'}.items():
 b=urllib.request.urlopen(base+relative,timeout=30).read();(p/name).write_bytes(b)
plan=json.loads((p/'plan.json').read_text());assert plan['status']=='MASH_EXPLICITLY_APPROVED_ONCE' and plan['approval']['proposal_commit']=='6b9b0d42c17f5919b44140275c67b94d45c637c8'
for name,digest in plan['source_sha256'].items():assert hashlib.sha256((p/name).read_bytes()).hexdigest()==digest
assert not Path('/workspace/cocolon_source_index_probe_run_20261030').exists()
fd=os.open(p/'execute_once.lock',os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600);os.write(fd,(commit+'\n').encode());os.close(fd)
cmd=['timeout','--signal=TERM','--kill-after=10s','1790s',sys.executable,'-B',str(p/'run_source_index_once.py'),'--execute','--source-commit',commit]
(p/'gpu_launch.json').write_text(json.dumps({'command':cmd,'started_unix':time.time(),'max_gpu_process_seconds':1800,'max_process_usd':0.14,'retry':False},indent=2)+'\n')
env=dict(os.environ,HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1');started=time.monotonic()
print('SOURCE_INDEX_GPU_LAUNCH_ONCE',commit,flush=True)
with (p/'gpu.log').open('wb') as f:done=subprocess.run(cmd,env=env,stdout=f,stderr=subprocess.STDOUT)
(p/'gpu.exit').write_text(str(done.returncode)+'\n');(p/'gpu_elapsed.json').write_text(json.dumps({'outer_seconds':time.monotonic()-started,'exit':done.returncode},indent=2)+'\n')
print('SOURCE_INDEX_GPU_FINISHED',done.returncode,'SECONDS',time.monotonic()-started,flush=True);print((p/'gpu.log').read_text()[-2000:])
PY