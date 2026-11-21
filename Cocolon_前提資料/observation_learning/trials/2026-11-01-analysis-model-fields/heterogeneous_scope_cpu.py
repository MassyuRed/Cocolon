"""One disposable synthetic CPU diagnostic of heterogeneous source binding.

The complete snapshots below are independently authored synthetic fixtures.
Packets are explicitly constructed, not model generations, saved model raw,
training examples, or repaired responses. The real prepare/candidate/map owners
remain unchanged. This script calls no RPC and loads no model or tokenizer.
"""
from __future__ import annotations

import argparse
from copy import deepcopy
from dataclasses import asdict, replace
import hashlib
import importlib.metadata
import json
from pathlib import Path
import platform
import subprocess
import sys
import time
from unittest.mock import patch
from uuid import UUID


PROFILE = 'selected_material.v10'
OWNER = str(UUID(int=1))
NOW = '2026-11-06T08:00:00+00:00'
SOURCE_PATHS = (
    'ai/services/ai_inference/analysis_cumulative_service.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/source_adapter.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py',
)


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True,
        separators=(',', ':'), allow_nan=False)


def digest(value):
    return hashlib.sha256(canonical(value).encode()).hexdigest()


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def clause(text, kind, *, actor='私', negative=None):
    qualifiers = [] if actor is None else [dict(kind='EXPLICIT_ACTOR', quote=actor)]
    if negative is not None:
        qualifiers.append(dict(kind='NEGATION', quote=negative))
    return dict(quote=text, node_kind=kind, parent_quote=None,
        scope_role=None, qualifiers=qualifiers)


def action(text):
    return clause(text, 'ACTION_OR_NONACTION')


def wish(text, *, negative=None):
    return clause(text, 'ATTENTION_OR_THOUGHT', negative=negative)


def record(memo_units, *, category, action_units=(), answer_units=None):
    return dict(memo_units=memo_units, action_units=action_units,
        category=category, answer_units=answer_units)


def fixtures():
    """New complete compositions, rather than private-baseline rearrangements."""
    common = [action('私は資料を調べた'), wish('私は調査を続けたい')]
    parent = [action('私は資料を見た')]
    return [
        dict(id='HC01', purpose='Three distinct contents and categories; original memo/memo_action.',
            records=[
                record([action('私は帳簿を調べた'), wish('私は記録を続けたい')], category=['仕事']),
                record([action('私は写真を見た')], category=['生活'],
                    action_units=[wish('私は日記を書きたかった')]),
                record([action('私は模型を作った'),
                    wish('私は模型を作りたくない', negative='作りたくない')], category=['趣味'])],
            expected=dict(mapped_count=3, unparsed_count=0, nodes=6)),
        dict(id='HC02', purpose='Same written meaning and category across two records.',
            records=[record(common, category=['仕事']), record(common, category=['仕事'])],
            expected=dict(mapped_count=2, unparsed_count=0, nodes=2, every_node_records=2)),
        dict(id='HC03', purpose='Same written meaning across different category sets.',
            records=[record(common, category=['仕事']), record(common, category=['生活'])],
            expected=dict(mapped_count=2, unparsed_count=0, nodes=4, every_node_records=1)),
        dict(id='HC04', purpose='Equivalent category sets merge; a strict subset stays separate.',
            records=[record(common, category=['生活', '仕事']),
                record(common, category=['仕事', '生活']), record(common, category=['仕事'])],
            expected=dict(mapped_count=3, unparsed_count=0, nodes=4,
                node_record_cardinalities=[1, 1, 2, 2])),
        dict(id='HC05', purpose='Ordinary answer action has its own envelope and inherited categories.',
            records=[record(parent, category=['生活', '仕事'],
                answer_units=[action('私は写真を記録した')])],
            expected=dict(mapped_count=1, unparsed_count=0, nodes=2, every_node_records=1)),
        dict(id='HC06', purpose='Current affirmative answer wish remains explicitly unsupported.',
            records=[record(parent, category=['仕事'],
                answer_units=[wish('私は計画を続けたい')])],
            expected=dict(mapped_count=0, unparsed_count=1, nodes=0)),
        dict(id='HC07', purpose='Current negative answer wish remains explicitly unsupported.',
            records=[record(parent, category=['生活'],
                answer_units=[wish('私は計画を続けたくない', negative='続けたくない')])],
            expected=dict(mapped_count=0, unparsed_count=1, nodes=0)),
        dict(id='HC08', purpose='Past negative answer wish remains explicitly unsupported.',
            records=[record(parent, category=['趣味'],
                answer_units=[wish('私は計画を続けたくなかった', negative='続けたくなかった')])],
            expected=dict(mapped_count=0, unparsed_count=1, nodes=0)),
        dict(id='HC09', purpose='Original wish and ordinary answer action remain different sources.',
            records=[record([wish('私は調査を続けたい')], category=['仕事'],
                answer_units=[action('私は写真を記録した')])],
            expected=dict(mapped_count=1, unparsed_count=0, nodes=2, every_node_records=1)),
        dict(id='HC10', purpose='Different records preserve the supported record when one answer wish is unsupported.',
            records=[record(common, category=['仕事']), record(parent, category=['生活'],
                answer_units=[wish('私は計画を続けたい')])],
            expected=dict(mapped_count=1, unparsed_count=1, nodes=2, every_node_records=1)),
    ]


def add_answer(saved, text, number):
    """Construct the existing synthetic saved-question/answer envelope shape."""
    from cocolon_meaning_experience_engine.contracts import GenerationRequest
    from cocolon_meaning_experience_engine.source_kernel import freeze_text_source
    from cocolon_meaning_experience_engine.emlis_thread_contracts import (
        EmlisClarificationV1, EmlisQuestionDecisionV1, SupplementalAnswerSource)
    from emlis_ai_current_input_bundle import build_emlis_current_input_bundle
    saved = deepcopy(saved)
    source = dict(saved['original'])
    source['created_at'] += '+00:00'
    tid, aid = str(UUID(int=7000 + number)), str(UUID(int=9000 + number))
    qid = 'synthetic-heterogeneous-question-' + str(number)
    request = GenerationRequest('synthetic-heterogeneous-' + str(number),
        build_emlis_current_input_bundle(source), source['id'])
    ref = freeze_text_source(request).envelope.envelope_id
    question = EmlisClarificationV1(qid, request.request_id, tid, ref,
        EmlisQuestionDecisionV1('ASK', target_ref='synthetic-target'),
        'QUESTION_IS_NOT_ANALYSIS_SOURCE')
    answer = SupplementalAnswerSource(aid, tid, qid, 1, ref, text, NOW)
    saved['thread'] = dict(id=tid, user_id=OWNER, original_emotion_id=source['id'],
        source_snapshot=deepcopy(saved['original']), revision=3, issued_count=1,
        data=dict(runtime_profile='q2.free.one_round.v1', original_source_ref=ref))
    saved['events'] = [
        dict(id=str(UUID(int=8000+number)), thread_id=tid, kind='QUESTION',
            question_id=qid, round_index=1, payload=asdict(question)),
        dict(id=aid, thread_id=tid, kind='ANSWER', question_id=qid,
            round_index=1, payload=dict(source=asdict(answer))),
        dict(id=str(UUID(int=10000+number)), thread_id=tid, kind='OBSERVATION',
            payload=dict(text='GENERATED_BODY_IS_NOT_ANALYSIS_SOURCE')),
    ]
    return saved


def source_fixture(case, case_number):
    members, planned = [], []
    for index, spec in enumerate(case['records'], 1):
        number = case_number * 10 + index
        def text(units):
            return ''.join(unit['quote'] + '。' for unit in units)
        original = dict(id=str(UUID(int=1000+number)),
            created_at=f'2026-10-{index:02d}T01:00:00', memo=text(spec['memo_units']),
            memo_action=text(spec['action_units']), category=list(spec['category']),
            emotions=['平穏'], emotion_details=[dict(type='平穏', strength='medium')])
        member = dict(original=original, thread=None, events=[])
        planned.extend(deepcopy(spec[field]) for field in ('memo_units', 'action_units') if spec[field])
        if spec['answer_units'] is not None:
            member = add_answer(member, text(spec['answer_units']), number)
            planned.append(deepcopy(spec['answer_units']))
        members.append(member)
    snapshot = dict(tier='free', now=NOW, members=members,
        period_start='2026-10-01T00:00:00+00:00', period_end=NOW)
    snapshot['guard'] = 'analysis-db-cumulative-v1:' + digest(snapshot)
    return snapshot, planned


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument('--api', type=Path, required=True)
    cli.add_argument('--output', type=Path, required=True)
    cli.add_argument('--expected-api-commit')
    args = cli.parse_args()
    api, output = args.api.resolve(), args.output.resolve()
    assert not output.exists(), 'new_output_required'
    head = subprocess.check_output(['git', '-C', str(api), 'rev-parse', 'HEAD'], text=True).strip()
    if args.expected_api_commit:
        assert head == args.expected_api_commit, 'unexpected_api_commit'
    before = {path: sha(api / path) for path in SOURCE_PATHS}
    sys.path.insert(0, str(api / 'ai/services/ai_inference'))
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as admission
    from cocolon_meaning_experience_engine.cores.analysis.source_adapter import (
        AnalysisSourceError, freeze_analysis_sources, source_field_text)
    started = time.monotonic()
    report = dict(schema_version='analysis_heterogeneous_scope_cpu.v1',
        scope='Independently synthetic CPU packets; not real model output or DB persistence.',
        api_commit=head, api_source_sha256=before, profile=PROFILE,
        runtime=dict(python=platform.python_version(), implementation=platform.python_implementation(),
            packages={name: importlib.metadata.version(name)
                for name in ('pytest', 'fastapi', 'pydantic', 'httpx')}),
        model_loads=0, model_calls=0, tokenizer_calls=0, updates=0,
        db_calls=0, normal_adoption=False, cases=[])
    for number, spec in enumerate(fixtures(), 1):
        snapshot, planned = source_fixture(spec, number)
        unchanged = deepcopy(snapshot)
        prepared = service.prepare_cumulative_category_units(OWNER, snapshot, prompt_version=PROFILE)
        messages = prepared.messages()
        fields = json.loads(messages[1]['content'])['fields']
        assert len(fields) == len(planned)
        for field, units in zip(fields, planned):
            assert field['text'] == ''.join(unit['quote']+'。' for unit in units)
        packet = dict(fields=[dict(field=field['field'], units=units)
            for field, units in zip(fields, planned)])
        raw = canonical(packet)
        response = admission.AnalysisModelQuotedParentUnitsResponse(prepared.request_ref,
            digest(messages), hashlib.sha256(raw.encode()).hexdigest(), 'stop', raw)
        model_input = replace(prepared, response=response)
        item = dict(id=spec['id'], purpose=spec['purpose'], snapshot=snapshot,
            messages=messages, request_ref=prepared.request_ref,
            source_guard=prepared.source_guard, synthetic_response=asdict(response),
            expected=spec['expected'])
        with patch.object(service, '_rpc', side_effect=AssertionError('CPU diagnostic must not use RPC')):
            candidate, candidate_counts = service.build_cumulative_quoted_parent_candidates(
                OWNER, snapshot, model_input=model_input)
            assert model_input.response.raw == raw and model_input.response.raw_sha256 == sha_bytes(raw)
            item['candidate'] = dict(status='PARSED_SYNTHETIC_CANDIDATE',
                coverage=candidate_counts, graph=asdict(candidate.graph))
            try:
                artifact, counts = service.build_cumulative_map(OWNER, snapshot, model_input=model_input)
                item['coverage'] = counts
                item['status'] = 'UNSUPPORTED' if artifact is None else 'GENERATED_SYNTHETIC_ONLY'
                if artifact is not None:
                    item.update(graph=asdict(artifact.graph),
                        text=artifact.safe_text_projection(authenticated_owner_scope=OWNER),
                        projection=artifact.safe_projection(authenticated_owner_scope=OWNER))
                    frozen = freeze_analysis_sources(prepared.request)
                    sources = {source.envelope.envelope_id: source for source in frozen.sources}
                    for node in artifact.graph.nodes:
                        for evidence in node.evidence_refs:
                            source = sources[evidence.source_envelope_id]
                            assert source.record_ref in node.record_refs
                            field_text = source_field_text(source, evidence.field_path)
                            assert sha_bytes(field_text) == evidence.field_sha256
                            literal = field_text[evidence.scalar_start:evidence.scalar_end]
                            assert sha_bytes(literal) == evidence.literal_sha256
                            assert source.envelope.raw_utf8[evidence.utf8_start:evidence.utf8_end].decode() == literal
                    assert not artifact.graph.edges, 'no order or cross-record edge is written in these cases'
                item['expectation_matches'] = (
                    counts['mapped_count'] == spec['expected']['mapped_count']
                    and counts['unparsed_count'] == spec['expected']['unparsed_count']
                    and (0 if artifact is None else len(artifact.graph.nodes)) == spec['expected']['nodes'])
                if artifact is not None and 'every_node_records' in spec['expected']:
                    item['expectation_matches'] &= all(len(n.record_refs) == spec['expected']['every_node_records']
                        for n in artifact.graph.nodes)
                if artifact is not None and 'node_record_cardinalities' in spec['expected']:
                    item['expectation_matches'] &= sorted(len(n.record_refs) for n in artifact.graph.nodes) == spec['expected']['node_record_cardinalities']
            except (AnalysisSourceError, admission.AnalysisSemanticError) as error:
                item.update(status='REJECTED', reason=str(error), error_type=type(error).__name__,
                    expectation_matches=False)
        assert snapshot == unchanged and response.raw == raw
        report['cases'].append(item)
    assert before == {path: sha(api / path) for path in SOURCE_PATHS}
    report.update(seconds=time.monotonic()-started, source_unchanged=True,
        expectation_matches=sum(bool(case['expectation_matches']) for case in report['cases']),
        fixture_count=len(report['cases']))
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(canonical(report)+'\n', encoding='utf-8')
    print(canonical(dict(output_sha256=sha(output), fixture_count=report['fixture_count'],
        expectation_matches=report['expectation_matches'], seconds=report['seconds'],
        cases=[dict(id=case['id'], status=case['status'], coverage=case.get('coverage'),
            nodes=len(case.get('graph', {}).get('nodes', [])),
            expectation_matches=case['expectation_matches']) for case in report['cases']])))


def sha_bytes(text):
    return hashlib.sha256(text.encode()).hexdigest()


if __name__ == '__main__':
    main()
