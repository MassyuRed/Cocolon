const listeners = new Set();

// Mounted screens update only after a successful follow operation in their own session.
export function subscribeToFollowChanges(owner, generation, target, source, listener) {
  const handleChange = (change) => {
    if (change.owner === owner && change.generation === generation && change.source !== source &&
        (target === owner || target === change.target)) listener();
  };
  listeners.add(handleChange);
  return () => { listeners.delete(handleChange); };
}

export function publishFollowChange(change) {
  for (const listener of listeners) listener(change);
}
