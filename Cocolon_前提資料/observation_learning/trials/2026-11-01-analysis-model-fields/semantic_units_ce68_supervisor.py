"""One plain-CE controlled continuation; same68/74order, exact before32 reuse."""
from pathlib import Path
import json,hashlib,subprocess,shutil,time,zipfile
w=Path('/workspace');root=w/'analysis-ce68-20261103';prior=w/'analysis-scope68-20261103';initial=w/'analysis-other62-restored-20261103';prepared=w/'analysis-ce68-prepared-v2-20261103';api=w/'analysis-api-20261103'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert not root.exists()
pack=json.loads((prepared/'semantic_units_ce68_plan.json').read_text());old=json.loads((prior/'semantic_units_scope68_plan.json').read_text());report=json.loads((prior/'result/report.json').read_text())
assert pack['teachers']==old['teachers'] and pack['plan']['update_order']==old['plan']['update_order']
assert (prior/'run.exit').read_text()=='0' and report['updates_completed']==74 and report['new_calls']==40
m=json.loads((prior/'manifest.json').read_text());assert len(m)==264 and all(sha(prior/n)==h for n,h in m.items())
source=json.loads((prior/'api_source_manifest.json').read_text());assert len(source)==2134 and all(sha(api/n)==h for n,h in source.items())
for name,key in [('adapter_model.safetensors','initial_weights_sha256'),('adapter_config.json','initial_config_sha256')]:assert sha(initial/'result/adapter'/name)==pack['plan'][key]
apps=subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True);assert not apps.strip()
root.mkdir()
for n in ('semantic_units_ce68_plan.json','semantic_units_ce68_cpu.json'):shutil.copyfile(prepared/n,root/n)
for n in ('semantic_units_ce68_prepare.py','semantic_units_ce68_run.py','semantic_units_ce68_supervisor.py'):shutil.copyfile(w/n,root/n)
shutil.copyfile(prior/'adaptive_loss.py',root/'adaptive_loss.py');shutil.copyfile(prior/'api_source_manifest.json',root/'api_source_manifest.json')
reused=[]
for row in old['evaluation']:
 key=row['probe_id'];base=prior/'result'/('before_'+key) if row['pre_generation_required'] else prior/('before_'+key)
 req=json.loads(Path(str(base)+'.request.json').read_text());response=json.loads(Path(str(base)+'.response.json').read_text());raw=Path(str(base)+'.raw.txt').read_bytes()
 assert req['messages']==row['messages'] and req['request_ref']==response['request_ref']==row['request_ref']
 assert response['raw'].encode()==raw and response['raw_sha256']==hashlib.sha256(raw).hexdigest()
 if row['pre_generation_required']:
  calls=[x for x in report['calls'] if x['phase']=='before' and x['probe_id']==key];assert len(calls)==1 and calls[0]['raw_sha256']==response['raw_sha256']
 else:
  proof=json.loads((prior/'reused_before.json').read_text());entry=[x for x in proof if x['probe_id']==key];assert len(entry)==1 and entry[0]['adapter_sha256']==pack['plan']['initial_weights_sha256'] and entry[0]['raw_sha256']==response['raw_sha256']
 for suffix in ('.request.json','.response.json','.raw.txt','.candidate.json'):
  sourcefile=Path(str(base)+suffix)
  if sourcefile.exists():shutil.copyfile(sourcefile,root/('before_'+key+suffix))
 reused.append(dict(probe_id=key,raw_sha256=response['raw_sha256'],adapter_sha256=pack['plan']['initial_weights_sha256']))
assert len(reused)==32
(root/'reused_before.json').write_text(json.dumps(reused,indent=2)+'\n')
priorhash={str(folder/n):sha(folder/n) for folder in (prior/'result/adapter',initial/'result/adapter') for n in ('adapter_model.safetensors','adapter_config.json')}
cmd=['timeout','--signal=TERM','--kill-after=10s','710s',str(w/'analysis-runtime-20261103/bin/python'),str(root/'semantic_units_ce68_run.py'),'--api-root',str(api),'--plan',str(root/'semantic_units_ce68_plan.json'),'--plan-sha256',sha(root/'semantic_units_ce68_plan.json'),'--initial-dir',str(initial/'result/adapter'),'--adaptive-loss',str(root/'adaptive_loss.py'),'--out',str(root/'result')]
start=time.monotonic()
with (root/'run.log').open('w') as f:code=subprocess.run(cmd,stdout=f,stderr=subprocess.STDOUT).returncode
(root/'run.exit').write_text(str(code));(root/'gpu-after.json').write_text(json.dumps(dict(exit=code,process_seconds=time.monotonic()-start,prior_unchanged=priorhash=={n:sha(n) for n in priorhash},compute_apps=subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True)),indent=2))
files=[p for p in root.rglob('*') if p.is_file()];(root/'manifest.json').write_text(json.dumps({str(p.relative_to(root)):sha(p) for p in files},indent=2)+'\n')
print(json.dumps(dict(exit=code,seconds=time.monotonic()-start,members=len(files)+1)))
