import React, { useMemo } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CocolonButton from "./CocolonButton";
import Ionicons from "react-native-vector-icons/Ionicons";

import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";

export default function GuideTermModal({
  visible,
  term,
  resolveTerm,
  onClose,
  onSelectRelatedTerm,
}) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);

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
      <SafeAreaProvider style={{ backgroundColor: "rgba(15, 23, 42, 0.38)" }}>
      <SafeAreaView edges={["top", "bottom", "left", "right"]} style={[styles.backdrop, { backgroundColor: "transparent" }]}>
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
            key={term?.termId || "term"}
            style={{ flexShrink: 1 }}
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

          <View style={{ marginTop: 12 }}>
            <CocolonButton variant="secondary" onPress={onClose} accessibilityLabel="閉じる">閉じる</CocolonButton>
          </View>
        </View>
      </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

function createStyles(colors, ui) {
  const text = ui?.text || {};

  return StyleSheet.create(applyTypographyTokens({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(15, 23, 42, 0.38)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    card: {
      width: "100%",
      maxWidth: 640,
      maxHeight: '100%',
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      backgroundColor: colors.FIELD_BG,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 20,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
      flexShrink: 1,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
      gap: 8,
    },
    badge: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      backgroundColor: colors.SURFACE_TONAL,
      paddingHorizontal: 10,
      paddingVertical: 6,
      maxWidth: '100%',
    },
    badgeText: {
      color: colors.ON_SURFACE_TONAL,
      letterSpacing: 0,
    },
    closeIconButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
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
      paddingTop: 0,
      paddingBottom: 12,
    },
    termTitle: {
      color: colors.TEXT_ON_LIGHT,
      marginBottom: 6,
    },
    readingText: {
      color: text.description ?? colors.TEXT_SUBTLE,
      marginBottom: 16,
    },
    shortDefText: {
      color: colors.TEXT_ON_LIGHT,
      marginBottom: 16,
    },
    sectionBlock: {
      marginBottom: 16,
    },
    sectionTitle: {
      color: colors.TEXT_ON_LIGHT,
      marginBottom: 10,
    },
    bodyText: {
      color: colors.TEXT_ON_LIGHT,
    },
    exampleRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 8,
      gap: 8,
    },
    exampleBullet: {
      color: colors.TEXT_SUBTLE,
      minWidth: 18,
      flexShrink: 0,
    },
    exampleText: {
      flex: 1,
      color: colors.TEXT_ON_LIGHT,
      minWidth: 0,
    },
    relatedTermsWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginHorizontal: 0,
      marginTop: 4,
      gap: 8,
    },
    relatedTermChip: {
      marginHorizontal: 0,
      marginBottom: 0,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      backgroundColor: colors.FIELD_BG,
      maxWidth: '100%',
      minHeight: 44,
      justifyContent: 'center',
    },
    relatedTermChipPressed: {
      opacity: 0.82,
    },
    relatedTermChipText: {
      color: colors.TEXT_ON_LIGHT,
      flexShrink: 1,
    },
    closeButton: {
      marginTop: 12,
      minHeight: 52,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      backgroundColor: colors.FIELD_BG,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    closeButtonPressed: {
      opacity: 0.88,
    },
    closeButtonText: {
      color: colors.TEXT_ON_LIGHT,
      textAlign: 'center',
    },
  }, ui, {"badgeText":"meta","termTitle":"modalTitle","readingText":"description","shortDefText":"body","sectionTitle":"sectionTitle","bodyText":"body","exampleBullet":"body","exampleText":"body","relatedTermChipText":"button","closeButtonText":"button"}));
}
