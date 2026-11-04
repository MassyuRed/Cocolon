'use strict';
// Actual API/model/controller/UI source with synthetic Auth/HTTP/React/native.
// No live user data, mutations, image rendering or on-device acceptance.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '..');
const OWNER = '10000000-0000-4000-8000-000000000001';
const PID = '30000000-0000-4000-8000-000000000003';
const RID = '40000000-0000-4000-8000-000000000004';
const copy = value => JSON.parse(JSON.stringify(value));
const packet = (value, status = 200) => ({ status, json: async () => value });
const tick = () => new Promise(resolve => setImmediate(resolve));
const flags = { piece_v2_owner_read_enabled: true, piece_v2_visibility_toggle_enabled: true,
  piece_v2_public_write_enabled: true, piece_v2_delete_enabled: true };
function record(extra = {}) {
  // Reuse the established synthetic artifact, not a private user example.
  const source = fs.readFileSync(path.join(__dirname, 'piece-v2-contracts.test.js'), 'utf8').split("test('B10 API owner exists")[0];
  const context = vm.createContext({ require, __dirname });
  vm.runInContext(source + '\nglobalThis.sample = preview("quote");', context);
  const value = copy(context.sample);
  for (const k of ['preview_id', 'preview_revision', 'expires_at', 'eligible_formats', 'quota', 'plan_capabilities']) delete value[k];
  return { ...value, export_contract_version: 'piece.export_contract.v1', render_interface_version: 'piece.render_interface.v1',
    render_reproducibility_version: 'piece.render_reproducibility.v1', piece_id: PID, public_id: 'piece:' + PID,
    lifecycle_status: 'saved', saved_at: '2026-10-10T01:00:00+00:00', row_version: 2,
    renderer_version: 'piece.rn_native_preview.prototype.v3', ...extra };
}
function harness({ send, session, random, exportPrepare, os = 'ios' } = {}) {
  const calls = [], sessions = [], alerts = [], appListeners = new Set();
  const React = { Component: class {
    constructor(props) { this.props = props; this.state = {}; }
    setState(v) { this.state = { ...this.state, ...(typeof v === 'function' ? v(this.state) : v) }; }
  }, createElement: (type, props, ...children) => typeof type === 'function' ? type(props || {}) : { type, props: props || {}, children } };
  const context = vm.createContext({ React, AbortController, Uint8Array, Date, Object, JSON,
    Platform: { OS: os },
    crypto: { getRandomValues: random || (bytes => crypto.randomFillSync(bytes)) },
    apiFetch: async (...args) => { calls.push(args); return send ? send(...args) : packet(record()); },
    getAccessToken: async owner => { sessions.push(owner); return session ? session(owner, sessions.length) : 'synthetic'; },
    Alert: { alert: (...args) => alerts.push(args) },
    AppState: { currentState: 'active', addEventListener: (event, fn) => { appListeners.add(fn); return { remove: () => appListeners.delete(fn) }; } },
    require: name => {assert.equal(name,'../features/piece/pieceExport');return {preparePieceExportPrototype:exportPrepare || (async()=>{throw Error('disabled');})};},
    PieceExportCanvas: 'PieceExportCanvas', PieceVisualCard: 'PieceVisualCard', View: 'View', Text: 'Text', ScrollView: 'ScrollView', Button: 'Button', SafeAreaView: 'SafeAreaView', ActivityIndicator: 'ActivityIndicator',
  });
  // Each ESM module retains a distinct scope, as in the application bundle.
  const exports = [
    ['features/piece/piecePalette.js', ['PIECE_THEME_COLORS', 'PIECE_THEME_LABELS', 'PIECE_LEGACY_THEME_IDS', 'PIECE_THEME_IDS', 'PIECE_VISUAL_CATALOG_V1']],
    ['features/piece/pieceApi.js', ['PieceApiError', 'readPiecePreviewSnapshot', 'preparePiecePreviewRequest', 'requestPieceOwner', 'readPieceOwnerSnapshot', 'isPieceHistoryRecordOlder']],
    ['features/piece/piecePreviewModel.js', ['verifyPieceArtifactHashes']],
    ['features/piece/pieceOwnerModel.js', ['readPieceOwnerDisplay', 'pieceOwnerPermissions']],
    ['features/piece/pieceLayout.js', ['supportsPieceSavedImage']],
    ['features/piece/PieceOwnerHistoryController.js', ['createPieceOwnerHistoryController']],
    ['components/piece/PieceOwnerCard.js', ['PieceOwnerCard']],
    ['screens/PieceOwnerHistoryScreen.js', ['PieceOwnerHistoryHost']],
  ];
  for (const [file, names] of exports) {
    const source = fs.readFileSync(path.join(ROOT, file), 'utf8').replace(/^import .*;$/gm, '').replace(/^export default /gm, '').replace(/^export /gm, '');
    vm.runInContext(`{\n${source}\n${names.map(n => `globalThis.${n} = ${n};`).join('\n')}\n}`, context, { filename: file });
  }
  const controller = context.createPieceOwnerHistoryController();
  controller.setContext({ enabled: true, expectedUserId: OWNER, flags });
  return { ...context, controller, calls, sessions, alerts,
    background: value => { for (const fn of appListeners) fn(value); } };
}
const detailInput = { piece_id: PID };
const options = { expectedUserId: OWNER };
const err = code => error => error.code === code && !('body' in error) && !('cause' in error);
const page = items => ({ api_contract_version: 'piece.api.v2', items, next_cursor: null });
async function open(h) { await h.controller.loadHistory(); await h.controller.openDetail(PID); }
function ownerSend(url, init) {
  if (url.includes('/history')) return packet(page([record()]));
  return packet(record());
}
function nodes(tree) {
  if (!tree || typeof tree !== 'object') return [];
  return [tree, ...(tree.children || []).flat(Infinity).flatMap(nodes)];
}
function texts(tree) { return nodes(tree).flatMap(n => n.children || []).filter(x => typeof x === 'string'); }

test('owner history and detail use dedicated no-store routes with both session checks', async () => {
  const h = harness({ send: ownerSend }); await open(h);
  assert.equal(h.calls[0][0], '/emotion/piece/history?limit=20');
  assert.equal(h.calls[1][0], '/emotion/piece/' + PID);
  for (const [, init] of h.calls) {
    assert.equal(init.headers['Cache-Control'], 'no-store'); assert.equal(init.auth, true);
    assert.equal(init.expectedUserId, OWNER); assert.equal(init.body, undefined);
  }
  assert.equal(h.sessions.length, 4);
  assert.equal(h.controller.getView().record.piece_text, record().piece_text);
});

test('expanded palette records coexist with unchanged legacy records in owner history, detail and export', async () => {
  const legacy = record();
  const palette = record({ piece_id: RID, public_id: 'piece:' + RID, saved_at: '2026-10-10T00:59:00+00:00',
    renderer_version: 'piece.rn_bitmap_renderer.ios.v2' });
  palette.visual_recipe.theme.theme_id = 'forest_mint';
  const canonical = value => value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
  palette.visual_recipe_hash = crypto.createHash('sha256')
    .update(JSON.stringify(canonical(palette.visual_recipe))).digest('hex');
  const h = harness({ send: async url => url.includes('/history') ? packet(page([legacy, palette])) : packet(palette) });
  const history = await h.requestPieceOwner('history', {cursor: null}, options);
  assert.deepEqual(copy(history.items), [legacy, palette]);
  const labels = history.items.map(saved => texts(h.PieceOwnerCard({ record: saved })).join(' '));
  assert.match(labels[0], /ソフトペーパー/);
  assert.match(labels[1], /深緑 × ミント/);
  for (const action of ['detail', 'export']) {
    const saved = await h.requestPieceOwner(action, { piece_id: RID }, options);
    assert.deepEqual(copy(saved), palette);
    assert.equal(h.readPieceOwnerDisplay(saved).visual_recipe.theme.theme_id, 'forest_mint');
  }
  for (const [, init] of h.calls) assert.equal(init.headers['X-Piece-Palette'], '2');
});

test('export preparation uses its independent authenticated no-store endpoint',async()=>{
  const h=harness({send:ownerSend});
  const saved=await h.requestPieceOwner('export',detailInput,options);
  assert.equal(saved.piece_id,PID);
  assert.equal(h.calls[0][0],'/emotion/piece/'+PID+'/export');
  assert.equal(h.calls[0][1].headers['Cache-Control'],'no-store');
  assert.equal(h.sessions.length,2);
});

for (const mutation of [r => { r.owner_user_id = OWNER; }, r => { r.public_id = 'piece:' + RID; },
  r => { r.lifecycle_status = 'preview_draft'; }, r => { r.visibility_scope = null; },
  r => { r.row_version = 0; }, r => { r.export_contract_version = 'unknown'; },
  r => { r.piece_text += '!'; }, r => { r.visual_recipe.theme.theme_id = 'unknown'; }]) {
  test('invalid saved owner artifact is never displayed: ' + mutation.toString(), () => {
    const h = harness(); const value = record(); mutation(value);
    assert.throws(() => h.readPieceOwnerDisplay(value));
  });
}
for (const key of ['piece_text_hash', 'content_payload_hash', 'visual_recipe_hash']) test('saved display rejects corrupt ' + key, () => {
  const h = harness(); const value = record({ [key]: 'a'.repeat(64) });
  assert.throws(() => h.readPieceOwnerDisplay(value), err('PIECE_HASH_MISMATCH'));
});
test('saved artifact is independent of preview expiry, source, quota and current subscription', async () => {
  const h = harness(); const result = await h.requestPieceOwner('detail', detailInput, options);
  assert.equal(h.readPieceOwnerDisplay(result).format_type, 'quote');
  assert.equal(h.calls.length, 1); assert.equal(result.quota, undefined);
});
for (const status of [401, 503]) test('session/feature failure is not empty history ' + status, async () => {
  const code = status === 401 ? 'PIECE_AUTH_REQUIRED' : 'PIECE_FEATURE_DISABLED';
  const h = harness({ send: () => packet({ code }, status) });
  await h.controller.loadHistory(); assert.equal(h.controller.getView().phase, 'hidden');
  await h.controller.loadHistory(); assert.equal(h.calls.length, 1);
});
test('wrong status or body-bearing error is sanitized', async () => {
  const h = harness({ send: () => packet({ code: 'PIECE_NOT_FOUND', private_body: 'hidden' }, 404) });
  await assert.rejects(h.requestPieceOwner('detail', detailInput, options), err('PIECE_TEMPORARILY_UNAVAILABLE'));
});
test('auth change after HTTP suppresses successful private result', async () => {
  const h = harness({ session: (_, count) => count === 1 ? 'token' : null });
  await assert.rejects(h.requestPieceOwner('detail', detailInput, options), err('PIECE_AUTH_REQUIRED'));
});
test('account change fences transport that ignores AbortSignal', async () => {
  let release; const wait = new Promise(resolve => { release = resolve; });
  const h = harness({ send: () => wait }); const pending = h.controller.loadHistory(); await tick();
  h.controller.setContext({ enabled: true, expectedUserId: RID, flags });
  release(packet(page([record()]))); await pending;
  assert.equal(h.controller.getView().phase, 'idle'); assert.equal(h.controller.getView().items.length, 0);
});
test('preview/save flags are irrelevant to owner recovery but owner-read off sends nothing', async () => {
  const h = harness({ send: ownerSend }); await open(h); assert.equal(h.calls.length, 2);
  h.controller.setContext({ enabled: true, expectedUserId: OWNER, flags: {} });
  await h.controller.loadHistory(); assert.equal(h.calls.length, 2); assert.equal(h.controller.getView().phase, 'hidden');
});
test('visibility request sends exact version/scope and confirms with fresh saved detail', async () => {
  let changed = false;
  const h = harness({ send: (url, init) => {
    if (init.method === 'PATCH') { changed = true; return packet({ piece_id: PID, visibility_scope: 'public', row_version: 3 }); }
    return url.includes('/history') ? packet(page([record()])) : packet(record(changed ? { visibility_scope: 'public', row_version: 3 } : {}));
  } }); await open(h); await h.controller.setVisibility('public');
  assert.deepEqual(JSON.parse(h.calls[2][1].body), { expected_row_version: 2, visibility_scope: 'public' });
  assert.equal(h.calls[3][1].method, 'GET'); assert.equal(h.controller.getView().record.visibility_scope, 'public');
});
test('visibility conflict refetches once without silent overwrite', async () => {
  const h = harness({ send: (url, init) => init.method === 'PATCH' ? packet({ code: 'PIECE_CONFLICT' }, 409) : ownerSend(url, init) });
  await open(h); await h.controller.setVisibility('public');
  assert.equal(h.calls.length, 4); assert.match(h.controller.getView().message, /状態が変わって/);
  assert.equal(h.controller.getView().record.visibility_scope, 'private');
});

for (const direct of [false, true]) for (const changed of [false, true]) {
  test(`${direct ? 'saved entry' : 'ordinary history'} explicitly rereads the selected detail after ${changed ? 'acknowledged visibility change' : 'initial read'} response loss`, async () => {
    let acknowledged = false, failures = changed ? 0 : 1, finish;
    const fresh = record({ row_version: 3, visibility_scope: 'public' });
    const h = harness({ send: (url, init) => {
      if (url.includes('/history')) return packet(page([record()]));
      if (init.method === 'PATCH') {
        acknowledged = true; failures = 1;
        return packet({ piece_id: PID, visibility_scope: 'public', row_version: 3 });
      }
      if (failures-- > 0) throw Error('lost selected detail');
      if (!changed || acknowledged) return new Promise(resolve => { finish = resolve; });
      return packet(record());
    } });
    const host = ownerHost(h, direct ? savedEntry() : null, { flags });
    host.componentDidMount();
    if (direct) await tick();
    else { await host.act('loadHistory'); await host.act('openDetail', PID); }
    if (changed) await host.act('setVisibility', 'public');
    const view = host.controller.getView(), before = h.calls.length;
    assert.equal(view.phase, 'unavailable'); assert.equal(view.canRetryDetail, true);
    assert.equal(view.record, null); assert.equal(view.items.length, 0);
    assert.equal(nodes(host.render()).filter(n => n.type === 'PieceVisualCard').length, 0);
    assert.equal(texts(host.render()).includes(record().piece_text), false);
    assert.equal(view.message.includes('公開範囲を変更しました'), false, 'do not present old detail after the ACK');
    await host.act('openDetail', RID); await host.act('retryDetail', {});
    assert.equal(h.calls.length, before, 'a retained target does not admit arbitrary IDs or tokens');
    const retry = button(host, direct ? '保存したPieceを読み込む' : '同じPieceを読み込み直す');
    const pending = retry.props.onPress(); retry.props.onPress(); await tick();
    assert.equal(h.calls.length, before + 1, 'one explicit reread, with no mutation replay');
    const [url, init] = h.calls.at(-1);
    assert.equal(url, '/emotion/piece/' + PID); assert.equal(init.method, 'GET');
    assert.equal(init.body, undefined); assert.equal(init.headers['Idempotency-Key'], undefined);
    finish(packet(fresh)); await pending;
    assert.equal(host.controller.getView().record.row_version, 3);
    assert.equal(host.controller.getView().record.visibility_scope, 'public');
    assert.equal(host.controller.getView().message, changed ? '公開範囲を変更しました。' : '');
    assert.equal(host.controller.getView().canRetryDetail, false);
    await retry.props.onPress(); assert.equal(h.calls.length, before + 1, 'the consumed callback cannot read again');
    assert.equal(h.calls.filter(([, item]) => item.method === 'PATCH').length, changed ? 1 : 0);
    host.componentWillUnmount();
  });
}

test('a second lost detail read rotates its token and retains the acknowledged notice until a fresh GET', async () => {
  let changed = false, fail = true;
  const h = harness({ send: (url, init) => {
    if (url.includes('/history')) return packet(page([record()]));
    if (init.method === 'PATCH') { changed = true; return packet({ piece_id: PID, visibility_scope: 'public', row_version: 3 }); }
    if (changed && fail) throw Error('detail unavailable');
    return packet(record(changed ? { visibility_scope: 'public', row_version: 3 } : {}));
  } });
  const host = ownerHost(h, null, { flags }); host.componentDidMount();
  await host.act('loadHistory'); await host.act('openDetail', PID); await host.act('setVisibility', 'public');
  const old = button(host, '同じPieceを読み込み直す');
  await old.props.onPress(); const count = h.calls.length;
  assert.equal(host.controller.getView().canRetryDetail, true);
  fail = false; await old.props.onPress(); assert.equal(h.calls.length, count);
  await button(host, '同じPieceを読み込み直す').props.onPress();
  assert.equal(host.controller.getView().message, '公開範囲を変更しました。');
  assert.equal(h.calls.length, count + 1); host.componentWillUnmount();
});

for (const boundary of ['owner', 'target', 'read revoked', 'history', 'close', 'background', 'unmount']) {
  test(`failed-detail reread cannot survive ${boundary}`, async () => {
    const h = harness({ send: url => url.includes('/history') ? packet(page([record()])) : Promise.reject(Error('lost detail')) });
    const host = ownerHost(h, null, { flags }); host.componentDidMount();
    await host.act('loadHistory'); await host.act('openDetail', PID);
    const retry = button(host, '同じPieceを読み込み直す'); assert.ok(retry);
    if (boundary === 'owner') host.props = { ...host.props, owner: RID };
    if (boundary === 'target') host.props = { ...host.props, savedPiece: savedEntry(RID) };
    if (boundary === 'read revoked') host.props = { ...host.props, flags: {} };
    if (['owner', 'target', 'read revoked'].includes(boundary)) host.componentDidUpdate();
    if (boundary === 'history') await host.act('loadHistory');
    if (boundary === 'close') host.controller.close();
    if (boundary === 'background') { h.background('inactive'); h.background('active'); }
    if (boundary === 'unmount') host.componentWillUnmount();
    await tick(); const count = h.calls.length;
    await retry.props.onPress(); assert.equal(h.calls.length, count);
    if (boundary !== 'unmount') host.componentWillUnmount();
  });
}

for (const pause of ['background', 'runtime', 'both']) for (const delayed of [false, true]) for (const acknowledged of [false, true]) {
  test(`ordinary detail recovery survives ${pause} after ${delayed ? 'in-flight' : 'failed'} GET with visibility ACK ${acknowledged}`, async () => {
    let changed = false, fail = !acknowledged, finish;
    const wait = new Promise(resolve => { finish = resolve; });
    const fresh = record({ row_version: 3, visibility_scope: 'public' });
    const h = harness({ send: (url, init) => {
      if (url.includes('/history')) return packet(page([record()]));
      if (init.method === 'PATCH') {
        changed = true; fail = true;
        return packet({ piece_id: PID, visibility_scope: 'public', row_version: 3 });
      }
      if (fail) return delayed ? wait : Promise.reject(Error('detail response lost'));
      return packet(changed || !acknowledged ? fresh : record());
    } });
    const host = ownerHost(h, null, { flags, presentationActive: true, runtimePending: false });
    host.componentDidMount(); await host.act('loadHistory');
    const pending = acknowledged
      ? (await host.act('openDetail', PID), host.act('setVisibility', 'public'))
      : host.act('openDetail', PID);
    await tick(); if (!delayed) await pending;
    const stale = host.controller.getView().detailRetryToken;
    const original = host.props, calls = h.calls.length;
    if (pause !== 'runtime') h.background('inactive');
    if (pause !== 'background') {
      host.props = { ...original, enabled: false, flags: {}, runtimePending: true };
      host.componentDidUpdate();
    }
    assert.equal(host.controller.getView().record, null);
    assert.equal(host.controller.getView().items.length, 0);
    assert.equal(button(host, '同じPieceを読み込み直す'), undefined);
    if (delayed) { finish(packet(record())); await pending; }
    fail = false;
    if (pause !== 'runtime') h.background('active');
    host.props = original; host.componentDidUpdate(); await tick();
    assert.equal(h.calls.length, calls, 'resume must not issue a request');
    assert.equal(host.controller.getView().record, null);
    assert.equal(texts(host.render()).includes(record().piece_text), false);
    assert.equal(host.controller.getView().canRetryDetail, true);
    await host.act('retryDetail', stale); assert.equal(h.calls.length, calls);
    const retry = button(host, '同じPieceを読み込み直す'); assert.ok(retry);
    await retry.props.onPress();
    assert.equal(h.calls.length, calls + 1);
    assert.equal(h.calls.at(-1)[0], '/emotion/piece/' + PID);
    assert.equal(h.calls.at(-1)[1].method, 'GET');
    assert.equal(h.calls.at(-1)[1].body, undefined);
    assert.equal(host.controller.getView().record.row_version, 3);
    assert.equal(host.controller.getView().message, acknowledged ? '公開範囲を変更しました。' : '');
    assert.equal(changed, acknowledged);
    await retry.props.onPress(); assert.equal(h.calls.length, calls + 1);
    host.componentWillUnmount();
  });
}

for (const boundary of ['owner', 'target', 'read revoked', 'focus', 'close', 'unmount']) {
  test(`paused detail recovery is discarded when ${boundary} changes and returns`, async () => {
    const h = harness({ send: url => url.includes('/history') ? packet(page([record()])) : Promise.reject(Error('lost detail')) });
    const host = ownerHost(h, null, { flags, presentationActive: true, runtimePending: false });
    host.componentDidMount(); await host.act('loadHistory'); await host.act('openDetail', PID);
    h.background('inactive');
    if (boundary === 'close') host.controller.close();
    else if (boundary === 'unmount') host.componentWillUnmount();
    else {
      const previous = host.props;
      host.props = boundary === 'owner' ? { ...previous, owner: RID }
        : boundary === 'target' ? { ...previous, savedPiece: savedEntry(RID) }
          : boundary === 'focus' ? { ...previous, enabled: false, presentationActive: false }
          : { ...previous, enabled: false, flags: {}, runtimePending: false };
      if (boundary === 'read revoked') h.background('active');
      host.componentDidUpdate(); host.props = previous; host.componentDidUpdate();
    }
    h.background('active'); await tick();
    assert.equal(host.controller.getView().canRetryDetail, false);
    assert.equal(host.controller.getView().record, null);
    if (boundary !== 'unmount') host.componentWillUnmount();
  });
}

test('a synchronous abort listener cannot restore the paused detail target into another owner', async () => {
  let controller, finish;
  const wait = new Promise(resolve => { finish = resolve; });
  const h = harness({ send: (url, init) => {
    if (url.includes('/history')) return packet(page([record()]));
    init.signal.addEventListener('abort', () => controller.setContext({ enabled: true, expectedUserId: RID, flags }));
    return wait;
  } });
  controller = h.controller; await controller.loadHistory();
  const pending = controller.openDetail(PID); await tick();
  controller.setContext({ enabled: false, expectedUserId: OWNER, flags, suspended: true });
  assert.equal(controller.getView().canRetryDetail, false);
  assert.equal(controller.getView().record, null);
  assert.equal(controller.getView().phase, 'idle');
  finish(packet(record())); await pending;
  assert.equal(controller.getView().record, null);
  assert.equal(controller.getView().canRetryDetail, false);
  controller.dispose();
});

for (const [status, code] of [[401, 'PIECE_AUTH_REQUIRED'], [503, 'PIECE_FEATURE_DISABLED'], [404, 'PIECE_NOT_FOUND']]) {
  test(`failed-detail reread discards its target after definitive ${code}`, async () => {
    let definitive = false;
    const h = harness({ send: url => url.includes('/history') ? packet(page([record()])) :
      definitive ? packet({ code }, status) : Promise.reject(Error('lost detail')) });
    const host = ownerHost(h, null, { flags }); host.componentDidMount();
    await host.act('loadHistory'); await host.act('openDetail', PID);
    const retry = button(host, '同じPieceを読み込み直す');
    definitive = true; await retry.props.onPress(); const count = h.calls.length;
    assert.equal(host.controller.getView().canRetryDetail, false);
    assert.equal(host.controller.getView().record, null);
    await retry.props.onPress(); assert.equal(h.calls.length, count);
    host.componentWillUnmount();
  });
}

for (const direct of [false, true]) for (const scenario of ['lost active', 'lost background', 'lost runtime', 'pending background', 'pending runtime']) for (const committed of [false, true]) {
  test(`visibility uncertainty offers an explicit same-ID read: ${direct}/${scenario}/${committed}`, async () => {
    let changed = false, finish;
    const wait = new Promise(resolve => { finish = resolve; });
    const h = harness({ send: (url, init) => {
      if (url.includes('/history')) return packet(page([record()]));
      if (init.method === 'PATCH') {
        changed = committed;
        if (scenario.startsWith('pending')) return wait;
        throw Error('visibility response lost');
      }
      return packet(record(changed ? { visibility_scope: 'public', row_version: 3 } : {}));
    } });
    const host = ownerHost(h, direct ? savedEntry() : null, { flags, presentationActive: true, runtimePending: false });
    host.componentDidMount();
    if (direct) await tick(); else { await host.act('loadHistory'); await host.act('openDetail', PID); }
    const pending = host.act('setVisibility', 'public'); await tick();
    if (!scenario.startsWith('pending')) await pending;
    const stale = host.controller.getView().detailRetryToken;
    const props = host.props, calls = h.calls.length;
    if (scenario.endsWith('background')) h.background('inactive');
    if (scenario.endsWith('runtime')) {
      host.props = { ...props, enabled: false, flags: {}, runtimePending: true }; host.componentDidUpdate();
    }
    if (scenario.startsWith('pending')) {
      finish(committed ? packet({ piece_id: PID, visibility_scope: 'public', row_version: 3 })
        : packet({ code: 'PIECE_TEMPORARILY_UNAVAILABLE' }, 503));
      await pending;
    }
    if (scenario.endsWith('background')) h.background('active');
    host.props = props; host.componentDidUpdate(); await tick();
    const view = host.controller.getView();
    assert.equal(h.calls.length, calls, 'resume does not send GET or PATCH');
    assert.equal(view.canRetryDetail, true); assert.equal(view.record, null);
    assert.match(view.message, /公開範囲の変更結果を確認できませんでした/);
    assert.equal(texts(host.render()).includes('公開範囲を変更しました。'), false);
    if (scenario !== 'lost active') { await host.act('retryDetail', stale); assert.equal(h.calls.length, calls); }
    const retry = button(host, direct ? '保存したPieceを読み込む' : '同じPieceを読み込み直す'); assert.ok(retry);
    await retry.props.onPress();
    assert.equal(h.calls.length, calls + 1); assert.equal(h.calls.at(-1)[0], '/emotion/piece/' + PID);
    assert.equal(h.calls.at(-1)[1].method, 'GET'); assert.equal(h.calls.at(-1)[1].body, undefined);
    assert.equal(h.calls.filter(([, init]) => init.method === 'PATCH').length, 1);
    assert.equal(host.controller.getView().record.visibility_scope, committed ? 'public' : 'private');
    assert.equal(host.controller.getView().message, '');
    await retry.props.onPress(); assert.equal(h.calls.length, calls + 1);
    host.componentWillUnmount();
  });
}

test('public-write flag and visibility-toggle flag independently prevent writes', async () => {
  const h = harness({ send: ownerSend });
  h.controller.setContext({ enabled: true, expectedUserId: OWNER, flags: { ...flags, piece_v2_public_write_enabled: false } });
  await open(h); await h.controller.setVisibility('public'); assert.equal(h.calls.length, 2);
});
test('delete response loss waits for explicit retry using identical key/version', async () => {
  let attempts = 0;
  const h = harness({ send: (url, init) => {
    if (init.method !== 'DELETE') return ownerSend(url, init);
    if (++attempts === 1) throw new Error('private provider error');
    return packet({ piece_id: PID, receipt_id: RID, outcome: 'succeeded', idempotency_replayed: true });
  } }); await open(h); await h.controller.deleteConfirmed(h.controller.getView().record);
  assert.equal(h.calls.length, 3); assert.equal(h.controller.getView().canRetryDelete, true);
  await h.controller.retryDelete();
  assert.equal(h.calls[2][1].body, h.calls[3][1].body);
  assert.equal(h.calls[2][1].headers['Idempotency-Key'], h.calls[3][1].headers['Idempotency-Key']);
  assert.deepEqual(JSON.parse(h.calls[3][1].body), { expected_row_version: 2 });
  assert.equal(h.controller.getView().record, null); assert.match(h.controller.getView().message, /削除しました/);
});
test('stale deletion confirmation and repeated tap cannot delete a new record', async () => {
  const h = harness({ send: ownerSend }); await open(h); const before = h.controller.getView().record;
  await h.controller.loadHistory(); await h.controller.openDetail(PID);
  await h.controller.deleteConfirmed(before); assert.equal(h.calls.length, 4);
});
test('wrong delete ACK does not report success and retains same-key recovery', async () => {
  const h = harness({ send: (url, init) => init.method === 'DELETE'
    ? packet({ piece_id: RID, receipt_id: RID, outcome: 'succeeded', idempotency_replayed: false }) : ownerSend(url, init) });
  await open(h); await h.controller.deleteConfirmed(h.controller.getView().record);
  assert.equal(h.controller.getView().canRetryDelete, true); assert.doesNotMatch(h.controller.getView().message, /削除しました/);
});
test('native host renders complete canonical text, privacy, confirmation and no image success', async () => {
  const h = harness({ send: ownerSend }); const host = new h.PieceOwnerHistoryHost({ owner: OWNER, flags, enabled: true });
  host.componentDidMount(); await host.act('loadHistory'); await host.act('openDetail', PID);
  const view = host.render(); const content = texts(view).join('\n');
  assert.ok(content.includes(record().piece_text)); assert.match(content, /非公開（自分のみ）/); assert.match(content, /まだ利用できません/);
  nodes(view).find(n => n.props.title === 'このPieceを削除').props.onPress();
  assert.equal(h.calls.length, 2); assert.match(h.alerts[0][1], /回収できません/); assert.equal(h.alerts[0][2][0].style, 'cancel');
  h.background('background'); h.alerts[0][2][1].onPress(); await tick();
  assert.equal(h.calls.length, 2); assert.ok(!texts(host.render()).includes(record().piece_text));
  h.background('active'); assert.equal(h.calls.length, 2); host.componentWillUnmount();
});
test('render conceals old owner before componentDidUpdate; runtime stop refreshes once', async () => {
  let refreshes = 0;
  const h = harness({ send: ownerSend }); const host = new h.PieceOwnerHistoryHost({ owner: OWNER, flags, enabled: true });
  host.componentDidMount(); await host.act('loadHistory');
  host.props = { ...host.props, owner: RID }; assert.ok(!texts(host.render()).includes(record().piece_text));
  host.componentDidUpdate(); assert.equal(host.controller.getView().items.length, 0); host.componentWillUnmount();
  const stopped = harness({ send: () => packet({ code: 'PIECE_FEATURE_DISABLED' }, 503) });
  const next = new stopped.PieceOwnerHistoryHost({ owner: OWNER, flags, enabled: true, refreshRuntime: () => { refreshes++; } });
  next.componentDidMount(); await next.act('loadHistory'); await next.act('loadHistory');
  assert.equal(refreshes, 1); assert.equal(stopped.calls.length, 1); next.componentWillUnmount();
});

test('pagination retains exact canonical records and passes the server cursor only', async () => {
  const first = Array.from({ length: 20 }, (_, i) => {
    const id = `30000000-0000-4000-8000-${String(100 - i).padStart(12, '0')}`;
    return record({ piece_id: id, public_id: 'piece:' + id });
  });
  const h = harness({ send: url => url.includes('cursor=') ? packet(page([record()]))
    : packet({ ...page(first), next_cursor: 'opaque_cursor' }) });
  await h.controller.loadHistory(); await h.controller.loadMore();
  assert.equal(h.calls[1][0], '/emotion/piece/history?limit=20&cursor=opaque_cursor');
  assert.equal(h.controller.getView().items.length, 21);
  assert.equal(h.controller.getView().items[20].piece_text, record().piece_text);
});
function verifiedHistoryPage() {
  const items = Array.from({ length: 20 }, (_, i) => {
    const id = `30000000-0000-4000-8000-${String(100 - i).padStart(12, '0')}`;
    return record({ piece_id: id, public_id: 'piece:' + id });
  });
  return { ...page(items), next_cursor: 'cursor_first' };
}

for (const failure of ['transport', 'closed 503']) {
  test(`history continuation keeps verified rows and repeats the exact cursor after ${failure}`, async () => {
    const first = verifiedHistoryPage();
    const second = {
      ...page(Array.from({ length: 20 }, (_, i) => {
        const id = `30000000-0000-4000-8000-${String(80 - i).padStart(12, '0')}`;
        return record({ piece_id: id, public_id: 'piece:' + id });
      })),
      next_cursor: 'cursor_second',
    };
    let attempts = 0;
    const h = harness({ send: (url) => {
      if (!url.includes('cursor=')) return packet(first);
      if (++attempts === 1) {
        if (failure === 'transport') throw Error('private connection diagnostics');
        return packet({ code: 'PIECE_TEMPORARILY_UNAVAILABLE' }, 503);
      }
      return packet(url.endsWith('cursor_first') ? second : page([record()]));
    } });
    const host = new h.PieceOwnerHistoryHost({ owner: OWNER, flags, enabled: true });
    host.componentDidMount();
    await host.act('loadHistory');
    const firstButton = button(host, '続きを読み込む');
    await firstButton.props.onPress();
    assert.deepEqual(copy(host.controller.getView().items), first.items);
    assert.equal(host.controller.getView().nextCursor, 'cursor_first');
    assert.match(texts(host.render()).join(' '), /続きを読み込めませんでした/);
    await button(host, '続きを読み込む').props.onPress();
    assert.equal(h.calls[1][0], h.calls[2][0]);
    assert.deepEqual(copy(host.controller.getView().items), [...first.items, ...second.items]);
    await firstButton.props.onPress();
    assert.equal(h.calls.length, 3);
    await button(host, '続きを読み込む').props.onPress();
    assert.ok(h.calls[3][0].endsWith('cursor_second'));
    assert.equal(host.controller.getView().items.length, 41);
    assert.equal(button(host, '続きを読み込む'), undefined);
    host.componentWillUnmount();
  });
}

for (const failure of ['unknown 503', 'invalid page', 'out of order', 'duplicate', 'unauthorized', 'feature stop', 'session changed']) {
  test(`history continuation does not show earlier private rows after ${failure}`, async () => {
    const first = verifiedHistoryPage();
    let authenticated = true;
    const h = harness({ session: () => authenticated ? 'synthetic' : null, send: (url) => {
      if (!url.includes('cursor=')) return packet(first);
      if (failure === 'unknown 503') return packet({ code: 'provider private diagnostic' }, 503);
      if (failure === 'invalid page') return packet(page([record({ public_id: 'bad' })]));
      if (failure === 'out of order') return packet(page([record({ saved_at: '2026-10-10T01:00:00.000001+00:00' })]));
      if (failure === 'duplicate') return packet(page([{ ...first.items[0], saved_at: '2026-10-10T00:00:00Z' }]));
      if (failure === 'unauthorized') return packet({ code: 'PIECE_AUTH_REQUIRED' }, 401);
      if (failure === 'feature stop') return packet({ code: 'PIECE_FEATURE_DISABLED' }, 503);
      authenticated = false;
      throw Error('network changed during account switch');
    } });
    await h.controller.loadHistory();
    assert.equal(h.controller.getView().items.length, 20);
    await h.controller.loadMore();
    assert.equal(h.controller.getView().items.length, 0);
    assert.equal(h.controller.getView().nextCursor, null);
    await h.controller.loadMore();
    assert.equal(h.calls.length, 2);
  });
}

test('a late continuation failure cannot restore history after read permission is revoked', async () => {
  let finish;
  const pending = new Promise(resolve => { finish = resolve; });
  const h = harness({ send: url => url.includes('cursor=') ? pending : packet(verifiedHistoryPage()) });
  await h.controller.loadHistory();
  const continuation = h.controller.loadMore(); await tick();
  const context = { enabled: true, expectedUserId: OWNER, flags };
  h.controller.setContext({ ...context, flags: { ...flags, piece_v2_owner_read_enabled: false } });
  h.controller.setContext(context);
  finish(packet({ code: 'PIECE_TEMPORARILY_UNAVAILABLE' }, 503));
  await continuation;
  assert.equal(h.controller.getView().phase, 'idle');
  assert.equal(h.controller.getView().items.length, 0);
  assert.equal(h.controller.getView().nextCursor, null);
  assert.equal(h.calls.length, 2);
});

test('history uses the server descending instant and UUID order at submillisecond precision', async () => {
  const older = record({ saved_at: '2026-10-10T01:00:00.000001+00:00' });
  const equalInstantHigherId = record({ piece_id: RID, public_id: 'piece:' + RID, saved_at: '2026-10-10T10:00:00.000001+09:00' });
  const newer = record({ saved_at: '2026-10-10T01:00:00.000002Z',
    piece_id: '10000000-0000-4000-8000-000000000001', public_id: 'piece:10000000-0000-4000-8000-000000000001' });
  const h = harness({ send: () => packet(page([newer, equalInstantHigherId, older])) });
  await h.controller.loadHistory();
  assert.deepEqual(copy(h.controller.getView().items), [newer, equalInstantHigherId, older]);
  const bad = harness({ send: () => packet(page([older, equalInstantHigherId, newer])) });
  await bad.controller.loadHistory();
  assert.equal(bad.controller.getView().phase, 'unavailable');
  assert.equal(bad.controller.getView().items.length, 0);
});

test('bad page fails wholly, never presenting a partial private history', async () => {
  const h = harness({ send: () => packet(page([record(), record({ piece_id: RID, public_id: 'bad' })])) });
  await h.controller.loadHistory(); assert.equal(h.controller.getView().phase, 'unavailable');
  assert.equal(h.controller.getView().items.length, 0);
});
test('double delete tap sends one request and dispose rejects late acknowledgement', async () => {
  let release;
  const h = harness({ send: (url, init) => init.method === 'DELETE'
    ? new Promise(resolve => { release = resolve; }) : ownerSend(url, init) });
  await open(h); const saved = h.controller.getView().record;
  const pending = h.controller.deleteConfirmed(saved); await tick();
  await h.controller.deleteConfirmed(saved); assert.equal(h.calls.length, 3);
  h.controller.dispose();
  release(packet({ piece_id: PID, receipt_id: RID, outcome: 'succeeded', idempotency_replayed: false }));
  await pending; assert.equal(h.controller.getView().phase, 'hidden');
});
test('delete conflict refetches current record and never retries the conflicting write', async () => {
  const h = harness({ send: (url, init) => init.method === 'DELETE'
    ? packet({ code: 'PIECE_CONFLICT' }, 409) : ownerSend(url, init) });
  await open(h); await h.controller.deleteConfirmed(h.controller.getView().record);
  assert.equal(h.calls.length, 4); assert.equal(h.controller.getView().canRetryDelete, false);
  assert.equal(h.controller.getView().phase, 'detail');
});
test('disabled delete cannot write, and key generation failure does not report deletion', async () => {
  const h = harness({ send: ownerSend });
  h.controller.setContext({ enabled: true, expectedUserId: OWNER, flags: { ...flags, piece_v2_delete_enabled: false } });
  await open(h); await h.controller.deleteConfirmed(h.controller.getView().record); assert.equal(h.calls.length, 2);
  const broken = harness({ send: ownerSend, random: () => { throw new Error('unavailable'); } });
  await open(broken); await broken.controller.deleteConfirmed(broken.controller.getView().record);
  assert.equal(broken.calls.length, 2); assert.equal(broken.controller.getView().canRetryDelete, false);
  assert.match(broken.controller.getView().message, /開始できませんでした/);
});


test('only fresh owner detail mounts the shared saved canvas while keeping the complete accessible text', async () => {
  const h = harness({ send: ownerSend });
  const host = new h.PieceOwnerHistoryHost({ owner: OWNER, flags, enabled: true });
  host.componentDidMount(); await host.act('loadHistory');
  const images = () => nodes(host.render()).filter(n => n.type === 'PieceVisualCard');
  assert.equal(images().length, 0);
  await host.act('openDetail', PID);
  assert.equal(images().length, 1);
  assert.equal(images()[0].props.savedRecord, host.controller.getView().record);
  assert.equal(images()[0].props.display, undefined);
  const body = nodes(host.render()).find(n => n.props.testID === 'piece-owner-text');
  assert.equal(body.props.selectable, true); assert.ok(body.children.includes(record().piece_text));
  await host.act('loadHistory'); assert.equal(images().length, 0);
  host.componentWillUnmount();
});
test('owner identity, background, disabled reader, close and leaving the screen remove the saved canvas immediately', async () => {
  for (const change of [host => { host.props = { ...host.props, owner: RID }; },
    (host, h) => h.background('background'),
    host => { host.props = { ...host.props, flags: {} }; },
    host => { host.props = { ...host.props, enabled: false }; },
    host => host.controller.close()]) {
    const h = harness({ send: ownerSend });
    const host = new h.PieceOwnerHistoryHost({ owner: OWNER, flags, enabled: true });
    host.componentDidMount(); await host.act('loadHistory'); await host.act('openDetail', PID);
    assert.equal(nodes(host.render()).filter(n => n.type === 'PieceVisualCard').length, 1);
    change(host, h);
    assert.equal(nodes(host.render()).filter(n => n.type === 'PieceVisualCard').length, 0);
    assert.ok(!texts(host.render()).includes(record().piece_text));
    host.componentWillUnmount();
  }
});
test('visibility and deletion hide saved canvas during mutation and never reuse an unconfirmed record', async () => {
  for (const action of ['visibility', 'delete']) {
    let release;
    const h = harness({ send: (url, init) => ['PATCH', 'DELETE'].includes(init.method)
      ? new Promise(resolve => { release = resolve; }) : ownerSend(url, init) });
    const host = new h.PieceOwnerHistoryHost({ owner: OWNER, flags, enabled: true });
    host.componentDidMount(); await host.act('loadHistory'); await host.act('openDetail', PID);
    const before = host.controller.getView().record;
    const pending = action === 'visibility' ? host.act('setVisibility', 'public') : host.act('deleteConfirmed', before);
    await tick();
    assert.equal(nodes(host.render()).filter(n => n.type === 'PieceVisualCard').length, 0);
    release(packet({ code: 'PIECE_TEMPORARILY_UNAVAILABLE' }, 503)); await pending;
    assert.equal(nodes(host.render()).filter(n => n.type === 'PieceVisualCard').length, 0);
    assert.ok(!texts(host.render()).includes(before.piece_text));
    host.componentWillUnmount();
  }
});


const savedEntry = (pieceId = PID, expectedUserId = OWNER) => ({ pieceId, expectedUserId });
const ownerHost = (h, savedPiece = savedEntry(), extra = {}) => new h.PieceOwnerHistoryHost({
  owner: OWNER, enabled: true, flags: { piece_v2_owner_read_enabled: true }, savedPiece, ...extra,
});
const button = (host, title) => nodes(host.render()).find(n => n.type === 'Button' && n.props.title === title);

test('saved entry directly fetches the exact owner detail without source, quota or history requests', async () => {
  const h = harness(); const host = ownerHost(h); host.componentDidMount(); await tick();
  assert.equal(h.calls.length, 1); assert.equal(h.calls[0][0], '/emotion/piece/' + PID);
  assert.equal(h.calls[0][1].method, 'GET'); assert.equal(h.calls[0][1].body, undefined);
  assert.equal(h.calls[0][1].headers['Idempotency-Key'], undefined);
  assert.equal(h.calls[0][1].expectedUserId, OWNER); assert.equal(h.sessions.length, 2);
  assert.equal(host.controller.getView().phase, 'detail');
  assert.ok(texts(host.render()).includes(record().piece_text));
  assert.ok(nodes(host.render()).some(n => n.type === 'PieceVisualCard' && n.props.savedRecord.piece_id === PID));
  assert.equal(button(host, '保存したPieceを読み込む'), undefined);
  host.componentDidUpdate(); await tick(); assert.equal(h.calls.length, 1);
  host.componentWillUnmount();
});
test('malformed, body-bearing, foreign-owner or unreadable saved targets issue no request', async () => {
  const variants = [savedEntry(PID, RID), { ...savedEntry(), piece_text: 'PRIVATE' },
    savedEntry('piece:' + PID), savedEntry('bad'), savedEntry('00000000-0000-0000-0000-000000000000'), {}, []];
  for (const target of variants) {
    const h = harness(); const host = ownerHost(h, target); host.componentDidMount(); await tick();
    assert.equal(h.calls.length, 0); assert.equal(host.controller.getView().phase, 'hidden');
    assert.doesNotMatch(JSON.stringify(host.state), /PRIVATE|piece_text/); host.componentWillUnmount();
  }
  for (const read of [false, 'true', undefined]) {
    const h = harness(); const host = ownerHost(h, savedEntry(), { flags: { piece_v2_owner_read_enabled: read } });
    host.componentDidMount(); await tick(); assert.equal(h.calls.length, 0); host.componentWillUnmount();
  }
});
test('saved detail transport loss retries only the same GET and validates the fresh body', async () => {
  let reads = 0;
  const h = harness({ send: () => ++reads === 1 ? Promise.reject(Error('PRIVATE')) : packet(record()) });
  const host = ownerHost(h); host.componentDidMount(); await tick();
  assert.equal(host.controller.getView().phase, 'unavailable');
  assert.doesNotMatch(JSON.stringify(host.render()), /PRIVATE/);
  await button(host, '保存したPieceを読み込む').props.onPress();
  assert.equal(h.calls.length, 2); assert.equal(h.calls[0][0], h.calls[1][0]);
  assert.ok(h.calls.every(([, init]) => init.method === 'GET' && init.body === undefined));
  assert.ok(texts(host.render()).includes(record().piece_text)); host.componentWillUnmount();
});
test('saved detail with a hash mismatch or deleted record never displays the supplied body', async () => {
  for (const reply of [packet(record({ piece_text: 'PRIVATE_CORRUPT' })), packet({ code: 'PIECE_NOT_FOUND' }, 404)]) {
    const h = harness({ send: () => reply }); const host = ownerHost(h); host.componentDidMount(); await tick();
    assert.equal(host.controller.getView().record, null); assert.equal(host.controller.getView().phase, 'unavailable');
    assert.doesNotMatch(JSON.stringify(host.render()), /PRIVATE_CORRUPT/); assert.equal(h.calls.length, 1);
    host.componentWillUnmount();
  }
});
for (const boundary of ['target', 'owner', 'background', 'disable', 'unmount']) {
  test(`saved-entry ${boundary} discards the prior delayed detail response`, async () => {
    let resolve; const pending = new Promise(r => { resolve = r; });
    const h = harness({ send: url => url.endsWith('/' + RID) ? packet(record({ piece_id: RID, public_id: 'piece:' + RID })) : pending });
    const host = ownerHost(h); host.componentDidMount(); await tick();
    if (boundary === 'target') host.props = { ...host.props, savedPiece: savedEntry(RID) };
    if (boundary === 'owner') host.props = { ...host.props, owner: RID };
    if (boundary === 'disable') host.props = { ...host.props, enabled: false };
    if (['target', 'owner', 'disable'].includes(boundary)) {
      assert.equal(host.current(), false); host.componentDidUpdate();
    }
    if (boundary === 'background') h.background('inactive');
    if (boundary === 'unmount') host.componentWillUnmount();
    resolve(packet(record())); await tick();
    assert.notEqual(host.controller.getView().record?.piece_id, PID);
    if (boundary === 'target') assert.equal(host.controller.getView().record?.piece_id, RID);
    if (boundary === 'background') {
      h.background('active'); await tick(); assert.equal(h.calls.length, 1);
      assert.ok(button(host, '保存したPieceを読み込む')); assert.equal(host.controller.getView().record, null);
    }
    if (boundary !== 'unmount') host.componentWillUnmount();
  });
}
test('stale saved-entry read button cannot fetch an earlier target after route change', async () => {
  const h = harness({ send: () => Promise.reject(Error('lost read')) }); const host = ownerHost(h);
  host.componentDidMount(); await tick();
  const stale = button(host, '保存したPieceを読み込む');
  host.props = { ...host.props, savedPiece: savedEntry(RID) }; host.componentDidUpdate(); await tick();
  assert.equal(h.calls.length, 2); await stale.props.onPress(); assert.equal(h.calls.length, 2);
  await button(host, '保存したPieceを読み込む').props.onPress();
  assert.equal(h.calls.length, 3); assert.ok(h.calls[2][0].endsWith('/' + RID)); host.componentWillUnmount();
});
test('confirmed direct-entry delete leaves history available and never offers to reopen the deleted Piece', async () => {
  let deletes = 0;
  const h = harness({ send: (url, init) => {
    if (init.method === 'DELETE') {
      if (++deletes === 1) throw Error('lost delete response');
      return packet({ piece_id: PID, receipt_id: RID, outcome: 'succeeded', idempotency_replayed: true });
    }
    return url.includes('/history?') ? packet(page([])) : packet(record());
  } });
  const host = ownerHost(h, savedEntry(), { flags });
  host.componentDidMount(); await tick();
  button(host, 'このPieceを削除').props.onPress();
  await h.alerts[0][2][1].onPress();
  assert.equal(button(host, '保存したPieceを読み込む'), undefined);
  await host.openSavedDetail(host.targetKey(), PID);
  assert.equal(h.calls.length, 2);
  await button(host, '同じ削除要求で結果を確認').props.onPress();
  assert.match(texts(host.render()).join(' '), /Pieceを削除しました/);
  assert.equal(button(host, '保存したPieceを読み込む'), undefined);
  await host.openSavedDetail(host.targetKey(), PID);
  h.background('background'); h.background('active'); await tick();
  assert.equal(h.calls.length, 3);
  assert.equal(button(host, '保存したPieceを読み込む'), undefined);
  await button(host, '保存済みPieceを読み込む').props.onPress();
  assert.ok(h.calls[3][0].includes('/history?'));
  host.componentWillUnmount();
});
test('returning to the same saved entry can confirm a delete that committed before backgrounding', async () => {
  let finishFirst, deletes = 0;
  const firstResponse = new Promise(resolve => { finishFirst = resolve; });
  const h = harness({ send: (url, init) => {
    if (init.method !== 'DELETE') return packet(record());
    return ++deletes === 1 ? firstResponse : packet({
      piece_id: PID, receipt_id: RID, outcome: 'succeeded', idempotency_replayed: true,
    });
  } });
  const host = ownerHost(h, savedEntry(), { flags });
  host.componentDidMount(); await tick();
  const staleHistory = button(host, '履歴に戻る');
  button(host, 'このPieceを削除').props.onPress();
  const first = h.alerts[0][2][1].onPress(); await tick();
  assert.equal(deletes, 1);

  h.background('background');
  assert.equal(h.calls[1][1].signal.aborted, true);
  assert.equal(button(host, '同じ削除要求で結果を確認'), undefined);
  assert.ok(!texts(host.render()).includes(record().piece_text));
  h.background('active'); await tick();
  assert.equal(h.calls.length, 2);
  assert.equal(host.controller.getView().record, null);
  const retry = button(host, '同じ削除要求で結果を確認');
  assert.ok(retry);
  assert.equal(button(host, '保存したPieceを読み込む'), undefined);
  assert.equal(button(host, '履歴を読み込む'), undefined);
  await host.openSavedDetail(host.targetKey(), PID);
  await staleHistory.props.onPress();
  assert.equal(h.calls.length, 2);

  // The first response arrives after its view was invalidated. Only the
  // explicit, same-key request may resolve the uncertainty on this screen.
  finishFirst(packet({ piece_id: PID, receipt_id: RID, outcome: 'succeeded', idempotency_replayed: false }));
  await first; await tick();
  assert.equal(host.controller.getView().canRetryDelete, true);
  assert.doesNotMatch(texts(host.render()).join(' '), /Pieceを削除しました/);
  await retry.props.onPress();
  assert.equal(deletes, 2);
  assert.equal(h.calls[2][0], h.calls[1][0]);
  assert.equal(h.calls[2][1].body, h.calls[1][1].body);
  assert.equal(h.calls[2][1].headers['Idempotency-Key'], h.calls[1][1].headers['Idempotency-Key']);
  assert.match(texts(host.render()).join(' '), /Pieceを削除しました/);
  assert.equal(button(host, '保存したPieceを読み込む'), undefined);
  host.componentWillUnmount();
});

test('a previous retry button cannot revive across focus while the new button keeps the delete key', async () => {
  let deletes = 0;
  const h = harness({ send: (url, init) => {
    if (init.method !== 'DELETE') return packet(record());
    if (++deletes === 1) throw Error('lost receipt');
    return packet({ piece_id: PID, receipt_id: RID, outcome: 'succeeded', idempotency_replayed: true });
  } });
  const host = ownerHost(h, savedEntry(), { flags });
  host.componentDidMount(); await tick();
  button(host, 'このPieceを削除').props.onPress();
  await h.alerts[0][2][1].onPress();
  const staleRetry = button(host, '同じ削除要求で結果を確認');
  host.props = { ...host.props, enabled: false }; host.componentDidUpdate();
  host.props = { ...host.props, enabled: true }; host.componentDidUpdate();
  assert.equal(h.calls.length, 2);
  await staleRetry.props.onPress();
  assert.equal(deletes, 1);
  await button(host, '同じ削除要求で結果を確認').props.onPress();
  assert.equal(deletes, 2);
  assert.equal(h.calls[2][1].headers['Idempotency-Key'], h.calls[1][1].headers['Idempotency-Key']);
  host.componentWillUnmount();
});

for (const boundary of ['owner', 'target', 'read permission', 'delete permission']) {
  test(`delete recovery is discarded across ${boundary} loss, even when the old context returns`, async () => {
    const h = harness({ send: (url, init) => {
      if (init.method === 'DELETE') throw Error('lost receipt');
      return packet(record());
    } });
    const context = { enabled: true, expectedUserId: OWNER, savedPieceId: PID, flags };
    h.controller.setContext(context);
    await h.controller.openDetail(PID);
    await h.controller.deleteConfirmed(h.controller.getView().record);
    assert.equal(h.controller.getView().canRetryDelete, true);
    const staleToken = h.controller.getView().deleteRetryToken;
    const changed = boundary === 'owner' ? { expectedUserId: RID }
      : boundary === 'target' ? { savedPieceId: RID }
      : { flags: { ...flags, [boundary === 'read permission'
        ? 'piece_v2_owner_read_enabled' : 'piece_v2_delete_enabled']: false } };
    h.controller.setContext({ ...context, ...changed });
    assert.equal(h.controller.getView().canRetryDelete, false);
    h.controller.setContext(context);
    await h.controller.retryDelete(staleToken);
    assert.equal(h.controller.getView().canRetryDelete, false);
    assert.equal(h.calls.length, 2);
  });
}


async function uncertainLifecycleDelete(ordinary, delayed) {
  let finishFirst, committed = false, deletes = 0;
  const firstResponse = new Promise(resolve => { finishFirst = resolve; });
  const h = harness({ send: (url, init) => {
    if (init.method === 'DELETE') {
      committed = true; deletes++;
      if (deletes === 1) {
        if (delayed) return firstResponse;
        throw Error('response lost after server commit');
      }
      return packet({ piece_id: PID, receipt_id: RID, outcome: 'succeeded', idempotency_replayed: true });
    }
    if (url.includes('/history')) return packet(page(committed ? [] : [record()]));
    return committed ? packet({ code: 'PIECE_NOT_FOUND' }, 404) : packet(record());
  } });
  const host = ownerHost(h, ordinary ? null : savedEntry(), {
    flags, presentationActive: true, runtimePending: false,
  });
  host.componentDidMount(); await tick();
  if (ordinary) { await host.act('loadHistory'); await host.act('openDetail', PID); }
  const pending = host.act('deleteConfirmed', host.controller.getView().record);
  await tick();
  if (!delayed) await pending;
  const originalRequest = h.calls.find(([, init]) => init.method === 'DELETE');
  const oldToken = host.controller.getView().deleteRetryToken;
  const previous = host.props;
  h.background('inactive');
  host.props = { ...previous, enabled: false, flags: {}, runtimePending: false };
  host.componentDidUpdate();
  assert.equal(originalRequest[1].signal.aborted, delayed);
  assert.equal(host.controller.getView().record, null);
  assert.equal(button(host, '同じ削除要求で結果を確認'), undefined);
  host.props = { ...host.props, runtimePending: true };
  h.background('active'); host.componentDidUpdate();
  assert.equal(host.controller.getView().phase, 'hidden');
  return { h, host, pending, finishFirst, originalRequest, oldToken, previous,
    countDeletes: () => deletes, resume() { host.props = previous; host.componentDidUpdate(); } };
}

for (const ordinary of [false, true]) {
  for (const delayed of [false, true]) {
    test('same delete survives cleared flags and loading for ' + (ordinary ? 'history' : 'direct') +
      (delayed ? ' in-flight server commit' : ' lost committed response'), async () => {
      const u = await uncertainLifecycleDelete(ordinary, delayed);
      const calls = u.h.calls.length;
      u.resume(); await tick();
      assert.equal(u.h.calls.length, calls, 'fresh flags never issue a read or delete');
      assert.equal(u.host.controller.getView().canRetryDelete, true);
      assert.ok(!texts(u.host.render()).includes(record().piece_text));
      await u.host.controller.retryDelete(u.oldToken);
      assert.equal(u.countDeletes(), 1, 'obsolete controls cannot use the retained key');
      if (delayed) {
        u.finishFirst(packet({ piece_id: PID, receipt_id: RID, outcome: 'succeeded', idempotency_replayed: false }));
        await u.pending;
        assert.equal(u.host.controller.getView().canRetryDelete, true);
        assert.ok(!texts(u.host.render()).includes('Pieceを削除しました。保存回数は戻りません。'));
      }
      const retry = button(u.host, '同じ削除要求で結果を確認');
      const next = retry.props.onPress();
      retry.props.onPress();
      await next;
      const requests = u.h.calls.filter(([, init]) => init.method === 'DELETE');
      assert.equal(requests.length, 2);
      assert.equal(requests[1][0], u.originalRequest[0]);
      assert.equal(requests[1][1].body, u.originalRequest[1].body);
      assert.equal(requests[1][1].headers['Idempotency-Key'], u.originalRequest[1].headers['Idempotency-Key']);
      assert.ok(texts(u.host.render()).includes('Pieceを削除しました。保存回数は戻りません。'));
      assert.equal(u.host.controller.getView().canRetryDelete, false);
      assert.equal(button(u.host, '保存したPieceを読み込む'), undefined);
      if (!ordinary) {
        u.h.background('inactive'); u.h.background('active');
        await u.host.openSavedDetail(u.host.targetKey(), PID);
        assert.equal(u.h.calls.length, calls + 1);
      }
      u.host.componentWillUnmount();
    });
  }
}

for (const boundary of ['owner', 'target', 'read permission', 'delete permission', 'unmount']) {
  test('lifecycle delete recovery is discarded for settled ' + boundary + ' change', async () => {
    const u = await uncertainLifecycleDelete(false, false);
    let changed = { ...u.previous };
    if (boundary === 'owner') changed.owner = RID;
    if (boundary === 'target') changed.savedPiece = savedEntry(RID);
    if (boundary === 'read permission' || boundary === 'delete permission') {
      changed.flags = { ...flags, [boundary === 'read permission'
        ? 'piece_v2_owner_read_enabled' : 'piece_v2_delete_enabled']: false };
    }
    if (boundary === 'unmount') u.host.componentWillUnmount();
    else { u.host.props = changed; u.host.componentDidUpdate(); }
    if (boundary !== 'unmount') {
      u.resume();
      await u.host.controller.retryDelete(u.oldToken);
      assert.equal(u.host.controller.getView().canRetryDelete, false);
      assert.equal(button(u.host, '同じ削除要求で結果を確認'), undefined);
      u.host.componentWillUnmount();
    }
    assert.equal(u.countDeletes(), 1);
  });
}

test('ordinary history clears the saved-entry target and returning clears its navigation params', async () => {
  const params = [], backs = [];
  const h = harness({ send: ownerSend }); const host = ownerHost(h, savedEntry(), {
    navigation: { setParams: v => params.push(v), goBack: () => backs.push(true) },
  });
  host.componentDidMount(); await tick();
  host.props = { ...host.props, savedPiece: null }; host.componentDidUpdate(); await tick();
  assert.equal(h.calls.length, 1); assert.equal(host.controller.getView().record, null);
  await button(host, '保存済みPieceを読み込む').props.onPress();
  assert.equal(h.calls.length, 2); assert.ok(h.calls[1][0].includes('/history?'));
  button(host, '戻る').props.onPress(); assert.deepEqual(copy(params), [{ savedPiece: null }]);
  assert.equal(backs.length, 1); host.componentWillUnmount();
});
test('direct saved-entry controller target does not admit a different history-unseen ID', async () => {
  const h = harness(); h.controller.setContext({ enabled: true, expectedUserId: OWNER, flags, savedPieceId: PID });
  await h.controller.openDetail(RID); assert.equal(h.calls.length, 0);
  await h.controller.openDetail(PID); assert.equal(h.calls.length, 1);
  assert.equal(h.controller.getView().record.piece_id, PID);
});


test('stale saved-detail read cannot erase an in-flight deletion recovery key', async () => {
  let resolve, deletes = 0;
  const pending = new Promise(r => { resolve = r; });
  const h = harness({ send: (url, init) => {
    if (init.method !== 'DELETE') return packet(record());
    return ++deletes === 1 ? pending : packet({ piece_id: PID, receipt_id: RID,
      outcome: 'succeeded', idempotency_replayed: true });
  } });
  h.controller.setContext({ enabled: true, expectedUserId: OWNER, flags, savedPieceId: PID });
  await h.controller.openDetail(PID);
  const deleting = h.controller.deleteConfirmed(h.controller.getView().record); await tick();
  await h.controller.openDetail(PID); assert.equal(h.calls.length, 2);
  resolve(packet({ code: 'PIECE_TEMPORARILY_UNAVAILABLE' }, 503)); await deleting;
  assert.equal(h.controller.getView().canRetryDelete, true);
  await h.controller.retryDelete(); assert.equal(h.calls.length, 3);
  assert.equal(h.calls[1][1].body, h.calls[2][1].body);
  assert.equal(h.calls[1][1].headers['Idempotency-Key'], h.calls[2][1].headers['Idempotency-Key']);
  assert.match(h.controller.getView().message, /削除しました/);
});

// Actual NexusScreen/Header JSX with synthetic hooks, Auth/runtime and legacy
// feeds. The existing owner host below still executes its real API/controller.
function nexusEntryHarness(options = {}) {
  const ts = require('typescript');
  const control = { owner: OWNER, enabled: true, tutorial: false, initializing: false, focused: true, ...options };
  const hooks = [], effects = [], routes = [], legacyCalls = [], modules = new Map();
  let cursor = 0, dirty = false, tree;
  const noop = () => {}, colors = {}, tutorialPieces = [];
  const same = (a, b) => a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
  const React = {
    createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
    useState: initial => {
      const i = cursor++;
      if (!hooks[i]) hooks[i] = { value: typeof initial === 'function' ? initial() : initial };
      return [hooks[i].value, update => {
        const next = typeof update === 'function' ? update(hooks[i].value) : update;
        if (!Object.is(next, hooks[i].value)) { hooks[i].value = next; dirty = true; }
      }];
    },
    useRef: initial => { const i = cursor++; return hooks[i] ||= { current: initial }; },
    useMemo: (fn, deps) => {
      const i = cursor++;
      if (!hooks[i] || !same(hooks[i].deps, deps)) hooks[i] = { deps, value: fn() };
      return hooks[i].value;
    },
    useEffect: (fn, deps) => {
      const i = cursor++;
      if (!hooks[i] || !same(hooks[i].deps, deps)) {
        const previous = hooks[i]; hooks[i] = { deps, cleanup: previous?.cleanup };
        effects.push(() => { previous?.cleanup?.(); hooks[i].cleanup = fn(); });
      }
    },
  };
  React.useCallback = (fn, deps) => React.useMemo(() => fn, deps);
  React.useLayoutEffect = React.useEffect;
  const navigation = { navigate: (...args) => routes.push(copy(args)), addListener: () => noop,
    isFocused: () => control.focused };
  const runtime = { isFeatureEnabled: name => name === 'piece_v2_owner_read_enabled' ? control.enabled : false };
  function load(file) {
    if (modules.has(file)) return modules.get(file);
    const module = { exports: {} };
    const dependency = name => {
      if (name === 'react') return { __esModule: true, default: React, ...React };
      if (name === 'react-native') return { View: 'View', Text: 'Text', SafeAreaView: 'SafeAreaView',
        ScrollView: 'ScrollView', StatusBar: 'StatusBar', Alert: { alert: noop },
        StyleSheet: { create: x => x }, useWindowDimensions: () => ({ height: 800 }) };
      if (name.endsWith('/AuthContext')) return { useAuth: () => ({ user: control.owner ? { id: control.owner } : null,
        initializing: control.initializing }) };
      if (name.endsWith('/AppRuntimeContext')) return { useAppRuntime: () => runtime };
      if (name.endsWith('/UnreadContext')) return { useUnread: () => ({ getFeatureUnread: noop, setUnread: noop }) };
      if (name.endsWith('/TutorialContext')) return { useTutorial: () => ({ isTutorialMode: control.tutorial,
        tutorialStep: 0, tutorialPieces, setTutorialStep: noop, ensureTutorialPiecesSeed: noop }) };
      if (name.endsWith('/ThemeContext')) return { useTheme: () => ({ colors, themeName: 'light' }) };
      if (name.endsWith('/uiTokens')) return { makeUiTokens: () => ({}) };
      if (name.endsWith('/applyTypographyTokens')) return { applyTypographyTokens: x => x };
      if (name === 'react-native-safe-area-context') return { useSafeAreaInsets: () => ({}) };
      if (name.endsWith('/nexusApi')) return new Proxy({}, { get: (_, key) => async (...args) => {
        legacyCalls.push([key, args]);
        if (control.feedFailure && ['getNexusPieces', 'getNexusResonancePieces'].includes(key)) throw Error('feed unavailable');
        return { items: [] };
      } });
      if (name.endsWith('/legacyWireContracts')) return { readShareCode: noop };
      if (name.endsWith('/tutorialScenarioData')) return { TUTORIAL_TOTAL_STEPS: 16 };
      if (name.endsWith('/TutorialOverlay')) return { __esModule: true, default: 'TutorialOverlay',
        syncTutorialSpotlightTarget: async () => null, waitForTutorialFrames: async () => {} };
      if (/\/(NexusHeader|nexusRouteModel|nexusNormalize|nexusHistoryModel)$/.test(name)) {
        return load(path.resolve(path.dirname(file), name + '.js'));
      }
      return { __esModule: true, default: name.split('/').pop() };
    };
    const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), { fileName: file.replace(/\.js$/, '.tsx'),
      reportDiagnostics: true, compilerOptions: { target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React } });
    assert.equal((compiled.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error).length, 0);
    vm.runInNewContext(compiled.outputText, { require: dependency, module, exports: module.exports,
      console: { warn: noop }, setTimeout: () => 1, clearTimeout: noop }, { filename: file });
    modules.set(file, module.exports); return module.exports;
  }
  const Screen = load(path.join(ROOT, 'screens/NexusScreen.js')).default;
  const Header = load(path.join(ROOT, 'screens/nexus/NexusHeader.js')).default;
  function render() {
    let count = 0;
    do {
      assert.ok(++count < 30, 'bounded Nexus render/effect simulation');
      dirty = false; cursor = 0; tree = Screen({ navigation });
      while (effects.length) effects.shift()();
    } while (dirty);
    return tree;
  }
  const find = type => nodes(tree).find(n => n.type === type);
  render();
  return { control, routes, legacyCalls, render, find,
    entry: () => nodes(Header(find(Header).props)).find(n => n.props.accessibilityLabel === '自分のPieceを開く'),
    tab: value => { find('NexusTabBar').props.setActiveTab(value); render(); },
    dispose: () => { for (const hook of hooks) hook?.cleanup?.(); },
  };
}

test('ordinary Piece header opens owner history and its existing dedicated read without a saved target', async () => {
  const n = nexusEntryHarness();
  assert.ok(n.entry()); assert.ok(texts({ children: [n.entry()] }).includes('自分のPieceを開く'));
  n.entry().props.onPress();
  assert.deepEqual(n.routes, [['PieceOwnerHistory', { savedPiece: null }]]);
  const h = harness({ send: ownerSend }), host = ownerHost(h, n.routes[0][1].savedPiece);
  host.componentDidMount(); await tick(); assert.equal(h.calls.length, 0);
  await button(host, '保存済みPieceを読み込む').props.onPress();
  assert.equal(h.calls.length, 1); assert.equal(h.calls[0][0], '/emotion/piece/history?limit=20');
  assert.equal(h.calls[0][1].expectedUserId, OWNER);
  assert.equal(host.controller.getView().items.length, 1);
  host.componentWillUnmount(); n.dispose();
});
for (const unavailable of [{ enabled: false }, { enabled: 'true' }, { enabled: undefined },
  { owner: null }, { initializing: true }, { tutorial: true }]) {
  test('ordinary owner entry is absent when unavailable: ' + JSON.stringify(unavailable), () => {
    const n = nexusEntryHarness(unavailable); assert.equal(n.entry(), undefined); assert.equal(n.routes.length, 0); n.dispose();
  });
}
for (const [key, changed] of [['owner', RID], ['enabled', false], ['tutorial', true], ['initializing', true]]) {
  test(`old owner entry cannot revive after ${key} changes away and back`, () => {
    const n = nexusEntryHarness(), stale = n.entry().props.onPress, previous = n.control[key];
    n.control[key] = changed; n.render(); stale(); assert.equal(n.routes.length, 0);
    n.control[key] = previous; n.render(); stale(); assert.equal(n.routes.length, 0);
    n.entry().props.onPress(); assert.equal(n.routes.length, 1); n.dispose();
  });
}
test('owner entry ignores a press after blur or unmount', () => {
  const n = nexusEntryHarness(), stale = n.entry().props.onPress;
  n.control.focused = false; stale(); assert.equal(n.routes.length, 0);
  n.control.focused = true; n.dispose(); stale(); assert.equal(n.routes.length, 0);
});
test('owner entry remains available independently of public and resonance loading, errors and selected tab', async () => {
  const n = nexusEntryHarness({ feedFailure: true });
  assert.equal(n.find('NexusPieceFeedSection').props.pieceState.loading, true); assert.ok(n.entry());
  await tick(); n.render(); assert.equal(n.find('NexusPieceFeedSection').props.pieceState.error, 'feed unavailable');
  for (const tab of ['history', 'emotion_log', 'recommend', 'piece']) {
    n.tab(tab); assert.ok(n.entry()); await tick(); n.render(); assert.ok(n.entry());
    if (tab === 'history') assert.equal(n.find('NexusHistorySection').props.historyState.error, 'feed unavailable');
  }
  n.entry().props.onPress(); assert.equal(n.routes.length, 1);
  assert.ok(!n.legacyCalls.some(([, args]) => args.some(arg => arg?.user_id === OWNER)));
  n.dispose();
});

function exportHost({prepareWait, fresh, captureWait, send=ownerSend, result={outcome:'saved_to_photos'}}={}) {
  const events=[];
  const asset={dispose:async()=>events.push('dispose'),saveToPhotos:async()=>{events.push('photos');return result;},
    openShare:async()=>{events.push('share');return result;}};
  const h=harness({send,exportPrepare:async options=>{events.push(['prepare',options]);if(prepareWait)await prepareWait;
    return {record:fresh||record(),capture:async target=>{events.push(['capture',target]);if(captureWait)await captureWait;return asset;}};}});
  const host=ownerHost(h,savedEntry(),{flags:{piece_v2_owner_read_enabled:true,piece_v2_export_enabled:true}});
  const target={isCurrent:()=>true};
  const ready=async()=>{host.componentDidMount();await tick();await host.prepareExport(host.controller.getView().record);
    host.exportAttempt?.onTarget(target,null);return host.exportAttempt;};
  return {h,host,events,asset,target,ready};
}
test('normal detail export is explicit, defaults OFF, fetches a fresh record and waits for current canvas',async()=>{
  const h=harness(),host=ownerHost(h);host.componentDidMount();await tick();
  assert.equal(button(host,'画像の保存・共有を準備'),undefined);host.componentWillUnmount();
  const u=exportHost();u.host.componentDidMount();await tick();assert.equal(u.events.length,0);
  const displayed=u.host.controller.getView().record;await button(u.host,'画像の保存・共有を準備').props.onPress();
  assert.equal(u.events.length,1);assert.equal(u.events[0][1].pieceId,PID);assert.equal(u.events[0][1].expectedUserId,OWNER);
  assert.equal(button(u.host,'写真に保存').props.disabled,true);
  await button(u.host,'写真に保存').props.onPress();assert.equal(u.events.length,1);
  u.host.exportAttempt.onTarget(u.target,null);assert.equal(button(u.host,'写真に保存').props.disabled,false);
  await button(u.host,'写真に保存').props.onPress();assert.equal(u.events.filter(x=>x==='photos').length,1);
  assert.ok(texts(u.host.render()).includes('写真に保存しました。'));assert.equal(u.host.controller.getView().record,displayed);
  u.host.componentWillUnmount();
});
test('saved detail only offers image preparation on devices that support the saved renderer', async () => {
  const old = 'piece.rn_native_preview.prototype.v3';
  const bitmapV1 = 'piece.rn_bitmap_renderer.ios.v1';
  const bitmapV2 = 'piece.rn_bitmap_renderer.ios.v2';
  for (const [os, renderer, supported] of [
    ['android', old, true], ['android', bitmapV1, false], ['android', bitmapV2, false],
    ['ios', bitmapV1, true], ['ios', bitmapV2, true], ['ios', 'unknown-renderer.v1', false],
  ]) {
    const saved = record({ renderer_version: renderer });
    let preparations = 0;
    const h = harness({ os, send: () => packet(saved), exportPrepare: async () => {
      preparations += 1;
      return { record: saved };
    } });
    const host = ownerHost(h, savedEntry(), { flags: { ...flags, piece_v2_export_enabled: true } });
    host.componentDidMount();
    await tick();
    const tree = host.render();
    assert.ok(texts(tree).includes(saved.piece_text));
    assert.ok(button(host, 'このPieceを削除'));
    assert.equal(nodes(tree).some(n => n.type === 'PieceVisualCard'), supported);
    assert.equal(!!button(host, '画像の保存・共有を準備'), supported);
    assert.equal(texts(tree).includes('この端末では、このPieceの画像を表示・保存・共有できません。'), !supported);
    await host.prepareExport(host.controller.getView().record);
    assert.equal(preparations, supported ? 1 : 0);
    assert.equal(!!host.exportAttempt?.job, supported);
    host.componentWillUnmount();
  }
});
test('fresh changed record cannot replace the selected detail for export',async()=>{
  const u=exportHost({fresh:record({row_version:3})});await u.ready();
  assert.equal(u.host.exportAttempt,null);assert.equal(u.events.filter(x=>Array.isArray(x)&&x[0]==='capture').length,0);
  assert.equal(u.host.controller.getView().record.row_version,2);
  assert.ok(texts(u.host.render()).includes('保存済みのPieceが更新されています。同じPieceを読み直してから画像を準備してください。'));
  assert.ok(button(u.host,'同じPieceを読み込み直す'));u.host.componentWillUnmount();
});

async function changedExportRecordHost(ordinary = false, failedReread = false) {
  const old = record(), fresh = record({ row_version: 3, visibility_scope: 'private' });
  let reads = 0;
  const u = exportHost({ fresh, send: url => {
    if (url.includes('/history')) return packet(page([old]));
    if (++reads === 2 && failedReread) throw Error('fresh detail response lost');
    return packet(reads === 1 ? old : fresh);
  } });
  u.host.props = { ...u.host.props, flags: { ...u.host.props.flags, piece_v2_delete_enabled: true } };
  if (ordinary) u.host.props = { ...u.host.props, savedPiece: null };
  u.host.componentDidMount(); await tick();
  if (ordinary) { await u.host.act('loadHistory'); await u.host.act('openDetail', PID); }
  const displayed = u.host.controller.getView().record;
  await u.host.prepareExport(displayed);
  return { ...u, displayed };
}

for (const ordinary of [false, true]) {
  test('changed export record waits for explicit fresh detail from ' + (ordinary ? 'history' : 'saved entry'), async () => {
    const u = await changedExportRecordHost(ordinary);
    assert.equal(u.host.controller.getView().record, u.displayed);
    assert.equal(button(u.host, '画像の保存・共有を準備').props.disabled, true);
    await u.host.prepareExport(u.displayed);
    assert.equal(u.events.filter(event => Array.isArray(event) && event[0] === 'prepare').length, 1);
    const reread = button(u.host, '同じPieceを読み込み直す');
    const pending = reread.props.onPress(); reread.props.onPress(); await pending;
    assert.equal(u.host.controller.getView().record.row_version, 3);
    assert.equal(u.h.calls.filter(([url]) => url === '/emotion/piece/' + PID).length, 2);
    const count = u.h.calls.length;
    reread.props.onPress(); await tick();
    assert.equal(u.h.calls.length, count, 'the old record cannot issue another detail read');
    assert.equal(button(u.host, '同じPieceを読み込み直す'), undefined);
    assert.equal(button(u.host, '画像の保存・共有を準備').props.disabled, false);
    await u.host.prepareExport(u.host.controller.getView().record);
    u.host.exportAttempt.onTarget(u.target, null);
    await u.host.exportImage(u.host.exportAttempt, 'saveToPhotos');
    assert.equal(u.events.filter(event => event === 'photos').length, 1);
    assert.ok(texts(u.host.render()).includes('写真に保存しました。'));
    u.host.componentWillUnmount();
  });
  test('changed export record drops the old body when explicit ' + (ordinary ? 'history' : 'saved-entry') + ' detail reread fails', async () => {
    const u = await changedExportRecordHost(ordinary, true);
    await button(u.host, '同じPieceを読み込み直す').props.onPress();
    assert.equal(u.host.controller.getView().record, null);
    assert.equal(u.host.exportAttempt, null);
    assert.equal(button(u.host, '画像の保存・共有を準備'), undefined);
    const retry = button(u.host, ordinary ? '同じPieceを読み込み直す' : '保存したPieceを読み込む');
    await retry.props.onPress();
    assert.equal(u.host.controller.getView().record.row_version, 3);
    assert.equal(u.h.calls.filter(([url]) => url === '/emotion/piece/' + PID).length, 3);
    assert.equal(u.events.filter(event => Array.isArray(event) && event[0] === 'prepare').length, 1,
      'detail success does not automatically prepare an image');
    u.host.componentWillUnmount();
  });
}

for (const boundary of ['owner', 'target', 'read permission', 'background', 'history', 'delete', 'unmount']) {
  test('old changed-record reread cannot cross ' + boundary, async () => {
    const u = await changedExportRecordHost();
    const reread = button(u.host, '同じPieceを読み込み直す');
    if (boundary === 'owner') u.host.props = { ...u.host.props, owner: RID };
    if (boundary === 'target') u.host.props = { ...u.host.props, savedPiece: savedEntry(RID) };
    if (boundary === 'read permission') u.host.props = { ...u.host.props,
      flags: { ...u.host.props.flags, piece_v2_owner_read_enabled: false } };
    if (boundary === 'background') u.h.background('inactive');
    if (boundary === 'history') await u.host.act('loadHistory');
    if (boundary === 'delete') await u.host.act('deleteConfirmed', u.host.controller.getView().record);
    if (boundary === 'unmount') u.host.componentWillUnmount();
    const count = u.h.calls.length;
    await reread.props.onPress();
    assert.equal(u.h.calls.length, count);
    if (boundary === 'delete') {
      assert.equal(u.host.controller.getView().canRetryDelete, true);
      assert.ok(button(u.host, '同じ削除要求で結果を確認'));
      assert.equal(button(u.host, '同じPieceを読み込み直す'), undefined);
    }
    if (boundary !== 'unmount') u.host.componentWillUnmount();
  });
}

for (const [code, status] of [['PIECE_NOT_FOUND', 404], ['PIECE_AUTH_REQUIRED', 401], ['PIECE_FEATURE_DISABLED', 503]]) {
  test('changed-record explicit detail ' + code + ' drops the old body and cannot prepare an image', async () => {
    let reads = 0;
    const u = exportHost({ fresh: record({ row_version: 3 }), send: () => ++reads === 1
      ? packet(record()) : packet({ code }, status) });
    await u.ready();
    await button(u.host, '同じPieceを読み込み直す').props.onPress();
    assert.equal(u.host.controller.getView().record, null);
    assert.equal(u.host.exportAttempt, null);
    assert.equal(button(u.host, '画像の保存・共有を準備'), undefined);
    assert.ok(!texts(u.host.render()).includes(record().piece_text));
    assert.equal(u.h.calls.length, 2);
    u.host.componentWillUnmount();
  });
}
for(const boundary of ['owner','flag','background','history','target','unmount'])test(`export ${boundary} aborts fresh preparation and cannot revive on return`,async()=>{
  let resolve;const wait=new Promise(r=>{resolve=r;});const u=exportHost({prepareWait:wait});u.host.componentDidMount();await tick();
  const pending=u.host.prepareExport(u.host.controller.getView().record),old=u.host.exportAttempt;
  if(boundary==='owner')u.host.props={...u.host.props,owner:RID};
  if(boundary==='flag')u.host.props={...u.host.props,flags:{...u.host.props.flags,piece_v2_export_enabled:false}};
  if(boundary==='target')u.host.props={...u.host.props,savedPiece:savedEntry(RID)};
  if(['owner','flag','target'].includes(boundary))u.host.componentDidUpdate();
  if(boundary==='background')u.h.background('inactive');
  if(boundary==='history')await u.host.act('loadHistory');
  if(boundary==='unmount')u.host.componentWillUnmount();
  resolve();await pending;assert.equal(u.host.exportAttempt,null);assert.equal(old.abort.signal.aborted,true);
  assert.equal(u.events.filter(x=>Array.isArray(x)&&x[0]==='capture').length,0);
  if(boundary!=='unmount')u.host.componentWillUnmount();
});
test('duplicate export presses produce one capture; late capture is disposed without OS handoff',async()=>{
  let resolve;const wait=new Promise(r=>{resolve=r;});const u=exportHost({captureWait:wait});const attempt=await u.ready();
  const pending=u.host.exportImage(attempt,'saveToPhotos');await u.host.exportImage(attempt,'openShare');
  u.h.background('inactive');resolve();await pending;
  assert.equal(u.events.filter(x=>Array.isArray(x)&&x[0]==='capture').length,1);
  assert.equal(u.events.includes('photos'),false);assert.equal(u.events.includes('share'),false);assert.ok(u.events.includes('dispose'));
  u.host.componentWillUnmount();
});
test('share cancellation is shown as cancellation, and failed canvas offers explicit fresh preparation',async()=>{
  const u=exportHost({result:{outcome:'cancelled'}}),attempt=await u.ready();await u.host.exportImage(attempt,'openShare');
  assert.ok(texts(u.host.render()).includes('共有をキャンセルしました。'));
  await u.host.prepareExport(u.host.controller.getView().record);const next=u.host.exportAttempt;next.onUnavailable();
  assert.equal(u.host.exportAttempt,null);assert.ok(button(u.host,'画像の保存・共有を準備'));u.host.componentWillUnmount();
});

for(const boundary of ['history','owner','target','flag'])test(`terminal export result stays bound to its record across ${boundary}`,async()=>{
  const u=exportHost(),attempt=await u.ready();await u.host.exportImage(attempt,'saveToPhotos');
  assert.ok(texts(u.host.render()).includes('写真に保存しました。'));
  if(boundary==='history')await u.host.act('loadHistory');
  if(boundary==='owner')u.host.props={...u.host.props,owner:RID};
  if(boundary==='target')u.host.props={...u.host.props,savedPiece:savedEntry(RID)};
  if(boundary==='flag')u.host.props={...u.host.props,flags:{...u.host.props.flags,piece_v2_export_enabled:false}};
  assert.equal(texts(u.host.render()).includes('写真に保存しました。'),false);
  u.host.componentDidUpdate();assert.equal(u.host.exportMessage,null);u.host.componentWillUnmount();
});



function exportAssetHarness(saved) {
  const prefix = fs.readFileSync(path.join(__dirname, 'piece-v2-export.test.js'), 'utf8')
    .split('for (const version of')[0];
  const context = vm.createContext({ require, __dirname, queueMicrotask, Buffer });
  vm.runInContext(prefix + '\nglobalThis.makeExport = harness;', context);
  return context.makeExport({ os: 'ios', record: saved });
}

async function nativeExportHost(action, ordinary = false, send = ownerSend, beforeNative = false) {
  const u = exportHost({ send });
  if (ordinary) {
    u.host.props = { ...u.host.props, savedPiece: null };
    u.host.componentDidMount();
    await u.host.act('loadHistory');
    await u.host.act('openDetail', PID);
    await u.host.prepareExport(u.host.controller.getView().record);
    u.host.exportAttempt.onTarget(u.target, null);
  } else await u.ready();
  u.host.props = { ...u.host.props, presentationActive: true, runtimePending: false };
  const native = exportAssetHarness(u.host.controller.getView().record);
  const job = await native.prepare();
  const asset = await job.capture(native.target());
  let finish;
  const wait = new Promise(resolve => { finish = resolve; });
  native.state[beforeNative ? 'exportWait' : action === 'saveToPhotos' ? 'photoWait' : 'shareWait'] = { promise: wait };
  native.state.shareResult = { success: false, dismissedAction: true };
  const attempt = u.host.exportAttempt;
  attempt.job = { ...attempt.job, capture: async () => asset };
  const pending = u.host.exportImage(attempt, action);
  await tick();
  assert.equal(native.calls.filter(call => call[0] === (action === 'saveToPhotos' ? 'photo' : 'share')).length, beforeNative ? 0 : 1);
  return { ...u, native, asset, pending, finish };
}

function suspendExport(u) {
  const previous = u.host.props;
  u.h.background('inactive');
  u.native.state.current = false;
  u.host.props = { ...previous, enabled: false, flags: {}, runtimePending: false };
  u.host.componentDidUpdate();
  u.host.props = { ...u.host.props, runtimePending: true };
  u.h.background('active');
  u.host.componentDidUpdate();
  assert.equal(u.host.controller.getView().record, null);
  assert.equal(u.host.exportMessage, null);
  return () => {
    u.host.props = { ...previous, runtimePending: false };
    u.host.componentDidUpdate();
  };
}

async function rereadOperatedPiece(u, ordinary) {
  if (ordinary) {
    await u.host.act('loadHistory');
    assert.ok(u.host.exportOperation);
    await u.host.act('openDetail', PID);
  } else await u.host.openSavedDetail(u.host.targetKey(), PID);
  assert.equal(u.host.controller.getView().phase, 'detail');
}

for (const ordinary of [false, true]) {
  for (const action of ['saveToPhotos', 'openShare']) {
    test('native ' + action + ' result survives flag refresh and explicit ' + (ordinary ? 'history' : 'direct') + ' reread', async () => {
      const u = await nativeExportHost(action, ordinary);
      const restoreRuntime = suspendExport(u);
      const count = u.h.calls.length;
      assert.ok(u.host.exportOperation);
      assert.doesNotMatch(JSON.stringify(u.host.exportOperation), /piece_text"|content_payload"|visual_recipe"|file:|静かに|Bearer/);
      u.finish(); await u.pending;
      assert.equal(u.host.exportOperation.phase, 'complete');
      assert.equal(u.h.calls.length, count);
      assert.ok(!texts(u.host.render()).some(value => /写真に保存しました|共有をキャンセル/.test(value)));
      restoreRuntime(); await tick();
      assert.equal(u.h.calls.length, count, 'runtime never rereads a record automatically');
      await rereadOperatedPiece(u, ordinary);
      assert.ok(texts(u.host.render()).includes(action === 'saveToPhotos'
        ? '写真に保存しました。' : '共有をキャンセルしました。'));
      await assert.rejects(u.asset[action]());
      assert.equal(u.native.calls.filter(call => call[0] === (action === 'saveToPhotos' ? 'photo' : 'share')).length, 1);
      u.host.componentWillUnmount();
    });
  }
}

for (const ordinary of [false, true]) {
  test('in-flight photo blocks duplicate after explicit ' + (ordinary ? 'history' : 'direct') + ' reread', async () => {
    const u = await nativeExportHost('saveToPhotos', ordinary);
    const restoreRuntime = suspendExport(u);
    restoreRuntime();
    await rereadOperatedPiece(u, ordinary);
    const count = u.events.filter(event => Array.isArray(event) && event[0] === 'prepare').length;
    assert.equal(button(u.host, '画像の保存・共有を準備').props.disabled, true);
    await u.host.prepareExport(u.host.controller.getView().record);
    assert.equal(u.events.filter(event => Array.isArray(event) && event[0] === 'prepare').length, count);
    assert.ok(texts(u.host.render()).includes('写真への保存結果を待っています。'));
    u.finish(); await u.pending;
    assert.ok(texts(u.host.render()).includes('写真に保存しました。'));
    u.host.componentWillUnmount();
  });
}

for (const boundary of ['owner', 'target', 'focus', 'tutorial', 'permission', 'unmount']) {
  test('suspended native completion cannot return after ' + boundary + ' changes away and back', async () => {
    const u = await nativeExportHost('saveToPhotos');
    const restoreRuntime = suspendExport(u);
    const old = u.host.props;
    if (boundary === 'owner') u.host.props = { ...old, owner: RID };
    if (boundary === 'target') u.host.props = { ...old, savedPiece: savedEntry(RID) };
    if (boundary === 'focus' || boundary === 'tutorial') u.host.props = { ...old, presentationActive: false };
    if (boundary === 'permission') u.host.props = { ...old, runtimePending: false };
    if (boundary === 'unmount') u.host.componentWillUnmount();
    else u.host.componentDidUpdate();
    assert.equal(u.host.exportOperation, null);
    u.finish(); await u.pending;
    if (boundary !== 'unmount') {
      restoreRuntime();
      assert.equal(u.host.exportOperation, null);
      u.host.componentWillUnmount();
    }
  });
}

for (const [action, nativeFailure] of [['saveToPhotos', true], ['openShare', true], ['openShare', false]]) {
  test('suspended ' + action + (nativeFailure ? ' rejection' : ' unknown reply') + ' stays unconfirmed', async () => {
    const u = await nativeExportHost(action);
    const restoreRuntime = suspendExport(u);
    if (nativeFailure) u.native.state[action === 'saveToPhotos' ? 'photoError' : 'shareError'] = true;
    else u.native.state.shareResult = undefined;
    u.finish(); await u.pending;
    restoreRuntime();
    await rereadOperatedPiece(u, false);
    assert.ok(texts(u.host.render()).includes(action === 'saveToPhotos'
      ? '写真への保存結果を確認できませんでした。写真アプリで保存済みか確認できます。'
      : '共有結果を確認できませんでした。'));
    assert.ok(!texts(u.host.render()).some(value => value.includes('保存・共有できませんでした')));
    assert.equal(u.host.exportOperation.outcome, 'unconfirmed');
    u.host.componentWillUnmount();
  });
}

for (const ordinary of [false, true]) {
  for (const [label, reply] of [['missing', undefined], ['null', null], ['empty', {}],
    ['non-boolean success', { success: 'true' }], ['incomplete failure', { success: false }],
    ['contradictory', { success: true, dismissedAction: true }]]) {
    test('active ' + (ordinary ? 'history' : 'direct') + ' share keeps ' + label + ' native result unconfirmed', async () => {
      const u = await nativeExportHost('openShare', ordinary);
      u.native.state.shareResult = reply;
      u.finish(); await u.pending;
      assert.equal(u.asset.nativeStatus, 'unknown');
      assert.ok(texts(u.host.render()).includes('共有結果を確認できませんでした。'));
      assert.ok(!texts(u.host.render()).includes('共有画面を閉じました。'));
      assert.ok(!texts(u.host.render()).includes('共有をキャンセルしました。'));
      assert.equal(u.host.exportOperation.outcome, 'unconfirmed');
      assert.doesNotMatch(JSON.stringify(u.host.exportOperation), /piece_text"|content_payload"|visual_recipe"|file:|静かに|Bearer/);
      assert.equal(u.native.calls.filter(call => call[0] === 'share').length, 1);
      assert.equal(u.native.calls.some(call => call[0] === 'unlink' && call[1].startsWith('/cache/piece-export/')), false);
      await assert.rejects(u.asset.openShare());
      await rereadOperatedPiece(u, ordinary);
      assert.ok(texts(u.host.render()).includes('共有結果を確認できませんでした。'));
      assert.equal(u.native.calls.filter(call => call[0] === 'share').length, 1);
      u.host.componentWillUnmount();
    });
  }
}

test('on-time native rejection keeps its existing failure', async () => {
  const u = await nativeExportHost('saveToPhotos');
  u.native.state.photoError = true;
  u.finish(); await u.pending;
  assert.equal(u.host.exportOperation, null);
  assert.ok(texts(u.host.render()).includes('画像を保存・共有できませんでした。権限や接続を確認して、もう一度お試しください。'));
  u.host.componentWillUnmount();
});


test('suspension during pre-OS verification never invents an uncertain external operation', async () => {
  const u = await nativeExportHost('saveToPhotos', false, ownerSend, true);
  const restoreRuntime = suspendExport(u);
  u.finish(); await u.pending;
  assert.equal(u.asset.nativeStatus, 'not_started');
  assert.equal(u.host.exportOperation, null);
  restoreRuntime();
  await rereadOperatedPiece(u, false);
  assert.ok(!texts(u.host.render()).some(value => /写真への保存結果|写真に保存しました/.test(value)));
  assert.equal(u.native.calls.filter(call => call[0] === 'photo').length, 0);
  u.host.componentWillUnmount();
});


test('runtime loading alone drops the displayed record and requires an explicit reread for completion', async () => {
  const u = await nativeExportHost('saveToPhotos');
  const previous = u.host.props;
  const calls = u.h.calls.length;
  u.host.props = { ...previous, runtimePending: true };
  u.host.componentDidUpdate();
  assert.equal(u.host.controller.getView().record, null);
  assert.ok(u.host.exportOperation);
  u.finish(); await u.pending;
  u.host.props = previous;
  u.host.componentDidUpdate();
  assert.equal(u.h.calls.length, calls);
  assert.equal(u.host.controller.getView().record, null);
  await rereadOperatedPiece(u, false);
  assert.ok(texts(u.host.render()).includes('写真に保存しました。'));
  u.host.componentWillUnmount();
});

test('a different fresh row version cannot receive the completed native operation notice', async () => {
  let changed = false;
  const u = await nativeExportHost('saveToPhotos', false,
    () => packet(record({ row_version: changed ? 3 : 2 })));
  const restoreRuntime = suspendExport(u);
  u.finish(); await u.pending;
  restoreRuntime(); changed = true;
  await rereadOperatedPiece(u, false);
  assert.equal(u.host.controller.getView().record.row_version, 3);
  assert.equal(u.host.exportOperation, null);
  assert.ok(!texts(u.host.render()).includes('写真に保存しました。'));
  u.host.componentWillUnmount();
});

test('choosing a different history item drops the old completion even when returning to its ID', async () => {
  const u = await nativeExportHost('saveToPhotos', true);
  const restoreRuntime = suspendExport(u);
  u.finish(); await u.pending; restoreRuntime();
  await u.host.act('loadHistory');
  await u.host.act('openDetail', RID);
  assert.equal(u.host.exportOperation, null);
  await u.host.act('openDetail', PID);
  assert.equal(u.host.exportOperation, null);
  assert.ok(!texts(u.host.render()).includes('写真に保存しました。'));
  u.host.componentWillUnmount();
});

test('real owner wrapper separates focus and runtime loading from permissions', () => {
  const file = fs.readFileSync(path.join(ROOT, 'screens/PieceOwnerHistoryScreen.js'), 'utf8');
  const wrapper = file.slice(file.indexOf('export default function PieceOwnerHistoryScreen')).replace('export default ', '');
  const state = { focused: true, tutorial: false, runtime: { loaded: true, loading: false }, allowed: true };
  const context = vm.createContext({
    useAuth: () => ({ session: { user: { id: OWNER } } }),
    useAppRuntime: () => ({ runtime: state.runtime, isFeatureEnabled: () => state.allowed }),
    useTutorial: () => ({ isTutorialMode: state.tutorial }), useIsFocused: () => state.focused,
    flagNames: ['piece_v2_owner_read_enabled', 'piece_v2_visibility_toggle_enabled',
      'piece_v2_public_write_enabled', 'piece_v2_delete_enabled', 'piece_v2_export_enabled'],
    PieceOwnerHistoryHost: 'OwnerHost', h: (type, props) => ({ type, props }),
  });
  vm.runInContext(wrapper + '\nglobalThis.Screen = PieceOwnerHistoryScreen;', context);
  const render = () => context.Screen({ navigation: {}, route: {} }).props;
  assert.equal(render().presentationActive, true); assert.equal(render().runtimePending, false);
  state.runtime = { loaded: true, loading: true }; state.allowed = false;
  assert.equal(render().enabled, false); assert.equal(render().presentationActive, true); assert.equal(render().runtimePending, true);
  state.runtime = { loaded: true, loading: false, error: new Error('offline') };
  assert.equal(render().runtimePending, false); assert.equal(render().enabled, false);
  state.focused = false; assert.equal(render().presentationActive, false);
  state.focused = true; state.tutorial = true; assert.equal(render().presentationActive, false);
});

test('receipt transport opts in through a response header and validates an exact body-free acknowledgment', async () => {
  const r = record({renderer_version:'piece.rn_bitmap_renderer.ios.v2'});
  const receipt = {
    receipt_version:'piece.export_receipt.v1', piece_id:r.public_id, expected_row_version:r.row_version,
    piece_text_hash:r.piece_text_hash, visual_recipe_hash:r.visual_recipe_hash,
    visual_catalog_version:'piece.visual_catalog.v1', layout_policy_version:'piece.long_text_layout.v1',
    renderer_family:'rn_native', renderer_version:r.renderer_version, export_contract_version:'piece.export_contract.v1',
    output_profile:'png_1080x1350_srgb_v1', mime_type:'image/png', width:1080, height:1350,
    asset_sha256:'a'.repeat(64), generated_at:'2026-11-04T00:00:00.000Z',
    persistent_server_asset:false, body_free:true,
  };
  const {expected_row_version, ...reply}=receipt;
  let response={...reply,export_id:RID};
  let header=true;
  const h=harness({send:async url=>url.endsWith('/export-receipt') ? packet(response) : {
    ...packet(r), headers:{get:name=>header && name==='X-Piece-Export-Receipt' ? '1' : null}
  }});
  const seen=[];
  await h.requestPieceOwner('export',detailInput,{...options,onExportReceiptSupport:x=>seen.push(x)});
  header=false;
  await h.requestPieceOwner('export',detailInput,{...options,onExportReceiptSupport:x=>seen.push(x)});
  assert.deepEqual(seen,[true,false]);
  assert.equal(h.calls[0][1].headers['X-Piece-Export-Receipt'],'1');
  const postOptions={...options,idempotencyKey:'b'.repeat(32)};
  assert.deepEqual(copy(await h.requestPieceOwner('exportReceipt',{piece_id:PID,receipt},postOptions)),response);
  const [endpoint, init]=h.calls[2];
  assert.equal(endpoint,'/emotion/piece/'+PID+'/export-receipt');
  assert.equal(init.method,'POST');
  assert.equal(init.headers['Idempotency-Key'],postOptions.idempotencyKey);
  assert.deepEqual(JSON.parse(init.body),receipt);
  await assert.rejects(h.requestPieceOwner('exportReceipt',{piece_id:PID,receipt:{...receipt,uri:'file:///private'}},postOptions),err('PIECE_REQUEST_INVALID'));
  assert.equal(h.calls.length,3);
  response={...response,asset_sha256:'c'.repeat(64)};
  await assert.rejects(h.requestPieceOwner('exportReceipt',{piece_id:PID,receipt},postOptions),err('PIECE_TEMPORARILY_UNAVAILABLE'));
});
