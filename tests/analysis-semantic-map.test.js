const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const Renderer = require('react-test-renderer');
const babel = require('@babel/core');
const { act } = Renderer;
const root = path.resolve(__dirname, '..');
const fixture = require('./fixtures/analysis-semantic-map-v3-synthetic.json');
const { readSemanticMapProjection, buildSemanticMapLayout } = require('../components/selfStructure/semanticMapContract');
const { checkedCurrentResult } = require('../components/selfStructure/cumulativeMapContract');
const copy = value => JSON.parse(JSON.stringify(value));

function loadRenderer(platform = 'android') {
  const modules = new Map();
  function load(file) {
    const filename = path.resolve(root, file);
    if (modules.has(filename)) return modules.get(filename).exports;
    const source = babel.transformSync(fs.readFileSync(filename, 'utf8'), { filename,
      babelrc: false, configFile: false, presets: [require.resolve('@babel/preset-react')],
      plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')] }).code;
    const module = { exports: {} }; modules.set(filename, module);
    const localRequire = name => {
      if (name === 'react') return React;
      if (name === 'react-native') return { View: 'View', Text: 'Text', ScrollView: 'ScrollView', Platform: { OS: platform },
        TouchableOpacity: 'TouchableOpacity', Modal: props => props.visible
          ? React.createElement('ModalContent', props, props.children) : null,
        StyleSheet: { create: styles => styles, absoluteFill: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 } } };
      if (name === 'react-native-svg') return { __esModule: true, default: 'Svg', Path: 'Path' };
      if (name === 'react-native-safe-area-context') return { SafeAreaProvider: 'SafeAreaProvider', SafeAreaView: 'SafeAreaView' };
      if (name.endsWith('/uiTokens')) return { MODAL_ORIENTATIONS: ['portrait', 'landscape'] };
      if (name.startsWith('.')) return load(path.relative(root, path.resolve(path.dirname(filename), name + (name.endsWith('.js') ? '' : '.js'))));
      return require(name);
    };
    Function('require', 'module', 'exports', source)(localRequire, module, module.exports);
    return module.exports;
  }
  return load('components/selfStructure/WatashiMapV2Renderer.js').default;
}

test('semantic admission is closed and rejects fabricated graph references', () => {
  assert.deepEqual(readSemanticMapProjection({ watashiMap: fixture }), fixture);
  const bad = [];
  let p = copy(fixture); p.nodes[0].debug = 'private'; bad.push(p);
  p = copy(fixture); p.edges[0].to_ref = 'n99'; bad.push(p);
  p = copy(fixture); p.edges[0].relation_kind = 'CAUSE'; bad.push(p);
  p = copy(fixture); p.nodes[0].perspective = 'OTHER_PERSON_MIND'; bad.push(p);
  p = copy(fixture); p.nodes[0].evidence_badge_count = 0; bad.push(p);
  p = copy(fixture); p.accessibility_linear_order = ['n1', 'n2', 'n2', 'n4']; bad.push(p);
  for (const item of bad) assert.equal(readSemanticMapProjection(item), null);
  const coverage = { profile: 'cumulative.v1', source_count: 10, processed_count: 10,
    mapped_count: 4, unparsed_count: 0, excluded_count: 0, stale_supplement_count: 0 };
  assert.equal(checkedCurrentResult({ status: 'ok', has_visible_content: true, source_profile: 'cumulative.v1',
    report_id: '00000000-0000-0000-0000-000000000065', meta: fixture, map_context: coverage }).content_json.watashiMap.wire_kind, 'watashi.map.v3');
});

test('narrow graph keeps distinct node and relationship targets inside the canvas', () => {
  const crowded = copy(fixture);
  crowded.nodes = Array.from({length:12}, (_,i) => ({...fixture.nodes[i % 4], node_ref:`n${i+1}`}));
  crowded.accessibility_linear_order=crowded.nodes.map(n=>n.node_ref);
  crowded.edges=Array.from({length:11},(_,i)=>({...fixture.edges[i%3],edge_ref:`e${i+1}`,from_ref:'n1',to_ref:`n${i+2}`}));
  crowded.edges.push({...fixture.edges[0],edge_ref:'e12',from_ref:'n3',to_ref:'n10'});
  const disconnected=copy(crowded);disconnected.edges=[];
  for (const candidate of [fixture,crowded,disconnected]) for (const width of [280, 320, 350, 600]) {
    const layout = buildSemanticMapLayout(candidate, width);
    const targets = [...layout.nodes.map(n => n.box), ...layout.edges.map(e => e.labelBox)];
    for (const box of targets) {
      assert(box.width >= 44 && box.height >= 44);
      assert(box.x >= 0 && box.x + box.width <= layout.width);
      assert(box.y >= 0 && box.y + box.height <= layout.height);
    }
    for (let i = 0; i < targets.length; i += 1) for (let j = i + 1; j < targets.length; j += 1) {
      const a = targets[i], b = targets[j];
      assert(!(a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y), `overlap at width ${width}`);
    }
    assert.equal(layout.nodes.length, candidate.nodes.length);
    assert.equal(layout.edges.length, candidate.edges.length);
    assert(layout.edges.every(e => e.path.startsWith('M ') && e.path.includes(' L ')));
  }
});

test('map starts with meaning and diagram, then opens explanation and original evidence', async () => {
  const Map = loadRenderer(), opened = [];
  let view;
  await act(async () => { view = Renderer.create(React.createElement(Map, { contentJson: fixture, onOpenEvidence: ref => opened.push(ref) })); });
  let body = JSON.stringify(view.toJSON());
  assert(body.includes(fixture.overview.summary));
  assert(body.includes('semantic-map-graph'));
  assert(!body.includes(fixture.nodes[0].explanation));
  assert(!body.includes('evidence_badge_count'));
  const renderedNode=view.root.findByProps({testID:'semantic-node-n1'});
  const renderedStyle=Object.assign({},...renderedNode.props.style.filter(Boolean));
  const expectedBox=buildSemanticMapLayout(fixture,340).nodes.find(n=>n.node_ref==='n1').box;
  assert.equal(renderedStyle.left,expectedBox.x);assert.equal(renderedStyle.top,expectedBox.y);
  assert.equal(renderedStyle.position,'absolute');assert.equal(renderedStyle.x,undefined);
  await act(async () => view.root.findByProps({ testID: 'semantic-node-n1' }).props.onPress());
  body = JSON.stringify(view.toJSON());
  assert(body.includes(fixture.nodes[0].explanation));
  assert(body.includes(fixture.nodes[0].unknowns[0]));
  const evidence = view.root.findAllByType('TouchableOpacity').find(n => n.findAllByType('Text').some(t => t.props.children === '根拠の記録を見る'));
  await act(async () => evidence.props.onPress());
  assert.deepEqual(opened, ['n1']);
  assert.equal(view.root.findAllByType('ModalContent').length, 0);
  await act(async () => view.root.findByProps({ testID: 'semantic-edge-e1' }).props.onPress());
  assert(JSON.stringify(view.toJSON()).includes(fixture.edges[0].explanation));
  await act(async () => view.unmount());
});

test('a different artifact cannot keep the previous node explanation open', async () => {
  const Map = loadRenderer(); let view;
  await act(async () => { view = Renderer.create(React.createElement(Map, { contentJson: fixture })); });
  await act(async () => view.root.findByProps({ testID: 'semantic-node-n1' }).props.onPress());
  const next = copy(fixture); next.projection_of = 'artifact:00000000000000000000000000000066@1';
  next.nodes[0].explanation = 'NEXT_ARTIFACT_EXPLANATION';
  await act(async () => view.update(React.createElement(Map, { contentJson: next })));
  assert.equal(view.root.findAllByType('ModalContent').length, 0);
  assert(!JSON.stringify(view.toJSON()).includes(fixture.nodes[0].explanation));
  await act(async () => view.unmount());
});

test('iOS opens original evidence only after the detail modal finishes dismissing', async () => {
  const Map=loadRenderer('ios'),opened=[];let view;
  await act(async()=>{view=Renderer.create(React.createElement(Map,{contentJson:fixture,onOpenEvidence:ref=>opened.push(ref)}));});
  await act(async()=>view.root.findByProps({testID:'semantic-node-n1'}).props.onPress());
  const nativeModal=view.root.findByType('ModalContent');
  const dismiss=nativeModal.props.onDismiss;
  const evidence=nativeModal.findAllByType('TouchableOpacity').find(n=>n.findAllByType('Text').some(t=>t.props.children==='根拠の記録を見る'));
  await act(async()=>evidence.props.onPress());
  assert.deepEqual(opened,[],'parent native modal must not open during iOS dismissal');
  await act(async()=>dismiss());
  assert.deepEqual(opened,['n1']);
  await act(async()=>dismiss());
  assert.deepEqual(opened,['n1'],'duplicate native dismiss callback cannot reopen evidence');
  await act(async()=>view.unmount());
});

test('an old iOS dismissal cannot open evidence after an artifact or owner changes', async () => {
  for(const change of ['artifact','owner']) {
    const Map=loadRenderer('ios'),opened=[];let view;
    const props={contentJson:fixture,onOpenEvidence:ref=>opened.push(ref)};
    await act(async()=>{view=Renderer.create(React.createElement(Map,{...props,key:'owner-a'}));});
    await act(async()=>view.root.findByProps({testID:'semantic-node-n1'}).props.onPress());
    const nativeModal=view.root.findByType('ModalContent'),dismiss=nativeModal.props.onDismiss;
    const evidence=nativeModal.findAllByType('TouchableOpacity').find(n=>n.findAllByType('Text').some(t=>t.props.children==='根拠の記録を見る'));
    await act(async()=>evidence.props.onPress());
    const next=copy(fixture);next.projection_of='artifact:00000000000000000000000000000066@1';
    await act(async()=>view.update(React.createElement(Map,{...props,
      key:change==='owner'?'owner-b':'owner-a',contentJson:change==='artifact'?next:fixture})));
    await act(async()=>dismiss());
    assert.deepEqual(opened,[],change);
    await act(async()=>view.unmount());
  }
});

test('a long overview stays three lines above the graph and opens fully in the same detail modal', async () => {
  const Map=loadRenderer('android'),opened=[],p=copy(fixture);
  p.overview.summary='長い全体の読みを省略せずに保存します。'.repeat(60);
  let view;await act(async()=>{view=Renderer.create(React.createElement(Map,{contentJson:p,onOpenEvidence:ref=>opened.push(ref)}));});
  const initialSummary=view.root.findAllByType('Text').find(n=>n.props.children===p.overview.summary);
  assert.equal(initialSummary.props.numberOfLines,3,'the graph must not follow an unrestricted text wall');
  assert(view.root.findByProps({testID:'semantic-map-graph'}));
  await act(async()=>view.root.findByProps({testID:'semantic-overview-open'}).props.onPress());
  let modal=view.root.findByType('ModalContent');
  const fullSummary=modal.findAllByType('Text').find(n=>n.props.children===p.overview.summary);
  assert.equal(fullSummary.props.numberOfLines,undefined,'expanded overview retains all information');
  const chooseNode=modal.findByProps({testID:'semantic-overview-node-n1'});
  await act(async()=>chooseNode.props.onPress());
  assert.equal(view.root.findAllByType('ModalContent').length,1,'overview and item share one native modal');
  modal=view.root.findByType('ModalContent');
  assert(JSON.stringify(modal.toJSON ? modal.toJSON() : view.toJSON()).includes(p.nodes[0].explanation));
  const evidence=modal.findAllByType('TouchableOpacity').find(n=>n.findAllByType('Text').some(t=>t.props.children==='根拠の記録を見る'));
  await act(async()=>evidence.props.onPress());
  assert.deepEqual(opened,['n1'],'overview does not fabricate an all-node evidence request');
  await act(async()=>view.unmount());
});
