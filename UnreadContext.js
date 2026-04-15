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
 *   - "MyWeb": { weekly: true, monthly: false }
 *   - "EmotionLog": { feed: true, requests: false }
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
const STARTUP_META_SCOPE = "App";
const STARTUP_META_KEY = "startupMeta";

function normStr(v) {
  return String(v || "").trim();
}

function normScope(scope) {
  const normalized = normStr(scope);
  return normalized;
}

function normKey(key) {
  const k = normStr(key);
  return k || "__default";
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

function normalizeUnreadHydrationState(raw) {
  if (!isObjectRecord(raw)) return {};

  const next = {};
  Object.entries(raw).forEach(([scopeRaw, scopeMapRaw]) => {
    const scope = normScope(scopeRaw);
    if (!scope || !isObjectRecord(scopeMapRaw)) return;

    const scopeMap = {};
    Object.entries(scopeMapRaw).forEach(([keyRaw, valueRaw]) => {
      scopeMap[normKey(keyRaw)] = !!valueRaw;
    });

    if (Object.keys(scopeMap).length > 0) {
      next[scope] = scopeMap;
    }
  });

  return next;
}

function normalizePrefetchHydrationState(raw, defaultFetchedAt) {
  if (!isObjectRecord(raw)) return {};

  const next = {};
  Object.entries(raw).forEach(([scopeRaw, scopeMapRaw]) => {
    const scope = normScope(scopeRaw);
    if (!scope || !isObjectRecord(scopeMapRaw)) return;

    const scopeMap = {};
    Object.entries(scopeMapRaw).forEach(([keyRaw, entryRaw]) => {
      const key = normKey(keyRaw);
      if (isObjectRecord(entryRaw) && Object.prototype.hasOwnProperty.call(entryRaw, "value")) {
        const fetchedAt = Number(entryRaw?.fetchedAt ?? 0) || defaultFetchedAt;
        scopeMap[key] = {
          value: safeClone(entryRaw.value),
          fetchedAt,
        };
        return;
      }

      scopeMap[key] = {
        value: safeClone(entryRaw),
        fetchedAt: defaultFetchedAt,
      };
    });

    if (Object.keys(scopeMap).length > 0) {
      next[scope] = scopeMap;
    }
  });

  return next;
}

function normalizeReplaceScopeSet(replaceScopes, nextState, { defaultToIncomingScopes = false } = {}) {
  if (replaceScopes === true) {
    return new Set(Object.keys(nextState || {}));
  }

  if (typeof replaceScopes === "string") {
    return new Set([normScope(replaceScopes)].filter(Boolean));
  }

  if (Array.isArray(replaceScopes)) {
    return new Set(replaceScopes.map((scope) => normScope(scope)).filter(Boolean));
  }

  if (defaultToIncomingScopes) {
    return new Set(Object.keys(nextState || {}));
  }

  return new Set();
}

function pickObject(value) {
  return isObjectRecord(value) ? value : {};
}

function resolveSection(sections, ...names) {
  const sectionMap = pickObject(sections);
  for (const rawName of names) {
    const name = normStr(rawName);
    if (!name) continue;
    if (Object.prototype.hasOwnProperty.call(sectionMap, name)) {
      return {
        found: true,
        value: sectionMap[name],
      };
    }
  }
  return {
    found: false,
    value: undefined,
  };
}

function buildStartupHydrationData(rawStartup, options = {}) {
  const responseRoot = isObjectRecord(rawStartup) ? rawStartup : null;
  if (!responseRoot) {
    return {
      applied: false,
      fetchedAt: Number(options?.fetchedAt) || Date.now(),
      unreadPatch: {},
      prefetchPatch: {},
      startupMeta: null,
    };
  }

  const startupRoot = isObjectRecord(responseRoot?.startup)
    ? responseRoot.startup
    : responseRoot;
  const sections = pickObject(startupRoot?.sections);
  const unreadPatch = {};
  const prefetchPatch = {};
  const fetchedAt = Number(options?.fetchedAt) || Date.now();
  const source = normStr(options?.source) || null;

  const emotionLogUnreadSection = resolveSection(
    sections,
    "emotionlog_unread",
    "emotion_log_unread",
    "friends_unread"
  );
  if (emotionLogUnreadSection.found) {
    const emotionLogUnread = pickObject(emotionLogUnreadSection.value);
    unreadPatch.EmotionLog = {
      feed: !!emotionLogUnread.feed_unread,
      requests: !!emotionLogUnread.requests_unread,
    };
  }

  const mywebUnreadSection = resolveSection(sections, "myweb_unread");
  if (mywebUnreadSection.found) {
    const mywebUnread = pickObject(mywebUnreadSection.value);
    const unreadByType = pickObject(mywebUnread?.unread_by_type);
    unreadPatch.MyWeb = {
      daily: !!unreadByType.daily,
      weekly: !!unreadByType.weekly,
      monthly: !!unreadByType.monthly,
      selfStructure: !!unreadByType.selfStructure,
    };
    prefetchPatch.MyWeb = {
      ...(prefetchPatch.MyWeb || {}),
      unreadStatus: mywebUnreadSection.value,
    };
  }

  const mymodelReflectionsSection = resolveSection(
    sections,
    "mymodel_reflections_unread",
    "mymodel_reflections"
  );
  if (mymodelReflectionsSection.found) {
    const mymodelReflections = pickObject(mymodelReflectionsSection.value);

    unreadPatch.MyModel = {
      reflectionsNew: !!(
        mymodelReflections?.has_unread ||
        mymodelReflections?.unread ||
        mymodelReflections?.has_any_unread ||
        mymodelReflections?.count
      ),
    };
  }

  const inputSummarySection = resolveSection(sections, "input_summary");
  if (inputSummarySection.found) {
    prefetchPatch.Input = {
      ...(prefetchPatch.Input || {}),
      homeCounts: inputSummarySection.value,
    };
  }

  const globalSummarySection = resolveSection(sections, "global_summary");
  if (globalSummarySection.found) {
    prefetchPatch.Input = {
      ...(prefetchPatch.Input || {}),
      globalSummary: globalSummarySection.value,
    };
  }

  const noticeCurrentSection = resolveSection(sections, "notices_current", "notice_current");
  if (noticeCurrentSection.found) {
    prefetchPatch.Input = {
      ...(prefetchPatch.Input || {}),
      noticeCurrent: noticeCurrentSection.value,
    };
  }

  const todayQuestionStatusSection = resolveSection(sections, "today_question_status", "today_question");
  if (todayQuestionStatusSection.found) {
    prefetchPatch.Input = {
      ...(prefetchPatch.Input || {}),
      todayQuestionStatus: todayQuestionStatusSection.value,
    };
  }

  const todayQuestionPopupSection = resolveSection(sections, "today_question_popup");
  if (todayQuestionPopupSection.found) {
    prefetchPatch.Input = {
      ...(prefetchPatch.Input || {}),
      todayQuestionPopup: todayQuestionPopupSection.value,
    };
  } else if (
    todayQuestionStatusSection.found &&
    Array.isArray(todayQuestionStatusSection.value?.question?.choices)
  ) {
    prefetchPatch.Input = {
      ...(prefetchPatch.Input || {}),
      todayQuestionPopup: todayQuestionStatusSection.value,
    };
  }

  const mywebHomeSummarySection = resolveSection(
    sections,
    "myweb_home_summary",
    "myweb_summary",
    "myweb_home"
  );
  if (mywebHomeSummarySection.found) {
    prefetchPatch.MyWeb = {
      ...(prefetchPatch.MyWeb || {}),
      homeSummary: mywebHomeSummarySection.value,
    };
  }

  const startupMeta = {
    source,
    user_id: normStr(startupRoot?.user_id) || null,
    schema_version:
      normStr(startupRoot?.schema_version) || normStr(responseRoot?.schema_version) || null,
    generated_at: normStr(startupRoot?.generated_at) || null,
    timezone_name:
      normStr(startupRoot?.timezone_name) || normStr(responseRoot?.timezone_name) || null,
    flags: safeClone(pickObject(startupRoot?.flags)),
    source_versions: safeClone(pickObject(startupRoot?.source_versions)),
    errors: safeClone(pickObject(startupRoot?.errors)),
    feature_flags: safeClone(pickObject(responseRoot?.feature_flags)),
    client_meta: safeClone(
      pickObject(responseRoot?.client_meta || startupRoot?.client_meta)
    ),
    minimum_supported_version: responseRoot?.minimum_supported_version ?? null,
    recommended_version: responseRoot?.recommended_version ?? null,
    maintenance_message: responseRoot?.maintenance_message ?? null,
  };

  const hasMeaningfulStartupMeta = !!(
    startupMeta.user_id ||
    startupMeta.schema_version ||
    startupMeta.generated_at ||
    startupMeta.timezone_name ||
    Object.keys(startupMeta.flags || {}).length > 0 ||
    Object.keys(startupMeta.source_versions || {}).length > 0 ||
    Object.keys(startupMeta.errors || {}).length > 0 ||
    Object.keys(startupMeta.feature_flags || {}).length > 0 ||
    Object.keys(startupMeta.client_meta || {}).length > 0 ||
    startupMeta.minimum_supported_version ||
    startupMeta.recommended_version ||
    startupMeta.maintenance_message
  );

  if (hasMeaningfulStartupMeta) {
    prefetchPatch[STARTUP_META_SCOPE] = {
      ...(prefetchPatch[STARTUP_META_SCOPE] || {}),
      [STARTUP_META_KEY]: startupMeta,
    };
  }

  return {
    applied:
      Object.keys(unreadPatch).length > 0 ||
      Object.keys(prefetchPatch).length > 0 ||
      hasMeaningfulStartupMeta,
    fetchedAt,
    unreadPatch,
    prefetchPatch,
    startupMeta,
  };
}

export function UnreadProvider({ children, initialState, initialPrefetch }) {
  const [unreadState, setUnreadState] = useState(() =>
    normalizeUnreadHydrationState(initialState)
  );

  const [prefetchState, setPrefetchState] = useState(() =>
    normalizePrefetchHydrationState(initialPrefetch, Date.now())
  );

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

  const hydrateUnreadState = useCallback((nextState, options = {}) => {
    const normalizedNext = normalizeUnreadHydrationState(nextState);
    if (Object.keys(normalizedNext).length === 0) return normalizedNext;

    const replaceScopeSet = normalizeReplaceScopeSet(options?.replaceScopes, normalizedNext, {
      defaultToIncomingScopes: true,
    });

    setUnreadState((prev) => {
      const next = { ...(prev || {}) };
      Object.entries(normalizedNext).forEach(([scope, patch]) => {
        if (replaceScopeSet.has(scope)) {
          next[scope] = patch;
          return;
        }
        const prevScope =
          next && next[scope] && typeof next[scope] === "object"
            ? next[scope]
            : {};
        next[scope] = { ...prevScope, ...patch };
      });
      return next;
    });

    return normalizedNext;
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

  const hydratePrefetchState = useCallback((nextState, options = {}) => {
    const fetchedAt =
      options && typeof options.fetchedAt === "number"
        ? options.fetchedAt
        : Date.now();
    const normalizedNext = normalizePrefetchHydrationState(nextState, fetchedAt);
    if (Object.keys(normalizedNext).length === 0) return normalizedNext;

    const replaceScopeSet = normalizeReplaceScopeSet(options?.replaceScopes, normalizedNext, {
      defaultToIncomingScopes: false,
    });

    setPrefetchState((prev) => {
      const next = { ...(prev || {}) };
      Object.entries(normalizedNext).forEach(([scope, patch]) => {
        if (replaceScopeSet.has(scope)) {
          next[scope] = patch;
          return;
        }
        const prevScope =
          next && next[scope] && typeof next[scope] === "object"
            ? next[scope]
            : {};
        next[scope] = { ...prevScope, ...patch };
      });
      return next;
    });

    return normalizedNext;
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

  const getStartupMeta = useCallback(() => {
    const entry = getPrefetchEntry(STARTUP_META_SCOPE, STARTUP_META_KEY);
    return entry ? entry.value : null;
  }, [getPrefetchEntry]);

  const setStartupMeta = useCallback(
    (meta, options = {}) => {
      if (!isObjectRecord(meta)) {
        clearPrefetchKey(STARTUP_META_SCOPE, STARTUP_META_KEY);
        return null;
      }
      setPrefetch(STARTUP_META_SCOPE, STARTUP_META_KEY, meta, options);
      return meta;
    },
    [clearPrefetchKey, setPrefetch]
  );

  const hasFreshStartup = useCallback(
    (maxAgeMs) => {
      const entry = getPrefetchEntryFresh(STARTUP_META_SCOPE, STARTUP_META_KEY, maxAgeMs);
      const meta = entry?.value;
      if (!entry || !isObjectRecord(meta)) return false;
      return !!(
        normStr(meta?.user_id) ||
        normStr(meta?.schema_version) ||
        normStr(meta?.generated_at)
      );
    },
    [getPrefetchEntryFresh]
  );

  const applyStartupSnapshot = useCallback(
    (startup, options = {}) => {
      const built = buildStartupHydrationData(startup, options);
      if (!built.applied) return built;

      if (Object.keys(built.unreadPatch).length > 0) {
        hydrateUnreadState(built.unreadPatch, {
          replaceScopes:
            options?.replaceUnreadScopes === undefined
              ? true
              : options.replaceUnreadScopes,
        });
      }

      if (Object.keys(built.prefetchPatch).length > 0) {
        hydratePrefetchState(built.prefetchPatch, {
          fetchedAt: built.fetchedAt,
          replaceScopes:
            options?.replacePrefetchScopes === undefined
              ? false
              : options.replacePrefetchScopes,
        });
      }

      return built;
    },
    [hydratePrefetchState, hydrateUnreadState]
  );

  const exportHydrationState = useCallback(() => {
    return {
      unreadState: safeClone(unreadState || {}),
      prefetchState: safeClone(prefetchState || {}),
      startupMeta: safeClone(getStartupMeta()),
    };
  }, [getStartupMeta, prefetchState, unreadState]);

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
      hydrateUnreadState,
      clearScope,
      clearKey,
      resetAll,
      getScopeUnread,
      getFeatureUnread,
      // Prefetch cache
      prefetchState,
      setPrefetch,
      setPrefetchGroup,
      hydratePrefetchState,
      clearPrefetchScope,
      clearPrefetchKey,
      getPrefetchEntry,
      getPrefetchEntryFresh,
      getPrefetch,
      getPrefetchFresh,
      applyStartupSnapshot,
      getStartupMeta,
      setStartupMeta,
      hasFreshStartup,
      exportHydrationState,
    }),
    [
      unreadState,
      scopeUnreadMap,
      setUnread,
      setUnreadGroup,
      hydrateUnreadState,
      clearScope,
      clearKey,
      resetAll,
      getScopeUnread,
      getFeatureUnread,
      prefetchState,
      setPrefetch,
      setPrefetchGroup,
      hydratePrefetchState,
      clearPrefetchScope,
      clearPrefetchKey,
      getPrefetchEntry,
      getPrefetchEntryFresh,
      getPrefetch,
      getPrefetchFresh,
      applyStartupSnapshot,
      getStartupMeta,
      setStartupMeta,
      hasFreshStartup,
      exportHydrationState,
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
