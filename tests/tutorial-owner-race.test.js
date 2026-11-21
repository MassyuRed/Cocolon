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
  const api = Function('apiGet', 'apiPatch', strip(read('lib/api/account/profileApi.js')) + '\nreturn {getAccountProfileMe,patchAccountProfileMe};')(client.apiGet, client.apiPatch);
  return Object.assign(api, { gets, writes, auth, session, setOwner(id) { current = id; } });
}


function tutorialProvider(owner = 'A') {
  const api = transport(owner), slots = [], effects = [], local = new Map();
  let current = owner, generation = 0, cursor = 0, dirty = false, value, heldReads = null, heldWrites = null;
  const slot = create => { const i = cursor++; if (!(i in slots)) slots[i] = create(); return i; };
  const bindings = {
    createContext: () => ({}), useContext: () => null, useCallback: fn => fn(),
    useRef: value => slots[slot(() => ({ current: value }))],
    useState: initial => { const i = slot(() => typeof initial === 'function' ? initial() : initial); return [slots[i], next => {
      const value = typeof next === 'function' ? next(slots[i]) : next;
      if (!Object.is(value, slots[i])) { slots[i] = value; dirty = true; }
    }]; },
    useMemo: fn => fn(), useEffect: (fn, deps) => {
      const i = slot(() => null), before = slots[i];
      if (!before || deps.some((v, j) => !Object.is(v, before.deps[j]))) {
        slots[i] = { deps, cleanup: before?.cleanup };
        effects.push(() => { before?.cleanup?.(); slots[i].cleanup = fn(); });
      }
    },
    useAuth: () => ({ session: api.session(current), recoveryMode: false, authOwnerGeneration: generation }),
    AsyncStorage: { getItem: async key => { if (heldReads) await heldReads.promise; return local.get(key) || null; },
      setItem: async (key, value) => { if (heldWrites) await heldWrites.promise; local.set(key, value); } },
    getAccountProfileMe: api.getAccountProfileMe, patchAccountProfileMe: api.patchAccountProfileMe,
    TUTORIAL_HAS_VALID_FIXTURES: true, TUTORIAL_PIECES: [], AbortController, Date,
    console: { warn() {} },
  };
  // Hook identities are stable in React. Cache callbacks by dependency to keep
  // this small hook renderer faithful to owner-effect lifetimes.
  bindings.useCallback = (fn, deps) => {
    const i = slot(() => null), before = slots[i];
    if (!before || deps.some((v, j) => !Object.is(v, before.deps[j]))) slots[i] = { deps, fn };
    return slots[i].fn;
  };
  const source = strip(read('TutorialContext.js')).replace(/return\s*\(\s*<TutorialContext\.Provider[\s\S]*?<\/TutorialContext\.Provider>\s*\);/, 'return value;');
  assert.doesNotMatch(source, /<TutorialContext\.Provider/);
  const Component = Function(...Object.keys(bindings), source + '\nreturn TutorialProvider;')(...Object.values(bindings));
  const render = () => { cursor = 0; dirty = false; value = Component({ children: null }); while (effects.length) effects.shift()(); return value; };
  return { api, render, local, get value() { return value; },
    switchTo(id) { if (current !== id) generation++; current = id; api.setOwner(id); },
    holdReads() { heldReads = deferred(); return heldReads; }, holdWrites() { heldWrites = deferred(); return heldWrites; },
    async settle() { for (let i = 0; i < 8; i++) { await tick(); if (dirty) render(); } },
  };
}

for (const next of ['B', null]) test(`tutorial late local A flags cannot read or write ${next || 'signed-out session'}`, async () => {
  const p = tutorialProvider('A'), held = p.holdReads();
  p.local.set('cocolon:tutorialCompleted:A', 'true'); p.render();
  p.switchTo(next); p.render(); held.resolve(); await p.settle();
  assert.deepEqual(p.api.gets.map(x => x.owner), next ? ['B'] : []);
  if (next) { p.api.gets[0].resolve({ tutorial_completed: false, tutorial_skipped: false }); await p.settle(); }
  assert.equal(p.api.writes.length, 0); assert.equal(p.value.tutorialCompleted, false);
});

test('tutorial A to B to A invalidates an older profile read', async () => {
  const p = tutorialProvider('A'); p.local.set('cocolon:tutorialCompleted:A', 'true'); p.render(); await p.settle();
  const old = p.api.gets[0];
  p.switchTo('B'); p.switchTo('A'); p.render(); await p.settle();
  assert.equal(old.signal.aborted, true);
  old.resolve({ tutorial_completed: false }); await p.settle();
  assert.equal(p.api.writes.length, 0);
  p.api.gets[1].resolve({ tutorial_completed: false }); await p.settle();
  assert.deepEqual(p.api.writes.map(x => x.owner), ['A']); assert.equal(p.value.tutorialCompleted, true);
});

for (const action of ['endTutorial', 'skipTutorial']) {
  test(`${action} persists normal owner and keeps completion semantics`, async () => {
    const p = tutorialProvider('A'); p.render(); await p.settle();
    p.api.gets[0].resolve({ tutorial_completed: false }); await p.settle();
    await p.value[action](); await p.settle();
    assert.equal(p.api.writes.length, 1); assert.equal(p.api.writes[0].owner, 'A');
    const completed = action === 'endTutorial';
    assert.equal(p.api.writes[0].body.tutorial_completed, completed);
    assert.equal(p.api.writes[0].body.tutorial_skipped, !completed);
    assert.equal(p.value.tutorialCompleted, completed); assert.equal(p.value.tutorialSkipped, !completed);
  });
  for (const next of ['B', null]) test(`${action} delayed A storage cannot patch ${next || 'signed-out session'}`, async () => {
    const p = tutorialProvider('A'); p.render(); await p.settle();
    p.api.gets[0].resolve({ tutorial_completed: false }); await p.settle();
    const held = p.holdWrites(), work = p.value[action](); await tick();
    p.switchTo(next); p.render(); held.resolve(); await work; await p.settle();
    if (next) { p.api.gets.at(-1).resolve({ tutorial_completed: false }); await p.settle(); }
    assert.equal(p.api.writes.length, 0); assert.equal(p.value.tutorialCompleted, false); assert.equal(p.value.tutorialSkipped, false);
  });
}
