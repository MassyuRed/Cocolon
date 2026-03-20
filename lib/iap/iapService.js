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
// - SKU / 認識対象SKU / trial offer tag は runtime bootstrap を最優先
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
  getPlanForProductId,
  getPurchaseSku,
  getRecognizedSkus,
  getTrialOfferTag,
} from "./iapRuntimeCatalog";
import { supabase } from "../supabase";
import { postSubscriptionUpdate } from "../subscriptionApi";

const MYMODEL_API_BASE_URL =
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

function _coerceStr(v) {
  return String(v ?? "").trim();
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

function _trialOfferTag(plan, platform = Platform.OS) {
  return _coerceStr(getTrialOfferTag(plan, platform));
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

function _inferTierFromSku(productId, hintedTier) {
  const hint = _coerceStr(hintedTier).toLowerCase();
  if (hint === "plus" || hint === "premium" || hint === "free") return hint;

  const pid = _coerceStr(productId);
  if (!pid) return "";

  const runtimePlan = _coerceStr(getPlanForProductId(pid, Platform.OS)).toLowerCase();
  if (runtimePlan === "plus" || runtimePlan === "premium") return runtimePlan;

  const plusSku = _purchaseSku("plus");
  const premiumSku = _purchaseSku("premium");

  if (plusSku && pid === plusSku) return "plus";
  if (premiumSku && pid === premiumSku) return "premium";

  const lower = pid.toLowerCase();
  if (lower.includes("premium")) return "premium";
  if (lower.includes("plus")) return "plus";
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
  if (!Array.isArray(skus) || skus.length === 0) return [];
  try {
    return await RNIap.getSubscriptions({ skus });
  } catch {
    try {
      return await RNIap.getSubscriptions(skus);
    } catch {
      return [];
    }
  }
}

function _getAndroidOfferList(product) {
  return product?.subscriptionOfferDetails || product?.subscriptionOffers || product?.offers || [];
}

function _getOfferToken(offer) {
  return String(offer?.offerToken || "").trim();
}

function _getOfferTags(offer) {
  const raw = offer?.offerTags || offer?.tags || [];
  return Array.isArray(raw)
    ? raw.map((x) => String(x || "").trim()).filter(Boolean)
    : [];
}

function _getPricingPhases(offer) {
  const p = offer?.pricingPhases;
  if (Array.isArray(p)) return p;
  if (Array.isArray(p?.pricingPhaseList)) return p.pricingPhaseList;
  return [];
}

function _hasFreeTrialPhase(offer) {
  const phases = _getPricingPhases(offer);
  return phases.some((ph) => {
    const micros = Number(ph?.priceAmountMicros ?? NaN);
    if (Number.isFinite(micros) && micros === 0) return true;
    const formatted = String(ph?.formattedPrice || "").trim().toLowerCase();
    return formatted === "free" || formatted === "無料";
  });
}

function pickAndroidOfferToken(product, opts = {}) {
  const list = _getAndroidOfferList(product);
  if (!Array.isArray(list) || list.length === 0) return "";

  const allowTrial = !!opts?.allowTrial;
  const offerTag = _coerceStr(opts?.offerTag);

  if (allowTrial) {
    if (offerTag) {
      const tagged = list.find((offer) => _getOfferTags(offer).includes(offerTag));
      if (tagged) return _getOfferToken(tagged);
    }

    const freeTrialOffer = list.find((offer) => _hasFreeTrialPhase(offer));
    if (freeTrialOffer) return _getOfferToken(freeTrialOffer);
  } else {
    const paidOffer = list.find((offer) => !_hasFreeTrialPhase(offer));
    if (paidOffer) return _getOfferToken(paidOffer);
  }

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

async function _postSubscriptionUpdate({ tier, productId, purchase }) {
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

    const tier = _inferTierFromSku(productId, opts?.tier || opts?.plan);
    if (!tier) {
      throw new Error("SKU からプラン種別（plus/premium）が判定できませんでした。");
    }

    const updateRes = await _postSubscriptionUpdate({
      tier,
      productId,
      purchase,
    });

    await finishTransactionSafe(purchase);

    _purchaseProcessingState.set(key, "done");
    return { ok: true, tier, updateRes };
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
  const sku = _purchaseSku(normalizedPlan);
  if (!sku) {
    throw new Error("SKUが未設定です（サブスク設定を確認してください）");
  }

  await ensureIapConnection();

  const skus = _knownSkus();
  const products = await getSubscriptionsSafe(skus.length > 0 ? skus : [sku]);
  const product =
    (Array.isArray(products) ? products : []).find(
      (p) => String(p?.productId || p?.sku || "").trim() === sku
    ) || null;

  const identityArgs = await _buildPurchaseIdentityArgs();
  const args = { sku, ...identityArgs };

  if (Platform.OS === "android") {
    const offerToken = pickAndroidOfferToken(product, {
      ...opts,
      offerTag: _coerceStr(opts?.offerTag) || _trialOfferTag(normalizedPlan),
    });
    if (offerToken) {
      args.subscriptionOffers = [{ sku, offerToken }];
    }
  }

  let res = null;
  try {
    res = await RNIap.requestSubscription(args);
  } catch (e1) {
    try {
      res = await RNIap.requestSubscription(sku);
    } catch (e2) {
      try {
        res = await RNIap.requestSubscription(sku, false);
      } catch {
        throw e1;
      }
    }
  }

  const purchase = Array.isArray(res) ? res[0] : res;
  let updateRes = null;
  if (purchase) {
    const syncRes = await syncPurchaseToSubscriptionTier(purchase, { plan: normalizedPlan });
    updateRes = syncRes?.updateRes ?? null;
  }

  return { purchase, product, updateRes };
}

export async function purchase(productId, opts = {}) {
  const sku = _coerceStr(productId);
  if (!sku) {
    throw new Error("productId が指定されていません。");
  }

  const plan = _inferTierFromSku(sku, "");
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

export { MYMODEL_API_BASE_URL };
