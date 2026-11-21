import { apiGet, apiPost } from "../client";

function buildQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.append(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function getNoticesCurrent(params = {}, options = {}) {
  const query = buildQuery(params);
  return apiGet(`/notices/current${query}`, options);
}

export async function getNoticesHistory(params = {}, options = {}) {
  const query = buildQuery(params);
  return apiGet(`/notices/history${query}`, options);
}

export async function markNoticesRead(payload, options = {}) {
  return apiPost("/notices/read", payload || {}, options);
}

export async function markNoticePopupSeen(payload, options = {}) {
  return apiPost("/notices/popup-seen", payload || {}, options);
}
