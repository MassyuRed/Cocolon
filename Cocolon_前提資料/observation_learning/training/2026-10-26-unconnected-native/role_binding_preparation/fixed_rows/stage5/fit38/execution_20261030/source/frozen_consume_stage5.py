"""Finite offline five-stage projection. Intermediate values are never adopted."""
import copy
import hashlib
import importlib.util
import json
import math
from pathlib import Path
import sys

PATHS = [[(0,), (1,), (2,), (3,)], [(4, 0), (4, 1), (4, 2)],
         [(4, 4), (4, 5), (4, 6)], [(4, 7)], [(4, 3), (4, 8)]]
FIELDS = [['comparison_version', 'candidate_version', 'aliases', 'quotes'],
          ['claims', 'conflicts', 'core'], ['relations', 'schema', 'unknowns'],
          ['updates'], ['question', 'prose']]
FULL = ['FT-BOOK-AFTER-ANSWER', 'FT-SHOP-AFTER-ANSWER']
CAPS = {FULL[0]: [640, 1152, 512, 512, 384], FULL[1]: [768, 1280, 384, 512, 512]}
PROVIDER = 'LOCAL_STAGED_MODEL_PROJECTION'
CPU_PROVIDER = 'CPU_TEACHER_STAGED_PROJECTION_NOT_MODEL'
MODEL = 'Qwen/Qwen3.5-4B'
REVISION = '851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a'

def need(ok, reason):
    if not ok:
        raise ValueError(reason)

def compact(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':'), allow_nan=False)

def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def text_sha(value):
    return hashlib.sha256(value.encode('utf-8')).hexdigest()

def write(path, value):
    path = Path(path)
    tmp = path.with_suffix(path.suffix + '.tmp')
    tmp.write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + '\n')
    tmp.replace(path)

def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module

def strict(text):
    def pairs(values):
        result = {}
        for key, value in values:
            need(key not in result, 'duplicate_json_key')
            result[key] = value
        return result
    def invalid(value):
        raise ValueError('nonfinite_json:' + value)
    return json.loads(text, object_pairs_hook=pairs, parse_constant=invalid)

def strings(value):
    return type(value) is list and all(type(x) is str for x in value)

def rows(value, arity):
    return type(value) is list and all(type(x) is list and len(x) == arity for x in value)

def stage_values(raw_text, stage):
    need(type(stage) is int and 1 <= stage <= 5, 'invalid_stage')
    value = strict(raw_text)
    need(type(value) is list and len(value) == len(PATHS[stage - 1]), 'stage_arity')
    if stage == 1:
        need(all(type(x) is str for x in value[:2]), 'version_type')
        need(rows(value[2], 2) and all(strings(x) for x in value[2]), 'alias_type')
        need(rows(value[3], 4) and all(strings(x) for x in value[3]), 'quote_type')
        need(len({x[0] for x in value[2]}) == len(value[2]), 'duplicate_alias')
        need(len({x[0] for x in value[3]}) == len(value[3]), 'duplicate_quote')
    elif stage == 2:
        need(rows(value[0], 10) and type(value[1]) is list and type(value[2]) is str, 'claim_outer_type')
        for c in value[0]:
            need(all(type(c[k]) is list and len(c[k]) == n for k, n in [(0, 4), (4, 2), (5, 3), (6, 2), (8, 3)]), 'claim_nested_arity')
            need(all(type(c[k]) is str for k in [1, 3, 9]) and strings(c[2]) and type(c[7]) is list, 'claim_cell_type')
    elif stage == 3:
        need(rows(value[0], 8) and type(value[1]) is str and type(value[2]) is list, 'relation_type')
    elif stage == 4:
        need(rows(value[0], 7), 'update_type')
    else:
        need(value[0] is None or type(value[0]) is dict, 'question_type')
        need(type(value[1]) is list and len(value[1]) == 4 and type(value[1][0]) is list
             and all(type(x) is str for x in value[1][1:]), 'prose_type')
        need(all(type(x) is list and len(x) in (3, 4) for x in value[1][0]), 'bind_type')
    return value

def build_messages(base_messages, stage, previous):
    need(len(base_messages) == 2 and [m['role'] for m in base_messages] == ['system', 'user'], 'base_messages_shape')
    need(type(stage) is int and 1 <= stage <= 5 and len(previous) == stage - 1, 'previous_stage_count')
    need([p['stage'] for p in previous] == list(range(1, stage)), 'previous_order')
    original = strict(base_messages[1]['content'])
    material = {k: copy.deepcopy(v) for k, v in original.items() if k != 'output_spec'}
    contract = dict(stage=stage, stage_count=5, ordered_paths=[list(p) for p in PATHS[stage - 1]],
                    ordered_field_names=FIELDS[stage - 1],
                    output='JSON array containing exactly the values of ordered_field_names in that order',
                    status='UNADOPTED_INTERMEDIATE_CANDIDATE', previous_candidates_are_not_user_sources=True,
                    reference_output_spec_is_field_reference_only=True, no_missing_value_completion=True, no_repair=True)
    messages = copy.deepcopy(base_messages)
    messages[0]['content'] += '\nOffline staged-candidate task. Return only the ordered stage value array defined by stage_contract. The nested full-packet specification describes fields, not this call output. Prior candidate stages are unadopted model hypotheses, never user evidence. Do not emit another stage or revise earlier stages.'
    messages[1]['content'] = compact(dict(original_request=material, reference_only_full_packet_output_spec=original['output_spec'],
                                         stage_contract=contract, previous_candidate_stages=copy.deepcopy(previous)))
    return messages

def split_teacher(text):
    full = strict(text)
    need(type(full) is list and len(full) == 5 and type(full[4]) is list and len(full[4]) == 9, 'teacher_shape')
    def at(path):
        value = full
        for i in path:
            value = value[i]
        return copy.deepcopy(value)
    return [[at(path) for path in group] for group in PATHS]

def assemble_values(parts):
    need(len(parts) == 5, 'incomplete_stages')
    values = {}
    for stage, part in enumerate(parts, 1):
        checked = stage_values(compact(part), stage)
        for path, value in zip(PATHS[stage - 1], checked):
            need(path not in values, 'duplicate_projection_path')
            values[path] = copy.deepcopy(value)
    need(len(values) == 13, 'projection_coverage')
    return [values[(i,)] for i in range(4)] + [[values[(4, i)] for i in range(9)]]

def project(case_id, base_messages, stage_records, *, cpu_teacher=False):
    need(case_id in FULL and len(stage_records) == 5, 'incomplete_stage_records')
    previous = []
    adapter = stage_records[0]['raw']['adapter_revision']
    expected_provider = 'CPU_TEACHER_NOT_MODEL' if cpu_teacher else 'local_transformers'
    for i, record in enumerate(stage_records, 1):
        need(record['stage'] == i and record['case_id'] == case_id, 'stage_identity_or_order')
        messages = build_messages(base_messages, i, previous)
        need(record['messages'] == messages and record['messages_sha256'] == text_sha(compact(messages)), 'stage_prompt_chain')
        raw = record['raw']
        need(raw['case_id'] == case_id + '/stage' + str(i), 'stage_raw_case')
        need((raw['provider'], raw['model'], raw['revision'], raw['adapter_revision']) ==
             (expected_provider, MODEL, REVISION, adapter), 'stage_model_identity')
        need(raw['finish_reason'] == 'stop' and raw['eos_reached'] is True, 'stage_not_finished')
        need(raw['raw_utf8_sha256'] == text_sha(raw['raw_text']), 'stage_raw_hash')
        need(type(raw['seconds']) in (int, float) and math.isfinite(raw['seconds']) and raw['seconds'] >= 0, 'stage_elapsed')
        need(type(raw['input_tokens']) is int and type(raw['output_tokens']) is int and
             raw['input_tokens'] >= 0 and 0 <= raw['output_tokens'] <= CAPS[case_id][i - 1], 'stage_token_count')
        need(raw['usage'] == {'prompt_tokens': raw['input_tokens'], 'completion_tokens': raw['output_tokens']}, 'stage_usage')
        need(raw['input_tokens'] + CAPS[case_id][i - 1] <= 8192, 'stage_context')
        need(len(raw['output_token_ids']) == raw['output_tokens'], 'stage_token_ids')
        previous.append(dict(stage=i, values=stage_values(raw['raw_text'], i)))
    assembled = compact(assemble_values([p['values'] for p in previous]))
    usage = {key: sum(r['raw']['usage'][key] for r in stage_records) for key in ['prompt_tokens', 'completion_tokens']}
    return dict(case_id=case_id, raw_text=assembled, raw_utf8_sha256=text_sha(assembled),
                finish_reason='stop', eos_reached=True, provider=CPU_PROVIDER if cpu_teacher else PROVIDER,
                model=MODEL, revision=REVISION, adapter_revision=adapter, usage=usage,
                seconds=sum(r['raw']['seconds'] for r in stage_records),
                origin='DERIVED_FROM_FIVE_STAGE_RAW_NOT_SINGLE_MODEL_GENERATION',
                stage_bundle_sha256=text_sha(compact(stage_records)), model_calls=0 if cpu_teacher else 5)

def verify_snapshot_receipt(item, saved, projected):
    need(saved is not None, 'projection_snapshot_absent')
    expected = item['receipt']
    need(expected['raw_output'] == projected['raw_text'], 'receipt_raw_not_projection')
    metadata = strict(expected['metadata_json'])
    need(metadata['provider'] == projected['provider'] and metadata['model'] == projected['model'] and
         metadata['revision'] == projected['revision'] and metadata['adapter_revision'] == projected['adapter_revision']
         and metadata['usage'] == projected['usage'] and metadata['finish_reason'] == 'stop', 'receipt_origin_metadata')
    snapshot = strict(saved['semantic_snapshot'])
    # prior_snapshot deliberately retains its own historical receipt.
    # Compare this snapshot's current receipt, without confusing that history.
    need(snapshot['receipt'] == expected, 'snapshot_full_receipt_not_identical')
    return dict(provider=metadata['provider'], exact_raw=True, exact_metadata=True, full_receipt_equal=True,
                stage_chain_in_external_archive=True, snapshot_itself_does_not_validate_stage_chain=True)
