"""Same teachers/input/initial/schedule; remove custom objective, use original helper."""
import hashlib,importlib.util,json,os,shutil,sys,time
from pathlib import Path
from collections import Counter
sys.dont_write_bytecode=True
BASE=Path('/workspace/cocolon_jointfocus9_root_20261028')
OLD=Path('/workspace/cocolon_jointfocus9_pack_20261028')
ROOT=Path('/workspace/cocolon_fullce9_root_20261028')
PACK=Path('/workspace/cocolon_fullce9_pack_20261028')
SRC=Path(__file__).resolve().parent
IDS=['FT-BOOK-AFTER-ANSWER','FT-SHOP-AFTER-ANSWER']
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def dump(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
def module(n,p):
 s=importlib.util.spec_from_file_location(n,p);m=importlib.util.module_from_spec(s);sys.modules[n]=m;s.loader.exec_module(m);return m
def main():
 started=time.monotonic()
 assert os.environ['CUDA_VISIBLE_DEVICES']=='' and os.environ['HF_HUB_OFFLINE']==os.environ['TRANSFORMERS_OFFLINE']=='1'
 assert not ROOT.exists() and not PACK.exists()
 manifest=json.loads((BASE/'restore_payload.json').read_text())
 for f in manifest['files']:assert sha(BASE/f['path'])==f['sha256'],f['path']
 assert sha(BASE/'legacy/run_pilot.py')=='2f659078c05bee6d7b32f50aae8b9eebc03c767d4a3be084bc17e9e3ccc4c10d'
 oldcpu=json.loads((OLD/'actual_cpu_check.json').read_text())
 assert oldcpu['status']=='CPU_JOINTFOCUS9_READY_NO_MODEL_EXECUTION'
 assert all(sha(OLD/n)==h for n,h in oldcpu['payload_sha256'].items())
 prior=Path('/workspace/cocolon_updatesfirst9_pack_20261028/pytest_summary.json')
 assert sha(prior)==oldcpu['prior_pytest_summary_sha256']
 tests=json.loads(prior.read_text());assert tests['tests']==353 and tests['failures']==tests['errors']==tests['skipped']==tests['exit_code']==0
 api=json.loads((OLD/'api_source_manifest.json').read_text());assert api['api_commit']=='7b9ee073de03940ba71587297d8600b2b6094dd1'
 for f in api['files']:assert sha(BASE/'api'/f['path'])==f['sha256']
 shutil.copytree(BASE,ROOT,ignore=shutil.ignore_patterns('__pycache__'));PACK.mkdir()
 for n in ['eval_inputs.json','train_messages.jsonl','api_source_manifest.json']:shutil.copyfile(OLD/n,PACK/n)
 for n in ['run_fullce9.py','prepare_fullce9.py','consume_named9.py','export_fullce9.py']:shutil.copyfile(SRC/n,PACK/n)
 consumer=module('fullce9_consumer',PACK/'consume_named9.py');consumer.owners(ROOT)
 import run_pilot as helper
 import torch
 from transformers import AutoTokenizer
 from safetensors.torch import load_file
 assert not torch.cuda.is_initialized()
 tok=AutoTokenizer.from_pretrained(helper.MODEL,revision=helper.REVISION,local_files_only=True,trust_remote_code=False)
 rows=helper.read_jsonl(PACK/'train_messages.jsonl');cases=json.loads((PACK/'eval_inputs.json').read_text());assert len(rows)==len(cases)==15
 records=[]
 for row,case in zip(rows,cases,strict=True):
  assert row['id']==case['case_id'] and row['messages'][:-1]==case['messages']
  e,prefix=helper.encode_training(tok,row['messages'],context=8192);start,count=helper.assistant_loss_window(e)
  assert start==prefix-1 and count==len(e['input_ids'])-start and e['labels'][:prefix]==[-100]*prefix and e['labels'][prefix:]==e['input_ids'][prefix:]
  assert prefix+case['max_new_tokens']<=8192 and e['input_ids'][prefix:].count(tok.eos_token_id)==1
  records.append(dict(case_id=row['id'],prompt_tokens=prefix,target_tokens=len(e['input_ids'])-prefix,full_tokens=len(e['input_ids']),max_new_tokens=case['max_new_tokens'],prompt_plus_cap=prefix+case['max_new_tokens'],input_ids_sha256=hashlib.sha256(json.dumps(e['input_ids'],separators=(',',':')).encode()).hexdigest(),all_target_and_eos_labels_exact=True,prompt_masked=True))
 # CPU sentinel proves direct original helper delegation and exact label window.
 encoded={'input_ids':[1,2,3,4,5],'labels':[-100,-100,3,4,5]};ids=torch.tensor([encoded['input_ids']]);labels=torch.tensor([encoded['labels']]);calls=[];sentinel=object()
 class Spy:
  def __call__(self,**kw):
   calls.append(kw);return type('Result',(),{'loss':sentinel})()
 assert helper.teacher_loss(Spy(),input_ids=ids,attention_mask=torch.ones_like(ids),labels=labels,encoded=encoded) is sentinel
 assert len(calls)==1 and calls[0]['logits_to_keep']==4 and calls[0]['use_cache'] is False and torch.equal(calls[0]['labels'],labels[:,1:])
 for n in ['train_messages.jsonl','eval_inputs.json','api_source_manifest.json']:assert (PACK/n).read_bytes()==(OLD/n).read_bytes()
 weights=load_file('/workspace/cocolon_named9_initial_20261028/adapter_model.safetensors',device='cpu');assert len(weights)==112 and all(t.dtype==torch.float32 and torch.isfinite(t).all() for t in weights.values())
 runner=module('fullce9_runner',PACK/'run_fullce9.py');assert Counter(runner.ORDER)==Counter({IDS[0]:3,IDS[1]:3,'TRAIN-SERVICE-CHAIR-01-INITIAL':1,'TRAIN-SERVICE-CHAIR-01-CORRECTION':1,'TRAIN-DAILY-CALM-01-INITIAL':1})
 assert "value=r.teacher_loss(model,input_ids=ids,attention_mask=torch.ones_like(ids),labels=labels,encoded=e)" in (PACK/'run_fullce9.py').read_text()
 for f in manifest['files']:assert sha(ROOT/f['path'])==f['sha256']
 assert not torch.cuda.is_initialized()
 names=['run_fullce9.py','prepare_fullce9.py','consume_named9.py','train_messages.jsonl','eval_inputs.json','api_source_manifest.json']
 lengths={x['case_id']:x['full_tokens'] for x in records}
 report=dict(status='CPU_FULLCE9_READY_NO_MODEL_EXECUTION',seconds=time.monotonic()-started,optimizer_steps=9,changed_prompts=[],all15_prompt_teacher_bytes_unchanged=True,prior_353_same_api_verified=True,prior_pytest_summary_sha256=sha(prior),prior353_rerun=False,inherited_112_f32_finite=True,schedule_counts_verified=True,source_manifest_sha256=sha(ROOT/'restore_payload.json'),cases=records,training_loss='original_full_assistant_ce_including_eos',original_helper_exact=True,helper_single_call_and_label_window_verified=True,mock_calls=1,series_tokens=sum(lengths[cid] for cid in runner.ORDER),series_length_squared_sum=sum(lengths[cid]**2 for cid in runner.ORDER),payload_sha256={n:sha(PACK/n) for n in names},model_loads=0,model_forwards=0,training_updates=0,generations=0,sql_operations=0,cuda_initialized=False,product_credit=0,automatic_progression=False)
 dump(PACK/'actual_cpu_check.json',report)
 print(json.dumps({k:v for k,v in report.items() if k not in ('cases','payload_sha256')},ensure_ascii=False),flush=True)
 for rec in records:
  if rec['case_id'] in IDS:print(json.dumps(rec),flush=True)
if __name__=='__main__':main()
