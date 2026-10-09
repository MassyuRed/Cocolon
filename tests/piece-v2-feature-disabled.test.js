"use strict";
// Actual Piece API/controller/host and AppRuntimeProvider; React, Auth, timers,
// HTTP and native primitives are doubles. No live server or device is exercised.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ROOT = path.resolve(__dirname, '..');
const CODE = 'PIECE_FEATURE_DISABLED';
const MESSAGE = 'Pieceは現在利用できません。';
const clone = value => JSON.parse(JSON.stringify(value));
const tick = () => new Promise(resolve => setImmediate(resolve));
const disabled = () => ({ status: 503, json: async () => ({ code: CODE }) });
function ui(send) {
  const source = fs.readFileSync(path.join(__dirname, 'piece-v2-preview-display.test.js'), 'utf8')
    .split("for (const format of ['short_essay', 'quote', 'declaration'])")[0];
  const context = vm.createContext({ require, __dirname, AbortController });
  vm.runInContext(source + '\nglobalThis.fixture = { previewUiHarness, controllerInput, response, deferredPieceResponse };', context);
  const f = context.fixture, u = f.previewUiHarness({ send });
  let refreshes = 0;
  u.host.context = { refreshAppRuntime: async () => { refreshes++; } };
  return { ...u, ...f, refreshes: () => refreshes };
}
function runtime() {
  const source = fs.readFileSync(path.join(__dirname, 'piece-v2-runtime.test.js'), 'utf8')
    .split('for (const flag of FLAGS)')[0];
  const context = vm.createContext({ require, __dirname, AbortController });
  vm.runInContext(source + '\nglobalThis.fixture = harness;', context);
  return context.fixture();
}
function transport(send) {
  const source = fs.readFileSync(path.join(ROOT, 'features/piece/pieceApi.js'), 'utf8')
    .replace(/^import .*;$/gm, '').replace(/^export /gm, '');
  const context = vm.createContext({ AbortController,
    apiFetch: send, getAccessToken: async () => 'synthetic-token' });
  vm.runInContext(source + '\nglobalThis.api={requestPieceSourceRef,requestPiecePreview};', context);
  return context.api;
}
for (const method of ['GET', 'POST']) test(`${method}: exact 503 disabled is distinct from retryable transport failure`, async () => {
  const fixture = ui(), api = transport(async () => disabled()), c = fixture.controllerInput();
  const operation = method === 'GET'
    ? api.requestPieceSourceRef(c.request.source_ref.source_input_id, c)
    : api.requestPiecePreview(c.request, c);
  await assert.rejects(operation, error => {
    assert.equal(error.code, CODE); assert.equal(error.status, 503);
    assert.equal(error.message, MESSAGE); assert.equal(error.name, 'PieceApiError');
    assert.equal(Object.hasOwn(error, 'body'), false); assert.equal(Object.hasOwn(error, 'cause'), false);
    return true;
  });
});
for (const [status, value] of [[200, {code: CODE}], [403, {code: CODE}],
    [503, {code: CODE, detail: 'PRIVATE'}], [503, {code: 'OTHER_DISABLED'}]]) {
  test(`unbound ${status}/${Object.keys(value).join(',')}/${value.code} does not masquerade as a feature decision`, async () => {
    const u = ui(async () => ({ status, json: async () => value }));
    u.mount(); u.host.start(); await tick();
    assert.equal(u.refreshes(), 0); assert.equal(u.host.controller.getView().canRetry, true);
    assert.doesNotMatch(JSON.stringify(u.tree()), /PRIVATE/); u.host.componentWillUnmount();
  });
}
test('current preview disabled closes modal, offers no retry and refreshes existing runtime once', async () => {
  const u = ui(async () => disabled()); u.mount(); u.host.start(); await tick();
  assert.equal(u.host.state.open, false); assert.equal(u.refreshes(), 1); assert.equal(u.calls.length, 1);
  const view = u.host.controller.getView();
  assert.equal(view.phase, 'unavailable'); assert.equal(view.preview, null); assert.equal(view.canRetry, false);
  assert.equal(view.message, MESSAGE); assert.equal(view.canSave, false); assert.equal(view.canExport, false);
  assert.equal(u.nodes(u.tree()).some(n => n.type === 'Modal'), false);
  assert.equal(u.nodes(u.tree()).some(n => n.type === 'Button'), false);
  assert.match(JSON.stringify(u.tree()), /Pieceは現在利用できません/);
  for(let i=0;i<3;i++){ u.tree(); u.host.controller.refresh(); u.host.componentDidUpdate(); }
  u.host.retry(); u.host.close(); u.host.start(); await u.host.controller.retry(); await tick();
  assert.equal(u.calls.length, 1); assert.equal(u.refreshes(), 1); u.host.componentWillUnmount();
});
test('same detached source/key cannot reset disabled by repeating setContext', async () => {
  const u = ui(async () => disabled()); u.mount(); u.host.start(); await tick();
  u.host.controller.setContext(u.controllerInput()); u.host.start(); await tick();
  assert.equal(u.host.controller.getView().message, MESSAGE); assert.equal(u.calls.length, 1);
  assert.equal(u.refreshes(), 1); u.host.componentWillUnmount();
});
for(const failure of ['throw', 'reject', 'missing']) test(`runtime ${failure} cannot turn disabled into retry or leak exception`, async () => {
  const u = ui(async () => disabled()); let refreshes = 0;
  u.host.context = failure === 'missing' ? undefined : {refreshAppRuntime: () => {
    refreshes++; if(failure === 'throw') throw Error('PRIVATE'); return Promise.reject(Error('PRIVATE'));
  }};
  u.mount(); u.host.start(); await tick(); await tick();
  assert.equal(u.host.state.open, false); assert.equal(u.host.controller.getView().canRetry, false);
  assert.equal(u.host.controller.getView().message, MESSAGE); assert.doesNotMatch(JSON.stringify(u.tree()), /PRIVATE/);
  u.host.retry(); await tick(); assert.equal(u.calls.length, 1); assert.equal(refreshes, failure==='missing'?0:1);
  u.host.componentWillUnmount();
});
for (const boundary of ['close', 'disable', 'account', 'source', 'unmount', 'background']) {
  test(`obsolete disabled after ${boundary} does not refresh another context`, async () => {
    const f=ui(), d=f.deferredPieceResponse(), u=ui(()=>d.promise);
    u.mount(); u.host.start(); await tick();
    if(boundary==='close')u.host.close();
    if(boundary==='unmount')u.host.componentWillUnmount();
    if(boundary==='background')u.background('inactive');
    if(['disable','account','source'].includes(boundary)){
      const c=u.controllerInput();
      if(boundary==='disable')c.enabled=false;
      if(boundary==='account')c.expectedUserId='20000000-0000-4000-8000-000000000099';
      if(boundary==='source'){c.request.source_ref.source_input_id='20000000-0000-4000-8000-000000000099';c.idempotencyKey='new-key';}
      u.host.props={context:c};u.host.componentDidUpdate();
    }
    d.resolve(disabled());await tick();
    assert.equal(u.refreshes(),0);assert.equal(u.calls.length,1);
    assert.equal(u.nodes(u.tree()).some(n=>n.props.testID==='piece-canonical-text'),false);
    if(boundary!=='unmount')u.host.componentWillUnmount();
  });
}
test('changed props before componentDidUpdate also suppress old disabled notification', async()=>{
  const f=ui(),d=f.deferredPieceResponse(),u=ui(()=>d.promise);u.mount();u.host.start();await tick();
  const c=u.controllerInput();c.expectedUserId='next-account';u.host.props={context:c};
  d.resolve(disabled());await tick();assert.equal(u.refreshes(),0);assert.equal(u.tree(),null);
  u.host.componentDidUpdate();u.host.componentWillUnmount();
});
for(const outcome of ['off','on','failure'])test(`existing runtime ${outcome}: invalidates cached true and never generates/revives automatically`,async()=>{
  const h=runtime();let r=h.render();h.flushEffects();let p=r.refreshAppRuntime();
  h.pending[0].resolve({feature_flags:{piece_v2_preview_enabled:true},recommended_version:'2.0.0'});await p;r=h.render();
  assert.equal(r.isFeatureEnabled('piece_v2_preview_enabled',false),true);
  const u=ui(async()=>disabled());u.host.context=r;u.mount();u.host.start();await tick();
  r=h.render();assert.equal(h.pending.length,2);assert.equal(r.isFeatureEnabled('piece_v2_preview_enabled',false),false);
  assert.equal(r.runtime.recommendedVersion,'2.0.0');assert.equal(u.host.state.open,false);
  // Match the real parent's prop update while bootstrap is pending.
  u.host.props={context:u.controllerInput({enabled:r.isFeatureEnabled('piece_v2_preview_enabled',false)})};u.host.componentDidUpdate();
  if(outcome==='failure')h.pending[1].reject(Error('synthetic-bootstrap-failure'));
  else h.pending[1].resolve({feature_flags:{piece_v2_preview_enabled:outcome==='on'}});
  await tick();r=h.render();u.host.context=r;
  u.host.props={context:u.controllerInput({enabled:r.isFeatureEnabled('piece_v2_preview_enabled',false)})};u.host.componentDidUpdate();
  assert.equal(h.pending.length,2);assert.equal(u.calls.length,1);assert.equal(u.host.state.open,false);
  assert.equal(u.nodes(u.tree()).some(n=>n.props.testID==='piece-canonical-text'),false);
  if(outcome==='on'){
    // A fresh allowed state is presentation only. A new explicit action retains
    // the original serialized request and idempotency key, never a silent retry.
    u.host.start();await tick();assert.equal(u.calls.length,2);
    assert.equal(u.calls[1][1].body,u.calls[0][1].body);
    assert.equal(u.calls[1][1].headers['Idempotency-Key'],u.calls[0][1].headers['Idempotency-Key']);
    h.pending[2].resolve({feature_flags:{piece_v2_preview_enabled:false}});await tick();
  }else {u.host.start();await tick();assert.equal(u.calls.length,1);}
  u.host.componentWillUnmount();h.cleanupEffects();
});
test('host consumes the existing exported AppRuntimeContext, without a new global event bus',()=>{
  const source=fs.readFileSync(path.join(ROOT,'screens/input/InputPieceActionArea.js'),'utf8');
  assert.match(source,/import \{ AppRuntimeContext \} from '..\/..\/AppRuntimeContext';/);
  assert.match(source,/static contextType = AppRuntimeContext/);
  assert.match(fs.readFileSync(path.join(ROOT,'AppRuntimeContext.js'),'utf8'),/export const AppRuntimeContext = createContext\(/);
});
