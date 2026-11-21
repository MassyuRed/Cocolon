"""Align unchanged78 teachers to material.v4, then compare a fixed14-source set.

One opt-in trial: old106 CE order, explicit9dc initialization, fresh before8,
reused before6, train106/NLL156, saved reload and after14. No product activation.
"""
from contextlib import ExitStack
from dataclasses import asdict, replace
import gc
import hashlib
import html
from importlib.metadata import version
import json
import os
from pathlib import Path
import random
import shutil
import signal
import subprocess
import sys
import threading
import time
import traceback
from unittest.mock import patch
import zipfile

W=Path('/workspace');API=W/'analysis-material-v3-api-20261103'
ROOT=W/'analysis-material-v4-aligned78-20261103'
OLD=W/'analysis-boundary78-20261103/semantic_units_boundary78_plan.json'
PRIOR=W/'analysis-material-v4-pair12-20261103'
INITIAL=W/'analysis-reason-unknown76-20261103/result/adapter'
COMMIT='ded0586720df0c0d50d8838bcd391a19ca3eead5'
OLD_SHA='72696f33ae6e8284eb928e7497fa966b64bb072c99474ea99abc6b5a93b133be'
WEIGHTS='9dc4f947cda74e2c2befea39a978d3ca44295c7526a7ef2db8011a8c63947d4a'
CONFIG='4776a484561a82593d78f5e79f0e57a503c58d2a9fc54a69fff8890f885a75ce'
PROFILE='selected_material.v4'
RETENTION=('T01','T02','R08','SC01','OA01','MD02','HQ04','YREASON01')
LIMIT=1200
sys.dont_write_bytecode=True
os.environ['HF_HUB_OFFLINE']='1';os.environ['TRANSFORMERS_OFFLINE']='1'
sys.path[:0]=[str(API/'ai/services/ai_inference'),str(API/'ai/tools'),str(API/'ai/tests')]
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
canonical=lambda v:json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':'))


def write(path,value):
    path=Path(path);tmp=path.with_suffix(path.suffix+'.tmp')
    tmp.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n');tmp.replace(path)


def check_api():
    assert subprocess.check_output(['git','-C',str(API),'rev-parse','HEAD'],text=True).strip()==COMMIT
    assert not subprocess.check_output(['git','-C',str(API),'status','--porcelain','--untracked-files=no'],text=True).strip()


def prepare_input(row):
    import analysis_cumulative_service as service
    return service.prepare_cumulative_category_units(row['owner'],row['snapshot'],prompt_version=PROFILE)


def guard_saved():
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as c
    from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as a
    stack=ExitStack()
    for obj,name in [(MeaningExperienceEngine,'generate'),(c,'compile_observed_graph'),
        (c,'compile_analysis_unit_candidates'),(c,'compile_model_written_role_graph'),
        (c,'compile_model_written_role_action_graph'),(a,'realize_analysis_unit_candidates'),
        (a,'realize_model_written_role_graph')]:
        stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved regeneration')))
    return stack


def bind_save(row,p,response,directory,key):
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisSemanticError
    from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
    value=replace(p,response=response);result={}
    try:
        a,c=service.build_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=value)
        raw=service.serialize_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=value,artifact=a,coverage=c)
        (directory/(key+'.candidate.json')).write_text(raw)
        with guard_saved():assert service.reload_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],raw)==(a,c)
        result.update(candidate='RETURNED',candidate_replay='MATCHED',candidate_coverage=c)
    except (AnalysisSemanticError,AnalysisSourceError) as exc:
        result.update(candidate='REJECTED',candidate_reason=str(exc))
    try:
        pair=row.get('with_action',False)
        a,c=service.build_cumulative_written_role_map(row['owner'],row['snapshot'],model_input=value,with_action=pair)
        raw=service.serialize_cumulative_written_role_map(row['owner'],row['snapshot'],model_input=value,artifact=a,coverage=c,with_action=pair)
        (directory/(key+'.typed.json')).write_text(raw)
        with guard_saved():assert service.reload_cumulative_written_role_map(row['owner'],row['snapshot'],raw,with_action=pair)==(a,c)
        write(directory/(key+'.projection.json'),dict(graph=asdict(a.graph),text=a.safe_text_projection(authenticated_owner_scope=row['owner']),diagram=a.safe_projection(authenticated_owner_scope=row['owner'])))
        result.update(typed='RETURNED',typed_nodes=len(a.graph.nodes),typed_replay='MATCHED')
    except (AnalysisSemanticError,AnalysisSourceError) as exc:
        result.update(typed='REJECTED',typed_reason=str(exc))
    return result


def prepare():
    check_api();assert not ROOT.exists(),'do_not_restart_completed_or_partial_root'
    assert sha(OLD)==OLD_SHA and sha(INITIAL/'adapter_model.safetensors')==WEIGHTS and sha(INITIAL/'adapter_config.json')==CONFIG
    assert (W/'material-v4-final-tests.exit').read_text().strip()=='0'
    from serve_emlis_natural_reply import MODEL,REVISION,PINS
    from transformers import AutoTokenizer
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse
    assert {n:version(n) for n in PINS}==PINS
    old=json.loads(OLD.read_text());assert len(old['teachers'])==78 and len(old['plan']['update_order'])==106
    ROOT.mkdir();(ROOT/'source78.json').write_bytes(OLD.read_bytes());(ROOT/'runner.py').write_bytes(Path(__file__).read_bytes())
    for name in ('material-v4-final-tests.exit','material-v4-final-tests.log','material-v4-compatibility.json'):
        shutil.copyfile(W/name,ROOT/name)
    tokenizer=AutoTokenizer.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
    teachers=[];encoded={};teacher_audit=[]
    for original in old['teachers']:
        row={k:original[k] for k in ('id','owner','snapshot','assistant_target')};p=prepare_input(row)
        row.update(messages=p.messages(),request_ref=p.request_ref)
        prompt=tokenizer.apply_chat_template(row['messages'],enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
        assert len(prompt)+2048<=8192
        full=tokenizer.apply_chat_template(row['messages']+[dict(role='assistant',content=row['assistant_target'])],enable_thinking=False,add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
        assert full[:len(prompt)]==prompt and len(prompt)<len(full)<=8192
        assert tokenizer.decode(full[len(prompt):],skip_special_tokens=False,clean_up_tokenization_spaces=False)==row['assistant_target']+'<|im_end|>\n'
        encoded[row['id']]=dict(input_ids=full,labels=[-100]*len(prompt)+full[len(prompt):],loss_start=len(prompt)-1,logits_positions=len(full)-len(prompt)+1)
        response=AnalysisModelQuotedParentUnitsResponse(p.request_ref,hashlib.sha256(canonical(p.messages()).encode()).hexdigest(),hashlib.sha256(row['assistant_target'].encode()).hexdigest(),'stop',row['assistant_target'])
        target_dir=ROOT/'teacher_targets';target_dir.mkdir(exist_ok=True)
        admitted=bind_save(row,p,response,target_dir,row['id']);assert admitted['candidate']=='RETURNED'
        teacher_audit.append(dict(id=row['id'],prompt_tokens=len(prompt),target_tokens=len(full)-len(prompt),**admitted));teachers.append(row)
    assert [{k:r[k] for k in ('id','owner','snapshot','assistant_target')} for r in teachers]==[{k:r[k] for k in ('id','owner','snapshot','assistant_target')} for r in old['teachers']]
    evaluation=[];byid={r['probe_id']:r for r in old['evaluation']}
    for key in RETENTION:
        r=byid[key];evaluation.append(dict(id=key,owner=r['owner'],snapshot=r['snapshot'],with_action=False,training_use=r['training_use'],kind='FIXED_DEVELOPMENT_RETENTION'))
    prior_manifest=json.loads((PRIOR/'manifest.json').read_text())
    assert all(sha(PRIOR/n)==h for n,h in prior_manifest.items())
    prior_report=json.loads((PRIOR/'report.json').read_text())
    assert prior_report['weights_sha256']==WEIGHTS and prior_report['config_sha256']==CONFIG
    assert prior_report['training_updates']==0 and prior_report['adapter_unchanged'] and prior_report['new_calls']==12
    sources=json.loads((PRIOR/'sources.json').read_text());assert len(sources)==6
    reused=ROOT/'reused_before';reused.mkdir()
    before=[]
    from test_analysis_cumulative import OWNER
    for case in sources:
        row=dict(id=case['case'],owner=OWNER,snapshot=case['snapshot'],with_action=True,training_use=False,kind='NEARBY_SYNTHETIC_PAIR_NOT_TEACHER')
        p=prepare_input(row);key=case['case']+'_'+PROFILE
        req=json.loads((PRIOR/(key+'.request.json')).read_text());res=AnalysisModelQuotedParentUnitsResponse(**json.loads((PRIOR/(key+'.response.json')).read_text()))
        assert req['messages']==p.messages() and req['request_ref']==p.request_ref
        assert res.messages_sha256==hashlib.sha256(canonical(p.messages()).encode()).hexdigest()
        assert res.raw.encode()==(PRIOR/(key+'.raw.txt')).read_bytes() and res.finish_reason=='stop'
        for suffix in ('.request.json','.response.json','.raw.txt'):shutil.copyfile(PRIOR/(key+suffix),reused/(row['id']+suffix))
        before.append(dict(id=row['id'],**bind_save(row,p,res,reused,row['id'])))
        evaluation.append(row)
    assert len(evaluation)==14 and len({r['id'] for r in evaluation})==14
    assert sum(x.get('typed')=='RETURNED' for x in before)==3
    for row in evaluation:
        p=prepare_input(row);row.update(messages=p.messages(),request_ref=p.request_ref)
        tokens=tokenizer.apply_chat_template(p.messages(),enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
        assert len(tokens)+2048<=8192
    plan=dict(status='CPU_PREPARED_NO_MODEL',api_commit=COMMIT,profile=PROFILE,teachers=teachers,evaluation=evaluation,old_training_plan=old['plan'],source78_sha256=OLD_SHA,seed=old['plan']['seed'],learning_rate=old['plan']['learning_rate'],update_order=old['plan']['update_order'],max_seconds=LIMIT,new_calls=22,model_loads=3,normal_adoption=False)
    write(ROOT/'pack.json',plan);write(ROOT/'encoded.json',encoded);write(ROOT/'teacher_audit.json',teacher_audit);write(ROOT/'reused_before.json',before)
    write(ROOT/'cpu_manifest.json',{str(p.relative_to(ROOT)):sha(p) for p in ROOT.rglob('*') if p.is_file()})
    print(json.dumps(dict(status=plan['status'],teachers=78,updates=106,evaluation=14,reused_before=6,new_calls=22,model_loads=3,pack_sha256=sha(ROOT/'pack.json'))))


def generate_phase(phase,deadline):
    from serve_emlis_natural_reply import load_generator
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse
    pack=json.loads((ROOT/'pack.json').read_text());rows=pack['evaluation'][:8] if phase=='before' else pack['evaluation']
    adapter=INITIAL if phase=='before' else ROOT/'train/adapter'
    directory=ROOT/phase;directory.mkdir();report=dict(status='STARTED',calls=[],model_loads=1);write(directory/'report.json',report)
    expected=dict(weights_sha256=WEIGHTS,config_sha256=CONFIG) if phase=='before' else json.loads((ROOT/'train/report.json').read_text())
    assert sha(adapter/'adapter_model.safetensors')==expected['weights_sha256'] and sha(adapter/'adapter_config.json')==expected['config_sha256']
    if phase=='after':assert expected['status']=='COMPLETE_NOT_ADOPTED'
    generator=load_generator(str(adapter),threading.Event(),weights_sha256=expected['weights_sha256'],config_sha256=expected['config_sha256'])
    for row in rows:
        assert time.monotonic()<deadline
        p=prepare_input(row);assert p.request_ref==row['request_ref'] and p.messages()==row['messages']
        key=row['id'];item=dict(id=key,status='STARTED');report['calls'].append(item);write(directory/'report.json',report)
        write(directory/(key+'.request.json'),dict(request_ref=p.request_ref,messages_sha256=hashlib.sha256(canonical(p.messages()).encode()).hexdigest(),messages=p.messages()))
        raw,finish=generator(p.messages(),min(deadline,time.monotonic()+45))
        response=AnalysisModelQuotedParentUnitsResponse(p.request_ref,hashlib.sha256(canonical(p.messages()).encode()).hexdigest(),hashlib.sha256(raw.encode()).hexdigest(),finish,raw)
        (directory/(key+'.raw.txt')).write_text(raw);write(directory/(key+'.response.json'),asdict(response))
        item.update(status='RETURNED',finish=finish,**bind_save(row,p,response,directory,key));write(directory/'report.json',report)
        assert finish=='stop'
    report['status']='COMPLETE_NOT_ADOPTED_PENDING_FULL_REVIEW';write(directory/'report.json',report)


def train_phase(deadline):
    import torch
    import torch.nn.functional as F
    from transformers import Qwen3_5ForConditionalGeneration
    from peft import PeftModel,get_peft_model_state_dict
    from safetensors.torch import load_file
    from serve_emlis_natural_reply import MODEL,REVISION
    assert sha(INITIAL/'adapter_model.safetensors')==WEIGHTS and sha(INITIAL/'adapter_config.json')==CONFIG
    pack=json.loads((ROOT/'pack.json').read_text());encoded=json.loads((ROOT/'encoded.json').read_text());directory=ROOT/'train';directory.mkdir()
    report=dict(status='STARTED',model_loads=1,updates=0,measurement_forwards=0,steps=[],measurements=[]);write(directory/'report.json',report)
    random.seed(pack['seed']);torch.manual_seed(pack['seed']);torch.cuda.manual_seed_all(pack['seed'])
    model=None
    try:
        model=Qwen3_5ForConditionalGeneration.from_pretrained(MODEL,revision=REVISION,dtype=torch.bfloat16,device_map={'':0},attn_implementation='sdpa',local_files_only=True,trust_remote_code=False)
        model=PeftModel.from_pretrained(model,INITIAL,is_trainable=True,local_files_only=True)
        saved=load_file(INITIAL/'adapter_model.safetensors');loaded=get_peft_model_state_dict(model)
        assert len(saved)==len(loaded)==112 and all(torch.equal(saved[k],loaded[k].detach().cpu()) for k in saved)
        del saved,loaded
        trainable=[p for p in model.parameters() if p.requires_grad]
        assert len(trainable)==112 and sum(p.numel() for p in trainable)==3833856
        assert all(m.p==0 for m in model.modules() if isinstance(m,torch.nn.Dropout))
        assert getattr(getattr(model.config,'text_config',model.config),'attention_dropout',None)==0
        torch.cuda.reset_peak_memory_stats()
        model.config.use_cache=False;model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={'use_reentrant':False});model.enable_input_require_grads()
        def loss(item):
            ids=torch.tensor([item['input_ids']],dtype=torch.long,device='cuda:0')
            out=model(input_ids=ids,attention_mask=torch.ones_like(ids),logits_to_keep=item['logits_positions'],use_cache=False)
            gold=torch.tensor(item['labels'][item['loss_start']+1:],dtype=torch.long,device='cuda:0')
            assert out.logits.shape[:2]==(1,item['logits_positions']) and (gold>=0).all()
            return F.cross_entropy(out.logits[0,:-1,:].float(),gold)
        def measure(phase):
            model.eval();values={}
            with torch.no_grad():
                for key,item in encoded.items():
                    assert time.monotonic()<deadline
                    value=loss(item);assert torch.isfinite(value);values[key]=float(value);report['measurement_forwards']+=1
            report['measurements'].append(dict(phase=phase,losses=values,mean=sum(values.values())/len(values)));write(directory/'report.json',report)
        measure('before')
        optimizer=torch.optim.AdamW(trainable,lr=pack['learning_rate'],weight_decay=0.)
        model.train()
        for step,key in enumerate(pack['update_order'],1):
            assert time.monotonic()<deadline
            optimizer.zero_grad(set_to_none=True);value=loss(encoded[key]);assert torch.isfinite(value);value.backward()
            assert all(p.grad is None or torch.isfinite(p.grad).all() for p in trainable)
            norm=torch.nn.utils.clip_grad_norm_(trainable,1.);assert torch.isfinite(norm);optimizer.step()
            report['updates']=step;report['steps'].append(dict(step=step,id=key,loss=float(value.detach()),gradient_norm=float(norm)));write(directory/'report.json',report)
        optimizer.zero_grad(set_to_none=True);optimizer=None
        measure('after')
        assert report['updates']==106 and report['measurement_forwards']==156
        model.save_pretrained(directory/'adapter',safe_serialization=True)
        saved=load_file(directory/'adapter/adapter_model.safetensors');actual=get_peft_model_state_dict(model)
        assert len(saved)==len(actual)==112 and all(torch.isfinite(t).all() and torch.equal(t,actual[k].detach().cpu()) for k,t in saved.items())
        report.update(status='COMPLETE_NOT_ADOPTED',peak_allocated_gib=torch.cuda.max_memory_allocated()/2**30,peak_reserved_gib=torch.cuda.max_memory_reserved()/2**30,weights_sha256=sha(directory/'adapter/adapter_model.safetensors'),config_sha256=sha(directory/'adapter/adapter_config.json'))
    finally:
        try:
            if model is not None and report['status']!='COMPLETE_NOT_ADOPTED':
                model.save_pretrained(directory/'partial_adapter',safe_serialization=True)
        except BaseException:
            report['partial_save_error']=traceback.format_exc()
        finally:
            write(directory/'report.json',report)


def run():
    check_api();manifest=json.loads((ROOT/'cpu_manifest.json').read_text());assert all(sha(ROOT/n)==h for n,h in manifest.items())
    assert sha(OLD)==OLD_SHA and sha(INITIAL/'adapter_model.safetensors')==WEIGHTS and sha(INITIAL/'adapter_config.json')==CONFIG
    with (ROOT/'run_started.json').open('x') as f:json.dump(dict(started=time.time(),max_seconds=LIMIT),f)
    assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True).strip()
    shutil.copyfile(Path(__file__).resolve(),ROOT/'execution_runner.py')
    start=time.monotonic();deadline=start+LIMIT;report=dict(status='STARTED',api_commit=COMMIT,normal_adoption=False,execution_script_sha256=sha(ROOT/'execution_runner.py'),stages=[])
    try:
        for phase in ('before','train','after'):
            remaining=int(deadline-time.monotonic())-10;assert remaining>0
            with (ROOT/(phase+'.log')).open('x') as log:
                r=subprocess.run(['timeout','--signal=TERM','--kill-after=10',str(remaining),sys.executable,str(ROOT/'execution_runner.py'),phase,str(deadline)],stdout=log,stderr=subprocess.STDOUT)
            report['stages'].append(dict(phase=phase,exit=r.returncode));write(ROOT/'report.json',report)
            assert r.returncode==0,phase
        assert sha(OLD)==OLD_SHA and sha(INITIAL/'adapter_model.safetensors')==WEIGHTS and sha(INITIAL/'adapter_config.json')==CONFIG
        report['status']='COMPLETE_PENDING_ALL_RAW_REVIEW_NOT_ADOPTED'
    except BaseException as exc:
        report.update(status='FAILED_NO_RETRY_NOT_ADOPTED',error=type(exc).__name__,traceback=traceback.format_exc())
        raise
    finally:
        report.update(seconds=time.monotonic()-start,initial_unchanged=sha(INITIAL/'adapter_model.safetensors')==WEIGHTS and sha(INITIAL/'adapter_config.json')==CONFIG,
            source78_unchanged=sha(OLD)==OLD_SHA,gpu_after_process=subprocess.check_output(['nvidia-smi','--query-gpu=memory.used,utilization.gpu','--format=csv,noheader'],text=True).strip(),compute_apps=subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True))
        if not report['initial_unchanged'] or not report['source78_unchanged']:
            report['status']='FAILED_FINAL_LINEAGE_CHANGED_NOT_ADOPTED'
        write(ROOT/'report.json',report)
        write(ROOT/'manifest.json',{str(p.relative_to(ROOT)):sha(p) for p in ROOT.rglob('*') if p.is_file()})
        archive=W/'cocolon-analysis-material-v4-aligned78-originals-20261103.zip'
        with zipfile.ZipFile(archive,'x',compression=zipfile.ZIP_DEFLATED) as z:
            for p in sorted(ROOT.rglob('*')):
                if p.is_file():z.write(p,str(p.relative_to(ROOT)))
        body='<meta charset="utf-8"><pre>'+html.escape(json.dumps(report,ensure_ascii=False,indent=2))+'</pre>'
        for phase in ('before','after','reused_before'):
            for p in sorted((ROOT/phase).glob('*.raw.txt')):
                body+='<h2>'+phase+'/'+p.name+'</h2><pre>'+html.escape(p.read_text())+'</pre>'
        body+='<a href="/files/workspace/'+archive.name+'" download>Download originals</a>'
        (W/'material-v4-aligned78-review.html').write_text(body)
        print(json.dumps(dict(status=report['status'],archive=str(archive),bytes=archive.stat().st_size,sha256=sha(archive))))
    assert report['status']=='COMPLETE_PENDING_ALL_RAW_REVIEW_NOT_ADOPTED'


if __name__=='__main__':
    action=sys.argv[1]
    if action=='prepare':
        preexisting=ROOT.exists()
        try:prepare()
        except BaseException:
            if not preexisting and ROOT.exists():
                write(ROOT/'prepare_error.json',dict(status='CPU_PREPARE_FAILED_NO_MODEL',traceback=traceback.format_exc()))
                write(ROOT/'manifest.json',{str(p.relative_to(ROOT)):sha(p) for p in ROOT.rglob('*') if p.is_file()})
                with zipfile.ZipFile(W/'cocolon-analysis-material-v4-aligned78-cpu-partial-20261103.zip','x',compression=zipfile.ZIP_DEFLATED) as z:
                    for p in sorted(ROOT.rglob('*')):
                        if p.is_file():z.write(p,str(p.relative_to(ROOT)))
            raise
    elif action=='run':run()
    elif action in {'before','after','train'}:
        def interrupted(*_):raise TimeoutError('bounded_trial_deadline')
        signal.signal(signal.SIGTERM,interrupted)
        (train_phase(float(sys.argv[2])) if action=='train' else generate_phase(action,float(sys.argv[2])))
    else:raise ValueError(action)
