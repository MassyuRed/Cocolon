"""Two known field-loss diagnostics: exact a2e/v7 before, formal private v8.

prepare API NEW_ROOT --expected-api-head SHA --prior-root BATCH20_ROOT
  --adapter INITIAL_A2E: CPU token/body/source check only.
run API PREPARED_ROOT --expected-api-head SHA: at most2 new generations/1load,
100-second computation bound, no training/retry. Full inputs/raw/state stay
private; only this runner, plan and body-free aggregate may be published.
This reads individual core candidates only, never normal transport or a map.
"""
from __future__ import annotations

import argparse
from contextlib import ExitStack
from dataclasses import asdict, replace
import hashlib
from importlib.metadata import version
import json
import os
from pathlib import Path
import shutil
import signal
import subprocess
import sys
import threading
import time
import traceback
from unittest.mock import patch
import zipfile

WEIGHTS = 'a2e62bca49ccccc5eb1d91254cd7f536d2cae0329ef7f80e5ee37208d335eb59'
CONFIG = '006ebf7bef859264b3778126f4a0f6512e1b2a7e6049b09dfcf0d56603ede3a9'
LOADER = 'ai/tools/serve_emlis_natural_reply.py'
LOADER_SHA = 'd3b7a04e38769485da995c8323aaaaf4426ff5273fcba6dff578ada85bdb77b6'
OLD_PROFILE, PROFILE = 'selected_material.v7', 'selected_material.v8'
MAX_SECONDS, PER_CASE_SECONDS, CONTEXT, NEW_TOKENS, BODY_LIMIT = 100, 23, 8192, 2048, 65536
PRIOR_FILES = {
    'pack.json': 'd04db2cd968b70a90badccffa3302a43ad4653e647879968d90838ed28f5b201',
    'synthetic_source.json': '3a96ecb98df5d07d804017431ea3952dde4aa1d5feefa24af36c5844181fb851',
    'child-001.response.json': '5bd87bb61764239d485ffe6cd0593943f889db996c123f34a7c7df7a5b8399bb',
    'child-003.response.json': 'c44b457af59dc4b8f18dffd0cd8752ff4e05a09ff8f4608eee0b23ed30c5c643',
    'child-001.raw.txt': '4120951e6217fd47f1906ef40b478b9fa632c3602a0c8363319d196d7daae1a9',
    'child-003.raw.txt': '4120951e6217fd47f1906ef40b478b9fa632c3602a0c8363319d196d7daae1a9',
}
SOURCE_PATHS = (
    'ai/services/ai_inference/analysis_cumulative_service.py',
    'ai/services/ai_inference/astor_material_snapshots.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/source_adapter.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py', LOADER)


def canonical(value):
    def encoded(item):
        if type(item) is bytes:
            return dict(bytes=len(item),sha256=hashlib.sha256(item).hexdigest())
        raise TypeError('unsupported_identity_type')
    return json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':'),
        allow_nan=False,default=encoded)


def digest(value):
    return hashlib.sha256(canonical(value).encode('utf-8')).hexdigest()


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def read(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def write(path,value):
    path=Path(path);temporary=path.with_name(path.name+'.tmp')
    temporary.write_text(canonical(value)+'\n',encoding='utf-8');temporary.replace(path)


def check_api(api,expected,before=None):
    git=lambda *args:subprocess.check_output(['git','-C',str(api),*args],text=True).strip()
    assert git('rev-parse','HEAD')==expected and not git('status','--porcelain','--untracked-files=no')
    assert sha(api/LOADER)==LOADER_SHA
    actual={path:sha(api/path) for path in SOURCE_PATHS}
    if before is not None:assert actual==before,'source_changed'
    return actual


def check_adapter(adapter):
    assert sha(adapter/'adapter_model.safetensors')==WEIGHTS
    assert sha(adapter/'adapter_config.json')==CONFIG


def imports(api):
    assert 'analysis_cumulative_service' not in sys.modules,'fresh_api_process_required'
    sys.path[:0]=[str(api/'ai/services/ai_inference'),str(api/'ai/services'),str(api/'ai/tools'),str(api)]
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as semantic
    import serve_emlis_natural_reply as probe
    assert {name:version(name) for name in probe.PINS}==probe.PINS
    assert probe.MODEL=='Qwen/Qwen3.5-4B' and probe.REVISION=='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a'
    assert semantic.QUOTED_PARENT_MATERIAL_V8_PROFILE==PROFILE
    return service,semantic,probe


def field_tail(ordinals):
    # Assertion only. Actual sent messages always come from canonical prepare.
    return ('\n今回の入力field番号一覧：'+canonical(ordinals)+'。総数：'+str(len(ordinals))
        +'。出力fieldsには全番号を入力順に各1回ずつ返してください。')


def reconstruct(service,semantic,prior,snapshot,index):
    parent=service.prepare_cumulative_category_units(prior['owner'],snapshot,prompt_version=OLD_PROFILE)
    assert parent.request_ref==prior['parent_request_ref'] and parent.messages()==prior['parent_messages']
    assert digest(parent.messages())==prior['parent_messages_sha256']
    row=prior['children'][index-1]
    members={member.saved_record_ref:member for member in parent.request.members}
    refs=row['record_refs'];assert len(set(refs))==len(refs) and all(ref in members for ref in refs)
    child=semantic.prepare_analysis_model_quoted_parent_units(
        replace(parent.request,members=tuple(members[ref] for ref in refs)),
        source_guard=parent.source_guard,prompt_version=OLD_PROFILE)
    assert child.request_ref==row['request_ref'] and child.messages()==row['messages']
    assert child.source_guard==row['source_guard'] and digest(child.messages())==row['messages_sha256']
    semantic.require_analysis_model_observed_scope(child.request)
    return child


def descriptor(semantic,prepared):
    frozen,fields=semantic._model_fields_source(prepared.request,allow_supplements=True)
    return dict(request=asdict(prepared.request),request_sha256=digest(asdict(prepared.request)),
        source_guard=prepared.source_guard,request_ref=prepared.request_ref,prompt_version=prepared.prompt_version,
        messages=prepared.messages(),messages_sha256=digest(prepared.messages()),
        source_set_ref=frozen.source_set_ref,source_identity_sha256=digest([asdict(s) for s in frozen.sources]),
        field_refs=[field['field_ref'] for field in fields],field_count=len(fields),
        source_record_refs=[member.saved_record_ref for member in frozen.members])


def fresh_v8(semantic,old):
    prepared=semantic.prepare_analysis_model_quoted_parent_units(old.request,
        source_guard=old.source_guard,prompt_version=PROFILE)
    assert prepared.request==old.request and prepared.source_guard==old.source_guard
    assert prepared.request_ref!=old.request_ref and prepared.response is None
    before,after=old.messages(),prepared.messages()
    ordinals=[field['field'] for field in json.loads(before[1]['content'])['fields']]
    assert after[1]==before[1]
    assert after[0]['role']==before[0]['role']=='system'
    assert after[0]['content']==before[0]['content']+field_tail(ordinals)
    return prepared


def archive(root):
    target=Path(str(root)+'.zip');assert not target.exists(),'do_not_replace_archive'
    files=sorted(path for path in root.rglob('*') if path.is_file() and path.name!='manifest.json')
    write(root/'manifest.json',{str(path.relative_to(root)):dict(bytes=path.stat().st_size,sha256=sha(path)) for path in files})
    with zipfile.ZipFile(target,'x',compression=zipfile.ZIP_DEFLATED) as output:
        for path in files+[root/'manifest.json']:output.write(path,str(path.relative_to(root)))
    with zipfile.ZipFile(target) as output:assert output.testzip() is None
    return dict(path=str(target),bytes=target.stat().st_size,sha256=sha(target))


def prepare(api,root,expected,prior_root,adapter):
    assert not root.exists() and not Path(str(root)+'.zip').exists()
    assert root!=api and api not in root.parents and root!=prior_root and prior_root not in root.parents
    before=check_api(api,expected);check_adapter(adapter)
    assert {name:sha(prior_root/name) for name in PRIOR_FILES}==PRIOR_FILES
    prior,snapshot=read(prior_root/'pack.json'),read(prior_root/'synthetic_source.json')
    root.mkdir();shutil.copyfile(__file__,root/'runner.py')
    for name in PRIOR_FILES:shutil.copyfile(prior_root/name,root/('before-v7-'+name))
    report=dict(status='PREPARING_CPU_ONLY',model_loads=0,new_generation=0,new_training=0,cases=[])
    started=time.monotonic();failure=None
    try:
        service,semantic,probe=imports(api)
        import httpx
        from transformers import AutoTokenizer
        assert prior['adapter_weights_sha256']==WEIGHTS and prior['adapter_config_sha256']==CONFIG
        assert (prior['model'],prior['revision'],prior['pins'])==(probe.MODEL,probe.REVISION,probe.PINS)
        assert prior['prompt_version']==OLD_PROFILE and digest(snapshot)==prior['fixture_sha256']
        tokenizer=AutoTokenizer.from_pretrained(probe.MODEL,revision=probe.REVISION,
            local_files_only=True,trust_remote_code=False)
        rows=[]
        for index in (1,3):
            old=reconstruct(service,semantic,prior,snapshot,index)
            saved=read(prior_root/f'child-{index:03}.response.json')
            assert set(saved)=={'request_ref','messages_sha256','raw_sha256','finish_reason','raw'}
            response=semantic.AnalysisModelQuotedParentUnitsResponse(**saved)
            assert asdict(response)==saved and saved['finish_reason']=='stop'
            assert saved['request_ref']==old.request_ref and saved['messages_sha256']==digest(old.messages())
            assert (prior_root/f'child-{index:03}.raw.txt').read_text(encoding='utf-8')==saved['raw']
            assert hashlib.sha256(saved['raw'].encode('utf-8')).hexdigest()==saved['raw_sha256']
            assert [field['field'] for field in json.loads(saved['raw'])['fields']]==[1]
            try:
                semantic._admit_quoted_parent_units(old.request,replace(old,response=response))
            except semantic.AnalysisSemanticError as error:
                rejection=str(error)
            else:
                raise AssertionError('known_v7_field_loss_was_not_rejected')
            new=fresh_v8(semantic,old)
            old_desc,new_desc=descriptor(semantic,old),descriptor(semantic,new)
            for key in ('request','request_sha256','source_guard','source_set_ref',
                    'source_identity_sha256','field_refs','field_count','source_record_refs'):
                assert canonical(old_desc[key])==canonical(new_desc[key])
            assert new_desc['field_count']==(7 if index==1 else 6)
            tokens=tokenizer.apply_chat_template(new.messages(),enable_thinking=False,
                add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
            body=httpx.Request('POST','https://localhost/v1/chat/completions',json=dict(
                model=probe.MODEL,messages=new.messages(),temperature=0,max_tokens=NEW_TOKENS,
                stream=False,chat_template_kwargs={'enable_thinking':False})).content
            assert len(tokens)+NEW_TOKENS<=CONTEXT and len(body)<=BODY_LIMIT
            row=dict(id=f'FC{index:02}',old_child_index=index,before=old_desc,
                cached_before_response=saved,cached_before_rejection=rejection,after=new_desc,
                prompt_tokens=len(tokens),prompt_token_ids_sha256=digest(tokens),
                total_reserved_tokens=len(tokens)+NEW_TOKENS,request_body_bytes=len(body),
                request_body_sha256=hashlib.sha256(body).hexdigest(),
                system_tail_sha256=hashlib.sha256(field_tail(list(range(1,new_desc['field_count']+1))).encode()).hexdigest())
            rows.append(row);report['cases'].append(dict(id=row['id'],field_count=new_desc['field_count'],input_budget_fits=True))
            write(root/'report.json',report)
        pack=dict(schema_version='analysis_v8_fieldcount_inputs.v1',api_commit=expected,
            source_hashes=before,runner_sha256=sha(__file__),adapter_path=str(adapter),
            adapter_weights_sha256=WEIGHTS,adapter_config_sha256=CONFIG,model=probe.MODEL,
            revision=probe.REVISION,pins=probe.PINS,prior_file_sha256=PRIOR_FILES,
            snapshot=snapshot,owner=prior['owner'],cases=rows,prompt_version=PROFILE,
            baseline_profile=OLD_PROFILE,max_new_generation=2,max_model_loads=1,
            max_seconds=MAX_SECONDS,per_case_seconds=PER_CASE_SECONDS,
            context_tokens=CONTEXT,max_new_tokens=NEW_TOKENS,max_request_bytes=BODY_LIMIT,
            new_training=0,retry=0,normal_adoption=False,next_training_initial_adoption=False,
            scope='Known7/6field omission diagnosis on exact familiar a2e inputs. Core individual candidates only; no normal source/batch whitelist, map, API/DB, quality-rate or 60-second product claim.')
        write(root/'pack.json',pack);check_api(api,expected,before);check_adapter(adapter)
        assert {name:sha(prior_root/name) for name in PRIOR_FILES}==PRIOR_FILES
        report.update(status='PREPARED_CPU_ONLY',pack_sha256=sha(root/'pack.json'),seconds=time.monotonic()-started)
        write(root/'prepare.json',report)
    except BaseException as error:
        failure=error;report.update(status='FAILED_PREPARATION_NO_RETRY',error_type=type(error).__name__,traceback=traceback.format_exc())
    finally:
        write(root/'report.json',report)
        if failure is not None:print(canonical(dict(status=report['status'],archive=archive(root))))
    if failure is not None:raise failure


def replay_guard(semantic):
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
    from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
    stack=ExitStack()
    for owner,name in ((MeaningExperienceEngine,'generate'),(compiler,'compile_observed_graph'),
            (compiler,'compile_analysis_unit_candidates'),(author,'realize_analysis_unit_candidates'),
            (author,'realize_observed_graph'),(semantic,'generate_analysis_model_quoted_parent_units')):
        stack.enter_context(patch.object(owner,name,side_effect=AssertionError('private_replay_generation_forbidden')))
    return stack


def bound_cases(service,semantic,pack,root):
    prior=read(root/'before-v7-pack.json');snapshot=pack['snapshot'];output=[]
    for row in pack['cases']:
        old=reconstruct(service,semantic,prior,snapshot,row['old_child_index'])
        child=fresh_v8(semantic,old)
        assert canonical(descriptor(semantic,old))==canonical(row['before'])
        assert canonical(descriptor(semantic,child))==canonical(row['after'])
        assert row['cached_before_response']==read(root/f"before-v7-child-{row['old_child_index']:03}.response.json")
        output.append((row,child))
    assert len(output)==2
    return output


def generate(api,root,expected,deadline,pack_sha):
    assert not (root/'generation.json').exists() and sha(root/'pack.json')==pack_sha
    assert sha(__file__)==sha(root/'runner.py')
    assert read(root/'report.json')['status']=='RUNNING_MODEL_ONLY'
    assert read(root/'run_started.json')['pack_sha256']==pack_sha
    pack=read(root/'pack.json');adapter=Path(pack['adapter_path'])
    check_api(api,expected,pack['source_hashes']);check_adapter(adapter)
    service,semantic,probe=imports(api)
    assert (pack['model'],pack['revision'],pack['pins'])==(probe.MODEL,probe.REVISION,probe.PINS)
    cases=bound_cases(service,semantic,pack,root)
    stop=threading.Event();started=time.monotonic()
    report=dict(status='MODEL_LOADING',cases=[],model_loads_started=1,model_loads=0,
        model_calls_started=0,new_generation=0,stop_count=0,strict_rejections=0,
        new_training=0,normal_adoption=False,api_calls=0,database_access=0,observed_map_calls=0)
    def checkpoint():
        report['seconds']=time.monotonic()-started;write(root/'generation.json',report)
    def terminated(signum,_frame):
        stop.set();report.update(status='TERMINATED_PARTIAL_NO_RETRY',signal=signum);checkpoint()
        raise SystemExit(128+signum)
    signal.signal(signal.SIGTERM,terminated);signal.signal(signal.SIGINT,terminated);checkpoint()
    try:
        generator=probe.load_generator(str(adapter),stop,weights_sha256=WEIGHTS,config_sha256=CONFIG)
        report.update(model_loads=1,status='GENERATING');checkpoint()
        for row,child in cases:
            assert report['model_calls_started']<2 and time.monotonic()<deadline-5
            entry=dict(id=row['id'],phase='STARTED',request_ref=child.request_ref,
                messages_sha256=row['after']['messages_sha256'],expected_fields=row['after']['field_count'])
            report['cases'].append(entry);report['model_calls_started']+=1;checkpoint()
            called=time.monotonic();end=min(deadline-5,called+PER_CASE_SECONDS)
            signal.signal(signal.SIGALRM,signal.SIG_DFL)
            signal.setitimer(signal.ITIMER_REAL,max(0.001,end-time.monotonic()))
            try:
                raw,finish=generator(child.messages(),end);returned=time.monotonic()
            finally:
                signal.setitimer(signal.ITIMER_REAL,0)
            report['new_generation']+=1;report['stop_count']+=int(finish=='stop')
            raw_path=root/(row['id']+'.raw.txt');raw_path.write_text(raw,encoding='utf-8')
            response=semantic.AnalysisModelQuotedParentUnitsResponse(child.request_ref,
                row['after']['messages_sha256'],hashlib.sha256(raw.encode('utf-8')).hexdigest(),finish,raw)
            write(root/(row['id']+'.response.json'),asdict(response))
            entry.update(phase='RAW_RECEIVED',finish_reason=finish,raw_sha256=response.raw_sha256,
                seconds=returned-called,raw_file_sha256=sha(raw_path));checkpoint()
            assert sha(raw_path)==response.raw_sha256
            assert finish=='stop' and returned<=end,'incomplete_or_late_raw_preserved_no_retry'
            try:
                packet=semantic._load(raw)
                entry['returned_field_ordinals']=[field['field'] for field in packet['fields']] if type(packet) is dict and type(packet.get('fields')) is list and all(type(field) is dict and type(field.get('field')) is int and field['field']>0 for field in packet['fields']) else None
                bound=replace(child,response=response)
                candidate=semantic.generate_analysis_model_quoted_parent_units(child.request,bound)
                state=semantic.serialize_analysis_model_quoted_parent_units(bound,candidate)
                (root/(row['id']+'.candidate.private.json')).write_text(state,encoding='utf-8')
                with replay_guard(semantic):
                    assert semantic.reload_analysis_model_quoted_parent_units(child,state)==candidate
                assert read(root/(row['id']+'.candidate.private.json'))['schema_version']=='cocolon.cmee.analysis_model_units_quoted_parents_state.material.v8'
            except (semantic.AnalysisSemanticError,ValueError,KeyError,TypeError,AttributeError) as error:
                report['strict_rejections']+=1
                entry.update(phase='STRICT_REJECTED',error_type=type(error).__name__,error=str(error))
            else:
                entry.update(phase='CANDIDATE_PRESERVED',private_non_generating_replay=True,
                    candidate_field_count=len(candidate.graph.fields))
            assert response.raw==raw and asdict(response)==read(root/(row['id']+'.response.json'))
            checkpoint()
        assert report['model_calls_started']==report['new_generation']==report['stop_count']==2
        check_api(api,expected,pack['source_hashes']);check_adapter(adapter)
        report.update(status='COMPLETE_KNOWN_DIAGNOSTIC_PENDING_RAW_REVIEW',source_hashes_unchanged=True,adapter_unchanged=True)
    except BaseException as error:
        report.update(status='FAILED_PARTIAL_NO_RETRY',error_type=type(error).__name__,traceback=traceback.format_exc())
        raise
    finally:
        stop.set();checkpoint()


def public_summary(report,pack):
    keys=('status','seconds','model_loads_started','model_loads','model_calls_started','new_generation',
        'stop_count','strict_rejections','new_training','normal_adoption','api_calls','database_access',
        'observed_map_calls','source_hashes_unchanged','adapter_unchanged','error_type','integrity_error_type')
    return dict(schema_version='analysis_v8_fieldcount_aggregate.v1',api_commit=pack['api_commit'],
        prompt_version=PROFILE,baseline_profile=OLD_PROFILE,adapter_weights_sha256=WEIGHTS,
        max_seconds=MAX_SECONDS,per_case_seconds=PER_CASE_SECONDS,max_new_tokens=NEW_TOKENS,
        **{key:report[key] for key in keys if key in report},
        cases=[{key:case[key] for key in ('id','phase','expected_fields','returned_field_ordinals',
            'finish_reason','candidate_field_count','private_non_generating_replay','seconds','raw_sha256','error_type') if key in case}
            for case in report.get('cases',[])],
        interpretation='Two known a2e field-omission cases; new private v8 system tail only, formal new request/response identity. No general semantic quality, map, normal rollout or training claim.')


def run(api,root,expected):
    assert read(root/'report.json')['status']=='PREPARED_CPU_ONLY'
    assert sha(__file__)==sha(root/'runner.py') and not Path(str(root)+'.zip').exists()
    prepared=read(root/'prepare.json');pack_sha=sha(root/'pack.json');pack=read(root/'pack.json')
    assert pack_sha==prepared['pack_sha256'] and pack['runner_sha256']==sha(__file__)
    assert pack['api_commit']==expected and len(pack['cases'])==pack['max_new_generation']==2
    assert (pack['max_model_loads'],pack['max_seconds'],pack['per_case_seconds'],pack['max_new_tokens'],pack['context_tokens'],pack['new_training'],pack['retry'])==(1,100,23,2048,8192,0,0)
    adapter=Path(pack['adapter_path']);check_api(api,expected,pack['source_hashes']);check_adapter(adapter)
    for name,value in PRIOR_FILES.items():assert sha(root/('before-v7-'+name))==value
    with (root/'run_started.json').open('x',encoding='utf-8') as output:json.dump(dict(pack_sha256=pack_sha,max_seconds=MAX_SECONDS),output)
    started=time.monotonic();deadline=started+MAX_SECONDS
    report=dict(status='RUNNING_MODEL_ONLY',api_commit=expected,pack_sha256=pack_sha,new_training=0,normal_adoption=False)
    write(root/'report.json',report);process=None;failure=None
    try:
        assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True).strip()
        with (root/'generation.log').open('x',encoding='utf-8') as log:
            process=subprocess.Popen([sys.executable,__file__,'_generate',str(api),str(root),
                '--expected-api-head',expected,'--deadline',str(deadline),'--pack-sha',pack_sha],
                stdout=log,stderr=subprocess.STDOUT,start_new_session=True)
            try:code=process.wait(timeout=max(1,deadline-time.monotonic()-4))
            except subprocess.TimeoutExpired:
                os.killpg(process.pid,signal.SIGTERM)
                try:process.wait(timeout=2)
                except subprocess.TimeoutExpired:os.killpg(process.pid,signal.SIGKILL);process.wait(timeout=1)
                raise TimeoutError('bounded_generation_expired_no_retry')
        report['child_exit']=code;child=read(root/'generation.json')
        assert code==0 and child['status']=='COMPLETE_KNOWN_DIAGNOSTIC_PENDING_RAW_REVIEW'
        report.update(child)
    except BaseException as error:
        failure=error;report.update(status='FAILED_PARTIAL_NO_RETRY',error_type=type(error).__name__,traceback=traceback.format_exc())
    finally:
        if process is not None and process.poll() is None:os.killpg(process.pid,signal.SIGKILL);process.wait(timeout=1)
        child_path=root/'generation.json'
        if child_path.exists():
            child=read(child_path)
            for key in ('cases','model_loads_started','model_loads','model_calls_started','new_generation',
                    'stop_count','strict_rejections','new_training','api_calls','database_access','observed_map_calls'):
                if key in child:report[key]=child[key]
        report['seconds']=time.monotonic()-started
        try:
            check_api(api,expected,pack['source_hashes']);check_adapter(adapter)
            for name,value in PRIOR_FILES.items():assert sha(root/('before-v7-'+name))==value
            assert sha(root/'pack.json')==pack_sha
            report.update(source_hashes_unchanged=True,adapter_unchanged=True,cached_v7_before_unchanged=True)
        except BaseException as error:
            report.update(status='FAILED_PARTIAL_NO_RETRY',integrity_error_type=type(error).__name__)
            if failure is None:failure=error
        write(root/'report.json',report);write(root/'aggregate.json',public_summary(report,pack))
        print(canonical(dict(status=report['status'],archive=archive(root))))
    if failure is not None:raise failure


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode',choices=('prepare','run','_generate'))
    parser.add_argument('api',type=Path);parser.add_argument('root',type=Path)
    parser.add_argument('--expected-api-head',required=True)
    parser.add_argument('--prior-root',type=Path);parser.add_argument('--adapter',type=Path)
    parser.add_argument('--deadline',type=float);parser.add_argument('--pack-sha')
    args=parser.parse_args();args.api=args.api.resolve();args.root=args.root.resolve()
    sys.dont_write_bytecode=True
    os.environ.update(HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1',HF_DATASETS_OFFLINE='1')
    if args.mode=='prepare':
        assert args.prior_root and args.adapter
        prepare(args.api,args.root,args.expected_api_head,args.prior_root.resolve(),args.adapter.resolve())
    elif args.mode=='run':run(args.api,args.root,args.expected_api_head)
    else:
        assert args.deadline and args.pack_sha
        generate(args.api,args.root,args.expected_api_head,args.deadline,args.pack_sha)


if __name__=='__main__':main()
