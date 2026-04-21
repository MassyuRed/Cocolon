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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../theme/ThemeContext";
import { supabase } from "../lib/supabase";
import { getCurrentUserId } from "../lib/user";
import { apiGet, apiFetch } from "../lib/apiClient";
import {
  getNexusReflectionDetailQna,
  getNexusReflectionsAsQnaList,
  getNexusReflectionsUnreadStatus,
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
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";

/**
 * MyModelReflectionsScreen (2026-02 New Q&A Architecture)
 * -------------------------------------------
 * - 自由入力Q&A（/mymodel/infer）を廃止
 * - 「質問を生成」→ リストから選択 → 応答本文を表示
 * - RN側は基本表示のみ（処理は MashOS API 側へ）
 */

const PANEL_MIN_HEIGHT = 690;

// ---- API base ----
// Prefer Expo env var if present (avoid hard-coding across dev/prod)
const API_BASE = String(
  (typeof process !== "undefined" && process?.env?.EXPO_PUBLIC_MYMODEL_API_URL) ||
    "https://mashos-api.onrender.com"
).replace(/\/+$/, "");

// Reaction / owner-side compatibility endpoints (MashOS)
// Public Piece read path is now unified under /nexus/* via lib/nexusApi.
// Echoes / Discoveries (MashOS)
const QNA_ECHOES_SUBMIT_ENDPOINT = `${API_BASE}/mymodel/qna/echoes/submit`;
const QNA_ECHOES_HISTORY_ENDPOINT = `${API_BASE}/mymodel/qna/echoes/history`;
const QNA_ECHOES_DELETE_ENDPOINT = `${API_BASE}/mymodel/qna/echoes/delete`;

// Echoes / Discoveries UI labels (UI語彙は人間思考)
const ECHO_STRENGTH_OPTIONS = Object.freeze([
  { key: "small", label: "静かに響いた", subLabel: "響き（小）" },
  { key: "medium", label: "心が動いた", subLabel: "響き（中）" },
  { key: "large", label: "深く響いた", subLabel: "響き（大）" },
]);

const TUTORIAL_REFLECTION_QUESTION = "理想の休日の過ごし方は？";
const TUTORIAL_SELF_USER_ID = "tutorial-self";
const TUTORIAL_MOCK_FRIEND_NAME = "User";
const TUTORIAL_MOCK_REFLECTIONS = Object.freeze([
  {
    id: "tutorial-reflection-mock-1",
    q_instance_id: "tutorial-q-mock-1",
    q_key: "tutorial-holiday",
    title: TUTORIAL_REFLECTION_QUESTION,
    body:
      "朝は少しゆっくり起きて、好きな音楽を流しながらコーヒーを飲みます。午後は本屋か静かなカフェで過ごして、夜は早めに眠れる休日が理想です。",
    owner_user_id: "tutorial-follow-1",
    display_name: TUTORIAL_MOCK_FRIEND_NAME,
    friend_code: "MIO123",
    is_tutorial: true,
    tutorial_kind: "mock",
    created_at: "2026-01-01T09:00:00.000Z",
    resonances: 4,
    views: 12,
    is_new: true,
  },
]);

const TUTORIAL_TOTAL_STEPS = 21;
const STEP_REFLECTIONS_SELF_VIEW = 16;
const STEP_REFLECTIONS_SWITCH_AND_REACT = 17;
const STEP_FRIENDS_START = 18;

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
export default function MyModelReflectionsScreen({ route, onOpenSubscription, onTabUnreadChange } = {}) {
  const { colors, themeName } = useTheme();
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

  const echoesModalScrollRef = useRef(null);

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
    tutorialReflections,
    setTutorialReflections,
    setTutorialStep,
  } = useTutorial();

  const screenRootRef = useRef(null);
  const tutorialBodyScrollRef = useRef(null);
  const tutorialBodyScrollYRef = useRef(0);
  const myModelSelectorRef = useRef(null);
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
  const [tutorialOtherReflectionPhase, setTutorialOtherReflectionPhase] = useState("select");

  // Tab reselect helper: used to ignore async results after a "reset to main"
  const resetSeqRef = useRef(0);
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

  // 画面内で「今どのユーザーのMyModelを見ているか」を切り替え可能にする
  const [activeViewedUserId, setActiveViewedUserId] = useState(
    initialViewedUserId ? String(initialViewedUserId) : null
  );

  // viewer（自分）の user_id（表示/フォロー一覧取得用）
  const [viewerUserId, setViewerUserId] = useState(null);

  // 現在の target（MyModel所有者）の表示名
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

  const [echoesDeleting, setEchoesDeleting] = useState(false);

  // --- Echoes (響き) ---
  const [echoesModalVisible, setEchoesModalVisible] = useState(false);
  const [echoesStrength, setEchoesStrength] = useState(null); // small|medium|large
  const [echoesMemo, setEchoesMemo] = useState("");
  // 展開式メモ入力（InputScreen と同仕様）
  const [echoesMemoActive, setEchoesMemoActive] = useState(false);
  const echoesMemoInputRef = useRef(null);
  const [echoesMemoContentHeight, setEchoesMemoContentHeight] = useState(44);
  const [echoesSubmitting, setEchoesSubmitting] = useState(false);
  const [echoesSubmitError, setEchoesSubmitError] = useState("");

  const tutorialBaseReflections = useMemo(() => {
    const safe = Array.isArray(tutorialReflections) ? tutorialReflections : [];
    const selfItems = safe.filter(
      (item) => String(item?.tutorial_kind || "") === "self"
    );
    const hasMock = safe.some(
      (item) => String(item?.tutorial_kind || "") === "mock"
    );
    const mockItems = hasMock
      ? safe.filter((item) => String(item?.tutorial_kind || "") === "mock")
      : TUTORIAL_MOCK_REFLECTIONS.map((item) => ({ ...item }));
    const otherItems = safe.filter((item) => {
      const kind = String(item?.tutorial_kind || "");
      return kind !== "self" && kind !== "mock";
    });

    return [...selfItems, ...mockItems, ...otherItems];
  }, [tutorialReflections]);

  const tutorialFollowingUsers = useMemo(() => {
    const seen = new Set();
    return tutorialBaseReflections
      .filter((item) => String(item?.owner_user_id || "") !== TUTORIAL_SELF_USER_ID)
      .map((item) => ({
        user_id: String(item?.owner_user_id || ""),
        display_name: String(item?.display_name || "模擬ユーザー"),
      }))
      .filter((item) => {
        if (!item.user_id || seen.has(item.user_id)) return false;
        seen.add(item.user_id);
        return true;
      });
  }, [tutorialBaseReflections]);

  const updateTutorialReflection = useCallback(
    (qInstanceId, updater) => {
      if (!isTutorialMode) return;
      const qid = String(qInstanceId || "");
      if (!qid) return;

      setTutorialReflections((prev) => {
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
    [isTutorialMode, setTutorialReflections]
  );

  const getTutorialSortedItems = useCallback(
    (targetUserId, mode) => {
      const targetId = String(targetUserId || TUTORIAL_SELF_USER_ID);
      const baseItems = tutorialBaseReflections.filter((item) => {
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
    [tutorialBaseReflections]
  );

  useEffect(() => {
    if (!isTutorialMode) return;
    setTutorialReflections((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const hasMock = safePrev.some(
        (item) => String(item?.tutorial_kind || "") === "mock"
      );
      if (hasMock) return safePrev;
      return [...safePrev, ...TUTORIAL_MOCK_REFLECTIONS.map((item) => ({ ...item }))];
    });
  }, [isTutorialMode, setTutorialReflections]);

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

  useEffect(() => {
    if (!isTutorialMode) return;
    if (typeof tutorialStep === "number" && tutorialStep < STEP_REFLECTIONS_SELF_VIEW) {
      setTutorialStep(STEP_REFLECTIONS_SELF_VIEW);
    }
  }, [isTutorialMode, tutorialStep, setTutorialStep]);

  useEffect(() => {
    if (!isTutorialMode) return;

    if (tutorialStep === STEP_REFLECTIONS_SELF_VIEW) {
      if (activeViewedUserId !== null) {
        setActiveViewedUserId(null);
      }
      setTutorialListAndSelectFirst(TUTORIAL_SELF_USER_ID, sortMode);
      return;
    }

    if (tutorialStep === STEP_REFLECTIONS_SWITCH_AND_REACT && activeViewedUserId) {
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
    if (!isTutorialMode || tutorialStep !== STEP_REFLECTIONS_SWITCH_AND_REACT) {
      setTutorialOtherReflectionPhase("select");
      return;
    }

    if (!activeViewedUserId) {
      setTutorialOtherReflectionPhase("select");
      return;
    }

    setTutorialOtherReflectionPhase((prev) =>
      prev === "select" ? "view" : prev
    );
  }, [isTutorialMode, tutorialStep, activeViewedUserId]);

  const getTutorialTargetRef = useCallback(() => {
    if (!isTutorialMode) {
      return null;
    }

    if (tutorialStep === STEP_REFLECTIONS_SELF_VIEW) {
      return qaBlockRef;
    }

    if (tutorialStep === STEP_REFLECTIONS_SWITCH_AND_REACT) {
      if (!activeViewedUserId) {
        return myModelSelectorRef;
      }

      if (tutorialOtherReflectionPhase === "view") {
        return qaBlockRef;
      }

      return metricsActionsWrapRef;
    }

    return null;
  }, [
    isTutorialMode,
    tutorialStep,
    activeViewedUserId,
    tutorialOtherReflectionPhase,
  ]);

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
        tutorialStep === STEP_REFLECTIONS_SWITCH_AND_REACT && !!activeViewedUserId
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
    tutorialOtherReflectionPhase,
    activeViewedUserId,
    tutorialOverlayMetrics,
    syncTutorialTargetRect,
  ]);

  const syncTutorialPickUserRect = useCallback(async () => {
    if (!isTutorialMode) {
      return null;
    }
    if (tutorialStep !== STEP_REFLECTIONS_SWITCH_AND_REACT) {
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
      tutorialStep !== STEP_REFLECTIONS_SWITCH_AND_REACT ||
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
// Tab reselect (when already on MyModel tab)
// - Re-tapping the active tab returns to the "main" state:
//   closes modals and clears the selected Reflection detail.
// ---------------------------------------------------------
const resetToMain = useCallback(() => {
  resetSeqRef.current += 1;

  // close modal-like UIs
  setPickerVisible(false);
  setUserPickerVisible(false);
  setEchoesModalVisible(false);
  // clear detail selection
  setSelected(null);

  // best-effort: clear modal inputs/errors so they don't persist
  setEchoesStrength(null);
  setEchoesMemo("");
  setEchoesSubmitError("");

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

  // 画面遷移（Account など）で MyModelScreen が裏に回ったとき、
  // Modal が「表示状態のまま残る」ことでタップが吸われる事故を防ぐ
  useEffect(() => {
    if (!navigation?.addListener) return;
    const unsubscribe = navigation.addListener("blur", () => {
          setPickerVisible(false);
      setUserPickerVisible(false);
      setEchoesModalVisible(false);
        });
    return unsubscribe;
  }, [navigation]);

  // route params が変わった場合も追従（例：他画面から viewedUserId で遷移）
  useEffect(() => {
    setActiveViewedUserId(initialViewedUserId ? String(initialViewedUserId) : null);
  }, [initialViewedUserId]);

  // viewer user id を取得（MyModel表示名 / フォロー一覧取得に利用）
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const id = await getCurrentUserId();
        if (!cancelled) setViewerUserId(id ? String(id) : null);
      } catch {
        if (!cancelled) setViewerUserId(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 「MyModel：ユーザー名」表示用
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
            String(tutorialTarget?.display_name || TUTORIAL_MOCK_FRIEND_NAME)
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

  async function getAuthContext() {
    let userId = viewerUserId ? String(viewerUserId) : null;
    let accessToken = null;
    try {
      if (!userId) {
        userId = await getCurrentUserId();
      }
    } catch (e) {
      console.warn("MyModelScreen: failed to resolve userId", e);
    }
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      accessToken = sessionData?.session?.access_token ?? null;
    } catch (e) {
      console.warn("MyModelScreen: failed to resolve auth session", e);
    }
    return { userId, accessToken };
  }

  const refreshHomeReflectionsUnread = useCallback(
    async (providedAccessToken = null) => {
      if (isTutorialMode) {
        try {
          setUnread("MyModel", "reflectionsNew", false);
          setUnread("MyModel", "qnaNew", false);
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

      try {
        let accessToken = providedAccessToken;
        if (!accessToken) {
          const { data: sessionData } = await supabase.auth.getSession();
          accessToken = sessionData?.session?.access_token ?? null;
        }
        if (!accessToken) {
          setUnread("MyModel", "reflectionsNew", false);
          setUnread("MyModel", "qnaNew", false);
          try {
            if (typeof onTabUnreadChange === "function") {
              onTabUnreadChange(false);
            }
          } catch {
            // noop
          }
          return false;
        }

        const json = await getNexusReflectionsUnreadStatus();
        const hasUnread =
          typeof json?.has_unread === "boolean"
            ? json.has_unread
            : typeof json?.hasUnread === "boolean"
            ? json.hasUnread
            : false;

        try {
          setUnread("MyModel", "reflectionsNew", !!hasUnread);
          setUnread("MyModel", "qnaNew", false);
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
        try {
          setUnread("MyModel", "reflectionsNew", false);
          setUnread("MyModel", "qnaNew", false);
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
    [isTutorialMode, onTabUnreadChange, setUnread]
  );

  // MyModel Home の Reflections NEW は screen-local 集計ではなく
  // server-owned unread-status を単独で再同期する。
  useEffect(() => {
    void refreshHomeReflectionsUnread();
  }, [refreshHomeReflectionsUnread]);

  useEffect(() => {
    if (!navigation?.addListener) return undefined;
    const unsubscribe = navigation.addListener("focus", () => {
      Promise.resolve(refreshHomeReflectionsUnread()).catch(() => null);
    });
    return () => {
      try {
        if (typeof unsubscribe === "function") unsubscribe();
        else if (unsubscribe && typeof unsubscribe.remove === "function") unsubscribe.remove();
      } catch {
        // noop
      }
    };
  }, [navigation, refreshHomeReflectionsUnread]);

  const loadFollowingUsers = useCallback(async () => {
    setFollowingLoading(true);
    setFollowingError("");

    if (isTutorialMode) {
      setFollowingUsers(tutorialFollowingUsers);
      setFollowingLoading(false);
      return;
    }

    try {
      const myUserId = await getCurrentUserId().catch(() => null);
      if (!myUserId) {
        setFollowingUsers([]);
        setFollowingError("ログインが必要です");
        return;
      }

      const json = await apiGet(
        `/myprofile/follow-list?target_user_id=${encodeURIComponent(myUserId)}&tab=following&limit=1000`
      );

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
      setFollowingError(String(e?.message || e));
      setFollowingUsers([]);
    } finally {
      setFollowingLoading(false);
    }
  }, [isTutorialMode, tutorialFollowingUsers]);

  const openUserPicker = useCallback(async () => {
    tutorialPickUserScrollYRef.current = 0;
    if (isTutorialMode) {
      setUserPickerVisible(true);
      await loadFollowingUsers();
      return;
    }

    const myUserId = await getCurrentUserId().catch(() => null);
    if (!myUserId) {
      Alert.alert("ログインが必要です", "ログイン後にご利用ください。");
      return;
    }

    setUserPickerVisible(true);
    await loadFollowingUsers();
  }, [isTutorialMode, loadFollowingUsers]);

  const selectTargetUser = useCallback((nextUserId) => {
    const uid = nextUserId ? String(nextUserId) : null;
    setActiveViewedUserId(uid);
    setUserPickerVisible(false);

    // 表示中の応答やメタ情報はリセット（別ユーザーの混入を避ける）
    setSelected(null);
    setQnaItems([]);
    setListMeta(null);
    setListError("");
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
      const silent = !!opts?.silent;
      if (!silent) {
        setListLoading(true);
      }
      setListError("");
      try {
        if (isTutorialMode) {
          const targetUserId = await resolveTargetUserId(TUTORIAL_SELF_USER_ID);
          const items = getTutorialSortedItems(targetUserId, mode);
          setQnaItems(items);
          setListMeta({
            is_tutorial: true,
            total_items: items.length,
          });
          return;
        }

        const { userId, accessToken } = await getAuthContext();
        if (!accessToken) {
          Alert.alert("ログインが必要です", "ログイン後にご利用ください。");
          return;
        }

        const targetUserId = await resolveTargetUserId(userId);
        const json = await getNexusReflectionsAsQnaList(buildListParams(targetUserId, mode));

        const items = Array.isArray(json?.items) ? json.items : [];
        const meta = json?.meta || null;

        setQnaItems(items);
        setListMeta(meta);

        // cache（次回表示を即時化）
        try {
          const cacheKey = `qnaList:${String(targetUserId || "").trim()}:${String(mode || "newest").trim() || "newest"}`;
          if (String(targetUserId || "").trim()) {
            setPrefetch("MyModel", cacheKey, {
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
        setListError(String(e?.message || e));
      } finally {
        setListLoading(false);
      }
    },
    [
      isTutorialMode,
      buildListParams,
      resolveTargetUserId,
      getTutorialSortedItems,
      setPrefetch,
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
          ? getPrefetchEntryFresh("MyModel", cacheKey, PREFETCH_MAX_AGE_MS)
          : getPrefetchEntry("MyModel", cacheKey)
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
            ? getPrefetchEntryFresh("MyModel", cacheKey, PREFETCH_MAX_AGE_MS)
            : getPrefetchEntry("MyModel", cacheKey)
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

          updateTutorialReflection(qInstanceId, (prev) => ({
            ...prev,
            views: nextViews,
            is_new: false,
          }));
          return;
        }

        const { accessToken } = await getAuthContext();
        if (!accessToken) {
          Alert.alert("ログインが必要です", "ログイン後にご利用ください。");
          return;
        }

        const json = await getNexusReflectionDetailQna(qInstanceId, {
          markViewed: true,
        });

        if (resetSeq !== resetSeqRef.current) return;

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
          Promise.resolve(refreshHomeReflectionsUnread()).catch(() => null);
        }
      } catch (e) {
        Alert.alert("読み込みに失敗しました", buildErrorMessage(e));
      } finally {
        setDetailLoading(false);
        setDetailLoadingId(null);
      }
    },
    [
      activeViewedUserId,
      detailLoading,
      isTutorialMode,
      refreshHomeReflectionsUnread,
      updateTutorialReflection,
    ]
  );

  // ---------------------------------------------------------
  // 履歴一覧から直接開かれた場合は、対象Reflectionを自動で表示する
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
  // Echoes / Discoveries (UI -> MashOS API)
  // ---------------------------------------------------------

  const openEchoesModal = useCallback((prefill = null) => {
    const st = prefill && typeof prefill === "object" ? prefill.strength : null;
    const memo = prefill && typeof prefill === "object" ? prefill.memo : "";

    setEchoesStrength(st || null);
    setEchoesMemo(memo ? String(memo) : "");
    setEchoesMemoActive(false);
    setEchoesMemoContentHeight(44);
    setEchoesSubmitError("");
    setEchoesModalVisible(true);
  }, []);

  const closeEchoesModal = useCallback(() => {
    setEchoesModalVisible(false);
    setEchoesStrength(null);
    setEchoesMemo("");
    setEchoesMemoActive(false);
    setEchoesMemoContentHeight(44);
    setEchoesSubmitError("");
  }, []);

  const handleResonancePress = useCallback(async () => {
    if (!selected?.q_instance_id) return;

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
                setEchoesDeleting(true);
                setEchoesSubmitError("");
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
                        tutorial_my_echo: null,
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
                          tutorial_my_echo: null,
                        };
                      })
                    );

                    updateTutorialReflection(qidNow, (prev) => ({
                      ...prev,
                      resonances: nextResonances,
                      is_resonated: false,
                      resonated: false,
                      tutorial_my_echo: null,
                    }));
                    return;
                  }

                  const { accessToken } = await getAuthContext();
                  if (!accessToken) {
                    Alert.alert("ログインが必要です", "ログイン後にご利用ください。");
                    return;
                  }

                  const res = await apiFetch(QNA_ECHOES_DELETE_ENDPOINT, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                      q_instance_id: qidNow,
                      q_key: String(selected.q_key || ""),
                    }),
                  });

                  const json = await res.json().catch(() => ({}));
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
                  setEchoesSubmitError(buildErrorMessage(e));
                  Alert.alert("解除に失敗しました", buildErrorMessage(e));
                } finally {
                  setEchoesDeleting(false);
                }
              })();
            },
          },
        ]
      );
      return;
    }

    const resetSeq = resetSeqRef.current;
    setEchoesSubmitting(true);
    setEchoesSubmitError("");

    try {
      if (isTutorialMode) {
        const nextResonances = (Number(selected?.resonances ?? 0) || 0) + 1;
        const nextEcho = {
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
            tutorial_my_echo: nextEcho,
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
              tutorial_my_echo: nextEcho,
            };
          })
        );

        updateTutorialReflection(qidNow, (prev) => ({
          ...prev,
          resonances: nextResonances,
          is_resonated: true,
          resonated: true,
          tutorial_my_echo: nextEcho,
        }));
        return;
      }

      const { accessToken } = await getAuthContext();
      if (!accessToken) {
        Alert.alert("ログインが必要です", "ログイン後にご利用ください。");
        return;
      }

      const res = await apiFetch(QNA_ECHOES_SUBMIT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          q_instance_id: qidNow,
          q_key: String(selected.q_key || ""),
          strength: "medium",
          memo: null,
        }),
      });

      const json = await res.json().catch(() => ({}));
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
      setEchoesSubmitError(buildErrorMessage(e));
      Alert.alert("共鳴に失敗しました", buildErrorMessage(e));
    } finally {
      setEchoesSubmitting(false);
    }
  }, [isTutorialMode, selected, updateTutorialReflection]);

  const submitEchoes = useCallback(async () => {
    if (!selected?.q_instance_id) return;

    const already = !!(selected?.is_resonated ?? selected?.resonated);
    if (already) {
      Alert.alert("送信済みです", "共鳴はすでに送信されています。必要なら一度解除してから送信してください。");
      return;
    }

    if (!echoesStrength) {
      Alert.alert("強度を選択してください", "響き（小/中/大）を選んでから送信してください。");
      return;
    }

    const resetSeq = resetSeqRef.current;
    const qidNow = String(selected.q_instance_id);

    setEchoesSubmitting(true);
    setEchoesSubmitError("");

    try {
      if (isTutorialMode) {
        const nextResonances = (Number(selected?.resonances ?? 0) || 0) + 1;
        const nextEcho = {
          strength: String(echoesStrength),
          memo: echoesMemo ? String(echoesMemo) : "",
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
            tutorial_my_echo: nextEcho,
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
              tutorial_my_echo: nextEcho,
            };
          })
        );

        updateTutorialReflection(qidNow, (prev) => ({
          ...prev,
          resonances: nextResonances,
          is_resonated: true,
          resonated: true,
          tutorial_my_echo: nextEcho,
        }));
        closeEchoesModal();
        Alert.alert("チュートリアルに記録しました", "この共鳴はチュートリアル用の記録です。");
        return;
      }

      const { userId, accessToken } = await getAuthContext();
      if (!accessToken) {
        Alert.alert("ログインが必要です", "ログイン後にご利用ください。");
        return;
      }

      const res = await apiFetch(QNA_ECHOES_SUBMIT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          q_instance_id: String(selected.q_instance_id),
          q_key: String(selected.q_key || ""),
          strength: String(echoesStrength),
          memo: echoesMemo ? String(echoesMemo) : null,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = json?.detail || json?.message || `HTTP ${res.status}`;
        throw new Error(String(msg));
      }

      // Echoes送信が成功した時点で「共鳴確定」される（サーバ側で+1）
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

      closeEchoesModal();
      Alert.alert("送信しました", "響きを記録しました。");
    } catch (e) {
      setEchoesSubmitError(buildErrorMessage(e));
    } finally {
      setEchoesSubmitting(false);
    }
  }, [
    isTutorialMode,
    selected,
    echoesStrength,
    echoesMemo,
    closeEchoesModal,
    updateTutorialReflection,
  ]);

  const confirmDeleteEchoes = useCallback(() => {
    if (!selected?.q_instance_id) return;

    const beforeResonated = !!(selected?.is_resonated ?? selected?.resonated);
    if (!beforeResonated) {
      Alert.alert("解除できません", "まだ共鳴していません。");
      return;
    }

    if (isTutorialMode) {
      Alert.alert(
        "共鳴を解除しますか？",
        "Echoes/共鳴は削除されます。この操作は元に戻せません。",
        [
          { text: "キャンセル", style: "cancel" },
          {
            text: "削除する",
            style: "destructive",
            onPress: () => {
              (async () => {
                setEchoesDeleting(true);
                setEchoesSubmitError("");
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
                      tutorial_my_echo: null,
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
                        tutorial_my_echo: null,
                      };
                    })
                  );

                  updateTutorialReflection(qidNow, (prev) => ({
                    ...prev,
                    resonances: nextResonances,
                    is_resonated: false,
                    resonated: false,
                    tutorial_my_echo: null,
                  }));

                  closeEchoesModal();
                  Alert.alert("解除しました", "チュートリアル共鳴を解除しました。");
                } catch (e) {
                  setEchoesSubmitError(buildErrorMessage(e));
                } finally {
                  setEchoesDeleting(false);
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
      "Echoes/共鳴は削除されます。この操作は元に戻せません。",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除する",
          style: "destructive",
          onPress: () => {
            (async () => {
              setEchoesDeleting(true);
              setEchoesSubmitError("");
              try {
                const { accessToken } = await getAuthContext();
                if (!accessToken) {
                  Alert.alert("ログインが必要です", "ログイン後にご利用ください。");
                  return;
                }

                const qidNow = String(selected.q_instance_id);

                const res = await apiFetch(QNA_ECHOES_DELETE_ENDPOINT, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify({
                    q_instance_id: qidNow,
                    q_key: String(selected.q_key || ""),
                  }),
                });

                const json = await res.json().catch(() => ({}));
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

                closeEchoesModal();
                Alert.alert("解除しました", "共鳴を解除しました。");
              } catch (e) {
                setEchoesSubmitError(buildErrorMessage(e));
              } finally {
                setEchoesDeleting(false);
              }
            })();
          },
        },
      ]
    );
  }, [isTutorialMode, selected, closeEchoesModal, updateTutorialReflection]);

  const isDark = themeName === "dark";

  const isSelfTarget =
    !activeViewedUserId ||
    (viewerUserId && String(activeViewedUserId) === String(viewerUserId));

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
          <CocolonBackButton fallbackRouteName="MyModel" />
          <Text style={styles.panelTitle}>Piece</Text>
          <View style={styles.panelHeaderRightPlaceholder} />
        </View>

        <View style={styles.qnaIntroCard}>
          <Text style={styles.qnaIntroTitle}>Piece</Text>
          <Text style={styles.qnaIntroText}>
            見たいユーザーを選び、Pieceを表示してください。
          </Text>
          {isTutorialMode ? (
            <Text style={styles.tierHintText}>
              まずは自分のPieceを確認し、その後にUserへ切り替えると「他ユーザーのPieceも閲覧できる」流れが分かります。
            </Text>
          ) : null}

          {/* Main action */}
          <View style={styles.actions}>
            <View style={styles.targetRow}>
              <Text style={styles.targetLabel}>対象：</Text>
              <View ref={myModelSelectorRef} collapsable={false}>
                <CocolonPressable
                  onPress={openUserPicker}
                  style={styles.targetNamePressable}
                >
                  <Text style={styles.targetName} numberOfLines={1}>
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
                  color="#FFFFFF"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.goldButtonText}>Pieceを表示</Text>
              </View>
            </CocolonButton>
          </View>

          {/* Selected detail */}
          {selected || detailLoading ? (
            <View style={styles.responseGroup}>
              {selected?.title && !detailLoading ? (
                <>
                  <View ref={qaBlockRef} collapsable={false}>
                    <Text style={[styles.responseLabel, { fontWeight: "700" }]}>【問い】</Text>
                    <View style={styles.responseCard}>
                      <Text style={[styles.detailTitle, { marginBottom: 0 }]}>{selected.title}</Text>
                    </View>

                    <Text
                      style={[
                        styles.responseLabel,
                        { fontWeight: "700", marginTop: 12 },
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
                          isResonatedNow && { opacity: 0.92 },
                          (echoesSubmitting || echoesDeleting) && { opacity: 0.7 },
                        ]}
                        disabled={echoesSubmitting || echoesDeleting}
                      >
                        <View style={styles.btnRow}>
                          <Ionicons
                            name={isResonatedNow ? "heart" : "heart-outline"}
                            size={14}
                            color="#FFFFFF"
                            style={{ marginRight: 6 }}
                          />
                          <Text style={styles.resonanceBtnText}>
                            {isResonatedNow ? "共鳴済み" : "共鳴"}
                          </Text>
                        </View>
                      </CocolonPressable>
                    </View>
                  ) : null}
                </>
              ) : (
                <>
                  <Text style={[styles.responseLabel, { fontWeight: "700" }]}>【応答】</Text>
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
      >
        <View ref={tutorialPickUserOverlayRootRef} style={styles.modalOverlay} collapsable={false}>
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
                  disabled={
                    isTutorialMode &&
                    tutorialStep === STEP_REFLECTIONS_SWITCH_AND_REACT &&
                    !activeViewedUserId
                  }
                  style={[
                    styles.listRow,
                    isSelfTarget && styles.listRowActive,
                    isTutorialMode &&
                      tutorialStep === STEP_REFLECTIONS_SWITCH_AND_REACT &&
                      !activeViewedUserId &&
                      { opacity: 0.5 },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <View style={styles.rowTitleLine}>
                      <Text style={styles.rowTitle} numberOfLines={1}>
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
                          tutorialStep === STEP_REFLECTIONS_SWITCH_AND_REACT &&
                          !activeViewedUserId &&
                          idx === 0
                            ? tutorialPickUserRowRef
                            : undefined
                        }
                        collapsable={false}
                        onPress={() => selectTargetUser(u.user_id)}
                        style={[
                          styles.listRow,
                          isActive && styles.listRowActive,
                        ]}
                      >
                        <View style={{ flex: 1 }}>
                          <View style={styles.rowTitleLine}>
                            <Text style={styles.rowTitle} numberOfLines={1}>
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
              tutorialStep === STEP_REFLECTIONS_SWITCH_AND_REACT &&
              !!userPickerVisible &&
              !activeViewedUserId &&
              !!tutorialPickUserRect
            }
            targetRect={tutorialPickUserRect}
            title="Userを選択"
            message="Userを選択して、Pieceを見てみましょう。"
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
        </View>
      </Modal>

      {/* Picker modal */}
      <Modal
        visible={pickerVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
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

            <View style={styles.sortRow}>
              {[
                { key: "newest", label: "新着" },
                { key: "resonances", label: "人気(共鳴)" },
              ].map((x) => {
                const active = sortMode === x.key;
                return (
                  <Pressable
                    key={x.key}
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
              <ScrollView style={styles.listArea}>
                {(qnaItems || []).map((it) => (
                  <Pressable
                    key={it.q_instance_id}
                    onPress={() => fetchDetail(it)}
                    style={styles.listRow}
                    disabled={detailLoading}
                  >
                    <View style={{ flex: 1 }}>
                      <View style={styles.rowTitleLine}>
                        <Text style={styles.rowTitle} numberOfLines={2}>
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
              </ScrollView>
            ) : (
              <View style={styles.modalEmpty}>
                <Text style={styles.modalEmptyText}>
                  {isTutorialMode
                    ? "まだチュートリアルPieceがありません。\n先にPiece画面で回答を作成してください。"
                    : 'まだ表示できるPieceがありません。\n入力内容が蓄積されるとここに表示されます。'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Echoes submit modal */}
      <Modal
        visible={echoesModalVisible}
        animationType="fade"
        transparent
        onRequestClose={closeEchoesModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Echoes</Text>
              <Pressable onPress={closeEchoesModal} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={18} color={colors.TEXT_ON_LIGHT} />
              </Pressable>
            </View>

            <ScrollView
              ref={echoesModalScrollRef}
              style={styles.listArea}
              contentContainerStyle={{ paddingBottom: 24 + keyboardInset }}
              keyboardShouldPersistTaps="handled"
            >
              {echoesDeleting ? (
                <View style={styles.inlineLoadingRow}>
                  <ActivityIndicator color={colors.TEXT_SUBTLE} />
                  <Text style={styles.inlineLoadingText}>共鳴を解除中…</Text>
                </View>
              ) : null}
              <Text style={styles.modalDescText}>このPieceのどこに、どんなふうに響きましたか？</Text>

              <View style={{ marginTop: 6 }}>
                {(ECHO_STRENGTH_OPTIONS || []).map((opt) => {
                  const active = echoesStrength === opt.key;
                  return (
                    <Pressable
                      key={opt.key}
                      onPress={() => setEchoesStrength(opt.key)}
                      style={[
                        styles.choiceCard,
                        active && styles.choiceCardActive,
                      ]}
                      disabled={echoesSubmitting || echoesDeleting || isResonatedNow}
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

                {echoesMemoActive ? (
                  <View style={[styles.memoCard, styles.memoCardExpanded]}>
                    <TextInput
                      ref={echoesMemoInputRef}
                      style={[
                        styles.memoInput,
                        {
                          flex: 0,
                          width: "100%",
                          height: Math.min(
                            Math.max(echoesMemoContentHeight || 44, 44),
                            inputMaxHeight
                          ),
                        },
                      ]}
                      placeholder="どこに響いたか、なぜそう感じたかを書いてください。"
                      {...(isIOS ? { defaultValue: echoesMemo } : { value: echoesMemo })}
                      onChangeText={setEchoesMemo}
                      {...(isIOS
                        ? {
                            onChange: (e) =>
                              setEchoesMemo(e?.nativeEvent?.text ?? ""),
                          }
                        : {})}
                      multiline
                      scrollEnabled
                      textAlignVertical="top"
                      placeholderTextColor={colors.TEXT_ON_LIGHT}
                      editable={!isResonatedNow && !echoesSubmitting && !echoesDeleting}
                      showSoftInputOnFocus={!isResonatedNow && !echoesSubmitting && !echoesDeleting}
                      onFocus={(e) => {
                        modalLastScrollRef.current = echoesModalScrollRef.current;
                        modalLastFocusTargetRef.current =
                          e?.target ?? e?.nativeEvent?.target ?? null;
                        requestAnimationFrame(() => scrollToFocusedInput());
                      }}
                      onBlur={() => {
                        modalLastScrollRef.current = null;
                        modalLastFocusTargetRef.current = null;
                        setEchoesMemoActive(false);
                      }}
                      onContentSizeChange={(e) => {
                        const h = e?.nativeEvent?.contentSize?.height ?? 0;
                        if (h) setEchoesMemoContentHeight(h);
                        requestAnimationFrame(() => scrollToFocusedInput());
                      }}
                    />
                  </View>
                ) : (
                  <CocolonPressable
                    style={[styles.memoCard, styles.memoCardCollapsed]}
                    onPress={() => {
                      setEchoesMemoActive(true);
                      setTimeout(() => {
                        try {
                          echoesMemoInputRef.current?.focus?.();
                        } catch {
                          // noop
                        }
                      }, 50);
                    }}
                    accessibilityLabel="Echoesで感じたことを入力する"
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
                            !(echoesMemo && echoesMemo.trim().length > 0) &&
                              styles.collapsedTextPlaceholder,
                          ]}
                          numberOfLines={1}
                        >
                          {echoesMemo && echoesMemo.trim().length > 0
                            ? echoesMemo.replace(/\s+/g, " ").trim()
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

              {echoesSubmitError ? (
                <Text style={styles.modeErrorText}>{echoesSubmitError}</Text>
              ) : null}

              <CocolonButton
                variant="primary"
                style={[
                  { marginTop: 14 },
                  (!echoesStrength || echoesSubmitting || echoesDeleting || isResonatedNow) && {
                    opacity: 0.7,
                  },
                ]}
                onPress={submitEchoes}
                disabled={!echoesStrength || echoesSubmitting || echoesDeleting || isResonatedNow}
              >
                <View style={styles.btnRow}>
                  {echoesSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" style={{ marginRight: 8 }} />
                  ) : (
                    <Ionicons
                      name={isResonatedNow ? "checkmark" : "save-outline"}
                      size={16}
                      color="#FFFFFF"
                      style={{ marginRight: 6 }}
                    />
                  )}
                  <Text style={styles.goldButtonText}>
                    {isResonatedNow ? "保存済み" : "保存"}
                  </Text>
                </View>
              </CocolonButton>

              <CocolonButton
                variant="secondary"
                style={[
                  styles.historyBtn,
                  { marginTop: 10 },
                  (!isResonatedNow || echoesSubmitting || echoesDeleting) && { opacity: 0.7 },
                ]}
                onPress={confirmDeleteEchoes}
                disabled={!isResonatedNow || echoesSubmitting || echoesDeleting}
              >
                <View style={styles.btnRow}>
                  {echoesDeleting ? (
                    <ActivityIndicator color="#B91C1C" style={{ marginRight: 8 }} />
                  ) : (
                    <Ionicons
                      name="trash-outline"
                      size={16}
                      color="#B91C1C"
                      style={{ marginRight: 6 }}
                    />
                  )}
                  <Text style={[styles.historyBtnText, { color: "#B91C1C" }]}>
                    共鳴を解除
                  </Text>
                </View>
              </CocolonButton>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <TutorialOverlay
        visible={
          !!isTutorialMode &&
          (tutorialStep === STEP_REFLECTIONS_SELF_VIEW ||
            tutorialStep === STEP_REFLECTIONS_SWITCH_AND_REACT) &&
          !!tutorialTargetRect
        }
        targetRect={tutorialTargetRect}
        title={
          tutorialStep === STEP_REFLECTIONS_SELF_VIEW
            ? "自分のPiece"
            : !activeViewedUserId
            ? "Userへ切り替え"
            : "他ユーザーのPiece"
        }
        message={
          tutorialStep === STEP_REFLECTIONS_SELF_VIEW
            ? "フォロワーにはこのように表示されます。自分の作成したPieceを確認できます。"
            : !activeViewedUserId
            ? "『対象：自分』を押して、Userを選んでください。"
            : tutorialOtherReflectionPhase === "view"
            ? "このように他ユーザーのPieceが表示されます。"
            : "このようにフォローしたユーザーのPieceを閲覧できます。\n\n共感したら『共鳴』でリアクションできます。共鳴済みを押すと解除できます。"
        }
        step={tutorialStep}
        totalSteps={TUTORIAL_TOTAL_STEPS}
        mode={
          tutorialStep === STEP_REFLECTIONS_SWITCH_AND_REACT && !activeViewedUserId
            ? "action"
            : "info"
        }
        showPrimaryButton={
          tutorialStep === STEP_REFLECTIONS_SELF_VIEW ||
          (tutorialStep === STEP_REFLECTIONS_SWITCH_AND_REACT && !!activeViewedUserId)
        }
        nextLabel={
          tutorialStep === STEP_REFLECTIONS_SWITCH_AND_REACT && !!activeViewedUserId
            ? tutorialOtherReflectionPhase === "view"
              ? "次へ"
              : "Friendsへ"
            : "次へ"
        }
        cardPlacement={
          tutorialStep === STEP_REFLECTIONS_SWITCH_AND_REACT && !!activeViewedUserId
            ? "top"
            : "bottom"
        }
        onNext={() => {
          if (!isTutorialMode) return;
          if (tutorialStep === STEP_REFLECTIONS_SELF_VIEW) {
            setTutorialStep(STEP_REFLECTIONS_SWITCH_AND_REACT);
            return;
          }

          if (tutorialStep === STEP_REFLECTIONS_SWITCH_AND_REACT && activeViewedUserId) {
            if (tutorialOtherReflectionPhase === "view") {
              setTutorialOtherReflectionPhase("react");
              return;
            }

            setTutorialStep(STEP_FRIENDS_START);

            try {
              if (navigation?.navigate) {
                navigation.navigate("Friends");
                return;
              }
            } catch {
              // noop
            }

            try {
              const parent =
                typeof navigation?.getParent === "function" ? navigation.getParent() : null;
              if (parent && typeof parent.navigate === "function") {
                parent.navigate("Friends");
              }
            } catch {
              // noop
            }
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
      fontSize: 20,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      letterSpacing: 0.8,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    panelHeaderRightPlaceholder: {
      width: 30,
    },

    // Intro
    qnaIntroCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 12,
    },
    qnaIntroTitle: {
      fontSize: 13,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 4,
    },
    qnaIntroText: {
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
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
    recoHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
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
    recoPillContent: { paddingRight: 6 },
    recoPill: {
      marginRight: 8,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      maxWidth: 220,
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

// Buttons
    actions: { marginTop: 6, marginBottom: 10 },
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
    goldButton: {
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOpacity: 0.14,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    goldButtonText: {
      fontSize: 13,
      fontWeight: "900",
      color: "#FFFFFF",
      letterSpacing: 0.6,
    },
    btnRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    tierHintText: {
      marginTop: 8,
      fontSize: font.description ?? 9,
      color: text.description ?? COLORS.TEXT_ON_LIGHT,
      textAlign: "center",
    },

    // Response
    responseGroup: { marginTop: 12 },
    responseLabel: {
      fontSize: font.sectionLabel ?? 12,
      color: text.sectionLabel ?? text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginBottom: 6,
    },
    responseCard: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 12,
      paddingVertical: 12,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    detailTitle: {
      fontSize: 13,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 10,
    },
    responseText: {
      fontSize: 13,
      lineHeight: 20,
      color: COLORS.TEXT_ON_LIGHT,
    },
    responseEmpty: {
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
      opacity: 0.85,
    },

    metricsRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 14,
    },
    metricPill: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      marginRight: 8,
      backgroundColor: COLORS.PANEL_BG,
    },
    metricText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      minWidth: 34,
      textAlign: "right",
      fontVariant: ["tabular-nums"],
    },
    resonanceBtn: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
      minWidth: 86,
    },
    resonanceBtnText: {
      fontSize: 12,
      fontWeight: "900",
      color: "#FFFFFF",
    },

    metricsActions: {
      marginTop: 10,
      alignSelf: "flex-end",
      flexDirection: "row",
      alignItems: "center",
    },
    historyBtn: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      alignItems: "center",
      justifyContent: "center",
    },
    historyBtnText: {
      fontSize: 12,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
    },

    // Echoes/Discoveries modal UI
    modalDescText: {
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
      opacity: 0.9,
    },
    inlineLoadingRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    inlineLoadingText: {
      marginLeft: 10,
      fontSize: 12,
      color: COLORS.TEXT_ON_LIGHT,
      opacity: 0.85,
    },
    choiceCard: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginBottom: 8,
    },
    choiceCardActive: {
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.PANEL_BG,
    },
    choiceTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    choiceTitle: {
      flex: 1,
      fontSize: 13,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
      paddingRight: 10,
    },
    choiceTitleActive: {
      color: COLORS.TITLE_GOLD,
    },
    choiceSub: {
      fontSize: 11,
      fontWeight: "900",
      color: COLORS.TEXT_SUBTLE,
    },
    choiceSubActive: {
      color: COLORS.TITLE_GOLD,
    },

    inputLabel: {
      fontSize: font.sectionLabel ?? 12,
      fontWeight: "900",
      color: text.sectionLabel ?? text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginBottom: 6,
    },
    /** メモ入力カード（InputScreenと同仕様：展開式） */
    memoCard: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 12,
      paddingVertical: 10,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    memoCardCollapsed: {
      minHeight: 54,
      justifyContent: "center",
    },
    memoCardExpanded: {
      minHeight: 120,
    },
    collapsedRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    collapsedLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      paddingRight: 8,
    },
    collapsedText: {
      flex: 1,
      fontSize: 14,
      color: COLORS.TEXT_ON_LIGHT,
    },
    collapsedTextPlaceholder: {
      color: COLORS.TEXT_SUBTLE,
    },
    memoInput: {
      flex: 1,
      minHeight: 90,
      fontSize: 14,
      color: COLORS.TEXT_ON_LIGHT,
      textAlignVertical: "top",
    },

    // Error text (re-using old naming)
    modeErrorText: {
      marginTop: 10,
      fontSize: 11,
      lineHeight: 16,
      color: "#B91C1C",
    },

    // Upgrade CTA

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

    sortRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    sortPill: {
      flex: 1,
      marginHorizontal: 4,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      alignItems: "center",
      justifyContent: "center",
    },
    sortPillActive: {
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
    },
    sortPillText: {
      fontSize: 11,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
    },
    sortPillTextActive: {
      color: "#FFFFFF",
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

    listArea: { paddingBottom: 4 },
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
    newBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      backgroundColor: "#EF4444",
      alignSelf: "flex-start",
    },
    newBadgeText: {
      fontSize: 10,
      fontWeight: "900",
      color: "#FFFFFF",
    },
    rowMetaLine: {
      marginTop: 8,
      flexDirection: "row",
      alignItems: "center",
    },
    rowMetaItem: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 12,
    },
    rowMetaText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
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
  }, ui));
}
