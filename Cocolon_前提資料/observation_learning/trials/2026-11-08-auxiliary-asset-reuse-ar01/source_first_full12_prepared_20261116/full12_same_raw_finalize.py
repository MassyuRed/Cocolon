"""One offline replay/save/reread of a reviewed fresh full-history acquisition.

Restores the existing disposable SQL checkpoint; never changes that file.
No model, remote API, or hosted database is called. This script establishes
technical reproduction only. Semantic review and product acceptance remain
separate. The dry-run uses the existing test packet builder, not model output.
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
from unittest.mock import AsyncMock
from uuid import UUID

early = argparse.ArgumentParser(add_help=False)
early.add_argument('--repo', type=Path)
early_args, _ = early.parse_known_args()
REPO = Path(early_args.repo or os.environ.get('COCOLON_WORK_API_REPO',
    '/workspace/scratch/8262f97b141c/api')).resolve()
os.environ['COCOLON_WORK_API_REPO'] = str(REPO)
sys.path[:0] = [str(REPO), str(REPO / 'ai/services/ai_inference'), str(REPO / 'ai/tests')]

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
    source_ids, prepared_plan, sql_source_assertions,
)


def no_network(*args, **kwargs):
    raise AssertionError('offline_finalize_forbids_network_and_model_acquisition')


def load_pre(root):
    receipt = json.loads((root / 'pre_acquisition.receipt.json').read_bytes())
    assert receipt['source_hashes'] == source_ids(), 'pre_acquisition_source_changed'
    for name, filename in (('sql_input', 'pre_acquisition.input.json'),
            ('plan', 'pre_acquisition.plan.json'), ('checkpoint', 'pre_acquisition.pglite.gz')):
        check_content_id(root / filename, receipt[name])
    material = json.loads((root / 'pre_acquisition.input.json').read_bytes())
    plan = json.loads((root / 'pre_acquisition.plan.json').read_bytes())
    assert material['all_fictional'] is True
    assert len(material['snapshot']['members']) == 12
    assert plan == prepared_plan(material['owner'], material['snapshot'])
    assert plan['leaf_count'] == 12 and plan['fresh_model_calls_required'] == 13
    assert plan['reuse_old_receipts'] == 0
    assert receipt['artifact_rows'] == receipt['monthly_rows'] == receipt['model_calls'] == 0
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
    assert actual['training'] == actual['retry'] == actual['reused_responses'] == 0
    assert actual['source_guard'] == material['snapshot']['guard'] == receipt['sql_guard']
    assert actual['input_sha256'] == sha(canonical(material).encode())
    assert actual['raw_input_file_sha256'] == receipt['sql_input']['sha256']
    core_path = 'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py'
    assert actual['candidate_core_sha256'] == receipt['source_hashes'][core_path]
    assert actual['fresh_model_calls'] == actual['new_model_calls'] == (0 if synthetic else 13)
    acquisitions = actual['acquisitions']
    assert len(acquisitions) == 13
    for number, row in enumerate(acquisitions, 1):
        assert row['ordinal'] == number
        assert row['stage_kind'] == ('MERGE' if number == 13 else 'LEAF')
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
        if not synthetic:
            assert type(row['input_tokens']) is int and row['input_tokens'] > 0
            assert row['input_plus_output_tokens'] == row['input_tokens'] + wire['max_tokens'] <= 32768
    return acquisitions


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
    assert not output_root.exists(), 'one_shot_finalize_output_already_exists'
    output_root.mkdir(mode=0o700)
    monkey = pytest.MonkeyPatch()
    db = Q3Database(checkpoint_path=pre_root / 'pre_acquisition.pglite.gz')
    try:
        rpc, calls = bind_db(monkey, db)
        verify_source(db, material, receipt)
        assert checked_query(db, 'select count(*) as n from public.analysis_observed_artifacts')[0]['n'] == 0
        assert checked_query(db, 'select count(*) as n from public.analysis_cumulative_months')[0]['n'] == 0
        parent = semantic.prepare_semantic_map(material['owner'], material['snapshot'])
        assert parent.request_ref == actual['request_ref'] == plan['parent_request_ref']
        actual_id = actual['artifact_id']
        uuid = UUID(actual_id.removeprefix('artifact:'))
        assert actual['projection']['projection_of'] == actual_id + '@1'
        monkey.setattr(realizer, 'uuid4', lambda: uuid)
        cursor = 0

        async def replay(request):
            nonlocal cursor
            assert request.url.host == 'same-pod.invalid' and cursor < 13
            row = acquisitions[cursor]
            assert json.loads(request.content) == row['wire_request'], 'wire_request_rebound'
            assert sha(request.content) == row['wire_request_sha256'], 'wire_request_bytes_changed'
            assert core.semantic_map_hash(json.loads(request.content)['messages']) == row['messages_sha256']
            cursor += 1
            return httpx.Response(200, content=row['body'].encode())

        source = model_sources.SelfHostedSemanticAnalysisModelSource(
            endpoint='https://same-pod.invalid/v1/chat/completions', model=actual['model'],
            api_key='isolated-offline-replay-only', transport=httpx.MockTransport(replay))
        artifact, coverage = await service._semantic_history_map(source, parent)
        assert cursor == 13
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
        assert history['inherited_unknowns'] == [] and len(history['leaf_candidates']) == 12
        assert history['full_source_semantic_coverage'] is False
        assert len(history['field_manifest']) == 24
        assert history['omitted_ranges'] == [], 'full_original_fields_required_for_this_finalization'
        originals = {m['original']['id'] for m in material['snapshot']['members']}
        assert {m['saved_record_ref'] for m in private['source_members']} == originals
        for candidate, row in zip(history['leaf_candidates'], acquisitions[:12]):
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
            model_calls=0, hosted_database_calls=0, replayed_http_responses=13,
            actual_result=file_id(actual_path), source_guard=material['snapshot']['guard'],
            original_frozen_as_of=material['snapshot']['now'], original_period_start=material['snapshot']['period_start'],
            original_period_end=material['snapshot']['period_end'], artifact_id=actual_id,
            saved_artifacts=1, generation_commits=1, monthly_references=1,
            expected=file_id(output_root / 'saved_expected.json'), checkpoint=file_id(output_root / 'post_save.pglite.gz'),
            pre_checkpoint=file_id(pre_root / 'pre_acquisition.pglite.gz'), source_hashes=source_ids(),
            product_acceptance=False, semantic_quality='NOT_DECIDED_BY_REPLAY_HARNESS')
        if review_path is not None:
            report['independent_review'] = file_id(review_path)
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
    """Exercise the action with existing synthetic packets, never model raw."""
    receipt, material, plan = load_pre(pre_root)
    assert not root.exists()
    root.mkdir(mode=0o700)
    from test_analysis_semantic_history_service import map_packet
    from ai.tools.serve_emlis_natural_reply import _semantic_sentence_quotes
    monkey = pytest.MonkeyPatch()
    monkey.setenv('COCOLON_ANALYSIS_OBSERVED_MODE', 'development')
    monkey.setattr(socket.socket, 'connect', no_network)
    monkey.setattr(socket, 'create_connection', no_network)
    acquisitions = []
    model = 'synthetic-existing-test-packets-not-model-output'

    def packets(request):
        wire = json.loads(request.content)
        content = json.loads(wire['messages'][1]['content'])
        # The existing packet builder otherwise quotes every long field in
        # full, duplicating all source prose into the merge quote index. Use
        # its same synthetic meanings with legal short exact roots instead;
        # the actual source material and real transport budgets stay intact.
        roots = []
        for field in content['fields']:
            text = field['text']
            quotes = [quote for quote in _semantic_sentence_quotes(text)
                if len(quote) <= 160 and text.count(quote) == 1]
            assert quotes, 'synthetic_dry_run_needs_a_short_exact_source_root'
            roots.append(dict(field, text=quotes[0]))
        packet = map_packet(roots)
        body = canonical(dict(model=model, choices=[dict(finish_reason='stop',
            message=dict(role='assistant', content=json.dumps(packet, ensure_ascii=False)))]))
        acquisitions.append(dict(ordinal=len(acquisitions) + 1,
            stage_kind=content['history_stage']['kind'], state='RECEIVED', status_code=200,
            wire_request=wire, wire_request_sha256=sha(request.content),
            messages_sha256=core.semantic_map_hash(wire['messages']), body=body, body_sha256=sha(body.encode())))
        return httpx.Response(200, content=body.encode())

    try:
        parent = semantic.prepare_semantic_map(material['owner'], material['snapshot'])
        source = model_sources.SelfHostedSemanticAnalysisModelSource(
            endpoint='https://same-pod.invalid/v1/chat/completions', model=model,
            api_key='isolated-synthetic-dry-run', transport=httpx.MockTransport(packets))
        artifact, coverage = await service._semantic_history_map(source, parent)
        assert len(acquisitions) == 13
        core_path = 'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py'
        actual = dict(state='GENERATED', adopted=False, all_fictional=True, synthetic_test_output=True,
            model=model, request_ref=parent.request_ref, artifact_id=artifact.artifact_id,
            input_sha256=sha(canonical(material).encode()), raw_input_file_sha256=receipt['sql_input']['sha256'],
            source_guard=material['snapshot']['guard'], candidate_core_sha256=receipt['source_hashes'][core_path],
            fresh_model_calls=0, new_model_calls=0, reused_responses=0, training=0, retry=0,
            synthetic_response_count=13, acquisitions=acquisitions,
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
        help='Optional already-completed independent review; recorded, not interpreted as human acceptance.')
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
