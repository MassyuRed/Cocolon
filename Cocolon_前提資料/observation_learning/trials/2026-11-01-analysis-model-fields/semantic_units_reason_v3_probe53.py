"""CPU-bind frozen v2 sources, then one zero-training v3 probe and byte archive.

Private sources and model raw remain in the run/archive. Prompt-version changes
use separate identities and saved state; strict admission and normal routes are
not relaxed. No target, teacher, training or NLL is created by this probe.
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
import re
import signal
import subprocess
import sys
import threading
import time
import traceback
from unittest.mock import patch
import zipfile

w=Path('/workspace')
root=w/'analysis-reason-v3-probe53-20261103'
api=w/'analysis-reason-v3-api-20261103'
old=w/'analysis-boundary78-20261103'
adapter=w/'analysis-reason-unknown76-20261103/result/adapter'
COMMIT='58c47dd8d6512fdd7db5eb413a383925e8b31a87'
OLD_COMMIT='dc05dc358d1c44ce47fd844f6041d74f1f74fe6a'
OLD_PLAN_SHA='72696f33ae6e8284eb928e7497fa966b64bb072c99474ea99abc6b5a93b133be'
WEIGHTS='9dc4f947cda74e2c2befea39a978d3ca44295c7526a7ef2db8011a8c63947d4a'
CONFIG='4776a484561a82593d78f5e79f0e57a503c58d2a9fc54a69fff8890f885a75ce'
V2='semantic_boundaries.v2'
V3='semantic_boundaries.v3'
V3_STATE='cocolon.cmee.analysis_model_units_quoted_parents_state.semantic_boundaries.v3'
NAMES=['semantic_units_reason_v3_probe53.py','semantic_units_reason_v3_probe53_supervisor.py']
TEST_FILES=['reason-v3-tests-command.json','reason-v3-tests.log','reason-v3-tests-job.py',
    'reason-v3-tests.exit','reason-v3-api-setup.log']
sha=lambda p:sha256(Path(p).read_bytes()).hexdigest()
sha_text=lambda text:sha256(text.encode()).hexdigest()
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


def validate(args):
    assert re.fullmatch('[0-9a-f]{40}',args.api_commit) and args.api_commit==COMMIT
    assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip()==COMMIT
    assert not subprocess.check_output(['git','-C',str(api),'status','--porcelain','--untracked-files=no'],text=True).strip()
    assert (w/'reason-v3-tests.exit').read_text().strip()=='0'
    assert all((w/name).is_file() for name in TEST_FILES)
    assert (old/'prepare.exit').read_text()==(old/'run.exit').read_text()=='0'
    assert sha(old/'semantic_units_boundary78_plan.json')==OLD_PLAN_SHA
    pack=json.loads((old/'semantic_units_boundary78_plan.json').read_text())
    report=json.loads((old/'result/report.json').read_text())
    assert pack['api_commit']==OLD_COMMIT and pack['plan']['prompt_version']==V2
    assert len(pack['evaluation'])==53 and len({r['probe_id'] for r in pack['evaluation']})==53
    assert sum(bool(r['role_vertical']) for r in pack['evaluation'])==16
    assert report['status']=='COMPLETE_NOT_ADOPTED_PENDING_RAW_READ' and report['all_finished_stop']
    assert (report['updates_completed'],report['measurement_forwards'],report['new_calls'],report['model_loads'])==(106,156,53,2)
    assert report['plan_sha256']==OLD_PLAN_SHA
    assert (pack['plan']['initial_weights_sha256'],pack['plan']['initial_config_sha256'])==(WEIGHTS,CONFIG)
    original_manifest=json.loads((old/'manifest.json').read_text())
    assert original_manifest and all(sha(old/path)==expected for path,expected in original_manifest.items())
    prior=dict(json.loads((old/'gpu-after.json').read_text())['prior_adapter_hashes'])
    assert len(prior)==16
    prior.update({str(old/'result/adapter/adapter_model.safetensors'):report['adapter_sha256'],
        str(old/'result/adapter/adapter_config.json'):report['adapter_config_sha256']})
    assert len(prior)==18 and all(sha(path)==expected for path,expected in prior.items())
    assert sha(adapter/'adapter_model.safetensors')==WEIGHTS and sha(adapter/'adapter_config.json')==CONFIG
    paths=pack['api_source_blobs']
    assert len(paths)==6
    blobs={}
    changed_allowed={
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
        'ai/tests/test_analysis_model_quoted_parent_units.py'}
    for path,previous in paths.items():
        data=(api/path).read_bytes()
        actual=sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
        committed=subprocess.check_output(['git','-C',str(api),'rev-parse',COMMIT+':'+path],text=True).strip()
        assert actual==committed
        if path not in changed_allowed:assert actual==previous
        blobs[path]=actual
    return pack,report,prior,blobs


def receiver():
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
    from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
        AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError,canonical)
    from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
    return service,MeaningExperienceEngine,compiler,author,AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError,canonical,AnalysisSourceError


def saved_restore(reload,engine,compiler,author,row,path):
    with ExitStack() as stack:
        for obj,name in [(engine,'generate'),(compiler,'compile_analysis_unit_candidates'),
            (compiler,'compile_model_written_role_graph'),(author,'realize_analysis_unit_candidates'),
            (author,'realize_model_written_role_graph')]:
            stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved regeneration')))
        return reload(row['owner'],row['snapshot'],path.read_text())


def same_meaning(kind,left,right,left_counts,right_counts):
    assert left_counts==right_counts
    if kind=='candidate':
        a=asdict(left.graph)
        b=asdict(right.graph)
        # Only these two graph fields depend on the profile/response identity.
        assert a['request_ref']!=b['request_ref'] and a['response_ref']!=b['response_ref']
        for key in ('request_ref','response_ref'):
            a.pop(key)
            b.pop(key)
        assert a==b and left.text==right.text and left.diagram_json==right.diagram_json
        assert left.candidate_id!=right.candidate_id
    else:
        assert asdict(left.graph)==asdict(right.graph)
        assert left.owner_scope==right.owner_scope and left.source_set_ref==right.source_set_ref
        assert left.period==right.period and left.artifact_version==right.artifact_version
        assert left.source_members==right.source_members and left.category_records==right.category_records
        assert left.artifact_id!=right.artifact_id
        for method in ('safe_text_projection','safe_projection'):
            a=getattr(left,method)(authenticated_owner_scope=left.owner_scope)
            b=getattr(right,method)(authenticated_owner_scope=right.owner_scope)
            assert a['projection_of']!=b['projection_of']
            a.pop('projection_of')
            b.pop('projection_of')
            assert a==b


def builders(service):
    return [
        ('candidate',service.build_cumulative_quoted_parent_candidates,
            service.serialize_cumulative_quoted_parent_candidates,service.reload_cumulative_quoted_parent_candidates,'.candidate.json'),
        ('role',service.build_cumulative_written_role_map,
            service.serialize_cumulative_written_role_map,service.reload_cumulative_written_role_map,'.role.json')]


def prepare(args):
    cpu=root/'cpu'
    assert root.exists() and not cpu.exists()
    pack,_,prior,blobs=validate(args)
    cpu.mkdir()
    (cpu/'baseline_plan.json').write_bytes((old/'semantic_units_boundary78_plan.json').read_bytes())
    recorded=json.loads((old/'reused_before.json').read_text())
    before={row['probe_id']:row for row in recorded}
    (cpu/'before_source_records.json').write_bytes((old/'reused_before.json').read_bytes())
    assert len(recorded)==len(before)==53 and set(before)=={r['probe_id'] for r in pack['evaluation']}
    assert all((r['initial_weights_sha256'],r['initial_config_sha256'])==(WEIGHTS,CONFIG) for r in recorded)
    # Keep the old v2 original bytes before any new-profile rebinding.
    for row in pack['evaluation']:
        key=row['probe_id']
        for suffix,origin in before[key]['source_files'].items():
            source=Path(origin['path'])
            assert sha(source)==origin['sha256']
            assert (old/('before_'+key+suffix)).read_bytes()==source.read_bytes()
        for suffix in ('.request.json','.raw.txt','.response.json','.candidate.json','.role.json'):
            src=old/('before_'+key+suffix)
            if src.exists():(root/('before_'+key+suffix)).write_bytes(src.read_bytes())
    service,engine,compiler,author,Response,SemanticError,canonical,SourceError=receiver()
    from transformers import AutoTokenizer
    tok=AutoTokenizer.from_pretrained(pack['plan']['model'],revision=pack['plan']['revision'],
        local_files_only=True,trust_remote_code=False)
    rows=[]
    parity=[]
    for source_row in pack['evaluation']:
        key=source_row['probe_id']
        row=copy.deepcopy(source_row)
        assert 'assistant_target' not in row
        p2=service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'],prompt_version=V2)
        p3=service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'],prompt_version=V3)
        assert p2.request_ref==row['request_ref'] and p2.messages()==row['messages']
        old_messages=p2.messages()
        new_messages=p3.messages()
        assert len(old_messages)==len(new_messages)==2
        assert old_messages[0]['role']==new_messages[0]['role']=='system'
        assert old_messages[1]==new_messages[1] and old_messages[1]['role']=='user'
        assert new_messages[0]['content'].startswith(old_messages[0]['content']) and new_messages[0]!=old_messages[0]
        assert p3.request_ref!=p2.request_ref
        request=json.loads((root/('before_'+key+'.request.json')).read_text())
        resp=json.loads((root/('before_'+key+'.response.json')).read_text())
        raw=(root/('before_'+key+'.raw.txt')).read_bytes()
        assert request['request_ref']==p2.request_ref and request['messages']==old_messages
        assert request['messages_sha256']==sha_text(canonical(old_messages))
        assert resp['raw'].encode()==raw and resp['raw_sha256']==sha256(raw).hexdigest()
        assert resp['request_ref']==p2.request_ref and resp['messages_sha256']==request['messages_sha256']
        assert resp['finish_reason']=='stop'
        response2=Response(**resp)
        response3=Response(p3.request_ref,sha_text(canonical(new_messages)),response2.raw_sha256,'stop',response2.raw)
        value2=replace(p2,response=response2)
        value3=replace(p3,response=response3)
        write(cpu/('rebound_'+key+'.response.json'),asdict(response3))
        counts_row=dict(probe_id=key,v2_request_ref=p2.request_ref,v3_request_ref=p3.request_ref,
            original_raw_sha256=response2.raw_sha256,raw_rebound_unchanged=True)
        for kind,build,serialize,reload,suffix in builders(service):
            if kind=='role' and not row['role_vertical']:continue
            admission='admission' if kind=='candidate' else 'role_admission'
            reason='reason' if kind=='candidate' else 'role_reason'
            old_path=root/('before_'+key+suffix)
            outcomes=[]
            for profile,value,path in [(V2,value2,old_path),(V3,value3,cpu/('rebound_'+key+suffix))]:
                try:artifact,coverage=build(row['owner'],row['snapshot'],model_input=value)
                except (SemanticError,SourceError) as exc:
                    outcomes.append(('REJECTED',str(exc),None,None))
                    if profile==V2:assert not path.exists()
                else:
                    if profile==V3:
                        path.write_text(serialize(row['owner'],row['snapshot'],model_input=value,artifact=artifact,coverage=coverage))
                        if kind=='candidate':assert json.loads(path.read_text())['state']['schema_version']==V3_STATE
                    assert path.exists()
                    assert saved_restore(reload,engine,compiler,author,row,path)==(artifact,coverage)
                    outcomes.append(('RETURNED',None,artifact,coverage))
            left,right=outcomes
            assert (left[0],left[1])==(right[0],right[1])
            assert left[0]==before[key][admission]
            if left[0]=='REJECTED':
                assert left[1]==before[key][reason]
                counts_row.update({admission:'REJECTED',reason:left[1]})
            else:
                same_meaning(kind,left[2],right[2],left[3],right[3])
                counts_row[admission]='RETURNED'
                counts_row[kind+'_coverage']=left[3]
                counts_row[kind+'_meaning_unchanged_except_named_identity']=True
        tokens=tok.apply_chat_template(new_messages,enable_thinking=False,add_generation_prompt=True,
            tokenize=True,return_dict=False,truncation=False)
        assert len(tokens)+2048<=8192
        row.update(v2_request_ref=p2.request_ref,v2_messages=old_messages,request_ref=p3.request_ref,
            messages=new_messages,prompt_tokens=len(tokens),prompt_version=V3,
            raw_rebinding_is_cpu_reference_not_teacher=True)
        rows.append(row)
        parity.append(counts_row)
    assert len(rows)==len(parity)==53
    write(cpu/'v2_v3_raw_rebind_parity.json',dict(status='ALL53_V2_V3_RAW_REBIND_MATCHED_NO_GENERATION',rows=parity,
        candidate_identity_exclusions=['graph.request_ref','graph.response_ref'],
        role_identity_exclusions=['artifact_id','safe_text_projection.projection_of','safe_projection.projection_of'],
        candidate_text_diagram_identical=True,all_other_graph_source_witness_and_meaning_fields_identical=True,
        model_loads=0,generations=0,training_updates=0,nll_measurements=0))
    result=dict(status='REASON_V3_PROBE53_CPU_PREPARED_NO_MODEL_NO_GPU_PLAN',api_commit=COMMIT,
        old_api_commit=OLD_COMMIT,old_plan_sha256=OLD_PLAN_SHA,api_source_blobs=blobs,
        prompt_version=V3,before_prompt_version=V2,model=pack['plan']['model'],revision=pack['plan']['revision'],
        rows=rows,before_admission=recorded,adapter_hashes=prior,weights_sha256=WEIGHTS,config_sha256=CONFIG,
        saved_reader_engine_both_compilers_both_authors_prohibited=True,normal_adoption=False,
        next_training_initial_selected=False,product_credit=0,model_loads=0,generations=0,training_updates=0,nll_measurements=0)
    write(cpu/'result.json',result)
    write(cpu/'manifest.json',{str(p.relative_to(cpu)):sha(p) for p in cpu.rglob('*') if p.is_file()})
    print('REASON_V3_PROBE53_CPU_PREPARED',sha(cpu/'result.json'))


def run(args):
    out=root/'result'
    assert (root/'prepare.exit').read_text()=='0' and not out.exists()
    _,_,prior,_=validate(args)
    manifest=json.loads((root/'cpu/manifest.json').read_text())
    assert all(sha(root/'cpu'/path)==expected for path,expected in manifest.items())
    cpu=json.loads((root/'cpu/result.json').read_text())
    assert cpu['status']=='REASON_V3_PROBE53_CPU_PREPARED_NO_MODEL_NO_GPU_PLAN' and cpu['api_commit']==COMMIT
    assert cpu['adapter_hashes']==prior and len(cpu['rows'])==53 and not compute_apps().strip()
    service,engine,compiler,author,Response,SemanticError,canonical,SourceError=receiver()
    from serve_emlis_natural_reply import load_generator,MODEL,REVISION,PINS
    assert {name:version(name) for name in PINS}==PINS and (MODEL,REVISION)==(cpu['model'],cpu['revision'])
    out.mkdir()
    report=dict(status='STARTED',api_commit=COMMIT,runner_sha256=sha(__file__),cpu_result_sha256=sha(root/'cpu/result.json'),
        model=MODEL,revision=REVISION,prompt_version=V3,before_prompt_version=V2,weights_sha256=WEIGHTS,
        config_sha256=CONFIG,max_new_calls=53,max_model_loads=1,max_seconds=900,request_seconds=23,
        context_tokens=8192,max_new_tokens=2048,training_updates=0,nll_measurements=0,new_calls=0,model_loads=0,
        before_reused_count=53,calls=[],adapter_hashes=prior,normal_adoption=False,next_training_initial_selected=False,
        product_credit=0,evaluation_scope='SEEN_DEVELOPMENT_AND_REHEARSAL53_V2_V3_PROMPT_ONLY_NOT_GENERAL_ACCEPTANCE')
    start=time.monotonic()
    deadline=start+900
    generator=None
    def save():
        report['process_seconds']=time.monotonic()-start
        write(out/'report.json',report)
    def expired(*_):raise TimeoutError('reason_v3_probe53_deadline')
    signal.signal(signal.SIGTERM,expired)
    signal.signal(signal.SIGALRM,expired)
    signal.setitimer(signal.ITIMER_REAL,900)
    save()
    try:
        report['model_loads']=1
        save()
        generator=load_generator(str(adapter),threading.Event(),weights_sha256=WEIGHTS,config_sha256=CONFIG)
        for row in cpu['rows']:
            p=service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'],prompt_version=V3)
            assert p.request_ref==row['request_ref'] and p.messages()==row['messages']
            key=row['probe_id']
            sent=sha_text(canonical(p.messages()))
            write(out/('after_'+key+'.request.json'),dict(request_ref=p.request_ref,messages_sha256=sent,messages=p.messages()))
            item=dict(phase='after',probe_id=key,status='STARTED',prompt_version=V3,
                training_use=row['training_use'],source_kind=row.get('source_kind'),prompt_tokens=row['prompt_tokens'])
            report['calls'].append(item)
            assert report['new_calls']<53 and time.monotonic()<deadline
            report['new_calls']+=1
            save()
            begin=time.monotonic()
            raw,finish=generator(p.messages(),min(deadline,begin+23))
            response=Response(p.request_ref,sent,sha_text(raw),finish,raw)
            (out/('after_'+key+'.raw.txt')).write_text(raw)
            write(out/('after_'+key+'.response.json'),asdict(response))
            item.update(status='RETURNED',seconds=time.monotonic()-begin,finish_reason=finish,raw_sha256=response.raw_sha256)
            value=replace(p,response=response)
            for kind,build,serialize,reload,suffix in builders(service):
                if kind=='role' and not row['role_vertical']:continue
                admission='admission' if kind=='candidate' else 'role_admission'
                reason='reason' if kind=='candidate' else 'role_reason'
                try:artifact,coverage=build(row['owner'],row['snapshot'],model_input=value)
                except (SemanticError,SourceError) as exc:item.update({admission:'REJECTED',reason:str(exc)})
                else:
                    path=out/('after_'+key+suffix)
                    path.write_text(serialize(row['owner'],row['snapshot'],model_input=value,artifact=artifact,coverage=coverage))
                    assert saved_restore(reload,engine,compiler,author,row,path)==(artifact,coverage)
                    if kind=='candidate':assert json.loads(path.read_text())['state']['schema_version']==V3_STATE
                    item[admission]='RETURNED'
                    item[kind+'_coverage']=coverage
                    item[kind+'_file_replay']='MATCHED_NO_ENGINE_BOTH_COMPILERS_BOTH_AUTHORS'
            save()
        assert (report['new_calls'],report['model_loads'],report['training_updates'],report['nll_measurements'])==(53,1,0,0)
        assert all(c['status']=='RETURNED' and c['finish_reason']=='stop' for c in report['calls'])
        assert all(sha(path)==expected for path,expected in prior.items())
        report.update(status='COMPLETE_NOT_ADOPTED_PENDING_RAW_READ',all_finished_stop=True,all_prior_eighteen_files_unchanged=True)
    except BaseException as exc:
        report.update(status='FAILED_NOT_ADOPTED',error_type=type(exc).__name__,error=str(exc),traceback=traceback.format_exc())
        raise
    finally:
        generator=None
        import gc
        gc.collect()
        save()
        signal.setitimer(signal.ITIMER_REAL,0)


def replay_complete(args):
    _,_,prior,_=validate(args)
    gpu_after=json.loads((root/'gpu-after.json').read_text())
    assert gpu_after['exit']==0 and gpu_after['all_prior_nine_adapter_pairs_unchanged'] and gpu_after['compute_empty']
    assert gpu_after['adapter_hashes']==prior
    cpu=json.loads((root/'cpu/result.json').read_text())
    report=json.loads((root/'result/report.json').read_text())
    assert report['status']=='COMPLETE_NOT_ADOPTED_PENDING_RAW_READ' and report['all_finished_stop']
    assert report['api_commit']==COMMIT and report['prompt_version']==V3 and report['before_prompt_version']==V2
    assert report['cpu_result_sha256']==sha(root/'cpu/result.json')
    assert (report['new_calls'],report['model_loads'],report['training_updates'],report['nll_measurements'])==(53,1,0,0)
    recorded={'before':{r['probe_id']:r for r in cpu['before_admission']},'after':{r['probe_id']:r for r in report['calls']}}
    assert len(recorded['before'])==len(recorded['after'])==53
    service,engine,compiler,author,Response,SemanticError,canonical,SourceError=receiver()
    rows=[]
    for phase,profile in [('before',V2),('after',V3)]:
        for row in cpu['rows']:
            key=row['probe_id']
            prefix=(root if phase=='before' else root/'result')/(phase+'_'+key)
            p=service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'],prompt_version=profile)
            assert p.request_ref==row['v2_request_ref' if phase=='before' else 'request_ref']
            assert p.messages()==row['v2_messages' if phase=='before' else 'messages']
            request=json.loads(prefix.with_suffix('.request.json').read_text())
            response=json.loads(prefix.with_suffix('.response.json').read_text())
            raw=prefix.with_suffix('.raw.txt').read_bytes()
            assert request['request_ref']==p.request_ref and request['messages']==p.messages()
            assert request['messages_sha256']==sha_text(canonical(p.messages()))
            assert response['raw'].encode()==raw and response['raw_sha256']==sha256(raw).hexdigest()
            assert response['request_ref']==p.request_ref and response['messages_sha256']==request['messages_sha256']
            assert response['finish_reason']=='stop'
            if phase=='after':assert response['raw_sha256']==recorded[phase][key]['raw_sha256']
            value=replace(p,response=Response(**response))
            result=dict(phase=phase,probe_id=key,prompt_version=profile)
            for kind,build,_,reload,suffix in builders(service):
                if kind=='role' and not row['role_vertical']:continue
                admission='admission' if kind=='candidate' else 'role_admission'
                reason='reason' if kind=='candidate' else 'role_reason'
                path=prefix.with_suffix(suffix)
                try:artifact,coverage=build(row['owner'],row['snapshot'],model_input=value)
                except (SemanticError,SourceError) as exc:
                    assert recorded[phase][key][admission]=='REJECTED' and recorded[phase][key][reason]==str(exc) and not path.exists()
                    result.update({admission:'REJECTED',reason:str(exc)})
                else:
                    assert recorded[phase][key][admission]=='RETURNED'
                    assert saved_restore(reload,engine,compiler,author,row,path)==(artifact,coverage)
                    result[admission]='RETURNED'
                    result[kind+'_coverage']=coverage
            rows.append(result)
    assert len(rows)==106 and sum('role_admission' in r for r in rows)==32
    return dict(status='SAVED106_V2_V3_REPLAY_MATCHED',rows=rows,model_loads=0,generations=0,
        training_updates=0,nll_measurements=0,saved_reader_engine_both_compilers_both_authors_prohibited=True,
        admission_comparison_uses_existing_build=True)


def archive(args):
    destination=w/'cocolon-analysis-reason-v3-probe53-originals-20261103.zip'
    collected=w/'analysis-reason-v3-probe53-collected-20261103'
    assert root.exists() and not destination.exists() and not collected.exists()
    assert (root/'gpu-after.json').is_file()
    collected.mkdir()
    (root/'extra').mkdir(parents=True,exist_ok=True)
    for name in TEST_FILES:
        src=w/name
        if src.is_file():
            dst=root/'extra'/name
            dst.parent.mkdir(exist_ok=True)
            dst.write_bytes(src.read_bytes())
    log=w/'reason-v3-probe53-supervisor.log'
    if log.is_file():(root/'extra'/'reason-v3-probe53-supervisor.log').write_bytes(log.read_bytes())
    mode='PARTIAL_ARCHIVE_ONLY'
    replay_error=None
    report_path=root/'result/report.json'
    report=json.loads(report_path.read_text()) if report_path.exists() else None
    if (root/'run.exit').exists() and (root/'run.exit').read_text()=='0' and report and report.get('status')=='COMPLETE_NOT_ADOPTED_PENDING_RAW_READ':
        try:
            replay=replay_complete(args)
            write(root/'saved_replay.json',replay)
            mode='COMPLETE_SAVED106_REPLAY'
        except BaseException as exc:
            replay_error=dict(error_type=type(exc).__name__,error=str(exc),traceback=traceback.format_exc())
            write(root/'saved_replay_error.json',replay_error)
            mode='REPLAY_FAILED_ARCHIVE_ONLY_NO_RETRY'
    files={str(p.relative_to(root)):p for p in root.rglob('*') if p.is_file() and p!=root/'manifest.json'}
    write(root/'manifest.json',{name:sha(path) for name,path in files.items()})
    files['manifest.json']=root/'manifest.json'
    manifest={name:dict(bytes=path.stat().st_size,sha256=sha(path)) for name,path in sorted(files.items())}
    with zipfile.ZipFile(destination,'x',compression=zipfile.ZIP_DEFLATED) as z:
        for name,path in sorted(files.items()):z.write(path,name)
        z.writestr('export_manifest.json',json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    with zipfile.ZipFile(destination) as z:
        assert z.testzip() is None and len(z.namelist())==len(files)+1
        for name,expected in manifest.items():
            b=z.read(name)
            assert len(b)==expected['bytes'] and sha256(b).hexdigest()==expected['sha256']
    result=dict(status='ORIGINALS_ARCHIVED_NO_MODEL',mode=mode,archive=str(destination),bytes=destination.stat().st_size,
        sha256=sha(destination),members=len(files)+1,replay_rows=106 if replay_error is None and mode.startswith('COMPLETE') else 0,
        replay_error=replay_error is not None,model_loads=0,generations=0,training_updates=0,nll_measurements=0)
    write(collected/'collection.json',result)
    print(json.dumps(result))
    return 1 if replay_error else 0


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--phase',required=True,choices=['prepare','run','archive'])
    parser.add_argument('--api-commit',required=True)
    args=parser.parse_args()
    assert args.api_commit==COMMIT
    if args.phase=='prepare':prepare(args)
    elif args.phase=='run':run(args)
    else:return archive(args)
    return 0


if __name__=='__main__':raise SystemExit(main())
