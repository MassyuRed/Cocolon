"""New single-use, no-training probe. Closed training authorities are never executed."""
import argparse,gc,hashlib,importlib.util,json,os,signal,sys,time,traceback
from pathlib import Path
from unittest.mock import patch
sys.dont_write_bytecode=True
OUTPUT=Path('/workspace/cocolon_prior_quote_probe2_run_20261027')
ADAPTER=Path('/workspace/cocolon_adaptive30_run_20261027/adapter')
PREVIOUS=Path('/workspace/cocolon_adaptive30_pack_20261027')
IDS=['FT-BOOK-AFTER-ANSWER','FT-SHOP-AFTER-ANSWER']
FIXED=dict(schema='cocolon.prior_quote_probe2_once.v1',adapter_sha256='d431a07ce227c05e81eca5afb9461d91cf8101d50af0d27ec1a81844ce8ac684',pod_id='bkj4qvnhwtdqc2',expected_gpu_name='NVIDIA RTX A5000',output_directory=str(OUTPUT),training_updates=0,max_model_calls=2,case_ids=IDS,max_seconds=600,per_generation_seconds=180,gpu_hourly_usd=.28,max_process_usd=.047,context_tokens=8192,retry=False,gpu_lifecycle_operations=0,production_sql_operations=0,automatic_progression=False,product_credit=0)
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def dump(p,v):
    p=Path(p);temp=p.with_suffix(p.suffix+'.tmp');temp.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n');temp.replace(p)
def module(name,path):
    spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);sys.modules[name]=m;spec.loader.exec_module(m);return m
def validate(pack,execution=False):
    plan=json.loads((pack/'probe2.plan.json').read_text())
    assert set(plan)==set(FIXED)|{'status','gpu_run_authorized','approval_basis','runner_sha256','cpu_check_sha256','eval_inputs_sha256','api_candidate_commit'}
    for k,v in FIXED.items():assert type(plan[k]) is type(v) and plan[k]==v,k
    authorized=plan['status']=='AUTHORIZED_ONCE_BOUND'
    assert plan['status'] in ('PREPARED_AWAITING_MASH_APPROVAL','AUTHORIZED_ONCE_BOUND')
    assert type(plan['gpu_run_authorized']) is bool and plan['gpu_run_authorized']==authorized
    assert (authorized and type(plan['approval_basis']) is str and plan['approval_basis'].strip()) or (not authorized and plan['approval_basis'] is None)
    if execution and not authorized:raise ValueError('new_probe2_mash_approval_required_before_output_or_model')
    assert sha(__file__)==plan['runner_sha256']
    assert sha(pack/'actual_cpu_check.json')==plan['cpu_check_sha256']
    assert sha(pack/'eval_inputs.json')==plan['eval_inputs_sha256']
    assert len(plan['api_candidate_commit'])==40
    cpu=json.loads((pack/'actual_cpu_check.json').read_text())
    assert cpu['status']=='CPU_PRIOR_QUOTE_INPUT_FIXED_MODEL_EFFECT_UNMEASURED' and cpu['direct_assertions_passed']
    assert cpu['model_loads']==cpu['model_forwards']==cpu['training_updates']==cpu['generations']==0
    assert cpu['changed_answer_prompts']==5 and cpu['removed_scalar_offsets']==60
    assert sha(ADAPTER/'adapter_model.safetensors')==plan['adapter_sha256']
    candidates=json.loads((pack/'eval_inputs.json').read_text());byid={c['case_id']:c for c in candidates}
    selected=[byid[cid] for cid in IDS]
    assert [c['max_new_tokens'] for c in selected]==[3712,3712]
    return plan,selected
def execute(pack,source):
    plan,cases=validate(pack,execution=True)
    assert len(source)==40 and all(c in '0123456789abcdef' for c in source)
    parent=(Path('/proc')/str(os.getppid())/'cmdline').read_bytes().split(bytes([0]))
    assert parent[0].rsplit(b'/',1)[-1]==b'timeout' and all(x in parent for x in (b'--signal=TERM',b'--kill-after=10s',b'590s'))
    OUTPUT.mkdir(exist_ok=False);started=time.monotonic();deadline=started+600
    report=dict(status='STARTED_ONCE',source_commit=source,plan=plan,training_updates=0,model_loads_started=0,model_loads_completed=0,model_calls_started=0,model_calls_completed=0,calls=[],retry=False,automatic_progression=False,product_credit=0,gpu_lifecycle_operations=0)
    model=None;original=None;r=None
    def checkpoint():report['elapsed_seconds']=time.monotonic()-started;dump(OUTPUT/'run.json',report)
    def stop(*_):raise TimeoutError('probe2_deadline_no_retry')
    signal.signal(signal.SIGALRM,stop);signal.signal(signal.SIGTERM,stop);signal.setitimer(signal.ITIMER_REAL,600);checkpoint()
    try:
        old=module('probe2_readonly_preparation_owner',PREVIOUS/'run_adaptive30.py')
        # Only its read-only dependency/tokenizer verification and adapter loader
        # are reused. Its consumed execute() is never called.
        parts=old.prepare(PREVIOUS);_,_,_,owner,r,_,tok,*_=parts
        import torch
        from transformers import StoppingCriteria,StoppingCriteriaList
        assert os.environ.get('RUNPOD_POD_ID')==plan['pod_id'] and torch.cuda.device_count()==1
        report['gpu']=r.gpu_profile(torch,{'minimum_free_gib':14});assert report['gpu']['name']==plan['expected_gpu_name']
        hashes=r.adapter_hashes(ADAPTER);assert hashes['adapter_model.safetensors']==plan['adapter_sha256']
        report['model_loads_started']=1;checkpoint()
        model,tensors=owner.load_expanded_adapter(r,ADAPTER,hashes,trainable=False)
        assert len(tensors)==112 and not any(p.requires_grad for p in model.parameters())
        report['model_loads_completed']=1;dump(OUTPUT/'loaded_tensors.json',tensors);checkpoint()
        for case in cases:
            assert report['model_calls_started']<2 and time.monotonic()<deadline-5
            stop_at=min(deadline,time.monotonic()+180);triggered=False;original=model.generate
            class Bounded(StoppingCriteria):
                def __call__(self,*args,**kwargs):
                    nonlocal triggered
                    triggered=time.monotonic()>=stop_at;return triggered
            def generate(*args,**kwargs):
                kwargs['stopping_criteria']=StoppingCriteriaList([*list(kwargs.get('stopping_criteria') or []),Bounded()]);return original(*args,**kwargs)
            report['model_calls_started']+=1;checkpoint();path=OUTPUT/('after_'+case['case_id']+'.jsonl')
            with patch.object(model,'generate',generate):r.evaluate(model,tok,[case],path,{'context_tokens':8192,'max_new_tokens':case['max_new_tokens']},adapter_revision=plan['adapter_sha256'])
            raw=r.read_jsonl(path);assert len(raw)==1
            report['model_calls_completed']+=1;report['calls'].append(dict(case_id=case['case_id'],path=path.name,raw_sha256=sha(path),eos_reached=raw[0]['eos_reached'],timeout_triggered=triggered));checkpoint()
            assert not triggered and time.monotonic()<stop_at,'generation_timeout_no_retry'
        assert r.adapter_hashes(ADAPTER)==hashes
        assert validate(pack)[0]==plan
        report.update(status='RAW_COMPLETE_PENDING_UNCHANGED_CMEE_AND_BODY_REVIEW',saved_adapter_unchanged=True)
    except BaseException as exc:report.update(status='STOPPED_NO_RETRY',error_type=type(exc).__name__,reason=str(exc),traceback=traceback.format_exc())
    finally:
        original=None;model=None;gc.collect()
        if 'torch' in sys.modules and sys.modules['torch'].cuda.is_initialized():sys.modules['torch'].cuda.empty_cache()
        signal.setitimer(signal.ITIMER_REAL,0);report['processing_seconds']=time.monotonic()-started;report['process_cost_usd']=report['processing_seconds']*.28/3600;checkpoint()
    print(json.dumps({k:report[k] for k in ('status','training_updates','model_calls_completed','processing_seconds','process_cost_usd')}))
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--pack',type=Path,required=True);p.add_argument('--execute',action='store_true');p.add_argument('--source-commit',default='');a=p.parse_args()
    if a.execute:execute(a.pack,a.source_commit)
    else:plan,cases=validate(a.pack);print('CPU_PROBE2_PLAN_VALIDATED_NO_MODEL',len(cases))
