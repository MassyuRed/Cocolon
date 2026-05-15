export const WATASHI_MAP_TIERS = Object.freeze({
  FREE: "free",
  PLUS: "plus",
  PREMIUM: "premium",
});

export const WATASHI_MAP_HISTORY_RETENTION_LABEL = Object.freeze({
  free: "履歴の閲覧範囲：Freeは最新概要のみ",
  plus: "履歴の閲覧範囲：直近1年分",
  premium: "履歴の閲覧範囲：無制限",
});

export function normalizeWatashiMapTier(rawTier) {
  const tier = String(rawTier || "").trim().toLowerCase();
  if (tier === "premium" || tier === "pro") return WATASHI_MAP_TIERS.PREMIUM;
  if (tier === "plus" || tier === "paid") return WATASHI_MAP_TIERS.PLUS;
  return WATASHI_MAP_TIERS.FREE;
}

export function normalizeWatashiMapReportMode(rawMode) {
  const mode = String(rawMode || "").trim().toLowerCase();
  if (mode === "structural") return "deep";
  if (mode === "light" || mode === "standard" || mode === "deep") return mode;
  return "standard";
}

export function formatWatashiMapReportModeLabel(rawMode) {
  const mode = normalizeWatashiMapReportMode(rawMode);
  if (mode === "deep") return "深いマップ";
  if (mode === "standard") return "標準マップ";
  return "概要";
}

export function canViewWatashiMapHistory(rawTier) {
  const tier = normalizeWatashiMapTier(rawTier);
  return tier === WATASHI_MAP_TIERS.PLUS || tier === WATASHI_MAP_TIERS.PREMIUM;
}

export function canViewWatashiMapDetailReport(rawTier, rawMode = "standard") {
  const tier = normalizeWatashiMapTier(rawTier);
  const mode = normalizeWatashiMapReportMode(rawMode);
  if (mode === "light") return false;
  if (mode === "deep") return tier === WATASHI_MAP_TIERS.PREMIUM;
  return tier === WATASHI_MAP_TIERS.PLUS || tier === WATASHI_MAP_TIERS.PREMIUM;
}

export function canViewWatashiMapDeep(rawTier) {
  return normalizeWatashiMapTier(rawTier) === WATASHI_MAP_TIERS.PREMIUM;
}

export function canExportWatashiMapPdf(rawTier) {
  return canViewWatashiMapHistory(rawTier);
}

export function getWatashiMapHistoryRetentionLabel(rawTier) {
  const tier = normalizeWatashiMapTier(rawTier);
  return WATASHI_MAP_HISTORY_RETENTION_LABEL[tier] || "";
}

export function getWatashiMapHistoryLockTitle(rawTier) {
  const tier = normalizeWatashiMapTier(rawTier);
  if (tier === WATASHI_MAP_TIERS.FREE) return "わたしマップの履歴";
  return "詳しい自己分析レポートの履歴";
}

export function getWatashiMapHistoryLockBody(rawTier) {
  const tier = normalizeWatashiMapTier(rawTier);
  if (tier === WATASHI_MAP_TIERS.FREE) {
    return "Freeプランでは今のわたしマップ概要を見られます。過去の詳しい自己分析レポートの履歴はPlusプラン以上で読めます。";
  }
  if (tier === WATASHI_MAP_TIERS.PLUS) {
    return "Plusプランでは直近1年分のわたしマップ履歴を振り返れます。";
  }
  return "Premiumプランではわたしマップ履歴を制限なく振り返れます。";
}

export function getWatashiMapDetailLockLabel(rawTier, rawMode = "standard") {
  const tier = normalizeWatashiMapTier(rawTier);
  const mode = normalizeWatashiMapReportMode(rawMode);
  if (mode === "deep" && tier !== WATASHI_MAP_TIERS.PREMIUM) {
    return "長期の変化と深い分かれ道はPremiumプランで見られます。";
  }
  if (mode === "light") {
    return "詳しい自己分析レポートはPlusプラン以上で読めます。";
  }
  return "詳しい自己分析レポートはPlusプラン以上で読めます。";
}
