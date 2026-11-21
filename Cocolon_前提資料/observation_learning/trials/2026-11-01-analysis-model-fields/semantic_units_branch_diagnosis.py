"""Bounded next-token measurements on fixed, unrepaired Analysis raw prefixes."""
import argparse,gc,hashlib,json,os,signal,sys,time
from importlib.metadata import version
from pathlib import Path
os.environ['HF_HUB_OFFLINE']='1'
os.environ['TRANSFORMERS_OFFLINE']='1'
sys.dont_write_bytecode=True
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def main():
 a=argparse.ArgumentParser(description=__doc__)
 for n in ('api-root','plan','adapter','originals','out'):a.add_argument('--'+n,required=True,type=Path)
 a.add_argument('--plan-sha256',required=True);args=a.parse_args()
 assert not args.out.exists() and sha(args.plan)==args.plan_sha256
 p=json.loads(args.plan.read_text());assert p['max_forwards']==len(p['probes'])==7
 assert p['max_updates']==p['max_new_generations']==0 and p['max_model_loads']==1
 initial={n:sha(args.adapter/n) for n in ['adapter_model.safetensors','adapter_config.json']}
 assert initial['adapter_model.safetensors']==p['adapter_sha256'] and initial['adapter_config.json']==p['adapter_config_sha256']
 loader=args.api_root/'ai/tools/serve_emlis_natural_reply.py';b=loader.read_bytes()
 assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==p['loader_blob']
 args.out.mkdir();start=time.monotonic()
 report=dict(status='STARTED',plan_sha256=args.plan_sha256,runner_sha256=sha(__file__),updates=0,new_generations=0,forwards=0,model_loads=0,branches=[],normal_adoption=False)
 def save():
  report['process_seconds']=time.monotonic()-start
  q=args.out/'report.tmp';q.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');q.replace(args.out/'report.json')
 def expire(*_):raise TimeoutError('branch_diagnosis_deadline')
 signal.signal(signal.SIGTERM,expire);signal.signal(signal.SIGALRM,expire);signal.setitimer(signal.ITIMER_REAL,300);save()
 model=None
 try:
  sys.path.insert(0,str(args.api_root/'ai/tools'))
  from serve_emlis_natural_reply import MODEL,REVISION,PINS
  import torch
  from transformers import AutoTokenizer,Qwen3_5ForConditionalGeneration
  from peft import PeftModel,get_peft_model_state_dict
  from safetensors.torch import load_file
  assert {n:version(n) for n in PINS}==PINS and (MODEL,REVISION)==(p['model'],p['revision'])
  assert torch.cuda.is_available() and torch.cuda.device_count()==1
  tokenizer=AutoTokenizer.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
  originals={};prompts={}
  for k,meta in p['originals'].items():
   rawfile=args.originals/f'after_{k}.raw.txt';reqfile=args.originals/f'after_{k}.request.json'
   assert sha(rawfile)==meta['raw_sha256'] and sha(reqfile)==meta['request_file_sha256']
   request=json.loads(reqfile.read_text());assert request['request_ref']==meta['request_ref']
   canonical=json.dumps(request['messages'],ensure_ascii=False,sort_keys=True,separators=(',',':'))
   assert hashlib.sha256(canonical.encode()).hexdigest()==request['messages_sha256']
   originals[k]=rawfile.read_text()
   prompts[k]=tokenizer.apply_chat_template(request['messages'],enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
  prepared=[]
  for branch in p['probes']:
   rawprefix=originals[branch['probe_id']][:branch['raw_character_end']]
   if branch['counterfactual_previous_parent']:
    old,new=branch['counterfactual_previous_parent'];assert rawprefix.count(old)==1;rawprefix=rawprefix.replace(old,new,1)
   assert rawprefix==branch['prefix'] and hashlib.sha256(rawprefix.encode()).hexdigest()==branch['prefix_sha256']
   variants={label:tokenizer.encode(rawprefix+suffix,add_special_tokens=False) for label,suffix in branch['alternatives'].items()}
   assert all(tokenizer.decode(ids,skip_special_tokens=False,clean_up_tokenization_spaces=False)==rawprefix+branch['alternatives'][label] for label,ids in variants.items())
   common=[]
   for column in zip(*variants.values()):
    if len(set(column))!=1:break
    common.append(column[0])
   assert common and all(len(ids)>len(common) for ids in variants.values())
   decoded=tokenizer.decode(common,skip_special_tokens=False,clean_up_tokenization_spaces=False)
   assert all((rawprefix+suffix).startswith(decoded) for suffix in branch['alternatives'].values())
   ids=prompts[branch['probe_id']]+common;assert len(ids)<=8192
   prepared.append((branch,ids,decoded,{label:tokens[len(common)] for label,tokens in variants.items()}))
  report.update(torch=torch.__version__,pins=PINS,gpu=torch.cuda.get_device_name(0),model=MODEL,revision=REVISION,retokenized_text_not_original_generated_tokens=True)
  model=Qwen3_5ForConditionalGeneration.from_pretrained(MODEL,revision=REVISION,dtype=torch.bfloat16,device_map={'':0},attn_implementation='sdpa',local_files_only=True,trust_remote_code=False)
  model=PeftModel.from_pretrained(model,args.adapter,is_trainable=False,local_files_only=True);model.eval();report['model_loads']=1
  saved=load_file(args.adapter/'adapter_model.safetensors');loaded=get_peft_model_state_dict(model)
  assert len(saved)==len(loaded)==112 and all(torch.equal(saved[k],loaded[k].detach().cpu()) for k in saved)
  assert not any(q.requires_grad for q in model.parameters());report['loaded_adapter']='MATCHED_ALL_112_TENSORS_NONTRAINING'
  del saved,loaded;torch.cuda.reset_peak_memory_stats();save()
  with torch.inference_mode():
   for branch,ids,decoded,candidates in prepared:
    assert report['forwards']<7 and time.monotonic()-start<295
    x=torch.tensor([ids],dtype=torch.long,device='cuda:0')
    logits=model(input_ids=x,attention_mask=torch.ones_like(x),logits_to_keep=1,use_cache=False).logits[0,-1,:].float()
    assert torch.isfinite(logits).all();logp=torch.log_softmax(logits,dim=-1)
    def score(i):return dict(token_id=i,token=tokenizer.decode([i],skip_special_tokens=False,clean_up_tokenization_spaces=False),rank=int((logits>logits[i]).sum().item())+1,log_probability=float(logp[i]),probability=float(logp[i].exp()))
    shared={str(i):[label for label,j in candidates.items() if j==i] for i in set(candidates.values()) if sum(j==i for j in candidates.values())>1}
    row=dict(id=branch['id'],probe_id=branch['probe_id'],raw_prefix_unchanged=branch['raw_prefix_unchanged'],counterfactual_previous_parent=branch['counterfactual_previous_parent'],prefix_text_sha256=hashlib.sha256(decoded.encode()).hexdigest(),prefix_token_ids_sha256=hashlib.sha256(json.dumps(ids,separators=(',',':')).encode()).hexdigest(),prefix_tokens=len(ids),prefix_tail=decoded[-180:],shared_token_labels_not_distinguishable=shared,candidates={label:score(i) for label,i in candidates.items()},top=[score(i) for i in torch.topk(logits,20).indices.tolist()])
    report['branches'].append(row);report['forwards']+=1;save()
    del logits,logp,x
  assert all(sha(args.adapter/n)==value for n,value in initial.items())
  report.update(status='COMPLETE_FIXED_PREFIX_DIAGNOSIS_NOT_ADOPTED',adapter_unchanged=True,peak_allocated_gib=torch.cuda.max_memory_allocated()/2**30,peak_reserved_gib=torch.cuda.max_memory_reserved()/2**30)
 except BaseException as exc:
  report.update(status='FAILED_NO_RETRY',error=type(exc).__name__,error_message=str(exc));save();raise
 finally:
  signal.setitimer(signal.ITIMER_REAL,0);model=None;gc.collect()
  try:
   import torch
   torch.cuda.empty_cache();torch.cuda.synchronize()
  finally:save()
if __name__=='__main__':main()
