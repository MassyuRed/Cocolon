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
