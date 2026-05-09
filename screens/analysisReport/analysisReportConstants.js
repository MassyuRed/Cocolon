// Analysis report constants shared by viewer normalization and charts.

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
  if (JP_TO_KEY[maybeJpOrKey]) return JP_TO_KEY[maybeJpOrKey];
  const s = String(maybeJpOrKey);
  if (EMOTIONS.some((e) => e.key === s)) return s;
  return null;
}
