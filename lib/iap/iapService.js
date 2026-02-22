// lib/iap/iapService.js
// ------------------------------------------------------------
// react-native-iap を使ったサブスク購入の薄いラッパー
//
// ✅ このファイルでやること（MVP）
// - IAP 接続の初期化
// - サブスク購入（Plus / Premium）
// - 購入完了時に MashOS の /subscription/update を叩いて tier を更新
// - tier 更新が成功したら finishTransaction（Android必須）
//
// NOTE:
// - 本番では MashOS 側で購入検証（Play/App Store 検証）を必ず入れる前提。
// ------------------------------------------------------------

import { Platform } from "react-native";
import * as RNIap from "react-native-iap";
import { getAllSkus, getPlanSku } from "./iapConfig";
import { supabase } from "../supabase";

// MyModel（MashOS）API
const MYMODEL_API_BASE_URL =
  process.env.EXPO_PUBLIC_MYMODEL_API_URL || "https://mashos-api.onrender.com";
const SUBSCRIPTION_UPDATE_ENDPOINT = `${MYMODEL_API_BASE_URL}/subscription/update`;

// SKU (productId) helpers for UI
// - SubscriptionSelectScreen などから "purchase(productId)" を呼ぶために利用
export const IAP_PRODUCT_IDS = Object.freeze({
  plus: String(getPlanSku("plus") || "").trim(),
  premium: String(getPlanSku("premium") || "").trim(),
});

let _connectionPromise = null;
let _connected = false;

// purchase listeners
let _purchaseUpdatedSub = null;
let _purchaseErrorSub = null;

// de-dup / in-flight guard
const _purchaseProcessingState = new Map(); // key -> "processing" | "done"

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

function _isOurSku(productId) {
  const pid = _coerceStr(productId);
  if (!pid) return false;
  try {
    const set = new Set((getAllSkus() || []).map((x) => _coerceStr(x)).filter(Boolean));
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

  const plusSku = _coerceStr(getPlanSku("plus"));
  const premiumSku = _coerceStr(getPlanSku("premium"));

  if (plusSku && pid === plusSku) return "plus";
  if (premiumSku && pid === premiumSku) return "premium";

  // 予備（SKU 名に plus/premium が入っている想定のとき）
  const lower = pid.toLowerCase();
  if (lower.includes("premium")) return "premium";
  if (lower.includes("plus")) return "plus";

  return "";
}

export async function ensureIapConnection() {
  if (_connected) return true;
  if (_connectionPromise) return _connectionPromise;

  _connectionPromise = (async () => {
    try {
      await RNIap.initConnection();
      _connected = true;

      // Android: 未完了購入がキャッシュされている場合に備えて掃除（ある環境だけ）
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
      // init が失敗しても promise はクリアして再試行できるようにする
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
  // 版本差異に耐える（object / array）
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

function pickAndroidOfferToken(product) {
  // Play Billing v5+ (subscriptionOfferDetails)
  const list =
    product?.subscriptionOfferDetails ||
    product?.subscriptionOffers ||
    product?.offers ||
    [];

  if (!Array.isArray(list) || list.length === 0) return "";

  for (const it of list) {
    const tok = String(it?.offerToken || "").trim();
    if (tok) return tok;
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

async function _getAccessToken() {
  try {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token ?? null;
  } catch {
    return null;
  }
}

async function _postSubscriptionUpdate({ tier, productId, purchase }) {
  const accessToken = await _getAccessToken();
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

  // MVP: server が purchase proof を要求するので、最低限どちらかは必須
  if (!payload.purchase_token && !payload.transaction_receipt) {
    throw new Error("購入情報（purchaseToken/transactionReceipt）が不足しています。");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(SUBSCRIPTION_UPDATE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      let detail = `HTTP ${res.status}`;
      try {
        const j = await res.json();
        if (j?.detail) detail = String(j.detail);
      } catch {
        // ignore
      }
      throw new Error(detail);
    }

    const json = await res.json().catch(() => ({}));
    return json;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 購入情報をサーバーへ同期 → 成功したら finishTransaction で確定
 * - 失敗時は finishTransaction しない（あとで再試行できる）
 */
export async function syncPurchaseToSubscriptionTier(purchase, opts = {}) {
  if (!purchase) return { ok: false, reason: "no_purchase" };

  const productId = _coerceStr(purchase?.productId);
  if (!_isOurSku(productId)) {
    // 自分の SKU 以外は触らない（他機能の IAP が増えても壊れないように）
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

    // 1) サーバーに反映（tier 更新）
    const updateRes = await _postSubscriptionUpdate({
      tier,
      productId,
      purchase,
    });

    // 2) 成功したらトランザクションを終端（Android必須）
    await finishTransactionSafe(purchase);

    _purchaseProcessingState.set(key, "done");
    return { ok: true, tier, updateRes };
  } catch (e) {
    _purchaseProcessingState.delete(key); // 失敗したら再試行できるように戻す
    throw e;
  }
}

/**
 * App 起動中に purchaseUpdatedListener を貼って、
 * 「購入がキューに乗った/復帰した」ケースでも tier 同期できるようにする。
 */
export async function startIapPurchaseObserver() {
  if (_purchaseUpdatedSub || _purchaseErrorSub) return;

  await ensureIapConnection();

  _purchaseUpdatedSub = RNIap.purchaseUpdatedListener(async (purchase) => {
    try {
      await syncPurchaseToSubscriptionTier(purchase);
    } catch (e) {
      // ここで Alert は出さない（突然出るとUXが崩れる）
      console.warn("IAP purchaseUpdatedListener: sync failed:", e?.message || e);
    }
  });

  _purchaseErrorSub = RNIap.purchaseErrorListener((err) => {
    // 購入キャンセルなども入るので warn 程度に留める
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

/**
 * サブスク購入（Plus / Premium）
 * - 購入成功 → tier 同期 → finishTransaction までをここで行う（MVP）
 */
export async function requestSubscriptionForPlan(plan) {
  const sku = getPlanSku(plan);
  if (!sku) {
    throw new Error("SKUが未設定です（IAP設定を確認してください）");
  }

  await ensureIapConnection();

  const skus = getAllSkus();
  const products = await getSubscriptionsSafe(skus);

  const product =
    (Array.isArray(products) ? products : []).find(
      (p) => String(p?.productId || p?.sku || "").trim() === sku
    ) || null;

  const args = { sku };

  // Android のサブスクは offerToken が必要になるケースがある
  if (Platform.OS === "android") {
    const offerToken = pickAndroidOfferToken(product);
    if (offerToken) {
      args.subscriptionOffers = [{ sku, offerToken }];
    }
  }

  let res = null;

  // new signature
  try {
    res = await RNIap.requestSubscription(args);
  } catch (e1) {
    // old signature(s)
    try {
      res = await RNIap.requestSubscription(sku);
    } catch (e2) {
      try {
        // some versions: (sku, andDangerouslyFinishTransactionAutomaticallyIOS)
        res = await RNIap.requestSubscription(sku, false);
      } catch {
        throw e1;
      }
    }
  }

  const purchase = Array.isArray(res) ? res[0] : res;

  // ここで同期まで実行（listener が来ない実装差分でも確実に反映できる）
  if (purchase) {
    await syncPurchaseToSubscriptionTier(purchase, { plan });
  }

  return { purchase, product };
}


/**
 * purchase(productId)
 * - productId (= SKU) を直接指定して購入を開始するための薄いラッパー
 * - 既存の requestSubscriptionForPlan(plus|premium) を再利用
 * - 購入成功時は内部で /subscription/update → finishTransaction まで実行される
 */
export async function purchase(productId) {
  const sku = _coerceStr(productId);
  if (!sku) {
    throw new Error("productId が指定されていません。");
  }

  // SKU から plan（plus/premium）を推定
  const plan = _inferTierFromSku(sku, "");
  if (plan !== "plus" && plan !== "premium") {
    throw new Error("不明な productId です（plus/premium の SKU を指定してください）。");
  }

  return requestSubscriptionForPlan(plan);
}
/**
 * 購入の復元（後続工程で AccountScreen から呼び出す想定）
 */
export async function restoreAvailablePurchases() {
  await ensureIapConnection();
  try {
    const all = await RNIap.getAvailablePurchases();
    const skus = new Set(getAllSkus());
    const filtered = (Array.isArray(all) ? all : []).filter((p) =>
      skus.has(String(p?.productId || "").trim())
    );
    return filtered;
  } catch {
    return [];
  }
}
