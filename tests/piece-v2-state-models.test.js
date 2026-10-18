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
function load() {
  const calls = [];
  const context = vm.createContext({
    apiFetch: async (...args) => { calls.push(args); return { status: 200, json: async () => response() }; },
    getAccessToken: async () => 'synthetic-token',
  });
  const source = ['pieceApi.js', 'piecePreviewModel.js'].map(file => fs.readFileSync(path.join(__dirname, '../features/piece', file), 'utf8')
    .replace(/^import .*;$/gm, '').replace(/^export /gm, '')).join('\n');
  vm.runInContext(source + '\n globalThis.model = { PieceApiError, requestPiecePreview, createPiecePreviewState, closePiecePreview, beginPiecePreview, completePiecePreview, failPiecePreview, retryPiecePreview, readPiecePreviewView };', context);
  return { ...context.model, calls };
}
const start = m => m.beginPiecePreview(m.createPiecePreviewState(), request(), options);

for (const format of ['short_essay', 'quote', 'declaration']) {
  test(`${format}: exact full text/blocks/recipe/hashes pass into received view without authority promotion`, () => {
    const m = load(), operation = start(m), raw = response(format);
    const state = m.completePiecePreview(operation.state, operation.ticket, raw, contextOptions);
    const view = m.readPiecePreviewView(state, contextOptions);
    assert.equal(view.phase, 'received');
    assert.deepEqual(clone(view.preview), raw);
    assert.equal(view.canSave, false); assert.equal(view.canExport, false); assert.equal(view.hashVerified, false);
    assert.ok(Object.isFrozen(view.preview.visual_recipe.theme));
    raw.piece_text = 'external mutation'; assert.notEqual(view.preview.piece_text, raw.piece_text);
    assert.equal(m.calls.length, 0);
  });
}

test('API transport and model execute together, preserving frozen request/key and response', async () => {
  const m = load(), begun = start(m), op = begun.state.operation;
  const result = await m.requestPiecePreview(op.request, op);
  const ready = m.completePiecePreview(begun.state, begun.ticket, result, contextOptions);
  assert.deepEqual(clone(m.readPiecePreviewView(ready, contextOptions).preview), response());
  assert.equal(m.calls.length, 1);
  assert.deepEqual(JSON.parse(m.calls[0][1].body), request());
  assert.equal(m.calls[0][1].headers['Idempotency-Key'], options.idempotencyKey);
});

test('default disabled and invalid flags never create a request ticket or expose a result', () => {
  const m = load(), begun = start(m);
  const received = m.completePiecePreview(begun.state, begun.ticket, response(), contextOptions);
  for (const enabled of [undefined, false, 1, 'true']) {
    assert.equal(m.beginPiecePreview(received, request(), { ...options, enabled }).ticket, null);
    assert.equal(m.readPiecePreviewView(received, { ...contextOptions, enabled }).preview, null);
  }
  assert.equal(m.readPiecePreviewView(received).preview, null);
});

test('caller mutation does not change captured source or retry key', () => {
  const m = load(), value = request(), opts = { ...options }, original = clone(value);
  const begun = m.beginPiecePreview(m.createPiecePreviewState(), value, opts);
  value.source_ref.source_input_id = 'changed'; opts.idempotencyKey = 'changed';
  assert.deepEqual(clone(begun.state.operation.request), original);
  assert.equal(begun.state.operation.idempotencyKey, options.idempotencyKey);
  assert.ok(Object.isFrozen(begun.state.operation.request.source_ref));
});

test('a second click during a request cannot create a second ticket', () => {
  const m = load(), a = start(m), b = m.beginPiecePreview(a.state, request(), options);
  assert.equal(b.ticket, null); assert.equal(b.state, a.state);
});

test('close or disable discards a late success and failure', () => {
  const m = load(), begun = start(m);
  const closed = m.closePiecePreview();
  const disabled = m.beginPiecePreview(begun.state, request(), { ...options, enabled: false }).state;
  for (const next of [closed, disabled]) {
    assert.equal(m.completePiecePreview(next, begun.ticket, response(), contextOptions), next);
    assert.equal(m.failPiecePreview(next, begun.ticket, new Error('private'), contextOptions), next);
    assert.equal(next.operation, null); assert.equal(next.preview, null);
  }
});

test('another source ticket excludes previous success/failure, without logging its contents', () => {
  const m = load(), previous = start(m), value = request(); value.source_ref.emlis_observation_result_identity = 'next-source';
  const next = m.beginPiecePreview(m.closePiecePreview(), value, { ...options, idempotencyKey: 'new-key' });
  assert.equal(m.completePiecePreview(next.state, previous.ticket, response(), contextOptions), next.state);
  assert.equal(m.failPiecePreview(next.state, previous.ticket, new Error('private'), contextOptions), next.state);
});

test('account change clears pending identity/body and suppresses an already received view', () => {
  const m = load(), begun = start(m);
  for (const expectedUserId of [null, 'different-owner']) {
    const changed = { ...contextOptions, expectedUserId };
    const state = m.completePiecePreview(begun.state, begun.ticket, response(), changed);
    assert.equal(state.operation, null); assert.equal(state.preview, null);
    const failed = m.failPiecePreview(begun.state, begun.ticket, new Error('private'), changed);
    assert.equal(failed.operation, null);
    const received = m.completePiecePreview(begun.state, begun.ticket, response(), contextOptions);
    assert.equal(m.readPiecePreviewView(received, changed).preview, null);
  }
});

test('temporary failure retries the exact snapshot/key only on explicit action, with a fresh ticket', () => {
  const m = load(), begun = start(m);
  const failed = m.failPiecePreview(begun.state, begun.ticket, new Error('PRIVATE DATA'), contextOptions);
  assert.equal(m.calls.length, 0); assert.doesNotMatch(JSON.stringify(failed), /PRIVATE DATA/);
  assert.equal(m.readPiecePreviewView(failed, contextOptions).canRetry, true);
  const retried = m.retryPiecePreview(failed, options);
  assert.equal(retried.state.operation, begun.state.operation);
  assert.notEqual(retried.ticket, begun.ticket);
  assert.equal(m.completePiecePreview(retried.state, begun.ticket, response(), contextOptions), retried.state);
});

for (const code of ['PIECE_SOURCE_NOT_FOUND', 'PIECE_PREVIEW_EXPIRED', 'PIECE_CONFLICT', 'PIECE_SAFETY_UNAVAILABLE']) {
  test(`${code} does not allow a UI retry or retain successful preview`, () => {
    const m = load(), a = start(m), failed = m.failPiecePreview(a.state, a.ticket, new m.PieceApiError(code), contextOptions);
    assert.equal(failed.preview, null); assert.equal(m.readPiecePreviewView(failed, contextOptions).canRetry, false);
    assert.equal(m.retryPiecePreview(failed, options).ticket, null);
  });
}

test('auth failure and abort clear source/key/body; retry cannot cross accounts', () => {
  const m = load(), a = start(m);
  for (const error of [new m.PieceApiError('PIECE_AUTH_REQUIRED'), Object.assign(new Error('private'), { name: 'AbortError' })]) {
    const state = m.failPiecePreview(a.state, a.ticket, error, contextOptions);
    assert.equal(state.operation, null); assert.equal(state.preview, null);
  }
  const failed = m.failPiecePreview(a.state, a.ticket, new Error('private'), contextOptions);
  const changed = m.retryPiecePreview(failed, { ...options, expectedUserId: 'other-owner' });
  assert.equal(changed.ticket, null); assert.equal(changed.state.operation, null);
});

test('changed request with previous key is rejected; same request key order retains original serialized bytes', () => {
  const m = load(), a = start(m), failed = m.failPiecePreview(a.state, a.ticket, new Error(), contextOptions);
  const altered = request(); altered.visual_selection.theme_id = 'quiet_night';
  assert.throws(() => m.beginPiecePreview(failed, altered, options), e => e.code === 'PIECE_CONFLICT');
  const reordered = request(); reordered.source_ref = Object.fromEntries(Object.entries(reordered.source_ref).reverse());
  const begun = m.beginPiecePreview(failed, reordered, options);
  assert.equal(begun.state.operation, failed.operation);
});

for (const expires_at of ['2026-10-08T10:00:00Z', '2026-10-08T19:00:00+09:00', '2026-10-08T05:00:00-05:00']) {
  test(`expiry ${expires_at} is not exposed at its boundary`, () => {
    const m = load(), a = start(m), value = response(); value.expires_at = expires_at;
    const state = m.completePiecePreview(a.state, a.ticket, value, contextOptions);
    assert.equal(state.code, 'PIECE_PREVIEW_EXPIRED'); assert.equal(state.preview, null);
  });
}

for (const expires_at of ['2026-02-29T10:00:01Z', '2026-04-31T10:00:01Z', '2026-10-08T25:00:01Z', '2026-10-08T10:00:01+25:00', '0000-10-08T10:00:01Z']) {
  test(`invalid server calendar ${expires_at} remains unavailable`, () => {
    const m = load(), a = start(m), value = response(); value.expires_at = expires_at;
    const state = m.completePiecePreview(a.state, a.ticket, value, contextOptions);
    assert.equal(state.code, 'PIECE_TEMPORARILY_UNAVAILABLE'); assert.equal(state.preview, null);
  });
}

test('fractional expiry is not extended; view expiry is checked again after receiving', () => {
  const m = load(), a = start(m);
  const state = m.completePiecePreview(a.state, a.ticket, response(), contextOptions);
  assert.equal(m.readPiecePreviewView(state, { ...contextOptions, nowMs: NOW + 1122 }).phase, 'received');
  assert.equal(m.readPiecePreviewView(state, { ...contextOptions, nowMs: NOW + 1123 }).preview, null);
  assert.equal(state.preview.expires_at, response().expires_at);
});

test('invalid clock and malformed/legacy response do not produce a successful preview', () => {
  const m = load(), a = start(m);
  for (const nowMs of [NaN, Infinity, 'now']) {
    assert.equal(m.completePiecePreview(a.state, a.ticket, response(), { ...contextOptions, nowMs }).preview, null);
  }
  for (const result of [null, { question: 'private', answer: 'private' }, { ...response(), piece_text: 'changed' }]) {
    assert.equal(m.completePiecePreview(a.state, a.ticket, result, contextOptions).preview, null);
  }
});

test('duplicate settlement and copied ticket cannot replace a received preview', () => {
  const m = load(), a = start(m);
  assert.equal(m.completePiecePreview(a.state, {}, response(), contextOptions), a.state);
  const received = m.completePiecePreview(a.state, a.ticket, response(), contextOptions);
  assert.equal(m.completePiecePreview(received, a.ticket, { question: 'bad' }, contextOptions), received);
  assert.equal(m.failPiecePreview(received, a.ticket, new Error('bad'), contextOptions), received);
});

// B10 async controller continuation. The preceding 28 model tests are retained
// byte-for-byte. These execute the actual API/model/controller sources; only
// module linkage, HTTP/session responses, and the clock are synthetic.
const controllerPath = path.join(__dirname, '../features/piece/PieceCreateController.js');
function deferredPieceResponse() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function controllerHarness({ send, session, clock = () => NOW, abort = AbortController, configuration = {} } = {}) {
  const calls = [], sessions = [];
  const context = vm.createContext({
    AbortController: abort,
    apiFetch: async (...args) => {
      calls.push(args);
      return send ? send(...args) : { status: 200, json: async () => response() };
    },
    getAccessToken: async owner => {
      sessions.push(owner);
      return session ? session(owner, sessions.length) : 'synthetic-controller-token';
    },
  });
  const sources = ['pieceApi.js', 'piecePreviewModel.js', 'PieceCreateController.js'].map(file =>
    fs.readFileSync(path.join(__dirname, '../features/piece', file), 'utf8')
      .replace(/^import .*;$/gm, '').replace(/^export /gm, '')).join('\n');
  vm.runInContext(sources + '\n globalThis.controllerFactory = createPieceCreateController;', context);
  const controller = context.controllerFactory({ ...configuration, now: clock });
  return { controller, calls, sessions };
}
const controllerInput = extras => ({ ...options, request: request(), ...extras });
const pieceTick = () => new Promise(resolve => setImmediate(resolve));
const pieceHttp = value => ({ status: 200, json: async () => value });

// Save lifecycle uses a synthetic admission function only. No renderer/device
// admission or product host activation is asserted by these tests.
const saveIdentity = value => ({ preview_id: value.preview_id,
  preview_revision: value.preview_revision, visual_recipe_hash: value.visual_recipe_hash });
const saveReceipt = (extras = {}) => ({ piece_id: response().preview_id,
  consumption_id: '40000000-0000-4000-8000-000000000004', lifecycle_status: 'saved',
  visibility_scope: 'private', row_version: 2, saved_at: '2026-10-08T10:00:00Z',
  idempotency_replayed: false, ...extras });
async function saveHarness(extra = {}) {
  const u = controllerHarness({ configuration: { isSaveAdmitted: () => true },
    send: async url => pieceHttp(url.endsWith('/save') ? saveReceipt() : response()), ...extra });
  u.controller.setContext(controllerInput({ saveEnabled: true }));
  await u.controller.start();
  u.identity = saveIdentity(response()); u.token = u.controller.getView().visualToken;
  u.save = (key = 'explicit-save-key') => u.controller.savePreview(u.identity, u.token, key);
  return u;
}

test('save stays inert without actual admission and strict save enablement', async () => {
  for (const isSaveAdmitted of [undefined, null, () => false, () => 1, () => 'true', () => Promise.resolve(true),
    () => { throw new Error('PRIVATE_ADMISSION'); }]) {
    const u = await saveHarness({ configuration: { isSaveAdmitted } });
    await u.save(); assert.equal(u.calls.length, 1); assert.equal(u.controller.getView().phase, 'received');
    assert.equal(u.controller.getView().canSave, false); assert.equal(u.controller.getView().canExport, false);
  }
  for (const saveEnabled of [undefined, false, 1, 'true']) {
    const u = await saveHarness(); u.controller.setContext(controllerInput({ saveEnabled }));
    await u.save(); assert.equal(u.calls.length, 1);
  }
});

test('save binds the displayed identity and explicit key; sends no body/recipe/authority', async () => {
  let admitted;
  const u = await saveHarness({ configuration: { isSaveAdmitted: (preview, token) => {
    admitted = { preview, token }; return true;
  } } });
  await u.save();
  const [url, opts] = u.calls[1], raw = response();
  assert.equal(url, '/emotion/piece/save'); assert.equal(opts.headers['Idempotency-Key'], 'explicit-save-key');
  assert.deepEqual(JSON.parse(opts.body), { preview_id: raw.preview_id, expected_preview_revision: 1,
    piece_text_hash: raw.piece_text_hash, content_payload_hash: raw.content_payload_hash,
    visual_recipe_hash: raw.visual_recipe_hash, visibility_scope: 'private' });
  assert.ok(Object.isFrozen(admitted.preview.content_payload.body_blocks)); assert.equal(admitted.token, u.token);
  assert.equal(u.controller.getView().phase, 'saved'); assert.equal(u.controller.getView().preview, null);
  assert.deepEqual(clone(u.controller.getView().savedReceipt), saveReceipt());
  assert.equal(u.controller.getView().canRetry, false); assert.equal(u.controller.getView().canSave, false);
  await u.save('another-key'); await u.controller.retry(); await u.controller.start();
  u.controller.close(); await u.controller.start(); assert.equal(u.calls.length, 2);
});

test('save rejects stale display tokens, identities, expired candidates, invalid keys and hash damage', async () => {
  for (const type of ['token', 'id', 'revision', 'hash', 'key', 'expiry', 'body']) {
    let now = NOW;
    const raw = response(); if (type === 'body') raw.piece_text_hash = '0'.repeat(64);
    const u = await saveHarness({ clock: () => now, send: async () => pieceHttp(raw) });
    if (type === 'token') u.token = {};
    if (type === 'id') u.identity.preview_id = saveReceipt().consumption_id;
    if (type === 'revision') u.identity.preview_revision++;
    if (type === 'hash') u.identity.visual_recipe_hash = '0'.repeat(64);
    if (type === 'expiry') now += 1123;
    await u.save(type === 'key' ? ' invalid ' : 'explicit-save-key');
    assert.equal(u.calls.length, 1, type);
  }
});

test('save uncertainty retries only the same body-free save after expiry and close', async () => {
  let now = NOW, count = 0;
  const u = await saveHarness({ clock: () => now, send: async url => {
    if (!url.endsWith('/save')) return pieceHttp(response());
    if (++count === 1) throw new Error('PRIVATE_ACK_LOST');
    return pieceHttp(saveReceipt({ idempotency_replayed: true, visibility_scope: 'public', row_version: 5 }));
  } });
  await u.save(); assert.equal(u.controller.getView().canRetry, true);
  assert.equal(u.controller.getView().retryKind, 'save'); assert.equal(u.controller.getView().preview, null);
  assert.doesNotMatch(JSON.stringify(u.controller.getView()), /PRIVATE_ACK_LOST|静か|explicit-save-key/);
  now += 100000; u.controller.refresh(); u.controller.close();
  await u.save('replacement-key'); await u.controller.start(); assert.equal(u.calls.length, 2);
  await u.controller.retry();
  assert.equal(u.calls.length, 3); assert.equal(u.calls[1][1].body, u.calls[2][1].body);
  assert.equal(u.calls[2][1].headers['Idempotency-Key'], 'explicit-save-key');
  assert.equal(u.controller.getView().phase, 'saved');
  assert.equal(u.controller.getView().savedReceipt.visibility_scope, 'public');
});

test('save reserves one operation and excludes preview mutations, cancellation and duplicate save', async () => {
  const pending = deferredPieceResponse();
  const u = await saveHarness({ send: async url => url.endsWith('/save') ? pending.promise : pieceHttp(response()) });
  const first = u.save(); await pieceTick();
  assert.equal(u.controller.getView().loadingKind, 'save');
  await u.save(); await u.controller.retry(); await u.controller.start();
  await u.controller.cancelPreview(u.identity, u.token);
  await u.controller.changeVisual({}, u.identity, u.token);
  assert.equal(u.calls.length, 2);
  pending.resolve(pieceHttp(saveReceipt())); await first;
  assert.equal(u.controller.getView().phase, 'saved');
});

for (const change of ['close', 'owner', 'source', 'disabled', 'save-disabled', 'dispose']) {
  test(`save rejects delayed results after ${change} even when abort is ignored`, async () => {
    class IgnoredAbort { constructor() { this.signal = {}; } abort() {} }
    const pending = deferredPieceResponse();
    const u = await saveHarness({ abort: IgnoredAbort,
      send: async url => url.endsWith('/save') ? pending.promise : pieceHttp(response()) });
    const first = u.save(); await pieceTick();
    if (change === 'close') u.controller.close();
    if (change === 'owner') u.controller.setContext(controllerInput({ saveEnabled: true, expectedUserId: 'other' }));
    if (change === 'source') u.controller.setContext(controllerInput({ saveEnabled: true, idempotencyKey: 'new-source' }));
    if (change === 'disabled') u.controller.setContext({ enabled: false });
    if (change === 'save-disabled') u.controller.setContext(controllerInput({ saveEnabled: false }));
    if (change === 'dispose') u.controller.dispose();
    pending.resolve(pieceHttp(saveReceipt())); await first;
    assert.notEqual(u.controller.getView().phase, 'saved'); assert.equal(u.controller.getView().preview, null);
    if (change === 'save-disabled') {
      await u.controller.retry(); assert.equal(u.calls.length, 2);
      u.controller.setContext(controllerInput({ saveEnabled: true }));
      assert.equal(u.controller.getView().canRetry, true);
    }
  });
}

test('admission reentrancy and loading subscriber revocation cannot send an obsolete save', async () => {
  for (const point of ['admission', 'loading']) {
    let c;
    const u = await saveHarness({ configuration: { isSaveAdmitted: () => {
      if (point === 'admission') c.close(); return true;
    } } }); c = u.controller;
    c.subscribe(() => { if (point === 'loading' && c.getView().loadingKind === 'save') c.dispose(); });
    await u.save(); assert.equal(u.calls.length, 1);
  }
});

test('known save rejection never retries, regenerates or reports success', async () => {
  for (const [status, code] of [[409, 'PIECE_QUOTA_EXHAUSTED'], [409, 'PIECE_PREVIEW_STALE'],
    [409, 'PIECE_PREVIEW_EXPIRED'], [409, 'PIECE_HASH_MISMATCH'], [409, 'PIECE_CONFLICT'], [401, 'PIECE_AUTH_REQUIRED']]) {
    const u = await saveHarness({ send: async url => url.endsWith('/save')
      ? { status, json: async () => ({ code }) } : pieceHttp(response()) });
    await u.save(); assert.equal(u.controller.getView().phase, 'unavailable');
    assert.equal(u.controller.getView().canRetry, false); assert.equal(u.controller.getView().preview, null);
    await u.controller.retry(); await u.controller.start(); await u.save('new-key'); assert.equal(u.calls.length, 2, code);
  }
});

test('server-disabled save triggers the existing runtime refresh once and stays blocked', async () => {
  let refreshes = 0;
  const u = await saveHarness({ configuration: { isSaveAdmitted: () => true, onFeatureDisabled: () => refreshes++ },
    send: async url => url.endsWith('/save') ? { status: 503, json: async () => ({ code: 'PIECE_FEATURE_DISABLED' }) } : pieceHttp(response()) });
  await u.save(); assert.equal(refreshes, 1); assert.equal(u.controller.getView().canRetry, false);
  u.controller.setContext(controllerInput({ saveEnabled: true }));
  await u.controller.retry(); await u.controller.start(); assert.equal(u.calls.length, 2);
});

test('save flag revocation is visible to synchronous abort listeners before they can retry', async () => {
  const pending = deferredPieceResponse(); let c, abortRetries = 0;
  const u = await saveHarness({ send: async (url, opts) => {
    if (!url.endsWith('/save')) return pieceHttp(response());
    opts.signal.addEventListener('abort', () => { abortRetries++; c.retry(); });
    return pending.promise;
  } }); c = u.controller;
  const first = u.save(); await pieceTick();
  c.setContext(controllerInput({ saveEnabled: false })); await pieceTick();
  assert.equal(abortRetries, 1); assert.equal(u.calls.length, 2);
  assert.equal(c.getView().phase, 'unavailable'); assert.equal(c.getView().canRetry, false);
  pending.resolve(pieceHttp(saveReceipt())); await first;
  assert.notEqual(c.getView().phase, 'saved');
});

test('B10 async controller owner exists at the PCE-8 exact path', () => {
  assert.ok(fs.existsSync(controllerPath), 'B10_ASYNC_CONTROLLER_OWNER_ABSENT');
});

test('controller construction, disabled flags and context updates do not send requests', async () => {
  const { controller: c, calls } = controllerHarness();
  assert.equal(c.getView().phase, 'hidden');
  for (const enabled of [undefined, false, 'true', 1]) {
    c.setContext(controllerInput({ enabled }));
    await c.start(); await c.retry();
    assert.equal(c.getView().phase, 'hidden');
  }
  c.setContext(controllerInput());
  assert.equal(c.getView().phase, 'idle');
  c.refresh();
  assert.equal(calls.length, 0);
});

for (const format of ['short_essay', 'quote', 'declaration']) {
  test(`controller ${format}: real API/model preserves complete received body without render/save promotion`, async () => {
    const raw = response(format);
    const { controller: c, calls, sessions } = controllerHarness({ send: async () => pieceHttp(raw) });
    const phases = [], notificationArguments = [];
    c.subscribe((...args) => { notificationArguments.push(args); phases.push(c.getView().phase); });
    c.setContext(controllerInput());
    const pending = c.start();
    assert.equal(c.getView().phase, 'loading');
    assert.equal(await pending, undefined, 'settlement never returns a possibly obsolete preview');
    const view = c.getView();
    assert.equal(view.phase, 'received'); assert.deepEqual(clone(view.preview), raw);
    assert.equal(view.canSave, false); assert.equal(view.canExport, false); assert.equal(view.hashVerified, false);
    assert.ok(Object.isFrozen(view)); assert.ok(Object.isFrozen(view.preview.content_payload.body_blocks));
    assert.deepEqual(phases, ['idle', 'loading', 'received']);
    assert.ok(notificationArguments.every(args => args.length === 0));
    assert.equal(calls.length, 1); assert.deepEqual(sessions, [OWNER, OWNER]);
    assert.equal(calls[0][1].headers['Idempotency-Key'], options.idempotencyKey);
    assert.deepEqual(JSON.parse(calls[0][1].body), request());
    assert.ok(calls[0][1].signal instanceof AbortSignal);
    await c.start(); await c.retry();
    assert.equal(calls.length, 1, 'received state is not regenerated by the primary action');
  });
}

test('controller duplicate presses and same-context re-render preserve the single in-flight operation', async () => {
  const deferred = deferredPieceResponse();
  const { controller: c, calls } = controllerHarness({ send: () => deferred.promise });
  const value = controllerInput(); c.setContext(value);
  const first = c.start(); await pieceTick();
  const reordered = controllerInput(); reordered.request.source_ref = Object.fromEntries(Object.entries(reordered.request.source_ref).reverse());
  c.setContext(reordered); await c.start(); await c.retry();
  value.request.source_ref.source_input_id = 'external-mutation'; value.idempotencyKey = 'changed-outside';
  assert.equal(calls.length, 1); assert.equal(calls[0][1].signal.aborted, false);
  deferred.resolve(pieceHttp(response())); await first;
  assert.equal(c.getView().phase, 'received');
  assert.deepEqual(JSON.parse(calls[0][1].body), request());
});

for (const change of ['close', 'disable', 'source', 'account', 'format', 'visual', 'dispose']) {
  for (const outcome of ['success', 'failure']) {
    test(`controller ${change} excludes delayed ${outcome}, even when HTTP ignores abort`, async () => {
      const deferred = deferredPieceResponse();
      const { controller: c, calls } = controllerHarness({ send: () => deferred.promise });
      c.setContext(controllerInput());
      const pending = c.start(); await pieceTick();
      const next = controllerInput({ idempotencyKey: 'next-intent-key' });
      if (change === 'close') c.close();
      if (change === 'disable') c.setContext({ enabled: false });
      if (change === 'source') { next.request.source_ref.emlis_observation_result_identity = 'new-observation'; c.setContext(next); }
      if (change === 'account') { next.expectedUserId = 'other-owner'; c.setContext(next); }
      if (change === 'format') { next.request.requested_format = 'quote'; c.setContext(next); }
      if (change === 'visual') { next.request.visual_selection.theme_id = 'quiet_night'; c.setContext(next); }
      if (change === 'dispose') c.dispose();
      assert.equal(calls[0][1].signal.aborted, true);
      const expected = clone(c.getView());
      let lateNotifications = 0; c.subscribe(() => { lateNotifications++; });
      if (outcome === 'success') deferred.resolve(pieceHttp(response()));
      else deferred.reject(new Error('PRIVATE_LATE_FAILURE'));
      assert.equal(await pending, undefined);
      assert.deepEqual(clone(c.getView()), expected); assert.equal(c.getView().preview, null);
      assert.equal(lateNotifications, 0);
      assert.equal(calls.length, 1);
    });
  }
}

test('controller A-to-B-to-A with the same source/key never accepts the first A ticket', async () => {
  const a = deferredPieceResponse(), b = deferredPieceResponse(); let count = 0;
  const { controller: c, calls } = controllerHarness({ send: () => (++count === 1 ? a.promise : b.promise) });
  c.setContext(controllerInput()); const first = c.start(); await pieceTick();
  c.setContext(controllerInput({ expectedUserId: 'owner-b' }));
  c.setContext(controllerInput()); const latest = c.start(); await pieceTick();
  a.resolve(pieceHttp(response())); await first;
  assert.equal(c.getView().phase, 'loading'); assert.equal(calls[1][1].signal.aborted, false);
  b.resolve(pieceHttp(response('quote'))); await latest;
  assert.equal(c.getView().preview.format_type, 'quote');
});

test('controller explicit temporary retry preserves the exact first serialized body and key', async () => {
  let count = 0;
  const { controller: c, calls } = controllerHarness({ send: async () => {
    if (++count === 1) throw new Error('PRIVATE_PROVIDER_DETAIL');
    return pieceHttp(response());
  } });
  c.setContext(controllerInput()); await c.start();
  assert.equal(c.getView().phase, 'unavailable'); assert.equal(c.getView().canRetry, true);
  assert.doesNotMatch(JSON.stringify(c.getView()), /PRIVATE_PROVIDER_DETAIL/);
  c.refresh(); await c.start(); assert.equal(calls.length, 1, 'no primary-action or automatic retry');
  const reversed = controllerInput(); reversed.request.source_ref = Object.fromEntries(Object.entries(reversed.request.source_ref).reverse());
  c.setContext(reversed); await c.retry();
  assert.equal(calls.length, 2); assert.equal(calls[0][1].body, calls[1][1].body);
  assert.equal(calls[0][1].headers['Idempotency-Key'], calls[1][1].headers['Idempotency-Key']);
  assert.notEqual(calls[0][1].signal, calls[1][1].signal);
  assert.equal(c.getView().phase, 'received');
});

for (const [status, code] of [[401, 'PIECE_AUTH_REQUIRED'], [404, 'PIECE_SOURCE_NOT_FOUND'], [409, 'PIECE_PREVIEW_EXPIRED'], [422, 'PIECE_SAFETY_UNAVAILABLE']]) {
  test(`controller ${code} never enables a retry or keeps an old received body`, async () => {
    const { controller: c, calls } = controllerHarness({ send: async () => ({ status, json: async () => ({ code }) }) });
    c.setContext(controllerInput()); await c.start();
    assert.equal(c.getView().phase, 'unavailable'); assert.equal(c.getView().preview, null);
    assert.equal(c.getView().canRetry, false);
    await c.retry(); await c.start(); assert.equal(calls.length, 1);
  });
}

test('controller catches a live session change without publishing the received body', async () => {
  const { controller: c, calls } = controllerHarness({ session: async (_owner, nth) => nth === 1 ? 'synthetic-token' : null });
  c.setContext(controllerInput()); await c.start();
  assert.equal(calls.length, 1); assert.equal(c.getView().phase, 'unavailable');
  assert.equal(c.getView().preview, null); assert.equal(c.getView().canRetry, false);
});

test('controller invalid source context clears a received body, emits only a closed message and makes no request', async () => {
  const { controller: c, calls } = controllerHarness();
  c.setContext(controllerInput()); await c.start();
  const invalid = controllerInput(); invalid.request.raw_memo = 'PRIVATE_RAW_INPUT';
  c.setContext(invalid); await c.start(); await c.retry();
  assert.equal(calls.length, 1); assert.equal(c.getView().preview, null);
  assert.equal(c.getView().phase, 'unavailable');
  assert.doesNotMatch(JSON.stringify(c.getView()), /PRIVATE_RAW_INPUT|raw_memo/);
  c.setContext(null); assert.equal(c.getView().phase, 'hidden');
});

test('controller cannot silently reuse the current owner/key for changed request content', async () => {
  const { controller: c, calls } = controllerHarness();
  c.setContext(controllerInput()); await c.start();
  const next = controllerInput(); next.request.visual_selection.theme_id = 'quiet_night';
  for (let n = 0; n < 2; n++) {
    c.setContext(next); await c.start(); await c.retry();
    assert.equal(c.getView().phase, 'unavailable'); assert.equal(c.getView().preview, null);
  }
  assert.equal(calls.length, 1);
  next.idempotencyKey = 'explicit-new-intent-key'; c.setContext(next); await c.start();
  assert.equal(calls.length, 2); assert.equal(c.getView().phase, 'received');
});

test('controller subscriber failure cannot turn a successful response into a transport error', async () => {
  const { controller: c, calls } = controllerHarness(); let healthy = 0;
  c.subscribe(() => { throw new Error('PRIVATE_VIEW_FAILURE'); });
  const remove = c.subscribe(() => { healthy++; });
  c.setContext(controllerInput()); await c.start();
  assert.equal(c.getView().phase, 'received'); assert.equal(calls.length, 1); assert.equal(healthy, 3);
  remove(); remove(); c.refresh(); assert.equal(healthy, 3);
});

test('controller close from the loading notification stops before starting HTTP or auth', async () => {
  const { controller: c, calls, sessions } = controllerHarness();
  c.subscribe(() => { if (c.getView().phase === 'loading') c.close(); });
  c.setContext(controllerInput()); await c.start();
  assert.equal(c.getView().phase, 'idle'); assert.equal(calls.length, 0); assert.equal(sessions.length, 0);
});

test('controller reentrant completion starts a new intent without an old finally clearing its request', async () => {
  const second = deferredPieceResponse(); let count = 0, later;
  const { controller: c, calls } = controllerHarness({ send: async () => ++count === 1 ? pieceHttp(response()) : second.promise });
  c.subscribe(() => {
    if (c.getView().phase === 'received' && count === 1) {
      c.setContext(controllerInput({ idempotencyKey: 'second-intent' }));
      later = c.start();
    }
  });
  c.setContext(controllerInput()); await c.start(); await pieceTick();
  assert.equal(c.getView().phase, 'loading'); assert.equal(calls.length, 2);
  second.resolve(pieceHttp(response('quote'))); await later;
  assert.equal(c.getView().preview.format_type, 'quote');
});

test('controller view rechecks expiry and invalid clocks without retransmitting or claiming an expiry timer', async () => {
  let now = NOW;
  const { controller: c, calls } = controllerHarness({ clock: () => now });
  c.setContext(controllerInput()); await c.start();
  now = NOW + 1122; assert.equal(c.getView().phase, 'received');
  now++; c.refresh(); assert.equal(c.getView().phase, 'unavailable'); assert.equal(c.getView().preview, null);
  now = NaN; assert.equal(c.getView().preview, null);
  await c.start(); await c.retry(); assert.equal(calls.length, 1);
});

test('controller treats a throwing clock or missing AbortController as unavailable, not a native success', async () => {
  for (const setup of [{ clock: () => { throw new Error('PRIVATE_CLOCK'); } }, { abort: null }]) {
    const { controller: c } = controllerHarness(setup);
    c.setContext(controllerInput()); await c.start();
    assert.equal(c.getView().phase, 'unavailable'); assert.equal(c.getView().preview, null);
    assert.doesNotMatch(JSON.stringify(c.getView()), /PRIVATE_CLOCK|ReferenceError/);
  }
});

test('controller dispose is final and removes subscriptions without payload, API cancel, logging or timers', async () => {
  const { controller: c, calls } = controllerHarness(); let notifications = 0;
  c.subscribe(() => { notifications++; });
  c.setContext(controllerInput()); await c.start();
  c.dispose(); const old = notifications;
  c.setContext(controllerInput()); c.refresh(); c.close(); c.dispose(); await c.start(); await c.retry();
  c.subscribe(() => { throw new Error('must not be called'); });
  assert.equal(notifications, old); assert.equal(c.getView().phase, 'hidden'); assert.equal(calls.length, 1);
  const source = fs.readFileSync(controllerPath, 'utf8');
  assert.doesNotMatch(source, /console\.|AsyncStorage|setTimeout\s*\(|setInterval\s*\(|fetch\s*\(|new\s+Date\s*\(/);
  assert.doesNotMatch(source, /canSave:\s*true|canExport:\s*true|hashVerified:\s*true/);
  assert.ok(Object.isFrozen(c));
});

for (const outcome of ['success', 'failure']) {
  test(`controller identity fence rejects old ${outcome} even when local abort has no effect`, async () => {
    class NonCooperativeAbort {
      constructor() { this.signal = { aborted: false, cancellationRequested: false }; }
      abort() { this.signal.cancellationRequested = true; }
    }
    const firstResponse = deferredPieceResponse(), nextResponse = deferredPieceResponse(); let count = 0;
    const { controller: c, calls } = controllerHarness({
      abort: NonCooperativeAbort,
      send: () => ++count === 1 ? firstResponse.promise : nextResponse.promise,
    });
    c.setContext(controllerInput()); const first = c.start(); await pieceTick();
    const next = controllerInput({ idempotencyKey: 'different-source-key' });
    next.request.source_ref.emlis_observation_result_identity = 'different-source';
    c.setContext(next); const current = c.start(); await pieceTick();
    assert.equal(calls[0][1].signal.cancellationRequested, true);
    assert.equal(calls[0][1].signal.aborted, false, 'neither API abort check can provide this fence');
    if (outcome === 'success') firstResponse.resolve(pieceHttp(response()));
    else firstResponse.reject(new Error('PRIVATE_OLD_FAILURE'));
    await first;
    assert.equal(c.getView().phase, 'loading'); assert.equal(c.getView().preview, null);
    nextResponse.resolve(pieceHttp(response('quote'))); await current;
    assert.equal(c.getView().phase, 'received'); assert.equal(c.getView().preview.format_type, 'quote');
  });
}

