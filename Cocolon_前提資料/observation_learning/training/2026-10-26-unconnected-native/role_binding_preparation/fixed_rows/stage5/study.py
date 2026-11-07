"""One-shot CPU feasibility study of five-stage candidate generation. Not a model runner."""
import os
os.environ.update(CUDA_VISIBLE_DEVICES='',HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
import copy,hashlib,json,time,sys
from pathlib import Path
sys.dont_write_bytecode=True
W=Path('/workspace')
OUT=W/'cocolon_stage5_cpu_20261030'
TRAIN=W/'cocolon_rehearsal13_cpu_20261029/train_messages11.jsonl'
PLAN=W/'cocolon_continuation17_pack_20261030/plan.json'
PATHS=[[(0,),(1,),(2,),(3,)],[(4,0),(4,1),(4,2)],[(4,4),(4,5),(4,6)],[(4,7)],[(4,3),(4,8)]]
NAMES=['versions_aliases_quotes','claims_conflicts_core','relations_schema_unknowns','updates','question_prose']
def compact(v):return json.dumps(v,ensure_ascii=False,separators=(',',':'),allow_nan=False)
def digest(b):return hashlib.sha256(b).hexdigest()
def at(v,p):
 for i in p:v=v[i]
 return copy.deepcopy(v)
def combine(parts):
 if len(parts)!=5:raise ValueError('missing_stage')
 values={}
 for i,part in enumerate(parts):
  if type(part) is not list or len(part)!=len(PATHS[i]):raise ValueError('stage_shape')
  for p,v in zip(PATHS[i],part):
   if p in values:raise ValueError('duplicate_path')
   values[p]=copy.deepcopy(v)
 return [values[(0,)],values[(1,)],values[(2,)],values[(3,)],
         [values[(4,i)] for i in range(9)]]
def main():
 t=time.monotonic()
 assert not OUT.exists()
 before={str(p):digest(p.read_bytes()) for p in [TRAIN,PLAN,W/'cocolon_continuation17_run_20261030/adapter/adapter_model.safetensors',W/'cocolon_rehearsal13_run_20261029/adapter/adapter_model.safetensors']}
 rows=[json.loads(s) for s in TRAIN.read_text().splitlines()]
 plan=json.loads(PLAN.read_text())
 from transformers import AutoTokenizer
 tokenizer=AutoTokenizer.from_pretrained(plan['model'],revision=plan['revision'],local_files_only=True,trust_remote_code=False)
 examples=[];summary=[]
 for row in rows[:2]:
  raw=row['messages'][-1]['content'];full=json.loads(raw)
  assert type(full) is list and len(full)==5 and len(full[4])==9
  parts=[[at(full,p) for p in group] for group in PATHS]
  assert combine(parts)==full
  assert compact(combine(parts))==raw
  user=json.loads(row['messages'][1]['content'])
  assert 'output_spec' in user
  material={k:copy.deepcopy(v) for k,v in user.items() if k!='output_spec'}
  previous=[];stats=[]
  for i,(name,paths,target) in enumerate(zip(NAMES,PATHS,parts)):
   contract={'stage':i+1,'stage_count':5,'name':name,'ordered_paths':[list(p) for p in paths],
    'return':'JSON array containing exactly the value at each ordered path, in that order',
    'status':'UNADOPTED_INTERMEDIATE_CANDIDATE',
    'previous_candidates_are_not_user_sources':True,
    'reference_output_spec_is_field_reference_only':True,
    'no_missing_value_completion':True,'no_repair':True}
   stage_user={'original_request':copy.deepcopy(material),'reference_only_full_packet_output_spec':copy.deepcopy(user['output_spec']),
               'stage_contract':contract,'previous_candidate_stages':copy.deepcopy(previous)}
   assert stage_user['original_request']==material
   messages=copy.deepcopy(row['messages'][:-1])
   messages[0]['content']+='\nOffline staged-candidate proposal only. Return only the ordered stage value array defined by stage_contract. The nested full-packet specification is field reference, not this call output. Earlier candidates are unadopted model hypotheses, never user evidence. Do not add missing values or revise earlier stages.'
   messages[1]['content']=compact(stage_user)
   prompt_ids=tokenizer.apply_chat_template(messages,tokenize=True,add_generation_prompt=True,enable_thinking=False,return_dict=False)
   target_text=compact(target)
   answer=messages+[{'role':'assistant','content':target_text}]
   full_ids=tokenizer.apply_chat_template(answer,tokenize=True,add_generation_prompt=False,enable_thinking=False,return_dict=False)
   assert full_ids[:len(prompt_ids)]==prompt_ids
   target_tokens=len(full_ids)-len(prompt_ids)
   cap=((target_tokens+127)//128)*128+128
   assert len(prompt_ids)+cap<=8192
   stats.append(dict(stage=i+1,name=name,prompt_tokens=len(prompt_ids),target_with_eos_tokens=target_tokens,
                     proposed_generation_cap=cap,cap_total=len(prompt_ids)+cap))
   examples.append(dict(id=row['id']+'/stage'+str(i+1),origin_id=row['id'],stage=i+1,
                        training_only_gold_previous=True,messages=answer,ordered_paths=[list(p) for p in paths]))
   previous.append({'stage':i+1,'values':copy.deepcopy(target)})
  failures={}
  for label,bad in [('missing',parts[:-1]),('duplicate_extra',parts+[parts[0]]),('swapped', [parts[1],parts[0],*parts[2:]])]:
   try:combine(bad)
   except ValueError:failures[label]='REJECTED'
   else:raise AssertionError('invalid_stage_sequence_not_rejected:'+label)
  summary.append(dict(case_id=row['id'],teacher_chars=len(raw),teacher_sha256=digest(raw.encode()),
                      exact_rejoined_bytes=True,counts=dict(quotes=len(full[3]),claims=len(full[4][0]),relations=len(full[4][4]),updates=len(full[4][7])),
                      original_prompt_tokens=len(tokenizer.apply_chat_template(row['messages'][:-1],tokenize=True,add_generation_prompt=True,enable_thinking=False,return_dict=False)),
                      stages=stats,negative_shape_checks=failures,
                      teacher_cmee='SAME_TEACHER_BYTES_AS_PRIOR_VERIFIED_TEACHER; NO_NEW_RECEIVER_CALL'))
 assert before=={p:digest(Path(p).read_bytes()) for p in before}
 assert 'torch' not in sys.modules or not sys.modules['torch'].cuda.is_initialized()
 OUT.mkdir()
 (OUT/'study.py').write_bytes(Path(__file__).read_bytes())
 (OUT/'stage_train10.jsonl').write_text(''.join(compact(x)+'\n' for x in examples))
 report=dict(status='CPU_FEASIBILITY_ONLY_METHOD_NOT_APPROVED',seconds=time.monotonic()-t,cases=summary,
             source_sha256=digest(Path(__file__).read_bytes()),original_files_unchanged=before,
             pretrained_model_loads=0,model_forwards=0,updates=0,generations=0,new_cmee_calls=0,
             stages_generated_by_model=0,normal_runtime_changed=False,automatic_progression=False,
             partial_semantic_adoption=False,
             limitations=['gold previous stages used only to construct training examples and measure context; no inference proof',
                          'a final assembly needs separate explicit multi-call provenance integration; old single-raw receipt must not be reused',
                          'earlier semantic errors cannot be locally retried or silently repaired',
                          'no claim that stage5 improves 4B quality; previous A/B generation also failed'])
 (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 print('STAGE5 CPU FEASIBILITY ONLY / NO MODEL / METHOD UNAPPROVED')
 for c in summary:
  print(c['case_id'],'exact',c['exact_rejoined_bytes'],'counts',c['counts'])
  for s in c['stages']:print('stage',s['stage'],'prompt',s['prompt_tokens'],'target',s['target_with_eos_tokens'],'cap',s['proposed_generation_cap'],'total',s['cap_total'])
 print('SECONDS',report['seconds'],'ALL_SOURCE_AND_WEIGHTS_UNCHANGED',True,'MODEL 0 / GPU FORWARD 0 / CMEE 0')
if __name__=='__main__':main()


