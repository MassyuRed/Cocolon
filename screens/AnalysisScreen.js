import React, {
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  useWindowDimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

// 既存
import AnalysisHistoryScreen from "./AnalysisHistoryScreen";
import AnalysisReportHistoryScreen from "./AnalysisReportHistoryScreen";
import AnalysisReportViewerScreen from "./AnalysisReportViewerScreen";
import SelfStructureReportHistoryScreen from "./SelfStructureReportHistoryScreen";
import SelfStructureReportViewerScreen from "./SelfStructureReportViewerScreen";
import SelfStructureReportGenerateScreen from "./SelfStructureReportGenerateScreen";
import TodayQuestionHistoryScreen from "./TodayQuestionHistoryScreen";
import AnalysisContentFirstScreen from "./AnalysisContentFirstScreen";
import AnalysisEmotionScreen from "./AnalysisEmotionScreen";
import AnalysisSelfStructureScreen from "./AnalysisSelfStructureScreen";
import AnalysisInputHistoryMenuScreen from "./AnalysisInputHistoryMenuScreen";

// 🎨 テーマコンテキスト
import { useTheme } from "../theme/ThemeContext";

import { useSubscription } from "../SubscriptionContext";
import { useTutorial } from "../TutorialContext";

// UI (Design System)
import CocolonPressable from "../components/CocolonPressable";
import CocolonButton from "../components/CocolonButton";
import UnreadBadge from "../components/UnreadBadge";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TutorialOverlay from "../components/TutorialOverlay";
import {
  TUTORIAL_ANALYSIS_COUNTS,
  TUTORIAL_ANALYSIS_REPORTS,
  TUTORIAL_SELF_ANALYSIS_GUIDE,
  TUTORIAL_TOTAL_STEPS,
} from "../tutorial/tutorialScenarioData";
import {
  formatLatestUpdateLabel,
  isAnalysisMenuRoute,
  isAnalysisReportType,
  normalizeSelfStructureMode,
  PANEL_MIN_HEIGHT,
  REPORT_TYPE_LABEL,
  ROUTE_EMOTION_ANALYSIS,
  ROUTE_HOME,
  ROUTE_INPUT_HISTORY,
  ROUTE_SELF_STRUCTURE,
} from "./analysis/analysisRouteModel";
import { useAnalysisRouteState } from "./analysis/useAnalysisRouteState";
import { useAnalysisUnreadBadges } from "./analysis/useAnalysisUnreadBadges";
import { useAnalysisReportActions } from "./analysis/useAnalysisReportActions";
import { useAnalysisSelfStructureActions } from "./analysis/useAnalysisSelfStructureActions";
import { useAnalysisTutorialOverlay } from "./analysis/useAnalysisTutorialOverlay";

function useThemedStyles() {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";
  return { styles, colors, themeName, isDark, ui };
}

export default function AnalysisScreen({ onOpenPieceDeepDive, navigation, onRefreshTabUnread, route: screenRoute, tabRoute }) {
  const { ensurePaid, isPaid, loading: subscriptionLoading } = useSubscription();
  const { isTutorialMode, tutorialStep, setTutorialStep } = useTutorial();
  const screenRootRef = useRef(null);
  const { height: windowHeight } = useWindowDimensions();
  const safeInsets = useSafeAreaInsets();
  const { styles, colors, isDark } = useThemedStyles();

  const {
    route,
    setRoute,
    reportType,
    setReportType,
    selectedReport,
    setSelectedReport,
    selectedSelfReport,
    setSelectedSelfReport,
    reportHistoryBackRoute,
    setReportHistoryBackRoute,
    reportViewBackRoute,
    setReportViewBackRoute,
    historyBackRoute,
    setHistoryBackRoute,
    todayQuestionHistoryBackRoute,
    setTodayQuestionHistoryBackRoute,
    selfReportGenerateBackRoute,
    setSelfReportGenerateBackRoute,
    selfReportHistoryBackRoute,
    setSelfReportHistoryBackRoute,
    selfReportGenerateMode,
    setSelfReportGenerateMode,
    clearExternalOpenParams,
  } = useAnalysisRouteState({ navigation });

  const {
    entryMeta,
    homeSummariesLoading,
    fetchLatestReadyReport,
    refreshHomeSummaries,
  } = useAnalysisReportActions();

  const {
    unreadByType,
    unreadResolved,
    selfStructureUnreadResolved,
    selfStructureLatestUnread,
    selfStructureHistoryUnread,
    prefetchedUnreadByType,
    emotionAnalysisUnread,
    selfStructureUnread,
    refreshUnreadBadges,
    markSelfStructureLatestSeen,
    markReportRead,
  } = useAnalysisUnreadBadges({
    isPaid,
    subscriptionLoading,
    onRefreshTabUnread,
  });

  const {
    openSelfStructureRoute,
    openSelfReportLatest,
    openSelfReportHistory,
    openSelfReportView,
  } = useAnalysisSelfStructureActions({
    ensurePaid,
    navigation,
    setRoute,
    setSelectedSelfReport,
    setSelfReportGenerateMode,
    setSelfReportGenerateBackRoute,
    setSelfReportHistoryBackRoute,
  });

  const resetAnalysisTutorialRoute = useCallback(() => {
    setSelectedReport(null);
    setSelectedSelfReport(null);
    setRoute(ROUTE_HOME);
  }, [setRoute, setSelectedReport, setSelectedSelfReport]);

  const {
    isAnalysisTutorialStep,
    tutorialScrollRef,
    handleTutorialScroll,
    tutorialRefs,
    tutorialOverlayConfig,
    tutorialTargetRect,
    setTutorialOverlayMetrics,
  } = useAnalysisTutorialOverlay({
    route,
    navigation,
    screenRootRef,
    windowHeight,
    safeInsets,
    isTutorialMode,
    tutorialStep,
    setTutorialStep,
    entryMeta,
    onResetToHome: resetAnalysisTutorialRoute,
  });

  useEffect(() => {
    const shouldOpen = !!(tabRoute?.params?.openTodayQuestionHistory || screenRoute?.params?.openTodayQuestionHistory);
    if (!shouldOpen) return;
    setTodayQuestionHistoryBackRoute(ROUTE_INPUT_HISTORY);
    setRoute("todayQuestionHistory");
    clearExternalOpenParams({
      openTodayQuestionHistory: false,
      openTodayQuestionHistoryAt: null,
    });
  }, [
    clearExternalOpenParams,
    screenRoute?.params?.openTodayQuestionHistory,
    screenRoute?.params?.openTodayQuestionHistoryAt,
    setRoute,
    setTodayQuestionHistoryBackRoute,
    tabRoute?.params?.openTodayQuestionHistory,
    tabRoute?.params?.openTodayQuestionHistoryAt,
  ]);

  // ------------------------------------------------------------
  // Tab reselect → Analysis "home" に戻す
  // - Analysis は画面内で route state を持っているため、
  //   同じタブを再タップしたときにメイン（home）へ戻す。
  // ------------------------------------------------------------
  const routeRef = useRef(route);
  useEffect(() => {
    routeRef.current = route;
  }, [route]);

  useEffect(() => {
    if (!navigation?.addListener) return;

    const unsubscribe = navigation.addListener("tabPress", (e) => {
      // タブ切替（他タブ→Analysis）ではなく「Analysisを表示中の再タップ」だけに反応する
      const focused =
        typeof navigation?.isFocused === "function" ? navigation.isFocused() : false;
      if (!focused) return;

      if (routeRef.current && routeRef.current !== "home") {
        try {
          e?.preventDefault?.();
        } catch {
          // noop
        }
        // 選択状態もクリアしておく（homeへ戻ったときの混入を防ぐ）
        setSelectedReport(null);
        setSelectedSelfReport(null);
        setRoute("home");
      }
    });

    return unsubscribe;
  }, [navigation]);

  const openReportHistory = (type, backRoute = ROUTE_EMOTION_ANALYSIS) => {
    setReportHistoryBackRoute(backRoute);
    setReportType(type);
    setSelectedReport(null);
    setRoute("reportHistory");
  };

  useEffect(() => {
    const shouldOpenReportHistory = !!(
      tabRoute?.params?.openReportHistory || screenRoute?.params?.openReportHistory
    );
    const nextReportType = String(
      tabRoute?.params?.openReportHistoryType || screenRoute?.params?.openReportHistoryType || ""
    ).trim().toLowerCase();

    if (shouldOpenReportHistory && isAnalysisReportType(nextReportType)) {
      setSelectedReport(null);
      setReportHistoryBackRoute(ROUTE_EMOTION_ANALYSIS);
      setReportType(nextReportType);
      setRoute("reportHistory");
      clearExternalOpenParams({
        openReportHistory: false,
        openReportHistoryType: null,
        openReportHistoryAt: null,
      });
      return;
    }

    const shouldOpenSelfReportLatest = !!(
      tabRoute?.params?.openSelfReportLatest || screenRoute?.params?.openSelfReportLatest
    );
    if (shouldOpenSelfReportLatest) {
      const nextMode = normalizeSelfStructureMode(
        tabRoute?.params?.openSelfReportLatestMode || screenRoute?.params?.openSelfReportLatestMode
      );
      setSelfReportGenerateMode(nextMode);
      openSelfStructureRoute({
        targetRoute: "selfReportGenerate",
        backRoute: ROUTE_SELF_STRUCTURE,
      });
      clearExternalOpenParams({
        openSelfReportLatest: false,
        openSelfReportLatestMode: null,
        openSelfReportLatestAt: null,
      });
      return;
    }

    const shouldOpenSelfReportHistory = !!(
      tabRoute?.params?.openSelfReportHistory || screenRoute?.params?.openSelfReportHistory
    );
    if (shouldOpenSelfReportHistory) {
      openSelfReportHistory(ROUTE_SELF_STRUCTURE);
      clearExternalOpenParams({
        openSelfReportHistory: false,
        openSelfReportHistoryAt: null,
      });
      return;
    }

    const shouldOpenDistributionHome = !!(
      tabRoute?.params?.openDistributionHome || screenRoute?.params?.openDistributionHome
    );
    if (shouldOpenDistributionHome) {
      setRoute(ROUTE_HOME);
      clearExternalOpenParams({
        openDistributionHome: false,
        openDistributionHomeAt: null,
      });
    }
  }, [
    clearExternalOpenParams,
    openSelfReportHistory,
    openSelfStructureRoute,
    screenRoute?.params?.openDistributionHome,
    screenRoute?.params?.openDistributionHomeAt,
    screenRoute?.params?.openReportHistory,
    screenRoute?.params?.openReportHistoryAt,
    screenRoute?.params?.openReportHistoryType,
    screenRoute?.params?.openSelfReportLatest,
    screenRoute?.params?.openSelfReportLatestAt,
    screenRoute?.params?.openSelfReportLatestMode,
    screenRoute?.params?.openSelfReportHistory,
    screenRoute?.params?.openSelfReportHistoryAt,
    tabRoute?.params?.openDistributionHome,
    tabRoute?.params?.openDistributionHomeAt,
    tabRoute?.params?.openReportHistory,
    tabRoute?.params?.openReportHistoryAt,
    tabRoute?.params?.openReportHistoryType,
    tabRoute?.params?.openSelfReportLatest,
    tabRoute?.params?.openSelfReportLatestAt,
    tabRoute?.params?.openSelfReportLatestMode,
    tabRoute?.params?.openSelfReportHistory,
    tabRoute?.params?.openSelfReportHistoryAt,
  ]);

  const openReportView = useCallback(
    async (report, backRoute = "reportHistory") => {
      setSelectedReport(report || null);
      setReportViewBackRoute(backRoute);
      setRoute("reportView");
      try {
        await markReportRead(report);
      } finally {
        refreshUnreadBadges();
      }
    },
    [markReportRead, refreshUnreadBadges]
  );

  const openLatestEmotionReport = useCallback(
    async (type) => {
      const normalizedType = String(type || "").trim().toLowerCase();
      const label = REPORT_TYPE_LABEL[normalizedType] || "レポート";

      try {
        const cachedReport = entryMeta?.latestReports?.[normalizedType] || null;
        const latestReport = cachedReport || (await fetchLatestReadyReport(normalizedType));

        if (!latestReport) {
          Alert.alert("最新レポート", `最新の${label}はまだありません。`);
          return;
        }

        await openReportView(latestReport, ROUTE_EMOTION_ANALYSIS);
      } catch (e) {
        console.warn("AnalysisScreen: failed to open latest emotion report", normalizedType, e);
        Alert.alert("取得エラー", `${label}の取得に失敗しました。`);
      }
    },
    [entryMeta?.latestReports, fetchLatestReadyReport, openReportView]
  );

  // ✅ Paywall CTA: SubscriptionSelect へ遷移（ナビが無い場合も落とさない）
  const openSubscriptionSelect = useCallback(() => {
    try {
      if (navigation?.navigate) {
        navigation.navigate("SubscriptionSelect");
        return;
      }
    } catch {
      // no-op
    }
    Alert.alert("プラン確認", "加入画面を開けませんでした。もう一度お試しください。");
  }, [navigation]);

  // Piece タブへ移動（ナビが無い場合も落とさない）
  const openPieceSurface = useCallback(() => {
    try {
      if (navigation?.navigate) {
        navigation.navigate("Piece");
        return;
      }
    } catch {
      // no-op
    }

    try {
      const parent =
        typeof navigation?.getParent === "function" ? navigation.getParent() : null;
      if (parent && typeof parent.navigate === "function") {
        parent.navigate("Piece");
        return;
      }
    } catch {
      // no-op
    }

    Alert.alert("移動できませんでした", "ピースを開けませんでした。もう一度お試しください。");
  }, [navigation]);

  // Cocolonガイド（Analysis）
  const openGuide = useCallback(() => {
    try {
      if (navigation?.navigate) {
        navigation.navigate("CocolonGuide", { screenId: "analysis" });
        return;
      }
    } catch {
      // no-op
    }

    // Fallback: parent navigation（念のため）
    try {
      const parent =
        typeof navigation?.getParent === "function" ? navigation.getParent() : null;
      if (parent && typeof parent.navigate === "function") {
        parent.navigate("CocolonGuide", { screenId: "analysis" });
      }
    } catch {
      // no-op
    }
  }, [navigation]);

  // Analysis 内の入口画面に戻ったタイミングでも更新
  useEffect(() => {
    const shouldRefreshMenuState = isAnalysisMenuRoute(route);

    if (!shouldRefreshMenuState) return undefined;

    let cancelled = false;
    (async () => {
      try {
        await refreshHomeSummaries({ prioritizeVisibleReport: route === ROUTE_HOME });
        if (!cancelled) {
          await refreshUnreadBadges();
        }
      } catch (e) {
        console.warn("AnalysisScreen: failed to refresh menu state", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [route, refreshUnreadBadges, refreshHomeSummaries]);

  const emotionUpdateLabel = formatLatestUpdateLabel(entryMeta.emotionLatestDate);
  const selfStructureUpdateLabel = formatLatestUpdateLabel(entryMeta.selfStructureLatestDate);

  return (
    <View ref={screenRootRef} collapsable={false} style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />
      {route === "history" ? (
        <AnalysisHistoryScreen
          onBack={() => {
            setRoute(historyBackRoute);
            refreshHomeSummaries();
          }}
        />
      ) : route === "reportHistory" ? (
        <AnalysisReportHistoryScreen
          reportType={reportType}
          onBack={() => {
            setRoute(reportHistoryBackRoute);
            refreshUnreadBadges();
            refreshHomeSummaries();
          }}
          onOpenReport={(report) => openReportView(report, "reportHistory")}
          onGenerateLatest={() => openLatestEmotionReport(reportType)}
          onOpenSubscription={openSubscriptionSelect}
        />
      ) : route === "reportView" ? (
        <AnalysisReportViewerScreen
          report={selectedReport}
          onBack={() => {
            setRoute(reportViewBackRoute);
            refreshUnreadBadges();
            refreshHomeSummaries();
          }}
          onOpenPieceDeepDive={onOpenPieceDeepDive}
          onOpenSubscription={openSubscriptionSelect}
        />
      ) : route === ROUTE_EMOTION_ANALYSIS ? (
        <View style={styles.safeContent}>
          <AnalysisEmotionScreen
            onBack={() => setRoute(ROUTE_HOME)}
            onOpenLatestDaily={() => openLatestEmotionReport("daily")}
            onOpenLatestWeekly={() => openLatestEmotionReport("weekly")}
            onOpenLatestMonthly={() => openLatestEmotionReport("monthly")}
            onOpenDailyHistory={() => openReportHistory("daily", ROUTE_EMOTION_ANALYSIS)}
            onOpenWeeklyHistory={() => openReportHistory("weekly", ROUTE_EMOTION_ANALYSIS)}
            onOpenMonthlyHistory={() => openReportHistory("monthly", ROUTE_EMOTION_ANALYSIS)}
            unreadDaily={unreadResolved ? unreadByType.daily : prefetchedUnreadByType.daily}
            unreadWeekly={unreadResolved ? unreadByType.weekly : prefetchedUnreadByType.weekly}
            unreadMonthly={unreadResolved ? unreadByType.monthly : prefetchedUnreadByType.monthly}
          />
        </View>
      ) : route === ROUTE_SELF_STRUCTURE ? (
        <View style={styles.safeContent}>
          <AnalysisSelfStructureScreen
            onBack={() => setRoute(ROUTE_HOME)}
            onOpenLatestReport={() => openSelfReportLatest("standard", ROUTE_SELF_STRUCTURE)}
            onOpenHistory={() => openSelfReportHistory(ROUTE_SELF_STRUCTURE)}
            unreadLatest={
              selfStructureUnreadResolved && !subscriptionLoading && isPaid
                ? selfStructureLatestUnread
                : false
            }
            unreadHistory={
              selfStructureUnreadResolved && !subscriptionLoading && isPaid
                ? selfStructureHistoryUnread
                : false
            }
          />
        </View>
      ) : route === ROUTE_INPUT_HISTORY ? (
        <View style={styles.safeContent}>
          <AnalysisInputHistoryMenuScreen
            onBack={() => setRoute(ROUTE_HOME)}
            onOpenEmotionHistory={() => {
              setHistoryBackRoute(ROUTE_INPUT_HISTORY);
              setRoute("history");
            }}
            onOpenTodayQuestionHistory={() => {
              setTodayQuestionHistoryBackRoute(ROUTE_INPUT_HISTORY);
              setRoute("todayQuestionHistory");
            }}
          />
        </View>
      ) : route === "selfReportHistory" ? (
        <SelfStructureReportHistoryScreen
          reportType="monthly"
          onBack={() => {
            setRoute(selfReportHistoryBackRoute || ROUTE_SELF_STRUCTURE);
            refreshUnreadBadges();
            refreshHomeSummaries();
          }}
          onOpenReport={openSelfReportView}
        />
      ) : route === "selfReportView" ? (
        <SelfStructureReportViewerScreen
          report={selectedSelfReport}
          onBack={() => {
            setRoute("selfReportHistory");
            refreshUnreadBadges();
          }}
        />
      ) : route === "selfReportGenerate" ? (
        <SelfStructureReportGenerateScreen
          key={`selfReportGenerate:${selfReportGenerateMode}`}
          initialReportMode={selfReportGenerateMode}
          onBack={() => {
            setRoute(selfReportGenerateBackRoute);
            refreshHomeSummaries();
          }}
          onLatestSeenVersion={markSelfStructureLatestSeen}
        />
      ) : route === "todayQuestionHistory" ? (
        <TodayQuestionHistoryScreen
          onBack={() => {
            setRoute(todayQuestionHistoryBackRoute);
            refreshHomeSummaries();
          }}
        />
      ) : (
        <View style={styles.safeContent}>
          <AnalysisContentFirstScreen
            tutorialScrollRef={tutorialScrollRef}
            onTutorialScroll={handleTutorialScroll}
            tutorialRefs={tutorialRefs}
            onOpenGuide={openGuide}
            emotionUpdateLabel={emotionUpdateLabel}
            selfStructureUpdateLabel={selfStructureUpdateLabel}
            todayCount={entryMeta.todayCount}
            weekCount={entryMeta.weekCount}
            monthCount={entryMeta.monthCount}
            unreadEmotion={emotionAnalysisUnread}
            unreadSelfStructure={selfStructureUnread}
            unreadDaily={unreadResolved ? unreadByType.daily : prefetchedUnreadByType.daily}
            unreadWeekly={unreadResolved ? unreadByType.weekly : prefetchedUnreadByType.weekly}
            unreadMonthly={unreadResolved ? unreadByType.monthly : prefetchedUnreadByType.monthly}
            unreadSelfStructureLatest={
              selfStructureUnreadResolved && !subscriptionLoading && isPaid
                ? selfStructureLatestUnread
                : false
            }
            unreadSelfStructureHistory={
              selfStructureUnreadResolved && !subscriptionLoading && isPaid
                ? selfStructureHistoryUnread
                : false
            }
            latestReports={entryMeta.latestReports}
            homeSummariesLoading={homeSummariesLoading}
            onOpenDailyHistory={() => openReportHistory("daily", ROUTE_HOME)}
            onOpenWeeklyHistory={() => openReportHistory("weekly", ROUTE_HOME)}
            onOpenMonthlyHistory={() => openReportHistory("monthly", ROUTE_HOME)}
            onOpenSelfHistory={() => openSelfReportHistory(ROUTE_HOME)}
            onOpenSubscription={openSubscriptionSelect}
            onRefreshEmotionUnread={refreshUnreadBadges}
            onLatestSeenVersion={markSelfStructureLatestSeen}
            isPaid={!subscriptionLoading && isPaid}
            isTutorialMode={isAnalysisTutorialStep}
            tutorialStep={tutorialStep}
            tutorialReports={TUTORIAL_ANALYSIS_REPORTS}
            tutorialCounts={TUTORIAL_ANALYSIS_COUNTS}
            tutorialSelfAnalysisGuide={TUTORIAL_SELF_ANALYSIS_GUIDE}
          />
        </View>
      )}

      {tutorialOverlayConfig ? (
        <TutorialOverlay
          visible={!!tutorialOverlayConfig}
          targetRect={tutorialOverlayConfig.disableSpotlight ? null : tutorialTargetRect}
          title={tutorialOverlayConfig.title}
          message={tutorialOverlayConfig.message}
          step={tutorialOverlayConfig.step}
          totalSteps={TUTORIAL_TOTAL_STEPS}
          mode={tutorialOverlayConfig.mode}
          nextLabel={tutorialOverlayConfig.nextLabel}
          onNext={tutorialOverlayConfig.onNext}
          onMetricsChange={setTutorialOverlayMetrics}
          showStepPill={false}
          actionHint={tutorialOverlayConfig.actionHint}
          cardPlacement={tutorialOverlayConfig.cardPlacement || "bottom"}
          dimOpacity={tutorialOverlayConfig.dimOpacity}
          blockBackgroundTouches={tutorialOverlayConfig.blockBackgroundTouches !== false}
        />
      ) : null}
    </View>
  );
}

// --- Home ---
function AnalysisHome({
  styles,
  colors,
  tutorialScrollRef,
  onTutorialScroll,
  tutorialRefs,
  onOpenGuide,
  onOpenHistory,
  onOpenDaily,
  onOpenWeekly,
  onOpenMonthly,
  onOpenSelfReportLatest,
  onOpenSelfReportHistory,
  onOpenPieceSurface,
  onOpenTodayQuestionHistory,
  unreadDaily,
  unreadWeekly,
  unreadMonthly,
  unreadSelfStructureLatest,
  unreadSelfStructureHistory,
  weeklySummary,
  monthlySummary,
}) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        ref={tutorialScrollRef}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onTutorialScroll}
      >
        {/* パネルヘッダー：Analysis */}
        <View style={styles.panelHeader}>
          <View ref={tutorialRefs?.titleRef} collapsable={false} style={styles.panelTitleRow}>
            <Text style={styles.panelTitle}>分析</Text>
            <CocolonPressable
              style={styles.guideButton}
              onPress={onOpenGuide}
              accessibilityLabel="Analysisのガイドを開く"
            >
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={colors.TEXT_ON_LIGHT}
              />
            </CocolonPressable>
          </View>
        </View>

        <View style={styles.section}>
          <View ref={tutorialRefs?.weeklyRef} collapsable={false} style={styles.dashboardSummaryCard}>
            <View style={styles.dashboardSummaryHeader}>
              <Ionicons
                name="bar-chart-outline"
                size={18}
                color={colors.TITLE_GOLD}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.dashboardSummaryTitle}>
                今週の感情構造サマリー
              </Text>
            </View>

            {weeklySummary?.loading ? (
              <View style={styles.dashboardSummaryLoadingRow}>
                <ActivityIndicator size="small" color={colors.TEXT_SUBTLE} />
                <Text style={styles.dashboardSummaryHint}>
                  サマリーを読み込み中…
                </Text>
              </View>
            ) : weeklySummary?.count > 0 ? (
              <>
                <View style={styles.dashboardSummaryRow}>
                  <Text style={styles.dashboardSummaryLabel}>入力回数</Text>
                  <Text style={styles.dashboardSummaryValue}>
                    {weeklySummary.count}回
                  </Text>
                </View>
                <View style={styles.dashboardSummaryRow}>
                  <Text style={styles.dashboardSummaryLabel}>主要感情</Text>
                  <Text style={styles.dashboardSummaryValue} numberOfLines={2}>
                    {Array.isArray(weeklySummary.top) && weeklySummary.top.length > 0
                      ? weeklySummary.top.map(([name]) => name).join(" / ")
                      : "—"}
                  </Text>
                </View>
                <Text style={styles.dashboardSummaryHint}>
                  詳細な分析は週報で確認できます。
                </Text>
              </>
            ) : (
              <Text style={styles.dashboardSummaryHint}>
                {weeklySummary?.error
                  ? "サマリーを取得できませんでした。しばらくしてからもう一度お試しください。"
                  : "今週の入力はまだありません。"}
              </Text>
            )}

            <View style={[styles.dashboardButtonWrap, { marginTop: 12 }]}>
              <CocolonButton variant="secondary" onPress={onOpenWeekly}>
                <View style={styles.btnRow}>
                  <Ionicons
                    name="bar-chart-outline"
                    size={18}
                    color={colors.TEXT_ON_LIGHT}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.goldButtonText, { color: colors.TEXT_ON_LIGHT }]}>週報を見る</Text>
                </View>
              </CocolonButton>
              <UnreadBadge
                visible={unreadWeekly}
                style={styles.buttonUnreadBadge}
              />
            </View>
          </View>
        </View>

{/* Dashboard */}
        <View style={styles.section}>
          <View ref={tutorialRefs?.dailyRef} collapsable={false} style={styles.dashboardButtonsCard}>
            <View style={styles.dashboardCardTitleRow}>
              <Text style={styles.dashboardCardTitle}>最新の日報</Text>
              <UnreadBadge
                visible={unreadDaily}
                style={styles.dashboardUnreadBadge}
              />
            </View>

            <CocolonButton variant="secondary" onPress={onOpenDaily} style={{ marginTop: 10 }}>
              <View style={styles.btnRow}>
                <Ionicons
                  name="today-outline"
                  size={18}
                  color={colors.TEXT_ON_LIGHT}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.goldButtonText, { color: colors.TEXT_ON_LIGHT }]}>日報を開く</Text>
              </View>
            </CocolonButton>
          </View>
        </View>

        <View style={styles.section}>
          <View ref={tutorialRefs?.monthlyRef} collapsable={false}>
            <CocolonPressable
              style={styles.dashboardInfoCard}
              onPress={onOpenMonthly}
              accessibilityLabel="今月のまとめを開く"
            >
            <View style={styles.dashboardCardTitleRow}>
              <Text style={styles.dashboardCardTitle}>今月のまとめ</Text>
              <View style={styles.dashboardCardRight}>
                <UnreadBadge
                  visible={unreadMonthly}
                  style={styles.dashboardUnreadBadge}
                />
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.TEXT_SUBTLE}
                  style={styles.dashboardCardChevron}
                />
              </View>
            </View>

            {monthlySummary?.loading ? (
              <View style={styles.monthlySummaryRow}>
                <ActivityIndicator size="small" color={colors.TEXT_SUBTLE} />
                <Text style={[styles.monthlySummaryText, { marginTop: 0, marginLeft: 10 }]}>読み込み中…</Text>
              </View>
            ) : (
              <Text style={styles.monthlySummaryText}>
                今月の観測：{typeof monthlySummary?.count === "number" ? monthlySummary.count : 0}回
              </Text>
            )}
            </CocolonPressable>
          </View>
        </View>

        <View style={styles.section}>
          <View ref={tutorialRefs?.selfStructureRef} collapsable={false}>
            <CocolonPressable
              style={styles.dashboardInfoCard}
              onPress={onOpenSelfReportLatest}
              accessibilityLabel="現在の自己構造を開く"
            >
            <View style={styles.dashboardCardTitleRow}>
              <Text style={styles.dashboardCardTitle}>自己構造</Text>
              <View style={styles.dashboardCardRight}>
                <UnreadBadge
                  visible={unreadSelfStructureLatest}
                  style={styles.dashboardUnreadBadge}
                />
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.TEXT_SUBTLE}
                  style={styles.dashboardCardChevron}
                />
              </View>
            </View>

            <Text style={styles.monthlySummaryText}>現在の自己構造を確認</Text>
            </CocolonPressable>

            <CocolonPressable
              style={[styles.historyInlineLink, { marginTop: 6 }]}
              onPress={onOpenSelfReportHistory}
              accessibilityLabel="自己構造レポート履歴を見る"
            >
              <Text style={styles.historyInlineText}>自己構造レポート履歴を見る</Text>
              <UnreadBadge
                visible={unreadSelfStructureHistory}
                style={styles.historyInlineUnreadBadge}
              />
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.TEXT_SUBTLE}
              />
            </CocolonPressable>
          </View>
        </View>

        <View style={styles.dashboardDivider} />

        <View ref={tutorialRefs?.historyRef} collapsable={false}>
          <CocolonPressable
            style={styles.historyInlineLink}
            onPress={onOpenHistory}
            accessibilityLabel="履歴を見る"
          >
            <Text style={styles.historyInlineText}>履歴を見る</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.TEXT_SUBTLE}
            />
          </CocolonPressable>

          <CocolonPressable
            style={[styles.historyInlineLink, { marginTop: 8 }]}
            onPress={onOpenTodayQuestionHistory}
            accessibilityLabel="今日の問い履歴を見る"
          >
            <Text style={styles.historyInlineText}>今日の問い履歴を見る</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.TEXT_SUBTLE}
            />
          </CocolonPressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function QuickLink({
  styles,
  colors,
  icon,
  label,
  subtitle,
  onPress,
  showBadge,
}) {
  return (
    <CocolonPressable
      style={styles.linkItem}
      onPress={onPress}
      accessibilityLabel={label}
    >
      <View style={styles.linkInner}>
        <View style={styles.linkIconWrap}>
          <Ionicons
            name={icon}
            size={22}
            color={colors.TEXT_ON_LIGHT}
          />
        </View>
        <View style={styles.linkTextWrap}>
          <Text numberOfLines={1} style={styles.linkLabel}>
            {label}
          </Text>
          {subtitle ? (
            <Text numberOfLines={1} style={styles.linkSubtitle}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.TEXT_SUBTLE}
        />

        <UnreadBadge
          visible={showBadge}
          style={styles.inlineUnreadBadge}
        />
      </View>
    </CocolonPressable>
  );
}

function createStyles(COLORS, ui) {
  const font = ui?.font || {};
  const text = ui?.text || {};

  return StyleSheet.create(applyTypographyTokens({
    // ルート
    container: { flex: 1, backgroundColor: COLORS.PANEL_BG },
    safeContent: { flex: 1 },

    // Analysis Home 用
    scrollContainer: {
      paddingTop: 16,
      paddingBottom: 32,
      alignItems: "stretch",
      paddingHorizontal: 18,
    },

    // Emlis ロゴ
    appTitleWrapper: {
      alignItems: "center",
      marginBottom: 14,
    },
    appTitleText: {
      fontFamily: "CormorantGaramond-Bold",
      fontSize: 24,
      color: COLORS.BRAND_GOLD,
      letterSpacing: 1.2,
    },
    appSubtitleText: {
      fontFamily: "CormorantGaramond-Regular",
      marginTop: 4,
      fontSize: 11,
      color: COLORS.BRAND_GOLD,
      letterSpacing: 0.8,
    },

    // メインパネル
    panel: {
      width: "94%",
      backgroundColor: COLORS.PANEL_BG,
      borderRadius: 26,
      borderWidth: 2,
      borderColor: COLORS.BORDER_GOLD,
      paddingHorizontal: 18,
      paddingVertical: 20,
      shadowColor: "#000",
      shadowOpacity: 0.24,
      shadowRadius: 26,
      shadowOffset: { width: 0, height: 16 },
      elevation: 12,
      height: PANEL_MIN_HEIGHT,
    },
    panelHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    panelTitle: {
      fontSize: font.title ?? 20,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      letterSpacing: 0.8,
    },

    panelTitleRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    guideButton: {
      width: 36,
      height: 32,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      marginLeft: 10,
    },

    section: {
      marginBottom: 18,
    },
    sectionLabel: {
      fontSize: font.sectionLabel ?? 12,
      color: text.sectionLabel ?? text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginBottom: 8,
    },

    tilesColumn: {
      marginTop: 4,
      flexGrow: 1,
      justifyContent: "space-between",
    },
    linkItem: { marginBottom: 10 },
    linkInner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 14,
      paddingVertical: 14,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    linkIconWrap: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
      backgroundColor: COLORS.PANEL_BG,
    },
    linkTextWrap: {
      flex: 1,
    },
    linkLabel: {
      fontSize: font.body ?? 13,
      fontWeight: "600",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    linkSubtitle: {
      marginTop: 2,
      fontSize: font.description ?? 9,
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },

    dashboardSummaryCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    dashboardSummaryHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    dashboardSummaryTitle: {
      flex: 1,
      fontSize: font.body ?? 14,
      fontWeight: "800",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    dashboardSummaryLoadingRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    dashboardSummaryRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      paddingVertical: 2,
    },
    dashboardSummaryLabel: {
      fontSize: font.sectionLabel ?? 12,
      color: text.sectionLabel ?? text.primary ?? COLORS.TEXT_ON_LIGHT,
      paddingRight: 12,
    },
    dashboardSummaryValue: {
      flex: 1,
      fontSize: font.body ?? 14,
      fontWeight: "700",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      textAlign: "right",
    },
    dashboardSummaryHint: {
      marginTop: 8,
      fontSize: font.description ?? 9,
      lineHeight: 15,
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },

    // Dashboard buttons card (Piece-like)
    dashboardButtonsCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    dashboardInfoCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    dashboardButtonWrap: {
      position: "relative",
    },
    buttonUnreadBadge: {
      position: "absolute",
      top: 10,
      right: 14,
    },
    dashboardCardTitleRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    dashboardCardRight: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 8,
    },
    dashboardCardChevron: {
      marginLeft: 6,
    },
    dashboardCardTitle: {
      fontSize: 13,
      fontWeight: "900",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      flex: 1,
    },
    dashboardUnreadBadge: {
      marginLeft: 8,
    },
    monthlySummaryRow: {
      marginTop: 8,
      flexDirection: "row",
      alignItems: "center",
    },
    monthlySummaryText: {
      marginTop: 8,
      fontSize: font.body ?? 13,
      color: text.description ?? COLORS.TEXT_SUBTLE,
      opacity: 0.9,
    },
    dashboardDivider: {
      height: 1,
      backgroundColor: COLORS.CARD_BORDER,
      marginTop: 2,
      marginBottom: 8,
    },
    historyInlineLink: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      paddingVertical: 4,
      marginBottom: 8,
    },
    historyInlineText: {
      fontSize: font.body ?? 13,
      fontWeight: "700",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginRight: 4,
    },
    historyInlineUnreadBadge: {
      marginRight: 6,
    },

    // Shared button row (Piece style)
    btnRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    goldButtonText: {
      fontSize: 13,
      fontWeight: "900",
      color: "#FFFFFF",
      letterSpacing: 0.6,
    },


    // 未読バッジ（●）
    inlineUnreadBadge: {
      position: "absolute",
      top: 10,
      right: 36,
    },

    // report 系（Weekly / Monthly 共通）
    reportContainer: {
      flex: 1,
      backgroundColor: COLORS.BG_SILVER,
      paddingHorizontal: 12,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
    },
    backBtn: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 4,
      paddingRight: 10,
    },
    backText: {
      marginLeft: 2,
      color: text.description ?? COLORS.TEXT_SUBTLE,
      fontSize: 13,
      fontWeight: "600",
    },
    reportTitle: { fontSize: 16, fontWeight: "700", color: text.primary ?? COLORS.TEXT_ON_LIGHT },
    error: { padding: 12, color: "#B91C1C" },

    summaryCard: {
      marginTop: 6,
      marginBottom: 10,
      padding: 12,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      borderRadius: 12,
      backgroundColor: "#F9FAFB",
    },
    summaryTitle: {
      fontWeight: "700",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginBottom: 6,
    },
    summaryItem: { color: text.description ?? COLORS.TEXT_SUBTLE, marginBottom: 2 },

    row: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: "#EEE",
    },
    dateText: { fontWeight: "700", color: text.primary ?? COLORS.TEXT_ON_LIGHT, marginBottom: 4 },
    emotionsText: { color: text.description ?? COLORS.TEXT_SUBTLE },
    memoText: { color: text.description ?? COLORS.TEXT_SUBTLE, marginTop: 4, fontStyle: "italic" },
  }, ui));
}

