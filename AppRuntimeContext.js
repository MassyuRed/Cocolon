import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

import { apiGet } from "./lib/apiClient";

const DEFAULT_FEATURE_FLAGS = Object.freeze({
  account_delete_enabled: true,
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
      if (!normalizedKey) continue;
      if (typeof value === "boolean") {
        nextFlags[normalizedKey] = value;
      }
    }
  }
  return nextFlags;
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
  isFeatureEnabled: (name, fallback = true) => Boolean(fallback),
});

export function AppRuntimeProvider({ children }) {
  const [runtime, setRuntime] = useState(INITIAL_RUNTIME_STATE);

  const refreshAppRuntime = useCallback(async () => {
    setRuntime((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const payload = await apiGet("/app/bootstrap", { auth: false });
      const nextRuntime = buildRuntimeState(payload);
      setRuntime(nextRuntime);
      return nextRuntime;
    } catch (error) {
      setRuntime((prev) => ({
        ...prev,
        loaded: true,
        loading: false,
        error,
      }));
      throw error;
    }
  }, []);

  const isFeatureEnabled = useCallback(
    (name, fallback = true) => {
      const key = String(name || "").trim();
      if (!key) return Boolean(fallback);
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
