python3.12 - <<'PY'
from pathlib import Path
import gzip,json,hashlib,zipfile,subprocess
w=Path('/workspace');cpu=w/'cocolon_fit38_cpu_20261030';pack=w/'cocolon_fit38_pack_20261030'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
x=json.loads(gzip.decompress((cpu/'prepared_cpu.json.gz').read_bytes()))
assert all(sha(p)==h for p,h in x['frozen'].items())
try:gpu={'gpu_read_only':subprocess.check_output(['nvidia-smi','--query-gpu=name,memory.used,utilization.gpu','--format=csv,noheader'],text=True,timeout=10).strip()}
except (OSError,subprocess.SubprocessError) as exc:gpu={'gpu_read_only':None,'gpu_read_error':type(exc).__name__+': '+str(exc)}
post={'frozen_files':len(x['frozen']),'all_frozen_bytes_unchanged':True,'initial_adapter_sha256':sha(w/'cocolon_aligned19_run_20261030/adapter/adapter_model.safetensors'),'approval_present':(pack/'approved_plan.json').exists(),'model_rerun':False,**gpu}
(cpu/'post_identity.json').write_text(json.dumps(post,indent=2)+chr(10))
payload={**{'cpu/'+p.name:p.read_bytes() for p in sorted(cpu.iterdir()) if p.is_file()},**{'runtime/'+p.name:p.read_bytes() for p in sorted(pack.iterdir()) if p.is_file()}}
m={'files':[{'path':n,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()} for n,b in payload.items()]}
payload['archive_manifest.json']=(json.dumps(m,indent=2)+chr(10)).encode()
archive=w/'cocolon-fit38-cpu-originals-20261030.zip';assert not archive.exists()
with zipfile.ZipFile(archive.with_suffix('.zip.partial'),'x',zipfile.ZIP_DEFLATED) as z:
 for n,b in payload.items():z.writestr(n,b)
archive.with_suffix('.zip.partial').rename(archive)
r={'archive':archive.name,'bytes':archive.stat().st_size,'sha256':sha(archive),'members':len(payload),'post_identity':post}
(w/'cocolon-fit38-cpu-recovery.json').write_text(json.dumps(r,indent=2)+chr(10));print(json.dumps(r,indent=2))
PY
