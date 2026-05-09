import { Platform } from "react-native";
import { supabase } from "./supabase";
import { readRuntimeApiBaseUrl } from "./compat/legacyWireContracts";
import { captureApiError } from "./monitoring";

export const API_BASE_URL = readRuntimeApiBaseUrl();

const APP_VERSION = process.env.EXPO_PUBLIC_APP_VERSION || "dev";
const APP_BUILD = process.env.EXPO_PUBLIC_APP_BUILD || "dev";
const DEFAULT_API_TIMEOUT_MS = 15000;

export async function getAccessToken() {
  try {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token ?? null;
  } catch {
    return null;
  }
}

export async function buildCompatHeaders(extra = {}, auth = true) {
  const headers = {
    "Content-Type": "application/json",
    "X-App-Version": APP_VERSION,
    "X-App-Build": APP_BUILD,
    "X-Platform": Platform.OS,
    ...extra,
  };

  if (auth) {
    const accessToken = await getAccessToken();
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return headers;
}

async function parseApiResponse(res) {
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!res.ok) {
    const detail = json?.detail || json?.message || text || `HTTP ${res.status}`;
    const err = new Error(String(detail));
    err.status = res.status;
    err.body = json ?? text;
    throw err;
  }

  return json;
}

function resolveApiUrl(pathOrUrl, baseUrl = API_BASE_URL) {
  const raw = typeof pathOrUrl === "string" ? pathOrUrl : String(pathOrUrl || "");
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("/")) return `${baseUrl}${raw}`;
  return `${baseUrl}/${raw}`;
}

function createFetchSignal({ signal, timeoutMs }) {
  const hasAbortController = typeof AbortController !== "undefined";
  const hasExternalSignal = !!signal;
  const effectiveTimeoutMs =
    Number.isFinite(Number(timeoutMs)) && Number(timeoutMs) > 0
      ? Number(timeoutMs)
      : 0;

  if (!hasAbortController) {
    return {
      signal,
      didTimeoutRef: { current: false },
      cleanup: () => {},
    };
  }

  if (!hasExternalSignal && !effectiveTimeoutMs) {
    return {
      signal: undefined,
      didTimeoutRef: { current: false },
      cleanup: () => {},
    };
  }

  const controller = new AbortController();
  const didTimeoutRef = { current: false };

  const abortFromExternal = () => {
    try {
      controller.abort();
    } catch {
      // noop
    }
  };

  if (hasExternalSignal) {
    if (signal.aborted) {
      abortFromExternal();
    } else if (typeof signal.addEventListener === "function") {
      signal.addEventListener("abort", abortFromExternal);
    }
  }

  let timerId = null;
  if (effectiveTimeoutMs) {
    timerId = setTimeout(() => {
      didTimeoutRef.current = true;
      try {
        controller.abort();
      } catch {
        // noop
      }
    }, effectiveTimeoutMs);
  }

  return {
    signal: controller.signal,
    didTimeoutRef,
    cleanup: () => {
      try {
        if (timerId) clearTimeout(timerId);
      } catch {
        // noop
      }
      try {
        if (hasExternalSignal && typeof signal?.removeEventListener === "function") {
          signal.removeEventListener("abort", abortFromExternal);
        }
      } catch {
        // noop
      }
    },
  };
}

export async function apiFetch(
  pathOrUrl,
  {
    method = "GET",
    auth = true,
    headers = {},
    baseUrl = API_BASE_URL,
    signal,
    body,
    timeoutMs = DEFAULT_API_TIMEOUT_MS,
    ...fetchOpts
  } = {}
) {
  const mergedHeaders = await buildCompatHeaders(headers, auth);
  const { signal: mergedSignal, didTimeoutRef, cleanup } = createFetchSignal({
    signal,
    timeoutMs,
  });

  try {
    return await fetch(resolveApiUrl(pathOrUrl, baseUrl), {
      method,
      headers: mergedHeaders,
      body,
      signal: mergedSignal,
      ...fetchOpts,
    });
  } catch (err) {
    if (didTimeoutRef.current) {
      const timeoutError = new Error(`Request timed out after ${Number(timeoutMs)}ms`);
      timeoutError.name = "TimeoutError";
      throw timeoutError;
    }
    throw err;
  } finally {
    cleanup();
  }
}

export async function apiJson(
  path,
  {
    method = "GET",
    body,
    auth = true,
    headers = {},
    baseUrl = API_BASE_URL,
    signal,
    timeoutMs = DEFAULT_API_TIMEOUT_MS,
    ...fetchOpts
  } = {}
) {
  try {
    const res = await apiFetch(path, {
      method,
      auth,
      headers,
      baseUrl,
      signal,
      timeoutMs,
      body: body === undefined ? undefined : JSON.stringify(body),
      ...fetchOpts,
    });
    return await parseApiResponse(res);
  } catch (err) {
    captureApiError(err, { path, method, baseUrl, timeoutMs });
    throw err;
  }
}

export function apiGet(path, opts = {}) {
  return apiJson(path, { ...opts, method: "GET" });
}

export function apiPost(path, body, opts = {}) {
  return apiJson(path, { ...opts, method: "POST", body });
}

export function apiPatch(path, body, opts = {}) {
  return apiJson(path, { ...opts, method: "PATCH", body });
}
