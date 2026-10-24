'use strict';

// Actual AppRuntimeContext + B14-B source. React hooks/JSX linkage and the
// /app/bootstrap transport are explicit test doubles, not a native/HTTP test.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ROOT = path.resolve(__dirname, '..');
const FLAGS = [
  'piece_v2_preview_enabled', 'piece_v2_save_enabled', 'piece_v2_owner_read_enabled',
  'piece_v2_public_write_enabled', 'piece_v2_public_read_enabled',
  'piece_v2_visibility_toggle_enabled', 'piece_v2_export_enabled', 'piece_v2_delete_enabled',
];
const PREVIEW = FLAGS[0];
const all = value => Object.fromEntries(FLAGS.map(name => [name, value]));
const clone = value => JSON.parse(JSON.stringify(value));
function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

function harness(initialAppState = 'active') {
  const pending = [], hooks = [], effects = [], appListeners = new Set();
  let stateWrites = 0;
  const authListeners = new Set(), authTimers = new Map();
  let nextTimer = 0, insideAuthCallback = false;
  const supabase = { auth: { onAuthStateChange: callback => {
    authListeners.add(callback);
    return { data: { subscription: { unsubscribe: () => authListeners.delete(callback) } } };
  } } };
  const setTimeout = (callback, delay) => {
    assert.equal(delay, 0, 'only a deferred auth notification, never polling');
    const id = ++nextTimer; authTimers.set(id, callback); return id;
  };
  const clearTimeout = id => authTimers.delete(id);
  const AppState = {
    currentState: initialAppState,
    addEventListener: (name, listener) => {
      assert.equal(name, 'change');
      appListeners.add(listener);
      return { remove: () => appListeners.delete(listener) };
    },
  };
  let cursor = 0, contextDefault;
  const React = {
    createContext: value => { contextDefault = value; return { Provider: 'RuntimeProvider' }; },
    createElement: (type, props, ...children) => ({ type, props, children }),
    useContext: () => contextDefault,
    useState: initial => {
      const index = cursor++;
      if (!hooks[index]) hooks[index] = { value: initial };
      return [hooks[index].value, update => {
        stateWrites += 1;
        hooks[index].value = typeof update === 'function' ? update(hooks[index].value) : update;
      }];
    },
    useEffect: (factory, deps) => {
      const index = cursor++;
      if (!hooks[index] || !deps.every((v, n) => Object.is(v, hooks[index].deps[n]))) {
        const previous = hooks[index];
        hooks[index] = { factory, deps, cleanup: previous?.cleanup };
        effects.push(() => {
          hooks[index].cleanup?.();
          hooks[index].cleanup = factory();
        });
      }
    },
    useRef: initial => {
      const index = cursor++;
      if (!hooks[index]) hooks[index] = { current: initial };
      return hooks[index];
    },
    useMemo: (factory, deps) => {
      const index = cursor++;
      if (!hooks[index] || !deps.every((v, n) => Object.is(v, hooks[index].deps[n]))) {
        hooks[index] = { value: factory(), deps };
      }
      return hooks[index].value;
    },
  };
  React.useCallback = (fn, deps) => React.useMemo(() => fn, deps);
  const context = vm.createContext({ ...React, React, AppState, supabase, setTimeout, clearTimeout,
    process: { env: { EXPO_PUBLIC_APP_VERSION: '1.0.0', EXPO_PUBLIC_APP_BUILD: '100' } },
    apiGet: async (url, options) => {
      assert.equal(insideAuthCallback, false, 'bootstrap runs after the auth callback returns');
      assert.equal(url, '/app/bootstrap'); assert.equal(options.auth, false);
      const d = deferred(); pending.push(d); return d.promise;
    },
  });
  const piecePath = path.join(ROOT, 'features/piece/pieceRuntime.js');
  if (fs.existsSync(piecePath)) {
    const piece = fs.readFileSync(piecePath, 'utf8');
    vm.runInContext(piece.replace(/^export /gm, '') +
      '\nglobalThis.piece = { PIECE_FEATURE_FLAGS, PIECE_FEATURE_DEFAULTS, normalizePieceFeatureFlags, isPieceFeatureEnabled, isPieceFeatureFlag, withoutPieceFeatureFlags };', context);
  }
  let source = fs.readFileSync(path.join(ROOT, 'AppRuntimeContext.js'), 'utf8');
  const jsx = 'return (\n    <AppRuntimeContext.Provider value={value}>\n      {children}\n    </AppRuntimeContext.Provider>\n  );';
  assert.equal(source.split(jsx).length, 2, 'only JSX syntax linkage is replaced');
  source = source.replace(/^import .*;$/gm, '').replace(/^export /gm, '')
    .replace(jsx, 'return React.createElement(AppRuntimeContext.Provider, {value}, children);');
  vm.runInContext(source + '\nglobalThis.runtimeProvider = AppRuntimeProvider;', context);
  function render() { cursor = 0; return context.runtimeProvider({ children: 'same-child' }).props.value; }
  function flushEffects() { while (effects.length) effects.shift()(); }
  function emit(next) {
    AppState.currentState = next;
    for (const listener of [...appListeners]) listener(next);
  }
  function cleanupEffects() {
    for (const hook of hooks) {
      if (hook?.factory) { hook.cleanup?.(); hook.cleanup = undefined; }
    }
  }
  function setupEffectsAgain() {
    for (const hook of hooks) if (hook?.factory) hook.cleanup = hook.factory();
  }
  return { render, pending, piece: context.piece, contextDefault: () => contextDefault,
    flushEffects, emit, cleanupEffects, setupEffectsAgain, AppState, appListeners,
    stateWrites: () => stateWrites, authListeners, authTimers,
    emitAuth: (event, session = { user: { id: 'synthetic-owner' }, access_token: 'PRIVATE_SYNTHETIC' }) => {
      insideAuthCallback = true;
      try {
        for (const callback of [...authListeners]) assert.equal(callback(event, session), undefined);
      } finally { insideAuthCallback = false; }
    },
    flushAuthTimers: () => {
      for (const [id, callback] of [...authTimers]) {
        if (authTimers.delete(id)) callback();
      }
    } };

}

for (const flag of FLAGS) {
  test(`${flag}: initial/default context is OFF, even with generic true fallback`, () => {
    const h = harness(); const r = h.render();
    assert.equal(r.featureFlags[flag], false);
    assert.equal(r.isFeatureEnabled(flag), false);
    assert.equal(r.isFeatureEnabled(flag, true), false);
    assert.equal(h.contextDefault().isFeatureEnabled(flag, true), false);
    assert.equal(h.pending.length, 0);
  });
}

test('exact server true is projected for the eight defined names, never for a future Piece name', async () => {
  const h = harness(), promise = h.render().refreshAppRuntime();
  h.pending[0].resolve({ feature_flags: { ...all(true), piece_v2_future_enabled: true } });
  await promise;
  const r = h.render();
  for (const flag of FLAGS) assert.equal(r.isFeatureEnabled(flag, false), true);
  assert.equal(r.isFeatureEnabled('piece_v2_future_enabled', true), false);
  assert.equal(r.featureFlags.piece_v2_future_enabled, undefined);
  assert.equal(h.contextDefault().isFeatureEnabled('piece_v2_future_enabled', true), false);
});

for (const raw of [undefined, null, true, 'true', [], { [PREVIEW]: 'true' }, { [PREVIEW]: 1 }]) {
  test(`malformed/missing bootstrap flag map stays OFF: ${JSON.stringify(raw)}`, async () => {
    const h = harness(); const p = h.render().refreshAppRuntime();
    h.pending[0].resolve({ feature_flags: raw }); await p;
    assert.deepEqual(clone(h.render().featureFlags), {
      ...all(false), account_delete_enabled: true, emlis_threads_enabled: false,
      myweb_mock_enabled: false, today_question_enabled: true,
      today_question_history_enabled: true, subscription_sales_enabled: true,
    });
  });
}

test('Piece names are not normalized from aliases or inherited authority', async () => {
  const h = harness(); const p = h.render().refreshAppRuntime();
  const raw = Object.assign(Object.create({ [PREVIEW]: true }), { [' ' + FLAGS[1] + ' ']: true });
  h.pending[0].resolve({ feature_flags: raw }); await p;
  for (const name of FLAGS) assert.equal(h.render().isFeatureEnabled(name, true), false);
});

test('rechecking and failure remove cached Piece true while retaining unrelated configuration', async () => {
  const h = harness();
  let r = h.render(), p = r.refreshAppRuntime();
  h.pending[0].resolve({ feature_flags: { ...all(true), subscription_sales_enabled: false, today_question_enabled: false },
    minimum_supported_version: '0.9.0', recommended_version: '1.1.0', maintenance_message: 'existing notice' });
  await p; r = h.render(); assert.equal(r.isFeatureEnabled(PREVIEW), true);
  p = r.refreshAppRuntime(); const error = new Error('synthetic bootstrap failure');
  r = h.render();
  assert.equal(r.runtime.loading, true);
  for (const flag of FLAGS) { assert.equal(r.isFeatureEnabled(flag), false); assert.equal(r.featureFlags[flag], false); }
  assert.equal(r.isFeatureEnabled('subscription_sales_enabled'), false);
  assert.equal(r.runtime.maintenanceMessage, 'existing notice');
  assert.equal(r.runtime.versionStatus.recommendedOutdated, true);
  h.pending[1].reject(error); await assert.rejects(p, e => e === error);
  r = h.render(); assert.equal(r.runtime.error, error); assert.equal(r.runtime.loading, false);
  for (const flag of FLAGS) { assert.equal(r.isFeatureEnabled(flag, true), false); assert.equal(r.featureFlags[flag], false); }
  assert.equal(r.isFeatureEnabled('today_question_enabled'), false);
  assert.equal(r.isFeatureEnabled('unknown_non_piece_feature', true), true);
});

test('only a subsequent successful bootstrap can restore Piece presentation', async () => {
  const h = harness(); let p = h.render().refreshAppRuntime();
  h.pending[0].reject(new Error('failure')); await assert.rejects(p);
  p = h.render().refreshAppRuntime(); h.pending[1].resolve({ feature_flags: all(true) });
  await p; const r = h.render();
  assert.equal(r.runtime.error, null); assert.equal(r.isFeatureEnabled(PREVIEW), true);
  const next = r.refreshAppRuntime(); h.pending[2].resolve({ feature_flags: {} }); await next;
  assert.equal(h.render().isFeatureEnabled(PREVIEW, true), false);
});

for (const newer of ['pending', 'off', 'failed']) {
  test(`an older successful true response cannot override newer ${newer}`, async () => {
    const h = harness(); const older = h.render().refreshAppRuntime();
    const latest = h.render().refreshAppRuntime();
    if (newer === 'off') { h.pending[1].resolve({ feature_flags: all(false) }); await latest; }
    if (newer === 'failed') { h.pending[1].reject(new Error('latest failure')); await assert.rejects(latest); }
    h.pending[0].resolve({ feature_flags: all(true), maintenance_message: 'stale notice' });
    const settled = await older; const r = h.render();
    assert.equal(r.isFeatureEnabled(PREVIEW, true), false);
    assert.equal(settled.featureFlags[PREVIEW], false, 'do not return a stale true to a promise caller');
    assert.notEqual(r.runtime.maintenanceMessage, 'stale notice');
    if (newer === 'pending') { assert.equal(r.runtime.loading, true); h.pending[1].resolve({ feature_flags: all(false) }); await latest; }
  });
}

test('obsolete failure rejects its caller but does not overwrite the latest successful runtime', async () => {
  const h = harness(); const older = h.render().refreshAppRuntime(), latest = h.render().refreshAppRuntime();
  h.pending[1].resolve({ feature_flags: all(true), maintenance_message: 'latest notice' }); await latest;
  h.pending[0].reject(new Error('obsolete failure')); await assert.rejects(older);
  const r = h.render(); assert.equal(r.runtime.error, null); assert.equal(r.isFeatureEnabled(PREVIEW), true);
  assert.equal(r.runtime.maintenanceMessage, 'latest notice');
});

test('pure projection only accepts a successfully loaded boolean, without computing server readiness', () => {
  const h = harness(); assert.ok(h.piece, 'B14-B runtime owner exists');
  const ready = { loaded: true, loading: false, error: null, featureFlags: all(true) };
  for (const delta of [{ loaded: false }, { loaded: 1 }, { loading: true }, { loading: undefined },
    { error: new Error('failure') }, { error: undefined }, { featureFlags: all('true') }]) {
    assert.equal(h.piece.isPieceFeatureEnabled(PREVIEW, { ...ready, ...delta }), false);
  }
  assert.equal(h.piece.isPieceFeatureEnabled(PREVIEW, ready), true);
  assert.deepEqual(clone(h.piece.PIECE_FEATURE_FLAGS), FLAGS);
  assert.ok(Object.isFrozen(h.piece.normalizePieceFeatureFlags(all(true))));
  assert.equal(ready.featureFlags[PREVIEW], true);
  const source = fs.readFileSync(path.join(ROOT, 'features/piece/pieceRuntime.js'), 'utf8');
  assert.doesNotMatch(source, /process\.env|apiFetch\(|apiGet\(|fetch\(|setTimeout\(|console\.|AsyncStorage/);
});

test('version/minimum checks, non-Piece defaults, dynamic flags and child placement remain compatible', async () => {
  const h = harness(); const p = h.render().refreshAppRuntime();
  h.pending[0].resolve({ feature_flags: { account_delete_enabled: false, emlis_threads_enabled: true,
    other_feature: true, ' other_trimmed ': false }, minimum_supported_version: '2.0.0', client_meta: { platform: 'test' } });
  await p; const r = h.render();
  assert.equal(r.runtime.versionStatus.minimumBlocked, true);
  assert.equal(r.runtime.versionStatus.recommendedOutdated, false);
  assert.equal(r.isFeatureEnabled('account_delete_enabled'), false);
  assert.equal(r.isFeatureEnabled('emlis_threads_enabled'), true);
  assert.equal(r.isFeatureEnabled('other_feature'), true);
  assert.equal(r.isFeatureEnabled('other_trimmed'), false);
  assert.equal(r.isFeatureEnabled('', true), true);
  assert.deepEqual(clone(r.runtime.clientMeta), { platform: 'test' });
  assert.equal(r.runtime.currentAppBuild, '100');
});

// Reuse the previous, unchanged display test's harness and original fixture.
// This composes the real runtime projection with the real existing host; it
// is NOT an InputScreen import or a real React Native reconciliation test.
function displayHarness() {
  const file = path.join(ROOT, 'tests/piece-v2-preview-display.test.js');
  const source = fs.readFileSync(file, 'utf8').split('const receivedView =', 1)[0];
  const context = vm.createContext({ require, __dirname: path.dirname(file), AbortController, setImmediate });
  vm.runInContext(source + '\nglobalThis.fixtureUi = { create: previewUiHarness, input: controllerInput };', context);
  return context.fixtureUi;
}

test('runtime OFF/refresh/failure hides the existing Piece host; true alone sends no preview request', async () => {
  const h = harness(), fixture = displayHarness(), u = fixture.create();
  const contextFor = () => fixture.input({ enabled: h.render().isFeatureEnabled(PREVIEW, false) });
  u.host.props = { context: contextFor() }; u.mount(); assert.equal(u.tree(), null);
  let p = h.render().refreshAppRuntime(); h.pending[0].resolve({ feature_flags: { [PREVIEW]: true } }); await p;
  u.host.props = { context: contextFor() }; u.host.componentDidUpdate();
  assert.ok(u.nodes(u.tree()).some(n => n.type === 'Button')); assert.equal(u.calls.length, 0);
  u.host.start(); await new Promise(resolve => setImmediate(resolve));
  assert.ok(u.nodes(u.tree()).some(n => n.props.testID === 'piece-canonical-text'));
  p = h.render().refreshAppRuntime(); u.host.props = { context: contextFor() };
  assert.equal(u.tree(), null, 'hide before lifecycle cleanup when presentation becomes unavailable');
  u.host.componentDidUpdate(); h.pending[1].reject(new Error('bootstrap unavailable')); await assert.rejects(p);
  u.host.props = { context: contextFor() }; u.host.componentDidUpdate();
  assert.equal(u.tree(), null); assert.equal(u.calls.length, 1); u.host.componentWillUnmount();
});


test('a previously captured Piece predicate reads pending/failed invalidation immediately', async () => {
  const h = harness(); let p = h.render().refreshAppRuntime();
  h.pending[0].resolve({ feature_flags: all(true) }); await p;
  const previousRender = h.render(), captured = previousRender.isFeatureEnabled;
  assert.equal(captured(PREVIEW), true);
  p = previousRender.refreshAppRuntime();
  assert.equal(captured(PREVIEW), false, 'do not require another React render to invalidate a callback');
  h.pending[1].reject(new Error('failure')); await assert.rejects(p);
  assert.equal(captured(PREVIEW), false);
});

// AppState / effect scheduling below is explicit simulation, not an on-device
// lifecycle or real React StrictMode result. No session/credential is supplied.
const settleForeground = () => new Promise(resolve => setImmediate(resolve));

test('foreground subscription does not duplicate the existing startup bootstrap', () => {
  const h = harness(); h.render(); h.flushEffects();
  assert.equal(h.appListeners.size, 1);
  assert.equal(h.pending.length, 0);
  h.emit('active'); h.emit('active');
  assert.equal(h.pending.length, 0);
  h.cleanupEffects(); assert.equal(h.appListeners.size, 0);
});

test('background immediately clears all Piece flags and preserves unrelated runtime data', async () => {
  const h = harness(); let r = h.render(); h.flushEffects();
  const p = r.refreshAppRuntime();
  h.pending[0].resolve({ feature_flags: { ...all(true), subscription_sales_enabled: false },
    recommended_version: '1.1.0', maintenance_message: 'retained notice' }); await p;
  const captured = h.render().isFeatureEnabled;
  h.emit('inactive');
  for (const flag of FLAGS) assert.equal(captured(flag, true), false);
  r = h.render(); assert.deepEqual(clone(h.piece.normalizePieceFeatureFlags(r.featureFlags)), all(false));
  assert.equal(r.isFeatureEnabled('subscription_sales_enabled'), false);
  assert.equal(r.runtime.maintenanceMessage, 'retained notice');
  assert.equal(r.runtime.versionStatus.recommendedOutdated, true);
  h.emit('background'); assert.equal(h.pending.length, 1, 'no background request');
  h.cleanupEffects();
});

test('returning active fetches once and does not restore Piece before successful refresh', async () => {
  const h = harness(); h.render(); h.flushEffects();
  h.emit('inactive'); h.emit('background'); h.emit('active'); h.emit('active');
  assert.equal(h.pending.length, 1);
  for (const flag of FLAGS) assert.equal(h.render().isFeatureEnabled(flag, true), false);
  h.pending[0].resolve({ feature_flags: all(true) }); await settleForeground();
  for (const flag of FLAGS) assert.equal(h.render().isFeatureEnabled(flag, false), true);
  h.cleanupEffects();
});

test('a bootstrap started before background cannot restore Piece or stale metadata afterwards', async () => {
  const h = harness(); h.render(); h.flushEffects();
  const old = h.render().refreshAppRuntime(); h.emit('background');
  h.pending[0].resolve({ feature_flags: all(true), maintenance_message: 'obsolete' });
  const returned = await old;
  assert.equal(returned.featureFlags[PREVIEW], false);
  assert.notEqual(h.render().runtime.maintenanceMessage, 'obsolete');
  h.emit('active'); h.pending[1].resolve({ feature_flags: all(false) }); await settleForeground();
  assert.equal(h.render().isFeatureEnabled(PREVIEW, true), false);
  h.cleanupEffects();
});

for (const initial of [null, 'unknown', 'inactive', 'background']) {
  test(`bootstrap while AppState=${initial} cannot enable Piece; active transition rechecks`, async () => {
    const h = harness(initial); h.render(); h.flushEffects();
    const p = h.render().refreshAppRuntime();
    h.pending[0].resolve({ feature_flags: all(true), minimum_supported_version: '2.0.0' });
    const returned = await p;
    assert.equal(returned.featureFlags[PREVIEW], false);
    assert.equal(h.render().isFeatureEnabled(PREVIEW, true), false);
    assert.equal(h.render().runtime.versionStatus.minimumBlocked, true);
    h.emit('active'); assert.equal(h.pending.length, 2);
    h.pending[1].resolve({ feature_flags: all(true) }); await settleForeground();
    assert.equal(h.render().isFeatureEnabled(PREVIEW, false), true);
    h.cleanupEffects();
  });
}

test('failed foreground refresh stays OFF without unhandled rejection, polling or auto-retry', async () => {
  const h = harness(); h.render(); h.flushEffects();
  h.emit('background'); h.emit('active');
  const error = new Error('synthetic foreground failure');
  h.pending[0].reject(error); await settleForeground();
  assert.equal(h.render().runtime.error, error);
  assert.equal(h.render().isFeatureEnabled(PREVIEW, true), false);
  h.emit('active'); await settleForeground(); assert.equal(h.pending.length, 1);
  const retry = h.render().refreshAppRuntime();
  h.pending[1].resolve({ feature_flags: all(true) }); await retry;
  assert.equal(h.render().isFeatureEnabled(PREVIEW, false), true);
  h.cleanupEffects();
});

test('rapid background and active transitions fence an older foreground success', async () => {
  const h = harness(); h.render(); h.flushEffects();
  h.emit('background'); h.emit('active'); h.emit('background'); h.emit('active');
  assert.equal(h.pending.length, 2);
  const error = new Error('newest failure');
  h.pending[1].reject(error); await settleForeground();
  h.pending[0].resolve({ feature_flags: all(true) }); await settleForeground();
  assert.equal(h.render().runtime.error, error);
  assert.equal(h.render().isFeatureEnabled(PREVIEW, true), false);
  h.cleanupEffects();
});

test('cleanup removes AppState listener and fences pending results without writing React state', async () => {
  const h = harness(); h.render(); h.flushEffects();
  const listener = [...h.appListeners][0];
  h.emit('background'); h.emit('active');
  const captured = h.render().isFeatureEnabled;
  h.cleanupEffects(); const writes = h.stateWrites();
  assert.equal(h.appListeners.size, 0);
  listener('background'); listener('active');
  h.pending[0].resolve({ feature_flags: all(true) }); await settleForeground();
  assert.equal(h.pending.length, 1);
  assert.equal(h.stateWrites(), writes);
  assert.equal(captured(PREVIEW, true), false);
});

test('effect cleanup/setup replay retains one subscription and does not duplicate startup requests', async () => {
  const h = harness(); h.render(); h.flushEffects();
  h.cleanupEffects(); h.setupEffectsAgain();
  assert.equal(h.appListeners.size, 1); assert.equal(h.pending.length, 0);
  h.emit('background'); h.emit('active'); assert.equal(h.pending.length, 1);
  h.pending[0].resolve({ feature_flags: all(true) }); await settleForeground();
  assert.equal(h.render().isFeatureEnabled(PREVIEW, false), true);
  h.cleanupEffects();
});

test('foreground refresh composes with the existing preview host without resending a Piece', async () => {
  const h = harness(), fixture = displayHarness(), u = fixture.create();
  h.render(); h.flushEffects();
  const contextFor = () => fixture.input({ enabled: h.render().isFeatureEnabled(PREVIEW, false) });
  u.host.props = { context: contextFor() }; u.mount();
  const p = h.render().refreshAppRuntime(); h.pending[0].resolve({ feature_flags: all(true) }); await p;
  u.host.props = { context: contextFor() }; u.host.componentDidUpdate();
  u.host.start(); await settleForeground();
  assert.ok(u.nodes(u.tree()).some(n => n.props.testID === 'piece-canonical-text'));
  h.emit('background'); u.host.props = { context: contextFor() };
  assert.equal(u.tree(), null); u.host.componentDidUpdate();
  h.emit('active'); u.host.props = { context: contextFor() }; u.host.componentDidUpdate();
  assert.equal(u.tree(), null);
  h.pending[1].resolve({ feature_flags: all(true) }); await settleForeground();
  u.host.props = { context: contextFor() }; u.host.componentDidUpdate();
  assert.ok(u.nodes(u.tree()).some(n => n.type === 'Button'));
  assert.ok(!u.nodes(u.tree()).some(n => n.props.testID === 'piece-canonical-text'));
  assert.equal(u.calls.length, 1, 'foreground never automatically generates/replays Piece');
  u.host.componentWillUnmount(); h.cleanupEffects();
});

test('effect replay restarts an interrupted bootstrap even when the existing gate is single-flight', async () => {
  const h = harness(); h.render(); h.flushEffects();
  const first = h.render().refreshAppRuntime();
  // AppRuntimeBootstrapGate may still be waiting for its first promise, so
  // its own repeated effect cannot be relied on to start another request.
  h.cleanupEffects(); h.setupEffectsAgain();
  assert.equal(h.pending.length, 2);
  h.pending[0].resolve({ feature_flags: all(true), maintenance_message: 'old mount' });
  await first; assert.equal(h.render().isFeatureEnabled(PREVIEW, true), false);
  h.pending[1].resolve({ feature_flags: all(true) }); await settleForeground();
  assert.equal(h.render().runtime.loading, false);
  assert.equal(h.render().isFeatureEnabled(PREVIEW, false), true);
  assert.notEqual(h.render().runtime.maintenanceMessage, 'old mount');
  h.cleanupEffects();
});


// Auth events/timers are test doubles. These assertions do not execute a live
// Supabase client, real React reconciliation, Hermes or device auth transitions.
async function loadedRuntime(h) {
  h.render(); h.flushEffects();
  const p = h.render().refreshAppRuntime();
  h.pending[0].resolve({ feature_flags: { ...all(true), subscription_sales_enabled: false },
    maintenance_message: 'existing notice', recommended_version: '1.1.0' });
  await p;
  return h.render();
}

for (const event of ['INITIAL_SESSION', 'SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED',
  'USER_UPDATED', 'PASSWORD_RECOVERY', 'MFA_CHALLENGE_VERIFIED', 'FUTURE_AUTH_EVENT']) {
  test(`auth ${event} clears all cached Piece flags synchronously before one deferred bootstrap`, async () => {
    const h = harness(), r = await loadedRuntime(h), captured = r.isFeatureEnabled;
    assert.equal(h.authListeners.size, 1);
    h.emitAuth(event, event === 'SIGNED_OUT' ? null : undefined);
    for (const flag of FLAGS) assert.equal(captured(flag, true), false);
    assert.deepEqual(clone(h.piece.normalizePieceFeatureFlags(h.render().featureFlags)), all(false));
    assert.equal(h.pending.length, 1, 'no HTTP inside the auth callback');
    assert.equal(h.authTimers.size, 1);
    assert.equal(h.render().isFeatureEnabled('subscription_sales_enabled'), false);
    assert.equal(h.render().runtime.maintenanceMessage, 'existing notice');
    assert.equal(h.render().runtime.versionStatus.recommendedOutdated, true);
    h.flushAuthTimers(); assert.equal(h.pending.length, 2);
    assert.equal(captured(PREVIEW), false);
    h.pending[1].resolve({ feature_flags: all(true) }); await settleForeground();
    assert.equal(h.render().isFeatureEnabled(PREVIEW), true, 'presentation only, not authenticated authority');
    assert.doesNotMatch(JSON.stringify(h.render().runtime), /PRIVATE_SYNTHETIC|synthetic-owner/);
    h.cleanupEffects();
  });
}

test('auth bursts coalesce without keeping session payloads or treating them as feature decisions', async () => {
  const h = harness(); await loadedRuntime(h);
  const unreadable = new Proxy({}, { get() { throw new Error('session must not be read'); } });
  h.emitAuth('SIGNED_OUT', null); h.emitAuth('SIGNED_IN', unreadable); h.emitAuth('TOKEN_REFRESHED', unreadable);
  assert.equal(h.authTimers.size, 1); assert.equal(h.pending.length, 1);
  h.flushAuthTimers(); assert.equal(h.pending.length, 2);
  h.pending[1].resolve({ feature_flags: all(false) }); await settleForeground();
  assert.equal(h.render().isFeatureEnabled(PREVIEW, true), false);
  h.flushAuthTimers(); assert.equal(h.pending.length, 2); h.cleanupEffects();
});

test('auth event fences a bootstrap already in flight, including the promise return snapshot', async () => {
  const h = harness(); await loadedRuntime(h);
  const old = h.render().refreshAppRuntime();
  h.emitAuth('TOKEN_REFRESHED');
  h.pending[1].resolve({ feature_flags: all(true), maintenance_message: 'obsolete session notice' });
  const oldResult = await old;
  assert.equal(oldResult.featureFlags[PREVIEW], false);
  assert.notEqual(h.render().runtime.maintenanceMessage, 'obsolete session notice');
  h.flushAuthTimers();
  h.pending[2].resolve({ feature_flags: all(false) }); await settleForeground();
  assert.equal(h.render().isFeatureEnabled(PREVIEW, true), false); h.cleanupEffects();
});

test('new auth boundary during auth refresh rejects the prior result and permits only the newer refresh', async () => {
  const h = harness(); await loadedRuntime(h);
  h.emitAuth('SIGNED_IN'); h.flushAuthTimers();
  h.emitAuth('SIGNED_OUT', null); h.emitAuth('SIGNED_IN'); h.flushAuthTimers();
  assert.equal(h.pending.length, 3);
  h.pending[2].resolve({ feature_flags: all(false), maintenance_message: 'current notice' }); await settleForeground();
  h.pending[1].resolve({ feature_flags: all(true), maintenance_message: 'old notice' }); await settleForeground();
  assert.equal(h.render().isFeatureEnabled(PREVIEW, true), false);
  assert.equal(h.render().runtime.maintenanceMessage, 'current notice'); h.cleanupEffects();
});

for (const state of ['background', 'inactive', null]) {
  test(`auth in ${state} does not fetch until foreground and cannot restore cached Piece`, async () => {
    const h = harness(); await loadedRuntime(h);
    h.emit(state); h.emitAuth('TOKEN_REFRESHED'); h.flushAuthTimers();
    assert.equal(h.pending.length, 1); assert.equal(h.authTimers.size, 0);
    assert.equal(h.render().isFeatureEnabled(PREVIEW, true), false);
    h.emit('active'); assert.equal(h.pending.length, 2);
    h.pending[1].resolve({ feature_flags: all(true) }); await settleForeground();
    assert.equal(h.render().isFeatureEnabled(PREVIEW), true); h.cleanupEffects();
  });
}

test('background before the deferred auth refresh cancels it; foreground supplies the single replacement', async () => {
  const h = harness(); await loadedRuntime(h);
  h.emitAuth('TOKEN_REFRESHED'); assert.equal(h.authTimers.size, 1);
  h.emit('background'); assert.equal(h.authTimers.size, 0);
  h.flushAuthTimers(); assert.equal(h.pending.length, 1);
  h.emit('active'); h.flushAuthTimers(); assert.equal(h.pending.length, 2);
  h.pending[1].resolve({ feature_flags: all(true) }); await settleForeground(); h.cleanupEffects();
});

test('an explicit current bootstrap replaces a queued auth refresh instead of fetching twice', async () => {
  const h = harness(); await loadedRuntime(h);
  h.emitAuth('SIGNED_IN');
  const explicit = h.render().refreshAppRuntime();
  assert.equal(h.authTimers.size, 0);
  h.flushAuthTimers(); assert.equal(h.pending.length, 2);
  h.pending[1].resolve({ feature_flags: all(true) }); await explicit;
  assert.equal(h.render().isFeatureEnabled(PREVIEW), true); h.cleanupEffects();
});

test('auth bootstrap failure remains OFF without automatic retry or an unhandled rejection', async () => {
  const h = harness(); await loadedRuntime(h);
  h.emitAuth('TOKEN_REFRESHED'); h.flushAuthTimers();
  const failure = new Error('synthetic unavailable');
  assert.equal(h.pending.length, 2, 'auth notification must schedule a bootstrap');
  h.pending[1].reject(failure); await settleForeground();
  assert.equal(h.render().runtime.error, failure);
  assert.equal(h.render().isFeatureEnabled(PREVIEW), false);
  h.flushAuthTimers(); await settleForeground(); assert.equal(h.pending.length, 2);
  const retry = h.render().refreshAppRuntime();
  h.pending[2].resolve({ feature_flags: all(true) }); await retry; h.cleanupEffects();
});

test('cleanup removes auth subscription and timer; queued or captured callbacks cannot update an unmounted provider', async () => {
  const h = harness(); await loadedRuntime(h);
  const callback = [...h.authListeners][0];
  assert.equal(typeof callback, 'function');
  h.emitAuth('TOKEN_REFRESHED'); const deferredCallback = [...h.authTimers.values()][0];
  h.cleanupEffects(); const writes = h.stateWrites();
  assert.equal(h.authListeners.size, 0); assert.equal(h.authTimers.size, 0);
  callback('SIGNED_IN', {}); deferredCallback(); h.flushAuthTimers();
  assert.equal(h.stateWrites(), writes); assert.equal(h.pending.length, 1);
});

test('effect replay resumes a cancelled queued auth refresh and keeps one listener', async () => {
  const h = harness(); await loadedRuntime(h);
  h.emitAuth('TOKEN_REFRESHED'); h.cleanupEffects(); h.setupEffectsAgain();
  assert.equal(h.authListeners.size, 1); assert.equal(h.appListeners.size, 1);
  h.flushAuthTimers(); assert.equal(h.pending.length, 2);
  h.pending[1].resolve({ feature_flags: all(true) }); await settleForeground();
  assert.equal(h.render().runtime.loading, false);
  assert.equal(h.render().isFeatureEnabled(PREVIEW), true); h.cleanupEffects();
});

test('auth refresh hides an already displayed Piece and never revives or automatically regenerates it', async () => {
  const h = harness(), fixture = displayHarness(), u = fixture.create();
  await loadedRuntime(h);
  const contextFor = () => fixture.input({ enabled: h.render().isFeatureEnabled(PREVIEW, false) });
  u.host.props = { context: contextFor() }; u.mount(); u.host.start(); await settleForeground();
  assert.ok(u.nodes(u.tree()).some(n => n.props.testID === 'piece-canonical-text'));
  h.emitAuth('SIGNED_OUT', null); u.host.props = { context: contextFor() };
  assert.equal(u.tree(), null); u.host.componentDidUpdate();
  h.emitAuth('SIGNED_IN'); h.flushAuthTimers();
  h.pending[1].resolve({ feature_flags: all(true) }); await settleForeground();
  u.host.props = { context: contextFor() }; u.host.componentDidUpdate();
  assert.ok(u.nodes(u.tree()).some(n => n.type === 'Button'));
  assert.ok(!u.nodes(u.tree()).some(n => n.props.testID === 'piece-canonical-text'));
  assert.equal(u.calls.length, 1);
  u.host.componentWillUnmount(); h.cleanupEffects();
});

test('an obsolete deferred auth callback cannot consume the current timer or send stale IO', async () => {
  const h = harness(); await loadedRuntime(h);
  h.emitAuth('SIGNED_OUT', null); const old = [...h.authTimers.values()][0];
  assert.equal(typeof old, 'function');
  h.emitAuth('SIGNED_IN'); const currentTimer = [...h.authTimers.keys()][0];
  old();
  assert.equal(h.pending.length, 1);
  assert.deepEqual([...h.authTimers.keys()], [currentTimer]);
  h.flushAuthTimers(); assert.equal(h.pending.length, 2);
  h.pending[1].resolve({ feature_flags: all(true) }); await settleForeground();
  h.cleanupEffects();
});
