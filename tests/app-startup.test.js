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
