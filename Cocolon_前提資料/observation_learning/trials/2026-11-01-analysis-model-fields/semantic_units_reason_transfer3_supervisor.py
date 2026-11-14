"""CPU-first, one three-call reason diagnostic, then archive complete/partial evidence."""
import argparse
from pathlib import Path
import json
import shutil
import subprocess
import time
import traceback

import semantic_units_reason_transfer3 as task

w=Path('/workspace')
root=task.root
sha=task.sha


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source',required=True,type=Path)
    parser.add_argument('--source-sha256',required=True)
    args=parser.parse_args()
    assert not root.exists()
    assert args.source_sha256==task.SOURCE_SHA and sha(args.source)==task.SOURCE_SHA
    pack,_,hashes=task.validate_prior()
    assert not task.compute_apps().strip()
    root.mkdir()
    stage='CPU_PREPARE_STARTED'
    code=None
    run_start=None
    total_start=time.monotonic()
    try:
        for name in task.NAMES:shutil.copyfile(w/name,root/name)
        shutil.copyfile(args.source,root/'sources.json')
        task.write(root/'code_hashes.json',{name:sha(root/name) for name in task.NAMES})
        task.write(root/'adapter_hashes_before.json',hashes)
        # Preserve the six exact API source blobs even if CPU preparation fails
        # before it can create its own source evidence directory.
        for path in pack['api_source_blobs']:
            dst=root/'api-source'/path
            dst.parent.mkdir(parents=True,exist_ok=True)
            dst.write_bytes((task.api/path).read_bytes())
        with (root/'prepare.log').open('x') as f:
            prepared=subprocess.run(['timeout','180s',str(w/'analysis-runtime-20261103/bin/python'),
                str(root/task.NAMES[0]),'--phase','prepare','--source',str(root/'sources.json'),
                '--source-sha256',task.SOURCE_SHA],stdout=f,stderr=subprocess.STDOUT).returncode
        (root/'prepare.exit').write_text(str(prepared))
        if prepared:
            stage='CPU_PREPARE_FAILED'
            return
        cpu_manifest=json.loads((root/'cpu/manifest.json').read_text())
        assert all(sha(root/'cpu'/path)==expected for path,expected in cpu_manifest.items())
        cpu=json.loads((root/'cpu/result.json').read_text())
        assert cpu['status']=='REASON_TRANSFER3_CPU_PREPARED_NO_MODEL_NO_GPU_PLAN'
        assert (cpu['reference_count'],cpu['reused_count'],cpu['new_calls_cap'])==(4,1,3)
        assert all(sha(path)==expected for path,expected in hashes.items())
        assert not task.compute_apps().strip()
        stage='GPU_STARTED'
        run_start=time.monotonic()
        with (root/'run.log').open('x') as f:
            code=subprocess.run(['timeout','--signal=TERM','--kill-after=10s','170s',
                str(w/'analysis-runtime-20261103/bin/python'),str(root/task.NAMES[0]),
                '--phase','run'],stdout=f,stderr=subprocess.STDOUT).returncode
        (root/'run.exit').write_text(str(code))
        stage='GPU_TERMINAL'
    except BaseException as exc:
        stage='SUPERVISOR_FAILED'
        task.write(root/'supervisor_error.json',dict(error_type=type(exc).__name__,error=str(exc),traceback=traceback.format_exc()))
        raise
    finally:
        after=dict(stage=stage,exit=code,total_parent_seconds=time.monotonic()-total_start,
            gpu_parent_seconds=None if run_start is None else time.monotonic()-run_start,
            all_prior_eight_adapter_pairs_unchanged=all(Path(path).is_file() and sha(path)==expected
                for path,expected in hashes.items()),adapter_hashes=hashes)
        try:
            after['compute_apps']=task.compute_apps()
            after['compute_empty']=not after['compute_apps'].strip()
        except BaseException as exc:
            after['compute_observation_error']=type(exc).__name__+': '+str(exc)
        task.write(root/'gpu-after.json',after)
        # Archive output goes outside root: a log still being written must not
        # invalidate the frozen manifest or introduce a recursive ZIP hash.
        archive_log=w/'reason-transfer3-archive.log'
        with archive_log.open('x') as f:
            archived=subprocess.run(['timeout','180s',str(w/'analysis-runtime-20261103/bin/python'),
                str(root/task.NAMES[0]),'--phase','archive'],stdout=f,stderr=subprocess.STDOUT).returncode
        (w/'reason-transfer3-archive.exit').write_text(str(archived))
        print(json.dumps(dict(stage=stage,exit=code,archive_exit=archived,
            total_parent_seconds=time.monotonic()-total_start)))


if __name__=='__main__':main()
