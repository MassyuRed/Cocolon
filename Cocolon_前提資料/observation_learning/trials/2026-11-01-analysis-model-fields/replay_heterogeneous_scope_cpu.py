"""Replay the exact ten saved synthetic CPU packets through a changed consumer.

No fixture, prompt, packet, model response, or teacher is created here. The input
report remains immutable. The real candidate, compiler, map, saved-candidate
reload, and current/monthly projection readers run offline. Saved-reader RPC
rows and their date/month metadata are synthetic; no database is contacted.
Every failure is saved and makes the process fail after the report is written.
"""
from __future__ import annotations

import argparse
import asyncio
from contextlib import ExitStack
from copy import deepcopy
from dataclasses import asdict, replace
from datetime import datetime, timedelta, timezone
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import time
import traceback
from unittest.mock import AsyncMock, patch
from uuid import UUID


BASELINE_SHA256 = '410d2cdbf1d5c07fa0b4c47ecae3ec7f165a1193164285bc000e110c859d2cde'
IDS = tuple(f'HC{i:02d}' for i in range(1, 11))
OWNER = str(UUID(int=1))
PROFILE = 'selected_material.v10'
EXPECTED = {
    'HC06': dict(mapped_count=1, unparsed_count=0, nodes=2,
        wish=('私は計画を続けたい', 'positive', 'current_input')),
    'HC07': dict(mapped_count=1, unparsed_count=0, nodes=2,
        wish=('私は計画を続けたくない', 'negative', 'current_input')),
    'HC08': dict(mapped_count=1, unparsed_count=0, nodes=2,
        wish=('私は計画を続けたくなかった', 'negative', 'past')),
    'HC09': dict(mapped_count=1, unparsed_count=0, nodes=2,
        wish=('私は調査を続けたい', 'positive', 'current_input')),
    'HC10': dict(mapped_count=2, unparsed_count=0, nodes=4,
        wish=('私は計画を続けたい', 'positive', 'current_input')),
}


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True,
        separators=(',', ':'), allow_nan=False)


def digest(value):
    return hashlib.sha256(canonical(value).encode('utf-8')).hexdigest()


def same_json(left, right):
    # Dataclass tuples become JSON lists in the immutable prior report.
    return canonical(left) == canonical(right)


def sha_bytes(raw):
    return hashlib.sha256(raw).hexdigest()


def sha(path):
    return sha_bytes(Path(path).read_bytes())


def without_artifact_id(value):
    # Each offline reconstruction owns a fresh artifact UUID. This is the only
    # public projection field excluded from baseline comparison.
    return {key: item for key, item in value.items() if key != 'projection_of'}


def without_node_ref(node):
    # Inserting a newly admitted node can renumber the old node. Its proposition,
    # complete source evidence, categories and record identity must stay exact.
    return {key: item for key, item in node.items() if key != 'node_ref'}


def forbidden(*_args, **_kwargs):
    raise AssertionError('offline_replay_generation_or_database_forbidden')


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument('--api', type=Path, required=True)
    cli.add_argument('--prior-json', type=Path, required=True)
    cli.add_argument('--output', type=Path, required=True)
    args = cli.parse_args()
    api, prior_path, output = (p.resolve() for p in
        (args.api, args.prior_json, args.output))
    assert not output.exists(), 'new_output_required'
    prior_bytes = prior_path.read_bytes()
    assert sha_bytes(prior_bytes) == BASELINE_SHA256, 'exact_baseline_report_required'
    prior = json.loads(prior_bytes)
    assert prior['schema_version'] == 'analysis_heterogeneous_scope_cpu.v1'
    assert prior['profile'] == PROFILE and tuple(c['id'] for c in prior['cases']) == IDS
    assert all(prior[key] == 0 for key in
        ('model_loads', 'model_calls', 'tokenizer_calls', 'updates', 'db_calls'))
    paths = tuple(prior['api_source_sha256'])
    before = {path: sha(api / path) for path in paths}
    head = subprocess.check_output(['git', '-C', str(api), 'rev-parse', 'HEAD'],
        text=True).strip()
    dirty = subprocess.check_output(['git', '-C', str(api), 'status', '--porcelain',
        '--untracked-files=no'], text=True).splitlines()
    sys.path[:0] = [str(api / 'ai/services/ai_inference')]
    import analysis_cumulative_service as service
    import analysis_model_source as model_source
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import (
        semantic_admission as admission, intent_compiler as compiler,
        observed_route_realizer as author)
    from cocolon_meaning_experience_engine.cores.analysis.source_adapter import (
        freeze_analysis_sources, source_field_text)

    def save():
        output.parent.mkdir(parents=True, exist_ok=True)
        temporary = output.with_name(output.name + '.tmp')
        temporary.write_text(canonical(report) + '\n', encoding='utf-8')
        temporary.replace(output)

    def saved_reader_check(snapshot, saved):
        projection, text, coverage = (deepcopy(saved[key]) for key in
            ('projection', 'text', 'coverage'))
        assert text['projection_of'] == projection['projection_of']
        assert text['accessibility_linear_order'] == projection['accessibility_linear_order']
        report_id = str(UUID(projection['projection_of'].split('@', 1)[0].removeprefix('artifact:')))
        now = datetime.now(timezone(timedelta(hours=9)))
        month, diagnostic_time = now.date().replace(day=1).isoformat(), now.isoformat()
        current = dict(id=report_id, source_profile=service.PROFILE, report_mode='standard',
            period_start=snapshot['period_start'], period_end=snapshot['period_end'],
            generated_at=diagnostic_time, title='Synthetic heterogeneous CPU saved-reader diagnostic',
            snapshot_month=None, captured_at=None, content_text=text['text'],
            content_json=dict(report_mode='standard', watashiMap=projection, map_context=coverage))
        monthly = dict(deepcopy(current), snapshot_month=month, captured_at=diagnostic_time)
        calls, returned = [], []

        async def rpc(name, payload):
            assert name == 'analysis_cumulative_read', 'only_mock_saved_read_allowed'
            assert payload['p_user_id'] == OWNER and payload['p_id'] in {None, report_id}
            calls.append(deepcopy(payload))
            return dict(items=[deepcopy(monthly if payload['p_history'] else current)],
                subscription_tier='free', matched=True, history_limit=2)

        acquisition = AsyncMock(side_effect=AssertionError('saved_reader_model_acquisition_forbidden'))

        async def read():
            direct = [await service.read_maps(OWNER, report_id=report_id),
                await service.read_maps(OWNER, report_id=report_id, history=True, month=month)]
            ensured = [await service.ensure_map(OWNER, ensure=False, model_source=acquisition),
                await service.ensure_map(OWNER, ensure=False, monthly=True, model_source=acquisition)]
            for value in direct:
                row, = value['items']
                assert row['id'] == report_id and row['content_text'] == text['text']
                assert row['content_json']['watashiMap'] == projection
                assert row['content_json']['map_context'] == coverage
            for value in ensured:
                assert value['report_id'] == report_id and not value['refreshed']
                assert value['meta'] == projection and value['content_text'] == text['text']
                assert value['map_context'] == coverage and value['has_visible_content']
            assert ensured[0]['snapshot_month'] is None and ensured[1]['snapshot_month'] == month
            assert ensured[1]['history_saved'] is True
            returned.extend([dict(kind='read_current', value=direct[0]),
                dict(kind='read_monthly', value=direct[1]),
                dict(kind='ensure_current', value=ensured[0]),
                dict(kind='ensure_monthly', value=ensured[1])])

        with ExitStack() as stack:
            stack.enter_context(patch.object(service, '_rpc', side_effect=rpc))
            for obj, name in ((service, '_model_response'), (service, 'build_cumulative_map'),
                    (model_source, 'application_analysis_model_source'),
                    (MeaningExperienceEngine, 'generate'),
                    (compiler, 'compile_observed_graph'), (compiler, 'compile_analysis_unit_candidates'),
                    (author, 'realize_observed_graph'), (author, 'realize_analysis_unit_candidates'),
                    (admission, 'generate_analysis_model_observed_actions'),
                    (admission, 'generate_analysis_model_quoted_parent_units')):
                stack.enter_context(patch.object(obj, name, side_effect=forbidden))
            asyncio.run(read())
        acquisition.assert_not_awaited()
        assert len(calls) == 4 and [c['p_history'] for c in calls] == [False, True, False, True]
        assert saved['projection'] == projection and saved['text'] == text and saved['coverage'] == coverage
        return dict(status='EXACT_SAVED_PROJECTION_READ', synthetic_rpc_calls=calls,
            returned=returned, artifact_graph_restored=False, model_calls=0, db_calls=0)

    def compare(case, new):
        old = case
        if case['id'] in IDS[:5]:
            checks = dict(status_equal=new.get('status') == old['status'],
                counts_equal=new.get('coverage') == old['coverage'],
                candidate_graph_equal=same_json(new.get('candidate', {}).get('graph'), old['candidate']['graph']),
                candidate_counts_equal=new.get('candidate', {}).get('coverage') == old['candidate']['coverage'],
                graph_equal=same_json(new.get('graph'), old['graph']),
                text_equal=same_json(without_artifact_id(new.get('text', {})), without_artifact_id(old['text'])),
                projection_equal=same_json(without_artifact_id(new.get('projection', {})), without_artifact_id(old['projection'])))
            return dict(scope='HC01-HC05 unchanged consumer behavior', checks=checks,
                passed=all(checks.values()))
        expected = EXPECTED[case['id']]
        graph, coverage = new.get('graph', {}), new.get('coverage', {})
        nodes = graph.get('nodes', [])
        old_nodes = old.get('graph', {}).get('nodes', [])
        preserved = all(canonical(without_node_ref(node)) in [canonical(without_node_ref(n)) for n in nodes]
            for node in old_nodes)
        wish = expected['wish']
        matching = [node for node in nodes if node['visible_label'] == wish[0]]
        wish_exact = len(matching) == 1 and all(
            (node['node_kind'], node['modality'], node['polarity'], node['temporal_scope'])
            == ('ATTENTION_OR_THOUGHT', 'wish', wish[1], wish[2]) for node in matching)
        checks = dict(generated=new.get('status') == 'GENERATED_SYNTHETIC_ONLY',
            mapped_count=coverage.get('mapped_count') == expected['mapped_count'],
            unparsed_count=coverage.get('unparsed_count') == expected['unparsed_count'],
            node_count=len(nodes) == expected['nodes'], old_nodes_evidence_preserved=preserved,
            wish_semantics_exact=wish_exact,
            candidate_graph_equal=same_json(new.get('candidate', {}).get('graph'), old['candidate']['graph']),
            candidate_counts_equal=new.get('candidate', {}).get('coverage') == old['candidate']['coverage'])
        # Every new record is mapped, every original/answer field contributes its
        # one written clause, and a wish never becomes an execution fact.
        snapshot = case['snapshot']
        source_records = {member['original']['id'] for member in snapshot['members']}
        checks['all_records_preserved'] = {ref for node in nodes for ref in node['record_refs']} == source_records
        checks['no_cross_record_merge'] = all(len(node['record_refs']) == 1 for node in nodes)
        checks['no_unwritten_edges'] = same_json(graph.get('edges'), [])
        checks['no_source_scope_gap'] = not any(gap['missing_scope'] == 'SOURCE_SCOPE'
            for gap in graph.get('unknown_gaps', []))
        written = [('私は資料を見た', 'ACTION_OR_NONACTION', 'fact', 'positive', 'past', '見る')]
        if case['id'] == 'HC09':
            written = [('私は写真を記録した', 'ACTION_OR_NONACTION', 'fact', 'positive', 'past', '記録する')]
        expected_claims = [(*claim, 0) for claim in written]
        expected_claims.append((wish[0], 'ATTENTION_OR_THOUGHT', 'wish', wish[1], wish[2], '続ける', 0))
        if case['id'] == 'HC10':
            expected_claims = [
                ('私は資料を調べた', 'ACTION_OR_NONACTION', 'fact', 'positive', 'past', '調べる', 0),
                ('私は調査を続けたい', 'ATTENTION_OR_THOUGHT', 'wish', 'positive', 'current_input', '続ける', 0),
                ('私は資料を見た', 'ACTION_OR_NONACTION', 'fact', 'positive', 'past', '見る', 1),
                (wish[0], 'ATTENTION_OR_THOUGHT', 'wish', wish[1], wish[2], '続ける', 1)]
        claims = []
        for label, kind, modality, polarity, temporal, lemma, index in expected_claims:
            original = snapshot['members'][index]['original']
            claims.append(dict(visible_label=label, node_kind=kind, modality=modality,
                polarity=polarity, temporal_scope=temporal, actor='SELF', predicate_lemma=lemma,
                record_refs=[original['id']], selected_categories=sorted(original['category']),
                selected_category_context=True))
        actual_claims = [dict(visible_label=node['visible_label'], node_kind=node['node_kind'],
            modality=node['modality'], polarity=node['polarity'], temporal_scope=node['temporal_scope'],
            actor=node['proposition']['actor'], predicate_lemma=node['proposition']['predicate_lemma'],
            record_refs=node['record_refs'], selected_categories=node['selected_categories'],
            selected_category_context=node['selected_category_context']) for node in nodes]
        checks['exact_written_claims_and_category_parent'] = (
            sorted(map(canonical, actual_claims)) == sorted(map(canonical, claims)))
        return dict(scope='HC06-HC10 explicitly expected consumer changes', expected=expected,
            expected_claims=claims, checks=checks, passed=all(checks.values()))

    started = time.monotonic()
    report = dict(schema_version='analysis_heterogeneous_scope_same_packet_replay.v1',
        status='RUNNING', scope='Exact immutable synthetic CPU packets; no real model inference or DB persistence.',
        prior_report_sha256=BASELINE_SHA256, prior_api_commit=prior['api_commit'],
        prior_api_source_sha256=prior['api_source_sha256'], api_commit=head,
        api_source_sha256=before, api_tracked_status=dirty, runner_sha256=sha(__file__),
        profile=PROFILE, model_loads=0, model_calls=0, tokenizer_calls=0, updates=0,
        db_calls=0, normal_adoption=False, cases=[],
        limitations=['Original CPU baseline did not save a full request DTO; its request_ref binds the restored source set.',
            'Saved-reader dates/month metadata and RPC rows are synthetic; no live persistence is claimed.',
            'Saved reader restores the public projection DTO, not the private artifact graph.',
            'Only projection_of artifact UUID is excluded from unchanged public projection comparison.'])
    save()
    for case in prior['cases']:
        new, failures = {}, []
        item = dict(id=case['id'], prior=deepcopy(case), new=new, failures=failures)
        report['cases'].append(item)
        snapshot = deepcopy(case['snapshot'])
        response = admission.AnalysisModelQuotedParentUnitsResponse(**case['synthetic_response'])
        raw_bytes = response.raw.encode('utf-8')
        try:
            prepared = service.prepare_cumulative_category_units(OWNER, snapshot, prompt_version=PROFILE)
            assert prepared.request == replace(service._cumulative_model_request(OWNER, snapshot),
                selected_category_context=True), 'whole_request_differed'
            assert prepared.messages() == case['messages'], 'messages_differed'
            assert prepared.request_ref == case['request_ref'] == response.request_ref, 'request_identity_differed'
            assert prepared.source_guard == case['source_guard'] == snapshot['guard'], 'source_guard_differed'
            assert digest(prepared.messages()) == response.messages_sha256, 'messages_digest_differed'
            assert sha_bytes(raw_bytes) == response.raw_sha256 and response.finish_reason == 'stop', 'response_differed'
            new.update(snapshot=snapshot, request=asdict(prepared.request), request_sha256=digest(asdict(prepared.request)),
                messages=prepared.messages(), request_ref=prepared.request_ref, source_guard=prepared.source_guard,
                synthetic_response=asdict(response), same_saved_packet_bytes=True)
            model_input = replace(prepared, response=response)
            with ExitStack() as stack:
                for obj, name in ((service, '_rpc'), (service, '_model_response'),
                        (model_source, 'application_analysis_model_source')):
                    stack.enter_context(patch.object(obj, name, side_effect=forbidden))
                candidate, candidate_counts = service.build_cumulative_quoted_parent_candidates(
                    OWNER, snapshot, model_input=model_input)
                storage = service.serialize_cumulative_quoted_parent_candidates(OWNER, snapshot,
                    model_input=model_input, artifact=candidate, coverage=candidate_counts)
                new['candidate'] = dict(status='PARSED_SYNTHETIC_CANDIDATE', coverage=candidate_counts,
                    graph=asdict(candidate.graph), artifact=asdict(candidate), storage=storage,
                    storage_sha256=sha_bytes(storage.encode('utf-8')))
                with ExitStack() as reload_stack:
                    for obj, name in ((MeaningExperienceEngine, 'generate'),
                            (compiler, 'compile_analysis_unit_candidates'),
                            (author, 'realize_analysis_unit_candidates'),
                            (admission, 'generate_analysis_model_quoted_parent_units')):
                        reload_stack.enter_context(patch.object(obj, name, side_effect=forbidden))
                    restored, restored_counts = service.reload_cumulative_quoted_parent_candidates(
                        OWNER, snapshot, storage)
                assert restored == candidate and restored_counts == candidate_counts, 'candidate_reload_differed'
                new['candidate']['saved_non_generation_reload_exact'] = True
                artifact, counts = service.build_cumulative_map(OWNER, snapshot, model_input=model_input)
                new.update(coverage=counts,
                    status='UNSUPPORTED' if artifact is None else 'GENERATED_SYNTHETIC_ONLY')
                if artifact is not None:
                    new.update(graph=asdict(artifact.graph),
                        text=artifact.safe_text_projection(authenticated_owner_scope=OWNER),
                        projection=artifact.safe_projection(authenticated_owner_scope=OWNER))
                    frozen = freeze_analysis_sources(prepared.request)
                    sources = {source.envelope.envelope_id: source for source in frozen.sources}
                    for node in artifact.graph.nodes:
                        for evidence in node.evidence_refs:
                            source = sources[evidence.source_envelope_id]
                            assert source.record_ref in node.record_refs
                            field = source_field_text(source, evidence.field_path)
                            literal = field[evidence.scalar_start:evidence.scalar_end]
                            assert sha_bytes(field.encode('utf-8')) == evidence.field_sha256
                            assert sha_bytes(literal.encode('utf-8')) == evidence.literal_sha256
                            assert source.envelope.raw_utf8[evidence.utf8_start:evidence.utf8_end].decode('utf-8') == literal
                    assert not artifact.graph.edges, 'unwritten_edges'
                    new['source_evidence_verified'] = True
            if new['status'] != 'UNSUPPORTED':
                new['saved_reader'] = saved_reader_check(snapshot, new)
        except Exception as error:
            failures.append(dict(error_type=type(error).__name__, reason=str(error), traceback=traceback.format_exc()))
            new.setdefault('status', 'FAILED')
        try:
            assert snapshot == case['snapshot'], 'snapshot_mutated'
            assert asdict(response) == case['synthetic_response'], 'response_mutated'
            assert response.raw.encode('utf-8') == raw_bytes, 'raw_bytes_mutated'
            item['comparison'] = compare(case, new)
            assert item['comparison']['passed'], 'baseline_or_expected_change_comparison_failed'
        except Exception as error:
            failures.append(dict(error_type=type(error).__name__, reason=str(error), traceback=traceback.format_exc()))
        item['passed'] = not failures and item.get('comparison', {}).get('passed', False)
        save()
    unchanged = before == {path: sha(api / path) for path in paths}
    prior_unchanged = prior_path.read_bytes() == prior_bytes
    report.update(seconds=time.monotonic() - started, source_unchanged=unchanged,
        prior_report_unchanged=prior_unchanged, fixture_count=len(report['cases']),
        passed=sum(case['passed'] for case in report['cases']))
    report['status'] = ('COMPLETE_SYNTHETIC_REPLAY_PENDING_REVIEW' if unchanged and prior_unchanged
        and report['passed'] == len(IDS) else 'FAILED_REPLAY_REVIEW_REQUIRED')
    save()
    print(canonical(dict(status=report['status'], output_sha256=sha(output),
        fixture_count=report['fixture_count'], passed=report['passed'],
        cases=[dict(id=case['id'], status=case['new'].get('status'),
            coverage=case['new'].get('coverage'), nodes=len(case['new'].get('graph', {}).get('nodes', [])),
            passed=case['passed'], errors=[f['error_type'] for f in case['failures']]) for case in report['cases']])))
    assert report['status'] == 'COMPLETE_SYNTHETIC_REPLAY_PENDING_REVIEW', 'replay_failed_see_saved_report'


if __name__ == '__main__':
    main()
