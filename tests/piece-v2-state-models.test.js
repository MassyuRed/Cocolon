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
    aspect_ratio: '4:5', branding: { branding_mode: 'required_small', branding_mark_id: 'cocolon_text_mark', branding_mark_version: 1 },
    layout_policy_version: 'piece.long_text_layout.v1', language: 'ja' };
  const piece_text = blocks.join(format === 'short_essay' ? '\n\n' : '\n');
  return { api_contract_version: 'piece.api.v2', piece_contract_version: 'piece.record.v2',
    preview_id: '30000000-0000-4000-8000-000000000003', preview_revision: 1, row_version: 1,
    expires_at: '2026-10-08T10:00:01.123456+00:00', visibility_scope: 'private', content_status: 'ready',
    format_type: format, eligible_formats: [format], content_payload, content_payload_hash: hash(JSON.stringify(canonical(content_payload))),
    piece_text, piece_text_hash: hash(piece_text), visual_recipe, visual_recipe_hash: hash(JSON.stringify(canonical(visual_recipe))),
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
