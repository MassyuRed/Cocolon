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

import CocolonPressable from "../components/CocolonPressable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TutorialOverlay, {
  syncTutorialSpotlightTarget,
  waitForTutorialFrames,
} from "../components/TutorialOverlay";
import { apiFetch } from "../lib/apiClient";

// 🔧 ここを変えると Friend 画面のパネル高さが変わる
const PANEL_MIN_HEIGHT = 695;

const TUTORIAL_TOTAL_STEPS = 21;
const STEP_FRIENDS_OVERVIEW = 18;
const STEP_FRIENDS_NOTIFICATION = 19;
const STEP_FRIENDS_LOG = 20;
const STEP_FRIENDS_COMPLETE = 21;
const DEFAULT_TUTORIAL_FRIEND_NAME = "User";

// ---- API base ----
// 現在は MashOS(MyModel API) を Render 上で稼働させているため、
// 開発ビルド / 本番ビルドを問わず同じクラウド URL を利用する。
// （ローカル API に戻したい場合はここを書き換える）
const API_BASE = "https://mashos-api.onrender.com";

// Friend（申請/承認）API
const FRIEND_REQUEST_ENDPOINT = `${API_BASE}/friends/request`;
const FRIEND_REQUESTS_ENDPOINT = `${API_BASE}/friends/requests`; // /{id}/accept | /{id}/reject | /{id}/cancel
const FRIEND_REMOVE_ENDPOINT = `${API_BASE}/friends/remove`;

const FRIEND_NOTIFICATION_SETTINGS_ENDPOINT = `${API_BASE}/friends/notification-settings`;
const FRIEND_FEED_ENDPOINT = `${API_BASE}/friends/feed`;
const FRIEND_MANAGE_ENDPOINT = `${API_BASE}/friends/manage`;

// ===== 表示用定数 =====
const STRENGTH_LABEL = {
  weak: "弱",
  medium: "中",
  strong: "強",
};

const ACCOUNT_ROUTE_CANDIDATES = [
  "Account",
  "AccountPage",
  "AccountScreen",
  "UserAccount",
  "UserPage",
  "UserProfile",
  "Profile",
];

function navigateToAccount(navigation, userId) {
  if (!userId) return;

  const params = { viewedUserId: userId, userId, user_id: userId };

  let nav = navigation;
  while (nav) {
    const state = nav.getState?.();
    const routeNames = state?.routeNames;

    if (Array.isArray(routeNames)) {
      const name = ACCOUNT_ROUTE_CANDIDATES.find((c) => routeNames.includes(c));
      if (name) {
        try {
          nav.navigate(name, params);
        } catch {
          // noop
        }
        return;
      }
    }

    nav = nav.getParent?.();
  }

  // fallback
  try {
    navigation?.navigate?.(ACCOUNT_ROUTE_CANDIDATES[0], params);
  } catch {
    // noop
  }
}

function stripParensJP(label) {
  return String(label || "").replace(/（.*?）/g, "").trim();
}

function emotionTint(emotion) {
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
      return { bg: "rgba(107,114,128,0.12)", text: "#374151" };
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
    console.warn("FriendsScreen: failed to resolve userId", e);
  }

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    accessToken = sessionData?.session?.access_token ?? null;
  } catch (e) {
    console.warn("FriendsScreen: failed to resolve auth session", e);
  }

  return { userId, accessToken };
}

async function postJsonWithAuth(url, body) {
  const { accessToken } = await getAuthContext();
  if (!accessToken) {
    throw new Error("ログイン情報の取得に失敗しました（tokenなし）");
  }

  const res = await apiFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body || {}),
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

export default function FriendsScreen(props) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);

  const {
    isTutorialMode,
    tutorialEmotions,
    tutorialFriendFeed,
    tutorialReflections,
    tutorialStep,
    setTutorialStep,
    addTutorialFriendFeedItem,
    endTutorial,
    hasTutorialFriendLog,
  } = useTutorial();

  const { getPrefetchEntry, getPrefetchEntryFresh, setPrefetch, setUnread } = useUnread();

  const FEED_PREFETCH_MAX_AGE_MS = 2 * 60 * 1000; // 2 minutes
  const MANAGE_PREFETCH_MAX_AGE_MS = 2 * 60 * 1000; // 2 minutes

  const prefetchedFeedItems = useMemo(() => {
    try {
      const entry = getPrefetchEntryFresh
        ? getPrefetchEntryFresh("Friends", "feed", FEED_PREFETCH_MAX_AGE_MS)
        : getPrefetchEntry("Friends", "feed");
      const v = entry?.value;
      const items = Array.isArray(v?.items) ? v.items : null;
      return items;
    } catch {
      return null;
    }
  }, [getPrefetchEntry, getPrefetchEntryFresh]);
  const prefetchedManage = useMemo(() => {
    try {
      const entry = getPrefetchEntryFresh
        ? getPrefetchEntryFresh("Friends", "manage", MANAGE_PREFETCH_MAX_AGE_MS)
        : getPrefetchEntry("Friends", "manage");
      const v = entry?.value;
      return v && typeof v === "object" ? v : null;
    } catch {
      return null;
    }
  }, [getPrefetchEntry, getPrefetchEntryFresh]);

  const { navigation, hasUnreadFriendRequests = false, onOpenFriendManage, onFriendFeedDisplayed } = props || {};
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

  const isFriendsTutorialVisible =
    !!isTutorialMode &&
    tutorialStep >= STEP_FRIENDS_OVERVIEW &&
    tutorialStep <= STEP_FRIENDS_COMPLETE;

  const tutorialMockFriendName = useMemo(() => {
    const safe = Array.isArray(tutorialReflections) ? tutorialReflections : [];
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
        DEFAULT_TUTORIAL_FRIEND_NAME
    ).trim();
  }, [tutorialReflections]);

  const tutorialDisplayFeed = useMemo(() => {
    const safeFeed = Array.isArray(tutorialFriendFeed) ? tutorialFriendFeed : [];
    return safeFeed.map((item, index) => ({
      ...item,
      id: item?.id || `tutorial-friend-feed-${index}`,
      ownerName: tutorialMockFriendName,
      owner_name: tutorialMockFriendName,
    }));
  }, [tutorialFriendFeed, tutorialMockFriendName]);

  const tutorialNotificationText = useMemo(() => {
    const latest = tutorialDisplayFeed.length > 0 ? tutorialDisplayFeed[0] : null;
    const first = Array.isArray(latest?.items) && latest.items.length > 0 ? latest.items[0] : null;
    const emotion = String(first?.type || "感情");
    const strength = STRENGTH_LABEL[first?.strength] || "";
    const suffix = strength ? `（${strength}）` : "";
    return `${tutorialMockFriendName}さんが感情を入力しました：${emotion}${suffix}`;
  }, [tutorialDisplayFeed, tutorialMockFriendName]);

  const handlePressGuide = useCallback(() => {
    // Cocolonガイド（Friend）
    try {
      if (navigation?.navigate) {
        navigation.navigate("CocolonGuide", { screenId: "friend" });
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
        parent.navigate("CocolonGuide", { screenId: "friend" });
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

  // ===== friend 管理（MyProfile 方式に統一） =====
  const [modalVisible, setModalVisible] = useState(false);
  const [manageLoading, setManageLoading] = useState(false);
  const [manageMessage, setManageMessage] = useState("");

  const [myProfile, setMyProfile] = useState(() => prefetchedManage?.myProfile || null); // { id, displayName, friendCode }
  const [friendsList, setFriendsList] = useState(() => (Array.isArray(prefetchedManage?.friendsList) ? prefetchedManage.friendsList : [])); // approved: { userId, displayName, friendCode }
  const [incoming, setIncoming] = useState(() => (Array.isArray(prefetchedManage?.incoming) ? prefetchedManage.incoming : [])); // pending: { id, requesterUserId, requesterName, createdAt }
  const [outgoing, setOutgoing] = useState(() => (Array.isArray(prefetchedManage?.outgoing) ? prefetchedManage.outgoing : [])); // pending: { id, requestedUserId, requestedName, friendCode, createdAt }

  // ===== 通知設定（フレンドごと） =====
  const [friendNotifMap, setFriendNotifMap] = useState(() => (prefetchedManage?.friendNotifMap && typeof prefetchedManage.friendNotifMap === "object" ? prefetchedManage.friendNotifMap : {})); // { [friendUserId]: boolean }
  const [friendNotifBusy, setFriendNotifBusy] = useState({}); // { [friendUserId]: boolean }

  const [friendCodeInput, setFriendCodeInput] = useState("");
  const handleShareMyFriendCode = useCallback(async () => {
    const code = String(myProfile?.friendCode || "").trim();
    if (!code) {
      setManageMessage("フレンドコードが取得できていません。");
      return;
    }

    try {
      // ※ネイティブ依存を増やさないため「Share」で共有導線を出す（コード自体は長押しでコピー可能）
      await Share.share({ message: code });
    } catch (e) {
      console.warn("FriendsScreen: share friend code failed", e);
      setManageMessage("共有に失敗しました。");
    }
  }, [myProfile?.friendCode]);

  const handleTutorialScroll = useCallback((e) => {
    tutorialScrollYRef.current =
      e?.nativeEvent?.contentOffset?.y ?? tutorialScrollYRef.current;
  }, []);

  const getTutorialTargetRef = useCallback(() => {
    if (!isFriendsTutorialVisible) return null;

    switch (tutorialStep) {
      case STEP_FRIENDS_OVERVIEW:
        return tutorialIntroRef;
      case STEP_FRIENDS_NOTIFICATION:
        return tutorialNotificationShown ? tutorialNotificationRef : tutorialIntroRef;
      case STEP_FRIENDS_LOG:
        return tutorialFeedCardRef;
      case STEP_FRIENDS_COMPLETE:
        return tutorialCompleteButtonWrapRef;
      default:
        return null;
    }
  }, [isFriendsTutorialVisible, tutorialNotificationShown, tutorialStep]);

  const syncTutorialTargetRect = useCallback(async () => {
    if (!isFriendsTutorialVisible) {
      return null;
    }

    const targetRef = getTutorialTargetRef();
    if (!targetRef || !screenRootRef.current) {
      return null;
    }

    return syncTutorialSpotlightTarget({
      enabled: isFriendsTutorialVisible,
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
    isFriendsTutorialVisible,
    safeInsets,
    tutorialOverlayConfig?.cardPlacement,
    tutorialOverlayMetrics,
    windowHeight,
  ]);

  const tutorialOverlayConfig = useMemo(() => {
    if (!isFriendsTutorialVisible) return null;

    switch (tutorialStep) {
      case STEP_FRIENDS_OVERVIEW:
        return {
          step: STEP_FRIENDS_OVERVIEW,
          title: "感情ログ",
          message:
            `ここではフォロー中ユーザーの感情を観測できます。\nこのあと${tutorialMockFriendName}さんから通知が届き、感情ログに反映されます。`,
          mode: "info",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(STEP_FRIENDS_NOTIFICATION),
        };
      case STEP_FRIENDS_NOTIFICATION:
        return {
          step: STEP_FRIENDS_NOTIFICATION,
          title: "感情通知",
          message: tutorialNotificationShown
            ? `${tutorialMockFriendName}さんが感情を入力しました。\nアプリの通知をオンにしていると、このように通知が届きます。`
            : `${tutorialMockFriendName}さんからの通知を準備しています。\n通知が届くまでこのままお待ちください。`,
          mode: "info",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(STEP_FRIENDS_LOG),
          primaryDisabled: !tutorialNotificationShown || !hasTutorialFriendLog,
          footerText:
            tutorialNotificationShown && hasTutorialFriendLog
              ? "通知を確認できたら次へ進みましょう。"
              : "通知を待っています…",
        };
      case STEP_FRIENDS_LOG:
        return {
          step: STEP_FRIENDS_LOG,
          title: "感情ログ",
          message:
            "感情通知では感情のみ表示されます。\nメモの内容は表示されません。",
          mode: "info",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(STEP_FRIENDS_COMPLETE),
        };
      case STEP_FRIENDS_COMPLETE:
        return {
          step: STEP_FRIENDS_COMPLETE,
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
    hasTutorialFriendLog,
    isFriendsTutorialVisible,
    tutorialMockFriendName,
    tutorialNotificationShown,
    tutorialStep,
    setTutorialStep,
  ]);

  useLayoutEffect(() => {
    if (!isFriendsTutorialVisible) {
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
    isFriendsTutorialVisible,
    tutorialStep,
    tutorialNotificationShown,
    hasTutorialFriendLog,
    tutorialOverlayMetrics,
    syncTutorialTargetRect,
  ]);

  // Tutorial: MyModelで見た模擬ユーザー名で通知を出し、フレンドログへ反映する。
  useEffect(() => {
    if (!isTutorialMode) {
      tutorialNotificationFlowRef.current = false;
      setTutorialNotificationShown(false);
      return;
    }

    if (hasTutorialFriendLog) {
      setTutorialNotificationShown(true);
    }

    if (tutorialStep < STEP_FRIENDS_NOTIFICATION) return;
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

      if (!hasTutorialFriendLog) {
        try {
          addTutorialFriendFeedItem({
            id: `tutorial-friend-feed-${Date.now()}`,
            ownerName: tutorialMockFriendName,
            owner_name: tutorialMockFriendName,
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
        setUnread?.("Friends", "feed", true);
        setUnread?.("Friends", "tutorialFeed", true);
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
    hasTutorialFriendLog,
    tutorialMockFriendName,
    addTutorialFriendFeedItem,
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
      const json = await getJsonWithAuth(FRIEND_FEED_ENDPOINT);
      const rows = Array.isArray(json)
        ? json
        : Array.isArray(json?.items)
        ? json.items
        : Array.isArray(json?.data)
        ? json.data
        : [];

      const mapped = rows.map((row, index) => ({
        id: row?.id || `friend-feed-${index}`,
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
      if (latestDisplayedCreatedAt && typeof onFriendFeedDisplayed === "function") {
        setTimeout(() => {
          Promise.resolve(onFriendFeedDisplayed(latestDisplayedCreatedAt)).catch((callbackError) => {
            console.warn("FriendsScreen: failed to mark displayed feed as read", callbackError);
          });
        }, 0);
      }

      // cache (used by app-level preload / next open)
      try {
        const { userId } = await getAuthContext();
        if (userId) {
          setPrefetch("Friends", "feed", { userId, items: mapped });
        }
      } catch {
        // noop
      }
    } catch (e) {
      console.error("friend feed load error:", e);
      setErrorMsg(String(e?.message || e));
      setFeed([]);
    } finally {
      setLoading(false);
    }
  }, [isTutorialMode, onFriendFeedDisplayed, tutorialDisplayFeed, setPrefetch]);
  // Phase 4: legacy direct Supabase manage helpers removed.
  // Manage read path is unified via GET /friends/manage (loadManageAll).


  const loadFriendNotificationSettings = useCallback(async () => {
    try {
      const json = await getJsonWithAuth(FRIEND_NOTIFICATION_SETTINGS_ENDPOINT);

      const list = Array.isArray(json)
        ? json
        : Array.isArray(json?.settings)
        ? json.settings
        : Array.isArray(json?.data)
        ? json.data
        : [];

      const map = {};
      list.forEach((s) => {
        const friendId =
          s?.friend_user_id ||
          s?.owner_user_id ||
          s?.friendUserId ||
          s?.ownerUserId ||
          s?.friend_id ||
          s?.friendId;

        if (!friendId) return;

        const enabled =
          s?.is_enabled ?? s?.isEnabled ?? s?.enabled ?? s?.is_on ?? s?.isOn;

        if (typeof enabled === "boolean") {
          map[friendId] = enabled;
        }
      });

      setFriendNotifMap(map);
      return map;
    } catch (e) {
      // API 未対応/テーブル未作成でも Friend 管理自体は動かしたいので、ここはデフォルトON扱いにする
      console.warn("FriendsScreen: notification settings load failed", e);
      setFriendNotifMap({});
      return {};
    }
  }, []);

  const loadManageAll = useCallback(async (opts) => {
    const silent = !!opts?.silent;
    if (!silent) {
      setManageLoading(true);
    }

    try {
      const { userId } = await getAuthContext();
      if (!userId) {
        setMyProfile(null);
        setFriendsList([]);
        setIncoming([]);
        setOutgoing([]);
        setManageMessage("ログイン情報が取得できませんでした。");
        return;
      }

      const json = await getJsonWithAuth(FRIEND_MANAGE_ENDPOINT);

      const profileRaw = json?.myProfile && typeof json.myProfile === "object"
        ? json.myProfile
        : null;
      const profile = profileRaw
        ? {
            id: String(profileRaw?.id || userId || "").trim() || userId,
            displayName: String(
              profileRaw?.displayName || profileRaw?.display_name || ""
            ).trim(),
            friendCode: String(
              profileRaw?.friendCode || profileRaw?.friend_code || ""
            ).trim(),
          }
        : null;

      const friends = (Array.isArray(json?.friendsList) ? json.friendsList : []).map((f) => ({
        userId: String(f?.userId || f?.user_id || "").trim(),
        displayName:
          String(f?.displayName || f?.display_name || "").trim() || "ユーザー",
        friendCode:
          String(f?.friendCode || f?.friend_code || "").trim() || null,
      }));

      const incomingMapped = (Array.isArray(json?.incoming) ? json.incoming : []).map((r) => ({
        id: r?.id,
        requesterUserId: String(
          r?.requesterUserId || r?.requester_user_id || ""
        ).trim(),
        requesterName:
          String(r?.requesterName || r?.requester_name || "").trim() || "ユーザー",
        createdAt: r?.createdAt || r?.created_at || null,
      }));

      const outgoingMapped = (Array.isArray(json?.outgoing) ? json.outgoing : []).map((r) => ({
        id: r?.id,
        requestedUserId: String(
          r?.requestedUserId || r?.requested_user_id || ""
        ).trim(),
        requestedName:
          String(r?.requestedName || r?.requested_name || "").trim() || "ユーザー",
        friendCode:
          String(r?.friendCode || r?.friend_code || "").trim() || null,
        createdAt: r?.createdAt || r?.created_at || null,
      }));

      const notifMap =
        json?.friendNotifMap && typeof json.friendNotifMap === "object"
          ? json.friendNotifMap
          : {};

      setMyProfile(profile);
      setFriendsList(friends);
      setIncoming(incomingMapped);
      setOutgoing(outgoingMapped);
      setFriendNotifMap(notifMap);

      // cache (used by app-level preload / next open)
      try {
        setPrefetch("Friends", "manage", {
          userId,
          myProfile: profile || null,
          friendsList: friends,
          incoming: incomingMapped,
          outgoing: outgoingMapped,
          friendNotifMap:
            notifMap && typeof notifMap === "object" ? notifMap : {},
        });
      } catch {
        // noop
      }
    } catch (e) {
      console.error("friends manage load error:", e);
      setManageMessage(buildErrorMessage(e));
    } finally {
      setManageLoading(false);
    }
  }, [setPrefetch]);


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

  useEffect(() => {
    if (!modalVisible) return;

    // モーダルを開いたら最新を取得（メッセージは一旦クリア）
    setManageMessage("");

    // Tutorial: no DB/API calls. Show mock data only.
    if (isTutorialMode) {
      setManageLoading(false);
      setMyProfile({ id: "tutorial", displayName: "あなた", friendCode: "TUTORIAL" });
      setFriendsList([
        { userId: "tutorial_friend_1", displayName: tutorialMockFriendName, friendCode: "FRIEND-001" },
      ]);
      setIncoming([]);
      setOutgoing([]);
      setFriendNotifMap({});
      setManageMessage(
        "チュートリアルではフレンド申請/管理は模擬表示です。本番データには反映されません。"
      );
      return;
    }

    // If manage data was preloaded at app start, render immediately and refresh silently.
    if (prefetchedManage) {
      setMyProfile((prev) => prev || prefetchedManage?.myProfile || null);
      setFriendsList((prev) =>
        prev && prev.length > 0
          ? prev
          : Array.isArray(prefetchedManage?.friendsList)
          ? prefetchedManage.friendsList
          : []
      );
      setIncoming((prev) =>
        prev && prev.length > 0
          ? prev
          : Array.isArray(prefetchedManage?.incoming)
          ? prefetchedManage.incoming
          : []
      );
      setOutgoing((prev) =>
        prev && prev.length > 0
          ? prev
          : Array.isArray(prefetchedManage?.outgoing)
          ? prefetchedManage.outgoing
          : []
      );
      setFriendNotifMap((prev) =>
        prev && Object.keys(prev || {}).length > 0
          ? prev
          : prefetchedManage?.friendNotifMap &&
            typeof prefetchedManage.friendNotifMap === "object"
          ? prefetchedManage.friendNotifMap
          : {}
      );

      loadManageAll({ silent: true });
      return;
    }

    loadManageAll();
  }, [modalVisible, loadManageAll, prefetchedManage, isTutorialMode, tutorialMockFriendName]);

  const handleSendFriendCode = useCallback(async () => {
    if (isTutorialMode) {
      Alert.alert(
        "チュートリアル",
        "フレンド申請はチュートリアルでは実行されません（本番データには保存されません）。"
      );
      return;
    }

    const code = friendCodeInput.trim();
    if (!code || manageLoading) return;

    setManageMessage("");
    setManageLoading(true);

    try {
      const json = await postJsonWithAuth(FRIEND_REQUEST_ENDPOINT, { friend_code: code });

      if (json?.status === "ok") {
        setManageMessage("申請を送信しました。承認されるまでお待ちください。");
        setFriendCodeInput("");
      } else if (json?.status === "already_pending") {
        setManageMessage("すでに承認待ちの申請があります。");
      } else if (json?.status === "already_registered") {
        setManageMessage("すでにフレンドです。");
        setFriendCodeInput("");
      } else {
        setManageMessage("申請処理を完了しました。");
      }

      await loadManageAll();
    } catch (e) {
      setManageMessage(buildErrorMessage(e));
    } finally {
      setManageLoading(false);
    }
  }, [isTutorialMode, friendCodeInput, loadManageAll, manageLoading]);

  const handleAcceptRequest = useCallback(
    async (requestId) => {
      if (isTutorialMode) {
        Alert.alert("チュートリアル", "承認操作はチュートリアルでは実行されません。");
        return;
      }
      if (!requestId || manageLoading) return;

      setManageMessage("");
      setManageLoading(true);

      try {
        await postJsonWithAuth(`${FRIEND_REQUESTS_ENDPOINT}/${requestId}/accept`, {});
        setManageMessage("申請を承認しました。");
        await loadManageAll();
      } catch (e) {
        setManageMessage(buildErrorMessage(e));
      } finally {
        setManageLoading(false);
      }
    },
    [isTutorialMode, loadManageAll, manageLoading]
  );

  const handleRejectRequest = useCallback(
    async (requestId) => {
      if (isTutorialMode) {
        Alert.alert("チュートリアル", "拒否操作はチュートリアルでは実行されません。");
        return;
      }
      if (!requestId || manageLoading) return;

      setManageMessage("");
      setManageLoading(true);

      try {
        await postJsonWithAuth(`${FRIEND_REQUESTS_ENDPOINT}/${requestId}/reject`, {});
        setManageMessage("申請を拒否しました。");
        await loadManageAll();
      } catch (e) {
        setManageMessage(buildErrorMessage(e));
      } finally {
        setManageLoading(false);
      }
    },
    [isTutorialMode, loadManageAll, manageLoading]
  );

  const handleCancelOutgoingRequest = useCallback(
    (req) => {
      if (isTutorialMode) {
        Alert.alert("チュートリアル", "取り下げ操作はチュートリアルでは実行されません。"
        );
        return;
      }
      const requestId = req?.id || null;
      const label = req?.requestedName || "相手";
      if (!requestId || manageLoading) return;

      Alert.alert(
        "申請を取り下げますか？",
        `「${stripParensJP(label)}」への申請を取り下げます。\n\n※ 相手側の承認待ち一覧からも消えます。`,
        [
          { text: "やめる", style: "cancel" },
          {
            text: "取り下げ",
            style: "destructive",
            onPress: async () => {
              setManageMessage("");
              setManageLoading(true);

              try {
                await postJsonWithAuth(`${FRIEND_REQUESTS_ENDPOINT}/${requestId}/cancel`, {});
                setManageMessage("申請を取り下げました。");
                await loadManageAll();
              } catch (e) {
                const msg = buildErrorMessage(e);
                setManageMessage(msg);
                Alert.alert("取り下げに失敗しました", msg);
              } finally {
                setManageLoading(false);
              }
            },
          },
        ]
      );
    },
    [isTutorialMode, loadManageAll, manageLoading]
  );

  const handleResendOutgoingRequest = useCallback(
    (req) => {
      if (isTutorialMode) {
        Alert.alert("チュートリアル", "再送操作はチュートリアルでは実行されません。"
        );
        return;
      }
      const requestId = req?.id || null;
      const label = req?.requestedName || "相手";
      const code = (req?.friendCode || "").trim();

      if (!requestId || manageLoading) return;
      if (!code) {
        Alert.alert(
          "再送できません",
          "相手のフレンドコードが取得できなかったため、再送できませんでした。\n\nフレンドコードを確認して、再度申請してください。"
        );
        return;
      }

      Alert.alert(
        "申請を再送しますか？",
        `「${stripParensJP(label)}」への申請を再送します。\n\n※ 一度取り下げてから、同じフレンドコードへ申請を送り直します。\n※ これにより相手側の一覧で“新しい申請”として並び直されます。`,
        [
          { text: "やめる", style: "cancel" },
          {
            text: "再送する",
            onPress: async () => {
              setManageMessage("");
              setManageLoading(true);

              try {
                // 1) cancel current pending (best-effort)
                //    ※ すでに pending でない / すでに存在しない場合でも「再送」は続行する
                try {
                  await postJsonWithAuth(
                    `${FRIEND_REQUESTS_ENDPOINT}/${requestId}/cancel`,
                    {}
                  );
                } catch (cancelErr) {
                  const hs = cancelErr?.httpStatus;
                  if (hs !== 400 && hs !== 404) {
                    throw cancelErr;
                  }
                  console.warn("FriendsScreen: resend cancel skipped", cancelErr);
                }
                // 2) send again
                const json = await postJsonWithAuth(FRIEND_REQUEST_ENDPOINT, { friend_code: code });

                if (json?.status === "ok") {
                  setManageMessage("申請を再送しました。承認されるまでお待ちください。");
                } else if (json?.status === "already_pending") {
                  setManageMessage("すでに承認待ちの申請があります（再送が反映されない場合があります）。");
                } else if (json?.status === "already_registered") {
                  setManageMessage("すでにフレンドです。");
                } else {
                  setManageMessage("再送処理を完了しました。");
                }

                await loadManageAll();
              } catch (e) {
                const msg = buildErrorMessage(e);
                setManageMessage(msg);
                Alert.alert("再送に失敗しました", msg);
              } finally {
                setManageLoading(false);
              }
            },
          },
        ]
      );
    },
    [isTutorialMode, loadManageAll, manageLoading]
  );

  const handleToggleFriendNotification = useCallback(
    async (friend) => {
      if (isTutorialMode) {
        Alert.alert(
          "チュートリアル",
          "通知設定の切り替えはチュートリアルでは実行されません。"
        );
        return;
      }
      const friendUserId = friend?.userId || null;
      if (!friendUserId) return;
      if (manageLoading) return;
      if (friendNotifBusy?.[friendUserId]) return;

      const currentEnabled = friendNotifMap?.[friendUserId] !== false; // undefined は ON 扱い
      const nextEnabled = !currentEnabled;

      // optimistic update（体感を軽く）
      setFriendNotifMap((prev) => ({ ...(prev || {}), [friendUserId]: nextEnabled }));
      setFriendNotifBusy((prev) => ({ ...(prev || {}), [friendUserId]: true }));

      try {
        await postJsonWithAuth(
          `${FRIEND_NOTIFICATION_SETTINGS_ENDPOINT}/${friendUserId}`,
          { is_enabled: nextEnabled }
        );
      } catch (e) {
        // rollback
        setFriendNotifMap((prev) => ({ ...(prev || {}), [friendUserId]: currentEnabled }));
        const msg = buildErrorMessage(e);
        Alert.alert("通知設定の更新に失敗しました", msg);
      } finally {
        setFriendNotifBusy((prev) => {
          const next = { ...(prev || {}) };
          delete next[friendUserId];
          return next;
        });
      }
    },
    [isTutorialMode, friendNotifBusy, friendNotifMap, manageLoading]
  );

  const handleOpenApprovedFriendMenu = useCallback(
    (friend) => {
      if (isTutorialMode) {
        Alert.alert("チュートリアル", "フレンド削除はチュートリアルでは実行されません。"
        );
        return;
      }
      const friendUserId = friend?.userId || null;
      const label = friend?.displayName || "Friend";

      if (!friendUserId || manageLoading) return;

      Alert.alert(
        "フレンド",
        `「${stripParensJP(label)}」をフレンドから削除しますか？`,
        [
          { text: "やめる", style: "cancel" },
          {
            text: "フレンド削除",
            style: "destructive",
            onPress: async () => {
              setManageMessage("");
              setManageLoading(true);

              try {
                const { userId } = await getAuthContext();
                if (!userId) {
                  throw new Error("ログイン情報が取得できませんでした。");
                }

                // API側（service role）で双方向の friendships を削除して、確実にフレンド解除する
                await postJsonWithAuth(FRIEND_REMOVE_ENDPOINT, {
                  friend_user_id: friendUserId,
                });

                setManageMessage("フレンドを削除しました。");
                await loadManageAll();
              } catch (e) {
                const msg = buildErrorMessage(e);
                setManageMessage(msg);
                Alert.alert("削除に失敗しました", msg);
              } finally {
                setManageLoading(false);
              }
            },
          },
        ]
      );
    },
    [isTutorialMode, loadManageAll, manageLoading]
  );


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

  const openInputTab = useCallback(() => {
    try {
      navigation?.navigate?.("Input");
      return;
    } catch {
      // noop
    }

    try {
      const parent =
        typeof navigation?.getParent === "function" ? navigation.getParent() : null;
      if (parent && typeof parent.navigate === "function") {
        parent.navigate("Input");
      }
    } catch {
      // noop
    }
  }, [navigation]);

  const handleCompleteTutorial = useCallback(async () => {
    if (!isTutorialMode || !hasTutorialFriendLog) return;

    try {
      await Promise.resolve(endTutorial?.());
      try {
        setUnread?.("Friends", "tutorialFeed", false);
        setUnread?.("Friends", "tutorial", false);
      } catch {
        // noop
      }
    } catch (e) {
      console.warn("FriendsScreen: failed to complete tutorial", e);
    }
  }, [isTutorialMode, hasTutorialFriendLog, endTutorial, setUnread]);

  const renderFeedItem = ({ item }) => {
    const items = item.items || [];
    return (
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.name}>{item.ownerName}</Text>
        </View>

        <View style={styles.center}>
          {items.length === 0 ? (
            <Text style={styles.noEmotion}>まだ感情が選択されていません</Text>
          ) : (
            <View style={styles.emotionRow}>
              {items.map((it, idx) => {
                const tint = emotionTint(it.type);
                const labelStrength = STRENGTH_LABEL[it.strength] || "";
                return (
                  <View
                    key={`${it.type}-${it.strength}-${idx}`}
                    style={[styles.badge, { backgroundColor: tint.bg }]}
                  >
                    <Text style={[styles.badgeText, { color: tint.text }]}>
                      {it.type}
                      {labelStrength ? `（${labelStrength}）` : ""}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <Text style={styles.time}>{item.timeLabel}</Text>
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
        {/* パネルヘッダー：Friend */}
          <View style={styles.panelHeader}>
            <View ref={panelTitleRowRef} collapsable={false} style={styles.panelTitleRow}>
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

            {/* 右上：更新（フィード再取得） + フレンド管理 */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                  styles.friendPill,
                  { marginRight: 10 },
                  effectiveLoading && { opacity: 0.5 },
                ]}
                disabled={effectiveLoading}
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
                style={styles.friendPill}
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

          <ScrollView
            ref={tutorialScrollRef}
            style={styles.panelScroll}
            contentContainerStyle={styles.panelScrollContent}
            showsVerticalScrollIndicator={false}
            onScroll={handleTutorialScroll}
            scrollEventThrottle={16}
          >
            <Text style={[styles.lead, { fontWeight: "700" }]}>感情ログ</Text>

            {isTutorialMode ? (
              <View ref={tutorialIntroRef} collapsable={false} style={styles.manageIntroCard}>
                <Text style={styles.manageIntroText}>
                  チュートリアルでは、{tutorialMockFriendName}さんから通知が届く体験をします。
                  {"\n"}
                  まもなく通知が届き、この下の感情ログに反映されます。
                  {"\n"}
                  ※ 本番データには保存されません。
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
                      (!hasTutorialFriendLog || tutorialStep !== STEP_FRIENDS_COMPLETE) && styles.tutorialCompleteButtonDisabled,
                    ]}
                    onPress={handleCompleteTutorial}
                    disabled={!hasTutorialFriendLog || tutorialStep !== STEP_FRIENDS_COMPLETE}
                    accessibilityLabel="完了にする"
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={18}
                      color="#FFFFFF"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.tutorialCompleteButtonText}>
                      完了にする
                    </Text>
                  </CocolonPressable>
                </View>
              </View>
            ) : null}
          </ScrollView>
      </View>
      </View>

      {isFriendsTutorialVisible && tutorialOverlayConfig ? (
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
          onTargetPress={tutorialStep === STEP_FRIENDS_COMPLETE ? handleCompleteTutorial : undefined}
          onMetricsChange={setTutorialOverlayMetrics}
          primaryDisabled={tutorialOverlayConfig.primaryDisabled}
          showPrimaryButton={tutorialOverlayConfig.showPrimaryButton}
          footerText={tutorialOverlayConfig.footerText}
          actionHint={tutorialOverlayConfig.actionHint}
        />
      ) : null}

      {/* フレンド管理モーダル（MyProfile 方式） */}
      <Modal
        visible={false && modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setModalVisible(false)}
        />

        <View style={styles.manageCard}>
          <View style={styles.manageHeader}>
            <Text style={styles.manageTitle}>フレンド</Text>
            <Pressable
              style={styles.manageCloseBtn}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={20} color="#374151" />
            </Pressable>
          </View>

          <View style={styles.manageIntroCard}>
            <Text style={styles.manageIntroText}>
              フレンドコードで申請。{"\n"}相手が承認するとフレンドになります。{"\n"}承認済みになると、ここに一覧表示されます。
            </Text>
          </View>

          <ScrollView
            style={styles.manageScroll}
            contentContainerStyle={styles.manageScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.manageSection}>
              <Text style={styles.manageSectionTitle}>あなたのフレンドコード</Text>
              <View style={styles.codeRow}>
                <View style={styles.codePill}>
                  <Text style={styles.codeText} selectable>
                    {myProfile?.friendCode || "（未取得）"}
                  </Text>
                </View>

                <Pressable
                  style={[
                    styles.copyBtn,
                    (!myProfile?.friendCode || manageLoading) &&
                      styles.copyBtnDisabled,
                  ]}
                  onPress={handleShareMyFriendCode}
                  disabled={!myProfile?.friendCode || manageLoading}
                >
                  <Ionicons name="copy-outline" size={18} color="#374151" />
                </Pressable>
              </View>
              <Text style={styles.manageHelpText}>
                このコードを相手に教えると、{"\n"}相手があなたへフレンド申請を送れます。
              </Text>
            </View>

            <View style={styles.manageSection}>
              <Text style={styles.manageSectionTitle}>
                他ユーザーのフレンドコードに申請
              </Text>
              <View style={styles.manageRow}>
                <TextInput
                  style={styles.manageInput}
                  placeholder="相手のフレンドコードを入力"
                  placeholderTextColor={colors.TEXT_ON_LIGHT}
                  value={friendCodeInput}
                  onChangeText={setFriendCodeInput}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
                <CocolonPressable
                  style={[
                    styles.smallButton,
                    (!friendCodeInput.trim() || manageLoading) &&
                      styles.smallButtonDisabled,
                  ]}
                  onPress={handleSendFriendCode}
                  disabled={!friendCodeInput.trim() || manageLoading}
                >
                  {manageLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.smallButtonText}>申請</Text>
                  )}
                </CocolonPressable>
              </View>

              {manageMessage ? (
                <Text style={styles.manageMessage}>{manageMessage}</Text>
              ) : null}
            </View>

            <View style={styles.manageSection}>
              <View style={styles.manageSectionHeaderRow}>
                <Text style={styles.manageSectionTitle}>受信した申請</Text>
                <Pressable style={styles.ghostBtn} onPress={loadManageAll}>
                  <Ionicons name="refresh" size={16} color="#374151" />
                </Pressable>
              </View>

              {incoming.length === 0 ? (
                <Text style={styles.manageEmptyText}>
                  受信中の申請はありません。
                </Text>
              ) : (
                incoming.map((r) => (
                  <View key={String(r.id)} style={styles.requestCard}>
                    <Text style={styles.requestName} numberOfLines={1}>
                      {r.requesterName || "(unknown)"}
                    </Text>
                    {r.createdAt ? (
                      <Text style={styles.ownerSub}>
                        申請日: {formatTimeLabel(r.createdAt)}
                      </Text>
                    ) : null}
                    <View style={styles.requestActions}>
                      <Pressable
                        style={[
                          styles.requestBtn,
                          styles.requestBtnOk,
                          manageLoading && styles.requestBtnDisabled,
                        ]}
                        disabled={manageLoading}
                        onPress={() => handleAcceptRequest(r.id)}
                      >
                        <Text style={styles.requestBtnText}>承認</Text>
                      </Pressable>
                      <Pressable
                        style={[
                          styles.requestBtn,
                          styles.requestBtnSpacer,
                          styles.requestBtnNo,
                          manageLoading && styles.requestBtnDisabled,
                        ]}
                        disabled={manageLoading}
                        onPress={() => handleRejectRequest(r.id)}
                      >
                        <Text style={styles.requestBtnText}>拒否</Text>
                      </Pressable>
                    </View>
                  </View>
                ))
              )}
            </View>

            <View style={styles.manageSection}>
              <Text style={styles.manageSectionTitle}>承認済み</Text>
              {friendsList.length === 0 ? (
                <Text style={styles.manageEmptyText}>
                  登録済みはまだありません。
                </Text>
              ) : (
                friendsList.map((f) => (
                  <View key={String(f.userId)} style={styles.ownerRow}>
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity
                        onPress={() => navigateToAccount(navigation, f.userId)}
                        activeOpacity={0.85}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Text style={styles.ownerName} numberOfLines={1}>
                          {f.displayName || "Friend"}
                        </Text>
                      </TouchableOpacity>
                      {f.friendCode ? (
                        <Text style={styles.ownerSub}>ID: {f.friendCode}</Text>
                      ) : null}
                    </View>


                    <Pressable
                      style={[
                        styles.copyBtn,
                        (manageLoading || friendNotifBusy?.[f.userId]) &&
                          styles.copyBtnDisabled,
                      ]}
                      disabled={manageLoading || !!friendNotifBusy?.[f.userId]}
                      onPress={() => handleToggleFriendNotification(f)}
                    >
                      {friendNotifBusy?.[f.userId] ? (
                        <ActivityIndicator size="small" color="#374151" />
                      ) : (
                        <Ionicons
                          name={
                            friendNotifMap?.[f.userId] === false
                              ? "notifications-off-outline"
                              : "notifications-outline"
                          }
                          size={18}
                          color={
                            friendNotifMap?.[f.userId] === false
                              ? "#9CA3AF"
                              : colors.BRAND_GOLD || colors.GOLD_BUTTON || "#A16207"
                          }
                        />
                      )}
                    </Pressable>

                    <Pressable
                      style={[
                        styles.copyBtn,
                        manageLoading && styles.copyBtnDisabled,
                      ]}
                      disabled={manageLoading}
                      onPress={() => handleOpenApprovedFriendMenu(f)}
                    >
                      <Text style={[styles.actionBtnText, styles.actionBtnDangerText]}>削除</Text>
                    </Pressable>
                  </View>
                ))
              )}
            </View>

            {outgoing.length > 0 ? (
              <View style={styles.manageSection}>
                <Text style={styles.manageSectionTitle}>申請中（承認待ち）</Text>
                <Text style={styles.manageHelpText}>
                  承認されるとフレンド一覧に追加されます。
                </Text>

                {outgoing.map((o) => (
                  <View key={String(o.id)} style={styles.ownerRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.ownerName} numberOfLines={1}>
                        {o.requestedName || "Friend"}
                      </Text>
                      {o.friendCode ? (
                        <Text style={styles.ownerSub}>ID: {o.friendCode}</Text>
                      ) : null}
                      {o.createdAt ? (
                        <Text style={styles.ownerSub}>
                          申請日: {formatTimeLabel(o.createdAt)}
                        </Text>
                      ) : null}
                    </View>

                    <View style={styles.pendingActionsCol}>
                      <Text style={styles.pendingTag}>承認待ち</Text>

                      <View style={styles.pendingActionsRow}>
                        <Pressable
                          disabled={manageLoading}
                          style={[
                            styles.actionBtn,
                            manageLoading && styles.actionBtnDisabled,
                          ]}
                          onPress={() => handleResendOutgoingRequest(o)}
                        >
                          <Text style={styles.actionBtnText}>再送</Text>
                        </Pressable>

                        <Pressable
                          disabled={manageLoading}
                          style={[
                            styles.actionBtn,
                            styles.actionBtnDanger,
                            manageLoading && styles.actionBtnDisabled,
                          ]}
                          onPress={() => handleCancelOutgoingRequest(o)}
                        >
                          <Text
                            style={[
                              styles.actionBtnText,
                              styles.actionBtnDangerText,
                            ]}
                          >
                            取り下げ
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : null}
          </ScrollView>
        </View>
      </Modal>

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
      backgroundColor: COLORS.PANEL_BG,
    },
    safeContent: {
      flex: 1,
    },
    screenContainer: {
      flex: 1,
      paddingTop: 16,
      paddingBottom: 16,
      paddingHorizontal: 18,
      alignItems: "stretch",
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
      width: "94%",
      backgroundColor: COLORS.PANEL_BG,
      borderRadius: 26,
      borderWidth: 2,
      borderColor: COLORS.BORDER_GOLD,
      paddingHorizontal: 18,
      paddingVertical: 20,
      shadowColor: "#000",
      shadowOpacity: 0.24,
      shadowRadius: 26,
      shadowOffset: { width: 0, height: 16 },
      elevation: 12,
      flex: 1,
      minHeight: 0,
    },
    panelHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
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

    panelScroll: {
      flex: 1,
    },
    panelScrollContent: {
      paddingBottom: 18,
    },

    friendPill: {
      width: 42,
      height: 38,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },

    lead: {
      color: TEXT_SUB,
      fontSize: 12,
      marginBottom: 10,
    },

    // フィードカード
    card: {
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

    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    left: {
      flexDirection: "row",
      alignItems: "center",
    },
    name: {
      fontWeight: "700",
      color: TEXT_MAIN,
      fontSize: 15,
    },

    center: {
      flex: 1,
      alignItems: "center",
    },
    noEmotion: {
      fontSize: 12,
      color: TEXT_SUB,
    },

    emotionRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      marginHorizontal: 2,
      marginVertical: 2,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: "700",
    },

    time: {
      color: TEXT_SUB,
      fontSize: 12,
      width: 80,
      textAlign: "right",
    },

    separator: {
      height: 1,
      backgroundColor: "#EEE",
      marginLeft: 12,
      marginRight: 12,
    },

    centerBox: {
      paddingVertical: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    errorText: {
      color: "#B91C1C",
      marginBottom: 8,
      textAlign: "center",
    },
    emptyText: {
      color: TEXT_SUB,
      textAlign: "center",
      fontSize: 13,
    },

    retryBtn: {
      marginTop: 4,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    retryText: {
      color: TEXT_MAIN,
      fontSize: 12,
      fontWeight: "600",
    },

    tutorialNotificationCard: {
      marginTop: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    tutorialNotificationHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    tutorialNotificationTitle: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    tutorialNotificationText: {
      fontSize: 12,
      lineHeight: 18,
      color: TEXT_SUB,
    },

    tutorialCompleteCard: {
      marginTop: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    tutorialCompleteText: {
      fontSize: 12,
      lineHeight: 18,
      color: TEXT_SUB,
      marginBottom: 10,
    },
    tutorialCompleteButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
    },
    tutorialCompleteButtonDisabled: {
      opacity: 0.5,
    },
    tutorialCompleteButtonText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "800",
    },

    // ---- Modal（MyProfile 方式） ----
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
      borderRadius: 16,
      padding: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 12 },
      elevation: 12,
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
      fontSize: 15,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    manageCloseBtn: {
      paddingHorizontal: 6,
      paddingVertical: 4,
      borderRadius: 10,
    },

    manageIntroCard: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 10,
      paddingVertical: 10,
      marginBottom: 10,
    },
    manageIntroText: {
      fontSize: 12,
      lineHeight: 18,
      color: TEXT_SUB,
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
      fontSize: 13,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 6,
    },
    manageHelpText: {
      fontSize: 11,
      lineHeight: 16,
      color: TEXT_SUB,
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
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
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
      fontSize: 13,
      fontWeight: "800",
      letterSpacing: 0.5,
      color: COLORS.TEXT_ON_LIGHT,
    },

    manageRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    manageInput: {
      flex: 1,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 10,
      paddingVertical: Platform.OS === "ios" ? 10 : 8,
      fontSize: 13,
      color: COLORS.TEXT_ON_LIGHT,
    },
    smallButton: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      alignItems: "center",
      justifyContent: "center",
      minWidth: 70,
      marginLeft: 8,
    },
    smallButtonDisabled: {
      opacity: 0.5,
    },
    smallButtonText: {
      color: "#FFFFFF",
      fontWeight: "800",
      fontSize: 13,
    },

    manageMessage: {
      marginTop: 8,
      fontSize: 12,
      lineHeight: 16,
      color: COLORS.TEXT_ON_LIGHT,
    },
    manageEmptyText: {
      fontSize: 12,
      color: TEXT_SUB,
    },

    requestCard: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 10,
      paddingVertical: 10,
      marginBottom: 8,
    },
    requestName: {
      fontSize: 13,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 6,
    },
    requestActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 8,
    },
    requestBtn: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
    },
    requestBtnSpacer: { marginLeft: 8 },
    requestBtnOk: { backgroundColor: "#10B981" },
    requestBtnNo: { backgroundColor: "#EF4444" },
    requestBtnDisabled: { opacity: 0.6 },
    requestBtnText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "800",
    },

    ownerRow: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 10,
      paddingVertical: 10,
      marginBottom: 8,
    },
    ownerName: {
      fontSize: 13,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },
    ownerSub: {
      fontSize: 11,
      color: TEXT_SUB,
      marginTop: 2,
    },

    ghostBtn: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    ghostBtnText: {
      fontSize: 12,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },

    pendingTag: {
      fontSize: 11,
      fontWeight: "800",
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
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      marginLeft: 8,
    },
    actionBtnText: {
      fontSize: 11,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    actionBtnDanger: {
      // border は同じだが、テキスト色で「取り下げ」を示す
    },
    actionBtnDangerText: {
      color: "#B91C1C",
    },
    actionBtnDisabled: {
      opacity: 0.5,
    },
  }, ui));
}
