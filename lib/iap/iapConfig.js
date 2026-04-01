// lib/iap/iapConfig.js
// ------------------------------------------------------------
// Cocolon IAP 設定（SKU / 公開URL / ストア識別子）
// - iOS/Android で SKU が異なる場合は public env で上書きできます。
// - ここに書く SKU は、App Store Connect / Google Play Console で作成した商品IDと一致させてください。
// - Phase 3: 本番 env 一覧を 1 か所へ集約し、Console 設定と突合しやすくする。
// ------------------------------------------------------------

import { Platform } from "react-native";

function readEnv(key) {
  try {
    return String(process?.env?.[key] || "").trim();
  } catch {
    return "";
  }
}

function readFirstEnv(keys) {
  const list = Array.isArray(keys) ? keys : [keys];
  for (const key of list) {
    const value = readEnv(key);
    if (value) return value;
  }
  return "";
}

function unique(arr) {
  const seen = new Set();
  const out = [];
  for (const value of Array.isArray(arr) ? arr : []) {
    const v = String(value || "").trim();
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

// ✅ デフォルト（まだ Store 側が未作成でもコードが壊れないようにプレースホルダを用意）
// ※本番販売では必ず public env を設定してください
const DEFAULT_SKUS = Object.freeze({
  ios: {
    plus: "cocolon_plus_monthly",
    // Premium は未販売期間があるため、fallback では空にして
    // 「coming soon の SKU が iOS 商品取得を壊す」事故を防ぐ。
    premium: "",
  },
  android: {
    plus: "emlis",
    // Premium は runtime bootstrap / public env が入った時だけ有効化する。
    premium: "",
  },
});

const PUBLIC_RUNTIME_CONFIG = Object.freeze({
  apiBaseUrl: readEnv("EXPO_PUBLIC_MYMODEL_API_URL"),
  termsUrl: readEnv("EXPO_PUBLIC_TERMS_URL"),
  privacyUrl: readEnv("EXPO_PUBLIC_PRIVACY_URL"),
  supportUrl: readEnv("EXPO_PUBLIC_SUPPORT_URL"),
  iosBundleId: readFirstEnv(["EXPO_PUBLIC_IOS_BUNDLE_ID", "EXPO_PUBLIC_APPLE_BUNDLE_ID"]),
  androidPackageName: readEnv("EXPO_PUBLIC_ANDROID_PACKAGE_NAME"),
  ios: {
    plusSku: readEnv("EXPO_PUBLIC_IAP_PLUS_SKU_IOS"),
    premiumSku: readEnv("EXPO_PUBLIC_IAP_PREMIUM_SKU_IOS"),
  },
  android: {
    plusSku: readEnv("EXPO_PUBLIC_IAP_PLUS_SKU_ANDROID"),
    premiumSku: readEnv("EXPO_PUBLIC_IAP_PREMIUM_SKU_ANDROID"),
  },
});

export const SUBSCRIPTION_PUBLIC_CONFIG = PUBLIC_RUNTIME_CONFIG;

export const IAP_SKUS = Object.freeze({
  ios: {
    plus: PUBLIC_RUNTIME_CONFIG.ios.plusSku || DEFAULT_SKUS.ios.plus,
    premium: PUBLIC_RUNTIME_CONFIG.ios.premiumSku || DEFAULT_SKUS.ios.premium,
  },
  android: {
    plus: PUBLIC_RUNTIME_CONFIG.android.plusSku || DEFAULT_SKUS.android.plus,
    premium:
      PUBLIC_RUNTIME_CONFIG.android.premiumSku || DEFAULT_SKUS.android.premium,
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
  return unique([plus, premium]);
}

export function getSubscriptionPublicRuntimeConfig() {
  return PUBLIC_RUNTIME_CONFIG;
}

export function getSubscriptionPublicAudit() {
  const blockingIssues = [];
  const warnings = [];

  if (!PUBLIC_RUNTIME_CONFIG.apiBaseUrl) {
    blockingIssues.push("EXPO_PUBLIC_MYMODEL_API_URL が未設定です。");
  }
  if (!PUBLIC_RUNTIME_CONFIG.ios.plusSku) {
    blockingIssues.push("EXPO_PUBLIC_IAP_PLUS_SKU_IOS が未設定です。");
  }
  if (!PUBLIC_RUNTIME_CONFIG.android.plusSku) {
    blockingIssues.push("EXPO_PUBLIC_IAP_PLUS_SKU_ANDROID が未設定です。");
  }
  if (!PUBLIC_RUNTIME_CONFIG.termsUrl) {
    warnings.push("EXPO_PUBLIC_TERMS_URL が未設定です。/subscription/bootstrap の runtime links を確認してください。");
  }
  if (!PUBLIC_RUNTIME_CONFIG.privacyUrl) {
    warnings.push("EXPO_PUBLIC_PRIVACY_URL が未設定です。/subscription/bootstrap の runtime links を確認してください。");
  }
  if (!PUBLIC_RUNTIME_CONFIG.supportUrl) {
    warnings.push("EXPO_PUBLIC_SUPPORT_URL が未設定です。/subscription/bootstrap でサポート導線を返す場合は必須ではありません。");
  }

  if (!PUBLIC_RUNTIME_CONFIG.androidPackageName) {
    warnings.push("EXPO_PUBLIC_ANDROID_PACKAGE_NAME が未設定です。");
  }
  if (!PUBLIC_RUNTIME_CONFIG.iosBundleId) {
    warnings.push("EXPO_PUBLIC_IOS_BUNDLE_ID が未設定です。");
  }
  if (!PUBLIC_RUNTIME_CONFIG.ios.premiumSku) {
    warnings.push("EXPO_PUBLIC_IAP_PREMIUM_SKU_IOS が未設定です。Premium を未販売なら問題ありません。");
  }
  if (!PUBLIC_RUNTIME_CONFIG.android.premiumSku) {
    warnings.push("EXPO_PUBLIC_IAP_PREMIUM_SKU_ANDROID が未設定です。Premium を未販売なら問題ありません。");
  }

  return Object.freeze({
    readyForPaidSales: blockingIssues.length === 0,
    blockingIssues,
    warnings,
    runtimeConfig: PUBLIC_RUNTIME_CONFIG,
  });
}

export const SUBSCRIPTION_PUBLIC_CONFIG_AUDIT = getSubscriptionPublicAudit();
