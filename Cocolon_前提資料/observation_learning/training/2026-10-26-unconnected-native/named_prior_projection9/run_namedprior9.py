"""One new bounded named-wire continuation from saved284f; same teachers/readers."""
import argparse,gc,hashlib,importlib.util,json,math,os,random,signal,sys,time,traceback
from pathlib import Path
from unittest.mock import patch
sys.dont_write_bytecode=True
ROOT=Path('/workspace/cocolon_namedprior9_root_20261028')
OUTPUT=Path('/workspace/cocolon_namedprior9_run_20261028')
INITIAL_ADAPTER=Path('/workspace/cocolon_named9_initial_20261028')
INITIAL='284f1df77c828982bdb7c2480f3f269b71dc9d69a29ea36b48dc6d25ab807d23'
IDS=['FT-BOOK-AFTER-ANSWER','FT-SHOP-AFTER-ANSWER']
ORDER=['TRAIN-SERVICE-CHAIR-01-INITIAL', 'FT-BOOK-AFTER-ANSWER', 'FT-SHOP-AFTER-ANSWER', 'TRAIN-SERVICE-CHAIR-01-CORRECTION', 'FT-BOOK-AFTER-ANSWER', 'FT-SHOP-AFTER-ANSWER', 'TRAIN-DAILY-CALM-01-INITIAL', 'FT-BOOK-AFTER-ANSWER', 'FT-SHOP-AFTER-ANSWER']
FIXED=dict(schema='cocolon.named_prior_projection9_once.v1',initial_adapter_sha256=INITIAL,base_api_commit='a8be7a9bceed35a9f3cb843f22de05bbd5bc6e18',initial_adapter_source_run_sha256='a88d1abbad541cee1e6b958a4cb263c859fd5ab69df8b562dcbd8b33d076e999',candidate_format='cocolon.cmee.named_reference_candidate.v1',max_new_tokens_by_case={IDS[0]:3712,IDS[1]:3584},pod_id='94a06hhxu51uy4',expected_gpu_name='NVIDIA RTX A5000',output_directory=str(OUTPUT),optimizer_steps=9,update_order=ORDER,before_calls=0,max_model_calls=2,case_ids=IDS,max_seconds=600,per_generation_seconds=180,gpu_hourly_usd=.28,max_process_usd=.047,learning_rate=5e-5,seed=20261024,gradient_clip=1.0,loss_extra_weight=15,adaptive_gamma=2.0,retention3_original_ce=True,context_tokens=8192,optimizer_resume=False,retry=False,gpu_lifecycle_operations=0,sql_operations=0,product_credit=0,candidate_ready=False,automatic_progression=False)
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def dump(p,v):
 temp=p.with_suffix(p.suffix+'.tmp');temp.write_text(json.dumps(v,ensure_ascii=False,indent=2,allow_nan=False)+'\n');temp.replace(p)
def module(name,p):
 s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);sys.modules[name]=m;s.loader.exec_module(m);return m
def validate(pack,execution=False):
 plan=json.loads((pack/'namedprior9.plan.json').read_text())
 extra={'status','gpu_run_authorized','approval_basis','runner_sha256','cpu_check_sha256','eval_inputs_sha256','train_messages_sha256','loss_sha256','consumer_sha256','api_commit','api_source_manifest_sha256'}
 assert set(plan)==set(FIXED)|extra
 for k,v in FIXED.items():assert type(plan[k]) is type(v) and plan[k]==v,k
 authorized=plan['status']=='AUTHORIZED_ONCE_BOUND'
 assert plan['status'] in ('PREPARED_AWAITING_FINAL_CPU_REVIEW','AUTHORIZED_ONCE_BOUND')
 assert type(plan['gpu_run_authorized']) is bool and plan['gpu_run_authorized']==authorized
 assert (authorized and type(plan['approval_basis']) is str and plan['approval_basis'].strip()) or (not authorized and plan['approval_basis'] is None)
 if execution and not authorized:raise ValueError('named9_authorization_required_before_output_or_model')
 assert sha(__file__)==plan['runner_sha256']
 for n,key in [('actual_cpu_check.json','cpu_check_sha256'),('eval_inputs.json','eval_inputs_sha256'),('train_messages.jsonl','train_messages_sha256'),('adaptive_loss.py','loss_sha256'),('consume_named9.py','consumer_sha256')]:assert sha(pack/n)==plan[key],n
 cpu=json.loads((pack/'actual_cpu_check.json').read_text())
 assert cpu['status']=='CPU_NAMEDPRIOR9_READY_NO_MODEL_EXECUTION' and cpu['optimizer_steps']==9 and cpu['changed_prompts']==IDS
 assert cpu['only_two_named_prompts_changed'] and cpu['fresh_same_family_tests_passed'] and cpu['inherited_112_f32_finite'] and cpu['schedule_counts_verified']
 assert all(sha(pack/n)==h for n,h in cpu['payload_sha256'].items())
 assert sha(ROOT/'restore_payload.json')==cpu['source_manifest_sha256']
 for f in json.loads((ROOT/'restore_payload.json').read_text())['files']:assert sha(ROOT/f['path'])==f['sha256'],f['path']
 assert sha(pack/'api_source_manifest.json')==plan['api_source_manifest_sha256']
 api=json.loads((pack/'api_source_manifest.json').read_text())
 assert api['api_commit']==plan['api_commit'] and len(plan['api_commit'])==40
 for f in api['files']:assert sha(ROOT/'api'/f['path'])==f['sha256']
 assert sha(INITIAL_ADAPTER/'adapter_model.safetensors')==INITIAL
 assert sha(Path('/workspace/cocolon_named13_run_20261028/run.json'))==plan['initial_adapter_source_run_sha256']
 assert sha(Path('/workspace/cocolon_named13_run_20261028/adapter/adapter_model.safetensors'))==INITIAL
 assert sha(ROOT/'adapter/adapter_model.safetensors')=='d431a07ce227c05e81eca5afb9461d91cf8101d50af0d27ec1a81844ce8ac684'
 return plan,cpu
def execute(pack,source):
 plan,cpu=validate(pack,True);assert len(source)==40 and all(c in '0123456789abcdef' for c in source)
 args=(Path('/proc')/str(os.getppid())/'cmdline').read_bytes().split(bytes([0]))
 assert args[0].rsplit(b'/',1)[-1]==b'timeout' and all(x in args for x in (b'--signal=TERM',b'--kill-after=10s',b'590s'))
 OUTPUT.mkdir(exist_ok=False);started=time.monotonic();deadline=started+600
 report=dict(status='STARTED_ONCE',source_commit=source,plan=plan,stage='preparing',optimizer_steps_started=0,optimizer_steps_completed=0,training_forwards_started=0,training_forwards_completed=0,model_loads_started=0,model_loads_completed=0,model_calls_started=0,model_calls_completed=0,calls=[],training_updates=0,retry=False,automatic_progression=False,product_credit=0,gpu_lifecycle_operations=0,sql_operations=0)
 model=None;optimizer=None;trainable=None;initial=None;ids=None;labels=None;value=None;original=None;generate=None;r=None
 def checkpoint():report['elapsed_seconds']=time.monotonic()-started;dump(OUTPUT/'run.json',report)
 def stop(*_):raise TimeoutError('named9_deadline_no_retry')
 signal.signal(signal.SIGALRM,stop);signal.signal(signal.SIGTERM,stop);signal.setitimer(signal.ITIMER_REAL,600);checkpoint()
 try:
  assert os.environ.get('HF_HUB_OFFLINE')==os.environ.get('TRANSFORMERS_OFFLINE')=='1'
  assert sha(ROOT/'check_adapter_cpu.py')=='e5ad2054c5d8b4abc5e1487c370e7eba355dbd432e1e0d086ea0d445c2063953'
  check=module('named9_saved_adapter_owner',ROOT/'check_adapter_cpu.py');r,owner,_,_=check.existing_loaders(ROOT)
  from transformers import AutoTokenizer,StoppingCriteria,StoppingCriteriaList
  import importlib.metadata,torch
  assert {n:importlib.metadata.version(n) for n in r.PINS}==r.PINS
  assert os.environ.get('RUNPOD_POD_ID')==plan['pod_id'] and torch.cuda.device_count()==1
  report['gpu']=r.gpu_profile(torch,{'minimum_free_gib':14});assert report['gpu']['name']==plan['expected_gpu_name']
  tok=AutoTokenizer.from_pretrained(r.MODEL,revision=r.REVISION,local_files_only=True,trust_remote_code=False)
  rows=r.read_jsonl(pack/'train_messages.jsonl');encoded={row['id']:r.encode_training(tok,row['messages'],context=8192)[0] for row in rows}
  byid={c['case_id']:c for c in json.loads((pack/'eval_inputs.json').read_text())};cases=[byid[cid] for cid in IDS]
  assert [c['max_new_tokens'] for c in cases]==[3712,3584]
  loss=module('named9_unchanged_adaptive_loss',pack/'adaptive_loss.py');torch.cuda.reset_peak_memory_stats()
  hashes=r.adapter_hashes(INITIAL_ADAPTER);report.update(stage='loading_284f_trainable',model_loads_started=1);checkpoint()
  model,tensors=owner.load_expanded_adapter(r,INITIAL_ADAPTER,hashes,trainable=True);report['model_loads_completed']=1;dump(OUTPUT/'initial_loaded_tensors.json',tensors)
  trainable=[(n,p) for n,p in model.named_parameters() if p.requires_grad];assert len(trainable)==len(tensors)==112
  initial={n:p.detach().cpu().clone() for n,p in trainable}
  random.seed(plan['seed']);torch.manual_seed(plan['seed']);torch.cuda.manual_seed_all(plan['seed'])
  model.config.use_cache=False;model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={'use_reentrant':False});model.enable_input_require_grads();model.train()
  optimizer=torch.optim.AdamW([p for _,p in trainable],lr=plan['learning_rate'],weight_decay=0.)
  with (OUTPUT/'training.jsonl').open('x') as stream:
   for step,cid in enumerate(ORDER,1):
    assert time.monotonic()<deadline-5
    e=encoded[cid];ids=torch.tensor([e['input_ids']],dtype=torch.long,device='cuda:0');labels=torch.tensor([e['labels']],dtype=torch.long,device='cuda:0')
    optimizer.zero_grad(set_to_none=True);report.update(stage='training:'+cid,training_forwards_started=step);checkpoint()
    value=loss.teacher_loss(model,r,input_ids=ids,attention_mask=torch.ones_like(ids),labels=labels,encoded=e,adaptive=cid in IDS)
    report['training_forwards_completed']=step;assert torch.isfinite(value).item();value.backward()
    norm=float(torch.nn.utils.clip_grad_norm_([p for _,p in trainable],1.,error_if_nonfinite=True).cpu());assert math.isfinite(norm) and norm>0
    report['optimizer_steps_started']=step;checkpoint();optimizer.step();report.update(optimizer_steps_completed=step,training_updates=step)
    stream.write(json.dumps(dict(step=step,id=cid,loss=float(value.detach().cpu()),adaptive=cid in IDS,target_tokens=sum(x!=-100 for x in e['labels']),gradient_norm=norm))+'\n');stream.flush();checkpoint();ids=None;labels=None;value=None
  optimizer.zero_grad(set_to_none=True);optimizer=None
  assert all(torch.isfinite(p).all().item() for _,p in trainable)
  report['changed_tensors']=sum(not torch.equal(initial[n],p.detach().cpu()) for n,p in trainable);assert report['changed_tensors']>0
  model.save_pretrained(OUTPUT/'adapter',safe_serialization=True);report.update(stage='saved_before_nontraining_reload',adapter_sha256=r.adapter_hashes(OUTPUT/'adapter'));assert report['adapter_sha256']['adapter_model.safetensors']!=INITIAL;checkpoint()
  initial=None;trainable=None;model=None;gc.collect();torch.cuda.empty_cache()
  report.update(stage='loading_saved_inference_only',model_loads_started=2);checkpoint()
  model,tensors=owner.load_expanded_adapter(r,OUTPUT/'adapter',report['adapter_sha256'],trainable=False)
  assert len(tensors)==112 and not any(p.requires_grad for p in model.parameters());report['model_loads_completed']=2;dump(OUTPUT/'reloaded_tensors.json',tensors)
  for case in cases:
   assert time.monotonic()<deadline-5 and report['model_calls_started']<2
   stop_at=min(deadline,time.monotonic()+180);triggered=False;original=model.generate
   class Bounded(StoppingCriteria):
    def __call__(self,*a,**kw):
     nonlocal triggered
     triggered=time.monotonic()>=stop_at;return triggered
   def generate(*a,**kw):
    kw['stopping_criteria']=StoppingCriteriaList([*list(kw.get('stopping_criteria') or []),Bounded()]);return original(*a,**kw)
   report['model_calls_started']+=1;report['stage']='after:'+case['case_id'];checkpoint();path=OUTPUT/('after_'+case['case_id']+'.jsonl')
   with patch.object(model,'generate',generate):r.evaluate(model,tok,[case],path,{'context_tokens':8192,'max_new_tokens':case['max_new_tokens']},adapter_revision=report['adapter_sha256']['adapter_model.safetensors'])
   raw=r.read_jsonl(path);assert len(raw)==1;report['model_calls_completed']+=1;report['calls'].append(dict(case_id=case['case_id'],path=path.name,raw_sha256=sha(path),eos_reached=raw[0]['eos_reached'],timeout_triggered=triggered));checkpoint()
   assert not triggered and time.monotonic()<stop_at,'generation_timeout_no_retry'
  assert r.adapter_hashes(OUTPUT/'adapter')==report['adapter_sha256']
  report.update(status='RAW_COMPLETE_PENDING_CMEE_AND_BODY_REVIEW',stage='raw_complete',peak_allocated_bytes=torch.cuda.max_memory_allocated(),peak_reserved_bytes=torch.cuda.max_memory_reserved())
 except BaseException as exc:
  report.update(status='STOPPED_NO_RETRY',error_type=type(exc).__name__,reason=str(exc),traceback=traceback.format_exc())
  if model is not None and report['optimizer_steps_started']>0 and 'adapter_sha256' not in report:
   try:
    ids=None;labels=None;value=None;optimizer=None;gc.collect();model.save_pretrained(OUTPUT/'partial_adapter',safe_serialization=True);report.update(partial_adapter_sha256=r.adapter_hashes(OUTPUT/'partial_adapter'),partial_adapter_not_promoted=True)
   except BaseException as save_exc:report['partial_adapter_preservation_error']=str(save_exc)
 finally:
  original=None;generate=None;model=None;optimizer=None;trainable=None;initial=None;ids=None;labels=None;value=None;gc.collect()
  if 'torch' in sys.modules and sys.modules['torch'].cuda.is_initialized():sys.modules['torch'].cuda.empty_cache();report['post_release_allocated_bytes']=sys.modules['torch'].cuda.memory_allocated()
  try:
   assert validate(pack)[0]==plan;assert r is not None and r.adapter_hashes(INITIAL_ADAPTER)==hashes;report['initial_284f_and_sources_unchanged']=True
   if 'adapter_sha256' in report:assert r.adapter_hashes(OUTPUT/'adapter')==report['adapter_sha256']
  except BaseException as exc:report.update(status='STOPPED_IDENTITY_UNVERIFIED_NO_RETRY',final_identity_error=str(exc))
  signal.setitimer(signal.ITIMER_REAL,0);report['processing_seconds']=time.monotonic()-started;report['process_cost_usd']=report['processing_seconds']*.28/3600;checkpoint()
 print(json.dumps({k:report.get(k) for k in ('status','optimizer_steps_completed','model_calls_completed','processing_seconds','process_cost_usd')}),flush=True)
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--pack',type=Path,required=True);p.add_argument('--execute',action='store_true');p.add_argument('--source-commit',default='');a=p.parse_args()
 if a.execute:execute(a.pack.resolve(),a.source_commit)
 else:plan,cpu=validate(a.pack.resolve());print('NAMED9_VALIDATED_NO_MODEL',len(plan['update_order']))

