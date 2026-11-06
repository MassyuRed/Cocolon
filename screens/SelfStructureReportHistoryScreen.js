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
import { apiGet, apiPost } from "../lib/apiClient";
import { ANALYSIS_WIRE, SELF_STRUCTURE_WIRE, buildSelfStructureReportDetailPath, buildSelfStructureReportHistoryPath } from "../lib/compat/legacyWireContracts";
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { useSubscription } from "../SubscriptionContext";
import { useAuth } from '../AuthContext';
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
  const { session } = useAuth();
  const scopeKey = `${session?.user?.id || ''}:${viewerTier}`;
  const scopeRef = useRef(scopeKey);
  scopeRef.current = scopeKey;
  const requestRef = useRef(0);
  const openRequestRef = useRef(0);
  const [loadedScope, setLoadedScope] = useState(null);
  const historyAccessible = canViewWatashiMapHistory(viewerTier);
  const historyRetentionLabel = useMemo(
    () => getWatashiMapHistoryRetentionLabel(viewerTier),
    [viewerTier]
  );
  const showHistoryRetentionLabel = !subscriptionLoading && !!historyRetentionLabel;

  const themed = {};

  const title = `${TYPE_LABEL[reportType] || "わたしマップ"}の履歴`;

  const load = useCallback(async ({ append = false, offset = 0 } = {}) => {
    const seq = ++requestRef.current;
    openRequestRef.current += 1;
    const active = () => scopeRef.current === scopeKey && requestRef.current === seq;
    setErrorMsg("");
    if (!session?.user?.id) {
      setRows([]); setLoading(false); setErrorMsg('ログインしてから、もう一度開いてください。'); return;
    }
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
      if (!append) await apiPost('/self-structure/monthly/ensure', {}, { expectedUserId: session.user.id, timeoutMs: 60000 });
      if (!active()) return;
      const json = await apiGet(
        buildSelfStructureReportHistoryPath({ reportType, limit: HISTORY_PAGE_LIMIT, offset }),
        { expectedUserId: session.user.id }
      );
      if (!active()) return;
      const baseRows = Array.isArray(json?.items) ? json.items : [];
      const readSet = await fetchReadReportIdSet(baseRows.filter(r => r.source_profile !== 'cumulative.v1').map((r) => r.id));
      if (!active()) return;
      const mapped = baseRows.map((r) => ({
        ...r,
        title: r.source_profile === 'cumulative.v1' ? `${String(r.snapshot_month).slice(0, 4)}年${Number(String(r.snapshot_month).slice(5, 7))}月のわたしマップ` : sanitizeSelfStructureHistoryTitle(r?.title, r?.report_mode),
        report_mode_label: r.source_profile === 'cumulative.v1' ? '' : formatWatashiMapReportModeLabel(r?.report_mode),
        isRead: readSet.has(r.id),
      }));
      setRows((prev) => {
        if (!append) return mapped;
        const rowKey = r => `${r.snapshot_month || ''}:${r.id}`;
        const existing = new Set((prev || []).map(rowKey));
        const merged = [...(prev || [])];
        for (const row of mapped) {
          const id = rowKey(row);
          if (!id || existing.has(id)) continue;
          existing.add(id);
          merged.push(row);
        }
        return merged;
      });
      setLoadedScope(scopeKey);
      setHasMore(Boolean(json?.has_more));
      setNextOffset(
        typeof json?.next_offset === "number"
          ? json.next_offset
          : json?.next_offset != null
            ? Number(json.next_offset)
            : null
      );
    } catch (e) {
      if (!active()) return;
      if (!append) setRows([]);
      setHasMore(false);
      setNextOffset(null);
      setErrorMsg(String(e?.message || e));
    } finally {
      if (active()) {
        if (append) setLoadingMore(false);
        else setLoading(false);
      }
    }
  }, [historyAccessible, reportType, scopeKey, session?.user?.id]);

  useEffect(() => {
    setRows([]);
    setLoadedScope(null);
    setHasMore(false);
    setNextOffset(null);
    if (subscriptionLoading) return;
    load({ append: false, offset: 0 });
    return () => { requestRef.current += 1; openRequestRef.current += 1; };
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
    async (item) => {
      const id = item.id;
      const scope = scopeKey;
      const openSeq = ++openRequestRef.current;
      const stillSelected = () => scopeRef.current === scope && openRequestRef.current === openSeq;
      if (!historyAccessible) {
        if (typeof onOpenLatest === "function") onOpenLatest();
        return;
      }
      try {
        const json = await apiGet(buildSelfStructureReportDetailPath(id, item.snapshot_month), { expectedUserId: session?.user?.id });
        if (!stillSelected()) return;
        const data = json?.item;
        if (!data) {
          Alert.alert("取得エラー", "レポートの取得に失敗しました");
          return;
        }

        const sanitizedData = data.source_profile === 'cumulative.v1' ? data : {
          ...data,
          title: sanitizeSelfStructureHistoryTitle(data?.title, data?.report_mode),
          content_text: sanitizeSelfStructureReportText(data?.content_text),
        };

        try {
          const ok = data.source_profile === 'cumulative.v1' ? false : await markReportAsRead(id);
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

        if (stillSelected() && onOpenReport) onOpenReport(sanitizedData);
      } catch (e) {
        if (stillSelected()) Alert.alert("エラー", String(e?.message || e));
      }
    },
    [historyAccessible, onOpenLatest, onOpenReport, scopeKey, session?.user?.id]
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

  const listHeader = (<View>
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
      <Text style={[styles.historyRetentionText, { color: colors.TEXT_ON_LIGHT, paddingHorizontal: 0 }]}>
        月を選ぶと、その月に保存した当時のマップと現在を見比べられます。プラン変更だけで保存済みの履歴は削除されません。
      </Text>

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

  </View>);

  return (
    <SafeAreaView edges={["left", "right"]} style={[styles.container, themed.container]}>
      {/* ヘッダー */}
      <View style={[styles.header, themed.header]}>
        <CocolonBackButton
          onPress={onBack}
          style={styles.backBtn}
          accessibilityLabel="わたしマップの履歴から戻る"
        />

        <Text
          style={[styles.headerTitle, themed.headerTitle, { color: colors.TITLE_GOLD }]}
        >
          {headerLabel}
        </Text>

        <View style={styles.headerSide} />
      </View>

      {/* リスト */}
      <FlatList
          ListHeaderComponent={listHeader}
          data={!subscriptionLoading && historyAccessible && loadedScope === scopeKey ? rows : []}
          keyExtractor={(item) => `${item.snapshot_month || ''}:${item.id}`}
          refreshControl={
            !subscriptionLoading && historyAccessible ? <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.TEXT_ON_LIGHT}
              colors={[colors.TEXT_ON_LIGHT]}
            /> : undefined
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            subscriptionLoading || loading ? <ActivityIndicator accessibilityLabel="履歴を読み込み中" color={colors.TITLE_GOLD} style={{ padding: 24 }} /> : historyAccessible && !errorMsg ? (
              <Text
                style={[
                  { ...ui.typography.description, padding: 16, color: ui?.text?.description ?? colors.TEXT_SUBTLE },
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
              accessibilityRole="button"
              onPress={() => handleOpen(item)}
              activeOpacity={0.85}
            >
              <View style={{ flex: 1 }}>
                {item.isRead ? <Text style={[styles.rowMeta, { color: colors.TITLE_GOLD }]}>既読</Text> : null}
                <View style={styles.rowTitleLine}>
                  <Text style={[styles.rowTitle, themed.rowTitle]}>
                    {item.snapshot_month ? `${item.snapshot_month.slice(0, 4)}年${Number(item.snapshot_month.slice(5, 7))}月` : item.title || title}
                  </Text>
                  {item.report_mode_label ? (
                    <Text style={[styles.modeBadge, themed.rowMeta]}>{item.report_mode_label}</Text>
                  ) : null}
                </View>
                {formatRangeJP(item.period_start, item.period_end, reportType) ? (
                  <Text style={[styles.rowSub, themed.rowSub]}>
                    {formatRangeJP(item.period_start, item.period_end, reportType)}
                  </Text>
                ) : null}
                <Text style={[styles.rowMeta, themed.rowMeta]}>
                  保存: {formatDateJP(item.captured_at || item.generated_at || item.updated_at || item.period_end)}
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
            ) : !subscriptionLoading && historyAccessible && hasMore ? (
              <TouchableOpacity
                style={styles.loadMoreBtn}
                onPress={loadMore}
                accessibilityRole="button" accessibilityLabel="さらに履歴を読み込む"
                activeOpacity={0.85}
              >
                <Text style={[styles.loadMoreText, themed.rowMeta]}>さらに表示</Text>
              </TouchableOpacity>
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
      width: 44,
      alignItems: "flex-start",
      justifyContent: "center",
      minWidth: 44,
      minHeight: 44,
      flexShrink: 0,
    },
  backText: {
      marginLeft: 2,
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },
  headerSide: {
      width: 44,
      flexShrink: 0,
    },
  headerTitle: {
      flex: 1,
      marginHorizontal: 8,
      letterSpacing: 0,
      color: COLORS.TEXT_ON_LIGHT,
      textAlign: "center",
      flexShrink: 1,
      minWidth: 0,
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
      marginTop: 0,
      color: COLORS.TEXT_ON_LIGHT,
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

  accessCard: {
      marginHorizontal: 0,
      marginTop: 10,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      borderRadius: 24,
      backgroundColor: COLORS.PANEL_BG,
      padding: 20,
      width: "90%",
      maxWidth: 640,
      alignSelf: "center",
    },
  accessTitle: {
      color: COLORS.TEXT_ON_LIGHT,
    },
  accessBody: {
      marginTop: 8,
      color: COLORS.TEXT_SUBTLE,
    },
  accessButtonRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 12,
      gap: 8,
    },
  accessPrimaryButton: {
      borderRadius: 24,
      backgroundColor: COLORS.GOLD_BUTTON,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginRight: 0,
      marginBottom: 0,
      minHeight: 44,
      maxWidth: "100%",
      flexShrink: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  accessPrimaryButtonText: {
      color: COLORS.ACCENT_TEXT,
      textAlign: "center",
      flexShrink: 1,
    },
  accessSecondaryButton: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.SURFACE_TONAL,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 0,
      minHeight: 44,
      maxWidth: "100%",
      flexShrink: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  accessSecondaryButtonText: {
      color: COLORS.ON_SURFACE_TONAL,
      textAlign: "center",
      flexShrink: 1,
    },

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
  rowRead: {

    },
  rowTitleLine: {
      flexDirection: "column",
      alignItems: "flex-start",
      marginRight: 8,
      gap: 8,
    },
  rowTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
      minWidth: 0,
    },
  modeBadge: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 10,
      paddingVertical: 4,
      color: COLORS.ON_SURFACE_TONAL,
      maxWidth: "100%",
      alignSelf: "flex-start",
      backgroundColor: COLORS.SURFACE_TONAL,
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
  }, ui, {"backText":"button","headerTitle":"screenTitle","historyRetentionText":"description","error":"body","accessTitle":"sectionTitle","accessBody":"body","accessPrimaryButtonText":"button","accessSecondaryButtonText":"button","rowTitle":"body","modeBadge":"description","rowSub":"description","rowMeta":"meta","loadMoreText":"button","iconBtnText":"button"}));
}

