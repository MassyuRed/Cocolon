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

function harness() {
  const pending = [], hooks = [];
  let cursor = 0, contextDefault;
  const React = {
    createContext: value => { contextDefault = value; return { Provider: 'RuntimeProvider' }; },
    createElement: (type, props, ...children) => ({ type, props, children }),
    useContext: () => contextDefault,
    useState: initial => {
      const index = cursor++;
      if (!hooks[index]) hooks[index] = { value: initial };
      return [hooks[index].value, update => {
        hooks[index].value = typeof update === 'function' ? update(hooks[index].value) : update;
      }];
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
  const context = vm.createContext({ ...React, React,
    process: { env: { EXPO_PUBLIC_APP_VERSION: '1.0.0', EXPO_PUBLIC_APP_BUILD: '100' } },
    apiGet: async (url, options) => {
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
  return { render, pending, piece: context.piece, contextDefault: () => contextDefault };
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
