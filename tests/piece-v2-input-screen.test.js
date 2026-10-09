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
function pieceFixture(send) {
  const file = path.join(__dirname, 'piece-v2-saved-input-host.test.js');
  const prefix = fs.readFileSync(file, 'utf8').split('for (const pre of [false, true]) test(')[0];
  const context = vm.createContext({ require, __dirname, AbortController, setImmediate });
  vm.runInContext(prefix + '\nglobalThis.fixtureExports = { fixture, ref };', context);
  return { ui: context.fixtureExports.fixture({ send }), ref: context.fixtureExports.ref };
}
function harness(options = {}) {
  const control = { owner: OWNER, enabled: true, tutorial: false, reset: 0,
    threadVisible: false, threadBusy: false, threadMode: false,
    result: { id: INPUT, input_feedback: { comment_text: 'PRIVATE_EMLIS_BODY', emlis_ai: {} } },
    ...options };
  const submits = [], notices = [], logs = [], threadIds = [], listeners = new Map();
  let entropyCalls = 0, writes = 0, mounted = false, cursor = 0, dirty = false, tree;
  const hooks = [], effects = [];
  const noop = () => {};
  const clearDraft = async () => {};
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
      tutorialFlagsLoaded: true, tutorialStep: 8, tutorialResetToken: control.reset,
      addTutorialEmotion: noop, ensureTutorialPiecesSeed: noop, setTutorialStep: noop }) };
    if (name === '../theme/ThemeContext') return { useTheme: () => ({ colors, themeName: 'light' }) };
    if (name === '../ui/uiTokens') return { makeUiTokens: () => ({}) };
    if (name === '../ui/applyTypographyTokens') return { applyTypographyTokens: x => x };
    if (name === 'react-native-safe-area-context') return { useSafeAreaInsets: () => ({}) };
    if (name === '../features/home/useHomeState') return { STARTUP_POPUP_KIND: {}, useHomeState: () => ({ ...home,
      startupModalVisible: control.startup === true }) };
    if (name === '../features/home/useHomeActions') return { useHomeActions: () => ({}) };
    if (name === '../lib/api/home/emotionSubmitApi') return { submitEmotionInput: async (payload, opts) => {
      submits.push({ payload: clone(payload), options: clone(opts) });
      return control.submit ? control.submit(submits.length) : clone(control.result);
    } };
    if (name === '../lib/api/home/emotionPieceApi') return { previewEmotionPiece: async () => { throw Error('legacy not part of Piece v2'); },
      publishEmotionPiece: async () => { throw Error('legacy not part of Piece v2'); }, cancelEmotionPiece: noop };
    if (name === '../lib/noticeActionRuntime') return { openNoticeAction: noop };
    if (name === '../lib/analysisHomeSummaryRefreshSignal') return { markAnalysisHomeSummaryDirty: async () => {} };
    if (name === '../lib/compat/legacyWireContracts') return { EMOTION_NOTIFICATION_WIRE: { submitField: 'send_emotion_notification' } };
    if (name === '../tutorial/tutorialScenarioData') return { getTutorialEmlisReplyText: () => 'TUTORIAL_ONLY', TUTORIAL_EMLIS_REPLY: { meta: {} }, TUTORIAL_INPUT_SAMPLE: {} };
    if (name === './input/inputOptions') return { SELF_INSIGHT: 'self_insight', INPUT_TUTORIAL_STEP_START: 2, INPUT_TUTORIAL_STEP_END: 7 };
    if (name === './input/inputDraftModel') return { normalizeInputDraftData: x => x };
    if (name === './input/inputFeedbackModel') return { buildInputFeedbackEmotionMeta: () => ({}) };
    if (name === './input/inputFeedbackObservationDiagnostics') return { logEmlisObservationFrontendDiagnostic: noop };
    if (name === './input/inputNoticeModel') return { isWelcomeNoticePopupCandidate: () => false };
    if (name === './input/useInputKeyboardAwareMemo') return { useInputKeyboardAwareMemo: () => ({
      resetMemoInputHeights: noop, lastFocusTargetRef: ref, focusedFieldRef: ref, memoFocusedRef: ref, keyboardInset: 0 }) };
    if (name === './input/useInputDraftPersistence') return { useInputDraftPersistence: () => ({
      setPendingInputDraft: noop, setDraftRestoreModalVisible: noop, clearPersistedInputDraft: clearDraft,
      draftRestoreModalVisible: control.draftModal === true }) };
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
      open: async id => { threadIds.push(id); if (control.threadOpen) return control.threadOpen(id);
        control.threadVisible = control.threadMode; return control.threadMode; } }) };
    if (name === './input/InputPieceActionArea') return { __esModule: true, default: Host };
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
      dirty = false; cursor = 0; tree = Screen({ navigation, route: { params: {} } });
      if (flushEffects) while (effects.length) effects.shift()();
    } while (flushEffects && dirty);
    syncHost(); return tree;
  }
  function fill(text = 'PRIVATE_INPUT_BODY') {
    find('InputMemoSection').props.setMemo(text); render();
    if (!find('InputEmotionSection').props.selectedEmotions.length) find('InputEmotionSection').props.toggleEmotion('self_insight');
    render(); find('InputCategorySection').props.toggleCategory('value'); render();
  }
  const finishObservation = () => {
    find('InputFeedbackReplyModal')?.props.onClose();
    find('EmlisThreadModal')?.props.thread.close(); render();
  };
  render();
  return { control, u, ref: f.ref, submits, notices, logs, threadIds, render, find, fill, finishObservation,
    slot: () => find(Host), entry: () => nodes(tree).find(n => n.props.testID === 'piece-saved-input-entry'),
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
