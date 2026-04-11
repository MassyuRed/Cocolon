import React, { useEffect, useRef, useState } from "react";
import { Text, View, ActivityIndicator, AppState, Platform, StatusBar, Alert, TouchableOpacity, Linking } from "react-native";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { NavigationContainer, createNavigationContainerRef, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createBottomTabNavigator,
  BottomTabBar,
} from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";

import { AuthProvider, useAuth } from "./AuthContext";
import AuthScreen from "./AuthScreen";

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
import AccountScreen from "./screens/AccountScreen";
import SubscriptionSelectScreen from "./screens/SubscriptionSelectScreen";
import FollowListScreen from "./screens/FollowListScreen";
import EchoesHistoryListScreen from "./screens/EchoesHistoryListScreen";
import DiscoveriesHistoryListScreen from "./screens/DiscoveriesHistoryListScreen";
import EchoesHistoryDetailScreen from "./screens/EchoesHistoryDetailScreen";
import DiscoveriesHistoryDetailScreen from "./screens/DiscoveriesHistoryDetailScreen";

import RankingTopScreen from "./screens/RankingTopScreen";
import EmotionRankingScreen from "./screens/EmotionRankingScreen";
import InputCountRankingScreen from "./screens/InputCountRankingScreen";
import InputLengthRankingScreen from "./screens/InputLengthRankingScreen";
import MyModelEchoesRankingScreen from "./screens/MyModelEchoesRankingScreen";
import MyModelDiscoveriesRankingScreen from "./screens/MyModelDiscoveriesRankingScreen";
import MyModelQuestionsRankingScreen from "./screens/MyModelQuestionsRankingScreen";
import LoginStreakRankingScreen from "./screens/LoginStreakRankingScreen";
import { ThemeProvider, useTheme } from "./theme/ThemeContext";
import { UnreadProvider, useUnread } from "./UnreadContext";
import { SubscriptionProvider, useSubscription } from "./SubscriptionContext";
import { TutorialProvider, useTutorial } from "./TutorialContext";

import { startIapPurchaseObserver, stopIapPurchaseObserver } from "./lib/iap/iapService";
import { startPushTokenSync, syncPushTokenOnce } from "./lib/pushToken";
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
  } catch {}

  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error) {
      return data?.user?.id ?? null;
    }
  } catch {}

  return null;
}

const HIDDEN_SCREENS = new Set([]);
const MAIN_TAB_ROUTES = new Set(["Input", "MyWeb", "MyModel", "RankingTop", "Friends", "Settings"]);
const SELF_STRUCTURE_LATEST_STATUS_POLL_MS = 20 * 1000;
const SELF_STRUCTURE_BANNER_AUTO_HIDE_MS = 4500;
const SCREEN_PREFETCH_MIN_INTERVAL_MS = 2 * 60 * 1000;
const SCREEN_PREFETCH_DEFER_MS = 1200;
const UNREAD_PREFETCH_MIN_INTERVAL_MS = 15 * 1000;
const FRIENDS_UNREAD_POLL_MS = 30 * 1000;
const MYWEB_STARTUP_WARMUP_MIN_INTERVAL_MS = 60 * 1000;
const MYWEB_STARTUP_REVALIDATE_DELAY_MS = 1800;
const MYWEB_SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY = "cocolon:selfStructureLatestSeenVersion";
const MYWEB_SELF_STRUCTURE_HISTORY_FETCH_LIMIT = 200;
const MYWEB_REPORT_READ_STATUS_CHUNK_SIZE = 60;

const SHARE_PROFILE_API_BASE_URL =
  (process.env.EXPO_PUBLIC_MYMODEL_API_URL || "https://mashos-api.onrender.com").replace(/\/+$/, "");
const APP_LINK_PREFIXES = ["cocolon://", "https://emlis.app", "http://emlis.app"];

const MYMODEL_SUB_ROUTES = new Set(["EchoesHistoryList", "DiscoveriesHistoryList", "EchoesHistoryDetail", "DiscoveriesHistoryDetail", "MyModelCreate", "MyModelReflections", "MyModelReflectionsScreen", "MyModelReactionHistory"]);
const FRIENDS_SUB_ROUTES = new Set(["FriendLog"]);
const FRAME_BORDER_WIDTH = 2;

function GlobalFrameLayout({ children, frameEnabled, headerBottomSlot = null }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
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
              paddingVertical: 6,
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
      navigationRef.navigate("MyWeb", buildMyWebRootNavigationParams(target.params));
    } else {
      navigationRef.navigate(target.name, target.params || undefined);
    }
    __pendingOpenRouteFromNotification = null;
  } catch {}
}

function requestOpenRouteFromNotification(remoteMessage) {
  __pendingOpenRouteFromNotification = resolveNotificationTargetRoute(remoteMessage);
  tryOpenRouteIfPending();
}

function extractFriendCodeFromIncomingUrl(rawUrl) {
  const url = String(rawUrl || "").trim();
  if (!url) return "";

  const patterns = [
    /^https?:\/\/emlis\.app\/u\/([^/?#]+)/i,
    /^cocolon:\/\/u\/([^/?#]+)/i,
    /^cocolon:\/\/emlis\.app\/u\/([^/?#]+)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      try {
        return decodeURIComponent(match[1]);
      } catch {
        return match[1];
      }
    }
  }

  return "";
}

async function resolveSharedProfileUserId(friendCode) {
  const code = String(friendCode || "").trim();
  if (!code) return null;

  try {
    const url = `${SHARE_PROFILE_API_BASE_URL}/public/profile/by-friend-code?code=${encodeURIComponent(code)}`;
    const res = await apiFetch(url, {
      method: "GET",
      auth: false,
      headers: { accept: "application/json" },
    });

    if (!res.ok) return null;

    const json = await res.json().catch(() => null);
    const userId = String(json?.user_id || "").trim();
    return userId || null;
  } catch (e) {
    console.warn("resolveSharedProfileUserId error:", e);
    return null;
  }
}

function requestOpenSharedAccountRoute(viewedUserId) {
  const userId = String(viewedUserId || "").trim();
  if (!userId) return;

  __pendingOpenRouteFromNotification = {
    name: "MyModel",
    params: {
      screen: "Account",
      params: { viewedUserId: userId },
    },
  };

  tryOpenRouteIfPending();
}

async function handleIncomingAppUrl(rawUrl) {
  const friendCode = extractFriendCodeFromIncomingUrl(rawUrl);
  if (!friendCode) return false;

  const userId = await resolveSharedProfileUserId(friendCode);
  if (!userId) return true;

  requestOpenSharedAccountRoute(userId);
  return true;
}

const appLinking = {
  prefixes: APP_LINK_PREFIXES,
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (!url) return null;

    const handled = await handleIncomingAppUrl(url);
    return handled ? null : url;
  },
  subscribe(listener) {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      Promise.resolve(handleIncomingAppUrl(url))
        .then((handled) => {
          if (!handled) listener(url);
        })
        .catch(() => {
          listener(url);
        });
    });

    return () => {
      try {
        subscription?.remove?.();
      } catch {}
    };
  },
};

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

  if (HIDDEN_SCREENS.has(currentRoute.name)) {
    return null;
  }

  const filteredRoutes = state.routes.filter((route) => MAIN_TAB_ROUTES.has(route.name));
  const activeIndex = Math.max(0, filteredRoutes.findIndex((r) => r.name === effectiveRouteName));
  const filteredState = {
    ...state,
    routes: filteredRoutes,
    index: activeIndex,
  };

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

function InputStackNavigator() {
  return (
    <InputStack.Navigator initialRouteName="Input" screenOptions={{ headerShown: false }}>
      <InputStack.Screen name="Input" component={InputScreen} />
      <InputStack.Screen name="CocolonGuide" component={CocolonGuideScreen} />
      <InputStack.Screen name="NoticeHistory" component={NoticeHistoryScreen} />
      <InputStack.Screen name="Account" component={AccountScreen} />
      <InputStack.Screen name="SubscriptionSelect" component={SubscriptionSelectScreen} />
      <InputStack.Screen name="FollowListScreen" component={FollowListScreen} />
    </InputStack.Navigator>
  );
}

function MyWebStackNavigator({ onSetMymodelLinkPayload, onRefreshTabUnread, route: tabRoute }) {
  return (
    <MyWebStack.Navigator initialRouteName="MyWeb" screenOptions={{ headerShown: false }}>
      <MyWebStack.Screen name="MyWeb">
        {(navProps) => (
          <MyWebScreen
            {...navProps}
            tabRoute={tabRoute}
            onRefreshTabUnread={onRefreshTabUnread}
            onOpenMyProfile={(payload) => {
              try {
                onSetMymodelLinkPayload?.(payload || null);
              } catch {}
              try {
                navProps?.navigation?.navigate("MyModel");
              } catch {}
            }}
            onOpenSubscription={() => {
              try {
                navProps?.navigation?.navigate("SubscriptionSelect");
              } catch {}
            }}
          />
        )}
      </MyWebStack.Screen>
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
              try {
                navProps?.navigation?.navigate("SubscriptionSelect");
              } catch {}
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
              } catch {}
              try {
                navProps?.navigation?.navigate("MyModel");
              } catch {}
            }}
            onOpenSubscription={() => {
              try {
                navProps?.navigation?.navigate("SubscriptionSelect");
              } catch {}
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
    getPrefetchEntryFresh,
    setPrefetch,
    applyStartupSnapshot,
  } = useUnread();

  const { isPaid, loading: subscriptionLoading } = useSubscription();
  const { isTutorialMode } = useTutorial();
  const [isAppActive, setIsAppActive] = useState(() => (AppState?.currentState || "active") === "active");
  const [selfStructureBanner, setSelfStructureBanner] = useState({ visible: false, reportMode: "standard" });
  const selfStructureBannerHideTimerRef = useRef(null);
  const selfStructureLatestVersionRef = useRef(null);
  const selfStructureLatestInitializedRef = useRef(false);
  const myWebUnreadRefreshSeqRef = useRef(0);
  const myWebUnreadStateRef = useRef({
    daily: false,
    weekly: false,
    monthly: false,
    selfStructure: false,
  });
  const myWebStartupWarmupLastRunAtRef = useRef(0);
  const myWebStartupWarmupTimerRef = useRef(null);
  const myWebStartupWarmupSeqRef = useRef(0);
  const myWebSubscriptionRefreshPendingRef = useRef(false);

  const [activeRouteName, setActiveRouteName] = useState("Input");
  const frameEnabled = !HIDDEN_SCREENS.has(activeRouteName);
  const [mymodelLinkPayload, setMymodelLinkPayload] = useState(null);

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
    return MAIN_TAB_ROUTES.has(effective) ? effective : "Input";
  }, []);

  const showTabUnreadBadge = React.useCallback(
    (routeName) => {
      if (routeName === "MyModel" || routeName === "MyProfile") {
        return !!(
          getFeatureUnread("MyModel", "mymodelCreate") ||
          (!isTutorialMode && getFeatureUnread("MyModel", "reflectionsNew"))
        );
      }
      return !!getScopeUnread(routeName);
    },
    [getFeatureUnread, getScopeUnread, isTutorialMode]
  );

  const handleMainTabPress = React.useCallback(
    (pressedTabName, navigation, route, e) => {
      const currentRoute = typeof activeRouteName === "string" ? activeRouteName : "";
      const currentActiveTab = getTabBarActiveName(currentRoute);
      if (currentActiveTab === pressedTabName && currentRoute !== pressedTabName) {
        try { e?.preventDefault?.(); } catch {}
        try { navigation?.navigate?.(pressedTabName); } catch {}
        return;
      }

      try {
        const isFocused = !!navigation?.isFocused?.();
        if (!isFocused) return;
        const nestedState = route?.state;
        const nestedIndex = typeof nestedState?.index === "number" ? nestedState.index : 0;

        if (pressedTabName === "MyWeb") {
          try { e?.preventDefault?.(); } catch {}
          if (nestedIndex > 0) {
            const targetKey = nestedState?.key;
            if (targetKey) {
              try {
                navigation?.dispatch?.({ ...StackActions.popToTop(), target: targetKey });
              } catch {}
            } else {
              try { navigation?.navigate?.(pressedTabName); } catch {}
            }
          }
          try {
            navigation?.navigate?.("MyWeb", { openDistributionHome: true, openDistributionHomeAt: Date.now() });
          } catch {}
          return;
        }

        if (nestedIndex > 0) {
          try { e?.preventDefault?.(); } catch {}
          const targetKey = nestedState?.key;
          if (targetKey) {
            try {
              navigation?.dispatch?.({ ...StackActions.popToTop(), target: targetKey });
            } catch {}
          } else {
            try { navigation?.navigate?.(pressedTabName); } catch {}
          }
        }
      } catch {}
    },
    [activeRouteName, getTabBarActiveName]
  );

  const hasUnreadFriendRequests = !!getFeatureUnread("Friends", "requests");
  const hasUnreadFriendFeed = !!getFeatureUnread("Friends", "feed");

  useEffect(() => {
    myWebUnreadStateRef.current = {
      daily: !!getFeatureUnread("MyWeb", "daily"),
      weekly: !!getFeatureUnread("MyWeb", "weekly"),
      monthly: !!getFeatureUnread("MyWeb", "monthly"),
      selfStructure: !!getFeatureUnread("MyWeb", "selfStructure"),
    };
  }, [getFeatureUnread]);

  const applyMyWebUnreadPatch = React.useCallback((patch, options = {}) => {
    const preserveTruthyKeys = options?.preserveTruthyKeys === true;
    const targetKeys = Array.isArray(options?.keys) && options.keys.length > 0
      ? options.keys
      : ["daily", "weekly", "monthly", "selfStructure"];

    const prev = myWebUnreadStateRef.current || {
      daily: false,
      weekly: false,
      monthly: false,
      selfStructure: false,
    };

    const next = { ...prev };
    const groupPatch = {};

    targetKeys.forEach((rawKey) => {
      const key = String(rawKey || "").trim();
      if (!key) return;
      const incomingValue = !!patch?.[key];
      const nextValue = preserveTruthyKeys ? (!!prev[key] || incomingValue) : incomingValue;
      next[key] = nextValue;
      groupPatch[key] = nextValue;
    });

    myWebUnreadStateRef.current = next;

    if (Object.keys(groupPatch).length > 0) {
      setUnreadGroup("MyWeb", groupPatch);
    }

    return next;
  }, [setUnreadGroup]);

  const extractMyWebUnreadFromStartupSnapshot = React.useCallback((payload) => {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;

    const startupRoot =
      payload?.startup && typeof payload.startup === "object" && !Array.isArray(payload.startup)
        ? payload.startup
        : payload;

    const sections =
      startupRoot?.sections &&
      typeof startupRoot.sections === "object" &&
      !Array.isArray(startupRoot.sections)
        ? startupRoot.sections
        : null;

    const mywebUnreadSection =
      sections?.myweb_unread &&
      typeof sections.myweb_unread === "object" &&
      !Array.isArray(sections.myweb_unread)
        ? sections.myweb_unread
        : null;

    const unreadByType =
      mywebUnreadSection?.unread_by_type &&
      typeof mywebUnreadSection.unread_by_type === "object" &&
      !Array.isArray(mywebUnreadSection.unread_by_type)
        ? mywebUnreadSection.unread_by_type
        : null;

    if (!unreadByType) return null;

    return {
      daily: !!unreadByType.daily,
      weekly: !!unreadByType.weekly,
      monthly: !!unreadByType.monthly,
      selfStructure: !!unreadByType.selfStructure,
    };
  }, []);

  const stripMyWebUnreadFromStartupSnapshot = React.useCallback((payload) => {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;

    try {
      const cloned = JSON.parse(JSON.stringify(payload));
      const startupRoot =
        cloned?.startup && typeof cloned.startup === "object" && !Array.isArray(cloned.startup)
          ? cloned.startup
          : cloned;

      if (
        startupRoot?.sections &&
        typeof startupRoot.sections === "object" &&
        !Array.isArray(startupRoot.sections)
      ) {
        delete startupRoot.sections.myweb_unread;
      }

      return cloned;
    } catch {
      return null;
    }
  }, []);

  const MYMODEL_API_BASE_URL = (process.env.EXPO_PUBLIC_MYMODEL_API_URL || "https://mashos-api.onrender.com").replace(/\/+$/, "");
  const __lastActivityLoginPingAtRef = React.useRef(0);
  const __lastUnreadPrefetchAtRef = React.useRef(0);
  const screenPrefetchTimerRef = React.useRef(null);

  const pingActivityLogin = React.useCallback(async () => {
    try {
      const now = Date.now();
      const last = Number(__lastActivityLoginPingAtRef.current || 0) || 0;
      if (now - last < 10 * 1000) return;
      __lastActivityLoginPingAtRef.current = now;
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token ?? null;
      if (!accessToken) return;
      const url = `${MYMODEL_API_BASE_URL}/activity/login`;
      const res = await apiFetch(url, {
        method: "POST",
        auth: false,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {}
    } catch {}
  }, []);

  const refreshMyModelCreateUnreadBadge = React.useCallback(async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token ?? null;
      if (!accessToken) {
        setUnread("MyModel", "mymodelCreate", false);
        return;
      }

      const fetchTier = async (tier) => {
        const url = `${MYMODEL_API_BASE_URL}/mymodel/create/questions?build_tier=${encodeURIComponent(tier)}`;
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
      const lightTotal = Number(lightJson?.meta?.total_questions ?? lightJson?.questions?.length ?? 0) || 0;
      const lightHasUnanswered = !!lightJson?.meta?.has_unanswered;
      const lightDot = lightTotal > 0 && lightHasUnanswered;
      const standardJson = await fetchTier("standard");
      const standardTotal = Number(standardJson?.meta?.total_questions ?? standardJson?.questions?.length ?? 0) || 0;
      const standardHasUnanswered = !!standardJson?.meta?.has_unanswered;
      const standardDot = standardTotal > 0 && standardHasUnanswered;
      setUnread("MyModel", "mymodelCreate", !!(lightDot || standardDot));
    } catch {
      setUnread("MyModel", "mymodelCreate", false);
    }
  }, [MYMODEL_API_BASE_URL, setUnread]);

  const refreshMyModelReflectionsUnreadBadge = React.useCallback(async () => {
    try {
      if (isTutorialMode) {
        setUnread("MyModel", "reflectionsNew", false);
        setUnread("MyModel", "qnaNew", false);
        return;
      }
      const json = await apiGet("/mymodel/qna/unread-status");
      const hasUnread = typeof json?.has_unread === "boolean" ? json.has_unread : typeof json?.hasUnread === "boolean" ? json.hasUnread : false;
      setUnread("MyModel", "reflectionsNew", !!hasUnread);
      setUnread("MyModel", "qnaNew", false);
    } catch {
      setUnread("MyModel", "reflectionsNew", false);
      setUnread("MyModel", "qnaNew", false);
    }
  }, [isTutorialMode, setUnread]);

  const getMyWebSelfStructureLatestSeenStorageKey = React.useCallback(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const userId = String(data?.session?.user?.id || "").trim();
      return userId
        ? `${MYWEB_SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY}:${userId}`
        : MYWEB_SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY;
    } catch {
      return MYWEB_SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY;
    }
  }, []);

  const fetchMyWebReportReadIdSet = React.useCallback(async (reportIds) => {
    const ids = Array.from(
      new Set(
        (Array.isArray(reportIds) ? reportIds : [])
          .map((id) => String(id || "").trim())
          .filter(Boolean)
      )
    );
    if (ids.length === 0) return new Set();

    const readSet = new Set();
    for (let i = 0; i < ids.length; i += MYWEB_REPORT_READ_STATUS_CHUNK_SIZE) {
      const chunk = ids.slice(i, i + MYWEB_REPORT_READ_STATUS_CHUNK_SIZE);
      if (chunk.length === 0) continue;
      const query = chunk
        .map((id) => `report_ids=${encodeURIComponent(id)}`)
        .join("&");
      const json = await apiGet(`/report-reads/status?${query}`);
      const readIds = Array.isArray(json?.read_ids) ? json.read_ids : [];
      readIds.forEach((id) => {
        const normalized = String(id || "").trim();
        if (normalized) readSet.add(normalized);
      });
    }
    return readSet;
  }, []);

  const fetchMyWebSelfStructureLatestUnread = React.useCallback(async () => {
    if (!isPaid) return false;

    const storageKey = await getMyWebSelfStructureLatestSeenStorageKey();
    const [statusJson, seenVersionKey] = await Promise.all([
      apiGet("/myprofile/latest/status"),
      AsyncStorage.getItem(storageKey),
    ]);

    const versionKey = String(statusJson?.version_key || "").trim();
    const hasVisibleContent = !!statusJson?.has_visible_content;
    const seenKey = String(seenVersionKey || "").trim();

    if (!versionKey || !hasVisibleContent) return false;
    return versionKey !== seenKey;
  }, [getMyWebSelfStructureLatestSeenStorageKey, isPaid]);

  const fetchMyWebSelfStructureHistoryUnread = React.useCallback(async () => {
    if (!isPaid) return false;

    const historyJson = await apiGet(
      `/myprofile/reports/history?report_type=monthly&limit=${MYWEB_SELF_STRUCTURE_HISTORY_FETCH_LIMIT}&offset=0`
    );
    const items = Array.isArray(historyJson?.items) ? historyJson.items : [];
    const ids = items
      .map((item) => String(item?.id || "").trim())
      .filter(Boolean);

    if (ids.length === 0) return false;

    const readSet = await fetchMyWebReportReadIdSet(ids);
    return ids.some((id) => !readSet.has(id));
  }, [fetchMyWebReportReadIdSet, isPaid]);

  const clearMyWebStartupWarmupTimer = React.useCallback(() => {
    try {
      if (myWebStartupWarmupTimerRef.current) {
        clearTimeout(myWebStartupWarmupTimerRef.current);
      }
    } catch {}
    myWebStartupWarmupTimerRef.current = null;
  }, []);

  const refreshMyWebReportsUnreadBadge = React.useCallback(async (options = {}) => {
    const preserveTruthyKeys = options?.preserveTruthyKeys === true;
    if (!preserveTruthyKeys) {
      myWebStartupWarmupSeqRef.current += 1;
      clearMyWebStartupWarmupTimer();
    }

    const refreshSeq = ++myWebUnreadRefreshSeqRef.current;
    const isStale = () => refreshSeq !== myWebUnreadRefreshSeqRef.current;
    const canResolveSelfStructureUnread = !subscriptionLoading;

    const applyBaseUnread = (unread) => {
      if (isStale()) return;
      applyMyWebUnreadPatch(
        {
          daily: !!unread?.daily,
          weekly: !!unread?.weekly,
          monthly: !!unread?.monthly,
        },
        {
          preserveTruthyKeys,
          keys: ["daily", "weekly", "monthly"],
        }
      );
    };

    const applySelfStructureUnread = (value) => {
      if (isStale()) return;
      applyMyWebUnreadPatch(
        { selfStructure: !!value },
        {
          preserveTruthyKeys,
          keys: ["selfStructure"],
        }
      );
    };

    const baseQuery = new URLSearchParams({ limit: "1", include_self_structure: "false" }).toString();

    const selfStructurePromise = !canResolveSelfStructureUnread
      ? Promise.resolve(undefined)
      : isPaid
      ? Promise.all([
          fetchMyWebSelfStructureLatestUnread().catch((e) => {
            console.warn("MainTabs: failed to refresh MyWeb latest self-structure unread badge", e);
            return false;
          }),
          fetchMyWebSelfStructureHistoryUnread().catch((e) => {
            console.warn("MainTabs: failed to refresh MyWeb self-structure history unread badge", e);
            return false;
          }),
        ]).then(([latestUnread, historyUnread]) => !!latestUnread || !!historyUnread)
      : Promise.resolve(false);

    try {
      const json = await apiGet(`/report-reads/myweb-unread-status?${baseQuery}`);
      const unread = json?.unread_by_type || {};
      applyBaseUnread(unread);
    } catch (e) {
      if (isStale()) return;
      console.warn("MainTabs: failed to refresh MyWeb unread badges", e);
    }

    const selfStructureUnread = await selfStructurePromise;
    if (selfStructureUnread === undefined) return;
    applySelfStructureUnread(selfStructureUnread);
  }, [
    isPaid,
    subscriptionLoading,
    clearMyWebStartupWarmupTimer,
    applyMyWebUnreadPatch,
    fetchMyWebSelfStructureLatestUnread,
    fetchMyWebSelfStructureHistoryUnread,
  ]);

  const fetchAndApplyStartupSnapshot = React.useCallback(async ({ forceRefresh = false, source = "startup", applyIf, preserveTruthyKeys = false } = {}) => {
    const params = new URLSearchParams();
    if (forceRefresh) {
      params.set("force_refresh", "true");
    }
    try {
      const timezoneName = Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone;
      const normalizedTz = String(timezoneName || "").trim();
      if (normalizedTz) {
        params.set("timezone_name", normalizedTz);
      }
    } catch {}

    const query = params.toString();
    const path = query ? `/app/startup?${query}` : "/app/startup";
    const json = await apiGet(path);

    if (typeof applyIf === "function") {
      try {
        if (!applyIf()) return null;
      } catch {
        return null;
      }
    }

    const startupMyWebUnread = extractMyWebUnreadFromStartupSnapshot(json);
    if (startupMyWebUnread) {
      applyMyWebUnreadPatch(startupMyWebUnread, {
        preserveTruthyKeys,
        keys: ["daily", "weekly", "monthly", "selfStructure"],
      });
    }

    const snapshotWithoutMyWebUnread = stripMyWebUnreadFromStartupSnapshot(json);
    if (!snapshotWithoutMyWebUnread) return null;

    return applyStartupSnapshot(snapshotWithoutMyWebUnread, {
      source,
      fetchedAt: Date.now(),
      replaceUnreadScopes: [],
      replacePrefetchScopes: false,
    });
  }, [
    applyMyWebUnreadPatch,
    applyStartupSnapshot,
    extractMyWebUnreadFromStartupSnapshot,
    stripMyWebUnreadFromStartupSnapshot,
  ]);

  const revalidateMyWebUnreadFromStartup = React.useCallback(async ({ source = "myweb_startup", applyIf } = {}) => {
    try {
      await fetchAndApplyStartupSnapshot({
        forceRefresh: true,
        source,
        applyIf,
        preserveTruthyKeys: true,
      });
    } catch (e) {
      console.warn("MainTabs: failed to hydrate MyWeb unread from startup snapshot", e);
    }

    if (typeof applyIf === "function") {
      try {
        if (!applyIf()) return;
      } catch {
        return;
      }
    }

    try {
      await refreshMyWebReportsUnreadBadge({ preserveTruthyKeys: true });
    } catch (e) {
      console.warn("MainTabs: failed to refresh MyWeb unread badges on startup", e);
    }
  }, [fetchAndApplyStartupSnapshot, refreshMyWebReportsUnreadBadge]);

  const warmMyWebUnreadAtStartup = React.useCallback(async ({ force = false, sourcePrefix = "myweb_startup" } = {}) => {
    try {
      const now = Date.now();
      const last = Number(myWebStartupWarmupLastRunAtRef.current || 0) || 0;
      if (!force && now - last < MYWEB_STARTUP_WARMUP_MIN_INTERVAL_MS) return;
      myWebStartupWarmupLastRunAtRef.current = now;

      clearMyWebStartupWarmupTimer();

      const warmupSeq = ++myWebStartupWarmupSeqRef.current;
      const isWarmupStale = () => warmupSeq !== myWebStartupWarmupSeqRef.current;
      const applyIfCurrent = () => !isWarmupStale();
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      if (!force) {
        try {
          await fetchAndApplyStartupSnapshot({
            forceRefresh: true,
            source: `${sourcePrefix}_seed`,
            applyIf: applyIfCurrent,
            preserveTruthyKeys: true,
          });
        } catch (e) {
          console.warn("MainTabs: failed to seed MyWeb unread from startup snapshot", e);
        }
      }

      if (isWarmupStale()) return;

      try {
        await apiPost("/myweb/reports/ensure", {
          types: ["weekly", "monthly"],
          force: false,
        });
      } catch (e) {
        console.warn("MainTabs: failed to warm MyWeb ensure on startup", e);
      }

      const retryDelays = [0, 1200, 2500];
      for (let index = 0; index < retryDelays.length; index += 1) {
        const delayMs = retryDelays[index];
        if (delayMs > 0) {
          await wait(delayMs);
        }
        if (isWarmupStale()) return;
        await revalidateMyWebUnreadFromStartup({
          source: `${sourcePrefix}_after_ensure_${index + 1}`,
          applyIf: applyIfCurrent,
        });
      }

      if (isWarmupStale()) return;

      myWebStartupWarmupTimerRef.current = setTimeout(() => {
        Promise.resolve()
          .then(async () => {
            if (isWarmupStale()) return;
            await revalidateMyWebUnreadFromStartup({
              source: `${sourcePrefix}_final_revalidate`,
              applyIf: applyIfCurrent,
            });
          })
          .catch(() => null)
          .finally(() => {
            if (!isWarmupStale()) {
              myWebStartupWarmupTimerRef.current = null;
            }
          });
      }, MYWEB_STARTUP_REVALIDATE_DELAY_MS);
    } catch {}
  }, [
    clearMyWebStartupWarmupTimer,
    fetchAndApplyStartupSnapshot,
    revalidateMyWebUnreadFromStartup,
  ]);

  const refreshFriendsUnreadState = React.useCallback(async () => {
    try {
      const json = await apiGet("/friends/unread-status");
      const nextFeed = !!json?.feed_unread;
      const nextRequests = !!json?.requests_unread;
      setUnread("Friends", "feed", nextFeed);
      setUnread("Friends", "requests", nextRequests);
      return { feed: nextFeed, requests: nextRequests };
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
      const body = lastSeenCreatedAt ? { last_seen_created_at: lastSeenCreatedAt } : {};
      await apiPost("/friends/unread/read-feed", body);
    } catch (e) {
      console.warn("MainTabs: failed to mark Friends feed read", e);
    }
  }, []);

  const PREFETCH_MAX_AGE_MS = 2 * 60 * 1000;
  const __lastScreenPrefetchAtRef = React.useRef(0);

  const formatTimeLabel = React.useCallback((iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }, []);

  const prefetchFriendsFeed = React.useCallback(async () => {
    try {
      const userId = await resolveCurrentUserId();
      if (!userId) return;
      try {
        const fresh = getPrefetchEntryFresh?.("Friends", "feed", PREFETCH_MAX_AGE_MS);
        if (fresh?.value?.userId && String(fresh.value.userId) === String(userId)) return;
      } catch {}

      const json = await apiGet("/friends/feed");
      const rows = Array.isArray(json?.items) ? json.items : Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
      const mapped = rows.map((row) => ({
        id: row?.id,
        ownerName: row?.ownerName || row?.owner_name || "Friend",
        items: Array.isArray(row?.items) ? row.items : [],
        timeLabel: row?.timeLabel || formatTimeLabel(row?.created_at || row?.createdAt || null),
        createdAt: row?.createdAt || row?.created_at || null,
      }));
      try { setPrefetch("Friends", "feed", { userId, items: mapped }); } catch {}
    } catch {}
  }, [formatTimeLabel, getPrefetchEntryFresh, setPrefetch]);

  const prefetchFriendsManageData = React.useCallback(async () => {
    try {
      const userId = await resolveCurrentUserId();
      if (!userId) return;
      try {
        const fresh = getPrefetchEntryFresh?.("Friends", "manage", PREFETCH_MAX_AGE_MS);
        if (fresh?.value?.userId && String(fresh.value.userId) === String(userId)) return;
      } catch {}

      const json = await apiGet("/friends/manage");
      const payload = json && typeof json === "object" ? json : {};
      try {
        setPrefetch("Friends", "manage", {
          userId,
          myProfile: payload?.myProfile || null,
          friendsList: Array.isArray(payload?.friendsList) ? payload.friendsList : [],
          incoming: Array.isArray(payload?.incoming) ? payload.incoming : [],
          outgoing: Array.isArray(payload?.outgoing) ? payload.outgoing : [],
          friendNotifMap: payload?.friendNotifMap && typeof payload.friendNotifMap === "object" ? payload.friendNotifMap : {},
          incomingPendingCount: Number(payload?.incomingPendingCount || 0) || 0,
        });
      } catch {}
    } catch {}
  }, [getPrefetchEntryFresh, setPrefetch]);

  const prefetchMyModelScreenData = React.useCallback(async () => {
    try {
      const userId = await resolveCurrentUserId();
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token ?? null;
      if (!userId || !accessToken) return;
      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` };

      try {
        const trendingMode = "overall";
        const trendingCacheKey = `trending:${trendingMode}`;
        const fresh = getPrefetchEntryFresh?.("MyModel", trendingCacheKey, PREFETCH_MAX_AGE_MS);
        const isFresh = !!fresh?.value?.userId && String(fresh.value.userId) === String(userId);
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
      } catch {}

      try {
        const fresh = getPrefetchEntryFresh?.("MyModel", "recoUsers", PREFETCH_MAX_AGE_MS);
        const isFresh = !!fresh?.value?.userId && String(fresh.value.userId) === String(userId);
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
      } catch {}

      try {
        const cacheKey = `qnaList:${userId}:newest`;
        const fresh = getPrefetchEntryFresh?.("MyModel", cacheKey, PREFETCH_MAX_AGE_MS);
        const isFresh = !!fresh?.value?.targetUserId && String(fresh.value.targetUserId) === String(userId);
        if (!isFresh) {
          const params = new URLSearchParams();
          params.append("target_user_id", userId);
          params.append("sort", "newest");
          const url = `${MYMODEL_API_BASE_URL}/mymodel/qna/list?${params.toString()}`;
          const res = await apiFetch(url, { method: "GET", auth: false, headers });
          const json = await res.json().catch(() => null);
          if (res.ok) {
            const items = Array.isArray(json?.items) ? json.items : [];
            const meta = json?.meta && typeof json.meta === "object" ? json.meta : null;
            setPrefetch("MyModel", cacheKey, { userId, targetUserId: userId, mode: "newest", items, meta });
          }
        }
      } catch {}
    } catch {}
  }, [MYMODEL_API_BASE_URL, getPrefetchEntryFresh, setPrefetch]);

  const runAllScreenPrefetch = React.useCallback(async () => {
    try {
      const now = Date.now();
      const last = Number(__lastScreenPrefetchAtRef.current || 0) || 0;
      if (now - last < SCREEN_PREFETCH_MIN_INTERVAL_MS) return;
      __lastScreenPrefetchAtRef.current = now;
      const tasks = [prefetchFriendsFeed, prefetchFriendsManageData, prefetchMyModelScreenData];
      for (const fn of tasks) {
        try { await fn(); } catch {}
      }
    } catch {}
  }, [prefetchFriendsFeed, prefetchFriendsManageData, prefetchMyModelScreenData]);

  const runAllUnreadPrefetch = React.useCallback((opts = {}) => {
    const includeScreenPrefetch = opts?.includeScreenPrefetch !== false;
    try { pingActivityLogin(); } catch {}

    try {
      const now = Date.now();
      const last = Number(__lastUnreadPrefetchAtRef.current || 0) || 0;
      if (now - last < UNREAD_PREFETCH_MIN_INTERVAL_MS) return;
      __lastUnreadPrefetchAtRef.current = now;
    } catch {}

    const tasks = [
      refreshFriendsUnreadState,
      refreshMyModelCreateUnreadBadge,
      refreshMyModelReflectionsUnreadBadge,
      warmMyWebUnreadAtStartup,
    ];

    Promise.all(tasks.map((fn) => Promise.resolve().then(() => fn()).catch(() => null))).catch(() => {});

    if (includeScreenPrefetch) {
      try {
        if (screenPrefetchTimerRef.current) clearTimeout(screenPrefetchTimerRef.current);
      } catch {}
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
    warmMyWebUnreadAtStartup,
    runAllScreenPrefetch,
  ]);

  const clearSelfStructureBannerTimer = React.useCallback(() => {
    try {
      if (selfStructureBannerHideTimerRef.current) clearTimeout(selfStructureBannerHideTimerRef.current);
    } catch {}
    selfStructureBannerHideTimerRef.current = null;
  }, []);

  const hideSelfStructureBanner = React.useCallback(() => {
    clearSelfStructureBannerTimer();
    setSelfStructureBanner((prev) => (prev.visible ? { ...prev, visible: false } : prev));
  }, [clearSelfStructureBannerTimer]);

  const showSelfStructureBanner = React.useCallback((reportMode = "standard") => {
    clearSelfStructureBannerTimer();
    setSelfStructureBanner({ visible: true, reportMode: reportMode === "deep" ? "deep" : "standard" });
    selfStructureBannerHideTimerRef.current = setTimeout(() => {
      setSelfStructureBanner((prev) => ({ ...prev, visible: false }));
    }, SELF_STRUCTURE_BANNER_AUTO_HIDE_MS);
  }, [clearSelfStructureBannerTimer]);

  const openSelfStructureLatestFromBanner = React.useCallback(() => {
    const reportMode = selfStructureBanner.reportMode === "deep" ? "deep" : "standard";
    hideSelfStructureBanner();
    try {
      if (navigationRef.isReady()) {
        navigationRef.navigate("MyWeb", buildMyWebRootNavigationParams({
          openSelfReportLatest: true,
          openSelfReportLatestMode: reportMode,
          openSelfReportLatestAt: Date.now(),
        }));
      }
    } catch {}
  }, [hideSelfStructureBanner, selfStructureBanner.reportMode]);

  useEffect(() => {
    return () => {
      clearSelfStructureBannerTimer();
    };
  }, [clearSelfStructureBannerTimer]);

  useEffect(() => {
    return () => {
      myWebStartupWarmupSeqRef.current += 1;
      clearMyWebStartupWarmupTimer();
    };
  }, [clearMyWebStartupWarmupTimer]);

  useEffect(() => {
    return () => {
      try {
        if (screenPrefetchTimerRef.current) clearTimeout(screenPrefetchTimerRef.current);
      } catch {}
    };
  }, []);

  useEffect(() => {
    const handler = (state) => {
      setIsAppActive(state === "active");
    };
    const sub = AppState?.addEventListener ? AppState.addEventListener("change", handler) : null;
    return () => {
      try {
        if (sub && typeof sub.remove === "function") sub.remove();
        else if (AppState?.removeEventListener) AppState.removeEventListener("change", handler);
      } catch {}
    };
  }, []);

  useEffect(() => {
    if (subscriptionLoading) {
      myWebSubscriptionRefreshPendingRef.current = true;
      return;
    }
    if (!myWebSubscriptionRefreshPendingRef.current) return;
    myWebSubscriptionRefreshPendingRef.current = false;
    Promise.resolve()
      .then(() =>
        warmMyWebUnreadAtStartup({
          force: true,
          sourcePrefix: isPaid ? "myweb_subscription_ready" : "myweb_subscription_resolved",
        })
      )
      .catch(() => null);
  }, [isPaid, subscriptionLoading, warmMyWebUnreadAtStartup]);

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
      const reportMode = String(json?.saved_report_mode || "").trim().toLowerCase() === "deep" ? "deep" : "standard";
      if (!selfStructureLatestInitializedRef.current) {
        selfStructureLatestInitializedRef.current = true;
        selfStructureLatestVersionRef.current = nextVersionKey;
        return;
      }
      if ((selfStructureLatestVersionRef.current || null) !== nextVersionKey) {
        selfStructureLatestVersionRef.current = nextVersionKey;
        if (nextVersionKey && hasVisibleContent) showSelfStructureBanner(reportMode);
      }
    } catch {}
  }, [isAppActive, isPaid, showSelfStructureBanner, subscriptionLoading]);

  useEffect(() => {
    if (subscriptionLoading || !isPaid || !isAppActive) return undefined;
    let intervalId = null;
    const tick = () => { refreshSelfStructureLatestStatus().catch(() => null); };
    tick();
    intervalId = setInterval(tick, SELF_STRUCTURE_LATEST_STATUS_POLL_MS);
    return () => {
      try { if (intervalId) clearInterval(intervalId); } catch {}
    };
  }, [isAppActive, isPaid, refreshSelfStructureLatestStatus, subscriptionLoading]);

  useEffect(() => {
    runAllUnreadPrefetch();
    const handler = (state) => {
      if (state === "active") runAllUnreadPrefetch();
    };
    const sub = AppState?.addEventListener ? AppState.addEventListener("change", handler) : null;
    return () => {
      try {
        if (sub && typeof sub.remove === "function") sub.remove();
        else if (AppState?.removeEventListener) AppState.removeEventListener("change", handler);
      } catch {}
    };
  }, [runAllUnreadPrefetch]);

  useEffect(() => {
    let cancelled = false;
    let intervalId = null;
    const tick = async () => {
      if (cancelled) return;
      try { await refreshFriendsUnreadState(); } catch {}
    };
    tick();
    intervalId = setInterval(tick, FRIENDS_UNREAD_POLL_MS);
    return () => {
      cancelled = true;
      try { if (intervalId) clearInterval(intervalId); } catch {}
    };
  }, [refreshFriendsUnreadState]);

  useEffect(() => {
    if (activeRouteName !== "Friends") return;
    (async () => { await refreshFriendsUnreadState(); })();
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
      <Ionicons name="notifications-outline" size={18} color={colors.TITLE_GOLD} style={{ marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.TEXT_ON_LIGHT, fontSize: 13, fontWeight: "700" }}>
          自己構造分析レポートが更新されました
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.TEXT_SUBTLE} />
    </TouchableOpacity>
  ) : null;

  return (
    <GlobalFrameLayout frameEnabled={frameEnabled} headerBottomSlot={selfStructureBannerHud}>
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
          sceneContainerStyle: {
            backgroundColor: colors.BG_SILVER,
            borderLeftColor: colors.BORDER_GOLD,
            borderRightColor: colors.BORDER_GOLD,
            borderLeftWidth: HIDDEN_SCREENS.has(route.name) ? 0 : FRAME_BORDER_WIDTH,
            borderRightWidth: HIDDEN_SCREENS.has(route.name) ? 0 : FRAME_BORDER_WIDTH,
          },
          tabBarIcon: ({ color, size }) => {
            let iconName;
            switch (route.name) {
              case "Input": iconName = "create-outline"; break;
              case "MyWeb": iconName = "globe-outline"; break;
              case "MyModel":
              case "MyProfile": iconName = "cube-outline"; break;
              case "RankingTop": iconName = "trophy-outline"; break;
              case "Friends": iconName = "people-outline"; break;
              case "Settings": iconName = "settings-outline"; break;
              default: iconName = "ellipse-outline";
            }
            const icon = <Ionicons name={iconName} size={size} color={color} />;
            const showUnreadBadge = showTabUnreadBadge(route.name);
            const shouldWrap = showUnreadBadge || route.name === "Friends" || route.name === "MyWeb";
            if (!shouldWrap) return icon;
            return (
              <View style={{ width: size + (showUnreadBadge ? 22 : 10), height: size + (showUnreadBadge ? 12 : 10), alignItems: "center", justifyContent: "center", overflow: "visible" }}>
                {icon}
                {showUnreadBadge ? (
                  <UnreadBadge
                    variant="new"
                    label="NEW"
                    style={{ position: "absolute", top: 0, right: -8, minHeight: 12, paddingHorizontal: 4, paddingVertical: 1 }}
                    textStyle={{ fontSize: 7.5, lineHeight: 8.5, fontWeight: "800" }}
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
              case "Input": label = "Home"; break;
              case "MyWeb": label = "MyWeb"; break;
              case "MyModel":
              case "MyProfile": label = "MyModel"; break;
              case "RankingTop": label = "Ranking"; break;
              case "Friends": label = "Friend"; break;
              case "Settings": label = "Setting"; break;
              default: label = route.name;
            }
            const showUnreadBadge = showTabUnreadBadge(route.name);
            const labelColor = focused || !showUnreadBadge ? color : colors.TEXT_ON_LIGHT;
            return <Text style={{ color: labelColor, fontSize: 12, fontWeight: focused || showUnreadBadge ? "700" : "400" }}>{label}</Text>;
          },
        })}
      >
        <Tab.Screen
          name="Input"
          component={InputStackNavigator}
          listeners={({ navigation, route }) => ({ tabPress: (e) => handleMainTabPress(route.name, navigation, route, e) })}
        />
        <Tab.Screen
          name="MyWeb"
          listeners={({ navigation, route }) => ({ tabPress: (e) => handleMainTabPress(route.name, navigation, route, e) })}
        >
          {(tabProps) => (
            <MyWebStackNavigator
              {...tabProps}
              onSetMymodelLinkPayload={setMymodelLinkPayload}
              onRefreshTabUnread={refreshMyWebReportsUnreadBadge}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="MyModel"
          listeners={({ navigation, route }) => ({ tabPress: (e) => handleMainTabPress(route.name, navigation, route, e) })}
        >
          {(tabProps) => (
            <MyModelStackNavigator
              {...tabProps}
              linkPayload={mymodelLinkPayload}
              onConsumeLinkPayload={() => setMymodelLinkPayload(null)}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="MyProfile" options={{ tabBarButton: () => null }}>
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
          listeners={({ navigation, route }) => ({ tabPress: (e) => handleMainTabPress(route.name, navigation, route, e) })}
        />
        <Tab.Screen
          name="Friends"
          listeners={({ navigation, route }) => ({ tabPress: (e) => handleMainTabPress(route.name, navigation, route, e) })}
        >
          {(tabProps) => (
            <FriendsStackNavigator
              {...tabProps}
              hasUnreadFriendRequests={hasUnreadFriendRequests}
              hasUnreadFriendFeed={hasUnreadFriendFeed}
              onOpenFriendManage={async () => {
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
          listeners={({ navigation, route }) => ({ tabPress: (e) => handleMainTabPress(route.name, navigation, route, e) })}
        />
      </Tab.Navigator>
    </GlobalFrameLayout>
  );
}

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
const EmotionRankingScreenWithFrame = withGlobalFrame(EmotionRankingScreen);
const InputCountRankingScreenWithFrame = withGlobalFrame(InputCountRankingScreen);
const InputLengthRankingScreenWithFrame = withGlobalFrame(InputLengthRankingScreen);
const MyModelQuestionsRankingScreenWithFrame = withGlobalFrame(MyModelQuestionsRankingScreen);
const MyModelEchoesRankingScreenWithFrame = withGlobalFrame(MyModelEchoesRankingScreen);
const MyModelDiscoveriesRankingScreenWithFrame = withGlobalFrame(MyModelDiscoveriesRankingScreen);
const LoginStreakRankingScreenWithFrame = withGlobalFrame(LoginStreakRankingScreen);

function RootStackNavigator() {
  return (
    <RootStack.Navigator initialRouteName="MainTabs" screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabs" component={MainTabs} />
      <RootStack.Screen name="Account" component={AccountScreenWithFrame} />
      <RootStack.Screen name="SubscriptionSelect" component={SubscriptionSelectScreenWithFrame} />
      <RootStack.Screen name="FollowListScreen" component={FollowListScreenWithFrame} />
      <RootStack.Screen name="RankingEmotion" component={EmotionRankingScreenWithFrame} />
      <RootStack.Screen name="RankingInputCount" component={InputCountRankingScreenWithFrame} />
      <RootStack.Screen name="RankingInputLength" component={InputLengthRankingScreenWithFrame} />
      <RootStack.Screen name="RankingMyModelQuestions" component={MyModelQuestionsRankingScreenWithFrame} />
      <RootStack.Screen name="RankingMyModelResonances" component={MyModelEchoesRankingScreenWithFrame} />
      <RootStack.Screen name="RankingMyModelDiscoveries" component={MyModelDiscoveriesRankingScreenWithFrame} />
      <RootStack.Screen name="RankingLoginStreak" component={LoginStreakRankingScreenWithFrame} />
    </RootStack.Navigator>
  );
}

function RootNavigator() {
  const { session, initializing, recoveryMode } = useAuth();
  const { subscriptionBootstrapLoaded } = useSubscription();
  const { setTutorialFlagsLoaded, setTutorialCompleted, setTutorialSkipped } = useTutorial();

  useEffect(() => {
    let cancelled = false;
    if (!session || recoveryMode) {
      setTutorialCompleted(false);
      setTutorialSkipped(false);
      setTutorialFlagsLoaded(false);
      return () => { cancelled = true; };
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

    return () => { cancelled = true; };
  }, [session?.user?.id, recoveryMode, setTutorialCompleted, setTutorialSkipped, setTutorialFlagsLoaded]);

  useEffect(() => {
    try {
      if (typeof __DEV__ !== "undefined" && __DEV__ && session?.access_token) {
        console.log("[DEV] Supabase access_token:", session.access_token);
      }
    } catch {}
  }, [session?.access_token]);

  useEffect(() => {
    if (!session || recoveryMode || !subscriptionBootstrapLoaded) {
      stopIapPurchaseObserver();
      return;
    }
    startIapPurchaseObserver().catch((e) => {
      console.log("IAP observer start failed:", e?.message || e);
    });
    return () => {
      stopIapPurchaseObserver();
    };
  }, [!!session, recoveryMode, subscriptionBootstrapLoaded]);

  useEffect(() => {
    if (!session || recoveryMode) return;
    const userId = session?.user?.id;
    if (!userId) return;
    syncPushTokenOnce({ userId }).catch((e) => {
      console.log("[push] syncPushTokenOnce failed:", e?.message || e);
    });
    let unsubscribe = null;
    try {
      unsubscribe = startPushTokenSync({ userId });
    } catch (e) {
      console.log("[push] startPushTokenSync failed:", e?.message || e);
    }
    return () => {
      try {
        if (typeof unsubscribe === "function") unsubscribe();
      } catch {}
    };
  }, [session?.user?.id, recoveryMode]);

  useEffect(() => {
    if (!session || recoveryMode) return;
    const t = setTimeout(() => {
      tryOpenRouteIfPending();
    }, 0);
    return () => { clearTimeout(t); };
  }, [!!session, recoveryMode]);

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (recoveryMode) return <AuthScreen />;
  if (!session) return <AuthScreen />;
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
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const unsubscribeOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
      requestOpenRouteFromNotification(remoteMessage);
    });

    messaging().getInitialNotification().then((remoteMessage) => {
      if (remoteMessage) requestOpenRouteFromNotification(remoteMessage);
    }).catch((e) => {
      console.log("[push] getInitialNotification failed:", e?.message || e);
    });

    return () => {
      try {
        if (typeof unsubscribeOpened === "function") unsubscribeOpened();
      } catch {}
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
                  linking={appLinking}
                  onReady={() => {
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
