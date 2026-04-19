import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonPressable from "../../components/CocolonPressable";
import { ScreenUnreadBadge } from "../../components/UnreadBadge";
import { useTheme } from "../../theme/ThemeContext";
import { makeUiTokens } from "../../ui/uiTokens";
import { applyTypographyTokens } from "../../ui/applyTypographyTokens";

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

export default function NexusReflectionCard({ item, onPress, onPressOwner }) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);

  const ownerName = String(item?.owner?.display_name || item?.owner?.friend_code || "ユーザー").trim();
  const createdAt = formatDateLabel(item?.created_at);
  const body = String(item?.body || "").trim();
  const title = String(item?.question?.title || "").trim();
  const isNew = item?.viewer_state?.is_new === true;

  return (
    <CocolonPressable style={styles.card} onPress={onPress}>
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

      <Text style={styles.bodyLabel}>Piece</Text>
      <Text style={styles.bodyText}>{body || "—"}</Text>

      <View style={styles.metricsRow}>
        <View style={styles.metricChip}>
          <Ionicons name="eye-outline" size={14} color={colors.TEXT_SUBTLE} style={styles.metricIcon} />
          <Text style={styles.metricText}>{Number(item?.metrics?.views || 0)}</Text>
        </View>
        <View style={styles.metricChip}>
          <Ionicons name="heart-outline" size={14} color={colors.TEXT_SUBTLE} style={styles.metricIcon} />
          <Text style={styles.metricText}>{Number(item?.metrics?.resonances || 0)}</Text>
        </View>
      </View>
    </CocolonPressable>
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
      marginTop: 12,
      flexWrap: "wrap",
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
      marginBottom: 6,
    },
    metricIcon: {
      marginRight: 4,
    },
    metricText: {
      fontSize: 12,
      color: text.description ?? COLORS.TEXT_ON_LIGHT,
      fontWeight: "700",
    },
  }, ui));
}
