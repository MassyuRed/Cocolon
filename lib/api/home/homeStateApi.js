import { apiGet } from "../client";

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params || {})) {
    if (value === undefined || value === null || value === "") continue;
    query.set(key, String(value));
  }
  const encoded = query.toString();
  return encoded ? `?${encoded}` : "";
}

export async function getHomeState({ forceRefresh = false, timezoneName } = {}) {
  const query = buildQuery({
    force_refresh: forceRefresh ? "true" : undefined,
    timezone_name: timezoneName,
  });
  return apiGet(`/home/state${query}`);
}
