import { Alert } from "react-native";
import { useCallback, useState } from "react";

import { markNoticePopupSeen, markNoticesRead } from "../../lib/api/home/noticeApi";
import { submitTodayQuestionAnswer } from "../../lib/api/home/todayQuestionApi";
import { STARTUP_POPUP_KIND } from "./useHomeState";

export function useHomeActions({
  noticePopup,
  todayQuestionBundle,
  activeStartupPopupKind,
  loadHomeState,
  advanceStartupPopupQueue,
  rememberDismissedNotice,
  rememberDismissedTodayQuestionDay,
  setNoticeUnreadCount,
  setNoticePopup,
  showToast,
}) {
  const [todayQuestionSubmitting, setTodayQuestionSubmitting] = useState(false);

  const markCurrentNoticePopupSeen = useCallback(async () => {
    const noticeId = String(noticePopup?.notice_id || "").trim();
    if (!noticeId) return;
    rememberDismissedNotice(noticeId);
    try {
      await markNoticePopupSeen({ notice_id: noticeId });
    } catch (e) {
      console.warn("InputScreen: markNoticePopupSeen failed", e);
    }
  }, [noticePopup?.notice_id, rememberDismissedNotice]);

  const markCurrentNoticeRead = useCallback(async () => {
    const noticeId = String(noticePopup?.notice_id || "").trim();
    if (!noticeId) return;
    try {
      const res = await markNoticesRead({ notice_ids: [noticeId] });
      const nextUnreadCount = Math.max(0, Number(res?.unread_count) || 0);
      setNoticeUnreadCount(nextUnreadCount);
      setNoticePopup((prev) => {
        if (String(prev?.notice_id || "").trim() !== noticeId) return prev;
        return {
          ...(prev || {}),
          is_read: true,
          read_at: prev?.read_at || new Date().toISOString(),
        };
      });
    } catch (e) {
      console.warn("InputScreen: markNoticesRead failed", e);
    }
  }, [noticePopup?.notice_id, setNoticePopup, setNoticeUnreadCount]);

  const handleSubmitTodayQuestion = useCallback(async (payload) => {
    if (!todayQuestionBundle?.question?.question_id) return;

    setTodayQuestionSubmitting(true);
    try {
      await submitTodayQuestionAnswer({
        service_day_key: todayQuestionBundle?.service_day_key,
        question_id: todayQuestionBundle?.question?.question_id,
        sequence_no: todayQuestionBundle?.progress?.sequence_no,
        ...payload,
      });
      showToast("今日の問いを保存しました");
      rememberDismissedTodayQuestionDay(
        String(todayQuestionBundle?.service_day_key || "")
      );
      if (activeStartupPopupKind === STARTUP_POPUP_KIND.TODAY_QUESTION) {
        advanceStartupPopupQueue();
      }
      await loadHomeState({ force: true, includeStartupCandidate: false });
    } catch (e) {
      console.warn("InputScreen: submitTodayQuestion failed", e);
      Alert.alert("今日の問い", String(e?.message || "保存に失敗しました。"));
    } finally {
      setTodayQuestionSubmitting(false);
    }
  }, [
    activeStartupPopupKind,
    advanceStartupPopupQueue,
    loadHomeState,
    rememberDismissedTodayQuestionDay,
    showToast,
    todayQuestionBundle,
  ]);

  return {
    todayQuestionSubmitting,
    handleSubmitTodayQuestion,
    markCurrentNoticePopupSeen,
    markCurrentNoticeRead,
  };
}

export default useHomeActions;
