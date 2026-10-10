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
function harness({ send, session, random } = {}) {
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
    PieceVisualCard: 'PieceVisualCard', View: 'View', Text: 'Text', ScrollView: 'ScrollView', Button: 'Button', SafeAreaView: 'SafeAreaView', ActivityIndicator: 'ActivityIndicator',
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
