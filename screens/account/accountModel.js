export const PANEL_MIN_HEIGHT = 695;
export const DISPLAY_NAME_MAX_LENGTH = 15;
export const DISPLAY_NAME_TAKEN_MESSAGE = "このユーザー名はすでに使われています。";

export const SUB_TIER_LABEL = {
  free: "Freeプラン",
  plus: "Plusプラン",
  premium: "Premiumプラン",
};

export const TIER_ALLOWED_SELF_STRUCTURE_MODES = {
  free: ["light"],
  plus: ["light", "standard"],
  premium: ["light", "standard", "deep"],
};

export function normalizeDisplayName(value) {
  return String(value || "").trim();
}

export function mapDisplayNameConflictMessage(errorLike) {
  const raw = String(errorLike?.message || errorLike || "");
  const lower = raw.toLowerCase();
  if (lower.includes("profiles_display_name_unique")) {
    return DISPLAY_NAME_TAKEN_MESSAGE;
  }
  if (
    lower.includes("display_name") &&
    (lower.includes("unique") || lower.includes("duplicate") || lower.includes("already"))
  ) {
    return DISPLAY_NAME_TAKEN_MESSAGE;
  }
  return "";
}

export function normalizeSubscriptionTier(raw) {
  const t = String(raw || "").trim().toLowerCase();
  if (t === "plus" || t === "premium" || t === "free") return t;
  return "free";
}

export function formatAllowedModes(modes) {
  const arr = Array.isArray(modes) ? modes : [];
  if (arr.length === 0) return "light";
  const order = ["light", "standard", "deep"];
  return order.filter((m) => arr.includes(m)).join(" / ");
}

export function buildTierPrice(tier) {
  if (tier === "plus") return "月額480円";
  if (tier === "premium") return "月額980円";
  return "無料";
}

export function readAccountStatusValue(accountStatus, key, fallbackKeys = []) {
  const obj = accountStatus && typeof accountStatus === "object" ? accountStatus : null;
  const keys = [key, ...(Array.isArray(fallbackKeys) ? fallbackKeys : [])];
  for (const k of keys) {
    const v = obj ? obj[k] : undefined;
    if (v === null || v === undefined) continue;
    const n = Number(v);
    if (Number.isFinite(n)) return String(Math.trunc(n));
  }
  return "—";
}
