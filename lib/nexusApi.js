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

export async function getNexusFollowingUsers(targetUserId, limit = 1000) {
  const normalizedTargetUserId = String(targetUserId || "").trim();
  if (!normalizedTargetUserId) {
    throw new Error("targetUserId is required");
  }
  return apiGet(
    `/myprofile/follow-list${buildQuery({
      target_user_id: normalizedTargetUserId,
      tab: "following",
      limit,
    })}`
  );
}

export async function getNexusReflectionDetail(qInstanceId, options = {}) {
  return apiGet(
    `/mymodel/qna/detail${buildQuery({
      q_instance_id: qInstanceId,
      mark_viewed: options?.markViewed ? "true" : "false",
      include_my_discovery_latest: options?.includeMyDiscoveryLatest ? "true" : "false",
    })}`
  );
}

export async function getNexusEmotionLog(limit = 20) {
  return apiGet(`/emotion-log/feed${buildQuery({ limit })}`);
}

export async function getNexusReflectionsUnreadStatus() {
  return apiGet("/mymodel/qna/unread-status");
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
  return apiGet(`/mymodel/recommend/users${buildQuery({ limit })}`);
}

export async function getNexusEchoesReflections(limit = 20) {
  return apiGet(`/mymodel/qna/echoes/reflections${buildQuery({ limit, order: "newest" })}`);
}

export async function getNexusDiscoveriesReflections(limit = 20) {
  return apiGet(`/mymodel/qna/discoveries/reflections${buildQuery({ limit, order: "newest" })}`);
}

export async function getNexusEmotionRanking(limit = 5, range = "week") {
  return apiGet(`/ranking/emotions${buildQuery({ limit, range })}`);
}
