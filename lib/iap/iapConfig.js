// lib/iap/iapConfig.js
// ------------------------------------------------------------
// Cocolon IAP 設定（SKU）
// - iOS/Android で SKU が異なる場合は env で上書きできます。
// - ここに書く SKU は、App Store Connect / Google Play Console で作成した商品IDと一致させてください。
// ------------------------------------------------------------

import { Platform } from "react-native";

function readEnv(key) {
  try {
    return String(process?.env?.[key] || "").trim();
  } catch {
    return "";
  }
}

// ✅ デフォルト（まだ Store 側が未作成でも、コードが壊れないようにプレースホルダを用意）
// ※後で必ずあなたの SKU に置き換えてください
const DEFAULT_SKUS = Object.freeze({
  ios: {
    plus: "cocolon_plus_monthly",
    premium: "cocolon_premium_monthly",
  },
  android: {
    plus: "cocolon_plus_monthly",
    premium: "cocolon_premium_monthly",
  },
});

// env があれば優先
export const IAP_SKUS = Object.freeze({
  ios: {
    plus: readEnv("EXPO_PUBLIC_IAP_PLUS_SKU_IOS") || DEFAULT_SKUS.ios.plus,
    premium:
      readEnv("EXPO_PUBLIC_IAP_PREMIUM_SKU_IOS") || DEFAULT_SKUS.ios.premium,
  },
  android: {
    plus:
      readEnv("EXPO_PUBLIC_IAP_PLUS_SKU_ANDROID") || DEFAULT_SKUS.android.plus,
    premium:
      readEnv("EXPO_PUBLIC_IAP_PREMIUM_SKU_ANDROID") ||
      DEFAULT_SKUS.android.premium,
  },
});

export function normalizePlan(plan) {
  const p = String(plan || "").trim().toLowerCase();
  if (p === "plus" || p === "premium") return p;
  return "";
}

export function getPlanSku(plan, platform = Platform.OS) {
  const p = normalizePlan(plan);
  if (!p) return "";
  const plat = platform === "ios" ? "ios" : "android";
  return String(IAP_SKUS?.[plat]?.[p] || "").trim();
}

export function getAllSkus(platform = Platform.OS) {
  const plat = platform === "ios" ? "ios" : "android";
  const plus = String(IAP_SKUS?.[plat]?.plus || "").trim();
  const premium = String(IAP_SKUS?.[plat]?.premium || "").trim();
  const arr = [plus, premium].filter(Boolean);
  // unique
  return arr.filter((v, i) => arr.indexOf(v) === i);
}
