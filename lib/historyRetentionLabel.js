const TIER_TO_HISTORY_RETENTION_LABEL = Object.freeze({
  free: "履歴の閲覧範囲：今月と先月分",
  plus: "履歴の閲覧範囲：直近1年分",
  premium: "履歴の閲覧範囲：無制限",
});

export function normalizeHistoryRetentionTier(rawTier) {
  const value = String(rawTier || "").trim();
  if (!value) return "unknown";

  const lower = value.toLowerCase();

  if (
    lower === "premium" ||
    value.includes("Premium") ||
    value.includes("premium") ||
    value.includes("プレミアム")
  ) {
    return "premium";
  }

  if (
    lower === "plus" ||
    value.includes("Plus") ||
    value.includes("plus") ||
    value.includes("プラス")
  ) {
    return "plus";
  }

  if (
    lower === "free" ||
    value.includes("Free") ||
    value.includes("free") ||
    value.includes("無料")
  ) {
    return "free";
  }

  return "unknown";
}

export function pickHistoryRetentionTier(...candidates) {
  for (const raw of candidates) {
    const tier = normalizeHistoryRetentionTier(raw);
    if (tier !== "unknown") return tier;
  }
  return "unknown";
}

export function getHistoryRetentionLabel(rawTier) {
  const tier = normalizeHistoryRetentionTier(rawTier);
  return TIER_TO_HISTORY_RETENTION_LABEL[tier] || "";
}
