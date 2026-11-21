"""One fixed-weight, after-only negative-wish comparison; no training or retries.

The private prior report supplies exact source/baseline responses. Production
transport, batch selection and database are not used. One new response per id.
"""
from __future__ import annotations
import argparse
from dataclasses import asdict, replace
import gc, hashlib, importlib.util, json, os
from pathlib import Path
import signal, subprocess, sys, threading, time, traceback

IDS=('E01','E02','E03','E04','E05','E06','AE05','AP07_v7','AP08_v7','OP02_v7')
WEIGHTS='a2e62bca49ccccc5eb1d91254cd7f536d2cae0329ef7f80e5ee37208d335eb59'
CONFIG='006ebf7bef859264b3778126f4a0f6512e1b2a7e6049b09dfcf0d56603ede3a9'
PROFILE='selected_material.v10'

def canonical(x):return json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False)
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def digest(x):return hashlib.sha256(canonical(x).encode()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def write(p,x):
    p=Path(p);tmp=p.with_name(p.name+'.tmp');tmp.write_text(canonical(x)+'\n');tmp.replace(p)
def load(name,path):
    spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m

def main():
    cli=argparse.ArgumentParser(description=__doc__)
    cli.add_argument('mode',choices=['prepare','generate','replay'])
    cli.add_argument('--api',type=Path,required=True);cli.add_argument('--prior',type=Path,required=True)
    cli.add_argument('--baseline',type=Path,required=True)
    cli.add_argument('--root',type=Path,required=True);args=cli.parse_args()
    api=args.api.resolve();prior=args.prior.resolve();root=args.root.resolve();baseline=args.baseline.resolve()
    sys.path[:0]=[str(api/'ai/services/ai_inference'),str(api/'ai/tools')]
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as admission
    helper=load('prior_consumer',prior/'runner.py');helper.admission=admission
    original=read(baseline/'result.private.json');oldpack=read(prior/'pack.json')
    assert original['status']=='COMPLETE_PENDING_REVIEW_NOT_ADOPTED'
    baselines={c['id']:c for c in original['cases']}
    assert set(baselines)==set(IDS)
    def prepared(case,profile):return service.prepare_cumulative_category_units(case['row']['owner'],case['row']['snapshot'],prompt_version=profile)
    def check_api(pack):
        assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip()==pack['api_commit']
        assert not subprocess.check_output(['git','-C',str(api),'status','--porcelain','--untracked-files=no'],text=True).strip()
        for path,expected in pack['api_hashes'].items():assert sha(api/path)==expected
        assert sha(Path(oldpack['initial_adapter'])/'adapter_model.safetensors')==WEIGHTS
        assert sha(Path(oldpack['initial_adapter'])/'adapter_config.json')==CONFIG
        assert sha(baseline/'result.private.json')==pack['baseline_result_sha256']
    def consume(case,p,response):
        request=dict(request_ref=p.request_ref,source_guard=p.source_guard,prompt_version=p.prompt_version,
            messages=p.messages(),messages_sha256=digest(p.messages()))
        out=helper.consume(p,response,row=case['row'],request=request)
        # Use the cumulative entry with the same strict bound raw as well.
        try:
            artifact,counts=service.build_cumulative_map(case['row']['owner'],case['row']['snapshot'],model_input=replace(p,response=response))
            out['cumulative']=dict(counts=counts,status='UNSUPPORTED' if artifact is None else 'GENERATED_PRIVATE_ONLY')
            if artifact is not None:
                out['cumulative'].update(graph=asdict(artifact.graph),text=artifact.safe_text_projection(authenticated_owner_scope=case['row']['owner']),
                    projection=artifact.safe_projection(authenticated_owner_scope=case['row']['owner']))
        except (admission.AnalysisSemanticError,ValueError) as error:
            out['cumulative']=dict(status='REJECTED',error_type=type(error).__name__,reason=str(error))
        return out
    if args.mode=='prepare':
        assert not root.exists(),'new_root_required';root.mkdir(parents=True)
        from transformers import AutoTokenizer
        from serve_emlis_natural_reply import MODEL,REVISION,PINS
        tokenizer=AutoTokenizer.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
        cases=[]
        for key in IDS:
            case=baselines[key];old=prepared(case,'selected_material.v9');new=prepared(case,PROFILE)
            assert old.messages()==case['request']['messages'] and old.request_ref==case['request']['request_ref']
            assert digest(old.messages())==case['response']['messages_sha256']
            assert new.messages()[1]==old.messages()[1] and new.request==old.request
            assert new.messages()[0]['content']==old.messages()[0]['content']+admission._negative_wish_examples_units_instruction()
            assert new.request_ref!=old.request_ref
            n=len(tokenizer.apply_chat_template(new.messages(),tokenize=True,enable_thinking=False,add_generation_prompt=True,truncation=False,return_dict=False))
            assert n+2048<=8192
            cases.append(dict(id=key,row=case['row'],messages=new.messages(),request_ref=new.request_ref,tokens=n,
                baseline=consume(case,old,admission.AnalysisModelQuotedParentUnitsResponse(**case['response']))))
        paths=['ai/services/ai_inference/analysis_cumulative_service.py',
            'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
            'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py',
            'ai/tools/serve_emlis_natural_reply.py']
        pack=dict(schema_version='analysis_negative_wish_prompt_probe.v1',status='CPU_PREPARED_NO_MODEL',
            ids=list(IDS),profile=PROFILE,api_commit=subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip(),
            api_hashes={p:sha(api/p) for p in paths},baseline_result_sha256=sha(baseline/'result.private.json'),
            baseline_reused=True,training_updates=0,max_generations=10,max_model_loads=1,max_seconds=240,
            per_generation_seconds=23,context_tokens=8192,output_tokens=2048,normal_adoption=False,
            initial_weights_sha256=WEIGHTS,initial_config_sha256=CONFIG,model=MODEL,revision=REVISION,pins=PINS,cases=cases,
            runner_sha256=sha(__file__))
        write(root/'pack.private.json',pack)
        print(canonical(dict(status=pack['status'],cases=len(cases),max_input_tokens=max(c['tokens'] for c in cases),pack_sha256=sha(root/'pack.private.json'))));return
    pack=read(root/'pack.private.json');check_api(pack);assert pack['runner_sha256']==sha(__file__)
    if args.mode=='replay':
        results=read(root/'result.private.json');checked=[]
        for case in results['cases']:
            p=prepared(case,PROFILE);response=admission.AnalysisModelQuotedParentUnitsResponse(**case['response'])
            fresh=consume(case,p,response)
            assert canonical(fresh['candidate'])==canonical(case['candidate'])
            for key in ('status','counts','graph'):assert canonical(fresh['cumulative'].get(key))==canonical(case['cumulative'].get(key))
            # Artifact UUID is new during offline build; saved candidate is exact.
            for key in ('text','projection'):
                left=fresh['cumulative'].get(key);right=case['cumulative'].get(key)
                if left is not None:
                    assert {k:v for k,v in left.items() if k!='projection_of'}=={k:v for k,v in right.items() if k!='projection_of'}
            checked.append(case['id'])
        write(root/'replay.private.json',dict(ids=checked,model_calls=0,updates=0,db_calls=0,raw_unchanged=True));print(canonical(dict(replayed=checked)));return
    assert not (root/'result.private.json').exists(),'no_restart'
    result=dict(status='STARTED',cases=[],calls_started=0,new_generation=0,model_loads_started=1,model_loads=0,
        training_updates=0,normal_adoption=False,api_calls=0,db_calls=0,weights_sha256=WEIGHTS,config_sha256=CONFIG)
    write(root/'result.private.json',result);start=time.monotonic();deadline=start+240;generator=None
    try:
        helper.check_pins(oldpack)
        vendor,manifest,objects,proof=helper.verify_optional_generation(oldpack)
        from serve_emlis_natural_reply import load_generator
        generator=load_generator(oldpack['initial_adapter'],threading.Event(),weights_sha256=WEIGHTS,config_sha256=CONFIG)
        result['model_loads']=1;result['optional_binding_proof']=proof
        assert vendor.vendor_bindings(manifest,Path(oldpack['optional_target']))[1]==objects
        for spec in pack['cases']:
            assert time.monotonic()<deadline;check_api(pack)
            p=prepared(spec,PROFILE);assert p.messages()==spec['messages'] and p.request_ref==spec['request_ref']
            result['active_id']=spec['id'];result['calls_started']+=1;write(root/'result.private.json',result)
            called=time.monotonic();end=min(deadline,called+23)
            signal.signal(signal.SIGALRM,signal.SIG_DFL);signal.setitimer(signal.ITIMER_REAL,max(.001,end-called))
            try:raw,finish=generator(p.messages(),end)
            finally:signal.setitimer(signal.ITIMER_REAL,0)
            elapsed=time.monotonic()-called
            response=admission.AnalysisModelQuotedParentUnitsResponse(p.request_ref,digest(p.messages()),hashlib.sha256(raw.encode()).hexdigest(),finish,raw)
            write(root/(spec['id']+'.response.private.json'),dict(row=spec['row'],messages=p.messages(),response=asdict(response)))
            (root/(spec['id']+'.raw.txt')).write_text(raw)
            result['new_generation']+=1;write(root/'result.private.json',result)
            assert finish=='stop' and elapsed<=23,'incomplete_no_retry'
            case=consume(spec,p,response);case['generation_seconds']=elapsed
            result['cases'].append(case);write(root/'result.private.json',result)
            print(canonical(dict(id=spec['id'],seconds=elapsed,status=case['cumulative']['status'])),flush=True)
        assert vendor.installed_files(Path(oldpack['optional_target']))==manifest['installed_files']
        result['status']='COMPLETE_PENDING_REVIEW_NOT_ADOPTED';result['optional_unchanged']=True
    except BaseException:
        result['status']='FAILED_PARTIAL_NO_RETRY';result['traceback']=traceback.format_exc();raise
    finally:
        result['seconds']=time.monotonic()-start;write(root/'result.private.json',result)
        if generator is not None:
            del generator;gc.collect()
            import torch
            torch.cuda.empty_cache()
        check_api(pack)

if __name__=='__main__':main()
