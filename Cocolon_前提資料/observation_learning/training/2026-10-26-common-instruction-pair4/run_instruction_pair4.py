"""One fixed raw-only paired common-instruction comparison; no training, CMEE adoption or retries."""
import argparse
import hashlib
import importlib.metadata
import json
import os
from pathlib import Path
import signal
import sys
import time
from unittest.mock import patch

sys.dont_write_bytecode = True
LEGACY = Path('/workspace/cocolon_4b_service_binding_legacy_reference_20261025')
ADAPTER = Path('/workspace/cocolon_4b_quote_joint_fit12_20261026/adapter')
RUN = Path('/workspace/cocolon_4b_instruction_pair4_result_20261026')
LEGACY_SHA = '2f659078c05bee6d7b32f50aae8b9eebc03c767d4a3be084bc17e9e3ccc4c10d'
WEIGHT_SHA = '45779ad97111dd2d91c1f7f1a4b0ca697ef0586c5190cd56b1b7675fe540dab6'


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def dump(path, value):
    path = Path(path)
    tmp = path.with_suffix(path.suffix + '.tmp')
    tmp.write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + '\n')
    tmp.replace(path)


def inputs(pack):
    plan = json.loads((pack / 'instruction_pair4.plan.json').read_text())
    cases = [json.loads(l) for l in (pack / 'instruction_pair4_cases.jsonl').read_text().splitlines() if l.strip()]
    assert plan['runner_sha256'] == sha(__file__) and plan['cases_sha256'] == sha(pack / 'instruction_pair4_cases.jsonl')
    assert plan['selected_adapter_sha256'] == WEIGHT_SHA
    assert plan['max_model_calls'] == 4 and plan['max_seconds'] == 600
    assert plan['context_tokens'] == 8192 and plan['max_new_tokens'] == 2560
    assert plan['gpu_hourly_usd'] == .26 and plan['max_process_usd'] == .043334
    assert plan['training_updates'] == 0 and plan['cmee_adoption'] is False and plan['automatic_progression'] is False
    assert [c['case_id'] for c in cases] == ['FT-UDON-INITIAL-BASELINE', 'EFREE-E05-BASELINE', 'FT-UDON-INITIAL-REVISED', 'EFREE-E05-REVISED']
    for base, revised in zip(cases[:2], cases[2:]):
        assert base['source_case_id'] == revised['source_case_id']
        assert base['messages'][0] == revised['messages'][0]
        b = json.loads(base['messages'][1]['content'])
        n = json.loads(revised['messages'][1]['content'])
        b_instruction = b.pop('task_instruction')
        n_instruction = n.pop('task_instruction')
        assert b == n and n_instruction == b_instruction + plan['common_instruction_suffix']
    assert all('E01-0' not in c['case_id'] and 'E03-0' not in c['case_id'] and 'A03' not in c['case_id'] for c in cases)
    assert len({json.loads(c['messages'][1]['content'])['task_instruction'] for c in cases[:2]}) == 1
    assert all([m['role'] for m in c['messages']] == ['system', 'user'] for c in cases)
    assert sha(LEGACY / 'run_pilot.py') == LEGACY_SHA
    assert os.environ.get('HF_HUB_OFFLINE') == os.environ.get('TRANSFORMERS_OFFLINE') == '1'
    sys.path.insert(0, str(LEGACY))
    import run_pilot as r
    versions = {name: importlib.metadata.version(name) for name in r.PINS}
    assert versions == r.PINS
    weights = r.adapter_hashes(ADAPTER)
    assert weights['adapter_model.safetensors'] == WEIGHT_SHA
    fit = json.loads((ADAPTER.parent / 'run.json').read_text())
    assert fit['adapter_sha256'] == weights and fit['status'] == 'JOINT12_COMPLETE_NOT_SERVICE_OR_PRODUCT_ACCEPTED'
    return plan, cases, r, weights, versions


def tokenizer_preflight(pack, plan, cases, r, weights, versions, *, save):
    from transformers import AutoTokenizer
    tokenizer = AutoTokenizer.from_pretrained(r.MODEL, revision=r.REVISION, trust_remote_code=False, local_files_only=True)
    rows = []
    for case in cases:
        ids = r.chat_token_ids(tokenizer, case['messages'], generation_prompt=True)
        assert len(ids) + plan['max_new_tokens'] <= plan['context_tokens']
        rows.append(dict(case_id=case['case_id'], input_tokens=len(ids), input_token_ids=ids,
            messages_sha256=hashlib.sha256(json.dumps(case['messages'],ensure_ascii=False,sort_keys=True).encode()).hexdigest()))
    report = dict(schema='cocolon.instruction_pair4.cpu_preflight.v1',status='CPU_READY_GPU_NOT_EXECUTED',
        model=r.MODEL,revision=r.REVISION,adapter_sha256=weights,dependency_versions=versions,
        runner_sha256=sha(__file__),cases_sha256=sha(pack/'instruction_pair4_cases.jsonl'),
        plan_sha256=sha(pack/'instruction_pair4.plan.json'),rows=rows,
        model_weights_loaded=False,model_forward_calls=0,new_generations=0,training_updates=0,
        cmee_adoption=False,sql_calls=0,production_changes=0)
    if save:
        assert os.environ.get('CUDA_VISIBLE_DEVICES') == ''
        assert not (pack/'instruction_pair4_cpu_preflight.json').exists()
        dump(pack/'instruction_pair4_cpu_preflight.json',report)
    return tokenizer, report


def execute(pack):
    plan, cases, r, weights, versions = inputs(pack)
    assert plan['status'] == 'AUTHORIZED_ONCE' and plan['gpu_run_authorized'] is True
    pre = json.loads((pack/'instruction_pair4_cpu_preflight.json').read_text())
    assert pre['runner_sha256'] == sha(__file__) and pre['cases_sha256'] == sha(pack/'instruction_pair4_cases.jsonl')
    assert pre['adapter_sha256'] == weights and pre['model_weights_loaded'] is False
    RUN.mkdir(exist_ok=False)
    started=time.monotonic()
    deadline=started+600
    report=dict(schema='cocolon.instruction_pair4.raw_result.v1',status='STARTED_ONCE',
        scope='PAIRED_COMMON_INSTRUCTION_TWO_KNOWN_INPUTS_FOUR_CALLS_NOT_CMEE_ADOPTED',plan=plan,
        model_calls_started=0,model_calls_completed=0,training_updates=0,cmee_adoption=False,
        source_bundles_modified=False,task_instruction_only_changed=True,helper_profile_is_training_metadata_not_admission=True)
    def checkpoint():
        report['seconds']=time.monotonic()-started
        dump(RUN/'run.json',report)
    def timeout(*_):
        raise TimeoutError('whole_probe_deadline_no_retry')
    signal.signal(signal.SIGALRM,timeout)
    signal.setitimer(signal.ITIMER_REAL,600)
    checkpoint()
    try:
        tokenizer,actual_pre=tokenizer_preflight(pack,plan,cases,r,weights,versions,save=False)
        assert actual_pre['rows']==pre['rows']
        dump(RUN/'actual_inputs_and_token_ids.json',dict(cases=cases,rows=actual_pre['rows']))
        model,stats=r.load_saved_adapter(ADAPTER,weights)
        assert all(not p.requires_grad for p in model.parameters())
        dump(RUN/'loaded_adapter_finite_tensors.json',stats)
        from transformers import StoppingCriteria,StoppingCriteriaList
        actual_generate=model.generate
        call_deadline=deadline
        bounded_triggered=False
        class Bounded(StoppingCriteria):
            def __call__(self,_ids,_scores,**_kw):
                nonlocal bounded_triggered
                bounded_triggered=time.monotonic()>=call_deadline
                return bounded_triggered
        def generate(*a,**kw):
            kw['stopping_criteria']=StoppingCriteriaList([*list(kw.get('stopping_criteria') or []),Bounded()])
            return actual_generate(*a,**kw)
        for index,case in enumerate(cases,1):
            assert time.monotonic()<deadline-15
            call_deadline=min(deadline-10,time.monotonic()+180)
            bounded_triggered=False
            report['model_calls_started']+=1
            checkpoint()
            path=RUN/f'case{index}_raw.jsonl'
            with patch.object(model,'generate',generate):
                r.evaluate(model,tokenizer,[case],path,dict(context_tokens=8192,max_new_tokens=2560),adapter_revision=WEIGHT_SHA)
            raw=r.read_jsonl(path)
            assert len(raw)==1
            assert raw[0]['model']==r.MODEL and raw[0]['revision']==r.REVISION and raw[0]['adapter_revision']==WEIGHT_SHA
            report['model_calls_completed']+=1
            report.setdefault('actual_stop_causes',[]).append(dict(case_id=case['case_id'],
                deadline_triggered=bounded_triggered,helper_finish_reason=raw[0]['finish_reason'],
                actual_stop_cause='deadline' if bounded_triggered else 'eos' if raw[0]['eos_reached'] else 'non_eos_no_deadline',
                strict_json_parse_error_is_metadata_only=raw[0]['parse_error'] is not None))
            checkpoint()
            if bounded_triggered or not raw[0]['eos_reached']:
                report['status']='DEADLINE_OR_EOS_FAILURE_STOP_NO_RETRY'
                break
        else:
            report['status']='RAW4_COMPLETE_NOT_CMEE_OR_PRODUCT_ACCEPTED'
    except BaseException as exc:
        report['status']='STOPPED_NO_RETRY'
        report['error_type']=type(exc).__name__
    finally:
        report['gpu_phase_seconds']=time.monotonic()-started
        signal.setitimer(signal.ITIMER_REAL,0)
        report['saved_adapter_unchanged']=r.adapter_hashes(ADAPTER)==weights
        checkpoint()
        files=[p for p in RUN.iterdir() if p.is_file() and p.name!='file_manifest.json']
        dump(RUN/'file_manifest.json',{p.name:dict(bytes=p.stat().st_size,sha256=sha(p)) for p in files})
    print(report['status'],report['model_calls_completed'],'/4 calls; no training or CMEE adoption',flush=True)


if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--pack',type=Path,required=True)
    parser.add_argument('--execute',action='store_true')
    args=parser.parse_args()
    if args.execute:
        execute(args.pack.resolve())
    else:
        plan,cases,r,weights,versions=inputs(args.pack.resolve())
        _,report=tokenizer_preflight(args.pack.resolve(),plan,cases,r,weights,versions,save=True)
        print('CPU_READY: baseline/revised common instruction only, tokens',[(x['case_id'],x['input_tokens']) for x in report['rows']],flush=True)
        print('GPU/model forward/generation/training/SQL/CMEE adoption: 0; new paid run requires approval',flush=True)
