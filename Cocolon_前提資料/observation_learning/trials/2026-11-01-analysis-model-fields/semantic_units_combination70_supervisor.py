"""One bounded RC2-addition comparison; preserve prior runs and adapters."""
from pathlib import Path
import hashlib,json,shutil,subprocess,time
w=Path('/workspace');root=w/'analysis-combination70-20261103';prior=w/'analysis-ce68-20261103';replay=w/'analysis-replay68-20261103';initial=w/'analysis-other62-restored-20261103';prepared=w/'analysis-combination70-prepared-20261103';api=w/'analysis-api-20261103'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert not root.exists()
pack=json.loads((prepared/'semantic_units_combination70_plan.json').read_text());old=json.loads((prior/'semantic_units_ce68_plan.json').read_text())
assert pack['teachers'][:68]==old['teachers'] and pack['evaluation'][:32]==old['evaluation']
assert [x for x in pack['plan']['update_order'] if x not in ['RC01','RC02']]==old['plan']['update_order'] and pack['plan']['update_order'][-14:]==old['plan']['update_order'][-14:]
for folder in [prior,replay]:
 r=json.loads((folder/'result/report.json').read_text());assert (folder/'run.exit').read_text()=='0' and r['updates_completed']==74 and r['new_calls']==32
m=json.loads((prior/'manifest.json').read_text());assert len(m)==267 and all(sha(prior/n)==h for n,h in m.items())
source=json.loads((prior/'api_source_manifest.json').read_text());assert len(source)==2134 and all(sha(api/n)==h for n,h in source.items())
for n,k in [('adapter_model.safetensors','initial_weights_sha256'),('adapter_config.json','initial_config_sha256')]:assert sha(initial/'result/adapter'/n)==pack['plan'][k]
assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True).strip()
root.mkdir()
for n in ['semantic_units_combination70_plan.json','semantic_units_combination70_cpu.json']:shutil.copyfile(prepared/n,root/n)
for n in ['semantic_units_combination70_prepare.py','semantic_units_combination70_run.py','semantic_units_combination70_supervisor.py']:shutil.copyfile(w/n,root/n)
for n in ['adaptive_loss.py','api_source_manifest.json','reused_before.json']:shutil.copyfile(prior/n,root/n)
shutil.copytree(w/'analysis-combination2-cpu-v2-20261103',root/'combination2')
for row in old['evaluation']:
 key=row['probe_id'];base=prior/('before_'+key)
 for suffix in ['.request.json','.response.json','.raw.txt','.candidate.json']:
  p=Path(str(base)+suffix)
  if p.exists():shutil.copyfile(p,root/p.name)
folders=[initial,prior,replay,w/'analysis-scope68-20261103']
priorhash={str(folder/'result/adapter'/n):sha(folder/'result/adapter'/n) for folder in folders for n in ['adapter_model.safetensors','adapter_config.json']}
cmd=['timeout','--signal=TERM','--kill-after=10s','890s',str(w/'analysis-runtime-20261103/bin/python'),str(root/'semantic_units_combination70_run.py'),'--api-root',str(api),'--plan',str(root/'semantic_units_combination70_plan.json'),'--plan-sha256',sha(root/'semantic_units_combination70_plan.json'),'--initial-dir',str(initial/'result/adapter'),'--adaptive-loss',str(root/'adaptive_loss.py'),'--out',str(root/'result')]
start=time.monotonic()
with (root/'run.log').open('w') as f:code=subprocess.run(cmd,stdout=f,stderr=subprocess.STDOUT).returncode
(root/'run.exit').write_text(str(code));(root/'gpu-after.json').write_text(json.dumps(dict(exit=code,process_seconds=time.monotonic()-start,prior_unchanged=priorhash=={n:sha(n) for n in priorhash},compute_apps=subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True)),indent=2))
files=[p for p in root.rglob('*') if p.is_file()];(root/'manifest.json').write_text(json.dumps({str(p.relative_to(root)):sha(p) for p in files},indent=2)+'\n')
print(json.dumps(dict(exit=code,seconds=time.monotonic()-start,members=len(files)+1)))
