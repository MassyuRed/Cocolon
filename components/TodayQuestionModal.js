import React, { useMemo } from "react";
import {
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../theme/ThemeContext";
import TodayQuestionCard from "./TodayQuestionCard";
import { makeUiTokens } from "../ui/uiTokens";

export default function TodayQuestionModal({
  visible,
  question,
  answerSummary = null,
  loading = false,
  submitting = false,
  onClose,
  onSubmit,
  onOpenHistory,
}) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);

  return (
    <Modal
      visible={!!visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView edges={["top", "bottom", "left", "right"]} style={styles.backdrop}>
        <Pressable style={styles.overlayTouch} onPress={onClose} />
        <KeyboardAvoidingView style={styles.keyboardArea} behavior={Platform.OS === "ios" ? "padding" : "height"} pointerEvents="box-none">
        <View style={styles.sheet}>
          <View style={styles.closeRow}>
            <Text style={styles.title}>今日の問い</Text>
            {loading ? <ActivityIndicator accessibilityLabel="今日の問いを読み込み中" size="small" color={colors.TEXT_SUBTLE} /> : null}
            <Pressable
              style={styles.closeButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="今日の問いを閉じる"
              hitSlop={8}
            >
              <Ionicons name="close" size={18} color={colors.TEXT_ON_LIGHT} />
            </Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" style={styles.scroll} contentContainerStyle={styles.content}>
          <TodayQuestionCard embedded hideHeader
            question={question}
            answerSummary={answerSummary}
            loading={loading}
            submitting={submitting}
            onSubmit={onSubmit}
            onOpenHistory={onOpenHistory}
          />
          </ScrollView>
        </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

function createStyles(COLORS, ui) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(15, 23, 42, 0.35)",
      justifyContent: "center",
      padding: 20,
    },
    keyboardArea: { flex: 1, justifyContent: "center", alignItems: "center" },
    scroll: { flexShrink: 1 },
    content: { paddingHorizontal: 20, paddingBottom: 20 },
    title: { ...ui.typography.modalTitle, color: COLORS.TEXT_ON_LIGHT, flex: 1, marginRight: 8 },
    overlayTouch: {
      ...StyleSheet.absoluteFillObject,
    },
    sheet: {
      width: "100%",
      maxWidth: 520,
      maxHeight: "100%",
      flexShrink: 1,
      borderRadius: 24,
      overflow: "hidden",
      backgroundColor: COLORS.PANEL_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
    },
    closeRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 8,
    },
    closeButton: {
      width: 44,
      height: 44,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}
