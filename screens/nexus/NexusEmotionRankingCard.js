import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useTheme } from "../../theme/ThemeContext";
import { makeUiTokens } from "../../ui/uiTokens";
import { applyTypographyTokens } from "../../ui/applyTypographyTokens";

export default function NexusEmotionRankingCard({ items = [], loading = false }) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Ionicons
          name="stats-chart-outline"
          size={16}
          color={colors.TITLE_GOLD}
          style={styles.headerIcon}
        />
        <Text style={styles.title}>感情ランキング</Text>
      </View>

      {loading ? (
        <Text style={styles.placeholderText}>読み込み中…</Text>
      ) : items.length <= 0 ? (
        <Text style={styles.placeholderText}>まだ表示できるランキングがありません。</Text>
      ) : (
        items.slice(0, 5).map((item, index) => (
          <View key={`${item?.label || "emotion"}-${index}`} style={styles.row}>
            <View style={styles.rankWrap}>
              <Text style={styles.rankText}>{index + 1}</Text>
            </View>
            <Text numberOfLines={1} style={styles.labelText}>
              {String(item?.label || "—")}
            </Text>
            <Text style={styles.valueText}>
              {Number.isFinite(Number(item?.value)) ? Number(item?.value) : "—"}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

function createStyles(COLORS, ui) {
  const text = ui?.text || {};
  return StyleSheet.create(applyTypographyTokens({
    card: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 14,
      paddingVertical: 14,
      marginBottom: 14,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    headerIcon: {
      marginRight: 6,
    },
    title: {
      fontSize: 14,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    placeholderText: {
      fontSize: 12,
      lineHeight: 18,
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 6,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: COLORS.CARD_BORDER,
    },
    rankWrap: {
      width: 24,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
    },
    rankText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
    },
    labelText: {
      flex: 1,
      fontSize: 13,
      color: COLORS.TEXT_ON_LIGHT,
      fontWeight: "700",
    },
    valueText: {
      fontSize: 12,
      color: text.description ?? COLORS.TEXT_SUBTLE,
      fontWeight: "700",
      marginLeft: 8,
    },
  }, ui));
}
