"""CPU-first then one bounded eight-call transfer comparison; preserve partial files."""
from pathlib import Path
from hashlib import sha256
import json, shutil, subprocess, time, traceback

w = Path('/workspace')
root = w/'analysis-role-transfer4-20261103'
prepared = w/'analysis-role-transfer4-prepared-20261103'
api = w/'analysis-semantic-boundaries-api-20261103'
aligned = w/'analysis-aligned74-20261103'
COMMIT = 'dc05dc358d1c44ce47fd844f6041d74f1f74fe6a'
sha = lambda p: sha256(Path(p).read_bytes()).hexdigest()


def main():
    assert not root.exists()
    assert (aligned/'run.exit').read_text() == '0'
    assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip() == COMMIT
    assert not subprocess.check_output(['git','-C',str(api),'status','--porcelain','--untracked-files=no'],text=True).strip()
    assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True).strip()
    prior = json.loads((aligned/'gpu-after.json').read_text())['prior_adapter_hashes']
    assert len(prior) == 12 and all(sha(path) == expected for path,expected in prior.items())
    aligned_report = json.loads((aligned/'result/report.json').read_text())
    assert aligned_report['status'] == 'COMPLETE_NOT_ADOPTED_PENDING_RAW_READ'
    candidate = aligned/'result/adapter'
    new_hashes = {str(candidate/'adapter_model.safetensors'):aligned_report['adapter_sha256'],
        str(candidate/'adapter_config.json'):aligned_report['adapter_config_sha256']}
    assert all(sha(path) == expected for path,expected in new_hashes.items())
    all_hashes = dict(prior,**new_hashes)
    assert len(all_hashes) == 14
    names = ['semantic_units_role_transfer4_prepare.py','semantic_units_role_transfer4_run.py',
        'semantic_units_role_transfer4_supervisor.py']
    root.mkdir()
    for name in names: shutil.copyfile(w/name,root/name)
    (root/'code_hashes.json').write_text(json.dumps({name:sha(root/name) for name in names},indent=2)+'\n')
    (root/'adapter_hashes_before.json').write_text(json.dumps(all_hashes,indent=2)+'\n')
    start = time.monotonic()
    stage = 'CPU_PREPARE'
    code = None
    try:
        if prepared.exists():
            cpu_manifest = json.loads((prepared/'manifest.json').read_text())
            assert all(sha(prepared/path) == expected for path,expected in cpu_manifest.items())
            cpu = json.loads((prepared/'result.json').read_text())
            assert cpu['status'] == 'ROLE_TRANSFER4_CPU_PREPARED_NO_MODEL_NO_GPU_PLAN' and cpu['api_commit'] == COMMIT
            (root/'prepare.log').write_text('EXACT_EXISTING_CPU_PREPARATION_REUSED_NO_REEXECUTION\n')
            prepare_code = 0
        else:
            with (root/'prepare.log').open('x') as f:
                prepare_code = subprocess.run(['timeout','180s',str(w/'analysis-runtime-20261103/bin/python'),
                    str(root/names[0])],stdout=f,stderr=subprocess.STDOUT).returncode
        (root/'prepare.exit').write_text(str(prepare_code))
        if prepare_code:
            print(json.dumps(dict(stage='CPU_PREPARE_FAILED',exit=prepare_code)))
            return
        cpu_manifest = json.loads((prepared/'manifest.json').read_text())
        assert all(sha(prepared/path) == expected for path,expected in cpu_manifest.items())
        for path in prepared.rglob('*'):
            if path.is_file():
                relative = path.relative_to(prepared)
                target = root/('cpu_manifest.json' if relative == Path('manifest.json') else relative)
                target.parent.mkdir(parents=True,exist_ok=True)
                shutil.copyfile(path,target)
        assert all(sha(path) == expected for path,expected in all_hashes.items())
        assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True).strip()
        stage = 'GPU_ONE_SHOT'
        cmd = ['timeout','--signal=TERM','--kill-after=10s','290s',str(w/'analysis-runtime-20261103/bin/python'),str(root/names[1])]
        with (root/'run.log').open('x') as f:
            code = subprocess.run(cmd,stdout=f,stderr=subprocess.STDOUT).returncode
        (root/'run.exit').write_text(str(code))
        stage = 'GPU_TERMINAL'
        print(json.dumps(dict(stage=stage,exit=code,parent_seconds=time.monotonic()-start)))
    except BaseException as exc:
        (root/'supervisor_error.json').write_text(json.dumps(dict(stage=stage,error_type=type(exc).__name__,
            error=str(exc),traceback=traceback.format_exc()),indent=2)+'\n')
        raise
    finally:
        after = dict(stage=stage,exit=code,parent_seconds=time.monotonic()-start,
            prior_six_adapter_pairs_unchanged=all(sha(path) == expected for path,expected in prior.items()),
            aligned_candidate_unchanged=all(sha(path) == expected for path,expected in new_hashes.items()),
            prior_adapter_hashes=prior,all_adapter_hashes=all_hashes)
        try:
            after['compute_apps'] = subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True)
            after['compute_empty'] = not after['compute_apps'].strip()
        except BaseException as exc:
            after['compute_observation_error'] = type(exc).__name__+': '+str(exc)
        (root/'gpu-after.json').write_text(json.dumps(after,indent=2)+'\n')
        files = [path for path in root.rglob('*') if path.is_file() and path != root/'manifest.json']
        (root/'manifest.json').write_text(json.dumps({str(path.relative_to(root)):sha(path) for path in files},indent=2)+'\n')


if __name__ == '__main__': main()
