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
    lifecycle_status: 'saved', saved_at: '2026-10-10T01:00:00+00:00', row_version: 2, ...extra };
}
function harness({ send, session, random, exportPrepare } = {}) {
  const calls = [], sessions = [], alerts = [], appListeners = new Set();
  const React = { Component: class {
    constructor(props) { this.props = props; this.state = {}; }
    setState(v) { this.state = { ...this.state, ...(typeof v === 'function' ? v(this.state) : v) }; }
  }, createElement: (type, props, ...children) => typeof type === 'function' ? type(props || {}) : { type, props: props || {}, children } };
  const context = vm.createContext({ React, AbortController, Uint8Array, Date, Object, JSON,
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
    ['features/piece/pieceApi.js', ['PieceApiError', 'readPiecePreviewSnapshot', 'preparePiecePreviewRequest', 'requestPieceOwner', 'readPieceOwnerSnapshot']],
    ['features/piece/piecePreviewModel.js', ['verifyPieceArtifactHashes']],
    ['features/piece/pieceOwnerModel.js', ['readPieceOwnerDisplay', 'pieceOwnerPermissions']],
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

function exportHost({prepareWait, fresh, captureWait, result={outcome:'saved_to_photos'}}={}) {
  const events=[];
  const asset={dispose:async()=>events.push('dispose'),saveToPhotos:async()=>{events.push('photos');return result;},
    openShare:async()=>{events.push('share');return result;}};
  const h=harness({exportPrepare:async options=>{events.push(['prepare',options]);if(prepareWait)await prepareWait;
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
test('fresh changed record cannot replace the selected detail for export',async()=>{
  const u=exportHost({fresh:record({row_version:3})});await u.ready();
  assert.equal(u.host.exportAttempt,null);assert.equal(u.events.filter(x=>Array.isArray(x)&&x[0]==='capture').length,0);
  assert.ok(texts(u.host.render()).includes('画像を準備できませんでした。もう一度お試しください。'));u.host.componentWillUnmount();
});
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
