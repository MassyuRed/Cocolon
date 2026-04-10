import React, { useEffect, useRef, useState } from "react";
import { Text, View, ActivityIndicator, AppState, Platform, StatusBar, Alert, TouchableOpacity } from "react-native";
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
import NoticeHistoryScreen from "./screens/NoticeHistoryScreen";
import MyWebScreen from "./screens/MyWebScreen";
import MyModelScreen from "./screens/MyModelScreen";
import MyModelCreateScreen from "./screens/MyModelCreateScreen";
import MyModelReflectionsScreen from "./screens/MyModelReflectionsScreen";
import MyModelReactionHistoryScreen from "./screens/MyModelReactionHistoryScreen";
import FriendsScreen from "./screens/FriendsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SettingsAppSettingsScreen from "./screens/SettingsAppSettingsScreen";
import SettingsOtherScreen from "./screens/SettingsOtherScreen";
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
import { apiGet, apiPost, apiFetch } from "./lib/apiClient";
import UnreadBadge from "./components/UnreadBadge";

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
const SELF_STRUCTURE_LATEST_STATUS_POLL_MS = 20 * 1000;
const SELF_STRUCTURE_BANNER_AUTO_HIDE_MS = 4500;
const SCREEN_PREFETCH_MIN_INTERVAL_MS = 2 * 60 * 1000;
const SCREEN_PREFETCH_DEFER_MS = 1200;
const UNREAD_PREFETCH_MIN_INTERVAL_MS = 15 * 1000;
const FRIENDS_UNREAD_POLL_MS = 30 * 1000;

// MyModel sub-screens (treated as MyModel in the tab bar)
const MYMODEL_SUB_ROUTES = new Set(["EchoesHistoryList", "DiscoveriesHistoryList", "EchoesHistoryDetail", "DiscoveriesHistoryDetail", "MyModelCreate", "MyModelReflections", "MyModelReflectionsScreen", "MyModelReactionHistory"]);
const FRIENDS_SUB_ROUTES = new Set(["FriendLog"]);

// Frame line width
const FRAME_BORDER_WIDTH = 2;

// ------------------------------------------------------------
// Global fixed logo header (theme-aware)
// - Visible only when frameEnabled is true
// - Fonts are copied from InputScreen.js
// ------------------------------------------------------------
function GlobalFrameLayout({ children, frameEnabled, headerBottomSlot = null }) {
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
        <SafeAreaView
          edges={["top", "left", "right"]}
          style={{
            backgroundColor: colors.BG_SILVER,
            paddingTop: androidExtraTop,
          }}
        >
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

      {headerBottomSlot ? (
        <View
          style={{
            backgroundColor: colors.BG_SILVER,
            paddingTop: 8,
            paddingBottom: 6,
            paddingHorizontal: 12,
            borderLeftColor: colors.BORDER_GOLD,
            borderRightColor: colors.BORDER_GOLD,
            borderLeftWidth: frameEnabled ? FRAME_BORDER_WIDTH : 0,
            borderRightWidth: frameEnabled ? FRAME_BORDER_WIDTH : 0,
          }}
        >
          {headerBottomSlot}
        </View>
      ) : null}

      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

// ------------------------------------------------------------
// Push notification tap -> open target tab
// - Friends / Input / MyWeb を通知 data から選ぶ
// - 未知の通知は Friends にフォールバックする
// ------------------------------------------------------------
export const navigationRef = createNavigationContainerRef();

let __pendingOpenRouteFromNotification = null;

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

function canNavigateToRoute(targetName) {
  try {
    const rootState = navigationRef.getRootState();
    return hasRouteName(rootState, targetName);
  } catch {
    return false;
  }
}

function buildMyWebNotificationParams(data) {
  const now = Date.now();
  const type = String(data?.type || "").trim().toLowerCase();
  const openMode = String(data?.open_mode || "").trim();
  const reportType = String(data?.report_type || "").trim().toLowerCase();
  const selfReportType = String(data?.self_report_type || "").trim().toLowerCase();

  if (type === "report_distribution") {
    if (openMode === "reportHistory" && ["daily", "weekly", "monthly"].includes(reportType)) {
      return {
        openReportHistory: true,
        openReportHistoryType: reportType,
        openReportHistoryAt: now,
      };
    }
    if (openMode === "selfReportHistory" && selfReportType === "monthly") {
      return {
        openSelfReportHistory: true,
        openSelfReportHistoryAt: now,
      };
    }
    return {
      openDistributionHome: true,
      openDistributionHomeAt: now,
    };
  }

  if (["daily", "weekly", "monthly"].includes(reportType)) {
    return {
      openReportHistory: true,
      openReportHistoryType: reportType,
      openReportHistoryAt: now,
    };
  }

  return {
    openDistributionHome: true,
    openDistributionHomeAt: now,
  };
}

function resolveNotificationTargetRoute(remoteMessage) {
  const data = remoteMessage?.data || {};
  const type = String(data?.type || "").trim().toLowerCase();
  const screen = String(data?.screen || "").trim();

  if (type === "today_question" || screen === "Input") {
    return { name: "Input" };
  }
  if (type === "report_distribution") {
    return { name: "MyWeb", params: buildMyWebNotificationParams(data) };
  }
  if (type === "myweb_report" || screen === "MyWeb") {
    return { name: "MyWeb", params: buildMyWebNotificationParams(data) };
  }
  return { name: "Friends" };
}

function buildMyWebRootNavigationParams(params) {
  return {
    screen: "MyWeb",
    params: params || undefined,
  };
}

function tryOpenRouteIfPending() {
  const target = __pendingOpenRouteFromNotification;
  if (!target?.name) return;
  if (!navigationRef.isReady()) return;
  if (!canNavigateToRoute(target.name)) return;

  try {
    if (target.name === "MyWeb") {
      navigationRef.navigate(
        "MyWeb",
        buildMyWebRootNavigationParams(target.params)
      );
    } else {
      navigationRef.navigate(target.name, target.params || undefined);
    }
    __pendingOpenRouteFromNotification = null;
  } catch {
    // keep pending; will retry when navigation becomes ready
  }
}

function requestOpenRouteFromNotification(remoteMessage) {
  __pendingOpenRouteFromNotification = resolveNotificationTargetRoute(remoteMessage);
  tryOpenRouteIfPending();
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
      <InputStack.Screen name="NoticeHistory" component={NoticeHistoryScreen} />
      {/* Common screens (kept inside each tab stack to preserve state) */}
      <InputStack.Screen name="Account" component={AccountScreen} />
      <InputStack.Screen name="SubscriptionSelect" component={SubscriptionSelectScreen} />
      <InputStack.Screen name="FollowListScreen" component={FollowListScreen} />
    </InputStack.Navigator>
  );
}

function MyWebStackNavigator({ onSetMymodelLinkPayload, route: tabRoute }) {
  return (
    <MyWebStack.Navigator initialRouteName="MyWeb" screenOptions={{ headerShown: false }}>
      <MyWebStack.Screen name="MyWeb">
        {(navProps) => (
          <MyWebScreen
            {...navProps}
            tabRoute={tabRoute}
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
      <MyModelStack.Screen name="MyModelReactionHistory" component={MyModelReactionHistoryScreen} />
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

function FriendsStackNavigator({ hasUnreadFriendRequests, hasUnreadFriendFeed, onOpenFriendManage, onFriendFeedDisplayed }) {
  return (
    <FriendsStack.Navigator initialRouteName="Friends" screenOptions={{ headerShown: false }}>
      <FriendsStack.Screen name="Friends">
        {(navProps) => (
          <FriendsScreen
            {...navProps}
            screenMode="top"
            hasUnreadFriendRequests={hasUnreadFriendRequests}
            hasUnreadFriendFeed={hasUnreadFriendFeed}
            onOpenFriendManage={onOpenFriendManage}
            onFriendFeedDisplayed={onFriendFeedDisplayed}
          />
        )}
      </FriendsStack.Screen>
      <FriendsStack.Screen name="FriendLog">
        {(navProps) => (
          <FriendsScreen
            {...navProps}
            screenMode="log"
            hasUnreadFriendRequests={hasUnreadFriendRequests}
            hasUnreadFriendFeed={hasUnreadFriendFeed}
            onOpenFriendManage={onOpenFriendManage}
            onFriendFeedDisplayed={onFriendFeedDisplayed}
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
  const { colors } = useTheme();

  return (
    <SettingsStack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.PANEL_BG },
      }}
    >
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="SettingsAppSettings" component={SettingsAppSettingsScreen} />
      <SettingsStack.Screen name="SettingsOther" component={SettingsOtherScreen} />

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

  const { isPaid, loading: subscriptionLoading } = useSubscription();
  const { isTutorialMode } = useTutorial();
  const [isAppActive, setIsAppActive] = useState(
    () => (AppState?.currentState || "active") === "active"
  );
  const [selfStructureBanner, setSelfStructureBanner] = useState({
    visible: false,
    reportMode: "standard",
  });
  const selfStructureBannerHideTimerRef = useRef(null);
  const selfStructureLatestVersionRef = useRef(null);
  const selfStructureLatestInitializedRef = useRef(false);
  const myWebUnreadRefreshSeqRef = useRef(0);

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
      n.startsWith("Ranking")
        ? "RankingTop"
        : n === "MyProfile" || MYMODEL_SUB_ROUTES.has(n)
          ? "MyModel"
          : FRIENDS_SUB_ROUTES.has(n)
            ? "Friends"
            : n;

    // If the current route is not one of the main tabs (Account, SubscriptionSelect, etc),
    // TabBar treats it as "Input" active. Mirror that here.
    return MAIN_TAB_ROUTES.has(effective) ? effective : "Input";
  }, []);

  const showTabUnreadBadge = React.useCallback(
    (routeName) => {
      if (routeName === "MyModel" || routeName === "MyProfile") {
        return !!(
          getFeatureUnread("MyModel", "mymodelCreate") ||
          (!isTutorialMode &&
            getFeatureUnread("MyModel", "reflectionsNew"))
        );
      }
      return !!getScopeUnread(routeName);
    },
    [getFeatureUnread, getScopeUnread, isTutorialMode]
  );

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

        // MyWeb keeps part of its sub-navigation in screen-local state (`MyWebScreen.route`).
        // Re-selecting the tab must therefore signal the screen to reset to "home",
        // not only pop the navigator stack.
        if (pressedTabName === "MyWeb") {
          try {
            e?.preventDefault?.();
          } catch {
            // noop
          }

          if (nestedIndex > 0) {
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
              try {
                navigation?.navigate?.(pressedTabName);
              } catch {
                // noop
              }
            }
          }

          try {
            navigation?.navigate?.("MyWeb", {
              openDistributionHome: true,
              openDistributionHomeAt: Date.now(),
            });
          } catch {
            // noop
          }
          return;
        }

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
  const hasUnreadFriendFeed = !!getFeatureUnread("Friends", "feed");


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
const __lastUnreadPrefetchAtRef = React.useRef(0);
const screenPrefetchTimerRef = React.useRef(null);

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
    const res = await apiFetch(url, {
      method: "POST",
      auth: false,
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
      const res = await apiFetch(url, {
        method: "GET",
        auth: false,
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

const refreshMyModelReflectionsUnreadBadge = React.useCallback(async () => {
  try {
    if (isTutorialMode) {
      setUnread("MyModel", "reflectionsNew", false);
      setUnread("MyModel", "qnaNew", false);
      return;
    }

    const json = await apiGet("/mymodel/qna/unread-status");
    const hasUnread =
      typeof json?.has_unread === "boolean"
        ? json.has_unread
        : typeof json?.hasUnread === "boolean"
        ? json.hasUnread
        : false;

    setUnread("MyModel", "reflectionsNew", !!hasUnread);
    setUnread("MyModel", "qnaNew", false);
  } catch (e) {
    // best-effort (don't crash the app due to badge)
    setUnread("MyModel", "reflectionsNew", false);
    setUnread("MyModel", "qnaNew", false);
  }
}, [isTutorialMode, setUnread]);

  // ------------------------------------------------------------
  // Unread badge (MyWeb tab: reports)
  // - For "MyWeb" tab red dot, even before opening MyWeb screen.
  // - This mirrors MyWebScreen's unread badge logic (best-effort).
  // ------------------------------------------------------------
  const refreshMyWebReportsUnreadBadge = React.useCallback(async () => {
    const refreshSeq = ++myWebUnreadRefreshSeqRef.current;
    const isStale = () => refreshSeq !== myWebUnreadRefreshSeqRef.current;

    const applyBaseUnread = (unread) => {
      if (isStale()) return;
      try {
        clearScope("MyWeb");
      } catch {
        // noop
      }
      setUnreadGroup("MyWeb", {
        daily: !!unread?.daily,
        weekly: !!unread?.weekly,
        monthly: !!unread?.monthly,
        selfStructure: false,
      });
    };

    const applySelfStructureUnread = (value) => {
      if (isStale()) return;
      setUnreadGroup("MyWeb", {
        selfStructure: !!value,
      });
    };

    const baseQuery = new URLSearchParams({
      // Keep in sync with MyWebScreen.refreshUnreadBadges(): show daily/weekly/monthly first.
      limit: "1",
      include_self_structure: "false",
    }).toString();

    const selfStructureQuery = new URLSearchParams({
      limit: "1",
      include_self_structure: "true",
    }).toString();

    const selfStructurePromise = isPaid
      ? apiGet(`/report-reads/myweb-unread-status?${selfStructureQuery}`)
          .then((json) => !!json?.unread_by_type?.selfStructure)
          .catch((e) => {
            console.warn("MainTabs: failed to refresh MyWeb self-structure unread badge", e);
            return null;
          })
      : Promise.resolve(false);

    try {
      const json = await apiGet(`/report-reads/myweb-unread-status?${baseQuery}`);
      const unread = json?.unread_by_type || {};
      applyBaseUnread(unread);
    } catch (e) {
      if (isStale()) return;
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
      return;
    }

    const selfStructureUnread = await selfStructurePromise;
    if (selfStructureUnread == null) return;
    applySelfStructureUnread(selfStructureUnread);
  }, [isPaid, setUnreadGroup, clearScope]);

  const refreshFriendsUnreadState = React.useCallback(async () => {
    try {
      const json = await apiGet("/friends/unread-status");
      const nextFeed = !!json?.feed_unread;
      const nextRequests = !!json?.requests_unread;
      setUnread("Friends", "feed", nextFeed);
      setUnread("Friends", "requests", nextRequests);
      return {
        feed: nextFeed,
        requests: nextRequests,
      };
    } catch (e) {
      console.warn("MainTabs: failed to refresh Friends unread state", e);
      setUnread("Friends", "feed", false);
      setUnread("Friends", "requests", false);
      return null;
    }
  }, [setUnread]);


  const refreshFriendsUnreadBadge = React.useCallback(async () => {
    const next = await refreshFriendsUnreadState();
    return !!next?.feed;
  }, [refreshFriendsUnreadState]);


  const refreshFriendRequestsUnreadBadge = React.useCallback(async () => {
    const next = await refreshFriendsUnreadState();
    return !!next?.requests;
  }, [refreshFriendsUnreadState]);

  const markFriendRequestsRead = React.useCallback(async () => {
    try {
      await apiPost("/friends/unread/read-requests", {});
    } catch (e) {
      console.warn("MainTabs: failed to mark Friend requests read", e);
    }
  }, []);

  const markFriendsFeedRead = React.useCallback(async (lastSeenCreatedAt = null) => {
    try {
      const body = lastSeenCreatedAt
        ? { last_seen_created_at: lastSeenCreatedAt }
        : {};
      await apiPost("/friends/unread/read-feed", body);
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

      try {
        const fresh = getPrefetchEntryFresh?.("Friends", "feed", PREFETCH_MAX_AGE_MS);
        if (fresh?.value?.userId && String(fresh.value.userId) === String(userId)) {
          return;
        }
      } catch {
        // noop
      }

      const json = await apiGet("/friends/feed");
      const rows = Array.isArray(json?.items)
        ? json.items
        : Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json)
        ? json
        : [];

      const mapped = rows.map((row) => ({
        id: row?.id,
        ownerName: row?.ownerName || row?.owner_name || "Friend",
        items: Array.isArray(row?.items) ? row.items : [],
        timeLabel: row?.timeLabel || formatTimeLabel(row?.created_at || row?.createdAt || null),
        createdAt: row?.createdAt || row?.created_at || null,
      }));

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

      try {
        const fresh = getPrefetchEntryFresh?.("Friends", "manage", PREFETCH_MAX_AGE_MS);
        if (fresh?.value?.userId && String(fresh.value.userId) === String(userId)) {
          return;
        }
      } catch {
        // noop
      }

      const json = await apiGet("/friends/manage");
      const payload = json && typeof json === "object" ? json : {};

      try {
        setPrefetch("Friends", "manage", {
          userId,
          myProfile: payload?.myProfile || null,
          friendsList: Array.isArray(payload?.friendsList) ? payload.friendsList : [],
          incoming: Array.isArray(payload?.incoming) ? payload.incoming : [],
          outgoing: Array.isArray(payload?.outgoing) ? payload.outgoing : [],
          friendNotifMap:
            payload?.friendNotifMap && typeof payload.friendNotifMap === "object"
              ? payload.friendNotifMap
              : {},
          incomingPendingCount: Number(payload?.incomingPendingCount || 0) || 0,
        });
      } catch {
        // noop
      }
    } catch (e) {
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
        const trendingMode = "overall";
        const trendingCacheKey = `trending:${trendingMode}`;
        const fresh = getPrefetchEntryFresh?.("MyModel", trendingCacheKey, PREFETCH_MAX_AGE_MS);
        const isFresh =
          !!fresh?.value?.userId && String(fresh.value.userId) === String(userId);

        if (!isFresh) {
          const params = new URLSearchParams();
          params.append("limit", "20");
          params.append("mode", trendingMode);
          const url = `${MYMODEL_API_BASE_URL}/mymodel/qna/trending?${params.toString()}`;
          const res = await apiFetch(url, { method: "GET", auth: false, headers });
          const json = await res.json().catch(() => null);
          if (res.ok) {
            const items = Array.isArray(json?.items) ? json.items : [];
            setPrefetch("MyModel", trendingCacheKey, { userId, items });
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
          const res = await apiFetch(url, { method: "GET", auth: false, headers });
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
          const res = await apiFetch(url, { method: "GET", auth: false, headers });
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

  const runAllScreenPrefetch = React.useCallback(async () => {
    try {
      const now = Date.now();
      const last = Number(__lastScreenPrefetchAtRef.current || 0) || 0;

      // Keep screen prefetch aligned with cache freshness so resume/focus spikes do not flood the API.
      if (now - last < SCREEN_PREFETCH_MIN_INTERVAL_MS) return;

      __lastScreenPrefetchAtRef.current = now;

      const tasks = [
        prefetchFriendsFeed,
        prefetchFriendsManageData,
        prefetchMyModelScreenData,
      ];

      for (const fn of tasks) {
        try {
          // Run sequentially to avoid burst-loading many endpoints at once.
          await fn();
        } catch {
          // noop
        }
      }
    } catch {
      // noop
    }
  }, [prefetchFriendsFeed, prefetchFriendsManageData, prefetchMyModelScreenData]);

  // ------------------------------------------------------------
  // Unread badge: prefetch template
  // - Keep lightweight badge refresh immediate.
  // - Defer heavier screen prefetch slightly so app resume does not spike all APIs at once.
  // ------------------------------------------------------------
  const runAllUnreadPrefetch = React.useCallback((opts = {}) => {
    const includeScreenPrefetch = opts?.includeScreenPrefetch !== false;

    // best-effort: never crash the app due to badge refresh
    try {
      pingActivityLogin();
    } catch {
      // noop
    }

    try {
      const now = Date.now();
      const last = Number(__lastUnreadPrefetchAtRef.current || 0) || 0;
      if (now - last < UNREAD_PREFETCH_MIN_INTERVAL_MS) {
        return;
      }
      __lastUnreadPrefetchAtRef.current = now;
    } catch {
      // noop
    }

    const tasks = [
      refreshFriendsUnreadState,
      refreshMyModelCreateUnreadBadge,
      refreshMyModelReflectionsUnreadBadge,
      refreshMyWebReportsUnreadBadge,
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

    if (includeScreenPrefetch) {
      try {
        if (screenPrefetchTimerRef.current) {
          clearTimeout(screenPrefetchTimerRef.current);
        }
      } catch {
        // noop
      }
      screenPrefetchTimerRef.current = setTimeout(() => {
        Promise.resolve()
          .then(() => runAllScreenPrefetch())
          .catch(() => null)
          .finally(() => {
            screenPrefetchTimerRef.current = null;
          });
      }, SCREEN_PREFETCH_DEFER_MS);
    }
  }, [
    pingActivityLogin,
    refreshFriendsUnreadState,
    refreshMyModelCreateUnreadBadge,
    refreshMyModelReflectionsUnreadBadge,
    refreshMyWebReportsUnreadBadge,
    runAllScreenPrefetch,
  ]);

  const clearSelfStructureBannerTimer = React.useCallback(() => {
    try {
      if (selfStructureBannerHideTimerRef.current) {
        clearTimeout(selfStructureBannerHideTimerRef.current);
      }
    } catch {
      // noop
    }
    selfStructureBannerHideTimerRef.current = null;
  }, []);

  const hideSelfStructureBanner = React.useCallback(() => {
    clearSelfStructureBannerTimer();
    setSelfStructureBanner((prev) =>
      prev.visible ? { ...prev, visible: false } : prev
    );
  }, [clearSelfStructureBannerTimer]);

  const showSelfStructureBanner = React.useCallback(
    (reportMode = "standard") => {
      clearSelfStructureBannerTimer();
      setSelfStructureBanner({
        visible: true,
        reportMode: reportMode === "deep" ? "deep" : "standard",
      });
      selfStructureBannerHideTimerRef.current = setTimeout(() => {
        setSelfStructureBanner((prev) => ({ ...prev, visible: false }));
      }, SELF_STRUCTURE_BANNER_AUTO_HIDE_MS);
    },
    [clearSelfStructureBannerTimer]
  );

  const openSelfStructureLatestFromBanner = React.useCallback(() => {
    const reportMode = selfStructureBanner.reportMode === "deep" ? "deep" : "standard";
    hideSelfStructureBanner();
    try {
      if (navigationRef.isReady()) {
        navigationRef.navigate(
          "MyWeb",
          buildMyWebRootNavigationParams({
            openSelfReportLatest: true,
            openSelfReportLatestMode: reportMode,
            openSelfReportLatestAt: Date.now(),
          })
        );
      }
    } catch {
      // noop
    }
  }, [hideSelfStructureBanner, selfStructureBanner.reportMode]);

  useEffect(() => {
    return () => {
      clearSelfStructureBannerTimer();
    };
  }, [clearSelfStructureBannerTimer]);

  useEffect(() => {
    return () => {
      try {
        if (screenPrefetchTimerRef.current) {
          clearTimeout(screenPrefetchTimerRef.current);
        }
      } catch {
        // noop
      }
    };
  }, []);

  useEffect(() => {
    const handler = (state) => {
      setIsAppActive(state === "active");
    };

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
  }, []);

  useEffect(() => {
    if (subscriptionLoading) return;
    if (isPaid) return;

    hideSelfStructureBanner();
    selfStructureLatestInitializedRef.current = false;
    selfStructureLatestVersionRef.current = null;
  }, [hideSelfStructureBanner, isPaid, subscriptionLoading]);

  const refreshSelfStructureLatestStatus = React.useCallback(async () => {
    if (subscriptionLoading || !isPaid || !isAppActive) return;

    try {
      const json = await apiGet("/myprofile/latest/status");
      const nextVersionKey = String(json?.version_key || "").trim() || null;
      const hasVisibleContent = !!json?.has_visible_content;
      const reportMode =
        String(json?.saved_report_mode || "").trim().toLowerCase() === "deep"
          ? "deep"
          : "standard";

      if (!selfStructureLatestInitializedRef.current) {
        selfStructureLatestInitializedRef.current = true;
        selfStructureLatestVersionRef.current = nextVersionKey;
        return;
      }

      if ((selfStructureLatestVersionRef.current || null) !== nextVersionKey) {
        selfStructureLatestVersionRef.current = nextVersionKey;
        if (nextVersionKey && hasVisibleContent) {
          showSelfStructureBanner(reportMode);
        }
      }
    } catch {
      // noop
    }
  }, [isAppActive, isPaid, showSelfStructureBanner, subscriptionLoading]);

  useEffect(() => {
    if (subscriptionLoading || !isPaid || !isAppActive) return undefined;

    let intervalId = null;
    const tick = () => {
      refreshSelfStructureLatestStatus().catch(() => null);
    };

    tick();
    intervalId = setInterval(tick, SELF_STRUCTURE_LATEST_STATUS_POLL_MS);

    return () => {
      try {
        if (intervalId) clearInterval(intervalId);
      } catch {
        // noop
      }
    };
  }, [isAppActive, isPaid, refreshSelfStructureLatestStatus, subscriptionLoading]);

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


  // Friend requests: API polling updates
  // - Keep tab badge fresh without direct realtime table subscription from RN.
  useEffect(() => {
    let cancelled = false;
    let intervalId = null;

    const tick = async () => {
      if (cancelled) return;
      try {
        await refreshFriendsUnreadState();
      } catch {
        // noop
      }
    };

    tick();
    intervalId = setInterval(tick, FRIENDS_UNREAD_POLL_MS);

    return () => {
      cancelled = true;
      try {
        if (intervalId) clearInterval(intervalId);
      } catch {
        // noop
      }
    };
  }, [refreshFriendsUnreadState]);


  // Friends を開いた時点では既読を進めず、まず最新状態だけ確認する。
  // 既読化そのものは FriendsScreen 側で「表示後」に行う。
  useEffect(() => {
    if (activeRouteName !== "Friends") return;

    (async () => {
      await refreshFriendsUnreadState();
    })();
  }, [activeRouteName, refreshFriendsUnreadState]);

  const selfStructureBannerHud = selfStructureBanner.visible ? (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={openSelfStructureLatestFromBanner}
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.BORDER_GOLD,
        backgroundColor: colors.PANEL_BG,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        shadowColor: "#000000",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      }}
    >
      <Ionicons
        name="notifications-outline"
        size={18}
        color={colors.TITLE_GOLD}
        style={{ marginRight: 10 }}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: colors.TEXT_ON_LIGHT,
            fontSize: 13,
            fontWeight: "700",
          }}
        >
          自己構造分析レポートが更新されました
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.TEXT_SUBTLE} />
    </TouchableOpacity>
  ) : null;

  return (
    <GlobalFrameLayout
      frameEnabled={frameEnabled}
      headerBottomSlot={selfStructureBannerHud}
    >
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
          const showUnreadBadge = showTabUnreadBadge(route.name);

          // Keep wrapper for legacy tabs (Friends / MyWeb) to avoid layout changes.
          // For other tabs, wrap only when we actually need to show the badge.
          const shouldWrap =
            showUnreadBadge || route.name === "Friends" || route.name === "MyWeb";
          if (!shouldWrap) return icon;

          return (
            <View
              style={{
                width: size + (showUnreadBadge ? 22 : 10),
                height: size + (showUnreadBadge ? 12 : 10),
                alignItems: "center",
                justifyContent: "center",
                overflow: "visible",
              }}
            >
              {icon}
              {showUnreadBadge ? (
                <UnreadBadge
                  variant="new"
                  label="NEW"
                  style={{
                    position: "absolute",
                    top: 0,
                    right: -8,
                    minHeight: 12,
                    paddingHorizontal: 4,
                    paddingVertical: 1,
                  }}
                  textStyle={{
                    fontSize: 7.5,
                    lineHeight: 8.5,
                    fontWeight: "800",
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
          const showUnreadBadge = showTabUnreadBadge(route.name);
          const labelColor =
            focused || !showUnreadBadge ? color : colors.TEXT_ON_LIGHT;
          return (
            <Text
              style={{
                color: labelColor,
                fontSize: 12,
                fontWeight: focused || showUnreadBadge ? "700" : "400",
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
            hasUnreadFriendFeed={hasUnreadFriendFeed}
            onOpenFriendManage={async () => {
              // UX: モーダルを開いた瞬間に赤●を消し、裏で既読化 → 再チェック
              setUnread("Friends", "requests", false);
              await markFriendRequestsRead();
              await refreshFriendsUnreadState();
            }}
            onFriendFeedDisplayed={async (lastSeenCreatedAt) => {
              await markFriendsFeedRead(lastSeenCreatedAt || null);
              await refreshFriendsUnreadState();
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
  const { subscriptionBootstrapLoaded } = useSubscription();
  const {
    setTutorialFlagsLoaded,
    setTutorialCompleted,
    setTutorialSkipped,
  } = useTutorial();

  useEffect(() => {
    let cancelled = false;

    if (!session || recoveryMode) {
      setTutorialCompleted(false);
      setTutorialSkipped(false);
      setTutorialFlagsLoaded(false);
      return () => {
        cancelled = true;
      };
    }

    setTutorialFlagsLoaded(false);

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

        const json = await apiGet("/account/profile/me");

        if (!cancelled) {
          const nextCompleted = json?.tutorial_completed === true;
          const nextSkipped = json?.tutorial_skipped === true;

          setTutorialCompleted(nextCompleted);
          setTutorialSkipped(nextSkipped);
          setTutorialFlagsLoaded(true);
        }
      } catch (e) {
        console.warn("RootNavigator: failed to load tutorial flags", e);
        if (!cancelled) {
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
    setTutorialFlagsLoaded,
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
  if (!session || recoveryMode || !subscriptionBootstrapLoaded) {
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
}, [!!session, recoveryMode, subscriptionBootstrapLoaded]);


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
    tryOpenRouteIfPending();
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
  const bootstrapAlertShownRef = useRef(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const json = await apiGet("/app/bootstrap", { auth: false });
        const message = String(json?.maintenance_message || "").trim();

        if (alive && message && !bootstrapAlertShownRef.current) {
          bootstrapAlertShownRef.current = true;
          Alert.alert("お知らせ", message);
        }
      } catch (e) {
        console.log("[bootstrap] fetch failed:", e?.message || e);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // ------------------------------------------------------------
  // Push: open the target screen when user taps a push notification
  // - Works for background -> foreground and quit -> launch
  // ------------------------------------------------------------
  useEffect(() => {
    // When the app is in background and the user taps the notification
    const unsubscribeOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
      requestOpenRouteFromNotification(remoteMessage);
    });

    // When the app is quit and is launched by tapping the notification
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          requestOpenRouteFromNotification(remoteMessage);
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
            tryOpenRouteIfPending();
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
