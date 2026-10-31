"""Two original-full-teacher suffix CE updates, save/reload and unconditional full2 plus old9."""
import argparse
import gc
import hashlib
import importlib.util
import json
import math
import os
from pathlib import Path
import random
import signal
import sys
import time
import traceback
from unittest.mock import patch

sys.dont_write_bytecode = True
HERE = Path(__file__).resolve().parent
OUTPUT = Path('/workspace/cocolon_suffix2_run_20261029')
FULL_IDS = ['FT-BOOK-AFTER-ANSWER', 'FT-SHOP-AFTER-ANSWER']
OLD_IDS = ['TRAIN-SERVICE-CHAIR-01-INITIAL', 'TRAIN-SERVICE-CHAIR-01-CORRECTION', 'TRAIN-SERVICE-CHAIR-02-INITIAL', 'TRAIN-SERVICE-CHAIR-02-CORRECTION', 'TRAIN-SERVICE-CHAIR-03-INITIAL', 'TRAIN-SERVICE-CHAIR-03-CORRECTION', 'TRAIN-DAILY-CALM-01-INITIAL', 'TRAIN-DAILY-CALM-02-INITIAL', 'TRAIN-DAILY-CALM-03-INITIAL']
CAPS = {'TRAIN-SERVICE-CHAIR-01-INITIAL': 2560, 'TRAIN-SERVICE-CHAIR-01-CORRECTION': 2560, 'TRAIN-SERVICE-CHAIR-02-INITIAL': 2560, 'TRAIN-SERVICE-CHAIR-02-CORRECTION': 2560, 'TRAIN-SERVICE-CHAIR-03-INITIAL': 2560, 'TRAIN-SERVICE-CHAIR-03-CORRECTION': 2560, 'TRAIN-DAILY-CALM-01-INITIAL': 2560, 'TRAIN-DAILY-CALM-02-INITIAL': 2560, 'TRAIN-DAILY-CALM-03-INITIAL': 2560, 'FT-BOOK-AFTER-ANSWER': 3712, 'FT-SHOP-AFTER-ANSWER': 3584}
ORDER = FULL_IDS
INITIAL_ADAPTER = {'README.md':'7716b0151793769140a76026939437398273346aefc3e5f75bb8ab2833b42885','adapter_config.json':'a08f36c4b7f29abc7d85564e876ff7b90ce7fe6aa641ffe1b25fb56c908809db','adapter_model.safetensors':'f4932d3a2bac1d8e78d0bf86579868e29546914512234d31556840eb28a85c19'}
BASE_BUNDLE = Path('/workspace/cocolon_auxiliary4_20261029')
ROLE_PACK = Path('/workspace/cocolon_role18_pack_20261029')
PROBE_PACK = Path('/workspace/cocolon_boundary_probe4_pack_20261029')
AF = Path('/workspace/cocolon_auxiliary_fit8_run_20261029/adapter')
STARTS = {'FT-BOOK-AFTER-ANSWER':6699,'FT-SHOP-AFTER-ANSWER':7066}
FIXED = dict(schema='cocolon.original_full_suffix2_once.v1',pod_id='vgkm402msgroiu',expected_gpu_name='NVIDIA RTX A5000',gpu_hourly_usd=.28,max_seconds=1800,parent_timeout_seconds=1790,parent_kill_after_seconds=10,max_process_usd=.14,per_generation_seconds=180,context_tokens=8192,optimizer_steps=2,update_order=ORDER,generation_order=FULL_IDS+OLD_IDS,max_model_calls=11,max_new_tokens_by_case=CAPS,model_loads=2,learning_rate=5e-5,seed=20261024,gradient_clip=1.,weight_decay=0.,training_loss='original_full_tokens_updates_boundary_through_eos_suffix_ce',optimizer_resume=False,initial_adapter_sha256=INITIAL_ADAPTER['adapter_model.safetensors'],api_commit='7b9ee073de03940ba71587297d8600b2b6094dd1',output_directory=str(OUTPUT),retry=False,automatic_progression=False,product_credit=0,sql_operations=0,gpu_lifecycle_operations=0)


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def require(ok, reason):
    if not ok:
        raise ValueError(reason)


def write(path, value):
    temp = path.with_suffix(path.suffix + '.tmp')
    temp.write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + '\n', encoding='utf-8')
    temp.replace(path)


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    sys.modules[name] = result
    spec.loader.exec_module(result)
    return result


def validate(bundle, initial_adapter, execution=False):
    from types import SimpleNamespace
    probe=load('suffix2_existing_probe', PROBE_PACK/'probe4.py')
    args=SimpleNamespace(role_pack=ROLE_PACK,bundle=bundle,initial_adapter=AF,adapter=initial_adapter)
    runner,prior,helper,rows,bound=probe.owners(args)
    require(helper.adapter_hashes(initial_adapter)==INITIAL_ADAPTER,'suffix2_start_changed')
    require(sha(PROBE_PACK/'prepared_cpu.json')=='b03a26bd2ae402b89cad6426595fb8b118e45df97c0b2a9cbf9b6acc27900c94','probe_cpu_changed')
    bound[PROBE_PACK/'prepared_cpu.json']=sha(PROBE_PACK/'prepared_cpu.json')
    bound[HERE/'run_suffix2.py']=sha(HERE/'run_suffix2.py')
    plan=dict(FIXED)
    if execution:
        cpu=json.loads((HERE/'cpu_check.json').read_text())
        require(cpu['status']=='CPU_SUFFIX2_READY_NO_MODEL' and cpu['source_sha256']==sha(__file__),'suffix2_cpu_not_ready')
        require(all(sha(p)==h for p,h in cpu['frozen'].items()),'suffix2_cpu_inputs_changed')
        plan['cpu_check_sha256']=sha(HERE/'cpu_check.json')
        plan['runner_sha256']=sha(__file__)
    return plan,prior,rows,bound

def suffix_encoded(helper,tokenizer,row):
    item,prompt=helper.encode_training(tokenizer,row['messages'],context=8192)
    start=STARTS[row['id']]
    old=json.loads((PROBE_PACK/'prepared_cpu.json').read_text())
    prefix=next(c for c in old['cases'] if c['case_id']==row['id'] and c['condition']=='GOLD_MEANING')
    require(item['input_ids'][:start]==prefix['input_ids'],'suffix2_prefix_changed')
    require(len(item['input_ids'])=={'FT-BOOK-AFTER-ANSWER':7300,'FT-SHOP-AFTER-ANSWER':7777}[row['id']],'suffix2_total_changed')
    require(item['labels'][:prompt]==[-100]*prompt and item['labels'][prompt:]==item['input_ids'][prompt:],'original_labels_changed')
    item['labels']=[-100]*start+item['input_ids'][start:]
    loss_start,count=helper.assistant_loss_window(item)
    require(loss_start==start-1 and count==len(item['input_ids'])-start+1,'suffix2_causal_window')
    require(item['input_ids'][start:].count(tokenizer.eos_token_id)==1,'suffix2_eos')
    require(tokenizer.decode(item['input_ids'][prompt:start],skip_special_tokens=False,clean_up_tokenization_spaces=False)==prefix['given_prefix'],'suffix2_full_prefix')
    return item

def prepare(bundle,initial_adapter,cmee_root):
    started=time.monotonic()
    require(not (HERE/'cpu_check.json').exists(),'suffix2_cpu_already_run')
    plan,prior,rows,bound=validate(bundle,initial_adapter)
    helper=prior.module('suffix2_prepare_helper',bundle/'support/run_pilot.py')
    import importlib.metadata
    import torch
    from transformers import AutoTokenizer
    require(os.environ.get('CUDA_VISIBLE_DEVICES')=='' and not torch.cuda.is_initialized(),'cpu_only_required')
    require({n:importlib.metadata.version(n) for n in helper.PINS}==helper.PINS,'dependency_changed')
    tokenizer=AutoTokenizer.from_pretrained(helper.MODEL,revision=helper.REVISION,local_files_only=True,trust_remote_code=False)
    byid={r['id']:r for r in rows}
    encoded={cid:suffix_encoded(helper,tokenizer,byid[cid]) for cid in FULL_IDS}
    evals={r['case_id']:r for r in json.loads((bundle/'archive/runtime/eval_inputs.json').read_text())}
    before=Path('/workspace/cocolon_joint_role18_run_20261029')
    baseline=[]
    for cid in FULL_IDS+OLD_IDS:
        require(byid[cid]['messages'][:-1]==evals[cid]['messages'],'original_prompt_changed')
        prompt=len(helper.chat_token_ids(tokenizer,evals[cid]['messages'],generation_prompt=True))
        require(prompt+CAPS[cid]<=8192,'eval_context')
        path=before/('after_'+cid+'.jsonl')
        raw=helper.read_jsonl(path)[0]
        require(raw['model']==helper.MODEL and raw['revision']==helper.REVISION and raw['adapter_revision']==INITIAL_ADAPTER['adapter_model.safetensors'],'baseline_identity')
        require(raw['input_tokens']==prompt,'baseline_prompt_tokens')
        bound[path]=sha(path)
        baseline.append(dict(case_id=cid,raw_sha256=sha(path),prompt_tokens=prompt,max_new_tokens=CAPS[cid]))
    from safetensors.torch import load_file
    weights=load_file(str(initial_adapter/'adapter_model.safetensors'),device='cpu')
    require(len(weights)==112 and all(t.dtype==torch.float32 and torch.isfinite(t).all() for t in weights.values()),'weights_invalid')
    require(all(sha(p)==h for p,h in bound.items()),'frozen_inputs_changed')
    report=dict(status='CPU_SUFFIX2_READY_NO_MODEL',source_sha256=sha(__file__),plan=plan,encoded=encoded,baseline=baseline,current_cmee_manifest_sha256=sha(cmee_root/'restore_payload.json'),frozen={str(p):h for p,h in bound.items()},seconds=time.monotonic()-started,model_loads=0,model_forwards=0,generations=0,training_updates=0)
    write(HERE/'cpu_check.json',report)
    print(json.dumps(dict(status=report['status'],seconds=report['seconds'],cpu_sha256=sha(HERE/'cpu_check.json'),source_sha256=sha(__file__),records=[dict(case_id=cid,total_tokens=len(x['input_ids']),mask_before=STARTS[cid],supervised=sum(y!=-100 for y in x['labels']),loss_window=helper.assistant_loss_window(x)) for cid,x in encoded.items()])),flush=True)


def execute(bundle, initial_adapter, cmee_root, source):
    plan, prior, rows, bound = validate(bundle, initial_adapter, True)
    require(len(source) == 40 and all(ch in '0123456789abcdef' for ch in source), 'role18_source_commit_required')
    args = (Path('/proc') / str(os.getppid()) / 'cmdline').read_bytes().split(bytes([0]))
    require(args[0].rsplit(b'/', 1)[-1] == b'timeout' and all(x in args for x in (b'--signal=TERM', b'--kill-after=10s', b'1790s')), 'role18_parent_timeout_required')
    OUTPUT.mkdir(exist_ok=False)
    started = time.monotonic()
    deadline = started + 1800
    report = dict(status='STARTED_ONCE', source_commit=source, plan=plan, started_unix=time.time(),
                  optimizer_steps_started=0, optimizer_steps_completed=0, training_forwards_completed=0,
                  model_loads_started=0, model_loads_completed=0, model_calls_started=0, model_calls_completed=0,
                  calls=[], retry=False, product_credit=0, automatic_progression=False,
                  sql_operations=0, gpu_lifecycle_operations=0)
    model = optimizer = trainable = initial = original_generate = generate = ids = labels = value = None

    def checkpoint():
        report['elapsed_seconds'] = time.monotonic() - started
        write(OUTPUT / 'run.json', report)

    def stop(*_):
        raise TimeoutError('role18_deadline_no_retry')

    signal.signal(signal.SIGALRM, stop)
    signal.signal(signal.SIGTERM, stop)
    signal.setitimer(signal.ITIMER_REAL, 1800)
    checkpoint()
    try:
        require(os.environ.get('HF_HUB_OFFLINE') == os.environ.get('TRANSFORMERS_OFFLINE') == '1', 'role18_offline_required')
        cpu = json.loads((HERE / 'cpu_check.json').read_text())
        require(sha(cmee_root / 'restore_payload.json') == cpu['current_cmee_manifest_sha256'], 'role18_cmee_context_changed')
        helper = prior.module('role18_immutable_helper', bundle / 'support/run_pilot.py')
        from transformers import AutoTokenizer, StoppingCriteria, StoppingCriteriaList
        import importlib.metadata
        import torch
        require({name: importlib.metadata.version(name) for name in helper.PINS} == helper.PINS, 'role18_dependency_changed')
        require(os.environ.get('RUNPOD_POD_ID') == plan['pod_id'] and torch.cuda.device_count() == 1, 'role18_pod_or_gpu_count')
        report['gpu'] = helper.gpu_profile(torch, {'minimum_free_gib': 14})
        require(report['gpu']['name'] == plan['expected_gpu_name'], 'role18_gpu_changed')
        torch.cuda.reset_peak_memory_stats()
        tokenizer = AutoTokenizer.from_pretrained(helper.MODEL, revision=helper.REVISION, local_files_only=True, trust_remote_code=False)
        encoded = cpu['encoded']
        byid={r['id']:r for r in rows}
        require(all(suffix_encoded(helper,tokenizer,byid[cid])==encoded[cid] for cid in FULL_IDS),'cpu_encoded_changed')
        recovery = prior.module('role18_existing_suffix_owner', bundle / 'support/run_expanded15_recovery.py')
        recovery.OLDPACK = bundle / 'support'
        recovery.ORIGIN = bundle / 'archive/run'
        owner, _, _ = recovery.owner_with_checked_suffixes()
        report['model_loads_started'] = 1
        checkpoint()
        model, tensors = owner.load_expanded_adapter(helper, initial_adapter, INITIAL_ADAPTER, trainable=True)
        report['model_loads_completed'] = 1
        write(OUTPUT / 'initial_loaded_tensors.json', tensors)
        trainable = [(name, parameter) for name, parameter in model.named_parameters() if parameter.requires_grad]
        require(len(trainable) == 112, 'role18_trainable_scope')
        initial = {name: parameter.detach().cpu().clone() for name, parameter in trainable}
        random.seed(plan['seed'])
        torch.manual_seed(plan['seed'])
        torch.cuda.manual_seed_all(plan['seed'])
        model.config.use_cache = False
        model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={'use_reentrant': False})
        model.enable_input_require_grads()
        model.train()
        optimizer = torch.optim.AdamW([parameter for _, parameter in trainable], lr=5e-5, weight_decay=0.)
        with (OUTPUT / 'training.jsonl').open('x') as stream:
            for step, cid in enumerate(ORDER, 1):
                require(time.monotonic() < deadline - 5, 'role18_deadline_before_update')
                item = encoded[cid]
                ids = torch.tensor([item['input_ids']], dtype=torch.long, device='cuda:0')
                labels = torch.tensor([item['labels']], dtype=torch.long, device='cuda:0')
                optimizer.zero_grad(set_to_none=True)
                value = helper.teacher_loss(model, input_ids=ids, attention_mask=torch.ones_like(ids), labels=labels, encoded=item)
                report['training_forwards_completed'] = step
                require(torch.isfinite(value).item(), 'role18_nonfinite_loss')
                value.backward()
                norm = float(torch.nn.utils.clip_grad_norm_([parameter for _, parameter in trainable], 1., error_if_nonfinite=True).cpu())
                require(math.isfinite(norm) and norm > 0, 'role18_gradient')
                report['optimizer_steps_started'] = step
                checkpoint()
                optimizer.step()
                report['optimizer_steps_completed'] = step
                stream.write(json.dumps(dict(step=step, id=cid, loss=float(value.detach().cpu()), gradient_norm=norm,
                                             target_tokens=sum(label != -100 for label in item['labels']), loss_type='updates_boundary_through_eos_suffix_ce')) + '\n')
                stream.flush()
                ids = labels = value = None
                checkpoint()
        optimizer.zero_grad(set_to_none=True)
        optimizer = None
        require(all(torch.isfinite(parameter).all().item() for _, parameter in trainable), 'role18_nonfinite_weights')
        report['changed_tensors'] = sum(not torch.equal(initial[name], parameter.detach().cpu()) for name, parameter in trainable)
        require(report['changed_tensors'] > 0, 'role18_no_weight_change')
        model.save_pretrained(OUTPUT / 'adapter', safe_serialization=True)
        report['adapter_sha256'] = helper.adapter_hashes(OUTPUT / 'adapter')
        initial = trainable = model = None
        gc.collect()
        torch.cuda.empty_cache()
        report['model_loads_started'] = 2
        checkpoint()
        model, tensors = owner.load_expanded_adapter(helper, OUTPUT / 'adapter', report['adapter_sha256'], trainable=False)
        report['model_loads_completed'] = 2
        require(not any(parameter.requires_grad for parameter in model.parameters()), 'role18_reload_trainable')
        write(OUTPUT / 'reloaded_tensors.json', tensors)
        by_id = {row['case_id']: row for row in json.loads((bundle / 'archive/runtime/eval_inputs.json').read_text())}
        cases = [by_id[cid] for cid in FULL_IDS + OLD_IDS]
        for case in cases:
            require(time.monotonic() < deadline - 5 and report['model_calls_started'] < 11, 'role18_deadline_before_call')
            stop_at = min(deadline, time.monotonic() + 180)
            triggered = False
            original_generate = model.generate

            class Bounded(StoppingCriteria):
                def __call__(self, *args, **kwargs):
                    nonlocal triggered
                    triggered = time.monotonic() >= stop_at
                    return triggered

            def generate(*args, **kwargs):
                kwargs['stopping_criteria'] = StoppingCriteriaList([*list(kwargs.get('stopping_criteria') or []), Bounded()])
                return original_generate(*args, **kwargs)

            cid = case['case_id']
            path = OUTPUT / ('after_' + cid + '.jsonl')
            report['model_calls_started'] += 1
            checkpoint()
            with patch.object(model, 'generate', generate):
                helper.evaluate(model, tokenizer, [case], path, {'context_tokens': 8192, 'max_new_tokens': CAPS[cid]}, adapter_revision=report['adapter_sha256']['adapter_model.safetensors'])
            raw = helper.read_jsonl(path)[0]
            call = dict(case_id=cid, path=path.name, raw_sha256=sha(path), eos_reached=raw['eos_reached'],
                        seconds=raw['seconds'], output_tokens=raw['output_tokens'], timeout_triggered=triggered)
            call['candidate_format'] = 'named' if cid in FULL_IDS else 'quote'
            report['calls'].append(call)
            report['model_calls_completed'] += 1
            checkpoint()
            require(not triggered and time.monotonic() < stop_at, 'role18_call_deadline_no_retry')
        require(helper.adapter_hashes(OUTPUT / 'adapter') == report['adapter_sha256'], 'role18_weights_changed_during_inference')
        report['status'] = 'RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW'
    except BaseException as exc:
        report.update(status='STOPPED_NO_RETRY', error_type=type(exc).__name__, reason=str(exc), traceback=traceback.format_exc())
        if model is not None and report['optimizer_steps_started'] > 0 and 'adapter_sha256' not in report:
            try:
                ids = labels = value = optimizer = None
                gc.collect()
                model.save_pretrained(OUTPUT / 'partial_adapter', safe_serialization=True)
                report['partial_adapter_not_adopted'] = True
            except BaseException as save_error:
                report['partial_adapter_preservation_error'] = str(save_error)
    finally:
        if 'torch' in sys.modules and sys.modules['torch'].cuda.is_initialized():
            report['peak_allocated_bytes'] = sys.modules['torch'].cuda.max_memory_allocated()
            report['peak_reserved_bytes'] = sys.modules['torch'].cuda.max_memory_reserved()
        original_generate = generate = model = optimizer = trainable = initial = ids = labels = value = None
        gc.collect()
        if 'torch' in sys.modules and sys.modules['torch'].cuda.is_initialized():
            sys.modules['torch'].cuda.empty_cache()
            report['post_release_allocated_bytes'] = sys.modules['torch'].cuda.memory_allocated()
        try:
            require(all(sha(path) == digest for path, digest in bound.items()), 'role18_frozen_inputs_changed')
            report['initial_adapter_and_frozen_inputs_unchanged'] = True
        except BaseException as exc:
            report.update(status='STOPPED_IDENTITY_UNVERIFIED_NO_RETRY', identity_error=str(exc))
        signal.setitimer(signal.ITIMER_REAL, 0)
        report['processing_seconds'] = time.monotonic() - started
        report['process_cost_usd'] = report['processing_seconds'] * .28 / 3600
        checkpoint()
    print(json.dumps({key: report.get(key) for key in ('status', 'optimizer_steps_completed', 'model_calls_completed', 'processing_seconds', 'process_cost_usd')}), flush=True)
    return 0 if report['status'] == 'RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW' else 1


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--bundle-root', required=True, type=Path)
    parser.add_argument('--initial-adapter', required=True, type=Path)
    parser.add_argument('--cmee-root', required=True, type=Path)
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--prepare', action='store_true')
    parser.add_argument('--source-commit', default='')
    args = parser.parse_args()
    if args.prepare:
        prepare(args.bundle_root.resolve(),args.initial_adapter.resolve(),args.cmee_root.resolve())
        raise SystemExit(0)
    if args.execute:
        raise SystemExit(execute(args.bundle_root.resolve(), args.initial_adapter.resolve(), args.cmee_root.resolve(), args.source_commit))
    validate(args.bundle_root.resolve(), args.initial_adapter.resolve())
    print('SUFFIX2_STATIC_VALIDATED_NO_MODEL')


