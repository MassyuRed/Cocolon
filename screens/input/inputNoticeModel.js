import { getNoticeButtonActions } from "../../lib/noticeActionRuntime";

export function isWelcomeNoticePopupCandidate(notice) {
  const explicitVariant = String(
    notice?.popup_variant ||
      notice?.notice_variant ||
      notice?.modal_variant ||
      notice?.variant ||
      "",
  )
    .trim()
    .toLowerCase();
  if (explicitVariant === "welcome" || explicitVariant === "intro") {
    return true;
  }

  const title = String(notice?.title || "").trim();
  if (title !== "はじめに") return false;

  const buttonActions = getNoticeButtonActions(notice?.actions, notice?.cta);
  return buttonActions.length === 0;
}
