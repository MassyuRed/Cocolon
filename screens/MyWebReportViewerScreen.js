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
import Svg, { Circle, G } from "react-native-svg";
import CocolonBackButton from "../components/CocolonBackButton";

import { supabase } from "../lib/supabase";
import { apiGet, apiPost, apiFetch } from "../lib/apiClient";

// 🎨 Theme
import { useTheme } from "../theme/ThemeContext";
// Subscription (MyWeb paywall)
// - free: Light表示
// - plus/premium: Standard表示（Deepは将来拡張）
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

function canViewMyWebDeep(tier) {
  return tier === "premium";
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
  { key: "joy", label: "喜び", color: "#10B981" },
  { key: "sadness", label: "悲しみ", color: "#6366F1" },
  { key: "anxiety", label: "不安", color: "#38BDF8" },
  { key: "anger", label: "怒り", color: "#EF4444" },
  { key: "calm", label: "平穏", color: "#EAB308" },
];

const JP_TO_KEY = {
  喜び: "joy",
  悲しみ: "sadness",
  不安: "anxiety",
  怒り: "anger",
  平穏: "calm",
};

const SELF_INSIGHT_LABELS = new Set(["自己理解", "SelfInsight"]);
const TIME_BUCKET_ORDER = ["0-6", "6-12", "12-18", "18-24"];

function normalizeEmotionMap(raw) {
  const src = raw && typeof raw === "object" ? raw : {};
  return {
    joy: coerceNum(src.joy),
    sadness: coerceNum(src.sadness),
    anxiety: coerceNum(src.anxiety),
    anger: coerceNum(src.anger),
    calm: coerceNum(src.calm) + coerceNum(src.peace),
  };
}

function computeDominantKey(weightedCounts) {
  const counts = normalizeEmotionMap(weightedCounts);
  let dominantKey = null;
  let maxVal = 0;
  EMOTIONS.forEach((emotion) => {
    const v = coerceNum(counts[emotion.key]);
    if (v > maxVal) {
      maxVal = v;
      dominantKey = v > 0 ? emotion.key : null;
    }
  });
  return dominantKey;
}

function normalizeTimeBucketRows(raw) {
  if (!Array.isArray(raw)) return [];

  const normalized = TIME_BUCKET_ORDER.map((bucket) => ({
    bucket,
    label: bucket,
    inputCount: 0,
    weightedTotal: 0,
    counts: { joy: 0, sadness: 0, anxiety: 0, anger: 0, calm: 0 },
    weightedCounts: { joy: 0, sadness: 0, anxiety: 0, anger: 0, calm: 0 },
    sharePct: { joy: 0, sadness: 0, anxiety: 0, anger: 0, calm: 0 },
    dominantKey: null,
  }));

  raw.forEach((item) => {
    if (!item || typeof item !== "object") return;
    const bucketKey = String(item.bucket || item.label || item.bucketKey || "").trim();
    const idx = TIME_BUCKET_ORDER.indexOf(bucketKey);
    if (idx === -1) return;

    const counts = normalizeEmotionMap(item.counts);
    const weightedCounts = normalizeEmotionMap(item.weightedCounts || item.weighted_counts);
    const sharePctRaw = normalizeEmotionMap(item.sharePct || item.share_pct);
    const weightedTotalRaw = coerceNum(item.weightedTotal ?? item.weighted_total);
    const weightedTotal =
      weightedTotalRaw > 0
        ? weightedTotalRaw
        : Object.values(weightedCounts).reduce((sum, value) => sum + coerceNum(value), 0);

    let sharePct = sharePctRaw;
    const hasSharePct = Object.values(sharePctRaw).some((value) => coerceNum(value) > 0);
    if (!hasSharePct && weightedTotal > 0) {
      sharePct = EMOTIONS.reduce((acc, emotion) => {
        acc[emotion.key] = Math.round((coerceNum(weightedCounts[emotion.key]) / weightedTotal) * 100);
        return acc;
      }, {});
    }

    const dominantKey =
      mapKey(item.dominantKey || item.dominant_key || item.dominant) ||
      computeDominantKey(weightedCounts);

    normalized[idx] = {
      bucket: bucketKey,
      label: String(item.label || bucketKey),
      inputCount: coerceNum(item.inputCount ?? item.input_count),
      weightedTotal,
      counts,
      weightedCounts,
      sharePct: normalizeEmotionMap(sharePct),
      dominantKey: dominantKey || null,
    };
  });

  return normalized;
}

function extractStandardTimeBuckets(contentJson, standardReport) {
  const candidates = [
    standardReport?.features?.timeBuckets,
    standardReport?.features?.time_buckets,
    standardReport?.timeBuckets,
    standardReport?.time_buckets,
    contentJson?.timeBuckets,
    contentJson?.time_buckets,
    contentJson?.metrics?.timeBuckets,
    contentJson?.metrics?.time_buckets,
  ];

  for (const candidate of candidates) {
    const rows = normalizeTimeBucketRows(candidate);
    if (rows.length > 0) return rows;
  }
  return [];
}


function emotionLabelJa(value) {
  if (!value) return "";
  const mapped = mapKey(value);
  const emotion = EMOTIONS.find((item) => item.key === mapped);
  return emotion?.label || String(value || "");
}

function formatMinutesJa(value) {
  const mins = coerceNum(value);
  if (mins <= 0) return "—";
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remain = mins % 60;
    return remain > 0 ? `${hours}時間${remain}分` : `${hours}時間`;
  }
  return `${mins}分`;
}

function normalizeDeepTransitionEdges(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const fromLabelJa = String(item.fromLabelJa || item.from_label_ja || emotionLabelJa(item.fromLabel || item.from_label) || "");
      const toLabelJa = String(item.toLabelJa || item.to_label_ja || emotionLabelJa(item.toLabel || item.to_label) || "");
      const routeLabel =
        String(item.routeLabel || item.route_label || "").trim() ||
        (fromLabelJa && toLabelJa ? `${fromLabelJa} → ${toLabelJa}` : "");
      return {
        routeLabel,
        count: coerceNum(item.count),
        share: coerceNum(item.share),
        meanMinutes: coerceNum(item.meanMinutes ?? item.mean_minutes),
        dominantTimeBuckets: Array.isArray(item.dominantTimeBuckets || item.dominant_time_buckets)
          ? (item.dominantTimeBuckets || item.dominant_time_buckets)
          : [],
      };
    })
    .filter((item) => item.routeLabel)
    .sort((a, b) => b.count - a.count);
}

function normalizeDeepRecoveryRows(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const fromLabelJa = String(item.fromLabelJa || item.from_label_ja || emotionLabelJa(item.fromLabel || item.from_label) || "");
      const toLabelJa = String(item.toLabelJa || item.to_label_ja || emotionLabelJa(item.toLabel || item.to_label) || "");
      const routeLabel =
        String(item.routeLabel || item.route_label || "").trim() ||
        (fromLabelJa && toLabelJa ? `${fromLabelJa} → ${toLabelJa}` : "");
      return {
        routeLabel,
        count: coerceNum(item.count),
        meanMinutes: coerceNum(item.meanMinutes ?? item.mean_minutes),
        medianMinutes: coerceNum(item.medianMinutes ?? item.median_minutes),
      };
    })
    .filter((item) => item.routeLabel)
    .sort((a, b) => {
      if (a.meanMinutes === b.meanMinutes) return b.count - a.count;
      return a.meanMinutes - b.meanMinutes;
    });
}

function normalizeControlPatterns(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      patternId: String(item.patternId || item.pattern_id || item.label || "pattern"),
      label: String(item.label || "制御傾向"),
      description: String(item.description || "").trim(),
      routes: Array.isArray(item.transitionRouteLabels || item.transition_route_labels)
        ? (item.transitionRouteLabels || item.transition_route_labels)
        : [],
      memoTriggers: Array.isArray(item.memoTriggers || item.memo_triggers)
        ? (item.memoTriggers || item.memo_triggers)
        : [],
    }))
    .slice(0, 5);
}

function extractStructuralReport(contentJson) {
  const structural = contentJson?.deepReport || contentJson?.structural_report;
  return structural && typeof structural === "object" ? structural : null;
}

function getTopEmotionPairs(sharePct, limit = 2) {
  const src = normalizeEmotionMap(sharePct);
  return EMOTIONS.map((emotion) => ({
    key: emotion.key,
    label: emotion.label,
    pct: coerceNum(src[emotion.key]),
  }))
    .filter((item) => item.pct > 0)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, limit);
}

function PieRingChart({ shares, size = 88, strokeWidth = 14, trackColor = "#E5E7EB" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedShares = normalizeEmotionMap(shares);
  const segments = EMOTIONS.map((emotion) => ({
    key: emotion.key,
    color: emotion.color,
    value: Math.max(0, Math.min(100, coerceNum(normalizedShares[emotion.key]))),
  })).filter((segment) => segment.value > 0);

  let offset = 0;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={trackColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
        {segments.map((segment) => {
          const arcLength = (segment.value / 100) * circumference;
          const element = (
            <Circle
              key={segment.key}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={segment.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${arcLength} ${Math.max(circumference - arcLength, 0)}`}
              strokeDashoffset={-offset}
              strokeLinecap={segments.length === 1 ? "round" : "butt"}
            />
          );
          offset += arcLength;
          return element;
        })}
      </G>
    </Svg>
  );
}

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
      if (SELF_INSIGHT_LABELS.has(String(it?.type || "").trim())) continue;
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

function formatRange(periodStart, periodEnd, reportType) {
  try {
    const s = new Date(periodStart);
    const e = new Date(periodEnd);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "";
    const md = (d) => `${d.getMonth() + 1}/${d.getDate()}`;
    if (reportType === "daily") {
      return `${s.getFullYear()}/${s.getMonth() + 1}/${s.getDate()}（1日）`;
    }
    return `${md(s)} ～ ${md(e)}`;
  } catch {
    return "";
  }
}

function isEmotionReportType(reportType) {
  return reportType === "daily" || reportType === "weekly" || reportType === "monthly";
}

function buildStandardUpgradeCardCopy() {
  return {
    badge: null,
    headline: null,
    lead: "今の気持ちを、もっと深く読めます",
    bodyStrong: "加入すると、気持ちの流れや背景が、今よりていねいにわかるレポートになります。",
    note: "今は短めのレポートを表示しています。",
    ctaLabel: "プランを見る",
  };
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
        // ✅ /myweb/reports/ready から viewer_tier を渡せる場合は、それを優先（subscription/me 呼び出しを省略）
        const tierFromReport = report?.viewer_tier;
        if (tierFromReport) {
          if (!cancelled) setSubscriptionTier(normalizeSubscriptionTier(tierFromReport));
          return;
        }

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

        const res = await apiFetch(SUBSCRIPTION_ME_ENDPOINT, {
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
  }, [report?.viewer_tier]);


  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const reportId = report?.id;
        if (!reportId || cancelled) return;

        await apiPost("/report-reads/mark", {
          report_id: String(reportId),
          report_table: "myweb_reports",
          report_scope: "myweb",
        });
      } catch (e) {
        console.warn("MyWebReportViewerScreen: failed to mark report read", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [report?.id]);


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
      paywallLead: { color: colors.TEXT_ON_LIGHT },
      paywallBodyStrong: { color: colors.TEXT_ON_LIGHT },
      paywallNote: { color: colors.TEXT_SUBTLE },
      paywallTrialBadge: {
        backgroundColor: colors.FIELD_BG || colors.PANEL_BG || colors.BG_SILVER,
        borderColor: colors.BORDER_GOLD,
      },
      paywallTrialBadgeText: { color: colors.TITLE_GOLD || colors.TEXT_ON_LIGHT },
      paywallTrialHeadline: { color: colors.TITLE_GOLD || colors.TEXT_ON_LIGHT },
      gridLabel: { color: colors.TEXT_SUBTLE },
      gridDivider: { backgroundColor: colors.CARD_BORDER },
      colLabel: { color: colors.TEXT_SUBTLE },
      errorText: { color: "#FCA5A5" },
      emptyText: { color: colors.TEXT_SUBTLE },
    };
  }, [isDark, colors]);

  const title = report?.title || "Report";
  const reportType = report?.report_type || "";

  const contentText = report?.content_text || "";
  const contentJson = useMemo(
    () => safeParseJson(report?.content_json),
    [report?.content_json]
  );

  const standardReport = useMemo(() => {
    const std = contentJson?.standardReport || contentJson?.standard_report;
    return std && typeof std === "object" ? std : null;
  }, [contentJson]);

  const deepReport = useMemo(() => extractStructuralReport(contentJson), [contentJson]);

  const canViewStandardText = useMemo(
    () => canViewMyWebFullText(subscriptionTier),
    [subscriptionTier]
  );
  const canViewDeepText = useMemo(
    () => canViewMyWebDeep(subscriptionTier),
    [subscriptionTier]
  );

  const standardUpgradeCardCopy = useMemo(() => buildStandardUpgradeCardCopy(), []);

  const showStandardUpgradeCard = useMemo(() => {
    if (tierLoading) return false;
    if (subscriptionTier !== "free") return false;
    return isEmotionReportType(reportType);
  }, [tierLoading, subscriptionTier, reportType]);

  const range = useMemo(() => {
    if (!report?.period_start || !report?.period_end) return "";
    return formatRange(report.period_start, report.period_end, reportType);
  }, [report?.period_start, report?.period_end, reportType]);

  // ===== v3 text resolution (prefer structured content_json over legacy content_text) =====
  const displayText = useMemo(() => {
    const legacy = String(contentText || "");

    let stdText = "";
    let deepText = "";
    try {
      if (standardReport && typeof standardReport === "object") {
        if (typeof standardReport.contentText === "string") stdText = standardReport.contentText;
        else if (typeof standardReport.content_text === "string") stdText = standardReport.content_text;
        else if (typeof standardReport.text === "string") stdText = standardReport.text;
      }
      if (!stdText && typeof contentJson?.standardText === "string") {
        stdText = contentJson.standardText;
      }
      if (!stdText && typeof contentJson?.standard_text === "string") {
        stdText = contentJson.standard_text;
      }

      if (deepReport && typeof deepReport === "object") {
        if (typeof deepReport.contentText === "string") deepText = deepReport.contentText;
        else if (typeof deepReport.content_text === "string") deepText = deepReport.content_text;
        else if (typeof deepReport.text === "string") deepText = deepReport.text;
      }
    } catch {
      stdText = "";
      deepText = "";
    }

    if (canViewDeepText) {
      const parts = [stdText, deepText].filter((part) => typeof part === "string" && part.trim());
      return parts.length > 0 ? parts.join("\n\n") : legacy;
    }
    if (canViewStandardText) return stdText || legacy;
    return legacy;
  }, [canViewDeepText, canViewStandardText, contentJson, contentText, standardReport, deepReport]);

  // ===== Monthly chart data (stored in content_json.metrics.weeks) =====
  const monthlyWeeks = useMemo(() => {
    if (reportType !== "monthly") return [];
    const weeks =
      contentJson?.metrics?.weeks ||
      contentJson?.weeks ||
      standardReport?.features?.weeks;
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
  }, [reportType, contentJson, standardReport]);

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
    const savedDays = contentJson?.days || standardReport?.features?.days;
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

    // ② 旧形式（days 未保存）の場合: API 側で復元（server-owned fallback）
    let cancelled = false;

    (async () => {
      const reportId = report?.id ? String(report.id) : "";
      if (!reportId) {
        setWeeklyDays([]);
        setWeeklyDaysError("レポートIDが不足しています。");
        return;
      }

      setWeeklyDaysLoading(true);
      setWeeklyDaysError("");

      try {
        const json = await apiGet(`/myweb/reports/${encodeURIComponent(reportId)}/weekly-days`);
        const buckets = Array.isArray(json?.days) ? json.days : [];

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
  }, [reportType, contentJson, standardReport, report?.id, report?.period_start, report?.period_end]);

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

  const standardTimeBuckets = useMemo(() => {
    if (reportType !== "weekly" && reportType !== "monthly") return [];
    return extractStandardTimeBuckets(contentJson, standardReport);
  }, [reportType, contentJson, standardReport]);

  const showStandardTimeBuckets = useMemo(() => {
    if (!canViewStandardText) return false;
    if (reportType !== "weekly" && reportType !== "monthly") return false;
    return Array.isArray(standardTimeBuckets) && standardTimeBuckets.length > 0;
  }, [canViewStandardText, reportType, standardTimeBuckets]);


  const deepTransitionEdges = useMemo(() => {
    if (!deepReport) return [];
    return normalizeDeepTransitionEdges(
      deepReport.transitionEdges ||
      deepReport.transition_edges ||
      deepReport.features?.transitionEdges ||
      deepReport.features?.transition_edges
    );
  }, [deepReport]);

  const deepRecoveryRows = useMemo(() => {
    if (!deepReport) return [];
    return normalizeDeepRecoveryRows(
      deepReport.recoveryTime ||
      deepReport.recovery_time ||
      deepReport.features?.recoveryTime ||
      deepReport.features?.recovery_time
    );
  }, [deepReport]);

  const deepControlPatterns = useMemo(() => {
    if (!deepReport) return [];
    return normalizeControlPatterns(
      deepReport.controlPatterns ||
      deepReport.control_patterns ||
      deepReport.features?.controlPatterns ||
      deepReport.features?.control_patterns
    );
  }, [deepReport]);

  const deepTransitionMaxCount = useMemo(() => {
    return Math.max(...deepTransitionEdges.map((item) => coerceNum(item.count)), 1);
  }, [deepTransitionEdges]);

  const deepRecoveryMaxMinutes = useMemo(() => {
    return Math.max(...deepRecoveryRows.map((item) => coerceNum(item.meanMinutes)), 1);
  }, [deepRecoveryRows]);

  const showDeepTransitionChart = useMemo(() => {
    if (!canViewDeepText) return false;
    if (reportType !== "weekly" && reportType !== "monthly") return false;
    return Array.isArray(deepTransitionEdges) && deepTransitionEdges.length > 0;
  }, [canViewDeepText, reportType, deepTransitionEdges]);

  const showDeepRecoveryChart = useMemo(() => {
    if (!canViewDeepText) return false;
    if (reportType !== "weekly" && reportType !== "monthly") return false;
    return Array.isArray(deepRecoveryRows) && deepRecoveryRows.length > 0;
  }, [canViewDeepText, reportType, deepRecoveryRows]);

  const showDeepPatterns = useMemo(() => {
    if (!canViewDeepText) return false;
    return Array.isArray(deepControlPatterns) && deepControlPatterns.length > 0;
  }, [canViewDeepText, deepControlPatterns]);

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
        {/*
          PDF保存ボタンは将来的に復活させる可能性があるため、
          実装は残したまま一時的に非表示にしています。
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
        */}
        <View style={{ width: 70 }} />
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

        {showStandardTimeBuckets ? (
          <View style={[styles.chartCard, themed.chartCard]}>
            <Text style={[styles.chartTitle, themed.chartTitle]}>
              時間帯ごとの感情傾向
            </Text>

            <View style={styles.legendRow}>
              {EMOTIONS.map((e) => (
                <View key={`tb-legend-${e.key}`} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: e.color }]} />
                  <Text style={[styles.legendText, themed.legendText]}>{e.label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.timeBucketGrid}>
              {standardTimeBuckets.map((bucketRow) => {
                const dominantEmotion = EMOTIONS.find((emotion) => emotion.key === bucketRow?.dominantKey);
                const topPairs = getTopEmotionPairs(bucketRow?.sharePct, 2);

                return (
                  <View
                    key={bucketRow?.bucket || bucketRow?.label}
                    style={[
                      styles.timeBucketCard,
                      {
                        backgroundColor: isDark ? colors.FIELD_BG : "#FFFFFF",
                        borderColor: isDark ? colors.CARD_BORDER : "#E5E7EB",
                      },
                    ]}
                  >
                    <View style={styles.timeBucketHeader}>
                      <Text style={[styles.timeBucketTitle, themed.chartTitle]}>
                        {bucketRow?.label || bucketRow?.bucket || "—"}
                      </Text>
                      <Text style={[styles.timeBucketMeta, themed.gridLabel]}>
                        入力 {coerceNum(bucketRow?.inputCount)}件
                      </Text>
                    </View>

                    <View style={styles.timeBucketChartWrap}>
                      <PieRingChart
                        shares={bucketRow?.sharePct}
                        trackColor={isDark ? colors.CARD_BORDER : "#E5E7EB"}
                      />
                      <View style={styles.timeBucketCenter}>
                        <Text style={[styles.timeBucketCenterMain, themed.chartTitle]}>
                          {dominantEmotion?.label || "—"}
                        </Text>
                        <Text style={[styles.timeBucketCenterSub, themed.gridLabel]}>
                          中心感情
                        </Text>
                      </View>
                    </View>

                    <View style={styles.timeBucketSummary}>
                      {topPairs.length > 0 ? (
                        topPairs.map((pair) => (
                          <Text
                            key={`${bucketRow?.bucket || bucketRow?.label}-${pair.key}`}
                            style={[styles.timeBucketSummaryText, themed.legendText]}
                          >
                            {pair.label} {pair.pct}%
                          </Text>
                        ))
                      ) : (
                        <Text style={[styles.timeBucketSummaryText, themed.legendText]}>
                          まだ十分な入力がありません
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}


        {showDeepTransitionChart ? (
          <View style={[styles.chartCard, themed.chartCard]}>
            <Text style={[styles.chartTitle, themed.chartTitle]}>
              よく見られた感情の流れ
            </Text>
            <View style={styles.deepList}>
              {deepTransitionEdges.slice(0, 5).map((edge, idx) => {
                const ratio = Math.max(8, Math.min(100, Math.round((coerceNum(edge.count) / (deepTransitionMaxCount || 1)) * 100)));
                return (
                  <View key={`${edge.routeLabel}-${idx}`} style={styles.deepRow}>
                    <View style={styles.deepRowHeader}>
                      <Text style={[styles.deepRowTitle, themed.chartTitle]}>{edge.routeLabel}</Text>
                      <Text style={[styles.deepRowMeta, themed.gridLabel]}>{coerceNum(edge.count)}回</Text>
                    </View>
                    <View style={[styles.deepBarTrack, { backgroundColor: isDark ? colors.CARD_BORDER : "#E5E7EB" }]}>
                      <View
                        style={[
                          styles.deepBarFill,
                          {
                            width: `${ratio}%`,
                            backgroundColor: isDark ? colors.TEXT_ON_LIGHT : "#111827",
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.deepRowSub, themed.legendText]}>
                      平均 {formatMinutesJa(edge.meanMinutes)}
                      {edge.share > 0 ? ` ・ ${edge.share}%` : ""}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        {showDeepRecoveryChart ? (
          <View style={[styles.chartCard, themed.chartCard]}>
            <Text style={[styles.chartTitle, themed.chartTitle]}>
              切り替わり時間
            </Text>
            <View style={styles.deepList}>
              {deepRecoveryRows.slice(0, 5).map((row, idx) => {
                const ratio = Math.max(8, Math.min(100, Math.round((coerceNum(row.meanMinutes) / (deepRecoveryMaxMinutes || 1)) * 100)));
                return (
                  <View key={`${row.routeLabel}-${idx}`} style={styles.deepRow}>
                    <View style={styles.deepRowHeader}>
                      <Text style={[styles.deepRowTitle, themed.chartTitle]}>{row.routeLabel}</Text>
                      <Text style={[styles.deepRowMeta, themed.gridLabel]}>平均 {formatMinutesJa(row.meanMinutes)}</Text>
                    </View>
                    <View style={[styles.deepBarTrack, { backgroundColor: isDark ? colors.CARD_BORDER : "#E5E7EB" }]}>
                      <View
                        style={[
                          styles.deepBarFill,
                          {
                            width: `${ratio}%`,
                            backgroundColor: isDark ? colors.BORDER_GOLD || colors.TEXT_ON_LIGHT : "#F59E0B",
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.deepRowSub, themed.legendText]}>
                      観測 {coerceNum(row.count)}回
                      {row.medianMinutes > 0 ? ` ・ 中央値 ${formatMinutesJa(row.medianMinutes)}` : ""}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        {showDeepPatterns ? (
          <View style={[styles.chartCard, themed.chartCard]}>
            <Text style={[styles.chartTitle, themed.chartTitle]}>
              観測された制御パターン
            </Text>
            <View style={styles.deepList}>
              {deepControlPatterns.slice(0, 5).map((pattern) => {
                const firstMemo = Array.isArray(pattern.memoTriggers) && pattern.memoTriggers.length > 0
                  ? pattern.memoTriggers[0]
                  : null;
                const firstKeyword = firstMemo && typeof firstMemo === "object" ? String(firstMemo.keyword || "").trim() : "";
                return (
                  <View
                    key={pattern.patternId}
                    style={[
                      styles.patternCard,
                      {
                        backgroundColor: isDark ? colors.FIELD_BG : "#FFFFFF",
                        borderColor: isDark ? colors.CARD_BORDER : "#E5E7EB",
                      },
                    ]}
                  >
                    <Text style={[styles.patternTitle, themed.chartTitle]}>{pattern.label}</Text>
                    {pattern.description ? (
                      <Text style={[styles.patternDesc, themed.legendText]}>{pattern.description}</Text>
                    ) : null}
                    {Array.isArray(pattern.routes) && pattern.routes.length > 0 ? (
                      <Text style={[styles.patternMeta, themed.legendText]}>
                        代表的な流れ: {pattern.routes.slice(0, 2).join(" / ")}
                      </Text>
                    ) : null}
                    {firstKeyword ? (
                      <Text style={[styles.patternMeta, themed.legendText]}>
                        思考トリガー候補: 「{firstKeyword}」
                      </Text>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}
        
        {/* ===== Text (stored snapshot) ===== */}
        {showStandardUpgradeCard ? (
          <View style={[styles.chartCard, themed.chartCard]}>
            {tierLoading ? (
              <View style={{ paddingVertical: 10 }}>
                <ActivityIndicator
                  color={isDark ? colors.TEXT_ON_LIGHT : undefined}
                />
              </View>
            ) : (
              <>
                {standardUpgradeCardCopy.badge ? (
                  <View style={[styles.paywallTrialBadge, themed.paywallTrialBadge]}>
                    <Text style={[styles.paywallTrialBadgeText, themed.paywallTrialBadgeText]}>
                      {standardUpgradeCardCopy.badge}
                    </Text>
                  </View>
                ) : null}

                {standardUpgradeCardCopy.headline ? (
                  <Text style={[styles.paywallTrialHeadline, themed.paywallTrialHeadline]}>
                    {standardUpgradeCardCopy.headline}
                  </Text>
                ) : null}

                <Text style={[styles.paywallLead, themed.paywallLead]}>
                  {standardUpgradeCardCopy.lead}
                </Text>
                <Text style={[styles.paywallBodyStrong, themed.paywallBodyStrong]}>
                  {standardUpgradeCardCopy.bodyStrong}
                </Text>
                {standardUpgradeCardCopy.note ? (
                  <Text style={[styles.paywallNote, themed.paywallNote]}>
                    {standardUpgradeCardCopy.note}
                  </Text>
                ) : null}
              </>
            )}

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
                  {standardUpgradeCardCopy.ctaLabel}
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
        ) : null}


        {/* Plus では Premium への誘導カードは表示しない */}

        {displayText ? (
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
  paywallLead: {
    fontSize: 18,
    lineHeight: 25,
    fontWeight: "900",
    color: "#111827",
  },
  paywallBodyStrong: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
    color: "#111827",
  },
  paywallNote: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: "#4B5563",
  },
  paywallTrialBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#F59E0B",
    backgroundColor: "#FEF3C7",
    marginBottom: 8,
  },
  paywallTrialBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#92400E",
  },
  paywallTrialHeadline: {
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "900",
    color: "#B45309",
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

  timeBucketGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 4,
  },
  timeBucketCard: {
    width: "48.5%",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  timeBucketHeader: {
    marginBottom: 8,
  },
  timeBucketTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },
  timeBucketMeta: {
    marginTop: 2,
    fontSize: 11,
    color: "#6B7280",
  },
  timeBucketChartWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  timeBucketCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  timeBucketCenterMain: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
  },
  timeBucketCenterSub: {
    marginTop: 1,
    fontSize: 10,
    color: "#6B7280",
  },
  timeBucketSummary: {
    marginTop: 8,
    minHeight: 34,
    justifyContent: "center",
  },
  timeBucketSummaryText: {
    fontSize: 11,
    lineHeight: 16,
    color: "#4B5563",
  },

  deepList: {
    marginTop: 4,
  },
  deepRow: {
    marginBottom: 12,
  },
  deepRowHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  deepRowTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginRight: 8,
  },
  deepRowMeta: {
    fontSize: 11,
    color: "#6B7280",
  },
  deepBarTrack: {
    width: "100%",
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
  },
  deepBarFill: {
    height: 8,
    borderRadius: 999,
  },
  deepRowSub: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 16,
    color: "#4B5563",
  },
  patternCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  patternTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  patternDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: "#4B5563",
  },
  patternMeta: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
    color: "#4B5563",
  },
});
