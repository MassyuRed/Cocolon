"""Saved after15 raw -> pinned CMEE; adopted snapshots only -> separate-process cold file read.

Successor of the closed before2 consumer. Never loads a model, calls a provider,
repairs raw, substitutes a teacher output, or uses service/SQL/Auth/HTTP/RN.
After-answer inputs retain their frozen teacher prior; this is not a dynamic thread.
"""
import os
os.environ.update(CUDA_VISIBLE_DEVICES='',HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
import argparse, copy, hashlib, json, signal, subprocess, sys, time
from dataclasses import replace
from pathlib import Path
from unittest.mock import patch
sys.dont_write_bytecode=True
API_COMMIT='6b043880504912481a6b10d93c9128ec4995b70b'
MODEL='Qwen/Qwen3.5-4B'
REVISION='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a'
EXAMPLES_SHA='fd73ddfeb5ed08a4451ed520ab01af54076c3b5e824e4bfeff326cf5cd69b0b5'
VERIFY_SHA='6c042267eeaa9dace4a63abd2ae1ad42f2486c722947a08ed3d1daf571a7684b'
HELPER_SHA='2f659078c05bee6d7b32f50aae8b9eebc03c767d4a3be084bc17e9e3ccc4c10d'
PAYLOADS={
 'train_messages.jsonl':'29f37e38f4a615220c739176a6eaa2e0e01aae36c7bb6f87db8be248aecd1772',
 'eval_inputs.jsonl':'c67fa4098bafa10508bf57bf1975fcdfd6f2359f851e34c0f26148310eb8b75e',
 'cpu_preparation.json':'64a7d905c4cfe3dbea227064e8aee053b23bff15baf51261f4a41c6478306f9d',
 'api_blobs.json':'69168896b25c6bf1e008592bdeff1e975a4a3b88ca3366487a094414d98b9e85'}
def require(ok,code):
 if not ok:raise ValueError(code)
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def canonical(v):return json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False)
def value_sha(v):return hashlib.sha256(canonical(v).encode()).hexdigest()
def dump(p,v):
 p=Path(p);t=p.with_suffix(p.suffix+'.tmp');t.write_text(json.dumps(v,ensure_ascii=False,indent=2,allow_nan=False)+'\n');t.replace(p)
def read_jsonl(p):return [json.loads(s) for s in Path(p).read_text().splitlines() if s.strip()]
def frozen_cases(run,examples_path):
 for name,expected in PAYLOADS.items():require(sha(run/name)==expected,'frozen_payload_changed:'+name)
 require(sha(examples_path)==EXAMPLES_SHA,'old_native_examples_changed')
 rows=read_jsonl(run/'train_messages.jsonl');cases=read_jsonl(run/'eval_inputs.jsonl');examples=read_jsonl(examples_path)
 require(len(rows)==len(cases)==15 and len(examples)==9,'frozen_case_count')
 ids=[c['case_id'] for c in cases]
 require(ids==[r['id'] for r in rows] and len(set(ids))==15 and ids[:9]==[r['id'] for r in examples],'frozen_case_order')
 native={}
 for i,(row,case) in enumerate(zip(rows,cases,strict=True)):
  require(case['messages']==row['messages'][:-1],'teacher_leak_or_eval_messages_changed')
  if i<9:native[row['id']]=copy.deepcopy(examples[i]['native_case'])
  else:
   r=row['runtime_request'];t=r['emlis_thread']
   require(set(r)=={'original','request_id','record_id','emlis_thread'} and r['record_id']==r['original']['id'],'runtime_request_shape')
   require(not t['admitted_history'] and not t['frame_feedback_sources'] and not t['rejected_frame_keys'] and t['prepared_meaning_checkpoint_ref'] is None,'unsupported_native_request_material')
   native[row['id']]=dict(original=r['original'],request_id=r['request_id'],thread_id=t['thread_id'],capability_snapshot=t['capability_snapshot'],question_control=t['question_control_context'],answers=t['answers'],current_round=t['current_round'],prior_snapshot_json=row['prior_adopted_snapshot'])
 for case in cases:
  n=native[case['case_id']];payload=json.loads(case['messages'][1]['content']);material=payload['material']
  require(material['sources'][0]['original']==n['original'],'native_original_source_mismatch')
  require(all(material['control'][k]==v for k,v in n['question_control'].items()),'native_question_control_mismatch')
  supplemental=[s for s in material['sources'] if s['role']=='SUPPLEMENTAL_ANSWER']
  require(len(supplemental)==len(n['answers']),'native_answer_count_mismatch')
  for source,answer in zip(supplemental,n['answers'],strict=True):
   require(source['source_id']==answer['answer_id'] and source['text_fields']['answer_text_private']==answer['answer_text_private'],'native_answer_source_mismatch')
  prior=n['prior_snapshot_json'];visible=payload['prior_adopted_interpretation']
  require((prior is None)==(visible is None),'native_prior_presence_mismatch')
  if prior:
   snapshot=json.loads(prior);require(snapshot['snapshot_ref']==visible['snapshot_ref'] and snapshot['meaning_packet']==visible['meaning_packet'],'native_frozen_prior_mismatch')
 return cases,native
def checked_raws(run,calls,ids,adapter,*,phase='after'):
 """Pure binding check; phase='before' is used only for local historical-raw review."""
 records=[];seen=[]
 for call in calls:
  require(call['phase']==phase,'unexpected_generation_phase')
  cid=call['case_id'];require(cid in ids and cid not in seen,'unknown_or_duplicate_case')
  require(ids.index(cid)>ids.index(seen[-1]) if seen else True,'raw_call_order_changed')
  require(Path(call['path']).name==call['path'] and call['path']==phase+'_'+cid+'.jsonl','raw_path_not_bound')
  path=run/call['path'];require(sha(path)==call['raw_sha256'],'raw_hash_changed')
  rows=read_jsonl(path);require(len(rows)==1,'raw_cardinality');raw=rows[0]
  require(raw['case_id']==cid and raw['model']==MODEL and raw['revision']==REVISION and raw['adapter_revision']==adapter,'raw_identity_changed')
  require(raw['provider']=='local_transformers' and sha_text(raw['raw_text'])==raw['raw_utf8_sha256'],'raw_text_identity_changed')
  require(type(raw['eos_reached']) is bool and raw['eos_reached']==call['eos_reached'] and raw['finish_reason']==('stop' if raw['eos_reached'] else 'length'),'raw_finish_reason_changed')
  require(raw['input_tokens']==raw['usage']['prompt_tokens'] and raw['output_tokens']==raw['usage']['completion_tokens']==len(raw['output_token_ids']),'raw_usage_changed')
  require(type(call['timeout_triggered']) is bool,'timeout_metadata_invalid')
  seen.append(cid);records.append((call,raw))
 return records
def sha_text(text):return hashlib.sha256(text.encode()).hexdigest()
def load_api(args):
 require(sha(args.legacy/'verify_cmee.py')==VERIFY_SHA and sha(args.legacy/'run_pilot.py')==HELPER_SHA,'consumer_legacy_helper_changed')
 sys.path[:0]=[str(args.api/'ai/tests'),str(args.api/'ai/services/ai_inference'),str(args.legacy),str(args.runtime_python)]
 from verify_cmee import json_value,reconstruct_request
 from cocolon_meaning_experience_engine import MeaningExperienceEngine
 from cocolon_meaning_experience_engine import emlis_semantic_admission as semantic
 from cocolon_meaning_experience_engine import preparation
 from cocolon_meaning_experience_engine.model_candidate_source import build_model_messages,ModelCandidateSource
 require(Path(semantic.__file__).resolve().is_relative_to(args.api),'another_api_loaded')
 for path,expected in json.loads((args.run/'api_blobs.json').read_text()).items():
  b=(args.api/path).read_bytes();require(hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==expected,'api_blob_changed:'+path)
 return json_value,reconstruct_request,MeaningExperienceEngine,semantic,preparation,build_model_messages,ModelCandidateSource
def validate_inputs_only(args):
 cases,native=frozen_cases(args.run,args.examples)
 _,reconstruct,_,_,preparation,build,_=load_api(args)
 for case in cases:
  req,prior=reconstruct({'native_case':native[case['case_id']]})
  require(build(req,prior,candidate_format=preparation.QUOTE_CANDIDATE_SCHEMA)==case['messages'],'frozen_prompt_or_prior_mismatch:'+case['case_id'])
 print(json.dumps(dict(status='CPU_NATIVE15_INPUT_BINDING_VERIFIED_NO_ADOPTION',cases=15,api_commit=API_COMMIT,model_calls=0,training_updates=0,cmee_adoptions=0,cold_processes=0,sql_operations=0,dynamic_prior=False)),flush=True)
def timeout(*_):raise TimeoutError('bounded_after15_cpu_no_retry')
def cold_worker(args):
 signal.signal(signal.SIGALRM,timeout);signal.alarm(60)
 j,reconstruct,Engine,semantic,preparation,_,Source=load_api(args)
 require(sha(args.saved_input)==args.expected_saved_sha256,'cold_saved_input_changed')
 saved=json.loads(args.saved_input.read_text());require(saved['api_commit']==API_COMMIT,'cold_api_changed')
 req,_=reconstruct({'native_case':saved['native_case']});modes=[]
 original=semantic._prepare_model_snapshot
 def resume_only(r,s):
  modes.append(s.mode);require(s.mode=='RESUME_ADOPTED','cold_fresh_adoption_forbidden');return original(r,s)
 def forbidden(*a,**k):raise AssertionError('cold_new_candidate_forbidden')
 with patch.object(semantic,'_prepare_model_snapshot',resume_only),patch.object(preparation,'receive_candidate',forbidden),patch.object(Source,'__call__',forbidden):
  p=semantic.restore_model_snapshot(req,saved['semantic_snapshot'])
  require(p.semantic_snapshot==saved['semantic_snapshot'] and p.checkpoint.checkpoint_id==saved['checkpoint_id'],'cold_checkpoint_changed')
  resumed=replace(req,emlis_thread=replace(req.emlis_thread,prepared_meaning_checkpoint_ref=saved['checkpoint_id']))
  out=Engine().generate(resumed,semantic_input=semantic.SemanticInput('RESUME_ADOPTED',snapshot_json=saved['semantic_snapshot'],semantic_profile=semantic.MODEL_PROFILE))
 require(modes and set(modes)=={'RESUME_ADOPTED'},'cold_resume_modes')
 require(value_sha(j(out))==saved['expected_full_outcome_sha256'],'cold_outcome_changed')
 completed=args.saved_input.with_name(args.saved_input.stem+'_completed.json')
 require(sha(completed)==saved['completed_file_sha256'],'completed_file_changed')
 # This completed artifact read is plain file I/O; no engine/author/provider is called here.
 require(json.loads(completed.read_text())==j(out),'completed_file_read_changed')
 require(not args.worker_output.exists(),'cold_output_exists')
 dump(args.worker_output,dict(status='ADOPTED_SNAPSHOT_COLD_FILE_EQUAL',case_id=saved['case_id'],process_id=os.getpid(),full_outcome=j(out),snapshot_unchanged=True,checkpoint_unchanged=True,resume_modes=modes,new_candidate_calls=0,fresh_adoptions=0,completed_file_retrieval_no_generation=True,saved_input_sha256=sha(args.saved_input)))
 signal.alarm(0)
def main(args):
 started=time.monotonic();signal.signal(signal.SIGALRM,timeout);signal.alarm(600)
 cases,native=frozen_cases(args.run,args.examples);ids=[c['case_id'] for c in cases];byid={c['case_id']:c for c in cases}
 r=json.loads((args.run/'run.json').read_text())
 require(r['source_commit']==args.expected_source_commit and r['status'] in {'RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW','STOPPED_NO_RETRY'},'source_run_identity_or_status')
 require(r['plan']['api_commit']==API_COMMIT,'run_api_commit_changed')
 require(r['plan']['initial_adapter_sha256']=={'README.md': '7716b0151793769140a76026939437398273346aefc3e5f75bb8ab2833b42885', 'adapter_config.json': '7f64972a9ff0ac07cec00d6b53f66dc4390efef4a2e566444a357c7ccd254fad', 'adapter_model.safetensors': '1d218763964ce0e1f0e587c754731c5476d70cdd16548020abf330912c518c1b'} and r['plan']['learning_rate']==1e-5 and r['plan']['loss']=='full_assistant_plus_eos_mean_cross_entropy_immutable_teacher_loss','continuation_initial_or_learning_changed')
 require(r['plan']['successor']['lora_tensor_count']==112 and r['plan']['successor']['lora_parameter_count']==3833856 and len(r['plan']['successor']['lora_target_modules'])==56 and r.get('expanded_initial_unchanged') is True,'expanded_lora_profile_or_initial_changed')
 for name,expected in r['plan']['expanded_initial_adapter_sha256'].items():require(sha(args.run/'initial_expanded_adapter'/name)==expected,'expanded_initial_saved_identity_changed:'+name)
 warm=json.loads((args.run/'warmstart_report.json').read_text());require(warm['old_tensors_exact']==32 and warm['new_B_zero']==40 and warm['total_tensors']==112 and warm['expanded_sha256']==r['plan']['expanded_initial_adapter_sha256'],'warmstart_provenance_changed')
 require(r['optimizer_steps_completed']==30 and r['plan']['before_ids']==[] and r['plan']['after_ids']==ids and r['plan']['max_model_calls']==15,'afteronly_training_or_scope')
 require(r['initial_adapter_unchanged'] is True and r['saved_adapter_unchanged_after_generation'] is True and r['fixed_sources_unchanged'] is True,'run_identity_unverified')
 require(sha(args.run/'run_native15_expanded30.py')==r['plan']['runner_sha256'],'source_runner_changed')
 steps=read_jsonl(args.run/'training.jsonl');order=r['plan']['update_order']
 require(len(steps)==len(order)==30 and all(s['step']==i+1 and s['id']==order[i] and s['row_index']==ids.index(order[i]) and s['training_pass']==i//15+1 for i,s in enumerate(steps)),'training_log_scope_changed')
 adapter=r['adapter_sha256']['adapter_model.safetensors']
 require(len(adapter)==64,'saved_adapter_identity_missing')
 records=checked_raws(args.run,r['calls'],ids,adapter)
 require([c['case_id'] for c,_ in records]==ids[:len(records)],'after_calls_not_completed_prefix')
 require(r['model_calls_completed']==len(records) and len(records)<=r['model_calls_started']<=15,'call_counters_changed')
 j,reconstruct,Engine,semantic,preparation,build,_=load_api(args)
 require(args.out.resolve()!=args.run.resolve(),'output_must_not_modify_run');args.out.mkdir(exist_ok=False)
 report=dict(status='CPU_AFTER15_STARTED',api_commit=API_COMMIT,source_run_sha256=sha(args.run/'run.json'),consumer_sha256=sha(__file__),cases=[],missing_after_ids=[x for x in ids if x not in [c['case_id'] for c,_ in records]],cold_file_checked_count=0,cold_file_failures=0,new_model_calls=0,training_updates=0,sql_operations=0,service_saved_roundtrip=False,dynamic_prior=False,product_accepted=False,automatic_progression=False)
 def checkpoint():
  report.update(meaning_adopted_count=sum(x['meaning_adopted'] for x in report['cases']),body_available_count=sum(x['body_available'] for x in report['cases']),seconds=time.monotonic()-started);dump(args.out/'diagnosis.json',report)
 checkpoint()
 try:
  for call,raw in records:
   cid=call['case_id'];req,prior=reconstruct({'native_case':native[cid]})
   require(build(req,prior,candidate_format=preparation.QUOTE_CANDIDATE_SCHEMA)==byid[cid]['messages'],'frozen_prompt_or_prior_mismatch:'+cid)
   material=preparation.prepare_emlis(req)
   receipt=preparation.receive_candidate(material,request_id=material.request_id,raw_output=raw['raw_text'],finish_reason=raw['finish_reason'],provider=raw['provider'],model=raw['model'],revision=raw['revision'],adapter_revision=raw['adapter_revision'],usage=raw['usage'],elapsed_seconds=raw['seconds'])
   row=dict(case_id=cid,phase='after',prompt_verified=True,identity_verified=True,raw_sha256=call['raw_sha256'],raw_record=raw,eos_reached=raw['eos_reached'],finish_reason=raw['finish_reason'],timeout_triggered=call['timeout_triggered'],receipt=j(receipt),prior_origin='FROZEN_TEACHER_ADOPTED_PRIOR' if prior else None,meaning_adopted=False,body_available=False,body=None,question=None,cold_file_status='NOT_APPLICABLE_WITHOUT_ADOPTED_SNAPSHOT')
   report['cases'].append(row);checkpoint()
   try:
    cp=Engine().prepare_emlis_update(req,semantic_input=semantic.SemanticInput('FRESH_CANDIDATE',receipt=receipt,prior_snapshot_json=prior,semantic_profile=semantic.MODEL_PROFILE))
    row.update(meaning_adopted=True,checkpoint=j(cp));resumed=replace(req,emlis_thread=replace(req.emlis_thread,prepared_meaning_checkpoint_ref=cp.checkpoint_id))
    out=Engine().generate(resumed,semantic_input=semantic.SemanticInput('RESUME_ADOPTED',snapshot_json=cp.semantic_snapshot,semantic_profile=semantic.MODEL_PROFILE))
    row.update(status='MEANING_AND_BODY_AVAILABLE' if out.artifact else 'MEANING_ADOPTED_BODY_UNAVAILABLE',body_available=out.artifact is not None,outcome=j(out),body=j(out.artifact),question=j(out.question))
    saved_path=args.out/(cid+'_saved.json');completed=saved_path.with_name(saved_path.stem+'_completed.json');dump(completed,j(out))
    dump(saved_path,dict(api_commit=API_COMMIT,case_id=cid,native_case=native[cid],semantic_snapshot=cp.semantic_snapshot,checkpoint_id=cp.checkpoint_id,source_raw_sha256=call['raw_sha256'],expected_full_outcome_sha256=value_sha(j(out)),completed_file_sha256=sha(completed)))
    cold_path=args.out/(cid+'_cold.json')
    cmd=[sys.executable,'-B',str(Path(__file__).resolve()),'--worker','--run',str(args.run),'--api',str(args.api),'--legacy',str(args.legacy),'--runtime-python',str(args.runtime_python),'--saved-input',str(saved_path),'--expected-saved-sha256',sha(saved_path),'--worker-output',str(cold_path)]
    try:
     child=subprocess.run(cmd,check=True,capture_output=True,text=True,timeout=min(60,max(1,600-(time.monotonic()-started))))
     cold=json.loads(cold_path.read_text());require(cold['process_id']!=os.getpid() and cold['full_outcome']==j(out),'cold_not_separate_or_changed')
     row.update(cold_file_status=cold['status'],cold_file_result=cold,cold_worker_stderr=child.stderr);report['cold_file_checked_count']+=1
    except (subprocess.SubprocessError,ValueError,OSError) as exc:
     row.update(cold_file_status='COLD_FILE_FAILED_NO_RETRY',cold_error_type=type(exc).__name__,cold_worker_stderr=getattr(exc,'stderr',None),cold_worker_returncode=getattr(exc,'returncode',None));report['cold_file_failures']+=1
   except semantic.SemanticNotAdopted as exc:row.update(status='SEMANTIC_NOT_ADOPTED',decision=exc.decision,reason_code=exc.reason_code)
   checkpoint()
  report['orphan_after_files_not_evaluated']=[p.name for p in args.run.glob('after_*.jsonl') if p.name not in {c['path'] for c,_ in records}]
  require(sha(args.run/'run.json')==report['source_run_sha256'],'run_changed_during_cpu_check')
  frozen_cases(args.run,args.examples)
  report['status']='CPU_AFTER15_DIAGNOSED_NOT_SERVICE_OR_PRODUCT_ACCEPTED';checkpoint()
 except BaseException as exc:
  report.update(status='CPU_DIAGNOSIS_STOPPED_NO_RETRY',error_type=type(exc).__name__);checkpoint();raise
 finally:signal.alarm(0)
 print(json.dumps({k:v for k,v in report.items() if k!='cases'},ensure_ascii=False),flush=True)
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--run',type=Path,default=Path('/workspace/cocolon_native15_expanded30_run_20261027'));p.add_argument('--out',type=Path,default=Path('/workspace/cocolon_native15_expanded30_diagnosis_20261027'));p.add_argument('--api',type=Path,default=Path('/workspace/cocolon_afteronly_api_20261027'));p.add_argument('--legacy',type=Path,default=Path('/workspace/cocolon_4b_service_binding_legacy_reference_20261025'));p.add_argument('--runtime-python',type=Path,default=Path('/workspace/cocolon_4b_service_runtime_20261025/python'));p.add_argument('--examples',type=Path,default=Path('/workspace/cocolon_4b_quote_joint_pack_20261026/sft_examples.jsonl'));p.add_argument('--expected-source-commit');p.add_argument('--validate-inputs-only',action='store_true');p.add_argument('--worker',action='store_true');p.add_argument('--saved-input',type=Path);p.add_argument('--expected-saved-sha256');p.add_argument('--worker-output',type=Path);a=p.parse_args()
 if a.validate_inputs_only:
  require(not a.worker,'incompatible_consumer_modes');validate_inputs_only(a)
 elif a.worker:
  require(a.saved_input is not None and a.expected_saved_sha256 and a.worker_output is not None,'cold_worker_arguments');cold_worker(a)
 else:
  require(type(a.expected_source_commit) is str and len(a.expected_source_commit)==40 and all(c in '0123456789abcdef' for c in a.expected_source_commit),'expected_source_commit_required');main(a)
