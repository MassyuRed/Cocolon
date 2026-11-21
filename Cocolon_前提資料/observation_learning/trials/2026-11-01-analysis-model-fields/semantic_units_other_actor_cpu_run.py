"""CPU-only teaching for the observed OTHER actor/negative-action scope gap."""
from pathlib import Path
from copy import deepcopy
from dataclasses import replace
from uuid import UUID
from contextlib import ExitStack
from unittest.mock import patch
import hashlib
import json

import analysis_cumulative_service as service
from cocolon_meaning_experience_engine import MeaningExperienceEngine
from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse, canonical
import cocolon_meaning_experience_engine.cores.analysis.intent_compiler as compiler
import cocolon_meaning_experience_engine.cores.analysis.observed_route_realizer as author

w = Path('/workspace')
old_path = w / 'analysis-mixed60-20261102/semantic_units_mixed60_plan.json'
old_bytes = old_path.read_bytes()
old = json.loads(old_bytes)
assert len(old['teachers']) == 60
out = w / 'analysis-other-actor-cpu-20261102'
out.mkdir(exist_ok=False)
other_negative = []
other_actions = []
mixed_other_negative = []
for row in old['teachers']:
    for field in json.loads(row['assistant_target'])['fields']:
        units = field['units']
        for unit in units:
            if unit['node_kind'] != 'ACTION_OR_NONACTION' or unit['parent_quote'] is not None:
                continue
            actors = [q['quote'] for q in unit['qualifiers'] if q['kind'] == 'EXPLICIT_ACTOR']
            # In these exact60 targets the only explicit SELF action actor is 私は.
            assert set(actors) <= {'私は', '先輩は', '母は', '友人は', '妹は'}
            others = [actor for actor in actors if actor != '私は']
            if not others:
                continue
            other_actions.append(row['id'])
            if any(q['kind'] == 'NEGATION' for q in unit['qualifiers']):
                other_negative.append(row['id'])
                if sum(u['scope_role'] == 'WRITTEN_UNKNOWN' and u['parent_quote'] is None for u in units) >= 2:
                    mixed_other_negative.append(row['id'])
assert not other_negative and not mixed_other_negative and len(other_actions) == 6
clauses = {'A': '父は返送しなかった', 'B': '伝票が届いたかは分からない', 'C': '集荷が終わったかも分からない'}
contents = {'B': '伝票が届いたか', 'C': '集荷が終わったか'}
rows = []
for index, order in enumerate((['A', 'B', 'C'], ['C', 'A', 'B']), 1):
    snapshot = deepcopy(old['teachers'][0]['snapshot'])
    memo = '。'.join(clauses[key] for key in order) + '。'
    snapshot['members'][0]['original'].update(id=str(UUID(int=19000 + index)), memo=memo, memo_action='')
    owner = old['teachers'][0]['owner']
    prepared = service.prepare_cumulative_quoted_parent_units(owner, snapshot)
    assert memo not in {field['text'] for row in old['teachers'] + old['evaluation'] for field in json.loads(row['messages'][1]['content'])['fields']}
    units = []
    for key in order:
        quote = clauses[key]
        if key == 'A':
            units.append(dict(quote=quote, node_kind='ACTION_OR_NONACTION', parent_quote=None, scope_role=None,
                              qualifiers=[dict(kind='EXPLICIT_ACTOR', quote='父は'), dict(kind='NEGATION', quote='しなかった')]))
        else:
            units.append(dict(quote=quote, node_kind=None, parent_quote=None, scope_role='WRITTEN_UNKNOWN', qualifiers=[dict(kind='EPISTEMIC_EXPRESSION', quote='分からない')]))
            units.append(dict(quote=contents[key], node_kind=None, parent_quote=quote, scope_role='UNKNOWN_CONTENT', qualifiers=[]))
    raw = canonical(dict(fields=[dict(field=1, units=units)]))
    response = AnalysisModelQuotedParentUnitsResponse(prepared.request_ref, hashlib.sha256(canonical(prepared.messages()).encode()).hexdigest(), hashlib.sha256(raw.encode()).hexdigest(), 'stop', raw)
    model_input = replace(prepared, response=response)
    artifact, coverage = service.build_cumulative_quoted_parent_candidates(owner, snapshot, model_input=model_input)
    saved = service.serialize_cumulative_quoted_parent_candidates(owner, snapshot, model_input=model_input, artifact=artifact, coverage=coverage)
    path = out / f'OA{index:02}.candidate.json'
    path.write_text(saved)
    with ExitStack() as stack:
        for target, name in ((MeaningExperienceEngine, 'generate'), (compiler, 'compile_analysis_unit_candidates'), (author, 'realize_analysis_unit_candidates')):
            stack.enter_context(patch.object(target, name, side_effect=AssertionError('no saved-file generation')))
        again, counts = service.reload_cumulative_quoted_parent_candidates(owner, snapshot, path.read_text())
    assert again == artifact and counts == coverage and coverage['mapped_count'] == 0 and coverage['unparsed_count'] == 1
    rows.append(dict(id=f'OA{index:02}', owner=owner, snapshot=snapshot, messages=prepared.messages(), request_ref=prepared.request_ref, assistant_target=raw, target_sha256=hashlib.sha256(raw.encode()).hexdigest(), source_bound_candidate_id=artifact.candidate_id, coverage=coverage, serialized_sha256=hashlib.sha256(path.read_bytes()).hexdigest(), serialized_payload=path.read_text(), save_reload='MATCHED_SAME_PROCESS_ACTUAL_FILE_NO_GENERATION_COMPILER_AUTHOR'))
assert old_path.read_bytes() == old_bytes
result = dict(status='ROOT_SYNTHETIC_OTHER_NEGATIVE_ACTION_ONE_TOPIC_TWO_ORDERS_CPU_ONLY_NOT_GPU_PLAN_OR_OUTPUT', source_api_commit=old['api_commit'], old60_plan_sha256=hashlib.sha256(old_bytes).hexdigest(), old60_explicit_other_action_count=6, old60_explicit_other_negative_action_count=0, old60_mixed_other_negative_count=0, rows=rows, model_loads=0, new_generations=0, updates=0, old60_changed=False, receiver_changed=False,
              limits=['Created afterMD02; one topic/two orders, not blind or two independent topics.', 'No MD02 or model raw is turned into the target.', 'Actor and negation stay on the ACTION root; no actor/full predicate is emitted as CONTENT_TARGET.', 'Actor remains unresolved in the private candidate graph; this does not make a statement about the account owner.', 'Observed curriculum gap is not proven sole cause; other-actor/negation/mixing effects are not isolated.', 'CQ04 unknown-versus-reason, SQ03 modifier, and HQ04 written reason remain separate issues.', 'CPU source binding and same-process actual-file reload are not model or product quality.'])
(out / 'semantic_units_other_actor_cpu.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
(w / 'other-actor-cpu-download.html').write_text('<meta charset=utf-8><h1>Other actor CPU teaching</h1><a href=analysis-other-actor-cpu-20261102/semantic_units_other_actor_cpu.json>CPU teaching and saved payloads</a>')
print('OA2 strict5unit/file reload matched; old60 unchanged; model0')
