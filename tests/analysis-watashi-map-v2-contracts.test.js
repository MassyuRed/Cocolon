// Uses the existing tests/emlis-q2-tools pinned React/Babel tools.
// NODE_PATH=tests/emlis-q2-tools/node_modules node --test tests/analysis-watashi-map-v2-contracts.test.js
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '..');
const toolRequire = createRequire(path.join(__dirname, 'emlis-q2-tools/package.json'));
function tool(name) { try { return require(name); } catch { return toolRequire(name); } }
function toolPath(name) { try { return require.resolve(name); } catch { return toolRequire.resolve(name); } }
const React = tool('react');
const TestRenderer = tool('react-test-renderer');
const babel = tool('@babel/core');
const { act } = TestRenderer;
const contract = require('../components/selfStructure/watashiMapV2Contract');
const fixtures = require('./fixtures/analysis-watashi-map-v2-synthetic.json').cases;
const copy = (value) => JSON.parse(JSON.stringify(value));

function moduleLoader(extraMocks = {}) {
  const modules = new Map();
  const subscription = { tier: 'plus', loading: false,
    allowedSelfStructureModes: ['light', 'standard'] };
  const mocks = {
    react: React,
    'react-native': { View: 'View', Text: 'Text', ScrollView: 'ScrollView',
      SafeAreaView: 'SafeAreaView', TouchableOpacity: 'TouchableOpacity',
      ActivityIndicator: 'ActivityIndicator', StyleSheet: { create: (s) => s },
      Alert: { alert: () => {} }, NativeModules: {}, Linking: {}, Share: {} },
    'react-native-vector-icons/Ionicons': () => null,
    '@react-navigation/native': { useNavigation: () => ({ navigate() {} }) },
    '../theme/ThemeContext': { useTheme: () => ({ themeName: 'light', colors: {} }) },
    '../SubscriptionContext': { useSubscription: () => subscription },
    '../ui/uiTokens': { makeUiTokens: () => ({ text: {} }) },
    '../ui/applyTypographyTokens': { applyTypographyTokens: (s) => s },
    '../components/CocolonBackButton': () => null,
    '../components/selfStructure/WatashiMapRenderer': () => React.createElement('Text', null, 'LEGACY_RENDERER'),
    ...extraMocks,
  };
  function load(relative) {
    const filename = path.resolve(root, relative);
    if (modules.has(filename)) return modules.get(filename).exports;
    const source = fs.readFileSync(filename, 'utf8');
    const code = babel.transformSync(source, { filename, babelrc: false, configFile: false,
      presets: [toolPath('@babel/preset-react')],
      plugins: [toolPath('@babel/plugin-transform-modules-commonjs')] }).code;
    const module = { exports: {} }; modules.set(filename, module);
    const localRequire = (name) => {
      if (Object.prototype.hasOwnProperty.call(mocks, name)) return mocks[name];
      if (name.startsWith('.')) {
        const target = path.resolve(path.dirname(filename), name);
        return load(path.relative(root, target.endsWith('.js') ? target : target + '.js'));
      }
      return tool(name);
    };
    Function('require', 'module', 'exports', code)(localRequire, module, module.exports);
    return module.exports;
  }
  return load;
}

test('backend-generated projections yield identical JS text and artifact reference', () => {
  for (const fixture of fixtures) {
    const view = contract.buildWatashiMapV2ViewModel(fixture.projection);
    assert.ok(view, fixture.name);
    assert.equal(view.projectionOf, fixture.text_projection.projection_of);
    assert.equal(view.text, fixture.text_projection.text);
    assert.deepEqual(view.nodes.map((n) => n.node_ref), fixture.projection.accessibility_linear_order);
    assert.deepEqual(view.unknownGaps.map((g) => g.between_node_refs),
      fixture.projection.unknown_gaps.map((g) => g.between_node_refs));
    assert.deepEqual(contract.readWatashiMapV2Projection({ watashiMap: fixture.projection }), fixture.projection);
  }
});

function latestResultHarness(responses) {
  let requestCount = 0; let statusReads = 0; const seen = [];
  const Screen = moduleLoader({
    '../lib/supabase': { supabase: { auth: { getSession: async () => ({ data: {
      session: { access_token: 'synthetic-session' },
    } }) } } },
    '../lib/user': { getCurrentUserId: async () => 'synthetic-owner',
    },
    '../lib/apiClient': { API_BASE_URL: 'https://synthetic.invalid',
      apiGet: async () => { statusReads += 1; return { version_key: 'not-displayed' }; },
      apiFetch: async () => {
        const response = responses[requestCount++];
        if (response instanceof Error) throw response;
        return { ok: response.status === 200, status: response.status,
          json: async () => response.body };
      },
    },
    '../lib/compat/legacyWireContracts': { SELF_STRUCTURE_WIRE: {
      routes: { latest: '/self-structure/latest', latestStatus: '/self-structure/latest/status' },
    } },
  })('screens/SelfStructureReportGenerateScreen.js').default;
  return { Screen, seen, statusReads: () => statusReads, requests: () => requestCount,
    props: { onLatestSeenVersion: (version) => { seen.push(version); } } };
}
const savedMapAbsent = {
  status: 'ok', reason: 'no_visible_content', refreshed: false, report_mode: 'standard',
  content_text: null, meta: null, has_visible_content: false,
  skip_reason: 'analysis_saved_map_unavailable', generated_at: null,
};
const insufficientInput = {
  status: 'ok', reason: 'insufficient_input', refreshed: false, report_mode: 'standard',
  skip_reason: 'analysis_insufficient_input', content_text: null, meta: null,
  has_visible_content: false, title: null, generated_at: null, latest_generated_at: null,
};

test('declared insufficient input renders waiting text without an artifact or read acknowledgement', async () => {
  const h = latestResultHarness([{ status: 200, body: insufficientInput }]);
  let render;
  await act(async () => { render = TestRenderer.create(React.createElement(h.Screen,
    { ...h.props, embedded: true, hideHeader: true })); });
  const body = JSON.stringify(render.toJSON());
  assert.ok(body.includes('入力情報が少ないため、まだ分析を表示できません。'));
  assert.ok(!body.includes('取得エラー'));
  assert.ok(!body.includes('現在表示できるわたしマップはありません。'));
  assert.ok(!body.includes('LEGACY_RENDERER'));
  assert.ok(!body.includes('watashi-map-v2'));
  assert.equal(h.requests(), 1);
  assert.equal(h.statusReads(), 0);
  assert.deepEqual(h.seen, []);
  await act(async () => render.unmount());
});

test('refresh moves between insufficient input and the actual saved map without retaining stale output', async () => {
  const h = latestResultHarness([
    { status: 200, body: insufficientInput },
    { status: 200, body: { meta: fixtures[0].projection, report_mode: 'standard' } },
    { status: 200, body: insufficientInput },
  ]);
  let render;
  await act(async () => { render = TestRenderer.create(React.createElement(h.Screen, h.props)); });
  const refresh = () => render.root.findAllByType('TouchableOpacity').find((n) =>
    n.findAllByType('Text').some((t) => t.props.children === '更新'));
  await act(async () => { refresh().props.onPress(); });
  let body = JSON.stringify(render.toJSON());
  assert.ok(body.includes('watashi-map-v2'));
  assert.ok(!body.includes('入力情報が少ないため、まだ分析を表示できません。'));
  assert.deepEqual(h.seen, [fixtures[0].projection.projection_of]);
  await act(async () => { refresh().props.onPress(); });
  body = JSON.stringify(render.toJSON());
  assert.ok(body.includes('入力情報が少ないため、まだ分析を表示できません。'));
  assert.ok(!body.includes('watashi-map-v2'));
  assert.deepEqual(h.seen, [fixtures[0].projection.projection_of]);
  assert.equal(h.statusReads(), 0);
  await act(async () => render.unmount());
});

test('insufficient-input declarations cannot hide HTTP failures or contradictory payloads', async () => {
  const contradictory = [
    { status: 'error' }, { refreshed: true }, { has_visible_content: true },
    { skip_reason: 'analysis_saved_map_unavailable' }, { title: 'unexpected title' },
    { generated_at: '2026-10-10T00:00:00Z' }, { latest_generated_at: '2026-10-10T00:00:00Z' },
    { meta: fixtures[0].projection }, { meta: '{"wire_kind":' },
    { content_text: 'synthetic unexpected analysis text' }, { content_text: '' },
  ];
  for (const response of [
    ...[401, 403, 422, 503].map((status) => ({ status, body: insufficientInput })),
    ...contradictory.map((fields) => ({ status: 200, body: { ...insufficientInput, ...fields } })),
  ]) {
    const h = latestResultHarness([response]); let render;
    await act(async () => { render = TestRenderer.create(React.createElement(h.Screen, h.props)); });
    const body = JSON.stringify(render.toJSON());
    assert.ok(body.includes('取得エラー'));
    assert.ok(!body.includes('入力情報が少ないため、まだ分析を表示できません。'));
    assert.ok(!body.includes('watashi-map-v2'));
    assert.deepEqual(h.seen, []);
    assert.equal(h.statusReads(), 0);
    await act(async () => render.unmount());
  }
});

test('declared absent saved map is neutral and never marks an undisplayed version as seen', async () => {
  for (const content_text of [null, '']) {
    const h = latestResultHarness([{ status: 200, body: { ...savedMapAbsent, content_text } }]);
    let render;
    await act(async () => { render = TestRenderer.create(React.createElement(h.Screen,
      { ...h.props, embedded: true, hideHeader: true })); });
    const body = JSON.stringify(render.toJSON());
    assert.ok(body.includes('現在表示できるわたしマップはありません。'));
    assert.ok(!body.includes('取得エラー'));
    assert.ok(!body.includes('少なめ'));
    assert.ok(!body.includes('LEGACY_RENDERER'));
    assert.equal(h.requests(), 1);
    assert.equal(h.statusReads(), 0);
    assert.deepEqual(h.seen, []);
    await act(async () => render.unmount());
  }
});

test('refresh replaces an empty state with the actual saved map and marks only that artifact', async () => {
  const h = latestResultHarness([
    { status: 200, body: savedMapAbsent },
    { status: 200, body: { meta: fixtures[0].projection, report_mode: 'standard' } },
    { status: 200, body: savedMapAbsent },
  ]);
  let render;
  await act(async () => { render = TestRenderer.create(React.createElement(h.Screen, h.props)); });
  const refresh = () => render.root.findAllByType('TouchableOpacity').find((n) =>
    n.findAllByType('Text').some((t) => t.props.children === '更新'));
  await act(async () => { refresh().props.onPress(); });
  let body = JSON.stringify(render.toJSON());
  assert.ok(body.includes('watashi-map-v2'));
  assert.ok(!body.includes('現在表示できるわたしマップはありません。'));
  assert.deepEqual(h.seen, [fixtures[0].projection.projection_of]);
  await act(async () => { refresh().props.onPress(); });
  body = JSON.stringify(render.toJSON());
  assert.ok(body.includes('現在表示できるわたしマップはありません。'));
  assert.ok(!body.includes('watashi-map-v2'));
  assert.deepEqual(h.seen, [fixtures[0].projection.projection_of]);
  assert.equal(h.statusReads(), 0);
  await act(async () => render.unmount());
});

test('HTTP and network failures remain errors instead of normal empty results', async () => {
  for (const response of [
    ...[401, 403, 409, 422, 503].map((status) => ({ status, body: {
      ...savedMapAbsent, detail: 'synthetic_request_failure',
    } })),
    new Error('synthetic_network_failure'),
  ]) {
    const h = latestResultHarness([response]); let render;
    await act(async () => { render = TestRenderer.create(React.createElement(h.Screen, h.props)); });
    const body = JSON.stringify(render.toJSON());
    assert.ok(body.includes('取得エラー'), String(response.status));
    assert.ok(!body.includes('現在表示できるわたしマップはありません。'));
    assert.deepEqual(h.seen, []);
    assert.equal(h.statusReads(), 0);
    await act(async () => render.unmount());
  }
});

test('empty declarations do not hide malformed or unsupported map payloads', async () => {
  const invalid = copy(fixtures[0].projection); invalid.nodes[0].source_id = 'private';
  for (const meta of [invalid, '{"wire_kind":', { wire_kind: 'watashi.map.v3' },
    { wire_kind: 'watashi.map.v2.private-preview' }]) {
    const h = latestResultHarness([{ status: 200, body: { ...savedMapAbsent, meta } }]);
    let render;
    await act(async () => { render = TestRenderer.create(React.createElement(h.Screen, h.props)); });
    const body = JSON.stringify(render.toJSON());
    assert.ok(body.includes('この分析結果は表示できません'));
    assert.ok(!body.includes('現在表示できるわたしマップはありません。'));
    assert.deepEqual(h.seen, []);
    assert.equal(h.statusReads(), 0);
    await act(async () => render.unmount());
  }
  const h = latestResultHarness([{ status: 200, body: {} }]); let render;
  await act(async () => { render = TestRenderer.create(React.createElement(h.Screen, h.props)); });
  assert.ok(JSON.stringify(render.toJSON()).includes('取得エラー'));
  assert.deepEqual(h.seen, []);
  assert.equal(h.statusReads(), 0);
  await act(async () => render.unmount());
});


test('period comparison renders the same limited differences in cards and text', async () => {
  const Renderer = moduleLoader()('components/selfStructure/WatashiMapV2Renderer.js').default;
  for (const comparison of [
    { state: 'COMPARABLE', reason_codes: [], safe_change_kinds: [
      'ROUTE_EVIDENCE_CHANGED', 'ANNOTATION_EVIDENCE_CHANGED', 'UNKNOWN_SCOPE_CHANGED', 'CONFLICT_STATE_CHANGED'] },
    { state: 'COMPARABLE', reason_codes: [], safe_change_kinds: [] },
    { state: 'NOT_COMPARABLE', reason_codes: ['PERIOD_LENGTH_MISMATCH', 'PERIOD_OVERLAP'], safe_change_kinds: [] },
  ]) {
    const projection = copy(fixtures[0].projection);
    projection.period_comparison = comparison;
    const view = contract.buildWatashiMapV2ViewModel(projection);
    let render;
    await act(async () => { render = TestRenderer.create(React.createElement(Renderer, { contentJson: projection })); });
    const body = JSON.stringify(render.toJSON());
    assert.ok(body.includes('前の期間との比較'));
    for (const line of view.comparisonText) {
      assert.ok(view.text.includes(line));
      assert.ok(body.includes(line));
    }
    if (comparison.state === 'NOT_COMPARABLE') assert.ok(view.text.includes('二つの期間が重なっています'));
    else if (!comparison.safe_change_kinds.length) assert.ok(view.text.includes('記録の件数や、読み取れていない内容の変化は判断していません'));
    else assert.ok(view.text.includes('改善・悪化や原因を示すものではありません'));
    await act(async () => render.unmount());
  }
});

test('protective intention renders a neutral heading and keeps target and uncertainty', async () => {
  const projection = copy(fixtures[0].projection);
  projection.nodes[0].node_kind = 'ATTENTION_OR_THOUGHT';
  projection.nodes[0].visible_label = '家族を守ることへの希望';
  projection.annotation_badges = [{ annotation_ref: 'a1', target_ref: projection.nodes[0].node_ref,
    kind: 'PROTECTIVE', visible_label: '守りたいという意向の記録です。実際に守れているかは確定していません。' }];
  const Renderer = moduleLoader()('components/selfStructure/WatashiMapV2Renderer.js').default;
  let render;
  await act(async () => { render = TestRenderer.create(React.createElement(Renderer, { contentJson: projection })); });
  const body = JSON.stringify(render.toJSON());
  assert.ok(body.includes('守る対象'));
  assert.ok(!body.includes('守っているもの'));
  assert.ok(body.includes(projection.nodes[0].visible_label));
  assert.ok(body.includes(projection.annotation_badges[0].visible_label));
  const view = contract.buildWatashiMapV2ViewModel(projection);
  assert.equal(view.annotations[0].targetLabel, projection.nodes[0].visible_label);
  assert.ok(view.text.includes(projection.annotation_badges[0].visible_label));
  await act(async () => render.unmount());
});

test('uncertainty, annotations and conflicts keep their graph targets in text and view model', () => {
  const projection = copy(fixtures[0].projection);
  projection.annotation_badges = [{ annotation_ref: 'a1', target_ref: projection.edges[0].edge_ref,
    kind: 'BURDEN', visible_label: '補足された負担' }];
  projection.conflict_badges = [{ conflict_ref: 'c1', target_refs: ['n1'], visible_label: '異なる記録' }];
  const view = contract.buildWatashiMapV2ViewModel(projection);
  assert.equal(view.unknownGaps.length, projection.unknown_gaps.length);
  for (const gap of view.unknownGaps) {
    assert.ok(gap.targetLabels.every((label) => view.text.includes(label)));
    assert.ok(view.text.includes('未確定（' + gap.targetLabels.join(' ／ ') + '）'));
  }
  assert.equal(view.annotations[0].target_ref, projection.edges[0].edge_ref);
  assert.equal(view.annotations[0].targetLabel, view.edges[0].labels.join(' ／ '));
  assert.equal(view.conflicts[0].targetLabels[0], projection.nodes[0].visible_label);
});

test('malformed declared JSON is rejected without legacy text while missing legacy JSON remains supported', async () => {
  assert.equal(contract.parseWatashiMapContent(null), null);
  assert.equal(contract.parseWatashiMapContent(''), null);
  const Viewer = moduleLoader()('screens/SelfStructureReportViewerScreen.js').default;
  for (const content of ['{"watashiMap":', '[1]', 'true']) {
    assert.equal(contract.classifyWatashiMapVersion(contract.parseWatashiMapContent(content)), 'UNSUPPORTED');
    let render;
    await act(async () => { render = TestRenderer.create(React.createElement(Viewer, {
      report: { content_json: content, content_text: 'DO_NOT_DISPLAY_OLD_BODY' },
    })); });
    const body = JSON.stringify(render.toJSON());
    assert.ok(body.includes('この分析結果は表示できません'));
    assert.ok(!body.includes('DO_NOT_DISPLAY_OLD_BODY'));
    await act(async () => render.unmount());
  }
});

test('Plus cannot view a deep v2 history report and Premium can', async () => {
  for (const tier of ['plus', 'premium']) {
    const subscription = { tier, loading: false };
    const Viewer = moduleLoader({ '../SubscriptionContext': { useSubscription: () => subscription } })
      ('screens/SelfStructureReportViewerScreen.js').default;
    let render;
    await act(async () => { render = TestRenderer.create(React.createElement(Viewer, {
      report: { content_json: fixtures[0].projection, report_mode: 'deep' },
    })); });
    const body = JSON.stringify(render.toJSON());
    assert.equal(body.includes('watashi-map-v2'), tier === 'premium');
    if (tier === 'plus') assert.ok(body.includes('Premiumプラン'));
    await act(async () => render.unmount());
  }
});

test('latest seen advances only for an admitted v2 projection and an allowed mode', async () => {
  const invalid = copy(fixtures[0].projection); invalid.nodes[0].source_id = 'private';
  const cases = [
    { tier: 'plus', mode: 'standard', meta: fixtures[0].projection, admitted: true },
    { tier: 'free', mode: 'light', meta: fixtures[0].projection, admitted: true },
    { tier: 'plus', mode: 'deep', meta: fixtures[0].projection, admitted: false },
    { tier: 'plus', mode: 'unknown-mode', meta: fixtures[0].projection, admitted: false },
    { tier: 'plus', mode: 'standard', meta: invalid, admitted: false },
    { tier: 'plus', mode: 'standard', meta: '{"wire_kind":', admitted: false },
    ...['watashi.map.v2.private-preview', 'watashi.map.v3'].map((wire_kind) => ({
      tier: 'plus', mode: 'standard', meta: { wire_kind }, admitted: false,
    })),
  ];
  for (const item of cases) {
    let statusReads = 0; const seen = [];
    const subscription = { tier: item.tier, loading: false,
      allowedSelfStructureModes: item.tier === 'free' ? ['light'] : ['light', 'standard'] };
    const Screen = moduleLoader({
      '../SubscriptionContext': { useSubscription: () => subscription },
      '../lib/supabase': { supabase: { auth: { getSession: async () => ({ data: {
        session: { access_token: 'synthetic-session' },
      } }) } } },
      '../lib/user': { getCurrentUserId: async () => 'synthetic-owner' },
      '../lib/apiClient': { API_BASE_URL: 'https://synthetic.invalid',
        apiGet: async () => { statusReads += 1; return { version_key: 'synthetic-version' }; },
        apiFetch: async () => ({ ok: true, json: async () => ({ meta: item.meta,
          content_text: 'DO_NOT_DISPLAY_OLD_BODY', report_mode: item.mode }) }) },
      '../lib/compat/legacyWireContracts': { SELF_STRUCTURE_WIRE: {
        routes: { latest: '/self-structure/latest', latestStatus: '/self-structure/latest-status' },
      } },
    })('screens/SelfStructureReportGenerateScreen.js').default;
    let render;
    await act(async () => { render = TestRenderer.create(React.createElement(Screen, {
      embedded: true, initialReportMode: item.tier === 'free' ? 'light' : 'standard',
      onLatestSeenVersion: (version) => { seen.push(version); },
    })); });
    const body = JSON.stringify(render.toJSON());
    assert.equal(body.includes('watashi-map-v2'), item.admitted, item.mode);
    assert.ok(!body.includes('DO_NOT_DISPLAY_OLD_BODY'));
    assert.equal(statusReads, 0, 'V2 must not mark a concurrently newer status as seen');
    assert.deepEqual(seen, item.admitted ? [fixtures[0].projection.projection_of] : []);
    await act(async () => render.unmount());
  }
});

test('closed DTO rejects private fields, identity mismatch, broken edges and incomplete reading order', () => {
  const original = fixtures[0].projection;
  const mutations = [
    (p) => { p.original_json = 'private'; },
    (p) => { p.nodes[0].evidence_refs = ['private']; },
    (p) => { p.period_comparison.source_digest = 'private'; },
    (p) => { p.artifact_version += 1; },
    (p) => { p.nodes[1].node_ref = p.nodes[0].node_ref; },
    (p) => { p.edges[0].endpoint_refs[0] = 'n999'; },
    (p) => { p.edges[0].from_ref = 'n1'; },
    (p) => { p.accessibility_linear_order.pop(); },
    (p) => { p.period_comparison.safe_change_kinds = ['ROUTE_EVIDENCE_CHANGED']; },
  ];
  for (const mutate of mutations) {
    const value = copy(original); mutate(value);
    assert.equal(contract.readWatashiMapV2Projection(value), null);
  }
});

test('private, future and malformed v2 never enter legacy normalization', () => {
  const formatters = moduleLoader()('components/selfStructure/watashiMapFormatters.js');
  for (const wire of ['watashi.map.v2', 'watashi.map.v2.private-preview', 'watashi.map.v3', null]) {
    const value = { watashiMap: { wire_kind: wire, schema_version: 'unsupported' } };
    assert.equal(contract.classifyWatashiMapVersion(value), 'UNSUPPORTED');
    assert.equal(formatters.hasWatashiMapRenderableContent(value), false);
    assert.throws(() => formatters.normalizeWatashiMapPayload(value, { contentText: 'OLD_BODY' }),
      /requires_dedicated_renderer/);
  }
  assert.throws(() => formatters.normalizeWatashiMapPayload(fixtures[0].projection),
    /requires_dedicated_renderer/);
  assert.equal(formatters.normalizeWatashiMapPayload({ watashiMap: { version: 'watashi.map.v1' } })
    .version, 'watashi.map.v1');
});

test('renderer shows actual graph, uncertainty and matching text without making cooccurrence directional', () => {
  const Renderer = moduleLoader()('components/selfStructure/WatashiMapV2Renderer.js').default;
  const render = TestRenderer.create(React.createElement(Renderer, { contentJson: fixtures[0].projection }));
  const labels = render.root.findAllByType('Text').map((n) => n.props.children);
  assert.ok(labels.includes(fixtures[0].text_projection.text));
  assert.ok(labels.includes('まだ確定していない部分'));
  const edge = render.root.findAll((n) => typeof n.props.accessibilityLabel === 'string'
    && n.props.accessibilityLabel.includes('、および、'));
  assert.equal(edge.length, 1);
  assert.match(edge[0].props.accessibilityLabel, /順序や原因は確定していません/);
  assert.ok(!JSON.stringify(render.toJSON()).includes('LEGACY_RENDERER'));
  render.unmount();
});

test('history viewer dispatches v2 and never exposes a mismatched legacy content_text', async () => {
  const Viewer = moduleLoader()('screens/SelfStructureReportViewerScreen.js').default;
  let render;
  await act(async () => { render = TestRenderer.create(React.createElement(Viewer, {
    report: { title: '観測', content_json: fixtures[0].projection, content_text: 'DO_NOT_DISPLAY_OLD_BODY' },
  })); });
  const body = JSON.stringify(render.toJSON());
  assert.ok(body.includes('watashi-map-v2'));
  assert.ok(!body.includes('DO_NOT_DISPLAY_OLD_BODY'));
  assert.ok(!body.includes('LEGACY_RENDERER'));
  await act(async () => render.unmount());
});

test('history remains locked for Free and private preview cannot be displayed as old text', async () => {
  for (const tier of ['free', 'plus']) {
    const Viewer = moduleLoader({ '../SubscriptionContext': {
      useSubscription: () => ({ tier, loading: false }),
    } })('screens/SelfStructureReportViewerScreen.js').default;
    let render;
    await act(async () => { render = TestRenderer.create(React.createElement(Viewer, {
      report: { content_json: tier === 'free' ? fixtures[0].projection : {
        wire_kind: 'watashi.map.v2.private-preview', nodes: [{ visible_label: 'DO_NOT_DISPLAY_RAW' }],
      }, content_text: 'DO_NOT_DISPLAY_OLD_BODY' },
    })); });
    const body = JSON.stringify(render.toJSON());
    assert.ok(!body.includes('DO_NOT_DISPLAY'));
    assert.ok(body.includes(tier === 'free' ? 'Plusプラン以上' : 'この分析結果は表示できません'));
    await act(async () => render.unmount());
  }
});

test('latest screen consumes a v2 server response and omits legacy content_text', async () => {
  let calls = 0;
  const Screen = moduleLoader({
    '../lib/supabase': { supabase: { auth: { getSession: async () => ({ data: {
      session: { access_token: 'synthetic-session' },
    } }) } } },
    '../lib/user': { getCurrentUserId: async () => 'synthetic-owner' },
    '../lib/apiClient': { API_BASE_URL: 'https://synthetic.invalid', apiGet: async () => ({}),
      apiFetch: async () => { calls += 1; return { ok: true, json: async () => ({
        meta: fixtures[0].projection, content_text: 'DO_NOT_DISPLAY_OLD_BODY', report_mode: 'standard',
      }) }; } },
    '../lib/compat/legacyWireContracts': { SELF_STRUCTURE_WIRE: {
      routes: { latest: '/self-structure/latest', latestStatus: '/self-structure/latest-status' },
    } },
  })('screens/SelfStructureReportGenerateScreen.js').default;
  let render;
  await act(async () => { render = TestRenderer.create(React.createElement(Screen, { embedded: true })); });
  assert.equal(calls, 1);
  const body = JSON.stringify(render.toJSON());
  assert.ok(body.includes('watashi-map-v2'));
  assert.ok(!body.includes('DO_NOT_DISPLAY_OLD_BODY'));
  assert.ok(!body.includes('LEGACY_RENDERER'));
  await act(async () => render.unmount());
});
