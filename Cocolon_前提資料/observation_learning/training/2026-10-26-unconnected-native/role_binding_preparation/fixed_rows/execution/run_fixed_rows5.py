"""One approved conditional full-row trial: before2, then only if needed five updates/after11."""
import argparse
import gc
import hashlib
import importlib.metadata
import importlib.util
import json
import math
import os
from pathlib import Path
import random
import signal
import subprocess
import sys
import time
import traceback
from unittest.mock import patch

sys.dont_write_bytecode=True
HERE=Path(__file__).resolve().parent
OUT=Path('/workspace/cocolon_fixedrows5_run_20261029')
BUNDLE=Path('/workspace/cocolon_auxiliary4_20261029')
ROOT=Path('/workspace/cocolon_fixedrows5_cmee_20261029')
CPU=Path('/workspace/cocolon_fixedrows5_cpu_20261029/cpu_check.json')
DERIVED=Path('/workspace/cocolon_fixed_rows_cpu_v2_20261029')
INITIAL=Path('/workspace/cocolon_joint_role18_run_20261029/adapter')
FULL=['FT-BOOK-AFTER-ANSWER','FT-SHOP-AFTER-ANSWER']
OLD=['TRAIN-SERVICE-CHAIR-01-INITIAL','TRAIN-SERVICE-CHAIR-01-CORRECTION','TRAIN-SERVICE-CHAIR-02-INITIAL','TRAIN-SERVICE-CHAIR-02-CORRECTION','TRAIN-SERVICE-CHAIR-03-INITIAL','TRAIN-SERVICE-CHAIR-03-CORRECTION','TRAIN-DAILY-CALM-01-INITIAL','TRAIN-DAILY-CALM-02-INITIAL','TRAIN-DAILY-CALM-03-INITIAL']
ORDER=[FULL[0],OLD[1],FULL[1],OLD[2],OLD[4]]
CAP={FULL[0]:3712,FULL[1]:3584,**{cid:2560 for cid in OLD}}
INITIAL_SHA='f4932d3a2bac1d8e78d0bf86579868e29546914512234d31556840eb28a85c19'

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def need(ok,reason):
    if not ok:raise ValueError(reason)
def load(name,p):
    s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);sys.modules[name]=m;s.loader.exec_module(m);return m
def write(p,v):
    p=Path(p);q=p.with_suffix(p.suffix+'.tmp');q.write_text(json.dumps(v,ensure_ascii=False,indent=2,allow_nan=False)+'\n');q.replace(p)
def owners():
    frozen=load('fixedrows_frozen_suffix',Path('/workspace/cocolon_suffix2_pack_20261029/run_suffix2.py'))
    _,prior,_,bound=frozen.validate(BUNDLE,INITIAL)
    helper=prior.module('fixedrows_immutable_helper',BUNDLE/'support/run_pilot.py')
    need(helper.adapter_hashes(INITIAL)['adapter_model.safetensors']==INITIAL_SHA,'initial_adapter_changed')
    plan=json.loads((HERE/'runtime_authorized_plan.json').read_text())
    need(plan['status']=='MASH_EXPLICITLY_APPROVED_ONCE_20261029' and plan['max_updates']==5 and plan['max_generations']==13 and plan['max_gpu_process_seconds']==2400 and plan['format']=='cocolon.cmee.fixed_rows_comparison.v1','approved_plan_changed')
    integration=json.loads(CPU.read_text());need(integration['status']=='CPU_FIXED_ROWS_INTEGRATION_PASSED' and integration['old9_full_outcome_and_receipt_unchanged'],'receiver_cpu_required')
    for p in [Path(__file__),HERE/'consume_fixed_rows5.py',HERE/'runtime_authorized_plan.json',HERE/'current_api_source_manifest.json',ROOT/'restore_payload.json',CPU,DERIVED/'train_messages.jsonl',DERIVED/'eval_inputs.json',DERIVED/'cpu_check.json']:
        bound[p]=sha(p)
    for item in json.loads((ROOT/'restore_payload.json').read_text())['files']:
        need(sha(ROOT/item['path'])==item['sha256'],'cmee_source_changed:'+item['path'])
        bound[ROOT/item['path']]=item['sha256']
    return plan,prior,helper,bound

def prepare():
    start=time.monotonic();plan,prior,helper,bound=owners()
    import torch
    from transformers import AutoTokenizer
    need(os.environ.get('CUDA_VISIBLE_DEVICES')=='' and not torch.cuda.is_initialized(),'cpu_only')
    need({n:importlib.metadata.version(n) for n in helper.PINS}==helper.PINS,'dependency_changed')
    tokenizer=AutoTokenizer.from_pretrained(helper.MODEL,revision=helper.REVISION,local_files_only=True,trust_remote_code=False)
    rows={r['id']:r for r in helper.read_jsonl(DERIVED/'train_messages.jsonl')}
    evals={r['case_id']:r for r in json.loads((DERIVED/'eval_inputs.json').read_text())}
    frozen={r['id']:r for r in helper.read_jsonl(BUNDLE/'archive/runtime/train_messages.jsonl')}
    encoded={};counts=[]
    comparison=json.loads((DERIVED/'cpu_check.json').read_text())
    for cid in FULL+OLD:
        need(rows[cid]['messages'][:-1]==evals[cid]['messages'],'train_eval_prefix_mismatch')
        item,prompt=helper.encode_training(tokenizer,rows[cid]['messages'],context=8192)
        need(item['labels'][:prompt]==[-100]*prompt and item['labels'][prompt:]==item['input_ids'][prompt:],'complete_assistant_ce_required')
        need(item['input_ids'][prompt:].count(tokenizer.eos_token_id)==1,'eos_supervision')
        need(prompt+CAP[cid]<=8192,'context_cap_changed')
        if cid in FULL:
            expected=next(x for x in comparison['cases'] if x['case_id']==cid)
            need(item==expected['encoded'] and prompt==expected['new_prompt_tokens'],'final_v2_token_or_mask_changed')
        else:
            olditem,_=helper.encode_training(tokenizer,frozen[cid]['messages'],context=8192)
            need(rows[cid]==frozen[cid] and olditem==item,'old9_changed')
        if cid in ORDER:encoded[cid]=item
        counts.append(dict(case_id=cid,prompt_tokens=prompt,total_tokens=len(item['input_ids']),supervised=sum(x!=-100 for x in item['labels']),cap=CAP[cid]))
    from safetensors.torch import load_file
    weights=load_file(str(INITIAL/'adapter_model.safetensors'),device='cpu')
    need(len(weights)==112 and all(t.dtype==torch.float32 and torch.isfinite(t).all() for t in weights.values()),'initial_112F32')
    need(all(sha(p)==h for p,h in bound.items()),'frozen_changed')
    report=dict(status='CPU_FIXED_ROWS5_READY_NO_MODEL',plan=plan,encoded=encoded,counts=counts,dependencies={n:importlib.metadata.version(n) for n in helper.PINS},frozen={str(p):h for p,h in bound.items()},seconds=time.monotonic()-start,model_loads=0,model_forwards=0,training_updates=0,generations=0)
    need(not (HERE/'prepared_cpu.json').exists(),'cpu_preparation_already_exists')
    write(HERE/'prepared_cpu.json',report)
    print(json.dumps({k:v for k,v in report.items() if k not in ('encoded','frozen','plan')}),flush=True)

def execute(source):
    plan,prior,helper,bound=owners();cpu=json.loads((HERE/'prepared_cpu.json').read_text())
    need(cpu['status']=='CPU_FIXED_ROWS5_READY_NO_MODEL' and cpu['plan']==plan,'prepared_cpu_changed')
    need(all(sha(p)==h for p,h in cpu['frozen'].items()),'preflight_identity_changed')
    need(len(source)==40 and all(c in '0123456789abcdef' for c in source),'source_commit_required')
    parent=(Path('/proc')/str(os.getppid())/'cmdline').read_bytes().split(bytes([0]))
    need(parent[0].rsplit(b'/',1)[-1]==b'timeout' and all(x in parent for x in (b'--signal=TERM',b'--kill-after=10s',b'2390s')),'parent_timeout_required')
    OUT.mkdir(exist_ok=False);start=time.monotonic();deadline=start+2400
    report=dict(status='STARTED_ONCE',plan=plan,source_commit=source,started_unix=time.time(),optimizer_steps_started=0,optimizer_steps_completed=0,training_forwards_completed=0,model_loads_started=0,model_loads_completed=0,model_calls_started=0,model_calls_completed=0,calls=[],product_credit=0,automatic_progression=False,retry=False)
    model=optimizer=trainable=initial=value=ids=labels=original_generate=generate=None
    def checkpoint():report['elapsed_seconds']=time.monotonic()-start;write(OUT/'run.json',report)
    def stop(*args):raise TimeoutError('fixedrows5_deadline_no_retry')
    signal.signal(signal.SIGALRM,stop);signal.signal(signal.SIGTERM,stop);signal.setitimer(signal.ITIMER_REAL,2400);checkpoint()
    try:
        need(os.environ.get('HF_HUB_OFFLINE')==os.environ.get('TRANSFORMERS_OFFLINE')=='1','offline_required')
        import torch
        from transformers import AutoTokenizer,StoppingCriteria,StoppingCriteriaList
        need({n:importlib.metadata.version(n) for n in helper.PINS}==helper.PINS,'dependency_changed')
        need(os.environ.get('RUNPOD_POD_ID')=='vgkm402msgroiu' and torch.cuda.device_count()==1,'pod_changed')
        report['gpu']=helper.gpu_profile(torch,{'minimum_free_gib':14});need(report['gpu']['name']=='NVIDIA RTX A5000','gpu_changed');torch.cuda.reset_peak_memory_stats()
        tokenizer=AutoTokenizer.from_pretrained(helper.MODEL,revision=helper.REVISION,local_files_only=True,trust_remote_code=False)
        recovery=prior.module('fixedrows_existing_owner',BUNDLE/'support/run_expanded15_recovery.py');recovery.OLDPACK=BUNDLE/'support';recovery.ORIGIN=BUNDLE/'archive/run'
        owner,_,_=recovery.owner_with_checked_suffixes()
        report['model_loads_started']=1;checkpoint()
        model,tensors=owner.load_expanded_adapter(helper,INITIAL,helper.adapter_hashes(INITIAL),trainable=True)
        report['model_loads_completed']=1;write(OUT/'initial_loaded_tensors.json',tensors);checkpoint()
        cases={c['case_id']:c for c in json.loads((DERIVED/'eval_inputs.json').read_text())}
        def evaluate(phase,cids,adapter):
            nonlocal original_generate,generate
            for cid in cids:
                need(time.monotonic()<deadline-5 and report['model_calls_started']<13,'deadline_or_call_limit')
                stop_at=min(deadline,time.monotonic()+180);triggered=False;original_generate=model.generate
                class Bounded(StoppingCriteria):
                    def __call__(self,*args,**kwargs):
                        nonlocal triggered
                        triggered=time.monotonic()>=stop_at;return triggered
                def generate(*args,**kwargs):
                    kwargs['stopping_criteria']=StoppingCriteriaList([*list(kwargs.get('stopping_criteria') or []),Bounded()]);return original_generate(*args,**kwargs)
                path=OUT/(phase+'_'+cid+'.jsonl');report['model_calls_started']+=1;checkpoint()
                with patch.object(model,'generate',generate):helper.evaluate(model,tokenizer,[cases[cid]],path,{'context_tokens':8192,'max_new_tokens':CAP[cid]},adapter_revision=adapter)
                raw=helper.read_jsonl(path)[0]
                report['calls'].append(dict(phase=phase,case_id=cid,path=path.name,raw_sha256=sha(path),adapter_sha256=adapter,eos_reached=raw['eos_reached'],output_tokens=raw['output_tokens'],seconds=raw['seconds'],timeout_triggered=triggered));report['model_calls_completed']+=1;checkpoint()
                need(not triggered and time.monotonic()<stop_at,'call_deadline_no_retry')
                original_generate=generate=None
        evaluate('before',FULL,INITIAL_SHA)
        checkpoint()
        before_out=OUT/'before_cmee'
        subprocess.run([sys.executable,'-B',str(HERE/'consume_fixed_rows5.py'),'--root',str(ROOT),'--run',str(OUT),'--phase','before','--out',str(before_out)],check=True,timeout=min(150,max(1,deadline-time.monotonic()-5)))
        before=json.loads((before_out/'diagnosis.json').read_text());report['before_full2']=before['full2'];checkpoint()
        if before['both_full_success']:
            report['status']='BEFORE2_SUCCESS_ZERO_UPDATES_CLOSED'
            report['initial_adapter_unchanged']=sha(INITIAL/'adapter_model.safetensors')==INITIAL_SHA
        else:
            trainable=[(n,p) for n,p in model.named_parameters() if p.requires_grad];need(len(trainable)==112,'trainable_scope')
            initial={n:p.detach().cpu().clone() for n,p in trainable}
            random.seed(20261024);torch.manual_seed(20261024);torch.cuda.manual_seed_all(20261024)
            model.config.use_cache=False;model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={'use_reentrant':False});model.enable_input_require_grads();model.train()
            optimizer=torch.optim.AdamW([p for _,p in trainable],lr=5e-5,weight_decay=0.)
            with (OUT/'training.jsonl').open('x') as stream:
                for step,cid in enumerate(ORDER,1):
                    need(time.monotonic()<deadline-5,'deadline_before_update');item=cpu['encoded'][cid]
                    ids=torch.tensor([item['input_ids']],dtype=torch.long,device='cuda:0');labels=torch.tensor([item['labels']],dtype=torch.long,device='cuda:0');optimizer.zero_grad(set_to_none=True)
                    value=helper.teacher_loss(model,input_ids=ids,attention_mask=torch.ones_like(ids),labels=labels,encoded=item);report['training_forwards_completed']=step;need(torch.isfinite(value).item(),'nonfinite_loss');value.backward()
                    norm=float(torch.nn.utils.clip_grad_norm_([p for _,p in trainable],1.,error_if_nonfinite=True).cpu());need(math.isfinite(norm) and norm>0,'gradient_invalid')
                    report['optimizer_steps_started']=step;checkpoint();optimizer.step();report['optimizer_steps_completed']=step
                    stream.write(json.dumps(dict(step=step,id=cid,loss=float(value.detach().cpu()),gradient_norm=norm,target_tokens=sum(x!=-100 for x in item['labels']),loss_type='complete_assistant_plus_eos_ce'))+'\n');stream.flush();ids=labels=value=None;checkpoint()
            optimizer.zero_grad(set_to_none=True);optimizer=None
            need(all(torch.isfinite(p).all().item() for _,p in trainable),'nonfinite_weights')
            report['changed_tensors']=sum(not torch.equal(initial[n],p.detach().cpu()) for n,p in trainable);need(report['changed_tensors']>0,'no_weight_change')
            model.save_pretrained(OUT/'adapter',safe_serialization=True);report['adapter_sha256']=helper.adapter_hashes(OUT/'adapter');checkpoint()
            model=trainable=initial=None;gc.collect();torch.cuda.empty_cache();report['model_loads_started']=2;checkpoint()
            model,tensors=owner.load_expanded_adapter(helper,OUT/'adapter',report['adapter_sha256'],trainable=False);report['model_loads_completed']=2;write(OUT/'reloaded_tensors.json',tensors);checkpoint()
            evaluate('after',FULL+OLD,report['adapter_sha256']['adapter_model.safetensors'])
            need(helper.adapter_hashes(OUT/'adapter')==report['adapter_sha256'],'weights_changed_during_inference')
            report['status']='RAW_COMPLETE_PENDING_AFTER_CMEE_AND_CONTENT_REVIEW'
    except BaseException as exc:
        report.update(status='STOPPED_NO_RETRY',error_type=type(exc).__name__,reason=str(exc),traceback=traceback.format_exc())
        if model is not None and report['optimizer_steps_started'] and 'adapter_sha256' not in report:
            try:
                optimizer=ids=labels=value=None;gc.collect();model.save_pretrained(OUT/'partial_adapter',safe_serialization=True);report['partial_adapter_not_adopted']=True
            except BaseException as save_error:report['partial_adapter_preservation_error']=str(save_error)
    finally:
        if 'torch' in sys.modules and sys.modules['torch'].cuda.is_initialized():
            report['peak_allocated_bytes']=sys.modules['torch'].cuda.max_memory_allocated();report['peak_reserved_bytes']=sys.modules['torch'].cuda.max_memory_reserved()
        original_generate=generate=model=optimizer=trainable=initial=value=ids=labels=None;gc.collect()
        if 'torch' in sys.modules and sys.modules['torch'].cuda.is_initialized():sys.modules['torch'].cuda.empty_cache();report['post_release_allocated_bytes']=sys.modules['torch'].cuda.memory_allocated()
        try:need(all(sha(p)==h for p,h in cpu['frozen'].items()),'frozen_changed');report['frozen_inputs_unchanged']=True
        except BaseException as exc:report.update(status='STOPPED_IDENTITY_UNVERIFIED_NO_RETRY',identity_error=str(exc))
        signal.setitimer(signal.ITIMER_REAL,0);report['processing_seconds']=time.monotonic()-start;report['process_cost_usd']=report['processing_seconds']*.28/3600;checkpoint()
    print(json.dumps({k:report.get(k) for k in ('status','model_loads_completed','optimizer_steps_completed','model_calls_completed','processing_seconds','process_cost_usd')}),flush=True)
    return 0 if report['status'] in ('BEFORE2_SUCCESS_ZERO_UPDATES_CLOSED','RAW_COMPLETE_PENDING_AFTER_CMEE_AND_CONTENT_REVIEW') else 1

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--prepare',action='store_true');p.add_argument('--execute',action='store_true');p.add_argument('--source-commit');a=p.parse_args()
    if a.prepare:prepare()
    elif a.execute:raise SystemExit(execute(a.source_commit))
