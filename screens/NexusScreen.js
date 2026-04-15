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
import TutorialOverlay, {
  syncTutorialSpotlightTarget,
  waitForTutorialFrames,
} from "../components/TutorialOverlay";
import { useTutorial } from "../TutorialContext";
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import {
  getNexusDiscoveriesReflections,
  getNexusEchoesReflections,
  getNexusEmotionLog,
  getNexusEmotionRanking,
  getNexusRecommendUsers,
  getNexusReflectionDetail,
  getNexusReflections,
  getNexusTrendingQuestions,
} from "../lib/nexusApi";
import NexusReflectionCard from "./nexus/NexusReflectionCard";

const TABS = [
  { key: "reflection", label: "Reflection" },
  { key: "emotion_log", label: "感情通知" },
  { key: "recommend", label: "おすすめ" },
  { key: "history", label: "履歴" },
];

const MYMODEL_TUTORIAL_STEP_START = 12;
const MYMODEL_TUTORIAL_STEP_END = 15;
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
        user?.display_name || user?.name || user?.friend_code || "ユーザー"
      ).trim() || "ユーザー",
    friendCode: String(user?.friend_code || "").trim() || null,
  }));
}

function normalizeTrendingQuestions(json) {
  const items = Array.isArray(json?.items)
    ? json.items
    : Array.isArray(json)
    ? json
    : [];
  return items.map((item, index) => ({
    qKey: String(item?.q_key || `q-${index}`),
    title: String(item?.title || "—").trim() || "—",
    views: Number(item?.views || 0) || 0,
    resonances: Number(item?.resonances || 0) || 0,
  }));
}

function normalizeSavedReflections(json) {
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

function normalizeTutorialReflectionItems(items) {
  const rows = Array.isArray(items) ? items : [];
  return rows.map((item, index) => ({
    q_instance_id:
      String(item?.q_instance_id || "").trim() ||
      `reflection:tutorial-${index}`,
    source_type: "emotion_generated",
    owner: {
      user_id:
        String(item?.owner_user_id || item?.owner?.user_id || "").trim() ||
        `tutorial-user-${index}`,
      display_name:
        String(
          item?.display_name || item?.owner?.display_name || "ユーザー"
        ).trim() || "ユーザー",
      friend_code:
        String(item?.friend_code || item?.owner?.friend_code || "").trim() ||
        null,
    },
    question: {
      q_key:
        String(item?.q_key || item?.question?.q_key || "").trim() ||
        `tutorial-q-${index}`,
      title:
        String(item?.title || item?.question?.title || "Reflection").trim() ||
        "Reflection",
    },
    body: String(item?.body || "").trim(),
    created_at: String(item?.created_at || "").trim() || null,
    metrics: {
      views: Number(item?.views || item?.metrics?.views || 0) || 0,
      resonances:
        Number(item?.resonances || item?.metrics?.resonances || 0) || 0,
      discoveries:
        Number(item?.discoveries || item?.metrics?.discoveries || 0) || 0,
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

export default function NexusScreen({ navigation }) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";
  const { height: windowHeight } = useWindowDimensions();
  const safeInsets = useSafeAreaInsets();
  const {
    isTutorialMode,
    tutorialStep,
    tutorialReflections,
    setTutorialStep,
    ensureTutorialReflectionsSeed,
  } = useTutorial();

  const screenRootRef = useRef(null);
  const scrollRef = useRef(null);
  const currentScrollYRef = useRef(0);
  const titleRef = useRef(null);
  const reflectionTabRef = useRef(null);
  const tutorialCardRef = useRef(null);
  const tutorialButtonRef = useRef(null);
  const [tutorialTargetRect, setTutorialTargetRect] = useState(null);
  const [tutorialOverlayMetrics, setTutorialOverlayMetrics] = useState(null);

  const [activeTab, setActiveTab] = useState("reflection");
  const [historyMode, setHistoryMode] = useState("echoes");

  const tutorialReflectionItems = useMemo(
    () => normalizeTutorialReflectionItems(tutorialReflections),
    [tutorialReflections]
  );
  const isNexusTutorialStep =
    !!isTutorialMode &&
    tutorialStep >= MYMODEL_TUTORIAL_STEP_START &&
    tutorialStep <= MYMODEL_TUTORIAL_STEP_END;

  const [rankingState, setRankingState] = useState({ loading: true, items: [] });
  const [reflectionState, setReflectionState] = useState({
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
    questions: [],
    error: "",
  });
  const [historyState, setHistoryState] = useState({
    loading: false,
    loadedModes: {},
    echoes: [],
    discoveries: [],
    error: "",
  });

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);

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

  const loadReflections = useCallback(async () => {
    if (isTutorialMode) {
      setReflectionState({
        loading: false,
        items: tutorialReflectionItems,
        error: "",
      });
      return;
    }

    setReflectionState((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const json = await getNexusReflections({
        sort: "latest",
        limit: 20,
        following_only: true,
      });
      const items = Array.isArray(json?.items) ? json.items : [];
      setReflectionState({ loading: false, items, error: "" });
    } catch (e) {
      console.warn("NexusScreen: loadReflections failed", e);
      setReflectionState({
        loading: false,
        items: [],
        error: String(e?.message || "Reflectionを読み込めませんでした。"),
      });
    }
  }, [isTutorialMode, tutorialReflectionItems]);

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
        questions: [],
        error: "",
      });
      return;
    }

    setRecommendState((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const [usersJson, questionsJson] = await Promise.all([
        getNexusRecommendUsers(8),
        getNexusTrendingQuestions(8),
      ]);
      setRecommendState({
        loading: false,
        loaded: true,
        users: normalizeRecommendUsers(usersJson),
        questions: normalizeTrendingQuestions(questionsJson),
        error: "",
      });
    } catch (e) {
      console.warn("NexusScreen: loadRecommend failed", e);
      setRecommendState({
        loading: false,
        loaded: true,
        users: [],
        questions: [],
        error: String(e?.message || "おすすめを読み込めませんでした。"),
      });
    }
  }, [isTutorialMode]);

  const loadHistory = useCallback(
    async (mode) => {
      const safeMode = mode === "discoveries" ? "discoveries" : "echoes";
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
        const json =
          safeMode === "discoveries"
            ? await getNexusDiscoveriesReflections(20)
            : await getNexusEchoesReflections(20);
        const normalized = normalizeSavedReflections(json);
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
    void loadReflections();
  }, [loadRanking, loadReflections]);

  useEffect(() => {
    if (!isTutorialMode) return;
    void ensureTutorialReflectionsSeed();
    if (activeTab !== "reflection") {
      setActiveTab("reflection");
    }
  }, [activeTab, ensureTutorialReflectionsSeed, isTutorialMode]);

  useEffect(() => {
    if (isTutorialMode) {
      setReflectionState({
        loading: false,
        items: tutorialReflectionItems,
        error: "",
      });
    }
  }, [isTutorialMode, tutorialReflectionItems]);

  useEffect(() => {
    if (activeTab === "emotion_log" && !emotionLogState.loaded && !emotionLogState.loading) {
      void loadEmotionLog();
    }
    if (activeTab === "recommend" && !recommendState.loaded && !recommendState.loading) {
      void loadRecommend();
    }
    if (
      activeTab === "history" &&
      !historyState.loadedModes?.[historyMode] &&
      !historyState.loading
    ) {
      void loadHistory(historyMode);
    }
  }, [
    activeTab,
    emotionLogState.loaded,
    emotionLogState.loading,
    historyMode,
    historyState.loadedModes,
    historyState.loading,
    loadEmotionLog,
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

  const handleOpenTutorialReflections = useCallback(() => {
    void ensureTutorialReflectionsSeed();
    setTutorialStep((prev) => (prev < 16 ? 16 : prev));

    const routeName = resolveReflectionsRouteName(navigation);
    try {
      navigation?.navigate?.(routeName, {
        tutorialOpenAt: Date.now(),
      });
    } catch {
      Alert.alert(
        "Reflections画面を開けません",
        "Reflections画面が navigation に未登録の可能性があります。"
      );
    }
  }, [ensureTutorialReflectionsSeed, navigation, setTutorialStep]);

  const handleOpenReflection = useCallback(
    async (item) => {
      if (isTutorialMode) {
        setDetailVisible(true);
        setDetailLoading(false);
        setDetailData({
          title:
            item?.question?.title || item?.title || item?.question_title || "Reflection",
          body: item?.body || "",
          views: Number(item?.metrics?.views || item?.views || 0) || 0,
          resonances:
            Number(item?.metrics?.resonances || item?.resonances || 0) || 0,
          discoveries:
            Number(item?.metrics?.discoveries || item?.discoveries || 0) || 0,
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
        const detail = await getNexusReflectionDetail(qInstanceId, {
          markViewed: true,
          includeMyDiscoveryLatest: true,
        });
        setDetailData(detail && typeof detail === "object" ? detail : null);
        setReflectionState((prev) => ({
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
                    discoveries:
                      Number(detail?.discoveries || row?.metrics?.discoveries || 0) ||
                      0,
                  },
                };
              })
            : prev.items,
        }));
      } catch (e) {
        console.warn("NexusScreen: load reflection detail failed", e);
        setDetailData({
          title: item?.question?.title || item?.title || "Reflection",
          body: item?.body || "",
          views: Number(item?.metrics?.views || 0) || 0,
          resonances: Number(item?.metrics?.resonances || 0) || 0,
          discoveries: Number(item?.metrics?.discoveries || 0) || 0,
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
        return reflectionTabRef;
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
          title: "Nexus",
          message:
            "ここでは、公開されたReflectionや感情の動き、発見の流れをまとめて見られます。",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(13),
        };
      case 13:
        return {
          step: 13,
          mode: "info",
          title: "Reflection",
          message:
            "公開されたReflectionはこの流れで確認します。まずは Reflection タブを見る場所だと覚えてください。",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(14),
        };
      case 14:
        return {
          step: 14,
          mode: "info",
          title: "チュートリアル導線",
          message:
            "チュートリアルでは、ここからサンプルReflection一覧に進みます。今の root は Nexus のままです。",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(15),
        };
      case 15:
        return {
          step: 15,
          mode: "action",
          title: "開いてみましょう",
          message:
            "Reflections 一覧を開いて、チュートリアル用のReflectionを確認してみましょう。",
          actionHint: "Reflections一覧を開く を押してください",
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
    tutorialReflectionItems.length,
    tutorialOverlayMetrics,
    syncTutorialTargetRect,
  ]);

  const renderReflectionTab = () => {
    if (isTutorialMode) {
      if (!tutorialReflectionItems.length) {
        return (
          <Text style={styles.emptyText}>
            チュートリアル用のReflectionを準備しています。
          </Text>
        );
      }
      return tutorialReflectionItems.map((item) => (
        <NexusReflectionCard
          key={String(item?.q_instance_id || Math.random())}
          item={item}
          onPress={() => handleOpenReflection(item)}
          onPressOwner={() => handleOpenOwner(item?.owner?.user_id)}
        />
      ));
    }

    if (reflectionState.loading) {
      return <ActivityIndicator style={styles.loader} color={colors.TITLE_GOLD} />;
    }
    if (reflectionState.error) {
      return <Text style={styles.errorText}>{reflectionState.error}</Text>;
    }
    if (!Array.isArray(reflectionState.items) || reflectionState.items.length <= 0) {
      return (
        <Text style={styles.emptyText}>
          フォロー中ユーザーのReflectionはまだありません。
        </Text>
      );
    }
    return reflectionState.items.map((item) => (
      <NexusReflectionCard
        key={String(item?.q_instance_id || Math.random())}
        item={item}
        onPress={() => handleOpenReflection(item)}
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
                {user.friendCode ? (
                  <Text style={styles.simpleCardMeta}>{user.friendCode}</Text>
                ) : null}
              </View>
            </CocolonPressable>
          ))
        )}

        <Text style={styles.subsectionTitle}>いま見られている問い</Text>
        {recommendState.questions.length <= 0 ? (
          <Text style={styles.emptyText}>表示できる問いはまだありません。</Text>
        ) : (
          recommendState.questions.map((question) => (
            <View key={question.qKey} style={styles.simpleCard}>
              <Text style={styles.simpleCardTitle}>{question.title}</Text>
              <Text style={styles.simpleCardMeta}>
                views {question.views} / echoes {question.resonances}
              </Text>
            </View>
          ))
        )}
      </View>
    );
  };

  const currentHistoryItems =
    historyMode === "discoveries" ? historyState.discoveries : historyState.echoes;

  const renderHistoryTab = () => {
    if (historyState.loading && !historyState.loadedModes?.[historyMode]) {
      return <ActivityIndicator style={styles.loader} color={colors.TITLE_GOLD} />;
    }
    if (historyState.error && !currentHistoryItems.length) {
      return <Text style={styles.errorText}>{historyState.error}</Text>;
    }
    return (
      <View>
        <View style={styles.historySwitchRow}>
          <CocolonPressable
            style={[
              styles.historySwitchChip,
              historyMode === "echoes" && styles.historySwitchChipActive,
            ]}
            onPress={() => {
              setHistoryMode("echoes");
              if (!historyState.loadedModes?.echoes) {
                void loadHistory("echoes");
              }
            }}
          >
            <Text
              style={[
                styles.historySwitchText,
                historyMode === "echoes" && styles.historySwitchTextActive,
              ]}
            >
              共鳴履歴
            </Text>
          </CocolonPressable>
          <CocolonPressable
            style={[
              styles.historySwitchChip,
              historyMode === "discoveries" && styles.historySwitchChipActive,
            ]}
            onPress={() => {
              setHistoryMode("discoveries");
              if (!historyState.loadedModes?.discoveries) {
                void loadHistory("discoveries");
              }
            }}
          >
            <Text
              style={[
                styles.historySwitchText,
                historyMode === "discoveries" && styles.historySwitchTextActive,
              ]}
            >
              発見履歴
            </Text>
          </CocolonPressable>
        </View>

        {!currentHistoryItems.length ? (
          <Text style={styles.emptyText}>保存された履歴はまだありません。</Text>
        ) : (
          currentHistoryItems.map((item) => (
            <CocolonPressable
              key={item.qInstanceId}
              style={styles.simpleCard}
              onPress={() => handleOpenReflection(item)}
            >
              <View style={styles.simpleCardHeader}>
                <Text style={styles.simpleCardTitle}>{item.title}</Text>
                <Text style={styles.simpleCardMeta}>
                  {formatDateLabel(item.savedAt)}
                </Text>
              </View>
              <Text style={styles.simpleCardBody}>{item.ownerDisplayName}</Text>
            </CocolonPressable>
          ))
        )}
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
      case "reflection":
      default:
        return renderReflectionTab();
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
            <Text style={styles.panelTitle}>Nexus</Text>
          </View>
          <CocolonPressable
            style={styles.refreshButton}
            onPress={() => {
              void loadRanking();
              if (activeTab === "reflection") void loadReflections();
              if (activeTab === "emotion_log") void loadEmotionLog();
              if (activeTab === "recommend") void loadRecommend();
              if (activeTab === "history") void loadHistory(historyMode);
            }}
            accessibilityLabel="Nexusを再読み込みする"
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
              今の MyModel の入口は Nexus です。チュートリアルでは、このまま
              Reflections 一覧へ進んで流れを確認します。
            </Text>
            <View ref={tutorialButtonRef} collapsable={false} style={styles.tutorialEntryButtonWrap}>
              <CocolonButton
                variant="primary"
                onPress={handleOpenTutorialReflections}
                accessibilityLabel="Reflections一覧を開く"
              >
                Reflections一覧を開く
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
                  <Text
                    style={[
                      styles.tabLabelText,
                      isActive && styles.tabLabelTextActive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </View>
              </CocolonPressable>
            );

            if (tab.key === "reflection") {
              return (
                <View
                  key={tab.key}
                  ref={reflectionTabRef}
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
                {String(detailData?.title || "Reflection").trim() || "Reflection"}
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
                    echoes {Number(detailData?.resonances || 0) || 0}
                  </Text>
                  <Text style={styles.detailMetricText}>
                    discoveries {Number(detailData?.discoveries || 0) || 0}
                  </Text>
                </View>

                {detailData?.my_discovery_latest?.category ? (
                  <View style={styles.detailDiscoveryCard}>
                    <Text style={styles.detailDiscoveryLabel}>
                      あなたの最新の発見
                    </Text>
                    <Text style={styles.detailDiscoveryText}>
                      {String(
                        detailData?.my_discovery_latest?.category || ""
                      ).trim()}
                    </Text>
                    {detailData?.my_discovery_latest?.memo ? (
                      <Text style={styles.detailDiscoveryMemo}>
                        {String(
                          detailData?.my_discovery_latest?.memo || ""
                        ).trim()}
                      </Text>
                    ) : null}
                  </View>
                ) : null}
              </ScrollView>
            )}

            <View style={styles.detailActionRow}>
              <CocolonButton
                variant="secondary"
                onPress={() => setDetailVisible(false)}
                accessibilityLabel="Reflection詳細を閉じる"
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
          onTargetPress={tutorialStep === 15 ? handleOpenTutorialReflections : undefined}
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
          paddingTop: 12,
          paddingBottom: 12,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderTopColor: COLORS.CARD_BORDER,
          borderBottomColor: COLORS.CARD_BORDER,
          marginBottom: 14,
        },
        todayOverallEmotionHeader: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 6,
        },
        todayOverallEmotionIcon: {
          marginRight: 6,
        },
        todayOverallEmotionTitle: {
          fontSize: 13,
          fontWeight: "800",
          color: COLORS.TEXT_ON_LIGHT,
        },
        todayOverallEmotionText: {
          fontSize: 13,
          lineHeight: 20,
          color: COLORS.TEXT_ON_LIGHT,
          fontWeight: "700",
        },
        todayOverallEmotionPlaceholder: {
          fontSize: 13,
          lineHeight: 20,
          color: COLORS.TEXT_SUBTLE,
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
        detailDiscoveryCard: {
          marginTop: 14,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: COLORS.CARD_BORDER,
          backgroundColor: COLORS.PANEL_BG,
          paddingHorizontal: 12,
          paddingVertical: 12,
        },
        detailDiscoveryLabel: {
          fontSize: 12,
          lineHeight: 18,
          fontWeight: "800",
          color: COLORS.TITLE_GOLD,
          marginBottom: 6,
        },
        detailDiscoveryText: {
          fontSize: 13,
          lineHeight: 20,
          fontWeight: "700",
          color: COLORS.TEXT_ON_LIGHT,
        },
        detailDiscoveryMemo: {
          marginTop: 6,
          fontSize: font.description ?? 12,
          lineHeight: 18,
          color: text.description ?? COLORS.TEXT_SUBTLE,
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
