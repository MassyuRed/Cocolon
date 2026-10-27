"""Unchanged CMEE reads the at-most-two new raws, then cold-retrieves adopted results."""
import argparse,hashlib,importlib.util,json,os,subprocess,sys,time
from pathlib import Path
from types import SimpleNamespace
from dataclasses import replace
os.environ.update(CUDA_VISIBLE_DEVICES='',HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
sys.dont_write_bytecode=True
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def dump(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
def main(pack,run,out):
    started=time.monotonic();before=sha(run/'run.json');report=json.loads((run/'run.json').read_text())
    plan=report['plan'];ids=['FT-BOOK-AFTER-ANSWER','FT-SHOP-AFTER-ANSWER']
    assert plan==json.loads((pack/'probe2.plan.json').read_text()) and plan['case_ids']==ids
    assert report['training_updates']==0 and 0<=report['model_calls_completed']<=2
    assert sha(pack/'eval_inputs.json')==plan['eval_inputs_sha256']
    origin=Path('/workspace/cocolon_adaptive30_run_20261027')
    source=origin/'consume_adaptive30.py'
    assert sha(source)=='e36d69d8f8a7db8065e8015d7f0bb17f967cd24c9c1c43ea7eeb6f3cb4be79fb'
    spec=importlib.util.spec_from_file_location('probe2_unchanged_cmee',source);old=importlib.util.module_from_spec(spec);spec.loader.exec_module(old)
    args=SimpleNamespace(run=origin,api=Path('/workspace/cocolon_localized30_api_20261027'),legacy=Path('/workspace/cocolon_4b_service_binding_legacy_reference_20261025'),examples=Path('/workspace/cocolon_4b_quote_joint_pack_20261026/sft_examples.jsonl'))
    _,native=old.validate_inputs(args);j,reconstruct,Engine,semantic,preparation,_,_=old.load_api(args)
    calls=report['calls'];assert len(calls)==report['model_calls_completed']
    assert [c['case_id'] for c in calls]==ids[:len(calls)]
    out.mkdir(exist_ok=False)
    result=dict(status='CPU_PROBE2_UNCHANGED_CMEE_READ',source_run_sha256=before,model_input_api_commit=plan['api_candidate_commit'],meaning_reader_api_commit=old.API_COMMIT,cases=[],missing_case_ids=ids[len(calls):],new_model_calls=0,training_updates=0,production_sql_operations=0,product_accepted=False,automatic_progression=False)
    for call in calls:
        cid=call['case_id'];path=run/call['path'];assert sha(path)==call['raw_sha256']
        raw=json.loads(path.read_text());assert raw['case_id']==cid and raw['adapter_revision']==plan['adapter_sha256']
        req,prior=reconstruct({'native_case':native[cid]});material=preparation.prepare_emlis(req)
        receipt=preparation.receive_candidate(material,request_id=material.request_id,raw_output=raw['raw_text'],finish_reason=raw['finish_reason'],provider=raw['provider'],model=raw['model'],revision=raw['revision'],adapter_revision=raw['adapter_revision'],usage=raw['usage'],elapsed_seconds=raw['seconds'])
        item=dict(case_id=cid,raw_sha256=call['raw_sha256'],receipt=j(receipt),meaning_adopted=False,body_available=False,cold_file_status='NO_ADOPTED_SNAPSHOT');result['cases'].append(item)
        try:
            cp=Engine().prepare_emlis_update(req,semantic_input=semantic.SemanticInput('FRESH_CANDIDATE',receipt,prior_snapshot_json=prior,semantic_profile=semantic.MODEL_PROFILE))
            resumed=replace(req,emlis_thread=replace(req.emlis_thread,prepared_meaning_checkpoint_ref=cp.checkpoint_id))
            complete=Engine().generate(resumed,semantic_input=semantic.SemanticInput('RESUME_ADOPTED',snapshot_json=cp.semantic_snapshot,semantic_profile=semantic.MODEL_PROFILE))
            item.update(meaning_adopted=True,body_available=complete.artifact is not None,checkpoint=j(cp),outcome=j(complete))
            saved=out/(cid+'_saved.json');completed=out/(cid+'_saved_completed.json');cold=out/(cid+'_cold.json');dump(completed,j(complete))
            dump(saved,dict(api_commit=old.API_COMMIT,case_id=cid,native_case=native[cid],semantic_snapshot=cp.semantic_snapshot,checkpoint_id=cp.checkpoint_id,source_raw_sha256=call['raw_sha256'],expected_full_outcome_sha256=old.core.value_sha(j(complete)),completed_file_sha256=sha(completed)))
            cmd=[sys.executable,'-B',str(source),'--worker','--run',str(origin),'--api',str(args.api),'--legacy',str(args.legacy),'--saved-input',str(saved),'--expected-saved-sha256',sha(saved),'--worker-output',str(cold)]
            subprocess.run(cmd,check=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,timeout=60)
            got=json.loads(cold.read_text());assert got['process_id']!=os.getpid() and got['full_outcome']==j(complete)
            item['cold_file_status']=got['status']
        except semantic.SemanticNotAdopted as exc:item.update(decision=exc.decision,reason_code=exc.reason_code)
        dump(out/'diagnosis.json',result)
    assert sha(run/'run.json')==before
    result.update(status='CPU_PROBE2_DIAGNOSED_NOT_FULL15_OR_PRODUCT_ACCEPTED',seconds=time.monotonic()-started,meaning_adopted_count=sum(x['meaning_adopted'] for x in result['cases']),body_available_count=sum(x['body_available'] for x in result['cases']))
    dump(out/'diagnosis.json',result)
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--pack',type=Path,required=True);p.add_argument('--run',type=Path,required=True);p.add_argument('--out',type=Path,required=True);a=p.parse_args();main(a.pack,a.run,a.out)
