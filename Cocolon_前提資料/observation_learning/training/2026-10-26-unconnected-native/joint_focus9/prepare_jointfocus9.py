"""Fresh CPU preparation; same raw teachers/prompt/API, one-forward joint loss."""
import copy,hashlib,importlib.util,json,os,shutil,sys,time
from collections import Counter
from pathlib import Path
sys.dont_write_bytecode=True
BASE=Path('/workspace/cocolon_updatesfirst9_root_20261028')
OLD=Path('/workspace/cocolon_updatesfirst9_pack_20261028')
ROOT=Path('/workspace/cocolon_jointfocus9_root_20261028')
PACK=Path('/workspace/cocolon_jointfocus9_pack_20261028')
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
 api=json.loads((OLD/'api_source_manifest.json').read_text())
 assert api['api_commit']=='7b9ee073de03940ba71587297d8600b2b6094dd1'
 for f in api['files']:assert sha(BASE/'api'/f['path'])==f['sha256']
 prior_tests=json.loads((OLD/'pytest_summary.json').read_text())
 assert prior_tests['tests']==353 and prior_tests['failures']==prior_tests['errors']==prior_tests['skipped']==prior_tests['exit_code']==0
 shutil.copytree(BASE,ROOT,ignore=shutil.ignore_patterns('__pycache__'));PACK.mkdir()
 for n in ['eval_inputs.json','train_messages.jsonl','api_source_manifest.json']:shutil.copyfile(OLD/n,PACK/n)
 for n in ['adaptive_loss.py','run_jointfocus9.py','prepare_jointfocus9.py','consume_named9.py']:shutil.copyfile(SRC/n,PACK/n)
 consumer=module('jointfocus9_consumer',PACK/'consume_named9.py');v,native,Engine,semantic,prep=consumer.owners(ROOT)
 import run_pilot as helper
 import torch
 from transformers import AutoTokenizer
 from safetensors.torch import load_file
 assert not torch.cuda.is_initialized()
 tok=AutoTokenizer.from_pretrained(helper.MODEL,revision=helper.REVISION,local_files_only=True,trust_remote_code=False)
 assert tok.is_fast
 rows=helper.read_jsonl(PACK/'train_messages.jsonl');cases=json.loads((PACK/'eval_inputs.json').read_text())
 assert len(rows)==len(cases)==15
 loss=module('jointfocus9_loss',PACK/'adaptive_loss.py');old_loss=module('jointfocus9_old_adaptive',OLD/'adaptive_loss.py')
 toy=torch.tensor([0.,.1,.8,2.,9.]);assert torch.equal(loss.normalized_weights(toy),old_loss.normalized_weights(toy))
 checks=loss.cpu_loss_checks();groups={};records=[]
 for row,case in zip(rows,cases,strict=True):
  cid=row['id'];assert cid==case['case_id'] and row['messages'][:-1]==case['messages']
  e,prefix=helper.encode_training(tok,row['messages'],context=8192)
  assert prefix+case['max_new_tokens']<=8192 and tok.eos_token_id in e['input_ids'][prefix:]
  rec=dict(case_id=cid,prompt_tokens=prefix,target_tokens=len(e['input_ids'])-prefix,full_tokens=len(e['input_ids']),max_new_tokens=case['max_new_tokens'],prompt_plus_cap=prefix+case['max_new_tokens'])
  if cid in IDS:
   group,stats=loss.build_groups(tok,helper,row['messages']);groups[cid]=group;rec['focus']=stats
   ce=torch.linspace(.01,4.,stats['target_tokens']);alpha=loss.joint_weights(ce,group)
   assert torch.isfinite(alpha).all() and (alpha>0).all() and abs(float(alpha.sum())-1.)<1e-6
   rec['focus']['minimum_target_weight']=float(alpha.min())
  records.append(rec)
 assert set(groups)==set(IDS)
 dump(PACK/'target_groups.json',groups)
 for n in ['train_messages.jsonl','eval_inputs.json','api_source_manifest.json']:assert (PACK/n).read_bytes()==(OLD/n).read_bytes(),n
 weights=load_file('/workspace/cocolon_named9_initial_20261028/adapter_model.safetensors',device='cpu')
 assert len(weights)==112 and all(t.dtype==torch.float32 and torch.isfinite(t).all() for t in weights.values())
 runner=module('jointfocus9_runner',PACK/'run_jointfocus9.py')
 assert Counter(runner.ORDER)==Counter({IDS[0]:3,IDS[1]:3,'TRAIN-SERVICE-CHAIR-01-INITIAL':1,'TRAIN-SERVICE-CHAIR-01-CORRECTION':1,'TRAIN-DAILY-CALM-01-INITIAL':1})
 lengths={x['case_id']:x['full_tokens'] for x in records}
 for f in manifest['files']:assert sha(BASE/f['path'])==f['sha256'] and sha(ROOT/f['path'])==f['sha256']
 assert not torch.cuda.is_initialized()
 names=['adaptive_loss.py','run_jointfocus9.py','prepare_jointfocus9.py','consume_named9.py','train_messages.jsonl','eval_inputs.json','target_groups.json']
 report=dict(status='CPU_JOINTFOCUS9_READY_NO_MODEL_EXECUTION',seconds=time.monotonic()-started,optimizer_steps=9,changed_prompts=[],all15_prompt_teacher_bytes_unchanged=True,prior_353_same_api_verified=True,prior_pytest_summary_sha256=sha(OLD/'pytest_summary.json'),prior353_rerun=False,inherited_112_f32_finite=True,schedule_counts_verified=True,source_manifest_sha256=sha(ROOT/'restore_payload.json'),cases=records,loss_checks=checks,mixture=dict(full_adaptive=.5,ground=.25,prose=.25),old3_original_ce=True,payload_sha256={n:sha(PACK/n) for n in names},series_tokens=sum(lengths[cid] for cid in runner.ORDER),series_length_squared_sum=sum(lengths[cid]**2 for cid in runner.ORDER),model_loads=0,model_forwards=0,training_updates=0,generations=0,sql_operations=0,cuda_initialized=False,product_credit=0,automatic_progression=False)
 dump(PACK/'actual_cpu_check.json',report)
 print(json.dumps({k:v for k,v in report.items() if k not in ('cases','payload_sha256')},ensure_ascii=False),flush=True)
 for rec in records:
  if rec['case_id'] in IDS:print(json.dumps(rec,ensure_ascii=False),flush=True)
if __name__=='__main__':main()
