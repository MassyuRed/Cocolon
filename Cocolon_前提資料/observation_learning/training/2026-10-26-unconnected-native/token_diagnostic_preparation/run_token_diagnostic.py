"""Frozen109c teacher-forced diagnostic. No optimizer, backward or generation.

Targets are gold ONLY for measuring conditional prediction errors. This is not
free generation, an adopted packet, a repaired raw output, or product credit.
"""
import argparse, contextlib, gc, hashlib, importlib.util, json, math, os, re
from pathlib import Path
import signal, sys, time, traceback
from unittest.mock import patch
sys.dont_write_bytecode = True

RECOVERY_PACK = Path('/workspace/cocolon_native15_expanded15_recovery_pack_20261027')
RAW_RUN = Path('/workspace/cocolon_native15_expanded15_recovery_run_20261027')
OUTPUT = Path('/workspace/cocolon_109c_token_diagnostic_run_20261027')
BINDINGS_SHA = '2f46d5068c68cd22a08e33554feba627cb46245d4eb4aa40c3675d4c2f4e0908'
PLAN = 'token_diagnostic.plan.json'
FIXED = dict(schema='cocolon.109c_teacher_forced_diagnostic_once.v1',
    adapter_sha256='109c3dda16b19d2f110d6f8e2ded07f47e981b9690970ca95b9046780bffb85a',
    model='Qwen/Qwen3.5-4B', revision='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a',
    api_commit='6b043880504912481a6b10d93c9128ec4995b70b',
    pod_id='bkj4qvnhwtdqc2', expected_gpu_name='NVIDIA RTX A5000',
    output_directory=str(OUTPUT), max_seconds=900, gpu_hourly_usd=0.28,
    max_process_usd=0.07, forwards=15, forwards_per_case=1,
    optimizer_steps=0, generations=0, retries=0, context_tokens=8192,
    gpu_lifecycle_operations=0, cmee_adoptions=0, sql_operations=0,
    product_credit=0, unknown_generalization_credit=0,
    automatic_progression=False, product_accepted=False)

def require(ok, code):
    if not ok: raise ValueError(code)

def sha(path): return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def dump(path, value):
    path=Path(path); temp=path.with_suffix(path.suffix+'.tmp')
    temp.write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False)+'\n')
    temp.replace(path)

def import_file(name, path):
    spec=importlib.util.spec_from_file_location(name,path)
    module=importlib.util.module_from_spec(spec);sys.modules[name]=module
    spec.loader.exec_module(module);return module

def validate_plan(pack, execution=False):
    require(sha(pack/'source_bindings.json')==BINDINGS_SHA,'source_bindings_changed')
    p=json.loads((pack/PLAN).read_text())
    require(set(p)==set(FIXED)|{'runner_sha256','verifier_sha256','status','gpu_run_authorized','approval_basis'},'plan_keys')
    for k,v in FIXED.items():
        require(type(p[k]) is type(v) and p[k]==v,'plan_scope:'+k)
    require(sha(__file__)==p['runner_sha256'],'runner_changed')
    require(sha(pack/'verify_token_diagnostic_cpu.py')==p['verifier_sha256'],'verifier_changed')
    require(p['status'] in {'PREPARED_AWAITING_MASH_APPROVAL','AUTHORIZED_ONCE_BOUND'},'plan_status')
    approved=p['status']=='AUTHORIZED_ONCE_BOUND'
    require(type(p['gpu_run_authorized']) is bool and p['gpu_run_authorized']==approved,'plan_authorization')
    require((approved and isinstance(p['approval_basis'],str) and p['approval_basis'].strip()) or
            (not approved and p['approval_basis'] is None),'approval_basis')
    require(not execution or approved,'execute_refused_new_diagnostic_approval_pending')
    return p

def field_map(parser, tokenizer, encoded, prefix, text):
    """Use unchanged JSON value spans and the identical full-template token IDs.

    Sibling field values cannot overlap. A BPE token touching two sibling
    values is marked CROSS_FIELD_BOUNDARY; it is never silently assigned.
    Syntax outside those value spans is JSON_STRUCTURE. Byte-fallback token
    offsets may overlap, and are retained exactly as returned by tokenizer.
    """
    require(text==text.strip(),'teacher_outer_whitespace')
    walker=parser._SpanParser(text);root=walker.parse()
    require(walker._ws(root.end)==len(text),'teacher_trailing_data')
    candidate=parser._member(root,'candidate','object')
    spans={}
    for key in ('claims','relations','unknowns','conflicts','question_proposal','updates'):
        n=parser._member(candidate,key);spans['candidate.'+key]=(n.start,n.end)
    n=parser._member(root,'evidence_quotes','array');spans['evidence_quotes']=(n.start,n.end)
    surface=parser._member(candidate,'surface_proposal','object')
    for key in ('bindings','observation','reception','update_note'):
        n=parser._member(surface,key);spans['candidate.surface_proposal.'+key]=(n.start,n.end)
    ordered=sorted(spans.values())
    require(all(a[1]<=b[0] for a,b in zip(ordered,ordered[1:])),'sibling_spans_overlap')
    tokenized=tokenizer(text,add_special_tokens=False,return_offsets_mapping=True)
    ids=tokenized['input_ids'];offsets=tokenized['offset_mapping']
    require(len(ids)==len(offsets)>0,'offset_shape')
    require(encoded['input_ids'][prefix:prefix+len(ids)]==ids,'offset_ids_not_full_template_ids')
    require(encoded['labels'][:prefix]==[-100]*prefix and
            encoded['labels'][prefix:]==encoded['input_ids'][prefix:],'masked_labels_changed')
    require(tokenizer.decode(encoded['input_ids'][prefix:],skip_special_tokens=False,
            clean_up_tokenization_spaces=False)==text+'<|im_end|>\n','template_tail_changed')
    tail=encoded['input_ids'][prefix+len(ids):]
    require(tokenizer.eos_token_id not in ids and tail.count(tokenizer.eos_token_id)==1,'unique_eos')
    mapped=[]
    for i,tid in enumerate(encoded['input_ids'][prefix:]):
        if i<len(ids):
            start,end=offsets[i]
            require(type(start) is int and type(end) is int and 0<=start<end<=len(text),'bad_offset')
            touched=[name for name,(a,b) in spans.items() if start<b and end>a]
            field=touched[0] if len(touched)==1 else ('CROSS_FIELD_BOUNDARY' if touched else 'JSON_STRUCTURE')
            mapped.append(dict(target_index=i,full_input_position=prefix+i,gold_id=tid,
                char_span=[start,end],raw_lexeme=text[start:end],field=field,touched_fields=touched))
        else:
            mapped.append(dict(target_index=i,full_input_position=prefix+i,gold_id=tid,
                char_span=None,raw_lexeme=None,field='EOS' if tid==tokenizer.eos_token_id else 'TEMPLATE_TAIL',touched_fields=[]))
    for name,(a,b) in spans.items():
        require(any(name in m['touched_fields'] for m in mapped),'field_without_tokens:'+name)
    return dict(char_spans={k:list(v) for k,v in spans.items()},tokens=mapped,
                json_token_count=len(ids),target_count=len(mapped),prompt_tokens=prefix)

def divergence(teacher_text, teacher_ids, raw, mapping):
    rawtext=raw['raw_text'];generated=raw['output_token_ids']
    eos_index=next(i for i,value in enumerate(mapping['tokens']) if value['field']=='EOS')
    # Free generation terminates at EOS and cannot produce template newline.
    # Compare through EOS, while scoring the immutable complete training tail.
    tail_after_eos=len(teacher_ids)-eos_index-1
    teacher_ids=teacher_ids[:eos_index+1]
    char=0
    while char<min(len(teacher_text),len(rawtext)) and teacher_text[char]==rawtext[char]:char+=1
    token=0
    while token<min(len(teacher_ids),len(generated)) and teacher_ids[token]==generated[token]:token+=1
    equal=teacher_ids==generated
    content_equal=teacher_text==rawtext.strip()
    return dict(raw_utf8_sha256=hashlib.sha256(rawtext.encode()).hexdigest(),
        raw_tokens=len(generated),raw_eos_reached=raw['eos_reached'],
        common_prefix_chars=char,common_prefix_tokens=token,token_sequences_equal=equal,
        comparison_stops_at_teacher_eos=True,uncompared_template_tail_after_eos=tail_after_eos,
        raw_json_text_equals_teacher_except_outer_whitespace=content_equal,
        substantive_character_divergence=None if content_equal else char,
        difference_kind='IDENTICAL_THROUGH_EOS' if equal else ('JSON_CONTENT_IDENTICAL_TERMINATION_ONLY' if content_equal else 'JSON_CONTENT_DIVERGENCE'),
        first_different_target_index=None if equal else token,
        teacher_token_at_divergence=teacher_ids[token] if token<len(teacher_ids) else None,
        generated_token_at_divergence=generated[token] if token<len(generated) else None,
        teacher_field_at_divergence=mapping['tokens'][token]['field'] if token<len(mapping['tokens']) else 'AFTER_TEACHER',
        teacher_excerpt=teacher_text[max(0,char-60):char+160],raw_excerpt=rawtext[max(0,char-60):char+160],
        comparison_scope='Existing free-running raw only; this diagnostic does not repair or regenerate it.')

def score_logits(logits, gold_ids, mapping, tokenizer):
    """Logit row i predicts assistant target i, including EOS and tail newline.

    Float32 metrics in chunks avoid materializing a second full vocabulary
    tensor. Rank is 1 + count(strictly greater logits); ties use competition
    rank, and top1 uses torch.argmax's lowest-index tie break.
    """
    import torch
    require(logits.ndim==2 and logits.shape[0]==len(gold_ids)==mapping['target_count'],'logit_target_shape')
    records=[];groups={}
    with torch.inference_mode():
        for begin in range(0,len(gold_ids),32):
            part=logits[begin:begin+32].float()
            require(bool(torch.isfinite(part).all().item()),'nonfinite_logits')
            gold=torch.tensor(gold_ids[begin:begin+len(part)],device=part.device,dtype=torch.long)
            value=part.gather(1,gold[:,None]).squeeze(1)
            nll=(torch.logsumexp(part,dim=1)-value).cpu().tolist()
            pred=part.argmax(dim=1).cpu().tolist()
            rank=((part>value[:,None]).sum(dim=1)+1).cpu().tolist()
            topval,topid=torch.topk(part,min(5,part.shape[1]),dim=1)
            topid=topid.cpu().tolist();topval=topval.cpu().tolist()
            for j in range(len(part)):
                m=mapping['tokens'][begin+j];wrong=pred[j]!=m['gold_id']
                row={**m,'nll':nll[j],'predicted_id':pred[j],'gold_rank':rank[j],
                     'top1_correct':not wrong,'gold_text':tokenizer.decode([m['gold_id']],skip_special_tokens=False),
                     'predicted_text':tokenizer.decode([pred[j]],skip_special_tokens=False)}
                if wrong or m['field']=='EOS':
                    row['top5']=[dict(id=k,text=tokenizer.decode([k],skip_special_tokens=False),logit=v)
                                 for k,v in zip(topid[j],topval[j],strict=True)]
                records.append(row)
                g=groups.setdefault(m['field'],dict(tokens=0,nll_sum=0.,top1_correct=0,wrong_tokens=0))
                g['tokens']+=1;g['nll_sum']+=nll[j];g['top1_correct']+=int(not wrong);g['wrong_tokens']+=int(wrong)
            del part,gold,value,topval,topid
    for g in groups.values():
        g['mean_nll']=g['nll_sum']/g['tokens'];g['top1_accuracy']=g['top1_correct']/g['tokens']
    wrong=[r['target_index'] for r in records if not r['top1_correct']]
    return dict(target_tokens=len(records),mean_nll=math.fsum(r['nll'] for r in records)/len(records),
        top1_correct=len(records)-len(wrong),top1_accuracy=1-len(wrong)/len(records),
        first_wrong_target_index=wrong[0] if wrong else None,wrong_target_indices=wrong,
        field_metrics=groups,tokens=records,
        rank_convention='1 + count(logit > gold_logit); ties are explicit competition rank')

def prepare(pack):
    require(os.environ.get('HF_HUB_OFFLINE')==os.environ.get('TRANSFORMERS_OFFLINE')=='1','offline_required')
    plan=validate_plan(pack);bindings=json.loads((pack/'source_bindings.json').read_text())
    recovery_path=RECOVERY_PACK/'run_expanded15_recovery.py'
    require(sha(recovery_path)==bindings['recovery_runner_sha256'],'recovery_owner_changed')
    require(sha(pack/'candidate_focus_loss.py')==bindings['span_parser_sha256'],'span_parser_changed')
    recovery=import_file('frozen_recovery_owner_token_diagnostic',recovery_path)
    recovery.validate_origin();owner,modules,names=recovery.owner_with_checked_suffixes()
    recovery.validate_origin();owner.validate_expanded_tensors(recovery.ORIGIN/'adapter')
    old,r,joint,tok,rows,cases,encoded,check=owner.prepare(recovery.OLDPACK)
    require(r.MODEL==FIXED['model'] and r.REVISION==FIXED['revision'],'base_identity')
    parser=import_file('frozen_json_span_parser_token_diagnostic',pack/'candidate_focus_loss.py')
    source_paths=[recovery_path,pack/'candidate_focus_loss.py',pack/'source_bindings.json',pack/PLAN,
                  pack/'run_token_diagnostic.py',pack/'verify_token_diagnostic_cpu.py',RAW_RUN/'run.json']
    require(sha(RAW_RUN/'run.json')==bindings['raw_run_sha256'],'raw_run_changed')
    mappings=[];comparisons=[]
    for row,case,item in zip(rows,cases,encoded,strict=True):
        require(case['messages']==row['messages'][:-1],'eval_input_mismatch')
        require(len(item['input_ids'])<=8192,'context_truncation_forbidden')
        prefix=next(i for i,v in enumerate(item['labels']) if v!=-100)
        mapped=field_map(parser,tok,item,prefix,row['messages'][-1]['content']);mappings.append(mapped)
        name='after_'+row['id']+'.jsonl';path=RAW_RUN/name
        require(sha(path)==bindings['raw_files'][name],'existing_raw_changed:'+name)
        raw=r.read_jsonl(path);require(len(raw)==1 and raw[0]['case_id']==row['id'],'raw_case')
        require(raw[0]['adapter_revision']==FIXED['adapter_sha256'],'raw_adapter')
        comparisons.append(divergence(row['messages'][-1]['content'],item['input_ids'][prefix:],raw[0],mapped));source_paths.append(path)
    require(len(rows)==len(mappings)==15 and set(bindings['raw_files'])=={'after_'+x['id']+'.jsonl' for x in rows},'fixed15')
    for n,h in bindings['payloads'].items():
        for directory in (recovery.ORIGIN,recovery.OLDPACK,RAW_RUN):
            require(sha(directory/n)==h,'frozen_payload:'+str(directory/n));source_paths.append(directory/n)
    source_paths += [recovery.ORIGIN/n for n in recovery.ORIGIN_FILES]
    source_paths += [recovery.ORIGIN/'adapter'/n for n in recovery.ADAPTER]
    source_paths += [owner.LEGACY/'run_pilot.py',owner.JOINT/'run_quote_joint_fit.py',
        recovery.OLDPACK/'run_native15_expanded30.py',recovery.OLDPACK/'gpu15.plan.json',
        recovery.OLDPACK/'gpu15.proposed.json',recovery.OLDPACK/'gpu30_expanded.plan.json',
        recovery.OLDPACK/'run_native15.py',recovery.OLDPACK/'run_native15_afteronly.py']
    source_paths += [owner.API/n for n in json.loads((recovery.ORIGIN/'api_blobs.json').read_text())]
    for directory in (owner.INITIAL,owner.EXPANDED_INITIAL):
        source_paths += [directory/n for n in ('README.md','adapter_config.json','adapter_model.safetensors')]
    from huggingface_hub.constants import HF_HUB_CACHE
    snapshot=Path(HF_HUB_CACHE)/'models--Qwen--Qwen3.5-4B/snapshots'/r.REVISION
    # Inherit the fixed-revision loader and existing index/config checks.
    # Whole multi-GB base shards are not rehashed by this bounded diagnostic.
    source_paths += [p for p in snapshot.iterdir() if p.is_file() and p.suffix!='.safetensors']
    identities={str(p):sha(p) for p in dict.fromkeys(source_paths)}
    return plan,recovery,owner,r,tok,rows,encoded,mappings,comparisons,identities

def forbidden(*a,**kw): raise RuntimeError('diagnostic_optimizer_backward_or_generation_forbidden')

def execute(pack,source):
    plan=validate_plan(pack,execution=True)
    require(re.fullmatch('[0-9a-f]{40}',source or '') is not None,'approved_source_commit_required')
    OUTPUT.mkdir(exist_ok=False)
    started=time.monotonic();report=dict(status='STARTED_ONCE',source_commit=source,plan=plan,
        forwards_started=0,forwards_completed=0,optimizer_steps=0,generations=0,cmee_adoptions=0,
        sql_operations=0,retry=False,product_credit=0,unknown_generalization_credit=0,
        automatic_progression=False,cases=[],started_unix=time.time())
    def save(): report['processing_seconds']=time.monotonic()-started;dump(OUTPUT/'run.json',report)
    def timed_out(*a):raise TimeoutError('diagnostic_global_900sec_no_retry')
    signal.signal(signal.SIGALRM,timed_out);signal.signal(signal.SIGTERM,timed_out)
    signal.setitimer(signal.ITIMER_REAL,900);identities={};model=None;save()
    try:
        plan,recovery,owner,r,tok,rows,encoded,mappings,comparisons,identities=prepare(pack)
        report['source_sha256']=identities;save()
        import torch
        require(os.environ.get('RUNPOD_POD_ID')==plan['pod_id'] and torch.cuda.device_count()==1,'bound_pod')
        report['gpu']=r.gpu_profile(torch,{'minimum_free_gib':14})
        require(report['gpu']['name']==plan['expected_gpu_name'],'bound_gpu')
        torch.cuda.reset_peak_memory_stats()
        model,tensors=owner.load_expanded_adapter(r,recovery.ORIGIN/'adapter',recovery.ADAPTER,trainable=False)
        dump(OUTPUT/'reloaded_tensors.json',tensors)
        require(not any(p.requires_grad for p in model.parameters()),'no_grad_required')
        model.config.use_cache=False
        with contextlib.ExitStack() as stack:
            stack.enter_context(patch.object(model,'generate',side_effect=forbidden))
            stack.enter_context(patch.object(torch.Tensor,'backward',side_effect=forbidden))
            stack.enter_context(patch.object(torch.autograd,'backward',side_effect=forbidden))
            stack.enter_context(patch.object(torch.optim.Optimizer,'step',side_effect=forbidden))
            for row,item,mapping,comparison in zip(rows,encoded,mappings,comparisons,strict=True):
                require(time.monotonic()-started<900 and report['forwards_started']<15,'forward_bound')
                start,count=r.assistant_loss_window(item)
                prefix=mapping['prompt_tokens'];require(start==prefix-1 and count==mapping['target_count']+1,'causal_window')
                ids=torch.tensor([item['input_ids']],dtype=torch.long,device='cuda:0')
                report['forwards_started']+=1;report['stage']='teacher_forced:'+row['id'];save()
                with torch.inference_mode():
                    output=model(input_ids=ids,attention_mask=torch.ones_like(ids),
                        logits_to_keep=count,use_cache=False,return_dict=True)
                    require(output.logits.shape[0]==1 and output.logits.shape[1]==count,'causal_logits_count')
                    result=score_logits(output.logits[0,:-1],item['input_ids'][prefix:],mapping,tok)
                torch.cuda.synchronize();report['forwards_completed']+=1
                first=result['first_wrong_target_index'];div=comparison['first_different_target_index']
                comparison['teacher_forced_first_wrong_target_index']=first
                comparison['first_wrong_minus_free_divergence']=first-div if first is not None and div is not None else None
                comparison['teacher_forced_at_free_divergence']=result['tokens'][div] if div is not None and div<len(result['tokens']) else None
                result.update(case_id=row['id'],char_spans=mapping['char_spans'],existing_raw_comparison=comparison,
                    measurement='TEACHER_FORCED_GOLD_CONTEXT_NOT_FREE_GENERATION',forward_count=1)
                dump(OUTPUT/(row['id']+'.json'),result)
                report['cases'].append({k:result[k] for k in ('case_id','target_tokens','mean_nll','top1_correct','top1_accuracy','first_wrong_target_index','field_metrics')})
                save();del ids,output,result
        require(report['forwards_completed']==report['forwards_started']==15,'incomplete_fixed15')
        report.update(status='DIAGNOSTIC_COMPLETE_NO_GENERATION_NO_ADOPTION',
            peak_allocated_bytes=torch.cuda.max_memory_allocated(),peak_reserved_bytes=torch.cuda.max_memory_reserved())
    except BaseException as exc:
        report.update(status='STOPPED_NO_RETRY',error_type=type(exc).__name__,reason=str(exc),traceback=traceback.format_exc())
    finally:
        try:
            if model is not None:
                require(not any(p.requires_grad or p.grad is not None for p in model.parameters()),'grad_effect_detected')
                report['all_parameters_no_grad_and_no_gradients']=True
                model=None;gc.collect();torch.cuda.empty_cache()
                report['model_released_before_final_cpu_hash_verification']=True
            require(time.monotonic()-started<900,'deadline_before_final_hash_verification')
            require(identities and all(sha(p)==h for p,h in identities.items()),'final_sources_or_weights_changed')
            report['all_source_base_metadata_adapter_payload_hashes_unchanged']=True
            report['base_whole_shards_rehashed']=False
            require(time.monotonic()-started<900,'deadline_after_final_hash_verification')
        except BaseException as exc:report.update(status='STOPPED_IDENTITY_UNVERIFIED_NO_RETRY',final_identity_error=str(exc))
        report['processing_seconds']=time.monotonic()-started
        report['process_cost_usd']=report['processing_seconds']*0.28/3600
        if report['processing_seconds']>=900:report['status']='STOPPED_DEADLINE_NO_RETRY'
        report['deadline_scope']='Whole worker bounded by required timeout --signal=TERM --kill-after=10s 890s; internal 900sec timer covers preparation, model load, 15 forwards, metrics, model release and final hashes. Partial checkpoints survive worker termination. Pod remains running.'
        save()
        signal.setitimer(signal.ITIMER_REAL,0)
    print(json.dumps({k:report.get(k) for k in ('status','forwards_completed','processing_seconds','process_cost_usd')}),flush=True)

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--pack',type=Path,required=True)
    p.add_argument('--execute',action='store_true');p.add_argument('--source-commit');a=p.parse_args()
    if a.execute:execute(a.pack.resolve(),a.source_commit)
    else:
        require(os.environ.get('CUDA_VISIBLE_DEVICES')=='','cpu_check_only')
        result=prepare(a.pack.resolve());print(json.dumps(dict(status='CPU_PREPARED_NO_4B_LOAD_FORWARD',cases=len(result[5]),real_4b_model_loads=0,forwards=0,generations=0,optimizer_steps=0)),flush=True)
