const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const Renderer = require('react-test-renderer');
const babel = require('@babel/core');
const ROOT = path.resolve(__dirname, '..');
const compiled = new Map();
const tick = async () => { for (let i = 0; i < 25; i++) await Promise.resolve(); };
const metadata = (id = 'r1', type = 'daily') => ({ id, report_type: type, title: 'こころ天気（日） 11/8',
  period_start: '2026-11-07T15:00:00Z', period_end: '2026-11-08T14:59:59Z', kokoro_weather_version: 'kokoro.weather.v1' });
const page = (items = [metadata()], extra = {}) => ({ items, viewer_tier: 'plus', has_more: false, next_offset: null, ...extra });

async function mount(t, { hookOnly = false, viewer = false, parentOwnsRead = true } = {}) {
  const control = { owner: 'A', generation: 0, reportType: 'daily', revision: 0, parentOwnsRead };
  const calls = [], opened = [], listeners = new Set(), modules = new Map();
  const colors = new Proxy({}, { get: () => '#800020' });
  const ui = { typography: new Proxy({}, { get: () => ({}) }), text: {} };
  const native = Object.fromEntries(['View', 'Text', 'ScrollView', 'TouchableOpacity', 'ActivityIndicator', 'RefreshControl', 'TextInput'].map(name => [name, name]));
  native.StyleSheet = { create: value => value, absoluteFillObject: {}, flatten: value => value };
  native.Alert = { alert() {} }; native.NativeModules = {}; native.Linking = {}; native.Share = {};
  native.AppState = { currentState: 'active', addEventListener: (_name, listener) => {
    listeners.add(listener); return { remove: () => listeners.delete(listener) };
  } };
  native.FlatList = props => React.createElement('FlatList', props,
    props.ListHeaderComponent, props.data.map(item => React.createElement(React.Fragment, { key: item.id }, props.renderItem({ item }))),
    !props.data.length && props.ListEmptyComponent, props.ListFooterComponent);
  const request = (method, url, body, options) => {
    let resolve, reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    calls.push({ method, url, body, options, resolve, reject }); return promise;
  };
  function load(relative) {
    if (modules.has(relative)) return modules.get(relative);
    const filename = path.join(ROOT, relative);
    if (!compiled.has(relative)) compiled.set(relative, babel.transformSync(fs.readFileSync(filename, 'utf8'), {
      filename, babelrc: false, configFile: false, presets: [require.resolve('@babel/preset-react')],
      plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')],
    }).code);
    const module = { exports: {} };
    const requireLocal = name => {
      if (name === 'react') return React;
      if (name === 'react-native') return native;
      if (name === 'react-native-safe-area-context') return { SafeAreaView: 'SafeAreaView' };
      if (name.includes('Ionicons')) return 'Icon';
      if (name === '@react-native-async-storage/async-storage') return { getItem: async () => null, setItem: async () => {} };
      const target = path.relative(ROOT, path.resolve(path.dirname(filename), name)) + '.js';
      if (target === 'AuthContext.js') return { useAuth: () => ({ user: control.owner ? { id: control.owner } : null, authOwnerGeneration: control.generation }) };
      if (target === 'UnreadContext.js') return { useUnread: () => ({ getFeatureUnread: () => false }) };
      if (target === 'SubscriptionContext.js') return { useSubscription: () => ({ tier: 'plus', loading: false }) };
      if (target === 'theme/ThemeContext.js') return { useTheme: () => ({ colors, themeName: 'light' }) };
      if (target === 'ui/uiTokens.js') return { makeUiTokens: () => ui };
      if (target === 'ui/applyTypographyTokens.js') return { applyTypographyTokens: styles => styles };
      if (target === 'lib/apiClient.js') return {
        apiGet: (url, options) => request('GET', url, null, options),
        apiPost: (url, body, options) => request('POST', url, body, options),
      };
      if (target === 'lib/supabase.js') return { supabase: { auth: { getSession: async () => ({ data: { session: { user: { id: control.owner } } } }) } } };
      if (target === 'lib/historyRetentionLabel.js') return { getHistoryRetentionLabel: () => '' };
      if (target === 'lib/todayQuestionApi.js') return {};
      if (target === 'screens/analysisReport/analysisReportHtmlExport.js') return { exportTextToPdf: async () => {} };
      if (target === 'screens/analysisReport/AnalysisReportCharts.js') return { PieRingChart: 'Chart' };
      if (target.startsWith('components/') || /screens\/analysisReport\/(AnalysisReportUpgradeCard|KokoroWeatherForecastStrip|KokoroWeatherDetailModal)\.js/.test(target)) return { __esModule: true, default: 'Child' };
      if (name.startsWith('.')) return load(target);
      throw new Error('Unexpected import ' + name);
    };
    Function('require', 'module', 'exports', 'setInterval', 'clearInterval', compiled.get(relative))(requireLocal, module, module.exports, () => 1, () => {});
    modules.set(relative, module.exports); return module.exports;
  }
  const History = load('screens/AnalysisReportHistoryScreen.js').default;
  const useBadges = hookOnly ? load('screens/analysis/useAnalysisUnreadBadges.js').useAnalysisUnreadBadges : null;
  const Viewer = viewer ? load('screens/AnalysisReportViewerScreen.js').default : null;
  let output;
  function Hook() { output = useBadges({ isPaid: false, subscriptionLoading: false }); return null; }
  const element = () => hookOnly ? React.createElement(Hook) : viewer ? React.createElement(Viewer, {
    report: { ...metadata(), content_json: { kokoroWeather: { version: 'kokoro.weather.v1', summary: { input_count: 1 } } } },
    markReadOnOpen: !control.parentOwnsRead,
  }) : React.createElement(History, { reportType: control.reportType, reportReadRevision: control.revision, onOpenReport: item => opened.push(item) });
  let root;
  await Renderer.act(async () => { root = Renderer.create(element()); await tick(); });
  t.after(async () => { await Renderer.act(async () => root.unmount()); });
  return { root, calls, opened, control, get output() { return output; },
    async update(values) { Object.assign(control, values); await Renderer.act(async () => { root.update(element()); await tick(); }); },
    async answer(index, value) { await Renderer.act(async () => { calls[index].resolve(value); await tick(); }); },
    async fail(index) { await Renderer.act(async () => { calls[index].reject(new Error('synthetic failure')); await tick(); }); },
    async pressRow(index = 0) { const button = root.root.findAllByType('TouchableOpacity').filter(node => node.props.accessibilityRole === 'button' && !node.props.accessibilityLabel)[index];
      await Renderer.act(async () => { void button.props.onPress(); await tick(); }); return button; },
    async pressMore() { await Renderer.act(async () => { void root.root.findByProps({ accessibilityLabel: 'さらに履歴を読み込む' }).props.onPress(); await tick(); }); },
    rows() { return root.root.findByType('FlatList').props.data; },
    text() { return root.root.findAllByType('Text').map(node => node.props.children).flat(Infinity).filter(x => typeof x === 'string' || typeof x === 'number').join(''); },
  };
}

test('history loads only metadata, shows it before read-status completes, and fetches one selected detail without waiting for a mark', async t => {
  const h = await mount(t);
  assert.match(h.calls[0].url, /include_body=false/);
  assert.equal(h.calls[0].options.expectedUserId, 'A');
  const row = metadata(); await h.answer(0, page([row]));
  assert.equal(h.rows().length, 1);
  assert.match(h.text(), /こころグラフ（日） 11\/8/);
  assert.equal(row.title, 'こころ天気（日） 11/8');
  await h.pressRow();
  assert.match(h.calls[2].url, /\/analysis\/reports\/r1$/);
  assert.equal(h.opened.length, 0);
  const detail = { ...row, content_text: '保存本文' };
  await h.answer(2, { item: detail, viewer_tier: 'plus' });
  assert.equal(h.opened[0].content_text, '保存本文');
  assert.equal(h.calls.filter(call => call.method === 'POST').length, 0);
});

test('late unread results from before confirmed read cannot replace the new read state', async t => {
  const h = await mount(t);
  await h.answer(0, page());
  await h.update({ revision: 1 });
  await h.answer(2, page());
  await h.answer(3, { read_ids: ['r1'] });
  assert.match(h.text(), /既読/);
  await h.answer(1, { read_ids: [] });
  assert.match(h.text(), /既読/);
});

test('late page from a previous period cannot enter the new history', async t => {
  const h = await mount(t);
  await h.answer(0, page([metadata('d1')], { has_more: true, next_offset: 50 }));
  await h.answer(1, { read_ids: [] });
  await h.pressMore();
  assert.match(h.calls[2].url, /offset=50&include_body=false/);
  await h.update({ reportType: 'monthly' });
  await h.answer(3, page([metadata('m1', 'monthly')]));
  await h.answer(2, page([metadata('d2')]));
  assert.deepEqual(h.rows().map(row => row.id), ['m1']);
});

test('a late first-page read status cannot erase confirmed reads on a faster second page', async t => {
  const h = await mount(t);
  await h.answer(0, page([metadata('d1')], { has_more: true, next_offset: 50 }));
  await h.pressMore();
  await h.answer(2, page([metadata('d2')]));
  await h.answer(3, { read_ids: ['d2'] });
  assert.match(h.text(), /既読/);
  await h.answer(1, { read_ids: [] });
  assert.match(h.text(), /既読/);
  assert.deepEqual(h.rows().map(row => row.id), ['d1', 'd2']);
});

test('owner change hides old rows and cancels a delayed selected detail', async t => {
  const h = await mount(t);
  await h.answer(0, page());
  const button = await h.pressRow();
  const stalePress = button.props.onPress;
  await h.update({ owner: 'B', generation: 1 });
  assert.deepEqual(h.rows(), []);
  assert.equal(h.calls[2].options.signal.aborted, true);
  await h.answer(2, { item: metadata(), viewer_tier: 'plus' });
  assert.equal(h.opened.length, 0);
  const before = h.calls.length;
  await Renderer.act(async () => { await stalePress(); });
  assert.equal(h.calls.length, before);
});

test('read revision advances only after the server confirms the matching report', async t => {
  const h = await mount(t, { hookOnly: true });
  let success;
  await Renderer.act(async () => { success = h.output.markReportRead(metadata()); await tick(); });
  assert.equal(h.output.reportReadRevision, 0);
  await h.answer(0, { marked: true, report_id: 'r1' });
  assert.equal(await success, true);
  assert.equal(h.output.reportReadRevision, 1);
  let failure;
  await Renderer.act(async () => { failure = h.output.markReportRead(metadata('r2')); await tick(); });
  await h.fail(1);
  assert.equal(await failure, false);
  assert.equal(h.output.reportReadRevision, 1);
});

test('a late mark confirmation cannot mutate a later authentication lifetime', async t => {
  const h = await mount(t, { hookOnly: true });
  let pending;
  await Renderer.act(async () => { pending = h.output.markReportRead(metadata()); await tick(); });
  await h.update({ generation: 1 });
  await h.answer(0, { marked: true, report_id: 'r1' });
  assert.equal(await pending, false);
  assert.equal(h.output.reportReadRevision, 0);
});

test('viewer delegates its mark when the parent owns it, while retaining standalone compatibility', async t => {
  const h = await mount(t, { viewer: true });
  assert.equal(h.calls.length, 0);
  await h.update({ parentOwnsRead: false });
  assert.equal(h.calls.filter(call => call.method === 'POST').length, 1);
});

test('display rename changes only the generated leading title and preserves body occurrences', () => {
  const file = path.join(ROOT, 'screens/analysisReport/kokoroWeatherFormatters.js');
  const code = babel.transformSync(fs.readFileSync(file, 'utf8'), { filename: file, babelrc: false, configFile: false,
    plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')] }).code;
  const module = { exports: {} };
  Function('require', 'module', 'exports', code)(() => ({ EMOTIONS: [] }), module, module.exports);
  const { formatKokoroGraphText } = module.exports;
  const body = 'こころ天気（日）：11/8\n本文にある「こころ天気」という言葉は原文のまま。';
  assert.equal(formatKokoroGraphText(body), 'こころグラフ（日）：11/8\n本文にある「こころ天気」という言葉は原文のまま。');
  assert.equal(formatKokoroGraphText('今日はこころ天気を見た。'), '今日はこころ天気を見た。');
});
