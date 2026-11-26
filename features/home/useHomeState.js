import { AppState } from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getHomeState } from "../../lib/api/home/homeStateApi";
import { getEmotionRecordRevision } from "../../lib/emotionRecordChanges";
import { PIECE_WIRE, readWireSectionObject } from "../../lib/compat/legacyWireContracts";

export const STARTUP_POPUP_KIND = Object.freeze({
  NOTICE: "notice",
  TUTORIAL: "tutorial",
});

const STARTUP_POPUP_PRIORITY = Object.freeze({
  [STARTUP_POPUP_KIND.NOTICE]: 300,
  [STARTUP_POPUP_KIND.TUTORIAL]: 200,
});

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
  return null;
}

export function useHomeState({
  currentUserId,
  authOwnerGeneration,
  subscriptionTier,
  isTutorialMode,
  tutorialFlagsLoaded,
  navigation,
  buildTutorialStartupCandidate,
}) {
  const [initialHomeRead, setInitialHomeRead] = useState({ owner: null, settled: false, error: false });
  const accessKey = JSON.stringify([currentUserId, authOwnerGeneration, subscriptionTier, isTutorialMode]);
  const currentAccessRef = useRef(accessKey);
  currentAccessRef.current = accessKey;
  const lastHomeRead = useRef(null);
  const [homeTodayCount, setHomeTodayCount] = useState(null);
  const [homeMonthCount, setHomeMonthCount] = useState(null);
  const [homeWeekCount, setHomeWeekCount] = useState(null);
  const [homeStreakDays, setHomeStreakDays] = useState(null);

  const [noticeFeatureEnabled, setNoticeFeatureEnabled] = useState(true);
  const [noticePopup, setNoticePopup] = useState(null);
  const [noticeLoading, setNoticeLoading] = useState(false);
  const [pieceQuota, setPieceQuota] = useState(null);

  const [startupQueuePreparing, setStartupQueuePreparing] = useState(false);
  const [startupPopupQueue, setStartupPopupQueue] = useState([]);

  const appStateRef = useRef(AppState.currentState);
  const homeStateRequestIdRef = useRef(0);
  const dismissedNoticeIdRef = useRef(null);
  const startupCycleIdRef = useRef(0);
  const startupPrepareInFlightRef = useRef(null);
  const startupWindowClosedRef = useRef(false);

  const clearNoticeUi = useCallback(() => {
    setNoticeFeatureEnabled(true);
    setNoticePopup(null);
    setNoticeLoading(false);
  }, []);

  const rememberDismissedNotice = useCallback((noticeId) => {
    const nextNoticeId = String(noticeId || "").trim();
    dismissedNoticeIdRef.current = nextNoticeId || null;
  }, []);

  const applyHomeStatePayload = useCallback(
    (json) => {
      const {
        inputSummary,
        globalSummary,
        noticesCurrent,
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

      if (isTutorialMode) {
        clearNoticeUi();
        setPieceQuota(null);
      } else {
        setNoticeFeatureEnabled(noticesCurrent?.feature_enabled !== false);
        setNoticePopup(
          noticesCurrent?.popup_notice && typeof noticesCurrent.popup_notice === "object"
            ? noticesCurrent.popup_notice
            : null
        );
        setPieceQuota(nextQuota);
      }

      return {
        inputSummary,
        globalSummary,
        noticesCurrent,
        pieceQuota: nextQuota,
      };
    },
    [clearNoticeUi, isTutorialMode]
  );

  const loadHomeState = useCallback(
    async ({ force = false, includeStartupCandidate = true } = {}) => {
      if (!currentUserId) {
        lastHomeRead.current = null;
        clearNoticeUi();
        setPieceQuota(null);
        return { noticeCandidate: null, aborted: false };
      }

      const requestOwner = currentUserId;
      const day = new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 10);
      const recordRevision = getEmotionRecordRevision(requestOwner);
      const saved = lastHomeRead.current;
      const reuse = !force && includeStartupCandidate && saved?.accessKey === accessKey &&
        saved.day === day && saved.recordRevision === recordRevision;
      const requestId = reuse ? homeStateRequestIdRef.current : ++homeStateRequestIdRef.current;
      const isCurrentRequest = () => homeStateRequestIdRef.current === requestId && currentAccessRef.current === accessKey;
      if (!reuse) setNoticeLoading(true);
      try {
        const json = reuse ? saved.payload : await getHomeState({ forceRefresh: force, expectedUserId: requestOwner });
        if (!isCurrentRequest()) {
          return { noticeCandidate: null, aborted: true };
        }

        if (!reuse) {
          lastHomeRead.current = { accessKey, day, recordRevision, payload: json };
          setInitialHomeRead({ owner: requestOwner, settled: true, error: false });
        }
        const normalized = reuse ? normalizeHomeSections(json) : applyHomeStatePayload(json);
        const noticesCurrent = normalized?.noticesCurrent || null;
        if (isTutorialMode) {
          return {
            noticeCandidate: null,
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
        return {
          noticeCandidate: canShowNoticeCandidate
            ? { kind: STARTUP_POPUP_KIND.NOTICE }
            : null,
          aborted: false,
          payload: json,
        };
      } catch (e) {
        if (!isCurrentRequest()) {
          return { noticeCandidate: null, aborted: true };
        }
        setInitialHomeRead({ owner: requestOwner, settled: true, error: true });
        console.warn("InputScreen: loadHomeState failed", e);
        return { noticeCandidate: null, aborted: false };
      } finally {
        if (!reuse && isCurrentRequest()) {
          setNoticeLoading(false);
        }
      }
    },
    [
      accessKey,
      applyHomeStatePayload,
      clearNoticeUi,
      currentUserId,
      isTutorialMode,
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
      setPieceQuota(null);
      return;
    }
    void loadHomeState({ includeStartupCandidate: false });
  }, [clearNoticeUi, closeStartupPopupWindow, currentUserId, isTutorialMode, loadHomeState]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState !== "active") {
        lastHomeRead.current = null;
        homeStateRequestIdRef.current += 1;
      }
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
    clearNoticeUi();
    setPieceQuota(null);
  }, [clearNoticeUi, closeStartupPopupWindow, isTutorialMode]);

  return useMemo(
    () => ({
      initialHomeReadComplete: isTutorialMode || (initialHomeRead.owner === currentUserId && initialHomeRead.settled),
      homeReadError: initialHomeRead.owner === currentUserId && initialHomeRead.error,
      homeTodayCount,
      homeMonthCount,
      homeWeekCount,
      homeStreakDays,
      noticeFeatureEnabled,
      noticePopup,
      setNoticePopup,
      noticeLoading,
      pieceQuota,
      setPieceQuota,
      loadHomeState,
      rememberDismissedNotice,
      startupQueuePreparing,
      startupModalVisible,
      isNoticeStartupPopupVisible,
      isTutorialStartupPopupVisible,
      closeStartupPopupWindow,
      advanceStartupPopupQueue,
      registerInputInteraction,
    }),
    [
      advanceStartupPopupQueue,
      closeStartupPopupWindow,
      initialHomeRead,
      currentUserId,
      isTutorialMode,
      homeMonthCount,
      homeStreakDays,
      homeTodayCount,
      homeWeekCount,
      isNoticeStartupPopupVisible,
      isTutorialStartupPopupVisible,
      loadHomeState,
      noticeFeatureEnabled,
      noticeLoading,
      noticePopup,
      pieceQuota,
      registerInputInteraction,
      rememberDismissedNotice,
      setNoticePopup,
      setPieceQuota,
      startupModalVisible,
      startupQueuePreparing,
    ]
  );
}

export default useHomeState;
