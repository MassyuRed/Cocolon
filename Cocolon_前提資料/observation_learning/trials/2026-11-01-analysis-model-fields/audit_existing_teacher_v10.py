"""CPU-only v10 rebinding of existing, immutable positive teacher rows.

No evaluation row/raw is selected, no teacher/target is authored, and no model
is loaded. Original pack/row/target hashes and historical update membership
remain distinct from this diagnostic. --without-tokenizer is explicitly partial;
the default requires the already pinned local tokenizer, without downloading.
"""
from __future__ import annotations

import argparse
from contextlib import ExitStack
from dataclasses import replace
import hashlib
from importlib.metadata import version
import json
from pathlib import Path
import subprocess
import sys
from unittest.mock import patch


API_COMMIT = 'c1502415cc5d0e4fb9ff1fd5e1fcbe7a1af848b9'
PACK_SHA = '7acc464f1b45916a9d96bf91a27b042b71532456cec667e123d86208cf0c58e3'
OLD_PACK_SHA = '30afde6a0735aac0b5f23e737b2b80c72e7dd65ba0cdbe4bc791886473f4bbf1'
PAIR8_SOURCE_SHA = '1500481dda8c2f83f80c8c1f01becb7a1b5319bc33d973168795a1274ba4867c'
PROFILE = 'selected_material.v10'
PAST_SUFFIXES = ('たかった', 'たくなかった')
SOURCE_PATHS = (
    'ai/services/ai_inference/analysis_cumulative_service.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/source_adapter.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py',
    'ai/tools/serve_emlis_natural_reply.py',
)


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True,
        separators=(',', ':'), allow_nan=False)


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def json_digest(value):
    return digest(canonical(value).encode('utf-8'))


def unique_object(pairs):
    value = {}
    for key, item in pairs:
        assert key not in value, 'duplicate_json_key'
        value[key] = item
    return value


def read_json(raw):
    return json.loads(raw, object_pairs_hook=unique_object)


def forbidden(*_args, **_kwargs):
    raise AssertionError('teacher_audit_model_or_database_forbidden')


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument('--api', type=Path, required=True)
    cli.add_argument('--teacher-pack', type=Path, required=True)
    cli.add_argument('--pair8-sources', type=Path,
        default=Path(__file__).with_name('material_v4_pair8_sources.json'))
    cli.add_argument('--wire-pack', type=Path)
    cli.add_argument('--wire-pack-sha256')
    cli.add_argument('--output', type=Path, required=True)
    cli.add_argument('--without-tokenizer', action='store_true')
    args = cli.parse_args()
    api, output = args.api.resolve(), args.output.resolve()
    assert not output.exists(), 'new_output_required'
    inputs = {'fact_wish23': args.teacher_pack.resolve(), 'pair8_sources': args.pair8_sources.resolve()}
    if args.wire_pack:
        assert args.wire_pack_sha256, 'wire_pack_hash_required'
        inputs['multirecord_wire24'] = args.wire_pack.resolve()
    before = {key: path.read_bytes() for key, path in inputs.items()}
    assert digest(before['fact_wish23']) == PACK_SHA, 'exact_existing_teacher_pack_required'
    original = read_json(before['fact_wish23'])
    assert original['source_pack_sha256'] == OLD_PACK_SHA
    assert original['initial_weights_sha256'] == 'a2e62bca49ccccc5eb1d91254cd7f536d2cae0329ef7f80e5ee37208d335eb59'
    assert len(original['teachers']) == len(original['update_order']) == 23
    assert set(original['update_order']) == {row['id'] for row in original['teachers']}
    assert digest(before['pair8_sources']) == PAIR8_SOURCE_SHA, 'pair8_update_history_changed'
    pair8 = read_json(before['pair8_sources'])
    assert len(pair8['update_order']) == len(set(pair8['update_order'])) == 18
    groups = [('fact_wish23', original['teachers'], original['update_order'])]
    if args.wire_pack:
        assert digest(before['multirecord_wire24']) == args.wire_pack_sha256
        wire = read_json(before['multirecord_wire24'])
        assert wire['source_pack_sha256'] == OLD_PACK_SHA
        rows = [row for row in wire['teachers'] if row['id'].startswith('MW')]
        assert [row['id'] for row in rows] == [f'MW{i:02d}' for i in range(1, 7)]
        groups.append(('multirecord_wire24', rows, wire['update_order']))
    sources = {path: digest((api / path).read_bytes()) for path in SOURCE_PATHS}

    def check_sources():
        assert subprocess.check_output(['git', '-C', str(api), 'rev-parse', 'HEAD'], text=True).strip() == API_COMMIT
        assert not subprocess.check_output(['git', '-C', str(api), 'status', '--porcelain',
            '--untracked-files=no'], text=True).strip(), 'tracked_api_dirty'
        assert sources == {path: digest((api / path).read_bytes()) for path in SOURCE_PATHS}

    check_sources()
    sys.dont_write_bytecode = True
    sys.path[:0] = [str(api / 'ai/services/ai_inference'), str(api / 'ai/tools')]
    import analysis_cumulative_service as service
    import analysis_model_source as model_source
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import (
        semantic_admission as admission, intent_compiler as compiler,
        observed_route_realizer as author)
    from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
    from serve_emlis_natural_reply import MODEL, REVISION, PINS
    tokenizer = None
    if not args.without_tokenizer:
        from transformers import AutoTokenizer
        assert {key: version(key) for key in PINS} == PINS
        tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION,
            local_files_only=True, trust_remote_code=False)

    def consume(row, prepared, target):
        response = admission.AnalysisModelQuotedParentUnitsResponse(prepared.request_ref,
            json_digest(prepared.messages()), digest(target.encode('utf-8')), 'stop', target)
        value = replace(prepared, response=response)
        result = {}
        with ExitStack() as stack:
            for obj, name in ((service, '_rpc'), (service, '_model_response'),
                    (model_source, 'application_analysis_model_source')):
                stack.enter_context(patch.object(obj, name, side_effect=forbidden))
            try:
                candidate, counts = service.build_cumulative_quoted_parent_candidates(
                    row['owner'], row['snapshot'], model_input=value)
                storage = service.serialize_cumulative_quoted_parent_candidates(row['owner'],
                    row['snapshot'], model_input=value, artifact=candidate, coverage=counts)
                with ExitStack() as reload_stack:
                    for obj, name in ((MeaningExperienceEngine, 'generate'),
                            (compiler, 'compile_analysis_unit_candidates'),
                            (author, 'realize_analysis_unit_candidates')):
                        reload_stack.enter_context(patch.object(obj, name, side_effect=forbidden))
                    restored, restored_counts = service.reload_cumulative_quoted_parent_candidates(
                        row['owner'], row['snapshot'], storage)
                assert restored == candidate and restored_counts == counts
                result['candidate'] = dict(status='ADMITTED_EXISTING_TEACHER', counts=counts,
                    non_generation_reload_exact=True)
            except (AnalysisSourceError, admission.AnalysisSemanticError) as error:
                result['candidate'] = dict(status='REJECTED', error_type=type(error).__name__, reason=str(error))
            try:
                artifact, counts = service.build_cumulative_map(row['owner'], row['snapshot'], model_input=value)
                result['typed'] = dict(status='UNSUPPORTED' if artifact is None else 'GENERATED_CPU_TEACHER_ONLY',
                    counts=counts, nodes=0 if artifact is None else len(artifact.graph.nodes),
                    node_semantics=[] if artifact is None else [dict(node_kind=node.node_kind,
                        modality=node.modality, polarity=node.polarity, temporal_scope=node.temporal_scope,
                        record_refs=node.record_refs) for node in artifact.graph.nodes])
            except (AnalysisSourceError, admission.AnalysisSemanticError) as error:
                result['typed'] = dict(status='REJECTED', error_type=type(error).__name__, reason=str(error))
        assert response.raw == target and response.raw_sha256 == digest(target.encode('utf-8'))
        return result

    cases = []
    for group, rows, order in groups:
        for row in rows:
            row_hash, target = json_digest(row), row['assistant_target']
            packet = read_json(target)
            old = service.prepare_cumulative_category_units(row['owner'], row['snapshot'],
                prompt_version=row['prompt_version'])
            new = service.prepare_cumulative_category_units(row['owner'], row['snapshot'], prompt_version=PROFILE)
            assert old.messages() == row['messages'] and old.request_ref == row['request_ref'], 'original_message_identity_changed'
            assert old.request == new.request and old.source_guard == new.source_guard
            assert old.messages()[1] == new.messages()[1], 'source_material_changed'
            assert old.request_ref != new.request_ref and old.messages()[0] != new.messages()[0]
            fields = read_json(new.messages()[1]['content'])['fields']
            assert list(packet) == ['fields']
            assert [field['field'] for field in packet['fields']] == [field['field'] for field in fields]
            assert all(set(field) == {'field', 'units'} for field in packet['fields'])
            roots = [unit for field in packet['fields'] for unit in field['units']
                if unit['parent_quote'] is None and unit['scope_role'] is None]
            past = [unit for unit in roots if unit['node_kind'] == 'ATTENTION_OR_THOUGHT'
                and unit['quote'].endswith(PAST_SUFFIXES)]
            bad_suffix = [q for unit in roots for q in unit['qualifiers']
                if q['kind'] == 'WRITTEN_MODIFIER' and q['quote'] in ('たかった', 'たくなかった')]
            item = dict(group=group, id=row['id'], original_row_sha256=row_hash,
                original_target_sha256=digest(target.encode('utf-8')),
                original_role={key: row[key] for key in ('training_use', 'provenance', 'kind') if key in row},
                original_profile=row['prompt_version'], new_profile=PROFILE, source_material_exact=True,
                old_system_sha256=json_digest(old.messages()[0]), new_system_sha256=json_digest(new.messages()[0]),
                old_system_is_new_prefix=new.messages()[0]['content'].startswith(old.messages()[0]['content']),
                system_chars=[len(old.messages()[0]['content']), len(new.messages()[0]['content'])],
                request_refs=[old.request_ref, new.request_ref], source_guard=old.source_guard,
                field_count=len(fields), source_records=len(row['snapshot']['members']),
                distinct_field_objects=True, duplicate_json_keys=False,
                positive_past_wish_roots=sum(unit['quote'].endswith('たかった') for unit in past),
                negative_past_wish_roots=sum(unit['quote'].endswith('たくなかった') for unit in past),
                past_wish_suffix_modifier_count=len(bad_suffix),
                historical_a2e_final18_updates=pair8['update_order'].count(row['id']),
                historical_group_updates=order.count(row['id']), tokens={'status': 'NOT_CHECKED_LOCAL_TOKENIZER_UNAVAILABLE'})
            if tokenizer is not None:
                budgets = {}
                for name, prepared in (('original', old), ('v10', new)):
                    prompt = tokenizer.apply_chat_template(prepared.messages(), enable_thinking=False,
                        add_generation_prompt=True, tokenize=True, return_dict=False, truncation=False)
                    full = tokenizer.apply_chat_template(prepared.messages() + [dict(role='assistant', content=target)],
                        enable_thinking=False, add_generation_prompt=False, tokenize=True,
                        return_dict=False, truncation=False)
                    assert full[:len(prompt)] == prompt
                    assert tokenizer.decode(full[len(prompt):], skip_special_tokens=False,
                        clean_up_tokenization_spaces=False) == target + '<|im_end|>\n'
                    budgets[name] = dict(input_tokens=len(prompt), assistant_with_eos_tokens=len(full)-len(prompt),
                        generation_budget_fits=len(prompt)+2048 <= 8192, training_budget_fits=len(full) <= 8192)
                item['tokens'] = dict(status='PINNED_REAL_TOKENIZER_CHECKED', budgets=budgets)
            item['original_consumer'] = consume(row, old, target)
            item['v10_consumer'] = consume(row, new, target)
            assert json_digest(row) == row_hash and row['assistant_target'] == target, 'teacher_mutated'
            cases.append(item)
    check_sources()
    assert all(path.read_bytes() == before[key] for key, path in inputs.items()), 'original_pack_bytes_changed'
    report = dict(schema_version='analysis_existing_teacher_v10_cpu_audit.v1',
        status='COMPLETE_CPU_AUDIT' if tokenizer is not None else 'PARTIAL_CPU_AUDIT_TOKENIZER_PENDING',
        api_commit=API_COMMIT, api_hashes=sources, input_sha256={key: digest(raw) for key, raw in before.items()},
        input_bytes_unchanged=True, model_loads=0, model_calls=0, training_updates=0, db_calls=0,
        new_teachers=0, evaluation_rows_used=0, normal_adoption=False,
        wire_teacher_audit='INCLUDED' if args.wire_pack else 'NOT_PROVIDED', cases=cases,
        limitations=['Teacher CPU admission and typed coverage are separate from free model generation quality.',
            'Historical fact_wish23 and multirecord_wire24 updates produced unadopted candidates, not current a2e.',
            'Same existing targets are diagnostic bindings only; no training pack or new teacher is written.'])
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open('x', encoding='utf-8') as stream:
        stream.write(canonical(report) + '\n')
    print(canonical(dict(status=report['status'], cases=len(cases), output_sha256=digest(output.read_bytes()),
        v10_candidate_admitted=sum(c['v10_consumer']['candidate']['status'] == 'ADMITTED_EXISTING_TEACHER' for c in cases),
        v10_typed_generated=sum(c['v10_consumer']['typed']['status'] == 'GENERATED_CPU_TEACHER_ONLY' for c in cases),
        positive_past_ids=[c['id'] for c in cases if c['positive_past_wish_roots']],
        multi_field_ids=[c['id'] for c in cases if c['field_count'] > 1])))


if __name__ == '__main__':
    main()
