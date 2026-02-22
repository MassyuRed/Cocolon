import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";

import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";

// UI (Design System)
import CocolonBackButton from "../components/CocolonBackButton";

/**
 * CocolonGuideScreen
 * ------------------
 * Phase 1 (Test build):
 * - Full-screen guide screen (new route)
 * - Quick/Detail tab UI
 * - Quick only (Detail shows "準備中")
 *
 * Navigation:
 *   navigation.navigate("CocolonGuide", { screenId: "home" })
 *
 * NOTE:
 * - For now, guide content is hard-coded (no JSON yet).
 * - Later phases can swap getGuideContent() to JSON-backed data.
 */

function normalizeScreenId(raw) {
  const s = String(raw || "").trim();
  if (!s) return "unknown";

  const lower = s.toLowerCase();

  // Common aliases / route names
  if (lower === "home" || lower === "input" || lower.includes("input")) return "home";
  if (lower === "myweb" || lower.includes("myweb")) return "myweb";
  if (lower === "mymodel" || lower.includes("mymodel")) return "mymodel";
  if (lower === "friend" || lower === "friends" || lower.includes("friend")) return "friend";

  return lower;
}

function getGuideContent(screenIdNorm) {
  const map = {
    home: {
      title: "Home",
      quick:
        "ここは今の気持ちを入力する場所です。感情を選び、必要ならメモを書いて送信すると、後から振り返りや分析に使えます。",
    },
    myweb: {
      title: "MyWeb",
      quick:
        "ここでは感情の履歴や分析レポートを確認できます。見たい項目を選ぶと、履歴・週/月レポートなどの詳細画面に移動します。",
    },
    mymodel: {
      title: "MyModel",
      quick:
        "ここではMyModelの機能を使って自己理解を深めます。おすすめの探索やReflections、履歴の入口から各機能へ進めます。",
    },
    friend: {
      title: "Friend",
      quick:
        "ここではフレンドの感情ログを見たり、フレンド管理を行えます。右上から更新やフレンド申請・承認などの管理に進めます。",
    },
    unknown: {
      title: "ガイド",
      quick:
        "この画面のガイドは準備中です。今後のアップデートで内容を追加します。",
    },
  };

  return map[screenIdNorm] || {
    title: "ガイド",
    quick:
      "この画面のガイドは準備中です。今後のアップデートで内容を追加します。",
  };
}

export default function CocolonGuideScreen({ route } = {}) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";

  const rawScreenId = route?.params?.screenId || route?.params?.screen_id || "";
  const screenId = useMemo(() => normalizeScreenId(rawScreenId), [rawScreenId]);
  const content = useMemo(() => getGuideContent(screenId), [screenId]);

  // "quick" | "detail"
  const [mode, setMode] = useState("quick");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />

      {/* Header */}
      <View style={styles.headerRow}>
        <CocolonBackButton
          style={styles.backBtn}
          fallbackRouteName="Input"
          accessibilityLabel="戻る"
        />
        <Text style={styles.headerTitle} numberOfLines={1}>
          EmlisGuide
        </Text>
        {/* Right spacer to keep title centered */}
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Target */}
        <View style={styles.targetRow}>
          <View style={styles.targetPill}>
            <Text style={styles.targetPillText} numberOfLines={1}>
              {content?.title || "ガイド"}
            </Text>
          </View>
          <Text style={styles.targetHint} numberOfLines={2}>
            この画面の使い方を確認できます
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          <Pressable
            onPress={() => setMode("quick")}
            accessibilityRole="button"
            accessibilityLabel="簡易表示"
            style={({ pressed }) => [
              styles.tabPill,
              styles.tabPillLeft,
              mode === "quick" && styles.tabPillActive,
              pressed && styles.tabPillPressed,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                mode === "quick" && styles.tabTextActive,
              ]}
              numberOfLines={1}
            >
              簡易表示
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setMode("detail")}
            accessibilityRole="button"
            accessibilityLabel="詳細表示"
            style={({ pressed }) => [
              styles.tabPill,
              mode === "detail" && styles.tabPillActive,
              pressed && styles.tabPillPressed,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                mode === "detail" && styles.tabTextActive,
              ]}
              numberOfLines={1}
            >
              詳細表示
            </Text>
          </Pressable>
        </View>

        {/* Body */}
        <View style={styles.card}>
          {mode === "quick" ? (
            <>
              <Text style={styles.sectionTitle}>この画面について</Text>
              <Text style={styles.bodyText}>{content?.quick || ""}</Text>
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>詳細ガイド（準備中）</Text>
              <Text style={styles.bodyText}>
                詳細ガイドは現在準備中です。{"\n"}
                正式リリースまでに内容を追加します。
              </Text>
            </>
          )}
        </View>

        <Text style={styles.noteText}>
          ※ 今回のテスト版では「簡易」のみを先行実装しています。
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(COLORS, ui) {
  const font = ui?.font || {};
  const text = ui?.text || {};

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.PANEL_BG,
    },

    headerRow: {
      paddingHorizontal: 18,
      paddingTop: 10,
      paddingBottom: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    backBtn: {
      width: 32,
    },
    headerTitle: {
      flex: 1,
      textAlign: "center",
      fontSize: 15,
      fontWeight: "900",
      color: COLORS.TITLE_GOLD,
      letterSpacing: 0.6,
    },
    headerRightSpacer: {
      width: 32,
    },

    scrollContainer: {
      paddingHorizontal: 18,
      paddingBottom: 28,
      paddingTop: 10,
      alignItems: "stretch",
    },

    targetRow: {
      marginBottom: 12,
    },
    targetPill: {
      alignSelf: "flex-start",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    targetPillText: {
      fontSize: 12,
      fontWeight: "900",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    targetHint: {
      marginTop: 8,
      fontSize: font.description ?? 10,
      lineHeight: 16,
      color: text.description ?? COLORS.TEXT_SUBTLE,
      opacity: 0.9,
    },

    tabsRow: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      marginBottom: 12,
    },
    tabPill: {
      flex: 1,
      minHeight: 42,
      paddingVertical: 11,
      paddingHorizontal: 12,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      alignItems: "center",
      justifyContent: "center",
    },
    tabPillLeft: {
      marginRight: 10,
    },
    tabPillPressed: {
      opacity: 0.85,
    },
    tabPillActive: {
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
    },
    tabText: {
      fontSize: 13,
      fontWeight: "900",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    tabTextActive: {
      color: "#FFFFFF",
    },

    card: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 14,
      paddingVertical: 14,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
      elevation: 4,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: "900",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginBottom: 8,
    },
    bodyText: {
      fontSize: font.body ?? 13,
      lineHeight: 20,
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      opacity: 0.95,
    },

    noteText: {
      marginTop: 12,
      fontSize: font.description ?? 10,
      lineHeight: 16,
      color: text.description ?? COLORS.TEXT_SUBTLE,
      opacity: 0.85,
    },
  });
}
