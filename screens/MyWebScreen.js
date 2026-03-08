import React, {
  useEffect,
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
  SafeAreaView,
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
import { getCurrentUserId } from "../lib/user";

// 既存
import MyWebHistoryScreen from "./MyWebHistoryScreen";
import WeeklyReportMockScreen from "./WeeklyReportMockScreen";
import MonthlyReportMockScreen from "./MonthlyReportMockScreen";
import MyWebReportHistoryScreen from "./MyWebReportHistoryScreen";
import MyWebReportViewerScreen from "./MyWebReportViewerScreen";
import DeepInsightScreen from "./DeepInsightScreen";
import SelfStructureReportHistoryScreen from "./SelfStructureReportHistoryScreen";
import SelfStructureReportViewerScreen from "./SelfStructureReportViewerScreen";
import SelfStructureReportGenerateScreen from "./SelfStructureReportGenerateScreen";

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
import TutorialOverlay, { measureTutorialTarget } from "../components/TutorialOverlay";

// Home / MyModel の見た目に合わせたパネル高さ（だいたいの値）
const PANEL_MIN_HEIGHT = 690;

const MYWEB_TUTORIAL_STEP_START = 7;
const MYWEB_TUTORIAL_STEP_END = 13;
const TUTORIAL_TOTAL_STEPS = 23;

// Phase2: MyWeb（配布/生成）はMashOS側でensure（オンデマンド）
const MYMODEL_API_BASE_URL =
  process.env.EXPO_PUBLIC_MYMODEL_API_URL || "https://mashos-api.onrender.com";
const MYWEB_REPORTS_ENSURE_ENDPOINT = `${MYMODEL_API_BASE_URL}/myweb/reports/ensure`;
const MYWEB_REPORTS_READY_ENDPOINT = `${MYMODEL_API_BASE_URL}/myweb/reports/ready`;

async function getAccessToken() {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    return sessionData?.session?.access_token ?? null;
  } catch {
    return null;
  }
}

function extractReadyItems(payload) {
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.reports)) return payload.reports;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.data?.reports)) return payload.data.reports;
  if (Array.isArray(payload)) return payload;
  return [];
}

async function fetchReadyReports(accessToken, reportType, limit = 1) {
  const url = `${MYWEB_REPORTS_READY_ENDPOINT}?report_type=${encodeURIComponent(
    reportType
  )}&limit=${encodeURIComponent(limit)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`ready failed: ${res.status}`);
    err.status = res.status;
    err.body = text;
    throw err;
  }

  const json = await res.json();
  return extractReadyItems(json);
}

function useThemedStyles() {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";
  return { styles, colors, themeName, isDark, ui };
}

export default function MyWebScreen({ onOpenMyProfile, navigation, onTabUnreadChange }) {
  const { setUnreadGroup, clearScope } = useUnread();
  const { ensurePaid, ensurePremium, isPaid, loading: subscriptionLoading } = useSubscription();
  const { isTutorialMode, tutorialStep, setTutorialStep } = useTutorial();
  const screenRootRef = useRef(null);
  const { height: windowHeight } = useWindowDimensions();
  const tutorialScrollRef = useRef(null);
  const tutorialScrollYRef = useRef(0);
  const [tutorialTargetRect, setTutorialTargetRect] = useState(null);
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
      setTutorialTargetRect(null);
      return;
    }

    const targetRef = getTutorialTargetRef();
    if (!targetRef || !screenRootRef.current) {
      setTutorialTargetRect(null);
      return;
    }

    const firstRect = await measureTutorialTarget(targetRef, screenRootRef);
    if (!firstRect) {
      setTutorialTargetRect(null);
      return;
    }

    const lowerSafeLine = Math.max(220, windowHeight - 260);
    const upperSafeLine = 90;
    if (firstRect.bottom > lowerSafeLine || firstRect.y < upperSafeLine) {
      const nextScrollY = Math.max(
        0,
        tutorialScrollYRef.current + firstRect.y - 130
      );

      try {
        tutorialScrollRef.current?.scrollTo?.({
          y: nextScrollY,
          animated: true,
        });
      } catch {
        // noop
      }

      setTimeout(async () => {
        const nextRect = await measureTutorialTarget(targetRef, screenRootRef);
        setTutorialTargetRect(nextRect);
      }, 260);
      return;
    }

    setTutorialTargetRect(firstRect);
  }, [getTutorialTargetRef, isMyWebTutorialVisible, windowHeight]);

  // In tutorial mode, keep MyWeb on "home" during the MyWeb steps.
  useEffect(() => {
    if (!isMyWebTutorialStep) return;
    if (route === "home") return;

    setSelectedReport(null);
    setSelectedSelfReport(null);
    setRoute("home");
  }, [isMyWebTutorialStep, route]);

  useEffect(() => {
    if (!isMyWebTutorialVisible) {
      setTutorialTargetRect(null);
      return;
    }

    const timer = setTimeout(() => {
      syncTutorialTargetRect();
    }, 80);

    return () => clearTimeout(timer);
  }, [
    isMyWebTutorialVisible,
    tutorialStep,
    weeklySummary?.loading,
    monthlySummary?.loading,
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
      const userId = await getCurrentUserId();
      if (!userId) return;

      const { error } = await supabase
        .from("report_reads")
        .upsert(
          { user_id: userId, report_id: reportId },
          {
            onConflict: "user_id,report_id",
            ignoreDuplicates: true,
          }
        );

      if (error) throw error;
    } catch (e) {
      // 既読付けに失敗しても致命的ではないので握りつぶす（ログだけ）
      console.warn("MyWebScreen: failed to mark report read", e);
    }
  }, [isPaid]);

  // MyWeb（日/週/月）の未読状態を更新
  const refreshUnreadBadges = useCallback(async () => {
    const refreshSeq = ++unreadRefreshSeqRef.current;
    const isStale = () => refreshSeq !== unreadRefreshSeqRef.current;
    const TYPES = ["daily", "weekly", "monthly"];
    const BADGE_TARGET_LIMIT = 1; // Homeのバッジは「最新の表示可能レポート」が未読かどうかだけを見る

    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        if (isStale()) return;
        setUnreadByType({ daily: false, weekly: false, monthly: false, selfStructure: false });
        setUnreadResolved(true);
        return;
      }

      const accessToken = await getAccessToken();
      if (!accessToken) {
        if (isStale()) return;
        setUnreadByType({ daily: false, weekly: false, monthly: false, selfStructure: false });
        setUnreadResolved(true);
        return;
      }

      // 1) 履歴/Viewer と同じ READY API を使って、実際に見えている最新レポートIDを取る
      const idsByType = {
        daily: [],
        weekly: [],
        monthly: [],
        selfStructure: [],
      };

      await Promise.all(
        TYPES.map(async (t) => {
          try {
            const readyItems = await fetchReadyReports(accessToken, t, BADGE_TARGET_LIMIT);
            idsByType[t] = (Array.isArray(readyItems) ? readyItems : [])
              .map((r) => String(r?.id || ""))
              .filter(Boolean)
              .slice(0, BADGE_TARGET_LIMIT);
          } catch (e) {
            console.warn(
              "MyWebScreen: failed to fetch READY report ids for unread badge",
              t,
              e?.status || e?.message || e
            );
            idsByType[t] = [];
          }
        })
      );

      // 1b) 自己構造（月次）は引き続き Supabase 直読。ただし Homeバッジ用に最新1件だけを見る。
      // - Free では未読バッジ対象外のため取得しない（RLS/負荷対策）
      if (isPaid) {
        try {
          const { data: selfData, error: selfErr } = await supabase
            .from("myprofile_reports")
            .select("id")
            .eq("user_id", userId)
            .eq("report_type", "monthly")
            .order("period_end", { ascending: false })
            .order("generated_at", { ascending: false })
            .order("updated_at", { ascending: false })
            .limit(BADGE_TARGET_LIMIT);

          if (!selfErr) {
            idsByType.selfStructure = (Array.isArray(selfData) ? selfData : [])
              .map((r) => String(r?.id || ""))
              .filter(Boolean)
              .slice(0, BADGE_TARGET_LIMIT);
          } else {
            idsByType.selfStructure = [];
          }
        } catch (e) {
          // best-effort: selfStructure は取得できなくても週/月の未読判定は続行する
          idsByType.selfStructure = [];
        }
      } else {
        idsByType.selfStructure = [];
      }

      const allIds = Array.from(
        new Set([
          ...idsByType.daily,
          ...idsByType.weekly,
          ...idsByType.monthly,
          ...idsByType.selfStructure,
        ])
      );

      // 2) 表示対象IDの中で、既読済みIDをまとめて取得
      let readSet = new Set();
      if (allIds.length > 0) {
        const { data: reads, error: rErr } = await supabase
          .from("report_reads")
          .select("report_id")
          .eq("user_id", userId)
          .in("report_id", allIds);

        if (rErr) throw rErr;

        readSet = new Set(
          (Array.isArray(reads) ? reads : [])
            .map((r) => String(r?.report_id || ""))
            .filter(Boolean)
        );
      }

      if (isStale()) return;

      // 3) Homeの未読バッジは「最新の1件」が未読かどうかで判定する
      const isLatestUnread = (ids) => {
        const latestId = Array.isArray(ids) && ids.length > 0 ? ids[0] : null;
        return !!latestId && !readSet.has(latestId);
      };

      setUnreadByType({
        daily: isLatestUnread(idsByType.daily),
        weekly: isLatestUnread(idsByType.weekly),
        monthly: isLatestUnread(idsByType.monthly),
        selfStructure: isLatestUnread(idsByType.selfStructure),
      });
      setUnreadResolved(true);
    } catch (e) {
      if (isStale()) return;
      // 通信失敗時に false を流し込むと、
      // 「一度消えた/付いた」が発生しやすいので前回値を維持する。
      console.warn("MyWebScreen: failed to refresh unread badges", e);
    }
  }, [isPaid]);

  const refreshWeeklySummary = useCallback(async () => {
    setWeeklySummary((prev) => ({
      ...prev,
      loading: true,
      error: "",
    }));

    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        setWeeklySummary({
          loading: false,
          count: 0,
          top: [],
          error: "",
        });
        return;
      }

      const range = getWeeklyRangeForNow();
      const { data, error } = await supabase
        .from("emotions")
        .select("id, emotions")
        .eq("user_id", userId)
        .gte("created_at", range.start.toISOString())
        .lte("created_at", range.end.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;

      const summary = summarize(Array.isArray(data) ? data : []);
      setWeeklySummary({
        loading: false,
        count: summary.count,
        top: summary.top,
        error: "",
      });
    } catch (e) {
      console.warn("MyWebScreen: failed to refresh weekly summary", e);
      setWeeklySummary({
        loading: false,
        count: 0,
        top: [],
        error: String(e?.message || e || ""),
      });
    }
  }, []);

  const refreshMonthlySummary = useCallback(async () => {
    setMonthlySummary((prev) => ({
      ...prev,
      loading: true,
      error: "",
    }));

    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        setMonthlySummary({ loading: false, count: 0, error: "" });
        return;
      }

      // Month range (JST)
      const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
      const now = new Date();
      const nowJst = new Date(now.getTime() + JST_OFFSET_MS);
      const y = nowJst.getUTCFullYear();
      const mon = nowJst.getUTCMonth(); // 0-based

      const monthStartUtcMs = Date.UTC(y, mon, 1, 0, 0, 0) - JST_OFFSET_MS;
      const nextMonthStartUtcMs = Date.UTC(y, mon + 1, 1, 0, 0, 0) - JST_OFFSET_MS;

      const monthStartIso = new Date(monthStartUtcMs).toISOString();
      const monthEndIso = new Date(nextMonthStartUtcMs).toISOString();

      const res = await supabase
        .from("emotions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", monthStartIso)
        .lt("created_at", monthEndIso);

      const c = typeof res?.count === "number" ? res.count : 0;
      setMonthlySummary({ loading: false, count: c, error: "" });
    } catch (e) {
      console.warn("MyWebScreen: failed to refresh monthly summary", e);
      setMonthlySummary({
        loading: false,
        count: 0,
        error: String(e?.message || e || ""),
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

  const openSelfReportLatest = useCallback(() => {
    openSelfStructureRoute({
      targetRoute: "selfReportGenerate",
      backRoute: "home",
    });
  }, [openSelfStructureRoute]);

  const openSelfReportHistory = useCallback(() => {
    openSelfStructureRoute({
      targetRoute: "selfReportHistory",
      backRoute: "home",
    });
  }, [openSelfStructureRoute]);

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
        "Deep InsightはPremium会員以上で利用できます。\n\nPremium会員以上で本文の閲覧が可能になります。",
        [
          { text: "閉じる", style: "cancel" },
          { text: "プランを見る", onPress: openSubscriptionSelect },
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

        const res = await fetch(MYWEB_REPORTS_ENSURE_ENDPOINT, {
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
        refreshWeeklySummary();
        refreshMonthlySummary();
      }
    })();
  }, [refreshUnreadBadges, refreshWeeklySummary, refreshMonthlySummary]);

  // Home に戻ったタイミングでも更新
  useEffect(() => {
    if (route === "home") {
      refreshUnreadBadges();
      refreshWeeklySummary();
      refreshMonthlySummary();
    }
  }, [route, refreshUnreadBadges, refreshWeeklySummary, refreshMonthlySummary]);

  return (
    <SafeAreaView ref={screenRootRef} collapsable={false} style={styles.container}>
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
            refreshWeeklySummary();
            refreshMonthlySummary();
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
            refreshWeeklySummary();
            refreshMonthlySummary();
          }}
          onOpenReport={openSelfReportView}
          onGenerateLatest={() =>
            openSelfStructureRoute({
              targetRoute: "selfReportGenerate",
              backRoute: "selfReportHistory",
            })
          }
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
          onBack={() => setRoute(selfReportGenerateBackRoute)}
        />
      ) : route === "weekly" ? (
        <WeeklyReportMockScreen
          onBack={() => setRoute("reportHistory")}
          onOpenMyProfile={onOpenMyProfile}
        />
      ) : route === "monthly" ? (
        <MonthlyReportMockScreen
          onBack={() => setRoute("reportHistory")}
          onOpenMyProfile={onOpenMyProfile}
        />
      ) : route === "deepInsight" ? (
        <DeepInsightScreen onBack={() => setRoute("home")} />
      ) : (
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
          unreadDaily={unreadResolved && unreadByType.daily}
          unreadWeekly={unreadResolved && unreadByType.weekly}
          unreadMonthly={unreadResolved && unreadByType.monthly}
          unreadSelfStructure={unreadResolved && !subscriptionLoading && isPaid ? unreadByType.selfStructure : false}
          weeklySummary={weeklySummary}
          monthlySummary={monthlySummary}
        />
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
          actionHint={tutorialOverlayConfig.actionHint}
        />
      ) : null}
    </SafeAreaView>
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

/* 以下、WeeklyReportScreen / MonthlyReportScreen は
   いまはルーティングで使ってないけど、
   getCurrentUserId ベースで Supabase を読むように修正済み。内容は省略せず全部貼っておくね。 */

function getWeeklyRangeForNow() {
  const now = new Date();
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );
  const start = new Date(end);
  start.setDate(end.getDate() - 6);
  start.setHours(0, 0, 0, 0);
  return { start, end };
}

function getMonthlyRangeForNow() {
  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
    0,
    0,
    0,
    0
  );
  const end = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
  return { start, end };
}

function WeeklyReportScreen({ onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);

  const { styles } = useThemedStyles();

  const range = useMemo(() => getWeeklyRangeForNow(), []);
  const title = useMemo(() => {
    const s = range.start;
    const e = range.end;
    const fmt = (d) => `${d.getMonth() + 1}/${d.getDate()}`;
    return `週報  ${fmt(s)} 〜 ${fmt(e)}`;
  }, [range]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        setError("ユーザー情報を取得できませんでした");
        setRows([]);
        return;
      }

      const { data, error } = await supabase
        .from("emotions")
        .select("id, created_at, emotions, memo")
        .eq("user_id", userId)
        .gte("created_at", range.start.toISOString())
        .lte("created_at", range.end.toISOString())
        .order("created_at", { ascending: false });
      if (error) throw error;
      setRows(data || []);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }, [range.start, range.end]);

  useEffect(() => {
    load();
  }, [load]);

  const summary = useMemo(() => summarize(rows), [rows]);

  return (
    <View style={styles.reportContainer}>
      <Header title={title} onBack={onBack} />
      {loading ? (
        <ActivityIndicator style={{ marginTop: 16 }} />
      ) : error ? (
        <Text style={styles.error}>取得エラー: {error}</Text>
      ) : (
        <ReportBody summary={summary} rows={rows} />
      )}
    </View>
  );
}

function MonthlyReportScreen({ onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);

  const { styles } = useThemedStyles();

  const range = useMemo(() => getMonthlyRangeForNow(), []);
  const title = useMemo(() => {
    const s = range.start;
    return `月報  ${s.getFullYear()}/${s.getMonth() + 1}`;
  }, [range]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        setError("ユーザー情報を取得できませんでした");
        setRows([]);
        return;
      }

      const { data, error } = await supabase
        .from("emotions")
        .select("id, created_at, emotions, memo")
        .eq("user_id", userId)
        .gte("created_at", range.start.toISOString())
        .lte("created_at", range.end.toISOString())
        .order("created_at", { ascending: false });
      if (error) throw error;
      setRows(data || []);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }, [range.start, range.end]);

  useEffect(() => {
    load();
  }, [load]);

  const summary = useMemo(() => summarize(rows), [rows]);

  return (
    <View style={styles.reportContainer}>
      <Header title={title} onBack={onBack} />
      {loading ? (
        <ActivityIndicator style={{ marginTop: 16 }} />
      ) : error ? (
        <Text style={styles.error}>取得エラー: {error}</Text>
      ) : (
        <ReportBody summary={summary} rows={rows} />
      )}
    </View>
  );
}

function Header({ title, onBack }) {
  const { styles } = useThemedStyles();

  return (
    <View style={styles.headerRow}>
      <CocolonPressable onPress={onBack} style={styles.backBtn} accessibilityLabel="戻る">
        <Ionicons
          name="chevron-back-outline"
          size={20}
          color="#374151"
        />
        <Text style={styles.backText}>MyWeb</Text>
      </CocolonPressable>
      <Text style={styles.reportTitle}>{title}</Text>
      <View style={{ width: 64 }} />
    </View>
  );
}

function summarize(rows) {
  const count = rows.length;
  const emotionCounts = {};
  for (const r of rows) {
    const arr = Array.isArray(r.emotions) ? r.emotions : [];
    for (const e of arr) emotionCounts[e] = (emotionCounts[e] || 0) + 1;
  }
  const top = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  return { count, top };
}

function ReportBody({ summary, rows }) {
  const { styles } = useThemedStyles();

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>この期間のまとめ</Text>
        <Text style={styles.summaryItem}>入力件数：{summary.count}</Text>
        <Text style={styles.summaryItem}>
          主要感情：
          {summary.top
            .map(([k, v]) => `${k}(${v})`)
            .join(" / ") || "—"}
        </Text>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.dateText}>
              {new Date(item.created_at).toLocaleString("ja-JP", {
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Text style={styles.emotionsText}>
              {(item.emotions || []).join(", ")}
            </Text>
            {!!item.memo && (
              <Text style={styles.memoText}>{item.memo}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ padding: 12, color: "#374151" }}>
            この期間の入力はありません
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

function createStyles(COLORS, ui) {
  const font = ui?.font || {};
  const text = ui?.text || {};

  return StyleSheet.create({
    // ルート
    container: { flex: 1, backgroundColor: COLORS.PANEL_BG },

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

