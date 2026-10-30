"""Candidate syntax correction for the existing five-stage offline experiment.

No model, decoder, teacher, receiver or acceptance changes. Original full-wire
syntax is archived separately; active root and row syntax describe this call.
"""
import copy
import json

VERSION = 'cocolon.stage5.stage_only_prompt.v1'
FORMAT = 'cocolon.cmee.fixed_rows_comparison.v1'
OLD_SYSTEM_DIRECTIVE = '出力形式は' + FORMAT + 'です。'
FIELDS = [['comparison_version', 'candidate_version', 'aliases', 'quotes'],
          ['claims', 'conflicts', 'core'], ['relations', 'schema', 'unknowns'],
          ['updates'], ['question', 'prose']]
ROW_NAMES = [['q'], ['claim', 'time', 'mode', 'polarity', 'pred', 'subject'],
             ['relation'], ['update'], ['prose', 'bind']]
FIELD_TYPES = {
    'comparison_version': 'JSON string: final comparison wire version',
    'candidate_version': 'JSON string: original named-wire version',
    'aliases': 'list of [alias_name, actual_identity] rows; each row exactly two strings',
    'quotes': 'list of q rows',
    'claims': 'list of claim rows; each claim contains its nested time/mode/polarity/pred/subject rows',
    'conflicts': 'JSON list', 'core': 'JSON string',
    'relations': 'list of relation rows', 'schema': 'JSON string',
    'unknowns': 'JSON list', 'updates': 'list of update rows',
    'question': 'null or original question JSON object',
    'prose': 'one prose row; binds is a list of bind rows',
}
VALUE_RULES = [
    'Minify JSON syntax without changing whitespace inside JSON string values.',
    'Every row is a JSON array in its listed field order, never an object.',
    'All remaining cells keep their original JSON types, including arrays, nulls and strings.',
    'All reference names, quotes, axes, IDs, update assignment/order and prose remain explicit model outputs.',
    'Do not shorten names, omit empty cells, infer values, auto-number IDs or copy a value from another cell.',
    'No row padding, JSON repair, coercion or semantic completion. The decoder restores fixed field names only.',
    'Invalid rows are rejected. Emit no Markdown, explanation or additional root wrapper.',
    'prior_adopted_interpretation is read-only context in the original named format, never this call output.',
    'Its aliases/quote names are local there; declare every used identity and quote in the current stage1 aliases/quotes.',
    'Every ev contains output quote IDs. ur lists only this output updates.$id, never relation or gap IDs.',
    'updates.prior uses the snapshot alias @p0, not a source alias.',
    'The original named-wire version and candidate schema value must be explicitly emitted in stages1 and3.',
    'Updates are emitted in stage4, before prose in stage5; other stages never emit those fields.',
    'observation, reception and update_note are Japanese strings addressed to the person in stage5.',
    'Each bind row has cr,rr,section, optionally a fourth ur cell. cr/rr/ur retain their original lists.',
]

def compact(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':'), allow_nan=False)


SOURCE_GUIDE_VERSION = 'cocolon.stage5.source_identity_guide.v1'

def source_identity_guide(original):
    """Read input metadata only. Never receive a teacher, quote or semantic answer."""
    sources = original['material']['sources']
    if not isinstance(sources, list) or not sources:
        raise ValueError('source_list_required')
    rows = []
    seen = set()
    for source in sources:
        identity = source['source_id']
        fields = source['text_fields']
        if not isinstance(identity, str) or not identity or identity in seen:
            raise ValueError('source_identity_not_unique')
        if not isinstance(fields, dict) or not fields or not all(isinstance(k, str) and k and isinstance(v, str) for k, v in fields.items()):
            raise ValueError('source_text_fields_invalid')
        seen.add(identity)
        rows.append(dict(source_id=identity, text_field_names=list(fields)))
    prior = original.get('prior_adopted_interpretation')
    snapshot = None if prior is None else prior['snapshot_ref']
    if snapshot is not None and (not isinstance(snapshot, str) or not snapshot or snapshot in seen):
        raise ValueError('prior_snapshot_identity_invalid')
    return dict(version=SOURCE_GUIDE_VERSION, source_rows=rows,
                prior_snapshot_ref=snapshot,
                derived_only_from='original_request.material.sources[].source_id/text_fields keys and prior_adopted_interpretation.snapshot_ref',
                rules=[
                    'aliases and quotes are two separate sibling arrays, in root positions 3 and 4 (one-based).',
                    'Each aliases row is exactly [alias_name, actual_identity]; actual_identity is an exact source_id above or prior_snapshot_ref.',
                    'clause_roles keys and role_order entries name meanings, not source identities. Field names and the word aliases are not identities.',
                    'Each quotes row is exactly [id,s,f,t]; id is a model-chosen quote name; s is @ plus a declared source alias.',
                    'For that source_id, f must be one of its exact text_field_names. t must be the model-selected literal quote from that same source field.',
                    'A prior snapshot alias is for updates.prior, never a source of quotes. Prior quote IDs are not current aliases.',
                    'Names and counts of aliases/quotes and all selected quote text remain model outputs. This guide supplies no output rows.',
                    'Do not put quote rows inside aliases, serialize rows as strings, or add explanatory labels to either array.'
                ])

def build_messages(base_messages, stage, previous):
    if len(base_messages) != 2 or [m['role'] for m in base_messages] != ['system', 'user']:
        raise ValueError('base_messages_shape')
    if type(stage) is not int or not 1 <= stage <= 5 or [p['stage'] for p in previous] != list(range(1, stage)):
        raise ValueError('previous_order')
    original = json.loads(base_messages[1]['content'])
    spec = original['output_spec']
    system = base_messages[0]['content']
    if system.count(OLD_SYSTEM_DIRECTIVE) != 1:
        raise ValueError('unexpected_original_system_directive')
    system = system.replace(OLD_SYSTEM_DIRECTIVE, '')
    names = FIELDS[stage - 1]
    # Source material and adopted prior remain exact. Only output syntax moves.
    request = {k: copy.deepcopy(v) for k, v in original.items() if k not in ('output_spec', 'model_output_format')}
    semantics = {k: copy.deepcopy(v) for k, v in spec.items() if k not in ('notation', 'output_types', 'shape')}
    rows = {k: copy.deepcopy(spec['shape'][k]) for k in ROW_NAMES[stage - 1]}
    contract = dict(version=VERSION, stage=stage, stage_count=5,
                    root_fields_in_order=names, root_arity=len(names),
                    field_types={k: FIELD_TYPES[k] for k in names}, row_fields=rows,
                    emit_only_this_stage=True, previous_stages_are_unadopted_candidates=True,
                    previous_candidates_are_not_user_sources=True,
                    no_earlier_revision=True, no_completion=True, no_repair=True)
    active = ('これは5区間候補の第' + str(stage) + '区間です。'
              '今回の出力は' + compact(names) + 'の順の' + str(len(names)) + '要素を持つJSON配列一つだけです。'
              'stage_output_contractの構文だけで出力してください。完成packet全体のrootやcandidateの外枠を付けません。'
              'final_packet_semanticsは最終結合packet全体に対する意味条件です。そこに他区間の生成命令があっても、'
              '今回の出力欄を増やす指示ではありません。全意味条件は保持し、今回担当の欄だけを生成します。'
              '過去の採用解釈と前段候補は本人の新しい発言ではありません。前段候補を根拠化したり書き換えたりしません。')
    payload = dict(original_request=request, stage_output_contract=contract,
                   value_rules=VALUE_RULES, final_packet_semantics=semantics,
                   final_format_reference=dict(model_output_format=original['model_output_format'],
                                               comparison_version=FORMAT,
                                               use='final assembly identity, not this call root shape'),
                   previous_candidate_stages=copy.deepcopy(previous))
    if stage == 1:
        payload['source_identity_guide'] = source_identity_guide(original)
        contract['row_fields']['alias'] = ['alias_name', 'actual_identity']
    return [dict(role='system', content=active + '\n' + system), dict(role='user', content=compact(payload))]

def project(owner, case_id, base_messages, stage_records, *, cpu_teacher=False):
    """Keep frozen raw/identity/count checks; verify the actual revised prompt chain.

    Do not substitute old prompts into the records. The bundle hash commits to
    the same revised messages that were actually supplied to the model.
    """
    import math
    need = owner.need
    need(case_id in owner.FULL and len(stage_records) == 5, 'incomplete_stage_records')
    previous = []
    adapter = stage_records[0]['raw']['adapter_revision']
    expected_provider = 'CPU_TEACHER_NOT_MODEL' if cpu_teacher else 'local_transformers'
    for i, record in enumerate(stage_records, 1):
        need(record['stage'] == i and record['case_id'] == case_id, 'stage_identity_or_order')
        messages = build_messages(base_messages, i, previous)
        need(record['messages'] == messages and record['messages_sha256'] == owner.text_sha(compact(messages)), 'stage_prompt_chain')
        raw = record['raw']
        need(raw['case_id'] == case_id + '/stage' + str(i), 'stage_raw_case')
        need((raw['provider'], raw['model'], raw['revision'], raw['adapter_revision']) ==
             (expected_provider, owner.MODEL, owner.REVISION, adapter), 'stage_model_identity')
        need(raw['finish_reason'] == 'stop' and raw['eos_reached'] is True, 'stage_not_finished')
        need(raw['raw_utf8_sha256'] == owner.text_sha(raw['raw_text']), 'stage_raw_hash')
        need(type(raw['seconds']) in (int, float) and math.isfinite(raw['seconds']) and raw['seconds'] >= 0, 'stage_elapsed')
        need(type(raw['input_tokens']) is int and type(raw['output_tokens']) is int and
             raw['input_tokens'] >= 0 and 0 <= raw['output_tokens'] <= owner.CAPS[case_id][i - 1], 'stage_token_count')
        need(raw['usage'] == {'prompt_tokens': raw['input_tokens'], 'completion_tokens': raw['output_tokens']}, 'stage_usage')
        need(raw['input_tokens'] + owner.CAPS[case_id][i - 1] <= 8192, 'stage_context')
        need(len(raw['output_token_ids']) == raw['output_tokens'], 'stage_token_ids')
        previous.append(dict(stage=i, values=owner.stage_values(raw['raw_text'], i)))
    assembled = compact(owner.assemble_values([p['values'] for p in previous]))
    usage = {key: sum(r['raw']['usage'][key] for r in stage_records) for key in ['prompt_tokens', 'completion_tokens']}
    return dict(case_id=case_id, raw_text=assembled, raw_utf8_sha256=owner.text_sha(assembled),
                finish_reason='stop', eos_reached=True, provider=owner.CPU_PROVIDER if cpu_teacher else owner.PROVIDER,
                model=owner.MODEL, revision=owner.REVISION, adapter_revision=adapter, usage=usage,
                seconds=sum(r['raw']['seconds'] for r in stage_records),
                origin='DERIVED_FROM_FIVE_STAGE_RAW_NOT_SINGLE_MODEL_GENERATION',
                stage_bundle_sha256=owner.text_sha(compact(stage_records)), model_calls=0 if cpu_teacher else 5)
