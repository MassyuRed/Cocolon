import { apiPost } from "../client";

export async function submitEmotionInput(payload) {
  return apiPost("/emotion/submit", payload || {});
}
