import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState, Keyboard } from "react-native";

import {
  clearInputDraft,
  formatDraftSavedAt,
  hasInputDraftContent,
  loadInputDraft,
  normalizeInputDraftData,
  saveInputDraft,
} from "./inputDraftModel";

export function useInputDraftPersistence({
  currentUserId,
  isTutorialMode,
  navigation,
  inputDraftData,
  startupQueuePreparing,
  startupModalVisible,
  noticeLoading,
  todayQuestionLoading,
  inputFeedbackModalVisible,
  applyInputDraft,
  showToast,
}) {
  const draftSaveTimerRef = useRef(null);
  const draftLoadRequestIdRef = useRef(0);
  const latestInputDraftDataRef = useRef(null);
  const [pendingInputDraft, setPendingInputDraft] = useState(null);
  const [draftRestoreModalVisible, setDraftRestoreModalVisible] = useState(false);
  const [draftBootstrapComplete, setDraftBootstrapComplete] = useState(false);

  latestInputDraftDataRef.current = inputDraftData;

  const hasCurrentDraftContent = useMemo(
    () => hasInputDraftContent(inputDraftData),
    [inputDraftData]
  );

  const shouldShowDraftRestorePrompt = useMemo(() => {
    if (!pendingInputDraft) return false;
    if (isTutorialMode) return false;
    if (startupQueuePreparing || startupModalVisible) return false;
    if (noticeLoading || todayQuestionLoading) return false;
    if (inputFeedbackModalVisible) return false;
    if (hasCurrentDraftContent) return false;
    return true;
  }, [
    hasCurrentDraftContent,
    inputFeedbackModalVisible,
    isTutorialMode,
    noticeLoading,
    pendingInputDraft,
    startupModalVisible,
    startupQueuePreparing,
    todayQuestionLoading,
  ]);

  const draftPersistenceBlocked =
    !draftBootstrapComplete ||
    !currentUserId ||
    isTutorialMode ||
    !!pendingInputDraft ||
    draftRestoreModalVisible;

  const clearPersistedInputDraft = useCallback(async () => {
    if (!currentUserId) return;
    try {
      await clearInputDraft(currentUserId);
    } catch (e) {
      console.warn("InputScreen: clearInputDraft failed", e);
    }
  }, [currentUserId]);

  const persistCurrentInputDraft = useCallback(async () => {
    if (!currentUserId || isTutorialMode) return;

    const nextDraftData = normalizeInputDraftData(
      latestInputDraftDataRef.current || {}
    );

    try {
      if (hasInputDraftContent(nextDraftData)) {
        await saveInputDraft(currentUserId, nextDraftData);
      } else {
        await clearInputDraft(currentUserId);
      }
    } catch (e) {
      console.warn("InputScreen: persistCurrentInputDraft failed", e);
    }
  }, [currentUserId, isTutorialMode]);

  const restorePendingInputDraft = useCallback(() => {
    const restored = normalizeInputDraftData(pendingInputDraft?.data || {});
    applyInputDraft?.(restored);
    Keyboard.dismiss();
    setDraftRestoreModalVisible(false);
    setPendingInputDraft(null);
    showToast?.("前回の内容を復元しました");
  }, [applyInputDraft, pendingInputDraft, showToast]);

  const discardPendingInputDraft = useCallback(async () => {
    setDraftRestoreModalVisible(false);
    setPendingInputDraft(null);
    await clearPersistedInputDraft();
  }, [clearPersistedInputDraft]);

  const draftRestoreSavedAtLabel = useMemo(
    () => formatDraftSavedAt(pendingInputDraft?.savedAt),
    [pendingInputDraft?.savedAt]
  );

  useEffect(() => {
    return () => {
      try {
        if (draftSaveTimerRef.current) {
          clearTimeout(draftSaveTimerRef.current);
        }
      } catch {
        // noop
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const requestId = draftLoadRequestIdRef.current + 1;
    draftLoadRequestIdRef.current = requestId;

    if (!currentUserId || isTutorialMode) {
      setPendingInputDraft(null);
      setDraftRestoreModalVisible(false);
      setDraftBootstrapComplete(true);
      return () => {
        cancelled = true;
      };
    }

    setDraftBootstrapComplete(false);

    const run = async () => {
      try {
        const restored = await loadInputDraft(currentUserId);
        if (cancelled || draftLoadRequestIdRef.current !== requestId) return;

        if (restored && !hasInputDraftContent(latestInputDraftDataRef.current)) {
          setPendingInputDraft(restored);
        } else {
          setPendingInputDraft(null);
          setDraftRestoreModalVisible(false);
        }
      } catch (e) {
        if (!cancelled) {
          console.warn("InputScreen: loadInputDraft failed", e);
          setPendingInputDraft(null);
          setDraftRestoreModalVisible(false);
        }
      } finally {
        if (!cancelled && draftLoadRequestIdRef.current === requestId) {
          setDraftBootstrapComplete(true);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [currentUserId, isTutorialMode]);

  useEffect(() => {
    setDraftRestoreModalVisible(shouldShowDraftRestorePrompt);
  }, [shouldShowDraftRestorePrompt]);

  useEffect(() => {
    if (!pendingInputDraft) return;
    if (!hasCurrentDraftContent) return;
    setPendingInputDraft(null);
    setDraftRestoreModalVisible(false);
  }, [hasCurrentDraftContent, pendingInputDraft]);

  useEffect(() => {
    try {
      if (draftSaveTimerRef.current) {
        clearTimeout(draftSaveTimerRef.current);
        draftSaveTimerRef.current = null;
      }
    } catch {
      // noop
    }

    if (draftPersistenceBlocked) return;

    draftSaveTimerRef.current = setTimeout(() => {
      draftSaveTimerRef.current = null;
      void persistCurrentInputDraft();
    }, 1000);

    return () => {
      try {
        if (draftSaveTimerRef.current) {
          clearTimeout(draftSaveTimerRef.current);
          draftSaveTimerRef.current = null;
        }
      } catch {
        // noop
      }
    };
  }, [
    draftPersistenceBlocked,
    persistCurrentInputDraft,
    inputDraftData,
  ]);

  useEffect(() => {
    if (draftPersistenceBlocked) return;

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (/inactive|background/.test(String(nextAppState || ""))) {
        void persistCurrentInputDraft();
      }
    });

    return () => {
      try {
        subscription?.remove?.();
      } catch {
        // noop
      }
    };
  }, [draftPersistenceBlocked, persistCurrentInputDraft]);

  useEffect(() => {
    if (draftPersistenceBlocked) return;

    let unsubscribe = null;
    try {
      unsubscribe = navigation?.addListener?.("blur", () => {
        void persistCurrentInputDraft();
      });
    } catch {
      // noop
    }

    return () => {
      try {
        if (typeof unsubscribe === "function") unsubscribe();
      } catch {
        // noop
      }
    };
  }, [draftPersistenceBlocked, navigation, persistCurrentInputDraft]);

  return {
    pendingInputDraft,
    setPendingInputDraft,
    draftRestoreModalVisible,
    setDraftRestoreModalVisible,
    draftBootstrapComplete,
    hasCurrentDraftContent,
    clearPersistedInputDraft,
    persistCurrentInputDraft,
    restorePendingInputDraft,
    discardPendingInputDraft,
    draftRestoreSavedAtLabel,
  };
}

export default useInputDraftPersistence;
