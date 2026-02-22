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
import { supabase } from "../lib/supabase";
import { getCurrentUserId } from "../lib/user";
import { useTheme } from "../theme/ThemeContext";

const TYPE_LABEL = Object.freeze({
  monthly: "SelfMonthlyReport",
});

const TYPE_JP = Object.freeze({
  monthly: "自己構造（月次）",
});

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
      return `${md(s)} ～ ${md(e)}（28日）`;
    }
    return `${md(s)} ～ ${md(e)}`;
  } catch {
    return "";
  }
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
async function fetchReadReportIdSet(userId, reportIds) {
  try {
    const ids = Array.isArray(reportIds) ? reportIds.filter(Boolean) : [];
    if (!userId || ids.length === 0) return new Set();

    const { data, error } = await supabase
      .from("report_reads")
      .select("report_id")
      .eq("user_id", userId)
      .in("report_id", ids);

    if (error) return new Set();
    return new Set((data || []).map((r) => r.report_id));
  } catch {
    return new Set();
  }
}

async function markReportAsRead(userId, reportId) {
  if (!userId || !reportId) return false;
  const now = new Date().toISOString();

  // 既存の Supabase スキーマ差異を吸収するため、複数パターンで upsert を試す
  const candidates = [
    {
      row: { user_id: userId, report_id: reportId, read_at: now },
      onConflict: "user_id,report_id",
    },
    {
      row: {
        user_id: userId,
        report_id: reportId,
        report_table: "myprofile_reports",
        read_at: now,
      },
      onConflict: "user_id,report_table,report_id",
    },
    {
      row: {
        user_id: userId,
        report_id: reportId,
        report_scope: "myprofile",
        read_at: now,
      },
      onConflict: "user_id,report_scope,report_id",
    },
    {
      row: { user_id: userId, report_id: reportId, scope: "myprofile", read_at: now },
      onConflict: "user_id,scope,report_id",
    },
    // fallback (read_at 無し)
    { row: { user_id: userId, report_id: reportId }, onConflict: "user_id,report_id" },
    {
      row: { user_id: userId, report_id: reportId, report_table: "myprofile_reports" },
      onConflict: "user_id,report_table,report_id",
    },
    {
      row: { user_id: userId, report_id: reportId, report_scope: "myprofile" },
      onConflict: "user_id,report_scope,report_id",
    },
    {
      row: { user_id: userId, report_id: reportId, scope: "myprofile" },
      onConflict: "user_id,scope,report_id",
    },
  ];

  for (const c of candidates) {
    const { error } = await supabase
      .from("report_reads")
      .upsert(c.row, { onConflict: c.onConflict });
    if (!error) return true;
  }
  return false;
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
  const [errorMsg, setErrorMsg] = useState("");

  const { themeName, colors } = useTheme();
  const isDark = themeName === "dark";

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

  const load = useCallback(async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        setRows([]);
        setErrorMsg("ユーザー情報を取得できませんでした（ログインしてください）");
        return;
      }

      const q = supabase
        .from("myprofile_reports")
        .select(
          "id, report_type, title, period_start, period_end, generated_at, updated_at"
        )
        .eq("user_id", userId)
        .eq("report_type", reportType)
        .order("period_end", { ascending: false })
        .limit(60);

      const { data, error } = await q;

      if (error) {
        setRows([]);
        setErrorMsg(String(error.message || "取得に失敗しました"));
      } else {
        const baseRows = Array.isArray(data) ? data : [];

        // 既読情報を付与（既読の行は少し暗く表示）
        const readSet = await fetchReadReportIdSet(
          userId,
          baseRows.map((r) => r.id)
        );
        setRows(baseRows.map((r) => ({ ...r, isRead: readSet.has(r.id) })));
      }
    } catch (e) {
      setRows([]);
      setErrorMsg(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }, [reportType]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const handleOpen = useCallback(
    async (id) => {
      try {
        const userId = await getCurrentUserId();
        if (!userId) {
          Alert.alert("エラー", "ユーザー情報を取得できませんでした。");
          return;
        }

        const { data, error } = await supabase
          .from("myprofile_reports")
          .select(
            "id, report_type, title, period_start, period_end, content_text, content_json, generated_at, updated_at"
          )
          .eq("id", id)
          .eq("user_id", userId)
          .single();

        if (error) {
          Alert.alert(
            "取得エラー",
            String(error.message || "レポートの取得に失敗しました")
          );
          return;
        }
        // 開いたら既読にする（失敗しても閲覧は継続）
        try {
          const ok = await markReportAsRead(userId, id);
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

        if (onOpenReport) onOpenReport(data);
      } catch (e) {
        Alert.alert("エラー", String(e?.message || e));
      }
    },
    [onOpenReport]
  );

  const handleExport = useCallback(
    async (id) => {
      try {
        const userId = await getCurrentUserId();
        if (!userId) {
          Alert.alert("エラー", "ユーザー情報を取得できませんでした。");
          return;
        }

        const { data, error } = await supabase
          .from("myprofile_reports")
          .select("title, content_text")
          .eq("id", id)
          .eq("user_id", userId)
          .single();

        if (error) {
          Alert.alert(
            "取得エラー",
            String(error.message || "レポートの取得に失敗しました")
          );
          return;
        }

        await exportTextToPdf(data?.title || title, data?.content_text || "");
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
        <TouchableOpacity
          onPress={onBack}
          style={styles.backBtn}
          activeOpacity={0.8}
        >
          <Ionicons
            name="chevron-back-outline"
            size={20}
            color={isDark ? colors.TEXT_ON_LIGHT : "#374151"}
          />
          <Text style={[styles.backText, themed.backText]}>MyProfile</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, themed.headerTitle]}>
          {headerLabel}
        </Text>

        <View style={{ width: 86 }} />
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
            最新の自己構造分析レポートを生成
          </Text>
        </TouchableOpacity>
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
                まだ履歴がありません（「最新の自己構造分析レポートを生成」から作成できます）
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
                <Text style={[styles.rowSub, themed.rowSub]} numberOfLines={1}>
                  {formatRangeJP(item.period_start, item.period_end, reportType)}
                </Text>
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
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  backBtn: { flexDirection: "row", alignItems: "center", width: 86 },
  backText: { marginLeft: 2, color: "#374151", fontSize: 13, fontWeight: "600" },
  headerTitle: { fontSize: 14, fontWeight: "800", color: "#111827" },

  topActions: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 8 },
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
});

