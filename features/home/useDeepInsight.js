import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  getDeepInsight,
  requestDeepInsightQuestion,
  saveDeepInsightAnswer,
} from "../../lib/api/home/deepInsightApi";

export function isUnanswered(question) {
  return Boolean(question && question.answered_at == null);
}

export default function useDeepInsight(ownerId) {
  const current = useRef(null);
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [questionLoads, setQuestionLoads] = useState({});
  const [questionErrors, setQuestionErrors] = useState({});

  const issue = useCallback(async (request, lane, theme) => {
    if (!request || request.signal.aborted || request.lanes.has(lane)) return;
    request.lanes.add(lane);
    setQuestionLoads((prev) => ({ ...prev, [lane]: true }));
    setQuestionErrors((prev) => ({ ...prev, [lane]: false }));
    try {
      const { question, status } = await requestDeepInsightQuestion(lane, theme, request.options);
      if (request.signal.aborted) return;
      if (status === "no_question" && lane === "theme") {
        setQuestionErrors((prev) => ({ ...prev, theme: true }));
      }
      setData((prev) => ({
        ...prev,
        [lane]: question ?? prev[lane],
        [lane === "records" ? "record_available_today" : "theme_available_today"]:
          status === "no_question" && lane === "theme",
      }));
    } catch (error) {
      if (!request.signal.aborted && error?.name !== "AccountChangedError") {
        setQuestionErrors((prev) => ({ ...prev, [lane]: true }));
      }
    } finally {
      request.lanes.delete(lane);
      if (!request.signal.aborted) setQuestionLoads((prev) => ({ ...prev, [lane]: false }));
    }
  }, []);

  const load = useCallback(async (request) => {
    if (!request || request.signal.aborted || request.loading) return;
    request.loading = true;
    setLoadError(false);
    try {
      const result = await getDeepInsight(request.options);
      if (request.signal.aborted) return;
      setData(result);
      if (result.record_available_today && !isUnanswered(result.records)) {
        void issue(request, "records");
      }
    } catch (error) {
      if (!request.signal.aborted && error?.name !== "AccountChangedError") setLoadError(true);
    } finally {
      request.loading = false;
    }
  }, [issue]);

  useFocusEffect(useCallback(() => {
    const controller = new AbortController();
    const request = {
      options: { expectedUserId: ownerId, signal: controller.signal },
      signal: controller.signal,
      lanes: new Set(),
      loading: false,
    };
    current.current = request;
    setData(null);
    setQuestionLoads({});
    setQuestionErrors({});
    void load(request);
    return () => controller.abort();
  }, [load, ownerId]));

  const answer = useCallback(async (question, text) => {
    const request = current.current;
    if (!request || request.signal.aborted) return;
    const result = await saveDeepInsightAnswer(question.id, text, request.options);
    if (request.signal.aborted) return;
    const saved = result.question;
    setData((prev) => ({
      ...prev,
      [saved.lane]: prev[saved.lane]?.id === saved.id ? saved : prev[saved.lane],
      history: [saved, ...(prev.history || []).filter((item) => item.id !== saved.id)],
    }));
  }, []);

  return {
    data,
    loadError,
    questionLoads,
    questionErrors,
    reload: () => load(current.current),
    issueRecords: () => issue(current.current, "records"),
    issueTheme: (theme) => issue(current.current, "theme", theme),
    answer,
  };
}
