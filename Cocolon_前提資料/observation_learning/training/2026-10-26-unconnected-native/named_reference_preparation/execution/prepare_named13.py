"""Compare old bytes, receive new actual teachers, tokenize, and cold replay; CPU only."""
import argparse,copy,hashlib,importlib.metadata,importlib.util,json,os,subprocess,sys,time
from collections import Counter
from dataclasses import replace,asdict
from pathlib import Path
sys.dont_write_bytecode=True
OLD=Path('/workspace/cocolon_update_obligations_20261028')
ROOT=Path('/workspace/cocolon_named13_root_20261028')
BASELINE_PACK=Path('/workspace/cocolon_aligned13_pack_20261028')
PACK=Path('/workspace/cocolon_named13_pack_20261028')
AFTER=['FT-BOOK-AFTER-ANSWER','FT-SHOP-AFTER-ANSWER']
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def dump(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
def module(name,p):
 s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);sys.modules[name]=m;s.loader.exec_module(m);return m
def setup(root):
 consumer=module('named_consumer',PACK/'consume_named13.py')
 return consumer,consumer.owners(root)
def evaluate(owners,row):
 v,native,Engine,semantic,prep=owners;cid=row['id']
 req,prior=v.reconstruct_request({'native_case':native[cid]});material=prep.prepare_emlis(req)
 receipt=prep.receive_candidate(material,request_id=material.request_id,raw_output=row['messages'][-1]['content'],finish_reason='stop')
 cp=Engine().prepare_emlis_update(req,semantic_input=semantic.SemanticInput('FRESH_CANDIDATE',receipt,prior_snapshot_json=prior,semantic_profile=semantic.MODEL_PROFILE))
 resumed=replace(req,emlis_thread=replace(req.emlis_thread,prepared_meaning_checkpoint_ref=cp.checkpoint_id))
 out=Engine().generate(resumed,semantic_input=semantic.SemanticInput('RESUME_ADOPTED',snapshot_json=cp.semantic_snapshot,semantic_profile=semantic.MODEL_PROFILE))
 assert out.artifact is not None,cid
 return req,prior,receipt,cp,out
def baseline():
 _,owners=setup(OLD);v=owners[0]
 rows=[json.loads(line) for line in (BASELINE_PACK/'train_messages.jsonl').read_text().splitlines()]
 from cocolon_meaning_experience_engine.model_candidate_source import build_model_messages
 result={}
 for row in rows:
  req,prior,receipt,cp,out=evaluate(owners,row)
  messages=build_model_messages(req,prior,candidate_format='cocolon.cmee.quote_candidate.v1')
  assert messages==row['messages'][:-1]
  result[row['id']]=dict(messages=messages,receipt=asdict(receipt),semantic_snapshot=cp.semantic_snapshot,outcome=v.json_value(out))
 dump(PACK/'old_baseline.json',result)
 print('OLD_API64_BASELINE_COMPLETE',len(result),flush=True)
def main():
 started=time.monotonic();assert not (PACK/'actual_cpu_check.json').exists()
 assert os.environ.get('CUDA_VISIBLE_DEVICES')=='' and os.environ.get('HF_HUB_OFFLINE')==os.environ.get('TRANSFORMERS_OFFLINE')=='1'
 pytest_report=json.loads((PACK/'pytest_summary.json').read_text())
 assert pytest_report['exit_code']==pytest_report['failures']==pytest_report['errors']==pytest_report['skipped']==0
 b=subprocess.run([sys.executable,'-B',__file__,'--baseline'],capture_output=True,text=True,timeout=120)
 dump(PACK/'baseline_launch.json',dict(returncode=b.returncode,stdout=b.stdout,stderr=b.stderr));assert b.returncode==0,b.stderr
 old=json.loads((PACK/'old_baseline.json').read_text())
 consumer,owners=setup(ROOT);v,native,Engine,semantic,prep=owners
 from cocolon_meaning_experience_engine import model_candidate_source as source,named_reference_wire as wire
 import run_pilot as r
 from transformers import AutoTokenizer
 import torch
 assert not torch.cuda.is_initialized()
 assert {n:importlib.metadata.version(n) for n in r.PINS}==r.PINS
 tok=AutoTokenizer.from_pretrained(r.MODEL,revision=r.REVISION,local_files_only=True,trust_remote_code=False)
 projection=module('named_teacher_projection',PACK/'teacher_projection.py')
 rows0=r.read_jsonl(BASELINE_PACK/'train_messages.jsonl');cases0=json.loads((BASELINE_PACK/'eval_inputs.json').read_text())
 assert len(rows0)==len(cases0)==15
 rows=[];cases=[];records=[];cold=PACK/'teacher_cold';cold.mkdir(exist_ok=False)
 for row,case in zip(rows0,cases0,strict=True):
  cid=row['id'];assert cid==case['case_id'];req,prior,receipt0,cp0,out0=evaluate(owners,row)
  assert asdict(receipt0)==old[cid]['receipt'] and cp0.semantic_snapshot==old[cid]['semantic_snapshot']
  assert v.json_value(out0)==old[cid]['outcome']
  changed=cid in AFTER;messages=source.build_model_messages(req,prior,candidate_format=wire.SCHEMA if changed else prep.QUOTE_CANDIDATE_SCHEMA)
  target=row['messages'][-1]['content']
  if changed:
   projected=projection.encode(r.strict_json(target));target=projection.dump(projected)+'\n'
   assert wire.decode(wire.loads(target))==r.strict_json(row['messages'][-1]['content'])
  else:assert messages==old[cid]['messages'] and target==row['messages'][-1]['content']
  newrow=dict(row,messages=messages+[dict(role='assistant',content=target)])
  encoded,prompt=r.encode_training(tok,newrow['messages'],context=8192)
  oldencoded,oldprompt=r.encode_training(tok,row['messages'],context=8192)
  if not changed:assert encoded==oldencoded and prompt==oldprompt
  assert tok.eos_token_id in encoded['input_ids'][prompt:]
  cap=3584 if cid==AFTER[1] else case['max_new_tokens']
  assert prompt+cap<=8192,'context_no_truncation:'+cid
  material=prep.prepare_emlis(req)
  receipt=prep.receive_candidate(material,request_id=material.request_id,raw_output=target,finish_reason='stop',**({'candidate_format':wire.SCHEMA} if changed else {}))
  assert receipt.status=='CANDIDATE_UNREVIEWED' and receipt.raw_output==target
  assert receipt.candidate_json==receipt0.candidate_json
  cp=Engine().prepare_emlis_update(req,semantic_input=semantic.SemanticInput('FRESH_CANDIDATE',receipt,prior_snapshot_json=prior,semantic_profile=semantic.MODEL_PROFILE))
  resumed=replace(req,emlis_thread=replace(req.emlis_thread,prepared_meaning_checkpoint_ref=cp.checkpoint_id))
  out=Engine().generate(resumed,semantic_input=semantic.SemanticInput('RESUME_ADOPTED',snapshot_json=cp.semantic_snapshot,semantic_profile=semantic.MODEL_PROFILE))
  assert out.artifact is not None
  a0,a=json.loads(cp0.semantic_snapshot),json.loads(cp.semantic_snapshot)
  for key in ('packet','meaning_packet','native_bindings','question_control','source_bindings'):assert a[key]==a0[key],(cid,key)
  for section in ('observation','reception','update_note'):assert getattr(out.artifact,section)==getattr(out0.artifact,section)
  if changed:
   expected_count=7 if cid==AFTER[0] else 8
   assert len(a['packet']['candidate']['updates'])==expected_count and out.question is None
   saved=cold/(cid+'_saved.json');retrieved=cold/(cid+'_cold.json')
   dump(saved,dict(native_case=native[cid],semantic_snapshot=cp.semantic_snapshot,checkpoint_id=cp.checkpoint_id,expected_full_outcome=v.json_value(out)))
   worker=subprocess.run([sys.executable,'-B',str(PACK/'consume_named13.py'),'--root',str(ROOT),'--worker','--saved',str(saved),'--saved-sha',sha(saved),'--out',str(retrieved)],capture_output=True,text=True,timeout=60)
   assert worker.returncode==0,worker.stderr
   got=json.loads(retrieved.read_text());assert got['process_id']!=os.getpid() and got['full_outcome']==v.json_value(out)
  rows.append(newrow);cases.append(dict(case,messages=messages,max_new_tokens=cap))
  records.append(dict(case_id=cid,prompt_changed=changed,canonical_teacher_sha256=hashlib.sha256(row['messages'][-1]['content'].encode()).hexdigest(),target_sha256=hashlib.sha256(target.encode()).hexdigest(),prompt_tokens=prompt,target_tokens=len(encoded['input_ids'])-prompt,full_tokens=len(encoded['input_ids']),max_new_tokens=cap,prompt_plus_cap=prompt+cap,old_receipt_snapshot_outcome_equal=True,native_meaning_body_all_updates_equal=True,cold_file_checked=changed))
 (PACK/'train_messages.jsonl').write_text(''.join(json.dumps(x,ensure_ascii=False,separators=(',',':'))+'\n' for x in rows))
 dump(PACK/'eval_inputs.json',cases)
 assert not torch.cuda.is_initialized()
 report=dict(status='CPU_NAMED13_READY_NO_MODEL_EXECUTION',seconds=time.monotonic()-started,source_api_base='64c6cb1a41620fd2d7690e0b6f1af30ae0e624a4',source_cocolon_approved='67910d9101db9ea68bd37ad8fe4d7d82d9168cbd',case_count=15,changed_prompts=AFTER,unchanged_prompts=13,old15_receipt_snapshot_outcome_equal=True,teacher15_native_meaning_body_adopted=True,named_actual_raw_received=2,named_cold_file_equal=2,optimizer_steps=13,cases=records,source_manifest_sha256=sha(ROOT/'restore_payload.json'),pytest_summary_sha256=sha(PACK/'pytest_summary.json'),payload_sha256={n:sha(PACK/n) for n in ['train_messages.jsonl','eval_inputs.json','adaptive_loss.py','run_named13.py','consume_named13.py','prepare_named13.py','teacher_projection.py']},model_loads=0,model_forwards=0,training_updates=0,generations=0,sql_operations=0,cuda_initialized=False,product_credit=0,automatic_progression=False)
 dump(PACK/'actual_cpu_check.json',report)
 print(json.dumps({k:v for k,v in report.items() if k not in ('cases','payload_sha256')},ensure_ascii=False),flush=True)
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--baseline',action='store_true');a=p.parse_args()
 if a.baseline:baseline()
 else:main()
