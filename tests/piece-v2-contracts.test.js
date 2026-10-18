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
    branding: { branding_mode: format === 'short_essay' ? 'required_small' : 'required_subtle', branding_mark_id: 'cocolon_text_mark', branding_mark_version: 1 },
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
    quota: { contract_version: 'piece.quota_consumption.v1',
      subscription_tier: format === 'short_essay' ? 'free' : 'premium', month_key: '2026-10',
      save_limit: format === 'short_essay' ? 5 : null, saved_count: 2,
      remaining_count: format === 'short_essay' ? 3 : null, can_save: true },
    plan_capabilities: { format_selection: format === 'short_essay' ? 'fixed' : 'eligible_choice',
      theme_ids: format === 'short_essay' ? ['soft_paper'] : ['soft_paper', 'quiet_night'],
      aspect_ratios: format === 'short_essay' ? ['4:5'] : ['4:5', '9:16'],
      branding_modes: format === 'short_essay' ? ['required_small'] : ['required_subtle', 'off'] },
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
    '\n globalThis.testApi = { requestPiecePreview, requestPiecePreviewVisualChange, requestPiecePreviewCancellation, requestPieceSave, PieceApiError };', context, { filename: sourcePath });
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
  // Preview/source-ref, explicit save, cancellation and saved-owner operations use
  // transport, each with its own closed contract and session recheck.
  assert.equal((source.match(/await apiFetch\(/g) || []).length, 4);
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
  assert.deepEqual(copy(result.quota), preview().quota);
  assert.deepEqual(copy(result.plan_capabilities), preview().plan_capabilities);
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

test('accepted Premium 9:16 adjusted preview retains server recipe and plan metadata', async () => {
  const value = preview('quote');
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


const planCases = {
  free: { format_selection: 'fixed', theme_ids: ['soft_paper'], aspect_ratios: ['4:5'], branding_modes: ['required_small'] },
  plus: { format_selection: 'automatic', theme_ids: ['soft_paper', 'quiet_night'], aspect_ratios: ['4:5'], branding_modes: ['required_subtle'] },
  premium: { format_selection: 'eligible_choice', theme_ids: ['soft_paper', 'quiet_night'], aspect_ratios: ['4:5', '9:16'], branding_modes: ['required_subtle', 'off'] },
};
for (const tier of ['free', 'plus', 'premium']) {
  test(`current ${tier} plan and quota survive transport as immutable display metadata`, async () => {
    const raw = preview();
    const limit = { free: 5, plus: 30, premium: null }[tier];
    raw.quota = { contract_version: 'piece.quota_consumption.v1', subscription_tier: tier,
      month_key: '2026-10', save_limit: limit, saved_count: 32,
      remaining_count: limit === null ? null : 0, can_save: limit === null };
    raw.plan_capabilities = copy(planCases[tier]);
    raw.visual_recipe.branding.branding_mode = tier === 'free' ? 'required_small' : 'required_subtle';
    raw.visual_recipe_hash = digest(JSON.stringify(canonical(raw.visual_recipe)));
    const api = load({ send: async () => ({ status: 200, json: async () => raw }) });
    const received = await api.requestPiecePreview(request(), options());
    assert.deepEqual(copy(received), raw);
    assert.ok(Object.isFrozen(received.quota)); assert.ok(Object.isFrozen(received.plan_capabilities.theme_ids));
    assert.equal(api.calls.length, 1);
  });
}
const badPlanMetadata = [
  raw => { delete raw.quota; }, raw => { delete raw.plan_capabilities; },
  raw => { raw.quota = null; }, raw => { raw.plan_capabilities = []; },
  raw => { raw.quota.extra = true; }, raw => { raw.plan_capabilities.save_enabled = true; },
  raw => { raw.quota.contract_version = 'v0'; }, raw => { raw.quota.subscription_tier = 'unknown'; },
  raw => { raw.quota.subscription_tier = 'premium'; }, raw => { raw.quota.month_key = '2026-13'; },
  raw => { raw.quota.month_key = '2026-1'; }, raw => { raw.quota.saved_count = -1; },
  raw => { raw.quota.saved_count = true; }, raw => { raw.quota.saved_count = 1.5; },
  raw => { raw.quota.saved_count = Number.MAX_SAFE_INTEGER + 1; },
  raw => { raw.quota.save_limit = null; }, raw => { raw.quota.remaining_count = null; },
  raw => { raw.quota.remaining_count = 4; }, raw => { raw.quota.can_save = false; },
  raw => { raw.quota.can_save = 1; }, raw => { raw.plan_capabilities.format_selection = 'eligible_choice'; },
  raw => { raw.plan_capabilities.theme_ids.push('quiet_night'); },
  raw => { raw.plan_capabilities.theme_ids.push('soft_paper'); },
  raw => { raw.plan_capabilities.aspect_ratios.push('9:16'); },
  raw => { raw.plan_capabilities.branding_modes = ['off']; },
  raw => { raw.visual_recipe.branding.branding_mode = 'required_subtle'; },
  raw => { raw.plan_capabilities.theme_ids = 'soft_paper'; },
];
badPlanMetadata.forEach((change, index) => {
  test(`malformed or inconsistent preview plan/quota ${index + 1} is closed`, async () => {
    const raw = preview(); change(raw);
    const api = load({ send: async () => ({ status: 200, json: async () => raw }) });
    await assert.rejects(api.requestPiecePreview(request(), options()),
      error => error.code === 'PIECE_TEMPORARILY_UNAVAILABLE');
  });
});

const visualRequest = () => ({ preview_id: preview('quote').preview_id, expected_preview_revision: 1,
  visual_selection: { theme_id: 'quiet_night', aspect_ratio: '4:5', branding_mode: 'required_subtle' } });
function visualReply() {
  const result = preview('quote'); result.preview_revision = 2; result.row_version = 2;
  result.visual_recipe.theme.theme_id = 'quiet_night';
  result.visual_recipe_hash = digest(JSON.stringify(canonical(result.visual_recipe)));
  return result;
}
const visualOptions = extras => ({ expectedUserId: OWNER, ...extras });

test('PATCH reuses authenticated transport/session recheck with exact2 body, no key or source/body fields', async () => {
  const expected = visualReply(), api = load({ send: async () => ({ status: 200, json: async () => expected }) });
  const result = await api.requestPiecePreviewVisualChange(visualRequest(), visualOptions());
  assert.deepEqual(copy(result), expected); assert.ok(Object.isFrozen(result));
  assert.equal(api.calls[0][0], '/emotion/piece/preview/' + expected.preview_id);
  const sent = api.calls[0][1]; assert.equal(sent.method, 'PATCH'); assert.equal(sent.auth, true);
  assert.equal(sent.expectedUserId, OWNER); assert.equal(sent.headers['Idempotency-Key'], undefined);
  assert.deepEqual(JSON.parse(sent.body), { expected_preview_revision: 1, visual_selection: visualRequest().visual_selection });
  assert.deepEqual(api.sessions, [OWNER, OWNER]);
});
for (const defect of ['extra', 'id', 'revision', 'missing_selection', 'extra_selection', 'bad_choice', 'key']) {
  test(`invalid visual ${defect} rejects before network`, async () => {
    const api = load(), value = visualRequest(), opt = visualOptions();
    if (defect === 'extra') value.piece_text = 'private';
    if (defect === 'id') value.preview_id = '../private';
    if (defect === 'revision') value.expected_preview_revision = '1';
    if (defect === 'missing_selection') delete value.visual_selection.aspect_ratio;
    if (defect === 'extra_selection') value.visual_selection.font_size = 10;
    if (defect === 'bad_choice') value.visual_selection.theme_id = 'not-a-theme';
    if (defect === 'key') opt.idempotencyKey = KEY;
    await assert.rejects(api.requestPiecePreviewVisualChange(value, opt));
    assert.equal(api.calls.length, 0);
  });
}
test('PATCH captures caller-owned selection before session awaits', async () => {
  const api = load({ send: async () => ({ status: 200, json: async () => visualReply() }) }), value = visualRequest();
  const pending = api.requestPiecePreviewVisualChange(value, visualOptions());
  value.visual_selection.theme_id = 'soft_paper'; value.expected_preview_revision = 99;
  await pending;
  assert.equal(JSON.parse(api.calls[0][1].body).visual_selection.theme_id, 'quiet_night');
  assert.equal(JSON.parse(api.calls[0][1].body).expected_preview_revision, 1);
});
test('PATCH rejects account change after response without exposing its content', async () => {
  const api = load({ session: (owner, count) => count === 1 ? 'synthetic' : null,
    send: async () => ({ status: 200, json: async () => visualReply() }) });
  await assert.rejects(api.requestPiecePreviewVisualChange(visualRequest(), visualOptions()), isCode('PIECE_AUTH_REQUIRED'));
  assert.equal(api.calls.length, 1);
});
test('PATCH network failure does not automatically retry or expose a raw exception', async () => {
  const api = load({ send: async () => { throw new Error('private transport body'); } });
  await assert.rejects(api.requestPiecePreviewVisualChange(visualRequest(), visualOptions()), isCode('PIECE_TEMPORARILY_UNAVAILABLE'));
  assert.equal(api.calls.length, 1);
});

const cancelRequest = () => ({ preview_id: preview().preview_id, expected_preview_revision: 1 });
const cancelReceipt = () => ({ preview_id: preview().preview_id, preview_revision: 1,
  row_version: 2, lifecycle_status: 'cancelled', idempotency_replayed: false });
test('DELETE captures exact revision with owner session checks and no generation key or private fields', async () => {
  const api = load({ send: async () => ({ status: 200, json: async () => cancelReceipt() }) });
  const value = cancelRequest(), pending = api.requestPiecePreviewCancellation(value, visualOptions());
  value.expected_preview_revision = 9;
  const result = await pending, sent = api.calls[0][1];
  assert.deepEqual(copy(result), cancelReceipt()); assert.ok(Object.isFrozen(result));
  assert.equal(api.calls[0][0], '/emotion/piece/preview/' + result.preview_id);
  assert.equal(sent.method, 'DELETE'); assert.equal(sent.auth, true);
  assert.deepEqual(JSON.parse(sent.body), { expected_preview_revision: 1 });
  assert.equal(sent.headers['Idempotency-Key'], undefined);
  assert.equal(sent.headers['Cache-Control'], 'no-store');
  assert.deepEqual(api.sessions, [OWNER, OWNER]);
});
test('invalid cancellation identity or replacement fields cannot reach HTTP', async () => {
  for (const value of [null, {}, { ...cancelRequest(), preview_id: '../private' },
    { ...cancelRequest(), expected_preview_revision: true },
    { ...cancelRequest(), expected_preview_revision: 0 },
    { ...cancelRequest(), piece_text: 'private' }]) {
    const api = load();
    await assert.rejects(api.requestPiecePreviewCancellation(value, visualOptions()), isCode('PIECE_REQUEST_INVALID'));
    assert.equal(api.calls.length, 0);
  }
  const api = load();
  await assert.rejects(api.requestPiecePreviewCancellation(cancelRequest(), options()), isCode('PIECE_REQUEST_INVALID'));
  assert.equal(api.calls.length, 0);
});
test('cancellation never accepts a different artifact, saved state, malformed or body-bearing receipt', async () => {
  for (const update of [{ preview_id: 'other' }, { preview_revision: 2 }, { row_version: true },
    { lifecycle_status: 'saved' }, { idempotency_replayed: 1 }, { piece_text: 'private' }]) {
    const api = load({ send: async () => ({ status: 200, json: async () => ({ ...cancelReceipt(), ...update }) }) });
    await assert.rejects(api.requestPiecePreviewCancellation(cancelRequest(), visualOptions()), isCode('PIECE_TEMPORARILY_UNAVAILABLE'));
    assert.equal(api.calls.length, 1);
  }
});
test('cancellation account change after response conceals its receipt', async () => {
  const api = load({ session: (owner, count) => count === 1 ? 'synthetic' : null,
    send: async () => ({ status: 200, json: async () => cancelReceipt() }) });
  await assert.rejects(api.requestPiecePreviewCancellation(cancelRequest(), visualOptions()), isCode('PIECE_AUTH_REQUIRED'));
});
test('cancellation abort remains local and an unknown network outcome is not automatically retried', async () => {
  const a = new AbortController(); a.abort(); const api = load();
  await assert.rejects(api.requestPiecePreviewCancellation(cancelRequest(), visualOptions({ signal: a.signal })), e => e.name === 'AbortError');
  assert.equal(api.calls.length, 0);
  const failing = load({ send: async () => { throw new Error('private provider detail'); } });
  await assert.rejects(failing.requestPiecePreviewCancellation(cancelRequest(), visualOptions()), isCode('PIECE_TEMPORARILY_UNAVAILABLE'));
  assert.equal(failing.calls.length, 1);
});

const saveRequest = () => {
  const p = preview();
  return { preview_id: p.preview_id, expected_preview_revision: p.preview_revision,
    piece_text_hash: p.piece_text_hash, content_payload_hash: p.content_payload_hash,
    visual_recipe_hash: p.visual_recipe_hash };
};
const saveReceipt = (idempotency_replayed = false) => ({
  piece_id: preview().preview_id, consumption_id: '40000000-0000-4000-8000-000000000004',
  lifecycle_status: 'saved', visibility_scope: 'private', row_version: 2,
  saved_at: '2026-10-08T11:59:59.123456+00:00', idempotency_replayed,
});

for (const visibility of ['omitted', null, 'private']) {
  test(`save ${visibility} sends private with exact preview identities and a closed receipt`, async () => {
    const raw = saveReceipt();
    const api = load({ send: async () => ({ status: 200, json: async () => raw }) });
    const input = saveRequest();
    if (visibility !== 'omitted') input.visibility_scope = visibility;
    const result = await api.requestPieceSave(input, options());
    assert.deepEqual(copy(result), saveReceipt()); assert.ok(Object.isFrozen(result));
    const [url, sent] = api.calls[0];
    assert.equal(url, '/emotion/piece/save'); assert.equal(sent.method, 'POST');
    assert.equal(sent.auth, true); assert.equal(sent.expectedUserId, OWNER);
    assert.equal(sent.headers['Idempotency-Key'], KEY);
    assert.equal(sent.headers['Cache-Control'], 'no-store');
    assert.deepEqual(JSON.parse(sent.body), { ...saveRequest(), visibility_scope: 'private' });
    assert.deepEqual(api.sessions, [OWNER, OWNER]);
    assert.equal(api.calls.length, 1);
    raw.consumption_id = 'changed outside receipt';
    assert.equal(result.consumption_id, saveReceipt().consumption_id);
  });
}

test('save captures identity, visibility, owner and retry key before its first await', async () => {
  let release;
  const api = load({ session: (_owner, nth) => nth === 1 ? new Promise(resolve => { release = resolve; }) : 'synthetic',
    send: async () => ({ status: 200, json: async () => saveReceipt() }) });
  const input = saveRequest(), opts = options();
  const pending = api.requestPieceSave(input, opts);
  input.expected_preview_revision = 9; input.visual_recipe_hash = 'b'.repeat(64);
  input.visibility_scope = 'public'; opts.expectedUserId = 'another-owner'; opts.idempotencyKey = 'another-key';
  release('synthetic'); await pending;
  assert.deepEqual(JSON.parse(api.calls[0][1].body), { ...saveRequest(), visibility_scope: 'private' });
  assert.equal(api.calls[0][1].headers['Idempotency-Key'], KEY);
  assert.deepEqual(api.sessions, [OWNER, OWNER]);
});

test('save rejects replacement content, client admission and malformed identities before any IO', async () => {
  const values = [null, {}, [],
    { ...saveRequest(), preview_id: 'piece:' + preview().preview_id },
    { ...saveRequest(), preview_id: '../private' },
    { ...saveRequest(), preview_id: '00000000-0000-0000-0000-000000000000' },
    ...[0, -1, true, 1.5, '1', Number.MAX_SAFE_INTEGER + 1].map(expected_preview_revision => ({ ...saveRequest(), expected_preview_revision })),
    ...['piece_text_hash', 'content_payload_hash', 'visual_recipe_hash'].flatMap(field =>
      [null, 'sha256:' + 'a'.repeat(64), 'A'.repeat(64), 'short'].map(value => ({ ...saveRequest(), [field]: value }))),
    ...['', 'unknown', false, 0].map(visibility_scope => ({ ...saveRequest(), visibility_scope })),
    ...['piece_text', 'content_payload', 'visual_recipe', 'owner_user_id', 'subscription_tier',
      'source_lineage', 'can_save', 'fit', 'replay_only', 'expires_at'].map(key => ({ ...saveRequest(), [key]: 'private' })),
  ];
  for (const value of values) {
    const api = load();
    await assert.rejects(api.requestPieceSave(value, options()), isCode('PIECE_REQUEST_INVALID'));
    assert.equal(api.calls.length, 0); assert.equal(api.sessions.length, 0);
  }
  for (const idempotencyKey of [undefined, null, '', ' ', ' key', 'key ', 'key\nother', 'キー', 1]) {
    const api = load();
    await assert.rejects(api.requestPieceSave(saveRequest(), options({ idempotencyKey })), isCode('PIECE_REQUEST_INVALID'));
    assert.equal(api.calls.length, 0); assert.equal(api.sessions.length, 0);
  }
});

test('save requires current owner before HTTP and conceals a receipt after account changes', async () => {
  for (const changedAt of [1, 2]) {
    const api = load({ session: (_owner, nth) => nth === changedAt ? null : 'synthetic',
      send: async () => ({ status: 200, json: async () => saveReceipt() }) });
    await assert.rejects(api.requestPieceSave(saveRequest(), options()), isCode('PIECE_AUTH_REQUIRED'));
    assert.equal(api.calls.length, changedAt === 1 ? 0 : 1);
  }
  const api = load({ send: async () => { throw Object.assign(new Error('private token'), { name: 'AccountChangedError' }); } });
  await assert.rejects(api.requestPieceSave(saveRequest(), options()), isCode('PIECE_AUTH_REQUIRED'));
  assert.equal(api.calls.length, 1);
});

test('save abort at each await boundary prevents stale receipt adoption without automatic retry', async () => {
  for (const stage of ['initial', 'session', 'http', 'json', 'final_session']) {
    const abort = new AbortController();
    if (stage === 'initial') abort.abort();
    const api = load({ session: (_owner, nth) => {
      if (stage === 'session' && nth === 1 || stage === 'final_session' && nth === 2) abort.abort();
      return 'synthetic';
    }, send: async () => {
      if (stage === 'http') abort.abort();
      return { status: 200, json: async () => { if (stage === 'json') abort.abort(); return saveReceipt(); } };
    } });
    await assert.rejects(api.requestPieceSave(saveRequest(), options({ signal: abort.signal })), e => e.name === 'AbortError');
    assert.equal(api.calls.length, ['initial', 'session'].includes(stage) ? 0 : 1);
  }
});

test('unknown save outcome is explicitly retried with unchanged request and key, without local expiry or regeneration', async () => {
  let sends = 0;
  const api = load({ send: async () => {
    if (++sends === 1) throw new Error('private transport detail');
    return { status: 200, json: async () => saveReceipt(true) };
  } });
  const input = saveRequest();
  await assert.rejects(api.requestPieceSave(input, options()), isCode('PIECE_TEMPORARILY_UNAVAILABLE'));
  assert.equal(api.calls.length, 1);
  // The old saved_at is valid for committed replay. There is no fresh preview
  // or expiry check in transport; this synthetic receipt is not native SQL proof.
  const recovered = await api.requestPieceSave(input, options());
  assert.equal(recovered.idempotency_replayed, true);
  assert.equal(recovered.consumption_id, saveReceipt().consumption_id);
  assert.equal(api.calls.length, 2);
  assert.ok(api.calls.every(([url]) => url === '/emotion/piece/save'));
  assert.equal(api.calls[0][1].body, api.calls[1][1].body);
  assert.equal(api.calls[0][1].headers['Idempotency-Key'], api.calls[1][1].headers['Idempotency-Key']);
});

test('same-key save replay preserves current visibility and version without restoring the old request', async () => {
  const current = { ...saveReceipt(true), visibility_scope: 'public', row_version: 3 };
  const api = load({ send: async () => ({ status: 200, json: async () => current }) });
  const result = await api.requestPieceSave(saveRequest(), options());
  assert.deepEqual(copy(result), current);
  assert.equal(result.consumption_id, saveReceipt().consumption_id);
  assert.equal(api.calls.length, 1);
  const [url, sent] = api.calls[0];
  assert.equal(url, '/emotion/piece/save'); assert.equal(sent.method, 'POST');
  assert.equal(sent.headers['Idempotency-Key'], KEY);
  assert.deepEqual(JSON.parse(sent.body), { ...saveRequest(), visibility_scope: 'private' });
});

test('save rejects a different artifact, initial public substitution and malformed or body-bearing receipts', async () => {
  const changes = [{ piece_id: OWNER }, { consumption_id: 'private' },
    { consumption_id: '00000000-0000-0000-0000-000000000000' }, { lifecycle_status: 'preview_draft' },
    { visibility_scope: 'public' }, { visibility_scope: 'unknown', idempotency_replayed: true },
    { row_version: true }, { row_version: 0 },
    { row_version: Number.MAX_SAFE_INTEGER + 1 }, { saved_at: '2026-13-01T00:00:00Z' },
    { saved_at: '2026-10-08' }, { saved_at: null }, { idempotency_replayed: 1 },
    { piece_text: 'private response' }, { owner_user_id: OWNER }];
  for (const value of [null, {}, [], ...changes.map(change => ({ ...saveReceipt(), ...change }))]) {
    const api = load({ send: async () => ({ status: 200, json: async () => value }) });
    await assert.rejects(api.requestPieceSave(saveRequest(), options()), isCode('PIECE_TEMPORARILY_UNAVAILABLE'));
    assert.equal(api.calls.length, 1);
  }
});

test('save returns only matching closed server errors and does not infer public permission', async () => {
  for (const [status, code] of [[400, 'PIECE_REQUEST_INVALID'], [401, 'PIECE_AUTH_REQUIRED'],
    [404, 'PIECE_NOT_FOUND'], [404, 'PIECE_SOURCE_NOT_FOUND'], [409, 'PIECE_PREVIEW_STALE'],
    [409, 'PIECE_PREVIEW_EXPIRED'], [409, 'PIECE_HASH_MISMATCH'], [409, 'PIECE_CONFLICT'],
    [409, 'PIECE_QUOTA_EXHAUSTED'], [422, 'PIECE_SOURCE_NOT_ELIGIBLE'], [422, 'PIECE_FORMAT_NOT_ELIGIBLE'],
    [422, 'PIECE_VISUAL_SELECTION_NOT_ALLOWED'], [422, 'PIECE_SAFETY_UNAVAILABLE'],
    [503, 'PIECE_FEATURE_DISABLED'], [503, 'PIECE_TEMPORARILY_UNAVAILABLE']]) {
    const api = load({ send: async () => ({ status, json: async () => ({ code }) }) });
    await assert.rejects(api.requestPieceSave({ ...saveRequest(), visibility_scope: 'public' }, options()), isCode(code));
    assert.equal(api.calls.length, 1);
    assert.equal(JSON.parse(api.calls[0][1].body).visibility_scope, 'public');
  }
  for (const [status, raw] of [[400, { code: 'PIECE_QUOTA_EXHAUSTED' }],
    [409, { code: 'PIECE_QUOTA_EXHAUSTED', message: 'private provider detail' }],
    [409, { code: 'private unknown' }], [500, { code: 'PIECE_TEMPORARILY_UNAVAILABLE' }]]) {
    const api = load({ send: async () => ({ status, json: async () => raw }) });
    await assert.rejects(api.requestPieceSave(saveRequest(), options()), isCode('PIECE_TEMPORARILY_UNAVAILABLE'));
    assert.equal(api.calls.length, 1);
  }
  const api = load({ send: async () => ({ status: 200, json: async () => { throw new Error('private malformed JSON'); } }) });
  await assert.rejects(api.requestPieceSave(saveRequest(), options()), isCode('PIECE_TEMPORARILY_UNAVAILABLE'));
});

test('quota exhaustion is a save error and never a preview rejection or save admission', async () => {
  const api = load({ send: async () => ({ status: 409, json: async () => ({ code: 'PIECE_QUOTA_EXHAUSTED' }) }) });
  await assert.rejects(api.requestPieceSave(saveRequest(), options()), error => {
    assert.equal(error.message, '今月のPiece保存回数の上限に達しています。');
    return isCode('PIECE_QUOTA_EXHAUSTED')(error);
  });
  await assert.rejects(api.requestPiecePreview(request(), options()), isCode('PIECE_TEMPORARILY_UNAVAILABLE'));
});
