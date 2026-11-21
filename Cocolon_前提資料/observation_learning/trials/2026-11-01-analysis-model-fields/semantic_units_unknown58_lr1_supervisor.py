from pathlib import Path
import hashlib,json,shutil,subprocess,time,zipfile
w=Path('/workspace');r=w/'analysis-unknown58-lr1-20261102';r.mkdir(exist_ok=False)
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
for n in ['semantic_units_unknown58_lr1_plan.json','semantic_units_unknown58_lr1_run.py','supervise_unknown58_lr1.py']:
    shutil.copyfile(w/n,r/n)
assert sha(r/'semantic_units_unknown58_lr1_plan.json')=='0efb760b45e1d0a8eda323bd91cb793d4a4b52fd97584fd6bd5528e710a6900a'
assert sha(r/'semantic_units_unknown58_lr1_run.py')=='a19db45ffe02cc4fde4a29c708a5b2d531999445f4df27bb5f2ced567244a6c3'
p=json.loads((r/'semantic_units_unknown58_lr1_plan.json').read_text())
prior=w/'analysis-parent56-20261102';api=w/'analysis-parent56-api-20261102'
oldreport=json.loads((prior/'result/report.json').read_text())
assert oldreport['status']=='COMPLETE_NOT_ADOPTED_PENDING_RAW_READ' and oldreport['updates_completed']==56 and oldreport['new_calls']==56
assert (prior/'run.exit').read_text()=='0'
manifest=json.loads((prior/'api_source_manifest.json').read_text());assert len(manifest)==2134
assert all(sha(api/n)==v for n,v in manifest.items())
(r/'api_source_manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
loader=api/'ai/tools/serve_emlis_natural_reply.py';b=loader.read_bytes()
assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()=='722525c2a1f1afe0a5f0902e0bddf5b602db8a1a'
assert p['source_parent_plan_sha256']==sha(prior/'semantic_units_parent56_plan.json')
oldplan=json.loads((prior/'semantic_units_parent56_plan.json').read_text())
assert p['teachers'][:56]==oldplan['teachers']
known=w/'analysis-unknown58-20261102'
knownplan=json.loads((known/'semantic_units_unknown58_plan.json').read_text())
assert p['teachers']==knownplan['teachers'] and p['plan']['update_order']==knownplan['plan']['update_order']
assert p['plan']['seed']==knownplan['plan']['seed'] and p['plan']['learning_rate']==1e-5
assert (known/'run.exit').read_text()=='0'
reused=[]
for row in p['evaluation']:
    phase='before' if row['probe_id'].startswith(('UQ','HQ')) else 'after'
    origin=known if phase=='before' else prior
    base=origin/'result'/(phase+'_'+row['probe_id'])
    originreport=json.loads((origin/'result/report.json').read_text())
    request=json.loads(Path(str(base)+'.request.json').read_text());response=json.loads(Path(str(base)+'.response.json').read_text());raw=Path(str(base)+'.raw.txt').read_bytes()
    assert request['messages']==row['messages'] and request['request_ref']==row['request_ref'] and response['raw'].encode()==raw
    assert response['raw_sha256']==hashlib.sha256(raw).hexdigest()
    matching=[x for x in originreport['calls'] if x['phase']==phase and x['probe_id']==row['probe_id']]
    assert len(matching)==1 and matching[0]['raw_sha256']==hashlib.sha256(raw).hexdigest()
    for suffix in ['.request.json','.response.json','.raw.txt','.candidate.json']:
        src=Path(str(base)+suffix)
        if src.exists():shutil.copyfile(src,r/('before_'+row['probe_id']+suffix))
    for suffix in ['.request.json','.response.json','.raw.txt','.candidate.json']:
        src=known/'result'/('after_'+row['probe_id']+suffix)
        if src.exists():shutil.copyfile(src,r/('comparison_'+row['probe_id']+suffix))
    reused.append(dict(probe_id=row['probe_id'],source=str(base),raw_sha256=hashlib.sha256(raw).hexdigest(),adapter_sha256=oldreport['adapter_sha256'],messages_sha256=request['messages_sha256']))
(r/'reused_before.json').write_text(json.dumps(reused,indent=2)+'\n')
shutil.copyfile(prior/'adaptive_loss.py',r/'adaptive_loss.py')
for n in ['adapter_model.safetensors','adapter_config.json']:
    assert sha(prior/'result/adapter'/n)==p['plan']['initial_weights_sha256' if n.endswith('safetensors') else 'initial_config_sha256']
prior_hashes={str(x):sha(x) for x in [prior/'result/adapter/adapter_model.safetensors',prior/'result/adapter/adapter_config.json',w/'analysis-canonical40-20261102/result/adapter/adapter_model.safetensors']}
(r/'source_identity.json').write_text(json.dumps(dict(api_commit=p['api_commit'],cocolon_source_commit=p['cocolon_source_commit'],runtime_scope='Same verified filtered2134 source files, not a full checkout.',loader_blob='722525c2a1f1afe0a5f0902e0bddf5b602db8a1a',reused_before=16,prior_hashes=prior_hashes),indent=2))
apps=subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True);assert not apps.strip()
(r/'gpu-before.json').write_text(json.dumps(dict(compute_apps=apps)))
cmd=['timeout','--signal=TERM','--kill-after=10s','590s','/workspace/analysis-probe-20261102/venv/bin/python',str(r/'semantic_units_unknown58_lr1_run.py'),'--api-root',str(api),'--plan',str(r/'semantic_units_unknown58_lr1_plan.json'),'--plan-sha256',sha(r/'semantic_units_unknown58_lr1_plan.json'),'--initial-dir',str(prior/'result/adapter'),'--adaptive-loss',str(r/'adaptive_loss.py'),'--out',str(r/'result')]
start=time.monotonic()
with (r/'run.log').open('w') as f:ret=subprocess.run(cmd,stdout=f,stderr=subprocess.STDOUT).returncode
(r/'run.exit').write_text(str(ret))
(r/'gpu-after.json').write_text(json.dumps(dict(process_seconds=time.monotonic()-start,exit=ret,prior_unchanged=prior_hashes=={n:sha(n) for n in prior_hashes},compute_apps=subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True))))
files=[x for x in r.rglob('*') if x.is_file()];m={str(x.relative_to(r)):sha(x) for x in files}
(r/'manifest.json').write_text(json.dumps(m,indent=2));files.append(r/'manifest.json')
z=w/'cocolon-analysis-unknown58-lr1-result-20261102.zip'
with zipfile.ZipFile(z,'x',zipfile.ZIP_DEFLATED) as f:
    for x in files:f.write(x,str(x.relative_to(r)))
export={}
for x in files:
    value=dict(bytes=x.stat().st_size,sha256=sha(x))
    if x.suffix=='.safetensors':value['binary']=True
    else:value['text']=x.read_bytes().decode('utf-8')
    export[str(x.relative_to(r))]=value
(w/'unknown58-lr1-export.json').write_text(json.dumps(dict(original_zip_sha256=sha(z),files=export),ensure_ascii=False))
if ret==0:subprocess.run(['python',str(w/'export_numeric_weights.py'),str(r/'result/adapter/adapter_model.safetensors'),str(w/'unknown58-lr1-numeric')],check=True)
print(json.dumps(dict(exit=ret,members=len(files),archive=z.name,bytes=z.stat().st_size)))
