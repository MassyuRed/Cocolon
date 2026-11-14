from pathlib import Path
import json,sys,time,hashlib,os
d=Path('/workspace/cocolon_4b_projection_check_20261025');sys.path.insert(0,str(d))
import run_pilot as r
assert (d/'SOURCE_COMMIT').read_text().strip()=='d6f8febd8f90e2f60df2936aa7c0d270b3afa7ab'
assert r.digest(d/'dataset_manifest.json')=='4e739cc3307960eeb8fe1ead8ada6a99f41af0b2d86bcd5c65edb57924035df3'
plan=r.strict_json((d/'execution_plan.json').read_text())
plan.update(status='AUTHORIZED_INFERENCE_ONLY_CURRENT_MASH_REQUEST',evaluation_case_ids=['FIT-FT-CHAIR-INITIAL','FIT-FT-CHAIR-AFTER-CORRECTION'],max_seconds=900,gpu_hourly_usd=.26,additional_diagnostic_authorized=True,inference_only=True,gpu_run_authorized=False,automatic_pod_stop=False,limits='Inference only, same saved adapter; no training/retry/Pod lifecycle effects. Existing Pod remains running.')
r.write_json(d/'execution_plan.json',plan)
started=time.monotonic();report={'status':'STARTED','cocolon_commit':'d6f8febd8f90e2f60df2936aa7c0d270b3afa7ab','api_commit':'32dc3b3137ddc0a4401d2d1d045123f7da17683a','training_updates':0,'optimizer_created':False,'pod_stopped':False,'model_calls':0,'actual_inference_plan':plan}
r.write_json(d/'inference_report.json',report)
try:
 import torch
 torch.manual_seed(20261024);torch.cuda.manual_seed_all(20261024)
 tokenizer,encoded,examples,cases,preflight=r.prepare(d)
 assert preflight['selected_generation_case_ids']==plan['evaluation_case_ids']
 assert [x['input_tokens'] for x in preflight['generation_inputs']]==[1409,3526]
 adapter=Path('/workspace/cocolon_4b_compact_fit_20261025/results/20261025-025406-cc300de8/adapter')
 hashes=r.adapter_hashes(adapter)
 assert hashes['adapter_model.safetensors']=='06ca6381828841edd2b9c8237c3f7dc61f8242cba42eb8f9047d651fd5dc5749'
 torch.cuda.reset_peak_memory_stats()
 model,stats=r.load_saved_adapter(adapter,hashes)
 r.evaluate(model,tokenizer,cases,d/'raw.jsonl',plan,adapter_revision=hashes['adapter_model.safetensors'])
 rows=r.read_jsonl(d/'raw.jsonl')
 report.update(status='COMPLETE_NOT_QUALITY_ACCEPTED',model_calls=len(rows),adapter_sha256=hashes,adapter_files_unchanged=r.adapter_hashes(adapter)==hashes,adapter_tensors=stats,trainable_parameters=sum(p.numel() for p in model.parameters() if p.requires_grad),input_cases=[{'case_id':c['case_id'],'messages':c['messages']} for c in cases],preflight=preflight,results=[{k:x[k] for k in ['case_id','finish_reason','input_tokens','output_tokens','parse_error','raw_utf8_sha256']} for x in rows],raw_file_sha256=r.digest(d/'raw.jsonl'),peak_allocated_gib=torch.cuda.max_memory_allocated()/2**30,peak_reserved_gib=torch.cuda.max_memory_reserved()/2**30)
except Exception as exc:
 report.update(status='FAILED_NO_RETRY',error=repr(exc));raise
finally:
 report['seconds']=time.monotonic()-started;r.write_json(d/'inference_report.json',report)
 print(json.dumps({k:report.get(k) for k in ['status','seconds','model_calls','results','adapter_files_unchanged']},ensure_ascii=False),flush=True)
