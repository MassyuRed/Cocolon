"""A6 once: synthetic17/34, at most7 native replies, restore within30min.

Requires a new explicit approval covering these files, training and same-Pod
environment reuse. This launcher does not infer approval from an argument.
"""
import hashlib
import json
import os
from pathlib import Path
import runpy
import shutil
import signal
import subprocess
import time

ROOT=Path('/workspace/semantic-alignment17-recovery-20261116-once')
PREVIOUS=Path('/workspace/semantic-reader-base-control-20261116-once')
PREVIOUS_EXECUTION_SHA='1649489bad16f75b7ca290844020589d8ffc6851ab059d892119ef0d9a2c2e3e'
HELPER=Path('/workspace/semantic_reader_base_control_once.py')
HELPER_SHA='f40a84cccdcd87bf65b6b2f4b221dca58ccf3bd13b2302dee6ff47d2e98fbb41'
OLD=Path('/workspace/semantic-reader-worked-lesson-20261116-once')
OLD_ACTUAL_SHA='e49505fbfec6cd97bba6510d11ab2f5c8761d699640251ab30add62c656eaabb'
NATIVE_SHA='7ae06f31b4db9f8b705dddf67e098a8338c94765c78fc3d5d02194eb89eee562'
FAILED=Path('/workspace/semantic-alignment17-20261116-once')
CLIENT=Path('/workspace/semantic-history-20261115-once/client-runtime-deps')
CLIENT_TREE_SHA='07c2ac87f67cdcc531966906085813fe125b8efbda81d2ab7907d0c200de1b41'
CORE_PATH='ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py'
CORE_SHA='b489a2204dfe53aa0de30e3573d707af877c9eef62d410c710e706fafdcd80fa'
PLAN=Path('/workspace/semantic_alignment17_plan.json')
DRIVER=Path('/workspace/alignment17_driver.py')
PLAN_SHA='58a1c90dab2f117c13d1dddb3ae58d5cc85ca1d446538858e0eea14d1cfd0363'
DRIVER_SHA='e2a794090b8d412eef75354eec5a974d31f7981108c4f715381b35bcfd2e600c'

def sha(path):return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def canonical(value):return json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False)

def main():
    started=time.monotonic()
    assert not ROOT.exists(),'single_use_root_already_exists'
    assert sha(HELPER)==HELPER_SHA
    helper=runpy.run_path(str(HELPER))
    assert sha(PREVIOUS/'execution.json')==PREVIOUS_EXECUTION_SHA
    previous=json.loads((PREVIOUS/'execution.json').read_text())
    assert previous['original_provider_restored'] and previous['restored_pid']==131491
    assert previous['retry']==previous['training']==0
    assert sha(PLAN)==PLAN_SHA and sha(DRIVER)==DRIVER_SHA
    assert sha(OLD/'private_positive_candidate.py')==NATIVE_SHA
    assert sha(OLD/'positive-reading.actual.result.json')==OLD_ACTUAL_SHA
    assert sha(PREVIOUS/CORE_PATH)==CORE_SHA
    assert sha(FAILED/'preflight.log')=='f5e22ada352d04e42fd283e294b950282f230c5657efe1edda2026019285bfff'
    assert sha(FAILED/'plan.json')==PLAN_SHA and sha(FAILED/'driver.py')==DRIVER_SHA
    assert not any((FAILED/name).exists() for name in ('execution.json','baseline.result.json','fit','after.result.json'))
    client_files={str(p.relative_to(CLIENT)):sha(p) for p in sorted(CLIENT.rglob('*'))
        if p.is_file() and '__pycache__' not in p.parts and p.suffix!='.pyc'}
    assert len(client_files)==408 and hashlib.sha256(canonical(client_files).encode()).hexdigest()==CLIENT_TREE_SHA
    assert not any(Path(name).parts[0].split('-')[0] in ('torch','triton','transformers','peft','accelerate','safetensors') for name in client_files)
    pack=json.loads(PLAN.read_text())
    assert pack['max_updates']==34 and pack['max_evaluation_generations']==7 and pack['retry']==0
    assert pack['source_core_sha256']==CORE_SHA
    pid=previous['restored_pid'];proc=Path('/proc')/str(pid)
    argv=[x.decode() for x in (proc/'cmdline').read_bytes().split(b'\0') if x]
    ticks=(proc/'stat').read_text().split(') ',1)[1].split()[19]
    assert argv[1]==str(helper['SERVE']) and sha(helper['SERVE'])==helper['SERVE_SHA']
    assert '--analysis-service' in argv and '--semantic-json' in argv
    assert helper['option'](argv,'--model-name')==helper['ADAPTER_MODEL']
    assert helper['option'](argv,'--adapter-weights-sha256')==pack['initial_adapter']['weights_sha256']
    assert helper['option'](argv,'--adapter-config-sha256')==pack['initial_adapter']['config_sha256']
    assert Path(helper['option'](argv,'--adapter')).resolve()==Path(pack['initial_adapter']['path']).resolve()
    env=dict(x.decode().split('=',1) for x in (proc/'environ').read_bytes().split(b'\0') if x)
    cwd=str((proc/'cwd').resolve())
    proof=helper['verify_kernel_proof'](env)
    ROOT.mkdir(mode=0o700)
    shutil.copytree(PREVIOUS/'ai',ROOT/'ai',ignore=shutil.ignore_patterns('__pycache__','*.pyc'))
    for path in (p for p in (ROOT/'ai').rglob('*') if p.is_file()):
        assert sha(path)==sha(PREVIOUS/path.relative_to(ROOT))
    shutil.copyfile(PLAN,ROOT/'plan.json');shutil.copyfile(DRIVER,ROOT/'driver.py')
    shutil.copyfile(OLD/'private_positive_candidate.py',ROOT/'native.py')
    shutil.copyfile(OLD/'positive-reading.actual.result.json',ROOT/'A3.actual.result.json')
    (ROOT/'kernel-proof.json').write_bytes(proof)
    compile((ROOT/'driver.py').read_text(),str(ROOT/'driver.py'),'exec')
    suffix=env.get('PYTHONPATH','')
    # The current app's source reconstruction imports FastAPI. Reuse the
    # already-present client dependencies in every phase, not only preflight.
    # Optional inference kernels remain excluded from the training environment.
    original_cpu_env=dict(env,PYTHONDONTWRITEBYTECODE='1',HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1',CUDA_VISIBLE_DEVICES='')
    common_pythonpath=str(CLIENT)+(os.pathsep+suffix if suffix else '')
    training_env=dict(env,PYTHONPATH=common_pythonpath,PYTHONDONTWRITEBYTECODE='1',HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
    inference_env=dict(training_env,PYTHONPATH=str(helper['DEPS'])+os.pathsep+common_pythonpath,TRITON_CACHE_DIR=str(helper['CACHE']))
    preflight_env=dict(training_env,CUDA_VISIBLE_DEVICES='')
    # Existing dependency reference changes require checking the actual six
    # ML imports before provider stop. This probe loads no model or weights.
    probe="""import importlib,importlib.metadata,json
names=('torch','transformers','peft','accelerate','safetensors','triton')
modules={name:importlib.import_module(name) for name in names}
print(json.dumps({name:{'version':importlib.metadata.version(name),'file':str(modules[name].__file__)} for name in names},sort_keys=True,separators=(',',':')))
"""
    import_reports=[]
    for label,probe_env in [('original',original_cpu_env),('client',preflight_env)]:
        probe_result=subprocess.run([argv[0],'-c',probe],cwd=ROOT,env=probe_env,
            stdin=subprocess.DEVNULL,capture_output=True,timeout=30)
        (ROOT/('imports-'+label+'.stdout')).write_bytes(probe_result.stdout)
        (ROOT/('imports-'+label+'.stderr')).write_bytes(probe_result.stderr)
        assert probe_result.returncode==0,'cpu_import_probe_failed_before_provider_stop'
        import_reports.append(json.loads(probe_result.stdout))
    assert import_reports[0]==import_reports[1],'existing_ml_import_source_or_version_changed'
    (ROOT/'client-dependency-check.json').write_text(canonical(dict(client_files=408,client_tree_sha256=CLIENT_TREE_SHA,
        original_and_client_ml_imports_equal=True,ml_imports=import_reports[0],model_loads=0,training=0))+'\n')
    base=[argv[0],str(ROOT/'driver.py'),'--plan',str(ROOT/'plan.json'),'--plan-sha256',PLAN_SHA,
        '--native',str(ROOT/'native.py')]
    with (ROOT/'preflight.log').open('xb') as log:
        ready=subprocess.run(base+['--mode','preflight','--process-seconds','80'],cwd=ROOT,env=preflight_env,
            stdin=subprocess.DEVNULL,stdout=log,stderr=subprocess.STDOUT,timeout=90)
    assert ready.returncode==0,'training_preflight_failed_before_provider_stop'
    checked=json.loads((ROOT/'preflight.json').read_text())
    assert checked['state']=='PREFLIGHT_PASS_NOT_MODEL_QUALITY' and checked['plan_sha256']==PLAN_SHA
    state=dict(state='PREPARED_NOT_ADOPTED',source_api_commit=pack['source_api_commit'],plan_sha256=PLAN_SHA,
        driver_sha256=DRIVER_SHA,native_sha256=NATIVE_SHA,core_sha256=CORE_SHA,initial_adapter=pack['initial_adapter'],
        closed_failed_root=str(FAILED),client_dependency_tree_sha256=CLIENT_TREE_SHA,ml_imports_unchanged=True,
        initial_updates=120,teacher_rows=17,new_training_episodes=2,planned_updates=34,max_model_calls=7,
        native_generation_seconds=210,total_generation_seconds=900,training_seconds=600,work_seconds=1620,
        restore_inclusive_seconds=1800,retry=0,original_provider_restored=False,phases=[])
    def save():
        state['elapsed_seconds']=time.monotonic()-started
        (ROOT/'execution.json').write_text(canonical(state)+'\n')
    save();child=None;original_stopped=False
    def expired(*unused):raise TimeoutError('alignment_deadline_restore_reserved')
    signal.signal(signal.SIGALRM,expired);signal.signal(signal.SIGTERM,expired)
    remaining=started+1620-time.monotonic();assert remaining>0
    signal.setitimer(signal.ITIMER_REAL,remaining)
    try:
        assert (proc/'stat').read_text().split(') ',1)[1].split()[19]==ticks
        assert [x.decode() for x in (proc/'cmdline').read_bytes().split(b'\0') if x]==argv
        assert dict(x.decode().split('=',1) for x in (proc/'environ').read_bytes().split(b'\0') if x)==env
        original_stopped=True;helper['stop'](pid)
        state['state']='ACTIVATED_NOT_ADOPTED';save()
        for phase,phase_env,maximum in [('baseline',inference_env,480),('train',training_env,720),('after',inference_env,1100)]:
            remaining=min(maximum,started+1620-time.monotonic()-5)
            assert remaining>5,'phase_budget_exhausted'
            state['phases'].append(dict(phase=phase,state='STARTED'));save()
            with (ROOT/(phase+'.log')).open('xb') as log:
                child=subprocess.Popen(base+['--mode',phase,'--process-seconds',str(remaining)],cwd=ROOT,env=phase_env,
                    stdin=subprocess.DEVNULL,stdout=log,stderr=subprocess.STDOUT,start_new_session=True)
                assert os.getsid(child.pid)==child.pid
                result=child.wait(timeout=remaining+1)
            state['phases'][-1].update(state='EXITED',exit_code=result);save()
            child=None
            assert result==0,'alignment_phase_failed_stop'
        baseline=json.loads((ROOT/'baseline.result.json').read_text());after=json.loads((ROOT/'after.result.json').read_text())
        trained=json.loads((ROOT/'fit/report.json').read_text())
        assert baseline['new_model_calls']==2 and after['new_model_calls']==5
        assert baseline['state']==after['state']=='COMPLETE_NOT_ADOPTED_PENDING_MEANING_REVIEW'
        assert trained['state']=='TRAINING_COMPLETE_NOT_ADOPTED' and trained['updates_completed']==34
        state.update(state='DIAGNOSTIC_FINISHED_NOT_ADOPTED',new_model_calls=7,updates_completed=34,
            candidate=trained['candidate'],after_sha256=sha(ROOT/'after.result.json'),baseline_sha256=sha(ROOT/'baseline.result.json'))
        save()
    finally:
        signal.alarm(0);signal.signal(signal.SIGTERM,signal.SIG_IGN)
        try:
            if child is not None:helper['stop'](child.pid)
        finally:
            if original_stopped:
                with (ROOT/'restored-provider.log').open('xb') as log:
                    restored=subprocess.Popen(argv,cwd=cwd,env=env,stdin=subprocess.DEVNULL,stdout=log,stderr=subprocess.STDOUT,start_new_session=True)
                state['restored_pid']=restored.pid;save()
                helper['health_wait'](60)
                restored_proc=Path('/proc')/str(restored.pid)
                assert [x.decode() for x in (restored_proc/'cmdline').read_bytes().split(b'\0') if x]==argv
                assert dict(x.decode().split('=',1) for x in (restored_proc/'environ').read_bytes().split(b'\0') if x)==env
                assert str((restored_proc/'cwd').resolve())==cwd
                assert sha(Path(pack['initial_adapter']['path'])/'adapter_model.safetensors')==pack['initial_adapter']['weights_sha256']
                state['original_provider_restored']=True
            save()
            assert state['elapsed_seconds']<1800,'restoration_budget_exceeded'
    print(canonical({k:state[k] for k in ('state','elapsed_seconds','original_provider_restored','restored_pid')}))

if __name__=='__main__':main()
