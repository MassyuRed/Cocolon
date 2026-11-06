import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { applyTypographyTokens } from "../../ui/applyTypographyTokens";
import { DARK_GRAY_DESC, makeUiTokens } from "../../ui/uiTokens";
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
  const readableDescription = colors?.TEXT_SUBTLE || DARK_GRAY_DESC;
  return {
    cardBg: colors?.FIELD_BG || (isDark ? "#111827" : "#FFFFFF"),
    mutedBg: colors?.BG_SILVER || (isDark ? "#1F2937" : "#F9FAFB"),
    softBg: colors?.SURFACE_TONAL || colors?.PANEL_BG,
    onSoftBg: colors?.ON_SURFACE_TONAL || colors?.TEXT_ON_LIGHT,
    border: colors?.CARD_BORDER || (isDark ? "#374151" : "#E5E7EB"),
    text: colors?.TEXT_ON_LIGHT || (isDark ? "#F9FAFB" : "#111827"),
    subtle: readableDescription || (isDark ? "#9CA3AF" : DARK_GRAY_DESC),
    accent: colors?.TITLE_GOLD || "#694775",
    buttonBg: colors?.GOLD_BUTTON || "#694775",
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
  showPlanNotice = true,
}) {
  const palette = useMemo(() => buildPalette(colors, isDark), [colors, isDark]);
  const ui = useMemo(() => makeUiTokens(colors || {}, isDark ? 'dark' : 'default'), [colors, isDark]);
  const localStyles = useMemo(() => createStyles(palette, ui), [palette, ui]);
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

      {showPlanNotice && shouldShowLock ? (
        <LockedSectionCard payload={payload} localStyles={localStyles} onUpgradePress={onUpgradePress} />
      ) : null}
    </View>
  );
}

function createStyles(palette, ui) {
  return StyleSheet.create(applyTypographyTokens({
    root: {
      marginBottom: 16,
      width: '100%',
      maxWidth: 640,
      alignSelf: 'center',
    },
    badgeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: 0,
      marginBottom: 12,
      flexWrap: 'wrap',
      gap: 8,
    },
    badgeText: {
      color: palette.accent,
      letterSpacing: 0,
    },
    modeBadge: {
      overflow: "hidden",
      borderRadius: 999,
      borderWidth: 1,
      borderColor: palette.border,
      paddingHorizontal: 10,
      paddingVertical: 6,
      color: palette.subtle,
      backgroundColor: palette.mutedBg,
    },
    card: {
      marginHorizontal: 0,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: palette.border,
      borderRadius: 24,
      backgroundColor: palette.cardBg,
      padding: 20,
    },
    overviewCard: {
      borderColor: palette.border,
    },
    sectionHeader: {
      marginBottom: 12,
    },
    sectionTitle: {
      color: palette.text,
      letterSpacing: 0,
    },
    sectionSubtitle: {
      marginTop: 6,
      color: palette.subtle,
    },
    explainText: {
      color: palette.text,
      marginBottom: 16,
    },
    summaryText: {
      color: palette.text,
      marginBottom: 16,
    },
    bodyText: {
      color: palette.text,
      marginBottom: 16,
    },
    infoPanel: {
      borderRadius: 16,
      backgroundColor: palette.mutedBg,
      padding: 16,
    },
    infoRow: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      paddingVertical: 8,
      gap: 6,
    },
    infoLabel: {
      color: palette.subtle,
    },
    infoValue: {
      color: palette.text,
      textAlign: 'left',
      alignSelf: 'stretch',
    },
    roleSwitchCard: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.mutedBg,
      padding: 16,
      marginTop: 12,
    },
    roleSwitchTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
      flexWrap: 'wrap',
      gap: 8,
    },
    contextChip: {
      alignSelf: "flex-start",
      borderRadius: 999,
      backgroundColor: palette.softBg,
      borderWidth: 1,
      borderColor: palette.border,
      paddingHorizontal: 12,
      paddingVertical: 6,
      maxWidth: '100%',
    },
    contextChipText: {
      color: palette.onSoftBg,
      flexShrink: 1,
    },
    dotsText: { fontSize: 13, fontWeight: "900", color: palette.accent },
    roleSwitchTitle: {
      color: palette.text,
      marginBottom: 8,
    },
    roleSwitchBody: {
      color: palette.text,
    },
    roleSwitchPreview: {
      marginTop: 10,
      color: palette.subtle,
    },
    safeNote: {
      marginTop: 12,
      color: palette.subtle,
    },
    routeCard: {
      borderRadius: 16,
      backgroundColor: palette.mutedBg,
      padding: 16,
      marginTop: 12,
    },
    routeTitle: {
      color: palette.text,
      marginBottom: 12,
    },
    routeStepRow: { flexDirection: "row", alignItems: "stretch" },
    routeStepMarkerColumn: {
      width: 24,
      alignItems: "center",
    },
    routeStepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: palette.accent, marginTop: 5 },
    routeStepLine: { width: 1, flex: 1, backgroundColor: palette.border, marginTop: 2, marginBottom: 2 },
    routeStepTextColumn: {
      flex: 1,
      paddingBottom: 16,
      minWidth: 0,
    },
    routeStepLabel: {
      color: palette.subtle,
    },
    routeStepText: {
      color: palette.text,
      marginTop: 6,
    },
    crossroadCard: {
      borderRadius: 16,
      backgroundColor: palette.mutedBg,
      padding: 16,
      marginTop: 12,
    },
    crossroadContext: {
      color: palette.text,
      marginBottom: 12,
    },
    axisRow: {
      flexDirection: 'column',
      marginHorizontal: 0,
      gap: 8,
    },
    axisBlock: {
      marginHorizontal: 0,
      borderWidth: 1,
      borderColor: palette.border,
      borderRadius: 16,
      padding: 12,
      backgroundColor: palette.cardBg,
      alignSelf: 'stretch',
    },
    axisLabel: {
      color: palette.subtle,
      marginBottom: 6,
    },
    axisValue: {
      color: palette.text,
    },
    crossroadNote: {
      marginTop: 12,
      color: palette.subtle,
    },
    unknownCard: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.mutedBg,
      padding: 16,
      marginTop: 12,
    },
    unknownTitle: {
      color: palette.text,
      marginBottom: 8,
    },
    unknownReason: {
      color: palette.subtle,
    },
    unknownHint: {
      marginTop: 10,
      color: palette.text,
    },
    lockCard: {
      backgroundColor: palette.softBg,
      borderColor: palette.border,
    },
    lockTitle: {
      color: palette.text,
      marginBottom: 8,
    },
    lockBody: {
      color: palette.text,
    },
    lockSubText: {
      marginTop: 10,
      color: palette.subtle,
    },
    lockButton: {
      alignSelf: "flex-start",
      marginTop: 16,
      borderRadius: 24,
      backgroundColor: palette.buttonBg,
      paddingHorizontal: 16,
      paddingVertical: 12,
      minHeight: 44,
      justifyContent: 'center',
    },
    lockButtonText: {
      color: palette.accentText,
      textAlign: 'center',
    },
  }, ui, {"badgeText":"meta","modeBadge":"meta","sectionTitle":"sectionTitle","sectionSubtitle":"description","explainText":"body","summaryText":"body","bodyText":"body","infoLabel":"description","infoValue":"body","contextChipText":"description","roleSwitchTitle":"sectionTitle","roleSwitchBody":"body","roleSwitchPreview":"body","safeNote":"description","routeTitle":"sectionTitle","routeStepLabel":"description","routeStepText":"body","crossroadContext":"sectionTitle","axisLabel":"description","axisValue":"body","crossroadNote":"body","unknownTitle":"sectionTitle","unknownReason":"body","unknownHint":"description","lockTitle":"sectionTitle","lockBody":"body","lockSubText":"description","lockButtonText":"button"}));
}
