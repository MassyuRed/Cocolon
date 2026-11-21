"""One bounded reason/unknown76 comparison, retaining CPU and partial GPU evidence.

The two private source-authored contrasts are supplied by a hash-pinned JSON file.
No private source text or generated raw response is embedded in this public script.
"""
import argparse
from pathlib import Path
import hashlib
import json
import shutil
import subprocess
import time
import traceback

w=Path('/workspace')
root=w/'analysis-reason-unknown76-20261103'
prepared=w/'analysis-reason-unknown76-prepared-20261103'
api=w/'analysis-semantic-boundaries-api-20261103'
aligned=w/'analysis-aligned74-20261103'
transfer=w/'analysis-role-transfer4-20261103'
initial=aligned/'result/adapter'
API_COMMIT='dc05dc358d1c44ce47fd844f6041d74f1f74fe6a'
SOURCE_SHA='e70cd50e994b6bbbbb3f9daac2f547660e1453b61b7583bed02da07d3ce3b750'
INITIAL_WEIGHTS='d25da0a00dc575b3035b26be1f6d5d52ee3f0291c746d87fead7bfd12146c648'
INITIAL_CONFIG='4a46d90dfe81c1c99eaf6abcff01aeede7dadfaa9d9abaafb866ff2da01137dd'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()


def compute_apps():
    return subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory',
        '--format=csv,noheader'],text=True)


def unchanged(values):
    return all(Path(p).is_file() and sha(p)==h for p,h in values.items())


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source',required=True,type=Path)
    parser.add_argument('--source-sha256',required=True)
    args=parser.parse_args()
    assert not root.exists() and not prepared.exists()
    assert args.source_sha256==SOURCE_SHA and sha(args.source)==SOURCE_SHA
    assert (w/'semantic-boundaries-tests.exit').read_text()=='0'
    assert (aligned/'run.exit').read_text()==(transfer/'run.exit').read_text()=='0'
    assert json.loads((aligned/'result/report.json').read_text())['status']=='COMPLETE_NOT_ADOPTED_PENDING_RAW_READ'
    assert json.loads((transfer/'result/report.json').read_text())['status']=='COMPLETE_PENDING_RAW_READ_NOT_ADOPTED'
    assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip()==API_COMMIT
    assert not subprocess.check_output(['git','-C',str(api),'status','--porcelain','--untracked-files=no'],text=True).strip()
    assert not compute_apps().strip()
    prior=json.loads((transfer/'gpu-after.json').read_text())['all_adapter_hashes']
    assert len(prior)==14 and unchanged(prior)
    assert sha(initial/'adapter_model.safetensors')==INITIAL_WEIGHTS
    assert sha(initial/'adapter_config.json')==INITIAL_CONFIG
    names=['semantic_units_reason_unknown76_prepare.py','semantic_units_reason_unknown76_run.py',
        'semantic_units_reason_unknown76_supervisor.py']
    root.mkdir()
    stage='CPU_PREPARE_STARTED'
    code=None
    started=None
    try:
        for name in names:shutil.copyfile(w/name,root/name)
        (root/'code_hashes.json').write_text(json.dumps({n:sha(root/n) for n in names},indent=2)+'\n')
        shutil.copyfile(args.source,root/'sources.json')
        (root/'adapter_hashes_before.json').write_text(json.dumps(prior,indent=2)+'\n')
        with (root/'prepare.log').open('x') as f:
            proc=subprocess.run(['timeout','180s',str(w/'analysis-runtime-20261103/bin/python'),
                str(root/names[0]),'--source',str(root/'sources.json'),'--source-sha256',SOURCE_SHA],
                stdout=f,stderr=subprocess.STDOUT)
        (root/'prepare.exit').write_text(str(proc.returncode))
        if proc.returncode:
            stage='CPU_PREPARE_FAILED'
            print(json.dumps(dict(stage=stage,exit=proc.returncode)))
            return
        shutil.copytree(prepared,root,dirs_exist_ok=True)
        shutil.copyfile(prepared/'manifest.json',root/'cpu_manifest.json')
        (root/'manifest.json').unlink()
        shutil.copyfile(w/'analysis-combination70-20261103/adaptive_loss.py',root/'adaptive_loss.py')
        plan_path=root/'semantic_units_reason_unknown76_plan.json'
        pack=json.loads(plan_path.read_text())
        assert pack['status']=='ROOT_SYNTHETIC_REASON_UNKNOWN76_FROM_SAVED_D25_NOT_PRODUCT_ACCEPTANCE'
        assert len(pack['teachers'])==76 and len(pack['evaluation'])==50
        assert len(pack['preexisting_evaluation'])==50
        assert (pack['plan']['max_updates'],pack['plan']['max_model_loads'],
            pack['plan']['max_new_generations'],pack['plan']['max_seconds'])==(90,2,50,900)
        assert len(pack['plan']['update_order'])==90
        assert pack['plan']['update_order'][-4:]==['RU01','RU02','RU01','RU02']
        assert pack['plan']['initial_weights_sha256']==INITIAL_WEIGHTS
        assert pack['plan']['initial_config_sha256']==INITIAL_CONFIG
        assert sha(initial/'adapter_model.safetensors')==INITIAL_WEIGHTS
        assert sha(initial/'adapter_config.json')==INITIAL_CONFIG
        assert unchanged(prior) and not compute_apps().strip()
        cmd=['timeout','--signal=TERM','--kill-after=10s','890s',
            str(w/'analysis-runtime-20261103/bin/python'),str(root/names[1]),
            '--api-root',str(api),'--plan',str(plan_path),'--plan-sha256',sha(plan_path),
            '--initial-dir',str(initial),'--adaptive-loss',str(root/'adaptive_loss.py'),
            '--out',str(root/'result')]
        stage='GPU_STARTED'
        started=time.monotonic()
        with (root/'run.log').open('x') as f:
            code=subprocess.run(cmd,stdout=f,stderr=subprocess.STDOUT).returncode
        (root/'run.exit').write_text(str(code))
        stage='GPU_TERMINAL'
    except BaseException as exc:
        stage='SUPERVISOR_FAILED'
        (root/'supervisor_error.json').write_text(json.dumps(dict(error_type=type(exc).__name__,
            error=str(exc),traceback=traceback.format_exc()),indent=2)+'\n')
        raise
    finally:
        if started is None and prepared.exists():
            try:
                shutil.copytree(prepared,root/'cpu_partial',dirs_exist_ok=False)
            except OSError as exc:
                (root/'cpu_partial_collection_error.json').write_text(json.dumps(dict(
                    error_type=type(exc).__name__,error=str(exc)),indent=2)+'\n')
        try:
            apps=compute_apps()
            after=dict(stage=stage,exit=code,parent_seconds=None if started is None else time.monotonic()-started,
                prior_seven_adapter_pairs_unchanged=unchanged(prior),prior_adapter_hashes=prior,
                compute_apps=apps,compute_empty=not apps.strip())
        except BaseException as exc:
            after=dict(stage=stage,exit=code,inspection_error_type=type(exc).__name__,inspection_error=str(exc))
        (root/'gpu-after.json').write_text(json.dumps(after,indent=2)+'\n')
        files=[p for p in root.rglob('*') if p.is_file() and p!=root/'manifest.json']
        (root/'manifest.json').write_text(json.dumps({str(p.relative_to(root)):sha(p) for p in files},indent=2)+'\n')
        print(json.dumps(dict(stage=stage,exit=code,members=len(files)+1)))


if __name__=='__main__':
    main()
