import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";

// Supabase
import { supabase } from "./lib/supabase";

// MashOS API base
const API_BASE = String(
  (typeof process !== "undefined" && process?.env?.EXPO_PUBLIC_MYMODEL_API_URL) ||
    "https://mashos-api.onrender.com"
).replace(/\/+$/, "");

// MashOS: subscription tier endpoint
const SUBSCRIPTION_ME_ENDPOINT = `${API_BASE}/subscription/me`;

const VALID_TIERS = new Set(["free", "plus", "premium"]);
const DEFAULT_TIER = "free";

function normalizeTier(raw) {
  const t = String(raw || "").trim().toLowerCase();
  return VALID_TIERS.has(t) ? t : DEFAULT_TIER;
}

function normalizeConsumedAt(raw) {
  const v = String(raw || "").trim();
  return v || null;
}

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const [tier, _setTier] = useState("unknown"); // unknown | free | plus | premium
  const [allowedMyProfileModes, setAllowedMyProfileModes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [plusTrialEligible, setPlusTrialEligible] = useState(false);
  const [plusTrialConsumed, setPlusTrialConsumed] = useState(false);
  const [plusTrialConsumedAt, setPlusTrialConsumedAt] = useState(null);

  const tierRef = useRef("unknown");
  const lastFetchedAtRef = useRef(0);
  const inFlightRef = useRef(null);
  const mountedRef = useRef(true);

  const setTier = useCallback((next) => {
    const v = String(next || "unknown").trim().toLowerCase() || "unknown";
    tierRef.current = v;
    if (mountedRef.current) _setTier(v);
  }, []);

  const applyPlusTrialState = useCallback((payload) => {
    if (!mountedRef.current) return;

    setPlusTrialEligible(Boolean(payload?.plus_trial_eligible));
    setPlusTrialConsumed(Boolean(payload?.plus_trial_consumed));
    setPlusTrialConsumedAt(normalizeConsumedAt(payload?.plus_trial_consumed_at));
  }, []);

  const resetPlusTrialState = useCallback(() => {
    if (!mountedRef.current) return;

    setPlusTrialEligible(false);
    setPlusTrialConsumed(false);
    setPlusTrialConsumedAt(null);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ------------------------------------------------------------
  // Tier refresh
  // - fail-soft: never crash the app due to tier fetch failures
  // - fail-closed: unknown -> treat as free for gating, but keep last known tier when available
  // ------------------------------------------------------------
  const refreshTier = useCallback(
    async ({ force = false } = {}) => {
      const now = Date.now();
      const cur = tierRef.current;

      // Throttle (10s) when tier is already known
      if (
        !force &&
        cur &&
        cur !== "unknown" &&
        now - (Number(lastFetchedAtRef.current || 0) || 0) < 10 * 1000
      ) {
        return cur;
      }

      // Deduplicate concurrent refresh calls
      if (inFlightRef.current) {
        try {
          return await inFlightRef.current;
        } catch {
          return tierRef.current;
        }
      }

      const p = (async () => {
        if (mountedRef.current) setLoading(true);

        try {
          const { data: sessionData } = await supabase.auth.getSession();
          const accessToken = sessionData?.session?.access_token ?? null;

          if (!accessToken) {
            setTier(DEFAULT_TIER);
            if (mountedRef.current) setAllowedMyProfileModes([]);
            resetPlusTrialState();
            lastFetchedAtRef.current = Date.now();
            return DEFAULT_TIER;
          }

          const res = await fetch(SUBSCRIPTION_ME_ENDPOINT, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const json = await res.json().catch(() => null);
          if (!res.ok) {
            throw new Error(
              String(json?.detail || json?.message || `HTTP ${res.status}`)
            );
          }

          const nextTier = normalizeTier(json?.subscription_tier);
          setTier(nextTier);

          if (mountedRef.current) {
            setAllowedMyProfileModes(
              Array.isArray(json?.allowed_myprofile_modes)
                ? json.allowed_myprofile_modes
                : []
            );
          }

          applyPlusTrialState(json);

          lastFetchedAtRef.current = Date.now();
          return nextTier;
        } catch {
          // fail-soft:
          // - If we already know the tier, keep it.
          // - If unknown, fall back to free.
          // - Trial state is fail-closed: hide trial when it can't be confirmed.
          resetPlusTrialState();

          const prev = tierRef.current;
          if (!prev || prev === "unknown") {
            setTier(DEFAULT_TIER);
            if (mountedRef.current) setAllowedMyProfileModes([]);
            lastFetchedAtRef.current = Date.now();
            return DEFAULT_TIER;
          }

          lastFetchedAtRef.current = Date.now();
          return prev;
        } finally {
          if (mountedRef.current) setLoading(false);
        }
      })();

      inFlightRef.current = p;

      try {
        return await p;
      } finally {
        inFlightRef.current = null;
      }
    },
    [applyPlusTrialState, resetPlusTrialState, setTier]
  );

  // Ensure tier is known (used by gating on tap)
  const ensureTier = useCallback(async () => {
    const cur = tierRef.current;
    if (cur && cur !== "unknown") return cur;
    return await refreshTier({ force: true });
  }, [refreshTier]);

  // Ensure user is on a paid plan (Plus or Premium)
  const ensurePaid = useCallback(async () => {
    const t = await ensureTier();
    return t === "plus" || t === "premium";
  }, [ensureTier]);

  // Ensure user is on a Premium plan (Premium only)
  const ensurePremium = useCallback(async () => {
    const t = await ensureTier();
    return t === "premium";
  }, [ensureTier]);

  // Auto refresh: mount + foreground
  useEffect(() => {
    refreshTier({ force: true }).catch(() => null);

    const handler = (state) => {
      if (state === "active") {
        refreshTier({ force: false }).catch(() => null);
      }
    };

    const sub = AppState?.addEventListener
      ? AppState.addEventListener("change", handler)
      : null;

    return () => {
      try {
        if (sub && typeof sub.remove === "function") sub.remove();
        else if (AppState?.removeEventListener)
          AppState.removeEventListener("change", handler);
      } catch {
        // noop
      }
    };
  }, [refreshTier]);

  // Auto refresh: login/logout
  useEffect(() => {
    let authSub = null;

    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.access_token) {
          refreshTier({ force: true }).catch(() => null);
        } else {
          setTier(DEFAULT_TIER);
          setAllowedMyProfileModes([]);
          resetPlusTrialState();
        }
      });

      authSub = data?.subscription || null;
    } catch {
      authSub = null;
    }

    return () => {
      try {
        authSub?.unsubscribe?.();
      } catch {
        // noop
      }
    };
  }, [refreshTier, resetPlusTrialState, setTier]);

  const value = useMemo(() => {
    const norm = tier === "unknown" ? "unknown" : normalizeTier(tier);
    const isPlus = norm === "plus";
    const isPremium = norm === "premium";
    const isPaid = norm === "plus" || norm === "premium";

    const myModelEffectiveTier = isPaid ? "standard" : norm === "free" ? "light" : "";
    const myModelRangeLabel =
      myModelEffectiveTier === "standard"
        ? "Standard"
        : myModelEffectiveTier === "light"
        ? "Light"
        : "";

    return {
      tier: norm,
      loading,
      allowedMyProfileModes,
      plusTrialEligible,
      plusTrialConsumed,
      plusTrialConsumedAt,
      isPlus,
      isPremium,
      isPaid,
      myModelEffectiveTier,
      myModelRangeLabel,
      ensurePaid,
      ensurePremium,
      refreshTier,
      ensureTier,
    };
  }, [
    allowedMyProfileModes,
    ensureTier,
    ensurePaid,
    ensurePremium,
    loading,
    plusTrialConsumed,
    plusTrialConsumedAt,
    plusTrialEligible,
    refreshTier,
    tier,
  ]);

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);

  // Fail-soft: avoid crashing if provider isn't mounted
  if (!ctx) {
    return {
      tier: "unknown",
      loading: false,
      allowedMyProfileModes: [],
      plusTrialEligible: false,
      plusTrialConsumed: false,
      plusTrialConsumedAt: null,
      isPlus: false,
      isPremium: false,
      isPaid: false,
      refreshTier: async () => "unknown",
      ensureTier: async () => "unknown",
      ensurePaid: async () => false,
      ensurePremium: async () => false,
      myModelEffectiveTier: "",
      myModelRangeLabel: "",
    };
  }

  return ctx;
}
