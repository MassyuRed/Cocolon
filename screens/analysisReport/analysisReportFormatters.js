export const STRENGTH_SCORE = Object.freeze({ weak: 1, medium: 2, strong: 3 });

export const EMOTIONS = [
  { key: "joy", label: "喜び", color: "#10B981" },
  { key: "sadness", label: "悲しみ", color: "#6366F1" },
  { key: "anxiety", label: "不安", color: "#38BDF8" },
  { key: "anger", label: "怒り", color: "#EF4444" },
  { key: "calm", label: "平穏", color: "#EAB308" },
];

export const JP_TO_KEY = {
  喜び: "joy",
  悲しみ: "sadness",
  不安: "anxiety",
  怒り: "anger",
  平穏: "calm",
};

export const SELF_INSIGHT_LABELS = new Set(["自己理解", "SelfInsight"]);
export const TIME_BUCKET_ORDER = ["0-6", "6-12", "12-18", "18-24"];

export function mapKey(maybeJpOrKey) {
  if (!maybeJpOrKey) return null;
  // 既存ロジック（日本語）
  if (JP_TO_KEY[maybeJpOrKey]) return JP_TO_KEY[maybeJpOrKey];
  // 互換（すでに key の場合）
  const s = String(maybeJpOrKey);
  if (EMOTIONS.some((e) => e.key === s)) return s;
  return null;
}

export function coerceNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function safeParseJson(raw) {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return null;
}

export function emotionLabelJa(value) {
  if (!value) return "";
  const mapped = mapKey(value);
  const emotion = EMOTIONS.find((item) => item.key === mapped);
  return emotion?.label || String(value || "");
}

export function formatMinutesJa(value) {
  const mins = coerceNum(value);
  if (mins <= 0) return "—";
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remain = mins % 60;
    return remain > 0 ? `${hours}時間${remain}分` : `${hours}時間`;
  }
  return `${mins}分`;
}

export function formatRange(periodStart, periodEnd, reportType) {
  try {
    const s = new Date(periodStart);
    const e = new Date(periodEnd);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "";
    const md = (d) => `${d.getMonth() + 1}/${d.getDate()}`;
    if (reportType === "daily") {
      return `${s.getFullYear()}/${s.getMonth() + 1}/${s.getDate()}（1日）`;
    }
    return `${md(s)} ～ ${md(e)}`;
  } catch {
    return "";
  }
}
