python3.12 - <<'PY'
from pathlib import Path
import urllib.request,urllib.parse,hashlib,json,gzip,subprocess,os,time
root=Path('/workspace/cocolon_aligned19_pack_20261030')
commit='105c08d231c3fb993f565197b200a5db8ff6c05e'
prefix='Cocolon_前提資料/observation_learning/training/2026-10-26-unconnected-native/role_binding_preparation/fixed_rows/stage5/aligned19/'
expected={'approved_plan.json':'7bb865b90f024a0f8a6ad8082646471e8a56c9ebadc92f5b74c33d9bae5263bc','launch_aligned19_once.py':'b47d51339b457f533e5def6b165479499ed309b4787dd50cd501e42608609c40'}
assert not (root/'execute_once.lock').exists() and not Path('/workspace/cocolon_aligned19_run_20261030').exists()
for name,digest in expected.items():
 target=root/name
 assert not target.exists(),name
 data=urllib.request.urlopen('https://raw.githubusercontent.com/MassyuRed/Cocolon/'+commit+'/'+urllib.parse.quote(prefix+name),timeout=30).read()
 assert hashlib.sha256(data).hexdigest()==digest
 with target.open('xb') as stream:stream.write(data)
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert sha(root/'proposal.json')=='bcb4459e805aaef00fdcdc068b19f1bc83b49d175792aa8e4c885a2f73d41724'
cpu=json.loads(gzip.decompress(Path('/workspace/cocolon_aligned19_cpu_20261030/prepared_cpu.json.gz').read_bytes()))
assert all(sha(p)==h for p,h in cpu['frozen'].items())
assert os.environ.get('CUDA_VISIBLE_DEVICES')!='','GPU visibility unexpectedly disabled'
with (root/'bootstrap.log').open('x') as log:
 child=subprocess.Popen(['/usr/bin/python3.12',str(root/'launch_aligned19_once.py'),'--source-commit',commit],cwd=root,stdin=subprocess.DEVNULL,stdout=log,stderr=subprocess.STDOUT,start_new_session=True)
receipt={'source_commit':commit,'launcher_pid':child.pid,'started_unix':time.time(),'frozen_preflight':len(cpu['frozen']),'approval_sha256':sha(root/'approved_plan.json'),'retry':False}
(root/'bootstrap.json').write_text(json.dumps(receipt,indent=2)+chr(10))
print(json.dumps(receipt,indent=2))
PY
