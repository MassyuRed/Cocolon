"""One bounded continuation from saved LoRA; no Pod lifecycle operation."""
from pathlib import Path
import gc, hashlib, importlib.metadata, json, random, signal, sys, time, uuid

INITIAL = '06ca6381828841edd2b9c8237c3f7dc61f8242cba42eb8f9047d651fd5dc5749'
FIT_IDS = ['FIT-FT-CHAIR-INITIAL', 'FIT-FT-CHAIR-AFTER-CORRECTION']

def on_timeout(signum, frame):
    raise TimeoutError('bounded_continuation_deadline_or_termination')

def validate(plan):
    import run_pilot as r
    if (plan.get('schema') != 'cocolon.4b_continued_fit32.v1'
            or plan.get('status') != 'AUTHORIZED_ONCE_CURRENT_MASH_CONTINUATION'
            or plan.get('model') != r.MODEL or plan.get('revision') != r.REVISION
            or plan.get('initial_adapter_sha256') != INITIAL
            or plan.get('distinct_targets') != 2 or type(plan.get('passes')) is not int
            or plan['passes'] != 16 or plan.get('max_optimizer_steps') != 32
            or plan.get('generation_case_ids') != FIT_IDS
            or plan.get('context_tokens') != 8192 or plan.get('max_new_tokens') != 2048
            or plan.get('max_seconds') != 1800 or plan.get('gpu_hourly_usd') != .26
            or plan.get('max_total_usd') != 1 or plan.get('gpu_run_authorized') is not True
            or plan.get('automatic_pod_stop') is not False):
        raise ValueError('fixed_continuation_plan_mismatch')
    if plan['max_seconds'] * plan['gpu_hourly_usd'] / 3600 > plan['max_total_usd']:
        raise ValueError('process_budget_exceeded')
    return plan

def main(directory, initial_adapter, baseline_raw):
    sys.path.insert(0, str(directory))
    import run_pilot as r
    from export_checkpoint import export
    p = validate(r.strict_json((directory/'continued_fit_plan.json').read_text()))
    examples, evaluation, manifest, hashes = r.validate_data(directory)
    assert [e['id'] for e in examples] == [x[4:] for x in FIT_IDS]
    assert r.digest(directory/'dataset_manifest.json') == p['dataset_manifest_sha256']
    assert r.digest(baseline_raw) == p['baseline_raw_sha256']
    before = r.read_jsonl(baseline_raw)
    assert [x['case_id'] for x in before] == FIT_IDS
    assert all(x['adapter_revision'] == INITIAL for x in before)
    old_hashes = r.adapter_hashes(initial_adapter)
    assert old_hashes['adapter_model.safetensors'] == INITIAL
    assert {k:importlib.metadata.version(k) for k in r.PINS} == r.PINS
    source = (directory/'SOURCE_COMMIT').read_text().strip()
    assert len(source) == 40 and all(c in '0123456789abcdef' for c in source)
    import torch
    from transformers import AutoTokenizer
    from peft import PeftModel
    gpu = r.gpu_profile(torch, p)
    tokenizer = AutoTokenizer.from_pretrained(r.MODEL, revision=r.REVISION, trust_remote_code=False, local_files_only=True)
    encoded=[]; token_stats=[]
    for e in examples:
        item, prefix = r.encode_training(tokenizer, e['messages'], context=8192)
        assert prefix + 2048 <= 8192
        encoded.append(item);token_stats.append({'id':e['id'],'prompt_tokens':prefix,'target_tokens':len(item['input_ids'])-prefix})
    assert [x['prompt_tokens'] for x in token_stats] == [1409,3526]
    with (directory/'continued_fit_attempt.json').open('x') as stream:
        json.dump({'source':source,'started_unix':time.time()},stream)
    out=directory/'results'/(time.strftime('%Y%m%d-%H%M%S',time.gmtime())+'-'+uuid.uuid4().hex[:8]);out.mkdir(parents=True)
    (out/'before.jsonl').write_bytes(baseline_raw.read_bytes())
    r.write_json(out/'continued_fit_plan.json',p)
    r.write_json(out/'continuation_source.json',{'text':Path(__file__).read_text(),'sha256':r.digest(__file__)})
    report={'status':'RUNNING','run_id':out.name,'model':r.MODEL,'revision':r.REVISION,'semantic_profile':r.PROFILE,
        'source_commit':source,'api_commit':manifest['cmee_api_commit'],'plan':p,'gpu':gpu,'started_unix':time.time(),
        'distinct_targets':2,'passes':16,'optimizer_steps_planned':32,'optimizer_steps_completed':0,
        'initial_adapter_sha256':old_hashes,'strict_optimizer_resume':False,'new_optimizer':True,
        'baseline_reused_no_regeneration':True,'baseline_raw_sha256':r.digest(baseline_raw),'new_generations_planned':2,
        'data_sha256':hashes,'token_stats':token_stats,'input_cases':r.teacher_fit_cases(examples),'pod_stopped':False}
    def save(): r.write_json(out/'run.json',report)
    save()
    signal.signal(signal.SIGALRM, on_timeout)
    signal.signal(signal.SIGTERM, on_timeout)
    signal.alarm(1800)
    try:
        random.seed(r.SEED);torch.manual_seed(r.SEED);torch.cuda.manual_seed_all(r.SEED);torch.cuda.reset_peak_memory_stats()
        config=r.strict_json((initial_adapter/'adapter_config.json').read_text())
        assert config['base_model_name_or_path']==r.MODEL and set(config['target_modules'])==r.EXPECTED_TARGETS
        model=PeftModel.from_pretrained(r.load_base(),initial_adapter,is_trainable=True,local_files_only=True)
        model.eval();r.measure_nll(model,examples,encoded,out/'before_nll.jsonl')
        trainable=[(n,p_) for n,p_ in model.named_parameters() if p_.requires_grad]
        assert len(trainable)==32 and all('lora_' in n and '.self_attn.' in n for n,_ in trainable)
        assert all(torch.isfinite(p_).all().item() for _,p_ in trainable)
        report['trainable_parameters']=[{'name':n,'shape':list(p_.shape),'dtype':str(p_.dtype)} for n,p_ in trainable];save()
        model.config.use_cache=False;model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={'use_reentrant':False})
        model.enable_input_require_grads();model.train()
        optimizer=torch.optim.AdamW([p_ for _,p_ in trainable],lr=1e-4,weight_decay=0.0)
        rng=random.Random(r.SEED);step=0
        with (out/'training.jsonl').open('x') as stream:
            for pass_index in range(16):
                order=list(range(2));rng.shuffle(order)
                for index in order:
                    item=encoded[index];ids=torch.tensor([item['input_ids']],dtype=torch.long,device='cuda:0')
                    labels=torch.tensor([item['labels']],dtype=torch.long,device='cuda:0');optimizer.zero_grad(set_to_none=True)
                    loss=r.teacher_loss(model,input_ids=ids,attention_mask=torch.ones_like(ids),labels=labels,encoded=item)
                    assert torch.isfinite(loss).item();loss.backward()
                    norm=float(torch.nn.utils.clip_grad_norm_([p_ for _,p_ in trainable],1.0,error_if_nonfinite=True).cpu())
                    assert 0 < norm < float('inf');optimizer.step();step+=1
                    stream.write(json.dumps({'step':step,'pass':pass_index+1,'id':examples[index]['id'],'loss':float(loss.detach().cpu()),'gradient_norm':norm})+'\n');stream.flush()
                    report['optimizer_steps_completed']=step;save();del ids,labels,loss
        assert step==32;optimizer.zero_grad(set_to_none=True);del optimizer
        model.save_pretrained(out/'adapter',safe_serialization=True)
        report.update(stage='ADAPTER_SAVED',adapter_sha256=r.adapter_hashes(out/'adapter'));save();export(directory,out)
        del model,trainable;gc.collect();torch.cuda.empty_cache()
        model,stats=r.load_saved_adapter(out/'adapter',report['adapter_sha256'])
        report.update(stage='NON_TRAINABLE_RELOAD',reloaded_adapter_tensors=stats);save()
        r.measure_nll(model,examples,encoded,out/'after_nll.jsonl')
        r.evaluate(model,tokenizer,r.teacher_fit_cases(examples),out/'after.jsonl',p,adapter_revision=report['adapter_sha256']['adapter_model.safetensors'])
        assert r.adapter_hashes(initial_adapter)==old_hashes and r.adapter_hashes(out/'adapter')==report['adapter_sha256']
        report.update(status='DIAGNOSTIC_COMPLETE_NOT_QUALITY_ACCEPTED',old_adapter_unchanged=True,adapter_files_unchanged=True,
            peak_allocated_gib=torch.cuda.max_memory_allocated()/2**30,peak_reserved_gib=torch.cuda.max_memory_reserved()/2**30,
            seconds=time.time()-report['started_unix'],new_generations=2)
        save();export(directory,out);print('CONTINUED_FIT32_COMPLETE',out,flush=True)
    except BaseException as exc:
        report.update(status='FAILED_NO_RETRY',error=repr(exc),seconds=time.time()-report['started_unix']);save()
        export(directory,out,allow_missing_adapter=True);raise
    finally: signal.alarm(0)

if __name__=='__main__':
    directory,initial_adapter,baseline_raw=map(Path,sys.argv[1:]);main(directory,initial_adapter,baseline_raw)
