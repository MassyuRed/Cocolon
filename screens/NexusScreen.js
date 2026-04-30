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
import { useAuth } from "../AuthContext";
import { useUnread } from "../UnreadContext";
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import {
  getNexusResonancePieces,
  getNexusEmotionLog,
  getNexusEmotionLogUnreadStatus,
  getNexusEmotionRanking,
  getNexusFollowingUsers,
  getNexusRecommendUsers,
  getNexusPieces,
  getNexusPiecesUnreadStatus,
  markNexusEmotionLogFeedRead,
  postNexusPieceResonance,
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

const OWNER_FILTER_ALL = "all";
const OWNER_FILTER_SELF = "self";
const OWNER_FILTER_USER = "user";

const PIECE_ORDER_LATEST = "latest";
const PIECE_ORDER_OLDEST = "oldest";

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

function normalizeFollowListUsers(json) {
  const rows = Array.isArray(json?.rows)
    ? json.rows
    : Array.isArray(json?.items)
    ? json.items
    : Array.isArray(json?.users)
    ? json.users
    : Array.isArray(json?.data)
    ? json.data
    : Array.isArray(json)
    ? json
    : [];

  const seen = new Set();
  const users = [];
  rows.forEach((user, index) => {
    const id = String(user?.id || user?.user_id || user?.userId || "").trim();
    if (!id || seen.has(id)) return;
    seen.add(id);

    const displayName =
      String(
        user?.display_name ||
          user?.displayName ||
          user?.name ||
          readShareCode(user, "") ||
          `ユーザー ${index + 1}`
      ).trim() || `ユーザー ${index + 1}`;
    const friendCode =
      String(
        user?.friend_code ||
          user?.share_code ||
          user?.connect_code ||
          user?.myprofile_code ||
          ""
      ).trim() || null;

    users.push({ id, displayName, friendCode });
  });

  return users;
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


function resolvePieceQInstanceId(item) {
  return String(item?.q_instance_id || item?.qInstanceId || "").trim();
}

function resolvePieceQKey(item) {
  return String(
    item?.question?.q_key || item?.question?.qKey || item?.q_key || item?.qKey || ""
  ).trim() || null;
}

function resolvePieceOwnerUserId(item) {
  return (
    String(
      item?.owner?.user_id ||
        item?.owner?.userId ||
        item?.owner_user_id ||
        item?.ownerUserId ||
        ""
    ).trim() || null
  );
}

function normalizeDetailResonanceCount(value) {
  return Number(value || 0) || 0;
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
  const { user, initializing: authInitializing } = useAuth();
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

  const viewerUserId = useMemo(
    () => String(user?.id || "").trim() || null,
    [user?.id]
  );
  const viewerDisplayName = useMemo(() => {
    const metadata = user?.user_metadata || {};
    return (
      String(
        metadata?.display_name || metadata?.displayName || user?.email || ""
      ).trim() || null
    );
  }, [user?.email, user?.user_metadata]);

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
  const [ownerFilterMode, setOwnerFilterMode] = useState(OWNER_FILTER_ALL);
  const [ownerFilterUserId, setOwnerFilterUserId] = useState(null);
  const [ownerPickerVisible, setOwnerPickerVisible] = useState(false);
  const [ownerOptionsLoading, setOwnerOptionsLoading] = useState(false);
  const [ownerOptions, setOwnerOptions] = useState([]);
  const [pieceOrder, setPieceOrder] = useState(PIECE_ORDER_LATEST);

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

  const [resonanceSubmittingIds, setResonanceSubmittingIds] = useState({});

  const baseOwnerOptions = useMemo(() => {
    if (!viewerUserId) return [];
    return [
      {
        key: OWNER_FILTER_ALL,
        mode: OWNER_FILTER_ALL,
        userId: null,
        label: "すべて",
        meta: "自分 + フォロー中",
      },
      {
        key: OWNER_FILTER_SELF,
        mode: OWNER_FILTER_SELF,
        userId: viewerUserId,
        label: "自分",
        meta: viewerDisplayName,
      },
    ];
  }, [viewerDisplayName, viewerUserId]);

  const selectedOwnerOption = useMemo(() => {
    const options = Array.isArray(ownerOptions) && ownerOptions.length > 0
      ? ownerOptions
      : baseOwnerOptions;
    if (ownerFilterMode === OWNER_FILTER_SELF) {
      return options.find((option) => option.mode === OWNER_FILTER_SELF) || null;
    }
    if (ownerFilterMode === OWNER_FILTER_USER) {
      const selectedUserId = String(ownerFilterUserId || "").trim();
      return (
        options.find(
          (option) =>
            option.mode === OWNER_FILTER_USER &&
            String(option.userId || "").trim() === selectedUserId
        ) || null
      );
    }
    return options.find((option) => option.mode === OWNER_FILTER_ALL) || null;
  }, [baseOwnerOptions, ownerFilterMode, ownerFilterUserId, ownerOptions]);

  const ownerPickerOptions =
    Array.isArray(ownerOptions) && ownerOptions.length > 0
      ? ownerOptions
      : baseOwnerOptions;

  const selectedOwnerLabel =
    String(selectedOwnerOption?.label || "").trim() ||
    (ownerFilterMode === OWNER_FILTER_SELF
      ? "自分"
      : ownerFilterMode === OWNER_FILTER_USER
      ? "選択中のユーザー"
      : "すべて");

  const pieceEmptyText = useMemo(() => {
    if (ownerFilterMode === OWNER_FILTER_SELF) {
      return "自分のPieceはまだありません。";
    }
    if (ownerFilterMode === OWNER_FILTER_USER) {
      return `${selectedOwnerLabel}のPieceはまだありません。`;
    }
    return "Pieceはまだありません。";
  }, [ownerFilterMode, selectedOwnerLabel]);

  const showPieceControls =
    !isTutorialMode && activeTab === "piece" && !!viewerUserId;

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

  const loadOwnerOptions = useCallback(async () => {
    if (isTutorialMode || authInitializing || !viewerUserId) {
      setOwnerOptions([]);
      setOwnerOptionsLoading(false);
      return;
    }

    setOwnerOptions(baseOwnerOptions);
    setOwnerOptionsLoading(true);
    try {
      const json = await getNexusFollowingUsers(viewerUserId, 1000);
      const followUsers = normalizeFollowListUsers(json);
      const followOptions = followUsers
        .filter((followUser) => followUser.id !== viewerUserId)
        .map((followUser) => ({
          key: `${OWNER_FILTER_USER}:${followUser.id}`,
          mode: OWNER_FILTER_USER,
          userId: followUser.id,
          label: followUser.displayName,
          meta: followUser.friendCode,
        }));

      setOwnerOptions([...baseOwnerOptions, ...followOptions]);
    } catch (e) {
      console.warn("NexusScreen: loadOwnerOptions failed", e);
      setOwnerOptions(baseOwnerOptions);
    } finally {
      setOwnerOptionsLoading(false);
    }
  }, [authInitializing, baseOwnerOptions, isTutorialMode, viewerUserId]);


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

    if (authInitializing) {
      setPieceState((prev) => ({ ...prev, loading: true, error: "" }));
      return;
    }

    const params = {
      sort: pieceOrder,
      limit: 20,
    };

    if (ownerFilterMode === OWNER_FILTER_SELF) {
      if (!viewerUserId) {
        setPieceState({ loading: false, items: [], error: "" });
        return;
      }
      params.user_id = viewerUserId;
    } else if (ownerFilterMode === OWNER_FILTER_USER) {
      const selectedUserId = String(ownerFilterUserId || "").trim();
      if (!selectedUserId) {
        setPieceState({ loading: false, items: [], error: "" });
        return;
      }
      params.user_id = selectedUserId;
    } else {
      params.following_only = false;
    }

    setPieceState((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const json = await getNexusPieces(params);
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
  }, [
    authInitializing,
    isTutorialMode,
    ownerFilterMode,
    ownerFilterUserId,
    pieceOrder,
    tutorialPieceItems,
    viewerUserId,
  ]);

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
    void loadOwnerOptions();
  }, [loadOwnerOptions]);

  useEffect(() => {
    if (!isTutorialMode) return;
    setOwnerFilterMode(OWNER_FILTER_ALL);
    setOwnerFilterUserId(null);
    setOwnerPickerVisible(false);
    setOwnerOptions([]);
    void ensureTutorialPiecesSeed();
    if (activeTab !== "piece") {
      setActiveTab("piece");
    }
  }, [activeTab, ensureTutorialPiecesSeed, isTutorialMode]);

  useEffect(() => {
    if (ownerFilterMode !== OWNER_FILTER_SELF) return;
    if (!viewerUserId) {
      setOwnerFilterMode(OWNER_FILTER_ALL);
      setOwnerFilterUserId(null);
      return;
    }
    if (ownerFilterUserId !== viewerUserId) {
      setOwnerFilterUserId(viewerUserId);
    }
  }, [ownerFilterMode, ownerFilterUserId, viewerUserId]);

  useEffect(() => {
    if (ownerFilterMode !== OWNER_FILTER_USER) return;
    const selectedUserId = String(ownerFilterUserId || "").trim();
    if (!selectedUserId) {
      setOwnerFilterMode(OWNER_FILTER_ALL);
      setOwnerFilterUserId(null);
      return;
    }
    if (ownerOptionsLoading || !Array.isArray(ownerOptions) || ownerOptions.length <= 0) {
      return;
    }
    const stillSelectable = ownerOptions.some(
      (option) =>
        option.mode === OWNER_FILTER_USER &&
        String(option.userId || "").trim() === selectedUserId
    );
    if (!stillSelectable) {
      setOwnerFilterMode(OWNER_FILTER_ALL);
      setOwnerFilterUserId(null);
    }
  }, [ownerFilterMode, ownerFilterUserId, ownerOptions, ownerOptionsLoading]);

  useEffect(() => {
    if (!ownerPickerVisible || showPieceControls) return;
    setOwnerPickerVisible(false);
  }, [ownerPickerVisible, showPieceControls]);

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

  const canResonatePieceOwner = useCallback(
    (ownerUserId) => {
      const normalizedOwnerUserId = String(ownerUserId || "").trim();
      if (!normalizedOwnerUserId || normalizedOwnerUserId === viewerUserId) {
        return false;
      }

      const selectableFollowOwner = (ownerPickerOptions || []).some(
        (option) =>
          option?.mode === OWNER_FILTER_USER &&
          String(option?.userId || "").trim() === normalizedOwnerUserId
      );
      if (selectableFollowOwner) return true;

      return (
        ownerFilterMode === OWNER_FILTER_USER &&
        String(ownerFilterUserId || "").trim() === normalizedOwnerUserId
      );
    },
    [ownerFilterMode, ownerFilterUserId, ownerPickerOptions, viewerUserId]
  );

  const readPieceViewerState = useCallback((item) => {
    return (
      (item?.viewer_state && typeof item.viewer_state === "object"
        ? item.viewer_state
        : null) ||
      (item?.viewerState && typeof item.viewerState === "object"
        ? item.viewerState
        : null) ||
      {}
    );
  }, []);

  const isPieceResonated = useCallback(
    (item) => {
      const viewerState = readPieceViewerState(item);
      return (
        viewerState?.is_resonated === true ||
        viewerState?.isResonated === true ||
        item?.is_resonated === true ||
        item?.isResonated === true
      );
    },
    [readPieceViewerState]
  );

  const canResonatePiece = useCallback(
    (item) => {
      if (isTutorialMode) return false;
      const ownerUserId = resolvePieceOwnerUserId(item);
      if (!viewerUserId || !ownerUserId || ownerUserId === viewerUserId) {
        return false;
      }

      const viewerState = readPieceViewerState(item);
      if (viewerState?.can_resonate === true || viewerState?.canResonate === true) {
        return true;
      }
      if (viewerState?.can_resonate === false || viewerState?.canResonate === false) {
        return false;
      }

      return canResonatePieceOwner(ownerUserId);
    },
    [canResonatePieceOwner, isTutorialMode, readPieceViewerState, viewerUserId]
  );

  const handleSelectOwnerOption = useCallback(
    (option) => {
      const mode = option?.mode || OWNER_FILTER_ALL;
      if (mode === OWNER_FILTER_SELF && viewerUserId) {
        setOwnerFilterMode(OWNER_FILTER_SELF);
        setOwnerFilterUserId(viewerUserId);
      } else if (mode === OWNER_FILTER_USER && option?.userId) {
        setOwnerFilterMode(OWNER_FILTER_USER);
        setOwnerFilterUserId(String(option.userId));
      } else {
        setOwnerFilterMode(OWNER_FILTER_ALL);
        setOwnerFilterUserId(null);
      }
      setOwnerPickerVisible(false);
    },
    [viewerUserId]
  );

  const handleSetPieceOrder = useCallback((nextOrder) => {
    const normalized =
      nextOrder === PIECE_ORDER_OLDEST ? PIECE_ORDER_OLDEST : PIECE_ORDER_LATEST;
    setPieceOrder((current) => (current === normalized ? current : normalized));
  }, []);

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

  const handlePressPieceResonance = useCallback(
    async (item) => {
      if (!item || isPieceResonated(item) || !canResonatePiece(item)) return;

      const qInstanceId = resolvePieceQInstanceId(item);
      if (!qInstanceId || resonanceSubmittingIds[qInstanceId]) return;

      setResonanceSubmittingIds((prev) => ({
        ...(prev || {}),
        [qInstanceId]: true,
      }));

      try {
        const result = await postNexusPieceResonance({
          qInstanceId,
          qKey: resolvePieceQKey(item),
        });
        const hasResultResonances =
          result?.resonances !== undefined && result?.resonances !== null;
        const currentResonances =
          Number(item?.metrics?.resonances ?? item?.resonances ?? 0) || 0;
        const nextResonances = hasResultResonances
          ? normalizeDetailResonanceCount(result?.resonances)
          : currentResonances + 1;
        const hasResultViews = result?.views !== undefined && result?.views !== null;
        const nextViews = hasResultViews
          ? normalizeDetailResonanceCount(result?.views)
          : Number(item?.metrics?.views ?? item?.views ?? 0) || 0;
        const nextIsResonated = result?.resonated !== false;

        setPieceState((prev) => ({
          ...prev,
          items: Array.isArray(prev.items)
            ? prev.items.map((row) => {
                if (String(row?.q_instance_id || "") !== qInstanceId) return row;
                return {
                  ...row,
                  viewer_state: {
                    ...(row?.viewer_state || {}),
                    is_resonated: nextIsResonated,
                    can_resonate: true,
                  },
                  metrics: {
                    ...(row?.metrics || {}),
                    views: nextViews,
                    resonances: nextResonances,
                  },
                };
              })
            : prev.items,
        }));
        setHistoryState((prev) => ({
          ...prev,
          resonances: Array.isArray(prev.resonances)
            ? prev.resonances.map((row) =>
                String(row?.qInstanceId || "") === qInstanceId
                  ? { ...row, resonances: nextResonances }
                  : row
              )
            : prev.resonances,
        }));
      } catch (e) {
        console.warn("NexusScreen: piece resonance failed", e);
        const statusCode = Number(e?.status || e?.statusCode || 0);
        const rawMessage = String(e?.message || "").trim();
        const message =
          statusCode === 403
            ? "フォローしているユーザーのPieceにのみ共鳴できます。"
            : statusCode === 400 && rawMessage.toLowerCase().includes("self")
              ? "自分のPieceには共鳴できません。"
              : rawMessage || "共鳴できませんでした。";
        Alert.alert("共鳴できません", message);
      } finally {
        setResonanceSubmittingIds((prev) => {
          const next = { ...(prev || {}) };
          delete next[qInstanceId];
          return next;
        });
      }
    },
    [
      canResonatePiece,
      isPieceResonated,
      resonanceSubmittingIds,
    ]
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

  const renderPieceControls = () => {
    if (!showPieceControls) return null;

    return (
      <View style={styles.pieceControls}>
        <Text style={styles.controlLabel}>表示ユーザー</Text>
        <CocolonPressable
          style={[
            styles.ownerFilterButton,
            ownerOptionsLoading && styles.ownerFilterButtonDisabled,
          ]}
          onPress={() => setOwnerPickerVisible(true)}
          disabled={ownerOptionsLoading}
          accessibilityLabel="表示ユーザーを選択する"
        >
          <View style={styles.ownerFilterButtonContent}>
            <Text style={styles.ownerFilterButtonText} numberOfLines={1}>
              {selectedOwnerLabel}
            </Text>
            {ownerOptionsLoading ? (
              <ActivityIndicator
                size="small"
                color={colors.TEXT_SUBTLE}
                style={styles.ownerFilterSpinner}
              />
            ) : (
              <Ionicons
                name="chevron-down-outline"
                size={16}
                color={colors.TEXT_SUBTLE}
                style={styles.ownerFilterChevron}
              />
            )}
          </View>
        </CocolonPressable>

        <Text style={[styles.controlLabel, styles.pieceOrderLabel]}>表示順</Text>
        <View style={styles.pieceSortRow}>
          <CocolonPressable
            style={[
              styles.pieceSortButton,
              pieceOrder === PIECE_ORDER_LATEST && styles.pieceSortButtonActive,
            ]}
            onPress={() => handleSetPieceOrder(PIECE_ORDER_LATEST)}
            accessibilityLabel="新しい順で表示する"
          >
            <Text
              style={[
                styles.pieceSortButtonText,
                pieceOrder === PIECE_ORDER_LATEST && styles.pieceSortButtonTextActive,
              ]}
            >
              新しい順
            </Text>
          </CocolonPressable>
          <CocolonPressable
            style={[
              styles.pieceSortButton,
              styles.pieceSortButtonSpacer,
              pieceOrder === PIECE_ORDER_OLDEST && styles.pieceSortButtonActive,
            ]}
            onPress={() => handleSetPieceOrder(PIECE_ORDER_OLDEST)}
            accessibilityLabel="古い順で表示する"
          >
            <Text
              style={[
                styles.pieceSortButtonText,
                pieceOrder === PIECE_ORDER_OLDEST && styles.pieceSortButtonTextActive,
              ]}
            >
              古い順
            </Text>
          </CocolonPressable>
        </View>
      </View>
    );
  };

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
          onPressOwner={() => handleOpenOwner(item?.owner?.user_id)}
        />
      ));
    }

    let content = null;
    if (pieceState.loading) {
      content = <ActivityIndicator style={styles.loader} color={colors.TITLE_GOLD} />;
    } else if (pieceState.error) {
      content = <Text style={styles.errorText}>{pieceState.error}</Text>;
    } else if (!Array.isArray(pieceState.items) || pieceState.items.length <= 0) {
      content = <Text style={styles.emptyText}>{pieceEmptyText}</Text>;
    } else {
      content = pieceState.items.map((item) => {
        const qInstanceId = resolvePieceQInstanceId(item);
        return (
          <NexusPieceCard
            key={String(qInstanceId || Math.random())}
            item={item}
            onPressOwner={() => handleOpenOwner(item?.owner?.user_id)}
            canResonate={canResonatePiece(item)}
            resonanceSubmitting={!!resonanceSubmittingIds[qInstanceId]}
            onPressResonance={() => handlePressPieceResonance(item)}
          />
        );
      });
    }

    return (
      <View>
        {renderPieceControls()}
        {content}
      </View>
    );
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
          <View key={item.qInstanceId} style={styles.simpleCard}>
            <View style={styles.simpleCardHeader}>
              <Text style={styles.simpleCardTitle}>{item.title}</Text>
              <Text style={styles.simpleCardMeta}>
                {formatDateLabel(item.savedAt)}
              </Text>
            </View>
            <Text style={styles.simpleCardBody}>{item.ownerDisplayName}</Text>
          </View>
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
              void loadOwnerOptions();
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
        visible={ownerPickerVisible && showPieceControls}
        transparent
        animationType="fade"
        onRequestClose={() => setOwnerPickerVisible(false)}
      >
        <View style={styles.pickerBackdrop}>
          <View style={styles.pickerCard}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>表示ユーザー</Text>
            </View>

            <ScrollView
              style={styles.pickerScroll}
              contentContainerStyle={styles.pickerScrollContent}
            >
              {ownerPickerOptions.map((option) => {
                const isActive =
                  (option.mode === OWNER_FILTER_ALL &&
                    ownerFilterMode === OWNER_FILTER_ALL) ||
                  (option.mode === OWNER_FILTER_SELF &&
                    ownerFilterMode === OWNER_FILTER_SELF) ||
                  (option.mode === OWNER_FILTER_USER &&
                    ownerFilterMode === OWNER_FILTER_USER &&
                    String(option.userId || "").trim() ===
                      String(ownerFilterUserId || "").trim());
                return (
                  <CocolonPressable
                    key={option.key}
                    style={[styles.pickerOption, isActive && styles.pickerOptionActive]}
                    onPress={() => handleSelectOwnerOption(option)}
                    accessibilityLabel={`${option.label}のPieceを表示する`}
                  >
                    <View style={styles.pickerOptionTextWrap}>
                      <Text
                        style={[
                          styles.pickerOptionText,
                          isActive && styles.pickerOptionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                      {option.meta ? (
                        <Text
                          style={[
                            styles.pickerOptionMeta,
                            isActive && styles.pickerOptionMetaActive,
                          ]}
                        >
                          {option.meta}
                        </Text>
                      ) : null}
                    </View>
                    {isActive ? (
                      <Ionicons name="checkmark" size={18} color={colors.TITLE_GOLD} />
                    ) : null}
                  </CocolonPressable>
                );
              })}
            </ScrollView>

            <View style={styles.pickerActionRow}>
              <CocolonButton
                variant="secondary"
                onPress={() => setOwnerPickerVisible(false)}
                accessibilityLabel="表示ユーザー選択を閉じる"
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
        pieceControls: {
          borderRadius: 18,
          borderWidth: 1,
          borderColor: COLORS.CARD_BORDER,
          backgroundColor: COLORS.FIELD_BG,
          paddingHorizontal: 14,
          paddingVertical: 12,
          marginBottom: 14,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        },
        controlLabel: {
          fontSize: 11,
          lineHeight: 16,
          fontWeight: "900",
          color: COLORS.TEXT_SUBTLE,
          letterSpacing: 0.3,
          marginBottom: 6,
        },
        ownerFilterButton: {
          borderRadius: 14,
          borderWidth: 1,
          borderColor: COLORS.CARD_BORDER,
          backgroundColor: COLORS.PANEL_BG,
          paddingHorizontal: 12,
          paddingVertical: 10,
        },
        ownerFilterButtonDisabled: {
          opacity: 0.72,
        },
        ownerFilterButtonContent: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        ownerFilterButtonText: {
          flex: 1,
          fontSize: 13,
          lineHeight: 18,
          fontWeight: "800",
          color: COLORS.TEXT_ON_LIGHT,
          paddingRight: 8,
        },
        ownerFilterChevron: {
          marginLeft: 6,
        },
        ownerFilterSpinner: {
          marginLeft: 6,
        },
        pieceOrderLabel: {
          marginTop: 12,
        },
        pieceSortRow: {
          flexDirection: "row",
          alignItems: "center",
        },
        pieceSortButton: {
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: COLORS.CARD_BORDER,
          backgroundColor: COLORS.PANEL_BG,
        },
        pieceSortButtonSpacer: {
          marginLeft: 8,
        },
        pieceSortButtonActive: {
          backgroundColor: COLORS.GOLD_BUTTON,
          borderColor: COLORS.GOLD_BUTTON_BORDER,
        },
        pieceSortButtonText: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: "900",
          color: COLORS.TEXT_ON_LIGHT,
        },
        pieceSortButtonTextActive: {
          color: COLORS.ACCENT_TEXT,
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
        pickerBackdrop: {
          flex: 1,
          backgroundColor: "rgba(15, 23, 42, 0.38)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        },
        pickerCard: {
          width: "100%",
          maxWidth: 380,
          maxHeight: 620,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: COLORS.BORDER_GOLD,
          backgroundColor: COLORS.PANEL_BG,
          paddingHorizontal: 18,
          paddingTop: 18,
          paddingBottom: 16,
          shadowColor: "#000",
          shadowOpacity: 0.18,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 10,
        },
        pickerHeader: {
          marginBottom: 10,
        },
        pickerTitle: {
          fontSize: 18,
          lineHeight: 24,
          fontWeight: "900",
          color: COLORS.TEXT_ON_LIGHT,
          textAlign: "center",
        },
        pickerScroll: {
          maxHeight: 420,
          width: "100%",
        },
        pickerScrollContent: {
          paddingVertical: 4,
        },
        pickerOption: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 16,
          borderWidth: 1,
          borderColor: COLORS.CARD_BORDER,
          backgroundColor: COLORS.FIELD_BG,
          paddingHorizontal: 14,
          paddingVertical: 11,
          marginBottom: 8,
        },
        pickerOptionActive: {
          borderColor: COLORS.BORDER_GOLD,
          backgroundColor: COLORS.PANEL_BG,
        },
        pickerOptionTextWrap: {
          flex: 1,
          paddingRight: 10,
        },
        pickerOptionText: {
          fontSize: 14,
          lineHeight: 20,
          fontWeight: "800",
          color: COLORS.TEXT_ON_LIGHT,
        },
        pickerOptionTextActive: {
          color: COLORS.TITLE_GOLD,
        },
        pickerOptionMeta: {
          marginTop: 3,
          fontSize: 11,
          lineHeight: 16,
          fontWeight: "700",
          color: COLORS.TEXT_SUBTLE,
        },
        pickerOptionMetaActive: {
          color: COLORS.TEXT_ON_LIGHT,
        },
        pickerActionRow: {
          marginTop: 10,
          width: "100%",
        },
      },
      ui
    )
  );
}
