import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  getDeepInsight,
  getDeepInsightQuestion,
  requestDeepInsightQuestion,
  saveDeepInsightAnswer,
  updateDeepInsightThemeNotification,
} from "../../lib/api/home/deepInsightApi";
import { getEmotionRecordRevision, subscribeEmotionRecordChanges } from "../../lib/emotionRecordChanges";

export function isUnanswered(question) {
  return Boolean(question && question.answered_at == null);
}

function readStamp(request) {
  const day = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return [day, getEmotionRecordRevision(request.ownerId), request.cache.foregroundRevision].join(":");
}

function pastExpiry(snapshot, expiresAt) {
  const expiry = Date.parse(expiresAt);
  return Number.isFinite(expiry) && expiry <= Date.now() && snapshot?.readAt < expiry;
}

function themeUnlockDue(snapshot) {
  const next = snapshot?.data.theme_next_available_at;
  return snapshot && !snapshot.data.theme_available_today && snapshot.checkedThemeUnlock !== next
    && Date.parse(next) <= Date.now();
}

function reusableSnapshot(cache, accessKey, notification, expiresAt) {
  const entry = cache.snapshot;
  return entry?.accessKey === accessKey && entry.notification === notification && !pastExpiry(entry, expiresAt)
    ? entry : null;
}

export default function useDeepInsight(ownerId, notification, { accessKey, returnCache, expiresAt }) {
  const fallbackCache = useRef({ snapshot: null, foregroundRevision: 0 });
  const cache = returnCache ?? fallbackCache.current;
  const current = useRef(null);
  const [view, setView] = useState(() => reusableSnapshot(cache, accessKey, notification, expiresAt));
  const [loadError, setLoadError] = useState(false);
  const [themeRefreshError, setThemeRefreshError] = useState(false);
  const [questionLoads, setQuestionLoads] = useState({});
  const [questionErrors, setQuestionErrors] = useState({});
  const [notificationSaving, setNotificationSaving] = useState(false);
  const [notificationError, setNotificationError] = useState(false);
  const isCurrent = useCallback((request) => current.current === request && !request.signal.aborted, []);

  const publish = useCallback((request, next) => {
    if (!isCurrent(request)) return;
    request.view = next;
    if (request.cache.writer === request) request.cache.snapshot = next;
    setView(next);
  }, [isCurrent]);

  const changeData = useCallback((request, transform) => {
    if (!isCurrent(request) || !request.view) return;
    request.writes += 1;
    publish(request, transform(request.view));
  }, [isCurrent, publish]);

  const issue = useCallback(async (request, lane, theme) => {
    if (!request || !isCurrent(request) || request.lanes.has(lane)) return;
    request.lanes.add(lane);
    setQuestionLoads((prev) => ({ ...prev, [lane]: true }));
    setQuestionErrors((prev) => ({ ...prev, [lane]: false }));
    try {
      const { question, status, theme_next_available_at: nextThemeAt } =
        await requestDeepInsightQuestion(lane, theme, request.options);
      if (!isCurrent(request)) return;
      if (status === "no_question" && lane === "theme") {
        setQuestionErrors((prev) => ({ ...prev, theme: true }));
      }
      changeData(request, (previous) => ({
        ...previous,
        data: {
          ...previous.data,
          [lane]: question ?? previous.data[lane],
          [lane === "records" ? "record_available_today" : "theme_available_today"]:
            status === "no_question" && lane === "theme" && !nextThemeAt,
          ...(lane === "theme" && nextThemeAt !== undefined ? { theme_next_available_at: nextThemeAt } : {}),
        },
      }));
    } catch (error) {
      if (isCurrent(request) && error?.name !== "AccountChangedError") {
        setQuestionErrors((prev) => ({ ...prev, [lane]: true }));
        if (lane === "records" && request.view) publish(request, { ...request.view, stamp: null });
      }
    } finally {
      request.lanes.delete(lane);
      if (isCurrent(request)) setQuestionLoads((prev) => ({ ...prev, [lane]: false }));
    }
  }, [changeData, isCurrent, publish]);

  const issueIfAvailable = useCallback((request) => {
    if (!request.focused || !request.autoIssueRecords || request.notifiedQuestionId) return;
    request.autoIssueRecords = false;
    void issue(request, "records");
  }, [issue]);

  const load = useCallback(async function read(request, themeOnly = false) {
    if (!request || !isCurrent(request)) return;
    if (request.loading) {
      if (!themeOnly && request.readStamp !== readStamp(request)) request.followup = true;
      if (themeOnly && themeUnlockDue(request.view)) request.followupTheme = true;
      return;
    }
    request.loading = true;
    request.readStamp = readStamp(request);
    const requestedAt = Date.now();
    const writes = request.writes;
    if (!themeOnly) setLoadError(false);
    setThemeRefreshError(false);
    try {
      const result = await getDeepInsight(request.options);
      if (!isCurrent(request)) return;
      let notifiedQuestion = null;
      let notificationReadFailed = false;
      const questionId = request.notifiedQuestionId;
      if (!themeOnly && questionId) {
        const matches = (question) => question?.id === questionId && question.lane === "records";
        try {
          const question = [result.records, ...(result.history || [])].find(matches)
            ?? await getDeepInsightQuestion(questionId, request.options);
          if (!isCurrent(request)) return;
          notifiedQuestion = matches(question) ? question : null;
          notificationReadFailed = !notifiedQuestion;
        } catch (error) {
          if (!isCurrent(request) || error?.name === "AccountChangedError") return;
          notificationReadFailed = true;
        }
      }
      // A concurrent successful mutation is newer than this read, so refresh
      // from the server again without replacing the saved local result.
      if (writes !== request.writes) {
        request.followup = true;
        return;
      }
      const previous = request.view;
      if (themeOnly && previous) {
        publish(request, {
          ...previous,
          checkedThemeUnlock: previous.data.theme_next_available_at,
          data: {
            ...previous.data,
            can_use_theme: result.can_use_theme,
            theme: result.theme,
            theme_available_today: result.theme_available_today,
            theme_next_available_at: result.theme_next_available_at,
            history: result.history,
          },
        });
        return;
      }
      publish(request, {
        accessKey: request.accessKey,
        notification: request.notification,
        stamp: request.readStamp,
        readAt: requestedAt,
        checkedThemeUnlock: previous && Date.parse(result.theme_next_available_at) <= requestedAt
          ? result.theme_next_available_at : null,
        data: result,
        notifiedQuestion,
        notificationReadFailed,
      });
      request.autoIssueRecords = !questionId && result.can_use_records !== false
        && result.record_available_today && !isUnanswered(result.records);
      issueIfAvailable(request);
    } catch (error) {
      if (isCurrent(request) && error?.name !== "AccountChangedError") {
        if (themeOnly) setThemeRefreshError(true);
        else if (!request.view) setLoadError(true);
      }
    } finally {
      request.loading = false;
      const checkTheme = request.followupTheme && themeUnlockDue(request.view);
      request.followupTheme = false;
      if (isCurrent(request) && request.followup) {
        request.followup = false;
        if (request.focused) void read(request);
        else if (request.view) publish(request, { ...request.view, stamp: null });
      } else if (isCurrent(request) && request.focused && checkTheme) {
        void read(request, true);
      }
    }
  }, [isCurrent, issueIfAvailable, publish]);

  useEffect(() => {
    const controller = new AbortController();
    const initial = reusableSnapshot(cache, accessKey, notification, expiresAt);
    const request = {
      options: { expectedUserId: ownerId, signal: controller.signal },
      signal: controller.signal,
      accessKey,
      cache,
      ownerId,
      notification,
      notifiedQuestionId: notification?.lane === "records" ? notification.questionId : null,
      view: initial,
      lanes: new Set(),
      answers: new Set(),
      writes: 0,
    };
    current.current = request;
    setView(initial);
    setLoadError(false);
    setThemeRefreshError(false);
    setQuestionLoads({});
    setQuestionErrors({});
    setNotificationSaving(false);
    setNotificationError(false);
    return () => {
      controller.abort();
      if (cache.writer === request) {
        // A write in flight can have reached the server even after abort.
        if (request.lanes.size || request.answers.size || request.savingNotification || request.autoIssueRecords) {
          if (cache.snapshot) cache.snapshot = { ...cache.snapshot, stamp: null };
        }
        cache.writer = null;
      }
    };
  }, [accessKey, cache, expiresAt, notification, ownerId]);

  useFocusEffect(useCallback(() => {
    const request = current.current;
    if (!request || !isCurrent(request)) return undefined;
    request.focused = true;
    cache.writer = request;
    const refresh = () => {
      if (!request.focused || !isCurrent(request)) return;
      if (pastExpiry(request.view, expiresAt)) publish(request, null);
      if (request.view?.stamp !== readStamp(request)) void load(request);
      else if (themeUnlockDue(request.view)) void load(request, true);
      else issueIfAvailable(request);
    };
    const unsubscribe = subscribeEmotionRecordChanges(refresh);
    let previousState = AppState.currentState;
    const appState = AppState.addEventListener("change", (state) => {
      if (state === "active" && previousState !== "active") {
        if (!returnCache) cache.foregroundRevision += 1;
        // Let the navigator's foreground counter advance before reading it.
        void Promise.resolve().then(refresh);
      }
      previousState = state;
    });
    refresh();
    return () => {
      request.focused = false;
      unsubscribe();
      appState.remove();
    };
  }, [accessKey, cache, expiresAt, isCurrent, issueIfAvailable, load, notification, publish, returnCache]));

  const savedView = view?.notification === notification ? view : null;
  const data = savedView?.data;
  const nextThemeAt = data?.theme_next_available_at;
  const themeAvailable = data?.theme_available_today;
  useEffect(() => {
    const request = current.current;
    const unlockAt = Date.parse(nextThemeAt);
    if (themeAvailable || !Number.isFinite(unlockAt) || !request || !isCurrent(request)
        || savedView.checkedThemeUnlock === nextThemeAt) return undefined;
    const timer = setTimeout(() => {
      if (request.focused) void load(request, true);
    }, Math.max(0, unlockAt - Date.now() + 1000));
    return () => clearTimeout(timer);
  }, [accessKey, isCurrent, load, nextThemeAt, notification, savedView?.checkedThemeUnlock, themeAvailable]);

  useEffect(() => {
    const request = current.current;
    const expiry = Date.parse(expiresAt);
    if (!request || !savedView || !Number.isFinite(expiry) || savedView.readAt >= expiry
        || expiry - Date.now() > 2_147_483_647) return undefined;
    const timer = setTimeout(() => {
      if (!isCurrent(request) || !pastExpiry(request.view, expiresAt)) return;
      publish(request, null);
      if (request.focused) void load(request);
    }, Math.max(0, expiry - Date.now()));
    return () => clearTimeout(timer);
  }, [expiresAt, isCurrent, load, publish, savedView?.readAt]);

  const answer = useCallback(async (question, text) => {
    const request = current.current;
    if (!request || !isCurrent(request) || request.answers.has(question.id)) return;
    request.answers.add(question.id);
    try {
      const result = await saveDeepInsightAnswer(question.id, text, request.options);
      if (!isCurrent(request)) return;
      const saved = result.question;
      changeData(request, (previous) => ({
        ...previous,
        notifiedQuestion: previous.notifiedQuestion?.id === saved.id ? saved : previous.notifiedQuestion,
        data: {
          ...previous.data,
          [saved.lane]: previous.data[saved.lane]?.id === saved.id ? saved : previous.data[saved.lane],
          history: [saved, ...(previous.data.history || []).filter((item) => item.id !== saved.id)],
        },
      }));
      return saved;
    } finally {
      request.answers.delete(question.id);
    }
  }, [changeData, isCurrent]);

  const setThemeNotification = useCallback(async (enabled) => {
    const request = current.current;
    if (!request || !isCurrent(request) || request.savingNotification) return;
    request.savingNotification = true;
    setNotificationSaving(true);
    setNotificationError(false);
    try {
      const { enabled: saved } = await updateDeepInsightThemeNotification(enabled, request.options);
      if (typeof saved !== "boolean") throw new Error("Invalid theme notification preference");
      changeData(request, (previous) => ({
        ...previous, data: { ...previous.data, theme_notification_enabled: saved },
      }));
    } catch (error) {
      if (isCurrent(request) && error?.name !== "AccountChangedError") setNotificationError(true);
    } finally {
      request.savingNotification = false;
      if (isCurrent(request)) setNotificationSaving(false);
    }
  }, [changeData, isCurrent]);

  return {
    data,
    loadError,
    notifiedQuestion: savedView?.notifiedQuestion,
    notificationReadFailed: savedView?.notificationReadFailed,
    themeRefreshError,
    questionLoads,
    questionErrors,
    notificationSaving,
    notificationError,
    setThemeNotification,
    reload: () => load(current.current),
    refreshTheme: () => load(current.current, true),
    issueRecords: () => data?.can_use_records !== false && issue(current.current, "records"),
    issueTheme: (theme) => issue(current.current, "theme", theme),
    answer,
  };
}
