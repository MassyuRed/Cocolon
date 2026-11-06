"""Prepare unchanged existing23 targets under exact v10 messages, CPU only.

prepare requires the pinned cached tokenizer and writes a new private pack.
validate performs source/candidate/reload checks without a tokenizer; it writes
only a clearly partial receipt, never an encoded or training-ready pack.
No evaluation row/raw, MW assembly, model load, learning, or DB operation is used.
"""
from __future__ import annotations

import argparse
from contextlib import ExitStack
from copy import deepcopy
from dataclasses import replace
import hashlib
from importlib.metadata import version
import json
import os
from pathlib import Path
import subprocess
import sys
from unittest.mock import patch


API_COMMIT = 'c1502415cc5d0e4fb9ff1fd5e1fcbe7a1af848b9'
PACK_SHA = '7acc464f1b45916a9d96bf91a27b042b71532456cec667e123d86208cf0c58e3'
WEIGHTS = 'a2e62bca49ccccc5eb1d91254cd7f536d2cae0329ef7f80e5ee37208d335eb59'
CONFIG = '006ebf7bef859264b3778126f4a0f6512e1b2a7e6049b09dfcf0d56603ede3a9'
PROFILE = 'selected_material.v10'
IDS = ('T01', 'T02', 'N01', 'N08', 'SC01', 'OA01', 'RU01', 'RB01', 'RB02', 'RU02',
    'AT04', 'AT12', 'AT19', 'AT29', 'BT08', *(f'F{i:02d}' for i in range(1, 9)))
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


def sha_bytes(raw):
    return hashlib.sha256(raw).hexdigest()


def digest(value):
    return sha_bytes(canonical(value).encode('utf-8'))


def unique_object(pairs):
    value = {}
    for key, item in pairs:
        assert key not in value, 'duplicate_json_key'
        value[key] = item
    return value


def read_json(raw):
    return json.loads(raw, object_pairs_hook=unique_object)


def block(*_args, **_kwargs):
    raise AssertionError('cpu_prepare_model_learning_or_database_forbidden')


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument('mode', choices=('prepare', 'validate'))
    cli.add_argument('--api', type=Path, required=True)
    cli.add_argument('--teacher-pack', type=Path, required=True)
    cli.add_argument('--root', type=Path, required=True)
    args = cli.parse_args()
    api, source_path, root = (p.resolve() for p in (args.api, args.teacher_pack, args.root))
    assert not root.exists(), 'new_private_root_required'
    source_bytes = source_path.read_bytes()
    assert sha_bytes(source_bytes) == PACK_SHA, 'exact_existing_teacher_pack_required'
    original = read_json(source_bytes)
    assert original['schema_version'] == 'analysis_fact_wish_contrast_trial.v1'
    assert tuple(row['id'] for row in original['teachers']) == IDS
    assert len(original['update_order']) == len(set(original['update_order'])) == 23
    assert set(original['update_order']) == set(IDS)
    assert original['initial_weights_sha256'] == WEIGHTS and original['initial_config_sha256'] == CONFIG
    source_hashes = {path: sha_bytes((api / path).read_bytes()) for path in SOURCE_PATHS}
    runner_sha = sha_bytes(Path(__file__).read_bytes())

    def check_unchanged():
        assert source_path.read_bytes() == source_bytes, 'original_pack_changed'
        assert sha_bytes(Path(__file__).read_bytes()) == runner_sha, 'runner_changed'
        assert subprocess.check_output(['git', '-C', str(api), 'rev-parse', 'HEAD'], text=True).strip() == API_COMMIT
        assert not subprocess.check_output(['git', '-C', str(api), 'status', '--porcelain',
            '--untracked-files=no'], text=True).strip(), 'tracked_api_dirty'
        assert source_hashes == {path: sha_bytes((api / path).read_bytes()) for path in SOURCE_PATHS}

    check_unchanged()
    sys.dont_write_bytecode = True
    os.environ['HF_HUB_OFFLINE'] = '1'
    os.environ['TRANSFORMERS_OFFLINE'] = '1'
    sys.path[:0] = [str(api / 'ai/services/ai_inference'), str(api / 'ai/tools')]
    import analysis_cumulative_service as service
    import analysis_model_source as model_source
    import serve_emlis_natural_reply as runtime
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import (
        semantic_admission as admission, intent_compiler as compiler,
        observed_route_realizer as author)
    tokenizer = None
    if args.mode == 'prepare':
        from transformers import AutoTokenizer
        assert {key: version(key) for key in runtime.PINS} == runtime.PINS
        tokenizer = AutoTokenizer.from_pretrained(runtime.MODEL, revision=runtime.REVISION,
            local_files_only=True, trust_remote_code=False)

    teachers, encoded, audits = [], {}, []
    with ExitStack() as stack:
        for obj, name in ((service, '_rpc'), (service, '_model_response'),
                (model_source, 'application_analysis_model_source'), (runtime, 'load_generator')):
            stack.enter_context(patch.object(obj, name, side_effect=block))
        for source in original['teachers']:
            source_row_hash = digest(source)
            target = source['assistant_target']
            target_hash = sha_bytes(target.encode('utf-8'))
            packet = read_json(target)
            old = service.prepare_cumulative_category_units(source['owner'], source['snapshot'],
                prompt_version=source['prompt_version'])
            prepared = service.prepare_cumulative_category_units(source['owner'], source['snapshot'],
                prompt_version=PROFILE)
            assert old.messages() == source['messages'] and old.request_ref == source['request_ref']
            assert old.request == prepared.request and old.source_guard == prepared.source_guard
            assert old.messages()[1] == prepared.messages()[1], 'source_material_changed'
            assert old.request_ref != prepared.request_ref and old.messages()[0] != prepared.messages()[0]
            fields = read_json(prepared.messages()[1]['content'])['fields']
            assert list(packet) == ['fields']
            assert [field['field'] for field in packet['fields']] == [field['field'] for field in fields]
            assert all(set(field) == {'field', 'units'} for field in packet['fields'])
            response = admission.AnalysisModelQuotedParentUnitsResponse(prepared.request_ref,
                digest(prepared.messages()), target_hash, 'stop', target)
            bound = replace(prepared, response=response)
            candidate, coverage = service.build_cumulative_quoted_parent_candidates(
                source['owner'], source['snapshot'], model_input=bound)
            storage = service.serialize_cumulative_quoted_parent_candidates(source['owner'],
                source['snapshot'], model_input=bound, artifact=candidate, coverage=coverage)
            with ExitStack() as reload_stack:
                for obj, name in ((MeaningExperienceEngine, 'generate'),
                        (compiler, 'compile_analysis_unit_candidates'),
                        (author, 'realize_analysis_unit_candidates'),
                        (admission, 'generate_analysis_model_quoted_parent_units')):
                    reload_stack.enter_context(patch.object(obj, name, side_effect=block))
                restored, restored_coverage = service.reload_cumulative_quoted_parent_candidates(
                    source['owner'], source['snapshot'], storage)
            assert restored == candidate and restored_coverage == coverage
            row = deepcopy(source)
            row.update(prompt_version=PROFILE, messages=prepared.messages(), request_ref=prepared.request_ref,
                source_guard=prepared.source_guard, original_row_sha256=source_row_hash,
                original_target_sha256=target_hash, original_profile=source['prompt_version'],
                original_request_ref=source['request_ref'], original_messages_sha256=digest(source['messages']))
            assert row['assistant_target'].encode('utf-8') == target.encode('utf-8')
            assert row['snapshot'] == source['snapshot'] and row['owner'] == source['owner']
            audit = dict(id=source['id'], original_row_sha256=source_row_hash,
                target_sha256=target_hash, original_profile=source['prompt_version'], new_profile=PROFILE,
                original_messages_sha256=digest(source['messages']), new_messages_sha256=digest(row['messages']),
                source_material_exact=True, all_fields_once=True, duplicate_json_keys=False,
                field_count=len(fields), strict_candidate=True, non_generation_reload_exact=True,
                original_role={key: source[key] for key in ('training_use', 'provenance', 'kind') if key in source},
                historical_fact_wish_updates=original['update_order'].count(source['id']))
            if tokenizer is not None:
                prompt = tokenizer.apply_chat_template(row['messages'], enable_thinking=False,
                    add_generation_prompt=True, tokenize=True, return_dict=False, truncation=False)
                full = tokenizer.apply_chat_template(row['messages'] + [dict(role='assistant', content=target)],
                    enable_thinking=False, add_generation_prompt=False, tokenize=True,
                    return_dict=False, truncation=False)
                assert full[:len(prompt)] == prompt and len(prompt) > 0
                assert len(prompt) + 2048 <= 8192 and 0 < len(full) - len(prompt) <= 2048
                assert len(full) <= 8192
                assert tokenizer.decode(full[len(prompt):], skip_special_tokens=False,
                    clean_up_tokenization_spaces=False) == target + '<|im_end|>\n'
                labels = [-100] * len(prompt) + full[len(prompt):]
                item = dict(input_ids=full, labels=labels, loss_start=len(prompt)-1,
                    logits_positions=len(full)-len(prompt)+1)
                assert len(labels) == len(full) and all(label == -100 for label in labels[:len(prompt)])
                assert labels[len(prompt):] == full[len(prompt):] and all(label >= 0 for label in labels[len(prompt):])
                assert len(labels[item['loss_start']+1:]) == item['logits_positions']-1
                encoded[source['id']] = item
                audit.update(input_tokens=len(prompt), assistant_with_eos_tokens=len(full)-len(prompt),
                    encoded_sha256=digest(item), prefix_eos_mask_budget_checked=True)
            assert digest(source) == source_row_hash and sha_bytes(source['assistant_target'].encode('utf-8')) == target_hash
            teachers.append(row)
            audits.append(audit)
    assert tuple(row['id'] for row in teachers) == IDS and len(audits) == 23
    check_unchanged()
    receipt = dict(schema_version='analysis_existing23_v10_cpu_prepare_receipt.v1',
        status='COMPLETE_CPU_PREPARED_NOT_ADOPTED' if tokenizer is not None else 'VALIDATED_BINDINGS_TOKENIZER_PENDING_NO_PACK',
        api_commit=API_COMMIT, api_hashes=source_hashes, runner_sha256=runner_sha,
        original_pack_sha256=PACK_SHA, original_pack_bytes_unchanged=True, teacher_count=23,
        target_bytes_unchanged=True, new_teachers=0, evaluation_rows_used=0, mw_rows_used=0,
        model_loads=0, model_calls=0, training_updates=0, db_calls=0, normal_adoption=False,
        candidate_adoption=False, tokenizer_checked=tokenizer is not None, audits=audits)
    files = {'audit.private.json': receipt}
    if tokenizer is not None:
        assert set(encoded) == set(IDS)
        pack = dict(schema_version='analysis_existing23_v10_cpu_pack.v1', status='CPU_PREPARED_NOT_ADOPTED',
            api_commit=API_COMMIT, api_hashes=source_hashes, runner_sha256=runner_sha,
            original_pack_sha256=PACK_SHA, original_source_pack_sha256=original['source_pack_sha256'],
            initial_adapter=original['initial_adapter'], initial_weights_sha256=WEIGHTS, initial_config_sha256=CONFIG,
            model=runtime.MODEL, revision=runtime.REVISION, pins=runtime.PINS, profile=PROFILE,
            teachers=teachers, teacher_ids=list(IDS), historical_fact_wish_update_order=original['update_order'],
            encoded_sha256=digest(encoded), context_tokens=8192, output_tokens=2048,
            evaluation_rows_used=0, new_teachers=0, training_updates=0, model_calls=0,
            normal_adoption=False, next_training_initial_adoption=False,
            interpretation='Unchanged existing target bytes under v10 messages only; no learning or quality claim.')
        files.update({'pack.private.json': pack, 'encoded.private.json': encoded})
    root.mkdir(parents=True)
    for name, value in files.items():
        with (root / name).open('x', encoding='utf-8') as stream:
            stream.write(canonical(value) + '\n')
    check_unchanged()
    with (root / 'manifest.private.json').open('x', encoding='utf-8') as stream:
        stream.write(canonical({name: sha_bytes((root / name).read_bytes()) for name in files}) + '\n')
    print(canonical(dict(status=receipt['status'], teacher_count=23,
        strict_candidates=23, non_generation_reloads=23, tokenizer_checked=tokenizer is not None,
        files={name: sha_bytes((root / name).read_bytes()) for name in files})))


if __name__ == '__main__':
    main()
