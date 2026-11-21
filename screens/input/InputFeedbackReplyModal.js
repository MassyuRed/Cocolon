import { MODAL_ORIENTATIONS } from "../../ui/uiTokens";
import React from "react";
import { Modal, ScrollView, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

import CocolonButton from "../../components/CocolonButton";
import { isPassedEmlisObservationReply } from "./inputFeedbackModel";

export default function InputFeedbackReplyModal({
  visible,
  text,
  meta,
  isTutorialMode,
  windowHeight,
  onClose,
  styles,
  colors,
}) {
  const shouldShow = Boolean(
    visible &&
      isPassedEmlisObservationReply({
        commentText: text,
        observationStatus: meta?.observationStatus || meta?.observation_status,
      })
  );

  return (
    <Modal visible={shouldShow} transparent animationType="fade" onRequestClose={onClose} supportedOrientations={MODAL_ORIENTATIONS}>
      <SafeAreaView edges={["top", "bottom", "left", "right"]} style={styles.inputFeedbackBackdrop}>
        <View style={styles.inputFeedbackCard}>
          <ScrollView style={styles.inputFeedbackBodyScroll}
            contentContainerStyle={styles.inputFeedbackBodyContent} showsVerticalScrollIndicator>
          <View style={styles.inputFeedbackHeader}>
            <View style={styles.inputFeedbackTitleRow}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={18}
                color={colors.TITLE_GOLD}
                style={styles.inputFeedbackTitleIcon}
              />
              <Text style={styles.inputFeedbackTitle}>
                Emlisの観測
              </Text>
            </View>
            {meta?.contextLabel ? (
              <Text style={styles.inputFeedbackMetaText}>{meta.contextLabel}</Text>
            ) : null}
            {meta?.emotionSummary ? (
              <Text style={styles.inputFeedbackMetaText}>{meta.emotionSummary}</Text>
            ) : null}
            {meta?.dominantSummary ? (
              <Text style={styles.inputFeedbackMetaText}>{meta.dominantSummary}</Text>
            ) : null}
          </View>

            <Text style={styles.inputFeedbackBodyText}>{text}</Text>
          </ScrollView>

          <View style={styles.inputFeedbackActionRow}>
            <CocolonButton
              variant="secondary"
              onPress={onClose}
              accessibilityLabel="Emlisの観測を閉じる"
            >
              閉じる
            </CocolonButton>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
