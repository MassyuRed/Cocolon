import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

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

  const relatedTerms = useMemo(() => {
    const ids = Array.isArray(content?.relatedTerms) ? content.relatedTerms : [];
    return ids.map((termId) => getGuideTerm(termId)).filter(Boolean);
  }, [content?.relatedTerms]);

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
        <View style={styles.tabBar} accessibilityRole="tablist">
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
        <Text style={styles.summary}>{content.summary}</Text>
        <View style={styles.tipLeadCard}>
          <Ionicons
            name="sparkles-outline"
            size={18}
            color={colors.ON_SURFACE_TONAL}
            style={styles.tipLeadIcon}
          />
          <Text style={styles.tipLeadText}>
            文章の中で気になる用語をタップすると、その場で説明が開きます。
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>画面の見方</Text>
          <GuideRichText
            blocks={content.blocks}
            onPressTerm={handleOpenTerm}
          />
        </View>

        {relatedTerms.length > 0 ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>よく出てくる用語</Text>
            <View style={styles.relatedTermsWrap}>
              {relatedTerms.map((term) => (
                <Pressable
                  key={term.termId}
                  accessibilityRole="button"
                  accessibilityLabel={`${term.display} の説明を開く`}
                  onPress={() => handleOpenTerm(term.termId)}
                  style={({ pressed }) => [
                    styles.relatedTermChip,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.relatedTermChipText}>{term.display}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}
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
  const text = ui?.text || {};
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
    tab: {
      flex: 1,
      minWidth: 0,
      minHeight: 44,
      paddingHorizontal: 4,
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
    summary: { marginBottom: 16, color: text.description ?? colors.TEXT_SUBTLE },
    tipLeadCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      backgroundColor: colors.SURFACE_TONAL,
      padding: 16,
    },
    tipLeadIcon: { marginTop: 1, marginRight: 8 },
    tipLeadText: { flex: 1, color: colors.ON_SURFACE_TONAL },
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
    sectionTitle: { color: text.primary ?? colors.TEXT_ON_LIGHT, marginBottom: 12 },
    relatedTermsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    relatedTermChip: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      backgroundColor: colors.FIELD_BG,
      maxWidth: "100%",
      minHeight: 44,
      justifyContent: "center",
    },
    relatedTermChipText: { color: text.primary ?? colors.TEXT_ON_LIGHT, flexShrink: 1 },
  }, ui, {
    headerTitle: "screenTitle",
    tabText: "button",
    summary: "description",
    tipLeadText: "description",
    sectionTitle: "sectionTitle",
    relatedTermChipText: "button",
  }));
}
