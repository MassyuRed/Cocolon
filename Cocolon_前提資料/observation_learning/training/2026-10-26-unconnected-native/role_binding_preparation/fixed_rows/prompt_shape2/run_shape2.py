"""One separately approved inference-only check of the two corrected prompts."""
import argparse
import gc
import hashlib
import importlib.util
import importlib.metadata
import json
import os
from pathlib import Path
import signal
import sys
import time
import traceback
from unittest.mock import patch

sys.dont_write_bytecode=True
W=Path('/workspace')
HERE=Path(__file__).resolve().parent
OUT=W/'cocolon_shape2_run_20261029'
CPU=W/'cocolon_shape2_cpu_20261029'
PACK=W/'cocolon_fixedrows5_pack_20261029'
FULL=['FT-BOOK-AFTER-ANSWER','FT-SHOP-AFTER-ANSWER']

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def write(p,v):
    p=Path(p);q=p.with_suffix(p.suffix+'.tmp');q.write_text(json.dumps(v,ensure_ascii=False,indent=2,allow_nan=False)+'\n');q.replace(p)
def need(ok,reason):
    if not ok:raise ValueError(reason)
def load(name,p):
    s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);sys.modules[name]=m;s.loader.exec_module(m);return m

def execute(source):
    plan=json.loads((HERE/'plan.json').read_text())
    need(plan['status']=='MASH_EXPLICITLY_APPROVED_ONCE' and plan['max_model_loads']==1 and plan['max_generations']==2 and plan['max_updates']==0 and plan['max_process_seconds']==600,'separate_approval_required')
    need(len(source)==40 and all(c in '0123456789abcdef' for c in source),'source_commit_required')
    parent=(Path('/proc')/str(os.getppid())/'cmdline').read_bytes().split(bytes([0]))
    need(parent[0].rsplit(b'/',1)[-1]==b'timeout' and all(x in parent for x in (b'--signal=TERM',b'--kill-after=10s',b'590s')),'600s_parent_timeout_required')
    cpu=json.loads((CPU/'cpu_check.json').read_text())
    need(cpu['status']=='CPU_SHAPE2_PASSED_NO_MODEL' and all(sha(p)==h for p,h in cpu['frozen'].items()),'cpu_or_frozen_identity_changed')
    need(sha(CPU/'cpu_check.json')==plan['cpu_report_sha256'] and sha(CPU/'eval_inputs2.json')==plan['eval_inputs_sha256'],'approved_input_changed')
    old=load('shape2_frozen_runtime',PACK/'run_fixed_rows5.py');_,prior,helper,bound=old.owners()
    need(all(sha(p)==h for p,h in bound.items()),'frozen_source_changed')
    # Exclusive directory is the one-run lock. It is never reused after success/failure.
    OUT.mkdir(exist_ok=False)
    started=time.monotonic();deadline=started+600
    report=dict(status='STARTED_ONCE',plan=plan,source_commit=source,started_unix=time.time(),model_loads_started=0,model_loads_completed=0,optimizer_steps_completed=0,training_forwards_completed=0,model_calls_started=0,model_calls_completed=0,calls=[],retry=False,automatic_progression=False,product_credit=0)
    model=generate=original_generate=None
    def checkpoint():report['elapsed_seconds']=time.monotonic()-started;write(OUT/'run.json',report)
    def stop(*args):raise TimeoutError('shape2_deadline_no_retry')
    signal.signal(signal.SIGALRM,stop);signal.signal(signal.SIGTERM,stop);signal.setitimer(signal.ITIMER_REAL,600);checkpoint()
    try:
        need(os.environ.get('HF_HUB_OFFLINE')==os.environ.get('TRANSFORMERS_OFFLINE')=='1','offline_required')
        import torch
        from transformers import AutoTokenizer,StoppingCriteria,StoppingCriteriaList
        need({n:importlib.metadata.version(n) for n in helper.PINS}==helper.PINS,'dependency_changed')
        need(os.environ.get('RUNPOD_POD_ID')=='vgkm402msgroiu' and torch.cuda.device_count()==1,'pod_changed')
        report['gpu']=helper.gpu_profile(torch,{'minimum_free_gib':14});need(report['gpu']['name']=='NVIDIA RTX A5000','gpu_changed');torch.cuda.reset_peak_memory_stats()
        tokenizer=AutoTokenizer.from_pretrained(helper.MODEL,revision=helper.REVISION,local_files_only=True,trust_remote_code=False)
        recovery=prior.module('shape2_adapter_owner',old.BUNDLE/'support/run_expanded15_recovery.py');recovery.OLDPACK=old.BUNDLE/'support';recovery.ORIGIN=old.BUNDLE/'archive/run'
        owner,_,_=recovery.owner_with_checked_suffixes()
        report['model_loads_started']=1;checkpoint()
        model,tensors=owner.load_expanded_adapter(helper,old.INITIAL,helper.adapter_hashes(old.INITIAL),trainable=False)
        need(not model.training and not any(p.requires_grad for p in model.parameters()),'nontraining_load_required')
        report['model_loads_completed']=1;write(OUT/'loaded_tensors.json',tensors);checkpoint()
        cases=json.loads((CPU/'eval_inputs2.json').read_text());need([c['case_id'] for c in cases]==FULL,'case_order_changed')
        for case in cases:
            need(report['model_calls_started']<2 and time.monotonic()<deadline-5,'call_or_global_limit')
            stop_at=min(deadline,time.monotonic()+180);triggered=False;original_generate=model.generate
            class Bounded(StoppingCriteria):
                def __call__(self,*args,**kwargs):
                    nonlocal triggered
                    triggered=time.monotonic()>=stop_at;return triggered
            def generate(*args,**kwargs):
                kwargs['stopping_criteria']=StoppingCriteriaList([*list(kwargs.get('stopping_criteria') or []),Bounded()]);return original_generate(*args,**kwargs)
            path=OUT/('before_'+case['case_id']+'.jsonl');report['model_calls_started']+=1;checkpoint()
            with patch.object(model,'generate',generate):
                helper.evaluate(model,tokenizer,[case],path,{'context_tokens':8192,'max_new_tokens':case['max_new_tokens']},adapter_revision=old.INITIAL_SHA)
            raw=helper.read_jsonl(path)[0];report['model_calls_completed']+=1
            report['calls'].append(dict(phase='before',case_id=case['case_id'],path=path.name,raw_sha256=sha(path),adapter_sha256=old.INITIAL_SHA,eos_reached=raw['eos_reached'],output_tokens=raw['output_tokens'],seconds=raw['seconds'],timeout_triggered=triggered));checkpoint()
            need(not triggered and time.monotonic()<stop_at,'per_call_timeout_no_retry')
            generate=original_generate=None
        need(sha(old.INITIAL/'adapter_model.safetensors')==old.INITIAL_SHA,'adapter_changed')
        report.update(status='RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW',initial_adapter_unchanged=True)
    except BaseException as exc:
        report.update(status='STOPPED_NO_RETRY',error_type=type(exc).__name__,reason=str(exc),traceback=traceback.format_exc())
    finally:
        generate=original_generate=model=None;gc.collect()
        if 'torch' in sys.modules and sys.modules['torch'].cuda.is_initialized():
            t=sys.modules['torch'];report['peak_allocated_bytes']=t.cuda.max_memory_allocated();report['peak_reserved_bytes']=t.cuda.max_memory_reserved();t.cuda.empty_cache();report['post_release_allocated_bytes']=t.cuda.memory_allocated()
        try:need(all(sha(p)==h for p,h in cpu['frozen'].items()),'frozen_changed');report['frozen_inputs_unchanged']=True
        except BaseException as exc:report.update(status='STOPPED_IDENTITY_UNVERIFIED_NO_RETRY',identity_error=str(exc))
        signal.setitimer(signal.ITIMER_REAL,0);report['processing_seconds']=time.monotonic()-started;report['process_cost_usd']=report['processing_seconds']*.28/3600;checkpoint()
    print(json.dumps({k:report.get(k) for k in ('status','model_loads_completed','model_calls_completed','optimizer_steps_completed','processing_seconds','process_cost_usd')}),flush=True)
    return 0 if report['status']=='RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW' else 1

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--execute',action='store_true');p.add_argument('--source-commit');a=p.parse_args()
    if not a.execute:p.error('explicit --execute and separate Mash approval required')
    raise SystemExit(execute(a.source_commit))
