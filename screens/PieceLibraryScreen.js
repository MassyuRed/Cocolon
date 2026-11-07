import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../theme/ThemeContext";
import { useAuth } from "../AuthContext";
import { apiGet, apiFetch, API_BASE_URL } from "../lib/apiClient";
import { FOLLOW_WIRE, PIECE_WIRE, buildFollowListPath } from "../lib/compat/legacyWireContracts";
import {
  getNexusPieceDetailQna,
  getNexusPiecesAsQnaList,
  getNexusPiecesUnreadStatus,
} from "../lib/nexusApi";
import { useUnread } from "../UnreadContext";
import { useTutorial } from "../TutorialContext";
import TutorialOverlay, {
  syncTutorialSpotlightTarget,
  waitForTutorialFrames,
} from "../components/TutorialOverlay";

// UI (Design System)
import CocolonButton from "../components/CocolonButton";
import CocolonPressable from "../components/CocolonPressable";
import CocolonBackButton from "../components/CocolonBackButton";
import { makeUiTokens, MODAL_ORIENTATIONS } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { TUTORIAL_PIECES, TUTORIAL_TOTAL_STEPS } from "../tutorial/tutorialScenarioData";

/**
 * PieceLibraryScreen (2026-02 Piece Architecture)
 * -------------------------------------------
 * - 旧自由入力Q&A導線は廃止
 * - 「質問を生成」→ リストから選択 → 応答本文を表示
 * - RN側は基本表示のみ（処理は MashOS API 側へ）
 */

const PANEL_MIN_HEIGHT = 690;

// Reaction / owner-side compatibility endpoints (MashOS)
// Public Piece read path is now unified under /nexus/* via lib/nexusApi.
const API_BASE = API_BASE_URL;
const PIECE_RESONANCE_SUBMIT_ENDPOINT = `${API_BASE}${PIECE_WIRE.routes.resonanceSubmit}`;
const PIECE_RESONANCE_HISTORY_ENDPOINT = `${API_BASE}${PIECE_WIRE.routes.resonanceHistory}`;
const PIECE_RESONANCE_DELETE_ENDPOINT = `${API_BASE}${PIECE_WIRE.routes.resonanceDelete}`;

// Resonance UI labels (UI語彙は人間思考)
const ECHO_STRENGTH_OPTIONS = Object.freeze([
  { key: "small", label: "静かに響いた", subLabel: "響き（小）" },
  { key: "medium", label: "心が動いた", subLabel: "響き（中）" },
  { key: "large", label: "深く響いた", subLabel: "響き（大）" },
]);

const TUTORIAL_SELF_USER_ID = "tutorial-self";
const TUTORIAL_MOCK_USER_NAME = "User";
const TUTORIAL_MOCK_PIECES = Object.freeze(
  TUTORIAL_PIECES.filter(
    (item) => String(item?.tutorial_kind || "") === "mock"
  ).map((item) => ({ ...item }))
);

const STEP_PIECES_SELF_VIEW = 16;
const STEP_PIECES_SWITCH_AND_REACT = 17;

function buildErrorMessage(err) {
  if (!err) return "エラーが発生しました。";
  if (err?.name === "AbortError")
    return "接続がタイムアウトしました（ネットワークを確認してください）。";
  const msg = String(err?.message || err);
  if (/Network/i.test(msg)) return "サーバーへの接続に失敗しました。";
  return `エラー：${msg}`;
}

function formatMetricCount(value) {
  const n = Number(value ?? 0) || 0;
  return n > 999 ? "999+" : String(n);
}

// navigation の state を再帰的に探索して、指定 routeName が存在するか確認
export default function PieceLibraryScreen({ route, onOpenSubscription, onTabUnreadChange } = {}) {
  const { colors, themeName } = useTheme();
  const { user, authOwnerGeneration } = useAuth();
  const ownerRequestRef = useRef(null);
  useEffect(() => {
    const controller = new AbortController();
    const request = { expectedUserId: user?.id, signal: controller.signal };
    ownerRequestRef.current = request;
    return () => controller.abort();
  }, [user?.id, authOwnerGeneration]);
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const navigation = useNavigation();

  const isIOS = Platform.OS === "ios";
  const { height: windowHeight } = useWindowDimensions();
  const safeInsets = useSafeAreaInsets();
  const [keyboardInset, setKeyboardInset] = useState(0);

  // 入力欄はできるだけ伸ばしつつ、一定以上は TextInput 内スクロールに切り替える（InputScreen と同仕様）
  const inputMaxHeight = useMemo(() => {
    const h = windowHeight || 0;
    if (!h) return 520;

    // キーボード表示中は、画面に収まる範囲を優先して上限を決める（それ以上は TextInput 内でスクロール）
    if (keyboardInset > 0) {
      const remaining = h - keyboardInset;
      return Math.max(160, Math.floor(remaining - 60));
    }

    // キーボード未表示時は、画面の大半まで伸ばせるようにする
    return Math.max(260, Math.floor(h * 0.75));
  }, [windowHeight, keyboardInset]);

  // メモ入力がキーボードに隠れないようにスクロール追従（InputScreen と同仕様）
  const modalLastFocusTargetRef = useRef(null);
  const modalLastScrollRef = useRef(null);

  const resonanceModalScrollRef = useRef(null);

  const scrollToFocusedInput = useCallback((extraOffset = 110) => {
    const sv = modalLastScrollRef.current;
    const target = modalLastFocusTargetRef.current;
    if (!sv || !target) return;
    try {
      sv.scrollResponderScrollNativeHandleToKeyboard(target, extraOffset, true);
    } catch {
      // noop
    }
  }, []);

  useEffect(() => {
    const showEvt =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e) => {
      const h = e?.endCoordinates?.height ?? 0;
      setKeyboardInset(h);
      requestAnimationFrame(() => {
        scrollToFocusedInput();
      });
    };

    const onHide = () => {
      setKeyboardInset(0);
    };

    const subShow = Keyboard.addListener(showEvt, onShow);
    const subHide = Keyboard.addListener(hideEvt, onHide);

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, [scrollToFocusedInput]);

  const { setUnread, getPrefetchEntry, getPrefetchEntryFresh, setPrefetch } = useUnread();
  const {
    isTutorialMode,
    tutorialStep,
    tutorialPieces,
    setTutorialPieces,
    setTutorialStep,
    endTutorial,
  } = useTutorial();

  const screenRootRef = useRef(null);
  const tutorialBodyScrollRef = useRef(null);
  const tutorialBodyScrollYRef = useRef(0);
  const pieceSelectorRef = useRef(null);
  const qaBlockRef = useRef(null);
  const metricsActionsWrapRef = useRef(null);
  const [tutorialTargetRect, setTutorialTargetRect] = useState(null);
  const [tutorialOverlayMetrics, setTutorialOverlayMetrics] = useState(null);
  const tutorialPickUserOverlayRootRef = useRef(null);
  const tutorialPickUserScrollRef = useRef(null);
  const tutorialPickUserScrollYRef = useRef(0);
  const tutorialPickUserRowRef = useRef(null);
  const [tutorialPickUserRect, setTutorialPickUserRect] = useState(null);
  const [tutorialPickUserOverlayMetrics, setTutorialPickUserOverlayMetrics] = useState(null);
  const [tutorialOtherPiecePhase, setTutorialOtherPiecePhase] = useState("select");

  // Tab reselect helper: used to ignore async results after a "reset to main"
  const resetSeqRef = useRef(0);
  const listRequestSeqRef = useRef(0);
  const handledOpenQInstanceIdRef = useRef("");

  // Prefetch freshness
  const PREFETCH_MAX_AGE_MS = 2 * 60 * 1000; // 2 minutes

  // 照会対象（フォロー一覧などから遷移した場合は route params で指定）
  const initialViewedUserId =
    route?.params?.viewedUserId ||
    route?.params?.targetUserId ||
    route?.params?.userId ||
    null;
  const initialOpenQInstanceId =
    route?.params?.openQInstanceId ||
    route?.params?.q_instance_id ||
    null;
  const initialOpenQKey =
    route?.params?.openQKey ||
    route?.params?.q_key ||
    null;
  const initialOpenTitle =
    route?.params?.openTitle ||
    route?.params?.title ||
    null;
  const initialOpenAt =
    route?.params?.openAt ||
    null;

  // 画面内で「今どのユーザーのPieceを見ているか」を切り替え可能にする
  const [activeViewedUserId, setActiveViewedUserId] = useState(
    initialViewedUserId ? String(initialViewedUserId) : null
  );

  // viewer（自分）の user_id（表示/フォロー一覧取得用）
  const [viewerUserId, setViewerUserId] = useState(null);

  // 現在の target（Piece所有者）の表示名
  const [targetDisplayName, setTargetDisplayName] = useState("（取得中）");
  const [targetNameLoading, setTargetNameLoading] = useState(false);

  // Follow picker（フォロー中ユーザーの一覧）
  const [userPickerVisible, setUserPickerVisible] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(false);
  const [followingError, setFollowingError] = useState("");
  const [followingUsers, setFollowingUsers] = useState([]);

  // --- UI state ---
  const [pickerVisible, setPickerVisible] = useState(false);
  const [sortMode, setSortMode] = useState("newest"); // newest | resonances

  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [qnaItems, setQnaItems] = useState([]);
  const [, setListMeta] = useState(null);

  const [detailLoading, setDetailLoading] = useState(false);
  const [detailLoadingId, setDetailLoadingId] = useState(null);
  const [selected, setSelected] = useState(null);

  const [resonanceDeleting, setResonanceDeleting] = useState(false);

  // --- Resonance (響き) ---
  const [resonanceModalVisible, setResonanceModalVisible] = useState(false);
  const [resonanceStrength, setResonanceStrength] = useState(null); // small|medium|large
  const [resonanceMemo, setResonanceMemo] = useState("");
  // 展開式メモ入力（InputScreen と同仕様）
  const [resonanceMemoActive, setResonanceMemoActive] = useState(false);
  const resonanceMemoInputRef = useRef(null);
  const [resonanceMemoContentHeight, setResonanceMemoContentHeight] = useState(44);
  const [resonanceSubmitting, setResonanceSubmitting] = useState(false);
  const [resonanceSubmitError, setResonanceSubmitError] = useState("");

  const tutorialBasePieces = useMemo(() => {
    const safe = Array.isArray(tutorialPieces) ? tutorialPieces : [];
    const selfItems = safe.filter(
      (item) => String(item?.tutorial_kind || "") === "self"
    );
    const hasMock = safe.some(
      (item) => String(item?.tutorial_kind || "") === "mock"
    );
    const mockItems = hasMock
      ? safe.filter((item) => String(item?.tutorial_kind || "") === "mock")
      : TUTORIAL_MOCK_PIECES.map((item) => ({ ...item }));
    const otherItems = safe.filter((item) => {
      const kind = String(item?.tutorial_kind || "");
      return kind !== "self" && kind !== "mock";
    });

    return [...selfItems, ...mockItems, ...otherItems];
  }, [tutorialPieces]);

  const tutorialFollowingUsers = useMemo(() => {
    const seen = new Set();
    return tutorialBasePieces
      .filter((item) => String(item?.owner_user_id || "") !== TUTORIAL_SELF_USER_ID)
      .map((item) => ({
        user_id: String(item?.owner_user_id || ""),
        display_name: String(item?.display_name || "User"),
      }))
      .filter((item) => {
        if (!item.user_id || seen.has(item.user_id)) return false;
        seen.add(item.user_id);
        return true;
      });
  }, [tutorialBasePieces]);

  const updateTutorialPiece = useCallback(
    (qInstanceId, updater) => {
      if (!isTutorialMode) return;
      const qid = String(qInstanceId || "");
      if (!qid) return;

      setTutorialPieces((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        let changed = false;
        const next = safePrev.map((item) => {
          if (String(item?.q_instance_id || "") !== qid) return item;
          changed = true;
          return typeof updater === "function" ? updater(item) : item;
        });
        return changed ? next : safePrev;
      });
    },
    [isTutorialMode, setTutorialPieces]
  );

  const getTutorialSortedItems = useCallback(
    (targetUserId, mode) => {
      const targetId = String(targetUserId || TUTORIAL_SELF_USER_ID);
      const baseItems = tutorialBasePieces.filter((item) => {
        const ownerId = String(item?.owner_user_id || "");
        if (targetId === TUTORIAL_SELF_USER_ID) {
          return ownerId === TUTORIAL_SELF_USER_ID;
        }
        return ownerId === targetId;
      });

      const items = baseItems.map((item) => ({ ...item }));
      const getDateScore = (value) => {
        const t = Date.parse(value || "");
        return Number.isFinite(t) ? t : 0;
      };
      const getMetric = (item, key) =>
        Number(item?.[key] ?? item?.[`${key}_count`] ?? 0) || 0;

      if (String(mode || "newest") === "resonances") {
        return items.sort(
          (a, b) =>
            getMetric(b, "resonances") - getMetric(a, "resonances") ||
            getDateScore(b?.created_at) - getDateScore(a?.created_at)
        );
      }

      return items.sort(
        (a, b) => getDateScore(b?.created_at) - getDateScore(a?.created_at)
      );
    },
    [tutorialBasePieces]
  );

  useEffect(() => {
    if (!isTutorialMode) return;
    setTutorialPieces((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const nextItems = [...safePrev];
      let changed = false;

      TUTORIAL_PIECES.forEach((seedItem) => {
        const seedId = String(seedItem?.q_instance_id || seedItem?.id || "").trim();
        const exists = nextItems.some((item) => {
          const itemId = String(item?.q_instance_id || item?.id || "").trim();
          return seedId && itemId === seedId;
        });
        if (!exists) {
          nextItems.push({ ...seedItem });
          changed = true;
        }
      });

      return changed ? nextItems : safePrev;
    });
  }, [isTutorialMode, setTutorialPieces]);

  const setTutorialListAndSelectFirst = useCallback(
    (targetUserId, mode) => {
      if (!isTutorialMode) return;

      const items = getTutorialSortedItems(targetUserId, mode);
      setQnaItems(items);
      setListMeta({ is_tutorial: true, total_items: items.length });
      setSelected(items.length > 0 ? { ...items[0], is_new: false } : null);

      setPickerVisible(false);
      setDetailLoading(false);
      setDetailLoadingId(null);
    },
    [isTutorialMode, getTutorialSortedItems]
  );

  const completeTutorialAndReturnHome = useCallback(async () => {
    try {
      await endTutorial?.();
    } catch (e) {
      console.warn("PieceLibraryScreen: endTutorial failed", e);
    }

    try {
      setTutorialStep(0);
      setActiveViewedUserId(null);
      setUserPickerVisible(false);
      setPickerVisible(false);
      setTutorialOtherPiecePhase("select");
    } catch {
      // noop
    }

    requestAnimationFrame(() => {
      try {
        const parent =
          typeof navigation?.getParent === "function" ? navigation.getParent() : null;
        if (parent && typeof parent.navigate === "function") {
          parent.navigate("Input");
          return;
        }
      } catch {
        // noop
      }

      try {
        navigation?.navigate?.("Input");
      } catch {
        // noop
      }
    });
  }, [endTutorial, navigation, setTutorialStep]);

  useEffect(() => {
    if (!isTutorialMode) return;
    if (typeof tutorialStep === "number" && tutorialStep < STEP_PIECES_SELF_VIEW) {
      setTutorialStep(STEP_PIECES_SELF_VIEW);
    }
  }, [isTutorialMode, tutorialStep, setTutorialStep]);

  useEffect(() => {
    if (!isTutorialMode) return;

    if (tutorialStep === STEP_PIECES_SELF_VIEW) {
      if (activeViewedUserId !== null) {
        setActiveViewedUserId(null);
      }
      setTutorialListAndSelectFirst(TUTORIAL_SELF_USER_ID, sortMode);
      return;
    }

    if (tutorialStep === STEP_PIECES_SWITCH_AND_REACT && activeViewedUserId) {
      setTutorialListAndSelectFirst(activeViewedUserId, sortMode);
    }
  }, [
    isTutorialMode,
    tutorialStep,
    sortMode,
    activeViewedUserId,
    setTutorialListAndSelectFirst,
  ]);

  useEffect(() => {
    if (!isTutorialMode || tutorialStep !== STEP_PIECES_SWITCH_AND_REACT) {
      setTutorialOtherPiecePhase("select");
      return;
    }

    if (!activeViewedUserId) {
      setTutorialOtherPiecePhase("select");
      return;
    }

    setTutorialOtherPiecePhase((prev) =>
      prev === "select" ? "view" : prev
    );
  }, [isTutorialMode, tutorialStep, activeViewedUserId]);

  const getTutorialTargetRef = useCallback(() => {
    if (!isTutorialMode) {
      return null;
    }

    if (tutorialStep === STEP_PIECES_SELF_VIEW) {
      return qaBlockRef;
    }

    if (tutorialStep === STEP_PIECES_SWITCH_AND_REACT) {
      return activeViewedUserId ? qaBlockRef : pieceSelectorRef;
    }

    return null;
  }, [isTutorialMode, tutorialStep, activeViewedUserId]);

  const syncTutorialTargetRect = useCallback(async () => {
    if (!isTutorialMode || !screenRootRef.current) {
      return null;
    }

    const targetRef = getTutorialTargetRef();
    if (!targetRef) {
      return null;
    }

    return syncTutorialSpotlightTarget({
      enabled: isTutorialMode,
      targetRef,
      rootRef: screenRootRef,
      scrollRef: tutorialBodyScrollRef,
      currentScrollYRef: tutorialBodyScrollYRef,
      overlayMetrics: tutorialOverlayMetrics,
      windowHeight,
      safeInsets,
      cardPlacement:
        tutorialStep === STEP_PIECES_SWITCH_AND_REACT && !!activeViewedUserId
          ? "top"
          : "bottom",
      measureOptions: {
        maxAttempts: 3,
        settleFrames: 1,
      },
    });
  }, [
    getTutorialTargetRef,
    isTutorialMode,
    tutorialOverlayMetrics,
    windowHeight,
    safeInsets,
    tutorialStep,
    activeViewedUserId,
  ]);

  useLayoutEffect(() => {
    if (!isTutorialMode) {
      setTutorialTargetRect(null);
      setTutorialOverlayMetrics(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      await waitForTutorialFrames(2);
      if (cancelled) return;

      const rect = await syncTutorialTargetRect();
      if (!cancelled) {
        setTutorialTargetRect(rect);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [
    isTutorialMode,
    tutorialStep,
    selected,
    userPickerVisible,
    pickerVisible,
    tutorialOtherPiecePhase,
    activeViewedUserId,
    tutorialOverlayMetrics,
    syncTutorialTargetRect,
  ]);

  const syncTutorialPickUserRect = useCallback(async () => {
    if (!isTutorialMode) {
      return null;
    }
    if (tutorialStep !== STEP_PIECES_SWITCH_AND_REACT) {
      return null;
    }
    if (!userPickerVisible || !!activeViewedUserId || !tutorialPickUserOverlayRootRef.current) {
      return null;
    }

    return syncTutorialSpotlightTarget({
      enabled: true,
      targetRef: tutorialPickUserRowRef,
      rootRef: tutorialPickUserOverlayRootRef,
      scrollRef: tutorialPickUserScrollRef,
      currentScrollYRef: tutorialPickUserScrollYRef,
      overlayMetrics: tutorialPickUserOverlayMetrics,
      windowHeight,
      safeInsets,
      cardPlacement: "bottom",
      measureOptions: {
        maxAttempts: 3,
        settleFrames: 1,
      },
    });
  }, [
    isTutorialMode,
    tutorialStep,
    userPickerVisible,
    activeViewedUserId,
    tutorialPickUserOverlayMetrics,
    windowHeight,
    safeInsets,
  ]);

  useLayoutEffect(() => {
    if (
      !isTutorialMode ||
      tutorialStep !== STEP_PIECES_SWITCH_AND_REACT ||
      !userPickerVisible ||
      !!activeViewedUserId
    ) {
      setTutorialPickUserRect(null);
      setTutorialPickUserOverlayMetrics(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      await waitForTutorialFrames(2);
      if (cancelled) return;

      const rect = await syncTutorialPickUserRect();
      if (!cancelled) {
        setTutorialPickUserRect(rect);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [
    isTutorialMode,
    tutorialStep,
    userPickerVisible,
    activeViewedUserId,
    followingUsers,
    followingLoading,
    tutorialPickUserOverlayMetrics,
    syncTutorialPickUserRect,
  ]);

  // ---------------------------------------------------------
// Tab reselect (when already on Piece tab)
// - Re-tapping the active tab returns to the "main" state:
//   closes modals and clears the selected Piece detail.
// ---------------------------------------------------------
const resetToMain = useCallback(() => {
  resetSeqRef.current += 1;
  listRequestSeqRef.current += 1;

  // close modal-like UIs
  setPickerVisible(false);
  setUserPickerVisible(false);
  setResonanceModalVisible(false);
  // clear detail selection
  setSelected(null);

  // best-effort: clear modal inputs/errors so they don't persist
  setResonanceStrength(null);
  setResonanceMemo("");
  setResonanceSubmitError("");

  // best-effort: stop spinners / clear fetched modal data
  setDetailLoading(false);
  setDetailLoadingId(null);
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

  // 画面遷移（Account など）で PieceScreen が裏に回ったとき、
  // Modal が「表示状態のまま残る」ことでタップが吸われる事故を防ぐ
  useEffect(() => {
    if (!navigation?.addListener) return;
    const unsubscribe = navigation.addListener("blur", () => {
          setPickerVisible(false);
      setUserPickerVisible(false);
      setResonanceModalVisible(false);
        });
    return unsubscribe;
  }, [navigation]);

  // route params が変わった場合も追従（例：他画面から viewedUserId で遷移）
  useEffect(() => {
    resetSeqRef.current += 1;
    listRequestSeqRef.current += 1;
    setActiveViewedUserId(initialViewedUserId ? String(initialViewedUserId) : null);
    setSelected(null);
    setQnaItems([]);
    setDetailLoading(false);
    setDetailLoadingId(null);
  }, [initialViewedUserId]);

  // viewer user id を取得（Piece表示名 / フォロー一覧取得に利用）
  useEffect(() => {
    setViewerUserId(user?.id ? String(user.id) : null);
  }, [user?.id]);

  // 「Piece：ユーザー名」表示用
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (isTutorialMode) {
        const tutorialTargetId = String(activeViewedUserId || "");
        if (!tutorialTargetId) {
          if (!cancelled) {
            setTargetDisplayName("自分");
            setTargetNameLoading(false);
          }
          return;
        }

        const tutorialTarget = tutorialFollowingUsers.find(
          (item) => String(item?.user_id || "") === tutorialTargetId
        );

        if (!cancelled) {
          setTargetDisplayName(
            String(tutorialTarget?.display_name || TUTORIAL_MOCK_USER_NAME)
          );
          setTargetNameLoading(false);
        }
        return;
      }

      const targetId = String(activeViewedUserId || viewerUserId || "");
      if (!targetId) {
        if (!cancelled) setTargetDisplayName("未ログイン");
        return;
      }

      setTargetNameLoading(true);
      try {
        const json = await apiGet(
          `/account/profile?target_user_id=${encodeURIComponent(targetId)}`
        );

        if (!cancelled) {
          const nm = String(json?.display_name || "").trim();
          setTargetDisplayName(nm || "（未設定）");
        }
      } catch {
        if (!cancelled) setTargetDisplayName("（取得失敗）");
      } finally {
        if (!cancelled) setTargetNameLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isTutorialMode, activeViewedUserId, viewerUserId, tutorialFollowingUsers]);

  const openSubscriptionSelect = () => {
    try {
      if (typeof onOpenSubscription === "function") {
        onOpenSubscription();
        return;
      }
    } catch {
      // ignore
    }

    try {
      if (navigation && typeof navigation.navigate === "function") {
        navigation.navigate("SubscriptionSelect");
        return;
      }
    } catch {
      // ignore
    }

    Alert.alert(
      "プラン画面を開けません",
      "プラン画面を開けませんでした。もう一度お試しください。"
    );
  };

  const refreshPieceUnread = useCallback(
    async () => {
      if (isTutorialMode) {
        try {
          setUnread("Piece", "piecesNew", false);
                  } catch {
          // noop
        }
        try {
          if (typeof onTabUnreadChange === "function") {
            onTabUnreadChange(false);
          }
        } catch {
          // noop
        }
        return false;
      }
      const ownerRequest = ownerRequestRef.current;
      if (!user?.id || ownerRequest?.expectedUserId !== user.id || ownerRequest.signal.aborted) return false;

      try {
        const json = await getNexusPiecesUnreadStatus(ownerRequest);
        if (ownerRequest.signal.aborted) return false;
        const hasUnread =
          typeof json?.has_unread === "boolean"
            ? json.has_unread
            : typeof json?.hasUnread === "boolean"
            ? json.hasUnread
            : false;

        try {
          setUnread("Piece", "piecesNew", !!hasUnread);
                  } catch {
          // noop
        }
        try {
          if (typeof onTabUnreadChange === "function") {
            onTabUnreadChange(!!hasUnread);
          }
        } catch {
          // noop
        }
        return !!hasUnread;
      } catch {
        if (ownerRequest.signal.aborted) return false;
        try {
          setUnread("Piece", "piecesNew", false);
                  } catch {
          // noop
        }
        try {
          if (typeof onTabUnreadChange === "function") {
            onTabUnreadChange(false);
          }
        } catch {
          // noop
        }
        return false;
      }
    },
    [isTutorialMode, onTabUnreadChange, setUnread, user?.id, authOwnerGeneration]
  );

  // Piece Home の Piece NEW は screen-local 集計ではなく
  // server-owned unread-status を単独で再同期する。
  useEffect(() => {
    void refreshPieceUnread();
  }, [refreshPieceUnread]);

  useEffect(() => {
    if (!navigation?.addListener) return undefined;
    const unsubscribe = navigation.addListener("focus", () => {
      Promise.resolve(refreshPieceUnread()).catch(() => null);
    });
    return () => {
      try {
        if (typeof unsubscribe === "function") unsubscribe();
        else if (unsubscribe && typeof unsubscribe.remove === "function") unsubscribe.remove();
      } catch {
        // noop
      }
    };
  }, [navigation, refreshPieceUnread]);

  const loadFollowingUsers = useCallback(async () => {
    const ownerRequest = ownerRequestRef.current;
    if (!isTutorialMode && (!user?.id || ownerRequest?.expectedUserId !== user.id || ownerRequest.signal.aborted)) return;
    setFollowingLoading(true);
    setFollowingError("");

    if (isTutorialMode) {
      setFollowingUsers(tutorialFollowingUsers);
      setFollowingLoading(false);
      return;
    }

    try {
      const json = await apiGet(
        buildFollowListPath({ targetUserId: ownerRequest.expectedUserId, tab: "following", limit: 1000 }), ownerRequest
      );
      if (ownerRequest.signal.aborted) return;

      const rows = Array.isArray(json?.rows) ? json.rows : [];
      const uniq = [];
      const seen = new Set();
      for (const row of rows) {
        const id = String(row?.id || "").trim();
        if (!id || seen.has(id)) continue;
        seen.add(id);
        const nm = String(row?.display_name || "").trim();
        uniq.push({ user_id: id, display_name: nm || "（未設定）" });
      }

      setFollowingUsers(uniq);
    } catch (e) {
      if (ownerRequest.signal.aborted) return;
      setFollowingError(String(e?.message || e));
      setFollowingUsers([]);
    } finally {
      if (!ownerRequest.signal.aborted) setFollowingLoading(false);
    }
  }, [isTutorialMode, tutorialFollowingUsers, user?.id]);

  const openUserPicker = useCallback(async () => {
    tutorialPickUserScrollYRef.current = 0;
    if (isTutorialMode) {
      setUserPickerVisible(true);
      await loadFollowingUsers();
      return;
    }

    const ownerRequest = ownerRequestRef.current;
    if (!user?.id || ownerRequest?.expectedUserId !== user.id || ownerRequest.signal.aborted) {
      Alert.alert("ログインが必要です", "ログイン後にご利用ください。");
      return;
    }

    setUserPickerVisible(true);
    await loadFollowingUsers();
  }, [isTutorialMode, loadFollowingUsers, user?.id]);

  const selectTargetUser = useCallback((nextUserId) => {
    resetSeqRef.current += 1;
    listRequestSeqRef.current += 1;
    const uid = nextUserId ? String(nextUserId) : null;
    setActiveViewedUserId(uid);
    setUserPickerVisible(false);

    // 表示中の応答やメタ情報はリセット（別ユーザーの混入を避ける）
    setSelected(null);
    setQnaItems([]);
    setListMeta(null);
    setListError("");
    setListLoading(false);
    setDetailLoading(false);
    setDetailLoadingId(null);
  }, []);

  const resolveTargetUserId = useCallback(
    async (viewerUserId) => {
      const viewedId = activeViewedUserId ? String(activeViewedUserId) : null;
      if (viewedId) return viewedId;
      return String(viewerUserId || "");
    },
    [activeViewedUserId]
  );

  const buildListParams = useCallback(
    (targetUserId, mode) => ({
      targetUserId: targetUserId ? String(targetUserId) : null,
      mode: String(mode || "newest"),
      limit: 100,
    }),
    []
  );

  const loadQnaList = useCallback(
    async (mode, opts) => {
      const sequence = ++listRequestSeqRef.current;
      const ownerRequest = ownerRequestRef.current;
      if (!isTutorialMode && (!user?.id || ownerRequest?.expectedUserId !== user.id || ownerRequest.signal.aborted)) return;
      const isCurrent = () => sequence === listRequestSeqRef.current &&
        (isTutorialMode || !ownerRequest.signal.aborted);
      const silent = !!opts?.silent;
      if (!silent) {
        setListLoading(true);
      }
      setListError("");
      try {
        if (isTutorialMode) {
          const targetUserId = await resolveTargetUserId(TUTORIAL_SELF_USER_ID);
          if (!isCurrent()) return;
          const items = getTutorialSortedItems(targetUserId, mode);
          setQnaItems(items);
          setListMeta({
            is_tutorial: true,
            total_items: items.length,
          });
          return;
        }

        const userId = ownerRequest.expectedUserId;
        const targetUserId = await resolveTargetUserId(userId);
        if (!isCurrent()) return;
        const json = await getNexusPiecesAsQnaList(buildListParams(targetUserId, mode), ownerRequest);
        if (!isCurrent()) return;

        const items = Array.isArray(json?.items) ? json.items : [];
        const meta = json?.meta || null;

        setQnaItems(items);
        setListMeta(meta);

        // cache（次回表示を即時化）
        try {
          const cacheKey = `qnaList:${String(targetUserId || "").trim()}:${String(mode || "newest").trim() || "newest"}`;
          if (String(targetUserId || "").trim()) {
            setPrefetch("Piece", cacheKey, {
              userId: userId || null,
              targetUserId,
              mode: String(mode || "newest"),
              items,
              meta,
            });
          }
        } catch {
          // noop
        }
      } catch (e) {
        if (!isCurrent()) return;
        setListError(String(e?.message || e));
      } finally {
        if (isCurrent()) setListLoading(false);
      }
    },
    [
      isTutorialMode,
      buildListParams,
      resolveTargetUserId,
      getTutorialSortedItems,
      setPrefetch,
      user?.id,
    ]
  );

  const openPicker = useCallback(async () => {
    setPickerVisible(true);

    if (isTutorialMode) {
      await loadQnaList(sortMode);
      return;
    }

    // まずキャッシュ（アプリ起動時プリロード）を即反映
    try {
      const targetId = activeViewedUserId || viewerUserId;
      const cacheKey = targetId ? `qnaList:${String(targetId)}:${String(sortMode || "newest")}` : null;
      const entry = cacheKey
        ? getPrefetchEntryFresh
          ? getPrefetchEntryFresh("Piece", cacheKey, PREFETCH_MAX_AGE_MS)
          : getPrefetchEntry("Piece", cacheKey)
        : null;
      const cached = entry?.value;
      const cachedItems = Array.isArray(cached?.items) ? cached.items : null;
      const cachedMeta = cached?.meta || null;

      if (cachedItems) {
        setQnaItems(cachedItems);
        setListMeta(cachedMeta);
        setListError("");
        setListLoading(false);

        // 最新はバックグラウンドで更新
        loadQnaList(sortMode, { silent: true });
        return;
      }
    } catch {
      // noop
    }

    await loadQnaList(sortMode);
  }, [
    isTutorialMode,
    activeViewedUserId,
    viewerUserId,
    sortMode,
    loadQnaList,
    getPrefetchEntry,
    getPrefetchEntryFresh,
  ]);

  const changeSortMode = useCallback(
    async (nextMode) => {
      const m = String(nextMode || "newest");
      setSortMode(m);

      if (isTutorialMode) {
        await loadQnaList(m);
        return;
      }

      // まずキャッシュを即反映して、切替の体感を速くする
      try {
        const targetId = activeViewedUserId || viewerUserId;
        const cacheKey = targetId ? `qnaList:${String(targetId)}:${String(m || "newest")}` : null;
        const entry = cacheKey
          ? getPrefetchEntryFresh
            ? getPrefetchEntryFresh("Piece", cacheKey, PREFETCH_MAX_AGE_MS)
            : getPrefetchEntry("Piece", cacheKey)
          : null;
        const cached = entry?.value;
        const cachedItems = Array.isArray(cached?.items) ? cached.items : null;
        const cachedMeta = cached?.meta || null;

        if (cachedItems) {
          setQnaItems(cachedItems);
          setListMeta(cachedMeta);
          setListError("");
          setListLoading(false);

          // 最新はバックグラウンドで更新
          await loadQnaList(m, { silent: true });
          return;
        }
      } catch {
        // noop
      }

      await loadQnaList(m);
    },
    [
      isTutorialMode,
      activeViewedUserId,
      viewerUserId,
      loadQnaList,
      getPrefetchEntry,
      getPrefetchEntryFresh,
    ]
  );

  const fetchDetail = useCallback(
    async (item) => {
      if (!item?.q_instance_id) return;
      if (detailLoading) return;
      const ownerRequest = ownerRequestRef.current;
      if (!isTutorialMode && (!user?.id || ownerRequest?.expectedUserId !== user.id || ownerRequest.signal.aborted)) return;
      const resetSeq = resetSeqRef.current;
      const qInstanceId = String(item.q_instance_id);
      const shouldRefreshUnread = !!item?.is_new;

      setDetailLoadingId(qInstanceId);
      setDetailLoading(true);
      try {
        if (isTutorialMode) {
          const nextViews = (Number(item?.views ?? 0) || 0) + 1;
          const nextSelected = {
            ...item,
            views: nextViews,
            is_new: false,
          };

          if (resetSeq !== resetSeqRef.current) return;
          setSelected(nextSelected);
          setPickerVisible(false);

          setQnaItems((prev) =>
            (prev || []).map((x) => {
              if (String(x?.q_instance_id || "") !== qInstanceId) return x;
              return {
                ...x,
                views: nextViews,
                is_new: false,
              };
            })
          );

          updateTutorialPiece(qInstanceId, (prev) => ({
            ...prev,
            views: nextViews,
            is_new: false,
          }));
          return;
        }

        const json = await getNexusPieceDetailQna(qInstanceId, {
          ...ownerRequest,
          markViewed: true,
        });

        if (resetSeq !== resetSeqRef.current || ownerRequest.signal.aborted) return;

        const nextSelected = {
          ...(json && typeof json === "object" ? json : {}),
        };

        setSelected(nextSelected);
        setPickerVisible(false);

        setQnaItems((prev) =>
          (prev || []).map((x) => {
            if (String(x?.q_instance_id || "") !== qInstanceId) return x;
            return {
              ...x,
              views: nextSelected?.views ?? x.views,
              resonances: nextSelected?.resonances ?? x.resonances,
              is_new: false,
            };
          })
        );

        if (shouldRefreshUnread) {
          Promise.resolve(refreshPieceUnread()).catch(() => null);
        }
      } catch (e) {
        if (resetSeq !== resetSeqRef.current || (!isTutorialMode && ownerRequest.signal.aborted)) return;
        Alert.alert("読み込みに失敗しました", buildErrorMessage(e));
      } finally {
        if (resetSeq === resetSeqRef.current && (isTutorialMode || !ownerRequest.signal.aborted)) {
          setDetailLoading(false);
          setDetailLoadingId(null);
        }
      }
    },
    [
      activeViewedUserId,
      detailLoading,
      isTutorialMode,
      refreshPieceUnread,
      updateTutorialPiece,
      user?.id,
    ]
  );

  // ---------------------------------------------------------
  // 履歴一覧から直接開かれた場合は、対象Pieceを自動で表示する
  // ---------------------------------------------------------
  useEffect(() => {
    const qid = String(initialOpenQInstanceId || "").trim();
    if (!qid) return;
    if (!isTutorialMode && !viewerUserId) return;

    const openKey = `${qid}:${String(activeViewedUserId || initialViewedUserId || viewerUserId || "")}:${String(initialOpenAt || "")}`;
    if (handledOpenQInstanceIdRef.current === openKey) return;
    handledOpenQInstanceIdRef.current = openKey;

    void fetchDetail({
      q_instance_id: qid,
      q_key: initialOpenQKey ? String(initialOpenQKey) : undefined,
      title: initialOpenTitle ? String(initialOpenTitle) : undefined,
      is_new: false,
    });
  }, [
    activeViewedUserId,
    fetchDetail,
    initialOpenQInstanceId,
    initialOpenQKey,
    initialOpenTitle,
    initialOpenAt,
    initialViewedUserId,
    isTutorialMode,
    viewerUserId,
  ]);

  // ---------------------------------------------------------
  // Resonance (UI -> MashOS API)
  // ---------------------------------------------------------

  const openResonanceModal = useCallback((prefill = null) => {
    const st = prefill && typeof prefill === "object" ? prefill.strength : null;
    const memo = prefill && typeof prefill === "object" ? prefill.memo : "";

    setResonanceStrength(st || null);
    setResonanceMemo(memo ? String(memo) : "");
    setResonanceMemoActive(false);
    setResonanceMemoContentHeight(44);
    setResonanceSubmitError("");
    setResonanceModalVisible(true);
  }, []);

  const closeResonanceModal = useCallback(() => {
    setResonanceModalVisible(false);
    setResonanceStrength(null);
    setResonanceMemo("");
    setResonanceMemoActive(false);
    setResonanceMemoContentHeight(44);
    setResonanceSubmitError("");
  }, []);

  const handleResonancePress = useCallback(async () => {
    if (!selected?.q_instance_id) return;
    const ownerRequest = ownerRequestRef.current;
    if (!isTutorialMode && (!user?.id || ownerRequest?.expectedUserId !== user.id || ownerRequest.signal.aborted)) return;

    const already = !!(selected?.is_resonated ?? selected?.resonated);
    const qidNow = String(selected.q_instance_id);

    if (already) {
      Alert.alert(
        "共鳴を解除しますか？",
        "共鳴は削除されます。この操作は元に戻せません。",
        [
          { text: "キャンセル", style: "cancel" },
          {
            text: "解除する",
            style: "destructive",
            onPress: () => {
              (async () => {
                if (!isTutorialMode && ownerRequest.signal.aborted) return;
                setResonanceDeleting(true);
                setResonanceSubmitError("");
                try {
                  if (isTutorialMode) {
                    const nextResonances = Math.max(
                      0,
                      (Number(selected?.resonances ?? 0) || 0) - 1
                    );

                    setSelected((prev) => {
                      if (!prev) return prev;
                      if (String(prev.q_instance_id) !== qidNow) return prev;
                      return {
                        ...prev,
                        resonances: nextResonances,
                        is_resonated: false,
                        resonated: false,
                        tutorial_my_resonance: null,
                      };
                    });

                    setQnaItems((prev) =>
                      (prev || []).map((x) => {
                        if (String(x?.q_instance_id || "") !== qidNow) return x;
                        return {
                          ...x,
                          resonances: nextResonances,
                          is_resonated: false,
                          resonated: false,
                          tutorial_my_resonance: null,
                        };
                      })
                    );

                    updateTutorialPiece(qidNow, (prev) => ({
                      ...prev,
                      resonances: nextResonances,
                      is_resonated: false,
                      resonated: false,
                      tutorial_my_resonance: null,
                    }));
                    return;
                  }

                  const res = await apiFetch(PIECE_RESONANCE_DELETE_ENDPOINT, {
                    ...ownerRequest,
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      q_instance_id: qidNow,
                      q_key: String(selected.q_key || ""),
                    }),
                  });

                  const json = await res.json().catch(() => ({}));
                  if (ownerRequest.signal.aborted) return;
                  if (!res.ok) {
                    const msg = json?.detail || json?.message || `HTTP ${res.status}`;
                    throw new Error(String(msg));
                  }

                  const nextResonated =
                    typeof json?.resonated === "boolean" ? json.resonated : false;
                  const nextResonances =
                    typeof json?.resonances === "number"
                      ? json.resonances
                      : Math.max(0, (Number(selected?.resonances ?? 0) || 0) - 1);

                  setSelected((prev) => {
                    if (!prev) return prev;
                    if (String(prev.q_instance_id) !== qidNow) return prev;
                    return {
                      ...prev,
                      resonances: nextResonances,
                      is_resonated: nextResonated,
                      resonated: nextResonated,
                    };
                  });

                  setQnaItems((prev) =>
                    (prev || []).map((x) => {
                      if (String(x?.q_instance_id || "") !== qidNow) return x;
                      return {
                        ...x,
                        resonances: nextResonances,
                        is_resonated: nextResonated,
                        resonated: nextResonated,
                      };
                    })
                  );
                } catch (e) {
                  if (!isTutorialMode && ownerRequest.signal.aborted) return;
                  setResonanceSubmitError(buildErrorMessage(e));
                  Alert.alert("解除に失敗しました", buildErrorMessage(e));
                } finally {
                  if (isTutorialMode || !ownerRequest.signal.aborted) setResonanceDeleting(false);
                }
              })();
            },
          },
        ]
      );
      return;
    }

    const resetSeq = resetSeqRef.current;
    setResonanceSubmitting(true);
    setResonanceSubmitError("");

    try {
      if (isTutorialMode) {
        const nextResonances = (Number(selected?.resonances ?? 0) || 0) + 1;
        const nextResonance = {
          strength: "medium",
          memo: "",
          created_at: new Date().toISOString(),
        };

        if (resetSeq !== resetSeqRef.current) return;

        setSelected((prev) => {
          if (!prev) return prev;
          if (String(prev.q_instance_id) !== qidNow) return prev;
          return {
            ...prev,
            resonances: nextResonances,
            is_resonated: true,
            resonated: true,
            tutorial_my_resonance: nextResonance,
          };
        });

        setQnaItems((prev) =>
          (prev || []).map((x) => {
            if (String(x?.q_instance_id || "") !== qidNow) return x;
            return {
              ...x,
              resonances: nextResonances,
              is_resonated: true,
              resonated: true,
              tutorial_my_resonance: nextResonance,
            };
          })
        );

        updateTutorialPiece(qidNow, (prev) => ({
          ...prev,
          resonances: nextResonances,
          is_resonated: true,
          resonated: true,
          tutorial_my_resonance: nextResonance,
        }));
        return;
      }

      const res = await apiFetch(PIECE_RESONANCE_SUBMIT_ENDPOINT, {
        ...ownerRequest,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q_instance_id: qidNow,
          q_key: String(selected.q_key || ""),
          strength: "medium",
          memo: null,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (ownerRequest.signal.aborted) return;
      if (!res.ok) {
        const msg = json?.detail || json?.message || `HTTP ${res.status}`;
        throw new Error(String(msg));
      }

      if (resetSeq !== resetSeqRef.current) return;

      const nextResonances =
        typeof json?.resonances === "number"
          ? json.resonances
          : (Number(selected?.resonances ?? 0) || 0) + 1;
      const nextResonated =
        typeof json?.resonated === "boolean"
          ? json.resonated
          : typeof json?.is_resonated === "boolean"
          ? json.is_resonated
          : true;

      setSelected((prev) => {
        if (!prev) return prev;
        if (String(prev.q_instance_id) !== qidNow) return prev;
        return {
          ...prev,
          resonances: nextResonances,
          is_resonated: nextResonated,
          resonated: nextResonated,
        };
      });

      setQnaItems((prev) =>
        (prev || []).map((x) => {
          if (String(x?.q_instance_id || "") !== qidNow) return x;
          return {
            ...x,
            resonances: nextResonances,
            is_resonated: nextResonated,
            resonated: nextResonated,
          };
        })
      );
    } catch (e) {
      if (!isTutorialMode && ownerRequest.signal.aborted) return;
      setResonanceSubmitError(buildErrorMessage(e));
      Alert.alert("共鳴に失敗しました", buildErrorMessage(e));
    } finally {
      if (isTutorialMode || !ownerRequest.signal.aborted) setResonanceSubmitting(false);
    }
  }, [isTutorialMode, selected, updateTutorialPiece, user?.id]);

  const submitResonance = useCallback(async () => {
    if (!selected?.q_instance_id) return;
    const ownerRequest = ownerRequestRef.current;
    if (!isTutorialMode && (!user?.id || ownerRequest?.expectedUserId !== user.id || ownerRequest.signal.aborted)) return;

    const already = !!(selected?.is_resonated ?? selected?.resonated);
    if (already) {
      Alert.alert("送信済みです", "共鳴はすでに送信されています。必要なら一度解除してから送信してください。");
      return;
    }

    if (!resonanceStrength) {
      Alert.alert("強度を選択してください", "響き（小/中/大）を選んでから送信してください。");
      return;
    }

    const resetSeq = resetSeqRef.current;
    const qidNow = String(selected.q_instance_id);

    setResonanceSubmitting(true);
    setResonanceSubmitError("");

    try {
      if (isTutorialMode) {
        const nextResonances = (Number(selected?.resonances ?? 0) || 0) + 1;
        const nextResonance = {
          strength: String(resonanceStrength),
          memo: resonanceMemo ? String(resonanceMemo) : "",
          created_at: new Date().toISOString(),
        };

        if (resetSeq !== resetSeqRef.current) return;

        setSelected((prev) => {
          if (!prev) return prev;
          if (String(prev.q_instance_id) !== qidNow) return prev;
          return {
            ...prev,
            resonances: nextResonances,
            is_resonated: true,
            resonated: true,
            tutorial_my_resonance: nextResonance,
          };
        });

        setQnaItems((prev) =>
          (prev || []).map((x) => {
            if (String(x?.q_instance_id || "") !== qidNow) return x;
            return {
              ...x,
              resonances: nextResonances,
              is_resonated: true,
              resonated: true,
              tutorial_my_resonance: nextResonance,
            };
          })
        );

        updateTutorialPiece(qidNow, (prev) => ({
          ...prev,
          resonances: nextResonances,
          is_resonated: true,
          resonated: true,
          tutorial_my_resonance: nextResonance,
        }));
        closeResonanceModal();
        Alert.alert("共鳴しました", "この共鳴を記録しました。");
        return;
      }

      const res = await apiFetch(PIECE_RESONANCE_SUBMIT_ENDPOINT, {
        ...ownerRequest,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q_instance_id: String(selected.q_instance_id),
          q_key: String(selected.q_key || ""),
          strength: String(resonanceStrength),
          memo: resonanceMemo ? String(resonanceMemo) : null,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (ownerRequest.signal.aborted) return;
      if (!res.ok) {
        const msg = json?.detail || json?.message || `HTTP ${res.status}`;
        throw new Error(String(msg));
      }

      // Resonance送信が成功した時点で「共鳴確定」される（サーバ側で+1）
      if (resetSeq !== resetSeqRef.current) return;

      const nextResonances =
        typeof json?.resonances === "number"
          ? json.resonances
          : Number(selected?.resonances ?? 0) || 0;

      const nextResonated =
        typeof json?.resonated === "boolean"
          ? json.resonated
          : typeof json?.is_resonated === "boolean"
          ? json.is_resonated
          : true;

      setSelected((prev) => {
        if (!prev) return prev;
        if (String(prev.q_instance_id) !== qidNow) return prev;
        return {
          ...prev,
          resonances: nextResonances,
          is_resonated: nextResonated,
          resonated: nextResonated,
        };
      });

      setQnaItems((prev) =>
        (prev || []).map((x) => {
          if (String(x?.q_instance_id) !== qidNow) return x;
          return {
            ...x,
            resonances: nextResonances,
          };
        })
      );

      closeResonanceModal();
      Alert.alert("送信しました", "響きを記録しました。");
    } catch (e) {
      if (!isTutorialMode && ownerRequest.signal.aborted) return;
      setResonanceSubmitError(buildErrorMessage(e));
    } finally {
      if (isTutorialMode || !ownerRequest.signal.aborted) setResonanceSubmitting(false);
    }
  }, [
    isTutorialMode,
    selected,
    resonanceStrength,
    resonanceMemo,
    closeResonanceModal,
    updateTutorialPiece,
    user?.id,
  ]);

  const confirmDeleteResonance = useCallback(() => {
    if (!selected?.q_instance_id) return;
    const ownerRequest = ownerRequestRef.current;
    if (!isTutorialMode && (!user?.id || ownerRequest?.expectedUserId !== user.id || ownerRequest.signal.aborted)) return;

    const beforeResonated = !!(selected?.is_resonated ?? selected?.resonated);
    if (!beforeResonated) {
      Alert.alert("解除できません", "まだ共鳴していません。");
      return;
    }

    if (isTutorialMode) {
      Alert.alert(
        "共鳴を解除しますか？",
        "Resonance/共鳴は削除されます。この操作は元に戻せません。",
        [
          { text: "キャンセル", style: "cancel" },
          {
            text: "削除する",
            style: "destructive",
            onPress: () => {
              (async () => {
                setResonanceDeleting(true);
                setResonanceSubmitError("");
                try {
                  const qidNow = String(selected.q_instance_id);
                  const nextResonances = Math.max(
                    0,
                    (Number(selected?.resonances ?? 0) || 0) - 1
                  );

                  setSelected((prev) => {
                    if (!prev) return prev;
                    if (String(prev.q_instance_id) !== qidNow) return prev;
                    return {
                      ...prev,
                      resonances: nextResonances,
                      is_resonated: false,
                      resonated: false,
                      tutorial_my_resonance: null,
                    };
                  });

                  setQnaItems((prev) =>
                    (prev || []).map((x) => {
                      if (String(x?.q_instance_id || "") !== qidNow) return x;
                      return {
                        ...x,
                        resonances: nextResonances,
                        is_resonated: false,
                        resonated: false,
                        tutorial_my_resonance: null,
                      };
                    })
                  );

                  updateTutorialPiece(qidNow, (prev) => ({
                    ...prev,
                    resonances: nextResonances,
                    is_resonated: false,
                    resonated: false,
                    tutorial_my_resonance: null,
                  }));

                  closeResonanceModal();
                  Alert.alert("解除しました", "チュートリアル共鳴を解除しました。");
                } catch (e) {
                  setResonanceSubmitError(buildErrorMessage(e));
                } finally {
                  setResonanceDeleting(false);
                }
              })();
            },
          },
        ]
      );
      return;
    }

    Alert.alert(
      "共鳴を解除しますか？",
      "Resonance/共鳴は削除されます。この操作は元に戻せません。",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除する",
          style: "destructive",
          onPress: () => {
            (async () => {
              if (ownerRequest.signal.aborted) return;
              setResonanceDeleting(true);
              setResonanceSubmitError("");
              try {
                const qidNow = String(selected.q_instance_id);

                const res = await apiFetch(PIECE_RESONANCE_DELETE_ENDPOINT, {
                  ...ownerRequest,
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    q_instance_id: qidNow,
                    q_key: String(selected.q_key || ""),
                  }),
                });

                const json = await res.json().catch(() => ({}));
                if (ownerRequest.signal.aborted) return;
                if (!res.ok) {
                  const msg = json?.detail || json?.message || `HTTP ${res.status}`;
                  throw new Error(String(msg));
                }

                if (
                  typeof json?.resonated !== "boolean" ||
                  typeof json?.resonances !== "number"
                ) {
                  throw new Error("サーバー応答が不正です（resonated/resonances）");
                }

                const nextResonated = json.resonated;
                const nextResonances = json.resonances;

                setSelected((prev) => {
                  if (!prev) return prev;
                  if (String(prev.q_instance_id) !== qidNow) return prev;
                  return {
                    ...prev,
                    resonances: nextResonances,
                    is_resonated: nextResonated,
                    resonated: nextResonated,
                  };
                });

                setQnaItems((prev) =>
                  (prev || []).map((x) => {
                    if (String(x?.q_instance_id) !== qidNow) return x;
                    return {
                      ...x,
                      resonances: nextResonances,
                    };
                  })
                );

                closeResonanceModal();
                Alert.alert("解除しました", "共鳴を解除しました。");
              } catch (e) {
                if (ownerRequest.signal.aborted) return;
                setResonanceSubmitError(buildErrorMessage(e));
              } finally {
                if (!ownerRequest.signal.aborted) setResonanceDeleting(false);
              }
            })();
          },
        },
      ]
    );
  }, [isTutorialMode, selected, closeResonanceModal, updateTutorialPiece, user?.id]);

  const isDark = themeName === "dark";

  const isSelfTarget =
    !activeViewedUserId ||
    (viewerUserId && String(activeViewedUserId) === String(viewerUserId));

  const tutorialSelfTargetDisabled =
    isTutorialMode && tutorialStep === STEP_PIECES_SWITCH_AND_REACT && !activeViewedUserId;

  const isResonatedNow = !!(selected?.is_resonated ?? selected?.resonated);

  return (
    <View ref={screenRootRef} collapsable={false} style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />

      <View style={styles.safeContent}>
      <ScrollView
        ref={tutorialBodyScrollRef}
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        scrollEventThrottle={16}
        onScroll={(e) => {
          tutorialBodyScrollYRef.current =
            e?.nativeEvent?.contentOffset?.y ?? tutorialBodyScrollYRef.current;
        }}
      >
        <View style={styles.panelHeader}>
          <CocolonBackButton fallbackRouteName="Piece" />
          <Text style={styles.panelTitle}>ピース</Text>
          <View style={styles.panelHeaderRightPlaceholder} />
        </View>

        <View style={styles.qnaIntroCard}>
          <Text style={styles.qnaIntroTitle}>ピース</Text>
          <Text style={styles.qnaIntroText}>
            見たいユーザーを選び、ピースを表示してください。
          </Text>
          {isTutorialMode ? (
            <Text style={styles.tierHintText}>
              まずは自分のピースを確認し、その後にUserへ切り替えると「他ユーザーのピースも閲覧できる」流れが分かります。
            </Text>
          ) : null}

          {/* Main action */}
          <View style={styles.actions}>
            <View style={styles.targetRow}>
              <Text style={styles.targetLabel}>対象：</Text>
              <View ref={pieceSelectorRef} collapsable={false} style={{ flex: 1, minWidth: 0 }}>
                <CocolonPressable
                  onPress={openUserPicker}
                  style={styles.targetNamePressable}
                >
                  <Text style={styles.targetName}>
                    {isSelfTarget
                      ? "自分"
                      : targetNameLoading
                      ? "（読み込み中）"
                      : targetDisplayName}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color={colors.TEXT_ON_LIGHT}
                    style={{ marginLeft: 6 }}
                  />
                </CocolonPressable>
              </View>
            </View>

            <CocolonButton variant="primary" onPress={openPicker}>
              <View style={styles.btnRow}>
                <Ionicons
                  name="sparkles-outline"
                  size={18}
                  color={colors.ACCENT_TEXT}
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.goldButtonText}>ピースを表示</Text>
              </View>
            </CocolonButton>
          </View>

          {/* Selected detail */}
          {selected || detailLoading ? (
            <View style={styles.responseGroup}>
              {selected?.title && !detailLoading ? (
                <>
                  <View ref={qaBlockRef} collapsable={false}>
                    <Text style={[styles.responseLabel, { fontWeight: "600" }]}>【問い】</Text>
                    <View style={styles.responseCard}>
                      <Text style={[styles.detailTitle, { marginBottom: 0 }]}>{selected.title}</Text>
                    </View>

                    <Text
                      style={[
                        styles.responseLabel,
                        { fontWeight: "600", marginTop: 12 },
                      ]}
                    >
                      【応答】
                    </Text>
                    <View style={styles.responseCard}>
                      <Text style={styles.responseText}>{selected.body}</Text>

                      <View style={styles.metricsRow}>
                        <View style={styles.metricPill}>
                          <Ionicons
                            name="heart-outline"
                            size={14}
                            color={colors.TEXT_SUBTLE}
                            style={{ marginRight: 6 }}
                          />
                          <Text style={styles.metricText}>
                            {formatMetricCount(selected?.resonances ?? 0)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {!isSelfTarget ? (
                    <View ref={metricsActionsWrapRef} collapsable={false} style={styles.metricsActions}>
                      <CocolonPressable
                        onPress={handleResonancePress}
                        style={[
                          styles.resonanceBtn,
                          (resonanceSubmitting || resonanceDeleting) && { backgroundColor: colors.FIELD_BG, borderColor: colors.CARD_BORDER },
                        ]}
                        disabled={resonanceSubmitting || resonanceDeleting}
                        accessibilityLabel={isResonatedNow ? "共鳴済み" : "共鳴"}
                        accessibilityState={{ selected: isResonatedNow, busy: resonanceSubmitting || resonanceDeleting }}
                      >
                        <View style={styles.btnRow}>
                          <Ionicons
                            name={isResonatedNow ? "heart" : "heart-outline"}
                            size={14}
                            color={(resonanceSubmitting || resonanceDeleting) ? colors.TEXT_SUBTLE : colors.ACCENT_TEXT}
                            style={{ marginRight: 6 }}
                          />
                          <Text style={[styles.resonanceBtnText, { color: (resonanceSubmitting || resonanceDeleting) ? colors.TEXT_SUBTLE : colors.ACCENT_TEXT }]}>
                            {isResonatedNow ? "共鳴済み" : "共鳴"}
                          </Text>
                        </View>
                      </CocolonPressable>
                    </View>
                  ) : null}
                </>
              ) : (
                <>
                  <Text style={[styles.responseLabel, { fontWeight: "600" }]}>【応答】</Text>
                  <View style={styles.responseCard}>
                    <Text style={styles.responseText}>読み込み中…</Text>
                  </View>
                </>
              )}
            </View>
          ) : null}

          {listError ? (
            <Text style={styles.modeErrorText}>一覧取得に失敗: {listError}</Text>
          ) : null}
        </View>

        </ScrollView>
      </View>

      {/* Target user picker modal */}
      <Modal
        visible={userPickerVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setUserPickerVisible(false)}
        supportedOrientations={MODAL_ORIENTATIONS}
      >
        <SafeAreaProvider style={{ flex: 1, backgroundColor: styles.modalOverlay.backgroundColor }}><SafeAreaView edges={["top", "right", "bottom", "left"]} style={{ flex: 1 }}><View ref={tutorialPickUserOverlayRootRef} style={[styles.modalOverlay, { backgroundColor: "transparent" }]} collapsable={false}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>フォロー中のユーザー</Text>
              <Pressable
                onPress={() => setUserPickerVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={18} color={colors.TEXT_ON_LIGHT} />
              </Pressable>
            </View>

            {followingLoading ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator color={colors.TEXT_SUBTLE} />
                <Text style={styles.modalLoadingText}>読み込み中…</Text>
              </View>
            ) : (
              <ScrollView
                ref={tutorialPickUserScrollRef}
                style={styles.listArea}
                scrollEventThrottle={16}
                onScroll={(e) => {
                  tutorialPickUserScrollYRef.current =
                    e?.nativeEvent?.contentOffset?.y ?? tutorialPickUserScrollYRef.current;
                }}
              >
                {/* 自分に戻る */}
                <Pressable
                  onPress={() => selectTargetUser(null)}
                  disabled={tutorialSelfTargetDisabled}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: tutorialSelfTargetDisabled, selected: isSelfTarget }}
                  style={[
                    styles.listRow,
                    isSelfTarget && styles.listRowActive,
                    tutorialSelfTargetDisabled && { backgroundColor: colors.FIELD_BG, borderColor: colors.CARD_BORDER },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <View style={styles.rowTitleLine}>
                      <Text style={[styles.rowTitle, tutorialSelfTargetDisabled && { color: colors.TEXT_SUBTLE }]}>
                        自分に戻る
                      </Text>
                      {isSelfTarget ? (
                        <View style={styles.activeBadge}>
                          <Text style={styles.activeBadgeText}>使用中</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                  {isSelfTarget ? (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={colors.TEXT_SUBTLE}
                      style={{ marginLeft: 10 }}
                    />
                  ) : (
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={colors.TEXT_SUBTLE}
                      style={{ marginLeft: 10 }}
                    />
                  )}
                </Pressable>

                {(followingUsers || []).length > 0 ? (
                  (followingUsers || []).map((u, idx) => {
                    const isActive =
                      activeViewedUserId &&
                      String(activeViewedUserId) === String(u.user_id);
                    return (
                      <Pressable
                        key={u.user_id}
                        ref={
                          isTutorialMode &&
                          tutorialStep === STEP_PIECES_SWITCH_AND_REACT &&
                          !activeViewedUserId &&
                          idx === 0
                            ? tutorialPickUserRowRef
                            : undefined
                        }
                        collapsable={false}
                        accessibilityRole="button" accessibilityState={{ selected: !!isActive }}
                        onPress={() => selectTargetUser(u.user_id)}
                        style={[
                          styles.listRow,
                          isActive && styles.listRowActive,
                        ]}
                      >
                        <View style={{ flex: 1 }}>
                          <View style={styles.rowTitleLine}>
                            <Text style={styles.rowTitle}>
                              {u.display_name}
                            </Text>
                            {isActive ? (
                              <View style={styles.activeBadge}>
                                <Text style={styles.activeBadgeText}>使用中</Text>
                              </View>
                            ) : null}
                          </View>
                        </View>
                        {isActive ? (
                          <Ionicons
                            name="checkmark"
                            size={18}
                            color={colors.TEXT_SUBTLE}
                            style={{ marginLeft: 10 }}
                          />
                        ) : (
                          <Ionicons
                            name="chevron-forward"
                            size={18}
                            color={colors.TEXT_SUBTLE}
                            style={{ marginLeft: 10 }}
                          />
                        )}
                      </Pressable>
                    );
                  })
                ) : (
                  <View style={styles.pickerEmptyInline}>
                    <Text style={styles.modalEmptyText}>
                      フォロー中のユーザーがいません。
                    </Text>
                    {followingError ? (
                      <Text style={styles.modeErrorText}>取得に失敗: {followingError}</Text>
                    ) : null}
                  </View>
                )}
              </ScrollView>
            )}
          </View>

          <TutorialOverlay
            visible={
              !!isTutorialMode &&
              tutorialStep === STEP_PIECES_SWITCH_AND_REACT &&
              !!userPickerVisible &&
              !activeViewedUserId &&
              !!tutorialPickUserRect
            }
            targetRect={tutorialPickUserRect}
            title="Userを選択"
            message="Userを選択して、ピースを見てみましょう。"
            step={tutorialStep}
            totalSteps={TUTORIAL_TOTAL_STEPS}
            mode="action"
            showPrimaryButton={false}
            actionHint="ユーザー名を押してください"
            onTargetPress={() => {
              const tutorialUserId =
                followingUsers?.[0]?.user_id ?? tutorialFollowingUsers?.[0]?.user_id ?? null;
              if (tutorialUserId) {
                selectTargetUser(tutorialUserId);
              }
            }}
            onMetricsChange={setTutorialPickUserOverlayMetrics}
          />
        </View></SafeAreaView></SafeAreaProvider>
      </Modal>

      {/* Picker modal */}
      <Modal
        visible={pickerVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setPickerVisible(false)}
        supportedOrientations={MODAL_ORIENTATIONS}
      >
        <SafeAreaProvider style={{ flex: 1, backgroundColor: styles.modalOverlay.backgroundColor }}><SafeAreaView edges={["top", "right", "bottom", "left"]} style={{ flex: 1 }}><View style={[styles.modalOverlay, { backgroundColor: "transparent" }]}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>問いを選ぶ</Text>
              <Pressable
                onPress={() => setPickerVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={18} color={colors.TEXT_ON_LIGHT} />
              </Pressable>
            </View>

            <ScrollView style={styles.listArea} keyboardShouldPersistTaps="handled">
            {listError ? <Text style={styles.modeErrorText} accessibilityRole="alert">一覧取得に失敗: {listError}</Text> : null}
            <View style={styles.sortRow}>
              {[
                { key: "newest", label: "新着" },
                { key: "resonances", label: "人気(共鳴)" },
              ].map((x) => {
                const active = sortMode === x.key;
                return (
                  <Pressable
                    key={x.key}
                    accessibilityRole="button" accessibilityState={{ selected: active, disabled: listLoading }}
                    onPress={() => changeSortMode(x.key)}
                    style={[styles.sortPill, active && styles.sortPillActive]}
                    disabled={listLoading}
                  >
                    <Text
                      style={[
                        styles.sortPillText,
                        active && styles.sortPillTextActive,
                      ]}
                    >
                      {x.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {listLoading ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator color={colors.TEXT_SUBTLE} />
                <Text style={styles.modalLoadingText}>読み込み中…</Text>
              </View>
            ) : (qnaItems || []).length > 0 ? (
              <View>
                {(qnaItems || []).map((it) => (
                  <Pressable
                    key={it.q_instance_id}
                    onPress={() => fetchDetail(it)}
                    style={styles.listRow}
                    disabled={detailLoading}
                  >
                    <View style={{ flex: 1 }}>
                      <View style={styles.rowTitleLine}>
                        <Text style={styles.rowTitle}>
                          {it.title}
                        </Text>
                        {it.is_new ? (
                          <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>New</Text>
                          </View>
                        ) : null}
                      </View>

                      <View style={styles.rowMetaLine}>
                        <View style={styles.rowMetaItem}>
                          <Ionicons
                            name="heart-outline"
                            size={14}
                            color={colors.TEXT_SUBTLE}
                            style={{ marginRight: 6 }}
                          />
                          <Text style={styles.rowMetaText}>
                            {it.resonances ?? 0}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {detailLoading && String(detailLoadingId) === String(it.q_instance_id) ? (
                      <ActivityIndicator
                        color={colors.TEXT_SUBTLE}
                        style={{ marginLeft: 10 }}
                      />
                    ) : (
                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={colors.TEXT_SUBTLE}
                        style={{ marginLeft: 10 }}
                      />
                    )}
                  </Pressable>
                ))}
              </View>
            ) : listError ? null : (
              <View style={styles.modalEmpty}>
                <Text style={styles.modalEmptyText}>
                  {isTutorialMode
                    ? "まだチュートリアルピースがありません。\n先にピース画面で回答を作成してください。"
                    : 'まだ表示できるピースがありません。\n入力内容が蓄積されるとここに表示されます。'}
                </Text>
              </View>
            )}
            </ScrollView>
          </View>
        </View></SafeAreaView></SafeAreaProvider>
      </Modal>

      {/* Resonance submit modal */}
      <Modal
        visible={resonanceModalVisible}
        animationType="fade"
        transparent
        onRequestClose={closeResonanceModal}
        supportedOrientations={MODAL_ORIENTATIONS}
      >
        <SafeAreaProvider style={{ flex: 1, backgroundColor: styles.modalOverlay.backgroundColor }}><SafeAreaView edges={["top", "right", "bottom", "left"]} style={{ flex: 1 }}><View style={[styles.modalOverlay, { backgroundColor: "transparent" }]}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Resonance</Text>
              <Pressable onPress={closeResonanceModal} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={18} color={colors.TEXT_ON_LIGHT} />
              </Pressable>
            </View>

            <ScrollView
              ref={resonanceModalScrollRef}
              style={styles.listArea}
              contentContainerStyle={{ paddingBottom: 24 + keyboardInset }}
              keyboardShouldPersistTaps="handled"
            >
              {resonanceDeleting ? (
                <View style={styles.inlineLoadingRow}>
                  <ActivityIndicator color={colors.TEXT_SUBTLE} />
                  <Text style={styles.inlineLoadingText}>共鳴を解除中…</Text>
                </View>
              ) : null}
              <Text style={styles.modalDescText}>このピースのどこに、どんなふうに響きましたか？</Text>

              <View style={{ marginTop: 6 }}>
                {(ECHO_STRENGTH_OPTIONS || []).map((opt) => {
                  const active = resonanceStrength === opt.key;
                  return (
                    <Pressable
                      key={opt.key}
                      accessibilityRole="button" accessibilityState={{ selected: active }}
                      onPress={() => setResonanceStrength(opt.key)}
                      style={[
                        styles.choiceCard,
                        active && styles.choiceCardActive,
                      ]}
                      disabled={resonanceSubmitting || resonanceDeleting || isResonatedNow}
                    >
                      <View style={styles.choiceTitleRow}>
                        <Text
                          style={[
                            styles.choiceTitle,
                            active && styles.choiceTitleActive,
                          ]}
                        >
                          {opt.label}
                        </Text>
                        <Text
                          style={[
                            styles.choiceSub,
                            active && styles.choiceSubActive,
                          ]}
                        >
                          {opt.subLabel}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              <View style={{ marginTop: 10 }}>
                <Text style={styles.inputLabel}>感じたこと・考えたこと（任意）</Text>

                {resonanceMemoActive ? (
                  <View style={[styles.memoCard, styles.memoCardExpanded]}>
                    <TextInput
                      ref={resonanceMemoInputRef}
                      style={[
                        styles.memoInput,
                        {
                          flex: 0,
                          width: "100%",
                          height: Math.min(
                            Math.max(resonanceMemoContentHeight || 44, 44),
                            inputMaxHeight
                          ),
                        },
                      ]}
                      placeholder="どこに響いたか、なぜそう感じたかを書いてください。"
                      {...(isIOS ? { defaultValue: resonanceMemo } : { value: resonanceMemo })}
                      onChangeText={setResonanceMemo}
                      {...(isIOS
                        ? {
                            onChange: (e) =>
                              setResonanceMemo(e?.nativeEvent?.text ?? ""),
                          }
                        : {})}
                      multiline
                      scrollEnabled
                      textAlignVertical="top"
                      placeholderTextColor={colors.TEXT_SUBTLE}
                      editable={!isResonatedNow && !resonanceSubmitting && !resonanceDeleting}
                      showSoftInputOnFocus={!isResonatedNow && !resonanceSubmitting && !resonanceDeleting}
                      onFocus={(e) => {
                        modalLastScrollRef.current = resonanceModalScrollRef.current;
                        modalLastFocusTargetRef.current =
                          e?.target ?? e?.nativeEvent?.target ?? null;
                        requestAnimationFrame(() => scrollToFocusedInput());
                      }}
                      onBlur={() => {
                        modalLastScrollRef.current = null;
                        modalLastFocusTargetRef.current = null;
                        setResonanceMemoActive(false);
                      }}
                      onContentSizeChange={(e) => {
                        const h = e?.nativeEvent?.contentSize?.height ?? 0;
                        if (h) setResonanceMemoContentHeight(h);
                        requestAnimationFrame(() => scrollToFocusedInput());
                      }}
                    />
                  </View>
                ) : (
                  <CocolonPressable
                    style={[styles.memoCard, styles.memoCardCollapsed]}
                    onPress={() => {
                      setResonanceMemoActive(true);
                      setTimeout(() => {
                        try {
                          resonanceMemoInputRef.current?.focus?.();
                        } catch {
                          // noop
                        }
                      }, 50);
                    }}
                    accessibilityLabel="Resonanceで感じたことを入力する"
                  >
                    <View style={styles.collapsedRow}>
                      <View style={styles.collapsedLeft}>
                        <Ionicons
                          name="create-outline"
                          size={18}
                          color={colors.TEXT_SUBTLE}
                          style={{ marginRight: 8 }}
                        />
                        <Text
                          style={[
                            styles.collapsedText,
                            !(resonanceMemo && resonanceMemo.trim().length > 0) &&
                              styles.collapsedTextPlaceholder,
                          ]}
                        >
                          {resonanceMemo && resonanceMemo.trim().length > 0
                            ? resonanceMemo.replace(/\s+/g, " ").trim()
                            : "どこに響いたか、なぜそう感じたかを書いてください。"}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-down"
                        size={18}
                        color={colors.TEXT_SUBTLE}
                      />
                    </View>
                  </CocolonPressable>
                )}
              </View>

              {resonanceSubmitError ? (
                <Text style={styles.modeErrorText}>{resonanceSubmitError}</Text>
              ) : null}

              <CocolonButton
                variant="primary"
                style={{ marginTop: 14 }}
                onPress={submitResonance}
                disabled={!resonanceStrength || resonanceSubmitting || resonanceDeleting || isResonatedNow}
                loading={resonanceSubmitting}
              >
                <View style={styles.btnRow}>
                  {resonanceSubmitting ? (
                    <ActivityIndicator color={colors.TEXT_SUBTLE} style={{ marginRight: 8 }} />
                  ) : (
                    <Ionicons
                      name={isResonatedNow ? "checkmark" : "save-outline"}
                      size={16}
                      color={(!resonanceStrength || resonanceSubmitting || resonanceDeleting || isResonatedNow) ? colors.TEXT_SUBTLE : colors.ACCENT_TEXT}
                      style={{ marginRight: 6 }}
                    />
                  )}
                  <Text style={[styles.goldButtonText, { color: (!resonanceStrength || resonanceSubmitting || resonanceDeleting || isResonatedNow) ? colors.TEXT_SUBTLE : colors.ACCENT_TEXT }]}>
                    {isResonatedNow ? "保存済み" : "保存"}
                  </Text>
                </View>
              </CocolonButton>

              <CocolonButton
                variant="secondary"
                style={[
                  styles.historyBtn,
                  { marginTop: 10 },
                ]}
                onPress={confirmDeleteResonance}
                disabled={!isResonatedNow || resonanceSubmitting || resonanceDeleting}
              >
                <View style={styles.btnRow}>
                  {resonanceDeleting ? (
                    <ActivityIndicator color={(!isResonatedNow || resonanceSubmitting || resonanceDeleting) ? colors.TEXT_SUBTLE : colors.ERROR} style={{ marginRight: 8 }} />
                  ) : (
                    <Ionicons
                      name="trash-outline"
                      size={16}
                      color={(!isResonatedNow || resonanceSubmitting || resonanceDeleting) ? colors.TEXT_SUBTLE : colors.ERROR}
                      style={{ marginRight: 6 }}
                    />
                  )}
                  <Text style={[styles.historyBtnText, { color: (!isResonatedNow || resonanceSubmitting || resonanceDeleting) ? colors.TEXT_SUBTLE : colors.ERROR }]}>
                    共鳴を解除
                  </Text>
                </View>
              </CocolonButton>
            </ScrollView>
          </View>
        </View></SafeAreaView></SafeAreaProvider>
      </Modal>

      <TutorialOverlay
        visible={
          !!isTutorialMode &&
          (tutorialStep === STEP_PIECES_SELF_VIEW ||
            tutorialStep === STEP_PIECES_SWITCH_AND_REACT) &&
          !!tutorialTargetRect
        }
        targetRect={tutorialTargetRect}
        title={
          tutorialStep === STEP_PIECES_SELF_VIEW
            ? "自分のピース"
            : !activeViewedUserId
            ? "Userへ切り替え"
            : "Userのピース"
        }
        message={
          tutorialStep === STEP_PIECES_SELF_VIEW
            ? "先ほどの入力から整えられた、自分のピースです。問いと答えとして、読みやすく整えています。"
            : !activeViewedUserId
            ? "『対象：自分』を押して、Userを選んでください。"
            : "フォロー中ユーザーのピースはこのように閲覧できます。\n\n感情通知や共鳴履歴などもありますが、チュートリアル後にご自身で確認してみてください。"
        }
        step={tutorialStep}
        totalSteps={TUTORIAL_TOTAL_STEPS}
        mode={
          tutorialStep === STEP_PIECES_SWITCH_AND_REACT && !activeViewedUserId
            ? "action"
            : "info"
        }
        showPrimaryButton={
          tutorialStep === STEP_PIECES_SELF_VIEW ||
          (tutorialStep === STEP_PIECES_SWITCH_AND_REACT && !!activeViewedUserId)
        }
        nextLabel={
          tutorialStep === STEP_PIECES_SWITCH_AND_REACT && !!activeViewedUserId
            ? "完了してホームへ"
            : "次へ"
        }
        cardPlacement={
          tutorialStep === STEP_PIECES_SWITCH_AND_REACT && !!activeViewedUserId
            ? "top"
            : "bottom"
        }
        onNext={() => {
          if (!isTutorialMode) return;
          if (tutorialStep === STEP_PIECES_SELF_VIEW) {
            setTutorialStep(STEP_PIECES_SWITCH_AND_REACT);
            return;
          }

          if (tutorialStep === STEP_PIECES_SWITCH_AND_REACT && activeViewedUserId) {
            void completeTutorialAndReturnHome();
          }
        }}
      />

    </View>
  );
}

function createStyles(COLORS, ui) {
  const font = ui?.font || {};
  const text = ui?.text || {};
  return StyleSheet.create(applyTypographyTokens({
    container: {
      flex: 1,
      backgroundColor: COLORS.BG_SILVER,
    },
    safeContent: { flex: 1 },
    body: { flex: 1 },
    bodyContent: {
      paddingTop: 16,
      paddingHorizontal: 20,
      alignItems: "stretch",
      paddingBottom: 32,
      width: '100%',
      maxWidth: 640,
      alignSelf: 'center',
    },

    // Header
    panelHeader: {
      flexDirection: "row",
      alignItems: 'flex-start',
      justifyContent: "space-between",
      marginBottom: 20,
      columnGap: 12,
    },
    panelTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      letterSpacing: 0,
      flexShrink: 1,
      minWidth: 0,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
    },
    panelHeaderRightPlaceholder: {
      width: 44,
    },

    // Intro
    qnaIntroCard: {
      borderRadius: 0,
      borderWidth: 0,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: 'transparent',
      paddingHorizontal: 0,
      paddingVertical: 0,
      marginBottom: 16,
    },
    qnaIntroTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 4,
    },
    qnaIntroText: {
      color: COLORS.TEXT_ON_LIGHT,
    },

    // History
    historyCard: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginBottom: 16,
    },
    historyCardTitle: {
      color: COLORS.TEXT_ON_LIGHT,
    },
    historyEntry: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
      minHeight: 52,
    },
    historyEntryText: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
    },

    
    // Recommend
    recoCard: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginBottom: 16,
    },
    recoHeader: {
      flexDirection: "row",
      alignItems: 'flex-start',
      justifyContent: "space-between",
      marginBottom: 8,
      columnGap: 12,
    },
    recoTitle: {
      color: COLORS.TEXT_ON_LIGHT,
    },
    recoSummaryText: {
      marginTop: 8,
      color: COLORS.TEXT_ON_LIGHT,
    },
    recoRefreshBtn: {
      width: 44,
      height: 44,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    recoToggleRow: {
      flexDirection: "row",
      alignItems: 'stretch',
      marginTop: 4,
      marginBottom: 12,
      columnGap: 8,
    },
    recoTogglePill: {
      flex: 1,
      marginRight: 0,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44,
      paddingHorizontal: 12,
    },
    recoTogglePillActive: {
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.SURFACE_TONAL,
    },
    recoToggleText: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
      textAlign: 'center',
    },
    recoToggleTextActive: {
      color: COLORS.ON_SURFACE_TONAL,
    },
    recoSectionLabel: {
      color: text.sectionLabel ?? text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    recoPillScroll: { marginTop: 8 },
    recoPillContent: { paddingRight: 6 },
    recoPill: {
      marginRight: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      maxWidth: 320,
      minHeight: 44,
    },
    recoPillActive: {
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.SURFACE_TONAL,
    },
    recoPillText: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
    },
    recoPillTextActive: {
      color: COLORS.ON_SURFACE_TONAL,
    },
    recoUserRow: {
      flexDirection: "row",
      alignItems: 'center',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginBottom: 8,
      minHeight: 64,
    },
    recoUserName: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
    },
    recoUserSub: {
      marginTop: 2,
      color: text.description ?? COLORS.TEXT_SUBTLE,
      flexShrink: 1,
    },
    recoEmptyText: {
      marginTop: 8,
      color: COLORS.TEXT_SUBTLE,
    },
    recoLoadingRow: {
      flexDirection: "row",
      alignItems: 'flex-start',
      marginTop: 8,
    },
    recoLoadingText: {
      marginLeft: 10,
      color: COLORS.TEXT_SUBTLE,
      flexShrink: 1,
    },

// Buttons
    actions: {
      marginTop: 16,
      marginBottom: 12,
    },
    targetRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: 'flex-start',
      marginBottom: 16,
      flexWrap: 'wrap',
      columnGap: 8,
      rowGap: 8,
    },
    targetLabel: {
      color: text.sectionLabel ?? text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    targetNamePressable: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 0,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      maxWidth: '100%',
      minHeight: 44,
    },
    targetName: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
      minWidth: 0,
    },
    goldButton: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
      minHeight: 52,
    },
    goldButtonText: {
      color: COLORS.ACCENT_TEXT,
      letterSpacing: 0,
      flexShrink: 1,
      textAlign: 'center',
    },
    btnRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      maxWidth: '100%',
    },
    tierHintText: {
      marginTop: 8,
      color: text.description ?? COLORS.TEXT_SUBTLE,
      textAlign: 'left',
    },

    // Response
    responseGroup: {
      marginTop: 24,
    },
    responseLabel: {
      color: text.sectionLabel ?? text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginBottom: 8,
    },
    responseCard: {
      backgroundColor: COLORS.PANEL_BG,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 20,
      paddingVertical: 20,
      shadowColor: "#000",
      shadowOpacity: 0,
      shadowRadius: 0,
      shadowOffset: { width: 0, height: 6 },
      elevation: 0,
    },
    detailTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 10,
    },
    responseText: {
      color: COLORS.TEXT_ON_LIGHT,
    },
    responseEmpty: {
      color: COLORS.TEXT_SUBTLE,
    },

    metricsRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 16,
      flexWrap: 'wrap',
      columnGap: 8,
      rowGap: 8,
    },
    metricPill: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      marginRight: 0,
      backgroundColor: COLORS.PANEL_BG,
      maxWidth: '100%',
    },
    metricText: {
      color: COLORS.TEXT_ON_LIGHT,
      minWidth: 0,
      textAlign: "right",
      fontVariant: ["tabular-nums"],
      flexShrink: 1,
    },
    resonanceBtn: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 0,
      minWidth: 86,
      minHeight: 44,
      maxWidth: '100%',
    },
    resonanceBtnText: {
      color: COLORS.ACCENT_TEXT,
      textAlign: 'center',
      flexShrink: 1,
    },

    metricsActions: {
      marginTop: 16,
      alignSelf: "flex-end",
      flexDirection: "row",
      alignItems: "center",
      flexWrap: 'wrap',
      columnGap: 8,
      rowGap: 8,
      maxWidth: '100%',
    },
    historyBtn: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44,
    },
    historyBtnText: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
      textAlign: 'center',
    },

    // Resonance modal UI
    modalDescText: {
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 12,
    },
    inlineLoadingRow: {
      flexDirection: "row",
      alignItems: 'flex-start',
      marginBottom: 10,
    },
    inlineLoadingText: {
      marginLeft: 10,
      color: COLORS.TEXT_SUBTLE,
      flexShrink: 1,
    },
    choiceCard: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginBottom: 8,
      minHeight: 52,
    },
    choiceCardActive: {
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.SURFACE_TONAL,
    },
    choiceTitleRow: {
      flexDirection: "row",
      alignItems: 'flex-start',
      justifyContent: "space-between",
      flexWrap: 'wrap',
      columnGap: 8,
      rowGap: 6,
    },
    choiceTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      paddingRight: 0,
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 160,
      minWidth: 0,
    },
    choiceTitleActive: {
      color: COLORS.ON_SURFACE_TONAL,
    },
    choiceSub: {
      color: text.description ?? COLORS.TEXT_SUBTLE,
      flexShrink: 1,
    },
    choiceSubActive: {
      color: COLORS.ON_SURFACE_TONAL,
    },

    inputLabel: {
      color: text.sectionLabel ?? text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginBottom: 8,
    },
    /** メモ入力カード（InputScreenと同仕様：展開式） */
    memoCard: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 16,
      paddingVertical: 16,
      shadowColor: "#000",
      shadowOpacity: 0,
      shadowRadius: 0,
      shadowOffset: { width: 0, height: 6 },
      elevation: 0,
    },
    memoCardCollapsed: {
      minHeight: 64,
      justifyContent: "center",
    },
    memoCardExpanded: {
      minHeight: 120,
    },
    collapsedRow: {
      flexDirection: "row",
      alignItems: 'flex-start',
      justifyContent: "space-between",
    },
    collapsedLeft: {
      flexDirection: "row",
      alignItems: 'flex-start',
      flex: 1,
      paddingRight: 8,
      minWidth: 0,
    },
    collapsedText: {
      flex: 1,
      color: COLORS.TEXT_ON_LIGHT,
      minWidth: 0,
      flexShrink: 1,
    },
    collapsedTextPlaceholder: {
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },
    memoInput: {
      flex: 1,
      minHeight: 108,
      color: COLORS.TEXT_ON_LIGHT,
      textAlignVertical: "top",
    },

    // Error text (re-using old naming)
    modeErrorText: {
      marginTop: 10,
      color: COLORS.ERROR,
    },

    // Upgrade CTA

    // Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.35)",
      paddingHorizontal: 16,
      justifyContent: "center",
      paddingVertical: 16,
    },
    modalCard: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 20,
      paddingVertical: 20,
      maxHeight: '90%',
      width: '100%',
      maxWidth: 640,
      alignSelf: 'center',
      flexShrink: 1,
      minHeight: 0,
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: 'flex-start',
      justifyContent: "space-between",
      marginBottom: 16,
      columnGap: 12,
    },
    modalTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      flex: 1,
      minWidth: 0,
      flexShrink: 1,
    },
    modalCloseBtn: {
      width: 44,
      height: 44,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.FIELD_BG,
      flexShrink: 0,
    },

    sortRow: {
      flexDirection: "row",
      alignItems: 'stretch',
      justifyContent: "space-between",
      marginBottom: 10,
      columnGap: 8,
    },
    sortPill: {
      flex: 1,
      marginHorizontal: 0,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44,
      paddingHorizontal: 12,
    },
    sortPillActive: {
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.SURFACE_TONAL,
    },
    sortPillText: {
      color: COLORS.TEXT_ON_LIGHT,
      textAlign: 'center',
      flexShrink: 1,
    },
    sortPillTextActive: {
      color: COLORS.ON_SURFACE_TONAL,
    },

    modalLoading: {
      paddingVertical: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    modalLoadingText: {
      marginTop: 10,
      color: COLORS.TEXT_SUBTLE,
    },

    listArea: {
      paddingBottom: 8,
      flexShrink: 1,
      minHeight: 0,
    },
    listRow: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginBottom: 8,
      minHeight: 64,
    },
    listRowActive: {
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.SURFACE_TONAL,
    },
    activeBadge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: COLORS.SURFACE_TONAL,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      alignSelf: "flex-start",
      maxWidth: '100%',
    },
    activeBadgeText: {
      color: COLORS.ON_SURFACE_TONAL,
      flexShrink: 1,
    },
    pickerEmptyInline: {
      paddingVertical: 18,
      alignItems: "center",
      justifyContent: "center",
    },

    rowTitleLine: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      flexWrap: 'wrap',
      columnGap: 8,
      rowGap: 6,
    },
    rowTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      paddingRight: 0,
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 160,
      minWidth: 0,
    },
    newBadge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: COLORS.SURFACE_TONAL,
      alignSelf: "flex-start",
      maxWidth: '100%',
    },
    newBadgeText: {
      color: COLORS.ON_SURFACE_TONAL,
      flexShrink: 1,
    },
    rowMetaLine: {
      marginTop: 8,
      flexDirection: "row",
      alignItems: "center",
      flexWrap: 'wrap',
      columnGap: 12,
      rowGap: 6,
    },
    rowMetaItem: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 0,
      maxWidth: '100%',
    },
    rowMetaText: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
    },

    modalEmpty: {
      paddingVertical: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    modalEmptyText: {
      color: COLORS.TEXT_SUBTLE,
      textAlign: "center",
    },
  }, ui, {"panelTitle":"screenTitle","recoTitle":"sectionTitle","recoSummaryText":"description","recoToggleText":"button","recoToggleTextActive":"button","recoSectionLabel":"sectionTitle","recoPillText":"button","recoPillTextActive":"button","recoEmptyText":"description","recoLoadingText":"description","qnaIntroTitle":"sectionTitle","qnaIntroText":"description","targetLabel":"button","targetName":"button","goldButtonText":"button","historyCardTitle":"sectionTitle","historyEntryText":"button","modalTitle":"modalTitle","modalLoadingText":"description","modalEmptyText":"description","recoUserName":"button","recoUserSub":"meta","rowTitle":"button","activeBadgeText":"meta","modeErrorText":"description","tierHintText":"description","responseLabel":"sectionTitle","detailTitle":"body","responseText":"body","responseEmpty":"description","metricText":"meta","resonanceBtnText":"button","historyBtnText":"button","modalDescText":"body","inlineLoadingText":"description","choiceTitle":"button","choiceTitleActive":"button","choiceSub":"meta","choiceSubActive":"meta","inputLabel":"button","collapsedText":"body","collapsedTextPlaceholder":"body","memoInput":"body","sortPillText":"button","sortPillTextActive":"button","newBadgeText":"meta","rowMetaText":"meta"}));
}
