'use strict';
// Actual RN prototype source with synthetic native measurements/lifecycle.
// This does not run React, a font engine, Hermes, capture or a physical device.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '..');
const NOW = Date.parse('2026-10-08T10:00:00Z');
const copy = value => JSON.parse(JSON.stringify(value));
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])])) : value;
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
function sample(format = 'short_essay', ratio = '4:5', theme = 'soft_paper', brand = 'required_subtle') {
  const prefix = fs.readFileSync(path.join(__dirname, 'piece-v2-preview-display.test.js'), 'utf8').split('function deferredPieceResponse')[0];
  const context = vm.createContext({ require, __dirname });
  vm.runInContext(prefix + `\nglobalThis.sample = response(${JSON.stringify(format)});`, context);
  const p = copy(context.sample);
  p.visual_recipe.aspect_ratio = ratio; p.visual_recipe.theme.theme_id = theme; p.visual_recipe.branding.branding_mode = brand;
  p.visual_recipe_hash = hash(JSON.stringify(canonical(p.visual_recipe)));
  p.quota = { ...p.quota, subscription_tier: 'premium', save_limit: null, remaining_count: null };
  p.plan_capabilities = { format_selection: 'eligible_choice', theme_ids: ['soft_paper', 'quiet_night'],
    aspect_ratios: ['4:5', '9:16'], branding_modes: ['required_subtle', 'off'] };
  return p;
}
const display = p => ({ phase: 'received', preview: p, hashVerified: true });
function rawHarness(p = sample(), nativeInspect, saved = false, nativeCandidates, initialNow = NOW, exportCanvas = false) {
  let now = initialNow, serial = 0;
  const timers = new Map(), nativeCalls = [], candidateCalls = [], mountedNodes = new Map();
  let card;
  const React = { Component: class {
    constructor(props) { this.props = props; this.state = {}; this.updates = 0; }
    setState(v) { const change = typeof v === 'function' ? v(this.state) : v;
      if (change) { this.state = { ...this.state, ...change }; this.updates++; this.componentDidUpdate?.(); } }
  }, createElement: (type, props, ...children) => ({ type, props: props || {}, children }) };
  const context = vm.createContext({ React, View: 'View', Text: 'Text',
    Platform: { OS: 'ios' }, findNodeHandle: node => node?.tag,
    NativeModules: { PieceTextMetrics: { measureCandidates: async (tag, text, fontSize) => {
      const result = candidateTable(text, fontSize); candidateCalls.push({ tag, text, fontSize });
      return nativeCandidates ? nativeCandidates(result, candidateCalls.length) : result;
    }, measureCandidatesForWidth: async (tag, text, fontSize, contentWidth) => {
      const result = widthCandidates(candidateTable(text, fontSize), contentWidth);
      candidateCalls.push({ tag, text, fontSize, contentWidth, method: 'measureCandidatesForWidth' });
      return nativeCandidates ? nativeCandidates(result, candidateCalls.length) : result;
    }, inspect: async (tag, text, fontSize) => {
      nativeCalls.push({ tag, text, fontSize });
      const block = card.state.measurement.blocks[tag - 1];
      const result = { version: 'piece.native_text.v1', platform: 'ios', font_size: fontSize,
        width: block.box.width, height: block.box.height, utf16_length: text.length,
        boundaries: [0, ...[...new Intl.Segmenter('ja', { granularity: 'grapheme' }).segment(text)].map(s => s.index + s.segment.length)],
        line_ends: block.lines.map(l => l.end), ink: [0, 0, block.box.width - 1, block.box.height], glyph_check: 'no_missing_observed' };
      return nativeInspect ? nativeInspect(result, nativeCalls.length) : result;
    } } },
    setTimeout: callback => { const id = ++serial; timers.set(id, callback); return id; },
    clearTimeout: id => timers.delete(id),
    Date: class extends Date { static now() { return now; } } });
  const modules = [
    ['features/piece/pieceApi.js', ['PieceApiError', 'readPiecePreviewSnapshot', 'readPieceOwnerSnapshot']],
    ['features/piece/piecePreviewModel.js', ['readPiecePreviewDisplay', 'verifyPieceArtifactHashes']],
    ['features/piece/pieceOwnerModel.js', ['readPieceOwnerDisplay']],
    ['features/piece/pieceLayout.js', ['PIECE_NATIVE_PREVIEW_VERSION', 'PIECE_NATIVE_PREVIEW_V4_VERSION', 'preparePieceNativeSavedDisplay', 'preparePieceNativeCard', 'preparePieceNativePreview', 'createPieceNativeMeasurement', 'pieceNativeTypography', 'recordPieceNativeMeasurement']],
    ['features/piece/pieceRenderer.js', ['inspectPieceText', 'readPieceTextInspection', 'measurePieceCandidates']],
    ['features/piece/pieceMeasuredWrap.js', ['planPieceMeasuredRows']],
    ['components/piece/PieceVisualCard.js', ['PieceVisualCard']],
  ];
  for (const [file, names] of modules) {
    const source = fs.readFileSync(path.join(ROOT, file), 'utf8').replace(/^import .*;$/gm, '')
      .replace(/^export default /gm, '').replace(/^export /gm, '');
    vm.runInContext(`{\n${source}\n${names.map(n => `globalThis.${n} = ${n};`).join('\n')}\n}`, context, { filename: file });
  }
  card = new context.PieceVisualCard(saved ? { savedRecord: p, exportCanvas } : { display: display(p) }); card.componentDidMount();
  const render = () => {
    const tree = card.render();
    for (const node of nodes(tree)) if (typeof node.props.ref === 'function') {
      // React retains a mounted native node when only the callback identity
      // changes; a replacement canvas binding remounts all descendants.
      const key = card.state.bindingSerial + ':' + node.props.testID + ':' + (node.props.key ?? '');
      if (!mountedNodes.has(key)) mountedNodes.set(key, { tag: Number(node.props.testID.split('-').pop()) + 1 });
      node.props.ref(mountedNodes.get(key));
    }
    return tree;
  };
  const nodes = node => !node || typeof node !== 'object' ? [] : [node, ...node.children.flat(Infinity).flatMap(nodes)];
  const find = id => nodes(render()).find(n => n.props.testID === id);
  const resize = width => find('piece-visual-preview').props.onLayout({ nativeEvent: { layout: { width } } });
  resize(324);
  return { ...context, card, nodes, find, resize, render, timers, nativeCalls, candidateCalls, now: value => { now = value; },
    input: () => context.preparePieceNativeCard(card.props),
    drawing: () => card.drawingInput(context.preparePieceNativeCard(card.props)),
    replace: packet => { card.props = saved ? { savedRecord: packet, exportCanvas } : { display: display(packet) };
      card.setState(context.PieceVisualCard.getDerivedStateFromProps(card.props, card.state)); },
  };
}
function sendBlock(h, index, { height, width, lines } = {}) {
  height ??= index === h.drawing().blocks.length ? 40 : h.pieceNativeTypography(h.input(), h.card.state.measurement.sizeIndex).lineHeight;
  const node = h.find(`piece-visual-block-${index}`), expected = node.children.join('');
  const w = width ?? h.input().contentWidth;
  node.props.onLayout({ nativeEvent: { layout: { width: w, height } } });
  node.props.onTextLayout({ nativeEvent: { lines: lines || [{ text: expected, x: 0, y: 0, width: w - 1, height }] } });
  return node;
}
function candidateTable(text, fontSize, unit = 4) {
  const boundaries = [0, ...[...new Intl.Segmenter('ja', { granularity: 'grapheme' }).segment(text)].map(s => s.index + s.segment.length)];
  const rows = [];
  for (let start = 0; start < boundaries.length - 1; start++) for (let end = start + 1; end < boundaries.length; end++) {
    rows.push([start, end, unit * (end - start), 0, -fontSize * .8, unit * (end - start), fontSize * .2]);
  }
  return { version:'piece.native_candidates.v1', platform:'ios', font_size:fontSize,
    utf16_length:text.length, boundaries, rows, glyph_check:'no_missing_observed' };
}
function packedCandidates(table) {
  const { rows, ...metadata } = table;
  const bytes = Buffer.alloc(rows.length * 56);
  rows.forEach((row, i) => row.forEach((number, j) => bytes.writeDoubleLE(number, (i * 7 + j) * 8)));
  return { ...metadata, version: 'piece.native_candidates.v2', rows_f64le: bytes.toString('base64') };
}
function indexedCandidates(table) {
  const { rows, ...metadata } = table, unique = [], keys = new Map(), indices = Buffer.alloc(rows.length * 4);
  rows.forEach((row, i) => {
    const bytes = Buffer.alloc(40);
    row.slice(2).forEach((number, j) => bytes.writeDoubleLE(number, j * 8));
    const key = bytes.toString('hex');
    if (!keys.has(key)) { keys.set(key, unique.length); unique.push(bytes); }
    indices.writeUInt32LE(keys.get(key), i * 4);
  });
  return { ...metadata, version: 'piece.native_candidates.v3', metric_count: unique.length,
    metrics_f64le: Buffer.concat(unique).toString('base64'), row_indices_u32le: indices.toString('base64') };
}
function widthCandidates(table, width) {
  const { rows, ...metadata } = table, unique = [], keys = new Map(), indices = Buffer.alloc(rows.length * 4);
  let full = 0;
  rows.forEach((row, i) => {
    const overflow = row[2] > width, bytes = Buffer.alloc(overflow ? 9 : 41);
    bytes[0] = overflow ? 1 : 0;
    row.slice(2, overflow ? 3 : 7).forEach((number, j) => bytes.writeDoubleLE(number, 1 + j * 8));
    const key = bytes.toString('hex');
    if (!keys.has(key)) { keys.set(key, unique.length); unique.push(bytes); if (!overflow) full++; }
    indices.writeUInt32LE(keys.get(key), i * 4);
  });
  return { ...metadata, version: 'piece.native_candidates.v4', content_width: width,
    metric_count: unique.length, full_metric_count: full, metric_records_le: Buffer.concat(unique).toString('base64'),
    row_indices_u32le: indices.toString('base64') };
}
const v4Profile = 'piece.rn_native_preview.prototype.v4';
const v4Options = width => ({ candidateProfile: v4Profile, contentWidth: width });
const v4Sample = () => ({ ...sample(), renderer_version: v4Profile });

test('v4 tagged representatives retain all ranges and exact advance/full bits without fabricated ink', async () => {
  const h = rawHarness();
  let expected, wire;
  h.NativeModules.PieceTextMetrics.measureCandidatesForWidth = async (tag, text, font, width) => {
    expected = candidateTable(text, font);
    expected.rows.forEach(row => {
      const advance = Math.PI * (row[1] - row[0]);
      row.splice(2, 5, advance, -0, -Number.MIN_VALUE, advance, Number.MIN_VALUE);
    });
    return wire = widthCandidates(expected, width);
  };
  for (const text of ['a', 'ab', 'abc', 'abcd']) for (const width of [Number.MIN_VALUE, Math.PI, 100]) {
    const actual = await h.measurePieceCandidates({ tag: 1 }, text, 48, v4Options(width));
    assert.equal(actual.version, 'piece.native_candidates.v4'); assert.equal(actual.contentWidth, width);
    assert.deepEqual(copy(actual.boundaries), expected.boundaries); assert.equal(actual.rows.length, expected.rows.length);
    actual.rows.forEach((row, i) => {
      const original = expected.rows[i], overflow = original[2] > width;
      assert.equal(row.length, overflow ? 4 : 7);
      for (let j = 0; j < (overflow ? 3 : 7); j++) assert.ok(Object.is(row[j], original[j]));
      if (overflow) assert.equal(row[3], 'width_overflow');
    });
    assert.equal(Buffer.from(wire.metric_records_le, 'base64').length, 9 * wire.metric_count + 32 * wire.full_metric_count);
    if (text.length > 1) assert.ok(wire.metric_count < expected.rows.length);
  }
});

test('v4 wire rejects malformed tags, counts, bytes, references, metrics and width binding', async () => {
  const change = (r, field, edit) => { const bytes = Buffer.from(r[field], 'base64'); edit(bytes);
    return { ...r, [field]: bytes.toString('base64') }; };
  for (const mutate of [
    r => ({ ...r, content_width: 4 + Number.EPSILON * 4 }), r => ({ ...r, content_width: '4' }),
    r => ({ ...r, version: 'piece.native_candidates.v3' }), r => ({ ...r, platform: 'android' }),
    r => ({ ...r, rows: [] }), r => ({ ...r, metric_count: 0 }), r => ({ ...r, metric_count: 4 }),
    r => ({ ...r, metric_count: 0.5 }), r => ({ ...r, full_metric_count: -1 }),
    r => ({ ...r, full_metric_count: 0.5 }), r => ({ ...r, full_metric_count: 3 }),
    r => ({ ...r, full_metric_count: 0 }), r => ({ ...r, full_metric_count: 2 }),
    r => ({ ...r, metric_records_le: null }), r => ({ ...r, metric_records_le: r.metric_records_le.slice(4) }),
    r => ({ ...r, metric_records_le: r.metric_records_le + 'AAAA' }),
    r => ({ ...r, row_indices_u32le: r.row_indices_u32le.slice(4) }),
    r => change(r, 'metric_records_le', b => { b[0] = 2; }),
    r => change(r, 'metric_records_le', b => { b[41] = 0; }),
    r => change(r, 'metric_records_le', b => b.writeDoubleLE(8, 1)),
    r => change(r, 'metric_records_le', b => b.writeDoubleLE(4, 42)),
    ...[NaN, Infinity, -Infinity, -1].map(value => r => change(r, 'metric_records_le', b => b.writeDoubleLE(value, 42))),
    ...[NaN, Infinity, -Infinity].map(value => r => change(r, 'metric_records_le', b => b.writeDoubleLE(value, 9))),
    r => change(r, 'metric_records_le', b => b.writeDoubleLE(-1, 25)),
    r => change(r, 'metric_records_le', b => b.writeDoubleLE(-100, 33)),
    r => change(r, 'row_indices_u32le', b => b.writeUInt32LE(r.metric_count, 0)),
    r => change(r, 'row_indices_u32le', b => b.fill(0)),
    r => ({ ...r, boundaries: new Array(422).fill(0) }),
  ]) {
    const h = rawHarness(undefined, undefined, false, mutate);
    await assert.rejects(() => h.measurePieceCandidates({ tag: 1 }, 'ab', 48, v4Options(4)), /PIECE_NATIVE_MEASUREMENT_UNAVAILABLE/);
  }
  for (const field of ['metric_records_le', 'row_indices_u32le']) for (const invalid of ['=', '!', '\u0080', '\ud800']) {
    const h = rawHarness(undefined, undefined, false, r => ({ ...r, [field]: invalid + r[field].slice(1) }));
    await assert.rejects(() => h.measurePieceCandidates({ tag: 1 }, 'ab', 48, v4Options(4)), /PIECE_NATIVE_MEASUREMENT_UNAVAILABLE/);
  }
  for (const [field, text] of [['metric_records_le', 'ab'], ['row_indices_u32le', 'a']]) {
    const h = rawHarness(undefined, undefined, false, r => ({ ...r, [field]: r[field].slice(0, -3) + 'B==' }));
    await assert.rejects(() => h.measurePieceCandidates({ tag: 1 }, text, 48, v4Options(4)), /PIECE_NATIVE_MEASUREMENT_UNAVAILABLE/);
  }
});

test('v4 requires explicit iOS profile and width method without fallback or double execution', async () => {
  const h = rawHarness();
  for (const options of [null, {}, v4Options(0), v4Options(-1), v4Options(NaN), v4Options(Infinity),
    v4Options('888'), { ...v4Options(888), extra: true }, { ...v4Options(888), candidateProfile: h.PIECE_NATIVE_PREVIEW_VERSION }]) {
    await assert.rejects(() => h.measurePieceCandidates({ tag: 1 }, 'a', 48, options), /PIECE_NATIVE_MEASUREMENT_UNAVAILABLE/);
  }
  h.Platform.OS = 'android';
  await assert.rejects(() => h.measurePieceCandidates({ tag: 1 }, 'a', 48, v4Options(888)), /PIECE_NATIVE_MEASUREMENT_UNAVAILABLE/);
  h.Platform.OS = 'ios'; delete h.NativeModules.PieceTextMetrics.measureCandidatesForWidth;
  await assert.rejects(() => h.measurePieceCandidates({ tag: 1 }, 'a', 48, v4Options(888)), /PIECE_NATIVE_MEASUREMENT_UNAVAILABLE/);
  assert.equal(h.candidateCalls.length, 0);
  await h.measurePieceCandidates({ tag: 1 }, 'a', 48); assert.equal(h.candidateCalls.length, 1);
  h.NativeModules.PieceTextMetrics.measureCandidatesForWidth = async () => indexedCandidates(candidateTable('a', 48));
  await assert.rejects(() => h.measurePieceCandidates({ tag: 1 }, 'a', 48, v4Options(888)), /PIECE_NATIVE_MEASUREMENT_UNAVAILABLE/);
  h.NativeModules.PieceTextMetrics.measureCandidates = async () => widthCandidates(candidateTable('a', 48), 888);
  await assert.rejects(() => h.measurePieceCandidates({ tag: 1 }, 'a', 48), /PIECE_NATIVE_MEASUREMENT_UNAVAILABLE/);
});

test('old v1 v2 v3 still reject invalid ink in an unselected width-overflow range', async () => {
  for (const encode of [x => x, packedCandidates, indexedCandidates]) for (const invalid of [NaN, Infinity, -1]) {
    const h = await harness(sample(), undefined, false, table => {
      const row = table.rows.find(r => r[0] === 0 && r[1] === table.boundaries.length - 1);
      row[2] = 9999; row[3] = 0; row[5] = invalid;
      return encode(table);
    });
    assert.equal(h.card.state.measurement.phase, 'unavailable');
    assert.equal(h.card.state.measurement.reason, 'native_candidates_unavailable');
    assert.equal(h.nativeCalls.length, 0);
  }
});

test('v4 routing preserves old constants, saved export and Android while rejecting v4 outside iOS preview', async () => {
  const h = rawHarness(), v4 = v4Sample();
  assert.equal(h.PIECE_NATIVE_PREVIEW_VERSION, 'piece.rn_native_preview.prototype.v3');
  const oldInput = h.preparePieceNativePreview(display(sample())), newInput = h.preparePieceNativePreview(display(v4));
  assert.equal(newInput.candidateProfile, v4Profile); assert.notEqual(oldInput.key, newInput.key);
  assert.equal(newInput.renderer_version, undefined);
  assert.equal(h.preparePieceNativeCard({ display: display(v4), exportCanvas: true }), null);
  assert.equal(h.preparePieceNativeSavedDisplay({ ...savedSample(), renderer_version: v4Profile }), null);
  assert.equal(h.preparePieceNativeCard({ savedRecord: savedSample(), exportCanvas: true }).candidateProfile, h.PIECE_NATIVE_PREVIEW_VERSION);
  h.Platform.OS = 'android';
  assert.equal(h.preparePieceNativePreview(display(v4)), null);
  assert.equal(h.preparePieceNativePreview(display(sample())).key, oldInput.key);
  h.NativeModules.PieceTextMetrics.measureCandidates = async () => ({ ...candidateTable('a', 48), platform: 'android' });
  const android = await h.measurePieceCandidates({ tag: 1 }, 'a', 48);
  assert.equal(android.rows.length, 1); assert.equal(android.version, undefined);
});

test('v4 local fit requires final inspection and is revoked across v3 v4 replacements', async () => {
  const h = fitHarness({ version: v4Profile });
  await prepare(h); assert.equal(h.fit(), undefined);
  await finish(h);
  assert.equal(h.card.state.measurement.phase, 'native_checked');
  assert.equal(h.card.state.measurement.canSave, false); assert.equal(h.card.state.measurement.canExport, false);
  assert.ok(h.candidateCalls.every(c => c.method === 'measureCandidatesForWidth' && c.contentWidth === h.input().contentWidth));
  const first = h.fit(), packet = h.card.props.display.preview;
  assert.deepEqual(Object.keys(first), ['isCurrent']); assert.equal(first.isCurrent(packet, h.token), true);
  assert.equal(first.isCurrent(packet, {}), false);
  const changeVersion = version => {
    h.card.props = { ...h.card.props, display: { ...h.card.props.display, preview: { ...packet, renderer_version: version } } };
    h.card.setState(h.PieceVisualCard.getDerivedStateFromProps(h.card.props, h.card.state));
  };
  changeVersion(h.PIECE_NATIVE_PREVIEW_VERSION); assert.equal(first.isCurrent(packet, h.token), false);
  assert.equal(h.fit(), undefined); await finish(h); const old = h.fit();
  assert.equal(old.isCurrent(h.card.props.display.preview, h.token), true);
  assert.ok(h.candidateCalls.some(c => c.method === undefined));
  changeVersion(v4Profile); assert.equal(old.isCurrent(h.card.props.display.preview, h.token), false);
  assert.equal(first.isCurrent(packet, h.token), false); await finish(h);
  assert.equal(h.fit().isCurrent(packet, h.token), true);
});

test('v4 current and prefetched fonts keep exact width, font order and the original deadline', async () => {
  const pending = [], packet = v4Sample();
  const h = rawHarness(packet, undefined, false, r => new Promise(resolve => pending.push({ r, resolve })));
  primeNextFont(h); await prepare(h);
  const deadline = h.card.deadline;
  assert.equal(deadline.expiresAt, NOW + 8000);
  assert.deepEqual(h.candidateCalls.map(c => c.fontSize), [48, 48, 44, 44]);
  assert.deepEqual(h.candidateCalls.map(c => c.text), [...h.input().blocks, ...h.input().blocks]);
  assert.ok(h.candidateCalls.every(c => c.method === 'measureCandidatesForWidth' && c.contentWidth === h.input().contentWidth));
  for (const p of pending.filter(p => p.r.font_size === 44)) p.resolve(p.r);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.card.state.measurement.sizeIndex, 0);
  for (const p of pending.filter(p => p.r.font_size === 48)) {
    const table = candidateTable(packet.content_payload.body_blocks[pending.indexOf(p)], 48);
    table.rows.forEach(row => { row[2] = 9999; row[5] = 9999; });
    p.resolve(widthCandidates(table, h.input().contentWidth));
  }
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.card.state.measurement.sizeIndex, 1); assert.equal(h.card.deadline, deadline);
  await finish(h); assert.equal(h.card.state.measurement.phase, 'native_checked');
  assert.equal(h.candidateCalls.length, 4);
  assert.deepEqual(copy(h.card.state.measurement.plan.groups.map(rows => rows.join(''))), packet.content_payload.body_blocks);
});

test('v4 pending results cannot survive timeout or a v4 v3 v4 binding replacement', async () => {
  for (const expire of [false, true]) {
    const packet = { ...v4Sample(), expires_at: '2026-10-08T10:01:00Z' };
    const pending = [], h = rawHarness(packet, undefined, false, r => new Promise(resolve => pending.push({ r, resolve })));
    primeNextFont(h); await prepare(h); const original = h.card.candidates;
    if (expire) { h.now(NOW + 8001); [...h.timers.values()][0](); }
    else { h.replace({ ...packet, renderer_version: h.PIECE_NATIVE_PREVIEW_VERSION }); h.replace(packet); }
    const state = h.card.state.measurement;
    for (const p of pending) p.resolve(p.r);
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(h.card.state.measurement, state); assert.equal(h.card.saveFit, null);
    if (!expire) assert.notEqual(h.card.candidates, original);
    else assert.equal(state.reason, 'measurement_timeout');
  }
});
test('indexed native rows preserve every range and exact double bits with shared metrics', async () => {
  let expected, wire;
  const h = rawHarness(sample(), undefined, false, value => {
    expected = value;
    for (const row of value.rows) if (row[1] - row[0] === 1) {
      row.splice(2, 5, Math.PI, -0, -Number.MIN_VALUE, Math.PI, Number.MIN_VALUE);
    }
    wire = indexedCandidates(value); return wire;
  });
  const actual = await h.measurePieceCandidates({ tag: 1 }, 'abc', 48);
  assert.ok(wire.metric_count < expected.rows.length);
  assert.deepEqual(copy(actual.boundaries), expected.boundaries);
  actual.rows.forEach((row, i) => row.forEach((number, j) => assert.ok(Object.is(number, expected.rows[i][j]))));
});
test('indexed transport keeps the legacy planner result and actual inspection requirements', async () => {
  const old = await harness(), indexed = await harness(sample(), undefined, false, indexedCandidates);
  assert.deepEqual(copy(indexed.card.state.measurement.plan), copy(old.card.state.measurement.plan));
  await finish(indexed);
  assert.equal(indexed.card.state.measurement.phase, 'native_checked');
  assert.equal(indexed.card.state.measurement.canSave, false);
  assert.equal(indexed.card.state.measurement.canExport, false);
});
test('packed and indexed decoding preserve bits for every valid padding length', async () => {
  for (const encode of [packedCandidates, indexedCandidates]) {
    let expected;
    const h = rawHarness(sample(), undefined, false, value => {
      expected = value;
      for (const row of value.rows) row.splice(2, 5, Math.PI, -0, -Number.MIN_VALUE, Math.PI, Number.MIN_VALUE);
      return encode(value);
    });
    for (const text of ['a', 'ab', 'abc', 'abcd']) {
      const actual = await h.measurePieceCandidates({ tag: 1 }, text, 48);
      assert.equal(actual.rows.length, expected.rows.length);
      actual.rows.forEach((row, i) => row.forEach((number, j) => assert.ok(Object.is(number, expected.rows[i][j]))));
    }
  }
});
test('every position of an interior base64 quartet rejects padding and non-alphabet code units', async () => {
  for (const [encode, fields] of [[packedCandidates, ['rows_f64le']],
    [indexedCandidates, ['metrics_f64le', 'row_indices_u32le']]]) {
    let mutation;
    const h = rawHarness(sample(), undefined, false, value => mutation(encode(value)));
    for (const field of fields) for (const quartet of [0, 4]) for (let position = 0; position < 4; position++) {
      for (const invalid of ['=', '!', '\u0080', '\u0100', '\ud800']) {
        mutation = value => {
          const at = quartet + position, encoded = value[field];
          assert.ok(quartet < encoded.length - 4, 'must exercise the non-tail decoder');
          return { ...value, [field]: encoded.slice(0, at) + invalid + encoded.slice(at + 1) };
        };
        await assert.rejects(() => h.measurePieceCandidates({ tag: 1 }, 'abcd', 48), /PIECE_NATIVE_MEASUREMENT_UNAVAILABLE/);
      }
    }
  }
});
test('indexed transport rejects malformed, unreferenced, out-of-range and invalid metrics', async () => {
  for (const mutate of [
    r => ({ ...r, metric_count: 0 }),
    r => ({ ...r, metric_count: 0.5 }),
    r => ({ ...r, metric_count: 88411 }),
    r => ({ ...r, rows: [] }),
    r => ({ ...r, metrics_f64le: null }),
    r => ({ ...r, metrics_f64le: r.metrics_f64le.slice(4) }),
    r => ({ ...r, row_indices_u32le: r.row_indices_u32le.slice(4) }),
    r => ({ ...r, row_indices_u32le: '!' + r.row_indices_u32le.slice(1) }),
    r => ({ ...r, boundaries: new Array(422).fill(0) }),
    r => {
      const bytes = Buffer.from(r.row_indices_u32le, 'base64'); bytes.writeUInt32LE(r.metric_count, 0);
      return { ...r, row_indices_u32le: bytes.toString('base64') };
    },
    r => {
      const bytes = Buffer.from(r.metrics_f64le, 'base64'); bytes.writeDoubleLE(NaN, 0);
      return { ...r, metrics_f64le: bytes.toString('base64') };
    },
    r => ({ ...r, metric_count: r.metric_count + 1,
      metrics_f64le: Buffer.concat([Buffer.from(r.metrics_f64le, 'base64'), Buffer.alloc(40)]).toString('base64') }),
  ]) {
    const h = await harness(sample(), undefined, false, value => mutate(indexedCandidates(value)));
    assert.equal(h.card.state.measurement.phase, 'unavailable');
    assert.equal(h.card.state.measurement.reason, 'native_candidates_unavailable');
    assert.equal(h.nativeCalls.length, 0);
  }
  for (const field of ['metrics_f64le', 'row_indices_u32le']) {
    const h = rawHarness(sample(), undefined, false, value => {
      const packed = indexedCandidates(value);
      return { ...packed, [field]: packed[field].slice(0, -3) + 'B==' };
    });
    await assert.rejects(() => h.measurePieceCandidates({ tag: 1 }, 'a', 48), /PIECE_NATIVE_MEASUREMENT_UNAVAILABLE/);
  }
});
test('packed native rows preserve every double bit, including signed zero and subnormal values', async () => {
  let expected;
  const h = rawHarness(sample(), undefined, false, value => {
    expected = value;
    value.rows[0].splice(2, 5, Math.PI, -0, -Number.MIN_VALUE, Math.PI, Number.MIN_VALUE);
    return packedCandidates(value);
  });
  const actual = await h.measurePieceCandidates({ tag: 1 }, 'ab', 48);
  assert.deepEqual(copy(actual.boundaries), expected.boundaries);
  actual.rows.forEach((row, i) => row.forEach((number, j) => assert.ok(Object.is(number, expected.rows[i][j]))));
});
test('packed native transport reaches the same actual planner and inspected canvas as legacy rows', async () => {
  const old = await harness();
  const packed = await harness(sample(), undefined, false, packedCandidates);
  assert.deepEqual(copy(packed.card.state.measurement.plan), copy(old.card.state.measurement.plan));
  await finish(packed);
  assert.equal(packed.card.state.measurement.phase, 'native_checked');
  assert.equal(packed.card.state.measurement.canSave, false);
  assert.equal(packed.card.state.measurement.canExport, false);
});
test('packed transport rejects malformed bytes and preserves full candidate validation', async () => {
  for (const mutate of [
    r => ({ ...r, rows_f64le: null }),
    r => ({ ...r, rows_f64le: r.rows_f64le.slice(4) }),
    r => ({ ...r, rows_f64le: '!' + r.rows_f64le.slice(1) }),
    r => ({ ...r, rows_f64le: 'é' + r.rows_f64le.slice(1) }),
    r => ({ ...r, rows_f64le: '=' + r.rows_f64le.slice(1) }),
    r => ({ ...r, rows: [] }),
    r => ({ ...r, boundaries: new Array(422).fill(0) }),
    r => {
      const bytes = Buffer.from(r.rows_f64le, 'base64'); bytes.writeDoubleLE(NaN, 16);
      return { ...r, rows_f64le: bytes.toString('base64') };
    },
    r => {
      const bytes = Buffer.from(r.rows_f64le, 'base64'); bytes.copy(bytes, 56, 0, 56);
      return { ...r, rows_f64le: bytes.toString('base64') };
    },
  ]) {
    const h = await harness(sample(), undefined, false, value => mutate(packedCandidates(value)));
    assert.equal(h.card.state.measurement.phase, 'unavailable');
    assert.equal(h.card.state.measurement.reason, 'native_candidates_unavailable');
    assert.equal(h.nativeCalls.length, 0);
  }
  const h = rawHarness(sample(), undefined, false, value => {
    const packed = packedCandidates(value);
    // One row is 56 bytes: one '=' is required; discarded bits must be zero.
    return { ...packed, rows_f64le: packed.rows_f64le.slice(0, -2) + 'B=' };
  });
  await assert.rejects(() => h.measurePieceCandidates({ tag: 1 }, 'a', 48), /PIECE_NATIVE_MEASUREMENT_UNAVAILABLE/);
});
async function prepare(h) {
  if (h.card.state.measurement.phase !== 'planning') return h;
  for (let i = 0; i < h.input().blocks.length; i++) {
    h.find(`piece-probe-block-${i}`).props.onLayout({ nativeEvent: { layout: { width: h.input().contentWidth, height: 100 } } });
  }
  await new Promise(resolve => setImmediate(resolve));
  return h;
}
async function harness(...args) { return prepare(rawHarness(...args)); }
function fitHarness({ inspect, candidates, onFit, version = 'piece.rn_native_preview.prototype.v3' } = {}) {
  const packet = sample(); packet.renderer_version = version;
  const h = rawHarness(packet, inspect, false, candidates), notifications = [];
  const listener = (next, previous) => { notifications.push([next, previous]); onFit?.(next, previous); };
  const bind = token => {
    h.card.props = { ...h.card.props, display: { ...h.card.props.display, visualToken: token }, onSaveFitChange: listener };
    h.card.setState(h.PieceVisualCard.getDerivedStateFromProps(h.card.props, h.card.state));
  };
  const token = Object.freeze({}); bind(token);
  return { ...h, token, bind, notifications, fit: () => h.card.saveFit?.handle };
}

test('local save fit appears only after every final native inspection and has a read-only body-free interface', async () => {
  const pending = [];
  const h = fitHarness({ inspect: result => new Promise(resolve => pending.push({ result, resolve })) });
  assert.equal(h.fit(), undefined); await prepare(h);
  assert.equal(h.card.state.measurement.phase, 'measuring'); assert.equal(h.fit(), undefined);
  await finish(h); assert.equal(h.card.state.measurement.phase, 'geometry_checked');
  assert.equal(h.fit(), undefined); assert.equal(h.notifications.length, 0);
  for (let i = pending.length - 1; i > 0; i--) pending[i].resolve(pending[i].result);
  await new Promise(resolve => setImmediate(resolve)); assert.equal(h.fit(), undefined);
  pending[0].resolve(pending[0].result); await new Promise(resolve => setImmediate(resolve));
  const handle = h.fit(), preview = h.card.props.display.preview;
  assert.ok(Object.isFrozen(handle)); assert.deepEqual(Object.keys(handle), ['isCurrent']);
  assert.equal(h.timers.size, 0); assert.equal(h.notifications.length, 1);
  const before = [h.nativeCalls.length, h.candidateCalls.length, h.card.updates, h.notifications.length];
  for (let i = 0; i < 3; i++) assert.equal(handle.isCurrent(copy(preview), h.token), true);
  assert.deepEqual([h.nativeCalls.length, h.candidateCalls.length, h.card.updates, h.notifications.length], before);
  assert.equal(h.card.state.measurement.canSave, false); assert.equal(h.card.state.measurement.canExport, false);
});
test('local save fit never revives across token A to B to A and remounts the logical canvas', async () => {
  const h = fitHarness(); await finish(h);
  const old = h.fit(), key = h.card.state.measurement.key, canvasKey = h.find('piece-logical-canvas').props.key;
  h.bind(Object.freeze({}));
  assert.equal(h.card.state.measurement.key, key);
  assert.notEqual(h.find('piece-logical-canvas').props.key, canvasKey);
  const batch = h.card.candidates, deadline = h.card.deadline;
  h.bind(h.token);
  assert.notEqual(h.card.candidates, batch); assert.notEqual(h.card.deadline, deadline);
  assert.equal(old.isCurrent(h.card.props.display.preview, h.token), false);
  await finish(h);
  assert.equal(h.card.state.measurement.phase, 'native_checked'); assert.notEqual(h.fit(), old);
  assert.equal(h.fit().isCurrent(h.card.props.display.preview, h.token), true);
  assert.equal(old.isCurrent(h.card.props.display.preview, h.token), false);
});
test('token replacement during planning remounts probes and ignores the previous native promises', async () => {
  const pending = [];
  const h = fitHarness({ candidates: result => new Promise(resolve => pending.push({ result, resolve })) });
  await prepare(h); const oldPending = pending.slice(), oldCanvas = h.find('piece-logical-canvas').props.key;
  const nextToken = Object.freeze({}); h.bind(nextToken);
  assert.notEqual(h.find('piece-logical-canvas').props.key, oldCanvas, 'unchanged geometry must still emit fresh native layouts');
  const replacement = h.card.state.measurement;
  for (const item of oldPending) item.resolve(item.result);
  await new Promise(resolve => setImmediate(resolve)); assert.equal(h.card.state.measurement, replacement);
  await prepare(h); assert.ok(pending.length > oldPending.length);
  for (const item of pending.slice(oldPending.length)) item.resolve(item.result);
  await new Promise(resolve => setImmediate(resolve)); await finish(h);
  assert.equal(h.card.state.measurement.phase, 'native_checked');
  assert.equal(h.fit().isCurrent(h.card.props.display.preview, nextToken), true);
});
test('a diagnostic renderer version can be drawn without receiving prototype save-fit evidence', async () => {
  const h = fitHarness({ version: 'rn_renderer.v1' }); await finish(h);
  assert.equal(h.card.state.measurement.phase, 'native_checked');
  assert.equal(h.fit(), undefined); assert.equal(h.notifications.length, 0);
});
for (const change of ['expiry', 'body', 'generation', 'plan', 'inspection', 'rowNode', 'canvasNode', 'listener', 'unmount']) {
  test(`local save fit rejects changed ${change} without additional native work`, async () => {
    const h = fitHarness(); await finish(h);
    const handle = h.fit(), preview = copy(h.card.props.display.preview), before = h.nativeCalls.length;
    assert.equal(handle.isCurrent(preview, h.token), true);
    if (change === 'expiry') h.now(NOW + 1123);
    if (change === 'body') preview.piece_text += '変更';
    if (change === 'generation') h.card.state.measurement.generation = Object.freeze({});
    if (change === 'plan') h.card.state.measurement.plan = { ...h.card.state.measurement.plan };
    if (change === 'inspection') h.card.state.measurement.inspection = [...h.card.state.measurement.inspection];
    if (change === 'rowNode') h.card.textNodes.set(0, { ...h.card.textNodes.get(0), value: {} });
    if (change === 'canvasNode') h.card.canvasNode = {};
    if (change === 'listener') h.card.props = { ...h.card.props, onSaveFitChange() {} };
    if (change === 'unmount') h.card.componentWillUnmount();
    assert.equal(handle.isCurrent(preview, h.token), false); assert.equal(h.nativeCalls.length, before);
    if (change === 'unmount') assert.deepEqual(h.notifications.at(-1), [null, handle]);
  });
}
test('fit revocation cannot publish to a listener superseded by a reentrant parent callback', async () => {
  let h; const callsB = [], callsC = [], listenerC = (...args) => callsC.push(args);
  h = fitHarness({ onFit: (next, previous) => {
    if (next === null && previous) h.card.props = { ...h.card.props, onSaveFitChange: listenerC };
  } });
  await finish(h); const old = h.fit();
  h.card.props = { ...h.card.props, onSaveFitChange: (...args) => callsB.push(args) };
  assert.equal(old.isCurrent(h.card.props.display.preview, h.token), false);
  h.card.componentDidUpdate(); assert.equal(callsB.length, 0); assert.equal(h.fit(), undefined);
  h.card.componentDidUpdate(); assert.equal(callsC.length, 1); assert.notEqual(h.fit(), old);
  assert.equal(h.fit().isCurrent(h.card.props.display.preview, h.token), true);
});
test('remeasured mounted rows revoke the previous fit and publish a new handle only after reinspection', async () => {
  const h = fitHarness(); await finish(h); const old = h.fit();
  sendBlock(h, 0, { lines: [{ text: h.drawing().blocks[0], x: 0, y: 0, width: 200, height: 75 }] });
  assert.equal(old.isCurrent(h.card.props.display.preview, h.token), false);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.card.state.measurement.phase, 'native_checked'); assert.notEqual(h.fit(), old);
  assert.equal(h.fit().isCurrent(h.card.props.display.preview, h.token), true);
  assert.equal(old.isCurrent(h.card.props.display.preview, h.token), false);
});
test('failed final native inspection cannot publish fit after other late successes', async () => {
  const pending = [];
  const h = fitHarness({ inspect: result => new Promise((resolve, reject) => pending.push({ result, resolve, reject })) });
  await finish(h); pending[0].reject(Error('PRIVATE'));
  await new Promise(resolve => setImmediate(resolve));
  for (const item of pending.slice(1)) item.resolve(item.result);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.card.state.measurement.phase, 'unavailable');
  assert.equal(h.fit(), undefined); assert.equal(h.notifications.length, 0);
});
function primeNextFont(h) {
  const size = h.card.state.measurement.sizeIndex + 1;
  for (let i = 0; i < h.input().blocks.length; i++) {
    h.find(`piece-prefetch-${size}-block-${i}`).props.onLayout();
  }
}

test('next-font work overlaps pending current work but selection and paragraph order stay unchanged', async () => {
  const pending = [];
  const h = rawHarness(sample(), undefined, false, r => new Promise(resolve => pending.push({ r, resolve })));
  primeNextFont(h);
  assert.equal(h.candidateCalls.length, 0, 'next layout alone must not overtake current font');
  await prepare(h);
  assert.deepEqual(h.candidateCalls.map(c => c.fontSize), [48, 48, 44, 44]);
  assert.deepEqual(h.candidateCalls.map(c => c.text), [...h.input().blocks, ...h.input().blocks]);
  const deadline = h.card.deadline;
  for (const p of pending.filter(p => p.r.font_size === 44)) p.resolve(p.r);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.card.state.measurement.phase, 'planning');
  assert.equal(h.card.state.measurement.sizeIndex, 0, 'early next result cannot skip current B9');
  for (const p of pending.filter(p => p.r.font_size === 48)) {
    p.resolve({ ...p.r, rows: p.r.rows.map(row => [row[0], row[1], 9999, 0, -30, 9999, 10]) });
  }
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.card.state.measurement.sizeIndex, 1);
  await finish(h);
  assert.equal(h.card.state.measurement.phase, 'native_checked');
  assert.equal(h.candidateCalls.length, 4, 'adoption must reuse the exact next-font measurements');
  assert.deepEqual(copy(h.card.state.measurement.plan.groups.map(g => g.join(''))), copy(h.input().blocks));
  assert.equal(deadline.expiresAt, NOW + 8000);
  assert.equal(h.card.state.measurement.canSave, false);
});

test('speculative rejection is harmless for a fitting current font and fails closed on adoption', async () => {
  for (const currentFits of [true, false]) {
    const pending = [];
    const h = rawHarness(sample(), undefined, false, r => r.font_size === 44
      ? Promise.reject(new Error('unavailable')) : new Promise(resolve => pending.push({ r, resolve })));
    await prepare(h); primeNextFont(h);
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(h.card.state.measurement.phase, 'planning');
    for (const p of pending) p.resolve(currentFits ? p.r
      : { ...p.r, rows: p.r.rows.map(row => [row[0], row[1], 9999, 0, -30, 9999, 10]) });
    await new Promise(resolve => setImmediate(resolve));
    await finish(h);
    assert.equal(h.card.state.measurement.phase, currentFits ? 'native_checked' : 'unavailable');
    if (!currentFits) assert.equal(h.card.state.measurement.reason, 'native_candidates_unavailable');
  }
});

test('prefetch results cannot cross unmount, timeout, expiry or an A-B-A input generation', async () => {
  for (const action of ['unmount', 'timeout', 'expired', 'replace']) {
    const pending = [];
    const h = rawHarness(sample(), undefined, false, r => new Promise(resolve => pending.push({ r, resolve })));
    await prepare(h); primeNextFont(h);
    const oldProbe = h.find('piece-prefetch-1-block-0'), oldBatch = h.card.candidates;
    if (action === 'unmount') h.card.componentWillUnmount();
    if (action === 'timeout') [...h.timers.values()][0]();
    if (action === 'expired') h.now(NOW + 8001);
    if (action === 'replace') { const next = sample(); next.preview_revision++; h.replace(next); h.replace(sample()); }
    const state = h.card.state.measurement;
    for (const p of pending) p.resolve(p.r);
    oldProbe.props.onLayout();
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(h.card.state.measurement, state);
    assert.equal(h.candidateCalls.length, 4);
    if (action === 'replace') assert.notEqual(h.card.candidates, oldBatch);
  }
});

test('fixed export canvas mounts its next-font probes before any resize event', async () => {
  const pending = [];
  const h = rawHarness(savedSample(), undefined, true, r => new Promise(resolve => pending.push({ r, resolve })), NOW, true);
  primeNextFont(h); await prepare(h);
  assert.deepEqual(h.candidateCalls.map(c => c.fontSize), [48, 48, 44, 44]);
  h.card.componentWillUnmount();
  for (const p of pending) p.resolve(p.r);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.card.getCaptureTarget(), null);
});

async function finish(h, height) {
  await prepare(h);
  if (h.card.state.measurement.phase === 'unavailable') return;
  const input = h.drawing();
  for (let index = 0; index < input.blocks.length; index++) sendBlock(h, index, { height });
  if (input.brandingMode !== 'off') sendBlock(h, input.blocks.length, { height: 40 });
  await new Promise(resolve => setImmediate(resolve));
}

test('B9 selects measured exact rows before the mounted row inspection can expose an image', async () => {
  const p = sample();
  const h = await harness(p, undefined, false, (r, call) => candidateTable(p.content_payload.body_blocks[call - 1], r.font_size, 80));
  assert.equal(h.card.state.measurement.phase, 'measuring');
  assert.ok(h.drawing().blocks.length > p.content_payload.body_blocks.length);
  assert.deepEqual(copy(h.card.state.measurement.plan.groups.map(g => g.join(''))), p.content_payload.body_blocks);
  assert.equal(h.find('piece-logical-canvas').props.style.opacity, 0);
  await finish(h);
  assert.equal(h.card.state.measurement.phase, 'native_checked');
  assert.equal(h.find('piece-logical-canvas').props.style.opacity, 1);
  assert.deepEqual(copy(h.card.props.display.preview), p);
  assert.equal(h.card.state.measurement.canSave, false); assert.equal(h.card.state.measurement.canExport, false);
});
test('candidate measurement waits for all original paragraphs and refuses malformed or missing metrics', async () => {
  const pending = rawHarness();
  pending.find('piece-probe-block-0').props.onLayout({nativeEvent:{layout:{width:888,height:100}}});
  assert.equal(pending.candidateCalls.length, 0);
  for (const mutate of [r => ({...r,version:'other'}), r => ({...r,platform:'android'}), r => ({...r,glyph_check:'unknown'}),
    r => ({...r,font_size:1}), r => ({...r,utf16_length:1}), r => ({...r,rows:r.rows.slice(1)}),
    r => ({...r,body:'PRIVATE'}), () => {throw Error('PRIVATE');}]) {
    const h = await harness(sample(), undefined, false, mutate);
    assert.equal(h.card.state.measurement.phase,'unavailable'); assert.equal(h.card.state.measurement.reason,'native_candidates_unavailable');
    assert.equal(h.nativeCalls.length,0); assert.equal(JSON.stringify(h.card.state).includes('PRIVATE'),false);
  }
  const absent = rawHarness(); delete absent.NativeModules.PieceTextMetrics.measureCandidates; await prepare(absent);
  assert.equal(absent.card.state.measurement.reason,'native_candidates_unavailable');
});
test('late candidate measurements cannot revive timeout, unmount or a replacement artifact', async () => {
  for (const action of ['timeout','unmount','replace','expired']) {
    let release;
    const h = rawHarness(sample(), undefined, false, r => new Promise(resolve => {release=()=>resolve(r);}));
    await prepare(h);
    const old = h.find('piece-probe-block-0');
    if(action==='timeout') [...h.timers.values()][0]();
    if(action==='unmount') h.card.componentWillUnmount();
    if(action==='replace'){const p=sample();p.preview_revision++;h.replace(p);}
    if(action==='expired')h.now(NOW+9000);
    const state=h.card.state.measurement;
    release();await new Promise(resolve=>setImmediate(resolve));
    old.props.onLayout({nativeEvent:{layout:{width:888,height:100}}});
    assert.equal(h.card.state.measurement,state);assert.notEqual(state.phase,'native_checked');
  }
});
test('unfittable measured candidates use only catalog sizes and never renew the original deadline', async () => {
  const h = rawHarness(sample(), undefined, false, r => ({...r,rows:r.rows.map(row=>[row[0],row[1],9999,0,-30,9999,10])}));
  const deadline=h.card.deadline;
  for (const size of [48,44,40,36]) {
    assert.equal(h.find('piece-probe-block-0').props.style.fontSize,size); await prepare(h);
    if(h.card.state.measurement.phase!=='unavailable')assert.equal(h.card.deadline,deadline);
  }
  assert.equal(h.card.state.measurement.reason,'font_floor_overflow');assert.equal(h.nativeCalls.length,0);assert.equal(h.timers.size,0);
});
test('a selected row that native wraps again is unavailable without splitting or changing the source', async () => {
  const h=await harness(), body=h.drawing().blocks[0], end=body.indexOf('、');
  sendBlock(h,0,{lines:[{text:body.slice(0,end),x:0,y:0,width:200,height:30},{text:body.slice(end),x:0,y:30,width:200,height:30}]});
  assert.equal(h.card.state.measurement.reason,'native_rewrap');assert.equal(h.find('piece-logical-canvas'),undefined);
  assert.equal(h.card.state.measurement.sizeIndex,0);
});

test('immutable v1 geometry, colors and discrete type scales cover all formats/ratios', async () => {
  const scales = { short_essay: [[48,44,40,36],[52,48,44,40]], quote: [[72,64,56],[80,72,64]], declaration: [[64,56,48],[72,64,56]] };
  for (const format of Object.keys(scales)) for (const [ri, ratio] of ['4:5', '9:16'].entries()) {
    const h = await harness(sample(format, ratio, ri ? 'quiet_night' : 'soft_paper')), input = h.input();
    assert.deepEqual(copy(input.sizes), scales[format][ri]);
    assert.deepEqual([input.width,input.height,input.margin,input.brandingZone,input.contentWidth,input.contentHeight],
      ri ? [1080,1920,108,84,864,1620] : [1080,1350,96,72,888,1086]);
    assert.equal(input.alignment, format === 'quote' ? 'center' : 'left');
    assert.equal(input.colors.canvas, ri ? '#0B1120' : '#F6F1E8');
    assert.ok(Object.isFrozen(input.blocks)); assert.ok(Object.isFrozen(input.colors));
    assert.equal(input.quota, undefined); assert.equal(input.renderer_version, undefined);
  }
});
test('actual modal integration passes the checked display and retains selectable canonical text', async () => {
  const source = fs.readFileSync(path.join(ROOT, 'components/piece/PiecePreviewModal.js'), 'utf8');
  assert.match(source, /element\(PieceVisualCard, \{ display, onSaveFitChange \}\)/);
  assert.match(source, /testID: 'piece-canonical-text', selectable: true/);
});
test('same native Text instances stay hidden until every paragraph and branding supplies both events', async () => {
  const h = await harness(), canvas = () => h.find('piece-logical-canvas');
  assert.equal(canvas().props.style.opacity, 0);
  sendBlock(h, 0); sendBlock(h, 1);
  assert.equal(h.card.state.measurement.phase, 'measuring'); assert.equal(canvas().props.style.opacity, 0);
  const brand = h.find('piece-visual-block-2');
  brand.props.onLayout({ nativeEvent: { layout: { width: 888, height: 40 } } });
  assert.equal(canvas().props.style.opacity, 0);
  brand.props.onTextLayout({ nativeEvent: { lines: [{ text: 'Cocolon', x: 0, y: 0, width: 100, height: 40 }] } });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(canvas().props.style.opacity, 1);
  assert.equal(h.card.state.measurement.phase, 'native_checked');
  assert.equal(h.card.state.measurement.canSave, false); assert.equal(h.card.state.measurement.canExport, false);
  assert.equal(h.card.state.measurement.missing_glyph, undefined); assert.equal(h.card.state.measurement.layout_state, undefined);
});
test('canvas is measured at 1080 logical width; resize changes only the uniform transform', async () => {
  const h = await harness(); await finish(h); const before = h.card.state.measurement;
  h.resize(216);
  const canvas = h.find('piece-logical-canvas').props.style, text = h.find('piece-visual-block-0').props;
  assert.equal(canvas.width, 1080); assert.equal(canvas.height, 1350); assert.equal(canvas.transform[0].scale, 0.2);
  assert.equal(canvas.left + canvas.width * (1 - 0.2) / 2, 0);
  assert.equal(canvas.top + canvas.height * (1 - 0.2) / 2, 0);
  assert.equal(text.style.width, 888); assert.equal(text.style.fontSize, 48); assert.equal(text.style.lineHeight, 75);
  assert.equal(h.drawing().rowGaps[0], 48.75); assert.equal(text.allowFontScaling, false);
  assert.equal(text.adjustsFontSizeToFit, false); assert.equal(text.numberOfLines, undefined);
  assert.equal(text.ellipsizeMode, undefined); assert.equal(text.style.overflow, undefined);
  assert.equal(h.card.state.measurement, before);
});
test('vertical overflow tries only descending catalog sizes and floor failure removes the canvas', async () => {
  const h = await harness();
  for (const expected of [48,44,40,36]) {
    await prepare(h);
    assert.equal(h.find('piece-visual-block-0').props.style.fontSize, expected); await finish(h, 900);
  }
  assert.equal(h.card.state.measurement.phase, 'unavailable'); assert.equal(h.card.state.measurement.reason, 'font_floor_overflow');
  assert.equal(h.find('piece-logical-canvas'), undefined);
  assert.equal(h.card.state.measurement.canSave, false);
});
test('successful smaller candidate retains full body and font floor; old-size events cannot revive larger candidate', async () => {
  const h = await harness(), old = h.find('piece-visual-block-0'); await finish(h, 900);
  assert.equal(h.card.state.measurement.sizeIndex, 1);
  old.props.onLayout({ nativeEvent: { layout: { width: 888, height: 1 } } });
  assert.deepEqual(copy(h.card.state.measurement.blocks), {});
  await finish(h); assert.equal(h.card.state.measurement.phase, 'native_checked');
  assert.equal(h.find('piece-visual-block-0').children.join(''), h.input().blocks[0]);
  assert.equal(h.find('piece-visual-block-0').props.style.fontSize, 44);
});
test('line text loss, trimming, insertion and invalid numbers never expose a geometry-checked canvas', async () => {
  for (const mutate of [line => { line.text = line.text.trim(); }, line => { line.text += 'x'; },
    line => { line.width = NaN; }, line => { line.height = Infinity; }, line => { line.text = ''; }]) {
    const h = await harness(), line = { text: h.input().blocks[0], x: 0, y: 0, width: 100, height: 100 }; mutate(line);
    sendBlock(h, 0, { lines: [line] });
    assert.equal(h.card.state.measurement.phase, 'unavailable'); assert.equal(h.find('piece-logical-canvas'), undefined);
  }
});
test('horizontal, negative, overlapping and out-of-box line metrics cannot pass', async () => {
  for (const lines of [body => [{ text: body, x: 0, y: 0, width: 889, height: 100 }],
    body => [{ text: body, x: -1, y: 0, width: 100, height: 100 }],
    body => [{ text: body, x: 0, y: 20, width: 100, height: 100 }],
    body => [{ text: body.slice(0, 2), x: 0, y: 0, width: 100, height: 60 },
      { text: body.slice(2), x: 0, y: 50, width: 100, height: 50 }]]) {
    const h = await harness(); sendBlock(h, 0, { lines: lines(h.input().blocks[0]) });
    if(h.card.state.measurement.phase === 'unavailable'){assert.equal(h.card.state.measurement.reason,'native_rewrap');continue;}
    sendBlock(h, 1); sendBlock(h, 2, { height: 40 });
    assert.equal(h.card.state.measurement.sizeIndex, 1); assert.equal(h.card.state.measurement.phase, 'planning');
    assert.equal(h.find('piece-logical-canvas').props.style.opacity, 0);
  }
});
test('branding off keeps the same reserved content zone and paragraph positions', async () => {
  const on = await harness(sample()), off = await harness(sample('short_essay','4:5','soft_paper','off'));
  await finish(on); await finish(off);
  assert.equal(off.find('piece-visual-block-2'), undefined);
  assert.equal(off.input().contentHeight, on.input().contentHeight);
  assert.equal(off.card.state.measurement.compositionHeight, on.card.state.measurement.compositionHeight);
  assert.equal(off.find('piece-visual-block-0').props.style.fontSize, on.find('piece-visual-block-0').props.style.fontSize);
});
test('duplicates are inert; changed native metrics revoke a previously checked image immediately', async () => {
  const h = await harness(); await finish(h); const updates = h.card.updates;
  sendBlock(h, 0); assert.equal(h.card.updates, updates);
  sendBlock(h, 0, { height: 1800 });
  assert.equal(h.card.state.measurement.sizeIndex, 1); assert.equal(h.find('piece-logical-canvas').props.style.opacity, 0);
  assert.equal(h.card.state.measurement.rowOffsets, undefined);
});
test('reinspection hides a checked quote without moving its current row placement', async () => {
  const h = await harness(sample('quote', '9:16')); await finish(h);
  const before = h.card.state.measurement, calls = h.nativeCalls.length;
  const placement = () => {
    const row = h.find('piece-visual-block-0').props.style;
    const composition = h.find('piece-logical-canvas').children[1].props.style;
    return { left: row.left, top: row.top, compositionTop: composition.top };
  };
  const positioned = placement(); assert.ok(positioned.left > 0);
  const { end, ...line } = before.blocks[0].lines[0];
  const lines = [{ ...line, text: h.drawing().blocks[0], width: line.width - 0.00001 }];
  h.find('piece-visual-block-0').props.onTextLayout({ nativeEvent: { lines } });
  assert.equal(h.card.state.measurement.phase, 'geometry_checked');
  assert.equal(h.card.state.measurement.inspection, null);
  assert.equal(h.find('piece-logical-canvas').props.style.opacity, 0);
  assert.deepEqual(placement(), positioned);
  await new Promise(resolve => setImmediate(resolve));
  const checked = h.card.state.measurement;
  assert.equal(checked.phase, 'native_checked'); assert.ok(h.nativeCalls.length > calls);
  assert.notEqual(checked.inspection, before.inspection);
  assert.deepEqual(placement(), positioned);
  h.find('piece-visual-block-0').props.onTextLayout({ nativeEvent: { lines } });
  assert.equal(h.card.state.measurement, checked);
  assert.equal(checked.canSave, false); assert.equal(checked.canExport, false);
});
test('revision, recipe, renderer and preview identity changes reset measurement and reject late events', async () => {
  for (const mutate of [p => { p.preview_revision++; }, p => { p.row_version++; },
    p => { p.preview_id = '30000000-0000-4000-8000-000000000099'; }, p => { p.renderer_version = 'different-profile'; },
    p => { p.visual_recipe.theme.theme_id = 'quiet_night'; p.visual_recipe_hash = hash(JSON.stringify(canonical(p.visual_recipe))); }]) {
    const h = await harness(), old = h.find('piece-visual-block-0'); await finish(h);
    const p = sample(); mutate(p); h.card.props = { display: display(p) };
    assert.equal(h.render(), null, 'old geometry is hidden before lifecycle reconciliation');
    h.replace(p); old.props.onLayout({ nativeEvent: { layout: { width: 888, height: 100 } } });
    assert.deepEqual(copy(h.card.state.measurement.blocks), {});
    assert.equal(h.card.state.measurement.phase, 'planning');
    assert.equal(h.card.state.measurement.rowOffsets, undefined);
  }
});
test('expiry, hidden display and hash mismatch hide canvas before late measurement can be accepted', async () => {
  for (const mutate of [h => h.now(NOW + 1123), h => { h.card.props = { display: { phase: 'hidden' } }; },
    h => { const p = sample(); p.piece_text_hash = '0'.repeat(64); h.card.props = { display: display(p) }; }]) {
    const h = await harness(), old = h.find('piece-visual-block-0'); await finish(h); const before = h.card.state.measurement;
    mutate(h); assert.equal(h.render(), null);
    old.props.onLayout({ nativeEvent: { layout: { width: 888, height: 100 } } });
    assert.equal(h.card.state.measurement, before);
  }
});
test('unmounted canvas rejects late events and has no network/storage/capture side effect', async () => {
  const h = await harness(), old = h.find('piece-visual-block-0'), before = h.card.updates;
  h.card.componentWillUnmount(); old.props.onLayout({ nativeEvent: { layout: { width: 888, height: 100 } } });
  assert.equal(h.card.updates, before);
  assert.equal(h.timers.size, 0);
  for (const file of ['features/piece/pieceLayout.js','components/piece/PieceVisualCard.js']) {
    assert.doesNotMatch(fs.readFileSync(path.join(ROOT, file), 'utf8'), /console\.|apiFetch\(|AsyncStorage|captureRef\(|Share\.share/);
  }
});
test('missing native callbacks time out locally, late events cannot revive them, and completed measurements clear the timer', async () => {
  const h = await harness(), old = h.find('piece-visual-block-0');
  assert.equal(h.timers.size, 1); const callback = [...h.timers.values()][0]; h.timers.clear(); callback();
  assert.equal(h.card.state.measurement.reason, 'measurement_timeout'); assert.equal(h.find('piece-logical-canvas'), undefined);
  old.props.onTextLayout({ nativeEvent: { lines: [{ text: h.input().blocks[0], x: 0, y: 0, width: 100, height: 100 }] } });
  assert.equal(h.card.state.measurement.phase, 'unavailable'); assert.equal(h.timers.size, 0);
  const complete = await harness(); await finish(complete); assert.equal(complete.timers.size, 0);
});
test('a queued timeout from an old candidate cannot discard the replacement', async () => {
  const h = await harness(), callback = [...h.timers.values()][0], next = sample(); next.preview_revision++;
  h.replace(next); const deadline = h.card.deadline; callback();
  assert.equal(h.card.deadline, deadline); assert.equal(h.timers.size, 1);
  await finish(h); callback();
  assert.equal(h.card.state.measurement.phase, 'native_checked'); assert.equal(h.timers.size, 0);
});
test('returning to the same artifact still rejects measurements from its previous mounted generation', async () => {
  const h = await harness(), old = h.find('piece-visual-block-0'), next = sample(); next.preview_revision++;
  h.replace(next); h.replace(sample());
  old.props.onLayout({ nativeEvent: { layout: { width: 888, height: 100 } } });
  assert.deepEqual(copy(h.card.state.measurement.blocks), {});
  await finish(h); assert.equal(h.card.state.measurement.phase, 'native_checked');
});
test('controlled rows preserve whitespace, punctuation, mixed scripts and emoji without normalization', async () => {
  const p = sample(), first = '  私は、静かな時間を大切にします。 Café e\u0301 / 👩‍👩‍👧‍👦  ';
  p.content_payload.body_blocks = [first, '他の人の話にも、耳を傾けたいと思います。'];
  p.piece_text = p.content_payload.body_blocks.join('\n\n');p.piece_text_hash=hash(p.piece_text);
  p.content_payload_hash=hash(JSON.stringify(canonical(p.content_payload)));
  const h=await harness(p,undefined,false,(r,call)=>candidateTable(p.content_payload.body_blocks[call-1],r.font_size,75));
  await finish(h);assert.equal(h.card.state.measurement.phase,'native_checked');
  assert.deepEqual(copy(h.card.state.measurement.plan.groups.map(g=>g.join(''))),p.content_payload.body_blocks);
  assert.ok(h.drawing().blocks.some(row=>row.includes('👩‍👩‍👧‍👦')));
});
test('Free and Premium branding use the fixed theme token with legible subtle contrast', async () => {
  const expected = {
    soft_paper: { canvas:'#F6F1E8',surface:'#FFFDF8',text:'#111827',secondary:'#4B5563',accent:'#800020',border:'#D7D2C9',branding:'#800020',vector_end:'#FFFFFF' },
    quiet_night: { canvas:'#0B1120',surface:'#111827',text:'#F9FAFB',secondary:'#CBD5E1',accent:'#D4AF37',border:'#334155',branding:'#D4AF37',vector_end:'#1E293B' },
  };
  const rgb = hex => [1,3,5].map(start => parseInt(hex.slice(start,start + 2),16) / 255);
  const luminance = channels => channels.map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
    .reduce((total,c,index) => total + c * [0.2126,0.7152,0.0722][index],0);
  for (const theme of ['soft_paper','quiet_night']) {
    const h = await harness(sample('short_essay','4:5',theme)), input = h.input();
    assert.deepEqual(copy(input.colors), expected[theme]); await finish(h);
    const style = h.find('piece-visual-block-2').props.style;
    assert.equal(style.color, expected[theme].branding); assert.equal(style.opacity,0.8);
    const background = rgb(input.colors.surface), foreground = rgb(style.color).map((c,i) => c * 0.8 + background[i] * 0.2);
    const values = [luminance(background),luminance(foreground)].sort((a,b) => a-b);
    assert.ok((values[1] + 0.05) / (values[0] + 0.05) >= 3);
  }
  const free = sample(); free.visual_recipe.branding.branding_mode = 'required_small';
  free.visual_recipe_hash = hash(JSON.stringify(canonical(free.visual_recipe)));
  free.quota = { ...free.quota, subscription_tier: 'free', save_limit: 5, remaining_count: 3 };
  free.plan_capabilities = { format_selection:'fixed',theme_ids:['soft_paper'],aspect_ratios:['4:5'],branding_modes:['required_small'] };
  const h = await harness(free); await finish(h);
  assert.equal(h.card.state.measurement.phase,'native_checked');
  assert.equal(h.find('piece-visual-block-2').props.style.color,'#800020');
  assert.equal(h.find('piece-visual-block-2').props.style.opacity,1);
});

test('line geometry alone stays hidden until the actual native inspection finishes', async () => {
  let release;
  const h = await harness(sample(), (result, call) => call === 1 ? new Promise(resolve => { release = () => resolve(result); }) : result);
  await finish(h);
  assert.equal(h.card.state.measurement.phase, 'geometry_checked');
  assert.equal(h.find('piece-logical-canvas').props.style.opacity, 0); assert.equal(h.timers.size, 1);
  release(); await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.card.state.measurement.phase, 'native_checked'); assert.equal(h.nativeCalls.length, 3);
  assert.equal(h.card.state.measurement.canSave, false); assert.equal(h.card.state.measurement.canExport, false);
});
test('all mounted rows are inspected without waiting for earlier bridge results, retaining row order', async () => {
  const pending = [];
  const h = await harness(sample(), (result, call) => new Promise(resolve => {
    pending.push({ result: { ...result, ink: [0, call, result.width - call, result.height] }, resolve });
  }));
  await finish(h);
  assert.equal(pending.length, h.drawing().blocks.length + 1, 'all body rows and branding must be dispatched before any result');
  assert.equal(h.card.state.measurement.phase, 'geometry_checked');
  assert.equal(h.find('piece-logical-canvas').props.style.opacity, 0);
  for (let i = pending.length - 1; i > 0; i--) pending[i].resolve(pending[i].result);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.card.state.measurement.phase, 'geometry_checked');
  pending[0].resolve(pending[0].result);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.card.state.measurement.phase, 'native_checked');
  assert.deepEqual(copy(h.card.state.measurement.inspection.map(value => value.ink)), pending.map(value => value.result.ink));
  assert.equal(h.card.state.measurement.canSave, false); assert.equal(h.card.state.measurement.canExport, false);
});
test('a later row failure rejects the whole image even while an earlier inspection is pending', async () => {
  const pending = [];
  const h = await harness(sample(), result => new Promise((resolve, reject) => pending.push({ result, resolve, reject })));
  await finish(h);
  assert.equal(pending.length, h.drawing().blocks.length + 1);
  pending[pending.length - 1].reject(new Error('PRIVATE NATIVE BODY'));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.card.state.measurement.phase, 'unavailable');
  assert.equal(h.card.state.measurement.reason, 'native_measurement_unavailable');
  const stopped = h.card.state.measurement;
  for (const item of pending) item.resolve(item.result);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.card.state.measurement, stopped);
  assert.equal(h.find('piece-logical-canvas'), undefined);
  assert.equal(JSON.stringify(h.card.state).includes('PRIVATE'), false);
});
test('unsupported native module, failed glyph checks and malformed responses remove the image without exposing native error text', async () => {
  for (const native of [() => { throw new Error('PRIVATE NATIVE BODY'); }, r => ({ ...r, glyph_check: 'unknown' }),
    r => ({ ...r, version: 'other' }), r => ({ ...r, platform: 'android' }), r => ({ ...r, text: 'PRIVATE' }),
    r => ({ ...r, font_size: r.font_size + 2 }), r => ({ ...r, width: 1 }), r => ({ ...r, ink: [0,0,NaN,20] })]) {
    const h = await harness(sample(), native); await finish(h);
    assert.equal(h.card.state.measurement.phase, 'unavailable'); assert.equal(h.find('piece-logical-canvas'), undefined);
    assert.equal(JSON.stringify(h.card.state).includes('PRIVATE'), false);
  }
  const h = await harness(); h.NativeModules.PieceTextMetrics = null; await finish(h);
  assert.equal(h.card.state.measurement.reason, 'native_measurement_unavailable');
});
test('native ink outside the actual text view retries discrete sizes then fails at the floor', async () => {
  const h = await harness(sample(), r => ({ ...r, ink: [-1, 0, r.width, r.height] }));
  for (const size of [48,44,40,36]) {
    await prepare(h);
    assert.equal(h.find('piece-visual-block-0').props.style.fontSize, size); await finish(h);
  }
  assert.equal(h.card.state.measurement.reason, 'native_ink_overflow');
  assert.equal(h.find('piece-logical-canvas'), undefined);
});
test('native line ends must exactly match the measured body and platform grapheme boundaries', async () => {
  for (const mutate of [r => { r.line_ends = [1, r.utf16_length]; }, r => { r.boundaries = [0, 1]; },
    r => { r.boundaries = [0,0,r.utf16_length]; }, r => { r.utf16_length--; }]) {
    const h = await harness(sample(), r => { mutate(r); return r; }); await finish(h);
    assert.equal(h.card.state.measurement.phase,'unavailable');
  }
  const h = await harness(), text = 'A👩‍👩‍👧‍👦B', expected = { text, fontSize:48, box:{width:888,height:150}, lineEnds:[3,text.length], platform:'ios' };
  assert.throws(() => h.readPieceTextInspection({version:'piece.native_text.v1', platform:'ios',font_size:48,width:888,height:150,
    utf16_length:text.length,boundaries:[0,1,text.length-1,text.length],line_ends:expected.lineEnds,ink:[0,0,800,140],glyph_check:'no_missing_observed'},expected));
});
test('kinsoku classifies line-start punctuation and a line-end opening bracket for remeasurement', async () => {
  const h = await harness();
  for (const [text, end] of [['考えます。',4],['私は「考えます」',3]]) {
    const expected={text,fontSize:48,box:{width:888,height:150},lineEnds:[end,text.length],platform:'ios'};
    const inspected = h.readPieceTextInspection({version:'piece.native_text.v1',platform:'ios',font_size:48,width:888,height:150,
      utf16_length:text.length,boundaries:[...Array(text.length+1).keys()],line_ends:expected.lineEnds,ink:[0,0,800,140],glyph_check:'no_missing_observed'},expected);
    assert.equal(inspected.wrapViolation, true);
    assert.equal(inspected.overflow, false);
  }
});
test('late native promises cannot revive timeout, unmount, replacement, or a changed metric snapshot', async () => {
  for (const change of ['timeout','unmount','replacement','metrics']) {
    let release;
    const h=await harness(sample(),(r,call)=>call===1?new Promise(resolve=>{release=()=>resolve(r);}):r); await finish(h);
    if(change==='timeout'){const callback=[...h.timers.values()][0];h.timers.clear();callback();}
    if(change==='unmount')h.card.componentWillUnmount();
    if(change==='replacement'){const p=sample();p.preview_revision++;h.replace(p);}
    if(change==='metrics')sendBlock(h,0,{height:1800});
    const state=h.card.state.measurement;release();await new Promise(resolve=>setImmediate(resolve));
    assert.equal(h.card.state.measurement,state);assert.notEqual(state.phase,'native_checked');
  }
});

test('batched changed metrics cannot be overwritten by an earlier native result or rejection', async () => {
  for (const rejects of [false, true]) {
    let release;
    const h = await harness(sample(), (r, call) => call === 3 ? new Promise((resolve, reject) => {
      release = () => rejects ? reject(new Error('unavailable')) : resolve(r);
    }) : r);
    await finish(h);
    const queue = [], apply = h.card.setState.bind(h.card);
    h.card.setState = update => queue.push(update);
    sendBlock(h, 0, { height: 1800 });
    release(); await new Promise(resolve => setImmediate(resolve));
    assert.equal(queue.length, 3);
    h.card.setState = apply;
    for (const update of queue) apply(update);
    assert.equal(h.card.state.measurement.sizeIndex, 1);
    assert.equal(h.card.state.measurement.phase, 'planning');
    assert.equal(h.find('piece-logical-canvas').props.style.opacity, 0);
  }
});

test('a batched fired timeout cannot discard a new generation of the same artifact', async () => {
  const h = await harness(), queue = [], apply = h.card.setState.bind(h.card);
  h.card.setState = update => queue.push(update);
  [...h.timers.values()][0]();
  h.card.setState = apply;
  const next = sample(); next.preview_revision++;
  h.replace(next); h.replace(sample());
  const fresh = h.card.state.measurement;
  for (const update of queue) apply(update);
  assert.equal(h.card.state.measurement, fresh);
  await finish(h); assert.equal(h.card.state.measurement.phase, 'native_checked');
});

function savedSample(p = sample()) {
  const value = copy(p);
  for (const k of ['preview_id', 'preview_revision', 'expires_at', 'eligible_formats', 'quota', 'plan_capabilities']) delete value[k];
  const id = '30000000-0000-4000-8000-000000000003';
  return { ...value, piece_id: id, public_id: 'piece:' + id, row_version: 2,
    lifecycle_status: 'saved', saved_at: '2026-01-01T00:00:00Z',
    export_contract_version: 'piece.export_contract.v1', render_interface_version: 'piece.render_interface.v1',
    render_reproducibility_version: 'piece.render_reproducibility.v1',
    renderer_version: 'piece.rn_native_preview.prototype.v3' };
}
test('saved detail uses the same canvas with immutable recipe, all formats and no preview/tier admission', async () => {
  for (const format of ['short_essay', 'quote', 'declaration']) for (const ratio of ['4:5', '9:16']) {
    const p = sample(format, ratio, 'quiet_night', 'off');
    const preview = await harness(p), saved = await harness(savedSample(p), undefined, true, undefined, Date.parse('2031-01-01T00:00:00Z'));
    const withoutKey = input => { const out = copy(input); delete out.key; return out; };
    assert.deepEqual(withoutKey(saved.input()), withoutKey(preview.input()));
    assert.notEqual(saved.input().key, preview.input().key);
    assert.ok(!('quota' in saved.input()));
    await finish(saved);
    assert.equal(saved.card.state.measurement.phase, 'native_checked');
    assert.equal(saved.find('piece-logical-canvas').props.style.opacity, 1);
    assert.equal(saved.card.state.measurement.canSave, false);
    assert.equal(saved.card.state.measurement.canExport, false);
    assert.equal(saved.card.state.measurement.layout_state, undefined);
  }
});
test('saved rendering validates all hashes, lifecycle and pinned renderer without substituting preview data', async () => {
  const h = await harness();
  for (const mutate of [r => { r.piece_text_hash = 'a'.repeat(64); },
    r => { r.content_payload_hash = 'a'.repeat(64); }, r => { r.visual_recipe_hash = 'a'.repeat(64); },
    r => { r.lifecycle_status = 'deleted'; }, r => { r.renderer_version = 'piece.rn_renderer.v1'; },
    r => { r.renderer_version = 'piece.rn_native_preview.prototype.v1'; },
    r => { r.renderer_version = 'piece.rn_native_preview.prototype.v2'; },
    r => { r.renderer_version = 'unknown'; }, r => { r.quota = {}; }]) {
    const r = savedSample(); mutate(r);
    assert.equal(h.preparePieceNativeSavedDisplay(r), null);
  }
  assert.equal(h.preparePieceNativeCard({ savedRecord: savedSample(), display: display(sample()) }), null);
  assert.equal(h.preparePieceNativeCard({}), null);
});
test('saved row-version/detail replacement cannot reuse pending native success or old measurement events', async () => {
  let release;
  const h = await harness(savedSample(), result => new Promise(resolve => { release = () => resolve(result); }), true);
  const originalKey = h.input().key;
  for (let i = 0; i <= h.input().blocks.length; i++) sendBlock(h, i);
  const stale = h.find('piece-visual-block-0');
  h.replace({ ...savedSample(), row_version: 3 });
  assert.notEqual(h.input().key, originalKey);
  stale.props.onLayout({ nativeEvent: { layout: { width: 888, height: 1 } } });
  release(); await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.card.state.measurement.phase, 'planning');
  assert.deepEqual(copy(h.card.state.measurement.blocks), {});
  assert.equal(h.find('piece-logical-canvas').props.style.opacity, 0);
  const id = '40000000-0000-4000-8000-000000000004';
  h.replace({ ...savedSample(), piece_id: id, public_id: 'piece:' + id });
  assert.notEqual(h.input().key, originalKey);
  h.card.componentWillUnmount();
  assert.equal(h.timers.size, 0); assert.equal(h.card.textNodes.size, 0);
});

test('actual row ink determines bearing and vertical placement inside the unchanged content zone', async () => {
  for (const format of ['short_essay','quote']) {
    const h = await harness(sample(format), (r, call) => call <= h.drawing().blocks.length ? {...r,ink:[5,12,500,52]} : r);
    const count=h.drawing().blocks.length;
    for(let i=0;i<count;i++)sendBlock(h,i,{lines:[{text:h.drawing().blocks[i],x:0,y:0,width:500,height:h.card.state.measurement.plan.lineHeight}]});
    sendBlock(h,count,{height:40});await new Promise(resolve=>setImmediate(resolve));
    assert.equal(h.card.state.measurement.phase,'native_checked');
    const row=h.find('piece-visual-block-0'), lineHeight=h.card.state.measurement.plan.lineHeight;
    const x=format==='quote'?(h.input().contentWidth-500)/2:0;
    assert.equal(row.props.style.left,x);assert.equal(row.props.style.top,(lineHeight-40)/2-12);
    assert.ok(x+5>=0);assert.ok(x+500<=h.input().contentWidth);
    assert.equal(h.card.state.measurement.compositionHeight,h.card.state.measurement.plan.totalHeight);
  }
});
test('a queued plan result cannot replace the new artifact or expose its previous rows', async () => {
  let release;
  const h=rawHarness(sample(),undefined,false,(r,call)=>call===2?new Promise(resolve=>{release=()=>resolve(r);}):r);
  await prepare(h);
  const queue=[],apply=h.card.setState.bind(h.card);h.card.setState=update=>queue.push(update);
  release();await new Promise(resolve=>setImmediate(resolve));assert.equal(queue.length,1);
  h.card.setState=apply;const next=sample();next.preview_revision++;h.replace(next);
  const fresh=h.card.state.measurement;for(const update of queue)apply(update);
  assert.equal(h.card.state.measurement,fresh);assert.equal(fresh.phase,'planning');assert.equal(fresh.plan,null);
  await finish(h);assert.equal(h.card.state.measurement.phase,'native_checked');
});
test('actual row ink overflow starts fresh candidate measurement at the next catalog size', async () => {
  const h=await harness(sample(),(r,call)=>call===1?{...r,ink:[0,0,r.width+20,r.height]}:r);
  const first=h.candidateCalls.length, deadline=h.card.deadline;
  await finish(h);assert.equal(h.card.state.measurement.phase,'planning');assert.equal(h.card.state.measurement.sizeIndex,1);
  assert.equal(h.card.deadline,deadline);
  await finish(h);assert.equal(h.card.state.measurement.phase,'native_checked');
  assert.equal(h.candidateCalls.length,first+h.input().blocks.length);
  assert.equal(h.candidateCalls.at(-1).fontSize,44);
});

test('translation cannot repair ink already outside the native Text view', async () => {
  const h=await harness(sample(),r=>({...r,ink:[-5,12,500,52]}));
  await finish(h);assert.equal(h.card.state.measurement.phase,'planning');assert.equal(h.card.state.measurement.sizeIndex,1);
  assert.equal(h.find('piece-logical-canvas').props.style.opacity,0);
});
test('saved final inspection cannot pass an elapsed deadline before the timer callback runs', async () => {
  let release;
  const h=await harness(savedSample(),(r,call)=>call===1?new Promise(resolve=>{release=()=>resolve(r);}):r,true);
  await finish(h);const before=h.card.state.measurement;assert.equal(before.phase,'geometry_checked');
  h.now(NOW+8001);release();await new Promise(resolve=>setImmediate(resolve));
  assert.equal(h.card.state.measurement,before);assert.notEqual(h.card.state.measurement.phase,'native_checked');
  [...h.timers.values()][0]();assert.equal(h.card.state.measurement.reason,'measurement_timeout');
});


test('export canvas measures at fixed size and exposes only a current saved inner target', async () => {
  const h = await harness(savedSample(), undefined, true, undefined, NOW, true);
  assert.equal(h.card.getCaptureTarget(), null);
  await finish(h);
  const canvas = h.find('piece-logical-canvas');
  assert.equal(canvas.props.collapsable, false);
  assert.equal(canvas.props.style.transform[0].scale, 1);
  h.resize(180);
  assert.equal(h.card.state.width, 1080);
  const target = h.card.getCaptureTarget();
  assert.deepEqual([target.width, target.height], [1080,1350]);
  assert.equal(target.isCurrent(), true);
  h.replace({...savedSample(), row_version: 3});
  assert.equal(target.isCurrent(), false);
  assert.equal(h.card.getCaptureTarget(), null);
  await finish(h); h.render();
  const next = h.card.getCaptureTarget();
  h.card.componentWillUnmount();
  assert.equal(next.isCurrent(), false);
  assert.equal(h.card.getCaptureTarget(), null);
  const preview = await harness(); await finish(preview);
  assert.equal(preview.card.getCaptureTarget(), null);
});
