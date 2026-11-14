"""One bounded CPU build for prior-notation repair; no model load/forward."""
import copy, hashlib, importlib.util, json, os, shutil, subprocess, sys, time
from pathlib import Path
sys.dont_write_bytecode = True
BASE = Path('/workspace/cocolon_namedoutput9_root_20261028')
OLD = Path('/workspace/cocolon_namedoutput9_pack_20261028')
ROOT = Path('/workspace/cocolon_updatesfirst9_root_20261028')
PACK = Path('/workspace/cocolon_updatesfirst9_pack_20261028')
SRC = Path(__file__).resolve().parent
IDS = ['FT-BOOK-AFTER-ANSWER', 'FT-SHOP-AFTER-ANSWER']
SOURCE = 'ai/services/ai_inference/cocolon_meaning_experience_engine/model_candidate_source.py'
TEST = 'ai/tests/test_cmee_named_reference_candidate.py'
def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def dump(p, v): p.write_text(json.dumps(v, ensure_ascii=False, indent=2, allow_nan=False)+'\n')
def module(n, p):
 s=importlib.util.spec_from_file_location(n,p); m=importlib.util.module_from_spec(s);sys.modules[n]=m;s.loader.exec_module(m);return m
def main():
 started=time.monotonic()
 assert os.environ['CUDA_VISIBLE_DEVICES']=='' and os.environ['HF_HUB_OFFLINE']==os.environ['TRANSFORMERS_OFFLINE']=='1'
 assert not ROOT.exists() and not PACK.exists()
 old_manifest=json.loads((BASE/'restore_payload.json').read_text())
 for f in old_manifest['files']: assert sha(BASE/f['path'])==f['sha256'],f['path']
 old_source=BASE/'api'/SOURCE
 assert old_source.read_bytes()==(SRC/'source_preimage.py').read_bytes()
 shutil.copytree(BASE,ROOT,ignore=shutil.ignore_patterns('__pycache__'))
 PACK.mkdir()
 for name in ['adaptive_loss.py']:
  shutil.copyfile(OLD/name, PACK/name)
 for name in ['run_updatesfirst9.py','prepare_updatesfirst9.py','run_cpu_tests.py','consume_named9.py']:
  shutil.copyfile(SRC/name,PACK/name)
 shutil.copyfile(SRC/'api'/SOURCE,ROOT/'api'/SOURCE)
 shutil.copyfile(SRC/'api'/TEST,ROOT/'api'/TEST)
 manifest=copy.deepcopy(old_manifest)
 for f in manifest['files']:
  if f['path'] in ['api/'+SOURCE,'api/'+TEST]:
   f['sha256']=sha(ROOT/f['path'])
   if 'size' in f: f['size']=(ROOT/f['path']).stat().st_size
 dump(ROOT/'restore_payload.json',manifest)
 consumer=(PACK/'consume_named9.py').read_text().replace('namedprior9.plan.json','updatesfirst9.plan.json')
 (PACK/'consume_named9.py').write_text(consumer)
 cm=module('namedprior_consumer',PACK/'consume_named9.py')
 v,native,Engine,semantic,prep=cm.owners(ROOT)
 from cocolon_meaning_experience_engine.model_candidate_source import build_model_messages
 from cocolon_meaning_experience_engine import named_reference_wire as wire
 import run_pilot as r
 import torch
 from transformers import AutoTokenizer
 from safetensors.torch import load_file
 assert not torch.cuda.is_initialized()
 tok=AutoTokenizer.from_pretrained(r.MODEL,revision=r.REVISION,local_files_only=True,trust_remote_code=False)
 cases=json.loads((OLD/'eval_inputs.json').read_text())
 rows=r.read_jsonl(OLD/'train_messages.jsonl')
 before=copy.deepcopy(cases); original_rows=copy.deepcopy(rows)
 records=[]; old_target_hashes={}
 for row,case in zip(rows,cases,strict=True):
  cid=row['id'];assert cid==case['case_id']
  request,prior=v.reconstruct_request({'native_case':native[cid]})
  old=copy.deepcopy(case['messages'])
  messages=build_model_messages(request,prior,candidate_format=wire.SCHEMA if cid in IDS else prep.QUOTE_CANDIDATE_SCHEMA)
  if cid in IDS:
   a=json.loads(old[1]['content']);b=json.loads(messages[1]['content'])
   before_prior=a['prior_adopted_interpretation'];after_prior=b['prior_adopted_interpretation']
   decoded=wire.decode(after_prior['meaning_packet'])
   assert after_prior==before_prior
   assert decoded==wire.decode(before_prior['meaning_packet'])
   assert a['material']==b['material']
   assert before_prior['snapshot_ref']==after_prior['snapshot_ref']
   assert old[0]==messages[0] and old!=messages
   qold=build_model_messages(request,prior,candidate_format=prep.QUOTE_CANDIDATE_SCHEMA)
   assert wire.decode(after_prior['meaning_packet'])['candidate']==json.loads(qold[1]['content'])['prior_adopted_interpretation']['meaning_packet']['candidate']
  else: assert old==messages,cid
  old_target_hashes[cid]=hashlib.sha256(row['messages'][-1]['content'].encode()).hexdigest()
  target=copy.deepcopy(row['messages'][-1])
  if cid in IDS:
   packet=json.loads(target['content']);original_packet=copy.deepcopy(packet)
   packet['c']['prose']=packet['c'].pop('prose')
   target['content']=json.dumps(packet,ensure_ascii=False,separators=(',',':'),allow_nan=False)
   assert json.loads(target['content'])==original_packet
   assert wire.decode(packet)==wire.decode(original_packet)
   assert list(packet['c']).index('updates')<list(packet['c']).index('prose')
  else:assert target==row['messages'][-1]
  row['messages']=messages+[target];case['messages']=messages
  e,prompt=r.encode_training(tok,row['messages'],context=8192)
  print('CHECK_LENGTH',cid,prompt,case['max_new_tokens'],prompt+case['max_new_tokens'],flush=True)
  assert tok.eos_token_id in e['input_ids'][prompt:] and prompt+case['max_new_tokens']<=8192,(cid,prompt,case['max_new_tokens'])
  old_e,old_prompt=r.encode_training(tok,original_rows[len(records)]['messages'],context=8192)
  if cid not in IDS:assert e['input_ids'][prompt:]==old_e['input_ids'][old_prompt:]
  else:
   assert json.loads(row['messages'][-1]['content'])==json.loads(original_rows[len(records)]['messages'][-1]['content'])
   assert e['input_ids'][prompt:].count(tok.eos_token_id)==old_e['input_ids'][old_prompt:].count(tok.eos_token_id)
  records.append(dict(case_id=cid,old_prompt_tokens=old_prompt,prompt_tokens=prompt,target_tokens=len(e['input_ids'])-prompt,full_tokens=len(e['input_ids']),prompt_plus_cap=prompt+case['max_new_tokens'],max_new_tokens=case['max_new_tokens']))
 assert len(rows)==15 and sum(a!=b for a,b in zip(cases,before))==2
 dump(PACK/'eval_inputs.json',cases)
 (PACK/'train_messages.jsonl').write_text(''.join(json.dumps(x,ensure_ascii=False,separators=(',',':'))+'\n' for x in rows))
 weights=load_file('/workspace/cocolon_named9_initial_20261028/adapter_model.safetensors',device='cpu')
 assert len(weights)==112 and all(t.dtype==torch.float32 and torch.isfinite(t).all() for t in weights.values())
 # The restored dependency set and all test files already exist on this Pod.
 env=dict(os.environ,PYTHONPATH=str(ROOT/'api/ai/services/ai_inference')+':'+str(ROOT/'api/ai/tests')+':/workspace/cocolon_named13_pytest_deps')
 proc=subprocess.run([sys.executable,'-B',str(PACK/'run_cpu_tests.py')],env=env,text=True,capture_output=True,timeout=180)
 (PACK/'pytest.log').write_text(proc.stdout+proc.stderr)
 print((proc.stdout+proc.stderr)[-3000:],flush=True)
 assert proc.returncode==0,'targeted_test_failure'
 runner=module('updatesfirst9_runner',PACK/'run_updatesfirst9.py')
 lengths={x['case_id']:x['full_tokens'] for x in records}
 api=json.loads((OLD/'api_source_manifest.json').read_text())
 api['api_commit']='1739a6bfe05186fa6f39bfa6a40259ed60f1579c'
 for f in api['files']:
  if f['path'] in (SOURCE,TEST):f['sha256']=sha(ROOT/'api'/f['path'])
 dump(PACK/'api_source_manifest.json',api)
 for f in old_manifest['files']: assert sha(BASE/f['path'])==f['sha256']
 assert not torch.cuda.is_initialized()
 report=dict(status='CPU_UPDATESFIRST9_READY_NO_MODEL_EXECUTION',seconds=time.monotonic()-started,optimizer_steps=9,changed_prompts=IDS,only_two_named_prompts_changed=True,fresh_same_family_tests_passed=True,inherited_112_f32_finite=True,schedule_counts_verified=True,cases=records,canonical_targets_unchanged=True,derived_two_targets_reordered_only=True,target_sha256=old_target_hashes,old13_inputs_unchanged=True,prior_projection_roundtrip=2,pytest_exit=proc.returncode,series_tokens=sum(lengths[cid] for cid in runner.ORDER),series_length_squared_sum=sum(lengths[cid]**2 for cid in runner.ORDER),source_manifest_sha256=sha(ROOT/'restore_payload.json'),payload_sha256={n:sha(PACK/n) for n in ['train_messages.jsonl','eval_inputs.json','adaptive_loss.py','run_updatesfirst9.py','consume_named9.py','prepare_updatesfirst9.py']},model_loads=0,model_forwards=0,training_updates=0,generations=0,sql_operations=0,cuda_initialized=False,product_credit=0,automatic_progression=False)
 dump(PACK/'actual_cpu_check.json',report)
 print(json.dumps({k:v for k,v in report.items() if k not in ('cases','payload_sha256','target_sha256')},ensure_ascii=False),flush=True)
 print('NAMED CASE LENGTHS',json.dumps([x for x in records if x['case_id'] in IDS]),flush=True)
if __name__=='__main__':main()

