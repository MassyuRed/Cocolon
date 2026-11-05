"""Read the four original wish Responses on one explicitly pinned API.

replay API ORIGINAL_WISH4_ROOT NEW_ROOT --expected-api-head SHA
    [--compare-root OLD_REPLAY_ROOT]

Each invocation is a fresh CPU-only process/root. The original snapshot,
request, messages, source identities and five Response fields stay unchanged.
No model/tokenizer, training, normal ensure, API/DB or saved-map reader is used.
Full input/Response/map evidence stays private; aggregate.json is body-free.
"""
from __future__ import annotations

import argparse
from dataclasses import asdict, replace
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import signal
import subprocess
import sys
import time
import traceback
from unittest.mock import patch
import zipfile

PROFILE = 'selected_material.v7'
CASE_IDS = ('WH01','WH02','WH03','WH04')
RESPONSE_KEYS = {'request_ref','messages_sha256','raw_sha256','finish_reason','raw'}
MAX_SECONDS = 140


def canonical(value):
    def encoded(item):
        if type(item) is bytes:
            return dict(bytes=len(item),sha256=hashlib.sha256(item).hexdigest())
        raise TypeError('unsupported_identity_type')
    return json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False,default=encoded)


def digest(value):return hashlib.sha256(canonical(value).encode('utf-8')).hexdigest()
def sha(path):return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def write(path,value):
    temporary = path.with_name(path.name+'.tmp')
    temporary.write_text(canonical(value)+'\n',encoding='utf-8');temporary.replace(path)


def load(path):
    def pairs(items):
        value = {}
        for key,item in items:
            if key in value:raise ValueError('duplicate_json_key')
            value[key] = item
        return value
    def nonfinite(_):raise ValueError('nonfinite_json')
    return json.loads(Path(path).read_text(encoding='utf-8'),object_pairs_hook=pairs,parse_constant=nonfinite)


def api_identity(api,expected,paths):
    git = lambda *args:subprocess.check_output(['git','-C',str(api),*args],text=True).strip()
    assert git('rev-parse','HEAD') == expected, 'runtime_api_head_mismatch'
    assert not git('status','--porcelain','--untracked-files=no'), 'runtime_api_not_clean'
    return {p:sha(api/p) for p in paths}


def archive(root):
    target = Path(str(root)+'.zip');assert not target.exists(), 'do_not_replace_archive'
    files = sorted(p for p in root.rglob('*') if p.is_file() and p.name != 'manifest.json')
    write(root/'manifest.json',{str(p.relative_to(root)):dict(bytes=p.stat().st_size,sha256=sha(p)) for p in files})
    with zipfile.ZipFile(target,'x',compression=zipfile.ZIP_DEFLATED) as output:
        for p in files+[root/'manifest.json']:output.write(p,str(p.relative_to(root)))
    with zipfile.ZipFile(target) as output:assert output.testzip() is None
    return dict(path=str(target),bytes=target.stat().st_size,sha256=sha(target))


def map_payload(artifact,owner):
    if artifact is None:return None
    text = artifact.safe_text_projection(authenticated_owner_scope=owner)
    projection = artifact.safe_projection(authenticated_owner_scope=owner)
    # Only the fresh artifact UUID is excluded. Graph/source/period/text and
    # every other projection value remain part of the exact comparison.
    text.pop('projection_of');projection.pop('projection_of')
    return dict(graph=asdict(artifact.graph),text=text,projection=projection,
        owner_scope=artifact.owner_scope,source_set_ref=artifact.source_set_ref,period=list(artifact.period),
        source_members=[asdict(m) for m in artifact.source_members],
        category_records=[asdict(m) for m in artifact.category_records])


def node_enums(artifact):
    if artifact is None:return []
    return [dict(node_kind=n.node_kind,actor=n.proposition.actor if n.proposition else None,
        polarity=n.polarity,modality=n.modality,temporal_scope=n.temporal_scope,
        record_count=len(n.record_refs),evidence_count=len(n.evidence_refs)) for n in artifact.graph.nodes]


def valid_wish(nodes,polarity,time_scope):
    return len(nodes) == 1 and all(nodes[0][k] == v for k,v in dict(
        node_kind='ATTENTION_OR_THOUGHT',actor='SELF',polarity=polarity,
        modality='wish',temporal_scope=time_scope,record_count=1).items())


def public_summary(report):
    keys = ('schema_version','status','runtime_api_commit','original_generation_api','original_pack_sha256',
        'comparison_api_commit','seconds','new_generation','model_loads','new_training','api_calls',
        'database_access','normal_adoption','responses_read','source_hashes_unchanged','original_inputs_unchanged',
        'comparison_inputs_unchanged','runner_sha256','guard_violations','error_type','integrity_error_type')
    safe = {k:report[k] for k in keys if k in report}
    safe['cases'] = [{k:c[k] for k in ('id','status','phase','raw_sha256','response_sha256',
        'messages_sha256','request_sha256','source_identity_sha256','same_original_response_and_input',
        'coverage','observed_map_present','node_enums','normalized_map_sha256','guard_violation',
        'error_type','comparison') if k in c} for c in report['cases']]
    safe['interpretation'] = ('Exact original synthetic wish4 Responses, CPU source-bound consumer comparison only. '
        'Admission rejection, composition rejection and unsupported are distinct. No raw repair, NEG insertion, '
        'request rebinding, executed-action promotion, saved DB success or general quality rate.')
    return safe


def replay(api,source,root,expected,compare_root):
    assert re.fullmatch(r'[0-9a-f]{40}',expected), 'full_runtime_commit_required'
    assert not root.exists() and not Path(str(root)+'.zip').exists(), 'fresh_output_root_required'
    assert root not in {api,source} and api not in root.parents and source not in root.parents
    if compare_root is not None:assert root != compare_root and compare_root not in root.parents
    pack = load(source/'pack.json');prepared_report = load(source/'prepare.json')
    pack_sha = sha(source/'pack.json');assert pack_sha == prepared_report['pack_sha256']
    assert pack['prompt_version'] == PROFILE and [r['id'] for r in pack['cases']] == list(CASE_IDS)
    assert type(pack['owner']) is str and type(pack['source_hashes']) is dict and pack['source_hashes']
    source_paths = ['pack.json','prepare.json']
    for name in CASE_IDS:source_paths.extend(name+suffix for suffix in ('.source.json','.response.json','.raw.txt'))
    before_inputs = {p:sha(source/p) for p in source_paths}
    before_api = api_identity(api,expected,pack['source_hashes'])
    previous = load(compare_root/'report.json') if compare_root is not None else None
    compare_paths = ['report.json']+[name+'.replay.json' for name in CASE_IDS] if previous is not None else []
    before_compare = {p:sha(compare_root/p) for p in compare_paths}
    if previous is not None:
        assert previous['schema_version'] == 'analysis_negative_wish_cpu_replay.v1'
        assert previous['status'] == 'COMPLETE_CPU_REPLAY_NOT_ADOPTED'
        assert previous['original_pack_sha256'] == pack_sha and previous['original_input_hashes'] == before_inputs
    root.mkdir();shutil.copyfile(__file__,root/'runner.py')
    runner_sha = sha(__file__)
    originals = root/'original_inputs';originals.mkdir()
    for name in source_paths:shutil.copyfile(source/name,originals/name)
    started = time.monotonic()
    report = dict(schema_version='analysis_negative_wish_cpu_replay.v1',status='CPU_REPLAY_STARTED',
        runtime_api_commit=expected,original_generation_api=pack['api_commit'],original_pack_sha256=pack_sha,
        source_hashes_before=before_api,original_input_hashes=before_inputs,cases=[],
        runner_sha256=runner_sha,
        new_generation=0,model_loads=0,new_training=0,api_calls=0,database_access=0,
        normal_adoption=False,responses_read=0,guard_violations=0,response_rebound=False,raw_repaired=False)
    if previous is not None:report['comparison_api_commit'] = previous['runtime_api_commit']
    def checkpoint():report['seconds'] = time.monotonic()-started;write(root/'report.json',report)
    def forbidden(*_,**__):raise AssertionError('offline replay reached acquisition_or_database')
    def expired(*_):raise TimeoutError('cpu_replay_deadline')
    failure = None;checkpoint()
    old_signal = signal.signal(signal.SIGALRM,expired);signal.setitimer(signal.ITIMER_REAL,MAX_SECONDS)
    try:
        assert 'analysis_cumulative_service' not in sys.modules, 'fresh_api_process_required'
        sys.path[:0] = [str(api/'ai/services/ai_inference'),str(api/'ai/services'),str(api/'ai/tests'),str(api)]
        import analysis_cumulative_service as service
        from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as semantic
        owner = pack['owner']
        for row in pack['cases']:
            name = row['id'];case = dict(id=name,phase='CHECKING_ORIGINAL_INPUT')
            report['cases'].append(case);checkpoint()
            snapshot = row['snapshot']
            assert load(source/(name+'.source.json')) == snapshot and digest(snapshot) == row['fixture_sha256']
            assert len(snapshot['members']) == 1 and row['prompt_version'] == PROFILE
            prepared = service.prepare_cumulative_category_units(owner,snapshot,prompt_version=PROFILE)
            frozen,fields = semantic._model_fields_source(prepared.request,allow_supplements=True)
            actual = dict(request=asdict(prepared.request),request_sha256=digest(asdict(prepared.request)),
                source_guard=prepared.source_guard,request_ref=prepared.request_ref,
                messages=prepared.messages(),messages_sha256=digest(prepared.messages()),
                source_set_ref=frozen.source_set_ref,source_identity_sha256=digest([asdict(s) for s in frozen.sources]),
                field_refs=[f['field_ref'] for f in fields],prompt_version=prepared.prompt_version)
            assert all(canonical(v) == canonical(row[k]) for k,v in actual.items()), 'original_preparation_changed'
            saved = load(source/(name+'.response.json'));raw_file = source/(name+'.raw.txt')
            assert type(saved) is dict and set(saved) == RESPONSE_KEYS
            assert raw_file.read_text(encoding='utf-8') == saved['raw'] and sha(raw_file) == saved['raw_sha256']
            assert saved['request_ref'] == row['request_ref'] and saved['messages_sha256'] == row['messages_sha256']
            response = semantic.AnalysisModelQuotedParentUnitsResponse(**saved)
            assert asdict(response) == saved, 'response_changed'
            value = replace(prepared,response=response)
            bindings = dict(request_sha256=actual['request_sha256'],request_ref=prepared.request_ref,
                source_guard=prepared.source_guard,messages_sha256=actual['messages_sha256'],
                source_identity_sha256=actual['source_identity_sha256'],field_refs=actual['field_refs'],
                fixture_sha256=row['fixture_sha256'],raw_sha256=saved['raw_sha256'],response_sha256=digest(saved))
            private = dict(id=name,bindings=bindings,prepared=actual,response=saved)
            report['responses_read'] += 1
            case.update(phase='READING_RESPONSE',same_original_response_and_input=True,
                **{k:bindings[k] for k in ('request_sha256','messages_sha256','source_identity_sha256','raw_sha256','response_sha256')})
            with patch.object(service,'_model_response',forbidden),patch.object(service,'_rpc',forbidden):
                try:
                    semantic._admit_quoted_parent_units(prepared.request,value)
                    case['phase'] = 'ADMITTED'
                    artifact,coverage = service.build_cumulative_map(owner,snapshot,model_input=value)
                except (ValueError,KeyError,TypeError,AttributeError) as error:
                    case.update(status='COMPOSITION_REJECTED' if case['phase'] == 'ADMITTED' else 'REJECTED',
                        error_type=type(error).__name__)
                    private.update(error=str(error),traceback=traceback.format_exc())
                else:
                    payload = map_payload(artifact,owner);nodes = node_enums(artifact)
                    violation = ((name in {'WH01','WH03'} and artifact is not None)
                        or (name == 'WH02' and not valid_wish(nodes,'positive','past'))
                        or (name == 'WH04' and artifact is not None and not valid_wish(nodes,'negative','current_input')))
                    report['guard_violations'] += int(violation)
                    case.update(phase='COMPOSED',status='OBSERVED_MAP' if artifact is not None else 'UNSUPPORTED',
                        coverage=coverage,observed_map_present=artifact is not None,node_enums=nodes,
                        normalized_map_sha256=digest(payload) if payload is not None else None,guard_violation=violation)
                    private.update(observed_map=payload,coverage=coverage)
            if previous is not None:
                old = load(compare_root/(name+'.replay.json'))
                assert old['bindings'] == bindings, 'old_new_response_or_input_changed'
                old_map,new_map = old.get('observed_map'),private.get('observed_map')
                equal = old_map == new_map if old_map is not None and new_map is not None else None
                case['comparison'] = dict(old_status=old['status'],new_status=case['status'],
                    same_response_and_input=True,normalized_graph_text_projection_equal=equal,
                    coverage_equal=old['coverage'] == private['coverage'] if 'coverage' in old and 'coverage' in private else None,
                    map_added=old_map is None and new_map is not None and old['status'] == 'UNSUPPORTED')
                if name == 'WH02' and (equal is not True or case['comparison']['coverage_equal'] is not True):
                    report['guard_violations'] += 1;case['guard_violation'] = True
            private.update(status=case['status'],phase=case['phase']);write(root/(name+'.replay.json'),private);checkpoint()
        assert report['responses_read'] == 4 and report['guard_violations'] == 0, 'consumer_scope_or_retention_changed'
        report['status'] = 'COMPLETE_CPU_REPLAY_NOT_ADOPTED'
    except BaseException as error:
        failure = error;report.update(status='FAILED_CPU_REPLAY',error_type=type(error).__name__,traceback=traceback.format_exc())
    finally:
        signal.setitimer(signal.ITIMER_REAL,0);signal.signal(signal.SIGALRM,old_signal)
        try:
            assert api_identity(api,expected,before_api) == before_api
            assert {p:sha(source/p) for p in source_paths} == before_inputs
            assert {p:sha(originals/p) for p in source_paths} == before_inputs
            assert {p:sha(compare_root/p) for p in compare_paths} == before_compare
            assert sha(__file__) == sha(root/'runner.py') == runner_sha
            report.update(source_hashes_unchanged=True,original_inputs_unchanged=True,comparison_inputs_unchanged=True)
        except BaseException as error:
            report.update(status='FAILED_CPU_REPLAY',integrity_error_type=type(error).__name__)
            if failure is None:failure = error
        checkpoint();write(root/'aggregate.json',public_summary(report))
        print(canonical(dict(status=report['status'],archive=archive(root))))
    if failure is not None:raise failure


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode',choices=('replay',));parser.add_argument('api',type=Path)
    parser.add_argument('source',type=Path);parser.add_argument('root',type=Path)
    parser.add_argument('--expected-api-head',required=True);parser.add_argument('--compare-root',type=Path)
    args = parser.parse_args();sys.dont_write_bytecode = True
    os.environ.update(HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1',HF_DATASETS_OFFLINE='1')
    replay(args.api.resolve(),args.source.resolve(),args.root.resolve(),args.expected_api_head,
        args.compare_root.resolve() if args.compare_root else None)


if __name__ == '__main__':main()
