"""CPU-only check for expanded native15 LoRA; no real 4B model or CUDA load."""
import os
os.environ.update(CUDA_VISIBLE_DEVICES='',HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
import argparse, hashlib, importlib.util, json, signal, subprocess, sys, time
from pathlib import Path
from types import SimpleNamespace
sys.dont_write_bytecode=True
def load(path,name):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def require(v,s):
 if not v:raise ValueError(s)
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def toy_peft_check():
 import torch
 from peft import LoraConfig
 from peft.tuners.lora.layer import Linear
 config=LoraConfig(r=8,lora_alpha=16,lora_dropout=0.,bias='none',init_lora_weights=True)
 base=torch.nn.Linear(12,16,bias=False);copy=torch.nn.Linear(12,16,bias=False)
 with torch.no_grad():base.weight.copy_(torch.arange(192,dtype=torch.float32).reshape(16,12)/2000);copy.weight.copy_(base.weight)
 old=Linear(base,'default',config=config,r=8,lora_alpha=16);new=Linear(copy,'default',config=config,r=8,lora_alpha=16)
 with torch.no_grad():
  old.lora_A['default'].weight.copy_(torch.arange(96,dtype=torch.float32).reshape(8,12)/3000)
  old.lora_B['default'].weight.copy_(torch.arange(128,dtype=torch.float32).reshape(16,8)/4000)
  new.lora_A['default'].weight.copy_(old.lora_A['default'].weight)
  new.lora_B['default'].weight.copy_(old.lora_B['default'].weight)
 added_base=torch.nn.Linear(16,12,bias=False)
 with torch.no_grad():added_base.weight.copy_(torch.arange(192,dtype=torch.float32).reshape(12,16)/2000)
 added=Linear(added_base,'default',config=config,r=8,lora_alpha=16)
 x=torch.arange(36,dtype=torch.float32).reshape(3,12)/100
 require(torch.equal(old(x),new(x)),'toy_common_adapter_changed')
 require(torch.equal(added_base(new(x)),added(new(x))),'toy_zero_B_added_effect')
 loss=added(new(x)).square().mean();loss.backward()
 require(torch.isfinite(loss).item() and added.lora_B['default'].weight.grad is not None and torch.isfinite(added.lora_B['default'].weight.grad).all().item() and torch.count_nonzero(added.lora_B['default'].weight.grad).item()>0,'toy_added_B_gradient_missing')
 return dict(scope='TINY_CPU_LINEAR_LAYERS_NOT_4B',shared_adapter_output_equal=True,zero_B_added_output_equal=True,new_B_nonzero_finite_gradient=True,optimizer_steps=0)
def main(pack):
 started=time.monotonic()
 def timeout(*_):raise TimeoutError('expanded_cpu120_no_retry')
 signal.signal(signal.SIGALRM,timeout);signal.alarm(120)
 require(not (pack/'actual_cpu_check.json').exists(),'cpu_check_already_exists_no_rerun')
 runner=load(pack/'run_native15_expanded30.py','expanded30_cpu_candidate')
 warm=runner.build_cpu_warmstart(pack)
 plan,r,joint,tok,rows,cases,encoded,check=runner.prepare(pack)
 import torch
 require(not torch.cuda.is_initialized(),'cuda_initialized_in_cpu_check')
 require(len(rows)==len(cases)==15 and len(plan['update_order'])==30 and plan['gpu_run_authorized'] is False,'cpu_plan_scope')
 tokenizer_checks=[]
 for row,case,item in zip(rows,cases,encoded,strict=True):
  require(case['messages']==row['messages'][:-1],'teacher_or_gold_prefix_in_eval')
  require(r.chat_token_ids(tok,case['messages'],generation_prompt=True)==item['input_ids'][:next(i for i,t in enumerate(item['labels']) if t!=-100)],'frozen_eval_prompt_tokens_changed')
  start,count=r.assistant_loss_window(item)
  require(start>=0 and count==len(item['input_ids'])-start,'loss_window_changed')
  tokenizer_checks.append(dict(id=row['id'],full_tokens=len(item['input_ids']),assistant_eos_tokens=len(item['labels'])-start-1,logits_start=start,logits_count=count,prompt_masked=True,full_teacher_and_eos_mean_CE=True,truncation=False,gold_prefix_in_eval=False))
 consumer=load(pack/'consume_expanded30.py','expanded30_cpu_consumer')
 args=SimpleNamespace(run=pack,api=Path('/workspace/cocolon_afteronly_api_20261027'),legacy=runner.LEGACY,runtime_python=Path('/workspace/cocolon_4b_service_runtime_20261025/python'),examples=runner.JOINT/'sft_examples.jsonl')
 consumer.validate_inputs_only(args)
 toy=toy_peft_check()
 before_output=runner.OUTPUT.exists();require(not before_output,'new_gpu_output_exists')
 child=subprocess.run([sys.executable,'-B',str(pack/'run_native15_expanded30.py'),'--pack',str(pack),'--execute','--source-commit','8b356c017bc9b45978eb9ef77eb357c9c1abbfc4'],capture_output=True,text=True,timeout=15,env={**os.environ,'CUDA_VISIBLE_DEVICES':'','HF_HUB_OFFLINE':'1','TRANSFORMERS_OFFLINE':'1'})
 require(child.returncode!=0 and 'execute_refused_mash_approval_pending' in child.stderr and not runner.OUTPUT.exists(),'pending_execute_not_refused_before_output')
 require(r.adapter_hashes(runner.INITIAL)==plan['initial_adapter_sha256'],'old_initial_changed_after_cpu')
 require(r.adapter_hashes(runner.EXPANDED_INITIAL)==plan['expanded_initial_adapter_sha256'],'expanded_initial_changed_after_cpu')
 require(not torch.cuda.is_initialized(),'cuda_initialized_after_cpu_check')
 report=dict(status='CPU_EXPANDED30_READY_NO_REAL_4B_EXECUTION',seconds=time.monotonic()-started,source_predecessor_commit='8b356c017bc9b45978eb9ef77eb357c9c1abbfc4',api_commit='6b043880504912481a6b10d93c9128ec4995b70b',dependencies=check['dependency_versions'],torch=torch.__version__,warmstart=warm,training_rows=15,planned_updates=30,update_order=plan['update_order'],actual_tokenizer=tokenizer_checks,max_full_tokens=max(x['full_tokens'] for x in tokenizer_checks),context_tokens=8192,eval_messages_and_native_priors_verified=15,teacher_bytes_unchanged=True,original_teacher_sha256=sha(pack/'train_messages.jsonl'),toy_peft=toy,pending_execute=dict(refused_before_output=True,returncode=child.returncode,error='execute_refused_mash_approval_pending'),model_reload_4b_tested=False,real_4b_model_loads=0,real_4b_forwards=0,training_updates=0,generation_calls=0,cmee_actual_raw_adoptions=0,sql_operations=0,product_accepted=False,candidate_ready=False,automatic_progression=False,gpu_output_exists=False,cuda_initialized=False,source_files={n:dict(bytes=(pack/n).stat().st_size,sha256=sha(pack/n)) for n in ['run_native15_expanded30.py','consume_expanded30.py','verify_expanded30_cpu.py','gpu30_expanded.plan.json']})
 runner.dump(pack/'actual_cpu_check.json',report);signal.alarm(0)
 print(json.dumps({k:report[k] for k in ['status','seconds','max_full_tokens','eval_messages_and_native_priors_verified','real_4b_model_loads','real_4b_forwards','training_updates','generation_calls','gpu_output_exists']},ensure_ascii=False),flush=True)
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--pack',type=Path,required=True);main(p.parse_args().pack.resolve())
