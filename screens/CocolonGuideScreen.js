import React, { useCallback, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
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
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />

      <View style={styles.headerRow}>
        <CocolonBackButton
          style={styles.backBtn}
          fallbackRouteName="Input"
          accessibilityLabel="戻る"
        />
        <Text style={styles.headerTitle} numberOfLines={1}>
          Cocolonガイド
        </Text>
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.targetRow}>
          <View style={styles.targetPill}>
            <Text style={styles.targetPillText} numberOfLines={1}>
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
            color={colors.TITLE_GOLD}
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
          fontSize: font.description ?? 11,
          lineHeight: 18,
          color: text.description ?? COLORS.TEXT_SUBTLE,
          opacity: 0.9,
        },

        tipLeadCard: {
          marginBottom: 12,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: COLORS.CARD_BORDER,
          backgroundColor: COLORS.FIELD_BG,
          paddingHorizontal: 12,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "flex-start",
        },
        tipLeadIcon: {
          marginTop: 1,
          marginRight: 8,
        },
        tipLeadText: {
          flex: 1,
          fontSize: 13,
          lineHeight: 20,
          fontWeight: "700",
          color: text.primary ?? COLORS.TEXT_ON_LIGHT,
        },

        card: {
          borderRadius: 18,
          borderWidth: 1,
          borderColor: COLORS.CARD_BORDER,
          backgroundColor: COLORS.FIELD_BG,
          paddingHorizontal: 14,
          paddingVertical: 14,
          marginBottom: 12,
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
          marginBottom: 10,
        },

        relatedTermsWrap: {
          flexDirection: "row",
          flexWrap: "wrap",
          marginHorizontal: -4,
        },
        relatedTermChip: {
          marginHorizontal: 4,
          marginBottom: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: COLORS.CARD_BORDER,
          backgroundColor: COLORS.PANEL_BG,
        },
        relatedTermChipPressed: {
          opacity: 0.82,
        },
        relatedTermChipText: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: "700",
          color: text.primary ?? COLORS.TEXT_ON_LIGHT,
        },
      },
      ui
    )
  );
}
