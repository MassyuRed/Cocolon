import { apiGet, apiPatch } from "../client";

function normalizeOptionalString(value) {
  if (value === null) return null;
  if (value === undefined) return undefined;
  const s = String(value || "").trim();
  return s ? s : null;
}

function buildAuthOverrides(accessToken, expectedUserId, signal) {
  const token = normalizeOptionalString(accessToken);
  if (!token) return { expectedUserId, signal };
  return {
    auth: false,
    signal,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export function getAccountProfileMe({ accessToken, expectedUserId, signal } = {}) {
  return apiGet("/account/profile/me", buildAuthOverrides(accessToken, expectedUserId, signal));
}

export function patchAccountProfileMe(body = {}, { accessToken, expectedUserId, signal } = {}) {
  const payload = { ...body };
  if (!Object.keys(payload).length) {
    return Promise.resolve(null);
  }
  return apiPatch("/account/profile/me", payload, buildAuthOverrides(accessToken, expectedUserId, signal));
}

export async function ensureAccountProfile({ displayName, pushPlatform, accessToken, expectedUserId, signal } = {}) {
  let current = null;
  try {
    current = await getAccountProfileMe({ accessToken, expectedUserId, signal });
  } catch (error) {
    if (error?.name === "AccountChangedError" || error?.name === "AbortError") throw error;
    current = null;
  }
  if (signal?.aborted) {
    const error = new Error("アカウントが変わったためプロフィールの初期化を中止しました。");
    error.name = "AbortError";
    throw error;
  }

  const body = {};
  const nextDisplayName = normalizeOptionalString(displayName);
  const nextPushPlatform = normalizeOptionalString(pushPlatform);
  const currentDisplayName = normalizeOptionalString(current?.display_name);

  if (nextDisplayName && !currentDisplayName) {
    body.display_name = nextDisplayName;
  }
  if (nextPushPlatform) {
    body.push_platform = nextPushPlatform;
  }

  if (!Object.keys(body).length) {
    return current;
  }
  return patchAccountProfileMe(body, { accessToken, expectedUserId, signal });
}

export function syncAccountProfilePushToken({ token, pushPlatform, updatedAt, accessToken, expectedUserId, signal } = {}) {
  const body = {};
  if (token !== undefined) {
    body.push_token = normalizeOptionalString(token);
  }
  if (pushPlatform !== undefined) {
    body.push_platform = normalizeOptionalString(pushPlatform);
  }
  if (updatedAt !== undefined) {
    body.push_token_updated_at = normalizeOptionalString(updatedAt);
  }
  return patchAccountProfileMe(body, { accessToken, expectedUserId, signal });
}

export function clearAccountProfilePushToken({ pushPlatform, accessToken, expectedUserId, signal } = {}) {
  return syncAccountProfilePushToken({
    token: null,
    pushPlatform,
    updatedAt: new Date().toISOString(),
    accessToken,
    expectedUserId,
    signal,
  });
}
