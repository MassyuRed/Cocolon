def semantic_json_parser(messages, alphabet):
    from lmformatenforcer import CharacterLevelParserConfig, JsonSchemaParser
    # LMFE snapshots alphabet_without_quotes while constructing its context.
    # Updating parser.config later leaves that initial snapshot unchanged.
    schema = semantic_output_schema(messages)
    config = CharacterLevelParserConfig(alphabet=alphabet)
    if schema['properties']['schema_version'].get('enum') == [IF_CANDIDATE_SCHEMA]:
        config.force_json_field_order = True
        return _if_json_schema_parser(schema, config)
    # Every map selects a real source before its meaning. Record IDs bind
    # coverage only; they never substitute for evidence field IDs.
    config.force_json_field_order = True
    material = json.loads(messages[1]['content'])
    quoted_fields = {part['properties']['field']['enum'][0] for part in
        schema['properties']['nodes']['items']['properties']['evidence']['items']['oneOf']}
    records = {field['field']: field['record'] for field in material['fields']
        if field['field'] in quoted_fields and type(field.get('record')) is int and field['record'] > 0}
    # Native output has at most 24 meaning nodes. Larger source sets retain the
    # existing explicitly partial coverage rather than becoming a new refusal.
    if len(set(records.values())) > 24:
        records = {}
    return _semantic_unique_json_schema_parser(schema, config, record_fields=records)
