import React, { useState, useMemo } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

// 🎨 テーマコンテキスト
import {
  useTheme,
  THEME_VARIANTS,
  THEME_LABELS_JA,
} from "../theme/ThemeContext";

// ここを変えると Setting のパネル高さを調整できる
// ※ 本改修で「背景＆タイトル固定 / パネル内スクロール」に変更したため、
//    minHeight は見た目の基準として残しつつ、パネル自体は flex で収まるようにしています。
const PANEL_MIN_HEIGHT = 690;

export default function SettingsScreen() {
  const { colors, themeName, setThemeName } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [isNotificationOn, setIsNotificationOn] = useState(true);
  const [isMemoShareOn, setIsMemoShareOn] = useState(false);

  const handleExport = () => {
    Alert.alert(
      "データエクスポート",
      "CSV/Excelで保存する機能は後で追加予定です📂"
    );
  };

  const handleReset = () => {
    Alert.alert("データリセット", "本当に全データを削除しますか？", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除する",
        style: "destructive",
        onPress: () => console.log("データ削除実行"),
      },
    ]);
  };

  const isDark = themeName === THEME_VARIANTS.DARK;

  // テーマ選択肢（key は内部値、ラベルは ThemeContext 側で集約管理）
  const themeOptions = [
    { key: THEME_VARIANTS.DEFAULT },
    { key: THEME_VARIANTS.LIGHT },
    { key: THEME_VARIANTS.DARK },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />

      {/* 画面全体は固定（背景＆タイトル固定） */}
      <View style={styles.screenContainer}>
        {/* ブランドヘッダー（全画面共通） */}
        <View style={styles.appTitleWrapper}>
          <Text style={styles.appTitleText}>Emlis</Text>
          <Text style={styles.appSubtitleText}>
            ～Emotion Limbic Internal Structure～
          </Text>
        </View>

        {/* メインパネル（パネル内でスクロール） */}
        <View style={styles.panel}>
          {/* パネルヘッダー */}
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Setting</Text>
          </View>

          <ScrollView
            style={styles.panelScroll}
            contentContainerStyle={styles.panelScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* カラーテーマ */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>カラーテーマ</Text>
              <View style={styles.themeRow}>
                {themeOptions.map((opt) => {
                  const active = themeName === opt.key;
                  const label = THEME_LABELS_JA[opt.key] ?? opt.key;
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      style={[styles.themeChip, active && styles.themeChipActive]}
                      onPress={() => setThemeName(opt.key)}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.themeChipLabel,
                          active && styles.themeChipLabelActive,
                        ]}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 環境設定セクション */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>環境設定</Text>
              <View style={styles.card}>
                <Row
                  styles={styles}
                  colors={colors}
                  icon="notifications-outline"
                  label="通知"
                  control={
                    <Switch
                      value={isNotificationOn}
                      onValueChange={setIsNotificationOn}
                      trackColor={{ false: "#CBD5E1", true: "#C7D2FE" }}
                      thumbColor={
                        isNotificationOn ? colors.GOLD_BUTTON : "#FFFFFF"
                      }
                    />
                  }
                />
                <Divider styles={styles} />
                <Row
                  styles={styles}
                  colors={colors}
                  icon="share-social-outline"
                  label="メモの共有"
                  control={
                    <Switch
                      value={isMemoShareOn}
                      onValueChange={setIsMemoShareOn}
                      trackColor={{ false: "#CBD5E1", true: "#C7D2FE" }}
                      thumbColor={
                        isMemoShareOn ? colors.GOLD_BUTTON : "#FFFFFF"
                      }
                    />
                  }
                />
              </View>
            </View>

            {/* データ関連アクション */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>データ</Text>
              <View style={styles.actionsColumn}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.goldButton]}
                  onPress={handleExport}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name="download-outline"
                    size={18}
                    color={colors.TEXT_ON_LIGHT}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.goldButtonText}>
                    データをエクスポート
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.dangerButton]}
                  onPress={handleReset}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color="#fff"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.dangerButtonText}>
                    全データをリセット
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Row({ icon, label, control, styles, colors }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIconWrap}>
          <Ionicons name={icon} size={18} color={colors.GOLD_BUTTON} />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <View style={{ transform: [{ scale: 0.95 }] }}>{control}</View>
    </View>
  );
}

function Divider({ styles }) {
  return <View style={styles.divider} />;
}

function createStyles(COLORS) {
  const TEXT_SUB = COLORS.TEXT_ON_LIGHT;

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.BG_SILVER,
    },

    // 画面全体（固定）
    screenContainer: {
      flex: 1,
      paddingTop: 16,
      paddingBottom: 16,
      alignItems: "center",
    },

    // Emlis ヘッダー
    appTitleWrapper: {
      alignItems: "center",
      marginBottom: 14,
    },
    appTitleText: {
      fontFamily: "CormorantGaramond-Bold",
      fontSize: 24,
      color: COLORS.BRAND_GOLD,
      letterSpacing: 1.2,
    },
    appSubtitleText: {
      fontFamily: "CormorantGaramond-Regular",
      marginTop: 4,
      fontSize: 11,
      color: COLORS.BRAND_GOLD,
      letterSpacing: 0.8,
    },

    // メインパネル（内部スクロール）
    panel: {
      width: "94%",
      flex: 1,
      minHeight: 0,
      backgroundColor: COLORS.PANEL_BG,
      borderRadius: 26,
      borderWidth: 2,
      borderColor: COLORS.BORDER_GOLD,
      paddingHorizontal: 18,
      paddingVertical: 20,
      shadowColor: "#000",
      shadowOpacity: 0.24,
      shadowRadius: 26,
      shadowOffset: { width: 0, height: 16 },
      elevation: 12,
    },

    panelHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    panelTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      letterSpacing: 0.8,
    },

    panelScroll: {
      flex: 1,
    },
    panelScrollContent: {
      paddingBottom: 18,
    },

    section: {
      marginBottom: 18,
    },
    sectionLabel: {
      fontSize: 12,
      color: COLORS.TEXT_SUBTLE,
      marginBottom: 8,
    },

    // テーマ選択（縦に3つ並べる）
    themeRow: {
      marginTop: 4,
    },
    themeChip: {
      width: "100%",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    themeChipActive: {
      backgroundColor: COLORS.GOLD_BUTTON,
    },
    themeChipLabel: {
      fontSize: 12,
      color: COLORS.TEXT_ON_LIGHT,
      textAlign: "center",
    },
    // アクティブ時は常に ACCENT_TEXT（＝白）で塗る
    themeChipLabelActive: {
      color: COLORS.ACCENT_TEXT,
      fontWeight: "700",
    },

    // カード（スイッチ群）
    card: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      paddingHorizontal: 10,
      paddingVertical: 6,
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
    },
    rowLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    rowIconWrap: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: "#EEF2FF",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
    },
    rowLabel: {
      color: TEXT_SUB,
      fontSize: 15,
      fontWeight: "700",
    },
    divider: {
      height: 1,
      backgroundColor: "#F1F5F9",
    },

    // アクションボタン群
    actionsColumn: {
      marginTop: 4,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      borderRadius: 999,
      marginTop: 8,
      elevation: 4,
      shadowColor: "#000",
      shadowOpacity: 0.12,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      borderWidth: 1,
    },
    goldButton: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    dangerButton: {
      backgroundColor: "#EF4444",
      borderColor: "#B91C1C",
    },
    goldButtonText: {
      color: COLORS.TEXT_ON_LIGHT,
      fontWeight: "800",
      fontSize: 15,
    },
    dangerButtonText: {
      color: "#fff",
      fontWeight: "800",
      fontSize: 15,
    },
  });
}
