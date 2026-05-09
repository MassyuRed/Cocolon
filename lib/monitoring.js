import { Platform } from "react-native";

import { supabase } from "./supabase";
import { readRuntimeApiBaseUrl } from "./compat/legacyWireContracts";

const APP_VERSION = process.env.EXPO_PUBLIC_APP_VERSION || "dev";
const APP_BUILD = process.env.EXPO_PUBLIC_APP_BUILD || "dev";
const MONITORING_ENABLED_RAW = String(process.env.EXPO_PUBLIC_COCOLON_MONITORING_ENABLED || "").trim().toLowerCase();
const MONITORING_ENDPOINT = String(process.env.EXPO_PUBLIC_COCOLON_MONITORING_ENDPOINT || "/ops/client-events").trim() || "/ops/client-events";
const MONITORING_SAMPLE_RATE = (() => {
  const raw = Number(process.env.EXPO_PUBLIC_COCOLON_MONITORING_SAMPLE_RATE || 1);
  return Number.isFinite(raw) ? Math.max(0, Math.min(1, raw)) : 1;
})();
const MAX_STRING_LENGTH = 800;
const MAX_META_KEYS = 24;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const UUID_RE = /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi;
const TOKENISH_RE = /\b(?:Bearer\s+)?[A-Za-z0-9_=-]{24,}(?:\.[A-Za-z0-9_=-]{8,}){0,2}\b/g;

let initialized = false;
let previousGlobalHandler = null;
const recentEventKeys = new Map();

function isMonitoringEnabled() {
  if (MONITORING_ENABLED_RAW === "0" || MONITORING_ENABLED_RAW === "false" || MONITORING_ENABLED_RAW === "off") return false;
  if (MONITORING_ENABLED_RAW === "1" || MONITORING_ENABLED_RAW === "true" || MONITORING_ENABLED_RAW === "on") return true;
  return typeof __DEV__ === "undefined" ? true : !__DEV__;
}

function shouldSample(severity) {
  if (String(severity || "").toLowerCase() === "error" || String(severity || "").toLowerCase() === "fatal") return true;
  if (MONITORING_SAMPLE_RATE >= 1) return true;
  if (MONITORING_SAMPLE_RATE <= 0) return false;
  return Math.random() <= MONITORING_SAMPLE_RATE;
}

function redactText(value) {
  return String(value ?? "")
    .replace(EMAIL_RE, "[redacted-email]")
    .replace(UUID_RE, "[redacted-id]")
    .replace(TOKENISH_RE, "[redacted-token]");
}

function truncate(value, limit = MAX_STRING_LENGTH) {
  const text = redactText(value);
  if (text.length <= limit) return text;
  return `${text.slice(0, Math.max(0, limit - 1))}…`;
}

function sanitizeValue(value, depth = 0) {
  if (value == null) return value;
  if (typeof value === "string") return truncate(value);
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (typeof value === "function") return "[function]";
  if (depth >= 2) return truncate(JSON.stringify(value));
  if (Array.isArray(value)) return value.slice(0, 12).map((item) => sanitizeValue(item, depth + 1));
  if (typeof value === "object") {
    const out = {};
    const entries = Object.entries(value).slice(0, MAX_META_KEYS);
    for (const [key, item] of entries) {
      const k = String(key || "");
      if (/token|authorization|password|secret|apikey|api_key|access_token|refresh_token/i.test(k)) {
        out[k] = "[redacted]";
      } else {
        out[k] = sanitizeValue(item, depth + 1);
      }
    }
    return out;
  }
  return truncate(value);
}

function normalizeError(error) {
  if (!error) return { error_name: "Error", error_message: "" };
  return {
    error_name: truncate(error?.name || error?.constructor?.name || "Error", 120),
    error_message: truncate(error?.message || error, 500),
    status_code: Number.isFinite(Number(error?.status)) ? Number(error.status) : undefined,
  };
}

function buildClientEventId() {
  return `rn_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function dedupeKey(payload) {
  return [payload?.event_name, payload?.severity, payload?.scope, payload?.api_path, payload?.error_name, payload?.error_message].map((v) => String(v || "").slice(0, 120)).join("|");
}

function shouldDeduplicate(payload) {
  const key = dedupeKey(payload);
  const now = Date.now();
  const last = recentEventKeys.get(key) || 0;
  if (now - last < 5000) return true;
  recentEventKeys.set(key, now);
  if (recentEventKeys.size > 80) {
    for (const [eventKey, at] of recentEventKeys.entries()) {
      if (now - at > 30000) recentEventKeys.delete(eventKey);
    }
  }
  return false;
}

function resolveMonitoringUrl() {
  const endpoint = MONITORING_ENDPOINT;
  if (/^https?:\/\//i.test(endpoint)) return endpoint;
  const base = readRuntimeApiBaseUrl();
  if (endpoint.startsWith("/")) return `${base}${endpoint}`;
  return `${base}/${endpoint}`;
}

async function getAuthorizationHeader() {
  try {
    const { data } = await supabase.auth.getSession();
    const accessToken = data?.session?.access_token ?? null;
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  } catch {
    return {};
  }
}

async function postClientEvent(payload) {
  if (!isMonitoringEnabled() || !shouldSample(payload?.severity)) return;
  if (shouldDeduplicate(payload)) return;

  const body = {
    client_event_id: payload.client_event_id || buildClientEventId(),
    event_name: truncate(payload.event_name || "client_event", 140),
    severity: truncate(payload.severity || "info", 24),
    source: "react_native",
    scope: truncate(payload.scope || "app", 80),
    route: truncate(payload.route || "", 160),
    api_path: truncate(payload.api_path || "", 240),
    status_code: payload.status_code,
    error_name: truncate(payload.error_name || "", 120),
    error_message: truncate(payload.error_message || "", 500),
    message: truncate(payload.message || "", 500),
    app_version: APP_VERSION,
    app_build: APP_BUILD,
    platform: Platform.OS,
    meta: sanitizeValue(payload.meta || {}),
  };

  try {
    const authHeaders = await getAuthorizationHeader();
    await globalThis.fetch(resolveMonitoringUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-Version": APP_VERSION,
        "X-App-Build": APP_BUILD,
        "X-Platform": Platform.OS,
        ...authHeaders,
      },
      body: JSON.stringify(body),
    });
  } catch {
    // Monitoring must never break app runtime.
  }
}

export function captureClientEvent(eventName, payload = {}) {
  void postClientEvent({
    ...payload,
    event_name: eventName,
    severity: payload?.severity || "info",
  });
}

export function captureClientError(error, payload = {}) {
  const normalized = normalizeError(error);
  void postClientEvent({
    ...payload,
    ...normalized,
    event_name: payload?.event_name || "client_error",
    severity: payload?.severity || "error",
  });
}

export function captureApiError(error, context = {}) {
  const normalized = normalizeError(error);
  void postClientEvent({
    event_name: "api_error",
    severity: "error",
    scope: context?.scope || "apiClient",
    api_path: context?.path || context?.pathOrUrl || "",
    status_code: normalized.status_code,
    error_name: normalized.error_name,
    error_message: normalized.error_message,
    meta: {
      method: context?.method || "GET",
      timeoutMs: context?.timeoutMs,
      baseUrl: context?.baseUrl,
      timedOut: error?.name === "TimeoutError",
    },
  });
}

export function initProductionMonitoring() {
  if (initialized) return;
  initialized = true;

  try {
    const errorUtils = globalThis.ErrorUtils;
    if (errorUtils && typeof errorUtils.getGlobalHandler === "function" && typeof errorUtils.setGlobalHandler === "function") {
      previousGlobalHandler = errorUtils.getGlobalHandler();
      errorUtils.setGlobalHandler((error, isFatal) => {
        captureClientError(error, {
          event_name: "js_global_error",
          severity: isFatal ? "fatal" : "error",
          scope: "global",
          meta: { isFatal: !!isFatal },
        });
        try {
          if (typeof previousGlobalHandler === "function") previousGlobalHandler(error, isFatal);
        } catch {}
      });
    }
  } catch {}

  captureClientEvent("app_monitoring_initialized", {
    severity: "info",
    scope: "app",
    meta: { enabled: isMonitoringEnabled() },
  });
}
