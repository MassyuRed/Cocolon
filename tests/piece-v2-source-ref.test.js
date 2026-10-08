'use strict';
// Unregistered transport. Actual Piece JS owners; only HTTP/session IO
// is synthetic. This is not Hermes, React reconciliation, or device evidence.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const OWNER = '10000000-0000-4000-8000-000000000001';
const INPUT = '20000000-0000-4000-8000-000000000002';
const NOW = Date.parse('2026-10-08T10:00:00Z');
const clone = value => JSON.parse(JSON.stringify(value));
const tick = () => new Promise(resolve => setImmediate(resolve));
function reference(pre = false) {
  return { source_input_id: INPUT, source_input_version: 'emlis.current_input_bundle.v1',
    source_input_bundle_commitment: 'sha256:' + 'a'.repeat(64),
    emlis_observation_stage: pre ? 'pre_question_observation' : 'normal_observation',
    emlis_observation_result_identity: 'synthetic-observation',
    question_need_decision_identity: pre ? 'synthetic-question' : null,
    supplemental_answer_identity: null };
}
function load({ send, session } = {}) {
  const calls = [], sessions = [];
  const context = vm.createContext({ AbortController, Date,
    apiFetch: async (...args) => {
      calls.push(args);
      return send ? send(...args) : { status: 200, json: async () => reference() };
    },
    getAccessToken: async owner => {
      sessions.push(owner);
      return session ? session(owner, sessions.length) : 'synthetic-session';
    },
  });
  const source = ['pieceApi.js', 'piecePreviewModel.js', 'PieceCreateController.js'].map(name =>
    fs.readFileSync(path.join(__dirname, '../features/piece', name), 'utf8')
      .replace(/^import .*;$/gm, '').replace(/^export /gm, '')).join('\n');
  vm.runInContext(source + '\nglobalThis.api={requestPieceSourceRef,requestPiecePreview,createPieceCreateController,readPiecePreviewDisplay};', context);
  return { ...context.api, calls, sessions };
}
function previewFixture() {
  const source = fs.readFileSync(path.join(__dirname, 'piece-v2-preview-display.test.js'), 'utf8')
    .split('function deferredPieceResponse()')[0];
  const context = vm.createContext({ require, __dirname });
  vm.runInContext(source + '\nglobalThis.fixture=response();', context);
  return clone(context.fixture);
}
const opts = extras => ({ expectedUserId: OWNER, ...extras });
const closed = code => error => {
  assert.equal(error.code, code);
  assert.equal(error.name, 'PieceApiError');
  assert.equal(Object.hasOwn(error, 'cause'), false);
  assert.equal(Object.hasOwn(error, 'body'), false);
  assert.doesNotMatch(error.message, /PRIVATE/);
  return true;
};

for (const pre of [false, true]) test(`explicit source GET preserves exact seven fields (${pre})`, async () => {
  const value = reference(pre), a = load({ send: async () => ({ status: 200, json: async () => value }) });
  assert.equal(a.calls.length, 0);
  const result = await a.requestPieceSourceRef(INPUT, opts());
  assert.deepEqual(clone(result), value); assert.ok(Object.isFrozen(result));
  assert.equal(a.calls.length, 1); assert.deepEqual(a.sessions, [OWNER, OWNER]);
  const [url, sent] = a.calls[0];
  assert.equal(url, '/emotion/piece/source-ref/' + INPUT);
  assert.equal(sent.method, 'GET'); assert.equal(sent.auth, true);
  assert.equal(sent.expectedUserId, OWNER); assert.equal(sent.body, undefined);
  assert.equal(sent.headers['Idempotency-Key'], undefined);
  assert.equal(sent.headers['Cache-Control'], 'no-store');
  assert.equal(Object.keys(result).length, 7);
  value.source_input_id = 'changed-after-response'; assert.equal(result.source_input_id, INPUT);
});

for (const id of [null, undefined, '', 'not-uuid', 12,
  '00000000-0000-0000-0000-000000000000', '20000000000040008000000000000002']) {
  test(`invalid source ID ${String(id)} causes no HTTP or auth request`, async () => {
    const a = load();
    await assert.rejects(a.requestPieceSourceRef(id, opts()), closed('PIECE_REQUEST_INVALID'));
    assert.equal(a.calls.length, 0); assert.equal(a.sessions.length, 0);
  });
}

for (const when of ['before', 'after']) test(`account changes ${when} GET cannot expose references`, async () => {
  const a = load({ session: async (_owner, n) => n === (when === 'before' ? 1 : 2) ? null : 'synthetic' });
  await assert.rejects(a.requestPieceSourceRef(INPUT, opts()), closed('PIECE_AUTH_REQUIRED'));
  assert.equal(a.calls.length, when === 'before' ? 0 : 1);
});

for (const [field, value] of [
  ['source_input_id', OWNER], ['raw_memo', 'PRIVATE'], ['owner_user_id', OWNER],
  ['source_input_version', 'unknown'], ['source_input_bundle_commitment', 'bad'],
  ['emlis_observation_stage', 'refined_observation'], ['supplemental_answer_identity', 'answer'],
  ['question_need_decision_identity', 'extra-question'], ['emlis_observation_result_identity', ''],
]) test(`malformed server source_ref ${field} becomes unavailable, never a partial context`, async () => {
  const raw = reference(); raw[field] = value;
  const a = load({ send: async () => ({ status: 200, json: async () => raw }) });
  await assert.rejects(a.requestPieceSourceRef(INPUT, opts()), closed('PIECE_TEMPORARILY_UNAVAILABLE'));
  assert.equal(a.calls.length, 1);
});

for (const [code, status] of Object.entries({ PIECE_REQUEST_INVALID: 400, PIECE_AUTH_REQUIRED: 401,
  PIECE_SOURCE_NOT_FOUND: 404, PIECE_SOURCE_NOT_ELIGIBLE: 422, PIECE_CONFLICT: 409,
  PIECE_TEMPORARILY_UNAVAILABLE: 503 })) test(`source read accepts closed ${status}/${code}`, async () => {
  const a = load({ send: async () => ({ status, json: async () => ({ code }) }) });
  await assert.rejects(a.requestPieceSourceRef(INPUT, opts()), closed(code));
  assert.equal(a.calls.length, 1);
});

for (const [status, raw] of [[422, { code: 'PIECE_SAFETY_UNAVAILABLE' }],
  [503, { code: 'PIECE_SOURCE_NOT_FOUND' }], [401, { code: 'PIECE_AUTH_REQUIRED', detail: 'PRIVATE' }],
  [206, reference()], [200, { source_ref: reference() }]]) {
  test('unknown, mismatched or partial HTTP outcomes remain unavailable', async () => {
    const a = load({ send: async () => ({ status, json: async () => raw }) });
    await assert.rejects(a.requestPieceSourceRef(INPUT, opts()), closed('PIECE_TEMPORARILY_UNAVAILABLE'));
  });
}

for (const at of ['before', 'transport', 'session-recheck']) test(`abort at ${at} suppresses the result`, async () => {
  const controller = new AbortController();
  if (at === 'before') controller.abort();
  const a = load({
    send: async () => { if (at === 'transport') controller.abort(); return { status: 200, json: async () => reference() }; },
    session: async (_owner, n) => { if (at === 'session-recheck' && n === 2) controller.abort(); return 'synthetic'; },
  });
  await assert.rejects(a.requestPieceSourceRef(INPUT, opts({ signal: controller.signal })), e => e.name === 'AbortError');
  assert.equal(a.calls.length, at === 'before' ? 0 : 1);
});

test('transport failure is not automatically retried or replaced with a preview POST', async () => {
  const a = load({ send: async () => { throw new Error('PRIVATE'); } });
  await assert.rejects(a.requestPieceSourceRef(INPUT, opts()), closed('PIECE_TEMPORARILY_UNAVAILABLE'));
  await tick(); assert.equal(a.calls.length, 1);
  await assert.rejects(a.requestPieceSourceRef(INPUT, opts()), closed('PIECE_TEMPORARILY_UNAVAILABLE'));
  assert.equal(a.calls.length, 2);
  assert.ok(a.calls.every(([, sent]) => sent.method === 'GET'));
});

test('returned references feed the unchanged controller/preview/display path on separate explicit actions', async () => {
  const expected = previewFixture();
  const a = load({ send: async (_url, sent) => ({ status: 200,
    json: async () => sent.method === 'GET' ? reference(true) : expected }) });
  const ref = await a.requestPieceSourceRef(INPUT, opts());
  const c = a.createPieceCreateController({ now: () => NOW });
  const request = { source_ref: ref, requested_format: null,
    visual_selection: { theme_id: null, aspect_ratio: null, branding_mode: null } };
  c.setContext({ enabled: true, expectedUserId: OWNER, idempotencyKey: 'synthetic-explicit-preview-key', request });
  assert.equal(a.calls.length, 1, 'GET and context do not automatically issue a preview');
  await c.start();
  assert.equal(a.calls.length, 2);
  assert.equal(a.calls[1][0], '/emotion/piece/preview');
  assert.deepEqual(JSON.parse(a.calls[1][1].body), clone(request));
  const display = a.readPiecePreviewDisplay(c.getView(), NOW);
  assert.equal(display.hashVerified, true); assert.equal(display.preview.piece_text, expected.piece_text);
  assert.deepEqual(clone(display.preview.content_payload), expected.content_payload);
  assert.equal(display.canSave, false); assert.equal(display.canExport, false);
  c.dispose();
});
