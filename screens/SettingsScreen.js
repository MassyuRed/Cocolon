import React, { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CocolonPressable from "../components/CocolonPressable";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { AnalysisMenuScroll, useAnalysisMenuStyles } from "./AnalysisMenuCommon";
import SettingsAppSettingsScreen from "./SettingsAppSettingsScreen";
import SettingsOtherScreen from "./SettingsOtherScreen";
import SubscriptionSelectScreen from "./SubscriptionSelectScreen";

function createLocalStyles(colors, ui) {
  return StyleSheet.create(applyTypographyTokens({
    plan: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 8,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      backgroundColor: colors.FIELD_BG,
    },
    planContent: { flex: 1, minWidth: 0, gap: 4 },
    planMeta: { color: colors.TEXT_SUBTLE },
    planValues: { flexDirection: "row", flexWrap: "wrap", alignItems: "baseline", columnGap: 12, rowGap: 4 },
    planName: { color: colors.TEXT_ON_LIGHT, flexShrink: 1 },
    planPrice: { color: colors.TEXT_SUBTLE, flexShrink: 1 },
    section: { color: colors.TEXT_ON_LIGHT, marginBottom: 8 },
    group: { marginBottom: 24 },
    rows: { gap: 3 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      minHeight: 56,
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: colors.FIELD_BG,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      borderRadius: 10,
    },
    first: { borderTopLeftRadius: 24, borderTopRightRadius: 24 },
    last: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    icon: { width: 32, height: 32, flexShrink: 0, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: colors.SURFACE_TONAL },
    label: { flex: 1, minWidth: 0, color: colors.TEXT_ON_LIGHT },
    disabled: { opacity: 0.6 },
    footer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 7, marginVertical: 10 },
    footerLink: { minHeight: 44, justifyContent: "center", paddingHorizontal: 3 }, footerText: { color: colors.TEXT_SUBTLE },
  }, ui, { planMeta: "description", planName: "sectionTitle", planPrice: "description", section: "sectionTitle", label: "button", footerText: "meta" }));
}

function SettingsMenuRow({ item, styles, colors, first, last }) {
  return (
    <CocolonPressable
      onPress={item.onPress}
      disabled={!!item.disabled}
      accessibilityRole="button"
      accessibilityLabel={item.accessibilityLabel || item.label}
      accessibilityState={{ disabled: !!item.disabled }}
      style={[styles.row, first && styles.first, last && styles.last, item.disabled && styles.disabled]}
    >
      <View style={styles.icon} accessible={false} importantForAccessibility="no-hide-descendants">
        <Ionicons name={item.icon} size={18} color={colors.ON_SURFACE_TONAL} />
      </View>
      <Text style={styles.label}>{item.label}</Text>
      <Ionicons name={item.external ? "open-outline" : "chevron-forward"} size={16} color={colors.TEXT_SUBTLE} />
    </CocolonPressable>
  );
}

export function SettingsHomeContent({ navigation, subscription }) {
  const { styles: menuStyles, colors, ui } = useAnalysisMenuStyles();
  const styles = useMemo(() => createLocalStyles(colors, ui), [colors, ui]);
  const openPlans = () => { if (!subscription.actionBusy) navigation.navigate("SubscriptionSelect"); };
  const rows = [
    { label: "プランを選ぶ", icon: "diamond-outline", onPress: openPlans, disabled: subscription.actionBusy },
    { label: subscription.restoreLoading ? "購入内容を確認しています…" : "購入内容を復元", accessibilityLabel: "購入内容を復元", icon: "refresh-outline", onPress: subscription.onRestorePurchases,
      disabled: subscription.actionBusy || !subscription.restoreEnabled },
    { label: "サブスクリプションを管理", icon: "card-outline", onPress: subscription.onOpenManageSubscription, external: true,
      disabled: subscription.actionBusy || !subscription.manageEnabled },
  ];
  const footer = [
    { label: "利用規約", url: subscription.links.terms_url },
    { label: "プライバシーポリシー", url: subscription.links.privacy_url },
    { label: "サポート", url: subscription.links.support_url },
  ].filter(item => !!item.url);
  return <AnalysisMenuScroll>
    <View style={menuStyles.homeHeaderRow}>
      <Text accessibilityRole="header" style={menuStyles.homeTitle}>設定</Text>
    </View>
    <View style={[styles.group, styles.rows]}>
      <SettingsMenuRow
        item={{ label: "アカウント", accessibilityLabel: "アカウントを開く", icon: "person-outline", onPress: () => navigation.navigate("Account") }}
        styles={styles} colors={colors} first
      />
      <SettingsMenuRow
        item={{ label: "アプリの使い方", icon: "book-outline", onPress: () => navigation.navigate("CocolonGuide") }}
        styles={styles} colors={colors} last
      />
    </View>
    <View style={styles.group}>
      <Text accessibilityRole="header" style={styles.section}>アプリ設定</Text>
      <SettingsAppSettingsScreen navigation={navigation} embedded />
    </View>
    <View style={styles.group}>
      <Text accessibilityRole="header" style={styles.section}>サブスク加入状況</Text>
      <CocolonPressable
        style={[styles.plan, subscription.actionBusy && styles.disabled]}
        disabled={subscription.actionBusy}
        onPress={openPlans}
        accessibilityRole="button"
        accessibilityLabel="現在のプランと加入状況を開く"
        accessibilityState={{ disabled: !!subscription.actionBusy, busy: !!subscription.loading }}
        accessibilityValue={{ text: subscription.loading ? "確認中" : `${subscription.currentLabel} ${subscription.currentPriceLabel}` }}
      >
        <View style={styles.planContent}>
          <Text style={styles.planMeta}>現在のプラン</Text>
          {!subscription.loading ? <View style={styles.planValues}>
            <Text style={styles.planName}>{subscription.currentLabel.replace(/プラン$/, "")}</Text>
            <Text style={styles.planPrice}>{subscription.currentPriceLabel}</Text>
          </View> : null}
        </View>
        {subscription.loading
          ? <ActivityIndicator color={colors.TITLE_GOLD} accessibilityLabel="現在のプランを確認中" />
          : <Ionicons name="chevron-forward" size={16} color={colors.TEXT_SUBTLE} />}
      </CocolonPressable>
      <View style={styles.rows}>
        {rows.map((item, index) => <SettingsMenuRow key={item.accessibilityLabel || item.label}
          item={item} styles={styles} colors={colors} first={index === 0} last={index === rows.length - 1} />)}
      </View>
    </View>
    <View style={styles.group}><Text accessibilityRole="header" style={styles.section}>その他</Text><SettingsOtherScreen navigation={navigation} embedded /></View>
    <View style={styles.footer}>{footer.map(item => <CocolonPressable key={item.label} style={styles.footerLink} accessibilityRole="link" accessibilityLabel={item.label}
      onPress={() => subscription.openExternalPage(item.url, item.label)}><Text style={styles.footerText}>{item.label}</Text></CocolonPressable>)}</View>
  </AnalysisMenuScroll>;
}

export default function SettingsScreen() {
  const navigation = useNavigation();
  return <SubscriptionSelectScreen navigation={navigation} renderSettings={subscription => <SettingsHomeContent navigation={navigation} subscription={subscription} />} />;
}
