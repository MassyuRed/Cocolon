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
  const native = Object.fromEntries(['ActivityIndicator', 'KeyboardAvoidingView', 'Modal', 'Pressable', 'ScrollView', 'StatusBar',
    'Text', 'TextInput', 'TouchableOpacity', 'View', 'RefreshControl'].map(name => [name, name]));
  native.Keyboard = { addListener: () => ({ remove: noop }) };
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
  const navigationListeners = new Map();
  const navigation = { navigate: (...args) => routes.push(args), goBack: noop, isFocused: () => true,
    ...options.noticeNavigation,
    addListener(name, listener) {
      if (!navigationListeners.has(name)) navigationListeners.set(name, new Set());
      navigationListeners.get(name).add(listener);
      return () => navigationListeners.get(name).delete(listener);
    } };
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
    const sharingPath = new URL(url).pathname;
    if (sharingPath === '/follow/followers/content-visibility') return { items: control.followerSettings || [] };
    if (options.method === 'PATCH' && sharingPath.endsWith('/content-visibility')) {
      const id = decodeURIComponent(sharingPath.split('/').at(-2));
      const target = control.followerSettings.find(row => row.follower_user_id === id);
      Object.assign(target, JSON.parse(options.body));
      return target;
    }
    if (options.method !== 'GET') return control.writeResponse?.(sharingPath, options)
      ?? { unread_count: 0, resonated: true, resonances: 1 };
    const p = new URL(url).pathname;
    if (p === '/deep-insight') return control.deepInsightState;
    if (p.startsWith('/deep-insight/questions/')) return control.notifiedQuestion;
    if (p === '/self-structure/latest/status') return control.mapStatus || { version_key: null, has_visible_content: false };
    if (p === '/nexus/pieces') return { items: control.pieceFeedItems || [] };
    if (p === '/piece/resonances/pieces') return { items: control.resonanceHistoryItems || [] };
    if (p.startsWith('/nexus/pieces/')) return control.legacyPieceDetail || {};
    if (p === '/notices/history') return control.noticesHistory?.(new URL(url)) ?? { items: [notice], unread_count: 1 };
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
    return packet(defaultBody(url, options), options.method === 'GET' ? !control.failRead?.(call) : !control.failWrite);
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
      if (name === 'react-native-safe-area-context') return { SafeAreaProvider: 'SafeAreaProvider', SafeAreaView: 'SafeAreaView', useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) };
      if (name === '@react-native-async-storage/async-storage') return { getItem: async () => null };
      if (name === '@react-native-firebase/messaging') return Object.assign(
        () => ({
          onMessage: listener => {
            pushListeners.add(listener); return () => pushListeners.delete(listener);
          },
          hasPermission: () => control.pushPermission?.() ?? Promise.resolve(1),
        }),
        { AuthorizationStatus: { AUTHORIZED: 1, PROVISIONAL: 2 } },
      );
      if (name === '@react-navigation/native') return {
        StackActions: { popToTop: noop }, useNavigation: () => navigation, useIsFocused: () => true,
        useFocusEffect: effect => React.useEffect(() => {
          let cleanup = effect();
          const unFocus = navigation.addListener('focus', () => { cleanup?.(); cleanup = effect(); });
          const unBlur = navigation.addListener('blur', () => { cleanup?.(); cleanup = undefined; });
          return () => { cleanup?.(); unFocus(); unBlur(); };
        }, [effect]),
      };
      if (name === '@react-navigation/bottom-tabs') return { createBottomTabNavigator: () => ({
        Navigator: props => React.createElement('Navigator', props, props.children),
        Screen: props => typeof props.children === 'function' ? props.children({ navigation }) : null,
      }), BottomTabBar: 'BottomTabBar' };
      const target = name.startsWith('.') ? path.relative(ROOT, path.resolve(path.dirname(filename), name)) + '.js' : name;
      if (target === 'AuthContext.js') return { useAuth: () => ({ user: session()?.user, session: session(), initializing: false,
        recoveryMode: false, authOwnerGeneration: control.generation }) };
      if (target === 'UnreadContext.js') return { useUnread: () => unread };
      if (target === 'SubscriptionContext.js') return { useSubscription: () => ({ isPaid: false, loading: false,
        tier: control.tier ?? 'free', subscriptionBootstrapLoaded: true, subscriptionBootstrapLoading: false }) };
      if (target === 'TutorialContext.js') return { useTutorial: () => ({ isTutorialMode: false, tutorialStep: 0, tutorialPieces,
        tutorialFlagsLoaded: true, tutorialCompleted: true, ensureTutorialPiecesSeed: noop, setTutorialStep: noop }) };
      if (target === 'AppRuntimeContext.js') return { useAppRuntime: () => ({
        isFeatureEnabled: name => name === 'follower_sharing_enabled' && !!control.followerSharingEnabled,
      }) };
      if (target === 'tutorial/tutorialScenarioData.js') return { TUTORIAL_TOTAL_STEPS: 16, TUTORIAL_PIECES: [] };
      if (target === 'theme/ThemeContext.js') return { useTheme: () => ({ colors: options.colors ?? {}, themeName: options.themeName ?? 'light' }) };
      if (target === 'lib/supabase.js') return { supabase: { auth } };
      if (target === 'lib/user.js') return { getCurrentUserId: async () => control.owner };
      if (target === 'lib/monitoring.js') return { captureApiError: noop };
      if (target === 'navigation/navigationRef.js') return {
        navigationRef: { isReady: () => false },
        buildAnalysisRootNavigationParams: value => value,
        requestOpenRoute: value => routes.push(value),
      };
      if (target === 'screens/AnalysisMenuCommon.js') return { AnalysisSubHeader: 'Header' };
      if (target === 'components/GlobalFrameLayout.js') return { __esModule: true, FRAME_BORDER_WIDTH: 0,
        default: props => React.createElement('GlobalFrameLayout', props, props.headerBottomSlot, props.children) };
      if (target === 'lib/noticeActionRuntime.js') return { getNoticeButtonActions: () => [{ label: 'リンクを開く' }],
        openNoticeAction: async (_action, { openInternalRoute }) => openInternalRoute(control.noticeActionRoute || 'Account') };
      if (target === 'components/TutorialOverlay.js') return { __esModule: true, default: 'TutorialOverlay',
        syncTutorialSpotlightTarget: async () => null, waitForTutorialFrames: async () => {} };
      if (target === 'components/UnreadBadge.js') return { __esModule: true, default: 'UnreadBadge', BottomTabUnreadBadge: 'UnreadBadge', ScreenUnreadBadge: 'UnreadBadge' };
      if (control.realFeedCards && ['screens/nexus/NexusPieceFeedSection.js', 'screens/nexus/NexusPieceCard.js'].includes(target)) return load(target);
      if (target.startsWith('components/') || target.startsWith('runtime/') || /navigation\/.*StackNavigator\.js$/.test(target) ||
          /screens\/nexus\/Nexus/.test(target)) return { __esModule: true, default: path.basename(target, '.js'), BottomTabUnreadBadge: 'UnreadBadge' };
      if (name.startsWith('.')) return load(target);
      return require(name);
    };
    Function('require', 'module', 'exports', 'fetch', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'console', compiled.get(relative))(
      requireLocal, module, module.exports, fetch, timer, clear, timer, clear, { warn: noop });
    modules.set(relative, module.exports); return module.exports;
  }
  const { default: Screen, DeepInsightReturnCacheContext } = load(file);
  let root;
  let routeKey = 0;
  const element = () => {
    const screen = React.createElement(Screen, { key: routeKey, navigation,
      route: { params: { initialTab, ...control.screenParams } }, ...options.screenProps });
    return DeepInsightReturnCacheContext && control.returnCache
      ? React.createElement(DeepInsightReturnCacheContext.Provider, { value: control.returnCache }, screen) : screen;
  };
  await act(async () => { root = Renderer.create(element(), { createNodeMock: options.createNodeMock }); await tick(); });
  t.after(async () => { await act(async () => root.unmount()); });
  const h = { control, calls, events, alerts, routes, root,
    find: type => root.root.findByType(type),
    async flush() { await act(async () => { await tick(); }); },
    async reopen() { routeKey += 1; await act(async () => { root.update(element()); await tick(); }); },
    async update() { await act(async () => { root.update(element()); await tick(); }); },
    async changeRecords(owner) { await act(async () => {
      load('lib/emotionRecordChanges.js').notifyEmotionRecordsChanged(owner); await tick();
    }); },
    async navigationEvent(name) { await act(async () => {
      for (const listener of [...(navigationListeners.get(name) || [])]) listener();
      await tick();
    }); },
    async updateParams(params) { control.screenParams = params; await act(async () => { root.update(element()); await tick(); }); },
    async publishFollowChange(change) { await act(async () => {
      load('screens/account/followChanges.js').publishFollowChange(change);
      await tick();
    }); },
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

test('own follower menu shows independent saved defaults and changes only the selected permission', async t => {
  const defaults = follower_user_id => ({ follower_user_id, can_view_pieces: true, can_receive_emotion_notifications: true });
  const h = await harness(t, 'screens/FollowListScreen.js', 'followers', {
    followerSharingEnabled: true, followerSettings: [defaults('C'), { ...defaults('D'), can_view_pieces: false }],
  });
  const press = async name => {
    const control = h.root.root.findAllByType('TouchableOpacity').find(node => node.props.accessibilityLabel === name);
    assert.ok(control, name);
    await act(async () => { control.props.onPress(); await tick(); });
  };
  const switches = () => h.root.root.findAllByType('CocolonSwitch');
  await press('C-nameへの公開範囲を設定');
  assert.deepEqual(switches().map(node => [node.props.accessibilityLabel, node.props.value]), [['ピース投稿', true], ['感情通知', true]]);
  await act(async () => { switches()[0].props.onValueChange(false); await tick(); });
  const writes = h.mutations();
  assert.equal(writes.length, 1);
  assert.equal(writes[0].path, '/follow/followers/C/content-visibility');
  assert.deepEqual(JSON.parse(writes[0].options.body), { can_view_pieces: false });
  assert.deepEqual(switches().map(node => node.props.value), [false, true]);

  const close = h.root.root.findAllByType('CocolonButton').find(node => node.props.title === '閉じる');
  await act(async () => { close.props.onPress(); await tick(); });
  await press('D-nameへの公開範囲を設定');
  assert.deepEqual(switches().map(node => node.props.value), [false, true]);
  await act(async () => { switches()[1].props.onValueChange(false); await tick(); });
  assert.deepEqual(JSON.parse(h.mutations()[1].options.body), { can_receive_emotion_notifications: false });
});

test('follower permission reads cannot reopen an obsolete owner menu', async t => {
  const h = await harness(t, 'screens/FollowListScreen.js', 'followers', {
    followerSharingEnabled: true, holdRead: call => call.path === '/follow/followers/content-visibility',
  });
  const open = h.root.root.findAllByType('TouchableOpacity').find(node => node.props.accessibilityLabel === 'C-nameへの公開範囲を設定');
  await act(async () => { open.props.onPress(); await tick(); });
  const old = h.calls.find(call => call.path === '/follow/followers/content-visibility');
  assert.ok(old);
  await h.switchTo('B');
  await h.resolve(old, { items: [{ follower_user_id: 'C', can_view_pieces: true, can_receive_emotion_notifications: true }] });
  assert.equal(h.root.root.findAllByType('CocolonSwitch').length, 0);
  assert.equal(h.mutations().length, 0);
});

test('FollowList centers its themed title and reuses the visible list on focus', async t => {
  const titleColor = '#8A6D1D';
  const h = await harness(t, 'screens/FollowListScreen.js', 'following', { colors: { TITLE_GOLD: titleColor } });
  const title = h.root.root.findAllByType('Text').find(node => node.props.children === 'フォローリスト');
  assert.ok(title);
  const [backButton, titleNode, spacer] = title.parent.children;
  assert.equal(backButton.type, 'CocolonBackButton');
  assert.equal(backButton.props.accessibilityLabel, '前の画面に戻る');
  assert.equal(titleNode, title);
  assert.equal(title.parent.props.style.flexDirection, 'row');
  assert.equal(title.props.style.textAlign, 'center');
  assert.equal(title.props.style.color, titleColor);
  assert.equal(backButton.props.style.width, spacer.props.style.width);
  assert.equal(h.root.root.findAllByProps({ accessibilityLabel: 'フォローリストを更新する' }).length, 0);

  const count = path => h.calls.filter(call => call.path === path).length;
  const initialReads = ['/follow/list', '/follow/stats'].map(count);
  const initialRows = h.find('List').props.data;
  await h.navigationEvent('blur');
  await h.navigationEvent('focus');
  assert.deepEqual(['/follow/list', '/follow/stats'].map(count), initialReads);
  assert.equal(h.find('List').props.data, initialRows);
});

test('a confirmed same-session follow change refreshes the affected list without blanking it', async t => {
  const h = await harness(t, 'screens/FollowListScreen.js', 'following');
  const initialRows = h.find('List').props.data;
  const count = () => h.calls.filter(call => call.path === '/follow/list').length;
  const initialReads = count();
  h.control.holdRead = call => call.path === '/follow/list';
  await h.publishFollowChange({ owner: 'A', generation: -1, target: 'C' });
  await h.publishFollowChange({ owner: 'B', generation: 0, target: 'C' });
  assert.equal(count(), initialReads);
  await h.publishFollowChange({ owner: 'A', generation: 0, target: 'C' });
  assert.equal(count(), initialReads + 1);
  assert.equal(h.find('List').props.data, initialRows);
  await h.resolve(h.calls.findLast(call => call.path === '/follow/list'), { rows: [initialRows[1]] });
  assert.deepEqual(h.find('List').props.data.map(row => row.id), ['D']);
});

for (const [tab, label] of [['following', 'フォロー中'], ['followers', 'フォロワー']]) {
  test(`opening the account's ${tab} list renders the selected tab with valid native text`, async t => {
    const h = await harness(t, 'screens/FollowListScreen.js', tab);
    const list = h.find('List');
    const selected = list.findAllByProps({ accessibilityRole: 'tab' })
      .filter(node => node.props.accessibilityState.selected);
    assert.equal(selected.length, 1);
    assert.ok(selected[0].props.accessibilityLabel.startsWith(label + ' '));
    const request = h.calls.find(call => call.path === '/follow/list');
    assert.equal(new URL(request.url).searchParams.get('tab'), tab);
    assert.deepEqual(list.props.data.map(item => item.id), ['C', 'D']);

    // React Native rejects raw text nodes, including whitespace, inside a View.
    const rawText = list.findAllByType('View').flatMap(view =>
      view.children.filter(child => typeof child === 'string'));
    assert.deepEqual(rawText, []);
  });
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

test('the dedicated emotion log clears prior rows on foreground and ignores an older refresh', async t => {
  const path = '/emotion-log/feed';
  const row = { id: 'before-restriction', owner_name: '前回だけの相手', items: [{ type: '不安' }] };
  const h = await harness(t, 'screens/EmotionLogScreen.js', undefined, { holdRead: call => call.path === path });
  const textVisible = () => h.root.root.findAllByType('Text').some(node => node.props.children === row.owner_name);
  await h.resolve(h.calls.find(call => call.path === path), { items: [row] });
  assert.equal(textVisible(), true);
  await h.backgroundCycle();
  const obsolete = h.calls.findLast(call => call.path === path);
  assert.equal(textVisible(), false);
  await h.backgroundCycle();
  await h.resolve(obsolete, { items: [row] });
  assert.equal(textVisible(), false);
  const latest = h.calls.findLast(call => call.path === path);
  assert.notEqual(latest, obsolete);
  await h.resolve(latest, { items: [] });
  assert.equal(textVisible(), false);
});

test('MainTabs refreshes the unread badge without prefetching protected emotion feed rows', async t => {
  const h = await harness(t, 'navigation/MainTabs.js');
  await h.fireTimers();
  await h.flush();
  assert.ok(h.calls.some(call => call.path === '/emotion-log/unread-status'));
  assert.ok(!h.calls.some(call => call.path === '/emotion-log/feed'));
  assert.ok(!h.events.some(([kind, scope, key]) => kind === 'prefetch' && scope === 'EmotionLog' && key === 'feed'));
});

test('the opt-in post feed renders new Piece text, preserves old Q&A, and refreshes after withdrawal', async t => {
  const nativePiece = { source_type: 'piece_v2', q_instance_id: 'piece:posted', owner: { user_id: 'A', display_name: '自分' },
    body: '保存した同じピースの本文', created_at: '2026-11-21T00:00:00Z' };
  const legacyPiece = { source_type: 'emotion_generated', q_instance_id: 'legacy', owner: { user_id: 'C', display_name: 'C-name' },
    question: { title: '既存投稿の問い' }, body: '既存投稿の答え', created_at: '2026-11-20T00:00:00Z' };
  const h = await harness(t, 'screens/NexusScreen.js', undefined, { realFeedCards: true, pieceFeedItems: [nativePiece, legacyPiece] });
  const text = () => h.root.root.findAllByType('Text').map(node => node.props.children);
  assert.equal(new URL(h.calls.find(call => call.path === '/nexus/pieces').url).searchParams.get('include_piece_v2'), 'true');
  assert.ok(text().includes(nativePiece.body));
  assert.ok(text().includes('既存投稿の問い'));
  assert.equal(text().filter(label => label === '問い').length, 1);
  assert.equal(text().filter(label => label === '答え').length, 1);

  await h.navigationEvent('blur');
  assert.ok(!text().includes(nativePiece.body));
  h.control.pieceFeedItems = [legacyPiece];
  await h.navigationEvent('focus');
  assert.ok(!text().includes(nativePiece.body));
  assert.ok(text().includes(legacyPiece.body));
});

test('Nexus no longer loads the public emotion aggregate and still rechecks shared posts on return', async t => {
  const h = await harness(t, 'screens/NexusScreen.js');
  const countPosts = () => h.calls.filter(call => call.path === '/nexus/pieces').length;
  const posts = countPosts();
  assert.ok(posts > 0);
  assert.equal(h.root.root.findAllByType('NexusTodayEmotionSummary').length, 0);

  await h.navigationEvent('blur');
  await h.navigationEvent('focus');
  assert.equal(countPosts(), posts + 1);
  assert.ok(!h.calls.some(call => call.path === '/nexus/emotion-ranking'));
});

test('Nexus tab group uses a full frame in each theme', async t => {
  for (const [themeName, sectionBorder] of [
    ['default', '#D7D2C9'], ['light', '#927C4D'], ['dark', '#7084AE'],
  ]) {
    const h = await harness(t, 'screens/NexusScreen.js', undefined, {
      themeName, colors: { SECTION_BORDER: sectionBorder },
    });
    const { tabBar, emotionLogCard, simpleCard } = h.find('NexusTabBar').props.styles;
    for (const edge of ['Top', 'Right', 'Bottom', 'Left']) {
      assert.equal(tabBar[`border${edge}Width`] ?? tabBar.borderWidth, 1, `${themeName} ${edge}`);
      assert.equal(tabBar[`border${edge}Color`] ?? tabBar.borderColor, sectionBorder, `${themeName} ${edge}`);
    }
    assert.equal(emotionLogCard.borderColor, sectionBorder);
    assert.equal(simpleCard.borderColor, sectionBorder);
  }
});

test('Nexus shares only outstanding unread requests within the current owner scope', async t => {
  const endpoints = ['/nexus/pieces/unread-status', '/emotion-log/unread-status'];
  const h = await harness(t, 'screens/NexusScreen.js', undefined, {
    holdRead: call => endpoints.includes(call.path),
  });
  const pending = h.calls.filter(call => endpoints.includes(call.path));
  await h.navigationEvent('focus');
  assert.equal(h.calls.filter(call => endpoints.includes(call.path)).length, 2);
  await h.switchTo('B');
  const next = h.calls.filter(call => endpoints.includes(call.path) && call.owner === 'B');
  assert.equal(next.length, 2);
  const previousEffects = h.events.filter(event => event[0] === 'unread').length;
  for (const old of pending) await h.resolve(old, { feed_unread: true, has_unread: true });
  assert.equal(h.events.filter(event => event[0] === 'unread').length, previousEffects);
  for (const current of next) await h.resolve(current, { feed_unread: false, has_unread: false });
  h.control.holdRead = null;
  await h.navigationEvent('focus');
  assert.equal(h.calls.filter(call => endpoints.includes(call.path) && call.owner === 'B').length, 4);
});

test('MainTabs prefetches existing Piece data without requesting recommended users', async t => {
  const h = await harness(t, 'navigation/MainTabs.js');
  await h.fireTimers();
  await h.flush();
  assert.ok(h.events.some(([kind, scope, key]) => kind === 'prefetch' && scope === 'Piece' && key.startsWith('qnaList:')));
  assert.ok(!h.calls.some(call => call.path === '/nexus/recommend/users'));
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

test('notice history keeps added pages on return and loads a new Home notice only when it is missing', async t => {
  const notice = id => ({ notice_id: id, title: id, body: '確認本文', is_read: true });
  const h = await harness(t, 'screens/NoticeHistoryScreen.js', undefined, {
    noticesHistory: url => url.searchParams.get('offset') === '1'
      ? { items: [notice('older')], has_more: false }
      : { items: [notice('latest')], has_more: true, next_offset: 1 },
  });
  const readCount = () => h.calls.filter(call => call.path === '/notices/history').length;
  await act(async () => { await h.root.root.findByProps({ accessibilityLabel: 'さらにお知らせを読み込む' }).props.onPress(); });
  assert.equal(readCount(), 2);
  const pages = h.find('List').props.data;
  assert.deepEqual(pages.map(row => row.notice_id), ['latest', 'older']);
  await h.navigationEvent('blur');
  await h.navigationEvent('focus');
  await h.updateParams({ open_notice_id: 'older', open_notice_at: '1' });
  assert.equal(readCount(), 2);
  assert.equal(h.find('List').props.data, pages);
  assert.equal(h.root.root.findByProps({ accessibilityLabel: 'お知らせ詳細を閉じる' }).props.accessibilityState.expanded, true);
  h.control.noticesHistory = () => ({ items: [notice('new')] });
  await h.updateParams({ open_notice_id: 'new', open_notice_at: '2' });
  assert.equal(readCount(), 3);
  assert.deepEqual(h.find('List').props.data.map(row => row.notice_id), ['new']);
  assert.equal(h.root.root.findByProps({ accessibilityLabel: 'お知らせ詳細を閉じる' }).props.accessibilityState.expanded, true);
});

test('notices reached from Settings return there and can still link into the Home stack', async t => {
  const parentRoutes = [];
  let wentBack = false;
  const h = await harness(t, 'screens/NoticeHistoryScreen.js', undefined, {
    screenProps: { fromSettings: true },
    noticeActionRoute: 'InputHistory',
    noticeNavigation: {
      goBack: () => { wentBack = true; },
      getParent: () => ({ navigate: (...args) => parentRoutes.push(args) }),
    },
  });
  h.root.root.findByProps({ accessibilityLabel: '設定に戻る' }).props.onPress();
  assert.equal(wentBack, true);
  await act(async () => h.root.root.findByProps({ accessibilityLabel: 'お知らせ詳細を開く' }).props.onPress());
  await act(async () => h.root.root.findByProps({ accessibilityLabel: 'リンクを開く' }).props.onPress());
  assert.deepEqual(parentRoutes, [['Input', { screen: 'InputHistory', params: {}, initial: false }]]);
  assert.deepEqual(h.routes, []);
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

for (const { tab, endpoint, section, stateProp, itemsProp, itemId } of [
  { tab: 'emotion_log', endpoint: '/nexus/emotion-log', section: 'NexusEmotionLogSection',
    stateProp: 'emotionLogState', itemsProp: 'items', itemId: 'id' },
  { tab: 'history', endpoint: '/nexus/history/resonances', section: 'NexusHistorySection',
    stateProp: 'historyState', itemsProp: 'resonances', itemId: 'qInstanceId' },
]) test(`Nexus ${tab} clears previously shared rows before rechecking access`, async t => {
  const h = await harness(t, 'screens/NexusScreen.js', undefined, { holdRead: call => call.path === endpoint });
  const select = async key => act(async () => { h.find('NexusTabBar').props.setActiveTab(key); await tick(); });
  const request = () => h.calls.findLast(call => call.path === endpoint);
  const rows = () => h.find(section).props[stateProp][itemsProp].map(row => row[itemId]);
  const payload = { items: [{ id: 'previously-shared', q_instance_id: 'previously-shared' }] };

  await select(tab);
  await h.resolve(request(), payload);
  assert.deepEqual(rows(), ['previously-shared']);

  await h.navigationEvent('blur');
  assert.deepEqual(rows(), []);
  await h.navigationEvent('focus');
  const staleRequest = request();
  assert.deepEqual(rows(), []);

  await select('piece');
  await select(tab);
  const currentRequest = request();
  assert.notEqual(currentRequest, staleRequest);
  assert.deepEqual(rows(), []);
  await h.resolve(currentRequest, { items: [] });
  await h.resolve(staleRequest, payload);
  assert.deepEqual(rows(), []);
});

test('same-owner MainTabs feed read retains its displayed timestamp', async t => {
  const h = await harness(t, 'navigation/MainTabs.js');
  await act(async () => { await h.find('PieceStackNavigator').props.onEmotionLogDisplayed('2026-11-07T00:00:00Z'); });
  const reads = h.mutations().filter(call => call.path === '/emotion-log/unread/read-feed');
  assert.equal(reads.length, 1); assert.equal(reads[0].owner, 'A');
  assert.deepEqual(JSON.parse(reads[0].options.body), { last_seen_created_at: '2026-11-07T00:00:00Z' });
});

test('legacy resonance history clears previous results before a failed recheck on focus', async t => {
  const endpoint = '/piece/resonances/pieces';
  const h = await harness(t, 'screens/ResonanceHistoryListScreen.js', undefined, {
    resonanceHistoryItems: [{ q_instance_id: 'previously-shared', title: '以前の共鳴' }],
  });
  const ids = () => h.find('List').props.data.map(row => row.q_instance_id);
  assert.deepEqual(ids(), ['previously-shared']);
  await h.navigationEvent('blur');
  assert.deepEqual(ids(), []);
  h.control.failRead = call => call.path === endpoint;
  await h.navigationEvent('focus');
  assert.deepEqual(ids(), []);
});

test('legacy Piece Library clears a shared detail on blur and never caches a followed user list', async t => {
  const h = await harness(t, 'screens/PieceLibraryScreen.js', undefined, {
    screenParams: { viewedUserId: 'C', openQInstanceId: 'shared-detail' },
    legacyPieceDetail: { title: '以前共有されたピース', q_instance_id: 'shared-detail' },
  });
  const contains = value => h.root.root.findAllByType('Text').some(node => node.props.children === value);
  assert.equal(contains('以前共有されたピース'), true);
  const picker = h.root.root.findAllByType('CocolonButton').find(node =>
    node.findAllByType('Text').some(label => label.props.children === 'ピースを表示'));
  assert.ok(picker);
  await act(async () => { await picker.props.onPress(); await tick(); });
  assert.ok(h.calls.some(call => call.path === '/nexus/pieces' && new URL(call.url).searchParams.get('user_id') === 'C'));
  assert.ok(!h.events.some(([kind, scope, key]) => kind === 'prefetch' && scope === 'Piece' && key.includes(':C:')));
  await h.navigationEvent('blur');
  assert.equal(contains('以前共有されたピース'), false);
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

test('warm map taps require their owner while generic Home and report notification routes are unchanged', () => {
  const h = notificationNavigationHarness(); h.ready(true); h.nav.setNotificationNavigationOwner('B', true);
  h.routing.requestOpenRouteFromNotification({ data: mapPush() });
  assert.equal(h.routes.length, 0);
  h.routing.requestOpenRouteFromNotification({ data: mapPush('B') });
  assert.equal(h.routes.length, 1);
  h.nav.setNotificationNavigationOwner(null, true);
  h.routing.requestOpenRouteFromNotification({ data: { screen: 'Input' } });
  assert.equal(h.routes.at(-1)[0], 'Input');
  h.routing.requestOpenRouteFromNotification({ data: { type: 'report_distribution' } });
  assert.equal(h.routes.at(-1)[1].params.openDistributionHome, true);
});

test('DeepInsight notifications open the right entry only for the intended owner', () => {
  const h = notificationNavigationHarness();
  const data = { type: 'deep_insight_record_ready', target: 'deep_insight', user_id: 'A', question_id: 'record-4' };
  h.routing.requestOpenRouteFromNotification({ data });
  h.ready(true); h.nav.setNotificationNavigationOwner('B', true);
  assert.deepEqual(h.routes, []);
  h.nav.setNotificationNavigationOwner('A', true);
  h.routing.requestOpenRouteFromNotification({ data: { ...data, question_id: '' } });
  assert.deepEqual(h.routes, []);
  h.routing.requestOpenRouteFromNotification({ data });
  h.routing.requestOpenRouteFromNotification({ data: { ...data, type: 'deep_insight_theme_ready' } });
  assert.deepEqual(h.routes, [
    ['Input', { screen: 'DeepInsight', initial: false, params: { notification: { lane: 'records', questionId: 'record-4' } } }],
    ['Input', { screen: 'DeepInsight', initial: false, params: { notification: { lane: 'theme' } } }],
  ]);
});

test('foreground DeepInsight notifications display once and open the selected private route', async t => {
  const h = await harness(t, 'navigation/MainTabs.js');
  const record = { type: 'deep_insight_record_ready', target: 'deep_insight', user_id: 'A', question_id: 'record-4' };
  const theme = { ...record, type: 'deep_insight_theme_ready', question_id: 'theme-5' };
  const recordLabel = 'わたしを知る問いに新しいふりかえりの問いが届きました';
  const themeLabel = 'わたしを知る問いで新しいテーマの問いを受け取れます';
  const banners = () => h.root.root.findAllByType('TouchableOpacity')
    .filter(node => node.findAllByType('Text').some(text => [recordLabel, themeLabel].includes(text.props.children)));
  await h.push({ ...record, user_id: 'B' });
  await h.push({ ...record, target: 'other' });
  assert.equal(banners().length, 0);

  h.control.pushPermission = async () => 0;
  await h.push(record);
  assert.equal(banners().length, 0);
  h.control.pushPermission = async () => 1;
  await h.push(record);
  await h.push(theme);
  assert.equal(banners().length, 2);

  const pressOldTheme = banners()[1].props.onPress;
  await act(async () => banners()[0].props.onPress());
  assert.deepEqual(h.routes, [{
    name: 'Input',
    expectedUserId: 'A',
    params: { screen: 'DeepInsight', initial: false, params: { notification: { lane: 'records', questionId: 'record-4' } } },
  }]);
  await h.push(record);
  assert.equal(banners().length, 1, 'a duplicate must remain suppressed after a tap');
  await h.switchTo('B');
  await act(async () => pressOldTheme());
  assert.equal(banners().length, 0);
  assert.equal(h.routes.length, 1);
});

test('pending foreground notification permission cannot cross an account switch', async t => {
  const permission = deferred();
  const h = await harness(t, 'navigation/MainTabs.js', 'following', { pushPermission: () => permission.promise });
  await h.push({ type: 'deep_insight_record_ready', target: 'deep_insight', user_id: 'A', question_id: 'record-4' });
  await h.switchTo('B');
  await act(async () => permission.resolve(1));
  assert.doesNotMatch(JSON.stringify(h.root.toJSON()), /新しいふりかえりの問い/);
});

test('theme cooldown read recovers after failure without creating a question', async t => {
  const base = { can_use_theme: true, can_use_records: false, record_available_today: false,
    theme_available_today: false, theme_next_available_at: new Date(Date.now() - 1000).toISOString(),
    records: null, theme: null, history: [] };
  const h = await harness(t, 'screens/DeepInsightScreen.js', 'following', { deepInsightState: base });
  const text = () => JSON.stringify(h.root.toJSON());
  assert.match(text(), /次の問いは.*日本時間/);
  h.control.failRead = call => call.path === '/deep-insight';
  await h.fireTimers();
  assert.match(text(), /新しい問いを受け取れるか確認できませんでした/);
  h.control.failRead = null;
  h.control.deepInsightState = { ...base, theme_available_today: true };
  const retry = h.root.root.findAllByType('CocolonButton').find(node => node.props.children === 'もう一度確認する');
  await act(async () => { await retry.props.onPress(); });
  assert.match(text(), /考えたいテーマを選んでください/);
  assert.doesNotMatch(text(), /確認できませんでした/);
  assert.equal(h.calls.filter(call => call.path === '/deep-insight').length, 3);
  assert.deepEqual(h.mutations(), []);
});

test('returning to an open DeepInsight screen checks a cooldown that elapsed in the background', async t => {
  const base = { can_use_theme: true, can_use_records: false, record_available_today: false,
    theme_available_today: false, theme_next_available_at: new Date(Date.now() - 1000).toISOString(),
    records: null, theme: null, history: [] };
  const h = await harness(t, 'screens/DeepInsightScreen.js', 'following', { deepInsightState: base });
  await h.background('background');
  h.control.deepInsightState = { ...base, theme_available_today: true };
  await h.background('active');
  assert.match(JSON.stringify(h.root.toJSON()), /考えたいテーマを選んでください/);
  assert.equal(h.calls.filter(call => call.path === '/deep-insight').length, 2);
  assert.deepEqual(h.mutations(), []);
});

test('DeepInsight keeps themes first and scrolls to a current reflection when a notification opens it', async t => {
  const current = { id: 'current-record', lane: 'records', question_text: '本日のふりかえり',
    issued_on: '2026-11-22', answered_at: null };
  const scrolls = [];
  const h = await harness(t, 'screens/DeepInsightScreen.js', 'following', {
    deepInsightState: { can_use_theme: true, can_use_records: true, record_available_today: false,
      theme_available_today: true, records: current, theme: null, history: [] },
    screenParams: { notification: { lane: 'records', questionId: current.id } },
    createNodeMock: element => element.type === 'ScrollView' ? { scrollTo: value => scrolls.push(value) } : null,
  });
  assert.deepEqual(h.root.root.findByType('SafeAreaView').props.edges, ['left', 'right']);
  const headers = h.root.root.findAllByType('Text').filter(node => node.props.accessibilityRole === 'header');
  assert.deepEqual(headers.map(node => node.props.children), ['テーマから考える', '記録をふりかえる', '回答の履歴']);
  assert.equal(headers[0].parent.props.onLayout, undefined);
  await act(async () => {
    headers[1].parent.props.onLayout({ nativeEvent: { layout: { y: 310 } } });
    headers[1].parent.props.onLayout({ nativeEvent: { layout: { y: 355 } } });
  });
  assert.deepEqual(scrolls, [{ y: 310, animated: false }]);
  assert.deepEqual(h.mutations(), []);
});

test('an old reflection notification opens its own question and answer outside recent history', async t => {
  const deepInsightState = { can_use_theme: true, can_use_records: true, record_available_today: true,
    theme_available_today: true, records: null, theme: null, history: [] };
  const notifiedQuestion = { id: 'older-record', lane: 'records', question_text: '前の通知の問い',
    answer_text: 'その問いに保存した回答', issued_on: '2026-09-10', answered_at: '2026-09-11T00:00:00Z' };
  const questionPath = '/deep-insight/questions/older-record';
  const scrolls = [];
  const h = await harness(t, 'screens/DeepInsightScreen.js', 'following', {
    deepInsightState, notifiedQuestion,
    screenParams: { notification: { lane: 'records', questionId: notifiedQuestion.id } },
    failRead: (call) => call.path === questionPath,
    createNodeMock: element => element.type === 'ScrollView' ? { scrollTo: value => scrolls.push(value) } : null,
  });
  const text = () => JSON.stringify(h.root.toJSON());
  const card = heading => h.root.root.findAllByType('Text').find(node => node.props.children === heading).parent;
  assert.match(text(), /通知に対応する問いを読み込めませんでした/);
  act(() => card('記録をふりかえる').props.onLayout({ nativeEvent: { layout: { y: 310 } } }));
  h.control.failRead = null;
  const retry = h.root.root.findAllByType('CocolonButton').find(node => node.props.children === 'もう一度確認する');
  await act(async () => { await retry.props.onPress(); });
  assert.match(text(), /前の通知の問い/);
  assert.match(text(), /その問いに保存した回答/);
  assert.doesNotMatch(text(), /通知に対応する問いを読み込めませんでした/);
  act(() => card('回答の履歴').props.onLayout({ nativeEvent: { layout: { y: 540 } } }));
  assert.deepEqual(scrolls, [{ y: 310, animated: false }, { y: 540, animated: false }]);
  assert.deepEqual(h.calls.filter(call => call.path === questionPath).map(call => call.owner), ['A', 'A']);
  assert.deepEqual(h.mutations(), []);
});

const deepInsightReturnData = (answer) => ({ can_use_theme: true, can_use_records: true,
  record_available_today: false, theme_available_today: true, records: null, theme: null,
  history: [{ id: 'saved-answer', lane: 'theme', question_text: '質問', answer_text: answer, answered_at: '2026-11-26' }] });

test('DeepInsight reuses a successful read on ordinary focus and across stack reopen', async t => {
  const cache = { snapshot: null, foregroundRevision: 0 };
  const h = await harness(t, 'screens/DeepInsightScreen.js', 'following', {
    returnCache: cache, deepInsightState: deepInsightReturnData('表示済みの本人回答'),
  });
  const reads = () => h.calls.filter(call => call.path === '/deep-insight');
  await h.navigationEvent('blur');
  await h.navigationEvent('focus');
  await h.reopen();
  assert.equal(reads().length, 1);
  assert.match(JSON.stringify(h.root.toJSON()), /表示済みの本人回答/);
  h.control.deepInsightState = deepInsightReturnData('復帰時に確認した回答');
  cache.foregroundRevision += 1;
  await h.reopen();
  assert.equal(reads().length, 2);
  assert.match(JSON.stringify(h.root.toJSON()), /復帰時に確認した回答/);
});

test('DeepInsight refreshes on a confirmed owner input update and fences plan, owner, and notification changes', async t => {
  const h = await harness(t, 'screens/DeepInsightScreen.js', 'following', {
    returnCache: { snapshot: null, foregroundRevision: 0 }, tier: 'premium',
    deepInsightState: deepInsightReturnData('有料状態の本人回答'),
  });
  const reads = () => h.calls.filter(call => call.path === '/deep-insight');
  const display = () => JSON.stringify(h.root.toJSON());
  await h.changeRecords('somebody-else');
  assert.equal(reads().length, 1);
  h.control.deepInsightState = deepInsightReturnData('新しい記録のあとに取得した回答');
  await h.changeRecords('A');
  assert.equal(reads().length, 2);
  assert.match(display(), /新しい記録のあとに取得した回答/);

  h.control.tier = 'free';
  h.control.holdRead = call => call.path === '/deep-insight';
  await h.update();
  assert.doesNotMatch(display(), /新しい記録のあとに取得した回答/);
  await h.resolve(reads().at(-1), deepInsightReturnData('参照権更新後の回答'));
  assert.match(display(), /参照権更新後の回答/);

  h.control.screenParams = { notification: { lane: 'records', questionId: 'older' } };
  h.control.notifiedQuestion = { id: 'older', lane: 'records', question_text: '通知の固有質問', answered_at: null };
  await h.update();
  assert.doesNotMatch(display(), /参照権更新後の回答/);
  await h.resolve(reads().at(-1), deepInsightReturnData('参照権更新後の回答'));
  assert.match(display(), /通知の固有質問/);

  await h.switchTo('B');
  assert.doesNotMatch(display(), /通知の固有質問|参照権更新後の回答/);
  assert.equal(reads().at(-1).owner, 'B');
});

test('DeepInsight preserves a saved answer when a concurrent older fetch completes', async t => {
  const pending = { id: 'pending', lane: 'theme', question_text: 'お題', answered_at: null };
  const saved = { ...pending, answer_text: '保存できた回答', answered_at: '2026-11-26' };
  const stale = { ...deepInsightReturnData('先に取得した回答'), theme: pending };
  const ready = { ...stale, theme: saved, history: [saved, ...stale.history] };
  const h = await harness(t, 'screens/DeepInsightScreen.js', 'following', {
    deepInsightState: stale, writeResponse: path => path === '/deep-insight/answers' ? { question: saved } : null,
  });
  h.control.holdRead = call => call.path === '/deep-insight';
  await h.backgroundCycle();
  const oldRead = h.calls.filter(call => call.path === '/deep-insight').at(-1);
  assert.equal(typeof oldRead.resolve, 'function');
  await act(async () => { h.root.root.findByType('TextInput').props.onChangeText(saved.answer_text); });
  const save = h.root.root.findAllByType('CocolonButton').find(node => node.props.children === '回答を保存する');
  await act(async () => { await save.props.onPress(); });
  h.control.deepInsightState = ready;
  h.control.holdRead = null;
  await h.resolve(oldRead, stale);
  assert.match(JSON.stringify(h.root.toJSON()), /保存できた回答/);
  assert.equal(h.root.root.findAllByType('TextInput').length, 0);
  assert.equal(h.calls.filter(call => call.path === '/deep-insight').length, 3);
});

test('DeepInsight first record auto-issue is preserved without repeating it on return', async t => {
  const question = { id: 'new-record', lane: 'records', question_text: '記録からの問い', answered_at: null };
  const h = await harness(t, 'screens/DeepInsightScreen.js', 'following', {
    returnCache: { snapshot: null, foregroundRevision: 0 },
    deepInsightState: { ...deepInsightReturnData('以前の回答'), record_available_today: true },
    writeResponse: path => path === '/deep-insight/questions' ? { question, status: 'issued' } : null,
  });
  assert.match(JSON.stringify(h.root.toJSON()), /記録からの問い/);
  await h.navigationEvent('blur');
  await h.navigationEvent('focus');
  await h.reopen();
  assert.equal(h.calls.filter(call => call.path === '/deep-insight').length, 1);
  assert.equal(h.mutations().filter(call => call.path === '/deep-insight/questions').length, 1);
  assert.match(JSON.stringify(h.root.toJSON()), /記録からの問い/);
});
