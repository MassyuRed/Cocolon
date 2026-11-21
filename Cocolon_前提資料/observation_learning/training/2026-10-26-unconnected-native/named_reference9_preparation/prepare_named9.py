"""Verify unchanged inputs/source and the new nine-step schedule, CPU only."""
import hashlib,importlib.metadata,importlib.util,json,os,shutil,sys,time
from collections import Counter
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path('/workspace/cocolon_named13_root_20261028')
OLD=Path('/workspace/cocolon_named13_pack_20261028')
OLD_RUN=Path('/workspace/cocolon_named13_run_20261028')
PACK=Path('/workspace/cocolon_named9_pack_20261028')
INITIAL=Path('/workspace/cocolon_named9_initial_20261028')
IDS=['FT-BOOK-AFTER-ANSWER','FT-SHOP-AFTER-ANSWER']
RETENTION=['TRAIN-SERVICE-CHAIR-01-INITIAL','TRAIN-SERVICE-CHAIR-01-CORRECTION','TRAIN-DAILY-CALM-01-INITIAL']
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def dump(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
def module(name,p):
 s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);sys.modules[name]=m;s.loader.exec_module(m);return m
def main():
 start=time.monotonic();assert not (PACK/'actual_cpu_check.json').exists() and not INITIAL.exists()
 assert os.environ.get('CUDA_VISIBLE_DEVICES')=='' and os.environ.get('HF_HUB_OFFLINE')==os.environ.get('TRANSFORMERS_OFFLINE')=='1'
 runner=module('named9_runner',PACK/'run_named9.py')
 assert sha(OLD_RUN/'run.json')==runner.FIXED['initial_adapter_source_run_sha256']
 prior_run=json.loads((OLD_RUN/'run.json').read_text());assert prior_run['optimizer_steps_completed']==13 and prior_run['model_calls_completed']==2
 assert prior_run['adapter_sha256']['adapter_model.safetensors']==runner.INITIAL
 for name,h in prior_run['adapter_sha256'].items():assert sha(OLD_RUN/'adapter'/name)==h
 shutil.copytree(OLD_RUN/'adapter',INITIAL)
 for name,h in prior_run['adapter_sha256'].items():assert sha(INITIAL/name)==h
 manifest=json.loads((ROOT/'restore_payload.json').read_text())
 for f in manifest['files']:assert sha(ROOT/f['path'])==f['sha256'],f['path']
 old_plan=json.loads((OLD/'named13.plan.json').read_text());old_cpu=json.loads((OLD/'actual_cpu_check.json').read_text())
 assert sha(OLD/'actual_cpu_check.json')==old_plan['cpu_check_sha256']
 assert old_cpu['old15_receipt_snapshot_outcome_equal'] and old_cpu['teacher15_native_meaning_body_adopted'] and old_cpu['named_actual_raw_received']==old_cpu['named_cold_file_equal']==2
 pytest=json.loads((OLD/'pytest_summary.json').read_text());assert pytest['tests']==347 and pytest['exit_code']==pytest['failures']==pytest['errors']==pytest['skipped']==0
 for n,key in [('train_messages.jsonl','train_messages_sha256'),('eval_inputs.json','eval_inputs_sha256'),('adaptive_loss.py','loss_sha256')]:
  assert sha(OLD/n)==old_plan[key];shutil.copyfile(OLD/n,PACK/n);assert sha(PACK/n)==old_plan[key]
 shutil.copyfile(OLD/'api_source_manifest.json',PACK/'api_source_manifest.json')
 api=json.loads((PACK/'api_source_manifest.json').read_text());assert api['api_commit']=='a8be7a9bceed35a9f3cb843f22de05bbd5bc6e18'
 for f in api['files']:assert sha(ROOT/'api'/f['path'])==f['sha256']
 consumer=module('named9_consumer',PACK/'consume_named9.py');v,native,_,_,preparation=consumer.owners(ROOT)
 from cocolon_meaning_experience_engine.model_candidate_source import build_model_messages
 from cocolon_meaning_experience_engine.named_reference_wire import SCHEMA
 import run_pilot as r
 import torch
 from transformers import AutoTokenizer
 from safetensors.torch import load_file
 assert not torch.cuda.is_initialized()
 weights=load_file(str(INITIAL/'adapter_model.safetensors'),device='cpu')
 assert len(weights)==112 and all(t.dtype==torch.float32 and torch.isfinite(t).all().item() for t in weights.values())
 assert {n:importlib.metadata.version(n) for n in r.PINS}==r.PINS
 tok=AutoTokenizer.from_pretrained(r.MODEL,revision=r.REVISION,local_files_only=True,trust_remote_code=False)
 rows=r.read_jsonl(PACK/'train_messages.jsonl');cases=json.loads((PACK/'eval_inputs.json').read_text());assert len(rows)==len(cases)==15
 records=[]
 for row,case in zip(rows,cases,strict=True):
  cid=row['id'];assert cid==case['case_id']
  request,prior=v.reconstruct_request({'native_case':native[cid]})
  messages=build_model_messages(request,prior,candidate_format=SCHEMA if cid in IDS else preparation.QUOTE_CANDIDATE_SCHEMA)
  assert messages==case['messages']==row['messages'][:-1]
  e,prompt=r.encode_training(tok,row['messages'],context=8192)
  assert tok.eos_token_id in e['input_ids'][prompt:] and prompt+case['max_new_tokens']<=8192
  old=next(x for x in old_cpu['cases'] if x['case_id']==cid)
  assert prompt==old['prompt_tokens'] and len(e['input_ids'])==old['full_tokens']
  records.append(dict(case_id=cid,prompt_tokens=prompt,target_tokens=len(e['input_ids'])-prompt,full_tokens=len(e['input_ids']),max_new_tokens=case['max_new_tokens'],prompt_plus_cap=prompt+case['max_new_tokens']))
 counts=Counter(runner.ORDER);assert counts==Counter({**{cid:1 for cid in RETENTION},**{cid:3 for cid in IDS}})
 lengths={x['case_id']:x['full_tokens'] for x in records}
 assert sum(lengths[cid] for cid in runner.ORDER)==57976
 assert not torch.cuda.is_initialized()
 for f in manifest['files']:assert sha(ROOT/f['path'])==f['sha256']
 report=dict(status='CPU_NAMED9_READY_NO_MODEL_EXECUTION',seconds=time.monotonic()-start,source_cocolon='58d53fad39c12ebdb8d16046431351c76b373dbe',source_api=api['api_commit'],changed_prompts=IDS,optimizer_steps=9,unchanged_train_eval_bytes=True,reused_prior_cpu347=True,reused_prior_cpu_report_sha256=sha(OLD/'actual_cpu_check.json'),inherited_112_f32_finite=True,initial_adapter_sha256=sha(INITIAL/'adapter_model.safetensors'),inherited_run_sha256=sha(OLD_RUN/'run.json'),schedule_counts_verified=True,update_order=runner.ORDER,counts=dict(counts),cases=records,series_tokens=57976,series_length_squared_sum=sum(lengths[cid]**2 for cid in runner.ORDER),source_manifest_sha256=sha(ROOT/'restore_payload.json'),payload_sha256={n:sha(PACK/n) for n in ['train_messages.jsonl','eval_inputs.json','adaptive_loss.py','run_named9.py','consume_named9.py','prepare_named9.py']},model_loads=0,model_forwards=0,training_updates=0,generations=0,sql_operations=0,cuda_initialized=False,product_credit=0,automatic_progression=False)
 dump(PACK/'actual_cpu_check.json',report)
 print(json.dumps({k:v for k,v in report.items() if k not in ('cases','payload_sha256','update_order')},ensure_ascii=False),flush=True)
if __name__=='__main__':main()
