"""Derive source-only event-plan candidate materials without model or SQL calls.

Historical approvals, training targets, and prepared SQL/checkpoint bytes are
never modified or transferred to the new candidate. This preparation is not
permission to execute the diagnostic or adopt its profile.
"""
from __future__ import annotations

import argparse
from copy import deepcopy
import hashlib
import json
import os
from pathlib import Path
import sys

sys.dont_write_bytecode = True
os.environ['PYTHONDONTWRITEBYTECODE'] = '1'
ROOT = Path(__file__).resolve().parents[2]
PROFILE = 'semantic_map.event_plan.v2'
INPUT_SHA = 'bdb872a588c42206f664e175a8c918c780da57a52353de378e738c7d0e72916d'
CHECKPOINT_SHA = '801ba0683d2aed9a7ba46a8e7eb630b7cc810e1279aee6612cd1a0933e374485'
OLD_PLAN_SHA = '75daa8b75e24216293e11aac9eec2025efcda838c18bbae2e9d0e6326b9fedeb'
SOURCE_PATHS = (
    'ai/services/ai_inference/analysis_cumulative_service.py',
    'ai/services/ai_inference/analysis_semantic_map.py',
    'ai/services/ai_inference/analysis_model_source.py',
    'ai/services/ai_inference/analysis_if_model_source.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py',
    'ai/tools/serve_emlis_natural_reply.py',
)


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def sha(path):
    return digest(path.read_bytes())


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True,
        separators=(',', ':'), allow_nan=False)


def read(path):
    return json.loads(path.read_bytes())


def write_new(path, value):
    with path.open('x', encoding='utf-8') as out:
        out.write(canonical(value) + '\n')
    path.chmod(0o600)


def identities(api):
    return {name: sha(api / name) for name in SOURCE_PATHS}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--api-root', type=Path, default=ROOT / 'mashos-api')
    parser.add_argument('--output-root', type=Path, default=Path(__file__).resolve().parent)
    args = parser.parse_args()
    api = args.api_root.resolve()
    output = args.output_root.resolve()
    output.mkdir(parents=True, exist_ok=True)
    outputs = ('input_cases.json', 'diagnostic_preparation.json',
        'full12_pre_acquisition.plan.json', 'full12.input.json')
    assert all(not (output / name).exists() for name in outputs), 'preparation_output_exists'
    before = identities(api)
    sys.path[:0] = [str(api), str(api / 'ai/services/ai_inference')]
    import analysis_semantic_map as semantic
    import analysis_cumulative_service as service
    import analysis_model_source as source
    from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as core
    assert core.SEMANTIC_MAP_EVENT_PLAN_V2_PROFILE == PROFILE
    assert not any(name == 'torch' or name == 'transformers' or name.startswith('transformers.')
        for name in sys.modules), 'model_library_loaded_during_preparation'

    historic = ROOT / 'candidate_execution/historical/semantic_alignment17_plan.json'
    original = ROOT / 'handoff/extracted/verification/ordinary_coverage_actual_20261116/positive-reading.actual.result.json'
    baseline = ROOT / 'handoff/extracted/verification/semantic_alignment17_recovery_actual_20261116/after.result.json'
    sql_root = ROOT / 'handoff/extracted/preparation/full12_sql_worked_lesson_preacquisition_20261116'
    old_paths = {name: sql_root / name for name in ('pre_acquisition.input.json',
        'pre_acquisition.plan.json', 'pre_acquisition.pglite.gz', 'pre_acquisition.receipt.json')}
    frozen_hashes = {name: sha(path) for name, path in old_paths.items()}
    assert frozen_hashes['pre_acquisition.input.json'] == INPUT_SHA
    assert frozen_hashes['pre_acquisition.plan.json'] == OLD_PLAN_SHA
    assert frozen_hashes['pre_acquisition.pglite.gz'] == CHECKPOINT_SHA
    pack, actual = read(historic), read(baseline)
    originals = read(original)
    rows = [dict(id=c['name'], owner=c['material']['owner'],
        snapshot=deepcopy(c['material']['snapshot'])) for c in originals['conditions']]
    rows += [dict(id=r['id'], owner=r['owner'], snapshot=deepcopy(r['snapshot']))
        for r in (*pack['heldouts'], pack['teachers'][0])]
    calls = actual['calls']
    assert len(rows) == len(calls) == 5
    assert [row['id'] for row in rows] == [row['id'] for row in calls]
    input_rows, diagnostics = [], []
    for row, old in zip(rows, calls):
        unchanged = semantic.prepare_semantic_map(row['owner'], row['snapshot'])
        assert unchanged.request_ref == old['request_ref'], row['id'] + ':old_ref_changed'
        assert unchanged.messages() == old['messages'], row['id'] + ':old_messages_changed'
        assert core.semantic_map_hash(unchanged.messages()) == old['messages_sha256']
        assert digest(old['raw'].encode()) == old['raw_sha256']
        new = semantic.prepare_semantic_map(row['owner'], row['snapshot'], prompt_version=PROFILE)
        assert new.source_guard == unchanged.source_guard
        assert new.frozen == unchanged.frozen
        assert new.fields == unchanged.fields
        assert new.request_ref != unchanged.request_ref
        assert new.prompt_version == PROFILE
        assert new.messages() != unchanged.messages()
        baseline_hashes = dict(request_ref=old['request_ref'], messages_sha256=old['messages_sha256'],
            raw_sha256=old['raw_sha256'])
        input_rows.append(dict(**row, baseline=baseline_hashes))
        diagnostics.append(dict(id=row['id'], owner=row['owner'],
            source_guard=new.source_guard, baseline=baseline_hashes,
            request_ref=new.request_ref, messages=new.messages(),
            messages_sha256=core.semantic_map_hash(new.messages()),
            message_bytes=source._semantic_message_bytes(new), prompt_version=new.prompt_version,
            source_inputs_unchanged=True, default_messages_baseline_exact=True))

    material = read(old_paths['pre_acquisition.input.json'])
    old_plan = read(old_paths['pre_acquisition.plan.json'])
    old_receipt = read(old_paths['pre_acquisition.receipt.json'])
    assert material['all_fictional'] is True and len(material['snapshot']['members']) == 12
    assert material['snapshot']['guard'] == old_receipt['sql_guard'] == old_plan['source_guard']
    assert material['snapshot']['now'] == old_receipt['frozen_as_of']
    parent = semantic.prepare_semantic_map(material['owner'], material['snapshot'], prompt_version=PROFILE)
    stages = service.prepare_semantic_history_batches(parent)
    refs = [ref for stage in stages for ref in stage.record_refs]
    assert refs == [member.saved_record_ref for member in parent.frozen.members]
    assert len(refs) == len(set(refs)) == 12
    assert 1 <= len(stages) <= 12, 'event_plan_existing_planner_partition_invalid'
    assert parent.source_guard == material['snapshot']['guard']
    plan = dict(parent_request_ref=parent.request_ref,
        parent_messages_sha256=core.semantic_map_hash(parent.messages()),
        parent_messages=parent.messages(), source_guard=parent.source_guard,
        frozen_as_of=material['snapshot']['now'], prompt_version=parent.prompt_version,
        parent_message_bytes=source._semantic_message_bytes(parent), source_records=12,
        leaf_count=len(stages), fresh_model_calls_required=len(stages) + 1,
        original_requested_max_model_calls=13, actual_fresh_model_calls_required=len(stages) + 1,
        partition_derivation='Unmodified service.prepare_semantic_history_batches derived from this exact new profile; no imposed stage count.',
        reuse_old_receipts=0, leaf_stages=[])
    for stage in stages:
        assert stage.source_guard == parent.source_guard and stage.parent is parent
        assert source.semantic_analysis_input_fits(stage)
        plan['leaf_stages'].append(dict(request_ref=stage.request_ref, record_refs=list(stage.record_refs),
            messages_sha256=core.semantic_map_hash(stage.messages()),
            message_bytes=source._semantic_message_bytes(stage), messages=stage.messages()))
    assert parent.request_ref != old_plan['parent_request_ref']
    assert plan['parent_messages_sha256'] != old_plan['parent_messages_sha256']
    after = identities(api)
    assert before == after, 'source_changed_during_preparation'
    assert frozen_hashes == {name: sha(path) for name, path in old_paths.items()}, 'old_sql_bytes_changed'
    assert not any(name == 'torch' or name == 'transformers' or name.startswith('transformers.')
        for name in sys.modules), 'model_library_loaded_during_preparation'
    source_changed_from_checkpoint = sorted(name for name, value in old_receipt['source_hashes'].items()
        if (api / name).exists() and sha(api / name) != value)
    result = dict(state='SOURCE_ONLY_EVENT_PLAN_PREPARED_NOT_EXECUTED_NOT_ADOPTED',
        prompt_version=PROFILE, model_schema=core.SEMANTIC_MAP_EVENT_PLAN_V2_SCHEMA,
        source_hashes=after, source_originals={str(path.relative_to(ROOT)): sha(path)
            for path in (historic, original, baseline)}, cases=diagnostics,
        training_targets_exported=False, model_loads=0, tokenizer_loads=0,
        model_calls=0, SQL_calls=0, hosted_database_calls=0, training=0, retry=0,
        full12_input_sha256=INPUT_SHA, full12_guard=parent.source_guard,
        full12_as_of=material['snapshot']['now'], full12_parent_request_ref=parent.request_ref,
        full12_leaf_count=len(stages), full12_fresh_model_calls_required=len(stages) + 1,
        original_requested_max_model_calls=13, actual_fresh_model_calls_required=len(stages) + 1,
        immutable_old_sql_files=frozen_hashes,
        finalizer_binding=dict(state='OLD_FINALIZER_REJECTS_NEW_PROFILE_UNTIL_EXPLICIT_CANDIDATE_BINDING',
            old_parent_request_ref=old_plan['parent_request_ref'], new_parent_request_ref=parent.request_ref,
            old_source_hashes_differ=source_changed_from_checkpoint,
            old_checkpoint_unchanged=True, old_plan_unchanged=True,
            rejecting_bindings=[
                'full12_same_raw_finalize.py:54 oldreceipt.source_hashes == source_ids()',
                'full12_same_raw_finalize.py:62 oldplan == prepared_plan(default_profile)',
                'full12_same_raw_finalize.py:63 oldplan.leaf_count == 12 and model_calls == 13',
                'full12_same_raw_finalize.py:107 actual.candidate_core_sha256 == oldreceipt.core_sha256',
                'full12_same_raw_finalize.py:156-157 default prepare parent == oldplan.parent_request_ref',
                'full12_same_raw_finalize.py:254 saved_receipt.source_hashes == source_ids()',
            ],
            reason='Existing finalizer binds old source hashes, default-profile prepared_plan and twelve leaves; new profile needs separate source+plan binding while retaining exact SQL input, guard, clock and checkpoint.'))
    write_new(output / 'input_cases.json', dict(all_fictional=True, training_targets_exported=False,
        source_input_count=5, cases=input_rows))
    write_new(output / 'diagnostic_preparation.json', result)
    write_new(output / 'full12_pre_acquisition.plan.json', plan)
    with (output / 'full12.input.json').open('xb') as out:
        out.write(old_paths['pre_acquisition.input.json'].read_bytes())
    (output / 'full12.input.json').chmod(0o600)
    assert sha(output / 'full12.input.json') == INPUT_SHA
    print(canonical(dict(state=result['state'], source_input_count=5,
        full12_leaf_count=len(stages), full12_input_sha256=INPUT_SHA,
        full12_parent_request_ref=parent.request_ref, model_calls=0, SQL_calls=0,
        output_files={name: dict(bytes=(output / name).stat().st_size, sha256=sha(output / name))
            for name in outputs}, finalizer_binding=result['finalizer_binding'])))


if __name__ == '__main__':
    main()
