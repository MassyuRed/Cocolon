"""Fixed-a2e v10/v11 after-only comparison; no learning, repairs or retries.

Reuses the exact before14 sources and raw responses from the rejected training
trial. Known controls are retention checks, not blind general-quality evidence.
The caller wraps generate in a 300-second parent timeout.
"""
from __future__ import annotations
import argparse
from dataclasses import asdict
import gc, hashlib, importlib.util, json, os
from pathlib import Path
import signal, subprocess, sys, threading, time, traceback

IDS = [f'HC{i:02d}' for i in range(1,11)] + ['AE05','AP07_v7','AP08_v7','OP02_v7']
PROFILE = 'selected_material.v11'
WEIGHTS = 'a2e62bca49ccccc5eb1d91254cd7f536d2cae0329ef7f80e5ee37208d335eb59'
CONFIG = '006ebf7bef859264b3778126f4a0f6512e1b2a7e6049b09dfcf0d56603ede3a9'

def canonical(v): return json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False)
def digest(v): return hashlib.sha256(canonical(v).encode()).hexdigest()
def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p): return json.loads(Path(p).read_bytes())
def write(p,v):
    p=Path(p);t=p.with_name(p.name+'.tmp');t.write_text(canonical(v)+'\n');t.replace(p)
def load(name,path):
    spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode',choices=['prepare','generate','replay'])
    for name in ('api','trial-root','consumer-helper','root'): parser.add_argument('--'+name,type=Path,required=True)
    parser.add_argument('--api-commit',required=True)
    a=parser.parse_args();root=a.root.resolve();api=a.api.resolve();prior=a.trial_root.resolve()
    helper=load('frozen_v10_consumer',a.consumer_helper);helper.bind_api(api)
    service,admission=helper.service,helper.admission
    paths=('ai/services/ai_inference/analysis_cumulative_service.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py',
        'ai/tools/serve_emlis_natural_reply.py')
    original=read(prior/'pack.private.json');before=read(prior/'before.private.json')
    adapter=Path(original['initial_adapter'])
    def check(pack=None):
        assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip()==a.api_commit
        assert not subprocess.check_output(['git','-C',str(api),'status','--porcelain','--untracked-files=no'],text=True).strip()
        assert sha(adapter/'adapter_model.safetensors')==WEIGHTS and sha(adapter/'adapter_config.json')==CONFIG
        if pack:
            assert sha(__file__)==pack['runner_sha256']
            for p,s in pack['inputs'].items(): assert sha(p)==s, 'source_changed'
            assert pack['api_hashes']=={p:sha(api/p) for p in paths}
    def prepared(c,profile):
        p=service.prepare_cumulative_category_units(c['row']['owner'],c['row']['snapshot'],prompt_version=profile)
        request=dict(prompt_version=p.prompt_version,request_ref=p.request_ref,source_guard=p.source_guard,
            messages=p.messages(),messages_sha256=digest(p.messages()))
        return p,dict(id=c['id'],profile=profile,row=c['row'],request=request)
    def consume(case,response): return helper.consume(case,response)
    def projection(v):return None if v is None else {k:x for k,x in v.items() if k!='projection_of'}
    def comparable(left,right):
        for k in ('status','counts','graph','reason','error_type'): assert canonical(left.get(k))==canonical(right.get(k)), k
        for k in ('text','projection'): assert canonical(projection(left.get(k)))==canonical(projection(right.get(k))),k
    if a.mode=='prepare':
        assert not root.exists(), 'new_root_required';check()
        assert [c['id'] for c in before['cases']]==IDS
        from transformers import AutoTokenizer
        from serve_emlis_natural_reply import MODEL,REVISION,PINS
        tok=AutoTokenizer.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
        cases=[]
        for old in before['cases']:
            assert old['profile']=='selected_material.v10'
            p,case=prepared(old,PROFILE);pold,oldcase=prepared(old,old['profile'])
            assert oldcase['request']==old['request']
            assert p.request==pold.request and p.messages()[1]==pold.messages()[1]
            fields=json.loads(p.messages()[1]['content'])['fields']
            assert p.messages()[0]['content']==pold.messages()[0]['content']+admission._field_ordinal_units_instruction(
                [f['field'] for f in fields])+admission._field_object_boundaries_units_instruction()
            baseline=consume(oldcase,admission.AnalysisModelQuotedParentUnitsResponse(**old['response']))
            comparable(baseline['cumulative'],old['cumulative'])
            n=len(tok.apply_chat_template(p.messages(),tokenize=True,enable_thinking=False,
                add_generation_prompt=True,truncation=False,return_dict=False))
            assert n+2048<=8192
            case.update(input_tokens=n,field_count=len(fields),baseline=baseline);cases.append(case)
        inputs={str(p):sha(p) for p in [prior/'pack.private.json',prior/'before.private.json',a.consumer_helper,
            Path(original['runtime_pack']),Path(original['runtime_helper'])]}
        pack=dict(schema_version='analysis_field_object_prompt_trial.v1',status='PREPARED_NO_MODEL',
            api_commit=a.api_commit,api_hashes={p:sha(api/p) for p in paths},runner_sha256=sha(__file__),
            inputs=inputs,cases=cases,profile=PROFILE,model=MODEL,revision=REVISION,pins=PINS,
            initial_weights_sha256=WEIGHTS,initial_config_sha256=CONFIG,limits=dict(seconds=300,
                per_generation_seconds=23,model_loads=1,new_generation=14,updates=0,retries=0),normal_adoption=False)
        root.mkdir(parents=True);write(root/'pack.private.json',pack);check(pack)
        print(canonical(dict(status=pack['status'],cases=len(cases),max_input_tokens=max(c['input_tokens'] for c in cases))),flush=True);return
    pack=read(root/'pack.private.json');check(pack)
    if a.mode=='replay':
        result=read(root/'result.private.json');assert result['status']=='COMPLETE_NOT_ADOPTED_PENDING_REVIEW'
        assert not (root/'replay.private.json').exists()
        for saved in result['cases']:
            c=next(c for c in pack['cases'] if c['id']==saved['id'])
            raw=(root/(c['id']+'.raw.txt')).read_text();assert raw==saved['response']['raw']
            fresh=consume(c,admission.AnalysisModelQuotedParentUnitsResponse(**saved['response']))
            assert canonical(fresh['candidate'])==canonical(saved['candidate']);comparable(fresh['cumulative'],saved['cumulative'])
        check(pack);write(root/'replay.private.json',dict(ids=IDS,new_generation=0,updates=0,db_calls=0,exact_except_artifact_uuid=True))
        print('REPLAY_EXACT_14',flush=True);return
    assert not (root/'result.private.json').exists(),'no_restart'
    result=dict(status='STARTED',cases=[],calls_started=0,new_generation=0,model_loads_started=0,
        model_loads=0,training_updates=0,db_calls=0,normal_adoption=False)
    write(root/'result.private.json',result);started=time.monotonic();deadline=started+300;generator=None
    try:
        runtime=load('frozen_runtime',Path(original['runtime_helper']));runtime.admission=admission
        oldpack=read(original['runtime_pack']);runtime.check_pins(oldpack)
        vendor,manifest,objects,proof=runtime.verify_optional_generation(oldpack)
        from serve_emlis_natural_reply import load_generator
        result['model_loads_started']=1;write(root/'result.private.json',result)
        generator=load_generator(str(adapter),threading.Event(),weights_sha256=WEIGHTS,config_sha256=CONFIG)
        result['model_loads']=1;result['optional_binding_proof']=proof
        assert vendor.vendor_bindings(manifest,Path(oldpack['optional_target']))[1]==objects
        for c in pack['cases']:
            check(pack);assert time.monotonic()<deadline
            p,current=prepared(c,PROFILE);assert current=={k:c[k] for k in current}
            result['active_id']=c['id'];result['calls_started']+=1;write(root/'result.private.json',result)
            called=time.monotonic();end=min(deadline,called+23)
            def expired(*_):raise TimeoutError('generation_deadline_no_retry')
            previous=signal.signal(signal.SIGALRM,expired);signal.setitimer(signal.ITIMER_REAL,max(.001,end-called))
            try:raw,finish=generator(p.messages(),end)
            finally:signal.setitimer(signal.ITIMER_REAL,0);signal.signal(signal.SIGALRM,previous)
            elapsed=time.monotonic()-called
            response=admission.AnalysisModelQuotedParentUnitsResponse(p.request_ref,digest(p.messages()),
                hashlib.sha256(raw.encode()).hexdigest(),finish,raw)
            write(root/(c['id']+'.response.private.json'),dict(row=c['row'],request=c['request'],response=asdict(response)))
            (root/(c['id']+'.raw.txt')).write_text(raw);result['new_generation']+=1;write(root/'result.private.json',result)
            assert finish=='stop' and elapsed<=23,'incomplete_no_retry'
            out=consume(c,response);out['seconds']=elapsed;result['cases'].append(out);write(root/'result.private.json',result)
            print(canonical(dict(id=c['id'],seconds=elapsed,status=out['cumulative']['status'],
                counts=out['cumulative'].get('counts'),reason=out['cumulative'].get('reason'))),flush=True)
        assert vendor.installed_files(Path(oldpack['optional_target']))==manifest['installed_files']
        result['status']='COMPLETE_NOT_ADOPTED_PENDING_REVIEW'
    except BaseException:
        result.update(status='FAILED_PARTIAL_NO_RETRY',traceback=traceback.format_exc());raise
    finally:
        if generator is not None:
            del generator;gc.collect()
            import torch
            torch.cuda.empty_cache()
        result['seconds']=time.monotonic()-started;write(root/'result.private.json',result);check(pack)

if __name__=='__main__':main()
