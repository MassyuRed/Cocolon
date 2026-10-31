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
import { readAllowedSelfStructureModes } from "./lib/compat/legacyWireContracts";

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
  const [allowedSelfStructureModes, setAllowedSelfStructureModes] = useState([]);
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
  const ownerRef = useRef(undefined);
  const ownerEpochRef = useRef(0);

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

  const selectOwner = useCallback((userId) => {
    const nextOwner = userId || null;
    if (ownerRef.current === nextOwner) return;
    ownerRef.current = nextOwner;
    ownerEpochRef.current += 1;
    inFlightRef.current = null;
    lastFetchedAtRef.current = 0;
    setTier(nextOwner ? "unknown" : DEFAULT_TIER);
    if (mountedRef.current) {
      setAllowedSelfStructureModes([]);
      setLoading(false);
    }
    resetSubscriptionState();
  }, [resetSubscriptionState, setTier]);

  useEffect(() => {
    mountedRef.current = true;
    applyBootstrap(buildFallbackSubscriptionBootstrap());
    return () => {
      mountedRef.current = false;
      ownerEpochRef.current += 1;
      inFlightRef.current = null;
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

  const refreshTierState = useCallback(
    async ({ force = false } = {}) => {
      // Resolve the owner before consulting an owner-specific cache/promise.
      // An auth event during getSession invalidates this invocation as well.
      const startingEpoch = ownerEpochRef.current;
      const startingOwner = ownerRef.current;
      let session;
      try {
        const { data } = await supabase.auth.getSession();
        session = data?.session;
      } catch {
        return { tier: DEFAULT_TIER, epoch: -1 };
      }
      const userId = session?.user?.id || null;
      // Concurrent startup reads may discover the same initial owner. Any
      // later switch (including away and back) still invalidates this read.
      const sameInitialDiscovery = startingOwner === undefined &&
        ownerEpochRef.current === startingEpoch + 1 && ownerRef.current === userId;
      if (!mountedRef.current || (ownerEpochRef.current !== startingEpoch && !sameInitialDiscovery)) {
        return { tier: DEFAULT_TIER, epoch: -1 };
      }
      selectOwner(userId);
      const epoch = ownerEpochRef.current;
      const isCurrent = () => mountedRef.current && ownerEpochRef.current === epoch && ownerRef.current === userId;
      const resultFor = (value) => ({ tier: value, epoch });
      const stale = () => ({ tier: DEFAULT_TIER, epoch: -1 });
      if (!userId || !session?.access_token) {
        setTier(DEFAULT_TIER);
        setAllowedSelfStructureModes([]);
        resetSubscriptionState();
        return resultFor(DEFAULT_TIER);
      }
      const now = Date.now();
      const cur = tierRef.current;

      if (
        !force &&
        cur &&
        cur !== "unknown" &&
        now - (Number(lastFetchedAtRef.current || 0) || 0) < REFRESH_TTL_MS
      ) {
        return resultFor(cur);
      }

      if (inFlightRef.current) {
        try {
          const result = await inFlightRef.current.promise;
          return isCurrent() ? result : stale();
        } catch {
          return isCurrent() ? resultFor(tierRef.current) : stale();
        }
      }

      const p = (async () => {
        if (mountedRef.current) setLoading(true);

        try {
          const json = await getSubscriptionMe({ expectedUserId: userId });
          if (!isCurrent()) return stale();
          const nextTier = normalizeTier(json?.subscription_tier);
          setTier(nextTier);

          if (mountedRef.current) {
            setAllowedSelfStructureModes(readAllowedSelfStructureModes(json));
          }

          applySubscriptionState(json);
          lastFetchedAtRef.current = Date.now();
          return resultFor(nextTier);
        } catch {
          if (!isCurrent()) return stale();
          resetSubscriptionState();
          const prev = tierRef.current;
          if (!prev || prev === "unknown") {
            setTier(DEFAULT_TIER);
            if (mountedRef.current) setAllowedSelfStructureModes([]);
            lastFetchedAtRef.current = Date.now();
            return resultFor(DEFAULT_TIER);
          }
          lastFetchedAtRef.current = Date.now();
          return resultFor(prev);
        } finally {
          if (isCurrent()) setLoading(false);
        }
      })();

      const flight = { promise: p, userId, epoch };
      inFlightRef.current = flight;
      try {
        const result = await p;
        return isCurrent() ? result : stale();
      } finally {
        if (inFlightRef.current === flight) inFlightRef.current = null;
      }
    },
    [applySubscriptionState, resetSubscriptionState, selectOwner, setTier]
  );

  const refreshTier = useCallback(async (options) => {
    const result = await refreshTierState(options);
    return result.epoch === ownerEpochRef.current && mountedRef.current ? result.tier : DEFAULT_TIER;
  }, [refreshTierState]);

  const ensureTierState = useCallback(async () => {
    const cur = tierRef.current;
    if (cur && cur !== "unknown") return { tier: cur, epoch: ownerEpochRef.current };
    return await refreshTierState({ force: true });
  }, [refreshTierState]);

  const ensureTier = useCallback(async () => {
    const result = await ensureTierState();
    return result.epoch === ownerEpochRef.current && mountedRef.current ? result.tier : DEFAULT_TIER;
  }, [ensureTierState]);

  const ensurePaid = useCallback(async () => {
    const result = await ensureTierState();
    return mountedRef.current && result.epoch === ownerEpochRef.current && (result.tier === "plus" || result.tier === "premium");
  }, [ensureTierState]);

  const ensurePremium = useCallback(async () => {
    const result = await ensureTierState();
    return mountedRef.current && result.epoch === ownerEpochRef.current && result.tier === "premium";
  }, [ensureTierState]);

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
        selectOwner(session?.user?.id || null);
        refreshSubscriptionBootstrap({ force: true }).catch(() => null);
        if (session?.access_token) {
          // Leave the auth callback before calling another Supabase auth API.
          setTimeout(() => refreshTier({ force: true }).catch(() => null), 0);
        } else {
          setTier(DEFAULT_TIER);
          setAllowedSelfStructureModes([]);
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
  }, [refreshSubscriptionBootstrap, refreshTier, resetSubscriptionState, selectOwner, setTier]);

  const value = useMemo(() => {
    const norm = tier === "unknown" ? "unknown" : normalizeTier(tier);
    const isPlus = norm === "plus";
    const isPremium = norm === "premium";
    const isPaid = norm === "plus" || norm === "premium";
    const pieceEffectiveTier = isPaid ? "standard" : norm === "free" ? "light" : "";
    const pieceRangeLabel =
      pieceEffectiveTier === "standard"
        ? "Standard"
        : pieceEffectiveTier === "light"
        ? "Light"
        : "";

    return {
      tier: norm,
      loading,
      allowedSelfStructureModes,
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
      pieceEffectiveTier,
      pieceRangeLabel,
      ensurePaid,
      ensurePremium,
      refreshTier,
      refreshSubscriptionBootstrap,
      ensureTier,
    };
  }, [
    allowedSelfStructureModes,
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
      allowedSelfStructureModes: [],
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
      pieceEffectiveTier: "",
      pieceRangeLabel: "",
    };
  }

  return ctx;
}
