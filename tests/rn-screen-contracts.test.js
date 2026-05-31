const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function assertIncludes(source, tokens, context) {
  for (const token of tokens) {
    assert.ok(
      source.includes(token),
      `${context} must contain ${JSON.stringify(token)}`
    );
  }
}

function assertRegex(source, regex, context) {
  assert.ok(regex.test(source), `${context} must match ${regex}`);
}

function assertNotIncludes(source, tokens, context) {
  for (const token of tokens) {
    assert.ok(
      !source.includes(token),
      `${context} must not contain ${JSON.stringify(token)}`
    );
  }
}

function loadInputFeedbackModelForContractTest() {
  const source = read('screens/input/inputFeedbackModel.js')
    .replace(/export\s+const\s+([A-Za-z0-9_]+)/g, 'const $1')
    .replace(/export\s+function\s+([A-Za-z0-9_]+)/g, 'function $1');

  return Function(`
    ${source}
    return {
      buildInputFeedbackEmotionMeta,
      normalizeEmlisObservationStatus,
      normalizeEmlisObservationReplyKind,
      getEmlisObservationReplyKind,
      getEmlisObservationStatus,
      getEmlisObservationCommentText,
      isPassedEmlisObservationReply,
      buildPassedEmlisObservationModalPayload,
    };
  `)();
}

function loadInputFeedbackObservationDiagnosticsForContractTest() {
  const source = read('screens/input/inputFeedbackObservationDiagnostics.js')
    .replace(/export\s+const\s+([A-Za-z0-9_]+)/g, 'const $1')
    .replace(/export\s+function\s+([A-Za-z0-9_]+)/g, 'function $1');

  return Function('process', `
    ${source}
    return {
      buildEmlisObservationFrontendDiagnostic,
      dumpEmlisObservationFrontendDiagnostic,
      isEmlisObservationFrontendDiagnosticLogEnabled,
      logEmlisObservationFrontendDiagnostic,
    };
  `)(process);
}

test('App root wires providers through Phase 9 navigation/runtime split modules', () => {
  const app = read('App.js');
  const navRef = read('navigation/navigationRef.js');
  const notificationRouting = read('navigation/notificationRouting.js');
  const linkingRuntime = read('navigation/linkingRuntime.js');
  const rootNavigator = read('navigation/RootNavigator.js');
  const mainTabs = read('navigation/MainTabs.js');
  const inputStack = read('navigation/InputStackNavigator.js');
  const analysisStack = read('navigation/AnalysisStackNavigator.js');
  const pieceStack = read('navigation/PieceStackNavigator.js');
  const rankingStack = read('navigation/RankingStackNavigator.js');
  const settingsStack = read('navigation/SettingsStackNavigator.js');
  const runtimeGate = read('runtime/AppRuntimeBootstrapGate.js');
  const runtimeBlocking = read('runtime/AppRuntimeBlockingScreen.js');
  const globalFrame = read('components/GlobalFrameLayout.js');
  const constants = read('navigation/navigationConstants.js');

  assertIncludes(app, [
    'import RootNavigator from "./navigation/RootNavigator";',
    'import AppRuntimeBootstrapGate from "./runtime/AppRuntimeBootstrapGate";',
    'import { appLinking } from "./navigation/linkingRuntime";',
    'import { requestOpenRouteFromNotification } from "./navigation/notificationRouting";',
    'import { navigationRef, tryOpenRouteIfPending } from "./navigation/navigationRef";',
    '<SafeAreaProvider>',
    '<ThemeProvider>',
    '<AppRuntimeProvider>',
    '<AuthProvider>',
    '<SubscriptionProvider>',
    '<TutorialProvider>',
    '<UnreadProvider>',
    '<NavigationContainer',
    '<RootNavigator />',
  ], 'App.js Phase 9 provider shell');

  assertIncludes(constants, [
    'export const MAIN_TAB_ROUTES = new Set(["Input", "Analysis", "Piece", "RankingTop", "Settings"]);',
    'export const PIECE_SUB_ROUTES = new Set',
    'export const ANALYSIS_SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY',
  ], 'navigationConstants.js');

  assertIncludes(navRef, [
    'export const navigationRef = createNavigationContainerRef();',
    'let __pendingOpenRouteFromNotification = null;',
    'export function buildAnalysisRootNavigationParams',
    'export function tryOpenRouteIfPending',
    'export function requestOpenRoute',
    'navigationRef.navigate("Analysis", buildAnalysisRootNavigationParams(target.params))',
  ], 'navigationRef.js');

  assertIncludes(notificationRouting, [
    'export function buildAnalysisNotificationParams',
    'export function resolveNotificationTargetRoute',
    'export function requestOpenRouteFromNotification',
    'type === "today_question" || screen === "Input"',
    'type === "report_distribution"',
    'return { name: "Piece", params: { screen: "EmotionLog" } };',
  ], 'notificationRouting.js');

  assertIncludes(linkingRuntime, [
    'export const appLinking = {',
    'APP_LINK_PREFIXES',
    'buildPublicProfileByShareCodePath(code)',
    'requestOpenRoute({',
    'screen: "Account"',
    'Linking.addEventListener("url"',
  ], 'linkingRuntime.js');

  assertIncludes(rootNavigator, [
    'export default function RootNavigator',
    'startIapPurchaseObserver',
    'stopIapPurchaseObserver',
    'syncPushTokenOnce({ userId })',
    'startPushTokenSync({ userId })',
    'tryOpenRouteIfPending();',
    '<MainTabs key={`main-tabs-${tutorialResetToken || 0}`} />',
  ], 'RootNavigator.js');

  assertIncludes(mainTabs, [
    'export default function MainTabs()',
    'const Tab = createBottomTabNavigator();',
    'function CocolonTabBar(props)',
    'InputStackNavigator',
    'AnalysisStackNavigator',
    'PieceStackNavigator',
    'RankingStackNavigator',
    'SettingsStackNavigator',
    'GlobalFrameLayout',
    'buildAnalysisRootNavigationParams',
    'BottomTabUnreadBadge',
    'setUnread("EmotionLog", "feed"',
    'setUnread("Piece", "piecesNew"',
  ], 'MainTabs.js');

  assertRegex(inputStack, /<InputStack\.Screen\s+name="Input"\s+component=\{InputScreen\}/, 'Input stack registration');
  assertRegex(analysisStack, /<AnalysisStack\.Screen\s+name="Analysis">/, 'Analysis stack registration');
  assertRegex(pieceStack, /<PieceStack\.Screen\s+name="Piece">/, 'Piece stack registration');
  assertRegex(settingsStack, /<SettingsStack\.Screen\s+name="SubscriptionSelect"\s+component=\{SubscriptionSelectScreen\}/, 'Subscription route registration');
  assertIncludes(rankingStack, [
    '<RankingStack.Screen name="RankingTop" component={RankingTopScreen} />',
    '<RankingStack.Screen name="RankingPieceResonances" component={PieceResonanceRankingScreen} />',
  ], 'RankingStackNavigator.js');

  assertIncludes(runtimeGate, [
    'export default function AppRuntimeBootstrapGate',
    'useAppRuntime',
    'refreshAppRuntime',
    'Alert.alert("お知らせ", maintenanceMessage)',
    'AppRuntimeBlockingScreen',
  ], 'AppRuntimeBootstrapGate.js');

  assertIncludes(runtimeBlocking, [
    'export default function AppRuntimeBlockingScreen',
    'アプリの更新が必要です',
    '必要バージョン:',
    'もう一度確認する',
  ], 'AppRuntimeBlockingScreen.js');

  assertIncludes(globalFrame, [
    'export const FRAME_BORDER_WIDTH = 2;',
    'export default function GlobalFrameLayout',
    '～Emotion Limbic Internal Structure～',
    'useSafeAreaInsets',
  ], 'GlobalFrameLayout.js');
});

test('InputScreen keeps the emotion input, Emlis reply, draft, today question, and Piece preview surfaces connected through split helpers', () => {
  const input = read('screens/InputScreen.js');
  const inputOptions = read('screens/input/inputOptions.js');
  const inputDraft = read('screens/input/inputDraftModel.js');
  const inputFeedback = read('screens/input/inputFeedbackModel.js');
  const inputLayout = read('screens/input/inputLayoutModel.js');
  const inputNotice = read('screens/input/inputNoticeModel.js');
  const inputDraftPersistence = read('screens/input/useInputDraftPersistence.js');
  const inputFeedbackModal = read('screens/input/useInputFeedbackModal.js');
  const inputKeyboardMemo = read('screens/input/useInputKeyboardAwareMemo.js');
  const inputMemoSection = read('screens/input/InputMemoSection.js');
  const inputEmotionSection = read('screens/input/InputEmotionSection.js');
  const inputCategorySection = read('screens/input/InputCategorySection.js');
  const inputStartupModals = read('screens/input/InputStartupModals.js');
  const inputFeedbackReplyModal = read('screens/input/InputFeedbackReplyModal.js');
  const inputPiecePreviewController = read('screens/input/InputPiecePreviewController.js');
  const inputActionArea = read('screens/input/InputActionArea.js');
  const inputToastOverlay = read('screens/input/InputToastOverlay.js');

  assertIncludes(input, [
    'import { submitEmotionInput } from "../lib/api/home/emotionSubmitApi";',
    'previewEmotionPiece',
    'publishEmotionPiece',
    'cancelEmotionPiece',
    'InputPiecePreviewController',
    'TodayQuestionCard',
    'InputStartupModals',
    'InputFeedbackReplyModal',
    'InputActionArea',
    'InputToastOverlay',
    'TUTORIAL_TOTAL_STEPS',
    'from "./input/inputOptions";',
    'from "./input/inputDraftModel";',
    'from "./input/inputFeedbackModel";',
    'from "./input/inputNoticeModel";',
    'from "./input/useInputDraftPersistence";',
    'from "./input/useInputFeedbackModal";',
    'from "./input/useInputKeyboardAwareMemo";',
    'from "./input/InputActionArea";',
    'from "./input/InputMemoSection";',
    'from "./input/InputEmotionSection";',
    'from "./input/InputCategorySection";',
    'from "./input/InputStartupModals";',
    'from "./input/InputFeedbackReplyModal";',
    'from "./input/InputPiecePreviewController";',
    'from "./input/InputToastOverlay";',
  ], 'InputScreen.js');

  assertIncludes(inputDraft, [
    'export const INPUT_DRAFT_TTL_HOURS = 48;',
    'export async function saveInputDraft',
    'export async function loadInputDraft',
    'export async function clearInputDraft',
    'export function normalizeInputDraftData',
    'export function hasInputDraftContent',
    'export function formatDraftSavedAt',
    'isSecret: false',
    'AsyncStorage.setItem',
    'AsyncStorage.getItem',
  ], 'inputDraftModel.js');

  assertIncludes(inputOptions, [
    'export const SELF_INSIGHT = "自己理解";',
    'export const EMOTION_ROWS',
    'export const CATEGORY_OPTIONS',
    'export const INPUT_TUTORIAL_STEP_START = 2;',
    'export const INPUT_TUTORIAL_STEP_END = 7;',
  ], 'inputOptions.js');

  for (const emotion of ['"喜び"', '"悲しみ"', '"怒り"', '"不安"', '"平穏"', 'SELF_INSIGHT']) {
    assert.ok(inputOptions.includes(emotion), `inputOptions emotion row must include ${emotion}`);
  }

  for (const category of ['"生活"', '"仕事"', '"趣味"', '"人間関係"', '"恋愛"', '"健康"', '"学習"', '"価値観"', '"人生"']) {
    assert.ok(inputOptions.includes(category), `inputOptions category options must include ${category}`);
  }

  assertIncludes(inputFeedback, [
    'export function buildInputFeedbackEmotionMeta',
    'strengthScoreForFeedback',
    'formatEmotionForFeedback',
    'export function normalizeEmlisObservationStatus',
    'export function isPassedEmlisObservationReply',
    'export function buildPassedEmlisObservationModalPayload',
    '選択した感情：',
    '中心として見ている感情：',
  ], 'inputFeedbackModel.js');

  assertIncludes(inputLayout, [
    'export const MEMO_INPUT_INITIAL_HEIGHT = 44;',
    'export const FOCUSED_INPUT_SCROLL_OFFSET = 110;',
    'export function normalizeMemoInputContentHeight',
    'export function clampMemoInputVisibleHeight',
  ], 'inputLayoutModel.js');

  assertIncludes(inputNotice, [
    'getNoticeButtonActions',
    'export function isWelcomeNoticePopupCandidate',
    'popup_variant',
    'はじめに',
  ], 'inputNoticeModel.js');


  assertIncludes(inputDraftPersistence, [
    'export function useInputDraftPersistence',
    'loadInputDraft',
    'saveInputDraft',
    'clearInputDraft',
    'AppState.addEventListener("change"',
    'navigation?.addListener?.("blur"',
    'restorePendingInputDraft',
    'discardPendingInputDraft',
  ], 'useInputDraftPersistence.js');

  assertIncludes(inputFeedbackModal, [
    'export function useInputFeedbackModal',
    'buildPassedEmlisObservationModalPayload',
    'getEmlisObservationStatus',
    'openInputFeedbackModal',
    'return false;',
    'return true;',
    'completeTutorialAfterReply',
    'closeInputFeedbackModal',
    'setTutorialNavigateAfterReply',
    'navigation?.navigate?.("Analysis")',
  ], 'useInputFeedbackModal.js');

  assertIncludes(inputKeyboardMemo, [
    'export function useInputKeyboardAwareMemo',
    'Keyboard.addListener',
    'scrollResponderScrollNativeHandleToKeyboard',
    'updateMemoInputVisibleHeight',
    'scheduleScrollToFocusedInput',
    'inputMaxHeight',
  ], 'useInputKeyboardAwareMemo.js');


  assertIncludes(inputMemoSection, [
    'export default function InputMemoSection',
    'TextInput',
    'memoInputRef',
    'memoActionInputRef',
    'scheduleScrollToFocusedInput',
    'updateMemoInputVisibleHeight',
  ], 'InputMemoSection.js');

  assertIncludes(inputEmotionSection, [
    'export default function InputEmotionSection',
    'EMOTION_ROWS.map',
    'SELF_INSIGHT',
    'changeStrength',
    'strengthRowRefs.current[cat]',
  ], 'InputEmotionSection.js');

  assertIncludes(inputCategorySection, [
    'export default function InputCategorySection',
    'CATEGORY_OPTIONS.map',
    'toggleCategory(category)',
    'categoryRequiredText',
  ], 'InputCategorySection.js');

  assertIncludes(inputStartupModals, [
    'export default function InputStartupModals',
    'NoticeModal',
    'TodayQuestionModal',
    'draftRestoreModalVisible',
    'INPUT_DRAFT_TTL_HOURS',
  ], 'InputStartupModals.js');

  assertIncludes(inputFeedbackReplyModal, [
    'export default function InputFeedbackReplyModal',
    'isPassedEmlisObservationReply',
    'const shouldShow = Boolean',
    'inputFeedbackBackdrop',
    'Emlisの観測',
    'inputFeedbackMetaText',
  ], 'InputFeedbackReplyModal.js');

  assertIncludes(inputActionArea, [
    'export default function InputActionArea',
    'CocolonSwitch',
    'handlePreviewPiece',
    'handleOk',
    '感情通知を送らない',
  ], 'InputActionArea.js');

  assertIncludes(inputToastOverlay, [
    'export default function InputToastOverlay',
    'toastOverlay',
    'toastCard',
    'checkmark-circle-outline',
  ], 'InputToastOverlay.js');

  assertIncludes(inputPiecePreviewController, [
    'export default function InputPiecePreviewController',
    'EmotionPiecePreviewModal',
    'previewPayload?.quota || pieceQuota || null',
    'hideCancelButton',
  ], 'InputPiecePreviewController.js');

  assertRegex(input, /await\s+submitEmotionInput\(/, 'emotion submit call');
  assertRegex(input, /await\s+previewEmotionPiece\(/, 'Piece preview call');
  assertRegex(input, /await\s+publishEmotionPiece\(/, 'Piece publish call');
  assertIncludes(input, [
    'const openedObservation = openInputFeedbackModal',
    'if (!openedObservation)',
    'completeTutorialAfterReply();',
    'observationStatus: TUTORIAL_EMLIS_REPLY.meta?.observation_status',
    'observationStatus: inputFeedbackAI?.observation_status',
  ], 'InputScreen.js Emlis observation display gate');
  assertNotIncludes(input, [
    'observationStatus: TUTORIAL_EMLIS_REPLY.meta?.observation_status || "passed"',
  ], 'InputScreen.js must not force tutorial Emlis observation passed');
});


test('Step 6 emotion submit timeout recovery avoids save-failure wording and preserves the draft', () => {
  const input = read('screens/InputScreen.js');
  const emotionSubmitApi = read('lib/api/home/emotionSubmitApi.js');

  assertIncludes(emotionSubmitApi, [
    'export const EMOTION_SUBMIT_TIMEOUT_MS = 30000;',
    'apiPost("/emotion/submit", payload || {}, {',
    'timeoutMs: EMOTION_SUBMIT_TIMEOUT_MS,',
  ], 'emotionSubmitApi.js Step 6 submit timeout guard');

  assertIncludes(input, [
    'function isRequestTimeoutError(error)',
    'name === "TimeoutError" || /timed out/i.test(message)',
    'function getEmotionSubmitTimeoutRecoveryMessage(refreshedAfterTimeout)',
    'async function refreshHomeStateAfterEmotionSubmitTimeout(loadHomeState)',
    'await loadHomeState({ force: true, includeStartupCandidate: false });',
    'if (isRequestTimeoutError(error))',
    '記録の完了確認に時間がかかっています。',
    '反映されている場合があるため、画面を更新して確認しました。',
    '反映されている場合があるため、時間をおいて入力履歴を確認してください。',
    '入力欄はそのまま残しています。',
    'Alert.alert(\n          "記録の確認",',
  ], 'InputScreen.js Step 6 timeout recovery branch');

  const timeoutBranchStart = input.indexOf('if (isRequestTimeoutError(error))');
  const timeoutBranchEnd = input.indexOf('console.error("入力処理エラー:", error);', timeoutBranchStart);
  assert.ok(timeoutBranchStart >= 0, 'InputScreen.js Step 6 timeout branch must exist');
  assert.ok(timeoutBranchEnd > timeoutBranchStart, 'InputScreen.js Step 6 timeout branch must end before generic error branch');
  const timeoutBranch = input.slice(timeoutBranchStart, timeoutBranchEnd);

  assertIncludes(timeoutBranch, [
    'const refreshedAfterTimeout = await refreshHomeStateAfterEmotionSubmitTimeout(loadHomeState);',
    'getEmotionSubmitTimeoutRecoveryMessage(refreshedAfterTimeout)',
    'return;',
  ], 'InputScreen.js Step 6 timeout branch refreshes once and returns');
  assertNotIncludes(timeoutBranch, [
    '入力の保存処理に失敗しました。',
    'submitEmotionInput(',
    'clearPersistedInputDraft',
    'setPendingInputDraft(null)',
    'setSelectedEmotions([])',
    'setMemo("")',
    'setMemoAction("")',
    'setSelectedCategories([])',
  ], 'InputScreen.js Step 6 timeout branch must not imply save failure, retry, or clear the draft');
});


test('Step 07 Emlis observation frontend regression keeps passed-only modal display fail-closed', () => {
  const input = read('screens/InputScreen.js');
  const inputFeedback = read('screens/input/inputFeedbackModel.js');
  const inputFeedbackModal = read('screens/input/useInputFeedbackModal.js');
  const inputFeedbackReplyModal = read('screens/input/InputFeedbackReplyModal.js');

  assertIncludes(inputFeedback, [
    'const EMLIS_OBSERVATION_STATUS = Object.freeze({',
    'PASSED: "passed"',
    'REJECTED: "rejected"',
    'UNAVAILABLE: "unavailable"',
    'SAFETY_BLOCKED: "safety_blocked"',
    'getEmlisObservationStatus(input) === EMLIS_OBSERVATION_STATUS.PASSED',
    'Boolean(getEmlisObservationCommentText(input))',
    'observationStatus !== EMLIS_OBSERVATION_STATUS.PASSED || !commentText',
    'return null;',
  ], 'inputFeedbackModel.js Step 07 passed-only payload guard');

  assertIncludes(inputFeedbackModal, [
    'const payload = buildPassedEmlisObservationModalPayload(input);',
    'if (!payload) {',
    'setInputFeedbackModalVisible(false);',
    'setInputFeedbackModalText("");',
    'observationStatus: getEmlisObservationStatus(input)',
    'return false;',
    'setInputFeedbackModalVisible(true);',
    'return true;',
  ], 'useInputFeedbackModal.js Step 07 rejected/unavailable/safety hide guard');

  assertIncludes(inputFeedbackReplyModal, [
    'visible &&',
    'isPassedEmlisObservationReply({',
    'commentText: text,',
    'observationStatus: meta?.observationStatus || meta?.observation_status,',
    '<Modal visible={shouldShow}',
  ], 'InputFeedbackReplyModal.js Step 07 modal visibility guard');

  assertIncludes(input, [
    'const openedObservation = openInputFeedbackModal',
    'if (!openedObservation)',
    'observationStatus: inputFeedbackAI?.observation_status',
  ], 'InputScreen.js Step 07 opens modal only through passed-only helper');
  assertNotIncludes(input, [
    'observationStatus: TUTORIAL_EMLIS_REPLY.meta?.observation_status || "passed"',
    'observationStatus: inputFeedbackAI?.observation_status || "passed"',
  ], 'InputScreen.js Step 07 must not force rejected/unavailable/safety observations to passed');
});

test('Step 08 Complete Composer initial RN contract regression keeps Complete meta from overriding public passed-only display', () => {
  const inputFeedback = read('screens/input/inputFeedbackModel.js');
  const inputFeedbackModal = read('screens/input/useInputFeedbackModal.js');
  const inputFeedbackReplyModal = read('screens/input/InputFeedbackReplyModal.js');
  const input = read('screens/InputScreen.js');

  assertIncludes(inputFeedback, [
    'export function getEmlisObservationStatus(input = {})',
    'input?.input_feedback?.emlis_ai?.observation_status',
    'export function getEmlisObservationCommentText(input = {})',
    'input?.input_feedback?.comment_text',
    'export function buildPassedEmlisObservationModalPayload(input = {})',
    'if (observationStatus !== EMLIS_OBSERVATION_STATUS.PASSED || !commentText)',
    'return null;',
  ], 'inputFeedbackModel.js Step 08 public status/comment_text are the only modal source');

  assertNotIncludes(inputFeedback, [
    'complete_initial',
    'complete_composer_initial',
    'complete_scorecard_event',
    'complete_reply_diagnostics',
    'step6_scorecard_display_passed',
    'display_pass',
  ], 'inputFeedbackModel.js Step 08 must not read Complete diagnostic meta as display source');

  assertIncludes(inputFeedbackModal, [
    'const payload = buildPassedEmlisObservationModalPayload(input);',
    'if (!payload) {',
    'setInputFeedbackModalVisible(false);',
    'setInputFeedbackModalText("");',
    'observationStatus: getEmlisObservationStatus(input)',
    'return false;',
    'setInputFeedbackModalVisible(true);',
    'return true;',
  ], 'useInputFeedbackModal.js Step 08 fail-closed opener');

  assertNotIncludes(inputFeedbackModal, [
    'complete_initial',
    'complete_scorecard_event',
    'complete_reply_diagnostics',
    'display_pass',
  ], 'useInputFeedbackModal.js Step 08 must not add Complete-specific modal exception');

  assertIncludes(inputFeedbackReplyModal, [
    'const shouldShow = Boolean',
    'visible &&',
    'isPassedEmlisObservationReply({',
    'commentText: text,',
    'observationStatus: meta?.observationStatus || meta?.observation_status',
    '<Modal visible={shouldShow}',
  ], 'InputFeedbackReplyModal.js Step 08 public passed/text guard');

  assertNotIncludes(inputFeedbackReplyModal, [
    'complete_initial',
    'complete_scorecard_event',
    'complete_reply_diagnostics',
    'display_pass',
  ], 'InputFeedbackReplyModal.js Step 08 must not show by Complete meta');

  assertNotIncludes(input, [
    'complete_composer_initial',
    'complete_initial_entry_ap0',
    'complete_initial_final_ap0_decision',
    'complete_scorecard_event',
    'complete_reply_diagnostics',
    'step6_scorecard_display_passed',
    'display_pass',
    'observationStatus: inputFeedbackAI?.observation_status || "passed"',
  ], 'InputScreen.js Step 08 must not special-case Complete diagnostics or force passed');

  const {
    getEmlisObservationStatus,
    getEmlisObservationCommentText,
    isPassedEmlisObservationReply,
    buildPassedEmlisObservationModalPayload,
  } = loadInputFeedbackModelForContractTest();

  const passedPublicPayload = {
    input_feedback: {
      comment_text: 'Display Gate passed の public comment_text だけが表示されます。',
      emlis_ai: {
        observation_status: 'passed',
        meta: {
          complete_initial_entry_ap0_decision: { green: true },
          complete_initial_final_ap0_decision: { green: true },
          complete_scorecard_event: { display_pass: true },
        },
      },
    },
  };
  assert.equal(getEmlisObservationStatus(passedPublicPayload), 'passed');
  assert.equal(
    getEmlisObservationCommentText(passedPublicPayload),
    'Display Gate passed の public comment_text だけが表示されます。'
  );
  assert.deepEqual(buildPassedEmlisObservationModalPayload(passedPublicPayload), {
    commentText: 'Display Gate passed の public comment_text だけが表示されます。',
    observationStatus: 'passed',
    emotionSummary: '',
    dominantSummary: '',
    contextLabel: '',
  });

  for (const observation_status of ['rejected', 'unavailable', 'safety_blocked']) {
    const nonPassedPublicPayload = {
      input_feedback: {
        comment_text: 'Complete meta が green でも non-passed なら表示されてはいけません。',
        emlis_ai: {
          observation_status,
          meta: {
            complete_initial_entry_ap0_decision: { green: true, can_proceed_to_complete_initial: true },
            complete_initial_runtime: { status: 'generated', observation_status: 'passed' },
            complete_initial_final_ap0_decision: { green: true },
            complete_scorecard_event: { display_pass: true, display_reach_rate: 1 },
          },
        },
      },
    };
    assert.equal(getEmlisObservationStatus(nonPassedPublicPayload), observation_status);
    assert.equal(isPassedEmlisObservationReply(nonPassedPublicPayload), false);
    assert.equal(buildPassedEmlisObservationModalPayload(nonPassedPublicPayload), null);
  }

  const metaOnlyPassedPayload = {
    input_feedback: {
      comment_text: '',
      emlis_ai: {
        observation_status: '',
        meta: {
          observation_status: 'passed',
          complete_initial_runtime: {
            status: 'generated',
            comment_text: 'meta 内だけの本文は RN 表示対象外です。',
          },
          complete_scorecard_event: { display_pass: true },
        },
      },
    },
  };
  assert.equal(getEmlisObservationStatus(metaOnlyPassedPayload), '');
  assert.equal(getEmlisObservationCommentText(metaOnlyPassedPayload), '');
  assert.equal(isPassedEmlisObservationReply(metaOnlyPassedPayload), false);
  assert.equal(buildPassedEmlisObservationModalPayload(metaOnlyPassedPayload), null);

  const passedBlankPublicTextPayload = {
    input_feedback: {
      comment_text: '   ',
      emlis_ai: {
        observation_status: 'passed',
        meta: {
          complete_initial_runtime: { status: 'generated', comment_text: 'meta本文は使わない' },
          complete_scorecard_event: { display_pass: true },
        },
      },
    },
  };
  assert.equal(getEmlisObservationStatus(passedBlankPublicTextPayload), 'passed');
  assert.equal(getEmlisObservationCommentText(passedBlankPublicTextPayload), '');
  assert.equal(isPassedEmlisObservationReply(passedBlankPublicTextPayload), false);
  assert.equal(buildPassedEmlisObservationModalPayload(passedBlankPublicTextPayload), null);
});



test('Visible Surface Acceptance QA Step 7 RN keeps backend gate meta behind passed plus comment_text contract', () => {
  const inputFeedback = read('screens/input/inputFeedbackModel.js');
  const inputFeedbackModal = read('screens/input/useInputFeedbackModal.js');
  const inputFeedbackReplyModal = read('screens/input/InputFeedbackReplyModal.js');

  assertIncludes(inputFeedback, [
    'export function buildInputFeedbackEmotionMeta',
    'strengthScoreForFeedback',
    '選択した感情：',
    '中心として見ている感情：',
    'export function buildPassedEmlisObservationModalPayload',
    'if (observationStatus !== EMLIS_OBSERVATION_STATUS.PASSED || !commentText)',
    'return null;',
  ], 'inputFeedbackModel.js Visible Surface Acceptance Step 7 contract');

  assertIncludes(inputFeedbackModal, [
    'const payload = buildPassedEmlisObservationModalPayload(input);',
    'if (!payload) {',
    'setInputFeedbackModalVisible(false);',
    'observationStatus: getEmlisObservationStatus(input)',
    'return false;',
  ], 'useInputFeedbackModal.js Visible Surface Acceptance Step 7 opener remains passed-only');

  assertIncludes(inputFeedbackReplyModal, [
    'Emlisの観測',
    'const shouldShow = Boolean',
    'visible &&',
    'isPassedEmlisObservationReply({',
    'commentText: text,',
    'observationStatus: meta?.observationStatus || meta?.observation_status',
    '<Modal visible={shouldShow}',
  ], 'InputFeedbackReplyModal.js Visible Surface Acceptance Step 7 display title and visibility guard');

  assertNotIncludes(inputFeedback + inputFeedbackModal + inputFeedbackReplyModal, [
    'visible_surface_acceptance_gate',
    'candidate_comment_text',
    'raw_input',
    'evidence_text',
    'Userさん',
  ], 'RN Visible Surface Acceptance Step 7 must not branch on backend gate meta, hidden text, raw input, or account-name literals');

  const {
    buildInputFeedbackEmotionMeta,
    getEmlisObservationStatus,
    getEmlisObservationCommentText,
    isPassedEmlisObservationReply,
    buildPassedEmlisObservationModalPayload,
  } = loadInputFeedbackModelForContractTest();

  assert.deepEqual(
    buildInputFeedbackEmotionMeta([
      { type: '悲しみ', strength: 'medium' },
      { type: '不安', strength: 'medium' },
    ]),
    {
      emotionSummary: '選択した感情：悲しみ／不安',
      dominantSummary: '中心として見ている感情：悲しみ',
      dominantLabel: '中心として見ている感情：悲しみ',
    }
  );

  assert.deepEqual(
    buildInputFeedbackEmotionMeta([
      { type: '悲しみ', strength: 'weak' },
      { type: '不安', strength: 'strong' },
    ]),
    {
      emotionSummary: '選択した感情：悲しみ／不安',
      dominantSummary: '中心として見ている感情：不安',
      dominantLabel: '中心として見ている感情：不安',
    }
  );

  const passedWithVisibleGateSummary = {
    input_feedback: {
      comment_text: 'Userさん、Emlisです。\n状態が一色ではありません。',
      emlis_ai: {
        observation_status: 'passed',
        visible_surface_acceptance_gate: {
          evaluated: true,
          passed: true,
          classification: 'yellow',
          action: 'warn',
          rejection_reasons: [],
        },
      },
    },
    ...buildInputFeedbackEmotionMeta([
      { type: '平穏', strength: 'medium' },
      { type: '喜び', strength: 'medium' },
    ]),
  };
  assert.equal(getEmlisObservationStatus(passedWithVisibleGateSummary), 'passed');
  assert.equal(
    getEmlisObservationCommentText(passedWithVisibleGateSummary),
    'Userさん、Emlisです。\n状態が一色ではありません。'
  );
  assert.deepEqual(buildPassedEmlisObservationModalPayload(passedWithVisibleGateSummary), {
    commentText: 'Userさん、Emlisです。\n状態が一色ではありません。',
    observationStatus: 'passed',
    emotionSummary: '選択した感情：平穏／喜び',
    dominantSummary: '中心として見ている感情：平穏',
    contextLabel: '',
  });

  const metaOnlyVisibleGatePayload = {
    input_feedback: {
      comment_text: '',
      emlis_ai: {
        observation_status: '',
        visible_surface_acceptance_gate: {
          evaluated: true,
          passed: true,
          classification: 'pass',
          action: 'allow',
          candidate_comment_text: 'meta内の本文候補はRN表示対象外です。',
          raw_input: 'raw input must stay backend-only',
          evidence_text: 'evidence text must stay backend-only',
        },
      },
    },
  };
  assert.equal(getEmlisObservationStatus(metaOnlyVisibleGatePayload), '');
  assert.equal(getEmlisObservationCommentText(metaOnlyVisibleGatePayload), '');
  assert.equal(isPassedEmlisObservationReply(metaOnlyVisibleGatePayload), false);
  assert.equal(buildPassedEmlisObservationModalPayload(metaOnlyVisibleGatePayload), null);

  for (const observation_status of ['rejected', 'unavailable', 'safety_blocked', '']) {
    const nonPassedWithVisibleGatePass = {
      input_feedback: {
        comment_text: 'Visible Surface Acceptance Gate が allow でも public status が non-passed なら表示しません。',
        emlis_ai: {
          observation_status,
          visible_surface_acceptance_gate: {
            evaluated: true,
            passed: true,
            classification: 'pass',
            action: 'allow',
            rejection_reasons: [],
          },
        },
      },
    };
    assert.equal(getEmlisObservationStatus(nonPassedWithVisibleGatePass), observation_status);
    assert.equal(isPassedEmlisObservationReply(nonPassedWithVisibleGatePass), false);
    assert.equal(buildPassedEmlisObservationModalPayload(nonPassedWithVisibleGatePass), null);
  }
});


test('Product Visible Surface Step 8 RN keeps Step 7 public diagnostic summary behind passed plus comment_text contract', () => {
  const inputFeedback = read('screens/input/inputFeedbackModel.js');
  const inputFeedbackModal = read('screens/input/useInputFeedbackModal.js');
  const inputFeedbackReplyModal = read('screens/input/InputFeedbackReplyModal.js');
  const diagnostics = read('screens/input/inputFeedbackObservationDiagnostics.js');

  assertNotIncludes(inputFeedback + inputFeedbackModal + inputFeedbackReplyModal, [
    'display_absence_summary',
    'candidate_blocked_surface_grammar',
    'candidate_blocked_koto_splice',
    'candidate_blocked_relation_skeleton',
    'candidate_repair_attempted',
    'candidate_repair_succeeded',
    'candidate_repair_failed',
    'candidate_fail_closed_display_absent',
    'public_feedback_not_included_non_passed',
    'public_feedback_not_included_empty_comment_text',
    'public_feedback_not_included_visible_surface_gate',
    'rn_payload_absent',
    'surface_malformed_nominalization_codes',
    'koto_splice_codes',
    'relation_skeleton_marker_count',
    'analytic_register_leak_count',
  ], 'Step 8 RN display code must not branch on Step 7 backend meta or diagnostic summary fields');

  assertNotIncludes(diagnostics, [
    'display_absence_summary',
    'candidate_blocked_koto_splice',
    'candidate_repair_attempted',
    'candidate_repair_failed',
    'candidate_fail_closed_display_absent',
    'rn_payload_absent',
    'koto_splice_codes',
  ], 'Step 8 RN frontend diagnostic must stay small and not copy backend absence summaries');

  const {
    getEmlisObservationStatus,
    getEmlisObservationCommentText,
    isPassedEmlisObservationReply,
    buildPassedEmlisObservationModalPayload,
  } = loadInputFeedbackModelForContractTest();

  const nonPassedWithStep7Meta = {
    input_feedback: {
      comment_text: 'Step 7 meta が修復可能を示しても、public status が rejected なら表示しません。',
      emlis_ai: {
        observation_status: 'rejected',
        visible_surface_acceptance_gate: {
          evaluated: true,
          passed: false,
          classification: 'red',
          action: 'rerender_surface',
          rejection_reasons: [
            'malformed_phrase_unit',
            'malformed_nominalization_conditional_fragment',
            'residual_koto_splice_fragment',
          ],
          koto_splice_detected: true,
          koto_splice_codes: ['malformed_nominalization_conditional_fragment'],
          relation_skeleton_major: true,
          analytic_register_leak: true,
        },
        diagnostic_summary: {
          observation_status: 'passed',
          display_absence_summary: {
            candidate_blocked_surface_grammar: true,
            candidate_blocked_koto_splice: true,
            candidate_blocked_relation_skeleton: true,
            candidate_repair_attempted: true,
            candidate_repair_failed: true,
            candidate_fail_closed_display_absent: true,
            public_feedback_not_included_non_passed: true,
            public_feedback_not_included_visible_surface_gate: true,
            rn_payload_absent: true,
            reason_codes: ['malformed_nominalization_conditional_fragment'],
          },
        },
        display_absence_summary: {
          candidate_blocked_koto_splice: true,
          candidate_repair_attempted: true,
          candidate_repair_failed: true,
        },
      },
    },
  };
  assert.equal(getEmlisObservationStatus(nonPassedWithStep7Meta), 'rejected');
  assert.equal(
    getEmlisObservationCommentText(nonPassedWithStep7Meta),
    'Step 7 meta が修復可能を示しても、public status が rejected なら表示しません。'
  );
  assert.equal(isPassedEmlisObservationReply(nonPassedWithStep7Meta), false);
  assert.equal(buildPassedEmlisObservationModalPayload(nonPassedWithStep7Meta), null);

  const metaOnlyStep7Diagnostic = {
    input_feedback: {
      comment_text: '',
      emlis_ai: {
        observation_status: '',
        visible_surface_acceptance_gate: {
          evaluated: true,
          passed: true,
          classification: 'pass',
          action: 'allow',
          candidate_comment_text: 'meta内の候補本文はRN表示対象外です。',
          raw_input: 'raw input must stay backend-only',
          evidence_text: 'evidence text must stay backend-only',
        },
        diagnostic_summary: {
          observation_status: 'passed',
          display_absence_summary: {
            candidate_repair_succeeded: true,
            public_feedback_not_included_empty_comment_text: true,
          },
        },
      },
    },
  };
  assert.equal(getEmlisObservationStatus(metaOnlyStep7Diagnostic), '');
  assert.equal(getEmlisObservationCommentText(metaOnlyStep7Diagnostic), '');
  assert.equal(isPassedEmlisObservationReply(metaOnlyStep7Diagnostic), false);
  assert.equal(buildPassedEmlisObservationModalPayload(metaOnlyStep7Diagnostic), null);

  const passedPublicWithStep7Summary = {
    input_feedback: {
      comment_text: 'public comment_text と passed だけで表示されます。',
      emlis_ai: {
        observation_status: 'passed',
        diagnostic_summary: {
          display_absence_summary: {
            candidate_repair_attempted: true,
            candidate_repair_succeeded: true,
          },
        },
      },
    },
    emotionSummary: '選択した感情：喜び',
    dominantSummary: '中心として見ている感情：喜び',
  };
  assert.deepEqual(buildPassedEmlisObservationModalPayload(passedPublicWithStep7Summary), {
    commentText: 'public comment_text と passed だけで表示されます。',
    observationStatus: 'passed',
    emotionSummary: '選択した感情：喜び',
    dominantSummary: '中心として見ている感情：喜び',
    contextLabel: '',
  });

  const {
    buildEmlisObservationFrontendDiagnostic,
    dumpEmlisObservationFrontendDiagnostic,
  } = loadInputFeedbackObservationDiagnosticsForContractTest();

  const frontendDiagnostic = buildEmlisObservationFrontendDiagnostic({
    submitResult: {
      id: 'emotion-log-step8',
      input_feedback: {
        comment_text: 'public text is not copied from submitResult',
        emlis_ai: {
          observation_status: 'rejected',
          observation_trace_id: 'emlisobs-step8',
          diagnostic_summary: {
            observation_status: 'passed',
            trace_id: 'diagnostic-trace-id',
            display_absence_summary: {
              candidate_blocked_koto_splice: true,
              candidate_repair_attempted: true,
              candidate_repair_failed: true,
              rn_payload_absent: true,
            },
          },
        },
      },
    },
    inputFeedbackText: '表示対象外でも本文はログへ出しません。',
    openedObservation: false,
  });
  assert.deepEqual(frontendDiagnostic, {
    version: 'emlis.frontend_observation_diagnostic.v1',
    source: 'rn_input_screen',
    emotion_log_id: 'emotion-log-step8',
    trace_id: 'emlisobs-step8',
    observation_status: 'rejected',
    comment_text_length: '表示対象外でも本文はログへ出しません。'.length,
    comment_text_present: true,
    modal_opened: false,
    raw_input_included: false,
    comment_text_included: false,
  });
  const serialized = dumpEmlisObservationFrontendDiagnostic(frontendDiagnostic);
  assert.equal(serialized.includes('display_absence_summary'), false);
  assert.equal(serialized.includes('candidate_blocked_koto_splice'), false);
  assert.equal(serialized.includes('表示対象外でも本文はログへ出しません。'), false);
});

test('Observation Diagnostic Lockdown Step 6 RN frontend diagnostics keep debug logging opt-in, text-free, and no forced passed', () => {
  const input = read('screens/InputScreen.js');
  const diagnostics = read('screens/input/inputFeedbackObservationDiagnostics.js');

  assertIncludes(input, [
    'import { logEmlisObservationFrontendDiagnostic } from "./input/inputFeedbackObservationDiagnostics";',
    'logEmlisObservationFrontendDiagnostic({',
    'submitResult,',
    'inputFeedbackText,',
    'inputFeedbackAI,',
    'openedObservation,',
  ], 'InputScreen.js Step 6 frontend diagnostic connection');

  assertIncludes(diagnostics, [
    'FRONTEND_OBSERVATION_DIAGNOSTIC_LOG_PREFIX = "emlis_observation_frontend_result"',
    'EXPO_PUBLIC_EMLIS_OBSERVATION_DIAGNOSTIC_LOG',
    'EXPO_PUBLIC_COCOLON_EMLIS_OBSERVATION_DIAGNOSTIC_LOG',
    'export function buildEmlisObservationFrontendDiagnostic',
    'export function dumpEmlisObservationFrontendDiagnostic',
    'export function logEmlisObservationFrontendDiagnostic',
    'return normalizeString(meta?.observation_status || meta?.observationStatus || "");',
    'comment_text_length: textLength',
    'comment_text_present: textLength > 0',
    'modal_opened: normalizeBoolean(openedObservation)',
    'raw_input_included: false',
    'comment_text_included: false',
  ], 'inputFeedbackObservationDiagnostics.js Step 6 helper contract');

  assertNotIncludes(input + diagnostics, [
    'observationStatus: inputFeedbackAI?.observation_status || "passed"',
    'observation_status: "passed"',
    'observationStatus: "passed"',
    'diagnostic?.observation_status',
    'diagnostic?.observationStatus',
    '|| "passed"',
    "|| 'passed'",
  ], 'Step 6 RN diagnostics must not force public observation status to passed');

  const {
    buildEmlisObservationFrontendDiagnostic,
    dumpEmlisObservationFrontendDiagnostic,
    isEmlisObservationFrontendDiagnosticLogEnabled,
    logEmlisObservationFrontendDiagnostic,
  } = loadInputFeedbackObservationDiagnosticsForContractTest();

  const previousEnvA = process.env.EXPO_PUBLIC_EMLIS_OBSERVATION_DIAGNOSTIC_LOG;
  const previousEnvB = process.env.EXPO_PUBLIC_COCOLON_EMLIS_OBSERVATION_DIAGNOSTIC_LOG;
  try {
    delete process.env.EXPO_PUBLIC_EMLIS_OBSERVATION_DIAGNOSTIC_LOG;
    delete process.env.EXPO_PUBLIC_COCOLON_EMLIS_OBSERVATION_DIAGNOSTIC_LOG;
    assert.equal(isEmlisObservationFrontendDiagnosticLogEnabled(), false);
    assert.equal(logEmlisObservationFrontendDiagnostic({}, { info() { throw new Error('disabled log must not emit'); } }), null);

    const rejectedRecord = buildEmlisObservationFrontendDiagnostic({
      submitResult: {
        id: 'emotion-log-1',
        input_feedback: {
          comment_text: 'public text is deliberately not read from submitResult',
          emlis_ai: {
            observation_status: 'rejected',
            observation_trace_id: 'emlisobs-rejected',
            diagnostic_summary: { observation_status: 'passed', trace_id: 'diagnostic-must-not-override-public' },
          },
        },
      },
      inputFeedbackText: '表示対象外でも長さだけを記録する。',
      openedObservation: false,
    });
    assert.deepEqual(rejectedRecord, {
      version: 'emlis.frontend_observation_diagnostic.v1',
      source: 'rn_input_screen',
      emotion_log_id: 'emotion-log-1',
      trace_id: 'emlisobs-rejected',
      observation_status: 'rejected',
      comment_text_length: '表示対象外でも長さだけを記録する。'.length,
      comment_text_present: true,
      modal_opened: false,
      raw_input_included: false,
      comment_text_included: false,
    });

    const unavailableRecord = buildEmlisObservationFrontendDiagnostic({
      submitResult: { emotionLogId: 'emotion-log-2' },
      inputFeedbackAI: {
        observation_status: 'unavailable',
        observation_trace_id: 'emlisobs-unavailable',
        diagnostic_summary: { observation_status: 'passed' },
      },
      inputFeedbackText: '   ',
      openedObservation: true,
    });
    assert.equal(unavailableRecord.observation_status, 'unavailable');
    assert.equal(unavailableRecord.comment_text_length, 0);
    assert.equal(unavailableRecord.comment_text_present, false);
    assert.equal(unavailableRecord.modal_opened, true);

    const metaOnlyDiagnosticStatusRecord = buildEmlisObservationFrontendDiagnostic({
      submitResult: {
        emotionLogId: 'emotion-log-meta-only',
        input_feedback: {
          emlis_ai: {
            diagnostic_summary: {
              observation_status: 'passed',
              trace_id: 'emlisobs-meta-only-diagnostic',
            },
          },
        },
      },
      inputFeedbackText: 'Complete meta 側だけ passed を主張しても RN 診断statusは補正しません。',
      openedObservation: false,
    });
    assert.equal(
      metaOnlyDiagnosticStatusRecord.observation_status,
      '',
      'Complete or diagnostic meta alone must not force RN diagnostic status to passed'
    );
    assert.equal(metaOnlyDiagnosticStatusRecord.trace_id, 'emlisobs-meta-only-diagnostic');
    assert.equal(metaOnlyDiagnosticStatusRecord.modal_opened, false);

    const passedRecord = buildEmlisObservationFrontendDiagnostic({
      submitResult: { id: 'emotion-log-3' },
      inputFeedbackAI: {
        observation_status: 'passed',
        observation_trace_id: 'emlisobs-passed',
      },
      inputFeedbackText: 'Display Gate passed の public comment_text だけが表示対象です。',
      openedObservation: true,
    });
    assert.equal(passedRecord.observation_status, 'passed');
    assert.equal(passedRecord.comment_text_present, true);
    assert.equal(passedRecord.modal_opened, true);

    const serialized = dumpEmlisObservationFrontendDiagnostic(passedRecord);
    assert.equal(serialized.includes('Display Gate passed の public comment_text'), false);
    assert.equal(JSON.parse(serialized).comment_text_included, false);
    assert.equal(JSON.parse(serialized).raw_input_included, false);

    assert.throws(
      () => dumpEmlisObservationFrontendDiagnostic({ ...passedRecord, comment_text: '本文は出さない' }),
      /must not include record\.comment_text/
    );
    assert.throws(
      () => dumpEmlisObservationFrontendDiagnostic({ nested: { raw_input: '入力本文は出さない' } }),
      /must not include record\.nested\.raw_input/
    );

    process.env.EXPO_PUBLIC_EMLIS_OBSERVATION_DIAGNOSTIC_LOG = '1';
    assert.equal(isEmlisObservationFrontendDiagnosticLogEnabled(), true);
    const emitted = [];
    const loggedRecord = logEmlisObservationFrontendDiagnostic({
      submitResult: { id: 'emotion-log-4' },
      inputFeedbackAI: { observation_status: 'rejected', observation_trace_id: 'emlisobs-logged' },
      inputFeedbackText: 'ログへ本文そのものは出しません。',
      openedObservation: false,
    }, { info(message) { emitted.push(message); } });
    assert.equal(loggedRecord.observation_status, 'rejected');
    assert.equal(emitted.length, 1);
    assert.ok(emitted[0].startsWith('emlis_observation_frontend_result {'));
    assert.equal(emitted[0].includes('ログへ本文そのものは出しません。'), false);
    const emittedJson = JSON.parse(emitted[0].replace('emlis_observation_frontend_result ', ''));
    assert.equal(emittedJson.trace_id, 'emlisobs-logged');
    assert.equal(emittedJson.comment_text_present, true);
    assert.equal(emittedJson.modal_opened, false);
    assert.equal(emittedJson.raw_input_included, false);
    assert.equal(emittedJson.comment_text_included, false);
  } finally {
    if (previousEnvA === undefined) {
      delete process.env.EXPO_PUBLIC_EMLIS_OBSERVATION_DIAGNOSTIC_LOG;
    } else {
      process.env.EXPO_PUBLIC_EMLIS_OBSERVATION_DIAGNOSTIC_LOG = previousEnvA;
    }
    if (previousEnvB === undefined) {
      delete process.env.EXPO_PUBLIC_COCOLON_EMLIS_OBSERVATION_DIAGNOSTIC_LOG;
    } else {
      process.env.EXPO_PUBLIC_COCOLON_EMLIS_OBSERVATION_DIAGNOSTIC_LOG = previousEnvB;
    }
  }
});

test('Home hooks preserve startup popup priority, today question, and Piece quota screen state', () => {
  const state = read('features/home/useHomeState.js');
  const actions = read('features/home/useHomeActions.js');

  assertIncludes(state, [
    'getHomeState',
    'today_question_enabled',
    'STARTUP_POPUP_KIND',
    '[STARTUP_POPUP_KIND.NOTICE]: 300',
    '[STARTUP_POPUP_KIND.TUTORIAL]: 200',
    '[STARTUP_POPUP_KIND.TODAY_QUESTION]: 100',
    'todayQuestionCurrent',
    'pieceQuota',
    'registerInputInteraction',
  ], 'useHomeState.js');

  assertIncludes(actions, [
    'submitTodayQuestionAnswer',
    'markNoticesRead',
    'question_origin',
    'personal_question_id',
    'source_anchor_hash',
  ], 'useHomeActions.js');
});

test('AnalysisScreen keeps report history, self-structure, today-question history, and Piece cross-link routes mounted through Phase 6 hooks', () => {
  const analysis = read('screens/AnalysisScreen.js');
  const analysisRouteModel = read('screens/analysis/analysisRouteModel.js');
  const analysisRouteState = read('screens/analysis/useAnalysisRouteState.js');
  const analysisUnreadBadges = read('screens/analysis/useAnalysisUnreadBadges.js');
  const analysisReportActions = read('screens/analysis/useAnalysisReportActions.js');
  const analysisContentFirst = read('screens/AnalysisContentFirstScreen.js');
  const analysisEmotion = read('screens/AnalysisEmotionScreen.js');
  const kokoroWeatherCurrentCard = read('screens/analysisReport/KokoroWeatherCurrentCard.js');
  const kokoroWeatherForecastStrip = read('screens/analysisReport/KokoroWeatherForecastStrip.js');
  const kokoroWeatherDetailModal = read('screens/analysisReport/KokoroWeatherDetailModal.js');
  const kokoroWeatherFormatters = read('screens/analysisReport/kokoroWeatherFormatters.js');
  const analysisReportHistory = read('screens/AnalysisReportHistoryScreen.js');
  const analysisReportViewer = read('screens/AnalysisReportViewerScreen.js');
  const accountLocalCleanup = read('lib/accountLocalCleanup.js');
  const legacyWireContracts = read('lib/compat/legacyWireContracts.js');
  const analysisSelfStructureActions = read('screens/analysis/useAnalysisSelfStructureActions.js');
  const analysisTutorialOverlay = read('screens/analysis/useAnalysisTutorialOverlay.js');

  assertIncludes(analysis, [
    'AnalysisContentFirstScreen',
    'AnalysisEmotionScreen',
    'AnalysisSelfStructureScreen',
    'AnalysisInputHistoryMenuScreen',
    'AnalysisReportHistoryScreen',
    'AnalysisReportViewerScreen',
    'SelfStructureReportHistoryScreen',
    'SelfStructureReportViewerScreen',
    'TodayQuestionHistoryScreen',
    'onOpenPieceDeepDive',
    'from "./analysis/analysisRouteModel";',
    'from "./analysis/useAnalysisRouteState";',
    'from "./analysis/useAnalysisUnreadBadges";',
    'from "./analysis/useAnalysisReportActions";',
    'from "./analysis/useAnalysisSelfStructureActions";',
    'from "./analysisReport/kokoroWeatherFormatters";',
    'from "./analysis/useAnalysisTutorialOverlay";',
  ], 'AnalysisScreen.js');

  assertIncludes(analysisRouteModel, [
    'export const ROUTE_HOME = "home";',
    'export const ROUTE_EMOTION_ANALYSIS = "emotionAnalysis";',
    'export const ROUTE_SELF_STRUCTURE = "selfStructure";',
    'export const ROUTE_INPUT_HISTORY = "inputHistory";',
    'export function normalizeAnalysisReportType',
    'export function isAnalysisReportType',
    'export function formatLatestUpdateLabel',
    'export function isAnalysisMenuRoute',
    'daily: "こころ天気（日）"',
    'weekly: "こころ天気（週）"',
    'monthly: "こころ天気（月）"',
  ], 'analysisRouteModel.js');

  assertIncludes(analysisRouteState, [
    'export function useAnalysisRouteState',
    'const [route, setRoute] = useState(ROUTE_HOME);',
    'const [reportType, setReportType] = useState("weekly");',
    'clearExternalOpenParams',
  ], 'useAnalysisRouteState.js');

  assertIncludes(analysisUnreadBadges, [
    'export function useAnalysisUnreadBadges',
    'getFeatureUnread("Analysis", "daily")',
    'getFeatureUnread("Analysis", "weekly")',
    'getFeatureUnread("Analysis", "monthly")',
    'getFeatureUnread("Analysis", "selfStructure")',
    'refreshUnreadBadges',
    'markSelfStructureLatestSeen',
    'apiPost("/report-reads/mark"',
  ], 'useAnalysisUnreadBadges.js');

  assertIncludes(analysisReportActions, [
    'export function useAnalysisReportActions',
    'fetchLatestReadyReport',
    'refreshHomeSummaries',
    'refreshCurrentWeatherSummary',
    'readCachedAnalysisLatestReport',
    'writeCachedAnalysisLatestReport',
    'cocolon:kokoroWeatherLatestReport:v1',
    'isKokoroWeatherReportRecord',
    'ANALYSIS_WIRE.routes.reportsReady',
    'getTodayQuestionHistory',
    'currentWeather',
    'homeSummary.current_weather',
    'applyHomeSummaryMeta',
  ], 'useAnalysisReportActions.js');

  assertIncludes(analysis, [
    'currentWeather={entryMeta.currentWeather}',
    'consumeAnalysisHomeSummaryDirty',
    'refreshCurrentWeatherSummary',
  ], 'AnalysisScreen.js current weather prop');

  assertIncludes(analysisContentFirst, [
    'KokoroWeatherCurrentCard',
    'こころ天気',
    'currentWeather',
    'isKokoroWeatherReportRecord',
    'handleOpenPreviousKokoroWeather',
    'こころ天気（日）',
    'こころ天気（週）',
    'こころ天気（月）',
  ], 'AnalysisContentFirstScreen.js current weather card guard');

  assertIncludes(kokoroWeatherCurrentCard, [
    'export default function KokoroWeatherCurrentCard',
    '今日はまだ観測がありません',
    '前回のこころ天気を見る',
    '観測メモあり',
    'こころ温度',
  ], 'KokoroWeatherCurrentCard.js split guard');

  assertIncludes(analysisEmotion, [
    '感情分析のこころ天気を選んでください。',
    'こころ天気（日）',
    'こころ天気（週）',
    'こころ天気（月）',
    '過去のこころ天気を振り返ります',
  ], 'AnalysisEmotionScreen.js Phase 5 copy guard');

  assertIncludes(kokoroWeatherForecastStrip, [
    'export default function KokoroWeatherForecastStrip',
    'normalizeKokoroWeather',
    'getKokoroWeatherItems',
    'getKokoroWeatherReportLabel',
    'onSelectItem',
    'helperText',
    '最高',
    '最低',
  ], 'KokoroWeatherForecastStrip.js split guard');

  assertIncludes(kokoroWeatherDetailModal, [
    'export default function KokoroWeatherDetailModal',
    'Modal',
    'showsHorizontalScrollIndicator={false}',
    '時間帯別こころ天気',
    'こころ天気詳細を閉じる',
  ], 'KokoroWeatherDetailModal.js split guard');

  assertIncludes(kokoroWeatherFormatters, [
    'export const KOKORO_WEATHER_VERSION = "kokoro.weather.v1";',
    'export function normalizeKokoroWeather',
    'export function normalizeKokoroWeatherItem',
    'export function normalizeKokoroWeatherTimeBucket',
    'export function formatKokoroTemperature',
    'export function getKokoroWeatherReportLabel',
    'export function buildKokoroWeatherDetailTitle',
    'export function extractKokoroWeatherPayloadFromContentJson',
    'export function isKokoroWeatherReportRecord',
    'standard_report_kokoro_weather_version',
  ], 'kokoroWeatherFormatters.js split guard');

  assertIncludes(analysisReportHistory, [
    'buildAnalysisReportDetailPath',
    'fetchKokoroWeatherReportDetail',
    'extractReadyItems(json).filter(isKokoroWeatherReportRecord)',
    'このこころ天気は現在の表示対象外です。',
  ], 'AnalysisReportHistoryScreen.js kokoro weather fail-closed guard');

  assertIncludes(analysisReportViewer, [
    'isKokoroWeatherDisplayTarget',
    'このこころ天気は現在の表示対象外です',
    'こころ天気として成立していない旧レポートは表示しません。',
    '!isKokoroWeatherDisplayTarget || reportType !== "weekly"',
  ], 'AnalysisReportViewerScreen.js kokoro weather fail-closed guard');

  assertIncludes(accountLocalCleanup, [
    'cocolon:analysisLatestReport',
    'cocolon:kokoroWeatherLatestReport:v1',
    'buildKokoroWeatherLatestReportCachePrefix',
  ], 'accountLocalCleanup.js kokoro weather cache cleanup guard');

  assertIncludes(legacyWireContracts, [
    'export function buildAnalysisReportDetailPath',
    'buildAnalysisReportWeeklyDaysPath',
    'buildAnalysisReportDetailPath(reportId)',
  ], 'legacyWireContracts.js analysis report detail path guard');

  assertIncludes(analysisSelfStructureActions, [
    'export function useAnalysisSelfStructureActions',
    'openSelfStructureRoute',
    'openSelfReportLatest',
    'openSelfReportHistory',
    'openSelfReportView',
    'navigation.navigate("SubscriptionSelect")',
  ], 'useAnalysisSelfStructureActions.js');

  assertIncludes(analysisTutorialOverlay, [
    'export function useAnalysisTutorialOverlay',
    'syncTutorialSpotlightTarget',
    'waitForTutorialFrames',
    'setTutorialStep(13)',
    'parent.navigate("Piece")',
    'navigation?.navigate?.("Piece")',
  ], 'useAnalysisTutorialOverlay.js');

  assertRegex(analysis, /parent\.navigate\("Piece"\)|navigation\.navigate\("Piece"\)|useAnalysisTutorialOverlay/, 'Analysis to Piece cross link');
});


test('Giant screen pre-split guards cover PieceLibrary, Nexus, and AnalysisReportViewer responsibilities', () => {
  const library = read('screens/PieceLibraryScreen.js');
  const nexus = read('screens/NexusScreen.js');
  const nexusRouteModel = read('screens/nexus/nexusRouteModel.js');
  const nexusNormalize = read('screens/nexus/nexusNormalize.js');
  const nexusHistoryModel = read('screens/nexus/nexusHistoryModel.js');
  const nexusHeader = read('screens/nexus/NexusHeader.js');
  const nexusTabBar = read('screens/nexus/NexusTabBar.js');
  const nexusPieceFeedSection = read('screens/nexus/NexusPieceFeedSection.js');
  const nexusEmotionLogSection = read('screens/nexus/NexusEmotionLogSection.js');
  const nexusRecommendSection = read('screens/nexus/NexusRecommendSection.js');
  const nexusHistorySection = read('screens/nexus/NexusHistorySection.js');
  const nexusOwnerPickerModal = read('screens/nexus/NexusOwnerPickerModal.js');
  const nexusTodayEmotionSummary = read('screens/nexus/NexusTodayEmotionSummary.js');
  const viewer = read('screens/AnalysisReportViewerScreen.js');
  const analysisReportAccessPolicy = read('screens/analysisReport/analysisReportAccessPolicy.js');
  const analysisReportFormatters = read('screens/analysisReport/analysisReportFormatters.js');
  const analysisReportNormalize = read('screens/analysisReport/analysisReportNormalize.js');
  const analysisReportCharts = read('screens/analysisReport/AnalysisReportCharts.js');
  const analysisReportHtmlExport = read('screens/analysisReport/analysisReportHtmlExport.js');
  const analysisReportUpgradeCard = read('screens/analysisReport/AnalysisReportUpgradeCard.js');

  assertIncludes(library, [
    'activeViewedUserId',
    'followingUsers',
    'pickerVisible',
    'sortMode',
    'qnaItems',
    'selected',
    'resonanceModalVisible',
    'resonanceStrength',
    'resonanceMemo',
    'TUTORIAL_PIECES',
    'TUTORIAL_TOTAL_STEPS',
    'getNexusPieceDetailQna',
    'getNexusPiecesAsQnaList',
  ], 'PieceLibraryScreen.js split guard');

  assertIncludes(nexus, [
    'rankingState',
    'recommendState',
    'historyState',
    'historyOrder',
    'getNexusResonancePieces',
    'setUnread("EmotionLog", "feed"',
    'activeTab === "history"',
    'activeTab === "recommend"',
    'TUTORIAL_TOTAL_STEPS',
  ], 'NexusScreen.js split guard');

  assertIncludes(viewer, [
    'from "./analysisReport/analysisReportAccessPolicy";',
    'from "./analysisReport/analysisReportNormalize";',
    'from "./analysisReport/analysisReportFormatters";',
    'from "./analysisReport/analysisReportHtmlExport";',
    'from "./analysisReport/AnalysisReportCharts";',
    'from "./analysisReport/AnalysisReportUpgradeCard";',
    'from "./analysisReport/KokoroWeatherForecastStrip";',
    'from "./analysisReport/KokoroWeatherDetailModal";',
    'subscriptionTier',
    'showDeepTransitionChart',
    'showDeepRecoveryChart',
    'showDeepMemoThemes',
    'AnalysisReportUpgradeCard',
    'KokoroWeatherForecastStrip',
    'KokoroWeatherDetailModal',
    'selectedKokoroWeatherItem',
    'kokoroWeatherPayload',
  ], 'AnalysisReportViewerScreen.js split guard');

  assertIncludes(analysisReportAccessPolicy, [
    'export function normalizeSubscriptionTier',
    'export function canViewAnalysisFullText',
    'export function canViewAnalysisDeep',
    'export function isEmotionReportType',
    'export function buildStandardUpgradeCardCopy',
  ], 'analysisReportAccessPolicy.js split guard');

  assertIncludes(analysisReportFormatters, [
    'export const EMOTIONS',
    'export const STRENGTH_SCORE',
    'export const TIME_BUCKET_ORDER',
    'export function mapKey',
    'export function coerceNum',
    'export function safeParseJson',
    'export function formatMinutesJa',
    'export function formatRange',
  ], 'analysisReportFormatters.js split guard');

  assertIncludes(analysisReportNormalize, [
    'export function normalizeEmotionMap',
    'export function extractStandardTimeBuckets',
    'export function normalizeDeepTransitionEdges',
    'export function normalizeDeepRecoveryRows',
    'export function normalizeMemoThemes',
    'export function normalizePatternEpisodes',
    'export function normalizeMonthlyPhaseItems',
    'export function normalizeMonthlyShiftItems',
    'export function extractStructuralReport',
    'export function getTopEmotionPairs',
    'export function buildDaysFromRows',
  ], 'analysisReportNormalize.js split guard');

  assertIncludes(analysisReportCharts, [
    'export function PieRingChart',
    'react-native-svg',
    'normalizeEmotionMap',
    'EMOTIONS.map',
  ], 'AnalysisReportCharts.js split guard');

  assertIncludes(analysisReportHtmlExport, [
    'export async function exportTextToPdf',
    'export function escapeHtml',
    'NativeModules?.RNHTMLtoPDF',
    'Share.share',
  ], 'analysisReportHtmlExport.js split guard');

  assertIncludes(analysisReportUpgradeCard, [
    'export default function AnalysisReportUpgradeCard',
    'onOpenSubscription?.()',
    '加入画面を開けませんでした',
    'chevron-forward',
  ], 'AnalysisReportUpgradeCard.js split guard');
});

test('Piece RN surfaces preserve entry routing, read-side feed, tutorial pieces, unread, resonance paths, and Phase 8 PieceScreen split modules', () => {
  const entry = read('screens/PieceEntryScreen.js');
  const piece = read('screens/PieceScreen.js');
  const pieceGlobalSummary = read('screens/piece/usePieceHomeGlobalSummary.js');
  const pieceTutorial = read('screens/piece/usePieceHomeTutorial.js');
  const pieceRecommend = read('screens/piece/usePieceRecommendUsers.js');
  const pieceHomeActionCard = read('screens/piece/PieceHomeActionCard.js');
  const pieceHomeMainActions = read('screens/piece/PieceHomeMainActions.js');
  const pieceTutorialCreateModal = read('screens/piece/PieceTutorialCreateModal.js');
  const pieceRecommendModal = read('screens/piece/PieceRecommendModal.js');
  const nexus = read('screens/NexusScreen.js');
  const library = read('screens/PieceLibraryScreen.js');

  assertIncludes(entry, [
    'import PieceScreen from "./PieceScreen";',
    'return <PieceScreen {...props} />;',
  ], 'PieceEntryScreen.js');

  assertIncludes(piece, [
    'from "./piece/usePieceHomeGlobalSummary";',
    'from "./piece/usePieceHomeTutorial";',
    'from "./piece/usePieceRecommendUsers";',
    'PieceHomeMainActions',
    'PieceTutorialCreateModal',
    'PieceRecommendModal',
    'navigation.navigate("PieceHistory")',
    'navigation.navigate("EmotionLog")',
    'navigation.navigate("CocolonGuide", { screenId: "piece" })',
  ], 'PieceScreen.js Phase 8 split guard');

  assertIncludes(pieceGlobalSummary, [
    'export function usePieceHomeGlobalSummary',
    'GLOBAL_SUMMARY_PASSIVE_ENDPOINT',
    'readPieceViewCount',
    'readPieceResonancesTotal',
    'AppState.addEventListener("change"',
    'navigation.addListener("focus"',
  ], 'usePieceHomeGlobalSummary.js');

  assertIncludes(pieceTutorial, [
    'export function usePieceHomeTutorial',
    'export const TUTORIAL_PIECE_QUESTION = "理想の休日の過ごし方は？";',
    'export const TUTORIAL_TOTAL_STEPS = 21;',
    'TUTORIAL_MOCK_PIECES',
    'mergeTutorialRects',
    'measureTutorialTarget',
    'syncTutorialSpotlightTarget',
    'setTutorialPieces',
    'saveTutorialPiece',
    'const routeName = resolvePieceLibraryRouteName(navigation)',
  ], 'usePieceHomeTutorial.js');

  assertIncludes(pieceRecommend, [
    'export function usePieceRecommendUsers',
    'PIECE_WIRE.routes.recommendUsers',
    'getPrefetchEntryFresh("Piece", "recoUsers"',
    'setPrefetch("Piece", "recoUsers"',
    'supabase.auth.getSession',
    'resolveAccountRouteName',
    'resetRecommendState',
  ], 'usePieceRecommendUsers.js');

  assertIncludes(pieceHomeActionCard, [
    'export default function PieceHomeActionCard',
    'MenuActionCard',
    'badgeVisible',
    'accessibilityLabel',
  ], 'PieceHomeActionCard.js');

  assertIncludes(pieceHomeMainActions, [
    'export default function PieceHomeMainActions',
    'PieceHomeActionCard',
    '今日の全体活動',
    'ピース一覧を開く',
    '感情ログを開く',
    '新しいユーザーを探す',
    '履歴を確認する',
  ], 'PieceHomeMainActions.js');

  assertIncludes(pieceTutorialCreateModal, [
    'export default function PieceTutorialCreateModal',
    'TutorialOverlay',
    'TUTORIAL_PIECE_QUESTION',
    'TextInput',
    'onSave',
    'onStartShouldSetResponderCapture',
  ], 'PieceTutorialCreateModal.js');

  assertIncludes(pieceRecommendModal, [
    'export default function PieceRecommendModal',
    'readShareCode',
    'onRefresh',
    'onOpenAccount(uid)',
    'アクティブユーザー',
  ], 'PieceRecommendModal.js');

  assertIncludes(nexus, [
    'getNexusPieces',
    'getNexusPiecesUnreadStatus',
    'getNexusResonancePieces',
    'TUTORIAL_TOTAL_STEPS',
    'tutorialPieces',
    'ensureTutorialPiecesSeed',
    'setUnread("Piece", "piecesNew"',
    'buildResonanceHistoryItemFromPiece',
    'activeTab === "history"',
  ], 'NexusScreen.js');

  assertIncludes(library, [
    'getNexusPieceDetailQna',
    'getNexusPiecesAsQnaList',
    'getNexusPiecesUnreadStatus',
    'TUTORIAL_PIECES',
    'TUTORIAL_TOTAL_STEPS',
  ], 'PieceLibraryScreen.js');
});


test('Tutorial screens keep the current guided flow count and generated fixture boundary', () => {
  const tutorialFlow = read('screens/TutorialFlowScreen.js');
  const scenario = read('tutorial/tutorialScenarioData.js');

  const totalStepsMatch = scenario.match(/export const TUTORIAL_TOTAL_STEPS = (\d+);/);
  assert.ok(totalStepsMatch, 'tutorialScenarioData.js must define TUTORIAL_TOTAL_STEPS');
  const totalSteps = Number(totalStepsMatch[1]);
  assert.ok(totalSteps >= 18, `tutorial total steps must remain a full guided flow; got ${totalSteps}`);

  assertIncludes(tutorialFlow, [
    'const STEP_INTRO = 1;',
    'const STEP_CONNECTION = 17;',
    'const STEP_OTHER = 18;',
    'const STEP_FINISH = 19;',
    'totalSteps={TUTORIAL_TOTAL_STEPS}',
    'endTutorial',
  ], 'TutorialFlowScreen.js');

  assertIncludes(scenario, [
    'import tutorialFixtures from "./generated/tutorialFixtures.generated.json";',
    'TUTORIAL_HAS_VALID_FIXTURES',
    'TUTORIAL_CONNECTION_ROWS',
    'TUTORIAL_SELF_PIECE',
    'TUTORIAL_FOLLOWED_USER_PIECE',
    'TUTORIAL_WATASHI_MAP',
    'TUTORIAL_WATASHI_MAP_PREVIEW',
    'Emlisの観測',
    'こころ天気',
    'わたしマップ',
    'ピース',
    '4つの形で受け取れます',
  ], 'tutorialScenarioData.js');
});


test('AccountScreen keeps profile, follow, visibility, subscription, and ID search boundaries mounted through Phase 7 split modules', () => {
  const account = read('screens/AccountScreen.js');
  const accountModel = read('screens/account/accountModel.js');
  const accountProfileHook = read('screens/account/useAccountProfile.js');
  const accountFollowHook = read('screens/account/useAccountFollowState.js');
  const accountVisibilityHook = read('screens/account/useAccountVisibility.js');
  const accountSubscriptionHook = read('screens/account/useAccountSubscription.js');
  const accountIdSearchHook = read('screens/account/useAccountIdSearch.js');
  const accountProfileSection = read('screens/account/AccountProfileSection.js');
  const accountIdSearchSection = read('screens/account/AccountIdSearchSection.js');
  const accountStatusSection = read('screens/account/AccountStatusSection.js');
  const accountNameEditModal = read('screens/account/AccountNameEditModal.js');
  const accountVisibilitySection = read('screens/account/AccountVisibilitySection.js');

  assertIncludes(account, [
    'from "./account/accountModel";',
    'from "./account/useAccountProfile";',
    'from "./account/useAccountFollowState";',
    'from "./account/useAccountVisibility";',
    'from "./account/useAccountSubscription";',
    'from "./account/useAccountIdSearch";',
    'AccountProfileSection',
    'AccountIdSearchSection',
    'AccountStatusSection',
    'AccountNameEditModal',
    'AccountVisibilitySection',
    'readShareCodePublic',
  ], 'AccountScreen.js');

  assertIncludes(accountModel, [
    'export const PANEL_MIN_HEIGHT = 695;',
    'export const DISPLAY_NAME_MAX_LENGTH = 15;',
    'export const SUB_TIER_LABEL',
    'export const TIER_ALLOWED_SELF_STRUCTURE_MODES',
    'export function normalizeDisplayName',
    'export function mapDisplayNameConflictMessage',
    'export function normalizeSubscriptionTier',
    'export function formatAllowedModes',
    'export function readAccountStatusValue',
  ], 'accountModel.js');

  assertIncludes(accountProfileHook, [
    'export function useAccountProfile',
    'apiGet("/account/profile/me")',
    '/account/display-name/availability',
    'apiPatch("/account/profile/me"',
    'supabase.auth.updateUser',
    'Share.share({ message: code })',
    'https://emlis.app/u/${code}',
    'readShareCode',
    'readConnectCode',
  ], 'useAccountProfile.js');

  assertIncludes(accountFollowHook, [
    'export function useAccountFollowState',
    'buildFollowStatsPath(targetUserId)',
    'ACCOUNT_WIRE.routes.status',
    'FOLLOW_WIRE.routes.create',
    'FOLLOW_WIRE.routes.delete',
    'navigation.addListener("focus"',
    'navigation.navigate("FollowListScreen"',
  ], 'useAccountFollowState.js');

  assertIncludes(accountVisibilityHook, [
    'export function useAccountVisibility',
    'ACCOUNT_WIRE.routes.visibilityMe',
    'readShareCodePublic',
    'patchAccountVisibilityMe',
    'openAccountSettings',
    'closeAccountSettings',
    'navigation.addListener("focus"',
  ], 'useAccountVisibility.js');

  assertIncludes(accountSubscriptionHook, [
    'export function useAccountSubscription',
    'useSubscription',
    'restoreAvailablePurchases',
    'syncPurchaseToSubscriptionTier',
    'getPlanSku("plus")',
    'getPlanSku("premium")',
    'refreshTier({ force: true })',
  ], 'useAccountSubscription.js');

  assertIncludes(accountIdSearchHook, [
    'export function useAccountIdSearch',
    'buildPublicProfileByShareCodePath',
    'apiGet(buildPublicProfileByShareCodePath(code), { auth: false })',
    'navigation.navigate("Account"',
    'viewedUserId: normalizedUserId',
  ], 'useAccountIdSearch.js');

  assertIncludes(accountProfileSection, [
    'export default function AccountProfileSection',
    'CocolonPressable',
    'フォロー数',
    'フォロワー数',
    'ユーザーID',
    'onToggleFollow',
    'openFollowList("following")',
    'openFollowList("followers")',
  ], 'AccountProfileSection.js');

  assertIncludes(accountIdSearchSection, [
    'export default function AccountIdSearchSection',
    'TextInput',
    'placeholder="ユーザーID"',
    'searchUserById',
    'navigateToAccount(idSearchResult.userId)',
  ], 'AccountIdSearchSection.js');

  assertIncludes(accountStatusSection, [
    'export default function AccountStatusSection',
    'PIECE_WIRE.metrics.pieceGeneratedTotalKeys',
    'PIECE_WIRE.metrics.pieceResonancesTotalKeys',
    'ログイン日数',
    'ピースが共鳴された数',
  ], 'AccountStatusSection.js');

  assertIncludes(accountNameEditModal, [
    'export default function AccountNameEditModal',
    'DISPLAY_NAME_MAX_LENGTH',
    'ユーザー名の編集',
    'saveDisplayName',
  ], 'AccountNameEditModal.js');

  assertIncludes(accountVisibilitySection, [
    'export default function AccountVisibilitySection',
    'VisibilitySettingRow',
    'ピースの公開設定',
    'ランキング表示設定',
    'ユーザーID表示設定',
    'ACCOUNT_WIRE.fields.shareCodePublic',
  ], 'AccountVisibilitySection.js');
});

test('SubscriptionSelectScreen keeps revenue-critical IAP and sales flag guards mounted', () => {
  const subscription = read('screens/SubscriptionSelectScreen.js');

  assertIncludes(subscription, [
    'useAppRuntime',
    'isFeatureEnabled("subscription_sales_enabled", true)',
    'ensureIapConnection',
    'requestSubscriptionForPlan',
    'restoreAvailablePurchases',
    'syncPurchaseToSubscriptionTier',
    'getSubscriptionPlanConfig',
    'getSubscriptionPolicy',
    'effectiveSalesEnabled',
    'Plusプラン',
    'Premiumプラン',
    'IOS_MANAGE_SUBSCRIPTIONS_URL',
  ], 'SubscriptionSelectScreen.js');

  assertRegex(subscription, /Alert\.alert\([\s\S]*現在受付を停止しています/, 'sales-disabled alert guard');
});

test('TodayQuestionHistoryScreen keeps personal followup source-anchor display and answer editing paths', () => {
  const history = read('screens/TodayQuestionHistoryScreen.js');

  assertIncludes(history, [
    'source_anchor_summary',
    'question_origin',
    'personal_followup',
    '入力: 「',
    'TextInput',
    'optionalFreeTextInput',
    'Analysisに戻る',
  ], 'TodayQuestionHistoryScreen.js');
});

test('Production monitoring captures RN runtime and API failures without changing product routes', () => {
  const app = read('App.js');
  const apiClient = read('lib/apiClient.js');
  const monitoring = read('lib/monitoring.js');
  const rootNavigator = read('navigation/RootNavigator.js');
  const runtimeGate = read('runtime/AppRuntimeBootstrapGate.js');

  assertIncludes(app, [
    'import { captureClientError, initProductionMonitoring } from "./lib/monitoring";',
    'initProductionMonitoring();',
    'push_initial_notification_failed',
  ], 'App.js monitoring bootstrap');

  assertIncludes(apiClient, [
    'import { captureApiError } from "./monitoring";',
    'captureApiError(err, { path, method, baseUrl, timeoutMs });',
    'throw err;',
  ], 'apiClient monitoring instrumentation');

  assertIncludes(monitoring, [
    'export function initProductionMonitoring',
    'export function captureClientError',
    'export function captureApiError',
    'export function captureClientEvent',
    'EXPO_PUBLIC_COCOLON_MONITORING_ENABLED',
    'EXPO_PUBLIC_COCOLON_MONITORING_ENDPOINT',
    'globalThis.fetch(resolveMonitoringUrl()',
    '/ops/client-events',
    '[redacted]',
    '[redacted-email]',
    '[redacted-token]',
    '[redacted-id]',
    'ErrorUtils',
  ], 'lib/monitoring.js');

  assertIncludes(rootNavigator, [
    'captureClientError',
    'iap_observer_start_failed',
    'push_token_sync_once_failed',
    'push_token_sync_start_failed',
  ], 'RootNavigator monitoring instrumentation');

  assertIncludes(runtimeGate, [
    'captureClientError',
    'app_runtime_bootstrap_failed',
  ], 'AppRuntimeBootstrapGate monitoring instrumentation');
});

test('Phase 10 Emlis observation release gate keeps regression and release-ready contracts explicit', () => {
  const inputFeedback = read('screens/input/inputFeedbackModel.js');
  const inputFeedbackModal = read('screens/input/useInputFeedbackModal.js');
  const inputFeedbackReplyModal = read('screens/input/InputFeedbackReplyModal.js');
  const input = read('screens/InputScreen.js');
  const tutorialData = read('tutorial/tutorialScenarioData.js');
  const thisTest = read('tests/rn-screen-contracts.test.js');

  assertIncludes(inputFeedback, [
    'export const EMLIS_OBSERVATION_RELEASE_PHASE = 10;',
    'export const EMLIS_OBSERVATION_REQUIRED_PHASES = Object.freeze([',
    '0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10',
    'export const EMLIS_OBSERVATION_RELEASE_REQUIRED_CHECKS = Object.freeze([',
    '"phase9_frontend_passed_only"',
    '"phase10_fixed_string_regression"',
    '"phase10_structure_reading_grounding_guard"',
    '"phase10_template_echo_guard"',
    '"phase10_screenshot_regression"',
    '"phase10_unverified_phase_not_passed"',
    'export function getEmlisObservationPhaseGate',
    'export function getEmlisObservationCompletedPhases',
    'export function buildEmlisObservationReleaseDecision',
    'export function isEmlisObservationReleaseReady',
    'backendReleaseReady',
    'passedOnlyModalVerified',
    'backendDisplayGateVerified',
    'failedChecks',
    'releaseReady',
  ], 'inputFeedbackModel.js phase 10 release decision');

  assertIncludes(inputFeedback, [
    'getEmlisObservationStatus(input) === EMLIS_OBSERVATION_STATUS.PASSED',
    'Boolean(getEmlisObservationCommentText(input))',
    'if (observationStatus !== EMLIS_OBSERVATION_STATUS.PASSED || !commentText)',
    'return null;',
  ], 'inputFeedbackModel.js passed-only modal payload');

  assertIncludes(inputFeedbackModal, [
    'buildPassedEmlisObservationModalPayload(input)',
    'setInputFeedbackModalVisible(false)',
    'setInputFeedbackModalText("")',
    'return false;',
    'return true;',
  ], 'useInputFeedbackModal.js passed-only open contract');

  assertIncludes(inputFeedbackReplyModal, [
    'const shouldShow = Boolean',
    'visible &&',
    'isPassedEmlisObservationReply({',
    'commentText: text,',
    'observationStatus: meta?.observationStatus || meta?.observation_status',
    '<Modal visible={shouldShow}',
  ], 'InputFeedbackReplyModal.js backend status display gate');

  assertIncludes(input, [
    'const openedObservation = inputFeedbackText',
    'observationStatus: inputFeedbackAI?.observation_status',
    'if (!openedObservation)',
    'showToast(`記録しました',
    'showToast("ピースを生成しました")',
    'completeTutorialAfterReply();',
  ], 'InputScreen.js non-passed observation fallback behavior');

  assertNotIncludes(input, [
    'observation_status: "passed"',
    'observationStatus: "passed"',
    '|| "passed"',
    "|| 'passed'",
  ], 'InputScreen.js must not synthesize passed status');

  assertIncludes(tutorialData, [
    'TUTORIAL_HAS_DISPLAYABLE_EMLIS_REPLY',
    'fixtureEmlisObservationStatus === "passed"',
    'TUTORIAL_HAS_VALID_FIXTURES',
    'TUTORIAL_EMLIS_REPLY',
    'commentText: TUTORIAL_HAS_DISPLAYABLE_EMLIS_REPLY',
    'meta: freezeClone(fixtureEmlisMeta)',
  ], 'tutorialScenarioData.js keeps tutorial Emlis reply backend-owned and passed-only');

  assertIncludes(thisTest, [
    'test(\'Phase 10 Emlis observation release gate keeps regression and release-ready contracts explicit\'',
    '"phase10_screenshot_regression"',
    '"phase10_unverified_phase_not_passed"',
    'backendReleaseReady',
    'fixtureEmlisObservationStatus === "passed"',
    'observationStatus: meta?.observationStatus || meta?.observation_status',
    'InputScreen.js must not synthesize passed status',
  ], 'phase 10 regression test self-check');
});


test('Step 13 Complete Composer initial RN contract regression keeps passed-only modal display backend-owned', () => {
  const inputFeedback = read('screens/input/inputFeedbackModel.js');
  const inputFeedbackModal = read('screens/input/useInputFeedbackModal.js');
  const inputFeedbackReplyModal = read('screens/input/InputFeedbackReplyModal.js');
  const input = read('screens/InputScreen.js');

  assertIncludes(inputFeedback, [
    'input?.input_feedback?.emlis_ai?.observation_status',
    'input?.input_feedback?.comment_text',
    'getEmlisObservationStatus(input) === EMLIS_OBSERVATION_STATUS.PASSED',
    'Boolean(getEmlisObservationCommentText(input))',
    'if (observationStatus !== EMLIS_OBSERVATION_STATUS.PASSED || !commentText)',
    'return null;',
  ], 'inputFeedbackModel.js Step 13 Complete Composer public response gate');

  assertIncludes(inputFeedbackModal, [
    'const payload = buildPassedEmlisObservationModalPayload(input);',
    'if (!payload) {',
    'setInputFeedbackModalVisible(false);',
    'setInputFeedbackModalText("");',
    'observationStatus: getEmlisObservationStatus(input)',
    'return false;',
  ], 'useInputFeedbackModal.js Step 13 fail-closed modal opener');

  assertIncludes(inputFeedbackReplyModal, [
    'const shouldShow = Boolean',
    'visible &&',
    'isPassedEmlisObservationReply({',
    'commentText: text,',
    'observationStatus: meta?.observationStatus || meta?.observation_status',
    '<Modal visible={shouldShow}',
    'Emlisの観測',
  ], 'InputFeedbackReplyModal.js Step 13 visible title and passed-only guard');

  assertIncludes(input, [
    'observationStatus: TUTORIAL_EMLIS_REPLY.meta?.observation_status',
    'observationStatus: inputFeedbackAI?.observation_status',
    'const openedObservation = inputFeedbackText',
    'if (!openedObservation)',
    'completeTutorialAfterReply();',
  ], 'InputScreen.js Step 13 backend-owned observation status');

  assertNotIncludes(input, [
    'observationStatus: TUTORIAL_EMLIS_REPLY.meta?.observation_status || "passed"',
    'observationStatus: inputFeedbackAI?.observation_status || "passed"',
    'complete_composer_initial',
    'complete_scorecard_event',
    'complete_reply_diagnostics',
  ], 'InputScreen.js Step 13 must not special-case Complete Composer meta or force passed');

  const {
    getEmlisObservationStatus,
    getEmlisObservationCommentText,
    isPassedEmlisObservationReply,
    buildPassedEmlisObservationModalPayload,
  } = loadInputFeedbackModelForContractTest();

  const completePassedPayload = {
    input_feedback: {
      comment_text: '完全Composer初期版の本文候補が、表示Gate通過後だけ表示されます。',
      emlis_ai: {
        observation_status: 'passed',
        meta: {
          complete_composer_initial_runtime: { status: 'generated' },
          complete_scorecard_event: { display_pass: true },
        },
      },
    },
  };

  assert.equal(getEmlisObservationStatus(completePassedPayload), 'passed');
  assert.equal(
    getEmlisObservationCommentText(completePassedPayload),
    '完全Composer初期版の本文候補が、表示Gate通過後だけ表示されます。'
  );
  assert.equal(isPassedEmlisObservationReply(completePassedPayload), true);
  assert.deepEqual(buildPassedEmlisObservationModalPayload(completePassedPayload), {
    commentText: '完全Composer初期版の本文候補が、表示Gate通過後だけ表示されます。',
    observationStatus: 'passed',
    emotionSummary: '',
    dominantSummary: '',
    contextLabel: '',
  });

  for (const observation_status of ['rejected', 'unavailable', 'safety_blocked', '']) {
    const nonPassedPayload = {
      input_feedback: {
        comment_text: 'non-passed では表示されてはいけない本文です。',
        emlis_ai: {
          observation_status,
          meta: {
            complete_composer_initial_runtime: { status: 'generated' },
            complete_scorecard_event: { display_pass: true },
          },
        },
      },
    };
    assert.equal(isPassedEmlisObservationReply(nonPassedPayload), false);
    assert.equal(buildPassedEmlisObservationModalPayload(nonPassedPayload), null);
  }

  const passedEmptyTextPayload = {
    input_feedback: {
      comment_text: '   ',
      emlis_ai: {
        observation_status: 'passed',
        meta: { complete_composer_initial_runtime: { status: 'generated' } },
      },
    },
  };
  assert.equal(isPassedEmlisObservationReply(passedEmptyTextPayload), false);
  assert.equal(buildPassedEmlisObservationModalPayload(passedEmptyTextPayload), null);

  const completeMetaCannotOverridePublicStatus = {
    input_feedback: {
      comment_text: 'Complete meta 側だけ passed を主張しても表示してはいけない本文です。',
      emlis_ai: {
        observation_status: 'rejected',
        meta: {
          complete_composer_initial_runtime: { observation_status: 'passed' },
          complete_scorecard_event: { display_pass: true },
        },
      },
    },
  };
  assert.equal(getEmlisObservationStatus(completeMetaCannotOverridePublicStatus), 'rejected');
  assert.equal(isPassedEmlisObservationReply(completeMetaCannotOverridePublicStatus), false);
  assert.equal(buildPassedEmlisObservationModalPayload(completeMetaCannotOverridePublicStatus), null);
});


test('Phase 12 Emlis two-stage reception RN contract keeps labels as commentText body only', () => {
  const inputFeedback = read('screens/input/inputFeedbackModel.js');
  const inputFeedbackModal = read('screens/input/useInputFeedbackModal.js');
  const inputFeedbackReplyModal = read('screens/input/InputFeedbackReplyModal.js');
  const input = read('screens/InputScreen.js');

  assertIncludes(inputFeedback, [
    'input?.input_feedback?.emlis_ai?.observation_status',
    'input?.input_feedback?.comment_text',
    'const commentText = getEmlisObservationCommentText(input);',
    'if (observationStatus !== EMLIS_OBSERVATION_STATUS.PASSED || !commentText)',
    'return {',
    'commentText,',
    'observationStatus,',
  ], 'inputFeedbackModel.js Phase 12 still uses public comment_text and passed status only');

  assertNotIncludes(inputFeedback, [
    'input?.input_feedback?.observation_text',
    'input?.input_feedback?.reception_text',
    'observationText',
    'receptionText',
    'sectionLabels',
    'twoStageDisplay',
  ], 'inputFeedbackModel.js Phase 12 must not add public two-stage response keys or parse sections');

  assertIncludes(inputFeedbackModal, [
    'const payload = buildPassedEmlisObservationModalPayload(input);',
    'setInputFeedbackModalText(payload.commentText);',
    'setInputFeedbackModalVisible(true);',
    'return true;',
    'setInputFeedbackModalVisible(false);',
    'return false;',
  ], 'useInputFeedbackModal.js Phase 12 passes commentText through without section parsing');

  assertNotIncludes(inputFeedbackModal, [
    'observationText',
    'receptionText',
    'observation_text',
    'reception_text',
    'split("見えたこと',
    "split('見えたこと",
    'split("Emlisから',
    "split('Emlisから",
  ], 'useInputFeedbackModal.js Phase 12 must not split two-stage comment text');

  assertIncludes(inputFeedbackReplyModal, [
    'const shouldShow = Boolean',
    'visible &&',
    'isPassedEmlisObservationReply({',
    'commentText: text,',
    'observationStatus: meta?.observationStatus || meta?.observation_status',
    '<Modal visible={shouldShow}',
    'Emlisの観測',
    '<Text style={styles.inputFeedbackBodyText}>{text}</Text>',
  ], 'InputFeedbackReplyModal.js Phase 12 keeps title and renders raw commentText body');

  assertNotIncludes(inputFeedbackReplyModal, [
    'observationText',
    'receptionText',
    'observation_text',
    'reception_text',
    'split("見えたこと',
    "split('見えたこと",
    'split("Emlisから',
    "split('Emlisから",
    'sectionLabels',
  ], 'InputFeedbackReplyModal.js Phase 12 must not parse two-stage labels');

  assertIncludes(input, [
    'commentText: inputFeedbackText',
    'observationStatus: inputFeedbackAI?.observation_status',
    'const openedObservation = inputFeedbackText',
    'if (!openedObservation)',
    'completeTutorialAfterReply();',
  ], 'InputScreen.js Phase 12 keeps modal opening contract unchanged');

  assertNotIncludes(input, [
    'observation_text',
    'reception_text',
    'observationStatus: inputFeedbackAI?.observation_status || "passed"',
    'observationStatus: TUTORIAL_EMLIS_REPLY.meta?.observation_status || "passed"',
  ], 'InputScreen.js Phase 12 must not read new response keys or force passed');

  const {
    getEmlisObservationStatus,
    getEmlisObservationCommentText,
    isPassedEmlisObservationReply,
    buildPassedEmlisObservationModalPayload,
  } = loadInputFeedbackModelForContractTest();

  const twoStageCommentText = [
    '見えたこと：',
    '不快で怖さもある出来事に出くわして、怒りが残っているように見えます。',
    '',
    'Emlisから：',
    'うわ、それは嫌でしたね。',
    '怖さも怒りも残るのは自然です。',
  ].join('\n');

  const twoStagePassedPayload = {
    input_feedback: {
      comment_text: twoStageCommentText,
      observation_text: 'RN側で読んではいけない分離keyです。',
      reception_text: 'RN側で読んではいけない分離keyです。',
      emlis_ai: {
        observation_status: 'passed',
        observation_text: 'meta内本文候補もRN表示対象外です。',
        reception_text: 'meta内本文候補もRN表示対象外です。',
        meta: {
          two_stage_reception: {
            observation_text: 'public meta内の本文候補も使わない。',
            reception_text: 'public meta内の本文候補も使わない。',
          },
        },
      },
    },
  };

  assert.equal(getEmlisObservationStatus(twoStagePassedPayload), 'passed');
  assert.equal(getEmlisObservationCommentText(twoStagePassedPayload), twoStageCommentText);
  assert.equal(isPassedEmlisObservationReply(twoStagePassedPayload), true);
  assert.deepEqual(buildPassedEmlisObservationModalPayload(twoStagePassedPayload), {
    commentText: twoStageCommentText,
    observationStatus: 'passed',
    emotionSummary: '',
    dominantSummary: '',
    contextLabel: '',
  });

  for (const observation_status of ['rejected', 'unavailable', 'safety_blocked', '']) {
    const nonPassedTwoStagePayload = {
      input_feedback: {
        comment_text: twoStageCommentText,
        emlis_ai: { observation_status },
      },
    };
    assert.equal(isPassedEmlisObservationReply(nonPassedTwoStagePayload), false);
    assert.equal(buildPassedEmlisObservationModalPayload(nonPassedTwoStagePayload), null);
  }

  const splitKeyOnlyPayload = {
    input_feedback: {
      comment_text: '',
      observation_text: '見えたことだけを別keyで返してもRNは表示しません。',
      reception_text: 'Emlisからだけを別keyで返してもRNは表示しません。',
      emlis_ai: { observation_status: 'passed' },
    },
  };
  assert.equal(getEmlisObservationStatus(splitKeyOnlyPayload), 'passed');
  assert.equal(getEmlisObservationCommentText(splitKeyOnlyPayload), '');
  assert.equal(isPassedEmlisObservationReply(splitKeyOnlyPayload), false);
  assert.equal(buildPassedEmlisObservationModalPayload(splitKeyOnlyPayload), null);

  const metaOnlyTwoStagePassedPayload = {
    input_feedback: {
      comment_text: '',
      emlis_ai: {
        observation_status: '',
        meta: {
          observation_status: 'passed',
          comment_text: twoStageCommentText,
          two_stage_reception: {
            labels_present: true,
            observation_section_present: true,
            reception_section_present: true,
          },
        },
      },
    },
  };
  assert.equal(getEmlisObservationStatus(metaOnlyTwoStagePassedPayload), '');
  assert.equal(getEmlisObservationCommentText(metaOnlyTwoStagePassedPayload), '');
  assert.equal(isPassedEmlisObservationReply(metaOnlyTwoStagePassedPayload), false);
  assert.equal(buildPassedEmlisObservationModalPayload(metaOnlyTwoStagePassedPayload), null);
});


test('Phase 12 RN keeps two-stage reception as verbatim public commentText without split-key fallback', () => {
  const inputFeedback = read('screens/input/inputFeedbackModel.js');
  const inputFeedbackModal = read('screens/input/useInputFeedbackModal.js');
  const inputFeedbackReplyModal = read('screens/input/InputFeedbackReplyModal.js');
  const input = read('screens/InputScreen.js');

  assertIncludes(inputFeedback + inputFeedbackModal + inputFeedbackReplyModal, [
    'getEmlisObservationStatus(input) === EMLIS_OBSERVATION_STATUS.PASSED',
    'Boolean(getEmlisObservationCommentText(input))',
    'setInputFeedbackModalText(payload.commentText);',
    '<Text style={styles.inputFeedbackBodyText}>{text}</Text>',
    'Emlisの観測',
  ], 'RN Phase 12 keeps existing passed/commentText modal contract');

  assertNotIncludes(inputFeedback + inputFeedbackModal + inputFeedbackReplyModal + input, [
    'input?.input_feedback?.observation_text',
    'input?.input_feedback?.reception_text',
    'inputFeedback?.observation_text',
    'inputFeedback?.reception_text',
    'observationText',
    'receptionText',
    'twoStageDisplay',
    'sectionLabels',
    'split("見えたこと',
    "split('見えたこと",
    'split("Emlisから',
    "split('Emlisから",
  ], 'RN Phase 12 must not introduce split response keys or parse section labels');

  const {
    getEmlisObservationStatus,
    getEmlisObservationCommentText,
    isPassedEmlisObservationReply,
    buildPassedEmlisObservationModalPayload,
  } = loadInputFeedbackModelForContractTest();

  const twoStageCommentText = [
    '見えたこと：',
    '自信をつけたい気持ちと、これでいいのかという不安が同じ入力に残っているように見えます。',
    '',
    'Emlisから：',
    'Emlisには、ここにあるものが「中途半端」だけだとは見えません。',
    '直したい気持ちも、挑戦しているところも、一緒に残っています。',
  ].join('\n');

  const publicTwoStagePayload = {
    input_feedback: {
      comment_text: twoStageCommentText,
      observation_text: 'この分離keyは初期実装のRN表示対象ではありません。',
      reception_text: 'この分離keyも初期実装のRN表示対象ではありません。',
      emlis_ai: {
        observation_status: 'passed',
        observation_text: 'meta内の観測本文候補は使いません。',
        reception_text: 'meta内の受け取り本文候補は使いません。',
        two_stage_reception: { labels_present: true },
      },
    },
  };

  assert.equal(getEmlisObservationStatus(publicTwoStagePayload), 'passed');
  assert.equal(getEmlisObservationCommentText(publicTwoStagePayload), twoStageCommentText);
  assert.equal(isPassedEmlisObservationReply(publicTwoStagePayload), true);
  assert.deepEqual(buildPassedEmlisObservationModalPayload(publicTwoStagePayload), {
    commentText: twoStageCommentText,
    observationStatus: 'passed',
    emotionSummary: '',
    dominantSummary: '',
    contextLabel: '',
  });

  const directModalPayload = {
    commentText: twoStageCommentText,
    observationStatus: 'passed',
    observationText: '直接payloadの分離風keyも使いません。',
    receptionText: '直接payloadの分離風keyも使いません。',
  };
  assert.equal(getEmlisObservationCommentText(directModalPayload), twoStageCommentText);
  assert.equal(isPassedEmlisObservationReply(directModalPayload), true);
  assert.equal(buildPassedEmlisObservationModalPayload(directModalPayload)?.commentText, twoStageCommentText);

  for (const observation_status of ['rejected', 'unavailable', 'safety_blocked', '']) {
    assert.equal(
      buildPassedEmlisObservationModalPayload({
        input_feedback: {
          comment_text: twoStageCommentText,
          emlis_ai: { observation_status },
        },
      }),
      null
    );
  }
});


test('Phase16-9 RN regression keeps TwoStage Composer surface as verbatim passed commentText only', () => {
  const inputFeedback = read('screens/input/inputFeedbackModel.js');
  const inputFeedbackModal = read('screens/input/useInputFeedbackModal.js');
  const inputFeedbackReplyModal = read('screens/input/InputFeedbackReplyModal.js');
  const input = read('screens/InputScreen.js');

  assertIncludes(inputFeedback, [
    'export function getEmlisObservationStatus(input = {})',
    'input?.input_feedback?.emlis_ai?.observation_status',
    'export function getEmlisObservationCommentText(input = {})',
    'input?.input_feedback?.comment_text',
    'export function buildPassedEmlisObservationModalPayload(input = {})',
    'if (observationStatus !== EMLIS_OBSERVATION_STATUS.PASSED || !commentText)',
    'commentText,',
    'observationStatus,',
  ], 'inputFeedbackModel.js Phase16-9 keeps public passed/comment_text as the only Emlis display source');

  assertNotIncludes(inputFeedback, [
    'input?.input_feedback?.observation_text',
    'input?.input_feedback?.reception_text',
    'observationText',
    'receptionText',
    'split("見えたこと',
    "split('見えたこと",
    'split("Emlisから',
    "split('Emlisから",
    'state_answer_two_stage_display_required',
    'two_stage_surface_realization',
  ], 'inputFeedbackModel.js Phase16-9 must not parse section labels or read backend two-stage internals');

  assertIncludes(inputFeedbackModal, [
    'const payload = buildPassedEmlisObservationModalPayload(input);',
    'setInputFeedbackModalText(payload.commentText);',
    'setInputFeedbackModalVisible(true);',
    'setInputFeedbackModalVisible(false);',
    'setInputFeedbackModalText("");',
    'return false;',
  ], 'useInputFeedbackModal.js Phase16-9 passes commentText through verbatim and fail-closes otherwise');

  assertNotIncludes(inputFeedbackModal, [
    'observationText',
    'receptionText',
    'observation_text',
    'reception_text',
    'split("見えたこと',
    "split('見えたこと",
    'split("Emlisから',
    "split('Emlisから",
    'two_stage_surface_realization',
  ], 'useInputFeedbackModal.js Phase16-9 must not split or rehydrate two-stage sections');

  assertIncludes(inputFeedbackReplyModal, [
    'const shouldShow = Boolean',
    'visible &&',
    'isPassedEmlisObservationReply({',
    'commentText: text,',
    'observationStatus: meta?.observationStatus || meta?.observation_status',
    '<Modal visible={shouldShow}',
    'Emlisの観測',
    '<Text style={styles.inputFeedbackBodyText}>{text}</Text>',
  ], 'InputFeedbackReplyModal.js Phase16-9 keeps the existing title and renders the commentText body only');

  assertNotIncludes(inputFeedbackReplyModal, [
    'observationText',
    'receptionText',
    'observation_text',
    'reception_text',
    'split("見えたこと',
    "split('見えたこと",
    'split("Emlisから',
    "split('Emlisから",
    'sectionLabels',
    'two_stage_surface_realization',
  ], 'InputFeedbackReplyModal.js Phase16-9 must not parse two-stage labels or render split cards');

  assertIncludes(input, [
    'commentText: inputFeedbackText',
    'observationStatus: inputFeedbackAI?.observation_status',
    'const openedObservation = inputFeedbackText',
    'if (!openedObservation)',
    'completeTutorialAfterReply();',
  ], 'InputScreen.js Phase16-9 keeps the emotion submit display path on public comment_text and observation_status');

  assertNotIncludes(input, [
    'observation_text',
    'reception_text',
    'observationStatus: inputFeedbackAI?.observation_status || "passed"',
    'observationStatus: TUTORIAL_EMLIS_REPLY.meta?.observation_status || "passed"',
    'two_stage_surface_realization',
    'state_answer_two_stage_display_required',
  ], 'InputScreen.js Phase16-9 must not add split response keys, backend internals, or forced passed status');

  const {
    getEmlisObservationStatus,
    getEmlisObservationCommentText,
    isPassedEmlisObservationReply,
    buildPassedEmlisObservationModalPayload,
  } = loadInputFeedbackModelForContractTest();

  const twoStageCommentText = [
    '見えたこと：',
    '日常の嫌な出来事に触れて、不快さや怖さ、怒りの反応が残っているように見えます。',
    '',
    'Emlisから：',
    'それは軽く流しにくい場面として受け取れます。',
    '怖さや怒りが残るのも自然です。',
  ].join('\n');

  const phase16E2ePublicPayload = {
    input_feedback: {
      comment_text: twoStageCommentText,
      observation_text: 'Phase16-9で追加してはいけないpublic split keyです。',
      reception_text: 'Phase16-9で追加してはいけないpublic split keyです。',
      emlis_ai: {
        observation_status: 'passed',
        meta: {
          two_stage_surface_realization: {
            applied: true,
            labels_present: true,
            section_order_valid: true,
            comment_text_body_included: false,
          },
          public_response_key_added: false,
        },
      },
    },
  };

  assert.equal(getEmlisObservationStatus(phase16E2ePublicPayload), 'passed');
  assert.equal(getEmlisObservationCommentText(phase16E2ePublicPayload), twoStageCommentText);
  assert.equal(isPassedEmlisObservationReply(phase16E2ePublicPayload), true);
  assert.deepEqual(buildPassedEmlisObservationModalPayload(phase16E2ePublicPayload), {
    commentText: twoStageCommentText,
    observationStatus: 'passed',
    emotionSummary: '',
    dominantSummary: '',
    contextLabel: '',
  });

  for (const observation_status of ['rejected', 'unavailable', 'safety_blocked', '']) {
    const nonPassedTwoStagePayload = {
      input_feedback: {
        comment_text: twoStageCommentText,
        emlis_ai: {
          observation_status,
          meta: {
            two_stage_surface_realization: { labels_present: true, section_order_valid: true },
          },
        },
      },
    };
    assert.equal(isPassedEmlisObservationReply(nonPassedTwoStagePayload), false);
    assert.equal(buildPassedEmlisObservationModalPayload(nonPassedTwoStagePayload), null);
  }

  const splitKeyOnlyPayload = {
    input_feedback: {
      comment_text: '',
      observation_text: '見えたこと側だけを別keyにしても表示しません。',
      reception_text: 'Emlisから側だけを別keyにしても表示しません。',
      emlis_ai: { observation_status: 'passed' },
    },
  };
  assert.equal(getEmlisObservationStatus(splitKeyOnlyPayload), 'passed');
  assert.equal(getEmlisObservationCommentText(splitKeyOnlyPayload), '');
  assert.equal(isPassedEmlisObservationReply(splitKeyOnlyPayload), false);
  assert.equal(buildPassedEmlisObservationModalPayload(splitKeyOnlyPayload), null);

  const metaOnlyTwoStagePayload = {
    input_feedback: {
      comment_text: '',
      emlis_ai: {
        observation_status: '',
        meta: {
          observation_status: 'passed',
          comment_text: twoStageCommentText,
          two_stage_surface_realization: { labels_present: true, section_order_valid: true },
        },
      },
    },
  };
  assert.equal(getEmlisObservationStatus(metaOnlyTwoStagePayload), '');
  assert.equal(getEmlisObservationCommentText(metaOnlyTwoStagePayload), '');
  assert.equal(isPassedEmlisObservationReply(metaOnlyTwoStagePayload), false);
  assert.equal(buildPassedEmlisObservationModalPayload(metaOnlyTwoStagePayload), null);
});


test('Phase17-9 RN regression keeps five product-visible TwoStage fixtures as verbatim passed commentText only', () => {
  const inputFeedback = read('screens/input/inputFeedbackModel.js');
  const inputFeedbackModal = read('screens/input/useInputFeedbackModal.js');
  const inputFeedbackReplyModal = read('screens/input/InputFeedbackReplyModal.js');
  const input = read('screens/InputScreen.js');

  assertIncludes(inputFeedback, [
    'export function getEmlisObservationStatus(input = {})',
    'input?.input_feedback?.emlis_ai?.observation_status',
    'export function getEmlisObservationCommentText(input = {})',
    'input?.input_feedback?.comment_text',
    'export function buildPassedEmlisObservationModalPayload(input = {})',
    'if (observationStatus !== EMLIS_OBSERVATION_STATUS.PASSED || !commentText)',
    'commentText,',
    'observationStatus,',
  ], 'inputFeedbackModel.js Phase17-9 keeps public passed/comment_text as the only five-fixture display source');

  assertIncludes(inputFeedbackModal, [
    'const payload = buildPassedEmlisObservationModalPayload(input);',
    'setInputFeedbackModalText(payload.commentText);',
    'setInputFeedbackModalVisible(true);',
    'setInputFeedbackModalVisible(false);',
    'setInputFeedbackModalText("");',
    'return false;',
  ], 'useInputFeedbackModal.js Phase17-9 keeps modal opener on passed-only payload');

  assertIncludes(inputFeedbackReplyModal, [
    'const shouldShow = Boolean',
    'visible &&',
    'isPassedEmlisObservationReply({',
    'commentText: text,',
    'observationStatus: meta?.observationStatus || meta?.observation_status',
    '<Modal visible={shouldShow}',
    'Emlisの観測',
    '<Text style={styles.inputFeedbackBodyText}>{text}</Text>',
  ], 'InputFeedbackReplyModal.js Phase17-9 keeps existing modal title and body rendering');

  assertIncludes(input, [
    'commentText: inputFeedbackText',
    'observationStatus: inputFeedbackAI?.observation_status',
    'const openedObservation = inputFeedbackText',
    'if (!openedObservation)',
    'completeTutorialAfterReply();',
  ], 'InputScreen.js Phase17-9 keeps /emotion/submit display path backend-owned');

  assertNotIncludes(inputFeedback + inputFeedbackModal + inputFeedbackReplyModal + input, [
    'input?.input_feedback?.observation_text',
    'input?.input_feedback?.reception_text',
    'inputFeedback?.observation_text',
    'inputFeedback?.reception_text',
    'observationText',
    'receptionText',
    'twoStageDisplay',
    'sectionLabels',
    'split("見えたこと',
    "split('見えたこと",
    'split("Emlisから',
    "split('Emlisから",
    'phase17_6_grounding_relation_binding',
    'phase17_7_self_repair_unavailable_reason',
    'two_stage_product_visible_fixture_completion',
    'product_visible_fixture_reached',
    'observationStatus: inputFeedbackAI?.observation_status || "passed"',
    'observationStatus: TUTORIAL_EMLIS_REPLY.meta?.observation_status || "passed"',
  ], 'RN Phase17-9 must not parse two-stage labels, read split keys, read Phase17 backend internals, or force passed');

  const {
    getEmlisObservationStatus,
    getEmlisObservationCommentText,
    isPassedEmlisObservationReply,
    buildPassedEmlisObservationModalPayload,
  } = loadInputFeedbackModelForContractTest();

  const phase17ProductVisibleFixtures = [
    {
      caseId: 'daily_unpleasant_encounter_A',
      commentText: [
        '見えたこと：',
        '日常の嫌な出来事に触れて、不快さや怖さ、怒りの反応が残っているように見えます。',
        '',
        'Emlisから：',
        'それは軽く流しにくい場面として受け取れます。',
        '怖さや怒りが残るのも自然です。',
      ].join('\n'),
    },
    {
      caseId: 'self_confidence_uncertainty_B',
      commentText: [
        '見えたこと：',
        '自信をつけたい気持ちと、これでいいのかという不安が同じ入力に残っているように見えます。',
        '',
        'Emlisから：',
        'Emlisには、ここにあるものが「中途半端」だけだとは見えません。',
        '直したい気持ちも、挑戦しているところも、一緒に残っています。',
      ].join('\n'),
    },
    {
      caseId: 'positive_change_after_work_streaming',
      commentText: [
        '見えたこと：',
        '仕事後の疲れがある中で、誰かと話したい気持ちが出た変化が見えます。',
        '',
        'Emlisから：',
        '気持ちが少し動いたこととして受け取れます。',
        '嬉しさと動揺が同時に残っているのも自然です。',
      ].join('\n'),
    },
    {
      caseId: 'self_blame_to_gentle_self_observation',
      commentText: [
        '見えたこと：',
        '自分を責める流れから、少し優しく見ようとする方向へ移っているように見えます。',
        '',
        'Emlisから：',
        '昨日の自分を否定だけで終わらせない動きとして受け取れます。',
        '自分の気持ちを見ようとしているところも残っています。',
      ].join('\n'),
    },
    {
      caseId: 'independence_life_health_money_pace',
      commentText: [
        '見えたこと：',
        '自立、生活、体調、お金、続けられるペースが並んでいるように見えます。',
        '',
        'Emlisから：',
        '無理に頑張り切るより、続けられる形を探していることとして受け取れます。',
        '体調や生活を見ながら進めたい気持ちも一緒に残っています。',
      ].join('\n'),
    },
  ];

  for (const { caseId, commentText } of phase17ProductVisibleFixtures) {
    assert.equal(commentText.split('見えたこと：').length - 1, 1, `${caseId} has one observation label`);
    assert.equal(commentText.split('Emlisから：').length - 1, 1, `${caseId} has one reception label`);

    const publicPayload = {
      input_feedback: {
        comment_text: commentText,
        observation_text: `${caseId} のsplit keyはRN表示対象ではありません。`,
        reception_text: `${caseId} のsplit keyもRN表示対象ではありません。`,
        emlis_ai: {
          observation_status: 'passed',
          meta: {
            phase17_6_grounding_relation_binding: { applied: true, comment_text_body_included: false },
            phase17_7_self_repair_unavailable_reason: { reason_summary_only: true },
            product_visible_fixture_reached: true,
            two_stage_surface_realization: { labels_present: true, section_order_valid: true },
            public_response_key_added: false,
          },
        },
      },
    };

    assert.equal(getEmlisObservationStatus(publicPayload), 'passed', `${caseId} status`);
    assert.equal(getEmlisObservationCommentText(publicPayload), commentText, `${caseId} commentText is verbatim`);
    assert.equal(isPassedEmlisObservationReply(publicPayload), true, `${caseId} is visible only by public passed/comment_text`);
    assert.deepEqual(buildPassedEmlisObservationModalPayload(publicPayload), {
      commentText,
      observationStatus: 'passed',
      emotionSummary: '',
      dominantSummary: '',
      contextLabel: '',
    }, `${caseId} modal payload keeps full two-stage text`);

    for (const observation_status of ['rejected', 'unavailable', 'safety_blocked', '']) {
      const nonPassedPayload = {
        input_feedback: {
          comment_text: commentText,
          emlis_ai: {
            observation_status,
            meta: {
              product_visible_fixture_reached: true,
              two_stage_surface_realization: { labels_present: true, section_order_valid: true },
            },
          },
        },
      };
      assert.equal(isPassedEmlisObservationReply(nonPassedPayload), false, `${caseId} ${observation_status} is hidden`);
      assert.equal(buildPassedEmlisObservationModalPayload(nonPassedPayload), null, `${caseId} ${observation_status} has no modal payload`);
    }

    const splitKeyOnlyPayload = {
      input_feedback: {
        comment_text: '',
        observation_text: commentText,
        reception_text: commentText,
        emlis_ai: {
          observation_status: 'passed',
          meta: { observation_status: 'passed', comment_text: commentText },
        },
      },
    };
    assert.equal(getEmlisObservationCommentText(splitKeyOnlyPayload), '', `${caseId} split/meta-only text is ignored`);
    assert.equal(isPassedEmlisObservationReply(splitKeyOnlyPayload), false, `${caseId} split/meta-only payload is hidden`);
    assert.equal(buildPassedEmlisObservationModalPayload(splitKeyOnlyPayload), null, `${caseId} split/meta-only payload has no modal payload`);
  }
});


test('Kokoro weather Phase 6 QA keeps current card, report strip, modal, and formatter fail-closed', () => {
  const currentCard = read('screens/analysisReport/KokoroWeatherCurrentCard.js');
  const forecastStrip = read('screens/analysisReport/KokoroWeatherForecastStrip.js');
  const detailModal = read('screens/analysisReport/KokoroWeatherDetailModal.js');
  const formatters = read('screens/analysisReport/kokoroWeatherFormatters.js');
  const viewer = read('screens/AnalysisReportViewerScreen.js');

  assertIncludes(currentCard, [
    'status === "no_observation"',
    '今日はまだ観測がありません',
    '前回のこころ天気を見る',
    'replace(/℃/g, "°")',
    '今日0:00から現在までの入力をもとに、こころの状態を観測します。',
  ], 'KokoroWeatherCurrentCard.js no-observation and degree display contract');

  assertIncludes(forecastStrip, [
    'export default function KokoroWeatherForecastStrip',
    'こころ天気図',
    '最高',
    '最低',
    '対象をタップすると、時間帯別のこころ天気を横にスクロールして確認できます。',
    '<ScrollView horizontal showsHorizontalScrollIndicator={false}>',
    'disabled={isDisabled}',
    '観測少なめ',
  ], 'KokoroWeatherForecastStrip.js horizontal forecast contract');

  assertIncludes(detailModal, [
    'export default function KokoroWeatherDetailModal',
    '<Modal visible={!!visible} transparent animationType="slide" onRequestClose={onClose}>',
    'onPress={onClose}',
    'accessibilityLabel="こころ天気の詳細を閉じる"',
    '時間帯別こころ天気',
    '<ScrollView horizontal showsHorizontalScrollIndicator={false}>',
    '時間帯別のこころ天気はまだありません。',
  ], 'KokoroWeatherDetailModal.js modal and horizontal bucket contract');

  assertIncludes(formatters, [
    'export const KOKORO_WEATHER_VERSION = "kokoro.weather.v1";',
    'daily: "こころ天気（日）"',
    'weekly: "こころ天気（週）"',
    'monthly: "こころ天気（月）"',
    'text.endsWith("°")',
    'replace(/℃/g, "°")',
    'weather.status === "no_observation"',
    'return false;',
    'resolveWeatherVisual',
    'normalizeKokoroWeatherPayload',
  ], 'kokoroWeatherFormatters.js normalization and old-data fail-closed contract');

  assertIncludes(viewer, [
    'import KokoroWeatherForecastStrip from "./analysisReport/KokoroWeatherForecastStrip";',
    'import KokoroWeatherDetailModal from "./analysisReport/KokoroWeatherDetailModal";',
    'contentJson?.kokoroWeather',
    'setSelectedKokoroWeatherItem',
    'KokoroWeatherForecastStrip',
    'KokoroWeatherDetailModal',
  ], 'AnalysisReportViewerScreen.js kokoroWeather report UI contract');

  assertNotIncludes(currentCard + forecastStrip + detailModal + formatters, [
    '注意報',
    '警報',
    '良い感情',
    '悪い感情',
  ], 'kokoro weather frontend must keep observation wording non-warning and non-judgmental');
});

test('Kokoro weather Phase 6 QA keeps scope on emotion analysis and preserves plan/paywall boundaries', () => {
  const contentFirst = read('screens/AnalysisContentFirstScreen.js');
  const emotionMenu = read('screens/AnalysisEmotionScreen.js');
  const history = read('screens/AnalysisReportHistoryScreen.js');
  const accessPolicy = read('screens/analysisReport/analysisReportAccessPolicy.js');
  const guide = read('guide/guidesJa.js');
  const terms = read('guide/termsJa.js');
  const tutorialData = read('tutorial/tutorialScenarioData.js');
  const tutorialFixtures = read('tutorial/generated/tutorialFixtures.generated.json');

  assertIncludes(contentFirst, [
    'KokoroWeatherCurrentCard',
    'currentWeather',
    'isKokoroWeatherReportRecord',
    'handleOpenPreviousKokoroWeather',
    '{ key: "daily", label: "こころ天気（日）" }',
    '{ key: "weekly", label: "こころ天気（週）" }',
    '{ key: "monthly", label: "こころ天気（月）" }',
  ], 'AnalysisContentFirstScreen.js top UI and tab label contract');

  assertIncludes(emotionMenu, [
    'こころ天気（日）',
    'こころ天気（週）',
    'こころ天気（月）',
    '最新のこころ天気（日/週/月）を確認します',
    '過去のこころ天気を振り返ります',
  ], 'AnalysisEmotionScreen.js kokoro weather copy contract');

  assertIncludes(history, [
    'こころ天気（日）',
    'こころ天気（週）',
    'こころ天気（月）',
    'Freeプランの',
    'canViewAnalysisFullText',
  ], 'AnalysisReportHistoryScreen.js history and plan boundary contract');

  assertIncludes(accessPolicy, [
    'canViewAnalysisFullText',
    'tier === "plus" || tier === "premium"',
    'canViewAnalysisDeep',
    'tier === "premium"',
    'isEmotionReportType',
    'reportType === "daily" || reportType === "weekly" || reportType === "monthly"',
  ], 'analysisReportAccessPolicy.js keeps existing Free/Plus/Premium boundaries');

  assertIncludes(guide, [
    'こころ天気（日）・こころ天気（週）・こころ天気（月）',
    '感情分析のこころ天気',
    'わたしマップの入口はFreeプランでも見られます。Plusプラン以上では、役割スイッチの一覧、よく通るルート、詳しい自己分析レポートを読めます。',
  ], 'guide/guidesJa.js preserves emotion-only kokoro weather and self-analysis copy');

  assertIncludes(terms, [
    'こころ天気',
    '感情入力をもとに、こころ天気（日/週/月）を見る分析です。',
    '感情入力をもとに、こころ天気（日/週/月）を見る分析です。',
  ], 'guide/termsJa.js kokoro weather terms contract');

  assertIncludes(tutorialData, [
    'こころ天気',
    'こころ天気（日/週/月）',
  ], 'tutorialScenarioData.js kokoro weather tutorial labels');

  assertIncludes(tutorialFixtures, [
    'kokoroWeather',
    '"report_type": "daily"',
    '"report_type": "weekly"',
    '"report_type": "monthly"',
  ], 'tutorialFixtures.generated.json contains kokoroWeather examples');

  const selfStructureFiles = [
    read('screens/AnalysisSelfStructureScreen.js'),
    read('screens/SelfStructureReportGenerateScreen.js'),
    read('screens/SelfStructureReportHistoryScreen.js'),
    read('screens/SelfStructureReportViewerScreen.js'),
  ].join('\n');

  assertNotIncludes(selfStructureFiles, [
    'こころ天気（日）',
    'こころ天気（週）',
    'こころ天気（月）',
    '今のこころ天気',
  ], 'Self Structure surfaces must not be kokoro-weatherized');
});

test('Watashi Map Phase 3 updates top UI labels and keeps Free latest entry open', () => {
  const contentFirst = read('screens/AnalysisContentFirstScreen.js');
  const top = read('screens/AnalysisTopScreen.js');
  const analysis = read('screens/AnalysisScreen.js');
  const selfMenu = read('screens/AnalysisSelfStructureScreen.js');
  const selfActions = read('screens/analysis/useAnalysisSelfStructureActions.js');
  const generate = read('screens/SelfStructureReportGenerateScreen.js');
  const unread = read('screens/analysis/useAnalysisUnreadBadges.js');
  const guide = read('guide/guidesJa.js');
  const terms = read('guide/termsJa.js');
  const iap = read('lib/iap/iapRuntimeCatalog.js');
  const tutorial = read('tutorial/tutorialScenarioData.js');

  assertIncludes(contentFirst, [
    '{ key: "self", label: "わたしマップ" }',
    'titleOverride="今のわたしマップ"',
    'わたしマップの履歴を見る',
  ], 'AnalysisContentFirstScreen.js watashi map top tab');

  assertIncludes(top + analysis + selfMenu, [
    'わたしマップ',
    '今のわたしマップ',
    '場面ごとの役割',
    'わたしマップの履歴',
  ], 'Analysis top/self menu watashi map labels');

  assertIncludes(selfActions, [
    'requiresPaid = false',
    'targetRoute: ROUTE_SELF_REPORT_GENERATE',
    'requiresPaid: false',
    '履歴画面でプラン別に表示範囲を整理します。詳しい自己分析レポートはPlusプラン以上で読めます。',
  ], 'Self structure actions keep latest and history route open while screens gate detail');

  assertIncludes(generate, [
    'free: ["light"]',
    'light: "概要"',
    'standard: "標準マップ"',
    'deep: "深いマップ"',
    'titleOverride = "今のわたしマップ"',
    '詳しい自己分析レポート',
    'まだ地図にできる観測が少なめです',
  ], 'SelfStructureReportGenerateScreen.js watashi map labels and light mode');

  assertIncludes(unread, [
    'if (subscriptionLoading) return false;',
    '!!(selfStructureLatestUnread || (isPaid && selfStructureHistoryUnread))',
  ], 'Self Structure unread latest can surface for Free while history stays paid');

  assertIncludes(guide + terms + iap + tutorial, [
    'わたしマップでは、あなたがどんな場面でどんな役割になりやすいか、そしてそのとき選びやすい行動を見ていきます。',
    '詳しい自己分析レポート',
    'わたしマップで役割スイッチ',
  ], 'Watashi map copy is propagated to guide, terms, IAP, and tutorial');
});

test('Watashi Map Phase 4 renderer surfaces watashiMap cards and legacy fallback', () => {
  const renderer = read('components/selfStructure/WatashiMapRenderer.js');
  const overview = read('components/selfStructure/WatashiMapOverviewCard.js');
  const roleSwitch = read('components/selfStructure/RoleSwitchList.js');
  const route = read('components/selfStructure/RoutePatternCard.js');
  const crossroad = read('components/selfStructure/CrossroadCard.js');
  const unknown = read('components/selfStructure/UnknownAreaCard.js');
  const formatters = read('components/selfStructure/watashiMapFormatters.js');
  const generate = read('screens/SelfStructureReportGenerateScreen.js');
  const viewer = read('screens/SelfStructureReportViewerScreen.js');

  assertIncludes(formatters, [
    'export function normalizeWatashiMapPayload',
    'export function hasWatashiMapRenderableContent',
    'export function adaptSelfStructureDeepVisualToWatashiMap',
    'watashi.map.v1',
    'selfStructureDeepVisual',
    '詳しい自己分析レポートは Plus プラン以上で読めます。',
  ], 'watashiMapFormatters.js normalizes additive payload and legacy visual fallback');

  assertIncludes(renderer, [
    'export default function WatashiMapRenderer',
    'WatashiMapOverviewCard',
    'RoleSwitchList',
    'RoutePatternCard',
    'CrossroadCard',
    'UnknownAreaCard',
    'normalizeWatashiMapPayload',
    'LockedSectionCard',
    '詳しい自己分析レポート',
    'Plusでは、役割スイッチの一覧と、よく通るルートを詳しく読めます。',
  ], 'WatashiMapRenderer.js composes watashi map cards and lock card');

  assertIncludes(overview + roleSwitch + route + crossroad + unknown, [
    '今のわたしマップ',
    '人は、相手や場所によって少しずつ違う自分で動いています。',
    '役割スイッチ',
    'よく通るルート',
    '迷いやすい分かれ道',
    'まだ地図にない場所',
  ], 'Watashi Map card components expose user-facing labels');

  assertIncludes(generate, [
    'import WatashiMapRenderer from "../components/selfStructure/WatashiMapRenderer";',
    'hasWatashiMapRenderableContent',
    'normalizeWatashiMapPayload',
    'shouldShowDetailText',
    'viewerTier={subscriptionTier}',
    'onUpgradePress={openSubscriptionSelect}',
  ], 'SelfStructureReportGenerateScreen.js uses WatashiMapRenderer and hides locked detail text');

  assertIncludes(viewer, [
    'import WatashiMapRenderer from "../components/selfStructure/WatashiMapRenderer";',
    'viewerTier = normalizeSubscriptionTier(tier)',
    'hasWatashiMapRenderableContent',
    'normalizeWatashiMapPayload',
    'detailReportVisible',
    'getWatashiMapDetailLockLabel',
  ], 'SelfStructureReportViewerScreen.js renders watashiMap before legacy text fallback');
});

test('Watashi Map Phase 5 fixes history/detail tier boundaries', () => {
  const access = read('components/selfStructure/watashiMapAccessPolicy.js');
  const actions = read('screens/analysis/useAnalysisSelfStructureActions.js');
  const analysis = read('screens/AnalysisScreen.js');
  const history = read('screens/SelfStructureReportHistoryScreen.js');
  const viewer = read('screens/SelfStructureReportViewerScreen.js');
  const formatters = read('components/selfStructure/watashiMapFormatters.js');

  assertIncludes(access, [
    'export function canViewWatashiMapHistory',
    'export function canViewWatashiMapDetailReport',
    'export function canExportWatashiMapPdf',
    '履歴の閲覧範囲：Freeは最新概要のみ',
    '履歴の閲覧範囲：直近1年分',
    '履歴の閲覧範囲：無制限',
    'Freeプランでは今のわたしマップ概要を見られます。過去の詳しい自己分析レポートの履歴はPlusプラン以上で読めます。',
    '長期の変化と深い分かれ道はPremiumプランで見られます。',
  ], 'watashiMapAccessPolicy.js defines Phase 5 tier boundaries');

  assertIncludes(actions, [
    'openSelfReportHistory',
    'requiresPaid: false',
    '履歴画面でプラン別に表示範囲を整理します。詳しい自己分析レポートはPlusプラン以上で読めます。',
  ], 'useAnalysisSelfStructureActions.js lets history screen own Free/Plus/Premium gating');

  assertIncludes(analysis, [
    'onOpenLatest={() => openSelfReportLatest("light", ROUTE_SELF_STRUCTURE)}',
    'onOpenSubscription={openSubscriptionSelect}',
  ], 'AnalysisScreen.js passes latest and subscription actions into self history/detail');

  assertIncludes(history, [
    'canViewWatashiMapHistory',
    'getWatashiMapHistoryRetentionLabel',
    'getWatashiMapHistoryLockBody',
    '今のわたしマップを見る',
    'まだわたしマップの履歴がありません',
    'formatWatashiMapReportModeLabel',
    'Exported from Cocolon / Watashi Map',
  ], 'SelfStructureReportHistoryScreen.js renders Phase 5 history lock and labels');

  assertIncludes(viewer, [
    'canViewWatashiMapDetailReport',
    'getWatashiMapDetailLockLabel',
    'onOpenSubscription',
    'onUpgradePress={onOpenSubscription}',
    'Exported from Cocolon / Watashi Map',
  ], 'SelfStructureReportViewerScreen.js gates detail text and upgrade action by tier');

  assertIncludes(formatters, [
    'formatReportModeLabel',
    'report_mode_label',
    'getWatashiMapDetailLockLabel',
    'canViewWatashiMapDetailReport',
  ], 'watashiMapFormatters.js projects Phase 5 visibility into renderer payload');
});




test('Watashi Map Phase 6 copy, tutorial fixture, and QA guardrails stay aligned', () => {
  const tutorialFlow = read('screens/TutorialFlowScreen.js');
  const nexus = read('screens/NexusScreen.js');
  const scenario = read('tutorial/tutorialScenarioData.js');
  const fixtures = read('tutorial/generated/tutorialFixtures.generated.json');
  const guide = read('guide/guidesJa.js');
  const terms = read('guide/termsJa.js');
  const iap = read('lib/iap/iapRuntimeCatalog.js');
  const tutorialOverlay = read('screens/analysis/useAnalysisTutorialOverlay.js');
  const mainTabs = read('navigation/MainTabs.js');
  const todayQuestionHistory = read('screens/TodayQuestionHistoryScreen.js');
  const crossLink = read('screens/AnalysisCrossLinkSection.js');
  const access = read('components/selfStructure/watashiMapAccessPolicy.js');
  const renderer = read('components/selfStructure/WatashiMapRenderer.js');
  const formatters = read('components/selfStructure/watashiMapFormatters.js');

  assertIncludes(scenario, [
    'const FIXTURE_SELF_STRUCTURE',
    'parseMaybeJsonObject',
    'export const TUTORIAL_WATASHI_MAP',
    'FALLBACK_WATASHI_MAP',
    '4つの形で受け取れます',
    '自分の動き方を見る',
    'これは性格タイプではなく、この場面で見えた動き方です。',
  ], 'tutorialScenarioData.js exposes watashi map tutorial payload and 4-connection copy');

  assertIncludes(fixtures, [
    'GET /self-structure/latest',
    'watashi_map_service.build_watashi_map',
    '"watashi_map"',
    '"watashiMap"',
    '"version": "watashi.map.v1"',
    '"report_mode": "light"',
    '"role_switches"',
    '"routes"',
    '"crossroads"',
    '"unknown_areas"',
    '"detail_report"',
    '"watashi_map.light_payload"',
    '"watashi_map.non_type_copy"',
    'これは性格タイプではなく、この場面で見えた動き方です。',
  ], 'tutorialFixtures.generated.json contains watashiMap light fixture and safety checks');

  assertIncludes(tutorialFlow + nexus, [
    '感情入力からつながる4つの体験',
    '主要な4つの要素',
  ], 'Tutorial flow and Nexus handoff explain four tutorial experiences');

  assertIncludes(todayQuestionHistory + mainTabs + crossLink, [
    '今のわたしマップが更新されました',
    '回答を更新しました。わたしマップに反映されます。',
    '過去の回答を編集すると、わたしマップに反映されます。',
    '【わたしマップの深掘り候補】',
    'ピースを開いて「わたしマップ」または「ピースライブラリ」',
    'わたしマップやピースで触れると良さそうな論点',
  ], 'Late copy surfaces use watashi map naming');

  assertIncludes(guide + terms + iap + tutorialOverlay + access + formatters + renderer, [
    'わたしマップは性格タイプを決めるものではなく、入力から見えた場面ごとの役割と行動パターンを整理する場所です。',
    'reading: "わたしマップ"',
    'これは性格タイプではなく、入力から見えた場面ごとの動き方です。',
    'わたしマップで役割スイッチ',
    '履歴の閲覧範囲：Freeは最新概要のみ',
    '長期の変化と深い分かれ道はPremiumプランで見られます。',
    'report_mode_label',
    'buildPalette(colors, isDark)',
    'lockCard',
  ], 'Copy, plan lock text, formatter payload, and visual hooks stay aligned');

  assertNotIncludes(todayQuestionHistory + mainTabs + crossLink, [
    '自己構造分析レポートが更新されました',
    '自己構造分析に反映されます',
    '【自己構造トピック候補】',
    '自己構造トピック候補（ピースで深掘り）',
    '自己構造レポート」または「ピースライブラリ」',
  ], 'Old visible self-structure copy is not left in late surfaces');

  assertNotIncludes(guide + terms + scenario + fixtures + tutorialFlow, [
    'あなたは〇〇タイプです',
    '本当のあなたは〇〇です',
    'あなたの性格は〇〇です',
    '改善しましょう',
    '悪い役割',
    '良い役割',
    'いつもこうなります',
  ], 'Guide, terms, tutorial, and fixtures avoid diagnostic/type/fix wording');
});

test('Observation Reply Step 0/1 RN keeps low-information reply kind meta behind passed plus commentText contract', () => {
  const model = read('screens/input/inputFeedbackModel.js');
  assertIncludes(model, [
    'export function isPassedEmlisObservationReply',
    'export function buildPassedEmlisObservationModalPayload',
    'input?.input_feedback?.emlis_ai?.observation_status',
    'input?.input_feedback?.comment_text',
  ], 'inputFeedbackModel.js must keep public passed plus comment_text display contract');

  const {
    getEmlisObservationStatus,
    getEmlisObservationCommentText,
    isPassedEmlisObservationReply,
    buildPassedEmlisObservationModalPayload,
  } = loadInputFeedbackModelForContractTest();

  const lowInformationPassedPayload = {
    input_feedback: {
      comment_text: '今は、言葉になる前の重さだけが先に出ているように見えます。詳しく残せそうなら、何があったか残してみませんか。',
      emlis_ai: {
        observation_status: 'passed',
        meta: {
          observation_reply_kind: 'low_information_observation',
          eligibility_status: 'low_information',
          eligible_for_full_observation: false,
          question_required: true,
          public_observation_status_added: false,
        },
      },
    },
  };

  assert.equal(getEmlisObservationStatus(lowInformationPassedPayload), 'passed');
  assert.equal(
    getEmlisObservationCommentText(lowInformationPassedPayload),
    '今は、言葉になる前の重さだけが先に出ているように見えます。詳しく残せそうなら、何があったか残してみませんか。'
  );
  assert.equal(isPassedEmlisObservationReply(lowInformationPassedPayload), true);
  assert.deepEqual(buildPassedEmlisObservationModalPayload(lowInformationPassedPayload), {
    commentText: '今は、言葉になる前の重さだけが先に出ているように見えます。詳しく残せそうなら、何があったか残してみませんか。',
    observationStatus: 'passed',
    emotionSummary: '',
    dominantSummary: '',
    contextLabel: '',
  });

  const lowInformationMetaOnlyPayload = {
    input_feedback: {
      comment_text: '',
      emlis_ai: {
        observation_status: '',
        meta: {
          observation_reply_kind: 'low_information_observation',
          eligibility_status: 'low_information',
          public_display_status_for_observation: 'passed',
          question_required: true,
        },
      },
    },
  };
  assert.equal(getEmlisObservationStatus(lowInformationMetaOnlyPayload), '');
  assert.equal(isPassedEmlisObservationReply(lowInformationMetaOnlyPayload), false);
  assert.equal(buildPassedEmlisObservationModalPayload(lowInformationMetaOnlyPayload), null);

  const lowInformationRejectedPayload = {
    input_feedback: {
      comment_text: 'metaがlow_informationでも public status が rejected なら表示してはいけない本文です。',
      emlis_ai: {
        observation_status: 'rejected',
        meta: {
          observation_reply_kind: 'low_information_observation',
          eligibility_status: 'low_information',
          public_display_status_for_observation: 'passed',
          question_required: true,
        },
      },
    },
  };
  assert.equal(getEmlisObservationStatus(lowInformationRejectedPayload), 'rejected');
  assert.equal(isPassedEmlisObservationReply(lowInformationRejectedPayload), false);
  assert.equal(buildPassedEmlisObservationModalPayload(lowInformationRejectedPayload), null);
});


test('Observation Reply Step 11 RN displays low-information observation with optional meta but does not depend on meta', () => {
  const model = read('screens/input/inputFeedbackModel.js');
  const inputFeedbackModal = read('screens/input/useInputFeedbackModal.js');
  const inputFeedbackReplyModal = read('screens/input/InputFeedbackReplyModal.js');
  const diagnostics = read('screens/input/inputFeedbackObservationDiagnostics.js');

  assertIncludes(model, [
    'export function normalizeEmlisObservationReplyKind',
    'export function getEmlisObservationReplyKind',
    'input?.input_feedback?.emlis_ai?.observation_status',
    'input?.input_feedback?.comment_text',
    'if (observationStatus !== EMLIS_OBSERVATION_STATUS.PASSED || !commentText)',
    'return null;',
  ], 'inputFeedbackModel.js Step 11 optional meta helpers and passed plus commentText display contract');

  assertNotIncludes(model, [
    'LOW_INFORMATION: "low_information_observation",\n  PASSED:',
    'low_information_observation: "passed"',
  ], 'inputFeedbackModel.js Step 11 must not add low_information_observation as a public status enum');

  assertIncludes(inputFeedbackModal, [
    'const payload = buildPassedEmlisObservationModalPayload(input);',
    'setInputFeedbackModalVisible(false)',
    'setInputFeedbackModalText("")',
    'return false;',
    'return true;',
  ], 'useInputFeedbackModal.js Step 11 keeps modal opening dependent on passed plus commentText');

  assertIncludes(inputFeedbackReplyModal, [
    'Emlisの観測',
    'isPassedEmlisObservationReply({',
    'commentText: text,',
    'observationStatus: meta?.observationStatus || meta?.observation_status',
  ], 'InputFeedbackReplyModal.js Step 11 keeps existing title and passed-only guard');

  assertIncludes(diagnostics, [
    'record.observation_reply_kind = observationReplyKind',
    'comment_text_included: false',
    'raw_input_included: false',
  ], 'inputFeedbackObservationDiagnostics.js Step 11 may log reply kind without raw text');

  const {
    normalizeEmlisObservationReplyKind,
    getEmlisObservationReplyKind,
    getEmlisObservationStatus,
    getEmlisObservationCommentText,
    isPassedEmlisObservationReply,
    buildPassedEmlisObservationModalPayload,
  } = loadInputFeedbackModelForContractTest();

  const lowInformationStep10Payload = {
    input_feedback: {
      comment_text: '今は、言葉になる前の重さだけが先に出ているように見えます。詳しく残せそうなら、何があったか残してみませんか。',
      emlis_ai: {
        observation_status: 'passed',
        observation_reply_meta: {
          observation_reply_kind: 'low_information_observation',
          eligibility_status: 'low_information',
          eligible_for_full_observation: false,
          question_required: true,
        },
        step10_observation_display_repair_integration: {
          observation_reply_kind: 'low_information_observation',
          public_status_extended: false,
          rn_visible_contract_changed: false,
        },
      },
    },
  };

  assert.equal(normalizeEmlisObservationReplyKind('low_information_observation'), 'low_information_observation');
  assert.equal(normalizeEmlisObservationReplyKind('passed'), '');
  assert.equal(getEmlisObservationReplyKind(lowInformationStep10Payload), 'low_information_observation');
  assert.equal(getEmlisObservationStatus(lowInformationStep10Payload), 'passed');
  assert.equal(
    getEmlisObservationCommentText(lowInformationStep10Payload),
    '今は、言葉になる前の重さだけが先に出ているように見えます。詳しく残せそうなら、何があったか残してみませんか。'
  );
  assert.equal(isPassedEmlisObservationReply(lowInformationStep10Payload), true);
  assert.deepEqual(buildPassedEmlisObservationModalPayload(lowInformationStep10Payload), {
    commentText: '今は、言葉になる前の重さだけが先に出ているように見えます。詳しく残せそうなら、何があったか残してみませんか。',
    observationStatus: 'passed',
    emotionSummary: '',
    dominantSummary: '',
    contextLabel: '',
  });

  const optionalMetaOnlyPayload = {
    input_feedback: {
      comment_text: '',
      emlis_ai: {
        observation_status: '',
        observation_reply_meta: {
          observation_reply_kind: 'low_information_observation',
          eligibility_status: 'low_information',
          question_required: true,
        },
        step10_observation_display_repair_integration: {
          public_observation_status: 'passed',
          observation_reply_kind: 'low_information_observation',
        },
      },
    },
  };

  assert.equal(getEmlisObservationReplyKind(optionalMetaOnlyPayload), 'low_information_observation');
  assert.equal(getEmlisObservationStatus(optionalMetaOnlyPayload), '');
  assert.equal(isPassedEmlisObservationReply(optionalMetaOnlyPayload), false);
  assert.equal(buildPassedEmlisObservationModalPayload(optionalMetaOnlyPayload), null);

  const rejectedWithOptionalMetaPayload = {
    commentText: '表示してはいけない本文です。',
    observationStatus: 'rejected',
    emlisAiMeta: {
      observation_reply_meta: {
        observation_reply_kind: 'low_information_observation',
      },
    },
  };
  assert.equal(getEmlisObservationReplyKind(rejectedWithOptionalMetaPayload), 'low_information_observation');
  assert.equal(isPassedEmlisObservationReply(rejectedWithOptionalMetaPayload), false);
  assert.equal(buildPassedEmlisObservationModalPayload(rejectedWithOptionalMetaPayload), null);
});

test('Observation Reply Step 11 frontend diagnostic carries optional reply kind without carrying text', () => {
  const {
    buildEmlisObservationFrontendDiagnostic,
    dumpEmlisObservationFrontendDiagnostic,
  } = loadInputFeedbackObservationDiagnosticsForContractTest();

  const record = buildEmlisObservationFrontendDiagnostic({
    submitResult: {
      id: 'emotion-log-step11',
      input_feedback: {
        emlis_ai: {
          observation_status: 'passed',
          trace_id: 'trace-step11-rn',
          observation_reply_meta: {
            observation_reply_kind: 'low_information_observation',
            eligibility_status: 'low_information',
          },
        },
      },
    },
    inputFeedbackText: '今は、言葉になる前の重さだけが先に出ているように見えます。詳しく残せそうなら、何があったか残してみませんか。',
    openedObservation: true,
  });

  assert.deepEqual(record, {
    version: 'emlis.frontend_observation_diagnostic.v1',
    source: 'rn_input_screen',
    emotion_log_id: 'emotion-log-step11',
    trace_id: 'trace-step11-rn',
    observation_status: 'passed',
    observation_reply_kind: 'low_information_observation',
    comment_text_length: 54,
    comment_text_present: true,
    modal_opened: true,
    raw_input_included: false,
    comment_text_included: false,
  });

  const serialized = dumpEmlisObservationFrontendDiagnostic(record);
  assertIncludes(serialized, ['"observation_reply_kind":"low_information_observation"'], 'Step 11 diagnostic serialized reply kind');
  assertNotIncludes(serialized, [
    '今は、言葉にする前の重さ',
    '何がありましたか',
    'comment_text":"',
  ], 'Step 11 diagnostic must not serialize the public comment text');
});
test('Phase18-10 RN contract keeps Phase18 product-quality meta behind passed commentText only', () => {
  const input = read('screens/InputScreen.js');
  const inputFeedback = read('screens/input/inputFeedbackModel.js');
  const inputFeedbackModal = read('screens/input/useInputFeedbackModal.js');
  const inputFeedbackReplyModal = read('screens/input/InputFeedbackReplyModal.js');
  const diagnostics = read('screens/input/inputFeedbackObservationDiagnostics.js');
  const emotionSubmitApi = read('lib/api/home/emotionSubmitApi.js');
  const rnDisplaySources = input + inputFeedback + inputFeedbackModal + inputFeedbackReplyModal + emotionSubmitApi;

  assertIncludes(inputFeedback, [
    'export function getEmlisObservationStatus(input = {})',
    'input?.input_feedback?.emlis_ai?.observation_status',
    'export function getEmlisObservationCommentText(input = {})',
    'input?.input_feedback?.comment_text',
    'export function buildPassedEmlisObservationModalPayload(input = {})',
    'if (observationStatus !== EMLIS_OBSERVATION_STATUS.PASSED || !commentText)',
    'return null;',
  ], 'inputFeedbackModel.js Phase18-10 keeps public passed plus commentText as the only modal source');

  assertIncludes(inputFeedbackModal, [
    'const payload = buildPassedEmlisObservationModalPayload(input);',
    'setInputFeedbackModalText(payload.commentText);',
    'setInputFeedbackModalVisible(true);',
    'setInputFeedbackModalVisible(false);',
    'setInputFeedbackModalText("");',
    'return false;',
    'return true;',
  ], 'useInputFeedbackModal.js Phase18-10 keeps modal opening dependent on passed-only payload');

  assertIncludes(inputFeedbackReplyModal, [
    'Emlisの観測',
    'isPassedEmlisObservationReply({',
    'commentText: text,',
    'observationStatus: meta?.observationStatus || meta?.observation_status',
    '<Text style={styles.inputFeedbackBodyText}>{text}</Text>',
  ], 'InputFeedbackReplyModal.js Phase18-10 keeps title and verbatim body rendering');

  assertIncludes(input, [
    'commentText: inputFeedbackText',
    'emlisAiMeta: inputFeedbackAI,',
    'observationStatus: inputFeedbackAI?.observation_status',
    'const openedObservation = inputFeedbackText',
    'if (!openedObservation)',
    'completeTutorialAfterReply();',
    'logEmlisObservationFrontendDiagnostic({',
  ], 'InputScreen.js Phase18-10 keeps /emotion/submit RN display path backend-owned');

  assertIncludes(emotionSubmitApi, [
    'apiPost("/emotion/submit", payload || {}, {',
    'timeoutMs: EMOTION_SUBMIT_TIMEOUT_MS,',
  ], 'emotionSubmitApi.js Phase18-10 keeps existing /emotion/submit route and timeout wrapper');

  assertNotIncludes(rnDisplaySources, [
    'input?.input_feedback?.observation_text',
    'input?.input_feedback?.reception_text',
    'inputFeedback?.observation_text',
    'inputFeedback?.reception_text',
    'observationText',
    'receptionText',
    'twoStageDisplay',
    'sectionLabels',
    'split("見えたこと',
    "split('見えたこと",
    'split("Emlisから',
    "split('Emlisから",
    'product_quality_regression_matrix',
    'two_stage_applicability_decision',
    'low_information_public_repair_contract',
    'phase18_low_information_public_repair_contract',
    'two_stage_mode_context',
    'meta_only_sanitizer',
    'diagnostic_failure_taxonomy',
    'visible_readability_quality',
    'public_feedback_boundary_check',
    'candidate_status_before_display_gate',
    'candidate_generated_before_display_gate',
    'complete_initial_candidate_generation_path',
    'observationStatus: inputFeedbackAI?.observation_status || "passed"',
    'observationStatus: TUTORIAL_EMLIS_REPLY.meta?.observation_status || "passed"',
  ], 'RN Phase18-10 display code must not parse two-stage labels, read split keys, branch on Phase18 backend internals, or force passed');

  assertNotIncludes(diagnostics, [
    'diagnostic_failure_taxonomy',
    'visible_readability_quality',
    'public_feedback_boundary_check',
    'candidate_status_before_display_gate',
    'candidate_generated_before_display_gate',
    'generated_candidate_text',
    'candidate_comment_text',
  ], 'Phase18-10 frontend diagnostic must stay small and not copy backend product-quality internals');

  const {
    getEmlisObservationReplyKind,
    getEmlisObservationStatus,
    getEmlisObservationCommentText,
    isPassedEmlisObservationReply,
    buildPassedEmlisObservationModalPayload,
  } = loadInputFeedbackModelForContractTest();

  const lowInformationCommentText = '疲れの重さが先に出ているように見えます。詳しく残せそうなら、何があったか残してみませんか。';
  const lowInformationPassedPayload = {
    input_feedback: {
      comment_text: lowInformationCommentText,
      observation_text: 'Phase18-10でRNが読む分離keyではありません。',
      reception_text: 'Phase18-10でRNが読む分離keyではありません。',
      emlis_ai: {
        observation_status: 'passed',
        observation_reply_meta: {
          observation_reply_kind: 'low_information_observation',
          question_required: true,
        },
        low_information_public_repair_contract: {
          final_observation_status: 'passed',
          observation_reply_kind: 'low_information_observation',
          public_status_extended: false,
          rn_visible_contract_changed: false,
        },
        diagnostic_failure_taxonomy: {
          canonical_classification: 'low_information_public_repair_applied',
          public_safe: true,
          comment_text_body_included: false,
        },
        visible_readability_quality: {
          passed: true,
          action: 'allow',
          comment_text_body_included: false,
        },
      },
    },
  };
  assert.equal(getEmlisObservationReplyKind(lowInformationPassedPayload), 'low_information_observation');
  assert.equal(getEmlisObservationStatus(lowInformationPassedPayload), 'passed');
  assert.equal(getEmlisObservationCommentText(lowInformationPassedPayload), lowInformationCommentText);
  assert.equal(isPassedEmlisObservationReply(lowInformationPassedPayload), true);
  assert.deepEqual(buildPassedEmlisObservationModalPayload(lowInformationPassedPayload), {
    commentText: lowInformationCommentText,
    observationStatus: 'passed',
    emotionSummary: '',
    dominantSummary: '',
    contextLabel: '',
  });

  const twoStageCommentText = [
    '見えたこと：',
    '不安がある中でも、今は急いで結論にしない動きが残っているように見えます。',
    '',
    'Emlisから：',
    'その揺れは、すぐに片づけるより、少し距離を置いて見てよさそうです。',
  ].join('\n');
  const twoStagePassedPayload = {
    input_feedback: {
      comment_text: twoStageCommentText,
      observation_text: 'Phase18でもRN側で読んではいけないsplit keyです。',
      reception_text: 'Phase18でもRN側で読んではいけないsplit keyです。',
      emlis_ai: {
        observation_status: 'passed',
        observation_reply_meta: { observation_reply_kind: 'eligible_observation' },
        diagnostic_summary: {
          observation_status: 'passed',
          canonical_classification: 'candidate_generated_display_passed',
          diagnostic_failure_taxonomy: {
            schema_version: 'cocolon.emlis.diagnostic_failure_taxonomy.v1',
            comment_text_body_included: false,
          },
        },
        public_feedback_boundary_check: {
          public_response_key_added: false,
          observation_text_key_added: false,
          reception_text_key_added: false,
          rn_visible_contract_changed: false,
        },
      },
    },
    emotionSummary: '選択した感情：不安',
    dominantSummary: '中心として見ている感情：不安',
  };
  assert.equal(getEmlisObservationReplyKind(twoStagePassedPayload), 'eligible_observation');
  assert.equal(getEmlisObservationStatus(twoStagePassedPayload), 'passed');
  assert.equal(getEmlisObservationCommentText(twoStagePassedPayload), twoStageCommentText);
  assert.equal(isPassedEmlisObservationReply(twoStagePassedPayload), true);
  assert.deepEqual(buildPassedEmlisObservationModalPayload(twoStagePassedPayload), {
    commentText: twoStageCommentText,
    observationStatus: 'passed',
    emotionSummary: '選択した感情：不安',
    dominantSummary: '中心として見ている感情：不安',
    contextLabel: '',
  });

  for (const observation_status of ['rejected', 'unavailable', 'safety_blocked', '']) {
    const nonPassedPhase18Payload = {
      input_feedback: {
        comment_text: 'Phase18 meta が表示可能に見えても public status が non-passed なら表示しません。',
        emlis_ai: {
          observation_status,
          diagnostic_summary: {
            observation_status: 'passed',
            canonical_classification: 'candidate_generated_display_passed',
          },
          diagnostic_failure_taxonomy: { canonical_classification: 'candidate_generated_display_passed' },
          visible_readability_quality: { passed: true, action: 'allow' },
          public_feedback_boundary_check: { input_feedback_returned: true },
          observation_reply_meta: { observation_reply_kind: 'low_information_observation' },
        },
      },
    };
    assert.equal(getEmlisObservationStatus(nonPassedPhase18Payload), observation_status);
    assert.equal(isPassedEmlisObservationReply(nonPassedPhase18Payload), false);
    assert.equal(buildPassedEmlisObservationModalPayload(nonPassedPhase18Payload), null);
  }

  const splitKeyOnlyPhase18Payload = {
    input_feedback: {
      comment_text: '',
      observation_text: '見えたこと側だけを別keyにしてもRNは表示しません。',
      reception_text: 'Emlisから側だけを別keyにしてもRNは表示しません。',
      emlis_ai: {
        observation_status: 'passed',
        diagnostic_summary: { observation_status: 'passed' },
        visible_readability_quality: { passed: true, action: 'allow' },
      },
    },
  };
  assert.equal(getEmlisObservationStatus(splitKeyOnlyPhase18Payload), 'passed');
  assert.equal(getEmlisObservationCommentText(splitKeyOnlyPhase18Payload), '');
  assert.equal(isPassedEmlisObservationReply(splitKeyOnlyPhase18Payload), false);
  assert.equal(buildPassedEmlisObservationModalPayload(splitKeyOnlyPhase18Payload), null);

  const {
    buildEmlisObservationFrontendDiagnostic,
    dumpEmlisObservationFrontendDiagnostic,
  } = loadInputFeedbackObservationDiagnosticsForContractTest();

  const diagnosticRecord = buildEmlisObservationFrontendDiagnostic({
    submitResult: {
      id: 'emotion-log-phase18-10',
      input_feedback: {
        emlis_ai: {
          observation_status: 'rejected',
          observation_trace_id: 'emlisobs-phase18-10',
          observation_reply_meta: { observation_reply_kind: 'low_information_observation' },
          diagnostic_summary: {
            observation_status: 'passed',
            diagnostic_failure_taxonomy: { canonical: 'candidate_generated_display_passed' },
            visible_readability_quality: { passed: true, action: 'allow' },
          },
        },
      },
    },
    inputFeedbackText: 'RN診断では本文そのものを出しません。',
    openedObservation: false,
  });
  assert.deepEqual(diagnosticRecord, {
    version: 'emlis.frontend_observation_diagnostic.v1',
    source: 'rn_input_screen',
    emotion_log_id: 'emotion-log-phase18-10',
    trace_id: 'emlisobs-phase18-10',
    observation_status: 'rejected',
    observation_reply_kind: 'low_information_observation',
    comment_text_length: 'RN診断では本文そのものを出しません。'.length,
    comment_text_present: true,
    modal_opened: false,
    raw_input_included: false,
    comment_text_included: false,
  });
  const serializedDiagnostic = dumpEmlisObservationFrontendDiagnostic(diagnosticRecord);
  assertNotIncludes(serializedDiagnostic, [
    'RN診断では本文そのものを出しません。',
    'diagnostic_failure_taxonomy',
    'visible_readability_quality',
    'public_feedback_boundary_check',
    'candidate_status_before_display_gate',
    'comment_text":"',
  ], 'Phase18-10 frontend diagnostic serialization stays text-free and product-meta-free');
});

