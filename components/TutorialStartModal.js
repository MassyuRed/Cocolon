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
import Ionicons from "react-native-vector-icons/Ionicons";

import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { useTheme } from "../theme/ThemeContext";
import CocolonButton from "./CocolonButton";

export default function TutorialStartModal({
  visible,
  onDismiss,
  onSkipPermanently,
  onStart,
}) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);

  return (
    <Modal
      visible={!!visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <SafeAreaProvider style={{ backgroundColor: "rgba(15, 23, 42, 0.35)" }}>
      <Pressable style={styles.overlayTouch} onPress={onDismiss} />
      <SafeAreaView edges={["top", "bottom", "left", "right"]} style={[styles.backdrop, { backgroundColor: "transparent" }]} pointerEvents="box-none">
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

          <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={styles.card} showsVerticalScrollIndicator={false}>
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
                <Ionicons name="checkmark-circle-outline" size={16} color={colors.ON_SURFACE_TONAL} />
                <Text style={styles.pointText}>感情入力の流れを短く確認できます</Text>
              </View>
              <View style={[styles.pointRow, styles.pointRowSpaced]}>
                <Ionicons name="checkmark-circle-outline" size={16} color={colors.ON_SURFACE_TONAL} />
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
          </ScrollView>
        </View>
      </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

function createStyles(COLORS, ui) {
  return StyleSheet.create(applyTypographyTokens({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(15, 23, 42, 0.35)",
      justifyContent: "center",
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    overlayTouch: {
      ...StyleSheet.absoluteFillObject,
    },
    sheet: {
      borderRadius: 24,
      overflow: "hidden",
      backgroundColor: COLORS.PANEL_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      padding: 20,
      width: '100%',
      maxWidth: 640,
      alignSelf: 'center',
      maxHeight: '90%',
      flexShrink: 1,
      minHeight: 0,
    },
    closeRow: {
      alignItems: "flex-end",
      marginBottom: 12,
    },
    closeButton: {
      width: 44,
      height: 44,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    card: {
      backgroundColor: 'transparent',
      borderRadius: 0,
      borderWidth: 0,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    badgeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    badgeIcon: {
      marginRight: 6,
    },
    badgeText: {
      color: COLORS.TITLE_GOLD,
    },
    title: {
      color: COLORS.TEXT_ON_LIGHT,
    },
    bodyText: {
      marginTop: 8,
      color: COLORS.TEXT_ON_LIGHT,
    },
    pointCard: {
      marginTop: 16,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderRadius: 16,
      borderWidth: 0,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.SURFACE_TONAL,
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
      color: COLORS.ON_SURFACE_TONAL,
      marginLeft: 8,
      minWidth: 0,
      flexShrink: 1,
    },
    buttonBlock: {
      marginTop: 12,
    },
  }, ui, {"badgeText":"meta","title":"modalTitle","bodyText":"body","pointText":"description"}));
}
