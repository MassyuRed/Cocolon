import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { applyTypographyTokens } from "../../ui/applyTypographyTokens";
import { DARK_GRAY_DESC } from "../../ui/uiTokens";
import WatashiMapOverviewCard from "./WatashiMapOverviewCard";
import RoleSwitchList from "./RoleSwitchList";
import RoutePatternCard from "./RoutePatternCard";
import CrossroadCard from "./CrossroadCard";
import UnknownAreaCard from "./UnknownAreaCard";
import {
  asList,
  asObject,
  asText,
  isLocked,
  lockLabel,
  normalizeWatashiMapPayload,
} from "./watashiMapFormatters";

const EMPTY_WATASHI_MAP_TITLE = "まだ地図にできる観測が少なめです";

function buildPalette(colors, isDark) {
  const readableDescription = isDark ? colors?.TEXT_SUBTLE : DARK_GRAY_DESC;
  return {
    cardBg: colors?.PANEL_BG || (isDark ? "#111827" : "#FFFFFF"),
    mutedBg: colors?.BG_SILVER || (isDark ? "#1F2937" : "#F9FAFB"),
    softBg: isDark ? "rgba(212,175,55,0.12)" : "#FFFBEB",
    border: colors?.CARD_BORDER || (isDark ? "#374151" : "#E5E7EB"),
    text: colors?.TEXT_ON_LIGHT || (isDark ? "#F9FAFB" : "#111827"),
    subtle: readableDescription || (isDark ? "#9CA3AF" : DARK_GRAY_DESC),
    accent: colors?.GOLD_BUTTON || "#D4AF37",
    accentBorder: colors?.GOLD_BUTTON_BORDER || "#C9A227",
    accentText: colors?.ACCENT_TEXT || (isDark ? "#111827" : "#111827"),
  };
}

function LockedSectionCard({ payload, localStyles, onUpgradePress }) {
  const label = lockLabel(payload);
  const locked = asList(asObject(payload?.visibility)?.locked_sections || asObject(payload?.visibility)?.lockedSections);
  const hasLockedDeep = locked.includes("routes") || locked.includes("crossroads") || locked.includes("detail_report");
  if (!hasLockedDeep && !label) return null;

  return (
    <View style={[localStyles.card, localStyles.lockCard]}>
      <Text style={localStyles.lockTitle}>詳しい自己分析レポート</Text>
      <Text style={localStyles.lockBody}>
        {label || "詳しい自己分析レポートは Plus プラン以上で読めます。"}
      </Text>
      <Text style={localStyles.lockSubText}>
        わたしマップの入口は見えています。Plusでは、役割スイッチの一覧と、よく通るルートを詳しく読めます。
      </Text>
      {typeof onUpgradePress === "function" ? (
        <TouchableOpacity style={localStyles.lockButton} activeOpacity={0.85} onPress={onUpgradePress}>
          <Text style={localStyles.lockButtonText}>プランを見る</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default function WatashiMapRenderer({
  contentJson,
  contentText = "",
  reportMode = "standard",
  viewerTier = "free",
  periodLabel = "",
  colors,
  isDark = false,
  onUpgradePress,
}) {
  const palette = useMemo(() => buildPalette(colors, isDark), [colors, isDark]);
  const localStyles = useMemo(() => createStyles(palette), [palette]);
  const payload = useMemo(
    () => normalizeWatashiMapPayload(contentJson, { contentText, reportMode, viewerTier, periodLabel }),
    [contentJson, contentText, reportMode, viewerTier, periodLabel]
  );

  const visibility = asObject(payload.visibility) || {};
  const hasOverview = !!asObject(payload.overview);
  const hasRoleSwitches = asList(payload.role_switches || payload.roleSwitches).length > 0;
  const hasRoutes = asList(payload.routes).length > 0;
  const hasCrossroads = asList(payload.crossroads).length > 0;
  const hasUnknownAreas = asList(payload.unknown_areas || payload.unknownAreas).length > 0;
  const shouldShowLock =
    !visibility.detail_report_visible ||
    isLocked(payload, "routes") ||
    isLocked(payload, "crossroads") ||
    isLocked(payload, "detail_report");

  return (
    <View style={localStyles.root}>
      <View style={localStyles.badgeRow}>
        <Text style={localStyles.badgeText}>{asText(payload.label) || "わたしマップ"}</Text>
        {asText(payload.report_mode || payload.reportMode) ? (
          <Text style={localStyles.modeBadge}>{asText(payload.report_mode || payload.reportMode)}</Text>
        ) : null}
      </View>

      {hasOverview ? (
        <WatashiMapOverviewCard overview={payload.overview} payload={payload} localStyles={localStyles} />
      ) : null}

      {hasRoleSwitches && visibility.role_switches_visible !== false ? (
        <RoleSwitchList roleSwitches={payload.role_switches || payload.roleSwitches} localStyles={localStyles} />
      ) : null}

      {hasRoutes && visibility.routes_visible !== false ? (
        <RoutePatternCard routes={payload.routes} localStyles={localStyles} />
      ) : null}

      {hasCrossroads && visibility.crossroads_visible !== false ? (
        <CrossroadCard crossroads={payload.crossroads} localStyles={localStyles} />
      ) : null}

      {hasUnknownAreas && visibility.unknown_areas_visible !== false ? (
        <UnknownAreaCard unknownAreas={payload.unknown_areas || payload.unknownAreas} localStyles={localStyles} />
      ) : null}

      {shouldShowLock ? (
        <LockedSectionCard payload={payload} localStyles={localStyles} onUpgradePress={onUpgradePress} />
      ) : null}
    </View>
  );
}

function createStyles(palette) {
  return StyleSheet.create(applyTypographyTokens({
    root: { marginBottom: 12 },
    badgeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: 12,
      marginBottom: 8,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: "900",
      color: palette.accent,
      letterSpacing: 0.4,
    },
    modeBadge: {
      overflow: "hidden",
      borderRadius: 999,
      borderWidth: 1,
      borderColor: palette.border,
      paddingHorizontal: 8,
      paddingVertical: 3,
      fontSize: 10,
      fontWeight: "800",
      color: palette.subtle,
      backgroundColor: palette.mutedBg,
    },
    card: {
      marginHorizontal: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: palette.border,
      borderRadius: 16,
      backgroundColor: palette.cardBg,
      padding: 14,
    },
    overviewCard: {
      borderColor: palette.accentBorder,
    },
    sectionHeader: { marginBottom: 10 },
    sectionTitle: {
      fontSize: 17,
      lineHeight: 22,
      fontWeight: "900",
      color: palette.text,
      letterSpacing: 0.2,
    },
    sectionSubtitle: {
      marginTop: 3,
      fontSize: 12,
      lineHeight: 17,
      color: palette.subtle,
      fontWeight: "600",
    },
    explainText: {
      fontSize: 13,
      lineHeight: 20,
      color: palette.subtle,
      marginBottom: 10,
    },
    summaryText: {
      fontSize: 15,
      lineHeight: 22,
      fontWeight: "800",
      color: palette.text,
      marginBottom: 10,
    },
    bodyText: {
      fontSize: 13,
      lineHeight: 20,
      color: palette.subtle,
      marginBottom: 10,
    },
    infoPanel: {
      borderRadius: 14,
      backgroundColor: palette.mutedBg,
      padding: 10,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingVertical: 5,
    },
    infoLabel: {
      width: 118,
      fontSize: 11,
      lineHeight: 17,
      color: palette.subtle,
      fontWeight: "800",
    },
    infoValue: {
      flex: 1,
      fontSize: 12,
      lineHeight: 18,
      color: palette.text,
      fontWeight: "800",
      textAlign: "right",
    },
    roleSwitchCard: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.mutedBg,
      padding: 12,
      marginTop: 8,
    },
    roleSwitchTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    contextChip: {
      alignSelf: "flex-start",
      borderRadius: 999,
      backgroundColor: palette.softBg,
      borderWidth: 1,
      borderColor: palette.accentBorder,
      paddingHorizontal: 9,
      paddingVertical: 4,
    },
    contextChipText: { fontSize: 11, fontWeight: "900", color: palette.text },
    dotsText: { fontSize: 13, fontWeight: "900", color: palette.accent },
    roleSwitchTitle: {
      fontSize: 15,
      lineHeight: 21,
      fontWeight: "900",
      color: palette.text,
      marginBottom: 4,
    },
    roleSwitchBody: { fontSize: 13, lineHeight: 19, color: palette.text, fontWeight: "600" },
    roleSwitchPreview: { marginTop: 6, fontSize: 12, lineHeight: 18, color: palette.subtle },
    safeNote: { marginTop: 8, fontSize: 11, lineHeight: 16, color: palette.subtle, fontWeight: "600" },
    routeCard: {
      borderRadius: 14,
      backgroundColor: palette.mutedBg,
      padding: 12,
      marginTop: 8,
    },
    routeTitle: { fontSize: 14, lineHeight: 20, fontWeight: "900", color: palette.text, marginBottom: 10 },
    routeStepRow: { flexDirection: "row", alignItems: "stretch" },
    routeStepMarkerColumn: { width: 20, alignItems: "center" },
    routeStepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: palette.accent, marginTop: 5 },
    routeStepLine: { width: 1, flex: 1, backgroundColor: palette.border, marginTop: 2, marginBottom: 2 },
    routeStepTextColumn: { flex: 1, paddingBottom: 10 },
    routeStepLabel: { fontSize: 11, lineHeight: 15, fontWeight: "900", color: palette.subtle },
    routeStepText: { fontSize: 13, lineHeight: 19, fontWeight: "700", color: palette.text, marginTop: 1 },
    crossroadCard: {
      borderRadius: 14,
      backgroundColor: palette.mutedBg,
      padding: 12,
      marginTop: 8,
    },
    crossroadContext: { fontSize: 14, lineHeight: 20, fontWeight: "900", color: palette.text, marginBottom: 8 },
    axisRow: { flexDirection: "row", marginHorizontal: -3 },
    axisBlock: {
      flex: 1,
      marginHorizontal: 3,
      borderWidth: 1,
      borderColor: palette.border,
      borderRadius: 12,
      padding: 8,
      backgroundColor: palette.cardBg,
    },
    axisLabel: { fontSize: 10, lineHeight: 14, color: palette.subtle, fontWeight: "900", marginBottom: 4 },
    axisValue: { fontSize: 12, lineHeight: 17, color: palette.text, fontWeight: "800" },
    crossroadNote: { marginTop: 9, fontSize: 12, lineHeight: 18, color: palette.subtle },
    unknownCard: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.mutedBg,
      padding: 12,
      marginTop: 8,
    },
    unknownTitle: { fontSize: 14, lineHeight: 20, fontWeight: "900", color: palette.text, marginBottom: 4 },
    unknownReason: { fontSize: 12, lineHeight: 18, color: palette.subtle },
    unknownHint: { marginTop: 6, fontSize: 12, lineHeight: 18, color: palette.text, fontWeight: "700" },
    lockCard: { backgroundColor: palette.softBg, borderColor: palette.accentBorder },
    lockTitle: { fontSize: 15, lineHeight: 21, fontWeight: "900", color: palette.text, marginBottom: 6 },
    lockBody: { fontSize: 13, lineHeight: 19, fontWeight: "800", color: palette.text },
    lockSubText: { marginTop: 6, fontSize: 12, lineHeight: 18, color: palette.subtle },
    lockButton: {
      alignSelf: "flex-start",
      marginTop: 10,
      borderRadius: 999,
      backgroundColor: palette.accent,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    lockButtonText: { color: palette.accentText, fontSize: 12, fontWeight: "900" },
  }));
}
