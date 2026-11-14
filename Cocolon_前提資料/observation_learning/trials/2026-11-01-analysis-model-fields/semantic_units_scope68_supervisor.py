"""Run one prepared scope68 comparison, preserve partials, never retry/adopt."""
from pathlib import Path
import json,hashlib,subprocess,time,shutil,zipfile
w=Path('/workspace');root=w/'analysis-scope68-20261103';prior=w/'analysis-other62-restored-20261103';prepared=w/'analysis-scope68-prepared-20261103';api=w/'analysis-api-20261103'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert not root.exists()
pack=json.loads((prepared/'semantic_units_scope68_plan.json').read_text());old=json.loads((prior/'semantic_units_other62_plan.json').read_text());oldreport=json.loads((prior/'result/report.json').read_text())
old_manifest=json.loads((prior/'manifest.json').read_text());assert len(old_manifest)==269 and all(sha(prior/n)==h for n,h in old_manifest.items())
assert pack['teachers'][:62]==old['teachers'] and (len(pack['teachers']),len(pack['evaluation']))==(68,32)
assert oldreport['status']=='COMPLETE_NOT_ADOPTED_PENDING_RAW_READ' and oldreport['updates_completed']==68 and oldreport['new_calls']==28
assert (prior/'run.exit').read_text()=='0'
manifest=json.loads((prior/'api_source_manifest.json').read_text());assert len(manifest)==2134
assert all(sha(api/n)==h for n,h in manifest.items())
for n,key in [('adapter_model.safetensors','initial_weights_sha256'),('adapter_config.json','initial_config_sha256')]:assert sha(prior/'result/adapter'/n)==pack['plan'][key]
assert oldreport['adapter_sha256']==pack['plan']['initial_weights_sha256'] and oldreport['adapter_config_sha256']==pack['plan']['initial_config_sha256']
assert sha(prior/'adaptive_loss.py')==pack['plan']['adaptive_loss_sha256']
apps=subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True);assert not apps.strip()
root.mkdir()
for name in ('semantic_units_scope68_plan.json','semantic_units_scope68_cpu.json'):shutil.copyfile(prepared/name,root/name)
for name in ('semantic_units_scope68_prepare.py','semantic_units_scope68_run.py','semantic_units_scope68_supervisor.py'):shutil.copyfile(w/name,root/name)
shutil.copyfile(prior/'adaptive_loss.py',root/'adaptive_loss.py')
shutil.copyfile(prior/'api_source_manifest.json',root/'api_source_manifest.json')
reused=[]
for row in pack['evaluation'][:24]:
 assert not row['pre_generation_required']
 base=prior/'result'/('after_'+row['probe_id']);req=json.loads(Path(str(base)+'.request.json').read_text());resp=json.loads(Path(str(base)+'.response.json').read_text());raw=Path(str(base)+'.raw.txt').read_bytes()
 assert req['messages']==row['messages'] and req['request_ref']==row['request_ref']
 assert req['messages_sha256']==resp['messages_sha256']==hashlib.sha256(json.dumps(req['messages'],ensure_ascii=False,separators=(',',':'),sort_keys=True).encode()).hexdigest()
 assert resp['raw'].encode()==raw and resp['raw_sha256']==hashlib.sha256(raw).hexdigest()
 calls=[x for x in oldreport['calls'] if x['phase']=='after' and x['probe_id']==row['probe_id']];assert len(calls)==1 and calls[0]['raw_sha256']==resp['raw_sha256']
 assert Path(str(base)+'.candidate.json').exists()==(calls[0]['admission']=='RETURNED')
 for suffix in ('.request.json','.response.json','.raw.txt','.candidate.json'):
  p=Path(str(base)+suffix)
  if p.exists():shutil.copyfile(p,root/('before_'+row['probe_id']+suffix))
 reused.append(dict(probe_id=row['probe_id'],raw_sha256=resp['raw_sha256'],messages_sha256=req['messages_sha256'],adapter_sha256=oldreport['adapter_sha256']))
assert len(reused)==24 and all(r['pre_generation_required'] for r in pack['evaluation'][24:])
(root/'reused_before.json').write_text(json.dumps(reused,indent=2)+'\n')
priorhash={n:sha(prior/'result/adapter'/n) for n in ('adapter_model.safetensors','adapter_config.json')}
cmd=['timeout','--signal=TERM','--kill-after=10s','890s',str(w/'analysis-runtime-20261103/bin/python'),str(root/'semantic_units_scope68_run.py'),'--api-root',str(api),'--plan',str(root/'semantic_units_scope68_plan.json'),'--plan-sha256',sha(root/'semantic_units_scope68_plan.json'),'--initial-dir',str(prior/'result/adapter'),'--adaptive-loss',str(root/'adaptive_loss.py'),'--out',str(root/'result')]
start=time.monotonic()
with (root/'run.log').open('w') as log:code=subprocess.run(cmd,stdout=log,stderr=subprocess.STDOUT).returncode
(root/'run.exit').write_text(str(code))
(root/'gpu-after.json').write_text(json.dumps(dict(exit=code,process_seconds=time.monotonic()-start,prior_unchanged=priorhash=={n:sha(prior/'result/adapter'/n) for n in priorhash},compute_apps=subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True)),indent=2))
files=[p for p in root.rglob('*') if p.is_file()]
(root/'manifest.json').write_text(json.dumps({str(p.relative_to(root)):sha(p) for p in files},indent=2)+'\n');files.append(root/'manifest.json')
archive=w/'cocolon-analysis-scope68-result-20261103.zip'
with zipfile.ZipFile(archive,'x',zipfile.ZIP_DEFLATED) as z:
 for p in files:z.write(p,str(p.relative_to(root)))
(w/'scope68-download.html').write_text('<meta charset=utf-8><h1>Scope68 result</h1><a href="cocolon-analysis-scope68-result-20261103.zip">Result archive</a>')
print(json.dumps(dict(exit=code,archive=archive.name,bytes=archive.stat().st_size,sha256=sha(archive))))
