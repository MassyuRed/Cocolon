"""Single role4 continuation with old70/order retained; preserve every prior run."""
from pathlib import Path
import hashlib,json,shutil,subprocess,time
w=Path('/workspace');root=w/'analysis-written-role74-20261103'
prepared=w/'analysis-written-role74-prepared-20261103';api=w/'analysis-written-role-api-v2-20261103'
old=w/'analysis-combination70-20261103';initial=old/'result/adapter'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert not root.exists() and not prepared.exists()
source_hashes={
    'semantic_units_written_role74_prepare.py':'870f29c8c0fbe2bc032ab4f25fd141dc2e42ad7d9768c6ff56a8bef4b12cfb8d',
    'semantic_units_written_role74_run.py':'277cfa23dc22bdcd3c40095eaad488f234c8324156d06ba3b157b12275d2605f',
}
assert all(sha(w/n)==h for n,h in source_hashes.items())
assert (w/'written-role8.exit').read_text()=='0' and (w/'written-role4-cpu.exit').read_text()=='0'
assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip()=='88078cdb3cf19da0e9fe9188915bce9c0899a797'
assert not subprocess.check_output(['git','-C',str(api),'status','--porcelain','--untracked-files=no'],text=True).strip()
assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True).strip()
folders=[w/n/'result/adapter' for n in ['analysis-other62-restored-20261103',
    'analysis-scope68-20261103','analysis-ce68-20261103','analysis-replay68-20261103','analysis-combination70-20261103']]
prior_hashes={str(p/n):sha(p/n) for p in folders for n in ['adapter_model.safetensors','adapter_config.json']}
root.mkdir()
for n in [*source_hashes,'semantic_units_written_role74_supervisor.py']:
    shutil.copyfile(w/n,root/n)
with (root/'prepare.log').open('x') as f:
    subprocess.run(['timeout','180s',str(w/'analysis-runtime-20261103/bin/python'),
        str(root/'semantic_units_written_role74_prepare.py')],stdout=f,stderr=subprocess.STDOUT,check=True)
shutil.copytree(prepared,root,dirs_exist_ok=True)
shutil.copyfile(old/'adaptive_loss.py',root/'adaptive_loss.py')
pack=json.loads((root/'semantic_units_written_role74_plan.json').read_text())
assert len(pack['teachers'])==74 and len(pack['evaluation'])==46
assert pack['plan']['max_updates']==86 and len(pack['preexisting_evaluation'])==42
assert sha(initial/'adapter_model.safetensors')==pack['plan']['initial_weights_sha256']
assert sha(initial/'adapter_config.json')==pack['plan']['initial_config_sha256']
cmd=['timeout','--signal=TERM','--kill-after=10s','890s',str(w/'analysis-runtime-20261103/bin/python'),
    str(root/'semantic_units_written_role74_run.py'),'--api-root',str(api),
    '--plan',str(root/'semantic_units_written_role74_plan.json'),
    '--plan-sha256',sha(root/'semantic_units_written_role74_plan.json'),
    '--initial-dir',str(initial),'--adaptive-loss',str(root/'adaptive_loss.py'),'--out',str(root/'result')]
start=time.monotonic()
with (root/'run.log').open('x') as f:code=subprocess.run(cmd,stdout=f,stderr=subprocess.STDOUT).returncode
(root/'run.exit').write_text(str(code))
(root/'gpu-after.json').write_text(json.dumps(dict(exit=code,process_seconds=time.monotonic()-start,
    prior_unchanged=prior_hashes=={p:sha(p) for p in prior_hashes},
    prior_adapter_hashes=prior_hashes,compute_apps=subprocess.check_output([
        'nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True)),indent=2)+'\n')
files=[p for p in root.rglob('*') if p.is_file()]
(root/'manifest.json').write_text(json.dumps({str(p.relative_to(root)):sha(p) for p in files},indent=2)+'\n')
print(json.dumps(dict(exit=code,seconds=time.monotonic()-start,members=len(files)+1)))
