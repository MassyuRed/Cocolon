const listeners = new Set();
const feedTabs = new Set(["piece", "emotion_log", "history"]);

export function subscribeNexusFeedChanges(listener) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function notifyNexusFeedChange(ownerId, tabs) {
  if (!ownerId || !Array.isArray(tabs)) return;
  const changedTabs = Object.freeze([...new Set(tabs.filter((tab) => feedTabs.has(tab)))]);
  if (!changedTabs.length) return;
  for (const listener of [...listeners]) {
    try { listener(ownerId, changedTabs); } catch {}
  }
}
