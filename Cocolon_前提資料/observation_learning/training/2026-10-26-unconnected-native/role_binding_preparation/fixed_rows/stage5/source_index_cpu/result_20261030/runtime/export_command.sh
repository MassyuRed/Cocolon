python3.12 - <<'PY'
from pathlib import Path
import hashlib,json,zipfile,subprocess
p=Path('/workspace/cocolon_source_index_probe_pack_20261030');r=Path('/workspace/cocolon_source_index_probe_run_20261030')
report=json.loads((r/'run.json').read_text());assert report['status']=='STOPPED_NOT_ADOPTED_NO_RETRY' and report['model_calls_completed']==2
assert (p/'gpu.exit').read_text().strip()=='1'
frozen=json.loads((r/'extra_frozen.json').read_text());assert all(hashlib.sha256(Path(k).read_bytes()).hexdigest()==v for k,v in frozen.items())
post={'frozen_files':len(frozen),'all_frozen_bytes_unchanged':True,'adapter_sha256':hashlib.sha256(Path('/workspace/cocolon_stage5_run_20261030/adapter/adapter_model.safetensors').read_bytes()).hexdigest(),'gpu_read_only':subprocess.check_output(['nvidia-smi','--query-gpu=name,memory.used,utilization.gpu','--format=csv,noheader'],text=True).strip(),'model_rerun':False}
(p/'post_identity.json').write_text(json.dumps(post,indent=2)+'\n')
archive=Path('/workspace/cocolon-source-index-probe-originals-20261030.zip');assert not archive.exists()
files={**{'run/'+str(x.relative_to(r)):x for x in r.rglob('*') if x.is_file()},**{'runtime/'+str(x.relative_to(p)):x for x in p.rglob('*') if x.is_file()}}
manifest={'source_commit':report['source_commit'],'files':{k:{'original_path':str(v),'bytes':v.stat().st_size,'sha256':hashlib.sha256(v.read_bytes()).hexdigest()} for k,v in files.items()}}
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED) as z:
 for name,path in files.items():z.write(path,name)
 z.writestr('archive_manifest.json',json.dumps(manifest,indent=2)+'\n')
receipt={'archive':archive.name,'bytes':archive.stat().st_size,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'payload_files':len(files),'status':report['status'],'processing_seconds':report['processing_seconds'],'process_cost_usd':report['process_cost_usd'],'post_identity':post}
Path('/workspace/cocolon-source-index-probe-recovery.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps(receipt,indent=2))
PY