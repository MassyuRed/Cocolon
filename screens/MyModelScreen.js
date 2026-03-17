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
import UnreadBadge from "../components/UnreadBadge";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TutorialOverlay, {
  syncTutorialSpotlightTarget,
  waitForTutorialFrames,
} from "../components/TutorialOverlay";
import { makeUiTokens } from "../ui/uiTokens";
import { apiFetch } from "../lib/apiClient";

/**
 * MyModelScreen (Home)
 * -------------------
 * - MyModel の「Home」画面として、軽い導線のみを提供します
 *   - フォロー切替（MyModel対象ユーザー切替）
 *   - 履歴導線（Echoes/Discoveries一覧へ）
 *   - おすすめ導線（現状はモーダルのまま）
 *   - 「Reflectionsを開く」ボタン（→ MyModelReflectionsScreen へ）
 */

const PANEL_MIN_HEIGHT = 690;

// ---- API base ----
// Prefer Expo env var if present (avoid hard-coding across dev/prod)
const API_BASE = String(
  (typeof process !== "undefined" && process?.env?.EXPO_PUBLIC_MYMODEL_API_URL) ||
    "https://mashos-api.onrender.com"
).replace(/\/+$/, "");

// Recommend users endpoint (MashOS)
const MYMODEL_RECOMMEND_USERS_ENDPOINT = `${API_BASE}/mymodel/recommend/users`;

// Recommend questions endpoint (MashOS)
const QNA_TRENDING_ENDPOINT = `${API_BASE}/mymodel/qna/trending`;
const QNA_HOLDERS_ENDPOINT = `${API_BASE}/mymodel/qna/holders`;
const GLOBAL_SUMMARY_ENDPOINT = `${API_BASE}/global_summary`;

const TUTORIAL_REFLECTION_QUESTION = "理想の休日の過ごし方は？";
const MYMODEL_TUTORIAL_STEP_START = 14;
const MYMODEL_TUTORIAL_STEP_END = 17;
const TUTORIAL_TOTAL_STEPS = 23;

const TUTORIAL_MOCK_REFLECTIONS = Object.freeze([
  {
    id: "tutorial-reflection-mock-1",
    q_instance_id: "tutorial-q-mock-1",
    q_key: "tutorial-holiday",
    title: TUTORIAL_REFLECTION_QUESTION,
    body:
      "朝は少しゆっくり起きて、好きな音楽を流しながらコーヒーを飲みます。午後は本屋か静かなカフェで過ごして、夜は早めに眠れる休日が理想です。",
    owner_user_id: "tutorial-follow-1",
    display_name: "華恋",
    friend_code: "HANAKO123",
    is_tutorial: true,
    tutorial_kind: "mock",
    created_at: "2026-01-01T09:00:00.000Z",
    resonances: 4,
    discoveries: 2,
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

function resolveReflectionsRouteName(navigation) {
  const candidates = ["MyModelReflections", "MyModelReflectionsScreen"];

  const root = navigation?.getRootState?.();
  const local = navigation?.getState?.();

  for (const name of candidates) {
    if (hasRouteNameInState(root, name) || hasRouteNameInState(local, name)) {
      return name;
    }
  }
  return "MyModelReflections";
}

export default function MyModelScreen({ route } = {}) {
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
  const { myModelRangeLabel } = useSubscription();
  const {
    isTutorialMode,
    tutorialStep,
    tutorialReflections,
    setTutorialReflections,
    setTutorialStep,
  } = useTutorial();

  const { height: windowHeight } = useWindowDimensions();
  const safeInsets = useSafeAreaInsets();
  const screenRootRef = useRef(null);
  const tutorialScrollRef = useRef(null);
  const tutorialScrollYRef = useRef(0);
  const myModelTitleRef = useRef(null);
  const reflectionsButtonRef = useRef(null);
  const createButtonRef = useRef(null);
  const [tutorialTargetRect, setTutorialTargetRect] = useState(null);
  const [tutorialOverlayMetrics, setTutorialOverlayMetrics] = useState(null);
  const modalOverlayRootRef = useRef(null);
  const tutorialCreateScrollRef = useRef(null);
  const tutorialCreateScrollYRef = useRef(0);
  const tutorialCreateQuestionInputWrapRef = useRef(null);
  const tutorialCreateInputWrapRef = useRef(null);
  const tutorialCreateInputRef = useRef(null);
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

  // Home では対象ユーザー切替を持たず、Reflections 画面側で切り替えます（重複排除）
  const targetUserId = initialViewedUserId ? String(initialViewedUserId) : null;

  const unreadMyModelCreate = !!getFeatureUnread("MyModel", "mymodelCreate");

  // Recommend (users)
  const [recoModalVisible, setRecoModalVisible] = useState(false);
  const [recoUsersLoading, setRecoUsersLoading] = useState(false);
  const [recoUsersError, setRecoUsersError] = useState("");
  const [recoUsers, setRecoUsers] = useState([]);


  // --- Recommend (Trending -> Holders) ---
  // NOTE: Phase 2 - state only (effects/UI will be wired in later phases)
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [trendingError, setTrendingError] = useState("");
  const [trendingItems, setTrendingItems] = useState([]);
  const [activeTrending, setActiveTrending] = useState(null);
  const [trendingMode, setTrendingMode] = useState("overall"); // overall | resonance | views

  const [holdersLoading, setHoldersLoading] = useState(false);
  const [holdersError, setHoldersError] = useState("");
  const [holderUsers, setHolderUsers] = useState([]);

  const [recoMode, setRecoMode] = useState("question"); // question | user

  const [globalReflectionCount, setGlobalReflectionCount] = useState(null);
  const [globalEchoCount, setGlobalEchoCount] = useState(null);
  const [globalDiscoveryCount, setGlobalDiscoveryCount] = useState(null);
  const appStateRef = useRef(AppState.currentState);

  const [tutorialCreateVisible, setTutorialCreateVisible] = useState(false);
  const [tutorialCreateAnswer, setTutorialCreateAnswer] = useState("");
  const [tutorialCreateSubmitting, setTutorialCreateSubmitting] = useState(false);
  const [tutorialCreateError, setTutorialCreateError] = useState("");


  const fetchGlobalSummary = useCallback(async () => {
    try {
      const res = await apiFetch(GLOBAL_SUMMARY_ENDPOINT, { method: "GET" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(String(json?.detail || json?.message || `HTTP ${res.status}`));
      }

      const reflectionRaw =
        json?.reflection_count ?? json?.reflection_views ?? json?.reflection_view_count;
      const echoRaw = json?.echo_count;
      const discoveryRaw = json?.discovery_count;

      const nextReflectionCount = Number(reflectionRaw);
      const nextEchoCount = Number(echoRaw);
      const nextDiscoveryCount = Number(discoveryRaw);

      if (Number.isFinite(nextReflectionCount)) {
        setGlobalReflectionCount(nextReflectionCount);
      }
      if (Number.isFinite(nextEchoCount)) {
        setGlobalEchoCount(nextEchoCount);
      }
      if (Number.isFinite(nextDiscoveryCount)) {
        setGlobalDiscoveryCount(nextDiscoveryCount);
      }
    } catch {
      // keep previous values
    }
  }, []);


  const isDark = themeName === "dark";
  const tutorialSelfReflection = useMemo(
    () =>
      (Array.isArray(tutorialReflections) ? tutorialReflections : []).find(
        (item) => String(item?.tutorial_kind || "") === "self"
      ) || null,
    [tutorialReflections]
  );
  const tutorialHasSelfReflection = !!tutorialSelfReflection;

  const isMyModelTutorialStep =
    !!isTutorialMode &&
    tutorialStep >= MYMODEL_TUTORIAL_STEP_START &&
    tutorialStep <= MYMODEL_TUTORIAL_STEP_END;
  const isMyModelTutorialVisible =
    isMyModelTutorialStep && !tutorialCreateVisible;
  const tutorialCreateAnswerFilled =
    String(tutorialCreateAnswer || "").trim().length > 0;

  const handleTutorialScroll = useCallback((e) => {
    tutorialScrollYRef.current =
      e?.nativeEvent?.contentOffset?.y ?? tutorialScrollYRef.current;
  }, []);

  const getTutorialTargetRef = useCallback(() => {
    if (!isMyModelTutorialVisible) return null;

    switch (tutorialStep) {
      case 14:
        return myModelTitleRef;
      case 15:
      case 16:
        return createButtonRef;
      case 17:
        return reflectionsButtonRef;
      default:
        return null;
    }
  }, [isMyModelTutorialVisible, tutorialStep]);

  const tutorialOverlayConfig = useMemo(() => {
    if (!isMyModelTutorialVisible) return null;

    switch (tutorialStep) {
      case 14:
        return {
          step: 14,
          mode: "info",
          title: "MyModel",
          message: "ここでは\nReflectionを作り、閲覧できます",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(15),
        };
      case 15:
        return {
          step: 15,
          mode: "info",
          title: "MyModel Create",
          message: "まずはここで\nReflectionを作成します",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(16),
        };
      case 16:
        return {
          step: 16,
          mode: "action",
          title: "作成してみましょう",
          message: "MyModel Createを開いて\nReflectionを作ってみましょう",
          actionHint: "MyModel Create を押してください",
        };
      case 17:
        return {
          step: 17,
          mode: "action",
          title: "Reflectionsで確認できます",
          message: "作成したReflectionは\nReflectionsで確認できます\n\n開いてみましょう",
          actionHint: "Reflections を押してください",
        };
      default:
        return null;
    }
  }, [isMyModelTutorialVisible, tutorialStep, setTutorialStep]);

  const tutorialModalOverlayConfig = useMemo(() => {
    if (!isTutorialMode || !tutorialCreateVisible || tutorialStep !== 16) {
      return null;
    }

    if (!tutorialCreateAnswerFilled) {
      return {
        step: 16,
        mode: "action",
        title: "回答を書いてみましょう",
        message: "ここに回答を書いてみましょう",
        actionHint: "入力欄を押して回答してください",
        footerText: "この問い1つで、作成から閲覧までの流れを体験できます。",
      };
    }

    return {
      step: 16,
      mode: "action",
      title: "保存しましょう",
      message: "入力できたら保存しましょう",
      actionHint: "保存 を押してください",
      footerText: "チュートリアル用のReflectionとして、本番データに影響せず保存されます。",
    };
  }, [
    isTutorialMode,
    tutorialCreateVisible,
    tutorialStep,
    tutorialCreateAnswerFilled,
  ]);

  const syncTutorialTargetRect = useCallback(async () => {
    if (!isMyModelTutorialVisible) {
      return null;
    }

    const targetRef = getTutorialTargetRef();
    if (!targetRef || !screenRootRef.current) {
      return null;
    }

    return syncTutorialSpotlightTarget({
      enabled: isMyModelTutorialVisible,
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
    isMyModelTutorialVisible,
    safeInsets,
    tutorialOverlayConfig?.cardPlacement,
    tutorialOverlayMetrics,
    windowHeight,
  ]);

  useEffect(() => {
    if (!isTutorialMode || !tutorialHasSelfReflection) return;
    if (tutorialStep < MYMODEL_TUTORIAL_STEP_START || tutorialStep >= 17) return;
    setTutorialStep(17);
  }, [isTutorialMode, tutorialHasSelfReflection, tutorialStep, setTutorialStep]);

  useLayoutEffect(() => {
    if (!isMyModelTutorialVisible) {
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
    isMyModelTutorialVisible,
    tutorialStep,
    tutorialCreateVisible,
    tutorialHasSelfReflection,
    tutorialCreateAnswer,
    tutorialOverlayMetrics,
    syncTutorialTargetRect,
  ]);

  const syncTutorialModalTargetRect = useCallback(async () => {
    if (!tutorialModalOverlayConfig || !modalOverlayRootRef.current) {
      return null;
    }

    const targetRef = tutorialCreateAnswerFilled
      ? tutorialCreateSaveButtonRef
      : tutorialCreateQuestionInputWrapRef;

    return syncTutorialSpotlightTarget({
      enabled: true,
      targetRef,
      rootRef: modalOverlayRootRef,
      scrollRef: tutorialCreateScrollRef,
      currentScrollYRef: tutorialCreateScrollYRef,
      overlayMetrics: tutorialModalOverlayMetrics,
      windowHeight,
      safeInsets,
      cardPlacement: tutorialModalOverlayConfig?.cardPlacement || "bottom",
      measureOptions: {
        maxAttempts: 3,
        settleFrames: 1,
      },
    });
  }, [
    tutorialModalOverlayConfig,
    tutorialCreateAnswerFilled,
    tutorialModalOverlayMetrics,
    windowHeight,
    safeInsets,
  ]);

  // ---------------------------------------------------------
  // Tab reselect (when already on MyModel tab)
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

  // 画面遷移で MyModelScreen が裏に回ったとき、
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
      setGlobalReflectionCount(null);
      setGlobalEchoCount(null);
      setGlobalDiscoveryCount(null);
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

  // Recommend: trending questions (global) -> holders (users who answered the question)
  useEffect(() => {
    if (isTutorialMode) {
      setTrendingItems([]);
      setActiveTrending(null);
      setTrendingError("");
      setTrendingLoading(false);
      return;
    }

    // まずキャッシュ（アプリ起動時プリロード）を即反映して、体感を速くする
    try {
      const entry = getPrefetchEntryFresh
        ? getPrefetchEntryFresh("MyModel", `trending:${trendingMode}`, PREFETCH_MAX_AGE_MS)
        : getPrefetchEntry("MyModel", `trending:${trendingMode}`);
      const cached = entry?.value;
      const items = Array.isArray(cached?.items) ? cached.items : null;
      if (items) {
        setTrendingItems(items);
        setActiveTrending(items[0] || null);
        setTrendingError("");
        setTrendingLoading(false);
      }
    } catch {
      // noop
    }

    // 次に最新を取りに行く（キャッシュがある場合は silent で更新）
    const hasCache = (() => {
      try {
        const entry = getPrefetchEntryFresh
          ? getPrefetchEntryFresh("MyModel", `trending:${trendingMode}`, PREFETCH_MAX_AGE_MS)
          : getPrefetchEntry("MyModel", `trending:${trendingMode}`);
        return Array.isArray(entry?.value?.items);
      } catch {
        return false;
      }
    })();

    loadTrending({ silent: hasCache, mode: trendingMode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTutorialMode]);

  useEffect(() => {
    if (isTutorialMode) return;
    if (recoMode !== "question") return;

    const qid =
      activeTrending?.question_id ??
      activeTrending?.questionId ??
      activeTrending?.questionID ??
      null;
    if (qid != null) {
      loadHolders(qid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTrending, recoMode, isTutorialMode]);

  useEffect(() => {
    if (isTutorialMode) {
      setRecoUsers([]);
      setRecoUsersError("");
      setRecoUsersLoading(false);
      return;
    }

    if (recoMode === "user") {
      // まずキャッシュ（アプリ起動時プリロード）を即反映
      try {
        const entry = getPrefetchEntryFresh
          ? getPrefetchEntryFresh("MyModel", "recoUsers", PREFETCH_MAX_AGE_MS)
          : getPrefetchEntry("MyModel", "recoUsers");
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
            ? getPrefetchEntryFresh("MyModel", "recoUsers", PREFETCH_MAX_AGE_MS)
            : getPrefetchEntry("MyModel", "recoUsers");
          return Array.isArray(entry?.value?.items);
        } catch {
          return false;
        }
      })();

      loadRecommendUsers({ silent: hasCache });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recoMode, isTutorialMode]);

  async function getAuthContext() {
    let userId = null;
    let accessToken = null;
    try {
      userId = await getCurrentUserId();
    } catch (e) {
      console.warn("MyModelScreen(Home): failed to resolve userId", e);
    }
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      accessToken = sessionData?.session?.access_token ?? null;
    } catch (e) {
      console.warn("MyModelScreen(Home): failed to resolve auth session", e);
    }
    return { userId, accessToken };
  }

  useEffect(() => {
    if (!isTutorialMode || !tutorialHasSelfReflection) return;
    setTutorialStep((prev) => (prev < 17 ? 17 : prev));
  }, [isTutorialMode, tutorialHasSelfReflection, setTutorialStep]);


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
    tutorialCreateAnswer,
    tutorialCreateAnswerFilled,
    tutorialCreateSubmitting,
    tutorialModalOverlayMetrics,
    syncTutorialModalTargetRect,
  ]);

  const openTutorialCreate = useCallback(() => {
    tutorialCreateScrollYRef.current = 0;
    setTutorialCreateAnswer(String(tutorialSelfReflection?.body || ""));
    setTutorialCreateError("");
    setTutorialCreateVisible(true);
  }, [tutorialSelfReflection]);

  const closeTutorialCreate = useCallback(() => {
    if (tutorialCreateSubmitting) return;
    setTutorialCreateVisible(false);
    setTutorialCreateError("");
  }, [tutorialCreateSubmitting]);

  const navigateToReflections = useCallback(() => {
    if (!navigation?.navigate) return;

    const routeName = resolveReflectionsRouteName(navigation);
    const params =
      targetUserId != null
        ? { viewedUserId: String(targetUserId), targetUserId: String(targetUserId) }
        : {};

    try {
      navigation.navigate(routeName, params);
    } catch {
      Alert.alert(
        "Reflections画面を開けません",
        "Reflections画面が navigation に未登録の可能性があります。\nApp.js に MyModelReflectionsScreen を登録してください。"
      );
    }
  }, [navigation, targetUserId]);

  const saveTutorialReflection = useCallback(() => {
    const answer = String(tutorialCreateAnswer || "").trim();
    if (!answer) {
      setTutorialCreateError("回答を入力してください。");
      return;
    }

    setTutorialCreateSubmitting(true);
    try {
      const createdAt = new Date().toISOString();
      const selfReflection = {
        id: "tutorial-reflection-self",
        q_instance_id: "tutorial-q-self",
        q_key: "tutorial-holiday",
        title: TUTORIAL_REFLECTION_QUESTION,
        body: answer,
        owner_user_id: "tutorial-self",
        display_name: "自分",
        friend_code: "YOU",
        is_tutorial: true,
        tutorial_kind: "self",
        created_at: createdAt,
        resonances: 0,
        discoveries: 0,
        views: 0,
        is_new: true,
      };

      setTutorialReflections((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        const others = safePrev.filter(
          (item) => String(item?.tutorial_kind || "") !== "self"
        );
        const hasMock = others.some(
          (item) => String(item?.tutorial_kind || "") === "mock"
        );
        const mockItems = hasMock
          ? others
          : TUTORIAL_MOCK_REFLECTIONS.map((item) => ({ ...item }));

        return [selfReflection, ...mockItems];
      });
      setTutorialStep((prev) => (prev < 17 ? 17 : prev));
      setTutorialCreateVisible(false);
      setTutorialCreateError("");
    } finally {
      setTutorialCreateSubmitting(false);
    }
  }, [
    tutorialCreateAnswer,
    setTutorialReflections,
    setTutorialStep,
    navigateToReflections,
  ]);

  const showTutorialRecommendInfo = useCallback(() => {
    Alert.alert(
      "おすすめ（チュートリアル）",
      "本番ではここから新しいユーザーや問いを探せます。\n\nチュートリアルでは、Reflections画面で模擬ユーザーのReflectionを閲覧できます。"
    );
  }, []);

  const showTutorialHistoryInfo = useCallback(() => {
    Alert.alert(
      "履歴（チュートリアル）",
      "本番では、共鳴や発見を行うと Echoes / Discoveries の履歴が蓄積されます。\n\nチュートリアルでは、まずReflectionの作成と閲覧の流れを確認してください。"
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
      const url = `${MYMODEL_RECOMMEND_USERS_ENDPOINT}?${params.toString()}`;

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
        setPrefetch("MyModel", "recoUsers", { userId: userId || null, items: users });
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

  const loadTrending = useCallback(async (opts) => {
    const silent = !!opts?.silent;
    if (!silent) {
      setTrendingLoading(true);
    }
    setTrendingError("");
    const mode = String(opts?.mode || "overall").trim() || "overall";
    try {
      const { userId, accessToken } = await getAuthContext();
      if (!accessToken) {
        setTrendingItems([]);
        setActiveTrending(null);
        setTrendingError("ログインが必要です");
        return;
      }

      const params = new URLSearchParams();
      params.append("limit", "20");
      params.append("mode", mode);
      const url = `${QNA_TRENDING_ENDPOINT}?${params.toString()}`;

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

      const list = Array.isArray(json?.items) ? json.items : [];
      setTrendingItems(list);

      setActiveTrending((prev) => {
        const prevId =
          prev?.question_id ?? prev?.questionId ?? prev?.questionID ?? null;
        if (prevId) {
          const exists = list.some(
            (x) =>
              String(x?.question_id ?? x?.questionId ?? x?.questionID) ===
              String(prevId)
          );
          if (exists) return prev;
        }
        return list.length > 0 ? list[0] : null;
      });

      if (list.length === 0) {
        setHolderUsers([]);
        setHoldersError("");
      }

      // cache
      try {
        setPrefetch("MyModel", `trending:${mode}`, { userId: userId || null, items: list });
      } catch {
        // noop
      }
    } catch (e) {
      setTrendingItems([]);
      setActiveTrending(null);
      setHolderUsers([]);
      setTrendingError(String(e?.message || e));
    } finally {
      setTrendingLoading(false);
    }
  }, []);

  const loadHolders = useCallback(async (questionId) => {
    const qid = questionId != null ? String(questionId) : "";
    if (!qid) return;

    setHoldersLoading(true);
    setHoldersError("");

    try {
      const { userId, accessToken } = await getAuthContext();
      if (!accessToken) {
        setHolderUsers([]);
        setHoldersError("ログインが必要です");
        return;
      }

      const params = new URLSearchParams();
      params.append("question_id", String(qid));
      params.append("limit", "20");
      // default: exclude_followed=true / exclude_self=true (API側デフォルト)
      const url = `${QNA_HOLDERS_ENDPOINT}?${params.toString()}`;

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

      setHolderUsers(users);

      // cache
      try {
        setPrefetch(`MyModel`, `holders:${qid}`, {
          userId: userId || null,
          questionId: qid,
          items: users,
        });
      } catch {
        // noop
      }
    } catch (e) {
      setHolderUsers([]);
      setHoldersError(String(e?.message || e));
    } finally {
      setHoldersLoading(false);
    }
  }, []);


  const openMyModelCreate = useCallback(() => {
    if (isTutorialMode) {
      openTutorialCreate();
      return;
    }

    if (!navigation?.navigate) return;

    try {
      navigation.navigate("MyModelCreate");
    } catch {
      Alert.alert(
        "MyModel Createを開けません",
        "MyModel Create画面が navigation に未登録の可能性があります。\nApp.js に MyModelCreateScreen を登録してください。"
      );
    }
  }, [navigation, isTutorialMode, openTutorialCreate]);

  const openReflections = useCallback(() => {
    if (isTutorialMode && !tutorialHasSelfReflection) {
      Alert.alert(
        "先にReflectionを作成しましょう",
        `チュートリアルでは、まず「${TUTORIAL_REFLECTION_QUESTION}」に答えると、作成から閲覧までの流れが分かります。`,
        [
          { text: "閉じる", style: "cancel" },
          { text: "作成する", onPress: openTutorialCreate },
        ]
      );
      return;
    }

    if (isTutorialMode) {
      setTutorialStep((prev) => (prev < 18 ? 18 : prev));
    }

    navigateToReflections();
  }, [
    isTutorialMode,
    tutorialHasSelfReflection,
    openTutorialCreate,
    navigateToReflections,
    setTutorialStep,
  ]);

  const handlePressGuide = useCallback(() => {
    // 1) normal navigate
    try {
      if (navigation && typeof navigation.navigate === "function") {
        navigation.navigate("CocolonGuide", { screenId: "mymodel" });
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
        parent.navigate("CocolonGuide", { screenId: "mymodel" });
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

      <View
        style={[
          styles.safeContent,
          { paddingTop: safeInsets.top, paddingBottom: safeInsets.bottom },
        ]}
      >
      <ScrollView
        ref={tutorialScrollRef}
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        onScroll={handleTutorialScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.panelHeader}>
          <View ref={myModelTitleRef} collapsable={false} style={styles.panelTitleRow}>
            <Text style={styles.panelTitle}>MyModel</Text>
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

        {isTutorialMode ? (
          <View style={styles.recoCard}>
            <Text style={styles.recoTitle}>チュートリアル</Text>
            <Text style={styles.recoSummaryText}>
              この画面では、1つの問いに答えてReflectionが作られ、Reflectionsで閲覧できる流れを体験します。
            </Text>
            <Text style={styles.recoSummaryText}>
              {tutorialHasSelfReflection
                ? "作成済みのReflectionがあります。次はReflectionsで、自分の回答や模擬ユーザーのReflectionを見てみましょう。"
                : `まずは「${TUTORIAL_REFLECTION_QUESTION}」に答えてみましょう。`}
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
                  typeof globalReflectionCount === "number" ? globalReflectionCount : "—"
                } 回のReflection閲覧がありました`}
              </Text>
              <Text style={styles.globalSummaryText}>
                {`今日、全体で ${
                  typeof globalEchoCount === "number" ? globalEchoCount : "—"
                } 回の共鳴がありました`}
              </Text>
              <Text style={styles.globalSummaryText}>
                {`今日、全体で ${
                  typeof globalDiscoveryCount === "number" ? globalDiscoveryCount : "—"
                } 回の発見がありました`}
              </Text>
            </View>
          </View>
        )}

        {/* Home / Target + Reflections entry */}
        <View style={styles.qnaIntroCard}>
          <Text style={styles.qnaIntroTitle}>Reflections</Text>
          <Text style={styles.qnaIntroText}>
            {isTutorialMode
              ? "作成したReflectionや、模擬ユーザーのReflectionを閲覧して流れを確認できます。"
              : "フォローしたユーザーのMyModelを使用できます。"}
          </Text>

          <View style={styles.actions}>
            <View ref={reflectionsButtonRef} collapsable={false}>
              <CocolonButton variant="primary" onPress={openReflections}>
                <View style={styles.btnRow}>
                  <Ionicons
                    name="open-outline"
                    size={18}
                    color="#FFFFFF"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.goldButtonText}>Reflectionsを開く</Text>
                </View>
              </CocolonButton>
            </View>
          </View>
        </View>

        <View style={styles.recoCard}>
          <View style={styles.createTitleRow}>
            <Text style={styles.recoTitle}>MyModel Create</Text>
            <UnreadBadge
              visible={unreadMyModelCreate}
              style={styles.createUnreadBadge}
            />
          </View>
          <Text style={styles.recoSummaryText}>
            {isTutorialMode
              ? `チュートリアルでは「${TUTORIAL_REFLECTION_QUESTION}」に答えて、Reflectionが作られる流れを体験します。`
              : "Reflectionsで使うためのReflectionを作成します。"}
          </Text>

          <View ref={createButtonRef} collapsable={false}>
            <CocolonButton
              variant="primary"
              style={{ marginTop: 10 }}
              onPress={openMyModelCreate}
            >
              <View style={styles.btnRow}>
                <Ionicons
                  name="create-outline"
                  size={18}
                  color="#FFFFFF"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.goldButtonText}>
                  {isTutorialMode
                    ? tutorialHasSelfReflection
                      ? "チュートリアルReflectionを更新"
                      : "チュートリアルReflectionを作成"
                    : "Reflectionを作成"}
                </Text>
              </View>
            </CocolonButton>
          </View>
        </View>

        {/* Recommend */}
        <View style={styles.recoCard}>
          <Text style={styles.recoTitle}>おすすめ</Text>
          <Text style={styles.recoSummaryText}>
            {isTutorialMode
              ? "本番ではここから新しいユーザーを探せます。チュートリアルではReflections画面に模擬ユーザーを用意しています。"
              : "新しいユーザーを探すことができます。"}
          </Text>

          <CocolonButton
            variant="secondary"
            style={{ marginTop: 10 }}
            onPress={() => {
              if (isTutorialMode) {
                showTutorialRecommendInfo();
                return;
              }

              const alreadyUser = recoMode === "user";
              setRecoMode("user");
              setRecoModalVisible(true);
              if (alreadyUser) {
                loadRecommendUsers();
              }
            }}
          >
            <View style={styles.btnRow}>
              <Ionicons
                name="search-outline"
                size={18}
                color={colors.TEXT_ON_LIGHT}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.neutralButtonText}>新しいユーザーを探す</Text>
            </View>
            </CocolonButton>
          </View>

        {/* History */}
        <View style={styles.historyCard}>
          <Text style={styles.historyCardTitle}>履歴</Text>
          <View style={{ marginTop: 8 }}>
            <CocolonButton
              variant="secondary"
              onPress={() => {
                if (isTutorialMode) {
                  showTutorialHistoryInfo();
                  return;
                }
                navigation.navigate("EchoesHistoryList");
              }}
              style={styles.historyEntry}
            >
              <View style={[styles.btnRow, { width: "100%" }]}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={colors.TEXT_ON_LIGHT}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.historyEntryText}>Echoes</Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.TEXT_SUBTLE}
                  style={{ marginLeft: "auto" }}
                />
              </View>
            </CocolonButton>

            <CocolonButton
              variant="secondary"
              onPress={() => {
                if (isTutorialMode) {
                  showTutorialHistoryInfo();
                  return;
                }
                navigation.navigate("DiscoveriesHistoryList");
              }}
              style={[styles.historyEntry, { marginTop: 8 }]}
            >
              <View style={[styles.btnRow, { width: "100%" }]}>
                <Ionicons
                  name="document-text-outline"
                  size={16}
                  color={colors.TEXT_ON_LIGHT}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.historyEntryText}>Discoveries</Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.TEXT_SUBTLE}
                  style={{ marginLeft: "auto" }}
                />
              </View>
            </CocolonButton>
          </View>
        </View>
      </ScrollView>
      </View>

      {tutorialOverlayConfig ? (
        <TutorialOverlay
          visible={isMyModelTutorialVisible}
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
            tutorialStep === 16
              ? openTutorialCreate
              : tutorialStep === 17
                ? openReflections
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
              <Text style={styles.modalTitle}>チュートリアル Reflection</Text>
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
              keyboardShouldPersistTaps="handled"
              scrollEventThrottle={16}
              onScroll={(e) => {
                tutorialCreateScrollYRef.current =
                  e?.nativeEvent?.contentOffset?.y ?? tutorialCreateScrollYRef.current;
              }}
            >
              <View ref={tutorialCreateQuestionInputWrapRef} collapsable={false}>
                <View style={styles.tutorialQuestionCard}>
                  <Text style={styles.tutorialQuestionLabel}>問い</Text>
                  <Text style={styles.recoSummaryText}>{TUTORIAL_REFLECTION_QUESTION}</Text>
                </View>

                <Text style={[styles.recoSectionLabel, { marginTop: 10 }]}>あなたの回答</Text>
                <View ref={tutorialCreateInputWrapRef} collapsable={false}>
                  <TextInput
                  ref={tutorialCreateInputRef}
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
                {isTutorialMode && tutorialStep === 16
                  ? "この問いに答えて保存すると、チュートリアル用のReflectionが作成されます。本番データには保存されません。"
                  : "チュートリアルでは、この1つの回答だけでReflectionの作成から閲覧までの流れを体験します。本番データには保存されません。"}
              </Text>

              {tutorialCreateError ? (
                <Text style={styles.modeErrorText}>{tutorialCreateError}</Text>
              ) : null}

              <View ref={tutorialCreateSaveButtonRef} collapsable={false}>
                <CocolonButton
                variant="primary"
                style={{ marginTop: 12 }}
                onPress={saveTutorialReflection}
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
              onTargetPress={
                tutorialCreateAnswerFilled
                  ? saveTutorialReflection
                  : () => tutorialCreateInputRef.current?.focus?.()
              }
              onMetricsChange={setTutorialModalOverlayMetrics}
            />
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
                    if (recoMode === "user") {
                      loadRecommendUsers();
                    } else {
                      loadTrending({ mode: trendingMode });
                    }
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
              <View style={styles.recoToggleRow}>
                <Pressable
                  onPress={() => setRecoMode("user")}
                  style={[
                    styles.recoTogglePill,
                    recoMode === "user" && styles.recoTogglePillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.recoToggleText,
                      recoMode === "user" && styles.recoToggleTextActive,
                    ]}
                  >
                    ユーザーで探す
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setRecoMode("question")}
                  style={[
                    styles.recoTogglePill,
                    { marginRight: 0 },
                    recoMode === "question" && styles.recoTogglePillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.recoToggleText,
                      recoMode === "question" && styles.recoToggleTextActive,
                    ]}
                  >
                    問いで探す
                  </Text>
                </Pressable>
              </View>

              {recoMode === "user" ? (
                <>
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
                        const handle = String(u?.friend_code || "").trim();
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
                </>
              ) : (
                <>
                  <Text style={styles.recoSectionLabel}>トレンドの問い</Text>

                  <View style={[styles.recoToggleRow, { marginTop: 8, marginBottom: 6 }]}>
                    <Pressable
                      onPress={() => {
                        const next = "overall";
                        setTrendingMode(next);
                        loadTrending({ mode: next });
                      }}
                      style={[
                        styles.recoTogglePill,
                        trendingMode === "overall" && styles.recoTogglePillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.recoToggleText,
                          trendingMode === "overall" && styles.recoToggleTextActive,
                        ]}
                      >
                        総合
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => {
                        const next = "resonance";
                        setTrendingMode(next);
                        loadTrending({ mode: next });
                      }}
                      style={[
                        styles.recoTogglePill,
                        trendingMode === "resonance" && styles.recoTogglePillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.recoToggleText,
                          trendingMode === "resonance" && styles.recoToggleTextActive,
                        ]}
                      >
                        共鳴
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => {
                        const next = "views";
                        setTrendingMode(next);
                        loadTrending({ mode: next });
                      }}
                      style={[
                        styles.recoTogglePill,
                        { marginRight: 0 },
                        trendingMode === "views" && styles.recoTogglePillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.recoToggleText,
                          trendingMode === "views" && styles.recoToggleTextActive,
                        ]}
                      >
                        閲覧
                      </Text>
                    </Pressable>
                  </View>


                  {trendingLoading ? (
                    <View style={styles.recoLoadingRow}>
                      <ActivityIndicator color={colors.TEXT_SUBTLE} />
                      <Text style={styles.recoLoadingText}>読み込み中…</Text>
                    </View>
                  ) : (trendingItems || []).length > 0 ? (
                    <View style={styles.recoPillScroll}>
                      {(trendingItems || []).map((t, idx) => {
                        const qid =
                          t?.question_id ?? t?.questionId ?? t?.questionID;
                        const active =
                          String(
                            activeTrending?.question_id ??
                              activeTrending?.questionId ??
                              activeTrending?.questionID ??
                              ""
                          ) === String(qid ?? "");
                        const isLast =
                          idx === (trendingItems || []).length - 1;

                        return (
                          <Pressable
                            key={String(t?.q_key || qid || Math.random())}
                            onPress={() => setActiveTrending(t)}
                            style={[
                              styles.recoPill,
                              active && styles.recoPillActive,
                              { marginBottom: isLast ? 0 : 8, maxWidth: "100%" },
                            ]}
                          >
                            <Text
                              style={[
                                styles.recoPillText,
                                active && styles.recoPillTextActive,
                              ]}
                              numberOfLines={1}
                            >
                              {String(t?.title || "").trim() || "（未設定）"}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : (
                    <Text style={styles.recoEmptyText}>
                      {trendingError
                        ? `取得に失敗: ${trendingError}`
                        : "現在トレンドがありません。"}
                    </Text>
                  )}

                  <Text style={[styles.recoSectionLabel, { marginTop: 10 }]}>
                    この問いを答えているユーザー
                  </Text>

                  {holdersLoading ? (
                    <View style={styles.recoLoadingRow}>
                      <ActivityIndicator color={colors.TEXT_SUBTLE} />
                      <Text style={styles.recoLoadingText}>読み込み中…</Text>
                    </View>
                  ) : (holderUsers || []).length > 0 ? (
                    <View style={{ marginTop: 8 }}>
                      {(holderUsers || []).map((u) => {
                        const uid = u?.id || u?.user_id || u?.userId;
                        const name =
                          String(u?.display_name || "").trim() || "（未設定）";
                        const handle = String(u?.friend_code || "").trim();
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
                      {holdersError
                        ? `取得に失敗: ${holdersError}`
                        : activeTrending
                        ? "候補ユーザーがいません。"
                        : "問いを選ぶと候補ユーザーが表示されます。"}
                    </Text>
                  )}
                </>
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
  return StyleSheet.create({
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
  });
}

