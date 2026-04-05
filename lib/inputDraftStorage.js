import AsyncStorage from "@react-native-async-storage/async-storage";

export const INPUT_DRAFT_TTL_HOURS = 48;
const INPUT_DRAFT_TTL_MS = INPUT_DRAFT_TTL_HOURS * 60 * 60 * 1000;
const INPUT_DRAFT_STORAGE_VERSION = 1;
const INPUT_DRAFT_KEY_PREFIX = "cocolon.inputDraft.v1";
const VALID_STRENGTHS = new Set(["weak", "medium", "strong"]);

function normalizeUserId(userId) {
  return String(userId || "").trim();
}

function buildInputDraftStorageKey(userId) {
  const normalizedUserId = normalizeUserId(userId);
  if (!normalizedUserId) return null;
  return `${INPUT_DRAFT_KEY_PREFIX}:${normalizedUserId}`;
}

function normalizeEmotionEntry(entry) {
  const type = String(entry?.type || "").trim();
  const strength = VALID_STRENGTHS.has(entry?.strength)
    ? entry.strength
    : "medium";
  if (!type) return null;
  return { type, strength };
}

function normalizeStringArray(values) {
  if (!Array.isArray(values)) return [];

  const seen = new Set();
  const nextValues = [];

  for (const value of values) {
    const normalized = String(value || "").trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    nextValues.push(normalized);
  }

  return nextValues;
}

export function normalizeInputDraftData(data = {}) {
  const selectedEmotions = Array.isArray(data?.selectedEmotions)
    ? data.selectedEmotions
        .map((entry) => normalizeEmotionEntry(entry))
        .filter(Boolean)
    : [];

  return {
    selectedEmotions,
    memo: String(data?.memo || ""),
    memoAction: String(data?.memoAction || ""),
    selectedCategories: normalizeStringArray(data?.selectedCategories),
    isSecret: data?.isSecret === true,
    sendFriendNotification: data?.sendFriendNotification !== false,
  };
}

export function hasInputDraftContent(data = {}) {
  const normalized = normalizeInputDraftData(data);
  return (
    normalized.selectedEmotions.length > 0 ||
    normalized.memo.trim().length > 0 ||
    normalized.memoAction.trim().length > 0 ||
    normalized.selectedCategories.length > 0
  );
}

export function isInputDraftExpired(savedAt, nowMs = Date.now()) {
  const savedAtMs = new Date(savedAt).getTime();
  if (!Number.isFinite(savedAtMs)) return true;
  return nowMs - savedAtMs > INPUT_DRAFT_TTL_MS;
}

export async function clearInputDraft(userId) {
  const storageKey = buildInputDraftStorageKey(userId);
  if (!storageKey) return;
  await AsyncStorage.removeItem(storageKey);
}

export async function saveInputDraft(userId, data = {}) {
  const storageKey = buildInputDraftStorageKey(userId);
  const normalizedUserId = normalizeUserId(userId);
  if (!storageKey || !normalizedUserId) return null;

  const normalizedData = normalizeInputDraftData(data);
  if (!hasInputDraftContent(normalizedData)) {
    await clearInputDraft(normalizedUserId);
    return null;
  }

  const payload = {
    version: INPUT_DRAFT_STORAGE_VERSION,
    userId: normalizedUserId,
    savedAt: new Date().toISOString(),
    data: normalizedData,
  };

  await AsyncStorage.setItem(storageKey, JSON.stringify(payload));
  return payload;
}

export async function loadInputDraft(userId) {
  const storageKey = buildInputDraftStorageKey(userId);
  const normalizedUserId = normalizeUserId(userId);
  if (!storageKey || !normalizedUserId) return null;

  const raw = await AsyncStorage.getItem(storageKey);
  if (!raw) return null;

  let parsed = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    await clearInputDraft(normalizedUserId);
    return null;
  }

  const normalizedData = normalizeInputDraftData(parsed?.data || {});
  const savedAt = parsed?.savedAt || null;

  if (
    parsed?.version !== INPUT_DRAFT_STORAGE_VERSION ||
    String(parsed?.userId || "").trim() !== normalizedUserId ||
    !savedAt ||
    isInputDraftExpired(savedAt) ||
    !hasInputDraftContent(normalizedData)
  ) {
    await clearInputDraft(normalizedUserId);
    return null;
  }

  return {
    version: INPUT_DRAFT_STORAGE_VERSION,
    userId: normalizedUserId,
    savedAt,
    data: normalizedData,
  };
}
