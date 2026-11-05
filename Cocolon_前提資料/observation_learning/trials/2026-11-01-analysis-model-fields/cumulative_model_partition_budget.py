"""Measure the private whole-record planner with the actual pinned tokenizer.

Usage: python cumulative_model_partition_budget.py API NEW_ROOT --expected-api-head SHA
CPU-only preparation; no model load, generation, training, HTTP, DB or adoption.
The synthetic model label matches the earlier token-budget probe. Body bytes
are exact for that label and the unchanged transport payload structure only.
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
import time
import zipfile

COUNTS = (1, 20, 50, 100, 201)
PROFILES = ('selected_material.v4', 'selected_material.v7')
RESERVED_NEW_TOKENS = 2048
CONTEXT_TOKENS = 8192
PROBE_HTTP_BODY_LIMIT = 65536
SYNTHETIC_MODEL_LABEL = 'analysis-cumulative-token-budget'
SOURCE_PATHS = (
    'ai/tests/test_analysis_cumulative.py',
    'ai/tests/test_analysis_saved_period.py',
    'ai/services/ai_inference/analysis_cumulative_service.py',
    'ai/services/ai_inference/analysis_model_source.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/source_adapter.py',
    'ai/tools/serve_emlis_natural_reply.py',
)


def canonical(value):
    def bytes_identity(item):
        if type(item) is bytes:
            return {'byte_length': len(item), 'sha256': sha_bytes(item)}
        raise TypeError('unsupported_identity_type')
    return json.dumps(value, ensure_ascii=False, sort_keys=True,
        separators=(',', ':'), allow_nan=False, default=bytes_identity)


def sha_bytes(value):
    return hashlib.sha256(value).hexdigest()


def identity(value):
    return sha_bytes(canonical(value).encode('utf-8'))


def sha(path):
    return sha_bytes(Path(path).read_bytes())


def git(api, *args):
    return subprocess.check_output(['git', '-C', str(api), *args], text=True).strip()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('api', type=Path)
    parser.add_argument('root', type=Path)
    parser.add_argument('--expected-api-head', required=True)
    parser.add_argument('--max-seconds', type=int, default=300)
    args = parser.parse_args()
    args.api, args.root = args.api.resolve(), args.root.resolve()
    archive = args.root.with_name(args.root.name + '.zip')
    assert 0 < args.max_seconds <= 300, 'cpu_run_limit_invalid'
    assert not args.root.exists(), 'do_not_restart_or_replace_partial_root'
    assert not archive.exists(), 'do_not_replace_archive'
    assert args.root != args.api and args.api not in args.root.parents, 'output_outside_api_required'
    sys.dont_write_bytecode = True
    os.environ.update(HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1', HF_DATASETS_OFFLINE='1')
    sys.path[:0] = [str(args.api/'ai/services/ai_inference'),
        str(args.api/'ai/services'), str(args.api/'ai/tests'), str(args.api/'ai/tools'),
        str(args.api)]
    assert git(args.api, 'rev-parse', 'HEAD') == args.expected_api_head, 'api_head_mismatch'
    assert not git(args.api, 'status', '--porcelain', '--untracked-files=no'), 'api_not_clean'
    source_hashes = {p: sha(args.api/p) for p in SOURCE_PATHS}
    args.root.mkdir()
    shutil.copyfile(__file__, args.root/'runner.py')
    started = time.monotonic()
    report = dict(schema_version='analysis_cumulative_partition_budget.v1',
        status='STARTED_CPU_ONLY', api_commit=args.expected_api_head,
        source_hashes_before=source_hashes, runner_sha256=sha(__file__),
        tokenizer_only=True, model_loads=0, new_generation=0, new_training=0,
        network_requests=0, api_writes=0, database_access=0, normal_adoption=False,
        context_tokens=CONTEXT_TOKENS, reserved_new_tokens=RESERVED_NEW_TOKENS,
        probe_http_body_limit_bytes=PROBE_HTTP_BODY_LIMIT, max_seconds=args.max_seconds,
        request_model_label=SYNTHETIC_MODEL_LABEL,
        request_body_scope='Exact unchanged transport JSON shape with the documented synthetic model label; no production model-label byte claim.',
        counts=list(COUNTS), profiles=list(PROFILES), rows=[],
        fixture_scope='Complete independent synthetic fixtures and their unchanged fixture guards; not a real database snapshot.',
        measurement_callback_calls=0, actual_tokenizer_measurements=0,
        measurement_cache_hits=0)

    def checkpoint():
        report['seconds'] = time.monotonic()-started
        temporary = args.root/'report.tmp'
        temporary.write_text(canonical(report)+'\n', encoding='utf-8')
        temporary.replace(args.root/'report.json')

    def check_deadline():
        if time.monotonic()-started >= args.max_seconds:
            raise TimeoutError('cpu_partition_measurement_deadline')

    def deadline_signal(_signum, _frame):
        raise TimeoutError('cpu_partition_measurement_deadline')

    checkpoint()
    failure = None
    alarm_handler = None
    try:
        # A single process-wide CPU deadline; it is never restarted per plan.
        assert hasattr(signal, 'setitimer'), 'posix_deadline_required'
        alarm_handler = signal.signal(signal.SIGALRM, deadline_signal)
        signal.setitimer(signal.ITIMER_REAL, args.max_seconds)
        probe_source = (args.api/'ai/tools/serve_emlis_natural_reply.py').read_text()
        assert 'if count + 2048 > 8192' in probe_source
        assert 'if not 0 < length <= 65536' in probe_source
        import httpx
        from transformers import AutoTokenizer
        from test_analysis_cumulative import source_snapshot, OWNER
        from test_analysis_saved_period import with_answer
        from analysis_cumulative_service import (AnalysisModelInputBudget,
            prepare_cumulative_category_units, prepare_cumulative_model_batches)
        from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import _model_fields_source
        from serve_emlis_natural_reply import MODEL, REVISION, PINS
        assert {n: version(n) for n in PINS} == PINS, 'runtime_pins_mismatch'
        report.update(model=MODEL, revision=REVISION, pins=PINS)
        checkpoint()
        tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION,
            local_files_only=True, trust_remote_code=False)
        check_deadline()
        report['status'] = 'MEASURING_CPU_ONLY'
        checkpoint()

        # No larger snapshot is sliced or assigned a fabricated subset guard.
        fixtures = [('baseline', count, source_snapshot(count)) for count in COUNTS]
        answer_snapshot = source_snapshot(50)
        target = answer_snapshot['members'][19]
        target['original'].update(memo='僕は本を見た。🧭 café\u0301 雨のち晴れ。',
            memo_action='僕は費用を記録しなかった。', category=['生活', '家'],
            emotion_details=[dict(type='平穏', strength='medium')])
        answer_snapshot['members'][19] = with_answer(target, '僕は日程を決めなかった。')
        fixtures.append(('saved_answer_unicode', 50, answer_snapshot))
        fixture_hashes = {f'{kind}:{count}': identity(snapshot) for kind,count,snapshot in fixtures}
        measurement_cache = {}
        active_case = None

        def measure_budget(prepared):
            check_deadline()
            report['measurement_callback_calls'] += 1
            messages = prepared.messages()
            messages_hash = identity(messages)
            key = (prepared.request_ref, messages_hash)
            if key in measurement_cache:
                report['measurement_cache_hits'] += 1
                result = measurement_cache[key]
                report['active_case']['last_measured_record_count'] = result['source_count']
                checkpoint()
                return AnalysisModelInputBudget(result['prompt_tokens'], result['request_body_bytes'])
            measured_at = time.monotonic()
            user = json.loads(messages[1]['content'])
            # Exact current generation tokenizer options, without input truncation.
            tokens = tokenizer.apply_chat_template(messages, enable_thinking=False,
                add_generation_prompt=True, tokenize=True, return_dict=False,
                truncation=False)
            payload = dict(model=SYNTHETIC_MODEL_LABEL, messages=messages,
                temperature=0, max_tokens=RESERVED_NEW_TOKENS, stream=False,
                chat_template_kwargs={'enable_thinking': False})
            # Request construction encodes JSON; no Client or socket is used.
            body = httpx.Request('POST', 'https://localhost/v1/chat/completions', json=payload).content
            result = dict(request_ref=prepared.request_ref,
                request_sha256=identity(asdict(prepared.request)), messages_sha256=messages_hash,
                source_count=len(prepared.request.members), fields_sent=len(user['fields']),
                prompt_tokens=len(tokens), total_reserved_tokens=len(tokens)+RESERVED_NEW_TOKENS,
                fits_context=len(tokens)+RESERVED_NEW_TOKENS<=CONTEXT_TOKENS,
                remaining_context_tokens=CONTEXT_TOKENS-len(tokens)-RESERVED_NEW_TOKENS,
                request_body_bytes=len(body), fits_probe_http_body=len(body)<=PROBE_HTTP_BODY_LIMIT,
                request_body_sha256=sha_bytes(body), truncated=False,
                measurement_seconds=time.monotonic()-measured_at)
            assert len(user['records']) == len(prepared.request.members), 'all_records_not_encoded'
            measurement_cache[key] = result
            report['actual_tokenizer_measurements'] += 1
            report['active_case']['last_measured_record_count'] = result['source_count']
            with (args.root/'measurements.jsonl').open('a', encoding='utf-8') as output:
                output.write(canonical(dict(case=active_case, **result))+'\n')
            checkpoint()
            check_deadline()
            return AnalysisModelInputBudget(result['prompt_tokens'], result['request_body_bytes'])

        for kind,count,snapshot in fixtures:
            fixture_key = f'{kind}:{count}'
            assert len(snapshot['members']) == count
            for profile in PROFILES:
                check_deadline()
                active_case = dict(fixture=kind, source_count=count, prompt_version=profile)
                report['active_case'] = dict(**active_case, status='PLANNING')
                checkpoint()
                case_started = time.monotonic()
                callbacks_before = report['measurement_callback_calls']
                actual_before = report['actual_tokenizer_measurements']
                legacy = prepare_cumulative_category_units(OWNER, snapshot, prompt_version=profile)
                legacy_messages = legacy.messages()
                plan = prepare_cumulative_model_batches(OWNER, snapshot,
                    prompt_version=profile, measure_budget=measure_budget)
                assert plan.parent == legacy and plan.parent.messages() == legacy_messages, 'parent_changed'
                assert plan.parent.response is None
                assert (plan.context_tokens, plan.reserved_new_tokens, plan.max_request_bytes) == (
                    CONTEXT_TOKENS, RESERVED_NEW_TOKENS, PROBE_HTTP_BODY_LIMIT)
                parent_frozen, parent_fields = _model_fields_source(plan.parent.request, allow_supplements=True)
                expected_refs = tuple(member.saved_record_ref for member in parent_frozen.members)
                assert len(expected_refs) == count == len(set(expected_refs))
                assert set(expected_refs) == {member['original']['id'] for member in snapshot['members']}
                assert tuple(ref for refs in plan.record_refs for ref in refs) == expected_refs, 'record_partition_mismatch'
                assert len(plan.batches) == len(plan.budgets) == len(plan.record_refs)
                by_record = {member.saved_record_ref: member for member in plan.parent.request.members}
                parent_sources = {source.envelope.envelope_id: source for source in parent_frozen.sources}
                parent_by_field = {field['field_ref']: field for field in parent_fields}
                source_refs, field_refs, batch_rows = [], [], []
                for index,(batch,budget,refs) in enumerate(zip(plan.batches, plan.budgets, plan.record_refs), 1):
                    assert refs and batch.response is None
                    assert batch.source_guard == plan.parent.source_guard and batch.prompt_version == profile
                    assert batch.request == replace(plan.parent.request, members=tuple(by_record[ref] for ref in refs)), 'record_or_metadata_changed'
                    assert batch.request.authenticated_owner_scope == OWNER
                    assert budget.prompt_tokens+RESERVED_NEW_TOKENS <= CONTEXT_TOKENS
                    assert budget.request_body_bytes <= PROBE_HTTP_BODY_LIMIT
                    frozen,fields = _model_fields_source(batch.request, allow_supplements=True)
                    assert tuple(member.saved_record_ref for member in frozen.members) == refs
                    assert all(parent_sources[source.envelope.envelope_id] == source for source in frozen.sources), 'source_identity_changed'
                    assert all(parent_by_field[field['field_ref']] == field for field in fields), 'field_identity_changed'
                    expected_fields = [field for field in parent_fields if field['source'].record_ref in refs]
                    assert fields == expected_fields, 'original_answer_fields_split_or_changed'
                    source_refs.extend(source.envelope.envelope_id for source in frozen.sources)
                    field_refs.extend(field['field_ref'] for field in fields)
                    measured = measurement_cache[(batch.request_ref, identity(batch.messages()))]
                    assert (budget.prompt_tokens,budget.request_body_bytes) == (measured['prompt_tokens'],measured['request_body_bytes'])
                    batch_rows.append(dict(index=index, record_refs=list(refs),
                        source_set_ref=frozen.source_set_ref, source_envelopes=len(frozen.sources),
                        source_identity_sha256=identity([asdict(source) for source in frozen.sources]),
                        field_refs_sha256=identity([field['field_ref'] for field in fields]),
                        original_fields=sum(field['source'].envelope.source_role=='ORIGINAL_INPUT' for field in fields),
                        supplemental_fields=sum(field['source'].envelope.source_role=='SUPPLEMENTAL_ANSWER' for field in fields),
                        **measured))
                assert source_refs == [source.envelope.envelope_id for source in parent_frozen.sources]
                assert field_refs == [field['field_ref'] for field in parent_fields]
                if len(plan.batches) == 1:
                    assert plan.batches[0] is plan.parent, 'unsplit_parent_not_identical'
                else:
                    assert len({batch.request_ref for batch in plan.batches}) == len(plan.batches)
                    assert all(batch.request_ref != plan.parent.request_ref for batch in plan.batches)
                assert identity(snapshot) == fixture_hashes[fixture_key], 'snapshot_mutated'
                assert prepare_cumulative_category_units(OWNER, snapshot, prompt_version=profile) == legacy, 'legacy_changed'
                supplemental_count = sum(len(member.supplements) for member in plan.parent.request.members)
                if kind == 'saved_answer_unicode':
                    assert supplemental_count == 1, 'saved_answer_not_qualified'
                    assert len(plan.batches) > 1, 'saved_answer_partition_not_exercised'
                parent_metric = measurement_cache[(plan.parent.request_ref, identity(legacy_messages))]
                report['rows'].append(dict(**active_case, fixture_sha256=fixture_hashes[fixture_key],
                    batch_count=len(batch_rows), callback_calls=report['measurement_callback_calls']-callbacks_before,
                    actual_tokenizer_measurements=report['actual_tokenizer_measurements']-actual_before,
                    parent=parent_metric, batches=batch_rows, case_seconds=time.monotonic()-case_started,
                    all_canonical_record_ids_retained=True, all_original_and_answer_fields_retained=True,
                    original_and_answer_never_split=True, source_envelopes_and_evidence_exact=True,
                    field_refs_exact=True, owner_period_and_full_guard_retained=True,
                    parent_and_legacy_messages_unchanged=True, snapshot_unchanged=True,
                    qualified_supplement_count=supplemental_count, truncated=False))
                report['active_case']['status'] = 'COMPLETE'
                checkpoint()
        assert {f'{kind}:{count}': identity(snapshot) for kind,count,snapshot in fixtures} == fixture_hashes
        report.update(status='COMPLETE_CPU_ONLY_NO_MODEL', fixture_snapshots_unchanged=True,
            completed_plans=len(report['rows']),
            interpretation='Input/body-budget preparation and exact source identity only. No raw response composition, model quality, output-2048 fit, throughput, 60-second execution, saved-map or production-success claim.')
    except BaseException as error:
        failure = error
        report.update(status='FAILED_CPU_ONLY', error_type=type(error).__name__, completed_plans=len(report['rows']))
    finally:
        if alarm_handler is not None:
            signal.setitimer(signal.ITIMER_REAL, 0)
            signal.signal(signal.SIGALRM, alarm_handler)
        try:
            after_hashes = {p: sha(args.api/p) for p in SOURCE_PATHS}
            head_unchanged = git(args.api, 'rev-parse', 'HEAD') == args.expected_api_head
            clean = not git(args.api, 'status', '--porcelain', '--untracked-files=no')
            report.update(source_hashes_after=after_hashes,
                source_hashes_unchanged=after_hashes==source_hashes,
                api_head_unchanged=head_unchanged, api_tracked_files_clean=clean)
            if after_hashes != source_hashes or not head_unchanged or not clean:
                raise AssertionError('api_changed_during_cpu_probe')
        except BaseException as error:
            report.update(status='FAILED_CPU_ONLY', integrity_error_type=type(error).__name__)
            if failure is None:
                failure = error
        checkpoint()
        manifest = {str(path.relative_to(args.root)): dict(sha256=sha(path), bytes=path.stat().st_size)
            for path in sorted(args.root.rglob('*')) if path.is_file()}
        (args.root/'manifest.json').write_text(canonical(manifest)+'\n', encoding='utf-8')
        with zipfile.ZipFile(archive, 'x', compression=zipfile.ZIP_DEFLATED) as output:
            for path in sorted(args.root.rglob('*')):
                if path.is_file():
                    output.write(path, str(path.relative_to(args.root)))
        print(canonical(dict(status=report['status'], report=str(args.root/'report.json'),
            archive=str(archive), archive_sha256=sha(archive), completed_plans=len(report['rows']),
            actual_tokenizer_measurements=report['actual_tokenizer_measurements'], seconds=report['seconds'])))
    if failure is not None:
        raise failure


if __name__ == '__main__':
    main()
