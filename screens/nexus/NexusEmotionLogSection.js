import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { STRENGTH_LABEL, emotionTint } from "./nexusNormalize";

export default function NexusEmotionLogSection({ emotionLogState, styles, colors, ui }) {
  if (emotionLogState.loading) {
    return <ActivityIndicator style={styles.loader} color={colors.TITLE_GOLD} />;
  }
  if (emotionLogState.error) {
    return <Text style={styles.errorText}>{emotionLogState.error}</Text>;
  }
  if (!emotionLogState.items.length) {
    return <Text style={styles.emptyText}>感情通知はまだありません。</Text>;
  }
  return (
    <View style={styles.emotionLogCard}>
      {emotionLogState.items.map((row, rowIndex) => (
        <React.Fragment key={row.id}>
          <View style={styles.emotionLogRow}>
            <View style={styles.emotionLogHeaderRow}>
              <Text style={styles.emotionLogName}>{row.ownerName}</Text>
              <Text style={styles.emotionLogTime}>{row.timeLabel}</Text>
            </View>
            <View style={styles.emotionLogBadgeArea}>
              {(row.items || []).length === 0 ? (
                <Text style={styles.emotionLogNoEmotion}>まだ感情が選択されていません</Text>
              ) : (
                <View style={styles.emotionLogBadgeRow}>
                  {(row.items || []).map((item, itemIndex) => {
                    const type = String(item?.type || "").trim() || "感情";
                    const strengthKey = String(item?.strength || "").trim();
                    const labelStrength = STRENGTH_LABEL[strengthKey] || "";
                    const tint = emotionTint(type, ui?.text?.description ?? colors.TEXT_SUBTLE);
                    return (
                      <View key={`${type}-${strengthKey}-${itemIndex}`} style={[styles.emotionLogBadge, { backgroundColor: tint.bg }]}>
                        <Text style={[styles.emotionLogBadgeText, { color: tint.text }]}>
                          {type}{labelStrength ? `（${labelStrength}）` : ""}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
          {rowIndex < emotionLogState.items.length - 1 ? <View style={styles.emotionLogSeparator} /> : null}
        </React.Fragment>
      ))}
    </View>
  );
}
