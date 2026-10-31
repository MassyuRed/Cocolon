"""New bounded local-token fit; closed predecessor runs are read-only evidence."""
import argparse,gc,hashlib,importlib.util,json,math,os,random,shutil,signal,sys,time,traceback
from pathlib import Path
from unittest.mock import patch
sys.dont_write_bytecode=True
OUTPUT=Path('/workspace/cocolon_localized30_run_20261027')
ORIGIN=Path('/workspace/cocolon_native15_expanded30_run_20261027')
RECOVERY=Path('/workspace/cocolon_native15_expanded15_recovery_pack_20261027')
API=Path('/workspace/cocolon_localized30_api_20261027')
PLAN='localized30.plan.json'
FIXED=dict(schema='cocolon.local_token30_once.v1',initial_adapter_sha256='109c3dda16b19d2f110d6f8e2ded07f47e981b9690970ca95b9046780bffb85a',api_commit='a4b91b4788b2fb29483a4c77869c91b36402ae9f',pod_id='bkj4qvnhwtdqc2',expected_gpu_name='NVIDIA RTX A5000',output_directory=str(OUTPUT),optimizer_steps=30,training_passes=2,before_calls=0,max_model_calls=15,max_seconds=2700,per_generation_seconds=180,gpu_hourly_usd=0.28,max_process_usd=0.21,learning_rate=1e-5,seed=20261024,gradient_clip=1.0,loss_extra_weight=15,local_tokens=198,context_tokens=8192,optimizer_resume=False,retry=False,gpu_lifecycle_operations=0,sql_operations=0,product_credit=0,unknown_generalization_credit=0,product_accepted=False,automatic_progression=False)
def require(ok,code):
    if not ok:raise ValueError(code)
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def dump(p,v):
    p=Path(p);tmp=p.with_suffix(p.suffix+'.tmp');tmp.write_text(json.dumps(v,ensure_ascii=False,indent=2,allow_nan=False)+'\n');tmp.replace(p)
def module(name,p):
    s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);sys.modules[name]=m;s.loader.exec_module(m);return m
def validate_plan(pack,execution=False):
    plan=json.loads((pack/PLAN).read_text())
    require(set(plan)==set(FIXED)|{'update_order','runner_sha256','cpu_check_sha256','status','gpu_run_authorized','approval_basis'},'local_plan_keys')
    for k,v in FIXED.items():require(type(plan.get(k)) is type(v) and plan[k]==v,'local_plan_scope:'+k)
    require(plan['status'] in {'PREPARED_AWAITING_MASH_APPROVAL','AUTHORIZED_ONCE_BOUND'},'local_plan_status')
    authorized=plan['status']=='AUTHORIZED_ONCE_BOUND'
    require(type(plan['gpu_run_authorized']) is bool and plan['gpu_run_authorized']==authorized,'local_authorization_mismatch')
    require((authorized and type(plan['approval_basis']) is str and plan['approval_basis'].strip()) or (not authorized and plan['approval_basis'] is None),'local_approval_basis')
    # Refuse before output creation, CPU preparation or any real-model operation.
    require(not execution or authorized,'execute_refused_new_local30_approval_pending')
    require(sha(__file__)==plan['runner_sha256'],'local_runner_changed')
    require(type(plan['cpu_check_sha256']) is str and sha(pack/'actual_cpu_check.json')==plan['cpu_check_sha256'],'local_cpu_check_changed')
    return plan
def prepare(pack):
    require(os.environ.get('HF_HUB_OFFLINE')==os.environ.get('TRANSFORMERS_OFFLINE')=='1','offline_required')
    plan=validate_plan(pack);cpu=json.loads((pack/'actual_cpu_check.json').read_text())
    require(cpu['status']=='CPU_LOCALIZED30_PREPARED_GPU_NOT_AUTHORIZED' and cpu['selected_tokens']==198 and cpu['model_loads']==cpu['model_forwards']==cpu['training_updates']==cpu['generations']==0,'local_cpu_scope')
    for n,h in cpu['payload_sha256'].items():require(sha(pack/n)==h,'local_payload_changed:'+n)
    for n,h in cpu['api_inventory'].items():require(sha(API/n)==h,'local_api_changed:'+n)
    require(all(sha(p)==h for p,h in cpu['external_dependency_sha256'].items()),'local_external_dependency_changed')
    rcv=module('local30_recovery',RECOVERY/'run_expanded15_recovery.py');rcv.validate_origin();owner,_,_=rcv.owner_with_checked_suffixes()
    old,r,joint,tok,oldrows,oldcases,oldencoded,_=owner.prepare(rcv.OLDPACK)
    require(plan['update_order']==old['update_order'] and old['learning_rate']==plan['learning_rate'] and old['seed']==plan['seed'],'local_order_lr_seed_changed')
    rows=r.read_jsonl(pack/'train_messages.jsonl');cases=r.read_jsonl(pack/'eval_inputs.jsonl');mask=json.loads((pack/'fixed_token_mask.json').read_text());loss=module('local30_loss',pack/'local_token_loss.py')
    require(len(rows)==len(cases)==15 and [x['id'] for x in rows]==[x['id'] for x in oldrows],'local_row_order')
    encoded=[];chosen={}
    for row,case,orow,ocase in zip(rows,cases,oldrows,oldcases,strict=True):
        require(case['messages']==row['messages'][:-1] and row['messages'][-1]==orow['messages'][-1],'local_eval_gold_leak_or_teacher_change')
        a=json.loads(case['messages'][1]['content']);b=json.loads(ocase['messages'][1]['content'])
        condition=a['output_spec'].pop('unknown_id_constraints');require('[A-Za-z0-9_.-]{1,64}' in condition and a==b and case['messages'][0]==ocase['messages'][0],'local_extra_prompt_change')
        e,prefix=r.encode_training(tok,row['messages'],context=8192);require(prefix+case['max_new_tokens']<=8192 and case['max_new_tokens']==ocase['max_new_tokens'],'local_context_or_cap_change')
        chosen[row['id']]=loss.validate_case(mask['cases'][row['id']],row['messages'][-1]['content'],e['input_ids'][prefix:]);encoded.append(e)
    require(sum(map(len,chosen.values()))==198,'local_mask_count')
    return plan,cpu,rcv,owner,r,joint,tok,rows,cases,encoded,chosen,loss
def execute(pack,source):
    require(len(source)==40 and all(c in '0123456789abcdef' for c in source),'new_local30_source_commit_required')
    plan=validate_plan(pack,execution=True)
    parent=Path('/proc')/str(os.getppid())/'cmdline';args=parent.read_bytes().split(bytes([0]))
    require(args[0].rsplit(b'/',1)[-1]==b'timeout' and all(s in args for s in (b'--signal=TERM',b'--kill-after=10s',b'2690s')),'external_2690_plus10_timeout_required')
    OUTPUT.mkdir(exist_ok=False);started=time.monotonic();deadline=started+2700
    report=dict(status='STARTED_ONCE',source_commit=source,plan=plan,started_unix=time.time(),optimizer_steps_started=0,optimizer_steps_completed=0,model_calls_started=0,model_calls_completed=0,base_model_loads_started=0,base_model_loads_completed=0,calls=[],automatic_progression=False,product_accepted=False,sql_operations=0,retry=False,strict_optimizer_resume=False)
    model=None;optimizer=None;trainable=None;rcv=None;cpu=None;ids=None;labels=None;value=None;original=None;generate=None;initial=None
    def checkpoint():report['elapsed_seconds']=time.monotonic()-started;dump(OUTPUT/'run.json',report)
    def timeout(*_):raise TimeoutError('local30_deadline_no_retry')
    signal.signal(signal.SIGALRM,timeout);signal.signal(signal.SIGTERM,timeout);signal.setitimer(signal.ITIMER_REAL,2700);checkpoint()
    try:
        plan,cpu,rcv,owner,r,joint,tok,rows,cases,encoded,chosen,loss=prepare(pack)
        for p in pack.iterdir():
            if p.is_file():shutil.copyfile(p,OUTPUT/p.name)
        import torch
        from transformers import StoppingCriteria,StoppingCriteriaList
        require(torch.cuda.device_count()==1 and os.environ.get('RUNPOD_POD_ID')==plan['pod_id'],'local_bound_pod_gpu')
        report['gpu']=r.gpu_profile(torch,{'minimum_free_gib':14});require(report['gpu']['name']==plan['expected_gpu_name'],'local_bound_gpu_name');torch.cuda.reset_peak_memory_stats()
        report.update(stage='loading_saved109c_trainable',base_model_loads_started=1);checkpoint()
        model,tensors=owner.load_expanded_adapter(r,ORIGIN/'adapter',rcv.ADAPTER,trainable=True);report['base_model_loads_completed']=1;dump(OUTPUT/'initial_loaded_tensors.json',tensors)
        trainable=[(n,p) for n,p in model.named_parameters() if p.requires_grad];require(len(trainable)==112,'local_trainable_scope')
        initial={n:p.detach().cpu().clone() for n,p in trainable}
        random.seed(plan['seed']);torch.manual_seed(plan['seed']);torch.cuda.manual_seed_all(plan['seed'])
        model.config.use_cache=False;model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={'use_reentrant':False});model.enable_input_require_grads();model.train()
        optimizer=torch.optim.AdamW([p for _,p in trainable],lr=plan['learning_rate'],weight_decay=0.)
        rowindex={row['id']:i for i,row in enumerate(rows)}
        report['stage']='training';checkpoint()
        with (OUTPUT/'training.jsonl').open('x') as stream:
            for step,cid in enumerate(plan['update_order'],1):
                require(time.monotonic()<deadline-5,'local_deadline_before_update');e=encoded[rowindex[cid]]
                ids=torch.tensor([e['input_ids']],dtype=torch.long,device='cuda:0');labels=torch.tensor([e['labels']],dtype=torch.long,device='cuda:0')
                optimizer.zero_grad(set_to_none=True);value=loss.teacher_loss(model,r,input_ids=ids,attention_mask=torch.ones_like(ids),labels=labels,encoded=e,chosen=chosen[cid]);require(torch.isfinite(value).item(),'local_loss_nonfinite');value.backward()
                norm=float(torch.nn.utils.clip_grad_norm_([p for _,p in trainable],1.,error_if_nonfinite=True).cpu());require(math.isfinite(norm) and norm>0,'local_gradient_invalid');report['optimizer_steps_started']=step;checkpoint();optimizer.step();report['optimizer_steps_completed']=step
                stream.write(json.dumps(dict(step=step,id=cid,loss=float(value.detach().cpu()),selected_tokens=len(chosen[cid]),gradient_norm=norm))+'\n');stream.flush();checkpoint();del ids,labels,value
        optimizer.zero_grad(set_to_none=True);optimizer=None
        require(all(torch.isfinite(p).all().item() for _,p in trainable),'local_final_adapter_nonfinite')
        report['changed_tensors']=sum(not torch.equal(initial[n],p.detach().cpu()) for n,p in trainable)
        model.save_pretrained(OUTPUT/'adapter',safe_serialization=True);report.update(stage='saved_before_nontraining_reload',adapter_sha256=r.adapter_hashes(OUTPUT/'adapter'));checkpoint()
        initial=None;trainable=None;model=None;gc.collect();torch.cuda.empty_cache()
        report.update(stage='loading_saved_inference_only',base_model_loads_started=2);checkpoint()
        model,tensors=owner.load_expanded_adapter(r,OUTPUT/'adapter',report['adapter_sha256'],trainable=False);report['base_model_loads_completed']=2;dump(OUTPUT/'reloaded_tensors.json',tensors)
        for case in cases:
            require(time.monotonic()<deadline-5 and report['model_calls_started']<15,'local_deadline_before_generation')
            stop_at=min(deadline,time.monotonic()+180);triggered=False;original=model.generate
            class Bounded(StoppingCriteria):
                def __call__(self,*a,**kw):
                    nonlocal triggered
                    triggered=time.monotonic()>=stop_at;return triggered
            def generate(*a,**kw):
                kw['stopping_criteria']=StoppingCriteriaList([*list(kw.get('stopping_criteria') or []),Bounded()]);return original(*a,**kw)
            report['model_calls_started']+=1;report['stage']='after:'+case['case_id'];checkpoint();path=OUTPUT/('after_'+case['case_id']+'.jsonl')
            with patch.object(model,'generate',generate):r.evaluate(model,tok,[case],path,{'context_tokens':8192,'max_new_tokens':case['max_new_tokens']},adapter_revision=report['adapter_sha256']['adapter_model.safetensors'])
            raw=r.read_jsonl(path);require(len(raw)==1,'local_raw_count');report['model_calls_completed']+=1;report['calls'].append(dict(phase='after',case_id=case['case_id'],path=path.name,eos_reached=raw[0]['eos_reached'],timeout_triggered=triggered,raw_sha256=sha(path)));checkpoint();require(not triggered and time.monotonic()<stop_at,'local_generation_timeout_no_retry')
        report.update(status='RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW',stage='raw_complete',peak_allocated_bytes=torch.cuda.max_memory_allocated(),peak_reserved_bytes=torch.cuda.max_memory_reserved())
    except BaseException as exc:
        report.update(status='STOPPED_NO_RETRY',error_type=type(exc).__name__,reason=str(exc),traceback=traceback.format_exc())
        if model is not None and report['optimizer_steps_started']>0 and 'adapter_sha256' not in report:
            try:
                ids=None;labels=None;value=None;optimizer=None;gc.collect()
                model.save_pretrained(OUTPUT/'partial_adapter',safe_serialization=True)
                report['partial_adapter_sha256']=r.adapter_hashes(OUTPUT/'partial_adapter')
                report['partial_adapter_not_promoted']=True
            except BaseException as save_exc:report['partial_adapter_preservation_error']=str(save_exc)
    finally:
        original=None;generate=None;ids=None;labels=None;value=None;initial=None;model=None;optimizer=None;trainable=None;gc.collect()
        if 'torch' in sys.modules and sys.modules['torch'].cuda.is_initialized():
            sys.modules['torch'].cuda.empty_cache();report['post_release_allocated_bytes']=sys.modules['torch'].cuda.memory_allocated()
        try:
            require(rcv is not None and cpu is not None,'local_preparation_not_verified');rcv.validate_origin()
            require(validate_plan(pack)==plan,'local_plan_changed')
            require(all(sha(pack/n)==h for n,h in cpu['payload_sha256'].items()),'local_source_changed')
            require(all(sha(API/n)==h for n,h in cpu['api_inventory'].items()),'local_api_changed_after_run')
            require(all(sha(p)==h for p,h in cpu['external_dependency_sha256'].items()),'local_external_dependency_changed_after_run')
            if 'adapter_sha256' in report:require(r.adapter_hashes(OUTPUT/'adapter')==report['adapter_sha256'],'local_saved_adapter_changed_after_generation')
            report['fixed_sources_and_initial109c_unchanged']=True
        except BaseException as exc:report.update(status='STOPPED_IDENTITY_UNVERIFIED_NO_RETRY',final_identity_error=str(exc))
        signal.setitimer(signal.ITIMER_REAL,0);report['processing_seconds']=time.monotonic()-started;report['process_cost_usd']=report['processing_seconds']*.28/3600
        if report['processing_seconds']>=2700:report.update(status='STOPPED_DEADLINE_NO_RETRY',reason='whole_worker_processing_limit')
        checkpoint()
    print(json.dumps({k:report.get(k) for k in ('status','optimizer_steps_completed','model_calls_completed','processing_seconds','process_cost_usd')}),flush=True)
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--pack',type=Path,required=True);p.add_argument('--execute',action='store_true');p.add_argument('--source-commit',default='');a=p.parse_args()
    if a.execute:execute(a.pack.resolve(),a.source_commit)
    else:result=prepare(a.pack.resolve());print(json.dumps(dict(status='CPU_LOCAL30_RUNNER_PREPARED_NO_MODEL_EXECUTION',cases=len(result[7]),local_tokens=198,model_loads=0,forwards=0,updates=0,generations=0)),flush=True)
