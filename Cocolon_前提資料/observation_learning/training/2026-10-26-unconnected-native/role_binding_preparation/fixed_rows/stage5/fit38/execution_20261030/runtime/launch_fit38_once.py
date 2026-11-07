"""Single bounded launch; no retry. Keep timeout the model runner's direct parent."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import time

HERE = Path(__file__).resolve().parent
CPU = Path('/workspace/cocolon_fit38_cpu_20261030')
OUT = Path('/workspace/cocolon_fit38_run_20261030')

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')

def main(source_commit):
    assert len(source_commit) == 40 and all(c in '0123456789abcdef' for c in source_commit)
    approval = json.loads((HERE / 'approved_plan.json').read_text())
    plan = json.loads((HERE / 'proposal.json').read_text())
    assert approval['status'] == 'MASH_EXPLICITLY_APPROVED_ONCE'
    assert approval['proposal_sha256'] == sha(HERE / 'proposal.json') and approval['proposal'] == plan
    assert sha(Path(__file__)) == approval['launcher_sha256']
    assert (plan['max_gpu_process_seconds'], plan['max_updates'], plan['max_model_loads'], plan['max_generations']) == (2700, 38, 2, 19)
    assert plan['max_teacher_evaluation_forwards'] == 57 and plan['epochs'] == 2
    for name, digest in plan['source_sha256'].items():
        assert sha(HERE / name) == digest
    summary = json.loads((CPU / 'cpu_summary.json').read_text())
    assert summary['status'] == 'CPU_FIT38_READY_NO_MODEL'
    assert sha(CPU / 'prepared_cpu.json.gz') == summary['prepared_sha256']
    assert summary['proposal_sha256'] == approval['proposal_sha256']
    assert not OUT.exists() and not (HERE / 'gpu_launch.json').exists()
    with (HERE / 'execute_once.lock').open('x') as lock:
        lock.write(json.dumps(dict(source_commit=source_commit, approval_sha256=sha(HERE / 'approved_plan.json'),
                                   launcher_sha256=sha(Path(__file__)), started_unix=time.time(), retry=False)) + '\n')
    command = ['timeout', '--signal=TERM', '--kill-after=10s', '2690s', '/usr/bin/python3.12',
               str(HERE / 'run_fit38_once.py'), '--execute', '--source-commit', source_commit]
    started = time.monotonic()
    with (HERE / 'gpu.log').open('x') as log:
        child = subprocess.Popen(command, cwd=HERE, env={**os.environ, 'HF_HUB_OFFLINE': '1',
                                 'TRANSFORMERS_OFFLINE': '1'}, stdout=log, stderr=subprocess.STDOUT,
                                 stdin=subprocess.DEVNULL, start_new_session=True)
        write(HERE / 'gpu_launch.json', dict(source_commit=source_commit, timeout_pid=child.pid, command=command,
                                            approval_sha256=sha(HERE / 'approved_plan.json'), retry=False))
        code = child.wait()
    (HERE / 'gpu.exit').write_text(str(code) + '\n')
    write(HERE / 'gpu_elapsed.json', dict(exit_code=code, outer_seconds=time.monotonic() - started,
                                         hard_limit_seconds=2700, retry=False))

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source-commit', required=True)
    main(parser.parse_args().source_commit)
