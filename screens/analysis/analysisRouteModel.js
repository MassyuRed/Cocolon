export const PANEL_MIN_HEIGHT = 690;

export const ANALYSIS_TUTORIAL_STEP_START = 8;
export const ANALYSIS_TUTORIAL_STEP_END = 12;

export const SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY = "cocolon:selfStructureLatestSeenVersion";
export const SELF_STRUCTURE_HISTORY_FETCH_LIMIT = 200;
export const REPORT_READ_STATUS_CHUNK_SIZE = 60;

export const ROUTE_HOME = "home";
export const ROUTE_EMOTION_ANALYSIS = "emotionAnalysis";
export const ROUTE_SELF_STRUCTURE = "selfStructure";
export const ROUTE_INPUT_HISTORY = "inputHistory";
export const ROUTE_HISTORY = "history";
export const ROUTE_REPORT_HISTORY = "reportHistory";
export const ROUTE_REPORT_VIEW = "reportView";
export const ROUTE_SELF_REPORT_HISTORY = "selfReportHistory";
export const ROUTE_SELF_REPORT_VIEW = "selfReportView";
export const ROUTE_SELF_REPORT_GENERATE = "selfReportGenerate";
export const ROUTE_TODAY_QUESTION_HISTORY = "todayQuestionHistory";

export const ANALYSIS_READY_LIMIT = 1;
export const INITIAL_VISIBLE_REPORT_TYPE = "daily";
export const REPORT_TYPE_LABEL = Object.freeze({
  daily: "こころ天気（日）",
  weekly: "こころ天気（週）",
  monthly: "こころ天気（月）",
});
export const ANALYSIS_READY_REPORT_TYPES = Object.freeze(["daily", "weekly", "monthly"]);

export function normalizeAnalysisReportType(type) {
  const normalized = String(type || "").trim().toLowerCase();
  return ANALYSIS_READY_REPORT_TYPES.includes(normalized) ? normalized : null;
}

export function isAnalysisReportType(type) {
  return !!normalizeAnalysisReportType(type);
}

export function extractReadyItems(payload) {
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.reports)) return payload.reports;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.data?.reports)) return payload.data.reports;
  if (Array.isArray(payload)) return payload;
  return [];
}

export function parseLooseIsoDate(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;

  let normalized = raw;
  if (/^\d{4}-\d{2}-\d{2} \d/.test(normalized)) {
    normalized = normalized.replace(" ", "T");
  }
  if (!(/[zZ]$/.test(normalized) || /[+-]\d{2}:\d{2}$/.test(normalized))) {
    normalized = `${normalized}Z`;
  }

  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export function pickLatestIso(values) {
  let latestValue = null;
  let latestTime = -Infinity;

  for (const value of Array.isArray(values) ? values : []) {
    const date = parseLooseIsoDate(value);
    if (!date) continue;
    const time = date.getTime();
    if (time > latestTime) {
      latestTime = time;
      latestValue = value;
    }
  }

  return latestValue;
}

export function resolveAnalysisReportUpdatedAt(item) {
  if (!item || typeof item !== "object") return null;
  return (
    item.generated_at ||
    item.updated_at ||
    item.published_at ||
    item.period_end ||
    item.created_at ||
    null
  );
}

export function resolveSelfStructureUpdatedAt(item) {
  if (!item || typeof item !== "object") return null;
  return item.generated_at || item.updated_at || item.period_end || item.created_at || null;
}

export function resolveTodayQuestionUpdatedAt(item) {
  if (!item || typeof item !== "object") return null;
  return item.edited_at || item.answered_at || item.updated_at || item.created_at || null;
}

export function formatLatestUpdateLabel(value) {
  const date = parseLooseIsoDate(value);
  if (!date) return "最新更新日：--";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `最新更新日：${year}/${month}/${day}`;
}

export function normalizeSelfStructureMode(mode) {
  const value = String(mode || "").trim().toLowerCase();
  return value === "deep" ? "deep" : "standard";
}

export function isAnalysisMenuRoute(route) {
  return (
    route === ROUTE_HOME ||
    route === ROUTE_EMOTION_ANALYSIS ||
    route === ROUTE_SELF_STRUCTURE ||
    route === ROUTE_INPUT_HISTORY
  );
}
