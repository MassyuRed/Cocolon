'use strict';
// Actual existing Piece API/model/controller/host. React/native, HTTP/Auth,
// runtime publication and clock are doubles. InputScreen is NOT mounted here.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const crypto = require('node:crypto');
const OWNER = '10000000-0000-4000-8000-000000000001';
const INPUT = '20000000-0000-4000-8000-000000000002';
const OTHER = '20000000-0000-4000-8000-000000000099';
const KEY = 'synthetic-saved-input-key';
const tick = () => new Promise(resolve => setImmediate(resolve));
const copy = value => JSON.parse(JSON.stringify(value));
const packet = (value, status = 200) => ({ status, json: async () => value });
function ref(id = INPUT, pre = false) {
  return { source_input_id: id, source_input_version: 'emlis.current_input_bundle.v1',
    source_input_bundle_commitment: 'sha256:' + 'a'.repeat(64),
    emlis_observation_stage: pre ? 'pre_question_observation' : 'normal_observation',
    emlis_observation_result_identity: 'synthetic-observation',
    question_need_decision_identity: pre ? 'synthetic-question' : null,
    supplemental_answer_identity: null };
}
function fixture({ send, enabled = true, currentState = 'active', pre = false, admitSave = false, saveEnabled = false } = {}) {
  const file = path.join(__dirname, 'piece-v2-preview-display.test.js');
  const source = fs.readFileSync(file, 'utf8').split('const receivedView =')[0];
  const context = vm.createContext({ require, __dirname, AbortController, setImmediate });
  vm.runInContext(source + '\nglobalThis.fixtures = {previewUiHarness,response,deferredPieceResponse,uiSaveReceipt,startSyntheticSave};', context);
  const f = context.fixtures;
  const expected = copy(f.response());
  const u = f.previewUiHarness({ currentState, admitSave, send: send || (async (_url, options) =>
    packet(options.method === 'GET' ? ref(INPUT, pre) : expected)) });
  let allowed = enabled, saveAllowed = saveEnabled, refreshes = 0;
  u.host.props = { savedInput: { savedInputId: INPUT, expectedUserId: OWNER, idempotencyKey: KEY } };
  const runtime = () => ({ runtime: { loaded: true, loading: false, error: null },
    isFeatureEnabled: (name, fallback) => {
      assert.ok(['piece_v2_preview_enabled', 'piece_v2_save_enabled'].includes(name));
      assert.equal(fallback, false); return name === 'piece_v2_preview_enabled' ? allowed : saveAllowed;
    }, refreshAppRuntime: async () => { refreshes++; } });
  u.host.context = runtime();
  return { ...u, expected, makePreview: f.response, deferred: f.deferredPieceResponse,
    saveReceipt: f.uiSaveReceipt, startSave: () => f.startSyntheticSave(u),
    publishSave: value => { saveAllowed = value; u.host.context = runtime(); },
    immediateSave: value => { saveAllowed = value; },
    refreshes: () => refreshes,
    publish: value => { allowed = value; u.host.context = runtime(); },
    immediateOff: () => { allowed = false; },
    names: () => copy(u.nodes(u.tree()).filter(n => n.type === 'Button').map(n => n.props.title)),
    body: () => u.nodes(u.tree()).find(n => n.props.testID === 'piece-canonical-text') };
}
function resolver(u) {
  assert.equal(typeof u.host.resolveSavedInput, 'function', 'B10_SAVED_INPUT_HOST_CALLER_ABSENT');
  return u.host.resolveSavedInput();
}

function stackRecovery() {
  const stack = fs.readFileSync(path.join(__dirname, '../navigation/MainTabs.js'), 'utf8');
  const helper = stack.slice(stack.indexOf('export function createPieceSaveRecovery'), stack.indexOf('export default'));
  return vm.runInNewContext(helper.replace('export ', '') + '\ncreatePieceSaveRecovery')(OWNER);
}

for (const leaveInFlight of [false, true]) {
  test(`leaving Piece creation ${leaveInFlight ? 'in flight' : 'after a lost save ACK'} restores only same-key confirmation`, async () => {
    const seed = fixture(), pending = seed.deferred(), recovery = stackRecovery();
    let saves = 0;
    const send = async (url, options) => {
      if (options.method === 'GET') return packet(ref());
      if (!url.endsWith('/save')) return packet(seed.expected);
      if (++saves > 1) return packet(seed.saveReceipt({ idempotency_replayed: true }));
      return leaveInFlight ? pending.promise : packet({ code: 'PIECE_TEMPORARILY_UNAVAILABLE' }, 503);
    };
    const first = fixture({ send, admitSave: true, saveEnabled: true });
    first.host.props = { ...first.host.props, saveRecovery: recovery, creationMode: leaveInFlight };
    first.mount();
    if (leaveInFlight) await first.host.createFromSavedInput();
    else { await resolver(first); first.host.start(); }
    await tick();
    const saving = first.startSave(); await tick();
    const entry = recovery.find(OWNER, INPUT);
    assert.ok(entry);
    assert.doesNotMatch(JSON.stringify(entry), /piece_text"|content_payload"|visual_recipe"|静かに/);
    assert.equal(recovery.find(OTHER, INPUT), undefined);
    assert.equal(recovery.find(OWNER, OTHER), undefined);
    first.host.componentWillUnmount();
    if (leaveInFlight) pending.resolve(packet(seed.saveReceipt()));
    await saving;
    assert.equal(recovery.find(OWNER, INPUT), entry, 'an abandoned ACK cannot erase the confirmation');

    const second = fixture({ send, admitSave: true, saveEnabled: true });
    second.host.props = { ...second.host.props, saveRecovery: recovery, creationMode: !leaveInFlight,
      savedInput: { ...second.host.props.savedInput, idempotencyKey: 'fresh-navigation-key' } };
    second.mount();
    if (!leaveInFlight) await second.host.createFromSavedInput();
    else { await resolver(second); second.host.start(); }
    await tick();
    assert.equal(second.calls.length, 0);
    assert.equal(second.body(), undefined);
    assert.ok(second.names().includes('同じ保存要求で結果を確認'));
    second.host.retry(); second.host.retry(); await tick();
    assert.equal(second.calls.length, 1);
    assert.equal(second.calls[0][0], '/emotion/piece/save');
    assert.equal(second.calls[0][1].expectedUserId, OWNER);
    assert.equal(second.calls[0][1].body, first.calls[2][1].body);
    assert.equal(second.calls[0][1].headers['Idempotency-Key'], first.calls[2][1].headers['Idempotency-Key']);
    assert.equal(second.host.controller.getView().phase, 'saved');
    assert.equal(recovery.find(OWNER, INPUT), undefined);
    second.host.componentWillUnmount();

    const newer = fixture({ send, admitSave: true, saveEnabled: true });
    newer.host.props = { ...newer.host.props, saveRecovery: recovery, creationMode: true,
      savedInput: { ...newer.host.props.savedInput, idempotencyKey: 'later-navigation-key' } };
    newer.mount(); await newer.host.createFromSavedInput(); await tick();
    assert.deepEqual(copy(newer.calls.map(([, options]) => options.method)), ['GET', 'POST']);
    newer.host.componentWillUnmount();
  });
}

for (const publication of ['same', 'unknown']) {
  test(`a shared save stop blocks re-entry under a ${publication} runtime until a new eligible publication`, async () => {
    const seed = fixture(), recovery = stackRecovery();
    let saves = 0;
    const send = async (url, options) => {
      if (options.method === 'GET') return packet(ref());
      if (!url.endsWith('/save')) return packet(seed.expected);
      return ++saves === 1 ? packet({ code: 'PIECE_FEATURE_DISABLED' }, 503)
        : packet(seed.saveReceipt({ idempotency_replayed: true }));
    };
    const first = fixture({ send, admitSave: true, saveEnabled: true });
    first.host.props = { ...first.host.props, saveRecovery: recovery };
    first.mount(); await resolver(first); first.host.start(); await tick(); await first.startSave();
    assert.equal(first.host.controller.getView().canRetry, false);
    assert.equal(first.refreshes(), 1);
    const stoppedRuntime = first.host.context.runtime;
    first.host.componentWillUnmount();

    const second = fixture({ send, admitSave: true, saveEnabled: true });
    second.host.context = { ...second.host.context, runtime: publication === 'same' ? stoppedRuntime : true };
    second.host.props = { ...second.host.props, saveRecovery: recovery, creationMode: true,
      savedInput: { ...second.host.props.savedInput, idempotencyKey: 'new-navigation-key' } };
    second.mount(); await second.host.createFromSavedInput();
    assert.equal(second.host.controller.getView().retryKind, 'save');
    assert.equal(second.host.controller.getView().canRetry, false);
    assert.equal(second.body(), undefined);
    assert.ok(!second.names().includes('同じ保存要求で結果を確認'));
    await second.host.controller.retry(); await resolver(second);
    assert.equal(second.calls.length, 0);
    second.background('inactive'); second.background('active');
    assert.equal(second.host.controller.getView().canRetry, false);
    second.publishSave(false); second.host.componentDidUpdate();
    assert.equal(second.host.controller.getView().canRetry, false);
    second.publishSave(true); second.host.componentDidUpdate();
    assert.equal(second.host.controller.getView().canRetry, true);
    assert.equal(second.calls.length, 0);
    second.host.retry(); await tick();
    assert.equal(second.calls.length, 1);
    assert.equal(second.calls[0][0], '/emotion/piece/save');
    assert.equal(second.calls[0][1].body, first.calls[2][1].body);
    assert.equal(second.calls[0][1].headers['Idempotency-Key'], first.calls[2][1].headers['Idempotency-Key']);
    assert.equal(second.host.controller.getView().phase, 'saved');
    second.host.componentWillUnmount();
  });
}

test('a stale completion cannot remove a newer pending save for the same source', () => {
  const recovery = stackRecovery();
  const operation = { expectedUserId: OWNER, request: { source_ref: ref() } };
  const first = { operation }, later = { operation };
  assert.equal(recovery.remember(first), true);
  assert.equal(recovery.remember(later), false);
  recovery.forget(first);
  assert.equal(recovery.remember(later), true);
  recovery.forget(first);
  const runtime = {};
  recovery.markDisabled(first, runtime);
  assert.equal(recovery.find(OWNER, INPUT), later);
  assert.equal(recovery.canResume(first, runtime, true), false);
  assert.equal(recovery.canResume(later, runtime, true), true);
  recovery.revoke();
  assert.equal(recovery.find(OWNER, INPUT), undefined);
  assert.equal(recovery.remember(first), false, 'old hosts cannot repopulate a revoked owner');
});

for (const action of ['save', 'cancel']) {
  test(`expired ${action} after same-request recovery preserves the last applied visual choices`, async () => {
    const seed = fixture(), initial = seed.makePreview('quote');
    const changed = copy(initial);
    const settings = { theme_id: 'quiet_night', aspect_ratio: '9:16', branding_mode: 'off' };
    Object.assign(changed.visual_recipe, { aspect_ratio: settings.aspect_ratio });
    changed.visual_recipe.theme.theme_id = settings.theme_id;
    changed.visual_recipe.branding.branding_mode = settings.branding_mode;
    const canonical = value => value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort()
      .map(key => [key, canonical(value[key])])) : value;
    changed.visual_recipe_hash = crypto.createHash('sha256').update(JSON.stringify(canonical(changed.visual_recipe))).digest('hex');
    changed.preview_revision = changed.row_version = 2;
    const rebuilt = { ...changed, preview_revision: 1, row_version: 1,
      preview_id: '30000000-0000-4000-8000-000000000004', expires_at: '2026-10-08T10:00:10.000Z' };
    let previews = 0, terminals = 0;
    const u = fixture({ admitSave: true, saveEnabled: true, send: async (url, options) => {
      if (options.method === 'GET') return packet(ref());
      if (options.method === 'PATCH') return packet(changed);
      if (options.method === 'DELETE' || url.endsWith('/save')) return ++terminals === 1
        ? packet({ code: 'PIECE_TEMPORARILY_UNAVAILABLE' }, 503) : packet({ code: 'PIECE_PREVIEW_EXPIRED' }, 409);
      return packet(++previews === 1 ? initial : rebuilt);
    } });
    u.mount(); await resolver(u); u.host.start(); await tick();
    const identity = p => ({ preview_id: p.preview_id, preview_revision: p.preview_revision, visual_recipe_hash: p.visual_recipe_hash });
    const controller = u.host.controller;
    await controller.changeVisual(settings, identity(initial), controller.getView().visualToken);
    assert.equal(controller.getView().preview.visual_recipe_hash, changed.visual_recipe_hash);
    if (action === 'save') await u.startSave();
    else await controller.cancelPreview(identity(changed), controller.getView().visualToken);
    assert.equal(u.calls.length, 4);
    u.background('inactive'); u.background('active');
    assert.equal(u.calls.length, 4);
    u.host.retry(); await tick();
    assert.equal(u.calls[3][0], u.calls[4][0]);
    assert.equal(u.calls[3][1].body, u.calls[4][1].body);
    assert.equal(u.calls[3][1].headers['Idempotency-Key'], u.calls[4][1].headers['Idempotency-Key']);
    const restart = u.nodes(u.tree()).find(n => n.props.title === '同じ記録から作り直す');
    assert.ok(restart);
    restart.props.onPress(); await tick();
    assert.deepEqual(JSON.parse(u.calls[5][1].body).visual_selection, settings);
    assert.equal(controller.getView().preview.preview_id, rebuilt.preview_id);
    u.host.componentWillUnmount();
  });
}

async function expiredSave() {
  const seed = fixture();
  const rebuilt = { ...seed.expected, preview_id: '30000000-0000-4000-8000-000000000004',
    expires_at: '2026-10-08T10:00:10.000Z' };
  let previews = 0;
  const u = fixture({ admitSave: true, saveEnabled: true, send: async (url, options) => {
    if (options.method === 'GET') return packet(ref());
    if (url.endsWith('/save')) return packet({ code: 'PIECE_PREVIEW_EXPIRED' }, 409);
    return packet(++previews === 1 ? seed.expected : rebuilt);
  } });
  const rebuildButtons = () => u.nodes(u.tree()).filter(n => n.type === 'Button' && n.props.title === '同じ記録から作り直す');
  u.mount(); await resolver(u); u.host.start(); await tick(); await u.startSave();
  assert.equal(u.calls.length, 3);
  assert.equal(rebuildButtons().length, 1);
  return { ...u, rebuilt, rebuildButtons };
}

test('confirmed save expiry keeps a body-free explicit restart across the same saved selection pause', async () => {
  const u = await expiredSave();
  const old = u.rebuildButtons()[0], token = u.host.controller.getView().previewRestartToken;
  u.background('inactive');
  assert.equal(u.tree(), null);
  old.props.onPress(); await tick();
  u.background('active');
  assert.equal(u.host.state.open, false);
  assert.notEqual(u.host.controller.getView().previewRestartToken, token);
  assert.equal(u.host.controller.getView().preview, null);
  assert.equal(u.rebuildButtons().length, 1);
  old.props.onPress(); await resolver(u); await tick();
  assert.equal(u.calls.length, 3, 'foreground and obsolete controls are IO-free');
  const restart = u.rebuildButtons()[0];
  restart.props.onPress(); restart.props.onPress(); await tick();
  assert.deepEqual(copy(u.calls.map(([, options]) => options.method)), ['GET', 'POST', 'POST', 'POST']);
  const [url, options] = u.calls[3];
  assert.equal(url, '/emotion/piece/preview');
  assert.equal(options.expectedUserId, OWNER);
  assert.notEqual(options.headers['Idempotency-Key'], KEY);
  assert.deepEqual(JSON.parse(options.body), { source_ref: ref(), requested_format: null,
    visual_selection: { theme_id: 'soft_paper', aspect_ratio: '4:5', branding_mode: 'required_small' } });
  assert.equal(u.host.controller.getView().preview.preview_id, u.rebuilt.preview_id);
  u.host.close(); restart.props.onPress(); await tick();
  assert.equal(u.calls.length, 4);
  assert.equal(u.rebuildButtons().length, 0);
  u.host.componentWillUnmount();
});

for (const changed of ['savedInputId', 'expectedUserId', 'idempotencyKey']) {
  test(`an expired save does not revive after a hidden ${changed} change and return`, async () => {
    const u = await expiredSave();
    const old = u.rebuildButtons()[0];
    const previous = u.host.props.savedInput;
    u.background('inactive');
    u.host.props = { savedInput: { ...previous, [changed]: OTHER } };
    u.host.componentDidUpdate();
    u.host.props = { savedInput: previous };
    u.host.componentDidUpdate();
    u.background('active');
    old.props.onPress(); await tick();
    assert.equal(u.rebuildButtons().length, 0);
    assert.equal(u.calls.length, 3);
    assert.deepEqual(u.names(), ['保存入力を確認']);
    u.host.componentWillUnmount();
  });
}

test('closing a confirmed expiry clears its old restart button across a later foreground', async () => {
  const u = await expiredSave();
  const old = u.rebuildButtons()[0];
  u.host.close();
  u.background('inactive'); u.background('active');
  old.props.onPress(); await tick();
  assert.equal(u.rebuildButtons().length, 0);
  assert.equal(u.calls.length, 3);
  u.host.componentWillUnmount();
});

test('explicit response creation reads source and starts one preview; mount remains IO-free', async () => {
  const u = fixture(); u.host.props.creationMode = true; u.mount();
  assert.equal(u.calls.length, 0);
  await Promise.all([u.host.createFromSavedInput(), u.host.createFromSavedInput()]);
  await tick();
  assert.deepEqual(copy(u.calls.map(([, o]) => o.method)), ['GET', 'POST']);
  assert.equal(u.body().children.join(''), u.expected.piece_text);
  u.host.componentWillUnmount();
});

test('losing navigation focus fences a delayed explicit creation and never restarts on focus return', async () => {
  const f = fixture(), d = f.deferred(), u = fixture({ send: () => d.promise });
  u.host.props.active = true; u.mount();
  const pending = u.host.createFromSavedInput(); await tick();
  u.host.props.active = false;
  assert.equal(u.tree(), null);
  u.host.componentDidUpdate();
  d.resolve(packet(ref())); await pending;
  u.host.props.active = true; u.host.componentDidUpdate(); await tick();
  assert.equal(u.calls.length, 1); assert.equal(u.body(), undefined);
  u.host.componentWillUnmount();
});

for (const rereadRejected of [false, true]) {
  test(`an aborted create body cannot advance a newer source recheck ${rereadRejected ? 'rejection' : 'success'}`, async () => {
    const seed = fixture(), body = seed.deferred(); let reads = 0;
    const u = fixture({ send: async (_url, init) => {
      if (init.method !== 'GET') return packet(seed.expected);
      if (++reads === 1) return { status: 200, json: () => body.promise };
      if (reads === 2) return packet({ code: 'PIECE_CONFLICT' }, 409);
      return rereadRejected ? packet({ code: 'PIECE_SOURCE_NOT_ELIGIBLE' }, 422) : packet(ref());
    } });
    u.host.props.creationMode = true; u.mount();
    const originalCreate = u.host.createFromSavedInput(); await tick();
    u.host.props = { ...u.host.props, active: false }; u.host.componentDidUpdate();
    u.host.props = { ...u.host.props, active: true }; u.host.componentDidUpdate();
    await u.host.createFromSavedInput(); await tick();
    const reread = u.nodes(u.tree()).find(n => n.props.title === '保存入力を確認し直す'); assert.ok(reread);
    await reread.props.onPress(); await tick();
    assert.deepEqual(copy(u.calls.map(([, init]) => init.method)), ['GET', 'GET', 'GET']);
    body.resolve(ref()); await originalCreate; await tick();
    assert.equal(u.calls.length, 3, 'the obsolete create cannot adopt a later GET-only operation');
    if (rereadRejected) {
      assert.equal(u.host.sourceCode, 'PIECE_SOURCE_NOT_ELIGIBLE');
      assert.equal(u.host.sourcePhase, 'unavailable');
    } else {
      assert.equal(u.host.sourcePhase, 'ready'); assert.equal(u.host.controller.getView().phase, 'idle');
      u.host.start(); await tick();
      assert.equal(u.calls.length, 4); assert.equal(u.calls[3][1].method, 'POST');
      assert.notEqual(u.calls[3][1].headers['Idempotency-Key'], KEY);
    }
    u.host.componentWillUnmount();
  });
}

for (const boundary of ['close', 'owner-roundtrip', 'key-roundtrip']) {
  test(`a successful source receipt cannot start creation after a microtask ${boundary}`, async () => {
    const u = fixture(); u.host.props.creationMode = true; u.mount();
    const resolve = u.host.resolveSavedInput, savedInput = u.host.props.savedInput;
    let first = true;
    u.host.resolveSavedInput = (...args) => {
      const pending = resolve(...args);
      if (!first) return pending;
      first = false;
      return pending.then(async completed => {
        // This runs after the real source resolver has returned its receipt,
        // before createFromSavedInput's await continuation receives it.
        if (boundary === 'close') u.host.close();
        else {
          const next = { ...savedInput, [boundary === 'owner-roundtrip' ? 'expectedUserId' : 'idempotencyKey']:
            boundary === 'owner-roundtrip' ? 'another-owner' : 'another-navigation-key' };
          u.host.props = { ...u.host.props, savedInput: next }; u.host.componentDidUpdate();
          u.host.props = { ...u.host.props, savedInput }; u.host.componentDidUpdate();
          await resolve();
          assert.equal(u.host.sourcePhase, 'ready', 'a newer explicit GET has completed under the restored binding');
        }
        return completed;
      });
    };
    await u.host.createFromSavedInput(); await tick();
    assert.deepEqual(copy(u.calls.map(([, init]) => init.method)), boundary === 'close' ? ['GET'] : ['GET', 'GET']);
    assert.equal(u.host.state.open, false);
    assert.equal(u.host.controller.getView().phase, 'idle');
    u.host.start(); await tick();
    assert.equal(u.calls.at(-1)[1].method, 'POST', 'a separate current create press still works');
    assert.equal(u.calls.at(-1)[1].headers['Idempotency-Key'], KEY);
    u.host.componentWillUnmount();
  });
}

for (const pre of [false, true]) test(`saved ${pre ? 'pre-question' : 'normal'} input -> explicit GET -> separate preview with exact text`, async () => {
  const u = fixture({ pre }); u.mount();
  assert.equal(u.calls.length, 0); assert.deepEqual(u.names(), ['保存入力を確認']);
  u.host.start(); assert.equal(u.calls.length, 0, 'no preview before the saved terminal source is resolved');
  await resolver(u);
  assert.equal(u.calls.length, 1); assert.deepEqual(u.names(), ['この入力をPieceにする']);
  assert.equal(u.calls[0][0], '/emotion/piece/source-ref/' + INPUT);
  assert.equal(u.calls[0][1].method, 'GET'); assert.equal(u.calls[0][1].body, undefined);
  assert.equal(u.calls[0][1].headers['Idempotency-Key'], undefined);
  u.host.start(); u.host.start(); await tick();
  assert.equal(u.calls.length, 2); assert.equal(u.calls[1][0], '/emotion/piece/preview');
  assert.equal(u.calls[1][1].headers['Idempotency-Key'], KEY);
  assert.deepEqual(JSON.parse(u.calls[1][1].body), { source_ref: ref(INPUT, pre), requested_format: null,
    visual_selection: { theme_id: null, aspect_ratio: null, branding_mode: null } });
  assert.equal(u.body().children.join(''), u.expected.piece_text);
  assert.equal(JSON.stringify(u.host.state).includes('synthetic-observation'), false);
  assert.equal(JSON.stringify(u.host.state).includes(u.expected.piece_text), false);
  const display = u.read(u.host.controller.getView());
  assert.equal(display.hashVerified, true); assert.equal(display.canSave, false); assert.equal(display.canExport, false);
  u.host.componentWillUnmount();
});

test('no missing, false or stale runtime predicate can expose or fetch the saved-input mode', async () => {
  for (const value of [undefined, {}, { runtime: {}, isFeatureEnabled: () => 'true' }]) {
    const u = fixture(); u.host.context = value; u.mount();
    assert.equal(u.tree(), null); await resolver(u); assert.equal(u.calls.length, 0); u.host.componentWillUnmount();
  }
  const u = fixture(); u.mount(); u.immediateOff();
  assert.equal(u.tree(), null); await resolver(u); assert.equal(u.calls.length, 0); u.host.componentWillUnmount();
});

test('closed saved-input props reject missing/raw/private additions and mixed legacy context without IO', async () => {
  for (const mutate of [p => { p.savedInput.raw_memo = 'PRIVATE'; }, p => { delete p.savedInput.savedInputId; },
    p => { p.savedInput.savedInputId = 'not-uuid'; }, p => { p.savedInput.savedInputId = '00000000-0000-0000-0000-000000000000'; },
    p => { p.savedInput.expectedUserId = ''; }, p => { p.savedInput.idempotencyKey = ' invalid '; },
    p => { p.context = { enabled: true }; }]) {
    const u = fixture(); mutate(u.host.props); u.mount();
    assert.equal(u.tree(), null); await resolver(u); assert.equal(u.calls.length, 0); u.host.componentWillUnmount();
  }
});

test('duplicate source presses send one GET and never automatically start preview', async () => {
  const f = fixture(), d = f.deferred(), u = fixture({ send: () => d.promise });
  u.mount(); const first = resolver(u); await resolver(u); await tick();
  assert.equal(u.calls.length, 1); assert.deepEqual(u.names(), []);
  d.resolve(packet(ref())); await first; await resolver(u);
  assert.equal(u.calls.length, 1); assert.equal(u.host.state.open, false); u.host.componentWillUnmount();
});

for (const boundary of ['close', 'source', 'owner', 'key', 'runtime', 'background', 'unmount']) {
  test(`source ${boundary} fences late success before any preview request`, async () => {
    const f = fixture(), d = f.deferred(), u = fixture({ send: () => d.promise });
    u.mount(); const pending = resolver(u); await tick();
    if (boundary === 'close') u.host.close();
    if (boundary === 'runtime') u.publish(true);
    if (boundary === 'source') u.host.props = { savedInput: { ...u.host.props.savedInput, savedInputId: OTHER } };
    if (boundary === 'owner') u.host.props = { savedInput: { ...u.host.props.savedInput, expectedUserId: OTHER } };
    if (boundary === 'key') u.host.props = { savedInput: { ...u.host.props.savedInput, idempotencyKey: 'next-key' } };
    if (boundary === 'background') u.background('inactive');
    if (boundary === 'unmount') u.host.componentWillUnmount();
    if (['runtime', 'source', 'owner', 'key'].includes(boundary)) assert.equal(u.tree(), null, 'before lifecycle cleanup');
    d.resolve(packet(ref())); await pending;
    assert.equal(u.calls.length, 1); assert.equal(u.body(), undefined); assert.equal(u.refreshes(), 0);
    if (boundary !== 'unmount') { u.host.componentDidUpdate(); u.host.componentWillUnmount(); }
  });
}

for (const [code, status] of [['PIECE_SOURCE_NOT_FOUND', 404], ['PIECE_SOURCE_NOT_ELIGIBLE', 422],
  ['PIECE_AUTH_REQUIRED', 401], ['PIECE_FEATURE_DISABLED', 503]]) {
  test(`source ${code} is closed without generation or automatic retry`, async () => {
    const u = fixture({ send: async () => packet({ code }, status) }); u.mount(); await resolver(u);
    assert.equal(u.calls.length, 1); assert.deepEqual(u.names(), []);
    assert.ok(u.nodes(u.tree()).some(n => n.props.accessibilityRole === 'alert'));
    u.host.close(); await resolver(u); u.host.start(); await tick();
    assert.equal(u.calls.length, 1); assert.equal(u.refreshes(), code === 'PIECE_FEATURE_DISABLED' ? 1 : 0);
    assert.equal(u.body(), undefined); u.host.componentWillUnmount();
  });
}

test('source transport failure retries only the same explicit GET; preview failure retries the same POST/key', async () => {
  let gets = 0, posts = 0;
  const f = fixture();
  const u = fixture({ send: async (_url, options) => {
    if (options.method === 'GET') { if (++gets === 1) throw Error('PRIVATE'); return packet(ref()); }
    if (++posts === 1) throw Error('PRIVATE'); return packet(f.expected);
  } });
  u.mount(); await resolver(u); await tick();
  assert.equal(gets, 1); assert.equal(posts, 0); assert.doesNotMatch(JSON.stringify(u.tree()), /PRIVATE/);
  await resolver(u); assert.equal(gets, 2); assert.equal(posts, 0);
  u.host.start(); await tick(); assert.equal(posts, 1);
  u.host.retry(); await tick(); assert.equal(posts, 2); assert.equal(gets, 2);
  assert.equal(u.calls[2][1].body, u.calls[3][1].body);
  assert.equal(u.calls[2][1].headers['Idempotency-Key'], u.calls[3][1].headers['Idempotency-Key']);
  assert.equal(u.body().children.join(''), f.expected.piece_text); u.host.componentWillUnmount();
});

test('a different saved input cannot reuse the previous owner/key for a changed preview request', async () => {
  const f = fixture();
  const u = fixture({ send: async (url, options) => packet(options.method === 'GET' ? ref(url.split('/').pop()) : f.expected) });
  u.mount(); await resolver(u); u.host.start(); await tick();
  u.host.props = { savedInput: { ...u.host.props.savedInput, savedInputId: OTHER } };
  assert.equal(u.tree(), null); u.host.componentDidUpdate();
  await resolver(u); u.host.start(); await tick();
  assert.equal(u.calls.filter(([, o]) => o.method === 'POST').length, 1);
  assert.equal(u.host.controller.getView().phase, 'unavailable');
  assert.match(JSON.stringify(u.tree()), /状態が変わっています/);
  u.host.props = { savedInput: { ...u.host.props.savedInput, idempotencyKey: 'explicit-new-key' } };
  u.host.componentDidUpdate(); await resolver(u); u.host.start(); await tick();
  assert.equal(u.calls.filter(([, o]) => o.method === 'POST').length, 2); u.host.componentWillUnmount();
});

test('runtime or foreground return never revives an old received preview or resends a request', async () => {
  const u = fixture(); u.mount(); await resolver(u); u.host.start(); await tick(); assert.ok(u.body());
  u.publish(false); assert.equal(u.tree(), null); u.host.componentDidUpdate();
  u.publish(true); u.host.componentDidUpdate();
  assert.equal(u.body(), undefined); assert.deepEqual(u.names(), ['保存入力を確認']);
  u.background('background'); u.background('active'); await tick();
  assert.equal(u.calls.length, 2); assert.equal(u.body(), undefined); u.host.componentWillUnmount();
});

test('obsolete source-disabled response does not refresh the next account/runtime', async () => {
  const f = fixture(), d = f.deferred(), u = fixture({ send: () => d.promise });
  u.mount(); const pending = resolver(u); await tick(); u.publish(true);
  d.resolve(packet({ code: 'PIECE_FEATURE_DISABLED' }, 503)); await pending;
  assert.equal(u.refreshes(), 0); assert.equal(u.tree(), null);
  u.host.componentDidUpdate(); u.host.componentWillUnmount();
});


test('a source read returning to the same retained request still publishes the ready UI', async () => {
  const f = fixture(), d = f.deferred(); let count = 0;
  const u = fixture({ send: async () => ++count === 1 ? packet(ref()) : d.promise });
  u.mount(); await resolver(u);
  const first = copy(u.host.props);
  u.host.props = { savedInput: { ...first.savedInput, savedInputId: OTHER } };
  u.host.componentDidUpdate();
  u.host.props = first; u.host.componentDidUpdate();
  const pending = resolver(u); await tick();
  const writes = u.host.updateCount;
  d.resolve(packet(ref())); await pending;
  assert.ok(u.host.updateCount > writes, 'ready must request a render even when controller context is equivalent');
  assert.deepEqual(u.names(), ['この入力をPieceにする']);
  assert.equal(u.calls.length, 2); u.host.componentWillUnmount();
});

for (const completed of [false, true]) {
  test(`saved-input cancellation ${completed ? 'success' : 'unknown'} survives background runtime off/refresh without authoring`, async () => {
    const f = fixture(), d = f.deferred();
    const receipt = { preview_id: f.expected.preview_id, preview_revision: 1, row_version: 2,
      lifecycle_status: 'cancelled', idempotency_replayed: completed };
    let deletes = 0;
    const u = fixture({ send: async (_url, opt) => {
      if (opt.method === 'GET') return packet(ref());
      if (opt.method === 'POST') return packet(f.expected);
      assert.equal(opt.method, 'DELETE');
      return ++deletes === 1 && !completed ? d.promise : packet(receipt);
    } });
    u.mount(); await resolver(u); u.host.start(); await tick();
    const cancel = u.nodes(u.tree()).find(n => n.props.title === '候補を取り消す');
    cancel.props.onPress(); await tick();
    u.background('inactive'); u.publish(false); u.host.componentDidUpdate();
    assert.equal(u.tree(), null); assert.equal(u.body(), undefined);
    d.resolve(packet(receipt)); await tick();
    u.background('active'); assert.equal(u.tree(), null);
    u.publish(true); u.host.componentDidUpdate();
    await resolver(u); u.host.start(); await tick();
    assert.equal(u.calls.length, 3, 'no source read or preview replay on return');
    assert.equal(u.body(), undefined);
    if (!completed) {
      assert.deepEqual(u.names(), ['同じ候補の取消を再試行']);
      u.advance(2000);
      u.nodes(u.tree()).find(n => n.props.title === '同じ候補の取消を再試行').props.onPress();
      await tick();
      assert.equal(u.calls.length, 4);
      assert.equal(u.calls[2][0], u.calls[3][0]); assert.equal(u.calls[2][1].body, u.calls[3][1].body);
    }
    assert.equal(u.host.controller.getView().phase, 'cancelled');
    u.host.componentWillUnmount();
  });
}
for (const changed of ['owner', 'input', 'key']) {
  test(`saved-input suspended cancellation cannot survive ${changed} A-B-A while runtime stays off`, async () => {
    const f = fixture(), d = f.deferred();
    const u = fixture({ send: async (_url, opt) => opt.method === 'GET' ? packet(ref()) :
      opt.method === 'POST' ? packet(f.expected) : d.promise });
    u.mount(); await resolver(u); u.host.start(); await tick();
    u.nodes(u.tree()).find(n => n.props.title === '候補を取り消す').props.onPress(); await tick();
    u.background('inactive'); u.publish(false); u.host.componentDidUpdate();
    const original = { ...u.host.props.savedInput }, next = { ...original };
    next[{ owner: 'expectedUserId', input: 'savedInputId', key: 'idempotencyKey' }[changed]] = OTHER;
    u.host.props = { savedInput: next }; u.host.componentDidUpdate();
    u.host.props = { savedInput: original }; u.host.componentDidUpdate();
    u.background('active'); u.publish(true); u.host.componentDidUpdate();
    assert.deepEqual(u.names(), ['保存入力を確認']);
    assert.equal(u.host.controller.getView().preview, null);
    u.host.retry(); await tick(); assert.equal(u.calls.length, 3);
    d.resolve(packet({ preview_id: f.expected.preview_id, preview_revision: 1, row_version: 2,
      lifecycle_status: 'cancelled', idempotency_replayed: false }));
    await tick(); assert.deepEqual(u.names(), ['保存入力を確認']); u.host.componentWillUnmount();
  });
}


for (const completed of [false, true]) {
  test(`saved-input save ${completed ? 'success' : 'unknown'} survives background/runtime pause without GET or preview POST`, async () => {
    const f = fixture(), d = f.deferred(); let saves = 0;
    const u = fixture({ admitSave: true, saveEnabled: true, send: async (url, opt) => {
      if (opt.method === 'GET') return packet(ref());
      if (!url.endsWith('/save')) return packet(f.expected);
      return ++saves === 1 && !completed ? d.promise : packet(f.saveReceipt({ idempotency_replayed: saves > 1 }));
    } });
    u.mount(); await resolver(u); u.host.start(); await tick(); const pending = u.startSave(); await tick();
    u.background('inactive'); u.publish(false); u.host.componentDidUpdate();
    assert.equal(u.tree(), null); d.resolve(packet(f.saveReceipt())); await pending;
    u.background('active'); u.publish(true); u.host.componentDidUpdate();
    await resolver(u); u.host.start(); await tick();
    assert.equal(u.calls.length, 3); assert.equal(u.body(), undefined);
    assert.doesNotMatch(JSON.stringify(u.tree()), /保存入力を確認|この入力をPieceにする/);
    if (!completed) {
      assert.deepEqual(u.names(), ['同じ保存要求で結果を確認']); u.advance(2000);
      u.nodes(u.tree()).find(n => n.props.title === '同じ保存要求で結果を確認').props.onPress(); await tick();
      assert.equal(u.calls.length, 4); assert.equal(u.calls[2][1].body, u.calls[3][1].body);
      assert.equal(u.calls[2][1].headers['Idempotency-Key'], u.calls[3][1].headers['Idempotency-Key']);
    }
    assert.equal(u.host.controller.getView().phase, 'saved');
    assert.match(JSON.stringify(u.tree()), /Pieceを保存しました。/); u.host.componentWillUnmount();
  });
}
for (const changed of ['owner', 'input', 'key']) {
  test(`suspended save cannot survive ${changed} A-B-A while runtime remains off`, async () => {
    const f = fixture(), d = f.deferred();
    const u = fixture({ admitSave: true, saveEnabled: true, send: async (url, opt) => opt.method === 'GET'
      ? packet(ref()) : url.endsWith('/save') ? d.promise : packet(f.expected) });
    u.mount(); await resolver(u); u.host.start(); await tick(); const pending = u.startSave(); await tick();
    u.background('inactive'); u.publish(false); u.host.componentDidUpdate();
    const original = { ...u.host.props.savedInput }, next = { ...original };
    next[{ owner: 'expectedUserId', input: 'savedInputId', key: 'idempotencyKey' }[changed]] = OTHER;
    u.host.props = { savedInput: next }; u.host.componentDidUpdate();
    u.host.props = { savedInput: original }; u.host.componentDidUpdate();
    u.background('active'); u.publish(true); u.host.componentDidUpdate();
    assert.deepEqual(u.names(), ['保存入力を確認']); u.host.retry(); assert.equal(u.calls.length, 3);
    d.resolve(packet(f.saveReceipt())); await pending;
    assert.deepEqual(u.names(), ['保存入力を確認']); u.host.componentWillUnmount();
  });
}
test('saved-input save flag must be strict true for retry; immediate off hides stale callbacks before lifecycle', async () => {
  const f = fixture(); let saves = 0;
  const u = fixture({ admitSave: true, saveEnabled: true, send: async (url, opt) => {
    if (opt.method === 'GET') return packet(ref());
    if (!url.endsWith('/save')) return packet(f.expected);
    if (++saves === 1) throw Error('lost ACK');
    return packet(f.saveReceipt({ idempotency_replayed: true }));
  } });
  u.mount(); await resolver(u); u.host.start(); await tick(); await u.startSave(); u.host.close();
  const retry = u.nodes(u.tree()).find(n => n.props.title === '同じ保存要求で結果を確認');
  for (const value of [false, 'true', undefined]) {
    u.immediateSave(value); assert.equal(u.tree(), null); retry.props.onPress(); await tick();
    assert.equal(saves, 1); u.host.componentDidUpdate();
    assert.deepEqual(u.names(), []); assert.match(JSON.stringify(u.tree()), /保存結果を確認できませんでした/);
    u.publishSave(true); u.host.componentDidUpdate();
  }
  u.host.retry(); await tick(); assert.equal(saves, 2); assert.equal(u.calls.length, 4);
  assert.equal(u.calls[2][1].body, u.calls[3][1].body); u.host.componentWillUnmount();
});
test('runtime publication with unchanged flags still abandons the pending save response', async () => {
  const f = fixture(), d = f.deferred();
  const u = fixture({ admitSave: true, saveEnabled: true, send: async (url, opt) => opt.method === 'GET'
    ? packet(ref()) : url.endsWith('/save') ? d.promise : packet(f.expected) });
  u.mount(); await resolver(u); u.host.start(); await tick(); const pending = u.startSave(); await tick();
  u.publish(true); assert.equal(u.tree(), null); u.host.componentDidUpdate();
  d.resolve(packet(f.saveReceipt())); await pending;
  assert.equal(u.host.controller.getView().phase, 'unavailable');
  assert.deepEqual(u.names(), ['同じ保存要求で結果を確認']); assert.equal(u.calls.length, 3);
  u.host.componentWillUnmount();
});

for (const changed of ['input', 'key']) for (const backToA of [false, true]) {
  test(`background save ${changed} A-B${backToA ? '-A' : ''} clears the hidden intent with unchanged runtime`, async () => {
    const f = fixture(), d = f.deferred();
    const u = fixture({ admitSave: true, saveEnabled: true, send: async (url, opt) => opt.method === 'GET'
      ? packet(ref()) : url.endsWith('/save') ? d.promise : packet(f.expected) });
    u.mount(); await resolver(u); u.host.start(); await tick(); const pending = u.startSave(); await tick();
    u.background('inactive');
    const original = { ...u.host.props.savedInput }, next = { ...original };
    next[changed === 'input' ? 'savedInputId' : 'idempotencyKey'] = OTHER;
    u.host.props = { savedInput: next }; u.host.componentDidUpdate();
    if (backToA) { u.host.props = { savedInput: original }; u.host.componentDidUpdate(); }
    u.background('active');
    assert.deepEqual(u.names(), ['保存入力を確認']); u.host.retry(); await tick(); assert.equal(u.calls.length, 3);
    d.resolve(packet(f.saveReceipt())); await pending;
    assert.deepEqual(u.names(), ['保存入力を確認']);
    assert.notEqual(u.host.controller.getView().retryKind, 'save'); u.host.componentWillUnmount();
  });
}

test('same-runtime save-only flag changes preserve received preview, source readiness and display ticket', async () => {
  const u = fixture({ saveEnabled: true });
  u.mount(); await resolver(u); u.host.start(); await tick();
  const before = u.host.controller.getView();
  assert.ok(u.body()); assert.equal(u.host.state.open, true);
  for (const value of [false, true]) {
    u.immediateSave(value); assert.equal(u.tree(), null); u.host.componentDidUpdate();
    const after = u.host.controller.getView();
    assert.equal(after.preview, before.preview); assert.equal(after.visualToken, before.visualToken);
    assert.equal(u.body().children.join(''), u.expected.piece_text);
    assert.equal(u.host.sourcePhase, 'ready'); assert.equal(u.host.state.open, true);
    await resolver(u); assert.equal(u.calls.length, 2);
    assert.equal(u.read(after).canSave, false); assert.equal(u.read(after).canExport, false);
  }
  u.publish(true); u.host.componentDidUpdate();
  assert.equal(u.body(), undefined); assert.deepEqual(u.names(), ['保存入力を確認']);
  assert.equal(u.calls.length, 2);
  u.host.componentWillUnmount();
});
