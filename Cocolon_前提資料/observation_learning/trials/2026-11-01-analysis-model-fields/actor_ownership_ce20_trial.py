"""One bounded v7 ownership CE comparison; old N8 targets stay exact.

prepare/run API NEW_ROOT. New6 x2 plus N8 x1 =20 CE updates;
28 teacher NLL, fresh6 before and12 after =18 new stops/3 model loads.
AP/OP are diagnostic only and never teachers. No normal adoption or retry.
"""
import asyncio
from contextlib import ExitStack
import copy
from dataclasses import asdict, replace
import gc
import hashlib
import importlib.util
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
from uuid import UUID
import zipfile

MODE, api_arg, root_arg = sys.argv[1:4]
API, ROOT = Path(api_arg), Path(root_arg)
COMMIT='4d744e36a093aac3ad157a448f06ef6be2be59cb'
INITIAL=Path('/workspace/analysis-material-v4-pair8-20261103/train/adapter')
OLD=Path('/workspace/analysis-material-v4-pair8-20261103/pack.json')
OLD_SHA='30afde6a0735aac0b5f23e737b2b80c72e7dd65ba0cdbe4bc791886473f4bbf1'
PRIOR=Path('/workspace/analysis-actor-ownership-20261105/live.json')
WEIGHTS='a2e62bca49ccccc5eb1d91254cd7f536d2cae0329ef7f80e5ee37208d335eb59'
CONFIG='006ebf7bef859264b3778126f4a0f6512e1b2a7e6049b09dfcf0d56603ede3a9'
PROFILE='selected_material.v7'
LIMIT=900
sys.dont_write_bytecode=True
os.environ['HF_HUB_OFFLINE']='1';os.environ['TRANSFORMERS_OFFLINE']='1'
sys.path[:0]=[str(API/'ai/services/ai_inference'),str(API/'ai/services'),str(API/'ai/tools')]
import analysis_cumulative_service as service
from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as admission
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
canonical=admission.canonical
SEAM=Path('/workspace/actor_ownership_trial.py')
SEAM_SHA='dfb10128d30420f1023b653d8f43141b3252b735b9acc52ffba83af343c3cfa7'
assert sha(SEAM)==SEAM_SHA
spec=importlib.util.spec_from_file_location('ownership_seam',str(SEAM))
seam=importlib.util.module_from_spec(spec);spec.loader.exec_module(seam)
seam.root=ROOT;seam.api=API


def write(path,value):
    path=Path(path);tmp=path.with_suffix(path.suffix+'.tmp')
    tmp.write_text(canonical(value));tmp.replace(path)


def check_api():
    assert subprocess.check_output(['git','-C',str(API),'rev-parse','HEAD'],text=True).strip()==COMMIT
    assert not subprocess.check_output(['git','-C',str(API),'status','--porcelain','--untracked-files=no'],text=True).strip()


def guard_saved():
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as c
    from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as a
    stack=ExitStack()
    for obj,name in [(MeaningExperienceEngine,'generate'),(c,'compile_observed_graph'),
        (c,'compile_analysis_unit_candidates'),(a,'realize_analysis_unit_candidates')]:
        stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved generation')))
    return stack


def make_snapshot(template,owner,text,index,tier=None):
    snap=copy.deepcopy(template)
    if tier is not None:snap['tier']=tier
    snap['members']=snap['members'][:1]
    m=snap['members'][0];m.update(thread=None,events=[])
    m['original'].update(id=str(UUID(int=index)),memo=text,memo_action='',category=['生活'],emotions=['平穏'],emotion_details=[])
    snap['guard']='analysis-db-cumulative-v1:'+admission.digest([owner,snap['members']])
    return snap


def target(text,actor,target_text=None,negative=None):
    qualifiers=[] if actor is None else [dict(kind='EXPLICIT_ACTOR',quote=actor)]
    if negative is not None:qualifiers.append(dict(kind='NEGATION',quote=negative))
    units=[dict(quote=text,node_kind='ACTION_OR_NONACTION',parent_quote=None,scope_role=None,qualifiers=qualifiers)]
    if target_text is not None:units.append(dict(quote=target_text,node_kind=None,parent_quote=text,scope_role='CONTENT_TARGET',qualifiers=[]))
    return canonical(dict(fields=[dict(field=1,units=units)]))


def prepare():
    check_api();assert not ROOT.exists(),'do_not_restart_or_replace_partial_root'
    assert sha(OLD)==OLD_SHA and sha(INITIAL/'adapter_model.safetensors')==WEIGHTS and sha(INITIAL/'adapter_config.json')==CONFIG
    from serve_emlis_natural_reply import MODEL,REVISION,PINS
    from transformers import AutoTokenizer
    assert {n:version(n) for n in PINS}==PINS
    prior=json.loads(PRIOR.read_text());assert prior['status']=='COMPLETE'
    assert prior['weights_sha256']==WEIGHTS and prior['config_sha256']==CONFIG and prior['initial_unchanged']
    assert prior['model']==MODEL and prior['revision']==REVISION and prior['pins']==PINS
    old=json.loads(OLD.read_text());keys=('id','owner','snapshot','assistant_target')
    originals=[r for r in old['teachers'] if r['id'] in {f'N{i:02}' for i in range(1,9)}]
    assert len(originals)==8
    teachers=[{k:copy.deepcopy(r[k]) for k in keys} for r in originals]
    specs=[('OT01','昼食を作った',None,'昼食',None),
        ('OT02','写真を見なかった',None,'写真','なかった'),
        ('OT03','僕の住所を記録した',None,'僕の住所',None),
        ('OT04','私は妹の住所を記録した','私','妹の住所',None),
        ('OT05','妹は僕の住所を記録した','妹','僕の住所',None),
        ('OT06','僕は僕の住所を記録した','僕は','僕の住所',None)]
    for i,(key,text,actor,object_text,negative) in enumerate(specs,1):
        owner=teachers[0]['owner'];snap=make_snapshot(teachers[0]['snapshot'],owner,text+'。',15100+i)
        teachers.append(dict(id=key,owner=owner,snapshot=snap,
            assistant_target=target(text,actor,object_text,negative)))
    # Diagnostic sources and prompt illustrations are excluded from training.
    teaching_texts={m['original']['memo'] for r in teachers for m in r['snapshot']['members']}
    for case in prior['cases']:
        assert all(m['original']['memo'] not in teaching_texts for m in case['row']['snapshot']['members'])
    for phrase in ('私のノートを見た。','私は同僚のノートを見た。','同僚は私のノートを見た。','記録を残さなかった。'):
        assert phrase not in teaching_texts
    ROOT.mkdir();shutil.copyfile(OLD,ROOT/'original_pack.json');shutil.copyfile(__file__,ROOT/'runner.py')
    shutil.copyfile(SEAM,ROOT/'ownership_seam.py')
    tokenizer=AutoTokenizer.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
    encoded={};audits=[]
    for row in teachers:
        p=service.prepare_cumulative_category_units(row['owner'],row['snapshot'],prompt_version=PROFILE)
        messages=p.messages();prompt=tokenizer.apply_chat_template(messages,enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
        full=tokenizer.apply_chat_template(messages+[dict(role='assistant',content=row['assistant_target'])],enable_thinking=False,add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
        assert len(prompt)+2048<=8192 and full[:len(prompt)]==prompt and len(prompt)<len(full)<=8192
        assert tokenizer.decode(full[len(prompt):],skip_special_tokens=False,clean_up_tokenization_spaces=False)==row['assistant_target']+'<|im_end|>\n'
        response=admission.AnalysisModelQuotedParentUnitsResponse(p.request_ref,admission.digest(messages),hashlib.sha256(row['assistant_target'].encode()).hexdigest(),'stop',row['assistant_target'])
        bound=replace(p,response=response);a,c=service.build_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=bound)
        raw=service.serialize_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=bound,artifact=a,coverage=c)
        with guard_saved():assert service.reload_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],raw)==(a,c)
        (ROOT/(row['id']+'.teacher.candidate.json')).write_text(raw)
        row.update(messages=messages,request_ref=p.request_ref)
        encoded[row['id']]=dict(input_ids=full,labels=[-100]*len(prompt)+full[len(prompt):],loss_start=len(prompt)-1,logits_positions=len(full)-len(prompt)+1)
        audits.append(dict(id=row['id'],prompt_tokens=len(prompt),target_tokens=len(full)-len(prompt),candidate_replay=True))
    assert [{k:r[k] for k in keys} for r in teachers[:8]]==[{k:r[k] for k in keys} for r in originals]
    template=prior['cases'][0]['row'];owner=template['owner']
    fresh=['僕の感想を書いた。','私の本を見なかった。','私は私の本を見た。',
        '父は僕の本を見た。','道具を作らなかった。','僕の担当は案内係だった。']
    evaluation=[dict(id=f'AE{i:02}',owner=owner,snapshot=make_snapshot(template['snapshot'],owner,text,16100+i,tier='free'),prompt_version=PROFILE,provenance='independent synthetic nearby transfer; no target; not blind') for i,text in enumerate(fresh,1)]
    reused=[copy.deepcopy(c) for c in prior['cases'] if c['row']['id'] in {'AP07_v7','AP08_v7','OP02_v7','OP03_v7','OP07_v7','OP08_v7'}]
    assert len(reused)==6
    evaluation += [c['row'] for c in reused]
    expected=[]
    for row in evaluation:
        _,item=seam.prepare_row(row)
        count=len(tokenizer.apply_chat_template(item['messages'],enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False))
        assert count+2048<=8192
        item.update(input_tokens=count,reserved_new_tokens=2048,max_context_tokens=8192);expected.append(item)
        assert all(m['original']['memo'] not in teaching_texts for m in row['snapshot']['members'])
    by_id={x['id']:x for x in expected}
    for c in reused:
        e=by_id[c['row']['id']];assert e['request_ref']==c['request']['request_ref'] and e['messages']==c['request']['messages']
        assert c['response']['finish_reason']=='stop' and c['response']['messages_sha256']==e['messages_sha256'] and hashlib.sha256(c['response']['raw'].encode()).hexdigest()==c['response']['raw_sha256']
    order=[x[0] for x in specs]*2+[f'N{i:02}' for i in range(1,9)]
    assert len(teachers)==14 and len(encoded)==14 and len(order)==20
    plan=dict(status='CPU_PREPARED_NO_MODEL',teachers=teachers,evaluation=evaluation,expected=expected,seed=20261111,learning_rate=1e-5,update_order=order,max_seconds=LIMIT,profile=PROFILE,initial_weights_sha256=WEIGHTS,initial_config_sha256=CONFIG,original_pack_sha256=OLD_SHA,new_calls=18,model_loads=3,normal_adoption=False,next_training_initial_adoption=False)
    write(ROOT/'pack.json',plan);write(ROOT/'encoded.json',encoded);write(ROOT/'teacher_audit.json',audits);write(ROOT/'reused_before.json',reused)
    write(ROOT/'cpu_manifest.json',{str(p.relative_to(ROOT)):sha(p) for p in ROOT.rglob('*') if p.is_file()})
    print(canonical(dict(status=plan['status'],teachers=14,old_teachers_exact=8,new_teachers=6,updates=20,nll=28,new_calls=18,model_loads=3,pack_sha256=sha(ROOT/'pack.json'))))


def generate_phase(phase,deadline):
    from serve_emlis_natural_reply import load_generator,MODEL,REVISION,PINS
    assert {n:version(n) for n in PINS}==PINS
    pack=json.loads((ROOT/'pack.json').read_text());rows=pack['evaluation'][:6] if phase=='before' else pack['evaluation']
    adapter=INITIAL if phase=='before' else ROOT/'train/adapter'
    expected=dict(weights_sha256=WEIGHTS,config_sha256=CONFIG) if phase=='before' else json.loads((ROOT/'train/report.json').read_text())
    if phase=='after':assert expected['status']=='COMPLETE_NOT_ADOPTED'
    assert sha(adapter/'adapter_model.safetensors')==expected['weights_sha256'] and sha(adapter/'adapter_config.json')==expected['config_sha256']
    report=dict(status='STARTED',cases=[],new_generation=0,model_calls_started=0,model_loads=1,normal_adoption=False,phase=phase,weights_sha256=expected['weights_sha256'],config_sha256=expected['config_sha256'])
    write(ROOT/(phase+'.json'),report);generator=load_generator(str(adapter),threading.Event(),weights_sha256=expected['weights_sha256'],config_sha256=expected['config_sha256'])
    seam.mode=phase
    for row in rows:
        e=next(x for x in pack['expected'] if x['id']==row['id'])
        case=asyncio.run(seam.one(row,e,report=report,generator=generator,deadline=deadline))
        assert case['response']['finish_reason']=='stop'
        report['cases'].append(case);write(ROOT/(phase+'.json'),report)
    report['status']='COMPLETE_NOT_ADOPTED';write(ROOT/(phase+'.json'),report)


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
        assert report['updates']==20 and report['measurement_forwards']==28
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
    check_api();assert sha(OLD)==OLD_SHA and sha(INITIAL/'adapter_model.safetensors')==WEIGHTS and sha(INITIAL/'adapter_config.json')==CONFIG
    manifest=json.loads((ROOT/'cpu_manifest.json').read_text());assert all(sha(ROOT/n)==h for n,h in manifest.items())
    with (ROOT/'run_started.json').open('x') as f:json.dump(dict(started=time.time(),max_seconds=LIMIT),f)
    assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True).strip()
    start=time.monotonic();deadline=start+LIMIT;report=dict(status='STARTED',stages=[],api_commit=COMMIT,normal_adoption=False,new_training_initial_adoption=False)
    shutil.copyfile(__file__,ROOT/'execution_runner.py')
    try:
        for phase in ('before','train','after'):
            remaining=int(deadline-time.monotonic())-10;assert remaining>0
            with (ROOT/(phase+'.log')).open('x') as log:
                r=subprocess.run(['timeout','--signal=TERM','--kill-after=10',str(remaining),sys.executable,str(ROOT/'execution_runner.py'),phase,str(API),str(ROOT),str(deadline)],stdout=log,stderr=subprocess.STDOUT)
            report['stages'].append(dict(phase=phase,exit=r.returncode));write(ROOT/'report.json',report)
            assert r.returncode==0,phase
        assert sha(OLD)==OLD_SHA and sha(INITIAL/'adapter_model.safetensors')==WEIGHTS and sha(INITIAL/'adapter_config.json')==CONFIG
        report['status']='COMPLETE_PENDING_ALL_RAW_REVIEW_NOT_ADOPTED'
    except BaseException as exc:
        report.update(status='FAILED_NO_RETRY_NOT_ADOPTED',error=type(exc).__name__,traceback=traceback.format_exc());raise
    finally:
        report.update(seconds=time.monotonic()-start,initial_unchanged=sha(INITIAL/'adapter_model.safetensors')==WEIGHTS and sha(INITIAL/'adapter_config.json')==CONFIG,old_pack_unchanged=sha(OLD)==OLD_SHA,gpu_after_process=subprocess.check_output(['nvidia-smi','--query-gpu=memory.used,utilization.gpu','--format=csv,noheader'],text=True).strip())
        if not report['initial_unchanged'] or not report['old_pack_unchanged']:
            report['status']='FAILED_FINAL_LINEAGE_CHANGED_NOT_ADOPTED'
        write(ROOT/'report.json',report)
        write(ROOT/'manifest.json',{str(p.relative_to(ROOT)):sha(p) for p in ROOT.rglob('*') if p.is_file()})
        archive=ROOT.with_suffix('.zip')
        with zipfile.ZipFile(archive,'x',compression=zipfile.ZIP_DEFLATED) as z:
            for p in sorted(ROOT.rglob('*')):
                if p.is_file():z.write(p,str(p.relative_to(ROOT)))
        print(canonical(report))


if __name__=='__main__':
    if MODE in ('before','train','after'):
        def terminated(*_):raise TimeoutError('bounded_child_terminated')
        signal.signal(signal.SIGTERM,terminated)
    if MODE=='prepare':prepare()
    elif MODE=='run':run()
    elif MODE=='train':train_phase(float(sys.argv[4]))
    elif MODE in ('before','after'):generate_phase(MODE,float(sys.argv[4]))
    else:raise ValueError('unknown stage')
