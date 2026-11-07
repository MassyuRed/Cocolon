const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
const tick = async () => { for (let i = 0; i < 30; i += 1) await Promise.resolve(); };
const strip = source => source.replace(/^import\s[\s\S]*?;\r?\n/gm, '').replace(/^export\s+(?=(?:async\s+)?(?:function|const)\b)/gm, '');

// Execute the actual profile adapter and apiClient owner check. Only the
// session, fetch and native hooks are substituted; no real account/IO is used.
function transport(owner = 'A') {
  const gets = [], writes = [];
  let current = owner;
  const session = id => id ? { user: { id }, access_token: 'synthetic-' + id } : null;
  const auth = { getSession: async () => ({ data: { session: session(current) } }) };
  const response = body => ({ ok: true, status: 200, text: async () => JSON.stringify(body) });
  const fetch = async (url, options) => {
    const owner = String(options.headers.Authorization || '').replace('Bearer synthetic-', '');
    if (options.method === 'GET') {
      const pending = deferred(); gets.push({ ...pending, owner, signal: options.signal });
      return pending.promise.then(response);
    }
    const body = JSON.parse(options.body);
    writes.push({ owner, body });
    if (body.push_token === null && api.holdClear) return api.holdClear.promise.then(response);
    return response(body);
  };
  const bindings = { Platform: { OS: 'android' }, supabase: { auth }, readRuntimeApiBaseUrl: () => 'https://example.test',
    captureApiError() {}, fetch, AbortController,
    setTimeout: (fn, ms) => { const timer = setTimeout(fn, ms); timer.unref(); return timer; },
    clearTimeout, process: { env: {} } };
  const client = Function(...Object.keys(bindings), strip(read('lib/apiClient.js')) + '\nreturn {apiGet,apiPatch};')(...Object.values(bindings));
  const api = Function('apiGet', 'apiPatch', strip(read('lib/api/account/profileApi.js')) + '\nreturn {ensureAccountProfile,syncAccountProfilePushToken,clearAccountProfilePushToken};')(client.apiGet, client.apiPatch);
  return Object.assign(api, { gets, writes, auth, session, setOwner(id) { current = id; } });
}

function authProvider(owner = 'A', initialRead = null) {
  const api = transport(owner), slots = [], effects = [];
  let cursor = 0, dirty = false, authCallback, initial = true, value, nativeSignOuts = 0;
  const slot = create => { const i = cursor++; if (!(i in slots)) slots[i] = create(); return i; };
  const getSession = api.auth.getSession;
  const auth = { ...api.auth, getSession: () => {
    if (initial) { initial = false; if (initialRead) return initialRead.promise; }
    return getSession();
  }, onAuthStateChange: fn => { authCallback = fn; return { data: { subscription: { unsubscribe() {} } } }; },
  signOut: async () => { nativeSignOuts++; return { error: null }; } };
  const bindings = {
    createContext: () => ({}), useContext: () => null,
    useRef: value => slots[slot(() => ({ current: value }))],
    useState: initial => { const i = slot(() => typeof initial === 'function' ? initial() : initial); return [slots[i], next => {
      const value = typeof next === 'function' ? next(slots[i]) : next;
      if (!Object.is(value, slots[i])) { slots[i] = value; dirty = true; }
    }]; },
    useMemo: fn => fn(), useEffect: (fn, deps) => {
      const i = slot(() => null), before = slots[i];
      if (!before || deps.some((value, index) => !Object.is(value, before.deps[index]))) {
        slots[i] = { deps, cleanup: before?.cleanup };
        effects.push(() => { before?.cleanup?.(); slots[i].cleanup = fn(); });
      }
    },
    supabase: { auth }, Platform: { OS: 'android' }, AbortController,
    Linking: { getInitialURL: async () => null, addEventListener: () => ({ remove() {} }) },
    ensureAccountProfile: api.ensureAccountProfile, clearAccountProfilePushToken: api.clearAccountProfilePushToken,
    console: { warn() {}, error() {} }, process: { env: {} },
  };
  const source = strip(read('AuthContext.js')).replace(
    'return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;', 'return value;');
  assert.doesNotMatch(source, /<AuthContext\.Provider/);
  const Component = Function(...Object.keys(bindings), source + '\nreturn AuthProvider;')(...Object.values(bindings));
  const render = () => { cursor = 0; dirty = false; value = Component({ children: null }); while (effects.length) effects.shift()(); return value; };
  render();
  return { api, render, get value() { return value; }, get nativeSignOuts() { return nativeSignOuts; },
    switchTo(id) { api.setOwner(id); authCallback(id ? 'SIGNED_IN' : 'SIGNED_OUT', api.session(id)); },
    async settle() { for (let i = 0; i < 8; i += 1) { await tick(); if (dirty) render(); } },
  };
}

test('same-owner profile initialization retains its GET/PATCH and payload', async () => {
  const api = transport('A');
  const work = api.ensureAccountProfile({ displayName: 'A-name', pushPlatform: 'android', expectedUserId: 'A' });
  await tick(); api.gets[0].resolve({ display_name: null }); await work;
  assert.deepEqual(api.writes, [{ owner: 'A', body: { display_name: 'A-name', push_platform: 'android' } }]);
});

for (const next of ['B', null]) test(`late A profile GET cannot PATCH after ${next || 'signout'}`, async () => {
  const api = transport('A');
  const work = api.ensureAccountProfile({ displayName: 'A-name', pushPlatform: 'android', expectedUserId: 'A' });
  await tick(); api.setOwner(next); api.gets[0].resolve({ display_name: null });
  await assert.rejects(work, { name: 'AccountChangedError' });
  assert.equal(api.writes.length, 0);
});

test('A to B to A invalidates the first profile request even when auth events are batched', async () => {
  const p = authProvider('A'); await p.settle(); const first = p.api.gets[0];
  p.switchTo('B'); p.switchTo('A'); await p.settle();
  assert.equal(first.signal.aborted, true);
  assert.equal(p.api.gets.length, 2);
  first.resolve({ display_name: null }); await p.settle();
  assert.equal(p.api.writes.length, 0);
  p.api.gets[1].resolve({ display_name: 'current-A' }); await p.settle();
  assert.deepEqual(p.api.writes, [{ owner: 'A', body: { push_platform: 'android' } }]);
  assert.equal(p.value.user.id, 'A');
});

test('signout aborts the in-flight profile initialization', async () => {
  const p = authProvider('A'); await p.settle(); const old = p.api.gets[0];
  p.switchTo(null); old.resolve({ display_name: null }); await p.settle();
  assert.equal(old.signal.aborted, true); assert.equal(p.api.writes.length, 0);
  assert.equal(p.value.session, null);
});

for (const failed of [false, true]) test(`late initial session ${failed ? 'failure' : 'success'} cannot undo a newer auth event`, async () => {
  const initial = deferred(), p = authProvider('A', initial);
  p.switchTo('B'); await p.settle();
  if (failed) initial.reject(Error('old lookup failed'));
  else initial.resolve({ data: { session: p.api.session('A') } });
  await p.settle();
  assert.equal(p.value.user.id, 'B'); assert.equal(p.value.initializing, false);
  assert.equal(p.value.authError, '');
  assert.deepEqual(p.api.gets.map(get => get.owner), ['B']);
});

test('a delayed logout cannot sign the new owner out after clearing the old token', async () => {
  const p = authProvider('A'); await p.settle();
  p.api.gets[0].resolve({ display_name: 'A' }); await p.settle();
  p.api.holdClear = deferred(); const logout = p.value.signOut({ rethrow: true }); await tick();
  p.switchTo('B'); p.api.holdClear.resolve({}); await logout; await p.settle();
  assert.equal(p.nativeSignOuts, 0); assert.equal(p.value.user.id, 'B');
  assert.equal(p.api.writes.at(-1).owner, 'A');
});

test('A to B to A while token clearing waits cannot revive an old logout', async () => {
  const p=authProvider('A');await p.settle();p.api.gets[0].resolve({display_name:'A'});await p.settle();
  p.api.holdClear=deferred();const work=p.value.signOut({rethrow:true});await tick();
  p.switchTo('B');p.switchTo('A');p.api.holdClear.resolve({});await work;await p.settle();
  assert.equal(p.nativeSignOuts,0);assert.equal(p.value.user.id,'A');
  assert.equal(p.value.authOwnerGeneration,2);
});

for (const changed of [false, true]) test(`push-token lookup ${changed ? 'rejects a changed owner' : 'retains the same owner'}`, async () => {
  const api = transport('A'), token = deferred();
  const messaging = () => ({ getToken: () => token.promise });
  const bindings = { Platform: { OS: 'android', Version: 32 }, PermissionsAndroid: {}, messaging,
    syncAccountProfilePushToken: api.syncAccountProfilePushToken, setTimeout, console: { log() {} }, Date };
  const push = Function(...Object.keys(bindings), strip(read('lib/pushToken.js')) + '\nreturn {syncPushTokenOnce};')(...Object.values(bindings));
  const work = push.syncPushTokenOnce({ userId: 'A' }); await tick();
  if (changed) api.setOwner('B'); token.resolve('synthetic-device-token');
  if (changed) { await assert.rejects(work, { name: 'AccountChangedError' }); assert.equal(api.writes.length, 0); }
  else { assert.equal((await work).ok, true); assert.equal(api.writes[0].owner, 'A'); assert.equal(api.writes[0].body.push_token, 'synthetic-device-token'); }
});

test('old-owner push-token clearing cannot PATCH the newly authenticated owner', async () => {
  const api = transport('B');
  await assert.rejects(api.clearAccountProfilePushToken({ expectedUserId: 'A' }), { name: 'AccountChangedError' });
  assert.equal(api.writes.length, 0);
});

test('a completed old-owner deletion cannot sign out the new owner', async () => {
  const p=authProvider('A'); await p.settle(); p.switchTo('B'); await p.settle();
  await p.value.signOut({skipPushTokenClear:true,rethrow:true,expectedUserId:'A'});
  assert.equal(p.nativeSignOuts,0); assert.equal(p.value.user.id,'B');
});

test('same-owner explicit logout still calls native signOut', async () => {
  const p=authProvider('A'); await p.settle();
  await p.value.signOut({skipPushTokenClear:true,rethrow:true,expectedUserId:'A'});
  assert.equal(p.nativeSignOuts,1);
});
