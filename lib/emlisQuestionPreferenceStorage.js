import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_PREFIX = "cocolon.emlisQuestionPreference.v1";
// A returning screen must read after an earlier screen's unfinished write.
// Keep only in-flight operations, scoped to the existing local account owner.
const pendingByOwner = new Map();

function serial(userId, operation) {
  const owner = String(userId || "").trim();
  if (!owner) return Promise.reject(new Error("question_preference_owner_required"));
  const key = `${KEY_PREFIX}:${owner}`;
  const prior = pendingByOwner.get(key) || Promise.resolve();
  const task = prior.catch(() => {}).then(() => operation(key));
  pendingByOwner.set(key, task);
  const clear = () => {
    if (pendingByOwner.get(key) === task) pendingByOwner.delete(key);
  };
  task.then(clear, clear);
  return task;
}

export function loadEmlisQuestionPreference(userId) {
  return serial(userId, async (key) => {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return true;
    if (raw === "true") return true;
    if (raw === "false") return false;
    // A failed/corrupted read must not silently turn a previous OFF into ON.
    throw new Error("question_preference_invalid");
  });
}

export function saveEmlisQuestionPreference(userId, enabled) {
  if (typeof enabled !== "boolean") {
    return Promise.reject(new Error("question_preference_boolean_required"));
  }
  return serial(userId, async (key) => {
    await AsyncStorage.setItem(key, enabled ? "true" : "false");
    return enabled;
  });
}

export function clearEmlisQuestionPreference(userId) {
  return serial(userId, (key) => AsyncStorage.removeItem(key));
}
