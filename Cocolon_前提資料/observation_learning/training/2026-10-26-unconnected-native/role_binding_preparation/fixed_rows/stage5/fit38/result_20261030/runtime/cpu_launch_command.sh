python3.12 - <<'PY'
from pathlib import Path
import urllib.request,urllib.parse,hashlib,json,subprocess,time,os
root=Path('/workspace/cocolon_fit38_pack_20261030');assert not root.exists();root.mkdir()
commit='fbab342b9a902d1e412571a501aaf76d1d0be3e3'
prefix='Cocolon_前提資料/observation_learning/training/2026-10-26-unconnected-native/role_binding_preparation/fixed_rows/stage5/fit38/'
for name in ['proposal.json','prepare_fit38.py','run_fit38_once.py','prompt_source_index.py','launch_fit38_once.py','export_fit38.py','README.md']:
 (root/name).write_bytes(urllib.request.urlopen('https://raw.githubusercontent.com/MassyuRed/Cocolon/'+commit+'/'+urllib.parse.quote(prefix+name),timeout=30).read())
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert sha(root/'proposal.json')=='51573dba7e31054f7b97258295293d120e34b7e57719284187b31b6fc61e4d4d'
plan=json.loads((root/'proposal.json').read_text())
assert plan['status']=='PROPOSED_NEEDS_NEW_MASH_APPROVAL' and not (root/'approved_plan.json').exists()
for name,digest in plan['source_sha256'].items():assert sha(root/name)==digest
start=time.monotonic()
with (root/'cpu.log').open('x') as log:
 result=subprocess.run(['/usr/bin/python3.12',str(root/'prepare_fit38.py')],cwd=root,stdin=subprocess.DEVNULL,stdout=log,stderr=subprocess.STDOUT,timeout=180)
receipt={'source_commit':commit,'exit_code':result.returncode,'outer_seconds':time.monotonic()-start,'gpu_execution':False,'approval_present':False}
(root/'execution.json').write_text(json.dumps(receipt,indent=2)+chr(10));print(json.dumps(receipt));print((root/'cpu.log').read_text())
PY
