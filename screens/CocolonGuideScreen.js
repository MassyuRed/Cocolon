import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";

// UI (Design System)
import CocolonBackButton from "../components/CocolonBackButton";
import GuideRichText from "../components/GuideRichText";
import GuideTermModal from "../components/GuideTermModal";
import { getGuideContent, guidesJa, normalizeGuideScreenId } from "../guide/guidesJa";
import { getGuideTerm } from "../guide/termsJa";

const guideScreenIds = Object.keys(guidesJa).filter((id) => id !== "unknown");

export default function CocolonGuideScreen({ route } = {}) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";
  const { width, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const availableWidth = Math.min(680, width - insets.left - insets.right) - 40;
  const tabWidth = (id) => guidesJa[id].title.length * ui.typography.button.fontSize * fontScale + 16;
  const tabsWrap =
    guideScreenIds.reduce((total, id) => total + tabWidth(id), 18) > availableWidth;

  const requestedScreenId = normalizeGuideScreenId(route?.params?.screenId || route?.params?.screen_id);
  const initialScreenId = guideScreenIds.includes(requestedScreenId) ? requestedScreenId : "home";
  const [screenId, setScreenId] = useState(initialScreenId);
  const [activeTermId, setActiveTermId] = useState(null);

  useEffect(() => {
    setScreenId(initialScreenId);
    setActiveTermId(null);
  }, [initialScreenId]);

  const content = getGuideContent(screenId);
  const activeTerm = getGuideTerm(activeTermId);

  const handleOpenTerm = useCallback((termId) => {
    const nextId = String(termId || "").trim();
    if (!nextId) return;
    setActiveTermId(nextId);
  }, []);

  const handleCloseTerm = useCallback(() => {
    setActiveTermId(null);
  }, []);

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />

      <View style={styles.top}>
        <View style={styles.headerRow}>
          <CocolonBackButton style={styles.backBtn} accessibilityLabel="戻る" />
          <Text accessibilityRole="header" style={styles.headerTitle}>アプリの使い方</Text>
          <View style={styles.headerRightSpacer} />
        </View>
        <View style={[styles.tabBar, tabsWrap && styles.tabBarWrapped]} accessibilityRole="tablist">
          {guideScreenIds.map((id) => {
            const selected = id === screenId;
            return (
              <Pressable
                key={id}
                accessibilityRole="tab"
                accessibilityLabel={guidesJa[id].title}
                accessibilityState={{ selected }}
                onPress={() => {
                  setActiveTermId(null);
                  setScreenId(id);
                }}
                style={({ pressed }) => [
                  styles.tab,
                  { flexBasis: tabsWrap ? "46%" : tabWidth(id) },
                  selected && styles.tabSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.tabText, selected && styles.tabTextSelected]}>
                  {guidesJa[id].title}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView key={screenId} style={styles.chapterScroll} contentContainerStyle={styles.chapter}>
        <View style={styles.card}>
          <GuideRichText
            blocks={content.blocks}
            onPressTerm={handleOpenTerm}
          />
        </View>
      </ScrollView>

      <GuideTermModal
        visible={!!activeTerm}
        term={activeTerm}
        resolveTerm={getGuideTerm}
        onClose={handleCloseTerm}
        onSelectRelatedTerm={handleOpenTerm}
      />
    </SafeAreaView>
  );
}

function createStyles(colors, ui) {
  const bodyWidth = {
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
    paddingHorizontal: 20,
  };

  return StyleSheet.create(applyTypographyTokens({
    container: { flex: 1, backgroundColor: colors.BG_SILVER },
    top: { ...bodyWidth, paddingTop: 16, paddingBottom: 12 },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 12,
    },
    backBtn: { width: 44, minHeight: 44 },
    headerTitle: {
      flex: 1,
      minWidth: 0,
      textAlign: "center",
      color: colors.TITLE_GOLD,
    },
    headerRightSpacer: { width: 44 },
    tabBar: { flexDirection: "row", gap: 6 },
    tabBarWrapped: { flexWrap: "wrap" },
    tab: {
      flexGrow: 1,
      minWidth: 0,
      minHeight: 44,
      paddingHorizontal: 8,
      paddingVertical: 8,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 24,
      backgroundColor: colors.SURFACE_TONAL,
    },
    tabSelected: { backgroundColor: colors.GOLD_BUTTON },
    tabText: { color: colors.ON_SURFACE_TONAL, textAlign: "center" },
    tabTextSelected: { color: colors.ACCENT_TEXT },
    pressed: { opacity: 0.82 },
    chapterScroll: { flex: 1 },
    chapter: { ...bodyWidth, paddingBottom: 24 },
    card: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      backgroundColor: colors.FIELD_BG,
      padding: 20,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
  }, ui, {
    headerTitle: "screenTitle",
    tabText: "button",
  }));
}
