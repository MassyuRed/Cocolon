import AsyncStorage from "@react-native-async-storage/async-storage";

import { clearInputDraft } from "./inputDraftStorage";

const SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY = "cocolon:selfStructureLatestSeenVersion";

function normalizeUserId(userId) {
  return String(userId || "").trim();
}

function buildSelfStructureLatestSeenKey(userId) {
  const uid = normalizeUserId(userId);
  if (!uid) return SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY;
  return `${SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY}:${uid}`;
}

export async function clearDeletedAccountLocalState(userId) {
  const uid = normalizeUserId(userId);
  if (!uid) return;

  await Promise.allSettled([
    clearInputDraft(uid),
    AsyncStorage.removeItem(buildSelfStructureLatestSeenKey(uid)),
  ]);
}
