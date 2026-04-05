import { Platform } from "react-native";
import {
  getAllSkus,
  getPlanBasePlanId,
  getPlanSku,
  SUBSCRIPTION_PUBLIC_CONFIG,
} from "./iapConfig";

const IOS_MANAGE_SUBSCRIPTIONS_URL =
  "https://apps.apple.com/account/subscriptions";

let runtimeBootstrap = null;

const PLUS_CANONICAL_SUBTITLE = "レポート閲覧 / ReflectionCreate拡張";
const PREMIUM_CANONICAL_SUBTITLE = "表示期間無制限 / 深いレポート / Reflection生成";
const PREMIUM_CANONICAL_FEATURES = Object.freeze([
  "履歴全般：表示期間無制限",
  "MyWeb：感情構造分析レポートがさらに深くなります",
  "MyWeb：自己構造分析レポートがさらに深くなります",
  "MyModel：Reflectionが入力内容から生成されます",
]);

function normalizePlatform(platform = Platform.OS) {
  return platform === "ios" ? "ios" : "android";
}

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function uniq(values) {
  const out = [];
  const seen = new Set();
  for (const value of Array.isArray(values) ? values : []) {
    const v = String(value || "").trim();
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

function asString(value) {
  const v = String(value || "").trim();
  return v || null;
}

function replaceLegacySubscriptionText(value) {
  const v = asString(value);
  if (!v) return null;
  return v
    .replace(/無料会員/g, "Freeプラン")
    .replace(/Plus会員/g, "Plusプラン")
    .replace(/Premium会員/g, "Premiumプラン")
    .replace(/MyModelCreate/g, "ReflectionCreate");
}

function asBool(value, fallback = false) {
  if (value == null) return !!fallback;
  if (typeof value === "boolean") return value;
  const v = String(value).trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(v)) return true;
  if (["0", "false", "no", "off"].includes(v)) return false;
  return !!fallback;
}

function asStringArray(value, fallback = []) {
  const raw = Array.isArray(value) ? value : value == null ? fallback : [value];
  return uniq(raw);
}

function normalizeProductMap(value, fallback = {}) {
  const raw = value && typeof value === "object" ? value : {};
  return {
    ios: asString(raw.ios ?? fallback.ios),
    android: asString(raw.android ?? fallback.android),
  };
}

function normalizeRecognizedMap(value, fallback = {}) {
  const raw = value && typeof value === "object" ? value : {};
  return {
    ios: asStringArray(raw.ios, fallback.ios || []),
    android: asStringArray(raw.android, fallback.android || []),
  };
}

function normalizePlanTextFields(planCode, plan = {}) {
  const normalized = { ...plan };

  if (planCode === "plus") {
    normalized.title = replaceLegacySubscriptionText(plan.title) || "Plusプラン";
    normalized.subtitle =
      replaceLegacySubscriptionText(plan.subtitle) || PLUS_CANONICAL_SUBTITLE;
    normalized.features = asStringArray(plan.features, [])
      .map((item) => replaceLegacySubscriptionText(item) || String(item || "").trim())
      .filter(Boolean);
  } else if (planCode === "premium") {
    normalized.title = "Premiumプラン";
    normalized.subtitle = PREMIUM_CANONICAL_SUBTITLE;
    normalized.features = [...PREMIUM_CANONICAL_FEATURES];
  }

  normalized.note_lines = asStringArray(plan.note_lines, [])
    .map((item) => replaceLegacySubscriptionText(item) || String(item || "").trim())
    .filter(Boolean);
  normalized.cta_label =
    replaceLegacySubscriptionText(plan.cta_label) || asString(plan.cta_label);

  return normalized;
}

function plusFallbackFeatures() {
  return [
    "履歴全般：表示期間１年",
    "MyWeb：感情構造分析レポートが深くなります",
    "MyWeb：自己構造分析レポートを閲覧できます",
    "MyWeb：今日の問いを履歴から編集できます",
    "MyModel：ReflectionCreateの20問すべてを利用できます",
    "MyModel：ReflectionCreateの回答を入力後に編集できます",
  ];
}

function premiumFallbackFeatures() {
  return [
    "履歴全般：表示期間無制限",
    "MyWeb：感情構造分析レポートがさらに深くなります",
    "MyWeb：自己構造分析レポートがさらに深くなります",
    "MyModel：Reflectionが入力内容から生成されます",
  ];
}

export function buildFallbackSubscriptionBootstrap() {
  const plusSkuIos = getPlanSku("plus", "ios");
  const plusSkuAndroid = getPlanSku("plus", "android");
  const premiumSkuIos = getPlanSku("premium", "ios");
  const premiumSkuAndroid = getPlanSku("premium", "android");
  const plusBasePlanAndroid = getPlanBasePlanId("plus", "android");
  const premiumBasePlanAndroid = getPlanBasePlanId("premium", "android");

  return {
    sales_enabled: true,
    client_sales_enabled: true,
    client_sales_disabled_reason: null,
    links: {
      terms_url: asString(SUBSCRIPTION_PUBLIC_CONFIG?.termsUrl),
      privacy_url: asString(SUBSCRIPTION_PUBLIC_CONFIG?.privacyUrl),
      support_url: asString(SUBSCRIPTION_PUBLIC_CONFIG?.supportUrl),
    },
    policy: {
      restore_enabled: true,
      manage_enabled: true,
      ios_manage_url: IOS_MANAGE_SUBSCRIPTIONS_URL,
      android_manage_mode: "specific_subscription",
      android_package_name: asString(SUBSCRIPTION_PUBLIC_CONFIG?.androidPackageName),
      review_notice: null,
    },
    plans: {
      plus: {
        visible: true,
        purchasable: true,
        launch_stage: "live",
        title: "Plusプラン",
        price_label: "月額300円",
        subtitle: "レポート閲覧 / ReflectionCreate拡張",
        features: plusFallbackFeatures(),
        note_lines: [
          "月額300円で自動更新されます。",
          "解約はいつでも行えます。",
        ],
        cta_label: "このプランを選ぶ",
        recommended: true,
        purchase_product_id: {
          ios: asString(plusSkuIos),
          android: asString(plusSkuAndroid),
        },
        recognized_product_ids: {
          ios: asStringArray([plusSkuIos]),
          android: asStringArray([plusSkuAndroid]),
        },
        purchase_base_plan_id: {
          ios: null,
          android: asString(plusBasePlanAndroid),
        },
        recognized_base_plan_ids: {
          ios: [],
          android: asStringArray([plusBasePlanAndroid]),
        },
      },
      premium: {
        visible: true,
        purchasable: true,
        launch_stage: "live",
        title: "Premiumプラン",
        price_label: "月額980円",
        subtitle: "表示期間無制限 / 深いレポート / Reflection生成",
        features: premiumFallbackFeatures(),
        note_lines: [
          "月額980円で自動更新されます。",
          "解約はいつでもストアのサブスクリプション管理から行えます。",
        ],
        cta_label: "このプランを選ぶ",
        recommended: false,
        purchase_product_id: {
          ios: asString(premiumSkuIos),
          android: asString(premiumSkuAndroid),
        },
        recognized_product_ids: {
          ios: asStringArray([premiumSkuIos]),
          android: asStringArray([premiumSkuAndroid]),
        },
        purchase_base_plan_id: {
          ios: null,
          android: asString(premiumBasePlanAndroid),
        },
        recognized_base_plan_ids: {
          ios: [],
          android: asStringArray([premiumBasePlanAndroid]),
        },
      },
    },
  };
}

function normalizePlan(planCode, planValue, fallbackPlan) {
  const raw = planValue && typeof planValue === "object" ? planValue : {};
  const fallback = fallbackPlan && typeof fallbackPlan === "object" ? fallbackPlan : {};
  const purchaseProductId = normalizeProductMap(
    raw.purchase_product_id,
    fallback.purchase_product_id || {}
  );
  const recognizedProductIds = normalizeRecognizedMap(
    raw.recognized_product_ids,
    fallback.recognized_product_ids || {}
  );
  const purchaseBasePlanId = normalizeProductMap(
    raw.purchase_base_plan_id,
    fallback.purchase_base_plan_id || {}
  );
  const recognizedBasePlanIds = normalizeRecognizedMap(
    raw.recognized_base_plan_ids,
    fallback.recognized_base_plan_ids || {}
  );

  return normalizePlanTextFields(planCode, {
    visible: asBool(raw.visible, fallback.visible ?? true),
    purchasable: asBool(raw.purchasable, fallback.purchasable ?? false),
    launch_stage:
      asString(raw.launch_stage) ||
      asString(fallback.launch_stage) ||
      (planCode === "plus" ? "live" : "coming_soon"),
    title:
      replaceLegacySubscriptionText(raw.title) ||
      replaceLegacySubscriptionText(fallback.title) ||
      (planCode === "plus" ? "Plusプラン" : "Premiumプラン"),
    price_label: asString(raw.price_label) || asString(fallback.price_label),
    subtitle:
      replaceLegacySubscriptionText(raw.subtitle) ||
      replaceLegacySubscriptionText(fallback.subtitle),
    features: asStringArray(raw.features, fallback.features || [])
      .map((item) => replaceLegacySubscriptionText(item) || String(item || "").trim())
      .filter(Boolean),
    note_lines: asStringArray(raw.note_lines, fallback.note_lines || [])
      .map((item) => replaceLegacySubscriptionText(item) || String(item || "").trim())
      .filter(Boolean),
    cta_label:
      replaceLegacySubscriptionText(raw.cta_label) ||
      replaceLegacySubscriptionText(fallback.cta_label),
    recommended: asBool(raw.recommended, fallback.recommended ?? false),
    purchase_product_id: purchaseProductId,
    recognized_product_ids: {
      ios: uniq([
        ...(recognizedProductIds.ios || []),
        ...(purchaseProductId.ios ? [purchaseProductId.ios] : []),
      ]),
      android: uniq([
        ...(recognizedProductIds.android || []),
        ...(purchaseProductId.android ? [purchaseProductId.android] : []),
      ]),
    },
    purchase_base_plan_id: {
      ios: null,
      android: asString(purchaseBasePlanId.android),
    },
    recognized_base_plan_ids: {
      ios: [],
      android: uniq([
        ...(recognizedBasePlanIds.android || []),
        ...(purchaseBasePlanId.android ? [purchaseBasePlanId.android] : []),
      ]),
    },
  });
}

export function normalizeSubscriptionBootstrapPayload(payload) {
  const fallback = buildFallbackSubscriptionBootstrap();
  const raw = payload && typeof payload === "object" ? payload : {};
  const linksRaw = raw.links && typeof raw.links === "object" ? raw.links : {};
  const linksFallback = fallback.links || {};
  const policyRaw = raw.policy && typeof raw.policy === "object" ? raw.policy : {};
  const policyFallback = fallback.policy || {};
  const rawPlans = raw.plans && typeof raw.plans === "object" ? raw.plans : {};
  const fallbackPlans = fallback.plans || {};

  return {
    sales_enabled: asBool(raw.sales_enabled, fallback.sales_enabled ?? true),
    client_sales_enabled: asBool(
      raw.client_sales_enabled,
      fallback.client_sales_enabled ?? true
    ),
    client_sales_disabled_reason:
      asString(raw.client_sales_disabled_reason) ||
      asString(fallback.client_sales_disabled_reason),
    links: {
      terms_url: asString(linksRaw.terms_url) || asString(linksFallback.terms_url),
      privacy_url:
        asString(linksRaw.privacy_url) || asString(linksFallback.privacy_url),
      support_url:
        asString(linksRaw.support_url) || asString(linksFallback.support_url),
    },
    policy: {
      restore_enabled: asBool(
        policyRaw.restore_enabled,
        policyFallback.restore_enabled ?? true
      ),
      manage_enabled: asBool(
        policyRaw.manage_enabled,
        policyFallback.manage_enabled ?? true
      ),
      ios_manage_url:
        asString(policyRaw.ios_manage_url) || asString(policyFallback.ios_manage_url),
      android_manage_mode:
        asString(policyRaw.android_manage_mode) ||
        asString(policyFallback.android_manage_mode) ||
        "specific_subscription",
      android_package_name:
        asString(policyRaw.android_package_name) ||
        asString(policyFallback.android_package_name),
      review_notice:
        asString(policyRaw.review_notice) || asString(policyFallback.review_notice),
    },
    plans: {
      plus: normalizePlan("plus", rawPlans.plus, fallbackPlans.plus),
      premium: normalizePlan("premium", rawPlans.premium, fallbackPlans.premium),
    },
  };
}

export function hydrateSubscriptionRuntimeCatalog(payload) {
  runtimeBootstrap = normalizeSubscriptionBootstrapPayload(payload);
  return clone(runtimeBootstrap);
}

export function clearSubscriptionRuntimeCatalog() {
  runtimeBootstrap = null;
}

export function getSubscriptionRuntimeCatalog() {
  return clone(runtimeBootstrap || buildFallbackSubscriptionBootstrap());
}

export function getSubscriptionPlanConfig(planCode) {
  const plan = String(planCode || "").trim().toLowerCase();
  const payload = getSubscriptionRuntimeCatalog();
  return clone(payload?.plans?.[plan] || null);
}

export function getSubscriptionLinks() {
  return clone(getSubscriptionRuntimeCatalog()?.links || {});
}

export function getSubscriptionPolicy() {
  return clone(getSubscriptionRuntimeCatalog()?.policy || {});
}

export function getPurchaseSku(planCode, platform = Platform.OS) {
  const plat = normalizePlatform(platform);
  const plan = getSubscriptionPlanConfig(planCode);
  return asString(plan?.purchase_product_id?.[plat]);
}

export function getPurchaseBasePlanId(planCode, platform = Platform.OS) {
  const plat = normalizePlatform(platform);
  if (plat !== "android") return "";
  const plan = getSubscriptionPlanConfig(planCode);
  return asString(plan?.purchase_base_plan_id?.[plat]) || "";
}

export function getRecognizedSkusForPlan(planCode, platform = Platform.OS) {
  const plat = normalizePlatform(platform);
  const plan = getSubscriptionPlanConfig(planCode);
  return asStringArray(plan?.recognized_product_ids?.[plat] || []);
}

export function getRecognizedBasePlanIdsForPlan(planCode, platform = Platform.OS) {
  const plat = normalizePlatform(platform);
  if (plat !== "android") return [];
  const plan = getSubscriptionPlanConfig(planCode);
  return asStringArray(plan?.recognized_base_plan_ids?.[plat] || []);
}

export function getRecognizedSkus(platform = Platform.OS) {
  return uniq([
    ...getRecognizedSkusForPlan("plus", platform),
    ...getRecognizedSkusForPlan("premium", platform),
  ]);
}

function getMatchingPlansByProductId(productId, platform = Platform.OS) {
  const pid = asString(productId);
  if (!pid) return [];
  const plat = normalizePlatform(platform);
  const matches = [];
  for (const planCode of ["premium", "plus"]) {
    const set = new Set(getRecognizedSkusForPlan(planCode, plat));
    if (set.has(pid)) matches.push(planCode);
  }
  return matches;
}

export function getPlanForProductId(productId, platform = Platform.OS) {
  const matches = getMatchingPlansByProductId(productId, platform);
  return matches.length === 1 ? matches[0] : "";
}

export function getPlanForProductAndBasePlan(
  productId,
  basePlanId,
  platform = Platform.OS
) {
  const plat = normalizePlatform(platform);
  if (plat === "ios") {
    return getPlanForProductId(productId, plat);
  }

  const pid = asString(productId);
  if (!pid) return "";
  const basePlan = asString(basePlanId);

  if (basePlan) {
    const matches = [];
    for (const planCode of ["premium", "plus"]) {
      const skuSet = new Set(getRecognizedSkusForPlan(planCode, plat));
      const basePlanSet = new Set(getRecognizedBasePlanIdsForPlan(planCode, plat));
      if (skuSet.has(pid) && basePlanSet.has(basePlan)) {
        matches.push(planCode);
      }
    }
    if (matches.length === 1) return matches[0];
  }

  return getPlanForProductId(pid, plat);
}
