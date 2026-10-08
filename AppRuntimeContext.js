import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppState } from "react-native";

import { apiGet } from "./lib/apiClient";
import { PIECE_FEATURE_DEFAULTS, isPieceFeatureFlag, normalizePieceFeatureFlags, withoutPieceFeatureFlags, isPieceFeatureEnabled } from "./features/piece/pieceRuntime";

const DEFAULT_FEATURE_FLAGS = Object.freeze({
  ...PIECE_FEATURE_DEFAULTS,
  account_delete_enabled: true,
  emlis_threads_enabled: false,
  myweb_mock_enabled: false,
  today_question_enabled: true,
  today_question_history_enabled: true,
  subscription_sales_enabled: true,
});

const CURRENT_APP_VERSION = String(process.env.EXPO_PUBLIC_APP_VERSION || "").trim();
const CURRENT_APP_BUILD = String(process.env.EXPO_PUBLIC_APP_BUILD || "").trim();

function normalizeOptionalString(value) {
  const normalized = String(value || "").trim();
  return normalized || null;
}

function normalizeFeatureFlags(rawFlags) {
  const nextFlags = { ...DEFAULT_FEATURE_FLAGS };
  if (rawFlags && typeof rawFlags === "object" && !Array.isArray(rawFlags)) {
    for (const [key, value] of Object.entries(rawFlags)) {
      const normalizedKey = String(key || "").trim();
      if (!normalizedKey || isPieceFeatureFlag(normalizedKey)) continue;
      if (typeof value === "boolean") {
        nextFlags[normalizedKey] = value;
      }
    }
  }
  return { ...nextFlags, ...normalizePieceFeatureFlags(rawFlags) };
}

function parseVersionParts(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;

  const cleaned = raw.replace(/^v/i, "").split(/[+-]/)[0];
  if (!/^\d+(\.\d+)*$/.test(cleaned)) return null;

  const parts = cleaned.split(".").map((part) => Number(part));
  if (!parts.length || parts.some((part) => !Number.isInteger(part) || part < 0)) {
    return null;
  }

  while (parts.length < 3) parts.push(0);
  return parts.slice(0, 3);
}

function isVersionBelow(currentVersion, requiredVersion) {
  const currentParts = parseVersionParts(currentVersion);
  const requiredParts = parseVersionParts(requiredVersion);
  if (!currentParts || !requiredParts) return false;

  for (let i = 0; i < 3; i += 1) {
    if (currentParts[i] < requiredParts[i]) return true;
    if (currentParts[i] > requiredParts[i]) return false;
  }
  return false;
}

function buildRuntimeState(payload, overrides = {}) {
  const featureFlags = normalizeFeatureFlags(payload?.feature_flags);
  const minimumSupportedVersion = normalizeOptionalString(payload?.minimum_supported_version);
  const recommendedVersion = normalizeOptionalString(payload?.recommended_version);
  const maintenanceMessage = normalizeOptionalString(payload?.maintenance_message);
  const currentAppVersion = CURRENT_APP_VERSION || null;
  const currentAppBuild = CURRENT_APP_BUILD || null;
  const isMinimumVersionBlocked = isVersionBelow(currentAppVersion, minimumSupportedVersion);
  const isRecommendedVersionOutdated =
    !isMinimumVersionBlocked && isVersionBelow(currentAppVersion, recommendedVersion);

  return {
    loaded: true,
    loading: false,
    error: null,
    raw: payload || null,
    featureFlags,
    minimumSupportedVersion,
    recommendedVersion,
    maintenanceMessage,
    clientMeta:
      payload?.client_meta && typeof payload.client_meta === "object" && !Array.isArray(payload.client_meta)
        ? payload.client_meta
        : {},
    currentAppVersion,
    currentAppBuild,
    versionStatus: {
      minimumBlocked: isMinimumVersionBlocked,
      recommendedOutdated: isRecommendedVersionOutdated,
    },
    ...overrides,
  };
}

const INITIAL_RUNTIME_STATE = Object.freeze({
  loaded: false,
  loading: true,
  error: null,
  raw: null,
  featureFlags: { ...DEFAULT_FEATURE_FLAGS },
  minimumSupportedVersion: null,
  recommendedVersion: null,
  maintenanceMessage: null,
  clientMeta: {},
  currentAppVersion: CURRENT_APP_VERSION || null,
  currentAppBuild: CURRENT_APP_BUILD || null,
  versionStatus: {
    minimumBlocked: false,
    recommendedOutdated: false,
  },
});

const AppRuntimeContext = createContext({
  runtime: INITIAL_RUNTIME_STATE,
  featureFlags: INITIAL_RUNTIME_STATE.featureFlags,
  refreshAppRuntime: async () => INITIAL_RUNTIME_STATE,
  isFeatureEnabled: (name, fallback = true) => isPieceFeatureFlag(String(name || "").trim()) ? false : Boolean(fallback),
});

export function AppRuntimeProvider({ children }) {
  const [runtime, setRuntime] = useState(INITIAL_RUNTIME_STATE);
  const refreshSequence = useRef(0);
  const latestRuntime = useRef(INITIAL_RUNTIME_STATE);
  const restartInterruptedRefresh = useRef(false);

  const refreshAppRuntime = useCallback(async () => {
    const sequence = ++refreshSequence.current;
    // Do not expose cached Piece=true while checking a newer server state.
    // Keep the previous non-Piece flags, version data and child placement.
    const pending = {
      ...latestRuntime.current,
      loading: true,
      error: null,
      featureFlags: withoutPieceFeatureFlags(latestRuntime.current.featureFlags),
    };
    latestRuntime.current = pending;
    setRuntime(pending);

    try {
      const payload = await apiGet("/app/bootstrap", { auth: false });
      // A late success cannot undo a newer failure/OFF response. Return the
      // current snapshot, not a stale true value for this promise's caller.
      if (sequence !== refreshSequence.current) return latestRuntime.current;
      const nextRuntime = buildRuntimeState(payload);
      // A background/unknown-state bootstrap may update normal app metadata,
      // but it cannot authorize a cached Piece presentation on the next resume.
      if (AppState.currentState !== "active") {
        nextRuntime.featureFlags = withoutPieceFeatureFlags(nextRuntime.featureFlags);
      }
      latestRuntime.current = nextRuntime;
      setRuntime(nextRuntime);
      return nextRuntime;
    } catch (error) {
      if (sequence === refreshSequence.current) {
        const failed = {
          ...latestRuntime.current,
          loaded: true,
          loading: false,
          error,
          featureFlags: withoutPieceFeatureFlags(latestRuntime.current.featureFlags),
        };
        latestRuntime.current = failed;
        setRuntime(failed);
      }
      // Preserve the existing rejection contract; obsolete errors do not
      // replace a newer successful global runtime state.
      throw error;
    }
  }, []);

  useEffect(() => {
    let listening = true;
    let previousAppState = AppState.currentState;

    const invalidatePiecePresentation = (publish) => {
      // Fence a request that began before this lifecycle boundary. No server
      // operation is cancelled or retried, and no non-Piece flag is reset.
      refreshSequence.current += 1;
      const invalidated = {
        ...latestRuntime.current,
        featureFlags: withoutPieceFeatureFlags(latestRuntime.current.featureFlags),
      };
      latestRuntime.current = invalidated;
      if (publish) setRuntime(invalidated);
    };

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (!listening || nextAppState === previousAppState) return;
      previousAppState = nextAppState;
      if (nextAppState !== "active") {
        invalidatePiecePresentation(true);
        return;
      }
      // The existing refresh synchronously clears cached Piece=true. This is
      // one bootstrap per active transition, never a preview generation/retry.
      // Its failure state is already published by the existing runtime owner.
      void refreshAppRuntime().catch(() => {});
    });

    if (previousAppState !== "active") invalidatePiecePresentation(true);
    else if (restartInterruptedRefresh.current) {
      // Effect replay can cancel the bootstrap while the child gate is still
      // single-flight. Restart that interrupted read instead of leaving loading
      // stuck; this is not a retry of generation or a failed server operation.
      restartInterruptedRefresh.current = false;
      void refreshAppRuntime().catch(() => {});
    } else setRuntime(latestRuntime.current);
    // Initial active startup remains owned by AppRuntimeBootstrapGate.
    return () => {
      listening = false;
      restartInterruptedRefresh.current = latestRuntime.current.loading && refreshSequence.current > 0;
      subscription.remove();
      invalidatePiecePresentation(false);
    };
  }, [refreshAppRuntime]);

  const isFeatureEnabled = useCallback(
    (name, fallback = true) => {
      const key = String(name || "").trim();
      if (!key) return Boolean(fallback);
      if (isPieceFeatureFlag(key)) {
        return AppState.currentState === "active" && isPieceFeatureEnabled(key, latestRuntime.current);
      }
      const value = runtime?.featureFlags?.[key];
      return typeof value === "boolean" ? value : Boolean(fallback);
    },
    [runtime?.featureFlags]
  );

  const value = useMemo(
    () => ({
      runtime,
      featureFlags: runtime.featureFlags,
      refreshAppRuntime,
      isFeatureEnabled,
    }),
    [isFeatureEnabled, refreshAppRuntime, runtime]
  );

  return (
    <AppRuntimeContext.Provider value={value}>
      {children}
    </AppRuntimeContext.Provider>
  );
}

export function useAppRuntime() {
  return useContext(AppRuntimeContext);
}
