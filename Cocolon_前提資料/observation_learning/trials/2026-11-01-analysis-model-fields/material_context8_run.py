"""One offline, zero-training category-v1/material-v2 comparison on the same four sources."""
from pathlib import Path
from dataclasses import asdict,replace
from unittest.mock import patch
import os,sys,json,hashlib,time,signal,threading,gc,traceback,subprocess
w=Path('/workspace');api=w/'analysis-material-api-20261103';prior=w/'analysis-ce68-20261103';initial=w/'analysis-combination70-20261103/result/adapter';out=w/'analysis-material-context8-20261103'
sys.dont_write_bytecode=True;os.environ['HF_HUB_OFFLINE']='1';os.environ['TRANSFORMERS_OFFLINE']='1'
sys.path[:0]=[str(api/'ai/tools'),str(api/'ai/services/ai_inference'),str(api/'ai/tests')]
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert not out.exists()
assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip()=='5d7f43a888221526342d9c4eddffb0b7be186df7'
assert not subprocess.check_output(['git','-C',str(api),'status','--porcelain','--untracked-files=no'],text=True).strip()
old=json.loads((prior/'semantic_units_ce68_plan.json').read_text());plan=dict(old['plan'])
plan.update(initial_weights_sha256='a5eafe344189ede6a4a664396d43af651e5482c0d3c720d6b329a1b44d01bd41',initial_config_sha256='9bc9f1f3f2979d49911dae1b028cc2fb064e8e000baebcb84b84a3f50448b5cf')
# Explicit research choice after source-level SQ03/MD02 improvement; not normal adoption.
assert (w/'analysis-combination70-20261103/run.exit').read_text()=='0'
assert sha(initial/'adapter_model.safetensors')==plan['initial_weights_sha256'] and sha(initial/'adapter_config.json')==plan['initial_config_sha256']
assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True).strip()
from test_analysis_model_fields import sample
from test_analysis_cumulative import OWNER
import analysis_cumulative_service as service
from cocolon_meaning_experience_engine import MeaningExperienceEngine
from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError,canonical
from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
from serve_emlis_natural_reply import load_generator,MODEL,REVISION,PINS
from transformers import AutoTokenizer
from importlib.metadata import version
assert {n:version(n) for n in PINS}==PINS and (MODEL,REVISION)==(plan['model'],plan['revision'])
probes=[dict(id=k,owner=r['owner'],snapshot=r['snapshot'],source='EXISTING_SEEN_DEVELOPMENT_DIAGNOSTIC') for k in ['SQ03','MD02','OD01'] for r in old['evaluation'] if r['probe_id']==k]
assert len(probes)==3
probes.append(dict(id='CTX01',owner=OWNER,snapshot=sample(),source='EXISTING_SYNTHETIC_TWO_RECORD_THREE_FIELD_FIXTURE_NOT_MASH_TEACHING_NOT_BLIND'))
prepared=[];tok=AutoTokenizer.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
for row in probes:
 for profile in ['selected_categories.v1','selected_material.v2']:
  p=service.prepare_cumulative_category_units(row['owner'],row['snapshot'],prompt_version=profile)
  prompt=tok.apply_chat_template(p.messages(),enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
  assert len(prompt)+2048<=8192
  prepared.append((row,profile,p,len(prompt)))
assert len(prepared)==8
out.mkdir();(out/'sources.json').write_text(json.dumps(probes,ensure_ascii=False,indent=2)+'\n')
report=dict(status='STARTED',model=MODEL,revision=REVISION,api_commit='5d7f43a888221526342d9c4eddffb0b7be186df7',initial_weights_sha256=plan['initial_weights_sha256'],initial_config_sha256=plan['initial_config_sha256'],initial_selection='EXPLICIT_COMBINATION70_RESEARCH_ONLY_SQ03_MD02_IMPROVED_OLD_HOLDING_RETAINED_NOT_NORMAL_ADOPTION',max_calls=8,max_seconds=480,request_seconds=45,max_new_tokens=2048,max_model_loads=1,training_updates=0,model_loads=0,new_calls=0,calls=[],normal_adoption=False,product_credit=0)
start=time.monotonic();deadline=start+480

def save():
 report['process_seconds']=time.monotonic()-start
 p=out/'report.json';q=out/'report.tmp';q.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');q.replace(p)
def timeout(*_):raise TimeoutError('material_context8_deadline')
signal.signal(signal.SIGTERM,timeout);signal.signal(signal.SIGALRM,timeout);signal.setitimer(signal.ITIMER_REAL,480);save();gen=None
try:
 report['model_loads']=1
 gen=load_generator(str(initial),threading.Event(),weights_sha256=plan['initial_weights_sha256'],config_sha256=plan['initial_config_sha256'])
 for row,profile,p,tokens in prepared:
  assert report['new_calls']<8 and time.monotonic()<deadline
  key=row['id']+'_'+('category' if profile=='selected_categories.v1' else 'material')
  sent=hashlib.sha256(canonical(p.messages()).encode()).hexdigest()
  (out/(key+'.request.json')).write_text(json.dumps(dict(request_ref=p.request_ref,messages_sha256=sent,messages=p.messages(),prompt_tokens=tokens),ensure_ascii=False,indent=2)+'\n')
  item=dict(id=row['id'],profile=profile,status='STARTED',prompt_tokens=tokens);report['calls'].append(item);report['new_calls']+=1;save()
  begin=time.monotonic();raw,finish=gen(p.messages(),min(deadline,begin+45));response=AnalysisModelQuotedParentUnitsResponse(p.request_ref,sent,hashlib.sha256(raw.encode()).hexdigest(),finish,raw)
  (out/(key+'.raw.txt')).write_text(raw);(out/(key+'.response.json')).write_text(json.dumps(asdict(response),ensure_ascii=False,indent=2)+'\n')
  item.update(status='RETURNED',seconds=time.monotonic()-begin,finish_reason=finish,raw_sha256=response.raw_sha256)
  try:
   value=replace(p,response=response);art,cov=service.build_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=value)
  except (AnalysisSemanticError,AnalysisSourceError) as exc:item.update(admission='REJECTED',reason=str(exc))
  else:
   text=service.serialize_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=value,artifact=art,coverage=cov)
   (out/(key+'.candidate.json')).write_text(text)
   with patch.object(MeaningExperienceEngine,'generate',side_effect=AssertionError('no saved generation')):
    saved,counts=service.reload_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],text)
   assert saved==art and counts==cov
   item.update(admission='RETURNED',candidate_id=art.candidate_id,coverage=cov,file_replay='MATCHED')
  save()
 assert report['new_calls']==8 and sha(initial/'adapter_model.safetensors')==plan['initial_weights_sha256'] and sha(initial/'adapter_config.json')==plan['initial_config_sha256']
 report.update(status='COMPLETE_NOT_ADOPTED_PENDING_RAW_READ',initial_unchanged=True)
except BaseException as exc:
 report.update(status='FAILED_NOT_ADOPTED',error_type=type(exc).__name__,error=str(exc),traceback=traceback.format_exc());raise
finally:
 gen=None;gc.collect();signal.setitimer(signal.ITIMER_REAL,0);save()
