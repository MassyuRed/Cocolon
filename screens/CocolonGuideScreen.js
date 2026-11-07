import React, { useCallback, useMemo, useState } from "react";
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
import { getGuideContent, normalizeGuideScreenId } from "../guide/guidesJa";
import { getGuideTerm } from "../guide/termsJa";

/**
 * CocolonGuideScreen
 * ------------------
 * Tip-style guide screen
 * - A single guide body per screen
 * - Terms in the body can be tapped to open in-place explanations
 * - Guide text / terms are driven by data files (guidesJa / termsJa)
 */

export default function CocolonGuideScreen({ route } = {}) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";

  const rawScreenId = route?.params?.screenId || route?.params?.screen_id || "";
  const screenId = useMemo(() => normalizeGuideScreenId(rawScreenId), [rawScreenId]);
  const content = useMemo(() => getGuideContent(screenId), [screenId]);

  const [activeTermId, setActiveTermId] = useState(null);

  const activeTerm = useMemo(() => getGuideTerm(activeTermId), [activeTermId]);

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


      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.headerRow}>
        <CocolonBackButton
          style={styles.backBtn}
          fallbackRouteName="Input"
          accessibilityLabel="戻る"
        />
        <Text style={styles.headerTitle}>
          Cocolonガイド
        </Text>
        <View style={styles.headerRightSpacer} />
      </View>

        <View style={styles.targetRow}>
          <View style={styles.targetPill}>
            <Text style={styles.targetPillText}>
              {content?.title || "ガイド"}
            </Text>
          </View>
          <Text style={styles.targetHint}>
            {content?.summary || "この画面の使い方を確認できます。"}
          </Text>
        </View>

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
            blocks={Array.isArray(content?.blocks) ? content.blocks : []}
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
                    pressed && styles.relatedTermChipPressed,
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

function createStyles(COLORS, ui) {
  const font = ui?.font || {};
  const text = ui?.text || {};

  return StyleSheet.create(
    applyTypographyTokens(
      {
        container: {
      flex: 1,
      backgroundColor: COLORS.BG_SILVER,
    },

        headerRow: {
      paddingHorizontal: 0,
      paddingTop: 0,
      paddingBottom: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
    },
        backBtn: {
      width: 44,
      minHeight: 44,
    },
        headerTitle: {
      flex: 1,
      textAlign: "center",
      color: COLORS.TITLE_GOLD,
      letterSpacing: 0,
      minWidth: 0,
    },
        headerRightSpacer: {
      width: 44,
    },

        scrollContainer: {
      paddingHorizontal: 20,
      paddingBottom: 24,
      paddingTop: 16,
      alignItems: "stretch",
      width: '100%',
      maxWidth: 680,
      alignSelf: 'center',
    },

        targetRow: {
      marginBottom: 16,
    },
        targetPill: {
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.SURFACE_TONAL,
      maxWidth: '100%',
    },
        targetPillText: {
      color: COLORS.ON_SURFACE_TONAL,
    },
        targetHint: {
      marginTop: 12,
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },

        tipLeadCard: {
      marginBottom: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.SURFACE_TONAL,
      paddingHorizontal: 16,
      paddingVertical: 16,
      flexDirection: "row",
      alignItems: "flex-start",
    },
        tipLeadIcon: {
          marginTop: 1,
          marginRight: 8,
        },
        tipLeadText: {
      flex: 1,
      color: COLORS.ON_SURFACE_TONAL,
    },

        card: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
        sectionTitle: {
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginBottom: 12,
    },

        relatedTermsWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginHorizontal: 0,
      gap: 8,
    },
        relatedTermChip: {
      marginHorizontal: 0,
      marginBottom: 0,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      maxWidth: '100%',
      minHeight: 44,
      justifyContent: 'center',
    },
        relatedTermChipPressed: {
          opacity: 0.82,
        },
        relatedTermChipText: {
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
    },
      },
      ui, {"headerTitle":"screenTitle","targetPillText":"description","targetHint":"description","tipLeadText":"description","sectionTitle":"sectionTitle","relatedTermChipText":"button"}
    )
  );
}
