"""One offline event-plan replay/save/reread from the immutable SQL checkpoint.

Restores the existing disposable SQL checkpoint; never changes that file.
The candidate preparation binds its own profile, plan and source hashes before
acquisition. The historical plan, receipt, input and checkpoint are read-only.
No model, remote API or hosted database is called. Rehearsal packets are newly
authored synthetic event plans, never historical model raw under new refs.
"""
from __future__ import annotations

import argparse
import asyncio
from copy import deepcopy
import hashlib
import json
import os
from pathlib import Path
import socket
import subprocess
import sys

if sys.flags.optimize:
    raise RuntimeError('unoptimized_python_required_for_bound_execution')
from unittest.mock import AsyncMock
from uuid import UUID

early = argparse.ArgumentParser(add_help=False)
early.add_argument('--repo', type=Path)
early_args, _ = early.parse_known_args()
ROOT = Path(__file__).resolve().parents[2]
CANDIDATE = Path(__file__).resolve().parent
PROFILE = 'semantic_map.event_plan.v2'
SCHEMA = 'cocolon.analysis.semantic_map.event_plan.model.v2'
REPO = Path(early_args.repo or os.environ.get('COCOLON_WORK_API_REPO', ROOT / 'mashos-api')).resolve()
os.environ['COCOLON_WORK_API_REPO'] = str(REPO)
os.environ['PYTHONDONTWRITEBYTECODE'] = '1'
sys.dont_write_bytecode = True
sys.path[:0] = [str(REPO), str(REPO / 'ai/services/ai_inference'), str(REPO / 'ai/tests'),
    str(ROOT / 'handoff/extracted/full12_preparation')]

import httpx
import pytest
from fastapi import FastAPI
import analysis_cumulative_service as service
import analysis_observed_service as observed
import analysis_model_source as model_sources
import analysis_semantic_map as semantic
from cocolon_meaning_experience_engine.cores.analysis import (
    semantic_admission as core, observed_route_realizer as realizer,
)
from test_emlis_q3_application import Q3Database
from full12_same_source_checkpoint import (
    canonical, sha, write_new, checked_query, snapshot, close, file_id,
    sql_source_assertions,
)
from prepare_event_plan_materials import identities as candidate_source_ids


def source_ids():
    return candidate_source_ids(REPO)


def prepared_parent(material):
    return semantic.prepare_semantic_map(material['owner'], material['snapshot'], prompt_version=PROFILE)


def check_candidate_plan(material, plan):
    parent = prepared_parent(material)
    stages = service.prepare_semantic_history_batches(parent)
    assert plan['prompt_version'] == parent.prompt_version == PROFILE
    assert plan['parent_request_ref'] == parent.request_ref
    assert plan['parent_messages'] == parent.messages()
    assert plan['parent_messages_sha256'] == core.semantic_map_hash(parent.messages())
    assert plan['parent_message_bytes'] == model_sources._semantic_message_bytes(parent)
    assert plan['source_guard'] == parent.source_guard == material['snapshot']['guard']
    assert plan['frozen_as_of'] == material['snapshot']['now']
    assert plan['source_records'] == 12 and 1 <= plan['leaf_count'] == len(stages) <= 12
    assert plan['fresh_model_calls_required'] == plan['actual_fresh_model_calls_required'] == len(stages) + 1
    assert plan['original_requested_max_model_calls'] == 13 and plan['reuse_old_receipts'] == 0
    assert len(plan['leaf_stages']) == len(stages)
    shown = []
    for row, stage in zip(plan['leaf_stages'], stages):
        assert row['request_ref'] == stage.request_ref
        assert row['record_refs'] == list(stage.record_refs)
        assert row['messages'] == stage.messages()
        assert row['messages_sha256'] == core.semantic_map_hash(stage.messages())
        assert row['message_bytes'] == model_sources._semantic_message_bytes(stage)
        assert model_sources.semantic_analysis_input_fits(stage)
        shown.extend(stage.record_refs)
    assert shown == [m.saved_record_ref for m in parent.frozen.members]
    assert len(shown) == len(set(shown)) == 12
    return parent, stages


def no_network(*args, **kwargs):
    raise AssertionError('offline_finalize_forbids_network_and_model_acquisition')


def load_pre(root):
    historical = json.loads((root / 'pre_acquisition.receipt.json').read_bytes())
    preparation = json.loads((CANDIDATE / 'diagnostic_preparation.json').read_bytes())
    assert preparation['state'] == 'SOURCE_ONLY_EVENT_PLAN_PREPARED_NOT_EXECUTED_NOT_ADOPTED'
    assert preparation['prompt_version'] == PROFILE
    assert preparation['source_hashes'] == source_ids(), 'candidate_pre_acquisition_source_changed'
    for filename, expected in preparation['immutable_old_sql_files'].items():
        assert sha((root / filename).read_bytes()) == expected, 'historical_sql_bytes_changed'
    for name, filename in (('sql_input', 'pre_acquisition.input.json'),
            ('plan', 'pre_acquisition.plan.json'), ('checkpoint', 'pre_acquisition.pglite.gz')):
        check_content_id(root / filename, historical[name])
    material = json.loads((root / 'pre_acquisition.input.json').read_bytes())
    assert (CANDIDATE / 'full12.input.json').read_bytes() == (root / 'pre_acquisition.input.json').read_bytes()
    plan = json.loads((CANDIDATE / 'full12_pre_acquisition.plan.json').read_bytes())
    assert material['all_fictional'] is True
    assert len(material['snapshot']['members']) == 12
    check_candidate_plan(material, plan)
    assert historical['artifact_rows'] == historical['monthly_rows'] == historical['model_calls'] == 0
    assert material['snapshot']['guard'] == historical['sql_guard'] == preparation['full12_guard']
    assert material['snapshot']['now'] == historical['frozen_as_of'] == preparation['full12_as_of']
    receipt = dict(state='EVENT_PLAN_CANDIDATE_BOUND_TO_IMMUTABLE_SQL_SOURCE',
        source_hashes=source_ids(), sql_guard=historical['sql_guard'],
        sql_input=historical['sql_input'], checkpoint=historical['checkpoint'],
        historical_receipt=file_id(root / 'pre_acquisition.receipt.json'),
        historical_plan=file_id(root / 'pre_acquisition.plan.json'),
        candidate_preparation=file_id(CANDIDATE / 'diagnostic_preparation.json'),
        candidate_plan=file_id(CANDIDATE / 'full12_pre_acquisition.plan.json'),
        prompt_version=PROFILE, source_records=12, leaf_count=plan['leaf_count'],
        fresh_model_calls_required=plan['actual_fresh_model_calls_required'])
    return receipt, material, plan


def check_content_id(path, expected):
    """Frozen historical absolute paths are metadata, not restore locators."""
    assert path.stat().st_size == expected['bytes']
    assert sha(path.read_bytes()) == expected['sha256']


def bind_db(monkey, db, *, read_only=False):
    calls = []

    async def rpc(name, payload):
        if read_only:
            assert name == 'analysis_cumulative_read', 'fresh_saved_read_attempted_write'
        calls.append((name, deepcopy(payload)))
        args = ','.join(f'{key} => ${index}' for index, key in enumerate(payload, 1))
        params = [json.dumps(value, ensure_ascii=False) if isinstance(value, (dict, list))
                  else value for value in payload.values()]
        rows = await asyncio.to_thread(checked_query, db,
            f'select public.{name}({args}) as value', params, 'service_role')
        return rows[0]['value']

    monkey.setattr(service, '_rpc', rpc)
    monkey.setattr(observed, '_rpc', rpc)
    monkey.setattr(service, 'observed_mode', lambda: 'development')
    monkey.setenv('COCOLON_ANALYSIS_OBSERVED_MODE', 'development')
    monkey.setattr(socket.socket, 'connect', no_network)
    monkey.setattr(socket, 'create_connection', no_network)
    return rpc, calls


def check_future_result(actual, material, receipt, *, synthetic):
    assert actual['state'] == 'GENERATED', 'no_completed_final_artifact'
    assert actual['all_fictional'] is True and actual.get('adopted', False) is False
    assert bool(actual.get('synthetic_test_output', False)) is synthetic
    assert actual['prompt_version'] == PROFILE
    assert actual['candidate_preparation_sha256'] == receipt['candidate_preparation']['sha256']
    assert actual['candidate_plan_sha256'] == receipt['candidate_plan']['sha256']
    assert actual['training'] == actual['retry'] == actual['reused_responses'] == 0
    assert actual['source_guard'] == material['snapshot']['guard'] == receipt['sql_guard']
    assert actual['input_sha256'] == sha(canonical(material).encode())
    assert actual['raw_input_file_sha256'] == receipt['sql_input']['sha256']
    core_path = 'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py'
    assert actual['candidate_core_sha256'] == receipt['source_hashes'][core_path]
    assert actual['fresh_model_calls'] == actual['map_calls'] == (0 if synthetic else receipt['fresh_model_calls_required'])
    assert actual['new_model_calls'] == (0 if synthetic else receipt['fresh_model_calls_required'] + 4), 'map_and_control_call_count_mismatch'
    if synthetic:
        assert actual['rehearsal_label'] == 'CPU_SYNTHETIC_NOT_MODEL_QUALITY'
    else:
        assert actual['unit'] == 'B9' and actual['profile'] == PROFILE
        assert actual['model'] == 'cocolon-qwen3.5-4b-analysis-event-plan-v2'
        controls = actual['controls']
        assert len(controls) == 4
        assert [row['phase'] for row in controls] == ['before', 'before', 'after', 'after']
        assert len({row['id'] for row in controls}) == 2
        for before, after in zip(controls[:2], controls[2:]):
            assert before['id'] == after['id']
            assert before['wire_request'] == after['wire_request']
            assert before['body'] == after['body']
            assert before['body_sha256'] == after['body_sha256'] == sha(before['body'].encode())
            assert before['state'] == after['state'] == 'RECEIVED'
            assert before['status_code'] == after['status_code'] == 200
            assert json.loads(before['body'])['choices'][0]['finish_reason'] == 'stop'
    acquisitions = actual['acquisitions']
    assert len(acquisitions) == receipt['fresh_model_calls_required']
    for number, row in enumerate(acquisitions, 1):
        assert row['ordinal'] == number
        assert row['stage_kind'] == ('MERGE' if number == receipt['fresh_model_calls_required'] else 'LEAF')
        assert row['state'] == 'RECEIVED' and row['status_code'] == 200
        assert not row.get('reused_from') and not row.get('origin', '').startswith('REUSED')
        assert row['body_sha256'] == sha(row['body'].encode())
        wire = row['wire_request']
        assert wire['model'] == actual['model'] and wire['max_tokens'] == 4096
        assert wire['temperature'] == 0 and wire['stream'] is False
        assert wire['chat_template_kwargs'] == {'enable_thinking': False}
        assert row['messages_sha256'] == core.semantic_map_hash(wire['messages'])
        body = json.loads(row['body'])
        assert body['model'] == actual['model'] and len(body['choices']) == 1
        choice = body['choices'][0]
        assert choice['finish_reason'] == 'stop'
        assert choice['message']['role'] == 'assistant'
        raw = choice['message']['content']
        assert isinstance(raw, str) and raw.strip()
        assert json.loads(raw)['schema_version'] == SCHEMA, 'legacy_raw_cannot_bind_to_event_plan'
        if not synthetic:
            assert type(row['input_tokens']) is int and row['input_tokens'] > 0
            assert row['input_plus_output_tokens'] == row['input_tokens'] + wire['max_tokens'] <= 32768
    return acquisitions


MEANING_REVIEW_SCHEMA = 'cocolon.event_plan.full12.meaning_review.v1'
MEANING_REVIEW_STATE = 'ALL_TWELVE_SOURCE_RAW_PROJECTION_TEXT_ADEQUATE'
MEANING_REVIEW_KEYS = frozenset({'schema_version', 'state', 'actual_result_sha256',
    'raw_sha256_by_ordinal', 'projection_sha256', 'text_sha256', 'reviewers',
    'source_records', 'source_guard', 'frozen_as_of', 'candidate_plan_sha256'})


def check_meaning_review(review_path, actual_bytes, actual, material, receipt, *, synthetic):
    """Require independently completed, exact-result review before opening SQL.

    This checks a review's binding and declared scope, not semantic truth or
    product acceptance. Only the explicit CPU synthetic path may bypass it.
    """
    if synthetic:
        assert actual.get('synthetic_test_output') is True
        assert actual.get('rehearsal_label') == 'CPU_SYNTHETIC_NOT_MODEL_QUALITY'
        assert review_path is None, 'synthetic_rehearsal_cannot_claim_meaning_review'
        return None
    assert actual.get('synthetic_test_output', False) is False
    assert review_path is not None, 'completed_bound_meaning_review_required_before_sql'
    review = json.loads(review_path.read_bytes())
    assert type(review) is dict and set(review) == MEANING_REVIEW_KEYS, 'meaning_review_exact_keys_required'
    assert review['schema_version'] == MEANING_REVIEW_SCHEMA
    assert review['state'] == MEANING_REVIEW_STATE, 'meaning_review_not_adequate'
    assert review['actual_result_sha256'] == sha(actual_bytes), 'meaning_review_actual_changed'
    assert type(review['reviewers']) is list and len(review['reviewers']) == 2
    assert all(type(value) is str for value in review['reviewers'])
    assert set(review['reviewers']) == {'root', 'independent'}, 'independent_and_root_reviews_required'
    acquisitions = actual['acquisitions']
    assert len(acquisitions) == receipt['fresh_model_calls_required']
    raw_hashes = {str(row['ordinal']): sha(json.loads(row['body'])['choices'][0]['message']['content'].encode())
                  for row in acquisitions}
    assert set(raw_hashes) == {str(i) for i in range(1, receipt['fresh_model_calls_required'] + 1)}
    assert type(review['raw_sha256_by_ordinal']) is dict and review['raw_sha256_by_ordinal'] == raw_hashes, 'meaning_review_raw_changed'
    assert review['projection_sha256'] == sha(canonical(actual['projection']).encode()), 'meaning_review_projection_changed'
    assert review['text_sha256'] == sha(actual['text'].encode()), 'meaning_review_text_changed'
    assert type(review['source_records']) is int and review['source_records'] == len(material['snapshot']['members']) == 12
    assert review['source_guard'] == actual['source_guard'] == material['snapshot']['guard'] == receipt['sql_guard']
    assert review['frozen_as_of'] == material['snapshot']['now']
    assert review['candidate_plan_sha256'] == actual['candidate_plan_sha256'] == receipt['candidate_plan']['sha256']
    return dict(review=file_id(review_path), state=review['state'], reviewers=review['reviewers'],
        actual_result_sha256=review['actual_result_sha256'],
        raw_sha256_by_ordinal=review['raw_sha256_by_ordinal'],
        projection_sha256=review['projection_sha256'], text_sha256=review['text_sha256'],
        source_records=review['source_records'], source_guard=review['source_guard'],
        frozen_as_of=review['frozen_as_of'], candidate_plan_sha256=review['candidate_plan_sha256'])


def verify_actual_preflight(path, actual, plan, material):
    proof = json.loads(path.read_bytes())
    assert proof['state'] == 'PREFLIGHT_PASS_NOT_MODEL_QUALITY'
    assert proof['unit'] == 'B9' and proof['profile'] == PROFILE
    assert proof['model_loaded'] is False and proof['new_model_calls'] == proof['training'] == 0
    assert proof['enable_thinking'] is False and proof['model_alias'] == actual['model']
    assert proof['parent_request_ref'] == plan['parent_request_ref'] == actual['request_ref']
    assert proof['source_guard'] == actual['source_guard'] == material['snapshot']['guard']
    assert proof['raw_input_file_sha256'] == actual['raw_input_file_sha256']
    assert proof['input_sha256'] == actual['input_sha256']
    assert proof['fresh_leaf_count'] == plan['leaf_count']
    assert proof['fresh_model_calls_required'] == plan['actual_fresh_model_calls_required']
    assert proof['reused_responses'] == 0 and len(proof['leaves']) == len(proof['rows']) == plan['leaf_count']
    assert proof['rows'] == proof['leaves']
    for prepared, leaf, acquired in zip(plan['leaf_stages'], proof['leaves'], actual['acquisitions'][:plan['leaf_count']]):
        assert leaf['request_ref'] == prepared['request_ref']
        assert leaf['messages_sha256'] == prepared['messages_sha256'] == acquired['messages_sha256']
        assert leaf['reserved_output_tokens'] == 4096 and leaf['context_tokens'] == 32768
        assert type(leaf['input_tokens']) is int and leaf['input_tokens'] > 0
        assert leaf['input_tokens'] == acquired['input_tokens']
        assert leaf['input_plus_output_tokens'] == leaf['input_tokens'] + 4096 <= 32768
    return file_id(path)


def verify_source(db, material, receipt):
    current = snapshot(db, material['owner'])
    assert current['guard'] == material['snapshot']['guard'] == receipt['sql_guard']
    sql_source_assertions(material['snapshot'], current)
    return current


async def finalize(pre_root, actual_path, output_root, *, synthetic=False, review_path=None):
    receipt, material, plan = load_pre(pre_root)
    actual_bytes = actual_path.read_bytes()
    actual = json.loads(actual_bytes)
    acquisitions = check_future_result(actual, material, receipt, synthetic=synthetic)
    meaning_review = check_meaning_review(review_path, actual_bytes, actual, material, receipt, synthetic=synthetic)
    actual_preflight = (None if synthetic else verify_actual_preflight(
        actual_path.with_name('full12-sql.preflight.json'), actual, plan, material))
    assert not output_root.exists(), 'one_shot_finalize_output_already_exists'
    output_root.mkdir(mode=0o700)
    monkey = pytest.MonkeyPatch()
    db = Q3Database(checkpoint_path=pre_root / 'pre_acquisition.pglite.gz')
    try:
        rpc, calls = bind_db(monkey, db)
        verify_source(db, material, receipt)
        assert checked_query(db, 'select count(*) as n from public.analysis_observed_artifacts')[0]['n'] == 0
        assert checked_query(db, 'select count(*) as n from public.analysis_cumulative_months')[0]['n'] == 0
        parent = prepared_parent(material)
        assert parent.request_ref == actual['request_ref'] == plan['parent_request_ref']
        actual_id = actual['artifact_id']
        uuid = UUID(actual_id.removeprefix('artifact:'))
        assert actual['projection']['projection_of'] == actual_id + '@1'
        monkey.setattr(realizer, 'uuid4', lambda: uuid)
        cursor = 0

        async def replay(request):
            nonlocal cursor
            assert request.url.host == 'same-pod.invalid' and cursor < receipt['fresh_model_calls_required']
            row = acquisitions[cursor]
            assert json.loads(request.content) == row['wire_request'], 'wire_request_rebound'
            assert sha(request.content) == row['wire_request_sha256'], 'wire_request_bytes_changed'
            assert core.semantic_map_hash(json.loads(request.content)['messages']) == row['messages_sha256']
            cursor += 1
            return httpx.Response(200, content=row['body'].encode())

        source = model_sources.SelfHostedSemanticAnalysisModelSource(
            endpoint='https://same-pod.invalid/v1/chat/completions', model=actual['model'],
            api_key='isolated-offline-replay-only', semantic_prompt_version=PROFILE,
            transport=httpx.MockTransport(replay))
        artifact, coverage = await service._semantic_history_map(source, parent)
        assert cursor == receipt['fresh_model_calls_required']
        assert artifact.artifact_id == actual_id
        projection = artifact.safe_projection(authenticated_owner_scope=material['owner'])
        text = artifact.safe_text_projection(authenticated_owner_scope=material['owner'])['text']
        private = artifact.private_evidence()
        assert projection == actual['projection'] and text == actual['text']
        assert private == actual['private_evidence'] and coverage == actual['coverage']
        assert coverage['source_count'] == coverage['processed_count'] == coverage['mapped_count'] == 12
        assert coverage['unparsed_count'] == coverage['excluded_count'] == 0
        history = private['graph']['meaning_review']['history_synthesis']
        assert history['profile'] == 'semantic_map.history_synthesis.v2'
        assert history['inherited_unknowns'] == [] and len(history['leaf_candidates']) == plan['leaf_count']
        assert history['full_source_semantic_coverage'] is False
        assert len(history['field_manifest']) == 24
        assert history['omitted_ranges'] == [], 'full_original_fields_required_for_this_finalization'
        originals = {m['original']['id'] for m in material['snapshot']['members']}
        assert {m['saved_record_ref'] for m in private['source_members']} == originals
        for candidate, row in zip(history['leaf_candidates'], acquisitions[:plan['leaf_count']]):
            raw = json.loads(row['body'])['choices'][0]['message']['content']
            assert candidate['raw'] == raw and candidate['response_sha256'] == sha(raw.encode())
            assert candidate['messages_sha256'] == row['messages_sha256']
        private = deepcopy(private)
        private['coverage'] = coverage
        private['source_record_refs'] = [m['original']['id'] for m in material['snapshot']['members']]
        service._checked_projection(projection, str(uuid))
        rid = await rpc('analysis_cumulative_commit', dict(p_user_id=material['owner'],
            p_guard=material['snapshot']['guard'], p_artifact_id=actual_id,
            p_private_evidence=private, p_projection=projection, p_text=text,
            p_start=material['snapshot']['period_start'], p_end=material['snapshot']['period_end'], p_force=False))
        assert rid == str(uuid)
        assert sum(name == 'analysis_cumulative_commit' for name, _ in calls) == 1
        assert checked_query(db, 'select count(*) as n from public.analysis_observed_artifacts')[0]['n'] == 1
        assert checked_query(db, 'select count(*) as n from public.analysis_cumulative_months')[0]['n'] == 1
        stored = checked_query(db, 'select private_evidence from public.analysis_observed_artifacts where id=$1', [rid])
        assert len(stored) == 1 and stored[0]['private_evidence'] == private
        verify_source(db, material, receipt)
        expected = dict(owner=material['owner'], report_id=rid, meta=projection,
            content_text=text, map_context=coverage, stored_private_evidence=private,
            period_start=material['snapshot']['period_start'], period_end=material['snapshot']['period_end'])
        write_new(output_root / 'saved_expected.json', expected)
        db.dump_checkpoint(output_root / 'post_save.pglite.gz')
        report = dict(state='SAVED_PENDING_SEPARATE_PROCESS_REREAD', synthetic_test_output=synthetic,
            model_calls=0, hosted_database_calls=0, replayed_http_responses=receipt['fresh_model_calls_required'],
            actual_result=file_id(actual_path), source_guard=material['snapshot']['guard'],
            original_frozen_as_of=material['snapshot']['now'], original_period_start=material['snapshot']['period_start'],
            original_period_end=material['snapshot']['period_end'], artifact_id=actual_id,
            saved_artifacts=1, generation_commits=1, monthly_references=1,
            expected=file_id(output_root / 'saved_expected.json'), checkpoint=file_id(output_root / 'post_save.pglite.gz'),
            pre_checkpoint=file_id(pre_root / 'pre_acquisition.pglite.gz'), source_hashes=source_ids(),
            candidate_preacquisition_binding=receipt,
            actual_tokenizer_preflight=actual_preflight,
            product_acceptance=False,
            semantic_quality='CPU_SYNTHETIC_NOT_MODEL_QUALITY' if synthetic else 'NOT_DECIDED_BY_REPLAY_HARNESS')
        if meaning_review is not None:
            report['meaning_review_binding'] = meaning_review
            report['independent_review'] = meaning_review['review']
        write_new(output_root / 'save_receipt.json', report)
    finally:
        close(db)
        monkey.undo()
    result = subprocess.run([sys.executable, str(Path(__file__).resolve()), 'reread',
        '--output-root', str(output_root)], stdin=subprocess.DEVNULL,
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=90, check=False)
    (output_root / 'separate_process_reread.stdout').write_text(result.stdout)
    (output_root / 'separate_process_reread.stderr').write_text(result.stderr)
    assert result.returncode == 0, 'separate_process_reread_failed'
    reread_report = json.loads((output_root / 'reread_receipt.json').read_bytes())
    assert reread_report['state'] == 'SAME_SAVED_ARTIFACT_REREAD_IN_FRESH_PROCESS'
    check_content_id(pre_root / 'pre_acquisition.pglite.gz', receipt['checkpoint'])
    assert actual_path.read_bytes() == actual_bytes
    report.update(state='SAVED_AND_SEPARATE_PROCESS_REREAD_TECHNICAL_ONLY',
        reread=file_id(output_root / 'reread_receipt.json'), actual_bytes_unchanged=True,
        original_pre_checkpoint_unchanged=True)
    write_new(output_root / 'final_receipt.json', report)
    print(canonical(dict(state=report['state'], synthetic_test_output=synthetic,
        report_id=rid, model_calls=0, hosted_database_calls=0, output_root=str(output_root))))


async def reread(output_root):
    receipt = json.loads((output_root / 'save_receipt.json').read_bytes())
    assert receipt['source_hashes'] == source_ids(), 'saved_reread_source_changed'
    for name, filename in (('expected', 'saved_expected.json'), ('checkpoint', 'post_save.pglite.gz')):
        check_content_id(output_root / filename, receipt[name])
    expected = json.loads((output_root / 'saved_expected.json').read_bytes())
    db = Q3Database(checkpoint_path=output_root / 'post_save.pglite.gz')
    monkey = pytest.MonkeyPatch()
    try:
        _, calls = bind_db(monkey, db, read_only=True)
        monkey.setattr(model_sources, 'application_analysis_model_source', no_network)
        monkey.setattr(service, '_semantic_history_map', no_network)
        monkey.setattr(service, 'build_cumulative_map', no_network)
        def same_saved(item):
            assert item['report_id'] == expected['report_id'] and item['refreshed'] is False
            assert item['meta'] == expected['meta']
            assert item['content_text'] == expected['content_text']
            assert item['map_context'] == expected['map_context']

        for options in ({'limit': 1}, {'report_id': expected['report_id'], 'limit': 1},
                {'history': True, 'limit': 1}):
            values = await service.read_maps(expected['owner'], **options)
            assert len(values['items']) == 1
            row = values['items'][0]
            assert row['id'] == expected['report_id']
            assert row['content_json']['watashiMap'] == expected['meta']
            assert row['content_text'] == expected['content_text']
            assert row['content_json']['map_context'] == expected['map_context']
        import api_self_structure as latest
        monkey.setattr(latest, '_resolve_user_id_from_token', AsyncMock(return_value=expected['owner']))
        app = FastAPI()
        latest.register_self_structure_routes(app)
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='https://isolated-app.invalid') as client:
            response = await client.get('/self-structure/latest?ensure=false&force=true',
                headers={'Authorization': 'Bearer isolated-fictional-owner', 'X-Watashi-Map-Renderer': 'semantic.v1'})
        assert response.status_code == 200, 'normal_saved_http_read_failed'
        same_saved(response.json())
        stored = checked_query(db, 'select private_evidence from public.analysis_observed_artifacts where id=$1',
            [expected['report_id']])
        assert len(stored) == 1 and stored[0]['private_evidence'] == expected['stored_private_evidence']
        assert checked_query(db, 'select count(*) as n from public.analysis_observed_artifacts')[0]['n'] == 1
        assert checked_query(db, 'select count(*) as n from public.analysis_cumulative_months')[0]['n'] == 1
        assert calls and all(name == 'analysis_cumulative_read' for name, _ in calls)
        result = dict(state='SAME_SAVED_ARTIFACT_REREAD_IN_FRESH_PROCESS',
            synthetic_test_output=receipt['synthetic_test_output'], report_id=expected['report_id'],
            service_current_detail_and_month_same_id_text_projection_coverage=True, http_status=200,
            http_read_same_id_text_projection_coverage=True, stored_private_evidence_same=True,
            model_calls=0, hosted_database_calls=0, sql_writes=0,
            product_acceptance=False, source_hashes=source_ids())
        write_new(output_root / 'reread_receipt.json', result)
        print(canonical(result))
    finally:
        close(db)
        monkey.undo()


async def dry_run(pre_root, root):
    """CPU_SYNTHETIC_NOT_MODEL_QUALITY: fresh synthetic event plans only."""
    receipt, material, plan = load_pre(pre_root)
    assert not root.exists()
    root.mkdir(mode=0o700)
    from ai.tools.serve_emlis_natural_reply import _semantic_sentence_quotes
    monkey = pytest.MonkeyPatch()
    monkey.setenv('COCOLON_ANALYSIS_OBSERVED_MODE', 'development')
    monkey.setattr(socket.socket, 'connect', no_network)
    monkey.setattr(socket, 'create_connection', no_network)
    acquisitions = []
    model = 'CPU_SYNTHETIC_NOT_MODEL_QUALITY'

    def packets(request):
        wire = json.loads(request.content)
        content = json.loads(wire['messages'][1]['content'])
        # One clearly synthetic fact per displayed source record is enough
        # to exercise the candidate reference contract and SQL lifecycle.
        # No historical generated answer is transformed or rebound here.
        fields = {}
        for field in content['fields']:
            fields.setdefault(field['record'], field)
        events, nodes = [], []
        for index, field in enumerate(fields.values(), 1):
            text = field['text']
            quotes = [quote for quote in _semantic_sentence_quotes(text)
                if len(quote) <= 160 and text.count(quote) == 1]
            assert quotes, 'synthetic_dry_run_needs_a_short_exact_source_root'
            quote = quotes[0]
            event_id, node_id = 'e' + str(index), 'n' + str(index)
            events.append(dict(evidence=[dict(field=field['field'], quote=quote)],
                event_id=event_id, source_mode='RECORDED', fact='合成検証で使う記録の一節です。', unknowns=[]))
            nodes.append(dict(node_id=node_id, node_kind='STATE_CONTEXT', perspective='SELF',
                title='合成検証用の項目' + str(index), unit_refs=[event_id]))
        packet = dict(schema_version=SCHEMA, events=events, readings=[], nodes=nodes,
            edges=[], overview=dict(title='CPU合成検証用',
                unit_refs=[event['event_id'] for event in events]))
        body = canonical(dict(model=model, choices=[dict(finish_reason='stop',
            message=dict(role='assistant', content=json.dumps(packet, ensure_ascii=False)))]))
        acquisitions.append(dict(ordinal=len(acquisitions) + 1,
            stage_kind=content['history_stage']['kind'], state='RECEIVED', status_code=200,
            wire_request=wire, wire_request_sha256=sha(request.content),
            messages_sha256=core.semantic_map_hash(wire['messages']), body=body, body_sha256=sha(body.encode())))
        return httpx.Response(200, content=body.encode())

    try:
        parent = prepared_parent(material)
        source = model_sources.SelfHostedSemanticAnalysisModelSource(
            endpoint='https://same-pod.invalid/v1/chat/completions', model=model,
            api_key='isolated-synthetic-dry-run', semantic_prompt_version=PROFILE,
            transport=httpx.MockTransport(packets))
        artifact, coverage = await service._semantic_history_map(source, parent)
        assert len(acquisitions) == receipt['fresh_model_calls_required']
        core_path = 'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py'
        actual = dict(state='GENERATED', adopted=False, all_fictional=True, synthetic_test_output=True,
            rehearsal_label='CPU_SYNTHETIC_NOT_MODEL_QUALITY', prompt_version=PROFILE,
            candidate_preparation_sha256=receipt['candidate_preparation']['sha256'],
            candidate_plan_sha256=receipt['candidate_plan']['sha256'],
            model=model, request_ref=parent.request_ref, artifact_id=artifact.artifact_id,
            input_sha256=sha(canonical(material).encode()), raw_input_file_sha256=receipt['sql_input']['sha256'],
            source_guard=material['snapshot']['guard'], candidate_core_sha256=receipt['source_hashes'][core_path],
            fresh_model_calls=0, map_calls=0, new_model_calls=0, reused_responses=0, training=0, retry=0,
            synthetic_response_count=receipt['fresh_model_calls_required'], acquisitions=acquisitions,
            projection=artifact.safe_projection(authenticated_owner_scope=material['owner']),
            text=artifact.safe_text_projection(authenticated_owner_scope=material['owner'])['text'],
            private_evidence=artifact.private_evidence(), coverage=coverage,
            native_capacity='NOT_MEASURED_SYNTHETIC_DRY_RUN', product_acceptance=False)
        write_new(root / 'synthetic_test_result.json', actual)
    finally:
        monkey.undo()
    await finalize(pre_root, root / 'synthetic_test_result.json', root / 'save_and_reread', synthetic=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('phase', choices=('finalize', 'reread', 'dry-run'))
    parser.add_argument('--pre-root', type=Path)
    parser.add_argument('--actual', type=Path)
    parser.add_argument('--output-root', required=True, type=Path)
    parser.add_argument('--meaning-review', type=Path,
        help='Required for nonsynthetic finalize: completed root and independent review bound to the exact actual result, all derived leaf and merge raw responses, projection, text and frozen source. Not product acceptance.')
    parser.add_argument('--repo', type=Path,
        help='Exact matching API checkout; equivalent COCOLON_WORK_API_REPO environment variable is supported.')
    args = parser.parse_args()
    assert os.environ.get('Q2_PGLITE_MODULE'), 'existing_pglite_dependency_required'
    if args.phase == 'reread':
        asyncio.run(reread(args.output_root.resolve()))
    elif args.phase == 'dry-run':
        assert args.pre_root is not None
        asyncio.run(dry_run(args.pre_root.resolve(), args.output_root.resolve()))
    else:
        assert args.pre_root is not None and args.actual is not None
        asyncio.run(finalize(args.pre_root.resolve(), args.actual.resolve(), args.output_root.resolve(),
            review_path=args.meaning_review.resolve() if args.meaning_review else None))


if __name__ == '__main__':
    main()
