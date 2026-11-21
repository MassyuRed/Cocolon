from pathlib import Path
import subprocess,json,zipfile,hashlib,os,time
w=Path('/workspace');r=w/'analysis-scope68-20261103';py=w/'analysis-runtime-20261103/bin/python';api=w/'analysis-api-20261103'
assert (r/'run.exit').exists()
env=dict(os.environ,PYTHONDONTWRITEBYTECODE='1',PYTHONPATH=str(api/'ai/services/ai_inference'),HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
replay=w/'scope68-saved-replay.json'
assert not replay.exists()
subprocess.run([str(py),str(w/'semantic_units_scope68_saved_replay.py'),'--run-dir',str(r),'--out',str(replay)],env=env,check=True,timeout=120)
original=w/'cocolon-analysis-scope68-result-20261103.zip';assert original.exists()
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
files=[(original,'original/'+original.name),(replay,'scope68-saved-replay.json')]
prepared=w/'analysis-scope68-prepared-20261103'
files += [(p,'cpu/'+str(p.relative_to(prepared))) for p in prepared.rglob('*') if p.is_file()]
for n in ['bootstrap_analysis.py','bootstrap_analysis.log','model-restore.log','api-restoration-correction.json','semantic_units_scope_contrast_cpu.json','semantic_units_scope68_saved_replay.py','collect_scope68.py']:
 files.append((w/n,'restoration/'+n))
files.append((w/'analysis-setup-20261103/status.json','restoration/initial-setup-failure.json'))
meta=w/'scope68-collection.json'
meta.write_text(json.dumps(dict(original_archive_sha256=sha(original),original_archive_bytes=original.stat().st_size,files={n:dict(bytes=p.stat().st_size,sha256=sha(p)) for p,n in files},runtime_model_loads_added=0,new_generations_added=0,training_updates_added=0),indent=2)+'\n');files.append((meta,'collection.json'))
out=w/'cocolon-analysis-scope68-evidence-20261103.zip'
with zipfile.ZipFile(out,'x',zipfile.ZIP_DEFLATED) as z:
 for p,n in files:z.write(p,n)
(w/'scope68-evidence-download.html').write_text('<meta charset=utf-8><h1>Scope68 evidence</h1><a href="cocolon-analysis-scope68-evidence-20261103.zip">Evidence archive</a>')
print(json.dumps(dict(evidence=out.name,bytes=out.stat().st_size,sha256=sha(out),original_sha256=sha(original))))
