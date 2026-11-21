const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const Renderer = require('react-test-renderer');
const babel = require('@babel/core');
const rootPath = path.resolve(__dirname, '..');
const compiledSources = new Map();

function loadSource(file, dependencies) {
  if (!compiledSources.has(file)) {
    const source = fs.readFileSync(path.join(rootPath, file), 'utf8');
    compiledSources.set(file, babel.transformSync(source, { babelrc: false, configFile: false,
      presets: [require.resolve('@babel/preset-react')], plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')] }).code);
  }
  const module = { exports: {} };
  Function('require', 'module', 'exports', compiledSources.get(file))(dependencies, module, module.exports);
  return module.exports;
}
const colors = {
  FIELD_BG: '#FFFFFF', CARD_BORDER: '#D7D2C9', TITLE_GOLD: '#800020', GOLD_BUTTON: '#5A1020',
  TEXT_ON_LIGHT: '#272123', TEXT_SUBTLE: '#6B625C',
};
const ui = {
  typography: {
    screenTitle: { fontSize: 26, lineHeight: 34, fontWeight: '600' },
    description: { fontSize: 14, lineHeight: 22, fontWeight: '400' },
    meta: { fontSize: 12, lineHeight: 18, fontWeight: '400' },
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
};
function assertIntroText(root, expected) {
  const textNodes = root.root.findAllByType('Text');
  const intro = textNodes.slice(0, 3);
  assert.deepEqual(intro.map(node => node.props.children), expected);
  assert.deepEqual(intro.map(node => node.props.accessibilityRole), [undefined, 'header', undefined]);
  assert.equal(intro[1].props.style.at(-1).color, colors.TITLE_GOLD);
  assert.equal(intro[0].props.style.at(-1).color, colors.TEXT_SUBTLE);
  assert.equal(intro[2].props.style.at(-1).color, colors.TEXT_SUBTLE);
  assert.ok(intro.every(node => !node.props.numberOfLines));
}
test('Home shows the Japanese weekday and refreshes the date at local midnight and on app return', t => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: new Date(2026, 10, 6, 23, 59, 59, 750) });
  let appStateListener;
  const AppState = {
    currentState: 'active',
    addEventListener(event, listener) {
      assert.equal(event, 'change');
      appStateListener = listener;
      return { remove: () => { appStateListener = null; } };
    },
  };
  const native = { AppState, View: 'View', Text: 'Text', StyleSheet: { create: value => value } };
  const dependencies = name => {
    if (name === 'react') return React;
    if (name === 'react-native') return native;
    if (name.endsWith('/CocolonScreenIntro')) return loadSource('components/CocolonScreenIntro.js', dependencies);
    assert.fail(`Unexpected Home intro import ${name}`);
  };
  const HomeScreenIntro = loadSource('screens/input/HomeScreenIntro.js', dependencies).default;
  let root;
  Renderer.act(() => { root = Renderer.create(React.createElement(HomeScreenIntro, { colors, ui })); });
  t.after(() => {
    Renderer.act(() => root.unmount());
    assert.equal(appStateListener, null);
  });
  const textBelowDate = ['今のあなたを、言葉に。', 'まとまっていなくても、そのままで。'];
  assertIntroText(root, ['11月6日 金曜日', ...textBelowDate]);

  Renderer.act(() => t.mock.timers.tick(500));
  assertIntroText(root, ['11月7日 土曜日', ...textBelowDate]);

  Renderer.act(() => appStateListener('background'));
  t.mock.timers.setTime(new Date(2026, 10, 10, 11).getTime());
  Renderer.act(() => appStateListener('active'));
  assertIntroText(root, ['11月10日 火曜日', ...textBelowDate]);
});

test('the Piece heading comes before the owner history without header shortcuts', t => {
  const actions = [];
  const native = { Text: 'Text', View: 'View', StyleSheet: { create: value => value } };
  const dependencies = name => {
    if (name === 'react') return React;
    if (name === 'react-native') return native;
    if (name.endsWith('/CocolonPressable')) return 'Pressable';
    if (name.endsWith('/CocolonScreenIntro')) return loadSource('components/CocolonScreenIntro.js', dependencies);
    if (name.endsWith('/PieceScreenIntro')) return loadSource('screens/piece/PieceScreenIntro.js', dependencies);
    assert.fail(`Unexpected Piece header import ${name}`);
  };
  const NexusHeader = loadSource('screens/nexus/NexusHeader.js', dependencies).default;
  let root;
  Renderer.act(() => {
    root = Renderer.create(React.createElement(NexusHeader, {
      styles: {}, colors, ui, canReadOwnPieces: true, titleRef: React.createRef(),
      handleOpenOwnerHistory: () => actions.push('history'),
    }));
  });
  t.after(() => Renderer.act(() => root.unmount()));
  assertIntroText(root, ['ひとりひとりの記録から', 'ことばを、分け合う。', '言葉や気持ちにふれて、共鳴を届ける。']);
  const buttons = root.root.findAllByType('Pressable');
  assert.deepEqual(buttons.map(button => button.props.accessibilityLabel), ['自分のピースを開く']);
  assert.equal(root.toJSON().children[0].children[1].children[0], 'ことばを、分け合う。');
  buttons[0].props.onPress();
  assert.deepEqual(actions, ['history']);
});

function mount(t, changes = {}, initialUnreadCount = 0) {
  const navigated = [], actions = [];
  let unreadCount = initialUnreadCount;
  let focusGeneration = 0;
  const requests = [];
  const noticeScope = { options: { expectedUserId: 'owner' } };
  const isCurrent = (candidate) => candidate === noticeScope;
  const subscription = { loading:false, tier:'free', currentLabel:'Freeプラン', currentPriceLabel:'無料', actionBusy:false,
    restoreLoading:false, restoreEnabled:true, manageEnabled:false, links:{ terms_url:'https://test/terms', privacy_url:'https://test/privacy', support_url:'https://test/support' },
    onRestorePurchases:()=>actions.push('restore'), onOpenManageSubscription:()=>actions.push('manage'), openExternalPage:(url)=>actions.push(url), ...changes };
  const native = { View:'View', Text:'Text', ActivityIndicator:'Spinner', StyleSheet:{create:x=>x} };
  const dependencies = name => {
    if(name==='react') return React;
    if(name==='react-native') return native;
    if(name==='@react-navigation/native') return {
      useFocusEffect: effect => React.useEffect(effect, [effect, focusGeneration]),
    };
    if(name==='../AuthContext') return {useAuth:()=>({user:{id:'owner'},authOwnerGeneration:0})};
    if(name==='../TutorialContext') return {useTutorial:()=>({isTutorialMode:false})};
    if(name==='../hooks/useOwnerRequestScope') return {useOwnerRequestScope:()=>({scope:noticeScope,isCurrent})};
    if(name==='../lib/noticeApi') return {getNoticesCurrent:async (_params, options) => {
      requests.push(options.expectedUserId);
      return { feature_enabled: true, unread_count: unreadCount };
    }};
    if(name==='../components/UnreadBadge') return {ScreenUnreadBadge:'UnreadBadge'};
    if(name.includes('Ionicons')) return 'Icon';
    if(name.includes('CocolonPressable')) return {__esModule:true,default:'Pressable'};
    if(name.includes('applyTypographyTokens')) return {applyTypographyTokens:x=>x};
    if(name==='./AnalysisMenuCommon') return {AnalysisMenuScroll:'Scroll',useAnalysisMenuStyles:()=>({colors,ui})};
    if(name==='../components/CocolonScreenIntro') return loadSource('components/CocolonScreenIntro.js', dependencies);
    return {__esModule:true,default:name};
  };
  const { SettingsHomeContent } = loadSource('screens/SettingsScreen.js', dependencies);
  const navigation = { navigate: route => navigated.push(route) };
  const render = () => React.createElement(SettingsHomeContent, { subscription, navigation });
  let root; Renderer.act(()=>{root=Renderer.create(render());});
  t.after(()=>Renderer.act(()=>root.unmount()));
  return {root,actions,navigated,subscription,requests,button:label=>root.root.findAllByType('Pressable').find(x=>x.props.accessibilityLabel===label),
    async refocus(nextUnreadCount) {
      unreadCount = nextUnreadCount;
      focusGeneration += 1;
      await Renderer.act(async () => root.update(render()));
    }};
}
test('settings shows live plan and direct preview groups with existing embedded controls', t=>{
  const h=mount(t,{tier:'plus',currentLabel:'Plusプラン',currentPriceLabel:'月額680円',manageEnabled:true});
  const labels=h.root.root.findAllByType('Text').map(x=>x.props.children).filter(x=>typeof x==='string');
  assert.ok(labels.indexOf('アプリ設定')<labels.indexOf('サブスク加入状況'));
  assert.ok(labels.indexOf('サブスク加入状況')<labels.indexOf('その他'));
  assert.ok(labels.includes('Plus')&&labels.includes('月額680円'));
  assert.equal(h.root.root.findByType('./SettingsAppSettingsScreen').props.embedded,true);
  assert.equal(h.root.root.findByType('./SettingsOtherScreen').props.embedded,true);
  h.button('購入内容を復元').props.onPress(); h.button('サブスクリプションを管理').props.onPress();
  assert.deepEqual(h.actions,['restore','manage']);
  h.button('プランを選ぶ').props.onPress(); assert.deepEqual(h.navigated,['SubscriptionSelect']);
});
test('settings opens notices from the first row above the existing account access', async t=>{
  const h = mount(t, {}, 2);
  await Renderer.act(async () => {});
  assertIntroText(h.root, ['YOUR SPACE', '設定', 'あなたに合う使い方で。']);
  const labels = h.root.root.findAllByType('Text').map(node => node.props.children);
  assert.ok(labels.indexOf('あなたに合う使い方で。') < labels.indexOf('お知らせ'));
  assert.ok(labels.indexOf('お知らせ') < labels.indexOf('アカウント'));
  assert.ok(labels.indexOf('アカウント') < labels.indexOf('アプリの使い方'));
  assert.ok(labels.indexOf('アプリの使い方') < labels.indexOf('アプリ設定'));
  assert.ok(labels.indexOf('サブスク加入状況') < labels.indexOf('現在のプラン'));
  for (const label of ['お知らせを開く', 'アカウントを開く', '現在のプランと加入状況を開く']) {
    const surface = h.button(label).props.style[0];
    assert.equal(surface.backgroundColor, colors.FIELD_BG);
    assert.equal(surface.borderColor, colors.CARD_BORDER);
  }
  assert.deepEqual(h.button('お知らせを開く').props.accessibilityValue, { text: '未読あり' });
  assert.equal(h.root.root.findAllByType('UnreadBadge').length, 1);
  h.button('お知らせを開く').props.onPress();
  h.button('アカウントを開く').props.onPress();
  h.button('アプリの使い方').props.onPress();
  assert.deepEqual(h.navigated, ['NoticeHistory', 'Account', 'CocolonGuide']);
  await h.refocus(0);
  assert.deepEqual(h.requests, ['owner', 'owner']);
  assert.equal(h.root.root.findAllByType('UnreadBadge').length, 0);

  const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  assert.doesNotMatch(read('navigation/MainTabs.js'), /settingsAccountAvatar|headerRightSlot/);
  assert.doesNotMatch(read('components/GlobalFrameLayout.js'), /headerRightSlot/);
  assert.match(read('navigation/SettingsStackNavigator.js'), /contentStyle: \{ backgroundColor: colors\.BG_SILVER \}/);
  assert.match(read('navigation/SettingsStackNavigator.js'), /<SettingsStack\.Screen name="NoticeHistory">\s*\{\(props\) => <NoticeHistoryScreen \{\.\.\.props\} fromSettings \/>\}/);
  assert.match(read('navigation/InputStackNavigator.js'), /<InputStack\.Screen name="NoticeHistory" component=\{NoticeHistoryScreen\}/);
});
test('settings prevents plan navigation during restore and keeps Free management disabled',t=>{
  const h=mount(t,{actionBusy:true});
  for(const label of ['現在のプランと加入状況を開く','プランを選ぶ','購入内容を復元','サブスクリプションを管理']) assert.equal(h.button(label).props.disabled,true);
  h.button('プランを選ぶ').props.onPress(); h.button('現在のプランと加入状況を開く').props.onPress();
  assert.deepEqual(h.navigated,[]);
});
test('loading plan never presents a fabricated Plus subscription',t=>{
  const h=mount(t,{loading:true,currentLabel:'Plusプラン',currentPriceLabel:'月額680円'});
  assert.equal(h.root.root.findAllByType('Spinner').length,1);
  assert.ok(!h.root.root.findAllByType('Text').some(x=>x.props.children==='Plus'));
});

function mountGuide(t, params) {
  const actions = [];
  const navigation = { canGoBack: () => true, goBack: () => actions.push('back') };
  const modules = new Map();
  const native = {
    Modal: ({ visible, children }) => visible ? React.createElement('Modal', null, children) : null,
    Pressable: 'Pressable', ScrollView: 'ScrollView', StatusBar: 'StatusBar', StyleSheet: { create: x => x },
    Text: 'Text', TouchableOpacity: 'Pressable', View: 'View',
  };
  function load(file) {
    if (!modules.has(file)) {
      modules.set(file, loadSource(file, name => {
        if (name === 'react') return React;
        if (name === 'react-native') return native;
        if (name === 'react-native-safe-area-context') return { SafeAreaProvider: 'View', SafeAreaView: 'View' };
        if (name === '@react-navigation/native') return { useNavigation: () => navigation };
        if (name.endsWith('/Ionicons')) return 'Icon';
        if (name.endsWith('/ThemeContext')) return { useTheme: () => ({ colors, themeName: 'light' }) };
        if (name.endsWith('/CocolonButton')) return 'Button';
        return load(path.normalize(path.join(path.dirname(file), name + '.js')));
      }));
    }
    return modules.get(file);
  }
  const Guide = load('screens/CocolonGuideScreen.js').default;
  let root;
  Renderer.act(() => { root = Renderer.create(React.createElement(Guide, { route: { params } })); });
  t.after(() => Renderer.act(() => root.unmount()));
  const tabs = () => root.root.findAllByType('Pressable').filter(x => x.props.accessibilityRole === 'tab');
  return {
    root, actions, tabs,
    selected: () => tabs().filter(tab => tab.props.accessibilityState.selected).map(tab => tab.props.accessibilityLabel),
    text: () => root.root.findAllByType('Text').map(node => node.props.children),
    press: node => Renderer.act(() => node.props.onPress()),
  };
}

test('the manual switches between all four chapters and resets the chapter scroll', t => {
  const h = mountGuide(t);
  assert.deepEqual(h.tabs().map(tab => tab.props.accessibilityLabel), ['ホーム', '分析', 'ピース', '感情通知']);
  assert.deepEqual(h.selected(), ['ホーム']);
  for (const [label, excerpt] of [
    ['分析', '今日・週・月'],
    ['ピース', 'ピース'],
    ['感情通知', 'フォロー中'],
  ]) {
    const previousBody = h.root.root.findByType('ScrollView');
    h.press(h.tabs().find(tab => tab.props.accessibilityLabel === label));
    assert.deepEqual(h.selected(), [label]);
    assert.notEqual(h.root.root.findByType('ScrollView'), previousBody);
    assert.ok(h.root.root.findByType('ScrollView').findAllByType('Text')
      .some(node => typeof node.props.children === 'string' && node.props.children.includes(excerpt)));
  }
  h.press(h.root.root.findAllByType('Pressable').find(node => node.props.accessibilityLabel === '戻る'));
  assert.deepEqual(h.actions, ['back']);
});

test('manual shortcuts select the requested chapter and the original inline definitions still open', t => {
  const home = mountGuide(t, { screenId: 'home' });
  assert.deepEqual(home.selected(), ['ホーム']);
  const term = home.root.root.findAllByType('Text').find(node => node.props.accessibilityRole === 'link' && node.props.children === '感情入力');
  home.press(term);
  assert.ok(home.text().includes('今の思考・行動・感情をまとめて記録する入力です。'));
  home.press(home.root.root.findAllByType('Pressable').find(node => node.props.accessibilityLabel === '用語説明を閉じる'));
  assert.equal(home.root.root.findAllByType('Modal').length, 0);

  for (const [params, title] of [
    [{ screenId: 'piece' }, 'ピース'],
    [{ screenId: 'analysis' }, '分析'],
    [{ screen_id: 'emotion_log' }, '感情通知'],
  ]) {
    assert.deepEqual(mountGuide(t, params).selected(), [title]);
  }
});
