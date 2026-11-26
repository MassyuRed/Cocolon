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
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import TutorialOverlay, {
  syncTutorialSpotlightTarget,
  waitForTutorialFrames,
} from "../components/TutorialOverlay";
import CocolonButton from "../components/CocolonButton";
import { useTutorial } from "../TutorialContext";
import { useAuth } from "../AuthContext";
import { useOwnerRequestScope } from "../hooks/useOwnerRequestScope";
import { useAppRuntime } from "../AppRuntimeContext";
import { useUnread } from "../UnreadContext";
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import {
  getNexusResonancePieces,
  getNexusEmotionLog,
  getNexusEmotionLogUnreadStatus,
  getNexusFollowingUsers,
  deleteNexusPiece,
  getNexusPieces,
  getNexusPiecesUnreadStatus,
  markNexusEmotionLogFeedRead,
  postNexusPieceResonance,
  setPublishedPieceResonance,
} from "../lib/nexusApi";
import NexusHeader from "./nexus/NexusHeader";
import NexusTabBar from "./nexus/NexusTabBar";
import NexusPieceFeedSection from "./nexus/NexusPieceFeedSection";
import NexusEmotionLogSection from "./nexus/NexusEmotionLogSection";
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
  normalizeEmotionLogItems,
  normalizeFollowListUsers,
  normalizeSavedPieces,
  normalizeTutorialPieceItems,
  normalizeDetailResonanceCount,
} from "./nexus/nexusNormalize";
import {
  resolvePieceQInstanceId,
  resolvePieceQKey,
  isPieceV2Post,
  isPieceResonated,
  readPieceViewerState,
  resolvePieceOwnerUserId,
  applyPieceResonanceReceipt,
  reconcileResonanceHistory,
} from "./nexus/nexusHistoryModel";
import { TUTORIAL_TOTAL_STEPS } from "../tutorial/tutorialScenarioData";

const EMPTY_EMOTION_LOG = { loading: false, loaded: false, items: [], error: "" };
const LOADING_EMOTION_LOG = { ...EMPTY_EMOTION_LOG, loading: true };
const LOADING_HISTORY = { loading: true, loadedModes: {}, order: null, resonances: [], error: "" };
const HISTORY_LIMIT = 20;

export default function NexusScreen({ navigation }) {
  const { colors, themeName } = useTheme();
  const { getFeatureUnread, setUnread } = useUnread();
  const { user, initializing: authInitializing, authOwnerGeneration } = useAuth();
  const { isFeatureEnabled } = useAppRuntime();
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
  const { scope: ownerRequest, isCurrent: isOwnerCurrent } = useOwnerRequestScope(viewerUserId, authOwnerGeneration);
  const canReadOwnPieces = !authInitializing && !!viewerUserId && !isTutorialMode &&
    isFeatureEnabled("piece_v2_owner_read_enabled", false) === true;
  const ownerHistoryEntry = useRef(null);
  if (!ownerHistoryEntry.current || ownerHistoryEntry.current.owner !== viewerUserId ||
      ownerHistoryEntry.current.enabled !== canReadOwnPieces) {
    ownerHistoryEntry.current = { owner: viewerUserId, enabled: canReadOwnPieces };
  }
  const renderedOwnerHistoryEntry = ownerHistoryEntry.current;
  const ownerHistoryMounted = useRef(false);
  useEffect(() => {
    ownerHistoryMounted.current = true;
    return () => { ownerHistoryMounted.current = false; };
  }, []);
  const handleOpenOwnerHistory = useCallback(() => {
    if (!ownerHistoryMounted.current || navigation?.isFocused?.() === false ||
        ownerHistoryEntry.current !== renderedOwnerHistoryEntry ||
        !renderedOwnerHistoryEntry.enabled) return;
    navigation.navigate("PieceOwnerHistory", { savedPiece: null });
  }, [navigation, renderedOwnerHistoryEntry]);
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
  const pieceReadScopeRef = useRef(null);
  if (!pieceReadScopeRef.current || pieceReadScopeRef.current.owner !== ownerRequest ||
      pieceReadScopeRef.current.filter !== ownerFilterMode || pieceReadScopeRef.current.target !== ownerFilterUserId ||
      pieceReadScopeRef.current.order !== pieceOrder || pieceReadScopeRef.current.tutorial !== isTutorialMode ||
      pieceReadScopeRef.current.tab !== activeTab) {
    pieceReadScopeRef.current = { owner: ownerRequest, filter: ownerFilterMode, target: ownerFilterUserId,
      order: pieceOrder, tutorial: isTutorialMode, tab: activeTab };
  }
  const pieceReadScope = pieceReadScopeRef.current;
  const historyReadScopeRef = useRef(null);
  if (!historyReadScopeRef.current || historyReadScopeRef.current.owner !== ownerRequest ||
      historyReadScopeRef.current.order !== historyOrder || historyReadScopeRef.current.tutorial !== isTutorialMode ||
      historyReadScopeRef.current.tab !== activeTab) {
    historyReadScopeRef.current = { owner: ownerRequest, order: historyOrder, tutorial: isTutorialMode, tab: activeTab };
  }
  const historyReadScope = historyReadScopeRef.current;
  const emotionLogReadScope = useMemo(() => ({ ownerRequest, activeTab, isTutorialMode }),
    [ownerRequest, activeTab, isTutorialMode]);
  const readSequences = useRef({ pieces: 0, history: 0, owners: 0, emotions: 0 });
  const unreadRead = useRef(null);
  const resonanceActivity = useMemo(() => ({ feedRead: null, historyRead: null, submitting: new Set() }), [ownerRequest]);

  const tutorialPieceItems = useMemo(
    () => normalizeTutorialPieceItems(tutorialPieces),
    [tutorialPieces]
  );
  const isNexusTutorialStep =
    !!isTutorialMode &&
    tutorialStep >= PIECE_TUTORIAL_STEP_START &&
    tutorialStep <= PIECE_TUTORIAL_STEP_END;

  const [pieceState, setPieceState] = useState({
    loading: true,
    items: [],
    error: "",
  });
  const [emotionLogResult, setEmotionLogState] = useState(null);
  const emotionLogState = emotionLogResult?.scope === emotionLogReadScope
    ? emotionLogResult
    : !isTutorialMode && (authInitializing || viewerUserId) ? LOADING_EMOTION_LOG : EMPTY_EMOTION_LOG;
  const [historyResult, setHistoryState] = useState(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const historyState = historyResult?.scope === historyReadScope ? historyResult : LOADING_HISTORY;

  const [resonanceSubmittingIds, setResonanceSubmittingIds] = useState({});
  const [pieceDeleteSubmittingIds, setPieceDeleteSubmittingIds] = useState({});
  useEffect(() => {
    setResonanceSubmittingIds({});
    setPieceDeleteSubmittingIds({});
  }, [ownerRequest]);

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
    if (!isOwnerCurrent(ownerRequest)) return null;
    if (isTutorialMode) {
      setUnread("Piece", "piecesNew", false);
      return false;
    }

    try {
      const json = await getNexusPiecesUnreadStatus(ownerRequest.options);
      if (!isOwnerCurrent(ownerRequest)) return null;
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
  }, [isTutorialMode, setUnread, ownerRequest, isOwnerCurrent]);

  const refreshEmotionLogUnreadState = useCallback(async () => {
    if (!isOwnerCurrent(ownerRequest)) return null;
    if (isTutorialMode) {
      setUnread("EmotionLog", "feed", false);
      setUnread("EmotionLog", "requests", false);
      return { feed: false, requests: false };
    }

    try {
      const json = await getNexusEmotionLogUnreadStatus(ownerRequest.options);
      if (!isOwnerCurrent(ownerRequest)) return null;
      const nextFeed = !!json?.feed_unread;
      const nextRequests = !!json?.requests_unread;
      setUnread("EmotionLog", "feed", nextFeed);
      setUnread("EmotionLog", "requests", nextRequests);
      return { feed: nextFeed, requests: nextRequests };
    } catch (e) {
      console.warn("NexusScreen: refreshEmotionLogUnreadState failed", e);
      return null;
    }
  }, [isTutorialMode, setUnread, ownerRequest, isOwnerCurrent]);

  const refreshNexusUnreadState = useCallback(async () => {
    if (!isOwnerCurrent(ownerRequest)) return;
    const current = unreadRead.current;
    if (current?.scope === ownerRequest && current.isTutorialMode === isTutorialMode) return current.promise;
    const request = { scope: ownerRequest, isTutorialMode, promise: Promise.all([
      refreshPieceUnreadState(), refreshEmotionLogUnreadState(),
    ]) };
    unreadRead.current = request;
    try { await request.promise; }
    finally { if (unreadRead.current === request) unreadRead.current = null; }
  }, [isOwnerCurrent, ownerRequest, isTutorialMode, refreshEmotionLogUnreadState, refreshPieceUnreadState]);

  const loadOwnerOptions = useCallback(async () => {
    if (!isOwnerCurrent(ownerRequest)) return;
    const sequence = ++readSequences.current.owners;
    const isFresh = () => isOwnerCurrent(ownerRequest) && sequence === readSequences.current.owners;
    if (isTutorialMode || authInitializing || !viewerUserId) {
      setOwnerOptions([]);
      setOwnerOptionsLoading(false);
      return;
    }

    setOwnerOptions(baseOwnerOptions);
    setOwnerOptionsLoading(true);
    try {
      const json = await getNexusFollowingUsers(viewerUserId, 1000, ownerRequest.options);
      if (!isFresh()) return;
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
      if (!isFresh()) return;
      console.warn("NexusScreen: loadOwnerOptions failed", e);
      setOwnerOptions(baseOwnerOptions);
    } finally {
      if (isFresh()) setOwnerOptionsLoading(false);
    }
  }, [authInitializing, baseOwnerOptions, isTutorialMode, viewerUserId, ownerRequest, isOwnerCurrent]);

  const loadPieces = useCallback(async () => {
    if (isTutorialMode) {
      setPieceState({
        loading: false,
        items: tutorialPieceItems,
        error: "",
      });
      return;
    }
    if (navigation?.isFocused?.() === false || !isOwnerCurrent(ownerRequest)) return;
    const sequence = ++readSequences.current.pieces;
    const isFresh = () => isOwnerCurrent(ownerRequest) && pieceReadScopeRef.current === pieceReadScope &&
      sequence === readSequences.current.pieces;

    if (authInitializing) {
      setPieceState((prev) => ({ ...prev, loading: true, error: "" }));
      return;
    }

    const params = {
      sort: pieceOrder,
      limit: 20,
      include_piece_v2: true,
      include_piece_v2_resonance: true,
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

    const receipts = new Map();
    resonanceActivity.feedRead = receipts;
    setPieceState({ scope: pieceReadScope, loading: true, items: [], error: "" });
    try {
      const json = await getNexusPieces(params, ownerRequest.options);
      if (!isFresh()) return;
      const items = (Array.isArray(json?.items) ? json.items : []).map((row) => {
        const receipt = receipts.get(resolvePieceQInstanceId(row));
        return receipt ? applyPieceResonanceReceipt(row, receipt) : row;
      });
      setPieceState({ scope: pieceReadScope, loading: false, items, error: "" });
    } catch (e) {
      if (!isFresh()) return;
      console.warn("NexusScreen: loadPieces failed", e);
      setPieceState({
        scope: pieceReadScope,
        loading: false,
        items: [],
        error: String(e?.message || "ピースを読み込めませんでした。"),
      });
    } finally {
      if (resonanceActivity.feedRead === receipts) resonanceActivity.feedRead = null;
    }
  }, [
    authInitializing,
    isTutorialMode,
    ownerFilterMode,
    ownerFilterUserId,
    pieceOrder,
    tutorialPieceItems,
    viewerUserId,
    ownerRequest, isOwnerCurrent, pieceReadScope, navigation, resonanceActivity,
  ]);

  const loadEmotionLog = useCallback(async () => {
    if (isTutorialMode) {
      setEmotionLogState({
        ...EMPTY_EMOTION_LOG,
        scope: emotionLogReadScope,
        loaded: true,
      });
      return;
    }
    if (navigation?.isFocused?.() === false || !isOwnerCurrent(ownerRequest)) return;
    const sequence = ++readSequences.current.emotions;
    const isFresh = () => isOwnerCurrent(ownerRequest) && sequence === readSequences.current.emotions;

    setEmotionLogState({ ...LOADING_EMOTION_LOG, scope: emotionLogReadScope });
    try {
      const json = await getNexusEmotionLog(20, ownerRequest.options);
      if (!isFresh()) return;
      setEmotionLogState({
        ...EMPTY_EMOTION_LOG,
        scope: emotionLogReadScope,
        loaded: true,
        items: normalizeEmotionLogItems(json),
      });
    } catch (e) {
      if (!isFresh()) return;
      console.warn("NexusScreen: loadEmotionLog failed", e);
      setEmotionLogState({
        ...EMPTY_EMOTION_LOG,
        scope: emotionLogReadScope,
        loaded: true,
        error: String(e?.message || "感情通知を読み込めませんでした。"),
      });
    }
  }, [isTutorialMode, ownerRequest, isOwnerCurrent, navigation, emotionLogReadScope]);

  const loadHistory = useCallback(
    async () => {
      if (navigation?.isFocused?.() === false || !isOwnerCurrent(ownerRequest)) return;
      const sequence = ++readSequences.current.history;
      const isFresh = () => isOwnerCurrent(ownerRequest) && historyReadScopeRef.current === historyReadScope &&
        sequence === readSequences.current.history;
      const safeMode = `resonances:${historyOrder}`;
      if (isTutorialMode) {
        setHistoryState({
          scope: historyReadScope,
          loading: false,
          loadedModes: { [safeMode]: true },
          order: historyOrder,
          resonances: [],
          error: "",
        });
        return;
      }

      const receipts = new Map();
      resonanceActivity.historyRead = receipts;
      const readRows = async () => normalizeSavedPieces(await getNexusResonancePieces(HISTORY_LIMIT, historyOrder, {
        ...ownerRequest.options,
        includePieceV2: true,
      }));
      setHistoryState({ ...LOADING_HISTORY, scope: historyReadScope });
      try {
        const missedConfirmedWrite = (rows) => {
          const loadedIds = new Set(rows.map(resolvePieceQInstanceId));
          return [...receipts].some(([id, receipt]) => receipt.resonated && !loadedIds.has(id));
        };
        let rows = await readRows();
        if (!isFresh()) return;
        while (missedConfirmedWrite(rows)) {
          // A save completed during the read. Recheck access before displaying it in history.
          receipts.clear();
          rows = await readRows();
          if (!isFresh()) return;
        }
        setHistoryState({
          scope: historyReadScope,
          loading: false,
          loadedModes: { [safeMode]: true },
          order: historyOrder,
          resonances: reconcileResonanceHistory(rows, receipts, historyOrder, HISTORY_LIMIT),
          error: "",
        });
      } catch (e) {
        if (!isFresh()) return;
        console.warn("NexusScreen: loadHistory failed", e);
        setHistoryState({
          scope: historyReadScope,
          loading: false,
          loadedModes: { [safeMode]: true },
          order: historyOrder,
          resonances: [],
          error: String(e?.message || "履歴を読み込めませんでした。"),
        });
      } finally {
        if (resonanceActivity.historyRead === receipts) resonanceActivity.historyRead = null;
      }
    },
    [historyOrder, isTutorialMode, ownerRequest, isOwnerCurrent, historyReadScope, navigation, resonanceActivity]
  );

  useEffect(() => {
    if (activeTab === "piece") void loadPieces();
  }, [activeTab, loadPieces]);

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
    if (activeTab !== "emotion_log" || navigation?.isFocused?.() === false || !isOwnerCurrent(ownerRequest)) return;
    if (!emotionLogState.loaded || emotionLogState.loading || emotionLogState.error) return;
    if (!prefetchedEmotionLogUnread || !latestEmotionLogCreatedAt) return;
    let cancelled = false;

    (async () => {
      try {
        await markNexusEmotionLogFeedRead(latestEmotionLogCreatedAt, ownerRequest.options);
        if (cancelled || !isOwnerCurrent(ownerRequest)) return;
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
    ownerRequest, isOwnerCurrent, navigation,
  ]);

  useEffect(() => {
    void refreshNexusUnreadState();
  }, [refreshNexusUnreadState]);

  useEffect(() => {
    if (!navigation?.addListener) return undefined;
    const unsubscribe = navigation.addListener("focus", () => {
      void refreshNexusUnreadState();
      void loadOwnerOptions();
      if (activeTab === "piece") void loadPieces();
      if (activeTab === "emotion_log") void loadEmotionLog();
      if (activeTab === "history") void loadHistory();
    });
    const unsubscribeBlur = navigation.addListener("blur", () => {
      if (isTutorialMode) return;
      readSequences.current.pieces += 1;
      readSequences.current.emotions += 1;
      readSequences.current.history += 1;
      setPieceState({ loading: true, items: [], error: "" });
      setEmotionLogState(null);
      setHistoryState(null);
    });
    return () => {
      unsubscribe?.();
      unsubscribeBlur?.();
    };
  }, [navigation, refreshNexusUnreadState, activeTab, isTutorialMode, loadOwnerOptions,
      loadPieces, loadEmotionLog, loadHistory]);

  useEffect(() => {
    if (activeTab !== "emotion_log") return undefined;
    void loadEmotionLog();
    return () => { readSequences.current.emotions += 1; };
  }, [activeTab, loadEmotionLog]);

  useEffect(() => {
    if (activeTab === "history") void loadHistory();
  }, [activeTab, historyRefresh, loadHistory]);

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

  const canResonatePiece = useCallback(
    (item) => {
      if (isTutorialMode) return false;
      const ownerUserId = resolvePieceOwnerUserId(item);
      if (!viewerUserId || !ownerUserId || ownerUserId === viewerUserId) {
        return false;
      }

      const viewerState = readPieceViewerState(item);
      const serverAllows = viewerState.can_resonate ?? viewerState.canResonate;
      if (typeof serverAllows === "boolean") return serverAllows;
      return !isPieceV2Post(item) && canResonatePieceOwner(ownerUserId);
    },
    [canResonatePieceOwner, isTutorialMode, viewerUserId]
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
      if (!item || !isOwnerCurrent(ownerRequest) || !canResonatePiece(item)) return;

      const qInstanceId = resolvePieceQInstanceId(item);
      if (!qInstanceId || resonanceActivity.submitting.has(qInstanceId)) return;

      const requestedResonance = !isPieceResonated(item);
      resonanceActivity.submitting.add(qInstanceId);
      setResonanceSubmittingIds((previous) => ({ ...previous, [qInstanceId]: true }));

      try {
        const published = isPieceV2Post(item);
        const result = published
          ? await setPublishedPieceResonance({ qInstanceId, resonated: requestedResonance }, ownerRequest.options)
          : await postNexusPieceResonance({
            qInstanceId,
            qKey: resolvePieceQKey(item),
            resonated: requestedResonance,
          }, ownerRequest.options);
        if (!isOwnerCurrent(ownerRequest)) return;
        if (published && (result?.q_instance_id !== qInstanceId ||
            typeof result.resonated !== "boolean" || !Number.isInteger(result.resonances) || result.resonances < 0)) {
          throw new Error("共鳴の更新結果を確認できませんでした。");
        }

        const resonated = typeof result?.resonated === "boolean" ? result.resonated : requestedResonance;
        const currentCount = normalizeDetailResonanceCount(item?.metrics?.resonances ?? item?.resonances);
        const countChange = Number(resonated) - Number(!requestedResonance);
        const receipt = {
          resonated,
          resonances: result?.resonances == null
            ? Math.max(0, currentCount + countChange)
            : normalizeDetailResonanceCount(result.resonances),
          views: result?.views == null ? null : normalizeDetailResonanceCount(result.views),
        };
        resonanceActivity.feedRead?.set(qInstanceId, receipt);
        resonanceActivity.historyRead?.set(qInstanceId, receipt);

        setPieceState((previous) => ({
          ...previous,
          items: previous.items.map((row) => resolvePieceQInstanceId(row) === qInstanceId
            ? applyPieceResonanceReceipt(row, receipt)
            : row),
        }));
        if (resonated && !resonanceActivity.historyRead && historyReadScopeRef.current?.tab === "history") {
          setHistoryRefresh((previous) => previous + 1);
        }
        setHistoryState((previous) => {
          if (previous?.scope !== historyReadScopeRef.current || previous.loading) return previous;
          return {
            ...previous,
            resonances: reconcileResonanceHistory(
              previous.resonances,
              new Map([[qInstanceId, receipt]]),
              previous.order,
              HISTORY_LIMIT
            ),
          };
        });
      } catch (e) {
        if (!isOwnerCurrent(ownerRequest)) return;
        console.warn("NexusScreen: piece resonance failed", e);
        const statusCode = Number(e?.status || e?.statusCode || 0);
        const rawMessage = String(e?.message || "").trim();
        const message =
          statusCode === 403
            ? "フォローしているユーザーのピースにのみ共鳴できます。"
            : statusCode === 400 && rawMessage.toLowerCase().includes("self")
              ? "自分のピースには共鳴できません。"
              : rawMessage || "共鳴を更新できませんでした。";
        Alert.alert("共鳴を更新できません", message);
      } finally {
        resonanceActivity.submitting.delete(qInstanceId);
        if (isOwnerCurrent(ownerRequest)) {
          setResonanceSubmittingIds((previous) => {
            const next = { ...previous };
            delete next[qInstanceId];
            return next;
          });
        }
      }
    },
    [canResonatePiece, ownerRequest, isOwnerCurrent, resonanceActivity]
  );

  const handlePressPieceDelete = useCallback(
    (item) => {
      if (isTutorialMode || isPieceV2Post(item) || !isOwnerCurrent(ownerRequest)) return;

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
              if (!isOwnerCurrent(ownerRequest)) return;
              setPieceDeleteSubmittingIds((prev) => ({
                ...(prev || {}),
                [qInstanceId]: true,
              }));

              try {
                await deleteNexusPiece({ qInstanceId }, ownerRequest.options);
                if (!isOwnerCurrent(ownerRequest)) return;
                setPieceState((prev) => ({
                  ...prev,
                  items: Array.isArray(prev.items)
                    ? prev.items.filter(
                        (row) => resolvePieceQInstanceId(row) !== qInstanceId
                      )
                    : prev.items,
                }));
                setHistoryState((prev) => prev ? ({
                  ...prev,
                  resonances: prev.resonances.filter(
                    (row) => String(row?.qInstanceId || "") !== qInstanceId,
                  ),
                }) : prev);
              } catch (e) {
                if (!isOwnerCurrent(ownerRequest)) return;
                console.warn("NexusScreen: piece delete failed", e);
                const statusCode = Number(e?.status || e?.statusCode || 0);
                const rawMessage = String(e?.message || "").trim();
                const message =
                  statusCode === 403
                    ? "自分のピースだけ削除できます。"
                    : rawMessage || "ピースを削除できませんでした。";
                Alert.alert("削除できません", message);
              } finally {
                if (!isOwnerCurrent(ownerRequest)) return;
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
    [isTutorialMode, pieceDeleteSubmittingIds, viewerUserId, ownerRequest, isOwnerCurrent]
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
            "フォロー中ユーザーのピースも同じように閲覧できます。\n\n次は、感情入力からつながる4つの体験を表で見ます。",
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
            pieceState={pieceState.scope === pieceReadScope
              ? pieceState
              : { loading: authInitializing || !!viewerUserId, items: [], error: "" }}
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
    <SafeAreaView edges={["left", "right"]} ref={screenRootRef} collapsable={false} style={styles.container}>
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
          ui={ui}
          canReadOwnPieces={canReadOwnPieces}
          handleOpenOwnerHistory={handleOpenOwnerHistory}
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
        <CocolonButton variant="secondary" style={styles.guideFooter} title="ピースについて" onPress={handlePressGuide} />
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
      backgroundColor: COLORS.BG_SILVER,
    },
        scrollContainer: {
      paddingTop: 16,
      paddingBottom: 24,
      paddingHorizontal: 20,
      alignItems: "stretch",
      width: '100%',
      maxWidth: 680,
      alignSelf: 'center',
    },
        guideFooter: { marginTop: 16 },
        ownerHistoryButton: {
      minHeight: 48,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 16,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      justifyContent: 'center',
    },
        ownerHistoryButtonText: {
      color: COLORS.ACCENT_TEXT,
    },
        tabBar: {
      flexDirection: "row",
      alignItems: 'stretch',
      justifyContent: "space-between",
      marginBottom: 16,
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 24,
      padding: 4,
      gap: 4,
      borderWidth: 1,
      borderColor: ui.sectionFrame.borderColor,
    },
        tabItemWrap: {
      flex: 1,
      minWidth: 0,
    },
        tabItem: {
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 0,
      paddingHorizontal: 0,
      minHeight: 48,
      paddingVertical: 0,
      width: '100%',
    },
        tabLabelWrap: {
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: 10,
      width: "100%",
      minHeight: 48,
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderRadius: 20,
    },
        tabLabelRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: 'wrap',
      gap: 4,
    },
        tabLabelWrapActive: {
      backgroundColor: COLORS.GOLD_BUTTON,
    },
        tabLabelText: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
      textAlign: 'center',
    },
        tabLabelTextActive: {
      color: COLORS.ACCENT_TEXT,
    },
        tabUnreadBadge: {
      marginLeft: 0,
    },
        tabContent: {
          marginTop: 2,
        },
        pieceControls: {
      marginBottom: 16,
    },
        ownerFilterButton: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
      minHeight: 48,
    },
        ownerFilterButtonDisabled: {

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
      color: COLORS.TEXT_ON_LIGHT,
      textAlign: "center",
    },
        pieceSortRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: 'flex-start',
      marginTop: 12,
      flexWrap: 'wrap',
      gap: 8,
    },
        pieceSortButton: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      minHeight: 44,
      justifyContent: 'center',
    },
        pieceSortButtonSpacer: {
      marginLeft: 0,
    },
        pieceSortButtonActive: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
        pieceSortButtonText: {
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
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },
        errorText: {
      color: COLORS.ERROR,
    },
        subsectionTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 12,
      marginTop: 0,
    },
        emotionLogCard: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: ui.sectionFrame.borderColor,
      paddingVertical: 0,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
        emotionLogRow: {
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
        emotionLogHeaderRow: {
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: "space-between",
      gap: 6,
    },
        emotionLogName: {
      minWidth: 0,
      paddingRight: 0,
      color: COLORS.TEXT_ON_LIGHT,
    },
        emotionLogBadgeArea: {
      marginTop: 12,
      alignItems: 'flex-start',
    },
        emotionLogNoEmotion: {
      width: "100%",
      color: text.description ?? COLORS.TEXT_SUBTLE,
      textAlign: 'left',
    },
        emotionLogBadgeRow: {
      width: "100%",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: 'flex-start',
      gap: 6,
    },
        emotionLogBadge: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      marginHorizontal: 0,
      marginVertical: 0,
    },
        emotionLogBadgeText: {
    },
        emotionLogTime: {
      color: text.description ?? COLORS.TEXT_SUBTLE,
      textAlign: 'left',
    },
        emotionLogSeparator: {
      height: 1,
      backgroundColor: COLORS.CARD_BORDER,
      marginLeft: 20,
      marginRight: 20,
    },
        simpleCard: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: ui.sectionFrame.borderColor,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 20,
      paddingVertical: 16,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
      minHeight: 56,
    },
        simpleCardHeader: {
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: "space-between",
      marginBottom: 0,
      gap: 6,
    },
        simpleCardTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      paddingRight: 0,
    },
        simpleCardMeta: {
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },
        historyControls: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: 'flex-start',
      marginBottom: 16,
      flexWrap: 'wrap',
    },
        historySortRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: 'wrap',
      gap: 8,
    },
        historySortButton: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      minHeight: 44,
      justifyContent: 'center',
    },
        historySortButtonSpacer: {
      marginLeft: 0,
    },
        historySortButtonActive: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
        historySortButtonText: {
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
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
        pickerCard: {
      width: "100%",
      maxWidth: 520,
      maxHeight: '100%',
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 20,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
      flexShrink: 1,
    },
        pickerHeader: {
      marginBottom: 16,
    },
        pickerTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      textAlign: "center",
    },
        pickerScroll: {
      width: "100%",
      flexShrink: 1,
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
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 8,
      minHeight: 48,
    },
        pickerOptionActive: {
      borderColor: COLORS.ON_SURFACE_TONAL,
      backgroundColor: COLORS.SURFACE_TONAL,
    },
        pickerOptionTextWrap: {
      flex: 1,
      paddingRight: 10,
      minWidth: 0,
    },
        pickerOptionText: {
      color: COLORS.TEXT_ON_LIGHT,
    },
        pickerOptionTextActive: {
      color: COLORS.ON_SURFACE_TONAL,
    },
        pickerOptionMeta: {
      marginTop: 3,
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },
        pickerOptionMetaActive: {
      color: COLORS.ON_SURFACE_TONAL,
    },
        pickerActionRow: {
      marginTop: 16,
      width: "100%",
    },
      },
      ui, {"ownerHistoryButtonText":"button","tabLabelText":"button","ownerFilterButtonText":"button","pieceSortButtonText":"button","emptyText":"description","errorText":"description","subsectionTitle":"sectionTitle","emotionLogName":"body","emotionLogNoEmotion":"description","emotionLogBadgeText":"description","emotionLogTime":"meta","simpleCardTitle":"body","simpleCardMeta":"meta","historySortButtonText":"button","pickerTitle":"modalTitle","pickerOptionText":"body","pickerOptionMeta":"meta"}
    )
  );
}

