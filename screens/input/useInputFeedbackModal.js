import { useCallback, useState } from "react";

export function useInputFeedbackModal({
  isTutorialMode,
  navigation,
  setTutorialStep,
  analysisStep = 8,
}) {
  const [inputFeedbackModalVisible, setInputFeedbackModalVisible] = useState(false);
  const [inputFeedbackModalText, setInputFeedbackModalText] = useState("");
  const [inputFeedbackModalMeta, setInputFeedbackModalMeta] = useState({
    emotionSummary: "",
    dominantSummary: "",
    contextLabel: "",
  });
  const [tutorialNavigateAfterReply, setTutorialNavigateAfterReply] = useState(false);

  const openInputFeedbackModal = useCallback((input = {}) => {
    const nextCommentText = String(input?.commentText || "").trim();
    if (!nextCommentText) return;
    setInputFeedbackModalText(nextCommentText);
    setInputFeedbackModalMeta({
      emotionSummary: String(input?.emotionSummary || "").trim(),
      dominantSummary: String(input?.dominantSummary || input?.dominantLabel || "").trim(),
      contextLabel: String(input?.contextLabel || "").trim(),
    });
    setInputFeedbackModalVisible(true);
  }, []);

  const resetInputFeedbackModal = useCallback(() => {
    setInputFeedbackModalVisible(false);
    setInputFeedbackModalText("");
    setInputFeedbackModalMeta({
      emotionSummary: "",
      dominantSummary: "",
      contextLabel: "",
    });
    setTutorialNavigateAfterReply(false);
  }, []);

  const closeInputFeedbackModal = useCallback(() => {
    setInputFeedbackModalVisible(false);

    if (!tutorialNavigateAfterReply || !isTutorialMode) return;

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
  }, [analysisStep, isTutorialMode, navigation, setTutorialStep, tutorialNavigateAfterReply]);

  return {
    inputFeedbackModalVisible,
    inputFeedbackModalText,
    inputFeedbackModalMeta,
    tutorialNavigateAfterReply,
    setTutorialNavigateAfterReply,
    openInputFeedbackModal,
    closeInputFeedbackModal,
    resetInputFeedbackModal,
  };
}

export default useInputFeedbackModal;
