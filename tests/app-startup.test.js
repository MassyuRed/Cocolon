// Real startup owners with deferred I/O. This does not run a native device.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const Renderer = require('react-test-renderer');
const babel = require('@babel/core');
const {act} = Renderer;
const ROOT = path.resolve(__dirname, '..');
const deferred = () => { let resolve, reject; const promise = new Promise((a,b) => {resolve=a;reject=b;}); return {promise,resolve,reject}; };
function load(relative, mocks = {}) {
  const filename = path.resolve(ROOT, relative);
  const code = babel.transformSync(fs.readFileSync(filename,'utf8'), {filename,babelrc:false,configFile:false,
    presets:[require.resolve('@babel/preset-react')],plugins:[require.resolve('@babel/plugin-transform-modules-commonjs')]}).code;
  const module={exports:{}};
  Function('require','module','exports',code)(name => {
    if (name === 'react') return React;
    if (Object.hasOwn(mocks,name)) return mocks[name];
    if (name.startsWith('.')) return load(path.relative(ROOT,path.resolve(path.dirname(filename),name))+'.js',mocks);
    return require(name);
  },module,module.exports);
  return module.exports;
}
const native = {View:'View',Text:'Text',TouchableOpacity:'TouchableOpacity',ActivityIndicator:'Spinner',
  useWindowDimensions:()=>({width:390,height:844,fontScale:1}),
  AppState:{currentState:'active',addEventListener:()=>({remove(){}})}};
const theme={colors:{}};
const no = () => {};
const forever = () => new Promise(()=>{});

test('startup covers the mounted home until subscription I/O and home/draft settle, then preserves drafts on refresh', async t => {
  let mounts=0, readyHome, setDraft, owner='A';
  function Input(props) {
    const [draft,update]=React.useState(''); setDraft=update;
    readyHome=()=>props.onInitialInputSettled('A');
    React.useEffect(()=>{mounts++;},[]);
    return React.createElement('Input',{draft,ready:props.appStartupReady,saveRecovery:props.saveRecovery});
  }
  const subscription={tier:'plus',isPaid:true,loading:false,subscriptionBootstrapLoaded:true,subscriptionBootstrapLoading:true};
  const tutorial={isTutorialMode:false,tutorialFlagsLoaded:true,tutorialCompleted:true};
  const unread={getScopeUnread:no,getFeatureUnread:no,setUnread:no,setUnreadGroup:no,getPrefetchEntryFresh:no,setPrefetch:no,applyStartupSnapshot:no};
  function Navigator(props){return React.createElement('Navigator',props,React.Children.toArray(props.children)
    .filter(screen => ['Input', 'Piece'].includes(screen.props.name)));}
  const Screen=props=>typeof props.children==='function'?props.children({}):null;
  function loadStack(file, screen) {
    const screenMocks = Object.fromEntries(Array.from(fs.readFileSync(path.join(ROOT, file), 'utf8')
      .matchAll(/from ["'](\.\.\/screens\/[^"']+)["']/g), match => [match[1], () => null]));
    return load(file, { ...screenMocks, ...screen, '@react-navigation/native-stack': { createNativeStackNavigator: () => ({
      Navigator: ({ children }) => React.Children.toArray(children).find(child => ['Input', 'PieceCreate'].includes(child.props.name)),
      Screen,
    }) } }).default;
  }
  const InputStack = loadStack('navigation/InputStackNavigator.js', { '../screens/InputScreen': Input });
  const PieceStack = loadStack('navigation/PieceStackNavigator.js', {
    '../screens/PieceCreateScreen': props => React.createElement('Piece', { saveRecovery: props.saveRecovery }),
  });
  const Main=load('navigation/MainTabs.js',{
    'react-native':native,'react-native-vector-icons/Ionicons':()=>null,
    'react-native-safe-area-context':{useSafeAreaInsets:()=>({top:0,bottom:0,left:0,right:0})},
    '@react-navigation/native':{StackActions:{popToTop:no}},
    '@react-navigation/bottom-tabs':{createBottomTabNavigator:()=>({Navigator,Screen}),BottomTabBar:()=>null},
    '@react-native-async-storage/async-storage':{getItem:forever,setItem:forever},
    '../AuthContext':{useAuth:()=>({session:{user:{id:owner}}})},'../UnreadContext':{useUnread:()=>unread},
    '../SubscriptionContext':{useSubscription:()=>subscription},'../TutorialContext':{useTutorial:()=>tutorial},
    '../theme/ThemeContext':{useTheme:()=>theme},'../lib/supabase':{supabase:{auth:{getUser:forever,getSession:forever}}},
    '../lib/user':{getCurrentUserId:forever},'../lib/apiClient':{apiFetch:forever,apiGet:forever,apiPost:forever},
    '../lib/nexusApi':{getNexusPiecesAsQnaList:forever},'../components/UnreadBadge':{BottomTabUnreadBadge:()=>null},
    '../components/GlobalFrameLayout':({children})=>React.createElement('Frame',null,children),
    './navigationRef':{navigationRef:{isReady:()=>false},buildAnalysisRootNavigationParams:no},
    './InputStackNavigator':InputStack,'./AnalysisStackNavigator':()=>null,
    './PieceStackNavigator':PieceStack,
    './SettingsStackNavigator':()=>null,
    '../runtime/AppStartupLoadingView':()=>React.createElement('Loading'),
  }).default;
  let root;await act(async()=>{root=Renderer.create(React.createElement(Main));});t.after(()=>act(async()=>root.unmount()));
  assert.equal(root.root.findAllByType('Loading').length,1);
  await act(async()=>{setDraft('保存前の下書き');readyHome();});
  assert.equal(root.root.findAllByType('Loading').length,1,'fallback loaded is not subscription network completion');
  subscription.subscriptionBootstrapLoading=false;
  await act(async()=>root.update(React.createElement(Main)));
  assert.equal(root.root.findAllByType('Loading').length,0);
  assert.equal(root.root.findByType('Input').props.draft,'保存前の下書き');assert.equal(mounts,1);
  subscription.subscriptionBootstrapLoading=true;
  await act(async()=>root.update(React.createElement(Main)));
  assert.equal(root.root.findAllByType('Loading').length,0,'foreground refresh must not restore full startup gate');
  assert.equal(mounts,1);
  const recovery = root.root.findByType('Input').props.saveRecovery;
  assert.equal(root.root.findByType('Piece').props.saveRecovery, recovery);
  const entry = { operation: { expectedUserId: 'A', request: { source_ref: { source_input_id: 'source' } } } };
  assert.equal(recovery.remember(entry), true);
  owner = 'B'; await act(async () => root.update(React.createElement(Main)));
  const replacement = root.root.findByType('Input').props.saveRecovery;
  assert.notEqual(replacement, recovery);
  assert.equal(root.root.findByType('Piece').props.saveRecovery, replacement);
  assert.equal(recovery.find('A', 'source'), undefined);
  assert.equal(recovery.remember(entry), false);
});

test('home initial read settles on failure, can retry, and ignores requests from a previous owner', async t => {
  const reads=[];const navigation={addListener:()=>()=>{}};let value,root;
  const hook=load('features/home/useHomeState.js',{
    'react-native':native,'../../AppRuntimeContext':{useAppRuntime:()=>({isFeatureEnabled:()=>true})},
    '../../lib/api/home/homeStateApi':{getHomeState:()=>{const d=deferred();reads.push(d);return d.promise;}},
    '../../lib/api/home/todayQuestionApi':{resolveLocalTimezoneName:()=> 'Asia/Tokyo'},
  }).useHomeState;
  const candidate=()=>null;
  function Home({owner}){value=hook({currentUserId:owner,isTutorialMode:false,tutorialFlagsLoaded:true,navigation,buildTutorialStartupCandidate:candidate});return null;}
  t.mock.method(console,'warn',no);
  await act(async()=>{root=Renderer.create(React.createElement(Home,{owner:'A'}));});t.after(()=>act(async()=>root.unmount()));
  assert.equal(value.initialHomeReadComplete,false);
  const old=[...reads];await act(async()=>root.update(React.createElement(Home,{owner:'B'})));
  await act(async()=>old.forEach(d=>d.resolve({sections:{}})));
  assert.equal(value.initialHomeReadComplete,false,'old owner cannot release B startup');
  await act(async()=>reads.filter(d=>!old.includes(d)).forEach(d=>d.reject(Error('offline'))));
  assert.equal(value.initialHomeReadComplete,true);assert.equal(value.homeReadError,true);
  let retry;await act(async()=>{retry=value.loadHomeState({force:true,includeStartupCandidate:false});});
  await act(async()=>{reads.at(-1).resolve({sections:{input_summary:{today_count:2}}});await retry;});
  assert.equal(value.homeReadError,false);assert.equal(value.homeTodayCount,2);assert.equal(value.initialHomeReadComplete,true);
});

function loadTutorialOverlay({ width = 844, height = 390, insets } = {}) {
  return load('components/TutorialOverlay.js', {
    'react-native': {
      View: 'View', Text: 'Text', ScrollView: 'ScrollView', Pressable: 'Pressable',
      StyleSheet: { create: x => x, absoluteFillObject: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } },
      useWindowDimensions: () => ({ width, height, fontScale: 1 }),
    },
    'react-native-safe-area-context': { useSafeAreaInsets: () => insets || { top: 0, right: 0, bottom: 21, left: 0 } },
    '../theme/ThemeContext': { useTheme: () => ({ colors: {}, themeName: 'default' }) },
  });
}

const flatStyle = value => Array.isArray(value)
  ? Object.assign({}, ...value.filter(Boolean).map(flatStyle)) : value || {};
const nextFrame = () => new Promise(resolve => setImmediate(resolve));

// These use the real overlay and public measurement helpers. Native measurement
// is replaced; physical layout, gestures, and OS safe areas still need a device.
test('tall tutorial information keeps the card usable and identical targets settle', async t => {
  const oldRaf = global.requestAnimationFrame;
  global.requestAnimationFrame = cb => setImmediate(cb);
  let view;
  t.after(async () => {
    if (view) await act(async () => view.unmount());
    await nextFrame(); await nextFrame();
    if (oldRaf) global.requestAnimationFrame = oldRaf; else delete global.requestAnimationFrame;
  });
  const insets = { top: 0, left: 44, right: 44, bottom: 21 };
  const Overlay = loadTutorialOverlay({ insets }).default;
  for (const targetHeight of [339, 392, 503]) {
    let metrics, emissions = 0;
    function Host() {
      const [target, setTarget] = React.useState({ x: 20, y: 36, width: 300, height: targetHeight });
      const onMetrics = React.useCallback(value => {
        if (!value) return;
        metrics = value;
        emissions += 1;
        // This matches the callers remeasuring into a new object. Bound a
        // regression's runaway feedback rather than hanging the test process.
        if (emissions < 12) setTarget(prev => ({ ...prev }));
      }, []);
      return React.createElement(Overlay, { visible: true, mode: 'info', targetRect: target,
        title: '説明', message: '長い欄の使い方', nextLabel: '次へ', onNext: no,
        onMetricsChange: onMetrics, testID: 'tutorial-layout-root' });
    }
    await act(async () => {
      view = Renderer.create(React.createElement(Host), { createNodeMock: node =>
        node.props.testID === 'tutorial-layout-root'
          ? { measureInWindow: cb => cb(44, 55, 756, 335) } : null });
    });
    await act(async () => view.root.findAllByType('View').find(node => node.props.testID === 'tutorial-layout-root').props.onLayout({
      nativeEvent: { layout: { width: 756, height: 335 } },
    }));
    await act(async () => { for (let frame = 0; frame < 8; frame += 1) await nextFrame(); });
    const card = view.root.findAllByType('View').find(node =>
      node.props.onLayout && flatStyle(node.props.style).maxHeight != null);
    const bounds = flatStyle(card.props.style);
    assert.ok(bounds.maxHeight >= 116, `target ${targetHeight}: explanation must not collapse`);
    assert.ok(metrics.cardRect.bottom <= 335 - 21, 'card remains above the home-indicator inset');
    assert.equal(metrics.safeInsets.top, 0);
    assert.equal(metrics.safeInsets.left, 0, 'already consumed horizontal inset is not added twice');
    assert.equal(metrics.cardRect.width, 640);
    assert.ok(emissions < 12, 'equal measured coordinates stop the metrics feedback');
    const primary = view.root.findAllByType('Pressable').find(node => node.props.onPress === no);
    assert.ok(primary, 'next action remains available');
    let ancestor = primary.parent;
    while (ancestor && ancestor.type !== 'ScrollView') ancestor = ancestor.parent;
    assert.ok(ancestor, 'next remains within the readable card scroll');
    await act(async () => view.unmount()); view = null;
  }
});

test('oversized tutorial target stays at its start without alternating scrolls', async t => {
  const oldRaf = global.requestAnimationFrame;
  global.requestAnimationFrame = cb => setImmediate(cb);
  t.after(() => { if (oldRaf) global.requestAnimationFrame = oldRaf; else delete global.requestAnimationFrame; });
  const { syncTutorialSpotlightTarget } = loadTutorialOverlay();
  const currentScrollYRef = { current: 0 }, scrolls = [];
  const options = {
    targetRef: { current: { measureInWindow: cb => cb(20, 36 - currentScrollYRef.current, 300, 392) } },
    rootRef: { current: { measureInWindow: cb => cb(0, 0, 390, 335) } },
    scrollRef: { current: { scrollTo: value => scrolls.push(value.y) } }, currentScrollYRef,
    overlayMetrics: { overlayHeight: 335, overlayWindowRect: { x: 0, y: 0, width: 390, height: 335 },
      safeInsets: { top: 0, bottom: 21 }, cardPlacement: 'bottom',
      cardRect: { x: 16, y: 67, width: 358, height: 247 } },
    measureOptions: { maxAttempts: 1, settleFrames: 0 },
  };
  for (let repeat = 0; repeat < 4; repeat += 1) await syncTutorialSpotlightTarget(options);
  assert.deepEqual(scrolls, [], 'the visible start is already aligned; never chase the impossible bottom');
  assert.equal(currentScrollYRef.current, 0);
});

test('tutorial fallback card is bounded by usable height including both insets', () => {
  const { buildTutorialViewport } = loadTutorialOverlay();
  const view = buildTutorialViewport({ windowHeight: 70, safeInsets: { top: 28, bottom: 21 },
    cardBottomMargin: -16, fallbackCardHeight: 220 });
  assert.equal(view.cardRect.y, 32);
  assert.equal(view.cardRect.height, 17);
  assert.equal(view.cardRect.bottom, 49, 'negative margin cannot consume the bottom safe area');
});
