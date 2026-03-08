import React, { useEffect, useState } from "react";
import { Text, View, ActivityIndicator, AppState, Platform, StatusBar, Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { NavigationContainer, createNavigationContainerRef, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createBottomTabNavigator,
  BottomTabBar,
} from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Push open -> navigate
import messaging from "@react-native-firebase/messaging";

// Auth
import { AuthProvider, useAuth } from "./AuthContext";
import AuthScreen from "./AuthScreen";

// Screens
import InputScreen from "./screens/InputScreen";
import CocolonGuideScreen from "./screens/CocolonGuideScreen";
import MyWebScreen from "./screens/MyWebScreen";
import MyModelScreen from "./screens/MyModelScreen";
import MyModelCreateScreen from "./screens/MyModelCreateScreen";
import MyModelReflectionsScreen from "./screens/MyModelReflectionsScreen";
import FriendsScreen from "./screens/FriendsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import AccountScreen from "./screens/AccountScreen"; // アカウント画面
import SubscriptionSelectScreen from "./screens/SubscriptionSelectScreen"; // ✅ サブスク選択画面（新規）
import FollowListScreen from "./screens/FollowListScreen"; // フォロー / フォロワー 一覧
import EchoesHistoryListScreen from "./screens/EchoesHistoryListScreen";
import DiscoveriesHistoryListScreen from "./screens/DiscoveriesHistoryListScreen";
import EchoesHistoryDetailScreen from "./screens/EchoesHistoryDetailScreen";
import DiscoveriesHistoryDetailScreen from "./screens/DiscoveriesHistoryDetailScreen";


// Ranking
import RankingTopScreen from "./screens/RankingTopScreen";
import EmotionRankingScreen from "./screens/EmotionRankingScreen";
import InputCountRankingScreen from "./screens/InputCountRankingScreen";
import InputLengthRankingScreen from "./screens/InputLengthRankingScreen";
// Ranking (MyModel QnA)
import MyModelEchoesRankingScreen from "./screens/MyModelEchoesRankingScreen";
import MyModelDiscoveriesRankingScreen from "./screens/MyModelDiscoveriesRankingScreen";
import MyModelQuestionsRankingScreen from "./screens/MyModelQuestionsRankingScreen";

import LoginStreakRankingScreen from "./screens/LoginStreakRankingScreen";
// 🎨 Theme
import { ThemeProvider, useTheme } from "./theme/ThemeContext";

// 🔴 Unread badge state (screen ⇄ bottom tab)
import { UnreadProvider, useUnread } from "./UnreadContext";

// 🧾 Subscription tier (free/plus/premium)
import { SubscriptionProvider, useSubscription } from "./SubscriptionContext";
import { TutorialProvider, useTutorial } from "./TutorialContext";

// IAP: purchase completion → MashOS /subscription/update → finishTransaction
import { startIapPurchaseObserver, stopIapPurchaseObserver } from "./lib/iap/iapService";

// Push: device token → Supabase profiles.push_token
import {
  startPushTokenSync,
  syncPushTokenOnce,
} from "./lib/pushToken";

// Supabase (Friends unread badge)
import { supabase } from "./lib/supabase";
import { getCurrentUserId } from "./lib/user";

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

const InputStack = createNativeStackNavigator();
const MyWebStack = createNativeStackNavigator();
const MyModelStack = createNativeStackNavigator();
const RankingStack = createNativeStackNavigator();
const FriendsStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();


async function resolveCurrentUserId() {
  try {
    const id = await getCurrentUserId();
    if (id) return id;
  } catch {
    // ignore
  }

  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error) {
      return data?.user?.id ?? null;
    }
  } catch {
    // ignore
  }

  return null;
}

// hidden screens（上部ロゴ/下部タグ/左右ラインを非表示にする画面）
// NOTE: Account は他の画面と同じように上部ロゴ/下部タグを表示したいので hidden から外す
const HIDDEN_SCREENS = new Set([]);

// Bottom tabs that should be shown in the tab bar (always 5)
const MAIN_TAB_ROUTES = new Set(["Input", "MyWeb", "MyModel", "RankingTop", "Friends", "Settings"]);

// MyModel sub-screens (treated as MyModel in the tab bar)
const MYMODEL_SUB_ROUTES = new Set(["EchoesHistoryList", "DiscoveriesHistoryList", "EchoesHistoryDetail", "DiscoveriesHistoryDetail", "MyModelCreate", "MyModelReflections", "MyModelReflectionsScreen"]);

// Frame line width
const FRAME_BORDER_WIDTH = 2;

// ------------------------------------------------------------
// Global fixed logo header (theme-aware)
// - Visible only when frameEnabled is true
// - Fonts are copied from InputScreen.js
// ------------------------------------------------------------
function GlobalFrameLayout({ children, frameEnabled }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // Android: ensure the top logo header never overlaps with the OS status bar.
  // SafeAreaView on Android may not always include StatusBar height (device/OS dependent).
  const androidExtraTop =
    Platform.OS === "android"
      ? Math.max(0, (StatusBar.currentHeight || 0) - (insets?.top || 0))
      : 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.BG_SILVER }}>
      {frameEnabled ? (
        <SafeAreaView edges={["top", "left", "right"]} style={{ backgroundColor: colors.BG_SILVER, paddingTop: androidExtraTop }}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 6, // slightly smaller than the bottom tab area
              paddingHorizontal: 12,
              borderBottomColor: colors.BORDER_GOLD,
              borderBottomWidth: FRAME_BORDER_WIDTH,
            }}
          >
            <Text
              style={{
                fontFamily: "CormorantGaramond-Bold",
                fontSize: 24,
                letterSpacing: 1.2,
                color: colors.BRAND_GOLD,
              }}
            >
              Emlis
            </Text>
            <Text
              style={{
                fontFamily: "CormorantGaramond-Regular",
                marginTop: 4,
                fontSize: 11,
                letterSpacing: 0.8,
                color: colors.BRAND_GOLD,
              }}
            >
              ～Emotion Limbic Internal Structure～
            </Text>
          </View>
        </SafeAreaView>
      ) : null}

      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

// ------------------------------------------------------------
// Push notification tap -> open Friends tab
// - Keep this minimal: current Push spec uses only emotion content
// - Any notification tap opens the Friends screen
// ------------------------------------------------------------
export const navigationRef = createNavigationContainerRef();

let __pendingOpenFriendsFromNotification = false;

function hasRouteName(state, targetName) {
  if (!state) return false;
  const routes = state?.routes;
  if (!Array.isArray(routes)) return false;

  for (const r of routes) {
    if (r?.name === targetName) return true;
    if (hasRouteName(r?.state, targetName)) return true;
  }
  return false;
}

function canNavigateToFriends() {
  try {
    const rootState = navigationRef.getRootState();
    return hasRouteName(rootState, "Friends");
  } catch {
    return false;
  }
}

function tryOpenFriendsIfPending() {
  if (!__pendingOpenFriendsFromNotification) return;
  if (!navigationRef.isReady()) return;
  if (!canNavigateToFriends()) return;

  try {
    navigationRef.navigate("Friends");
    __pendingOpenFriendsFromNotification = false;
  } catch {
    // keep pending; will retry when navigation becomes ready
  }
}

function requestOpenFriendsFromNotification() {
  __pendingOpenFriendsFromNotification = true;
  tryOpenFriendsIfPending();
}

// ★ カスタムTabBar：hidden screens（Account/SubscriptionSelect）を非表示にしつつ、幅は5つ分で均等に
function CocolonTabBar(props) {
  const { colors } = useTheme();
  const { state } = props;

  const currentRoute = state.routes[state.index];

  const currentRouteName = currentRoute?.name;
  const effectiveRouteName =
    typeof currentRouteName === "string" && currentRouteName.startsWith("Ranking")
      ? "RankingTop"
      : currentRouteName === "MyProfile" || MYMODEL_SUB_ROUTES.has(currentRouteName)
      ? "MyModel"
      : currentRouteName;

  // hidden screens のときはタブバー自体を消す
  if (HIDDEN_SCREENS.has(currentRoute.name)) {
    return null;
  }

  // タブに表示するのは常に 5 つだけ
  const filteredRoutes = state.routes.filter((route) =>
    MAIN_TAB_ROUTES.has(route.name)
  );

  // Account など「タブ外」画面にいる場合、TabBar 側は先頭タブをアクティブ扱いにする
  const activeIndex = Math.max(
    0,
    filteredRoutes.findIndex((r) => r.name === effectiveRouteName)
  );

  const filteredState = {
    ...state,
    routes: filteredRoutes,
    index: activeIndex,
  };

  // タグ上面の線：テーマ色で確実に描画（Androidで borderTopColor が反映されないケース対策）
  return (
    <View
      style={{
        backgroundColor: colors.BG_SILVER,
        borderTopColor: colors.BORDER_GOLD,
        borderTopWidth: FRAME_BORDER_WIDTH,
      }}
    >
      <BottomTabBar {...props} state={filteredState} />
    </View>
  );
}


// ------------------------------------------------------------
// Tab stack navigators
// - Keep navigation state within each tab while allowing tab switching.
// ------------------------------------------------------------
function InputStackNavigator() {
  return (
    <InputStack.Navigator initialRouteName="Input" screenOptions={{ headerShown: false }}>
      <InputStack.Screen name="Input" component={InputScreen} />
      <InputStack.Screen name="CocolonGuide" component={CocolonGuideScreen} />
      {/* Common screens (kept inside each tab stack to preserve state) */}
      <InputStack.Screen name="Account" component={AccountScreen} />
      <InputStack.Screen name="SubscriptionSelect" component={SubscriptionSelectScreen} />
      <InputStack.Screen name="FollowListScreen" component={FollowListScreen} />
    </InputStack.Navigator>
  );
}

function MyWebStackNavigator({ onSetMymodelLinkPayload }) {
  return (
    <MyWebStack.Navigator initialRouteName="MyWeb" screenOptions={{ headerShown: false }}>
      <MyWebStack.Screen name="MyWeb">
        {(navProps) => (
          <MyWebScreen
            {...navProps}
            onOpenMyProfile={(payload) => {
              // payload を保持してから MyModel タブへ遷移
              try {
                onSetMymodelLinkPayload?.(payload || null);
              } catch {
                // noop
              }
              try {
                navProps?.navigation?.navigate("MyModel");
              } catch (e) {
                // navigation が無い場合は何もしない（落ちないように）
              }
            }}
            onOpenSubscription={() => {
              // MyWeb paywall CTA → SubscriptionSelect（tab内スタック）
              try {
                navProps?.navigation?.navigate("SubscriptionSelect");
              } catch (e) {
                // navigation が無い場合は何もしない（落ちないように）
              }
            }}
          />
        )}
      </MyWebStack.Screen>

      {/* Common screens (kept inside each tab stack to preserve state) */}
      <MyWebStack.Screen name="Account" component={AccountScreen} />
      <MyWebStack.Screen name="CocolonGuide" component={CocolonGuideScreen} />

      <MyWebStack.Screen name="SubscriptionSelect" component={SubscriptionSelectScreen} />
      <MyWebStack.Screen name="FollowListScreen" component={FollowListScreen} />
    </MyWebStack.Navigator>
  );
}

function MyModelStackNavigator({ linkPayload, onConsumeLinkPayload }) {
  return (
    <MyModelStack.Navigator initialRouteName="MyModel" screenOptions={{ headerShown: false }}>
      <MyModelStack.Screen name="MyModel">
        {(navProps) => (
          <MyModelScreen
            {...navProps}
            linkPayload={linkPayload}
            onConsumeLinkPayload={onConsumeLinkPayload}
            onOpenSubscription={() => {
              // MyModel paywall CTA → SubscriptionSelect（tab内スタック）
              try {
                navProps?.navigation?.navigate("SubscriptionSelect");
              } catch (e) {
                // navigation が無い場合は何もしない（落ちないように）
              }
            }}
          />
        )}
      </MyModelStack.Screen>

      <MyModelStack.Screen name="MyModelCreate">
        {(navProps) => (
          <MyModelCreateScreen
            {...navProps}
            onBack={() => {
              try {
                if (navProps?.navigation?.canGoBack?.()) {
                  navProps.navigation.goBack();
                  return;
                }
              } catch {
                // noop
              }

              try {
                navProps?.navigation?.navigate("MyModel");
              } catch {
                // noop
              }
            }}
            onOpenSubscription={() => {
              try {
                navProps?.navigation?.navigate("SubscriptionSelect");
              } catch {
                // noop
              }
            }}
          />
        )}
      </MyModelStack.Screen>

      <MyModelStack.Screen name="MyModelReflections" component={MyModelReflectionsScreen} />
      <MyModelStack.Screen name="EchoesHistoryList" component={EchoesHistoryListScreen} />
      <MyModelStack.Screen name="DiscoveriesHistoryList" component={DiscoveriesHistoryListScreen} />
      <MyModelStack.Screen name="EchoesHistoryDetail" component={EchoesHistoryDetailScreen} />
      <MyModelStack.Screen name="DiscoveriesHistoryDetail" component={DiscoveriesHistoryDetailScreen} />

      {/* Common screens (kept inside each tab stack to preserve state) */}
      <MyModelStack.Screen name="Account" component={AccountScreen} />
      <MyModelStack.Screen name="CocolonGuide" component={CocolonGuideScreen} />

      <MyModelStack.Screen name="SubscriptionSelect" component={SubscriptionSelectScreen} />
      <MyModelStack.Screen name="FollowListScreen" component={FollowListScreen} />
    </MyModelStack.Navigator>
  );
}

function RankingStackNavigator() {
  return (
    <RankingStack.Navigator initialRouteName="RankingTop" screenOptions={{ headerShown: false }}>
      <RankingStack.Screen name="RankingTop" component={RankingTopScreen} />
      <RankingStack.Screen name="RankingEmotion" component={EmotionRankingScreen} />
      <RankingStack.Screen name="RankingInputCount" component={InputCountRankingScreen} />
      <RankingStack.Screen name="RankingInputLength" component={InputLengthRankingScreen} />
      <RankingStack.Screen name="RankingMyModelQuestions" component={MyModelQuestionsRankingScreen} />
      <RankingStack.Screen name="RankingMyModelResonances" component={MyModelEchoesRankingScreen} />
      <RankingStack.Screen name="RankingMyModelDiscoveries" component={MyModelDiscoveriesRankingScreen} />
      <RankingStack.Screen name="RankingLoginStreak" component={LoginStreakRankingScreen} />

      {/* Common screens (kept inside each tab stack to preserve state) */}
      <RankingStack.Screen name="Account" component={AccountScreen} />
      <RankingStack.Screen name="CocolonGuide" component={CocolonGuideScreen} />

      <RankingStack.Screen name="SubscriptionSelect" component={SubscriptionSelectScreen} />
      <RankingStack.Screen name="FollowListScreen" component={FollowListScreen} />
    </RankingStack.Navigator>
  );
}

function FriendsStackNavigator({ hasUnreadFriendRequests, onOpenFriendManage }) {
  return (
    <FriendsStack.Navigator initialRouteName="Friends" screenOptions={{ headerShown: false }}>
      <FriendsStack.Screen name="Friends">
        {(navProps) => (
          <FriendsScreen
            {...navProps}
            hasUnreadFriendRequests={hasUnreadFriendRequests}
            onOpenFriendManage={onOpenFriendManage}
          />
        )}
      </FriendsStack.Screen>

      {/* Common screens (kept inside each tab stack to preserve state) */}
      <FriendsStack.Screen name="Account" component={AccountScreen} />
      <FriendsStack.Screen name="CocolonGuide" component={CocolonGuideScreen} />

      <FriendsStack.Screen name="SubscriptionSelect" component={SubscriptionSelectScreen} />
      <FriendsStack.Screen name="FollowListScreen" component={FollowListScreen} />
    </FriendsStack.Navigator>
  );
}

function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator initialRouteName="Settings" screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />

      {/* Common screens (kept inside each tab stack to preserve state) */}
      <SettingsStack.Screen name="Account" component={AccountScreen} />
      <SettingsStack.Screen name="CocolonGuide" component={CocolonGuideScreen} />

      <SettingsStack.Screen name="SubscriptionSelect" component={SubscriptionSelectScreen} />
      <SettingsStack.Screen name="FollowListScreen" component={FollowListScreen} />
    </SettingsStack.Navigator>
  );
}

function MainTabs() {
  const { colors } = useTheme();

  const {
    getScopeUnread,
    getFeatureUnread,
    setUnread,
    setUnreadGroup,
    clearScope,
    // Prefetch cache
    getPrefetchEntryFresh,
    setPrefetch,
  } = useUnread();

  const { isPaid } = useSubscription();

  // 現在表示中の route 名（hidden screens 判定に使う）
  const [activeRouteName, setActiveRouteName] = useState("Input");
  const frameEnabled = !HIDDEN_SCREENS.has(activeRouteName);

  // MyWeb → MyModel 交差リンク（payload受け渡し）
  const [mymodelLinkPayload, setMymodelLinkPayload] = useState(null);

  // ------------------------------------------------------------
  // Tab reselect behavior (all tabs)
  // - When the user taps the currently "active" tab again while they are on a sub-screen
  //   (e.g., RankingEmotion, Account, SubscriptionSelect ...), jump back to the tab's main screen.
  // - This mirrors CocolonTabBar's effective route mapping.
  // ------------------------------------------------------------
  const getTabBarActiveName = React.useCallback((name) => {
    const n = typeof name === "string" ? name : "";
    const effective =
      n.startsWith("Ranking") ? "RankingTop" : n === "MyProfile" || MYMODEL_SUB_ROUTES.has(n) ? "MyModel" : n;

    // If the current route is not one of the main tabs (Account, SubscriptionSelect, etc),
    // TabBar treats it as "Input" active. Mirror that here.
    return MAIN_TAB_ROUTES.has(effective) ? effective : "Input";
  }, []);

  const handleMainTabPress = React.useCallback(
    (pressedTabName, navigation, route, e) => {
      const currentRoute =
        typeof activeRouteName === "string" ? activeRouteName : "";
      const currentActiveTab = getTabBarActiveName(currentRoute);

      // 1) When the pressed tab is already the "active" tab in the UI (e.g. MyProfile is treated as MyModel),
      // but the actual current route is a different screen, jump back to the real tab route.
      if (
        currentActiveTab === pressedTabName &&
        currentRoute !== pressedTabName
      ) {
        try {
          e?.preventDefault?.();
        } catch {
          // noop
        }
        try {
          navigation?.navigate?.(pressedTabName);
        } catch {
          // noop
        }
        return;
      }

      // 2) When the user re-taps the currently focused tab, pop that tab's stack back to its root.
      // This preserves cross-tab state while keeping the "reselect -> main screen" behavior.
      try {
        const isFocused = !!navigation?.isFocused?.();
        if (!isFocused) return;

        const nestedState = route?.state;
        const nestedIndex =
          typeof nestedState?.index === "number" ? nestedState.index : 0;

        if (nestedIndex > 0) {
          try {
            e?.preventDefault?.();
          } catch {
            // noop
          }

          const targetKey = nestedState?.key;
          if (targetKey) {
            try {
              navigation?.dispatch?.({
                ...StackActions.popToTop(),
                target: targetKey,
              });
            } catch {
              // noop
            }
          } else {
            // Fallback: at least jump to the tab route itself
            try {
              navigation?.navigate?.(pressedTabName);
            } catch {
              // noop
            }
          }
        }
      } catch {
        // noop
      }
    },
    [activeRouteName, getTabBarActiveName]
  );




  // Unread badge state is stored in UnreadContext (screen ⇄ bottom tab)
  // - App-level: can prefetch unread (e.g., before opening a screen)
  // - Screen-level: can update unread in real time while mounted
  const hasUnreadFriendRequests = !!getFeatureUnread("Friends", "requests");

  // Friend request unread cursor (fallback for when DB table is unavailable)
  const friendRequestsLastReadAtRef = React.useRef("1970-01-01T00:00:00Z");


// ------------------------------------------------------------
// Unread badge (MyModel Create)
// - Goal: show the MyModel tab red dot even before the user opens MyModel,
//   so they notice "MyModel Create" exists.
// - Rule:
//   * light : show if not all answered (has unanswered) — includes 0/10 to advertise existence
//   * standard (future): show if questions exist AND has unanswered (new set after subscription)
// ------------------------------------------------------------
const MYMODEL_API_BASE_URL = (
  process.env.EXPO_PUBLIC_MYMODEL_API_URL || "https://mashos-api.onrender.com"
).replace(/\/+$/, "");


// ------------------------------------------------------------
// Activity login (login streak)
// - Rule: count a day when the app becomes foreground while authenticated
// - Server computes JST day; client is best-effort (fail-soft)
// ------------------------------------------------------------
const __lastActivityLoginPingAtRef = React.useRef(0);

const pingActivityLogin = React.useCallback(async () => {
  try {
    const now = Date.now();
    const last = Number(__lastActivityLoginPingAtRef.current || 0) || 0;
    // Throttle to avoid spamming on rapid foreground/background flaps
    if (now - last < 10 * 1000) return;
    __lastActivityLoginPingAtRef.current = now;

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token ?? null;
    if (!accessToken) return;

    const url = `${MYMODEL_API_BASE_URL}/activity/login`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Fail-soft: even if this fails, the app should work normally
    if (!res.ok) {
      // noop
    }
  } catch (e) {
    // noop
  }
}, []);

const refreshMyModelCreateUnreadBadge = React.useCallback(async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token ?? null;
    if (!accessToken) {
      setUnread("MyWeb", "mymodelCreate", false);
      setUnread("MyModel", "mymodelCreate", false);
      return;
    }

    const fetchTier = async (tier) => {
      const url = `${MYMODEL_API_BASE_URL}/mymodel/create/questions?build_tier=${encodeURIComponent(
        tier
      )}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return null;
      const json = await res.json().catch(() => null);
      return json && typeof json === "object" ? json : null;
    };

    const lightJson = await fetchTier("light");
    const lightTotal =
      Number(lightJson?.meta?.total_questions ?? lightJson?.questions?.length ?? 0) ||
      0;
    const lightHasUnanswered = !!lightJson?.meta?.has_unanswered;

    // Light: show dot until all questions are answered (includes 0/10)
    const lightDot = lightTotal > 0 && lightHasUnanswered;

    // Future-proof: when Standard questions are introduced, show dot until all answered.
    const standardJson = await fetchTier("standard");
    const standardTotal =
      Number(
        standardJson?.meta?.total_questions ?? standardJson?.questions?.length ?? 0
      ) || 0;
    const standardHasUnanswered = !!standardJson?.meta?.has_unanswered;
    const standardDot = standardTotal > 0 && standardHasUnanswered;

    setUnread("MyWeb", "mymodelCreate", false);
    setUnread("MyModel", "mymodelCreate", !!(lightDot || standardDot));
  } catch (e) {
    // best-effort (don't crash the app due to badge)
    setUnread("MyWeb", "mymodelCreate", false);
    setUnread("MyModel", "mymodelCreate", false);
  }
}, []);

const refreshMyModelQnaUnreadBadge = React.useCallback(async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token ?? null;
    if (!accessToken) {
      setUnread("MyModel", "qnaNew", false);
      return;
    }

    const url = `${MYMODEL_API_BASE_URL}/mymodel/qna/unread`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      setUnread("MyModel", "qnaNew", false);
      return;
    }

    const hasUnread =
      typeof json?.has_unread === "boolean"
        ? json.has_unread
        : typeof json?.hasUnread === "boolean"
        ? json.hasUnread
        : Number(json?.unread_count ?? json?.unreadCount ?? 0) > 0;

    setUnread("MyModel", "qnaNew", !!hasUnread);
  } catch (e) {
    // best-effort (don't crash the app due to badge)
    setUnread("MyModel", "qnaNew", false);
  }
}, []);

  // ------------------------------------------------------------
  // Unread badge (MyWeb tab: reports)
  // - For "MyWeb" tab red dot, even before opening MyWeb screen.
  // - This mirrors MyWebScreen's unread badge logic (best-effort).
  // ------------------------------------------------------------
  const refreshMyWebReportsUnreadBadge = React.useCallback(async () => {
    const TYPES = ["daily", "weekly", "monthly"];
    const LIMIT = 1; // MyWeb画面と同じく「最新1件」が未読かどうかだけを見る
    const MYWEB_REPORTS_READY_ENDPOINT = `${MYMODEL_API_BASE_URL}/myweb/reports/ready`;

    const extractReadyItems = (payload) => {
      if (Array.isArray(payload?.items)) return payload.items;
      if (Array.isArray(payload?.reports)) return payload.reports;
      if (Array.isArray(payload?.data?.items)) return payload.data.items;
      if (Array.isArray(payload?.data?.reports)) return payload.data.reports;
      if (Array.isArray(payload)) return payload;
      return [];
    };

    const fetchReadyReports = async (accessToken, reportType, limit = 1) => {
      const url = `${MYWEB_REPORTS_READY_ENDPOINT}?report_type=${encodeURIComponent(
        reportType
      )}&limit=${encodeURIComponent(limit)}`;

      const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        const text = await res.text();
        const err = new Error(`ready failed: ${res.status}`);
        err.status = res.status;
        err.body = text;
        throw err;
      }

      const json = await res.json();
      return extractReadyItems(json);
    };

    try {
      const userId = await resolveCurrentUserId();
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token ?? null;

      if (!userId || !accessToken) {
        try {
          clearScope("MyWeb");
        } catch {
          // noop
        }
        setUnreadGroup("MyWeb", {
          daily: false,
          weekly: false,
          monthly: false,
          selfStructure: false,
        });
        return;
      }

      const idsByType = {
        daily: [],
        weekly: [],
        monthly: [],
        selfStructure: [],
      };

      // 1) MyWeb（日/週/月）は画面と同じ READY API から最新1件のIDを取る
      await Promise.all(
        TYPES.map(async (t) => {
          try {
            const readyItems = await fetchReadyReports(accessToken, t, LIMIT);
            idsByType[t] = (Array.isArray(readyItems) ? readyItems : [])
              .map((r) => String(r?.id || ""))
              .filter(Boolean)
              .slice(0, LIMIT);
          } catch (e) {
            console.warn(
              "MainTabs: failed to fetch READY report ids for unread badge",
              t,
              e?.status || e?.message || e
            );
            idsByType[t] = [];
          }
        })
      );

      // 1b) 自己構造（月次）の最新1件（Plus/Premiumのみ）
      if (isPaid) {
        const { data: selfData, error: selfErr } = await supabase
          .from("myprofile_reports")
          .select("id")
          .eq("user_id", userId)
          .eq("report_type", "monthly")
          .order("period_end", { ascending: false })
          .order("generated_at", { ascending: false })
          .order("updated_at", { ascending: false })
          .limit(LIMIT);

        if (selfErr) throw selfErr;

        idsByType.selfStructure = (Array.isArray(selfData) ? selfData : [])
          .map((r) => String(r?.id || ""))
          .filter(Boolean)
          .slice(0, LIMIT);
      } else {
        idsByType.selfStructure = [];
      }

      const allIds = Array.from(
        new Set([
          ...idsByType.daily,
          ...idsByType.weekly,
          ...idsByType.monthly,
          ...idsByType.selfStructure,
        ])
      );

      // 2) 表示対象IDの中で、既読済みIDをまとめて取得（文字列化して比較ズレを防ぐ）
      let readSet = new Set();
      if (allIds.length > 0) {
        const { data: reads, error: rErr } = await supabase
          .from("report_reads")
          .select("report_id")
          .eq("user_id", userId)
          .in("report_id", allIds);

        if (rErr) throw rErr;

        readSet = new Set(
          (Array.isArray(reads) ? reads : [])
            .map((r) => String(r?.report_id || ""))
            .filter(Boolean)
        );
      }

      const isLatestUnread = (ids) => {
        const latestId = Array.isArray(ids) && ids.length > 0 ? ids[0] : null;
        return !!latestId && !readSet.has(latestId);
      };

      try {
        clearScope("MyWeb");
      } catch {
        // noop
      }

      // 3) 画面と同じく「最新1件」の未読だけでタブ状態を作る
      setUnreadGroup("MyWeb", {
        daily: isLatestUnread(idsByType.daily),
        weekly: isLatestUnread(idsByType.weekly),
        monthly: isLatestUnread(idsByType.monthly),
        selfStructure: isLatestUnread(idsByType.selfStructure),
      });
    } catch (e) {
      console.warn("MainTabs: failed to refresh MyWeb unread badges", e);
      try {
        clearScope("MyWeb");
      } catch {
        // noop
      }
      setUnreadGroup("MyWeb", {
        daily: false,
        weekly: false,
        monthly: false,
        selfStructure: false,
      });
    }
  }, [isPaid, setUnreadGroup, clearScope]);

  const refreshFriendsUnreadBadge = React.useCallback(async () => {
    try {
      const userId = await resolveCurrentUserId();
      if (!userId) {
        setUnread("Friends", "feed", false);
        return;
      }

      // 1) 最後に既読化した時刻（無ければ epoch 扱い）
      const { data: readRow, error: readErr } = await supabase
        .from("friend_feed_reads")
        .select("last_read_at")
        .eq("user_id", userId)
        .maybeSingle();

      if (readErr) throw readErr;

      const lastReadAt = readRow?.last_read_at || "1970-01-01T00:00:00Z";

      // 2) last_read_at より新しいログが1件でもあれば未読
      const { data: newerRows, error: newerErr } = await supabase
        .from("friend_emotion_feed")
        .select("id, created_at")
        .eq("viewer_user_id", userId)
        .gt("created_at", lastReadAt)
        .order("created_at", { ascending: false })
        .limit(1);

      if (newerErr) throw newerErr;

      setUnread("Friends", "feed", Array.isArray(newerRows) && newerRows.length > 0);
    } catch (e) {
      console.warn("MainTabs: failed to refresh Friends unread badge", e);
      setUnread("Friends", "feed", false);
    }
  }, []);


  const refreshFriendRequestsUnreadBadge = React.useCallback(async () => {
    try {
      const userId = await resolveCurrentUserId();
      if (!userId) {
        setUnread("Friends", "requests", false);
        return;
      }

      // 1) 最後に「申請一覧（モーダル）」を開いた時刻（無ければ epoch 扱い）
      //    - friend_request_reads が無い / RLS / 一時的エラーの場合は、ローカルRefをフォールバックする
      let lastReadAt = friendRequestsLastReadAtRef.current || "1970-01-01T00:00:00Z";

      try {
        const { data: readRow, error: readErr } = await supabase
          .from("friend_request_reads")
          .select("last_read_at")
          .eq("user_id", userId)
          .maybeSingle();

        if (!readErr) {
          lastReadAt = readRow?.last_read_at || lastReadAt;
          friendRequestsLastReadAtRef.current = lastReadAt;
        }
      } catch {
        // ignore (fallback to ref)
      }

      // 2) last_read_at より新しい「受信した pending 申請」が1件でもあれば未読
      const { data: newerRows, error: newerErr } = await supabase
        .from("friend_requests")
        .select("id, created_at")
        .eq("requested_user_id", userId)
        .eq("status", "pending")
        .gt("created_at", lastReadAt)
        .order("created_at", { ascending: false })
        .limit(1);

      if (newerErr) throw newerErr;

      setUnread("Friends", "requests", Array.isArray(newerRows) && newerRows.length > 0);
    } catch (e) {
      console.warn("MainTabs: failed to refresh Friend request unread badge", e);
      setUnread("Friends", "requests", false);
    }
  }, []);

  const markFriendRequestsRead = React.useCallback(async () => {
    try {
      const userId = await resolveCurrentUserId();
      if (!userId) return;

      // server-side created_at をカーソルにする（端末時刻ズレ対策）
      const { data: latestRows, error: latestErr } = await supabase
        .from("friend_requests")
        .select("created_at")
        .eq("requested_user_id", userId)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(1);

      if (latestErr) throw latestErr;

      const lastReadAt =
        Array.isArray(latestRows) && latestRows.length > 0
          ? latestRows[0]?.created_at
          : new Date().toISOString();

      // fallback cursor（DB が無い場合でもこのsession中は既読化できる）
      friendRequestsLastReadAtRef.current = lastReadAt;

      // DB があれば永続化（無ければエラーになってもOK）
      const { error: upErr } = await supabase
        .from("friend_request_reads")
        .upsert({ user_id: userId, last_read_at: lastReadAt }, { onConflict: "user_id" });

      if (upErr) {
        // warn only（fallback already updated）
        console.warn("MainTabs: friend_request_reads upsert failed", upErr);
      }
    } catch (e) {
      console.warn("MainTabs: failed to mark Friend requests read", e);
    }
  }, []);

  const markFriendsFeedRead = React.useCallback(async () => {
    try {
      const userId = await resolveCurrentUserId();
      if (!userId) return;

      // server-side created_at をカーソルにする（端末時刻ズレ対策）
      const { data: latestRows, error: latestErr } = await supabase
        .from("friend_emotion_feed")
        .select("created_at")
        .eq("viewer_user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (latestErr) throw latestErr;

      const lastReadAt =
        Array.isArray(latestRows) && latestRows.length > 0
          ? latestRows[0]?.created_at
          : new Date().toISOString();

      const { error: upErr } = await supabase
        .from("friend_feed_reads")
        .upsert({ user_id: userId, last_read_at: lastReadAt }, { onConflict: "user_id" });

      if (upErr) throw upErr;
    } catch (e) {
      console.warn("MainTabs: failed to mark Friends feed read", e);
    }
  }, []);


  // ------------------------------------------------------------
  // Screen data prefetch (full preload)
  // - Preload screen-level data at app start / resume to reduce UI latency.
  // - Stored in UnreadContext prefetch cache (best-effort).
  // ------------------------------------------------------------
  // Prefetch freshness
  // - If cached data is younger than this, skip re-fetch to reduce load.
  // - Old caches can still be shown immediately, then refreshed silently by screens.
  const PREFETCH_MAX_AGE_MS = 2 * 60 * 1000; // 2 minutes

  const __lastScreenPrefetchAtRef = React.useRef(0);

  const hasFreshPrefetch = React.useCallback(
    (scope, key, maxAgeMs) => {
      try {
        const entry = getPrefetchEntryFresh?.(scope, key, maxAgeMs);
        return !!entry;
      } catch {
        return false;
      }
    },
    [getPrefetchEntryFresh]
  );

  const formatTimeLabel = React.useCallback((iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("ja-JP", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const prefetchFriendsFeed = React.useCallback(async () => {
    try {
      const userId = await resolveCurrentUserId();
      if (!userId) return;

      // Fresh cache? Skip fetching.
      try {
        const fresh = getPrefetchEntryFresh?.("Friends", "feed", PREFETCH_MAX_AGE_MS);
        if (fresh?.value?.userId && String(fresh.value.userId) === String(userId)) {
          return;
        }
      } catch {
        // noop
      }

      const { data, error } = await supabase
        .from("friend_emotion_feed")
        .select("id, owner_name, items, created_at")
        .eq("viewer_user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      const rows = Array.isArray(data) ? data : [];
      const mapped = rows.map((row) => ({
        id: row.id,
        ownerName: row.owner_name || "Friend",
        items: Array.isArray(row.items) ? row.items : [],
        timeLabel: formatTimeLabel(row.created_at),
      }));

      // cache (used by FriendsScreen to render immediately)
      try {
        setPrefetch("Friends", "feed", { userId, items: mapped });
      } catch {
        // noop
      }
    } catch (e) {
      // fail-soft
    }
  }, [formatTimeLabel, setPrefetch, getPrefetchEntryFresh]);

  const prefetchFriendsManageData = React.useCallback(async () => {
    try {
      const userId = await resolveCurrentUserId();
      if (!userId) return;

      // Fresh cache? Skip fetching.
      try {
        const fresh = getPrefetchEntryFresh?.("Friends", "manage", PREFETCH_MAX_AGE_MS);
        if (fresh?.value?.userId && String(fresh.value.userId) === String(userId)) {
          return;
        }
      } catch {
        // noop
      }

      // 1) My profile
      let myProfile = {
        id: userId,
        displayName: "",
        friendCode: "",
      };

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, display_name, friend_code")
          .eq("id", userId)
          .maybeSingle();

        if (!error && data) {
          myProfile = {
            id: userId,
            displayName: data.display_name || "User",
            friendCode: data.friend_code || "",
          };
        }
      } catch {
        // ignore
      }

      // 2) Approved friends
      let friendsList = [];
      try {
        const { data, error } = await supabase
          .from("friendships")
          .select("friend_user_id, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (!error) {
          const rows = Array.isArray(data) ? data : [];
          const ids = rows.map((r) => r?.friend_user_id).filter(Boolean);

          let profileMap = new Map();
          if (ids.length > 0) {
            const { data: profs, error: pErr } = await supabase
              .from("profiles")
              .select("id, display_name, friend_code")
              .in("id", ids);

            if (!pErr) {
              profileMap = new Map(
                (Array.isArray(profs) ? profs : []).map((p) => [
                  p.id,
                  {
                    displayName: p.display_name || "Friend",
                    friendCode: p.friend_code || null,
                  },
                ])
              );
            }
          }

          friendsList = rows.map((r) => {
            const p = profileMap.get(r.friend_user_id) || {};
            return {
              userId: r.friend_user_id,
              displayName: p.displayName || "Friend",
              friendCode: p.friendCode || null,
            };
          });
        }
      } catch {
        // ignore
      }

      // 3) Pending requests
      let incoming = [];
      let outgoing = [];
      try {
        const [inRes, outRes] = await Promise.all([
          supabase
            .from("friend_requests")
            .select("id, requester_user_id, created_at")
            .eq("requested_user_id", userId)
            .eq("status", "pending")
            .order("created_at", { ascending: false }),
          supabase
            .from("friend_requests")
            .select("id, requested_user_id, created_at")
            .eq("requester_user_id", userId)
            .eq("status", "pending")
            .order("created_at", { ascending: false }),
        ]);

        const inRows = Array.isArray(inRes?.data) ? inRes.data : [];
        const outRows = Array.isArray(outRes?.data) ? outRes.data : [];

        const needProfileIds = new Set();
        inRows.forEach((r) => r.requester_user_id && needProfileIds.add(r.requester_user_id));
        outRows.forEach((r) => r.requested_user_id && needProfileIds.add(r.requested_user_id));

        let profileMap = new Map();
        const idList = Array.from(needProfileIds);
        if (idList.length > 0) {
          const { data: profs, error: pErr } = await supabase
            .from("profiles")
            .select("id, display_name, friend_code")
            .in("id", idList);
          if (!pErr) {
            profileMap = new Map(
              (Array.isArray(profs) ? profs : []).map((p) => [
                p.id,
                {
                  displayName: p.display_name || "Friend",
                  friendCode: p.friend_code || null,
                },
              ])
            );
          }
        }

        incoming = inRows.map((r) => {
          const p = profileMap.get(r.requester_user_id) || {};
          return {
            id: r.id,
            requesterUserId: r.requester_user_id,
            requesterName: p.displayName || "Friend",
            createdAt: r.created_at || null,
          };
        });

        outgoing = outRows.map((r) => {
          const p = profileMap.get(r.requested_user_id) || {};
          return {
            id: r.id,
            requestedUserId: r.requested_user_id,
            requestedName: p.displayName || "Friend",
            friendCode: p.friendCode || null,
            createdAt: r.created_at || null,
          };
        });
      } catch {
        // ignore
      }

      // 4) Friend notification settings (best-effort)
      let friendNotifMap = {};
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData?.session?.access_token ?? null;
        if (accessToken) {
          const url = `${MYMODEL_API_BASE_URL}/friends/notification-settings`;
          const res = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const json = await res.json().catch(() => null);
          if (res.ok) {
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
            friendNotifMap = map;
          }
        }
      } catch {
        // ignore
      }

      // cache (used by FriendsScreen to open the manage modal instantly)
      try {
        setPrefetch("Friends", "manage", {
          userId,
          myProfile,
          friendsList,
          incoming,
          outgoing,
          friendNotifMap,
        });
      } catch {
        // noop
      }
    } catch {
      // fail-soft
    }
  }, [setPrefetch, getPrefetchEntryFresh]);

  const prefetchMyModelScreenData = React.useCallback(async () => {
    try {
      const userId = await resolveCurrentUserId();
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token ?? null;

      if (!userId || !accessToken) return;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };

      // 1) Trending (top questions)
      try {
        const fresh = getPrefetchEntryFresh?.("MyModel", "trending", PREFETCH_MAX_AGE_MS);
        const isFresh =
          !!fresh?.value?.userId && String(fresh.value.userId) === String(userId);

        if (!isFresh) {
          const url = `${MYMODEL_API_BASE_URL}/mymodel/qna/trending?limit=20`;
          const res = await fetch(url, { method: "GET", headers });
          const json = await res.json().catch(() => null);
          if (res.ok) {
            const items = Array.isArray(json?.items) ? json.items : [];
            setPrefetch("MyModel", "trending", { userId, items });
          }
        }
      } catch {
        // noop
      }

      // 2) Recommend users (for "ユーザーで探す")
      try {
        const fresh = getPrefetchEntryFresh?.("MyModel", "recoUsers", PREFETCH_MAX_AGE_MS);
        const isFresh =
          !!fresh?.value?.userId && String(fresh.value.userId) === String(userId);

        if (!isFresh) {
          const url = `${MYMODEL_API_BASE_URL}/mymodel/recommend/users?limit=20`;
          const res = await fetch(url, { method: "GET", headers });
          const json = await res.json().catch(() => null);
          if (res.ok) {
            const users = Array.isArray(json?.users)
              ? json.users
              : Array.isArray(json?.items)
              ? json.items
              : Array.isArray(json?.rows)
              ? json.rows
              : Array.isArray(json)
              ? json
              : [];
            setPrefetch("MyModel", "recoUsers", { userId, items: users });
          }
        }
      } catch {
        // noop
      }

      // 3) QnA list (default: newest / self) for "問いを生成"
      try {
        const cacheKey = `qnaList:${userId}:newest`;
        const fresh = getPrefetchEntryFresh?.("MyModel", cacheKey, PREFETCH_MAX_AGE_MS);
        const isFresh =
          !!fresh?.value?.targetUserId &&
          String(fresh.value.targetUserId) === String(userId);

        if (!isFresh) {
          const params = new URLSearchParams();
          params.append("target_user_id", userId);
          params.append("sort", "newest");

          const url = `${MYMODEL_API_BASE_URL}/mymodel/qna/list?${params.toString()}`;
          const res = await fetch(url, { method: "GET", headers });
          const json = await res.json().catch(() => null);
          if (res.ok) {
            const items = Array.isArray(json?.items) ? json.items : [];
            const meta =
              json?.meta && typeof json.meta === "object" ? json.meta : null;

            setPrefetch("MyModel", cacheKey, {
              userId,
              targetUserId: userId,
              mode: "newest",
              items,
              meta,
            });
          }
        }
      } catch {
        // noop
      }
    } catch (e) {
      // fail-soft
    }
  }, [setPrefetch, getPrefetchEntryFresh]);

  const runAllScreenPrefetch = React.useCallback(() => {
    try {
      const now = Date.now();
      const last = Number(__lastScreenPrefetchAtRef.current || 0) || 0;

      // Throttle to avoid repeated heavy prefetch on rapid foreground/background flaps
      if (now - last < 30 * 1000) return Promise.resolve();

      __lastScreenPrefetchAtRef.current = now;

      const tasks = [
        prefetchFriendsFeed,
        prefetchFriendsManageData,
        prefetchMyModelScreenData,
      ];

      return Promise.all(
        tasks.map((fn) =>
          Promise.resolve()
            .then(() => fn())
            .catch(() => null)
        )
      ).then(() => null);
    } catch {
      return Promise.resolve();
    }
  }, [prefetchFriendsFeed, prefetchFriendsManageData, prefetchMyModelScreenData]);

  // ------------------------------------------------------------
  // Unread badge: prefetch template
  // - Add new prefetch tasks by appending one line to `tasks`.
  // ------------------------------------------------------------
  const runAllUnreadPrefetch = React.useCallback(() => {
    // best-effort: never crash the app due to badge refresh
    try {
      pingActivityLogin();
    } catch {
      // noop
    }

    const tasks = [
      refreshFriendsUnreadBadge,
      refreshFriendRequestsUnreadBadge,
      refreshMyModelCreateUnreadBadge,
      refreshMyModelQnaUnreadBadge,
      refreshMyWebReportsUnreadBadge,
      runAllScreenPrefetch,
    ];

    Promise.all(
      tasks.map((fn) =>
        Promise.resolve()
          .then(() => fn())
          .catch(() => null)
      )
    ).catch(() => {
      // noop
    });
  }, [
    pingActivityLogin,
    refreshFriendsUnreadBadge,
    refreshFriendRequestsUnreadBadge,
    refreshMyModelCreateUnreadBadge,
    refreshMyModelQnaUnreadBadge,
    refreshMyWebReportsUnreadBadge,
    runAllScreenPrefetch,
  ]);

  // 起動時・復帰時に Friends 未読をチェック（Friend画面を開かなくても分かるようにする）
  useEffect(() => {
    runAllUnreadPrefetch();

    const handler = (state) => {
      if (state === "active") {
        runAllUnreadPrefetch();
      }
    };

    // RNバージョン差吸収
    const sub = AppState?.addEventListener
      ? AppState.addEventListener("change", handler)
      : null;

    return () => {
      try {
        if (sub && typeof sub.remove === "function") sub.remove();
        else if (AppState?.removeEventListener)
          AppState.removeEventListener("change", handler);
      } catch {
        // noop
      }
    };
  }, [runAllUnreadPrefetch]);


  // Friend requests: realtime updates（アプリ起動中に申請が来てもバッジが反映されるように）
  useEffect(() => {
    let channel = null;
    let cancelled = false;

    (async () => {
      const userId = await resolveCurrentUserId();
      if (!userId || cancelled) return;

      try {
        channel = supabase
          .channel(`friend_requests_badge_${userId}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "friend_requests",
              filter: `requested_user_id=eq.${userId}`,
            },
            () => {
              refreshFriendRequestsUnreadBadge();
            }
          )
          .subscribe();
      } catch (e) {
        console.warn("MainTabs: friend_requests realtime subscribe failed", e);
      }
    })();

    return () => {
      cancelled = true;
      try {
        if (channel) supabase.removeChannel(channel);
      } catch {
        // noop
      }
    };
  }, [refreshFriendRequestsUnreadBadge]);


  // Friends を開いたら「既読扱い」にする（タブの赤●を消す）
  useEffect(() => {
    if (activeRouteName !== "Friends") return;

    // UX: タップ直後に赤●を消しておく（裏で既読処理）
    setUnread("Friends", "feed", false);

    (async () => {
      await markFriendsFeedRead();
      await refreshFriendsUnreadBadge();
      await refreshFriendRequestsUnreadBadge();
    })();
  }, [
    activeRouteName,
    markFriendsFeedRead,
    refreshFriendsUnreadBadge,
    refreshFriendRequestsUnreadBadge,
  ]);

  return (
    <GlobalFrameLayout frameEnabled={frameEnabled}>
    <Tab.Navigator
      backBehavior="history"
      initialRouteName="Input"
      tabBar={(props) => <CocolonTabBar {...props} />}
      screenListeners={{
        state: (e) => {
          const st = e?.data?.state;
          const name = st?.routes?.[st?.index]?.name;
          if (!name) return;
          setActiveRouteName((prev) => (prev === name ? prev : name));
        },
      }}
      screenOptions={({ route }) => ({
        headerShown: false,
        // 中心部の左右ライン（hidden screens のときは消す）
        sceneContainerStyle: {
          backgroundColor: colors.BG_SILVER,
          borderLeftColor: colors.BORDER_GOLD,
          borderRightColor: colors.BORDER_GOLD,
          borderLeftWidth: HIDDEN_SCREENS.has(route.name)
            ? 0
            : FRAME_BORDER_WIDTH,
          borderRightWidth: HIDDEN_SCREENS.has(route.name)
            ? 0
            : FRAME_BORDER_WIDTH,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case "Input":
              iconName = "create-outline";
              break;
            case "MyWeb":
              iconName = "globe-outline";
              break;
            case "MyModel":
            case "MyProfile": // legacy alias
              iconName = "cube-outline";
              break;
            case "RankingTop":
              iconName = "trophy-outline";
              break;
            case "Friends":
              iconName = "people-outline";
              break;
            case "Settings":
              iconName = "settings-outline";
              break;
            default:
              iconName = "ellipse-outline";
          }
          const icon = (
            <Ionicons name={iconName} size={size} color={color} />
          );
          // Unread dot:
          // - MyModel tab should mirror the visible Home badge only.
          //   Screen UI currently shows only `mymodelCreate`, while scope may also contain
          //   hidden flags like `qnaNew`. Using scope-wide unread here causes
          //   “screen has no unread, but lower tab is still red”.
          // - Other tabs can keep using scope-wide unread.
          const showUnreadDot =
            route.name === "MyModel" || route.name === "MyProfile"
              ? !!getFeatureUnread("MyModel", "mymodelCreate")
              : !!getScopeUnread(route.name);

          // Keep wrapper for legacy tabs (Friends / MyWeb) to avoid layout changes.
          // For other tabs, wrap only when we actually need to show the dot.
          const shouldWrap = showUnreadDot || route.name === "Friends" || route.name === "MyWeb";
          if (!shouldWrap) return icon;

          return (
            <View
              style={{
                width: size + 10,
                height: size + 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
              {showUnreadDot ? (
                <View
                  pointerEvents="none"
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#EF4444",
                  }}
                />
              ) : null}
            </View>
          );
        },
        tabBarActiveTintColor: colors.TITLE_GOLD,
        tabBarInactiveTintColor: colors.TEXT_SUBTLE,
        tabBarStyle: {
          backgroundColor: colors.BG_SILVER,
          borderTopColor: colors.BORDER_GOLD,
          borderTopWidth: 0,
        },
        tabBarLabel: ({ focused, color }) => {
          let label;
          switch (route.name) {
            case "Input":
              label = "Home";
              break;
            case "MyWeb":
              label = "MyWeb";
              break;
            case "MyModel":
            case "MyProfile": // legacy alias
              label = "MyModel";
              break;
            case "RankingTop":
              label = "Ranking";
              break;
            case "Friends":
              label = "Friend";
              break;
            case "Settings":
              label = "Setting";
              break;
            default:
              label = route.name;
          }
          return (
            <Text
              style={{
                color,
                fontSize: 12,
                fontWeight: focused ? "700" : "400",
              }}
            >
              {label}
            </Text>
          );
        },
      })}
    >
      {/* 5つの通常タブ */}
      <Tab.Screen
        name="Input"
        component={InputStackNavigator}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => handleMainTabPress(route.name, navigation, route, e),
        })}
      />
      <Tab.Screen
        name="MyWeb"
        listeners={({ navigation, route }) => ({
          tabPress: (e) => handleMainTabPress(route.name, navigation, route, e),
        })}
      >
        {(tabProps) => (
          <MyWebStackNavigator
            {...tabProps}
            onSetMymodelLinkPayload={setMymodelLinkPayload}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="MyModel"
        listeners={({ navigation, route }) => ({
          tabPress: (e) => handleMainTabPress(route.name, navigation, route, e),
        })}
      >
        {(tabProps) => (
          <MyModelStackNavigator
            {...tabProps}
            linkPayload={mymodelLinkPayload}
            onConsumeLinkPayload={() => setMymodelLinkPayload(null)}
          />
        )}
      </Tab.Screen>

      {/* Legacy alias: keep the old route name working (hidden) */}
      <Tab.Screen
        name="MyProfile"
        options={{
          tabBarButton: () => null,
        }}
      >
        {(tabProps) => (
          <MyModelStackNavigator
            {...tabProps}
            linkPayload={mymodelLinkPayload}
            onConsumeLinkPayload={() => setMymodelLinkPayload(null)}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="RankingTop"
        component={RankingStackNavigator}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => handleMainTabPress(route.name, navigation, route, e),
        })}
      />
      <Tab.Screen
        name="Friends"
        listeners={({ navigation, route }) => ({
          tabPress: (e) => handleMainTabPress(route.name, navigation, route, e),
        })}
      >
        {(tabProps) => (
          <FriendsStackNavigator
            {...tabProps}
            hasUnreadFriendRequests={hasUnreadFriendRequests}
            onOpenFriendManage={async () => {
              // UX: モーダルを開いた瞬間に赤●を消し、裏で既読化 → 再チェック
              setUnread("Friends", "requests", false);
              await markFriendRequestsRead();
              await refreshFriendRequestsUnreadBadge();
            }}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Settings"
        component={SettingsStackNavigator}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => handleMainTabPress(route.name, navigation, route, e),
        })}
      />
</Tab.Navigator>
    </GlobalFrameLayout>
  );
}


// ------------------------------------------------------------
// Root stack navigator
// - Wrap MainTabs (bottom tabs) with a Stack so that sub-screens
//   (Account / SubscriptionSelect / Ranking details ...) can be pushed,
//   enabling proper back navigation (goBack).
// ------------------------------------------------------------

// Global frame wrapper for Stack screens (keep the same frame style as tabs)
function withGlobalFrame(ScreenComponent) {
  return function WrappedScreen(props) {
    const { colors } = useTheme();

    return (
      <GlobalFrameLayout frameEnabled={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.BG_SILVER,
            borderLeftColor: colors.BORDER_GOLD,
            borderRightColor: colors.BORDER_GOLD,
            borderLeftWidth: FRAME_BORDER_WIDTH,
            borderRightWidth: FRAME_BORDER_WIDTH,
          }}
        >
          <ScreenComponent {...props} />
        </View>
      </GlobalFrameLayout>
    );
  };
}

const AccountScreenWithFrame = withGlobalFrame(AccountScreen);
const SubscriptionSelectScreenWithFrame = withGlobalFrame(SubscriptionSelectScreen);
const FollowListScreenWithFrame = withGlobalFrame(FollowListScreen);

// Ranking screens (detail screens) with global frame
const EmotionRankingScreenWithFrame = withGlobalFrame(EmotionRankingScreen);
const InputCountRankingScreenWithFrame = withGlobalFrame(InputCountRankingScreen);
const InputLengthRankingScreenWithFrame = withGlobalFrame(InputLengthRankingScreen);
const MyModelQuestionsRankingScreenWithFrame = withGlobalFrame(MyModelQuestionsRankingScreen);
const MyModelEchoesRankingScreenWithFrame = withGlobalFrame(MyModelEchoesRankingScreen);
const MyModelDiscoveriesRankingScreenWithFrame = withGlobalFrame(MyModelDiscoveriesRankingScreen);
const LoginStreakRankingScreenWithFrame = withGlobalFrame(LoginStreakRankingScreen);

function RootStackNavigator() {
  return (
    <RootStack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
      }}
    >
      <RootStack.Screen name="MainTabs" component={MainTabs} />

      {/* Stack (sub) screens */}
      <RootStack.Screen name="Account" component={AccountScreenWithFrame} />
      <RootStack.Screen
        name="SubscriptionSelect"
        component={SubscriptionSelectScreenWithFrame}
      />
      <RootStack.Screen
        name="FollowListScreen"
        component={FollowListScreenWithFrame}
      />

      {/* ranking screens */}
      <RootStack.Screen
        name="RankingEmotion"
        component={EmotionRankingScreenWithFrame}
      />
      <RootStack.Screen
        name="RankingInputCount"
        component={InputCountRankingScreenWithFrame}
      />
      <RootStack.Screen
        name="RankingInputLength"
        component={InputLengthRankingScreenWithFrame}
      />
      <RootStack.Screen
        name="RankingMyModelQuestions"
        component={MyModelQuestionsRankingScreenWithFrame}
      />
      <RootStack.Screen
        name="RankingMyModelResonances"
        component={MyModelEchoesRankingScreenWithFrame}
      />
      <RootStack.Screen
        name="RankingMyModelDiscoveries"
        component={MyModelDiscoveriesRankingScreenWithFrame}
      />
      <RootStack.Screen
        name="RankingLoginStreak"
        component={LoginStreakRankingScreenWithFrame}
      />
    </RootStack.Navigator>
  );
}


function RootNavigator() {
  const { session, initializing, recoveryMode } = useAuth();
  const {
    isTutorialMode,
    tutorialCompleted,
    tutorialSkipped,
    setTutorialCompleted,
    setTutorialSkipped,
    startTutorial,
    skipTutorial,
  } = useTutorial();

  const [tutorialFlagsLoaded, setTutorialFlagsLoaded] = useState(false);
  const [profileTutorialCompleted, setProfileTutorialCompleted] = useState(false);
  const [profileTutorialSkipped, setProfileTutorialSkipped] = useState(false);
  const [tutorialPromptShownThisSession, setTutorialPromptShownThisSession] =
    useState(false);
  const [tutorialPromptDismissedThisSession, setTutorialPromptDismissedThisSession] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!session || recoveryMode) {
      setTutorialFlagsLoaded(false);
      setProfileTutorialCompleted(false);
      setProfileTutorialSkipped(false);
      setTutorialPromptShownThisSession(false);
      setTutorialPromptDismissedThisSession(false);
      return () => {
        cancelled = true;
      };
    }

    setTutorialFlagsLoaded(false);
    setProfileTutorialCompleted(false);
    setProfileTutorialSkipped(false);
    setTutorialPromptShownThisSession(false);
    setTutorialPromptDismissedThisSession(false);

    (async () => {
      try {
        const userId = session?.user?.id ?? null;
        if (!userId) {
          if (!cancelled) {
            setTutorialCompleted(false);
            setTutorialSkipped(false);
            setTutorialFlagsLoaded(true);
          }
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("tutorial_completed, tutorial_skipped")
          .eq("id", userId)
          .maybeSingle();

        if (error) throw error;

        if (!cancelled) {
          const nextCompleted = data?.tutorial_completed === true;
          const nextSkipped = data?.tutorial_skipped === true;

          setProfileTutorialCompleted(nextCompleted);
          setProfileTutorialSkipped(nextSkipped);
          setTutorialCompleted(nextCompleted);
          setTutorialSkipped(nextSkipped);
          setTutorialFlagsLoaded(true);
        }
      } catch (e) {
        console.warn("RootNavigator: failed to load tutorial flags", e);
        if (!cancelled) {
          setProfileTutorialCompleted(false);
          setProfileTutorialSkipped(false);
          setTutorialCompleted(false);
          setTutorialSkipped(false);
          setTutorialFlagsLoaded(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    session?.user?.id,
    recoveryMode,
    setTutorialCompleted,
    setTutorialSkipped,
  ]);

  useEffect(() => {
    if (!session || recoveryMode) return;
    if (!tutorialFlagsLoaded) return;
    if (isTutorialMode) return;
    if (profileTutorialCompleted || profileTutorialSkipped) return;
    if (tutorialPromptShownThisSession || tutorialPromptDismissedThisSession) return;

    const timer = setTimeout(() => {
      setTutorialPromptShownThisSession(true);

      Alert.alert(
        "チュートリアル",
        "初回ログイン向けチュートリアルを開始しますか？\n\n基本的な使い方を、保存されない形で体験できます。",
        [
          {
            text: "今回はしない",
            style: "cancel",
            onPress: () => {
              setTutorialPromptDismissedThisSession(true);
            },
          },
          {
            text: "今後表示しない",
            onPress: async () => {
              setTutorialPromptDismissedThisSession(true);
              setProfileTutorialSkipped(true);
              await skipTutorial();
            },
          },
          {
            text: "開始する",
            onPress: () => {
              setTutorialPromptDismissedThisSession(true);
              startTutorial();
              try {
                if (navigationRef.isReady()) {
                  navigationRef.navigate("Input");
                }
              } catch {
                // noop
              }
            },
          },
        ]
      );
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [
    isTutorialMode,
    profileTutorialCompleted,
    profileTutorialSkipped,
    recoveryMode,
    session,
    skipTutorial,
    startTutorial,
    tutorialFlagsLoaded,
    tutorialPromptDismissedThisSession,
    tutorialPromptShownThisSession,
  ]);


  // ------------------------------------------------------------
  // DEV helper: print Supabase access_token for curl testing
  // - guarded by __DEV__ so it won't run in release builds
  // ------------------------------------------------------------
  useEffect(() => {
    try {
      if (typeof __DEV__ !== "undefined" && __DEV__ && session?.access_token) {
        console.log("[DEV] Supabase access_token:", session.access_token);
      }
    } catch {
      // noop
    }
  }, [session?.access_token]);

// ------------------------------------------------------------
// IAP: 購入完了 → サーバー反映（/subscription/update）→ finishTransaction
// - ログイン中のみ起動（access_token が必要なため）
// - recoveryMode のときは止める（AuthScreen に留まる仕様と整合）
// ------------------------------------------------------------
useEffect(() => {
  if (!session || recoveryMode) {
    stopIapPurchaseObserver();
    return;
  }

  // start は async なので握っておく（UIを止めない）
  startIapPurchaseObserver().catch((e) => {
    console.log("IAP observer start failed:", e?.message || e);
  });

  return () => {
    stopIapPurchaseObserver();
  };
}, [!!session, recoveryMode]);


// ------------------------------------------------------------
// Push: device token を Supabase profiles に保存（ログイン中のみ）
// - Android 13+ は POST_NOTIFICATIONS のランタイム許可が必要
// - Token は回転する可能性があるため、起動/ログイン時に再同期し、
//   onTokenRefresh でも追従する
// ------------------------------------------------------------
useEffect(() => {
  if (!session || recoveryMode) return;

  const userId = session?.user?.id;
  if (!userId) return;

  // 1) 起動/ログイン時に1回同期
  syncPushTokenOnce({ userId }).catch((e) => {
    console.log("[push] syncPushTokenOnce failed:", e?.message || e);
  });

  // 2) Token更新に追従
  let unsubscribe = null;
  try {
    unsubscribe = startPushTokenSync({ userId });
  } catch (e) {
    console.log("[push] startPushTokenSync failed:", e?.message || e);
  }

  return () => {
    try {
      if (typeof unsubscribe === "function") unsubscribe();
    } catch {
      // noop
    }
  };
}, [session?.user?.id, recoveryMode]);


// ------------------------------------------------------------
// Push: notification tap may happen before the app finishes auth
// - If so, defer navigation until the main tabs are mounted
// ------------------------------------------------------------
useEffect(() => {
  if (!session || recoveryMode) return;

  const t = setTimeout(() => {
    tryOpenFriendsIfPending();
  }, 0);

  return () => {
    clearTimeout(t);
  };
}, [!!session, recoveryMode]);


  if (initializing) {
    // 必要であればここをSplash画面などに差し替えてOK
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  // パスワード再設定（recovery）で起動したときは、ログイン済みでも AuthScreen に留める
  if (recoveryMode) {
    return <AuthScreen />;
  }

  // ログインしていないときは AuthScreen を表示
  if (!session) {
    return <AuthScreen />;
  }

  // ログイン済みならメインタブを表示
  return <MainTabs />;
}

export default function App() {
  // ------------------------------------------------------------
  // Push: open Friends tab when user taps a push notification
  // - Works for background -> foreground and quit -> launch
  // ------------------------------------------------------------
  useEffect(() => {
    // When the app is in background and the user taps the notification
    const unsubscribeOpened = messaging().onNotificationOpenedApp(() => {
      requestOpenFriendsFromNotification();
    });

    // When the app is quit and is launched by tapping the notification
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          requestOpenFriendsFromNotification();
        }
      })
      .catch((e) => {
        console.log("[push] getInitialNotification failed:", e?.message || e);
      });

    return () => {
      try {
        if (typeof unsubscribeOpened === "function") unsubscribeOpened();
      } catch {
        // noop
      }
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
      <SubscriptionProvider>
      <TutorialProvider>
      <UnreadProvider>
      <AuthProvider>
        <NavigationContainer
          ref={navigationRef}
          onReady={() => {
            // If a notification tap happened very early, attempt navigation now.
            tryOpenFriendsIfPending();
          }}
        >
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
      </UnreadProvider>
      </TutorialProvider>
      </SubscriptionProvider>
    </ThemeProvider>
    </SafeAreaProvider>
  );
}