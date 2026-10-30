CUDA_VISIBLE_DEVICES= HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1 timeout --signal=TERM --kill-after=5s 90s python3.12 -B - <<'PY'
from pathlib import Path
import json,hashlib,time,importlib.util,sys,signal
start=time.monotonic();signal.alarm(80);w=Path('/workspace');out=w/'cocolon-prefix-points-cpu-20261030.json';assert not out.exists()
sp=w/'cocolon_syntax2b_pack_20261030/syntax2b.py';assert hashlib.sha256(sp.read_bytes()).hexdigest()=='28e78eb120f07aef0806ddb1159e8257fb83e4972515eed63ec48b33cf205dc5'
spec=importlib.util.spec_from_file_location('existing_syntax_prefix_points',sp);s=importlib.util.module_from_spec(spec);sys.modules[spec.name]=s;spec.loader.exec_module(s)
import torch
torch.set_num_threads(1)
from transformers import AutoTokenizer
assert not torch.cuda.is_initialized();tok=AutoTokenizer.from_pretrained('Qwen/Qwen3.5-4B',revision='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a',local_files_only=True,trust_remote_code=False);engine=s.TokenMask(tok)
cp=w/'cocolon_continuation17_cpu_20261030';run=w/'cocolon_continuation17_run_20261030';r=json.loads((run/'run.json').read_text());assert r['status']=='STOPPED_NO_RETRY'
train=[json.loads(t) for t in (cp/'train_messages11.jsonl').read_text().splitlines()];oldtrain=[json.loads(t) for t in (w/'cocolon_prior_rows2_cpu_20261029/train_messages11.jsonl').read_text().splitlines()]
result={'status':'CPU_PREFIX_POINTS_READY_NO_MODEL','syntax_sha256':hashlib.sha256(sp.read_bytes()).hexdigest(),'run_source':r['source_commit'],'adapter_sha256':r['adapter_sha256']['adapter_model.safetensors'],'cases':[],'pretrained_model_loads':0,'model_forwards':0,'updates':0,'generations':0,'new_cmee_calls':0,'tokenizer_loads':1,'old_teacher_control_reused_not_rerun':True}
for row in train[:2]:
 cid=row['id'];oldrow=next(t for t in oldtrain if t['id']==cid);teacher=row['messages'][-1]['content'];assert teacher==oldrow['messages'][-1]['content']
 f=run/('after_'+cid+'.jsonl');raw=json.loads(f.read_text());assert hashlib.sha256(f.read_bytes()).hexdigest()==next(c['raw_sha256'] for c in r['calls'] if c['case_id']==cid)
 ids=raw['output_token_ids'];gold=tok.encode(teacher,add_special_tokens=False);assert b''.join(engine.data[t] for t in ids).decode()==raw['raw_text'];assert tok.decode(gold,skip_special_tokens=False,clean_up_tokenization_spaces=False)==teacher
 div=next(i for i,(a,b) in enumerate(zip(ids,gold)) if a!=b);state=s.State();invalid=None
 for i,t in enumerate(ids):
  following=state.feed(engine.data[t])
  if following is None:
   invalid={'token_offset':i,'token_id':t,'token_bytes_hex':engine.data[t].hex(),'valid_prefix_utf8_bytes':len(b''.join(engine.data[k] for k in ids[:i])),'parser_state_before':repr(state)};break
  state=following
 assert invalid is not None
 prompt=tok.apply_chat_template(row['messages'][:-1],tokenize=True,return_dict=False,return_tensors=None,truncation=False,add_generation_prompt=True,enable_thinking=False);points=[]
 for label,n in [('first_teacher_token_divergence',div),('first_syntax_violation',invalid['token_offset'])]:
  full=prompt+ids[:n];points.append({'label':label,'raw_prefix_tokens':n,'total_input_tokens':len(full),'input_ids_sha256':hashlib.sha256(json.dumps(full,separators=(',',':')).encode()).hexdigest()})
 result['cases'].append({'case_id':cid,'raw_file_sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'raw_tokens':len(ids),'teacher_text_sha256':hashlib.sha256(teacher.encode()).hexdigest(),'teacher_tokens':len(gold),'prompt_tokens':len(prompt),'first_divergence':{'token_offset':div,'actual_token_id':ids[div],'teacher_token_id':gold[div],'actual_token_bytes_hex':engine.data[ids[div]].hex(),'teacher_token_bytes_hex':engine.data[gold[div]].hex()},'first_syntax_violation':invalid,'points':points})
result['seconds']=time.monotonic()-start;result['cuda_initialized']=torch.cuda.is_initialized();out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+chr(10));print(json.dumps(result,ensure_ascii=False,indent=2));print('PREFIX_REPORT',out.stat().st_size,hashlib.sha256(out.read_bytes()).hexdigest())
PY
