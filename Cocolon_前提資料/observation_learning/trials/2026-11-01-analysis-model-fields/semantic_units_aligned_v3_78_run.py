"""Finite v3-input alignment comparison of the unchanged private78 references.

The old106 order/objective and explicitly selected9dc initial are retained.
Before53 is the exact saved v3 probe output; no before generation or raw teaching.
This is development/rehearsal evidence, not product or general acceptance.
"""
import argparse
from dataclasses import asdict, replace
import gc
import hashlib
import importlib.util
from importlib.metadata import version
import json
import os
from pathlib import Path
import random
import signal
import subprocess
import sys
import threading
import time
import traceback
from unittest.mock import patch

sys.dont_write_bytecode=True
os.environ['HF_HUB_OFFLINE']='1'
os.environ['TRANSFORMERS_OFFLINE']='1'

API_COMMIT='58c47dd8d6512fdd7db5eb413a383925e8b31a87'
OLD78_PLAN_SHA='72696f33ae6e8284eb928e7497fa966b64bb072c99474ea99abc6b5a93b133be'
AUDIT_SHA='69016aeb4f4ea03f2973f77742b5b9ca591d1f7ee7b75c428f7e904cb361c97b'
AUDIT_SCRIPT_SHA='0604388379c095a94328b8434e82e4f5d7491fdc009b7c8f1244bea0143b20f0'
PROBE_CPU_SHA='317b585868532c294e41b3e40cc9cd3236b90efb8e5060128b54037c11405533'
PROBE_REPORT_SHA='75cb4f694907878e28595baf4dbe8ed813f91f0f5f3cc119c8b9d040f74d1415'
SOURCE_REVIEW_SHA='81dce4e3ce71eeec347172eebc58e3b2604ea04010d4c96df69c321b6024e343'
PROFILE='semantic_boundaries.v3'
STATE='cocolon.cmee.analysis_model_units_quoted_parents_state.semantic_boundaries.v3'
WEIGHTS='9dc4f947cda74e2c2befea39a978d3ca44295c7526a7ef2db8011a8c63947d4a'
CONFIG='4776a484561a82593d78f5e79f0e57a503c58d2a9fc54a69fff8890f885a75ce'


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def unchanged(values):
    return all(Path(path).is_file() and sha(path)==expected for path,expected in values.items())


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--api-root',required=True,type=Path)
    parser.add_argument('--api-commit',required=True)
    parser.add_argument('--plan',required=True,type=Path)
    parser.add_argument('--plan-sha256',required=True)
    parser.add_argument('--initial-dir',required=True,type=Path)
    parser.add_argument('--adaptive-loss',required=True,type=Path)
    parser.add_argument('--out',required=True,type=Path)
    args=parser.parse_args()
    base=args.plan.parent
    assert not args.out.exists() and sha(args.plan)==args.plan_sha256
    pack=json.loads(args.plan.read_text());plan=pack['plan']
    assert pack['status']=='ROOT_SYNTHETIC_ALIGNED_V3_78_FROM_EXPLICIT_9DC_NOT_PRODUCT_ACCEPTANCE'
    assert args.api_commit==pack['api_commit']==API_COMMIT
    assert subprocess.check_output(['git','-C',str(args.api_root),'rev-parse','HEAD'],text=True).strip()==API_COMMIT
    assert not subprocess.check_output(['git','-C',str(args.api_root),'status','--porcelain','--untracked-files=no'],text=True).strip()
    assert (Path('/workspace')/'reason-v3-tests.exit').read_text()=='0'
    assert pack['old78_plan_sha256']==sha(base/'original78_plan.json')==OLD78_PLAN_SHA
    original=json.loads((base/'original78_plan.json').read_text())
    assert original['status']=='ROOT_SYNTHETIC_BOUNDARY78_FROM_SAVED_9DC_NOT_PRODUCT_ACCEPTANCE'
    assert original['plan']['prompt_version']=='semantic_boundaries.v2'
    assert len(pack['teachers'])==len(original['teachers'])==78 and len(pack['evaluation'])==53
    assert len({r['id'] for r in pack['teachers']})==78 and len({r['probe_id'] for r in pack['evaluation']})==53
    assert len(plan['update_order'])==106 and plan['update_order']==original['plan']['update_order']
    assert set(plan['update_order'])=={r['id'] for r in pack['teachers']}
    assert plan['update_order'][-16:]==['RU01','RU02','RB01','RB02']*4
    for row,old in zip(pack['teachers'],original['teachers']):
        assert {key:row[key] for key in ('id','owner','snapshot','assistant_target')}=={
            key:old[key] for key in ('id','owner','snapshot','assistant_target')}
        assert 'training_use' not in row or row['training_use'] is True
    assert [r['probe_id'] for r in pack['evaluation']]==original['preexisting_evaluation']
    assert all(not r['pre_generation_required'] and 'assistant_target' not in r for r in pack['evaluation'])
    assert sum(bool(r.get('role_vertical')) for r in pack['evaluation'])==16
    assert (plan['max_updates'],plan['max_seconds'],plan['max_new_generations'],plan['max_model_loads'])==(106,1200,53,2)
    assert (plan['max_teacher_measurements'],plan['max_training_forwards'])==(156,106)
    assert (plan['request_seconds'],plan['context_tokens'],plan['max_new_tokens'])==(23,8192,2048)
    assert (plan['outer_timeout_term_seconds'],plan['outer_kill_grace_seconds'])==(1190,10)
    assert plan['prompt_version']==PROFILE
    preserved=('epochs','batch_size','gradient_accumulation','learning_rate','weight_decay','gradient_clip','seed',
        'trainable_tensors','trainable_parameters','model','revision','base_config_sha256',
        'training_objective','measurement_objective','adaptive_loss_sha256')
    assert all(plan[key]==original['plan'][key] for key in preserved)
    assert (plan['learning_rate'],plan['weight_decay'],plan['gradient_clip'],plan['seed'])==(1e-5,0.,1.,20261111)
    assert plan['training_objective']=='EXISTING_UNWEIGHTED_FULL_ASSISTANT_CE_V1'
    assert plan['measurement_objective']=='UNWEIGHTED_FULL_ASSISTANT_NLL'
    assert plan['initial_weights_sha256']==WEIGHTS and plan['initial_config_sha256']==CONFIG
    assert pack['teacher_audit_sha256']==sha(base/'teacher_audit/result.json')==AUDIT_SHA
    audit=json.loads((base/'teacher_audit/result.json').read_text())
    assert audit['status']=='V3_TEACHERS78_CPU_AUDITED_NO_MODEL_NO_GPU_PLAN'
    assert audit['runner_sha256']==AUDIT_SCRIPT_SHA and audit['api_commit']==API_COMMIT
    assert audit['old78_plan_sha256']==OLD78_PLAN_SHA and audit['old78_source_target_order_unchanged']
    assert (audit['model_loads'],audit['model_generations'],audit['training_updates'],audit['nll_measurements'])==(0,0,0,0)
    audit_manifest=json.loads((base/'teacher_audit/manifest.json').read_text())
    assert audit_manifest and all(sha(base/'teacher_audit'/path)==expected for path,expected in audit_manifest.items())
    assert pack['source_review_sha256']==sha(base/'SOURCE_TARGET_REVIEW.md')==SOURCE_REVIEW_SHA
    assert pack['probe_cpu_sha256']==sha(base/'probe_cpu_result.json')==PROBE_CPU_SHA
    assert pack['probe_report_sha256']==sha(base/'probe_report.json')==PROBE_REPORT_SHA
    probe_cpu=json.loads((base/'probe_cpu_result.json').read_text())
    probe_report=json.loads((base/'probe_report.json').read_text())
    assert probe_cpu['status']=='REASON_V3_PROBE53_CPU_PREPARED_NO_MODEL_NO_GPU_PLAN'
    assert probe_report['status']=='COMPLETE_NOT_ADOPTED_PENDING_RAW_READ'
    assert probe_report['api_commit']==probe_cpu['api_commit']==API_COMMIT
    assert probe_report['prompt_version']==probe_cpu['prompt_version']==PROFILE
    assert probe_report['cpu_result_sha256']==PROBE_CPU_SHA
    assert (probe_report['new_calls'],probe_report['model_loads'],probe_report['training_updates'],probe_report['nll_measurements'])==(53,1,0,0)
    assert probe_report['all_finished_stop'] and probe_report['weights_sha256']==WEIGHTS and probe_report['config_sha256']==CONFIG
    assert probe_cpu['api_source_blobs']==audit['api_source_blobs']==pack['api_source_blobs']
    for row,oldrow in zip(pack['evaluation'],probe_cpu['rows']):
        assert {key:row[key] for key in ('probe_id','owner','snapshot','request_ref','messages','training_use','role_vertical')}=={
            key:oldrow[key] for key in ('probe_id','owner','snapshot','request_ref','messages','training_use','role_vertical')}
    cpu_manifest=json.loads((base/'cpu_manifest.json').read_text())
    assert cpu_manifest and all(sha(base/path)==expected for path,expected in cpu_manifest.items())
    prior=json.loads((base/'adapter_hashes_before.json').read_text())
    assert len(prior)==18 and prior==probe_report['adapter_hashes'] and unchanged(prior)
    assert sha(args.initial_dir/'adapter_config.json')==CONFIG and sha(args.initial_dir/'adapter_model.safetensors')==WEIGHTS
    assert sha(args.adaptive_loss)==plan['adaptive_loss_sha256']
    initial_hashes={n:sha(args.initial_dir/n) for n in ('adapter_config.json','adapter_model.safetensors')}
    assert len(pack['api_source_blobs'])==6
    for path,expected in pack['api_source_blobs'].items():
        b=(args.api_root/path).read_bytes()
        assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==expected
        assert subprocess.check_output(['git','-C',str(args.api_root),'rev-parse',API_COMMIT+':'+path],text=True).strip()==expected
    assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True).strip()
    args.out.mkdir()
    def save(name,value):
        p=args.out/name;tmp=p.with_suffix(p.suffix+'.tmp')
        tmp.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n');tmp.replace(p)
    report=dict(status='STARTED',plan_sha256=args.plan_sha256,runner_sha256=sha(__file__),
        plan=plan,api_commit=pack['api_commit'],evaluation_scope='UNCHANGED_DEVELOPMENT_REHEARSAL53_REAL_V3_PROBE_BEFORE_NOT_GENERAL_ACCEPTANCE',
        updates_started=0,updates_completed=0,training_forwards=0,measurement_forwards=0,model_loads=0,new_calls=0,
        calls=[],steps=[],measurements=[],training_initial='EXPLICIT_SAVED_9DC_V3_INPUT_ALIGNMENT_RESEARCH_ONLY_NOT_LATEST_9E',
        initial_hashes=initial_hashes,prior_adapter_hashes=prior,teacher_audit_sha256=AUDIT_SHA,old78_plan_sha256=OLD78_PLAN_SHA,
        training_objective=plan['training_objective'],measurement_objective=plan['measurement_objective'],
        model_adopted=False,next_training_initial_selected=False,retry=False,product_credit=0,
        original78_sources_targets_order_unchanged=True,new_teachers=0,model_raw_teaching=False,
        input_version_only_design_comparison=True,sole_cause_certification=False)
    start=time.monotonic();deadline=start+1200
    def checkpoint():
        report['process_seconds']=time.monotonic()-start;save('report.json',report)
    def expired(*_):
        raise TimeoutError('analysis_teaching_deadline')
    signal.signal(signal.SIGTERM,expired);signal.signal(signal.SIGALRM,expired)
    signal.setitimer(signal.ITIMER_REAL,1200);checkpoint()
    model=generator=optimizer=None
    try:
        sys.path[:0]=[str(args.api_root/'ai/tools'),str(args.api_root/'ai/services/ai_inference')]
        from serve_emlis_natural_reply import load_generator,MODEL,REVISION,PINS
        from cocolon_meaning_experience_engine import MeaningExperienceEngine
        from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
        from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
        from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
            AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError,canonical)
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
        # The same all-target objective is compared in full and P-1 windows.
        # This synthetic CPU check is not a comparison with any old v2 NLL.
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
            p=service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'],prompt_version=plan['prompt_version'])
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
            # Source-authored target only; generated before/after raw is not encoded.
            raw=row['assistant_target']
            response=AnalysisModelQuotedParentUnitsResponse(p.request_ref,hashlib.sha256(canonical(p.messages()).encode()).hexdigest(),sha_text(raw),'stop',raw)
            artifact,_=service.build_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=replace(p,response=response))
            assert artifact.candidate_id==row['source_bound_candidate_id']
        assert len(encoded)==78 and encoded==json.loads((base/'encoded_training_cpu.json').read_text())
        save('encoded_training.json',encoded)
        report['encoded_training_matches_cpu_prepared78']=True
        report['token_counts']={k:{n:v[n] for n in ('prompt_tokens','target_tokens')} for k,v in encoded.items()}
        assert plan['prompt_version']==PROFILE and len(pack['preexisting_evaluation'])==53
        report['reused_before_count']=53
        report['reused_before_origin']='REAL_V3_PROBE53_AFTER_SAVED_9DC'
        report['prompt_version']=plan['prompt_version']
        report['reused_before_identity_file']='reused_before.json'
        stop=threading.Event()
        def generate_call(phase,row,generate):
            assert phase=='after' and report['new_calls']<53 and time.monotonic()<deadline
            p=prepared[row['probe_id']];messages=p.messages();name=phase+'_'+row['probe_id']
            ref=p.request_ref;sent_hash=sha_text(canonical(messages))
            save(name+'.request.json',dict(request_ref=ref,messages_sha256=sent_hash,messages=messages))
            item=dict(phase=phase,probe_id=row['probe_id'],status='STARTED',prompt_version=PROFILE,
                training_use=row['training_use'],diagnostic_group='TRAINED_REHEARSAL' if row['training_use'] else 'DEVELOPMENT_PROBE')
            report['calls'].append(item);report['new_calls']+=1;checkpoint()
            begin=time.monotonic();raw,finish=generate(messages,min(deadline,begin+23))
            response=AnalysisModelQuotedParentUnitsResponse(ref,sent_hash,sha_text(raw),finish,raw)
            (args.out/(name+'.raw.txt')).write_text(raw);save(name+'.response.json',asdict(response))
            item.update(status='RETURNED',seconds=time.monotonic()-begin,finish_reason=finish,raw_sha256=sha_text(raw))
            try:
                value=replace(p,response=response)
                artifact,coverage=service.build_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=value)
            except (AnalysisSemanticError,AnalysisSourceError) as exc:
                item.update(admission='REJECTED',reason=str(exc))
            else:
                path=args.out/(name+'.candidate.json')
                path.write_text(service.serialize_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],
                    model_input=value,artifact=artifact,coverage=coverage))
                assert json.loads(path.read_text())['state']['schema_version']==STATE
                with patch.object(MeaningExperienceEngine,'generate',side_effect=AssertionError('no saved generation')), \
                     patch.object(compiler,'compile_analysis_unit_candidates',side_effect=AssertionError('no saved candidate compile')), \
                     patch.object(compiler,'compile_model_written_role_graph',side_effect=AssertionError('no saved role compile')), \
                     patch.object(author,'realize_analysis_unit_candidates',side_effect=AssertionError('no saved candidate author')), \
                     patch.object(author,'realize_model_written_role_graph',side_effect=AssertionError('no saved role author')):
                    saved,counts=service.reload_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],path.read_text())
                assert saved==artifact and counts==coverage
                item.update(admission='RETURNED',candidate_id=artifact.candidate_id,coverage=coverage,
                    units=sum(len(f.units) for f in artifact.graph.fields),file_replay='MATCHED')
            if row.get('role_vertical'):
                try:
                    role,counts=service.build_cumulative_written_role_map(row['owner'],row['snapshot'],model_input=value)
                except (AnalysisSemanticError,AnalysisSourceError) as exc:
                    item.update(role_admission='REJECTED',role_reason=str(exc))
                else:
                    path=args.out/(name+'.role.json')
                    path.write_text(service.serialize_cumulative_written_role_map(row['owner'],row['snapshot'],model_input=value,artifact=role,coverage=counts))
                    with patch.object(MeaningExperienceEngine,'generate',side_effect=AssertionError('no saved generation')), \
                         patch.object(compiler,'compile_analysis_unit_candidates',side_effect=AssertionError('no saved candidate compile')), \
                         patch.object(compiler,'compile_model_written_role_graph',side_effect=AssertionError('no saved role compile')), \
                         patch.object(author,'realize_analysis_unit_candidates',side_effect=AssertionError('no saved candidate author')), \
                         patch.object(author,'realize_model_written_role_graph',side_effect=AssertionError('no saved role author')):
                        restored,cov=service.reload_cumulative_written_role_map(row['owner'],row['snapshot'],path.read_text())
                    assert restored==role and cov==counts
                    item.update(role_admission='RETURNED',role_artifact_id=role.artifact_id,
                        role_coverage=counts,role_file_replay='MATCHED_NO_ENGINE_COMPILER_AUTHOR')
            checkpoint()
        assert not any(row['pre_generation_required'] for row in pack['evaluation'])
        random.seed(plan['seed']);torch.manual_seed(plan['seed']);torch.cuda.manual_seed_all(plan['seed'])
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
            report['measurements'].append(dict(phase=phase,prompt_version=PROFILE,losses=losses,mean=sum(losses.values())/len(losses)))
            checkpoint()
        measure('before_updates')
        assert len(report['measurements'][-1]['losses'])==78
        report['baseline_nll_control']='NEW_V3_PREFIX78_BEFORE_AND_AFTER_MEASURED_NO_EQUALITY_ASSERTION_TO_OLD_V2_NLL'
        dropout=[(n,m.p) for n,m in model.named_modules() if isinstance(m,torch.nn.Dropout)]
        assert all(p==0 for _,p in dropout)
        report['dropout_modules_zero']=len(dropout)
        text_config=getattr(model.config,'text_config',model.config)
        attention_dropout=getattr(text_config,'attention_dropout',None)
        lora_dropout={name:cfg.lora_dropout for name,cfg in model.peft_config.items()}
        report['functional_attention_dropout']=attention_dropout
        report['adapter_lora_dropout']=lora_dropout
        assert attention_dropout==0 and lora_dropout and all(p==0 for p in lora_dropout.values())
        checkpoint()
        model.train()
        optimizer=torch.optim.AdamW([p for _,p in trainable],lr=plan['learning_rate'],weight_decay=0.)
        for step,key in enumerate(plan['update_order'],1):
            assert step<=106 and time.monotonic()<deadline-5
            optimizer.zero_grad(set_to_none=True);report['updates_started']=step;checkpoint()
            loss=teacher_loss(encoded[key],weighted=False);report['training_forwards']+=1
            assert torch.isfinite(loss);loss.backward()
            assert all(p.grad is None or torch.isfinite(p.grad).all() for _,p in trainable)
            norm=torch.nn.utils.clip_grad_norm_([p for _,p in trainable],1.)
            assert torch.isfinite(norm);optimizer.step()
            report['updates_completed']=step;report['steps'].append(dict(step=step,teacher=key,loss=float(loss.detach()),gradient_norm=float(norm)))
            checkpoint()
        optimizer.zero_grad(set_to_none=True);optimizer=None
        measure('after_updates')
        assert report['updates_completed']==106 and report['updates_started']==106 and report['training_forwards']==106
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
        report['new_rb_teacher_targets_not_added_to_generation_population']=True
        for row in pack['evaluation']:generate_call('after',row,generator)
        assert initial_hashes=={n:sha(args.initial_dir/n) for n in initial_hashes}
        assert unchanged(prior)
        report['initial_adapter_unchanged']=True
        report['all_prior_eighteen_files_unchanged']=True
        assert report['model_loads']==2 and report['new_calls']==53 and report['measurement_forwards']==156
        assert len(report['calls'])==53 and all(c['status']=='RETURNED' and c['finish_reason']=='stop' for c in report['calls'])
        report['all_finished_stop']=True
        report['status']='COMPLETE_NOT_ADOPTED_PENDING_RAW_READ'
    except BaseException as exc:
        report.update(status='FAILED_NOT_ADOPTED',error_type=type(exc).__name__,error=str(exc),traceback=traceback.format_exc())
        raise
    finally:
        generator=model=optimizer=None;gc.collect()
        report['all_prior_eighteen_files_unchanged_at_exit']=unchanged(prior)
        checkpoint();signal.setitimer(signal.ITIMER_REAL,0)


def sha_text(value):
    return hashlib.sha256(value.encode('utf-8')).hexdigest()


if __name__=='__main__':
    main()
