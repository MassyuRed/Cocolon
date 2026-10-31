"""Offline diagnosis of the closed native15 run. Never loads a model or SQL."""
import os
os.environ.update(CUDA_VISIBLE_DEVICES='', HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1')
import hashlib, json, sys, time
from dataclasses import replace
from pathlib import Path
sys.dont_write_bytecode=True
API=Path('/workspace/cocolon_sixrow_api_20261026')
LEGACY=Path('/workspace/cocolon_4b_service_binding_legacy_reference_20261025')
RUN=Path('/workspace/cocolon_native15_run_20261026')
OUT=Path('/workspace/cocolon_native15_diagnosis_20261026')
sys.path[:0]=[str(API/'ai/tests'),str(API/'ai/services/ai_inference'),str(LEGACY),'/workspace/cocolon_4b_service_runtime_20261025/python']
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def dump(p,v):Path(p).write_text(json.dumps(v,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
def main():
 OUT.mkdir(exist_ok=False); started=time.monotonic()
 from verify_cmee import json_value
 import test_cmee_emlis_sixrow as f
 from cocolon_meaning_experience_engine import MeaningExperienceEngine
 from cocolon_meaning_experience_engine.model_candidate_source import build_model_messages
 from cocolon_meaning_experience_engine.preparation import prepare_emlis,receive_candidate,QUOTE_CANDIDATE_SCHEMA
 from cocolon_meaning_experience_engine.emlis_semantic_admission import SemanticInput,SemanticNotAdopted,MODEL_PROFILE
 assert Path(f.__file__).resolve().is_relative_to(API)
 for path,expected in json.loads((RUN/'api_blobs.json').read_text()).items():
  b=(API/path).read_bytes();assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==expected,path
 r=json.loads((RUN/'run.json').read_text());assert r['status']=='STOPPED_NO_RETRY' and r['optimizer_steps_completed']==0
 evals=[json.loads(s) for s in (RUN/'eval_inputs.jsonl').read_text().splitlines()];byid={c['case_id']:c for c in evals}
 newids=r['plan']['before_ids'];records=[]
 for call in r['calls']:
  path=RUN/call['path'];assert sha(path)==call['raw_sha256'] and call['phase']=='before'
  raw=json.loads(path.read_text());cid=raw['case_id'];assert cid==call['case_id'];topic,after=f.STATES[newids.index(cid)]
  req,_,_,priorcp=f.state(topic,after);prior=priorcp.semantic_snapshot if priorcp else None
  assert build_model_messages(req,prior,candidate_format=QUOTE_CANDIDATE_SCHEMA)==byid[cid]['messages']
  assert raw['model']=='Qwen/Qwen3.5-4B' and raw['revision']=='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a' and raw['adapter_revision']==r['plan']['initial_adapter_sha256']['adapter_model.safetensors']
  material=prepare_emlis(req)
  receipt=receive_candidate(material,request_id=material.request_id,raw_output=raw['raw_text'],finish_reason=raw['finish_reason'],provider=raw['provider'],model=raw['model'],revision=raw['revision'],adapter_revision=raw['adapter_revision'],usage=raw['usage'],elapsed_seconds=raw['seconds'])
  row=dict(case_id=cid,phase='before',prompt_verified=True,identity_verified=True,raw_sha256=sha(path),eos_reached=raw['eos_reached'],finish_reason=raw['finish_reason'],output_tokens=raw['output_tokens'],generation_seconds=raw['seconds'],timeout_triggered=call['timeout_triggered'],receipt=json_value(receipt),prior_origin='FROZEN_TEACHER_ADOPTED_PRIOR' if prior else None,meaning_adopted=False,body_available=False,body=None,question=None)
  try:
   engine=MeaningExperienceEngine()
   cp=engine.prepare_emlis_update(req,semantic_input=SemanticInput('FRESH_CANDIDATE',receipt=receipt,prior_snapshot_json=prior,semantic_profile=MODEL_PROFILE))
   resumed=replace(req,emlis_thread=replace(req.emlis_thread,prepared_meaning_checkpoint_ref=cp.checkpoint_id))
   out=engine.generate(resumed,semantic_input=SemanticInput('RESUME_ADOPTED',snapshot_json=cp.semantic_snapshot,semantic_profile=MODEL_PROFILE))
   row.update(status='MEANING_AND_BODY_AVAILABLE' if out.artifact else 'MEANING_ADOPTED_BODY_UNAVAILABLE',meaning_adopted=True,body_available=out.artifact is not None,checkpoint=json_value(cp),outcome=json_value(out),body=json_value(out.artifact),question=json_value(out.question))
  except SemanticNotAdopted as exc:row.update(status='SEMANTIC_NOT_ADOPTED',decision=exc.decision,reason_code=exc.reason_code)
  records.append(row)
 report=dict(status='CLOSED_RUN_CPU_DIAGNOSED',source_run_sha256=sha(RUN/'run.json'),consumer_sha256=sha(__file__),api_commit='6b043880504912481a6b10d93c9128ec4995b70b',cases=records,meaning_adopted_count=sum(c['meaning_adopted'] for c in records),body_available_count=sum(c['body_available'] for c in records),missing_before_ids=[x for x in newids if x not in [c['case_id'] for c in records]],missing_after_ids=r['plan']['after_ids'],new_model_calls=0,training_updates=0,sql_operations=0,cold_file_checked_count=0,cold_file_status='NOT_APPLICABLE_IF_NO_ADOPTION',dynamic_prior=False,service_saved_roundtrip=False,product_accepted=False,automatic_progression=False,seconds=time.monotonic()-started)
 dump(OUT/'diagnosis.json',report)
 print(json.dumps({k:v for k,v in report.items() if k not in ('cases','missing_after_ids')},ensure_ascii=False))
 print(json.dumps([{k:c.get(k) for k in ('case_id','status','decision','reason_code','meaning_adopted','body_available')} for c in records],ensure_ascii=False))
if __name__=='__main__':main()
