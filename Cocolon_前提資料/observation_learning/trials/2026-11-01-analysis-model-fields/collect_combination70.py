"""Collect unchanged private run bytes and non-generating replay; no model calls."""
from pathlib import Path
from hashlib import sha256
import json,zipfile,html,subprocess,os
w=Path('/workspace');root=w/'analysis-combination70-20261103'
h=lambda p:sha256(Path(p).read_bytes()).hexdigest()
r=json.loads((root/'result/report.json').read_text());assert (root/'run.exit').read_text()=='0'
assert r['updates_completed']==78 and r['new_calls']==36 and r['model_loads']==3 and r['measurement_forwards']==140
assert r['status']=='COMPLETE_NOT_ADOPTED_PENDING_RAW_READ'
manifest=json.loads((root/'manifest.json').read_text());assert all(h(root/n)==s for n,s in manifest.items())
assert json.loads((root/'gpu-after.json').read_text())['prior_unchanged']
replay=w/'combination70-saved-replay.json';assert not replay.exists()
cmd=[str(w/'analysis-runtime-20261103/bin/python'),str(w/'semantic_units_combination70_saved_replay.py'),'--run-dir',str(root),'--out',str(replay)]
env=dict(os.environ,CUDA_VISIBLE_DEVICES='');subprocess.run(cmd,env=env,check=True)
extras=[replay,w/'semantic_units_combination70_saved_replay.py',w/'collect_combination70.py',w/'combination70-supervisor.log']
files={('run/'+str(p.relative_to(root))):p for p in root.rglob('*') if p.is_file()}
files.update({('extra/'+p.name):p for p in extras})
collection={n:dict(bytes=p.stat().st_size,sha256=h(p)) for n,p in files.items()}
out=w/'cocolon-analysis-combination70-result-20261103.zip';assert not out.exists()
with zipfile.ZipFile(out,'x',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for n,p in files.items():z.write(p,n)
 z.writestr('collection_manifest.json',json.dumps(collection,ensure_ascii=False,indent=2)+'\n')
with zipfile.ZipFile(out) as z:
 assert z.testzip() is None
 for n,c in collection.items():assert len(z.read(n))==c['bytes'] and sha256(z.read(n)).hexdigest()==c['sha256']
summary=dict(status=r['status'],updates=r['updates_completed'],new_calls=r['new_calls'],measurements=r['measurement_forwards'],loads=r['model_loads'],process_seconds=r['process_seconds'],adapter_sha256=r['adapter_sha256'],config_sha256=r['adapter_config_sha256'],archive_bytes=out.stat().st_size,archive_sha256=h(out),members=len(files)+1,replay=json.loads(replay.read_text())['status'],quality_adoption=False)
(w/'combination70-collection.json').write_text(json.dumps(summary,indent=2)+'\n')
(w/'combination70-evidence.html').write_text('<meta charset=utf-8><h1>Analysis combination70 complete</h1><pre>'+html.escape(json.dumps(summary,indent=2))+'</pre><a href="/files/workspace/'+out.name+'?download=1">Download complete evidence</a>')
print(json.dumps(summary))
