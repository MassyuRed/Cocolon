"""One four-update reception-loss candidate; original full input/teacher retained."""
from pathlib import Path
import gc
import hashlib
import importlib.metadata
import json
import os
import signal
import sys
import tarfile
import time

OLD = "a8baf0d310283fd0500e86887e64723e4734693ac48b7f2ddfad7cc07e6a3ea6"
TRAIN = "32cd574649525c1352d870c8f276ed440a2362722e5026fe472254ce3cedea0e"
RAW = "670aa754f8ef3f6347a5b72353ab7686111630e8c8f1db0eaa9198a4fd40dd61"


def deadline(*_):
    raise TimeoutError("reception_fit4_1800_second_deadline")


def select_reception(full, prefix, text_ids, offsets, text):
    packet = json.loads(text)
    reception = packet["candidate"]["surface_proposal"]["reception"]
    a = text.index('"reception":"') + len('"reception":"')
    b = a + len(reception)
    assert text[a:b] == reception
    assert full[prefix:prefix+len(text_ids)] == text_ids
    indexes = [i for i, (s, e) in enumerate(offsets) if s >= a and e <= b and e > s]
    assert indexes and indexes == list(range(indexes[0], indexes[-1]+1))
    assert offsets[indexes[0]][0] == a and offsets[indexes[-1]][1] == b
    labels = [-100] * len(full)
    for i in indexes:
        labels[prefix+i] = full[prefix+i]
    start = prefix + indexes[0] - 1
    assert sum(x != -100 for x in labels) == len(indexes)
    assert labels[:start+1] == [-100] * (start+1)
    return dict(input_ids=full, labels=labels, loss_start=start,
        logits_positions=len(full)-start, reception_tokens=len(indexes),
        reception=reception, full_context_tokens=len(full),
        prompt_tokens=prefix, teacher_eos_retained=True)


def main(directory, output):
    started = time.monotonic()
    sys.path.insert(0, str(directory))
    import run_pilot as r
    assert output.is_dir() and output != directory
    plan = json.loads((output / "plan.json").read_text())
    assert plan["status"] == "AUTHORIZED_ONCE_CURRENT_MASH_CONTINUATION"
    assert plan["updates"] == 4 and plan["learning_rate"] == 1e-5
    assert plan["loss_scope"] == "UNCHANGED_TEACHER_RECEPTION_TOKENS_ONLY"
    assert not plan["retry"] and not plan["automatic_pod_stop"]
    assert os.environ["HF_HUB_OFFLINE"] == os.environ["TRANSFORMERS_OFFLINE"] == "1"
    assert r.digest(directory / "run_pilot.py") == "2f659078c05bee6d7b32f50aae8b9eebc03c767d4a3be084bc17e9e3ccc4c10d"
    assert r.digest(directory / "train_messages.jsonl") == TRAIN
    baseline = directory / "results/20261025-043032-a3fef235/after.jsonl"
    assert r.digest(baseline) == RAW
    old = directory / "results/20261025-043032-a3fef235/adapter"
    old_hashes = r.adapter_hashes(old)
    assert old_hashes["adapter_model.safetensors"] == OLD
    assert {k: importlib.metadata.version(k) for k in r.PINS} == r.PINS
    with (output / "attempt.json").open("x") as stream:
        json.dump({"started_unix":time.time(), "retry":False}, stream)
    report = dict(status="STARTED", source_commit=(output/"SOURCE_COMMIT").read_text().strip(), api_commit=plan["api_commit"],
        original_training_source=(directory / "SOURCE_COMMIT").read_text().strip(), actual_plan=plan,
        script_sha256=r.digest(__file__), old_adapter_sha256=old_hashes,
        optimizer_steps_completed=0, generation_calls_started=0, generated_responses=0,
        new_optimizer=True, exact_optimizer_resume=False, pod_lifecycle_operations=0,
        model=r.MODEL, revision=r.REVISION, seed=r.SEED, baseline_raw_sha256=RAW,
        training_messages_sha256=TRAIN, product_accepted=False)
    def save():
        r.write_json(output / "run.json", report)
    def loss(model, item):
        ids = torch.tensor([item["input_ids"]], device="cuda:0")
        labels = torch.tensor([item["labels"]], device="cuda:0")
        assert int((labels != -100).sum()) == item["reception_tokens"]
        return model(input_ids=ids, attention_mask=torch.ones_like(ids),
            labels=labels[:,item["loss_start"]:],
            logits_to_keep=item["logits_positions"], use_cache=False).loss
    def measure(model, items, name):
        model.eval()
        rows=[]
        for i,item in enumerate(items):
            with torch.inference_mode():
                value=float(loss(model,item).detach().cpu())
            rows.append(dict(id=examples[i]["id"],reception_tokens=item["reception_tokens"],nll=value))
        r.write_json(output / name, rows)
        return rows
    def export():
        files=[p for p in output.rglob('*') if p.is_file() and not p.is_symlink()
            and p.name not in {"checkpoint.tar.gz","file_manifest.json"} and '__pycache__' not in p.parts]
        r.write_json(output / "file_manifest.json",{str(p.relative_to(output)):
            dict(sha256=r.digest(p),bytes=p.stat().st_size) for p in sorted(files)})
        with tarfile.open(output / "checkpoint.tar.gz","w:gz") as archive:
            for p in files+[output / "file_manifest.json"]:
                archive.add(p,arcname=str(p.relative_to(output)),recursive=False)
    signal.signal(signal.SIGALRM,deadline)
    signal.signal(signal.SIGTERM,deadline)
    signal.alarm(1800)
    try:
        import torch
        from transformers import AutoTokenizer
        from peft import PeftModel
        assert torch.cuda.device_count()==1 and "A4500" in torch.cuda.get_device_name(0)
        free,total=torch.cuda.mem_get_info()
        assert free>=14*2**30
        torch.manual_seed(r.SEED)
        torch.cuda.manual_seed_all(r.SEED)
        tokenizer=AutoTokenizer.from_pretrained(r.MODEL,revision=r.REVISION,
            trust_remote_code=False,local_files_only=True)
        examples=r.read_jsonl(directory / "sft_examples.jsonl")
        messages=r.read_jsonl(directory / "train_messages.jsonl")
        assert len(examples)==len(messages)==2
        assert [e['id'] for e in examples]==['FT-CHAIR-INITIAL','FT-CHAIR-AFTER-CORRECTION']
        assert [e['messages'] for e in examples]==[m['messages'] for m in messages]
        items=[]
        for e in examples:
            encoded,prefix=r.encode_training(tokenizer,e['messages'],context=8192)
            text=e['messages'][-1]['content'].strip()
            enc=tokenizer(text,add_special_tokens=False,return_offsets_mapping=True)
            items.append(select_reception(encoded['input_ids'],prefix,enc['input_ids'],enc['offset_mapping'],text))
        assert [i['prompt_tokens'] for i in items]==[1995,5018]
        report['masked_training_inputs']=[{k:v for k,v in item.items() if k not in ['input_ids','labels']} for item in items]
        report['gpu']=dict(name=torch.cuda.get_device_name(0),free_before=free,total=total)
        for name in ['run_pilot.py','train_messages.jsonl','sft_examples.jsonl','dataset_manifest.json','SOURCE_COMMIT']:
            (output / ('original_'+name)).write_bytes((directory/name).read_bytes())
        (output/'before.jsonl').write_bytes(baseline.read_bytes())
        torch.cuda.reset_peak_memory_stats()
        model=PeftModel.from_pretrained(r.load_base(),old,is_trainable=True,local_files_only=True)
        trainable=[(n,p) for n,p in model.named_parameters() if p.requires_grad]
        assert len(trainable)==32 and all('lora_' in n and '.self_attn.' in n for n,p in trainable)
        assert all(torch.isfinite(p).all().item() for n,p in trainable)
        report['trainable_parameters']=[dict(name=n,shape=list(p.shape),dtype=str(p.dtype)) for n,p in trainable]
        report['before_reception_nll']=measure(model,items,'before_reception_nll.json')
        save()
        model.config.use_cache=False
        model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={'use_reentrant':False})
        model.enable_input_require_grads()
        model.train()
        optimizer=torch.optim.AdamW([p for n,p in trainable],lr=1e-5,weight_decay=0.0)
        with (output/'training.jsonl').open('x') as stream:
            for step,index in enumerate([0,1,0,1],1):
                optimizer.zero_grad(set_to_none=True)
                value=loss(model,items[index])
                assert torch.isfinite(value).item()
                value.backward()
                norm=float(torch.nn.utils.clip_grad_norm_([p for n,p in trainable],1.,error_if_nonfinite=True).cpu())
                assert 0 < norm < float('inf')
                optimizer.step()
                report['optimizer_steps_completed']=step
                stream.write(json.dumps(dict(step=step,id=examples[index]['id'],loss=float(value.detach().cpu()),gradient_norm=norm))+'\n')
                stream.flush()
                save()
                del value
        optimizer.zero_grad(set_to_none=True)
        del optimizer
        model.save_pretrained(output/'adapter',safe_serialization=True)
        report.update(stage='ADAPTER_SAVED',adapter_sha256=r.adapter_hashes(output/'adapter'))
        save()
        export()
        del model,trainable
        gc.collect()
        torch.cuda.empty_cache()
        model,stats=r.load_saved_adapter(output/'adapter',report['adapter_sha256'])
        report['reloaded_adapter_tensors']=stats
        report['after_reception_nll']=measure(model,items,'after_reception_nll.json')
        report['generation_calls_started']=None
        save()
        r.evaluate(model,tokenizer,r.teacher_fit_cases(examples),output/'after.jsonl',
            dict(max_new_tokens=2048,context_tokens=8192),
            adapter_revision=report['adapter_sha256']['adapter_model.safetensors'])
        rows=r.read_jsonl(output/'after.jsonl')
        assert len(rows)==2 and r.adapter_hashes(old)==old_hashes
        assert r.adapter_hashes(output/'adapter')==report['adapter_sha256'] and r.digest(baseline)==RAW
        report.update(status='DIAGNOSTIC_COMPLETE_NOT_QUALITY_ACCEPTED',generation_calls_started=2,
            generated_responses=2,old_adapter_unchanged=True,new_adapter_unchanged_after_reload=True,
            raw_unchanged=True,peak_allocated_gib=torch.cuda.max_memory_allocated()/2**30,
            peak_reserved_gib=torch.cuda.max_memory_reserved()/2**30)
    except BaseException as exc:
        report.update(status='FAILED_NO_RETRY',error=repr(exc))
        raise
    finally:
        signal.alarm(0)
        report['seconds']=time.monotonic()-started
        report['completed_raw_rows']=0
        if (output/'after.jsonl').is_file():
            for line in (output/'after.jsonl').read_text().splitlines():
                try:
                    json.loads(line)
                except (ValueError,TypeError):
                    report['incomplete_raw_row']=True
                else:
                    report['completed_raw_rows']+=1
        save()
        export()
        print('RECEPTION_FIT4',report['status'],'steps',report['optimizer_steps_completed'],flush=True)
        print('SECONDS',report['seconds'],flush=True)
        print('ARCHIVE_SHA256',r.digest(output/'checkpoint.tar.gz'),flush=True)


if __name__=='__main__':
    main(Path(sys.argv[1]),Path(__file__).resolve().parent)
