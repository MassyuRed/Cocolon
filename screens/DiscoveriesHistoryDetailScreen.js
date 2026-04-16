import React, { useMemo } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import CocolonBackButton from "../components/CocolonBackButton";

export default function DiscoveriesHistoryDetailScreen({ navigation }) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = String(themeName || "").toLowerCase() === "dark";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <View style={styles.headerSide}>
            <CocolonBackButton
              navigation={navigation}
              fallbackRouteName="MyModel"
              accessibilityLabel="MyModelに戻る"
            />
          </View>

          <View style={styles.headerCenter}>
            <Text style={styles.titleText}>発見履歴</Text>
          </View>

          <View style={styles.headerSide} />
        </View>

        <View style={styles.messageCard}>
          <Text style={styles.messageTitle}>発見詳細は提供していません</Text>
          <Text style={styles.messageText}>
            発見機能は廃止済みです。{"\n"}
            Reflectionの閲覧と履歴確認は、共鳴導線に統一されています。
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function createStyles(COLORS, ui) {
  const font = ui?.font || {};
  const text = ui?.text || {};
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.PANEL_BG },
    body: { flex: 1, paddingTop: 16, paddingHorizontal: 18, paddingBottom: 18 },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14,
    },
    headerSide: {
      width: 34,
      alignItems: "flex-start",
      justifyContent: "center",
    },
    headerCenter: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    titleText: {
      fontSize: font.title ?? 20,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      letterSpacing: 0.8,
    },
    messageCard: {
      borderRadius: ui?.radius?.md ?? 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    messageTitle: {
      fontSize: font.body ?? 14,
      fontWeight: "800",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginBottom: 8,
    },
    messageText: {
      fontSize: font.body ?? 14,
      lineHeight: 20,
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
  });
}
