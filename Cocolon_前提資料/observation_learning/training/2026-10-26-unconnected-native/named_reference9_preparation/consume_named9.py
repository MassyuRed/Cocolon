"""Receive the actual named output unchanged; saved snapshots get cold reads."""
import argparse,hashlib,importlib.util,json,os,subprocess,sys,time
from dataclasses import replace
from pathlib import Path
os.environ.update(CUDA_VISIBLE_DEVICES='',HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
sys.dont_write_bytecode=True
IDS=['FT-BOOK-AFTER-ANSWER','FT-SHOP-AFTER-ANSWER']
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(name,p):
 s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);sys.modules[name]=m;s.loader.exec_module(m);return m
def dump(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
def owners(root):
 manifest=json.loads((root/'restore_payload.json').read_text())
 for f in manifest['files']:assert sha(root/f['path'])==f['sha256'],'reader_source_changed:'+f['path']
 sys.path[:0]=[str(root/'api/ai/services/ai_inference'),str(root/'legacy')]
 load('run_pilot',root/'legacy/run_pilot.py');v=load('verify_cmee',root/'legacy/verify_cmee.py')
 frozen=load('named9_frozen_cases',root/'frozen/consume_expanded15_recovery.py')
 _,native=frozen.frozen_cases(root/'frozen',root/'frozen/sft_examples.jsonl')
 from cocolon_meaning_experience_engine import MeaningExperienceEngine,emlis_semantic_admission,preparation
 return v,native,MeaningExperienceEngine,emlis_semantic_admission,preparation
def cold(root,saved,expected_sha,out):
 assert sha(saved)==expected_sha
 value=json.loads(saved.read_text());v,_,Engine,semantic,_=owners(root)
 request,_=v.reconstruct_request({'native_case':value['native_case']})
 request=replace(request,emlis_thread=replace(request.emlis_thread,prepared_meaning_checkpoint_ref=value['checkpoint_id']))
 result=Engine().generate(request,semantic_input=semantic.SemanticInput('RESUME_ADOPTED',snapshot_json=value['semantic_snapshot'],semantic_profile=semantic.MODEL_PROFILE))
 actual=v.json_value(result);assert actual==value['expected_full_outcome']
 dump(out,dict(status='COLD_FULL_OUTCOME_IDENTICAL',process_id=os.getpid(),full_outcome=actual))
def main(root,run,out):
 started=time.monotonic();v,native,Engine,semantic,prep=owners(root)
 from cocolon_meaning_experience_engine.named_reference_wire import SCHEMA
 before=sha(run/'run.json');report=json.loads((run/'run.json').read_text());plan=report['plan']
 assert plan==json.loads((Path(__file__).resolve().parent/'named9.plan.json').read_text())
 assert 0<=report['optimizer_steps_completed']<=9 and 0<=report['model_calls_completed']<=2
 assert sha(Path(__file__).resolve().parent/'eval_inputs.json')==plan['eval_inputs_sha256']
 calls=report['calls'];assert len(calls)==report['model_calls_completed'] and [c['case_id'] for c in calls]==IDS[:len(calls)]
 out.mkdir(exist_ok=False)
 result=dict(status='CPU_NAMED9_ACTUAL_RAW_READ',meaning_reader_api_ref=plan['api_commit'],cases=[],new_model_calls=0,
  training_updates=0,sql_operations=0,product_accepted=False,automatic_progression=False)
 for call in calls:
  cid=call['case_id'];path=run/call['path'];assert path.name==call['path'] and cid in IDS and sha(path)==call['raw_sha256']
  raw=json.loads(path.read_text())
  assert raw['case_id']==cid and raw['adapter_revision']==report['adapter_sha256']['adapter_model.safetensors']
  assert raw['model']=='Qwen/Qwen3.5-4B' and raw['revision']=='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a'
  assert hashlib.sha256(raw['raw_text'].encode()).hexdigest()==raw['raw_utf8_sha256']
  request,prior=v.reconstruct_request({'native_case':native[cid]});material=prep.prepare_emlis(request)
  receipt=prep.receive_candidate(material,request_id=material.request_id,raw_output=raw['raw_text'],finish_reason=raw['finish_reason'],
   provider=raw['provider'],model=raw['model'],revision=raw['revision'],adapter_revision=raw['adapter_revision'],usage=raw['usage'],elapsed_seconds=raw['seconds'],candidate_format=SCHEMA)
  item=dict(case_id=cid,raw_sha256=sha(path),receipt=v.json_value(receipt),meaning_adopted=False,body_available=False,cold_file_status='NO_ADOPTED_SNAPSHOT')
  result['cases'].append(item)
  try:
   checkpoint=Engine().prepare_emlis_update(request,semantic_input=semantic.SemanticInput('FRESH_CANDIDATE',receipt,prior_snapshot_json=prior,semantic_profile=semantic.MODEL_PROFILE))
   resumed=replace(request,emlis_thread=replace(request.emlis_thread,prepared_meaning_checkpoint_ref=checkpoint.checkpoint_id))
   complete=Engine().generate(resumed,semantic_input=semantic.SemanticInput('RESUME_ADOPTED',snapshot_json=checkpoint.semantic_snapshot,semantic_profile=semantic.MODEL_PROFILE))
   item.update(meaning_adopted=True,body_available=complete.artifact is not None,checkpoint=v.json_value(checkpoint),outcome=v.json_value(complete))
   saved=out/(cid+'_saved.json');retrieved=out/(cid+'_cold.json')
   dump(saved,dict(native_case=native[cid],semantic_snapshot=checkpoint.semantic_snapshot,checkpoint_id=checkpoint.checkpoint_id,expected_full_outcome=v.json_value(complete)))
   subprocess.run([sys.executable,'-B',str(Path(__file__).resolve()),'--root',str(root),'--worker','--saved',str(saved),'--saved-sha',sha(saved),'--out',str(retrieved)],check=True,capture_output=True,text=True,timeout=60)
   got=json.loads(retrieved.read_text());assert got['process_id']!=os.getpid() and got['full_outcome']==v.json_value(complete)
   item['cold_file_status']=got['status']
  except semantic.SemanticNotAdopted as exc:item.update(decision=exc.decision,reason_code=exc.reason_code)
  dump(out/'diagnosis.json',result)
 assert sha(run/'run.json')==before
 result.update(seconds=time.monotonic()-started,meaning_adopted_count=sum(x['meaning_adopted'] for x in result['cases']),body_available_count=sum(x['body_available'] for x in result['cases']))
 dump(out/'diagnosis.json',result);print(json.dumps({k:v for k,v in result.items() if k!='cases'}),flush=True)
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--run',type=Path);p.add_argument('--out',type=Path,required=True);p.add_argument('--worker',action='store_true');p.add_argument('--saved',type=Path);p.add_argument('--saved-sha');a=p.parse_args()
 if a.worker:cold(a.root.resolve(),a.saved,a.saved_sha,a.out)
 else:main(a.root.resolve(),a.run,a.out)
