import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { PIECE_WIRE } from "../../lib/compat/legacyWireContracts";

function StatusRow({ styles, label, value }) {
  return (
    <View style={styles.statusRow}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.statusRowLabel}>{label}</Text>
        <View style={{ flex: 1 }} />
        <Text style={styles.statusRowValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function AccountStatusSection({
  styles,
  statusLoading,
  statusError,
  statusValue,
}) {
  return (
    <View style={styles.statusSection}>
      <Text style={styles.statusTitle}>ステータス</Text>

      {statusLoading ? (
        <ActivityIndicator style={{ marginTop: 6 }} />
      ) : (
        <View style={styles.statusCard}>
          <StatusRow
            styles={styles}
            label="ログイン日数"
            value={statusValue("login_days_total", ["loginDaysTotal"])}
          />
          <StatusRow
            styles={styles}
            label="連続ログイン日数"
            value={statusValue("login_streak_max", ["loginStreakMax", "streak_max"])}
          />
          <StatusRow
            styles={styles}
            label="入力数"
            value={statusValue("input_count_total", ["inputCountTotal"])}
          />
          <StatusRow
            styles={styles}
            label="入力文字数"
            value={statusValue("input_chars_total", ["inputCharsTotal", "input_length_total", "inputLengthTotal"])}
          />
          <StatusRow
            styles={styles}
            label="ピース生成数"
            value={statusValue("piece_generated_total", PIECE_WIRE.metrics.pieceGeneratedTotalKeys)}
          />
          <StatusRow
            styles={styles}
            label="ピースが共鳴された数"
            value={statusValue("piece_resonances_total", PIECE_WIRE.metrics.pieceResonancesTotalKeys)}
          />
        </View>
      )}

      {statusError ? (
        <Text style={styles.statusErrorText}>取得エラー: {statusError}</Text>
      ) : null}
    </View>
  );
}
