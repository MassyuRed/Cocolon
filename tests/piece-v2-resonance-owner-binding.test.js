const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.join(__dirname, '..');
const parsed = ts.createSourceFile('PieceLibraryScreen.js',
  fs.readFileSync(path.join(root, 'screens/PieceLibraryScreen.js'), 'utf8'),
  ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
const component = parsed.statements.find(n => ts.isFunctionDeclaration(n) && n.name?.text === 'PieceLibraryScreen');
const declarations = component.body.statements.flatMap(n => ts.isVariableStatement(n) ? [...n.declarationList.declarations] : []);
const ownerEffect = component.body.statements.find(n => ts.isExpressionStatement(n)
  && ts.isCallExpression(n.expression) && n.expression.expression.getText(parsed) === 'useEffect'
  && n.getText(parsed).includes('ownerRequestRef.current = request'));
const ownerEffectCode = ownerEffect.expression.arguments[0].getText(parsed);
const callbackCode = name => declarations.find(n => n.name.getText(parsed) === name).initializer.arguments[0].getText(parsed);
const apiSource = fs.readFileSync(path.join(root, 'lib/apiClient.js'), 'utf8')
  .replace(/^import .*;$/gm, '').replace(/^export /gm, '');
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
const settle = () => new Promise(resolve => setImmediate(resolve));
const clone = value => JSON.parse(JSON.stringify(value));

function harness({ already = false, tutorial = false, holdAuth = false, holdResponse = false } = {}) {
  const calls = [], states = [], alerts = [], authGate = deferred(), responseGate = deferred();
  const session = { current: { user: { id: 'owner-A' }, access_token: 'token-A' } };
  const context = {
    user: { id: 'owner-A' }, ownerRequestRef: { current: null }, AbortController,
    selected: { q_instance_id: 'public-piece', q_key: 'canonical-key', resonances: 3, is_resonated: already },
    isTutorialMode: tutorial, resetSeqRef: { current: 0 }, listRequestSeqRef: { current: 0 },
    detailLoading: false, activeViewedUserId: 'target-A',
    resonanceStrength: 'large', resonanceMemo: '響いた原文',
    PIECE_RESONANCE_SUBMIT_ENDPOINT: '/piece/resonance/submit', PIECE_RESONANCE_DELETE_ENDPOINT: '/piece/resonance/delete',
    Alert: { alert: (...args) => alerts.push(args) }, buildErrorMessage: String,
    updateTutorialPiece: () => {}, closeResonanceModal: () => states.push(['close']),
    setPrefetch: (...args) => states.push(['cache', args]),
    setUnread: (...args) => states.push(['unread', args]),
    onTabUnreadChange: value => states.push(['tabUnread', value]),
    buildFollowListPath: () => '/follow/list',
  };
  for (const name of ['setResonanceSubmitting', 'setResonanceDeleting', 'setResonanceSubmitError', 'setSelected', 'setQnaItems',
    'setDetailLoadingId', 'setDetailLoading', 'setPickerVisible', 'setUserPickerVisible', 'setListMeta', 'setListError',
    'setListLoading', 'setFollowingUsers', 'setFollowingLoading', 'setFollowingError']) {
    context[name] = value => states.push([name, value]);
  }
  context.setActiveViewedUserId = value => { context.activeViewedUserId = value; states.push(['target', value]); };
  const supabase = { auth: { getSession: async () => {
    if (holdAuth) await authGate.promise;
    return { data: { session: session.current } };
  } } };
  const api = vm.runInNewContext(apiSource + '\n({ apiFetch, apiGet, apiJson, apiPost });', {
    Platform: { OS: 'ios' }, supabase, readRuntimeApiBaseUrl: () => 'https://local.invalid', captureApiError: () => {},
    process: { env: {} }, AbortController, setTimeout, clearTimeout,
    fetch: async (url, options) => {
      if (options.signal?.aborted) { const e = new Error('Aborted'); e.name = 'AbortError'; throw e; }
      calls.push({ url, authorization: options.headers.Authorization, body: options.body ? JSON.parse(options.body) : undefined });
      if (holdResponse) await responseGate.promise;
      const response = { resonated: !already, resonances: already ? 2 : 4, has_unread: true,
        q_instance_id: 'public-piece', title: '公開見出し', body: '公開本文',
        items: [{ q_instance_id: 'list-piece', owner: { user_id: 'target-A' }, question: { title: '公開見出し', q_key: 'key' } }] };
      return { ok: true, json: async () => response, text: async () => JSON.stringify(response) };
    },
  });
  Object.assign(context, api);
  const nexusSource = fs.readFileSync(path.join(root, 'lib/nexusApi.js'), 'utf8')
    .replace(/^import .*;$/gm, '').replace(/^export /gm, '');
  Object.assign(context, vm.runInNewContext(nexusSource + '\n({ getNexusPiecesAsQnaList, getNexusPieceDetailQna, getNexusPiecesUnreadStatus });', {
    ...api, PIECE_WIRE: { routes: { publicFeed: '/nexus/reflections', publicUnreadStatus: '/nexus/reflections/unread-status' } }, readShareCode: () => null,
  }));
  const cleanup = vm.runInNewContext('(' + ownerEffectCode + ')', context)();
  const callbacks = Object.fromEntries(['handleResonancePress', 'submitResonance', 'confirmDeleteResonance',
    'fetchDetail', 'loadQnaList', 'selectTargetUser', 'refreshPieceUnread', 'loadFollowingUsers',
    'resolveTargetUserId', 'buildListParams']
    .map(name => [name, vm.runInNewContext('(' + callbackCode(name) + ')', context)]));
  Object.assign(context, callbacks);
  return { ...callbacks, calls, states, alerts, session, authGate, responseGate, cleanup, context };
}

test('mark-viewed detail keeps the normal owner and public Piece identity', async () => {
  const h = harness();
  await h.fetchDetail({ q_instance_id: 'public-piece' });
  assert.equal(h.calls.length, 1);
  assert.equal(h.calls[0].url, 'https://local.invalid/nexus/reflections/public-piece?mark_viewed=true');
  assert.equal(h.calls[0].authorization, 'Bearer token-A');
  assert.ok(h.states.some(([name, value]) => name === 'setSelected' && value.body === '公開本文'));
  h.cleanup();
});

for (const name of ['fetchDetail', 'loadQnaList', 'refreshPieceUnread', 'loadFollowingUsers']) {
  test(`${name} cannot issue or commit another owner's read`, async () => {
    const h = harness({ holdAuth: true });
    const pending = name === 'fetchDetail' ? h.fetchDetail({ q_instance_id: 'public-piece' })
      : name === 'loadQnaList' ? h.loadQnaList('newest') : h[name]();
    await settle();
    h.cleanup(); h.session.current = { user: { id: 'owner-B' }, access_token: 'token-B' };
    const before = h.states.length;
    h.authGate.resolve(); await pending;
    assert.equal(h.calls.length, 0);
    assert.equal(h.states.length, before);
  });
  test(`${name} ignores an old owner response and cache write`, async () => {
    const h = harness({ holdResponse: true });
    const pending = name === 'fetchDetail' ? h.fetchDetail({ q_instance_id: 'public-piece' })
      : name === 'loadQnaList' ? h.loadQnaList('newest') : h[name]();
    await settle(); assert.equal(h.calls.length, 1);
    h.cleanup(); const before = h.states.length;
    h.responseGate.resolve(); await pending;
    assert.equal(h.states.length, before);
  });
}

test('changing the viewed target invalidates both pending list and selected detail', async () => {
  const h = harness({ holdResponse: true });
  const list = h.loadQnaList('newest');
  const detail = h.fetchDetail({ q_instance_id: 'public-piece' });
  await settle(); assert.equal(h.calls.length, 2);
  h.selectTargetUser('target-B'); const before = h.states.length;
  h.responseGate.resolve(); await Promise.all([list, detail]);
  assert.equal(h.states.length, before, 'target-A must not appear under target-B or populate its cache');
  h.cleanup();
});

test('a newer list sort invalidates an earlier list request', async () => {
  const h = harness({ holdResponse: true });
  const first = h.loadQnaList('newest'); await settle();
  const second = h.loadQnaList('resonances'); await settle();
  assert.equal(h.calls.length, 2);
  h.responseGate.resolve(); await Promise.all([first, second]);
  const cache = h.states.filter(([name]) => name === 'cache');
  assert.equal(cache.length, 1);
  assert.equal(cache[0][1][1], 'qnaList:target-A:resonances');
  h.cleanup();
});

const actions = [
  { name: 'quick submit', handler: 'handleResonancePress', already: false, alert: false, strength: 'medium', memo: null },
  { name: 'detailed submit', handler: 'submitResonance', already: false, alert: false, strength: 'large', memo: '響いた原文' },
  { name: 'quick delete', handler: 'handleResonancePress', already: true, alert: true },
  { name: 'detailed delete', handler: 'confirmDeleteResonance', already: true, alert: true },
];
async function start(h, action) {
  const pending = h[action.handler]();
  if (action.alert) {
    const confirm = h.alerts.at(-1)?.[2]?.find(button => button.style === 'destructive');
    assert.ok(confirm, action.name);
    confirm.onPress();
  }
  return { pending };
}

for (const action of actions) {
  test(`${action.name} uses the current owner and exact selected Piece payload`, async () => {
    const h = harness(action);
    await start(h, action); await settle();
    assert.equal(h.calls.length, 1);
    const call = clone(h.calls[0]);
    assert.equal(call.authorization, 'Bearer token-A');
    assert.equal(call.body.q_instance_id, 'public-piece');
    assert.equal(call.body.q_key, 'canonical-key');
    assert.equal(call.url.endsWith(action.already ? '/delete' : '/submit'), true);
    if (!action.already) assert.deepEqual(call.body, { q_instance_id: 'public-piece', q_key: 'canonical-key', strength: action.strength, memo: action.memo });
    h.cleanup();
  });
  for (const next of ['other owner', 'logout', 'same owner new generation']) {
    test(`${action.name} sends no request after ${next} during auth lookup`, async () => {
      const h = harness({ ...action, holdAuth: true });
      await start(h, action);
      h.cleanup();
      h.session.current = next === 'logout' ? null : { user: { id: next === 'other owner' ? 'owner-B' : 'owner-A' }, access_token: 'replacement-token' };
      const before = h.states.length;
      h.authGate.resolve(); await settle();
      assert.equal(h.calls.length, 0);
      assert.equal(h.states.length, before, 'old async completion cannot write screen state');
    });
  }
  test(`${action.name} ignores an old owner response`, async () => {
    const h = harness({ ...action, holdResponse: true });
    await start(h, action); await settle();
    assert.equal(h.calls.length, 1);
    h.cleanup(); const before = h.states.length;
    h.responseGate.resolve(); await settle();
    assert.equal(h.states.length, before);
  });
}
for (const action of actions.filter(a => a.alert)) {
  test(`${action.name} confirmation retains its original owner across a new request generation`, async () => {
    const h = harness(action);
    h[action.handler]();
    const confirm = h.alerts.at(-1)[2].find(button => button.style === 'destructive');
    h.cleanup();
    h.context.ownerRequestRef.current = { expectedUserId: 'owner-A', signal: new AbortController().signal };
    confirm.onPress(); await settle();
    assert.equal(h.calls.length, 0);
  });
}
for (const action of actions) {
  test(`${action.name} tutorial stays local without a signed-in owner`, async () => {
    const h = harness({ ...action, tutorial: true });
    h.context.user = null; h.context.ownerRequestRef.current = null;
    await start(h, action); await settle();
    assert.equal(h.calls.length, 0);
    assert.ok(h.states.some(([name]) => name === 'setSelected'));
  });
}
