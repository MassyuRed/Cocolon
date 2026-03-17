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
import { supabase } from "./lib/supabase";
import { SUBSCRIPTION_PUBLIC_CONFIG } from "./lib/iap/iapConfig";

const API_BASE = String(
  SUBSCRIPTION_PUBLIC_CONFIG.apiBaseUrl || "https://mashos-api.onrender.com"
).replace(/\/+$/, "");

const SUBSCRIPTION_ME_ENDPOINT = `${API_BASE}/subscription/me`;
const VALID_TIERS = new Set(["free", "plus", "premium"]);
const DEFAULT_TIER = "free";

function normalizeTier(raw) {
  const t = String(raw || "").trim().toLowerCase();
  return VALID_TIERS.has(t) ? t : DEFAULT_TIER;
}

function normalizeStringOrNull(raw) {
  const v = String(raw || "").trim();
  return v || null;
}

function normalizeBoolean(raw) {
  return !!raw;
}

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const [tier, _setTier] = useState("unknown");
  const [allowedMyProfileModes, setAllowedMyProfileModes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [plusTrialEligible, setPlusTrialEligible] = useState(false);
  const [plusTrialConsumed, setPlusTrialConsumed] = useState(false);
  const [plusTrialConsumedAt, setPlusTrialConsumedAt] = useState(null);
  const [planCode, setPlanCode] = useState(null);
  const [entitlementStatus, setEntitlementStatus] = useState("none");
  const [expiresAt, setExpiresAt] = useState(null);
  const [autoRenew, setAutoRenew] = useState(false);
  const [store, setStore] = useState(null);
  const [productId, setProductId] = useState(null);

  const tierRef = useRef("unknown");
  const lastFetchedAtRef = useRef(0);
  const inFlightRef = useRef(null);
  const mountedRef = useRef(true);

  const setTier = useCallback((next) => {
    const v = String(next || "unknown").trim().toLowerCase() || "unknown";
    tierRef.current = v;
    if (mountedRef.current) _setTier(v);
  }, []);

  const applySubscriptionState = useCallback((payload) => {
    if (!mountedRef.current) return;

    setPlanCode(normalizeStringOrNull(payload?.plan_code));
    setEntitlementStatus(normalizeStringOrNull(payload?.entitlement_status) || "none");
    setExpiresAt(normalizeStringOrNull(payload?.expires_at));
    setAutoRenew(normalizeBoolean(payload?.auto_renew));
    setStore(normalizeStringOrNull(payload?.store));
    setProductId(normalizeStringOrNull(payload?.product_id));
    setPlusTrialEligible(Boolean(payload?.plus_trial_eligible));
    setPlusTrialConsumed(Boolean(payload?.plus_trial_consumed));
    setPlusTrialConsumedAt(normalizeStringOrNull(payload?.plus_trial_consumed_at));
  }, []);

  const resetSubscriptionState = useCallback(() => {
    if (!mountedRef.current) return;

    setPlanCode(null);
    setEntitlementStatus("none");
    setExpiresAt(null);
    setAutoRenew(false);
    setStore(null);
    setProductId(null);
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

  const refreshTier = useCallback(
    async ({ force = false } = {}) => {
      const now = Date.now();
      const cur = tierRef.current;

      if (
        !force &&
        cur &&
        cur !== "unknown" &&
        now - (Number(lastFetchedAtRef.current || 0) || 0) < 10 * 1000
      ) {
        return cur;
      }

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
            resetSubscriptionState();
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
            throw new Error(String(json?.detail || json?.message || `HTTP ${res.status}`));
          }

          const nextTier = normalizeTier(json?.subscription_tier);
          setTier(nextTier);

          if (mountedRef.current) {
            setAllowedMyProfileModes(
              Array.isArray(json?.allowed_myprofile_modes) ? json.allowed_myprofile_modes : []
            );
          }

          applySubscriptionState(json);
          lastFetchedAtRef.current = Date.now();
          return nextTier;
        } catch {
          resetSubscriptionState();
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
    [applySubscriptionState, resetSubscriptionState, setTier]
  );

  const ensureTier = useCallback(async () => {
    const cur = tierRef.current;
    if (cur && cur !== "unknown") return cur;
    return await refreshTier({ force: true });
  }, [refreshTier]);

  const ensurePaid = useCallback(async () => {
    const t = await ensureTier();
    return t === "plus" || t === "premium";
  }, [ensureTier]);

  const ensurePremium = useCallback(async () => {
    const t = await ensureTier();
    return t === "premium";
  }, [ensureTier]);

  useEffect(() => {
    refreshTier({ force: true }).catch(() => null);

    const handler = (state) => {
      if (state === "active") {
        refreshTier({ force: false }).catch(() => null);
      }
    };

    const sub = AppState?.addEventListener ? AppState.addEventListener("change", handler) : null;
    return () => {
      try {
        if (sub && typeof sub.remove === "function") sub.remove();
        else if (AppState?.removeEventListener) AppState.removeEventListener("change", handler);
      } catch {
        // noop
      }
    };
  }, [refreshTier]);

  useEffect(() => {
    let authSub = null;

    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.access_token) {
          refreshTier({ force: true }).catch(() => null);
        } else {
          setTier(DEFAULT_TIER);
          setAllowedMyProfileModes([]);
          resetSubscriptionState();
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
  }, [refreshTier, resetSubscriptionState, setTier]);

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
      planCode,
      entitlementStatus,
      expiresAt,
      autoRenew,
      store,
      productId,
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
    autoRenew,
    ensurePaid,
    ensurePremium,
    ensureTier,
    entitlementStatus,
    expiresAt,
    loading,
    planCode,
    plusTrialConsumed,
    plusTrialConsumedAt,
    plusTrialEligible,
    productId,
    refreshTier,
    store,
    tier,
  ]);

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);

  if (!ctx) {
    return {
      tier: "unknown",
      loading: false,
      allowedMyProfileModes: [],
      plusTrialEligible: false,
      plusTrialConsumed: false,
      plusTrialConsumedAt: null,
      planCode: null,
      entitlementStatus: "none",
      expiresAt: null,
      autoRenew: false,
      store: null,
      productId: null,
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
