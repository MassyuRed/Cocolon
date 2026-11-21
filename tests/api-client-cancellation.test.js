const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function harness(getSession, options = {}) {
  const abortController = Object.prototype.hasOwnProperty.call(options, 'abortController')
    ? options.abortController : AbortController;
  const sent = [];
  const source = fs.readFileSync(path.join(__dirname, '../lib/apiClient.js'), 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  const requireStub = name => {
    if (name === 'react-native') return { Platform: { OS: 'ios' } };
    if (name === './supabase') return { supabase: { auth: { getSession } } };
    if (name === './compat/legacyWireContracts') return { readRuntimeApiBaseUrl: () => 'https://api.invalid' };
    if (name === './monitoring') return { captureApiError() {} };
    throw new Error(`Unexpected import: ${name}`);
  };
  vm.runInNewContext(code, {
    module, exports: module.exports, require: requireStub, process: { env: {} },
    AbortController: abortController, setTimeout, clearTimeout,
    fetch: async (url, options) => {
      sent.push({ url, options });
      return { ok: true, status: 200, text: async () => '{"ok":true}' };
    },
  });
  return { api: module.exports, sent };
}

const sessionA = () => Promise.resolve({ data: { session: {
  user: { id: 'owner-A' }, access_token: 'synthetic-token-A',
} } });

test('cancelled owner scope never invokes fetch even when token resolution succeeds', async () => {
  const controller = new AbortController();
  controller.abort();
  const { api, sent } = harness(sessionA);
  await assert.rejects(api.apiPost('/account/profile', { display_name: 'A' }, {
    expectedUserId: 'owner-A', signal: controller.signal,
  }), error => error.name === 'AbortError');
  assert.equal(sent.length, 0);
});

test('scope cancelled during authentication cannot send after the same owner returns', async () => {
  let resolveSession;
  const pendingSession = new Promise(resolve => { resolveSession = resolve; });
  const controller = new AbortController();
  const { api, sent } = harness(() => pendingSession);
  const request = api.apiPost('/account/profile', { display_name: 'A' }, {
    expectedUserId: 'owner-A', signal: controller.signal,
  });
  controller.abort();
  resolveSession(await sessionA());
  await assert.rejects(request, error => error.name === 'AbortError');
  assert.equal(sent.length, 0);
});

test('cancellation remains effective without a platform AbortController', async () => {
  const { api, sent } = harness(sessionA, { abortController: undefined });
  await assert.rejects(api.apiGet('/notice', { signal: { aborted: true } }),
    error => error.name === 'AbortError');
  assert.equal(sent.length, 0);
});

test('cancelled unauthenticated request does not invoke fetch', async () => {
  const controller = new AbortController(); controller.abort();
  const { api, sent } = harness(() => { throw new Error('must not resolve auth'); });
  await assert.rejects(api.apiGet('/public', { auth: false, signal: controller.signal }),
    error => error.name === 'AbortError');
  assert.equal(sent.length, 0);
});

test('active owner request preserves authorization, body and parsed response', async () => {
  const { api, sent } = harness(sessionA);
  const result = await api.apiPost('/account/profile', { display_name: 'A' }, { expectedUserId: 'owner-A' });
  assert.equal(result.ok, true);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].url, 'https://api.invalid/account/profile');
  assert.equal(sent[0].options.headers.Authorization, 'Bearer synthetic-token-A');
  assert.equal(sent[0].options.body, '{"display_name":"A"}');
});
