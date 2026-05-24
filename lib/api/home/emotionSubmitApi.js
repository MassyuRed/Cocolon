import { apiPost } from "../client";

export const EMOTION_SUBMIT_TIMEOUT_MS = 30000;

export async function submitEmotionInput(payload) {
  return apiPost("/emotion/submit", payload || {}, {
    timeoutMs: EMOTION_SUBMIT_TIMEOUT_MS,
  });
}
