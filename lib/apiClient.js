import { Platform } from "react-native";
import { supabase } from "./supabase";

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_MYMODEL_API_URL || "https://mashos-api.onrender.com"
).replace(/\/+$/, "");

const APP_VERSION = process.env.EXPO_PUBLIC_APP_VERSION || "dev";
const APP_BUILD = process.env.EXPO_PUBLIC_APP_BUILD || "dev";
const inFlightMap = new Map();
const responseCacheMap = new Map();
const RESPONSE_CACHE_MAX_ENTRIES = 200;

function normalizeMethod(method) {
  return String(method || "GET").trim().toUpperCase() || "GET";
}

function isObjectRecord(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function safeJsonClone(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return value;
  }
}

function normalizeHeadersForKey(headers) {
  if (!isObjectRecord(headers)) return {};

  const normalized = {};
  Object.keys(headers).forEach((key) => {
    const lowered = String(key || "").trim().toLowerCase();
    if (!lowered || lowered === "authorization") return;
    normalized[lowered] = headers[key];
  });

  return Object.keys(normalized)
    .sort()
    .reduce((acc, key) => {
      acc[key] = normalized[key];
      return acc;
    }, {});
}

function createAbortError() {
  const err = new Error("The operation was aborted.");
  err.name = "AbortError";
  return err;
}

function withAbort(promise, signal) {
  if (!signal) return promise;
  if (signal.aborted) return Promise.reject(createAbortError());

  return new Promise((resolve, reject) => {
    const onAbort = () => reject(createAbortError());

    try {
      signal.addEventListener("abort", onAbort, { once: true });
    } catch {
      // noop
    }

    Promise.resolve(promise)
      .then(resolve, reject)
      .finally(() => {
        try {
          signal.removeEventListener("abort", onAbort);
        } catch {
          // noop
        }
      });
  });
}

function pruneApiResponseCache(now = Date.now()) {
  for (const [key, entry] of responseCacheMap.entries()) {
    const staleUntilAt = Number(entry?.staleUntilAt ?? 0) || 0;
    if (staleUntilAt && staleUntilAt <= now) {
      responseCacheMap.delete(key);
    }
  }

  if (responseCacheMap.size <= RESPONSE_CACHE_MAX_ENTRIES) return;

  const entries = Array.from(responseCacheMap.entries()).sort((a, b) => {
    const aCachedAt = Number(a?.[1]?.cachedAt ?? 0) || 0;
    const bCachedAt = Number(b?.[1]?.cachedAt ?? 0) || 0;
    return aCachedAt - bCachedAt;
  });

  while (responseCacheMap.size > RESPONSE_CACHE_MAX_ENTRIES && entries.length > 0) {
    const [key] = entries.shift();
    responseCacheMap.delete(key);
  }
}

function getCachedEntry(cacheKey, now = Date.now()) {
  const entry = responseCacheMap.get(cacheKey);
  if (!entry || typeof entry !== "object") return null;

  const staleUntilAt = Number(entry?.staleUntilAt ?? 0) || 0;
  if (staleUntilAt && staleUntilAt <= now) {
    responseCacheMap.delete(cacheKey);
    return null;
  }

  return entry;
}

function isFreshCacheEntry(entry, now = Date.now()) {
  if (!entry || typeof entry !== "object") return false;
  const expiresAt = Number(entry?.expiresAt ?? 0) || 0;
  return expiresAt > now;
}

function setCachedEntry(cacheKey, value, ttlMs) {
  const ttl = Number(ttlMs);
  if (!cacheKey || !Number.isFinite(ttl) || ttl <= 0) {
    responseCacheMap.delete(cacheKey);
    return;
  }

  const now = Date.now();
  responseCacheMap.set(cacheKey, {
    value: safeJsonClone(value),
    cachedAt: now,
    expiresAt: now + ttl,
    staleUntilAt: now + Math.max(ttl * 4, 30 * 1000),
  });
  pruneApiResponseCache(now);
}

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

export function buildRequestKey(method, pathOrUrl, auth = true, body, options = {}) {
  const normalizedMethod = normalizeMethod(method);
  const resolvedUrl = resolveApiUrl(pathOrUrl, options?.baseUrl || API_BASE_URL);
  const headers = normalizeHeadersForKey(options?.headers || {});
  const bodyKey = body === undefined ? null : typeof body === "string" ? body : safeJsonClone(body);

  return JSON.stringify({
    method: normalizedMethod,
    url: resolvedUrl,
    auth: !!auth,
    headers,
    body: bodyKey,
  });
}

export function invalidateApiCache(match) {
  const keys = Array.from(responseCacheMap.keys());
  let cleared = 0;

  const matcher =
    typeof match === "function"
      ? match
      : match instanceof RegExp
      ? (cacheKey) => match.test(cacheKey)
      : typeof match === "string" && match
      ? (cacheKey) => cacheKey.includes(match)
      : null;

  if (!matcher) {
    cleared = responseCacheMap.size;
    responseCacheMap.clear();
    return cleared;
  }

  keys.forEach((cacheKey) => {
    const entry = responseCacheMap.get(cacheKey);
    let matched = false;
    try {
      matched = !!matcher(cacheKey, entry);
    } catch {
      matched = false;
    }
    if (!matched) return;
    responseCacheMap.delete(cacheKey);
    cleared += 1;
  });

  return cleared;
}

function getOrCreateInFlight(cacheKey, factory) {
  const existing = inFlightMap.get(cacheKey);
  if (existing) return existing;

  const created = Promise.resolve()
    .then(factory)
    .finally(() => {
      if (inFlightMap.get(cacheKey) === created) {
        inFlightMap.delete(cacheKey);
      }
    });

  inFlightMap.set(cacheKey, created);
  return created;
}

async function fetchJsonFromNetwork(pathOrUrl, requestOpts = {}, runtime = {}) {
  const {
    auth = true,
    headers = {},
    baseUrl = API_BASE_URL,
    signal,
    cacheKey = null,
    cacheTtlMs = 0,
    ...fetchOpts
  } = { ...(requestOpts || {}), ...(runtime || {}) };

  const res = await apiFetch(pathOrUrl, {
    ...fetchOpts,
    auth,
    headers,
    baseUrl,
    signal,
  });
  const json = await parseApiResponse(res);

  if (cacheKey) {
    setCachedEntry(cacheKey, json, cacheTtlMs);
  }

  return json;
}

function scheduleBackgroundRevalidate(cacheKey, pathOrUrl, requestOpts, cacheTtlMs) {
  if (!cacheKey || inFlightMap.has(cacheKey)) return;

  getOrCreateInFlight(cacheKey, () =>
    fetchJsonFromNetwork(
      pathOrUrl,
      {
        ...(requestOpts || {}),
        signal: undefined,
      },
      {
        cacheKey,
        cacheTtlMs,
        signal: undefined,
      }
    )
  ).catch(() => {
    // keep stale cache on background refresh failure
  });
}

async function apiGetJsonInternal(pathOrUrl, opts = {}) {
  const {
    cacheTtlMs = 0,
    dedupe = true,
    forceRefresh = false,
    staleOk = true,
    auth = true,
    headers = {},
    baseUrl = API_BASE_URL,
    signal,
    ...fetchOpts
  } = opts || {};

  const cacheMs = Number(cacheTtlMs);
  const hasCache = Number.isFinite(cacheMs) && cacheMs > 0;
  const cacheKey = buildRequestKey("GET", pathOrUrl, auth, undefined, {
    baseUrl,
    headers,
  });
  const requestOpts = {
    ...fetchOpts,
    method: "GET",
    auth,
    headers,
    baseUrl,
    signal,
  };

  const now = Date.now();
  const cacheEntry = hasCache ? getCachedEntry(cacheKey, now) : null;

  if (!forceRefresh && hasCache && isFreshCacheEntry(cacheEntry, now)) {
    return safeJsonClone(cacheEntry.value);
  }

  if (!forceRefresh && hasCache && staleOk && cacheEntry) {
    scheduleBackgroundRevalidate(cacheKey, pathOrUrl, requestOpts, cacheMs);
    return safeJsonClone(cacheEntry.value);
  }

  if (dedupe) {
    const sharedPromise = getOrCreateInFlight(cacheKey, () =>
      fetchJsonFromNetwork(pathOrUrl, { ...requestOpts, signal: undefined }, {
        cacheKey: hasCache ? cacheKey : null,
        cacheTtlMs: cacheMs,
        signal: undefined,
      })
    );
    return withAbort(sharedPromise, signal);
  }

  return fetchJsonFromNetwork(pathOrUrl, requestOpts, {
    cacheKey: hasCache ? cacheKey : null,
    cacheTtlMs: cacheMs,
    signal,
  });
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
    ...fetchOpts
  } = {}
) {
  const mergedHeaders = await buildCompatHeaders(headers, auth);
  return fetch(resolveApiUrl(pathOrUrl, baseUrl), {
    method,
    headers: mergedHeaders,
    body,
    signal,
    ...fetchOpts,
  });
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
    ...fetchOpts
  } = {}
) {
  const normalizedMethod = normalizeMethod(method);
  if (normalizedMethod === "GET") {
    return apiGetJsonInternal(path, {
      ...fetchOpts,
      auth,
      headers,
      baseUrl,
      signal,
    });
  }

  const res = await apiFetch(path, {
    method: normalizedMethod,
    auth,
    headers,
    baseUrl,
    signal,
    body: body === undefined ? undefined : JSON.stringify(body),
    ...fetchOpts,
  });
  return parseApiResponse(res);
}

export function apiGet(path, opts = {}) {
  return apiGetJsonInternal(path, opts);
}

export function apiPost(path, body, opts = {}) {
  return apiJson(path, { ...opts, method: "POST", body });
}

export function apiPatch(path, body, opts = {}) {
  return apiJson(path, { ...opts, method: "PATCH", body });
}
