const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const Renderer = require('react-test-renderer');
const babel = require('@babel/core');
const { act } = Renderer;
const root = path.resolve(__dirname, '..');
const contract = require('../components/selfStructure/ifRouteContract');
const map = require('./fixtures/analysis-semantic-map-v3-synthetic.json');
const owner = '00000000-0000-0000-0000-000000000001';
const copy = value => JSON.parse(JSON.stringify(value));
const deferred = () => { let resolve, reject; const promise = new Promise((r, j) => { resolve = r; reject = j; }); return { promise, resolve, reject }; };
const id = '00000000-0000-0000-0000-000000000070';
const artifact = `artifact:${id.replace(/-/g, '')}@1`;

function candidate(count = 2) {
  const scenarios = Array.from({ length: count }, (_, index) => ({
    scenario_ref: `analysis-if-scenario:choice${index + 1}@1`, branch_point_ref: 'n1', visible_label: `架空の選択肢${index + 1}`,
    nodes: [{ node_ref: 'anchor', origin: 'OBSERVED_ANCHOR', visible_label: map.nodes[0].title },
      { node_ref: 'choice', origin: 'SIMULATED_EXTENSION', visible_label: `仮に選択肢${index + 1}を考える` },
      { node_ref: 'after', origin: 'UNKNOWN', visible_label: 'その後の反応はまだ分かりません。' }],
    edges: [{ edge_ref: 'e1', from_ref: 'anchor', to_ref: 'choice', visible_condition_labels: ['話が終わってから'] }],
    required_conditions: ['話が終わってから'], frictions: ['意見を言葉にする難しさ'], unmodelled_factors: ['相手の反応は不明です。'],
  }));
  return { status: 'GENERATED', id, artifact_ref: artifact, kind: 'scenario_set', content_text: '仮想の選択肢', idempotency_replayed: false,
    scenario_set_ref: 'scenario-set:choices@1', projection: {
      schema_version: 'cocolon.cmee.analysis_if_safe_projection.v1alpha1', wire_kind: 'watashi.if-route-set.v1', projection_of: artifact,
      base_observed_map_ref: map.projection_of, base_route_ref: 'route:branch@1', selection_policy: 'PARALLEL_NOT_RANKED', scenarios,
    } };
}
function saved() {
  const savedId = '00000000-0000-0000-0000-000000000071';
  const ref = `artifact:${savedId.replace(/-/g, '')}@1`;
  return { status: 'GENERATED', id: savedId, artifact_ref: ref, kind: 'saved_intent', content_text: '保存した関心の方向',
    selected_scenario_label: '架空の選択肢2', idempotency_replayed: false, projection: {
      schema_version: 'cocolon.cmee.analysis_saved_intent_safe_projection.v1alpha1', wire_kind: 'watashi.saved-route-intent.v1',
      projection_of: ref, source_scenario_set_ref: 'scenario-set:choices@1', selected_scenario_ref: 'analysis-if-scenario:choice2@1',
      visible_note: '今はこの方向を考えておきたい。', saved_at: '2026-11-14T09:00:00+00:00',
    } };
}
function pending() { return { status: 'PENDING', operation_id: '00000000-0000-0000-0000-000000000072', state: 'CALL_STARTED',
  reason_codes: ['analysis_if_result_pending'], artifact: null }; }
function question() { return { status: 'QUESTION_PENDING', reason_codes: ['analysis_if_intent_unclear'], artifact: null,
  clarification_request: { clarification_id: 'question:1', core_id: 'ANALYSIS', parent_request_ref: 'request:1', target_unknown_ref: 'unknown:1',
    reason_code: 'analysis_if_intent_unclear', prompt_private: 'どの点を変えて考えたいですか？', skip_allowed: true, max_answer_count: 1,
    answer_source_role: 'SIMULATION_SESSION_MATERIAL', status: 'PENDING' } }; }

function harness(fetchResult = async () => candidate(), platform = 'android') {
  const calls = [], modules = new Map(), auth = { session: { user: { id: owner } } }, plan = { tier: 'premium', loading: false };
  const native = { Platform: { OS: platform }, AppState: { currentState: 'active', addEventListener: () => ({ remove() {} }) },
    View: 'View', Text: 'Text', ScrollView: 'ScrollView', TextInput: 'TextInput', Switch: 'Switch', ActivityIndicator: 'ActivityIndicator',
    TouchableOpacity: 'TouchableOpacity', Modal: props => props.visible ? React.createElement('ModalContent', props, props.children) : null,
    StyleSheet: { create: value => value, absoluteFill: {} } };
  const api = {
    apiFetch: async (url, options) => {
      calls.push({ url, ...options, parsedBody: options.body ? JSON.parse(options.body) : undefined });
      const result = await fetchResult(url, options);
      return result?.ok !== undefined ? result : { ok: true, status: 200, json: async () => result };
    },
    apiGet: async url => url.includes('/latest') ? { status: 'ok', has_visible_content: false,
      reason: 'no_visible_content', source_profile: 'cumulative.v1', report_id: null, generated_at: null, meta: null }
      : {}, apiPost: async () => ({}),
  };
  function load(file) {
    const filename = path.resolve(root, file); if (modules.has(filename)) return modules.get(filename).exports;
    const code = babel.transformSync(fs.readFileSync(filename, 'utf8'), { filename, babelrc: false, configFile: false,
      presets: [require.resolve('@babel/preset-react')], plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')] }).code;
    const module = { exports: {} }; modules.set(filename, module);
    const localRequire = name => {
      if (name === 'react') return React;
      if (name === 'react-native') return native;
      if (name === 'react-native-svg') return { __esModule: true, default: 'Svg', Path: 'Path' };
      if (name === 'react-native-safe-area-context') return { SafeAreaProvider: 'SafeAreaProvider', SafeAreaView: 'SafeAreaView' };
      if (name === '@react-navigation/native') return { useIsFocused: () => true };
      if (name.startsWith('.')) {
        let target = path.resolve(path.dirname(filename), name); if (!target.endsWith('.js')) target += '.js';
        if (target.endsWith('/lib/apiClient.js')) return api;
        if (target.endsWith('/AuthContext.js')) return { useAuth: () => auth };
        if (target.endsWith('/SubscriptionContext.js')) return { useSubscription: () => plan };
        if (target.endsWith('/theme/ThemeContext.js')) return { useTheme: () => ({ colors: {}, themeName: 'light' }) };
        if (target.endsWith('/components/CocolonBackButton.js')) return () => null;
        if (target.endsWith('/components/CocolonButton.js')) return props => React.createElement('Button',
          { ...props, disabled: !!props.disabled || !!props.loading }, React.createElement('Text', null, props.title));
        return load(path.relative(root, target));
      }
      return require(name);
    };
    Function('require', 'module', 'exports', code)(localRequire, module, module.exports);
    return module.exports;
  }
  return { load, calls, auth, plan, api };
}
const props = () => ({ visible: true, onClose() {}, ownerId: owner, tier: 'premium', baseMapRef: map.projection_of,
  branchPointId: 'n1', branchLabel: map.nodes[0].title });
const byTitle = (view, title) => view.root.findAllByType('Button').find(button => button.props.title === title);
async function fill(view) {
  await act(async () => view.root.findByProps({ testID: 'analysis-if-intent' }).props.onChangeText('次は意見を伝えてみたい。'));
  await act(async () => view.root.findByProps({ testID: 'analysis-if-no-constraints' }).props.onValueChange(true));
}

test('IF and Saved contracts reject rank, observation mixing and invalid identities', () => {
  assert.equal(contract.checkedIfApplicationResult(candidate(3), 'scenario_set').projection.scenarios.length, 3);
  assert.equal(contract.checkedIfApplicationResult(saved(), 'saved_intent').selected_scenario_label, '架空の選択肢2');
  assert.equal(contract.checkedIfApplicationResult(pending(), 'scenario_set').status, 'PENDING');
  for (const change of [p => p.projection.scenarios[0].rank = 1,
    p => p.projection.scenarios[0].nodes[1].origin = 'SOURCE_EXPLICIT',
    p => p.projection.scenarios[0].edges[0].to_ref = 'missing',
    p => p.projection.scenarios = [], p => p.id = saved().id]) {
    const value = candidate(); change(value);
    assert.throws(() => contract.checkedIfApplicationResult(value, 'scenario_set'));
  }
});

test('normal dialog accepts explicit no-constraint and 1–3 parallel candidates without manual alternatives', async () => {
  const h = harness(async () => candidate(3)), Dialog = h.load('components/selfStructure/AnalysisIfRouteDialog.js').default;
  let view; await act(async () => { view = Renderer.create(React.createElement(Dialog, props())); });
  assert.equal(view.root.findByProps({ testID: 'analysis-if-create' }).props.disabled, true);
  await fill(view);
  await act(async () => view.root.findByProps({ testID: 'analysis-if-count-3' }).props.onPress());
  await act(async () => view.root.findByProps({ testID: 'analysis-if-create' }).props.onPress());
  assert.equal(h.calls.length, 1); assert.equal(h.calls[0].parsedBody.requested_candidate_count, 3);
  assert.deepEqual(h.calls[0].parsedBody.constraint_texts, []);
  assert.equal(h.calls[0].parsedBody.constraints_confirmed, true);
  assert.equal(h.calls[0].parsedBody.scenario_choice_texts, undefined);
  assert.equal(h.calls[0].expectedUserId, owner); assert.equal(h.calls[0].headers['Cache-Control'], 'no-store');
  const body = JSON.stringify(view.toJSON());
  assert(body.includes('架空の選択肢3')); assert(body.includes('並び順はおすすめの順位ではありません。'));
  assert(body.includes('もしもの選択・仮定')); assert(body.includes('相手の反応は不明です。'));
  await act(async () => view.unmount());
});

test('missing meaning is shown as an Analysis question without fabricated candidates', async () => {
  const h = harness(async () => question()), Dialog = h.load('components/selfStructure/AnalysisIfRouteDialog.js').default;
  let view; await act(async () => { view = Renderer.create(React.createElement(Dialog, props())); }); await fill(view);
  await act(async () => view.root.findByProps({ testID: 'analysis-if-create' }).props.onPress());
  assert(JSON.stringify(view.toJSON()).includes('どの点を変えて考えたいですか？'));
  assert(!JSON.stringify(view.toJSON()).includes('架空の選択肢1'));
  assert.equal(view.root.findByProps({ testID: 'analysis-if-intent' }).props.editable, true);
  await act(async () => view.unmount());
});

test('PENDING never automatically calls again and explicit confirmation reuses exactly one key and body', async () => {
  let attempt = 0;
  const h = harness(async () => ++attempt === 1 ? pending() : candidate()), Dialog = h.load('components/selfStructure/AnalysisIfRouteDialog.js').default;
  let view; await act(async () => { view = Renderer.create(React.createElement(Dialog, props())); }); await fill(view);
  await act(async () => view.root.findByProps({ testID: 'analysis-if-create' }).props.onPress());
  assert.equal(attempt, 1); assert.equal(view.root.findByProps({ testID: 'analysis-if-intent' }).props.editable, false);
  await act(async () => {}); assert.equal(attempt, 1);
  await act(async () => view.root.findByProps({ testID: 'analysis-if-retry-same' }).props.onPress());
  assert.equal(attempt, 2); assert.equal(h.calls[0].body, h.calls[1].body);
  await act(async () => view.unmount());
});

test('unknown POST survives close/reopen and only an explicit different-condition action changes identity', async () => {
  let attempt = 0;
  const h = harness(async () => { if (++attempt === 1) throw new TypeError('network failed'); return pending(); });
  const Dialog = h.load('components/selfStructure/AnalysisIfRouteDialog.js').default, p = props(); let view;
  await act(async () => { view = Renderer.create(React.createElement(Dialog, p)); }); await fill(view);
  await act(async () => view.root.findByProps({ testID: 'analysis-if-create' }).props.onPress());
  await act(async () => view.update(React.createElement(Dialog, { ...p, visible: false })));
  assert.equal(view.root.findAllByType('ModalContent').length, 0);
  await act(async () => view.update(React.createElement(Dialog, p)));
  assert.equal(attempt, 1);
  await act(async () => view.root.findByProps({ testID: 'analysis-if-retry-same' }).props.onPress());
  assert.equal(h.calls[0].body, h.calls[1].body);
  await act(async () => view.root.findByProps({ testID: 'analysis-if-restart-different' }).props.onPress());
  await act(async () => view.root.findByProps({ testID: 'analysis-if-intent' }).props.onChangeText('別の条件で考えたい。'));
  await act(async () => view.root.findByProps({ testID: 'analysis-if-create' }).props.onPress());
  assert.notEqual(h.calls[2].parsedBody.idempotency_key, h.calls[1].parsedBody.idempotency_key);
  await act(async () => view.unmount());
});

test('owner, entitlement, projection changes and unmount abort requests and discard late responses', async () => {
  for (const change of ['owner', 'tier', 'projection', 'unmount']) {
    const wait = deferred(), h = harness(() => wait.promise), Dialog = h.load('components/selfStructure/AnalysisIfRouteDialog.js').default;
    const p = props(); let view; await act(async () => { view = Renderer.create(React.createElement(Dialog, p)); }); await fill(view);
    let task; await act(async () => { task = view.root.findByProps({ testID: 'analysis-if-create' }).props.onPress(); });
    if (change === 'unmount') await act(async () => view.unmount());
    else await act(async () => view.update(React.createElement(Dialog, { ...p,
      ...(change === 'owner' ? { ownerId: 'other-owner' } : change === 'tier' ? { tier: 'free' }
        : { baseMapRef: 'artifact:00000000000000000000000000000099@1' }) })));
    assert(h.calls[0].signal.aborted, change);
    await act(async () => { wait.resolve(candidate()); await task; });
    assert(!JSON.stringify(view.toJSON()).includes('架空の選択肢1'), change);
    if (change !== 'unmount') await act(async () => view.unmount());
  }
});

test('two presses in one render cannot start two overlapping generation requests', async () => {
  const wait = deferred(), h = harness(() => wait.promise), Dialog = h.load('components/selfStructure/AnalysisIfRouteDialog.js').default;
  let view; await act(async () => { view = Renderer.create(React.createElement(Dialog, props())); }); await fill(view);
  let task;
  await act(async () => {
    const submit = view.root.findByProps({ testID: 'analysis-if-create' }).props.onPress;
    task = submit(); submit();
  });
  assert.equal(h.calls.length, 1);
  await act(async () => { wait.resolve(candidate()); await task; });
  await act(async () => view.unmount());
});

test('saving commits only the explicitly chosen scenario and optional note', async () => {
  const h = harness(async url => url.includes('saved-route-intents') ? saved() : candidate());
  const Dialog = h.load('components/selfStructure/AnalysisIfRouteDialog.js').default; let view;
  await act(async () => { view = Renderer.create(React.createElement(Dialog, props())); }); await fill(view);
  await act(async () => view.root.findByProps({ testID: 'analysis-if-create' }).props.onPress());
  await act(async () => view.root.findByProps({ testID: 'analysis-if-note' }).props.onChangeText('今はこの方向を考えておきたい。'));
  await act(async () => view.root.findByProps({ testID: 'analysis-if-save-analysis-if-scenario:choice2@1' }).props.onPress());
  const payload = h.calls[1].parsedBody;
  assert.deepEqual(Object.keys(payload).sort(), ['idempotency_key', 'selected_scenario_ref', 'source_scenario_set_ref', 'user_note']);
  assert.equal(payload.selected_scenario_ref, 'analysis-if-scenario:choice2@1');
  assert.equal(payload.source_scenario_set_ref, 'scenario-set:choices@1');
  assert.equal(payload.user_note, '今はこの方向を考えておきたい。');
  assert(JSON.stringify(view.toJSON()).includes('関心の方向を保存しました。'));
  await act(async () => view.unmount());
});

test('Saved history opens and deletes without any current map or new generation', async () => {
  const h = harness(async (url, options) => options.method === 'DELETE' ? { deleted: true, id: saved().id }
    : url.includes(`/${saved().id}`) ? saved() : { status: 'ok', items: [saved()], limit: 60, offset: 0 });
  const Dialog = h.load('components/selfStructure/AnalysisIfRouteDialog.js').default; let view;
  await act(async () => { view = Renderer.create(React.createElement(Dialog, { visible: true, ownerId: owner, tier: 'premium', mode: 'saved', onClose() {} })); });
  assert(JSON.stringify(view.toJSON()).includes('架空の選択肢2'));
  await act(async () => byTitle(view, '保存した内容を開く').props.onPress());
  assert(JSON.stringify(view.toJSON()).includes('実行や達成を示すものではありません。'));
  await act(async () => byTitle(view, 'この保存を削除').props.onPress());
  await act(async () => byTitle(view, '削除する').props.onPress());
  assert(h.calls.every(call => ['GET', 'DELETE'].includes(call.method)));
  assert.equal(h.calls.filter(call => call.method === 'DELETE').length, 1);
  await act(async () => view.unmount());
});

test('iOS hands a node or edge to IF only after the detail dismissal acknowledgement', async () => {
  for (const branch of ['n1', 'e1']) {
    const h = harness(undefined, 'ios'), Map = h.load('components/selfStructure/SemanticWatashiMap.js').default;
    const opened = []; let view;
    await act(async () => { view = Renderer.create(React.createElement(Map, { contentJson: map, onExploreIf: ref => opened.push(ref) })); });
    await act(async () => view.root.findByProps({ testID: `semantic-${branch[0] === 'n' ? 'node' : 'edge'}-${branch}` }).props.onPress());
    const dismiss = view.root.findByType('ModalContent').props.onDismiss;
    await act(async () => view.root.findByProps({ testID: 'semantic-if-open' }).props.onPress());
    assert.deepEqual(opened, []);
    await act(async () => dismiss()); assert.deepEqual(opened, [branch]);
    await act(async () => dismiss()); assert.deepEqual(opened, [branch]);
    await act(async () => view.unmount());
  }
});

test('ordinary Premium map exposes Saved history even when the current map is empty', async () => {
  const h = harness(async () => ({ status: 'ok', items: [], limit: 60, offset: 0 }));
  const View = h.load('components/selfStructure/CumulativeWatashiMapView.js').default; let view;
  await act(async () => { view = Renderer.create(React.createElement(View)); });
  const button = view.root.findByProps({ testID: 'analysis-if-saved-open' });
  await act(async () => button.props.onPress());
  assert(view.root.findAllByProps({ testID: 'analysis-if-dialog' }).length > 0);
  assert(h.calls.some(call => call.url.startsWith('/analysis/saved-route-intents')));
  await act(async () => view.unmount());
});
