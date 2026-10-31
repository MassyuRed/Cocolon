"""One CPU check of serialization, tokenizer, pinned consumer, and pending execute. No 4B load/forward."""
import os
os.environ.update(CUDA_VISIBLE_DEVICES='',HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
import argparse, copy, hashlib, importlib.util, json, signal, sys, time
from pathlib import Path
from dataclasses import replace
sys.dont_write_bytecode=True
def load(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def main(pack):
 start=time.monotonic()
 def timeout(*_):raise TimeoutError('ordered30_cpu_deadline_no_retry')
 signal.signal(signal.SIGALRM,timeout);signal.alarm(300)
 runner=load('ordered30_runner_cpu',pack/'run_native15_ordered30.py')
 require=runner.require
 require(not runner.OUTPUT.exists(),'new_gpu_output_already_exists')
 plan,r,joint,tok,rows,cases,encoded,check=runner.prepare(pack)
 require(plan['gpu_run_authorized'] is False and plan['approval_basis'] is None,'new_approval_required')
 try:runner.execute(pack,'0'*40)
 except ValueError as exc:require(str(exc)=='execute_refused_mash_approval_pending','wrong_pending_refusal')
 else:raise AssertionError('pending_execute_did_not_refuse')
 require(not runner.OUTPUT.exists(),'pending_execute_created_output')
 from safetensors import safe_open
 import torch
 tensor_count=0
 with safe_open(str(runner.INITIAL/'adapter_model.safetensors'),framework='pt',device='cpu') as f:
  for key in f.keys():
   value=f.get_tensor(key);require(value.dtype==torch.float32 and bool(torch.isfinite(value).all()),'initial_tensor_invalid');tensor_count+=1
 require(tensor_count==32,'initial_tensor_count')
 consumer=load('ordered30_consumer_cpu',pack/'consume_ordered30.py')
 args=argparse.Namespace(run=pack,api=Path('/workspace/cocolon_afteronly_api_20261027'),legacy=runner.LEGACY,runtime_python=Path('/workspace/cocolon_4b_service_runtime_20261025/python'),examples=runner.JOINT/'sft_examples.jsonl')
 bound_cases,native=consumer.frozen_cases(pack,args.examples)
 j,reconstruct,Engine,semantic,preparation,build,_=consumer.load_api(args)
 result=[]
 for row,case in zip(rows,cases,strict=True):
  req,prior=reconstruct({'native_case':native[row['id']]})
  require(build(req,prior,candidate_format=preparation.QUOTE_CANDIDATE_SCHEMA)==case['messages'],'actual_prompt_or_prior_changed')
  texts=[row['messages'][-1]['content'],runner.ordered_target(row['messages'][-1]['content'])]
  require(json.loads(texts[0])==json.loads(texts[1]),'parsed_target_changed')
  outputs=[];snapshots=[];receipts=[];checkpoints=[]
  for text in texts:
   material=preparation.prepare_emlis(req)
   receipt=preparation.receive_candidate(material,request_id=material.request_id,raw_output=text,finish_reason='stop',provider='local_transformers',model=consumer.MODEL,revision=consumer.REVISION,adapter_revision=plan['initial_adapter_sha256']['adapter_model.safetensors'],usage={'prompt_tokens':1,'completion_tokens':1},elapsed_seconds=0.0)
   receipt_value=j(receipt);require(receipt_value.pop('raw_output')==text,'receipt_raw_not_preserved');receipts.append(receipt_value)
   cp=Engine().prepare_emlis_update(req,semantic_input=semantic.SemanticInput('FRESH_CANDIDATE',receipt=receipt,prior_snapshot_json=prior,semantic_profile=semantic.MODEL_PROFILE))
   snapshot=json.loads(cp.semantic_snapshot);require(snapshot['receipt'].pop('raw_output')==text,'snapshot_raw_not_preserved');snapshots.append(snapshot)
   checkpoint_value=j(cp);checkpoint_value.pop('semantic_snapshot');checkpoints.append(checkpoint_value)
   resumed=replace(req,emlis_thread=replace(req.emlis_thread,prepared_meaning_checkpoint_ref=cp.checkpoint_id))
   outcome=Engine().generate(resumed,semantic_input=semantic.SemanticInput('RESUME_ADOPTED',snapshot_json=cp.semantic_snapshot,semantic_profile=semantic.MODEL_PROFILE))
   require(outcome.artifact is not None,'teacher_body_unavailable')
   output=j(outcome);embedded=json.loads(output['meaning_checkpoint']['semantic_snapshot']);require(embedded['receipt'].pop('raw_output')==text,'outcome_raw_not_preserved');output['meaning_checkpoint']['semantic_snapshot']=consumer.canonical(embedded);outputs.append(output)
  same_meaning=snapshots[0]==snapshots[1] and checkpoints[0]==checkpoints[1] and receipts[0]==receipts[1]
  same_output=outputs[0]==outputs[1]
  result.append(dict(id=row['id'],both_meanings_adopted=True,both_bodies_available=True,meaning_packet_equal=same_meaning,outcome_equal_except_receipt_raw_serialization=same_output,original_outcome_sha256=consumer.value_sha(outputs[0]),ordered_outcome_sha256=consumer.value_sha(outputs[1])))
  require(same_meaning and same_output,'cmee_serialization_invariance_failed:'+row['id'])
 require(r.adapter_hashes(runner.INITIAL)==plan['initial_adapter_sha256'],'initial_changed')
 runner.validate_successor(pack)
 require(not runner.OUTPUT.exists(),'cpu_created_gpu_output')
 report=dict(status='CPU_ORDERED15_READY_MODEL_NOT_LOADED',seconds=time.monotonic()-start,runner_check=check,serialization_order=dict(root=list(runner.ROOT_ORDER),candidate=list(runner.CANDIDATE_ORDER)),cmee_teacher_comparisons=result,initial_finite_f32_tensors=tensor_count,pending_execute_refused_before_output=True,gpu_output_exists=False,base_model_loads=0,model_forwards=0,training_updates=0,model_generations=0,teacher_cpu_adoptions=30,sql_operations=0,product_credit=0,automatic_progression=False,source_files={p.name:dict(bytes=p.stat().st_size,sha256=runner.sha(p)) for p in (pack/'run_native15_ordered30.py',pack/'gpu30_ordered.plan.json',pack/'consume_ordered30.py',Path(__file__))})
 runner.dump(pack/'actual_cpu_check.json',report)
 signal.alarm(0)
 print(json.dumps(dict(status=report['status'],seconds=report['seconds'],rows=len(rows),parsed_equal=15,cmee_normalized_outcome_equal=15,max_full_tokens=max(x['full_tokens'] for x in check['rows']),model_loads=0,updates=0,generations=0,pending_execute_refused=True),ensure_ascii=False),flush=True)
 print('RESULT',runner.sha(pack/'actual_cpu_check.json'),(pack/'actual_cpu_check.json').stat().st_size,flush=True)
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--pack',type=Path,required=True);a=p.parse_args();main(a.pack.resolve())
