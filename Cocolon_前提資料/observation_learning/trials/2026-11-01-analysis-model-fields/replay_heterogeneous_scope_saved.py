"""Read saved heterogeneous model projections through current/monthly readers.

The complete ten model responses and their exact raw bytes are verified first.
Only GENERATED_PRIVATE_ONLY projections are read; rejected/unsupported cases
remain in the report with zero reads. RPC rows and date/month metadata are
synthetic, with no database persistence or private graph restoration claimed.
Optional --comparison reads a separately verified consumer replay and writes
saved-reader-<consumer commit prefix>.private.json, preserving the baseline.
"""
from __future__ import annotations

import argparse
import asyncio
from contextlib import ExitStack
from copy import deepcopy
from datetime import datetime, timedelta, timezone
import hashlib
import json
from pathlib import Path
import subprocess
import sys
from unittest.mock import AsyncMock, patch
from uuid import UUID


IDS = [f'HC{i:02d}' for i in range(1, 11)]


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True,
        separators=(',', ':'), allow_nan=False)


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument('--api', type=Path, required=True)
    cli.add_argument('--root', type=Path, required=True)
    cli.add_argument('--comparison', type=Path)
    args = cli.parse_args()
    api, root = args.api.resolve(), args.root.resolve()
    paths = ['pack.private.json', 'result.private.json']
    paths += [case_id + suffix for case_id in IDS
        for suffix in ('.response.private.json', '.raw.txt')]
    input_paths = {name: root / name for name in paths}
    inputs = {name: path.read_bytes() for name, path in input_paths.items()}
    pack, result = (json.loads(inputs[name]) for name in paths[:2])
    assert pack['schema_version'] == 'analysis_heterogeneous_scope_fixed_v10_probe.v1'
    assert result['schema_version'] == 'analysis_heterogeneous_scope_result.v1'
    assert pack['profile'] == 'selected_material.v10'
    assert pack['ids'] == [c['id'] for c in pack['cases']] == IDS
    assert [c['id'] for c in result['cases']] == IDS
    assert result['status'] == 'COMPLETE_PENDING_REVIEW_NOT_ADOPTED'
    assert result['calls_started'] == result['new_generation'] == pack['max_generations'] == 10
    assert result['model_loads_started'] == result['model_loads'] == 1
    assert result['training_updates'] == result['api_calls'] == result['db_calls'] == 0
    assert not pack['normal_adoption'] and not result['normal_adoption']

    for spec, case in zip(pack['cases'], result['cases']):
        response = case['response']
        envelope = json.loads(inputs[case['id'] + '.response.private.json'])
        assert set(response) == {'request_ref', 'messages_sha256', 'raw_sha256', 'finish_reason', 'raw'}
        assert envelope == dict(row=case['row'], messages=case['messages'], response=response)
        assert case['row'] == spec['row'] and case['messages'] == spec['messages']
        assert case['request_ref'] == spec['request_ref'] == response['request_ref']
        assert case['source_guard'] == spec['source_guard'] == spec['row']['snapshot']['guard']
        assert digest(canonical(case['messages']).encode('utf-8')) == spec['messages_sha256'] == response['messages_sha256']
        raw = inputs[case['id'] + '.raw.txt']
        assert raw == response['raw'].encode('utf-8') and digest(raw) == response['raw_sha256']
        assert response['finish_reason'] == 'stop'

    source_identity, cases = pack, result['cases']
    destination = root / 'saved-reader.private.json'
    if args.comparison:
        input_paths['comparison'] = args.comparison.resolve()
        inputs['comparison'] = input_paths['comparison'].read_bytes()
        comparison = json.loads(inputs['comparison'])
        assert comparison['schema_version'] == 'analysis_heterogeneous_scope_compare.v1'
        assert [case['id'] for case in comparison['cases']] == IDS
        assert comparison['generating_api_commit'] == pack['api_commit']
        assert comparison['generating_api_hashes'] == pack['api_hashes']
        assert all(comparison[key] == 0 for key in ('model_calls', 'model_loads', 'updates', 'db_calls'))
        assert comparison['raw_unchanged'] is True
        assert set(comparison['api_hashes']) == set(pack['api_hashes'])
        commit = comparison['api_commit']
        assert len(commit) == 40 and all(char in '0123456789abcdef' for char in commit)
        for original, compared in zip(result['cases'], comparison['cases']):
            for key in ('id', 'row', 'messages', 'request_ref', 'source_guard', 'response'):
                assert compared[key] == original[key], 'comparison_changed_saved_input:' + key
        source_identity, cases = comparison, comparison['cases']
        destination = root / ('saved-reader-' + commit[:12] + '.private.json')
    assert not destination.exists(), 'new_saved_reader_output_required'

    def check_sources():
        assert subprocess.check_output(['git', '-C', str(api), 'rev-parse', 'HEAD'],
            text=True).strip() == source_identity['api_commit'], 'api_commit_changed'
        assert not subprocess.check_output(['git', '-C', str(api), 'status', '--porcelain',
            '--untracked-files=no'], text=True).strip(), 'tracked_api_dirty'
        for path, expected in source_identity['api_hashes'].items():
            assert digest((api / path).read_bytes()) == expected, 'api_source_changed:' + path

    check_sources()
    sys.path[:0] = [str(api / 'ai/services/ai_inference')]
    import analysis_cumulative_service as service
    import analysis_model_source as model_source
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import (
        semantic_admission as admission, intent_compiler as compiler,
        observed_route_realizer as author)
    now = datetime.now(timezone(timedelta(hours=9)))
    month, diagnostic_time = now.date().replace(day=1).isoformat(), now.isoformat()
    checked = []
    for case in cases:
        owner, snapshot, saved = case['row']['owner'], case['row']['snapshot'], case['cumulative']
        assert saved['status'] in {'GENERATED_PRIVATE_ONLY', 'REJECTED', 'UNSUPPORTED'}
        item = dict(id=case['id'], cumulative=deepcopy({key: saved[key] for key in
            ('status', 'reason', 'error_type', 'counts') if key in saved}),
            candidate=deepcopy({key: case['candidate'][key] for key in
                ('status', 'reason', 'error_type', 'counts') if key in case['candidate']}),
            response_sha256=case['response']['raw_sha256'], source_records=len(snapshot['members']),
            read_calls=0, model_calls=0, db_calls=0)
        if saved['status'] != 'GENERATED_PRIVATE_ONLY':
            item['saved_reader_status'] = 'NO_GENERATED_PROJECTION_TO_READ'
            checked.append(item)
            continue
        projection, coverage = deepcopy(saved['projection']), deepcopy(saved['counts'])
        text = saved['text']['text']
        assert saved['text']['projection_of'] == projection['projection_of']
        assert saved['text']['accessibility_linear_order'] == projection['accessibility_linear_order']
        report_id = str(UUID(projection['projection_of'].split('@', 1)[0].removeprefix('artifact:')))
        current = dict(id=report_id, source_profile=service.PROFILE, report_mode='standard',
            period_start=snapshot['period_start'], period_end=snapshot['period_end'],
            generated_at=diagnostic_time, title='Synthetic heterogeneous model saved-reader diagnostic',
            snapshot_month=None, captured_at=None, content_text=text,
            content_json=dict(report_mode='standard', watashiMap=projection, map_context=coverage))
        monthly = dict(deepcopy(current), snapshot_month=month, captured_at=diagnostic_time)
        calls = []

        async def rpc(name, payload):
            assert name == 'analysis_cumulative_read', 'only_mock_saved_read_allowed'
            assert payload['p_user_id'] == owner and payload['p_id'] in {None, report_id}
            calls.append(deepcopy(payload))
            return dict(items=[deepcopy(monthly if payload['p_history'] else current)],
                subscription_tier='free', matched=True, history_limit=2)

        acquisition = AsyncMock(side_effect=AssertionError('saved_reader_model_acquisition_forbidden'))

        def block(*_args, **_kwargs):
            raise AssertionError('generation_forbidden_during_saved_read')

        async def read():
            direct = [await service.read_maps(owner, report_id=report_id),
                await service.read_maps(owner, report_id=report_id, history=True, month=month)]
            ensured = [await service.ensure_map(owner, ensure=False, model_source=acquisition),
                await service.ensure_map(owner, ensure=False, monthly=True, model_source=acquisition)]
            for value in direct:
                row, = value['items']
                assert row['id'] == report_id and row['content_text'] == text
                assert row['content_json']['watashiMap'] == projection
                assert row['content_json']['map_context'] == coverage
            for value in ensured:
                assert value['report_id'] == report_id and not value['refreshed']
                assert value['meta'] == projection and value['content_text'] == text
                assert value['map_context'] == coverage and value['has_visible_content']
            assert ensured[0]['snapshot_month'] is None and ensured[1]['snapshot_month'] == month
            assert ensured[1]['history_saved'] is True

        with ExitStack() as stack:
            stack.enter_context(patch.object(service, '_rpc', side_effect=rpc))
            for obj, name in ((service, '_model_response'), (service, 'build_cumulative_map'),
                    (model_source, 'application_analysis_model_source'),
                    (MeaningExperienceEngine, 'generate'),
                    (compiler, 'compile_observed_graph'), (compiler, 'compile_analysis_unit_candidates'),
                    (author, 'realize_observed_graph'), (author, 'realize_analysis_unit_candidates'),
                    (admission, 'generate_analysis_model_observed_actions'),
                    (admission, 'generate_analysis_model_quoted_parent_units')):
                stack.enter_context(patch.object(obj, name, side_effect=block))
            asyncio.run(read())
        acquisition.assert_not_awaited()
        assert len(calls) == 4 and [c['p_history'] for c in calls] == [False, True, False, True]
        assert saved['projection'] == projection and saved['counts'] == coverage and saved['text']['text'] == text
        item.update(saved_reader_status='EXACT_CURRENT_MONTHLY_READ', read_calls=4,
            projection_text_coverage_id_exact=True)
        checked.append(item)
    check_sources()
    assert all(input_paths[name].read_bytes() == raw for name, raw in inputs.items()), 'input_bytes_changed'
    output = dict(schema_version=('analysis_heterogeneous_scope_comparison_saved_reader_check.v1'
        if args.comparison else 'analysis_heterogeneous_scope_saved_reader_check.v1'),
        input_kind='comparison' if args.comparison else 'original_model_result',
        api_commit=source_identity['api_commit'], api_hashes=source_identity['api_hashes'],
        generating_api_commit=pack['api_commit'], generating_api_hashes=pack['api_hashes'],
        input_sha256={name: digest(raw) for name, raw in inputs.items()}, input_bytes_unchanged=True,
        cases=checked, fixture_count=len(checked),
        synthetic_rpc_reads=sum(case['read_calls'] for case in checked),
        model_calls=0, model_loads=0, updates=0, db_calls=0, normal_adoption=False,
        scope='Real read_maps/ensure_map(ensure=False), current/monthly; mock RPC only.',
        limitations=['Synthetic generated_at/captured_at/month metadata, not actual DB persistence.',
            'Projection DTO read, not private artifact graph restoration.',
            'Static _text_from_visual validation remains active; author generation entrypoints are forbidden.'])
    with destination.open('x', encoding='utf-8') as stream:
        stream.write(canonical(output) + '\n')
    print(canonical(dict(fixture_count=len(checked), synthetic_rpc_reads=output['synthetic_rpc_reads'],
        output_sha256=digest(destination.read_bytes()),
        cases=[dict(id=case['id'], status=case['cumulative']['status'], read_calls=case['read_calls'])
            for case in checked])))


if __name__ == '__main__':
    main()
