"""Single bounded launch after the fixed API tests; preserve exit and compute."""
from pathlib import Path
import hashlib,subprocess,json,time
w=Path('/workspace');out=w/'analysis-written-role8-20261103';exitfile=w/'written-role8.exit'
assert not out.exists() and not exitfile.exists()
assert hashlib.sha256((w/'written_role8_run.py').read_bytes()).hexdigest()=='f4e4b947512e28bf37c2b006ac2a8140fc3902e18c3559b05d7ec889aef0bd67'
assert (w/'written-role-tests-v2.exit').read_text()=='0'
start=time.monotonic()
with (w/'written-role8.log').open('x') as f:
    r=subprocess.run(['timeout','--signal=TERM','--kill-after=10s','470s',
        str(w/'analysis-runtime-20261103/bin/python'),str(w/'written_role8_run.py')],
        stdout=f,stderr=subprocess.STDOUT)
exitfile.write_text(str(r.returncode))
(w/'written-role8.finished.json').write_text(json.dumps(dict(exit=r.returncode,
    seconds=time.monotonic()-start,compute_apps=subprocess.check_output([
        'nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True)),indent=2)+'\n')
print(r.returncode)
