"""One-shot CPU preparation of existing 15 quote-native teachers. No model run."""
import os
os.environ.update(CUDA_VISIBLE_DEVICES='', HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1', TOKENIZERS_PARALLELISM='false')
import hashlib, json, sys, time
from dataclasses import replace
from pathlib import Path
sys.dont_write_bytecode=True
API=Path('/workspace/cocolon_sixrow_api_20261026')
LEGACY=Path('/workspace/cocolon_4b_service_binding_legacy_reference_20261025')
OLD=Path('/workspace/cocolon_4b_interface_review_20261026/native_quote_messages.jsonl')
NEW=Path('/workspace/cocolon_sixrow_cpu_20261026/native-01/native6.jsonl')
WEIGHTS=Path('/workspace/cocolon_4b_quote_joint_fit12_20261026/adapter')
OUT=Path('/workspace/cocolon_native15_preparation_20261026/attempt03')
sys.path[:0]=[str(API/'ai/tests'),str(API/'ai/services/ai_inference'),str(LEGACY),'/workspace/cocolon_4b_service_runtime_20261025/python']
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def wire(v):return json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False)
def dump(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
def main():
 started=time.monotonic(); OUT.mkdir(exist_ok=False)
 report=dict(status='CPU_STARTED',model_load=0,model_forward=0,training_updates=0,generation=0,sql=0,gpu_run_authorized=False,product_accepted=False,automatic_progression=False)
 import run_pilot as h
 from verify_cmee import reconstruct_request
 import test_cmee_emlis_sixrow as f
 from cocolon_meaning_experience_engine import MeaningExperienceEngine
 from cocolon_meaning_experience_engine.preparation import prepare_emlis,receive_candidate,QUOTE_CANDIDATE_SCHEMA
 from cocolon_meaning_experience_engine.model_candidate_source import build_model_messages
 from cocolon_meaning_experience_engine.emlis_semantic_admission import SemanticInput,MODEL_PROFILE
 from transformers import AutoTokenizer
 assert Path(f.__file__).resolve().is_relative_to(API)
 specs=json.loads((Path('/workspace')/'native15_api_blobs.json').read_text())
 for path,expected in specs.items():
  b=(API/path).read_bytes(); assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==expected,path
 inputs={str(OLD):sha(OLD),str(NEW):sha(NEW),str(LEGACY/'run_pilot.py'):sha(LEGACY/'run_pilot.py')}
 weights=h.adapter_hashes(WEIGHTS)
 assert weights['adapter_model.safetensors']=='45779ad97111dd2d91c1f7f1a4b0ca697ef0586c5190cd56b1b7675fe540dab6'
 old=h.read_jsonl(OLD); new=h.read_jsonl(NEW); rows=old+new
 assert len(old)==9 and len(new)==6 and len({r['id'] for r in rows})==15
 examples=h.read_jsonl(Path('/workspace/cocolon_4b_quote_joint_pack_20261026/sft_examples.jsonl'))
 assert [x['id'] for x in old]==[x['id'] for x in examples]
 tokenizer=AutoTokenizer.from_pretrained(h.MODEL,revision=h.REVISION,local_files_only=True,trust_remote_code=False)
 cases=[]; evaluations=[]
 for i,row in enumerate(rows):
  if i<9: req,prior=reconstruct_request(examples[i])
  else:
   topic,after=f.STATES[i-9];req,_,_,p=f.state(topic,after);prior=p.semantic_snapshot if p else None
  messages=build_model_messages(req,prior,candidate_format=QUOTE_CANDIDATE_SCHEMA)
  assert messages==row['messages'][:-1],row['id']
  enc,prefix=h.encode_training(tokenizer,row['messages'],context=8192)
  completion=len(enc['input_ids'])-prefix; cap=2560 if i<9 else 3712
  assert prefix+cap<=8192 and completion<=cap
  assert all(v==-100 for v in enc['labels'][:prefix]) and enc['labels'][prefix:]==enc['input_ids'][prefix:]
  assert tokenizer.eos_token_id in enc['labels'][prefix:]
  eval_ids=h.chat_token_ids(tokenizer,messages,generation_prompt=True)
  assert len(eval_ids)==prefix and len(eval_ids)+cap<=8192
  material=prepare_emlis(req); receipt=receive_candidate(material,request_id=material.request_id,raw_output=row['messages'][-1]['content'],finish_reason='stop',provider='cpu-teacher-only',model='synthetic-not-4B')
  assert receipt.status=='CANDIDATE_UNREVIEWED'
  engine=MeaningExperienceEngine();cp=engine.prepare_emlis_update(req,semantic_input=SemanticInput('FRESH_CANDIDATE',receipt,prior_snapshot_json=prior,semantic_profile=MODEL_PROFILE))
  resumed=replace(req,emlis_thread=replace(req.emlis_thread,prepared_meaning_checkpoint_ref=cp.checkpoint_id))
  out=engine.generate(resumed,semantic_input=SemanticInput('RESUME_ADOPTED',snapshot_json=cp.semantic_snapshot,semantic_profile=MODEL_PROFILE))
  assert out.artifact is not None,(row['id'],out.reason_codes)
  cases.append(dict(id=row['id'],prompt_tokens=prefix,assistant_eos_tokens=completion,full_tokens=len(enc['input_ids']),generation_cap=cap,prompt_plus_cap=prefix+cap,eos_supervised=True,prompt_supervised=False,meaning_adopted=True,body_available=True,surface={k:getattr(out.artifact,k) for k in ('observation','reception','update_note')},question=out.question.prompt_private if out.question else None,question_disposition=out.question_decision.disposition,prior_origin='TEACHER_ADOPTED_PRIOR' if prior else None))
  evaluations.append(dict(case_id=row['id'],messages=messages,max_new_tokens=cap,scope='FROZEN_TEACHER_FIT_NOT_UNKNOWN_NOT_DYNAMIC_SERVICE'))
 assert all(sha(Path(p))==s for p,s in inputs.items()) and h.adapter_hashes(WEIGHTS)==weights
 (OUT/'train_messages.jsonl').write_bytes(OLD.read_bytes()+NEW.read_bytes())
 (OUT/'eval_inputs.jsonl').write_text(''.join(wire(x)+'\n' for x in evaluations))
 report.update(status='CPU_NATIVE15_READY_GPU_NOT_EXECUTED',seconds=time.monotonic()-started,api_commit='6b043880504912481a6b10d93c9128ec4995b70b',api_blobs=specs,source_sha256=inputs,initial_adapter_sha256=weights,model=h.MODEL,revision=h.REVISION,cases=cases,training_order=[x['id'] for x in rows],before_ids=[x['id'] for x in new],after_ids=[x['id'] for x in rows],max_training_tokens=max(x['full_tokens'] for x in cases),max_generation_tokens=max(x['prompt_plus_cap'] for x in cases),source_rows_and_provenance_preserved=True,source_and_weights_unchanged=True,teacher_fit_count=15,independent_language_families=6,planned_before_calls=6,planned_after_calls=15,unknown_evaluation_count=0,runner_sha256=sha(Path(__file__)))
 report['payloads']={n:dict(sha256=sha(OUT/n),bytes=(OUT/n).stat().st_size) for n in ('train_messages.jsonl','eval_inputs.jsonl')}
 dump(OUT/'cpu_preparation.json',report)
 print(json.dumps({k:report[k] for k in ('status','seconds','teacher_fit_count','max_training_tokens','max_generation_tokens','model_load','model_forward','training_updates','generation','sql')},ensure_ascii=False))
 print('ROWS',[(x['id'],x['prompt_tokens'],x['assistant_eos_tokens'],x['generation_cap']) for x in cases])
if __name__=='__main__':
 try:main()
 except BaseException:
  import traceback
  if OUT.exists(): dump(OUT/'error.json',dict(status='CPU_FAILED_PRESERVED',traceback=traceback.format_exc(),model_load=0,model_forward=0,training_updates=0,generation=0,sql=0))
  raise
