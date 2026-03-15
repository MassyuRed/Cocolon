import React, { useMemo } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { useTheme } from "../theme/ThemeContext";
import TodayQuestionCard from "./TodayQuestionCard";

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
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal
      visible={!!visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.overlayTouch} onPress={onClose} />
        <View style={styles.sheet}>
          <TodayQuestionCard
            question={question}
            answerSummary={answerSummary}
            loading={loading}
            submitting={submitting}
            onSubmit={onSubmit}
            onOpenHistory={onOpenHistory}
          />
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
  });
}
