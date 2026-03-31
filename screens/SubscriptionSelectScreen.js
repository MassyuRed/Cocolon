import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CocolonBackButton from "../components/CocolonBackButton";
import { useTheme } from "../theme/ThemeContext";
import { useSubscription } from "../SubscriptionContext";
import { makeUiTokens } from "../ui/uiTokens";
import {
  ensureIapConnection,
  requestSubscriptionForPlan,
  restoreAvailablePurchases,
  syncPurchaseToSubscriptionTier,
} from "../lib/iap/iapService";
import {
  getPurchaseSku,
  getRecognizedSkusForPlan,
  getSubscriptionLinks,
  getSubscriptionPlanConfig,
  getSubscriptionPolicy,
  getTrialOfferTag,
} from "../lib/iap/iapRuntimeCatalog";
import { SUBSCRIPTION_PUBLIC_CONFIG_AUDIT } from "../lib/iap/iapConfig";
import { supabase } from "../lib/supabase";

const IOS_MANAGE_SUBSCRIPTIONS_URL =
  "https://apps.apple.com/account/subscriptions";

const SUBSCRIPTION_LEGAL_LINKS = Object.freeze({
  termsUrl:
    "https://sunrise-arrow-09e.notion.site/Emlis-32a49f5dde6980358773d45f4c42c037?pvs=143",
  privacyUrl:
    "https://sunrise-arrow-09e.notion.site/Emlis-32a49f5dde6980db9adfddb7bfcce6b4?pvs=143",
});

const SUB_TIER_LABEL = {
  free: "無料会員",
  plus: "Plus会員",
  premium: "Premium会員",
};

function normalizeSubscriptionTier(raw) {
  const t = String(raw || "").trim().toLowerCase();
  if (t === "plus" || t === "premium" || t === "free") return t;
  return "free";
}

function buildManageSubscriptionUrl(productId, policy = {}) {
  if (Platform.OS === "ios") {
    return String(policy?.ios_manage_url || IOS_MANAGE_SUBSCRIPTIONS_URL).trim();
  }

  const mode = String(policy?.android_manage_mode || "specific_subscription").trim();
  const packageName = String(policy?.android_package_name || "").trim();
  const sku = String(productId || "").trim();
  if (mode === "specific_subscription" && packageName && sku) {
    return `https://play.google.com/store/account/subscriptions?sku=${encodeURIComponent(
      sku
    )}&package=${encodeURIComponent(packageName)}`;
  }

  return "https://play.google.com/store/account/subscriptions";
}

function formatEntitlementStatusLabel(status) {
  const s = String(status || "").trim().toLowerCase();
  if (s === "active") return "有効";
  if (s === "grace_period") return "更新猶予中";
  if (s === "account_hold") return "支払い保留中";
  if (s === "pending") return "手続き中";
  if (s === "paused") return "一時停止中";
  if (s === "cancelled") return "更新停止";
  if (s === "expired") return "期限切れ";
  if (s === "revoked") return "取り消し";
  return "";
}

function formatExpiresAtLabel(raw) {
  const value = String(raw || "").trim();
  if (!value) return "";
  try {
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return "";
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dt);
  } catch {
    return "";
  }
}

function buildIapErrorMessage(err) {
  if (!err) return "お申し込みを完了できませんでした。時間をおいてもう一度お試しください。";

  const code = String(err?.code || "");
  const apiCode = String(err?.apiCode || "");
  const msg = String(err?.message || err);

  if (
    /E_USER_CANCELLED/i.test(code) ||
    /USER_CANCELLED/i.test(code) ||
    /cancel/i.test(msg)
  ) {
    return "お申し込みをキャンセルしました。";
  }
  if (/E_PRODUCT_NOT_FETCHED/i.test(code)) {
    return "App Store から対象サブスク商品を取得できませんでした。Bundle ID / Product ID / App Store Connect の状態をご確認ください。";
  }
  if (/E_ITEM_UNAVAILABLE/i.test(code)) {
    return "このプランは現在お申し込みいただけません。";
  }
  if (/E_NETWORK/i.test(code) || /network/i.test(msg)) {
    return "通信環境をご確認のうえ、もう一度お試しください。";
  }
  if (/E_SERVICE_ERROR/i.test(code) || /service/i.test(msg)) {
    return "ただいまお申し込みページを開けませんでした。時間をおいてお試しください。";
  }

  if (apiCode === "purchase_already_claimed") {
    return "この購入情報は、すでに別のCocolonアカウントに紐づいています。";
  }
  if (apiCode === "subscription_pending") {
    return "購入手続きは開始されていますが、ストア側でまだ確定していません。確定後にもう一度お試しください。";
  }
  if (apiCode === "subscription_account_hold") {
    return "サブスクリプションが支払い保留中です。ストアのお支払い設定をご確認ください。";
  }
  if (apiCode === "subscription_revoked") {
    return "このサブスクリプションは取り消されています。";
  }
  if (apiCode === "subscription_inactive") {
    return "このサブスクリプションは現在有効ではありません。";
  }
  if (apiCode === "verification_unavailable") {
    return "ただいま購入確認サーバーの準備中です。時間をおいて再度お試しください。";
  }
  if (apiCode === "verification_failed") {
    return "ストアの購入確認に失敗しました。時間をおいてもう一度お試しください。";
  }

  return "お申し込みを完了できませんでした。時間をおいてもう一度お試しください。";
}

function buildIapDebugMessage(err) {
  if (!err) return "";

  const parts = [];
  const code = String(err?.code || "").trim();
  const apiCode = String(err?.apiCode || "").trim();
  const responseCode = String(err?.responseCode || "").trim();
  const message = String(err?.message || "").trim();
  const debug = err?.debugInfo && typeof err.debugInfo === "object" ? err.debugInfo : {};

  if (code) parts.push(`code=${code}`);
  if (apiCode) parts.push(`apiCode=${apiCode}`);
  if (responseCode) parts.push(`responseCode=${responseCode}`);
  if (debug?.platform) parts.push(`platform=${debug.platform}`);
  if (debug?.plan) parts.push(`plan=${debug.plan}`);
  if (debug?.targetSku) parts.push(`sku=${debug.targetSku}`);
  if (Array.isArray(debug?.productIds)) {
    parts.push(`fetchedProducts=${debug.productIds.length ? debug.productIds.join(",") : "<none>"}`);
  }
  if (Array.isArray(debug?.knownSkus) && debug.knownSkus.length) {
    parts.push(`knownSkus=${debug.knownSkus.join(",")}`);
  }
  if (Array.isArray(debug?.lookupSkusPrimary) && debug.lookupSkusPrimary.length) {
    parts.push(`lookupPrimary=${debug.lookupSkusPrimary.join(",")}`);
  }
  if (Array.isArray(debug?.lookupSkusFallback) && debug.lookupSkusFallback.length) {
    parts.push(`lookupFallback=${debug.lookupSkusFallback.join(",")}`);
  }
  if (message) parts.push(`message=${message}`);

  const attempts = Array.isArray(debug?.lookupAttempts) ? debug.lookupAttempts : [];
  attempts.slice(0, 3).forEach((attempt, idx) => {
    const shape = String(attempt?.shape || "").trim() || `attempt${idx + 1}`;
    const ok = attempt?.ok ? "ok" : "ng";
    const ids = Array.isArray(attempt?.productIds) ? attempt.productIds.join(",") : "";
    const errMsg = String(attempt?.error?.message || attempt?.error?.code || "").trim();
    parts.push(`${shape}=${ok}${ids ? `:${ids}` : ""}${errMsg ? `:${errMsg}` : ""}`);
  });

  const fallbackErrors = Array.isArray(debug?.fallbackErrors) ? debug.fallbackErrors : [];
  fallbackErrors.slice(0, 2).forEach((item, idx) => {
    const fCode = String(item?.code || "").trim();
    const fMsg = String(item?.message || "").trim();
    parts.push(`fallback${idx + 1}=${fCode || "<no_code>"}${fMsg ? `:${fMsg}` : ""}`);
  });

  const text = parts.filter(Boolean).join("\n");
  if (!text) return "";
  return text.length > 1400 ? `${text.slice(0, 1400)}…` : text;
}

function asStringArray(value, fallback = []) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }
  return fallback;
}

function asStringOrNull(value) {
  const v = String(value || "").trim();
  return v || null;
}

function PlanCard({
  title,
  price,
  subtitle,
  subtitleHighlighted = false,
  features,
  noteLines = [],
  isCurrent,
  recommended,
  onPress,
  ctaDisabled,
  ctaLoading,
  ctaTextOverride,
  styles,
  colors,
}) {
  return (
    <View style={[styles.planCard, isCurrent && styles.planCardCurrent]}>
      <View style={styles.planHeaderRow}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.planTitle}>{title}</Text>
            {recommended ? (
              <View style={styles.recommendBadge}>
                <Text style={styles.recommendBadgeText}>おすすめ</Text>
              </View>
            ) : null}
          </View>

          {price ? <Text style={styles.planPrice}>{price}</Text> : null}
          {subtitle ? (
            <Text
              style={[
                styles.planSubtitle,
                subtitleHighlighted && styles.planSubtitleHighlighted,
              ]}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>

        {isCurrent ? (
          <View style={styles.currentBadge}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={colors.TITLE_GOLD}
            />
            <Text style={styles.currentBadgeText}>現在</Text>
          </View>
        ) : null}
      </View>

      <View style={{ marginTop: 10 }}>
        {features.map((t, idx) => (
          <Text key={String(idx)} style={styles.planFeature}>
            ・{t}
          </Text>
        ))}
      </View>

      {Array.isArray(noteLines) && noteLines.length > 0 ? (
        <View style={{ marginTop: 8 }}>
          {noteLines.map((t, idx) => (
            <Text key={`note-${idx}`} style={styles.planNote}>
              {t}
            </Text>
          ))}
        </View>
      ) : null}

      {(() => {
        const disabled = !!isCurrent || !!ctaDisabled || !!ctaLoading;
        return (
          <TouchableOpacity
            style={[styles.planCta, disabled && styles.planCtaDisabled]}
            onPress={onPress}
            activeOpacity={0.85}
            disabled={disabled}
          >
            {ctaLoading && !isCurrent ? (
              <ActivityIndicator
                size="small"
                color={colors.FIELD_BG}
                style={{ marginRight: 8 }}
              />
            ) : (
              <Ionicons
                name="card-outline"
                size={18}
                color={disabled ? colors.TEXT_SUBTLE : colors.FIELD_BG}
                style={{ marginRight: 6 }}
              />
            )}

            <Text
              style={[
                styles.planCtaText,
                disabled && { color: colors.TEXT_SUBTLE },
              ]}
            >
              {isCurrent
                ? "このプランを利用中"
                : ctaLoading
                ? "お手続き中…"
                : ctaTextOverride ?? "このプランを選ぶ"}
            </Text>
          </TouchableOpacity>
        );
      })()}
    </View>
  );
}

export default function SubscriptionSelectScreen({ navigation }) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";

  const {
    tier: ctxTier,
    loading: ctxLoading,
    plusTrialEligible,
    entitlementStatus,
    expiresAt,
    autoRenew,
    refreshTier,
    refreshSubscriptionBootstrap,
    subscriptionBootstrap,
    subscriptionBootstrapLoading,
  } = useSubscription();
  const loading = !!ctxLoading || ctxTier === "unknown";
  const tier = loading ? "free" : normalizeSubscriptionTier(ctxTier);

  const [iapReady, setIapReady] = useState(false);
  const [purchaseBusyPlan, setPurchaseBusyPlan] = useState("");
  const [restoreLoading, setRestoreLoading] = useState(false);

  const bootstrap = subscriptionBootstrap || {};
  const links = useMemo(
    () => ({
      ...(getSubscriptionLinks() || {}),
      ...(bootstrap?.links || {}),
      terms_url: SUBSCRIPTION_LEGAL_LINKS.termsUrl,
      privacy_url: SUBSCRIPTION_LEGAL_LINKS.privacyUrl,
    }),
    [bootstrap]
  );
  const policy = useMemo(
    () => ({
      ...(getSubscriptionPolicy() || {}),
      ...(bootstrap?.policy || {}),
    }),
    [bootstrap]
  );
  const plusPlan = useMemo(
    () => ({
      ...(getSubscriptionPlanConfig("plus") || {}),
      ...(bootstrap?.plans?.plus || {}),
    }),
    [bootstrap]
  );
  const premiumPlan = useMemo(
    () => ({
      ...(getSubscriptionPlanConfig("premium") || {}),
      ...(bootstrap?.plans?.premium || {}),
    }),
    [bootstrap]
  );

  const refreshScreenState = useCallback(
    async ({ force = false } = {}) => {
      await Promise.allSettled([
        refreshSubscriptionBootstrap({ force }),
        refreshTier({ force }),
      ]);
    },
    [refreshSubscriptionBootstrap, refreshTier]
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await ensureIapConnection();
        if (!cancelled) {
          setIapReady(true);
        }
      } catch {
        if (!cancelled) {
          setIapReady(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    refreshScreenState({ force: true }).catch(() => null);
  }, [refreshScreenState]);

  useEffect(() => {
    if (!__DEV__) return;
    const warnings = Array.isArray(SUBSCRIPTION_PUBLIC_CONFIG_AUDIT?.warnings)
      ? SUBSCRIPTION_PUBLIC_CONFIG_AUDIT.warnings
      : [];
    if (warnings.length > 0) {
      console.warn("[SubscriptionConfig]", warnings.join(" | "));
    }
  }, []);

  const currentLabel = SUB_TIER_LABEL[tier] || "無料会員";
  const plusPriceLabel = asStringOrNull(plusPlan?.price_label) || "月額300円";
  const premiumPriceLabel = asStringOrNull(premiumPlan?.price_label) || "月額980円";
  const currentPriceLabel =
    tier === "plus"
      ? plusPriceLabel
      : tier === "premium"
      ? premiumPriceLabel
      : "";
  const entitlementStatusLabel = formatEntitlementStatusLabel(entitlementStatus);
  const expiresAtLabel = formatExpiresAtLabel(expiresAt);

  const plusPurchaseSku = getPurchaseSku("plus", Platform.OS);
  const premiumPurchaseSku = getPurchaseSku("premium", Platform.OS);
  const plusRecognizedSkus = useMemo(
    () => new Set(getRecognizedSkusForPlan("plus", Platform.OS)),
    [subscriptionBootstrap]
  );
  const premiumRecognizedSkus = useMemo(
    () => new Set(getRecognizedSkusForPlan("premium", Platform.OS)),
    [subscriptionBootstrap]
  );

  const salesEnabled = bootstrap?.sales_enabled !== false;
  const clientSalesEnabled = bootstrap?.client_sales_enabled !== false;
  const clientSalesDisabledReason = asStringOrNull(bootstrap?.client_sales_disabled_reason);
  const reviewNotice = asStringOrNull(policy?.review_notice);

  const showPlusTrial =
    tier === "free" &&
    plusTrialEligible &&
    plusPlan?.trial?.enabled !== false;
  const actionBusy = !!purchaseBusyPlan || restoreLoading;

  const plusNoteLines = asStringArray(plusPlan?.note_lines, []).filter(Boolean);
  const defaultPlusNoteLines = showPlusTrial
    ? [
        `初回1か月無料。無料期間終了後は${plusPriceLabel}が自動更新で課金されます。`,
        "解約はいつでもストアのサブスクリプション管理から行えます。",
      ]
    : [
        `${plusPriceLabel}で自動更新されます。`,
        "解約はいつでもストアのサブスクリプション管理から行えます。",
      ];

  const resolvedPlusNoteLines = showPlusTrial
    ? defaultPlusNoteLines
    : plusNoteLines.length > 0
    ? plusNoteLines
    : defaultPlusNoteLines;

  const openExternalPage = useCallback(async (url, label = "ページ") => {
    if (!url) {
      Alert.alert(
        "ページを開けませんでした",
        `${label}のURLが未設定です。サブスク設定をご確認ください。`
      );
      return;
    }

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        "ページを開けませんでした",
        `${label}を開けませんでした。時間をおいてもう一度お試しください。`
      );
    }
  }, []);

  const onRestorePurchases = useCallback(async () => {
    if (actionBusy) return;

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token ?? null;
    if (!accessToken) {
      Alert.alert("ログインが必要です", "購入内容の復元にはログインが必要です。");
      return;
    }

    setRestoreLoading(true);

    try {
      const purchases = await restoreAvailablePurchases();

      if (!Array.isArray(purchases) || purchases.length === 0) {
        Alert.alert(
          "購入内容が見つかりませんでした",
          "復元できる購入内容が見つかりませんでした。"
        );
        return;
      }

      const normalized = purchases.map((p) => ({
        purchase: p,
        productId: String(p?.productId || p?.product_id || "").trim(),
      }));

      const premiumPurchase = normalized.find((x) => premiumRecognizedSkus.has(x.productId))?.purchase;
      const plusPurchase = normalized.find((x) => plusRecognizedSkus.has(x.productId))?.purchase;
      const targetPurchase = premiumPurchase || plusPurchase || normalized[0]?.purchase || null;

      if (!targetPurchase) {
        Alert.alert(
          "購入内容が見つかりませんでした",
          "復元できる購入内容が見つかりませんでした。"
        );
        return;
      }

      await syncPurchaseToSubscriptionTier(targetPurchase);
      await refreshScreenState({ force: true });

      Alert.alert("復元が完了しました", "ご購入内容を復元しました。");
    } catch (e) {
      Alert.alert("復元できませんでした", buildIapErrorMessage(e));
    } finally {
      setRestoreLoading(false);
    }
  }, [
    actionBusy,
    plusRecognizedSkus,
    premiumRecognizedSkus,
    refreshScreenState,
  ]);

  const onOpenManageSubscription = useCallback(async () => {
    const productId = tier === "premium" ? premiumPurchaseSku : plusPurchaseSku;
    const url = buildManageSubscriptionUrl(productId, policy);
    await openExternalPage(url, "サブスクリプション管理");
  }, [openExternalPage, plusPurchaseSku, policy, premiumPurchaseSku, tier]);

  const onSelectPlus = useCallback(async () => {
    if (tier === "plus") return;
    if (purchaseBusyPlan) return;

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token ?? null;
    if (!accessToken) {
      Alert.alert("ログインが必要です", "お申し込みにはログインが必要です。");
      return;
    }

    if (tier === "premium") {
      Alert.alert(
        "プランの確認",
        "現在のプラン変更は、サブスクリプション管理から行えます。"
      );
      return;
    }

    if (!iapReady) {
      Alert.alert(
        "お申し込みができませんでした",
        "ただいまお申し込みページを開けませんでした。時間をおいてお試しください。"
      );
      return;
    }

    if (!salesEnabled || !clientSalesEnabled || plusPlan?.purchasable === false) {
      Alert.alert(
        "現在受付を停止しています",
        clientSalesDisabledReason ||
          "ただいまPlus会員のお申し込み受付を停止しています。時間をおいてご確認ください。"
      );
      return;
    }

    setPurchaseBusyPlan("plus");

    try {
      if (!plusPurchaseSku) {
        Alert.alert(
          "お申し込みができませんでした",
          "プラン設定の反映待ちです。時間をおいてもう一度お試しください。"
        );
        return;
      }

      if (loading) {
        Alert.alert(
          "確認中です",
          "プラン情報を確認しています。少し時間をおいて、もう一度お試しください。"
        );
        return;
      }

      const allowTrial =
        Platform.OS === "android" && tier === "free" && plusTrialEligible;

      const {
        purchase: p,
        updateRes,
        purchaseInitiated,
        listenerCompletionPending,
      } = await requestSubscriptionForPlan("plus", {
        allowTrial,
        offerTag: getTrialOfferTag("plus", Platform.OS),
      });

      if (!p && purchaseInitiated) {
        Alert.alert(
          "お申し込み手続きを開始しました",
          listenerCompletionPending
            ? "ストア側で購入確定後、プランが反映されます。反映まで少し時間がかかる場合があります。"
            : "プラン情報を更新しています。反映まで少し時間がかかる場合があります。"
        );
        refreshScreenState({ force: true }).catch(() => null);
        return;
      }

      const completionTitle =
        updateRes?.entitlement_status === "pending"
          ? "お申し込み手続きを開始しました"
          : "お申し込みが完了しました";
      const completionMessage =
        updateRes?.entitlement_status === "pending"
          ? "購入手続きは始まっています。ストア側で確定し次第、プランが反映されます。"
          : "プラン情報を更新しています。反映まで少し時間がかかる場合があります。";

      Alert.alert(completionTitle, completionMessage);

      await refreshScreenState({ force: true });
    } catch (e) {
      const debugMessage = buildIapDebugMessage(e);
      Alert.alert(
        "お申し込みができませんでした",
        debugMessage
          ? `${buildIapErrorMessage(e)}\n\n---- 診断 ----\n${debugMessage}`
          : buildIapErrorMessage(e)
      );
    } finally {
      setPurchaseBusyPlan("");
    }
  }, [
    clientSalesDisabledReason,
    clientSalesEnabled,
    iapReady,
    loading,
    plusPlan,
    plusPurchaseSku,
    plusTrialEligible,
    purchaseBusyPlan,
    refreshScreenState,
    salesEnabled,
    tier,
  ]);

  const plusSubtitle = showPlusTrial
    ? `初回1か月無料（初回限定）。無料期間終了後は${plusPriceLabel}で自動更新`
    : asStringOrNull(plusPlan?.subtitle);

  const plusFeatures = asStringArray(plusPlan?.features, []);
  const premiumFeatures = asStringArray(premiumPlan?.features, []);
  const premiumNoteLines = asStringArray(premiumPlan?.note_lines, ["※Premiumは準備中です。"]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <CocolonBackButton
              navigation={navigation}
              fallbackRouteName="Home"
              style={styles.backButton}
            />
            <Text style={styles.headerTitle}>サブスクリプション</Text>
            <TouchableOpacity
              onPress={() => refreshScreenState({ force: true }).catch(() => null)}
              style={styles.refreshBtn}
              activeOpacity={0.75}
            >
              <Ionicons name="refresh" size={18} color={colors.TITLE_GOLD} />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionLabel}>現在のプラン</Text>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <View style={styles.currentRow}>
                <Text style={styles.currentPlan}>{currentLabel}</Text>
                {currentPriceLabel ? (
                  <Text style={styles.currentPlanSub}>{currentPriceLabel}</Text>
                ) : null}
                {entitlementStatusLabel ? (
                  <Text style={styles.currentPlanMeta}>状態：{entitlementStatusLabel}</Text>
                ) : null}
                {expiresAtLabel ? (
                  <Text style={styles.currentPlanMeta}>
                    {autoRenew ? "次回更新予定" : "有効期限"}：{expiresAtLabel}
                  </Text>
                ) : null}
              </View>
            )}

            {subscriptionBootstrapLoading ? (
              <View style={{ marginTop: 8, marginBottom: 4 }}>
                <Text style={styles.currentPlanMeta}>販売設定を確認しています…</Text>
              </View>
            ) : null}
            {reviewNotice ? <Text style={styles.planNote}>{reviewNotice}</Text> : null}
            {!salesEnabled || !clientSalesEnabled ? (
              <Text style={styles.planNoteError}>
                {clientSalesDisabledReason || "現在はサブスクリプション販売を停止しています。"}
              </Text>
            ) : null}

            <View style={styles.sectionDivider} />

            <Text style={styles.sectionLabel}>プランを選ぶ</Text>

            {plusPlan?.visible === false ? null : (
              <PlanCard
                title={asStringOrNull(plusPlan?.title) || "Plus会員"}
                price={plusPriceLabel}
                subtitle={plusSubtitle}
                subtitleHighlighted={showPlusTrial}
                features={plusFeatures}
                noteLines={resolvedPlusNoteLines}
                isCurrent={tier === "plus"}
                recommended={plusPlan?.recommended !== false && tier !== "premium"}
                onPress={onSelectPlus}
                ctaDisabled={
                  restoreLoading ||
                  purchaseBusyPlan === "premium" ||
                  plusPlan?.purchasable === false ||
                  !salesEnabled ||
                  !clientSalesEnabled
                }
                ctaLoading={purchaseBusyPlan === "plus"}
                ctaTextOverride={asStringOrNull(plusPlan?.cta_label)}
                styles={styles}
                colors={colors}
              />
            )}

            {premiumPlan?.visible === false ? null : (
              <PlanCard
                title={asStringOrNull(premiumPlan?.title) || "Premium会員"}
                price={premiumPriceLabel}
                subtitle={asStringOrNull(premiumPlan?.subtitle)}
                features={premiumFeatures}
                noteLines={premiumNoteLines}
                isCurrent={tier === "premium"}
                recommended={!!premiumPlan?.recommended}
                onPress={undefined}
                ctaDisabled={true}
                ctaLoading={false}
                ctaTextOverride={asStringOrNull(premiumPlan?.cta_label) || "準備中"}
                styles={styles}
                colors={colors}
              />
            )}

            <View style={styles.noteBox}>
              <Text style={styles.noteTitle}>お手続き</Text>

              <TouchableOpacity
                style={[styles.linkButton, styles.linkButtonFirst]}
                onPress={onRestorePurchases}
                disabled={actionBusy || policy?.restore_enabled === false}
                activeOpacity={0.75}
              >
                <Text style={styles.linkButtonText}>
                  {restoreLoading ? "購入内容を確認しています…" : "購入内容を復元"}
                </Text>
                <Ionicons name="chevron-forward" size={18} color={colors.TEXT_SUBTLE} />
              </TouchableOpacity>

              {tier !== "free" && policy?.manage_enabled !== false ? (
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={onOpenManageSubscription}
                  activeOpacity={0.75}
                >
                  <Text style={styles.linkButtonText}>
                    サブスクリプションを管理
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.TEXT_SUBTLE} />
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => openExternalPage(links?.terms_url, "利用規約")}
                activeOpacity={0.75}
              >
                <Text style={styles.linkButtonText}>利用規約</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.TEXT_SUBTLE} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => openExternalPage(links?.privacy_url, "プライバシーポリシー")}
                activeOpacity={0.75}
              >
                <Text style={styles.linkButtonText}>プライバシーポリシー</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.TEXT_SUBTLE} />
              </TouchableOpacity>

              {links?.support_url ? (
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => openExternalPage(links?.support_url, "サポート")}
                  activeOpacity={0.75}
                >
                  <Text style={styles.linkButtonText}>サポート</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.TEXT_SUBTLE} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function createStyles(COLORS, ui) {
  const font = ui?.font || {};
  const text = ui?.text || {};
  const radius = ui?.radius || {};
  const spacing = ui?.spacing || {};

  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.PANEL_BG },
    container: {
      flex: 1,
      paddingHorizontal: 18,
      paddingTop: 16,
      backgroundColor: COLORS.PANEL_BG,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    backButton: { padding: 4 },
    headerTitle: {
      fontSize: font.title ?? 20,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
    },
    refreshBtn: { padding: 6 },

    card: {
      paddingVertical: 20,
    },

    sectionLabel: {
      fontSize: font.sectionLabel ?? 12,
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginBottom: spacing.sm ?? 8,
      fontWeight: "800",
    },

    currentRow: { marginBottom: 8 },
    currentPlan: {
      fontSize: 16,
      fontWeight: "900",
      color: COLORS.TITLE_GOLD,
    },
    currentPlanSub: {
      marginTop: spacing.xs ?? 4,
      fontSize: font.sectionLabel ?? 12,
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },
    currentPlanMeta: {
      marginTop: 4,
      fontSize: font.description ?? 11,
      color: text.description ?? COLORS.TEXT_SUBTLE,
      lineHeight: 16,
    },

    sectionDivider: {
      height: 1,
      backgroundColor: COLORS.CARD_BORDER,
      marginTop: 18,
      marginBottom: 14,
    },

    planCard: {
      marginTop: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      borderRadius: 18,
      backgroundColor: COLORS.FIELD_BG,
      padding: 14,
    },
    planCardCurrent: {
      borderColor: COLORS.TITLE_GOLD,
      borderWidth: 1.5,
    },
    planHeaderRow: { flexDirection: "row", alignItems: "flex-start" },
    planTitle: {
      fontSize: font.button ?? 15,
      fontWeight: "900",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginRight: spacing.sm ?? 8,
    },
    planPrice: {
      marginTop: 2,
      fontSize: 13,
      fontWeight: "800",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    planSubtitle: {
      marginTop: 2,
      fontSize: 11,
      color: text.description ?? COLORS.TEXT_SUBTLE,
      lineHeight: 16,
    },
    planSubtitleHighlighted: {
      color: COLORS.TITLE_GOLD,
      fontSize: font.button ?? 15,
      fontWeight: "900",
    },
    recommendBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: radius.pill ?? 999,
      backgroundColor: COLORS.GOLD_BUTTON,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    recommendBadgeText: {
      fontSize: font.description ?? 10,
      fontWeight: "900",
      color: COLORS.FIELD_BG,
    },
    currentBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: radius.pill ?? 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: "#00000000",
    },
    currentBadgeText: {
      marginLeft: 4,
      fontSize: 11,
      fontWeight: "900",
      color: COLORS.TITLE_GOLD,
    },

    planFeature: {
      fontSize: font.sectionLabel ?? 12,
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      lineHeight: 18,
      marginBottom: 2,
    },
    planNote: {
      fontSize: 11,
      color: text.description ?? COLORS.TEXT_SUBTLE,
      lineHeight: 16,
      marginBottom: 2,
    },
    planNoteError: {
      marginTop: 6,
      fontSize: 11,
      color: COLORS.ERROR || "#B00020",
      lineHeight: 16,
    },

    planCta: {
      marginTop: 12,
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: radius.pill ?? 999,
      backgroundColor: COLORS.GOLD_BUTTON,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    planCtaDisabled: {
      backgroundColor: COLORS.PANEL_BG,
      borderColor: COLORS.CARD_BORDER,
    },
    planCtaText: {
      fontSize: 13,
      fontWeight: "900",
      color: text.accentOnButton ?? COLORS.FIELD_BG,
    },

    noteBox: {
      marginTop: 18,
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
    },
    noteTitle: {
      fontSize: 12,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 6,
    },

    linkButton: {
      minHeight: 44,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: COLORS.CARD_BORDER,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    linkButtonFirst: {
      borderTopWidth: 0,
    },
    linkButtonText: {
      fontSize: 13,
      fontWeight: "800",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
  });
}
