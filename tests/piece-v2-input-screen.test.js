'use strict';
// Actual InputScreen and existing Piece API/model/controller/host source.
// TypeScript (already a devDependency) changes JSX/module syntax only. React
// hooks/reconciliation, Home/Emlis hooks, Auth, HTTP, entropy and native UI are
// explicit doubles. This is not an on-device or live-database acceptance test.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const ROOT = path.resolve(__dirname, '..');
const OWNER = '10000000-0000-4000-8000-000000000001';
const INPUT = '20000000-0000-4000-8000-000000000002';
const OTHER = '20000000-0000-4000-8000-000000000099';
const tick = () => new Promise(resolve => setImmediate(resolve));
const clone = value => JSON.parse(JSON.stringify(value));
const packet = (value, status = 200) => ({ status, json: async () => value });
function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
const source = fs.readFileSync(path.join(ROOT, 'screens/InputScreen.js'), 'utf8');
const compiled = ts.transpileModule(source, { fileName: 'InputScreen.tsx',
  reportDiagnostics: true, compilerOptions: { target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: false } });
assert.equal((compiled.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error).length, 0);
const inputOptionsModule = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(ROOT, 'screens/input/inputOptions.js'), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText, { module: inputOptionsModule, exports: inputOptionsModule.exports });
const inputOptions = inputOptionsModule.exports;
function pieceFixture(send) {
  const file = path.join(__dirname, 'piece-v2-saved-input-host.test.js');
  const prefix = fs.readFileSync(file, 'utf8').split('for (const pre of [false, true]) test(')[0];
  const context = vm.createContext({ require: name => name === 'node:test' ? () => {} : require(name),
    __dirname, AbortController, setImmediate });
  vm.runInContext(prefix + '\nglobalThis.fixtureExports = { fixture, ref };', context);
  return { ui: context.fixtureExports.fixture({ send }), ref: context.fixtureExports.ref };
}
function harness(options = {}) {
  const control = { owner: OWNER, enabled: true, tutorial: false, reset: 0, step: 8,
    threadVisible: false, threadBusy: false, threadMode: false,
    result: { id: INPUT, input_feedback: { comment_text: 'PRIVATE_EMLIS_BODY', emlis_ai: {} } },
    ...options };
  const submits = [], notices = [], logs = [], threadOptions = [], threadIds = [], legacyCalls = [], tutorialSeeds = [], listeners = new Map();
  let entropyCalls = 0, writes = 0, mounted = false, cursor = 0, dirty = false, tree;
  const hooks = [], effects = [];
  const noop = () => {};
  const clearDraft = async () => { if (control.clearDraft) await control.clearDraft(); };
  const sameDeps = (a, b) => Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
  const React = {
    createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
    useState: initial => {
      const index = cursor++;
      if (!hooks[index]) hooks[index] = { value: typeof initial === 'function' ? initial() : initial };
      return [hooks[index].value, update => {
        const next = typeof update === 'function' ? update(hooks[index].value) : update;
        if (!Object.is(next, hooks[index].value)) { hooks[index].value = next; dirty = true; writes++; }
      }];
    },
    useRef: initial => {
      const index = cursor++;
      if (!hooks[index]) hooks[index] = { current: initial };
      return hooks[index];
    },
    useMemo: (fn, deps) => {
      const index = cursor++;
      if (!hooks[index] || !sameDeps(hooks[index].deps, deps)) hooks[index] = { deps, value: fn() };
      return hooks[index].value;
    },
    useEffect: (fn, deps) => {
      const index = cursor++;
      if (!hooks[index] || !sameDeps(hooks[index].deps, deps)) {
        const previous = hooks[index];
        hooks[index] = { deps, fn, cleanup: previous?.cleanup };
        effects.push(() => { previous?.cleanup?.(); hooks[index].cleanup = fn(); });
      }
    },
  };
  React.useCallback = (fn, deps) => React.useMemo(() => fn, deps);
  React.useLayoutEffect = React.useEffect;
  const f = pieceFixture(options.send), u = f.ui;
  const Host = u.host.constructor;
  const runtime = u.host.context;
  const screenRuntime = { ...runtime,
    isFeatureEnabled: (name, fallback) => name === 'piece_v2_preview_enabled'
      ? control.enabled === true : name === 'emlis_threads_enabled' ? control.threadMode : fallback,
  };
  u.host.context = screenRuntime;
  const navigation = {
    addListener: (name, fn) => { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn);
      return () => listeners.get(name).delete(fn); },
    navigate: noop, setParams: noop,
  };
  const colors = {}, ref = { current: null };
  const home = { loadHomeState: async () => { if (control.refresh) await control.refresh(); },
    registerInputInteraction: noop, closeStartupPopupWindow: noop, pieceQuota: null,
    setPieceQuota: noop, todayQuestionBundle: null };
  const dependency = name => {
    if (name === 'react') return { __esModule: true, default: React, ...React };
    if (name === 'react-native') return { ActivityIndicator: 'ActivityIndicator', Alert: { alert: (...a) => notices.push(a) },
      Keyboard: { dismiss: noop }, KeyboardAvoidingView: 'KeyboardAvoidingView', Platform: { OS: 'ios' },
      Pressable: 'Pressable', ScrollView: 'ScrollView', StatusBar: 'StatusBar', StyleSheet: { create: x => x },
      Text: 'Text', TouchableWithoutFeedback: 'TouchableWithoutFeedback', View: 'View', useWindowDimensions: () => ({ height: 800 }) };
    if (name === '../AuthContext') return { useAuth: () => ({ session: { user: { id: control.owner } } }) };
    if (name === '../AppRuntimeContext') return { useAppRuntime: () => screenRuntime };
    if (name === '../UnreadContext') return { useUnread: () => ({ setUnread: noop }) };
    if (name === '../TutorialContext') return { useTutorial: () => ({ isTutorialMode: control.tutorial,
      tutorialFlagsLoaded: true, tutorialStep: control.step, tutorialResetToken: control.reset,
      addTutorialEmotion: noop, ensureTutorialPiecesSeed: () => tutorialSeeds.push(true), setTutorialStep: noop }) };
    if (name === '../theme/ThemeContext') return { useTheme: () => ({ colors, themeName: 'light' }) };
    if (name === '../ui/uiTokens') return { makeUiTokens: Function(fs.readFileSync(path.join(ROOT, 'ui/uiTokens.js'), 'utf8').replace(/^export /gm, '') + '\nreturn makeUiTokens;')() };
    if (name === '../ui/applyTypographyTokens') return { applyTypographyTokens: x => x };
    if (name === 'react-native-safe-area-context') return { useSafeAreaInsets: () => ({}) };
    if (name === '../features/home/useHomeState') return { STARTUP_POPUP_KIND: {}, useHomeState: () => ({ ...home,
      startupModalVisible: control.startup === true }) };
    if (name === '../features/home/useHomeActions') return { useHomeActions: () => ({}) };
    if (name === '../lib/api/home/emotionSubmitApi') return { submitEmotionInput: async (payload, opts) => {
      submits.push({ payload: clone(payload), options: clone(opts) });
      return control.submit ? control.submit(submits.length) : clone(control.result);
    } };
    if (name === '../lib/api/home/emotionPieceApi') return Object.fromEntries(
      ['previewEmotionPiece','publishEmotionPiece','cancelEmotionPiece'].map(name => [name, async (...args) => {
        legacyCalls.push({ name, args }); return { preview_id: 'old-preview' };
      }]));
    if (name === '../lib/noticeActionRuntime') return { openNoticeAction: noop };
    if (name === '../lib/analysisHomeSummaryRefreshSignal') return { markAnalysisHomeSummaryDirty: async () => {} };
    if (name === '../lib/compat/legacyWireContracts') return { EMOTION_NOTIFICATION_WIRE: { submitField: 'send_emotion_notification' } };
    if (name === '../tutorial/tutorialScenarioData') return { getTutorialEmlisReplyText: () => 'TUTORIAL_ONLY',
      TUTORIAL_EMLIS_REPLY: { meta: {} }, TUTORIAL_INPUT_SAMPLE: { memo: 'TUTORIAL_INPUT', memoAction: '',
        emotions: [{ type: '自己理解', strength: 'medium' }], categories: ['価値観'] },
      TUTORIAL_PIECE_PREVIEW: { preview_id: 'tutorial-preview', reflection_text: 'TUTORIAL_ONLY' } };
    if (name === './input/inputOptions') return inputOptions;
    if (name === './input/inputDraftModel') return { normalizeInputDraftData: x => x };
    if (name === './input/inputFeedbackModel') return { buildInputFeedbackEmotionMeta: () => ({}) };
    if (name === './input/inputFeedbackObservationDiagnostics') return { logEmlisObservationFrontendDiagnostic: noop };
    if (name === './input/inputNoticeModel') return { isWelcomeNoticePopupCandidate: () => false };
    if (name === './input/useInputKeyboardAwareMemo') return { useInputKeyboardAwareMemo: () => ({
      resetMemoInputHeights: noop, lastFocusTargetRef: ref, focusedFieldRef: ref, memoFocusedRef: ref, keyboardInset: 0 }) };
    if (name === './input/useInputDraftPersistence') return { useInputDraftPersistence: (props) => {
      control.restoreDraft = props.applyInputDraft;
      return ({
      setPendingInputDraft: noop, setDraftRestoreModalVisible: noop, clearPersistedInputDraft: clearDraft,
      draftRestoreModalVisible: control.draftModal === true }); } };
    if (name === './input/useInputFeedbackModal') return { useInputFeedbackModal: () => {
      const [visible, setVisible] = React.useState(false);
      const reset = React.useCallback(() => setVisible(false), []);
      const open = React.useCallback(value => { control.observation = value; setVisible(true); return true; }, []);
      return { inputFeedbackModalVisible: visible, inputFeedbackModalText: control.observation?.commentText || '',
        openInputFeedbackModal: open, closeInputFeedbackModal: reset, resetInputFeedbackModal: reset,
        completeTutorialAfterReply: noop, setTutorialNavigateAfterReply: noop };
    } };
    if (name === './input/useEmlisThread') return { useEmlisThread: () => ({ visible: control.threadVisible,
      busy: control.threadBusy, close: () => { control.threadVisible = false; control.threadBusy = false; },
      open: async (id, options) => { threadIds.push(id); threadOptions.push(clone(options)); if (control.threadOpen) return control.threadOpen(id);
        control.threadVisible = control.threadMode; return control.threadMode; } }) };
    if (name === './input/useEmlisQuestionPreference') return { useEmlisQuestionPreference: () => ({
      value: control.receiveQuestions !== false,
      ready: control.questionPreferenceReady !== false,
      capture: () => control.questionPreferenceReady === false ? null : control.receiveQuestions !== false,
      setValue: (value) => { control.receiveQuestions = value; },
    }) };
    if (name === './input/InputPieceActionArea') return { __esModule: true, default: Host };
    if (name === '../features/piece/pieceRenderer') return {
      isPieceBitmapSaveAdmitted: control.rendererAdmission || (() => false),
      supportsPieceBitmapCreation: () => control.rendererSupported !== false,
    };
    if (name === '../components/TutorialOverlay') return { __esModule: true, default: 'TutorialOverlay',
      syncTutorialSpotlightTarget: async () => null, waitForTutorialFrames: async () => {} };
    if (name === '../components/UnreadBadge') return { ScreenUnreadBadge: 'ScreenUnreadBadge' };
    return { __esModule: true, default: name.split('/').pop() };
  };
  const module = { exports: {} };
  const context = vm.createContext({ require: dependency, module, exports: module.exports, Uint8Array,
    crypto: options.cryptoAbsent ? undefined : { getRandomValues: bytes => {
      entropyCalls++; if (control.cryptoFailure) throw Error('PRIVATE_ENTROPY_ERROR');
      bytes.fill(entropyCalls); return bytes;
    } },
    console: { warn: (...a) => logs.push(a), error: (...a) => logs.push(a) },
    setTimeout: () => 1, clearTimeout: noop, requestAnimationFrame: () => 1, cancelAnimationFrame: noop,
  });
  vm.runInContext(compiled.outputText, context, { filename: 'InputScreen.js' });
  const Screen = module.exports.default;
  function nodes(node) {
    if (!node || typeof node !== 'object') return [];
    return [node, ...(node.children || []).flat(Infinity).flatMap(nodes)];
  }
  const find = type => nodes(tree).find(n => n.type === type);
  function syncHost() {
    const node = find(Host);
    if (!node) { if (mounted) { u.host.componentWillUnmount(); mounted = false; } return; }
    u.host.props = node.props; u.host.context = screenRuntime;
    if (!mounted) { mounted = true; u.mount(); } else u.host.componentDidUpdate();
  }
  function render(flushEffects = true) {
    let n = 0;
    do {
      assert.ok(++n < 30, 'bounded screen render/effect simulation');
      dirty = false; cursor = 0; tree = Screen({ navigation, route: { params: {} }, saveRecovery: control.saveRecovery });
      if (flushEffects) while (effects.length) effects.shift()();
    } while (flushEffects && dirty);
    syncHost(); return tree;
  }
  function fill(text = 'PRIVATE_INPUT_BODY') {
    find('InputMemoSection').props.setMemo(text); render();
    if (!find('InputEmotionSection').props.selectedEmotions.length) find('InputEmotionSection').props.toggleEmotion('自己理解');
    render(); find('InputCategorySection').props.toggleCategory('価値観'); render();
  }
  const finishObservation = () => {
    find('InputFeedbackReplyModal')?.props.onClose();
    find('EmlisThreadModal')?.props.thread.close(); render();
  };
  render();
  return { control, u, ref: f.ref, submits, notices, logs, threadIds, threadOptions, legacyCalls, tutorialSeeds, render, find, fill, finishObservation,
    navigation, slot: () => find(Host), entry: () => nodes(tree).find(n => n.props.testID === 'piece-saved-input-entry'),
    submit: () => find('InputActionArea').props.handleOk(),
    entropyCalls: () => entropyCalls, writes: () => writes,
    blur: () => { for (const fn of listeners.get('blur') || []) fn(); render(); },
    dispose: () => { if (mounted) { u.host.componentWillUnmount(); mounted = false; }
      for (const hook of hooks) hook?.cleanup?.(); },
  };
}
async function saved(options = {}) {
  const h = harness(options); h.fill(); await h.submit(); h.render(); h.finishObservation(); return h;
}

const INPUT_CATEGORIES = ['生活', '仕事', '趣味', '人間関係', '恋愛', '健康', '学習', '価値観', '人生'];
const INPUT_EMOTIONS = ['喜び', '悲しみ', '怒り', '不安', '平穏'];

test('input harness uses the actual nine categories, five emotions and three string strengths', () => {
  assert.deepEqual(clone(inputOptions.CATEGORY_OPTIONS), INPUT_CATEGORIES);
  assert.deepEqual(clone(inputOptions.EMOTION_ROWS.flat()), [...INPUT_EMOTIONS, '自己理解']);
  assert.equal(inputOptions.SELF_INSIGHT, '自己理解');
  assert.deepEqual(Array.from(inputOptions.VALID_STRENGTHS), ['weak', 'medium', 'strong']);
});

test('owner-scoped draft save and reload retain both fields, all scene selections and per-emotion string strengths', async () => {
  const storage = new Map();
  const module = { exports: {} };
  const output = ts.transpileModule(fs.readFileSync(path.join(ROOT, 'screens/input/inputDraftModel.js'), 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: false },
  }).outputText;
  vm.runInNewContext(output, { module, exports: module.exports, require: name => {
    if (name === './inputOptions') return inputOptions;
    if (name === '@react-native-async-storage/async-storage') return { default: {
      getItem: async key => storage.get(key) ?? null,
      setItem: async (key, value) => storage.set(key, value),
      removeItem: async key => storage.delete(key),
    } };
    assert.fail(`unexpected draft dependency: ${name}`);
  } });
  const model = module.exports;
  for (const strength of ['weak', 'medium', 'strong']) {
    const data = {
      memo: ' 本人が考えたこと。\nまだ答えは出ていません。 ',
      memoAction: '話を聞きました。\nその後は行動しませんでした。',
      selectedEmotions: INPUT_EMOTIONS.map(type => ({ type, strength })),
      selectedCategories: INPUT_CATEGORIES, isSecret: false, sendEmotionNotification: false,
    };
    await model.saveInputDraft(OWNER, data);
    const wire = JSON.parse(storage.get(model.buildInputDraftStorageKey(OWNER)));
    assert.deepEqual(wire.data, data);
    assert.equal(wire.userId, OWNER);
    assert.deepEqual(clone((await model.loadInputDraft(OWNER)).data), data);
    assert.equal(await model.loadInputDraft('different-owner'), null);
  }
  for (const strength of [0, 1, 2, 3, '0', '', null, undefined]) {
    assert.deepEqual(clone(model.normalizeDraftEmotionEntry({ type: '平穏', strength })), { type: '平穏', strength: 'medium' },
      'legacy numeric or missing strength is a medium default, never a selectable zero or a strong value');
  }
  const legacy = model.normalizeInputDraftData({ memo: '旧入力', memoAction: '旧行動', isSecret: true });
  assert.equal(legacy.isSecret, false);
  await model.clearInputDraft(OWNER);
  assert.equal(await model.loadInputDraft(OWNER), null);
});

for (const emotion of INPUT_EMOTIONS) for (const strength of ['weak', 'medium', 'strong']) {
  test(`normal input preserves ${emotion}/${strength} and both original fields in the actual submit payload`, async () => {
    const h = harness({ enabled: false });
    const thought = ' 相談するか、まだ迷っています。\n今は決めません。 ';
    const action = '昨日は手紙を書きました。\n今日は送りませんでした。';
    h.find('InputMemoSection').props.setMemo(thought);
    h.find('InputMemoSection').props.setMemoAction(action); h.render();
    h.find('InputEmotionSection').props.toggleEmotion(emotion); h.render();
    assert.deepEqual(clone(h.find('InputEmotionSection').props.selectedEmotions), [{ type: emotion, strength: 'medium' }]);
    h.find('InputEmotionSection').props.changeStrength(emotion, strength); h.render();
    for (const category of ['生活', '人間関係', '価値観']) {
      h.find('InputCategorySection').props.toggleCategory(category); h.render();
    }
    assert.equal(h.find('InputActionArea').props.canSubmit, true);
    await h.submit();
    assert.equal(h.submits.length, 1);
    const { created_at, ...payload } = h.submits[0].payload;
    assert.ok(Number.isFinite(Date.parse(created_at)));
    assert.deepEqual(payload, {
      emotions: [{ type: emotion, strength }], memo: thought, memo_action: action,
      category: ['生活', '人間関係', '価値観'], is_secret: false, send_emotion_notification: true,
      receive_emlis_questions: true,
    });
    assert.equal(h.submits[0].options.expectedUserId, OWNER);
    h.dispose();
  });
}

test('normal input retains every selected category and the independent strength of multiple emotions', async () => {
  const h = harness({ enabled: false });
  h.find('InputMemoSection').props.setMemo('同じ場面で、いくつもの気持ちがありました。'); h.render();
  const selected = [
    { type: '喜び', strength: 'weak' }, { type: '悲しみ', strength: 'medium' },
    { type: '怒り', strength: 'strong' }, { type: '不安', strength: 'weak' },
    { type: '平穏', strength: 'strong' },
  ];
  for (const { type, strength } of selected) {
    h.find('InputEmotionSection').props.toggleEmotion(type); h.render();
    h.find('InputEmotionSection').props.changeStrength(type, strength); h.render();
  }
  for (const category of INPUT_CATEGORIES) {
    h.find('InputCategorySection').props.toggleCategory(category); h.render();
  }
  h.find('InputActionArea').props.setSendEmotionNotification(false); h.render();
  await h.submit();
  assert.equal(h.submits.length, 1);
  assert.deepEqual(h.submits[0].payload.emotions, selected);
  assert.deepEqual(h.submits[0].payload.category, INPUT_CATEGORIES);
  assert.equal(h.submits[0].payload.send_emotion_notification, false);
  assert.equal(h.submits[0].payload.is_secret, false);
  assert.equal(Object.hasOwn(h.submits[0].payload, 'memo_action'), false);
  h.dispose();
});

test('self insight replaces ordinary emotions, remains exclusive and submits the medium wire value', async () => {
  const h = harness({ enabled: false });
  h.find('InputMemoSection').props.setMemo('自分が大切にしたいことを考えました。'); h.render();
  for (const emotion of ['喜び', '不安']) {
    h.find('InputEmotionSection').props.toggleEmotion(emotion); h.render();
  }
  h.find('InputEmotionSection').props.toggleEmotion('自己理解'); h.render();
  assert.equal(h.find('InputEmotionSection').props.isSelfInsightSelected, true);
  for (const emotion of INPUT_EMOTIONS) {
    h.find('InputEmotionSection').props.toggleEmotion(emotion); h.render();
  }
  assert.deepEqual(clone(h.find('InputEmotionSection').props.selectedEmotions), [{ type: '自己理解', strength: 'medium' }]);
  h.find('InputEmotionSection').props.toggleEmotion('自己理解'); h.render();
  assert.equal(h.find('InputEmotionSection').props.isSelfInsightSelected, false);
  assert.equal(h.find('InputEmotionSection').props.selectedEmotions.length, 0);
  h.find('InputEmotionSection').props.toggleEmotion('自己理解'); h.render();
  h.find('InputCategorySection').props.toggleCategory('人生'); h.render();
  await h.submit();
  assert.deepEqual(h.submits[0].payload.emotions, [{ type: '自己理解', strength: 'medium' }]);
  assert.deepEqual(h.submits[0].payload.category, ['人生']);
  h.dispose();
});

for (const [memo, action] of [
  ['考えだけを残します。\nまだ行動していません。', ''],
  ['', '窓を開けました。\nその後は何もしませんでした。'],
]) test(`normal input permits the ${memo ? 'thought' : 'action'} field alone without moving it to the other field`, async () => {
  const h = harness({ enabled: false });
  h.find('InputMemoSection').props.setMemo(memo);
  h.find('InputMemoSection').props.setMemoAction(action); h.render();
  h.find('InputEmotionSection').props.toggleEmotion('平穏'); h.render();
  h.find('InputCategorySection').props.toggleCategory('生活'); h.render();
  assert.equal(h.find('InputActionArea').props.canSubmit, true);
  await h.submit();
  assert.equal(h.submits.length, 1);
  assert.equal(h.submits[0].payload.memo, memo);
  assert.equal(h.submits[0].payload.memo_action, action || undefined);
  assert.equal(Object.hasOwn(h.submits[0].payload, 'memoAction'), false);
  h.dispose();
});

test('empty input cannot select categories or submit and clearing both fields removes the scene selection', async () => {
  const h = harness({ enabled: false });
  h.find('InputCategorySection').props.toggleCategory('健康'); h.render();
  assert.deepEqual(clone(h.find('InputCategorySection').props.selectedCategories), []);
  h.find('InputEmotionSection').props.toggleEmotion('平穏'); h.render();
  await h.submit(); assert.equal(h.submits.length, 0);
  h.find('InputMemoSection').props.setMemo(' \n\t');
  h.find('InputMemoSection').props.setMemoAction('　\n'); h.render();
  assert.equal(h.find('InputActionArea').props.canSubmit, false);
  h.find('InputCategorySection').props.toggleCategory('健康'); h.render();
  assert.deepEqual(clone(h.find('InputCategorySection').props.selectedCategories), []);
  h.find('InputMemoSection').props.setMemoAction('散歩しました。'); h.render();
  assert.equal(h.find('InputActionArea').props.canSubmit, false, 'a category is still required');
  h.find('InputCategorySection').props.toggleCategory('健康'); h.render();
  assert.equal(h.find('InputActionArea').props.canSubmit, true);
  h.find('InputEmotionSection').props.toggleEmotion('平穏'); h.render();
  assert.equal(h.find('InputActionArea').props.canSubmit, false, 'an emotion is still required');
  h.find('InputEmotionSection').props.toggleEmotion('平穏'); h.render();
  h.find('InputMemoSection').props.setMemoAction(''); h.render();
  assert.deepEqual(clone(h.find('InputCategorySection').props.selectedCategories), []);
  assert.equal(h.find('InputActionArea').props.canSubmit, false);
  await h.submit(); assert.equal(h.submits.length, 0);
  h.dispose();
});

const completeSamples = JSON.parse(fs.readFileSync(path.join(__dirname,
  'fixtures/cocolon-input-contract-samples-20261107.json'), 'utf8'));
test('the replacement sample sheet covers all categories, strengths, self insight and two input fields', () => {
  assert.equal(completeSamples.synthetic, true);
  assert.equal(completeSamples.cases.length, 11);
  const categories = new Set(completeSamples.cases.flatMap(item => item.category));
  assert.deepEqual([...categories].sort(), [...INPUT_CATEGORIES].sort());
  const pairs = new Set(completeSamples.cases.flatMap(item => item.emotion_details)
    .filter(item => item.type !== '自己理解').map(item => `${item.type}:${item.strength}`));
  assert.deepEqual([...pairs].sort(), INPUT_EMOTIONS.flatMap(type =>
    ['weak', 'medium', 'strong'].map(strength => `${type}:${strength}`)).sort());
  assert.ok(completeSamples.cases.some(item => item.memo && !item.memo_action));
  assert.ok(completeSamples.cases.some(item => !item.memo && item.memo_action));
  assert.ok(completeSamples.cases.some(item => item.memo && item.memo_action));
  assert.ok(completeSamples.cases.some(item => item.category.length > 1));
});
for (const sample of completeSamples.cases) test(`replacement sample ${sample.case_id} matches the actual screen submit payload`, async () => {
  const h = harness({ enabled: false });
  h.find('InputMemoSection').props.setMemo(sample.memo);
  h.find('InputMemoSection').props.setMemoAction(sample.memo_action); h.render();
  for (const { type, strength } of sample.emotion_details) {
    h.find('InputEmotionSection').props.toggleEmotion(type); h.render();
    if (type !== '自己理解') {
      h.find('InputEmotionSection').props.changeStrength(type, strength); h.render();
    } else {
      assert.equal(sample.self_insight_strength_ui, null);
      assert.deepEqual(clone(h.find('InputEmotionSection').props.selectedEmotions),
        [{ type: '自己理解', strength: 'medium' }]);
    }
  }
  for (const category of sample.category) {
    h.find('InputCategorySection').props.toggleCategory(category); h.render();
  }
  h.find('InputActionArea').props.setSendEmotionNotification(sample.send_emotion_notification); h.render();
  assert.equal(h.find('InputActionArea').props.canSubmit, true);
  await h.submit();
  assert.equal(h.submits.length, 1);
  const { created_at, ...payload } = h.submits[0].payload;
  assert.ok(Number.isFinite(Date.parse(created_at)));
  assert.deepEqual(payload, { memo: sample.memo,
    ...(sample.memo_action ? { memo_action: sample.memo_action } : {}),
    emotions: sample.emotion_details, category: sample.category,
    send_emotion_notification: sample.send_emotion_notification, is_secret: sample.is_secret,
    receive_emlis_questions: true });
  assert.equal(h.submits[0].options.expectedUserId, OWNER);
  h.dispose();
});

test('InputScreen supplies the explicit renderer predicate to the existing saved-input host without issuing IO', async () => {
  const admission = () => false;
  const h = await saved({ rendererAdmission: admission });
  assert.equal(h.slot().props.isSaveAdmitted, admission);
  assert.equal(h.u.calls.length, 0); const writes = h.writes();
  assert.equal(h.slot().props.isSaveAdmitted({}, Object.freeze({})), false);
  assert.equal(h.writes(), writes); assert.equal(h.u.calls.length, 0); h.dispose();
});

test('unsupported renderer leaves input saving intact and creates neither a Piece ticket nor an Emlis launcher', async () => {
  const h = await saved({ rendererSupported: false });
  assert.equal(h.submits.length, 1);
  assert.equal(h.slot(), undefined);
  assert.equal(h.find('EmlisThreadModal').props.pieceEnabled, false);
  assert.equal(h.entropyCalls(), 0);
  assert.equal(h.u.calls.length, 0);
  h.dispose();
});

test('confirmed save reaches the real Piece host after the existing observation closes; no automatic IO', async () => {
  const h = harness(); h.fill(); assert.equal(h.slot(), undefined);
  await h.submit(); h.render(); assert.equal(h.slot(), undefined, 'observation still visible');
  h.finishObservation(); assert.ok(h.entry(), 'B10_INPUTSCREEN_SAVED_SOURCE_CALLER_ABSENT');
  const value = h.slot().props.savedInput;
  assert.deepEqual(Object.keys(value).sort(), ['expectedUserId', 'idempotencyKey', 'savedInputId']);
  assert.equal(value.savedInputId, INPUT); assert.equal(value.expectedUserId, OWNER);
  assert.match(value.idempotencyKey, /^piece-preview-[0-9a-f]{32}$/);
  assert.doesNotMatch(JSON.stringify(value), /PRIVATE|token|comment_text|eligible|tier|quota/);
  assert.equal(h.entropyCalls(), 1); assert.equal(h.u.calls.length, 0);
  assert.equal(h.submits.length, 1); assert.equal(h.submits[0].payload.memo, 'PRIVATE_INPUT_BODY');
  assert.equal(h.submits[0].options.expectedUserId, OWNER);
  assert.deepEqual(clone(h.u.names()), ['保存入力を確認']);
  h.u.host.start(); assert.equal(h.u.calls.length, 0);
  await h.u.host.resolveSavedInput(); assert.deepEqual(clone(h.u.names()), ['この入力をPieceにする']);
  h.u.host.start(); await tick();
  assert.equal(h.u.calls.length, 2); assert.equal(h.u.calls[0][1].method, 'GET');
  assert.equal(h.u.calls[1][1].headers['Idempotency-Key'], value.idempotencyKey);
  assert.equal(h.u.body().children.join(''), h.u.expected.piece_text);
  assert.doesNotMatch(h.u.calls[1][1].body, /PRIVATE_INPUT_BODY|PRIVATE_EMLIS_BODY|owner_user_id/);
  h.dispose();
});

test('thread reader visibility also defers the saved-input action without using its visible text', async () => {
  const h = harness({ threadMode: true }); h.fill(); await h.submit(); h.render();
  assert.equal(h.slot(), undefined); assert.deepEqual(h.threadIds, [INPUT]);
  h.finishObservation(); assert.ok(h.slot(), 'B10_THREAD_SAVED_SOURCE_CALLER_ABSENT');
  assert.equal(h.u.calls.length, 0); h.dispose();
});

test('closing an unsuccessful observation reader never makes a source eligible', async () => {
  const h = await saved({ threadMode: true, send: async () => packet({ code: 'PIECE_SOURCE_NOT_ELIGIBLE' }, 422) });
  assert.ok(h.slot(), 'saved source checking action must be connected');
  await h.u.host.resolveSavedInput(); h.u.host.start();
  assert.equal(h.u.calls.length, 1); assert.equal(h.u.body(), undefined);
  assert.deepEqual(clone(h.u.names()), []); h.dispose();
});

for (const enabled of [false, undefined, 'true']) test(`default/non-boolean flag ${String(enabled)} never exposes the new path`, async () => {
  const h = await saved({ enabled }); assert.equal(h.slot(), undefined);
  assert.equal(h.entropyCalls(), 0); assert.equal(h.u.calls.length, 0);
  assert.equal(h.submits.length, 1); h.dispose();
});
for (const id of [undefined, null, 1, 'bad', '00000000-0000-0000-0000-000000000000']) test(`unconfirmed saved ID ${String(id)} cannot create a Piece intent`, async () => {
  const h = await saved({ result: { id, input_feedback: { comment_text: 'ordinary observation' } } });
  assert.equal(h.slot(), undefined); assert.equal(h.entropyCalls(), 0); assert.equal(h.u.calls.length, 0); h.dispose();
});

for (const timeout of [false, true]) test(`save ${timeout ? 'timeout' : 'failure'} does not invent or retain a saved selection`, async () => {
  const h = await saved(); h.fill('next input');
  h.control.submit = async () => { const e = Error('synthetic failure'); if (timeout) e.name = 'TimeoutError'; throw e; };
  await h.submit(); h.render();
  assert.equal(h.slot(), undefined); assert.equal(h.entropyCalls(), 1); assert.equal(h.u.calls.length, 0); h.dispose();
});

test('pending save cannot show a Piece action or generate a key early', async () => {
  const d = deferred(), h = harness({ submit: () => d.promise }); h.fill();
  const pending = h.submit(); h.render(); assert.equal(h.slot(), undefined); assert.equal(h.entropyCalls(), 0);
  d.resolve(h.control.result); await pending; h.render(); h.finishObservation();
  assert.ok(h.slot(), 'B10_CONFIRMED_SAVE_HANDOFF_ABSENT'); h.dispose();
});

test('rerenders, modal reopening and foreground preserve one selection key without automatic generation', async () => {
  const h = await saved(); assert.ok(h.slot(), 'B10_SAVED_SELECTION_ABSENT');
  const key = h.slot().props.savedInput.idempotencyKey;
  h.render(); h.render(); await h.u.host.resolveSavedInput(); h.u.host.start(); await tick();
  h.u.host.close(); h.render(); h.u.host.start(); await tick();
  assert.equal(h.u.calls.length, 3);
  assert.equal(h.u.calls[1][1].headers['Idempotency-Key'], key);
  assert.equal(h.u.calls[2][1].headers['Idempotency-Key'], key);
  h.u.background('inactive'); h.u.background('active'); h.render();
  assert.equal(h.u.calls.length, 3); assert.equal(h.slot().props.savedInput.idempotencyKey, key);
  assert.equal(h.entropyCalls(), 1); h.dispose();
});

test('starting another draft conceals the old saved-input action without binding raw draft text', async () => {
  const h = await saved(); assert.ok(h.slot(), 'B10_SAVED_SELECTION_ABSENT');
  const key = h.slot().props.savedInput.idempotencyKey;
  h.find('InputMemoSection').props.setMemo('NEW_PRIVATE_DRAFT'); h.render(); assert.equal(h.slot(), undefined);
  h.find('InputMemoSection').props.setMemo(''); h.render();
  assert.equal(h.slot().props.savedInput.idempotencyKey, key); assert.equal(h.entropyCalls(), 1); h.dispose();
});

test('a different successful save receives a distinct opaque key and confirmed ID', async () => {
  const h = await saved(); assert.ok(h.slot(), 'B10_SAVED_SELECTION_ABSENT');
  const key = h.slot().props.savedInput.idempotencyKey;
  h.control.result.id = OTHER; h.fill('second input'); await h.submit(); h.render(); h.finishObservation();
  assert.equal(h.slot().props.savedInput.savedInputId, OTHER);
  assert.notEqual(h.slot().props.savedInput.idempotencyKey, key); assert.equal(h.entropyCalls(), 2); h.dispose();
});

for (const returnToOwner of [false, true]) test(`late save after account change${returnToOwner ? ' and return' : ''} cannot create a Piece selection`, async () => {
  const d = deferred(), h = harness({ submit: () => d.promise }); h.fill(); const pending = h.submit(); h.render();
  h.control.owner = 'other-owner'; h.render();
  if (returnToOwner) { h.control.owner = OWNER; h.render(); }
  d.resolve(h.control.result); await pending; h.render(); h.finishObservation();
  assert.equal(h.slot(), undefined); assert.equal(h.entropyCalls(), 0); h.dispose();
});

test('already displayed text is removed on account switch before passive screen effects', async () => {
  const h = await saved(); assert.ok(h.slot(), 'B10_SAVED_SELECTION_ABSENT');
  await h.u.host.resolveSavedInput(); h.u.host.start(); await tick(); assert.ok(h.u.body());
  h.control.owner = 'other-owner'; h.render(false);
  assert.equal(h.slot(), undefined); assert.equal(h.u.tree(), null); h.render(); h.dispose();
});

test('screen blur while saving fences a late handoff; blur after selection aborts source IO', async () => {
  const d = deferred(), h = harness({ submit: () => d.promise }); h.fill(); const pending = h.submit(); h.render();
  h.blur(); d.resolve(h.control.result); await pending; h.render(); h.finishObservation();
  assert.equal(h.slot(), undefined); assert.equal(h.entropyCalls(), 0); h.dispose();
  const get = deferred(), ready = await saved({ send: () => get.promise });
  assert.ok(ready.slot(), 'B10_SAVED_SELECTION_ABSENT');
  const request = ready.u.host.resolveSavedInput(); await tick(); ready.blur();
  assert.equal(ready.u.calls[0][1].signal.aborted, true);
  get.resolve(packet(ready.ref())); await request;
  assert.equal(ready.slot(), undefined); assert.equal(ready.u.tree(), null); ready.dispose();
});

test('unmount before save completion does not create a key or update the unmounted screen', async () => {
  const d = deferred(), h = harness({ submit: () => d.promise }); h.fill(); const pending = h.submit(); h.render();
  h.dispose(); const writes = h.writes(); d.resolve(h.control.result); await pending;
  assert.equal(h.entropyCalls(), 0); assert.equal(h.writes(), writes); assert.equal(h.u.calls.length, 0);
});

test('tutorial path never treats its synthetic ID or observation as a saved Piece source', async () => {
  const h = await saved({ tutorial: true }); assert.equal(h.slot(), undefined);
  assert.equal(h.submits.length, 0); assert.equal(h.entropyCalls(), 0); h.dispose();
});

test('tutorial/reset boundary during an in-flight real save fences the old Piece selection', async () => {
  const d = deferred(), h = harness({ submit: () => d.promise }); h.fill(); const pending = h.submit(); h.render();
  h.control.tutorial = true; h.control.reset = 1; h.render();
  h.control.tutorial = false; h.render(); d.resolve(h.control.result); await pending; h.render(); h.finishObservation();
  assert.equal(h.slot(), undefined); assert.equal(h.entropyCalls(), 0); h.dispose();
});

for (const flag of ['cryptoAbsent', 'cryptoFailure']) test(`${flag} cannot fail input saving or replace entropy with a guessed key`, async () => {
  const h = await saved({ [flag]: true }); assert.equal(h.slot(), undefined);
  assert.equal(h.submits.length, 1); assert.equal(h.notices.length, 0); assert.equal(h.u.calls.length, 0); h.dispose();
});

test('only the latest concurrent save attempt can select an input for Piece', async () => {
  const first = deferred(), second = deferred();
  const h = harness({ submit: n => n === 1 ? first.promise : second.promise }); h.fill();
  const handler = h.find('InputActionArea').props.handleOk;
  const a = handler(), b = handler(); h.render();
  second.resolve({ id: OTHER, input_feedback: { comment_text: 'second' } }); await b; h.render(); h.finishObservation();
  assert.ok(h.slot(), 'B10_LATEST_SAVE_SELECTION_ABSENT');
  const key = h.slot().props.savedInput.idempotencyKey;
  first.resolve(h.control.result); await a; h.render(); h.finishObservation();
  assert.equal(h.slot().props.savedInput.savedInputId, OTHER);
  assert.equal(h.slot().props.savedInput.idempotencyKey, key); assert.equal(h.entropyCalls(), 1); h.dispose();
});

test('runtime denial before save settlement prevents a key; a later enable never auto-selects or generates', async () => {
  const d = deferred(), h = harness({ submit: () => d.promise }); h.fill(); const pending = h.submit(); h.render();
  h.control.enabled = false; h.render(); d.resolve(h.control.result); await pending; h.render(); h.finishObservation();
  h.control.enabled = true; h.render();
  assert.equal(h.slot(), undefined); assert.equal(h.entropyCalls(), 0); assert.equal(h.u.calls.length, 0); h.dispose();
});

test('InputScreen keeps the same cancellation host through background runtime OFF and explicit retry after refresh', async () => {
  const d = deferred(); let h, deletes = 0;
  h = await saved({ send: async (_url, opt) => {
    if (opt.method === 'GET') return packet(h.ref());
    if (opt.method === 'POST') return packet(h.u.expected);
    assert.equal(opt.method, 'DELETE');
    if (++deletes === 1) return d.promise;
    return packet({ preview_id: h.u.expected.preview_id, preview_revision: 1, row_version: 2,
      lifecycle_status: 'cancelled', idempotency_replayed: true });
  } });
  await h.u.host.resolveSavedInput(); h.u.host.start(); await tick();
  const controller = h.u.host.controller, key = h.slot().props.savedInput.idempotencyKey;
  h.u.nodes(h.u.tree()).find(n => n.props.title === '候補を取り消す').props.onPress(); await tick();
  h.u.background('inactive'); h.control.enabled = false;
  h.u.host.context.runtime = { loaded: true, loading: true }; h.render();
  assert.ok(h.slot()); assert.equal(h.u.host.controller, controller);
  assert.equal(h.u.tree(), null); assert.equal(h.entry().props.style, undefined);
  assert.equal(h.entry().children.flat(Infinity).filter(n => n?.type === 'Text').length, 0);
  d.resolve(packet({ preview_id: h.u.expected.preview_id, preview_revision: 1, row_version: 2,
    lifecycle_status: 'cancelled', idempotency_replayed: false })); await tick();
  h.u.background('active'); h.render(); assert.equal(h.u.tree(), null);
  h.control.enabled = true; h.u.host.context.runtime = { loaded: true, loading: false }; h.render();
  assert.equal(h.u.host.controller, controller); assert.equal(h.slot().props.savedInput.idempotencyKey, key);
  assert.equal(h.u.calls.length, 3); assert.equal(h.u.body(), undefined);
  assert.deepEqual(clone(h.u.names()), ['同じ候補の取消を再試行']);
  h.u.host.retry(); await tick();
  assert.deepEqual(clone(h.u.calls.map(c => c[1].method)), ['GET', 'POST', 'DELETE', 'DELETE']);
  assert.equal(h.u.calls[2][1].body, h.u.calls[3][1].body);
  assert.equal(controller.getView().phase, 'cancelled'); h.dispose();
});

test('screen-fed preview failure retries exactly the original request and key', async () => {
  let posts = 0, h;
  h = await saved({ send: async (_url, options) => {
    if (options.method === 'GET') return packet(h.ref());
    if (++posts === 1) throw Error('PRIVATE_PROVIDER_ERROR');
    return packet(h.u.expected);
  } });
  assert.ok(h.slot(), 'B10_SAVED_SELECTION_ABSENT');
  await h.u.host.resolveSavedInput(); h.u.host.start(); await tick();
  const retry = h.u.nodes(h.u.tree()).find(n => n.type === 'Button' && n.props.title === '同じ要求で再試行');
  assert.ok(retry); retry.props.onPress(); await tick();
  assert.equal(h.u.calls[1][1].body, h.u.calls[2][1].body);
  assert.equal(h.u.calls[1][1].headers['Idempotency-Key'], h.u.calls[2][1].headers['Idempotency-Key']);
  assert.equal(h.entropyCalls(), 1); assert.equal(h.u.body().children.join(''), h.u.expected.piece_text); h.dispose();
});


test('InputScreen supplies its existing navigator to the saved Piece host without widening saved-input data', async () => {
  const saveRecovery = { find: () => undefined };
  const h = await saved({ saveRecovery });
  assert.equal(h.slot().props.navigation, h.navigation);
  assert.equal(h.slot().props.saveRecovery, saveRecovery);
  assert.deepEqual(Object.keys(h.slot().props.savedInput).sort(), ['expectedUserId', 'idempotencyKey', 'savedInputId']);
  assert.equal(h.u.calls.length, 0); h.dispose();
});

// Render the actual action component: the InputScreen harness deliberately
// leaves ordinary child components opaque, which alone cannot check buttons.
function actionButtons(h) {
  const output = ts.transpileModule(fs.readFileSync(path.join(ROOT, 'screens/input/InputActionArea.js'), 'utf8'),
    { fileName: 'InputActionArea.tsx', compilerOptions: { target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: false } }).outputText;
  const module = { exports: {} }, React = { createElement: (type, props, ...children) => ({ type, props, children }) };
  vm.runInNewContext(output, { module, exports: module.exports, require: name => name === 'react'
    ? { default: React } : name === 'react-native' ? { Platform: { OS: 'ios' }, Text: 'Text', View: 'View' }
      : { default: name.split('/').pop() } });
  const walk = node => !node || typeof node !== 'object' ? []
    : [node, ...(node.children || []).flat(Infinity).flatMap(walk)];
  return walk(module.exports.default(h.find('InputActionArea').props)).filter(n => n.type === 'CocolonButton');
}

for (const enabled of [false, true]) {
  test(`normal input has only the submit action and no old modal with Piece v2 ${enabled ? 'ON' : 'OFF'}`, () => {
    const h = harness({ enabled }); h.fill();
    assert.deepEqual(actionButtons(h).map(n => n.props.accessibilityLabel), ['この内容でOK']);
    assert.equal(h.find('InputPiecePreviewController'), undefined); h.dispose();
  });
  test(`normal input cannot call raw Piece preview even by a retained callback with v2 ${enabled ? 'ON' : 'OFF'}`, async () => {
    const h = harness({ enabled }); h.fill();
    await h.find('InputActionArea').props.handlePreviewPiece(); h.render();
    assert.equal(h.legacyCalls.length, 0); assert.equal(h.u.calls.length, 0);
    assert.equal(h.find('InputPiecePreviewController'), undefined); h.dispose();
  });
}

test('tutorial keeps its local sample preview and observation flow without any Piece HTTP', async () => {
  const h = harness({ tutorial: true, step: 7 }); h.fill();
  const button = actionButtons(h).find(n => n.props.accessibilityLabel === 'ピースを生成する');
  assert.ok(button); assert.equal(button.props.disabled, false);
  await button.props.onPress(); h.render();
  const modal = h.find('InputPiecePreviewController');
  assert.equal(modal.props.visible, true); assert.equal(modal.props.previewPayload.preview_id, 'tutorial-preview');
  await modal.props.onPublish(); h.render();
  assert.equal(h.tutorialSeeds.length, 1); assert.equal(h.control.observation.commentText, 'TUTORIAL_ONLY');
  assert.equal(h.legacyCalls.length, 0); assert.equal(h.u.calls.length, 0); assert.equal(h.submits.length, 0); h.dispose();
});

const leaveTutorialSelection = {
  mode: h => { h.control.tutorial = false; },
  owner: h => { h.control.owner = 'other-owner'; },
  reset: h => { h.control.reset++; },
};
for (const [name, change] of Object.entries(leaveTutorialSelection)) {
  test(`old tutorial preview callback cannot reopen after ${name} changes`, async () => {
    const h = harness({ tutorial: true, step: 7 }); h.fill();
    assert.equal(h.find('InputActionArea').props.canPreviewPiece, true);
    const preview = h.find('InputActionArea').props.handlePreviewPiece;
    change(h); h.render(); const writes = h.writes();
    await preview(); assert.equal(h.writes(), writes); assert.equal(h.legacyCalls.length, 0); h.dispose();
  });
  test(`pending tutorial confirmation cannot show its observation after ${name} changes`, async () => {
    const h = harness({ tutorial: true, step: 7 }); h.fill();
    await h.find('InputActionArea').props.handlePreviewPiece(); h.render();
    assert.equal(h.find('InputPiecePreviewController').props.visible, true);
    const wait = deferred(); h.control.clearDraft = () => wait.promise;
    const pending = h.find('InputPiecePreviewController').props.onPublish();
    await tick(); change(h); h.render(); const writes = h.writes();
    wait.resolve(); await pending;
    assert.equal(h.writes(), writes); assert.equal(h.control.observation, undefined);
    assert.equal(h.legacyCalls.length, 0); h.dispose();
  });
}

for (const pending of [false, true]) test(`saved input forwards async pending marker to the GET reader (${pending})`, async () => {
  const h = harness({ threadMode: true, result: { id: INPUT, input_feedback: pending ? {
    comment_text: '', emlis_ai: { observation_status: 'unavailable', rejection_reasons: ['thread_reply_pending'] }
  } : null } });
  h.fill(); await h.submit(); h.render();
  assert.equal(h.threadOptions.length, 1);
  assert.equal(h.threadOptions[0].showNotCreated, pending);
  assert.equal(h.threadOptions[0].waitForInitial, pending);
  h.dispose();
});


test('question OFF is captured independently from notifications and retained through success and draft restoration', async () => {
  const h = harness({ receiveQuestions: false });
  h.fill();
  h.control.restoreDraft({ selectedEmotions: [{ type: '自己理解', strength: 'medium' }],
    memo: '復元した原入力', memoAction: '', selectedCategories: ['価値観'], sendEmotionNotification: true,
    receive_emlis_questions: true });
  h.render(); await h.submit(); h.render();
  assert.equal(h.submits[0].payload.receive_emlis_questions, false);
  assert.equal(h.submits[0].payload.send_emotion_notification, true);
  assert.equal(h.submits[0].payload.memo, '復元した原入力');
  assert.equal(h.find('InputActionArea').props.emlisQuestionPreference.value, false);
  h.finishObservation(); h.fill('次の原入力'); await h.submit();
  assert.equal(h.submits[1].payload.receive_emlis_questions, false);
  h.dispose();
});

test('question preference loading blocks both the submit button and a previously rendered handler', async () => {
  const h = harness(); h.fill();
  const oldSubmit = h.find('InputActionArea').props.handleOk;
  h.control.questionPreferenceReady = false;
  await oldSubmit();
  assert.equal(h.submits.length, 0, 'capture checks current readiness even before a rerender');
  h.render(); assert.equal(h.find('InputActionArea').props.canSubmit, false);
  await h.submit(); assert.equal(h.submits.length, 0);
  h.control.questionPreferenceReady = true; h.control.receiveQuestions = false;
  h.render(); await h.submit();
  assert.equal(h.submits[0].payload.receive_emlis_questions, false);
  h.dispose();
});

test('in-flight emotion request keeps the captured question choice when the next selection changes', async () => {
  const saved = deferred();
  const h = harness({ receiveQuestions: false, submit: () => saved.promise }); h.fill();
  const pending = h.submit(); h.render();
  assert.equal(h.submits[0].payload.receive_emlis_questions, false);
  h.control.receiveQuestions = true; h.render();
  saved.resolve({ id: INPUT, input_feedback: { comment_text: '保存済み応答', emlis_ai: {} } });
  await pending; h.render();
  assert.equal(h.submits[0].payload.receive_emlis_questions, false);
  assert.equal(h.submits.length, 1);
  h.dispose();
});
