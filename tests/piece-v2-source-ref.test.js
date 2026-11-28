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
const ANSWER = '30000000-0000-4000-8000-000000000003';
const OTHER_ANSWER = '30000000-0000-4000-8000-000000000004';
const OBSERVATION = '40000000-0000-4000-8000-000000000005';
const OTHER_OBSERVATION = '40000000-0000-4000-8000-000000000006';
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
const refinedReference = (answer = ANSWER) => ({ ...reference(true),
  emlis_observation_stage: 'refined_observation', supplemental_answer_identity: answer });
const correctedReference = (observation = OBSERVATION) => ({ ...reference(),
  emlis_observation_stage: 'corrected_observation', emlis_observation_result_identity: observation });
const correctedSelection = () => ({ expectedObservationIdentity: OBSERVATION, expectedStage: 'corrected_observation' });
const deepReference = (question = ANSWER) => ({ source_kind: 'deep_insight_record_answer',
  source_input_id: INPUT, deep_insight_question_id: question, source_commitment: 'sha256:' + 'c'.repeat(64) });
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
  const source = ['piecePalette.js', 'pieceApi.js', 'piecePreviewModel.js', 'PieceCreateController.js'].map(name =>
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
  assert.equal(Object.hasOwn(sent, 'timeoutMs'), false);
  assert.equal(Object.keys(result).length, 7);
  value.source_input_id = 'changed-after-response'; assert.equal(result.source_input_id, INPUT);
});

test('DeepInsight answer GET and preview POST use one exact, body-free source identity', async () => {
  const ref = deepReference(), a = load({ send: async (_url, options) => ({
    status: 200, json: async () => options.method === 'GET' ? ref : previewFixture(),
  }) });
  const selected = await a.requestPieceSourceRef(INPUT, opts({ deepInsightQuestionId: ANSWER }));
  assert.deepEqual(clone(selected), ref);
  assert.equal(a.calls[0][0], '/emotion/piece/source-ref/' + INPUT + '?deep_insight_question_id=' + ANSWER);
  assert.equal(a.calls[0][1].body, undefined);
  assert.equal(a.calls[0][1].headers['Cache-Control'], 'no-store');
  const request = { source_ref: selected, requested_format: null,
    visual_selection: { theme_id: null, aspect_ratio: null, branding_mode: null } };
  await a.requestPiecePreview(request, opts({ idempotencyKey: 'one-explicit-preview' }));
  assert.deepEqual(JSON.parse(a.calls[1][1].body).source_ref, ref);
});

test('DeepInsight source selection cannot fall back or accept mismatched/private wire fields', async () => {
  const optsDeep = opts({ deepInsightQuestionId: ANSWER });
  for (const invalid of [reference(), deepReference(OTHER_ANSWER), { ...deepReference(), source_input_id: OWNER },
    { ...deepReference(), source_commitment: null }, { ...deepReference(), answer_text: 'PRIVATE' }]) {
    const a = load({ send: async () => ({ status: 200, json: async () => invalid }) });
    await assert.rejects(a.requestPieceSourceRef(INPUT, optsDeep), closed('PIECE_TEMPORARILY_UNAVAILABLE'));
    assert.equal(a.calls.length, 1);
  }
  const a = load();
  await assert.rejects(a.requestPieceSourceRef(INPUT, { ...optsDeep, supplementalAnswerIdentity: ANSWER }), closed('PIECE_REQUEST_INVALID'));
  await assert.rejects(a.requestPieceSourceRef(INPUT, { ...optsDeep, ...correctedSelection() }), closed('PIECE_REQUEST_INVALID'));
  assert.equal(a.calls.length, 0);
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
  assert.equal(a.calls[1][1].timeoutMs, 250000);
  assert.deepEqual(JSON.parse(a.calls[1][1].body), clone(request));
  const display = a.readPiecePreviewDisplay(c.getView(), NOW);
  assert.equal(display.hashVerified, true); assert.equal(display.preview.piece_text, expected.piece_text);
  assert.deepEqual(clone(display.preview.content_payload), expected.content_payload);
  assert.equal(display.canSave, false); assert.equal(display.canExport, false);
  c.dispose();
});

test('an exact chosen answer is carried from GET to the existing preview POST', async () => {
  const expected = previewFixture();
  const a = load({ send: async (_url, sent) => ({ status: 200,
    json: async () => sent.method === 'GET' ? refinedReference() : expected }) });
  const source_ref = await a.requestPieceSourceRef(INPUT, opts({ supplementalAnswerIdentity: ANSWER }));
  assert.equal(a.calls[0][0], `/emotion/piece/source-ref/${INPUT}?supplemental_answer_identity=${ANSWER}`);
  assert.equal(a.calls[0][1].body, undefined);
  assert.deepEqual(clone(source_ref), refinedReference());
  assert.equal(Object.keys(source_ref).length, 7);
  const request = { source_ref, requested_format: null,
    visual_selection: { theme_id: null, aspect_ratio: null, branding_mode: null } };
  await a.requestPiecePreview(request, opts({ idempotencyKey: 'explicit-refined-preview' }));
  assert.equal(a.calls.length, 2);
  assert.deepEqual(JSON.parse(a.calls[1][1].body), clone(request));
  assert.equal(a.calls[1][0], '/emotion/piece/preview');
  assert.equal(a.calls[1][1].headers['Idempotency-Key'], 'explicit-refined-preview');
});

for (const selected of [null, undefined, '', 'latest', 1, {},
  '00000000-0000-0000-0000-000000000000', ANSWER.replaceAll('-', '')]) {
  test(`an invalid explicit answer ${String(selected)} cannot become an original read`, async () => {
    const a = load();
    await assert.rejects(a.requestPieceSourceRef(INPUT, opts({ supplementalAnswerIdentity: selected })), closed('PIECE_REQUEST_INVALID'));
    assert.equal(a.calls.length, 0); assert.equal(a.sessions.length, 0);
  });
}
test('an uppercase answer UUID is rejected before IO', async () => {
  const a = load();
  await assert.rejects(a.requestPieceSourceRef(INPUT, opts({ supplementalAnswerIdentity: 'ABCDEFAB-0000-4000-8000-000000000003' })), closed('PIECE_REQUEST_INVALID'));
  assert.equal(a.calls.length, 0);
});

for (const returned of [reference(), reference(true), refinedReference(OTHER_ANSWER),
  { ...refinedReference(), question_need_decision_identity: null },
  { ...refinedReference(), raw_answer: 'PRIVATE' }]) {
  test('a selected read never adopts an original, different answer or partial source', async () => {
    const a = load({ send: async () => ({ status: 200, json: async () => returned }) });
    await assert.rejects(a.requestPieceSourceRef(INPUT, opts({ supplementalAnswerIdentity: ANSWER })), closed('PIECE_TEMPORARILY_UNAVAILABLE'));
    assert.equal(a.calls.length, 1);
    assert.equal(a.calls[0][1].method, 'GET');
    assert.match(a.calls[0][0], /supplemental_answer_identity=/);
  });
}

test('queryless original request cannot adopt an unsolicited refined response', async () => {
  const a = load({ send: async () => ({ status: 200, json: async () => refinedReference() }) });
  await assert.rejects(a.requestPieceSourceRef(INPUT, opts()), closed('PIECE_TEMPORARILY_UNAVAILABLE'));
  assert.equal(a.calls[0][0], '/emotion/piece/source-ref/' + INPUT);
});

test('the chosen answer is captured before Auth and remains unchanged by caller mutation', async () => {
  const options = opts({ supplementalAnswerIdentity: ANSWER });
  const a = load({ session: async (_owner, n) => {
    if (n === 1) options.supplementalAnswerIdentity = OTHER_ANSWER;
    return 'synthetic-session';
  }, send: async () => ({ status: 200, json: async () => refinedReference() }) });
  const result = await a.requestPieceSourceRef(INPUT, options);
  assert.equal(result.supplemental_answer_identity, ANSWER);
  assert.ok(a.calls[0][0].endsWith('supplemental_answer_identity=' + ANSWER));
});

test('a rejected chosen answer has no queryless or latest-answer fallback', async () => {
  const a = load({ send: async () => ({ status: 422, json: async () => ({ code: 'PIECE_SOURCE_NOT_ELIGIBLE' }) }) });
  for (let n = 0; n < 2; n++) {
    await assert.rejects(a.requestPieceSourceRef(INPUT, opts({ supplementalAnswerIdentity: ANSWER })), closed('PIECE_SOURCE_NOT_ELIGIBLE'));
  }
  await tick(); assert.equal(a.calls.length, 2);
  assert.ok(a.calls.every(([url, sent]) => url.endsWith('supplemental_answer_identity=' + ANSWER) && sent.method === 'GET'));
});

for (const value of [
  { ...refinedReference(), supplemental_answer_identity: null },
  { ...refinedReference(), question_need_decision_identity: null },
  { ...reference(), supplemental_answer_identity: ANSWER },
  { ...reference(true), supplemental_answer_identity: ANSWER },
  { ...reference(), question_need_decision_identity: 'incoherent' },
]) test('preview request requires a coherent original or selected refined source', async () => {
  const a = load();
  await assert.rejects(a.requestPiecePreview({ source_ref: value, requested_format: null,
    visual_selection: { theme_id: null, aspect_ratio: null, branding_mode: null } },
  opts({ idempotencyKey: 'explicit-refined-preview' })), closed('PIECE_SOURCE_NOT_ELIGIBLE'));
  assert.equal(a.calls.length, 0); assert.equal(a.sessions.length, 0);
});

test('the chosen corrected observation keeps a seven-field GET and explicit preview request', async () => {
  const raw = correctedReference(), expected = previewFixture();
  const a = load({ send: async (_url, sent) => ({ status: 200,
    json: async () => sent.method === 'GET' ? raw : expected }) });
  const source_ref = await a.requestPieceSourceRef(INPUT, opts(correctedSelection()));
  assert.equal(a.calls.length, 1, 'the source read does not start a preview');
  const [url, sent] = a.calls[0];
  assert.equal(url, '/emotion/piece/source-ref/' + INPUT);
  assert.equal(sent.method, 'GET'); assert.equal(sent.body, undefined);
  assert.equal(sent.headers['Idempotency-Key'], undefined);
  assert.equal(sent.headers['Cache-Control'], 'no-store');
  assert.deepEqual(clone(source_ref), correctedReference());
  assert.equal(Object.keys(source_ref).length, 7); assert.ok(Object.isFrozen(source_ref));
  raw.emlis_observation_result_identity = OTHER_OBSERVATION;
  assert.equal(source_ref.emlis_observation_result_identity, OBSERVATION);
  const request = { source_ref, requested_format: null,
    visual_selection: { theme_id: null, aspect_ratio: null, branding_mode: null } };
  await a.requestPiecePreview(request, opts({ idempotencyKey: 'explicit-corrected-preview' }));
  assert.equal(a.calls.length, 2);
  assert.equal(a.calls[1][0], '/emotion/piece/preview');
  assert.deepEqual(JSON.parse(a.calls[1][1].body), clone(request));
  assert.deepEqual(Object.keys(JSON.parse(a.calls[1][1].body)).sort(),
    ['requested_format', 'source_ref', 'visual_selection']);
  assert.deepEqual(a.sessions, [OWNER, OWNER, OWNER, OWNER]);
});

for (const selection of [
  { expectedObservationIdentity: OBSERVATION },
  { expectedStage: 'corrected_observation' },
  { expectedObservationIdentity: null, expectedStage: 'corrected_observation' },
  { expectedObservationIdentity: undefined, expectedStage: 'corrected_observation' },
  { expectedObservationIdentity: '', expectedStage: 'corrected_observation' },
  { expectedObservationIdentity: 'latest', expectedStage: 'corrected_observation' },
  { expectedObservationIdentity: '00000000-0000-0000-0000-000000000000', expectedStage: 'corrected_observation' },
  { expectedObservationIdentity: 'ABCDEFAB-0000-4000-8000-000000000005', expectedStage: 'corrected_observation' },
  { expectedObservationIdentity: OBSERVATION.replaceAll('-', ''), expectedStage: 'corrected_observation' },
  { expectedObservationIdentity: OBSERVATION, expectedStage: undefined },
  { expectedObservationIdentity: OBSERVATION, expectedStage: null },
  { expectedObservationIdentity: OBSERVATION, expectedStage: 'normal_observation' },
  { expectedObservationIdentity: OBSERVATION, expectedStage: 'pre_question_observation' },
  { expectedObservationIdentity: OBSERVATION, expectedStage: 'refined_observation' },
]) test('an incomplete, incoherent or mixed corrected selection is rejected before IO', async () => {
  const a = load();
  await assert.rejects(a.requestPieceSourceRef(INPUT, opts(selection)), closed('PIECE_REQUEST_INVALID'));
  assert.equal(a.calls.length, 0); assert.equal(a.sessions.length, 0);
});

for (const returned of [reference(), reference(true), refinedReference(), correctedReference(OTHER_OBSERVATION),
  { ...correctedReference(), question_need_decision_identity: 'unexpected-question' },
  { ...correctedReference(), supplemental_answer_identity: ANSWER },
  { ...correctedReference(), emlis_observation_result_identity: 'not-an-event-uuid' },
  { ...correctedReference(), raw_observation: 'PRIVATE' }]) {
  test('a corrected selection never adopts a changed observation, different stage or expanded source', async () => {
    const a = load({ send: async () => ({ status: 200, json: async () => returned }) });
    await assert.rejects(a.requestPieceSourceRef(INPUT, opts(correctedSelection())), closed('PIECE_TEMPORARILY_UNAVAILABLE'));
    assert.equal(a.calls.length, 1);
    assert.equal(a.calls[0][0], '/emotion/piece/source-ref/' + INPUT);
    assert.equal(a.calls[0][1].method, 'GET');
    await tick(); assert.equal(a.calls.length, 1);
  });
}

for (const selection of [{}, { supplementalAnswerIdentity: ANSWER }]) {
  test('a fresh original or selected refined read cannot acquire an unsolicited corrected source', async () => {
    const a = load({ send: async () => ({ status: 200, json: async () => correctedReference() }) });
    await assert.rejects(a.requestPieceSourceRef(INPUT, opts(selection)), closed('PIECE_TEMPORARILY_UNAVAILABLE'));
    assert.equal(a.calls.length, 1);
    assert.equal(a.calls[0][1].method, 'GET');
  });
}

test('the selected observation and stage are captured before Auth can mutate caller options', async () => {
  const options = opts(correctedSelection());
  const a = load({ session: async (_owner, n) => {
    if (n === 1) {
      options.expectedObservationIdentity = OTHER_OBSERVATION;
      options.expectedStage = 'normal_observation';
      options.supplementalAnswerIdentity = ANSWER;
    }
    return 'synthetic-session';
  }, send: async () => ({ status: 200, json: async () => correctedReference() }) });
  const result = await a.requestPieceSourceRef(INPUT, options);
  assert.equal(result.emlis_observation_result_identity, OBSERVATION);
  assert.equal(result.emlis_observation_stage, 'corrected_observation');
  assert.equal(a.calls[0][0], '/emotion/piece/source-ref/' + INPUT);
});

test('caller mutation cannot authorize a newer corrected observation returned after Auth', async () => {
  const options = opts(correctedSelection());
  const a = load({ session: async (_owner, n) => {
    if (n === 1) options.expectedObservationIdentity = OTHER_OBSERVATION;
    return 'synthetic-session';
  }, send: async () => ({ status: 200, json: async () => correctedReference(OTHER_OBSERVATION) }) });
  await assert.rejects(a.requestPieceSourceRef(INPUT, options), closed('PIECE_TEMPORARILY_UNAVAILABLE'));
  assert.equal(a.calls.length, 1);
});

test('a rejected corrected selection has no latest-source or unbound preview fallback', async () => {
  const a = load({ send: async () => ({ status: 422, json: async () => ({ code: 'PIECE_SOURCE_NOT_ELIGIBLE' }) }) });
  await assert.rejects(a.requestPieceSourceRef(INPUT, opts(correctedSelection())), closed('PIECE_SOURCE_NOT_ELIGIBLE'));
  await tick(); assert.equal(a.calls.length, 1);
  assert.equal(a.calls[0][0], '/emotion/piece/source-ref/' + INPUT);
  assert.equal(a.calls[0][1].method, 'GET');
});

for (const value of [
  { ...correctedReference(), question_need_decision_identity: 'unexpected-question' },
  { ...correctedReference(), supplemental_answer_identity: ANSWER },
  { ...correctedReference(), emlis_observation_result_identity: 'not-an-event-uuid' },
  { ...correctedReference(), emlis_observation_result_identity: '00000000-0000-0000-0000-000000000000' },
]) test('preview requires the corrected source UUID and null question/answer pair before IO', async () => {
  const a = load();
  await assert.rejects(a.requestPiecePreview({ source_ref: value, requested_format: null,
    visual_selection: { theme_id: null, aspect_ratio: null, branding_mode: null } },
  opts({ idempotencyKey: 'invalid-corrected-preview' })), closed('PIECE_SOURCE_NOT_ELIGIBLE'));
  assert.equal(a.calls.length, 0); assert.equal(a.sessions.length, 0);
});

const answeredCorrectedReference = (answer = ANSWER, observation = OBSERVATION) => ({
  ...correctedReference(observation), question_need_decision_identity: 'real-question-event',
  supplemental_answer_identity: answer,
});
const answeredCorrectedSelection = () => ({ ...correctedSelection(), supplementalAnswerIdentity: ANSWER });
test('a corrected answer co-selection sends only its answer query and retains both explicit identities', async () => {
  const a = load({ send: async () => ({ status: 200, json: async () => answeredCorrectedReference() }) });
  const ref = await a.requestPieceSourceRef(INPUT, opts(answeredCorrectedSelection()));
  assert.equal(a.calls[0][0], `/emotion/piece/source-ref/${INPUT}?supplemental_answer_identity=${ANSWER}`);
  assert.equal(a.calls[0][1].body, undefined);
  assert.deepEqual(clone(ref), answeredCorrectedReference());
  assert.equal(Object.keys(ref).length, 7);
  const preview = previewFixture(), b = load({ send: async () => ({ status: 200, json: async () => preview }) });
  await b.requestPiecePreview({ source_ref: ref, requested_format: null,
    visual_selection: { theme_id: null, aspect_ratio: null, branding_mode: null } }, opts({ idempotencyKey: 'answer-corrected-preview' }));
  assert.deepEqual(JSON.parse(b.calls[0][1].body).source_ref, answeredCorrectedReference());
});
for (const returned of [answeredCorrectedReference(OTHER_ANSWER), answeredCorrectedReference(ANSWER, OTHER_OBSERVATION),
  refinedReference(), correctedReference(), { ...answeredCorrectedReference(), question_need_decision_identity: null },
  { ...answeredCorrectedReference(), private_explanation: 'PRIVATE' }]) {
  test('co-selection never accepts a different answer/OBS, missing pair or unsolicited private source', async () => {
    const a = load({ send: async () => ({ status: 200, json: async () => returned }) });
    await assert.rejects(a.requestPieceSourceRef(INPUT, opts(answeredCorrectedSelection())), closed('PIECE_TEMPORARILY_UNAVAILABLE'));
    assert.equal(a.calls.length, 1);
  });
}
test('Auth-time caller mutation cannot switch either captured co-selected identity', async () => {
  const options = opts(answeredCorrectedSelection());
  const a = load({ session: async (_owner, n) => {
    if (n === 1) { options.supplementalAnswerIdentity = OTHER_ANSWER; options.expectedObservationIdentity = OTHER_OBSERVATION; }
    return 'synthetic';
  }, send: async () => ({ status: 200, json: async () => answeredCorrectedReference() }) });
  const ref = await a.requestPieceSourceRef(INPUT, options);
  assert.equal(ref.supplemental_answer_identity, ANSWER); assert.equal(ref.emlis_observation_result_identity, OBSERVATION);
  assert.match(a.calls[0][0], new RegExp(ANSWER + '$'));
});
