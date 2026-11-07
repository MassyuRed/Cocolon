const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const deferred = () => { let resolve; const promise = new Promise(a => { resolve = a; }); return { promise, resolve }; };
const tick = async () => { for (let i = 0; i < 30; i++) await Promise.resolve(); };
const strip = source => source.replace(/^import\s[\s\S]*?;\r?\n/gm, '').replace(/^export\s+(?:default\s+)?(?=(?:async\s+)?(?:function|const)\b)/gm, '');

function harness(file, exportName, args = {}) {
  let owner = 'A', generation = 0, cursor = 0, dirty = false, value, sessionWait = null, writeWait = null;
  const slots = [], effects = [], gets = [], writes = [], alerts = [], signouts = [], users = new Map();
  const currentUser = () => { if (!owner) return null; if (!users.has(owner)) users.set(owner, {id:owner}); return users.get(owner); };
  const slot = fn => { const i = cursor++; if (!(i in slots)) slots[i] = fn(); return i; };
  const response = body => ({ ok: true, status: 200, text: async () => JSON.stringify(body), json: async () => body });
  const auth = { getSession: async () => {
    if (sessionWait) await sessionWait.promise;
    return { data: { session: owner ? { user: { id: owner }, access_token: 'synthetic-' + owner } : null } };
  } };
  const fetch = async (url, opts) => {
    if (opts.signal?.aborted) throw Object.assign(new Error('cancelled'), { name: 'AbortError' });
    const target = String(opts.headers.Authorization || '').replace('Bearer synthetic-', '');
    if (opts.method === 'GET') {
      const pending = deferred(); gets.push({ ...pending, url, owner: target, signal: opts.signal });
      return pending.promise.then(response);
    }
    const body = JSON.parse(opts.body); writes.push({ url, owner: target, body });
    if (writeWait) await writeWait.promise;
    return response(body);
  };
  const cb = { Platform: { OS: 'android' }, supabase: { auth }, readRuntimeApiBaseUrl: () => 'https://example.test', captureApiError() {},
    fetch, AbortController, setTimeout: (fn, ms) => { const t = setTimeout(fn, ms); t.unref(); return t; }, clearTimeout, process: { env: {} } };
  const client = Function(...Object.keys(cb), strip(read('lib/apiClient.js')) + '\nreturn {apiGet,apiPatch,apiPost,apiFetch};')(...Object.values(cb));
  const model = Function(strip(read('screens/account/accountModel.js')) + '\nreturn {normalizeDisplayName,DISPLAY_NAME_MAX_LENGTH,DISPLAY_NAME_TAKEN_MESSAGE,mapDisplayNameConflictMessage,readAccountStatusValue};')();
  const settings = Function('apiGet','apiPatch',strip(read('lib/reportDistributionApi.js'))+'\nreturn {getReportDistributionSettings,patchReportDistributionSettings};')(client.apiGet,client.apiPatch);
  const today = Function('apiGet','apiPatch','apiPost',strip(read('lib/api/home/todayQuestionApi.js'))+'\nreturn {getTodayQuestionSettings,patchTodayQuestionSettings,resolveLocalTimezoneName};')(client.apiGet,client.apiPatch,client.apiPost);
  const bindings = { ...client, ...model, ...settings, ...today, AbortController,
    useAuth: () => ({ user: currentUser(), authOwnerGeneration: generation, authLoading: false, signOut: async opts => signouts.push(opts) }),
    useTheme: () => ({ colors: {}, themeName: 'default' }), useAnalysisMenuStyles: () => ({ ui: {} }),
    createLocalStyles: () => ({}), THEME_VARIANTS: {},
    useUnread: () => ({ setUnread() {} }), useTutorial: () => ({}), useAppRuntime: () => ({ isFeatureEnabled: () => true }),
    clearDeletedAccountLocalState: async () => {}, EMOTION_NOTIFICATION_GLOBAL_OWNER_ID: 'global',
    resolveEmotionNotificationEnabled: () => true,
    ACCOUNT_WIRE: { routes: { visibilityMe: '/account/visibility/me', status: '/account/status' } }, FOLLOW_WIRE: { routes: { create: '/follow/create', delete: '/follow/delete' } },
    buildFollowStatsPath: id => '/follow/stats/' + id,
    readShareCode: value => value?.share_code, readConnectCode: value => value?.connect_code,
    readShareCodePublic: (value, fallback) => value?.is_share_code_public ?? fallback,
    Alert: { alert: (...args) => alerts.push(args) }, Share: { share: async () => {} }, console: { warn() {}, error() {} },
    useRef: initial => slots[slot(() => ({ current: initial }))],
    useState: initial => { const i = slot(() => typeof initial === 'function' ? initial() : initial); return [slots[i], next => {
      const v = typeof next === 'function' ? next(slots[i]) : next;
      if (!Object.is(v, slots[i])) { slots[i] = v; dirty = true; }
    }]; }, useMemo: fn => fn(), useEffect: (fn, deps) => {
      const i = slot(() => null), before = slots[i];
      if (!before || deps.some((v,j) => !Object.is(v,before.deps[j]))) { slots[i] = { deps }; effects.push(() => { before?.cleanup?.(); slots[i].cleanup = fn(); }); }
    },
  };
  let source = read(file);
  if (exportName.startsWith('Settings')) {
    source = source.slice(source.indexOf('export default function ' + exportName));
    source = source.slice(0, source.indexOf('  return (\n    <AnalysisMenuScroll>')) +
      (exportName === 'SettingsAppSettingsScreen' ? 'return {updatePushEnabled,updateTodayQuestionNotificationEnabled,updateReportDistributionNotificationEnabled,updateEmotionNotificationEnabled};\n}' : 'return {handleDeleteAccount,executeDeleteAccount};\n}');
  }
  const Component = Function(...Object.keys(bindings), strip(source) + '\nreturn ' + exportName + ';')(...Object.values(bindings));
  const render = () => { cursor = 0; dirty = false; value = Component({ user: currentUser(), targetUserId: owner, isSelf: true, navigation: {}, ...args }); while (effects.length) effects.shift()(); return value; };
  render();
  return { gets, writes, alerts, signouts, render, get value() { return value; },
    holdSession() { sessionWait = deferred(); return sessionWait; },
    holdWrite() { writeWait = deferred(); return writeWait; },
    switchTo(id) { if (owner !== id) generation++; owner = id; render(); },
    async settle() { for (let i = 0; i < 8; i++) { await tick(); if (dirty) render(); } },
    async resolveAllGets(body = {}) { for (const req of gets) req.resolve(body); await this.settle(); },
  };
}

for (const next of ['B', null]) test(`name availability response cannot write after A to ${next || 'logout'}`, async () => {
  const p = harness('screens/account/useAccountProfile.js','useAccountProfile'); await p.settle(); await p.resolveAllGets({ display_name: 'A-name' });
  p.value.openNameEdit(); p.render(); p.value.setNameDraft('edited-A'); p.render();
  const work = p.value.saveDisplayName(); await p.settle(); const old = p.gets.at(-1);
  p.switchTo(next); old.resolve({ available: true }); await work; await p.settle();
  assert.equal(p.writes.length, 0); assert.equal(p.value.nameEditOpen, false);
});

test('same-owner name edit uses the account profile as its canonical display name', async () => {
  const p = harness('screens/account/useAccountProfile.js','useAccountProfile'); await p.settle(); await p.resolveAllGets({ display_name: 'A-name' });
  p.value.openNameEdit(); p.render(); p.value.setNameDraft('edited-A'); p.render(); const work = p.value.saveDisplayName();
  await p.settle(); p.gets.at(-1).resolve({ available: true }); await work; await p.settle();
  assert.deepEqual(p.writes.map(x => ({owner:x.owner,body:x.body})), [{ owner:'A', body:{display_name:'edited-A'} }]);
  assert.equal(p.value.displayName,'edited-A');
});

for (const hook of ['useAccountVisibility','useAccountFollowState']) {
  for (const next of ['B',null]) test(`${hook} delayed auth cannot mutate ${next || 'logout'}`, async () => {
    const p = harness('screens/account/'+hook+'.js',hook, hook.endsWith('FollowState') ? {targetUserId:'C',connectCode:'C-code'} : {});
    await p.settle(); await p.resolveAllGets({});
    const held = p.holdSession();
    const work = hook.endsWith('Visibility') ? p.value.patchAccountVisibilityMe({is_private_account:true}) : p.value.onToggleFollow();
    await tick(); p.switchTo(next); held.resolve(); await work; await p.settle();
    assert.equal(p.writes.length,0);
  });
}

test('notification all-off cannot cascade from A into B after the first pending request', async () => {
  const p = harness('screens/SettingsAppSettingsScreen.js','SettingsAppSettingsScreen'); await p.settle(); await p.resolveAllGets({});
  const held = p.holdSession(), work = p.value.updatePushEnabled(false); await tick(); p.switchTo('B'); held.resolve(); await work; await p.settle();
  assert.equal(p.writes.length,0);
});

test('same-owner notification all-off retains all four settings writes', async () => {
  const p = harness('screens/SettingsAppSettingsScreen.js','SettingsAppSettingsScreen'); await p.settle(); await p.resolveAllGets({});
  await p.value.updatePushEnabled(false); await p.settle();
  assert.equal(p.writes.length,4); assert.deepEqual(p.writes.map(x => x.owner),['A','A','A','A']);
});

test('notification all-off stops after its A profile response when B is active', async () => {
  const p = harness('screens/SettingsAppSettingsScreen.js','SettingsAppSettingsScreen'); await p.settle(); await p.resolveAllGets({});
  const held = p.holdWrite(), work = p.value.updatePushEnabled(false); await tick();
  assert.equal(p.writes.length,1); assert.equal(p.writes[0].owner,'A');
  p.switchTo('B'); held.resolve(); await work; await p.settle();
  assert.equal(p.writes.length,1);
});

test('normal visibility read and edit retain their existing boolean fields', async () => {
  const p = harness('screens/account/useAccountVisibility.js','useAccountVisibility'); await p.settle();
  await p.resolveAllGets({is_private_account:false,is_share_code_public:true,is_recommendation_enabled:true,is_ranking_visible:true});
  await p.value.patchAccountVisibilityMe({is_private_account:true,is_recommendation_enabled:false}); await p.settle();
  assert.equal(p.value.accountVisibility.is_private_account,true);
  assert.equal(p.value.accountVisibility.is_share_code_public,true);
  assert.equal(p.writes[0].owner,'A');
  assert.deepEqual(p.writes[0].body,{is_private_account:true,is_recommendation_enabled:false});
});

test('normal follow state keeps both counts and sends the selected connect code', async () => {
  const p = harness('screens/account/useAccountFollowState.js','useAccountFollowState',{targetUserId:'C',connectCode:'C-code'}); await p.settle();
  await p.resolveAllGets({following_count:2,follower_count:4,is_following:false});
  assert.equal(p.value.followingCount,2); assert.equal(p.value.followerCount,4);
  const work=p.value.onToggleFollow(); await p.settle();
  p.gets.at(-1).resolve({following_count:3,follower_count:4,is_following:true}); await work; await p.settle();
  assert.equal(p.value.isFollowing,true); assert.equal(p.value.followingCount,3);
  assert.equal(p.writes[0].owner,'A'); assert.deepEqual(p.writes[0].body,{connect_code:'C-code'});
});

test('account deletion binds its API mutation and later signout to the confirmed owner', async () => {
  const p = harness('screens/SettingsOtherScreen.js','SettingsOtherScreen');
  await p.value.executeDeleteAccount(); await p.settle();
  assert.equal(p.writes[0].owner,'A'); assert.equal(p.writes[0].url,'https://example.test/account/delete');
  assert.equal(p.signouts[0].expectedUserId,'A');
});

test('delayed account deletion authentication cannot delete B', async () => {
  const p = harness('screens/SettingsOtherScreen.js','SettingsOtherScreen'); const held = p.holdSession(), work = p.value.executeDeleteAccount();
  await tick(); p.switchTo('B'); held.resolve(); await work; await p.settle();
  assert.equal(p.writes.length,0); assert.equal(p.signouts.length,0);
});
