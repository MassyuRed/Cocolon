'use strict';
// Actual existing Piece API/model/controller/host. React/native, HTTP/Auth,
// runtime publication and clock are doubles. InputScreen is NOT mounted here.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
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
  return { ...u, expected, deferred: f.deferredPieceResponse,
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
