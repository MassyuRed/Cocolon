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

export async function getNoticesCurrent(params = {}) {
  const query = buildQuery(params);
  return apiGet(`/notices/current${query}`);
}

export async function getNoticesHistory(params = {}) {
  const query = buildQuery(params);
  return apiGet(`/notices/history${query}`);
}

export async function markNoticesRead(payload) {
  return apiPost("/notices/read", payload || {});
}

export async function markNoticePopupSeen(payload) {
  return apiPost("/notices/popup-seen", payload || {});
}
