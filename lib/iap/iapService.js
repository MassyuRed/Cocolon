// lib/iap/iapService.js
// ------------------------------------------------------------
// react-native-iap を使ったサブスク購入の薄いラッパー
//
// Phase 2:
// - 申込 / 復元時に /subscription/update の canonical state を扱う
// - appAccountToken / obfuscatedAccountId を購入引数へ載せる
// - API エラーコードを UI へ返せる形に整える
//
// Phase 3 subscription bootstrap:
// - SKU / 認識対象SKU は runtime bootstrap を最優先
// - static env は fallback としてのみ利用
// ------------------------------------------------------------

import { Platform } from "react-native";
import * as RNIap from "react-native-iap";
import {
  getAllSkus,
  getPlanSku,
  SUBSCRIPTION_PUBLIC_CONFIG,
} from "./iapConfig";
import {
  getPlanForProductAndBasePlan,
  getPlanForProductId,
  getPurchaseBasePlanId,
  getPurchaseSku,
  getRecognizedBasePlanIdsForPlan,
  getRecognizedSkus,
  getRecognizedSkusForPlan,
} from "./iapRuntimeCatalog";
import { supabase } from "../supabase";
import { postSubscriptionUpdate } from "../subscriptionApi";

const RUNTIME_API_BASE_URL =
  SUBSCRIPTION_PUBLIC_CONFIG.apiBaseUrl || "https://mashos-api.onrender.com";

export const IAP_PRODUCT_IDS = Object.freeze({
  plus: String(getPlanSku("plus") || "").trim(),
  premium: String(getPlanSku("premium") || "").trim(),
});

let _connectionPromise = null;
let _connected = false;
let _purchaseUpdatedSub = null;
let _purchaseErrorSub = null;
const _purchaseProcessingState = new Map();
const ANDROID_SUBSCRIPTION_CHANGE_REPLACEMENT_MODE = 1;

function _coerceStr(v) {
  return String(v ?? "").trim();
}

function _safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function _productIds(products) {
  return _safeArray(products)
    .map((item) => _coerceStr(item?.productId || item?.sku))
    .filter(Boolean);
}

function _serializeIapError(err) {
  if (!err) return {};
  const out = {};
  for (const key of [
    "code",
    "message",
    "responseCode",
    "debugMessage",
    "productId",
    "platform",
    "domain",
  ]) {
    const value = err?.[key];
    if (value != null && value !== "") out[key] = value;
  }
  if (err?.userInfo && typeof err.userInfo === "object") {
    try {
      out.userInfo = JSON.parse(JSON.stringify(err.userInfo));
    } catch {
      // noop
    }
  }
  return out;
}

function _attachDebugInfo(err, debugInfo) {
  const base = err instanceof Error ? err : new Error(_coerceStr(err?.message || err) || "IAP error");
  try {
    const current = base?.debugInfo && typeof base.debugInfo === "object" ? base.debugInfo : {};
    base.debugInfo = { ...current, ...debugInfo };
  } catch {
    // noop
  }
  return base;
}

function _purchaseKey(purchase) {
  const token = _coerceStr(purchase?.purchaseToken);
  if (token) return `pt:${token}`;

  const tx = _coerceStr(purchase?.transactionId);
  if (tx) return `tx:${tx}`;

  const pid = _coerceStr(purchase?.productId);
  const time = _coerceStr(purchase?.transactionDate || purchase?.purchaseTime || "");
  if (pid || time) return `misc:${pid}:${time}`;
  return "";
}

function _purchaseTimestamp(purchase) {
  const candidates = [
    purchase?.transactionDate,
    purchase?.purchaseTime,
    purchase?.purchaseDate,
  ];
  for (const candidate of candidates) {
    const numeric = Number(candidate);
    if (Number.isFinite(numeric) && numeric > 0) return numeric;

    const parsed = Date.parse(_coerceStr(candidate));
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return 0;
}

function _recognizedSkusForPlan(plan, platform = Platform.OS) {
  const skus = new Set(
    _safeArray(getRecognizedSkusForPlan(plan, platform))
      .map((item) => _coerceStr(item))
      .filter(Boolean)
  );
  const purchaseSku = _purchaseSku(plan, platform);
  if (purchaseSku) skus.add(purchaseSku);
  return Array.from(skus);
}

function _recognizedBasePlanIdsForPlan(plan, platform = Platform.OS) {
  return _safeArray(getRecognizedBasePlanIdsForPlan(plan, platform))
    .map((item) => _coerceStr(item))
    .filter(Boolean);
}

function _purchaseBasePlanId(plan, platform = Platform.OS) {
  return _coerceStr(getPurchaseBasePlanId(plan, platform));
}

async function _findLatestAvailablePurchaseForPlan(plan, platform = Platform.OS) {
  await ensureIapConnection();
  const recognized = new Set(_recognizedSkusForPlan(plan, platform));
  if (recognized.size === 0) return null;

  const all = await RNIap.getAvailablePurchases();
  const matches = _safeArray(all).filter((purchase) =>
    recognized.has(_coerceStr(purchase?.productId || purchase?.sku))
  );
  if (matches.length === 0) return null;

  matches.sort((left, right) => _purchaseTimestamp(right) - _purchaseTimestamp(left));
  return matches[0] || null;
}

function _createAndroidSubscriptionChangeFallbackError(message, debugInfo = {}) {
  const err = new Error(
    _coerceStr(message) ||
      "Google Play のサブスクリプション管理から Premium プランへ変更してください。"
  );
  err.code = "E_ANDROID_SUBSCRIPTION_CHANGE_FALLBACK";
  err.requiresManageSubscription = true;
  return _attachDebugInfo(err, debugInfo);
}

function _knownSkus(platform = Platform.OS) {
  const runtimeSkus = getRecognizedSkus(platform);
  if (Array.isArray(runtimeSkus) && runtimeSkus.length > 0) {
    return runtimeSkus.map((x) => _coerceStr(x)).filter(Boolean);
  }
  return (getAllSkus(platform) || []).map((x) => _coerceStr(x)).filter(Boolean);
}

function _purchaseSku(plan, platform = Platform.OS) {
  return _coerceStr(getPurchaseSku(plan, platform) || getPlanSku(plan, platform));
}

function _isOurSku(productId) {
  const pid = _coerceStr(productId);
  if (!pid) return false;
  try {
    const set = new Set(_knownSkus().map((x) => _coerceStr(x)).filter(Boolean));
    return set.has(pid);
  } catch {
    return false;
  }
}

function _inferTierFromSku(productId, hintedTier, basePlanId = "") {
  const hint = _coerceStr(hintedTier).toLowerCase();
  if (hint === "plus" || hint === "premium" || hint === "free") return hint;

  const pid = _coerceStr(productId);
  if (!pid) return "";

  const normalizedBasePlanId = _coerceStr(basePlanId);
  const runtimePlanWithBasePlan = _coerceStr(
    getPlanForProductAndBasePlan(pid, normalizedBasePlanId, Platform.OS)
  ).toLowerCase();
  if (runtimePlanWithBasePlan === "plus" || runtimePlanWithBasePlan === "premium") {
    return runtimePlanWithBasePlan;
  }

  const runtimePlan = _coerceStr(getPlanForProductId(pid, Platform.OS)).toLowerCase();
  if (runtimePlan === "plus" || runtimePlan === "premium") return runtimePlan;

  if (Platform.OS !== "android") {
    const plusSku = _purchaseSku("plus");
    const premiumSku = _purchaseSku("premium");

    if (plusSku && pid === plusSku) return "plus";
    if (premiumSku && pid === premiumSku) return "premium";
  }

  const lowerBasePlan = normalizedBasePlanId.toLowerCase();
  if (lowerBasePlan.includes("premium")) return "premium";
  if (lowerBasePlan.includes("plus")) return "plus";

  const lower = pid.toLowerCase();
  if (Platform.OS !== "android") {
    if (lower.includes("premium")) return "premium";
    if (lower.includes("plus")) return "plus";
  }
  return "";
}

async function _getSessionSnapshot() {
  try {
    const { data } = await supabase.auth.getSession();
    return data?.session ?? null;
  } catch {
    return null;
  }
}

async function _buildPurchaseIdentityArgs() {
  const session = await _getSessionSnapshot();
  const userId = _coerceStr(session?.user?.id);
  if (!userId) return {};

  const shared = {};
  if (Platform.OS === "ios") {
    shared.appAccountToken = userId;
  }
  if (Platform.OS === "android") {
    shared.obfuscatedAccountIdAndroid = userId;
    shared.obfuscatedProfileIdAndroid = userId;
  }
  return shared;
}

function _createApiError({ httpStatus, payload }) {
  const detail = payload?.detail;
  const detailObj = detail && typeof detail === "object" ? detail : null;
  const message =
    _coerceStr(detailObj?.message || detailObj?.detail || detail || payload?.message) ||
    `HTTP ${httpStatus}`;
  const err = new Error(message);
  err.httpStatus = Number(httpStatus || 0) || 0;
  err.apiPayload = payload || null;
  err.apiCode = _coerceStr(detailObj?.code || payload?.code);
  err.apiDetail = detailObj || null;
  return err;
}

export async function ensureIapConnection() {
  if (_connected) return true;
  if (_connectionPromise) return _connectionPromise;

  _connectionPromise = (async () => {
    try {
      await RNIap.initConnection();
      _connected = true;

      if (
        Platform.OS === "android" &&
        typeof RNIap.flushFailedPurchasesCachedAsPendingAndroid === "function"
      ) {
        try {
          await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
        } catch {
          // ignore
        }
      }

      return true;
    } finally {
      _connectionPromise = null;
    }
  })();

  return _connectionPromise;
}

export function endIapConnection() {
  try {
    RNIap.endConnection();
  } catch {
    // ignore
  } finally {
    _connected = false;
    _connectionPromise = null;
  }
}

async function getSubscriptionsSafe(skus) {
  const result = await getSubscriptionsWithDebug(skus);
  return result.products;
}

async function getSubscriptionsWithDebug(skus) {
  const cleanSkus = _safeArray(skus).map((item) => _coerceStr(item)).filter(Boolean);
  const result = { products: [], attempts: [] };
  if (cleanSkus.length === 0) return result;

  try {
    const products = await RNIap.getSubscriptions({ skus: cleanSkus });
    result.products = _safeArray(products);
    result.attempts.push({
      shape: "object",
      ok: true,
      skus: cleanSkus,
      productIds: _productIds(products),
    });
    return result;
  } catch (err1) {
    result.attempts.push({
      shape: "object",
      ok: false,
      skus: cleanSkus,
      error: _serializeIapError(err1),
    });
  }

  try {
    const products = await RNIap.getSubscriptions(cleanSkus);
    result.products = _safeArray(products);
    result.attempts.push({
      shape: "array",
      ok: true,
      skus: cleanSkus,
      productIds: _productIds(products),
    });
    return result;
  } catch (err2) {
    result.attempts.push({
      shape: "array",
      ok: false,
      skus: cleanSkus,
      error: _serializeIapError(err2),
    });
  }

  return result;
}

function _getAndroidOfferList(product) {
  return (
    product?.subscriptionOfferDetails ||
    product?.subscriptionOffers ||
    product?.offers ||
    []
  );
}

function _getOfferToken(offer) {
  return String(offer?.offerToken || "").trim();
}

function _getOfferBasePlanId(offer) {
  return String(
    offer?.basePlanId ||
      offer?.base_plan_id ||
      offer?.offerDetails?.basePlanId ||
      ""
  ).trim();
}

function _getPricingPhases(offer) {
  const p = offer?.pricingPhases;
  if (Array.isArray(p)) return p;
  if (Array.isArray(p?.pricingPhaseList)) return p.pricingPhaseList;
  return [];
}

function _hasZeroPricePhase(offer) {
  const phases = _getPricingPhases(offer);
  return phases.some((ph) => {
    const micros = Number(ph?.priceAmountMicros ?? NaN);
    if (Number.isFinite(micros) && micros === 0) return true;
    const formatted = String(ph?.formattedPrice || "").trim().toLowerCase();
    return formatted === "free" || formatted === "無料";
  });
}

function pickAndroidOfferToken(product, plan = "") {
  const list = _getAndroidOfferList(product);
  if (!Array.isArray(list) || list.length === 0) return "";

  const targetBasePlanId = _purchaseBasePlanId(plan, "android");
  if (targetBasePlanId) {
    const matches = list.filter(
      (offer) => _getOfferBasePlanId(offer) === targetBasePlanId
    );
    const paidMatch = matches.find((offer) => !_hasZeroPricePhase(offer));
    if (paidMatch) return _getOfferToken(paidMatch);
    for (const offer of matches) {
      const token = _getOfferToken(offer);
      if (token) return token;
    }
  }

  const paidOffer = list.find((offer) => !_hasZeroPricePhase(offer));
  if (paidOffer) return _getOfferToken(paidOffer);

  for (const offer of list) {
    const token = _getOfferToken(offer);
    if (token) return token;
  }

  return "";
}

async function finishTransactionSafe(purchase) {
  if (!purchase) return;
  try {
    await RNIap.finishTransaction({ purchase, isConsumable: false });
    return;
  } catch {
    // ignore
  }

  try {
    await RNIap.finishTransaction(purchase, false);
  } catch {
    // ignore
  }
}

async function _postSubscriptionUpdate({
  tier,
  productId,
  purchase,
  basePlanId = "",
}) {
  const session = await _getSessionSnapshot();
  const accessToken = session?.access_token ?? null;
  if (!accessToken) {
    throw new Error("認証トークンが取得できませんでした（ログイン状態を確認してください）");
  }

  const payload = {
    platform: Platform.OS,
    product_id: _coerceStr(productId || purchase?.productId),
    purchase_token: _coerceStr(purchase?.purchaseToken) || undefined,
    transaction_receipt: _coerceStr(purchase?.transactionReceipt) || undefined,
    transaction_id: _coerceStr(purchase?.transactionId) || undefined,
    subscription_tier: tier || undefined,
    base_plan_id: Platform.OS === "android" ? _coerceStr(basePlanId) || undefined : undefined,
  };

  if (!payload.purchase_token && !payload.transaction_receipt && !payload.transaction_id) {
    throw new Error(
      "購入情報（purchaseToken / transactionReceipt / transactionId）が不足しています。"
    );
  }

  try {
    return (await postSubscriptionUpdate(payload)) || {};
  } catch (err) {
    if (err?.status) {
      throw _createApiError({ httpStatus: err.status, payload: err.body });
    }
    throw err;
  }
}

export async function syncPurchaseToSubscriptionTier(purchase, opts = {}) {
  if (!purchase) return { ok: false, reason: "no_purchase" };

  const productId = _coerceStr(purchase?.productId);
  if (!_isOurSku(productId)) {
    return { ok: false, reason: "not_our_sku" };
  }

  const key = _purchaseKey(purchase);
  if (!key) {
    return { ok: false, reason: "no_key" };
  }

  const state = _purchaseProcessingState.get(key);
  if (state === "done" || state === "processing") {
    return { ok: true, skipped: true };
  }

  _purchaseProcessingState.set(key, "processing");

  try {
    await ensureIapConnection();

    const normalizedBasePlanId = _coerceStr(opts?.basePlanId);
    const tier = _inferTierFromSku(
      productId,
      opts?.tier || opts?.plan,
      normalizedBasePlanId
    );

    if (!tier && Platform.OS !== "android") {
      throw new Error("SKU からプラン種別（plus/premium）が判定できませんでした。");
    }

    const updateRes = await _postSubscriptionUpdate({
      tier: tier || undefined,
      productId,
      purchase,
      basePlanId: normalizedBasePlanId,
    });

    await finishTransactionSafe(purchase);

    _purchaseProcessingState.set(key, "done");
    return {
      ok: true,
      tier: tier || _coerceStr(updateRes?.plan_code || updateRes?.subscription_tier),
      updateRes,
    };
  } catch (e) {
    _purchaseProcessingState.delete(key);
    throw e;
  }
}

export async function startIapPurchaseObserver() {
  if (_purchaseUpdatedSub || _purchaseErrorSub) return;

  await ensureIapConnection();

  _purchaseUpdatedSub = RNIap.purchaseUpdatedListener(async (purchase) => {
    try {
      await syncPurchaseToSubscriptionTier(purchase);
    } catch (e) {
      console.warn("IAP purchaseUpdatedListener: sync failed:", e?.message || e);
    }
  });

  _purchaseErrorSub = RNIap.purchaseErrorListener((err) => {
    console.warn("IAP purchaseErrorListener:", err?.message || err);
  });
}

export function stopIapPurchaseObserver() {
  try {
    if (_purchaseUpdatedSub?.remove) _purchaseUpdatedSub.remove();
  } catch {
    // ignore
  }
  try {
    if (_purchaseErrorSub?.remove) _purchaseErrorSub.remove();
  } catch {
    // ignore
  }

  _purchaseUpdatedSub = null;
  _purchaseErrorSub = null;
}

export async function requestSubscriptionForPlan(plan, opts = {}) {
  const normalizedPlan = _coerceStr(plan).toLowerCase();
  const requestedFromPlan = _coerceStr(opts?.fromPlan).toLowerCase();
  const sku = _purchaseSku(normalizedPlan);
  if (!sku) {
    throw new Error("SKUが未設定です（サブスク設定を確認してください）");
  }

  const targetBasePlanId =
    Platform.OS === "android" ? _purchaseBasePlanId(normalizedPlan, "android") : "";

  const useAndroidSubscriptionChangeFlow =
    Platform.OS === "android" &&
    normalizedPlan === "premium" &&
    requestedFromPlan === "plus";

  await ensureIapConnection();

  const lookupDebug = {
    platform: Platform.OS,
    plan: normalizedPlan,
    targetSku: sku,
    targetBasePlanId: targetBasePlanId || undefined,
    knownSkus: _knownSkus(),
    lookupAttempts: [],
    requestedFromPlan: requestedFromPlan || undefined,
    useAndroidSubscriptionChangeFlow,
  };

  // iOS は「未販売/未作成の SKU を同時に渡す」と商品取得が空になり、
  // その後の requestSubscription が Invalid product ID で失敗することがある。
  // 購入直前の取得は、対象プランの SKU だけに絞る。
  const lookupSkus = Platform.OS === "ios" ? [sku] : _knownSkus();
  const primaryLookupSkus = lookupSkus.length > 0 ? lookupSkus : [sku];
  lookupDebug.lookupSkusPrimary = primaryLookupSkus;
  const primaryLookup = await getSubscriptionsWithDebug(primaryLookupSkus);
  lookupDebug.lookupAttempts.push(..._safeArray(primaryLookup.attempts));
  let products = primaryLookup.products;

  if (Platform.OS === "ios" && !_safeArray(products).length) {
    const fallbackSkus = _knownSkus().filter((candidate) => candidate && candidate !== sku);
    if (fallbackSkus.length > 0) {
      lookupDebug.lookupSkusFallback = [sku, ...fallbackSkus];
      const fallbackLookup = await getSubscriptionsWithDebug([sku, ...fallbackSkus]);
      lookupDebug.lookupAttempts.push(..._safeArray(fallbackLookup.attempts));
      products = fallbackLookup.products;
    }
  }

  const product =
    _safeArray(products).find(
      (p) => String(p?.productId || p?.sku || "").trim() === sku
    ) || null;
  lookupDebug.productIds = _productIds(products);
  lookupDebug.matchedProductId = _coerceStr(product?.productId || product?.sku);
  lookupDebug.availableBasePlanIds = _safeArray(_getAndroidOfferList(product))
    .map((offer) => _getOfferBasePlanId(offer))
    .filter(Boolean);

  if (!product) {
    const err = new Error(
      Platform.OS === "ios"
        ? "App Store から対象サブスク商品を取得できませんでした。Bundle ID / Product ID / App Store Connect の状態を確認してください。"
        : "Google Play から対象サブスク商品を取得できませんでした。商品ID / 基本プラン設定をご確認ください。"
    );
    err.code = "E_PRODUCT_NOT_FETCHED";
    err.productId = sku;
    throw _attachDebugInfo(err, lookupDebug);
  }

  const identityArgs = await _buildPurchaseIdentityArgs();
  const args = { sku, ...identityArgs };

  if (Platform.OS === "ios") {
    // 自動 finish を避け、サーバー反映後に finishTransaction する現在の実装と揃える。
    args.andDangerouslyFinishTransactionAutomaticallyIOS = false;
  }

  let androidChangeSourcePurchase = null;
  let androidOfferToken = "";
  if (Platform.OS === "android") {
    androidOfferToken = pickAndroidOfferToken(product, normalizedPlan);
    lookupDebug.selectedOfferToken = androidOfferToken || undefined;
    if (targetBasePlanId && !androidOfferToken) {
      const err = new Error(
        "Google Play から対象プランの購入情報を取得できませんでした。基本プランIDをご確認ください。"
      );
      err.code = "E_ANDROID_BASE_PLAN_NOT_FOUND";
      throw _attachDebugInfo(err, lookupDebug);
    }
    if (androidOfferToken) {
      args.subscriptionOffers = [{ sku, offerToken: androidOfferToken }];
    }

    if (useAndroidSubscriptionChangeFlow) {
      try {
        androidChangeSourcePurchase = await _findLatestAvailablePurchaseForPlan(
          requestedFromPlan,
          "android"
        );
      } catch (purchaseLookupError) {
        throw _createAndroidSubscriptionChangeFallbackError(
          "現在ご利用中の Plus プランを確認できませんでした。Google Play のサブスクリプション管理から変更してください。",
          {
            ...lookupDebug,
            purchaseLookupError: _serializeIapError(purchaseLookupError),
          }
        );
      }

      if (!androidChangeSourcePurchase) {
        throw _createAndroidSubscriptionChangeFallbackError(
          "現在ご利用中の Plus プランを確認できませんでした。Google Play のサブスクリプション管理から変更してください。",
          {
            ...lookupDebug,
            recognizedFromPlanSkus: _recognizedSkusForPlan(requestedFromPlan, "android"),
          }
        );
      }

      const oldSkuAndroid = _coerceStr(
        androidChangeSourcePurchase?.productId || androidChangeSourcePurchase?.sku
      );
      const purchaseTokenAndroid = _coerceStr(androidChangeSourcePurchase?.purchaseToken);
      const replacementModeAndroid = Number(
        opts?.replacementModeAndroid || ANDROID_SUBSCRIPTION_CHANGE_REPLACEMENT_MODE
      );

      if (!oldSkuAndroid || !purchaseTokenAndroid) {
        throw _createAndroidSubscriptionChangeFallbackError(
          "Google Play でプラン変更に必要な購入情報を確認できませんでした。Google Play のサブスクリプション管理から変更してください。",
          {
            ...lookupDebug,
            currentPurchaseProductId: oldSkuAndroid || undefined,
            hasCurrentPurchaseToken: !!purchaseTokenAndroid,
          }
        );
      }

      args.oldSkuAndroid = oldSkuAndroid;
      args.purchaseTokenAndroid = purchaseTokenAndroid;
      args.oldPurchaseTokenAndroid = purchaseTokenAndroid;
      args.prorationModeAndroid = replacementModeAndroid;
      args.replacementModeAndroid = replacementModeAndroid;
    }
  }

  const requestDebug = {
    targetSku: sku,
    targetBasePlanId: targetBasePlanId || undefined,
    hasAppAccountToken: !!identityArgs?.appAccountToken,
    hasObfuscatedAccountIdAndroid: !!identityArgs?.obfuscatedAccountIdAndroid,
    hasSubscriptionOffers:
      Array.isArray(args?.subscriptionOffers) && args.subscriptionOffers.length > 0,
    selectedOfferToken: androidOfferToken || undefined,
    useAndroidSubscriptionChangeFlow,
    fromProductId: _coerceStr(androidChangeSourcePurchase?.productId),
    hasPurchaseTokenAndroid: !!_coerceStr(args?.purchaseTokenAndroid),
    replacementModeAndroid: Number(args?.prorationModeAndroid || 0) || undefined,
  };

  let res = null;
  let purchaseInitiated = false;

  if (useAndroidSubscriptionChangeFlow) {
    const oldSkuAndroid = _coerceStr(args?.oldSkuAndroid);
    const purchaseTokenAndroid = _coerceStr(args?.purchaseTokenAndroid);
    const prorationModeAndroid =
      Number(args?.prorationModeAndroid) ||
      ANDROID_SUBSCRIPTION_CHANGE_REPLACEMENT_MODE;

    try {
      res = await RNIap.requestSubscription(args);
      purchaseInitiated = true;
    } catch (e1) {
      const primaryErr = _attachDebugInfo(e1, {
        ...lookupDebug,
        requestDebug,
        requestStyle: "object_args_change",
      });
      try {
        res = await RNIap.requestSubscription(
          sku,
          false,
          oldSkuAndroid,
          purchaseTokenAndroid,
          prorationModeAndroid,
          identityArgs?.obfuscatedAccountIdAndroid,
          identityArgs?.obfuscatedProfileIdAndroid
        );
        purchaseInitiated = true;
      } catch (e2) {
        const legacyErr = _attachDebugInfo(e2, {
          ...lookupDebug,
          requestDebug,
          requestStyle: "legacy_change_signature",
        });
        throw _createAndroidSubscriptionChangeFallbackError(
          "この端末では Google Play からのプラン変更を開始できませんでした。Google Play のサブスクリプション管理から Premium プランへ変更してください。",
          {
            ...lookupDebug,
            requestDebug,
            fallbackErrors: [
              _serializeIapError(primaryErr),
              _serializeIapError(legacyErr),
            ],
          }
        );
      }
    }
  } else {
    try {
      res = await RNIap.requestSubscription(args);
      purchaseInitiated = true;
    } catch (e1) {
      const primaryErr = _attachDebugInfo(e1, {
        ...lookupDebug,
        requestDebug,
        requestStyle: "object_args",
      });
      try {
        res = await RNIap.requestSubscription(sku);
        purchaseInitiated = true;
      } catch (e2) {
        const fallbackErr = _attachDebugInfo(e2, {
          ...lookupDebug,
          requestDebug,
          requestStyle: "string_sku",
        });
        try {
          res = await RNIap.requestSubscription(sku, false);
          purchaseInitiated = true;
        } catch (e3) {
          const legacyErr = _attachDebugInfo(e3, {
            ...lookupDebug,
            requestDebug,
            requestStyle: "legacy_string_bool",
          });
          throw _attachDebugInfo(primaryErr, {
            ...lookupDebug,
            requestDebug,
            fallbackErrors: [
              _serializeIapError(fallbackErr),
              _serializeIapError(legacyErr),
            ],
          });
        }
      }
    }
  }

  const purchase = Array.isArray(res) ? res[0] : res;
  let updateRes = null;
  if (purchase) {
    const syncRes = await syncPurchaseToSubscriptionTier(purchase, {
      plan: normalizedPlan,
      basePlanId: targetBasePlanId,
    });
    updateRes = syncRes?.updateRes ?? null;
  }

  return {
    purchase,
    product,
    updateRes,
    purchaseInitiated,
    listenerCompletionPending: purchaseInitiated && !purchase,
  };
}

export async function purchase(productId, opts = {}) {
  const sku = _coerceStr(productId);
  if (!sku) {
    throw new Error("productId が指定されていません。");
  }

  const hintedPlan = _coerceStr(opts?.plan).toLowerCase();
  const plan = _inferTierFromSku(sku, hintedPlan || "");
  if (plan !== "plus" && plan !== "premium") {
    throw new Error("不明な productId です（plus/premium の SKU を指定してください）。");
  }

  return requestSubscriptionForPlan(plan, opts);
}

export async function restoreAvailablePurchases() {
  await ensureIapConnection();
  try {
    const all = await RNIap.getAvailablePurchases();
    const skus = new Set(_knownSkus());
    return (Array.isArray(all) ? all : []).filter((p) =>
      skus.has(String(p?.productId || "").trim())
    );
  } catch {
    return [];
  }
}

export { RUNTIME_API_BASE_URL };
