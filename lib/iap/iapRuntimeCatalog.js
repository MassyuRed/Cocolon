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

const PLUS_CANONICAL_SUBTITLE = null;
const PREMIUM_CANONICAL_SUBTITLE = null;
const PLUS_CANONICAL_FEATURES = Object.freeze([
  "履歴全般：表示期間1年分。",
  "ホーム：Emlisの観測が入力履歴を踏まえた内容になります。",
  "分析：こころ天気（日/週/月）の本文と観測理由を見られます。",
  "分析：わたしマップで役割スイッチと詳しい自己分析レポートを読めます。",
  "ピース：生成回数が月30回になります。",
]);
const PREMIUM_CANONICAL_FEATURES = Object.freeze([
  "履歴全般：表示期間無制限。",
  "ホーム：Emlisの観測がユーザーごとに合わせた内容になります。",
  "分析：こころ天気（日/週/月）の変化パターンや長期傾向まで見られます。",
  "分析：わたしマップで長期変化や深い分かれ道まで見られます。",
  "ピース：生成回数が無制限になります。",
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
  const detailToken = "__COCOLON_DETAIL_SELF_REPORT__";
  return v
    .replace(/詳しい自己分析レポート/g, detailToken)
    .replace(/無料会員/g, "Freeプラン")
    .replace(/Plus会員/g, "Plusプラン")
    .replace(/Premium会員/g, "Premiumプラン")
    .replace(new RegExp(["My", "Model", "Create"].join(""), "g"), "ProfileCreate")
    .replace(new RegExp(["Reflec", "tion", "Create"].join(""), "g"), "ProfileCreate")
    .replace(new RegExp(["Reflec", "tions"].join(""), "g"), "ピース")
    .replace(new RegExp(["Reflec", "tion"].join(""), "g"), "ピース")
    .replace(/Piece/g, "ピース")
    .replace(/自己分析レポートが閲覧可能になります/g, `わたしマップで役割スイッチと${detailToken}を読めます`)
    .replace(/自己分析レポートがさらに深くなります/g, "わたしマップで長期変化や深い分かれ道まで見られます")
    .replace(/感情分析レポート/g, "こころ天気（日/週/月）")
    .replace(/自己分析レポート/g, detailToken)
    .replace(/自己構造/g, "わたしマップ")
    .replace(/自己分析/g, "わたしマップ")
    .replace(/日報・週報・月報/g, "こころ天気（日/週/月）")
    .replace(/ピース作成/g, "ピース生成")
    .replace(/ピースの作成/g, "ピースの生成")
    .replace(/ピースを作成/g, "ピースを生成")
    .replace(/作成回数/g, "生成回数")
    .replace(new RegExp(["My", "Model"].join(""), "g"), "ピース画面")
    .replace(new RegExp(["My", "Web"].join(""), "g"), "Analysis")
    .replace(new RegExp(detailToken, "g"), "詳しい自己分析レポート");
}


function shouldHideObsoleteProfileCreateFeature(value) {
  const text = String(value || "").trim();
  return text.includes("ProfileCreate") && text.includes("編集");
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
    normalized.subtitle = PLUS_CANONICAL_SUBTITLE;
    normalized.features = [...PLUS_CANONICAL_FEATURES];
  } else if (planCode === "premium") {
    normalized.title = replaceLegacySubscriptionText(plan.title) || "Premiumプラン";
    normalized.subtitle = PREMIUM_CANONICAL_SUBTITLE;
    normalized.features = [...PREMIUM_CANONICAL_FEATURES];
  }

  normalized.note_lines = asStringArray(plan.note_lines, [])
    .map((item) => replaceLegacySubscriptionText(item) || String(item || "").trim())
    .filter(Boolean);
  normalized.cta_label =
    replaceLegacySubscriptionText(plan.cta_label) || asString(plan.cta_label);

  if (planCode === "plus" || planCode === "premium") {
    normalized.note_lines = [];
  }

  return normalized;
}

function plusFallbackFeatures() {
  return [...PLUS_CANONICAL_FEATURES];
}

function premiumFallbackFeatures() {
  return [...PREMIUM_CANONICAL_FEATURES];
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
        subtitle: PLUS_CANONICAL_SUBTITLE,
        features: plusFallbackFeatures(),
        note_lines: [],
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
        emlis_ai: {
          history_mode: "extended",
          continuity_mode: "basic",
          style_mode: "adaptive",
          partner_mode: "on_basic",
          marketing_lines: plusFallbackFeatures().filter((item) => String(item || "").includes("ホーム：")),
        },
      },
      premium: {
        visible: true,
        purchasable: true,
        launch_stage: "live",
        title: "Premiumプラン",
        price_label: "月額980円",
        subtitle: PREMIUM_CANONICAL_SUBTITLE,
        features: premiumFallbackFeatures(),
        note_lines: [],
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
        emlis_ai: {
          history_mode: "full",
          continuity_mode: "advanced",
          style_mode: "personalized",
          partner_mode: "on_advanced",
          marketing_lines: premiumFallbackFeatures().filter((item) => String(item || "").includes("ホーム：")),
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
