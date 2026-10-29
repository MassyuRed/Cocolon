"""Approved once: syntax-only generation, no training and no candidate repair."""
import argparse
import gc
import gzip
import hashlib
import importlib.metadata
import importlib.util
import json
import os
from pathlib import Path
import signal
import sys
import time
import traceback
from unittest.mock import patch

sys.dont_write_bytecode=True
W=Path('/workspace');HERE=Path(__file__).resolve().parent
OUT=W/'cocolon_syntax2_run_20261030'
CPU=W/'cocolon_syntax2_cpu_20261030'
INPUT=W/'cocolon_prior_rows2_cpu_20261029'
OLD_CPU=W/'cocolon_rehearsal13_cpu_20261029'
ADAPTER=W/'cocolon_rehearsal13_run_20261029/adapter'
PACK=W/'cocolon_fixedrows5_pack_20261029'
FULL=['FT-BOOK-AFTER-ANSWER','FT-SHOP-AFTER-ANSWER']
ADAPTER_SHA='114466411f36f0eef7a2dceaec7f5190544ac8545eb6b2f6a3d0446b70f90b66'

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def need(ok,reason):
    if not ok:raise ValueError(reason)
def write(p,value):
    p=Path(p);tmp=p.with_suffix(p.suffix+'.tmp')
    tmp.write_text(json.dumps(value,ensure_ascii=False,indent=2,allow_nan=False)+'\n');tmp.replace(p)
def load(name,path):
    s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);sys.modules[name]=m;s.loader.exec_module(m);return m

def execute(source):
    plan=json.loads((HERE/'plan.json').read_text())
    need(plan['status']=='MASH_EXPLICITLY_APPROVED_ONCE_20261030' and plan['max_generations']==2 and plan['max_updates']==0 and plan['max_model_loads']==1 and plan['max_process_seconds']==600,'approval_required')
    need(sha(__file__)==plan['runner_sha256'] and sha(HERE/'syntax2.py')==plan['syntax_sha256'],'source_changed')
    need(len(source)==40 and all(c in '0123456789abcdef' for c in source),'source_commit_required')
    parent=(Path('/proc')/str(os.getppid())/'cmdline').read_bytes().split(bytes([0]))
    need(parent[0].rsplit(b'/',1)[-1]==b'timeout' and all(t in parent for t in (b'--signal=TERM',b'--kill-after=10s',b'590s')),'600s_parent_timeout_required')
    checked=json.loads((CPU/'cpu.json').read_text())
    need(sha(CPU/'cpu.json')==plan['cpu_report_sha256'] and checked['status']=='CPU_SYNTAX2_PASSED_NO_MODEL','successful_cpu_required')
    need(checked['source_sha256']==plan['syntax_sha256'] and checked['checks']['syntax_valid_wrong_semantics_rejected_by_existing_cmee'] and len(checked['semantic_negatives'])==2,'cpu_negative_or_source_missing')
    need(sha(INPUT/'eval_inputs11.json')==plan['eval_inputs_sha256'] and sha(ADAPTER/'adapter_model.safetensors')==ADAPTER_SHA,'inputs_or_weights_changed')
    old=load('syntax2_frozen_runtime',PACK/'run_fixed_rows5.py');_,prior,helper,bound=old.owners()
    frozen=json.loads(gzip.decompress((OLD_CPU/'prepared_cpu.json.gz').read_bytes()))['frozen']
    need(all(sha(p)==h for p,h in frozen.items()) and all(sha(p)==h for p,h in bound.items()),'frozen_changed')
    # New exclusive output directory is the one-use execution lock.
    OUT.mkdir(exist_ok=False);started=time.monotonic();deadline=started+600
    report=dict(status='STARTED_ONCE',source_commit=source,started_unix=time.time(),plan=plan,model_loads_started=0,model_loads_completed=0,model_calls_started=0,model_calls_completed=0,optimizer_steps_completed=0,training_forwards_completed=0,calls=[],retry=False,automatic_progression=False,product_credit=0)
    model=engine=processor=original_generate=generate=None
    def checkpoint():report['elapsed_seconds']=time.monotonic()-started;write(OUT/'run.json',report)
    def stop(*_):raise TimeoutError('syntax2_deadline_no_retry')
    signal.signal(signal.SIGALRM,stop);signal.signal(signal.SIGTERM,stop);signal.setitimer(signal.ITIMER_REAL,600);checkpoint()
    try:
        need(os.environ.get('HF_HUB_OFFLINE')==os.environ.get('TRANSFORMERS_OFFLINE')=='1','offline_required')
        import torch
        from transformers import AutoTokenizer,LogitsProcessorList,StoppingCriteria,StoppingCriteriaList
        need({n:importlib.metadata.version(n) for n in helper.PINS}==helper.PINS,'dependencies_changed')
        need(os.environ.get('RUNPOD_POD_ID')=='vgkm402msgroiu' and torch.cuda.device_count()==1,'pod_changed')
        report['gpu']=helper.gpu_profile(torch,{'minimum_free_gib':14});need(report['gpu']['name']=='NVIDIA RTX A5000','gpu_changed');torch.cuda.reset_peak_memory_stats()
        tokenizer=AutoTokenizer.from_pretrained(helper.MODEL,revision=helper.REVISION,local_files_only=True,trust_remote_code=False)
        syntax=load('syntax2_runtime',HERE/'syntax2.py');engine=syntax.TokenMask(tokenizer)
        report['syntax_build_seconds']=engine.build_seconds;checkpoint()
        recovery=prior.module('syntax2_existing_adapter_owner',old.BUNDLE/'support/run_expanded15_recovery.py');recovery.OLDPACK=old.BUNDLE/'support';recovery.ORIGIN=old.BUNDLE/'archive/run'
        owner,_,_=recovery.owner_with_checked_suffixes()
        need(helper.adapter_hashes(ADAPTER)==plan['adapter_files_sha256'],'adapter_files_changed')
        report['model_loads_started']=1;checkpoint()
        model,tensors=owner.load_expanded_adapter(helper,ADAPTER,plan['adapter_files_sha256'],trainable=False)
        need(not model.training and not any(p.requires_grad for p in model.parameters()),'nontraining_model_required')
        report['model_loads_completed']=1;write(OUT/'loaded_tensors.json',tensors);checkpoint()
        cases=json.loads((INPUT/'eval_inputs11.json').read_text())[:2]
        need([c['case_id'] for c in cases]==FULL and [c['max_new_tokens'] for c in cases]==[3712,3584],'cases_changed')
        for case in cases:
            need(report['model_calls_started']<2 and time.monotonic()<deadline-5,'global_limit')
            stop_at=min(deadline,time.monotonic()+180);triggered=False;original_generate=model.generate
            signal.setitimer(signal.ITIMER_REAL,max(.001,stop_at-time.monotonic()))
            class Bounded(StoppingCriteria):
                def __call__(self,*args,**kwargs):
                    nonlocal triggered
                    triggered=time.monotonic()>=stop_at;return triggered
            def generate(*args,**kwargs):
                nonlocal processor
                need(processor is None,'one_generate_per_case_required')
                ids=kwargs.get('input_ids',args[0] if args else None)
                need(ids is not None and ids.shape[0]==1,'input_ids_required')
                processor=syntax.SyntaxProcessor(engine,ids.shape[1])
                kwargs['logits_processor']=LogitsProcessorList([*list(kwargs.get('logits_processor') or []),processor])
                kwargs['stopping_criteria']=StoppingCriteriaList([*list(kwargs.get('stopping_criteria') or []),Bounded()])
                return original_generate(*args,**kwargs)
            path=OUT/('before_'+case['case_id']+'.jsonl');report['model_calls_started']+=1;checkpoint()
            with patch.object(model,'generate',generate):
                helper.evaluate(model,tokenizer,[case],path,{'context_tokens':8192,'max_new_tokens':case['max_new_tokens']},adapter_revision=ADAPTER_SHA)
            raw=helper.read_jsonl(path)[0];report['model_calls_completed']+=1
            need(raw['finish_reason'] not in ('error','timeout') and not raw.get('provider_error'),'generation_or_processor_error_no_next_call')
            final=syntax.State().feed(raw['raw_text'].encode())
            report['calls'].append(dict(phase='before',case_id=case['case_id'],path=path.name,raw_sha256=sha(path),adapter_sha256=ADAPTER_SHA,eos_reached=raw['eos_reached'],output_tokens=raw['output_tokens'],seconds=raw['seconds'],timeout_triggered=triggered,complete_syntax_root=bool(final is not None and final.complete),mask_calls=len(processor.latencies),mask_total_seconds=sum(processor.latencies),mask_max_seconds=max(processor.latencies)));checkpoint()
            need(not triggered and time.monotonic()<stop_at,'per_call_timeout_no_retry')
            need(not raw['eos_reached'] or (final is not None and final.complete),'eos_on_incomplete_syntax')
            processor=original_generate=generate=None
            signal.setitimer(signal.ITIMER_REAL,max(.001,deadline-time.monotonic()))
        need(helper.adapter_hashes(ADAPTER)==plan['adapter_files_sha256'],'weights_changed')
        report.update(status='RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW',adapter_unchanged=True)
    except BaseException as exc:
        report.update(status='STOPPED_NO_RETRY',reason=str(exc),error_type=type(exc).__name__,traceback=traceback.format_exc())
        if processor is not None:
            report['partial_mask_calls']=len(processor.latencies)
            report['partial_generated_tokens_observed_by_processor']=processor.seen
            write(OUT/'partial_observed_not_candidate.json',{'token_ids':processor.observed_token_ids,'raw_bytes_hex':b''.join(processor.engine.data[t] for t in processor.observed_token_ids if t in processor.engine.data).hex(),'status':'INCOMPLETE_CALLBACK_OBSERVATION_NOT_CANDIDATE','may_omit_last_sampled_token':True})
    finally:
        processor=original_generate=generate=model=engine=None;gc.collect()
        if 'torch' in sys.modules and sys.modules['torch'].cuda.is_initialized():
            t=sys.modules['torch'];report['peak_allocated_bytes']=t.cuda.max_memory_allocated();report['peak_reserved_bytes']=t.cuda.max_memory_reserved();t.cuda.empty_cache();report['post_release_allocated_bytes']=t.cuda.memory_allocated()
        try:
            need(all(sha(p)==h for p,h in frozen.items()) and all(sha(p)==h for p,h in bound.items()) and helper.adapter_hashes(ADAPTER)==plan['adapter_files_sha256'],'frozen_or_weights_changed');report['frozen_inputs_unchanged']=True
        except BaseException as exc:report.update(status='STOPPED_IDENTITY_UNVERIFIED_NO_RETRY',identity_error=str(exc))
        signal.setitimer(signal.ITIMER_REAL,0);report['processing_seconds']=time.monotonic()-started;report['process_cost_usd']=report['processing_seconds']*.28/3600;checkpoint()
    print(json.dumps({k:report.get(k) for k in ('status','model_loads_completed','model_calls_completed','optimizer_steps_completed','processing_seconds','process_cost_usd')}),flush=True)
    return 0 if report['status']=='RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW' else 1

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--execute',action='store_true');p.add_argument('--source-commit');a=p.parse_args()
    if not a.execute:p.error('explicit --execute required')
    raise SystemExit(execute(a.source_commit))
