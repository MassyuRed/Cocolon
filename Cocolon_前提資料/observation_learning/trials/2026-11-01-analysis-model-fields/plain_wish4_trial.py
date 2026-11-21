"""Four independent wish diagnostics, with unchanged old-API model inputs.

prepare OLD_API NEW_ROOT: CPU tokenizer/body check; no model load.
run OLD_API PREPARED_ROOT: four attempts once, original a2e, no training.
replay API SOURCE_ROOT --output-root NEW_ROOT --expected-api-head SHA:
    fresh-process CPU reading of the exact saved Responses on old/new API.
The new replay may add --compare-replay OLD_REPLAY_ROOT. Full messages/raw/maps
remain private; only runner/synthetic source/public-safe aggregate may publish.
No normal ensure, API request, DB, saved-map reader or adoption is performed.
"""
from __future__ import annotations

import argparse
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
import zipfile

OLD_API = 'fc7563b98d5dfa5b8df7815e9a8b89f334b6719b'
NEW_API = '09b65013658c661cbc33a3857bd2e360e6f4c424'
ADAPTER = Path('/workspace/analysis-material-v4-pair8-20261103/train/adapter')
WEIGHTS = 'a2e62bca49ccccc5eb1d91254cd7f536d2cae0329ef7f80e5ee37208d335eb59'
CONFIG = '006ebf7bef859264b3778126f4a0f6512e1b2a7e6049b09dfcf0d56603ede3a9'
LOADER = 'ai/tools/serve_emlis_natural_reply.py'
LOADER_SHA = 'd3b7a04e38769485da995c8323aaaaf4426ff5273fcba6dff578ada85bdb77b6'
PROFILE = 'selected_material.v7'
MAX_SECONDS = 140
PER_CASE_SECONDS = 23
CONTEXT = 8192
NEW_TOKENS = 2048
BODY_LIMIT = 65536
MEMOS = (None, '私は仕事を続けたかった。', '仕事を続けたい。', '私は仕事を続けたくない。')
SOURCE_PATHS = ('ai/tests/test_analysis_cumulative.py',
    'ai/services/ai_inference/analysis_cumulative_service.py',
    'ai/services/ai_inference/astor_material_snapshots.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/source_adapter.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py', LOADER)


def canonical(value):
    def encoded(item):
        if type(item) is bytes:
            return dict(bytes=len(item), sha256=hashlib.sha256(item).hexdigest())
        raise TypeError('unsupported_identity_type')
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'),
        allow_nan=False, default=encoded)


def digest(value):
    return hashlib.sha256(canonical(value).encode('utf-8')).hexdigest()


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def write(path, value):
    temporary = path.with_name(path.name+'.tmp')
    temporary.write_text(canonical(value)+'\n', encoding='utf-8')
    temporary.replace(path)


def check_api(api, expected, before=None):
    assert expected in {OLD_API, NEW_API}
    git = lambda *args:subprocess.check_output(['git','-C',str(api),*args], text=True).strip()
    assert git('rev-parse','HEAD') == expected and not git('status','--porcelain','--untracked-files=no')
    assert sha(api/LOADER) == LOADER_SHA
    actual = {p:sha(api/p) for p in SOURCE_PATHS}
    if before is not None:
        assert actual == before, 'source_changed'
    return actual


def check_adapter():
    assert sha(ADAPTER/'adapter_model.safetensors') == WEIGHTS
    assert sha(ADAPTER/'adapter_config.json') == CONFIG


def imports(api):
    # Each CLI execution is a separate Python process. Do not mix API modules.
    assert 'analysis_cumulative_service' not in sys.modules
    sys.path[:0] = [str(api/'ai/services/ai_inference'),str(api/'ai/services'),
        str(api/'ai/tests'),str(api/'ai/tools'),str(api)]
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as semantic
    import serve_emlis_natural_reply as probe
    from test_analysis_cumulative import OWNER, source_snapshot
    assert {n:version(n) for n in probe.PINS} == probe.PINS
    assert probe.MODEL == 'Qwen/Qwen3.5-4B' and probe.REVISION == '851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a'
    return service, semantic, probe, OWNER, source_snapshot


def source_cases(source_snapshot):
    cases = []
    for index, memo in enumerate(MEMOS, 1):
        snap = source_snapshot(1)  # Four independent complete fixtures, no slice.
        original = canonical(snap)
        if memo is not None:
            snap['members'][0]['original']['memo'] = memo
        check = json.loads(canonical(snap))
        check['members'][0]['original']['memo'] = json.loads(original)['members'][0]['original']['memo']
        assert canonical(check) == original, 'metadata_or_time_changed'
        cases.append((f'WH{index:02}', snap))
    return cases


def descriptor(semantic, prepared, snapshot):
    frozen, fields = semantic._model_fields_source(prepared.request, allow_supplements=True)
    semantic.require_analysis_model_observed_scope(prepared.request, frozen=frozen)
    return dict(snapshot=snapshot, fixture_sha256=digest(snapshot), request=asdict(prepared.request),
        request_sha256=digest(asdict(prepared.request)), source_guard=prepared.source_guard,
        request_ref=prepared.request_ref, messages=prepared.messages(), messages_sha256=digest(prepared.messages()),
        source_set_ref=frozen.source_set_ref, source_identity_sha256=digest([asdict(s) for s in frozen.sources]),
        field_refs=[f['field_ref'] for f in fields], prompt_version=prepared.prompt_version)


def archive(root):
    target = Path(str(root)+'.zip')
    assert not target.exists(), 'do_not_replace_archive'
    files = sorted(p for p in root.rglob('*') if p.is_file() and p.name != 'manifest.json')
    write(root/'manifest.json', {str(p.relative_to(root)):dict(bytes=p.stat().st_size,sha256=sha(p)) for p in files})
    with zipfile.ZipFile(target,'x',compression=zipfile.ZIP_DEFLATED) as output:
        for p in files+[root/'manifest.json']:
            output.write(p,str(p.relative_to(root)))
    with zipfile.ZipFile(target) as output:
        assert output.testzip() is None
    return dict(path=str(target),bytes=target.stat().st_size,sha256=sha(target))


def prepare(api, root):
    assert not root.exists() and not Path(str(root)+'.zip').exists()
    assert root != api and api not in root.parents
    before = check_api(api,OLD_API)
    check_adapter()
    root.mkdir()
    shutil.copyfile(__file__,root/'runner.py')
    report = dict(status='PREPARING_CPU_ONLY',model_loads=0,new_generation=0,new_training=0)
    write(root/'report.json',report)
    started = time.monotonic()
    try:
        service, semantic, probe, owner, source_snapshot = imports(api)
        import httpx
        from transformers import AutoTokenizer
        tokenizer = AutoTokenizer.from_pretrained(probe.MODEL,revision=probe.REVISION,
            local_files_only=True,trust_remote_code=False)
        rows = []
        for name,snapshot in source_cases(source_snapshot):
            prepared = service.prepare_cumulative_category_units(owner,snapshot,prompt_version=PROFILE)
            row = dict(id=name,**descriptor(semantic,prepared,snapshot))
            tokens = tokenizer.apply_chat_template(prepared.messages(),enable_thinking=False,
                add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
            body = httpx.Request('POST','https://localhost/v1/chat/completions',json=dict(model=probe.MODEL,
                messages=prepared.messages(),temperature=0,max_tokens=NEW_TOKENS,stream=False,
                chat_template_kwargs={'enable_thinking':False})).content
            assert len(tokens)+NEW_TOKENS <= CONTEXT and len(body) <= BODY_LIMIT
            row.update(prompt_tokens=len(tokens),prompt_token_ids_sha256=digest(tokens),
                request_body_bytes=len(body),request_body_sha256=hashlib.sha256(body).hexdigest())
            rows.append(row)
            write(root/(name+'.source.json'),snapshot)
        assert len({r['request_ref'] for r in rows}) == len({r['messages_sha256'] for r in rows}) == 4
        pack = dict(schema_version='analysis_plain_wish4_inputs.v1',api_commit=OLD_API,
            comparison_api_commit=NEW_API,source_hashes=before,runner_sha256=sha(__file__),
            adapter_weights_sha256=WEIGHTS,adapter_config_sha256=CONFIG,owner=owner,
            model=probe.MODEL,revision=probe.REVISION,pins=probe.PINS,prompt_version=PROFILE,cases=rows,
            max_new_generation=4,max_model_loads=1,new_training=0,max_seconds=MAX_SECONDS,
            per_case_seconds=PER_CASE_SECONDS,context_tokens=CONTEXT,max_new_tokens=NEW_TOKENS,
            fixture_scope='Independent source_snapshot(1) fixtures; memo only explicitly changed; original times and all other metadata unchanged.')
        write(root/'pack.json',pack)
        check_api(api,OLD_API,before);check_adapter()
        report.update(status='PREPARED_CPU_ONLY',pack_sha256=sha(root/'pack.json'),seconds=time.monotonic()-started)
        write(root/'prepare.json',report)
    except BaseException as error:
        report.update(status='FAILED_PREPARATION_NO_RETRY',error_type=type(error).__name__,traceback=traceback.format_exc())
        raise
    finally:
        write(root/'report.json',report)


def bound_case(service, semantic, owner, source_snapshot, row):
    expected = dict(source_cases(source_snapshot))[row['id']]
    assert expected == row['snapshot'] and digest(expected) == row['fixture_sha256']
    prepared = service.prepare_cumulative_category_units(owner,expected,prompt_version=PROFILE)
    actual = descriptor(semantic,prepared,expected)
    assert all(canonical(actual[k]) == canonical(row[k]) for k in actual), 'request_messages_or_source_changed'
    return expected,prepared


def generate(api, root, deadline, pack_sha):
    assert not (root/'generation.json').exists() and sha(root/'pack.json') == pack_sha
    assert sha(__file__) == sha(root/'runner.py')
    assert json.loads((root/'report.json').read_text())['status'] == 'RUNNING_MODEL_ONLY'
    assert json.loads((root/'run_started.json').read_text())['pack_sha256'] == pack_sha
    pack = json.loads((root/'pack.json').read_text())
    check_api(api,OLD_API,pack['source_hashes']);check_adapter()
    service,semantic,probe,owner,source_snapshot = imports(api)
    prepared = [(row,*bound_case(service,semantic,owner,source_snapshot,row)) for row in pack['cases']]
    assert len(prepared) == 4 and pack['runner_sha256'] == sha(__file__)
    stop = threading.Event();started = time.monotonic()
    report = dict(status='MODEL_LOADING',cases=[],model_loads_started=1,model_loads=0,
        model_calls_started=0,new_generation=0,stop_count=0,admission_rejections=0,new_training=0,
        normal_adoption=False,api_calls=0,database_access=0,composition_calls=0)
    def checkpoint():
        report['seconds'] = time.monotonic()-started;write(root/'generation.json',report)
    def terminated(signum,_frame):
        stop.set();report.update(status='TERMINATED_PARTIAL_NO_RETRY',signal=signum);checkpoint()
        raise SystemExit(128+signum)
    signal.signal(signal.SIGTERM,terminated);signal.signal(signal.SIGINT,terminated);checkpoint()
    try:
        generator = probe.load_generator(str(ADAPTER),stop,weights_sha256=WEIGHTS,config_sha256=CONFIG)
        report.update(model_loads=1,status='GENERATING');checkpoint()
        for row,_snapshot,child in prepared:
            assert report['model_calls_started'] < 4 and time.monotonic() < deadline-5
            entry = dict(id=row['id'],phase='STARTED',request_ref=child.request_ref,messages_sha256=row['messages_sha256'])
            report['cases'].append(entry);report['model_calls_started'] += 1;checkpoint()
            call_started = time.monotonic();end = min(deadline-5,call_started+PER_CASE_SECONDS)
            signal.signal(signal.SIGALRM,signal.SIG_DFL)
            signal.setitimer(signal.ITIMER_REAL,max(0.001,end-time.monotonic()))
            try:
                raw,finish = generator(child.messages(),end);returned = time.monotonic()
            finally:
                signal.setitimer(signal.ITIMER_REAL,0)
            report['new_generation'] += 1;report['stop_count'] += int(finish == 'stop')
            entry.update(phase='RAW_RECEIVED',raw=raw,raw_sha256=hashlib.sha256(raw.encode()).hexdigest(),
                finish_reason=finish,seconds=returned-call_started)
            raw_path = root/(row['id']+'.raw.txt');raw_path.write_text(raw,encoding='utf-8')
            entry['raw_file_sha256'] = sha(raw_path);assert entry['raw_file_sha256'] == entry['raw_sha256']
            response = semantic.AnalysisModelQuotedParentUnitsResponse(child.request_ref,row['messages_sha256'],
                entry['raw_sha256'],finish,raw)
            write(root/(row['id']+'.response.json'),asdict(response));checkpoint()
            assert finish == 'stop' and returned <= end, 'incomplete_or_late_response_preserved_no_retry'
            try:
                semantic._admit_quoted_parent_units(child.request,replace(child,response=response))
            except (ValueError,KeyError,TypeError,AttributeError) as error:
                report['admission_rejections'] += 1
                entry.update(phase='ADMISSION_REJECTED',error_type=type(error).__name__,error=str(error))
            else:
                entry['phase'] = 'ADMITTED'
            checkpoint()
        assert report['new_generation'] == report['model_calls_started'] == report['stop_count'] == 4
        check_api(api,OLD_API,pack['source_hashes']);check_adapter()
        report.update(status='COMPLETE_GENERATION_ONLY_PENDING_CPU_REPLAY',source_hashes_unchanged=True,adapter_unchanged=True)
    except BaseException as error:
        report.update(status='FAILED_PARTIAL_NO_RETRY',error_type=type(error).__name__,traceback=traceback.format_exc())
        raise
    finally:
        stop.set();checkpoint()


def run(api, root):
    assert json.loads((root/'report.json').read_text())['status'] == 'PREPARED_CPU_ONLY'
    assert sha(__file__) == sha(root/'runner.py') and not Path(str(root)+'.zip').exists()
    prepared = json.loads((root/'prepare.json').read_text());pack_sha = sha(root/'pack.json')
    assert pack_sha == prepared['pack_sha256'];pack = json.loads((root/'pack.json').read_text())
    check_api(api,OLD_API,pack['source_hashes']);check_adapter()
    with (root/'run_started.json').open('x') as out:json.dump(dict(pack_sha256=pack_sha,max_seconds=MAX_SECONDS),out)
    started = time.monotonic();deadline = started+MAX_SECONDS
    report = dict(status='RUNNING_MODEL_ONLY',api_commit=OLD_API,pack_sha256=pack_sha,new_training=0)
    write(root/'report.json',report);proc = None;integrity_failure = None
    try:
        with (root/'generation.log').open('x') as log:
            proc = subprocess.Popen([sys.executable,__file__,'_generate',str(api),str(root),
                '--deadline',str(deadline),'--pack-sha',pack_sha],stdout=log,stderr=subprocess.STDOUT,start_new_session=True)
            try:code = proc.wait(timeout=max(1,deadline-time.monotonic()-4))
            except subprocess.TimeoutExpired:
                os.killpg(proc.pid,signal.SIGTERM)
                try:proc.wait(timeout=2)
                except subprocess.TimeoutExpired:os.killpg(proc.pid,signal.SIGKILL);proc.wait(timeout=1)
                raise TimeoutError('bounded_generation_expired_no_retry')
        report['child_exit'] = code;child = json.loads((root/'generation.json').read_text())
        assert code == 0 and child['status'] == 'COMPLETE_GENERATION_ONLY_PENDING_CPU_REPLAY'
        report.update(child)
    except BaseException as error:
        report.update(status='FAILED_PARTIAL_NO_RETRY',error_type=type(error).__name__,traceback=traceback.format_exc())
        raise
    finally:
        if proc is not None and proc.poll() is None:os.killpg(proc.pid,signal.SIGKILL);proc.wait(timeout=1)
        child_path = root/'generation.json'
        if child_path.exists():
            child = json.loads(child_path.read_text())
            for k in ('cases','model_loads_started','model_loads','model_calls_started','new_generation',
                    'stop_count','admission_rejections','new_training','api_calls','database_access','composition_calls'):
                if k in child:report[k] = child[k]
        report['seconds'] = time.monotonic()-started
        try:check_api(api,OLD_API,pack['source_hashes']);check_adapter();report.update(source_hashes_unchanged=True,adapter_unchanged=True)
        except BaseException as error:
            report.update(status='FAILED_PARTIAL_NO_RETRY',integrity_error_type=type(error).__name__)
            integrity_failure = error
        write(root/'report.json',report);write(root/'aggregate.json',public_summary(report,OLD_API))
        print(canonical(dict(status=report['status'],archive=archive(root))))
    if integrity_failure is not None:raise integrity_failure


def map_payload(artifact,owner):
    if artifact is None:return None
    text = artifact.safe_text_projection(authenticated_owner_scope=owner)
    projection = artifact.safe_projection(authenticated_owner_scope=owner)
    text.pop('projection_of');projection.pop('projection_of')
    return dict(graph=asdict(artifact.graph),text=text,projection=projection,
        source_members=[asdict(m) for m in artifact.source_members],
        category_records=[asdict(m) for m in artifact.category_records],
        source_set_ref=artifact.source_set_ref,period=list(artifact.period),owner_scope=artifact.owner_scope)


def public_summary(report,api_head):
    keys = ('status','seconds','model_loads_started','model_loads','model_calls_started','new_generation',
        'stop_count','admission_rejections','new_training','normal_adoption','api_calls','database_access',
        'composition_calls','source_hashes_unchanged','adapter_unchanged','guard_violations',
        'responses_read','all_prepared_inputs_identical','error_type','integrity_error_type')
    return dict(schema_version='analysis_plain_wish4_aggregate.v1',api_commit=api_head,
        original_generation_api=OLD_API,comparison_api=NEW_API,prompt_version=PROFILE,
        adapter_weights_sha256=WEIGHTS,adapter_config_sha256=CONFIG,
        max_seconds=MAX_SECONDS,per_case_seconds=PER_CASE_SECONDS,
        **{k:report[k] for k in keys if k in report},
        cases=[{k:c[k] for k in ('id','phase','status','finish_reason','seconds','raw_sha256',
            'raw_file_sha256','error_type','coverage','observed_map_present','guard_violation',
            'same_response_and_input','comparison') if k in c} for c in report.get('cases',[])],
        interpretation='Known independent synthetic4; exact original responses only. Rejection differs from valid-but-unsupported. No general quality rate, saved map, API/DB, hidden SELF promotion or normal adoption.')


def replay(api, source, root, expected_head, compare_root):
    assert expected_head in {OLD_API,NEW_API} and not root.exists() and not Path(str(root)+'.zip').exists()
    assert root != api and api not in root.parents and root != source and source not in root.parents
    pack = json.loads((source/'pack.json').read_text());pack_sha = sha(source/'pack.json')
    assert pack_sha == json.loads((source/'prepare.json').read_text())['pack_sha256']
    assert pack['api_commit'] == OLD_API and pack['comparison_api_commit'] == NEW_API
    before = check_api(api,expected_head)
    root.mkdir();shutil.copyfile(__file__,root/'replay_runner.py')
    shutil.copyfile(source/'pack.json',root/'original_pack.json')
    started = time.monotonic()
    report = dict(status='CPU_REPLAY_STARTED',api_commit=expected_head,pack_sha256=pack_sha,cases=[],
        source_hashes_before=before,model_loads=0,new_generation=0,new_training=0,
        response_rebound=False,raw_repaired=False,normal_adoption=False,api_calls=0,database_access=0,
        guard_violations=0,responses_read=0)
    def checkpoint():report['seconds'] = time.monotonic()-started;write(root/'report.json',report)
    checkpoint();failure = None
    try:
        service,semantic,_probe,owner,source_snapshot = imports(api)
        previous = None
        if compare_root is not None:
            assert expected_head == NEW_API
            previous = json.loads((compare_root/'report.json').read_text())
            assert previous['api_commit'] == OLD_API and previous['pack_sha256'] == pack_sha
        for row in pack['cases']:
            name = row['id'];case = dict(id=name,status='NOT_GENERATED')
            report['cases'].append(case)
            snapshot,prepared = bound_case(service,semantic,owner,source_snapshot,row)
            path = source/(name+'.response.json')
            if not path.exists():checkpoint();continue
            saved = json.loads(path.read_text());raw_path = source/(name+'.raw.txt')
            assert type(saved) is dict and set(saved) == {'request_ref','messages_sha256','raw_sha256','finish_reason','raw'}
            assert saved['request_ref'] == row['request_ref'] == prepared.request_ref
            assert saved['messages_sha256'] == row['messages_sha256'] == digest(prepared.messages())
            assert raw_path.read_text() == saved['raw'] and sha(raw_path) == saved['raw_sha256']
            # Preserve the five stored Response fields unchanged. No metadata
            # is filled from the new API and no old raw is repaired/relabelled.
            response = semantic.AnalysisModelQuotedParentUnitsResponse(**saved)
            assert asdict(response) == saved
            report['responses_read'] += 1
            value = replace(prepared,response=response)
            bindings = dict(request_ref=row['request_ref'],messages_sha256=row['messages_sha256'],
                source_guard=row['source_guard'],source_identity_sha256=row['source_identity_sha256'],
                request_sha256=row['request_sha256'],fixture_sha256=row['fixture_sha256'],
                raw_sha256=saved['raw_sha256'],response_sha256=digest(saved))
            case.update(raw_sha256=saved['raw_sha256'],finish_reason=saved['finish_reason'],same_response_and_input=True)
            shutil.copyfile(path,root/path.name);shutil.copyfile(raw_path,root/raw_path.name)
            private = dict(id=name,bindings=bindings,response=saved)
            case['phase'] = 'READING_RESPONSE'
            try:
                semantic._admit_quoted_parent_units(prepared.request,value)
                case['phase'] = 'ADMITTED'
                artifact,coverage = service.build_cumulative_map(owner,snapshot,model_input=value)
            except (ValueError,KeyError,TypeError,AttributeError) as error:
                case.update(status='COMPOSITION_REJECTED' if case['phase'] == 'ADMITTED' else 'REJECTED',
                    error_type=type(error).__name__)
                private.update(error=str(error),traceback=traceback.format_exc())
            else:
                payload = map_payload(artifact,owner)
                violation = name in {'WH03','WH04'} and artifact is not None
                report['guard_violations'] += int(violation)
                case.update(phase='COMPOSED',status='OBSERVED_MAP' if artifact is not None else 'UNSUPPORTED',coverage=coverage,
                    observed_map_present=artifact is not None,guard_violation=violation)
                private.update(observed_map=payload,coverage=coverage)
            if previous is not None:
                old = json.loads((compare_root/(name+'.replay.json')).read_text())
                assert old['bindings'] == bindings, 'old_new_response_or_input_changed'
                case['comparison'] = dict(old_status=old['status'],new_status=case['status'],
                    same_response_and_input=True,
                    graph_text_projection_equal=(old['observed_map'] == private['observed_map'])
                        if old.get('observed_map') is not None and private.get('observed_map') is not None else None,
                    coverage_equal=(old['coverage'] == private['coverage'])
                        if 'coverage' in old and 'coverage' in private else None)
            private.update(status=case['status']);write(root/(name+'.replay.json'),private);checkpoint()
        assert report['guard_violations'] == 0, 'omitted_or_negative_wish_guard_changed'
        report['all_prepared_inputs_identical'] = True
        report['status'] = 'COMPLETE_CPU_REPLAY_NOT_ADOPTED'
    except BaseException as error:
        failure = error;report.update(status='FAILED_CPU_REPLAY',error_type=type(error).__name__,traceback=traceback.format_exc())
    finally:
        try:report['source_hashes_after'] = check_api(api,expected_head,before);report['source_hashes_unchanged'] = True
        except BaseException as error:
            report.update(status='FAILED_CPU_REPLAY',integrity_error_type=type(error).__name__)
            if failure is None:failure = error
        checkpoint();write(root/'aggregate.json',public_summary(report,expected_head))
        print(canonical(dict(status=report['status'],archive=archive(root))))
    if failure is not None:raise failure


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode',choices=('prepare','run','replay','_generate'))
    parser.add_argument('api',type=Path);parser.add_argument('root',type=Path)
    parser.add_argument('--output-root',type=Path);parser.add_argument('--expected-api-head',choices=(OLD_API,NEW_API))
    parser.add_argument('--compare-replay',type=Path);parser.add_argument('--deadline',type=float);parser.add_argument('--pack-sha')
    args = parser.parse_args();args.api = args.api.resolve();args.root = args.root.resolve()
    sys.dont_write_bytecode = True
    os.environ.update(HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1',HF_DATASETS_OFFLINE='1')
    if args.mode == 'prepare':prepare(args.api,args.root)
    elif args.mode == 'run':run(args.api,args.root)
    elif args.mode == 'replay':
        assert args.output_root and args.expected_api_head
        replay(args.api,args.root,args.output_root.resolve(),args.expected_api_head,
            args.compare_replay.resolve() if args.compare_replay else None)
    else:
        assert args.deadline and args.pack_sha
        generate(args.api,args.root,args.deadline,args.pack_sha)


if __name__ == '__main__':main()
