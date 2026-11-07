"""One fixed same68/three-slot comparison, no retry or extension."""
from pathlib import Path
import hashlib,json,shutil,subprocess,time
w=Path('/workspace');root=w/'analysis-replay68-20261103';prior=w/'analysis-ce68-20261103';weighted=w/'analysis-scope68-20261103';initial=w/'analysis-other62-restored-20261103';prepared=w/'analysis-replay68-prepared-20261103';api=w/'analysis-api-20261103'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert not root.exists()
pack=json.loads((prepared/'semantic_units_replay68_plan.json').read_text());old=json.loads((prior/'semantic_units_ce68_plan.json').read_text());report=json.loads((prior/'result/report.json').read_text())
assert pack['teachers']==old['teachers'] and [(i+1,a,b) for i,(a,b) in enumerate(zip(old['plan']['update_order'],pack['plan']['update_order'])) if a!=b]==[(35,'SC01','UQ01'),(40,'SC02','BT08'),(55,'SC05','ST07')]
assert {k for k in pack['plan'] if pack['plan'][k]!=old['plan'][k]}=={'update_order','representation_comparison','evaluation_scope'} and pack['evaluation']==old['evaluation']
assert (prior/'run.exit').read_text()=='0' and report['updates_completed']==74 and report['new_calls']==32
m=json.loads((prior/'manifest.json').read_text());assert len(m)==267 and all(sha(prior/n)==h for n,h in m.items())
source=json.loads((prior/'api_source_manifest.json').read_text());assert len(source)==2134 and all(sha(api/n)==h for n,h in source.items())
for n,k in [('adapter_model.safetensors','initial_weights_sha256'),('adapter_config.json','initial_config_sha256')]:assert sha(initial/'result/adapter'/n)==pack['plan'][k]
apps=subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True);assert not apps.strip()
root.mkdir()
for n in ['semantic_units_replay68_plan.json','semantic_units_replay68_cpu.json']:shutil.copyfile(prepared/n,root/n)
for n in ['semantic_units_replay68_prepare.py','semantic_units_replay68_run.py','semantic_units_replay68_supervisor.py']:shutil.copyfile(w/n,root/n)
for n in ['adaptive_loss.py','api_source_manifest.json','reused_before.json']:shutil.copyfile(prior/n,root/n)
for row in pack['evaluation']:
 key=row['probe_id'];base=prior/('before_'+key)
 for suffix in ['.request.json','.response.json','.raw.txt','.candidate.json']:
  p=Path(str(base)+suffix)
  if p.exists():shutil.copyfile(p,root/p.name)
priorhash={str(folder/n):sha(folder/n) for folder in [prior/'result/adapter',weighted/'result/adapter',initial/'result/adapter'] for n in ['adapter_model.safetensors','adapter_config.json']}
cmd=['timeout','--signal=TERM','--kill-after=10s','710s',str(w/'analysis-runtime-20261103/bin/python'),str(root/'semantic_units_replay68_run.py'),'--api-root',str(api),'--plan',str(root/'semantic_units_replay68_plan.json'),'--plan-sha256',sha(root/'semantic_units_replay68_plan.json'),'--initial-dir',str(initial/'result/adapter'),'--adaptive-loss',str(root/'adaptive_loss.py'),'--out',str(root/'result')]
start=time.monotonic()
with (root/'run.log').open('w') as f:code=subprocess.run(cmd,stdout=f,stderr=subprocess.STDOUT).returncode
(root/'run.exit').write_text(str(code));(root/'gpu-after.json').write_text(json.dumps(dict(exit=code,process_seconds=time.monotonic()-start,prior_unchanged=priorhash=={n:sha(n) for n in priorhash},compute_apps=subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True)),indent=2))
files=[p for p in root.rglob('*') if p.is_file()];(root/'manifest.json').write_text(json.dumps({str(p.relative_to(root)):sha(p) for p in files},indent=2)+'\n')
print(json.dumps(dict(exit=code,seconds=time.monotonic()-start,members=len(files)+1)))
