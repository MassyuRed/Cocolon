import React, { useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationOn, setIsNotificationOn] = useState(true);
  const [isMemoShareOn, setIsMemoShareOn] = useState(false);

  const handleExport = () => {
    Alert.alert("データエクスポート", "CSV/Excelで保存する機能は後で追加予定です📂");
  };

  const handleReset = () => {
    Alert.alert("データリセット", "本当に全データを削除しますか？", [
      { text: "キャンセル", style: "cancel" },
      { text: "削除する", style: "destructive", onPress: () => console.log("データ削除実行") },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 全体を少し縮小 */}
      <View style={styles.scaleWrapper}>
        <Text style={styles.title}>設定</Text>

        <View style={styles.row}>
          <Text style={styles.label}>ダークモード</Text>
          <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>通知</Text>
          <Switch value={isNotificationOn} onValueChange={setIsNotificationOn} />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>メモの共有</Text>
          <Switch value={isMemoShareOn} onValueChange={setIsMemoShareOn} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleExport}>
          <Text style={styles.buttonText}>データをエクスポート</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
          <Text style={styles.buttonText}>全データをリセット</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",  // 中央寄せ
  },
  scaleWrapper: {
    transform: [{ scale: 0.9 }], // ← 全体を縮小
    width: "95%", // ← 横幅も少し余白
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
  },
  button: {
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  resetButton: {
    backgroundColor: "#EF4444",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
