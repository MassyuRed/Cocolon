import { useCallback, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useUnread } from "../../UnreadContext";
import { apiGet, apiPost } from "../../lib/apiClient";
import { supabase } from "../../lib/supabase";
import { ANALYSIS_WIRE, SELF_STRUCTURE_WIRE } from "../../lib/compat/legacyWireContracts";
import {
  REPORT_READ_STATUS_CHUNK_SIZE,
  SELF_STRUCTURE_HISTORY_FETCH_LIMIT,
  SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY,
} from "./analysisRouteModel";

export function useAnalysisUnreadBadges({
  isPaid,
  subscriptionLoading,
  onRefreshTabUnread,
}) {
  const { getFeatureUnread } = useUnread();
  const unreadRefreshSeqRef = useRef(0);

  const [unreadByType, setUnreadByType] = useState({
    daily: false,
    weekly: false,
    monthly: false,
    selfStructure: false,
  });
  const [unreadResolved, setUnreadResolved] = useState(false);
  const [selfStructureUnreadResolved, setSelfStructureUnreadResolved] = useState(false);
  const [selfStructureLatestUnread, setSelfStructureLatestUnread] = useState(false);
  const [selfStructureHistoryUnread, setSelfStructureHistoryUnread] = useState(false);

  const prefetchedUnreadByType = useMemo(
    () => ({
      daily: !!getFeatureUnread("Analysis", "daily"),
      weekly: !!getFeatureUnread("Analysis", "weekly"),
      monthly: !!getFeatureUnread("Analysis", "monthly"),
      selfStructure: !!getFeatureUnread("Analysis", "selfStructure"),
    }),
    [getFeatureUnread]
  );

  const fetchReportReadIdSet = useCallback(async (reportIds) => {
    const ids = Array.from(
      new Set(
        (Array.isArray(reportIds) ? reportIds : [])
          .map((id) => String(id || "").trim())
          .filter(Boolean)
      )
    );
    if (ids.length === 0) return new Set();

    const readSet = new Set();
    for (let i = 0; i < ids.length; i += REPORT_READ_STATUS_CHUNK_SIZE) {
      const chunk = ids.slice(i, i + REPORT_READ_STATUS_CHUNK_SIZE);
      if (chunk.length === 0) continue;
      const query = chunk
        .map((id) => `report_ids=${encodeURIComponent(id)}`)
        .join("&");
      const json = await apiGet(`/report-reads/status?${query}`);
      const readIds = Array.isArray(json?.read_ids) ? json.read_ids : [];
      readIds.forEach((id) => {
        const normalized = String(id || "").trim();
        if (normalized) readSet.add(normalized);
      });
    }
    return readSet;
  }, []);

  const getSelfStructureLatestSeenStorageKey = useCallback(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const userId = String(data?.session?.user?.id || "").trim();
      return userId
        ? `${SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY}:${userId}`
        : SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY;
    } catch {
      return SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY;
    }
  }, []);

  const fetchSelfStructureLatestUnread = useCallback(async () => {
    if (subscriptionLoading || !isPaid) return false;

    const storageKey = await getSelfStructureLatestSeenStorageKey();
    const [statusJson, seenVersionKey] = await Promise.all([
      apiGet(SELF_STRUCTURE_WIRE.routes.latestStatus),
      AsyncStorage.getItem(storageKey),
    ]);

    const versionKey = String(statusJson?.version_key || "").trim();
    const hasVisibleContent = !!statusJson?.has_visible_content;
    const seenKey = String(seenVersionKey || "").trim();

    if (!versionKey || !hasVisibleContent) return false;
    return versionKey !== seenKey;
  }, [getSelfStructureLatestSeenStorageKey, isPaid, subscriptionLoading]);

  const fetchSelfStructureHistoryUnread = useCallback(async () => {
    if (subscriptionLoading || !isPaid) return false;

    const historyJson = await apiGet(
      `${SELF_STRUCTURE_WIRE.routes.reportsHistoryBase}?report_type=monthly&limit=${SELF_STRUCTURE_HISTORY_FETCH_LIMIT}&offset=0`
    );
    const items = Array.isArray(historyJson?.items) ? historyJson.items : [];
    const ids = items
      .map((item) => String(item?.id || "").trim())
      .filter(Boolean);

    if (ids.length === 0) return false;

    const readSet = await fetchReportReadIdSet(ids);
    return ids.some((id) => !readSet.has(id));
  }, [fetchReportReadIdSet, isPaid, subscriptionLoading]);

  const requestParentTabUnreadRefresh = useCallback(async () => {
    try {
      await onRefreshTabUnread?.();
    } catch (e) {
      console.warn("AnalysisScreen: failed to request parent Analysis unread refresh", e);
    }
  }, [onRefreshTabUnread]);

  const markSelfStructureLatestSeen = useCallback(
    async (versionKey) => {
      const normalized = String(versionKey || "").trim();
      if (!normalized) return;

      try {
        const storageKey = await getSelfStructureLatestSeenStorageKey();
        await AsyncStorage.setItem(storageKey, normalized);
      } catch {
        // noop
      }

      setSelfStructureLatestUnread(false);
      setUnreadByType((prev) => ({
        ...prev,
        selfStructure: !!selfStructureHistoryUnread,
      }));
      await requestParentTabUnreadRefresh();
    },
    [getSelfStructureLatestSeenStorageKey, selfStructureHistoryUnread, requestParentTabUnreadRefresh]
  );

  const refreshUnreadBadges = useCallback(async () => {
    const refreshSeq = ++unreadRefreshSeqRef.current;
    const isStale = () => refreshSeq !== unreadRefreshSeqRef.current;

    const selfStructureTask = Promise.all([
      fetchSelfStructureLatestUnread().catch((e) => {
        console.warn("AnalysisScreen: failed to refresh latest self-structure unread badge", e);
        return false;
      }),
      fetchSelfStructureHistoryUnread().catch((e) => {
        console.warn("AnalysisScreen: failed to refresh self-structure history unread badge", e);
        return false;
      }),
    ])
      .then(([nextSelfStructureLatestUnread, nextSelfStructureHistoryUnread]) => {
        if (isStale()) return;

        const effectiveSelfStructureUnread =
          !!nextSelfStructureLatestUnread || !!nextSelfStructureHistoryUnread;

        setSelfStructureLatestUnread(!!nextSelfStructureLatestUnread);
        setSelfStructureHistoryUnread(!!nextSelfStructureHistoryUnread);
        setUnreadByType((prev) => ({
          ...prev,
          selfStructure: effectiveSelfStructureUnread,
        }));
        setSelfStructureUnreadResolved(true);
      })
      .catch(() => {
        // noop
      });

    try {
      const query = new URLSearchParams({
        limit: "1",
        include_self_structure: "false",
      }).toString();

      const json = await apiGet(`${ANALYSIS_WIRE.routes.reportsUnreadStatus}?${query}`);
      const unread = json?.unread_by_type || {};

      if (isStale()) return;

      setUnreadByType((prev) => ({
        ...prev,
        daily: !!unread?.daily,
        weekly: !!unread?.weekly,
        monthly: !!unread?.monthly,
      }));
      setUnreadResolved(true);
    } catch (e) {
      if (isStale()) return;
      console.warn("AnalysisScreen: failed to refresh unread badges", e);
    }

    void selfStructureTask;
    await requestParentTabUnreadRefresh();
  }, [fetchSelfStructureHistoryUnread, fetchSelfStructureLatestUnread, requestParentTabUnreadRefresh]);

  const markReportRead = useCallback(async (report) => {
    const reportId = report?.id ? String(report.id) : null;
    if (!reportId) return;

    try {
      await apiPost("/report-reads/mark", {
        report_id: reportId,
        report_table: ANALYSIS_WIRE.reportFamily.table,
        report_scope: ANALYSIS_WIRE.reportFamily.scope,
      });
    } catch (e) {
      console.warn("AnalysisScreen: failed to mark report read", e);
    }
  }, []);

  const emotionAnalysisUnread = unreadResolved
    ? !!(unreadByType.daily || unreadByType.weekly || unreadByType.monthly)
    : !!(
        prefetchedUnreadByType.daily ||
        prefetchedUnreadByType.weekly ||
        prefetchedUnreadByType.monthly
      );
  const selfStructureUnread =
    !subscriptionLoading && isPaid
      ? selfStructureUnreadResolved
        ? !!(selfStructureLatestUnread || selfStructureHistoryUnread)
        : !!prefetchedUnreadByType.selfStructure
      : false;

  return {
    unreadByType,
    unreadResolved,
    selfStructureUnreadResolved,
    selfStructureLatestUnread,
    selfStructureHistoryUnread,
    prefetchedUnreadByType,
    emotionAnalysisUnread,
    selfStructureUnread,
    refreshUnreadBadges,
    markSelfStructureLatestSeen,
    markReportRead,
  };
}
