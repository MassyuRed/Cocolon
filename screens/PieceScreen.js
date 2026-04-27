import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import { useTheme } from "../theme/ThemeContext";
import { supabase } from "../lib/supabase";
import { getCurrentUserId } from "../lib/user";
import { useUnread } from "../UnreadContext";
import { useSubscription } from "../SubscriptionContext";
import { useTutorial } from "../TutorialContext";

// UI (Design System)
import CocolonButton from "../components/CocolonButton";
import CocolonPressable from "../components/CocolonPressable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TutorialOverlay, {
  measureTutorialTarget,
  syncTutorialSpotlightTarget,
  waitForTutorialFrames,
} from "../components/TutorialOverlay";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { apiFetch, API_BASE_URL } from "../lib/apiClient";
import { PIECE_WIRE, readPieceResonancesTotal, readPieceViewCount, readShareCode } from "../lib/compat/legacyWireContracts";
import { MenuActionCard } from "./MenuActionCardCommon";

/**
 * PieceScreen (Home)
 * -------------------
 * - Piece の「Home」画面として、軽い導線のみを提供します
 *   - フォロー切替（Piece対象ユーザー切替）
 *   - 履歴導線（Resonance一覧へ）
 *   - おすすめ導線（現状はモーダルのまま）
 *   - 「Pieceを開く」ボタン（→ PieceLibraryScreen へ）
 */

const PANEL_MIN_HEIGHT = 690;

// Recommend users endpoint (MashOS)
const API_BASE = API_BASE_URL;
const PIECE_RECOMMEND_USERS_ENDPOINT = `${API_BASE}${PIECE_WIRE.routes.recommendUsers}`;

const GLOBAL_SUMMARY_ENDPOINT = `${API_BASE}/global_summary`;
const GLOBAL_SUMMARY_PASSIVE_ENDPOINT = `${GLOBAL_SUMMARY_ENDPOINT}?mode=ready_first`;
const GLOBAL_SUMMARY_REQUEST_TIMEOUT_MS = 8000;
const GLOBAL_SUMMARY_MIN_REFRESH_INTERVAL_MS = 60 * 1000;

const TUTORIAL_PIECE_QUESTION = "理想の休日の過ごし方は？";
const PIECE_TUTORIAL_STEP_START = 12;
const PIECE_TUTORIAL_STEP_END = 15;
const TUTORIAL_TOTAL_STEPS = 21;

const TUTORIAL_MOCK_PIECES = Object.freeze([
  {
    id: "tutorial-piece-mock-1",
    q_instance_id: "tutorial-q-mock-1",
    q_key: "tutorial-holiday",
    title: TUTORIAL_PIECE_QUESTION,
    body:
      "朝は少しゆっくり起きて、好きな音楽を流しながらコーヒーを飲みます。午後は本屋か静かなカフェで過ごして、夜は早めに眠れる休日が理想です。",
    owner_user_id: "tutorial-follow-1",
    display_name: "User",
    share_code: "HANAKO123",
    is_tutorial: true,
    tutorial_kind: "mock",
    created_at: "2026-01-01T09:00:00.000Z",
    resonances: 4,
    views: 12,
    is_new: true,
  },
]);

// navigation の state を再帰的に探索して、指定 routeName が存在するか確認
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

function resolveAccountRouteName(navigation) {
  const candidates = ["Account", "AccountScreen"];

  const root = navigation?.getRootState?.();
  const local = navigation?.getState?.();

  for (const name of candidates) {
    if (hasRouteNameInState(root, name) || hasRouteNameInState(local, name)) {
      return name;
    }
  }
  return "Account";
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

function mergeTutorialRects(...rects) {
  const validRects = rects.filter(Boolean);
  if (!validRects.length) return null;

  const left = Math.min(...validRects.map((rect) => Number(rect.x) || 0));
  const top = Math.min(...validRects.map((rect) => Number(rect.y) || 0));
  const right = Math.max(
    ...validRects.map((rect) => Number(rect.right ?? ((Number(rect.x) || 0) + (Number(rect.width) || 0))) || 0)
  );
  const bottom = Math.max(
    ...validRects.map((rect) => Number(rect.bottom ?? ((Number(rect.y) || 0) + (Number(rect.height) || 0))) || 0)
  );

  return {
    x: left,
    y: top,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
    right,
    bottom,
  };
}


function PieceHomeActionCard({
  title,
  description,
  buttonLabel,
  buttonIconName,
  onPress,
  badgeVisible = false,
  accessibilityLabel,
}) {
  return (
    <MenuActionCard
      title={title}
      description={description}
      buttonLabel={buttonLabel}
      buttonIconName={buttonIconName}
      onPress={onPress}
      badgeVisible={badgeVisible}
      accessibilityLabel={accessibilityLabel}
    />
  );
}

export default function PieceScreen({ route } = {}) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const navigation = useNavigation();

  const {
    setUnread,
    getFeatureUnread,
    getPrefetchEntry,
    getPrefetchEntryFresh,
    setPrefetch,
  } = useUnread();
  const { pieceRangeLabel } = useSubscription();
  const {
    isTutorialMode,
    tutorialStep,
    tutorialPieces,
    setTutorialPieces,
    setTutorialStep,
  } = useTutorial();
  const tutorialSurfaceEnabled = false;

  const { height: windowHeight } = useWindowDimensions();
  const safeInsets = useSafeAreaInsets();
  const screenRootRef = useRef(null);
  const tutorialScrollRef = useRef(null);
  const tutorialScrollYRef = useRef(0);
  const pieceTitleRef = useRef(null);
  const pieceLibraryButtonRef = useRef(null);
  const createButtonRef = useRef(null);
  const [tutorialTargetRect, setTutorialTargetRect] = useState(null);
  const [tutorialOverlayMetrics, setTutorialOverlayMetrics] = useState(null);
  const modalOverlayRootRef = useRef(null);
  const tutorialCreateScrollRef = useRef(null);
  const tutorialCreateScrollYRef = useRef(0);
  const tutorialCreateQuestionInputWrapRef = useRef(null);
  const tutorialCreateInputWrapRef = useRef(null);
  const tutorialCreateSaveButtonRef = useRef(null);
  const [tutorialModalTargetRect, setTutorialModalTargetRect] = useState(null);
  const [tutorialModalOverlayMetrics, setTutorialModalOverlayMetrics] = useState(null);

  // Tab reselect helper: used to ignore async results after a "reset to main"
  const resetSeqRef = useRef(0);

  // Prefetch freshness
  const PREFETCH_MAX_AGE_MS = 2 * 60 * 1000; // 2 minutes

  // 照会対象（フォロー一覧などから遷移した場合は route params で指定）
  const initialViewedUserId =
    route?.params?.viewedUserId ||
    route?.params?.targetUserId ||
    route?.params?.userId ||
    null;

  // Home では対象ユーザー切替を持たず、Piece一覧画面側で切り替えます（重複排除）
  const targetUserId = initialViewedUserId ? String(initialViewedUserId) : null;

  const unreadPieces = !(tutorialSurfaceEnabled && isTutorialMode) && !!getFeatureUnread("Piece", "piecesNew");
  const unreadEmotionLog = !!getFeatureUnread("EmotionLog", "feed");

  // Recommend (users)
  const [recoModalVisible, setRecoModalVisible] = useState(false);
  const [recoUsersLoading, setRecoUsersLoading] = useState(false);
  const [recoUsersError, setRecoUsersError] = useState("");
  const [recoUsers, setRecoUsers] = useState([]);

  const [globalPieceCount, setGlobalPieceCount] = useState(null);
  const [globalResonanceCount, setGlobalResonanceCount] = useState(null);
    const appStateRef = useRef(AppState.currentState);
  const globalSummaryLastFetchedAtRef = useRef(0);
  const globalSummaryInFlightRef = useRef(null);

  const [tutorialCreateVisible, setTutorialCreateVisible] = useState(false);
  const [tutorialCreateAnswer, setTutorialCreateAnswer] = useState("");
  const [tutorialCreateSubmitting, setTutorialCreateSubmitting] = useState(false);
  const [tutorialCreateError, setTutorialCreateError] = useState("");


  const fetchGlobalSummary = useCallback(async (opts = {}) => {
    const force = opts?.force === true;

    try {
      const now = Date.now();
      const lastFetchedAt = Number(globalSummaryLastFetchedAtRef.current || 0) || 0;
      if (!force && now - lastFetchedAt < GLOBAL_SUMMARY_MIN_REFRESH_INTERVAL_MS) {
        return globalSummaryInFlightRef.current || null;
      }

      if (globalSummaryInFlightRef.current) {
        return globalSummaryInFlightRef.current;
      }

      const request = (async () => {
        try {
          const res = await apiFetch(GLOBAL_SUMMARY_PASSIVE_ENDPOINT, {
            method: "GET",
            auth: false,
            timeoutMs: GLOBAL_SUMMARY_REQUEST_TIMEOUT_MS,
          });
          const json = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(String(json?.detail || json?.message || `HTTP ${res.status}`));
          }

          const pieceViewRaw = readPieceViewCount(json);
          const resonanceRaw = readPieceResonancesTotal(json);

          const nextPieceCount = Number(pieceViewRaw);
          const nextResonanceCount = Number(resonanceRaw);

          if (Number.isFinite(nextPieceCount)) {
            setGlobalPieceCount(nextPieceCount);
          }
          if (Number.isFinite(nextResonanceCount)) {
            setGlobalResonanceCount(nextResonanceCount);
          }
          globalSummaryLastFetchedAtRef.current = Date.now();
          return json;
        } catch {
          // keep previous values
          return null;
        } finally {
          globalSummaryInFlightRef.current = null;
        }
      })();

      globalSummaryInFlightRef.current = request;
      return request;
    } catch {
      return null;
    }
  }, []);


  const isDark = themeName === "dark";
  const tutorialSelfPiece = useMemo(
    () =>
      (Array.isArray(tutorialPieces) ? tutorialPieces : []).find(
        (item) => String(item?.tutorial_kind || "") === "self"
      ) || null,
    [tutorialPieces]
  );
  const tutorialHasSelfPiece = !!tutorialSelfPiece;

  const isPieceTutorialStep =
    tutorialSurfaceEnabled &&
    !!isTutorialMode &&
    tutorialStep >= PIECE_TUTORIAL_STEP_START &&
    tutorialStep <= PIECE_TUTORIAL_STEP_END;
  const isPieceTutorialVisible =
    isPieceTutorialStep && !tutorialCreateVisible;
  const handleTutorialScroll = useCallback((e) => {
    tutorialScrollYRef.current =
      e?.nativeEvent?.contentOffset?.y ?? tutorialScrollYRef.current;
  }, []);

  const getTutorialTargetRef = useCallback(() => {
    if (!isPieceTutorialVisible) return null;

    switch (tutorialStep) {
      case 12:
        return pieceTitleRef;
      case 13:
      case 14:
        return createButtonRef;
      case 15:
        return pieceLibraryButtonRef;
      default:
        return null;
    }
  }, [isPieceTutorialVisible, tutorialStep]);

  const tutorialOverlayConfig = useMemo(() => {
    if (!isPieceTutorialVisible) return null;

    switch (tutorialStep) {
      case 12:
        return {
          step: 12,
          mode: "info",
          title: "Piece",
          message: "ここでは\nPieceを作り、閲覧できます",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(13),
        };
      case 13:
        return {
          step: 13,
          mode: "info",
          title: "作成",
          message: "まずはここで\nPieceを作成します",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(14),
        };
      case 14:
        return {
          step: 14,
          mode: "action",
          title: "作成してみましょう",
          message: "作成を開いて\nPieceを作ってみましょう",
          actionHint: "作成 を押してください",
        };
      case 15:
        return {
          step: 15,
          mode: "action",
          title: "閲覧で確認できます",
          message: "作成したPieceは\n閲覧から確認できます\n\n開いてみましょう",
          actionHint: "閲覧 を押してください",
        };
      default:
        return null;
    }
  }, [isPieceTutorialVisible, tutorialStep, setTutorialStep]);

  const tutorialModalOverlayConfig = useMemo(() => {
    if (!tutorialSurfaceEnabled || !isTutorialMode || !tutorialCreateVisible || tutorialStep !== 14) {
      return null;
    }

    return {
      step: 14,
      mode: "action",
      title: "作成してみましょう",
      message: "回答を入力したら、保存ボタンを押してください",
      actionHint: "入力して保存してください",
      footerText:
        "この問い1つで、Pieceの作成から閲覧までの流れを体験できます。",
    };
  }, [isTutorialMode, tutorialCreateVisible, tutorialStep]);

  const syncTutorialTargetRect = useCallback(async () => {
    if (!isPieceTutorialVisible) {
      return null;
    }

    const targetRef = getTutorialTargetRef();
    if (!targetRef || !screenRootRef.current) {
      return null;
    }

    return syncTutorialSpotlightTarget({
      enabled: isPieceTutorialVisible,
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
    isPieceTutorialVisible,
    safeInsets,
    tutorialOverlayConfig?.cardPlacement,
    tutorialOverlayMetrics,
    windowHeight,
  ]);

  useEffect(() => {
    if (!tutorialSurfaceEnabled || !isTutorialMode || !tutorialHasSelfPiece) return;
    if (tutorialStep < PIECE_TUTORIAL_STEP_START || tutorialStep >= 15) return;
    setTutorialStep(15);
  }, [isTutorialMode, tutorialHasSelfPiece, tutorialStep, setTutorialStep]);

  useLayoutEffect(() => {
    if (!isPieceTutorialVisible) {
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
    isPieceTutorialVisible,
    tutorialStep,
    tutorialCreateVisible,
    tutorialHasSelfPiece,
    tutorialCreateAnswer,
    tutorialOverlayMetrics,
    syncTutorialTargetRect,
  ]);

  const syncTutorialModalTargetRect = useCallback(async () => {
    if (!tutorialModalOverlayConfig || !modalOverlayRootRef.current) {
      return null;
    }

    const measureOptions = {
      maxAttempts: 3,
      settleFrames: 1,
      coordinateSpace: "window",
      overlayWindowRect: tutorialModalOverlayMetrics?.overlayWindowRect,
    };

    const questionRect = await measureTutorialTarget(
      tutorialCreateQuestionInputWrapRef,
      modalOverlayRootRef,
      measureOptions
    );
    const saveRect = await measureTutorialTarget(
      tutorialCreateSaveButtonRef,
      modalOverlayRootRef,
      measureOptions
    );

    return mergeTutorialRects(questionRect, saveRect) || questionRect || saveRect;
  }, [tutorialModalOverlayConfig, tutorialModalOverlayMetrics]);

  // ---------------------------------------------------------
  // Tab reselect (when already on Piece tab)
  // - Re-tapping the active tab returns to the "main" state:
  //   closes modal-like UIs.
  // ---------------------------------------------------------
  const resetToMain = useCallback(() => {
    resetSeqRef.current += 1;

    // close modal-like UIs
    setRecoModalVisible(false);
    setTutorialCreateVisible(false);

    // best-effort: clear modal state so it doesn't persist
    setRecoUsersLoading(false);
    setRecoUsersError("");
    setTutorialCreateError("");
  }, []);

  useEffect(() => {
    if (!navigation?.addListener) return;

    const unsubscribe = navigation.addListener("tabPress", () => {
      // Only when re-tapping the already-focused tab.
      if (navigation.isFocused()) {
        resetToMain();
      }
    });

    return unsubscribe;
  }, [navigation, resetToMain]);

  // 画面遷移で PieceScreen が裏に回ったとき、
  // Modal が「表示状態のまま残る」ことでタップが吸われる事故を防ぐ
  useEffect(() => {
    if (!navigation?.addListener) return;
    const unsubscribe = navigation.addListener("blur", () => {
      resetToMain();
    });
    return unsubscribe;
  }, [navigation, resetToMain]);

  useEffect(() => {
    if (isTutorialMode) {
      setGlobalPieceCount(null);
      setGlobalResonanceCount(null);
      return;
    }

    fetchGlobalSummary();

    if (!navigation?.addListener) return;
    const unsubscribe = navigation.addListener("focus", () => {
      fetchGlobalSummary();
    });

    return unsubscribe;
  }, [navigation, fetchGlobalSummary, isTutorialMode]);

  useEffect(() => {
    if (isTutorialMode) return;

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (/inactive|background/.test(appStateRef.current) && nextAppState === "active") {
        fetchGlobalSummary();
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      try {
        subscription?.remove?.();
      } catch {
        // noop
      }
    };
  }, [fetchGlobalSummary, isTutorialMode]);

  // Recommend: user suggestions only
  useEffect(() => {
    if (isTutorialMode) {
      setRecoUsers([]);
      setRecoUsersError("");
      setRecoUsersLoading(false);
      return;
    }

    try {
      const entry = getPrefetchEntryFresh
        ? getPrefetchEntryFresh("Piece", "recoUsers", PREFETCH_MAX_AGE_MS)
        : getPrefetchEntry("Piece", "recoUsers");
      const cached = entry?.value;
      const items = Array.isArray(cached?.items) ? cached.items : null;
      if (items) {
        setRecoUsers(items);
        setRecoUsersError("");
        setRecoUsersLoading(false);
      }
    } catch {
      // noop
    }

    const hasCache = (() => {
      try {
        const entry = getPrefetchEntryFresh
          ? getPrefetchEntryFresh("Piece", "recoUsers", PREFETCH_MAX_AGE_MS)
          : getPrefetchEntry("Piece", "recoUsers");
        return Array.isArray(entry?.value?.items);
      } catch {
        return false;
      }
    })();

    loadRecommendUsers({ silent: hasCache });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTutorialMode]);

  async function getAuthContext() {
    let userId = null;
    let accessToken = null;
    try {
      userId = await getCurrentUserId();
    } catch (e) {
      console.warn("PieceScreen(Home): failed to resolve userId", e);
    }
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      accessToken = sessionData?.session?.access_token ?? null;
    } catch (e) {
      console.warn("PieceScreen(Home): failed to resolve auth session", e);
    }
    return { userId, accessToken };
  }

  useEffect(() => {
    if (!tutorialSurfaceEnabled || !isTutorialMode || !tutorialHasSelfPiece) return;
    setTutorialStep((prev) => (prev < 15 ? 15 : prev));
  }, [isTutorialMode, tutorialHasSelfPiece, setTutorialStep]);


  useLayoutEffect(() => {
    if (!tutorialModalOverlayConfig) {
      setTutorialModalTargetRect(null);
      setTutorialModalOverlayMetrics(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      await waitForTutorialFrames(2);
      if (cancelled) return;

      const nextRect = await syncTutorialModalTargetRect();
      if (!cancelled) {
        setTutorialModalTargetRect(nextRect);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [
    tutorialModalOverlayConfig,
    tutorialCreateSubmitting,
    tutorialModalOverlayMetrics,
    syncTutorialModalTargetRect,
  ]);

  const openTutorialCreate = useCallback(() => {
    tutorialCreateScrollYRef.current = 0;
    setTutorialCreateAnswer(String(tutorialSelfPiece?.body || ""));
    setTutorialCreateError("");
    setTutorialCreateVisible(true);
  }, [tutorialSelfPiece]);

  const closeTutorialCreate = useCallback(() => {
    if (tutorialCreateSubmitting) return;
    setTutorialCreateVisible(false);
    setTutorialCreateError("");
  }, [tutorialCreateSubmitting]);

  const navigateToPieceLibrary = useCallback(() => {
    if (!navigation?.navigate) return;

    const routeName = resolvePieceLibraryRouteName(navigation);
    const params =
      targetUserId != null
        ? { viewedUserId: String(targetUserId), targetUserId: String(targetUserId) }
        : {};

    try {
      navigation.navigate(routeName, params);
    } catch {
      Alert.alert(
        "Piece一覧を開けません",
        "Piece一覧画面が navigation に未登録の可能性があります。\nApp.js の登録を確認してください。"
      );
    }
  }, [navigation, targetUserId]);

  const saveTutorialPiece = useCallback(() => {
    const answer = String(tutorialCreateAnswer || "").trim();
    if (!answer) {
      setTutorialCreateError("回答を入力してください。");
      return;
    }

    setTutorialCreateSubmitting(true);
    try {
      const createdAt = new Date().toISOString();
      const selfPiece = {
        id: "tutorial-piece-self",
        q_instance_id: "tutorial-q-self",
        q_key: "tutorial-holiday",
        title: TUTORIAL_PIECE_QUESTION,
        body: answer,
        owner_user_id: "tutorial-self",
        display_name: "自分",
        share_code: "YOU",
        is_tutorial: true,
        tutorial_kind: "self",
        created_at: createdAt,
        resonances: 0,
        views: 0,
        is_new: true,
      };

      setTutorialPieces((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        const others = safePrev.filter(
          (item) => String(item?.tutorial_kind || "") !== "self"
        );
        const hasMock = others.some(
          (item) => String(item?.tutorial_kind || "") === "mock"
        );
        const mockItems = hasMock
          ? others
          : TUTORIAL_MOCK_PIECES.map((item) => ({ ...item }));

        return [selfPiece, ...mockItems];
      });
      setTutorialStep((prev) => (prev < 15 ? 15 : prev));
      setTutorialCreateVisible(false);
      setTutorialCreateError("");
    } finally {
      setTutorialCreateSubmitting(false);
    }
  }, [
    tutorialCreateAnswer,
    setTutorialPieces,
    setTutorialStep,
    navigateToPieceLibrary,
  ]);

  const showTutorialRecommendInfo = useCallback(() => {
    Alert.alert(
      "おすすめ（チュートリアル）",
      "本番ではここから新しいユーザーや問いを探せます。\n\nチュートリアルでは、Piece画面で模擬ユーザーのPieceを閲覧できます。"
    );
  }, []);

  const openAccount = useCallback(
    (targetUserId) => {
      const tid = targetUserId ? String(targetUserId) : "";
      if (!tid || !navigation?.navigate) return;

      // 画面遷移前に Modal を確実に閉じる
      setRecoModalVisible(false);

      const routeName = resolveAccountRouteName(navigation);
      try {
        navigation.navigate(routeName, { viewedUserId: tid, targetUserId: tid });
      } catch {
        try {
          navigation.navigate("Account", { viewedUserId: tid, targetUserId: tid });
        } catch {
          // ignore
        }
      }
    },
    [navigation]
  );

  const loadRecommendUsers = useCallback(async (opts) => {
    const silent = !!opts?.silent;
    if (!silent) {
      setRecoUsersLoading(true);
    }
    setRecoUsersError("");

    try {
      const { userId, accessToken } = await getAuthContext();
      if (!accessToken) {
        setRecoUsers([]);
        setRecoUsersError("ログインが必要です");
        return;
      }

      const params = new URLSearchParams();
      params.append("limit", "20");
      const url = `${PIECE_RECOMMEND_USERS_ENDPOINT}?${params.toString()}`;

      const res = await apiFetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = json?.detail || json?.message || `HTTP ${res.status}`;
        throw new Error(String(msg));
      }

      const users =
        (Array.isArray(json?.users) && json.users) ||
        (Array.isArray(json?.items) && json.items) ||
        (Array.isArray(json?.rows) && json.rows) ||
        [];

      setRecoUsers(users);

      // cache
      try {
        setPrefetch("Piece", "recoUsers", { userId: userId || null, items: users });
      } catch {
        // noop
      }
    } catch (e) {
      setRecoUsers([]);
      setRecoUsersError(String(e?.message || e));
    } finally {
      setRecoUsersLoading(false);
    }
  }, []);

  const openPieceCreateFromHome = useCallback(() => {
    if (tutorialSurfaceEnabled && isTutorialMode) {
      openTutorialCreate();
      return;
    }

    Alert.alert("Homeから作成してください", "Piece の作成は Home 画面から行います。");
  }, [isTutorialMode, openTutorialCreate, tutorialSurfaceEnabled]);

  const openPieceLibrary = useCallback(() => {
    if (tutorialSurfaceEnabled && isTutorialMode && !tutorialHasSelfPiece) {
      Alert.alert(
        "先にPieceを作成しましょう",
        `チュートリアルでは、まず「${TUTORIAL_PIECE_QUESTION}」に答えると、作成から閲覧までの流れが分かります。`,
        [
          { text: "閉じる", style: "cancel" },
          { text: "作成する", onPress: openTutorialCreate },
        ]
      );
      return;
    }

    if (tutorialSurfaceEnabled && isTutorialMode) {
      setTutorialStep((prev) => (prev < 16 ? 16 : prev));
    }

    navigateToPieceLibrary();
  }, [
    isTutorialMode,
    tutorialHasSelfPiece,
    openTutorialCreate,
    navigateToPieceLibrary,
    setTutorialStep,
  ]);

  const openReactionHistory = useCallback(() => {
    if (!navigation?.navigate) return;

    try {
      navigation.navigate("PieceHistory");
    } catch {
      Alert.alert(
        "履歴を開けません",
        "履歴画面が navigation に未登録の可能性があります。"
      );
    }
  }, [navigation]);

  const openEmotionLog = useCallback(() => {
    if (!navigation?.navigate) return;

    try {
      navigation.navigate("EmotionLog");
    } catch {
      Alert.alert(
        "感情ログを開けません",
        "感情ログ画面が navigation に未登録の可能性があります。"
      );
    }
  }, [navigation]);

  const handlePressGuide = useCallback(() => {
    // 1) normal navigate
    try {
      if (navigation && typeof navigation.navigate === "function") {
        navigation.navigate("CocolonGuide", { screenId: "piece" });
        return;
      }
    } catch {
      // noop
    }

    // 2) fallback to parent navigator（念のため）
    try {
      const parent =
        typeof navigation?.getParent === "function" ? navigation.getParent() : null;
      if (parent && typeof parent.navigate === "function") {
        parent.navigate("CocolonGuide", { screenId: "piece" });
        return;
      }
    } catch {
      // noop
    }

    Alert.alert("ガイド", "ガイド画面へのナビゲーションがまだ設定されていません。");
  }, [navigation]);


  return (
    <View ref={screenRootRef} collapsable={false} style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />

      <View style={styles.safeContent}>
      <ScrollView
        ref={tutorialScrollRef}
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        onScroll={handleTutorialScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.panelHeader}>
          <View ref={pieceTitleRef} collapsable={false} style={styles.panelTitleRow}>
            <Text style={styles.panelTitle}>Piece</Text>
            <CocolonPressable
              style={styles.guideTitleButton}
              onPress={handlePressGuide}
              accessibilityLabel="ガイドを開く"
            >
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={colors.TEXT_ON_LIGHT}
              />
            </CocolonPressable>
          </View>
          <View style={styles.headerRight} />
        </View>

        {tutorialSurfaceEnabled && isTutorialMode ? (
          <View style={styles.recoCard}>
            <Text style={styles.recoTitle}>チュートリアル</Text>
            <Text style={styles.recoSummaryText}>
              この画面では、1つの問いに答えてPieceが作られ、Piece一覧で閲覧できる流れを体験します。
            </Text>
            <Text style={styles.recoSummaryText}>
              {tutorialHasSelfPiece
                ? "作成済みのPieceがあります。次はPiece一覧で、自分の回答や模擬ユーザーのPieceを見てみましょう。"
                : `まずは「${TUTORIAL_PIECE_QUESTION}」に答えてみましょう。`}
            </Text>
            <Text style={styles.recoSummaryText}>
              チュートリアル中の記録は本番データには保存されません。
            </Text>
          </View>
        ) : (
          <View style={styles.globalSummaryBlock}>
            <View style={styles.globalSummaryInner}>
              <View style={styles.globalSummaryHeaderRow}>
                <Ionicons
                  name="radio-outline"
                  size={14}
                  color={colors.TITLE_GOLD}
                  style={styles.globalSummaryIcon}
                />
                <Text style={styles.globalSummaryLabel}>今日の全体活動</Text>
              </View>
              <Text style={styles.globalSummaryText}>
                {`今日、全体で ${
                  typeof globalPieceCount === "number" ? globalPieceCount : "—"
                } 回のPiece閲覧がありました`}
              </Text>
              <Text style={styles.globalSummaryText}>
                {`今日、全体で ${
                  typeof globalResonanceCount === "number" ? globalResonanceCount : "—"
                } 回の共鳴がありました`}
              </Text>
            </View>
          </View>
        )}

        <View ref={pieceLibraryButtonRef} collapsable={false}>
          <PieceHomeActionCard
            styles={styles}
            title="閲覧"
            description={
              tutorialSurfaceEnabled && isTutorialMode
                ? "作成したPieceや、模擬ユーザーのPieceを見ながら、Pieceの流れを確認できます。"
                : "自分、またはフォロー中のユーザーが作成したPieceを閲覧できます。"
            }
            buttonLabel="Piece一覧を開く"
            buttonIconName="open-outline"
            onPress={openPieceLibrary}
            badgeVisible={unreadPieces}
            accessibilityLabel="Piece一覧を開く"
          />
        </View>

        <View style={{ marginTop: 16 }}>
          <PieceHomeActionCard
            styles={styles}
            title="感情通知"
            description="フォロー中ユーザーの感情入力を確認できます。"
            buttonLabel="感情ログを開く"
            buttonIconName="notifications-outline"
            onPress={openEmotionLog}
            badgeVisible={unreadEmotionLog}
            accessibilityLabel="感情ログを開く"
          />
        </View>

        {tutorialSurfaceEnabled && isTutorialMode ? (
          <View ref={createButtonRef} collapsable={false} style={{ marginTop: 16 }}>
            <PieceHomeActionCard
              styles={styles}
              title="作成"
              description={`チュートリアルでは「${TUTORIAL_PIECE_QUESTION}」に答えて、Pieceを作成する流れを体験できます。`}
              buttonLabel="Pieceを作成する"
              buttonIconName="create-outline"
              onPress={openPieceCreateFromHome}
              badgeVisible={false}
              accessibilityLabel="Pieceを作成する"
            />
          </View>
        ) : null}

        <View style={{ marginTop: 16 }}>
          <PieceHomeActionCard
            styles={styles}
            title="探す"
            description={
              tutorialSurfaceEnabled && isTutorialMode
                ? "本番ではここから新しいユーザーを探せます。チュートリアルではPiece画面に模擬ユーザーを用意しています。"
                : "新しいユーザーを探すことができます。"
            }
            buttonLabel="新しいユーザーを探す"
            buttonIconName="search-outline"
            onPress={() => {
              if (tutorialSurfaceEnabled && isTutorialMode) {
                showTutorialRecommendInfo();
                return;
              }

              setRecoModalVisible(true);
              loadRecommendUsers();
            }}
            accessibilityLabel="新しいユーザーを探す"
          />
        </View>

        <View style={{ marginTop: 16 }}>
          <PieceHomeActionCard
            styles={styles}
            title="履歴"
            description="共鳴と発見の履歴を確認できます。"
            buttonLabel="履歴を確認する"
            buttonIconName="time-outline"
            onPress={openReactionHistory}
            accessibilityLabel="履歴を確認する"
          />
        </View>
      </ScrollView>
      </View>

      {tutorialOverlayConfig ? (
        <TutorialOverlay
          visible={isPieceTutorialVisible}
          targetRect={tutorialTargetRect}
          title={tutorialOverlayConfig.title}
          message={tutorialOverlayConfig.message}
          step={tutorialOverlayConfig.step}
          totalSteps={TUTORIAL_TOTAL_STEPS}
          mode={tutorialOverlayConfig.mode}
          nextLabel={tutorialOverlayConfig.nextLabel}
          onNext={tutorialOverlayConfig.onNext}
          actionHint={tutorialOverlayConfig.actionHint}
          cardPlacement={tutorialOverlayConfig.cardPlacement || "bottom"}
          onTargetPress={
            tutorialStep === 14
              ? openTutorialCreate
              : tutorialStep === 15
                ? openPieceLibrary
                : undefined
          }
          onMetricsChange={setTutorialOverlayMetrics}
        />
      ) : null}

      <Modal
        visible={tutorialCreateVisible}
        animationType="fade"
        transparent
        onRequestClose={closeTutorialCreate}
      >
        <View ref={modalOverlayRootRef} style={styles.modalOverlay} collapsable={false}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>チュートリアル Piece</Text>
              <Pressable
                onPress={closeTutorialCreate}
                style={styles.modalCloseBtn}
                disabled={tutorialCreateSubmitting}
              >
                <Ionicons name="close" size={18} color={colors.TEXT_ON_LIGHT} />
              </Pressable>
            </View>

            <ScrollView
              ref={tutorialCreateScrollRef}
              style={styles.listArea}
              contentContainerStyle={styles.modalScrollContent}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
              scrollEventThrottle={16}
              onScroll={(e) => {
                tutorialCreateScrollYRef.current =
                  e?.nativeEvent?.contentOffset?.y ?? tutorialCreateScrollYRef.current;
              }}
            >
              <View ref={tutorialCreateQuestionInputWrapRef} collapsable={false}>
                <View style={styles.tutorialQuestionCard}>
                  <Text style={styles.tutorialQuestionLabel}>問い</Text>
                  <Text style={styles.recoSummaryText}>{TUTORIAL_PIECE_QUESTION}</Text>
                </View>

                <Text style={[styles.recoSectionLabel, { marginTop: 10 }]}>あなたの回答</Text>
                <View ref={tutorialCreateInputWrapRef} collapsable={false}>
                  <TextInput
                  style={styles.tutorialTextArea}
                  placeholder="ここに回答を書いてください。"
                  placeholderTextColor={colors.TEXT_SUBTLE}
                  value={tutorialCreateAnswer}
                  onChangeText={(v) => {
                    setTutorialCreateAnswer(v);
                    if (tutorialCreateError) setTutorialCreateError("");
                  }}
                  multiline
                  textAlignVertical="top"
                  editable={!tutorialCreateSubmitting}
                  />
                </View>
              </View>

              <Text style={styles.tutorialHelperText}>
                {isTutorialMode && tutorialStep === 14
                  ? "この問いに答えて保存すると、チュートリアル用のPieceが作成されます。本番データには保存されません。"
                  : "チュートリアルでは、この1つの回答だけでPieceの作成から閲覧までの流れを体験します。本番データには保存されません。"}
              </Text>

              {tutorialCreateError ? (
                <Text style={styles.modeErrorText}>{tutorialCreateError}</Text>
              ) : null}

              <View ref={tutorialCreateSaveButtonRef} collapsable={false}>
                <CocolonButton
                variant="primary"
                style={{ marginTop: 12 }}
                onPress={saveTutorialPiece}
                disabled={tutorialCreateSubmitting}
              >
                <View style={styles.btnRow}>
                  {tutorialCreateSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" style={{ marginRight: 8 }} />
                  ) : (
                    <Ionicons
                      name="save-outline"
                      size={18}
                      color="#FFFFFF"
                      style={{ marginRight: 6 }}
                    />
                  )}
                  <Text style={styles.goldButtonText}>保存</Text>
                </View>
                </CocolonButton>
              </View>
            </ScrollView>
          </View>

          {tutorialModalOverlayConfig ? (
            <View
              style={StyleSheet.absoluteFill}
              pointerEvents="box-none"
              onStartShouldSetResponderCapture={() => {
                Keyboard.dismiss();
                return false;
              }}
            >
              <TutorialOverlay
                visible={!!tutorialModalOverlayConfig}
                targetRect={tutorialModalTargetRect}
                title={tutorialModalOverlayConfig.title}
                message={tutorialModalOverlayConfig.message}
                step={tutorialModalOverlayConfig.step}
                totalSteps={TUTORIAL_TOTAL_STEPS}
                mode={tutorialModalOverlayConfig.mode}
                nextLabel={tutorialModalOverlayConfig.nextLabel}
                onNext={tutorialModalOverlayConfig.onNext}
                actionHint={tutorialModalOverlayConfig.actionHint}
                footerText={tutorialModalOverlayConfig.footerText}
                onMetricsChange={setTutorialModalOverlayMetrics}
              />
            </View>
          ) : null}
        </View>
      </Modal>


      {/* Recommend modal */}
      <Modal
        visible={recoModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setRecoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>おすすめ</Text>
              <View style={styles.headerRight}>
                <Pressable
                  onPress={() => {
                    loadRecommendUsers();
                  }}
                  style={styles.recoRefreshBtn}
                >
                  <Ionicons name="refresh" size={16} color={colors.TITLE_GOLD} />
                </Pressable>

                <Pressable
                  onPress={() => setRecoModalVisible(false)}
                  style={[styles.modalCloseBtn, { marginLeft: 8 }]}
                >
                  <Ionicons name="close" size={18} color={colors.TEXT_ON_LIGHT} />
                </Pressable>
              </View>
            </View>

            <ScrollView style={styles.listArea}>
              <Text style={styles.recoSectionLabel}>アクティブユーザー</Text>

              {recoUsersLoading ? (
                <View style={styles.recoLoadingRow}>
                  <ActivityIndicator color={colors.TEXT_SUBTLE} />
                  <Text style={styles.recoLoadingText}>読み込み中…</Text>
                </View>
              ) : (recoUsers || []).length > 0 ? (
                <View style={{ marginTop: 8 }}>
                  {(recoUsers || []).map((u) => {
                    const uid = u?.id || u?.user_id || u?.userId;
                    const name =
                      String(u?.display_name || "").trim() || "（未設定）";
                    const handle = String(readShareCode(u, "") || "").trim();
                    return (
                      <Pressable
                        key={String(uid || Math.random())}
                        onPress={() => openAccount(uid)}
                        style={styles.recoUserRow}
                      >
                        <View style={{ flex: 1, paddingRight: 10 }}>
                          <Text style={styles.recoUserName} numberOfLines={1}>
                            {name}
                          </Text>
                          <Text style={styles.recoUserSub} numberOfLines={1}>
                            {handle ? `@${handle}` : " "}
                          </Text>
                        </View>

                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color={colors.TEXT_SUBTLE}
                          style={{ marginLeft: 10 }}
                        />
                      </Pressable>
                    );
                  })}
                </View>
              ) : (
                <Text style={styles.recoEmptyText}>
                  {recoUsersError
                    ? `取得に失敗: ${recoUsersError}`
                    : "候補ユーザーがいません。"}
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function createStyles(COLORS, ui) {
  const font = ui?.font || {};
  const text = ui?.text || {};
  return StyleSheet.create(applyTypographyTokens({
    container: { flex: 1, backgroundColor: COLORS.PANEL_BG },
    safeContent: { flex: 1 },
    body: { flex: 1 },
    bodyContent: {
      paddingTop: 16,
      paddingHorizontal: 18,
      alignItems: "stretch",
      paddingBottom: 32,
      minHeight: PANEL_MIN_HEIGHT,
    },

    // Header
    panelHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
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
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    globalSummaryBlock: {
      marginBottom: 14,
    },
    globalSummaryInner: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingVertical: 8,
    },
    globalSummaryHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    globalSummaryIcon: {
      marginRight: 6,
    },
    globalSummaryLabel: {
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 0.3,
      color: COLORS.TEXT_ON_LIGHT,
    },
    globalSummaryText: {
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 2,
    },

    homeActionCard: {
      borderRadius: 26,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 22,
      paddingTop: 18,
      paddingBottom: 20,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    homeActionCardTitleRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    homeActionCardTitle: {
      flex: 1,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: "800",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      letterSpacing: 0.2,
    },
    homeActionCardBadge: {
      marginLeft: 10,
    },
    homeActionCardDescription: {
      marginTop: 10,
      fontSize: 14,
      lineHeight: 21,
      color: text.description ?? COLORS.TEXT_ON_LIGHT,
    },
    homeActionButton: {
      marginTop: 18,
      borderRadius: 999,
      paddingVertical: 16,
      paddingHorizontal: 18,
      shadowColor: "#000",
      shadowOpacity: 0.16,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    homeActionButtonRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    homeActionButtonIcon: {
      marginRight: 10,
    },
    homeActionButtonText: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: "800",
      color: "#FFFFFF",
      letterSpacing: 0.2,
    },

    // Recommend
    recoCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginBottom: 12,
    },
    recoTitle: {
      fontSize: 13,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
    },
    recoSummaryText: {
      marginTop: 6,
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
      opacity: 0.9,
    },
    createTitleRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    createUnreadBadge: {
      marginLeft: 8,
    },
    recoRefreshBtn: {
      width: 34,
      height: 34,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      alignItems: "center",
      justifyContent: "center",
    },
    recoToggleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
      marginBottom: 10,
    },
    recoTogglePill: {
      flex: 1,
      marginRight: 8,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      alignItems: "center",
      justifyContent: "center",
    },
    recoTogglePillActive: {
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
    },
    recoToggleText: {
      fontSize: 11,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
    },
    recoToggleTextActive: {
      color: "#FFFFFF",
    },
    recoSectionLabel: {
      fontSize: font.sectionLabel ?? 12,
      fontWeight: "800",
      color: text.sectionLabel ?? text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    recoPillScroll: { marginTop: 8 },
    recoPill: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      maxWidth: 240,
    },
    recoPillActive: {
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
    },
    recoPillText: {
      fontSize: 11,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
    },
    recoPillTextActive: {
      color: "#FFFFFF",
    },
    recoEmptyText: {
      marginTop: 8,
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
      opacity: 0.85,
    },
    recoLoadingRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },
    recoLoadingText: {
      marginLeft: 10,
      fontSize: 12,
      color: COLORS.TEXT_ON_LIGHT,
      opacity: 0.85,
    },

    // Home
    qnaIntroCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 12,
    },
    qnaIntroTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    qnaIntroTitle: {
      fontSize: 13,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 0,
    },
    qnaIntroText: {
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
    },

    // Actions
    actions: { marginTop: 6, marginBottom: 2 },
    targetRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
    },
    targetLabel: {
      fontSize: font.sectionLabel ?? 12,
      color: text.sectionLabel ?? text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    targetNamePressable: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      maxWidth: "80%",
    },
    targetName: {
      fontSize: 12,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
    },

    // Shared button row
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
    neutralButtonText: {
      fontSize: 13,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
      letterSpacing: 0.6,
    },

    // History
    historyCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginBottom: 12,
    },
    historyCardTitle: {
      fontSize: 13,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
    },
    historyEntry: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    historyEntryText: {
      fontSize: 13,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
    },

    // Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.35)",
      paddingHorizontal: 16,
      justifyContent: "center",
    },
    modalCard: {
      borderRadius: 22,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
      maxHeight: "82%",
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    modalTitle: {
      fontSize: 14,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
    },
    modalCloseBtn: {
      width: 36,
      height: 36,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.FIELD_BG,
    },
    modalLoading: {
      paddingVertical: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    modalLoadingText: {
      marginTop: 10,
      fontSize: 12,
      color: COLORS.TEXT_ON_LIGHT,
      opacity: 0.9,
    },
    modalEmpty: {
      paddingVertical: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    modalEmptyText: {
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
      opacity: 0.9,
      textAlign: "center",
    },
    listArea: { paddingBottom: 4 },
    modalScrollContent: { paddingBottom: 12 },

    // Recommend users list rows
    recoUserRow: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 8,
    },
    recoUserName: {
      fontSize: 13,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
    },
    recoUserSub: {
      marginTop: 2,
      fontSize: font.description ?? 9,
      color: text.description ?? COLORS.TEXT_ON_LIGHT,
    },

    // Follow picker list rows
    listRow: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 8,
    },
    listRowActive: {
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.PANEL_BG,
    },
    rowTitleLine: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    rowTitle: {
      flex: 1,
      fontSize: 13,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
      paddingRight: 10,
    },
    activeBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      backgroundColor: COLORS.GOLD_BUTTON,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      alignSelf: "flex-start",
    },
    activeBadgeText: {
      fontSize: 10,
      fontWeight: "900",
      color: "#FFFFFF",
    },
    pickerEmptyInline: {
      paddingVertical: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    tutorialQuestionCard: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    tutorialQuestionLabel: {
      fontSize: 11,
      fontWeight: "900",
      color: COLORS.TITLE_GOLD,
      marginBottom: 4,
    },
    tutorialTextArea: {
      marginTop: 8,
      minHeight: 120,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 13,
      lineHeight: 19,
      color: COLORS.TEXT_ON_LIGHT,
    },
    tutorialHelperText: {
      marginTop: 8,
      fontSize: 11,
      lineHeight: 16,
      color: text.description ?? COLORS.TEXT_ON_LIGHT,
      opacity: 0.9,
    },
    modeErrorText: {
      marginTop: 10,
      fontSize: 11,
      lineHeight: 16,
      color: "#B91C1C",
      textAlign: "center",
    },
  }, ui));
}

