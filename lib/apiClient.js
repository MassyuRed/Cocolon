import { Platform } from "react-native";
import { supabase } from "./supabase";

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_MYMODEL_API_URL || "https://mashos-api.onrender.com"
).replace(/\/+$/, "");

const APP_VERSION = process.env.EXPO_PUBLIC_APP_VERSION || "dev";
const APP_BUILD = process.env.EXPO_PUBLIC_APP_BUILD || "dev";

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
  const res = await apiFetch(path, {
    method,
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
  return apiJson(path, { ...opts, method: "GET" });
}

export function apiPost(path, body, opts = {}) {
  return apiJson(path, { ...opts, method: "POST", body });
}

export function apiPatch(path, body, opts = {}) {
  return apiJson(path, { ...opts, method: "PATCH", body });
}
