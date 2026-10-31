"""Proposed interleaved30 from unchanged quote15. Approval-pending execute refuses before effects."""
import argparse, gc, hashlib, importlib.metadata, importlib.util, json, math, os
from pathlib import Path
import random, shutil, signal, sys, time, traceback
from unittest.mock import patch
sys.dont_write_bytecode=True
LEGACY=Path('/workspace/cocolon_4b_service_binding_legacy_reference_20261025')
JOINT=Path('/workspace/cocolon_4b_quote_joint_pack_20261026')
API=Path('/workspace/cocolon_sixrow_api_20261026')
INITIAL=Path('/workspace/cocolon_4b_quote_joint_fit12_20261026/adapter')
OUTPUT=Path('/workspace/cocolon_native15_interleaved30_run_20261027')
HELPER_SHA='2f659078c05bee6d7b32f50aae8b9eebc03c767d4a3be084bc17e9e3ccc4c10d'
JOINT_SHA='c5dd1679c605e020e4dad56951c79d7c0661a1279a34a0ae0d47666d639d7128'
PROPOSAL_SHA='e11d92ec87365e0f7bb2c7b3c41b83cb3350a07af3021391c01e39a1285d03a9'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def require(v,s):
 if not v:raise ValueError(s)
def dump(p,v):
 p=Path(p);tmp=p.with_suffix(p.suffix+'.tmp');tmp.write_text(json.dumps(v,ensure_ascii=False,indent=2,allow_nan=False)+'\n');tmp.replace(p)

PREDECESSOR_PLAN_SHA256='6c48a26871102797291f7cf531929af58b2e2a2e65d6ca85d9e9ba8b4c08dfd7'
PREDECESSOR_RUNNER_SHA256='02819f033dfae099971d6d474141d4855d40eba9f5ca8e28fa0dfbb12c5ca4eb'
SUCCESSOR_PLAN='gpu30_interleaved.plan.json'
AFTERONLY_RUNNER_SHA256='a62d3ed74e76a26c01fe66b9eba32d42631acac170cfd9c8dcb2c7cdf5076552'
SUCCESSOR_FIXED={
 'schema':'cocolon.native15_interleaved30_once.plan.v1',
 'predecessor_source_commit':'179acbd2b3c3d13de3a3adc1fa8bbc1d9799d384',
 'predecessor_plan_sha256':PREDECESSOR_PLAN_SHA256,
 'predecessor_runner_sha256':PREDECESSOR_RUNNER_SHA256,
 'api_commit':'6b043880504912481a6b10d93c9128ec4995b70b',
 'before_ids':[], 'max_model_calls':15, 'max_seconds':2700,
 'optimizer_steps':30, 'training_passes':2, 'update_order':['TRAIN-SERVICE-CHAIR-01-INITIAL', 'FT-BOOK-INITIAL', 'TRAIN-DAILY-CALM-01-INITIAL', 'TRAIN-SERVICE-CHAIR-01-CORRECTION', 'FT-BOOK-AFTER-ANSWER', 'TRAIN-SERVICE-CHAIR-02-INITIAL', 'FT-SHOP-INITIAL', 'TRAIN-DAILY-CALM-02-INITIAL', 'TRAIN-SERVICE-CHAIR-02-CORRECTION', 'FT-SHOP-AFTER-ANSWER', 'TRAIN-SERVICE-CHAIR-03-INITIAL', 'FT-REPOT-INITIAL', 'TRAIN-DAILY-CALM-03-INITIAL', 'TRAIN-SERVICE-CHAIR-03-CORRECTION', 'FT-KNIT-INITIAL', 'FT-SHOP-INITIAL', 'TRAIN-SERVICE-CHAIR-03-INITIAL', 'TRAIN-DAILY-CALM-02-INITIAL', 'FT-SHOP-AFTER-ANSWER', 'TRAIN-SERVICE-CHAIR-03-CORRECTION', 'FT-BOOK-INITIAL', 'TRAIN-SERVICE-CHAIR-01-INITIAL', 'TRAIN-DAILY-CALM-03-INITIAL', 'FT-BOOK-AFTER-ANSWER', 'TRAIN-SERVICE-CHAIR-01-CORRECTION', 'FT-REPOT-INITIAL', 'TRAIN-SERVICE-CHAIR-02-INITIAL', 'TRAIN-DAILY-CALM-01-INITIAL', 'FT-KNIT-INITIAL', 'TRAIN-SERVICE-CHAIR-02-CORRECTION'],
 'per_generation_seconds':180,
 'output_directory':str(OUTPUT),
 'deadline_scope':'Global 2700 seconds covers loading, interleaved30 updates, separate save/reload and after15 only. Final hash/archive/recovery can take additional time; not an OS hard-stop guarantee. All 15 calls are not guaranteed to complete.',
 'baseline_policy':'No new baseline generation. Preserve predecessor BOOK initial/answer raw as failed evidence; other four new-family before cases remain unmeasured. This candidate is interleaved30-save-reload-after15 only. Earlier 278fdc26 quote15 outputs are a candidate comparison, not a measured 45779 quote-before baseline.',
 'baseline_evidence':[
  'native15_result/before_FT-BOOK-INITIAL.jsonl',
  'native15_result/before_FT-BOOK-AFTER-ANSWER.jsonl'],
 'retry':False, 'automatic_progression':False, 'product_accepted':False,
 'gpu_lifecycle_operations':0,
}
def validate_successor(pack,*,execution=False):
 require(sha(pack/'gpu15.plan.json')==PREDECESSOR_PLAN_SHA256,'predecessor_plan_changed')
 require(sha(pack/'run_native15.py')==PREDECESSOR_RUNNER_SHA256,'predecessor_runner_changed')
 require(sha(pack/'gpu15.proposed.json')==PROPOSAL_SHA,'predecessor_proposal_changed')
 original_plan=json.loads((pack/'gpu15.plan.json').read_text())
 for n,spec in original_plan['payloads'].items():
  p=pack/n;require(p.is_file() and not p.is_symlink() and p.stat().st_size==spec['bytes'] and sha(p)==spec['sha256'],'payload_changed:'+n)
 s=json.loads((pack/SUCCESSOR_PLAN).read_text())
 variable={'runner_sha256','status','gpu_run_authorized','approval_basis','expected_gpu_name','pod_id','gpu_hourly_usd','max_process_usd'}
 require(set(s)==set(SUCCESSOR_FIXED)|variable,'successor_keys_changed')
 for k,v in SUCCESSOR_FIXED.items():
  require(type(s.get(k)) is type(v) and s[k]==v,'successor_scope_changed:'+k)
 require(sha(__file__)==s['runner_sha256'],'successor_runner_changed')
 require(sha(pack/'run_native15_afteronly.py')==AFTERONLY_RUNNER_SHA256,'closed_afteronly_runner_changed')
 require(s['status'] in {'PREPARED_AWAITING_MASH_APPROVAL','AUTHORIZED_ONCE_BOUND'},'successor_status_invalid')
 authorized=s['status']=='AUTHORIZED_ONCE_BOUND'
 require(type(s['gpu_run_authorized']) is bool and s['gpu_run_authorized']==authorized,'successor_authorization_mismatch')
 require((authorized and type(s['approval_basis']) is str and s['approval_basis'].strip()) or (not authorized and s['approval_basis'] is None),'approval_basis_mismatch')
 require(s['expected_gpu_name']=='NVIDIA RTX A5000' and s['pod_id']=='bkj4qvnhwtdqc2','same_a5000_pod_required')
 require(type(s['gpu_hourly_usd']) is float and s['gpu_hourly_usd']==0.28 and type(s['max_process_usd']) is float and s['max_process_usd']==0.21,'fixed_process_budget_changed')
 require(s['max_seconds']*s['gpu_hourly_usd']/3600<=s['max_process_usd']+1e-12,'process_cost_exceeds_bound_budget')
 order=s['update_order'];ids=original_plan['training_order']
 require(all(sorted(order[i:i+15])==sorted(ids) for i in (0,15)) and len(order)==30,'each_frozen_row_twice_required')
 require(not execution or authorized,'execute_refused_mash_approval_pending')
 return s

def prepare(pack):
 require(os.environ.get('HF_HUB_OFFLINE')==os.environ.get('TRANSFORMERS_OFFLINE')=='1','offline_required')
 plan=json.loads((pack/'gpu15.plan.json').read_text());proposal=json.loads((pack/'gpu15.proposed.json').read_text())
 require(sha(pack/'gpu15.proposed.json')==PROPOSAL_SHA,'proposal_changed')
 require({k:v for k,v in plan.items() if k in proposal}=={**proposal,'status':'AUTHORIZED_ONCE','gpu_run_authorized':True,'implementation_required':False},'approved_scope_changed')
 require(plan.get('approval_basis')=='Mash explicit approval of 5ba8c370 native15-gpu-proposal: 進めていいよ。','approval_missing')
 successor=validate_successor(pack)
 plan={**plan,**{k:successor[k] for k in ('before_ids','max_model_calls','max_seconds','per_generation_seconds','gpu_hourly_usd','max_process_usd','baseline_policy','deadline_scope','optimizer_steps','training_passes','update_order')},'successor':successor,'runner_sha256':successor['runner_sha256'],'status':successor['status'],'gpu_run_authorized':successor['gpu_run_authorized'],'approval_basis':successor['approval_basis'],'existing_pod':successor['pod_id'],'gpu':successor['expected_gpu_name'],'new_pod':False}
 for n,s in proposal['payloads'].items():
  p=pack/n;require(p.is_file() and not p.is_symlink() and p.stat().st_size==s['bytes'] and sha(p)==s['sha256'],'payload_changed:'+n)
 require(sha(LEGACY/'run_pilot.py')==HELPER_SHA and sha(JOINT/'run_quote_joint_fit.py')==JOINT_SHA,'immutable_helper_changed')
 for path,expected in json.loads((pack/'api_blobs.json').read_text()).items():
  b=(API/path).read_bytes();require(hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==expected,'api_blob_changed:'+path)
 sys.path.insert(0,str(LEGACY));import run_pilot as r
 versions={n:importlib.metadata.version(n) for n in r.PINS};require(versions==r.PINS,'dependency_changed')
 spec=importlib.util.spec_from_file_location('native15_archive_owner',JOINT/'run_quote_joint_fit.py');joint=importlib.util.module_from_spec(spec);spec.loader.exec_module(joint)
 require(r.adapter_hashes(INITIAL)==plan['initial_adapter_sha256'],'initial_adapter_changed')
 rows=r.read_jsonl(pack/'train_messages.jsonl');cases=r.read_jsonl(pack/'eval_inputs.jsonl');require(len(rows)==len(cases)==15,'row_count')
 require([x['id'] for x in rows]==plan['training_order']==[x['case_id'] for x in cases],'row_order')
 from transformers import AutoTokenizer
 tok=AutoTokenizer.from_pretrained(r.MODEL,revision=r.REVISION,local_files_only=True,trust_remote_code=False)
 encoded=[];stats=[]
 for row,case in zip(rows,cases,strict=True):
  require([m['role'] for m in row['messages']]==['system','user','assistant'],'training_roles')
  require(case['messages']==row['messages'][:-1],'evaluation_teacher_leak')
  e,prefix=r.encode_training(tok,row['messages'],context=8192);cap=plan['generation_caps'][row['id']]
  require(cap==case['max_new_tokens'] and prefix+cap<=8192 and len(e['input_ids'])-prefix<=cap,'token_scope')
  require(tok.eos_token_id in e['labels'][prefix:] and all(x==-100 for x in e['labels'][:prefix]) and e['labels'][prefix:]==e['input_ids'][prefix:],'assistant_eos_loss')
  encoded.append(e);stats.append(dict(id=row['id'],prompt_tokens=prefix,assistant_eos_tokens=len(e['input_ids'])-prefix,full_tokens=len(e['input_ids']),generation_cap=cap))
 pre=json.loads((pack/'cpu_preparation.json').read_text())
 require([{k:c[k] for k in stats[0]} for c in pre['cases']]==stats,'cpu_preparation_changed')
 return plan,r,joint,tok,rows,cases,encoded,dict(status='CPU_RUNNER_READY_MODEL_NOT_LOADED',rows=stats,dependency_versions=versions,runner_sha256=sha(__file__),proposal_sha256=PROPOSAL_SHA)
def execute(pack,source_commit):
 require(len(source_commit)==40 and all(c in '0123456789abcdef' for c in source_commit),'source_commit_required')
 successor=validate_successor(pack,execution=True)
 OUTPUT.mkdir(exist_ok=False)
 started=time.monotonic();deadline=started+2700
 report=dict(status='STARTED_ONCE',source_commit=source_commit,stage='prepare',started_unix=time.time(),optimizer_steps_completed=0,model_calls_started=0,model_calls_completed=0,base_model_loads_started=0,product_accepted=False,automatic_progression=False,retry=False,service_sql_calls=0,strict_optimizer_resume=False,calls=[])
 def checkpoint():
  report['seconds']=time.monotonic()-started;dump(OUTPUT/'run.json',report)
 def timeout(*_):raise TimeoutError('native15_global_deadline_no_retry')
 signal.signal(signal.SIGALRM,timeout);signal.signal(signal.SIGTERM,timeout);signal.setitimer(signal.ITIMER_REAL,2700)
 model=None;trainable=None;r=None;joint=None;optimizer=None
 checkpoint()
 try:
  plan,r,joint,tok,rows,cases,encoded,check=prepare(pack)
  report['plan']=plan;report['cpu_runner_check']=check;report['baseline_evidence']=successor['baseline_evidence'];report['new_before_generations']=0
  for n in ['gpu15.plan.json','gpu15.proposed.json',SUCCESSOR_PLAN,'run_native15_afteronly.py','run_native15.py','train_messages.jsonl','eval_inputs.jsonl','cpu_preparation.json','api_blobs.json']:
   shutil.copyfile(pack/n,OUTPUT/n)
  shutil.copyfile(__file__,OUTPUT/'run_native15_interleaved30.py')
  import torch
  from peft import PeftModel
  from transformers import StoppingCriteria,StoppingCriteriaList
  require(torch.cuda.device_count()==1,'one_gpu_required');report['gpu']=r.gpu_profile(torch,{'minimum_free_gib':14});require(report['gpu']['name']==successor['expected_gpu_name'],'bound_gpu_name_mismatch');require(os.environ.get('RUNPOD_POD_ID')==successor['pod_id'],'bound_pod_id_mismatch')
  config=json.loads((INITIAL/'adapter_config.json').read_text())
  require(config.get('base_model_name_or_path')==r.MODEL and set(config.get('target_modules',[]))==r.EXPECTED_TARGETS and config.get('r')==8 and config.get('lora_alpha')==16 and config.get('lora_dropout')==0 and config.get('bias')=='none','adapter_config_changed')
  torch.cuda.reset_peak_memory_stats();report.update(stage='loading_initial',base_model_loads_started=1);checkpoint()
  model=PeftModel.from_pretrained(r.load_base(),INITIAL,is_trainable=True,local_files_only=True)
  trainable=[(n,p) for n,p in model.named_parameters() if p.requires_grad]
  require(len(trainable)==32 and all('lora_' in n and '.self_attn.' in n and str(p.dtype)=='torch.float32' and torch.isfinite(p).all().item() for n,p in trainable),'trainable_scope')
  def evaluate_one(case,phase):
   nonlocal model
   require(report['model_calls_started']<plan['max_model_calls'],'model_call_budget_exhausted')
   require(time.monotonic()<deadline-5,'global_deadline_before_call')
   call_deadline=min(deadline,time.monotonic()+180);triggered=False;original=model.generate
   class Bounded(StoppingCriteria):
    def __call__(self,*a,**k):
     nonlocal triggered
     triggered=time.monotonic()>=call_deadline;return triggered
   def generate(*a,**kw):
    kw['stopping_criteria']=StoppingCriteriaList([*list(kw.get('stopping_criteria') or []),Bounded()]);return original(*a,**kw)
   report['stage']=phase;report['model_calls_started']+=1;checkpoint()
   name=f"{phase}_{case['case_id']}.jsonl";path=OUTPUT/name
   with patch.object(model,'generate',generate):
    r.evaluate(model,tok,[case],path,{'context_tokens':8192,'max_new_tokens':plan['generation_caps'][case['case_id']]},adapter_revision=report.get('adapter_sha256',plan['initial_adapter_sha256'])['adapter_model.safetensors'])
   raw=r.read_jsonl(path);require(len(raw)==1,'raw_count')
   report['model_calls_completed']+=1;report['calls'].append(dict(phase=phase,case_id=case['case_id'],path=name,eos_reached=raw[0]['eos_reached'],timeout_triggered=triggered,raw_sha256=sha(path)))
   checkpoint();require(not triggered and time.monotonic()<call_deadline,'per_call_or_global_deadline_no_retry')
  byid={c['case_id']:c for c in cases}
  require(plan['before_ids']==[],'no_new_baseline_calls')
  # Prior BOOK raws remain historical failed evidence; do not synthesize missing baseline cases.
  # Full assistant/EOS loss, LR and seed are unchanged. Only update count/order differ.
  row_index={row['id']:i for i,row in enumerate(rows)}
  random.seed(plan['seed']);torch.manual_seed(plan['seed']);torch.cuda.manual_seed_all(plan['seed'])
  model.config.use_cache=False;model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={'use_reentrant':False});model.enable_input_require_grads();model.train()
  optimizer=torch.optim.AdamW([p for n,p in trainable],lr=5e-5,weight_decay=0.)
  report['stage']='training';checkpoint()
  with (OUTPUT/'training.jsonl').open('x') as stream:
   for i,cid in enumerate(plan['update_order']):
    index=row_index[cid];item=encoded[index]
    require(time.monotonic()<deadline,'global_deadline_before_update')
    ids=torch.tensor([item['input_ids']],dtype=torch.long,device='cuda:0');labels=torch.tensor([item['labels']],dtype=torch.long,device='cuda:0')
    optimizer.zero_grad(set_to_none=True);loss=r.teacher_loss(model,input_ids=ids,attention_mask=torch.ones_like(ids),labels=labels,encoded=item)
    require(torch.isfinite(loss).item(),'nonfinite_loss');loss.backward()
    norm=float(torch.nn.utils.clip_grad_norm_([p for n,p in trainable],1.,error_if_nonfinite=True).cpu());require(math.isfinite(norm) and norm>0,'invalid_gradient')
    optimizer.step();report['optimizer_steps_completed']=i+1
    stream.write(json.dumps(dict(step=i+1,training_pass=i//15+1,row_index=index,id=cid,loss=float(loss.detach().cpu()),gradient_norm=norm))+'\n');stream.flush();checkpoint();del ids,labels,loss
  optimizer.zero_grad(set_to_none=True);optimizer=None
  require(all(torch.isfinite(p).all().item() for n,p in trainable),'nonfinite_final_weights')
  model.save_pretrained(OUTPUT/'adapter',safe_serialization=True);report.update(stage='saved_before_reload',adapter_sha256=r.adapter_hashes(OUTPUT/'adapter'));checkpoint();joint.archive(OUTPUT,r)
  trainable=None;model=None;gc.collect();torch.cuda.empty_cache()
  report.update(stage='loading_saved_inference_only',base_model_loads_started=2);checkpoint()
  model,tensors=r.load_saved_adapter(OUTPUT/'adapter',report['adapter_sha256']);dump(OUTPUT/'reloaded_tensors.json',tensors)
  for cid in plan['after_ids']:evaluate_one(byid[cid],'after')
  report.update(status='RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW',stage='raw_complete',peak_allocated_bytes=torch.cuda.max_memory_allocated(),peak_reserved_bytes=torch.cuda.max_memory_reserved())
 except BaseException as exc:
  report.update(status='STOPPED_NO_RETRY',error_type=type(exc).__name__,reason=str(exc),traceback=traceback.format_exc())
 finally:
  signal.setitimer(signal.ITIMER_REAL,0)
  report['processing_seconds']=time.monotonic()-started
  # No further model call/update here. Preserve partial adapter on a failed run.
  if model is not None and report['optimizer_steps_completed']>0 and 'adapter_sha256' not in report:
   try:model.save_pretrained(OUTPUT/'partial_adapter',safe_serialization=True);report['partial_adapter_saved']=True
   except BaseException as exc:report['partial_save_error']=str(exc)
  try:
   require(r is not None,'helper_unavailable');report['initial_adapter_unchanged']=r.adapter_hashes(INITIAL)==report['plan']['initial_adapter_sha256']
   report['saved_adapter_unchanged_after_generation']=r.adapter_hashes(OUTPUT/'adapter')==report['adapter_sha256'] if 'adapter_sha256' in report else None
   report['fixed_sources_unchanged']=sha(__file__)==report['plan']['runner_sha256'] and sha(pack/'gpu15.plan.json')==PREDECESSOR_PLAN_SHA256 and sha(pack/'gpu15.proposed.json')==PROPOSAL_SHA and sha(pack/'run_native15.py')==PREDECESSOR_RUNNER_SHA256 and json.loads((pack/SUCCESSOR_PLAN).read_text())==successor and sha(LEGACY/'run_pilot.py')==HELPER_SHA and sha(JOINT/'run_quote_joint_fit.py')==JOINT_SHA and sha(pack/'run_native15_afteronly.py')==AFTERONLY_RUNNER_SHA256 and all(sha(pack/n)==s['sha256'] for n,s in report['plan']['payloads'].items())
   if not report['initial_adapter_unchanged'] or not report['fixed_sources_unchanged'] or report['saved_adapter_unchanged_after_generation'] is False:report['status']='STOPPED_IDENTITY_MISMATCH_NO_RETRY'
  except BaseException as exc:report['final_identity_error']=str(exc);report['status']='STOPPED_IDENTITY_UNVERIFIED_NO_RETRY'
  report['process_cost_usd']=report['processing_seconds']*successor['gpu_hourly_usd']/3600;checkpoint()
  if joint is not None:
   try:joint.archive(OUTPUT,r)
   except BaseException as exc:report['archive_error']=str(exc);checkpoint()
 print(json.dumps({k:report.get(k) for k in ('status','optimizer_steps_completed','model_calls_started','model_calls_completed','processing_seconds','process_cost_usd')},ensure_ascii=False),flush=True)
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--pack',type=Path,required=True);p.add_argument('--execute',action='store_true');p.add_argument('--source-commit');p.add_argument('--validate-plan-only',action='store_true');a=p.parse_args()
 if a.validate_plan_only:
  require(not a.execute and os.environ.get('CUDA_VISIBLE_DEVICES')=='','cpu_plan_check_only')
  s=validate_successor(a.pack.resolve());print(json.dumps(dict(status='SUCCESSOR_PLAN_VALID_NO_MODEL_LOAD',environment_bound=True,gpu_run_authorized=s['gpu_run_authorized'],new_baseline_calls=0,updates=30,after_calls=15,max_seconds=2700,per_generation_seconds=180)),flush=True)
 elif a.execute:execute(a.pack.resolve(),a.source_commit or '')
 else:
  require(os.environ.get('CUDA_VISIBLE_DEVICES')=='','cpu_check_only');*_,check=prepare(a.pack.resolve());dump(a.pack/'gpu_interleaved30_runner_cpu_check.json',check);print(check['status'],flush=True)
