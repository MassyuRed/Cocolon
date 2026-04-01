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
import {
  buildFallbackSubscriptionBootstrap,
  clearSubscriptionRuntimeCatalog,
  hydrateSubscriptionRuntimeCatalog,
} from "./lib/iap/iapRuntimeCatalog";
import {
  getSubscriptionBootstrap,
  getSubscriptionMe,
} from "./lib/subscriptionApi";

const VALID_TIERS = new Set(["free", "plus", "premium"]);
const DEFAULT_TIER = "free";
const REFRESH_TTL_MS = 10 * 1000;
const BOOTSTRAP_REFRESH_TTL_MS = 30 * 1000;

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
  const [planCode, setPlanCode] = useState(null);
  const [entitlementStatus, setEntitlementStatus] = useState("none");
  const [expiresAt, setExpiresAt] = useState(null);
  const [autoRenew, setAutoRenew] = useState(false);
  const [store, setStore] = useState(null);
  const [productId, setProductId] = useState(null);
  const [subscriptionBootstrap, setSubscriptionBootstrap] = useState(() =>
    buildFallbackSubscriptionBootstrap()
  );
  const [subscriptionBootstrapLoading, setSubscriptionBootstrapLoading] = useState(false);
  const [subscriptionBootstrapLoaded, setSubscriptionBootstrapLoaded] = useState(false);
  const [subscriptionBootstrapError, setSubscriptionBootstrapError] = useState(null);

  const tierRef = useRef("unknown");
  const lastFetchedAtRef = useRef(0);
  const inFlightRef = useRef(null);
  const lastBootstrapFetchedAtRef = useRef(0);
  const bootstrapInFlightRef = useRef(null);
  const bootstrapRef = useRef(buildFallbackSubscriptionBootstrap());
  const mountedRef = useRef(true);

  const setTier = useCallback((next) => {
    const v = String(next || "unknown").trim().toLowerCase() || "unknown";
    tierRef.current = v;
    if (mountedRef.current) _setTier(v);
  }, []);

  const applyBootstrap = useCallback((payload) => {
    const normalized = hydrateSubscriptionRuntimeCatalog(payload || buildFallbackSubscriptionBootstrap());
    bootstrapRef.current = normalized;
    if (mountedRef.current) {
      setSubscriptionBootstrap(normalized);
      setSubscriptionBootstrapLoaded(true);
      setSubscriptionBootstrapError(null);
    }
    return normalized;
  }, []);

  const applySubscriptionState = useCallback((payload) => {
    if (!mountedRef.current) return;

    setPlanCode(normalizeStringOrNull(payload?.plan_code));
    setEntitlementStatus(normalizeStringOrNull(payload?.entitlement_status) || "none");
    setExpiresAt(normalizeStringOrNull(payload?.expires_at));
    setAutoRenew(normalizeBoolean(payload?.auto_renew));
    setStore(normalizeStringOrNull(payload?.store));
    setProductId(normalizeStringOrNull(payload?.product_id));
  }, []);

  const resetSubscriptionState = useCallback(() => {
    if (!mountedRef.current) return;

    setPlanCode(null);
    setEntitlementStatus("none");
    setExpiresAt(null);
    setAutoRenew(false);
    setStore(null);
    setProductId(null);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    applyBootstrap(buildFallbackSubscriptionBootstrap());
    return () => {
      mountedRef.current = false;
      clearSubscriptionRuntimeCatalog();
    };
  }, [applyBootstrap]);

  const refreshSubscriptionBootstrap = useCallback(
    async ({ force = false } = {}) => {
      const now = Date.now();
      if (
        !force &&
        subscriptionBootstrapLoaded &&
        now - (Number(lastBootstrapFetchedAtRef.current || 0) || 0) < BOOTSTRAP_REFRESH_TTL_MS
      ) {
        return bootstrapRef.current;
      }

      if (bootstrapInFlightRef.current) {
        try {
          return await bootstrapInFlightRef.current;
        } catch {
          return bootstrapRef.current;
        }
      }

      const p = (async () => {
        if (mountedRef.current) setSubscriptionBootstrapLoading(true);
        try {
          const json = await getSubscriptionBootstrap();
          const normalized = applyBootstrap(json);
          lastBootstrapFetchedAtRef.current = Date.now();
          return normalized;
        } catch (err) {
          const fallback = applyBootstrap(buildFallbackSubscriptionBootstrap());
          if (mountedRef.current) {
            setSubscriptionBootstrapError(String(err?.message || err || "subscription bootstrap failed"));
          }
          lastBootstrapFetchedAtRef.current = Date.now();
          return fallback;
        } finally {
          if (mountedRef.current) setSubscriptionBootstrapLoading(false);
        }
      })();

      bootstrapInFlightRef.current = p;
      try {
        return await p;
      } finally {
        bootstrapInFlightRef.current = null;
      }
    },
    [applyBootstrap, subscriptionBootstrapLoaded]
  );

  const refreshTier = useCallback(
    async ({ force = false } = {}) => {
      const now = Date.now();
      const cur = tierRef.current;

      if (
        !force &&
        cur &&
        cur !== "unknown" &&
        now - (Number(lastFetchedAtRef.current || 0) || 0) < REFRESH_TTL_MS
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

          const json = await getSubscriptionMe();
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
    refreshSubscriptionBootstrap({ force: true }).catch(() => null);
    refreshTier({ force: true }).catch(() => null);

    const handler = (state) => {
      if (state === "active") {
        refreshSubscriptionBootstrap({ force: false }).catch(() => null);
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
  }, [refreshSubscriptionBootstrap, refreshTier]);

  useEffect(() => {
    let authSub = null;

    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        refreshSubscriptionBootstrap({ force: true }).catch(() => null);
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
  }, [refreshSubscriptionBootstrap, refreshTier, resetSubscriptionState, setTier]);

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
      planCode,
      entitlementStatus,
      expiresAt,
      autoRenew,
      store,
      productId,
      subscriptionBootstrap,
      subscriptionBootstrapLoading,
      subscriptionBootstrapLoaded,
      subscriptionBootstrapError,
      isPlus,
      isPremium,
      isPaid,
      myModelEffectiveTier,
      myModelRangeLabel,
      ensurePaid,
      ensurePremium,
      refreshTier,
      refreshSubscriptionBootstrap,
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
    productId,
    refreshSubscriptionBootstrap,
    refreshTier,
    store,
    subscriptionBootstrap,
    subscriptionBootstrapError,
    subscriptionBootstrapLoaded,
    subscriptionBootstrapLoading,
    tier,
  ]);

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);

  if (!ctx) {
    const fallbackBootstrap = buildFallbackSubscriptionBootstrap();
    return {
      tier: "unknown",
      loading: false,
      allowedMyProfileModes: [],
      planCode: null,
      entitlementStatus: "none",
      expiresAt: null,
      autoRenew: false,
      store: null,
      productId: null,
      subscriptionBootstrap: fallbackBootstrap,
      subscriptionBootstrapLoading: false,
      subscriptionBootstrapLoaded: false,
      subscriptionBootstrapError: null,
      isPlus: false,
      isPremium: false,
      isPaid: false,
      refreshTier: async () => "unknown",
      refreshSubscriptionBootstrap: async () => fallbackBootstrap,
      ensureTier: async () => "unknown",
      ensurePaid: async () => false,
      ensurePremium: async () => false,
      myModelEffectiveTier: "",
      myModelRangeLabel: "",
    };
  }

  return ctx;
}
