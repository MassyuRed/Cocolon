"""Read-only CPU diagnostics for field layout and literal locations in model raw.

Objects retain ordered key/value pairs, including duplicates. This is never an
admission parser: it does not repair raw, choose a last key, build a candidate,
or decide meaning. A units occurrence is associated with its nearest preceding
field header only to explain malformed output. Coordinates are relative to the
decoded field text, not the canonical source-envelope UTF8 evidence positions.

CLI audits before.private.json and after.private.json in an immutable trial
root, verifies their saved request/Response bindings and after raw sidecars,
then writes one new private report exclusively. No API, model, training or DB
module is imported. --self-check exercises small synthetic malformed inputs.
"""
from __future__ import annotations

import argparse
from collections import Counter
from dataclasses import dataclass
import hashlib
import json
from pathlib import Path


MAX_RAW_BYTES = 2_000_000
MAX_AST_VALUES = 50_000
UNIT_KEYS = frozenset(('node_kind', 'parent_quote', 'qualifiers', 'quote', 'scope_role'))


@dataclass(frozen=True)
class ObjectPairs:
    pairs: tuple


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True,
        separators=(',', ':'), allow_nan=False)


def report_json(value):
    # Preserve even an escaped unpaired surrogate in malformed raw keys safely.
    return json.dumps(value, ensure_ascii=True, sort_keys=True,
        separators=(',', ':'), allow_nan=False)


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def digest(value):
    return sha(canonical(value).encode('utf-8'))


def reject_constant(value):
    raise ValueError('non_standard_json_constant:' + value)


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError('duplicate_metadata_key:' + key)
        result[key] = value
    return result


def read_metadata(raw):
    return json.loads(raw, object_pairs_hook=unique_object, parse_constant=reject_constant)


def literal_ranges(text, quote):
    """All overlapping codepoint and decoded-field UTF8 ranges; no disambiguation."""
    result, start = [], 0
    while quote and (position := text.find(quote, start)) >= 0:
        end = position + len(quote)
        result.append(dict(scalar_start=position, scalar_end=end,
            field_utf8_start=len(text[:position].encode('utf-8')),
            field_utf8_end=len(text[:end].encode('utf-8'))))
        start = position + 1
    return result


def audit_wire(fields, raw):
    """Return observations only. Even a clean result is not semantic admission."""
    assert isinstance(fields, list) and fields
    texts = {}
    for field in fields:
        number = field['field']
        assert type(number) is int and number not in texts and isinstance(field['text'], str)
        field['text'].encode('utf-8')
        texts[number] = field['text']
    assert isinstance(raw, str)
    raw_bytes = raw.encode('utf-8')
    report = dict(schema_version='analysis_wire_field_diagnostic.v1',
        diagnostic_only=True, admission=False, raw_sha256=sha(raw_bytes),
        raw_bytes=len(raw_bytes), expected_fields=list(texts),
        coordinate_scope='DECODED_FIELD_TEXT_ONLY_NOT_SOURCE_ENVELOPE',
        units_header_association='NEAREST_PRECEDING_PAIR_DIAGNOSTIC_ONLY',
        duplicate_keys=[], issues=[], field_headers=[], units_blocks=[], quotes=[])
    if len(raw_bytes) > MAX_RAW_BYTES:
        return dict(report, parse_status='DIAGNOSTIC_RAW_SIZE_LIMIT')
    try:
        tree = json.loads(raw, object_pairs_hook=lambda pairs: ObjectPairs(tuple(pairs)),
            parse_constant=reject_constant)
    except json.JSONDecodeError as error:
        return dict(report, parse_status='JSON_SYNTAX_ERROR',
            syntax_error=dict(message=error.msg, scalar_offset=error.pos,
                line=error.lineno, column=error.colno))
    except RecursionError:
        return dict(report, parse_status='DIAGNOSTIC_JSON_NESTING_LIMIT')
    except ValueError as error:
        status = ('NON_STANDARD_JSON_CONSTANT' if str(error).startswith('non_standard_json_constant:')
            else 'JSON_PARSE_VALUE_OR_LIMIT_ERROR')
        return dict(report, parse_status=status, detail=str(error))

    pending, visited = [(tree, '$')], 0
    while pending:
        value, path = pending.pop()
        visited += 1
        if visited > MAX_AST_VALUES:
            return dict(report, parse_status='DIAGNOSTIC_AST_SIZE_LIMIT')
        if isinstance(value, ObjectPairs):
            counts = Counter(key for key, _ in value.pairs)
            report['duplicate_keys'].extend(dict(path=path, key=key, occurrences=count)
                for key, count in counts.items() if count > 1)
            occurrences = Counter()
            for key, child in value.pairs:
                occurrences[key] += 1
                pending.append((child, path + '/' + key.replace('~', '~0').replace('/', '~1')
                    + '#' + str(occurrences[key])))
        elif isinstance(value, list):
            pending.extend((child, path + '/' + str(index)) for index, child in enumerate(value))
    report['parse_status'] = ('JSON_PARSED_DUPLICATE_KEYS_PRESERVED' if report['duplicate_keys']
        else 'JSON_PARSED_NO_DUPLICATE_KEYS')

    def issue(kind, path, **values):
        report['issues'].append(dict(kind=kind, path=path, **values))

    def keys_checked(value, path, allowed, required):
        if not isinstance(value, ObjectPairs):
            issue('OBJECT_REQUIRED', path, actual_type=type(value).__name__)
            return False
        keys = {key for key, _ in value.pairs}
        for key in sorted(keys - allowed):
            issue('UNKNOWN_KEY', path, key=key)
        for key in sorted(required - keys):
            issue('MISSING_KEY', path, key=key)
        return True

    def quote_observation(quote, path, declared, role):
        row = dict(path=path, declared_field=declared, quote_role=role,
            association_authoritative=False, matches=[])
        if not isinstance(quote, str):
            report['quotes'].append(dict(row, status='INVALID_QUOTE_TYPE', actual_type=type(quote).__name__))
            return
        try:
            encoded = quote.encode('utf-8')
        except UnicodeEncodeError:
            report['quotes'].append(dict(row, status='INVALID_UNICODE_SCALAR'))
            return
        row.update(quote_sha256=sha(encoded), quote_scalars=len(quote), quote_utf8_bytes=len(encoded))
        if not quote:
            report['quotes'].append(dict(row, status='EMPTY_QUOTE'))
            return
        row['matches'] = [dict(field=number, ranges=ranges) for number, text in texts.items()
            if (ranges := literal_ranges(text, quote))]
        matching_fields = [item['field'] for item in row['matches']]
        if declared not in texts:
            status = 'NO_PRECEDING_VALID_FIELD_HEADER'
        elif declared in matching_fields:
            status = 'PRESENT_IN_DECLARED_FIELD'
        elif matching_fields:
            status = 'ABSENT_DECLARED_PRESENT_OTHER_FIELD'
        else:
            status = 'QUOTE_NOT_FOUND_IN_ANY_FIELD'
        report['quotes'].append(dict(row, status=status))

    def unit_observations(unit, path, declared):
        if not keys_checked(unit, path, UNIT_KEYS, UNIT_KEYS):
            return
        occurrences = Counter()
        for key, value in unit.pairs:
            occurrences[key] += 1
            child_path = path + '/' + key + '#' + str(occurrences[key])
            if key == 'quote':
                quote_observation(value, child_path, declared, 'UNIT_QUOTE')
            elif key == 'parent_quote' and value is not None:
                quote_observation(value, child_path, declared, 'PARENT_QUOTE')
            elif key == 'qualifiers':
                if not isinstance(value, list):
                    issue('QUALIFIERS_ARRAY_REQUIRED', child_path, actual_type=type(value).__name__)
                    continue
                for index, qualifier in enumerate(value):
                    qpath = child_path + '/' + str(index)
                    if not keys_checked(qualifier, qpath, {'kind', 'quote'}, {'kind', 'quote'}):
                        continue
                    occurrence = 0
                    for qkey, qvalue in qualifier.pairs:
                        if qkey == 'quote':
                            occurrence += 1
                            quote_observation(qvalue, qpath + '/quote#' + str(occurrence), declared,
                                'QUALIFIER_QUOTE')

    if not keys_checked(tree, '$', {'fields'}, {'fields'}):
        return dict(report, field_layout_status='NOT_FIELD_OBJECT')
    object_count = 0
    layout_objects = []
    for root_index, (key, array) in enumerate(tree.pairs):
        if key != 'fields':
            continue
        path = '$/fields@pair' + str(root_index)
        if not isinstance(array, list):
            issue('FIELDS_ARRAY_REQUIRED', path, actual_type=type(array).__name__)
            continue
        for index, entry in enumerate(array):
            object_count += 1
            fpath = path + '/' + str(index)
            if not keys_checked(entry, fpath, {'field', 'units'}, {'field', 'units'}):
                layout_objects.append(False)
                continue
            key_counts = Counter(k for k, _ in entry.pairs)
            layout_objects.append(key_counts == {'field': 1, 'units': 1})
            declared = None
            for pair_index, (name, value) in enumerate(entry.pairs):
                ppath = fpath + '/pair' + str(pair_index) + ':' + name
                if name == 'field':
                    integer = type(value) is int
                    declared = value if integer else None
                    report['field_headers'].append(dict(path=ppath, field=declared,
                        integer_type=integer, expected_field=integer and value in texts))
                    if not integer:
                        issue('FIELD_INTEGER_REQUIRED', ppath, actual_type=type(value).__name__)
                    elif value not in texts:
                        issue('FIELD_OUTSIDE_REQUEST', ppath, field=value)
                elif name == 'units':
                    report['units_blocks'].append(dict(path=ppath, declared_field=declared,
                        array_type=isinstance(value, list), association_authoritative=False))
                    if not isinstance(value, list):
                        issue('UNITS_ARRAY_REQUIRED', ppath, actual_type=type(value).__name__)
                        continue
                    for unit_index, unit in enumerate(value):
                        unit_observations(unit, ppath + '/' + str(unit_index), declared)
    observed = [row['field'] for row in report['field_headers'] if row['integer_type']]
    counts = Counter(observed)
    report.update(field_object_count=object_count, observed_field_headers=observed,
        missing_fields=[number for number in texts if number not in counts],
        repeated_fields=[dict(field=number, occurrences=count) for number, count in counts.items() if count > 1],
        out_of_request_fields=sorted(set(observed) - set(texts)))
    layout = (not report['duplicate_keys'] and not report['issues']
        and observed == list(texts) and all(layout_objects) and len(layout_objects) == len(texts))
    report['field_layout_status'] = ('FIELDS_ONCE_IN_REQUEST_ORDER_SEPARATE_OBJECTS' if layout
        else 'NONCANONICAL_FIELD_LAYOUT_DIAGNOSTIC_ONLY')
    report['literal_status_counts'] = dict(Counter(row['status'] for row in report['quotes']))
    return report


def self_check():
    fields = [dict(field=1, text='あ🙂あ🙂'), dict(field=2, text='別のあ🙂')]
    unit = dict(node_kind='ACTION_OR_NONACTION', parent_quote=None, qualifiers=[], quote='🙂', scope_role=None)
    packet = dict(fields=[dict(field=1, units=[unit]), dict(field=2, units=[])])
    valid = audit_wire(fields, canonical(packet))
    assert valid['field_layout_status'] == 'FIELDS_ONCE_IN_REQUEST_ORDER_SEPARATE_OBJECTS'
    ranges = valid['quotes'][0]['matches'][0]['ranges']
    assert [(r['scalar_start'], r['scalar_end'], r['field_utf8_start'], r['field_utf8_end']) for r in ranges] == [(1, 2, 3, 7), (3, 4, 10, 14)]
    assert [m['field'] for m in valid['quotes'][0]['matches']] == [1, 2]
    duplicate = audit_wire(fields, '{"fields":[{"field":1,"units":[],"field":2,"units":[]}]}')
    assert [d['key'] for d in duplicate['duplicate_keys']] == ['field', 'units']
    assert duplicate['observed_field_headers'] == [1, 2] and duplicate['missing_fields'] == []
    assert len(duplicate['units_blocks']) == 2
    repeated = audit_wire(fields, '{"fields":[{"field":1,"units":[]},{"field":1,"units":[]}]}')
    assert repeated['missing_fields'] == [2] and repeated['repeated_fields'] == [dict(field=1, occurrences=2)]
    assert audit_wire(fields, '{"fields":')['parse_status'] == 'JSON_SYNTAX_ERROR'
    weird = audit_wire(fields, '{"fields":[{"units":{},"field":true,"units":[7],"extra":0}]}')
    assert {'UNITS_ARRAY_REQUIRED', 'FIELD_INTEGER_REQUIRED', 'UNKNOWN_KEY', 'OBJECT_REQUIRED'} <= {x['kind'] for x in weird['issues']}
    no_header = audit_wire(fields, '{"fields":[{"units":[' + canonical(unit) + '],"field":1}]}')
    assert no_header['quotes'][0]['status'] == 'NO_PRECEDING_VALID_FIELD_HEADER'
    invalid_unicode = canonical(packet).replace('🙂', '\\ud800')
    assert audit_wire(fields, invalid_unicode)['quotes'][0]['status'] == 'INVALID_UNICODE_SCALAR'
    wrong = dict(packet); wrong['fields'] = [dict(field=1, units=[dict(unit, quote='別の')]), dict(field=2, units=[])]
    assert audit_wire(fields, canonical(wrong))['quotes'][0]['status'] == 'ABSENT_DECLARED_PRESENT_OTHER_FIELD'
    assert audit_wire(fields, 'null')['field_layout_status'] == 'NOT_FIELD_OBJECT'
    assert audit_wire(fields, '{"fields":NaN}')['parse_status'] == 'NON_STANDARD_JSON_CONSTANT'
    escaped_key = audit_wire(fields, '{"fields":[],"\\ud800":0}')
    report_json(escaped_key).encode('utf-8')
    return dict(status='SELF_CHECK_PASS', cases=11, model_calls=0, training_updates=0, db_calls=0)


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument('--trial-root', '--root', dest='root', type=Path)
    cli.add_argument('--output', type=Path)
    cli.add_argument('--self-check', action='store_true')
    args = cli.parse_args()
    if args.self_check:
        assert args.root is None and args.output is None
        print(canonical(self_check()))
        return
    assert args.root is not None and args.output is not None
    root, output = args.root.resolve(), args.output.resolve()
    assert not output.exists(), 'new_output_required'
    assert not output.is_relative_to(root), 'immutable_trial_root_output_forbidden'
    inputs = {}

    def remember(path):
        path = Path(path).resolve()
        assert output != path
        raw = path.read_bytes()
        inputs[path] = raw
        return raw

    reports = []
    phases = {}
    for phase in ('before', 'after'):
        rows = read_metadata(remember(root / (phase + '.private.json')))['cases']
        assert rows and len({row['id'] for row in rows}) == len(rows)
        assert all(isinstance(row['id'], str) and 0 < len(row['id']) <= 128
            and '/' not in row['id'] and '\\' not in row['id'] for row in rows), 'safe_case_id_required'
        phases[phase] = rows
        for row in rows:
            request, response = row['request'], row['response']
            messages = request['messages']
            assert len(messages) == 2 and [m['role'] for m in messages] == ['system', 'user']
            assert digest(messages) == request['messages_sha256'] == response['messages_sha256']
            assert request['request_ref'] == response['request_ref']
            raw = response['raw']
            assert sha(raw.encode('utf-8')) == response['raw_sha256']
            if phase == 'after':
                prefix = root / ('after-' + row['id'])
                assert remember(str(prefix) + '.raw.txt') == raw.encode('utf-8')
                assert read_metadata(remember(str(prefix) + '.request.private.json')) == dict(row=row['row'], request=request)
                assert read_metadata(remember(str(prefix) + '.response.private.json')) == dict(row=row['row'], request=request, response=response)
            material = read_metadata(messages[1]['content'])
            report = audit_wire(material['fields'], raw)
            reports.append(dict(phase=phase, id=row['id'], request_ref=request['request_ref'],
                request_sha256=digest(request), response_sha256=digest(response),
                finish_reason=response['finish_reason'], diagnostic=report))
    assert [r['id'] for r in phases['before']] == [r['id'] for r in phases['after']]
    assert all(a['request'] == b['request'] and a['row'] == b['row']
        for a, b in zip(phases['before'], phases['after']))
    assert all(path.read_bytes() == raw for path, raw in inputs.items()), 'input_bytes_changed'
    result = dict(schema_version='analysis_trial_wire_diagnostics.v1', diagnostic_only=True,
        admission=False, model_calls=0, model_loads=0, training_updates=0, db_calls=0,
        raw_repairs=0, new_teachers=0, input_bytes_unchanged=True,
        source_sha256=sha(Path(__file__).read_bytes()),
        inputs={str(path.relative_to(root)): dict(bytes=len(raw), sha256=sha(raw))
            for path, raw in inputs.items()},
        cases=reports, limitations=[
            'Ordered-pair associations explain malformed raw; they are not accepted field bindings.',
            'Literal presence and field layout do not prove node kind, actor, meaning, or admission.',
            'Coordinates are in decoded field text, not the canonical source envelope.',
            'A missing field or cross-field quote is observed without repairing or teacherizing evaluation raw.'])
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open('x', encoding='utf-8') as stream:
        stream.write(report_json(result) + '\n')
    print(canonical(dict(status='COMPLETE_CPU_DIAGNOSTIC_ONLY', cases=len(reports),
        input_files=len(inputs), output_sha256=sha(output.read_bytes()),
        parse_status_counts=dict(Counter(row['diagnostic']['parse_status'] for row in reports)))))


if __name__ == '__main__':
    main()
