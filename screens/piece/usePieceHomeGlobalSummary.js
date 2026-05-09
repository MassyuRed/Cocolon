import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

import { apiFetch, API_BASE_URL } from "../../lib/apiClient";
import {
  readPieceResonancesTotal,
  readPieceViewCount,
} from "../../lib/compat/legacyWireContracts";

const GLOBAL_SUMMARY_ENDPOINT = `${API_BASE_URL}/global_summary`;
const GLOBAL_SUMMARY_PASSIVE_ENDPOINT = `${GLOBAL_SUMMARY_ENDPOINT}?mode=ready_first`;
const GLOBAL_SUMMARY_REQUEST_TIMEOUT_MS = 8000;
const GLOBAL_SUMMARY_MIN_REFRESH_INTERVAL_MS = 60 * 1000;

export function usePieceHomeGlobalSummary({ navigation, isTutorialMode }) {
  const [globalPieceCount, setGlobalPieceCount] = useState(null);
  const [globalResonanceCount, setGlobalResonanceCount] = useState(null);
  const appStateRef = useRef(AppState.currentState);
  const globalSummaryLastFetchedAtRef = useRef(0);
  const globalSummaryInFlightRef = useRef(null);

  const fetchGlobalSummary = useCallback(async (opts = {}) => {
    const force = opts?.force === true;

    try {
      const now = Date.now();
      const lastFetchedAt = Number(globalSummaryLastFetchedAtRef.current || 0) || 0;
      if (!force && now - lastFetchedAt < GLOBAL_SUMMARY_MIN_REFRESH_INTERVAL_MS) {
        return globalSummaryInFlightRef.current || null;
      }

      if (globalSummaryInFlightRef.current) {
        return globalSummaryInFlightRef.current;
      }

      const request = (async () => {
        try {
          const res = await apiFetch(GLOBAL_SUMMARY_PASSIVE_ENDPOINT, {
            method: "GET",
            auth: false,
            timeoutMs: GLOBAL_SUMMARY_REQUEST_TIMEOUT_MS,
          });
          const json = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(String(json?.detail || json?.message || `HTTP ${res.status}`));
          }

          const nextPieceCount = Number(readPieceViewCount(json));
          const nextResonanceCount = Number(readPieceResonancesTotal(json));

          if (Number.isFinite(nextPieceCount)) {
            setGlobalPieceCount(nextPieceCount);
          }
          if (Number.isFinite(nextResonanceCount)) {
            setGlobalResonanceCount(nextResonanceCount);
          }
          globalSummaryLastFetchedAtRef.current = Date.now();
          return json;
        } catch {
          return null;
        } finally {
          globalSummaryInFlightRef.current = null;
        }
      })();

      globalSummaryInFlightRef.current = request;
      return request;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (isTutorialMode) {
      setGlobalPieceCount(null);
      setGlobalResonanceCount(null);
      return;
    }

    fetchGlobalSummary();

    if (!navigation?.addListener) return;
    const unsubscribe = navigation.addListener("focus", () => {
      fetchGlobalSummary();
    });

    return unsubscribe;
  }, [navigation, fetchGlobalSummary, isTutorialMode]);

  useEffect(() => {
    if (isTutorialMode) return;

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (/inactive|background/.test(appStateRef.current) && nextAppState === "active") {
        fetchGlobalSummary();
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      try {
        subscription?.remove?.();
      } catch {
        // noop
      }
    };
  }, [fetchGlobalSummary, isTutorialMode]);

  return {
    globalPieceCount,
    globalResonanceCount,
    fetchGlobalSummary,
  };
}

export default usePieceHomeGlobalSummary;
