from pathlib import Path
import copy, hashlib, importlib.util, json, math, sys

sys.dont_write_bytecode=True
p=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('joint',p/'run_quote_joint_fit.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
plan=json.loads((p/'joint_fit12.plan.json').read_text())
cpu=json.loads((p/'joint_fit12_tokenization.json').read_text())
checks=[]
def check(name,fn):
    fn();checks.append(dict(name=name,passed=True))
def need(condition):
    assert condition
def rejects(fn,code):
    try:fn()
    except ValueError as ex:assert str(ex)==code
    else:raise AssertionError('did_not_reject:'+code)
check('unapproved_candidate_valid_for_cpu_only',lambda:need(m.validate_plan(plan,authorized=False) is plan))
check('unapproved_gpu_rejected',lambda:rejects(lambda:m.validate_plan(plan),'plan_not_authorized'))
for key,value in [('max_optimizer_steps',13),('daily_full_loss_weight',0.0),('daily_surface_loss_weight',1.0),('initial_adapter_sha256','0'*64)]:
    changed=copy.deepcopy(plan);changed[key]=value
    check('changed_'+key+'_rejected',lambda:rejects(lambda:m.validate_plan(changed,authorized=False),'fixed_plan_mismatch:'+key))
check('source_hash_fixed',lambda:need(plan['runner_sha256']==hashlib.sha256((p/'run_quote_joint_fit.py').read_bytes()).hexdigest()))
check('real_tokenizer_all9_no_model_no_truncation',lambda:need(cpu['token_counter_is_stub'] is False and cpu['model_calls']==cpu['training_updates']==0 and len(cpu['rows'])==9 and max(r['prompt_tokens']+2560 for r in cpu['rows'])<=8192))
check('full_json_and_eos_supervised_for_all9',lambda:need(len(cpu['full_loss_windows'])==9 and all(x['eos_trained'] is True and x['loss_tokens']==r['assistant_eos_tokens'] for x,r in zip(cpu['full_loss_windows'],cpu['rows'],strict=True))))
check('same_surface25_and_fixed12_order',lambda:need(len(cpu['surface_masks'])==3 and all(x['loss_tokens']==25 and x['observation_tokens']==9 and x['reception_tokens']==11 and x['boundary_tokens']==5 for x in cpu['surface_masks']) and cpu['training_order']==m.training_order(20261024)==[6,0,7,1,8,2,6,3,7,4,8,5]))

import torch
import torch.nn.functional as F
legacy=Path('/workspace/cocolon_4b_service_binding_legacy_reference_20261025')
sys.path.insert(0,str(legacy));import run_pilot as r
torch.manual_seed(20261024)
ids=torch.tensor([[0,1,2,3,4,5,6]],dtype=torch.long)
full_labels=torch.tensor([[-100,-100,2,3,4,5,6]],dtype=torch.long)
surface_labels=torch.tensor([[-100,-100,-100,3,4,-100,-100]],dtype=torch.long)
full=dict(input_ids=ids[0].tolist(),labels=full_labels[0].tolist())
surface=dict(input_ids=ids[0].tolist(),labels=surface_labels[0].tolist(),loss_start=2,logits_positions=5)
class Tiny(torch.nn.Module):
    def __init__(self,initial):
        super().__init__();self.values=torch.nn.Parameter(initial.clone());self.calls=0
    def forward(self,*,input_ids,attention_mask,labels,logits_to_keep,use_cache):
        assert use_cache is False
        self.calls+=1
        logits=self.values[:,-logits_to_keep:,:]
        return type('Loss',(),{'loss':F.cross_entropy(logits[:,:-1,:].reshape(-1,11),labels[:,1:].reshape(-1),ignore_index=-100)})()
initial=torch.randn((1,7,11),dtype=torch.float64)
actual,reference=Tiny(initial),Tiny(initial)
result=m.backward_objective(actual,input_ids=ids,attention_mask=torch.ones_like(ids),labels=full_labels,encoded=full,teacher_loss=r.teacher_loss,surface_encoded=surface,surface_labels=surface_labels)
full_ref=r.teacher_loss(reference,input_ids=ids,attention_mask=torch.ones_like(ids),labels=full_labels,encoded=full)
surface_ref=m.surface_loss(reference,input_ids=ids,attention_mask=torch.ones_like(ids),labels=surface_labels,encoded=surface)
expected=.5*full_ref+.5*surface_ref;expected.backward()
gradient_error=float((actual.values.grad-reference.values.grad).abs().max())
check('sequential_backward_equals_joint_objective_gradient',lambda:need(gradient_error<1e-12 and math.isclose(result['loss'],float(expected.detach()),rel_tol=1e-12) and actual.calls==2))
opt_actual=torch.optim.AdamW(actual.parameters(),lr=5e-5,weight_decay=0)
opt_reference=torch.optim.AdamW(reference.parameters(),lr=5e-5,weight_decay=0)
for model,opt in [(actual,opt_actual),(reference,opt_reference)]:
    torch.nn.utils.clip_grad_norm_(model.parameters(),1.,error_if_nonfinite=True);opt.step()
check('single_clip_and_adamw_step_matches_joint_objective',lambda:need(torch.allclose(actual.values,reference.values,atol=1e-12,rtol=0) and all(float(v['step'])==1 for v in opt_actual.state.values())))
chair,chair_ref=Tiny(initial),Tiny(initial)
chair_result=m.backward_objective(chair,input_ids=ids,attention_mask=torch.ones_like(ids),labels=full_labels,encoded=full,teacher_loss=r.teacher_loss)
chair_loss=r.teacher_loss(chair_ref,input_ids=ids,attention_mask=torch.ones_like(ids),labels=full_labels,encoded=full);chair_loss.backward()
check('chair_gradient_unchanged_and_prompt_not_supervised',lambda:need(chair.calls==1 and chair_result['surface_nll'] is None and torch.equal(chair.values.grad,chair_ref.values.grad) and not torch.any(chair.values.grad[:,0,:])))
old=(Path('/workspace/cocolon_4b_quote_surface_pack_20261026')/'run_quote_surface_holdout.py').read_text()
check('holdout_acceptance_unchanged_and_old_result_not_accepted',lambda:need((p/'run_quote_joint_holdout.py').read_text()==old.replace('surface','joint').replace('SURFACE12','JOINT12')))
report=dict(status='CPU_JOINT_CANDIDATE_VERIFIED_NO_4B_CALL',checks=checks,passed=len(checks),failed=0,runner_sha256=plan['runner_sha256'],tokenization_sha256=hashlib.sha256((p/'joint_fit12_tokenization.json').read_bytes()).hexdigest(),torch_version=torch.__version__,tiny_synthetic_cpu_gradient_max_error=gradient_error,tokenizer='fixed local Qwen3.5 cache',tiny_synthetic_parameter_update_steps=1,actual_4b_training_updates=0,actual_4b_model_loads=0,actual_4b_forwards=0,model_generations=0,gpu_access=False,gpu_run_authorized=False,sql_calls=0,scope='One finite candidate check; synthetic CPU gradient evidence is not a 4B learning result or product acceptance')
target=p/'joint_fit12_cpu_validation.json';assert not target.exists();target.write_text(json.dumps(report,ensure_ascii=False,indent=2)+chr(10))
print(json.dumps(dict(status=report['status'],passed=len(checks),gradient_max_error=gradient_error,bytes=target.stat().st_size,sha256=hashlib.sha256(target.read_bytes()).hexdigest())))
