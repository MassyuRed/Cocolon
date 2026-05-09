import { useCallback, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { apiGet } from "../../lib/apiClient";
import { supabase } from "../../lib/supabase";
import { getTodayQuestionHistory } from "../../lib/todayQuestionApi";
import { ANALYSIS_WIRE, SELF_STRUCTURE_WIRE } from "../../lib/compat/legacyWireContracts";
import {
  ANALYSIS_READY_LIMIT,
  extractReadyItems,
  INITIAL_VISIBLE_REPORT_TYPE,
  normalizeAnalysisReportType,
  pickLatestIso,
  resolveAnalysisReportUpdatedAt,
  resolveSelfStructureUpdatedAt,
  resolveTodayQuestionUpdatedAt,
} from "./analysisRouteModel";

const ANALYSIS_LATEST_REPORT_CACHE_PREFIX = "cocolon:analysisLatestReport";
const ANALYSIS_LATEST_REPORT_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const REPORT_TYPES = Object.freeze(["daily", "weekly", "monthly"]);

async function getAnalysisLatestReportCacheKey(reportType) {
  const normalizedType = normalizeAnalysisReportType(reportType);
  if (!normalizedType) return null;

  let userId = "";
  try {
    const { data } = await supabase.auth.getSession();
    userId = String(data?.session?.user?.id || "").trim();
  } catch {
    userId = "";
  }

  return `${ANALYSIS_LATEST_REPORT_CACHE_PREFIX}:${userId || "anonymous"}:${normalizedType}`;
}

function isUsableCachedAnalysisReport(report, reportType) {
  const normalizedType = normalizeAnalysisReportType(reportType);
  if (!normalizedType || !report || typeof report !== "object") return false;
  const type = String(report?.report_type || normalizedType).trim().toLowerCase();
  return !!report?.id && type === normalizedType;
}

async function readCachedAnalysisLatestReport(reportType) {
  try {
    const key = await getAnalysisLatestReportCacheKey(reportType);
    if (!key) return null;

    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;

    const payload = JSON.parse(raw);
    const savedAt = Number(payload?.saved_at || 0);
    if (!Number.isFinite(savedAt) || Date.now() - savedAt > ANALYSIS_LATEST_REPORT_CACHE_TTL_MS) {
      return null;
    }

    const report = payload?.report || null;
    return isUsableCachedAnalysisReport(report, reportType) ? report : null;
  } catch {
    return null;
  }
}

async function writeCachedAnalysisLatestReport(reportType, report) {
  try {
    if (!isUsableCachedAnalysisReport(report, reportType)) return;
    const key = await getAnalysisLatestReportCacheKey(reportType);
    if (!key) return;

    await AsyncStorage.setItem(
      key,
      JSON.stringify({
        saved_at: Date.now(),
        report,
      })
    );
  } catch {
    // cache write is best-effort only
  }
}

export function useAnalysisReportActions() {
  const menuMetaRefreshSeqRef = useRef(0);
  const [entryMeta, setEntryMeta] = useState({
    emotionLatestDate: null,
    selfStructureLatestDate: null,
    inputHistoryLatestDate: null,
    todayCount: 0,
    weekCount: 0,
    monthCount: 0,
    latestReports: {
      daily: null,
      weekly: null,
      monthly: null,
    },
  });
  const [homeSummariesLoading, setHomeSummariesLoading] = useState(false);

  const fetchLatestReadyReport = useCallback(async (type) => {
    const normalizedType = normalizeAnalysisReportType(type);
    if (!normalizedType) return null;

    try {
      const json = await apiGet(
        `${ANALYSIS_WIRE.routes.reportsReady}?report_type=${encodeURIComponent(
          normalizedType
        )}&limit=${ANALYSIS_READY_LIMIT}&offset=0&include_body=true`
      );
      const items = extractReadyItems(json);
      const latest = items[0] || null;
      if (latest) {
        void writeCachedAnalysisLatestReport(normalizedType, latest);
      }
      return latest || null;
    } catch (e) {
      console.warn("AnalysisScreen: failed to fetch latest ready report", normalizedType, e);
      return null;
    }
  }, []);

  const refreshHomeSummaries = useCallback(
    async ({ showLoading = true, prioritizeVisibleReport = true } = {}) => {
      const refreshSeq = showLoading
        ? ++menuMetaRefreshSeqRef.current
        : menuMetaRefreshSeqRef.current;
      const isStale = () => refreshSeq !== menuMetaRefreshSeqRef.current;

      if (showLoading) {
        setHomeSummariesLoading(true);
      }

      const applyLatestReport = (type, report) => {
        if (isStale()) return;

        setEntryMeta((prev) => {
          const latestReports = {
            ...(prev?.latestReports || {}),
            [type]: report || null,
          };

          return {
            ...prev,
            emotionLatestDate: pickLatestIso([
              resolveAnalysisReportUpdatedAt(latestReports.daily),
              resolveAnalysisReportUpdatedAt(latestReports.weekly),
              resolveAnalysisReportUpdatedAt(latestReports.monthly),
            ]),
            latestReports,
          };
        });
      };

      const primeLatestReportFromCache = async (type) => {
        const cachedReport = await readCachedAnalysisLatestReport(type);
        if (!cachedReport || isStale()) return;
        applyLatestReport(type, cachedReport);
      };

      const refreshReportType = async (type) => {
        try {
          const latestReport = await fetchLatestReadyReport(type);
          applyLatestReport(type, latestReport);
        } catch (e) {
          if (!isStale()) {
            console.warn(`AnalysisScreen: failed to refresh ${type} latest report`, e);
          }
        }
      };

      const refreshSelfLatestStatus = async () => {
        try {
          const selfLatestStatus = await apiGet(SELF_STRUCTURE_WIRE.routes.latestStatus);
          if (isStale()) return;

          setEntryMeta((prev) => ({
            ...prev,
            selfStructureLatestDate: pickLatestIso([
              selfLatestStatus?.has_visible_content
                ? resolveSelfStructureUpdatedAt(selfLatestStatus)
                : null,
            ]),
          }));
        } catch (e) {
          if (!isStale()) {
            console.warn("AnalysisScreen: failed to refresh self-structure latest status", e);
          }
        }
      };

      const refreshInputSummary = async () => {
        const [homeSummaryRes, todayQuestionRes] = await Promise.allSettled([
          apiGet(ANALYSIS_WIRE.routes.homeSummary),
          getTodayQuestionHistory({ limit: 1, offset: 0 }),
        ]);

        if (isStale()) return;

        const homeSummary = homeSummaryRes.status === "fulfilled" ? homeSummaryRes.value || {} : {};
        if (homeSummaryRes.status === "rejected") {
          console.warn("AnalysisScreen: failed to refresh home summary", homeSummaryRes.reason);
        }
        const inputStatus = homeSummary?.input_status || {};

        const todayQuestionItems =
          todayQuestionRes.status === "fulfilled" && Array.isArray(todayQuestionRes.value?.items)
            ? todayQuestionRes.value.items
            : [];
        if (todayQuestionRes.status === "rejected") {
          console.warn("AnalysisScreen: failed to refresh today question history", todayQuestionRes.reason);
        }

        const todayCount = Number(inputStatus?.today_count ?? 0);
        const weekCount = Number(inputStatus?.week_count ?? 0);
        const monthCount = Number(inputStatus?.month_count ?? 0);

        setEntryMeta((prev) => ({
          ...prev,
          inputHistoryLatestDate: pickLatestIso([
            inputStatus?.last_input_at,
            resolveTodayQuestionUpdatedAt(todayQuestionItems[0]),
          ]),
          todayCount: Number.isFinite(todayCount) ? todayCount : 0,
          weekCount: Number.isFinite(weekCount) ? weekCount : 0,
          monthCount: Number.isFinite(monthCount) ? monthCount : 0,
        }));
      };

      try {
        if (showLoading && prioritizeVisibleReport) {
          await primeLatestReportFromCache(INITIAL_VISIBLE_REPORT_TYPE);
          if (isStale()) return;

          await refreshReportType(INITIAL_VISIBLE_REPORT_TYPE);
          if (isStale()) return;

          await Promise.allSettled([
            ...REPORT_TYPES
              .filter((type) => type !== INITIAL_VISIBLE_REPORT_TYPE)
              .map((type) => refreshReportType(type)),
            refreshSelfLatestStatus(),
            refreshInputSummary(),
          ]);
        } else {
          await Promise.allSettled([
            ...REPORT_TYPES.map((type) => refreshReportType(type)),
            refreshSelfLatestStatus(),
            refreshInputSummary(),
          ]);
        }
      } finally {
        if (!isStale() && showLoading) {
          setHomeSummariesLoading(false);
        }
      }
    },
    [fetchLatestReadyReport]
  );

  return {
    entryMeta,
    homeSummariesLoading,
    fetchLatestReadyReport,
    refreshHomeSummaries,
  };
}
