import { useCallback, useState } from "react";
import {
  buildPassedEmlisObservationModalPayload,
  getEmlisObservationStatus,
} from "./inputFeedbackModel";

const EMPTY_INPUT_FEEDBACK_META = Object.freeze({
  emotionSummary: "",
  dominantSummary: "",
  contextLabel: "",
  observationStatus: "",
});

export function useInputFeedbackModal({
  isTutorialMode,
  navigation,
  setTutorialStep,
  analysisStep = 8,
}) {
  const [inputFeedbackModalVisible, setInputFeedbackModalVisible] = useState(false);
  const [inputFeedbackModalText, setInputFeedbackModalText] = useState("");
  const [inputFeedbackModalMeta, setInputFeedbackModalMeta] = useState(EMPTY_INPUT_FEEDBACK_META);
  const [tutorialNavigateAfterReply, setTutorialNavigateAfterReply] = useState(false);

  const openInputFeedbackModal = useCallback((input = {}) => {
    const payload = buildPassedEmlisObservationModalPayload(input);
    if (!payload) {
      setInputFeedbackModalVisible(false);
      setInputFeedbackModalText("");
      setInputFeedbackModalMeta({
        ...EMPTY_INPUT_FEEDBACK_META,
        observationStatus: getEmlisObservationStatus(input),
      });
      return false;
    }
    setInputFeedbackModalText(payload.commentText);
    setInputFeedbackModalMeta({
      emotionSummary: payload.emotionSummary,
      dominantSummary: payload.dominantSummary,
      contextLabel: payload.contextLabel,
      observationStatus: payload.observationStatus,
    });
    setInputFeedbackModalVisible(true);
    return true;
  }, []);

  const resetInputFeedbackModal = useCallback(() => {
    setInputFeedbackModalVisible(false);
    setInputFeedbackModalText("");
    setInputFeedbackModalMeta(EMPTY_INPUT_FEEDBACK_META);
    setTutorialNavigateAfterReply(false);
  }, []);

  const completeTutorialAfterReply = useCallback(() => {
    if (!isTutorialMode) return false;

    setTutorialNavigateAfterReply(false);
    setTutorialStep(analysisStep);

    requestAnimationFrame(() => {
      try {
        const parent =
          typeof navigation?.getParent === "function" ? navigation.getParent() : null;
        if (parent && typeof parent.navigate === "function") {
          parent.navigate("Analysis");
          return;
        }
      } catch {
        // noop
      }

      try {
        navigation?.navigate?.("Analysis");
      } catch {
        // noop
      }
    });
    return true;
  }, [analysisStep, isTutorialMode, navigation, setTutorialStep]);

  const closeInputFeedbackModal = useCallback(() => {
    setInputFeedbackModalVisible(false);

    if (!tutorialNavigateAfterReply || !isTutorialMode) return;

    completeTutorialAfterReply();
  }, [completeTutorialAfterReply, isTutorialMode, tutorialNavigateAfterReply]);

  return {
    inputFeedbackModalVisible,
    inputFeedbackModalText,
    inputFeedbackModalMeta,
    tutorialNavigateAfterReply,
    setTutorialNavigateAfterReply,
    openInputFeedbackModal,
    closeInputFeedbackModal,
    completeTutorialAfterReply,
    resetInputFeedbackModal,
  };
}

export default useInputFeedbackModal;
