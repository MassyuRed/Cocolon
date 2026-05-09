import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  deleteNexusPiece,
  getNexusPieces,
  getNexusPiecesUnreadStatus,
  markNexusEmotionLogFeedRead,
  postNexusPieceResonance,
} from "../lib/nexusApi";
import NexusHeader from "./nexus/NexusHeader";
import NexusTodayEmotionSummary from "./nexus/NexusTodayEmotionSummary";
import NexusTabBar from "./nexus/NexusTabBar";
import NexusPieceFeedSection from "./nexus/NexusPieceFeedSection";
import NexusEmotionLogSection from "./nexus/NexusEmotionLogSection";
import NexusRecommendSection from "./nexus/NexusRecommendSection";
import NexusHistorySection from "./nexus/NexusHistorySection";
import NexusOwnerPickerModal from "./nexus/NexusOwnerPickerModal";
import {
  PIECE_TUTORIAL_STEP_START,
  PIECE_TUTORIAL_STEP_END,
  OWNER_FILTER_ALL,
  OWNER_FILTER_SELF,
  OWNER_FILTER_USER,
  PIECE_ORDER_LATEST,
  PIECE_ORDER_OLDEST,
  HISTORY_ORDER_LATEST,
  HISTORY_ORDER_OLDEST,
} from "./nexus/nexusRouteModel";
import {
  normalizeEmotionRankingItems,
  normalizeEmotionLogItems,
  normalizeRecommendUsers,
  normalizeFollowListUsers,
  normalizeSavedPieces,
  normalizeTutorialPieceItems,
  normalizeDetailResonanceCount,
} from "./nexus/nexusNormalize";
import {
  resolvePieceQInstanceId,
  resolvePieceQKey,
  resolvePieceOwnerUserId,
  buildResonanceHistoryItemFromPiece,
  sortHistoryItems,
} from "./nexus/nexusHistoryModel";
import { TUTORIAL_TOTAL_STEPS } from "../tutorial/tutorialScenarioData";


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
  const selfPieceCardRef = useRef(null);
  const followedPieceCardRef = useRef(null);
  const [tutorialTargetRect, setTutorialTargetRect] = useState(null);
  const [tutorialOverlayMetrics, setTutorialOverlayMetrics] = useState(null);

  const [activeTab, setActiveTab] = useState("piece");
  const [ownerFilterMode, setOwnerFilterMode] = useState(OWNER_FILTER_ALL);
  const [ownerFilterUserId, setOwnerFilterUserId] = useState(null);
  const [ownerPickerVisible, setOwnerPickerVisible] = useState(false);
  const [ownerOptionsLoading, setOwnerOptionsLoading] = useState(false);
  const [ownerOptions, setOwnerOptions] = useState([]);
  const [pieceOrder, setPieceOrder] = useState(PIECE_ORDER_LATEST);
  const [historyOrder, setHistoryOrder] = useState(HISTORY_ORDER_LATEST);

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
    order: null,
    resonances: [],
    error: "",
  });

  const [resonanceSubmittingIds, setResonanceSubmittingIds] = useState({});
  const [pieceDeleteSubmittingIds, setPieceDeleteSubmittingIds] = useState({});

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
      return "自分のピースはまだありません。";
    }
    if (ownerFilterMode === OWNER_FILTER_USER) {
      return `${selectedOwnerLabel}のピースはまだありません。`;
    }
    return "ピースはまだありません。";
  }, [ownerFilterMode, selectedOwnerLabel]);

  const showPieceControls =
    !isTutorialMode && activeTab === "piece" && !!viewerUserId;
  const historyLoadedModeKey = useMemo(
    () => `resonances:${historyOrder}`,
    [historyOrder]
  );

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
        error: String(e?.message || "ピースを読み込めませんでした。"),
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
      const safeMode = `resonances:${historyOrder}`;
      if (isTutorialMode) {
        setHistoryState((prev) => ({
          ...prev,
          loading: false,
          loadedModes: { ...(prev.loadedModes || {}), [safeMode]: true },
          order: historyOrder,
          resonances: [],
          error: "",
        }));
        return;
      }

      setHistoryState((prev) => ({ ...prev, loading: true, error: "" }));
      try {
        const json = await getNexusResonancePieces(20, historyOrder);
        const normalized = sortHistoryItems(normalizeSavedPieces(json), historyOrder);
        setHistoryState((prev) => ({
          ...prev,
          loading: false,
          loadedModes: { ...(prev.loadedModes || {}), [safeMode]: true },
          order: historyOrder,
          resonances: normalized,
          error: "",
        }));
      } catch (e) {
        console.warn("NexusScreen: loadHistory failed", e);
        setHistoryState((prev) => ({
          ...prev,
          loading: false,
          loadedModes: { ...(prev.loadedModes || {}), [safeMode]: true },
          order: historyOrder,
          resonances: [],
          error: String(e?.message || "履歴を読み込めませんでした。"),
        }));
      }
    },
    [historyOrder, isTutorialMode]
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
    const historyOrderLoaded =
      historyState.order === historyOrder &&
      !!historyState.loadedModes?.[historyLoadedModeKey];
    if (activeTab === "history" && !historyOrderLoaded && !historyState.loading) {
      void loadHistory();
    }
  }, [
    activeTab,
    historyLoadedModeKey,
    historyOrder,
    historyState.loadedModes,
    historyState.loading,
    historyState.order,
    loadHistory,
    loadRecommend,
    recommendState.loaded,
    recommendState.loading,
  ]);

  const handlePressGuide = useCallback(() => {
    try {
      if (navigation?.navigate) {
        navigation.navigate("CocolonGuide", { screenId: "piece" });
        return;
      }
    } catch (e) {
      console.warn("NexusScreen: navigate CocolonGuide failed", e);
    }

    try {
      const parent =
        typeof navigation?.getParent === "function" ? navigation.getParent() : null;
      if (parent && typeof parent.navigate === "function") {
        parent.navigate("CocolonGuide", { screenId: "piece" });
        return;
      }
    } catch (e) {
      console.warn("NexusScreen: parent navigate CocolonGuide failed", e);
    }

    Alert.alert("ガイド", "ガイド画面を開けませんでした。");
  }, [navigation]);

  const handleOpenFollowList = useCallback(() => {
    if (isTutorialMode) return;

    const selfUserId = String(viewerUserId || "").trim();
    if (!selfUserId) {
      Alert.alert("フォローリストを開けません", "ログイン情報を取得できませんでした。");
      return;
    }

    const params = {
      viewedUserId: selfUserId,
      targetUserId: selfUserId,
      initialTab: "following",
    };

    try {
      if (navigation?.navigate) {
        navigation.navigate("FollowListScreen", params);
        return;
      }
    } catch (e) {
      console.warn("NexusScreen: navigate FollowListScreen failed", e);
    }

    try {
      const parent =
        typeof navigation?.getParent === "function" ? navigation.getParent() : null;
      if (parent && typeof parent.navigate === "function") {
        parent.navigate("FollowListScreen", params);
        return;
      }
    } catch (e) {
      console.warn("NexusScreen: parent navigate FollowListScreen failed", e);
    }

    Alert.alert("フォローリストを開けません", "フォローリスト画面を開けませんでした。");
  }, [isTutorialMode, navigation, viewerUserId]);

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

  const handleSetHistoryOrder = useCallback((nextOrder) => {
    const normalized =
      nextOrder === HISTORY_ORDER_OLDEST ? HISTORY_ORDER_OLDEST : HISTORY_ORDER_LATEST;
    setHistoryOrder((current) => (current === normalized ? current : normalized));
  }, []);

  const handleOpenTutorialFlow = useCallback(() => {
    void ensureTutorialPiecesSeed();
    setTutorialStep(17);

    try {
      navigation?.navigate?.("TutorialFlow", {
        tutorialOpenAt: Date.now(),
      });
    } catch {
      Alert.alert(
        "チュートリアルを進められません",
        "もう一度お試しください。"
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
        const nextHistoryItem = buildResonanceHistoryItemFromPiece({
          ...item,
          metrics: {
            ...(item?.metrics || {}),
            views: nextViews,
            resonances: nextResonances,
          },
          viewer_state: {
            ...(item?.viewer_state || {}),
            is_resonated: nextIsResonated,
            can_resonate: true,
          },
        });
        setHistoryState((prev) => {
          const currentRows = Array.isArray(prev.resonances) ? prev.resonances : [];
          const rowsWithoutCurrent = currentRows.filter(
            (row) => String(row?.qInstanceId || "") !== qInstanceId
          );
          const nextRows = nextHistoryItem
            ? [nextHistoryItem, ...rowsWithoutCurrent]
            : rowsWithoutCurrent;
          return {
            ...prev,
            resonances: sortHistoryItems(nextRows, historyOrder),
            loadedModes: {
              ...(prev.loadedModes || {}),
              [historyLoadedModeKey]: true,
            },
            order: historyOrder,
            error: "",
          };
        });
      } catch (e) {
        console.warn("NexusScreen: piece resonance failed", e);
        const statusCode = Number(e?.status || e?.statusCode || 0);
        const rawMessage = String(e?.message || "").trim();
        const message =
          statusCode === 403
            ? "フォローしているユーザーのピースにのみ共鳴できます。"
            : statusCode === 400 && rawMessage.toLowerCase().includes("self")
              ? "自分のピースには共鳴できません。"
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
      historyLoadedModeKey,
      historyOrder,
      isPieceResonated,
      resonanceSubmittingIds,
    ]
  );

  const handlePressPieceDelete = useCallback(
    (item) => {
      if (isTutorialMode) return;

      const qInstanceId = resolvePieceQInstanceId(item);
      const ownerUserId = resolvePieceOwnerUserId(item);
      if (!qInstanceId || !viewerUserId || ownerUserId !== viewerUserId) {
        return;
      }
      if (pieceDeleteSubmittingIds[qInstanceId]) return;

      Alert.alert(
        "ピースを削除しますか？",
        "本当に削除しますか？元に戻せません。",
        [
          { text: "キャンセル", style: "cancel" },
          {
            text: "削除",
            style: "destructive",
            onPress: async () => {
              setPieceDeleteSubmittingIds((prev) => ({
                ...(prev || {}),
                [qInstanceId]: true,
              }));

              try {
                await deleteNexusPiece({ qInstanceId });
                setPieceState((prev) => ({
                  ...prev,
                  items: Array.isArray(prev.items)
                    ? prev.items.filter(
                        (row) => resolvePieceQInstanceId(row) !== qInstanceId
                      )
                    : prev.items,
                }));
                setHistoryState((prev) => ({
                  ...prev,
                  resonances: Array.isArray(prev.resonances)
                    ? prev.resonances.filter(
                        (row) => String(row?.qInstanceId || "") !== qInstanceId
                      )
                    : prev.resonances,
                }));
              } catch (e) {
                console.warn("NexusScreen: piece delete failed", e);
                const statusCode = Number(e?.status || e?.statusCode || 0);
                const rawMessage = String(e?.message || "").trim();
                const message =
                  statusCode === 403
                    ? "自分のピースだけ削除できます。"
                    : rawMessage || "ピースを削除できませんでした。";
                Alert.alert("削除できません", message);
              } finally {
                setPieceDeleteSubmittingIds((prev) => {
                  const next = { ...(prev || {}) };
                  delete next[qInstanceId];
                  return next;
                });
              }
            },
          },
        ]
      );
    },
    [isTutorialMode, pieceDeleteSubmittingIds, viewerUserId]
  );

  const getTutorialTargetRef = useCallback(() => {
    if (!isNexusTutorialStep) return null;

    switch (tutorialStep) {
      case 14:
        return pieceTabRef;
      case 15:
        return selfPieceCardRef;
      case 16:
        return followedPieceCardRef;
      default:
        return null;
    }
  }, [isNexusTutorialStep, tutorialStep]);

  const tutorialOverlayConfig = useMemo(() => {
    if (!isNexusTutorialStep) return null;

    switch (tutorialStep) {
      case 13:
        return {
          step: 13,
          mode: "info",
          title: "ピース画面",
          message:
            "ピース画面の説明をします。\n\n自分やフォローしているユーザーのピースや感情通知を閲覧することができます。",
          nextLabel: "投稿タブへ",
          onNext: () => setTutorialStep(14),
          disableSpotlight: true,
          dimOpacity: 0,
        };
      case 14:
        return {
          step: 14,
          mode: "info",
          title: "投稿タブ",
          message:
            "投稿タブでは、自分やフォローしているユーザーのピースを一覧で確認できます。",
          nextLabel: "自分のピースへ",
          onNext: () => setTutorialStep(15),
        };
      case 15:
        return {
          step: 15,
          mode: "info",
          title: "自分のピース",
          message:
            "先ほどの入力から生成した自分のピースです。\n\n問いと答えとして、読みやすく整えています。",
          nextLabel: "Userのピースへ",
          onNext: () => setTutorialStep(16),
        };
      case 16:
        return {
          step: 16,
          mode: "info",
          title: "フォロー中ユーザーのピース",
          message:
            "フォロー中ユーザーのピースも同じように閲覧できます。\n\n次は、感情入力からつながる3つの体験を表で見ます。",
          nextLabel: "つながり表を見る",
          onNext: handleOpenTutorialFlow,
          cardPlacement: "top",
        };
      default:
        return null;
    }
  }, [handleOpenTutorialFlow, isNexusTutorialStep, tutorialStep, setTutorialStep]);

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

  const renderActiveTab = () => {
    switch (activeTab) {
      case "emotion_log":
        return (
          <NexusEmotionLogSection
            emotionLogState={emotionLogState}
            styles={styles}
            colors={colors}
            ui={ui}
          />
        );
      case "recommend":
        return (
          <NexusRecommendSection
            recommendState={recommendState}
            styles={styles}
            colors={colors}
            handleOpenOwner={handleOpenOwner}
          />
        );
      case "history":
        return (
          <NexusHistorySection
            isTutorialMode={isTutorialMode}
            historyState={historyState}
            historyOrder={historyOrder}
            historyLoadedModeKey={historyLoadedModeKey}
            styles={styles}
            colors={colors}
            handleSetHistoryOrder={handleSetHistoryOrder}
            handleOpenOwner={handleOpenOwner}
            canResonatePiece={canResonatePiece}
            resonanceSubmittingIds={resonanceSubmittingIds}
            handlePressPieceResonance={handlePressPieceResonance}
          />
        );
      case "piece":
      default:
        return (
          <NexusPieceFeedSection
            isTutorialMode={isTutorialMode}
            tutorialPieceItems={tutorialPieceItems}
            selfPieceCardRef={selfPieceCardRef}
            followedPieceCardRef={followedPieceCardRef}
            handleOpenOwner={handleOpenOwner}
            showPieceControls={showPieceControls}
            styles={styles}
            colors={colors}
            ownerOptionsLoading={ownerOptionsLoading}
            selectedOwnerLabel={selectedOwnerLabel}
            setOwnerPickerVisible={setOwnerPickerVisible}
            pieceOrder={pieceOrder}
            handleSetPieceOrder={handleSetPieceOrder}
            pieceState={pieceState}
            pieceEmptyText={pieceEmptyText}
            viewerUserId={viewerUserId}
            canResonatePiece={canResonatePiece}
            resonanceSubmittingIds={resonanceSubmittingIds}
            handlePressPieceResonance={handlePressPieceResonance}
            pieceDeleteSubmittingIds={pieceDeleteSubmittingIds}
            handlePressPieceDelete={handlePressPieceDelete}
          />
        );
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
        <NexusHeader
          titleRef={titleRef}
          styles={styles}
          colors={colors}
          isTutorialMode={isTutorialMode}
          viewerUserId={viewerUserId}
          handleOpenFollowList={handleOpenFollowList}
          handlePressGuide={handlePressGuide}
          onRefresh={() => {
            void refreshNexusUnreadState();
            void loadRanking();
            void loadOwnerOptions();
            if (activeTab === "piece") void loadPieces();
            if (activeTab === "emotion_log") void loadEmotionLog();
            if (activeTab === "recommend") void loadRecommend();
            if (activeTab === "history") void loadHistory();
          }}
        />


        <NexusTodayEmotionSummary
          visible={!isTutorialMode}
          rankingState={rankingState}
          styles={styles}
          colors={colors}
        />

        <NexusTabBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pieceTabRef={pieceTabRef}
          pieceTabUnread={pieceTabUnread}
          emotionLogTabUnread={emotionLogTabUnread}
          styles={styles}
        />

        <View style={styles.tabContent}>{renderActiveTab()}</View>
      </ScrollView>

      <NexusOwnerPickerModal
        visible={ownerPickerVisible && showPieceControls}
        onClose={() => setOwnerPickerVisible(false)}
        styles={styles}
        colors={colors}
        ownerPickerOptions={ownerPickerOptions}
        ownerFilterMode={ownerFilterMode}
        ownerFilterUserId={ownerFilterUserId}
        handleSelectOwnerOption={handleSelectOwnerOption}
      />

      {tutorialOverlayConfig ? (
        <TutorialOverlay
          visible={isNexusTutorialStep}
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
          cardPlacement={tutorialOverlayConfig.cardPlacement}
          dimOpacity={tutorialOverlayConfig.dimOpacity}
          blockBackgroundTouches={tutorialOverlayConfig.blockBackgroundTouches !== false}
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
        panelTitleRow: {
          flexDirection: "row",
          alignItems: "center",
        },
        guideTitleButton: {
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
        panelHeaderActions: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
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
        followListButton: {
          marginRight: 8,
        },
        headerButtonDisabled: {
          opacity: 0.52,
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
          color: text.description ?? COLORS.TEXT_SUBTLE,
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
          marginBottom: 14,
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
          justifyContent: "center",
        },
        ownerFilterSideSlot: {
          width: 24,
          alignItems: "flex-end",
          justifyContent: "center",
        },
        ownerFilterButtonText: {
          flex: 1,
          fontSize: 13,
          lineHeight: 18,
          fontWeight: "800",
          color: COLORS.TEXT_ON_LIGHT,
          textAlign: "center",
        },
        pieceSortRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          marginTop: 10,
        },
        pieceSortButton: {
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: COLORS.CARD_BORDER,
          backgroundColor: COLORS.FIELD_BG,
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
          color: text.description ?? COLORS.TEXT_SUBTLE,
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
          paddingVertical: 10,
          paddingHorizontal: 12,
        },
        emotionLogHeaderRow: {
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        },
        emotionLogName: {
          flex: 1,
          minWidth: 0,
          paddingRight: 8,
          fontWeight: "700",
          color: COLORS.TEXT_ON_LIGHT,
          fontSize: 15,
        },
        emotionLogBadgeArea: {
          marginTop: 8,
          alignItems: "center",
        },
        emotionLogNoEmotion: {
          width: "100%",
          fontSize: 12,
          color: text.description ?? COLORS.TEXT_SUBTLE,
          textAlign: "center",
        },
        emotionLogBadgeRow: {
          width: "100%",
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
          color: text.description ?? COLORS.TEXT_SUBTLE,
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
          color: text.description ?? COLORS.TEXT_SUBTLE,
        },
        historyControls: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          marginBottom: 12,
        },
        historySortRow: {
          flexDirection: "row",
          alignItems: "center",
        },
        historySortButton: {
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: COLORS.CARD_BORDER,
          backgroundColor: COLORS.FIELD_BG,
        },
        historySortButtonSpacer: {
          marginLeft: 8,
        },
        historySortButtonActive: {
          backgroundColor: COLORS.GOLD_BUTTON,
          borderColor: COLORS.GOLD_BUTTON_BORDER,
        },
        historySortButtonText: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: "900",
          color: COLORS.TEXT_ON_LIGHT,
        },
        historySortButtonTextActive: {
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
          color: text.description ?? COLORS.TEXT_SUBTLE,
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
