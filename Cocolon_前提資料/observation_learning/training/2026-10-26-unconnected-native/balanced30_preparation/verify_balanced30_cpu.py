"""Jupyter CPU verification only: actual tokenizer and small synthetic logits.

Never loads base/adapter weights, trains, generates, adopts CMEE, or uses SQL.
"""
import argparse, copy, hashlib, importlib.util, inspect, json, math, os
from pathlib import Path
import sys, time, types, unittest

def require(ok, reason):
    if not ok:
        raise ValueError(reason)

def load(name, path):
    spec=importlib.util.spec_from_file_location(name,path)
    result=importlib.util.module_from_spec(spec)
    sys.modules[name]=result
    spec.loader.exec_module(result)
    return result

def main(pack):
    started=time.monotonic()
    require(os.environ.get('CUDA_VISIBLE_DEVICES')=='','CPU_ONLY_REQUIRED')
    require(os.environ.get('HF_HUB_OFFLINE')==os.environ.get('TRANSFORMERS_OFFLINE')=='1','OFFLINE_REQUIRED')
    sys.path.insert(0,str(pack))
    runner=load('balanced30_candidate',pack/'run_native15_balanced30.py')
    plan=runner.validate_successor(pack)
    require(plan['gpu_run_authorized'] is False and plan['approval_basis'] is None,'PENDING_REQUIRED')
    before=runner.OUTPUT.exists()
    try:
        runner.execute(pack,'a'*40)
    except ValueError as exc:
        require(str(exc)=='execute_refused_mash_approval_pending','WRONG_EXECUTE_REFUSAL')
    else:
        raise AssertionError('PENDING_EXECUTE_ACCEPTED')
    require(runner.OUTPUT.exists()==before,'PENDING_CREATED_OUTPUT')
    _,helper,_,tokenizer,rows,_,encoded,check=runner.prepare(pack)
    suite=unittest.defaultTestLoader.discover(str(pack),pattern='test_candidate_focus_loss.py')
    result=unittest.TextTestRunner(verbosity=1).run(suite)
    require(result.wasSuccessful(),'SPAN_TEST_FAILED')
    import torch
    from torch.nn import functional as F
    from transformers.loss.loss_utils import ForCausalLMLoss
    hf_source=inspect.getsource(ForCausalLMLoss)
    require('logits = logits.float()' in hf_source and 'labels[..., 1:]' in hf_source,'PINNED_HF_SHIFT_DTYPE_CHANGED')
    ce_results=[]
    torch.manual_seed(71)
    class FakeModel(torch.nn.Module):
        def __init__(self, values):
            super().__init__();self.values=torch.nn.Parameter(values.clone());self.calls=0
        def forward(self, *, input_ids, attention_mask, labels, logits_to_keep, use_cache):
            self.calls+=1
            logits=self.values[:,-logits_to_keep:,:]
            loss=ForCausalLMLoss(logits,labels,logits.shape[-1]) if labels is not None else None
            return types.SimpleNamespace(logits=logits,loss=loss)
    for dtype in (torch.float32,torch.bfloat16):
        ids=torch.tensor([[3,2,1,4,5,6,7,8,9,10,11,12,13,14,15]],dtype=torch.long)
        prefix=3;labels=ids.clone();labels[:,:prefix]=-100
        e={'input_ids':ids[0].tolist(),'labels':labels[0].tolist()}
        count=ids.shape[1]-prefix
        values=torch.randn(1,ids.shape[1],23).to(dtype)
        model=FakeModel(values);e['focus_weights']=[1/count]*count
        old=helper.teacher_loss(model,input_ids=ids,attention_mask=torch.ones_like(ids),labels=labels,encoded=e)
        old.backward();old_grad=model.values.grad.detach().clone();model.values.grad=None;model.calls=0
        uniform=runner.balanced_teacher_loss(model,input_ids=ids,attention_mask=torch.ones_like(ids),labels=labels,encoded=e)
        uniform.backward();uniform_grad=model.values.grad.detach().clone()
        tol=1e-6 if dtype==torch.float32 else 0.002
        require(torch.allclose(old,uniform,atol=1e-6,rtol=1e-6),'UNIFORM_VALUE_MISMATCH')
        require(torch.allclose(old_grad,uniform_grad,atol=tol,rtol=tol),'UNIFORM_GRADIENT_MISMATCH')
        require(model.calls==1,'MORE_THAN_ONE_FORWARD')
        model.values.grad=None;model.calls=0
        groups=[[0,1,2,3,4],[6,7],[9,10]]
        weights=[.5/count]*count
        for group in groups:
            for i in group:weights[i]+=.5/len(groups)/len(group)
        e['focus_weights']=weights
        actual=runner.balanced_teacher_loss(model,input_ids=ids,attention_mask=torch.ones_like(ids),labels=labels,encoded=e)
        actual.backward();actual_grad=model.values.grad.detach().clone();model.values.grad=None
        ce=F.cross_entropy(model.values[:,prefix-1:-1,:].float().reshape(-1,23),ids[:,prefix:].reshape(-1),reduction='none')
        independent=.5*ce.mean()+.5*sum(ce[group].mean() for group in groups)/len(groups)
        independent.backward()
        require(torch.allclose(actual,independent,atol=1e-6,rtol=1e-6),'WEIGHTED_GROUP_MEAN_VALUE_MISMATCH')
        require(torch.allclose(actual_grad,model.values.grad,atol=tol,rtol=tol),'WEIGHTED_GROUP_MEAN_GRADIENT_MISMATCH')
        require(model.calls==1,'WEIGHTED_MORE_THAN_ONE_FORWARD')
        require(bool((actual_grad[:,:prefix-1,:]==0).all()) and bool((actual_grad[:,-1,:]==0).all()),'SHIFT_INCLUDED_PROMPT_OR_LAST_LOGIT')
        ce_results.append({'dtype':str(dtype),'uniform_value_matches_old_hf':True,'uniform_gradient_matches_old_hf':True,'weighted_value_and_gradient_match_independent_group_means':True,'one_forward':True,'prompt_and_last_logit_gradient_zero':True,'uniform_abs_error':float(abs(old-uniform)),'weighted_abs_error':float(abs(actual-independent))})
    from candidate_focus_loss import build_focus_token_weights
    focus=[]
    for row,item in zip(rows,encoded,strict=True):
        st=item['focus_stats'];n=st['full_target_tokens'];counts=st['group_token_counts']
        groups=build_focus_token_weights(tokenizer,item,st['prompt_tokens'],row['messages'][-1]['content'])['groups']
        mass={k:sum(item['focus_weights'][i-st['prompt_tokens']] for i in indexes) for k,indexes in groups.items()}
        focus.append({'id':row['id'],'full_target_tokens':n,'group_token_counts':counts,'old_full_mean_mass':{k:v/n for k,v in counts.items()},'new_balanced_mass':mass})
    report={'status':'CPU_BALANCED30_VERIFIED_NO_MODEL_LOAD','span_unit_tests':result.testsRun,'actual_tokenizer_rows':len(rows),'runner_check':check,'allocation':focus,'synthetic_ce':ce_results,'hf_loss_source_sha256':hashlib.sha256(hf_source.encode()).hexdigest(),'gpu_run_authorized':False,'pending_execute_refused_before_effects':True,'model_weights_loaded':0,'pretrained_model_forwards':0,'synthetic_cpu_model_calls':6,'training_updates':0,'generations':0,'cmee_adoptions':0,'sql_operations':0,'seconds':time.monotonic()-started}
    out=pack/'actual_cpu_check.json';out.write_text(json.dumps(report,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
    print(json.dumps({k:v for k,v in report.items() if k not in ('runner_check','allocation')},ensure_ascii=False),flush=True)

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--pack',type=Path,required=True)
    main(parser.parse_args().pack.resolve())
