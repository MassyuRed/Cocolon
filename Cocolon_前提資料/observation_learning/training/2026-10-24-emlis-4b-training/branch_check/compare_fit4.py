"""One fixed-prefix forward on the rejected fit4 weights; no generation or update."""
from pathlib import Path
import importlib.metadata
import json
import os
import signal
import sys
import time

OLD="a8baf0d310283fd0500e86887e64723e4734693ac48b7f2ddfad7cc07e6a3ea6"
NEW="e3743d6ba5dd715868a5e41d568a1bddb57b307f79a87fdd385eb90d03837d02"


def deadline(*_):
    raise TimeoutError("compare_fit4_900_second_deadline")


def main(directory, fit4, output):
    sys.path.insert(0,str(directory))
    import run_pilot as r
    assert r.digest(directory/'run_pilot.py')=='2f659078c05bee6d7b32f50aae8b9eebc03c767d4a3be084bc17e9e3ccc4c10d'
    assert r.digest(directory/'train_messages.jsonl')=='32cd574649525c1352d870c8f276ed440a2362722e5026fe472254ce3cedea0e'
    raw_path=directory/'results/20261025-043032-a3fef235/after.jsonl'
    assert r.digest(raw_path)=='670aa754f8ef3f6347a5b72353ab7686111630e8c8f1db0eaa9198a4fd40dd61'
    assert {k:importlib.metadata.version(k) for k in r.PINS}==r.PINS
    assert os.environ['HF_HUB_OFFLINE']==os.environ['TRANSFORMERS_OFFLINE']=='1'
    old=directory/'results/20261025-043032-a3fef235/adapter'
    old_hashes=r.adapter_hashes(old);new_hashes=r.adapter_hashes(fit4/'adapter')
    assert old_hashes['adapter_model.safetensors']==OLD and new_hashes['adapter_model.safetensors']==NEW
    previous=Path('/workspace/cocolon_4b_branch_check_20261025/result.json')
    assert r.digest(previous)=='f87981941a0836f44c942e96091dad37cef1d2075f54692e01e56c34a7b774e3'
    prior=json.loads(previous.read_text())
    with (output/'attempt.json').open('x') as stream:
        json.dump({'source_commit':(output/'SOURCE_COMMIT').read_text().strip(),'retry':False},stream)
    started=time.monotonic()
    report=dict(status='STARTED',forward_attempts=0,completed_forwards=0,generated_responses=0,
        training_updates=0,optimizer_created=False,pod_lifecycle_operations=0,
        source_commit=(output/'SOURCE_COMMIT').read_text().strip(),script_sha256=r.digest(__file__),
        old_branch=prior['branch'],old_adapter_sha256=old_hashes,new_adapter_sha256=new_hashes,
        max_seconds=900,interpretation='Same recorded prefix; diagnostic scores are not new generated responses or CMEE acceptance.')
    signal.signal(signal.SIGALRM,deadline);signal.signal(signal.SIGTERM,deadline);signal.alarm(900)
    try:
        import torch
        from transformers import AutoTokenizer
        assert torch.cuda.device_count()==1 and 'A4500' in torch.cuda.get_device_name(0)
        assert torch.cuda.mem_get_info()[0]>=14*2**30
        torch.manual_seed(r.SEED);torch.cuda.manual_seed_all(r.SEED)
        tokenizer=AutoTokenizer.from_pretrained(r.MODEL,revision=r.REVISION,trust_remote_code=False,local_files_only=True)
        messages=r.read_jsonl(directory/'train_messages.jsonl')[1]['messages']
        prompt=r.chat_token_ids(tokenizer,messages[:-1],generation_prompt=True)
        teacher=r.chat_token_ids(tokenizer,messages,generation_prompt=False)[len(prompt):]
        actual=r.read_jsonl(raw_path)[1]['output_token_ids']
        k=next(i for i,(x,y) in enumerate(zip(actual,teacher)) if x!=y)
        assert len(prompt)==5018 and k==1116 and teacher[k]==207727 and actual[k]==198697
        prefix=prompt+actual[:k]
        report.update(prompt_tokens=len(prompt),branch_output_index=k,prefix_tokens=len(prefix),
            shared_prefix_tail=tokenizer.decode(actual[:k],skip_special_tokens=False,clean_up_tokenization_spaces=False)[-150:])
        model,stats=r.load_saved_adapter(fit4/'adapter',new_hashes)
        report['adapter_tensors']=stats
        assert not any(p.requires_grad for p in model.parameters())
        ids=torch.tensor([prefix],device='cuda:0')
        report['forward_attempts']=1;r.write_json(output/'result.json',report)
        with torch.inference_mode():
            logits=model(input_ids=ids,attention_mask=torch.ones_like(ids),logits_to_keep=1,use_cache=False).logits[0,-1].float()
        report['completed_forwards']=1
        logp=logits.log_softmax(-1)
        def info(tid):
            return dict(id=tid,text=tokenizer.decode([tid]),logit=float(logits[tid]),
                probability=float(logp[tid].exp()),log_probability=float(logp[tid]),rank=1+int((logits>logits[tid]).sum()))
        top=torch.topk(logits,10).indices.tolist()
        gap=float(logits[actual[k]]-logits[teacher[k]])
        report.update(status='DIAGNOSTIC_COMPLETE_NOT_QUALITY_ACCEPTED',branch=dict(actual=info(actual[k]),
            teacher=info(teacher[k]),top10=[info(tid) for tid in top],actual_minus_teacher_logit=gap,
            old_actual_minus_teacher_logit=.75,delta_actual_minus_teacher_logit=gap-.75,
            argmax_matches_recorded=top[0]==actual[k]),
            old_adapter_unchanged=r.adapter_hashes(old)==old_hashes,
            new_adapter_unchanged=r.adapter_hashes(fit4/'adapter')==new_hashes)
        assert report['old_adapter_unchanged'] and report['new_adapter_unchanged']
    except BaseException as exc:
        report.update(status='FAILED_NO_RETRY',error=repr(exc));raise
    finally:
        signal.alarm(0);report['seconds']=time.monotonic()-started
        r.write_json(output/'result.json',report)
        print(json.dumps({k:report.get(k) for k in ['status','branch','completed_forwards','seconds','error']},ensure_ascii=False,indent=2),flush=True)
        print('RESULT_SHA256',r.digest(output/'result.json'),flush=True)


if __name__=='__main__':
    main(Path('/workspace/cocolon_4b_unicode_fit32_20261025'),Path('/workspace/cocolon_4b_reception_fit4_20261025'),Path(__file__).resolve().parent)
