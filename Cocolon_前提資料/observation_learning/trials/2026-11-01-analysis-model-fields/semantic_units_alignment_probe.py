"""No training or generation: inspect four taught targets in the saved serving model."""
import argparse
from dataclasses import asdict
import gc
import hashlib
import inspect
import json
import os
from pathlib import Path
import signal
import sys
import threading
import time
import traceback

sys.dont_write_bytecode=True
os.environ['HF_HUB_OFFLINE']='1'
os.environ['TRANSFORMERS_OFFLINE']='1'

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    for name in ('api-root','teaching-result','plan','out'):ap.add_argument('--'+name,required=True,type=Path)
    ap.add_argument('--plan-sha256',required=True);args=ap.parse_args()
    assert not args.out.exists() and sha(args.plan)==args.plan_sha256
    plan=json.loads(args.plan.read_text());assert plan['max_forwards']==6 and plan['max_seconds']==300
    assert plan['training_updates']==plan['new_generations']==0
    for name,digest in plan['input_file_sha256'].items():assert sha(args.teaching_result/name)==digest
    for name,digest in plan['api_source_blobs'].items():
        b=(args.api_root/name).read_bytes();assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==digest
    loader=(args.api_root/'ai/tools/serve_emlis_natural_reply.py').read_bytes()
    assert hashlib.sha1(b'blob '+str(len(loader)).encode()+b'\0'+loader).hexdigest()==plan['source_loader_git_blob']
    config=json.loads((args.teaching_result/'result/adapter/adapter_config.json').read_text())
    assert config['lora_dropout']==0.0
    initial={n:sha(args.teaching_result/'result/adapter'/n) for n in ['adapter_model.safetensors','adapter_config.json']}
    assert initial['adapter_model.safetensors']==plan['weights_sha256'] and initial['adapter_config.json']==plan['config_sha256']
    args.out.mkdir();start=time.monotonic();report=dict(status='STARTED',training_updates=0,new_generations=0,forwards=0,teachers=[],plan_sha256=args.plan_sha256,runner_sha256=sha(__file__),model_adopted=False)
    def save():
        report['process_seconds']=time.monotonic()-start;p=args.out/'report.json';tmp=p.with_suffix('.tmp');tmp.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');tmp.replace(p)
    def expired(*_):raise TimeoutError('alignment_deadline')
    signal.signal(signal.SIGTERM,expired);signal.signal(signal.SIGALRM,expired);signal.setitimer(signal.ITIMER_REAL,300);save()
    generator=model=tokenizer=None
    try:
        sys.path[:0]=[str(args.api_root/'ai/tools'),str(args.api_root/'ai/services/ai_inference')]
        from serve_emlis_natural_reply import load_generator
        import torch
        import torch.nn.functional as F
        pack=json.loads((args.teaching_result/'semantic_units_teaching32_plan.json').read_text())
        encoded=json.loads((args.teaching_result/'result/encoded_training.json').read_text())
        trained=json.loads((args.teaching_result/'result/report.json').read_text())
        generator=load_generator(str(args.teaching_result/'result/adapter'),threading.Event(),weights_sha256=plan['weights_sha256'],config_sha256=plan['config_sha256'])
        # Reuse the exact existing serving loader/model/tokenizer. This is a
        # private diagnostic read of its known closure, never a new model owner.
        closure=inspect.getclosurevars(generator).nonlocals;model=closure['model'];tokenizer=closure['tokenizer']
        assert not model.training and not any(p.requires_grad for p in model.parameters())
        report.update(serving_loader='EXISTING_LOAD_GENERATOR_NONTRAINING_112_TENSORS_VERIFIED',gpu=torch.cuda.get_device_name(0),
            actual_flags=dict(training=model.training,any_requires_grad=any(p.requires_grad for p in model.parameters()),lora_dropout={k:v.lora_dropout for k,v in model.peft_config.items()},gradient_checkpointing=getattr(model,'is_gradient_checkpointing',None),config_use_cache=model.config.use_cache),
            cache_comparison_scope='Short-prefix prefill with/without returning cache, not incremental cached generation replay',
            raw_token_scope='Retokenized saved raw text for local prefix diagnostics, not original generation token IDs')
        def distribution(logits,gold,alternative=None):
            logits=logits.float();logz=torch.logsumexp(logits,dim=-1)
            values,ids=torch.topk(logits,5)
            result=dict(target_id=gold,target_text=tokenizer.decode([gold],skip_special_tokens=False),target_probability=float(torch.exp(logits[gold]-logz)),target_rank=int((logits>logits[gold]).sum().item()+1),top5=[dict(id=int(i),text=tokenizer.decode([int(i)],skip_special_tokens=False),probability=float(torch.exp(v-logz))) for v,i in zip(values,ids)])
            if alternative is not None:result['raw_retokenized_alternative']=dict(id=alternative,text=tokenizer.decode([alternative],skip_special_tokens=False),probability=float(torch.exp(logits[alternative]-logz)),rank=int((logits>logits[alternative]).sum().item()+1))
            return result
        def forward(ids,count,cache=False):
            assert report['forwards']<6 and time.monotonic()-start<295
            report['forwards']+=1;save();x=torch.tensor([ids],device='cuda:0',dtype=torch.long)
            with torch.inference_mode():out=model(input_ids=x,attention_mask=torch.ones_like(x),logits_to_keep=count,use_cache=cache)
            logits=out.logits[0].detach().cpu();del out,x;return logits
        for tid in plan['teacher_ids']:
            t=next(x for x in pack['teachers'] if x['id']==tid);e=next(x for x in pack['evaluation'] if x['probe_id']=='REHEARSAL_'+tid)
            sent=json.loads((args.teaching_result/'result'/('after_REHEARSAL_'+tid+'.request.json')).read_text())
            assert t['messages']==e['messages']==sent['messages'] and t['request_ref']==e['request_ref']==sent['request_ref']
            prompt=tokenizer.apply_chat_template(t['messages'],enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
            full=tokenizer.apply_chat_template(t['messages']+[dict(role='assistant',content=t['assistant_target'])],enable_thinking=False,add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
            stored=encoded[tid];assert full==stored['input_ids'] and full[:len(prompt)]==prompt
            assert stored['labels']==[-100]*len(prompt)+full[len(prompt):]
            target=full[len(prompt):];assert len(target)+1==stored['logits_positions'] and stored['loss_start']==len(prompt)-1
            assert tokenizer.decode(target,skip_special_tokens=False,clean_up_tokenization_spaces=False)==t['assistant_target']+'<|im_end|>\n'
            logits=forward(full,len(target)+1)[:-1];gold=torch.tensor(target);ce=F.cross_entropy(logits.float(),gold,reduction='none')
            raw=(args.teaching_result/'result'/('after_REHEARSAL_'+tid+'.raw.txt')).read_text()
            rawfull=tokenizer.apply_chat_template(t['messages']+[dict(role='assistant',content=raw)],enable_thinking=False,add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
            assert rawfull[:len(prompt)]==prompt;rawids=rawfull[len(prompt):]
            common=0
            while common<min(len(target),len(rawids)) and target[common]==rawids[common]:common+=1
            old=trained['measurements'][-1]['losses'][tid]
            row=dict(teacher_id=tid,messages_request_ref_prompt_ids_full_ids_mask_and_terminator='EXACT_MATCH',json_target_equals_raw=json.loads(t['assistant_target'])==json.loads(raw),prompt_tokens=len(prompt),target_tokens=len(target),unweighted_nll=float(ce.mean()),saved_after_nll=old,nll_delta=float(ce.mean())-old,teacher_prefix_top1_correct=int((logits.argmax(-1)==gold).sum()),retokenized_raw_first_difference=common,
                highest_ce=[dict(target_index=int(i),ce=float(ce[i]),**distribution(logits[i],target[int(i)])) for i in torch.topk(ce,min(8,len(target))).indices])
            if tid=='AT29':
                assert common<len(target) and common<len(rawids)
                row['first_difference_full_teacher_prefix']=distribution(logits[common],target[common],rawids[common])
                row['first_difference_text_context']=dict(teacher=tokenizer.decode(target[max(0,common-15):common+15],skip_special_tokens=False,clean_up_tokenization_spaces=False),raw=tokenizer.decode(rawids[max(0,common-15):common+15],skip_special_tokens=False,clean_up_tokenization_spaces=False))
                prefix=full[:len(prompt)+common]
                row['first_difference_short_prefix']={}
                for cache in (False,True):
                    v=forward(prefix,1,cache=cache)[0]
                    row['first_difference_short_prefix'][str(cache)]=distribution(v,target[common],rawids[common])
                # Locate the taught unique object quote in actual decoded
                # teacher-token prefixes; never rewrite or repair the raw.
                decoded=[tokenizer.decode(target[:i],skip_special_tokens=False,clean_up_tokenization_spaces=False) for i in range(len(target)+1)]
                needle='部屋を';pos=t['assistant_target'].index(needle)
                lo=next(i for i,v in enumerate(decoded) if len(v)>pos)-1
                hi=next(i for i,v in enumerate(decoded) if len(v)>=pos+len(needle))
                row['unique_object_quote_tokens']=[dict(target_index=i,ce=float(ce[i]),**distribution(logits[i],target[i])) for i in range(max(0,lo-1),min(len(target),hi+1))]
            report['teachers'].append(row);save()
        assert report['forwards']==6 and initial=={n:sha(args.teaching_result/'result/adapter'/n) for n in initial}
        report['adapter_unchanged']=True;report['status']='COMPLETE_NO_TRAINING_NO_GENERATION_PENDING_ROOT_READ'
    except BaseException as exc:
        report.update(status='FAILED_NO_TRAINING_NO_GENERATION',error_type=type(exc).__name__,error=str(exc),traceback=traceback.format_exc());raise
    finally:
        generator=model=tokenizer=None;gc.collect();save();signal.setitimer(signal.ITIMER_REAL,0)
if __name__=='__main__':main()
