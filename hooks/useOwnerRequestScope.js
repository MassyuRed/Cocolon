import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { AppState } from "react-native";

// A rendered owner's work cannot resume under another authentication lifetime,
// after unmount, or after the app has gone into the background.
export function useOwnerRequestScope(ownerId, authOwnerGeneration = 0) {
  const [foreground, setForeground] = useState(() => (AppState?.currentState || "active") === "active");
  const [revision, setRevision] = useState(0);
  const current = useRef(null);
  const owner = ownerId || null;
  if (!current.current || current.current.owner !== owner ||
      current.current.generation !== authOwnerGeneration || current.current.foreground !== foreground ||
      current.current.revision !== revision) {
    const controller = new AbortController();
    current.current = { owner, generation: authOwnerGeneration, foreground, revision, active: false, controller,
      options: { expectedUserId: owner, signal: controller.signal } };
  }
  const scope = current.current;
  useLayoutEffect(() => {
    if (scope.controller.signal.aborted) {
      setRevision(value => value + 1);
      return;
    }
    scope.active = foreground;
    const subscription = AppState?.addEventListener?.("change", state => {
      const active = state === "active";
      if (!active) {
        scope.active = false;
        scope.controller.abort();
      } else if (scope.controller.signal.aborted) {
        setRevision(value => value + 1);
      }
      setForeground(active);
    });
    return () => {
      scope.active = false;
      scope.controller.abort();
      subscription?.remove?.();
    };
  }, [scope, foreground]);
  const isCurrent = useCallback(candidate => !!candidate?.owner && current.current === candidate &&
    candidate.active && !candidate.options.signal.aborted, []);
  return { scope, isCurrent };
}
