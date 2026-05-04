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
import AsyncStorage from "@react-native-async-storage/async-storage";

// Supabase
import { supabase } from "../lib/supabase";
import { apiGet, apiPost } from "../lib/apiClient";
import { getTodayQuestionHistory } from "../lib/todayQuestionApi";
import { ANALYSIS_WIRE, SELF_STRUCTURE_WIRE } from "../lib/compat/legacyWireContracts";

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

// 🔴 Unread badge state (screen ⇄ bottom tab)
import { useUnread } from "../UnreadContext";
import { useSubscription } from "../SubscriptionContext";
import { useTutorial } from "../TutorialContext";

// UI (Design System)
import CocolonPressable from "../components/CocolonPressable";
import CocolonButton from "../components/CocolonButton";
import UnreadBadge from "../components/UnreadBadge";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TutorialOverlay, {
  syncTutorialSpotlightTarget,
  waitForTutorialFrames,
} from "../components/TutorialOverlay";
import {
  TUTORIAL_ANALYSIS_COUNTS,
  TUTORIAL_ANALYSIS_REPORTS,
  TUTORIAL_SELF_ANALYSIS_GUIDE,
  TUTORIAL_TOTAL_STEPS,
} from "../tutorial/tutorialScenarioData";

// Home / Piece の見た目に合わせたパネル高さ（だいたいの値）
const PANEL_MIN_HEIGHT = 690;

const ANALYSIS_TUTORIAL_STEP_START = 7;
const ANALYSIS_TUTORIAL_STEP_END = 11;

const SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY = "cocolon:selfStructureLatestSeenVersion";
const SELF_STRUCTURE_HISTORY_FETCH_LIMIT = 200;
const REPORT_READ_STATUS_CHUNK_SIZE = 60;
const ROUTE_HOME = "home";
const ROUTE_EMOTION_ANALYSIS = "emotionAnalysis";
const ROUTE_SELF_STRUCTURE = "selfStructure";
const ROUTE_INPUT_HISTORY = "inputHistory";
const ANALYSIS_READY_LIMIT = 1;
const INITIAL_VISIBLE_REPORT_TYPE = "daily";
const REPORT_TYPE_LABEL = Object.freeze({
  daily: "日報",
  weekly: "週報",
  monthly: "月報",
});

const ANALYSIS_LATEST_REPORT_CACHE_PREFIX = "cocolon:analysisLatestReport";
const ANALYSIS_LATEST_REPORT_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const ANALYSIS_READY_REPORT_TYPES = Object.freeze(["daily", "weekly", "monthly"]);

function normalizeAnalysisReportType(type) {
  const normalized = String(type || "").trim().toLowerCase();
  return ANALYSIS_READY_REPORT_TYPES.includes(normalized) ? normalized : null;
}

async function getAnalysisLatestReportCacheKey(reportType) {
  const normalizedType = normalizeAnalysisReportType(reportType);
  if (!normalizedType) return null;

  let userId = "";
  try {
    const { data } = await supabase.auth.getSession();
    userId = String(data?.session?.user?.id || "").trim();
  } catch {
    userId = "";
  }

  return `${ANALYSIS_LATEST_REPORT_CACHE_PREFIX}:${userId || "anonymous"}:${normalizedType}`;
}

function isUsableCachedAnalysisReport(report, reportType) {
  const normalizedType = normalizeAnalysisReportType(reportType);
  if (!normalizedType || !report || typeof report !== "object") return false;
  const type = String(report?.report_type || normalizedType).trim().toLowerCase();
  return !!report?.id && type === normalizedType;
}

async function readCachedAnalysisLatestReport(reportType) {
  try {
    const key = await getAnalysisLatestReportCacheKey(reportType);
    if (!key) return null;

    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;

    const payload = JSON.parse(raw);
    const savedAt = Number(payload?.saved_at || 0);
    if (!Number.isFinite(savedAt) || Date.now() - savedAt > ANALYSIS_LATEST_REPORT_CACHE_TTL_MS) {
      return null;
    }

    const report = payload?.report || null;
    return isUsableCachedAnalysisReport(report, reportType) ? report : null;
  } catch {
    return null;
  }
}

async function writeCachedAnalysisLatestReport(reportType, report) {
  try {
    if (!isUsableCachedAnalysisReport(report, reportType)) return;
    const key = await getAnalysisLatestReportCacheKey(reportType);
    if (!key) return;

    await AsyncStorage.setItem(
      key,
      JSON.stringify({
        saved_at: Date.now(),
        report,
      })
    );
  } catch {
    // cache write is best-effort only
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

function parseLooseIsoDate(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;

  let normalized = raw;
  if (/^\d{4}-\d{2}-\d{2} \d/.test(normalized)) {
    normalized = normalized.replace(" ", "T");
  }
  if (!(/[zZ]$/.test(normalized) || /[+-]\d{2}:\d{2}$/.test(normalized))) {
    normalized = `${normalized}Z`;
  }

  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function pickLatestIso(values) {
  let latestValue = null;
  let latestTime = -Infinity;

  for (const value of Array.isArray(values) ? values : []) {
    const date = parseLooseIsoDate(value);
    if (!date) continue;
    const time = date.getTime();
    if (time > latestTime) {
      latestTime = time;
      latestValue = value;
    }
  }

  return latestValue;
}

function resolveAnalysisReportUpdatedAt(item) {
  if (!item || typeof item !== "object") return null;
  return (
    item.generated_at ||
    item.updated_at ||
    item.published_at ||
    item.period_end ||
    item.created_at ||
    null
  );
}

function resolveSelfStructureUpdatedAt(item) {
  if (!item || typeof item !== "object") return null;
  return item.generated_at || item.updated_at || item.period_end || item.created_at || null;
}

function resolveTodayQuestionUpdatedAt(item) {
  if (!item || typeof item !== "object") return null;
  return item.edited_at || item.answered_at || item.updated_at || item.created_at || null;
}

function formatLatestUpdateLabel(value) {
  const date = parseLooseIsoDate(value);
  if (!date) return "最新更新日：--";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `最新更新日：${year}/${month}/${day}`;
}

function normalizeSelfStructureMode(mode) {
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

export default function AnalysisScreen({ onOpenPieceDeepDive, navigation, onRefreshTabUnread, route: screenRoute, tabRoute }) {
  const { getFeatureUnread } = useUnread();
  const { ensurePaid, isPaid, loading: subscriptionLoading } = useSubscription();
  const { isTutorialMode, tutorialStep, setTutorialStep } = useTutorial();
  const screenRootRef = useRef(null);
  const { height: windowHeight } = useWindowDimensions();
  const safeInsets = useSafeAreaInsets();
  const tutorialScrollRef = useRef(null);
  const tutorialScrollYRef = useRef(0);
  const [tutorialTargetRect, setTutorialTargetRect] = useState(null);
  const [tutorialOverlayMetrics, setTutorialOverlayMetrics] = useState(null);
  const analysisTitleRef = useRef(null);
  const analysisEmotionRef = useRef(null);
  const analysisSelfStructureRef = useRef(null);
  const analysisReportRef = useRef(null);
  const analysisSelfReportRef = useRef(null);
  const analysisGuideRef = useRef(null);


  // 'home' | 'emotionAnalysis' | 'selfStructure' | 'inputHistory' | 'history' | 'reportHistory' | 'reportView' | 'selfReportHistory' | 'selfReportView' | 'selfReportGenerate' | 'todayQuestionHistory'
  const [route, setRoute] = useState(ROUTE_HOME);
  const [reportType, setReportType] = useState("weekly"); // 'daily' | 'weekly' | 'monthly'
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedSelfReport, setSelectedSelfReport] = useState(null);
  const [reportHistoryBackRoute, setReportHistoryBackRoute] = useState(ROUTE_EMOTION_ANALYSIS);
  const [reportViewBackRoute, setReportViewBackRoute] = useState(ROUTE_EMOTION_ANALYSIS);
  const [historyBackRoute, setHistoryBackRoute] = useState(ROUTE_INPUT_HISTORY);
  const [todayQuestionHistoryBackRoute, setTodayQuestionHistoryBackRoute] = useState(ROUTE_INPUT_HISTORY);
  const [selfReportGenerateBackRoute, setSelfReportGenerateBackRoute] = useState(ROUTE_SELF_STRUCTURE);
  const [selfReportHistoryBackRoute, setSelfReportHistoryBackRoute] = useState(ROUTE_SELF_STRUCTURE);
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
    tabRoute?.params?.openTodayQuestionHistory,
    tabRoute?.params?.openTodayQuestionHistoryAt,
  ]);

  // 未読バッジ（●）用：Analysis（日/週/月）ごとの未読状態
  // 画面内では AnalysisScreen 自身の refreshUnreadBadges() を主判定にする。
  // ただし初期表示は App 側の prefetch / UnreadContext を fallback として使い、
  // 画面を開いた瞬間の NEW 表示遅延を避ける。
  const [unreadByType, setUnreadByType] = useState({
    daily: false,
    weekly: false,
    monthly: false,
    selfStructure: false,
  });
  const [unreadResolved, setUnreadResolved] = useState(false);
  const [selfStructureUnreadResolved, setSelfStructureUnreadResolved] = useState(false);
  const [selfStructureLatestUnread, setSelfStructureLatestUnread] = useState(false);
  const [selfStructureHistoryUnread, setSelfStructureHistoryUnread] = useState(false);

  const prefetchedUnreadByType = useMemo(
    () => ({
      daily: !!getFeatureUnread("Analysis", "daily"),
      weekly: !!getFeatureUnread("Analysis", "weekly"),
      monthly: !!getFeatureUnread("Analysis", "monthly"),
      selfStructure: !!getFeatureUnread("Analysis", "selfStructure"),
    }),
    [getFeatureUnread]
  );

  const [entryMeta, setEntryMeta] = useState({
    emotionLatestDate: null,
    selfStructureLatestDate: null,
    inputHistoryLatestDate: null,
    todayCount: 0,
    weekCount: 0,
    monthCount: 0,
    latestReports: {
      daily: null,
      weekly: null,
      monthly: null,
    },
  });

  const [homeSummariesLoading, setHomeSummariesLoading] = useState(false);

  // (hooks moved to the top of the component)

  const { styles, colors, isDark } = useThemedStyles();

  const isAnalysisTutorialStep =
    !!isTutorialMode &&
    tutorialStep >= ANALYSIS_TUTORIAL_STEP_START &&
    tutorialStep <= ANALYSIS_TUTORIAL_STEP_END;
  const isAnalysisTutorialVisible = isAnalysisTutorialStep && route === "home";

  const handleTutorialScroll = useCallback((e) => {
    tutorialScrollYRef.current =
      e?.nativeEvent?.contentOffset?.y ?? tutorialScrollYRef.current;
  }, []);

  const getTutorialTargetRef = useCallback(() => {
    if (!isAnalysisTutorialVisible) return null;

    switch (tutorialStep) {
      case 8:
      case 9:
      case 10:
        return analysisReportRef;
      case 11:
        return analysisSelfReportRef;
      default:
        return null;
    }
  }, [isAnalysisTutorialVisible, tutorialStep]);

  const tutorialOverlayConfig = useMemo(() => {
    if (!isAnalysisTutorialVisible) return null;

    switch (tutorialStep) {
      case 7:
        return {
          step: 7,
          mode: "info",
          title: "分析画面",
          message:
            "分析画面の説明をします。\n\nここでは分析レポートを閲覧することができます。",
          nextLabel: "日報へ",
          onNext: () => setTutorialStep(8),
          disableSpotlight: true,
          dimOpacity: 0,
        };
      case 8:
        return {
          step: 8,
          mode: "info",
          title: "日報",
          message:
            "日報では、その日の感情入力をもとにした振り返りを見られます。",
          nextLabel: "週報を見る",
          onNext: () => setTutorialStep(9),
          disableSpotlight: true,
          dimOpacity: 0,
          blockBackgroundTouches: false,
        };
      case 9:
        return {
          step: 9,
          mode: "info",
          title: "週報",
          message:
            "週報では、1週間分の感情入力をもとにした振り返りを見られます。",
          nextLabel: "月報を見る",
          onNext: () => setTutorialStep(10),
          disableSpotlight: true,
          dimOpacity: 0,
          blockBackgroundTouches: false,
        };
      case 10:
        return {
          step: 10,
          mode: "info",
          title: "月報",
          message:
            "月報では、感情やカテゴリの流れをもう少し長い期間で振り返れます。",
          nextLabel: "自己分析へ",
          onNext: () => setTutorialStep(11),
          disableSpotlight: true,
          dimOpacity: 0,
          blockBackgroundTouches: false,
        };
      case 11:
        return {
          step: 11,
          mode: "info",
          title: "自己分析レポート",
          message:
            "自己分析レポートでは、日々の感情入力をもとに、自分の考え方や感情の傾向をより深く振り返ることができます。",
          nextLabel: "ピース画面へ",
          onNext: () => {
            setTutorialStep(12);
            requestAnimationFrame(() => {
              try {
                const parent =
                  typeof navigation?.getParent === "function"
                    ? navigation.getParent()
                    : null;
                if (parent && typeof parent.navigate === "function") {
                  parent.navigate("Piece");
                  return;
                }
              } catch {
                // no-op
              }

              try {
                navigation?.navigate?.("Piece");
              } catch {
                // no-op
              }
            });
          },
          cardPlacement: "bottom",
          disableSpotlight: true,
          dimOpacity: 0,
        };
      default:
        return null;
    }
  }, [isAnalysisTutorialVisible, tutorialStep, setTutorialStep, navigation]);

  const syncTutorialTargetRect = useCallback(async () => {
    if (!isAnalysisTutorialVisible || tutorialOverlayConfig?.disableSpotlight) {
      return null;
    }

    const targetRef = getTutorialTargetRef();
    if (!targetRef || !screenRootRef.current) {
      return null;
    }

    return syncTutorialSpotlightTarget({
      enabled: isAnalysisTutorialVisible,
      targetRef,
      rootRef: screenRootRef,
      scrollRef: tutorialScrollRef,
      currentScrollYRef: tutorialScrollYRef,
      overlayMetrics: tutorialOverlayMetrics,
      windowHeight,
      safeInsets,
      cardPlacement: tutorialOverlayConfig?.cardPlacement || "bottom",
      measureOptions: {
        maxAttempts: 3,
        settleFrames: 1,
      },
    });
  }, [
    getTutorialTargetRef,
    isAnalysisTutorialVisible,
    safeInsets,
    tutorialStep,
    tutorialOverlayConfig?.cardPlacement,
    tutorialOverlayConfig?.disableSpotlight,
    tutorialOverlayMetrics,
    windowHeight,
  ]);

  // In tutorial mode, keep Analysis on "home" during the Analysis steps.
  useEffect(() => {
    if (!isAnalysisTutorialStep) return;
    if (route === "home") return;

    setSelectedReport(null);
    setSelectedSelfReport(null);
    setRoute("home");
  }, [isAnalysisTutorialStep, route]);

  useLayoutEffect(() => {
    if (!isAnalysisTutorialVisible) {
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
    entryMeta.emotionLatestDate,
    entryMeta.inputHistoryLatestDate,
    entryMeta.selfStructureLatestDate,
    isAnalysisTutorialVisible,
    tutorialStep,
    tutorialOverlayMetrics,
    syncTutorialTargetRect,
  ]);

  // ------------------------------------------------------------
  // Tab reselect → Analysis "home" に戻す
  // - Analysis は画面内で route state を持っているため、
  //   同じタブを再タップしたときにメイン（home）へ戻す。
  // ------------------------------------------------------------
  const routeRef = useRef(route);
  const unreadRefreshSeqRef = useRef(0);
  const menuMetaRefreshSeqRef = useRef(0);
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

  // レポートを開いた時に既読登録（report_reads に upsert）
  const markReportRead = useCallback(async (report) => {
    const reportId = report?.id ? String(report.id) : null;
    if (!reportId) return;

    try {
      await apiPost("/report-reads/mark", {
        report_id: reportId,
        report_table: ANALYSIS_WIRE.reportFamily.table,
        report_scope: ANALYSIS_WIRE.reportFamily.scope,
      });
    } catch (e) {
      console.warn("AnalysisScreen: failed to mark report read", e);
    }
  }, []);

  const fetchReportReadIdSet = useCallback(async (reportIds) => {
    const ids = Array.from(
      new Set(
        (Array.isArray(reportIds) ? reportIds : [])
          .map((id) => String(id || "").trim())
          .filter(Boolean)
      )
    );
    if (ids.length === 0) return new Set();

    const readSet = new Set();
    for (let i = 0; i < ids.length; i += REPORT_READ_STATUS_CHUNK_SIZE) {
      const chunk = ids.slice(i, i + REPORT_READ_STATUS_CHUNK_SIZE);
      if (chunk.length === 0) continue;
      const query = chunk
        .map((id) => `report_ids=${encodeURIComponent(id)}`)
        .join("&");
      const json = await apiGet(`/report-reads/status?${query}`);
      const readIds = Array.isArray(json?.read_ids) ? json.read_ids : [];
      readIds.forEach((id) => {
        const normalized = String(id || "").trim();
        if (normalized) readSet.add(normalized);
      });
    }
    return readSet;
  }, []);

  const getSelfStructureLatestSeenStorageKey = useCallback(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const userId = String(data?.session?.user?.id || "").trim();
      return userId
        ? `${SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY}:${userId}`
        : SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY;
    } catch {
      return SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY;
    }
  }, []);

  const fetchSelfStructureLatestUnread = useCallback(async () => {
    if (subscriptionLoading || !isPaid) return false;

    const storageKey = await getSelfStructureLatestSeenStorageKey();
    const [statusJson, seenVersionKey] = await Promise.all([
      apiGet(SELF_STRUCTURE_WIRE.routes.latestStatus),
      AsyncStorage.getItem(storageKey),
    ]);

    const versionKey = String(statusJson?.version_key || "").trim();
    const hasVisibleContent = !!statusJson?.has_visible_content;
    const seenKey = String(seenVersionKey || "").trim();

    if (!versionKey || !hasVisibleContent) return false;
    return versionKey !== seenKey;
  }, [getSelfStructureLatestSeenStorageKey, isPaid, subscriptionLoading]);

  const fetchSelfStructureHistoryUnread = useCallback(async () => {
    if (subscriptionLoading || !isPaid) return false;

    const historyJson = await apiGet(
      `${SELF_STRUCTURE_WIRE.routes.reportsHistoryBase}?report_type=monthly&limit=${SELF_STRUCTURE_HISTORY_FETCH_LIMIT}&offset=0`
    );
    const items = Array.isArray(historyJson?.items) ? historyJson.items : [];
    const ids = items
      .map((item) => String(item?.id || "").trim())
      .filter(Boolean);

    if (ids.length === 0) return false;

    const readSet = await fetchReportReadIdSet(ids);
    return ids.some((id) => !readSet.has(id));
  }, [fetchReportReadIdSet, isPaid, subscriptionLoading]);

  const requestParentTabUnreadRefresh = useCallback(async () => {
    try {
      await onRefreshTabUnread?.();
    } catch (e) {
      console.warn("AnalysisScreen: failed to request parent Analysis unread refresh", e);
    }
  }, [onRefreshTabUnread]);

  const markSelfStructureLatestSeen = useCallback(
    async (versionKey) => {
      const normalized = String(versionKey || "").trim();
      if (!normalized) return;

      try {
        const storageKey = await getSelfStructureLatestSeenStorageKey();
        await AsyncStorage.setItem(storageKey, normalized);
      } catch {
        // noop
      }

      setSelfStructureLatestUnread(false);
      setUnreadByType((prev) => ({
        ...prev,
        selfStructure: !!selfStructureHistoryUnread,
      }));
      await requestParentTabUnreadRefresh();
    },
    [getSelfStructureLatestSeenStorageKey, selfStructureHistoryUnread, requestParentTabUnreadRefresh]
  );

  // Analysis（日/週/月）の未読状態を更新
  const refreshUnreadBadges = useCallback(async () => {
    const refreshSeq = ++unreadRefreshSeqRef.current;
    const isStale = () => refreshSeq !== unreadRefreshSeqRef.current;

    const selfStructureTask = Promise.all([
      fetchSelfStructureLatestUnread().catch((e) => {
        console.warn("AnalysisScreen: failed to refresh latest self-structure unread badge", e);
        return false;
      }),
      fetchSelfStructureHistoryUnread().catch((e) => {
        console.warn("AnalysisScreen: failed to refresh self-structure history unread badge", e);
        return false;
      }),
    ])
      .then(([nextSelfStructureLatestUnread, nextSelfStructureHistoryUnread]) => {
        if (isStale()) return;

        const effectiveSelfStructureUnread =
          !!nextSelfStructureLatestUnread || !!nextSelfStructureHistoryUnread;

        setSelfStructureLatestUnread(!!nextSelfStructureLatestUnread);
        setSelfStructureHistoryUnread(!!nextSelfStructureHistoryUnread);
        setUnreadByType((prev) => ({
          ...prev,
          selfStructure: effectiveSelfStructureUnread,
        }));
        setSelfStructureUnreadResolved(true);
      })
      .catch(() => {
        // noop
      });

    try {
      const query = new URLSearchParams({
        limit: "1",
        include_self_structure: "false",
      }).toString();

      const json = await apiGet(`${ANALYSIS_WIRE.routes.reportsUnreadStatus}?${query}`);
      const unread = json?.unread_by_type || {};

      if (isStale()) return;

      setUnreadByType((prev) => ({
        ...prev,
        daily: !!unread?.daily,
        weekly: !!unread?.weekly,
        monthly: !!unread?.monthly,
      }));
      setUnreadResolved(true);
    } catch (e) {
      if (isStale()) return;
      console.warn("AnalysisScreen: failed to refresh unread badges", e);
    }

    void selfStructureTask;
    await requestParentTabUnreadRefresh();
  }, [fetchSelfStructureHistoryUnread, fetchSelfStructureLatestUnread, requestParentTabUnreadRefresh]);

  const fetchLatestReadyReport = useCallback(async (type) => {
    const normalizedType = normalizeAnalysisReportType(type);
    if (!normalizedType) return null;

    try {
      const json = await apiGet(
        `${ANALYSIS_WIRE.routes.reportsReady}?report_type=${encodeURIComponent(
          normalizedType
        )}&limit=${ANALYSIS_READY_LIMIT}&offset=0&include_body=true`
      );
      const items = extractReadyItems(json);
      const latest = items[0] || null;
      if (latest) {
        void writeCachedAnalysisLatestReport(normalizedType, latest);
      }
      return latest || null;
    } catch (e) {
      console.warn("AnalysisScreen: failed to fetch latest ready report", normalizedType, e);
      return null;
    }
  }, []);

  const refreshHomeSummaries = useCallback(
    async ({ showLoading = true, prioritizeVisibleReport = true } = {}) => {
      const refreshSeq = showLoading
        ? ++menuMetaRefreshSeqRef.current
        : menuMetaRefreshSeqRef.current;
      const isStale = () => refreshSeq !== menuMetaRefreshSeqRef.current;

      if (showLoading) {
        setHomeSummariesLoading(true);
      }

      const applyLatestReport = (type, report) => {
        if (isStale()) return;

        setEntryMeta((prev) => {
          const latestReports = {
            ...(prev?.latestReports || {}),
            [type]: report || null,
          };

          return {
            ...prev,
            emotionLatestDate: pickLatestIso([
              resolveAnalysisReportUpdatedAt(latestReports.daily),
              resolveAnalysisReportUpdatedAt(latestReports.weekly),
              resolveAnalysisReportUpdatedAt(latestReports.monthly),
            ]),
            latestReports,
          };
        });
      };

      const primeLatestReportFromCache = async (type) => {
        const cachedReport = await readCachedAnalysisLatestReport(type);
        if (!cachedReport || isStale()) return;
        applyLatestReport(type, cachedReport);
      };

      const refreshReportType = async (type) => {
        try {
          const latestReport = await fetchLatestReadyReport(type);
          applyLatestReport(type, latestReport);
        } catch (e) {
          if (!isStale()) {
            console.warn(`AnalysisScreen: failed to refresh ${type} latest report`, e);
          }
        }
      };

      const refreshSelfLatestStatus = async () => {
        try {
          const selfLatestStatus = await apiGet(SELF_STRUCTURE_WIRE.routes.latestStatus);
          if (isStale()) return;

          setEntryMeta((prev) => ({
            ...prev,
            selfStructureLatestDate: pickLatestIso([
              selfLatestStatus?.has_visible_content
                ? resolveSelfStructureUpdatedAt(selfLatestStatus)
                : null,
            ]),
          }));
        } catch (e) {
          if (!isStale()) {
            console.warn("AnalysisScreen: failed to refresh self-structure latest status", e);
          }
        }
      };

      const refreshInputSummary = async () => {
        const [homeSummaryRes, todayQuestionRes] = await Promise.allSettled([
          apiGet(ANALYSIS_WIRE.routes.homeSummary),
          getTodayQuestionHistory({ limit: 1, offset: 0 }),
        ]);

        if (isStale()) return;

        const homeSummary = homeSummaryRes.status === "fulfilled" ? homeSummaryRes.value || {} : {};
        if (homeSummaryRes.status === "rejected") {
          console.warn("AnalysisScreen: failed to refresh home summary", homeSummaryRes.reason);
        }
        const inputStatus = homeSummary?.input_status || {};

        const todayQuestionItems =
          todayQuestionRes.status === "fulfilled" && Array.isArray(todayQuestionRes.value?.items)
            ? todayQuestionRes.value.items
            : [];
        if (todayQuestionRes.status === "rejected") {
          console.warn("AnalysisScreen: failed to refresh today question history", todayQuestionRes.reason);
        }

        const todayCount = Number(inputStatus?.today_count ?? 0);
        const weekCount = Number(inputStatus?.week_count ?? 0);
        const monthCount = Number(inputStatus?.month_count ?? 0);

        setEntryMeta((prev) => ({
          ...prev,
          inputHistoryLatestDate: pickLatestIso([
            inputStatus?.last_input_at,
            resolveTodayQuestionUpdatedAt(todayQuestionItems[0]),
          ]),
          todayCount: Number.isFinite(todayCount) ? todayCount : 0,
          weekCount: Number.isFinite(weekCount) ? weekCount : 0,
          monthCount: Number.isFinite(monthCount) ? monthCount : 0,
        }));
      };

      const reportTypes = ["daily", "weekly", "monthly"];

      try {
        if (showLoading && prioritizeVisibleReport) {
          await primeLatestReportFromCache(INITIAL_VISIBLE_REPORT_TYPE);
          if (isStale()) return;

          await refreshReportType(INITIAL_VISIBLE_REPORT_TYPE);
          if (isStale()) return;

          await Promise.allSettled([
            ...reportTypes
              .filter((type) => type !== INITIAL_VISIBLE_REPORT_TYPE)
              .map((type) => refreshReportType(type)),
            refreshSelfLatestStatus(),
            refreshInputSummary(),
          ]);
        } else {
          await Promise.allSettled([
            ...reportTypes.map((type) => refreshReportType(type)),
            refreshSelfLatestStatus(),
            refreshInputSummary(),
          ]);
        }
      } finally {
        if (!isStale() && showLoading) {
          setHomeSummariesLoading(false);
        }
      }
    },
    [fetchLatestReadyReport]
  );

  const openReportHistory = (type, backRoute = ROUTE_EMOTION_ANALYSIS) => {
    setReportHistoryBackRoute(backRoute);
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
          "自己分析レポート",
          "自己分析レポートはPlusプラン以上で利用できます。\n\nPlusプラン以上で本文の閲覧が可能になります。",
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
    (nextMode = "standard", backRoute = ROUTE_SELF_STRUCTURE) => {
      setSelfReportGenerateMode(normalizeSelfStructureMode(nextMode));
      openSelfStructureRoute({
        targetRoute: "selfReportGenerate",
        backRoute,
      });
    },
    [openSelfStructureRoute]
  );

  const openSelfReportHistory = useCallback(
    (backRoute = ROUTE_SELF_STRUCTURE) => {
      const nextBackRoute = backRoute || ROUTE_SELF_STRUCTURE;
      setSelfReportHistoryBackRoute(nextBackRoute);
      openSelfStructureRoute({
        targetRoute: "selfReportHistory",
        backRoute: nextBackRoute,
      });
    },
    [openSelfStructureRoute]
  );

  useEffect(() => {
    const shouldOpenReportHistory = !!(
      tabRoute?.params?.openReportHistory || screenRoute?.params?.openReportHistory
    );
    const nextReportType = String(
      tabRoute?.params?.openReportHistoryType || screenRoute?.params?.openReportHistoryType || ""
    ).trim().toLowerCase();

    if (shouldOpenReportHistory && ["daily", "weekly", "monthly"].includes(nextReportType)) {
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

  const openSelfReportView = useCallback((report) => {
    setSelectedSelfReport(report || null);
    setRoute("selfReportView");
  }, []);

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
    const shouldRefreshMenuState =
      route === ROUTE_HOME ||
      route === ROUTE_EMOTION_ANALYSIS ||
      route === ROUTE_SELF_STRUCTURE ||
      route === ROUTE_INPUT_HISTORY;

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

  const emotionAnalysisUnread = unreadResolved
    ? !!(unreadByType.daily || unreadByType.weekly || unreadByType.monthly)
    : !!(
        prefetchedUnreadByType.daily ||
        prefetchedUnreadByType.weekly ||
        prefetchedUnreadByType.monthly
      );
  const selfStructureUnread =
    !subscriptionLoading && isPaid
      ? selfStructureUnreadResolved
        ? !!(selfStructureLatestUnread || selfStructureHistoryUnread)
        : !!prefetchedUnreadByType.selfStructure
      : false;
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
            tutorialRefs={{
              titleRef: analysisTitleRef,
              emotionRef: analysisEmotionRef,
              selfStructureRef: analysisSelfStructureRef,
              reportRef: analysisReportRef,
              selfReportRef: analysisSelfReportRef,
              guideRef: analysisGuideRef,
            }}
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

