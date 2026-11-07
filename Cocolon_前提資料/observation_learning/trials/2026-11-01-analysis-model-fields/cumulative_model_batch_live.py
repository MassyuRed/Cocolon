"""Bounded private whole-record model probe; no API/DB/save/default adoption.

prepare API NEW_ROOT creates CPU-only inputs with the actual pinned tokenizer.
smoke API PREPARED_ROOT runs synthetic packets through the full input roundtrip.
run API PREPARED_ROOT loads the original a2e once and generates each child once.
Smoke and live executions require separate freshly prepared roots. A partial
or completed execution is never restarted. Full messages/raw remain in the
private archive; only runner/fixture/aggregate are publication candidates.
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

API_COMMIT = 'fc7563b98d5dfa5b8df7815e9a8b89f334b6719b'
ADAPTER = Path('/workspace/analysis-material-v4-pair8-20261103/train/adapter')
WEIGHTS = 'a2e62bca49ccccc5eb1d91254cd7f536d2cae0329ef7f80e5ee37208d335eb59'
CONFIG = '006ebf7bef859264b3778126f4a0f6512e1b2a7e6049b09dfcf0d56603ede3a9'
LOADER = 'ai/tools/serve_emlis_natural_reply.py'
LOADER_SHA = 'd3b7a04e38769485da995c8323aaaaf4426ff5273fcba6dff578ada85bdb77b6'
PROFILE = 'selected_material.v7'
RECORDS = 20
PLANNER_CONTEXT = 6400
MODEL_CONTEXT = 8192
RESERVED_NEW_TOKENS = 2048
BODY_LIMIT = 65536
MAX_SECONDS = 240
PER_CHILD_SECONDS = 25
SOURCE_PATHS = (
    'ai/tests/test_analysis_cumulative.py',
    'ai/services/ai_inference/analysis_cumulative_service.py',
    'ai/services/ai_inference/analysis_model_source.py',
    'ai/services/ai_inference/astor_material_snapshots.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/source_adapter.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py',
    LOADER,
)


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True,
        separators=(',', ':'), allow_nan=False)


def digest(value):
    return hashlib.sha256(canonical(value).encode('utf-8')).hexdigest()


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def write(path, value):
    temporary = path.with_name(path.name+'.tmp')
    temporary.write_text(canonical(value)+'\n', encoding='utf-8')
    temporary.replace(path)


def git(api, *args):
    return subprocess.check_output(['git', '-C', str(api), *args], text=True).strip()


def check_identity(api, source_hashes=None):
    assert git(api, 'rev-parse', 'HEAD') == API_COMMIT, 'api_head_mismatch'
    assert not git(api, 'status', '--porcelain', '--untracked-files=no'), 'api_not_clean'
    assert sha(api/LOADER) == LOADER_SHA, 'loader_changed'
    assert sha(ADAPTER/'adapter_model.safetensors') == WEIGHTS, 'original_adapter_changed'
    assert sha(ADAPTER/'adapter_config.json') == CONFIG, 'original_config_changed'
    actual = {path:sha(api/path) for path in SOURCE_PATHS}
    if source_hashes is not None:
        assert actual == source_hashes, 'source_hashes_changed'
    return actual


def imports(api):
    sys.path[:0] = [str(api/'ai/services/ai_inference'), str(api/'ai/services'),
        str(api/'ai/tests'), str(api/'ai/tools'), str(api)]
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as semantic
    import serve_emlis_natural_reply as probe
    from test_analysis_cumulative import OWNER, source_snapshot
    assert {name:version(name) for name in probe.PINS} == probe.PINS, 'dependency_pins_changed'
    assert probe.MODEL == 'Qwen/Qwen3.5-4B'
    assert probe.REVISION == '851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a'
    return service, semantic, probe, OWNER, source_snapshot


def prepared_descriptor(prepared, refs, budget, token_hash):
    messages = prepared.messages()
    return dict(record_refs=list(refs), request_ref=prepared.request_ref,
        source_guard=prepared.source_guard, prompt_version=prepared.prompt_version,
        messages=messages, messages_sha256=digest(messages), budget=asdict(budget),
        prompt_token_ids_sha256=token_hash)


def prepare(api, root):
    assert not root.exists(), 'do_not_restart_or_replace_partial_root'
    assert not Path(str(root)+'.zip').exists(), 'do_not_replace_archive'
    assert root != api and api not in root.parents, 'output_outside_api_required'
    source_hashes = check_identity(api)
    root.mkdir()
    shutil.copyfile(__file__, root/'runner.py')
    started = time.monotonic()
    report = dict(status='PREPARING_CPU_ONLY', api_commit=API_COMMIT,
        runner_sha256=sha(__file__), source_hashes=source_hashes,
        model_loads=0, new_generation=0, new_training=0, normal_adoption=False)
    write(root/'report.json', report)
    old_alarm = signal.signal(signal.SIGALRM,
        lambda *_:(_ for _ in ()).throw(TimeoutError('cpu_preparation_deadline')))
    signal.setitimer(signal.ITIMER_REAL, MAX_SECONDS)
    failure = None
    try:
        service, semantic, probe, owner, source_snapshot = imports(api)
        import httpx
        from transformers import AutoTokenizer
        tokenizer = AutoTokenizer.from_pretrained(probe.MODEL, revision=probe.REVISION,
            local_files_only=True, trust_remote_code=False)
        snapshot = source_snapshot(RECORDS)
        fixture_hash = digest(snapshot)
        write(root/'synthetic_source.json', snapshot)
        measurements = {}

        def measure(prepared):
            messages = prepared.messages()
            key = (prepared.request_ref, digest(messages))
            if key not in measurements:
                tokens = tokenizer.apply_chat_template(messages, enable_thinking=False,
                    add_generation_prompt=True, tokenize=True, return_dict=False, truncation=False)
                payload = dict(model=probe.MODEL, messages=messages, temperature=0,
                    max_tokens=RESERVED_NEW_TOKENS, stream=False,
                    chat_template_kwargs={'enable_thinking':False})
                body = httpx.Request('POST', 'https://localhost/v1/chat/completions', json=payload).content
                measurements[key] = dict(prompt_tokens=len(tokens), request_body_bytes=len(body),
                    prompt_token_ids_sha256=digest(tokens), request_body_sha256=hashlib.sha256(body).hexdigest())
            row = measurements[key]
            return service.AnalysisModelInputBudget(row['prompt_tokens'], row['request_body_bytes'])

        plan = service.prepare_cumulative_model_batches(owner, snapshot, prompt_version=PROFILE,
            measure_budget=measure, context_tokens=PLANNER_CONTEXT,
            reserved_new_tokens=RESERVED_NEW_TOKENS, max_request_bytes=BODY_LIMIT)
        assert 2 <= len(plan.batches) <= RECORDS, 'at_least_two_whole_record_children_required'
        frozen, fields = semantic._model_fields_source(plan.parent.request, allow_supplements=True)
        expected_refs = tuple(m.saved_record_ref for m in frozen.members)
        assert len(expected_refs) == len(set(expected_refs)) == RECORDS
        assert tuple(ref for refs in plan.record_refs for ref in refs) == expected_refs
        assert digest(snapshot) == fixture_hash == digest(source_snapshot(RECORDS)), 'fixture_changed'
        children = []
        for child, budget, refs in zip(plan.batches, plan.budgets, plan.record_refs):
            assert budget.prompt_tokens+RESERVED_NEW_TOKENS <= PLANNER_CONTEXT <= MODEL_CONTEXT
            assert budget.request_body_bytes <= BODY_LIMIT
            assert child.source_guard == plan.parent.source_guard and child.prompt_version == PROFILE
            assert child.response is None and refs
            measurement = measurements[(child.request_ref, digest(child.messages()))]
            children.append(prepared_descriptor(child, refs, budget, measurement['prompt_token_ids_sha256'])
                | dict(request_body_sha256=measurement['request_body_sha256']))
        pack = dict(schema_version='analysis_cumulative_model_batch_live_inputs.v1',
            api_commit=API_COMMIT, source_hashes=source_hashes, runner_sha256=sha(__file__),
            adapter_weights_sha256=WEIGHTS, adapter_config_sha256=CONFIG,
            model=probe.MODEL, revision=probe.REVISION, pins=probe.PINS,
            owner=owner, fixture_sha256=fixture_hash, record_refs=list(expected_refs),
            fixture='test_analysis_cumulative.source_snapshot(20)',
            fixture_scope='Complete independent synthetic fixture; unchanged fixture clock/guard, not a database snapshot.',
            parent_request_ref=plan.parent.request_ref, parent_messages_sha256=digest(plan.parent.messages()),
            parent_messages=plan.parent.messages(), source_set_ref=frozen.source_set_ref,
            field_refs=[f['field_ref'] for f in fields], children=children,
            prompt_version=PROFILE, planner_context_tokens=PLANNER_CONTEXT,
            model_context_tokens=MODEL_CONTEXT, reserved_new_tokens=RESERVED_NEW_TOKENS,
            max_request_bytes=BODY_LIMIT, max_processing_seconds=MAX_SECONDS,
            per_child_seconds=PER_CHILD_SECONDS, max_model_loads=1,
            max_new_generation=len(children), new_training=0, normal_adoption=False,
            database_or_api_calls=0,
            interpretation='Unchanged complete source_snapshot(20); research-only tighter input planning. No output-fit, semantic-quality or normal 60-second acquisition claim.')
        write(root/'pack.json', pack)
        check_identity(api, source_hashes)
        report.update(status='PREPARED_NO_MODEL', pack_sha256=sha(root/'pack.json'),
            fixture_sha256=fixture_hash, children=len(children), source_count=RECORDS,
            actual_tokenizer_measurements=len(measurements), seconds=time.monotonic()-started)
    except BaseException as error:
        failure = error
        report.update(status='FAILED_CPU_PREPARATION_NO_RETRY', error_type=type(error).__name__,
            traceback=traceback.format_exc(), seconds=time.monotonic()-started)
    finally:
        signal.setitimer(signal.ITIMER_REAL, 0)
        signal.signal(signal.SIGALRM, old_alarm)
        try:
            report['source_hashes_after'] = check_identity(api, source_hashes)
            report.update(source_hashes_unchanged=True, adapter_unchanged=True)
        except BaseException as error:
            report.update(status='FAILED_CPU_PREPARATION_NO_RETRY', integrity_error_type=type(error).__name__)
            if failure is None:
                failure = error
        write(root/'report.json', report)
        if failure is not None:
            archive(root)
    print(canonical({k:report[k] for k in ('status','model_loads','new_generation','new_training','seconds')}))
    if failure is not None:
        raise failure


def reconstruct(api, root, pack):
    service, semantic, probe, owner, source_snapshot = imports(api)
    snapshot = json.loads((root/'synthetic_source.json').read_text())
    assert snapshot == source_snapshot(RECORDS) and digest(snapshot) == pack['fixture_sha256']
    assert pack['api_commit'] == API_COMMIT and pack['prompt_version'] == PROFILE and pack['owner'] == owner
    assert pack['source_hashes'] == check_identity(api, pack['source_hashes'])
    assert (pack['planner_context_tokens'], pack['model_context_tokens'], pack['reserved_new_tokens'],
        pack['max_request_bytes']) == (PLANNER_CONTEXT, MODEL_CONTEXT, RESERVED_NEW_TOKENS, BODY_LIMIT)
    parent = service.prepare_cumulative_category_units(owner, snapshot, prompt_version=PROFILE)
    assert parent.request_ref == pack['parent_request_ref']
    assert parent.messages() == pack['parent_messages'] and digest(parent.messages()) == pack['parent_messages_sha256']
    frozen, fields = semantic._model_fields_source(parent.request, allow_supplements=True)
    semantic.require_analysis_model_observed_scope(parent.request, frozen=frozen)
    refs = tuple(m.saved_record_ref for m in frozen.members)
    assert len(refs) == RECORDS and list(refs) == pack['record_refs']
    assert frozen.source_set_ref == pack['source_set_ref']
    assert [f['field_ref'] for f in fields] == pack['field_refs']
    assert 2 <= len(pack['children']) <= RECORDS
    members = {m.saved_record_ref:m for m in parent.request.members}
    children, flattened = [], []
    for row in pack['children']:
        child = semantic.prepare_analysis_model_quoted_parent_units(replace(parent.request,
            members=tuple(members[ref] for ref in row['record_refs'])),
            source_guard=parent.source_guard, prompt_version=PROFILE)
        assert (child.request_ref, child.source_guard, child.prompt_version) == (
            row['request_ref'], row['source_guard'], row['prompt_version'])
        assert child.messages() == row['messages'] and digest(child.messages()) == row['messages_sha256']
        assert type(row['budget']['prompt_tokens']) is int and row['budget']['prompt_tokens'] > 0
        assert row['budget']['prompt_tokens']+RESERVED_NEW_TOKENS <= PLANNER_CONTEXT
        assert type(row['budget']['request_body_bytes']) is int and 0 < row['budget']['request_body_bytes'] <= BODY_LIMIT
        children.append(child)
        flattened.extend(row['record_refs'])
    assert tuple(flattened) == refs and len(set(flattened)) == RECORDS
    return service, semantic, probe, owner, snapshot, parent, tuple(children)


def synthetic_packet(prepared):
    """Fresh smoke-only fixture; never an edited or reused model response."""
    return dict(fields=[dict(field=f['field'], units=[dict(quote=text,
        node_kind='ATTENTION_OR_THOUGHT' if text.endswith('たい') else 'ACTION_OR_NONACTION',
        parent_quote=None, scope_role=None, qualifiers=[])
        for text in f['text'].rstrip('。').split('。')])
        for f in json.loads(prepared.messages()[1]['content'])['fields']])


def map_payload(artifact, owner):
    if artifact is None:
        return None
    text = artifact.safe_text_projection(authenticated_owner_scope=owner)
    projection = artifact.safe_projection(authenticated_owner_scope=owner)
    # The ordinary constructor intentionally gives each explicit composition
    # a fresh UUID. Every other source/graph/text/projection value must match.
    text.pop('projection_of')
    projection.pop('projection_of')
    return dict(owner_scope=artifact.owner_scope, source_set_ref=artifact.source_set_ref,
        period=list(artifact.period), source_members=[asdict(m) for m in artifact.source_members],
        category_records=[asdict(m) for m in artifact.category_records], graph=asdict(artifact.graph),
        text=text, projection=projection)


def execute(api, root, mode, deadline, pack_sha):
    assert mode in {'smoke','gpu'} and sha(root/'pack.json') == pack_sha
    assert sha(__file__) == sha(root/'runner.py')
    marker = json.loads((root/'run_started.json').read_text())
    assert marker['pack_sha256'] == pack_sha and marker['mode'] == mode
    assert json.loads((root/'report.json').read_text())['status'] == 'RUNNING'
    assert not (root/'execution.json').exists(), 'never_restart_partial_or_completed_execution'
    assert time.monotonic() < deadline, 'execution_deadline_already_expired'
    pack = json.loads((root/'pack.json').read_text())
    assert pack['runner_sha256'] == sha(__file__)
    service, semantic, probe, owner, snapshot, parent, children = reconstruct(api, root, pack)
    stop = threading.Event()
    started = time.monotonic()
    report = dict(status='STARTED', mode=mode, cases=[], new_training=0,
        model_loads_started=0, model_loads=0, model_calls_started=0, new_generation=0,
        synthetic_responses=0, stop_count=0, admission_rejections=0,
        source_count=RECORDS, children=len(children),
        normal_adoption=False, api_calls=0, database_access=0, saved_maps=0,
        composition_calls=0, observed_map_present=False,
        adapter_weights_sha256=WEIGHTS, adapter_config_sha256=CONFIG)

    def checkpoint():
        report['seconds'] = time.monotonic()-started
        write(root/'execution.json', report)

    def terminated(signum, _frame):
        stop.set()
        report.update(status='TERMINATED_PARTIAL_NO_RETRY', signal=signum)
        checkpoint()
        raise SystemExit(128+signum)

    signal.signal(signal.SIGTERM, terminated)
    signal.signal(signal.SIGINT, terminated)
    checkpoint()
    try:
        generator = None
        if mode == 'gpu':
            report.update(status='MODEL_LOADING', model_loads_started=1)
            checkpoint()
            generator = probe.load_generator(str(ADAPTER), stop, weights_sha256=WEIGHTS, config_sha256=CONFIG)
            report.update(model_loads=1, status='GENERATING')
            checkpoint()
        bound = []
        for index, child in enumerate(children, 1):
            assert time.monotonic() < deadline-10, 'run_deadline_before_next_child'
            entry = dict(index=index, request_ref=child.request_ref,
                messages_sha256=digest(child.messages()), record_count=len(child.request.members),
                model_request_started=mode == 'gpu', phase='STARTED')
            report['cases'].append(entry)
            if mode == 'gpu':
                assert report['model_calls_started'] < len(children)
                report['model_calls_started'] += 1
            checkpoint()
            call_started = time.monotonic()
            if mode == 'gpu':
                call_deadline = min(deadline-10, call_started+PER_CHILD_SECONDS)
                # The loader's token stopping criterion checks its deadline.
                # This hard process timer also covers a blocked GPU forward;
                # the STARTED checkpoint survives an interrupted generation.
                signal.signal(signal.SIGALRM, signal.SIG_DFL)
                signal.setitimer(signal.ITIMER_REAL, max(0.001, call_deadline-time.monotonic()))
                try:
                    raw, finish = generator(child.messages(), call_deadline)
                    returned_at = time.monotonic()
                finally:
                    signal.setitimer(signal.ITIMER_REAL, 0)
                report['new_generation'] += 1
            else:
                raw, finish = canonical(synthetic_packet(child)), 'stop'
                returned_at = time.monotonic()
                report['synthetic_responses'] += 1
            entry.update(phase='RAW_RECEIVED', raw=raw,
                raw_sha256=hashlib.sha256(raw.encode('utf-8')).hexdigest(),
                finish_reason=finish, seconds=returned_at-call_started)
            raw_path = root/f'child-{index:03}.raw.txt'
            raw_path.write_text(raw, encoding='utf-8')
            entry.update(raw_file=raw_path.name, raw_file_sha256=sha(raw_path))
            assert entry['raw_file_sha256'] == entry['raw_sha256'], 'raw_file_changed'
            report['stop_count'] += int(finish == 'stop' and mode == 'gpu')
            checkpoint()  # Preserve the exact first response before admission.
            assert finish == 'stop', 'nonstop_output_preserved_no_retry'
            assert mode != 'gpu' or returned_at <= call_deadline, 'late_output_preserved_no_retry'
            response = semantic.AnalysisModelQuotedParentUnitsResponse(child.request_ref,
                digest(child.messages()), entry['raw_sha256'], finish, raw)
            write(root/f'child-{index:03}.response.json', asdict(response))
            value = replace(child, response=response)
            try:
                semantic._admit_quoted_parent_units(child.request, value)
            except (ValueError, KeyError, TypeError, AttributeError) as error:
                # A complete stop response is retained without repair. Other
                # independent planned children may still be observed once.
                report['admission_rejections'] += 1
                entry.update(phase='ADMISSION_REJECTED', admission_error_type=type(error).__name__,
                    admission_error=str(error), admission_traceback=traceback.format_exc())
            else:
                bound.append(value)
                entry['phase'] = 'ADMITTED'
            checkpoint()
        report['all_planned_children_observed'] = True
        report['all_planned_children_generated'] = mode == 'gpu'
        report['all_records_sent'] = RECORDS if mode == 'gpu' else 0
        report['synthetic_records_exercised'] = RECORDS if mode == 'smoke' else 0
        checkpoint()
        assert len(bound) == len(children) and report['admission_rejections'] == 0, 'no_partial_input_or_map'
        if mode == 'gpu':
            assert report['new_generation'] == report['model_calls_started'] == report['stop_count'] == len(children)
            assert report['model_loads'] == report['model_loads_started'] == 1
        value = semantic.AnalysisModelObservedBatchInput(parent, tuple(bound))
        before = (report['new_generation'], report['model_calls_started'], report['model_loads'])
        raw_input = service.serialize_cumulative_model_batch_input(owner, snapshot, model_input=value)
        (root/'batch_input.json').write_text(raw_input, encoding='utf-8')
        restored = service.reload_cumulative_model_batch_input(owner, snapshot, raw_input, prompt_version=PROFILE)
        assert restored == value and tuple(c.response.raw for c in restored.batches) == tuple(c.response.raw for c in bound)
        assert before == (report['new_generation'], report['model_calls_started'], report['model_loads'])
        report.update(input_replay_match=True, new_model_calls_on_replay=0)
        checkpoint()
        report['composition_calls'] += 1
        first, coverage = service.build_cumulative_model_batch_map(owner, snapshot, model_input=value)
        report['composition_calls'] += 1
        second, second_coverage = service.build_cumulative_model_batch_map(owner, snapshot, model_input=restored)
        payload, replay_payload = map_payload(first, owner), map_payload(second, owner)
        assert payload == replay_payload and coverage == second_coverage, 'input_replay_composition_changed'
        assert coverage['source_count'] == coverage['processed_count'] == RECORDS
        assert coverage['excluded_count'] == 0 and coverage['stale_supplement_count'] == 0
        assert before == (report['new_generation'], report['model_calls_started'], report['model_loads'])
        report.update(coverage=coverage, observed_map_present=payload is not None,
            replay_match=True, coverage_replay_match=True,
            graph_text_projection_coverage_match=payload is not None)
        checkpoint()
        if mode == 'smoke':
            # Independent synthetic whole-input oracle, no raw concatenation.
            raw = canonical(synthetic_packet(parent))
            oracle = replace(parent, response=semantic.AnalysisModelQuotedParentUnitsResponse(parent.request_ref,
                digest(parent.messages()), hashlib.sha256(raw.encode()).hexdigest(), 'stop', raw))
            expected, expected_coverage = service.build_cumulative_map(owner, snapshot, model_input=oracle)
            assert map_payload(expected, owner) == payload and expected_coverage == coverage
            report.update(synthetic_whole_input_oracle_match=True,
                smoke_observed_map_author_verified=payload is not None,
                smoke_scope='input replay, explicit composition and full observed map author' if payload is not None
                    else 'input replay and matching no-map outcome; observed map author not verified')
            checkpoint()
        check_identity(api, pack['source_hashes'])
        assert digest(snapshot) == pack['fixture_sha256']
        # This file is written only after every child succeeded and both full
        # compositions matched. A failed run never emits a partial map result.
        write(root/'composition.json', dict(coverage=coverage, observed_map=payload,
            input_sha256=hashlib.sha256(raw_input.encode()).hexdigest(),
            replay_match=True, all_complete_before_composition=True, new_model_calls_on_replay=0))
        report.update(status='COMPLETE_OFFLINE_RESEARCH_ONLY' if payload is not None
                else 'COMPLETE_INPUT_REPLAY_NO_OBSERVED_MAP', coverage=coverage,
            observed_map_present=payload is not None, replay_match=True,
            graph_text_projection_coverage_match=payload is not None, new_model_calls_on_replay=0,
            source_hashes_unchanged=True, adapter_unchanged=True, fixture_unchanged=True)
    except BaseException as error:
        if report['status'] != 'TERMINATED_PARTIAL_NO_RETRY':
            report.update(status='FAILED_PARTIAL_NO_RETRY', error_type=type(error).__name__,
                traceback=traceback.format_exc())
        raise
    finally:
        stop.set()
        checkpoint()


def aggregate(report, pack):
    """Closed public-safe summary: no model raw/messages/map text or weights."""
    result = {key:report[key] for key in ('status','mode','seconds','child_exit','new_training',
        'model_loads_started','model_loads','model_calls_started','new_generation','synthetic_responses',
        'stop_count','admission_rejections','all_planned_children_observed',
        'all_planned_children_generated','all_records_sent','synthetic_records_exercised',
        'source_count','children','normal_adoption','api_calls','database_access','saved_maps',
        'composition_calls','coverage','observed_map_present','input_replay_match','replay_match',
        'new_model_calls_on_replay','coverage_replay_match','graph_text_projection_coverage_match',
        'smoke_observed_map_author_verified','smoke_scope','synthetic_whole_input_oracle_match',
        'source_hashes_unchanged','adapter_unchanged','fixture_unchanged','error_type',
        'integrity_error_type') if key in report}
    result.update(schema_version='analysis_cumulative_model_batch_live_aggregate.v1', api_commit=API_COMMIT,
        prompt_version=PROFILE, planner_context_tokens=PLANNER_CONTEXT, model_context_tokens=MODEL_CONTEXT,
        reserved_new_tokens=RESERVED_NEW_TOKENS, max_request_bytes=BODY_LIMIT,
        max_processing_seconds=MAX_SECONDS, per_child_seconds=PER_CHILD_SECONDS,
        fixture_sha256=pack['fixture_sha256'], adapter_weights_sha256=WEIGHTS,
        fixture=pack['fixture'], fixture_scope=pack['fixture_scope'],
        adapter_config_sha256=CONFIG, runner_sha256=pack['runner_sha256'],
        batch_record_counts=[len(row['record_refs']) for row in pack['children']],
        prompt_tokens=[row['budget']['prompt_tokens'] for row in pack['children']],
        request_body_bytes=[row['budget']['request_body_bytes'] for row in pack['children']],
        child_results=[{key:entry[key] for key in ('index','record_count','phase','model_request_started',
            'finish_reason','seconds','raw_file_sha256','admission_error_type') if key in entry}
            for entry in report.get('cases',[])],
        interpretation='Known unchanged synthetic20, private model-only offline composition. No normal ensure, saved-map reader, production/quality rate, 60-second batching or general output-fit claim.')
    return result


def archive(root):
    target = Path(str(root)+'.zip')
    assert not target.exists(), 'do_not_replace_archive'
    files = sorted(p for p in root.rglob('*') if p.is_file() and p.name != 'manifest.json')
    manifest = {str(p.relative_to(root)):dict(bytes=p.stat().st_size, sha256=sha(p)) for p in files}
    write(root/'manifest.json', manifest)
    with zipfile.ZipFile(target, 'x', compression=zipfile.ZIP_DEFLATED) as output:
        for path in files+[root/'manifest.json']:
            output.write(path, str(path.relative_to(root)))
    with zipfile.ZipFile(target) as output:
        assert output.testzip() is None
    return dict(path=str(target), bytes=target.stat().st_size, sha256=sha(target), members=len(files)+1)


def run(api, root, mode):
    assert mode in {'smoke','gpu'} and root.is_dir()
    assert not Path(str(root)+'.zip').exists(), 'do_not_replace_archive'
    prepared = json.loads((root/'report.json').read_text())
    assert prepared['status'] == 'PREPARED_NO_MODEL', 'never_restart_partial_or_completed_root'
    assert sha(__file__) == sha(root/'runner.py')
    pack_sha = sha(root/'pack.json')
    assert pack_sha == prepared['pack_sha256']
    pack = json.loads((root/'pack.json').read_text())
    check_identity(api, pack['source_hashes'])
    with (root/'run_started.json').open('x') as output:
        json.dump(dict(mode=mode, pack_sha256=pack_sha, max_seconds=MAX_SECONDS,
            max_new_generation=len(pack['children']) if mode == 'gpu' else 0,
            max_model_loads=int(mode == 'gpu'), per_child_seconds=PER_CHILD_SECONDS), output)
    started = time.monotonic()
    deadline = started+MAX_SECONDS
    report = dict(status='RUNNING', mode=mode, source_count=RECORDS, children=len(pack['children']),
        new_training=0, normal_adoption=False, api_calls=0, database_access=0, saved_maps=0,
        composition_calls=0, observed_map_present=False)
    write(root/'report.json', report)
    proc = None
    integrity_failure = None
    try:
        with (root/'execution.log').open('x') as log:
            proc = subprocess.Popen([sys.executable, __file__, '_execute', str(api), str(root),
                '--execution-mode', mode, '--deadline', str(deadline), '--pack-sha', pack_sha],
                stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
            try:
                code = proc.wait(timeout=max(1, deadline-time.monotonic()-5))
            except subprocess.TimeoutExpired:
                os.killpg(proc.pid, signal.SIGTERM)
                try:
                    proc.wait(timeout=2)
                except subprocess.TimeoutExpired:
                    os.killpg(proc.pid, signal.SIGKILL)
                    proc.wait(timeout=1)
                raise TimeoutError('bounded_execution_expired_no_retry')
        report['child_exit'] = code
        child = json.loads((root/'execution.json').read_text())
        assert code == 0 and child['status'] in {
            'COMPLETE_OFFLINE_RESEARCH_ONLY', 'COMPLETE_INPUT_REPLAY_NO_OBSERVED_MAP'}
        report.update(child)
        check_identity(api, pack['source_hashes'])
    except BaseException as error:
        report.update(status='FAILED_PARTIAL_NO_RETRY', error_type=type(error).__name__,
            traceback=traceback.format_exc())
        raise
    finally:
        if proc is not None and proc.poll() is None:
            os.killpg(proc.pid, signal.SIGKILL)
            proc.wait(timeout=1)
        child_path = root/'execution.json'
        if child_path.exists():
            child = json.loads(child_path.read_text())
            # Preserve failure status from the supervising process while still
            # reporting attempted/received counts from the last checkpoint.
            for key in ('model_loads_started','model_loads','model_calls_started','new_generation',
                    'synthetic_responses','stop_count','admission_rejections','all_planned_children_observed',
                    'all_planned_children_generated','all_records_sent','synthetic_records_exercised',
                    'composition_calls','coverage','observed_map_present','input_replay_match','replay_match',
                    'new_model_calls_on_replay','coverage_replay_match','graph_text_projection_coverage_match',
                    'smoke_observed_map_author_verified','smoke_scope','synthetic_whole_input_oracle_match',
                    'source_hashes_unchanged','adapter_unchanged','fixture_unchanged','cases'):
                if key in child:
                    report[key] = child[key]
        report['seconds'] = time.monotonic()-started
        try:
            check_identity(api, pack['source_hashes'])
            report.update(source_hashes_unchanged=True, adapter_unchanged=True)
        except BaseException as error:
            report.update(status='FAILED_PARTIAL_NO_RETRY', integrity_error_type=type(error).__name__)
            integrity_failure = error
        write(root/'report.json', report)
        write(root/'aggregate.json', aggregate(report, pack))
        saved = archive(root)
        print(canonical(dict(status=report['status'], aggregate=str(root/'aggregate.json'), archive=saved)))
    if integrity_failure is not None:
        raise integrity_failure


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=('prepare','smoke','run','_execute'))
    parser.add_argument('api', type=Path)
    parser.add_argument('root', type=Path)
    parser.add_argument('--execution-mode', choices=('smoke','gpu'))
    parser.add_argument('--deadline', type=float)
    parser.add_argument('--pack-sha')
    args = parser.parse_args()
    args.api, args.root = args.api.resolve(), args.root.resolve()
    sys.dont_write_bytecode = True
    os.environ.update(HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1', HF_DATASETS_OFFLINE='1')
    if args.mode == 'prepare':
        prepare(args.api, args.root)
    elif args.mode in {'smoke','run'}:
        run(args.api, args.root, 'smoke' if args.mode == 'smoke' else 'gpu')
    else:
        assert args.execution_mode and args.deadline and args.pack_sha
        execute(args.api, args.root, args.execution_mode, args.deadline, args.pack_sha)


if __name__ == '__main__':
    main()
