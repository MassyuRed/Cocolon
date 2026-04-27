export const ANALYSIS_WIRE = Object.freeze({
  startupSections: Object.freeze({
    unread: ["analysis_unread", "myweb_unread"],
    homeSummary: [
      "analysis_home_summary",
      "analysis_summary",
      "analysis_home",
    ],
  }),
  routes: Object.freeze({
    homeSummary: "/analysis/home-summary",
    reportsEnsure: "/analysis/reports/ensure",
    reportsReady: "/analysis/reports/ready",
    reportsUnreadStatus: "/report-reads/analysis-unread-status",
    reportType: "myweb_report",
  }),
  reportFamily: Object.freeze({
    table: "myweb_reports",
    scope: "myweb",
  }),
  deepScopeVersion: Object.freeze({
    monthly: "myweb.deep.monthly.v2",
    weekly: "myweb.deep.weekly.v2",
  }),
  startupSource: Object.freeze({
    startup: "myweb_startup",
    ready: "myweb_subscription_ready",
    resolved: "myweb_subscription_resolved",
  }),
});

export const PIECE_WIRE = Object.freeze({
  startupSections: Object.freeze({
    unread: ["piece_unread", "mymodel_reflections_unread", "mymodel_reflections"],
    quota: ["emotion_piece_quota", "emotion_reflection_quota"],
  }),
  routes: Object.freeze({
    publicFeed: "/nexus/pieces",
    publicUnreadStatus: "/nexus/pieces/unread-status",
    publicResonanceHistory: "/nexus/history/resonances",
    recommendUsers: "/nexus/recommend/users",
    resonancePieces: "/piece/resonances/pieces",
    resonanceSubmit: "/piece/resonances/submit",
    resonanceHistory: "/piece/resonances/history",
    resonanceDelete: "/piece/resonances/delete",
    rankingResonances: "/ranking/piece_resonances",
    emotionPieceQuota: "/emotion/piece/quota",
    emotionPiecePreview: "/emotion/piece/preview",
    emotionPiecePublish: "/emotion/piece/publish",
    emotionPieceCancel: "/emotion/piece/cancel",
  }),
  metrics: Object.freeze({
    pieceGeneratedTotalKeys: [
      "piece_generated_total",
      "mymodel_questions_total",
      "mymodelQuestionsTotal",
      "mymodel_q_total",
    ],
    pieceResonancesTotalKeys: [
      "piece_resonances_total",
      "mymodel_resonances_total",
      "mymodelResonancesTotal",
      "resonances_total",
      "echo_count",
    ],
    pieceViewCountKeys: [
      "piece_view_count",
      "piece_views",
      "reflection_count",
      "reflection_views",
      "reflection_view_count",
    ],
  }),
});

export const SELF_STRUCTURE_WIRE = Object.freeze({
  routes: Object.freeze({
    latest: "/self-structure/latest",
    latestStatus: "/self-structure/latest/status",
    reportsHistoryBase: "/self-structure/reports/history",
    reportDetailBase: "/self-structure/reports",
    followList: "/follow/list",
    followStats: "/follow/stats",
    followCreate: "/follow/create",
    unfollow: "/follow/delete",
    removeFollower: "/follow/remove-follower",
    incomingRequests: "/follow/requests/incoming",
    outgoingRequests: "/follow/requests/outgoing",
    approveRequest: "/follow/requests/approve",
    rejectRequest: "/follow/requests/reject",
    cancelRequest: "/follow/request/cancel",
  }),
  reportFamily: Object.freeze({
    table: "myprofile_reports",
    scope: "myprofile",
  }),
  allowedModesKeys: ["allowed_self_structure_modes", "allowed_myprofile_modes"],
});

export const EMOTION_NOTIFICATION_WIRE = Object.freeze({
  routes: Object.freeze({
    settings: "/emotion-notifications/settings",
  }),
  globalOwnerCompatId: "__global_emotion_notifications__",
  submitField: "send_emotion_notification",
});

export const FOLLOW_WIRE = Object.freeze({
  routes: Object.freeze({
    stats: SELF_STRUCTURE_WIRE.routes.followStats,
    list: SELF_STRUCTURE_WIRE.routes.followList,
    create: SELF_STRUCTURE_WIRE.routes.followCreate,
    delete: SELF_STRUCTURE_WIRE.routes.unfollow,
    removeFollower: SELF_STRUCTURE_WIRE.routes.removeFollower,
    requestsIncoming: SELF_STRUCTURE_WIRE.routes.incomingRequests,
    requestsOutgoing: SELF_STRUCTURE_WIRE.routes.outgoingRequests,
    approveRequest: SELF_STRUCTURE_WIRE.routes.approveRequest,
    rejectRequest: SELF_STRUCTURE_WIRE.routes.rejectRequest,
    cancelRequest: SELF_STRUCTURE_WIRE.routes.cancelRequest,
    requestsRead: "/follow/requests/read",
  }),
});

export const ACCOUNT_WIRE = Object.freeze({
  routes: Object.freeze({
    status: "/account/status",
    profileCreate: "/account/profile-create",
    visibilityMe: "/account/visibility/me",
  }),
  fields: Object.freeze({
    shareCodePublic: "is_share_code_public",
  }),
});

export const RUNTIME_COMPAT_ENV = Object.freeze({
  apiBaseUrlKeys: Object.freeze([
    "EXPO_PUBLIC_API_BASE_URL",
    "EXPO_PUBLIC_PIECE_API_URL",
    "EXPO_PUBLIC_ANALYSIS_API_URL",
    "EXPO_PUBLIC_MYMODEL_API_URL",
  ]),
});

export const CONNECT_WIRE = Object.freeze({
  routes: Object.freeze({
    publicProfileByShareCodeBase: "/public/profile/by-share-code",
  }),
  shareCodeKeys: ["share_code", "friend_code", "shareCode", "friendCode"],
  shareCodePublicKeys: [
    "is_share_code_public",
    "is_friend_code_public",
    "share_code_public",
    "friend_code_public",
  ],
  connectCodeKeys: ["connect_code", "myprofile_code", "connectCode", "myprofileCode"],
});

export function buildAnalysisReportWeeklyDaysPath(reportId) {
  return `/analysis/reports/${encodeURIComponent(String(reportId || "").trim())}/weekly-days`;
}

export function buildSelfStructureReportHistoryPath({ reportType, limit, offset }) {
  const params = new URLSearchParams();
  if (reportType !== undefined && reportType !== null && reportType !== "") params.set("report_type", String(reportType));
  if (limit !== undefined && limit !== null && limit !== "") params.set("limit", String(limit));
  if (offset !== undefined && offset !== null && offset !== "") params.set("offset", String(offset));
  const query = params.toString();
  return query
    ? `${SELF_STRUCTURE_WIRE.routes.reportsHistoryBase}?${query}`
    : SELF_STRUCTURE_WIRE.routes.reportsHistoryBase;
}

export function buildSelfStructureReportDetailPath(reportId) {
  return `${SELF_STRUCTURE_WIRE.routes.reportDetailBase}/${encodeURIComponent(String(reportId || "").trim())}`;
}

export function buildPublicProfileByShareCodePath(code) {
  return `${CONNECT_WIRE.routes.publicProfileByShareCodeBase}?code=${encodeURIComponent(String(code || "").trim())}`;
}

export function readWireSectionObject(container, names = []) {
  const sectionMap = container && typeof container === "object" && !Array.isArray(container) ? container : {};
  for (const rawName of Array.isArray(names) ? names : []) {
    const name = String(rawName || "").trim();
    if (!name) continue;
    if (Object.prototype.hasOwnProperty.call(sectionMap, name)) {
      return {
        found: true,
        key: name,
        value: sectionMap[name],
      };
    }
  }
  return {
    found: false,
    key: null,
    value: undefined,
  };
}

export function deleteWireSectionKeys(container, names = []) {
  if (!container || typeof container !== "object" || Array.isArray(container)) return;
  for (const rawName of Array.isArray(names) ? names : []) {
    const name = String(rawName || "").trim();
    if (!name) continue;
    try {
      delete container[name];
    } catch {
      // noop
    }
  }
}

export function readFirstWireValue(input, keys = [], fallback = "") {
  const source = input && typeof input === "object" ? input : {};
  for (const key of Array.isArray(keys) ? keys : []) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const value = source[key];
      if (value !== undefined && value !== null && value !== "") return value;
    }
  }
  return fallback;
}

export function readShareCode(input, fallback = null) {
  const value = readFirstWireValue(input, CONNECT_WIRE.shareCodeKeys, "");
  const normalized = String(value || "").trim();
  return normalized || fallback;
}

export function readConnectCode(input, fallback = null) {
  const value = readFirstWireValue(input, CONNECT_WIRE.connectCodeKeys, "");
  const normalized = String(value || "").trim();
  return normalized || fallback;
}

export function readShareCodePublic(input, fallback = false) {
  const value = readFirstWireValue(input, CONNECT_WIRE.shareCodePublicKeys, undefined);
  return typeof value === "boolean" ? value : fallback;
}

export function readAllowedSelfStructureModes(input) {
  const source = input && typeof input === "object" ? input : {};
  for (const key of SELF_STRUCTURE_WIRE.allowedModesKeys) {
    if (Array.isArray(source?.[key])) return source[key];
  }
  return [];
}

export function readPieceGeneratedTotal(input) {
  const value = readFirstWireValue(input, PIECE_WIRE.metrics.pieceGeneratedTotalKeys, undefined);
  return value;
}

export function readPieceResonancesTotal(input) {
  const value = readFirstWireValue(input, PIECE_WIRE.metrics.pieceResonancesTotalKeys, undefined);
  return value;
}

export function readPieceViewCount(input) {
  const value = readFirstWireValue(input, PIECE_WIRE.metrics.pieceViewCountKeys, undefined);
  return value;
}


function readCompatEnv(key) {
  try {
    return String(process?.env?.[key] || "").trim();
  } catch {
    return "";
  }
}

export function readRuntimeApiBaseUrl(fallback = "https://mashos-api.onrender.com") {
  for (const key of RUNTIME_COMPAT_ENV.apiBaseUrlKeys) {
    const value = readCompatEnv(key);
    if (value) return value.replace(/\/+$/, "");
  }
  return String(fallback || "https://mashos-api.onrender.com").trim().replace(/\/+$/, "");
}

export function buildAnalysisReportsReadyPath({ reportType, limit, offset } = {}) {
  const params = new URLSearchParams();
  if (reportType !== undefined && reportType !== null && reportType !== "") params.set("report_type", String(reportType));
  if (limit !== undefined && limit !== null && limit !== "") params.set("limit", String(limit));
  if (offset !== undefined && offset !== null && offset !== "") params.set("offset", String(offset));
  const query = params.toString();
  return query ? `${ANALYSIS_WIRE.routes.reportsReady}?${query}` : ANALYSIS_WIRE.routes.reportsReady;
}

export function readEmotionNotificationOwnerId(input, fallback = "") {
  const value = readFirstWireValue(
    input,
    ["owner_user_id", "friend_user_id", "ownerUserId", "friendUserId", "owner_id", "friend_id", "friendId"],
    ""
  );
  const normalized = String(value || "").trim();
  return normalized || fallback;
}

export function buildFollowStatsPath(targetUserId) {
  const params = new URLSearchParams();
  if (targetUserId !== undefined && targetUserId !== null && targetUserId !== "") params.set("target_user_id", String(targetUserId));
  const query = params.toString();
  return query ? `${FOLLOW_WIRE.routes.stats}?${query}` : FOLLOW_WIRE.routes.stats;
}

export function buildFollowListPath({ targetUserId, tab, limit } = {}) {
  const params = new URLSearchParams();
  if (targetUserId !== undefined && targetUserId !== null && targetUserId !== "") params.set("target_user_id", String(targetUserId));
  if (tab !== undefined && tab !== null && tab !== "") params.set("tab", String(tab));
  if (limit !== undefined && limit !== null && limit !== "") params.set("limit", String(limit));
  const query = params.toString();
  return query ? `${FOLLOW_WIRE.routes.list}?${query}` : FOLLOW_WIRE.routes.list;
}

export function buildFollowRequestsPath(kind, { limit } = {}) {
  const basePath = String(kind || "").trim() === "outgoing"
    ? FOLLOW_WIRE.routes.requestsOutgoing
    : FOLLOW_WIRE.routes.requestsIncoming;
  const params = new URLSearchParams();
  if (limit !== undefined && limit !== null && limit !== "") params.set("limit", String(limit));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}


export function readRelatedConnectCode(input, role = "") {
  const source = input && typeof input === "object" ? input : {};
  const prefix = String(role || "").trim();
  if (!prefix) return readConnectCode(source, "");
  return readConnectCode(
    {
      connect_code: source?.[`${prefix}_connect_code`],
      myprofile_code: source?.[`${prefix}_myprofile_code`],
      connectCode: source?.[`${prefix}ConnectCode`],
      myprofileCode: source?.[`${prefix}MyprofileCode`],
    },
    ""
  );
}
