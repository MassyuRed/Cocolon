"""Proposed expanded30: preserve old q/v, add same-layer k/o and MLP; full CE and immutable teachers. Approval-pending execute refuses before effects."""
import argparse, gc, hashlib, importlib.metadata, importlib.util, json, math, os
from pathlib import Path
import random, shutil, signal, sys, time, traceback
from unittest.mock import patch
sys.dont_write_bytecode=True
LEGACY=Path('/workspace/cocolon_4b_service_binding_legacy_reference_20261025')
JOINT=Path('/workspace/cocolon_4b_quote_joint_pack_20261026')
API=Path('/workspace/cocolon_sixrow_api_20261026')
INITIAL=Path('/workspace/cocolon_native15_interleaved30_run_20261027/adapter')
OUTPUT=Path('/workspace/cocolon_native15_expanded30_run_20261027')
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
SUCCESSOR_PLAN='gpu30_expanded.plan.json'
AFTERONLY_RUNNER_SHA256='a62d3ed74e76a26c01fe66b9eba32d42631acac170cfd9c8dcb2c7cdf5076552'

EXPANDED_INITIAL=Path('/workspace/cocolon_native15_expanded30_pack_20261027/expanded_initial_adapter')
LAYERS=tuple(range(3,32,4))
OLD_TARGETS={f'model.language_model.layers.{i}.self_attn.{p}' for i in LAYERS for p in ('q_proj','v_proj')}
EXPANDED_TARGETS=OLD_TARGETS|{f'model.language_model.layers.{i}.{branch}.{p}' for i in LAYERS for branch,ps in [('self_attn',('k_proj','o_proj')),('mlp',('gate_proj','up_proj','down_proj'))] for p in ps}
NEW_TARGETS=EXPANDED_TARGETS-OLD_TARGETS
EXPECTED_SHAPES={'q_proj':(8192,2560),'k_proj':(1024,2560),'v_proj':(1024,2560),'o_proj':(2560,4096),'gate_proj':(9216,2560),'up_proj':(9216,2560),'down_proj':(2560,9216)}
def state_key(module,which):return 'base_model.model.'+module+'.lora_'+which+'.weight'
def expanded_state_shapes():
 return {state_key(m,w):((8,EXPECTED_SHAPES[m.split('.')[-1]][1]) if w=='A' else (EXPECTED_SHAPES[m.split('.')[-1]][0],8)) for m in EXPANDED_TARGETS for w in ('A','B')}
def check_config(config,targets):
 require(config.get('base_model_name_or_path')=='Qwen/Qwen3.5-4B' and set(config.get('target_modules',[]))==targets and config.get('r')==8 and config.get('lora_alpha')==16 and config.get('lora_dropout')==0 and config.get('bias')=='none' and not config.get('use_dora') and not config.get('use_rslora') and not config.get('fan_in_fan_out') and not config.get('modules_to_save') and config.get('task_type')=='CAUSAL_LM','adapter_config_scope_changed')
def cached_base_shapes():
 import struct
 from huggingface_hub.constants import HF_HUB_CACHE
 p=Path(HF_HUB_CACHE)/'models--Qwen--Qwen3.5-4B/snapshots/851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a'
 config=json.loads((p/'config.json').read_text())['text_config']
 require(config['hidden_size']==2560 and config['intermediate_size']==9216 and config['num_hidden_layers']==32 and [i for i,t in enumerate(config['layer_types']) if t=='full_attention']==list(LAYERS),'fixed_base_architecture_changed')
 index=json.loads((p/'model.safetensors.index.json').read_text())['weight_map'];headers={}
 for module in sorted(EXPANDED_TARGETS):
  name=module+'.weight';require(name in index,'base_weight_missing:'+name);shard=index[name]
  if shard not in headers:
   with (p/shard).open('rb') as f:n=struct.unpack('<Q',f.read(8))[0];headers[shard]=json.loads(f.read(n))
  require(tuple(headers[shard][name]['shape'])==EXPECTED_SHAPES[module.split('.')[-1]],'base_weight_shape_changed:'+name)
 return {'index_sha256':sha(p/'model.safetensors.index.json'),'config_sha256':sha(p/'config.json'),'modules':sorted(EXPANDED_TARGETS),'headers_only_no_base_weight_tensors_loaded':True}
def validate_expanded_tensors(directory,*,initial=False):
 import torch
 from safetensors.torch import load_file
 state=load_file(str(directory/'adapter_model.safetensors'),device='cpu');expected=expanded_state_shapes()
 require(set(state)==set(expected),'expanded_tensor_keys_changed')
 for key,shape in expected.items():require(tuple(state[key].shape)==shape and state[key].dtype==torch.float32 and torch.isfinite(state[key]).all().item(),'expanded_tensor_invalid:'+key)
 require(sum(t.numel() for t in state.values())==3833856,'expanded_parameter_count')
 check_config(json.loads((directory/'adapter_config.json').read_text()),EXPANDED_TARGETS)
 if initial:
  old=load_file(str(INITIAL/'adapter_model.safetensors'),device='cpu');require(set(old)=={state_key(m,w) for m in OLD_TARGETS for w in ('A','B')},'old_tensor_keys_changed')
  require(all(torch.equal(state[k],t) for k,t in old.items()),'old32_tensor_changed')
  require(all(torch.count_nonzero(state[state_key(m,'B')]).item()==0 for m in NEW_TARGETS),'new40_B_not_zero')
  require(all(torch.count_nonzero(state[state_key(m,'A')]).item()>0 for m in NEW_TARGETS),'new40_A_not_initialized')
 return state
def build_cpu_warmstart(pack):
 require(os.environ.get('CUDA_VISIBLE_DEVICES')=='' and os.environ.get('HF_HUB_OFFLINE')==os.environ.get('TRANSFORMERS_OFFLINE')=='1','cpu_offline_only')
 s=json.loads((pack/SUCCESSOR_PLAN).read_text());require(s['status']=='PREPARED_AWAITING_MASH_APPROVAL' and s['gpu_run_authorized'] is False and s['expanded_initial_adapter_sha256'] is None,'warmstart_only_unexecuted_pending_plan')
 require(not EXPANDED_INITIAL.exists() and not (pack/'warmstart_report.json').exists(),'warmstart_already_exists_no_rebuild')
 require(not OUTPUT.exists(),'gpu_output_already_exists')
 import torch
 from safetensors.torch import load_file,save_file
 require(not torch.cuda.is_initialized(),'cuda_already_initialized')
 actual={n:sha(INITIAL/n) for n in ('README.md','adapter_config.json','adapter_model.safetensors')};require(actual==s['initial_adapter_sha256'],'initial_adapter_changed')
 old=load_file(str(INITIAL/'adapter_model.safetensors'),device='cpu');config=json.loads((INITIAL/'adapter_config.json').read_text());check_config(config,OLD_TARGETS)
 base=cached_base_shapes();state={k:t.clone().contiguous() for k,t in old.items()};g=torch.Generator(device='cpu');g.manual_seed(s['warmstart_seed'])
 for module in sorted(NEW_TARGETS):
  outdim,indim=EXPECTED_SHAPES[module.split('.')[-1]]
  a=torch.empty((8,indim),dtype=torch.float32,device='cpu');torch.nn.init.kaiming_uniform_(a,a=math.sqrt(5),generator=g)
  state[state_key(module,'A')]=a;state[state_key(module,'B')]=torch.zeros((outdim,8),dtype=torch.float32,device='cpu')
 EXPANDED_INITIAL.mkdir(exist_ok=False);config['target_modules']=sorted(EXPANDED_TARGETS)
 dump(EXPANDED_INITIAL/'adapter_config.json',config);save_file(state,str(EXPANDED_INITIAL/'adapter_model.safetensors'),metadata={'format':'pt'})
 (EXPANDED_INITIAL/'README.md').write_text('# CPU-only expanded initialization\n\nOld initial1d32 tensors preserved exactly;40 added B matrices are zero; A is fixed-seed Kaiming. No 4B load/forward/training/generation. This is not a trained candidate.\n')
 validate_expanded_tensors(EXPANDED_INITIAL,initial=True)
 hashes={n:sha(EXPANDED_INITIAL/n) for n in ('README.md','adapter_config.json','adapter_model.safetensors')}
 s['expanded_initial_adapter_sha256']=hashes;dump(pack/SUCCESSOR_PLAN,s)
 report=dict(status='CPU_EXPANDED_INITIALIZATION_ONLY_NOT_TRAINED',base=base,old_modules=16,new_modules=40,total_modules=56,old_tensors_exact=32,new_B_zero=40,total_tensors=112,finite_f32=True,trainable_parameter_count=3833856,new_parameter_count=2916352,initial_sha256=actual,expanded_sha256=hashes,warmstart_seed=s['warmstart_seed'],formula_only_starting_function_unchanged=True,real_4b_forward_equality_measured=False,real_4b_model_loads=0,real_4b_forwards=0,training_updates=0,generation_calls=0,cuda_initialized=torch.cuda.is_initialized())
 dump(pack/'warmstart_report.json',report);return report
def load_expanded_adapter(r,directory,expected_hashes,*,trainable):
 import torch
 from peft import PeftModel,get_peft_model_state_dict
 require(r.adapter_hashes(directory)==expected_hashes,'expanded_adapter_hash_changed')
 expected=validate_expanded_tensors(directory)
 model=PeftModel.from_pretrained(r.load_base(),directory,is_trainable=trainable,local_files_only=True)
 actual=get_peft_model_state_dict(model)
 require(set(actual)==set(expected) and all(torch.equal(actual[k].detach().cpu(),v) for k,v in expected.items()),'expanded_adapter_load_incomplete_or_changed')
 params=[(n,p) for n,p in model.named_parameters() if 'lora_' in n]
 require(len(params)==112 and all(p.dtype==torch.float32 and torch.isfinite(p).all().item() for n,p in params),'expanded_loaded_tensors_invalid')
 require(sum(p.numel() for n,p in params)==3833856 and model.active_adapter=='default','expanded_loaded_scope')
 if trainable:require(len([p for p in model.parameters() if p.requires_grad])==112 and all(p.requires_grad for n,p in params),'expanded_trainable_scope')
 else:
  model.eval();require(not any(p.requires_grad for p in model.parameters()),'expanded_reload_must_be_inference_only')
 stats=[dict(name=n,shape=list(p.shape),dtype=str(p.dtype),finite=True,norm=float(p.detach().float().norm().cpu())) for n,p in params]
 return model,stats

SUCCESSOR_FIXED={
 'schema':'cocolon.native15_expanded30_once.plan.v1',
 'predecessor_source_commit':'179acbd2b3c3d13de3a3adc1fa8bbc1d9799d384',
 'predecessor_plan_sha256':PREDECESSOR_PLAN_SHA256,
 'predecessor_runner_sha256':PREDECESSOR_RUNNER_SHA256,
 'api_commit':'6b043880504912481a6b10d93c9128ec4995b70b',
 'initial_adapter_sha256':{'README.md': '7716b0151793769140a76026939437398273346aefc3e5f75bb8ab2833b42885', 'adapter_config.json': '7f64972a9ff0ac07cec00d6b53f66dc4390efef4a2e566444a357c7ccd254fad', 'adapter_model.safetensors': '1d218763964ce0e1f0e587c754731c5476d70cdd16548020abf330912c518c1b'},
 'initial_adapter_directory':str(INITIAL),
 'expanded_initial_adapter_directory':str(EXPANDED_INITIAL),
 'lora_target_modules':sorted(EXPANDED_TARGETS),'lora_tensor_count':112,'lora_parameter_count':3833856,'warmstart_seed':20261027,
 'learning_rate':1e-5,
 'loss':'full_assistant_plus_eos_mean_cross_entropy_immutable_teacher_loss',
 'initial_checkpoint_source_commit':'e107b09535bfcf656cb97100a7434c66ca2c3740',
 'initial_checkpoint_owner':'interleaved30_result/run.json',
 'before_ids':[], 'max_model_calls':15, 'max_seconds':2700,
 'optimizer_steps':30, 'training_passes':2, 'update_order':['TRAIN-SERVICE-CHAIR-01-INITIAL', 'FT-BOOK-INITIAL', 'TRAIN-DAILY-CALM-01-INITIAL', 'TRAIN-SERVICE-CHAIR-01-CORRECTION', 'FT-BOOK-AFTER-ANSWER', 'TRAIN-SERVICE-CHAIR-02-INITIAL', 'FT-SHOP-INITIAL', 'TRAIN-DAILY-CALM-02-INITIAL', 'TRAIN-SERVICE-CHAIR-02-CORRECTION', 'FT-SHOP-AFTER-ANSWER', 'TRAIN-SERVICE-CHAIR-03-INITIAL', 'FT-REPOT-INITIAL', 'TRAIN-DAILY-CALM-03-INITIAL', 'TRAIN-SERVICE-CHAIR-03-CORRECTION', 'FT-KNIT-INITIAL', 'FT-SHOP-INITIAL', 'TRAIN-SERVICE-CHAIR-03-INITIAL', 'TRAIN-DAILY-CALM-02-INITIAL', 'FT-SHOP-AFTER-ANSWER', 'TRAIN-SERVICE-CHAIR-03-CORRECTION', 'FT-BOOK-INITIAL', 'TRAIN-SERVICE-CHAIR-01-INITIAL', 'TRAIN-DAILY-CALM-03-INITIAL', 'FT-BOOK-AFTER-ANSWER', 'TRAIN-SERVICE-CHAIR-01-CORRECTION', 'FT-REPOT-INITIAL', 'TRAIN-SERVICE-CHAIR-02-INITIAL', 'TRAIN-DAILY-CALM-01-INITIAL', 'FT-KNIT-INITIAL', 'TRAIN-SERVICE-CHAIR-02-CORRECTION'],
 'per_generation_seconds':180,
 'output_directory':str(OUTPUT),
 'deadline_scope':'Global 2700 seconds covers loading, expanded30 updates, separate adapter save/non-training reload in a new model object within the same OS process and after15 only. Final hash/archive/recovery can take additional time; not an OS hard-stop guarantee. All 15 calls are not guaranteed to complete.',
 'baseline_policy':'No new before calls. Initial checkpoint 1d218763 has saved same-quote15 after outputs from interleaved30_result. They are the fixed baseline for this continuation; no missing before case is synthesized. Compare all15 with initial 1d218763, continuation30 dd1188e8 and ordered30 483d74b7; known-teacher FIT only.',
 'baseline_evidence':[
  'interleaved30_result/after_*.jsonl',
  'continuation30_result/after_*.jsonl','ordered30_result/after_*.jsonl'],
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
 variable={'runner_sha256','status','gpu_run_authorized','approval_basis','expected_gpu_name','pod_id','gpu_hourly_usd','max_process_usd','expanded_initial_adapter_sha256'}
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
 hashes=s['expanded_initial_adapter_sha256'];require(type(hashes) is dict and set(hashes)=={'README.md','adapter_config.json','adapter_model.safetensors'} and all(type(v) is str and len(v)==64 for v in hashes.values()),'expanded_initial_identity_unresolved')
 return s

def prepare(pack):
 require(os.environ.get('HF_HUB_OFFLINE')==os.environ.get('TRANSFORMERS_OFFLINE')=='1','offline_required')
 plan=json.loads((pack/'gpu15.plan.json').read_text());proposal=json.loads((pack/'gpu15.proposed.json').read_text())
 require(sha(pack/'gpu15.proposed.json')==PROPOSAL_SHA,'proposal_changed')
 require({k:v for k,v in plan.items() if k in proposal}=={**proposal,'status':'AUTHORIZED_ONCE','gpu_run_authorized':True,'implementation_required':False},'approved_scope_changed')
 require(plan.get('approval_basis')=='Mash explicit approval of 5ba8c370 native15-gpu-proposal: 進めていいよ。','approval_missing')
 successor=validate_successor(pack)
 plan={**plan,**{k:successor[k] for k in ('before_ids','max_model_calls','max_seconds','per_generation_seconds','gpu_hourly_usd','max_process_usd','baseline_policy','deadline_scope','optimizer_steps','training_passes','update_order','initial_adapter_sha256','learning_rate','loss','expanded_initial_adapter_directory','expanded_initial_adapter_sha256','lora_target_modules','lora_tensor_count','lora_parameter_count','warmstart_seed')},'successor':successor,'runner_sha256':successor['runner_sha256'],'status':successor['status'],'gpu_run_authorized':successor['gpu_run_authorized'],'approval_basis':successor['approval_basis'],'existing_pod':successor['pod_id'],'gpu':successor['expected_gpu_name'],'new_pod':False}
 plan['epochs']=successor['training_passes']
 plan['initial_adapter_directory']=successor['initial_adapter_directory']
 plan['strict_optimizer_resume']=False
 for n,s in proposal['payloads'].items():
  p=pack/n;require(p.is_file() and not p.is_symlink() and p.stat().st_size==s['bytes'] and sha(p)==s['sha256'],'payload_changed:'+n)
 require(sha(LEGACY/'run_pilot.py')==HELPER_SHA and sha(JOINT/'run_quote_joint_fit.py')==JOINT_SHA,'immutable_helper_changed')
 for path,expected in json.loads((pack/'api_blobs.json').read_text()).items():
  b=(API/path).read_bytes();require(hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==expected,'api_blob_changed:'+path)
 sys.path.insert(0,str(LEGACY));import run_pilot as r
 versions={n:importlib.metadata.version(n) for n in r.PINS};require(versions==r.PINS,'dependency_changed')
 spec=importlib.util.spec_from_file_location('native15_archive_owner',JOINT/'run_quote_joint_fit.py');joint=importlib.util.module_from_spec(spec);spec.loader.exec_module(joint)
 require(r.adapter_hashes(INITIAL)==plan['initial_adapter_sha256'],'initial_adapter_changed')
 require(r.adapter_hashes(EXPANDED_INITIAL)==plan['expanded_initial_adapter_sha256'],'expanded_initial_adapter_changed');validate_expanded_tensors(EXPANDED_INITIAL,initial=True)
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
 return plan,r,joint,tok,rows,cases,encoded,dict(status='CPU_RUNNER_READY_MODEL_NOT_LOADED',rows=stats,dependency_versions=versions,runner_sha256=sha(__file__),proposal_sha256=PROPOSAL_SHA,initial_adapter_sha256=plan['initial_adapter_sha256'],initial_adapter_directory=str(INITIAL),learning_rate=plan['learning_rate'],loss=plan['loss'],strict_optimizer_resume=False,expanded_initial_adapter_sha256=plan['expanded_initial_adapter_sha256'],lora_modules=56,lora_tensors=112,lora_parameters=3833856)
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
  shutil.copyfile(__file__,OUTPUT/'run_native15_expanded30.py')
  shutil.copytree(EXPANDED_INITIAL,OUTPUT/'initial_expanded_adapter')
  shutil.copyfile(pack/'warmstart_report.json',OUTPUT/'warmstart_report.json')
  import torch
  from peft import PeftModel
  from transformers import StoppingCriteria,StoppingCriteriaList
  require(torch.cuda.device_count()==1,'one_gpu_required');report['gpu']=r.gpu_profile(torch,{'minimum_free_gib':14});require(report['gpu']['name']==successor['expected_gpu_name'],'bound_gpu_name_mismatch');require(os.environ.get('RUNPOD_POD_ID')==successor['pod_id'],'bound_pod_id_mismatch')
  config=json.loads((INITIAL/'adapter_config.json').read_text())
  require(config.get('base_model_name_or_path')==r.MODEL and set(config.get('target_modules',[]))==r.EXPECTED_TARGETS and config.get('r')==8 and config.get('lora_alpha')==16 and config.get('lora_dropout')==0 and config.get('bias')=='none','adapter_config_changed')
  torch.cuda.reset_peak_memory_stats();report.update(stage='loading_initial',base_model_loads_started=1);checkpoint()
  model,_=load_expanded_adapter(r,EXPANDED_INITIAL,plan['expanded_initial_adapter_sha256'],trainable=True)
  trainable=[(n,p) for n,p in model.named_parameters() if p.requires_grad]
  require(len(trainable)==112 and sum(p.numel() for n,p in trainable)==3833856 and all('lora_' in n and ('.self_attn.' in n or '.mlp.' in n) and str(p.dtype)=='torch.float32' and torch.isfinite(p).all().item() for n,p in trainable),'trainable_scope')
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
  # Continue from saved 1d218763 with full assistant/EOS CE and LR1e-5.
  # This is a new run with a fresh optimizer, not exact optimizer/RNG resume.
  row_index={row['id']:i for i,row in enumerate(rows)}
  random.seed(plan['seed']);torch.manual_seed(plan['seed']);torch.cuda.manual_seed_all(plan['seed'])
  model.config.use_cache=False;model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={'use_reentrant':False});model.enable_input_require_grads();model.train()
  optimizer=torch.optim.AdamW([p for n,p in trainable],lr=plan['learning_rate'],weight_decay=0.)
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
  model,tensors=load_expanded_adapter(r,OUTPUT/'adapter',report['adapter_sha256'],trainable=False);dump(OUTPUT/'reloaded_tensors.json',tensors)
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
   report['expanded_initial_unchanged']=r.adapter_hashes(EXPANDED_INITIAL)==report['plan']['expanded_initial_adapter_sha256']
   report['saved_adapter_unchanged_after_generation']=r.adapter_hashes(OUTPUT/'adapter')==report['adapter_sha256'] if 'adapter_sha256' in report else None
   report['fixed_sources_unchanged']=sha(__file__)==report['plan']['runner_sha256'] and sha(pack/'gpu15.plan.json')==PREDECESSOR_PLAN_SHA256 and sha(pack/'gpu15.proposed.json')==PROPOSAL_SHA and sha(pack/'run_native15.py')==PREDECESSOR_RUNNER_SHA256 and json.loads((pack/SUCCESSOR_PLAN).read_text())==successor and sha(LEGACY/'run_pilot.py')==HELPER_SHA and sha(JOINT/'run_quote_joint_fit.py')==JOINT_SHA and sha(pack/'run_native15_afteronly.py')==AFTERONLY_RUNNER_SHA256 and all(sha(pack/n)==s['sha256'] for n,s in report['plan']['payloads'].items())
   if not report['initial_adapter_unchanged'] or not report['expanded_initial_unchanged'] or not report['fixed_sources_unchanged'] or report['saved_adapter_unchanged_after_generation'] is False:report['status']='STOPPED_IDENTITY_MISMATCH_NO_RETRY'
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
  require(os.environ.get('CUDA_VISIBLE_DEVICES')=='','cpu_check_only');*_,check=prepare(a.pack.resolve());dump(a.pack/'gpu_expanded30_runner_cpu_check.json',check);print(check['status'],flush=True)
