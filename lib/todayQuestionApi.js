import { apiGet, apiPatch, apiPost } from "./apiClient";

function buildQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.append(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function resolveLocalTimezoneName(fallback = "Asia/Tokyo") {
  try {
    const tz = Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone;
    return typeof tz === "string" && tz.trim() ? tz.trim() : fallback;
  } catch {
    return fallback;
  }
}

export async function getTodayQuestionCurrent(params = {}) {
  const query = buildQuery(params);
  return apiGet(`/today-question/current${query}`);
}

export async function submitTodayQuestionAnswer(payload) {
  return apiPost("/today-question/answers", payload || {});
}

export async function getTodayQuestionHistory(params = {}) {
  const query = buildQuery(params);
  return apiGet(`/today-question/history${query}`);
}

export async function patchTodayQuestionAnswer(answerId, payload) {
  const id = String(answerId || "").trim();
  if (!id) throw new Error("answerId is required");
  return apiPatch(`/today-question/history/${encodeURIComponent(id)}`, payload || {});
}

export async function getTodayQuestionSettings(params = {}) {
  const query = buildQuery(params);
  return apiGet(`/today-question/settings${query}`);
}

export async function patchTodayQuestionSettings(payload) {
  return apiPatch("/today-question/settings", payload || {});
}
