import React from "react";
import { Modal, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonButton from "../../components/CocolonButton";
import NoticeModal from "../../components/NoticeModal";
import TodayQuestionModal from "../../components/TodayQuestionModal";
import { INPUT_DRAFT_TTL_HOURS } from "./inputDraftModel";

export default function InputStartupModals({
  styles,
  colors,
  isTutorialMode,
  noticeFeatureEnabled,
  isNoticeStartupPopupVisible,
  noticePopup,
  noticeLoading,
  handleDismissNoticeModal,
  handleOpenNoticeHistory,
  handlePressNoticeAction,
  isWelcomeNoticeStartupPopup,
  handlePrimaryNoticeModalAction,
  shouldHideTodayQuestionForTutorial,
  isTodayQuestionStartupPopupVisible,
  todayQuestionBundle,
  todayQuestionLoading,
  todayQuestionSubmitting,
  handleDismissTodayQuestionModal,
  handleSubmitTodayQuestion,
  handleOpenTodayQuestionHistory,
  draftRestoreModalVisible,
  draftRestoreSavedAtLabel,
  restorePendingInputDraft,
  discardPendingInputDraft,
}) {
  return (
    <>
      <NoticeModal
        visible={!isTutorialMode && noticeFeatureEnabled && isNoticeStartupPopupVisible && !!noticePopup}
        notice={noticePopup}
        loading={noticeLoading}
        onClose={handleDismissNoticeModal}
        onOpenHistory={handleOpenNoticeHistory}
        onPressAction={handlePressNoticeAction}
        variant={isWelcomeNoticeStartupPopup ? "welcome" : "default"}
        showPublishedDate={!isWelcomeNoticeStartupPopup}
        showHistoryButton={!isWelcomeNoticeStartupPopup}
        primaryCloseLabel={isWelcomeNoticeStartupPopup ? "はじめる" : null}
        onPrimaryClose={isWelcomeNoticeStartupPopup ? handlePrimaryNoticeModalAction : undefined}
      />

      <TodayQuestionModal
        visible={
          !shouldHideTodayQuestionForTutorial &&
          isTodayQuestionStartupPopupVisible &&
          !!todayQuestionBundle?.question &&
          todayQuestionBundle?.answer_status !== "answered"
        }
        question={todayQuestionBundle?.question}
        answerSummary={todayQuestionBundle?.answer_summary || null}
        loading={todayQuestionLoading}
        submitting={todayQuestionSubmitting}
        onClose={handleDismissTodayQuestionModal}
        onSubmit={handleSubmitTodayQuestion}
        onOpenHistory={handleOpenTodayQuestionHistory}
      />

      <Modal
        visible={draftRestoreModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.draftRestoreBackdrop}>
          <View style={styles.draftRestoreCard}>
            <View style={styles.draftRestoreBadgeRow}>
              <View style={styles.draftRestoreBadge}>
                <Ionicons
                  name="save-outline"
                  size={15}
                  color={colors.TITLE_GOLD}
                  style={styles.draftRestoreBadgeIcon}
                />
                <Text style={styles.draftRestoreBadgeText}>一時保存した入力</Text>
              </View>
            </View>

            <View style={styles.draftRestoreHeader}>
              <Text style={styles.draftRestoreTitle}>前回の続きから入力できます</Text>
              <Text style={styles.draftRestoreLeadText}>
                送信前の内容を、この端末に自動で一時保存しています。
              </Text>
            </View>

            <View style={styles.draftRestoreInfoCard}>
              <View style={styles.draftRestoreInfoRow}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={colors.TITLE_GOLD}
                  style={styles.draftRestoreInfoIcon}
                />
                <Text style={styles.draftRestoreInfoText}>
                  {draftRestoreSavedAtLabel
                    ? `${draftRestoreSavedAtLabel} に保存 / 保存期間 ${INPUT_DRAFT_TTL_HOURS}時間`
                    : `保存期間は ${INPUT_DRAFT_TTL_HOURS}時間です`}
                </Text>
              </View>

              <Text style={styles.draftRestoreBodyText}>
                続きから入力する場合は前回の内容を復元し、新しく入力する場合は保存内容を削除して空の状態で開きます。
              </Text>
            </View>

            <View style={styles.draftRestoreActionColumn}>
              <CocolonButton
                variant="primary"
                onPress={restorePendingInputDraft}
                accessibilityLabel="前回の内容を復元して続きから入力する"
              >
                続きから入力する
              </CocolonButton>
              <View style={styles.draftRestoreSecondaryAction}>
                <CocolonButton
                  variant="secondary"
                  onPress={discardPendingInputDraft}
                  accessibilityLabel="保存内容を削除して新しく入力する"
                >
                  新しく入力する
                </CocolonButton>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
