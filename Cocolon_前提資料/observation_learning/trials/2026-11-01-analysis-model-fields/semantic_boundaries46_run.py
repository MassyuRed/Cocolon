"""One frozen-weight, instruction-only 46-call comparison; no training or retries."""
from pathlib import Path
from dataclasses import asdict,replace
from contextlib import ExitStack
from unittest.mock import patch
from hashlib import sha256,sha1
from importlib.metadata import version
import os,sys,json,time,signal,threading,gc,subprocess,traceback

w=Path('/workspace');api=w/'analysis-semantic-boundaries-api-20261103'
root=w/'analysis-semantic-boundaries46-20261103';out=root/'result'
initial=w/'analysis-written-role74-20261103/result/adapter'
COMMIT='dc05dc358d1c44ce47fd844f6041d74f1f74fe6a'
sys.dont_write_bytecode=True
os.environ['HF_HUB_OFFLINE']='1';os.environ['TRANSFORMERS_OFFLINE']='1'
sys.path[:0]=[str(api/'ai/tools'),str(api/'ai/services/ai_inference')]
sha=lambda p:sha256(Path(p).read_bytes()).hexdigest()

def main():
    assert not out.exists() and (w/'semantic-boundaries-tests.exit').read_text()=='0'
    plan=json.loads((root/'plan.json').read_text())
    assert plan['status']=='INSTRUCTION_ONLY_SEMANTIC_BOUNDARIES46_CPU_PREPARED'
    assert (plan['max_calls'],plan['max_model_loads'],plan['max_seconds'],plan['training_updates'])==(46,1,900,0)
    assert len(plan['evaluation'])==46 and plan['api_commit']==COMMIT
    assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip()==COMMIT
    assert not subprocess.check_output(['git','-C',str(api),'status','--porcelain','--untracked-files=no'],text=True).strip()
    for p,expected in plan['api_source_blobs'].items():
        b=(api/p).read_bytes();assert sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==expected
    assert sha(initial/'adapter_model.safetensors')==plan['initial_weights_sha256']
    assert sha(initial/'adapter_config.json')==plan['initial_config_sha256']
    assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True).strip()
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
    from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
        AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError,canonical)
    from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
    from serve_emlis_natural_reply import load_generator,MODEL,REVISION,PINS
    from transformers import AutoTokenizer
    assert {n:version(n) for n in PINS}==PINS and (MODEL,REVISION)==(plan['model'],plan['revision'])
    tok=AutoTokenizer.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
    prepared=[]
    for row in plan['evaluation']:
        p=service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'],prompt_version=plan['prompt_version'])
        assert p.request_ref==row['request_ref'] and p.messages()==row['messages']
        tokens=tok.apply_chat_template(p.messages(),enable_thinking=False,add_generation_prompt=True,
            tokenize=True,return_dict=False,truncation=False)
        assert len(tokens)==row['after_prompt_tokens'] and len(tokens)+2048<=8192
        prepared.append((row,p))
    out.mkdir()
    report=dict(status='STARTED',api_commit=COMMIT,model=MODEL,revision=REVISION,
        plan_sha256=sha(root/'plan.json'),runner_sha256=sha(Path(__file__)),
        prompt_version=plan['prompt_version'],initial_weights_sha256=plan['initial_weights_sha256'],
        initial_config_sha256=plan['initial_config_sha256'],initial_selection=plan['initial_selection'],
        max_calls=46,max_model_loads=1,max_seconds=900,request_seconds=23,max_new_tokens=2048,
        training_updates=0,new_calls=0,model_loads=0,reused_before_count=46,calls=[],
        normal_adoption=False,next_training_initial_selected=False,product_credit=0)
    start=time.monotonic();deadline=start+900;gen=None
    def save():
        report['process_seconds']=time.monotonic()-start
        tmp=out/'report.tmp';tmp.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');tmp.replace(out/'report.json')
    def timeout(*_):raise TimeoutError('semantic_boundaries46_deadline')
    def restore(reload,row,path):
        with ExitStack() as stack:
            for obj,name in [(MeaningExperienceEngine,'generate'),(compiler,'compile_analysis_unit_candidates'),
                (compiler,'compile_model_written_role_graph'),(author,'realize_analysis_unit_candidates'),
                (author,'realize_model_written_role_graph')]:
                stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved regeneration')))
            return reload(row['owner'],row['snapshot'],path.read_text())
    signal.signal(signal.SIGTERM,timeout);signal.signal(signal.SIGALRM,timeout)
    signal.setitimer(signal.ITIMER_REAL,900);save()
    try:
        report['model_loads']=1;save()
        gen=load_generator(str(initial),threading.Event(),weights_sha256=plan['initial_weights_sha256'],
            config_sha256=plan['initial_config_sha256'])
        for row,p in prepared:
            assert report['new_calls']<46 and time.monotonic()<deadline
            key='after_'+row['probe_id'];sent=sha256(canonical(p.messages()).encode()).hexdigest()
            (out/(key+'.request.json')).write_text(json.dumps(dict(request_ref=p.request_ref,
                messages_sha256=sent,messages=p.messages(),prompt_tokens=row['after_prompt_tokens']),ensure_ascii=False,indent=2)+'\n')
            item=dict(probe_id=row['probe_id'],status='STARTED',prompt_tokens=row['after_prompt_tokens'])
            report['calls'].append(item);report['new_calls']+=1;save()
            begin=time.monotonic();raw,finish=gen(p.messages(),min(deadline,begin+23))
            response=AnalysisModelQuotedParentUnitsResponse(p.request_ref,sent,sha256(raw.encode()).hexdigest(),finish,raw)
            (out/(key+'.raw.txt')).write_text(raw)
            (out/(key+'.response.json')).write_text(json.dumps(asdict(response),ensure_ascii=False,indent=2)+'\n')
            item.update(status='RETURNED',seconds=time.monotonic()-begin,finish_reason=finish,raw_sha256=response.raw_sha256)
            value=replace(p,response=response)
            for kind,build,serialize,reload,suffix in [
                ('candidate',service.build_cumulative_quoted_parent_candidates,service.serialize_cumulative_quoted_parent_candidates,
                    service.reload_cumulative_quoted_parent_candidates,'.candidate.json'),
                ('role',service.build_cumulative_written_role_map,service.serialize_cumulative_written_role_map,
                    service.reload_cumulative_written_role_map,'.role.json')]:
                if kind=='role' and not row['role_vertical']:continue
                admission='admission' if kind=='candidate' else 'role_admission'
                reason='reason' if kind=='candidate' else 'role_reason'
                try:artifact,counts=build(row['owner'],row['snapshot'],model_input=value)
                except (AnalysisSemanticError,AnalysisSourceError) as exc:
                    item[admission]='REJECTED';item[reason]=str(exc)
                else:
                    path=out/(key+suffix)
                    path.write_text(serialize(row['owner'],row['snapshot'],model_input=value,artifact=artifact,coverage=counts))
                    assert restore(reload,row,path)==(artifact,counts)
                    item[admission]='RETURNED';item[kind+'_coverage']=counts
                    item[kind+'_file_replay']='MATCHED_NO_ENGINE_BOTH_COMPILERS_BOTH_AUTHORS'
            save()
        assert report['new_calls']==46 and report['model_loads']==1 and report['training_updates']==0
        assert sha(initial/'adapter_model.safetensors')==plan['initial_weights_sha256']
        assert sha(initial/'adapter_config.json')==plan['initial_config_sha256']
        report.update(status='COMPLETE_PENDING_RAW_READ_NOT_ADOPTED',initial_unchanged=True)
    except BaseException as exc:
        report.update(status='FAILED_NOT_ADOPTED',error_type=type(exc).__name__,error=str(exc),traceback=traceback.format_exc());raise
    finally:
        gen=None;gc.collect();signal.setitimer(signal.ITIMER_REAL,0);save()

if __name__=='__main__':main()
