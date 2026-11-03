"""Private source-bound reason diagnostic: prepare, 3 calls plus 1 reuse, archive.

All source text and raw model outputs stay in the private run directory. The
previous adapter is explicitly selected only for this zero-training diagnostic.
"""
import argparse
import copy
from contextlib import ExitStack
from dataclasses import asdict, replace
from hashlib import sha256, sha1
from importlib.metadata import version
import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import threading
import time
import traceback
from unittest.mock import patch
import zipfile

w=Path('/workspace')
root=w/'analysis-reason-transfer3-20261103'
prior=w/'analysis-reason-unknown76-20261103'
api=w/'analysis-semantic-boundaries-api-20261103'
adapter=prior/'result/adapter'
COMMIT='dc05dc358d1c44ce47fd844f6041d74f1f74fe6a'
PLAN_SHA='571434c425f059a8f5f8ffd6a57b5afb1727df46db5a4206e6f35a7ed21972b1'
SOURCE_SHA='70fed5a58620cc1a6cf3660aed9a4080df826cd820a99f593e58225affe5b036'
WEIGHTS='9dc4f947cda74e2c2befea39a978d3ca44295c7526a7ef2db8011a8c63947d4a'
CONFIG='4776a484561a82593d78f5e79f0e57a503c58d2a9fc54a69fff8890f885a75ce'
PROFILE='semantic_boundaries.v2'
NAMES=['semantic_units_reason_transfer3.py','semantic_units_reason_transfer3_supervisor.py']
sha=lambda p:sha256(Path(p).read_bytes()).hexdigest()
sha_text=lambda s:sha256(s.encode()).hexdigest()
sys.dont_write_bytecode=True
os.environ['HF_HUB_OFFLINE']='1'
os.environ['TRANSFORMERS_OFFLINE']='1'
sys.path[:0]=[str(api/'ai/tools'),str(api/'ai/services/ai_inference')]


def write(path,value):
    path=Path(path)
    tmp=path.with_suffix(path.suffix+'.tmp')
    tmp.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
    tmp.replace(path)


def compute_apps():
    return subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory',
        '--format=csv,noheader'],text=True)


def validate_prior():
    assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip()==COMMIT
    assert not subprocess.check_output(['git','-C',str(api),'status','--porcelain','--untracked-files=no'],text=True).strip()
    assert (prior/'prepare.exit').read_text()==(prior/'run.exit').read_text()=='0'
    plan_path=prior/'semantic_units_reason_unknown76_plan.json'
    assert sha(plan_path)==PLAN_SHA
    pack=json.loads(plan_path.read_text())
    report=json.loads((prior/'result/report.json').read_text())
    assert pack['api_commit']==COMMIT and pack['plan']['prompt_version']==PROFILE
    assert (len(pack['teachers']),len(pack['evaluation']))==(76,50)
    assert report['status']=='COMPLETE_NOT_ADOPTED_PENDING_RAW_READ'
    assert (report['updates_completed'],report['measurement_forwards'],report['new_calls'],report['model_loads'])==(90,152,50,2)
    assert report['plan_sha256']==PLAN_SHA and report['all_finished_stop']
    assert (report['adapter_sha256'],report['adapter_config_sha256'])==(WEIGHTS,CONFIG)
    assert sha(adapter/'adapter_model.safetensors')==WEIGHTS and sha(adapter/'adapter_config.json')==CONFIG
    manifest=json.loads((prior/'manifest.json').read_text())
    assert manifest and all(sha(prior/path)==expected for path,expected in manifest.items())
    blobs=pack['api_source_blobs']
    assert len(blobs)==6
    for path,expected in blobs.items():
        b=(api/path).read_bytes()
        assert sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==expected
    hashes=dict(json.loads((prior/'gpu-after.json').read_text())['prior_adapter_hashes'])
    assert len(hashes)==14
    hashes.update({str(adapter/'adapter_model.safetensors'):WEIGHTS,str(adapter/'adapter_config.json'):CONFIG})
    assert len(hashes)==16 and all(sha(path)==expected for path,expected in hashes.items())
    return pack,report,hashes


def receiver():
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
    from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
        AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError,canonical)
    from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
    return service,MeaningExperienceEngine,compiler,author,AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError,canonical,AnalysisSourceError


def saved_restore(service,engine,compiler,author,row,path):
    with ExitStack() as stack:
        for obj,name in [(engine,'generate'),(compiler,'compile_analysis_unit_candidates'),
            (compiler,'compile_model_written_role_graph'),(author,'realize_analysis_unit_candidates'),
            (author,'realize_model_written_role_graph')]:
            stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved regeneration')))
        return service.reload_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],path.read_text())


def prepare(args):
    cpu=root/'cpu'
    assert root.exists() and not cpu.exists()
    assert args.source is not None and args.source_sha256==SOURCE_SHA and sha(args.source)==SOURCE_SHA
    pack,prior_report,hashes=validate_prior()
    spec=json.loads(args.source.read_text())
    assert spec['schema_version']=='cocolon.analysis.reason_transfer3.sources.v1'
    assert (spec['api_commit'],spec['old_plan_sha256'],spec['weights_sha256'],spec['config_sha256'])==(COMMIT,PLAN_SHA,WEIGHTS,CONFIG)
    cases=spec['cases']
    assert len(cases)==4 and [x['id'] for x in cases]==['YREASON01','YREASON02','YREASON03','YREASON04']
    assert [(x['origin'],x['generate']) for x in cases]==[('RU02',True),('RU02',True),('HQ04',True),('HQ04',False)]
    assert all(set(x)=={'id','text','units','origin','generate'} and type(x['text']) is str
        and bool(x['text'].strip()) and type(x['units']) is list for x in cases)
    assert len({x['text'] for x in cases})==4
    cpu.mkdir()
    (cpu/'sources.json').write_bytes(args.source.read_bytes())
    for path in pack['api_source_blobs']:
        dst=cpu/'api-source'/path
        dst.parent.mkdir(parents=True,exist_ok=True)
        dst.write_bytes((api/path).read_bytes())
    service,engine,compiler,author,Response,SemanticError,canonical,SourceError=receiver()
    from transformers import AutoTokenizer
    tok=AutoTokenizer.from_pretrained(pack['plan']['model'],revision=pack['plan']['revision'],
        local_files_only=True,trust_remote_code=False)
    ru=next(x for x in pack['teachers'] if x['id']=='RU02')
    hq=next(x for x in pack['evaluation'] if x['probe_id']=='HQ04')
    population=pack['teachers']+pack['evaluation']
    field_values={m['original'][field] for row in population for m in row['snapshot']['members']
        for field in ('memo','memo_action') if m['original'][field].strip()}
    rows=[]
    for index,case in enumerate(cases):
        origin=ru if case['origin']=='RU02' else hq
        snapshot=copy.deepcopy(origin['snapshot'])
        assert len(snapshot['members'])==1 and not snapshot['members'][0]['original']['memo_action']
        snapshot['members'][0]['original']['memo']=case['text']
        if index in (1,2):
            snapshot['members'][0]['original']['id']='00000000-0000-0000-0000-'+f'{92006+index:012d}'
            assert case['text'] not in field_values
        else:
            assert snapshot==origin['snapshot']
        owner=origin['owner']
        p=service.prepare_cumulative_quoted_parent_units(owner,snapshot,prompt_version=PROFILE)
        if index in (0,3):
            assert (p.request_ref,p.messages())==(origin['request_ref'],origin['messages'])
        target=canonical(dict(fields=[dict(field=1,units=case['units'])]))
        if index==0:assert canonical(json.loads(target))==canonical(json.loads(ru['assistant_target']))
        prompt=tok.apply_chat_template(p.messages(),enable_thinking=False,add_generation_prompt=True,
            tokenize=True,return_dict=False,truncation=False)
        full=tok.apply_chat_template(p.messages()+[dict(role='assistant',content=target)],enable_thinking=False,
            add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
        assert len(prompt)+2048<=8192 and full[:len(prompt)]==prompt and len(prompt)<len(full)<=8192
        assert tok.decode(full[len(prompt):],skip_special_tokens=False,clean_up_tokenization_spaces=False)==target+'<|im_end|>\n'
        row=dict(probe_id=case['id'],owner=owner,snapshot=snapshot,request_ref=p.request_ref,
            messages=p.messages(),messages_sha256=sha_text(canonical(p.messages())),assistant_target=target,
            prompt_tokens=len(prompt),target_tokens=len(full)-len(prompt),generate=case['generate'],
            origin=case['origin'],source_kind='SEEN_TEACHER_REGENERATION' if index==0 else
            'EXACT_SAVED_DEVELOPMENT_REUSE' if index==3 else 'NEW_SYNTHETIC_NEAR_CONTEXT_DIAGNOSTIC')
        response=Response(p.request_ref,row['messages_sha256'],sha_text(target),'stop',target)
        value=replace(p,response=response)
        artifact,coverage=service.build_cumulative_quoted_parent_candidates(owner,snapshot,model_input=value)
        reference=cpu/(case['id']+'.reference.candidate.json')
        reference.write_text(service.serialize_cumulative_quoted_parent_candidates(owner,snapshot,
            model_input=value,artifact=artifact,coverage=coverage))
        assert saved_restore(service,engine,compiler,author,row,reference)==(artifact,coverage)
        row['reference_candidate_id']=artifact.candidate_id
        row['reference_coverage']=coverage
        if index==3:
            old=prior/'result/after_HQ04'
            request=json.loads(old.with_suffix('.request.json').read_text())
            response_value=json.loads(old.with_suffix('.response.json').read_text())
            raw=old.with_suffix('.raw.txt').read_bytes()
            assert request['request_ref']==row['request_ref'] and request['messages']==row['messages']
            assert request['messages_sha256']==row['messages_sha256']
            assert response_value['raw'].encode()==raw and response_value['raw_sha256']==sha256(raw).hexdigest()
            assert response_value['request_ref']==row['request_ref'] and response_value['messages_sha256']==row['messages_sha256']
            assert response_value['finish_reason']=='stop'
            old_call=next(x for x in prior_report['calls'] if x['probe_id']=='HQ04')
            assert old_call['raw_sha256']==response_value['raw_sha256'] and old_call['finish_reason']=='stop'
            for suffix in ('.request.json','.raw.txt','.response.json','.candidate.json'):
                path=old.with_suffix(suffix)
                (cpu/(case['id']+'.reused'+suffix)).write_bytes(path.read_bytes())
            reused=cpu/(case['id']+'.reused.candidate.json')
            old_response=Response(**response_value)
            old_artifact,old_coverage=service.build_cumulative_quoted_parent_candidates(owner,snapshot,
                model_input=replace(p,response=old_response))
            assert saved_restore(service,engine,compiler,author,row,reused)==(old_artifact,old_coverage)
            row['reused_from']='analysis-reason-unknown76-20261103/result/after_HQ04'
            row['reused_raw_sha256']=response_value['raw_sha256']
        rows.append(row)
    assert sum(r['generate'] for r in rows)==3
    assert all(row['reference_coverage']['mapped_count']==0 for row in rows)
    result=dict(status='REASON_TRANSFER3_CPU_PREPARED_NO_MODEL_NO_GPU_PLAN',api_commit=COMMIT,
        private_source_sha256=SOURCE_SHA,old_plan_sha256=PLAN_SHA,prior_report_sha256=sha(prior/'result/report.json'),
        weights_sha256=WEIGHTS,config_sha256=CONFIG,model=pack['plan']['model'],revision=pack['plan']['revision'],
        api_source_blobs=pack['api_source_blobs'],prompt_version=PROFILE,rows=rows,reference_count=4,
        reused_count=1,new_calls_cap=3,model_loads=0,generations=0,training_updates=0,nll_measurements=0,
        saved_reader_engine_both_compilers_both_authors_prohibited=True,adapter_hashes=hashes,
        normal_adoption=False,next_training_initial_selected=False,product_credit=0)
    write(cpu/'result.json',result)
    assert sha(args.source)==SOURCE_SHA
    write(cpu/'manifest.json',{str(p.relative_to(cpu)):sha(p) for p in cpu.rglob('*') if p.is_file()})
    print('REASON_TRANSFER3_CPU_PREPARED',sha(cpu/'result.json'))


def run():
    out=root/'result'
    assert (root/'prepare.exit').read_text()=='0' and not out.exists()
    cpu=root/'cpu'
    manifest=json.loads((cpu/'manifest.json').read_text())
    assert all(sha(cpu/path)==expected for path,expected in manifest.items())
    d=json.loads((cpu/'result.json').read_text())
    assert d['status']=='REASON_TRANSFER3_CPU_PREPARED_NO_MODEL_NO_GPU_PLAN' and d['api_commit']==COMMIT
    assert sha(cpu/'sources.json')==SOURCE_SHA and (len(d['rows']),sum(r['generate'] for r in d['rows']))==(4,3)
    _,_,hashes=validate_prior()
    assert hashes==d['adapter_hashes'] and not compute_apps().strip()
    service,engine,compiler,author,Response,SemanticError,canonical,SourceError=receiver()
    from serve_emlis_natural_reply import load_generator,MODEL,REVISION,PINS
    assert {n:version(n) for n in PINS}==PINS
    assert (MODEL,REVISION)==(d['model'],d['revision'])
    out.mkdir()
    report=dict(status='STARTED',api_commit=COMMIT,prompt_version=PROFILE,model=MODEL,revision=REVISION,
        runner_sha256=sha(__file__),cpu_result_sha256=sha(cpu/'result.json'),weights_sha256=WEIGHTS,
        config_sha256=CONFIG,max_new_calls=3,max_model_loads=1,max_seconds=180,request_seconds=23,
        context_tokens=8192,max_new_tokens=2048,training_updates=0,nll_measurements=0,
        new_calls=0,model_loads=0,reused_calls=0,calls=[],adapter_hashes=hashes,
        evaluation_scope='SEEN_TEACHER_AND_SYNTHETIC_CONTEXT_DIAGNOSIS_NOT_GENERAL_ACCEPTANCE',
        normal_adoption=False,next_training_initial_selected=False,product_credit=0)
    start=time.monotonic()
    deadline=start+180
    generator=None
    def save():
        report['process_seconds']=time.monotonic()-start
        write(out/'report.json',report)
    def expired(*_):raise TimeoutError('reason_transfer3_deadline')
    signal.signal(signal.SIGTERM,expired)
    signal.signal(signal.SIGALRM,expired)
    signal.setitimer(signal.ITIMER_REAL,180)
    save()
    try:
        report['model_loads']=1
        save()
        generator=load_generator(str(adapter),threading.Event(),weights_sha256=WEIGHTS,config_sha256=CONFIG)
        for row in d['rows']:
            p=service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'],prompt_version=PROFILE)
            assert p.request_ref==row['request_ref'] and p.messages()==row['messages']
            assert sha_text(canonical(p.messages()))==row['messages_sha256']
            key=row['probe_id']
            item=dict(probe_id=key,status='STARTED',new_generation=row['generate'],source_kind=row['source_kind'],
                training_use=False,prompt_tokens=row['prompt_tokens'])
            report['calls'].append(item)
            save()
            if row['generate']:
                assert report['new_calls']<3 and time.monotonic()<deadline
                report['new_calls']+=1
                write(out/(key+'.request.json'),dict(request_ref=p.request_ref,messages_sha256=row['messages_sha256'],messages=p.messages()))
                save()
                begin=time.monotonic()
                raw,finish=generator(p.messages(),min(deadline,begin+23))
                response=Response(p.request_ref,row['messages_sha256'],sha_text(raw),finish,raw)
                (out/(key+'.raw.txt')).write_text(raw)
                write(out/(key+'.response.json'),asdict(response))
                item['seconds']=time.monotonic()-begin
            else:
                for suffix in ('.request.json','.raw.txt','.response.json'):
                    src=cpu/(key+'.reused'+suffix)
                    (out/(key+suffix)).write_bytes(src.read_bytes())
                response=Response(**json.loads((out/(key+'.response.json')).read_text()))
                raw=response.raw
                assert response.raw_sha256==row['reused_raw_sha256'] and raw.encode()==(out/(key+'.raw.txt')).read_bytes()
                assert response.request_ref==p.request_ref and response.messages_sha256==row['messages_sha256']
                report['reused_calls']+=1
                item['reused_from']=row['reused_from']
            item.update(status='RETURNED',finish_reason=response.finish_reason,raw_sha256=response.raw_sha256)
            try:
                artifact,coverage=service.build_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],
                    model_input=replace(p,response=response))
            except (SemanticError,SourceError) as exc:
                item.update(admission='REJECTED',reason=str(exc))
            else:
                path=out/(key+'.candidate.json')
                path.write_text(service.serialize_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],
                    model_input=replace(p,response=response),artifact=artifact,coverage=coverage))
                assert saved_restore(service,engine,compiler,author,row,path)==(artifact,coverage)
                item.update(admission='RETURNED',candidate_id=artifact.candidate_id,coverage=coverage,
                    file_replay='MATCHED_NO_ENGINE_BOTH_COMPILERS_BOTH_AUTHORS')
                if not row['generate']:
                    assert path.read_bytes()==(cpu/(key+'.reused.candidate.json')).read_bytes()
            try:item['source_reference_json_equal']=canonical(json.loads(raw))==canonical(json.loads(row['assistant_target']))
            except (TypeError,ValueError):item['source_reference_json_equal']=False
            save()
        assert (report['new_calls'],report['model_loads'],report['reused_calls'])==(3,1,1)
        assert report['training_updates']==report['nll_measurements']==0
        assert all(sha(path)==expected for path,expected in hashes.items())
        assert all(c['status']=='RETURNED' and c['finish_reason']=='stop' for c in report['calls'])
        report.update(status='COMPLETE_NOT_ADOPTED_PENDING_RAW_READ',all_finished_stop=True,all_prior_sixteen_files_unchanged=True)
    except BaseException as exc:
        report.update(status='FAILED_NOT_ADOPTED',error_type=type(exc).__name__,error=str(exc),traceback=traceback.format_exc())
        raise
    finally:
        generator=None
        import gc
        gc.collect()
        save()
        signal.setitimer(signal.ITIMER_REAL,0)


def archive():
    assert root.exists()
    destination=w/'cocolon-analysis-reason-transfer3-originals-20261103.zip'
    assert not destination.exists()
    files={str(p.relative_to(root)):p for p in root.rglob('*') if p.is_file() and p!=root/'manifest.json'}
    write(root/'manifest.json',{name:sha(path) for name,path in files.items()})
    files['manifest.json']=root/'manifest.json'
    manifest={name:dict(bytes=path.stat().st_size,sha256=sha(path)) for name,path in sorted(files.items())}
    with zipfile.ZipFile(destination,'w',zipfile.ZIP_DEFLATED) as z:
        for name,path in sorted(files.items()):z.write(path,name)
        z.writestr('export_manifest.json',json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    with zipfile.ZipFile(destination) as z:
        assert z.testzip() is None and len(z.namelist())==len(files)+1
        for name,expected in manifest.items():
            b=z.read(name)
            assert len(b)==expected['bytes'] and sha256(b).hexdigest()==expected['sha256']
    collection=w/'analysis-reason-transfer3-collected-20261103'
    collection.mkdir()
    result=dict(status='ORIGINALS_ARCHIVED_COMPLETE_OR_PARTIAL_NO_MODEL',archive=str(destination),
        bytes=destination.stat().st_size,sha256=sha(destination),members=len(files)+1,
        all_crc_and_manifest_bytes_sha256_matched=True,model_loads=0,generations=0,training_updates=0)
    write(collection/'collection.json',result)
    print(json.dumps(result))


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--phase',choices=['prepare','run','archive'],required=True)
    parser.add_argument('--source',type=Path)
    parser.add_argument('--source-sha256')
    args=parser.parse_args()
    if args.phase=='prepare':prepare(args)
    elif args.phase=='run':run()
    else:archive()


if __name__=='__main__':main()
