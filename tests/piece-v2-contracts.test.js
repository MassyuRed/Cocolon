'use strict';

// B10 API transport tests. No RN renderer, live Auth, network or database.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const sourcePath = path.join(__dirname, '../features/piece/pieceApi.js');
const OWNER = '10000000-0000-4000-8000-000000000001';
const KEY = 'synthetic-piece-preview-key';
const copy = value => JSON.parse(JSON.stringify(value));
const canonical = value => Array.isArray(value) ? value.map(canonical) :
  value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort()
    .map(key => [key, canonical(value[key])])) : value;
const digest = value => crypto.createHash('sha256').update(value, 'utf8').digest('hex');

function request() {
  return {
    source_ref: {
      source_input_id: '20000000-0000-4000-8000-000000000002',
      source_input_version: 'emlis.current_input_bundle.v1',
      source_input_bundle_commitment: 'sha256:' + 'a'.repeat(64),
      emlis_observation_stage: 'normal_observation',
      emlis_observation_result_identity: 'synthetic-observation',
      question_need_decision_identity: null,
      supplemental_answer_identity: null,
    },
    requested_format: null,
    visual_selection: { theme_id: null, aspect_ratio: null, branding_mode: null },
  };
}

function preview(format = 'short_essay') {
  const blocks = format === 'quote' ? ['私は、静かに考える時間を大切にしています。'] :
    ['私は、静かに考える時間を大切にしています。', '  ただし、一人で決めたいわけではありません。  '];
  const payload = {
    schema_version: 'piece.content_payload.v1',
    meaning_contract_version: 'piece.content_meaning.v1',
    safety_contract_version: 'piece.public_safety_transformation.v1',
    language: 'ja', format_type: format, title: null, body_blocks: blocks,
  };
  const recipe = {
    visual_recipe_version: 'piece.visual_recipe.v1',
    visual_catalog_version: 'piece.visual_catalog.v1',
    format_type: format,
    template: { template_id: { short_essay: 'essay_frame', quote: 'focus_frame', declaration: 'stance_frame' }[format], template_version: 1 },
    theme: { theme_id: 'soft_paper', theme_version: 1 },
    font_style: { font_style_id: 'system_readable', font_style_version: 1 },
    aspect_ratio: '4:5',
    branding: { branding_mode: 'required_small', branding_mark_id: 'cocolon_text_mark', branding_mark_version: 1 },
    layout_policy_version: 'piece.long_text_layout.v1', language: 'ja',
  };
  const text = blocks.join(format === 'short_essay' ? '\n\n' : '\n');
  return {
    api_contract_version: 'piece.api.v2', piece_contract_version: 'piece.record.v2',
    preview_id: '30000000-0000-4000-8000-000000000003',
    preview_revision: 1, row_version: 1, expires_at: '2026-10-08T12:00:00.123456+00:00',
    visibility_scope: 'private', content_status: 'ready', format_type: format,
    eligible_formats: [format], content_payload: payload,
    content_payload_hash: digest(JSON.stringify(canonical(payload))),
    piece_text: text, piece_text_hash: digest(text), visual_recipe: recipe,
    visual_recipe_hash: digest(JSON.stringify(canonical(recipe))),
    renderer_version: 'synthetic-renderer.v1',
  };
}

function load({ send, session } = {}) {
  const source = fs.readFileSync(sourcePath, 'utf8');
  const dependency = 'import { apiFetch, getAccessToken } from "../../lib/apiClient";';
  assert.equal(source.split(dependency).length, 2, 'one established shared transport import');
  const calls = [], sessions = [];
  const context = vm.createContext({
    apiFetch: async (...args) => {
      calls.push(args);
      return send ? send(...args) : { status: 200, json: async () => preview() };
    },
    getAccessToken: async owner => {
      sessions.push(owner);
      return session ? session(owner, sessions.length) : 'synthetic-test-token';
    },
  });
  // Evaluate the actual application module. Only ESM linkage is replaced;
  // the request/response/error/session implementation is not reimplemented.
  vm.runInContext(source.replace(dependency, '').replace(/^export /gm, '') +
    '\n globalThis.testApi = { requestPiecePreview, PieceApiError };', context, { filename: sourcePath });
  return { ...context.testApi, calls, sessions };
}
const options = extras => ({ expectedUserId: OWNER, idempotencyKey: KEY, ...extras });
const isCode = code => error => {
  assert.equal(error.code, code);
  assert.equal(error.name, 'PieceApiError');
  assert.equal(Object.hasOwn(error, 'body'), false);
  assert.equal(Object.hasOwn(error, 'cause'), false);
  return true;
};

test('B10 API owner exists at its PCE-8 exact path', () => {
  assert.ok(fs.existsSync(sourcePath), 'B10_PIECE_API_OWNER_ABSENT');
});

test('actual module reuses shared authenticated transport, without legacy/runtime wiring', () => {
  const source = fs.readFileSync(sourcePath, 'utf8');
  assert.match(source, /import \{ apiFetch, getAccessToken \} from "\.\.\/\.\.\/lib\/apiClient"/);
  assert.doesNotMatch(source, /emotionPieceApi|PIECE_WIRE|captureApiError|AsyncStorage|console\.|setTimeout|fetch\(/);
  assert.equal((source.match(/await apiFetch\(/g) || []).length, 1);
});

for (const format of ['short_essay', 'quote', 'declaration']) {
  test(`preserves full ${format} payload, whitespace, recipe and all three hashes`, async () => {
    const expected = preview(format);
    const api = load({ send: async () => ({ status: 200, json: async () => expected }) });
    const result = await api.requestPiecePreview(request(), options());
    assert.deepEqual(copy(result), expected);
    assert.notEqual(result, expected);
    assert.ok(Object.isFrozen(result));
    assert.ok(Object.isFrozen(result.content_payload.body_blocks));
    assert.ok(Object.isFrozen(result.visual_recipe.theme));
    assert.equal(result.piece_text_hash, digest(result.piece_text));
    assert.equal(api.calls.length, 1);
    const [url, sent] = api.calls[0];
    assert.equal(url, '/emotion/piece/preview');
    assert.equal(sent.method, 'POST');
    assert.equal(sent.expectedUserId, OWNER);
    assert.equal(sent.auth, true);
    assert.equal(sent.headers['Idempotency-Key'], KEY);
    assert.deepEqual(JSON.parse(sent.body), request());
    assert.equal(JSON.parse(sent.body).owner_user_id, undefined);
    assert.deepEqual(api.sessions, [OWNER, OWNER]);
    expected.content_payload.body_blocks[0] = 'changed outside the returned snapshot';
    assert.notEqual(result.content_payload.body_blocks[0], expected.content_payload.body_blocks[0]);
  });
}

test('request and key are captured before first await, not mutated by the caller', async () => {
  let release;
  const api = load({ session: async (_owner, nth) => nth === 1 ?
    new Promise(resolve => { release = () => resolve('synthetic-token'); }) : 'synthetic-token' });
  const value = request(), opts = options(), original = copy(value);
  const operation = api.requestPiecePreview(value, opts);
  value.source_ref.source_input_id = 'different';
  value.visual_selection.theme_id = 'quiet_night';
  opts.idempotencyKey = 'different'; opts.expectedUserId = 'different';
  release();
  await operation;
  assert.deepEqual(JSON.parse(api.calls[0][1].body), original);
  assert.equal(api.calls[0][1].headers['Idempotency-Key'], KEY);
  assert.equal(api.calls[0][1].expectedUserId, OWNER);
});

test('response loss has one call; explicit retry preserves exactly the same body and key', async () => {
  let count = 0;
  const api = load({ send: async () => {
    if (++count === 1) throw new Error('synthetic private provider details');
    return { status: 200, json: async () => preview() };
  } });
  await assert.rejects(api.requestPiecePreview(request(), options()), isCode('PIECE_TEMPORARILY_UNAVAILABLE'));
  assert.equal(api.calls.length, 1);
  await api.requestPiecePreview(request(), options());
  assert.equal(api.calls.length, 2);
  assert.equal(api.calls[0][1].body, api.calls[1][1].body);
  assert.equal(api.calls[0][1].headers['Idempotency-Key'], api.calls[1][1].headers['Idempotency-Key']);
});

for (const where of ['before', 'after']) {
  test(`account change ${where} transport never returns another owner's candidate`, async () => {
    const api = load({ session: async (_owner, nth) => {
      if ((where === 'before' && nth === 1) || (where === 'after' && nth === 2)) {
        const error = new Error('private account information'); error.name = 'AccountChangedError'; throw error;
      }
      return 'synthetic-token';
    } });
    await assert.rejects(api.requestPiecePreview(request(), options()), isCode('PIECE_AUTH_REQUIRED'));
    assert.equal(api.calls.length, where === 'before' ? 0 : 1);
  });
}

test('missing or failed session stops before any network call', async () => {
  for (const session of [async () => null, async () => { throw new Error('private session details'); }]) {
    const api = load({ session });
    await assert.rejects(api.requestPiecePreview(request(), options()), isCode('PIECE_AUTH_REQUIRED'));
    assert.equal(api.calls.length, 0);
  }
});

for (const [label, mutate, code] of [
  ['raw input', r => { r.memo = 'private'; }, 'PIECE_REQUEST_INVALID'],
  ['client owner', r => { r.source_ref.owner_user_id = OWNER; }, 'PIECE_REQUEST_INVALID'],
  ['missing source field', r => { delete r.source_ref.question_need_decision_identity; }, 'PIECE_REQUEST_INVALID'],
  ['bad commitment', r => { r.source_ref.source_input_bundle_commitment = 'bad'; }, 'PIECE_REQUEST_INVALID'],
  ['refined source', r => { r.source_ref.emlis_observation_stage = 'refined_observation'; }, 'PIECE_SOURCE_NOT_ELIGIBLE'],
  ['supplement', r => { r.source_ref.supplemental_answer_identity = 'answer'; }, 'PIECE_SOURCE_NOT_ELIGIBLE'],
  ['format', r => { r.requested_format = 'question_answer'; }, 'PIECE_FORMAT_NOT_ELIGIBLE'],
  ['visual key', r => { r.visual_selection.renderer_version = 'injected'; }, 'PIECE_REQUEST_INVALID'],
  ['visual type', r => { r.visual_selection.theme_id = false; }, 'PIECE_VISUAL_SELECTION_NOT_ALLOWED'],
]) {
  test(`rejects ${label} before any session or request`, async () => {
    const api = load(), value = request(); mutate(value);
    await assert.rejects(api.requestPiecePreview(value, options()), isCode(code));
    assert.equal(api.calls.length, 0); assert.equal(api.sessions.length, 0);
  });
}

for (const key of [null, '', ' ', ' leading', 'trailing ', 'line\nbreak', '\u3042']) {
  test(`does not normalize an untransportable idempotency key ${JSON.stringify(key)}`, async () => {
    const api = load();
    await assert.rejects(api.requestPiecePreview(request(), options({ idempotencyKey: key })), isCode('PIECE_REQUEST_INVALID'));
    assert.equal(api.calls.length, 0);
  });
}

const errors = {
  PIECE_REQUEST_INVALID: 400, PIECE_AUTH_REQUIRED: 401,
  PIECE_SOURCE_NOT_FOUND: 404, PIECE_NOT_FOUND: 404,
  PIECE_PREVIEW_STALE: 409, PIECE_PREVIEW_EXPIRED: 409, PIECE_CONFLICT: 409, PIECE_HASH_MISMATCH: 409,
  PIECE_SOURCE_NOT_ELIGIBLE: 422, PIECE_FORMAT_NOT_ELIGIBLE: 422,
  PIECE_VISUAL_SELECTION_NOT_ALLOWED: 422, PIECE_SAFETY_UNAVAILABLE: 422,
  PIECE_TEMPORARILY_UNAVAILABLE: 503,
};
for (const [code, status] of Object.entries(errors)) {
  test(`preserves closed ${status}/${code}, not provider details`, async () => {
    const api = load({ send: async () => ({ status, json: async () => ({ code }) }) });
    await assert.rejects(api.requestPiecePreview(request(), options()), isCode(code));
    assert.equal(api.calls.length, 1);
  });
}

for (const [label, status, value] of [
  ['unknown code', 422, { code: 'PRIVATE_PROVIDER_DETAIL' }],
  ['mismatched status', 503, { code: 'PIECE_NOT_FOUND' }],
  ['internal extras', 400, { code: 'PIECE_REQUEST_INVALID', detail: 'PRIVATE_PROVIDER_DETAIL' }],
  ['legacy success', 200, { question: 'private', answer: 'private' }],
  ['partial success status', 206, preview()],
]) {
  test(`conceals ${label}`, async () => {
    const api = load({ send: async () => ({ status, json: async () => value }) });
    await assert.rejects(api.requestPiecePreview(request(), options()), error => {
      isCode('PIECE_TEMPORARILY_UNAVAILABLE')(error);
      assert.doesNotMatch(error.message, /private|PRIVATE_PROVIDER_DETAIL/);
      return true;
    });
  });
}

for (const [label, mutate] of [
  ['public default', p => { p.visibility_scope = 'public'; }],
  ['API version', p => { p.api_contract_version = 'piece.api.v1'; }],
  ['internal field', p => { p.source_lineage = {}; }],
  ['text mismatch', p => { p.piece_text += 'changed'; }],
  ['hash shape', p => { p.piece_text_hash = 'bad'; }],
  ['wrong content format', p => { p.content_payload.format_type = 'quote'; }],
  ['unknown content version', p => { p.content_payload.schema_version = 'future'; }],
  ['unsupported visual version', p => { p.visual_recipe.visual_recipe_version = 'future'; }],
  ['unknown visual field', p => { p.visual_recipe.raw_input = 'private'; }],
  ['unsafe revision number', p => { p.preview_revision = Number.MAX_SAFE_INTEGER + 1; }],
  ['timezone missing', p => { p.expires_at = '2026-10-08T12:00:00'; }],
  ['empty content', p => { p.content_payload.body_blocks = []; }],
]) {
  test(`incomplete response ${label} is not exposed`, async () => {
    const value = preview(); mutate(value);
    const api = load({ send: async () => ({ status: 200, json: async () => value }) });
    await assert.rejects(api.requestPiecePreview(request(), options()), isCode('PIECE_TEMPORARILY_UNAVAILABLE'));
  });
}

test('JSON parse failure and empty response never become success', async () => {
  for (const send of [async () => null, async () => ({ status: 200, json: async () => { throw new Error('private'); } })]) {
    const api = load({ send });
    await assert.rejects(api.requestPiecePreview(request(), options()), isCode('PIECE_TEMPORARILY_UNAVAILABLE'));
  }
});

test('abort before send, during transport and during session recheck suppresses results', async () => {
  for (const at of ['before', 'transport', 'recheck']) {
    const control = new AbortController();
    if (at === 'before') control.abort();
    const api = load({
      send: async () => {
        if (at === 'transport') control.abort();
        return { status: 200, json: async () => preview() };
      },
      session: async (_owner, nth) => {
        if (at === 'recheck' && nth === 2) control.abort();
        return 'synthetic-token';
      },
    });
    await assert.rejects(api.requestPiecePreview(request(), options({ signal: control.signal })),
      error => error.name === 'AbortError');
    assert.equal(api.calls.length, at === 'before' ? 0 : 1);
  }
});

test('transport carries hash identities but does not award renderer or cryptographic acceptance', async () => {
  const api = load(), result = await api.requestPiecePreview(request(), options());
  assert.equal(result.hash_verified, undefined);
  assert.equal(result.render_ready, undefined);
  assert.equal(result.capabilities, undefined);
  assert.equal(result.quota, undefined);
});

test('null options are a closed request error, not a raw TypeError', async () => {
  const api = load();
  await assert.rejects(api.requestPiecePreview(request(), null), isCode('PIECE_REQUEST_INVALID'));
  assert.equal(api.calls.length, 0);
});

test('printable keys with interior spaces and pre-question source are preserved unchanged', async () => {
  const api = load(), value = request();
  value.source_ref.emlis_observation_stage = 'pre_question_observation';
  value.source_ref.question_need_decision_identity = 'synthetic-question-decision';
  await api.requestPiecePreview(value, options({ idempotencyKey: 'exact key with spaces' }));
  assert.equal(api.calls[0][1].headers['Idempotency-Key'], 'exact key with spaces');
  assert.deepEqual(JSON.parse(api.calls[0][1].body), value);
});

for (const mutate of [
  p => { p.visual_recipe.template.template_id = { raw: 'private' }; },
  p => { p.visual_recipe.branding.branding_mode = 'unknown'; },
  p => { p.visual_recipe.font_style.font_style_version = 2; },
]) {
  test('unsupported or non-scalar catalog identity is not accepted as a preview', async () => {
    const value = preview(); mutate(value);
    const api = load({ send: async () => ({ status: 200, json: async () => value }) });
    await assert.rejects(api.requestPiecePreview(request(), options()), isCode('PIECE_TEMPORARILY_UNAVAILABLE'));
  });
}

test('accepted 9:16 adjusted preview retains its server recipe and does not invent capability data', async () => {
  const value = preview();
  value.content_status = 'adjusted';
  value.visual_recipe.aspect_ratio = '9:16';
  value.visual_recipe.branding.branding_mode = 'required_subtle';
  value.visual_recipe_hash = digest(JSON.stringify(canonical(value.visual_recipe)));
  const api = load({ send: async () => ({ status: 200, json: async () => value }) });
  const result = await api.requestPiecePreview(request(), options());
  assert.deepEqual(copy(result), value);
  assert.equal(result.capabilities, undefined);
});

for (const mutate of [
  r => { r.requested_format = undefined; },
  r => { r.source_ref.source_input_id = 1n; },
  r => { r.visual_selection.theme_id = undefined; },
]) {
  test('non-JSON or elided request fields cannot bypass closed request validation', async () => {
    const api = load(), value = request(); mutate(value);
    await assert.rejects(api.requestPiecePreview(value, options()), isCode('PIECE_REQUEST_INVALID'));
    assert.equal(api.calls.length, 0);
  });
}
