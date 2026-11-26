const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const Renderer = require('react-test-renderer');
const babel = require('@babel/core');
const { act } = Renderer;
const root = path.resolve(__dirname, '..');
const projection = JSON.parse(JSON.stringify(require('./fixtures/analysis-watashi-map-v2-synthetic.json').cases.find(x => x.projection.nodes.length >= 2).projection));
projection.projection_of = 'artifact:00000000000000000000000000000065@1';
const semantic = require('./fixtures/analysis-semantic-map-v3-synthetic.json');
const contract = require('../components/selfStructure/cumulativeMapContract');
const copy = x => JSON.parse(JSON.stringify(x));
const owner = '00000000-0000-0000-0000-000000000001';
const id = p => { const s=p.projection_of.split(':')[1].split('@')[0]; return `${s.slice(0,8)}-${s.slice(8,12)}-${s.slice(12,16)}-${s.slice(16,20)}-${s.slice(20)}`; };
const counts = { profile:'cumulative.v1', source_count:5, processed_count:5, mapped_count:5, unparsed_count:0, excluded_count:0, stale_supplement_count:0 };
function latest(p=projection) { return { status:'ok', reason:'up_to_date', has_visible_content:true, source_profile:'cumulative.v1',
  report_id:id(p), generated_at:'2026-11-01T00:00:00Z', meta:p, map_context:counts }; }
function row(month='2026-10-01', p=projection) { return { id:id(p), snapshot_month:month, source_profile:'cumulative.v1',
  content_json:{watashiMap:p,map_context:counts}, generated_at:'2026-10-10T00:00:00Z',captured_at:'2026-10-10T00:00:00Z' }; }
function planMap(tier, withFigure = true) {
  const map = copy(semantic);
  const refs = withFigure ? ['n1', 'n3'] : [];
  map.overview.primary_structures = [{ title: '先に約束したこと',
    description: tier === 'free' ? '先に約束したことを守れる範囲を選びます。' : '提出が先の日は、資料の確認だけを引き受けました。',
    scope: 'in_this_record', node_refs: refs }];
  map.nodes = map.nodes.filter(node => refs.includes(node.node_ref));
  map.edges = map.edges.filter(edge => refs.includes(edge.from_ref) && refs.includes(edge.to_ref));
  map.accessibility_linear_order = refs;
  return map;
}
const scopedPlan = tier => ({ map_subscription_tier: tier, map_plan_scoped: true });
function downgrade(p) {
  return { ...copy(projection), projection_of:p.projection_of, period_label:p.period_label,
    period_comparison:{state:'NO_PREVIOUS',reason_codes:[],safe_change_kinds:[]},
    nodes:p.nodes.map(n=>({node_ref:n.node_ref,node_kind:'ATTENTION_OR_THOUGHT',
      visible_label:`読み取り：${n.title}\n${n.summary}\n${n.explanation}`,evidence_badge_count:n.evidence_badge_count})),
    edges:[],annotation_badges:[],unknown_gaps:[],conflict_badges:[],
    accessibility_linear_order:p.accessibility_linear_order };
}
const requestedRenderer = opts => opts.headers?.['X-Watashi-Map-Renderer'];
function deferred() { let resolve,reject; const promise=new Promise((r,j)=>{resolve=r;reject=j;}); return {promise,resolve,reject}; }
function button(render,label) { return render.root.findAllByType('TouchableOpacity').find(n=>n.findAllByType('Text').some(t=>String(t.props.children).includes(label))); }
function harness(get) {
  const auth={session:{user:{id:owner}}}, plan={tier:'free',loading:false}, calls=[];
  const modules=new Map(), focus={value:true}, appListeners=new Set();
  const appState={currentState:'active',addEventListener:(event,listener)=>{appListeners.add(listener);return {remove:()=>appListeners.delete(listener)};}};
  const native={AppState:appState,View:'View',Text:'Text',TextInput:'TextInput',ScrollView:'ScrollView',TouchableOpacity:'TouchableOpacity',ActivityIndicator:'ActivityIndicator',SafeAreaView:'SafeAreaView',
    Modal: props=>props.visible ? React.createElement('ModalContent',props,props.children) : null,
    FlatList: props=>React.createElement('FlatList',props,props.data.map(item=>React.createElement(React.Fragment,{key:props.keyExtractor(item)},props.renderItem({item})))),
    StyleSheet:{create:x=>x},Alert:{alert(){}},NativeModules:{},Linking:{},Share:{},RefreshControl:'RefreshControl'};
  const api={ apiGet:async(url,opts)=>{calls.push(['GET',url,opts]);return get(url,opts);},
    apiPost:async(url,body,opts)=>{calls.push(['POST',url,opts]);return {};}};
  function load(file) {
    const f=path.resolve(root,file); if(modules.has(f)) return modules.get(f).exports;
    const code=babel.transformSync(fs.readFileSync(f,'utf8'),{filename:f,babelrc:false,configFile:false,
      presets:[require.resolve('@babel/preset-react')],plugins:[require.resolve('@babel/plugin-transform-modules-commonjs')]}).code;
    const m={exports:{}};modules.set(f,m);
    const req=name=>{
      if(name==='react')return React;
      if(name==='react-native')return native;
      if(name==='@react-navigation/native')return {useIsFocused:()=>focus.value};
      if(name==='react-native-svg')return {__esModule:true,default:'Svg',Path:'Path'};
      if(name==='react-native-safe-area-context')return {SafeAreaView:'SafeAreaView',SafeAreaProvider:'SafeAreaProvider'};
      if(name.includes('react-native-vector-icons'))return ()=>null;
      if(name.startsWith('.')) {
        let target=path.resolve(path.dirname(f),name);if(!target.endsWith('.js'))target+='.js';
        if(target.endsWith('/AuthContext.js'))return {useAuth:()=>auth};
        if(target.endsWith('/SubscriptionContext.js'))return {useSubscription:()=>plan};
        if(target.endsWith('/theme/ThemeContext.js'))return {useTheme:()=>({colors:{},themeName:'light'})};
        if(target.endsWith('/lib/apiClient.js'))return api;
        if(target.endsWith('/ui/applyTypographyTokens.js'))return {applyTypographyTokens:x=>x};
        if(target.endsWith('/components/CocolonBackButton.js'))return ()=>null;
        if(target.endsWith('/components/CocolonButton.js'))return props=>React.createElement('TouchableOpacity',
          {...props,disabled:!!props.disabled||!!props.loading},React.createElement('Text',null,props.children??props.title));
        return load(path.relative(root,target));
      }
      return require(name);
    };
    Function('require','module','exports',code)(req,m,m.exports);return m.exports;
  }
  return {auth,plan,calls,load,focus,setAppState:next=>{appState.currentState=next;for(const listener of appListeners)listener(next);}};
}

test('cumulative admission binds profile, counts, artifact id and projection',()=>{
  assert.equal(contract.checkedCurrentResult(latest()).id,id(projection));
  for(const bad of [ {...latest(),source_profile:'period.v1'}, {...latest(),report_id:'bad'},
    {...latest(),map_context:{...counts,source_count:NaN}}, {...latest(),map_context:{...counts,source_count:4}} ]) {
    assert.throws(()=>contract.checkedCurrentResult(bad));
  }
  assert.equal(contract.checkedCurrentResult({ ...latest(), map_subscription_tier: null }).id, id(projection));
  assert.throws(() => contract.checkedCurrentResult({ ...latest(), map_subscription_tier: null, map_plan_scoped: true }));
});

test('Free reads the common full map and acknowledges only its displayed identity',async()=>{
  const h=harness(async()=>latest());const View=h.load('components/selfStructure/CumulativeWatashiMapView.js').default;const seen=[];
  let view;await act(async()=>{view=Renderer.create(React.createElement(View,{onLatestSeenVersion:x=>seen.push(x),embedded:true,hideHeader:true}));});
  assert(JSON.stringify(view.toJSON()).includes('watashi-map-v2'));
  assert.equal(view.root.findAllByType('ScrollView').length,0,'embedded map delegates vertical scrolling to its parent');
  assert.deepEqual(seen,[projection.projection_of]);
  assert(h.calls.every(c=>c[2].expectedUserId===owner));
  await act(async()=>view.unmount());
});

test('scoped Free renders the conclusion and at most one label-only figure for the same saved identity', async () => {
  for (const withFigure of [true, false]) {
    const free = planMap('free', withFigure);
    const h = harness(async () => ({ ...latest(free), ...scopedPlan('free') }));
    const Screen = h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
    const seen = [];
    let view;
    await act(async () => { view = Renderer.create(React.createElement(Screen, { onLatestSeenVersion: version => seen.push(version) })); });
    assert.equal(seen[0], free.projection_of);
    assert.equal(h.calls[0][2].headers['Cache-Control'], 'no-store');
    assert(JSON.stringify(view.toJSON()).includes(free.overview.primary_structures[0].description));
    assert.equal(view.root.findAllByProps({ testID: 'semantic-overview-open' }).length, 0);
    assert.equal(view.root.findAllByProps({ testID: 'semantic-overview-correction' }).length, 0);
    assert.equal(view.root.findAllByProps({ testID: 'semantic-items-toggle' }).length, 0);
    assert.equal(view.root.findAllByProps({ testID: 'semantic-structure-toggle-0' }).length, withFigure ? 1 : 0);
    if (withFigure) {
      await act(async () => view.root.findByProps({ testID: 'semantic-structure-toggle-0' }).props.onPress());
      const graph = view.root.findByProps({ testID: 'semantic-map-graph' });
      assert.equal(graph.findAllByType('TouchableOpacity').length, 0);
      assert(!JSON.stringify(view.toJSON()).includes(free.nodes[0].summary));
      const node = graph.findByProps({ testID: 'semantic-node-n1' });
      assert.equal(node.props.accessibilityLabel, free.nodes[0].title);
      assert.equal(node.props.onPress, undefined);
      assert.equal(node.props.onLongPress, undefined);
    }
    await act(async () => view.unmount());
  }
});

test('scoped paid maps keep node details without correction actions on current and monthly views', async () => {
  for (const tier of ['plus', 'premium']) {
    const map = planMap(tier);
    const stored = row('2026-10-01', map);
    const h = harness(async url => url.includes('/reports/')
      ? { item: stored, ...scopedPlan(tier) } : { ...latest(map), ...scopedPlan(tier) });
    h.plan.tier = tier;
    const Screen = h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
    for (const props of [{}, { reportId: stored.id, month: stored.snapshot_month }]) {
      let view;
      await act(async () => { view = Renderer.create(React.createElement(Screen, props)); });
      await act(async () => view.root.findByProps({ testID: 'semantic-structure-toggle-0' }).props.onPress());
      const node = view.root.findByProps({ testID: 'semantic-node-n1' });
      assert.match(node.props.accessibilityLabel, /詳しい説明を開く/);
      assert.doesNotMatch(node.props.accessibilityLabel, /訂正/);
      assert.equal(node.props.onLongPress, undefined);
      await act(async () => node.props.onPress());
      assert(JSON.stringify(view.toJSON()).includes(map.nodes[0].explanation));
      assert.equal(view.root.findAllByProps({ testID: 'semantic-correction-open' }).length, 0);
      assert.equal(view.root.findAllByProps({ testID: 'analysis-map-correction-dialog' }).length, 0);
      assert.equal(view.root.findAllByProps({ testID: 'semantic-if-open' }).length, tier === 'premium' && !props.reportId ? 1 : 0);
      await act(async () => view.unmount());
    }
  }
});

test('scoped current and monthly reads keep identity when no primary structure is supported', async () => {
  const message = '現時点の記録からは、選び方を支える条件をまだ確かめられていません。';
  const map = planMap('free', false);
  map.overview.primary_structures = [];
  map.overview.summary = message;
  const month = '2026-10-01';
  const stored = row(month, map);
  for (const tier of ['free', 'plus', 'premium']) {
    const current = { ...latest(map), ...scopedPlan(tier) };
    assert.equal(contract.checkedCurrentResult(current).id, stored.id);
    assert.throws(() => contract.checkedCurrentResult({ ...current, meta: { ...map,
      nodes: semantic.nodes, accessibility_linear_order: semantic.accessibility_linear_order } }));
    const h = harness(async url => url.includes('/reports/') ? { item: stored, ...scopedPlan(tier) } : current);
    const Screen = h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
    let view;
    await act(async () => { view = Renderer.create(React.createElement(Screen, { reportId: stored.id, month })); });
    assert(view.root.findAllByType('Text').some(node => node.props.children === message));
    await act(async () => button(view, '現在のマップと見比べる').props.onPress());
    assert.equal(view.root.findAllByType('Text').filter(node => node.props.children === message).length, 2);
    for (const testID of ['semantic-overview-open', 'semantic-overview-correction', 'semantic-map-graph', 'semantic-items-toggle']) {
      assert.equal(view.root.findAllByProps({ testID }).length, 0);
    }
    await act(async () => view.unmount());
  }
});

test('only Premium scope can open a grounded structure relationship in current and monthly maps', async () => {
  const map = planMap('premium');
  const first = map.overview.primary_structures[0].title;
  const second = '力を貸したいこと';
  const description = '資料の確認を引き受け、先に約束した提出を優先しました。';
  map.overview.primary_structures.push({ title: second, description: '資料の確認で力を貸しました。',
    scope: 'in_this_record', node_refs: ['n3'] });
  const relation = { kind: 'PRIORITY', first_index: 0, second_index: 1, description };
  map.overview.structure_relations = [relation];
  const current = { ...latest(map), ...scopedPlan('premium') };
  for (const tier of ['free', 'plus']) {
    assert.throws(() => contract.checkedCurrentResult({ ...current, ...scopedPlan(tier) }));
  }
  assert.throws(() => contract.checkedCurrentResult({ ...current, meta: { ...map,
    overview: { ...map.overview, structure_relations: [{ ...relation, second_index: 2 }] } } }));
  const month = '2026-10-01';
  const stored = row(month, map);
  const h = harness(async (url, options) => {
    assert.equal(options.headers['X-Watashi-Map-Structure-Relations'], 'v1');
    return url.includes('/reports/') ? { item: stored, ...scopedPlan('premium') } : current;
  });
  h.plan.tier = 'premium';
  const Screen = h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
  let view;
  await act(async () => { view = Renderer.create(React.createElement(Screen, { reportId: stored.id, month })); });
  const relations = view.root.findByProps({ testID: 'semantic-structure-relations' });
  assert(relations.findAllByType('Text').some(node => node.props.children === description));
  assert(relations.findByProps({ accessibilityLabel: `${first}を${second}より優先した関係` }));
  await act(async () => button(view, '現在のマップと見比べる').props.onPress());
  assert.equal(view.root.findAllByProps({ testID: 'semantic-structure-relations' }).length, 2);
  await act(async () => view.unmount());
});

test('the same report id is reread when the server observes a downgrade during a pending refresh', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const premium = planMap('premium');
  const free = planMap('free', false);
  const reread = deferred();
  const h = harness(async url => {
    if (url.endsWith('/latest/status')) return { status: 'ok', has_visible_content: true,
      version_key: free.projection_of, refresh_status: 'running', map_subscription_tier: 'free' };
    if (url.includes('ensure=false')) return reread.promise;
    return { ...latest(premium), ...scopedPlan('premium'), refresh_status: 'queued' };
  });
  h.plan.tier = 'premium';
  const Screen = h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
  let view;
  await act(async () => { view = Renderer.create(React.createElement(Screen)); });
  assert(JSON.stringify(view.toJSON()).includes(premium.overview.primary_structures[0].description));
  assert(view.root.findAllByProps({ testID: 'analysis-if-saved-open' }).length);
  await act(async () => { t.mock.timers.tick(3000); });
  assert(!JSON.stringify(view.toJSON()).includes(premium.overview.primary_structures[0].description));
  assert.equal(view.root.findAllByProps({ testID: 'analysis-if-saved-open' }).length, 0);
  await act(async () => reread.resolve({ ...latest(free), ...scopedPlan('free') }));
  assert.equal(id(premium), id(free));
  assert(JSON.stringify(view.toJSON()).includes(free.overview.primary_structures[0].description));
  await act(async () => view.unmount());
});

test('a monthly comparison can never display reports authorized at different tiers', async () => {
  const premium = planMap('premium');
  const free = planMap('free', false);
  const month = '2026-10-01';
  const stored = row(month, premium);
  const h = harness(async url => url.includes('/reports/')
    ? { item: stored, ...scopedPlan('premium') }
    : { ...latest(free), ...scopedPlan('free') });
  const Screen = h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
  let view;
  await act(async () => { view = Renderer.create(React.createElement(Screen, { reportId: stored.id, month })); });
  assert(JSON.stringify(view.toJSON()).includes(premium.overview.primary_structures[0].description));
  await act(async () => button(view,'現在のマップと見比べる').props.onPress());
  const displayed = JSON.stringify(view.toJSON());
  assert(!displayed.includes(premium.overview.primary_structures[0].description));
  assert(!displayed.includes(free.overview.primary_structures[0].description));
  assert(button(view, '再取得'));
  await act(async () => view.unmount());
});

test('a scoped paid reading returns from the background under a fresh entitlement check', async () => {
  const plus = planMap('plus');
  const free = planMap('free', false);
  const reread = deferred();
  let reads = 0;
  const h = harness(async () => ++reads === 1 ? { ...latest(plus), ...scopedPlan('plus') } : reread.promise);
  h.plan.tier = 'plus';
  const Screen = h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
  let view;
  await act(async () => { view = Renderer.create(React.createElement(Screen)); });
  assert(JSON.stringify(view.toJSON()).includes(plus.overview.primary_structures[0].description));
  await act(async () => h.setAppState('background'));
  await act(async () => h.setAppState('active'));
  assert(!JSON.stringify(view.toJSON()).includes(plus.overview.primary_structures[0].description));
  await act(async () => reread.resolve({ ...latest(free), ...scopedPlan('free') }));
  assert(JSON.stringify(view.toJSON()).includes(free.overview.primary_structures[0].description));
  await act(async () => view.unmount());
});

test('month comparison fetches current separately and preserves the captured projection',async()=>{
  const stored=row();const before=JSON.stringify(stored);const h=harness(async url=>url.includes('/reports/')?{item:stored}:latest());
  const View=h.load('components/selfStructure/CumulativeWatashiMapView.js').default;let view;
  await act(async()=>{view=Renderer.create(React.createElement(View,{reportId:stored.id,month:stored.snapshot_month}));});
  await act(async()=>button(view,'現在のマップと見比べる').props.onPress());
  const body=JSON.stringify(view.toJSON());assert(body.includes('当時：'));assert(body.includes('現在'));
  assert.equal(JSON.stringify(stored),before);
  assert(h.calls.some(c=>c[1].includes('month=2026-10-01')));
  assert(h.calls.some(c=>c[1].includes('/latest?ensure=true')));
  assert(!button(view,'再取得'),'a successful comparison does not need a retry');
  assert(h.calls.every(c=>!c[1].includes('force=true')),'monthly comparison never forces a fresh analysis');
  assert.equal(JSON.stringify(stored),before);
  await act(async()=>view.unmount());
});

test('month comparison puts both saved readings before the comparison controls, metadata and update status', async t => {
  const past = copy(semantic);
  past.overview.primary_structures = [{ title: '当時の選び方', description: 'その頃は返事を急いでいました。',
    scope: 'in_this_record', node_refs: [past.nodes[0].node_ref] }];
  const current = copy(past);
  current.projection_of = 'artifact:00000000000000000000000000000066@1';
  current.overview.primary_structures[0].title = '今の選び方';
  current.overview.primary_structures[0].description = '今は時間をおいてから返事をしています。';
  const stored = row('2026-10-01', past);
  for (const hasCurrent of [true, false]) {
    const result = hasCurrent ? latest(current) : { status: 'ok', source_profile: 'cumulative.v1', has_visible_content: false };
    const h = harness(async url => url.includes('/reports/') ? { item: stored } : { ...result, refresh_status: 'queued' });
    const View = h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
    let view;
    await act(async () => { view = Renderer.create(React.createElement(View, { reportId: stored.id, month: stored.snapshot_month })); });
    t.after(async () => act(async () => view.unmount()));
    await act(async () => button(view, '分析について').props.onPress());
    await act(async () => button(view, '現在のマップと見比べる').props.onPress());
    const nodes = view.root.findAllByType('Text');
    const messages = nodes.map(node => [node.props.children].flat().join(''));
    const [pastText, currentText] = [past, current].map(map => map.overview.primary_structures[0].description);
    const updateStatus = messages.findIndex(message => message.includes('更新中です。'));
    const compareControl = messages.indexOf('当時のマップだけを見る');
    const firstDate = messages.findIndex(message => message.startsWith('分析日時：'));
    assert(messages.indexOf(pastText) >= 0 && messages.indexOf(pastText) < compareControl);
    assert(compareControl < firstDate && firstDate < updateStatus);
    assert.equal(messages.includes(currentText), hasCurrent);
    assert.equal(messages.includes('現在の分析について'), hasCurrent);
    if (hasCurrent) {
      assert(messages.indexOf(pastText) < messages.indexOf(currentText));
      assert(messages.indexOf(currentText) < compareControl);
    }
    assert.equal(messages[updateStatus], `現在のわたしマップを更新中です。${hasCurrent
      ? '保存したマップを先に表示しています。' : '更新が終わると表示されます。'}`);
    assert.equal(messages.includes('2026年10月に保存した当時のマップ'), false);
  }
});

test('a temporary current comparison failure keeps the captured month and retries only on request',async()=>{
  const unavailable=[Object.assign(new Error('model unavailable'),{status:503}),
    Object.assign(new Error('model deadline'),{status:504}),
    Object.assign(new Error('request timed out'),{name:'TimeoutError'}),new TypeError('Network request failed')];
  for(const error of unavailable) {
    const stored=row(), before=JSON.stringify(stored);let currentCalls=0;
    const currentProjection=copy(projection);currentProjection.projection_of='artifact:00000000000000000000000000000066@1';
    currentProjection.nodes[0].visible_label='RETRIED_CURRENT_MAP';
    const h=harness(async url=>{
      if(url.includes('/reports/'))return {item:stored};
      currentCalls+=1;if(currentCalls===1)throw error;
      return latest(currentProjection);
    });
    const View=h.load('components/selfStructure/CumulativeWatashiMapView.js').default;let view;
    await act(async()=>{view=Renderer.create(React.createElement(View,{reportId:stored.id,month:stored.snapshot_month}));});
    await act(async()=>button(view,'現在のマップと見比べる').props.onPress());
    const failedBody=JSON.stringify(view.toJSON());
    assert(failedBody.includes('当時：'));
    assert(failedBody.includes(projection.nodes[0].visible_label));
    assert(failedBody.includes('現在のマップを取得できませんでした。'));
    assert(!failedBody.includes('マップを取得できませんでした。通信状況や現在の閲覧範囲を確認して、再取得してください。'));
    assert.equal(view.root.findAllByProps({testID:'watashi-map-v2'}).length,1);
    await act(async()=>{});assert.equal(currentCalls,1);
    await act(async()=>button(view,'再取得').props.onPress());
    const retriedBody=JSON.stringify(view.toJSON());
    assert(retriedBody.includes('RETRIED_CURRENT_MAP'));
    assert(!retriedBody.includes('現在のマップを取得できませんでした。'));
    assert.equal(view.root.findAllByProps({testID:'watashi-map-v2'}).length,2);
    assert.equal(currentCalls,2);assert.equal(JSON.stringify(stored),before);
    assert(h.calls.every(c=>c[2].expectedUserId===owner));
    await act(async()=>view.unmount());
  }
});

test('comparison authorization failures and invalid current content do not retain the captured month',async()=>{
  for(const outcome of [Object.assign(new Error('unauthorized'),{status:401}),
    Object.assign(new Error('forbidden'),{status:403}),Object.assign(new Error('account changed'),{name:'AccountChangedError'}),
    {...latest(),report_id:'invalid'}]) {
    const stored=row();const h=harness(async url=>{
      if(url.includes('/reports/'))return {item:stored};
      if(outcome instanceof Error)throw outcome;
      return outcome;
    });
    const View=h.load('components/selfStructure/CumulativeWatashiMapView.js').default;let view;
    await act(async()=>{view=Renderer.create(React.createElement(View,{reportId:stored.id,month:stored.snapshot_month}));});
    await act(async()=>button(view,'現在のマップと見比べる').props.onPress());
    const body=JSON.stringify(view.toJSON());
    assert(body.includes('現在の閲覧範囲を確認して、再取得してください。'));
    assert.equal(view.root.findAllByProps({testID:'watashi-map-v2'}).length,0);
    await act(async()=>view.unmount());
  }
});

test('an obsolete comparison failure cannot restore the previous owner month',async()=>{
  const pending=deferred(),stored=row();const nextOwner='00000000-0000-0000-0000-000000000002';
  const h=harness(async(url,opts)=>{
    if(opts.expectedUserId===nextOwner)throw Object.assign(new Error('new owner unavailable'),{status:401});
    return url.includes('/reports/')?{item:stored}:pending.promise;
  });
  const View=h.load('components/selfStructure/CumulativeWatashiMapView.js').default;let view;
  const props={reportId:stored.id,month:stored.snapshot_month};
  await act(async()=>{view=Renderer.create(React.createElement(View,props));});
  await act(async()=>{button(view,'現在のマップと見比べる').props.onPress();});
  h.auth.session.user.id=nextOwner;
  await act(async()=>view.update(React.createElement(View,props)));
  await act(async()=>pending.reject(Object.assign(new Error('old model unavailable'),{status:503})));
  const body=JSON.stringify(view.toJSON());
  assert(!body.includes(projection.nodes[0].visible_label));
  assert(!body.includes('当時のマップは保存されています。再取得で確認できます。'));
  assert.equal(view.root.findAllByProps({testID:'watashi-map-v2'}).length,0);
  await act(async()=>view.unmount());
});

test('owner/tier change hides old map and rejects its delayed response',async()=>{
  const pending=deferred();let n=0;const h=harness(()=>++n===1?pending.promise:latest());
  const View=h.load('components/selfStructure/CumulativeWatashiMapView.js').default;const seen=[];const props={onLatestSeenVersion:x=>seen.push(x)};let view;
  await act(async()=>{view=Renderer.create(React.createElement(View,props));});
  h.auth.session.user.id='00000000-0000-0000-0000-000000000002';h.plan.tier='plus';
  await act(async()=>view.update(React.createElement(View,props)));
  const obsolete=copy(projection);obsolete.nodes[0].visible_label='OBSOLETE_OWNER_VALUE';
  await act(async()=>pending.resolve(latest(obsolete)));
  assert(!JSON.stringify(view.toJSON()).includes('OBSOLETE_OWNER_VALUE'));
  assert.deepEqual(seen,[projection.projection_of]);
  await act(async()=>view.unmount());
});

test('current and monthly readers retain the saved analysis without an original-record entrance or fetch', async () => {
  for (const historical of [false, true]) {
    const stored = row();
    const h = harness(async url => url.includes('/reports/') ? { item: stored } : latest());
    const View = h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
    const props = historical ? { reportId: stored.id, month: stored.snapshot_month } : {};
    let view;
    await act(async () => { view = Renderer.create(React.createElement(View, props)); });
    assert(JSON.stringify(view.toJSON()).includes(projection.nodes[0].visible_label));
    assert.equal(button(view, '根拠の記録を見る'), undefined);
    assert(h.calls.every(call => !call[1].includes('/evidence')));
    await act(async () => view.unmount());
  }
});

test('history opens only the most recently selected month',async()=>{
  const a=deferred(),b=deferred();const rows=[row('2026-10-01'),row('2026-09-01')];
  const h=harness(url=>url.includes('/history')?{items:rows,has_more:false}:url.includes('2026-10-01')?a.promise:b.promise);
  const History=h.load('screens/SelfStructureReportHistoryScreen.js').default;let view;const opened=[];
  await act(async()=>{view=Renderer.create(React.createElement(History,{onOpenReport:x=>opened.push(x)}));});
  await act(async()=>{button(view,'2026年10月').props.onPress();});
  await act(async()=>{button(view,'2026年9月').props.onPress();});
  await act(async()=>b.resolve({item:rows[1]}));await act(async()=>a.resolve({item:rows[0]}));
  assert.deepEqual(opened.map(x=>x.snapshot_month),['2026-09-01']);
  assert.equal(opened[0].content_json, undefined);
  assert(h.calls.every(c=>c[2].expectedUserId===owner));
  await act(async()=>view.unmount());
});

test('history pagination replaces the list when the server changes membership tier', async () => {
  const before = row('2026-02-01');
  const after = row('2026-10-01');
  let originReads = 0;
  const h = harness(async url => {
    if (url.includes('offset=1')) return { items: [], has_more: false, subscription_tier: 'free' };
    if (++originReads === 1) return { items: [before], has_more: true, next_offset: 1, subscription_tier: 'premium' };
    return { items: [after], has_more: false, subscription_tier: 'free' };
  });
  h.plan.tier = 'premium';
  const History = h.load('screens/SelfStructureReportHistoryScreen.js').default;
  let view;
  await act(async () => { view = Renderer.create(React.createElement(History)); });
  assert(button(view, '2026年2月'));
  const footer = view.root.findByType('FlatList').props.ListFooterComponent;
  await act(async () => footer.props.onPress());
  assert(!button(view, '2026年2月'));
  assert(button(view, '2026年10月'));
  assert.equal(originReads, 2);
  await act(async () => view.unmount());
});

test('Free monthly access does not unlock the existing paid PDF export',()=>{
  const h=harness(()=>({}));const policy=h.load('components/selfStructure/watashiMapAccessPolicy.js');
  assert.equal(policy.canViewWatashiMapHistory('free'),true);
  assert.equal(policy.getWatashiMapHistoryLimit('free'),2);assert.equal(policy.getWatashiMapHistoryLimit('plus'),12);
  assert.equal(policy.getWatashiMapHistoryLimit('premium'),null);
  assert.equal(policy.canExportWatashiMapPdf('free'),false);
});

test('semantic renderer is negotiated with owner binding and processing metadata starts collapsed',async()=>{
  const result={...latest(semantic),map_context:{...counts,processed_count:4,mapped_count:3,unparsed_count:1,excluded_count:1}};
  const h=harness(async()=>result);
  const Screen=h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
  let guideOpens=0;
  let view;await act(async()=>{view=Renderer.create(React.createElement(Screen,{embedded:true,hideHeader:true,onOpenGuide:()=>guideOpens++}));});
  assert.equal(view.root.findAllByProps({testID:'watashi-map-v3'}).length,1);
  assert(JSON.stringify(view.toJSON()).includes(semantic.overview.title));
  assert(!JSON.stringify(view.toJSON()).includes('対象：感情入力の記録'));
  assert(!JSON.stringify(view.toJSON()).includes('根拠として結び付いた記録'));
  const latestCall=h.calls.find(c=>c[1].includes('/latest?ensure=true'));
  assert.equal(latestCall[2].headers['X-Watashi-Map-Renderer'],'semantic.v3');
  assert.equal(latestCall[2].timeoutMs,15000);
  assert(latestCall[1].includes('background=true'));
  assert.equal(latestCall[2].expectedUserId,owner);
  assert.equal(h.calls.length,1);
  assert(!button(view,'分析の使い方を見る'));
  await act(async()=>button(view,'分析について').props.onPress());
  const about=JSON.stringify(view.toJSON());
  assert(about.includes('対象の記録5件／根拠として結び付いた記録3件'));
  assert(about.includes('図に結び付けていない記録1件／分析に使っていない記録1件'));
  assert(!about.includes('構造に反映できた記録'));
  assert(!about.includes('未解析の範囲'));
  button(view,'分析の使い方を見る').props.onPress();
  assert.equal(guideOpens,1);
  await act(async()=>view.unmount());
});

test('current and monthly maps open with the saved structure text and keep supplementary details available', async () => {
  const map = copy(semantic);
  const [selected, supplemental] = map.nodes;
  map.overview.primary_structures = [{ title: '確かめる時間', description: '自分で一度確かめてから選んでいます。',
    scope: 'in_this_record', node_refs: [selected.node_ref] }];
  const structure = map.overview.primary_structures[0];
  for (const month of [null, '2026-10-01']) {
    const stored = row(month, map);
    const h = harness(async (url, opts) => {
      assert.equal(opts.expectedUserId, owner);
      assert.equal(requestedRenderer(opts), 'semantic.v3');
      if (month) {
        assert(url.endsWith(`/reports/${stored.id}?month=${month}`));
        return { item: stored };
      }
      assert(url.endsWith('/latest?ensure=true&background=true'));
      return { ...latest(map), refresh_status: 'failed' };
    });
    const Screen = h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
    let view;
    await act(async () => { view = Renderer.create(React.createElement(Screen, month ? { reportId: stored.id, month } : {})); });
    const visibleTexts = view.root.findAllByType('Text').map(node => node.props.children);
    assert(visibleTexts.indexOf(structure.title) >= 0);
    assert(visibleTexts.includes(structure.description));
    if (month) assert(visibleTexts.indexOf(structure.description) < visibleTexts.indexOf('現在のマップと見比べる'));
    else {
      const refreshError = visibleTexts.indexOf('更新結果を取得できませんでした。更新を再試行できます。');
      assert(refreshError > visibleTexts.indexOf(structure.description));
      assert(button(view, '更新を再試行'));
    }
    assert.equal(view.root.findAllByProps({ testID: 'semantic-map-graph' }).length, 0);
    await act(async () => view.root.findByProps({ testID: 'semantic-structure-toggle-0' }).props.onPress());
    const visibleGraph = view.root.findByProps({ testID: 'semantic-map-graph' });
    assert.deepEqual(visibleGraph.findAllByType('TouchableOpacity').map(node => node.props.testID),
      [`semantic-node-${selected.node_ref}`]);
    await act(async () => visibleGraph.findByProps({ testID: `semantic-node-${selected.node_ref}` }).props.onPress());
    const modal = view.root.findByType('ModalContent');
    assert(modal.findAllByType('Text').some(node => node.props.children === selected.explanation));
    await act(async () => modal.props.onRequestClose());
    assert(!view.root.findAllByProps({ testID: `semantic-node-${supplemental.node_ref}` }).length);
    await act(async () => view.root.findByProps({ testID: 'semantic-items-toggle' }).props.onPress());
    await act(async () => view.root.findByProps({ testID: `semantic-node-${supplemental.node_ref}` }).props.onPress());
    const supplementalDetail = view.root.findByType('ModalContent');
    assert(supplementalDetail.findAllByType('Text').some(node => node.props.children === supplemental.explanation));
    assert.equal(supplementalDetail.findAllByProps({ testID: 'semantic-correction-open' }).length, 0);
    assert(!JSON.stringify(view.toJSON()).includes('根拠の記録を見る'));
    assert.deepEqual(h.calls.map(([verb, url]) => [verb, url.includes('/evidence')]),
      month ? [['GET', false], ['POST', false]] : [['GET', false]]);
    await act(async () => view.unmount());
  }
});

test('an older renderer restores relationships by reading the same current report without another ensure',async()=>{
  const saved = downgrade(semantic);
  const h = harness(async (url, opts) => {
    if (requestedRenderer(opts) === 'semantic.v3') return latest(saved);
    assert(url.endsWith(`/reports/${id(saved)}`));
    // An ID can be both the latest and the month's snapshot. Keep latest metadata.
    return { item: row('2026-11-01', semantic) };
  });
  const Screen = h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
  const seen = [];
  let view;
  await act(async()=>{view=Renderer.create(React.createElement(Screen,{onLatestSeenVersion:x=>seen.push(x)}));});
  assert.equal(view.root.findAllByProps({testID:'watashi-map-v3'}).length,1);
  assert.equal(view.root.findAllByProps({ testID: 'semantic-map-graph' }).length, 0);
  await act(async () => view.root.findByProps({ testID: 'semantic-items-toggle' }).props.onPress());
  assert(JSON.stringify(view.toJSON()).includes(semantic.edges[0].label));
  await act(async()=>button(view,'分析について').props.onPress());
  assert(!JSON.stringify(view.toJSON()).includes('月次保存日時'));
  assert.deepEqual(h.calls.map(c=>requestedRenderer(c[2])),['semantic.v3','semantic.v2']);
  assert.equal(h.calls.filter(c=>c[1].includes('ensure=true')).length,1);
  assert(h.calls.every(c=>c[2].expectedUserId===owner));
  assert.deepEqual(seen,[saved.projection_of]);
  await act(async()=>view.unmount());
});

test('current and monthly maps show a validated legacy body while the same saved report restores its graph', async () => {
  for (const month of [null, '2026-10-01']) {
    const pending = deferred();
    const legacy = downgrade(semantic);
    const stored = row(month, legacy);
    const h = harness(async (url, opts) => {
      assert.equal(opts.expectedUserId, owner);
      if (requestedRenderer(opts) === 'semantic.v1') {
        assert(url.endsWith(`/reports/${stored.id}${month ? `?month=${month}` : ''}`));
        return pending.promise;
      }
      return month || requestedRenderer(opts) === 'semantic.v2'
        ? { item: stored } : { ...latest(legacy), refresh_status: 'queued' };
    });
    const Screen = h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
    const seen = [];
    const props = month ? { reportId: stored.id, month } : { onLatestSeenVersion: version => seen.push(version) };
    let view;
    await act(async () => { view = Renderer.create(React.createElement(Screen, props)); });
    assert.equal(view.root.findAllByProps({ testID: 'watashi-map-v2' }).length, 1);
    assert(JSON.stringify(view.toJSON()).includes(JSON.stringify(legacy.nodes[0].visible_label).slice(1, -1)));
    assert(!JSON.stringify(view.toJSON()).includes('semantic-map-graph'));
    assert.equal(view.root.findAllByType('ActivityIndicator').length, 0);
    assert.equal(h.calls.filter(([verb]) => verb === 'POST').length, 0);
    assert.deepEqual(seen, []);
    if (!month) assert(JSON.stringify(view.toJSON()).includes('保存したマップを先に表示しています。'));
    await act(async () => pending.resolve({ item: row(month, semantic) }));
    assert.equal(view.root.findAllByProps({ testID: 'watashi-map-v3' }).length, 1);
    assert.equal(view.root.findAllByProps({ testID: 'watashi-map-v2' }).length, 0);
    assert.equal(h.calls.filter(([verb]) => verb === 'GET').length, 3);
    assert.equal(h.calls.filter(([verb]) => verb === 'POST').length, month ? 1 : 0);
    assert.deepEqual(seen, month ? [] : [semantic.projection_of]);
    await act(async () => view.unmount());
  }
});

test('semantic fallback keeps the selected history month separate from its current comparison',async()=>{
  const month = '2026-10-01';
  const archive = copy(semantic);
  archive.projection_of = 'artifact:00000000000000000000000000000066@1';
  archive.overview.title = '保存月の分析';
  const h = harness(async (url, opts) => {
    const old = requestedRenderer(opts) !== 'semantic.v1';
    if (url.includes('/latest?')) return latest(downgrade(semantic));
    if (url.endsWith(`/reports/${id(archive)}?month=${month}`)) {
      return { item: row(month, old ? downgrade(archive) : archive) };
    }
    assert(url.endsWith(`/reports/${id(semantic)}`));
    return { item: row(null, old ? downgrade(semantic) : semantic) };
  });
  const Screen = h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
  let view;
  await act(async()=>{view=Renderer.create(React.createElement(Screen,{reportId:id(archive),month}));});
  await act(async()=>button(view,'現在のマップと見比べる').props.onPress());
  const requests = h.calls.filter(c=>c[0]==='GET' && requestedRenderer(c[2])==='semantic.v1');
  assert.deepEqual(requests.map(c=>c[1].split('/reports/')[1]),
    [`${id(archive)}?month=${month}`,`${id(archive)}?month=${month}`,id(semantic)]);
  const displayed=JSON.stringify(view.toJSON());
  assert(displayed.includes(archive.overview.title) && displayed.includes(semantic.overview.title));
  assert(h.calls.filter(c=>c[0]==='GET').every(c=>!c[1].includes('force=true')));
  await act(async()=>view.unmount());
});

test('semantic fallback keeps a transiently unavailable legacy map and clears it on access or identity failure',async()=>{
  for (const failure of ['transient', 'unauthorized', 'identity']) {
    const pending = deferred();
    const h = harness(async (url, opts) => {
      if (requestedRenderer(opts)==='semantic.v3') return latest(downgrade(semantic));
      return pending.promise;
    });
    const Screen = h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
    let view;
    await act(async()=>{view=Renderer.create(React.createElement(Screen));});
    assert.equal(view.root.findAllByProps({testID:'watashi-map-v2'}).length,1);
    const transient = failure === 'transient';
    if (failure === 'identity') {
      const different=copy(semantic);
      different.projection_of='artifact:00000000000000000000000000000066@1';
      await act(async () => pending.resolve({item:row(null,different)}));
    } else {
      const status = transient ? 503 : 403;
      await act(async () => pending.reject(Object.assign(new Error(failure), {status})));
    }
    assert.equal(h.calls.filter(c=>c[0]==='GET').length,2);
    assert.equal(view.root.findAllByProps({testID:'watashi-map-v3'}).length,0);
    assert.equal(view.root.findAllByProps({testID:'watashi-map-v2'}).length,transient?1:0);
    assert.equal(Boolean(button(view,'再取得')),!transient);
    await act(async()=>view.unmount());
  }
});

test('status polling negotiates an older renderer only when reading a newly saved version',async t=>{
  t.mock.timers.enable({apis:['setTimeout']});
  const next=copy(semantic);
  next.projection_of='artifact:00000000000000000000000000000066@1';
  next.overview.title='更新完了後の分析';
  let checks=0;
  const h=harness(async (url, opts)=>{
    if (url.endsWith('/latest/status')) {
      checks+=1;
      return {status:'ok',has_visible_content:true,version_key:(checks===1?semantic:next).projection_of,
        refresh_status:checks===1?'running':null};
    }
    if (requestedRenderer(opts)==='semantic.v1') {
      return {item:row(null,url.endsWith(id(next))?next:semantic)};
    }
    if (requestedRenderer(opts)==='semantic.v2') {
      return {item:row(null,downgrade(url.endsWith(id(next))?next:semantic))};
    }
    return url.endsWith('?ensure=false&background=true')?latest(downgrade(next)):
      {...latest(downgrade(semantic)),refresh_status:'queued'};
  });
  const Screen=h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
  let view;
  await act(async()=>{view=Renderer.create(React.createElement(Screen));});
  await act(async()=>{t.mock.timers.tick(3000);});
  assert.equal(h.calls.filter(c=>requestedRenderer(c[2])==='semantic.v1').length,1);
  await act(async()=>{t.mock.timers.tick(3000);});
  assert.deepEqual(h.calls.filter(c=>requestedRenderer(c[2])==='semantic.v1').map(c=>c[1].split('/reports/')[1]),
    [id(semantic),id(next)]);
  assert.equal(h.calls.filter(c=>c[1].includes('ensure=true')).length,1);
  assert.equal(h.calls.filter(c=>c[1].endsWith('?ensure=false&background=true')).length,1);
  assert(JSON.stringify(view.toJSON()).includes(next.overview.title));
  await act(async()=>view.unmount());
});

test('an ownership change aborts the old renderer fallback and ignores its late result',async()=>{
  const pending=deferred();
  const nextOwner='00000000-0000-0000-0000-000000000008';
  const next=copy(semantic);
  next.projection_of='artifact:00000000000000000000000000000066@1';
  next.overview.title='新しい所有者の分析';
  const h=harness(async (url, opts)=>{
    if (requestedRenderer(opts)==='semantic.v2') return pending.promise;
    return opts.expectedUserId===owner?latest(downgrade(semantic)):latest(next);
  });
  const Screen=h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
  const seen=[];
  const element=()=>React.createElement(Screen,{onLatestSeenVersion:x=>seen.push(x)});
  let view;
  await act(async()=>{view=Renderer.create(element());});
  assert.equal(view.root.findAllByProps({testID:'watashi-map-v2'}).length,1);
  assert.deepEqual(seen,[]);
  const previousFallback=h.calls.find(c=>requestedRenderer(c[2])==='semantic.v2')[2];
  assert.equal(previousFallback.signal.aborted,false);
  h.auth.session={user:{id:nextOwner}};
  await act(async()=>view.update(element()));
  assert.equal(previousFallback.signal.aborted,true);
  await act(async()=>pending.resolve({item:row(null,semantic)}));
  const displayed=JSON.stringify(view.toJSON());
  assert(displayed.includes(next.overview.title));
  assert(!displayed.includes(semantic.overview.title));
  assert.deepEqual(seen,[next.projection_of]);
  await act(async()=>view.unmount());
});

test('current analysis opens automatically and has no routine update button',async()=>{
  const empty={...latest(),report_id:null,has_visible_content:false,meta:null,map_context:null};
  for(const data of [latest(),empty]) {
    const h=harness(async()=>data);
    const Screen=h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
    let view;await act(async()=>{view=Renderer.create(React.createElement(Screen,{embedded:true,hideHeader:true}));});
    assert(!button(view,'分析を更新'));
    assert(!button(view,'更新を再試行'));
    assert(!button(view,'再取得'));
    assert.equal(h.calls.length,1);
    assert(h.calls[0][1].endsWith('?ensure=true&background=true'));
    assert.equal(h.calls[0][2].expectedUserId,owner);
    assert.equal(h.calls[0][2].headers['X-Watashi-Map-Renderer'],'semantic.v3');
    await act(async()=>view.unmount());
  }
});

test('a failed update can be retried while a previously saved map remains visible',async()=>{
  let currentCalls=0;
  const h=harness(async()=>++currentCalls===1?{...latest(),refresh_status:'failed'}:latest());
  const Screen=h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
  let view;await act(async()=>{view=Renderer.create(React.createElement(Screen));});
  assert(JSON.stringify(view.toJSON()).includes(projection.nodes[0].visible_label));
  await act(async()=>button(view,'更新を再試行').props.onPress());
  assert.equal(h.calls.length,2);
  assert(h.calls[1][1].endsWith('?ensure=true&background=true&force=true'));
  assert.equal(h.calls[1][2].expectedUserId,owner);
  assert.equal(h.calls[1][2].headers['X-Watashi-Map-Renderer'],'semantic.v3');
  assert(!button(view,'更新を再試行'));
  await act(async()=>view.unmount());
});

test('a transport error can be retried without forcing an update',async()=>{
  let currentCalls=0;
  const h=harness(async()=>{
    if(++currentCalls===1)throw new TypeError('Network request failed');
    return latest();
  });
  const Screen=h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
  let view;await act(async()=>{view=Renderer.create(React.createElement(Screen));});
  assert(!button(view,'更新を再試行'));
  await act(async()=>button(view,'再取得').props.onPress());
  assert.equal(h.calls.length,2);
  assert(h.calls[1][1].endsWith('?ensure=true&background=true'));
  assert(!button(view,'再取得'));
  await act(async()=>view.unmount());
});

test('a queued update displays the saved map immediately and rereads only the completed saved version',async t=>{
  t.mock.timers.enable({apis:['setTimeout']});
  const next=copy(projection);next.projection_of='artifact:00000000000000000000000000000066@1';next.nodes[0].visible_label='BACKGROUND_COMPLETED_MAP';
  let checks=0;
  const h=harness(async url=>url.endsWith('/latest/status')
    ? {status:'ok',version_key:++checks===1?projection.projection_of:next.projection_of,has_visible_content:true,refresh_status:checks===1?'running':null}
    : url.endsWith('?ensure=false&background=true')?latest(next):{...latest(),refresh_status:'queued'});
  const Screen=h.load('components/selfStructure/CumulativeWatashiMapView.js').default;let view;
  await act(async()=>{view=Renderer.create(React.createElement(Screen));});
  assert(JSON.stringify(view.toJSON()).includes(projection.nodes[0].visible_label));
  assert(JSON.stringify(view.toJSON()).includes('保存したマップを先に表示しています。'));
  assert.equal(view.root.findAllByType('ActivityIndicator').length,0);
  assert.equal(h.calls.filter(c=>c[1].includes('ensure=true')).length,1);
  assert(h.calls.find(c=>c[1].includes('ensure=true'))[1].includes('background=true'));
  await act(async()=>{t.mock.timers.tick(3000);});
  assert.equal(checks,1);assert(!JSON.stringify(view.toJSON()).includes('BACKGROUND_COMPLETED_MAP'));
  await act(async()=>{t.mock.timers.tick(3000);});
  assert(JSON.stringify(view.toJSON()).includes('BACKGROUND_COMPLETED_MAP'));
  assert(!JSON.stringify(view.toJSON()).includes('わたしマップを更新中です。'));
  assert.equal(h.calls.filter(c=>c[1].includes('ensure=true')).length,1,'polling must never start another model job');
  assert.equal(h.calls.filter(c=>c[1].endsWith('?ensure=false&background=true')).length,1);
  assert(h.calls.every(c=>c[2].expectedUserId===owner));
  await act(async()=>view.unmount());
});

test('an empty queued map waits without a blank-result error and offers explicit retry after failure',async t=>{
  t.mock.timers.enable({apis:['setTimeout']});
  const empty={...latest(),report_id:null,has_visible_content:false,meta:null,content_text:null,map_context:null,refresh_status:'queued'};
  const h=harness(async url=>url.endsWith('/latest/status')?{status:'ok',version_key:null,has_visible_content:false,refresh_status:'failed'}:empty);
  const Screen=h.load('components/selfStructure/CumulativeWatashiMapView.js').default;let view;
  await act(async()=>{view=Renderer.create(React.createElement(Screen));});
  assert(JSON.stringify(view.toJSON()).includes('更新が終わると表示されます。'));
  assert(!JSON.stringify(view.toJSON()).includes('現在表示できるわたしマップはありません。'));
  await act(async()=>{t.mock.timers.tick(3000);});
  assert(JSON.stringify(view.toJSON()).includes('更新結果を取得できませんでした。'));
  assert(button(view,'更新を再試行'));
  await act(async()=>button(view,'更新を再試行').props.onPress());
  assert(h.calls.at(-1)[1].endsWith('?ensure=true&background=true&force=true'));
  await act(async()=>view.unmount());
});

test('refresh polling stops off-screen and in the background and checks saved state again on return',async t=>{
  t.mock.timers.enable({apis:['setTimeout']});
  const h=harness(async url=>url.endsWith('/latest/status')
    ?{status:'ok',version_key:projection.projection_of,has_visible_content:true,refresh_status:'running'}
    :{...latest(),refresh_status:'running'});
  const Screen=h.load('components/selfStructure/CumulativeWatashiMapView.js').default;let view;
  await act(async()=>{view=Renderer.create(React.createElement(Screen));});
  await act(async()=>h.setAppState('background'));
  const before=h.calls.length;
  await act(async()=>{t.mock.timers.tick(9000);});
  assert.equal(h.calls.length,before);
  await act(async()=>h.setAppState('active'));
  assert.equal(h.calls.length,before+1,'returning foreground must revalidate the saved map');
  h.focus.value=false;
  await act(async()=>view.update(React.createElement(Screen)));
  const blurred=h.calls.length;
  await act(async()=>{t.mock.timers.tick(9000);});
  assert.equal(h.calls.length,blurred);
  h.focus.value=true;
  await act(async()=>view.update(React.createElement(Screen)));
  assert.equal(h.calls.length,blurred+1);
  await act(async()=>view.unmount());
});

test('an old owner status response cannot replace the next owner map or report its failure',async t=>{
  t.mock.timers.enable({apis:['setTimeout']});
  const pending=deferred(),nextOwner='00000000-0000-0000-0000-000000000002';
  const next=copy(projection);next.projection_of='artifact:00000000000000000000000000000066@1';next.nodes[0].visible_label='NEXT_OWNER_SAVED_MAP';
  const h=harness(async(url,opts)=>url.endsWith('/latest/status')?pending.promise
    :opts.expectedUserId===nextOwner?latest(next):{...latest(),refresh_status:'running'});
  const Screen=h.load('components/selfStructure/CumulativeWatashiMapView.js').default;let view;
  await act(async()=>{view=Renderer.create(React.createElement(Screen));});
  await act(async()=>{t.mock.timers.tick(3000);});
  h.auth.session.user.id=nextOwner;
  await act(async()=>view.update(React.createElement(Screen)));
  await act(async()=>pending.resolve({status:'ok',version_key:projection.projection_of,has_visible_content:true,refresh_status:'failed'}));
  const body=JSON.stringify(view.toJSON());
  assert(body.includes('NEXT_OWNER_SAVED_MAP'));
  assert(!body.includes('更新結果を取得できませんでした。'));
  assert(!body.includes(projection.nodes[0].visible_label));
  await act(async()=>view.unmount());
});

test('an invalidated saved map clears immediately and keeps polling until its background replacement is saved',async t=>{
  t.mock.timers.enable({apis:['setTimeout']});
  const empty={...latest(),report_id:null,has_visible_content:false,meta:null,content_text:null,map_context:null,refresh_status:'running'};
  const next=copy(projection);next.projection_of='artifact:00000000000000000000000000000066@1';next.nodes[0].visible_label='SAVED_AFTER_INVALIDATION';
  let checks=0,reads=0;
  const h=harness(async url=>url.endsWith('/latest/status')
    ?++checks===1?{status:'ok',version_key:null,has_visible_content:false,refresh_status:'running'}
      :{status:'ok',version_key:next.projection_of,has_visible_content:true,refresh_status:null}
    :url.endsWith('?ensure=false&background=true')?++reads===1?empty:latest(next):{...latest(),refresh_status:'running'});
  const Screen=h.load('components/selfStructure/CumulativeWatashiMapView.js').default;let view;
  await act(async()=>{view=Renderer.create(React.createElement(Screen));});
  assert(JSON.stringify(view.toJSON()).includes(projection.nodes[0].visible_label));
  await act(async()=>{t.mock.timers.tick(3000);});
  assert.equal(view.root.findAllByProps({testID:'watashi-map-v2'}).length,0);
  assert(JSON.stringify(view.toJSON()).includes('更新が終わると表示されます。'));
  assert.equal(reads,1);
  await act(async()=>{t.mock.timers.tick(3000);});
  assert.equal(checks,2);assert.equal(reads,2);
  assert(JSON.stringify(view.toJSON()).includes('SAVED_AFTER_INVALIDATION'));
  assert(!JSON.stringify(view.toJSON()).includes('わたしマップを更新中です。'));
  assert.equal(h.calls.filter(c=>c[1].includes('ensure=true')).length,1,'replacement polling cannot enqueue another job');
  await act(async()=>view.unmount());
});
