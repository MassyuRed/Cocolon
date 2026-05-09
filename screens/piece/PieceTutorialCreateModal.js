import React from "react";
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonButton from "../../components/CocolonButton";
import TutorialOverlay from "../../components/TutorialOverlay";
import { TUTORIAL_PIECE_QUESTION, TUTORIAL_TOTAL_STEPS } from "./usePieceHomeTutorial";

export default function PieceTutorialCreateModal({
  visible,
  styles,
  colors,
  ui,
  refs,
  answer,
  setAnswer,
  error,
  setError,
  submitting,
  onClose,
  onSave,
  isTutorialMode,
  tutorialStep,
  tutorialModalOverlayConfig,
  tutorialModalTargetRect,
  setTutorialModalOverlayMetrics,
}) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View ref={refs.modalOverlayRootRef} style={styles.modalOverlay} collapsable={false}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>チュートリアル ピース</Text>
            <Pressable
              onPress={onClose}
              style={styles.modalCloseBtn}
              disabled={submitting}
            >
              <Ionicons name="close" size={18} color={colors.TEXT_ON_LIGHT} />
            </Pressable>
          </View>

          <ScrollView
            ref={refs.tutorialCreateScrollRef}
            style={styles.listArea}
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
            scrollEventThrottle={16}
            onScroll={(e) => {
              refs.tutorialCreateScrollYRef.current =
                e?.nativeEvent?.contentOffset?.y ?? refs.tutorialCreateScrollYRef.current;
            }}
          >
            <View ref={refs.tutorialCreateQuestionInputWrapRef} collapsable={false}>
              <View style={styles.tutorialQuestionCard}>
                <Text style={styles.tutorialQuestionLabel}>問い</Text>
                <Text style={styles.recoSummaryText}>{TUTORIAL_PIECE_QUESTION}</Text>
              </View>

              <Text style={[styles.recoSectionLabel, { marginTop: 10 }]}>あなたの回答</Text>
              <View ref={refs.tutorialCreateInputWrapRef} collapsable={false}>
                <TextInput
                  style={styles.tutorialTextArea}
                  placeholder="ここに回答を書いてください。"
                  placeholderTextColor={ui?.text?.description ?? colors.TEXT_SUBTLE}
                  value={answer}
                  onChangeText={(v) => {
                    setAnswer(v);
                    if (error) setError("");
                  }}
                  multiline
                  textAlignVertical="top"
                  editable={!submitting}
                />
              </View>
            </View>

            <Text style={styles.tutorialHelperText}>
              {isTutorialMode && tutorialStep === 14
                ? "この問いに答えて保存すると、ピースを生成できます。"
                : "この回答から、ピースの生成から閲覧までの流れを体験します。"}
            </Text>

            {error ? <Text style={styles.modeErrorText}>{error}</Text> : null}

            <View ref={refs.tutorialCreateSaveButtonRef} collapsable={false}>
              <CocolonButton
                variant="primary"
                style={{ marginTop: 12 }}
                onPress={onSave}
                disabled={submitting}
              >
                <View style={styles.btnRow}>
                  {submitting ? (
                    <ActivityIndicator color="#FFFFFF" style={{ marginRight: 8 }} />
                  ) : (
                    <Ionicons
                      name="save-outline"
                      size={18}
                      color="#FFFFFF"
                      style={{ marginRight: 6 }}
                    />
                  )}
                  <Text style={styles.goldButtonText}>保存</Text>
                </View>
              </CocolonButton>
            </View>
          </ScrollView>
        </View>

        {tutorialModalOverlayConfig ? (
          <View
            style={StyleSheet.absoluteFill}
            pointerEvents="box-none"
            onStartShouldSetResponderCapture={() => {
              Keyboard.dismiss();
              return false;
            }}
          >
            <TutorialOverlay
              visible={!!tutorialModalOverlayConfig}
              targetRect={tutorialModalTargetRect}
              title={tutorialModalOverlayConfig.title}
              message={tutorialModalOverlayConfig.message}
              step={tutorialModalOverlayConfig.step}
              totalSteps={TUTORIAL_TOTAL_STEPS}
              mode={tutorialModalOverlayConfig.mode}
              nextLabel={tutorialModalOverlayConfig.nextLabel}
              onNext={tutorialModalOverlayConfig.onNext}
              actionHint={tutorialModalOverlayConfig.actionHint}
              footerText={tutorialModalOverlayConfig.footerText}
              onMetricsChange={setTutorialModalOverlayMetrics}
            />
          </View>
        ) : null}
      </View>
    </Modal>
  );
}
