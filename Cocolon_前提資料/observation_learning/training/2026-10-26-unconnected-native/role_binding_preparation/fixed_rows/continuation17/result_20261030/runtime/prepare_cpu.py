"""CPU-only continuation17 materialization. No pretrained model/forward/learning/generation."""
import ast,gzip,hashlib,json,os,sys,time
from pathlib import Path
os.environ.update(CUDA_VISIBLE_DEVICES='',HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
sys.dont_write_bytecode=True
W=Path('/workspace')
HERE=Path(__file__).resolve().parent
OUT=W/'cocolon_continuation17_cpu_20261030'
OLD=W/'cocolon_rehearsal13_cpu_20261029'
ADAPTER=W/'cocolon_rehearsal13_run_20261029/adapter'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def main():
 t=time.monotonic();plan=json.loads((HERE/'plan.json').read_text())
 assert plan['status']=='PROPOSED_NOT_APPROVED'
 assert (plan['max_updates'],plan['max_model_loads'],plan['max_generations'])==(17,2,11)
 assert not OUT.exists()
 assert sha(OLD/'prepared_cpu.json.gz')=='ddf81a26f67e98fff901cc78e405f06919ab9cbe4ad6cbc49908a6b8cf616165'
 cpu=json.loads(gzip.decompress((OLD/'prepared_cpu.json.gz').read_bytes()))
 assert cpu['status']=='CPU_REHEARSAL13_READY_NO_MODEL'
 assert all(sha(p)==h for p,h in cpu['frozen'].items())
 assert sha(OLD/'train_messages11.jsonl')==plan['train_messages_sha256']
 assert sha(OLD/'eval_inputs11.json')==plan['eval_inputs_sha256']
 assert sha(ADAPTER/'adapter_model.safetensors')==plan['initial_adapter_sha256']
 rows=[json.loads(x) for x in (OLD/'train_messages11.jsonl').read_text().splitlines()]
 evaluation=json.loads((OLD/'eval_inputs11.json').read_text())
 assert [r['id'] for r in rows]==[r['case_id'] for r in evaluation]==plan['evaluation_order']
 assert all(r['messages'][:-1]==e['messages'] for r,e in zip(rows,evaluation))
 assert len(plan['update_order'])==17 and set(plan['update_order'])==set(plan['evaluation_order'])
 assert all(plan['update_order'].count(cid)==(4 if i<2 else 1) for i,cid in enumerate(plan['evaluation_order']))
 for item in cpu['encoded'].values():
  labels=item['labels'];ids=item['input_ids'];j=next(i for i,x in enumerate(labels) if x!=-100)
  assert labels[:j]==[-100]*j and labels[j:]==ids[j:] and len(ids)<=8192
 ast.parse((HERE/'run_continuation17.py').read_text())
 import torch
 from safetensors.torch import load_file
 assert not torch.cuda.is_initialized()
 tensors=load_file(str(ADAPTER/'adapter_model.safetensors'),device='cpu')
 assert len(tensors)==112 and all(v.dtype==torch.float32 and torch.isfinite(v).all() for v in tensors.values())
 OUT.mkdir()
 for name in ('train_messages11.jsonl','eval_inputs11.json'):(OUT/name).write_bytes((OLD/name).read_bytes())
 cpu.update(status='CPU_CONTINUATION17_READY_NO_MODEL',order=plan['update_order'],
            initial_adapter_sha256=plan['initial_adapter_sha256'])
 for c in cpu['counts']:c['scheduled_updates']=plan['update_order'].count(c['case_id'])
 for p in [ADAPTER/'adapter_model.safetensors',ADAPTER/'adapter_config.json',HERE/'run_continuation17.py',HERE/'prepare_cpu.py',OUT/'train_messages11.jsonl',OUT/'eval_inputs11.json']:
  cpu['frozen'][str(p)]=sha(p)
 cpu['teacher_cmee_evidence']='REUSED_OLD_CPU_EVIDENCE_NOT_A_NEW_MODEL_RESULT'
 payload=(json.dumps(cpu,ensure_ascii=False,separators=(',',':'))+'\n').encode()
 (OUT/'prepared_cpu.json.gz').write_bytes(gzip.compress(payload,mtime=0))
 summary=dict(status=cpu['status'],seconds=time.monotonic()-t,order=plan['update_order'],
   pretrained_model_loads=0,model_forwards=0,updates=0,generations=0,cmee_calls=0,
   tensor_count=len(tensors),finite=True,cuda_initialized=torch.cuda.is_initialized(),
   source_sha256=sha(__file__),runner_sha256=sha(HERE/'run_continuation17.py'),
   prepared_cpu_sha256=sha(OUT/'prepared_cpu.json.gz'),
   train_sha256=sha(OUT/'train_messages11.jsonl'),eval_sha256=sha(OUT/'eval_inputs11.json'),
   adapter_sha256=sha(ADAPTER/'adapter_model.safetensors'),counts=cpu['counts'],
   old11_message_bytes_unchanged=True,approval='PROPOSED_NOT_APPROVED',automatic_progression=False)
 (OUT/'cpu_summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(summary,ensure_ascii=False),flush=True)
if __name__=='__main__':main()

