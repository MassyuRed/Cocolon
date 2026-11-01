const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
const flush = async () => { for (let i = 0; i < 12; i += 1) await Promise.resolve(); };

// Run the real provider with deterministic hook/store/network doubles. No
// second implementation of the owner or asynchronous request logic is used.
function provider(initialOwner = null, initialReader = null) {
  const slots = [], effects = [], timers = [], requests = [];
  let cursor = 0, session = initialOwner ? { user: { id: initialOwner }, access_token: 'synthetic-' + initialOwner } : null, auth, sessionRead = initialReader;
  const slot = initial => { const i = cursor++; if (!(i in slots)) slots[i] = initial(); return i; };
  const bindings = {
    createContext: () => ({}), useContext: () => null,
    useRef: value => slots[slot(() => ({ current: value }))],
    useState: value => { const i = slot(() => typeof value === 'function' ? value() : value); return [slots[i], next => { slots[i] = typeof next === 'function' ? next(slots[i]) : next; }]; },
    useCallback: fn => fn, useMemo: fn => fn(),
    useEffect: fn => { slot(() => { effects.push(fn); return true; }); },
    AppState: { addEventListener: () => ({ remove() {} }) },
    supabase: { auth: { getSession: () => sessionRead ? sessionRead() : Promise.resolve({ data: { session } }), onAuthStateChange: fn => { auth = fn; return { data: { subscription: { unsubscribe() {} } } }; } } },
    buildFallbackSubscriptionBootstrap: () => ({}), clearSubscriptionRuntimeCatalog() {}, hydrateSubscriptionRuntimeCatalog: x => x,
    getSubscriptionBootstrap: async () => ({}),
    getSubscriptionMe: opts => { const d = deferred(); requests.push({ ...d, opts }); return d.promise; },
    readAllowedSelfStructureModes: json => json.modes || [],
    setTimeout: fn => { timers.push(fn); return timers.length; },
  };
  let source = fs.readFileSync(path.join(__dirname, '../SubscriptionContext.js'), 'utf8')
    .replace(/^import\s[\s\S]*?;\r?\n/gm, '')
    .replace(/^export\s+(?=function\b)/gm, '')
    .replace('return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;', 'return value;');
  assert.doesNotMatch(source, /<SubscriptionContext\.Provider|^\s*(?:import|export)\s/m);
  const Component = Function(...Object.keys(bindings), source + '\nreturn SubscriptionProvider;')(...Object.values(bindings));
  const render = () => { cursor = 0; return Component({ children: null }); };
  const switchTo = id => { session = id ? { user: { id }, access_token: 'synthetic-' + id } : null; auth('SIGNED_IN', session); };
  render(); effects.forEach(fn => fn());
  return { render, requests, switchTo, timers, setSessionReader: fn => { sessionRead = fn; }, async drain() { while (timers.length) timers.shift()(); await flush(); } };
}

const paid = { subscription_tier: 'premium', plan_code: 'premium', entitlement_status: 'active', expires_at: '2030-01-01', auto_renew: true, store: 'ios', product_id: 'test-premium', modes: ['deep'] };

test('initial session discovery permits the authenticated paid owner', async () => {
  const p = provider('A');
  const allowed = p.render().ensurePaid();
  const premium = p.render().ensurePremium();
  await flush();
  assert.equal(p.requests.length, 1);
  assert.equal(p.requests[0].opts.expectedUserId, 'A');
  p.requests[0].resolve(paid);
  assert.equal(await allowed, true);
  assert.equal(await premium, true);
});

for (const lateFailure of [false, true]) {
  test(`old owner ${lateFailure ? 'failure' : 'success'} cannot affect new owner`, async () => {
    const p = provider(); await flush(); p.switchTo('A'); await p.drain();
    const a = p.requests[0]; assert.equal(a.opts.expectedUserId, 'A');
    const oldPaid = p.render().ensurePaid(); await flush();
    p.switchTo('B'); await p.drain(); const b = p.requests[1];
    assert.equal(b.opts.expectedUserId, 'B');
    if (lateFailure) a.reject(new Error('old network failure')); else a.resolve(paid);
    await flush(); assert.equal(await oldPaid, false);
    assert.equal(p.render().loading, true); // A's finally cannot clear B's load.
    assert.equal(p.render().isPaid, false);
    b.resolve({ subscription_tier: 'plus', plan_code: 'plus', modes: ['standard'] }); await flush();
    assert.equal(p.render().tier, 'plus'); assert.deepEqual(p.render().allowedSelfStructureModes, ['standard']);
    assert.equal(p.render().loading, false);
  });
}

test('logout clears all previous owner entitlement fields and rejects late paid results', async () => {
  const p = provider(); await flush(); p.switchTo('A'); await p.drain(); p.requests[0].resolve(paid); await flush();
  assert.equal(p.render().tier, 'premium');
  const result = p.render().refreshTier({ force: true }); await flush();
  const stale = p.requests[1]; p.switchTo(null); stale.resolve(paid); await flush();
  assert.equal(await result, 'free');
  const value = p.render();
  for (const name of ['planCode', 'expiresAt', 'store', 'productId']) assert.equal(value[name], null);
  assert.equal(value.tier, 'free'); assert.equal(value.autoRenew, false); assert.equal(value.entitlementStatus, 'none'); assert.deepEqual(value.allowedSelfStructureModes, []);
});

test('A to B to A invalidates the first A generation and retains current coalescing/TTL', async () => {
  const p = provider(); await flush(); p.switchTo('A'); await p.drain(); const firstA = p.requests[0];
  p.switchTo('B'); await p.drain(); const b = p.requests[1];
  p.switchTo('A'); await p.drain(); const currentA = p.requests[2];
  const coalesced = p.render().refreshTier({ force: true }); await flush(); assert.equal(p.requests.length, 3);
  firstA.resolve(paid); b.resolve(paid); await flush(); assert.equal(p.render().isPaid, false); assert.equal(p.render().loading, true);
  currentA.resolve({ subscription_tier: 'plus' }); await flush(); assert.equal(await coalesced, 'plus');
  assert.equal(await p.render().refreshTier(), 'plus'); assert.equal(p.requests.length, 3);
});

test('auth switch during getSession cannot start an old request', async () => {
  const p = provider(); await flush(); p.switchTo('A'); await p.drain();
  p.requests[0].resolve({ subscription_tier: 'free' }); await flush();
  const d = deferred(); p.setSessionReader(() => d.promise);
  const old = p.render().refreshTier({ force: true }); p.switchTo('B');
  d.resolve({ data: { session: { user: { id: 'A' }, access_token: 'synthetic-A' } } }); await flush();
  assert.equal(await old, 'free'); assert.equal(p.requests.length, 1);
});

test('cached ensurePaid result is invalidated by an intervening logout', async () => {
  const p = provider(); await flush(); p.switchTo('A'); await p.drain(); p.requests[0].resolve(paid); await flush();
  const old = p.render().ensurePaid(); p.switchTo(null); assert.equal(await old, false);
});

test('initial auth lookup failure settles unknown subscription state for startup fallback', async () => {
  const p = provider('A', () => Promise.reject(Error('offline')));
  await flush();
  assert.equal(p.render().tier, 'free');
  assert.equal(p.render().isPaid, false);
  assert.equal(p.requests.length, 0);
});
