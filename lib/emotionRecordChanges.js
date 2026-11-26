const revisions = new Map();
const listeners = new Set();

export function getEmotionRecordRevision(ownerId) {
  return revisions.get(ownerId) || 0;
}

export function subscribeEmotionRecordChanges(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyEmotionRecordsChanged(ownerId) {
  if (!ownerId) return;
  revisions.set(ownerId, getEmotionRecordRevision(ownerId) + 1);
  for (const listener of listeners) {
    try { listener(); } catch {}
  }
}
