import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * UnreadContext
 * - screen ⇄ bottom tab unread badge state
 *
 * Data shape:
 *   unreadState = {
 *     [scope: string]: {
 *       [key: string]: boolean
 *     }
 *   }
 *
 * Example scopes:
 *   - "MyWeb": { weekly: true, monthly: false, mymodelCreate: true }
 *   - "Friends": { feed: true, requests: false }
 */

/**
 * Prefetch cache (optional)
 * - screen data that can be preloaded at app start to reduce perceived latency.
 *
 * Data shape:
 *   prefetchState = {
 *     [scope: string]: {
 *       [key: string]: {
 *         value: any,
 *         fetchedAt: number // epoch ms
 *       }
 *     }
 *   }
 */

const UnreadContext = createContext(null);

function normStr(v) {
  return String(v || "").trim();
}

function normScope(scope) {
  return normStr(scope);
}

function normKey(key) {
  const k = normStr(key);
  return k || "__default";
}

export function UnreadProvider({ children, initialState, initialPrefetch }) {
  const [unreadState, setUnreadState] = useState(() => {
    if (initialState && typeof initialState === "object") return initialState;
    return {};
  });


  const [prefetchState, setPrefetchState] = useState(() => {
    if (initialPrefetch && typeof initialPrefetch === "object") return initialPrefetch;
    return {};
  });

  const setUnread = useCallback((scope, key, value) => {
    const s = normScope(scope);
    if (!s) return;

    const k = normKey(key);
    const v = !!value;

    setUnreadState((prev) => {
      const prevScope =
        prev && prev[s] && typeof prev[s] === "object" ? prev[s] : {};
      const nextScope = { ...prevScope, [k]: v };
      return { ...(prev || {}), [s]: nextScope };
    });
  }, []);

  // Merge update for a scope (partial keys)
  const setUnreadGroup = useCallback((scope, patch) => {
    const s = normScope(scope);
    if (!s) return;

    if (!patch || typeof patch !== "object") return;

    setUnreadState((prev) => {
      const prevScope =
        prev && prev[s] && typeof prev[s] === "object" ? prev[s] : {};
      const nextScope = { ...prevScope };

      Object.keys(patch).forEach((k0) => {
        const k = normKey(k0);
        nextScope[k] = !!patch[k0];
      });

      return { ...(prev || {}), [s]: nextScope };
    });
  }, []);

  const clearScope = useCallback((scope) => {
    const s = normScope(scope);
    if (!s) return;

    setUnreadState((prev) => {
      if (!prev || !prev[s]) return prev || {};
      const next = { ...(prev || {}) };
      delete next[s];
      return next;
    });
  }, []);

  const clearKey = useCallback((scope, key) => {
    const s = normScope(scope);
    if (!s) return;

    const k = normKey(key);

    setUnreadState((prev) => {
      if (!prev || !prev[s] || typeof prev[s] !== "object") return prev || {};
      const next = { ...(prev || {}) };
      const nextScope = { ...(next[s] || {}) };
      delete nextScope[k];

      if (Object.keys(nextScope).length === 0) {
        delete next[s];
      } else {
        next[s] = nextScope;
      }
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setUnreadState({});
    setPrefetchState({});
  }, []);


  // ------------------------------------------------------------
  // Prefetch cache API
  // - Store any screen-level data (lists, meta, etc.)
  // - Best-effort: never crash due to cache writes/reads
  // ------------------------------------------------------------
  const setPrefetch = useCallback((scope, key, value, options) => {
    const s = normScope(scope);
    if (!s) return;

    const k = normKey(key);
    const fetchedAt =
      options && typeof options.fetchedAt === "number"
        ? options.fetchedAt
        : Date.now();

    setPrefetchState((prev) => {
      const prevScope =
        prev && prev[s] && typeof prev[s] === "object" ? prev[s] : {};
      const nextScope = { ...prevScope, [k]: { value, fetchedAt } };
      return { ...(prev || {}), [s]: nextScope };
    });
  }, []);

  // Merge update for a scope (partial keys)
  const setPrefetchGroup = useCallback((scope, patch, options) => {
    const s = normScope(scope);
    if (!s) return;
    if (!patch || typeof patch !== "object") return;

    const fetchedAt =
      options && typeof options.fetchedAt === "number"
        ? options.fetchedAt
        : Date.now();

    setPrefetchState((prev) => {
      const prevScope =
        prev && prev[s] && typeof prev[s] === "object" ? prev[s] : {};
      const nextScope = { ...prevScope };

      Object.keys(patch).forEach((k0) => {
        const k = normKey(k0);
        nextScope[k] = { value: patch[k0], fetchedAt };
      });

      return { ...(prev || {}), [s]: nextScope };
    });
  }, []);

  const clearPrefetchScope = useCallback((scope) => {
    const s = normScope(scope);
    if (!s) return;

    setPrefetchState((prev) => {
      if (!prev || !prev[s]) return prev || {};
      const next = { ...(prev || {}) };
      delete next[s];
      return next;
    });
  }, []);

  const clearPrefetchKey = useCallback((scope, key) => {
    const s = normScope(scope);
    if (!s) return;

    const k = normKey(key);

    setPrefetchState((prev) => {
      if (!prev || !prev[s] || typeof prev[s] !== "object") return prev || {};
      const next = { ...(prev || {}) };
      const nextScope = { ...(next[s] || {}) };
      delete nextScope[k];

      if (Object.keys(nextScope).length === 0) {
        delete next[s];
      } else {
        next[s] = nextScope;
      }
      return next;
    });
  }, []);

  const getPrefetchEntry = useCallback(
    (scope, key) => {
      const s = normScope(scope);
      if (!s) return null;
      const k = normKey(key);
      const entry = prefetchState?.[s]?.[k];
      if (!entry || typeof entry !== "object") return null;
      if (!("value" in entry)) return null;
      return entry;
    },
    [prefetchState]
  );

  function _isFreshEntry(entry, maxAgeMs) {
    if (!entry || typeof entry !== "object") return false;
    const fetchedAt = Number(entry.fetchedAt ?? 0) || 0;
    if (!fetchedAt) return false;
    const age = Date.now() - fetchedAt;
    const maxAge = Number(maxAgeMs);
    if (!Number.isFinite(maxAge) || maxAge <= 0) return true;
    return age >= 0 && age <= maxAge;
  }

  const getPrefetchEntryFresh = useCallback(
    (scope, key, maxAgeMs) => {
      const entry = getPrefetchEntry(scope, key);
      if (!entry) return null;
      return _isFreshEntry(entry, maxAgeMs) ? entry : null;
    },
    [getPrefetchEntry]
  );

  const getPrefetch = useCallback(
    (scope, key, fallback) => {
      const entry = getPrefetchEntry(scope, key);
      return entry ? entry.value : fallback;
    },
    [getPrefetchEntry]
  );

  const getPrefetchFresh = useCallback(
    (scope, key, maxAgeMs, fallback) => {
      const entry = getPrefetchEntryFresh(scope, key, maxAgeMs);
      return entry ? entry.value : fallback;
    },
    [getPrefetchEntryFresh]
  );

  const scopeUnreadMap = useMemo(() => {
    const map = {};
    const entries = Object.entries(unreadState || {});
    entries.forEach(([scope, flags]) => {
      const values = Object.values(flags || {});
      map[scope] = values.some(Boolean);
    });
    return map;
  }, [unreadState]);

  const getScopeUnread = useCallback(
    (scope) => {
      const s = normScope(scope);
      if (!s) return false;
      return !!scopeUnreadMap[s];
    },
    [scopeUnreadMap]
  );

  const getFeatureUnread = useCallback(
    (scope, key) => {
      const s = normScope(scope);
      if (!s) return false;
      const k = normKey(key);
      return !!unreadState?.[s]?.[k];
    },
    [unreadState]
  );

  const value = useMemo(
    () => ({
      unreadState,
      scopeUnreadMap,
      setUnread,
      setUnreadGroup,
      clearScope,
      clearKey,
      resetAll,
      getScopeUnread,
      getFeatureUnread,
      // Prefetch cache
      prefetchState,
      setPrefetch,
      setPrefetchGroup,
      clearPrefetchScope,
      clearPrefetchKey,
      getPrefetchEntry,
      getPrefetchEntryFresh,
      getPrefetch,
      getPrefetchFresh,
    }),
    [
      unreadState,
      scopeUnreadMap,
      setUnread,
      setUnreadGroup,
      clearScope,
      clearKey,
      resetAll,
      getScopeUnread,
      getFeatureUnread,
      prefetchState,
      setPrefetch,
      setPrefetchGroup,
      clearPrefetchScope,
      clearPrefetchKey,
      getPrefetchEntry,
      getPrefetchEntryFresh,
      getPrefetch,
      getPrefetchFresh,
    ]
  );

  return <UnreadContext.Provider value={value}>{children}</UnreadContext.Provider>;
}

export function useUnread() {
  const ctx = useContext(UnreadContext);
  if (!ctx) {
    throw new Error("useUnread must be used within <UnreadProvider>");
  }
  return ctx;
}
