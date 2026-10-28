"""Derive two shorter teachers and prove equivalence with actual CPU owners."""
import argparse,hashlib,importlib.util,json,os,shutil,subprocess,sys,time
from dataclasses import replace
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path('/workspace/cocolon_fullce9_root_20261028')
OLD=Path('/workspace/cocolon_fullce9_pack_20261028')
PACK=Path('/workspace/cocolon_compact9_pack_20261028')
SRC=Path(__file__).resolve().parent
IDS=['FT-BOOK-AFTER-ANSWER','FT-SHOP-AFTER-ANSWER']
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def dump(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
def module(n,p):
 s=importlib.util.spec_from_file_location(n,p);m=importlib.util.module_from_spec(s);sys.modules[n]=m;s.loader.exec_module(m);return m
def owners():
 consumer=module('compact9_consumer',SRC/'consume_named9.py')
 return consumer,consumer.owners(ROOT)
def worker(saved,digest,out):
 assert sha(saved)==digest
 value=json.loads(saved.read_text());consumer,(v,native,Engine,semantic,prep)=owners()
 request,_=v.reconstruct_request({'native_case':value['native_case']})
 request=replace(request,emlis_thread=replace(request.emlis_thread,prepared_meaning_checkpoint_ref=value['checkpoint_id']))
 result=Engine().generate(request,semantic_input=semantic.SemanticInput('RESUME_ADOPTED',snapshot_json=value['semantic_snapshot'],semantic_profile=semantic.MODEL_PROFILE))
 actual=v.json_value(result);assert actual==value['expected_full_outcome']
 dump(out,dict(process_id=os.getpid(),status='COLD_FULL_OUTCOME_IDENTICAL',full_outcome=actual))
def main():
 started=time.monotonic()
 assert os.environ['CUDA_VISIBLE_DEVICES']=='' and os.environ['HF_HUB_OFFLINE']==os.environ['TRANSFORMERS_OFFLINE']=='1'
 assert not PACK.exists() and not Path('/workspace/cocolon_compact9_run_20261028').exists()
 manifest=json.loads((ROOT/'restore_payload.json').read_text())
 for f in manifest['files']:assert sha(ROOT/f['path'])==f['sha256'],f['path']
 oldcpu=json.loads((OLD/'actual_cpu_check.json').read_text());assert oldcpu['status']=='CPU_FULLCE9_READY_NO_MODEL_EXECUTION'
 assert all(sha(OLD/n)==h for n,h in oldcpu['payload_sha256'].items())
 prior=Path('/workspace/cocolon_updatesfirst9_pack_20261028/pytest_summary.json')
 assert sha(prior)==oldcpu['prior_pytest_summary_sha256']
 tests=json.loads(prior.read_text());assert tests['tests']==353 and tests['failures']==tests['errors']==tests['skipped']==tests['exit_code']==0
 PACK.mkdir()
 for name in ['run_compact9.py','prepare_compact9.py','compact_teacher.py','consume_named9.py','export_compact9.py','launch_once.py']:shutil.copyfile(SRC/name,PACK/name)
 for name in ['eval_inputs.json','api_source_manifest.json']:shutil.copyfile(OLD/name,PACK/name)
 consumer,(v,native,Engine,semantic,prep)=owners()
 from cocolon_meaning_experience_engine import named_reference_wire as codec
 compact_module=module('compact9_teacher',PACK/'compact_teacher.py')
 import run_pilot as helper
 import torch
 from transformers import AutoTokenizer
 from safetensors.torch import load_file
 assert not torch.cuda.is_initialized()
 tokenizer=AutoTokenizer.from_pretrained(helper.MODEL,revision=helper.REVISION,local_files_only=True,trust_remote_code=False)
 original_lines=(OLD/'train_messages.jsonl').read_text().splitlines(keepends=True);assert len(original_lines)==15
 new_lines=[];rows=[];records=[];equivalence=[]
 for line in original_lines:
  original=json.loads(line);row=json.loads(line);changed=row['id'] in IDS
  before,bprefix=helper.encode_training(tokenizer,original['messages'],context=8192)
  if changed:
   packet=codec.loads(row['messages'][-1]['content']);derived,names=compact_module.compact(packet,codec)
   assert codec.dump(packet)==row['messages'][-1]['content']
   row['messages'][-1]['content']=codec.dump(derived)
   new_lines.append(json.dumps(row,ensure_ascii=False,separators=(',',':'))+'\n')
   equivalence.append(dict(case_id=row['id'],before_bytes=len(codec.dump(packet).encode()),after_bytes=len(codec.dump(derived).encode()),native_candidate_and_evidence_exact=True,inverse_packet_exact=True,all_native_ids_literals_prose_order_unchanged=True,renaming=names))
  else:new_lines.append(line)
  encoded,prefix=helper.encode_training(tokenizer,row['messages'],context=8192);start,count=helper.assistant_loss_window(encoded)
  assert row['messages'][:-1]==original['messages'][:-1] and prefix==bprefix and encoded['input_ids'][:prefix]==before['input_ids'][:prefix]
  assert start==prefix-1 and encoded['labels'][:prefix]==[-100]*prefix and encoded['labels'][prefix:]==encoded['input_ids'][prefix:]
  assert encoded['input_ids'][prefix:].count(tokenizer.eos_token_id)==1
  if changed:assert len(encoded['input_ids'])<len(before['input_ids'])
  else:assert encoded==before and new_lines[-1]==line
  case=next(x for x in json.loads((PACK/'eval_inputs.json').read_text()) if x['case_id']==row['id'])
  assert row['messages'][:-1]==case['messages'] and prefix+case['max_new_tokens']<=8192
  records.append(dict(case_id=row['id'],prompt_tokens=prefix,original_target_tokens=len(before['input_ids'])-prefix,derived_target_tokens=len(encoded['input_ids'])-prefix,full_tokens=len(encoded['input_ids']),max_new_tokens=case['max_new_tokens'],full_input_ids_sha256=hashlib.sha256(json.dumps(encoded['input_ids'],separators=(',',':')).encode()).hexdigest(),prompt_unchanged=True,full_target_and_eos_supervised=True))
  rows.append(row)
 (PACK/'train_messages.jsonl').write_text(''.join(new_lines))
 assert len(equivalence)==2
 receiver_results=[]
 for row in rows:
  if row['id'] not in IDS:continue
  cid=row['id'];source=json.loads(next(line for line in original_lines if json.loads(line)['id']==cid))
  results={}
  for label,raw in [('original',source['messages'][-1]['content']),('compact',row['messages'][-1]['content'])]:
   request,prior_snapshot=v.reconstruct_request({'native_case':native[cid]});material=prep.prepare_emlis(request)
   metadata=dict(request_id=material.request_id,raw_output=raw,finish_reason='stop',provider='cpu_teacher_fixture',model='NO_MODEL_LOADED',revision='frozen_teacher_projection',adapter_revision='NO_ADAPTER',usage=None,elapsed_seconds=None,candidate_format=codec.SCHEMA)
   receipt=prep.receive_candidate(material,**metadata);assert prep.receive_candidate(material,**metadata)==receipt
   checkpoint=Engine().prepare_emlis_update(request,semantic_input=semantic.SemanticInput('FRESH_CANDIDATE',receipt,prior_snapshot_json=prior_snapshot,semantic_profile=semantic.MODEL_PROFILE))
   resumed=replace(request,emlis_thread=replace(request.emlis_thread,prepared_meaning_checkpoint_ref=checkpoint.checkpoint_id))
   complete=Engine().generate(resumed,semantic_input=semantic.SemanticInput('RESUME_ADOPTED',snapshot_json=checkpoint.semantic_snapshot,semantic_profile=semantic.MODEL_PROFILE));assert complete.artifact is not None
   results[label]=dict(receipt=v.json_value(receipt),checkpoint=v.json_value(checkpoint),outcome=v.json_value(complete))
   saved=PACK/(cid+'_'+label+'_saved.json');cold=PACK/(cid+'_'+label+'_cold.json')
   dump(saved,dict(native_case=native[cid],semantic_snapshot=checkpoint.semantic_snapshot,checkpoint_id=checkpoint.checkpoint_id,expected_full_outcome=v.json_value(complete)))
   subprocess.run([sys.executable,'-B',str(SRC/'prepare_compact9.py'),'--worker','--saved',str(saved),'--saved-sha',sha(saved),'--out',str(cold)],env=dict(os.environ,CUDA_VISIBLE_DEVICES=''),check=True,capture_output=True,text=True,timeout=60)
   assert json.loads(cold.read_text())['process_id']!=os.getpid()
  assert results['original']['receipt']['raw_output']!=results['compact']['receipt']['raw_output']
  old_snapshot=json.loads(results['original']['checkpoint']['semantic_snapshot']);new_snapshot=json.loads(results['compact']['checkpoint']['semantic_snapshot'])
  assert set(old_snapshot)==set(new_snapshot) and old_snapshot['receipt']!=new_snapshot['receipt']
  assert {k:v for k,v in old_snapshot.items() if k!='receipt'}=={k:v for k,v in new_snapshot.items() if k!='receipt'}
  assert old_snapshot['snapshot_ref']==new_snapshot['snapshot_ref'] and old_snapshot['proposal_ref']==new_snapshot['proposal_ref']
  receiver_results.append(dict(case_id=cid,original=results['original'],compact=results['compact'],each_raw_own_receipt_and_cold_exact=True,only_snapshot_receipt_differs=True,meaning_and_proposal_hashes_exact=True,cross_full_outcome_equal=results['original']['outcome']==results['compact']['outcome']))
 dump(PACK/'teacher_equivalence.json',dict(kind='CPU_TEACHER_SYNTHETIC_NOT_MODEL_QUALITY',cases=equivalence,receivers=receiver_results,model_loads=0,generations=0,sql_operations=0))
 weights=load_file('/workspace/cocolon_named9_initial_20261028/adapter_model.safetensors',device='cpu');assert len(weights)==112 and all(t.dtype==torch.float32 and torch.isfinite(t).all() for t in weights.values())
 runner=module('compact9_runner',PACK/'run_compact9.py');baseline=module('fullce9_runner',OLD/'run_fullce9.py');assert runner.ORDER==baseline.ORDER and runner.IDS==baseline.IDS
 left=dict(runner.FIXED);right=dict(baseline.FIXED)
 for name in ['schema','output_directory']:left.pop(name);right.pop(name)
 assert left==right
 assert (PACK/'eval_inputs.json').read_bytes()==(OLD/'eval_inputs.json').read_bytes()
 lengths={x['case_id']:x['full_tokens'] for x in records}
 assert not torch.cuda.is_initialized()
 names=['run_compact9.py','prepare_compact9.py','compact_teacher.py','consume_named9.py','export_compact9.py','launch_once.py','train_messages.jsonl','eval_inputs.json','api_source_manifest.json','teacher_equivalence.json']
 report=dict(status='CPU_COMPACT9_READY_NO_MODEL_EXECUTION',seconds=time.monotonic()-started,optimizer_steps=9,changed_prompts=[],all15_prompts_unchanged=True,other13_prompt_teacher_bytes_unchanged=True,derived2_decode_exact=True,prior_353_same_api_verified=True,prior_pytest_summary_sha256=sha(prior),prior353_rerun=False,inherited_112_f32_finite=True,schedule_counts_verified=True,exact_order_verified=True,source_manifest_sha256=sha(ROOT/'restore_payload.json'),original_train_messages_sha256=sha(OLD/'train_messages.jsonl'),cases=records,training_loss='original_full_assistant_ce_including_eos',series_tokens=sum(lengths[cid] for cid in runner.ORDER),series_length_squared_sum=sum(lengths[cid]**2 for cid in runner.ORDER),synthetic_meaning_cases=4,synthetic_body_cases=4,synthetic_cold_reads=4,payload_sha256={n:sha(PACK/n) for n in names},model_loads=0,model_forwards=0,training_updates=0,generations=0,sql_operations=0,cuda_initialized=False,product_credit=0,automatic_progression=False)
 dump(PACK/'actual_cpu_check.json',report)
 plan=dict(runner.FIXED,status='PREPARED_AWAITING_FINAL_CPU_REVIEW',gpu_run_authorized=False,approval_basis=None,runner_sha256=sha(PACK/'run_compact9.py'),cpu_check_sha256=sha(PACK/'actual_cpu_check.json'),eval_inputs_sha256=sha(PACK/'eval_inputs.json'),train_messages_sha256=sha(PACK/'train_messages.jsonl'),consumer_sha256=sha(PACK/'consume_named9.py'),api_commit=runner.FIXED['base_api_commit'],api_source_manifest_sha256=sha(PACK/'api_source_manifest.json'))
 dump(PACK/'compact9.plan.json',plan);runner.validate(PACK)
 print(json.dumps({k:v for k,v in report.items() if k not in ['cases','payload_sha256']},ensure_ascii=False),flush=True)
 for case in records:
  if case['case_id'] in IDS:print(json.dumps(case),flush=True)
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--worker',action='store_true');parser.add_argument('--saved',type=Path);parser.add_argument('--saved-sha');parser.add_argument('--out',type=Path);args=parser.parse_args()
 if args.worker:worker(args.saved,args.saved_sha,args.out)
 else:main()
