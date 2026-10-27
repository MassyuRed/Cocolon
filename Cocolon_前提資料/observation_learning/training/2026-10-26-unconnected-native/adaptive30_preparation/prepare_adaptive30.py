"""CPU-only check of unchanged teachers and the new learning objective; no model load."""
import argparse, hashlib, importlib.util, json, math, os, sys, time, types
from pathlib import Path
sys.dont_write_bytecode = True
OLDPACK = Path('/workspace/cocolon_localized30_pack_20261027')
DIAGNOSTIC = Path('/workspace/cocolon_109c_token_diagnostic_run_20261027')

def require(ok, code):
    if not ok: raise ValueError(code)
def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(name, p):
    spec=importlib.util.spec_from_file_location(name,p); m=importlib.util.module_from_spec(spec); sys.modules[name]=m; spec.loader.exec_module(m); return m
def dump(p, value): Path(p).write_text(json.dumps(value,ensure_ascii=False,indent=2,allow_nan=False)+'\n')

def prepare(pack):
    started=time.monotonic()
    require(os.environ.get('CUDA_VISIBLE_DEVICES')=='' and os.environ.get('HF_HUB_OFFLINE')==os.environ.get('TRANSFORMERS_OFFLINE')=='1','cpu_offline_required')
    require(not (pack/'actual_cpu_check.json').exists(),'cpu_check_already_exists')
    import torch
    require(not torch.cuda.is_initialized(),'cuda_initialized')
    old=module('adaptive_readonly_predecessor',OLDPACK/'run_localized30.py')
    parts=old.prepare(OLDPACK)
    _, oldcpu, _, _, helper, _, tok, rows, cases, encoded, _, _=parts
    require(len(rows)==len(cases)==len(encoded)==15,'teacher_count')
    loss=module('adaptive_loss_cpu',pack/'adaptive_loss.py')
    stats=[]
    diagnostics={}
    for i,(row,case,e) in enumerate(zip(rows,cases,encoded,strict=True)):
        target=[x for x in e['labels'] if x!=-100]
        prefix=len(e['input_ids'])-len(target)
        require(e['labels'][:prefix]==[-100]*prefix and target==e['input_ids'][prefix:],'target_mask')
        require(helper.chat_token_ids(tok,case['messages'],generation_prompt=True)==e['input_ids'][:prefix],'train_eval_prefix')
        require(row['messages'][:-1]==case['messages'] and len(target)<=case['max_new_tokens'] and prefix+case['max_new_tokens']<=8192,'context_or_gold_leak')
        require(tok.eos_token_id in target,'eos_not_target')
        report_path=DIAGNOSTIC/(row['id']+'.json'); d=json.loads(report_path.read_text()); diagnostics[str(report_path)]=sha(report_path)
        require([x['gold_id'] for x in d['tokens']]==target,'diagnostic_target_mismatch')
        values=torch.tensor([x['nll'] for x in d['tokens']],dtype=torch.float64)
        weights=loss.normalized_weights(values) if i>=9 else torch.ones_like(values)/len(values)
        fixed=set(parts[10][row['id']])
        static=torch.tensor([16. if j in fixed else 1. for j in range(len(target))],dtype=torch.float64)
        static=static/static.sum()
        require(torch.isfinite(weights).all().item() and (weights>0).all().item() and abs(float(weights.sum())-1)<1e-12,'weight_normalization')
        fields={}
        wrong=set(d['wrong_target_indices'])
        for j,t in enumerate(d['tokens']):
            item=fields.setdefault(t['field'],dict(tokens=0,nll_sum=0.,adaptive_mass=0.,static198_mass=0.,uniform_mass=0.))
            item['tokens']+=1;item['nll_sum']+=float(values[j]);item['adaptive_mass']+=float(weights[j]);item['static198_mass']+=float(static[j]);item['uniform_mass']+=1/len(target)
        stats.append(dict(id=row['id'],adaptive=i>=9,prompt_tokens=prefix,target_tokens=len(target),prompt_plus_cap=prefix+case['max_new_tokens'],teacher_utf8_sha256=hashlib.sha256(row['messages'][-1]['content'].encode()).hexdigest(),target_ids_sha256=hashlib.sha256(json.dumps(target,separators=(',',':')).encode()).hexdigest(),eos_retained=True,eos_target_indices=[j for j,x in enumerate(target) if x==tok.eos_token_id],wrong_tokens=len(wrong),old109c_wrong_mass=sum(float(weights[j]) for j in wrong),static198_wrong_mass=sum(float(static[j]) for j in wrong),min_coefficient=float(weights.min()),max_coefficient=float(weights.max()),fields=fields))
    # Causal alignment and gradient coefficients, including a hard last/EOS position.
    logits=torch.tensor([[8.,0.,0.],[0.,0.,0.],[0.,8.,0.],[1.,0.,2.]],requires_grad=True)
    gold=torch.tensor([0,0,0,0]); ce=torch.nn.functional.cross_entropy(logits,gold,reduction='none')
    w=loss.normalized_weights(ce);require(not w.requires_grad and float(w[2])>float(w[0]),'weights_not_detached_or_not_adaptive')
    got=loss.loss_from_logits(logits,gold); expected=(w*ce).sum()
    grad=torch.autograd.grad(got,logits,retain_graph=True)[0];manual=torch.autograd.grad(expected,logits)[0]
    require(torch.equal(grad,manual) and torch.isfinite(grad).all().item(),'weighted_gradient')
    for v in (torch.zeros(5),torch.full((5,),2.),torch.tensor([0.,1e-20,1000.])):
        z=loss.normalized_weights(v);require(torch.isfinite(z).all().item() and (z>0).all().item() and abs(float(z.sum())-1)<1e-6,'weight_extreme')
    class TinyHelper:
        @staticmethod
        def assistant_loss_window(e): return 2,5
        @staticmethod
        def teacher_loss(*a,**kw): return 'OLD9_OWNER_CALLED'
    class Tiny:
        def __init__(self): self.calls=0;self.logits=torch.arange(21,dtype=torch.float32).reshape(1,7,3).requires_grad_()
        def __call__(self,**kw):
            self.calls+=1;require(kw['logits_to_keep']==5 and kw['use_cache'] is False and 'labels' not in kw,'tiny_contract');return types.SimpleNamespace(logits=self.logits[:,-5:,:])
    tiny=Tiny(); labels=torch.tensor([[-100,-100,-100,0,1,2,0]])
    answer=loss.teacher_loss(tiny,TinyHelper,input_ids=torch.zeros((1,7),dtype=torch.long),attention_mask=torch.ones((1,7)),labels=labels,encoded={},adaptive=True)
    direct=loss.loss_from_logits(tiny.logits[0,2:6,:],torch.tensor([0,1,2,0]))
    require(tiny.calls==1 and torch.equal(answer,direct),'causal_shift_or_forward_count')
    tg=torch.autograd.grad(answer,tiny.logits)[0];require((tg[:,:2]==0).all().item() and (tg[:,6:]==0).all().item() and (tg[:,5]!=0).any().item(),'prompt_or_eos_gradient')
    require(loss.teacher_loss(None,TinyHelper,input_ids=None,attention_mask=None,labels=None,encoded=None,adaptive=False)=='OLD9_OWNER_CALLED','old9_owner_changed')
    require(not torch.cuda.is_initialized(),'cuda_initialized_after_cpu')
    payload={n:sha(pack/n) for n in ('adaptive_loss.py','prepare_adaptive30.py','run_adaptive30.py')}
    result=dict(status='CPU_ADAPTIVE30_PREPARED_GPU_NOT_AUTHORIZED',seconds=time.monotonic()-started,cases=stats,total_target_tokens=sum(x['target_tokens'] for x in stats),adaptive_target_tokens=sum(x['target_tokens'] for x in stats if x['adaptive']),teacher_messages_sha256=sha(OLDPACK/'train_messages.jsonl'),eval_inputs_sha256=sha(OLDPACK/'eval_inputs.jsonl'),old_cpu_check_sha256=sha(OLDPACK/'actual_cpu_check.json'),old_runner_sha256=sha(OLDPACK/'run_localized30.py'),payload_sha256=payload,diagnostic_sha256=diagnostics,reference_logits_adapter='109c_with_pre_localized_prompt; allocation_simulation_only',checks=dict(causal_shift=True,prompt_excluded=True,eos_retained=True,finite_detached_weights_and_gradients=True,extreme_confidence=True,old9_original_owner=True,single_forward=True),model_loads=0,model_forwards=0,training_updates=0,generations=0,sql_operations=0,cuda_initialized=False,product_credit=0,automatic_progression=False)
    dump(pack/'actual_cpu_check.json',result)
    plan=json.loads((pack/'adaptive30.plan.json').read_text());require(plan['status']=='PREPARED_AWAITING_MASH_APPROVAL' and plan['gpu_run_authorized'] is False and plan['approval_basis'] is None and plan['cpu_check_sha256'] is None,'plan_must_be_pending')
    plan['cpu_check_sha256']=sha(pack/'actual_cpu_check.json');dump(pack/'adaptive30.plan.json',plan)
    runner=module('adaptive_pending_runner',pack/'run_adaptive30.py');runner.validate_plan(pack)
    require(not runner.OUTPUT.exists(),'new_output_preexists')
    try:runner.execute(pack,'0'*40)
    except ValueError as exc:require(str(exc)=='execute_refused_new_adaptive30_approval_pending','pending_execute_wrong_refusal')
    else:raise AssertionError('pending_execute_allowed')
    require(not runner.OUTPUT.exists(),'pending_execute_created_output')
    dump(pack/'pending_execution_check.json',dict(status='REFUSED_BEFORE_OUTPUT_AND_MODEL',output_absent=True,model_loads=0,forwards=0,updates=0,generations=0))
    print(json.dumps({k:v for k,v in result.items() if k not in ('cases','diagnostic_sha256','payload_sha256')},ensure_ascii=False),flush=True)

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--pack',type=Path,required=True);a=p.parse_args();prepare(a.pack.resolve())
