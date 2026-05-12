export function normalizeSubscriptionTier(raw) {
  const v = String(raw || "").trim();
  if (!v) return "free";
  const lower = v.toLowerCase();

  // Japanese labels
  if (v.includes("無料")) return "free";
  if (v.includes("プラス") || v.includes("Plus") || v.includes("plus")) return "plus";
  if (v.includes("プレミアム") || v.includes("Premium") || v.includes("premium"))
    return "premium";

  // plain
  if (lower === "free") return "free";
  if (lower === "plus") return "plus";
  if (lower === "premium") return "premium";

  return "free"; // fail-closed
}

export function canViewAnalysisFullText(tier) {
  return tier === "plus" || tier === "premium";
}

export function canViewAnalysisDeep(tier) {
  return tier === "premium";
}

export function isEmotionReportType(reportType) {
  return reportType === "daily" || reportType === "weekly" || reportType === "monthly";
}

export function buildStandardUpgradeCardCopy() {
  return {
    badge: null,
    headline: null,
    lead: "こころ天気を、もっと深く読めます",
    bodyStrong: "加入すると、こころ天気（日/週/月）の本文や観測理由まで、今よりていねいに振り返れます。",
    note: "今は基本図と短め表示を表示しています。",
    ctaLabel: "プランを見る",
  };
}
