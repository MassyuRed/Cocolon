'use strict';

const path = require('node:path');
const test = require('./V16_INSPECTOR_V2_SINGLE_CREATE_CANDIDATE.js')._test;

let cases = 0;

function ok(value, message) {
  cases += 1;
  if (!value) throw new Error('HARNESS_FAIL_' + message);
}

function equal(actual, expected, message) {
  ok(actual === expected, message);
}

function throws(call, message) {
  let seen = false;
  try {
    call();
  } catch (_error) {
    seen = true;
  }
  ok(seen, message);
}

function scriptedWriter(steps, sink) {
  let index = 0;
  return (fd, buffer, offset, length) => {
    const step = index < steps.length ? steps[index++] : length;
    if (step === 'throw') throw new Error('FIXTURE_SECRET');
    if (step === 0) return 0;
    const amount = Math.min(step, length);
    sink[fd] = Buffer.concat([
      sink[fd] || Buffer.alloc(0),
      buffer.subarray(offset, offset + amount)
    ]);
    return amount;
  };
}

function terminal(program, steps) {
  const sink = { 1: Buffer.alloc(0), 2: Buffer.alloc(0) };
  const exit = test.terminalDispatch(program, scriptedWriter(steps, sink));
  return {
    exit,
    out: sink[1].toString('ascii'),
    err: sink[2].toString('ascii')
  };
}

let result = terminal(() => Buffer.from('abc\n', 'ascii'), [99]);
equal(result.exit, 0, 'terminal_full_exit');
equal(result.out, 'abc\n', 'terminal_full_stdout');
equal(result.err, '', 'terminal_full_stderr');

result = terminal(() => Buffer.from('abc\n', 'ascii'), [1, 2, 99]);
equal(result.exit, 0, 'terminal_short_complete_exit');
equal(result.out, 'abc\n', 'terminal_short_complete_stdout');

result = terminal(() => { throw { v16Stop: 'S6_C01' }; }, [1, 1, 99]);
equal(result.exit, 64, 'terminal_known_exit');
equal(result.out, '', 'terminal_known_stdout0');
equal(result.err, 'S6_C01\n', 'terminal_known_stderr');

result = terminal(() => { throw new Error('DO_NOT_LEAK'); }, [99]);
equal(result.exit, 64, 'terminal_unknown_exit');
equal(result.err, 'S6_INTERNAL\n', 'terminal_unknown_sanitized');
ok(!result.err.includes('DO_NOT_LEAK'), 'terminal_no_secret');

result = terminal(() => Buffer.from('abc\n', 'ascii'), [0, 99]);
equal(result.exit, 74, 'terminal_zero_exit');
equal(result.out, '', 'terminal_zero_stdout');
equal(result.err, 'S6_OUTPUT_STOP\n', 'terminal_zero_stderr');

result = terminal(() => Buffer.from('abc\n', 'ascii'), [2, 'throw', 99]);
equal(result.exit, 74, 'terminal_partial_exit');
equal(result.out, 'ab', 'terminal_partial_nonauthoritative');
equal(result.err, 'S6_OUTPUT_STOP\n', 'terminal_partial_sanitized');

result = terminal(() => { throw { v16Stop: 'S6_C02' }; }, [0]);
equal(result.exit, 75, 'terminal_stderr_unreportable');

throws(() => test.writeAll(1, Buffer.from('x'), scriptedWriter([0], {})), 'write_zero');
throws(() => test.writeAll(1, Buffer.from('x'), scriptedWriter([-1], {})), 'write_negative');
throws(() => test.writeAll(1, Buffer.from('x'), scriptedWriter([1.5], {})), 'write_fraction');

const root = '/fixture/root';
equal(test.underRoot(root, 'a/b.js'), path.join(root, 'a', 'b.js'), 'path_under');
throws(() => test.underRoot(root, '../b.js'), 'path_traversal');
throws(() => test.underRoot(root, 'a\\b.js'), 'path_backslash');
throws(() => test.underRoot(root, '/a/b.js'), 'path_absolute');
throws(() => test.underRoot(root, 'a//b.js'), 'path_double_slash');

equal(test.matchingFinal('(a)'), 2, 'c03_basic_final');
equal(test.stripOuterExact('((a))'), 'a', 'c03_repeat');
equal(test.stripOuterExact('(a) '), '(a) ', 'c03_trailing_space');
equal(test.stripOuterExact(' (a)'), ' (a)', 'c03_leading_space');
equal(test.stripOuterExact('(a)\n'), '(a)\n', 'c03_trailing_lf');
equal(test.stripOuterExact('(a)//x'), '(a)//x', 'c03_trailing_comment');
equal(test.stripOuterExact('(/[(]/.test(x))'), '/[(]/.test(x)', 'c03_regex');
equal(test.stripOuterExact('(")")'), '")"', 'c03_quote');
equal(test.matchingFinal("('x)"), -1, 'c03_unclosed_quote');

equal(test.decodeOneMarker("'abc'"), 'abc', 'c04_single_plain');
equal(test.decodeOneMarker('"abc"'), 'abc', 'c04_double_plain');
equal(test.decodeOneMarker('"a\\n\\x41"'), 'a\nA', 'c04_double_escape');
equal(test.decodeOneMarker("'a\\\\b'"), 'a\\b', 'c04_single_slash');
equal(test.decodeOneMarker("'a\\'b'"), "a'b", 'c04_single_quote');
equal(test.decodeOneMarker(' "a"'), null, 'c04_no_left_trim');
equal(test.decodeOneMarker('"a" '), null, 'c04_no_right_trim');
equal(test.decodeOneMarker('"a"+"b"'), null, 'c04_no_concat');
equal(test.decodeOneMarker('"\\u0041"'), null, 'c04_no_unicode_escape');
equal(test.decodeOneMarker('"\\x0"'), null, 'c04_short_hex');
equal(test.decodeOneMarker("'\\n'"), null, 'c04_single_escape_set');
equal(test.decodeOneMarker(1), null, 'c04_no_coercion');

equal(test.renderFixed('S6_C02', 'A@@ID@@B@@N@@C@@B64@@', {
  ID: { kind: 'id', value: 'ok_1' },
  N: { kind: 'uint', value: '2' },
  B64: { kind: 'b64', value: 'YQ==' }
}), 'Aok_1B2CYQ==', 'render_fixed');
throws(() => test.renderFixed('S6_C02', '@@ID@@@@ID@@', {
  ID: { kind: 'id', value: 'x' }
}), 'render_duplicate');
throws(() => test.renderFixed('S6_C02', '@@ID@@', {
  ID: { kind: 'id', value: 'x;bad' }
}), 'render_injection');

const fixture = [
  "const TOOL_VERSION = 'V2';",
  "const SELF_BASENAME = 'v16_public_gate_execution_continuation_carrier_v3_t06_sanitized_shape_extractor_v2.js';",
  "const decoy = 'function lexDecoy(source) { regex slash division quote string }';",
  'function lexNaturalExpression(source) {',
  "  const regex = 'regex'; const slash = 'slash'; const division = 'division';",
  "  const quote = 'quote'; const string = 'string';",
  '  return { source, regex, slash, division, quote, string };',
  '}',
  'function stripOuterParentheses(text) {',
  "  if (text.startsWith('(') && text.endsWith(')')) return text.slice(1, -1);",
  '  return text;',
  '}',
  'function exactMarkerArgument(argument, marker) {',
  '  const exact = argument; const equal = marker; const match = exact === equal;',
  '  return match;',
  '}',
  ''
].join('\n');

const c01 = test.c01Fragment(fixture);
const c02 = test.c02Fragment(fixture);
const c03 = test.c03Fragment(fixture);
const c04 = test.c04Fragment(fixture);
equal([c01.id, c02.id, c03.id, c04.id].join(','), 'C01,C02,C03,C04', 'exact4_ids');
const proof = test.verifyFragments(fixture, [c01, c02, c03, c04]);
equal(proof.gaps.length, 5, 'five_gaps');
ok(proof.outsideSource.equals(proof.outsideCandidate), 'outside_equal');
ok(proof.candidate.includes(Buffer.from('V3', 'ascii')), 'c01_version_changed');
ok(proof.candidate.includes(Buffer.from('extractor_v3.js', 'ascii')), 'c01_path_changed');

const duplicate = fixture.replace(
  'function stripOuterParentheses(text) {',
  'function stripOtherParentheses(text) { return text.slice(1, -1); }\nfunction stripOuterParentheses(text) {'
);
throws(() => test.c03Fragment(duplicate), 'dual_candidate_ambiguity');
throws(() => test.c01Fragment(fixture.replace(
  "const TOOL_VERSION = 'V2';",
  "const TOOL_VERSION = 'V2';\nconst VERSION = 'V2';"
)), 'c01_duplicate_version');
throws(() => test.c01Fragment(fixture.replace('SELF_BASENAME', 'OTHER_NAME')), 'c01_missing_self');

const syntheticSource = 'aaOLD1bbOLD2ccOLD3ddOLD4ee';
let at = 0;
const fragments = ['OLD1', 'OLD2', 'OLD3', 'OLD4'].map((old, index) => {
  const start = syntheticSource.indexOf(old, at);
  at = start + old.length;
  return {
    id: 'C0' + String(index + 1),
    start,
    end: start + old.length,
    old,
    new: 'NEW' + String(index + 1)
  };
});
const syntheticProof = test.verifyFragments(syntheticSource, fragments);
equal(syntheticProof.gaps.length, 5, 'golden_five_gaps');
ok(syntheticProof.outsideSource.equals(syntheticProof.outsideCandidate), 'golden_outside');
const overlap = fragments.map((row) => ({ ...row }));
overlap[1].start = overlap[0].end - 1;
throws(() => test.verifyFragments(syntheticSource, overlap), 'overlap_stop');
const duplicateOld = syntheticSource + 'OLD1';
throws(() => test.verifyFragments(duplicateOld, fragments), 'duplicate_old_stop');

const target = test.buildTarget(fragments);
ok(target[target.length - 1] === 10, 'target_final_lf');
ok(!target.includes(13), 'target_cr0');
ok([...target].every((byte) => byte <= 0x7f), 'target_ascii');
const targetText = target.toString('ascii');
equal((targetText.match(/process\.argv\.length!==3/g) || []).length, 1, 'target_root_only_argv');
equal((targetText.match(/FRAGMENTS_B64=/g) || []).length, 1, 'target_fragment_config');
ok(targetText.includes("const SOURCE_REL=utf8(SOURCE_REL_B64),TARGET_REL=utf8(TARGET_REL_B64);"), 'target_same_relative_objects');
ok(targetText.includes("'*** Add File: '+TARGET_REL"), 'target_patch_same_relative');
ok(!targetText.includes('writeFileSync'), 'target_no_direct_write');

const canonical = test.canonical({ v16_record_pairs: [
  ['schema', 'fixture'],
  ['ok', true],
  ['count', 1]
] });
equal(canonical.toString('ascii'), '{"schema":"fixture","ok":true,"count":1}\n', 'canonical_order');

process.stdout.write('PASS ' + String(cases) + '\n');
