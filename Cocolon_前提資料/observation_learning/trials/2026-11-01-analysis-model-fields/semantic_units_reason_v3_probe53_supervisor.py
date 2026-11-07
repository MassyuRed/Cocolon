"""CPU first, one bounded v3 prompt probe, then separate CPU replay/archive."""
import argparse
from pathlib import Path
import json
import shutil
import subprocess
import time
import traceback

import semantic_units_reason_v3_probe53 as task

w=Path('/workspace')
root=task.root
sha=task.sha


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--api-commit',required=True)
    args=parser.parse_args()
    assert args.api_commit==task.COMMIT and not root.exists()
    _,_,prior,blobs=task.validate(args)
    assert not task.compute_apps().strip()
    root.mkdir()
    stage='CPU_PREPARE_STARTED'
    code=None
    run_start=None
    total_start=time.monotonic()
    try:
        for name in task.NAMES:shutil.copyfile(w/name,root/name)
        task.write(root/'code_hashes.json',{name:sha(root/name) for name in task.NAMES})
        task.write(root/'adapter_hashes_before.json',prior)
        for path in blobs:
            dst=root/'api-source'/path
            dst.parent.mkdir(parents=True,exist_ok=True)
            dst.write_bytes((task.api/path).read_bytes())
        with (root/'prepare.log').open('x') as f:
            prepared=subprocess.run(['timeout','180s',str(w/'analysis-runtime-20261103/bin/python'),
                str(root/task.NAMES[0]),'--phase','prepare','--api-commit',task.COMMIT],
                stdout=f,stderr=subprocess.STDOUT).returncode
        (root/'prepare.exit').write_text(str(prepared))
        if prepared:
            stage='CPU_PREPARE_FAILED'
            return
        cpu_manifest=json.loads((root/'cpu/manifest.json').read_text())
        assert all(sha(root/'cpu'/path)==expected for path,expected in cpu_manifest.items())
        cpu=json.loads((root/'cpu/result.json').read_text())
        assert cpu['status']=='REASON_V3_PROBE53_CPU_PREPARED_NO_MODEL_NO_GPU_PLAN'
        assert cpu['api_commit']==task.COMMIT and len(cpu['rows'])==53
        assert all(sha(path)==expected for path,expected in prior.items())
        assert not task.compute_apps().strip()
        stage='GPU_STARTED'
        run_start=time.monotonic()
        with (root/'run.log').open('x') as f:
            code=subprocess.run(['timeout','--signal=TERM','--kill-after=10s','890s',
                str(w/'analysis-runtime-20261103/bin/python'),str(root/task.NAMES[0]),
                '--phase','run','--api-commit',task.COMMIT],stdout=f,stderr=subprocess.STDOUT).returncode
        (root/'run.exit').write_text(str(code))
        stage='GPU_TERMINAL'
    except BaseException as exc:
        stage='SUPERVISOR_FAILED'
        task.write(root/'supervisor_error.json',dict(error_type=type(exc).__name__,error=str(exc),traceback=traceback.format_exc()))
        raise
    finally:
        after=dict(stage=stage,exit=code,total_parent_seconds=time.monotonic()-total_start,
            gpu_parent_seconds=None if run_start is None else time.monotonic()-run_start,
            all_prior_nine_adapter_pairs_unchanged=all(Path(path).is_file() and sha(path)==expected
                for path,expected in prior.items()),adapter_hashes=prior)
        try:
            after['compute_apps']=task.compute_apps()
            after['compute_empty']=not after['compute_apps'].strip()
        except BaseException as exc:
            after['compute_observation_error']=type(exc).__name__+': '+str(exc)
        task.write(root/'gpu-after.json',after)
        # This separate process replays actual before-v2/after-v3 saved responses;
        # CPU rebound shadows are never counted as before generations or teachers.
        archive_log=w/'reason-v3-probe53-archive.log'
        with archive_log.open('x') as f:
            archived=subprocess.run(['timeout','240s',str(w/'analysis-runtime-20261103/bin/python'),
                str(root/task.NAMES[0]),'--phase','archive','--api-commit',task.COMMIT],
                stdout=f,stderr=subprocess.STDOUT).returncode
        (w/'reason-v3-probe53-archive.exit').write_text(str(archived))
        print(json.dumps(dict(stage=stage,exit=code,archive_exit=archived,
            total_parent_seconds=time.monotonic()-total_start)))


if __name__=='__main__':main()
