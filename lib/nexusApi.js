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

const NEXUS_SORT_BY_MODE = Object.freeze({
  newest: "latest",
  oldest: "oldest",
  views: "views",
  resonances: "resonance",
});

export function normalizeNexusReflectionListItem(item = {}) {
  const owner = item?.owner && typeof item.owner === "object" ? item.owner : {};
  const question = item?.question && typeof item.question === "object" ? item.question : {};
  const metrics = item?.metrics && typeof item.metrics === "object" ? item.metrics : {};
  const viewerState =
    (item?.viewer_state && typeof item.viewer_state === "object" ? item.viewer_state : null) ||
    (item?.viewerState && typeof item.viewerState === "object" ? item.viewerState : null) ||
    {};

  return {
    q_instance_id: String(item?.q_instance_id || item?.qInstanceId || "").trim(),
    q_key: String(question?.q_key || question?.qKey || item?.q_key || item?.qKey || "").trim(),
    title: String(question?.title || item?.title || "").trim(),
    generated_at: item?.created_at || item?.createdAt || item?.generated_at || item?.generatedAt || null,
    views: Number(metrics?.views ?? item?.views ?? 0) || 0,
    resonances: Number(metrics?.resonances ?? item?.resonances ?? 0) || 0,
    is_new: !!(viewerState?.is_new ?? viewerState?.isNew ?? item?.is_new ?? item?.isNew ?? false),
    owner_user_id: String(owner?.user_id || owner?.userId || item?.owner_user_id || item?.ownerUserId || "").trim() || null,
    display_name: String(owner?.display_name || owner?.displayName || item?.display_name || item?.displayName || "").trim() || null,
    friend_code: String(owner?.friend_code || owner?.friendCode || item?.friend_code || item?.friendCode || "").trim() || null,
    source_type: String(item?.source_type || item?.sourceType || "emotion_generated").trim() || "emotion_generated",
  };
}

export async function getNexusReflections(params = {}) {
  return apiGet(`/nexus/reflections${buildQuery(params)}`);
}

export async function getNexusReflectionsAsQnaList({ targetUserId = null, mode = "newest", limit = 100 } = {}) {
  const sort = NEXUS_SORT_BY_MODE[String(mode || "newest").trim()] || NEXUS_SORT_BY_MODE.newest;
  const json = await getNexusReflections({
    user_id: targetUserId ? String(targetUserId) : undefined,
    sort,
    limit: Number.isFinite(Number(limit)) ? Number(limit) : 100,
  });
  const items = Array.isArray(json?.items) ? json.items.map(normalizeNexusReflectionListItem) : [];
  const totalItems = Number(json?.total_items ?? json?.totalItems ?? items.length) || 0;
  return {
    status: String(json?.status || "ok"),
    items,
    meta: {
      source: "nexus",
      total_items: totalItems,
      has_more: !!json?.has_more,
      sort,
      target_user_id: targetUserId ? String(targetUserId) : null,
    },
  };
}

export async function getNexusReflectionDetail(qInstanceId, options = {}) {
  return apiGet(
    `/nexus/reflections/${encodeURIComponent(String(qInstanceId || "").trim())}${buildQuery({
      mark_viewed: options?.markViewed ? "true" : "false",
    })}`
  );
}

export async function getNexusReflectionDetailQna(qInstanceId, options = {}) {
  return getNexusReflectionDetail(qInstanceId, options);
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


export async function getNexusEmotionRanking(limit = 5, range = "week") {
  return apiGet(`/nexus/emotion-ranking${buildQuery({ limit, range })}`);
}
