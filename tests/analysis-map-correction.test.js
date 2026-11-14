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
const { mapCorrectionTargets, validMapCorrectionQuote, checkedMapCorrectionResult,
  checkedMapCorrectionEvidenceItems, mapCorrectionEvidence } = require('../components/selfStructure/mapCorrectionContract');
const owner = '00000000-0000-0000-0000-000000000001';
const copy = value => JSON.parse(JSON.stringify(value));
const deferred = () => { let resolve, reject; const promise = new Promise((r, j) => { resolve = r; reject = j; }); return { promise, resolve, reject }; };
function result(payload, state = 'ACTIVE') {
  const { idempotency_key, ...fields } = payload;
  return { schema_version: 'cocolon.analysis.map_correction.response.v1', correction_id: '00000000-0000-0000-0000-000000000090',
    ...fields, recorded_at: '2026-11-14T11:00:00+00:00', source_state: state, refresh_status: 'queued' };
}
function latest(map = fixture) {
  const raw = map.projection_of.slice(9).split('@')[0];
  const id = `${raw.slice(0,8)}-${raw.slice(8,12)}-${raw.slice(12,16)}-${raw.slice(16,20)}-${raw.slice(20)}`;
  return { status: 'ok', reason: 'up_to_date', has_visible_content: true, source_profile: 'cumulative.v1', report_id: id,
    generated_at: '2026-11-14T10:00:00Z', meta: map,
    map_context: { profile: 'cumulative.v1', source_count: 4, processed_count: 4, mapped_count: 4,
      unparsed_count: 0, excluded_count: 0, stale_supplement_count: 0 } };
}
function harness(fetchResult = async (url, options) => result(JSON.parse(options.body)), platform = 'android') {
  const calls = [], reads = [], modules = new Map();
  const auth = { session: { user: { id: owner } } }, plan = { tier: 'free', loading: false };
  const native = { Platform: { OS: platform }, AppState: { currentState: 'active', addEventListener: () => ({ remove() {} }) },
    View: 'View', Text: 'Text', ScrollView: 'ScrollView', TextInput: 'TextInput', Switch: 'Switch', ActivityIndicator: 'ActivityIndicator', TouchableOpacity: 'TouchableOpacity',
    Modal: props => props.visible ? React.createElement('ModalContent', props, props.children) : null,
    StyleSheet: { create: value => value, absoluteFill: {} } };
  const api = {
    apiFetch: async (url, options) => {
      calls.push({ url, ...options, parsedBody: options.body ? JSON.parse(options.body) : undefined });
      const value = await fetchResult(url, options);
      return value?.ok !== undefined ? value : { ok: true, status: 200, json: async () => value };
    },
    apiGet: async (url, options) => { reads.push({ url, ...options }); return latest(); }, apiPost: async () => ({}),
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
  return { load, calls, reads, auth, plan, api };
}
const props = () => ({ visible: true, onClose() {}, ownerId: owner, projection: fixture, kind: 'node', targetRef: 'n1' });
async function explain(view, value = 'これは本人の説明です。') {
  await act(async () => view.root.findByProps({ testID: 'map-correction-explanation' }).props.onChangeText(value));
}

test('target control resolves exact shown overview/node/edge fields and distinct unknown items', () => {
  const before = JSON.stringify(fixture);
  assert.deepEqual(mapCorrectionTargets(fixture, 'overview', 'overview').map(t => t.field), ['title', 'summary']);
  assert(mapCorrectionTargets(fixture, 'node', 'n1').some(t => t.field === 'unknowns.0'));
  assert.deepEqual(mapCorrectionTargets(fixture, 'edge', 'e1').map(t => t.field), ['label', 'explanation']);
  assert.deepEqual(mapCorrectionTargets(fixture, 'node', 'missing'), []);
  assert(validMapCorrectionQuote('私は意見を言わなかった。', '意見を言わなかった'));
  assert(!validMapCorrectionQuote('同じ。別。同じ。', '同じ'));
  assert(!validMapCorrectionQuote('元の文章', '新しい文章'));
  assert(validMapCorrectionQuote('絵文字🌸も保持する。', '🌸'));
  assert(!validMapCorrectionQuote('元の文章', '\ud800'));
  assert.equal(JSON.stringify(fixture), before);
});

test('two required fields save person explanation separately and do not claim finished analysis', async () => {
  const h = harness(), Dialog = h.load('components/selfStructure/MapInterpretationCorrectionDialog.js').default, saved = [];
  let view; await act(async () => { view = Renderer.create(React.createElement(Dialog, { ...props(), onSaved: value => saved.push(value) })); });
  assert.equal(view.root.findByProps({ testID: 'map-correction-submit' }).props.disabled, true);
  const shown = view.root.findByProps({ testID: 'map-correction-target' }).props.value;
  assert.equal(shown, fixture.nodes[0].explanation);
  await explain(view, '相手の気持ちを代わりに決めていたわけではありません。');
  await act(async () => view.root.findByProps({ testID: 'map-correction-submit' }).props.onPress());
  assert.equal(h.calls.length, 1); const payload = h.calls[0].parsedBody;
  assert.deepEqual(Object.keys(payload).sort(), ['artifact_ref', 'explanation', 'field', 'idempotency_key', 'kind', 'ref', 'target_text']);
  assert.equal(payload.artifact_ref, fixture.projection_of); assert.equal(payload.kind, 'node'); assert.equal(payload.ref, 'n1');
  assert.equal(payload.field, 'explanation'); assert.equal(payload.target_text, fixture.nodes[0].explanation);
  assert.equal(payload.explanation, '相手の気持ちを代わりに決めていたわけではありません。');
  assert.equal(h.calls[0].expectedUserId, owner); assert.equal(saved.length, 1);
  assert(JSON.stringify(view.toJSON()).includes('更新が完了してから確認できます。'));
  assert(!JSON.stringify(view.toJSON()).includes('分析が完了しました'));
  await act(async () => view.unmount());
});

test('a repeated or fabricated target is rejected locally rather than guessing a target', async () => {
  const map = copy(fixture); map.nodes[0].explanation = '同じ。別。同じ。';
  const h = harness(), Dialog = h.load('components/selfStructure/MapInterpretationCorrectionDialog.js').default; let view;
  await act(async () => { view = Renderer.create(React.createElement(Dialog, { ...props(), projection: map })); }); await explain(view);
  await act(async () => view.root.findByProps({ testID: 'map-correction-target' }).props.onChangeText('同じ'));
  assert.equal(view.root.findByProps({ testID: 'map-correction-submit' }).props.disabled, true);
  await act(async () => view.root.findByProps({ testID: 'map-correction-submit' }).props.onPress());
  assert.equal(h.calls.length, 0);
  await act(async () => view.unmount());
});

test('unknown ACK is confirmed with same owner and key by GET, without a second submission', async () => {
  let payload; const h = harness(async (url, options) => {
    if (options.method === 'POST') { payload = JSON.parse(options.body); throw new TypeError('network failed'); }
    return result(payload);
  });
  const Dialog = h.load('components/selfStructure/MapInterpretationCorrectionDialog.js').default; let view;
  await act(async () => { view = Renderer.create(React.createElement(Dialog, props())); }); await explain(view);
  await act(async () => view.root.findByProps({ testID: 'map-correction-submit' }).props.onPress());
  assert.equal(view.root.findByProps({ testID: 'map-correction-target' }).props.editable, false);
  await act(async () => view.root.findByProps({ testID: 'map-correction-confirm' }).props.onPress());
  assert.deepEqual(h.calls.map(c => c.method), ['POST', 'GET']);
  assert(h.calls[1].url.endsWith(`idempotency_key=${payload.idempotency_key}`));
  assert.equal(h.calls[1].expectedUserId, owner); assert.equal(h.calls[1].body, undefined);
  await act(async () => view.unmount());
});

test('GET404 permits only explicit resend of the identical correction body and key', async () => {
  let attempts = 0; const h = harness(async (url, options) => {
    if (options.method === 'GET') return { ok: false, status: 404 };
    if (++attempts === 1) throw new TypeError('network failed');
    return result(JSON.parse(options.body));
  });
  const Dialog = h.load('components/selfStructure/MapInterpretationCorrectionDialog.js').default, p = props(); let view;
  await act(async () => { view = Renderer.create(React.createElement(Dialog, p)); }); await explain(view);
  await act(async () => view.root.findByProps({ testID: 'map-correction-submit' }).props.onPress());
  await act(async () => view.update(React.createElement(Dialog, { ...p, visible: false })));
  await act(async () => view.update(React.createElement(Dialog, p)));
  assert.equal(h.calls.length, 1);
  await act(async () => view.root.findByProps({ testID: 'map-correction-confirm' }).props.onPress());
  assert.equal(h.calls.length, 2);
  await act(async () => view.root.findByProps({ testID: 'map-correction-resend' }).props.onPress());
  assert.equal(h.calls[0].body, h.calls[2].body);
  await act(async () => view.unmount());
});

test('response target substitution cannot falsely confirm source save', () => {
  const request = { artifact_ref: fixture.projection_of, kind: 'node', ref: 'n1', field: 'summary',
    target_text: fixture.nodes[0].summary, explanation: '本人説明', idempotency_key: 'test-key' };
  assert.equal(checkedMapCorrectionResult(result(request), request).source_state, 'ACTIVE');
  for (const field of ['artifact_ref', 'kind', 'ref', 'field', 'target_text', 'explanation']) {
    const value = result(request); value[field] = 'changed';
    assert.throws(() => checkedMapCorrectionResult(value, request));
  }
});

test('owner, projection and unmount invalidate delayed correction ACK and abort the request', async () => {
  for (const change of ['owner', 'projection', 'unmount']) {
    const wait = deferred(), h = harness(() => wait.promise), Dialog = h.load('components/selfStructure/MapInterpretationCorrectionDialog.js').default;
    const p = props(), callbacks = []; let view;
    await act(async () => { view = Renderer.create(React.createElement(Dialog, { ...p, onSaved: value => callbacks.push(value) })); }); await explain(view);
    let task; await act(async () => { task = view.root.findByProps({ testID: 'map-correction-submit' }).props.onPress(); });
    if (change === 'unmount') await act(async () => view.unmount());
    else {
      const next = copy(fixture); next.projection_of = 'artifact:00000000000000000000000000000099@1';
      await act(async () => view.update(React.createElement(Dialog, { ...p, onSaved: value => callbacks.push(value),
        ...(change === 'owner' ? { ownerId: 'different-owner' } : { projection: next }) })));
    }
    assert(h.calls[0].signal.aborted);
    await act(async () => { wait.resolve(result(h.calls[0].parsedBody)); await task; });
    assert.deepEqual(callbacks, []);
    if (change !== 'unmount') await act(async () => view.unmount());
  }
});

test('iOS overview, node and edge correction handoff waits for native dismissal and rejects old artifacts', async () => {
  for (const [kind, ref, button] of [['overview', 'overview', 'semantic-overview-open'], ['node', 'n1', 'semantic-node-n1'], ['edge', 'e1', 'semantic-edge-e1']]) {
    const h = harness(undefined, 'ios'), Map = h.load('components/selfStructure/SemanticWatashiMap.js').default, calls = [];
    let view; await act(async () => { view = Renderer.create(React.createElement(Map, { contentJson: fixture, onCorrectMap: (...args) => calls.push(args) })); });
    await act(async () => view.root.findByProps({ testID: button }).props.onPress());
    const dismissed = view.root.findByType('ModalContent').props.onDismiss;
    await act(async () => view.root.findByProps({ testID: 'semantic-correction-open' }).props.onPress());
    assert.deepEqual(calls, []);
    await act(async () => dismissed()); assert.deepEqual(calls, [[kind, ref]]);
    await act(async () => dismissed()); assert.equal(calls.length, 1);
    await act(async () => view.root.findByProps({ testID: button }).props.onPress());
    const oldDismiss = view.root.findByType('ModalContent').props.onDismiss;
    await act(async () => view.root.findByProps({ testID: 'semantic-correction-open' }).props.onPress());
    const next = copy(fixture); next.projection_of = 'artifact:00000000000000000000000000000099@1';
    await act(async () => view.update(React.createElement(Map, { contentJson: next, onCorrectMap: (...args) => calls.push(args) })));
    await act(async () => oldDismiss()); assert.equal(calls.length, 1);
    await act(async () => view.unmount());
  }
});

test('ordinary Free current map saves a correction and only rereads existing background state', async () => {
  const h = harness(), View = h.load('components/selfStructure/CumulativeWatashiMapView.js').default; let view;
  await act(async () => { view = Renderer.create(React.createElement(View)); });
  await act(async () => view.root.findByProps({ testID: 'semantic-node-n1' }).props.onPress());
  await act(async () => view.root.findByProps({ testID: 'semantic-correction-open' }).props.onPress());
  assert(view.root.findAllByProps({ testID: 'analysis-map-correction-dialog' }).length);
  await explain(view);
  await act(async () => view.root.findByProps({ testID: 'map-correction-submit' }).props.onPress());
  assert.equal(h.calls.filter(call => call.method === 'POST').length, 1);
  assert(h.reads.some(read => read.url.includes('ensure=false&background=true')));
  assert(!h.reads.some(read => read.url.includes('force=true')));
  assert(JSON.stringify(view.toJSON()).includes('分析の更新が完了してから'));
  await act(async () => view.unmount());
});

function correctionEvidence() {
  return { correction_id: '00000000-0000-0000-0000-000000000090', text: '本人が説明した訂正内容だけの文章。',
    recorded_at: '2026-11-14T11:00:00+00:00', target_artifact_ref: fixture.projection_of,
    target_kind: 'node', target_ref: 'n1', version_state: 'CURRENT' };
}

test('correction evidence remains distinct from original context and deduplicates a shared cohort source', () => {
  const source = correctionEvidence();
  const items = [{ id: 'a', evidence_scope: 'MAP_CORRECTION_CONTEXT', map_corrections: [source] },
    { id: 'b', evidence_scope: 'MAP_CORRECTION_CONTEXT', map_corrections: [copy(source)] }];
  assert.equal(checkedMapCorrectionEvidenceItems(items), items);
  assert.equal(mapCorrectionEvidence(items).length, 1);
  const changed = copy(items); changed[1].map_corrections[0].text = '同じ訂正IDなのに違う説明';
  assert.throws(() => checkedMapCorrectionEvidenceItems(changed));
  const fabricated = copy(items); fabricated[0].map_corrections[0].role = 'ORIGINAL_INPUT';
  assert.throws(() => checkedMapCorrectionEvidenceItems(fabricated));
});

test('evidence dialog labels original cohort as context and person correction under its own heading', async () => {
  const h = harness(), View = h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
  h.api.apiGet = async url => url.includes('/evidence?') ? { items: [1, 2].map(index => ({
    id: `original-${index}`, created_at: '2026-11-13T10:00:00+00:00', memo: `訂正対象の元記録${index}。`, memo_action: '',
    answers: ['通常の本人補足。'], version_state: 'CURRENT', evidence_scope: 'MAP_CORRECTION_CONTEXT',
    map_corrections: [{ ...correctionEvidence(), version_state: 'EDITED_SINCE_ANALYSIS' }],
  })) } : latest();
  let view; await act(async () => { view = Renderer.create(React.createElement(View)); });
  await act(async () => view.root.findByProps({ testID: 'semantic-node-n1' }).props.onPress());
  const button = view.root.findAllByType('TouchableOpacity').find(node => node.findAllByType('Text').some(text => text.props.children === '根拠の記録を見る'));
  await act(async () => button.props.onPress());
  const body = JSON.stringify(view.toJSON());
  assert(body.includes('訂正対象の分析で参照した記録'));
  assert(body.includes('本人によるマップ訂正'));
  assert(body.includes('以下は当時保存した本人の説明です。'));
  assert(!body.includes('この訂正は分析後に変更されています。'));
  assert(body.includes('通常の本人補足。'));
  assert.equal(body.split(correctionEvidence().text).length - 1, 1);
  assert(!body.includes(correctionEvidence().correction_id));
  await act(async () => view.unmount());
});

test('refresh queue failure preserves confirmed correction save without offering a duplicate submission', async () => {
  const h = harness(async (url, options) => ({ ...result(JSON.parse(options.body)), refresh_status: 'failed' }));
  const Dialog = h.load('components/selfStructure/MapInterpretationCorrectionDialog.js').default, saved = []; let view;
  await act(async () => { view = Renderer.create(React.createElement(Dialog, { ...props(), onSaved: value => saved.push(value) })); });
  await explain(view);
  await act(async () => view.root.findByProps({ testID: 'map-correction-submit' }).props.onPress());
  assert.equal(saved.length, 1); assert.equal(saved[0].refresh_status, 'failed');
  assert(JSON.stringify(view.toJSON()).includes('訂正を保存しました。分析の更新を確認できませんでした。'));
  assert.equal(view.root.findAllByProps({ testID: 'map-correction-submit' }).length, 0);
  assert.equal(view.root.findAllByProps({ testID: 'map-correction-confirm' }).length, 0);
  assert.equal(h.calls.length, 1);
  await act(async () => view.unmount());
});

test('captured monthly map remains read-only and never exposes a correction submit entrance', async () => {
  const h = harness(), View = h.load('components/selfStructure/CumulativeWatashiMapView.js').default;
  const identity = latest().report_id;
  h.api.apiGet = async () => ({ item: { id: identity, snapshot_month: '2026-10-01', source_profile: 'cumulative.v1',
    content_json: { watashiMap: fixture, map_context: latest().map_context }, generated_at: '2026-10-10T00:00:00Z' } });
  let view; await act(async () => { view = Renderer.create(React.createElement(View, { reportId: identity, month: '2026-10-01' })); });
  await act(async () => view.root.findByProps({ testID: 'semantic-node-n1' }).props.onPress());
  assert.equal(view.root.findAllByProps({ testID: 'semantic-correction-open' }).length, 0);
  assert.equal(h.calls.length, 0);
  await act(async () => view.unmount());
});
