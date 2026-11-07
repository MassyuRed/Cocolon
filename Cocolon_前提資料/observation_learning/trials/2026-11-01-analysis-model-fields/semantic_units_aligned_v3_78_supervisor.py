"""One opt-in v3 input-alignment comparison with a terminal CPU archive.

Old78 sources, targets and106 order remain unchanged. Research initialization is
explicit9dc, not latest9e. Failure preserves partial bytes without any GPU retry.
"""
import argparse
import json
import shutil
import subprocess
import sys
import time
import traceback
from pathlib import Path
from semantic_units_aligned_v3_78_prepare import (
    W, API, OLD, PROBE, AUDIT, ROOT, PREPARED, INITIAL, PLAN_NAME, COMMIT,
    OLD_PLAN_SHA, PROBE_REPORT_SHA, AUDIT_SHA, REVIEW_SHA, WEIGHTS, CONFIG,
    STATUS, NAMES, sha, write)


def compute_apps():
    return subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory',
        '--format=csv,noheader'],text=True)


def unchanged(values):
    return len(values) == 18 and all(Path(path).is_file() and sha(path) == expected for path,expected in values.items())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--api-commit',required=True)
    parser.add_argument('--source-plan',type=Path,default=OLD/'semantic_units_boundary78_plan.json')
    parser.add_argument('--source-plan-sha256',required=True)
    parser.add_argument('--teacher-audit',type=Path,default=AUDIT)
    parser.add_argument('--teacher-audit-sha256',required=True)
    parser.add_argument('--source-review',type=Path,default=W/'v3-teachers78-SOURCE_TARGET_REVIEW.md')
    parser.add_argument('--source-review-sha256',required=True)
    args = parser.parse_args()
    # Existing output is an explicit no-rerun boundary, including partial output.
    assert not ROOT.exists() and not PREPARED.exists()
    ROOT.mkdir()
    stage, code, started, cpu_copied = 'PRECONDITIONS_STARTED', None, None, False
    prior = {}
    parent_start = time.monotonic()
    try:
        for name in NAMES: shutil.copyfile(Path(__file__).with_name(name),ROOT/name)
        write(ROOT/'code_hashes.json',{name:sha(ROOT/name) for name in NAMES})
        write(ROOT/'supervisor_command.json',dict(argv=sys.argv,python=sys.executable,api_commit=args.api_commit,
            new_gpu_limit_seconds=1200,outer_term_seconds=1190,outer_kill_grace_seconds=10,
            cpu_prepare_limit_seconds=180,cpu_collect_limit_seconds=180,retries=0))
        assert args.api_commit == COMMIT and args.source_plan_sha256 == OLD_PLAN_SHA
        assert args.teacher_audit_sha256 == AUDIT_SHA and args.source_review_sha256 == REVIEW_SHA
        assert sha(args.source_plan) == OLD_PLAN_SHA and sha(args.source_review) == REVIEW_SHA
        assert sha(args.teacher_audit/'result.json') == AUDIT_SHA
        assert sha(PROBE/'result/report.json') == PROBE_REPORT_SHA
        assert (W/'reason-v3-tests.exit').read_text().strip() == '0'
        prior = json.loads((PROBE/'gpu-after.json').read_text())['adapter_hashes']
        assert unchanged(prior) and not compute_apps().strip()
        assert sha(INITIAL/'adapter_model.safetensors') == WEIGHTS and sha(INITIAL/'adapter_config.json') == CONFIG
        write(ROOT/'adapter_hashes_before.json',prior)
        stage = 'CPU_PREPARE_STARTED'
        prepare = [str(W/'analysis-runtime-20261103/bin/python'),str(ROOT/NAMES[0]),
            '--api-commit',COMMIT,'--source-plan',str(args.source_plan),'--source-plan-sha256',OLD_PLAN_SHA,
            '--teacher-audit',str(args.teacher_audit),'--teacher-audit-sha256',AUDIT_SHA,
            '--source-review',str(args.source_review),'--source-review-sha256',REVIEW_SHA]
        with (ROOT/'prepare.log').open('x') as log:
            prepared = subprocess.run(['timeout','--signal=TERM','--kill-after=10s','180s']+prepare,
                stdout=log,stderr=subprocess.STDOUT)
        write(ROOT/'prepare_command.json',prepare)
        (ROOT/'prepare.exit').write_text(str(prepared.returncode))
        if prepared.returncode:
            stage = 'CPU_PREPARE_FAILED'
            return prepared.returncode
        shutil.copytree(PREPARED,ROOT,dirs_exist_ok=True)
        shutil.copyfile(PREPARED/'manifest.json',ROOT/'cpu_manifest.json')
        (ROOT/'manifest.json').unlink()
        cpu_copied = True
        shutil.copyfile(W/'analysis-combination70-20261103/adaptive_loss.py',ROOT/'adaptive_loss.py')
        path = ROOT/PLAN_NAME
        pack = json.loads(path.read_text())
        assert pack['status'] == STATUS and pack['api_commit'] == COMMIT
        assert len(pack['teachers']) == 78 and len(pack['evaluation']) == len(pack['preexisting_evaluation']) == 53
        plan = pack['plan']
        assert (plan['max_updates'],plan['max_model_loads'],plan['max_new_generations'],
            plan['max_teacher_measurements'],plan['max_seconds']) == (106,2,53,156,1200)
        assert plan['prompt_version'] == 'semantic_boundaries.v3' and len(plan['update_order']) == 106
        assert plan['initial_weights_sha256'] == WEIGHTS and plan['initial_config_sha256'] == CONFIG
        assert unchanged(prior) and not compute_apps().strip()
        cmd = ['timeout','--signal=TERM','--kill-after=10s','1190s',
            str(W/'analysis-runtime-20261103/bin/python'),str(ROOT/NAMES[1]),
            '--api-root',str(API),'--api-commit',COMMIT,'--plan',str(path),'--plan-sha256',sha(path),
            '--initial-dir',str(INITIAL),'--adaptive-loss',str(ROOT/'adaptive_loss.py'),'--out',str(ROOT/'result')]
        write(ROOT/'run_command.json',cmd)
        stage, started = 'GPU_STARTED', time.monotonic()
        with (ROOT/'run.log').open('x') as log:
            code = subprocess.run(cmd,stdout=log,stderr=subprocess.STDOUT).returncode
        (ROOT/'run.exit').write_text(str(code))
        stage = 'GPU_TERMINAL'
        return code
    except BaseException as exc:
        stage = 'SUPERVISOR_FAILED'
        write(ROOT/'supervisor_error.json',dict(error_type=type(exc).__name__,error=str(exc),traceback=traceback.format_exc()))
        raise
    finally:
        if PREPARED.exists() and not cpu_copied:
            try: shutil.copytree(PREPARED,ROOT/'cpu_partial')
            except BaseException as exc:
                write(ROOT/'cpu_partial_collection_error.json',dict(error_type=type(exc).__name__,error=str(exc)))
        try:
            apps = compute_apps()
            after = dict(stage=stage,exit=code,parent_seconds=time.monotonic()-parent_start,
                gpu_parent_seconds=None if started is None else time.monotonic()-started,
                prior_nine_adapter_pairs_unchanged=unchanged(prior),prior_adapter_hashes=prior,
                compute_apps=apps,compute_empty=not apps.strip())
        except BaseException as exc:
            after = dict(stage=stage,exit=code,prior_adapter_hashes=prior,
                inspection_error_type=type(exc).__name__,inspection_error=str(exc))
        write(ROOT/'gpu-after.json',after)
        write(ROOT/'manifest.json',{str(path.relative_to(ROOT)):sha(path)
            for path in ROOT.rglob('*') if path.is_file() and path != ROOT/'manifest.json'})
        # Terminal CPU process: replay the106 real responses, or archive only.
        # Its log/exit are outside ROOT so the final run manifest stays frozen.
        collect = ['timeout','--signal=TERM','--kill-after=10s','180s',
            str(W/'analysis-runtime-20261103/bin/python'),str(ROOT/NAMES[3]),'--api-commit',COMMIT,
            '--supervisor-log',str(W/'aligned-v3-78-supervisor.log')]
        if code != 0: collect.append('--archive-only')
        try:
            with (W/'aligned-v3-78-collect.log').open('x') as log:
                collection = subprocess.run(collect,stdout=log,stderr=subprocess.STDOUT).returncode
            (W/'aligned-v3-78-collect.exit').write_text(str(collection))
        except BaseException as exc:
            collection = None
            write(W/'aligned-v3-78-collect-launch-error.json',dict(error_type=type(exc).__name__,error=str(exc)))
        print(json.dumps(dict(stage=stage,run_exit=code,collect_exit=collection,gpu_retry=False)))


if __name__ == '__main__': raise SystemExit(main())
