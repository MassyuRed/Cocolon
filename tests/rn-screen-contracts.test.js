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
    'openInputFeedbackModal',
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
    'inputFeedbackBackdrop',
    'Emlis（エムリス）からの返答',
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
    'readCachedAnalysisLatestReport',
    'writeCachedAnalysisLatestReport',
    'ANALYSIS_WIRE.routes.reportsReady',
    'getTodayQuestionHistory',
  ], 'useAnalysisReportActions.js');

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
    'subscriptionTier',
    'showDeepTransitionChart',
    'showDeepRecoveryChart',
    'showDeepMemoThemes',
    'AnalysisReportUpgradeCard',
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
    'Emlis（エムリス）からの応答',
    '分析レポート',
    'ピース',
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

