"""Post-execution only: preserve exact sources, inputs, run and saved weights."""
from pathlib import Path
import hashlib
import json
import subprocess
import zipfile

W = Path('/workspace')
PACK = W / 'cocolon_stage5_pack_20261030'
CPU = W / 'cocolon_stage5_prepared_20261030'
RUN = W / 'cocolon_stage5_run_20261030'
assert (PACK / 'gpu.exit').exists(), 'run_still_active'
r = json.loads((RUN / 'run.json').read_text())
assert r['status'] != 'STARTED_ONCE', 'run_not_closed'
cpu = json.loads(__import__('gzip').decompress((CPU / 'prepared_cpu.json.gz').read_bytes()))
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
identities = {p: sha(p) == h for p, h in cpu['frozen'].items()}
assert all(identities.values()), 'frozen_identity_changed'
gpu = subprocess.check_output(['nvidia-smi', '--query-gpu=name,memory.used,utilization.gpu', '--format=csv,noheader'], text=True).strip()
post = dict(frozen_inputs_and_initial_weights_unchanged=True, checked_files=len(identities),
            new_weight_sha256=sha(RUN / 'adapter/adapter_model.safetensors') if (RUN / 'adapter/adapter_model.safetensors').exists() else None,
            gpu_after_process=gpu, gpu_stop_restart_delete=False, retry=False)
(PACK / 'post_identity.json').write_text(json.dumps(post, indent=2) + '\n')
z = W / 'cocolon-stage5-complete-20261030.zip'
members = []
with zipfile.ZipFile(z, 'x', zipfile.ZIP_DEFLATED) as out:
    paths = []
    for folder in [PACK, CPU, RUN]:
        paths.extend(p for p in folder.rglob('*') if p.is_file() and '__pycache__' not in str(p))
    # Preserve all frozen sources/material and this run's initial adapter.
    # Three historical adapters already have separate complete archives; their
    # digests remain in prepared_cpu.frozen without duplicating their bytes here.
    paths.extend(Path(p) for p in cpu['frozen']
                 if not p.endswith('.safetensors') or '/cocolon_rehearsal13_run_20261029/adapter/' in p)
    paths.extend([W / 'cocolon_rehearsal13_cpu_20261029/prepared_cpu.json.gz',
                  W / 'cocolon_rehearsal13_run_20261029/cmee/diagnosis.json'])
    plan = json.loads((PACK / 'plan.json').read_text())
    paths.extend(W / 'cocolon_rehearsal13_run_20261029' / ('after_' + cid + '.jsonl')
                 for cid in plan['evaluation_order'][2:])
    for p in sorted(set(paths)):
        assert p.is_relative_to(W) and p.is_file()
        b = p.read_bytes()
        name = str(p.relative_to(W))
        out.writestr(name, b)
        members.append(dict(path=name, bytes=len(b), sha256=hashlib.sha256(b).hexdigest()))
    out.writestr('archive_manifest.json', json.dumps(members, indent=2) + '\n')
print(json.dumps(dict(status=r['status'], archive_bytes=z.stat().st_size, archive_sha256=sha(z),
                      members=len(members) + 1, post_identity=post), indent=2))
