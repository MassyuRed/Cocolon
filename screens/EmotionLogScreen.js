import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Share,
  useWindowDimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { supabase } from "../lib/supabase";
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { useUnread } from "../UnreadContext";
import { useTutorial } from "../TutorialContext";

import CocolonBackButton from "../components/CocolonBackButton";
import CocolonPressable from "../components/CocolonPressable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TutorialOverlay, {
  syncTutorialSpotlightTarget,
  waitForTutorialFrames,
} from "../components/TutorialOverlay";
import { apiFetch } from "../lib/apiClient";

// 🔧 ここを変えると感情ログ画面のパネル高さが変わる
const PANEL_MIN_HEIGHT = 695;

const TUTORIAL_TOTAL_STEPS = 21;
const STEP_EMOTION_LOG_OVERVIEW = 18;
const STEP_EMOTION_LOG_NOTIFICATION = 19;
const STEP_EMOTION_LOG_FEED = 20;
const STEP_EMOTION_LOG_COMPLETE = 21;
const DEFAULT_TUTORIAL_USER_NAME = "User";

// EmotionLog feed is served from the canonical frontend API boundary.
// Keep the screen on a relative route so env/base-url changes remain centralized
// in lib/apiClient.js instead of being hard-coded at the surface layer.
const EMOTION_LOG_FEED_ENDPOINT = "/emotion-log/feed";

// ===== 表示用定数 =====
const STRENGTH_LABEL = {
  weak: "弱",
  medium: "中",
  strong: "強",
};

function emotionTint(emotion, defaultTextColor) {
  switch (emotion) {
    case "喜び":
      return { bg: "rgba(16,185,129,0.12)", text: "#065F46" }; // green
    case "悲しみ":
      return { bg: "rgba(99,102,241,0.12)", text: "#3730A3" }; // indigo
    case "怒り":
      return { bg: "rgba(239,68,68,0.12)", text: "#7F1D1D" }; // red
    case "不安":
      return { bg: "rgba(56,189,248,0.12)", text: "#0369A1" }; // cyan-ish
    case "平穏":
      return { bg: "rgba(234,179,8,0.12)", text: "#A16207" }; // calm
    default:
      return { bg: "rgba(107,114,128,0.12)", text: defaultTextColor };
  }
}

function formatTimeLabel(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildErrorMessage(err) {
  if (!err) return "エラーが発生しました。";
  if (err.name === "AbortError")
    return "接続がタイムアウトしました（ネットワークを確認してください）。";
  const msg = String(err.message || err);
  if (/Network/i.test(msg)) return "サーバーへの接続に失敗しました。";
  return `エラー：${msg}`;
}

async function getAuthContext() {
  let userId = null;
  let accessToken = null;

  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error) {
      userId = data?.user?.id ?? null;
    }
  } catch (e) {
    console.warn("EmotionLogScreen: failed to resolve userId", e);
  }

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    accessToken = sessionData?.session?.access_token ?? null;
  } catch (e) {
    console.warn("EmotionLogScreen: failed to resolve auth session", e);
  }

  return { userId, accessToken };
}

async function getJsonWithAuth(url) {
  const { accessToken } = await getAuthContext();
  if (!accessToken) {
    throw new Error("ログイン情報の取得に失敗しました（tokenなし）");
  }

  const res = await apiFetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      if (j && j.detail) detail = j.detail;
    } catch {}
    const error = new Error(detail);
    error.httpStatus = res.status;
    throw error;
  }

  return await res.json();
}

export default function EmotionLogScreen(props) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);

  const {
    isTutorialMode,
    tutorialEmotions,
    tutorialEmotionLogFeed: tutorialEmotionLogFeedItems,
    tutorialPieces,
    tutorialStep,
    setTutorialStep,
    addTutorialEmotionLogFeedItem,
    endTutorial,
    hasTutorialEmotionLog,
  } = useTutorial();

  const { getPrefetchEntry, getPrefetchEntryFresh, setPrefetch, setUnread } = useUnread();

  const FEED_PREFETCH_MAX_AGE_MS = 2 * 60 * 1000; // 2 minutes

  const prefetchedFeedItems = useMemo(() => {
    try {
      const entry = getPrefetchEntryFresh
        ? getPrefetchEntryFresh("EmotionLog", "feed", FEED_PREFETCH_MAX_AGE_MS)
        : getPrefetchEntry("EmotionLog", "feed");
      const v = entry?.value;
      const items = Array.isArray(v?.items) ? v.items : null;
      return items;
    } catch {
      return null;
    }
  }, [getPrefetchEntry, getPrefetchEntryFresh]);
  const { navigation, onEmotionLogDisplayed } = props || {};
  const { height: windowHeight } = useWindowDimensions();
  const safeInsets = useSafeAreaInsets();
  const screenRootRef = useRef(null);
  const tutorialScrollRef = useRef(null);
  const tutorialScrollYRef = useRef(0);
  const panelTitleRowRef = useRef(null);
  const tutorialIntroRef = useRef(null);
  const tutorialNotificationRef = useRef(null);
  const tutorialFeedCardRef = useRef(null);
  const tutorialCompleteButtonWrapRef = useRef(null);
  const [tutorialTargetRect, setTutorialTargetRect] = useState(null);
  const [tutorialOverlayMetrics, setTutorialOverlayMetrics] = useState(null);
  const [tutorialNotificationShown, setTutorialNotificationShown] = useState(false);
  const tutorialNotificationFlowRef = useRef(false);
  const skipNextFocusFeedRefreshRef = useRef(true);

  const isEmotionLogTutorialVisible =
    !!isTutorialMode &&
    tutorialStep >= STEP_EMOTION_LOG_OVERVIEW &&
    tutorialStep <= STEP_EMOTION_LOG_COMPLETE;

  const tutorialMockUserName = useMemo(() => {
    const safe = Array.isArray(tutorialPieces) ? tutorialPieces : [];
    const mock = safe.find(
      (item) =>
        String(item?.tutorial_kind || "") === "mock" &&
        String(item?.display_name || item?.owner_name || "").trim()
    );
    const other = safe.find(
      (item) =>
        String(item?.tutorial_kind || "") !== "self" &&
        String(item?.display_name || item?.owner_name || "").trim()
    );
    return String(
      mock?.display_name ||
        mock?.owner_name ||
        other?.display_name ||
        other?.owner_name ||
        DEFAULT_TUTORIAL_USER_NAME
    ).trim();
  }, [tutorialPieces]);

  const tutorialDisplayFeed = useMemo(() => {
    const safeFeed = Array.isArray(tutorialEmotionLogFeedItems) ? tutorialEmotionLogFeedItems : [];
    return safeFeed.map((item, index) => ({
      ...item,
      id: item?.id || `tutorial-emotion-log-feed-${index}`,
      ownerName: tutorialMockUserName,
      owner_name: tutorialMockUserName,
    }));
  }, [tutorialEmotionLogFeedItems, tutorialMockUserName]);

  const tutorialNotificationText = useMemo(() => {
    const latest = tutorialDisplayFeed.length > 0 ? tutorialDisplayFeed[0] : null;
    const first = Array.isArray(latest?.items) && latest.items.length > 0 ? latest.items[0] : null;
    const emotion = String(first?.type || "感情");
    const strength = STRENGTH_LABEL[first?.strength] || "";
    const suffix = strength ? `（${strength}）` : "";
    return `${tutorialMockUserName}さんが感情を入力しました：${emotion}${suffix}`;
  }, [tutorialDisplayFeed, tutorialMockUserName]);

  const handlePressGuide = useCallback(() => {
    // Cocolonガイド（感情ログ）
    try {
      if (navigation?.navigate) {
        navigation.navigate("CocolonGuide", { screenId: "emotionlog" });
        return;
      }
    } catch {
      // noop
    }

    // Fallback: parent navigation（念のため）
    try {
      const parent =
        typeof navigation?.getParent === "function" ? navigation.getParent() : null;
      if (parent && typeof parent.navigate === "function") {
        parent.navigate("CocolonGuide", { screenId: "emotionlog" });
      }
    } catch {
      // noop
    }
  }, [navigation]);


  // ===== feed（既存） =====
  const [feed, setFeed] = useState(() =>
    Array.isArray(prefetchedFeedItems) ? prefetchedFeedItems : []
  ); // { id, ownerName, items[], timeLabel }
  const [loading, setLoading] = useState(() => !Array.isArray(prefetchedFeedItems));
  const [errorMsg, setErrorMsg] = useState("");

  const handleTutorialScroll = useCallback((e) => {
    tutorialScrollYRef.current =
      e?.nativeEvent?.contentOffset?.y ?? tutorialScrollYRef.current;
  }, []);

  const getTutorialTargetRef = useCallback(() => {
    if (!isEmotionLogTutorialVisible) return null;

    switch (tutorialStep) {
      case STEP_EMOTION_LOG_OVERVIEW:
        return tutorialIntroRef;
      case STEP_EMOTION_LOG_NOTIFICATION:
        return tutorialNotificationShown ? tutorialNotificationRef : tutorialIntroRef;
      case STEP_EMOTION_LOG_FEED:
        return tutorialFeedCardRef;
      case STEP_EMOTION_LOG_COMPLETE:
        return tutorialCompleteButtonWrapRef;
      default:
        return null;
    }
  }, [isEmotionLogTutorialVisible, tutorialNotificationShown, tutorialStep]);

  const syncTutorialTargetRect = useCallback(async () => {
    if (!isEmotionLogTutorialVisible) {
      return null;
    }

    const targetRef = getTutorialTargetRef();
    if (!targetRef || !screenRootRef.current) {
      return null;
    }

    return syncTutorialSpotlightTarget({
      enabled: isEmotionLogTutorialVisible,
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
    isEmotionLogTutorialVisible,
    safeInsets,
    tutorialOverlayConfig?.cardPlacement,
    tutorialOverlayMetrics,
    windowHeight,
  ]);

  const tutorialOverlayConfig = useMemo(() => {
    if (!isEmotionLogTutorialVisible) return null;

    switch (tutorialStep) {
      case STEP_EMOTION_LOG_OVERVIEW:
        return {
          step: STEP_EMOTION_LOG_OVERVIEW,
          title: "感情ログ",
          message:
            `ここではフォロー中ユーザーの感情を観測できます。\nこのあと${tutorialMockUserName}さんから通知が届き、感情ログに反映されます。`,
          mode: "info",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(STEP_EMOTION_LOG_NOTIFICATION),
        };
      case STEP_EMOTION_LOG_NOTIFICATION:
        return {
          step: STEP_EMOTION_LOG_NOTIFICATION,
          title: "感情通知",
          message: tutorialNotificationShown
            ? `${tutorialMockUserName}さんが感情を入力しました。\nアプリの通知をオンにしていると、このように通知が届きます。`
            : `${tutorialMockUserName}さんからの通知を準備しています。\n通知が届くまでこのままお待ちください。`,
          mode: "info",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(STEP_EMOTION_LOG_FEED),
          primaryDisabled: !tutorialNotificationShown || !hasTutorialEmotionLog,
          footerText:
            tutorialNotificationShown && hasTutorialEmotionLog
              ? "通知を確認できたら次へ進みましょう。"
              : "通知を待っています…",
        };
      case STEP_EMOTION_LOG_FEED:
        return {
          step: STEP_EMOTION_LOG_FEED,
          title: "感情ログ",
          message:
            "感情通知では感情のみ表示されます。\nメモの内容は表示されません。",
          mode: "info",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(STEP_EMOTION_LOG_COMPLETE),
        };
      case STEP_EMOTION_LOG_COMPLETE:
        return {
          step: STEP_EMOTION_LOG_COMPLETE,
          title: "チュートリアル完了",
          message:
            "確認できたら、このボタンでチュートリアルを完了します。",
          mode: "action",
          actionHint: "スポットライトの場所を押してください",
          showPrimaryButton: false,
        };
      default:
        return null;
    }
  }, [
    hasTutorialEmotionLog,
    isEmotionLogTutorialVisible,
    tutorialMockUserName,
    tutorialNotificationShown,
    tutorialStep,
    setTutorialStep,
  ]);

  useLayoutEffect(() => {
    if (!isEmotionLogTutorialVisible) {
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
    isEmotionLogTutorialVisible,
    tutorialStep,
    tutorialNotificationShown,
    hasTutorialEmotionLog,
    tutorialOverlayMetrics,
    syncTutorialTargetRect,
  ]);

  // Tutorial: Pieceで見た模擬ユーザー名で通知を出し、感情ログへ反映する。
  useEffect(() => {
    if (!isTutorialMode) {
      tutorialNotificationFlowRef.current = false;
      setTutorialNotificationShown(false);
      return;
    }

    if (hasTutorialEmotionLog) {
      setTutorialNotificationShown(true);
    }

    if (tutorialStep < STEP_EMOTION_LOG_NOTIFICATION) return;
    if (tutorialNotificationFlowRef.current) return;

    tutorialNotificationFlowRef.current = true;

    const timer = setTimeout(() => {
      const iso = new Date().toISOString();
      const latest =
        Array.isArray(tutorialEmotions) && tutorialEmotions.length > 0
          ? tutorialEmotions[tutorialEmotions.length - 1]
          : null;
      const sourceItems = Array.isArray(latest?.emotions)
        ? latest.emotions
        : Array.isArray(latest?.items)
        ? latest.items
        : [];
      const items = sourceItems.length > 0
        ? sourceItems.slice(0, 3).map((item) => ({
            type: item?.type || "喜び",
            strength: item?.strength || "medium",
          }))
        : [{ type: "喜び", strength: "medium" }];

      if (!hasTutorialEmotionLog) {
        try {
          addTutorialEmotionLogFeedItem({
            id: `tutorial-emotion-log-feed-${Date.now()}`,
            ownerName: tutorialMockUserName,
            owner_name: tutorialMockUserName,
            items,
            emotions: items,
            created_at: iso,
            timeLabel: formatTimeLabel(iso),
            is_tutorial: true,
          });
        } catch {
          // noop
        }
      }

      try {
        setUnread?.("EmotionLog", "feed", true);
        setUnread?.("EmotionLog", "tutorialFeed", true);
      } catch {
        // noop
      }

      setTutorialNotificationShown(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [
    isTutorialMode,
    tutorialStep,
    tutorialEmotions,
    hasTutorialEmotionLog,
    tutorialMockUserName,
    addTutorialEmotionLogFeedItem,
    setUnread,
  ]);



  const loadFeed = useCallback(async (opts) => {
    if (isTutorialMode) {
      setErrorMsg("");
      setLoading(false);
      setFeed(Array.isArray(tutorialDisplayFeed) ? tutorialDisplayFeed : []);
      return;
    }

    const silent = !!opts?.silent;
    if (!silent) {
      setLoading(true);
    }
    setErrorMsg("");
    try {
      const json = await getJsonWithAuth(EMOTION_LOG_FEED_ENDPOINT);
      const rows = Array.isArray(json)
        ? json
        : Array.isArray(json?.items)
        ? json.items
        : Array.isArray(json?.data)
        ? json.data
        : [];

      const mapped = rows.map((row, index) => ({
        id: row?.id || `emotion-log-feed-${index}`,
        ownerName:
          String(row?.ownerName || row?.owner_name || row?.ownerNameLabel || "").trim() ||
          "ユーザー",
        items: Array.isArray(row?.items)
          ? row.items.map((it) => ({
              type: String(it?.type || it?.emotion || "").trim() || "感情",
              strength: String(it?.strength || "").trim() || undefined,
            }))
          : [],
        timeLabel:
          String(row?.timeLabel || "").trim() ||
          formatTimeLabel(row?.created_at || row?.createdAt || null),
        createdAt: row?.createdAt || row?.created_at || null,
      }));

      setFeed(mapped);

      const latestDisplayedCreatedAt = mapped.find((item) => item?.createdAt)?.createdAt || null;
      if (latestDisplayedCreatedAt && typeof onEmotionLogDisplayed === "function") {
        setTimeout(() => {
          Promise.resolve(onEmotionLogDisplayed(latestDisplayedCreatedAt)).catch((callbackError) => {
            console.warn("EmotionLogScreen: failed to mark displayed feed as read", callbackError);
          });
        }, 0);
      }

      // cache (used by app-level preload / next open)
      try {
        const { userId } = await getAuthContext();
        if (userId) {
          setPrefetch("EmotionLog", "feed", { userId, items: mapped });
        }
      } catch {
        // noop
      }
    } catch (e) {
      console.error("emotion log feed load error:", e);
      setErrorMsg(String(e?.message || e));
      setFeed([]);
    } finally {
      setLoading(false);
    }
  }, [isTutorialMode, onEmotionLogDisplayed, tutorialDisplayFeed, setPrefetch]);
  useEffect(() => {
    if (isTutorialMode) return;
    // If feed was preloaded at app start, render immediately and refresh silently.
    if (Array.isArray(prefetchedFeedItems)) {
      loadFeed({ silent: true });
      return;
    }
    loadFeed();
  }, [isTutorialMode, loadFeed, prefetchedFeedItems]);

  useEffect(() => {
    if (isTutorialMode) return undefined;
    if (!navigation || typeof navigation.addListener !== "function") return undefined;

    const unsubscribe = navigation.addListener("focus", () => {
      if (skipNextFocusFeedRefreshRef.current) {
        skipNextFocusFeedRefreshRef.current = false;
        return;
      }
      loadFeed({ silent: true });
    });

    return typeof unsubscribe === "function" ? unsubscribe : undefined;
  }, [isTutorialMode, loadFeed, navigation]);

  const handleOpenFollowList = useCallback(async () => {
    if (isTutorialMode) {
      Alert.alert(
        "チュートリアル",
        "チュートリアルではフォロー管理は行いません。\n\n感情通知の体験は、感情ログで確認できます。"
      );
      return;
    }

    try {
      const { userId } = await getAuthContext();
      if (!userId) {
        throw new Error("ログイン情報が取得できませんでした。");
      }

      if (navigation?.navigate) {
        navigation.navigate("FollowListScreen", {
          viewedUserId: userId,
          targetUserId: userId,
          initialTab: "following",
        });
        return;
      }
    } catch (e) {
      const msg = buildErrorMessage(e);
      Alert.alert("フォロー一覧を開けません", msg);
      return;
    }

    try {
      const parent =
        typeof navigation?.getParent === "function" ? navigation.getParent() : null;
      if (parent && typeof parent.navigate === "function") {
        const { userId } = await getAuthContext();
        if (!userId) {
          throw new Error("ログイン情報が取得できませんでした。");
        }
        parent.navigate("FollowListScreen", {
          viewedUserId: userId,
          targetUserId: userId,
          initialTab: "following",
        });
      }
    } catch (e) {
      const msg = buildErrorMessage(e);
      Alert.alert("フォロー一覧を開けません", msg);
    }
  }, [isTutorialMode, navigation]);

  const handleCompleteTutorial = useCallback(async () => {
    if (!isTutorialMode || !hasTutorialEmotionLog) return;

    try {
      await Promise.resolve(endTutorial?.());
      try {
        setUnread?.("EmotionLog", "tutorialFeed", false);
        setUnread?.("EmotionLog", "tutorial", false);
      } catch {
        // noop
      }
    } catch (e) {
      console.warn("EmotionLogScreen: failed to complete tutorial", e);
    }
  }, [isTutorialMode, hasTutorialEmotionLog, endTutorial, setUnread]);

  const renderFeedItem = ({ item }) => {
    const items = item.items || [];
    return (
      <View style={styles.row}>
        <View style={styles.feedItemHeaderRow}>
          <Text style={styles.name}>{item.ownerName}</Text>
          <Text style={styles.time}>{item.timeLabel}</Text>
        </View>

        <View style={styles.emotionArea}>
          {items.length === 0 ? (
            <Text style={styles.noEmotion}>まだ感情が選択されていません</Text>
          ) : (
            <View style={styles.emotionRow}>
              {items.map((it, idx) => {
                const tint = emotionTint(it.type, ui?.text?.description ?? colors.TEXT_SUBTLE);
                const labelStrength = STRENGTH_LABEL[it.strength] || "";
                return (
                  <View
                    key={`${it.type}-${it.strength}-${idx}`}
                    style={[styles.badge, { backgroundColor: tint.bg }]}
                  >
                    <Text style={[styles.badgeText, { color: colors.TEXT_ON_LIGHT }]}>
                      {it.type}
                      {labelStrength ? `（${labelStrength}）` : ""}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>
    );
  };

  const isDark = themeName === "dark";

  const effectiveFeed = isTutorialMode
    ? Array.isArray(tutorialDisplayFeed)
      ? tutorialDisplayFeed
      : []
    : feed;
  const effectiveLoading = isTutorialMode ? false : loading;
  const effectiveErrorMsg = isTutorialMode ? "" : errorMsg;

  return (
    <View ref={screenRootRef} collapsable={false} style={styles.safeArea}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />
      <View style={styles.safeContent}>
      {/* 画面全体は固定（背景＆タイトル固定） */}
      <View style={styles.screenContainer}>
        {/* パネルヘッダー：EmotionLog */}

          <ScrollView
            ref={tutorialScrollRef}
            style={styles.panelScroll}
            contentContainerStyle={styles.panelScrollContent}
            showsVerticalScrollIndicator={false}
            onScroll={handleTutorialScroll}
            scrollEventThrottle={16}
          >
          <View style={styles.panelHeader}>
            <View ref={panelTitleRowRef} collapsable={false} style={styles.panelTitleRow}>
            <CocolonBackButton navigation={props.navigation} fallbackRouteName="Piece" accessibilityLabel="ピースに戻る" />
            <Text style={styles.panelTitle}>感情ログ</Text>
            <CocolonPressable
              style={styles.guideTitleButton}
              onPress={handlePressGuide}
              accessibilityLabel="感情ログのガイドを開く"
            >
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={colors.TEXT_ON_LIGHT}
              />
            </CocolonPressable>
          </View>

            {/* 右上：更新（フィード再取得） + フォロー一覧 */}
            <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <CocolonPressable
                onPress={() => {
                  if (isTutorialMode) {
                    Alert.alert(
                      "チュートリアル",
                      "チュートリアルでは本番の感情ログを取得せず、模擬の通知/ログだけを表示します。"
                    );
                    return;
                  }
                  loadFeed();
                }}
                style={[
                  styles.emotionLogPill,
                  { marginRight: 10 },
                  effectiveLoading && { opacity: 0.5 },
                ]}
                disabled={effectiveLoading}
                accessibilityLabel="感情ログを更新する" accessibilityState={{ busy: effectiveLoading }}
              >
                {effectiveLoading ? (
                  <ActivityIndicator size="small" color={colors.TEXT_ON_LIGHT} />
                ) : (
                  <Ionicons
                    name="refresh"
                    size={20}
                    color={colors.TEXT_ON_LIGHT}
                  />
                )}
              </CocolonPressable>

              <CocolonPressable
                onPress={handleOpenFollowList}
                style={styles.emotionLogPill}
                accessibilityLabel="フォロー一覧を開く"
              >
                <Ionicons
                  name="people-circle-outline"
                  size={20}
                  color={colors.TEXT_ON_LIGHT}
                />
              </CocolonPressable>
            </View>
          </View>



            {isTutorialMode ? (
              <View ref={tutorialIntroRef} collapsable={false} style={styles.manageIntroCard}>
                <Text style={styles.manageIntroText}>
                  チュートリアルでは、{tutorialMockUserName}さんから通知が届く体験をします。
                  {"\n"}
                  まもなく通知が届き、この下の感情ログに反映されます。
                </Text>
              </View>
            ) : null}

            {isTutorialMode && tutorialNotificationShown ? (
              <View
                ref={tutorialNotificationRef}
                collapsable={false}
                style={styles.tutorialNotificationCard}
              >
                <View style={styles.tutorialNotificationHeader}>
                  <Ionicons
                    name="notifications-outline"
                    size={16}
                    color={colors.TITLE_GOLD}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.tutorialNotificationTitle}>感情通知</Text>
                </View>
                <Text style={styles.tutorialNotificationText}>{tutorialNotificationText}</Text>
              </View>
            ) : null}

            {/* フィードカード */}
            <View ref={tutorialFeedCardRef} collapsable={false} style={styles.card}>
              {effectiveErrorMsg ? (
                <View style={styles.centerBox}>
                  <Text style={styles.errorText}>取得エラー: {effectiveErrorMsg}</Text>
                  <TouchableOpacity
                    style={styles.retryBtn}
                    onPress={() => {
                      if (isTutorialMode) {
                        Alert.alert(
                          "チュートリアル",
                          "チュートリアルでは本番の感情ログを取得せず、模擬の通知/ログだけを表示します。"
                        );
                        return;
                      }
                      loadFeed();
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.retryText}>再読み込み</Text>
                  </TouchableOpacity>
                </View>
              ) : effectiveLoading ? (
                <View style={styles.centerBox}>
                  <ActivityIndicator size="small" />
                </View>
              ) : effectiveFeed.length === 0 ? (
                <View style={styles.centerBox}>
                  <Text style={styles.emptyText}>
                    まだ感情ログがありません
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={effectiveFeed}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={renderFeedItem}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                  scrollEnabled={false} // パネル全体は ScrollView がスクロール担当
                />
              )}
            </View>

            {isTutorialMode ? (
              <View style={styles.tutorialCompleteCard}>
                <Text style={styles.tutorialCompleteText}>
                  感情通知の体験を確認できたら、チュートリアルを完了して本番モードへ進みます。
                </Text>

                <View ref={tutorialCompleteButtonWrapRef} collapsable={false}>
                  <CocolonPressable
                    style={[
                      styles.tutorialCompleteButton,
                      (!hasTutorialEmotionLog || tutorialStep !== STEP_EMOTION_LOG_COMPLETE) && styles.tutorialCompleteButtonDisabled,
                    ]}
                    onPress={handleCompleteTutorial}
                    disabled={!hasTutorialEmotionLog || tutorialStep !== STEP_EMOTION_LOG_COMPLETE}
                    accessibilityLabel="完了にする"
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={18}
                      color={(!hasTutorialEmotionLog || tutorialStep !== STEP_EMOTION_LOG_COMPLETE) ? colors.TEXT_SUBTLE : colors.ACCENT_TEXT}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.tutorialCompleteButtonText, { color: (!hasTutorialEmotionLog || tutorialStep !== STEP_EMOTION_LOG_COMPLETE) ? colors.TEXT_SUBTLE : colors.ACCENT_TEXT }]}>
                      完了にする
                    </Text>
                  </CocolonPressable>
                </View>
              </View>
            ) : null}
          </ScrollView>
      </View>
      </View>

      {isEmotionLogTutorialVisible && tutorialOverlayConfig ? (
        <TutorialOverlay
          visible={true}
          targetRect={tutorialTargetRect}
          title={tutorialOverlayConfig.title}
          message={tutorialOverlayConfig.message}
          step={tutorialOverlayConfig.step}
          totalSteps={TUTORIAL_TOTAL_STEPS}
          mode={tutorialOverlayConfig.mode}
          nextLabel={tutorialOverlayConfig.nextLabel}
          onNext={tutorialOverlayConfig.onNext}
          onTargetPress={tutorialStep === STEP_EMOTION_LOG_COMPLETE ? handleCompleteTutorial : undefined}
          onMetricsChange={setTutorialOverlayMetrics}
          primaryDisabled={tutorialOverlayConfig.primaryDisabled}
          showPrimaryButton={tutorialOverlayConfig.showPrimaryButton}
          footerText={tutorialOverlayConfig.footerText}
          actionHint={tutorialOverlayConfig.actionHint}
        />
      ) : null}

    </View>
  );
}

function createStyles(COLORS, ui) {
  const TEXT_MAIN = COLORS.TEXT_ON_LIGHT;
  const TEXT_SUB = COLORS.TEXT_ON_LIGHT;

  const ACCENT = COLORS.GOLD_BUTTON;

  return StyleSheet.create(applyTypographyTokens({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.BG_SILVER,
    },
    safeContent: {
      flex: 1,
    },
    screenContainer: {
      flex: 1,
      paddingTop: 16,
      paddingBottom: 20,
      paddingHorizontal: 20,
      alignItems: "stretch",
      width: "100%",
      maxWidth: 680,
      alignSelf: "center",
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
      width: "100%",
      backgroundColor: COLORS.PANEL_BG,
      borderRadius: 24,
      borderWidth: 0,
      borderColor: COLORS.BORDER_GOLD,
      paddingHorizontal: 18,
      paddingVertical: 20,
      shadowColor: "#000",
      shadowOpacity: 0,
      shadowRadius: 26,
      shadowOffset: { width: 0, height: 16 },
      elevation: 0,
      flex: 1,
      minHeight: 0,
    },
    panelHeader: {
      flexDirection: "column",
      rowGap: 12,
      justifyContent: "space-between",
      alignItems: "stretch",
      marginBottom: 20,
    },
    panelTitle: {
      color: COLORS.TITLE_GOLD,
      letterSpacing: 0,
      flexShrink: 1,
    },
    panelTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      minWidth: 0,
      paddingRight: 0,
      gap: 8,
    },
    guideTitleButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      marginLeft: 0,
      flexShrink: 0,
    },

    panelScroll: {
      flex: 1,
    },
    panelScrollContent: {
      paddingBottom: 18,
    },

    emotionLogPill: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },

    lead: {
      color: COLORS.TEXT_SUBTLE,
      marginBottom: 10,
    },

    // フィードカード
    card: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingVertical: 8,
      shadowColor: "#000",
      shadowOpacity: 0,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 0,
    },

    row: {
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    feedItemHeaderRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      flexWrap: "wrap",
      rowGap: 4,
    },
    name: {
      flex: 1,
      minWidth: 0,
      paddingRight: 8,
      color: COLORS.TEXT_ON_LIGHT,
    },

    emotionArea: {
      marginTop: 8,
      alignItems: "flex-start",
    },
    noEmotion: {
      color: COLORS.TEXT_SUBTLE,
    },

    emotionRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
    },
    badge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginHorizontal: 2,
      marginVertical: 2,
    },
    badgeText: {
    },

    time: {
      color: COLORS.TEXT_SUBTLE,
      textAlign: "right",
      maxWidth: "45%",
      flexShrink: 1,
    },

    separator: {
      height: 1,
      backgroundColor: COLORS.CARD_BORDER,
      marginLeft: 16,
      marginRight: 16,
    },

    centerBox: {
      paddingVertical: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    errorText: {
      color: COLORS.ERROR,
      marginBottom: 8,
      textAlign: "center",
    },
    emptyText: {
      color: COLORS.TEXT_SUBTLE,
      textAlign: "center",
    },

    retryBtn: {
      marginTop: 4,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      minHeight: 48,
      alignItems: "center",
      justifyContent: "center",
    },
    retryText: {
      color: TEXT_MAIN,
    },

    tutorialNotificationCard: {
      marginTop: 12,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    tutorialNotificationHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    tutorialNotificationTitle: {
      color: COLORS.TEXT_ON_LIGHT,
    },
    tutorialNotificationText: {
      color: COLORS.TEXT_SUBTLE,
    },

    tutorialCompleteCard: {
      marginTop: 12,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    tutorialCompleteText: {
      color: COLORS.TEXT_SUBTLE,
      marginBottom: 10,
    },
    tutorialCompleteButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      minHeight: 52,
    },
    tutorialCompleteButtonDisabled: {
      opacity: 1,
      backgroundColor: COLORS.PANEL_BG,
      borderColor: COLORS.CARD_BORDER,
    },
    tutorialCompleteButtonText: {
      color: COLORS.ACCENT_TEXT,
    },

    // ---- Modal（Profile card 方式） ----
    modalBackdrop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.25)",
    },

    manageCard: {
      position: "absolute",
      top: 70,
      left: 20,
      right: 20,
      bottom: 70,
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 24,
      padding: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
    manageHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
      marginBottom: 10,
    },
    manageTitle: {
      color: COLORS.TEXT_ON_LIGHT,
    },
    manageCloseBtn: {
      paddingHorizontal: 6,
      paddingVertical: 4,
      borderRadius: 10,
      minWidth: 44,
      minHeight: 44,
      alignItems: "center",
      justifyContent: "center",
    },

    manageIntroCard: {
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginBottom: 10,
    },
    manageIntroText: {
      color: COLORS.TEXT_SUBTLE,
    },

    manageScroll: { flex: 1 },
    manageScrollContent: { paddingBottom: 18 },

    manageSection: { marginBottom: 14 },
    manageSectionHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 6,
    },
    manageSectionTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 6,
    },
    manageHelpText: {
      color: COLORS.TEXT_SUBTLE,
      marginTop: 6,
    },

    codeRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    copyBtn: {
      marginLeft: 8,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      minHeight: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    copyBtnDisabled: {
      opacity: 0.5,
    },

    codePill: {
      alignSelf: "flex-start",
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor: COLORS.PANEL_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
    },
    codeText: {
      letterSpacing: 0.5,
      color: COLORS.TEXT_ON_LIGHT,
    },

    manageRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    manageInput: {
      flex: 1,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 16,
      paddingVertical: 12,
      color: COLORS.TEXT_ON_LIGHT,
    },
    smallButton: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      alignItems: "center",
      justifyContent: "center",
      minWidth: 70,
      marginLeft: 8,
      minHeight: 48,
    },
    smallButtonDisabled: {
      opacity: 0.5,
    },
    smallButtonText: {
      color: COLORS.ACCENT_TEXT,
    },

    manageMessage: {
      marginTop: 8,
      color: COLORS.TEXT_ON_LIGHT,
    },
    manageEmptyText: {
      color: COLORS.TEXT_SUBTLE,
    },

    requestCard: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginBottom: 8,
    },
    requestName: {
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 6,
    },
    requestActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 8,
      flexWrap: "wrap",
      rowGap: 8,
    },
    requestBtn: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      minHeight: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    requestBtnSpacer: { marginLeft: 8 },
    requestBtnOk: {
      backgroundColor: COLORS.SURFACE_TONAL,
    },
    requestBtnNo: {
      backgroundColor: COLORS.ERROR_BG,
    },
    requestBtnDisabled: { opacity: 0.6 },
    requestBtnText: {
      color: COLORS.TEXT_ON_LIGHT,
    },

    ownerRow: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginBottom: 8,
    },
    ownerName: {
      color: COLORS.TEXT_ON_LIGHT,
    },
    ownerSub: {
      color: COLORS.TEXT_SUBTLE,
      marginTop: 2,
    },

    ghostBtn: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      minHeight: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    ghostBtnText: {
      color: COLORS.TEXT_ON_LIGHT,
    },

    pendingTag: {
      color: TEXT_SUB,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
    },
    pendingActionsCol: {
      alignItems: "flex-end",
      justifyContent: "center",
      marginLeft: 10,
    },
    pendingActionsRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
    },

    actionBtn: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      marginLeft: 8,
      minHeight: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    actionBtnText: {
      color: COLORS.TEXT_ON_LIGHT,
    },
    actionBtnDanger: {
      // border は同じだが、テキスト色で「取り下げ」を示す
    },
    actionBtnDangerText: {
      color: COLORS.ERROR,
    },
    actionBtnDisabled: {
      opacity: 0.5,
    },
  }, ui, {"panelTitle":"screenTitle","lead":"description","name":"button","noEmotion":"description","badgeText":"description","time":"meta","errorText":"description","emptyText":"body","retryText":"button","tutorialNotificationTitle":"sectionTitle","tutorialNotificationText":"body","tutorialCompleteText":"description","tutorialCompleteButtonText":"button","manageTitle":"modalTitle","manageIntroText":"description","manageSectionTitle":"sectionTitle","manageHelpText":"description","codeText":"button","manageInput":"body","smallButtonText":"button","manageMessage":"description","manageEmptyText":"description","requestName":"button","requestBtnText":"button","ownerName":"button","ownerSub":"meta","ghostBtnText":"button","pendingTag":"meta","actionBtnText":"button"}));
}
