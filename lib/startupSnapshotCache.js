import AsyncStorage from "@react-native-async-storage/async-storage";

export const STARTUP_SNAPSHOT_STORAGE_VERSION = 2;
export const STARTUP_SNAPSHOT_SCHEMA_VERSION = "startup_snapshot.v2";
export const STARTUP_SNAPSHOT_LOCAL_TTL_MS = 15 * 60 * 1000;
const STARTUP_SNAPSHOT_STORAGE_KEY_PREFIX = "cocolon.startupSnapshot.v2";

function normalizeUserId(userId) {
  return String(userId || "").trim();
}

function isObjectRecord(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function safeClone(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return value;
  }
}

export function buildStartupSnapshotStorageKey(userId) {
  const normalizedUserId = normalizeUserId(userId);
  if (!normalizedUserId) return null;
  return `${STARTUP_SNAPSHOT_STORAGE_KEY_PREFIX}:${normalizedUserId}`;
}

export function isStartupSnapshotCacheExpired(
  savedAt,
  maxAgeMs = STARTUP_SNAPSHOT_LOCAL_TTL_MS,
  nowMs = Date.now()
) {
  const savedAtMs = new Date(savedAt).getTime();
  if (!Number.isFinite(savedAtMs)) return true;

  const allowedAgeMs = Number(maxAgeMs);
  if (!Number.isFinite(allowedAgeMs) || allowedAgeMs <= 0) return false;

  return nowMs - savedAtMs > allowedAgeMs;
}

function buildStartupSnapshotEnvelope(userId, payload, options = {}) {
  const normalizedUserId = normalizeUserId(userId);
  if (!normalizedUserId || !isObjectRecord(payload)) return null;

  const savedAt =
    typeof options?.savedAt === "string" && options.savedAt.trim()
      ? options.savedAt.trim()
      : new Date().toISOString();

  return {
    version: STARTUP_SNAPSHOT_STORAGE_VERSION,
    schema_version: STARTUP_SNAPSHOT_SCHEMA_VERSION,
    user_id: normalizedUserId,
    saved_at: savedAt,
    payload: safeClone(payload),
  };
}

export async function clearStartupSnapshotCache(userId) {
  const storageKey = buildStartupSnapshotStorageKey(userId);
  if (!storageKey) return false;

  try {
    await AsyncStorage.removeItem(storageKey);
    return true;
  } catch {
    return false;
  }
}

export async function saveStartupSnapshotCache(userId, payload, options = {}) {
  const normalizedUserId = normalizeUserId(userId);
  const storageKey = buildStartupSnapshotStorageKey(normalizedUserId);
  if (!normalizedUserId || !storageKey) return null;

  const envelope = buildStartupSnapshotEnvelope(normalizedUserId, payload, options);
  if (!envelope) {
    await clearStartupSnapshotCache(normalizedUserId);
    return null;
  }

  try {
    await AsyncStorage.setItem(storageKey, JSON.stringify(envelope));
    return envelope;
  } catch {
    return null;
  }
}

function normalizeLoadedEnvelope(userId, parsed, options = {}) {
  const normalizedUserId = normalizeUserId(userId);
  if (!normalizedUserId || !isObjectRecord(parsed)) return null;

  const savedAt = String(parsed?.saved_at || "").trim();
  const payload = parsed?.payload;
  const version = Number(parsed?.version ?? 0) || 0;
  const ownerUserId = normalizeUserId(parsed?.user_id);

  if (
    version !== STARTUP_SNAPSHOT_STORAGE_VERSION ||
    ownerUserId !== normalizedUserId ||
    !savedAt ||
    !isObjectRecord(payload)
  ) {
    return null;
  }

  const maxAgeMs = Number(options?.maxAgeMs);
  const ttlMs =
    Number.isFinite(maxAgeMs) && maxAgeMs > 0
      ? maxAgeMs
      : STARTUP_SNAPSHOT_LOCAL_TTL_MS;

  if (isStartupSnapshotCacheExpired(savedAt, ttlMs)) {
    return null;
  }

  return {
    version: STARTUP_SNAPSHOT_STORAGE_VERSION,
    schema_version:
      String(parsed?.schema_version || "").trim() ||
      STARTUP_SNAPSHOT_SCHEMA_VERSION,
    user_id: normalizedUserId,
    saved_at: savedAt,
    payload: safeClone(payload),
  };
}

export async function loadStartupSnapshotCache(userId, options = {}) {
  const normalizedUserId = normalizeUserId(userId);
  const storageKey = buildStartupSnapshotStorageKey(normalizedUserId);
  if (!normalizedUserId || !storageKey) return null;

  let raw = null;
  try {
    raw = await AsyncStorage.getItem(storageKey);
  } catch {
    return null;
  }
  if (!raw) return null;

  let parsed = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    await clearStartupSnapshotCache(normalizedUserId);
    return null;
  }

  const envelope = normalizeLoadedEnvelope(normalizedUserId, parsed, options);
  if (!envelope) {
    await clearStartupSnapshotCache(normalizedUserId);
    return null;
  }

  return envelope;
}
