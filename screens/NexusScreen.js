import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CocolonButton from "../components/CocolonButton";
import CocolonPressable from "../components/CocolonPressable";
import { ScreenUnreadBadge } from "../components/UnreadBadge";
import TutorialOverlay, {
  syncTutorialSpotlightTarget,
  waitForTutorialFrames,
} from "../components/TutorialOverlay";
import { useTutorial } from "../TutorialContext";
import { useUnread } from "../UnreadContext";
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import {
  getNexusResonancePieces,
  getNexusEmotionLog,
  getNexusEmotionLogUnreadStatus,
  getNexusEmotionRanking,
  getNexusRecommendUsers,
  getNexusPieceDetail,
  getNexusPieces,
  getNexusPiecesUnreadStatus,
  markNexusEmotionLogFeedRead,
} from "../lib/nexusApi";
import { readShareCode } from "../lib/compat/legacyWireContracts";
import NexusPieceCard from "./nexus/NexusPieceCard";

const TABS = [
  { key: "piece", label: "投稿" },
  { key: "emotion_log", label: "感情通知" },
  { key: "recommend", label: "おすすめ" },
  { key: "history", label: "履歴" },
];

const PIECE_TUTORIAL_STEP_START = 12;
const PIECE_TUTORIAL_STEP_END = 15;
const TUTORIAL_TOTAL_STEPS = 21;

const STRENGTH_LABEL = {
  weak: "弱",
  medium: "中",
  strong: "強",
};

function emotionTint(emotion) {
  switch (emotion) {
    case "喜び":
      return { bg: "rgba(16,185,129,0.12)", text: "#065F46" };
    case "悲しみ":
      return { bg: "rgba(99,102,241,0.12)", text: "#3730A3" };
    case "怒り":
      return { bg: "rgba(239,68,68,0.12)", text: "#7F1D1D" };
    case "不安":
      return { bg: "rgba(56,189,248,0.12)", text: "#0369A1" };
    case "平穏":
      return { bg: "rgba(234,179,8,0.12)", text: "#A16207" };
    default:
      return { bg: "rgba(107,114,128,0.12)", text: "#374151" };
  }
}

function normalizeEmotionRankingItems(json) {
  const items = Array.isArray(json?.items)
    ? json.items
    : Array.isArray(json?.rows)
    ? json.rows
    : Array.isArray(json)
    ? json
    : [];
  return items.slice(0, 5).map((item, index) => ({
    label:
      String(
        item?.emotion_label ||
          item?.emotion ||
          item?.emotion_type ||
          item?.label ||
          item?.name ||
          `感情 ${index + 1}`
      ).trim() || `感情 ${index + 1}`,
    value: Number(item?.count ?? item?.total ?? item?.value ?? item?.score ?? 0) || 0,
  }));
}

function normalizeEmotionLogItems(json) {
  const rows = Array.isArray(json?.items)
    ? json.items
    : Array.isArray(json?.data)
    ? json.data
    : Array.isArray(json)
    ? json
    : [];
  return rows.map((row, index) => {
    const items = Array.isArray(row?.items)
      ? row.items
      : Array.isArray(row?.emotions)
      ? row.emotions
      : [];
    const ownerName =
      String(
        row?.ownerName || row?.owner_name || row?.ownerNameLabel || ""
      ).trim() || "ユーザー";
    const timeLabel =
      String(row?.timeLabel || "").trim() ||
      formatDateLabel(row?.created_at || row?.createdAt || null);
    return {
      id: String(row?.id || `emotion-log-${index}`),
      ownerName,
      timeLabel,
      createdAt: String(row?.createdAt || row?.created_at || "").trim() || null,
      items: items.map((item) => ({
        type: String(item?.type || item?.emotion || "").trim() || "感情",
        strength: String(item?.strength || "").trim(),
      })),
    };
  });
}

function normalizeRecommendUsers(json) {
  const users = Array.isArray(json?.users)
    ? json.users
    : Array.isArray(json?.items)
    ? json.items
    : Array.isArray(json)
    ? json
    : [];
  return users.map((user, index) => ({
    id: String(user?.id || user?.user_id || `user-${index}`),
    displayName:
      String(
        user?.display_name || user?.name || readShareCode(user, "") || "ユーザー"
      ).trim() || "ユーザー",
    shareCode: readShareCode(user, null),
  }));
}

function normalizeSavedPieces(json) {
  const items = Array.isArray(json?.items)
    ? json.items
    : Array.isArray(json)
    ? json
    : [];
  return items.map((item, index) => ({
    qInstanceId: String(item?.q_instance_id || `saved-${index}`),
    title: String(item?.title || "—").trim() || "—",
    ownerDisplayName:
      String(item?.owner_display_name || "ユーザー").trim() || "ユーザー",
    ownerUserId: String(item?.owner_user_id || "").trim() || null,
    savedAt: String(item?.saved_at || "").trim(),
  }));
}

function normalizeTutorialPieceItems(items) {
  const rows = Array.isArray(items) ? items : [];
  return rows.map((item, index) => ({
    q_instance_id:
      String(item?.q_instance_id || "").trim() ||
      `piece:tutorial-${index}`,
    source_type: "emotion_generated",
    owner: {
      user_id:
        String(item?.owner_user_id || item?.owner?.user_id || "").trim() ||
        `tutorial-user-${index}`,
      display_name:
        String(
          item?.display_name || item?.owner?.display_name || "ユーザー"
        ).trim() || "ユーザー",
      share_code: readShareCode(item, null) || readShareCode(item?.owner, null),
    },
    question: {
      q_key:
        String(item?.q_key || item?.question?.q_key || "").trim() ||
        `tutorial-q-${index}`,
      title:
        String(item?.title || item?.question?.title || "Piece").trim() ||
        "Piece",
    },
    body: String(item?.body || "").trim(),
    created_at: String(item?.created_at || "").trim() || null,
    metrics: {
      views: Number(item?.views || item?.metrics?.views || 0) || 0,
      resonances:
        Number(item?.resonances || item?.metrics?.resonances || 0) || 0,
    },
    viewer_state: {
      is_new:
        item?.viewer_state?.is_new === true || item?.is_new === true,
    },
    is_tutorial: true,
  }));
}

function formatDateLabel(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "";
  try {
    return d.toLocaleString("ja-JP", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function hasRouteNameInState(state, routeName) {
  if (!state) return false;

  const routeNames = state?.routeNames;
  if (Array.isArray(routeNames) && routeNames.includes(routeName)) return true;

  const routes = state?.routes;
  if (Array.isArray(routes)) {
    for (const r of routes) {
      if (r?.state && hasRouteNameInState(r.state, routeName)) return true;
    }
  }
  return false;
}

function resolvePieceLibraryRouteName(navigation) {
  const candidates = ["PieceLibrary", "PieceLibraryScreen"];

  const root = navigation?.getRootState?.();
  const local = navigation?.getState?.();

  for (const name of candidates) {
    if (hasRouteNameInState(root, name) || hasRouteNameInState(local, name)) {
      return name;
    }
  }
  return "PieceLibrary";
}

export default function NexusScreen({ navigation }) {
  const { colors, themeName } = useTheme();
  const { getFeatureUnread, setUnread } = useUnread();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";
  const { height: windowHeight } = useWindowDimensions();
  const safeInsets = useSafeAreaInsets();
  const {
    isTutorialMode,
    tutorialStep,
    tutorialPieces,
    setTutorialStep,
    ensureTutorialPiecesSeed,
  } = useTutorial();

  const screenRootRef = useRef(null);
  const scrollRef = useRef(null);
  const currentScrollYRef = useRef(0);
  const titleRef = useRef(null);
  const pieceTabRef = useRef(null);
  const tutorialCardRef = useRef(null);
  const tutorialButtonRef = useRef(null);
  const [tutorialTargetRect, setTutorialTargetRect] = useState(null);
  const [tutorialOverlayMetrics, setTutorialOverlayMetrics] = useState(null);

  const [activeTab, setActiveTab] = useState("piece");

  const tutorialPieceItems = useMemo(
    () => normalizeTutorialPieceItems(tutorialPieces),
    [tutorialPieces]
  );
  const isNexusTutorialStep =
    !!isTutorialMode &&
    tutorialStep >= PIECE_TUTORIAL_STEP_START &&
    tutorialStep <= PIECE_TUTORIAL_STEP_END;

  const [rankingState, setRankingState] = useState({ loading: true, items: [] });
  const [pieceState, setPieceState] = useState({
    loading: true,
    items: [],
    error: "",
  });
  const [emotionLogState, setEmotionLogState] = useState({
    loading: false,
    loaded: false,
    items: [],
    error: "",
  });
  const [recommendState, setRecommendState] = useState({
    loading: false,
    loaded: false,
    users: [],
    error: "",
  });
  const [historyState, setHistoryState] = useState({
    loading: false,
    loadedModes: {},
    resonances: [],
    error: "",
  });

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const prefetchedPieceUnread = !!getFeatureUnread("Piece", "piecesNew");
  const prefetchedEmotionLogUnread = !!getFeatureUnread("EmotionLog", "feed");
  const pieceHasUnread = Array.isArray(pieceState.items)
    ? pieceState.items.some((item) => item?.viewer_state?.is_new === true)
    : false;
  const pieceUnreadResolved = !pieceState.loading && !pieceState.error;
  const pieceTabUnread = pieceUnreadResolved
    ? pieceHasUnread
    : prefetchedPieceUnread || pieceHasUnread;
  const emotionLogTabUnread = prefetchedEmotionLogUnread;

  const latestEmotionLogCreatedAt = useMemo(() => {
    if (!Array.isArray(emotionLogState.items) || emotionLogState.items.length <= 0) {
      return null;
    }

    let latest = null;
    let latestTime = -Infinity;

    emotionLogState.items.forEach((item) => {
      const raw = String(item?.createdAt || "").trim();
      if (!raw) return;
      const date = new Date(raw);
      if (Number.isNaN(date.getTime())) return;
      const time = date.getTime();
      if (time > latestTime) {
        latestTime = time;
        latest = raw;
      }
    });

    return latest;
  }, [emotionLogState.items]);

  const refreshPieceUnreadState = useCallback(async () => {
    if (isTutorialMode) {
      setUnread("Piece", "piecesNew", false);
      return false;
    }

    try {
      const json = await getNexusPiecesUnreadStatus();
      const hasUnread =
        typeof json?.has_unread === "boolean"
          ? json.has_unread
          : typeof json?.hasUnread === "boolean"
          ? json.hasUnread
          : false;
      setUnread("Piece", "piecesNew", !!hasUnread);
      return !!hasUnread;
    } catch (e) {
      console.warn("NexusScreen: refreshPieceUnreadState failed", e);
      return null;
    }
  }, [isTutorialMode, setUnread]);

  const refreshEmotionLogUnreadState = useCallback(async () => {
    if (isTutorialMode) {
      setUnread("EmotionLog", "feed", false);
      setUnread("EmotionLog", "requests", false);
      return { feed: false, requests: false };
    }

    try {
      const json = await getNexusEmotionLogUnreadStatus();
      const nextFeed = !!json?.feed_unread;
      const nextRequests = !!json?.requests_unread;
      setUnread("EmotionLog", "feed", nextFeed);
      setUnread("EmotionLog", "requests", nextRequests);
      return { feed: nextFeed, requests: nextRequests };
    } catch (e) {
      console.warn("NexusScreen: refreshEmotionLogUnreadState failed", e);
      return null;
    }
  }, [isTutorialMode, setUnread]);

  const refreshNexusUnreadState = useCallback(async () => {
    await Promise.all([
      refreshPieceUnreadState(),
      refreshEmotionLogUnreadState(),
    ]);
  }, [refreshEmotionLogUnreadState, refreshPieceUnreadState]);


  const loadRanking = useCallback(async () => {
    if (isTutorialMode) {
      setRankingState({ loading: false, items: [] });
      return;
    }

    try {
      const json = await getNexusEmotionRanking(3, "day");
      setRankingState({
        loading: false,
        items: normalizeEmotionRankingItems(json),
      });
    } catch (e) {
      console.warn("NexusScreen: loadRanking failed", e);
      setRankingState({ loading: false, items: [] });
    }
  }, [isTutorialMode]);

  const loadPieces = useCallback(async () => {
    if (isTutorialMode) {
      setPieceState({
        loading: false,
        items: tutorialPieceItems,
        error: "",
      });
      return;
    }

    setPieceState((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const json = await getNexusPieces({
        sort: "latest",
        limit: 20,
        following_only: true,
      });
      const items = Array.isArray(json?.items) ? json.items : [];
      setPieceState({ loading: false, items, error: "" });
    } catch (e) {
      console.warn("NexusScreen: loadPieces failed", e);
      setPieceState({
        loading: false,
        items: [],
        error: String(e?.message || "Pieceを読み込めませんでした。"),
      });
    }
  }, [isTutorialMode, tutorialPieceItems]);

  const loadEmotionLog = useCallback(async () => {
    if (isTutorialMode) {
      setEmotionLogState({
        loading: false,
        loaded: true,
        items: [],
        error: "",
      });
      return;
    }

    setEmotionLogState((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const json = await getNexusEmotionLog(20);
      setEmotionLogState({
        loading: false,
        loaded: true,
        items: normalizeEmotionLogItems(json),
        error: "",
      });
    } catch (e) {
      console.warn("NexusScreen: loadEmotionLog failed", e);
      setEmotionLogState({
        loading: false,
        loaded: true,
        items: [],
        error: String(e?.message || "感情通知を読み込めませんでした。"),
      });
    }
  }, [isTutorialMode]);

  const loadRecommend = useCallback(async () => {
    if (isTutorialMode) {
      setRecommendState({
        loading: false,
        loaded: true,
        users: [],
        error: "",
      });
      return;
    }

    setRecommendState((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const usersJson = await getNexusRecommendUsers(8);
      setRecommendState({
        loading: false,
        loaded: true,
        users: normalizeRecommendUsers(usersJson),
        error: "",
      });
    } catch (e) {
      console.warn("NexusScreen: loadRecommend failed", e);
      setRecommendState({
        loading: false,
        loaded: true,
        users: [],
        error: String(e?.message || "おすすめを読み込めませんでした。"),
      });
    }
  }, [isTutorialMode]);

  const loadHistory = useCallback(
    async () => {
      const safeMode = "resonances";
      if (isTutorialMode) {
        setHistoryState((prev) => ({
          ...prev,
          loading: false,
          loadedModes: { ...(prev.loadedModes || {}), [safeMode]: true },
          [safeMode]: [],
          error: "",
        }));
        return;
      }

      setHistoryState((prev) => ({ ...prev, loading: true, error: "" }));
      try {
        const json = await getNexusResonancePieces(20);
        const normalized = normalizeSavedPieces(json);
        setHistoryState((prev) => ({
          ...prev,
          loading: false,
          loadedModes: { ...(prev.loadedModes || {}), [safeMode]: true },
          [safeMode]: normalized,
          error: "",
        }));
      } catch (e) {
        console.warn("NexusScreen: loadHistory failed", e);
        setHistoryState((prev) => ({
          ...prev,
          loading: false,
          loadedModes: { ...(prev.loadedModes || {}), [safeMode]: true },
          [safeMode]: [],
          error: String(e?.message || "履歴を読み込めませんでした。"),
        }));
      }
    },
    [isTutorialMode]
  );

  useEffect(() => {
    void loadRanking();
    void loadPieces();
  }, [loadRanking, loadPieces]);

  useEffect(() => {
    if (!isTutorialMode) return;
    void ensureTutorialPiecesSeed();
    if (activeTab !== "piece") {
      setActiveTab("piece");
    }
  }, [activeTab, ensureTutorialPiecesSeed, isTutorialMode]);

  useEffect(() => {
    if (isTutorialMode) {
      setPieceState({
        loading: false,
        items: tutorialPieceItems,
        error: "",
      });
    }
  }, [isTutorialMode, tutorialPieceItems]);

  useEffect(() => {
    if (isTutorialMode) {
      setUnread("Piece", "piecesNew", false);
      return;
    }
    if (pieceState.loading || pieceState.error) return;

    setUnread("Piece", "piecesNew", pieceHasUnread);
  }, [
    isTutorialMode,
    pieceHasUnread,
    pieceState.error,
    pieceState.loading,
    setUnread,
  ]);

  useEffect(() => {
    if (activeTab !== "emotion_log") return;
    if (!emotionLogState.loaded || emotionLogState.loading || emotionLogState.error) return;
    if (!prefetchedEmotionLogUnread || !latestEmotionLogCreatedAt) return;
    let cancelled = false;

    (async () => {
      try {
        await markNexusEmotionLogFeedRead(latestEmotionLogCreatedAt);
        if (cancelled) return;
        setUnread("EmotionLog", "feed", false);
      } catch (e) {
        console.warn("NexusScreen: failed to mark emotion log feed read", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    activeTab,
    emotionLogState.error,
    emotionLogState.loaded,
    emotionLogState.loading,
    latestEmotionLogCreatedAt,
    prefetchedEmotionLogUnread,
    setUnread,
  ]);

  useEffect(() => {
    void refreshNexusUnreadState();
  }, [refreshNexusUnreadState]);

  useEffect(() => {
    if (!navigation?.addListener) return undefined;
    const unsubscribe = navigation.addListener("focus", () => {
      void refreshNexusUnreadState();
    });
    return unsubscribe;
  }, [navigation, refreshNexusUnreadState]);

  useEffect(() => {
    if (activeTab === "emotion_log") {
      void loadEmotionLog();
    }
  }, [activeTab, loadEmotionLog]);

  useEffect(() => {
    if (activeTab === "recommend" && !recommendState.loaded && !recommendState.loading) {
      void loadRecommend();
    }
    if (
      activeTab === "history" &&
      !historyState.loadedModes?.resonances &&
      !historyState.loading
    ) {
      void loadHistory();
    }
  }, [
    activeTab,
    historyState.loadedModes,
    historyState.loading,
    loadHistory,
    loadRecommend,
    recommendState.loaded,
    recommendState.loading,
  ]);

  const handleOpenOwner = useCallback(
    (userId) => {
      if (isTutorialMode) return;
      const viewedUserId = String(userId || "").trim();
      if (!viewedUserId) return;
      try {
        navigation?.navigate?.("Account", { viewedUserId });
      } catch {
        // noop
      }
    },
    [isTutorialMode, navigation]
  );

  const handleOpenTutorialPieces = useCallback(() => {
    void ensureTutorialPiecesSeed();
    setTutorialStep((prev) => (prev < 16 ? 16 : prev));

    const routeName = resolvePieceLibraryRouteName(navigation);
    try {
      navigation?.navigate?.(routeName, {
        tutorialOpenAt: Date.now(),
      });
    } catch {
      Alert.alert(
        "Piece一覧を開けません",
        "Piece一覧画面が navigation に未登録の可能性があります。"
      );
    }
  }, [ensureTutorialPiecesSeed, navigation, setTutorialStep]);

  const handleOpenPiece = useCallback(
    async (item) => {
      if (isTutorialMode) {
        setDetailVisible(true);
        setDetailLoading(false);
        setDetailData({
          title:
            item?.question?.title || item?.title || item?.question_title || "Piece",
          body: item?.body || "",
          views: Number(item?.metrics?.views || item?.views || 0) || 0,
          resonances:
            Number(item?.metrics?.resonances || item?.resonances || 0) || 0,
        });
        return;
      }

      const qInstanceId = String(
        item?.q_instance_id || item?.qInstanceId || ""
      ).trim();
      if (!qInstanceId) return;

      setDetailVisible(true);
      setDetailLoading(true);
      try {
        const detail = await getNexusPieceDetail(qInstanceId, {
          markViewed: true,
        });
        setDetailData(detail && typeof detail === "object" ? detail : null);
        setPieceState((prev) => ({
          ...prev,
          items: Array.isArray(prev.items)
            ? prev.items.map((row) => {
                if (String(row?.q_instance_id || "") !== qInstanceId) return row;
                return {
                  ...row,
                  viewer_state: { ...(row?.viewer_state || {}), is_new: false },
                  metrics: {
                    ...(row?.metrics || {}),
                    views: Number(detail?.views || row?.metrics?.views || 0) || 0,
                    resonances:
                      Number(detail?.resonances || row?.metrics?.resonances || 0) ||
                      0,
                  },
                };
              })
            : prev.items,
        }));
      } catch (e) {
        console.warn("NexusScreen: load piece detail failed", e);
        setDetailData({
          title: item?.question?.title || item?.title || "Piece",
          body: item?.body || "",
          views: Number(item?.metrics?.views || 0) || 0,
          resonances: Number(item?.metrics?.resonances || 0) || 0,
        });
      } finally {
        setDetailLoading(false);
      }
    },
    [isTutorialMode]
  );

  const getTutorialTargetRef = useCallback(() => {
    if (!isNexusTutorialStep) return null;

    switch (tutorialStep) {
      case 12:
        return titleRef;
      case 13:
        return pieceTabRef;
      case 14:
        return tutorialCardRef;
      case 15:
        return tutorialButtonRef;
      default:
        return null;
    }
  }, [isNexusTutorialStep, tutorialStep]);

  const tutorialOverlayConfig = useMemo(() => {
    if (!isNexusTutorialStep) return null;

    switch (tutorialStep) {
      case 12:
        return {
          step: 12,
          mode: "info",
          title: "ピース",
          message:
            "ここでは、公開されたPieceや感情の動きをまとめて見られます。",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(13),
        };
      case 13:
        return {
          step: 13,
          mode: "info",
          title: "ピース",
          message:
            "公開されたPieceはこの流れで確認します。まずは Piece タブを見る場所だと覚えてください。",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(14),
        };
      case 14:
        return {
          step: 14,
          mode: "info",
          title: "チュートリアル導線",
          message:
            "チュートリアルでは、ここからサンプルPiece一覧に進みます。",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(15),
        };
      case 15:
        return {
          step: 15,
          mode: "action",
          title: "開いてみましょう",
          message:
            "Piece一覧を開いて、チュートリアル用のPieceを確認してみましょう。",
          actionHint: "Piece一覧を開く を押してください",
        };
      default:
        return null;
    }
  }, [isNexusTutorialStep, tutorialStep, setTutorialStep]);

  const syncTutorialTargetRect = useCallback(async () => {
    if (!isNexusTutorialStep) {
      return null;
    }

    const targetRef = getTutorialTargetRef();
    if (!targetRef || !screenRootRef.current) {
      return null;
    }

    return syncTutorialSpotlightTarget({
      enabled: isNexusTutorialStep,
      targetRef,
      rootRef: screenRootRef,
      scrollRef,
      currentScrollYRef,
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
    isNexusTutorialStep,
    safeInsets,
    tutorialOverlayConfig?.cardPlacement,
    tutorialOverlayMetrics,
    windowHeight,
  ]);

  useLayoutEffect(() => {
    if (!isNexusTutorialStep) {
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
    isNexusTutorialStep,
    tutorialStep,
    activeTab,
    tutorialPieceItems.length,
    tutorialOverlayMetrics,
    syncTutorialTargetRect,
  ]);

  const renderPieceTab = () => {
    if (isTutorialMode) {
      if (!tutorialPieceItems.length) {
        return (
          <Text style={styles.emptyText}>
            チュートリアル用のPieceを準備しています。
          </Text>
        );
      }
      return tutorialPieceItems.map((item) => (
        <NexusPieceCard
          key={String(item?.q_instance_id || Math.random())}
          item={item}
          onPress={() => handleOpenPiece(item)}
          onPressOwner={() => handleOpenOwner(item?.owner?.user_id)}
        />
      ));
    }

    if (pieceState.loading) {
      return <ActivityIndicator style={styles.loader} color={colors.TITLE_GOLD} />;
    }
    if (pieceState.error) {
      return <Text style={styles.errorText}>{pieceState.error}</Text>;
    }
    if (!Array.isArray(pieceState.items) || pieceState.items.length <= 0) {
      return (
        <Text style={styles.emptyText}>
          フォロー中ユーザーのPieceはまだありません。
        </Text>
      );
    }
    return pieceState.items.map((item) => (
      <NexusPieceCard
        key={String(item?.q_instance_id || Math.random())}
        item={item}
        onPress={() => handleOpenPiece(item)}
        onPressOwner={() => handleOpenOwner(item?.owner?.user_id)}
      />
    ));
  };

  const renderEmotionLogTab = () => {
    if (emotionLogState.loading) {
      return <ActivityIndicator style={styles.loader} color={colors.TITLE_GOLD} />;
    }
    if (emotionLogState.error) {
      return <Text style={styles.errorText}>{emotionLogState.error}</Text>;
    }
    if (!emotionLogState.items.length) {
      return <Text style={styles.emptyText}>感情通知はまだありません。</Text>;
    }
    return (
      <View style={styles.emotionLogCard}>
        {emotionLogState.items.map((row, rowIndex) => (
          <React.Fragment key={row.id}>
            <View style={styles.emotionLogRow}>
              <View style={styles.emotionLogLeft}>
                <Text style={styles.emotionLogName}>{row.ownerName}</Text>
              </View>

              <View style={styles.emotionLogCenter}>
                {(row.items || []).length === 0 ? (
                  <Text style={styles.emotionLogNoEmotion}>
                    まだ感情が選択されていません
                  </Text>
                ) : (
                  <View style={styles.emotionLogBadgeRow}>
                    {(row.items || []).map((item, itemIndex) => {
                      const type = String(item?.type || "").trim() || "感情";
                      const strengthKey = String(item?.strength || "").trim();
                      const labelStrength = STRENGTH_LABEL[strengthKey] || "";
                      const tint = emotionTint(type);
                      return (
                        <View
                          key={`${type}-${strengthKey}-${itemIndex}`}
                          style={[
                            styles.emotionLogBadge,
                            { backgroundColor: tint.bg },
                          ]}
                        >
                          <Text
                            style={[
                              styles.emotionLogBadgeText,
                              { color: tint.text },
                            ]}
                          >
                            {type}
                            {labelStrength ? `（${labelStrength}）` : ""}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>

              <Text style={styles.emotionLogTime}>{row.timeLabel}</Text>
            </View>

            {rowIndex < emotionLogState.items.length - 1 ? (
              <View style={styles.emotionLogSeparator} />
            ) : null}
          </React.Fragment>
        ))}
      </View>
    );
  };

  const renderRecommendTab = () => {
    if (recommendState.loading) {
      return <ActivityIndicator style={styles.loader} color={colors.TITLE_GOLD} />;
    }
    if (recommendState.error) {
      return <Text style={styles.errorText}>{recommendState.error}</Text>;
    }
    return (
      <View>
        <Text style={styles.subsectionTitle}>おすすめユーザー</Text>
        {recommendState.users.length <= 0 ? (
          <Text style={styles.emptyText}>おすすめユーザーはまだありません。</Text>
        ) : (
          recommendState.users.map((user) => (
            <CocolonPressable
              key={user.id}
              style={styles.simpleCard}
              onPress={() => handleOpenOwner(user.id)}
            >
              <View style={styles.simpleCardHeader}>
                <Text style={styles.simpleCardTitle}>{user.displayName}</Text>
                {user.shareCode ? (
                  <Text style={styles.simpleCardMeta}>{user.shareCode}</Text>
                ) : null}
              </View>
            </CocolonPressable>
          ))
        )}
      </View>
    );
  };

  const renderHistoryTab = () => {
    if (historyState.loading && !historyState.loadedModes?.resonances) {
      return <ActivityIndicator style={styles.loader} color={colors.TITLE_GOLD} />;
    }
    if (historyState.error && !historyState.resonances.length) {
      return <Text style={styles.errorText}>{historyState.error}</Text>;
    }
    if (!historyState.resonances.length) {
      return <Text style={styles.emptyText}>共鳴したPieceはまだありません。</Text>;
    }
    return (
      <View>
        {historyState.resonances.map((item) => (
          <CocolonPressable
            key={item.qInstanceId}
            style={styles.simpleCard}
            onPress={() => handleOpenPiece(item)}
          >
            <View style={styles.simpleCardHeader}>
              <Text style={styles.simpleCardTitle}>{item.title}</Text>
              <Text style={styles.simpleCardMeta}>
                {formatDateLabel(item.savedAt)}
              </Text>
            </View>
            <Text style={styles.simpleCardBody}>{item.ownerDisplayName}</Text>
          </CocolonPressable>
        ))}
      </View>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "emotion_log":
        return renderEmotionLogTab();
      case "recommend":
        return renderRecommendTab();
      case "history":
        return renderHistoryTab();
      case "piece":
      default:
        return renderPieceTab();
    }
  };

  return (
    <SafeAreaView ref={screenRootRef} collapsable={false} style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => {
          currentScrollYRef.current =
            e?.nativeEvent?.contentOffset?.y ?? currentScrollYRef.current;
        }}
      >
        <View style={styles.panelHeader}>
          <View ref={titleRef} collapsable={false}>
            <Text style={styles.panelTitle}>ピース</Text>
          </View>
          <CocolonPressable
            style={styles.refreshButton}
            onPress={() => {
              void refreshNexusUnreadState();
              void loadRanking();
              if (activeTab === "piece") void loadPieces();
              if (activeTab === "emotion_log") void loadEmotionLog();
              if (activeTab === "recommend") void loadRecommend();
              if (activeTab === "history") void loadHistory();
            }}
            accessibilityLabel="Pieceを再読み込みする"
          >
            <Ionicons
              name="refresh-outline"
              size={18}
              color={colors.TEXT_ON_LIGHT}
            />
          </CocolonPressable>
        </View>

        {isTutorialMode ? (
          <View ref={tutorialCardRef} collapsable={false} style={styles.tutorialEntryCard}>
            <Text style={styles.tutorialEntryTitle}>チュートリアル</Text>
            <Text style={styles.tutorialEntryBody}>
              チュートリアルでは、このまま
              Piece一覧へ進んで流れを確認します。
            </Text>
            <View ref={tutorialButtonRef} collapsable={false} style={styles.tutorialEntryButtonWrap}>
              <CocolonButton
                variant="primary"
                onPress={handleOpenTutorialPieces}
                accessibilityLabel="Piece一覧を開く"
              >
                Piece一覧を開く
              </CocolonButton>
            </View>
          </View>
        ) : null}

        {!isTutorialMode ? (
          <View style={styles.todayOverallEmotionSummary}>
            <View style={styles.todayOverallEmotionHeader}>
              <Ionicons
                name="stats-chart-outline"
                size={14}
                color={colors.TITLE_GOLD}
                style={styles.todayOverallEmotionIcon}
              />
              <Text style={styles.todayOverallEmotionTitle}>今日の全体感情</Text>
            </View>

            {rankingState.loading ? (
              <Text style={styles.todayOverallEmotionPlaceholder}>読み込み中…</Text>
            ) : rankingState.items.length <= 0 ? (
              <Text style={styles.todayOverallEmotionPlaceholder}>
                今日はまだ表示できる感情がありません。
              </Text>
            ) : (
              <Text style={styles.todayOverallEmotionText}>
                {rankingState.items
                  .slice(0, 3)
                  .map((item) => {
                    const label =
                      String(item?.label || "—").trim() || "—";
                    const value = Number(item?.value);
                    return `${label} ${Number.isFinite(value) ? value : "—"}`;
                  })
                  .join("　")}
              </Text>
            )}
          </View>
        ) : null}

        <View style={styles.tabBar}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const content = (
              <CocolonPressable
                style={styles.tabItem}
                onPress={() => setActiveTab(tab.key)}
              >
                <View
                  style={[
                    styles.tabLabelWrap,
                    isActive && styles.tabLabelWrapActive,
                  ]}
                >
                  <View style={styles.tabLabelRow}>
                    <Text
                      style={[
                        styles.tabLabelText,
                        isActive && styles.tabLabelTextActive,
                      ]}
                    >
                      {tab.label}
                    </Text>
                    <ScreenUnreadBadge
                      visible={
                        (tab.key === "piece" && pieceTabUnread) ||
                        (tab.key === "emotion_log" && emotionLogTabUnread)
                      }
                      style={styles.tabUnreadBadge}
                    />
                  </View>
                </View>
              </CocolonPressable>
            );

            if (tab.key === "piece") {
              return (
                <View
                  key={tab.key}
                  ref={pieceTabRef}
                  collapsable={false}
                  style={styles.tabItemWrap}
                >
                  {content}
                </View>
              );
            }

            return (
              <View key={tab.key} style={styles.tabItemWrap}>
                {content}
              </View>
            );
          })}
        </View>

        <View style={styles.tabContent}>{renderActiveTab()}</View>
      </ScrollView>

      <Modal
        visible={detailVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDetailVisible(false)}
      >
        <View style={styles.detailBackdrop}>
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>
                {String(detailData?.title || "Piece").trim() || "Piece"}
              </Text>
            </View>

            {detailLoading ? (
              <ActivityIndicator style={styles.loader} color={colors.TITLE_GOLD} />
            ) : (
              <ScrollView
                style={styles.detailBodyScroll}
                contentContainerStyle={styles.detailBodyContent}
              >
                <Text style={styles.detailBodyText}>
                  {String(detailData?.body || "表示できる内容がありません。").trim() ||
                    "表示できる内容がありません。"}
                </Text>

                <View style={styles.detailMetricsRow}>
                  <Text style={styles.detailMetricText}>
                    views {Number(detailData?.views || 0) || 0}
                  </Text>
                  <Text style={styles.detailMetricText}>
                    共鳴 {Number(detailData?.resonances || 0) || 0}
                  </Text>
                </View>
              </ScrollView>
            )}

            <View style={styles.detailActionRow}>
              <CocolonButton
                variant="secondary"
                onPress={() => setDetailVisible(false)}
                accessibilityLabel="Piece詳細を閉じる"
              >
                閉じる
              </CocolonButton>
            </View>
          </View>
        </View>
      </Modal>

      {tutorialOverlayConfig ? (
        <TutorialOverlay
          visible={isNexusTutorialStep}
          targetRect={tutorialTargetRect}
          title={tutorialOverlayConfig.title}
          message={tutorialOverlayConfig.message}
          step={tutorialOverlayConfig.step}
          totalSteps={TUTORIAL_TOTAL_STEPS}
          mode={tutorialOverlayConfig.mode}
          nextLabel={tutorialOverlayConfig.nextLabel}
          onNext={tutorialOverlayConfig.onNext}
          onTargetPress={tutorialStep === 15 ? handleOpenTutorialPieces : undefined}
          onMetricsChange={setTutorialOverlayMetrics}
          actionHint={tutorialOverlayConfig.actionHint}
          cardPlacement={tutorialOverlayConfig.cardPlacement}
        />
      ) : null}
    </SafeAreaView>
  );
}

function createStyles(COLORS, ui) {
  const font = ui?.font || {};
  const text = ui?.text || {};
  return StyleSheet.create(
    applyTypographyTokens(
      {
        container: {
          flex: 1,
          backgroundColor: COLORS.PANEL_BG,
        },
        scrollContainer: {
          paddingTop: 16,
          paddingBottom: 32,
          paddingHorizontal: 18,
          alignItems: "stretch",
        },
        panelHeader: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        },
        panelTitle: {
          fontSize: 26,
          lineHeight: 32,
          fontWeight: "800",
          color: COLORS.TITLE_GOLD,
          letterSpacing: 0.8,
        },
        refreshButton: {
          width: 40,
          height: 36,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.FIELD_BG,
          borderWidth: 1,
          borderColor: COLORS.CARD_BORDER,
        },
        todayOverallEmotionSummary: {
          paddingVertical: 8,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderTopColor: COLORS.CARD_BORDER,
          borderBottomColor: COLORS.CARD_BORDER,
          marginBottom: 14,
        },
        todayOverallEmotionHeader: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 4,
        },
        todayOverallEmotionIcon: {
          marginRight: 6,
        },
        todayOverallEmotionTitle: {
          fontSize: 11,
          fontWeight: "800",
          letterSpacing: 0.3,
          color: COLORS.TEXT_ON_LIGHT,
        },
        todayOverallEmotionText: {
          fontSize: 12,
          lineHeight: 18,
          color: COLORS.TEXT_ON_LIGHT,
        },
        todayOverallEmotionPlaceholder: {
          fontSize: 12,
          lineHeight: 18,
          color: COLORS.TEXT_ON_LIGHT,
        },
        tutorialEntryCard: {
          borderRadius: 18,
          borderWidth: 1,
          borderColor: COLORS.CARD_BORDER,
          backgroundColor: COLORS.FIELD_BG,
          paddingHorizontal: 14,
          paddingVertical: 14,
          marginBottom: 14,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
        },
        tutorialEntryTitle: {
          fontSize: 13,
          fontWeight: "900",
          color: COLORS.TEXT_ON_LIGHT,
        },
        tutorialEntryBody: {
          marginTop: 8,
          fontSize: 12,
          lineHeight: 18,
          color: COLORS.TEXT_ON_LIGHT,
        },
        tutorialEntryButtonWrap: {
          marginTop: 12,
        },
        tabBar: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: COLORS.CARD_BORDER,
          marginBottom: 14,
        },
        tabItemWrap: {
          flex: 1,
        },
        tabItem: {
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 10,
          paddingHorizontal: 2,
        },
        tabLabelWrap: {
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 9,
          borderBottomWidth: 2,
          borderBottomColor: "transparent",
        },
        tabLabelRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        tabLabelWrapActive: {
          borderBottomColor: COLORS.TITLE_GOLD,
        },
        tabLabelText: {
          fontSize: 13,
          fontWeight: "800",
          color: COLORS.TEXT_SUBTLE,
        },
        tabLabelTextActive: {
          color: COLORS.TITLE_GOLD,
        },
        tabUnreadBadge: {
          marginLeft: 6,
        },
        tabContent: {
          marginTop: 2,
        },
        loader: {
          marginTop: 24,
          marginBottom: 24,
        },
        emptyText: {
          fontSize: 13,
          lineHeight: 20,
          color: COLORS.TEXT_SUBTLE,
        },
        errorText: {
          fontSize: 13,
          lineHeight: 20,
          color: "#B91C1C",
        },
        subsectionTitle: {
          fontSize: 12,
          fontWeight: "800",
          color: COLORS.TITLE_GOLD,
          marginBottom: 8,
          marginTop: 2,
        },
        emotionLogCard: {
          backgroundColor: COLORS.FIELD_BG,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: COLORS.CARD_BORDER,
          paddingVertical: 4,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
        },
        emotionLogRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 10,
          paddingHorizontal: 12,
        },
        emotionLogLeft: {
          flexDirection: "row",
          alignItems: "center",
        },
        emotionLogName: {
          fontWeight: "700",
          color: COLORS.TEXT_ON_LIGHT,
          fontSize: 15,
        },
        emotionLogCenter: {
          flex: 1,
          alignItems: "center",
        },
        emotionLogNoEmotion: {
          fontSize: 12,
          color: COLORS.TEXT_SUBTLE,
        },
        emotionLogBadgeRow: {
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        },
        emotionLogBadge: {
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 999,
          marginHorizontal: 2,
          marginVertical: 2,
        },
        emotionLogBadgeText: {
          fontSize: 12,
          fontWeight: "700",
        },
        emotionLogTime: {
          color: COLORS.TEXT_SUBTLE,
          fontSize: 12,
          width: 80,
          textAlign: "right",
        },
        emotionLogSeparator: {
          height: 1,
          backgroundColor: "#EEE",
          marginLeft: 12,
          marginRight: 12,
        },
        simpleCard: {
          borderRadius: 16,
          borderWidth: 1,
          borderColor: COLORS.CARD_BORDER,
          backgroundColor: COLORS.FIELD_BG,
          paddingHorizontal: 14,
          paddingVertical: 12,
          marginBottom: 10,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
        },
        simpleCardHeader: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        },
        simpleCardTitle: {
          flex: 1,
          fontSize: 14,
          fontWeight: "800",
          color: COLORS.TEXT_ON_LIGHT,
          paddingRight: 10,
        },
        simpleCardMeta: {
          fontSize: 11,
          color: COLORS.TEXT_SUBTLE,
        },
        simpleCardBody: {
          fontSize: 13,
          lineHeight: 20,
          color: COLORS.TEXT_ON_LIGHT,
        },
        historySwitchRow: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
        },
        historySwitchChip: {
          marginRight: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: COLORS.CARD_BORDER,
          backgroundColor: COLORS.FIELD_BG,
        },
        historySwitchChipActive: {
          backgroundColor: COLORS.GOLD_BUTTON,
          borderColor: COLORS.GOLD_BUTTON_BORDER,
        },
        historySwitchText: {
          fontSize: 12,
          fontWeight: "800",
          color: COLORS.TEXT_ON_LIGHT,
        },
        historySwitchTextActive: {
          color: COLORS.ACCENT_TEXT,
        },
        detailBackdrop: {
          flex: 1,
          backgroundColor: "rgba(15, 23, 42, 0.38)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        },
        detailCard: {
          width: "100%",
          maxWidth: 380,
          maxHeight: 640,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: COLORS.BORDER_GOLD,
          backgroundColor: COLORS.PANEL_BG,
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 18,
          shadowColor: "#000",
          shadowOpacity: 0.18,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 10,
        },
        detailHeader: {
          marginBottom: 12,
        },
        detailTitle: {
          fontSize: 20,
          lineHeight: 28,
          fontWeight: "800",
          color: COLORS.TEXT_ON_LIGHT,
          textAlign: "center",
        },
        detailBodyScroll: {
          width: "100%",
          borderRadius: 20,
          borderWidth: 1,
          borderColor: COLORS.CARD_BORDER,
          backgroundColor: COLORS.FIELD_BG,
          maxHeight: 400,
        },
        detailBodyContent: {
          paddingHorizontal: 18,
          paddingVertical: 18,
        },
        detailBodyText: {
          fontSize: 15,
          lineHeight: 24,
          color: COLORS.TEXT_ON_LIGHT,
          fontWeight: "600",
        },
        detailMetricsRow: {
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 14,
        },
        detailMetricText: {
          fontSize: 12,
          lineHeight: 18,
          fontWeight: "700",
          color: COLORS.TEXT_SUBTLE,
          marginRight: 12,
          marginBottom: 4,
        },
        detailActionRow: {
          marginTop: 16,
          width: "100%",
        },
      },
      ui
    )
  );
}
