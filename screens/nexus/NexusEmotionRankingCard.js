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
            <Text style={styles.labelText}>
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
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    headerIcon: {
      marginRight: 6,
    },
    title: {
      color: COLORS.TEXT_ON_LIGHT,
    },
    placeholderText: {
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },
    row: {
      flexDirection: "row",
      alignItems: 'flex-start',
      paddingVertical: 10,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: COLORS.CARD_BORDER,
    },
    rankWrap: {
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
      minWidth: 24,
      paddingTop: 3,
    },
    rankText: {
      color: COLORS.TITLE_GOLD,
    },
    labelText: {
      flex: 1,
      color: COLORS.TEXT_ON_LIGHT,
      minWidth: 0,
    },
    valueText: {
      color: text.description ?? COLORS.TEXT_SUBTLE,
      marginLeft: 8,
      flexShrink: 1,
      textAlign: 'right',
    },
  }, ui, {"title":"sectionTitle","placeholderText":"description","rankText":"meta","labelText":"body","valueText":"body"}));
}
