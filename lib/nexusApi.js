import { apiGet, apiPost } from "./apiClient";

function buildQuery(params = {}) {
  const entries = Object.entries(params || {}).filter(([, value]) => value !== undefined && value !== null && value !== "");
  if (entries.length === 0) return "";
  return (
    "?" +
    entries
      .map(([key, value]) => `${encodeURIComponent(String(key))}=${encodeURIComponent(String(value))}`)
      .join("&")
  );
}

export async function getNexusReflections(params = {}) {
  return apiGet(`/nexus/reflections${buildQuery(params)}`);
}

export async function getNexusReflectionDetail(qInstanceId, options = {}) {
  return apiGet(
    `/nexus/reflections/${encodeURIComponent(String(qInstanceId || "").trim())}${buildQuery({
      mark_viewed: options?.markViewed ? "true" : "false",
      include_my_discovery_latest: options?.includeMyDiscoveryLatest ? "true" : "false",
    })}`
  );
}

export async function getNexusEmotionLog(limit = 20) {
  return apiGet(`/nexus/emotion-log${buildQuery({ limit })}`);
}

export async function getNexusReflectionsUnreadStatus() {
  return apiGet("/nexus/reflections/unread-status");
}

export async function getNexusEmotionLogUnreadStatus() {
  return apiGet("/emotion-log/unread-status");
}

export async function markNexusEmotionLogFeedRead(lastSeenCreatedAt = null) {
  const normalized = String(lastSeenCreatedAt || "").trim();
  return apiPost(
    "/emotion-log/unread/read-feed",
    normalized ? { last_seen_created_at: normalized } : {}
  );
}

export async function getNexusRecommendUsers(limit = 8) {
  return apiGet(`/nexus/recommend/users${buildQuery({ limit })}`);
}

export async function getNexusEchoesReflections(limit = 20) {
  return apiGet(`/nexus/history/echoes${buildQuery({ limit, offset: 0 })}`);
}

export async function getNexusDiscoveriesReflections(limit = 20) {
  return apiGet(`/nexus/history/discoveries${buildQuery({ limit, offset: 0 })}`);
}

export async function getNexusEmotionRanking(limit = 5, range = "week") {
  return apiGet(`/nexus/emotion-ranking${buildQuery({ limit, range })}`);
}
