import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NativeModules,
  Linking,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import CocolonBackButton from "../components/CocolonBackButton";
import { supabase } from "../lib/supabase";
import { apiGet, apiPost, apiFetch } from "../lib/apiClient";
import {
  ANALYSIS_WIRE,
  buildAnalysisReportDetailPath,
  buildAnalysisReportsReadyPath,
} from "../lib/compat/legacyWireContracts";
import { useTheme } from "../theme/ThemeContext";
import { useSubscription } from "../SubscriptionContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { getHistoryRetentionLabel } from "../lib/historyRetentionLabel";
import { isKokoroWeatherReportRecord } from "./analysisReport/kokoroWeatherFormatters";
// Subscription (Analysis paywall)
// - free: weekly/monthly are chart-only (no text / no PDF)
// - plus/premium: can view full text + PDF
const READY_PAGE_LIMIT = 50;

async function getAccessToken() {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    return sessionData?.session?.access_token ?? null;
  } catch {
    return null;
  }
}

function extractReadyItems(payload) {
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.reports)) return payload.reports;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.data?.reports)) return payload.data.reports;
  if (Array.isArray(payload)) return payload;
  return [];
}

async function fetchReadyReports(accessToken, reportType, { limit = READY_PAGE_LIMIT, offset = 0 } = {}) {
  const readyPath = buildAnalysisReportsReadyPath({ reportType, limit, offset });
  const res = await apiFetch(readyPath, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`ready failed: ${res.status}`);
    err.status = res.status;
    err.body = text;
    throw err;
  }

  const json = await res.json();
  return {
    json,
    items: extractReadyItems(json).filter(isKokoroWeatherReportRecord),
    viewerTier: typeof json?.viewer_tier === "string" ? json.viewer_tier : null,
    hasMore: Boolean(json?.has_more),
    nextOffset:
      typeof json?.next_offset === "number"
        ? json.next_offset
        : json?.next_offset != null
          ? Number(json.next_offset)
          : null,
  };
}

function extractReportDetailItem(payload) {
  if (payload?.item && typeof payload.item === "object") return payload.item;
  if (payload?.report && typeof payload.report === "object") return payload.report;
  if (payload?.data?.item && typeof payload.data.item === "object") return payload.data.item;
  if (payload && typeof payload === "object" && payload.id) return payload;
  return null;
}

async function fetchKokoroWeatherReportDetail(reportId) {
  const payload = await apiGet(buildAnalysisReportDetailPath(reportId));
  const item = extractReportDetailItem(payload);
  if (!isKokoroWeatherReportRecord(item)) return null;
  return {
    item,
    viewerTier: typeof payload?.viewer_tier === "string" ? payload.viewer_tier : null,
  };
}

function normalizeSubscriptionTier(raw) {
  const v = String(raw || "").trim();
  if (!v) return "free";
  const lower = v.toLowerCase();

  // Japanese labels
  if (v.includes("無料")) return "free";
  if (v.includes("プラス") || v.includes("Plus") || v.includes("plus")) return "plus";
  if (v.includes("プレミアム") || v.includes("Premium") || v.includes("premium"))
    return "premium";

  // plain
  if (lower === "free") return "free";
  if (lower === "plus") return "plus";
  if (lower === "premium") return "premium";

  return "free"; // fail-closed
}

function canViewAnalysisFullText(tier) {
  return tier === "plus" || tier === "premium";
}


// 🕛 配布スケジュール（JST固定）
import { formatJstDateTime, getNextDistributionUtcMs } from "./AnalysisReportScheduleUtils";

const TYPE_LABEL = Object.freeze({
  daily: "DailyReport",
  weekly: "WeeklyReport",
  monthly: "MonthlyReport",
});

const TYPE_JP = Object.freeze({
  daily: "こころ天気（日）",
  weekly: "こころ天気（週）",
  monthly: "こころ天気（月）",
});

function normalizeReportType(raw) {
  const v = String(raw || "").trim().toLowerCase();
  if (v === "daily" || v === "weekly" || v === "monthly") return v;
  return "weekly";
}

function formatDateJP(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function formatRangeJP(startIso, endIso, reportType) {
  try {
    const s = new Date(startIso);
    const e = new Date(endIso);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "";

    const md = (d) => `${d.getMonth() + 1}/${d.getDate()}`;

    if (reportType === "daily") {
      return `${s.getFullYear()}/${s.getMonth() + 1}/${s.getDate()}`;
    }
    if (reportType === "weekly") {
      return `${md(s)} ～ ${md(e)}`;
    }
    if (reportType === "monthly") {
      return `${md(s)} ～ ${md(e)}`;
    }
    return `${md(s)} ～ ${md(e)}`;
  } catch {
    return "";
  }
}

async function exportTextToPdf(title, text) {
  const safeTitle = String(title || "report");
  const safeText = String(text || "");

  // Bare RN 向け: react-native-html-to-pdf を入れている場合は NativeModules 経由でPDF生成
  // （未導入の場合でもアプリが落ちないように、ここでは require を使わない）
  const RNHTMLtoPDF = NativeModules?.RNHTMLtoPDF;

  // HTML 化（PDF用）
  const html = `
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, "Hiragino Sans", "Noto Sans JP", sans-serif; padding: 18px; }
        h1 { font-size: 18px; margin: 0 0 12px 0; }
        pre { white-space: pre-wrap; font-size: 12px; line-height: 1.5; }
        .meta { font-size: 10px; color: #666; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <h1>${escapeHtml(safeTitle)}</h1>
      <div class="meta">Exported from Cocolon / Analysis</div>
      <pre>${escapeHtml(safeText)}</pre>
    </body>
  </html>`;

  // PDF生成（NativeModules.RNHTMLtoPDF がある場合）
  if (RNHTMLtoPDF && typeof RNHTMLtoPDF.convert === "function") {
    try {
      const fileName = safeTitle
        .replace(/[\\\/:*?"<>|]/g, "_")
        .slice(0, 60);

      const res = await RNHTMLtoPDF.convert({
        html,
        fileName: fileName || "report",
        base64: false,
      });

      const filePath = res?.filePath || res?.file || res?.path;
      if (!filePath) {
        Alert.alert("PDF保存", "PDFは生成しましたが保存先の取得に失敗しました。");
        return;
      }

      const uri = String(filePath).startsWith("file://")
        ? String(filePath)
        : `file://${filePath}`;

      // 可能なら開く（端末にPDFビューアがあれば開ける）
      try {
        const can = await Linking.canOpenURL(uri);
        if (can) {
          await Linking.openURL(uri);
        } else {
          Alert.alert("PDF保存", `PDFを生成しました。\n保存先: ${uri}`);
        }
      } catch (e) {
        Alert.alert("PDF保存", `PDFを生成しました。\n保存先: ${uri}`);
      }

      return;
    } catch (e) {
      Alert.alert("PDF保存エラー", String(e?.message || e));
      return;
    }
  }

  // フォールバック（モジュール未導入）: テキスト共有で代替
  Alert.alert(
    "PDF保存（セットアップが必要）",
    "この端末環境ではPDF生成モジュールが未導入のため、いったんテキスト共有で保存できます。\n\nPDF保存を有効化したい場合は react-native-html-to-pdf の導入をご検討ください。",
    [
      {
        text: "テキスト共有",
        onPress: async () => {
          try {
            await Share.share({ title: safeTitle, message: safeText });
          } catch (e) {
            Alert.alert("共有エラー", String(e?.message || e));
          }
        },
      },
      { text: "OK" },
    ]
  );
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function AnalysisReportHistoryScreen({
  reportType,
  onBack,
  onOpenReport,
  onGenerateLatest,
  onOpenSubscription, // ✅ Analysis paywall CTA（SubscriptionSelectへ）
}) {
  const [rows, setRows] = useState([]);
  const [readIdSet, setReadIdSet] = useState(() => new Set()); // report_id string
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextOffset, setNextOffset] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const normalizedReportType = useMemo(() => normalizeReportType(reportType), [reportType]);
  const loadSeqRef = useRef(0);

  const { themeName, colors } = useTheme();
  const { tier: ctxSubscriptionTier, loading: subscriptionContextLoading } = useSubscription();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";

  // Subscription tier (fail-closed: unknown => free)
  const [subscriptionTier, setSubscriptionTier] = useState("free");
  const [tierLoading, setTierLoading] = useState(true);

  useEffect(() => {
    if (subscriptionContextLoading) {
      setTierLoading(true);
      return;
    }
    setSubscriptionTier(normalizeSubscriptionTier(ctxSubscriptionTier));
    setTierLoading(false);
  }, [ctxSubscriptionTier, subscriptionContextLoading]);


  // 画面内で “現在時刻(JST)” と “次回配布” を更新するためのtick
  const [nowTick, setNowTick] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    console.log("HISTORY reportType =", normalizedReportType, "raw =", reportType ?? "(missing)");
  }, [normalizedReportType, reportType]);

  const nowJstLabel = useMemo(() => formatJstDateTime(nowTick), [nowTick]);
  const nextDistUtcMs = useMemo(
    () => getNextDistributionUtcMs(normalizedReportType, nowTick),
    [normalizedReportType, nowTick]
  );
  const nextJstLabel = useMemo(
    () => formatJstDateTime(nextDistUtcMs),
    [nextDistUtcMs]
  );

  const isTextLocked = useMemo(() => {
    if (normalizedReportType !== "weekly" && normalizedReportType !== "monthly") return false;
    return false;
  }, [normalizedReportType]);

  const themed = {};

  const title = `${TYPE_JP[normalizedReportType] || "こころ天気"}の履歴`;
  const load = useCallback(async () => {
    const loadSeq = ++loadSeqRef.current;
    const isStale = () => loadSeq !== loadSeqRef.current;

    console.log("HISTORY load start =", {
      loadSeq,
      reportType: normalizedReportType,
      rawReportType: reportType ?? null,
    });

    setErrorMsg("");
    setLoadMoreError(false);
    setLoading(true);
    try {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        if (isStale()) return;
        setRows([]);
        setReadIdSet(new Set());
        setHasMore(false);
        setNextOffset(null);
        setErrorMsg("ログイン情報を取得できませんでした（ログインしてください）");
        return;
      }

      // ✅ Phase2: 履歴は Analysis ready reports から取得（READY/PUBLISHED + retention/tier はAPIで統一）
      let ready;
      try {
        ready = await fetchReadyReports(accessToken, normalizedReportType, { limit: READY_PAGE_LIMIT, offset: 0 });
      } catch (err) {
        if (isStale()) return;
        setRows([]);
        setReadIdSet(new Set());
        setHasMore(false);
        setNextOffset(null);
        setErrorMsg(`取得に失敗しました (${err?.status || "network"})`);
        console.warn(
          "AnalysisReportHistoryScreen: analysis/reports/ready failed",
          err?.status,
          err?.body || err?.message || err
        );
        return;
      }

      console.log("READY viewerTier =", ready?.viewerTier);
      console.log(
        "READY items length =",
        Array.isArray(ready?.items) ? ready.items.length : "no-items"
      );

      if (typeof ready?.viewerTier === "string") {
        setSubscriptionTier(normalizeSubscriptionTier(ready.viewerTier));
      }

      const activeReady = ready;
      const list = Array.isArray(activeReady?.items) ? activeReady.items : [];

      if (isStale()) {
        console.log("HISTORY stale load ignored =", {
          loadSeq,
          reportType: normalizedReportType,
        });
        return;
      }

      setRows(list);
      setHasMore(Boolean(activeReady?.hasMore));
      setNextOffset(activeReady?.nextOffset ?? null);
      console.log("rows set:", list.length, "reportType =", normalizedReportType);

      // 既読状態は report-reads API から取得
      try {
        const ids = list.map((r) => String(r?.id || "")).filter(Boolean);
        if (ids.length === 0) {
          setReadIdSet(new Set());
        } else {
          const query = ids.map((id) => `report_ids=${encodeURIComponent(id)}`).join("&");
          const json = await apiGet(`/report-reads/status?${query}`);
          const readIds = Array.isArray(json?.read_ids) ? json.read_ids : [];
          setReadIdSet(new Set(readIds.map((x) => String(x || "")).filter(Boolean)));
        }
      } catch {
        setReadIdSet(new Set());
      }
    } catch (e) {
      if (isStale()) return;
      setRows([]);
      setReadIdSet(new Set());
      setHasMore(false);
      setNextOffset(null);
      setErrorMsg(String(e?.message || e));
    } finally {
      if (!isStale()) {
        setLoading(false);
      }
    }
  }, [normalizedReportType, reportType]);

  useEffect(() => {
    load();
    return () => {
      loadSeqRef.current += 1;
    };
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const loadMore = useCallback(async () => {
    if (loading || refreshing || loadingMore || !hasMore || nextOffset == null) return;
    setLoadingMore(true);
    setLoadMoreError(false);
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) { setLoadMoreError(true); return; }
      const ready = await fetchReadyReports(accessToken, normalizedReportType, {
        limit: READY_PAGE_LIMIT,
        offset: nextOffset,
      });
      if (typeof ready?.viewerTier === "string") {
        setSubscriptionTier(normalizeSubscriptionTier(ready.viewerTier));
      }
      const list = Array.isArray(ready?.items) ? ready.items : [];
      setRows((prev) => {
        const existing = new Set((prev || []).map((r) => String(r?.id || "")));
        const merged = [...(prev || [])];
        for (const item of list) {
          const id = String(item?.id || "");
          if (!id || existing.has(id)) continue;
          existing.add(id);
          merged.push(item);
        }
        return merged;
      });
      setHasMore(Boolean(ready?.hasMore));
      setNextOffset(ready?.nextOffset ?? null);
      try {
        const ids = list.map((r) => String(r?.id || "")).filter(Boolean);
        if (ids.length > 0) {
          const query = ids.map((id) => `report_ids=${encodeURIComponent(id)}`).join("&");
          const json = await apiGet(`/report-reads/status?${query}`);
          const readIds = Array.isArray(json?.read_ids) ? json.read_ids : [];
          setReadIdSet((prev) => {
            const next = new Set(prev);
            for (const rid of readIds) next.add(String(rid || ""));
            return next;
          });
        }
      } catch {
        // ignore incremental read-status failure
      }
    } catch (e) {
      console.warn("AnalysisReportHistoryScreen: loadMore failed", e);
      setLoadMoreError(true);
    } finally {
      setLoadingMore(false);
    }
  }, [loading, refreshing, loadingMore, hasMore, nextOffset, normalizedReportType]);

  const handleOpen = useCallback(
    async (id) => {
      try {
        const rid = String(id);

        // ✅ レポート本体は Analysis ready reports 由来の rows から取得（表示ロジックをAPIに統一）
        let data = rows.find((r) => String(r?.id || "") === rid) || null;

        // 念のため: rows に見つからない場合は ready を再取得（best-effort）
        if (!data) {
          const accessToken = await getAccessToken();
          if (accessToken) {
            try {
              const ready = await fetchReadyReports(accessToken, normalizedReportType, { limit: Math.max(rows.length, READY_PAGE_LIMIT), offset: 0 });
              const list = Array.isArray(ready?.items) ? ready.items : [];
              data = list.find((r) => String(r?.id || "") === rid) || null;
            } catch {
              data = null;
            }
          }
        }

        if (!data || !isKokoroWeatherReportRecord(data)) {
          Alert.alert("取得エラー", "このこころ天気は現在の表示対象外です。");
          return;
        }

        const detail = await fetchKokoroWeatherReportDetail(rid);
        if (!detail?.item) {
          Alert.alert("取得エラー", "このこころ天気は現在の表示対象外です。");
          return;
        }
        const viewerTier = detail.viewerTier || subscriptionTier;

        // 既読を記録（失敗しても閲覧は継続）
        try {
          await apiPost("/report-reads/mark", {
            report_id: String(id),
            report_table: ANALYSIS_WIRE.reportFamily.table,
            report_scope: ANALYSIS_WIRE.reportFamily.scope,
          });
          setReadIdSet((prev) => {
            const next = new Set(prev);
            next.add(String(id));
            return next;
          });
        } catch {
          // ignore
        }

        // viewer_tier を渡して Viewer 側で追加の subscription/me を省略できるようにする（後方互換）
        if (onOpenReport) onOpenReport({ ...detail.item, viewer_tier: viewerTier });
      } catch (e) {
        Alert.alert("エラー", String(e?.message || e));
      }
    },
    [onOpenReport, rows, normalizedReportType, subscriptionTier]
  );

  const handleExport = useCallback(async (id) => {
    try {

    if (isTextLocked) {
      if (tierLoading) {
        Alert.alert("プラン確認中", "プラン情報を確認しています。もう一度お試しください。");
        return;
      }
      const jp = TYPE_JP[normalizedReportType] || "レポート";
      const msg = `Freeプランの${jp}は基本図と短め表示です。\n\nPlusプラン以上で本文の閲覧、観測理由、PDF出力が利用できます。`;
      const buttons = [];
      if (typeof onOpenSubscription === "function") {
        buttons.push({
          text: "Plusプランを見る",
          onPress: () => {
            try {
              onOpenSubscription?.();
            } catch {
              // no-op
            }
          },
        });
      }
      buttons.push({ text: "OK" });
      Alert.alert("PDF出力はPlusプラン以上", msg, buttons);
      return;
    }


      const rid = String(id);

      // ✅ export対象も Analysis ready reports 由来の rows から解決（表示ロジックをAPIに統一）
      let data = rows.find((r) => String(r?.id || "") === rid) || null;

      // 念のため: rows に見つからない場合は ready を再取得（best-effort）
      if (!data) {
        const accessToken = await getAccessToken();
        if (accessToken) {
          try {
            const ready = await fetchReadyReports(accessToken, normalizedReportType, { limit: Math.max(rows.length, READY_PAGE_LIMIT), offset: 0 });
            const list = Array.isArray(ready?.items) ? ready.items : [];
            data = list.find((r) => String(r?.id || "") === rid) || null;
          } catch {
            data = null;
          }
        }
      }

      if (!data || !isKokoroWeatherReportRecord(data)) {
        Alert.alert("取得エラー", "このこころ天気は現在の表示対象外です。");
        return;
      }

      const detail = await fetchKokoroWeatherReportDetail(rid);
      if (!detail?.item) {
        Alert.alert("取得エラー", "このこころ天気は現在の表示対象外です。");
        return;
      }
      data = detail.item;

      // v3: prefer content_json.standardReport.contentText; fallback to legacy content_text
      let text = String(data?.content_text || "");
      try {
        const cj = data?.content_json;
        const std = cj?.standardReport || cj?.standard_report;
        const stdText =
          (typeof std?.contentText === "string" && std.contentText) ||
          (typeof std?.content_text === "string" && std.content_text) ||
          (typeof std?.text === "string" && std.text) ||
          (typeof cj?.standardText === "string" && cj.standardText) ||
          (typeof cj?.standard_text === "string" && cj.standard_text) ||
          "";
        if (!text.trim() && String(stdText || "").trim()) text = String(stdText);
      } catch {
        // ignore
      }

      if (!text.trim()) {
        Alert.alert("PDF保存", "本文がありませんでした。");
        return;
      }

      await exportTextToPdf(data?.title || title, text);
    } catch (e) {
      Alert.alert("PDF保存エラー", String(e?.message || e));
    }
  }, [title, isTextLocked, tierLoading, normalizedReportType, onOpenSubscription, rows]);

  const headerLabel = useMemo(() => {
    const jp = TYPE_JP[normalizedReportType] || "レポート";
    return `${jp}の履歴`;
  }, [normalizedReportType]);
  const historyRetentionLabel = useMemo(
    () => getHistoryRetentionLabel(subscriptionTier),
    [subscriptionTier]
  );
  const showHistoryRetentionLabel = !tierLoading && !!historyRetentionLabel;

  const listHeader = (<View>
      {/* 操作 */}
      <View style={styles.topActions}>
        <View style={[styles.scheduleCard, themed.scheduleCard]}
          >
          <Text style={[styles.scheduleTitle, themed.scheduleTitle]}>配布スケジュール（日本時間）</Text>
          <Text style={[styles.scheduleLine, themed.scheduleLine]}>
            現在: {nowJstLabel}
          </Text>
          <Text style={[styles.scheduleLine, themed.scheduleLine]}>
            次回配布: {nextJstLabel}
          </Text>


            {(normalizedReportType === "weekly" || normalizedReportType === "monthly") &&
            !tierLoading &&
            isTextLocked ? (
              <TouchableOpacity
                style={[styles.paywallBtn, themed.paywallBtn]}
                onPress={() => {
                  if (typeof onOpenSubscription === "function") {
                    try {
                      onOpenSubscription?.();
                    } catch {
                      // no-op
                    }
                    return;
                  }
                  Alert.alert(
                    "プラン確認",
                    "加入画面を開けませんでした。もう一度お試しください。"
                  );
                }}
                activeOpacity={0.85}
              >
                <Text style={[styles.paywallBtnText, themed.paywallBtnText]}>
                  Plusプランを見る
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={
                    isDark
                      ? colors.ACCENT_TEXT || colors.TEXT_ON_LIGHT
                      : ui?.text?.accentOnButton ?? colors.ACCENT_TEXT
                  }
                />
              </TouchableOpacity>
            ) : null}

        </View>

        {showHistoryRetentionLabel ? (
          <Text
            style={[
              styles.historyRetentionText,
              { color: ui?.text?.primary ?? colors.TEXT_ON_LIGHT },
            ]}
          >
            {historyRetentionLabel}
          </Text>
        ) : null}
      </View>

      {/* エラー */}
      {errorMsg ? <Text style={styles.error}>取得エラー: {errorMsg}</Text> : null}

  </View>);

  return (
    <SafeAreaView edges={["left", "right"]} style={[styles.container, themed.container]}>
      {/* ヘッダー */}
      <View style={[styles.header, themed.header]}>
        <CocolonBackButton onPress={onBack} style={styles.backBtn} />

        <Text style={[styles.headerTitle, themed.headerTitle, { color: colors.TITLE_GOLD }]}>{headerLabel}</Text>

        <View style={{ width: 44 }} />
      </View>

      {/* リスト */}
      <FlatList
          ListHeaderComponent={listHeader}
          data={rows}
          keyExtractor={(item) => String(item.id)}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.TEXT_ON_LIGHT}
              colors={[colors.TEXT_ON_LIGHT]}
            />
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            loading ? <ActivityIndicator accessibilityLabel="履歴を読み込み中" color={colors.TITLE_GOLD} style={{ padding: 24 }} /> : !errorMsg ? (
              <Text style={[{ ...ui.typography.description, padding: 16, color: ui?.text?.description ?? colors.TEXT_SUBTLE }, themed.listEmptyText]}>
                まだ履歴がありません（配布タイミングになると自動で追加されます）\n次回配布: {nextJstLabel}
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.row,
                themed.row,
                readIdSet.has(String(item.id)) && styles.rowRead,
              ]}
              accessibilityRole="button"
              onPress={() => handleOpen(item.id)}
              activeOpacity={0.85}
            >
              <View style={{ flex: 1 }}>
                {readIdSet.has(String(item.id)) ? <Text style={[styles.rowMeta, { color: colors.TITLE_GOLD }]}>既読</Text> : null}
                <Text style={[styles.rowTitle, themed.rowTitle]}>
                  {item.title || title}
                </Text>
                <Text style={[styles.rowSub, themed.rowSub]}>
                  {formatRangeJP(item.period_start, item.period_end, normalizedReportType)}
                </Text>
                <Text style={[styles.rowMeta, themed.rowMeta]}>
                  作成: {formatDateJP(item.generated_at || item.updated_at || item.period_end)}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color={ui?.text?.description ?? colors.TEXT_SUBTLE} />
            </TouchableOpacity>
          )}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.listFooter}>
                <ActivityIndicator size="small" color={isDark ? colors.TEXT_ON_LIGHT : undefined} />
              </View>
            ) : hasMore ? (
              <View>
                {loadMoreError ? <Text accessibilityLiveRegion="polite" style={styles.error}>続きの履歴を取得できませんでした。表示中の履歴を保ったまま再試行できます。</Text> : null}
              <TouchableOpacity
                style={styles.loadMoreBtn}
                onPress={loadMore}
                accessibilityRole="button" accessibilityLabel="さらに履歴を読み込む"
                activeOpacity={0.85}
              >
                <Text style={[styles.loadMoreText, themed.rowMeta]}>{loadMoreError ? "もう一度読み込む" : "さらに表示"}</Text>
              </TouchableOpacity>
              </View>
            ) : <View style={styles.listFooterSpacer} />
          }
        />
    </SafeAreaView>
  );
}

function createStyles(COLORS, ui) {
  const text = ui?.text || {};
  return StyleSheet.create(applyTypographyTokens({
  listContent: { width: "100%", maxWidth: 680, alignSelf: "center", paddingHorizontal: 20, paddingBottom: 24 },
  container: {
      flex: 1,
      backgroundColor: COLORS.BG_SILVER,
    },
  header: {
      paddingTop: 10,
      paddingHorizontal: 20,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      maxWidth: 640,
      alignSelf: "center",
    },
  backBtn: {
      flexDirection: "row",
      alignItems: "center",
      width: 44,
      minWidth: 44,
      minHeight: 44,
      flexShrink: 0,
      justifyContent: "center",
    },
  backText: {
      marginLeft: 2,
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },
  headerTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      flex: 1,
      flexShrink: 1,
      minWidth: 0,
      marginHorizontal: 8,
      letterSpacing: 0,
      textAlign: "center",
    },

  topActions: {
      paddingHorizontal: 0,
      paddingTop: 16,
      paddingBottom: 12,
      width: "100%",
      maxWidth: 640,
      alignSelf: "center",
    },
  historyRetentionText: {
      marginTop: 8,
      color: COLORS.TEXT_ON_LIGHT,
    },

  scheduleCard: {
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      borderRadius: 24,
      backgroundColor: COLORS.PANEL_BG,
      padding: 20,
    },
  scheduleTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 8,
    },
  scheduleLine: {
      color: COLORS.TEXT_SUBTLE,
      marginBottom: 4,
    },
  scheduleHint: {
      color: COLORS.TEXT_SUBTLE,
      marginTop: 6,
    },

  generateBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      minHeight: 44,
      maxWidth: 520,
      paddingHorizontal: 16,
    },
  generateText: {
      color: COLORS.ACCENT_TEXT,
      flexShrink: 1,
      textAlign: "center",
    },

  // paywall CTA
  paywallBtn: {
      marginTop: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      minHeight: 44,
      maxWidth: 520,
      paddingHorizontal: 16,
    },
  paywallBtnText: {
      color: COLORS.ACCENT_TEXT,
      marginRight: 8,
      flexShrink: 1,
      textAlign: "center",
    },

  error: {
      paddingHorizontal: 0,
      color: COLORS.ERROR,
      width: "100%",
      maxWidth: 640,
      alignSelf: "center",
      paddingVertical: 12,
    },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
      width: "100%",
      maxWidth: 640,
      alignSelf: "center",
      minHeight: 44,
      backgroundColor: COLORS.PANEL_BG,
      gap: 12,
      borderWidth: 1, borderColor: COLORS.CARD_BORDER, borderRadius: 24, marginBottom: 12,
    },
  // ✅ 既読の行は少し暗めに（未読が目立つ）
  rowRead: {

    },
  rowTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
      minWidth: 0,
    },
  rowSub: {
      marginTop: 4,
      color: COLORS.TEXT_SUBTLE,
    },
  rowMeta: {
      marginTop: 4,
      color: COLORS.TEXT_SUBTLE,
    },
  listFooter: { paddingVertical: 16, alignItems: "center", justifyContent: "center" },
  listFooterSpacer: { height: 12 },
  loadMoreBtn: {
      marginHorizontal: 0,
      marginTop: 8,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      borderRadius: 24,
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
      width: "90%",
      maxWidth: 520,
      alignSelf: "center",
      minHeight: 44,
      backgroundColor: COLORS.SURFACE_TONAL,
      paddingHorizontal: 16,
    },
  loadMoreText: {
      color: COLORS.ON_SURFACE_TONAL,
      textAlign: "center",
      flexShrink: 1,
    },

  iconBtn: {
      marginLeft: 10,
      marginRight: 10,
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      alignItems: "center",
      justifyContent: "center",
      minWidth: 44,
      minHeight: 44,
    },
  iconBtnText: {
      marginTop: 2,
      color: COLORS.TEXT_ON_LIGHT,
      textAlign: "center",
    },
  }, ui, {"backText":"button","headerTitle":"screenTitle","historyRetentionText":"description","scheduleTitle":"sectionTitle","scheduleLine":"description","scheduleHint":"description","generateText":"button","paywallBtnText":"button","error":"body","rowTitle":"body","rowSub":"description","rowMeta":"meta","loadMoreText":"button","iconBtnText":"button"}));
}
