"""Run one prompt-aligned existing74 comparison; retain prior runs and partial evidence."""
from pathlib import Path
import hashlib,json,shutil,subprocess,time

w=Path('/workspace');root=w/'analysis-aligned74-20261103'
prepared=w/'analysis-aligned74-prepared-20261103'
api=w/'analysis-semantic-boundaries-api-20261103'
old=w/'analysis-written-role74-20261103';initial=old/'result/adapter'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()

def main():
    assert not root.exists() and not prepared.exists()
    assert (w/'semantic-boundaries-tests.exit').read_text()=='0'
    assert (w/'analysis-semantic-boundaries46-20261103/run.exit').read_text()=='0'
    assert (w/'semantic-boundaries46-collect.exit').read_text()=='0'
    assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip()=='dc05dc358d1c44ce47fd844f6041d74f1f74fe6a'
    assert not subprocess.check_output(['git','-C',str(api),'status','--porcelain','--untracked-files=no'],text=True).strip()
    assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True).strip()
    prior=json.loads((w/'analysis-semantic-boundaries46-20261103/gpu-after.json').read_text())['prior_adapter_hashes']
    assert len(prior)==12 and all(sha(p)==h for p,h in prior.items())
    names=['semantic_units_aligned74_prepare.py','semantic_units_aligned74_run.py','semantic_units_aligned74_supervisor.py']
    root.mkdir()
    for name in names:shutil.copyfile(w/name,root/name)
    (root/'code_hashes.json').write_text(json.dumps({n:sha(root/n) for n in names},indent=2)+'\n')
    with (root/'prepare.log').open('x') as f:
        proc=subprocess.run(['timeout','180s',str(w/'analysis-runtime-20261103/bin/python'),str(root/names[0])],stdout=f,stderr=subprocess.STDOUT)
    (root/'prepare.exit').write_text(str(proc.returncode))
    if proc.returncode:
        print(json.dumps(dict(stage='CPU_PREPARE_FAILED',exit=proc.returncode)));return
    shutil.copytree(prepared,root,dirs_exist_ok=True)
    shutil.copyfile(w/'analysis-combination70-20261103/adaptive_loss.py',root/'adaptive_loss.py')
    plan_path=root/'semantic_units_aligned74_plan.json'
    pack=json.loads(plan_path.read_text())
    assert len(pack['teachers'])==74 and len(pack['evaluation'])==46
    assert (pack['plan']['max_updates'],pack['plan']['max_model_loads'],pack['plan']['max_new_generations'])==(86,2,46)
    assert sha(initial/'adapter_model.safetensors')==pack['plan']['initial_weights_sha256']
    assert sha(initial/'adapter_config.json')==pack['plan']['initial_config_sha256']
    cmd=['timeout','--signal=TERM','--kill-after=10s','890s',str(w/'analysis-runtime-20261103/bin/python'),
         str(root/names[1]),'--api-root',str(api),'--plan',str(plan_path),'--plan-sha256',sha(plan_path),
         '--initial-dir',str(initial),'--adaptive-loss',str(root/'adaptive_loss.py'),'--out',str(root/'result')]
    start=time.monotonic()
    with (root/'run.log').open('x') as f:code=subprocess.run(cmd,stdout=f,stderr=subprocess.STDOUT).returncode
    (root/'run.exit').write_text(str(code))
    (root/'gpu-after.json').write_text(json.dumps(dict(exit=code,parent_seconds=time.monotonic()-start,
        prior_six_adapter_pairs_unchanged=all(sha(p)==h for p,h in prior.items()),prior_adapter_hashes=prior,
        compute_apps=subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True)),indent=2)+'\n')
    files=[p for p in root.rglob('*') if p.is_file()]
    (root/'manifest.json').write_text(json.dumps({str(p.relative_to(root)):sha(p) for p in files},indent=2)+'\n')
    print(json.dumps(dict(exit=code,parent_seconds=time.monotonic()-start,members=len(files)+1)))

if __name__=='__main__':main()
