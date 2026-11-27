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
const CHART_ID = 'live-kokoro';
const periodQuery = call => new URL(call.url, 'https://synthetic.invalid').searchParams;
const datedReads = (h, period) => h.calls.filter(call => periodQuery(call).get('period') === period && periodQuery(call).has('anchor'));
function anchoredToday(date) {
  const sourceDate = fixtures.today.start_date;
  const data = clone(fixtures.today);
  data.start_date = date;
  data.end_date = date;
  data.items[0].date = date;
  for (const property of ['observed_through', 'read_at', 'history_start']) {
    data[property] = data[property].replace(sourceDate, date);
  }
  for (const bucket of data.time_buckets) {
    for (const record of bucket.records) record.created_at = record.created_at.replace(sourceDate, date);
  }
  return data;
}

async function mount(t, { hold = false, hookOnly = false, parent = false, themeName = 'light' } = {}) {
  const control = { owner: 'A', generation: 0, tier: 'free', focused: true, period: 'today', anchor: null, revision: 0, hold };
  const calls = [], listeners = new Set(), modules = new Map(), events = [];
  const native = Object.fromEntries(['View', 'Text', 'ActivityIndicator', 'Pressable', 'ScrollView'].map(name => [name, name]));
  native.useWindowDimensions = () => ({ width: 390, height: 844, fontScale: 1 });
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
          const query = periodQuery(call);
          const period = query.get('period');
          const anchor = query.get('anchor');
          const payload = period === 'today' && anchor ? anchoredToday(anchor) : clone(fixtures[period]);
          if (period === 'month' && anchor === '2026-10-01') {
            payload.start_date = '2026-10-01'; payload.end_date = '2026-10-31';
            payload.items = Array.from({ length: 31 }, (_, index) => ({ ...clone(fixtures.month.items[0]), date: `2026-10-${String(index + 1).padStart(2, '0')}` }));
            payload.summary = { ...clone(fixtures.month.items[0]), recorded_days: 0 };
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
    testIDPrefix: CHART_ID,
    onPeriodChange: value => events.push(value), graphOpenRequest: control.graphOpenRequest,
    isTutorialMode: control.isTutorialMode, tutorialStep: control.tutorialStep, tutorialGraphData: fixtures });
  let root;
  await Renderer.act(async () => { root = Renderer.create(element()); await tick(); });
  t.after(async () => { await Renderer.act(async () => root.unmount()); });
  const h = { root, calls, control, events, colors, flatten, load, get output() { return output; },
    async update(values) { Object.assign(control, values); await Renderer.act(async () => { root.update(element()); await tick(); }); },
    async answer(index, data) { await Renderer.act(async () => { calls[index].resolve(clone(data)); await tick(); }); },
    async fail(index) { await Renderer.act(async () => { calls[index].reject(new Error('synthetic failure')); await tick(); }); },
    async press(label) { await Renderer.act(async () => { root.root.findAllByType('Pressable').find(node => node.props.accessibilityLabel === label).props.onPress(); await tick(); }); },
    byId(suffix) { return root.root.findAllByProps({ testID: `${CHART_ID}-${suffix}` }).at(-1); },
    async pressId(suffix) { await this.press(this.byId(suffix).props.accessibilityLabel); },
    async background(state) { native.AppState.currentState = state; await Renderer.act(async () => { for (const listener of [...listeners]) listener(state); await tick(); }); },
    async recordsChanged(owner) { await Renderer.act(async () => { load('lib/emotionRecordChanges.js').notifyEmotionRecordsChanged(owner); await tick(); }); },
    text() { return root.root.findAllByType('Text').map(node => node.props.children).flat(Infinity).filter(value => value != null).join(''); },
  };
  return h;
}

test('today uses the same weighted donut and time-band records from the API', async t => {
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
  assert.equal(h.calls.length, 1);
  assert.doesNotMatch(h.text(), /こころ温度|原因|性格|アドバイス/);
});

test('day rings and week and month marks use the emotion notification colors', async t => {
  const h = await mount(t);
  const { EMOTION_COLORS, emotionTint } = h.load('ui/emotionColors.js');
  assert.deepEqual(EMOTION_COLORS.map(({ label, color }) => [label, color]), [
    ['喜び', 'rgb(16,185,129)'], ['悲しみ', 'rgb(99,102,241)'],
    ['怒り', 'rgb(239,68,68)'], ['不安', 'rgb(56,189,248)'], ['平穏', 'rgb(234,179,8)'],
  ]);
  for (const { key, label, color } of EMOTION_COLORS) {
    assert.equal(emotionTint(label).bg, color.replace('rgb(', 'rgba(').replace(')', ',0.12)'));
    assert.equal(h.root.root.findAllByType('Circle').some(({ props }) => props.stroke === color),
      fixtures.today.summary.emotion_weights[key] > 0, label);
  }
  for (const period of ['週', '月']) {
    await h.press(period);
    for (const { key, color } of EMOTION_COLORS.filter(({ key }) => key !== 'sadness')) {
      assert.equal(h.flatten(h.byId(`emotion-${key}-8`).props.style).backgroundColor, color);
    }
  }
});

function dayControls(grid) {
  return grid.findAllByType('Pressable')
    .filter(node => node.props.testID?.startsWith(`${CHART_ID}-day-`));
}

test('week shows seven dates and the five emotions as presence, retaining the selected-day detail', async t => {
  const h = await mount(t);
  await h.press('週');
  assert.equal(h.events.at(-1), 'week');
  const grid = h.byId('week-grid');
  assert.deepEqual(dayControls(grid).map(node => Number(node.props.testID.split('-').at(-1))), [2, 3, 4, 5, 6, 7, 8]);
  const headings = grid.findAllByType('Text').map(node => node.props.children);
  for (const name of ['喜び', '悲しみ', '怒り', '不安', '平穏']) assert.ok(headings.includes(name), name);
  for (const key of ['joy', 'anger', 'anxiety', 'calm']) assert.ok(h.byId(`emotion-${key}-8`), key);
  assert.equal(h.byId('emotion-sadness-8'), undefined);
  assert.equal(h.byId('emotion-calm-7'), undefined);
  assert.equal(h.byId('day-8').props.accessibilityState.selected, true);
  assert.match(h.byId('day-8').props.accessibilityLabel, /11\/8、6件.*喜び.*怒り.*不安.*平穏/);
  assert.deepEqual(datedReads(h, 'today').map(call => periodQuery(call).get('anchor')), ['2026-11-08']);
  assert.match(h.text(), /11\/8の記録.*08:10.*喜び・中　不安・弱/);

  const requestCount = h.calls.length;
  await h.update({ focused: false });
  assert.doesNotMatch(h.text(), /08:10/);
  await h.update({ focused: true });
  assert.match(h.text(), /11\/8の記録.*08:10/);
  assert.equal(h.calls.length, requestCount, 'navigation retains the loaded day without a second read');

  await h.pressId('day-3');
  assert.equal(h.byId('day-3').props.accessibilityState.selected, true);
  assert.match(h.text(), /11\/3の記録.*記録なし/);
  assert.doesNotMatch(h.text(), /08:10/);
  assert.equal(datedReads(h, 'today').length, 1, 'an empty day does not retrieve record details');
});

test('month fills out a calendar, keeps markers when highlighting one emotion, and handles a 31-day month', async t => {
  const h = await mount(t);
  await h.press('月');
  assert.equal(h.events.at(-1), 'month');
  let days = dayControls(h.byId('month-grid'));
  assert.deepEqual(days.map(node => Number(node.props.testID.split('-').at(-1))), Array.from({ length: 30 }, (_, index) => index + 1));
  assert.equal(dayControls(h.byId('month-row-1')).length, 1, 'the month starts on Sunday');
  assert.equal(dayControls(h.byId('month-row-2')).length, 7);
  assert.equal(dayControls(h.byId('month-row-6')).length, 1);
  for (let row = 1; row <= 6; row++) assert.equal(h.byId(`month-row-${row}`).children.length, 7);
  assert.equal(h.byId('day-8').props.accessibilityState.selected, true);
  assert.match(h.byId('day-9').props.accessibilityLabel, /11\/9、これから/);
  assert.equal(h.byId('day-9').props.accessibilityState.disabled, true);
  assert.match(h.byId('day-7').props.accessibilityLabel, /11\/7、記録なし/);
  assert.equal(h.byId('day-7').props.accessibilityState.disabled, false);

  assert.equal(h.byId('month-filter-all').props.accessibilityState.selected, true);
  const markOpacity = key => h.flatten(h.byId(`emotion-${key}-8`).props.style).opacity ?? 1;
  assert.equal(markOpacity('joy'), markOpacity('calm'));
  const requestCount = h.calls.length;
  await h.pressId('month-filter-calm');
  assert.equal(h.byId('month-filter-calm').props.accessibilityState.selected, true);
  assert.equal(h.byId('month-filter-all').props.accessibilityState.selected, false);
  assert.equal(h.byId('day-8').props.accessibilityState.selected, true);
  assert.ok(markOpacity('calm') > markOpacity('joy'));
  assert.equal(h.calls.length, requestCount, 'a display filter does not refetch or change the selected date');
  await h.pressId('month-filter-all');
  assert.equal(markOpacity('joy'), markOpacity('calm'));

  await h.press('前の期間');
  assert.equal(periodQuery(datedReads(h, 'month').at(-1)).get('anchor'), '2026-10-01');
  days = dayControls(h.byId('month-grid'));
  assert.deepEqual(days.map(node => Number(node.props.testID.split('-').at(-1))), Array.from({ length: 31 }, (_, index) => index + 1));
  assert.equal(h.byId('day-31').props.accessibilityState.selected, true, 'without records, select the latest eligible day');
  assert.match(h.text(), /10\/31の記録.*記録なし/);
  assert.equal(datedReads(h, 'today').length, 1);
});

test('week distinguishes unavailable dates from empty dates and defaults to the latest actual recording', async t => {
  const h = await mount(t, { hold: true });
  await h.answer(0, fixtures.today);
  await h.press('週');
  const week = clone(fixtures.week);
  const empty = week.items[0];
  week.observed_through = '2026-11-07T21:40:00+09:00';
  week.read_at = week.observed_through;
  week.history_start = '2026-11-03T00:00:00+09:00';
  week.partial_history = true;
  week.items[0].status = 'outside_history';
  week.items[2] = { ...week.items[6], date: '2026-11-04',
    input_count: 101,
    emotion_weights: { ...empty.emotion_weights, joy: 300, anxiety: 1 },
    emotion_share_pct: { ...empty.emotion_share_pct, joy: 100 } };
  week.items[6] = { ...week.items[5], date: '2026-11-08', status: 'future' };
  week.summary = { ...week.items[2], recorded_days: 1 };
  await h.answer(1, week);

  assert.equal(h.byId('day-4').props.accessibilityState.selected, true);
  assert.ok(h.byId('emotion-joy-4'));
  assert.ok(h.byId('emotion-anxiety-4'), 'a positive weight still gets a mark when its share rounds to zero');
  assert.equal(h.byId('emotion-calm-4'), undefined);
  assert.match(h.byId('day-2').props.accessibilityLabel, /閲覧範囲外/);
  assert.match(h.byId('day-8').props.accessibilityLabel, /これから/);
  for (const day of [2, 8]) {
    assert.equal(h.byId(`day-${day}`).props.accessibilityState.disabled, true);
    assert.equal(h.byId(`day-${day}`).props.onPress, undefined);
  }
  assert.match(h.byId('day-7').props.accessibilityLabel, /記録なし/);
  assert.equal(h.byId('day-7').props.accessibilityState.disabled, false);
  assert.deepEqual(datedReads(h, 'today').map(call => periodQuery(call).get('anchor')), ['2026-11-04']);
});

test('selected-day reads reject late date and owner results and show records in timestamp order', async t => {
  const h = await mount(t, { hold: true });
  await h.answer(0, fixtures.today);
  await h.press('週');
  const week = clone(fixtures.week);
  week.items[5] = { ...week.items[6], date: '2026-11-07' };
  week.summary.input_count *= 2;
  week.summary.recorded_days = 2;
  for (const key of Object.keys(week.summary.emotion_weights)) week.summary.emotion_weights[key] *= 2;
  await h.answer(1, week);
  const lateDate = h.calls.indexOf(datedReads(h, 'today').at(-1));
  assert.equal(periodQuery(h.calls[lateDate]).get('anchor'), '2026-11-08');
  await h.pressId('day-7');
  const selectedDate = h.calls.indexOf(datedReads(h, 'today').at(-1));
  assert.equal(periodQuery(h.calls[selectedDate]).get('anchor'), '2026-11-07');
  await h.answer(lateDate, anchoredToday('2026-11-08'));
  assert.doesNotMatch(h.text(), /08:10/);

  const day = anchoredToday('2026-11-07');
  day.time_buckets[1].records[0].created_at = '2026-11-07T08:42:00+09:00';
  day.time_buckets.reverse();
  await h.answer(selectedDate, day);
  assert.match(h.text(), /11\/7の記録.*08:42.*喜び・中　不安・弱.*09:45.*12:30.*21:10/);
  assert.doesNotMatch(h.text(), /08:10/);

  await h.pressId('day-8');
  const oldOwner = h.calls.indexOf(datedReads(h, 'today').at(-1));
  assert.equal(h.calls[oldOwner].options.expectedUserId, 'A');
  assert.notEqual(oldOwner, lateDate);
  await h.update({ owner: 'B', generation: 1 });
  assert.equal(h.calls[oldOwner].options.signal.aborted, true);
  await h.answer(oldOwner, anchoredToday('2026-11-08'));
  assert.doesNotMatch(h.text(), /08:10|08:42/);
  const ownerWeek = h.calls.findIndex(call => call.options.expectedUserId === 'B' && periodQuery(call).get('period') === 'week');
  assert.notEqual(ownerWeek, -1);
  await h.answer(ownerWeek, fixtures.week);
  const newOwner = h.calls.indexOf(datedReads(h, 'today').at(-1));
  assert.equal(h.calls[newOwner].options.expectedUserId, 'B');
  assert.equal(periodQuery(h.calls[newOwner]).get('anchor'), '2026-11-08');
  await h.answer(newOwner, anchoredToday('2026-11-07'));
  assert.doesNotMatch(h.text(), /08:10|08:42/, 'valid data for a different date must not appear');
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
  assert.ok(h.calls.some(call => periodQuery(call).get('period') === 'week'));
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
