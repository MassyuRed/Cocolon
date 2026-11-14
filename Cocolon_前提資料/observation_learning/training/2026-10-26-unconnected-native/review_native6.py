"""CPU native6 review/tokenization. No model weights loaded or generated."""
import os
os.environ.update(CUDA_VISIBLE_DEVICES='',HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1',TOKENIZERS_PARALLELISM='false')
import json,hashlib,sys,time,traceback,inspect
from dataclasses import asdict
from pathlib import Path
R=Path('/workspace/cocolon_sixrow_cpu_20261026'); W=Path('/workspace/cocolon_sixrow_api_20261026'); LEGACY=Path('/workspace/cocolon_4b_service_binding_legacy_reference_20261025'); PACK=Path('/workspace/cocolon_4b_quote_joint_pack_20261026'); WEIGHTS=Path('/workspace/cocolon_4b_quote_joint_fit12_20261026/adapter')
sys.path[:0]=[str(W/'ai/tests'),str(W/'ai/services/ai_inference'),str(LEGACY),'/workspace/cocolon_4b_service_runtime_20261025/python']
sys.dont_write_bytecode=True
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def canonical(v):return json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False)
def main():
 a=R/'native-01'; a.mkdir(exist_ok=False); start=time.monotonic(); report=dict(status='STARTED',model_load=0,forward=0,training=0,generation=0,production_db=0,product_accepted=False,cases=[])
 try:
  import test_cmee_emlis_sixrow as f
  from cocolon_meaning_experience_engine.model_candidate_source import build_model_messages
  from cocolon_meaning_experience_engine.preparation import QUOTE_CANDIDATE_SCHEMA
  from transformers import AutoTokenizer
  import run_pilot as helper
  (a/'encode_training_source.py').write_text(inspect.getsource(helper.encode_training))
  tokenizer=AutoTokenizer.from_pretrained(helper.MODEL,revision=helper.REVISION,local_files_only=True,trust_remote_code=False)
  manifest=json.loads((PACK/'dataset_manifest.json').read_text()); watched={PACK/p:v['sha256'] for p,v in manifest['files'].items()}; watched.update({p:sha(p) for p in WEIGHTS.iterdir() if p.is_file()})
  assert all(sha(p)==v for p,v in watched.items())
  rows=[]
  for topic,after in f.STATES:
   req,p,out,prior=f.state(topic,after); packet=f.wire(f.fixture_packet(req,topic,prior)); stages=f.FIXTURE[topic]; stage=stages['after' if after else 'initial']; provenance=stage['provenance']
   messages=build_model_messages(req,prior.semantic_snapshot if prior else None,candidate_format=QUOTE_CANDIDATE_SCHEMA)+[dict(role='assistant',content=canonical(packet))]
   case=dict(id=provenance['id'],family=stages['family'],stage='AFTER_EXPLANATION' if after else 'INITIAL',surface={k:getattr(out.artifact,k) for k in ('observation','reception','update_note')},question_text=out.question.prompt_private if out.question else None,body_state=out.body_state,question_disposition=out.question_decision.disposition,meaning_packet=json.loads(p.meaning_json),native_bindings=json.loads(p.native_bindings_json),answer_update=asdict(p.checkpoint.answer_update) if p.checkpoint.answer_update else None,quote_rows=len(packet['evidence_quotes']),canonical_replay=True)
   try:
    encoded,prefix=helper.encode_training(tokenizer,messages,context=8192)
    case.update(prompt_tokens=prefix,assistant_eos_tokens=len(encoded['input_ids'])-prefix,full_tokens=len(encoded['input_ids']),eos_present=tokenizer.eos_token_id in encoded['labels'][prefix:],within_context=True)
    assert case['eos_present']
   except ValueError as exc:
    case.update(within_context=False,encoding_error=str(exc))
    # Preserve exact no-truncation length using the same helper with a counting-only ceiling.
    encoded,prefix=helper.encode_training(tokenizer,messages,context=1000000)
    case.update(prompt_tokens=prefix,assistant_eos_tokens=len(encoded['input_ids'])-prefix,full_tokens=len(encoded['input_ids']),eos_present=tokenizer.eos_token_id in encoded['labels'][prefix:],overflow_tokens=max(0,len(encoded['input_ids'])-8192))
   rows.append(dict(id=provenance['id'],status='CPU_NATIVE_CANDIDATE_NOT_TRAINED_NOT_MODEL_RAW_NOT_HUMAN_ACCEPTED',origin=provenance['origin'],source_refs=provenance['source_refs'],source_bundle=provenance['source_bundle'],question_origin=provenance.get('question_origin'),teacher_source=provenance.get('teacher_source'),candidate_reference=provenance.get('candidate_reference'),author_added_input_fields=provenance.get('author_added_input_fields'),runtime_request=dict(request_id=req.request_id,record_id=req.expected_source_record_id,original=dict(req.current_input_bundle.raw_current_input),emlis_thread=asdict(req.emlis_thread)),prior_adopted_snapshot=prior.semantic_snapshot if prior else None,messages=messages))
   report['cases'].append(case)
  assert all(sha(p)==v for p,v in watched.items())
  report.update(status='CPU_NATIVE_6_WITHIN_CONTEXT_8192' if all(c['within_context'] for c in report['cases']) else 'CPU_NATIVE_CONTEXT_OVERFLOW_STOP',source_native9_and_weights_unchanged=True,seconds=time.monotonic()-start,tokenizer_model=helper.MODEL,tokenizer_revision=helper.REVISION,runner_sha256=sha(Path(__file__)))
  (a/'native6.jsonl').write_text(''.join(canonical(x)+'\n' for x in rows));report['native6_sha256']=sha(a/'native6.jsonl')
 except BaseException:
  report.update(status='CPU_NATIVE_ERROR_PRESERVED',error=traceback.format_exc(),seconds=time.monotonic()-start)
 finally:
  (a/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(status=report['status'],seconds=report['seconds'],cases=[{k:c[k] for k in ('id','prompt_tokens','assistant_eos_tokens','full_tokens','within_context') if k in c} for c in report['cases']],error=report.get('error')),ensure_ascii=False))
if __name__=='__main__':main()
