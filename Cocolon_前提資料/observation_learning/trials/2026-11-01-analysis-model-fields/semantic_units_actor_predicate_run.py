"""One bounded inference-only actor/predicate comparison with exact saved reuse."""
from pathlib import Path
from dataclasses import asdict,replace
from contextlib import ExitStack
from importlib.metadata import version
from unittest.mock import patch
import argparse,gc,hashlib,json,os,random,shutil,signal,subprocess,sys,threading,time,traceback,zipfile
sys.dont_write_bytecode=True
os.environ.update(PYTHONDONTWRITEBYTECODE='1',HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def dump(p,v):
    tmp=p.with_suffix(p.suffix+'.tmp');tmp.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n');tmp.replace(p)

def worker(w,root,plan_hash):
    p=root/'semantic_units_actor_predicate_plan.json';assert sha(p)==plan_hash;pack=json.loads(p.read_text());limit=pack['limits']
    assert limit['new_calls']==12 and limit['training_updates']==0 and limit['max_seconds']==300
    sys.path[:0]=[str(w/'analysis-parent56-api-20261102/ai/tools'),str(w/'analysis-parent56-api-20261102/ai/services/ai_inference')]
    report=dict(status='STARTED',new_calls=0,model_loads=0,updates=0,training_forwards=0,reused_results=4,calls=[],model_adopted=False,retry=False,product_credit=0,plan_sha256=plan_hash,runner_sha256=sha(__file__))
    start=time.monotonic();deadline=start+300;generator=None
    def checkpoint():report['process_seconds']=time.monotonic()-start;dump(root/'report.json',report)
    def expired(*_):raise TimeoutError('actor_predicate_deadline')
    signal.signal(signal.SIGTERM,expired);signal.signal(signal.SIGALRM,expired);signal.setitimer(signal.ITIMER_REAL,300);checkpoint()
    try:
        from serve_emlis_natural_reply import load_generator,MODEL,REVISION,PINS
        from cocolon_meaning_experience_engine import MeaningExperienceEngine
        from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError,canonical
        from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
        import analysis_cumulative_service as service
        import cocolon_meaning_experience_engine.cores.analysis.intent_compiler as compiler
        import cocolon_meaning_experience_engine.cores.analysis.observed_route_realizer as author
        import torch
        assert {n:version(n) for n in PINS}==PINS and (MODEL,REVISION)==(pack['model'],pack['revision'])
        prepared={}
        for row in pack['rows']:
            item=service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'])
            assert item.request_ref==row['request_ref'] and item.messages()==row['messages'];prepared[row['probe_id']]=item
        for condition in pack['conditions']:
            assert report['model_loads']<2 and time.monotonic()<deadline
            random.seed(limit['seed']);torch.manual_seed(limit['seed']);torch.cuda.manual_seed_all(limit['seed'])
            generator=load_generator(condition['adapter_dir'],threading.Event(),weights_sha256=condition['weights_sha256'],config_sha256=condition['config_sha256'])
            report['model_loads']+=1;checkpoint()
            for row in pack['rows']:
                if row['reuse']:continue
                assert report['new_calls']<12 and time.monotonic()<deadline
                name=condition['id']+'_'+row['probe_id'];item=prepared[row['probe_id']];messages=item.messages()
                dump(root/(name+'.request.json'),dict(request_ref=item.request_ref,messages_sha256=row['messages_sha256'],messages=messages))
                call=dict(condition=condition['id'],probe_id=row['probe_id'],context=row['context'],actor=row['actor'],predicate=row['predicate'],status='STARTED',training_use=False)
                report['calls'].append(call);report['new_calls']+=1;checkpoint();begin=time.monotonic()
                raw,finish=generator(messages,min(deadline,begin+23))
                response=AnalysisModelQuotedParentUnitsResponse(item.request_ref,row['messages_sha256'],hashlib.sha256(raw.encode()).hexdigest(),finish,raw)
                (root/(name+'.raw.txt')).write_text(raw);dump(root/(name+'.response.json'),asdict(response))
                call.update(status='RETURNED',finish_reason=finish,raw_sha256=response.raw_sha256,seconds=time.monotonic()-begin)
                try:
                    model_input=replace(item,response=response)
                    artifact,coverage=service.build_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=model_input)
                except (AnalysisSemanticError,AnalysisSourceError) as exc:call.update(admission='REJECTED',reason=str(exc))
                else:
                    path=root/(name+'.candidate.json');path.write_text(service.serialize_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=model_input,artifact=artifact,coverage=coverage))
                    with ExitStack() as stack:
                        for obj,key in ((MeaningExperienceEngine,'generate'),(compiler,'compile_analysis_unit_candidates'),(author,'realize_analysis_unit_candidates')):stack.enter_context(patch.object(obj,key,side_effect=AssertionError('saved reader must not regenerate')))
                        saved,counts=service.reload_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],path.read_text())
                    assert saved==artifact and counts==coverage and counts['mapped_count']==0
                    call.update(admission='RETURNED',candidate_id=artifact.candidate_id,coverage=coverage,saved_file_reload='MATCHED')
                checkpoint()
            generator=None;gc.collect();torch.cuda.empty_cache();torch.cuda.synchronize()
        assert report['new_calls']==12 and report['model_loads']==2
        report['status']='COMPLETE_DIAGNOSTIC_PENDING_MEANING_READ';checkpoint();return 0
    except BaseException as exc:
        report.update(status='PARTIAL_OR_FAILED_DIAGNOSTIC_NOT_ADOPTED',error_type=type(exc).__name__,error=str(exc),traceback=traceback.format_exc());checkpoint();return 1
    finally:signal.setitimer(signal.ITIMER_REAL,0)

def main():
    a=argparse.ArgumentParser(description=__doc__);a.add_argument('--worker',action='store_true');a.add_argument('--plan-sha256',required=True);a.add_argument('--workspace',type=Path,default=Path('/workspace'));args=a.parse_args();w=args.workspace;root=w/'analysis-actor-predicate-20261102'
    if args.worker:raise SystemExit(worker(w,root,args.plan_sha256))
    assert not root.exists();prepared=w/'analysis-actor-predicate-prepared-20261102';plan=prepared/'semantic_units_actor_predicate_plan.json';assert sha(plan)==args.plan_sha256;pack=json.loads(plan.read_text())
    api=w/'analysis-parent56-api-20261102';manifest=json.loads((w/'analysis-other62-20261102/api_source_manifest.json').read_text());assert len(manifest)==2134 and all(sha(api/n)==v for n,v in manifest.items())
    loader=(api/'ai/tools/serve_emlis_natural_reply.py').read_bytes();assert hashlib.sha1(b'blob '+str(len(loader)).encode()+b'\0'+loader).hexdigest()=='722525c2a1f1afe0a5f0902e0bddf5b602db8a1a'
    weights={str(Path(c['adapter_dir'])/n):c[k] for c in pack['conditions'] for n,k in (('adapter_model.safetensors','weights_sha256'),('adapter_config.json','config_sha256'))};assert all(sha(n)==v for n,v in weights.items())
    assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True).strip()
    root.mkdir();shutil.copyfile(plan,root/plan.name);shutil.copyfile(prepared/'semantic_units_actor_predicate_cpu.json',root/'semantic_units_actor_predicate_cpu.json')
    for name in ('semantic_units_actor_predicate_run.py','semantic_units_actor_predicate_prepare.py'):shutil.copyfile(w/name,root/name)
    for row in pack['rows']:
        if row['reuse']:
            for condition,proof in row['saved'].items():
                for suffix,expected in proof['files'].items():
                    source=Path(proof['prefix']+suffix);assert sha(source)==expected;shutil.copyfile(source,root/(condition+'_'+row['probe_id']+suffix))
    dump(root/'source_identity.json',dict(api_commit=pack['api_commit'],source_commit=pack['source_commit'],runtime_scope='Verified filtered2134 files, not full Git checkout.',loader_blob='722525c2a1f1afe0a5f0902e0bddf5b602db8a1a',weights=weights,reused_results=4));dump(root/'api_source_manifest.json',manifest)
    start=time.monotonic()
    with (root/'run.log').open('x') as h:code=subprocess.run(['timeout','--signal=TERM','--kill-after=10s','290s',str(w/'analysis-probe-20261102/venv/bin/python'),str(root/'semantic_units_actor_predicate_run.py'),'--worker','--plan-sha256',args.plan_sha256],stdout=h,stderr=subprocess.STDOUT).returncode
    (root/'run.exit').write_text(str(code));dump(root/'gpu-after.json',dict(exit=code,process_seconds=time.monotonic()-start,initial_pairs_unchanged=all(sha(n)==v for n,v in weights.items()),compute_apps=subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True)))
    files=[p for p in root.rglob('*') if p.is_file()];dump(root/'manifest.json',{str(p.relative_to(root)):sha(p) for p in files});files.append(root/'manifest.json');archive=w/'cocolon-analysis-actor-predicate-diagnosis-20261102.zip'
    with zipfile.ZipFile(archive,'x',zipfile.ZIP_DEFLATED) as h:
        for p in files:h.write(p,str(p.relative_to(root)))
    (w/'actor-predicate-export.json').write_text(json.dumps(dict(original_zip_sha256=sha(archive),files={str(p.relative_to(root)):dict(bytes=p.stat().st_size,sha256=sha(p),text=p.read_bytes().decode()) for p in files}),ensure_ascii=False))
    (w/'actor-predicate-download.html').write_text('<meta charset=utf-8><h1>Actor predicate diagnosis</h1><a href=actor-predicate-export.json>All original files</a>')
    print('diagnostic exit',code,'members',len(files))

if __name__=='__main__':main()
