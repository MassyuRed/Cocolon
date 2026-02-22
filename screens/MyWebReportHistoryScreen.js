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
import { supabase } from "../lib/supabase";
import { getCurrentUserId } from "../lib/user";
import { useTheme } from "../theme/ThemeContext";
// Subscription (MyWeb paywall)
// - free: weekly/monthly are chart-only (no text / no PDF)
// - plus/premium: can view full text + PDF
const MYMODEL_API_BASE_URL =
  process.env.EXPO_PUBLIC_MYMODEL_API_URL || "https://mashos-api.onrender.com";
const SUBSCRIPTION_ME_ENDPOINT = `${MYMODEL_API_BASE_URL}/subscription/me`;

// Phase2: MyWeb（配布/生成）はMashOS側でensure（オンデマンド）
const MYWEB_REPORTS_ENSURE_ENDPOINT = `${MYMODEL_API_BASE_URL}/myweb/reports/ensure`;

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

function canViewMyWebFullText(tier) {
  return tier === "plus" || tier === "premium";
}


// 🕛 配布スケジュール（JST固定）
import { formatJstDateTime, getNextDistributionUtcMs } from "./MyWebReportScheduler";

const TYPE_LABEL = Object.freeze({
  daily: "DailyReport",
  weekly: "WeeklyReport",
  monthly: "MonthlyReport",
});

const TYPE_JP = Object.freeze({
  daily: "日報",
  weekly: "週報",
  monthly: "月報",
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

    if (reportType === "daily") {
      return `${s.getFullYear()}/${s.getMonth() + 1}/${s.getDate()}（1日）`;
    }
    if (reportType === "weekly") {
      return `${md(s)} ～ ${md(e)}（7日）`;
    }
    if (reportType === "monthly") {
      return `${md(s)} ～ ${md(e)}（28日）`;
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
      <div class="meta">Exported from Cocolon / MyWeb</div>
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

export default function MyWebReportHistoryScreen({
  reportType = "daily",
  onBack,
  onOpenReport,
  onGenerateLatest,
  onOpenSubscription, // ✅ MyWeb paywall CTA（SubscriptionSelectへ）
}) {
  const [rows, setRows] = useState([]);
  const [readIdSet, setReadIdSet] = useState(() => new Set()); // report_id string
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { themeName, colors } = useTheme();
  const isDark = themeName === "dark";

  // Subscription tier (fail-closed: unknown => free)
  const [subscriptionTier, setSubscriptionTier] = useState("free");
  const [tierLoading, setTierLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setTierLoading(true);
      try {
        let accessToken = null;
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          accessToken = sessionData?.session?.access_token ?? null;
        } catch {
          accessToken = null;
        }

        if (!accessToken) {
          if (!cancelled) setSubscriptionTier("free");
          return;
        }

        const res = await fetch(SUBSCRIPTION_ME_ENDPOINT, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) throw new Error(`subscription/me failed: ${res.status}`);

        const json = await res.json();
        const tier = normalizeSubscriptionTier(
          json?.subscription_tier || json?.tier || json?.plan
        );

        if (!cancelled) setSubscriptionTier(tier);
      } catch (e) {
        if (!cancelled) setSubscriptionTier("free");
      } finally {
        if (!cancelled) setTierLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);


  // 画面内で “現在時刻(JST)” と “次回配布” を更新するためのtick
  const [nowTick, setNowTick] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const nowJstLabel = useMemo(() => formatJstDateTime(nowTick), [nowTick]);
  const nextDistUtcMs = useMemo(
    () => getNextDistributionUtcMs(reportType, nowTick),
    [reportType, nowTick]
  );
  const nextJstLabel = useMemo(
    () => formatJstDateTime(nextDistUtcMs),
    [nextDistUtcMs]
  );

  const isTextLocked = useMemo(() => {
    if (reportType !== "weekly" && reportType !== "monthly") return false;
    if (tierLoading) return true; // fail-closed
    return !canViewMyWebFullText(subscriptionTier);
  }, [reportType, subscriptionTier, tierLoading]);

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

      scheduleCard: {
        backgroundColor: colors.PANEL_BG,
        borderColor: colors.CARD_BORDER,
      },
      scheduleTitle: { color: colors.TEXT_ON_LIGHT },
      scheduleLine: { color: colors.TEXT_ON_LIGHT },
      scheduleHint: { color: colors.TEXT_SUBTLE },

      generateBtn: {
        backgroundColor: colors.BORDER_GOLD,
        borderColor: colors.BORDER_GOLD,
      },
      generateText: { color: colors.ACCENT_TEXT },

      // paywall CTA
      paywallBtn: {
        backgroundColor: colors.BORDER_GOLD,
        borderColor: colors.BORDER_GOLD,
      },
      paywallBtnText: { color: colors.ACCENT_TEXT },

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
      // ✅ Phase2: まずMashOS側で「あるべき最新レポート」が無ければ生成する（冪等）
      // （生成に失敗しても履歴表示は継続）
      try {
        let accessToken = null;
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          accessToken = sessionData?.session?.access_token ?? null;
        } catch {
          accessToken = null;
        }

        if (accessToken) {
          const res = await fetch(MYWEB_REPORTS_ENSURE_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              types: [reportType],
              force: false,
            }),
          });

          if (!res.ok) {
            const t = await res.text();
            console.warn(
              "MyWebReportHistoryScreen: myweb/reports/ensure failed",
              res.status,
              t
            );
          }
        }
      } catch (e) {
        console.warn("MyWebReportHistoryScreen: myweb/reports/ensure failed", e);
      }

      const userId = await getCurrentUserId();
      if (!userId) {
        setRows([]);
        setErrorMsg("ユーザー情報を取得できませんでした（ログインしてください）");
        return;
      }

      const q = supabase
        .from("myweb_reports")
        .select("id, report_type, title, period_start, period_end, generated_at, updated_at")
        .eq("user_id", userId)
        .eq("report_type", reportType)
        .order("period_end", { ascending: false })
        .limit(60);

      const { data, error } = await q;

      if (error) {
        setRows([]);
        setReadIdSet(new Set());
        setErrorMsg(String(error.message || "取得に失敗しました"));
      } else {
        const list = Array.isArray(data) ? data : [];
        setRows(list);

        // ✅ 既読状態の取得（report_reads）
        try {
          const ids = list.map((r) => String(r?.id || "")).filter(Boolean);
          if (ids.length === 0) {
            setReadIdSet(new Set());
          } else {
            const { data: reads, error: rErr } = await supabase
              .from("report_reads")
              .select("report_id")
              .eq("user_id", userId)
              .in("report_id", ids);

            if (rErr) {
              // 既読テーブル未導入/権限不足等でも、履歴表示自体は継続
              setReadIdSet(new Set());
            } else {
              const set = new Set(
                (Array.isArray(reads) ? reads : [])
                  .map((x) => String(x?.report_id || ""))
                  .filter(Boolean)
              );
              setReadIdSet(set);
            }
          }
        } catch {
          setReadIdSet(new Set());
        }
      }
    } catch (e) {
      setRows([]);
      setReadIdSet(new Set());
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

        
        const selectCols = isTextLocked
          ? "id, report_type, title, period_start, period_end, content_json, generated_at, updated_at"
          : "id, report_type, title, period_start, period_end, content_text, content_json, generated_at, updated_at";

const { data, error } = await supabase
          .from("myweb_reports")
          .select(selectCols)
          .eq("id", id)
          .eq("user_id", userId)
          .single();

        if (error) {
          Alert.alert("取得エラー", String(error.message || "レポートの取得に失敗しました"));
          return;
        }

        // ✅ 既読を記録（失敗しても閲覧は継続）
        try {
          const { error: insErr } = await supabase
            .from("report_reads")
            .insert({ user_id: userId, report_id: id });

          // 既に既読（PK重複）の場合は無視する
          const msg = String(insErr?.message || "");
          const isDup = /duplicate key|already exists|23505/i.test(msg);
          if (insErr && !isDup) throw insErr;

          setReadIdSet((prev) => {
            const next = new Set(prev);
            next.add(String(id));
            return next;
          });
        } catch {
          // ignore
        }

        if (onOpenReport) onOpenReport(data);
      } catch (e) {
        Alert.alert("エラー", String(e?.message || e));
      }
    },
    [onOpenReport, isTextLocked]
  );

  const handleExport = useCallback(async (id) => {
    try {

    if (isTextLocked) {
      if (tierLoading) {
        Alert.alert("プラン確認中", "プラン情報を確認しています。もう一度お試しください。");
        return;
      }
      const jp = TYPE_JP[reportType] || "レポート";
      const msg = `無料会員は${jp}はグラフのみ表示です。\n\nPlus会員以上で本文の閲覧とPDF出力が利用できます。`;
      const buttons = [];
      if (typeof onOpenSubscription === "function") {
        buttons.push({
          text: "Plus会員になる",
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
      Alert.alert("PDF出力はPlus会員以上", msg, buttons);
      return;
    }


      const userId = await getCurrentUserId();
      if (!userId) {
        Alert.alert("エラー", "ユーザー情報を取得できませんでした。");
        return;
      }

      const { data, error } = await supabase
        .from("myweb_reports")
        .select("title, content_text")
        .eq("id", id)
        .eq("user_id", userId)
        .single();

      if (error) {
        Alert.alert("取得エラー", String(error.message || "レポートの取得に失敗しました"));
        return;
      }

      await exportTextToPdf(data?.title || title, data?.content_text || "");
    } catch (e) {
      Alert.alert("PDF保存エラー", String(e?.message || e));
    }
  }, [title, isTextLocked, tierLoading, reportType, onOpenSubscription]);

  const headerLabel = useMemo(() => {
    const jp = TYPE_JP[reportType] || "レポート";
    return `${jp}履歴`;
  }, [reportType]);

  return (
    <SafeAreaView style={[styles.container, themed.container]}>
      {/* ヘッダー */}
      <View style={[styles.header, themed.header]}>
        <CocolonBackButton onPress={onBack} style={[styles.backBtn, { width: 70 }]} />

        <Text style={[styles.headerTitle, themed.headerTitle, { color: colors.TITLE_GOLD }]}>{headerLabel}</Text>

        <View style={{ width: 70 }} />
      </View>

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


            {(reportType === "weekly" || reportType === "monthly") &&
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
                  Plus会員になる
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={
                    isDark
                      ? colors.ACCENT_TEXT || colors.TEXT_ON_LIGHT
                      : "#111827"
                  }
                />
              </TouchableOpacity>
            ) : null}

        </View>
      </View>

      {/* エラー */}
      {errorMsg ? <Text style={styles.error}>取得エラー: {errorMsg}</Text> : null}

      {/* リスト */}
      {loading && rows.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={isDark ? colors.TEXT_ON_LIGHT : undefined} />
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
              <Text style={[{ padding: 16, color: "#6B7280" }, themed.listEmptyText]}>
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

              <Ionicons name="chevron-forward" size={18} color={isDark ? colors.TEXT_SUBTLE : "#9CA3AF"} />
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
  backBtn: { flexDirection: "row", alignItems: "center", width: 70 },
  backText: { marginLeft: 2, color: "#374151", fontSize: 13, fontWeight: "600" },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#111827" },

  topActions: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 8 },

  scheduleCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    padding: 12,
  },
  scheduleTitle: { fontSize: 12, fontWeight: "800", color: "#111827", marginBottom: 6 },
  scheduleLine: { fontSize: 12, color: "#374151", marginBottom: 2 },
  scheduleHint: { fontSize: 11, color: "#6B7280", marginTop: 6 },

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

  // paywall CTA
  paywallBtn: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F3F4F6",
  },
  paywallBtnText: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "800",
    marginRight: 2,
  },

  error: { paddingHorizontal: 12, paddingTop: 6, paddingBottom: 6, color: "#B91C1C" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  // ✅ 既読の行は少し暗めに（未読が目立つ）
  rowRead: {
    opacity: 0.55,
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
  iconBtnText: { marginTop: 2, fontSize: 10, color: "#111827", fontWeight: "700" },
});
