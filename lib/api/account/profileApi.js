import { apiGet, apiPatch } from "../client";

function normalizeOptionalString(value) {
  if (value === null) return null;
  if (value === undefined) return undefined;
  const s = String(value || "").trim();
  return s ? s : null;
}

function buildAuthOverrides(accessToken) {
  const token = normalizeOptionalString(accessToken);
  if (!token) return {};
  return {
    auth: false,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export function getAccountProfileMe({ accessToken } = {}) {
  return apiGet("/account/profile/me", buildAuthOverrides(accessToken));
}

export function patchAccountProfileMe(body = {}, { accessToken } = {}) {
  const payload = { ...body };
  if (!Object.keys(payload).length) {
    return Promise.resolve(null);
  }
  return apiPatch("/account/profile/me", payload, buildAuthOverrides(accessToken));
}

export async function ensureAccountProfile({ displayName, pushPlatform, accessToken } = {}) {
  let current = null;
  try {
    current = await getAccountProfileMe({ accessToken });
  } catch {
    current = null;
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
  return patchAccountProfileMe(body, { accessToken });
}

export function syncAccountProfilePushToken({ token, pushPlatform, updatedAt, accessToken } = {}) {
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
  return patchAccountProfileMe(body, { accessToken });
}

export function clearAccountProfilePushToken({ pushPlatform, accessToken } = {}) {
  return syncAccountProfilePushToken({
    token: null,
    pushPlatform,
    updatedAt: new Date().toISOString(),
    accessToken,
  });
}
