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
const contract = require('../components/selfStructure/cumulativeMapContract');
const copy = x => JSON.parse(JSON.stringify(x));
const owner = '00000000-0000-0000-0000-000000000001';
const id = p => { const s=p.projection_of.split(':')[1].split('@')[0]; return `${s.slice(0,8)}-${s.slice(8,12)}-${s.slice(12,16)}-${s.slice(16,20)}-${s.slice(20)}`; };
const counts = { profile:'cumulative.v1', source_count:5, processed_count:5, mapped_count:5, unparsed_count:0, excluded_count:0, stale_supplement_count:0 };
function latest(p=projection) { return { status:'ok', reason:'up_to_date', has_visible_content:true, source_profile:'cumulative.v1',
  report_id:id(p), generated_at:'2026-11-01T00:00:00Z', meta:p, map_context:counts }; }
function row(month='2026-10-01', p=projection) { return { id:id(p), snapshot_month:month, source_profile:'cumulative.v1',
  content_json:{watashiMap:p,map_context:counts}, generated_at:'2026-10-10T00:00:00Z',captured_at:'2026-10-10T00:00:00Z' }; }
function deferred() { let resolve,reject; const promise=new Promise((r,j)=>{resolve=r;reject=j;}); return {promise,resolve,reject}; }
function button(render,label) { return render.root.findAllByType('TouchableOpacity').find(n=>n.findAllByType('Text').some(t=>String(t.props.children).includes(label))); }
function harness(get) {
  const auth={session:{user:{id:owner}}}, plan={tier:'free',loading:false}, calls=[];
  const modules=new Map();
  const native={View:'View',Text:'Text',ScrollView:'ScrollView',TouchableOpacity:'TouchableOpacity',ActivityIndicator:'ActivityIndicator',SafeAreaView:'SafeAreaView',
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
  return {auth,plan,calls,load};
}

test('cumulative admission binds profile, counts, artifact id and projection',()=>{
  assert.equal(contract.checkedCurrentResult(latest()).id,id(projection));
  for(const bad of [ {...latest(),source_profile:'period.v1'}, {...latest(),report_id:'bad'},
    {...latest(),map_context:{...counts,source_count:NaN}}, {...latest(),map_context:{...counts,source_count:4}} ]) {
    assert.throws(()=>contract.checkedCurrentResult(bad));
  }
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

test('month comparison fetches current separately and preserves the captured projection',async()=>{
  const stored=row();const before=JSON.stringify(stored);const h=harness(async url=>url.includes('/reports/')?{item:stored}:latest());
  const View=h.load('components/selfStructure/CumulativeWatashiMapView.js').default;let view;
  await act(async()=>{view=Renderer.create(React.createElement(View,{reportId:stored.id,month:stored.snapshot_month}));});
  await act(async()=>button(view,'現在のマップと見比べる').props.onPress());
  const body=JSON.stringify(view.toJSON());assert(body.includes('当時：'));assert(body.includes('現在'));
  assert.equal(JSON.stringify(stored),before);
  assert(h.calls.some(c=>c[1].includes('month=2026-10-01')));
  assert(h.calls.some(c=>c[1].includes('/latest?ensure=true')));
  await act(async()=>button(view,'再取得').props.onPress());
  assert(h.calls.every(c=>!c[1].includes('force=true')),'monthly comparison and retry never force a fresh analysis');
  assert.equal(JSON.stringify(stored),before);
  await act(async()=>view.unmount());
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

test('evidence close and newer node selection reject late earlier evidence',async()=>{
  const a=deferred(),b=deferred();let n=0;const h=harness(url=>url.includes('/evidence')?(++n===1?a.promise:b.promise):latest());
  const View=h.load('components/selfStructure/CumulativeWatashiMapView.js').default;let view;
  await act(async()=>{view=Renderer.create(React.createElement(View));});
  const evidenceButtons=()=>view.root.findAllByType('TouchableOpacity').filter(x=>x.findAllByType('Text').some(t=>t.props.children==='根拠の記録を見る'));
  await act(async()=>{evidenceButtons()[0].props.onPress();});
  await act(async()=>{evidenceButtons()[1].props.onPress();});
  await act(async()=>b.resolve({items:[{id:'B',memo:'LATEST_NODE_EVIDENCE',version_state:'CURRENT'}]}));
  await act(async()=>a.resolve({items:[{id:'A',memo:'OBSOLETE_NODE_EVIDENCE',version_state:'CURRENT'}]}));
  assert(JSON.stringify(view.toJSON()).includes('LATEST_NODE_EVIDENCE'));
  assert(!JSON.stringify(view.toJSON()).includes('OBSOLETE_NODE_EVIDENCE'));
  await act(async()=>view.root.findByType('ModalContent').findAllByType('TouchableOpacity').at(-1).props.onPress());
  assert.equal(view.root.findAllByType('ModalContent').length,0);
  await act(async()=>view.unmount());
});

test('closing pending evidence does not reopen its modal on arrival',async()=>{
  const pending=deferred();const h=harness(url=>url.includes('/evidence')?pending.promise:latest());
  const View=h.load('components/selfStructure/CumulativeWatashiMapView.js').default;let view;
  await act(async()=>{view=Renderer.create(React.createElement(View));});
  await act(async()=>{button(view,'根拠の記録を見る').props.onPress();});
  await act(async()=>view.root.findByType('ModalContent').findAllByType('TouchableOpacity').at(-1).props.onPress());
  await act(async()=>pending.resolve({items:[{id:'A',memo:'LATE_AFTER_CLOSE',version_state:'CURRENT'}]}));
  assert.equal(view.root.findAllByType('ModalContent').length,0);
  await act(async()=>view.unmount());
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
  assert(h.calls.every(c=>c[2].expectedUserId===owner));
  await act(async()=>view.unmount());
});

test('Free monthly access does not unlock the existing paid PDF export',()=>{
  const h=harness(()=>({}));const policy=h.load('components/selfStructure/watashiMapAccessPolicy.js');
  assert.equal(policy.canViewWatashiMapHistory('free'),true);
  assert.equal(policy.getWatashiMapHistoryLimit('free'),2);assert.equal(policy.getWatashiMapHistoryLimit('plus'),12);
  assert.equal(policy.getWatashiMapHistoryLimit('premium'),null);
  assert.equal(policy.canExportWatashiMapPdf('free'),false);
});

test('semantic renderer is negotiated with owner binding and processing metadata starts collapsed',async()=>{
  const semantic=require('./fixtures/analysis-semantic-map-v3-synthetic.json');
  const result={...latest(semantic),map_context:{...counts,processed_count:4,mapped_count:3,unparsed_count:1,excluded_count:1}};
  const h=harness(async()=>result);
  const Screen=h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
  let view;await act(async()=>{view=Renderer.create(React.createElement(Screen,{embedded:true,hideHeader:true}));});
  assert.equal(view.root.findAllByProps({testID:'watashi-map-v3'}).length,1);
  assert(JSON.stringify(view.toJSON()).includes(semantic.overview.title));
  assert(!JSON.stringify(view.toJSON()).includes('対象：感情入力の記録'));
  assert(!JSON.stringify(view.toJSON()).includes('根拠として結び付いた記録'));
  const latestCall=h.calls.find(c=>c[1].includes('/latest?ensure=true'));
  assert.equal(latestCall[2].headers['X-Watashi-Map-Renderer'],'semantic.v1');
  assert.equal(latestCall[2].timeoutMs,240000);
  assert.equal(latestCall[2].expectedUserId,owner);
  await act(async()=>button(view,'分析について').props.onPress());
  const about=JSON.stringify(view.toJSON());
  assert(about.includes('対象の記録5件／根拠として結び付いた記録3件'));
  assert(about.includes('図に結び付けていない記録1件／分析に使っていない記録1件'));
  assert(!about.includes('構造に反映できた記録'));
  assert(!about.includes('未解析の範囲'));
  await act(async()=>view.unmount());
});

test('current analysis is forced only by the explicit update action, with the authenticated owner bound',async()=>{
  const semantic=require('./fixtures/analysis-semantic-map-v3-synthetic.json');
  const h=harness(async()=>latest(semantic));
  const Screen=h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
  let view;await act(async()=>{view=Renderer.create(React.createElement(Screen,{embedded:true,hideHeader:true}));});
  const updates=()=>h.calls.filter(c=>c[1].includes('/latest?ensure=true'));
  assert.equal(updates().length,1);
  assert(!updates()[0][1].includes('force=true'),'opening a saved map must not acquire a paid model update');
  await act(async()=>button(view,'分析を更新').props.onPress());
  assert.equal(updates().length,2);
  assert(updates()[1][1].endsWith('?ensure=true&force=true'));
  assert.equal(updates()[1][2].expectedUserId,owner);
  assert.equal(updates()[1][2].headers['X-Watashi-Map-Renderer'],'semantic.v1');
  await act(async()=>view.unmount());
});
