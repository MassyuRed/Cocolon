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
const v4Profile = 'piece.rn_native_preview.prototype.v4';
const widthTable = (table, width) => ({ ...table, version: 'piece.native_candidates.v4', contentWidth: width,
  rows: table.rows.map(row => row[2] > width ? [row[0], row[1], row[2], 'width_overflow'] : [...row]) });

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

for (const c of fixture.cases) test('explicit v4 retains the unchanged Python B9 result: ' + c.id, () => {
  const input = { ...copy(c.input), candidateProfile: v4Profile };
  const measurements = c.measurements.map(table => widthTable(table, input.contentWidth));
  const before = JSON.stringify({ input, measurements });
  assert.deepEqual(copy(plan(input, c.sizeIndex, measurements)), c.expected);
  assert.equal(JSON.stringify({ input, measurements }), before);
  measurements.forEach(table => table.rows.reverse());
  assert.deepEqual(copy(plan(input, c.sizeIndex, measurements)), c.expected);
});

test('v4 overflow cannot reach viewpoint protection or become a selected row', () => {
  const text = '私にとってその日。', input = { blocks: [text], contentWidth: 192, contentHeight: 1000,
    sizes: [48], lineRatio: 1.55, paragraphRatio: 0.65, alignment: 'left' };
  const boundaries = Array.from({ length: text.length + 1 }, (_, i) => i), rows = [];
  for (let start = 0; start < text.length; start++) for (let end = start + 1; end <= text.length; end++) {
    rows.push([start, end, 48 * (end - start), 0, -36, 48 * (end - start), 12]);
  }
  const table = { boundaries, rows }, original = plan(input, 0, [table]);
  assert.ok(original);
  const bounded = widthTable(table, input.contentWidth);
  assert.equal(bounded.rows.find(row => row[0] === 0 && row[1] === 5)[3], 'width_overflow');
  assert.deepEqual(copy(plan({ ...input, candidateProfile: v4Profile }, 0, [bounded])), copy(original));
});

test('v4 does not assume monotonic width across independently shaped ranges', () => {
  const input = { blocks: ['あい'], contentWidth: 20, contentHeight: 20, sizes: [10], lineRatio: 1, paragraphRatio: 0 };
  const table = { boundaries: [0, 1, 2], rows: [[0, 1, 30, 0, -8, 30, 2], [0, 2, 10, 0, -8, 10, 2], [1, 2, 30, 0, -8, 30, 2]] };
  const actual = plan({ ...input, candidateProfile: v4Profile }, 0, [widthTable(table, 20)]);
  assert.deepEqual(copy(actual), copy(plan(input, 0, [table])));
  assert.deepEqual(copy(actual.groups), [['あい']]);
});

test('v4 keeps exact-width ink, rejects overhang and enforces both sides of the strict width tag', () => {
  const width = 16, bytes = Buffer.alloc(8); bytes.writeDoubleLE(width);
  bytes.writeBigUInt64LE(bytes.readBigUInt64LE() + 1n); const above = bytes.readDoubleLE();
  const input = { candidateProfile: v4Profile, blocks: ['a'], contentWidth: width, contentHeight: 20,
    sizes: [10], lineRatio: 1, paragraphRatio: 0 };
  const valid = { version: 'piece.native_candidates.v4', contentWidth: width, boundaries: [0, 1],
    rows: [[0, 1, width, -0, -8, width, 2]] };
  assert.deepEqual(copy(plan(input, 0, [valid])).groups, [['a']]);
  for (const row of [[0, 1, width, 0, -8, above, 2], [0, 1, width, -1, -8, width, 2],
    [0, 1, above, 'width_overflow']]) assert.equal(plan(input, 0, [{ ...valid, rows: [row] }]), null);
  for (const row of [[0, 1, width, 'width_overflow'], [0, 1, above, 0, -8, above, 2],
    [0, 1, width, 'width_overflow', 0, 0, 0], [0, 1, width, null], [0, 1, NaN, 'width_overflow'],
    [0, 1, Infinity, 'width_overflow'], [0, 1, -1, 'width_overflow']]) {
    assert.throws(() => plan(input, 0, [{ ...valid, rows: [row] }]), unavailable);
  }
  for (let position = 2; position < 7; position++) for (const value of [NaN, Infinity, -Infinity, null, '1', undefined]) {
    const row = [...valid.rows[0]]; row[position] = value;
    assert.throws(() => plan(input, 0, [{ ...valid, rows: [row] }]), unavailable);
  }
});

test('v4 tables bind both the exact width and explicit input profile', () => {
  const c = copy(fixture.cases.find(c => c.id === 'short_bridge'));
  const input = { ...c.input, candidateProfile: v4Profile };
  const measurements = c.measurements.map(table => widthTable(table, input.contentWidth));
  for (const width of [input.contentWidth + 0.000001, 0, NaN, Infinity, String(input.contentWidth), undefined]) {
    const changed = measurements.map(table => ({ ...table, contentWidth: width }));
    assert.throws(() => plan(input, c.sizeIndex, changed), unavailable);
  }
  assert.throws(() => plan(c.input, c.sizeIndex, measurements), unavailable);
  assert.throws(() => plan({ ...input, candidateProfile: 'piece.rn_native_preview.prototype.v3' }, c.sizeIndex, measurements), unavailable);
  assert.throws(() => plan(input, c.sizeIndex, c.measurements), unavailable);
  for (const version of [undefined, 'piece.native_candidates.v1', 'piece.native_candidates.v2', 'piece.native_candidates.v3']) {
    const old = { boundaries: [0, 1], version, rows: [[0, 1, 9999, 'width_overflow']] };
    assert.throws(() => plan({ ...c.input, blocks: ['a'] }, c.sizeIndex, [old]), unavailable);
  }
});

const validCase = () => copy(fixture.cases.find(c => c.id === 'short_bridge'));
test('complete measured tables retain the same B9 result in reverse row order', () => {
  for (const c of fixture.cases) {
    const measurements = copy(c.measurements);
    for (const table of measurements) table.rows.reverse();
    assert.deepEqual(copy(plan(copy(c.input), c.sizeIndex, measurements)), c.expected);
  }
});
test('v8 preserves every Python B9 result with the complete v5 table in either row order', () => {
  for (const c of fixture.cases) {
    const input = { ...copy(c.input), candidateProfile: 'piece.rn_native_preview.prototype.v8' };
    const tables = copy(c.measurements).map(table => ({ ...table, version: 'piece.native_candidates.v5' }));
    assert.deepEqual(copy(plan(input, c.sizeIndex, tables)), c.expected, c.id);
    tables.forEach(table => table.rows.reverse());
    assert.deepEqual(copy(plan(input, c.sizeIndex, tables)), c.expected, c.id);
  }
});
test('v9 preserves every Python B9 result with complete v5 metrics in both row orders', () => {
  for (const c of fixture.cases) {
    const input = { ...copy(c.input), candidateProfile: 'piece.rn_native_preview.prototype.v9' };
    const tables = copy(c.measurements).map(table => ({ ...table, version: 'piece.native_candidates.v5' }));
    assert.deepEqual(copy(plan(input, c.sizeIndex, tables)), c.expected, c.id);
    tables.forEach(table => table.rows.reverse());
    assert.deepEqual(copy(plan(input, c.sizeIndex, tables)), c.expected, c.id);
  }
});
test('every metric position rejects nonfinite, nonnumeric and missing values', () => {
  for (let field = 2; field < 7; field++) for (const invalid of [NaN, Infinity, -Infinity, '1', null, undefined]) {
    const c = validCase(); c.measurements[0].rows[0][field] = invalid;
    assert.throws(() => plan(c.input, c.sizeIndex, c.measurements), unavailable);
  }
  for (let field = 2; field < 7; field++) {
    const c = validCase(); delete c.measurements[0].rows[0][field];
    assert.throws(() => plan(c.input, c.sizeIndex, c.measurements), unavailable);
  }
});
test('kinsoku protects internal boundaries without rejecting paragraph start or terminal boundary', () => {
  const input = { blocks: ['、a「'], contentWidth: 30, contentHeight: 40, sizes: [10], lineRatio: 1, paragraphRatio: 0 };
  const table = { boundaries: [0, 1, 2, 3], rows: [] };
  for (let start = 0; start < 3; start++) for (let end = start + 1; end <= 3; end++) {
    table.rows.push([start, end, (end - start) * 10, 0, -8, (end - start) * 10, 2]);
  }
  assert.deepEqual(copy(plan(input, 0, [table])).groups, [['、a「']]);
});
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


const v5Profile = 'piece.rn_native_preview.prototype.v5';
for (const c of fixture.cases) test('explicit v5 keeps the unchanged B9 algorithm for the same synthetic metrics: ' + c.id, () => {
  const input = { ...copy(c.input), candidateProfile: v5Profile };
  const measurements = c.measurements.map(table => ({ ...copy(table), version: 'piece.native_candidates.v5' }));
  const before = JSON.stringify({ input, measurements });
  assert.deepEqual(copy(plan(input, c.sizeIndex, measurements)), c.expected);
  assert.equal(JSON.stringify({ input, measurements }), before);
});

test('v5 binds the new table on both sides and forbids v4 omitted ink', () => {
  const c = validCase(), input = { ...c.input, candidateProfile: v5Profile };
  const tables = c.measurements.map(table => ({ ...table, version: 'piece.native_candidates.v5' }));
  for (const profile of [undefined, 'piece.rn_native_preview.prototype.v3', v4Profile]) {
    assert.throws(() => plan({ ...input, candidateProfile: profile }, c.sizeIndex, tables), unavailable);
  }
  for (const version of [undefined, 'piece.native_candidates.v3', 'piece.native_candidates.v4']) {
    assert.throws(() => plan(input, c.sizeIndex, tables.map(table => ({ ...table, version }))), unavailable);
  }
  const tiny = { candidateProfile: v5Profile, blocks: ['a'], contentWidth: 20, contentHeight: 20,
    sizes: [10], lineRatio: 1, paragraphRatio: 0 };
  assert.throws(() => plan(tiny, 0, [{ version: 'piece.native_candidates.v5', boundaries: [0, 1],
    rows: [[0, 1, 9999, 'width_overflow']] }]), unavailable);
});

test('v5 search fit and search null are metric-table results, not claims about independent selected lines', () => {
  const input = { candidateProfile: v5Profile, blocks: ['ab'], contentWidth: 20, contentHeight: 10,
    sizes: [10], lineRatio: 1, paragraphRatio: 0 };
  const table = { version: 'piece.native_candidates.v5', boundaries: [0, 1, 2],
    rows: [[0, 1, 10, 0, -8, 10, 2], [0, 2, 20, 0, -8, 20, 2], [1, 2, 10, 0, -8, 10, 2]] };
  assert.deepEqual(copy(plan(input, 0, [table])).groups, [['ab']]);
  const otherContext = { ...table, rows: table.rows.map(row => [row[0], row[1], 21, 0, -8, 21, 2]) };
  assert.equal(plan(input, 0, [otherContext]), null);
  assert.deepEqual(copy(plan({ ...input, candidateProfile: undefined }, 0, [{ ...table, version: undefined }])).groups, [['ab']]);
});

const containmentProfile = 'piece.rn_native_preview.containment.prototype.v1';
test('containment preview retains every existing B9 oracle result and source row without mutating metrics', () => {
  for (const c of fixture.cases) {
    const input = { ...copy(c.input), candidateProfile: containmentProfile };
    const tables = c.measurements.map(table => ({ ...copy(table), version: 'piece.native_candidates.v5' }));
    const before = JSON.stringify({ input, tables });
    assert.deepEqual(copy(plan(input, c.sizeIndex, tables)), c.expected, c.id);
    assert.equal(JSON.stringify({ input, tables }), before, c.id);
    tables.forEach(table => table.rows.reverse());
    assert.deepEqual(copy(plan(input, c.sizeIndex, tables)), c.expected, c.id + '/reordered');
  }
});

test('containment planner accepts only complete v5 candidate tables and preserves unavailable search results', () => {
  const c = validCase(), input = { ...c.input, candidateProfile: containmentProfile };
  const tables = c.measurements.map(table => ({ ...table, version: 'piece.native_candidates.v5' }));
  for (const version of [undefined, 'piece.native_candidates.v1', 'piece.native_candidates.v3', 'piece.native_candidates.v4']) {
    assert.throws(() => plan(input, c.sizeIndex, tables.map(table => ({ ...table, version }))), unavailable);
  }
  const tiny = { candidateProfile: containmentProfile, blocks: ['ab'], contentWidth: 20, contentHeight: 10,
    sizes: [10], lineRatio: 1, paragraphRatio: 0 };
  const table = { version: 'piece.native_candidates.v5', boundaries: [0, 1, 2],
    rows: [[0, 1, 21, 0, -8, 21, 2], [0, 2, 42, 0, -8, 42, 2], [1, 2, 21, 0, -8, 21, 2]] };
  assert.equal(plan(tiny, 0, [table]), null);
  assert.throws(() => plan(tiny, 0, [{ ...table, rows: [[0, 1, 9999, 'width_overflow']] }]), unavailable);
});


const outputContainmentProfile = 'piece.rn_native_preview.containment.prototype.v2';
test('containment v2 retains every B9 oracle, source and complete metric value in either order', () => {
  for (const c of fixture.cases) {
    const input = { ...copy(c.input), candidateProfile: outputContainmentProfile };
    const tables = c.measurements.map(table => ({ ...copy(table), version: 'piece.native_candidates.v5' }));
    const before = JSON.stringify({ input, tables });
    assert.deepEqual(copy(plan(input, c.sizeIndex, tables)), c.expected, c.id);
    assert.equal(JSON.stringify({ input, tables }), before);
    tables.forEach(table => table.rows.reverse());
    assert.deepEqual(copy(plan(input, c.sizeIndex, tables)), c.expected, c.id + '/reverse');
  }
});
test('containment v2 refuses old, incomplete and omitted-ink candidate tables', () => {
  const c = validCase(), input = { ...c.input, candidateProfile: outputContainmentProfile };
  const tables = c.measurements.map(table => ({ ...table, version: 'piece.native_candidates.v5' }));
  for (const version of [undefined, 'piece.native_candidates.v1', 'piece.native_candidates.v3', 'piece.native_candidates.v4'])
    assert.throws(() => plan(input, c.sizeIndex, tables.map(table => ({ ...table, version }))), unavailable);
  assert.throws(() => plan(input, c.sizeIndex, tables.map(table => ({ ...table, rows: table.rows.slice(1) }))), unavailable);
  const tiny = { candidateProfile: outputContainmentProfile, blocks: ['ab'], contentWidth: 20, contentHeight: 10,
    sizes: [10], lineRatio: 1, paragraphRatio: 0 };
  const table = { version: 'piece.native_candidates.v5', boundaries: [0, 1, 2],
    rows: [[0, 1, 21, 0, -8, 21, 2], [0, 2, 42, 0, -8, 42, 2], [1, 2, 21, 0, -8, 21, 2]] };
  assert.equal(plan(tiny, 0, [table]), null);
  assert.throws(() => plan(tiny, 0, [{ ...table, rows: [[0, 1, 9999, 'width_overflow']] }]), unavailable);
});
