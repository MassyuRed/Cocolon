import { apiGet, apiPost } from "../client";

export function getDeepInsight(options) {
  return apiGet("/deep-insight", options);
}

export function requestDeepInsightQuestion(lane, theme, options) {
  const payload = lane === "theme" ? { lane, theme } : { lane };
  return apiPost("/deep-insight/questions", payload, { ...options, timeoutMs: 140000 });
}

export function saveDeepInsightAnswer(questionId, answerText, options) {
  return apiPost("/deep-insight/answers", { question_id: questionId, answer_text: answerText }, options);
}
