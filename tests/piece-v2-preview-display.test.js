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
function previewUiHarness({ send, currentState = 'active', admitSave = false } = {}) {
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
  // Synthetic admission only for save-outcome wiring tests. No production host
  // supplies this callback, and these tests do not qualify a native renderer.
  if (admitSave) vm.runInContext(`const makeController = createPieceCreateController;
    createPieceCreateController = config => makeController({ ...config, isSaveAdmitted: () => true });`, context);
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
const uiSaveReceipt = (extras = {}) => ({ piece_id: response().preview_id,
  consumption_id: '40000000-0000-4000-8000-000000000004', lifecycle_status: 'saved',
  visibility_scope: 'private', row_version: 2, saved_at: '2026-10-08T10:00:00Z',
  idempotency_replayed: false, ...extras });
function startSyntheticSave(u) {
  const view = u.host.controller.getView(), p = view.preview;
  return u.host.controller.savePreview({ preview_id: p.preview_id,
    preview_revision: p.preview_revision, visual_recipe_hash: p.visual_recipe_hash },
  view.visualToken, 'synthetic-explicit-save-key');
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
    'a'.repeat(65), ...[119, 120, 127, 128, 129, 1000].map(n => 'a'.repeat(n)), '日本語', '😀𠮷', '\u0000\u001f\t\n\\"',
    'e\u0301', 'é', '\u2028\u2029', '  本文\n\n末尾  '];
  for (let length = 1; length < 145; length++) values.push('aあ😀'.repeat(length));
  for (const value of values) assert.equal(u.digest(value), hash(value), JSON.stringify(value.slice(0, 20)));
  assert.notEqual(u.digest('e\u0301'), u.digest('é'), 'do not NFC-normalize the original bytes');
});
test('lone surrogates are not replaced while hashing', () => {
  const u = previewUiHarness();
  for (const value of ['\ud800', '\udfff', 'x\ud800z', '\ud800\ud800', '\udfff\ud800']) assert.throws(() => u.digest(value));
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
    assert.ok(all.some(n => n.type === 'Button' && n.props.title === '閉じる'));
    assert.equal(all.some(n => n.type === 'Button' && /保存|書き出し|共有/.test(n.props.title)), false);
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
  test(`preview shows ${tier} capability and quota with only entitled visual choices, no save/export`, async () => {
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
    assert.equal(nodes.some(n => n.props.testID === 'piece-visual-theme_id'), tier !== 'free');
    assert.equal(nodes.some(n => n.props.testID === 'piece-visual-aspect_ratio'), tier === 'premium');
    assert.equal(nodes.some(n => n.props.testID === 'piece-visual-branding_mode'), tier === 'premium');
    assert.equal(nodes.some(n => n.type === 'Button' && /保存|書き出し|共有/.test(n.props.title)), false);
    const display = u.read(receivedView(raw), NOW);
    assert.equal(display.canSave, false); assert.equal(display.canExport, false);
    u.advance(1123);
    assert.equal(u.nodes(u.tree()).some(n => n.props.testID === 'piece-plan-details'), false);
    u.host.componentWillUnmount();
  });
}

// Visual-only PATCH: actual host/controller/transport/model, synthetic HTTP/RN.
const visualIdentity = p => ({ preview_id: p.preview_id, preview_revision: p.preview_revision,
  visual_recipe_hash: p.visual_recipe_hash });
const visualSelection = p => ({ theme_id: p.visual_recipe.theme.theme_id,
  aspect_ratio: p.visual_recipe.aspect_ratio, branding_mode: p.visual_recipe.branding.branding_mode });
function changedVisual(p, choice = { theme_id: 'quiet_night' }, delta = 1) {
  const next = clone(p);
  next.preview_revision += delta; next.row_version += delta;
  if (choice.theme_id) next.visual_recipe.theme.theme_id = choice.theme_id;
  if (choice.aspect_ratio) next.visual_recipe.aspect_ratio = choice.aspect_ratio;
  if (choice.branding_mode) next.visual_recipe.branding.branding_mode = choice.branding_mode;
  next.visual_recipe_hash = hash(JSON.stringify(canonical(next.visual_recipe)));
  return next;
}
const uiButton = (u, name) => u.nodes(u.tree()).find(n => n.type === 'Button' && n.props.accessibilityLabel === name);

test('visual controls send current values, replace only recipe/revisions, and announce the update', async () => {
  const original = response('quote'); let current = original;
  const u = previewUiHarness({ send: async (url, opt) => {
    if (opt.method === 'PATCH') current = changedVisual(current, JSON.parse(opt.body).visual_selection);
    return pieceHttp(current);
  } });
  u.mount(); u.host.start(); await pieceTick();
  const staleControl = uiButton(u, 'テーマ：静かな夜');
  assert.equal(uiButton(u, 'テーマ：ソフトペーパー').props.accessibilityState.selected, true);
  staleControl.props.onPress(); staleControl.props.onPress();
  assert.equal(u.nodes(u.tree()).some(n => n.props.testID === 'piece-canonical-text'), false);
  await pieceTick();
  assert.equal(u.calls.length, 2);
  const [url, sent] = u.calls[1];
  assert.equal(url, '/emotion/piece/preview/' + original.preview_id); assert.equal(sent.method, 'PATCH');
  assert.equal(sent.headers['Idempotency-Key'], undefined);
  assert.deepEqual(JSON.parse(sent.body), { expected_preview_revision: 1,
    visual_selection: { theme_id: 'quiet_night', aspect_ratio: '4:5', branding_mode: 'required_subtle' } });
  const view = u.read(u.host.controller.getView(), NOW);
  assert.equal(view.preview.piece_text, original.piece_text); assert.equal(view.preview.expires_at, original.expires_at);
  assert.equal(view.preview.preview_revision, 2); assert.equal(view.hashVerified, true);
  assert.equal(view.canSave, false); assert.equal(view.canExport, false);
  assert.ok(u.nodes(u.tree()).some(n => n.children.includes('画像設定を更新しました。')));
  staleControl.props.onPress(); await pieceTick(); assert.equal(u.calls.length, 2, 'obsolete controls cannot mutate a new revision');
  uiButton(u, '画像比率：9:16').props.onPress(); await pieceTick();
  assert.deepEqual(JSON.parse(u.calls[2][1].body), { expected_preview_revision: 2,
    visual_selection: { theme_id: 'quiet_night', aspect_ratio: '9:16', branding_mode: 'required_subtle' } });
  uiButton(u, 'Cocolonの表記：表示なし').props.onPress(); await pieceTick();
  assert.equal(u.read(u.host.controller.getView(), NOW).preview.visual_recipe.branding.branding_mode, 'off');
  u.host.componentWillUnmount();
});

for (const outcome of ['lost_after_commit', 'lost_before_commit', 'stale', 'conflict', 'bad_hash', 'wrong_body', 'wrong_id', 'wrong_expiry', 'wrong_renderer', 'wrong_recipe', 'wrong_revision', 'wrong_row_version']) {
  test(`visual ${outcome}: recover with exact original POST/key, never repeat PATCH`, async () => {
    const original = response('quote'), updated = changedVisual(original);
    const u = previewUiHarness({ send: async (url, opt) => {
      if (opt.method !== 'PATCH') return pieceHttp(u.calls.length === 1 || outcome === 'lost_before_commit' ? original : updated);
      if (outcome.startsWith('lost_')) throw new Error('private network details');
      if (['stale', 'conflict'].includes(outcome)) return { status: 409, json: async () => ({ code: outcome === 'stale' ? 'PIECE_PREVIEW_STALE' : 'PIECE_CONFLICT' }) };
      const bad = clone(updated);
      if (outcome === 'bad_hash') bad.visual_recipe_hash = 'f'.repeat(64);
      if (outcome === 'wrong_body') { bad.piece_text = '別の本文'; bad.content_payload.body_blocks = [bad.piece_text]; bad.piece_text_hash = hash(bad.piece_text); bad.content_payload_hash = hash(JSON.stringify(canonical(bad.content_payload))); }
      if (outcome === 'wrong_id') bad.preview_id = '30000000-0000-4000-8000-000000000004';
      if (outcome === 'wrong_expiry') bad.expires_at = '2026-10-08T12:00:00Z';
      if (outcome === 'wrong_renderer') bad.renderer_version = 'another-renderer';
      if (outcome === 'wrong_recipe') { bad.visual_recipe.aspect_ratio = '9:16'; bad.visual_recipe_hash = hash(JSON.stringify(canonical(bad.visual_recipe))); }
      if (outcome === 'wrong_revision') bad.preview_revision = 3;
      if (outcome === 'wrong_row_version') bad.row_version = 3;
      return pieceHttp(bad);
    } });
    u.mount(); u.host.start(); await pieceTick();
    uiButton(u, 'テーマ：静かな夜').props.onPress(); await pieceTick();
    assert.equal(u.host.controller.getView().preview, null);
    assert.ok(uiButton(u, '最新のプレビューを取得'));
    assert.equal(u.calls.length, 2, 'no automatic retry');
    u.host.retry(); u.host.retry(); await pieceTick();
    assert.equal(u.calls.length, 3); assert.equal(u.calls[2][1].method, 'POST');
    assert.equal(u.calls[2][1].body, u.calls[0][1].body);
    assert.equal(u.calls[2][1].headers['Idempotency-Key'], u.calls[0][1].headers['Idempotency-Key']);
    const view = u.read(u.host.controller.getView(), NOW);
    assert.equal(view.preview.preview_revision, outcome === 'lost_before_commit' ? 1 : 2);
    assert.equal(view.preview.piece_text, original.piece_text); assert.equal(view.canSave, false);
    u.host.componentWillUnmount();
  });
}

for (const boundary of ['close', 'background', 'account', 'source', 'disable', 'unmount']) {
  test(`late visual success after ${boundary} cannot restore the preview or run old controls`, async () => {
    const d = deferredPieceResponse(), original = response('quote');
    const u = previewUiHarness({ send: async (url, opt) => opt.method === 'PATCH' ? d.promise : pieceHttp(original) });
    u.mount(); u.host.start(); await pieceTick();
    const control = uiButton(u, 'テーマ：静かな夜'); control.props.onPress(); await pieceTick();
    if (boundary === 'close') u.host.close();
    if (boundary === 'background') u.background('background');
    if (boundary === 'unmount') u.host.componentWillUnmount();
    if (['account', 'source', 'disable'].includes(boundary)) {
      const next = controllerInput();
      if (boundary === 'account') next.expectedUserId = 'another-owner';
      if (boundary === 'source') { next.request.source_ref.source_input_id = 'another-source'; next.idempotencyKey = 'another-key'; }
      if (boundary === 'disable') next.enabled = false;
      u.host.props = { context: next };
      control.props.onPress(); assert.equal(u.tree(), null);
      u.host.componentDidUpdate();
    }
    assert.equal(u.calls[1][1].signal.aborted, true);
    d.resolve(pieceHttp(changedVisual(original))); await pieceTick();
    assert.equal(u.nodes(u.tree()).some(n => n.props.testID === 'piece-canonical-text'), false);
    control.props.onPress(); await pieceTick(); assert.equal(u.calls.length, 2);
    if (boundary !== 'unmount') u.host.componentWillUnmount();
  });
}

test('late visual success at expiry is rejected without reviving the previous text or retry', async () => {
  const original = response('quote'), d = deferredPieceResponse();
  const u = previewUiHarness({ send: async (url, opt) => opt.method === 'PATCH' ? d.promise : pieceHttp(original) });
  u.mount(); u.host.start(); await pieceTick(); uiButton(u, 'テーマ：静かな夜').props.onPress(); await pieceTick();
  u.advance(1123); d.resolve(pieceHttp(changedVisual(original))); await pieceTick();
  assert.equal(u.host.controller.getView().preview, null); assert.equal(u.host.controller.getView().canRetry, false);
  assert.equal(u.calls.length, 2); u.host.componentWillUnmount();
});

for (const code of ['PIECE_AUTH_REQUIRED', 'PIECE_FEATURE_DISABLED', 'PIECE_PREVIEW_EXPIRED', 'PIECE_NOT_FOUND']) {
  test(`visual ${code} stays unavailable without automatic recovery or old body`, async () => {
    const status = { PIECE_AUTH_REQUIRED: 401, PIECE_FEATURE_DISABLED: 503, PIECE_PREVIEW_EXPIRED: 409, PIECE_NOT_FOUND: 404 }[code];
    const u = previewUiHarness({ send: async (url, opt) => opt.method === 'PATCH'
      ? { status, json: async () => ({ code }) } : pieceHttp(response('quote')) });
    u.mount(); u.host.start(); await pieceTick(); uiButton(u, 'テーマ：静かな夜').props.onPress(); await pieceTick();
    assert.equal(u.host.controller.getView().preview, null); assert.equal(u.host.controller.getView().canRetry, false);
    u.host.retry(); await pieceTick(); assert.equal(u.calls.length, 2); u.host.componentWillUnmount();
  });
}

test('forged choices, null defaults, no-op and wrong revision cannot issue PATCH', async () => {
  const original = response('quote'), u = previewUiHarness({ send: async () => pieceHttp(original) });
  u.mount(); u.host.start(); await pieceTick();
  for (const choice of [{ ...visualSelection(original), theme_id: 'unknown' },
    { ...visualSelection(original), branding_mode: 'required_small' },
    { ...visualSelection(original), theme_id: null }, visualSelection(original),
    { ...visualSelection(original), format_type: 'declaration' }]) {
    u.host.changeVisual(choice, visualIdentity(original), u.host.controller.getView().visualToken);
  }
  u.host.changeVisual({ ...visualSelection(original), theme_id: 'quiet_night' }, { ...visualIdentity(original), preview_revision: 2 }, u.host.controller.getView().visualToken);
  await pieceTick(); assert.equal(u.calls.length, 1); u.host.componentWillUnmount();
});

for (const boundary of ['close_reopen', 'source_a_b_a']) {
  test(`old visual controls cannot mutate identical artifact after ${boundary}`, async () => {
    const original = response('quote'), u = previewUiHarness({ send: async (url, opt) =>
      pieceHttp(opt.method === 'PATCH' ? changedVisual(original) : original) });
    u.mount(); u.host.start(); await pieceTick();
    const stale = uiButton(u, 'テーマ：静かな夜');
    if (boundary === 'close_reopen') u.host.close();
    else {
      u.host.props = { context: controllerInput({ idempotencyKey: 'other' }) }; u.host.componentDidUpdate();
      u.host.props = { context: controllerInput() }; u.host.componentDidUpdate();
    }
    u.host.start(); await pieceTick(); assert.equal(u.calls.length, 2);
    stale.props.onPress(); await pieceTick(); assert.equal(u.calls.length, 2);
    uiButton(u, 'テーマ：静かな夜').props.onPress(); await pieceTick();
    assert.equal(u.calls.length, 3); assert.equal(u.calls[2][1].method, 'PATCH');
    u.host.componentWillUnmount();
  });
}

for (const replay of ['older_revision', 'changed_body', 'different_id', 'advanced_revision']) {
  test(`visual recovery validates ${replay} against original artifact`, async () => {
    const original = response('quote'); original.preview_revision = 2; original.row_version = 3;
    const recovered = changedVisual(original, { theme_id: 'quiet_night' }, 2);
    if (replay === 'older_revision') { recovered.preview_revision = 1; recovered.row_version = 2; }
    if (replay === 'different_id') recovered.preview_id = '30000000-0000-4000-8000-000000000004';
    if (replay === 'changed_body') {
      recovered.piece_text = '別の本文'; recovered.content_payload.body_blocks = [recovered.piece_text];
      recovered.piece_text_hash = hash(recovered.piece_text);
      recovered.content_payload_hash = hash(JSON.stringify(canonical(recovered.content_payload)));
    }
    const u = previewUiHarness({ send: async (url, opt) => {
      if (opt.method === 'PATCH') throw new Error('lost');
      return pieceHttp(u.calls.length === 1 ? original : recovered);
    } });
    u.mount(); u.host.start(); await pieceTick(); uiButton(u, 'テーマ：静かな夜').props.onPress(); await pieceTick();
    u.host.retry(); await pieceTick();
    assert.equal(u.host.controller.getView().phase, replay === 'advanced_revision' ? 'received' : 'unavailable');
    assert.equal(u.calls.length, 3); assert.equal(u.calls.filter(c => c[1].method === 'PATCH').length, 1);
    u.host.componentWillUnmount();
  });
}

const cancelledReply = (p, replayed = false) => pieceHttp({ preview_id: p.preview_id,
  preview_revision: p.preview_revision, row_version: p.row_version + 1,
  lifecycle_status: 'cancelled', idempotency_replayed: replayed });
test('explicit cancellation removes the displayed candidate and keeps terminal state through close/reopen', async () => {
  const original = response('quote'), d = deferredPieceResponse();
  const u = previewUiHarness({ send: async (url, opt) => opt.method === 'DELETE' ? d.promise : pieceHttp(original) });
  u.mount(); u.host.start(); await pieceTick();
  const cancel = uiButton(u, 'このPiece候補を取り消す'), visual = uiButton(u, 'テーマ：静かな夜');
  cancel.props.onPress(); await pieceTick();
  assert.equal(u.host.controller.getView().preview, null);
  assert.equal(u.host.controller.getView().loadingKind, 'cancel');
  assert.equal(u.nodes(u.tree()).some(n => n.props.testID === 'piece-canonical-text'), false);
  cancel.props.onPress(); visual.props.onPress(); u.host.retry(); await pieceTick();
  assert.equal(u.calls.length, 2);
  d.resolve(cancelledReply(original)); await pieceTick();
  assert.equal(u.host.controller.getView().phase, 'cancelled');
  assert.equal(u.host.controller.getView().canSave, false);
  u.host.close(); u.host.start(); u.host.retry(); await pieceTick();
  assert.equal(u.calls.length, 2); assert.equal(u.host.controller.getView().phase, 'cancelled');
  assert.equal(uiButton(u, 'この入力をPieceにする'), undefined);
  assert.match(JSON.stringify(u.tree()), /候補を取り消しました/);
  u.host.componentWillUnmount();
});
test('unknown cancel outcome explicitly retries same DELETE after original expiry without POST recovery', async () => {
  const original = response(), u = previewUiHarness({ send: async (url, opt) => {
    if (opt.method !== 'DELETE') return pieceHttp(original);
    if (u.calls.length === 2) throw new Error('lost ack');
    return cancelledReply(original, true);
  } });
  u.mount(); u.host.start(); await pieceTick(); uiButton(u, 'このPiece候補を取り消す').props.onPress(); await pieceTick();
  assert.ok(uiButton(u, '同じ候補の取消を再試行'));
  u.host.close(); u.advance(2000);
  assert.equal(u.host.controller.getView().preview, null);
  uiButton(u, '同じ候補の取消を再試行').props.onPress(); await pieceTick();
  assert.deepEqual(u.calls.map(c => c[1].method), ['POST', 'DELETE', 'DELETE']);
  assert.equal(u.calls[1][0], u.calls[2][0]); assert.equal(u.calls[1][1].body, u.calls[2][1].body);
  assert.equal(u.host.controller.getView().phase, 'cancelled'); u.host.componentWillUnmount();
});
for (const boundary of ['close', 'background', 'account', 'source', 'disable', 'unmount']) {
  test(`late cancellation does not change context after ${boundary}`, async () => {
    const original = response(), d = deferredPieceResponse();
    const u = previewUiHarness({ send: async (url, opt) => opt.method === 'DELETE' ? d.promise : pieceHttp(original) });
    u.mount(); u.host.start(); await pieceTick();
    const control = uiButton(u, 'このPiece候補を取り消す'); control.props.onPress(); await pieceTick();
    if (boundary === 'close') u.host.close();
    else if (boundary === 'background') u.background('background');
    else if (boundary === 'unmount') u.host.componentWillUnmount();
    else {
      const next = controllerInput();
      if (boundary === 'account') next.expectedUserId = 'other-owner';
      if (boundary === 'source') next.idempotencyKey = 'new-source-key';
      if (boundary === 'disable') next.enabled = false;
      u.host.props = { context: next }; u.host.componentDidUpdate();
    }
    assert.equal(u.calls[1][1].signal.aborted, true);
    d.resolve(cancelledReply(original)); await pieceTick();
    assert.notEqual(u.host.controller?.getView().phase, 'cancelled');
    control.props.onPress(); await pieceTick(); assert.equal(u.calls.length, 2);
    if (boundary !== 'unmount') u.host.componentWillUnmount();
  });
}
for (const code of ['PIECE_PREVIEW_STALE', 'PIECE_CONFLICT', 'PIECE_PREVIEW_EXPIRED', 'PIECE_AUTH_REQUIRED']) {
  test(`cancel ${code} cannot rebind revision, retry POST or report success`, async () => {
    const u = previewUiHarness({ send: async (url, opt) => opt.method === 'DELETE'
      ? { status: code === 'PIECE_AUTH_REQUIRED' ? 401 : 409, json: async () => ({ code }) } : pieceHttp(response()) });
    u.mount(); u.host.start(); await pieceTick(); uiButton(u, 'このPiece候補を取り消す').props.onPress(); await pieceTick();
    assert.equal(u.host.controller.getView().phase, 'unavailable');
    assert.equal(u.host.controller.getView().canRetry, false);
    u.host.close(); u.host.start(); u.host.retry(); await pieceTick(); assert.equal(u.calls.length, 2);
    u.host.componentWillUnmount();
  });
}
test('old cancel callback after reopening same candidate and first action after expiry send no DELETE', async () => {
  const u = previewUiHarness(); u.mount(); u.host.start(); await pieceTick();
  const stale = uiButton(u, 'このPiece候補を取り消す');
  u.host.close(); u.host.start(); await pieceTick();
  stale.props.onPress(); await pieceTick(); assert.equal(u.calls.length, 2);
  const current = uiButton(u, 'このPiece候補を取り消す'); u.advance(1123);
  current.props.onPress(); await pieceTick(); assert.equal(u.calls.length, 2);
  u.host.componentWillUnmount();
});
test('cancel receipt with unexpected row version stays unknown instead of claiming cancellation', async () => {
  const u = previewUiHarness({ send: async (url, opt) => opt.method === 'DELETE'
    ? cancelledReply({ ...response(), row_version: 4 }) : pieceHttp(response()) });
  u.mount(); u.host.start(); await pieceTick(); uiButton(u, 'このPiece候補を取り消す').props.onPress(); await pieceTick();
  assert.equal(u.host.controller.getView().phase, 'unavailable');
  assert.equal(u.host.controller.getView().retryKind, 'cancel'); u.host.componentWillUnmount();
});


// Save initiation is synthetic here; the production UI still has no first-save
// control or renderer admission supplier. These verify actual outcome wiring.
test('save display preserves pending/unknown/saved without receipt fields or new save/export authority', () => {
  const u = previewUiHarness();
  for (const phase of ['loading', 'unavailable', 'saved']) {
    const display = u.read({ phase, loadingKind: 'save', retryKind: 'save', canRetry: true,
      canSave: true, canExport: true, preview: response(), savedReceipt: { raw: 'PRIVATE' },
      message: phase === 'saved' ? 'PRIVATE' : '保存結果を確認できませんでした。' }, NOW);
    assert.equal(display.phase, phase); assert.equal(display.loadingKind, 'save');
    assert.equal(display.retryKind, 'save'); assert.equal(display.canRetry, phase === 'unavailable');
    assert.equal(display.preview, null); assert.equal(display.savedReceipt, undefined);
    assert.equal(display.canSave, false); assert.equal(display.canExport, false);
    assert.doesNotMatch(JSON.stringify(display), /PRIVATE/);
    if (phase === 'saved') assert.equal(display.message, 'Pieceを保存しました。');
  }
});
test('actual modal shows pending, unknown retry and saved confirmation from the existing controller', async () => {
  const pending = deferredPieceResponse(); let saves = 0;
  const u = previewUiHarness({ admitSave: true, send: async url => {
    if (!url.endsWith('/save')) return pieceHttp(response());
    return ++saves === 1 ? pending.promise : pieceHttp(uiSaveReceipt({ idempotency_replayed: true }));
  } });
  u.host.props = { context: controllerInput({ saveEnabled: true }) };
  u.mount(); u.host.start(); await pieceTick();
  const saving = startSyntheticSave(u); await pieceTick();
  assert.match(JSON.stringify(u.tree()), /Pieceを保存しています。/);
  assert.doesNotMatch(JSON.stringify(u.tree()), /Pieceの保存・画像/);
  assert.equal(u.nodes(u.tree()).some(n => n.props.testID === 'piece-canonical-text'), false);
  pending.reject(Error('PRIVATE transport cause')); await saving;
  assert.match(JSON.stringify(u.tree()), /保存結果を確認できませんでした/);
  u.host.close(); u.advance(2000);
  const retry = uiButton(u, '同じ保存要求で結果を確認'); assert.ok(retry);
  retry.props.onPress(); await pieceTick();
  assert.equal(saves, 2); assert.equal(u.calls[1][1].body, u.calls[2][1].body);
  assert.equal(u.calls[1][1].headers['Idempotency-Key'], u.calls[2][1].headers['Idempotency-Key']);
  assert.match(JSON.stringify(u.tree()), /Pieceを保存しました。/);
  assert.deepEqual(u.nodes(u.tree()).filter(n => n.type === 'Button').map(n => n.props.title), ['閉じる']);
  u.host.close(); assert.match(JSON.stringify(u.tree()), /Pieceを保存しました。/);
  u.host.start(); u.host.retry(); await pieceTick(); assert.equal(u.calls.length, 3);
  assert.doesNotMatch(JSON.stringify(u.host.state), /PRIVATE|piece_text|preview_id/);
  u.host.componentWillUnmount();
});
test('real host construction never supplies admission even when a strict save flag is present', async () => {
  const u = previewUiHarness(); u.host.props = { context: controllerInput({ saveEnabled: true }) };
  u.mount(); u.host.start(); await pieceTick(); await startSyntheticSave(u);
  assert.equal(u.calls.length, 1); assert.equal(u.host.controller.getView().phase, 'received');
  assert.equal(u.nodes(u.tree()).some(n => n.type === 'Button' && /保存|共有|書き出し/.test(n.props.title)), false);
  u.host.componentWillUnmount();
});
test('resolved context observes save-only revocation before retry and preserves the same intent on reenable', async () => {
  let saves = 0;
  const u = previewUiHarness({ admitSave: true, send: async url => {
    if (!url.endsWith('/save')) return pieceHttp(response());
    if (++saves === 1) throw Error('lost ACK');
    return pieceHttp(uiSaveReceipt({ idempotency_replayed: true }));
  } });
  u.host.props = { context: controllerInput({ saveEnabled: true }) };
  u.mount(); u.host.start(); await pieceTick(); await startSyntheticSave(u); u.host.close();
  const oldRetry = uiButton(u, '同じ保存要求で結果を確認');
  u.host.props = { context: controllerInput({ saveEnabled: false }) };
  assert.equal(u.tree(), null); oldRetry.props.onPress(); await pieceTick(); assert.equal(saves, 1);
  u.host.componentDidUpdate(); assert.equal(uiButton(u, '同じ保存要求で結果を確認'), undefined);
  u.host.props = { context: controllerInput({ saveEnabled: true }) }; u.host.componentDidUpdate();
  uiButton(u, '同じ保存要求で結果を確認').props.onPress(); await pieceTick();
  assert.equal(saves, 2); assert.equal(u.host.controller.getView().phase, 'saved');
  assert.equal(u.calls[1][1].body, u.calls[2][1].body); u.host.componentWillUnmount();
});
test('resolved-context background suspends a save before abort and foreground needs an explicit retry', async () => {
  const d = deferredPieceResponse(); let observed = false;
  const u = previewUiHarness({ admitSave: true, send: async (url, options) => {
    if (!url.endsWith('/save')) return pieceHttp(response());
    options.signal.addEventListener('abort', () => { observed = true; void u.host.controller.retry(); });
    return d.promise;
  } });
  u.host.props = { context: controllerInput({ saveEnabled: true }) };
  u.mount(); u.host.start(); await pieceTick(); const pending = startSyntheticSave(u); await pieceTick();
  u.background('inactive'); await pieceTick(); assert.equal(observed, true); assert.equal(u.calls.length, 2);
  assert.equal(u.tree(), null); d.resolve(pieceHttp(uiSaveReceipt())); await pending;
  u.background('active'); assert.ok(uiButton(u, '同じ保存要求で結果を確認'));
  assert.equal(u.host.controller.getView().phase, 'unavailable'); assert.equal(u.calls.length, 2);
  u.host.componentWillUnmount();
});

for (const kind of ['save', 'cancel']) {
  test(`resolved-context background save-flag changes preserve the same ${kind} recovery intent`, async () => {
    let attempts = 0;
    const u = previewUiHarness({ admitSave: true, send: async (url, options) => {
      if (!url.endsWith('/save') && options.method !== 'DELETE') return pieceHttp(response());
      if (++attempts === 1) throw Error('lost ACK');
      return kind === 'save' ? pieceHttp(uiSaveReceipt({ idempotency_replayed: true })) : cancelledReply(response(), true);
    } });
    u.host.props = { context: controllerInput({ saveEnabled: true }) };
    u.mount(); u.host.start(); await pieceTick();
    if (kind === 'save') await startSyntheticSave(u);
    else { uiButton(u, 'このPiece候補を取り消す').props.onPress(); await pieceTick(); }
    u.background('inactive');
    for (const flag of [false, true]) {
      u.host.props = { context: controllerInput({ saveEnabled: flag }) }; u.host.componentDidUpdate();
      assert.equal(u.tree(), null); assert.equal(u.host.controller.getView().phase, 'hidden');
      u.host.retry(); await pieceTick(); assert.equal(attempts, 1);
    }
    u.background('active');
    assert.equal(u.host.controller.getView().retryKind, kind);
    const label = kind === 'save' ? '同じ保存要求で結果を確認' : '同じ候補の取消を再試行';
    uiButton(u, label).props.onPress(); await pieceTick();
    assert.equal(attempts, 2); assert.equal(u.calls.length, 3);
    assert.equal(u.calls[1][0], u.calls[2][0]); assert.equal(u.calls[1][1].body, u.calls[2][1].body);
    assert.equal(u.host.controller.getView().phase, kind === 'save' ? 'saved' : 'cancelled');
    u.host.componentWillUnmount();
  });
}

async function savedNavigationFixture() {
  const navigations = []; let canRead = true;
  const u = previewUiHarness({ admitSave: true, send: async url => pieceHttp(url.endsWith('/save') ? uiSaveReceipt() : response()) });
  u.host.props = { context: controllerInput({ saveEnabled: true }),
    navigation: { getParent: () => ({ navigate: (...args) => navigations.push(args) }) } };
  u.host.context = { runtime: {}, isFeatureEnabled: (name, fallback) => name === 'piece_v2_owner_read_enabled' ? canRead : fallback };
  u.mount(); u.host.start(); await pieceTick(); await startSyntheticSave(u);
  return { ...u, navigations, allowRead: value => { canRead = value; } };
}
test('saved confirmation opens the existing owner screen with only piece ID and expected owner, including after close', async () => {
  const u = await savedNavigationFixture();
  const first = uiButton(u, '保存したPieceを確認'); assert.ok(first);
  first.props.onPress(); assert.equal(u.host.state.open, false);
  assert.deepEqual(clone(u.navigations), [['Piece', { screen: 'PieceOwnerHistory', params: {
    savedPiece: { pieceId: response().preview_id, expectedUserId: OWNER },
  }, initial: false }]]);
  assert.equal(u.calls.length, 2, 'navigation does not reread or save in the source host');
  uiButton(u, '保存したPieceを確認').props.onPress(); assert.equal(u.navigations.length, 2);
  assert.equal(u.host.controller.getView().phase, 'saved'); u.host.componentWillUnmount();
});
for (const boundary of ['owner', 'source', 'background', 'owner-read', 'unmount']) {
  test(`old saved-open button cannot navigate after ${boundary}`, async () => {
    const u = await savedNavigationFixture(), old = uiButton(u, '保存したPieceを確認');
    if (boundary === 'owner') u.host.props = { ...u.host.props, context: controllerInput({ saveEnabled: true, expectedUserId: 'another-owner' }) };
    if (boundary === 'source') {
      const next = controllerInput({ saveEnabled: true, idempotencyKey: 'next-preview-key' });
      u.host.props = { ...u.host.props, context: next };
    }
    if (boundary === 'background') u.background('inactive');
    if (boundary === 'owner-read') u.allowRead('true');
    if (boundary === 'unmount') u.host.componentWillUnmount();
    old.props.onPress(); assert.equal(u.navigations.length, 0); assert.equal(u.calls.length, 2);
    if (boundary !== 'unmount') u.host.componentWillUnmount();
  });
}
test('saved-open rechecks identity if closing synchronously changes the source context', async () => {
  const u = await savedNavigationFixture(), old = uiButton(u, '保存したPieceを確認');
  u.host.controller.subscribe(() => {
    u.host.props = { ...u.host.props, context: controllerInput({ saveEnabled: true, idempotencyKey: 'changed-during-close' }) };
  });
  old.props.onPress(); assert.equal(u.navigations.length, 0); u.host.componentWillUnmount();
});
test('saved navigation target reaches actual owner detail GET and displays the freshly fetched saved record', async () => {
  const u = await savedNavigationFixture(); uiButton(u, '保存したPieceを確認').props.onPress();
  const source = fs.readFileSync(path.join(__dirname, 'piece-v2-owner-history.test.js'), 'utf8').split('const detailInput =')[0];
  const context = vm.createContext({ require, __dirname, AbortController, setImmediate });
  vm.runInContext(source + '\nglobalThis.ownerHarness = harness;', context);
  const saved = clone(response());
  for (const key of ['preview_id', 'preview_revision', 'expires_at', 'eligible_formats', 'quota', 'plan_capabilities']) delete saved[key];
  Object.assign(saved, { piece_id: response().preview_id, public_id: 'piece:' + response().preview_id,
    lifecycle_status: 'saved', saved_at: '2026-10-08T10:00:00Z', row_version: 2,
    export_contract_version: 'piece.export_contract.v1', render_interface_version: 'piece.render_interface.v1',
    render_reproducibility_version: 'piece.render_reproducibility.v1' });
  const dest = context.ownerHarness({ send: async () => pieceHttp(saved) });
  const target = u.navigations[0][1].params.savedPiece;
  const host = new dest.PieceOwnerHistoryHost({ owner: OWNER, flags: { piece_v2_owner_read_enabled: true },
    enabled: true, savedPiece: target });
  host.componentDidMount(); await pieceTick();
  assert.equal(dest.calls.length, 1); assert.equal(dest.calls[0][0], '/emotion/piece/' + target.pieceId);
  assert.equal(host.controller.getView().record?.piece_text, response().piece_text);
  assert.equal(host.controller.getView().record?.piece_text_hash, response().piece_text_hash);
  assert.equal(host.controller.getView().record?.visual_recipe_hash, response().visual_recipe_hash);
  assert.equal(u.calls.length, 2); host.componentWillUnmount(); u.host.componentWillUnmount();
});


test('actual saved-input binding reaches saved navigation after separate source, preview and synthetic save actions', async () => {
  const navigations = [], source = request().source_ref;
  const u = previewUiHarness({ admitSave: true, send: async (url, init) => pieceHttp(
    init.method === 'GET' ? source : url.endsWith('/save') ? uiSaveReceipt() : response()) });
  u.host.props = { savedInput: { savedInputId: source.source_input_id, expectedUserId: OWNER,
    idempotencyKey: 'synthetic-saved-input-navigation-key' },
    navigation: { getParent: () => ({ navigate: (...args) => navigations.push(args) }) } };
  u.host.context = { runtime: {}, isFeatureEnabled: name =>
    ['piece_v2_preview_enabled', 'piece_v2_save_enabled', 'piece_v2_owner_read_enabled'].includes(name) };
  u.mount(); assert.equal(u.calls.length, 0);
  await u.host.resolveSavedInput(); assert.equal(u.calls.length, 1);
  u.host.start(); await pieceTick(); await startSyntheticSave(u);
  uiButton(u, '保存したPieceを確認').props.onPress();
  assert.deepEqual(clone(navigations), [['Piece', { screen: 'PieceOwnerHistory', params: {
    savedPiece: { pieceId: response().preview_id, expectedUserId: OWNER },
  }, initial: false }]]);
  assert.deepEqual(u.calls.map(([url]) => url), ['/emotion/piece/source-ref/' + source.source_input_id,
    '/emotion/piece/preview', '/emotion/piece/save']);
  assert.equal(u.host.controller.getView().phase, 'saved'); u.host.componentWillUnmount();
});

async function serverDisabledSavedInputFixture() {
  const navigations = [], source = request().source_ref;
  let saves = 0, refreshes = 0;
  const u = previewUiHarness({ admitSave: true, send: async (url, init) => {
    if (init.method === 'GET') return pieceHttp(source);
    if (!url.endsWith('/save')) return pieceHttp(response());
    return ++saves === 1 ? { status: 503, json: async () => ({ code: 'PIECE_FEATURE_DISABLED' }) }
      : pieceHttp(uiSaveReceipt({ idempotency_replayed: true }));
  } });
  u.host.props = { savedInput: { savedInputId: source.source_input_id, expectedUserId: OWNER,
    idempotencyKey: 'synthetic-stopped-save-source-key' },
    navigation: { getParent: () => ({ navigate: (...args) => navigations.push(args) }) } };
  const publish = ({ preview = true, save = true, fresh = true } = {}) => {
    u.host.context = { runtime: fresh ? {} : u.host.context.runtime,
      isFeatureEnabled: name => ({ piece_v2_preview_enabled: preview,
        piece_v2_save_enabled: save, piece_v2_owner_read_enabled: true })[name] === true,
      refreshAppRuntime: async () => { refreshes++; } };
    if (u.host.mounted) u.host.componentDidUpdate();
  };
  publish(); u.mount();
  await u.host.resolveSavedInput(); u.host.start(); await pieceTick();
  await startSyntheticSave(u);
  assert.equal(refreshes, 1); assert.equal(u.calls.length, 3);
  return { ...u, publish, navigations, source };
}

for (const refresh of ['preview-off', 'save-off', 'batched-on']) {
  test(`server-disabled saved-input save recovers the same receipt and owner detail after ${refresh}`, async () => {
    const u = await serverDisabledSavedInputFixture();
    if (refresh !== 'batched-on') {
      u.publish(refresh === 'preview-off' ? { preview: false, save: false } : { save: false });
      assert.equal(u.host.controller.getView().canRetry, false);
      assert.equal(u.host.controller.getView().preview, null);
    }
    u.publish();
    assert.equal(u.calls.length, 3, 'runtime refresh must not retry or regenerate');
    const retry = uiButton(u, '同じ保存要求で結果を確認');
    assert.ok(retry, 're-enabled UI must retain the original save recovery instead of asking for the source again');
    assert.equal(uiButton(u, '保存入力を確認'), undefined);
    retry.props.onPress(); await pieceTick();
    assert.equal(u.calls.length, 4);
    assert.equal(u.calls[2][1].body, u.calls[3][1].body);
    assert.equal(u.calls[3][1].headers['Idempotency-Key'], 'synthetic-explicit-save-key');
    uiButton(u, '保存したPieceを確認').props.onPress();
    const target = u.navigations[0][1].params.savedPiece;
    assert.deepEqual(clone(target), { pieceId: response().preview_id, expectedUserId: OWNER });

    const source = fs.readFileSync(path.join(__dirname, 'piece-v2-owner-history.test.js'), 'utf8').split('const detailInput =')[0];
    const context = vm.createContext({ require, __dirname, AbortController, setImmediate });
    vm.runInContext(source + '\nglobalThis.ownerHarness = harness;', context);
    const saved = clone(response());
    for (const key of ['preview_id', 'preview_revision', 'expires_at', 'eligible_formats', 'quota', 'plan_capabilities']) delete saved[key];
    Object.assign(saved, { piece_id: target.pieceId, public_id: 'piece:' + target.pieceId,
      lifecycle_status: 'saved', saved_at: '2026-10-08T10:00:00Z', row_version: 2,
      export_contract_version: 'piece.export_contract.v1', render_interface_version: 'piece.render_interface.v1',
      render_reproducibility_version: 'piece.render_reproducibility.v1' });
    const dest = context.ownerHarness({ send: async () => pieceHttp(saved) });
    const host = new dest.PieceOwnerHistoryHost({ owner: OWNER, flags: { piece_v2_owner_read_enabled: true },
      enabled: true, savedPiece: target });
    host.componentDidMount(); await pieceTick();
    assert.equal(dest.calls.length, 1);
    assert.equal(dest.calls[0][0], '/emotion/piece/' + target.pieceId);
    assert.equal(host.controller.getView().record?.piece_text, response().piece_text);
    assert.deepEqual(clone(host.controller.getView().record?.visual_recipe), response().visual_recipe);
    assert.equal(host.controller.getView().record?.piece_text_hash, response().piece_text_hash);
    assert.equal(host.controller.getView().record?.visual_recipe_hash, response().visual_recipe_hash);
    assert.deepEqual(u.calls.map(([url]) => url), ['/emotion/piece/source-ref/' + u.source.source_input_id,
      '/emotion/piece/preview', '/emotion/piece/save', '/emotion/piece/save']);
    host.componentWillUnmount(); u.host.componentWillUnmount();
  });
}

test('background and same-runtime save flags cannot reopen a server-disabled saved-input save', async () => {
  const u = await serverDisabledSavedInputFixture();
  u.background('background'); u.background('active');
  assert.equal(u.host.controller.getView().canRetry, false);
  assert.equal(uiButton(u, '保存入力を確認'), undefined);
  u.publish({ save: false, fresh: false }); u.publish({ fresh: false });
  assert.equal(u.host.controller.getView().canRetry, false);
  await u.host.resolveSavedInput(); await u.host.retry();
  assert.equal(u.calls.length, 3);
  u.publish();
  assert.ok(uiButton(u, '同じ保存要求で結果を確認'));
  u.host.componentWillUnmount();
});

for (const boundary of ['owner', 'input', 'key', 'disable', 'unmount']) {
  test(`server-disabled save intent cannot survive ${boundary} invalidation`, async () => {
    const u = await serverDisabledSavedInputFixture(), oldProps = u.host.props;
    u.publish({ preview: false, save: false });
    if (boundary === 'unmount') {
      u.host.componentWillUnmount(); u.mount();
    } else if (boundary === 'disable') {
      u.host.controller.setContext({ enabled: false });
    } else {
      const savedInput = { ...oldProps.savedInput };
      if (boundary === 'owner') savedInput.expectedUserId = 'another-owner';
      if (boundary === 'input') savedInput.savedInputId = '20000000-0000-4000-8000-000000000099';
      if (boundary === 'key') savedInput.idempotencyKey = 'another-source-key';
      u.host.props = { ...oldProps, savedInput }; u.host.componentDidUpdate();
      u.host.props = oldProps; u.host.componentDidUpdate();
    }
    u.publish();
    assert.equal(uiButton(u, '同じ保存要求で結果を確認'), undefined);
    await u.host.retry();
    assert.equal(u.calls.length, 3, 'invalidated save identity never returns after runtime recovery');
    u.host.componentWillUnmount();
  });
}


test('bitmap harness keeps the original 13 fixture bytes and uses a separate exact-text group', () => {
  const { execFileSync } = require('node:child_process');
  const env = { ...process.env, PIECE_RN_CANVAS_PROFILE: 'output-grid-v4', PIECE_RN_BITMAP_GROUP: '0' };
  const runner = path.join(__dirname, 'native/piece-rn-canvas-fixtures.cjs');
  const legacyBytes = execFileSync(process.execPath, [runner], { env });
  assert.equal(hash(legacyBytes), 'a0abedcfa4f61240ce26b1c9d4481848cff3bdaa6a12d6133a9bced0df92c01f');
  const legacy = JSON.parse(legacyBytes), next = JSON.parse(execFileSync(process.execPath, [runner], { env: { ...env, PIECE_RN_BITMAP_GROUP: '1' } }));
  assert.equal(legacy.length, 13); assert.equal(next.length, 12);
  const previews = next.filter(row => row.evidence_set === 'bitmap_preview'); assert.equal(previews.length, 8);
  for (const fixture of previews) {
    const old = legacy.find(row => fixture.name === `bitmap_${row.name}`);
    assert.ok(old); assert.equal(fixture.props.display.preview.renderer_version, 'piece.rn_bitmap_preview.prototype.v1');
    const normalized = clone(fixture.props); normalized.display.preview.renderer_version = old.props.display.preview.renderer_version;
    assert.deepEqual(normalized, old.props);
  }
  for (const raw of next.filter(row => row.evidence_set === 'bitmap_raw'))
    assert.equal(raw.raw_text, legacy.find(old => raw.name === `bitmap_${old.name}`).raw_text);
  assert.equal(next.at(-1).controlled_host_crop, true);
});