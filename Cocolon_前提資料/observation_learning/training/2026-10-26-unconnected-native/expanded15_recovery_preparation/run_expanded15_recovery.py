"""One separately approved inference-only recovery; never repeats the closed 30 updates."""
import argparse,copy,gc,hashlib,importlib.util,json,os,shutil,signal,sys,time,traceback
from pathlib import Path
from unittest.mock import patch
sys.dont_write_bytecode=True
ORIGIN=Path('/workspace/cocolon_native15_expanded30_run_20261027')
OLDPACK=Path('/workspace/cocolon_native15_expanded30_pack_20261027')
OUTPUT=Path('/workspace/cocolon_native15_expanded15_recovery_run_20261027')
PLAN='gpu15_recovery.plan.json'
SOURCE='bd5d169ad457fc440bf01d1876cb40d697ce6847'
ORIGIN_FILES={'run.json':'ccc8afccdb322c109515aa535e936d43e857b680c4727dcd63f18bc3789c7ea1','training.jsonl':'f1232cb906eb89cb1eb74a0cb10832ccb5e272d9ed40fabd17ce77ffb26a2868','run_native15_expanded30.py':'ca03471329b5f622284cf3abd446cdd2f7831de3f7617da49a558ff7b5259e9d','gpu30_expanded.plan.json':'5904a6c7157b6a8523f3d3f988990fa194c670685cfd568e64bf35b3204e6874'}
ADAPTER={'README.md':'7716b0151793769140a76026939437398273346aefc3e5f75bb8ab2833b42885','adapter_config.json':'fb43a10298bdf9965a8ab4c541cb517372928afd7dd97d0b210bf0c5b4f45b2e','adapter_model.safetensors':'109c3dda16b19d2f110d6f8e2ded07f47e981b9690970ca95b9046780bffb85a'}
INDEX_SHA='cf3f798ee02ba45f9622aa8892a47369ab667d0afbf154ee7c2212de42e6302d'
CONSUMER_SHA='981134897057ae1f4acaeaf340307fdd59965fe8c5808858d48caf4fe55feccf'
PAYLOADS={'train_messages.jsonl':'29f37e38f4a615220c739176a6eaa2e0e01aae36c7bb6f87db8be248aecd1772','eval_inputs.jsonl':'c67fa4098bafa10508bf57bf1975fcdfd6f2359f851e34c0f26148310eb8b75e','cpu_preparation.json':'64a7d905c4cfe3dbea227064e8aee053b23bff15baf51261f4a41c6478306f9d','api_blobs.json':'69168896b25c6bf1e008592bdeff1e975a4a3b88ca3366487a094414d98b9e85'}
def require(ok,code):
 if not ok:raise ValueError(code)
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def dump(p,v):
 p=Path(p);t=p.with_suffix(p.suffix+'.tmp');t.write_text(json.dumps(v,ensure_ascii=False,indent=2,allow_nan=False)+'\n');t.replace(p)
def import_file(name,path):
 spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
def validate_origin():
 for n,h in PAYLOADS.items():require(sha(ORIGIN/n)==h,'origin_frozen_payload_changed:'+n)
 for n,h in ORIGIN_FILES.items():require(sha(ORIGIN/n)==h,'closed_origin_changed:'+n)
 for n,h in ADAPTER.items():require(sha(ORIGIN/'adapter'/n)==h,'saved_adapter_changed:'+n)
 r=json.loads((ORIGIN/'run.json').read_text())
 require(r['source_commit']==SOURCE and r['status']=='STOPPED_NO_RETRY' and r['reason']=='adapter_config_scope_changed' and r['optimizer_steps_completed']==30 and r['model_calls_started']==r['model_calls_completed']==0 and not r['calls'],'closed_origin_scope')
 require(all(r[k] is True for k in ('initial_adapter_unchanged','expanded_initial_unchanged','saved_adapter_unchanged_after_generation','fixed_sources_unchanged')),'closed_origin_identity')
 steps=[json.loads(x) for x in (ORIGIN/'training.jsonl').read_text().splitlines()]
 require(len(steps)==30 and [s['id'] for s in steps]==r['plan']['update_order'] and [s['step'] for s in steps]==list(range(1,31)),'closed_training_order')
 return r
_INVENTORY=None
_META_WEIGHT_SHAPES={}
def inventory():
 global _INVENTORY,_META_WEIGHT_SHAPES
 if _INVENTORY is not None:return _INVENTORY
 from huggingface_hub.constants import HF_HUB_CACHE
 p=Path(HF_HUB_CACHE)/'models--Qwen--Qwen3.5-4B/snapshots/851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a/model.safetensors.index.json'
 require(sha(p)==INDEX_SHA,'fixed_base_index_changed')
 require(sha(p.parent/'config.json')=='ddc63e1c717afa86c865bb5e01313d89d72bb53b97ad4a8a03ba8510c0621670','fixed_base_config_changed')
 # The checkpoint also contains unused MTP weights. Resolve against the actual class, not all checkpoint names.
 # This creates architecture metadata on meta only; no pretrained 4B tensor is loaded or forwarded.
 from accelerate import init_empty_weights
 from transformers import AutoConfig,Qwen3_5ForConditionalGeneration
 import torch
 config=AutoConfig.from_pretrained(p.parent,local_files_only=True,trust_remote_code=False)
 with init_empty_weights(include_buffers=True):model=Qwen3_5ForConditionalGeneration(config)
 require(all(v.is_meta for v in model.parameters()) and all(v.is_meta for v in model.buffers()),'architecture_must_be_meta_only')
 all_names=set(dict(model.named_modules()))
 _META_WEIGHT_SHAPES={n:tuple(mod.weight.shape) for n,mod in model.named_modules() if isinstance(getattr(mod,'weight',None),torch.Tensor)}
 modules=set(_META_WEIGHT_SHAPES);require(not any(n.startswith('mtp.') for n in all_names),'unexpected_mtp_architecture')
 del model;_INVENTORY=(modules,all_names)
 return _INVENTORY
def owner_with_checked_suffixes():
 require(sha(OLDPACK/'run_native15_expanded30.py')==ORIGIN_FILES['run_native15_expanded30.py'],'old_runner_changed')
 owner=import_file('closed_expanded30_owner',OLDPACK/'run_native15_expanded30.py')
 original=owner.check_config
 frozen=json.loads((ORIGIN/'adapter/adapter_config.json').read_text())
 modules,all_names=inventory()
 require(all(_META_WEIGHT_SHAPES[n]==owner.EXPECTED_SHAPES[n.rsplit('.',1)[-1]] for n in owner.EXPANDED_TARGETS),'meta_target_shape_changed')
 from peft import LoraConfig
 from peft.tuners.tuners_utils import check_target_module_exists
 def checked(config,targets):
  canonical=copy.deepcopy(config)
  if set(config.get('target_modules',[]))!=targets:
   require(targets==owner.EXPANDED_TARGETS and set(config.get('target_modules',[]))==set(frozen['target_modules']),'unobserved_target_serialization')
   cfg=LoraConfig(**config)
   resolved={n for n in all_names if check_target_module_exists(cfg,n)}
   require(resolved==targets and resolved<=modules,'resolved_target_scope_changed')
   canonical['target_modules']=sorted(targets)
  original(canonical,targets)
 owner.check_config=checked
 return owner,modules,all_names
def validate_plan(pack,*,execution=False):
 p=json.loads((pack/PLAN).read_text())
 fixed=dict(schema='cocolon.expanded15_saved_recovery_once.plan.v1',training_origin=str(ORIGIN),training_source_commit=SOURCE,training_origin_sha256=ORIGIN_FILES,adapter_sha256=ADAPTER,api_commit='6b043880504912481a6b10d93c9128ec4995b70b',output_directory=str(OUTPUT),optimizer_steps=0,before_calls=0,max_model_calls=15,max_seconds=2700,per_generation_seconds=180,gpu_hourly_usd=0.28,max_process_usd=0.21,pod_id='bkj4qvnhwtdqc2',expected_gpu_name='NVIDIA RTX A5000',retry=False,automatic_progression=False,product_accepted=False,gpu_lifecycle_operations=0)
 require(set(p)==set(fixed)|{'runner_sha256','status','gpu_run_authorized','approval_basis'},'recovery_plan_keys')
 for k,v in fixed.items():require(type(p[k]) is type(v) and p[k]==v,'recovery_plan_scope:'+k)
 require(sha(__file__)==p['runner_sha256'],'recovery_runner_changed')
 require(sha(pack/'consume_expanded15_recovery.py')==CONSUMER_SHA,'recovery_consumer_changed')
 require(p['status'] in {'PREPARED_AWAITING_MASH_APPROVAL','AUTHORIZED_ONCE_BOUND'},'recovery_plan_status')
 authorized=p['status']=='AUTHORIZED_ONCE_BOUND'
 require(type(p['gpu_run_authorized']) is bool and p['gpu_run_authorized']==authorized,'recovery_authorization')
 require((authorized and isinstance(p['approval_basis'],str) and p['approval_basis'].strip()) or (not authorized and p['approval_basis'] is None),'recovery_approval_basis')
 require(not execution or authorized,'execute_refused_new_recovery_approval_pending')
 return p
def prepare(pack):
 require(os.environ.get('HF_HUB_OFFLINE')==os.environ.get('TRANSFORMERS_OFFLINE')=='1','offline_required')
 new=validate_plan(pack);origin=validate_origin();owner,modules,names=owner_with_checked_suffixes()
 owner.validate_expanded_tensors(ORIGIN/'adapter')
 old,r,joint,tok,rows,cases,encoded,check=owner.prepare(OLDPACK)
 require(old['successor']==origin['plan']['successor'],'old_authorized_plan_changed')
 return new,origin,owner,r,tok,cases,dict(status='CPU_RECOVERY_PREPARED_NO_4B_EXECUTION',resolved_target_modules=56,lora_tensors=112,lora_parameters=3833856,weight_module_count=len(modules),all_module_name_count=len(names),origin_training_updates=30,this_run_training_updates=0,eval_cases=15,real_4b_reload_tested=False)
def execute(pack,source):
 require(len(source)==40 and all(c in '0123456789abcdef' for c in source),'new_source_commit_required')
 plan=validate_plan(pack,execution=True);OUTPUT.mkdir(exist_ok=False)
 started=time.monotonic();deadline=started+2700
 report=dict(status='STARTED_ONCE',source_commit=source,training_origin_source_commit=SOURCE,training_origin_sha256=ORIGIN_FILES,training_origin_updates=30,optimizer_steps_completed=0,stage='prepare',started_unix=time.time(),model_calls_started=0,model_calls_completed=0,base_model_loads_started=0,base_model_loads_completed=0,calls=[],adapter_sha256=ADAPTER,product_accepted=False,automatic_progression=False,retry=False,service_sql_calls=0)
 def checkpoint():report['seconds']=time.monotonic()-started;dump(OUTPUT/'run.json',report)
 def timeout(*_):raise TimeoutError('recovery_global_deadline_no_retry')
 signal.signal(signal.SIGALRM,timeout);signal.signal(signal.SIGTERM,timeout);signal.setitimer(signal.ITIMER_REAL,2700);model=None
 execution_hashes={}
 checkpoint()
 try:
  new,origin,owner,r,tok,cases,check=prepare(pack);report.update(plan=new,cpu_check=check)
  immutable_paths=[owner.LEGACY/'run_pilot.py',owner.JOINT/'run_quote_joint_fit.py',OLDPACK/'run_native15_expanded30.py',OLDPACK/'gpu15.plan.json',OLDPACK/'gpu15.proposed.json',OLDPACK/'gpu30_expanded.plan.json',OLDPACK/'run_native15.py',OLDPACK/'run_native15_afteronly.py']+[OLDPACK/n for n in PAYLOADS]+[owner.API/n for n in json.loads((ORIGIN/'api_blobs.json').read_text())]
  execution_hashes={str(p):sha(p) for p in immutable_paths};report['execution_source_sha256']=execution_hashes
  for n in ('train_messages.jsonl','eval_inputs.jsonl','cpu_preparation.json','api_blobs.json'):shutil.copyfile(ORIGIN/n,OUTPUT/n)
  shutil.copyfile(__file__,OUTPUT/Path(__file__).name);shutil.copyfile(pack/PLAN,OUTPUT/PLAN);shutil.copyfile(pack/'consume_expanded15_recovery.py',OUTPUT/'consume_expanded15_recovery.py')
  (OUTPUT/'training_origin').mkdir()
  for n in ORIGIN_FILES:shutil.copyfile(ORIGIN/n,OUTPUT/'training_origin'/n)
  shutil.copytree(ORIGIN/'adapter',OUTPUT/'adapter')
  import torch
  from transformers import StoppingCriteria,StoppingCriteriaList
  require(torch.cuda.device_count()==1 and os.environ.get('RUNPOD_POD_ID')==new['pod_id'],'bound_pod_or_gpu_count')
  report['gpu']=r.gpu_profile(torch,{'minimum_free_gib':14});require(report['gpu']['name']==new['expected_gpu_name'],'bound_gpu_name')
  torch.cuda.reset_peak_memory_stats();report.update(stage='loading_saved_inference_only',base_model_loads_started=1);checkpoint()
  model,tensors=owner.load_expanded_adapter(r,ORIGIN/'adapter',ADAPTER,trainable=False);report['base_model_loads_completed']=1;dump(OUTPUT/'reloaded_tensors.json',tensors)
  for case in cases:
   require(time.monotonic()<deadline-5 and report['model_calls_started']<15,'global_deadline_before_call')
   stop_at=min(deadline,time.monotonic()+180);triggered=False;original=model.generate
   class Bounded(StoppingCriteria):
    def __call__(self,*a,**kw):
     nonlocal triggered
     triggered=time.monotonic()>=stop_at;return triggered
   def generate(*a,**kw):
    kw['stopping_criteria']=StoppingCriteriaList([*list(kw.get('stopping_criteria') or []),Bounded()]);return original(*a,**kw)
   report.update(stage='after',model_calls_started=report['model_calls_started']+1);checkpoint();name='after_'+case['case_id']+'.jsonl';path=OUTPUT/name
   with patch.object(model,'generate',generate):r.evaluate(model,tok,[case],path,{'context_tokens':8192,'max_new_tokens':case['max_new_tokens']},adapter_revision=ADAPTER['adapter_model.safetensors'])
   raw=r.read_jsonl(path);require(len(raw)==1,'raw_count')
   report['model_calls_completed']+=1;report['calls'].append(dict(phase='after',case_id=case['case_id'],path=name,eos_reached=raw[0]['eos_reached'],timeout_triggered=triggered,raw_sha256=sha(path)));checkpoint()
   require(not triggered and time.monotonic()<stop_at,'per_call_or_global_deadline_no_retry')
  report.update(status='RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW',stage='raw_complete',peak_allocated_bytes=torch.cuda.max_memory_allocated(),peak_reserved_bytes=torch.cuda.max_memory_reserved())
 except BaseException as exc:report.update(status='STOPPED_NO_RETRY',error_type=type(exc).__name__,reason=str(exc),traceback=traceback.format_exc())
 finally:
  signal.setitimer(signal.ITIMER_REAL,0);report['processing_seconds']=time.monotonic()-started;report['process_cost_usd']=report['processing_seconds']*0.28/3600
  try:
   validate_origin();report['training_origin_unchanged']=True
   require(sha(__file__)==plan['runner_sha256'] and json.loads((pack/PLAN).read_text())==plan,'recovery_sources_changed')
   require(sha(pack/'consume_expanded15_recovery.py')==CONSUMER_SHA and sha(OUTPUT/'consume_expanded15_recovery.py')==CONSUMER_SHA,'recovery_consumer_changed_after_execution')
   require(all(sha(OUTPUT/n)==h for n,h in PAYLOADS.items()),'copied_frozen_payload_changed')
   require(execution_hashes and all(sha(p)==h for p,h in execution_hashes.items()),'execution_source_changed')
   if (OUTPUT/'adapter').exists():require(all(sha(OUTPUT/'adapter'/n)==h for n,h in ADAPTER.items()),'recovery_adapter_copy_changed')
   report['fixed_sources_unchanged']=True
  except BaseException as exc:report.update(status='STOPPED_IDENTITY_UNVERIFIED_NO_RETRY',final_identity_error=str(exc))
  checkpoint()
 print(json.dumps({k:report.get(k) for k in ('status','optimizer_steps_completed','model_calls_completed','processing_seconds','process_cost_usd')}),flush=True)
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--pack',type=Path,required=True);p.add_argument('--execute',action='store_true');p.add_argument('--source-commit');a=p.parse_args()
 if a.execute:execute(a.pack.resolve(),a.source_commit or '')
 else:
  require(os.environ.get('CUDA_VISIBLE_DEVICES')=='','cpu_only');*_,check=prepare(a.pack.resolve());print(json.dumps(check),flush=True)
