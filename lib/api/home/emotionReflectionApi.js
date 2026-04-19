import { apiGet, apiPost } from "../client";

export async function getEmotionReflectionQuota() {
  return apiGet("/emotion/reflection/quota");
}

export async function previewEmotionReflection(payload) {
  return apiPost("/emotion/reflection/preview", payload);
}

export async function publishEmotionReflection(previewId) {
  return apiPost("/emotion/reflection/publish", { preview_id: previewId });
}

export async function cancelEmotionReflection(previewId) {
  return apiPost("/emotion/reflection/cancel", { preview_id: previewId });
}
