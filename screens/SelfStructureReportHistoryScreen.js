import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NativeModules,
  Linking,
  Share,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CocolonBackButton from "../components/CocolonBackButton";
import { apiGet, apiPost } from "../lib/apiClient";
import { ANALYSIS_WIRE, SELF_STRUCTURE_WIRE, buildSelfStructureReportDetailPath, buildSelfStructureReportHistoryPath } from "../lib/compat/legacyWireContracts";
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { useSubscription } from "../SubscriptionContext";
import {
  canExportWatashiMapPdf,
  canViewWatashiMapHistory,
  formatWatashiMapReportModeLabel,
  getWatashiMapHistoryLockBody,
  getWatashiMapHistoryLockTitle,
  getWatashiMapHistoryRetentionLabel,
  normalizeWatashiMapTier,
} from "../components/selfStructure/watashiMapAccessPolicy";

const TYPE_LABEL = Object.freeze({
  monthly: "わたしマップ",
});

const TYPE_JP = Object.freeze({
  monthly: "わたしマップ",
});

const HISTORY_PAGE_LIMIT = 60;

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

    if (reportType === "monthly") {
      return "";
    }
    return `${md(s)} ～ ${md(e)}`;
  } catch {
    return "";
  }
}

function sanitizeSelfStructureHistoryTitle(title, reportMode = "standard") {
  const raw = String(title || "").trim();
  const fallback = `${formatWatashiMapReportModeLabel(reportMode)}のわたしマップ`;
  if (!raw) return fallback;
  return raw
    .replace(/^自己構造レポート[：:].*$/g, "詳しい自己分析レポート")
    .replace(/自己構造分析レポート[（(]月次[）)]/g, "詳しい自己分析レポート")
    .replace(/自己構造レポート/g, "詳しい自己分析レポート")
    .replace(/自己分析レポート/g, "詳しい自己分析レポート")
    .replace(/自己構造/g, "わたしマップ")
    .replace(/自己分析/g, "わたしマップ");
}

function sanitizeSelfStructureReportText(text) {
  const detailToken = "__COCOLON_DETAIL_SELF_REPORT__";
  return String(text || "")
    .replace(/詳しい自己分析レポート/g, detailToken)
    .replace(/自己構造分析レポート[（(]月次[）)]/g, "詳しい自己分析レポート")
    .replace(/自己構造レポート/g, "詳しい自己分析レポート")
    .replace(/自己分析レポート/g, "詳しい自己分析レポート")
    .replace(/現在の自己分析/g, "今のわたしマップ")
    .replace(/現在の自己構造/g, "今のわたしマップ")
    .replace(/自己構造/g, "わたしマップ")
    .replace(new RegExp(detailToken, "g"), "詳しい自己分析レポート");
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function exportTextToPdf(title, text) {
  const safeTitle = String(title || "report");
  const safeText = String(text || "");

  const RNHTMLtoPDF = NativeModules?.RNHTMLtoPDF;

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
      <div class="meta">Exported from Cocolon / Watashi Map</div>
      <pre>${escapeHtml(safeText)}</pre>
    </body>
  </html>`;

  if (RNHTMLtoPDF && typeof RNHTMLtoPDF.convert === "function") {
    try {
      const fileName = safeTitle.replace(/[\\\/:*?"<>|]/g, "_").slice(0, 60);

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

      try {
        const can = await Linking.canOpenURL(uri);
        if (can) {
          await Linking.openURL(uri);
        } else {
          Alert.alert("PDF保存", `PDFを生成しました。\n保存先: ${uri}`);
        }
      } catch {
        Alert.alert("PDF保存", `PDFを生成しました。\n保存先: ${uri}`);
      }

      return;
    } catch (e) {
      Alert.alert("PDF保存エラー", String(e?.message || e));
      return;
    }
  }

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


// === Read/Unread (report_reads) ===
// Analysis と同じ既読管理テーブルを利用する。
// 既読の判定は report_id で行う（Analysis / Self Structure の report family をまたいでも uuid は衝突しない想定）。
async function fetchReadReportIdSet(reportIds) {
  try {
    const ids = Array.isArray(reportIds) ? reportIds.filter(Boolean) : [];
    if (ids.length === 0) return new Set();
    const query = ids.map((id) => `report_ids=${encodeURIComponent(String(id))}`).join("&");
    const json = await apiGet(`/report-reads/status?${query}`);
    const readIds = Array.isArray(json?.read_ids) ? json.read_ids : [];
    return new Set(readIds.map((r) => String(r || "")).filter(Boolean));
  } catch {
    return new Set();
  }
}

async function markReportAsRead(reportId) {
  if (!reportId) return false;
  try {
    await apiPost("/report-reads/mark", {
      report_id: String(reportId),
      report_table: SELF_STRUCTURE_WIRE.reportFamily.table,
      report_scope: SELF_STRUCTURE_WIRE.reportFamily.scope,
    });
    return true;
  } catch {
    return false;
  }
}

export default function SelfStructureReportHistoryScreen({
  reportType = "monthly",
  onBack,
  onOpenReport,
  onOpenLatest,
  onOpenSubscription,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextOffset, setNextOffset] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const { themeName, colors } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const { tier: subscriptionTier, loading: subscriptionLoading } = useSubscription();
  const isDark = themeName === "dark";
  const viewerTier = normalizeWatashiMapTier(subscriptionTier);
  const historyAccessible = canViewWatashiMapHistory(viewerTier);
  const historyRetentionLabel = useMemo(
    () => getWatashiMapHistoryRetentionLabel(viewerTier),
    [viewerTier]
  );
  const showHistoryRetentionLabel = !subscriptionLoading && !!historyRetentionLabel;

  const themed = useMemo(() => {
    if (!isDark) return {};
    return {
      container: { backgroundColor: colors.BG_SILVER },
      header: {
        backgroundColor: colors.BG_SILVER,
        borderBottomColor: colors.CARD_BORDER,
      },
      backText: { color: colors.TEXT_ON_LIGHT },
      headerTitle: { color: colors.TEXT_ON_LIGHT },

      row: {
        backgroundColor: colors.PANEL_BG,
        borderBottomColor: colors.CARD_BORDER,
      },
      rowTitle: { color: colors.TEXT_ON_LIGHT },
      rowSub: { color: colors.TEXT_ON_LIGHT },
      rowMeta: { color: ui?.text?.description ?? colors.TEXT_SUBTLE },

      iconBtn: {
        backgroundColor: colors.PANEL_BG,
        borderColor: colors.CARD_BORDER,
      },
      iconBtnText: { color: colors.TEXT_ON_LIGHT },

      listEmptyText: { color: ui?.text?.description ?? colors.TEXT_SUBTLE },
    };
  }, [isDark, colors, ui]);

  const title = `${TYPE_LABEL[reportType] || "わたしマップ"}の履歴`;

  const load = useCallback(async ({ append = false, offset = 0 } = {}) => {
    setErrorMsg("");
    if (!historyAccessible) {
      setRows([]);
      setHasMore(false);
      setNextOffset(null);
      setLoading(false);
      setLoadingMore(false);
      return;
    }
    if (append) setLoadingMore(true);
    else setLoading(true);
    try {
      const json = await apiGet(
        buildSelfStructureReportHistoryPath({ reportType, limit: HISTORY_PAGE_LIMIT, offset })
      );
      const baseRows = Array.isArray(json?.items) ? json.items : [];
      const readSet = await fetchReadReportIdSet(baseRows.map((r) => r.id));
      const mapped = baseRows.map((r) => ({
        ...r,
        title: sanitizeSelfStructureHistoryTitle(r?.title, r?.report_mode),
        report_mode_label: formatWatashiMapReportModeLabel(r?.report_mode),
        isRead: readSet.has(r.id),
      }));
      setRows((prev) => {
        if (!append) return mapped;
        const existing = new Set((prev || []).map((r) => String(r?.id || "")));
        const merged = [...(prev || [])];
        for (const row of mapped) {
          const id = String(row?.id || "");
          if (!id || existing.has(id)) continue;
          existing.add(id);
          merged.push(row);
        }
        return merged;
      });
      setHasMore(Boolean(json?.has_more));
      setNextOffset(
        typeof json?.next_offset === "number"
          ? json.next_offset
          : json?.next_offset != null
            ? Number(json.next_offset)
            : null
      );
    } catch (e) {
      if (!append) setRows([]);
      setHasMore(false);
      setNextOffset(null);
      setErrorMsg(String(e?.message || e));
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  }, [historyAccessible, reportType]);

  useEffect(() => {
    if (subscriptionLoading) return;
    load({ append: false, offset: 0 });
  }, [load, subscriptionLoading]);

  const onRefresh = useCallback(async () => {
    if (!historyAccessible) return;
    setRefreshing(true);
    await load({ append: false, offset: 0 });
    setRefreshing(false);
  }, [historyAccessible, load]);

  const loadMore = useCallback(async () => {
    if (loading || refreshing || loadingMore || !hasMore || nextOffset == null) return;
    await load({ append: true, offset: nextOffset });
  }, [loading, refreshing, loadingMore, hasMore, nextOffset, load]);

  const handleOpen = useCallback(
    async (id) => {
      if (!historyAccessible) {
        if (typeof onOpenLatest === "function") onOpenLatest();
        return;
      }
      try {
        const json = await apiGet(buildSelfStructureReportDetailPath(id));
        const data = json?.item;
        if (!data) {
          Alert.alert("取得エラー", "レポートの取得に失敗しました");
          return;
        }

        const sanitizedData = {
          ...data,
          title: sanitizeSelfStructureHistoryTitle(data?.title, data?.report_mode),
          content_text: sanitizeSelfStructureReportText(data?.content_text),
        };

        try {
          const ok = await markReportAsRead(id);
          if (ok) {
            setRows((prev) =>
              (prev || []).map((r) =>
                r.id === id ? { ...r, isRead: true } : r
              )
            );
          }
        } catch {
          // no-op
        }

        if (onOpenReport) onOpenReport(sanitizedData);
      } catch (e) {
        Alert.alert("エラー", String(e?.message || e));
      }
    },
    [historyAccessible, onOpenLatest, onOpenReport]
  );

  const handleExport = useCallback(
    async (id) => {
      if (!canExportWatashiMapPdf(viewerTier)) {
        Alert.alert(
          "PDF保存",
          "PDF保存はPlusプラン以上で利用できます。わたしマップ概要はFreeプランでも見られます。",
          [
            { text: "閉じる", style: "cancel" },
            typeof onOpenSubscription === "function" ? { text: "プランを見る", onPress: onOpenSubscription } : null,
          ].filter(Boolean)
        );
        return;
      }
      try {
        const json = await apiGet(buildSelfStructureReportDetailPath(id));
        const data = json?.item;
        if (!data) {
          Alert.alert("取得エラー", "レポートの取得に失敗しました");
          return;
        }

        await exportTextToPdf(
          sanitizeSelfStructureHistoryTitle(data?.title, data?.report_mode) || title,
          sanitizeSelfStructureReportText(data?.content_text)
        );
      } catch (e) {
        Alert.alert("PDF保存エラー", String(e?.message || e));
      }
    },
    [onOpenSubscription, title, viewerTier]
  );

  const headerLabel = useMemo(() => {
    const jp = TYPE_JP[reportType] || "わたしマップ";
    return `${jp}の履歴`;
  }, [reportType]);

  return (
    <SafeAreaView style={[styles.container, themed.container]}>
      {/* ヘッダー */}
      <View style={[styles.header, themed.header]}>
        <CocolonBackButton
          onPress={onBack}
          style={styles.backBtn}
          accessibilityLabel="わたしマップの履歴から戻る"
        />

        <Text
          style={[styles.headerTitle, themed.headerTitle, { color: colors.TITLE_GOLD }]}
          numberOfLines={1}
        >
          {headerLabel}
        </Text>

        <View style={styles.headerSide} />
      </View>

      {/* 履歴保持範囲 */}
      {showHistoryRetentionLabel ? (
        <View style={styles.topActions}>
          <Text
            style={[
              styles.historyRetentionText,
              { color: ui?.text?.primary ?? colors.TEXT_ON_LIGHT },
            ]}
          >
            {historyRetentionLabel}
          </Text>
        </View>
      ) : null}

      {!subscriptionLoading && !historyAccessible ? (
        <View style={[styles.accessCard, isDark && themed.row]}>
          <Text style={[styles.accessTitle, themed.rowTitle]}>
            {getWatashiMapHistoryLockTitle(viewerTier)}
          </Text>
          <Text style={[styles.accessBody, themed.rowMeta]}>
            {getWatashiMapHistoryLockBody(viewerTier)}
          </Text>
          <View style={styles.accessButtonRow}>
            {typeof onOpenLatest === "function" ? (
              <TouchableOpacity style={styles.accessPrimaryButton} activeOpacity={0.85} onPress={onOpenLatest}>
                <Text style={styles.accessPrimaryButtonText}>今のわたしマップを見る</Text>
              </TouchableOpacity>
            ) : null}
            {typeof onOpenSubscription === "function" ? (
              <TouchableOpacity style={styles.accessSecondaryButton} activeOpacity={0.85} onPress={onOpenSubscription}>
                <Text style={[styles.accessSecondaryButtonText, themed.rowMeta]}>プランを見る</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ) : null}

      {/* エラー */}
      {errorMsg ? <Text style={styles.error}>取得エラー: {errorMsg}</Text> : null}

      {/* リスト */}
      {subscriptionLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={isDark ? colors.TEXT_ON_LIGHT : undefined} />
        </View>
      ) : !historyAccessible ? null : loading && rows.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="small"
            color={isDark ? colors.TEXT_ON_LIGHT : undefined}
          />
        </View>
      ) : (
        <FlatList
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
          contentContainerStyle={{ paddingVertical: 8 }}
          ListEmptyComponent={
            !errorMsg ? (
              <Text
                style={[
                  { padding: 16, color: ui?.text?.description ?? colors.TEXT_SUBTLE },
                  themed.listEmptyText,
                ]}
              >
                まだわたしマップの履歴がありません
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.row, themed.row, item.isRead && styles.rowRead]}
              onPress={() => handleOpen(item.id)}
              activeOpacity={0.85}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.rowTitleLine}>
                  <Text style={[styles.rowTitle, themed.rowTitle]} numberOfLines={1}>
                    {item.title || title}
                  </Text>
                  {item.report_mode_label ? (
                    <Text style={[styles.modeBadge, themed.rowMeta]}>{item.report_mode_label}</Text>
                  ) : null}
                </View>
                {formatRangeJP(item.period_start, item.period_end, reportType) ? (
                  <Text style={[styles.rowSub, themed.rowSub]} numberOfLines={1}>
                    {formatRangeJP(item.period_start, item.period_end, reportType)}
                  </Text>
                ) : null}
                <Text style={[styles.rowMeta, themed.rowMeta]} numberOfLines={1}>
                  作成: {formatDateJP(item.generated_at || item.updated_at || item.period_end)}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={ui?.text?.description ?? colors.TEXT_SUBTLE}
              />
            </TouchableOpacity>
          )}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.listFooter}>
                <ActivityIndicator size="small" color={isDark ? colors.TEXT_ON_LIGHT : undefined} />
              </View>
            ) : hasMore ? (
              <TouchableOpacity
                style={styles.loadMoreBtn}
                onPress={loadMore}
                activeOpacity={0.85}
              >
                <Text style={[styles.loadMoreText, themed.rowMeta]}>さらに表示</Text>
              </TouchableOpacity>
            ) : <View style={styles.listFooterSpacer} />
          }
        />
      )}
    </SafeAreaView>
  );
}

function createStyles(COLORS, ui) {
  const text = ui?.text || {};
  return StyleSheet.create(applyTypographyTokens({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: { width: 70, alignItems: "flex-start", justifyContent: "center" },
  backText: { marginLeft: 2, color: text.description ?? COLORS.TEXT_SUBTLE, fontSize: 13, fontWeight: "600" },
  headerSide: { width: 70 },
  headerTitle: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    textAlign: "center",
  },

  topActions: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 8 },
  historyRetentionText: {
    marginTop: 0,
    fontSize: 12,
    fontWeight: "600",
    color: text.primary ?? COLORS.TEXT_ON_LIGHT,
  },
  error: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 6,
    color: "#B91C1C",
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  accessCard: {
    marginHorizontal: 14,
    marginTop: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    backgroundColor: "#FFFBEB",
    padding: 14,
  },
  accessTitle: { fontSize: 16, lineHeight: 22, fontWeight: "900", color: text.primary ?? COLORS.TEXT_ON_LIGHT },
  accessBody: { marginTop: 6, fontSize: 13, lineHeight: 20, color: text.description ?? COLORS.TEXT_SUBTLE, fontWeight: "600" },
  accessButtonRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 12 },
  accessPrimaryButton: {
    borderRadius: 999,
    backgroundColor: COLORS.GOLD_BUTTON || "#D4AF37",
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  accessPrimaryButtonText: { fontSize: 12, fontWeight: "900", color: COLORS.ACCENT_TEXT || "#111827" },
  accessSecondaryButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 8,
  },
  accessSecondaryButtonText: { fontSize: 12, fontWeight: "900", color: text.description ?? COLORS.TEXT_SUBTLE },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  rowRead: {
    opacity: 0.6,
  },
  rowTitleLine: { flexDirection: "row", alignItems: "center", marginRight: 8 },
  rowTitle: { flex: 1, fontSize: 14, fontWeight: "800", color: text.primary ?? COLORS.TEXT_ON_LIGHT },
  modeBadge: {
    overflow: "hidden",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 7,
    paddingVertical: 2,
    fontSize: 10,
    fontWeight: "800",
    color: text.description ?? COLORS.TEXT_SUBTLE,
  },
  rowSub: { marginTop: 2, fontSize: 12, color: text.description ?? COLORS.TEXT_SUBTLE },
  rowMeta: { marginTop: 2, fontSize: 11, color: text.description ?? COLORS.TEXT_SUBTLE },
  listFooter: { paddingVertical: 16, alignItems: "center", justifyContent: "center" },
  listFooterSpacer: { height: 12 },
  loadMoreBtn: { marginHorizontal: 16, marginTop: 8, marginBottom: 16, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, paddingVertical: 10, alignItems: "center", justifyContent: "center" },
  loadMoreText: { fontSize: 13, fontWeight: "700", color: text.description ?? COLORS.TEXT_SUBTLE },

  iconBtn: {
    marginLeft: 10,
    marginRight: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnText: {
    marginTop: 2,
    fontSize: 10,
    color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    fontWeight: "700",
  },
  }, ui));
}

