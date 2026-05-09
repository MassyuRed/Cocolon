import React from "react";
import { Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function NexusTodayEmotionSummary({ visible, rankingState, styles, colors }) {
  if (!visible) return null;

  return (
    <View style={styles.todayOverallEmotionSummary}>
      <View style={styles.todayOverallEmotionHeader}>
        <Ionicons
          name="stats-chart-outline"
          size={14}
          color={colors.TITLE_GOLD}
          style={styles.todayOverallEmotionIcon}
        />
        <Text style={styles.todayOverallEmotionTitle}>今日の全体感情</Text>
      </View>

      {rankingState.loading ? (
        <Text style={styles.todayOverallEmotionPlaceholder}>読み込み中…</Text>
      ) : rankingState.items.length <= 0 ? (
        <Text style={styles.todayOverallEmotionPlaceholder}>
          今日はまだ表示できる感情がありません。
        </Text>
      ) : (
        <Text style={styles.todayOverallEmotionText}>
          {rankingState.items
            .slice(0, 3)
            .map((item) => {
              const label = String(item?.label || "—").trim() || "—";
              const value = Number(item?.value);
              return `${label} ${Number.isFinite(value) ? value : "—"}`;
            })
            .join("　")}
        </Text>
      )}
    </View>
  );
}
