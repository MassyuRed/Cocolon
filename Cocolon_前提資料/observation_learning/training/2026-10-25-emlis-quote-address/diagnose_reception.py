import json,hashlib,importlib.util,sys
from pathlib import Path
sys.dont_write_bytecode=True
p=Path('/workspace/cocolon_4b_quote_address_fit18_20261025')
o=Path('/workspace/cocolon_4b_quote_reception_cpu_20261025.json')
assert not o.exists()
sha=lambda x:hashlib.sha256(x.read_bytes()).hexdigest()
names=['sft_examples.jsonl','after_fit.jsonl','run.json','legacy_run_pilot.py','adapter/adapter_model.safetensors','adapter/adapter_config.json','adapter/README.md']
hashes={n:sha(p/n) for n in names}
assert hashes['adapter/adapter_model.safetensors']=='138b9ff7e5b7df59e6da80126a52b309edf9c22a9a860f2c165189a9e453c102'
assert hashes['after_fit.jsonl']=='21787a79c2ecf5e1a60b47e5b9590bb18423d263ae88dc927e2b256b8eb5bb5d'
spec=importlib.util.spec_from_file_location('legacy',(p/'legacy_run_pilot.py'));r=importlib.util.module_from_spec(spec);spec.loader.exec_module(r)
from transformers import AutoTokenizer
t=AutoTokenizer.from_pretrained(r.MODEL,revision=r.REVISION,local_files_only=True,trust_remote_code=False)
def diff(a,b,path=''):
 if type(a)!=type(b):return [path]
 if isinstance(a,dict):
  if set(a)!=set(b):return [path]
  return sum((diff(a[k],b[k],path+'/'+str(k)) for k in a),[])
 if isinstance(a,list):
  if len(a)!=len(b):return [path]
  return sum((diff(x,y,path+'/'+str(i)) for i,(x,y) in enumerate(zip(a,b))),[])
 return [] if a==b else [path]
es=r.read_jsonl(p/'sft_examples.jsonl');rs=r.read_jsonl(p/'after_fit.jsonl');rows=[]
assert len(es)==len(rs)==9
for i,(e,v) in enumerate(zip(es,rs)):
 assert e['id']==v['case_id']
 text=e['messages'][-1]['content'];actual=v['raw_text']
 assert hashlib.sha256(actual.encode()).hexdigest()==v['raw_utf8_sha256']
 assert t.decode(v['output_token_ids'],skip_special_tokens=True,clean_up_tokenization_spaces=False)==actual
 changes=diff(json.loads(text),json.loads(actual))
 if i<6:
  assert changes==[];rows.append(dict(id=e['id'],family='CHAIR',changed_paths=[],parsed_exact=True));continue
 assert changes==['/candidate/surface_proposal/reception']
 full,pre=r.encode_training(t,e['messages'],context=8192)
 tok=t(text,add_special_tokens=False,return_offsets_mapping=True);ids=tok['input_ids'];offs=tok['offset_mapping']
 target=json.loads(text)['candidate']['surface_proposal']['reception'];raw=json.loads(actual)['candidate']['surface_proposal']['reception']
 marker='"reception":"';assert text.count(marker)==1;a=text.index(marker)+len(marker);b=a+len(target)
 indexes=[j for j,(s,z) in enumerate(offs) if s>=a and z<=b and z>s]
 assert indexes==list(range(indexes[0],indexes[-1]+1)) and offs[indexes[0]][0]==a and offs[indexes[-1]][1]==b
 assert full['input_ids'][pre:pre+len(ids)]==ids and pre==v['input_tokens']
 labels=[-100]*len(full['input_ids'])
 for j in indexes:labels[pre+j]=full['input_ids'][pre+j]
 assert sum(x!=-100 for x in labels)==len(indexes) and all(x==-100 for x in labels[:pre+indexes[0]]) and all(x==-100 for x in labels[pre+indexes[-1]+1:])
 first=next(j for j,(x,y) in enumerate(zip(ids,v['output_token_ids'])) if x!=y);s,z=offs[first]
 assert a<=s<z<=b and labels[pre+first]!=-100
 rows.append(dict(id=e['id'],family='DAILY',changed_paths=changes,teacher_reception=target,raw_reception=raw,prompt_tokens=pre,teacher_eos_tokens=len(full['input_ids'])-pre,full_context_tokens=len(full['input_ids']),reception_tokens=len(indexes),reception_loss_fraction=len(indexes)/(len(full['input_ids'])-pre),first_divergent_assistant_token=first,first_divergent_teacher_token=ids[first],first_divergent_raw_token=v['output_token_ids'][first],teacher_token_text=t.decode([ids[first]]),raw_token_text=t.decode([v['output_token_ids'][first]]),teacher_token_char_range=[s,z],reception_char_range=[a,b],loss_start=pre+indexes[0]-1,logits_positions=len(full['input_ids'])-(pre+indexes[0]-1),prompt_other_json_eos_labels_excluded=True,full_teacher_and_eos_retained=True))
assert {n:sha(p/n) for n in names}==hashes
report=dict(schema='cocolon.quote_reception_cpu_diagnostic.v1',status='CPU_TOKEN_AND_MASK_DIAGNOSIS_COMPLETE',adapter_sha256=hashes['adapter/adapter_model.safetensors'],source_hashes=hashes,rows=rows,model_loads=0,model_forwards=0,new_generations=0,optimizer_updates=0,tokenizer_cache_only=True,source_unchanged=True,raw_repair=False,automatic_progression=False,product_credit=0)
o.write_text(json.dumps(report,ensure_ascii=False,sort_keys=True,indent=2)+chr(10))
print('CPU RECEPTION DIAG COMPLETE: all9 raw decode/parsed verified; source/weights unchanged; model/forward/generation/update=0')
for x in rows[6:]:print(x['id'],'mask',x['reception_tokens'],'/',x['teacher_eos_tokens'],'first',x['first_divergent_assistant_token'],'teacher',repr(x['teacher_token_text']),'raw',repr(x['raw_token_text']))
print('OUTPUT_SHA256',sha(o))



