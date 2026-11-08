const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const deferred = () => { let resolve; const promise = new Promise(a => { resolve = a; }); return { promise, resolve }; };
const tick = async () => { for (let i = 0; i < 30; i++) await Promise.resolve(); };
const strip = source => source.replace(/^import\s[\s\S]*?;\r?\n/gm, '').replace(/^export\s+(?:default\s+)?(?=(?:async\s+)?(?:function|const)\b)/gm, '');

function harness(file, exportName, args = {}) {
  let owner = 'A', generation = 0, cursor = 0, dirty = false, value, sessionWait = null;
  const slots = [], effects = [], gets = [], writes = [], alerts = [], signouts = [], users = new Map();
  const currentUser = () => { if (!owner) return null; if (!users.has(owner)) users.set(owner, {id:owner}); return users.get(owner); };
  const slot = fn => { const i = cursor++; if (!(i in slots)) slots[i] = fn(); return i; };
  const response = body => ({ ok: true, status: 200, text: async () => JSON.stringify(body), json: async () => body });
  const auth = { getSession: async () => {
    if (sessionWait) await sessionWait.promise;
    return { data: { session: owner ? { user: { id: owner }, access_token: 'synthetic-' + owner } : null } };
  } };
  const fetch = async (url, opts) => {
    if (opts.signal?.aborted) throw Object.assign(new Error('cancelled'), { name: 'AbortError' });
    const target = String(opts.headers.Authorization || '').replace('Bearer synthetic-', '');
    if (opts.method === 'GET') {
      const pending = deferred(); gets.push({ ...pending, url, owner: target, signal: opts.signal });
      return pending.promise.then(response);
    }
    const body = JSON.parse(opts.body); writes.push({ url, owner: target, body });
    return response(body);
  };
  const cb = { Platform: { OS: 'android' }, supabase: { auth }, readRuntimeApiBaseUrl: () => 'https://example.test', captureApiError() {},
    fetch, AbortController, setTimeout: (fn, ms) => { const t = setTimeout(fn, ms); t.unref(); return t; }, clearTimeout, process: { env: {} } };
  const client = Function(...Object.keys(cb), strip(read('lib/apiClient.js')) + '\nreturn {apiGet,apiPatch,apiPost,apiFetch};')(...Object.values(cb));
  const model = Function(strip(read('screens/account/accountModel.js')) + '\nreturn {normalizeDisplayName,DISPLAY_NAME_MAX_LENGTH,DISPLAY_NAME_TAKEN_MESSAGE,mapDisplayNameConflictMessage,readAccountStatusValue};')();
  const settings = Function('apiGet','apiPatch',strip(read('lib/reportDistributionApi.js'))+'\nreturn {getReportDistributionSettings,patchReportDistributionSettings};')(client.apiGet,client.apiPatch);
  const today = Function('apiGet','apiPatch','apiPost',strip(read('lib/api/home/todayQuestionApi.js'))+'\nreturn {getTodayQuestionSettings,patchTodayQuestionSettings,resolveLocalTimezoneName,getTodayQuestionHistory,patchTodayQuestionAnswer};')(client.apiGet,client.apiPatch,client.apiPost);
  const bindings = { ...client, ...model, ...settings, ...today, AbortController, Platform: { OS: 'android' },
    useAuth: () => ({ user: currentUser(), authOwnerGeneration: generation, authLoading: false, signOut: async opts => signouts.push(opts) }),
    useSubscription: () => ({ isPaid: true, tier: 'plus', loading: false }),
    makeUiTokens: () => ({}), createStyles: () => ({}), useWindowDimensions: () => ({ height: 800 }),
    getHistoryRetentionLabel: () => 'test retention', RESONANCE_PIECES_ENDPOINT: '/piece/resonances/pieces', PAGE_LIMIT: 50, HISTORY_PAGE_LIMIT: 60,
    useTheme: () => ({ colors: {}, themeName: 'default' }), useAnalysisMenuStyles: () => ({ ui: {} }),
    createLocalStyles: () => ({}), THEME_VARIANTS: {},
    useUnread: () => ({ setUnread() {} }), useTutorial: () => ({}), useAppRuntime: () => ({ isFeatureEnabled: () => true }),
    clearDeletedAccountLocalState: async () => {}, EMOTION_NOTIFICATION_GLOBAL_OWNER_ID: 'global',
    resolveEmotionNotificationEnabled: () => true,
    ACCOUNT_WIRE: { routes: { visibilityMe: '/account/visibility/me', status: '/account/status' } }, FOLLOW_WIRE: { routes: { create: '/follow/create', delete: '/follow/delete' } },
    buildFollowStatsPath: id => '/follow/stats/' + id,
    readShareCode: value => value?.share_code, readConnectCode: value => value?.connect_code,
    readShareCodePublic: (value, fallback) => value?.is_share_code_public ?? fallback,
    Alert: { alert: (...args) => alerts.push(args) }, Share: { share: async () => {} }, console: { warn() {}, error() {} },
    useRef: initial => slots[slot(() => ({ current: initial }))],
    useState: initial => { const i = slot(() => typeof initial === 'function' ? initial() : initial); return [slots[i], next => {
      const v = typeof next === 'function' ? next(slots[i]) : next;
      if (!Object.is(v, slots[i])) { slots[i] = v; dirty = true; }
    }]; }, useMemo: fn => fn(), useEffect: (fn, deps) => {
      const i = slot(() => null), before = slots[i];
      if (!before || deps.some((v,j) => !Object.is(v,before.deps[j]))) { slots[i] = { deps }; effects.push(() => { before?.cleanup?.(); slots[i].cleanup = fn(); }); }
    },
  };
  bindings.useCallback = (fn, deps) => {
    const i=slot(()=>null), before=slots[i];
    if(!before || deps.some((v,j)=>!Object.is(v,before.deps[j]))) slots[i]={fn,deps};
    return slots[i].fn;
  };
  bindings.useFocusEffect = fn => bindings.useEffect(fn,[fn]);
  let source = read(file);
  if (exportName.endsWith('HistoryScreen') || exportName === 'ResonanceHistoryListScreen') {
    source=source.slice(source.indexOf('export default function '+exportName));
    const at=exportName==='TodayQuestionHistoryScreen' ? source.indexOf('  if (!todayQuestionHistoryEnabled) {\n    return') : source.indexOf('  const renderItem =');
    assert.ok(at>0);
    source=source.slice(0,at)+(exportName==='TodayQuestionHistoryScreen' ? 'return {items,load,saveEdit,openItem,updateLocalEdit,editState,loading,loadingMore};\n}' : 'return {items,fetchPage,fetchInitial,order,errorText,loading};\n}');
  }
  if (exportName.startsWith('Settings')) {
    source = source.slice(source.indexOf('export default function ' + exportName));
    source = source.slice(0, source.indexOf('  const Container = embedded ? View : AnalysisMenuScroll;')) +
      (exportName === 'SettingsAppSettingsScreen' ? 'return {updatePushEnabled,updateTodayQuestionNotificationEnabled,updateReportDistributionNotificationEnabled,updateEmotionNotificationEnabled};\n}' : 'return {handleDeleteAccount,executeDeleteAccount};\n}');
  }
  const Component = Function(...Object.keys(bindings), strip(source) + '\nreturn ' + exportName + ';')(...Object.values(bindings));
  const render = () => { cursor = 0; dirty = false; value = Component({ user: currentUser(), targetUserId: owner, isSelf: true, navigation: {}, ...args }); while (effects.length) effects.shift()(); return value; };
  render();
  return { gets, writes, alerts, signouts, render, get value() { return value; },
    holdSession() { sessionWait = deferred(); return sessionWait; },
    switchTo(id) { if (owner !== id) generation++; owner = id; render(); },
    async settle() { for (let i = 0; i < 8; i++) { await tick(); if (dirty) render(); } },
    async resolveAllGets(body = {}) { for (const req of gets) req.resolve(body); await this.settle(); },
  };
}


for (const screen of ['TodayQuestionHistoryScreen','ResonanceHistoryListScreen']) {
  for (const next of ['B',null]) test(`${screen} late A records cannot replace ${next || 'signed-out'} history`,async()=>{
    const p=harness('screens/'+screen+'.js',screen);await p.settle();const old=p.gets[0];
    p.switchTo(next);await p.settle();old.resolve({items:[{answer_id:'a-private',q_instance_id:'a-private',free_text:'A-only'}]});await p.settle();
    assert.deepEqual(p.value.items,[]);
    if(next){p.gets.at(-1).resolve({items:[{answer_id:'b-own',q_instance_id:'b-own'}]});await p.settle();assert.equal(p.value.items[0].answer_id,'b-own');}
  });
}

test('today-question history edit cannot send A text under B after delayed auth',async()=>{
  const p=harness('screens/TodayQuestionHistoryScreen.js','TodayQuestionHistoryScreen');await p.settle();
  const item={answer_id:'A-answer',answer_mode:'free_text',free_text:'A-source'};await p.resolveAllGets({items:[item]});
  p.value.openItem(item);p.render();p.value.updateLocalEdit(item.answer_id,{freeText:'A-edited'});p.render();
  const held=p.holdSession(),work=p.value.saveEdit(item);await tick();p.switchTo('B');held.resolve();await work;await p.settle();
  assert.equal(p.writes.length,0);assert.deepEqual(p.value.editState,{});assert.deepEqual(p.value.items,[]);
});

test('same-owner today-question edit keeps its answer ID and text payload',async()=>{
  const p=harness('screens/TodayQuestionHistoryScreen.js','TodayQuestionHistoryScreen');await p.settle();
  const item={answer_id:'A-answer',answer_mode:'free_text',free_text:'A-source'};await p.resolveAllGets({items:[item]});
  p.value.openItem(item);p.render();p.value.updateLocalEdit(item.answer_id,{freeText:'A-edited'});p.render();
  const work=p.value.saveEdit(item);await p.settle();p.gets.at(-1).resolve({items:[{...item,free_text:'A-edited'}]});await work;await p.settle();
  assert.equal(p.writes.length,1);assert.equal(p.writes[0].owner,'A');assert.match(p.writes[0].url,/A-answer$/);
  assert.deepEqual(p.writes[0].body,{answer_mode:'free_text',free_text:'A-edited'});
});

test('resonance history ignores a superseded sort response even if transport resolves after abort',async()=>{
  const p=harness('screens/ResonanceHistoryListScreen.js','ResonanceHistoryListScreen');await p.settle();await p.resolveAllGets({items:[]});
  const a=p.value.fetchPage({nextOrder:'oldest',nextOffset:0,append:false});await p.settle();const older=p.gets.at(-1);
  const b=p.value.fetchPage({nextOrder:'newest',nextOffset:0,append:false});await p.settle();const newer=p.gets.at(-1);
  newer.resolve({items:[{q_instance_id:'new'}]});await b;older.resolve({items:[{q_instance_id:'old'}]});await a;await p.settle();
  assert.equal(older.signal.aborted,true);assert.deepEqual(p.value.items,[{q_instance_id:'new'}]);
});
