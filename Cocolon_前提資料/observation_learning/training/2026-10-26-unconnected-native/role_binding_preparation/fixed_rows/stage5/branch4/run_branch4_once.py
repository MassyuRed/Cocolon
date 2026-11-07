"""Proposed, unexecuted four-forward diagnosis. Requires new exact Mash approval."""
import argparse
import gzip
import hashlib
import importlib.metadata
import importlib.util
import json
import math
import os
from pathlib import Path
import signal
import sys
import time

sys.dont_write_bytecode = True
W = Path('/workspace')
HERE = Path(__file__).resolve().parent
CPU = W / 'cocolon_fit38_branch4_cpu_20261030'
OUT = W / 'cocolon_fit38_branch4_run_20261030'
ADAPTER = W / 'cocolon_fit38_run_20261030/adapter'

def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def write(p, value):
    p = Path(p)
    q = p.with_suffix(p.suffix + '.tmp')
    q.write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False)+'\n')
    q.replace(p)

def load(name, p):
    spec = importlib.util.spec_from_file_location(name, p)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module

def execute(approval_path):
    plan_path = HERE / 'proposal.json'
    plan = json.loads(plan_path.read_text())
    approval = json.loads(Path(approval_path).read_text())
    assert approval['status'] == 'MASH_EXPLICITLY_APPROVED_ONCE'
    assert approval['plan_sha256'] == sha(plan_path)
    assert approval['runner_sha256'] == sha(__file__)
    assert all(sha(HERE / n) == h for n,h in plan['source_sha256'].items()), 'source_changed'
    assert plan['limits'] == dict(model_loads=1, model_forwards=4, updates=0, generations=0,
                                  new_cmee_calls=0, process_seconds=600)
    assert os.environ.get('HF_HUB_OFFLINE') == os.environ.get('TRANSFORMERS_OFFLINE') == '1'
    assert os.environ.get('RUNPOD_POD_ID') == 'vgkm402msgroiu'
    report_cpu = json.loads((CPU / 'cpu_report.json').read_text())
    assert report_cpu['status'] == 'CPU_BRANCH4_READY_NO_MODEL'
    assert sha(CPU / 'cpu_report.json') == plan['cpu_report_sha256']
    frozen = report_cpu['frozen_sha256']
    assert all(sha(p) == h for p,h in frozen.items()), 'frozen_changed'
    assert sha(ADAPTER / 'adapter_model.safetensors') == plan['adapter_sha256']
    c = json.loads(gzip.decompress((W / 'cocolon_fit38_cpu_20261030/prepared_cpu.json.gz').read_bytes()))
    assert all(importlib.metadata.version(n) == v for n,v in c['dependencies'].items()), 'dependency_changed'
    OUT.mkdir(exist_ok=False)
    (OUT / 'execute_once.lock').write_text(sha(approval_path)+'\n')
    start = time.monotonic()
    report = dict(status='STARTED_ONCE', plan=plan, approval_sha256=sha(approval_path),
                  model_loads_started=0, model_loads_completed=0, forwards_started=0,
                  forwards_completed=0, measurements=[], updates=0, generations=0, new_cmee_calls=0,
                  retry=False, automatic_progression=False, product_credit=0)
    def checkpoint():
        report['elapsed_seconds'] = time.monotonic()-start
        write(OUT / 'run.json', report)
    def stop(*args):
        raise TimeoutError('branch4_deadline_no_retry')
    signal.signal(signal.SIGALRM, stop)
    signal.signal(signal.SIGTERM, stop)
    signal.setitimer(signal.ITIMER_REAL, 590)
    checkpoint()
    try:
        import torch
        from transformers import AutoTokenizer
        assert torch.cuda.device_count() == 1
        assert torch.cuda.get_device_name(0) == 'NVIDIA RTX A5000'
        loader = load('branch4_frozen_loader', W / 'cocolon_fixedrows5_pack_20261029/run_fixed_rows5.py')
        _,prior,helper,bound = loader.owners()
        assert all(sha(p) == h for p,h in bound.items())
        recovery = prior.module('branch4_recovery', loader.BUNDLE / 'support/run_expanded15_recovery.py')
        recovery.OLDPACK = loader.BUNDLE / 'support'
        recovery.ORIGIN = loader.BUNDLE / 'archive/run'
        owner,_,_ = recovery.owner_with_checked_suffixes()
        tokenizer = AutoTokenizer.from_pretrained(helper.MODEL, revision=helper.REVISION,
                                                 local_files_only=True, trust_remote_code=False)
        report['model_loads_started'] = 1
        checkpoint()
        model,tensors = owner.load_expanded_adapter(helper, ADAPTER, helper.adapter_hashes(ADAPTER), trainable=False)
        assert not model.training and not any(p.requires_grad for p in model.parameters())
        report['model_loads_completed'] = 1
        write(OUT / 'loaded_tensors.json', tensors)
        model.config.use_cache = False
        for target in report_cpu['targets']:
            item = c['encoded'][target['id']]
            full = item['input_ids']
            loss_start, loss_count = helper.assistant_loss_window(item)
            p = target['prediction_position0']
            vectors = []
            for mode, sequence in [('teacher_full', full), ('common_prefix', full[:p+1])]:
                assert report['forwards_started'] < 4 and time.monotonic()-start < 580
                ids = torch.tensor([sequence], dtype=torch.long, device='cuda:0')
                labels = torch.tensor([item['labels']], dtype=torch.long, device='cuda:0') if mode == 'teacher_full' else None
                report['forwards_started'] += 1
                checkpoint()
                with torch.inference_mode():
                    kwargs = dict(input_ids=ids, attention_mask=torch.ones_like(ids), use_cache=False)
                    if mode == 'teacher_full':
                        output = model(**kwargs, labels=labels[:,loss_start:], logits_to_keep=loss_count)
                        assert output.logits.shape[0:2] == (1,loss_count)
                        vector = output.logits[0,p-loss_start].float().cpu()
                        teacher_nll = float(output.loss.cpu())
                    else:
                        output = model(**kwargs, logits_to_keep=1)
                        assert output.logits.shape[0:2] == (1,1)
                        vector = output.logits[0,0].float().cpu()
                        teacher_nll = None
                assert torch.isfinite(vector).all().item()
                report['forwards_completed'] += 1
                lp = torch.log_softmax(vector, dim=0)
                top_values,top_ids = torch.topk(vector, 10)
                def info(token):
                    return dict(token_id=token, text=tokenizer.decode([token], skip_special_tokens=False),
                                logit=float(vector[token]), logprob=float(lp[token]),
                                rank=1+int((vector > vector[token]).sum()))
                gold = info(target['gold_token_id'])
                historical = info(target['historical_token_id'])
                assert math.isfinite(gold['logprob']) and math.isfinite(historical['logprob'])
                report['measurements'].append(dict(id=target['id'], mode=mode,
                    input_tokens=len(sequence), prediction_position0=p, gold=gold, historical=historical,
                    teacher_full_nll=teacher_nll,
                    gold_token_ce=-gold['logprob'], top10=[info(int(t)) for t in top_ids],
                    argmax=info(int(vector.argmax())), top_logit_tie_count=int((vector == vector.max()).sum()),
                    top1_top2_logit_margin=float(top_values[0]-top_values[1]),
                    historical_cached_generation_not_reproduced=True))
                vectors.append(vector)
                del output,ids,labels
                checkpoint()
            report.setdefault('comparisons', []).append(dict(id=target['id'],
                gold_logit_delta_full_minus_prefix=float(vectors[0][target['gold_token_id']]-vectors[1][target['gold_token_id']]),
                historical_logit_delta_full_minus_prefix=float(vectors[0][target['historical_token_id']]-vectors[1][target['historical_token_id']]),
                max_abs_logit_delta=float((vectors[0]-vectors[1]).abs().max())))
        assert report['forwards_completed'] == report['forwards_started'] == 4
        assert all(sha(p) == h for p,h in frozen.items()), 'frozen_changed_after'
        report['status'] = 'DIAGNOSIS_COMPLETE_NOT_PRODUCT_ACCEPTANCE'
        checkpoint()
    except BaseException as exc:
        report['status'] = 'STOPPED_NO_RETRY'
        report['error_type'] = type(exc).__name__
        report['error'] = str(exc)
        checkpoint()
        raise
    finally:
        signal.setitimer(signal.ITIMER_REAL, 0)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--approval', required=True)
    args = parser.parse_args()
    execute(args.approval)
