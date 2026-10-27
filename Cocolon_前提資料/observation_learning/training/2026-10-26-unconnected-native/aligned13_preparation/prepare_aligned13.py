"""Build exact current quote inputs with unchanged teachers on CPU, once."""
import argparse,copy,hashlib,importlib.metadata,importlib.util,json,os,subprocess,sys,time
from collections import Counter
from dataclasses import replace
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path('/workspace/cocolon_update_obligations_20261028')
AFTER=['FT-BOOK-AFTER-ANSWER','FT-SHOP-AFTER-ANSWER']
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def dump(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
def module(name,p):
 s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);sys.modules[name]=m;s.loader.exec_module(m);return m
def main(pack):
 started=time.monotonic();assert not (pack/'actual_cpu_check.json').exists()
 assert os.environ.get('CUDA_VISIBLE_DEVICES')=='' and os.environ.get('HF_HUB_OFFLINE')==os.environ.get('TRANSFORMERS_OFFLINE')=='1'
 manifest=json.loads((ROOT/'restore_payload.json').read_text())
 for f in manifest['files']:assert sha(ROOT/f['path'])==f['sha256'],f['path']
 sys.path[:0]=[str(ROOT/'api/ai/services/ai_inference'),str(ROOT/'legacy')]
 r=module('run_pilot',ROOT/'legacy/run_pilot.py');v=module('verify_cmee',ROOT/'legacy/verify_cmee.py')
 frozen=module('aligned13_frozen_cases',ROOT/'frozen/consume_expanded15_recovery.py')
 _,native=frozen.frozen_cases(ROOT/'frozen',ROOT/'frozen/sft_examples.jsonl')
 from cocolon_meaning_experience_engine import preparation,model_candidate_source as source,MeaningExperienceEngine
 from cocolon_meaning_experience_engine import emlis_semantic_admission as semantic
 from transformers import AutoTokenizer
 import torch
 assert not torch.cuda.is_initialized()
 assert {n:importlib.metadata.version(n) for n in r.PINS}==r.PINS
 assert sha(source.__file__)=='31512acc35b374ca3ab5924b55cc120404d1208d98375f40a801240e2cb6852c'
 tok=AutoTokenizer.from_pretrained(r.MODEL,revision=r.REVISION,local_files_only=True,trust_remote_code=False)
 old=r.read_jsonl(ROOT/'frozen/current_train_messages.jsonl')
 cases=json.loads((ROOT/'frozen/current_eval_inputs.json').read_text());assert len(old)==len(cases)==15
 rows=[];records=[];changed=[]
 for row,case in zip(old,cases,strict=True):
  cid=row['id'];assert cid==case['case_id']
  request,prior=v.reconstruct_request({'native_case':native[cid]});prior_before=copy.deepcopy(prior)
  messages=source.build_model_messages(request,prior,candidate_format=preparation.QUOTE_CANDIDATE_SCHEMA)
  assert messages==case['messages'] and prior==prior_before
  expected=json.loads(row['messages'][1]['content']);current=json.loads(messages[1]['content'])
  is_changed=row['messages'][:-1]!=messages
  removed=0
  if is_changed:
   changed.append(cid)
   for e in expected['prior_adopted_interpretation']['meaning_packet']['evidence']:
    for key in ('start','end'):
     assert key in e;del e[key];removed+=1
   assert removed==12
  assert expected==current and row['messages'][0]==messages[0],'non_coordinate_prompt_change:'+cid
  aligned=dict(row,messages=messages+[row['messages'][-1]])
  encoded,prompt=r.encode_training(tok,aligned['messages'],context=8192)
  old_encoded,old_prompt=r.encode_training(tok,row['messages'],context=8192)
  assert encoded['input_ids'][prompt:]==old_encoded['input_ids'][old_prompt:]
  assert tok.eos_token_id in encoded['input_ids'][prompt:]
  assert prompt+case['max_new_tokens']<=8192
  packet=r.strict_json(aligned['messages'][-1]['content'])
  material=preparation.prepare_emlis(request)
  receipt=preparation.receive_candidate(material,request_id=material.request_id,raw_output=aligned['messages'][-1]['content'],finish_reason='stop')
  assert receipt.status=='CANDIDATE_UNREVIEWED'
  checkpoint=MeaningExperienceEngine().prepare_emlis_update(request,semantic_input=semantic.SemanticInput('FRESH_CANDIDATE',receipt,prior_snapshot_json=prior,semantic_profile=semantic.MODEL_PROFILE))
  resumed=replace(request,emlis_thread=replace(request.emlis_thread,prepared_meaning_checkpoint_ref=checkpoint.checkpoint_id))
  outcome=MeaningExperienceEngine().generate(resumed,semantic_input=semantic.SemanticInput('RESUME_ADOPTED',snapshot_json=checkpoint.semantic_snapshot,semantic_profile=semantic.MODEL_PROFILE))
  assert outcome.artifact is not None,'teacher_body_unavailable:'+cid
  rows.append(aligned)
  records.append(dict(case_id=cid,prompt_changed=is_changed,removed_prior_coordinate_items=removed,prompt_tokens=prompt,target_tokens=len(encoded['input_ids'])-prompt,full_tokens=len(encoded['input_ids']),prompt_plus_cap=prompt+case['max_new_tokens'],teacher_sha256=hashlib.sha256(aligned['messages'][-1]['content'].encode()).hexdigest(),target_ids_unchanged=True,teacher_meaning_adopted=True,teacher_body_available=True))
 expected_changed={x['id'] for x in old if x['id'].endswith('-CORRECTION')}|set(AFTER)
 assert set(changed)==expected_changed and len(changed)==5
 plan=json.loads((pack/'aligned13.plan.json').read_text());counts=Counter(plan['update_order'])
 assert counts==Counter({**{x['id']:1 for x in old if not x['id'].startswith('FT-')},**{cid:2 for cid in AFTER}})
 (pack/'train_messages.jsonl').write_text(''.join(json.dumps(x,ensure_ascii=False,separators=(',',':'))+'\n' for x in rows))
 dump(pack/'eval_inputs.json',cases)
 result=subprocess.run([sys.executable,'-B',str(pack/'consume_aligned13.py'),'--root',str(ROOT),'--out',str(pack/'consumer_cpu_smoke'),'--smoke-prior'],capture_output=True,text=True,timeout=60)
 assert result.returncode==0,result.stderr
 dump(pack/'consumer_cpu_launch.json',dict(returncode=result.returncode,stdout=result.stdout,stderr=result.stderr))
 for f in manifest['files']:assert sha(ROOT/f['path'])==f['sha256']
 assert not torch.cuda.is_initialized()
 names=['train_messages.jsonl','eval_inputs.json','adaptive_loss.py','run_aligned13.py','consume_aligned13.py','prepare_aligned13.py']
 report=dict(status='CPU_ALIGNED13_READY_NO_MODEL_EXECUTION',seconds=time.monotonic()-started,source_api_ref='64c6cb1a41620fd2d7690e0b6f1af30ae0e624a4',source_cocolon_ref='1ca8b50a64bdb53163c396fa1414a1e6a65d541b',case_count=15,changed_prompts=changed,unchanged_prompts=10,teacher15_target_ids_unchanged=True,teacher15_meaning_body_adopted=True,update_order=plan['update_order'],unique_training_cases=len(counts),optimizer_steps=13,untrained_new_initial_cases=[x['id'] for x in old if x['id'].startswith('FT-') and x['id'] not in AFTER],cases=records,source_manifest_sha256=sha(ROOT/'restore_payload.json'),payload_sha256={n:sha(pack/n) for n in names},model_loads=0,model_forwards=0,training_updates=0,generations=0,sql_operations=0,cuda_initialized=False,pytest=0,product_credit=0,automatic_progression=False)
 dump(pack/'actual_cpu_check.json',report)
 print(json.dumps({k:v for k,v in report.items() if k not in ('cases','payload_sha256','update_order')},ensure_ascii=False),flush=True)
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--pack',type=Path,required=True);a=p.parse_args();main(a.pack.resolve())
