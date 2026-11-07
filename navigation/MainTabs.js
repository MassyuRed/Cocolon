import React, { useEffect, useRef, useState } from "react";
import { AppState, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackActions } from "@react-navigation/native";
import { createBottomTabNavigator, BottomTabBar } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuth } from "../AuthContext";
import { useOwnerRequestScope } from "../hooks/useOwnerRequestScope";
import { useUnread } from "../UnreadContext";
import { useSubscription } from "../SubscriptionContext";
import { useTutorial } from "../TutorialContext";
import { useTheme } from "../theme/ThemeContext";
import { supabase } from "../lib/supabase";
import { ANALYSIS_WIRE, PIECE_WIRE, SELF_STRUCTURE_WIRE, buildSelfStructureReportHistoryPath, deleteWireSectionKeys, readWireSectionObject } from "../lib/compat/legacyWireContracts";
import { getCurrentUserId } from "../lib/user";
import { API_BASE_URL, apiFetch, apiGet, apiPost } from "../lib/apiClient";
import { getNexusPiecesAsQnaList } from "../lib/nexusApi";
import { BottomTabUnreadBadge } from "../components/UnreadBadge";
import GlobalFrameLayout, { FRAME_BORDER_WIDTH } from "../components/GlobalFrameLayout";
import { navigationRef, buildAnalysisRootNavigationParams } from "./navigationRef";
import InputStackNavigator from "./InputStackNavigator";
import AnalysisStackNavigator from "./AnalysisStackNavigator";
import PieceStackNavigator from "./PieceStackNavigator";
import AppStartupLoadingView from "../runtime/AppStartupLoadingView";
import SettingsStackNavigator from "./SettingsStackNavigator";
import {
  ANALYSIS_REPORT_READ_STATUS_CHUNK_SIZE,
  ANALYSIS_SELF_STRUCTURE_HISTORY_FETCH_LIMIT,
  ANALYSIS_SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY,
  ANALYSIS_STARTUP_REVALIDATE_DELAY_MS,
  ANALYSIS_STARTUP_WARMUP_MIN_INTERVAL_MS,
  EMOTION_LOG_UNREAD_POLL_MS,
  HIDDEN_SCREENS,
  MAIN_TAB_ROUTES,
  PIECE_SUB_ROUTES,
  SCREEN_PREFETCH_DEFER_MS,
  SCREEN_PREFETCH_MIN_INTERVAL_MS,
  SELF_STRUCTURE_BANNER_AUTO_HIDE_MS,
  SELF_STRUCTURE_LATEST_STATUS_POLL_MS,
  UNREAD_PREFETCH_MIN_INTERVAL_MS,
} from "./navigationConstants";

const Tab = createBottomTabNavigator();

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

function CocolonTabBar(props) {
  const { colors } = useTheme();
  const { state } = props;
  const currentRoute = state.routes[state.index];
  const currentRouteName = currentRoute?.name;
  const effectiveRouteName =
    PIECE_SUB_ROUTES.has(currentRouteName)
      ? "Piece"
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
        backgroundColor: colors.SURFACE_TONAL,
        borderTopWidth: 0,
      }}
    >
      <BottomTabBar {...props} state={filteredState} />
    </View>
  );
}

export function createPieceSaveRecovery(owner) {
  const pending = new Map();
  const inputId = entry => entry.operation.request.source_ref.source_input_id;
  const publication = runtime => runtime !== null && typeof runtime === 'object';
  let active = true;
  return Object.freeze({
    find(expectedUserId, savedInputId) {
      return active && owner && expectedUserId === owner ? pending.get(savedInputId)?.entry : undefined;
    },
    remember(entry) {
      if (!active || !owner || entry.operation.expectedUserId !== owner || pending.has(inputId(entry))) return false;
      pending.set(inputId(entry), { entry, stop: null, quotaExhausted: false });
      return true;
    },
    forget(entry) {
      if (pending.get(inputId(entry))?.entry === entry) pending.delete(inputId(entry));
    },
    setQuotaExhausted(entry, value) {
      if (!active) return;
      const record = pending.get(inputId(entry));
      if (record?.entry === entry) record.quotaExhausted = value === true;
    },
    isQuotaExhausted(entry) {
      const record = pending.get(inputId(entry));
      return active && record?.entry === entry && record.quotaExhausted === true;
    },
    markDisabled(entry, runtime) {
      const record = pending.get(inputId(entry));
      if (record?.entry !== entry) return;
      if (!record.stop) record.stop = { publications: new WeakSet(), unknown: false };
      if (publication(runtime)) record.stop.publications.add(runtime);
      else record.stop.unknown = true;
    },
    canResume(entry, runtime, eligible, runtimeRefresh = false) {
      if (!active) return false;
      const record = pending.get(inputId(entry));
      if (record?.entry !== entry) return false;
      if (!record.stop) return true;
      if (!eligible || !publication(runtime) || record.stop.publications.has(runtime)) return false;
      if (record.stop.unknown && runtimeRefresh) record.stop.unknown = false;
      return !record.stop.unknown;
    },
    activate() { active = true; },
    revoke() { active = false; pending.clear(); },
  });
}

export default function MainTabs() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  const navigationFontScale = Math.max(1, Number(fontScale) || 1);
  const tabIconAreaHeight = 28 + (navigationFontScale - 1) * 18;
  const tabLabelLineHeight = 18;
  // The item adds 5px above and below the icon/label stack.
  const tabBarContentHeight = Math.ceil(8 + 10 + tabIconAreaHeight + tabLabelLineHeight * navigationFontScale);
  const {
    getScopeUnread,
    getFeatureUnread,
    setUnread,
    setUnreadGroup,
    getPrefetchEntryFresh,
    setPrefetch,
    applyStartupSnapshot,
  } = useUnread();

  const { isPaid, loading: subscriptionLoading, tier, subscriptionBootstrapLoaded, subscriptionBootstrapLoading } = useSubscription();
  const { session, recoveryMode, authOwnerGeneration } = useAuth();
  const {
    isTutorialMode,
    tutorialFlagsLoaded,
    tutorialCompleted,
    tutorialSkipped,
    tutorialCompletionInProgress,
    startTutorial,
    setTutorialStep,
  } = useTutorial();
  const [isAppActive, setIsAppActive] = useState(() => (AppState?.currentState || "active") === "active");
  const [selfStructureBanner, setSelfStructureBanner] = useState({ visible: false, reportMode: "standard" });
  const selfStructureBannerHideTimerRef = useRef(null);
  const selfStructureLatestVersionRef = useRef(null);
  const selfStructureLatestInitializedRef = useRef(false);
  const analysisUnreadRefreshSeqRef = useRef(0);
  const analysisUnreadStateRef = useRef({
    daily: false,
    weekly: false,
    monthly: false,
    selfStructure: false,
  });
  const analysisStartupWarmupLastRunAtRef = useRef(0);
  const analysisStartupWarmupTimerRef = useRef(null);
  const analysisStartupWarmupSeqRef = useRef(0);
  const analysisSubscriptionRefreshPendingRef = useRef(false);

  const [activeRouteName, setActiveRouteName] = useState("Input");
  const [activeLeafName, setActiveLeafName] = useState("Input");
  const [initialInputOwner, setInitialInputOwner] = useState(null);
  const [startupComplete, setStartupComplete] = useState(false);
  const currentOwner = session?.user?.id || null;
  const { scope: ownerRequest, isCurrent: isOwnerCurrent } = useOwnerRequestScope(currentOwner, authOwnerGeneration);
  const [pieceSaveScope, setPieceSaveScope] = useState(() => ({ owner: currentOwner,
    recovery: createPieceSaveRecovery(currentOwner) }));
  if (pieceSaveScope.owner !== currentOwner) {
    setPieceSaveScope({ owner: currentOwner, recovery: createPieceSaveRecovery(currentOwner) });
  }
  const saveRecovery = pieceSaveScope.recovery;
  useEffect(() => {
    saveRecovery.activate();
    return () => saveRecovery.revoke();
  }, [saveRecovery]);
  const onInitialInputSettled = React.useCallback((owner) => {
    if (owner && owner === currentOwner) setInitialInputOwner(owner);
  }, [currentOwner]);
  const commonStartupReady = subscriptionBootstrapLoaded && !subscriptionBootstrapLoading && !subscriptionLoading && tier !== "unknown" && tutorialFlagsLoaded;
  const homeStartupRequired = !isTutorialMode && activeRouteName === "Input" && activeLeafName === "Input";
  const appStartupReady = startupComplete || (commonStartupReady && (!homeStartupRequired || initialInputOwner === currentOwner));
  useEffect(() => {
    if (appStartupReady) setStartupComplete(true);
  }, [appStartupReady]);
  const frameEnabled = !HIDDEN_SCREENS.has(activeRouteName);
  const [pieceLinkPayload, setPieceLinkPayload] = useState(null);


  useEffect(() => {
    if (!session || recoveryMode) return;
    if (
      !tutorialFlagsLoaded ||
      tutorialCompleted ||
      tutorialSkipped ||
      isTutorialMode ||
      tutorialCompletionInProgress
    ) return;

    const started = startTutorial();
    if (started === false) return;

    setTutorialStep(1);
    requestAnimationFrame(() => {
      try {
        if (navigationRef.isReady()) {
          navigationRef.navigate("Input", { screen: "TutorialIntro" });
        }
      } catch {}
    });
  }, [
    isTutorialMode,
    recoveryMode,
    session,
    setTutorialStep,
    startTutorial,
    tutorialCompleted,
    tutorialSkipped,
    tutorialCompletionInProgress,
    tutorialFlagsLoaded,
  ]);

  const getTabBarActiveName = React.useCallback((name) => {
    const n = typeof name === "string" ? name : "";
    const effective =
      PIECE_SUB_ROUTES.has(n)
        ? "Piece"
        : n;
    return MAIN_TAB_ROUTES.has(effective) ? effective : "Input";
  }, []);

  const showTabUnreadBadge = React.useCallback(
    (routeName) => {
      if (routeName === "Piece") {
        return !!(
          (!isTutorialMode && getFeatureUnread("Piece", "piecesNew")) ||
          getFeatureUnread("EmotionLog", "feed")
        );
      }
      return !!getScopeUnread(routeName);
    },
    [getFeatureUnread, getScopeUnread, isTutorialMode]
  );

  const handleMainTabPress = React.useCallback(
    (pressedTabName, navigation, route, e) => {
      if (isTutorialMode) {
        try { e?.preventDefault?.(); } catch {}
        return;
      }

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

        if (pressedTabName === "Analysis") {
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
            navigation?.navigate?.("Analysis", { openDistributionHome: true, openDistributionHomeAt: Date.now() });
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
    [activeRouteName, getTabBarActiveName, isTutorialMode]
  );


  useEffect(() => {
    analysisUnreadStateRef.current = {
      daily: !!getFeatureUnread("Analysis", "daily"),
      weekly: !!getFeatureUnread("Analysis", "weekly"),
      monthly: !!getFeatureUnread("Analysis", "monthly"),
      selfStructure: !!getFeatureUnread("Analysis", "selfStructure"),
    };
  }, [getFeatureUnread]);

  const applyAnalysisUnreadPatch = React.useCallback((patch, options = {}) => {
    if (!isOwnerCurrent(ownerRequest)) return;
    const preserveTruthyKeys = options?.preserveTruthyKeys === true;
    const targetKeys = Array.isArray(options?.keys) && options.keys.length > 0
      ? options.keys
      : ["daily", "weekly", "monthly", "selfStructure"];

    const prev = analysisUnreadStateRef.current || {
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

    analysisUnreadStateRef.current = next;

    if (Object.keys(groupPatch).length > 0) {
      setUnreadGroup("Analysis", groupPatch);
    }

    return next;
  }, [setUnreadGroup, ownerRequest, isOwnerCurrent]);

  const extractAnalysisUnreadFromStartupSnapshot = React.useCallback((payload) => {
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

    const analysisUnreadSection = readWireSectionObject(
      sections,
      ANALYSIS_WIRE.startupSections.unread
    );

    const unreadByType =
      analysisUnreadSection?.found &&
      analysisUnreadSection?.value &&
      typeof analysisUnreadSection.value.unread_by_type === "object" &&
      !Array.isArray(analysisUnreadSection.value.unread_by_type)
        ? analysisUnreadSection.value.unread_by_type
        : null;

    if (!unreadByType) return null;

    return {
      daily: !!unreadByType.daily,
      weekly: !!unreadByType.weekly,
      monthly: !!unreadByType.monthly,
      selfStructure: !!unreadByType.selfStructure,
    };
  }, []);

  const stripAnalysisUnreadFromStartupSnapshot = React.useCallback((payload) => {
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
        deleteWireSectionKeys(startupRoot.sections, ANALYSIS_WIRE.startupSections.unread);
        // Input/Home data is canonically owned by /home/state.
        // Keep startup focused on app-level seed / badge / prefetch concerns.
        delete startupRoot.sections.notice_current;
        delete startupRoot.sections.notices_current;
        delete startupRoot.sections.today_question;
        delete startupRoot.sections.today_question_light;
        delete startupRoot.sections.today_question_status;
        delete startupRoot.sections.today_question_popup;
      }

      return cloned;
    } catch {
      return null;
    }
  }, []);

  const __lastActivityLoginPingAtRef = React.useRef(0);
  const __lastUnreadPrefetchAtRef = React.useRef(0);
  const screenPrefetchTimerRef = React.useRef(null);

  const pingActivityLogin = React.useCallback(async () => {
    if (!isOwnerCurrent(ownerRequest)) return;
    try {
      const now = Date.now();
      const last = Number(__lastActivityLoginPingAtRef.current || 0) || 0;
      if (now - last < 10 * 1000) return;
      __lastActivityLoginPingAtRef.current = now;
      const url = `${API_BASE_URL}/activity/login`;
      const res = await apiFetch(url, {
        method: "POST",
        ...ownerRequest.options,
      });
      if (!res.ok) {}
    } catch {}
  }, [ownerRequest, isOwnerCurrent]);

  const refreshPieceUnreadBadge = React.useCallback(async () => {
    if (!isOwnerCurrent(ownerRequest)) return;
    try {
      if (isTutorialMode) {
        setUnread("Piece", "piecesNew", false);
        
        return;
      }
      const json = await apiGet(PIECE_WIRE.routes.publicUnreadStatus, ownerRequest.options);
      if (!isOwnerCurrent(ownerRequest)) return;
      const hasUnread = typeof json?.has_unread === "boolean" ? json.has_unread : typeof json?.hasUnread === "boolean" ? json.hasUnread : false;
      setUnread("Piece", "piecesNew", !!hasUnread);
    } catch {
      if (!isOwnerCurrent(ownerRequest)) return;
      setUnread("Piece", "piecesNew", false);
    }
  }, [isTutorialMode, setUnread, ownerRequest, isOwnerCurrent]);

  const getAnalysisSelfStructureLatestSeenStorageKey = React.useCallback(async () => {
    return isOwnerCurrent(ownerRequest)
      ? `${ANALYSIS_SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY}:${ownerRequest.owner}` : null;
  }, [ownerRequest, isOwnerCurrent]);

  const fetchAnalysisReportReadIdSet = React.useCallback(async (reportIds) => {
    if (!isOwnerCurrent(ownerRequest)) return new Set();
    const ids = Array.from(
      new Set(
        (Array.isArray(reportIds) ? reportIds : [])
          .map((id) => String(id || "").trim())
          .filter(Boolean)
      )
    );
    if (ids.length === 0) return new Set();

    const readSet = new Set();
    for (let i = 0; i < ids.length; i += ANALYSIS_REPORT_READ_STATUS_CHUNK_SIZE) {
      const chunk = ids.slice(i, i + ANALYSIS_REPORT_READ_STATUS_CHUNK_SIZE);
      if (chunk.length === 0) continue;
      const query = chunk
        .map((id) => `report_ids=${encodeURIComponent(id)}`)
        .join("&");
      if (!isOwnerCurrent(ownerRequest)) return new Set();
      const json = await apiGet(`/report-reads/status?${query}`, ownerRequest.options);
      if (!isOwnerCurrent(ownerRequest)) return new Set();
      const readIds = Array.isArray(json?.read_ids) ? json.read_ids : [];
      readIds.forEach((id) => {
        const normalized = String(id || "").trim();
        if (normalized) readSet.add(normalized);
      });
    }
    return readSet;
  }, [ownerRequest, isOwnerCurrent]);

  const fetchAnalysisSelfStructureLatestUnread = React.useCallback(async () => {
    if (!isPaid || !isOwnerCurrent(ownerRequest)) return false;

    const storageKey = await getAnalysisSelfStructureLatestSeenStorageKey();
    if (!storageKey || !isOwnerCurrent(ownerRequest)) return false;
    const [statusJson, seenVersionKey] = await Promise.all([
      apiGet(SELF_STRUCTURE_WIRE.routes.latestStatus, ownerRequest.options),
      AsyncStorage.getItem(storageKey),
    ]);
    if (!isOwnerCurrent(ownerRequest)) return false;

    const versionKey = String(statusJson?.version_key || "").trim();
    const hasVisibleContent = !!statusJson?.has_visible_content;
    const seenKey = String(seenVersionKey || "").trim();

    if (!versionKey || !hasVisibleContent) return false;
    return versionKey !== seenKey;
  }, [getAnalysisSelfStructureLatestSeenStorageKey, isPaid, ownerRequest, isOwnerCurrent]);

  const fetchAnalysisSelfStructureHistoryUnread = React.useCallback(async () => {
    if (!isPaid || !isOwnerCurrent(ownerRequest)) return false;

    const historyJson = await apiGet(
      buildSelfStructureReportHistoryPath({ reportType: "monthly", limit: ANALYSIS_SELF_STRUCTURE_HISTORY_FETCH_LIMIT, offset: 0 }), ownerRequest.options
    );
    if (!isOwnerCurrent(ownerRequest)) return false;
    const items = Array.isArray(historyJson?.items) ? historyJson.items : [];
    const ids = items
      .map((item) => String(item?.id || "").trim())
      .filter(Boolean);

    if (ids.length === 0) return false;

    const readSet = await fetchAnalysisReportReadIdSet(ids);
    return ids.some((id) => !readSet.has(id));
  }, [fetchAnalysisReportReadIdSet, isPaid, ownerRequest, isOwnerCurrent]);

  const clearAnalysisStartupWarmupTimer = React.useCallback(() => {
    try {
      if (analysisStartupWarmupTimerRef.current) {
        clearTimeout(analysisStartupWarmupTimerRef.current);
      }
    } catch {}
    analysisStartupWarmupTimerRef.current = null;
  }, []);

  const refreshAnalysisReportsUnreadBadge = React.useCallback(async (options = {}) => {
    if (!isOwnerCurrent(ownerRequest)) return;
    const preserveTruthyKeys = options?.preserveTruthyKeys === true;
    if (!preserveTruthyKeys) {
      analysisStartupWarmupSeqRef.current += 1;
      clearAnalysisStartupWarmupTimer();
    }

    const refreshSeq = ++analysisUnreadRefreshSeqRef.current;
    const isStale = () => !isOwnerCurrent(ownerRequest) || refreshSeq !== analysisUnreadRefreshSeqRef.current;
    const canResolveSelfStructureUnread = !subscriptionLoading;

    const applyBaseUnread = (unread) => {
      if (isStale()) return;
      applyAnalysisUnreadPatch(
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
      applyAnalysisUnreadPatch(
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
          fetchAnalysisSelfStructureLatestUnread().catch((e) => {
            console.warn("MainTabs: failed to refresh Analysis latest self-structure unread badge", e);
            return false;
          }),
          fetchAnalysisSelfStructureHistoryUnread().catch((e) => {
            console.warn("MainTabs: failed to refresh Analysis self-structure history unread badge", e);
            return false;
          }),
        ]).then(([latestUnread, historyUnread]) => !!latestUnread || !!historyUnread)
      : Promise.resolve(false);

    try {
      const json = await apiGet(`${ANALYSIS_WIRE.routes.reportsUnreadStatus}?${baseQuery}`, ownerRequest.options);
      const unread = json?.unread_by_type || {};
      applyBaseUnread(unread);
    } catch (e) {
      if (isStale()) return;
      console.warn("MainTabs: failed to refresh Analysis unread badges", e);
    }

    const selfStructureUnread = await selfStructurePromise;
    if (selfStructureUnread === undefined) return;
    applySelfStructureUnread(selfStructureUnread);
  }, [
    isPaid,
    subscriptionLoading,
    clearAnalysisStartupWarmupTimer,
    applyAnalysisUnreadPatch,
    fetchAnalysisSelfStructureLatestUnread,
    fetchAnalysisSelfStructureHistoryUnread,
    ownerRequest, isOwnerCurrent,
  ]);

  const fetchAndApplyStartupSnapshot = React.useCallback(async ({ forceRefresh = false, source = "startup", applyIf, preserveTruthyKeys = false } = {}) => {
    if (!isOwnerCurrent(ownerRequest)) return null;
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
    const json = await apiGet(path, ownerRequest.options);
    if (!isOwnerCurrent(ownerRequest)) return null;

    if (typeof applyIf === "function") {
      try {
        if (!applyIf()) return null;
      } catch {
        return null;
      }
    }

    const startupAnalysisUnread = extractAnalysisUnreadFromStartupSnapshot(json);
    if (startupAnalysisUnread) {
      applyAnalysisUnreadPatch(startupAnalysisUnread, {
        preserveTruthyKeys,
        keys: ["daily", "weekly", "monthly", "selfStructure"],
      });
    }

    const snapshotWithoutAnalysisUnread = stripAnalysisUnreadFromStartupSnapshot(json);
    if (!snapshotWithoutAnalysisUnread) return null;

    return applyStartupSnapshot(snapshotWithoutAnalysisUnread, {
      source,
      fetchedAt: Date.now(),
      replaceUnreadScopes: [],
      replacePrefetchScopes: false,
    });
  }, [
    applyAnalysisUnreadPatch,
    applyStartupSnapshot,
    extractAnalysisUnreadFromStartupSnapshot,
    stripAnalysisUnreadFromStartupSnapshot,
    ownerRequest, isOwnerCurrent,
  ]);

  const revalidateAnalysisUnreadFromStartup = React.useCallback(async ({ source = ANALYSIS_WIRE.startupSource.startup, applyIf } = {}) => {
    if (!isOwnerCurrent(ownerRequest)) return;
    try {
      await fetchAndApplyStartupSnapshot({
        forceRefresh: true,
        source,
        applyIf,
        preserveTruthyKeys: true,
      });
    } catch (e) {
      console.warn("MainTabs: failed to hydrate Analysis unread from startup snapshot", e);
    }

    if (!isOwnerCurrent(ownerRequest)) return;
    if (typeof applyIf === "function") {
      try {
        if (!applyIf()) return;
      } catch {
        return;
      }
    }

    try {
      await refreshAnalysisReportsUnreadBadge({ preserveTruthyKeys: true });
    } catch (e) {
      console.warn("MainTabs: failed to refresh Analysis unread badges on startup", e);
    }
  }, [fetchAndApplyStartupSnapshot, refreshAnalysisReportsUnreadBadge, ownerRequest, isOwnerCurrent]);

  const warmAnalysisUnreadAtStartup = React.useCallback(async ({ force = false, sourcePrefix = ANALYSIS_WIRE.startupSource.startup } = {}) => {
    if (!isOwnerCurrent(ownerRequest)) return;
    try {
      const now = Date.now();
      const last = Number(analysisStartupWarmupLastRunAtRef.current || 0) || 0;
      if (!force && now - last < ANALYSIS_STARTUP_WARMUP_MIN_INTERVAL_MS) return;
      analysisStartupWarmupLastRunAtRef.current = now;

      clearAnalysisStartupWarmupTimer();

      const warmupSeq = ++analysisStartupWarmupSeqRef.current;
      const isWarmupStale = () => !isOwnerCurrent(ownerRequest) || warmupSeq !== analysisStartupWarmupSeqRef.current;
      const applyIfCurrent = () => !isWarmupStale();
      if (!force) {
        try {
          await fetchAndApplyStartupSnapshot({
            forceRefresh: true,
            source: `${sourcePrefix}_seed`,
            applyIf: applyIfCurrent,
            preserveTruthyKeys: true,
          });
        } catch (e) {
          console.warn("MainTabs: failed to seed Analysis unread from startup snapshot", e);
        }
      }

      if (isWarmupStale()) return;

      await revalidateAnalysisUnreadFromStartup({
        source: `${sourcePrefix}_read_only`,
        applyIf: applyIfCurrent,
      });

      if (isWarmupStale()) return;

      analysisStartupWarmupTimerRef.current = setTimeout(() => {
        Promise.resolve()
          .then(async () => {
            if (isWarmupStale()) return;
            await revalidateAnalysisUnreadFromStartup({
              source: `${sourcePrefix}_final_revalidate`,
              applyIf: applyIfCurrent,
            });
          })
          .catch(() => null)
          .finally(() => {
            if (!isWarmupStale()) {
              analysisStartupWarmupTimerRef.current = null;
            }
          });
      }, ANALYSIS_STARTUP_REVALIDATE_DELAY_MS);
    } catch {}
  }, [
    clearAnalysisStartupWarmupTimer,
    fetchAndApplyStartupSnapshot,
    revalidateAnalysisUnreadFromStartup,
    ownerRequest, isOwnerCurrent,
  ]);

  const refreshEmotionLogUnreadState = React.useCallback(async () => {
    if (!isOwnerCurrent(ownerRequest)) return null;
    try {
      const json = await apiGet("/emotion-log/unread-status", ownerRequest.options);
      if (!isOwnerCurrent(ownerRequest)) return null;
      const nextFeed = !!json?.feed_unread;
      const nextRequests = !!json?.requests_unread;
      setUnread("EmotionLog", "feed", nextFeed);
      setUnread("EmotionLog", "requests", nextRequests);
      return { feed: nextFeed, requests: nextRequests };
    } catch (e) {
      if (!isOwnerCurrent(ownerRequest)) return null;
      console.warn("MainTabs: failed to refresh EmotionLog unread state", e);
      setUnread("EmotionLog", "feed", false);
      setUnread("EmotionLog", "requests", false);
      return null;
    }
  }, [setUnread, ownerRequest, isOwnerCurrent]);

  const markEmotionLogFeedRead = React.useCallback(async (lastSeenCreatedAt = null) => {
    if (!isOwnerCurrent(ownerRequest)) return;
    try {
      const body = lastSeenCreatedAt ? { last_seen_created_at: lastSeenCreatedAt } : {};
      await apiPost("/emotion-log/unread/read-feed", body, ownerRequest.options);
    } catch (e) {
      console.warn("MainTabs: failed to mark EmotionLog feed read", e);
    }
  }, [ownerRequest, isOwnerCurrent]);

  const PREFETCH_MAX_AGE_MS = 2 * 60 * 1000;
  const __lastScreenPrefetchAtRef = React.useRef(0);

  const formatTimeLabel = React.useCallback((iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }, []);

  const prefetchEmotionLogFeed = React.useCallback(async () => {
    if (!isOwnerCurrent(ownerRequest)) return;
    try {
      const userId = ownerRequest.owner;
      if (!userId) return;
      try {
        const fresh = getPrefetchEntryFresh?.("EmotionLog", "feed", PREFETCH_MAX_AGE_MS);
        if (fresh?.value?.userId && String(fresh.value.userId) === String(userId)) return;
      } catch {}

      const json = await apiGet("/emotion-log/feed", ownerRequest.options);
      if (!isOwnerCurrent(ownerRequest)) return;
      const rows = Array.isArray(json?.items) ? json.items : Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
      const mapped = rows.map((row) => ({
        id: row?.id,
        ownerName: row?.ownerName || row?.owner_name || "ユーザー",
        items: Array.isArray(row?.items) ? row.items : [],
        timeLabel: row?.timeLabel || formatTimeLabel(row?.created_at || row?.createdAt || null),
        createdAt: row?.createdAt || row?.created_at || null,
      }));
      try { setPrefetch("EmotionLog", "feed", { userId, items: mapped }); } catch {}
    } catch {}
  }, [formatTimeLabel, getPrefetchEntryFresh, setPrefetch, ownerRequest, isOwnerCurrent]);

  const prefetchPieceScreenData = React.useCallback(async () => {
    if (!isOwnerCurrent(ownerRequest)) return;
    try {
      const userId = ownerRequest.owner;

      try {
        const fresh = getPrefetchEntryFresh?.("Piece", "recoUsers", PREFETCH_MAX_AGE_MS);
        const isFresh = !!fresh?.value?.userId && String(fresh.value.userId) === String(userId);
        if (!isFresh) {
          const url = `${API_BASE_URL}${PIECE_WIRE.routes.recommendUsers}?limit=20`;
          const res = await apiFetch(url, { method: "GET", ...ownerRequest.options });
          const json = await res.json().catch(() => null);
          if (!isOwnerCurrent(ownerRequest)) return;
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
            setPrefetch("Piece", "recoUsers", { userId, items: users });
          }
        }
      } catch {}

      try {
        if (!isOwnerCurrent(ownerRequest)) return;
        const cacheKey = `qnaList:${userId}:newest`;
        const fresh = getPrefetchEntryFresh?.("Piece", cacheKey, PREFETCH_MAX_AGE_MS);
        const isFresh = !!fresh?.value?.targetUserId && String(fresh.value.targetUserId) === String(userId);
        if (!isFresh) {
          const json = await getNexusPiecesAsQnaList({
            targetUserId: userId,
            mode: "newest",
            limit: 100,
          }, ownerRequest.options);
          if (!isOwnerCurrent(ownerRequest)) return;
          const items = Array.isArray(json?.items) ? json.items : [];
          const meta = json?.meta && typeof json.meta === "object" ? json.meta : null;
          setPrefetch("Piece", cacheKey, { userId, targetUserId: userId, mode: "newest", items, meta });
        }
      } catch {}
    } catch {}
  }, [getPrefetchEntryFresh, setPrefetch, ownerRequest, isOwnerCurrent]);

  const runAllScreenPrefetch = React.useCallback(async () => {
    if (!isOwnerCurrent(ownerRequest)) return;
    try {
      const now = Date.now();
      const last = Number(__lastScreenPrefetchAtRef.current || 0) || 0;
      if (now - last < SCREEN_PREFETCH_MIN_INTERVAL_MS) return;
      __lastScreenPrefetchAtRef.current = now;
      const tasks = [prefetchEmotionLogFeed, prefetchPieceScreenData];
      for (const fn of tasks) {
        if (!isOwnerCurrent(ownerRequest)) return;
        try { await fn(); } catch {}
      }
    } catch {}
  }, [prefetchEmotionLogFeed, prefetchPieceScreenData, ownerRequest, isOwnerCurrent]);

  const runAllUnreadPrefetch = React.useCallback((opts = {}) => {
    if (!isOwnerCurrent(ownerRequest)) return;
    const includeScreenPrefetch = opts?.includeScreenPrefetch !== false;
    try { pingActivityLogin(); } catch {}

    try {
      const now = Date.now();
      const last = Number(__lastUnreadPrefetchAtRef.current || 0) || 0;
      if (now - last < UNREAD_PREFETCH_MIN_INTERVAL_MS) return;
      __lastUnreadPrefetchAtRef.current = now;
    } catch {}

    const tasks = [
      refreshEmotionLogUnreadState,
      refreshPieceUnreadBadge,
      warmAnalysisUnreadAtStartup,
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
    refreshEmotionLogUnreadState,
    refreshPieceUnreadBadge,
    warmAnalysisUnreadAtStartup,
    runAllScreenPrefetch,
    ownerRequest, isOwnerCurrent,
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
        navigationRef.navigate("Analysis", buildAnalysisRootNavigationParams({
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
      analysisStartupWarmupSeqRef.current += 1;
      clearAnalysisStartupWarmupTimer();
    };
  }, [clearAnalysisStartupWarmupTimer]);

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
      analysisSubscriptionRefreshPendingRef.current = true;
      return;
    }
    if (!analysisSubscriptionRefreshPendingRef.current) return;
    analysisSubscriptionRefreshPendingRef.current = false;
    Promise.resolve()
      .then(() =>
        warmAnalysisUnreadAtStartup({
          force: true,
          sourcePrefix: isPaid ? ANALYSIS_WIRE.startupSource.ready : ANALYSIS_WIRE.startupSource.resolved,
        })
      )
      .catch(() => null);
  }, [isPaid, subscriptionLoading, warmAnalysisUnreadAtStartup]);

  useEffect(() => {
    if (subscriptionLoading) return;
    if (isPaid) return;
    hideSelfStructureBanner();
    selfStructureLatestInitializedRef.current = false;
    selfStructureLatestVersionRef.current = null;
  }, [hideSelfStructureBanner, isPaid, subscriptionLoading]);

  const refreshSelfStructureLatestStatus = React.useCallback(async () => {
    if (subscriptionLoading || !isPaid || !isAppActive || !isOwnerCurrent(ownerRequest)) return;
    try {
      const json = await apiGet(SELF_STRUCTURE_WIRE.routes.latestStatus, ownerRequest.options);
      if (!isOwnerCurrent(ownerRequest)) return;
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
  }, [isAppActive, isPaid, showSelfStructureBanner, subscriptionLoading, ownerRequest, isOwnerCurrent]);

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
      try { await refreshEmotionLogUnreadState(); } catch {}
    };
    tick();
    intervalId = setInterval(tick, EMOTION_LOG_UNREAD_POLL_MS);
    return () => {
      cancelled = true;
      try { if (intervalId) clearInterval(intervalId); } catch {}
    };
  }, [refreshEmotionLogUnreadState]);

  useEffect(() => {
    if (activeRouteName !== "Piece") return;
    (async () => { await refreshEmotionLogUnreadState(); })();
  }, [activeRouteName, refreshEmotionLogUnreadState]);

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
          今のわたしマップが更新されました
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.TEXT_SUBTLE} />
    </TouchableOpacity>
  ) : null;

  return (
    <View style={{ flex: 1 }}>
    <View style={{ flex: 1 }} accessibilityElementsHidden={!appStartupReady} importantForAccessibility={appStartupReady ? "auto" : "no-hide-descendants"}>
    <GlobalFrameLayout frameEnabled={frameEnabled} headerBottomSlot={selfStructureBannerHud}>
      <Tab.Navigator
        backBehavior="history"
        initialRouteName="Input"
        tabBar={(props) => (isTutorialMode ? null : <CocolonTabBar {...props} />)}
        screenListeners={{
          state: (e) => {
            const st = e?.data?.state;
            const name = st?.routes?.[st?.index]?.name;
            if (!name) return;
            setActiveRouteName((prev) => (prev === name ? prev : name));
            let leaf = st?.routes?.[st?.index];
            while (leaf?.state?.routes?.length) leaf = leaf.state.routes[leaf.state.index || 0];
            setActiveLeafName(leaf?.name || name);
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
          tabBarLabelPosition: "below-icon",
          tabBarIconStyle: { width: 54, height: tabIconAreaHeight },
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;
            switch (route.name) {
              case "Input": iconName = "create-outline"; break;
              case "Analysis": iconName = "globe-outline"; break;
              case "Piece": iconName = "cube-outline"; break;
              case "Settings": iconName = "settings-outline"; break;
              default: iconName = "ellipse-outline";
            }
            const icon = <Ionicons name={iconName} size={20} color={focused ? colors.ACCENT_TEXT : color} />;
            const showUnreadBadge = showTabUnreadBadge(route.name);
            return (
              <View style={{ width: 54, minHeight: tabIconAreaHeight, borderRadius: 17,
                backgroundColor: focused ? colors.GOLD_BUTTON : "transparent",
                alignItems: "center", justifyContent: "center", overflow: "visible" }}>
                {icon}
                {showUnreadBadge ? (
                  <BottomTabUnreadBadge
                    visible={showUnreadBadge}
                    style={{ position: "absolute", top: 0, right: -4, minHeight: 22, paddingHorizontal: 4, paddingVertical: 1 }}
                  />
                ) : null}
              </View>
            );
          },
          tabBarActiveTintColor: colors.TITLE_GOLD,
          tabBarInactiveTintColor: colors.TEXT_SUBTLE,
          tabBarStyle: {
            backgroundColor: colors.SURFACE_TONAL,
            borderTopColor: colors.CARD_BORDER,
            borderTopWidth: 0,
            paddingTop: 8,
            height: tabBarContentHeight + insets.bottom,
            paddingBottom: insets.bottom,
          },
          tabBarLabel: ({ focused, color }) => {
            let label;
            switch (route.name) {
              case "Input": label = "ホーム"; break;
              case "Analysis": label = "分析"; break;
              case "Piece": label = "ピース"; break;
              case "Settings": label = "設定"; break;
              default: label = route.name;
            }
            const showUnreadBadge = showTabUnreadBadge(route.name);
            const labelColor = focused || !showUnreadBadge ? color : colors.TEXT_ON_LIGHT;
            return <Text style={{ color: labelColor, fontSize: 12, lineHeight: tabLabelLineHeight, includeFontPadding: false, textAlign: "center", fontWeight: focused || showUnreadBadge ? "600" : "400" }}>{label}</Text>;
          },
        })}
      >
        <Tab.Screen
          name="Input"
          listeners={({ navigation, route }) => ({ tabPress: (e) => handleMainTabPress(route.name, navigation, route, e) })}
        >
          {(props) => <InputStackNavigator {...props} onInitialInputSettled={onInitialInputSettled}
            appStartupReady={appStartupReady} saveRecovery={saveRecovery} />}
        </Tab.Screen>
        <Tab.Screen
          name="Analysis"
          listeners={({ navigation, route }) => ({ tabPress: (e) => handleMainTabPress(route.name, navigation, route, e) })}
        >
          {(tabProps) => (
            <AnalysisStackNavigator
              {...tabProps}
              onSetPieceLinkPayload={setPieceLinkPayload}
              onRefreshTabUnread={refreshAnalysisReportsUnreadBadge}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Piece"
          listeners={({ navigation, route }) => ({ tabPress: (e) => handleMainTabPress(route.name, navigation, route, e) })}
        >
          {(tabProps) => (
            <PieceStackNavigator
              {...tabProps}
              saveRecovery={saveRecovery}
              linkPayload={pieceLinkPayload}
              onConsumeLinkPayload={() => setPieceLinkPayload(null)}
              onEmotionLogDisplayed={async (lastSeenCreatedAt) => {
                await markEmotionLogFeedRead(lastSeenCreatedAt || null);
                await refreshEmotionLogUnreadState();
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
    </View>
    {!appStartupReady ? <AppStartupLoadingView overlay /> : null}
    </View>
  );
}


