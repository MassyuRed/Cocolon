'use strict';
// Pure JS planner compared with fixed results from the existing Python B9.
// All measurements/partitions are synthetic; no native or fit/save admission.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/piece-b9-wrap-oracle.json'), 'utf8'));
const source = fs.readFileSync(path.join(ROOT, 'features/piece/pieceMeasuredWrap.js'), 'utf8');
const context = vm.createContext({});
vm.runInContext(source.replace(/^export /gm, '') + '\nglobalThis.plan = planPieceMeasuredRows;', context,
  { filename: 'features/piece/pieceMeasuredWrap.js' });
const plan = context.plan;
const copy = value => JSON.parse(JSON.stringify(value));
const unavailable = error => error?.message === 'PIECE_NATIVE_MEASUREMENT_UNAVAILABLE';

test('oracle identifies exact Python owner and separates synthetic metrics from native acceptance', () => {
  assert.equal(fixture.fixture_version, 'piece.synthetic_b9_wrap_oracle.v1');
  assert.equal(fixture.synthetic_only, true);
  assert.equal(fixture.native_device_verified, false);
  assert.equal(fixture.source.path, 'ai/services/ai_inference/piece_v2_layout.py');
  assert.match(fixture.source.commit, /^[0-9a-f]{40}$/);
  assert.match(fixture.source.sha256, /^[0-9a-f]{64}$/);
  assert.equal(fixture.source.unicode_version, '15.0.0');
  assert.equal(new Set(fixture.cases.map(c => c.id)).size, fixture.cases.length);
  assert.ok(fixture.cases.some(c => c.python_constrained_allocator_used && c.expected));
  assert.ok(fixture.cases.some(c => c.expected === null));
});

for (const c of fixture.cases) test('Python B9 measured-row parity: ' + c.id, () => {
  const input = copy(c.input), measurements = copy(c.measurements);
  const before = JSON.stringify({ input, measurements });
  const actual = plan(input, c.sizeIndex, measurements);
  assert.deepEqual(copy(actual), c.expected);
  assert.equal(JSON.stringify({ input, measurements }), before, 'planner cannot mutate text or metrics');
  if (actual === null) return;
  assert.deepEqual(Array.from(actual.groups, group => group.join('')), input.blocks);
  assert.ok(actual.totalHeight <= input.contentHeight);
  for (let b = 0; b < actual.groups.length; b++) {
    const boundaries = new Set(measurements[b].boundaries);
    let end = 0;
    for (const row of actual.groups[b]) {
      end += row.length;
      assert.ok(boundaries.has(end), 'chosen row must end at a supplied grapheme boundary');
    }
    assert.equal(end, input.blocks[b].length);
  }
});

const validCase = () => copy(fixture.cases.find(c => c.id === 'short_bridge'));
for (const [label, mutate] of [
  ['missing substring', c => c.measurements[0].rows.pop()],
  ['duplicate substring', c => { c.measurements[0].rows[1] = [...c.measurements[0].rows[0]]; }],
  ['reversed substring', c => { c.measurements[0].rows[0][1] = c.measurements[0].rows[0][0]; }],
  ['out-of-range substring', c => { c.measurements[0].rows[0][1] = c.measurements[0].boundaries.length; }],
  ['nonfinite advance', c => { c.measurements[0].rows[0][2] = NaN; }],
  ['negative advance', c => { c.measurements[0].rows[0][2] = -1; }],
  ['inverted ink box', c => { c.measurements[0].rows[0][5] = -1; }],
  ['incomplete boundary tail', c => { c.measurements[0].boundaries[c.measurements[0].boundaries.length - 1]--; }],
  ['duplicate boundary', c => { c.measurements[0].boundaries[1] = 0; }],
  ['missing paragraph measurement', c => { c.measurements = []; }],
  ['nonfinite content width', c => { c.input.contentWidth = Infinity; }],
  ['missing font candidate', c => { c.sizeIndex = c.input.sizes.length; }],
]) test('invalid measured table is unavailable: ' + label, () => {
  const c = validCase(); mutate(c);
  assert.throws(() => plan(c.input, c.sizeIndex, c.measurements), unavailable);
});

test('evident split combining, ZWJ and surrogate boundaries cannot become accepted rows', () => {
  for (const [text, boundaries] of [
    ['e\u0301', [0, 1, 2]],
    ['👩\u200d💻', [0, 2, 3, 5]],
    ['👩', [0, 1, 2]],
  ]) {
    const input = { blocks: [text], contentWidth: 888, contentHeight: 1086, sizes: [48],
      lineRatio: 1.55, paragraphRatio: 0.65, alignment: 'left' };
    const rows = [];
    for (let a = 0; a + 1 < boundaries.length; a++) for (let b = a + 1; b < boundaries.length; b++) {
      rows.push([a, b, 48 * (b - a), 0, -36, 48 * (b - a), 12]);
    }
    assert.throws(() => plan(input, 0, [{ boundaries, rows }]), unavailable);
  }
});
