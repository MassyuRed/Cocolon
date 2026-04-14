import { apiGet } from "./apiClient";

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
    `/mymodel/qna/detail${buildQuery({
      q_instance_id: qInstanceId,
      mark_viewed: options?.markViewed ? "true" : "false",
      include_my_discovery_latest: options?.includeMyDiscoveryLatest ? "true" : "false",
    })}`
  );
}

export async function getNexusEmotionLog(limit = 20) {
  return apiGet(`/friends/feed${buildQuery({ limit })}`);
}

export async function getNexusRecommendUsers(limit = 8) {
  return apiGet(`/mymodel/recommend/users${buildQuery({ limit })}`);
}

export async function getNexusTrendingQuestions(limit = 8) {
  return apiGet(`/mymodel/qna/trending${buildQuery({ limit, mode: "overall" })}`);
}

export async function getNexusEchoesReflections(limit = 20) {
  return apiGet(`/mymodel/qna/echoes/reflections${buildQuery({ limit, order: "newest" })}`);
}

export async function getNexusDiscoveriesReflections(limit = 20) {
  return apiGet(`/mymodel/qna/discoveries/reflections${buildQuery({ limit, order: "newest" })}`);
}

export async function getNexusEmotionRanking(limit = 5) {
  return apiGet(`/ranking/emotions${buildQuery({ limit })}`);
}
