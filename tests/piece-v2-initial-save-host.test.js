'use strict';
// Actual host source. Unit cases double the controller/model/native boundary;
// integration cases below reuse the existing actual API/model/controller/modal
// harness with synthetic Auth/HTTP/runtime/entropy/admission only. No real
// renderer admission, native layout, production write or device acceptance.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ROOT = process.env.PIECE_TEST_ROOT || path.resolve(__dirname, '..');
const SOURCE = fs.readFileSync(path.join(ROOT, 'screens/input/InputPieceActionArea.js'), 'utf8');
const OWNER = '10000000-0000-4000-8000-000000000001';
const INPUT = '20000000-0000-4000-8000-000000000002';
const tick = () => new Promise(resolve => setImmediate(resolve));
const copy = value => JSON.parse(JSON.stringify(value));
const identity = p => Object.freeze({ preview_id: p.preview_id, preview_revision: p.preview_revision,
  visual_recipe_hash: p.visual_recipe_hash });
const preview = () => Object.freeze({ preview_id: '30000000-0000-4000-8000-000000000003',
  preview_revision: 1, piece_text_hash: 'a'.repeat(64), content_payload_hash: 'b'.repeat(64),
  visual_recipe_hash: 'c'.repeat(64), renderer_version: 'synthetic-unadmitted.v1',
  piece_text: '本文を保存keyや通知へコピーしません。' });
function unit({ provider = () => true, entropy, saveEnabled = true, mode = 'context' } = {}) {
  const calls = [], alerts = [], admissions = [], keys = [];
  let view = { phase: 'idle' }, config, subscriber, appListener;
  const read = v => ({ ...v, hashVerified: v.phase === 'received' && v.verified !== false,
    preview: v.phase === 'received' && v.verified !== false ? v.preview : null,
    expiresAtMs: null, canSave: false, canExport: false });
  const controller = {
    subscribe: listener => { subscriber = listener; return () => {}; },
    setContext: () => {}, setSaveAvailability: () => false, setCancellationEnabled: () => false,
    getView: () => view, refresh: () => subscriber?.(), dispose: () => {},
    close: () => { view = { phase: 'idle' }; subscriber?.(); },
    start: () => { view = { phase: 'received', preview: preview(), visualToken: Object.freeze({}) }; subscriber?.(); },
    retry: () => { calls.push(['retry']); }, changeVisual: () => {}, cancelPreview: () => {},
    savePreview: (id, token, key) => {
      // The real controller performs this independent check immediately before
      // storing its body-free immutable save intent; its source is exercised below.
      admissions.push([id, token]);
      if (config.isSaveAdmitted?.(view.preview, token) !== true) return;
      calls.push([copy(id), token, key]); view = { phase: 'loading', retryKind: 'save', loadingKind: 'save' };
      subscriber?.();
    },
  };
  const React = { Component: class {
    constructor(props) { this.props = props; }
    setState(value) { this.state = { ...this.state, ...(typeof value === 'function' ? value(this.state) : value) }; }
  }, createElement: (type, props, ...children) => ({ type, props: props || {}, children }) };
  const context = vm.createContext({ React, AppRuntimeContext: {}, View: 'View', Button: 'Button', Text: 'Text',
    PiecePreviewModal: 'PiecePreviewModal', AbortController,
    AppState: { currentState: 'active', addEventListener: (_name, callback) => {
      appListener = callback; return { remove() {} }; } },
    Alert: { alert: (...args) => alerts.push(args) },
    crypto: { getRandomValues: bytes => {
      keys.push(bytes); if (entropy) return entropy(bytes);
      bytes.fill(keys.length); return bytes;
    } },
    createPieceCreateController: value => { config = value; return controller; },
    preparePiecePreviewRequest: (request, value) => ({ request, expectedUserId: value.expectedUserId,
      idempotencyKey: value.idempotencyKey }),
    readPiecePreviewDisplay: read,
    PieceApiError: class extends Error {},
    setTimeout: () => 1, clearTimeout: () => {},
  });
  vm.runInContext(SOURCE.replace(/^import .*;$/gm, '').replace(/^export default /gm, '') +
    '\nglobalThis.Host = InputPieceActionArea;', context);
  const props = { isSaveAdmitted: provider,
    context: { enabled: true, saveEnabled, expectedUserId: OWNER, idempotencyKey: 'preview-key', request: { source: INPUT } } };
  if (mode === 'saved') {
    delete props.context;
    props.savedInput = { savedInputId: INPUT, expectedUserId: OWNER, idempotencyKey: 'preview-key' };
  }
  const host = new context.Host(props);
  let enabled = true, saving = saveEnabled;
  host.context = { runtime: {}, isFeatureEnabled: name => name === 'piece_v2_preview_enabled' ? enabled : saving };
  host.componentDidMount(); host.sourcePhase = mode === 'saved' ? 'ready' : 'idle'; host.start();
  const nodes = tree => !tree || typeof tree !== 'object' ? [] :
    [tree, ...(tree.children || []).flat(Infinity).flatMap(nodes)];
  const modal = () => nodes(host.render()).find(node => node.type === 'PiecePreviewModal');
  const press = () => { const node = modal(); assert.equal(node?.props.display.canSave, true, 'HOST_INITIAL_SAVE_NOT_CONNECTED');
    assert.equal(typeof node.props.onSave, 'function', 'HOST_INITIAL_SAVE_HANDLER_ABSENT');
    node.props.onSave(identity(node.props.display.preview), node.props.display.visualToken); };
  return { host, controller, context, calls, keys, alerts, admissions, modal, press,
    view: () => view, replace: v => { view = v; }, background: appListener,
    flags: (a, b) => { enabled = a; saving = b; }, config: () => config };
}

for (const mode of ['context', 'saved']) test(`initial-save host unit: ${mode} initial button forwards one exact private intent`, () => {
  const u = unit({ mode }), before = u.view(), node = u.modal();
  assert.equal(u.keys.length, 0); assert.equal(u.calls.length, 0);
  assert.equal(node.props.display.canSave, true, 'HOST_INITIAL_SAVE_NOT_CONNECTED');
  u.press();
  assert.equal(u.calls.length, 1); assert.deepEqual(u.calls[0][0], copy(identity(before.preview)));
  assert.equal(u.calls[0][1], before.visualToken);
  assert.match(u.calls[0][2], /^piece-save-[0-9a-f]{32}$/);
  assert.equal(u.keys.length, 1); assert.equal(u.keys[0].length, 16);
  assert.equal(JSON.stringify(u.host.state).includes(before.preview.piece_text), false);
});
for (const [name, provider] of [['missing', undefined], ['false', () => false], ['string', () => 'true'],
  ['number', () => 1], ['object', () => ({ admitted: true })], ['promise', () => Promise.resolve(true)],
  ['throws', () => { throw Error('PRIVATE'); }]]) {
  test(`initial-save host unit: non-admission ${name} cannot enable save`, () => {
    const u = unit(); u.host.props.isSaveAdmitted = provider;
    const modal = u.modal(); assert.notEqual(modal?.props.display.canSave, true);
    if (modal?.props.onSave) modal.props.onSave(identity(u.view().preview), u.view().visualToken);
    assert.equal(u.calls.length, 0); assert.equal(u.keys.length, 0); assert.equal(u.alerts.length, 0);
  });
}
test('initial-save host unit: flags, quota and native_checked cannot substitute for a supplier', () => {
  const u = unit(); delete u.host.props.isSaveAdmitted;
  u.replace({ ...u.view(), canSave: true, native_checked: true, layout_state: 'fit', quota: { can_save: true } });
  assert.equal(u.modal().props.display.canSave, false); assert.equal(u.keys.length, 0);
});
test('initial-save host unit: save-only flag off keeps preview without a save control', () => {
  const u = unit({ saveEnabled: false });
  assert.equal(u.modal().props.display.phase, 'received'); assert.equal(u.modal().props.display.canSave, false);
});
for (const boundary of ['close', 'background', 'unmount', 'owner', 'source', 'key', 'saveFlag', 'runtime',
  'provider', 'ticket', 'revision', 'recipe', 'unverified', 'expired']) {
  test(`initial-save host unit: rendered callback is fenced by ${boundary}`, () => {
    const u = unit(), node = u.modal(), original = u.view();
    assert.equal(typeof node.props.onSave, 'function', 'HOST_INITIAL_SAVE_HANDLER_ABSENT');
    if (boundary === 'close') u.host.close();
    if (boundary === 'background') u.background('inactive');
    if (boundary === 'unmount') u.host.componentWillUnmount();
    if (boundary === 'owner') u.host.props.context.expectedUserId = 'other-owner';
    if (boundary === 'source') u.host.props.context.request = { source: 'other-input' };
    if (boundary === 'key') u.host.props.context.idempotencyKey = 'other-preview-key';
    if (boundary === 'saveFlag') u.host.props.context.saveEnabled = false;
    if (boundary === 'runtime') u.host.props.context.enabled = false;
    if (boundary === 'provider') u.host.props.isSaveAdmitted = () => true;
    if (boundary === 'ticket') u.replace({ ...original, visualToken: Object.freeze({}) });
    if (boundary === 'revision') u.replace({ ...original, preview: { ...original.preview, preview_revision: 2 } });
    if (boundary === 'recipe') u.replace({ ...original, preview: { ...original.preview, visual_recipe_hash: 'f'.repeat(64) } });
    if (boundary === 'unverified') u.replace({ ...original, verified: false });
    if (boundary === 'expired') u.replace({ phase: 'unavailable', preview: null });
    node.props.onSave(identity(original.preview), original.visualToken);
    assert.equal(u.calls.length, 0); assert.equal(u.keys.length, 0); assert.equal(u.alerts.length, 0);
  });
}
test('initial-save host unit: stale saved-input flag and runtime publication are fenced before lifecycle', () => {
  for (const change of [u => u.flags(true, false), u => { u.host.context = { ...u.host.context, runtime: {} }; },
    u => { u.host.props.savedInput = { ...u.host.props.savedInput, savedInputId: '20000000-0000-4000-8000-000000000099' }; }]) {
    const u = unit({ mode: 'saved' }), node = u.modal(), original = u.view();
    assert.equal(typeof node.props.onSave, 'function', 'HOST_INITIAL_SAVE_HANDLER_ABSENT');
    change(u); node.props.onSave(identity(original.preview), original.visualToken);
    assert.equal(u.calls.length, 0); assert.equal(u.keys.length, 0);
  }
});
test('initial-save host unit: duplicate presses allocate one key; retry allocates none', () => {
  const u = unit(), node = u.modal(), original = u.view();
  assert.equal(typeof node.props.onSave, 'function', 'HOST_INITIAL_SAVE_HANDLER_ABSENT');
  for (let i = 0; i < 3; i++) node.props.onSave(identity(original.preview), original.visualToken);
  assert.equal(u.calls.length, 1); assert.equal(u.keys.length, 1);
  u.replace({ phase: 'unavailable', preview: null, retryKind: 'save', canRetry: true }); u.host.retry();
  assert.deepEqual(u.calls[1], ['retry']); assert.equal(u.keys.length, 1);
});
test('initial-save host unit: entropy failure reports a coarse retry message without losing preview', () => {
  const u = unit({ entropy: () => { throw Error('PRIVATE'); } }), original = u.view();
  u.press(); assert.equal(u.calls.length, 0); assert.equal(u.keys.length, 1);
  assert.equal(u.view(), original); assert.equal(u.alerts.length, 1);
  assert.equal(JSON.stringify(u.alerts).includes('PRIVATE'), false);
  assert.equal(JSON.stringify(u.alerts).includes(original.preview.piece_text), false);
});
test('initial-save host unit: no weak entropy fallback is used when random-values is absent', () => {
  const u = unit(); delete u.context.crypto;
  u.press(); assert.equal(u.calls.length, 0); assert.equal(u.alerts.length, 1);
});
test('initial-save host unit: entropy and admission callbacks cannot switch the target before HTTP', () => {
  for (const stage of ['entropy', 'admission']) {
    let u;
    u = unit({ entropy: bytes => { if (stage === 'entropy') u.host.close(); return bytes.fill(1); } });
    const node = u.modal(), original = u.view();
    assert.equal(typeof node.props.onSave, 'function', 'HOST_INITIAL_SAVE_HANDLER_ABSENT');
    if (stage === 'admission') {
      // Keep the same callback identity while revoking its live result.
      const provider = u.host.props.isSaveAdmitted;
      let close = false;
      u.host.props.isSaveAdmitted = (...args) => { if (close) u.host.close(); return provider(...args); };
      const currentNode = u.modal(); close = true;
      currentNode.props.onSave(identity(original.preview), original.visualToken);
    } else node.props.onSave(identity(original.preview), original.visualToken);
    assert.equal(u.calls.length, 0); assert.equal(u.alerts.length, 0);
  }
});

// This existing source harness loads the actual API/model/controller/host/modal.
// Only native entropy/Alert are added to its already synthetic boundaries.
function integrated({ outcome, admission = () => true } = {}) {
  let keyCalls = 0, saveCalls = 0, enabled = true, saveEnabled = true;
  const alerts = [];
  const vmWithNative = { ...vm, createContext: sandbox => vm.createContext({
    crypto: { getRandomValues: bytes => { keyCalls++; return bytes.fill(keyCalls); } },
    Alert: { alert: (...args) => alerts.push(args) }, ...sandbox,
  }) };
  const testRequire = name => name === 'node:vm' ? vmWithNative : require(name);
  const prelude = fs.readFileSync(path.join(ROOT, 'tests/piece-v2-preview-display.test.js'), 'utf8')
    .split('const receivedView =')[0];
  const context = vm.createContext({ require: testRequire, __dirname: path.join(ROOT, 'tests'), AbortController, setImmediate });
  vm.runInContext(prelude + '\nglobalThis.fixtures = {previewUiHarness,response,uiSaveReceipt};', context);
  const f = context.fixtures, expected = copy(f.response());
  const ref = { source_input_id: INPUT, source_input_version: 'emlis.current_input_bundle.v1',
    source_input_bundle_commitment: 'sha256:' + 'a'.repeat(64), emlis_observation_stage: 'normal_observation',
    emlis_observation_result_identity: 'synthetic-observation', question_need_decision_identity: null,
    supplemental_answer_identity: null };
  const u = f.previewUiHarness({ send: async (url, options) => {
    let result;
    if (url === '/emotion/piece/save') { saveCalls++; result = outcome ? await outcome(saveCalls, f) : f.uiSaveReceipt(); }
    else result = options.method === 'GET' ? ref : expected;
    return { status: 200, json: async () => result };
  } });
  u.host.props = { savedInput: { savedInputId: INPUT, expectedUserId: OWNER, idempotencyKey: 'preview-integration-key' },
    isSaveAdmitted: admission };
  const runtime = () => ({ runtime: {}, isFeatureEnabled: name =>
    name === 'piece_v2_preview_enabled' ? enabled : name === 'piece_v2_save_enabled' ? saveEnabled : false });
  u.host.context = runtime();
  return { ...u, expected, alerts, counts: () => ({ keyCalls, saveCalls }),
    buttons: () => u.nodes(u.tree()).filter(node => node.type === 'Button'),
    initial: () => u.nodes(u.tree()).find(node => node.props.testID === 'piece-initial-save'),
    publish: value => { enabled = value; u.host.context = runtime(); u.host.componentDidUpdate(); },
    saveFlag: value => { saveEnabled = value; },
    ready: async () => { u.mount(); await u.host.resolveSavedInput(); u.host.start(); await tick(); },
  };
}
test('initial-save integration: actual saved source -> modal press -> private save -> saved result', async () => {
  const u = integrated(); await u.ready();
  const button = u.initial(); assert.ok(button, 'HOST_INITIAL_SAVE_NOT_CONNECTED');
  assert.deepEqual(u.counts(), { keyCalls: 0, saveCalls: 0 });
  button.props.onPress(); button.props.onPress(); await tick();
  assert.deepEqual(u.counts(), { keyCalls: 1, saveCalls: 1 });
  assert.equal(u.host.controller.getView().phase, 'saved');
  const [, options] = u.calls.find(([url]) => url === '/emotion/piece/save');
  assert.deepEqual(JSON.parse(options.body), { preview_id: u.expected.preview_id,
    expected_preview_revision: u.expected.preview_revision, piece_text_hash: u.expected.piece_text_hash,
    content_payload_hash: u.expected.content_payload_hash, visual_recipe_hash: u.expected.visual_recipe_hash,
    visibility_scope: 'private' });
  assert.match(options.headers['Idempotency-Key'], /^piece-save-[0-9a-f]{32}$/);
  assert.notEqual(options.headers['Idempotency-Key'], 'preview-integration-key');
  assert.equal(u.initial(), undefined); u.host.componentWillUnmount();
});
test('initial-save integration: unknown save outcome retries identical request/key after runtime suspension', async () => {
  const u = integrated({ outcome: (call, f) => { if (call === 1) throw Error('PRIVATE'); return f.uiSaveReceipt({ idempotency_replayed: true }); } });
  await u.ready(); const button = u.initial(); assert.ok(button, 'HOST_INITIAL_SAVE_NOT_CONNECTED');
  button.props.onPress(); await tick();
  assert.equal(u.host.controller.getView().retryKind, 'save');
  u.host.close(); u.publish(false); u.publish(true);
  assert.deepEqual(u.counts(), { keyCalls: 1, saveCalls: 1 });
  u.host.retry(); await tick();
  const requests = u.calls.filter(([url]) => url === '/emotion/piece/save');
  assert.equal(requests.length, 2); assert.equal(requests[0][1].body, requests[1][1].body);
  assert.equal(requests[0][1].headers['Idempotency-Key'], requests[1][1].headers['Idempotency-Key']);
  assert.deepEqual(u.counts(), { keyCalls: 1, saveCalls: 2 });
  assert.equal(u.host.controller.getView().phase, 'saved');
  assert.equal(u.calls.filter(([url]) => url === '/emotion/piece/preview').length, 1);
  assert.equal(u.alerts.length, 0); u.host.componentWillUnmount();
});
for (const mode of ['noSupplier', 'revoked', 'expired', 'saveFlag', 'background', 'source']) {
  test(`initial-save integration: ${mode} cannot create a save request`, async () => {
    let admitted = true;
    const u = integrated({ admission: () => admitted });
    if (mode === 'noSupplier') delete u.host.props.isSaveAdmitted;
    await u.ready(); const button = u.initial();
    if (mode === 'noSupplier') assert.equal(button, undefined);
    else {
      assert.ok(button, 'HOST_INITIAL_SAVE_NOT_CONNECTED');
      if (mode === 'revoked') admitted = false;
      if (mode === 'expired') u.advance(1200);
      if (mode === 'saveFlag') u.saveFlag(false);
      if (mode === 'background') u.background('inactive');
      if (mode === 'source') u.host.props.savedInput = { ...u.host.props.savedInput,
        savedInputId: '20000000-0000-4000-8000-000000000099' };
      button.props.onPress(); await tick();
    }
    assert.deepEqual(u.counts(), { keyCalls: 0, saveCalls: 0 }); u.host.componentWillUnmount();
  });
}
