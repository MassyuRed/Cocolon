import { useEffect, useState } from "react";
import { Alert } from "react-native";

import { useSubscription } from "../../SubscriptionContext";
import {
  restoreAvailablePurchases,
  syncPurchaseToSubscriptionTier,
} from "../../lib/iap/iapService";
import { getPlanSku } from "../../lib/iap/iapConfig";
import {
  TIER_ALLOWED_SELF_STRUCTURE_MODES,
  normalizeSubscriptionTier,
} from "./accountModel";

export function useAccountSubscription({ user }) {
  const {
    tier: ctxSubscriptionTier,
    loading: subscriptionContextLoading,
    allowedSelfStructureModes: ctxAllowedSelfStructureModes,
    refreshTier,
  } = useSubscription();

  const [subTier, setSubTier] = useState("free");
  const [subAllowedModes, setSubAllowedModes] = useState(["light"]);
  const [subLoading, setSubLoading] = useState(true);
  const [subError, setSubError] = useState("");
  const [restoreLoading, setRestoreLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      if (!cancelled) {
        setSubTier("free");
        setSubAllowedModes(["light"]);
        setSubLoading(false);
        setSubError("");
      }
      return () => {
        cancelled = true;
      };
    }

    if (subscriptionContextLoading) {
      if (!cancelled) setSubLoading(true);
      return () => {
        cancelled = true;
      };
    }

    if (!cancelled) {
      const tier = normalizeSubscriptionTier(ctxSubscriptionTier);
      setSubTier(tier);
      setSubAllowedModes(
        Array.isArray(ctxAllowedSelfStructureModes) && ctxAllowedSelfStructureModes.length > 0
          ? ctxAllowedSelfStructureModes
          : TIER_ALLOWED_SELF_STRUCTURE_MODES[tier] || ["light"]
      );
      setSubError("");
      setSubLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [ctxAllowedSelfStructureModes, ctxSubscriptionTier, subscriptionContextLoading, user]);

  const refreshSubscriptionState = async () => {
    if (!user) {
      setSubTier("free");
      setSubAllowedModes(["light"]);
      setSubError("");
      setSubLoading(false);
      return;
    }

    setSubLoading(true);
    setSubError("");
    try {
      await refreshTier({ force: true });
    } catch (e) {
      setSubError(String(e?.message || e));
    } finally {
      setSubLoading(false);
    }
  };

  const onRestorePurchases = async () => {
    if (restoreLoading) return;

    if (!user) {
      Alert.alert("ログインが必要です", "購入の復元にはログインが必要です。");
      return;
    }

    setRestoreLoading(true);

    try {
      const purchases = await restoreAvailablePurchases();

      if (!Array.isArray(purchases) || purchases.length === 0) {
        Alert.alert("購入履歴がありません", "復元できる購入が見つかりませんでした。");
        return;
      }

      const plusSku = getPlanSku("plus");
      const premiumSku = getPlanSku("premium");

      const normalized = purchases.map((p) => ({
        purchase: p,
        productId: String(p?.productId || p?.product_id || "").trim(),
      }));

      const premiumPurchase =
        premiumSku &&
        normalized.find((x) => x.productId === premiumSku)?.purchase;

      const plusPurchase =
        plusSku && normalized.find((x) => x.productId === plusSku)?.purchase;

      const targetPurchase = premiumPurchase || plusPurchase || null;

      if (!targetPurchase) {
        Alert.alert(
          "購入履歴が見つかりません",
          "Cocolonのサブスクリプション購入が見つかりませんでした。"
        );
        return;
      }

      await syncPurchaseToSubscriptionTier(targetPurchase);
      await refreshSubscriptionState();

      Alert.alert("復元が完了しました", "プラン情報を更新しました。");
    } catch (e) {
      Alert.alert(
        "復元に失敗しました",
        String(e?.message || e || "復元に失敗しました。")
      );
    } finally {
      setRestoreLoading(false);
    }
  };

  return {
    subTier,
    subAllowedModes,
    subLoading,
    subError,
    restoreLoading,
    refreshSubscriptionState,
    onRestorePurchases,
  };
}
