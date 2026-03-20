import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
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

// Supabase
import { supabase } from "../lib/supabase";
import { apiGet, apiPost, apiFetch } from "../lib/apiClient";

// 既存
import MyWebHistoryScreen from "./MyWebHistoryScreen";
import MyWebReportHistoryScreen from "./MyWebReportHistoryScreen";
import MyWebReportViewerScreen from "./MyWebReportViewerScreen";
import DeepInsightScreen from "./DeepInsightScreen";
import SelfStructureReportHistoryScreen from "./SelfStructureReportHistoryScreen";
import SelfStructureReportViewerScreen from "./SelfStructureReportViewerScreen";
import SelfStructureReportGenerateScreen from "./SelfStructureReportGenerateScreen";
import TodayQuestionHistoryScreen from "./TodayQuestionHistoryScreen";

// 🎨 テーマコンテキスト
import { useTheme } from "../theme/ThemeContext";

// 🔴 Unread badge state (screen ⇄ bottom tab)
import { useUnread } from "../UnreadContext";
import { useSubscription } from "../SubscriptionContext";
import { useTutorial } from "../TutorialContext";

// UI (Design System)
import CocolonPressable from "../components/CocolonPressable";
import CocolonButton from "../components/CocolonButton";
import UnreadBadge from "../components/UnreadBadge";
import { makeUiTokens } from "../ui/uiTokens";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TutorialOverlay, {
  syncTutorialSpotlightTarget,
  waitForTutorialFrames,
} from "../components/TutorialOverlay";

// Home / MyModel の見た目に合わせたパネル高さ（だいたいの値）
const PANEL_MIN_HEIGHT = 690;

const MYWEB_TUTORIAL_STEP_START = 7;
const MYWEB_TUTORIAL_STEP_END = 13;
const TUTORIAL_TOTAL_STEPS = 23;

// Phase2: MyWeb（配布/生成）はMashOS側でensure（オンデマンド）
const MYMODEL_API_BASE_URL =
  process.env.EXPO_PUBLIC_MYMODEL_API_URL || "https://mashos-api.onrender.com";
const MYWEB_REPORTS_ENSURE_ENDPOINT = `${MYMODEL_API_BASE_URL}/myweb/reports/ensure`;

function normalizeMyProfileMode(mode) {
  const value = String(mode || "").trim().toLowerCase();
  return value === "deep" ? "deep" : "standard";
}

function useThemedStyles() {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";
  return { styles, colors, themeName, isDark, ui };
}

export default function MyWebScreen({ onOpenMyProfile, navigation, onTabUnreadChange, route: screenRoute, tabRoute }) {
  const { setUnreadGroup, clearScope } = useUnread();
  const { ensurePaid, ensurePremium, isPaid, loading: subscriptionLoading } = useSubscription();
  const { isTutorialMode, tutorialStep, setTutorialStep } = useTutorial();
  const screenRootRef = useRef(null);
  const { height: windowHeight } = useWindowDimensions();
  const safeInsets = useSafeAreaInsets();
  const tutorialScrollRef = useRef(null);
  const tutorialScrollYRef = useRef(0);
  const [tutorialTargetRect, setTutorialTargetRect] = useState(null);
  const [tutorialOverlayMetrics, setTutorialOverlayMetrics] = useState(null);
  const myWebTitleRef = useRef(null);
  const myWebDailyRef = useRef(null);
  const myWebWeeklyRef = useRef(null);
  const myWebMonthlyRef = useRef(null);
  const myWebSelfStructureRef = useRef(null);
  const myWebHistoryRef = useRef(null);


  // 'home' | 'history' | 'reportHistory' | 'reportView' | 'selfReportHistory' | 'selfReportView' | 'selfReportGenerate' | 'weekly' | 'monthly' | 'deepInsight'
  const [route, setRoute] = useState("home");
  const [reportType, setReportType] = useState("weekly"); // 'daily' | 'weekly' | 'monthly'
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedSelfReport, setSelectedSelfReport] = useState(null);
  const [selfReportGenerateBackRoute, setSelfReportGenerateBackRoute] = useState("home");
  const [selfReportGenerateMode, setSelfReportGenerateMode] = useState("standard");

  const clearExternalOpenParams = useCallback(
    (patch) => {
      try {
        navigation?.setParams?.(patch);
      } catch {
        // noop
      }
      try {
        const parentNav =
          typeof navigation?.getParent === "function" ? navigation.getParent() : null;
        parentNav?.setParams?.(patch);
      } catch {
        // noop
      }
    },
    [navigation]
  );

  useEffect(() => {
    const shouldOpen = !!(tabRoute?.params?.openTodayQuestionHistory || screenRoute?.params?.openTodayQuestionHistory);
    if (!shouldOpen) return;
    setRoute("todayQuestionHistory");
    clearExternalOpenParams({
      openTodayQuestionHistory: false,
      openTodayQuestionHistoryAt: null,
    });
  }, [
    clearExternalOpenParams,
    screenRoute?.params?.openTodayQuestionHistory,
    screenRoute?.params?.openTodayQuestionHistoryAt,
    tabRoute?.params?.openTodayQuestionHistory,
    tabRoute?.params?.openTodayQuestionHistoryAt,
  ]);

  // 未読バッジ（●）用：MyWeb（日/週/月）ごとの未読状態
  // 画面内では MyWebScreen 自身の refreshUnreadBadges() を唯一の truth にする。
  // UnreadContext は初期プリロードやタブ用の外部キャッシュとして扱い、
  // ここへ逆流させない（false -> true -> false の点滅を防ぐ）。
  const [unreadByType, setUnreadByType] = useState({
    daily: false,
    weekly: false,
    monthly: false,
    selfStructure: false,
  });
  const [unreadResolved, setUnreadResolved] = useState(false);

  const [weeklySummary, setWeeklySummary] = useState({
    loading: true,
    count: 0,
    top: [],
    error: "",
  });

  const [monthlySummary, setMonthlySummary] = useState({
    loading: true,
    count: 0,
    error: "",
  });

  // (hooks moved to the top of the component)

  // BottomTab の未読バッジ（赤丸）連動
  useEffect(() => {
    // 初回の authoritative 判定が返るまでは、
    // App 側の prefetch / UnreadContext を上書きしない。
    if (!unreadResolved) return;

    // 自己構造（selfStructure）は Plus/Premium のみ未読バッジ対象
    const effectiveSelfStructureUnread = !subscriptionLoading && !!isPaid && !!unreadByType.selfStructure;

    const hasUnread = !!(
      unreadByType.daily ||
      unreadByType.weekly ||
      unreadByType.monthly ||
      effectiveSelfStructureUnread
    );

    try {
      if (typeof onTabUnreadChange === "function") {
        onTabUnreadChange(hasUnread);
      }
    } catch {
      // noop
    }

    try {
      // UnreadContext: "MyWeb" scope は過去バージョンのキーが残ると
      // Tab 側の判定（scopeUnreadMap）がズレるため、毎回 scope を一旦クリアしてから上書きする。
      try {
        clearScope("MyWeb");
      } catch {
        // noop
      }

      // UnreadContext: "MyWeb" タブの赤●を画面内の未読バッジと同期
      setUnreadGroup("MyWeb", {
        daily: !!unreadByType.daily,
        weekly: !!unreadByType.weekly,
        monthly: !!unreadByType.monthly,
        selfStructure: !!effectiveSelfStructureUnread,
      });
    } catch {
      // noop
    }
  }, [
    unreadByType.daily,
    unreadByType.weekly,
    unreadByType.monthly,
    unreadByType.selfStructure,
    isPaid,
    subscriptionLoading,
    onTabUnreadChange,
    setUnreadGroup,
    clearScope,
    unreadResolved,
  ]);

  const { styles, colors, isDark } = useThemedStyles();

  const isMyWebTutorialStep =
    !!isTutorialMode &&
    tutorialStep >= MYWEB_TUTORIAL_STEP_START &&
    tutorialStep <= MYWEB_TUTORIAL_STEP_END;
  const isMyWebTutorialVisible = isMyWebTutorialStep && route === "home";

  const handleTutorialScroll = useCallback((e) => {
    tutorialScrollYRef.current =
      e?.nativeEvent?.contentOffset?.y ?? tutorialScrollYRef.current;
  }, []);

  const getTutorialTargetRef = useCallback(() => {
    if (!isMyWebTutorialVisible) return null;

    switch (tutorialStep) {
      case 7:
        return myWebTitleRef;
      case 8:
        return myWebDailyRef;
      case 9:
        return myWebWeeklyRef;
      case 10:
        return myWebMonthlyRef;
      case 11:
        return myWebSelfStructureRef;
      case 12:
        return myWebHistoryRef;
      case 13:
      default:
        return null;
    }
  }, [isMyWebTutorialVisible, tutorialStep]);

  const tutorialOverlayConfig = useMemo(() => {
    if (!isMyWebTutorialVisible) return null;

    switch (tutorialStep) {
      case 7:
        return {
          step: 7,
          mode: "info",
          title: "感情が分析されます",
          message: "ここでは\nあなたの感情が分析されます",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(8),
        };
      case 8:
        return {
          step: 8,
          mode: "info",
          title: "日報",
          message: "1日の感情は\n日報として分析されます",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(9),
        };
      case 9:
        return {
          step: 9,
          mode: "info",
          title: "週報",
          message: "感情の傾向は\n週単位でも確認できます",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(10),
        };
      case 10:
        return {
          step: 10,
          mode: "info",
          title: "月報",
          message: "長期の感情の変化も\n分析されます",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(11),
        };
      case 11:
        return {
          step: 11,
          mode: "info",
          title: "自己構造",
          message:
            "メモ付き入力を続けると\n\n自己構造分析レポート\nが作られます",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(12),
        };
      case 12:
        return {
          step: 12,
          mode: "info",
          title: "履歴",
          message: "入力した感情は\nここで履歴として確認できます",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(13),
        };
      case 13:
        return {
          step: 13,
          mode: "info",
          title: "次はReflection",
          message: "次はReflectionを作ってみましょう",
          nextLabel: "MyModelへ",
          onNext: () => {
            setTutorialStep(14);
            requestAnimationFrame(() => {
              try {
                if (navigation?.navigate) {
                  navigation.navigate("MyModel");
                  return;
                }
              } catch {
                // no-op
              }

              try {
                const parent =
                  typeof navigation?.getParent === "function"
                    ? navigation.getParent()
                    : null;
                if (parent && typeof parent.navigate === "function") {
                  parent.navigate("MyModel");
                }
              } catch {
                // no-op
              }
            });
          },
        };
      default:
        return null;
    }
  }, [isMyWebTutorialVisible, tutorialStep, setTutorialStep, navigation]);

  const syncTutorialTargetRect = useCallback(async () => {
    if (!isMyWebTutorialVisible) {
      return null;
    }

    const targetRef = getTutorialTargetRef();
    if (!targetRef || !screenRootRef.current) {
      return null;
    }

    return syncTutorialSpotlightTarget({
      enabled: isMyWebTutorialVisible,
      targetRef,
      rootRef: screenRootRef,
      scrollRef: tutorialScrollRef,
      currentScrollYRef: tutorialScrollYRef,
      overlayMetrics: tutorialOverlayMetrics,
      windowHeight,
      safeInsets,
      cardPlacement:
        tutorialStep === 11 || tutorialStep === 12 ? "top" : "bottom",
      measureOptions: {
        maxAttempts: 3,
        settleFrames: 1,
      },
    });
  }, [
    getTutorialTargetRef,
    isMyWebTutorialVisible,
    safeInsets,
    tutorialStep,
    tutorialOverlayMetrics,
    windowHeight,
  ]);

  // In tutorial mode, keep MyWeb on "home" during the MyWeb steps.
  useEffect(() => {
    if (!isMyWebTutorialStep) return;
    if (route === "home") return;

    setSelectedReport(null);
    setSelectedSelfReport(null);
    setRoute("home");
  }, [isMyWebTutorialStep, route]);

  useLayoutEffect(() => {
    if (!isMyWebTutorialVisible) {
      setTutorialTargetRect(null);
      setTutorialOverlayMetrics(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      await waitForTutorialFrames(2);
      if (cancelled) return;

      const nextRect = await syncTutorialTargetRect();
      if (!cancelled) {
        setTutorialTargetRect(nextRect);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [
    isMyWebTutorialVisible,
    tutorialStep,
    weeklySummary?.loading,
    monthlySummary?.loading,
    tutorialOverlayMetrics,
    syncTutorialTargetRect,
  ]);

  // ------------------------------------------------------------
  // Tab reselect → MyWeb "home" に戻す
  // - MyWeb は画面内で route state を持っているため、
  //   同じタブを再タップしたときにメイン（home）へ戻す。
  // ------------------------------------------------------------
  const routeRef = useRef(route);
  const unreadRefreshSeqRef = useRef(0);
  useEffect(() => {
    routeRef.current = route;
  }, [route]);

  useEffect(() => {
    if (!navigation?.addListener) return;

    const unsubscribe = navigation.addListener("tabPress", (e) => {
      // タブ切替（他タブ→MyWeb）ではなく「MyWebを表示中の再タップ」だけに反応する
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

  // レポートを開いた時に既読登録（report_reads に upsert）
  const markReportRead = useCallback(async (report) => {
    const reportId = report?.id ? String(report.id) : null;
    if (!reportId) return;

    try {
      await apiPost("/report-reads/mark", {
        report_id: reportId,
        report_table: "myweb_reports",
        report_scope: "myweb",
      });
    } catch (e) {
      console.warn("MyWebScreen: failed to mark report read", e);
    }
  }, []);

  // MyWeb（日/週/月）の未読状態を更新
  const refreshUnreadBadges = useCallback(async () => {
    const refreshSeq = ++unreadRefreshSeqRef.current;
    const isStale = () => refreshSeq !== unreadRefreshSeqRef.current;

    try {
      const query = new URLSearchParams({
        limit: "1",
        include_self_structure: isPaid ? "true" : "false",
      }).toString();
      const json = await apiGet(`/report-reads/myweb-unread-status?${query}`);
      const unread = json?.unread_by_type || {};

      if (isStale()) return;

      setUnreadByType({
        daily: !!unread?.daily,
        weekly: !!unread?.weekly,
        monthly: !!unread?.monthly,
        selfStructure: !!unread?.selfStructure,
      });
      setUnreadResolved(true);
    } catch (e) {
      if (isStale()) return;
      console.warn("MyWebScreen: failed to refresh unread badges", e);
    }
  }, [isPaid]);

  const refreshHomeSummaries = useCallback(async () => {
    setWeeklySummary((prev) => ({
      ...prev,
      loading: true,
      error: "",
    }));
    setMonthlySummary((prev) => ({
      ...prev,
      loading: true,
      error: "",
    }));

    try {
      const json = await apiGet("/myweb/home-summary");
      const weekly = json?.weekly || {};
      const monthly = json?.monthly || {};

      setWeeklySummary({
        loading: false,
        count: typeof weekly?.count === "number" ? weekly.count : 0,
        top: Array.isArray(weekly?.top) ? weekly.top : [],
        error: String(weekly?.error || ""),
      });
      setMonthlySummary({
        loading: false,
        count: typeof monthly?.count === "number" ? monthly.count : 0,
        error: String(monthly?.error || ""),
      });
    } catch (e) {
      console.warn("MyWebScreen: failed to refresh home summaries", e);
      const message = String(e?.message || e || "");
      setWeeklySummary({
        loading: false,
        count: 0,
        top: [],
        error: message,
      });
      setMonthlySummary({
        loading: false,
        count: 0,
        error: message,
      });
    }
  }, []);


  const openReportHistory = (type) => {
    setReportType(type);
    setSelectedReport(null);
    setRoute("reportHistory");
  };

  const openSelfStructureRoute = useCallback(
    async ({ targetRoute, backRoute = "home" }) => {
      try {
        const ok = await (typeof ensurePaid === "function" ? ensurePaid() : false);

        if (ok) {
          setSelectedSelfReport(null);
          setSelfReportGenerateBackRoute(backRoute);
          setRoute(targetRoute);
          return;
        }

        const goSubscription = () => {
          try {
            if (navigation?.navigate) {
              navigation.navigate("SubscriptionSelect");
              return;
            }
          } catch {
            // no-op
          }

          Alert.alert("プラン確認", "加入画面を開けませんでした。もう一度お試しください。");
        };

        Alert.alert(
          "自己構造分析レポート",
          "自己構造分析レポートはPlus会員以上で利用できます。\n\nPlus会員以上で本文の閲覧が可能になります。",
          [
            { text: "閉じる", style: "cancel" },
            { text: "プランを見る", onPress: goSubscription },
          ]
        );
      } catch {
        Alert.alert(
          "プラン確認",
          "プラン情報を取得できませんでした。通信状況を確認してもう一度お試しください。"
        );
      }
    },
    [ensurePaid, navigation]
  );

  const openSelfReportLatest = useCallback(
    (nextMode = "standard") => {
      setSelfReportGenerateMode(normalizeMyProfileMode(nextMode));
      openSelfStructureRoute({
        targetRoute: "selfReportGenerate",
        backRoute: "home",
      });
    },
    [openSelfStructureRoute]
  );

  const openSelfReportHistory = useCallback(() => {
    openSelfStructureRoute({
      targetRoute: "selfReportHistory",
      backRoute: "home",
    });
  }, [openSelfStructureRoute]);

  useEffect(() => {
    const shouldOpenReportHistory = !!(
      tabRoute?.params?.openReportHistory || screenRoute?.params?.openReportHistory
    );
    const nextReportType = String(
      tabRoute?.params?.openReportHistoryType || screenRoute?.params?.openReportHistoryType || ""
    ).trim().toLowerCase();

    if (shouldOpenReportHistory && ["daily", "weekly", "monthly"].includes(nextReportType)) {
      setSelectedReport(null);
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
      const nextMode = normalizeMyProfileMode(
        tabRoute?.params?.openSelfReportLatestMode || screenRoute?.params?.openSelfReportLatestMode
      );
      setSelfReportGenerateMode(nextMode);
      openSelfStructureRoute({
        targetRoute: "selfReportGenerate",
        backRoute: "home",
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
      openSelfStructureRoute({
        targetRoute: "selfReportHistory",
        backRoute: "home",
      });
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
      setRoute("home");
      clearExternalOpenParams({
        openDistributionHome: false,
        openDistributionHomeAt: null,
      });
    }
  }, [
    clearExternalOpenParams,
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

  const openSelfReportView = useCallback((report) => {
    setSelectedSelfReport(report || null);
    setRoute("selfReportView");
  }, []);

  const openReportView = useCallback(
    async (report) => {
      setSelectedReport(report || null);
      setRoute("reportView");
      try {
        await markReportRead(report);
      } finally {
        refreshUnreadBadges();
      }
    },
    [markReportRead, refreshUnreadBadges]
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

  // ✅ Deep Insight: Premium only
  const openDeepInsight = useCallback(async () => {
    try {
      const ok = await (typeof ensurePremium === "function" ? ensurePremium() : false);

      if (ok) {
        setRoute("deepInsight");
        return;
      }

      // free -> subscription誘導（自己構造分析レポートと同様にポップアップを挟む）
      Alert.alert(
        "Deep Insight",
        "Deep InsightはPremiumで提供予定です。\n\n※Premiumは準備中です。",
        [
          { text: "閉じる", style: "cancel" },
          { text: "プラン内容を見る", onPress: openSubscriptionSelect },
        ]
      );
    } catch {
      Alert.alert(
        "プラン確認",
        "プラン情報を取得できませんでした。通信状況を確認してもう一度お試しください。"
      );
    }
  }, [ensurePaid, openSubscriptionSelect]);

  // MyModel タブへ移動（ナビが無い場合も落とさない）
  const openMyModelBuild = useCallback(() => {
    try {
      if (navigation?.navigate) {
        navigation.navigate("MyModel");
        return;
      }
    } catch {
      // no-op
    }

    try {
      const parent =
        typeof navigation?.getParent === "function" ? navigation.getParent() : null;
      if (parent && typeof parent.navigate === "function") {
        parent.navigate("MyModel");
        return;
      }
    } catch {
      // no-op
    }

    Alert.alert("移動できませんでした", "MyModelを開けませんでした。もう一度お試しください。");
  }, [navigation]);

  // Cocolonガイド（MyWeb）
  const openGuide = useCallback(() => {
    try {
      if (navigation?.navigate) {
        navigation.navigate("CocolonGuide", { screenId: "myweb" });
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
        parent.navigate("CocolonGuide", { screenId: "myweb" });
      }
    } catch {
      // no-op
    }
  }, [navigation]);

  // Phase2: MyWebを開いたタイミングで、サーバ側の配布状態をオンデマンドで追いつかせる
  // （端末タイマーによる自動生成は停止し、MashOS主導へ移行）
  const ensuredRef = useRef(false);
  useEffect(() => {
    if (ensuredRef.current) return;
    ensuredRef.current = true;

    (async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData?.session?.access_token ?? null;
        if (!accessToken) return;

        const res = await apiFetch(MYWEB_REPORTS_ENSURE_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            types: ["weekly", "monthly"],
            force: false,
          }),
        });

        if (!res.ok) {
          const t = await res.text();
          console.warn("MyWebScreen: myweb/reports/ensure failed", res.status, t);
        }
      } catch (e) {
        console.warn("MyWebScreen: myweb/reports/ensure failed", e);
      } finally {
        // 生成/配布の追いつかせ後に、未読バッジを更新
        refreshUnreadBadges();
        refreshHomeSummaries();
      }
    })();
  }, [refreshUnreadBadges, refreshHomeSummaries]);

  // Home に戻ったタイミングでも更新
  useEffect(() => {
    if (route === "home") {
      refreshUnreadBadges();
      refreshHomeSummaries();
    }
  }, [route, refreshUnreadBadges, refreshHomeSummaries]);

  return (
    <View ref={screenRootRef} collapsable={false} style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />
      {route === "history" ? (
        <MyWebHistoryScreen onBack={() => setRoute("home")} />
      ) : route === "reportHistory" ? (
        <MyWebReportHistoryScreen
          reportType={reportType}
          onBack={() => {
            setRoute("home");
            refreshUnreadBadges();
            refreshHomeSummaries();
          }}
          onOpenReport={openReportView}
          onGenerateLatest={() => setRoute(reportType)}
          onOpenSubscription={openSubscriptionSelect}
        />
      ) : route === "reportView" ? (
        <MyWebReportViewerScreen
          report={selectedReport}
          onBack={() => {
            setRoute("reportHistory");
            refreshUnreadBadges();
          }}
          onOpenMyProfile={onOpenMyProfile}
          onOpenSubscription={openSubscriptionSelect}
        />
      ) : route === "selfReportHistory" ? (
        <SelfStructureReportHistoryScreen
          reportType="monthly"
          onBack={() => {
            setRoute("home");
            refreshUnreadBadges();
            refreshHomeSummaries();
          }}
          onOpenReport={openSelfReportView}
          onGenerateLatest={() => {
            setSelfReportGenerateMode("standard");
            openSelfStructureRoute({
              targetRoute: "selfReportGenerate",
              backRoute: "selfReportHistory",
            });
          }}
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
          onBack={() => setRoute(selfReportGenerateBackRoute)}
        />
      ) : route === "todayQuestionHistory" ? (
        <TodayQuestionHistoryScreen onBack={() => setRoute("home")} />
      ) : route === "deepInsight" ? (
        <DeepInsightScreen onBack={() => setRoute("home")} />
      ) : (
        <View style={styles.safeContent}>
        <MyWebHome
          styles={styles}
          colors={colors}
          tutorialScrollRef={tutorialScrollRef}
          onTutorialScroll={handleTutorialScroll}
          tutorialRefs={{
            titleRef: myWebTitleRef,
            dailyRef: myWebDailyRef,
            weeklyRef: myWebWeeklyRef,
            monthlyRef: myWebMonthlyRef,
            selfStructureRef: myWebSelfStructureRef,
            historyRef: myWebHistoryRef,
          }}
          onOpenGuide={openGuide}
          onOpenHistory={() => setRoute("history")}
          onOpenDaily={() => openReportHistory("daily")}
          onOpenWeekly={() => openReportHistory("weekly")}
          onOpenMonthly={() => openReportHistory("monthly")}
          onOpenSelfReportLatest={openSelfReportLatest}
          onOpenSelfReportHistory={openSelfReportHistory}
          onOpenMyModelBuild={openMyModelBuild}
          onOpenDeepInsight={openDeepInsight}
          onOpenTodayQuestionHistory={() => setRoute("todayQuestionHistory")}
          unreadDaily={unreadResolved && unreadByType.daily}
          unreadWeekly={unreadResolved && unreadByType.weekly}
          unreadMonthly={unreadResolved && unreadByType.monthly}
          unreadSelfStructure={unreadResolved && !subscriptionLoading && isPaid ? unreadByType.selfStructure : false}
          weeklySummary={weeklySummary}
          monthlySummary={monthlySummary}
        />
        </View>
      )}

      {tutorialOverlayConfig ? (
        <TutorialOverlay
          visible={!!tutorialOverlayConfig}
          targetRect={tutorialTargetRect}
          title={tutorialOverlayConfig.title}
          message={tutorialOverlayConfig.message}
          step={tutorialOverlayConfig.step}
          totalSteps={TUTORIAL_TOTAL_STEPS}
          mode={tutorialOverlayConfig.mode}
          nextLabel={tutorialOverlayConfig.nextLabel}
          onNext={tutorialOverlayConfig.onNext}
          onMetricsChange={setTutorialOverlayMetrics}
          actionHint={tutorialOverlayConfig.actionHint}
          cardPlacement={
            tutorialStep === 11 || tutorialStep === 12 ? "top" : "bottom"
          }
        />
      ) : null}
    </View>
  );
}

// --- Home ---
function MyWebHome({
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
  onOpenMyModelBuild,
  onOpenDeepInsight,
  onOpenTodayQuestionHistory,
  unreadDaily,
  unreadWeekly,
  unreadMonthly,
  unreadSelfStructure,
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
        {/* パネルヘッダー：MyWeb */}
        <View style={styles.panelHeader}>
          <View ref={tutorialRefs?.titleRef} collapsable={false} style={styles.panelTitleRow}>
            <Text style={styles.panelTitle}>MyWeb</Text>
            <CocolonPressable
              style={styles.guideButton}
              onPress={onOpenGuide}
              accessibilityLabel="MyWebのガイドを開く"
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
                  visible={unreadSelfStructure}
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

  return StyleSheet.create({
    // ルート
    container: { flex: 1, backgroundColor: COLORS.PANEL_BG },
    safeContent: { flex: 1 },

    // MyWeb Home 用
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

	    // Deep Insight CTA
	    deepInsightSection: {
	      marginTop: 10,
	    },
	    deepInsightLead: {
	      fontSize: font.sectionLabel ?? 12,
	      color: text.description ?? COLORS.TEXT_ON_LIGHT,
	      marginBottom: 10,
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

    // Dashboard buttons card (MyModel-like)
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
      color: text.description ?? COLORS.TEXT_ON_LIGHT,
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

    // Shared button row (MyModel style)
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
      color: "#374151",
      fontSize: 13,
      fontWeight: "600",
    },
    reportTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
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
      color: "#111827",
      marginBottom: 6,
    },
    summaryItem: { color: "#374151", marginBottom: 2 },

    row: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: "#EEE",
    },
    dateText: { fontWeight: "700", color: "#111827", marginBottom: 4 },
    emotionsText: { color: "#374151" },
    memoText: { color: "#374151", marginTop: 4, fontStyle: "italic" },
  });
}

