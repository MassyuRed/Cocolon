"""After terminal completion only: preserve actual run and read-only identities."""
from pathlib import Path
import gzip
import hashlib
import json
import subprocess
import zipfile

W=Path('/workspace')
PACK=W/'cocolon_instruction_probe_pack_20261030'
RUN=W/'cocolon_instruction_probe_run_20261030'
CPU=W/'cocolon_stage5_prepared_20261030'
assert (PACK/'gpu.exit').exists(), 'run_still_active'
r=json.loads((RUN/'run.json').read_text())
assert r['status']!='STARTED_ONCE', 'run_not_closed'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
cpu=json.loads(gzip.decompress((CPU/'prepared_cpu.json.gz').read_bytes()))
extra=json.loads((RUN/'extra_frozen.json').read_text())
frozen={**cpu['frozen'],**extra}
assert all(sha(p)==h for p,h in frozen.items()), 'input_source_weight_changed'
gpu=subprocess.check_output(['nvidia-smi','--query-gpu=name,memory.used,utilization.gpu','--format=csv,noheader'],text=True).strip()
post=dict(all_frozen_and_saved_weights_unchanged=True,checked_files=len(frozen),
          saved_weight_sha256=sha(W/'cocolon_stage5_run_20261030/adapter/adapter_model.safetensors'),
          gpu_after_process=gpu,gpu_stop_restart_delete=False,training_updates=0,
          saved_weight_full_archive='libfile_cc6b41f4f62c81919cbaec65e51ef379',
          weights_not_duplicated=[dict(path=p,sha256=h) for p,h in frozen.items() if p.endswith('.safetensors')])
(PACK/'post_identity.json').write_text(json.dumps(post,indent=2)+'\n')
paths=[]
for folder in [PACK,RUN]: paths.extend(p for p in folder.rglob('*') if p.is_file() and '__pycache__' not in str(p))
paths.extend(Path(p) for p in frozen if not p.endswith('.safetensors'))
paths.append(CPU/'prepared_cpu.json.gz')
z=W/'cocolon-instruction-probe-originals-20261030.zip'
members=[]
with zipfile.ZipFile(z,'x',zipfile.ZIP_DEFLATED) as out:
    for p in sorted(set(paths)):
        assert p.is_relative_to(W) and p.is_file()
        b=p.read_bytes();name=str(p.relative_to(W));out.writestr(name,b)
        members.append(dict(path=name,bytes=len(b),sha256=hashlib.sha256(b).hexdigest()))
    out.writestr('archive_manifest.json',json.dumps(members,indent=2)+'\n')
print(json.dumps(dict(status=r['status'],members=len(members)+1,archive_bytes=z.stat().st_size,
                     archive_sha256=sha(z),post_identity=post),indent=2))
