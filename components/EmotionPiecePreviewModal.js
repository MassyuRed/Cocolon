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

function formatRemainingText(quota) {
  const limit = quota?.publish_limit;
  const remaining = quota?.remaining_count;
  if (limit == null) return "今月のPiece作成回数: 無制限";
  if (typeof remaining === "number") {
    return `今月の残りPiece作成回数: ${remaining} / ${limit}`;
  }
  return `今月のPiece作成上限: ${limit}`;
}

export default function EmotionPiecePreviewModal({
  visible,
  preview,
  publishLoading,
  onClose,
  onPublish,
}) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);

  const pieceText = String(preview?.piece_text || "").trim();
  const questionText = String(preview?.question || "").trim();
  const remainingText = formatRemainingText(preview?.quota || {});

  return (
    <Modal
      visible={!!visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
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
              <Text style={styles.title}>Pieceの確認</Text>
            </View>
            <Text style={styles.lead}>
              この入力だけから生成されたPieceです。作成する前に内容を確認できます。
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
              <Text style={styles.blockLabel}>Piece</Text>
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
            <View style={styles.secondaryButtonWrap}>
              <CocolonButton
                variant="secondary"
                onPress={onClose}
                disabled={publishLoading}
                accessibilityLabel="Pieceの確認を閉じる"
              >
                やめる
              </CocolonButton>
            </View>
            <CocolonButton
              variant="primary"
              onPress={onPublish}
              loading={publishLoading}
              disabled={!preview || publishLoading}
              accessibilityLabel="Pieceを作成する"
            >
              Pieceを作成する
            </CocolonButton>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(COLORS, ui) {
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
      color: COLORS.TEXT_ON_LIGHT,
      textAlign: "center",
    },
    lead: {
      marginTop: 8,
      fontSize: 13,
      lineHeight: 20,
      fontWeight: "600",
      color: COLORS.TEXT_SUBTLE,
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
      color: COLORS.TEXT_ON_LIGHT,
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
      color: COLORS.TEXT_ON_LIGHT,
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
