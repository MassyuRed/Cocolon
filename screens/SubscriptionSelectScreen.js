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
  purchase,
  restoreAvailablePurchases,
  syncPurchaseToSubscriptionTier,
  IAP_PRODUCT_IDS,
} from "../lib/iap/iapService";
import { supabase } from "../lib/supabase";

const TERMS_URL = String(
  (typeof process !== "undefined" && process?.env?.EXPO_PUBLIC_TERMS_URL) || ""
).trim();

const PRIVACY_URL = String(
  (typeof process !== "undefined" && process?.env?.EXPO_PUBLIC_PRIVACY_URL) || ""
).trim();

const ANDROID_PACKAGE_NAME = String(
  (typeof process !== "undefined" &&
    process?.env?.EXPO_PUBLIC_ANDROID_PACKAGE_NAME) ||
    ""
).trim();

const IOS_MANAGE_SUBSCRIPTIONS_URL =
  "https://apps.apple.com/account/subscriptions";

const PLUS_TRIAL_OFFER_TAG = "trial_1m_new_user";

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

function buildManageSubscriptionUrl(productId) {
  if (Platform.OS === "ios") {
    return IOS_MANAGE_SUBSCRIPTIONS_URL;
  }

  const sku = String(productId || "").trim();
  if (ANDROID_PACKAGE_NAME && sku) {
    return `https://play.google.com/store/account/subscriptions?sku=${encodeURIComponent(
      sku
    )}&package=${encodeURIComponent(ANDROID_PACKAGE_NAME)}`;
  }

  return "https://play.google.com/store/account/subscriptions";
}

function buildIapErrorMessage(err) {
  if (!err) return "お申し込みを完了できませんでした。時間をおいてもう一度お試しください。";

  const code = String(err?.code || "");
  const msg = String(err?.message || err);

  if (
    /E_USER_CANCELLED/i.test(code) ||
    /USER_CANCELLED/i.test(code) ||
    /cancel/i.test(msg)
  ) {
    return "お申し込みをキャンセルしました。";
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

  return "お申し込みを完了できませんでした。時間をおいてもう一度お試しください。";
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

          <Text style={styles.planPrice}>{price}</Text>
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
    plusTrialConsumed,
    refreshTier,
  } = useSubscription();
  const loading = !!ctxLoading || ctxTier === "unknown";
  const tier = loading ? "free" : normalizeSubscriptionTier(ctxTier);

  const [iapReady, setIapReady] = useState(false);
  const [purchaseBusyPlan, setPurchaseBusyPlan] = useState("");
  const [restoreLoading, setRestoreLoading] = useState(false);

  const refreshScreenState = useCallback(
    async ({ force = false } = {}) => {
      await refreshTier({ force }).catch(() => null);
    },
    [refreshTier]
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

  const currentLabel = SUB_TIER_LABEL[tier] || "無料会員";
  const currentPriceLabel =
    tier === "plus" ? "月額300円" : tier === "premium" ? "月額980円" : "";

  const showPlusTrial = tier === "free" && plusTrialEligible;
  const isTrialStatusUnavailable =
    tier === "free" && !ctxLoading && !plusTrialEligible && !plusTrialConsumed;
  const actionBusy = !!purchaseBusyPlan || restoreLoading;

  const plusNoteLines = showPlusTrial
    ? [
        "無料期間終了後は、月額300円で自動更新されます。",
        "解約はいつでも行えます。",
      ]
    : [
        "月額300円で自動更新されます。",
        "解約はいつでも行えます。",
      ];

  const openExternalPage = useCallback(async (url) => {
    if (!url) {
      Alert.alert(
        "ページを開けませんでした",
        "時間をおいてもう一度お試しください。"
      );
      return;
    }

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        "ページを開けませんでした",
        "時間をおいてもう一度お試しください。"
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

      const premiumPurchase =
        IAP_PRODUCT_IDS?.premium &&
        normalized.find((x) => x.productId === IAP_PRODUCT_IDS.premium)?.purchase;

      const plusPurchase =
        IAP_PRODUCT_IDS?.plus &&
        normalized.find((x) => x.productId === IAP_PRODUCT_IDS.plus)?.purchase;

      const targetPurchase = premiumPurchase || plusPurchase || null;

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
    } catch {
      Alert.alert(
        "復元できませんでした",
        "購入内容を復元できませんでした。時間をおいてもう一度お試しください。"
      );
    } finally {
      setRestoreLoading(false);
    }
  }, [actionBusy, refreshScreenState]);

  const onOpenManageSubscription = useCallback(async () => {
    const productId =
      tier === "premium" ? IAP_PRODUCT_IDS?.premium : IAP_PRODUCT_IDS?.plus;
    const url = buildManageSubscriptionUrl(productId);
    await openExternalPage(url);
  }, [openExternalPage, tier]);

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
        "ただいまお申し込みページを開けませんでした。時間をおいてもう一度お試しください。"
      );
      return;
    }

    setPurchaseBusyPlan("plus");

    try {
      const productId = IAP_PRODUCT_IDS?.plus;
      if (!productId) {
        Alert.alert(
          "お申し込みができませんでした",
          "時間をおいてもう一度お試しください。"
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

      if (isTrialStatusUnavailable) {
        Alert.alert(
          "お申し込みができませんでした",
          "無料トライアルの対象状況を確認できませんでした。通信環境をご確認のうえ、もう一度お試しください。"
        );
        return;
      }

      const allowTrial = tier === "free" && plusTrialEligible;

      const { purchase: p } = await purchase(productId, {
        allowTrial,
        offerTag: PLUS_TRIAL_OFFER_TAG,
      });

      if (!p) {
        Alert.alert(
          "お申し込みができませんでした",
          "時間をおいてもう一度お試しください。"
        );
        return;
      }

      Alert.alert(
        "お申し込みが完了しました",
        "プラン情報を更新しています。反映まで少し時間がかかる場合があります。"
      );

      await refreshScreenState({ force: true });
    } catch (e) {
      Alert.alert("お申し込みができませんでした", buildIapErrorMessage(e));
    } finally {
      setPurchaseBusyPlan("");
    }
  }, [
    iapReady,
    isTrialStatusUnavailable,
    loading,
    plusTrialEligible,
    purchaseBusyPlan,
    refreshScreenState,
    tier,
  ]);

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
              </View>
            )}

            <View style={styles.sectionDivider} />

            <Text style={styles.sectionLabel}>プランを選ぶ</Text>

            <PlanCard
              title="Plus会員"
              price="月額300円"
              subtitle={
                showPlusTrial
                  ? "１ヵ月無料トライアル（初回限定）"
                  : "レポート閲覧 / MyModelCreate拡張"
              }
              subtitleHighlighted={showPlusTrial}
              features={[
                "履歴関連：表示期間１年",
                "MyWeb：感情構造分析レポートが深くなります",
                "MyWeb：自己構造分析レポートを閲覧できます",
                "MyWeb：今日の問いを履歴から編集できます",
                "MyModel：MyModelCreateの20問すべてを利用できます",
                "MyModel：MyModelCreateを入力後に編集できます",
              ]}
              noteLines={plusNoteLines}
              isCurrent={tier === "plus"}
              recommended={tier !== "premium"}
              onPress={onSelectPlus}
              ctaDisabled={restoreLoading || purchaseBusyPlan === "premium"}
              ctaLoading={purchaseBusyPlan === "plus"}
              styles={styles}
              colors={colors}
            />

            <PlanCard
              title="Premium会員"
              price="月額980円"
              subtitle="Deepモード / DeepInsight / 生成・分析機能"
              features={[
                "MyWeb：感情構造分析レポートに Deep モードが追加されます",
                "MyWeb：自己構造分析レポートに Deep モードが追加されます",
                "MyWeb：DeepInsight を利用できます",
                "MyModel：Reflection を入力内容から生成できます",
                "MyModel：自己紹介文を生成できます",
                "MyModel：Echoes履歴の分析機能を利用できます",
                "MyModel：Discoveries履歴の分析機能を利用できます",
              ]}
              noteLines={["※Premiumは準備中です。"]}
              isCurrent={tier === "premium"}
              recommended={false}
              onPress={undefined}
              ctaDisabled={true}
              ctaLoading={false}
              ctaTextOverride="準備中"
              styles={styles}
              colors={colors}
            />

            <View style={styles.noteBox}>
              <Text style={styles.noteTitle}>お手続き</Text>

              <TouchableOpacity
                style={[styles.linkButton, styles.linkButtonFirst]}
                onPress={onRestorePurchases}
                disabled={actionBusy}
                activeOpacity={0.75}
              >
                <Text style={styles.linkButtonText}>
                  {restoreLoading ? "購入内容を確認しています…" : "購入内容を復元"}
                </Text>
                <Ionicons name="chevron-forward" size={18} color={colors.TEXT_SUBTLE} />
              </TouchableOpacity>

              {tier !== "free" ? (
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
                onPress={() => openExternalPage(TERMS_URL)}
                activeOpacity={0.75}
              >
                <Text style={styles.linkButtonText}>利用規約</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.TEXT_SUBTLE} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => openExternalPage(PRIVACY_URL)}
                activeOpacity={0.75}
              >
                <Text style={styles.linkButtonText}>プライバシーポリシー</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.TEXT_SUBTLE} />
              </TouchableOpacity>
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
