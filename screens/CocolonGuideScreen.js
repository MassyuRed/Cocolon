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
  if (lower === "ranking" || lower.includes("ranking")) return "ranking";

  return lower;
}

function getGuideContent(screenIdNorm) {
  const map = {
    home: {
      title: "Home",
      quick:
        "こちらは「感情入力」を行う画面です。\n\n今感じた気持ちを、そのまま選んで記録できます。\n日記のように使うこともできますが、\nおすすめは「感情に気づいた瞬間に入力する」使い方です。\n\nSNSのような感覚で、こまめに入力してみてください。\n\n「自己理解モード」は、\n気づきや発見を整理したいときや、\n自分について能動的に言葉を残したいときに使います。\n「自己理解モード」はメモ入力が必須で、感情選択はできません。\n\nまた、Homeから移動できる「アカウントページ」では、\nアカウント設定やステータス確認ができます。\nご確認ください。",
    },
    myweb: {
      title: "MyWeb",
      quick:
        "こちらは、入力した自己情報や感情の履歴を確認する画面です。\n\nこれまでに入力した情報の検索や確認ができるほか、\n入力内容をもとに作成された「分析レポート」を見ることができます。\n\n「自己分析レポート」は日々の感情入力をメモ無しで行なっていても作成はされますが、\nメモを入力することで内容が詳細化します。\n\n履歴には「感情入力履歴」と「今日の問い履歴」があり、\n「感情入力履歴」では、検索機能を使ってこれまでの入力内容を振り返ることができます。",
    },
    mymodel: {
      title: "MyModel",
      quick:
        "こちらは、入力した自己情報をもとに構築された「MyModel」を使用できる画面です。\n\n「Reflection」とは、「問い」と「答え」をセットにした「一問一答形式の情報」です。\n\n「ReflectionCreate」で問いに答えることで、Reflectionを作成できます。\n\n作成したReflectionを「Reflections」で閲覧でき、他ユーザーをフォローすれば、そのユーザーのReflectionも閲覧できるようになります。\n\nさらに、他のユーザーのReflectionに「共鳴」と「発見」のリアクションすることができます。\nその内容は「履歴」から確認できます。\n\nぜひ、さまざまなReflectionを閲覧してみてください。",
    },
    friend: {
      title: "Friend",
      quick:
        "こちらは、フレンド登録やフレンドログを確認できる画面です。\n\n他のユーザーとフレンド登録をすると、\nフレンドが「感情入力」を行った際に、\n選択された感情のみが通知されます。\n（メモ内容は共有されません）\n\n身近な方とフレンド登録をして、\n「感情のみの非言語交信」をお楽しみください。",
    },
    ranking: {
      title: "Ranking",
      quick:
        "こちらは、ランキングを閲覧できる画面です。\n\n複数のランキング項目から、\n上位100位までのユーザーを表示します。\n\nランキングに表示されているユーザーをタップすると、\nそのユーザーの「アカウントページ」を閲覧できます。\n\nぜひ、ランキング上位を目指してみてください。",
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
              <Text style={styles.sectionTitle}>画面説明</Text>
              <Text style={styles.bodyText}>{content?.quick || ""}</Text>
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>詳細ガイド（準備中）</Text>
              <Text style={styles.bodyText}>
                詳細ガイドは準備中です。
              </Text>
            </>
          )}
        </View>

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
      fontSize: 20,
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
