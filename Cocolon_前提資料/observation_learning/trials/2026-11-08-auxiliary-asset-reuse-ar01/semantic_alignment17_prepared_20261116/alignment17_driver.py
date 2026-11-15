"""Single-use synthetic Analysis alignment, existing CE and native decoder.

Modes run in separate child processes: tokenizer preflight, original-adapter
baseline, fresh-optimizer training, saved-candidate inference. No network,
credentials, retry, adoption or production writes are implemented here.
"""
import argparse
from collections import Counter
import gc
import hashlib
from importlib.metadata import version
import json
import math
import os
from pathlib import Path
import random
import runpy
import signal
import sys
import threading
import time

sys.dont_write_bytecode=True
os.environ['HF_HUB_OFFLINE']='1'
os.environ['TRANSFORMERS_OFFLINE']='1'
PINS={'transformers':'5.19.0','peft':'0.21.2','accelerate':'1.15.0','safetensors':'0.8.0'}
CORE_SHA='b489a2204dfe53aa0de30e3573d707af877c9eef62d410c710e706fafdcd80fa'
NATIVE_SHA='7ae06f31b4db9f8b705dddf67e098a8338c94765c78fc3d5d02194eb89eee562'
OLD_ACTUAL_SHA='e49505fbfec6cd97bba6510d11ab2f5c8761d699640251ab30add62c656eaabb'
MODEL='cocolon-qwen3.5-4b-analysis-alignment17-candidate'
ORIGINAL_MODEL='cocolon-qwen3.5-4b-analysis-semantic-120u'

def digest(data):return hashlib.sha256(data).hexdigest()
def file_sha(path):return digest(Path(path).read_bytes())
def canonical(value):return json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False)
def id_hash(values):return digest(json.dumps(values,separators=(',',':')).encode())
def write_once(path,value):
    with Path(path).open('x',encoding='utf-8') as f:f.write(canonical(value)+'\n')

def current_owners(root):
    sys.path.insert(0,str(root/'ai/services/ai_inference'))
    import analysis_semantic_map as app
    from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as core
    assert file_sha(core.__file__)==CORE_SHA
    return app,core

def prepared_row(row,app,core):
    parent=app.prepare_semantic_map(row['owner'],row['snapshot'])
    if row['kind']=='ORDINARY':prepared=parent
    elif row['kind']=='LEAF':
        material=json.loads(row['messages'][1]['content'])
        indices=material['history_stage']['records']
        prepared=core.prepare_semantic_leaf(parent,tuple(row['snapshot']['members'][i-1]['original']['id'] for i in indices))
    else:
        # Reconstruct the deterministic teaching MERGE from its bound original
        # leaf targets. This is curriculum metadata, never an acquired receipt.
        from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse
        leaves=[]
        for leaf in row['_curriculum_leaves']:
            stage=prepared_row(leaf,app,core)
            raw=leaf['assistant_target']
            response=AnalysisModelQuotedParentUnitsResponse(stage.request_ref,core.semantic_map_hash(stage.messages()),digest(raw.encode()),'stop',raw)
            leaves.append((stage,response))
        prepared=core.prepare_semantic_merge(parent,tuple(leaves))
    assert prepared.request_ref==row['request_ref']
    assert prepared.messages()==row['messages']
    assert core.semantic_map_hash(prepared.messages())==row['messages_sha256']
    return prepared

def attach_teaching_leaves(pack):
    rows=pack['teachers']
    for row in rows:
        if row['kind']=='MERGE':
            row['_curriculum_leaves']=[x for x in rows if x['source_id']==row['source_id'] and x['kind']=='LEAF']
            assert len(row['_curriculum_leaves'])==2

def load_old_rows(path,app,core):
    assert file_sha(path)==OLD_ACTUAL_SHA
    old=json.loads(path.read_text())
    assert old['new_model_calls']==2 and all(c['state']=='GENERATED' for c in old['conditions'])
    result=[]
    for c in old['conditions']:
        row=dict(id=c['name'],owner=c['material']['owner'],snapshot=c['material']['snapshot'],kind='ORDINARY',
            request_ref=c['request_ref'],messages=c['messages'],messages_sha256=c['messages_sha256'],input_tokens=c['input_tokens'])
        prepared_row(row,app,core);result.append(row)
    return result

def validate_pack(args,pack,root):
    assert pack['status']=='ROOT_AUTHORED_SYNTHETIC_SEMANTIC_MAP_ALIGNMENT_NOT_MASH_TEACHER_OR_PRODUCT_ACCEPTANCE'
    assert pack['source_core_sha256']==CORE_SHA and pack['initial_updates']==120
    assert (len(pack['teachers']),len(pack['heldouts']),pack['max_updates'])==(17,2,34)
    assert Counter(pack['update_order'])==Counter({t['id']:2 for t in pack['teachers']})
    assert len({t['id'] for t in pack['teachers']+pack['heldouts']})==19
    assert all('assistant_target' not in h and h['kind']=='ORDINARY' for h in pack['heldouts'])
    assert pack['model']=='Qwen/Qwen3.5-4B' and pack['revision']=='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a'
    assert (pack['max_training_tokens'],pack['max_new_tokens'],pack['context_tokens'],pack['max_evaluation_generations'])==(8192,4096,32768,7)
    assert (pack['learning_rate'],pack['weight_decay'],pack['gradient_clip'])==(5e-5,0,1.)
    assert {name:version(name) for name in PINS}==PINS
    initial=Path(pack['initial_adapter']['path'])
    assert file_sha(initial/'adapter_model.safetensors')==pack['initial_adapter']['weights_sha256']
    assert file_sha(initial/'adapter_config.json')==pack['initial_adapter']['config_sha256']
    assert file_sha(args.native)==NATIVE_SHA
    app,core=current_owners(root);attach_teaching_leaves(pack)
    from transformers import AutoTokenizer
    tokenizer=AutoTokenizer.from_pretrained(pack['model'],revision=pack['revision'],local_files_only=True,trust_remote_code=False)
    encoded={};counts={}
    for row in pack['teachers']+pack['heldouts']:
        prepared_row(row,app,core)
        prompt=tokenizer.apply_chat_template(row['messages'],enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
        assert len(prompt)==row['input_tokens'] and id_hash(prompt)==row['input_ids_sha256']
        assert len(prompt)+4096<=32768
        counts[row['id']]=dict(prompt=len(prompt))
        if 'assistant_target' in row:
            full=tokenizer.apply_chat_template(row['messages']+[dict(role='assistant',content=row['assistant_target'])],
                enable_thinking=False,add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
            assert full[:len(prompt)]==prompt and len(prompt)<len(full)<=8192
            assert len(full)==row['training_tokens'] and id_hash(full)==row['full_ids_sha256']
            assert tokenizer.decode(full[len(prompt):],skip_special_tokens=False,clean_up_tokenization_spaces=False)==row['assistant_target']+'<|im_end|>\n'
            assert (row['loss_start'],row['logits_positions'])==(len(prompt)-1,len(full)-len(prompt)+1)
            encoded[row['id']]=dict(input_ids=full,labels=[-100]*len(prompt)+full[len(prompt):],
                loss_start=row['loss_start'],logits_positions=row['logits_positions'])
            counts[row['id']].update(target=len(full)-len(prompt),total=len(full))
    old=load_old_rows(root/'A3.actual.result.json',app,core)
    for row in old:
        tokens=tokenizer.apply_chat_template(row['messages'],enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
        assert len(tokens)==row['input_tokens'] and len(tokens)+4096<=32768
    return app,core,encoded,counts,old

def train(args,pack,root,encoded,counts,started,deadline):
    import torch
    import torch.nn.functional as F
    from transformers import Qwen3_5ForConditionalGeneration
    from peft import PeftModel,get_peft_model_state_dict
    from safetensors.torch import load_file
    out=root/'fit';out.mkdir()
    report=dict(state='TRAINING_STARTED_NOT_ADOPTED',initial_updates=120,optimizer='FRESH_ADAMW_NOT_EXACT_RESUME',
        plan_sha256=args.plan_sha256,driver_sha256=file_sha(__file__),updates_completed=0,steps=[],measurements=[],token_counts=counts,
        model_adopted=False,training_seconds=0,optimizer_and_rng_saved=False)
    def save():
        report['process_seconds']=time.monotonic()-started
        (out/'report.json').write_text(canonical(report)+'\n')
    model=optimizer=trainable=None;save()
    try:
        assert torch.cuda.is_available() and torch.cuda.device_count()==1
        report.update(torch=torch.__version__,gpu=torch.cuda.get_device_name(0))
        random.seed(20261107);torch.manual_seed(20261107);torch.cuda.manual_seed_all(20261107)
        a=(torch.arange(12*19,dtype=torch.float64).reshape(1,12,19)/100).requires_grad_(True)
        b=a.detach().clone().requires_grad_(True)
        labs=torch.arange(12).reshape(1,12)%19;labs[:,:7]=-100
        whole=F.cross_entropy(a[:,:-1,:].reshape(-1,19),labs[:,1:].reshape(-1),ignore_index=-100)
        tail=F.cross_entropy(b[:,-6:,:][:,:-1,:].reshape(-1,19),labs[:,7:].reshape(-1),ignore_index=-100)
        whole.backward();tail.backward();assert torch.allclose(whole,tail) and torch.equal(a.grad,b.grad)
        del a,b,labs,whole,tail
        report['ce_window']='FULL_AND_TAIL_LOSS_AND_GRADIENTS_MATCH_EOS_INCLUDED';save()
        model=Qwen3_5ForConditionalGeneration.from_pretrained(pack['model'],revision=pack['revision'],dtype=torch.bfloat16,
            device_map={'':0},attn_implementation='sdpa',local_files_only=True,trust_remote_code=False)
        model=PeftModel.from_pretrained(model,pack['initial_adapter']['path'],is_trainable=True,local_files_only=True)
        trainable=[(n,p) for n,p in model.named_parameters() if p.requires_grad]
        assert len(trainable)==112 and sum(p.numel() for _,p in trainable)==3833856
        initial=load_file(Path(pack['initial_adapter']['path'])/'adapter_model.safetensors');actual=get_peft_model_state_dict(model)
        assert len(initial)==len(actual)==112 and all(torch.equal(initial[k],actual[k].detach().cpu()) for k in initial)
        del initial,actual
        model.config.use_cache=False
        model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={'use_reentrant':False})
        model.enable_input_require_grads();torch.cuda.reset_peak_memory_stats()
        def loss_for(item):
            input_ids=torch.tensor([item['input_ids']],dtype=torch.long,device='cuda:0')
            labels=torch.tensor([item['labels']],dtype=torch.long,device='cuda:0')
            return model(input_ids=input_ids,attention_mask=torch.ones_like(input_ids),labels=labels[:,item['loss_start']:],
                logits_to_keep=item['logits_positions'],use_cache=False).loss
        def measure(phase):
            model.eval();values={}
            with torch.no_grad():
                for key,item in encoded.items():
                    value=loss_for(item);assert torch.isfinite(value);values[key]=float(value)
            report['measurements'].append(dict(phase=phase,losses=values));save()
        def preserve(target):
            model.save_pretrained(target,safe_serialization=True)
            weights=load_file(target/'adapter_model.safetensors');current=get_peft_model_state_dict(model)
            assert len(weights)==len(current)==112 and all(torch.equal(weights[k],current[k].detach().cpu()) and torch.isfinite(weights[k]).all() for k in weights)
            return dict(path=str(target),updates=report['updates_completed'],weights_sha256=file_sha(target/'adapter_model.safetensors'),config_sha256=file_sha(target/'adapter_config.json'))
        measure('before_updates');model.train()
        optimizer=torch.optim.AdamW([p for _,p in trainable],lr=5e-5,weight_decay=0.)
        training_start=time.monotonic()
        training_deadline=min(training_start+600,deadline-30)
        signal.setitimer(signal.ITIMER_REAL,max(.001,training_deadline-time.monotonic()))
        for step,key in enumerate(pack['update_order'],1):
            if time.monotonic()>=training_deadline:raise TimeoutError('alignment_training_budget_exceeded')
            report['active_step']=step;save()
            optimizer.zero_grad(set_to_none=True);loss=loss_for(encoded[key]);assert torch.isfinite(loss);loss.backward()
            assert all(p.grad is None or torch.isfinite(p.grad).all() for _,p in trainable)
            norm=torch.nn.utils.clip_grad_norm_([p for _,p in trainable],1.);assert torch.isfinite(norm);optimizer.step()
            report['updates_completed']=step
            report['training_seconds']=time.monotonic()-training_start
            report['steps'].append(dict(step=step,teacher=key,loss=float(loss.detach()),gradient_norm=float(norm)));save()
            report['active_step']=None
            if time.monotonic()>=training_deadline:raise TimeoutError('alignment_training_budget_exceeded_after_update')
            if step%8==0:report.setdefault('checkpoints',[]).append(preserve(out/('checkpoint_'+str(step))));save()
        if time.monotonic()>=training_deadline:raise TimeoutError('alignment_training_budget_exceeded_before_completion')
        signal.setitimer(signal.ITIMER_REAL,max(.001,deadline-time.monotonic()))
        optimizer.zero_grad(set_to_none=True);optimizer=None;measure('after_updates')
        report['candidate']=preserve(out/'adapter')
        assert report['updates_completed']==34 and file_sha(Path(pack['initial_adapter']['path'])/'adapter_model.safetensors')==pack['initial_adapter']['weights_sha256']
        report.update(state='TRAINING_COMPLETE_NOT_ADOPTED',peak_allocated_gib=torch.cuda.max_memory_allocated()/2**30,
            peak_reserved_gib=torch.cuda.max_memory_reserved()/2**30)
    except BaseException as exc:
        report.update(state='TRAINING_FAILED_NOT_ADOPTED',error_type=type(exc).__name__);raise
    finally:
        model=optimizer=trainable=None;gc.collect();save()

def acquire(args,pack,root,app,core,old,started,deadline):
    native=runpy.run_path(str(args.native))
    baseline=args.mode=='baseline'
    report=dict(state='ACQUISITION_STARTED_NOT_ADOPTED',phase=args.mode,plan_sha256=args.plan_sha256,native_sha256=file_sha(args.native),
        model=ORIGINAL_MODEL if baseline else MODEL,calls=[],new_model_calls=0,generation_seconds=0,retry=0,training=0,
        transport='DIRECT_CURRENT_NATIVE_NOT_HTTP_OR_PRODUCTION',analysis_adapter_enabled=True)
    output=root/(args.mode+'.result.json')
    assert not output.exists()
    def save():
        report['process_seconds']=time.monotonic()-started
        output.write_text(canonical(report)+'\n')
    save();generator=None
    try:
        if baseline:
            adapter=pack['initial_adapter'];rows=pack['heldouts'];budget=900.
        else:
            training=json.loads((root/'fit/report.json').read_text())
            before=json.loads((root/'baseline.result.json').read_text())
            assert training['state']=='TRAINING_COMPLETE_NOT_ADOPTED' and training['updates_completed']==34
            assert before['new_model_calls']==2 and before['state']=='COMPLETE_NOT_ADOPTED_PENDING_MEANING_REVIEW'
            assert training['plan_sha256']==before['plan_sha256']==args.plan_sha256
            adapter=training['candidate'];rows=old+pack['heldouts']+[pack['teachers'][0]]
            assert len(rows)==5 and rows[-1]['id']=='T01_manual10'
            budget=900.-before['generation_seconds']
        for name,key in [('adapter_model.safetensors','weights_sha256'),('adapter_config.json','config_sha256')]:
            assert file_sha(Path(adapter['path'])/name)==adapter[key]
        report['adapter']={k:adapter[k] for k in ('path','weights_sha256','config_sha256')}
        save()
        generator=native['load_generator'](adapter['path'],threading.Event(),weights_sha256=adapter['weights_sha256'],
            config_sha256=adapter['config_sha256'],max_new_tokens=4096,context_tokens=32768,semantic_json=True)
        report['nontraining_saved_reload']='VERIFIED_112_TENSORS_BY_CURRENT_NATIVE';save()
        for row in rows:
            remaining=min(budget-report['generation_seconds'],deadline-time.monotonic()-10)
            if remaining<=1:raise TimeoutError('alignment_acquisition_budget_exceeded')
            assert report['new_model_calls']<(2 if baseline else 5)
            prepared=prepared_row(row,app,core)
            call=dict(id=row['id'],request_ref=prepared.request_ref,messages=row['messages'],messages_sha256=row['messages_sha256'],state='STARTED')
            report['calls'].append(call);report['new_model_calls']+=1;save()
            begin=time.monotonic()
            raw,finish=generator(row['messages'],min(deadline-10,begin+210,begin+remaining))
            elapsed=time.monotonic()-begin;report['generation_seconds']+=elapsed
            call.update(state='RECEIVED',raw=raw,finish_reason=finish,raw_sha256=digest(raw.encode()),seconds=elapsed)
            save()
            if finish!='stop':
                call.update(admission='NOT_GENERATED',failure_code='NON_STOP_RESPONSE');save();continue
            from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse
            response=AnalysisModelQuotedParentUnitsResponse(prepared.request_ref,core.semantic_map_hash(prepared.messages()),digest(raw.encode()),finish,raw)
            try:
                artifact,coverage=app.build_semantic_map(prepared,response)
                call.update(admission='GENERATED',coverage=coverage,projection=artifact.safe_projection(authenticated_owner_scope=row['owner']),
                    text=artifact.safe_text_projection(authenticated_owner_scope=row['owner'])['text'],private_evidence=artifact.private_evidence())
            except app.SemanticMapError as exc:
                call.update(admission='NOT_GENERATED',failure_code=str(exc))
            save()
        assert report['new_model_calls']==len(rows)
        report['state']='COMPLETE_NOT_ADOPTED_PENDING_MEANING_REVIEW'
    except BaseException as exc:
        report.update(state='INCOMPLETE_NOT_ADOPTED',error_type=type(exc).__name__);raise
    finally:
        generator=None;gc.collect();save()

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--mode',choices=['preflight','baseline','train','after'],required=True)
    parser.add_argument('--plan',type=Path,required=True);parser.add_argument('--plan-sha256',required=True)
    parser.add_argument('--native',type=Path,required=True)
    parser.add_argument('--process-seconds',type=float,required=True)
    args=parser.parse_args();root=args.plan.resolve().parent
    assert file_sha(args.plan)==args.plan_sha256 and 1<=args.process_seconds<=1620
    pack=json.loads(args.plan.read_text());started=time.monotonic();deadline=started+args.process_seconds
    def expired(*unused):raise TimeoutError('alignment_child_deadline_exceeded')
    signal.signal(signal.SIGALRM,expired);signal.signal(signal.SIGTERM,expired)
    signal.setitimer(signal.ITIMER_REAL,args.process_seconds)
    try:
        app,core,encoded,counts,old=validate_pack(args,pack,root)
        if args.mode=='preflight':
            write_once(root/'preflight.json',dict(state='PREFLIGHT_PASS_NOT_MODEL_QUALITY',plan_sha256=args.plan_sha256,
                counts=counts,native_sha256=file_sha(args.native),core_sha256=CORE_SHA,new_model_calls=0,training=0))
        elif args.mode=='train':train(args,pack,root,encoded,counts,started,deadline)
        else:acquire(args,pack,root,app,core,old,started,deadline)
    finally:signal.setitimer(signal.ITIMER_REAL,0)

if __name__=='__main__':main()
