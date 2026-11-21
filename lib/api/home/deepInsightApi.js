import { apiGet, apiPatch, apiPost } from "../client";

export function getDeepInsight(options) {
  return apiGet("/deep-insight", options);
}

export function getDeepInsightQuestion(questionId, options) {
  return apiGet(`/deep-insight/questions/${encodeURIComponent(questionId)}`, options);
}

export function requestDeepInsightQuestion(lane, theme, options) {
  const payload = lane === "theme" ? { lane, theme } : { lane };
  return apiPost("/deep-insight/questions", payload, { ...options, timeoutMs: 140000 });
}

export function saveDeepInsightAnswer(questionId, answerText, options) {
  return apiPost("/deep-insight/answers", { question_id: questionId, answer_text: answerText }, options);
}

export function updateDeepInsightThemeNotification(enabled, options) {
  return apiPatch("/deep-insight/theme-notification", { enabled }, options);
}
