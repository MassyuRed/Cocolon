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
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { useSubscription } from "../SubscriptionContext";
import { getHistoryRetentionLabel } from "../lib/historyRetentionLabel";

const TYPE_LABEL = Object.freeze({
  monthly: "自己構造",
});

const TYPE_JP = Object.freeze({
  monthly: "自己構造",
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

function sanitizeSelfStructureHistoryTitle(title) {
  const raw = String(title || "").trim();
  if (!raw) return "";
  if (/^自己構造レポート[：:]/.test(raw)) {
    return "自己構造レポート";
  }
  return raw;
}

function sanitizeSelfStructureReportText(text) {
  return String(text || "").replace(
    /自己構造分析レポート[（(]月次[）)]/g,
    "自己構造分析レポート"
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
      <div class="meta">Exported from Cocolon / MyProfile</div>
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
// MyWeb と同じ既読管理テーブルを利用する。
// 既読の判定は report_id で行う（myweb_reports / myprofile_reports をまたいでも uuid は衝突しない想定）。
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
      report_table: "myprofile_reports",
      report_scope: "myprofile",
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
  onGenerateLatest,
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
  const historyRetentionLabel = useMemo(
    () => getHistoryRetentionLabel(subscriptionTier),
    [subscriptionTier]
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

      generateBtn: {
        backgroundColor: colors.BORDER_GOLD,
        borderColor: colors.BORDER_GOLD,
      },
      generateText: { color: colors.ACCENT_TEXT },

      row: {
        backgroundColor: colors.PANEL_BG,
        borderBottomColor: colors.CARD_BORDER,
      },
      rowTitle: { color: colors.TEXT_ON_LIGHT },
      rowSub: { color: colors.TEXT_ON_LIGHT },
      rowMeta: { color: colors.TEXT_SUBTLE },

      iconBtn: {
        backgroundColor: colors.PANEL_BG,
        borderColor: colors.CARD_BORDER,
      },
      iconBtnText: { color: colors.TEXT_ON_LIGHT },

      listEmptyText: { color: colors.TEXT_SUBTLE },
    };
  }, [isDark, colors]);

  const title = `${TYPE_LABEL[reportType] || "Report"}の履歴`;

  const load = useCallback(async ({ append = false, offset = 0 } = {}) => {
    setErrorMsg("");
    if (append) setLoadingMore(true);
    else setLoading(true);
    try {
      const json = await apiGet(
        `/myprofile/reports/history?report_type=${encodeURIComponent(reportType)}&limit=${HISTORY_PAGE_LIMIT}&offset=${encodeURIComponent(offset)}`
      );
      const baseRows = Array.isArray(json?.items) ? json.items : [];
      const readSet = await fetchReadReportIdSet(baseRows.map((r) => r.id));
      const mapped = baseRows.map((r) => ({
        ...r,
        title: sanitizeSelfStructureHistoryTitle(r?.title),
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
  }, [reportType]);

  useEffect(() => {
    load({ append: false, offset: 0 });
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load({ append: false, offset: 0 });
    setRefreshing(false);
  }, [load]);

  const loadMore = useCallback(async () => {
    if (loading || refreshing || loadingMore || !hasMore || nextOffset == null) return;
    await load({ append: true, offset: nextOffset });
  }, [loading, refreshing, loadingMore, hasMore, nextOffset, load]);

  const handleOpen = useCallback(
    async (id) => {
      try {
        const json = await apiGet(`/myprofile/reports/${encodeURIComponent(String(id))}`);
        const data = json?.item;
        if (!data) {
          Alert.alert("取得エラー", "レポートの取得に失敗しました");
          return;
        }

        const sanitizedData = {
          ...data,
          title: sanitizeSelfStructureHistoryTitle(data?.title),
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
    [onOpenReport]
  );

  const handleExport = useCallback(
    async (id) => {
      try {
        const json = await apiGet(`/myprofile/reports/${encodeURIComponent(String(id))}`);
        const data = json?.item;
        if (!data) {
          Alert.alert("取得エラー", "レポートの取得に失敗しました");
          return;
        }

        await exportTextToPdf(
          sanitizeSelfStructureHistoryTitle(data?.title) || title,
          sanitizeSelfStructureReportText(data?.content_text)
        );
      } catch (e) {
        Alert.alert("PDF保存エラー", String(e?.message || e));
      }
    },
    [title]
  );

  const headerLabel = useMemo(() => {
    const jp = TYPE_JP[reportType] || "レポート";
    return `${jp}レポート履歴`;
  }, [reportType]);

  return (
    <SafeAreaView style={[styles.container, themed.container]}>
      {/* ヘッダー */}
      <View style={[styles.header, themed.header]}>
        <CocolonBackButton
          onPress={onBack}
          style={styles.backBtn}
          accessibilityLabel="自己構造レポート履歴から戻る"
        />

        <Text
          style={[styles.headerTitle, themed.headerTitle, { color: colors.TITLE_GOLD }]}
          numberOfLines={1}
        >
          {headerLabel}
        </Text>

        <View style={styles.headerSide} />
      </View>

      {/* 操作 */}
      <View style={styles.topActions}>
        <TouchableOpacity
          style={[styles.generateBtn, themed.generateBtn]}
          onPress={onGenerateLatest}
          activeOpacity={0.85}
        >
          <Ionicons
            name="sparkles-outline"
            size={16}
            color={isDark ? colors.ACCENT_TEXT : "#111827"}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.generateText, themed.generateText]}>
            現在の自己構造を見る
          </Text>
        </TouchableOpacity>

        {showHistoryRetentionLabel ? (
          <Text
            style={[
              styles.historyRetentionText,
              { color: isDark ? colors.TEXT_ON_LIGHT : "#111827" },
            ]}
          >
            {historyRetentionLabel}
          </Text>
        ) : null}
      </View>

      {/* エラー */}
      {errorMsg ? <Text style={styles.error}>取得エラー: {errorMsg}</Text> : null}

      {/* リスト */}
      {loading && rows.length === 0 ? (
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
                  { padding: 16, color: "#6B7280" },
                  themed.listEmptyText,
                ]}
              >
                まだ履歴がありません（変化があった月だけここに表示されます）
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
                <Text style={[styles.rowTitle, themed.rowTitle]} numberOfLines={1}>
                  {item.title || title}
                </Text>
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
                color={isDark ? colors.TEXT_SUBTLE : "#9CA3AF"}
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
  backText: { marginLeft: 2, color: "#374151", fontSize: 13, fontWeight: "600" },
  headerSide: { width: 70 },
  headerTitle: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: "#111827",
    textAlign: "center",
  },

  topActions: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 8 },
  historyRetentionText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F3F4F6",
  },
  generateText: { fontSize: 13, color: "#111827", fontWeight: "700" },

  error: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 6,
    color: "#B91C1C",
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

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
  rowTitle: { fontSize: 14, fontWeight: "800", color: "#111827" },
  rowSub: { marginTop: 2, fontSize: 12, color: "#374151" },
  rowMeta: { marginTop: 2, fontSize: 11, color: "#6B7280" },
  listFooter: { paddingVertical: 16, alignItems: "center", justifyContent: "center" },
  listFooterSpacer: { height: 12 },
  loadMoreBtn: { marginHorizontal: 16, marginTop: 8, marginBottom: 16, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, paddingVertical: 10, alignItems: "center", justifyContent: "center" },
  loadMoreText: { fontSize: 13, fontWeight: "700", color: "#374151" },

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
    color: "#111827",
    fontWeight: "700",
  },
  }, ui));
}

