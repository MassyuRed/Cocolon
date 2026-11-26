// Real live-weather hook, owner scope and RN tree; synthetic authenticated transport.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const Renderer = require('react-test-renderer');
const babel = require('@babel/core');
const fixtures = require('./fixtures/kokoro-weather-live-v1.json');
const ROOT = path.resolve(__dirname, '..');
const compiled = new Map();
const tick = async () => { for (let i = 0; i < 20; i++) await Promise.resolve(); };
const clone = value => JSON.parse(JSON.stringify(value));
async function mount(t, { hold = false, hookOnly = false, parent = false, themeName = 'light' } = {}) {
  const control = { owner: 'A', generation: 0, tier: 'free', focused: true, period: 'today', anchor: null, revision: 0, hold };
  const calls = [], listeners = new Set(), modules = new Map(), events = [];
  const native = Object.fromEntries(['View', 'Text', 'ActivityIndicator', 'Pressable'].map(name => [name, name]));
  const flatten = value => Array.isArray(value) ? Object.assign({}, ...value.map(flatten)) : value || {};
  native.StyleSheet = { create: value => value, flatten, absoluteFill: { position: 'absolute' } };
  native.Animated = { Value: class { constructor(value) { this.value = value; } }, View: 'AnimatedView', timing: () => ({ start() {} }) };
  native.AppState = { currentState: 'active', addEventListener: (_event, listener) => {
    listeners.add(listener); return { remove: () => listeners.delete(listener) };
  } };
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
      if (name === 'react-native-svg') return { __esModule: true, default: 'Svg', Circle: 'Circle', G: 'G' };
      if (name === '@react-native-async-storage/async-storage') return {};
      if (name.includes('Ionicons')) return 'Icon';
      if (name === '@react-navigation/native') return { useIsFocused: () => control.focused };
      const target = path.relative(ROOT, path.resolve(path.dirname(filename), name)) + '.js';
      if (target === 'AuthContext.js') return { useAuth: () => ({ user: control.owner ? { id: control.owner } : null, authOwnerGeneration: control.generation }) };
      if (target === 'SubscriptionContext.js') return { useSubscription: () => ({ tier: control.tier }) };
      if (target === 'theme/ThemeContext.js') return { useTheme: () => ({ colors, themeName }) };
      if (target === 'components/UnreadBadge.js') return { ScreenUnreadBadge: 'Badge' };
      if (target === 'screens/AnalysisMenuCommon.js') return { AnalysisMenuScroll: 'Scroll', useAnalysisMenuStyles: () => ({ colors, ui, themeName }) };
      if (['screens/AnalysisReportViewerScreen.js', 'screens/SelfStructureReportGenerateScreen.js', 'components/selfStructure/WatashiMapRenderer.js'].includes(target)) return { __esModule: true, default: 'SavedViewer' };
      if (target === 'screens/analysisReport/kokoroWeatherFormatters.js') return { isKokoroWeatherReportRecord: () => false };
      if (target === 'lib/apiClient.js') return { apiGet: (url, options) => {
        let resolve, reject;
        const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
        const call = { url, options, resolve, reject }; calls.push(call);
        if (!control.hold) {
          const query = new URL(url, 'http://synthetic').searchParams;
          const payload = clone(fixtures[query.get('period')]);
          if (query.get('period') === 'month' && query.get('anchor') === '2026-10-01') {
            payload.start_date = '2026-10-01'; payload.end_date = '2026-10-31';
            payload.items = Array.from({ length: 31 }, (_, index) => ({ ...clone(fixtures.month.items[0]), date: `2026-10-${String(index + 1).padStart(2, '0')}` }));
          }
          resolve(payload);
        }
        return promise;
      } };
      if (name.startsWith('.')) return load(target);
      throw new Error(name);
    };
    Function('require', 'module', 'exports', 'setTimeout', 'clearTimeout', compiled.get(relative))(requireLocal, module, module.exports, () => 1, () => {});
    modules.set(relative, module.exports); return module.exports;
  }
  const colors = load('theme/ThemeContext.js').THEME_PALETTES[themeName];
  const ui = load('ui/uiTokens.js').makeUiTokens(colors, themeName);
  const { useKokoroWeather } = load('screens/analysis/useKokoroWeather.js');
  let output;
  function Host() { output = useKokoroWeather(control.period, control.anchor, control.revision); return null; }
  const Timeline = load('screens/analysisReport/KokoroWeatherTimeline.js').default;
  const Content = parent ? load('screens/AnalysisContentFirstScreen.js').default : null;
  const element = () => React.createElement(parent ? Content : hookOnly ? Host : Timeline, { colors, ui, period: control.timelinePeriod,
    onPeriodChange: value => events.push(value), graphOpenRequest: control.graphOpenRequest,
    isTutorialMode: control.isTutorialMode, tutorialStep: control.tutorialStep, tutorialGraphData: fixtures });
  let root;
  await Renderer.act(async () => { root = Renderer.create(element()); await tick(); });
  t.after(async () => { await Renderer.act(async () => root.unmount()); });
  const h = { root, calls, control, events, colors, flatten, get output() { return output; },
    async update(values) { Object.assign(control, values); await Renderer.act(async () => { root.update(element()); await tick(); }); },
    async answer(index, data) { await Renderer.act(async () => { calls[index].resolve(clone(data)); await tick(); }); },
    async fail(index) { await Renderer.act(async () => { calls[index].reject(new Error('synthetic failure')); await tick(); }); },
    async press(label) { await Renderer.act(async () => { root.root.findAllByType('Pressable').find(node => node.props.accessibilityLabel === label).props.onPress(); await tick(); }); },
    async background(state) { native.AppState.currentState = state; await Renderer.act(async () => { for (const listener of [...listeners]) listener(state); await tick(); }); },
    async recordsChanged(owner) { await Renderer.act(async () => { load('lib/emotionRecordChanges.js').notifyEmotionRecordsChanged(owner); await tick(); }); },
    text() { return root.root.findAllByType('Text').map(node => node.props.children).flat(Infinity).filter(value => value != null).join(''); },
  };
  return h;
}

test('today uses actual API fixture, weighted donut and time-band records; week/month switch to daily bars', async t => {
  const h = await mount(t);
  assert.match(h.calls[0].url, /\/analysis\/kokoro-weather\?period=today$/);
  assert.equal(h.calls[0].options.expectedUserId, 'A');
  assert.ok(h.calls[0].options.signal instanceof AbortSignal);
  assert.match(h.text(), /今日の感情/);
  assert.equal(h.root.root.findAllByType("Icon").filter(node => node.props.name === "partly-sunny-outline").length, 0);
  assert.ok(h.root.root.findAllByType("Icon").some(node => node.props.name === "chevron-back"));
  assert.match(h.text(), /6件の入力/);
  assert.match(h.text(), /41%/);
  await h.press('朝、6:00–12:00、2件');
  assert.match(h.text(), /08:10/);
  assert.match(h.text(), /喜び・中　不安・弱/);
  await h.press('週');
  assert.equal(h.events.at(-1), 'week');
  assert.equal(h.root.root.findAllByType('Pressable').filter(node => /^\d+\/\d+、/.test(node.props.accessibilityLabel || '')).length, 7);
  assert.ok(h.root.root.findAllByType('Pressable').filter(node => /^\d+\/\d+、/.test(node.props.accessibilityLabel || '')).every(node => node.props.style.flex === 1));
  await h.press('11/3、0件、記録なし');
  assert.match(h.text(), /記録なし/);
  await h.press('月');
  assert.equal(h.events.at(-1), 'month');
  assert.equal(h.root.root.findAllByType('Pressable').filter(node => /^\d+\/\d+、/.test(node.props.accessibilityLabel || '')).length, 8);
  await h.press('前の期間');
  assert.match(h.calls.at(-1).url, /anchor=2026-10-01/);
  const monthSlots = h.root.root.findAllByType('Pressable').filter(node => /^\d+\/\d+、/.test(node.props.accessibilityLabel || ''));
  assert.equal(monthSlots.length, 31);
  assert.ok(monthSlots.every(node => node.props.style.flex === 1));
  const ticks = h.root.root.findAllByType('Text').filter(node => node.props.style?.width === 24);
  assert.deepEqual(ticks.filter(node => node.props.children !== ' ').map(node => node.props.children), [1, 8, 15, 22, 31]);
  assert.ok(ticks.every(node => node.props.numberOfLines === 1));
  assert.doesNotMatch(h.text(), /こころ温度|原因|性格|アドバイス/);
});

test('graph cards and unselected time tiles use visible section borders in light and dark', async t => {
  for (const themeName of ['default', 'light', 'dark']) {
    const h = await mount(t, { themeName });
    const borderWidth = themeName === 'default' ? 0 : 1;
    const sectionColor = h.colors.SECTION_BORDER;
    const assertCardBorders = () => {
      const cards = h.root.root.findAllByType('View').map(node => node.props.style)
        .filter(style => style?.borderRadius === 26);
      assert.equal(cards.length, 2);
      for (const card of cards) {
        assert.equal(card.borderWidth, borderWidth, themeName);
        assert.equal(card.borderColor, sectionColor, themeName);
      }
    };
    assertCardBorders();
    await h.press('朝、6:00–12:00、2件');
    const bands = h.root.root.findAllByType('Pressable')
      .filter(node => /、\d+:00–\d+:00、/.test(node.props.accessibilityLabel || ''));
    assert.equal(bands.length, 4);
    for (const band of bands) {
      const style = h.flatten(band.findByType('AnimatedView').props.style);
      assert.equal(style.borderWidth, 1, themeName);
      assert.equal(style.borderColor, band.props.accessibilityState.selected
        ? h.colors.TITLE_GOLD : borderWidth ? sectionColor : 'transparent', themeName);
    }
    await h.press('週');
    assertCardBorders();
    await h.press('月');
    assertCardBorders();
  }
});

test('a later period response wins when an earlier period completes last', async t => {
  const h = await mount(t, { hold: true, hookOnly: true });
  await h.update({ period: 'month' });
  await h.answer(1, fixtures.month);
  assert.equal(h.output.data.period, 'month');
  await h.answer(0, fixtures.today);
  assert.equal(h.output.data.period, 'month');
});

test('account change and same-account auth generation hide old data and suppress late writes', async t => {
  const h = await mount(t, { hold: true, hookOnly: true });
  await h.answer(0, fixtures.today);
  assert.equal(h.output.data.summary.input_count, 6);
  await h.update({ owner: 'B', generation: 1 });
  assert.equal(h.output.data, null);
  assert.equal(h.calls[0].options.signal.aborted, true);
  assert.equal(h.calls[1].options.expectedUserId, 'B');
  await h.update({ generation: 2 });
  await h.answer(1, fixtures.today);
  assert.equal(h.output.data, null);
  await h.answer(2, fixtures.today);
  assert.equal(h.output.data.summary.input_count, 6);
  await h.update({ owner: null, generation: 3 });
  assert.equal(h.output.data, null);
});

test('unchanged focus reuses the chart, and a saved input or failed refresh invalidates it', async t => {
  const h = await mount(t, { hold: true, hookOnly: true });
  await h.answer(0, fixtures.today);
  await h.update({ focused: false });
  await h.update({ focused: true });
  assert.equal(h.calls.length, 1);
  assert.equal(h.output.data.summary.input_count, 6);
  await h.recordsChanged('B');
  assert.equal(h.calls.length, 1);
  await h.update({ focused: false });
  await h.recordsChanged('A');
  assert.equal(h.calls.length, 1);
  await h.update({ focused: true });
  assert.equal(h.calls.length, 2);
  assert.equal(h.output.data, null);
  const next = clone(fixtures.today); next.summary.input_count = 7;
  await h.answer(1, next);
  assert.equal(h.output.data.summary.input_count, 7);
  await h.update({ revision: 1 });
  await h.fail(2);
  assert.equal(h.output.error, true);
  assert.equal(h.output.data, null);
  await Renderer.act(async () => { h.output.retry(); await tick(); });
  await h.answer(3, { ...fixtures.today, version: 'old' });
  assert.equal(h.output.error, true);
});

test('subscription downgrade clears the validated chart across a hidden return', async t => {
  const h = await mount(t, { hold: true, hookOnly: true });
  await h.update({ tier: 'premium' });
  await h.answer(1, fixtures.today);
  await h.update({ focused: false, tier: 'free' });
  await h.update({ focused: true });
  assert.equal(h.output.data, null);
  assert.equal(h.calls.length, 3);
  await h.answer(2, fixtures.today);
  assert.equal(h.output.data.summary.input_count, 6);
});

test('backgrounding fences old response and foregrounding requests current data', async t => {
  const h = await mount(t, { hold: true, hookOnly: true });
  await h.background('background');
  await h.answer(0, fixtures.today);
  assert.equal(h.output.data, null);
  assert.equal(h.calls[0].options.signal.aborted, true);
  await h.background('active');
  assert.equal(h.calls.length, 2);
  await h.answer(1, fixtures.today);
  assert.equal(h.output.data.summary.input_count, 6);
});

test('month remains selected after the map tab and the chart exposes no legacy report links', async t => {
  const h = await mount(t, { parent: true });
  const intro = h.root.root.findAllByType('Text').slice(0, 3);
  assert.deepEqual(intro.map(node => node.props.children), [
    'あなたの記録から', 'わたしを、振り返る。', '気持ちと、日々の選択を少しずつ。',
  ]);
  assert.equal(intro[1].props.accessibilityRole, 'header');
  await h.press('月');
  await h.press('前の期間');
  const callCount = h.calls.length;
  await h.press('わたしマップ');
  assert.doesNotMatch(h.text(), /この月のこころグラフ/);
  await h.press('こころグラフ');
  assert.match(h.calls.at(-1).url, /period=month/);
  assert.equal(h.calls.length, callCount);
  assert.match(h.text(), /2026年10月/);
  assert.match(h.text(), /この月のこころグラフ/);
  assert.doesNotMatch(h.text(), /の履歴を見る|観測理由/);
  assert.ok(h.calls.every(({ url }) => url.startsWith('/analysis/kokoro-weather?')));
});

test('old report notification targets change the graph tab and period', async t => {
  const h = await mount(t, { parent: true });
  await h.press('わたしマップ');
  await h.update({ graphOpenRequest: { period: 'week' } });
  assert.match(h.calls.at(-1).url, /period=week/);
  assert.match(h.text(), /この週のこころグラフ/);
});

test('the tutorial renders the graph from samples without reading private rows', async t => {
  const h = await mount(t, { parent: true });
  const requestCount = h.calls.length;
  await h.update({ isTutorialMode: true, tutorialStep: 11 });
  assert.match(h.text(), /表示例.*この月のこころグラフ/);
  assert.equal(h.calls.length, requestCount);
  assert.doesNotMatch(h.text(), /の履歴を見る/);
});

test('same-version malformed payloads fail closed instead of reaching the chart renderer', async t => {
  const h = await mount(t, { hold: true, hookOnly: true });
  const bad = clone(fixtures.today); delete bad.items[0].emotion_share_pct;
  await h.answer(0, bad);
  assert.equal(h.output.error, true);
  assert.equal(h.output.data, null);
  await h.update({ revision: 1 });
  const badRecord = clone(fixtures.today); badRecord.time_buckets[1].records[0].emotions = null;
  await h.answer(1, badRecord);
  assert.equal(h.output.error, true);
});
