"""Actual rows receipt, independent unchanged meaning owner and cold full outcome."""
import argparse
from dataclasses import replace
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import time

os.environ.update(CUDA_VISIBLE_DEVICES='', HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1')
sys.dont_write_bytecode = True
BUNDLE=Path('/workspace/cocolon_auxiliary4_20261029')
ROLE=Path('/workspace/cocolon_joint_role18_run_20261029')
OLDROOT=Path('/workspace/cocolon_auxiliary_fit8_pack_20261029/cmee_current7b9_root_20261029')
FULL=['FT-BOOK-AFTER-ANSWER','FT-SHOP-AFTER-ANSWER']
OLD=['TRAIN-SERVICE-CHAIR-01-INITIAL','TRAIN-SERVICE-CHAIR-01-CORRECTION','TRAIN-SERVICE-CHAIR-02-INITIAL','TRAIN-SERVICE-CHAIR-02-CORRECTION','TRAIN-SERVICE-CHAIR-03-INITIAL','TRAIN-SERVICE-CHAIR-03-CORRECTION','TRAIN-DAILY-CALM-01-INITIAL','TRAIN-DAILY-CALM-02-INITIAL','TRAIN-DAILY-CALM-03-INITIAL']

def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def dump(p,v):
    p=Path(p); t=p.with_suffix(p.suffix+'.tmp'); t.write_text(json.dumps(v,ensure_ascii=False,indent=2,allow_nan=False)+'\n'); t.replace(p)
def load(name,p):
    s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);sys.modules[name]=m;s.loader.exec_module(m);return m

def owners(root):
    old=load('fixedrows_frozen_consumer',BUNDLE/'archive/runtime/consume_named9.py')
    return old,old.owners(root)

def read_raw(owners_, cid, raw, fixed=True):
    old,(v,native,Engine,semantic,prep)=owners_
    if fixed and cid in FULL:
        from cocolon_meaning_experience_engine.fixed_rows_reference_wire import SCHEMA
    else:
        SCHEMA = None
    request,prior=v.reconstruct_request({'native_case':native[cid]})
    material=prep.prepare_emlis(request)
    receipt=prep.receive_candidate(material,request_id=material.request_id,raw_output=raw['raw_text'],
        finish_reason=raw['finish_reason'],provider=raw['provider'],model=raw['model'],revision=raw['revision'],
        adapter_revision=raw['adapter_revision'],usage=raw['usage'],elapsed_seconds=raw['seconds'],
        candidate_format=SCHEMA if fixed and cid in FULL else None)
    metadata=json.loads(receipt.metadata_json);metadata.pop('evidence_check')
    assert prep.receive_candidate(material,request_id=receipt.request_id,raw_output=receipt.raw_output,**metadata)==receipt
    item=dict(case_id=cid,receipt=v.json_value(receipt),receipt_replay_identical=True,meaning_adopted=False,body_available=False,cold_file_status='NO_ADOPTED_SNAPSHOT')
    saved=None
    try:
        checkpoint=Engine().prepare_emlis_update(request,semantic_input=semantic.SemanticInput('FRESH_CANDIDATE',receipt,prior_snapshot_json=prior,semantic_profile=semantic.MODEL_PROFILE))
        resumed=replace(request,emlis_thread=replace(request.emlis_thread,prepared_meaning_checkpoint_ref=checkpoint.checkpoint_id))
        complete=Engine().generate(resumed,semantic_input=semantic.SemanticInput('RESUME_ADOPTED',snapshot_json=checkpoint.semantic_snapshot,semantic_profile=semantic.MODEL_PROFILE))
        item.update(meaning_adopted=True,body_available=complete.artifact is not None,checkpoint=v.json_value(checkpoint),outcome=v.json_value(complete))
        saved=dict(native_case=native[cid],semantic_snapshot=checkpoint.semantic_snapshot,checkpoint_id=checkpoint.checkpoint_id,expected_full_outcome=v.json_value(complete))
    except semantic.SemanticNotAdopted as exc:item.update(decision=exc.decision,reason_code=exc.reason_code)
    return item,saved

def cold(owners_,saved):
    old,(v,native,Engine,semantic,prep)=owners_
    request,_=v.reconstruct_request({'native_case':saved['native_case']})
    request=replace(request,emlis_thread=replace(request.emlis_thread,prepared_meaning_checkpoint_ref=saved['checkpoint_id']))
    result=Engine().generate(request,semantic_input=semantic.SemanticInput('RESUME_ADOPTED',snapshot_json=saved['semantic_snapshot'],semantic_profile=semantic.MODEL_PROFILE))
    actual=v.json_value(result);assert actual==saved['expected_full_outcome']
    return dict(status='COLD_FULL_OUTCOME_IDENTICAL',process_id=os.getpid(),full_outcome=actual)

def save_cold(root,owners_,cid,item,saved,out):
    if saved is None:return
    path=out/(cid+'_saved.json');result=out/(cid+'_cold.json');dump(path,saved)
    subprocess.run([sys.executable,'-B',__file__,'--root',str(root),'--worker','--saved',str(path),'--saved-sha',sha(path),'--out',str(result)],check=True,capture_output=True,text=True,timeout=60)
    got=json.loads(result.read_text());assert got['process_id']!=os.getpid() and got['full_outcome']==saved['expected_full_outcome']
    item['cold_file_status']=got['status']

def controls(owners_):
    values=[]
    for cid in OLD:
        raw=json.loads((ROLE/('after_'+cid+'.jsonl')).read_text())
        item,_=read_raw(owners_,cid,raw,False);values.append(item)
    return values

def check(root,out):
    started=time.monotonic();out.mkdir(exist_ok=False); own=owners(root)
    from cocolon_meaning_experience_engine import fixed_rows_reference_wire as rows,named_reference_wire as named
    cpu=Path('/workspace/cocolon_fixed_rows_cpu_v2_20261029')
    report=dict(status='CPU_FIXED_ROWS_INTEGRATION_RUNNING',cases=[],negative=[],model_loads=0,model_forwards=0,training_updates=0,generations=0)
    for cid in FULL:
        text=(cpu/(cid+'.rows.json')).read_text().strip()
        raw=dict(raw_text=text,finish_reason='stop',provider='CPU_FROZEN_TEACHER_NOT_MODEL',model='Qwen/Qwen3.5-4B',revision='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a',adapter_revision='cpu_teacher',usage={'prompt_tokens':0,'completion_tokens':0},seconds=0.)
        item,saved=read_raw(own,cid,raw);assert item['meaning_adopted'] and item['body_available']
        save_cold(root,own,cid,item,saved,out)
        packet=rows.decode_named(named.loads(text));original=json.loads((cpu/(cid+'.roundtrip.json')).read_text())
        assert packet==original
        v,native,Engine,semantic,prep=own[1]
        request,prior=v.reconstruct_request({'native_case':native[cid]});material=prep.prepare_emlis(request)
        def recv(value,finish='stop',fmt=rows.SCHEMA):
            return prep.receive_candidate(material,request_id=material.request_id,raw_output=value,finish_reason=finish,candidate_format=fmt)
        named_receipt=recv(named.dump(original),fmt=named.SCHEMA)
        prepared=Engine().prepare_emlis_update(request,semantic_input=semantic.SemanticInput('FRESH_CANDIDATE',named_receipt,prior_snapshot_json=prior,semantic_profile=semantic.MODEL_PROFILE))
        a=json.loads(saved['semantic_snapshot']);b=json.loads(prepared.semantic_snapshot)
        for key in ('packet','meaning_packet','native_bindings','source_bindings','question_control'):assert a[key]==b[key],key
        named_out=Engine().generate(replace(request,emlis_thread=replace(request.emlis_thread,prepared_meaning_checkpoint_ref=prepared.checkpoint_id)),semantic_input=semantic.SemanticInput('RESUME_ADOPTED',snapshot_json=prepared.semantic_snapshot,semantic_profile=semantic.MODEL_PROFILE))
        for key in ('observation','reception','update_note'):assert getattr(named_out.artifact,key)==item['outcome']['body']['artifact'][key]
        report['cases'].append(item)
        for kind in ('missing_claim','wrong_time','bad_bind','undefined_quote','duplicate_quote','undefined_update','duplicate_update','duplicate_alias','wrong_quote_type','wrong_version','claim_arity','extra_update_cell'):
            p=json.loads(text)
            if kind=='missing_claim':p[4][0].pop()
            elif kind=='wrong_time':p[4][0][0][0][2]='null'
            elif kind=='bad_bind':p[4][8][0][0][0]=['missing_claim']
            elif kind=='undefined_quote':p[4][0][0][2]=['absent']
            elif kind=='duplicate_quote':p[3][1][0]=p[3][0][0]
            elif kind=='undefined_update':p[4][8][0][-1][3]=['absent']
            elif kind=='duplicate_update':p[4][7][1][-1]=p[4][7][0][-1]
            elif kind=='duplicate_alias':p[2].append(p[2][0])
            elif kind=='wrong_quote_type':p[3][0][3]=None
            elif kind=='wrong_version':p[0]='other'
            elif kind=='claim_arity':p[4][0][0].pop()
            else:p[4][7][0].append('extra')
            receipt=recv(json.dumps(p,ensure_ascii=False))
            try:Engine().prepare_emlis_update(request,semantic_input=semantic.SemanticInput('FRESH_CANDIDATE',receipt,prior_snapshot_json=prior,semantic_profile=semantic.MODEL_PROFILE))
            except semantic.SemanticNotAdopted as exc: report['negative'].append(dict(case_id=cid,kind=kind,status=receipt.status,reason=exc.reason_code))
            else:raise AssertionError('accepted_mutation:'+kind)
        for finish,status in [('timeout','TIMEOUT'),('length','TOKEN_LIMIT'),('error','PROVIDER_ERROR')]:assert recv(text,finish).status==status
        assert recv(text,fmt=None).status=='INVALID_FORMAT'
        assert recv(named.dump(original)).status=='INVALID_FORMAT'
    oldpath=out/'old_format_controls.json'
    subprocess.run([sys.executable,'-B',__file__,'--root',str(OLDROOT),'--controls','--out',str(oldpath)],check=True,capture_output=True,text=True,timeout=150)
    new_controls=controls(own);assert new_controls==json.loads(oldpath.read_text()),'legacy_receipt_or_full_outcome_changed'
    report.update(status='CPU_FIXED_ROWS_INTEGRATION_PASSED',old9_full_outcome_and_receipt_unchanged=True,old9_success_ids=[c['case_id'] for c in new_controls if c['meaning_adopted'] and c['body_available']],seconds=time.monotonic()-started)
    dump(out/'cpu_check.json',report);print(json.dumps({k:v for k,v in report.items() if k not in ('cases','negative')}),flush=True)

def phase(root,run,phase,out):
    start=time.monotonic();own=owners(root);out.mkdir(exist_ok=False)
    report=json.loads((run/'run.json').read_text());calls=[c for c in report['calls'] if c['phase']==phase]
    expected=FULL if phase=='before' else FULL+OLD
    assert [c['case_id'] for c in calls]==expected
    result=dict(status='CMEE_FIXED_ROWS_PHASE',phase=phase,cases=[],new_model_calls=0,training_updates=0,sql_operations=0,product_credit=0)
    for call in calls:
        path=run/call['path'];assert sha(path)==call['raw_sha256']
        raw=json.loads(path.read_text());assert raw['case_id']==call['case_id']
        assert hashlib.sha256(raw['raw_text'].encode()).hexdigest()==raw['raw_utf8_sha256']
        assert raw['model']=='Qwen/Qwen3.5-4B' and raw['revision']=='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a'
        assert raw['adapter_revision']==call['adapter_sha256']
        item,saved=read_raw(own,call['case_id'],raw);save_cold(root,own,call['case_id'],item,saved,out);result['cases'].append(item);dump(out/'diagnosis.json',result)
    result.update(full2=dict(meaning=sum(c['meaning_adopted'] for c in result['cases'][:2]),body=sum(c['body_available'] for c in result['cases'][:2])),seconds=time.monotonic()-start)
    baseline=OLD[:3]+[OLD[4]]+OLD[6:]
    if phase=='after':
        result['old9']=dict(meaning=sum(c['meaning_adopted'] for c in result['cases'][2:]),body=sum(c['body_available'] for c in result['cases'][2:]))
        success={c['case_id'] for c in result['cases'][2:] if c['meaning_adopted'] and c['body_available']}
        result['baseline7_preserved']=set(baseline)<=success
        result['lost_baseline_successes']=sorted(set(baseline)-success)
    result['both_full_success']=result['full2']==dict(meaning=2,body=2)
    dump(out/'diagnosis.json',result);print(json.dumps({k:v for k,v in result.items() if k!='cases'}),flush=True)

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--out',type=Path,required=True);p.add_argument('--run',type=Path);p.add_argument('--phase');p.add_argument('--check',action='store_true');p.add_argument('--controls',action='store_true');p.add_argument('--worker',action='store_true');p.add_argument('--saved',type=Path);p.add_argument('--saved-sha');a=p.parse_args()
    if a.worker:
        assert sha(a.saved)==a.saved_sha;dump(a.out,cold(owners(a.root),json.loads(a.saved.read_text())))
    elif a.controls:dump(a.out,controls(owners(a.root)))
    elif a.check:check(a.root,a.out)
    else:phase(a.root,a.run,a.phase,a.out)
