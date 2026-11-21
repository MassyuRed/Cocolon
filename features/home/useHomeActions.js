import { useCallback } from "react";

import { markNoticePopupSeen, markNoticesRead } from "../../lib/api/home/noticeApi";

export function useHomeActions({
  noticePopup,
  rememberDismissedNotice,
  setNoticePopup,
}) {
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
      await markNoticesRead({ notice_ids: [noticeId] });
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
  }, [noticePopup?.notice_id, setNoticePopup]);

  return {
    markCurrentNoticePopupSeen,
    markCurrentNoticeRead,
  };
}

export default useHomeActions;
