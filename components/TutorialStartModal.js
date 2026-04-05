import React, { useMemo } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useTheme } from "../theme/ThemeContext";
import CocolonButton from "./CocolonButton";

export default function TutorialStartModal({
  visible,
  onDismiss,
  onSkipPermanently,
  onStart,
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal
      visible={!!visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.overlayTouch} onPress={onDismiss} />
        <View style={styles.sheet}>
          <View style={styles.closeRow}>
            <Pressable
              style={styles.closeButton}
              onPress={onDismiss}
              accessibilityRole="button"
              accessibilityLabel="チュートリアル案内を閉じる"
              hitSlop={8}
            >
              <Ionicons name="close" size={18} color={colors.TEXT_ON_LIGHT} />
            </Pressable>
          </View>

          <View style={styles.card}>
            <View style={styles.badgeRow}>
              <Ionicons
                name="sparkles-outline"
                size={16}
                color={colors.TITLE_GOLD}
                style={styles.badgeIcon}
              />
              <Text style={styles.badgeText}>チュートリアル</Text>
            </View>

            <Text style={styles.title}>はじめての使い方を体験しますか？</Text>
            <Text style={styles.bodyText}>
              基本的な流れを、保存されない形で試せます。
              {"\n"}
              はじめてのときだけ表示されます。
            </Text>

            <View style={styles.pointCard}>
              <View style={styles.pointRow}>
                <Ionicons name="checkmark-circle-outline" size={16} color={colors.TITLE_GOLD} />
                <Text style={styles.pointText}>感情入力の流れを短く確認できます</Text>
              </View>
              <View style={[styles.pointRow, styles.pointRowSpaced]}>
                <Ionicons name="checkmark-circle-outline" size={16} color={colors.TITLE_GOLD} />
                <Text style={styles.pointText}>チュートリアル内容は保存されません</Text>
              </View>
            </View>

            <View style={styles.buttonBlock}>
              <CocolonButton
                variant="primary"
                onPress={onStart}
                accessibilityLabel="チュートリアルを開始する"
              >
                開始する
              </CocolonButton>
            </View>
            <View style={styles.buttonBlock}>
              <CocolonButton
                variant="secondary"
                onPress={onDismiss}
                accessibilityLabel="今回はチュートリアルを始めない"
              >
                今回はしない
              </CocolonButton>
            </View>
            <View style={styles.buttonBlock}>
              <CocolonButton
                variant="secondary"
                onPress={onSkipPermanently}
                accessibilityLabel="今後チュートリアルを表示しない"
              >
                今後表示しない
              </CocolonButton>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(COLORS) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(15, 23, 42, 0.35)",
      justifyContent: "center",
      paddingHorizontal: 18,
    },
    overlayTouch: {
      ...StyleSheet.absoluteFillObject,
    },
    sheet: {
      borderRadius: 24,
      overflow: "hidden",
      backgroundColor: COLORS.PANEL_BG,
      borderWidth: 1,
      borderColor: COLORS.BORDER_GOLD,
      padding: 8,
    },
    closeRow: {
      alignItems: "flex-end",
      marginBottom: 4,
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      alignItems: "center",
      justifyContent: "center",
    },
    card: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    badgeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    badgeIcon: {
      marginRight: 6,
    },
    badgeText: {
      fontSize: 11,
      lineHeight: 16,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
    },
    title: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    bodyText: {
      marginTop: 10,
      fontSize: 14,
      lineHeight: 22,
      color: COLORS.TEXT_ON_LIGHT,
    },
    pointCard: {
      marginTop: 14,
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
    },
    pointRow: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    pointRowSpaced: {
      marginTop: 10,
    },
    pointText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 20,
      color: COLORS.TEXT_ON_LIGHT,
      marginLeft: 8,
    },
    buttonBlock: {
      marginTop: 12,
    },
  });
}
