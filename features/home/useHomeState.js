import { AppState } from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getHomeState } from "../../lib/api/home/homeStateApi";
import { PIECE_WIRE, readWireSectionObject } from "../../lib/compat/legacyWireContracts";
import { resolveLocalTimezoneName } from "../../lib/api/home/todayQuestionApi";
import { useAppRuntime } from "../../AppRuntimeContext";

export const STARTUP_POPUP_KIND = Object.freeze({
  NOTICE: "notice",
  TUTORIAL: "tutorial",
  TODAY_QUESTION: "todayQuestion",
});

const STARTUP_POPUP_PRIORITY = Object.freeze({
  [STARTUP_POPUP_KIND.NOTICE]: 300,
  [STARTUP_POPUP_KIND.TUTORIAL]: 200,
  [STARTUP_POPUP_KIND.TODAY_QUESTION]: 100,
});

function getInputLocalTimezoneName() {
  return resolveLocalTimezoneName("Asia/Tokyo");
}

function sortStartupPopupQueue(items = []) {
  return [...items]
    .filter(Boolean)
    .sort(
      (a, b) =>
        (STARTUP_POPUP_PRIORITY[b?.kind] || 0) -
        (STARTUP_POPUP_PRIORITY[a?.kind] || 0)
    );
}

function normalizeHomeSections(json) {
  const sections =
    json?.sections && typeof json.sections === "object" && !Array.isArray(json.sections)
      ? json.sections
      : {};

  return {
    inputSummary:
      sections?.input_summary && typeof sections.input_summary === "object"
        ? sections.input_summary
        : null,
    globalSummary:
      sections?.global_summary && typeof sections.global_summary === "object"
        ? sections.global_summary
        : null,
    noticesCurrent:
      sections?.notices_current && typeof sections.notices_current === "object"
        ? sections.notices_current
        : null,
    todayQuestionCurrent:
      sections?.today_question_current && typeof sections.today_question_current === "object"
        ? sections.today_question_current
        : null,
    pieceQuota: (() => {
      const section = readWireSectionObject(sections, PIECE_WIRE.startupSections.quota);
      return section.found && typeof section.value === "object" && !Array.isArray(section.value)
        ? section.value
        : null;
    })(),
  };
}

function toStartupPopupKind(rawKind) {
  const normalized = String(rawKind || "").trim().toLowerCase();
  if (normalized === "notice") return STARTUP_POPUP_KIND.NOTICE;
  if (normalized === "tutorial") return STARTUP_POPUP_KIND.TUTORIAL;
  if (normalized === "today_question" || normalized === "todayquestion") {
    return STARTUP_POPUP_KIND.TODAY_QUESTION;
  }
  return null;
}

export function useHomeState({
  currentUserId,
  isTutorialMode,
  tutorialFlagsLoaded,
  navigation,
  buildTutorialStartupCandidate,
}) {
  const { isFeatureEnabled } = useAppRuntime();
  const todayQuestionFeatureEnabled = isFeatureEnabled("today_question_enabled", true);
  const [globalEmotionUsers, setGlobalEmotionUsers] = useState(null);
  const [homeTodayCount, setHomeTodayCount] = useState(null);
  const [homeMonthCount, setHomeMonthCount] = useState(null);
  const [homeWeekCount, setHomeWeekCount] = useState(null);
  const [homeStreakDays, setHomeStreakDays] = useState(null);

  const [todayQuestionBundle, setTodayQuestionBundle] = useState(null);
  const [todayQuestionLoading, setTodayQuestionLoading] = useState(false);
  const [noticeFeatureEnabled, setNoticeFeatureEnabled] = useState(true);
  const [noticeUnreadCount, setNoticeUnreadCount] = useState(0);
  const [noticePopup, setNoticePopup] = useState(null);
  const [noticeLoading, setNoticeLoading] = useState(false);
  const [pieceQuota, setPieceQuota] = useState(null);

  const [startupQueuePreparing, setStartupQueuePreparing] = useState(false);
  const [startupPopupQueue, setStartupPopupQueue] = useState([]);

  const appStateRef = useRef(AppState.currentState);
  const homeStateRequestIdRef = useRef(0);
  const dismissedNoticeIdRef = useRef(null);
  const dismissedTodayQuestionDayRef = useRef(null);
  const startupCycleIdRef = useRef(0);
  const startupPrepareInFlightRef = useRef(null);
  const startupWindowClosedRef = useRef(false);

  const clearTodayQuestionUi = useCallback(() => {
    setTodayQuestionBundle(null);
    setTodayQuestionLoading(false);
  }, []);

  const clearNoticeUi = useCallback(() => {
    setNoticeFeatureEnabled(true);
    setNoticeUnreadCount(0);
    setNoticePopup(null);
    setNoticeLoading(false);
  }, []);

  const rememberDismissedNotice = useCallback((noticeId) => {
    const nextNoticeId = String(noticeId || "").trim();
    dismissedNoticeIdRef.current = nextNoticeId || null;
  }, []);

  const rememberDismissedTodayQuestionDay = useCallback((serviceDayKey) => {
    const nextServiceDayKey = String(serviceDayKey || "").trim();
    dismissedTodayQuestionDayRef.current = nextServiceDayKey || null;
  }, []);

  const applyHomeStatePayload = useCallback(
    (json) => {
      const {
        inputSummary,
        globalSummary,
        noticesCurrent,
        todayQuestionCurrent,
        pieceQuota: nextQuota,
      } = normalizeHomeSections(json);

      if (inputSummary) {
        const todayCount = Number(inputSummary?.today_count ?? 0);
        const weekCount = Number(inputSummary?.week_count ?? 0);
        const monthCount = Number(inputSummary?.month_count ?? 0);
        const streakDays = Number(inputSummary?.streak_days ?? 0);

        setHomeTodayCount(Number.isFinite(todayCount) ? todayCount : 0);
        setHomeWeekCount(Number.isFinite(weekCount) ? weekCount : 0);
        setHomeMonthCount(Number.isFinite(monthCount) ? monthCount : 0);
        setHomeStreakDays(Number.isFinite(streakDays) ? streakDays : 0);
      }

      if (globalSummary) {
        const nextEmotionUsers = Number(globalSummary?.emotion_users);
        if (Number.isFinite(nextEmotionUsers)) {
          setGlobalEmotionUsers(nextEmotionUsers);
        }
      }

      if (isTutorialMode) {
        clearNoticeUi();
        clearTodayQuestionUi();
        setPieceQuota(null);
      } else {
        setNoticeFeatureEnabled(noticesCurrent?.feature_enabled !== false);
        setNoticeUnreadCount(Math.max(0, Number(noticesCurrent?.unread_count) || 0));
        setNoticePopup(
          noticesCurrent?.popup_notice && typeof noticesCurrent.popup_notice === "object"
            ? noticesCurrent.popup_notice
            : null
        );
        if (todayQuestionFeatureEnabled) {
          setTodayQuestionBundle(todayQuestionCurrent || null);
        } else {
          clearTodayQuestionUi();
        }
        setPieceQuota(nextQuota);
      }

      return {
        inputSummary,
        globalSummary,
        noticesCurrent,
        todayQuestionCurrent,
        pieceQuota: nextQuota,
      };
    },
    [clearNoticeUi, clearTodayQuestionUi, isTutorialMode, todayQuestionFeatureEnabled]
  );

  const loadHomeState = useCallback(
    async ({ force = false, includeStartupCandidate = true } = {}) => {
      const requestId = homeStateRequestIdRef.current + 1;
      homeStateRequestIdRef.current = requestId;

      if (!currentUserId) {
        clearNoticeUi();
        clearTodayQuestionUi();
        setPieceQuota(null);
        return { noticeCandidate: null, todayQuestionCandidate: null, aborted: false };
      }

      setNoticeLoading(true);
      if (todayQuestionFeatureEnabled) {
        setTodayQuestionLoading(true);
      } else {
        clearTodayQuestionUi();
      }
      try {
        const json = await getHomeState({
          forceRefresh: force,
          timezoneName: getInputLocalTimezoneName(),
        });
        if (homeStateRequestIdRef.current !== requestId) {
          return { noticeCandidate: null, todayQuestionCandidate: null, aborted: true };
        }

        const normalized = applyHomeStatePayload(json);
        const noticesCurrent = normalized?.noticesCurrent || null;
        const todayQuestionCurrent = todayQuestionFeatureEnabled
          ? normalized?.todayQuestionCurrent || null
          : null;

        if (isTutorialMode) {
          return {
            noticeCandidate: null,
            todayQuestionCandidate: null,
            aborted: false,
            payload: json,
          };
        }

        const popupNotice =
          noticesCurrent?.popup_notice && typeof noticesCurrent.popup_notice === "object"
            ? noticesCurrent.popup_notice
            : null;
        const popupNoticeId = String(
          json?.notice_popup_notice_id || popupNotice?.notice_id || ""
        ).trim();
        const serviceDayKey = String(
          json?.service_day_key || todayQuestionCurrent?.service_day_key || ""
        ).trim();
        const unanswered =
          !!todayQuestionCurrent?.question &&
          String(todayQuestionCurrent?.answer_status || "unanswered") !== "answered";
        const popupCandidates = Array.isArray(json?.popup_candidates)
          ? json.popup_candidates
          : [];
        const candidateKinds = new Set(
          popupCandidates
            .map((candidate) => toStartupPopupKind(candidate?.kind))
            .filter(Boolean)
        );
        const hasExplicitPopupCandidates = candidateKinds.size > 0;

        const canShowNoticeCandidate =
          includeStartupCandidate &&
          noticesCurrent?.feature_enabled !== false &&
          popupNotice &&
          popupNoticeId &&
          dismissedNoticeIdRef.current !== popupNoticeId &&
          (!hasExplicitPopupCandidates || candidateKinds.has(STARTUP_POPUP_KIND.NOTICE));
        const canShowTodayQuestionCandidate =
          todayQuestionFeatureEnabled &&
          includeStartupCandidate &&
          unanswered &&
          serviceDayKey &&
          dismissedTodayQuestionDayRef.current !== serviceDayKey &&
          (!hasExplicitPopupCandidates || candidateKinds.has(STARTUP_POPUP_KIND.TODAY_QUESTION));

        return {
          noticeCandidate: canShowNoticeCandidate
            ? { kind: STARTUP_POPUP_KIND.NOTICE }
            : null,
          todayQuestionCandidate: canShowTodayQuestionCandidate
            ? { kind: STARTUP_POPUP_KIND.TODAY_QUESTION }
            : null,
          aborted: false,
          payload: json,
        };
      } catch (e) {
        if (homeStateRequestIdRef.current !== requestId) {
          return { noticeCandidate: null, todayQuestionCandidate: null, aborted: true };
        }
        console.warn("InputScreen: loadHomeState failed", e);
        return { noticeCandidate: null, todayQuestionCandidate: null, aborted: false };
      } finally {
        if (homeStateRequestIdRef.current === requestId) {
          setNoticeLoading(false);
          setTodayQuestionLoading(false);
        }
      }
    },
    [
      applyHomeStatePayload,
      clearNoticeUi,
      clearTodayQuestionUi,
      currentUserId,
      isTutorialMode,
      todayQuestionFeatureEnabled,
    ]
  );

  const closeStartupPopupWindow = useCallback(() => {
    startupWindowClosedRef.current = true;
    setStartupQueuePreparing(false);
    setStartupPopupQueue([]);
  }, []);

  const advanceStartupPopupQueue = useCallback(() => {
    setStartupPopupQueue((prev) => {
      if (!Array.isArray(prev) || prev.length <= 1) return [];
      return prev.slice(1);
    });
  }, []);

  const activeStartupPopup = startupPopupQueue[0] || null;
  const startupModalVisible = !!activeStartupPopup;
  const isNoticeStartupPopupVisible =
    activeStartupPopup?.kind === STARTUP_POPUP_KIND.NOTICE;
  const isTutorialStartupPopupVisible =
    activeStartupPopup?.kind === STARTUP_POPUP_KIND.TUTORIAL;
  const isTodayQuestionStartupPopupVisible =
    activeStartupPopup?.kind === STARTUP_POPUP_KIND.TODAY_QUESTION;

  const prepareStartupPopupQueue = useCallback(
    async (cycleId) => {
      if (!cycleId) return;
      if (isTutorialMode) {
        setStartupQueuePreparing(false);
        setStartupPopupQueue([]);
        return;
      }

      const tutorialCandidate =
        typeof buildTutorialStartupCandidate === "function"
          ? buildTutorialStartupCandidate()
          : null;
      const homeStateResult = await loadHomeState({ includeStartupCandidate: true });

      if (startupCycleIdRef.current !== cycleId) return;

      if (startupWindowClosedRef.current) {
        setStartupQueuePreparing(false);
        setStartupPopupQueue([]);
        return;
      }

      const nextQueue = sortStartupPopupQueue([
        homeStateResult?.noticeCandidate,
        tutorialCandidate,
        homeStateResult?.todayQuestionCandidate,
      ]);

      setStartupPopupQueue(nextQueue);
      setStartupQueuePreparing(false);
    },
    [buildTutorialStartupCandidate, isTutorialMode, loadHomeState]
  );

  const beginStartupPopupCycle = useCallback(() => {
    const nextCycleId = startupCycleIdRef.current + 1;
    startupCycleIdRef.current = nextCycleId;
    startupPrepareInFlightRef.current = null;
    startupWindowClosedRef.current = false;
    setStartupPopupQueue([]);

    if (isTutorialMode) {
      setStartupQueuePreparing(false);
      return;
    }

    setStartupQueuePreparing(true);
  }, [isTutorialMode]);

  const registerInputInteraction = useCallback(() => {
    if (startupWindowClosedRef.current) return;
    if (startupModalVisible) return;
    closeStartupPopupWindow();
    if (!isTutorialMode) {
      void loadHomeState({ includeStartupCandidate: false });
    }
  }, [closeStartupPopupWindow, isTutorialMode, loadHomeState, startupModalVisible]);

  useEffect(() => {
    if (!currentUserId) {
      closeStartupPopupWindow();
      clearNoticeUi();
      clearTodayQuestionUi();
      setPieceQuota(null);
      return;
    }
    void loadHomeState({ includeStartupCandidate: false });
  }, [clearNoticeUi, clearTodayQuestionUi, closeStartupPopupWindow, currentUserId, isTutorialMode, loadHomeState]);

  useEffect(() => {
    if (todayQuestionFeatureEnabled) return;
    clearTodayQuestionUi();
  }, [clearTodayQuestionUi, todayQuestionFeatureEnabled]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (/inactive|background/.test(appStateRef.current) && nextAppState === "active") {
        void loadHomeState({ includeStartupCandidate: false });
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      try {
        subscription?.remove?.();
      } catch {
        // noop
      }
    };
  }, [loadHomeState]);

  useEffect(() => {
    beginStartupPopupCycle();

    let unsubscribeFocus = null;
    let unsubscribeBlur = null;
    try {
      unsubscribeFocus = navigation?.addListener?.("focus", beginStartupPopupCycle);
      unsubscribeBlur = navigation?.addListener?.("blur", () => {
        startupWindowClosedRef.current = true;
        setStartupQueuePreparing(false);
        setStartupPopupQueue([]);
      });
    } catch {
      // noop
    }

    return () => {
      startupWindowClosedRef.current = true;
      try {
        if (typeof unsubscribeFocus === "function") unsubscribeFocus();
      } catch {
        // noop
      }
      try {
        if (typeof unsubscribeBlur === "function") unsubscribeBlur();
      } catch {
        // noop
      }
    };
  }, [beginStartupPopupCycle, navigation]);

  useEffect(() => {
    if (!startupQueuePreparing) return;
    if (startupWindowClosedRef.current) return;
    if (isTutorialMode) return;
    if (currentUserId && !tutorialFlagsLoaded) return;

    const cycleId = startupCycleIdRef.current;
    if (!cycleId) return;
    if (startupPrepareInFlightRef.current === cycleId) return;

    startupPrepareInFlightRef.current = cycleId;
    void prepareStartupPopupQueue(cycleId).finally(() => {
      if (startupPrepareInFlightRef.current === cycleId) {
        startupPrepareInFlightRef.current = null;
      }
    });
  }, [
    currentUserId,
    isTutorialMode,
    prepareStartupPopupQueue,
    startupQueuePreparing,
    tutorialFlagsLoaded,
  ]);

  useEffect(() => {
    if (!isTutorialMode) return;
    closeStartupPopupWindow();
    homeStateRequestIdRef.current += 1;
    clearTodayQuestionUi();
    clearNoticeUi();
    setPieceQuota(null);
  }, [clearNoticeUi, clearTodayQuestionUi, closeStartupPopupWindow, isTutorialMode]);

  return useMemo(
    () => ({
      globalEmotionUsers,
      homeTodayCount,
      homeMonthCount,
      homeWeekCount,
      homeStreakDays,
      noticeFeatureEnabled,
      noticeUnreadCount,
      setNoticeUnreadCount,
      noticePopup,
      setNoticePopup,
      noticeLoading,
      todayQuestionBundle,
      todayQuestionLoading,
      pieceQuota,
      setPieceQuota,
      loadHomeState,
      rememberDismissedNotice,
      rememberDismissedTodayQuestionDay,
      startupQueuePreparing,
      activeStartupPopup,
      startupModalVisible,
      isNoticeStartupPopupVisible,
      isTutorialStartupPopupVisible,
      isTodayQuestionStartupPopupVisible,
      closeStartupPopupWindow,
      advanceStartupPopupQueue,
      registerInputInteraction,
    }),
    [
      activeStartupPopup,
      advanceStartupPopupQueue,
      closeStartupPopupWindow,
      globalEmotionUsers,
      homeMonthCount,
      homeStreakDays,
      homeTodayCount,
      homeWeekCount,
      isNoticeStartupPopupVisible,
      isTodayQuestionStartupPopupVisible,
      isTutorialStartupPopupVisible,
      loadHomeState,
      noticeFeatureEnabled,
      noticeLoading,
      noticePopup,
      noticeUnreadCount,
      pieceQuota,
      registerInputInteraction,
      rememberDismissedNotice,
      rememberDismissedTodayQuestionDay,
      setNoticePopup,
      setNoticeUnreadCount,
      setPieceQuota,
      startupModalVisible,
      startupQueuePreparing,
      todayQuestionBundle,
      todayQuestionLoading,
    ]
  );
}

export default useHomeState;
