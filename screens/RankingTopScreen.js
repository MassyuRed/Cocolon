import React, { useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useTheme } from "../theme/ThemeContext";

// UI (Design System)
import CocolonPressable from "../components/CocolonPressable";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";

/**
 * RankingTopScreen
 * - ランキング機能の入口（TOP）
 * - 各ランキングページへ遷移するボタンを配置
 */
export default function RankingTopScreen({ navigation }) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";

  const handlePressGuide = () => {
    try {
      navigation?.navigate?.("CocolonGuide", { screenId: "RankingTopScreen" });
    } catch {
      // noop
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.panelHeader}>
          <View style={styles.panelTitleRow}>
            <Text style={styles.panelTitle}>Ranking</Text>
            <CocolonPressable
              style={styles.guideTitleButton}
              onPress={handlePressGuide}
              accessibilityLabel="ガイドを開く"
            >
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={colors.TEXT_ON_LIGHT}
              />
            </CocolonPressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { fontWeight: "700" }]}>ランキング一覧</Text>

          <Text style={[styles.sectionLabel, { fontWeight: "800", marginTop: 12 }]}>個人ユーザー</Text>

          <QuickLink
            styles={styles}
            colors={colors}
            icon="flame-outline"
            label="連続ログイン日数ランキング"
            subtitle="連続ログイン日数"
            onPress={() => navigation?.navigate?.("RankingLoginStreak")}
          />

          <QuickLink
            styles={styles}
            colors={colors}
            icon="create-outline"
            label="入力数ランキング"
            subtitle="全入力回数"
            onPress={() => navigation?.navigate?.("RankingInputCount")}
          />

          <QuickLink
            styles={styles}
            colors={colors}
            icon="chatbox-ellipses-outline"
            label="入力文字数ランキング"
            subtitle="全入力文字数"
            onPress={() => navigation?.navigate?.("RankingInputLength")}
          />

          <Text style={[styles.sectionLabel, { fontWeight: "800", marginTop: 18 }]}>Piece</Text>

          <QuickLink
            styles={styles}
            colors={colors}
            icon="help-circle-outline"
            label="Pieceランキング"
            subtitle="Pieceの所持数"
            onPress={() => navigation?.navigate?.("RankingMyModelQuestions")}
          />


          <QuickLink
            styles={styles}
            colors={colors}
            icon="heart-outline"
            label="共鳴数ランキング"
            subtitle="Pieceが共鳴された回数"
            onPress={() => navigation?.navigate?.("RankingMyModelResonances")}
          />
        

          <QuickLink
            styles={styles}
            colors={colors}
            icon="bulb-outline"
            label="発見数ランキング"
            subtitle="Pieceが発見された回数"
            onPress={() => navigation?.navigate?.("RankingMyModelDiscoveries")}
          />
</View>

        <View style={styles.noteCard}>
          <Ionicons name="information-circle-outline" size={16} color={colors.TEXT_SUBTLE} />
          <Text style={styles.noteText}>
            集計の区切りは日本時間（JST）0:00です。
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickLink({ styles, colors, icon, label, subtitle, onPress }) {
  return (
    <CocolonPressable
      style={styles.linkItem}
      onPress={onPress}
    >
      <View style={styles.linkInner}>
        <View style={styles.linkIconWrap}>
          <Ionicons name={icon} size={22} color={colors.TEXT_ON_LIGHT} />
        </View>

        <View style={styles.linkTextWrap}>
          <Text numberOfLines={1} style={styles.linkLabel}>
            {label}
          </Text>
          {subtitle ? (
            <Text numberOfLines={2} style={styles.linkSubtitle}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.TEXT_SUBTLE}
        />
      </View>
    </CocolonPressable>
  );
}

function createStyles(COLORS, ui) {
  const font = ui?.font || {};
  const text = ui?.text || {};

  return StyleSheet.create(applyTypographyTokens({
    container: { flex: 1, backgroundColor: COLORS.PANEL_BG },
    scrollContainer: {
      paddingTop: 16,
      paddingBottom: 32,
      alignItems: "stretch",
      paddingHorizontal: 18,
    },
    panelHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    panelTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      letterSpacing: 0.8,
    },
    panelTitleRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    guideTitleButton: {
      width: 36,
      height: 32,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      marginLeft: 10,
    },
    backBtn: {
      width: 54,
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 4,
    },
    backText: {
      marginLeft: 2,
      fontSize: 12,
      color: COLORS.TEXT_SUBTLE,
      fontWeight: "600",
    },
    section: { marginTop: 6 },
    sectionLabel: {
      fontSize: font.sectionLabel ?? 12,
      color: text.sectionLabel ?? text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginBottom: 10,
    },

    linkItem: { marginBottom: 10 },
    linkInner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 14,
      paddingVertical: 14,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    linkIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
      backgroundColor: COLORS.PANEL_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
    },
    linkTextWrap: { flex: 1 },
    linkLabel: {
      fontSize: 13,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },
    linkSubtitle: {
      marginTop: 2,
      fontSize: font.description ?? 9,
      lineHeight: 15,
      color: text.description ?? COLORS.TEXT_ON_LIGHT,
    },

    noteCard: {
      marginTop: 6,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    noteText: {
      marginLeft: 8,
      fontSize: font.description ?? 9,
      color: text.description ?? COLORS.TEXT_ON_LIGHT,
      flex: 1,
    },
  }, ui));
}
