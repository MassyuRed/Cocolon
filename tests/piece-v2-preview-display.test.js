'use strict';

// Actual pure B10 API/model modules with synthetic transport/session only.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const OWNER = '10000000-0000-4000-8000-000000000001';
const NOW = Date.parse('2026-10-08T10:00:00Z');
const clone = value => JSON.parse(JSON.stringify(value));
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])])) : value;
const options = { enabled: true, expectedUserId: OWNER, idempotencyKey: 'synthetic-state-key' };
const contextOptions = { enabled: true, expectedUserId: OWNER, nowMs: NOW };
function request() {
  return { source_ref: {
    source_input_id: '20000000-0000-4000-8000-000000000002', source_input_version: 'emlis.current_input_bundle.v1',
    source_input_bundle_commitment: 'sha256:' + 'a'.repeat(64), emlis_observation_stage: 'normal_observation',
    emlis_observation_result_identity: 'synthetic-observation', question_need_decision_identity: null,
    supplemental_answer_identity: null,
  }, requested_format: null, visual_selection: { theme_id: null, aspect_ratio: null, branding_mode: null } };
}
function response(format = 'short_essay') {
  const blocks = ['  私は、静かに考える時間を大切にしています。  ', 'ただし、一人で決めたいわけではありません。'];
  if (format === 'quote') blocks.pop();
  const content_payload = { schema_version: 'piece.content_payload.v1', meaning_contract_version: 'piece.content_meaning.v1',
    safety_contract_version: 'piece.public_safety_transformation.v1', language: 'ja', format_type: format,
    title: null, body_blocks: blocks };
  const visual_recipe = { visual_recipe_version: 'piece.visual_recipe.v1', visual_catalog_version: 'piece.visual_catalog.v1',
    format_type: format, template: { template_id: { short_essay: 'essay_frame', quote: 'focus_frame', declaration: 'stance_frame' }[format], template_version: 1 },
    theme: { theme_id: 'soft_paper', theme_version: 1 }, font_style: { font_style_id: 'system_readable', font_style_version: 1 },
    aspect_ratio: '4:5', branding: { branding_mode: format === 'short_essay' ? 'required_small' : 'required_subtle', branding_mark_id: 'cocolon_text_mark', branding_mark_version: 1 },
    layout_policy_version: 'piece.long_text_layout.v1', language: 'ja' };
  const piece_text = blocks.join(format === 'short_essay' ? '\n\n' : '\n');
  return { api_contract_version: 'piece.api.v2', piece_contract_version: 'piece.record.v2',
    preview_id: '30000000-0000-4000-8000-000000000003', preview_revision: 1, row_version: 1,
    expires_at: '2026-10-08T10:00:01.123456+00:00', visibility_scope: 'private', content_status: 'ready',
    format_type: format, eligible_formats: [format], content_payload, content_payload_hash: hash(JSON.stringify(canonical(content_payload))),
    piece_text, piece_text_hash: hash(piece_text), visual_recipe, visual_recipe_hash: hash(JSON.stringify(canonical(visual_recipe))),
    quota: { contract_version: 'piece.quota_consumption.v1',
      subscription_tier: format === 'short_essay' ? 'free' : 'premium', month_key: '2026-10',
      save_limit: format === 'short_essay' ? 5 : null, saved_count: 2,
      remaining_count: format === 'short_essay' ? 3 : null, can_save: true },
    plan_capabilities: { format_selection: format === 'short_essay' ? 'fixed' : 'eligible_choice',
      theme_ids: format === 'short_essay' ? ['soft_paper'] : ['soft_paper', 'quiet_night'],
      aspect_ratios: format === 'short_essay' ? ['4:5'] : ['4:5', '9:16'],
      branding_modes: format === 'short_essay' ? ['required_small'] : ['required_subtle', 'off'] },
    renderer_version: 'synthetic-renderer.v1' };
}

function deferredPieceResponse() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
const controllerInput = extras => ({ ...options, request: request(), ...extras });
const pieceTick = () => new Promise(resolve => setImmediate(resolve));
const pieceHttp = value => ({ status: 200, json: async () => value });

// B10 native component source checks. React/RN primitives and lifecycle driving
// below are test doubles, NOT a React renderer or a device/image acceptance test.
const modalPath = path.join(__dirname, '../components/piece/PiecePreviewModal.js');
const hostPath = path.join(__dirname, '../screens/input/InputPieceActionArea.js');
function previewUiHarness({ send, currentState = 'active' } = {}) {
  let now = NOW, serial = 0;
  const calls = [], timers = new Map(), appListeners = new Set();
  const React = {
    Component: class {
      constructor(props) { this.props = props; this.state = {}; this.updateCount = 0; }
      setState(change) {
        this.updateCount++;
        this.state = { ...this.state, ...(typeof change === 'function' ? change(this.state) : change) };
      }
    },
    createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
  };
  const AppState = { currentState, addEventListener: (event, listener) => {
    assert.equal(event, 'change'); appListeners.add(listener);
    return { remove: () => appListeners.delete(listener) };
  } };
  const context = vm.createContext({ React, AppState, AbortController, AppRuntimeContext: {},
    Date: class extends Date { static now() { return now; } },
    Modal: 'Modal', View: 'View', Text: 'Text', ScrollView: 'ScrollView', Button: 'Button',
    ActivityIndicator: 'ActivityIndicator', SafeAreaView: 'SafeAreaView',
    NativeModules: {}, Platform: { OS: 'ios' }, findNodeHandle: () => null,
    setTimeout: (callback, delay) => { const id = ++serial; timers.set(id, { callback, at: now + delay }); return id; },
    clearTimeout: id => timers.delete(id),
    apiFetch: async (...args) => { calls.push(args); return send ? send(...args) : pieceHttp(response()); },
    getAccessToken: async () => 'synthetic-ui-session',
  });
  const pure = ['pieceApi.js', 'piecePreviewModel.js', 'PieceCreateController.js', 'pieceLayout.js', 'pieceRenderer.js'].map(file =>
    fs.readFileSync(path.join(__dirname, '../features/piece', file), 'utf8')
      .replace(/^import .*;$/gm, '').replace(/^export /gm, '')).join('\n');
  vm.runInContext(pure + '\nglobalThis.displayReader = readPiecePreviewDisplay; globalThis.digestUnderTest = pieceUtf8Digest;', context);
  for (const [file, name] of [[path.join(__dirname, '../components/piece/PieceVisualCard.js'), 'PieceVisualCard'],
    [modalPath, 'PiecePreviewModal'], [hostPath, 'InputPieceActionArea']]) {
    const source = fs.readFileSync(file, 'utf8').replace(/^import .*;$/gm, '').replace(/^export default /gm, '');
    vm.runInContext(`{\n${source}\nglobalThis.${name} = ${name};\n}`, context, { filename: file });
  }
  function expand(node) {
    if (node === null || node === undefined || node === false) return null;
    if (typeof node !== 'object') return node;
    if (typeof node.type === 'function') return expand(node.type.prototype?.render
      ? new node.type(node.props).render() : node.type(node.props));
    return { ...node, children: node.children.flat(Infinity).map(expand).filter(x => x !== null) };
  }
  function nodes(node) {
    if (!node || typeof node !== 'object') return [];
    return [node, ...node.children.flatMap(nodes)];
  }
  const host = new context.InputPieceActionArea({ context: controllerInput() });
  return { host, calls, timers, appListeners, read: context.displayReader, digest: context.digestUnderTest,
    mount: () => host.componentDidMount(), tree: () => expand(host.render()), nodes,
    background: state => { AppState.currentState = state; [...appListeners].forEach(fn => fn(state)); },
    advance: ms => {
      now += ms;
      let iterations = 0;
      while ([...timers.values()].some(t => t.at <= now)) {
        assert.ok(++iterations < 20, 'expiry does not schedule a zero-delay loop');
        for (const [id, timer] of [...timers]) if (timer.at <= now) { timers.delete(id); timer.callback(); }
      }
    },
  };
}
const receivedView = value => ({ phase: 'received', preview: value, canSave: true, canExport: true, hashVerified: true });

for (const format of ['short_essay', 'quote', 'declaration']) {
  test(`display verifies all three ${format} identities without changing text or granting save/export`, () => {
    const u = previewUiHarness(), raw = response(format), before = clone(raw);
    const display = u.read(receivedView(raw), NOW);
    assert.equal(display.phase, 'received'); assert.equal(display.hashVerified, true);
    assert.deepEqual(clone(display.preview), before); assert.deepEqual(raw, before);
    assert.equal(display.canSave, false); assert.equal(display.canExport, false);
    assert.equal(display.expiresAtMs, NOW + 1123);
    assert.ok(Object.isFrozen(display.preview.content_payload.body_blocks));
  });
}
for (const field of ['piece_text_hash', 'content_payload_hash', 'visual_recipe_hash']) {
  test(`well-shaped but incorrect ${field} is not exposed as a display preview`, () => {
    const u = previewUiHarness(), raw = response(); raw[field] = 'f'.repeat(64);
    const display = u.read(receivedView(raw), NOW);
    assert.equal(display.phase, 'unavailable'); assert.equal(display.preview, null);
    assert.equal(display.hashVerified, false); assert.equal(display.canRetry, false);
    assert.equal(display.message, 'プレビューの内容を確認できませんでした。');
  });
}
test('UTF-8 SHA-256 matches independent Node crypto at padding and unicode boundaries', () => {
  const u = previewUiHarness();
  const values = ['', 'abc', 'a'.repeat(55), 'a'.repeat(56), 'a'.repeat(63), 'a'.repeat(64),
    'a'.repeat(65), 'a'.repeat(1000), '日本語', '😀𠮷', '\u0000\u001f\t\n\\"',
    'e\u0301', 'é', '\u2028\u2029', '  本文\n\n末尾  '];
  for (let length = 1; length < 145; length++) values.push('aあ😀'.repeat(length));
  for (const value of values) assert.equal(u.digest(value), hash(value), JSON.stringify(value.slice(0, 20)));
  assert.notEqual(u.digest('e\u0301'), u.digest('é'), 'do not NFC-normalize the original bytes');
});
test('lone surrogates are not replaced while hashing', () => {
  const u = previewUiHarness();
  for (const value of ['\ud800', '\udfff', 'x\ud800z']) assert.throws(() => u.digest(value));
});
test('canonical payload key order is irrelevant but spaces and newlines remain significant', () => {
  const u = previewUiHarness(), raw = response();
  raw.content_payload = Object.fromEntries(Object.entries(raw.content_payload).reverse());
  raw.visual_recipe = Object.fromEntries(Object.entries(raw.visual_recipe).reverse());
  assert.equal(u.read(receivedView(raw), NOW).hashVerified, true);
  raw.piece_text = raw.piece_text.trim(); raw.content_payload.body_blocks[0] = raw.content_payload.body_blocks[0].trimStart();
  raw.content_payload.body_blocks[1] = raw.content_payload.body_blocks[1].trimEnd();
  assert.equal(u.read(receivedView(raw), NOW).preview, null);
});
test('display expiry is independently rechecked, including microsecond floor and invalid clock', () => {
  const u = previewUiHarness();
  assert.equal(u.read(receivedView(response()), NOW + 1122).hashVerified, true);
  for (const now of [NOW + 1123, NaN, Infinity]) assert.equal(u.read(receivedView(response()), now).preview, null);
});
test('display cannot grant save/export on hidden, loading, failure or malformed content', () => {
  const u = previewUiHarness();
  for (const phase of ['hidden', 'idle', 'loading', 'unavailable', 'other']) {
    const v = u.read({ phase, canSave: true, canExport: true, hashVerified: true }, NOW);
    assert.equal(v.preview, null); assert.equal(v.canSave, false); assert.equal(v.canExport, false);
  }
  assert.equal(u.read(receivedView({ question: 'private', answer: 'private' }), NOW).preview, null);
});
test('native host defaults hidden and constructing/mounting sends nothing', () => {
  const u = previewUiHarness();
  assert.equal(u.tree(), null);
  u.host.props = {}; u.mount(); assert.equal(u.tree(), null); assert.equal(u.calls.length, 0);
  u.host.componentWillUnmount(); assert.equal(u.appListeners.size, 0);
});
for (const format of ['short_essay', 'quote', 'declaration']) {
  test(`native component sources retain exact full ${format} text beside layout prototype without save controls`, async () => {
    const expected = response(format), u = previewUiHarness({ send: async () => pieceHttp(expected) });
    u.mount(); assert.equal(u.calls.length, 0);
    u.host.start(); u.host.start(); await pieceTick();
    const all = u.nodes(u.tree()), body = all.find(n => n.props.testID === 'piece-canonical-text');
    assert.ok(body); assert.equal(body.children.join(''), expected.piece_text);
    assert.equal(body.props.numberOfLines, undefined); assert.equal(body.props.ellipsizeMode, undefined);
    assert.ok(all.some(n => n.type === 'ScrollView')); assert.ok(all.some(n => n.type === 'Modal'));
    assert.ok(all.some(n => n.props.testID === 'piece-visual-preview'));
    assert.equal(all.filter(n => n.type === 'Button').map(n => n.props.title).join(','), '閉じる');
    assert.equal(all.some(n => n.type === 'Image'), false); assert.equal(u.calls.length, 1);
    assert.equal(JSON.stringify(u.host.state).includes(expected.piece_text), false);
    u.host.componentWillUnmount();
  });
}
for (const change of ['account', 'source', 'key', 'selection', 'disabled']) {
  test(`native host conceals an old received result before ${change} componentDidUpdate`, async () => {
    const u = previewUiHarness(); u.mount(); u.host.start(); await pieceTick();
    assert.ok(u.nodes(u.tree()).some(n => n.props.testID === 'piece-canonical-text'));
    const next = controllerInput();
    if (change === 'account') next.expectedUserId = 'another-owner';
    if (change === 'source') { next.request.source_ref.source_input_id = 'different'; next.idempotencyKey = 'new-source'; }
    if (change === 'key') next.idempotencyKey = 'different-key';
    if (change === 'selection') { next.request.visual_selection.theme_id = 'quiet_night'; next.idempotencyKey = 'new-selection'; }
    if (change === 'disabled') next.enabled = false;
    u.host.props = { context: next };
    assert.equal(u.tree(), null, 'render-time boundary; do not wait for lifecycle cleanup');
    u.host.retry(); u.host.start(); assert.equal(u.calls.length, 1);
    u.host.componentDidUpdate(); assert.equal(u.host.state.open, false);
    assert.equal(u.nodes(u.tree()).some(n => n.props.testID === 'piece-canonical-text'), false);
    u.host.componentWillUnmount();
  });
}
test('reordered context is not a new request and preserves an open preview', async () => {
  const u = previewUiHarness(); u.mount(); u.host.start(); await pieceTick();
  const next = controllerInput(); next.request.source_ref = Object.fromEntries(Object.entries(next.request.source_ref).reverse());
  u.host.props = { context: next }; u.host.componentDidUpdate();
  assert.equal(u.host.state.open, true); assert.equal(u.calls.length, 1);
  u.host.componentWillUnmount();
});
test('closing the native modal drops local text, sends no server DELETE and fences late success', async () => {
  const d = deferredPieceResponse(), u = previewUiHarness({ send: () => d.promise });
  u.mount(); u.host.start(); await pieceTick();
  const closeButton = u.nodes(u.tree()).find(n => n.type === 'Button' && n.props.title === '閉じる');
  closeButton.props.onPress(); assert.equal(u.calls[0][1].signal.aborted, true);
  d.resolve(pieceHttp(response())); await pieceTick();
  assert.equal(u.host.state.open, false); assert.equal(u.calls.length, 1);
  assert.equal(u.nodes(u.tree()).some(n => n.type === 'Modal'), false);
  u.host.componentWillUnmount();
});
test('native failure retry is explicit and keeps the exact request/key', async () => {
  let count = 0;
  const u = previewUiHarness({ send: async () => { if (++count === 1) throw new Error('PRIVATE'); return pieceHttp(response()); } });
  u.mount(); u.host.start(); await pieceTick();
  const retryButton = u.nodes(u.tree()).find(n => n.type === 'Button' && n.props.title === '同じ要求で再試行');
  assert.ok(retryButton); assert.equal(u.calls.length, 1); assert.doesNotMatch(JSON.stringify(u.tree()), /PRIVATE/);
  retryButton.props.onPress(); retryButton.props.onPress(); await pieceTick();
  assert.equal(u.calls.length, 2); assert.equal(u.calls[0][1].body, u.calls[1][1].body);
  assert.equal(u.calls[0][1].headers['Idempotency-Key'], u.calls[1][1].headers['Idempotency-Key']);
  u.host.componentWillUnmount();
});
test('hash failure exposes neither body nor retry/save/export controls', async () => {
  const raw = response(); raw.visual_recipe_hash = 'f'.repeat(64);
  const u = previewUiHarness({ send: async () => pieceHttp(raw) }); u.mount(); u.host.start(); await pieceTick();
  const all = u.nodes(u.tree()); assert.equal(all.some(n => n.props.testID === 'piece-canonical-text'), false);
  assert.deepEqual(all.filter(n => n.type === 'Button').map(n => n.props.title), ['閉じる']);
  u.host.retry(); await pieceTick(); assert.equal(u.calls.length, 1); u.host.componentWillUnmount();
});
test('expiry timer removes the displayed body without polling or another request', async () => {
  const u = previewUiHarness(); u.mount(); u.host.start(); await pieceTick(); assert.equal(u.timers.size, 1);
  u.advance(1123);
  assert.equal(u.nodes(u.tree()).some(n => n.props.testID === 'piece-canonical-text'), false);
  assert.match(JSON.stringify(u.tree()), /有効期限が切れ/); assert.equal(u.timers.size, 0); assert.equal(u.calls.length, 1);
  u.host.componentWillUnmount();
});
test('background clears a pending preview and foreground does not resend or revive it', async () => {
  const d = deferredPieceResponse(), u = previewUiHarness({ send: () => d.promise });
  u.mount(); u.host.start(); await pieceTick(); u.background('inactive'); assert.equal(u.tree(), null);
  d.resolve(pieceHttp(response())); await pieceTick(); u.background('active');
  assert.equal(u.host.state.open, false); assert.equal(u.calls.length, 1);
  assert.equal(u.nodes(u.tree()).some(n => n.props.testID === 'piece-canonical-text'), false);
  u.host.componentWillUnmount();
});
test('unmount clears subscriptions/timer, late results do not update state, remount needs a new explicit action', async () => {
  const d = deferredPieceResponse(), u = previewUiHarness({ send: () => d.promise });
  u.mount(); u.host.start(); await pieceTick(); u.host.componentWillUnmount();
  const updates = u.host.updateCount; d.resolve(pieceHttp(response())); await pieceTick();
  assert.equal(u.host.updateCount, updates); assert.equal(u.appListeners.size, 0); assert.equal(u.timers.size, 0);
  u.mount(); assert.equal(u.host.state.open, false); assert.equal(u.calls.length, 1);
  assert.equal(u.nodes(u.tree()).some(n => n.props.testID === 'piece-canonical-text'), false);
  u.host.componentWillUnmount();
});
test('unknown initial AppState remains hidden until active, without automatic requests', () => {
  const u = previewUiHarness({ currentState: null }); u.mount(); assert.equal(u.tree(), null);
  u.host.start(); assert.equal(u.calls.length, 0); u.background('active');
  assert.ok(u.nodes(u.tree()).some(n => n.type === 'Button')); assert.equal(u.calls.length, 0);
  u.host.componentWillUnmount();
});

test('an observed native-host expiry cannot reappear after a later local clock rollback', async () => {
  const u = previewUiHarness(); u.mount(); u.host.start(); await pieceTick();
  u.advance(1123); u.advance(-1123); u.host.controller.refresh();
  assert.equal(u.nodes(u.tree()).some(n => n.props.testID === 'piece-canonical-text'), false);
  assert.match(JSON.stringify(u.tree()), /有効期限が切れ/);
  assert.equal(u.calls.length, 1); assert.equal(u.timers.size, 0);
  u.host.componentWillUnmount();
});


for (const tier of ['free', 'plus', 'premium']) {
  test(`preview shows ${tier} capability and current-month quota without granting actions`, async () => {
    const raw = response(tier === 'premium' ? 'quote' : 'short_essay');
    if (tier === 'plus') {
      raw.quota = { ...raw.quota, subscription_tier: 'plus', save_limit: 30, remaining_count: 28 };
      raw.plan_capabilities = { format_selection: 'automatic', theme_ids: ['soft_paper', 'quiet_night'],
        aspect_ratios: ['4:5'], branding_modes: ['required_subtle'] };
      raw.visual_recipe.branding.branding_mode = 'required_subtle';
      raw.visual_recipe_hash = hash(JSON.stringify(canonical(raw.visual_recipe)));
    }
    if (tier === 'free') raw.quota = { ...raw.quota, saved_count: 5, remaining_count: 0, can_save: false };
    const u = previewUiHarness({ send: async () => pieceHttp(raw) });
    u.mount(); u.host.start(); await pieceTick();
    const nodes = u.nodes(u.tree());
    const labels = nodes.filter(n => n.type === 'Text').map(n => n.children.join('')).join('\n');
    assert.match(labels, /2026-10（日本時間）の保存枠/);
    assert.ok(labels.includes({ free: '残り0回 / 5回', plus: '残り28回 / 30回', premium: '回数制限なし' }[tier]));
    assert.ok(labels.includes({ free: '形式：エッセイ（固定）', plus: '形式：入力に合う形式を自動選択', premium: '選択できる形式：引用' }[tier]));
    assert.equal(labels.includes('静かな夜'), tier !== 'free');
    assert.equal(labels.includes('9:16'), tier === 'premium');
    assert.equal(labels.includes('表示なし'), tier === 'premium');
    assert.equal(nodes.filter(n => n.type === 'Button').map(n => n.props.title).join(','), '閉じる');
    const display = u.read(receivedView(raw), NOW);
    assert.equal(display.canSave, false); assert.equal(display.canExport, false);
    u.advance(1123);
    assert.equal(u.nodes(u.tree()).some(n => n.props.testID === 'piece-plan-details'), false);
    u.host.componentWillUnmount();
  });
}
