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
    eyebrow: { color: colors.TEXT_SUBTLE, letterSpacing: 1.4, marginTop: 12, marginBottom: 8 },
    title: { color: colors.TEXT_ON_LIGHT, marginBottom: 7 },
    subtitle: { color: colors.TEXT_SUBTLE, marginBottom: 24 },
    plan: { borderRadius: 26, backgroundColor: colors.GOLD_BUTTON, padding: 22, marginBottom: 26, minHeight: 136, justifyContent: "center" },
    planMeta: { color: colors.ACCENT_TEXT, marginBottom: 8 },
    planRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    planName: { color: colors.ACCENT_TEXT, flexShrink: 1 },
    planPrice: { color: colors.ACCENT_TEXT, flexShrink: 1, marginTop: 4 },
    planCaption: { color: colors.ACCENT_TEXT, marginTop: 10 },
    section: { color: colors.TEXT_SUBTLE, marginBottom: 10 },
    group: { marginBottom: 25 },
    row: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 58, padding: 12, backgroundColor: colors.PANEL_BG, borderRadius: 10, marginBottom: 3 },
    first: { borderTopLeftRadius: 24, borderTopRightRadius: 24 }, last: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    icon: { width: 32, height: 32, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: colors.SURFACE_TONAL },
    label: { flex: 1, color: colors.TEXT_ON_LIGHT }, disabled: { opacity: 0.6 },
    footer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 7, marginVertical: 10 },
    footerLink: { minHeight: 44, justifyContent: "center", paddingHorizontal: 3 }, footerText: { color: colors.TEXT_SUBTLE },
  }, ui, { eyebrow: "meta", title: "screenTitle", subtitle: "description", planMeta: "meta", planName: "screenTitle", planPrice: "meta", planCaption: "description", section: "meta", label: "button", footerText: "meta" }));
}

export function SettingsHomeContent({ navigation, subscription }) {
  const { colors, ui } = useAnalysisMenuStyles();
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
    <Text style={styles.eyebrow}>YOUR SPACE</Text>
    <Text style={styles.title}>設定</Text>
    <Text style={styles.subtitle}>あなたに合う使い方で。</Text>
    <CocolonPressable style={[styles.plan, subscription.actionBusy && styles.disabled]} disabled={subscription.actionBusy} onPress={openPlans} accessibilityLabel="現在のプランと加入状況を開く">
      <Text style={styles.planMeta}>現在のプラン</Text>
      {subscription.loading ? <ActivityIndicator color={colors.ACCENT_TEXT} accessibilityLabel="現在のプランを確認中" /> : <View style={styles.planRow}>
        <View style={styles.icon}><Ionicons name="sparkles-outline" size={20} color={colors.ON_SURFACE_TONAL} /></View>
        <View style={{ flex: 1 }}><Text style={styles.planName}>{subscription.currentLabel.replace(/プラン$/, "")}</Text>
          <Text style={styles.planPrice}>{subscription.currentPriceLabel}</Text></View>
        <Ionicons name="arrow-up-outline" size={18} color={colors.ACCENT_TEXT} style={{ transform: [{ rotate: "45deg" }] }} />
      </View>}
      <Text style={styles.planCaption}>日々のことばを、あなたらしく。</Text>
    </CocolonPressable>
    <View style={styles.group}>
      <Text style={styles.section}>アプリ設定</Text>
      <SettingsAppSettingsScreen navigation={navigation} embedded />
    </View>
    <View style={styles.group}>
      <Text style={styles.section}>サブスク加入状況</Text>
      {rows.map((item, index) => <CocolonPressable key={item.accessibilityLabel || item.label} onPress={item.onPress} disabled={!!item.disabled}
        accessibilityLabel={item.accessibilityLabel || item.label} accessibilityState={{ disabled: !!item.disabled }}
        style={[styles.row, index === 0 && styles.first, index === rows.length - 1 && styles.last, item.disabled && styles.disabled]}>
        <View style={styles.icon}><Ionicons name={item.icon} size={18} color={colors.ON_SURFACE_TONAL} /></View>
        <Text style={styles.label}>{item.label}</Text><Ionicons name={item.external ? "open-outline" : "chevron-forward"} size={16} color={colors.TEXT_SUBTLE} />
      </CocolonPressable>)}
    </View>
    <View style={styles.group}><Text style={styles.section}>その他</Text><SettingsOtherScreen navigation={navigation} embedded /></View>
    <View style={styles.footer}>{footer.map(item => <CocolonPressable key={item.label} style={styles.footerLink} accessibilityRole="link" accessibilityLabel={item.label}
      onPress={() => subscription.openExternalPage(item.url, item.label)}><Text style={styles.footerText}>{item.label}</Text></CocolonPressable>)}</View>
  </AnalysisMenuScroll>;
}

export default function SettingsScreen() {
  const navigation = useNavigation();
  return <SubscriptionSelectScreen navigation={navigation} renderSettings={subscription => <SettingsHomeContent navigation={navigation} subscription={subscription} />} />;
}
