// Actual screen callbacks, owner hook and API adapters; all network/native I/O is synthetic.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const Renderer = require('react-test-renderer');
const babel = require('@babel/core');
const { act } = Renderer;
const ROOT = path.resolve(__dirname, '..');
const compiled = new Map();
const deferred = () => { let resolve; const promise = new Promise(done => { resolve = done; }); return { promise, resolve }; };
const tick = async () => { for (let i = 0; i < 30; i++) await Promise.resolve(); };

async function harness(t, file, initialTab = 'following', options = {}) {
  const control = { owner: 'A', generation: 0, session: { user: { id: 'A' }, access_token: 'synthetic-A' },
    authGate: null, holdRead: null, failWrite: false, ...options };
  const calls = [], events = [], alerts = [], routes = [], timers = [], listeners = new Set(), pushListeners = new Set(), modules = new Map();
  const noop = () => {};
  const tutorialPieces = [];
  const native = Object.fromEntries(['ActivityIndicator', 'KeyboardAvoidingView', 'Modal', 'ScrollView', 'StatusBar',
    'Text', 'TextInput', 'TouchableOpacity', 'View', 'RefreshControl'].map(name => [name, name]));
  Object.assign(native, { Platform: { OS: 'ios' }, StyleSheet: { create: value => value, flatten: value => value },
    useWindowDimensions: () => ({ width: 390, height: 844, fontScale: 1 }),
    AppState: { currentState: 'active', addEventListener: (_name, listener) => {
      listeners.add(listener); return { remove: () => listeners.delete(listener) };
    } }, Alert: { alert: (...args) => alerts.push(args) },
    FlatList: props => React.createElement('List', props,
      props.ListHeaderComponent,
      props.data.length ? props.data.map((item, index) => React.createElement(React.Fragment, { key: item.id || item.notice_id || index }, props.renderItem({ item }))) : props.ListEmptyComponent,
      props.ListFooterComponent),
  });
  const navigation = { navigate: (...args) => routes.push(args), goBack: noop, addListener: () => noop, isFocused: () => true };
  const unread = { getScopeUnread: () => false, getFeatureUnread: (_scope, key) => key === 'feed',
    setUnread: (...args) => events.push(['unread', ...args]), setUnreadGroup: (...args) => events.push(['unreadGroup', ...args]),
    setPrefetch: (...args) => events.push(['prefetch', ...args]), getPrefetchEntryFresh: () => null,
    applyStartupSnapshot: value => events.push(['startup', value]) };
  const session = () => control.owner ? control.session : null;
  const auth = { getSession: async () => { if (control.authGate) await control.authGate.promise; return { data: { session: session() } }; },
    getUser: async () => ({ data: { user: session()?.user }, error: null }) };
  const notice = { notice_id: 'notice', title: 'お知らせ', body: '確認本文', is_read: false, actions: [] };
  const packet = (body, ok = true) => ({ ok, status: ok ? 200 : 503, text: async () => JSON.stringify(body), json: async () => body });
  function defaultBody(url, options) {
    if (options.method !== 'GET') return { unread_count: 0, resonated: true, resonances: 1 };
    const p = new URL(url).pathname;
    if (p === '/self-structure/latest/status') return control.mapStatus || { version_key: null, has_visible_content: false };
    if (p === '/notices/history') return { items: [notice], unread_count: 1 };
    if (p === '/follow/list') return { rows: [{ id: 'C', display_name: 'C-name' }, { id: 'D', display_name: 'D-name' }] };
    if (p === '/follow/stats') return { following_count: 2, follower_count: 0 };
    if (p.includes('/follow/requests')) return { requests: [{ request_id: 'request', requester_user_id: 'C', requester_display_name: 'C-name',
      target_user_id: 'C', target_display_name: 'C-name' }], total_items: 1 };
    if (p.includes('emotion-notification')) return { settings: [] };
    if (p === '/nexus/emotion-log') return { items: [{ id: 'notification', owner_user_id: 'C', created_at: '2026-11-07T00:00:00Z', emotions: ['不安'] }] };
    if (p.endsWith('/unread-status')) return { feed_unread: true, has_unread: false };
    return { items: [] };
  }
  const fetch = async (url, options) => {
    assert.equal(options.signal?.aborted, false, 'an obsolete operation must stop before the transport');
    const call = { url, path: new URL(url).pathname, options, owner: options.headers.Authorization?.replace('Bearer synthetic-', '') };
    calls.push(call);
    if (options.method === 'GET' && control.holdRead?.(call)) {
      Object.assign(call, deferred());
      return call.promise.then(body => packet(body));
    }
    return packet(defaultBody(url, options), options.method === 'GET' || !control.failWrite);
  };
  const timer = (callback, ms) => { const entry = { callback, ms, active: true }; timers.push(entry); return entry; };
  const clear = entry => { if (entry) entry.active = false; };
  function load(relative) {
    if (modules.has(relative)) return modules.get(relative);
    const filename = path.join(ROOT, relative);
    if (!compiled.has(relative)) compiled.set(relative, babel.transformSync(fs.readFileSync(filename, 'utf8'), {
      filename, babelrc: false, configFile: false, presets: [require.resolve('@babel/preset-react')],
      plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')],
    }).code);
    const module = { exports: {} }; modules.set(relative, module.exports);
    const requireLocal = name => {
      if (name === 'react') return React;
      if (name === 'react-native') return native;
      if (name === 'react-native-vector-icons/Ionicons') return 'Icon';
      if (name === 'react-native-safe-area-context') return { SafeAreaView: 'SafeAreaView', useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) };
      if (name === '@react-native-async-storage/async-storage') return { getItem: async () => null };
      if (name === '@react-native-firebase/messaging') return () => ({ onMessage: listener => {
        pushListeners.add(listener); return () => pushListeners.delete(listener);
      } });
      if (name === '@react-navigation/native') return { StackActions: { popToTop: noop } };
      if (name === '@react-navigation/bottom-tabs') return { createBottomTabNavigator: () => ({
        Navigator: props => React.createElement('Navigator', props, props.children),
        Screen: props => typeof props.children === 'function' ? props.children({ navigation }) : null,
      }), BottomTabBar: 'BottomTabBar' };
      const target = name.startsWith('.') ? path.relative(ROOT, path.resolve(path.dirname(filename), name)) + '.js' : name;
      if (target === 'AuthContext.js') return { useAuth: () => ({ user: session()?.user, session: session(), initializing: false,
        recoveryMode: false, authOwnerGeneration: control.generation }) };
      if (target === 'UnreadContext.js') return { useUnread: () => unread };
      if (target === 'SubscriptionContext.js') return { useSubscription: () => ({ isPaid: false, loading: false,
        tier: 'free', subscriptionBootstrapLoaded: true, subscriptionBootstrapLoading: false }) };
      if (target === 'TutorialContext.js') return { useTutorial: () => ({ isTutorialMode: false, tutorialStep: 0, tutorialPieces,
        tutorialFlagsLoaded: true, tutorialCompleted: true, ensureTutorialPiecesSeed: noop, setTutorialStep: noop }) };
      if (target === 'AppRuntimeContext.js') return { useAppRuntime: () => ({ isFeatureEnabled: () => false }) };
      if (target === 'tutorial/tutorialScenarioData.js') return { TUTORIAL_TOTAL_STEPS: 16 };
      if (target === 'theme/ThemeContext.js') return { useTheme: () => ({ colors: {}, themeName: 'light' }) };
      if (target === 'lib/supabase.js') return { supabase: { auth } };
      if (target === 'lib/user.js') return { getCurrentUserId: async () => control.owner };
      if (target === 'lib/monitoring.js') return { captureApiError: noop };
      if (target === 'navigation/navigationRef.js') return { navigationRef: { isReady: () => false }, buildAnalysisRootNavigationParams: value => value };
      if (target === 'components/GlobalFrameLayout.js') return { __esModule: true, FRAME_BORDER_WIDTH: 0,
        default: props => React.createElement('GlobalFrameLayout', props, props.headerBottomSlot, props.children) };
      if (target === 'lib/noticeActionRuntime.js') return { getNoticeButtonActions: () => [{ label: 'リンクを開く' }],
        openNoticeAction: async (_action, { openInternalRoute }) => openInternalRoute('Account') };
      if (target === 'components/TutorialOverlay.js') return { __esModule: true, default: 'TutorialOverlay',
        syncTutorialSpotlightTarget: async () => null, waitForTutorialFrames: async () => {} };
      if (target.startsWith('components/') || target.startsWith('runtime/') || /navigation\/.*StackNavigator\.js$/.test(target) ||
          /screens\/nexus\/Nexus/.test(target)) return { __esModule: true, default: path.basename(target, '.js'), BottomTabUnreadBadge: 'UnreadBadge' };
      if (name.startsWith('.')) return load(target);
      return require(name);
    };
    Function('require', 'module', 'exports', 'fetch', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'console', compiled.get(relative))(
      requireLocal, module, module.exports, fetch, timer, clear, timer, clear, { warn: noop });
    modules.set(relative, module.exports); return module.exports;
  }
  const Screen = load(file).default;
  let root;
  const element = () => React.createElement(Screen, { navigation, route: { params: { initialTab } } });
  await act(async () => { root = Renderer.create(element()); await tick(); });
  t.after(async () => { await act(async () => root.unmount()); });
  const h = { control, calls, events, alerts, routes, root,
    find: type => root.root.findByType(type),
    async flush() { await act(async () => { await tick(); }); },
    async switchTo(owner, generationDelta = 1) { control.owner = owner; control.generation += generationDelta;
      control.session = owner ? { user: { id: owner }, access_token: 'synthetic-' + owner } : null;
      await act(async () => { root.update(element()); await tick(); }); },
    async background(state) { await act(async () => { native.AppState.currentState = state;
      for (const listener of [...listeners]) listener(state); await tick(); }); },
    async backgroundCycle() { await act(async () => {
      for (const state of ['background', 'active']) { native.AppState.currentState = state;
        for (const listener of [...listeners]) listener(state); }
      await tick();
    }); },
    holdAuth() { control.authGate = deferred(); return control.authGate; },
    async releaseAuth(gate) { control.authGate = null; await act(async () => { gate.resolve(); await tick(); }); },
    async resolve(call, body) { await act(async () => { call.resolve(body); await tick(); }); },
    async fireTimers() { const pending = timers.filter(entry => entry.active && entry.ms < 10000);
      await act(async () => { for (const entry of pending) { entry.active = false; entry.callback(); } await tick(); }); },
    async pollMapStatus() { await act(async () => {
      for (const entry of timers.filter(item => item.active && item.ms === 20000)) entry.callback();
      await tick();
    }); },
    async push(data) { await act(async () => {
      for (const listener of [...pushListeners]) listener({ data }); await tick();
    }); },
    pushListeners,
    bannerCount: () => root.root.findAllByType('Text').filter(node => node.props.children === 'わたしマップが更新されました').length,
    bannerTimers: () => timers.filter(entry => entry.ms === 4500).length,
    mutations: () => calls.filter(call => call.options.method !== 'GET'),
  };
  await h.flush(); return h;
}

const followActions = [
  ['following', 'C-nameからの感情通知をオフにする'],
  ['following', 'C-name：フォロー関係を削除'],
  ['followers', 'C-name：フォロー関係を削除'],
  ['requests', 'C-name：承認'],
  ['requests', 'C-name：拒否'],
  ['requested', 'C-name：取消'],
];
for (const [tab, label] of followActions) for (const next of ['B', null, 'ABA', 'ABA-hidden']) {
  test(`follow ${label}/${tab} cannot write after ${next || 'logout'}`, async t => {
    const h = await harness(t, 'screens/FollowListScreen.js', tab);
    const callback = h.root.root.findByProps({ accessibilityLabel: label }).props.onPress;
    const before = h.mutations().length, gate = h.holdAuth();
    let work; await act(async () => { work = callback(); await tick(); });
    if (next === 'ABA') { await h.switchTo('B'); await h.switchTo('A'); }
    else if (next === 'ABA-hidden') await h.switchTo('A', 2);
    else await h.switchTo(next);
    await h.releaseAuth(gate); await work; await h.flush();
    assert.equal(h.mutations().slice(before).filter(call => !call.path.endsWith('/read')).length, 0);
  });
}
for (const [tab, label] of followActions) test(`same-owner follow ${label}/${tab} keeps its original write`, async t => {
  const h = await harness(t, 'screens/FollowListScreen.js', tab);
  const before = h.mutations().length;
  await act(async () => { await h.root.root.findByProps({ accessibilityLabel: label }).props.onPress(); });
  assert.equal(h.mutations().length, before + 1);
  assert.equal(h.mutations().at(-1).owner, 'A');
});

for (const next of ['B', null, 'ABA', 'ABA-hidden']) test(`Nexus resonance authentication cannot cross ${next || 'logout'}`, async t => {
  const h = await harness(t, 'screens/NexusScreen.js');
  const item = { q_instance_id: 'piece', owner: { user_id: 'C' }, viewer_state: { can_resonate: true } };
  const callback = h.find('NexusPieceFeedSection').props.handlePressPieceResonance;
  const gate = h.holdAuth(); let work;
  await act(async () => { work = callback(item); await tick(); });
  if (next === 'ABA') { await h.switchTo('B'); await h.switchTo('A'); }
  else if (next === 'ABA-hidden') await h.switchTo('A', 2);
  else await h.switchTo(next);
  await h.releaseAuth(gate); await work;
  assert.equal(h.mutations().length, 0);
});
for (const next of ['B', null, 'ABA', 'ABA-hidden']) test(`Nexus deletion confirmation cannot resume after ${next || 'logout'}`, async t => {
  const h = await harness(t, 'screens/NexusScreen.js');
  await act(async () => h.find('NexusPieceFeedSection').props.handlePressPieceDelete({ q_instance_id: 'own-piece', owner: { user_id: 'A' } }));
  const confirm = h.alerts.at(-1)[2].find(button => button.style === 'destructive').onPress;
  if (next === 'ABA') { await h.switchTo('B'); await h.switchTo('A'); }
  else if (next === 'ABA-hidden') await h.switchTo('A', 2);
  else await h.switchTo(next);
  await act(async () => { await confirm(); });
  assert.equal(h.mutations().length, 0);
});

for (const dimension of ['owner', 'order']) test(`Nexus ${dimension} A to B to A ignores the first A response`, async t => {
  const h = await harness(t, 'screens/NexusScreen.js');
  h.control.holdRead = call => /\/nexus\/(pieces|reflections)$/.test(call.path);
  const change = async value => {
    await act(async () => {
      if (dimension === 'owner') h.find('NexusOwnerPickerModal').props.handleSelectOwnerOption({ mode: 'user', userId: value });
      else h.find('NexusPieceFeedSection').props.handleSetPieceOrder(value);
      await tick();
    });
  };
  await change(dimension === 'owner' ? 'C' : 'oldest');
  const first = h.calls.at(-1);
  await change(dimension === 'owner' ? 'D' : 'latest');
  await change(dimension === 'owner' ? 'C' : 'oldest');
  const latest = h.calls.at(-1);
  assert.notEqual(first, latest);
  await h.resolve(latest, { items: [{ q_instance_id: 'newest-selection' }] });
  await h.resolve(first, { items: [{ q_instance_id: 'obsolete-selection' }] });
  assert.deepEqual(h.find('NexusPieceFeedSection').props.pieceState.items.map(item => item.q_instance_id), ['newest-selection']);
});

for (const next of ['B', null, 'ABA', 'ABA-hidden']) test(`notice read and its link cannot cross ${next || 'logout'}`, async t => {
  const h = await harness(t, 'screens/NoticeHistoryScreen.js');
  h.control.failWrite = true;
  await act(async () => h.root.root.findByProps({ accessibilityLabel: 'お知らせ詳細を開く' }).props.onPress());
  await h.flush();
  const node = h.root.root.findByProps({ accessibilityLabel: 'リンクを開く' });
  const gate = h.holdAuth(); let work;
  h.control.failWrite = false;
  const callback = node.props.onPress;
  const before = h.mutations().length;
  await act(async () => { work = callback(); await tick(); });
  if (next === 'ABA') { await h.switchTo('B'); await h.switchTo('A'); }
  else if (next === 'ABA-hidden') await h.switchTo('A', 2);
  else await h.switchTo(next);
  await h.releaseAuth(gate); await work;
  assert.equal(h.mutations().length, before);
  assert.equal(h.routes.length, 0);
});

test('background interrupts pending Nexus writes and foreground permits a fresh same-owner action', async t => {
  const h = await harness(t, 'screens/NexusScreen.js');
  const item = { q_instance_id: 'piece', owner: { user_id: 'C' }, viewer_state: { can_resonate: true } };
  const gate = h.holdAuth(); let work;
  await act(async () => { work = h.find('NexusPieceFeedSection').props.handlePressPieceResonance(item); await tick(); });
  await h.background('background'); await h.releaseAuth(gate); await work;
  assert.equal(h.mutations().length, 0);
  await h.background('active');
  await act(async () => { await h.find('NexusPieceFeedSection').props.handlePressPieceResonance(item); });
  assert.equal(h.mutations().length, 1); assert.equal(h.mutations()[0].owner, 'A');
});

for (const next of ['B', null, 'ABA', 'ABA-hidden']) test(`MainTabs retained feed-read callback cannot affect ${next || 'logout'}`, async t => {
  const h = await harness(t, 'navigation/MainTabs.js');
  const callback = h.find('PieceStackNavigator').props.onEmotionLogDisplayed;
  const gate = h.holdAuth(); let work;
  await act(async () => { work = callback('2026-11-07T00:00:00Z'); await tick(); });
  if (next === 'ABA') { await h.switchTo('B'); await h.switchTo('A'); }
  else if (next === 'ABA-hidden') await h.switchTo('A', 2);
  else await h.switchTo(next);
  await h.releaseAuth(gate); await work;
  assert.equal(h.mutations().filter(call => call.path === '/emotion-log/unread/read-feed').length, 0);
});

test('same-owner Nexus resonance and confirmed deletion retain the requested IDs', async t => {
  const h = await harness(t, 'screens/NexusScreen.js');
  await act(async () => { await h.find('NexusPieceFeedSection').props.handlePressPieceResonance({
    q_instance_id: 'followed-piece', q_key: 'question-key', owner: { user_id: 'C' }, viewer_state: { can_resonate: true },
  }); });
  await act(async () => h.find('NexusPieceFeedSection').props.handlePressPieceDelete({ q_instance_id: 'own-piece', owner: { user_id: 'A' } }));
  await act(async () => { await h.alerts.at(-1)[2].find(button => button.style === 'destructive').onPress(); });
  assert.deepEqual(h.mutations().map(call => [call.owner, call.options.method]), [['A', 'POST'], ['A', 'DELETE']]);
  assert.deepEqual(JSON.parse(h.mutations()[0].options.body), { q_instance_id: 'followed-piece', q_key: 'question-key' });
  assert.ok(h.mutations()[1].path.endsWith('/own-piece'));
});

for (const next of ['B', null, 'ABA-hidden']) test(`confirmed Nexus deletion authentication cannot cross ${next || 'logout'}`, async t => {
  const h = await harness(t, 'screens/NexusScreen.js');
  await act(async () => h.find('NexusPieceFeedSection').props.handlePressPieceDelete({ q_instance_id: 'own-piece', owner: { user_id: 'A' } }));
  const confirm = h.alerts.at(-1)[2].find(button => button.style === 'destructive').onPress;
  const gate = h.holdAuth(); let work;
  await act(async () => { work = confirm(); await tick(); });
  await h.switchTo(next === 'ABA-hidden' ? 'A' : next, next === 'ABA-hidden' ? 2 : 1);
  await h.releaseAuth(gate); await work;
  assert.equal(h.mutations().length, 0);
});

test('history sort A to B to A rejects the first A receipt and completes the latest request', async t => {
  const h = await harness(t, 'screens/NexusScreen.js');
  h.control.holdRead = call => call.path === '/nexus/history/resonances';
  await act(async () => { h.find('NexusTabBar').props.setActiveTab('history'); await tick(); });
  const first = h.calls.findLast(call => call.resolve);
  assert.ok(first);
  await act(async () => { h.find('NexusHistorySection').props.handleSetHistoryOrder('oldest'); await tick(); });
  await act(async () => { h.find('NexusHistorySection').props.handleSetHistoryOrder('newest'); await tick(); });
  const latest = h.calls.findLast(call => call.resolve);
  assert.notEqual(first, latest);
  await h.resolve(latest, { items: [{ q_instance_id: 'current-history' }] });
  await h.resolve(first, { items: [{ q_instance_id: 'obsolete-history' }] });
  const state = h.find('NexusHistorySection').props.historyState;
  assert.equal(state.loading, false);
  assert.equal(state.order, 'newest');
  assert.deepEqual(state.resonances.map(item => item.qInstanceId), ['current-history']);
});

test('rapid background and foreground retire old work and leave a usable new scope', async t => {
  const h = await harness(t, 'screens/NexusScreen.js');
  const old = h.find('NexusPieceFeedSection').props.handlePressPieceResonance;
  const item = { q_instance_id: 'piece', owner: { user_id: 'C' }, viewer_state: { can_resonate: true } };
  await h.backgroundCycle();
  await act(async () => { await old(item); });
  assert.equal(h.mutations().length, 0);
  await act(async () => { await h.find('NexusPieceFeedSection').props.handlePressPieceResonance(item); });
  assert.equal(h.mutations().length, 1);
});

test('MainTabs never labels an obsolete feed prefetch as the new owner', async t => {
  const h = await harness(t, 'navigation/MainTabs.js', 'following', { holdRead: call => call.path === '/emotion-log/feed' });
  await h.fireTimers();
  const old = h.calls.findLast(call => call.path === '/emotion-log/feed' && call.resolve);
  assert.ok(old);
  await h.switchTo('B');
  await h.resolve(old, { items: [{ id: 'obsolete-A-feed', owner_name: 'obsolete-A-feed' }] });
  assert.ok(!JSON.stringify(h.events).includes('obsolete-A-feed'));
});

test('MainTabs ignores the old startup response after switching owners', async t => {
  const h = await harness(t, 'navigation/MainTabs.js', 'following', { holdRead: call => call.path === '/app/startup' });
  const old = h.calls.findLast(call => call.path === '/app/startup' && call.resolve);
  assert.ok(old);
  await h.switchTo('B');
  await h.resolve(old, { marker: 'obsolete-A-startup' });
  assert.ok(!JSON.stringify(h.events).includes('obsolete-A-startup'));
});

test('notice read is confirmed only by a same-owner receipt and a valid link still opens', async t => {
  const h = await harness(t, 'screens/NoticeHistoryScreen.js');
  h.control.failWrite = true;
  await act(async () => h.root.root.findByProps({ accessibilityLabel: 'お知らせ詳細を開く' }).props.onPress());
  await h.flush();
  assert.equal(h.find('List').props.data[0].is_read, false);
  h.control.failWrite = false;
  await act(async () => { await h.root.root.findByProps({ accessibilityLabel: 'リンクを開く' }).props.onPress(); });
  assert.equal(h.find('List').props.data[0].is_read, true);
  assert.deepEqual(h.routes, [['Account', {}]]);
  assert.ok(h.mutations().every(call => call.owner === 'A'));
});

test('Nexus automatic feed read stops on background and resumes only from a fresh foreground load', async t => {
  const h = await harness(t, 'screens/NexusScreen.js');
  h.control.holdRead = call => call.path === '/nexus/emotion-log';
  await act(async () => { h.find('NexusTabBar').props.setActiveTab('emotion_log'); await tick(); });
  const feed = h.calls.findLast(call => call.path === '/nexus/emotion-log');
  assert.ok(feed.resolve);
  const gate = h.holdAuth();
  await h.resolve(feed, { items: [{ id: 'feed', created_at: '2026-11-07T00:00:00Z', items: [{ type: '不安', strength: 'strong' }] }] });
  await h.background('background'); await h.releaseAuth(gate);
  assert.equal(h.mutations().length, 0);
  h.control.holdRead = null;
  await h.background('active'); await h.flush();
  const reads = h.mutations().filter(call => call.path === '/emotion-log/unread/read-feed');
  assert.equal(reads.length, 1); assert.equal(reads[0].owner, 'A');
  assert.deepEqual(JSON.parse(reads[0].options.body), { last_seen_created_at: '2026-11-07T00:00:00Z' });
});

test('same-owner MainTabs feed read retains its displayed timestamp', async t => {
  const h = await harness(t, 'navigation/MainTabs.js');
  await act(async () => { await h.find('PieceStackNavigator').props.onEmotionLogDisplayed('2026-11-07T00:00:00Z'); });
  const reads = h.mutations().filter(call => call.path === '/emotion-log/unread/read-feed');
  assert.equal(reads.length, 1); assert.equal(reads[0].owner, 'A');
  assert.deepEqual(JSON.parse(reads[0].options.body), { last_seen_created_at: '2026-11-07T00:00:00Z' });
});

const mapStatusPath = '/self-structure/latest/status';
const mapPush = (user = 'A', version = 'map-new') => ({ type: 'watashi_map_updated', user_id: user,
  version_key: version, report_id: 'synthetic-report', target: 'watashi_map' });

test('Free map completion shows the existing in-app banner without FCM and one version is not announced twice', async t => {
  const h = await harness(t, 'navigation/MainTabs.js', 'following', {
    mapStatus: { version_key: 'map-old', has_visible_content: true },
  });
  assert.equal(h.bannerCount(), 0, 'mounting an existing map is not a new completion');
  h.control.mapStatus = { version_key: 'map-new', has_visible_content: true };
  await h.pollMapStatus();
  assert.equal(h.bannerCount(), 1);
  assert.equal(h.bannerTimers(), 1);
  await h.push(mapPush());
  await h.pollMapStatus();
  assert.equal(h.bannerTimers(), 1, 'FCM and polling the same saved version share the notification');
  await h.fireTimers();
  assert.equal(h.bannerCount(), 0);
  await h.push(mapPush());
  assert.equal(h.bannerCount(), 0, 'a duplicate FCM delivery does not show the dismissed banner again');
});

test('a queued empty initial status is announced when the first visible map completes', async t => {
  const h = await harness(t, 'navigation/MainTabs.js', 'following', {
    mapStatus: { version_key: null, has_visible_content: false, refresh_status: 'queued' },
  });
  assert.equal(h.bannerCount(), 0);
  h.control.mapStatus = { version_key: 'map-new', has_visible_content: true, refresh_status: null };
  await h.pollMapStatus();
  assert.equal(h.bannerCount(), 1);
});

test('restoring source validity for the same saved map is not a new completion', async t => {
  const h = await harness(t, 'navigation/MainTabs.js', 'following', {
    mapStatus: { version_key: 'map-old', has_visible_content: true },
  });
  h.control.mapStatus = { version_key: null, has_visible_content: false, refresh_status: 'queued' };
  await h.pollMapStatus();
  h.control.mapStatus = { version_key: 'map-old', has_visible_content: true };
  await h.pollMapStatus();
  assert.equal(h.bannerTimers(), 0);
  assert.equal(h.bannerCount(), 0);
});

test('foreground completion FCM is only a hint and requires a matching visible current version', async t => {
  const h = await harness(t, 'navigation/MainTabs.js', 'following', {
    mapStatus: { version_key: 'map-old', has_visible_content: true },
  });
  await h.push(mapPush('A', 'obsolete-version'));
  assert.equal(h.bannerCount(), 0);
  h.control.mapStatus = { version_key: 'map-new', has_visible_content: false, refresh_status: 'running' };
  await h.push(mapPush());
  assert.equal(h.bannerCount(), 0, 'a notification cannot make a source-invalid map visible');
  h.control.mapStatus = { version_key: 'map-new', has_visible_content: true };
  await h.push(mapPush());
  assert.equal(h.bannerCount(), 1);
});

test('a matching foreground completion is shown before any successful status baseline and an older read cannot rewind it', async t => {
  const h = await harness(t, 'navigation/MainTabs.js', 'following', { holdRead: call => call.path === mapStatusPath });
  const first = h.calls.find(call => call.path === mapStatusPath && call.resolve);
  assert.ok(first);
  await h.push(mapPush());
  const current = h.calls.findLast(call => call.path === mapStatusPath && call.resolve);
  assert.notEqual(current, first);
  await h.resolve(current, { version_key: 'map-new', has_visible_content: true });
  assert.equal(h.bannerCount(), 1);
  await h.resolve(first, { version_key: 'map-old', has_visible_content: true });
  assert.equal(h.bannerTimers(), 1);
});

test('map FCM and a pending status response cannot cross account changes or the background boundary', async t => {
  const h = await harness(t, 'navigation/MainTabs.js', 'following', {
    mapStatus: { version_key: 'map-old', has_visible_content: true },
  });
  const before = h.calls.length;
  await h.push(mapPush('B'));
  assert.equal(h.calls.length, before, 'another owner FCM starts no status request');
  const retainedListener = [...h.pushListeners][0];
  h.control.holdRead = call => call.path === mapStatusPath;
  await h.push(mapPush());
  const old = h.calls.findLast(call => call.path === mapStatusPath && call.resolve);
  h.control.holdRead = null;
  await h.switchTo('B');
  await h.resolve(old, { version_key: 'map-new', has_visible_content: true });
  assert.equal(h.bannerCount(), 0);
  const afterSwitch = h.calls.length;
  await act(async () => { retainedListener({ data: mapPush() }); await tick(); });
  assert.equal(h.calls.length, afterSwitch, 'retained A listener is retired after owner change');
  await h.background('background');
  const beforeBackgroundPush = h.calls.length;
  await h.push(mapPush('B'));
  assert.equal(h.calls.length, beforeBackgroundPush);
  assert.equal(h.bannerCount(), 0);
});

test('a status response received in the background does not consume the foreground completion', async t => {
  const h = await harness(t, 'navigation/MainTabs.js', 'following', {
    mapStatus: { version_key: 'map-old', has_visible_content: true },
  });
  h.control.holdRead = call => call.path === mapStatusPath;
  await h.push(mapPush());
  const pending = h.calls.findLast(call => call.path === mapStatusPath && call.resolve);
  await h.background('background');
  await h.resolve(pending, { version_key: 'map-new', has_visible_content: true });
  assert.equal(h.bannerTimers(), 0);
  h.control.holdRead = null;
  h.control.mapStatus = { version_key: 'map-new', has_visible_content: true };
  await h.background('active');
  assert.equal(h.bannerCount(), 1, 'resuming still announces the current visible version');
});

function notificationNavigationHarness() {
  const routes = [], modules = new Map();
  let ready = false;
  const ref = { isReady: () => ready, getRootState: () => ({ routes: [{ name: 'Analysis' }, { name: 'Input' }, { name: 'Piece' }] }),
    navigate: (...args) => routes.push(args) };
  function load(relative) {
    if (modules.has(relative)) return modules.get(relative);
    const filename = path.join(ROOT, relative);
    const code = babel.transformSync(fs.readFileSync(filename, 'utf8'), { filename, babelrc: false, configFile: false,
      plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')] }).code;
    const module = { exports: {} };
    Function('require', 'module', 'exports', code)(name => {
      if (name === '@react-navigation/native') return { createNavigationContainerRef: () => ref };
      if (name.endsWith('legacyWireContracts')) return { ANALYSIS_WIRE: { routes: { reportType: 'analysis' } } };
      if (name.startsWith('.')) return load(path.relative(ROOT, path.resolve(path.dirname(filename), name)) + '.js');
      throw new Error('unexpected navigation dependency: ' + name);
    }, module, module.exports);
    modules.set(relative, module.exports); return module.exports;
  }
  return { routes, nav: load('navigation/navigationRef.js'), routing: load('navigation/notificationRouting.js'),
    ready: value => { ready = value; } };
}

test('cold map notification waits for the restored same owner and opens the current map viewer', () => {
  const h = notificationNavigationHarness();
  h.routing.requestOpenRouteFromNotification({ data: mapPush() });
  h.ready(true); h.nav.tryOpenRouteIfPending();
  assert.equal(h.routes.length, 0, 'navigation readiness is not authentication readiness');
  h.nav.setNotificationNavigationOwner('A', true);
  assert.equal(h.routes.length, 1);
  assert.equal(h.routes[0][0], 'Analysis');
  assert.equal(h.routes[0][1].screen, 'Analysis');
  assert.equal(h.routes[0][1].params.openSelfReportLatest, true);
  h.nav.tryOpenRouteIfPending(); assert.equal(h.routes.length, 1);
});

test('signed-out, switched-owner and superseded-generation pending map taps never open a later account', () => {
  for (const nextOwner of [null, 'B']) {
    const h = notificationNavigationHarness();
    h.routing.requestOpenRouteFromNotification({ data: mapPush() });
    h.nav.setNotificationNavigationOwner(nextOwner, true);
    h.ready(true); h.nav.setNotificationNavigationOwner('A', true);
    assert.equal(h.routes.length, 0);
  }
  const h = notificationNavigationHarness();
  h.nav.setNotificationNavigationOwner('A', true);
  h.routing.requestOpenRouteFromNotification({ data: mapPush() });
  h.nav.setNotificationNavigationOwner(null, false); // Root cleanup on logout, recovery or owner-generation change.
  h.routing.requestOpenRouteFromNotification({ data: mapPush() });
  h.ready(true); h.nav.setNotificationNavigationOwner('A', true);
  assert.equal(h.routes.length, 0);
});

test('warm map taps require their owner while existing question and report notification routes are unchanged', () => {
  const h = notificationNavigationHarness(); h.ready(true); h.nav.setNotificationNavigationOwner('B', true);
  h.routing.requestOpenRouteFromNotification({ data: mapPush() });
  assert.equal(h.routes.length, 0);
  h.routing.requestOpenRouteFromNotification({ data: mapPush('B') });
  assert.equal(h.routes.length, 1);
  h.nav.setNotificationNavigationOwner(null, true);
  h.routing.requestOpenRouteFromNotification({ data: { type: 'today_question' } });
  assert.equal(h.routes.at(-1)[0], 'Input');
  h.routing.requestOpenRouteFromNotification({ data: { type: 'report_distribution' } });
  assert.equal(h.routes.at(-1)[1].params.openDistributionHome, true);
});
