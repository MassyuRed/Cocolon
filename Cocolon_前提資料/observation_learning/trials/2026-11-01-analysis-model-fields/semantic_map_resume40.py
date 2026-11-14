"""Bounded synthetic relational-map SFT; no prior adapter weights or adoption."""
import argparse,gc,hashlib,json,math,os,random,signal,sys,threading,time,traceback
from pathlib import Path
from importlib.metadata import version
sys.dont_write_bytecode=True
os.environ['HF_HUB_OFFLINE']='1';os.environ['TRANSFORMERS_OFFLINE']='1'
PINS={'transformers':'5.19.0','peft':'0.21.2','accelerate':'1.15.0','safetensors':'0.8.0'}
CONFIG_SHA='ef4b1aef621fb4e234ce6a05601efb62a987c3cf5d40f3995ca1b72200bab145'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--plan',type=Path,required=True);ap.add_argument('--plan-sha256',required=True);ap.add_argument('--config-dir',type=Path,required=True);ap.add_argument('--out',type=Path,required=True);args=ap.parse_args()
 assert not args.out.exists() and sha(args.plan)==args.plan_sha256
 pack=json.loads(args.plan.read_text());assert pack['status']=='ROOT_AUTHORED_SYNTHETIC_SEMANTIC_MAP_TEACHING_NOT_MASH_TEACHER_OR_PRODUCT_ACCEPTANCE'
 assert (len(pack['teachers']),len(pack['heldouts']),pack['max_updates'],len(pack['update_order']))==(9,4,40,40)
 assert sha(args.config_dir/'adapter_config.json')==pack['initial_adapter']['config_sha256']
 assert sha(args.config_dir/'adapter_model.safetensors')==pack['initial_adapter']['weights_sha256']
 args.out.mkdir();start=time.monotonic();deadline=start+pack['max_process_seconds']
 report=dict(status='STARTED_NOT_ADOPTED',model=pack['model'],revision=pack['revision'],plan_sha256=sha(args.plan),runner_sha256=sha(__file__),pins=PINS,training_initial='VERIFIED_80_TOTAL_STEP_CHECKPOINT_FRESH_OPTIMIZER_NOT_EXACT_RESUME',initial_updates=80,initial_adapter=pack['initial_adapter'],updates_completed=0,steps=[],measurements=[],calls=[],model_adopted=False)
 def save():
  report['process_seconds']=round(time.monotonic()-start,3);p=args.out/'report.json';tmp=p.with_suffix('.tmp');tmp.write_text(json.dumps(report,ensure_ascii=False,indent=2));tmp.replace(p)
 def expired(*a):raise TimeoutError('semantic_sft_process_budget_exceeded')
 signal.signal(signal.SIGTERM,expired);signal.signal(signal.SIGALRM,expired);signal.setitimer(signal.ITIMER_REAL,pack['max_process_seconds']);save()
 model=optimizer=generator=None
 try:
  assert {n:version(n) for n in PINS}==PINS
  import torch
  import torch.nn.functional as F
  from transformers import AutoTokenizer,Qwen3_5ForConditionalGeneration
  from peft import PeftModel,get_peft_model_state_dict
  from safetensors.torch import load_file
  assert torch.cuda.is_available() and torch.cuda.device_count()==1
  report.update(torch=torch.__version__,gpu=torch.cuda.get_device_name(0))
  random.seed(20261107);torch.manual_seed(20261107);torch.cuda.manual_seed_all(20261107)
  tok=AutoTokenizer.from_pretrained(pack['model'],revision=pack['revision'],local_files_only=True,trust_remote_code=False)
  encoded={};report['token_counts']={}
  for row in pack['teachers']+pack['heldouts']:
   prompt=tok.apply_chat_template(row['messages'],enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
   assert len(prompt)+4096<=16384
   if 'assistant_target' not in row:continue
   full=tok.apply_chat_template(row['messages']+[dict(role='assistant',content=row['assistant_target'])],enable_thinking=False,add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
   assert full[:len(prompt)]==prompt and len(prompt)<len(full)<=8192
   assert tok.decode(full[len(prompt):],skip_special_tokens=False,clean_up_tokenization_spaces=False)==row['assistant_target']+'<|im_end|>\n'
   labels=[-100]*len(prompt)+full[len(prompt):]
   encoded[row['id']]=dict(input_ids=full,labels=labels,loss_start=len(prompt)-1,logits_positions=len(full)-len(prompt)+1)
   report['token_counts'][row['id']]=dict(prompt=len(prompt),target=len(full)-len(prompt),total=len(full))
  # Preserve the existing full-assistant CE tail, including final EOS.
  a=(torch.arange(12*19,dtype=torch.float64).reshape(1,12,19)/100).requires_grad_(True);b=a.detach().clone().requires_grad_(True)
  labs=torch.arange(12).reshape(1,12)%19;labs[:,:7]=-100
  whole=F.cross_entropy(a[:,:-1,:].reshape(-1,19),labs[:,1:].reshape(-1),ignore_index=-100)
  tail=F.cross_entropy(b[:,-6:,:][:,:-1,:].reshape(-1,19),labs[:,7:].reshape(-1),ignore_index=-100)
  whole.backward();tail.backward();assert torch.allclose(whole,tail) and torch.equal(a.grad,b.grad)
  del a,b,labs,whole,tail
  report['ce_window']='FULL_AND_TAIL_LOSS_AND_GRADIENTS_MATCH_EOS_INCLUDED';save()
  model=Qwen3_5ForConditionalGeneration.from_pretrained(pack['model'],revision=pack['revision'],dtype=torch.bfloat16,device_map={'':0},attn_implementation='sdpa',local_files_only=True,trust_remote_code=False)
  model=PeftModel.from_pretrained(model,args.config_dir,is_trainable=True,local_files_only=True)
  trainable=[(n,p) for n,p in model.named_parameters() if p.requires_grad]
  assert len(trainable)==112 and sum(p.numel() for _,p in trainable)==3833856
  initial=load_file(args.config_dir/'adapter_model.safetensors');actual_initial=get_peft_model_state_dict(model)
  assert len(initial)==len(actual_initial)==112 and all(torch.equal(initial[k],actual_initial[k].detach().cpu()) for k in initial)
  del initial,actual_initial
  model.config.use_cache=False;model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={'use_reentrant':False});model.enable_input_require_grads();torch.cuda.reset_peak_memory_stats()
  def loss_for(item):
   ids=torch.tensor([item['input_ids']],dtype=torch.long,device='cuda:0');labels=torch.tensor([item['labels']],dtype=torch.long,device='cuda:0')
   return model(input_ids=ids,attention_mask=torch.ones_like(ids),labels=labels[:,item['loss_start']:],logits_to_keep=item['logits_positions'],use_cache=False).loss
  def measure(phase):
   model.eval();values={}
   with torch.no_grad():
    for key,item in encoded.items():
     value=loss_for(item);assert torch.isfinite(value);values[key]=float(value)
   report['measurements'].append(dict(phase=phase,losses=values));save()
  def preserve_adapter(step):
   target=args.out/('checkpoint_'+str(step))
   model.save_pretrained(target,safe_serialization=True)
   weights=load_file(target/'adapter_model.safetensors');current=get_peft_model_state_dict(model)
   assert len(weights)==len(current)==112 and all(torch.equal(weights[k],current[k].detach().cpu()) for k in weights)
   report.setdefault('checkpoints',[]).append(dict(updates=step,path=target.name,weights_sha256=sha(target/'adapter_model.safetensors'),config_sha256=sha(target/'adapter_config.json'),optimizer_and_rng_saved=False))
   save()
  measure('before_updates');model.train();optimizer=torch.optim.AdamW([p for _,p in trainable],lr=5e-5,weight_decay=0.)
  training_start=time.monotonic()
  for step,key in enumerate(pack['update_order'],1):
   if time.monotonic()-training_start>pack['max_training_seconds']:raise TimeoutError('semantic_sft_training_budget_exceeded')
   optimizer.zero_grad(set_to_none=True);loss=loss_for(encoded[key]);assert torch.isfinite(loss);loss.backward()
   assert all(p.grad is None or torch.isfinite(p.grad).all() for _,p in trainable)
   norm=torch.nn.utils.clip_grad_norm_([p for _,p in trainable],1.);assert torch.isfinite(norm);optimizer.step()
   report['updates_completed']=step;report['steps'].append(dict(step=step,teacher=key,loss=float(loss.detach()),gradient_norm=float(norm)));save()
   if step%8==0:preserve_adapter(step)
  optimizer.zero_grad(set_to_none=True);optimizer=None;measure('after_updates')
  model.save_pretrained(args.out/'adapter',safe_serialization=True)
  saved=load_file(args.out/'adapter/adapter_model.safetensors');actual=get_peft_model_state_dict(model)
  assert len(saved)==len(actual)==112 and all(torch.equal(saved[k],actual[k].detach().cpu()) for k in saved)
  report['adapter_sha256']=sha(args.out/'adapter/adapter_model.safetensors');report['adapter_config_sha256']=sha(args.out/'adapter/adapter_config.json')
  report['peak_allocated_gib']=torch.cuda.max_memory_allocated()/2**30;report['peak_reserved_gib']=torch.cuda.max_memory_reserved()/2**30;save()
  model=optimizer=trainable=saved=actual=loss=None;gc.collect();torch.cuda.empty_cache();torch.cuda.synchronize()
  sys.path.insert(0,'/workspace/mashos-api/ai/tools');from serve_emlis_natural_reply import load_generator
  generator=load_generator(str(args.out/'adapter'),threading.Event(),weights_sha256=report['adapter_sha256'],config_sha256=report['adapter_config_sha256'],max_new_tokens=4096,context_tokens=16384)
  report['nontraining_saved_reload']='VERIFIED_112_TENSORS';save()
  for row in [pack['teachers'][0]]+pack['heldouts']:
   if time.monotonic()>deadline-15:break
   begin=time.monotonic();text,finish=generator(row['messages'],min(deadline-10,begin+210))
   response=dict(model='cocolon-qwen3.5-4b-analysis-semantic-sft-v1',choices=[dict(index=0,finish_reason=finish,message=dict(role='assistant',content=text))])
   (args.out/(row['id']+'.response.json')).write_text(json.dumps(response,ensure_ascii=False))
   (args.out/(row['id']+'.request.json')).write_text(json.dumps(row,ensure_ascii=False))
   report['calls'].append(dict(id=row['id'],finish_reason=finish,seconds=round(time.monotonic()-begin,3),raw_sha256=hashlib.sha256(text.encode()).hexdigest()));save()
  report['status']='COMPLETE_NOT_ADOPTED_PENDING_RAW_READ' if len(report['calls'])==5 else 'EVALUATION_BUDGET_ENDED_NOT_ADOPTED'
 except BaseException as exc:
  report.update(status='FAILED_NOT_ADOPTED',error_type=type(exc).__name__,error=str(exc),traceback=traceback.format_exc());raise
 finally:
  model=optimizer=generator=None;gc.collect();save();signal.setitimer(signal.ITIMER_REAL,0)
if __name__=='__main__':main()
