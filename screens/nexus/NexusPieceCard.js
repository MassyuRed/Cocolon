import React, { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonPressable from "../../components/CocolonPressable";
import { ScreenUnreadBadge } from "../../components/UnreadBadge";
import { useTheme } from "../../theme/ThemeContext";
import { makeUiTokens } from "../../ui/uiTokens";
import { applyTypographyTokens } from "../../ui/applyTypographyTokens";
import { readShareCode } from "../../lib/compat/legacyWireContracts";

function formatDateLabel(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "";
  try {
    return d.toLocaleString("ja-JP", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function readViewerState(item) {
  return (
    (item?.viewer_state && typeof item.viewer_state === "object" ? item.viewer_state : null) ||
    (item?.viewerState && typeof item.viewerState === "object" ? item.viewerState : null) ||
    {}
  );
}

export default function NexusPieceCard({
  item,
  onPressOwner,
  onPressResonance,
  canResonate = false,
  resonanceSubmitting = false,
}) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);

  const ownerName = String(item?.owner?.display_name || readShareCode(item?.owner, "") || "ユーザー").trim();
  const createdAt = formatDateLabel(item?.created_at);
  const body = String(item?.body || "").trim();
  const title = String(item?.question?.title || "").trim();
  const viewerState = readViewerState(item);
  const isNew = viewerState?.is_new === true || viewerState?.isNew === true;
  const isResonated =
    viewerState?.is_resonated === true ||
    viewerState?.isResonated === true ||
    item?.is_resonated === true ||
    item?.isResonated === true;
  const resonances = Number(item?.metrics?.resonances ?? item?.resonances ?? 0) || 0;
  const showResonanceButton = !!canResonate;
  const buttonDisabled = !!isResonated || !!resonanceSubmitting;
  const buttonLabel = isResonated ? "共鳴済み" : "共鳴";

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <CocolonPressable
          style={styles.ownerChip}
          onPress={onPressOwner}
          accessibilityLabel={`${ownerName}のアカウントを開く`}
        >
          <Ionicons
            name="person-circle-outline"
            size={16}
            color={colors.TEXT_ON_LIGHT}
            style={styles.ownerIcon}
          />
          <Text numberOfLines={1} style={styles.ownerText}>
            {ownerName}
          </Text>
        </CocolonPressable>

        <View style={styles.headerRight}>
          {createdAt ? <Text style={styles.timeText}>{createdAt}</Text> : null}
          <ScreenUnreadBadge visible={isNew} style={styles.newBadge} />
        </View>
      </View>

      <Text style={styles.questionLabel}>問い</Text>
      <Text style={styles.questionText}>{title || "—"}</Text>

      <Text style={styles.bodyLabel}>答え</Text>
      <Text style={styles.bodyText}>{body || "—"}</Text>

      <View style={styles.metricsRow}>
        <View style={styles.metricChip}>
          <Ionicons
            name={isResonated ? "heart" : "heart-outline"}
            size={14}
            color={colors.TEXT_SUBTLE}
            style={styles.metricIcon}
          />
          <Text style={styles.metricText}>{resonances}</Text>
        </View>

        {showResonanceButton ? (
          <CocolonPressable
            style={[
              styles.resonanceButton,
              isResonated && styles.resonanceButtonDone,
              buttonDisabled && styles.resonanceButtonDisabled,
            ]}
            onPress={onPressResonance}
            disabled={buttonDisabled}
            accessibilityLabel={buttonLabel}
            hitSlop={8}
          >
            {resonanceSubmitting ? (
              <ActivityIndicator size="small" color={colors.TEXT_ON_LIGHT} />
            ) : (
              <Text
                style={[
                  styles.resonanceButtonText,
                  isResonated && styles.resonanceButtonTextDone,
                ]}
              >
                {buttonLabel}
              </Text>
            )}
          </CocolonPressable>
        ) : null}
      </View>
    </View>
  );
}

function createStyles(COLORS, ui) {
  const font = ui?.font || {};
  const text = ui?.text || {};
  return StyleSheet.create(applyTypographyTokens({
    card: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 14,
      paddingVertical: 14,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    ownerChip: {
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 1,
      paddingRight: 8,
    },
    ownerIcon: {
      marginRight: 6,
    },
    ownerText: {
      fontSize: 13,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      maxWidth: 180,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    timeText: {
      fontSize: 11,
      color: COLORS.TEXT_SUBTLE,
      marginRight: 8,
    },
    newBadge: {
      marginLeft: 8,
    },
    questionLabel: {
      fontSize: 11,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      marginBottom: 4,
    },
    questionText: {
      fontSize: 15,
      lineHeight: 23,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 10,
    },
    bodyLabel: {
      fontSize: 11,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      marginBottom: 4,
    },
    bodyText: {
      fontSize: 14,
      lineHeight: 23,
      color: COLORS.TEXT_ON_LIGHT,
    },
    metricsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 12,
    },
    metricChip: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor: COLORS.PANEL_BG,
      marginRight: 8,
    },
    metricIcon: {
      marginRight: 4,
    },
    metricText: {
      fontSize: 12,
      color: text.description ?? COLORS.TEXT_ON_LIGHT,
      fontWeight: "700",
    },
    resonanceButton: {
      minWidth: 74,
      minHeight: 34,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      paddingHorizontal: 14,
      paddingVertical: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    resonanceButtonDone: {
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
    },
    resonanceButtonDisabled: {
      opacity: 0.72,
    },
    resonanceButtonText: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: "900",
      color: COLORS.ACCENT_TEXT,
    },
    resonanceButtonTextDone: {
      color: COLORS.TEXT_SUBTLE,
    },
  }, ui));
}
