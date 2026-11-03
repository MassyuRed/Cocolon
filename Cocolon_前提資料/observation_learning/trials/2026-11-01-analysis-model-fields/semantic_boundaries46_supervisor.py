"""CPU preflight then exactly one bounded instruction comparison, retaining all old bytes."""
from pathlib import Path
from hashlib import sha256
import json,subprocess,shutil,time

w=Path('/workspace');root=w/'analysis-semantic-boundaries46-20261103'
prepared=w/'analysis-semantic-boundaries46-prepared-20261103';api=w/'analysis-semantic-boundaries-api-20261103'
sha=lambda p:sha256(Path(p).read_bytes()).hexdigest()
assert not root.exists() and not prepared.exists()
assert (w/'semantic-boundaries-tests.exit').read_text()=='0'
assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip()=='dc05dc358d1c44ce47fd844f6041d74f1f74fe6a'
assert not subprocess.check_output(['git','-C',str(api),'status','--porcelain','--untracked-files=no'],text=True).strip()
pins={'semantic_boundaries46_prepare.py': '05d10bfd20149acc91b621445350c97716de0e6f0d87c82cba16ab9d485c7065', 'semantic_boundaries46_run.py': '0ea0eb617b3e3a38c9a27766d552c3c3406b68b1dc2fcbe723cd6370ca126335'}
assert all(sha(w/n)==h for n,h in pins.items())
prior=json.loads((w/'analysis-written-role74-20261103/gpu-after.json').read_text())['prior_adapter_hashes']
old=w/'analysis-written-role74-20261103/result/adapter'
prior.update({str(old/n):sha(old/n) for n in ['adapter_model.safetensors','adapter_config.json']})
assert all(sha(p)==h for p,h in prior.items())
assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True).strip()
root.mkdir()
for n in [*pins,'semantic_boundaries46_supervisor.py']:shutil.copyfile(w/n,root/n)
with (root/'prepare.log').open('x') as f:
    subprocess.run(['timeout','180s',str(w/'analysis-runtime-20261103/bin/python'),str(root/'semantic_boundaries46_prepare.py')],stdout=f,stderr=subprocess.STDOUT,check=True)
shutil.copytree(prepared,root,dirs_exist_ok=True)
start=time.monotonic()
cmd=['timeout','--signal=TERM','--kill-after=10s','890s',str(w/'analysis-runtime-20261103/bin/python'),str(root/'semantic_boundaries46_run.py')]
with (root/'run.log').open('x') as f:code=subprocess.run(cmd,stdout=f,stderr=subprocess.STDOUT).returncode
(root/'run.exit').write_text(str(code))
(root/'gpu-after.json').write_text(json.dumps(dict(exit=code,parent_seconds=time.monotonic()-start,
    prior_six_adapter_pairs_unchanged=all(sha(p)==h for p,h in prior.items()),prior_adapter_hashes=prior,
    compute_apps=subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True)),indent=2)+'\n')
(root/'manifest.json').write_text(json.dumps({str(p.relative_to(root)):sha(p) for p in root.rglob('*') if p.is_file()},indent=2)+'\n')
print(json.dumps(dict(exit=code,parent_seconds=time.monotonic()-start)))
