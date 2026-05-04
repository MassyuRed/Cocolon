import React, { useMemo } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useTheme } from "../theme/ThemeContext";
import CocolonButton from "./CocolonButton";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";

function toJapaneseDigit(value) {
  const digits = { 0: "０", 1: "１", 2: "２", 3: "３", 4: "４", 5: "５", 6: "６", 7: "７", 8: "８", 9: "９" };
  return String(value).replace(/[0-9]/g, (ch) => digits[ch] || ch);
}

function removeFreePrefix(value) {
  return String(value || "")
    .replace(/Piece/g, "ピース")
    .replace(/Freeの([0-9０-９]+回)/g, "$1")
    .trim();
}

function formatRemainingText(quota) {
  const displayText = removeFreePrefix(quota?.display_text);
  if (displayText) return displayText;

  const limit = quota?.publish_limit;
  if (limit == null) return "今月のピース生成回数：無制限";
  return `今月のピース生成回数：${toJapaneseDigit(limit)}回`;
}

export default function EmotionPiecePreviewModal({
  visible,
  preview,
  publishLoading,
  onClose,
  onPublish,
  hideCancelButton = false,
}) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);

  const pieceText = String(preview?.piece_text || preview?.reflection_text || "").trim();
  const questionText = String(preview?.question || "").trim();
  const remainingText = formatRemainingText(preview?.quota || {});

  return (
    <Modal
      visible={!!visible}
      transparent
      animationType="fade"
      onRequestClose={hideCancelButton ? () => {} : onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons
                name="sparkles-outline"
                size={18}
                color={colors.TITLE_GOLD}
                style={styles.titleIcon}
              />
              <Text style={styles.title}>ピースの確認</Text>
            </View>
            <Text style={styles.lead}>
              入力内容から整えた問いと答えです。生成する前に内容を確認できます。
            </Text>
          </View>

          <ScrollView
            style={styles.bodyScroll}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator
          >
            <View style={styles.block}>
              <Text style={styles.blockLabel}>問い</Text>
              <Text style={styles.blockText}>{questionText || "—"}</Text>
            </View>

            <View style={styles.block}>
              <Text style={styles.blockLabel}>答え</Text>
              <Text style={styles.blockText}>{pieceText || "—"}</Text>
            </View>

            <View style={styles.quotaCard}>
              <Ionicons
                name="stats-chart-outline"
                size={16}
                color={colors.TITLE_GOLD}
                style={styles.quotaIcon}
              />
              <Text style={styles.quotaText}>{remainingText}</Text>
            </View>
          </ScrollView>

          <View style={styles.actions}>
            {!hideCancelButton ? (
              <View style={styles.secondaryButtonWrap}>
                <CocolonButton
                  variant="secondary"
                  onPress={onClose}
                  disabled={publishLoading}
                  accessibilityLabel="ピースの確認を閉じる"
                >
                  やめる
                </CocolonButton>
              </View>
            ) : null}
            <CocolonButton
              variant="primary"
              onPress={onPublish}
              loading={publishLoading}
              disabled={!preview || publishLoading}
              accessibilityLabel="ピースを生成する"
            >
              ピースを生成する
            </CocolonButton>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(COLORS, ui) {
  const text = ui?.text || {};
  return StyleSheet.create(applyTypographyTokens({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(15, 23, 42, 0.38)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    card: {
      width: "100%",
      maxWidth: 360,
      maxHeight: 620,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.BORDER_GOLD,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 18,
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
    },
    header: {
      alignItems: "center",
      marginBottom: 14,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    titleIcon: {
      marginRight: 6,
    },
    title: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: "800",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      textAlign: "center",
    },
    lead: {
      marginTop: 8,
      fontSize: 13,
      lineHeight: 20,
      fontWeight: "600",
      color: text.description ?? COLORS.TEXT_SUBTLE,
      textAlign: "center",
    },
    bodyScroll: {
      width: "100%",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      maxHeight: 380,
    },
    bodyContent: {
      paddingHorizontal: 18,
      paddingVertical: 16,
    },
    block: {
      marginBottom: 14,
    },
    blockLabel: {
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      marginBottom: 6,
    },
    blockText: {
      fontSize: 15,
      lineHeight: 24,
      fontWeight: "600",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    quotaCard: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginTop: 4,
    },
    quotaIcon: {
      marginRight: 6,
    },
    quotaText: {
      flex: 1,
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "700",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    actions: {
      marginTop: 16,
      width: "100%",
    },
    secondaryButtonWrap: {
      marginBottom: 10,
    },
  }, ui));
}
