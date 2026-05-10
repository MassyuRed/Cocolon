import React from "react";
import { Modal, ScrollView, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

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
    <Modal visible={shouldShow} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.inputFeedbackBackdrop}>
        <View
          style={[
            styles.inputFeedbackCard,
            { maxHeight: Math.max(380, Math.min(620, Math.floor((windowHeight || 0) * 0.84) || 560)) },
          ]}
        >
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

          <ScrollView
            style={[
              styles.inputFeedbackBodyScroll,
              { maxHeight: Math.max(220, Math.min(470, Math.floor((windowHeight || 0) * 0.56) || 390)) },
            ]}
            contentContainerStyle={styles.inputFeedbackBodyContent}
            showsVerticalScrollIndicator
          >
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
      </View>
    </Modal>
  );
}
