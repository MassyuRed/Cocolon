import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
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

// ✅ Supabase（週報の履歴で days が保存されていないケースのフォールバック再計算に使用）
import { supabase } from "../lib/supabase";
import { getCurrentUserId } from "../lib/user";

// 🎨 Theme
import { useTheme } from "../theme/ThemeContext";
// Subscription (MyWeb paywall)
// - free: weekly/monthly are chart-only (no text / no PDF)
// - plus/premium: can view full text + PDF
const MYMODEL_API_BASE_URL =
  process.env.EXPO_PUBLIC_MYMODEL_API_URL || "https://mashos-api.onrender.com";
const SUBSCRIPTION_ME_ENDPOINT = `${MYMODEL_API_BASE_URL}/subscription/me`;

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


/**
 * MyWebReportViewerScreen
 * ------------------------------------------------------------
 * 履歴レポートの詳細表示。
 * 以前は content_text のみ表示していたが、
 * ・月報: content_json.metrics.weeks
 * ・週報: content_json.days（なければ期間内の emotions から再計算）
 * を使って、生成画面と同様のグラフを表示できるようにする。
 */

// ===== Chart constants (same as Report screens) =====
const STRENGTH_SCORE = Object.freeze({ weak: 1, medium: 2, strong: 3 });

const EMOTIONS = [
  { key: "joy", label: "喜び", color: "#FACC15" },
  { key: "sadness", label: "悲しみ", color: "#60A5FA" },
  { key: "anxiety", label: "不安", color: "#34D399" },
  { key: "anger", label: "怒り", color: "#F87171" },
  { key: "calm", label: "平穏", color: "#A78BFA" },
];

const JP_TO_KEY = {
  喜び: "joy",
  悲しみ: "sadness",
  不安: "anxiety",
  怒り: "anger",
  平穏: "calm",
};

function mapKey(maybeJpOrKey) {
  if (!maybeJpOrKey) return null;
  // 既存ロジック（日本語）
  if (JP_TO_KEY[maybeJpOrKey]) return JP_TO_KEY[maybeJpOrKey];
  // 互換（すでに key の場合）
  const s = String(maybeJpOrKey);
  if (EMOTIONS.some((e) => e.key === s)) return s;
  return null;
}

function coerceNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function safeParseJson(raw) {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * rows から日別バケットを生成（WeeklyReportMockScreen と同系）
 */
function buildDaysFromRows(rows) {
  const map = {};

  for (const row of rows || []) {
    const d = new Date(row.created_at);
    const y = d.getFullYear();
    const m = d.getMonth();
    const day = d.getDate();
    const dateKey = `${y}-${String(m + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const label = `${m + 1}/${day}`;

    if (!map[dateKey]) {
      map[dateKey] = {
        dateKey,
        label,
        date: new Date(y, m, day, 0, 0, 0, 0),
        joy: 0,
        sadness: 0,
        anxiety: 0,
        anger: 0,
        calm: 0,
        dominantKey: null,
      };
    }

    const bucket = map[dateKey];

    const details = Array.isArray(row.emotion_details)
      ? row.emotion_details
      : Array.isArray(row.emotions)
      ? row.emotions.map((t) => ({ type: t, strength: "medium" }))
      : [];

    for (const it of details) {
      const k = mapKey(it?.type);
      if (!k) continue;
      const w = STRENGTH_SCORE[it?.strength] || 0;
      bucket[k] += w;
    }
  }

  const buckets = Object.values(map).sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  // 支配的感情キー
  for (const b of buckets) {
    let domKey = null;
    let maxVal = 0;
    EMOTIONS.forEach((e) => {
      const v = b[e.key];
      if (v > maxVal) {
        maxVal = v;
        domKey = v > 0 ? e.key : null;
      }
    });
    b.dominantKey = domKey;
  }

  return buckets;
}

// ===== PDF export (existing) =====
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

function formatRange(periodStart, periodEnd) {
  try {
    const s = new Date(periodStart);
    const e = new Date(periodEnd);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "";
    const md = (d) => `${d.getMonth() + 1}/${d.getDate()}`;
    return `${md(s)} ～ ${md(e)}`;
  } catch {
    return "";
  }
}

export default function MyWebReportViewerScreen({
  report,
  onBack,
  onOpenMyProfile, // 互換のため残す（今は未使用）
  onOpenSubscription, // ✅ MyWeb paywall CTA（SubscriptionSelectへ）
}) {
  // 🎨 theme
  const { themeName, colors } = useTheme();
  const isDark = themeName === "dark";
  const screenBg = isDark ? colors.BG_SILVER : "#FFFFFF";

  // Subscription tier (fail-closed: unknown => free)
  const [subscriptionTier, setSubscriptionTier] = useState("free");
  const [tierLoading, setTierLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setTierLoading(true);
      try {
        // Supabase セッションからアクセストークン取得
        let accessToken = null;
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          accessToken = sessionData?.session?.access_token ?? null;
        } catch {
          accessToken = null;
        }

        if (!accessToken) {
          // 未ログイン等（念のため）: free 扱い
          if (!cancelled) setSubscriptionTier("free");
          return;
        }

        const res = await fetch(SUBSCRIPTION_ME_ENDPOINT, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error(`subscription/me failed: ${res.status}`);
        }

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

      pdfText: { color: colors.TEXT_ON_LIGHT },
      range: { color: colors.TEXT_SUBTLE },

      // ScrollView の余白部分まで黒くする（内容が短いと白が見えるのを防止）
      body: { backgroundColor: colors.BG_SILVER, flexGrow: 1 },

      p: { color: colors.TEXT_ON_LIGHT },
      empty: { color: colors.TEXT_SUBTLE },

      // chart
      chartCard: {
        backgroundColor: colors.PANEL_BG,
        borderColor: colors.CARD_BORDER,
      },
      chartTitle: { color: colors.TEXT_ON_LIGHT },
      legendText: { color: colors.TEXT_ON_LIGHT },
      chartArea: {
        backgroundColor: colors.FIELD_BG,
        borderColor: colors.CARD_BORDER,
      },
      // paywall CTA
      paywallBtn: {
        backgroundColor: colors.BORDER_GOLD,
        borderColor: colors.BORDER_GOLD,
      },
      paywallBtnText: { color: colors.ACCENT_TEXT },
      gridLabel: { color: colors.TEXT_SUBTLE },
      gridDivider: { backgroundColor: colors.CARD_BORDER },
      colLabel: { color: colors.TEXT_SUBTLE },
      errorText: { color: "#FCA5A5" },
      emptyText: { color: colors.TEXT_SUBTLE },
    };
  }, [isDark, colors]);

  const title = report?.title || "Report";
  const reportType = report?.report_type || "";
const isTextLocked = useMemo(() => {
    // Free(またはプラン未確定/失敗)は 週報・月報の本文を非表示（グラフのみ）
    if (reportType !== "weekly" && reportType !== "monthly") return false;
    if (tierLoading) return true; // fail-closed
    return !canViewMyWebFullText(subscriptionTier);
  }, [reportType, subscriptionTier, tierLoading]);

  const range = useMemo(() => {
    if (!report?.period_start || !report?.period_end) return "";
    return formatRange(report.period_start, report.period_end);
  }, [report?.period_start, report?.period_end]);

  const contentText = report?.content_text || "";
  const contentJson = useMemo(
    () => safeParseJson(report?.content_json),
    [report?.content_json]
  );

  // ===== v3 text resolution (prefer structured content_json over legacy content_text) =====
  const displayText = useMemo(() => {
    const legacy = String(contentText || "");

    // Standard (Plus) text: content_json.standardReport.contentText
    let stdText = "";
    try {
      const std = contentJson?.standardReport || contentJson?.standard_report;
      if (std && typeof std === "object") {
        if (typeof std.contentText === "string") stdText = std.contentText;
        else if (typeof std.content_text === "string") stdText = std.content_text;
        else if (typeof std.text === "string") stdText = std.text;
      }
      if (!stdText && typeof contentJson?.standardText === "string")
        stdText = contentJson.standardText;
      if (!stdText && typeof contentJson?.standard_text === "string")
        stdText = contentJson.standard_text;
    } catch {
      stdText = "";
    }

    // Structural (Premium) text: content_json.structuralReport.sections
    let structuralText = "";
    try {
      const structural =
        contentJson?.structuralReport ||
        contentJson?.structural_report ||
        contentJson?.astorMeta?.report ||
        contentJson?.astor_meta?.report ||
        contentJson?.meta?.report ||
        null;

      const sections =
        (structural &&
          (structural.sections ||
            structural?.meta?.report?.sections ||
            structural?.report?.sections)) ||
        [];

      if (Array.isArray(sections)) {
        const blocks = [];

        for (const sec of sections) {
          if (!sec || typeof sec !== "object") continue;

          const rawTitle =
            (typeof sec.title === "string" && sec.title) ||
            (typeof sec.heading === "string" && sec.heading) ||
            (typeof sec.label === "string" && sec.label) ||
            "";

          // Avoid exposing internal keys like snake_case when title isn't provided.
          const title =
            rawTitle && !String(rawTitle).includes("_")
              ? String(rawTitle).trim()
              : "";

          let body =
            (typeof sec.text === "string" && sec.text) ||
            (typeof sec.content === "string" && sec.content) ||
            (typeof sec.body === "string" && sec.body) ||
            "";

          if (!body && Array.isArray(sec.paragraphs)) {
            body = sec.paragraphs
              .filter((x) => typeof x === "string" && x.trim())
              .join("\n");
          }
          if (!body && Array.isArray(sec.lines)) {
            body = sec.lines
              .filter((x) => typeof x === "string" && x.trim())
              .join("\n");
          }

          const block = [title, body].filter(Boolean).join("\n").trim();
          if (block) blocks.push(block);
        }

        structuralText = blocks.join("\n\n").trim();
      }
    } catch {
      structuralText = "";
    }

    // Choose by subscription tier (fallback gracefully)
    if (subscriptionTier === "premium") return structuralText || stdText || legacy;
    if (subscriptionTier === "plus") return stdText || legacy;
    return stdText || legacy;
  }, [contentJson, contentText, subscriptionTier]);

  // ===== Monthly chart data (stored in content_json.metrics.weeks) =====
  const monthlyWeeks = useMemo(() => {
    if (reportType !== "monthly") return [];
    const weeks = contentJson?.metrics?.weeks || contentJson?.weeks;
    if (!Array.isArray(weeks)) return [];
    return weeks.map((w, idx) => ({
      index: typeof w?.index === "number" ? w.index : idx,
      label: String(w?.label || `第${idx + 1}週`),
      joy: coerceNum(w?.joy),
      sadness: coerceNum(w?.sadness),
      anxiety: coerceNum(w?.anxiety),
      anger: coerceNum(w?.anger),
      calm: coerceNum(w?.calm),
      total:
        typeof w?.total === "number"
          ? coerceNum(w.total)
          : coerceNum(w?.joy) +
            coerceNum(w?.sadness) +
            coerceNum(w?.anxiety) +
            coerceNum(w?.anger) +
            coerceNum(w?.calm),
    }));
  }, [reportType, contentJson]);

  const monthlyMaxSum = useMemo(() => {
    const sums = monthlyWeeks.map((w) => coerceNum(w.total));
    return Math.max(...sums, 1);
  }, [monthlyWeeks]);

  // ===== Weekly chart data (content_json.days or fallback re-calc) =====
  const [weeklyDays, setWeeklyDays] = useState([]);
  const [weeklyDaysLoading, setWeeklyDaysLoading] = useState(false);
  const [weeklyDaysError, setWeeklyDaysError] = useState("");

  useEffect(() => {
    // report が変わったら初期化
    if (reportType !== "weekly") {
      setWeeklyDays([]);
      setWeeklyDaysLoading(false);
      setWeeklyDaysError("");
      return;
    }

    // ① 保存済み days があればそれを採用（新形式）
    const savedDays = contentJson?.days;
    if (Array.isArray(savedDays)) {
      setWeeklyDays(
        savedDays.map((d) => ({
          dateKey: String(d?.dateKey || ""),
          label: String(d?.label || ""),
          joy: coerceNum(d?.joy),
          sadness: coerceNum(d?.sadness),
          anxiety: coerceNum(d?.anxiety),
          anger: coerceNum(d?.anger),
          calm: coerceNum(d?.calm),
          dominantKey: d?.dominantKey || null,
        }))
      );
      setWeeklyDaysLoading(false);
      setWeeklyDaysError("");
      return;
    }

    // ② 旧形式（days 未保存）の場合: 期間内 emotions から再計算して生成画面と同じグラフを復元
    let cancelled = false;

    (async () => {
      const startIso = report?.period_start;
      const endIso = report?.period_end;
      if (!startIso || !endIso) {
        setWeeklyDays([]);
        setWeeklyDaysError("期間情報が不足しています。");
        return;
      }

      setWeeklyDaysLoading(true);
      setWeeklyDaysError("");

      try {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error("ユーザー情報を取得できませんでした。");

        const { data, error } = await supabase
          .from("emotions")
          .select("created_at, emotions, emotion_details")
          .eq("user_id", userId)
          .gte("created_at", startIso)
          .lte("created_at", endIso)
          .order("created_at", { ascending: true });

        if (error) throw error;

        const rows = Array.isArray(data) ? data : [];
        const buckets = buildDaysFromRows(rows);

        if (!cancelled) {
          setWeeklyDays(buckets);
        }
      } catch (e) {
        if (!cancelled) {
          setWeeklyDays([]);
          setWeeklyDaysError(String(e?.message || e));
        }
      } finally {
        if (!cancelled) setWeeklyDaysLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reportType, contentJson, report?.period_start, report?.period_end]);

  const weeklyMaxSum = useMemo(() => {
    const sums = weeklyDays.map(
      (d) =>
        coerceNum(d.joy) +
        coerceNum(d.sadness) +
        coerceNum(d.anxiety) +
        coerceNum(d.anger) +
        coerceNum(d.calm)
    );
    return Math.max(...sums, 1);
  }, [weeklyDays]);

  return (
    <SafeAreaView
      style={[styles.container, themed.container, { backgroundColor: screenBg }]}
    >
      {/* Header */}
      <View style={[styles.header, themed.header]}>
        <CocolonBackButton onPress={onBack} style={styles.backBtn} />

        <Text style={[styles.headerTitle, themed.headerTitle]} numberOfLines={1}>
          {title}
        </Text>
        {!isTextLocked && String(displayText || "").trim() ? (
          <TouchableOpacity
            style={styles.pdfBtn}
            onPress={() => exportTextToPdf(title, displayText)}
            activeOpacity={0.85}
          >
            <Ionicons
              name="download-outline"
              size={18}
              color={isDark ? colors.TEXT_ON_LIGHT : "#111827"}
            />
            <Text style={[styles.pdfText, themed.pdfText]}>PDF</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 70 }} />
        )}
      </View>

      {!!range ? <Text style={[styles.range, themed.range]}>{range}</Text> : null}

      <ScrollView
        style={{ backgroundColor: screenBg }}
        contentContainerStyle={[styles.body, themed.body]}
      >
        {/* ===== Charts (history) ===== */}
        {reportType === "weekly" ? (
          <View style={[styles.chartCard, themed.chartCard]}>
            <Text style={[styles.chartTitle, themed.chartTitle]}>
              感情の時間推移
            </Text>

            <View style={styles.legendRow}>
              {EMOTIONS.map((e) => (
                <View key={e.key} style={styles.legendItem}>
                  <View
                    style={[styles.legendDot, { backgroundColor: e.color }]}
                  />
                  <Text style={[styles.legendText, themed.legendText]}>
                    {e.label}
                  </Text>
                </View>
              ))}
            </View>

            {weeklyDaysLoading ? (
              <View style={{ paddingVertical: 10 }}>
                <ActivityIndicator
                  color={isDark ? colors.TEXT_ON_LIGHT : undefined}
                />
              </View>
            ) : null}

            {!!weeklyDaysError ? (
              <Text style={[styles.chartError, themed.errorText]}>
                グラフ表示エラー: {weeklyDaysError}
              </Text>
            ) : null}

            <View style={[styles.chartArea, themed.chartArea]}>
              {/* グリッド線 */}
              <View style={styles.grid}>
                {[0, 25, 50, 75, 100].map((g) => (
                  <View key={g} style={styles.gridLine}>
                    <Text style={[styles.gridLabel, themed.gridLabel]}>{g}</Text>
                    <View style={[styles.gridDivider, themed.gridDivider]} />
                  </View>
                ))}
              </View>

              {/* データ列 */}
              <View style={styles.columnsWeekly}>
                {weeklyDays.map((d, idx) => {
                  const unit = 100 / (weeklyMaxSum || 1);
                  const segs = EMOTIONS.map((e) => ({
                    key: e.key,
                    color: e.color,
                    h: Math.max(0, coerceNum(d?.[e.key]) * unit),
                  })).filter((s) => s.h > 0.01);

                  const k = d?.dateKey ? String(d.dateKey) : `d-${idx}`;

                  return (
                    <View key={k} style={styles.colWrapWeekly}>
                      <View style={styles.colStackWeekly}>
                        {segs.map((s) => (
                          <View
                            key={s.key}
                            style={[
                              styles.colSeg,
                              { height: s.h, backgroundColor: s.color },
                            ]}
                          />
                        ))}
                      </View>
                      <Text style={[styles.colLabelWeekly, themed.colLabel]}>
                        {d?.label || ""}
                      </Text>
                    </View>
                  );
                })}

                {weeklyDays.length === 0 && !weeklyDaysLoading ? (
                  <View style={{ padding: 16 }}>
                    <Text
                      style={[
                        { fontSize: 12, color: "#6B7280" },
                        isDark && themed.emptyText,
                      ]}
                    >
                      この期間の入力はまだありません
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        ) : null}

        {reportType === "monthly" ? (
          <View style={[styles.chartCard, themed.chartCard]}>
            <Text style={[styles.chartTitle, themed.chartTitle]}>
              週ごとの感情分布
            </Text>

            <View style={styles.legendRow}>
              {EMOTIONS.map((e) => (
                <View key={e.key} style={styles.legendItem}>
                  <View
                    style={[styles.legendDot, { backgroundColor: e.color }]}
                  />
                  <Text style={[styles.legendText, themed.legendText]}>
                    {e.label}
                  </Text>
                </View>
              ))}
            </View>

            <View style={[styles.chartArea, themed.chartArea]}>
              {/* グリッド線 */}
              <View style={styles.grid}>
                {[0, 25, 50, 75, 100].map((g) => (
                  <View key={g} style={styles.gridLine}>
                    <Text style={[styles.gridLabel, themed.gridLabel]}>{g}</Text>
                    <View style={[styles.gridDivider, themed.gridDivider]} />
                  </View>
                ))}
              </View>

              {/* データ列 */}
              <View style={styles.columnsMonthly}>
                {monthlyWeeks.map((w, idx) => {
                  const unit = 100 / (monthlyMaxSum || 1);
                  const segs = EMOTIONS.map((e) => ({
                    key: e.key,
                    color: e.color,
                    h: Math.max(0, coerceNum(w?.[e.key]) * unit),
                  })).filter((s) => s.h > 0.01);

                  const k =
                    typeof w?.index === "number" ? `w-${w.index}` : `w-${idx}`;

                  return (
                    <View key={k} style={styles.colWrapMonthly}>
                      <View style={styles.colStackMonthly}>
                        {segs.map((s) => (
                          <View
                            key={s.key}
                            style={[
                              styles.colSeg,
                              { height: s.h, backgroundColor: s.color },
                            ]}
                          />
                        ))}
                      </View>
                      <Text style={[styles.colLabelMonthly, themed.colLabel]}>
                        {w?.label || ""}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        ) : null}

        
        {/* ===== Text (stored snapshot) ===== */}
        {isTextLocked ? (
          <View style={[styles.chartCard, themed.chartCard]}>
            <Text style={[styles.chartTitle, themed.chartTitle]}>
              {tierLoading ? "プラン情報を確認中…" : "本文はPlus会員以上で閲覧できます"}
            </Text>

            {tierLoading ? (
              <View style={{ paddingVertical: 10 }}>
                <ActivityIndicator
                  color={isDark ? colors.TEXT_ON_LIGHT : undefined}
                />
              </View>
            ) : null}

            <Text style={[styles.p, themed.p]}>
              無料会員は週報・月報はグラフのみ表示です。
            </Text>
            <Text style={[styles.p, themed.p]}>
              Plus会員以上で本文の閲覧とPDF出力が利用できます。
            </Text>

            {!tierLoading ? (
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
                  プランを見る
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
        ) : displayText ? (
          displayText.split("\n").map((line, idx) => (
            <Text key={`l-${idx}`} style={[styles.p, themed.p]}>
              {line}
            </Text>
          ))
        ) : (
          <Text style={[styles.empty, themed.empty]}>内容がありません</Text>
        )}


        {/* ✅ 「自己構造トピック候補」パネル（MyWebCrossLinkSection）は不要なので表示しない */}
      </ScrollView>
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
  headerTitle: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  pdfBtn: {
    width: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  pdfText: { marginLeft: 4, fontSize: 12, color: "#111827", fontWeight: "700" },

  range: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 2,
    color: "#6B7280",
    fontSize: 12,
  },

  body: { paddingHorizontal: 14, paddingVertical: 12, paddingBottom: 24 },

  // text
  p: { fontSize: 14, lineHeight: 20, color: "#111827" },
  empty: { padding: 16, color: "#6B7280" },

  // paywall CTA
  paywallBtn: {
    marginTop: 12,
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
    fontWeight: "800",
    color: "#111827",
    marginRight: 2,
  },

  // chart
  chartCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    padding: 12,
    marginBottom: 14,
  },
  chartTitle: { fontWeight: "700", color: "#111827", marginBottom: 8 },

  legendRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 6 },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 6,
  },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { color: "#4B5563", fontSize: 12 },

  chartArea: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 6,
    backgroundColor: "#fff",
  },

  grid: {
    position: "absolute",
    left: 6,
    right: 6,
    top: 6,
    bottom: 6,
    justifyContent: "space-between",
  },
  gridLine: { flexDirection: "row", alignItems: "center" },
  gridLabel: { width: 26, fontSize: 10, color: "#9CA3AF" },
  gridDivider: { flex: 1, height: 1, backgroundColor: "#F3F4F6" },

  chartError: { marginTop: 4, marginBottom: 6, fontSize: 12, color: "#B91C1C" },

  // weekly columns
  columnsWeekly: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingLeft: 26,
    paddingRight: 4,
    minHeight: 140,
  },
  colWrapWeekly: { width: 38, alignItems: "center", marginHorizontal: 2 },
  colStackWeekly: { width: 22, justifyContent: "flex-end", alignItems: "stretch" },
  colLabelWeekly: { marginTop: 4, fontSize: 10, color: "#6B7280" },

  // monthly columns
  columnsMonthly: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingLeft: 26,
    paddingRight: 4,
    minHeight: 160,
  },
  colWrapMonthly: { width: 56, alignItems: "center", marginHorizontal: 4 },
  colStackMonthly: { width: 28, justifyContent: "flex-end", alignItems: "stretch" },
  colLabelMonthly: { marginTop: 6, fontSize: 11, color: "#6B7280" },

  colSeg: {
    width: "100%",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    marginTop: 1,
  },
});
