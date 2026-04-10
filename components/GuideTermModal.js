import React, { useMemo } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useTheme } from "../theme/ThemeContext";

export default function GuideTermModal({
  visible,
  term,
  resolveTerm,
  onClose,
  onSelectRelatedTerm,
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const examples = Array.isArray(term?.examples) ? term.examples : [];
  const relatedTerms = useMemo(() => {
    const ids = Array.isArray(term?.relatedTerms) ? term.relatedTerms : [];
    return ids
      .map((termId) => resolveTerm?.(termId))
      .filter(Boolean);
  }, [resolveTerm, term?.relatedTerms]);

  return (
    <Modal
      visible={!!visible && !!term}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>TIP</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="用語説明を閉じる"
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeIconButton,
                pressed && styles.closeIconButtonPressed,
              ]}
            >
              <Ionicons
                name="close-outline"
                size={22}
                color={colors.TEXT_ON_LIGHT}
              />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.termTitle}>{term?.display || ""}</Text>
            {term?.reading ? (
              <Text style={styles.readingText}>{term.reading}</Text>
            ) : null}

            {term?.shortDef ? (
              <Text style={styles.shortDefText}>{term.shortDef}</Text>
            ) : null}

            {term?.longDef ? (
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>説明</Text>
                <Text style={styles.bodyText}>{term.longDef}</Text>
              </View>
            ) : null}

            {examples.length > 0 ? (
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>例</Text>
                {examples.map((example, index) => (
                  <View key={`example-${index}`} style={styles.exampleRow}>
                    <Text style={styles.exampleBullet}>・</Text>
                    <Text style={styles.exampleText}>{example}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            {relatedTerms.length > 0 ? (
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>関連用語</Text>
                <View style={styles.relatedTermsWrap}>
                  {relatedTerms.map((related) => (
                    <Pressable
                      key={related.termId}
                      accessibilityRole="button"
                      accessibilityLabel={`${related.display} の説明を開く`}
                      onPress={() => onSelectRelatedTerm?.(related.termId)}
                      style={({ pressed }) => [
                        styles.relatedTermChip,
                        pressed && styles.relatedTermChipPressed,
                      ]}
                    >
                      <Text style={styles.relatedTermChipText}>
                        {related.display}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}
          </ScrollView>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="閉じる"
            onPress={onClose}
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.closeButtonPressed,
            ]}
          >
            <Text style={styles.closeButtonText}>閉じる</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(colors) {
  const guideDarkSubtext = "#374151";

  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(15, 23, 42, 0.38)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    card: {
      width: "100%",
      maxWidth: 380,
      maxHeight: "78%",
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.BORDER_GOLD,
      backgroundColor: colors.PANEL_BG,
      paddingHorizontal: 18,
      paddingTop: 16,
      paddingBottom: 14,
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    badge: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      backgroundColor: colors.FIELD_BG,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    badgeText: {
      fontSize: 11,
      lineHeight: 14,
      fontWeight: "800",
      color: colors.TITLE_GOLD,
      letterSpacing: 0.5,
    },
    closeIconButton: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.FIELD_BG,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
    },
    closeIconButtonPressed: {
      opacity: 0.82,
    },
    scrollContent: {
      paddingTop: 4,
      paddingBottom: 4,
    },
    termTitle: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: "800",
      color: colors.TEXT_ON_LIGHT,
      marginBottom: 4,
    },
    readingText: {
      fontSize: 12,
      lineHeight: 18,
      color: guideDarkSubtext,
      marginBottom: 12,
    },
    shortDefText: {
      fontSize: 14,
      lineHeight: 22,
      color: colors.TITLE_GOLD,
      fontWeight: "700",
      marginBottom: 12,
    },
    sectionBlock: {
      marginBottom: 14,
    },
    sectionTitle: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "800",
      color: colors.TEXT_ON_LIGHT,
      marginBottom: 6,
    },
    bodyText: {
      fontSize: 14,
      lineHeight: 24,
      color: colors.TEXT_ON_LIGHT,
    },
    exampleRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 6,
    },
    exampleBullet: {
      width: 16,
      fontSize: 14,
      lineHeight: 22,
      color: colors.TITLE_GOLD,
      fontWeight: "700",
    },
    exampleText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 22,
      color: colors.TEXT_ON_LIGHT,
    },
    relatedTermsWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginHorizontal: -4,
      marginTop: 2,
    },
    relatedTermChip: {
      marginHorizontal: 4,
      marginBottom: 8,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      backgroundColor: colors.FIELD_BG,
    },
    relatedTermChipPressed: {
      opacity: 0.82,
    },
    relatedTermChipText: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: "700",
      color: colors.TEXT_ON_LIGHT,
    },
    closeButton: {
      marginTop: 6,
      minHeight: 44,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.GOLD_BUTTON_BORDER,
      backgroundColor: colors.GOLD_BUTTON,
      alignItems: "center",
      justifyContent: "center",
    },
    closeButtonPressed: {
      opacity: 0.88,
    },
    closeButtonText: {
      fontSize: 14,
      lineHeight: 18,
      fontWeight: "800",
      color: "#FFFFFF",
    },
  });
}
