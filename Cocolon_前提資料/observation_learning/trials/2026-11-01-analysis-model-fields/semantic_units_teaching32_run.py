"""Isolated Analysis continuation: saved Analysis LoRA, 64 updates, development and rehearsal.

Root-authored synthetic teaching, not Mash teaching or product acceptance.
Only the prior isolated Analysis adapter is loaded; all prior files remain unchanged.
"""
import argparse
from dataclasses import asdict, replace
import gc
import hashlib
import importlib.util
from importlib.metadata import version
import json
import math
import os
from pathlib import Path
import random
import signal
import sys
import threading
import time
import traceback
from unittest.mock import patch

sys.dont_write_bytecode=True
os.environ['HF_HUB_OFFLINE']='1'
os.environ['TRANSFORMERS_OFFLINE']='1'


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--api-root',required=True,type=Path)
    parser.add_argument('--plan',required=True,type=Path)
    parser.add_argument('--plan-sha256',required=True)
    parser.add_argument('--initial-dir',required=True,type=Path)
    parser.add_argument('--adaptive-loss',required=True,type=Path)
    parser.add_argument('--prior-results',required=True,type=Path)
    parser.add_argument('--out',required=True,type=Path)
    args=parser.parse_args()
    assert not args.out.exists() and sha(args.plan)==args.plan_sha256
    pack=json.loads(args.plan.read_text());plan=pack['plan']
    assert pack['status']=='ROOT_AUTHORED_SYNTHETIC_ANALYSIS_PROTOCOL_TEACHING_NOT_MASH_TEACHER_OR_FROZEN_ACCEPTANCE'
    assert len(pack['teachers'])==32 and len(pack['evaluation'])==12
    assert (plan['max_updates'],plan['max_seconds'],plan['max_new_generations'])==(64,900,12)
    assert sha(args.initial_dir/'adapter_config.json')==plan['initial_config_sha256']
    assert sha(args.initial_dir/'adapter_model.safetensors')==plan['initial_weights_sha256']
    assert sha(args.adaptive_loss)==plan['adaptive_loss_sha256']
    initial_hashes={n:sha(args.initial_dir/n) for n in ('adapter_config.json','adapter_model.safetensors')}
    for path,expected in pack['api_source_blobs'].items():
        b=(args.api_root/path).read_bytes()
        assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==expected
    args.out.mkdir()
    def save(name,value):
        p=args.out/name;tmp=p.with_suffix(p.suffix+'.tmp')
        tmp.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n');tmp.replace(p)
    report=dict(status='STARTED',plan_sha256=args.plan_sha256,runner_sha256=sha(__file__),
        plan=plan,updates_started=0,updates_completed=0,training_forwards=0,
        measurement_forwards=0,model_loads=0,new_calls=0,calls=[],steps=[],measurements=[],
        training_initial='PRIOR_ISOLATED_ANALYSIS_TEACHING16_ADAPTER_NEW_OUTPUT_ONLY',
        initial_hashes=initial_hashes,training_objective=plan['training_objective'],
        measurement_objective=plan['measurement_objective'],
        model_adopted=False,retry=False,product_credit=0)
    start=time.monotonic();deadline=start+900
    def checkpoint():
        report['process_seconds']=time.monotonic()-start;save('report.json',report)
    def expired(*_):
        raise TimeoutError('analysis_teaching_deadline')
    signal.signal(signal.SIGTERM,expired);signal.signal(signal.SIGALRM,expired)
    signal.setitimer(signal.ITIMER_REAL,900);checkpoint()
    model=generator=optimizer=None
    try:
        sys.path[:0]=[str(args.api_root/'ai/tools'),str(args.api_root/'ai/services/ai_inference')]
        from serve_emlis_natural_reply import load_generator,MODEL,REVISION,PINS
        from cocolon_meaning_experience_engine import MeaningExperienceEngine
        from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
            AnalysisModelUnitsResponse,AnalysisSemanticError,canonical)
        from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
        import analysis_cumulative_service as service
        import torch
        import torch.nn.functional as F
        from transformers import AutoTokenizer,Qwen3_5ForConditionalGeneration
        from peft import PeftModel,get_peft_model_state_dict
        from safetensors.torch import load_file
        assert {n:version(n) for n in PINS}==PINS
        assert (MODEL,REVISION)==(plan['model'],plan['revision'])
        spec=importlib.util.spec_from_file_location('existing_adaptive_loss',args.adaptive_loss)
        adaptive=importlib.util.module_from_spec(spec);spec.loader.exec_module(adaptive)
        # Compare the same all-target objective with a full masked prompt and
        # with the P-1 suffix. Both include EOS/newline; no target is dropped.
        cpu_checks=[]
        for weighted in (False,True):
            a=(torch.arange(12*19,dtype=torch.float32).reshape(1,12,19)/100).requires_grad_(True)
            b=a.detach().clone().requires_grad_(True)
            labels=(torch.arange(12).reshape(1,12)%19);labels[:,:7]=-100
            full_logits=a[0,:-1,:];full_gold=labels[0,1:];mask=full_gold!=-100
            tail_logits=b[0,-6:-1,:];tail_gold=labels[0,7:]
            fn=adaptive.loss_from_logits if weighted else F.cross_entropy
            whole=fn(full_logits[mask],full_gold[mask]);tail=fn(tail_logits,tail_gold)
            whole.backward();tail.backward()
            assert torch.equal(whole,tail) and torch.equal(a.grad,b.grad)
            assert torch.equal(a.grad[:,:6,:],torch.zeros_like(a.grad[:,:6,:]))
            assert torch.count_nonzero(a.grad[:,10,:]).item()>0
            ce=F.cross_entropy(tail_logits,tail_gold,reduction='none')
            weights=adaptive.normalized_weights(ce)
            assert torch.isfinite(weights).all() and (weights>0).all() and torch.allclose(weights.sum(),torch.tensor(1.))
            cpu_checks.append(dict(weighted=weighted,loss=float(whole.detach()),full_tail_loss_and_all_gradients_match=True,all_target_weights_positive=True))
        report['ce_window_cpu_validation']=cpu_checks
        del a,b,labels,whole,tail,full_logits,full_gold,tail_logits,tail_gold,mask,ce,weights
        assert torch.cuda.is_available() and torch.cuda.device_count()==1
        report.update(model=MODEL,revision=REVISION,pins=PINS,torch=torch.__version__,
            gpu=torch.cuda.get_device_name(0),seed=plan['seed'])
        random.seed(plan['seed']);torch.manual_seed(plan['seed']);torch.cuda.manual_seed_all(plan['seed'])
        tokenizer=AutoTokenizer.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
        prepared={};encoded={}
        for row in pack['teachers']+pack['evaluation']:
            p=service.prepare_cumulative_model_units(row['owner'],row['snapshot'],instruction_version=pack['instruction_version'])
            assert p.request_ref==row['request_ref'] and p.messages()==row['messages']
            prepared[row.get('id',row.get('probe_id'))]=p
            prompt=tokenizer.apply_chat_template(row['messages'],enable_thinking=False,
                add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
            assert len(prompt)+2048<=8192
            if 'assistant_target' not in row:continue
            full=tokenizer.apply_chat_template(row['messages']+[dict(role='assistant',content=row['assistant_target'])],
                enable_thinking=False,add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
            assert full[:len(prompt)]==prompt and len(prompt)<len(full)<=8192
            assert tokenizer.decode(full[len(prompt):],skip_special_tokens=False,
                clean_up_tokenization_spaces=False)==row['assistant_target']+'<|im_end|>\n'
            labels=[-100]*len(prompt)+full[len(prompt):]
            encoded[row['id']]=dict(input_ids=full,labels=labels,loss_start=len(prompt)-1,
                logits_positions=len(full)-len(prompt)+1,prompt_tokens=len(prompt),target_tokens=len(full)-len(prompt))
            # Every teacher must survive the unchanged source/graph receiver.
            raw=row['assistant_target']
            response=AnalysisModelUnitsResponse(p.request_ref,hashlib.sha256(canonical(p.messages()).encode()).hexdigest(),sha_text(raw),'stop',raw)
            artifact,_=service.build_cumulative_unit_candidates(row['owner'],row['snapshot'],model_input=replace(p,response=response))
            assert artifact.candidate_id==row['source_bound_candidate_id']
        save('encoded_training.json',encoded)
        report['token_counts']={k:{n:v[n] for n in ('prompt_tokens','target_tokens')} for k,v in encoded.items()}
        for row in pack['preexisting_evaluation']:
            prior_prepared=prepared[row['probe_id']]
            assert row['request_ref']==prior_prepared.request_ref
            assert row['messages_sha256']==sha_text(canonical(prior_prepared.messages()))
            original=args.prior_results/Path(row['member']).name
            assert sha(original)==row['raw_sha256']
            (args.out/('before_'+row['probe_id']+'.raw.txt')).write_bytes(original.read_bytes())
        stop=threading.Event()
        def generate_call(phase,row,generate):
            assert report['new_calls']<12 and time.monotonic()<deadline
            p=prepared[row['probe_id']];messages=p.messages();name=phase+'_'+row['probe_id']
            ref=p.request_ref;sent_hash=sha_text(canonical(messages))
            save(name+'.request.json',dict(request_ref=ref,messages_sha256=sent_hash,messages=messages))
            item=dict(phase=phase,probe_id=row['probe_id'],status='STARTED',training_use=row['training_use'],diagnostic_group='TRAINED_REHEARSAL' if row['training_use'] else 'DEVELOPMENT_PROBE')
            report['calls'].append(item);report['new_calls']+=1;checkpoint()
            begin=time.monotonic();raw,finish=generate(messages,min(deadline,begin+23))
            response=AnalysisModelUnitsResponse(ref,sent_hash,sha_text(raw),finish,raw)
            (args.out/(name+'.raw.txt')).write_text(raw);save(name+'.response.json',asdict(response))
            item.update(status='RETURNED',seconds=time.monotonic()-begin,finish_reason=finish,raw_sha256=sha_text(raw))
            try:
                value=replace(p,response=response)
                artifact,coverage=service.build_cumulative_unit_candidates(row['owner'],row['snapshot'],model_input=value)
            except (AnalysisSemanticError,AnalysisSourceError) as exc:
                item.update(admission='REJECTED',reason=str(exc))
            else:
                path=args.out/(name+'.candidate.json')
                path.write_text(service.serialize_cumulative_unit_candidates(row['owner'],row['snapshot'],
                    model_input=value,artifact=artifact,coverage=coverage))
                with patch.object(MeaningExperienceEngine,'generate',side_effect=AssertionError('no generation')):
                    saved,counts=service.reload_cumulative_unit_candidates(row['owner'],row['snapshot'],path.read_text(),instruction_version=pack['instruction_version'])
                assert saved==artifact and counts==coverage
                item.update(admission='RETURNED',candidate_id=artifact.candidate_id,coverage=coverage,
                    units=sum(len(f.units) for f in artifact.graph.fields),file_replay='MATCHED')
            checkpoint()
        assert not any(row['pre_generation_required'] for row in pack['evaluation'])
        report['model_loads']+=1
        model=Qwen3_5ForConditionalGeneration.from_pretrained(MODEL,revision=REVISION,dtype=torch.bfloat16,
            device_map={'':0},attn_implementation='sdpa',local_files_only=True,trust_remote_code=False)
        model=PeftModel.from_pretrained(model,args.initial_dir,is_trainable=True,local_files_only=True)
        prior_saved=load_file(args.initial_dir/'adapter_model.safetensors');prior_loaded=get_peft_model_state_dict(model)
        assert len(prior_saved)==len(prior_loaded)==112
        assert all(torch.equal(prior_saved[k],prior_loaded[k].detach().cpu()) for k in prior_saved)
        report['training_initial_reload']='MATCHED_ALL_112_SAVED_TENSORS'
        del prior_saved,prior_loaded
        trainable=[(n,p) for n,p in model.named_parameters() if p.requires_grad]
        assert len(trainable)==112 and sum(p.numel() for _,p in trainable)==3833856
        initial={n:p.detach().cpu().clone() for n,p in trainable}
        model.config.use_cache=False
        model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={'use_reentrant':False})
        model.enable_input_require_grads()
        torch.cuda.reset_peak_memory_stats()
        def teacher_loss(item,weighted=False):
            ids=torch.tensor([item['input_ids']],dtype=torch.long,device='cuda:0')
            labels=torch.tensor([item['labels']],dtype=torch.long,device='cuda:0')
            out=model(input_ids=ids,attention_mask=torch.ones_like(ids),
                logits_to_keep=item['logits_positions'],use_cache=False)
            gold=labels[0,item['loss_start']+1:]
            assert out.logits.shape[:2]==(1,item['logits_positions']) and (gold>=0).all()
            logits=out.logits[0,:-1,:]
            return adaptive.loss_from_logits(logits,gold) if weighted else F.cross_entropy(logits.float(),gold)
        def measure(phase):
            model.eval();losses={}
            with torch.no_grad():
                for key,item in encoded.items():
                    loss=teacher_loss(item);report['measurement_forwards']+=1
                    assert torch.isfinite(loss);losses[key]=float(loss)
            report['measurements'].append(dict(phase=phase,losses=losses,mean=sum(losses.values())/len(losses)))
            checkpoint()
        measure('before_updates');model.train()
        optimizer=torch.optim.AdamW([p for _,p in trainable],lr=5e-5,weight_decay=0.)
        for step,key in enumerate(plan['update_order'],1):
            assert step<=64 and time.monotonic()<deadline-5
            optimizer.zero_grad(set_to_none=True);report['updates_started']=step;checkpoint()
            loss=teacher_loss(encoded[key],weighted=True);report['training_forwards']+=1
            assert torch.isfinite(loss);loss.backward()
            assert all(p.grad is None or torch.isfinite(p.grad).all() for _,p in trainable)
            norm=torch.nn.utils.clip_grad_norm_([p for _,p in trainable],1.)
            assert torch.isfinite(norm);optimizer.step()
            report['updates_completed']=step;report['steps'].append(dict(step=step,teacher=key,loss=float(loss.detach()),gradient_norm=float(norm)))
            checkpoint()
        optimizer.zero_grad(set_to_none=True);optimizer=None
        measure('after_updates')
        assert report['updates_completed']==64
        report['changed_trainable_tensors']=sum(not torch.equal(p.detach().cpu(),initial[n]) for n,p in trainable)
        report['peak_allocated_gib']=torch.cuda.max_memory_allocated()/2**30
        report['peak_reserved_gib']=torch.cuda.max_memory_reserved()/2**30
        model.save_pretrained(args.out/'adapter',safe_serialization=True)
        weights=args.out/'adapter/adapter_model.safetensors';config_path=args.out/'adapter/adapter_config.json'
        saved=load_file(weights);actual=get_peft_model_state_dict(model)
        assert len(saved)==len(actual)==112 and all(torch.isfinite(t).all() for t in saved.values())
        assert all(torch.equal(saved[k],actual[k].detach().cpu()) for k in saved)
        report['adapter_sha256']=sha(weights);report['adapter_config_sha256']=sha(config_path)
        checkpoint()
        model=None;trainable=None;initial=None;actual=None;saved=None;loss=None;gc.collect();torch.cuda.empty_cache();torch.cuda.synchronize()
        report['model_loads']+=1
        generator=load_generator(str(args.out/'adapter'),stop,
            weights_sha256=report['adapter_sha256'],config_sha256=report['adapter_config_sha256'])
        report['saved_adapter_nontraining_reload']='MATCHED_112_TENSORS'
        for row in pack['evaluation']:generate_call('after',row,generator)
        assert initial_hashes=={n:sha(args.initial_dir/n) for n in initial_hashes}
        report['initial_adapter_unchanged']=True
        report['status']='COMPLETE_NOT_ADOPTED_PENDING_RAW_READ'
    except BaseException as exc:
        report.update(status='FAILED_NOT_ADOPTED',error_type=type(exc).__name__,error=str(exc),traceback=traceback.format_exc())
        raise
    finally:
        generator=model=optimizer=None;gc.collect();checkpoint();signal.setitimer(signal.ITIMER_REAL,0)


def sha_text(value):
    return hashlib.sha256(value.encode('utf-8')).hexdigest()


if __name__=='__main__':
    main()
