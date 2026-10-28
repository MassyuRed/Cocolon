"""Initial-values-only comparison; original full CE and all15 examples unchanged."""
import hashlib,importlib.util,json,os,shutil,sys,time
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path('/workspace/cocolon_fullce9_root_20261028')
OLD=Path('/workspace/cocolon_fullce9_pack_20261028')
PACK=Path('/workspace/cocolon_reset9_pack_20261028')
SRC=Path(__file__).resolve().parent
INITIAL='d431a07ce227c05e81eca5afb9461d91cf8101d50af0d27ec1a81844ce8ac684'
PREVIOUS='284f1df77c828982bdb7c2480f3f269b71dc9d69a29ea36b48dc6d25ab807d23'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def dump(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
def module(n,p):
 s=importlib.util.spec_from_file_location(n,p);m=importlib.util.module_from_spec(s);sys.modules[n]=m;s.loader.exec_module(m);return m
def main():
 started=time.monotonic()
 assert os.environ['CUDA_VISIBLE_DEVICES']=='' and os.environ['HF_HUB_OFFLINE']==os.environ['TRANSFORMERS_OFFLINE']=='1'
 assert not PACK.exists() and not Path('/workspace/cocolon_reset9_run_20261028').exists()
 assert sha(ROOT/'restore_payload.json')=='1573e92124f26971468404092ca13fcba68289c34b21237a73ecb1f6ef3439f4'
 manifest=json.loads((ROOT/'restore_payload.json').read_text())
 for f in manifest['files']:assert sha(ROOT/f['path'])==f['sha256'],f['path']
 cpu=json.loads((OLD/'actual_cpu_check.json').read_text())
 assert cpu['status']=='CPU_FULLCE9_READY_NO_MODEL_EXECUTION'
 assert all(sha(OLD/n)==h for n,h in cpu['payload_sha256'].items())
 prior=Path('/workspace/cocolon_updatesfirst9_pack_20261028/pytest_summary.json')
 assert sha(prior)==cpu['prior_pytest_summary_sha256']
 tests=json.loads(prior.read_text());assert tests['tests']==353 and tests['failures']==tests['errors']==tests['skipped']==tests['exit_code']==0
 PACK.mkdir()
 for n in ['eval_inputs.json','train_messages.jsonl','api_source_manifest.json']:shutil.copyfile(OLD/n,PACK/n)
 for n in ['run_reset9.py','prepare_reset9.py','consume_named9.py','export_reset9.py']:shutil.copyfile(SRC/n,PACK/n)
 consumer=module('reset9_consumer',PACK/'consume_named9.py');consumer.owners(ROOT)
 import run_pilot as helper
 import torch
 from safetensors.torch import load_file
 from transformers import AutoTokenizer
 assert not torch.cuda.is_initialized()
 tok=AutoTokenizer.from_pretrained(helper.MODEL,revision=helper.REVISION,local_files_only=True,trust_remote_code=False)
 rows=helper.read_jsonl(PACK/'train_messages.jsonl');cases=json.loads((PACK/'eval_inputs.json').read_text());assert len(rows)==len(cases)==15
 records=[]
 for row,case in zip(rows,cases,strict=True):
  assert row['id']==case['case_id'] and row['messages'][:-1]==case['messages']
  e,prefix=helper.encode_training(tok,row['messages'],context=8192);start,count=helper.assistant_loss_window(e)
  assert start==prefix-1 and count==len(e['input_ids'])-start
  assert e['labels'][:prefix]==[-100]*prefix and e['labels'][prefix:]==e['input_ids'][prefix:]
  assert prefix+case['max_new_tokens']<=8192 and e['input_ids'][prefix:].count(tok.eos_token_id)==1
  records.append(dict(case_id=row['id'],prompt_tokens=prefix,target_tokens=len(e['input_ids'])-prefix,full_tokens=len(e['input_ids']),max_new_tokens=case['max_new_tokens'],prompt_plus_cap=prefix+case['max_new_tokens'],input_ids_sha256=hashlib.sha256(json.dumps(e['input_ids'],separators=(',',':')).encode()).hexdigest(),all_target_and_eos_labels_exact=True,prompt_masked=True))
 assert records==cpu['cases']
 a=ROOT/'adapter';b=Path('/workspace/cocolon_named9_initial_20261028')
 assert sha(a/'adapter_model.safetensors')==INITIAL and sha(b/'adapter_model.safetensors')==PREVIOUS
 old=load_file(str(b/'adapter_model.safetensors'),device='cpu');values=load_file(str(a/'adapter_model.safetensors'),device='cpu')
 assert len(values)==len(old)==112 and set(values)==set(old)
 assert all(t.dtype==torch.float32 and torch.isfinite(t).all() and t.shape==old[n].shape for n,t in values.items())
 ca=json.loads((a/'adapter_config.json').read_text());cb=json.loads((b/'adapter_config.json').read_text())
 config_order_difference=ca['target_modules']!=cb['target_modules']
 ca['target_modules']=sorted(ca['target_modules']);cb['target_modules']=sorted(cb['target_modules']);assert ca==cb
 runner=module('reset9_runner',PACK/'run_reset9.py');baseline=module('fullce9_baseline_runner',OLD/'run_fullce9.py')
 assert runner.ORDER==baseline.ORDER and runner.IDS==baseline.IDS
 lengths={x['case_id']:x['full_tokens'] for x in records}
 assert sum(lengths[cid] for cid in runner.ORDER)==57730 and sum(lengths[cid]**2 for cid in runner.ORDER)==398780542
 new=dict(runner.FIXED);previous=dict(baseline.FIXED)
 for k in ['schema','initial_adapter_sha256','initial_adapter_provenance','initial_adapter_source_run_sha256','output_directory']:new.pop(k,None);previous.pop(k,None)
 assert new==previous
 normalized=(PACK/'run_reset9.py').read_text().replace('d431','284f')
 assert 'value=r.teacher_loss(model,input_ids=ids,attention_mask=torch.ones_like(ids),labels=labels,encoded=e)' in normalized
 for n in ['train_messages.jsonl','eval_inputs.json','api_source_manifest.json']:assert (PACK/n).read_bytes()==(OLD/n).read_bytes()
 assert not torch.cuda.is_initialized()
 names=['run_reset9.py','prepare_reset9.py','consume_named9.py','export_reset9.py','train_messages.jsonl','eval_inputs.json','api_source_manifest.json']
 report=dict(cpu)
 report.update(status='CPU_RESET9_READY_NO_MODEL_EXECUTION',seconds=time.monotonic()-started,payload_sha256={n:sha(PACK/n) for n in names},prior_cpu_check_sha256=sha(OLD/'actual_cpu_check.json'),prior353_rerun=False,initial_adapter_sha256=INITIAL,comparator_initial_adapter_sha256=PREVIOUS,identical_parameter_keys_shapes_and_dtype=True,identical_config_semantics=True,target_modules_order_only_difference=config_order_difference,exact_update_order_unchanged=True,only_training_factor='initial_adapter_parameter_values',model_loads=0,model_forwards=0,training_updates=0,generations=0,sql_operations=0,cuda_initialized=False)
 report.update(mock_calls=0,original_helper_cpu_evidence_reused=True)
 dump(PACK/'actual_cpu_check.json',report)
 plan=dict(runner.FIXED,status='PREPARED_AWAITING_FINAL_CPU_REVIEW',gpu_run_authorized=False,approval_basis=None,runner_sha256=sha(PACK/'run_reset9.py'),cpu_check_sha256=sha(PACK/'actual_cpu_check.json'),eval_inputs_sha256=sha(PACK/'eval_inputs.json'),train_messages_sha256=sha(PACK/'train_messages.jsonl'),consumer_sha256=sha(PACK/'consume_named9.py'),api_commit=runner.FIXED['base_api_commit'],api_source_manifest_sha256=sha(PACK/'api_source_manifest.json'))
 dump(PACK/'reset9.plan.json',plan);runner.validate(PACK)
 print(json.dumps({k:report[k] for k in ['status','seconds','initial_adapter_sha256','identical_config_semantics','identical_parameter_keys_shapes_and_dtype','exact_update_order_unchanged','series_tokens','series_length_squared_sum','cuda_initialized','model_loads','model_forwards','training_updates','generations']},ensure_ascii=False),flush=True)
if __name__=='__main__':main()
