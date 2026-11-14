"""One bounded, no-training material input comparison; single execution owner."""
from pathlib import Path
import hashlib,subprocess,json,time
w=Path('/workspace');root=w/'analysis-material-context8-20261103';exitfile=w/'material-context8.run.exit'
assert not root.exists() and not exitfile.exists()
assert hashlib.sha256((w/'material_context8_run.py').read_bytes()).hexdigest()=='fe8789d73b4559e7730286be3b6334becc012d7d0cb6d37ebf5bd944b9b1ec84'
start=time.monotonic()
with (w/'material-context8.run.log').open('x') as f:
 r=subprocess.run(['timeout','--signal=TERM','--kill-after=10s','470s',str(w/'analysis-runtime-20261103/bin/python'),str(w/'material_context8_run.py')],stdout=f,stderr=subprocess.STDOUT)
exitfile.write_text(str(r.returncode))
(w/'material-context8.finished.json').write_text(json.dumps(dict(exit=r.returncode,seconds=time.monotonic()-start,compute_apps=subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True)),indent=2)+'\n')
print(r.returncode)
