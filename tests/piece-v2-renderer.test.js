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
function harness(p = sample(), nativeInspect) {
  let now = NOW, serial = 0;
  const timers = new Map(), nativeCalls = [];
  let card;
  const React = { Component: class {
    constructor(props) { this.props = props; this.state = {}; this.updates = 0; }
    setState(v) { const change = typeof v === 'function' ? v(this.state) : v;
      if (change) { this.state = { ...this.state, ...change }; this.updates++; this.componentDidUpdate?.(); } }
  }, createElement: (type, props, ...children) => ({ type, props: props || {}, children }) };
  const context = vm.createContext({ React, View: 'View', Text: 'Text',
    Platform: { OS: 'ios' }, findNodeHandle: node => node?.tag,
    NativeModules: { PieceTextMetrics: { inspect: async (tag, text, fontSize) => {
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
    ['features/piece/pieceApi.js', ['PieceApiError', 'readPiecePreviewSnapshot']],
    ['features/piece/piecePreviewModel.js', ['readPiecePreviewDisplay']],
    ['features/piece/pieceLayout.js', ['preparePieceNativePreview', 'createPieceNativeMeasurement', 'pieceNativeTypography', 'recordPieceNativeMeasurement']],
    ['features/piece/pieceRenderer.js', ['inspectPieceText', 'readPieceTextInspection']],
    ['components/piece/PieceVisualCard.js', ['PieceVisualCard']],
  ];
  for (const [file, names] of modules) {
    const source = fs.readFileSync(path.join(ROOT, file), 'utf8').replace(/^import .*;$/gm, '')
      .replace(/^export default /gm, '').replace(/^export /gm, '');
    vm.runInContext(`{\n${source}\n${names.map(n => `globalThis.${n} = ${n};`).join('\n')}\n}`, context, { filename: file });
  }
  card = new context.PieceVisualCard({ display: display(p) }); card.componentDidMount();
  const render = () => {
    const tree = card.render();
    for (const node of nodes(tree)) if (typeof node.props.ref === 'function') {
      node.props.ref({ tag: Number(node.props.testID.split('-').pop()) + 1 });
    }
    return tree;
  };
  const nodes = node => !node || typeof node !== 'object' ? [] : [node, ...node.children.flat(Infinity).flatMap(nodes)];
  const find = id => nodes(render()).find(n => n.props.testID === id);
  const resize = width => find('piece-visual-preview').props.onLayout({ nativeEvent: { layout: { width } } });
  resize(324);
  return { ...context, card, nodes, find, resize, render, timers, nativeCalls, now: value => { now = value; },
    input: () => context.preparePieceNativePreview(card.props.display),
    replace: packet => { card.props = { display: display(packet) };
      card.setState(context.PieceVisualCard.getDerivedStateFromProps(card.props, card.state)); },
  };
}
function sendBlock(h, index, { height = 100, width, lines } = {}) {
  const node = h.find(`piece-visual-block-${index}`), expected = node.children.join('');
  const w = width ?? h.input().contentWidth;
  node.props.onLayout({ nativeEvent: { layout: { width: w, height } } });
  node.props.onTextLayout({ nativeEvent: { lines: lines || [{ text: expected, x: 0, y: 0, width: w - 1, height }] } });
  return node;
}
async function finish(h, height = 100) {
  const input = h.input();
  for (let index = 0; index < input.blocks.length; index++) sendBlock(h, index, { height });
  if (input.brandingMode !== 'off') sendBlock(h, input.blocks.length, { height: 40 });
  await new Promise(resolve => setImmediate(resolve));
}

test('immutable v1 geometry, colors and discrete type scales cover all formats/ratios', async () => {
  const scales = { short_essay: [[48,44,40,36],[52,48,44,40]], quote: [[72,64,56],[80,72,64]], declaration: [[64,56,48],[72,64,56]] };
  for (const format of Object.keys(scales)) for (const [ri, ratio] of ['4:5', '9:16'].entries()) {
    const h = harness(sample(format, ratio, ri ? 'quiet_night' : 'soft_paper')), input = h.input();
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
  assert.match(source, /element\(PieceVisualCard, \{ display \}\)/);
  assert.match(source, /testID: 'piece-canonical-text', selectable: true/);
});
test('same native Text instances stay hidden until every paragraph and branding supplies both events', async () => {
  const h = harness(), canvas = () => h.find('piece-logical-canvas');
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
  const h = harness(); await finish(h); const before = h.card.state.measurement;
  h.resize(216);
  const canvas = h.find('piece-logical-canvas').props.style, text = h.find('piece-visual-block-0').props;
  assert.equal(canvas.width, 1080); assert.equal(canvas.height, 1350); assert.equal(canvas.transform[0].scale, 0.2);
  assert.equal(canvas.left + canvas.width * (1 - 0.2) / 2, 0);
  assert.equal(canvas.top + canvas.height * (1 - 0.2) / 2, 0);
  assert.equal(text.style.width, 888); assert.equal(text.style.fontSize, 48); assert.equal(text.style.lineHeight, 75);
  assert.equal(text.style.marginBottom, 48.75); assert.equal(text.allowFontScaling, false);
  assert.equal(text.adjustsFontSizeToFit, false); assert.equal(text.numberOfLines, undefined);
  assert.equal(text.ellipsizeMode, undefined); assert.equal(text.style.overflow, undefined);
  assert.equal(h.card.state.measurement, before);
});
test('vertical overflow tries only descending catalog sizes and floor failure removes the canvas', async () => {
  const h = harness();
  for (const expected of [48,44,40,36]) {
    assert.equal(h.find('piece-visual-block-0').props.style.fontSize, expected); await finish(h, 900);
  }
  assert.equal(h.card.state.measurement.phase, 'unavailable'); assert.equal(h.card.state.measurement.reason, 'font_floor_overflow');
  assert.equal(h.find('piece-logical-canvas'), undefined);
  assert.equal(h.card.state.measurement.canSave, false);
});
test('successful smaller candidate retains full body and font floor; old-size events cannot revive larger candidate', async () => {
  const h = harness(), old = h.find('piece-visual-block-0'); await finish(h, 900);
  assert.equal(h.card.state.measurement.sizeIndex, 1);
  old.props.onLayout({ nativeEvent: { layout: { width: 888, height: 1 } } });
  assert.deepEqual(copy(h.card.state.measurement.blocks), {});
  await finish(h, 100); assert.equal(h.card.state.measurement.phase, 'native_checked');
  assert.equal(h.find('piece-visual-block-0').children.join(''), h.input().blocks[0]);
  assert.equal(h.find('piece-visual-block-0').props.style.fontSize, 44);
});
test('line text loss, trimming, insertion and invalid numbers never expose a geometry-checked canvas', async () => {
  for (const mutate of [line => { line.text = line.text.trim(); }, line => { line.text += 'x'; },
    line => { line.width = NaN; }, line => { line.height = Infinity; }, line => { line.text = ''; }]) {
    const h = harness(), line = { text: h.input().blocks[0], x: 0, y: 0, width: 100, height: 100 }; mutate(line);
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
    const h = harness(); sendBlock(h, 0, { lines: lines(h.input().blocks[0]) }); sendBlock(h, 1); sendBlock(h, 2, { height: 40 });
    assert.equal(h.card.state.measurement.sizeIndex, 1); assert.equal(h.card.state.measurement.phase, 'measuring');
    assert.equal(h.find('piece-logical-canvas').props.style.opacity, 0);
  }
});
test('branding off keeps the same reserved content zone and paragraph positions', async () => {
  const on = harness(sample()), off = harness(sample('short_essay','4:5','soft_paper','off'));
  await finish(on); await finish(off);
  assert.equal(off.find('piece-visual-block-2'), undefined);
  assert.equal(off.input().contentHeight, on.input().contentHeight);
  assert.equal(off.card.state.measurement.compositionHeight, on.card.state.measurement.compositionHeight);
  assert.equal(off.find('piece-visual-block-0').props.style.fontSize, on.find('piece-visual-block-0').props.style.fontSize);
});
test('duplicates are inert; changed native metrics revoke a previously checked image immediately', async () => {
  const h = harness(); await finish(h); const updates = h.card.updates;
  sendBlock(h, 0); assert.equal(h.card.updates, updates);
  sendBlock(h, 0, { height: 1800 });
  assert.equal(h.card.state.measurement.sizeIndex, 1); assert.equal(h.find('piece-logical-canvas').props.style.opacity, 0);
});
test('revision, recipe, renderer and preview identity changes reset measurement and reject late events', async () => {
  for (const mutate of [p => { p.preview_revision++; }, p => { p.row_version++; },
    p => { p.preview_id = '30000000-0000-4000-8000-000000000099'; }, p => { p.renderer_version = 'different-profile'; },
    p => { p.visual_recipe.theme.theme_id = 'quiet_night'; p.visual_recipe_hash = hash(JSON.stringify(canonical(p.visual_recipe))); }]) {
    const h = harness(), old = h.find('piece-visual-block-0'); await finish(h);
    const p = sample(); mutate(p); h.card.props = { display: display(p) };
    assert.equal(h.render(), null, 'old geometry is hidden before lifecycle reconciliation');
    h.replace(p); old.props.onLayout({ nativeEvent: { layout: { width: 888, height: 100 } } });
    assert.deepEqual(copy(h.card.state.measurement.blocks), {});
    assert.equal(h.card.state.measurement.phase, 'measuring');
  }
});
test('expiry, hidden display and hash mismatch hide canvas before late measurement can be accepted', async () => {
  for (const mutate of [h => h.now(NOW + 1123), h => { h.card.props = { display: { phase: 'hidden' } }; },
    h => { const p = sample(); p.piece_text_hash = '0'.repeat(64); h.card.props = { display: display(p) }; }]) {
    const h = harness(), old = h.find('piece-visual-block-0'); await finish(h); const before = h.card.state.measurement;
    mutate(h); assert.equal(h.render(), null);
    old.props.onLayout({ nativeEvent: { layout: { width: 888, height: 100 } } });
    assert.equal(h.card.state.measurement, before);
  }
});
test('unmounted canvas rejects late events and has no network/storage/capture side effect', async () => {
  const h = harness(), old = h.find('piece-visual-block-0'), before = h.card.updates;
  h.card.componentWillUnmount(); old.props.onLayout({ nativeEvent: { layout: { width: 888, height: 100 } } });
  assert.equal(h.card.updates, before);
  assert.equal(h.timers.size, 0);
  for (const file of ['features/piece/pieceLayout.js','components/piece/PieceVisualCard.js']) {
    assert.doesNotMatch(fs.readFileSync(path.join(ROOT, file), 'utf8'), /console\.|apiFetch\(|AsyncStorage|captureRef\(|Share\.share/);
  }
});
test('missing native callbacks time out locally, late events cannot revive them, and completed measurements clear the timer', async () => {
  const h = harness(), old = h.find('piece-visual-block-0');
  assert.equal(h.timers.size, 1); const callback = [...h.timers.values()][0]; h.timers.clear(); callback();
  assert.equal(h.card.state.measurement.reason, 'measurement_timeout'); assert.equal(h.find('piece-logical-canvas'), undefined);
  old.props.onTextLayout({ nativeEvent: { lines: [{ text: h.input().blocks[0], x: 0, y: 0, width: 100, height: 100 }] } });
  assert.equal(h.card.state.measurement.phase, 'unavailable'); assert.equal(h.timers.size, 0);
  const complete = harness(); await finish(complete); assert.equal(complete.timers.size, 0);
});
test('a queued timeout from an old candidate cannot discard the replacement', async () => {
  const h = harness(), callback = [...h.timers.values()][0], next = sample(); next.preview_revision++;
  h.replace(next); const deadline = h.card.deadline; callback();
  assert.equal(h.card.deadline, deadline); assert.equal(h.timers.size, 1);
  await finish(h); callback();
  assert.equal(h.card.state.measurement.phase, 'native_checked'); assert.equal(h.timers.size, 0);
});
test('returning to the same artifact still rejects measurements from its previous mounted generation', async () => {
  const h = harness(), old = h.find('piece-visual-block-0'), next = sample(); next.preview_revision++;
  h.replace(next); h.replace(sample());
  old.props.onLayout({ nativeEvent: { layout: { width: 888, height: 100 } } });
  assert.deepEqual(copy(h.card.state.measurement.blocks), {});
  await finish(h); assert.equal(h.card.state.measurement.phase, 'native_checked');
});
test('multiple native lines preserve whitespace, punctuation, mixed scripts and emoji without text normalization', async () => {
  const p = sample(), first = '  私は、静かな時間を大切にします。', second = ' Café e\u0301 / 👩‍👩‍👧‍👦  ';
  p.content_payload.body_blocks = [first + second, '他の人の話にも、耳を傾けたいと思います。'];
  p.piece_text = p.content_payload.body_blocks.join('\n\n'); p.piece_text_hash = hash(p.piece_text);
  p.content_payload_hash = hash(JSON.stringify(canonical(p.content_payload)));
  const h = harness(p);
  sendBlock(h, 0, { height: 150, lines: [
    { text: first, x: 0, y: 0, width: 800, height: 75 }, { text: second, x: 0, y: 75, width: 600, height: 75 }] });
  sendBlock(h, 1); sendBlock(h, 2, { height: 40 });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.card.state.measurement.phase, 'native_checked');
  assert.equal(h.find('piece-visual-block-0').children.join(''), first + second);
  assert.equal(JSON.stringify(h.card.state.measurement).includes(first), false, 'retain metrics only');
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
    const h = harness(sample('short_essay','4:5',theme)), input = h.input();
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
  const h = harness(free); await finish(h);
  assert.equal(h.card.state.measurement.phase,'native_checked');
  assert.equal(h.find('piece-visual-block-2').props.style.color,'#800020');
  assert.equal(h.find('piece-visual-block-2').props.style.opacity,1);
});

test('line geometry alone stays hidden until the actual native inspection finishes', async () => {
  let release;
  const h = harness(sample(), (result, call) => call === 1 ? new Promise(resolve => { release = () => resolve(result); }) : result);
  await finish(h);
  assert.equal(h.card.state.measurement.phase, 'geometry_checked');
  assert.equal(h.find('piece-logical-canvas').props.style.opacity, 0); assert.equal(h.timers.size, 1);
  release(); await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.card.state.measurement.phase, 'native_checked'); assert.equal(h.nativeCalls.length, 3);
  assert.equal(h.card.state.measurement.canSave, false); assert.equal(h.card.state.measurement.canExport, false);
});
test('unsupported native module, failed glyph checks and malformed responses remove the image without exposing native error text', async () => {
  for (const native of [() => { throw new Error('PRIVATE NATIVE BODY'); }, r => ({ ...r, glyph_check: 'unknown' }),
    r => ({ ...r, version: 'other' }), r => ({ ...r, platform: 'android' }), r => ({ ...r, text: 'PRIVATE' }),
    r => ({ ...r, font_size: r.font_size + 2 }), r => ({ ...r, width: 1 }), r => ({ ...r, ink: [0,0,NaN,20] })]) {
    const h = harness(sample(), native); await finish(h);
    assert.equal(h.card.state.measurement.phase, 'unavailable'); assert.equal(h.find('piece-logical-canvas'), undefined);
    assert.equal(JSON.stringify(h.card.state).includes('PRIVATE'), false);
  }
  const h = harness(); h.NativeModules.PieceTextMetrics = null; await finish(h);
  assert.equal(h.card.state.measurement.reason, 'native_measurement_unavailable');
});
test('native ink outside the actual text view retries discrete sizes then fails at the floor', async () => {
  const h = harness(sample(), r => ({ ...r, ink: [-1, 0, r.width, r.height] }));
  for (const size of [48,44,40,36]) {
    assert.equal(h.find('piece-visual-block-0').props.style.fontSize, size); await finish(h);
  }
  assert.equal(h.card.state.measurement.reason, 'native_ink_overflow');
  assert.equal(h.find('piece-logical-canvas'), undefined);
});
test('native line ends must exactly match the measured body and platform grapheme boundaries', async () => {
  for (const mutate of [r => { r.line_ends = [1, r.utf16_length]; }, r => { r.boundaries = [0, 1]; },
    r => { r.boundaries = [0,0,r.utf16_length]; }, r => { r.utf16_length--; }]) {
    const h = harness(sample(), r => { mutate(r); return r; }); await finish(h);
    assert.equal(h.card.state.measurement.phase,'unavailable');
  }
  const h = harness(), text = 'A👩‍👩‍👧‍👦B', expected = { text, fontSize:48, box:{width:888,height:150}, lineEnds:[3,text.length], platform:'ios' };
  assert.throws(() => h.readPieceTextInspection({version:'piece.native_text.v1', platform:'ios',font_size:48,width:888,height:150,
    utf16_length:text.length,boundaries:[0,1,text.length-1,text.length],line_ends:expected.lineEnds,ink:[0,0,800,140],glyph_check:'no_missing_observed'},expected));
});
test('kinsoku rejects line-start punctuation and a line-end opening bracket without changing the body', async () => {
  const h = harness();
  for (const [text, end] of [['考えます。',4],['私は「考えます」',3]]) {
    const expected={text,fontSize:48,box:{width:888,height:150},lineEnds:[end,text.length],platform:'ios'};
    assert.throws(() => h.readPieceTextInspection({version:'piece.native_text.v1',platform:'ios',font_size:48,width:888,height:150,
      utf16_length:text.length,boundaries:[...Array(text.length+1).keys()],line_ends:expected.lineEnds,ink:[0,0,800,140],glyph_check:'no_missing_observed'},expected));
  }
});
test('late native promises cannot revive timeout, unmount, replacement, or a changed metric snapshot', async () => {
  for (const change of ['timeout','unmount','replacement','metrics']) {
    let release;
    const h=harness(sample(),(r,call)=>call===1?new Promise(resolve=>{release=()=>resolve(r);}):r); await finish(h);
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
    const h = harness(sample(), (r, call) => call === 3 ? new Promise((resolve, reject) => {
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
    assert.equal(h.card.state.measurement.phase, 'measuring');
    assert.equal(h.find('piece-logical-canvas').props.style.opacity, 0);
  }
});

test('a batched fired timeout cannot discard a new generation of the same artifact', async () => {
  const h = harness(), queue = [], apply = h.card.setState.bind(h.card);
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
