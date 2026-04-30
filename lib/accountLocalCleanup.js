import AsyncStorage from "@react-native-async-storage/async-storage";

import { clearInputDraft } from "./inputDraftStorage";

const SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY = "cocolon:selfStructureLatestSeenVersion";
const ANALYSIS_LATEST_REPORT_CACHE_PREFIX = "cocolon:analysisLatestReport";

function normalizeUserId(userId) {
  return String(userId || "").trim();
}

function buildSelfStructureLatestSeenKey(userId) {
  const uid = normalizeUserId(userId);
  if (!uid) return SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY;
  return `${SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY}:${uid}`;
}

function buildAnalysisLatestReportCachePrefix(userId) {
  const uid = normalizeUserId(userId);
  if (!uid) return null;
  return `${ANALYSIS_LATEST_REPORT_CACHE_PREFIX}:${uid}:`;
}

async function removeAsyncStorageKeysByPrefix(prefix) {
  const normalizedPrefix = String(prefix || "").trim();
  if (!normalizedPrefix) return;

  try {
    const keys = await AsyncStorage.getAllKeys();
    const matchingKeys = (Array.isArray(keys) ? keys : []).filter((key) =>
      String(key || "").startsWith(normalizedPrefix)
    );
    if (matchingKeys.length > 0) {
      await AsyncStorage.multiRemove(matchingKeys);
    }
  } catch {
    // Local cleanup must not block account deletion completion.
  }
}

export async function clearDeletedAccountLocalState(userId) {
  const uid = normalizeUserId(userId);
  if (!uid) return;

  await Promise.allSettled([
    clearInputDraft(uid),
    AsyncStorage.removeItem(buildSelfStructureLatestSeenKey(uid)),
    removeAsyncStorageKeysByPrefix(buildAnalysisLatestReportCachePrefix(uid)),
  ]);
}
