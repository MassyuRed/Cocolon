"""Proposed bounded launcher; no retry and no GPU lifecycle operations."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import time

HERE = Path(__file__).resolve().parent

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--approval', required=True)
    args = parser.parse_args()
    approval = json.loads(Path(args.approval).read_text())
    assert approval['status'] == 'MASH_EXPLICITLY_APPROVED_ONCE'
    with (HERE / 'launch_once.lock').open('x') as f:
        f.write('one-shot branch4; no retry\n')
    env = dict(os.environ, HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1', PYTHONDONTWRITEBYTECODE='1')
    command = ['timeout','--signal=TERM','--kill-after=10s','590s',sys.executable,'-B',
               str(HERE / 'run_branch4_once.py'),'--approval',args.approval]
    started = time.monotonic()
    with (HERE / 'process.log').open('x') as stream:
        result = subprocess.run(command, env=env, stdout=stream, stderr=subprocess.STDOUT)
    (HERE / 'process_exit.json').write_text(json.dumps(dict(exit_code=result.returncode,
        seconds=time.monotonic()-started, retry=False, automatic_progression=False),indent=2)+'\n')
    return result.returncode

if __name__ == '__main__':
    sys.exit(main())
