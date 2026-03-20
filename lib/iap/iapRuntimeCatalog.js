import { Platform } from "react-native";
import {
  getAllSkus,
  getPlanSku,
  IAP_TRIAL_OFFER_TAGS,
  SUBSCRIPTION_PUBLIC_CONFIG,
} from "./iapConfig";

const IOS_MANAGE_SUBSCRIPTIONS_URL =
  "https://apps.apple.com/account/subscriptions";

let runtimeBootstrap = null;

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

function plusFallbackFeatures() {
  return [
    "履歴全般：表示期間１年",
    "MyWeb：感情構造分析レポートが深くなります",
    "MyWeb：自己構造分析レポートを閲覧できます",
    "MyWeb：今日の問いを履歴から編集できます",
    "MyModel：MyModelCreateの20問すべてを利用できます",
    "MyModel：MyModelCreateを入力後に編集できます",
  ];
}

function premiumFallbackFeatures() {
  return [
    "MyWeb：感情構造分析レポートに Deep モードが追加されます",
    "MyWeb：自己構造分析レポートに Deep モードが追加されます",
    "MyWeb：DeepInsight を利用できます",
    "MyModel：Reflection を入力内容から生成できます",
    "MyModel：自己紹介文を生成できます",
    "MyModel：Echoes履歴の分析機能を利用できます",
    "MyModel：Discoveries履歴の分析機能を利用できます",
  ];
}

export function buildFallbackSubscriptionBootstrap() {
  const plusSkuIos = getPlanSku("plus", "ios");
  const plusSkuAndroid = getPlanSku("plus", "android");
  const premiumSkuIos = getPlanSku("premium", "ios");
  const premiumSkuAndroid = getPlanSku("premium", "android");

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
        title: "Plus会員",
        price_label: "月額300円",
        subtitle: "レポート閲覧 / MyModelCreate拡張",
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
        trial: {
          enabled: true,
          subtitle: "１ヵ月無料トライアル（初回限定）",
          android_offer_tag: asString(IAP_TRIAL_OFFER_TAGS?.android?.plus || "trial_1m_new_user"),
        },
      },
      premium: {
        visible: true,
        purchasable: false,
        launch_stage: "coming_soon",
        title: "Premium会員",
        price_label: "月額980円",
        subtitle: "Deepモード / DeepInsight / 生成・分析機能",
        features: premiumFallbackFeatures(),
        note_lines: ["※Premiumは準備中です。"],
        cta_label: "準備中",
        recommended: false,
        purchase_product_id: {
          ios: asString(premiumSkuIos),
          android: asString(premiumSkuAndroid),
        },
        recognized_product_ids: {
          ios: asStringArray([premiumSkuIos]),
          android: asStringArray([premiumSkuAndroid]),
        },
        trial: {
          enabled: false,
          subtitle: null,
          android_offer_tag: null,
        },
      },
    },
  };
}

function normalizePlan(planCode, planValue, fallbackPlan) {
  const raw = planValue && typeof planValue === "object" ? planValue : {};
  const fallback = fallbackPlan && typeof fallbackPlan === "object" ? fallbackPlan : {};
  const purchaseProductId = normalizeProductMap(raw.purchase_product_id, fallback.purchase_product_id || {});
  const recognizedProductIds = normalizeRecognizedMap(raw.recognized_product_ids, fallback.recognized_product_ids || {});
  const trialRaw = raw.trial && typeof raw.trial === "object" ? raw.trial : {};
  const trialFallback = fallback.trial && typeof fallback.trial === "object" ? fallback.trial : {};

  return {
    visible: asBool(raw.visible, fallback.visible ?? true),
    purchasable: asBool(raw.purchasable, fallback.purchasable ?? false),
    launch_stage: asString(raw.launch_stage) || asString(fallback.launch_stage) || (planCode === "plus" ? "live" : "coming_soon"),
    title: asString(raw.title) || asString(fallback.title) || (planCode === "plus" ? "Plus会員" : "Premium会員"),
    price_label: asString(raw.price_label) || asString(fallback.price_label),
    subtitle: asString(raw.subtitle) || asString(fallback.subtitle),
    features: asStringArray(raw.features, fallback.features || []),
    note_lines: asStringArray(raw.note_lines, fallback.note_lines || []),
    cta_label: asString(raw.cta_label) || asString(fallback.cta_label),
    recommended: asBool(raw.recommended, fallback.recommended ?? false),
    purchase_product_id: purchaseProductId,
    recognized_product_ids: {
      ios: uniq([...(recognizedProductIds.ios || []), ...(purchaseProductId.ios ? [purchaseProductId.ios] : [])]),
      android: uniq([...(recognizedProductIds.android || []), ...(purchaseProductId.android ? [purchaseProductId.android] : [])]),
    },
    trial: {
      enabled: asBool(trialRaw.enabled, trialFallback.enabled ?? false),
      subtitle: asString(trialRaw.subtitle) || asString(trialFallback.subtitle),
      android_offer_tag: asString(trialRaw.android_offer_tag) || asString(trialFallback.android_offer_tag),
    },
  };
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
    client_sales_enabled: asBool(raw.client_sales_enabled, fallback.client_sales_enabled ?? true),
    client_sales_disabled_reason:
      asString(raw.client_sales_disabled_reason) || asString(fallback.client_sales_disabled_reason),
    links: {
      terms_url: asString(linksRaw.terms_url) || asString(linksFallback.terms_url),
      privacy_url: asString(linksRaw.privacy_url) || asString(linksFallback.privacy_url),
      support_url: asString(linksRaw.support_url) || asString(linksFallback.support_url),
    },
    policy: {
      restore_enabled: asBool(policyRaw.restore_enabled, policyFallback.restore_enabled ?? true),
      manage_enabled: asBool(policyRaw.manage_enabled, policyFallback.manage_enabled ?? true),
      ios_manage_url: asString(policyRaw.ios_manage_url) || asString(policyFallback.ios_manage_url),
      android_manage_mode:
        asString(policyRaw.android_manage_mode) || asString(policyFallback.android_manage_mode) || "specific_subscription",
      android_package_name:
        asString(policyRaw.android_package_name) || asString(policyFallback.android_package_name),
      review_notice: asString(policyRaw.review_notice) || asString(policyFallback.review_notice),
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

export function getRecognizedSkusForPlan(planCode, platform = Platform.OS) {
  const plat = normalizePlatform(platform);
  const plan = getSubscriptionPlanConfig(planCode);
  return asStringArray(plan?.recognized_product_ids?.[plat] || []);
}

export function getRecognizedSkus(platform = Platform.OS) {
  return uniq([
    ...getRecognizedSkusForPlan("plus", platform),
    ...getRecognizedSkusForPlan("premium", platform),
  ]);
}

export function getPlanForProductId(productId, platform = Platform.OS) {
  const pid = asString(productId);
  if (!pid) return "";
  const plat = normalizePlatform(platform);
  for (const planCode of ["premium", "plus"]) {
    const set = new Set(getRecognizedSkusForPlan(planCode, plat));
    if (set.has(pid)) return planCode;
  }
  return "";
}

export function getTrialOfferTag(planCode, platform = Platform.OS) {
  const plat = normalizePlatform(platform);
  const plan = getSubscriptionPlanConfig(planCode);
  if (plat === "android") {
    return asString(plan?.trial?.android_offer_tag);
  }
  return null;
}
