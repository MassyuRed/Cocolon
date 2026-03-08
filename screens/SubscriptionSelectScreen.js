import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  IAP_PRODUCT_IDS,
} from "../lib/iap/iapService";

// テスト配布用：サブスク導入時は false に戻すだけで復帰します
const IS_TEST_BUILD = true;

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

function buildIapErrorMessage(err) {
  if (!err) return "購入処理に失敗しました。時間をおいて再度お試しください。";
  const code = String(err?.code || "");
  const msg = String(err?.message || err);

  // よくあるケース（表示はユーザー向けに簡潔に）
  if (
    /E_USER_CANCELLED/i.test(code) ||
    /USER_CANCELLED/i.test(code) ||
    /cancel/i.test(msg)
  ) {
    return "購入をキャンセルしました。";
  }
  if (/E_ITEM_UNAVAILABLE/i.test(code)) {
    return "このプランは現在購入できません。";
  }
  if (/E_NETWORK/i.test(code) || /network/i.test(msg)) {
    return "通信エラーが発生しました。ネットワーク状況を確認してお試しください。";
  }
  if (/E_SERVICE_ERROR/i.test(code) || /service/i.test(msg)) {
    return "購入サービスに接続できませんでした。時間をおいて再度お試しください。";
  }

  // デバッグ用途：開発中だけ詳細を出す（本番ユーザーに内部情報を見せない）
  if (typeof __DEV__ !== "undefined" && __DEV__ && msg) {
    return `購入処理に失敗しました。\n\n詳細: ${msg}`;
  }

  return "購入処理に失敗しました。時間をおいて再度お試しください。";
}

function PlanCard({
  title,
  price,
  subtitle,
  features,
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
          {subtitle ? <Text style={styles.planSubtitle}>{subtitle}</Text> : null}
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
                ? "処理中…"
                : (ctaTextOverride ?? "このプランを選択")}
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

  const { tier: ctxTier, loading: ctxLoading, refreshTier } = useSubscription();
  const loading = !!ctxLoading || ctxTier === "unknown";
  const tier = loading ? "free" : normalizeSubscriptionTier(ctxTier);

  // IAP（アプリ内課金）
  const [iapReady, setIapReady] = useState(false);
  const [iapInitError, setIapInitError] = useState("");
  const [purchaseBusyPlan, setPurchaseBusyPlan] = useState("");


  // IAP 初期化（接続は App 側で observer が使うので、ここでは切断しない）
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await ensureIapConnection();
        if (!cancelled) {
          setIapReady(true);
          setIapInitError("");
        }
      } catch (e) {
        if (!cancelled) {
          setIapReady(false);
          setIapInitError(String(e?.message || e));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // Ensure latest tier on entry (best-effort)
    refreshTier({ force: true }).catch(() => null);
  }, [refreshTier]);

  const currentLabel = SUB_TIER_LABEL[tier] || "無料会員";

  const onSelectPlus = async () => {
    if (tier === "plus") return;
    if (purchaseBusyPlan) return;

    // MVP: ダウングレードはストアの管理画面で（アプリ内は将来対応）
    if (tier === "premium") {
      Alert.alert(
        "プラン変更",
        "Premium会員からPlus会員への変更は、現在アプリ内では対応していません。\n\nサブスクリプションの管理画面から変更できます。"
      );
      return;
    }

    if (!iapReady) {
      Alert.alert(
        "購入できません",
        "購入機能の準備ができていません。\n\n通信状態を確認して、もう一度お試しください。"
      );
      return;
    }

    setPurchaseBusyPlan("plus");
    try {
      const productId = IAP_PRODUCT_IDS?.plus;
      if (!productId) {
        Alert.alert("購入できません", "IAP商品ID（Plus）が未設定です。");
        return;
      }

      const { purchase: p } = await purchase(productId);
      if (!p) {
        Alert.alert(
          "Plus会員",
          "購入処理が完了しませんでした。もう一度お試しください。"
        );
        return;
      }

      Alert.alert(
        "購入が完了しました",
        "プラン反映のため、数秒後に右上の更新ボタンで状態を確認できます。\n\n反映まで時間がかかる場合があります。"
      );

      await refreshTier({ force: true });
    } catch (e) {
      console.warn("IAP purchase failed:", e?.message || e);
      Alert.alert("購入に失敗しました", buildIapErrorMessage(e));
    } finally {
      setPurchaseBusyPlan("");
    }
  };

  const onSelectPremium = async () => {
    if (tier === "premium") return;
    if (purchaseBusyPlan) return;

    if (!iapReady) {
      Alert.alert(
        "購入できません",
        "購入機能の準備ができていません。\n\n通信状態を確認して、もう一度お試しください。"
      );
      return;
    }

    setPurchaseBusyPlan("premium");
    try {
      const productId = IAP_PRODUCT_IDS?.premium;
      if (!productId) {
        Alert.alert("購入できません", "IAP商品ID（Premium）が未設定です。");
        return;
      }

      const { purchase: p } = await purchase(productId);
      if (!p) {
        Alert.alert(
          "Premium会員",
          "購入処理が完了しませんでした。もう一度お試しください。"
        );
        return;
      }

      Alert.alert(
        "購入が完了しました",
        "プラン反映のため、数秒後に右上の更新ボタンで状態を確認できます。\n\n反映まで時間がかかる場合があります。"
      );

      await refreshTier({ force: true });
    } catch (e) {
      console.warn("IAP purchase failed:", e?.message || e);
      Alert.alert("購入に失敗しました", buildIapErrorMessage(e));
    } finally {
      setPurchaseBusyPlan("");
    }
  };

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
          {/* ヘッダー */}
          <View style={styles.header}>
            <CocolonBackButton
              navigation={navigation}
              fallbackRouteName="Home"
              style={styles.backButton}
            />
            <Text style={styles.headerTitle}>Subscription</Text>
            <TouchableOpacity
              onPress={() => refreshTier({ force: true }).catch(() => null)}
              style={styles.refreshBtn}
              activeOpacity={0.75}
            >
              <Ionicons name="refresh" size={18} color={colors.TITLE_GOLD} />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={[styles.sectionLabel, { color: "#000", fontWeight: "900" }]}>
              サブスク状況
            </Text>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <View style={styles.currentRow}>
                <Text style={styles.currentPlan}>{currentLabel}</Text>
                {(tier !== "free" && false) ? (
                  <Text style={styles.currentPlanSub}>
                    {tier === "plus" ? "月額300円" : "月額980円"}
                  </Text>
                ) : null}
              </View>
            )}

            {!loading && tier !== "free" && false ? (
              <View style={styles.statusHintBox}>
                <Text style={styles.statusHintText}>
                  {"サブスクリプションの変更・解約は、App Store / Google Play の管理画面から行えます。"}
                </Text>
              </View>
            ) : null}

            {(typeof __DEV__ !== "undefined" && __DEV__ && iapInitError && false) ? (
              <Text style={styles.debugText}>IAP初期化: {iapInitError}</Text>
            ) : null}

            <View style={styles.sectionDivider} />

            <Text style={[styles.sectionLabel, { color: "#000", fontWeight: "900" }]}>
              サブスク内容と加入
            </Text>

            <PlanCard
              title="Plus会員"
              price="月額300円"
              subtitle="レポート閲覧 / MyModelCreate拡張"
              features={[
                "MyWeb：感情構造分析レポート本文閲覧",
                "MyWeb：自己構造分析レポート履歴＋本文閲覧",
                "MyWeb：MyModelCreate 30問すべて利用可能（編集可）",
                "MyModel：Echoes履歴をすべて閲覧可能",
                "MyModel：Discoveries履歴をすべて閲覧可能",
              ]}
              isCurrent={tier === "plus"}
              recommended={tier !== "premium"} // Premium中はおすすめ出さない
              onPress={onSelectPlus}
              ctaDisabled={IS_TEST_BUILD || !!purchaseBusyPlan}
              ctaLoading={IS_TEST_BUILD ? false : purchaseBusyPlan === "plus"}
              ctaTextOverride={IS_TEST_BUILD ? "準備中" : undefined}
              styles={styles}
              colors={colors}
            />

            <PlanCard
              title="Premium会員"
              price="月額980円"
              subtitle="Deepモード / DeepInsight / 生成・分析機能"
              features={[
                "MyWeb：感情構造分析レポートにDeepモード追加",
                "MyWeb：自己構造分析レポートにDeepモード追加",
                "MyWeb：DeepInsight解放",
                "MyModel：Reflectionを入力内容から生成（secret除く）",
                "MyModel：自己紹介文生成",
                "MyModel：Echoes履歴の分析機能",
                "MyModel：Discoveries履歴の分析機能",
              ]}
              isCurrent={tier === "premium"}
              recommended={false}
              onPress={onSelectPremium}
              ctaDisabled={IS_TEST_BUILD || !!purchaseBusyPlan}
              ctaLoading={IS_TEST_BUILD ? false : purchaseBusyPlan === "premium"}
              ctaTextOverride={IS_TEST_BUILD ? "準備中" : undefined}
              styles={styles}
              colors={colors}
            />

            <View style={styles.planCard}>
              <View style={styles.planHeaderRow}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.planTitle}>Architect会員</Text>
                  </View>
                </View>
              </View>

              <View style={styles.architectSecretWrap}>
                <Ionicons
                  name="ban-outline"
                  size={72}
                  color={colors.TEXT_SUBTLE}
                  style={{ marginBottom: 6 }}
                />
                <Text style={styles.architectSecretTitle}>TOP SECRET</Text>
                <Text style={styles.architectSecretSub}>ACCESS DENIED</Text>
              </View>
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
    container: { flex: 1, paddingHorizontal: 18, paddingTop: 16, backgroundColor: COLORS.PANEL_BG },

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

    sectionLabel: { fontSize: font.sectionLabel ?? 12, color: text.subtle ?? COLORS.TEXT_SUBTLE, marginBottom: spacing.sm ?? 8 },

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
    debugText: {
      marginTop: 6,
      fontSize: font.description ?? 10,
      color: text.description ?? COLORS.TEXT_SUBTLE,
      lineHeight: 14,
    },

    statusHintBox: {
      marginTop: 10,
      padding: 10,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    statusHintText: {
      fontSize: 11,
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

    architectSecretWrap: {
      marginTop: 10,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 140,
      paddingVertical: 18,
    },
    architectSecretTitle: {
      fontSize: 20,
      fontWeight: "900",
      letterSpacing: 2,
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    architectSecretSub: {
      marginTop: 4,
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 2,
      color: text.description ?? COLORS.TEXT_SUBTLE,
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
    noteText: {
      fontSize: 11,
      color: COLORS.TEXT_SUBTLE,
      lineHeight: 16,
      marginBottom: 4,
    },
  });
}
