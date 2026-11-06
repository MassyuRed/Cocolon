"""Fixed-a2e v11/v13 positive-past wish example comparison; no learning, repairs or retries.

Reuses the exact v11 before14 sources and raw responses from the field-object
trial; preserves the v11 JSON shape baseline and adds only one independent positive-past example. Known controls are retention checks, not blind general-quality evidence.
The caller wraps generate in a 480-second parent timeout.
"""
from __future__ import annotations
import argparse
from dataclasses import asdict
import copy, gc, hashlib, importlib.util, inspect, json, os
from pathlib import Path
import signal, subprocess, sys, threading, time, traceback

IDS = [f'HC{i:02d}' for i in range(1,11)] + ['AE05','AP07_v7','AP08_v7','OP02_v7']
BASE_IDS = IDS
IDS = BASE_IDS + [f'WC{i:02d}_v13' for i in range(1,6)]
PROFILE = 'selected_material.v13'
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

def shape_setup(tokenizer):
    from syntax2b import TokenMask
    from analysis_field_object_mask import Grammar
    from transformers import AutoConfig,GenerationConfig
    from serve_emlis_natural_reply import MODEL,REVISION
    engine=TokenMask(tokenizer)
    config=AutoConfig.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
    try:generation=GenerationConfig.from_pretrained(MODEL,revision=REVISION,local_files_only=True)
    except OSError:generation=GenerationConfig.from_model_config(config)
    ids=generation.eos_token_id;ids=ids if isinstance(ids,list) else [ids]
    assert ids and all(type(i) is int and i in tokenizer.all_special_ids for i in ids)
    engine.eos=ids[0];engine.model_eos_ids=ids
    engine.cache.clear();engine.tensor_cache.clear()
    return engine,Grammar


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode',choices=['prepare','generate','replay'])
    for name in ('api','trial-root','consumer-helper','baseline','mask','syntax','enums','controls','control-baseline','root'): parser.add_argument('--'+name,type=Path,required=True)
    parser.add_argument('--api-commit',required=True)
    a=parser.parse_args();root=a.root.resolve();api=a.api.resolve();prior=a.trial_root.resolve()
    helper=load('frozen_v10_consumer',a.consumer_helper);helper.bind_api(api)
    service,admission=helper.service,helper.admission
    paths=('ai/services/ai_inference/analysis_cumulative_service.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py',
        'ai/tools/serve_emlis_natural_reply.py')
    assert sha(a.syntax)=='28e78eb120f07aef0806ddb1159e8257fb83e4972515eed63ec48b33cf205dc5'
    assert sha(a.enums)=='f9e20f0e8bb50d1602205c937c4d3e2a9a6f743ac2aa062f165f9801168b38d7'
    assert sha(a.mask)=='03ffbbc805f28a9b88071ac715df73e70042db83114790b59941abb6c007e84e'
    original=read(prior/'pack.private.json');before=read(a.baseline/'result.private.json')
    assert before['status']=='COMPLETE_NOT_ADOPTED_PENDING_REVIEW'
    assert before['new_generation']==14 and before['model_loads']==1 and before['training_updates']==0
    sys.path[:0]=[str(a.syntax.resolve().parent),str(a.enums.resolve().parent),str(a.mask.resolve().parent)]
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
        assert [c['id'] for c in before['cases']]==BASE_IDS
        from transformers import AutoTokenizer
        from serve_emlis_natural_reply import MODEL,REVISION,PINS
        tok=AutoTokenizer.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
        cases=[]
        def add_tokens(p,case,baseline=None):
            fields=json.loads(p.messages()[1]['content'])['fields']
            n=len(tok.apply_chat_template(p.messages(),tokenize=True,enable_thinking=False,
                add_generation_prompt=True,truncation=False,return_dict=False))
            assert n+2048<=8192
            case.update(input_tokens=n,field_count=len(fields))
            if baseline is not None:case['baseline']=baseline
            cases.append(case)
        for old in before['cases']:
            assert old['profile']=='selected_material.v11'
            p,case=prepared(old,PROFILE);pold,oldcase=prepared(old,old['profile'])
            assert oldcase['request']==old['request']
            assert p.request==pold.request and p.messages()[1]==pold.messages()[1]
            assert p.messages()[0]['content']==pold.messages()[0]['content']+admission._positive_past_wish_example_units_instruction()
            baseline=consume(oldcase,admission.AnalysisModelQuotedParentUnitsResponse(**old['response']))
            comparable(baseline['cumulative'],old['cumulative'])
            add_tokens(p,case,baseline)
        controls=read(a.controls)
        assert [c['id'] for c in controls]==[f'WC{i:02d}' for i in range(1,6)]
        control_pack=read(a.control_baseline/'pack.private.json')
        control_run=read(a.control_baseline/'result.private.json')
        assert control_run['status']=='COMPLETE_NOT_ADOPTED_PENDING_REVIEW'
        assert control_run['new_generation']==24 and control_run['model_loads']==1 and control_run['training_updates']==0
        for item in controls:
            old=next(c for c in control_run['cases'] if c['id']==item['id']+'_v11')
            meta=next(c for c in control_pack['cases'] if c['id']==old['id'])
            assert old['profile']=='selected_material.v11' and meta['purpose']==item['purpose']
            pold,oldcase=prepared(old,old['profile'])
            assert oldcase['request']==old['request']
            assert (a.control_baseline/(old['id']+'.raw.txt')).read_text()==old['response']['raw']
            fields=json.loads(pold.messages()[1]['content'])['fields']
            assert len(fields)==1 and fields[0]['text']==item['text']
            p,case=prepared(dict(id=item['id']+'_v13',row=old['row']),PROFILE)
            assert p.request==pold.request and p.messages()[1]==pold.messages()[1]
            assert p.messages()[0]['content']==pold.messages()[0]['content']+admission._positive_past_wish_example_units_instruction()
            baseline=consume(oldcase,admission.AnalysisModelQuotedParentUnitsResponse(**old['response']))
            comparable(baseline['cumulative'],old['cumulative'])
            case['purpose']=item['purpose'];add_tokens(p,case,baseline)
        assert [c['id'] for c in cases]==IDS
        inputs={str(p):sha(p) for p in [prior/'pack.private.json',prior/'before.private.json',a.consumer_helper,
            Path(original['runtime_pack']),Path(original['runtime_helper']),a.baseline/'pack.private.json',
            a.baseline/'result.private.json',a.mask,a.syntax,a.enums,a.controls,a.control_baseline/'pack.private.json',a.control_baseline/'result.private.json']}
        pack=dict(schema_version='analysis_wish_positive_example_trial.v1',status='PREPARED_NO_MODEL',
            api_commit=a.api_commit,api_hashes={p:sha(api/p) for p in paths},runner_sha256=sha(__file__),
            inputs=inputs,cases=cases,profile=PROFILE,model=MODEL,revision=REVISION,pins=PINS,
            initial_weights_sha256=WEIGHTS,initial_config_sha256=CONFIG,limits=dict(seconds=480,
                per_generation_seconds=35,model_loads=1,new_generation=19,updates=0,retries=0),normal_adoption=False)
        engine,Grammar=shape_setup(tok)
        assert Path(inspect.getfile(Grammar)).resolve()==a.mask.resolve()
        token_positions=0
        for c in cases:
            raw=c['baseline']['response']['raw'];grammar=Grammar(list(range(1,c['field_count']+1)))
            state=grammar.initial_state()
            for tid in tok.encode(raw,add_special_tokens=False):
                assert engine.allowed(state)[tid] and not engine.allowed(state)[engine.eos]
                state=engine.advance(state,tid);token_positions+=1
            assert state.complete and engine.allowed(state)[engine.eos]
        pack['cpu_shape']=dict(status='CPU_SHAPE_PASS_NO_MODEL',baseline_requests=19,
            token_positions=token_positions,token_mapping_checked=engine.token_mapping_checked,
            actual_model_eos_ids=engine.model_eos_ids,model_loads=0,training_updates=0)

        root.mkdir(parents=True);write(root/'pack.private.json',pack);check(pack)
        print(canonical(dict(status=pack['status'],cases=len(cases),max_input_tokens=max(c['input_tokens'] for c in cases))),flush=True);return
    pack=read(root/'pack.private.json');check(pack)
    if a.mode=='replay':
        result=read(root/'result.private.json');assert result['status']=='COMPLETE_NOT_ADOPTED_PENDING_REVIEW'
        assert not (root/'replay.private.json').exists()
        assert [c['id'] for c in result['cases']]==IDS
        assert result['calls_started']==result['new_generation']==19 and result['model_loads']==1
        for saved in result['cases']:
            c=next(c for c in pack['cases'] if c['id']==saved['id'])
            assert all(saved[k]==c[k] for k in ('row','request','profile'))
            raw=(root/(c['id']+'.raw.txt')).read_text();assert raw==saved['response']['raw']
            fresh=consume(c,admission.AnalysisModelQuotedParentUnitsResponse(**saved['response']))
            assert canonical(fresh['candidate'])==canonical(saved['candidate']);comparable(fresh['cumulative'],saved['cumulative'])
        check(pack);write(root/'replay.private.json',dict(ids=IDS,new_generation=0,updates=0,db_calls=0,exact_except_artifact_uuid=True))
        print('REPLAY_EXACT_19',flush=True);return
    assert not (root/'result.private.json').exists(),'no_restart'
    result=dict(status='STARTED',cases=[],calls_started=0,new_generation=0,model_loads_started=0,
        model_loads=0,training_updates=0,db_calls=0,normal_adoption=False)
    write(root/'result.private.json',result);started=time.monotonic();deadline=started+480;generator=None;active=[];engine=None
    try:
        runtime=load('frozen_runtime',Path(original['runtime_helper']));runtime.admission=admission
        oldpack=read(original['runtime_pack']);runtime.check_pins(oldpack)
        vendor,manifest,objects,proof=runtime.verify_optional_generation(oldpack)
        from serve_emlis_natural_reply import load_generator
        result['model_loads_started']=1;write(root/'result.private.json',result)
        from serve_emlis_natural_reply import MODEL,REVISION
        from transformers import AutoTokenizer,LogitsProcessorList
        import serve_emlis_natural_reply as server
        from syntax2b import SyntaxProcessor
        tok=AutoTokenizer.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
        engine,Grammar=shape_setup(tok)
        assert Path(inspect.getfile(Grammar)).resolve()==a.mask.resolve()
        active=[]
        def factory(messages,count,actual_model_eos):
            ids=actual_model_eos if isinstance(actual_model_eos,list) else [actual_model_eos]
            assert ids==engine.model_eos_ids and engine.eos in ids,'actual_model_eos_changed'
            fields=json.loads(messages[1]['content'])['fields']
            grammar=Grammar([f['field'] for f in fields])
            engine.cache.clear();engine.tensor_cache.clear()
            processor=SyntaxProcessor(engine,count);processor.state=grammar.initial_state()
            active[:]=[processor]
            return LogitsProcessorList([processor])
        source=inspect.getsource(server.load_generator)
        old='stopping_criteria=StoppingCriteriaList([stopping]))'
        new='stopping_criteria=StoppingCriteriaList([stopping]), logits_processor=shape_factory(messages, count, model.generation_config.eos_token_id))'
        assert source.count(old)==1,'loader_injection_point_changed'
        namespace=dict(vars(server),shape_factory=factory)
        exec(compile(source.replace(old,new),'<explicit-offline-field-shape-loader>','exec'),namespace)
        (root/'loader_original.py').write_text(source);(root/'loader_guided.py').write_text(source.replace(old,new))
        generator=namespace['load_generator'](str(adapter),threading.Event(),weights_sha256=WEIGHTS,config_sha256=CONFIG)
        result['model_loads']=1;result['optional_binding_proof']=proof
        assert vendor.vendor_bindings(manifest,Path(oldpack['optional_target']))[1]==objects
        for c in pack['cases']:
            check(pack);assert time.monotonic()<deadline
            p,current=prepared(c,c['profile']);assert current=={k:c[k] for k in current}
            result['active_id']=c['id'];result['calls_started']+=1;write(root/'result.private.json',result)
            active.clear()
            called=time.monotonic();end=min(deadline,called+35)
            def expired(*_):raise TimeoutError('generation_deadline_no_retry')
            previous=signal.signal(signal.SIGALRM,expired);signal.setitimer(signal.ITIMER_REAL,max(.001,end-called))
            try:raw,finish=generator(p.messages(),end)
            finally:signal.setitimer(signal.ITIMER_REAL,0);signal.signal(signal.SIGALRM,previous)
            elapsed=time.monotonic()-called
            response=admission.AnalysisModelQuotedParentUnitsResponse(p.request_ref,digest(p.messages()),
                hashlib.sha256(raw.encode()).hexdigest(),finish,raw)
            write(root/(c['id']+'.response.private.json'),dict(row=c['row'],request=c['request'],response=asdict(response)))
            (root/(c['id']+'.raw.txt')).write_text(raw);result['new_generation']+=1;write(root/'result.private.json',result)
            assert finish=='stop' and elapsed<=35,'incomplete_no_retry'
            assert len(active)==1
            processor=active[0];grammar=Grammar([f['field'] for f in json.loads(p.messages()[1]['content'])['fields']])
            complete=grammar.initial_state().feed(raw.encode())
            assert complete is not None and complete.complete,'raw_grammar_incomplete'
            out=consume(c,response);out['seconds']=elapsed
            out['shape']=dict(complete=True,mask_calls=len(processor.latencies),
                mask_seconds=sum(processor.latencies),mask_max_seconds=max(processor.latencies),
                actual_model_eos_ids=engine.model_eos_ids,source_or_semantic_values_fixed=False)
            result['cases'].append(out);write(root/'result.private.json',result)
            print(canonical(dict(id=c['id'],seconds=elapsed,status=out['cumulative']['status'],
                counts=out['cumulative'].get('counts'),reason=out['cumulative'].get('reason'))),flush=True)
        assert vendor.installed_files(Path(oldpack['optional_target']))==manifest['installed_files']
        assert [c['id'] for c in result['cases']]==IDS
        assert result['calls_started']==result['new_generation']==19 and result['model_loads']==1
        result['status']='COMPLETE_NOT_ADOPTED_PENDING_REVIEW'
    except BaseException:
        result.update(status='FAILED_PARTIAL_NO_RETRY',traceback=traceback.format_exc())
        if active and result['calls_started']>len(result['cases']):
            observed=active[0].observed_token_ids
            prefix=b''.join(engine.data[t] for t in observed if t in engine.data)
            write(root/'partial-observed-not-candidate.private.json',dict(id=result.get('active_id'),
                observed_token_ids=observed,raw_prefix_hex=prefix.hex(),
                status='CALLBACK_PREFIX_ONLY_NOT_CANDIDATE',may_omit_last_sampled_token=True))
        raise
    finally:
        if engine is not None:engine.cache.clear();engine.tensor_cache.clear()
        if generator is not None:
            del generator;gc.collect()
            import torch
            torch.cuda.empty_cache()
        result['seconds']=time.monotonic()-started;write(root/'result.private.json',result);check(pack)

if __name__=='__main__':main()
