"""One-shot read-only comparison of saved inputs, teachers and untouched raw.

This is an offline diagnostic, not a receiver, grammar, repair or model runner.
Only complete JSON members of a truncated array are inspected. No closers are
added and no partial result becomes an adopted candidate.
"""
import argparse
import hashlib
import importlib.metadata
import json
from pathlib import Path
import re
import time


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def members(text, start=0):
    dec = json.JSONDecoder()
    pos = start
    while pos < len(text) and text[pos].isspace():
        pos += 1
    if text[pos:pos + 1] != '[':
        raise ValueError('array expected')
    pos += 1
    values = []
    while pos < len(text):
        while pos < len(text) and text[pos].isspace():
            pos += 1
        if text[pos:pos + 1] == ']':
            return values, pos + 1, True
        begin = pos
        try:
            value, end = dec.raw_decode(text, pos)
        except json.JSONDecodeError:
            return values, begin, False
        values.append((value, begin, end))
        pos = end
        while pos < len(text) and text[pos].isspace():
            pos += 1
        if text[pos:pos + 1] == ',':
            pos += 1
        elif text[pos:pos + 1] == ']':
            return values, pos + 1, True
        else:
            return values, pos, False
    return values, pos, False


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--cpu', type=Path, required=True)
    parser.add_argument('--raw', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    started = time.perf_counter()
    ep = args.cpu / 'eval_inputs11.json'
    tp = args.cpu / 'train_messages11.jsonl'
    rp = [args.raw / ('before_FT-' + key + '-AFTER-ANSWER.jsonl')
          for key in ('BOOK', 'SHOP')]
    paths = [ep, tp, *rp]
    before = {p.name: sha(p) for p in paths}
    evals = json.loads(ep.read_text())
    teachers = [json.loads(s) for s in tp.read_text().splitlines() if s]
    results = []
    for index, path in enumerate(rp):
        raw = json.loads(path.read_text())
        case = next(e for e in evals if e['case_id'] == raw['case_id'])
        teacher = next(t for t in teachers if t['id'] == raw['case_id'])
        assert case['messages'] == teacher['messages'][:-1]
        target = json.loads(teacher['messages'][-1]['content'])
        text = raw['raw_text']
        assert hashlib.sha256(text.encode()).hexdigest() == raw['raw_utf8_sha256']
        roots, stop, closed = members(text)
        assert len(roots) >= 4
        c_start = roots[3][2]
        while text[c_start] in ' \r\n\t,':
            c_start += 1
        c_members, _, c_closed = members(text, c_start)
        assert c_members
        first = c_members[0]
        prefix = text[:first[2]]
        spec = json.loads(case['messages'][1]['content'])['output_spec']
        phrase = 'awareness/no contact, returned book, counterfactual regret and current concern'
        book_repeat = '遅れた本を返すことと、友人に謝ったことについて、観察します。'
        aliases = [r[0] for r in roots[2][0]]
        refs = sorted(set(re.findall(r'"(@[A-Za-z][A-Za-z0-9_]*)"', text)))
        undefined = [r for r in refs if r[1:] not in aliases]
        raw_error = None
        try:
            json.loads(text)
        except json.JSONDecodeError as error:
            raw_error = {'message': error.msg, 'char_offset': error.pos}
        results.append({
            'case_id': raw['case_id'],
            'actual_finish_reason': raw['finish_reason'],
            'output_tokens': raw['output_tokens'],
            'cap': case['max_new_tokens'],
            'eos_reached': raw['eos_reached'],
            'strict_json_error': raw_error,
            'completed_root_members_before_first_unfinished': len(roots),
            'root_array_closed': closed,
            'output_aliases': aliases,
            'target_aliases': [r[0] for r in target[2]],
            'undeclared_alias_refs_in_raw_string_scan': undefined,
            'c_start_char': c_start,
            'first_completed_c_member': first[0],
            'first_completed_c_member_chars': [first[1], first[2]],
            'c_array_closed': c_closed,
            'expected_first_c_member_kind': 'list of claim rows, each exactly 10 cells',
            'target_first_c_member_claims': len(target[4][0]),
            'target_claim_row_lengths': sorted(set(map(len, target[4][0]))),
            'raw_first_c_member_length': len(first[0]),
            'raw_first_c_member_all_claim_rows': all(isinstance(v, list) and len(v) == 10 for v in first[0]),
            'prefix_char_end': len(prefix),
            'prose_spec_book_phrase_present': phrase in spec['prose_requirements'],
            'book_phrase_raw_occurrences': text.count(phrase),
            'book_repeat_raw_occurrences': text.count(book_repeat),
            'explanation_change_raw_occurrences': text.count('explanation change'),
            'teacher_full_output_preserved': True,
            'train_eval_messages_identical': True,
        })
    after = {p.name: sha(p) for p in paths}
    assert before == after
    packages = {}
    for name in ('transformers', 'tokenizers', 'torch', 'xgrammar', 'llguidance', 'outlines'):
        try:
            packages[name] = importlib.metadata.version(name)
        except importlib.metadata.PackageNotFoundError:
            packages[name] = None
    report = {
        'schema': 'cocolon.saved_raw_structure_reading.v1',
        'source_commit': '116617b2b40c145aa3f2a55b05a51052a700c10e',
        'status': 'CPU_READ_ONLY_COMPARISON_COMPLETE',
        'input_sha256': before,
        'inputs_unchanged': before == after,
        'cases': results,
        'packages_metadata_only': packages,
        'effects': {'model_loads': 0, 'model_forwards': 0, 'training_updates': 0,
                    'generations': 0, 'receiver_calls': 0, 'repairs': 0,
                    'source_writes': 0, 'gpu_lifecycle_operations': 0},
        'limitations': ['not a grammar implementation or grammar-success test',
                        'not a model capacity or training-data adequacy conclusion',
                        'actual rejection stays TOKEN_LIMIT, not inferred semantic rejection'],
        'seconds': time.perf_counter() - started,
    }
    with args.out.open('x', encoding='utf-8') as stream:
        json.dump(report, stream, ensure_ascii=False, indent=2)
        stream.write('\n')
    print(json.dumps({'status': report['status'], 'seconds': report['seconds'],
                      'inputs_unchanged': True, 'cases': [
                          {'id': r['case_id'], 'c_first_length': r['raw_first_c_member_length'],
                           'prefix_end': r['prefix_char_end'], 'undefined': r['undeclared_alias_refs_in_raw_string_scan'],
                           'repeat_book': r['book_repeat_raw_occurrences'],
                           'repeat_explanation': r['explanation_change_raw_occurrences'],
                           'book_phrase_from_spec': r['prose_spec_book_phrase_present'] and r['book_phrase_raw_occurrences'] > 0}
                          for r in results], 'packages': packages}, ensure_ascii=False))


if __name__ == '__main__':
    main()
