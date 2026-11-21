"""One zero-training source-written-role vertical on the existing 4B adapter."""
from pathlib import Path
from dataclasses import asdict, replace
from unittest.mock import patch
import os,sys,json,hashlib,time,signal,threading,gc,subprocess,traceback

w=Path('/workspace'); api=w/'analysis-written-role-api-v2-20261103'
initial=w/'analysis-combination70-20261103/result/adapter'
out=w/'analysis-written-role8-20261103'
API_COMMIT='88078cdb3cf19da0e9fe9188915bce9c0899a797'
sys.dont_write_bytecode=True
os.environ['HF_HUB_OFFLINE']='1';os.environ['TRANSFORMERS_OFFLINE']='1'
sys.path[:0]=[str(api/'ai/tools'),str(api/'ai/services/ai_inference'),str(api/'ai/tests')]
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert not out.exists()
assert (w/'written-role-tests-v2.exit').read_text()=='0'
assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip()==API_COMMIT
assert not subprocess.check_output(['git','-C',str(api),'status','--porcelain','--untracked-files=no'],text=True).strip()
assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True).strip()
weights='a5eafe344189ede6a4a664396d43af651e5482c0d3c720d6b329a1b44d01bd41'
config='9bc9f1f3f2979d49911dae1b028cc2fb064e8e000baebcb84b84a3f50448b5cf'
assert sha(initial/'adapter_model.safetensors')==weights and sha(initial/'adapter_config.json')==config
from test_analysis_model_quoted_parent_units import role_sample
from test_analysis_cumulative import OWNER
import analysis_cumulative_service as service
from cocolon_meaning_experience_engine import MeaningExperienceEngine
from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
    AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError,canonical)
from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
from serve_emlis_natural_reply import load_generator,MODEL,REVISION,PINS
from transformers import AutoTokenizer
from importlib.metadata import version
assert {n:version(n) for n in PINS}==PINS
assert (MODEL,REVISION)==('Qwen/Qwen3.5-4B','851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a')
casefile=w/'written-role8-sources.json'
assert sha(casefile)=='f00549ed9315765cac762dbba9264d3100f373a7c98579f6114e68152d5abf1f'
texts=json.loads(casefile.read_text())
assert len(texts)==8 and [r['id'] for r in texts]==['R%02d'%i for i in range(1,9)]
rows=[];prepared=[]
tok=AutoTokenizer.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
for case in texts:
    key,text,scope=(case[k] for k in ('id','text','expected_scope'))
    snap=role_sample(text); p=service.prepare_cumulative_quoted_parent_units(OWNER,snap)
    tokens=len(tok.apply_chat_template(p.messages(),enable_thinking=False,
        add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False))
    assert tokens+2048<=8192
    old,cov=service.build_cumulative_map(OWNER,snap)
    row=dict(id=key,owner=OWNER,snapshot=snap,source='ROOT_SYNTHETIC_DEVELOPMENT_NOT_MASH_TEACHING_NOT_BLIND',
        expected_scope=scope,before_normal_coverage=cov,
        before_normal_visual=old.safe_projection(authenticated_owner_scope=OWNER) if old else None)
    rows.append(row);prepared.append((row,p,tokens))
out.mkdir();(out/'sources.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
report=dict(status='STARTED',api_commit=API_COMMIT,model=MODEL,revision=REVISION,
    initial_weights_sha256=weights,initial_config_sha256=config,prompt_version='baseline.v1',
    max_calls=8,max_seconds=480,request_seconds=45,max_new_tokens=2048,
    max_model_loads=1,model_loads=0,new_calls=0,training_updates=0,calls=[],
    normal_default_enabled=False,production_adoption=False,product_credit=0)
start=time.monotonic();deadline=start+480
def save():
    report['process_seconds']=time.monotonic()-start
    p=out/'report.json';q=out/'report.tmp'
    q.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');q.replace(p)
def timeout(*_):raise TimeoutError('written_role8_deadline')
signal.signal(signal.SIGTERM,timeout);signal.signal(signal.SIGALRM,timeout)
signal.setitimer(signal.ITIMER_REAL,480);save();gen=None
try:
    report['model_loads']=1
    gen=load_generator(str(initial),threading.Event(),weights_sha256=weights,config_sha256=config)
    for row,p,tokens in prepared:
        assert report['new_calls']<8 and time.monotonic()<deadline
        key=row['id'];sent=hashlib.sha256(canonical(p.messages()).encode()).hexdigest()
        (out/(key+'.request.json')).write_text(json.dumps(dict(request_ref=p.request_ref,
            messages_sha256=sent,messages=p.messages(),prompt_tokens=tokens),ensure_ascii=False,indent=2)+'\n')
        item=dict(id=key,status='STARTED',prompt_tokens=tokens)
        report['calls'].append(item);report['new_calls']+=1;save()
        begin=time.monotonic();raw,finish=gen(p.messages(),min(deadline,begin+45))
        response=AnalysisModelQuotedParentUnitsResponse(p.request_ref,sent,
            hashlib.sha256(raw.encode()).hexdigest(),finish,raw)
        (out/(key+'.raw.txt')).write_text(raw)
        (out/(key+'.response.json')).write_text(json.dumps(asdict(response),ensure_ascii=False,indent=2)+'\n')
        value=replace(p,response=response)
        item.update(status='RETURNED',seconds=time.monotonic()-begin,finish_reason=finish,
            raw_sha256=response.raw_sha256)
        try:
            units,counts=service.build_cumulative_quoted_parent_candidates(OWNER,row['snapshot'],model_input=value)
            text=service.serialize_cumulative_quoted_parent_candidates(OWNER,row['snapshot'],
                model_input=value,artifact=units,coverage=counts)
            (out/(key+'.units.json')).write_text(text)
            item['original_candidate_coverage']=counts
        except (AnalysisSemanticError,AnalysisSourceError) as exc:
            item['original_candidate_rejection']=str(exc)
        try:
            artifact,cov=service.build_cumulative_written_role_map(OWNER,row['snapshot'],model_input=value)
            text=service.serialize_cumulative_written_role_map(OWNER,row['snapshot'],
                model_input=value,artifact=artifact,coverage=cov)
            (out/(key+'.role.json')).write_text(text)
            text=(out/(key+'.role.json')).read_text()
            with patch.object(MeaningExperienceEngine,'generate',side_effect=AssertionError('no generation')), \
                 patch.object(compiler,'compile_model_written_role_graph',side_effect=AssertionError('no compile')), \
                 patch.object(author,'realize_model_written_role_graph',side_effect=AssertionError('no author')):
                saved,counts=service.reload_cumulative_written_role_map(OWNER,row['snapshot'],text)
            assert saved==artifact and counts==cov
            item.update(role_admission='RETURNED',artifact_id=artifact.artifact_id,
                coverage=cov,file_replay='MATCHED_NO_ENGINE_COMPILER_AUTHOR',
                node_kinds=[n.node_kind for n in artifact.graph.nodes])
        except (AnalysisSemanticError,AnalysisSourceError) as exc:
            item.update(role_admission='REJECTED',role_reason=str(exc))
        save()
    assert report['new_calls']==8 and sha(initial/'adapter_model.safetensors')==weights
    assert sha(initial/'adapter_config.json')==config
    report.update(status='COMPLETE_PENDING_RAW_READ_NOT_PRODUCTION_ADOPTED',initial_unchanged=True)
except BaseException as exc:
    report.update(status='FAILED_NOT_ADOPTED',error_type=type(exc).__name__,error=str(exc),
        traceback=traceback.format_exc());raise
finally:
    gen=None;gc.collect();signal.setitimer(signal.ITIMER_REAL,0);save()
