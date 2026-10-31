"""Read frozen after outputs with unchanged CMEE; no raw repair or model call."""
import os
os.environ.update(CUDA_VISIBLE_DEVICES='',HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
import argparse,hashlib,importlib.util,json,signal,subprocess,sys,time
from dataclasses import replace
from pathlib import Path
sys.dont_write_bytecode=True
ORIGIN=Path('/workspace/cocolon_native15_expanded30_run_20261027')
PREDECESSOR=Path('/workspace/cocolon_native15_expanded15_recovery_pack_20261027/consume_expanded15_recovery.py')
API_COMMIT='a4b91b4788b2fb29483a4c77869c91b36402ae9f'
def require(ok,code):
    if not ok:raise ValueError(code)
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module():
    require(sha(PREDECESSOR)=='981134897057ae1f4acaeaf340307fdd59965fe8c5808858d48caf4fe55feccf','consumer_predecessor_changed')
    s=importlib.util.spec_from_file_location('local30_existing_consumer',PREDECESSOR);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
core=module();core.API_COMMIT=API_COMMIT
def load_api(args):
    cpu=json.loads((args.run/'actual_cpu_check.json').read_text())
    require(cpu['api_commit']==API_COMMIT,'consumer_api_commit')
    for p,h in cpu['api_inventory'].items():require(sha(args.api/p)==h,'consumer_api_changed:'+p)
    require(sha(args.legacy/'verify_cmee.py')==core.VERIFY_SHA and sha(args.legacy/'run_pilot.py')==core.HELPER_SHA,'consumer_legacy_changed')
    sys.path[:0]=[str(args.api/'ai/services/ai_inference'),str(args.legacy)]
    from verify_cmee import json_value,reconstruct_request
    from cocolon_meaning_experience_engine import MeaningExperienceEngine,emlis_semantic_admission,preparation
    from cocolon_meaning_experience_engine.model_candidate_source import build_model_messages,ModelCandidateSource
    require(Path(emlis_semantic_admission.__file__).is_relative_to(args.api),'consumer_other_api')
    return json_value,reconstruct_request,MeaningExperienceEngine,emlis_semantic_admission,preparation,build_model_messages,ModelCandidateSource
core.load_api=load_api
def cases_native(args):
    _,native=core.frozen_cases(ORIGIN,args.examples)
    cpu=json.loads((args.run/'actual_cpu_check.json').read_text())
    for n,h in cpu['payload_sha256'].items():require(sha(args.run/n)==h,'consumer_payload_changed:'+n)
    cases=core.read_jsonl(args.run/'eval_inputs.jsonl');rows=core.read_jsonl(args.run/'train_messages.jsonl')
    require([c['case_id'] for c in cases]==[r['id'] for r in rows]==list(native),'consumer_case_order')
    require(all(c['messages']==r['messages'][:-1] for c,r in zip(cases,rows,strict=True)),'consumer_gold_leak')
    return cases,native
def validate_inputs(args):
    cases,native=cases_native(args);_,reconstruct,_,_,preparation,build,_=load_api(args)
    for case in cases:
        req,prior=reconstruct({'native_case':native[case['case_id']]});require(build(req,prior,candidate_format=preparation.QUOTE_CANDIDATE_SCHEMA)==case['messages'],'consumer_prompt_not_reproduced')
    return cases,native
def main(args):
    started=time.monotonic();source=sha(args.run/'run.json');run=json.loads((args.run/'run.json').read_text())
    require(run['source_commit']==args.expected_source_commit and run['fixed_sources_and_initial109c_unchanged'] is True,'consumer_source_or_identity')
    require(run['plan']['optimizer_steps']==30 and 0<=run['optimizer_steps_completed']<=30 and run['plan']['max_model_calls']==15 and run['plan']['api_commit']==API_COMMIT,'consumer_run_scope')
    require(sha(args.run/'run_localized30.py')==run['plan']['runner_sha256'],'consumer_runner_changed')
    cases,native=validate_inputs(args);ids=[c['case_id'] for c in cases];byid={c['case_id']:c for c in cases}
    records=core.checked_raws(args.run,run['calls'],ids,run.get('adapter_sha256',{}).get('adapter_model.safetensors','NO_SAVED_ADAPTER'))
    require([c['case_id'] for c,_ in records]==ids[:len(records)] and run['model_calls_completed']==len(records) and len(records)<=run['model_calls_started']<=15,'consumer_call_counts')
    if records:require(run['base_model_loads_completed']==2 and len(json.loads((args.run/'reloaded_tensors.json').read_text()))==112,'consumer_reload_missing')
    j,reconstruct,Engine,semantic,preparation,_,_=load_api(args);args.out.mkdir(exist_ok=False)
    report=dict(status='CPU_LOCAL30_STARTED',api_commit=API_COMMIT,source_run_sha256=source,cases=[],cold_file_checked_count=0,cold_file_failures=0,new_model_calls=0,training_updates=0,sql_operations=0,service_saved_roundtrip=False,dynamic_prior=False,product_accepted=False,automatic_progression=False,missing_after_ids=[cid for cid in ids if cid not in [c['case_id'] for c,_ in records]])
    def checkpoint():
        report.update(seconds=time.monotonic()-started,meaning_adopted_count=sum(c['meaning_adopted'] for c in report['cases']),body_available_count=sum(c['body_available'] for c in report['cases']));core.dump(args.out/'diagnosis.json',report)
    def timeout(*_):raise TimeoutError('local30_cpu_deadline_no_retry')
    signal.signal(signal.SIGALRM,timeout);signal.alarm(600);checkpoint()
    try:
        for call,raw in records:
            cid=call['case_id'];req,prior=reconstruct({'native_case':native[cid]});material=preparation.prepare_emlis(req)
            receipt=preparation.receive_candidate(material,request_id=material.request_id,raw_output=raw['raw_text'],finish_reason=raw['finish_reason'],provider=raw['provider'],model=raw['model'],revision=raw['revision'],adapter_revision=raw['adapter_revision'],usage=raw['usage'],elapsed_seconds=raw['seconds'])
            row=dict(case_id=cid,raw_sha256=call['raw_sha256'],receipt=j(receipt),meaning_adopted=False,body_available=False,cold_file_status='NO_ADOPTED_SNAPSHOT');report['cases'].append(row)
            try:
                cp=Engine().prepare_emlis_update(req,semantic_input=semantic.SemanticInput('FRESH_CANDIDATE',receipt,prior_snapshot_json=prior,semantic_profile=semantic.MODEL_PROFILE))
                resumed=replace(req,emlis_thread=replace(req.emlis_thread,prepared_meaning_checkpoint_ref=cp.checkpoint_id));out=Engine().generate(resumed,semantic_input=semantic.SemanticInput('RESUME_ADOPTED',snapshot_json=cp.semantic_snapshot,semantic_profile=semantic.MODEL_PROFILE))
                row.update(meaning_adopted=True,body_available=out.artifact is not None,checkpoint=j(cp),outcome=j(out))
                saved=args.out/(cid+'_saved.json');completed=args.out/(cid+'_saved_completed.json');core.dump(completed,j(out));core.dump(saved,dict(api_commit=API_COMMIT,case_id=cid,native_case=native[cid],semantic_snapshot=cp.semantic_snapshot,checkpoint_id=cp.checkpoint_id,source_raw_sha256=call['raw_sha256'],expected_full_outcome_sha256=core.value_sha(j(out)),completed_file_sha256=sha(completed)))
                cold=args.out/(cid+'_cold.json');cmd=[sys.executable,'-B',str(Path(__file__).resolve()),'--worker','--run',str(args.run),'--api',str(args.api),'--legacy',str(args.legacy),'--saved-input',str(saved),'--expected-saved-sha256',sha(saved),'--worker-output',str(cold)]
                try:
                    subprocess.run(cmd,check=True,capture_output=True,text=True,timeout=min(60,max(1,600-(time.monotonic()-started))));got=json.loads(cold.read_text());require(got['process_id']!=os.getpid() and got['full_outcome']==j(out),'consumer_cold_outcome_changed');row['cold_file_status']=got['status'];report['cold_file_checked_count']+=1
                except (subprocess.SubprocessError,ValueError,OSError) as exc:row.update(cold_file_status='COLD_FILE_FAILED_NO_RETRY',cold_error=str(exc));report['cold_file_failures']+=1
            except semantic.SemanticNotAdopted as exc:row.update(decision=exc.decision,reason_code=exc.reason_code)
            checkpoint()
        require(sha(args.run/'run.json')==source,'consumer_run_changed');report['status']='CPU_LOCAL30_DIAGNOSED_NOT_SERVICE_OR_PRODUCT_ACCEPTED';checkpoint()
    finally:signal.alarm(0)
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--run',type=Path,required=True);p.add_argument('--out',type=Path);p.add_argument('--api',type=Path,default=Path('/workspace/cocolon_localized30_api_20261027'));p.add_argument('--legacy',type=Path,default=Path('/workspace/cocolon_4b_service_binding_legacy_reference_20261025'));p.add_argument('--examples',type=Path,default=Path('/workspace/cocolon_4b_quote_joint_pack_20261026/sft_examples.jsonl'));p.add_argument('--expected-source-commit');p.add_argument('--validate-inputs-only',action='store_true');p.add_argument('--worker',action='store_true');p.add_argument('--saved-input',type=Path);p.add_argument('--expected-saved-sha256');p.add_argument('--worker-output',type=Path);a=p.parse_args()
    if a.worker:core.cold_worker(a)
    elif a.validate_inputs_only:validate_inputs(a);print('CPU_LOCAL30_INPUTS_VERIFIED_NO_MODEL_OR_ADOPTION')
    else:require(a.out is not None and a.expected_source_commit is not None,'consumer_output_source_required');main(a)
