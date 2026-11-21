import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  getDeepInsight,
  requestDeepInsightQuestion,
  saveDeepInsightAnswer,
  updateDeepInsightThemeNotification,
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
  const [notificationSaving, setNotificationSaving] = useState(false);
  const [notificationError, setNotificationError] = useState(false);

  const issue = useCallback(async (request, lane, theme) => {
    if (!request || request.signal.aborted || request.lanes.has(lane)) return;
    request.lanes.add(lane);
    setQuestionLoads((prev) => ({ ...prev, [lane]: true }));
    setQuestionErrors((prev) => ({ ...prev, [lane]: false }));
    try {
      const { question, status, theme_next_available_at: nextThemeAt } =
        await requestDeepInsightQuestion(lane, theme, request.options);
      if (request.signal.aborted) return;
      if (status === "no_question" && lane === "theme") {
        setQuestionErrors((prev) => ({ ...prev, theme: true }));
      }
      setData((prev) => ({
        ...prev,
        [lane]: question ?? prev[lane],
        [lane === "records" ? "record_available_today" : "theme_available_today"]:
          status === "no_question" && lane === "theme" && !nextThemeAt,
        ...(lane === "theme" && nextThemeAt !== undefined ? { theme_next_available_at: nextThemeAt } : {}),
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

  const load = useCallback(async (request, themeOnly = false) => {
    if (!request || request.signal.aborted || request.loading) return;
    request.loading = true;
    const savedDuringRead = themeOnly ? new Map() : null;
    request.savedDuringThemeRead = savedDuringRead;
    if (!themeOnly) setLoadError(false);
    try {
      const result = await getDeepInsight(request.options);
      if (request.signal.aborted) return;
      if (themeOnly) {
        setData((prev) => {
          // A background read can finish after an answer was just saved.
          const history = new Map((result.history || []).map((q) => [q.id, savedDuringRead.get(q.id) ?? q]));
          const missing = [...savedDuringRead.values()].filter((q) => !history.has(q.id));
          return {
            ...prev,
            can_use_theme: result.can_use_theme,
            theme: savedDuringRead.get(result.theme?.id) ?? result.theme,
            theme_available_today: result.theme_available_today,
            theme_next_available_at: result.theme_next_available_at,
            history: [...missing, ...history.values()].slice(0, 40),
          };
        });
        return;
      }
      setData(result);
      if (result.can_use_records !== false && result.record_available_today && !isUnanswered(result.records)) {
        void issue(request, "records");
      }
    } catch (error) {
      if (!themeOnly && !request.signal.aborted && error?.name !== "AccountChangedError") setLoadError(true);
    } finally {
      request.loading = false;
      request.savedDuringThemeRead = null;
    }
  }, [issue]);

  useFocusEffect(useCallback(() => {
    const controller = new AbortController();
    const request = {
      options: { expectedUserId: ownerId, signal: controller.signal },
      signal: controller.signal,
      lanes: new Set(),
      loading: false,
      savingNotification: false,
    };
    current.current = request;
    setData(null);
    setQuestionLoads({});
    setQuestionErrors({});
    setNotificationSaving(false);
    setNotificationError(false);
    void load(request);
    return () => controller.abort();
  }, [load, ownerId]));

  const nextThemeAt = data?.theme_next_available_at;
  const themeAvailable = data?.theme_available_today;
  useEffect(() => {
    const request = current.current;
    const unlockAt = Date.parse(nextThemeAt);
    if (themeAvailable || !Number.isFinite(unlockAt) || !request || request.signal.aborted) return;
    const timer = setTimeout(() => void load(request, true), Math.max(0, unlockAt - Date.now() + 1000));
    const cancel = () => clearTimeout(timer);
    request.signal.addEventListener("abort", cancel);
    return () => {
      request.signal.removeEventListener("abort", cancel);
      cancel();
    };
  }, [load, nextThemeAt, themeAvailable]);

  const answer = useCallback(async (question, text) => {
    const request = current.current;
    if (!request || request.signal.aborted) return;
    const result = await saveDeepInsightAnswer(question.id, text, request.options);
    if (request.signal.aborted) return;
    const saved = result.question;
    request.savedDuringThemeRead?.set(saved.id, saved);
    setData((prev) => ({
      ...prev,
      [saved.lane]: prev[saved.lane]?.id === saved.id ? saved : prev[saved.lane],
      history: [saved, ...(prev.history || []).filter((item) => item.id !== saved.id)],
    }));
    return saved;
  }, []);

  const setThemeNotification = useCallback(async (enabled) => {
    const request = current.current;
    if (!request || request.signal.aborted || request.savingNotification) return;
    request.savingNotification = true;
    setNotificationSaving(true);
    setNotificationError(false);
    try {
      const { enabled: saved } = await updateDeepInsightThemeNotification(enabled, request.options);
      if (typeof saved !== "boolean") throw new Error("Invalid theme notification preference");
      if (!request.signal.aborted) setData((prev) => ({ ...prev, theme_notification_enabled: saved }));
    } catch (error) {
      if (!request.signal.aborted && error?.name !== "AccountChangedError") setNotificationError(true);
    } finally {
      request.savingNotification = false;
      if (!request.signal.aborted) setNotificationSaving(false);
    }
  }, []);

  return {
    data,
    loadError,
    questionLoads,
    questionErrors,
    notificationSaving,
    notificationError,
    setThemeNotification,
    reload: () => load(current.current),
    issueRecords: () => data?.can_use_records !== false && issue(current.current, "records"),
    issueTheme: (theme) => issue(current.current, "theme", theme),
    answer,
  };
}
