import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NativeModules,
  Linking,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CocolonBackButton from "../components/CocolonBackButton";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { useSubscription } from "../SubscriptionContext";
import {
  canViewWatashiMapDetailReport,
  canViewWatashiMapHistory,
  canViewWatashiMapMode,
  formatWatashiMapReportModeLabel,
  getWatashiMapDetailLockLabel,
  normalizeWatashiMapTier,
} from "../components/selfStructure/watashiMapAccessPolicy";
import WatashiMapRenderer from "../components/selfStructure/WatashiMapRenderer";
import WatashiMapV2Renderer from "../components/selfStructure/WatashiMapV2Renderer";
import CumulativeWatashiMapView from '../components/selfStructure/CumulativeWatashiMapView';

export default function SelfStructureReportViewerScreen(props) {
  if (props.report?.source_profile === 'cumulative.v1') {
    return <CumulativeWatashiMapView reportId={props.report.snapshot_month ? props.report.id : null} month={props.report.snapshot_month} onBack={props.onBack} />;
  }
  return <LegacySelfStructureReportViewerScreen {...props} />;
}
import { classifyWatashiMapVersion, parseWatashiMapContent } from "../components/selfStructure/watashiMapV2Contract";
import {
  hasWatashiMapRenderableContent,
  normalizeWatashiMapPayload,
} from "../components/selfStructure/watashiMapFormatters";

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

function safeParseJson(raw) {
  return parseWatashiMapContent(raw);
}

function normalizeSelfStructureMode(mode) {
  const m = String(mode || "").toLowerCase().trim();
  if (m === "structural") return "deep";
  if (m === "light" || m === "standard" || m === "deep") return m;
  return "standard";
}

function normalizeSubscriptionTier(tier) {
  return normalizeWatashiMapTier(tier);
}

function sanitizeSelfStructureViewerTitle(title, reportMode = "standard") {
  const raw = String(title || "").trim();
  const fallback = `${formatWatashiMapReportModeLabel(reportMode)}のわたしマップ`;
  if (!raw || raw === "Report") return fallback;
  return raw
    .replace(/^自己構造レポート[：:].*$/g, "詳しい自己分析レポート")
    .replace(/自己構造分析レポート[（(]月次[）)]/g, "詳しい自己分析レポート")
    .replace(/自己構造レポート/g, "詳しい自己分析レポート")
    .replace(/自己分析レポート/g, "詳しい自己分析レポート")
    .replace(/現在の自己分析/g, "今のわたしマップ")
    .replace(/現在の自己構造/g, "今のわたしマップ")
    .replace(/自己構造/g, "わたしマップ")
    .replace(/自己分析/g, "わたしマップ");
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

export function LegacySelfStructureReportViewerScreen({
  report,
  onBack,
  initialAnchorKey = null,
  onOpenSubscription,
}) {
  const { themeName, colors } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";

  const { tier, loading: subscriptionLoading } = useSubscription();
  const viewerTier = normalizeSubscriptionTier(tier);

  const themed = {};

  const title = sanitizeSelfStructureViewerTitle(report?.title, report?.report_mode);
  const range = useMemo(() => {
    if (!report?.period_start || !report?.period_end) return "";
    return formatRange(report.period_start, report.period_end);
  }, [report?.period_start, report?.period_end]);

  const contentJson = useMemo(() => safeParseJson(report?.content_json), [report?.content_json]);
  const mapVersion = useMemo(() => classifyWatashiMapVersion(contentJson), [contentJson]);
  const isLegacyMap = mapVersion === 'LEGACY';
  const contentText = isLegacyMap ? report?.content_text || "" : '';
  const fetchedReportMode = useMemo(() => {
    return normalizeSelfStructureMode(contentJson?.report_mode || report?.report_mode);
  }, [contentJson?.report_mode, report?.report_mode]);
  const canViewVersionedMap = viewerTier !== 'free' && canViewWatashiMapHistory(viewerTier)
    && canViewWatashiMapMode(viewerTier, contentJson?.report_mode || report?.report_mode || 'standard');
  const canViewFullText = useMemo(() => {
    return !subscriptionLoading && canViewWatashiMapDetailReport(viewerTier, fetchedReportMode);
  }, [fetchedReportMode, subscriptionLoading, viewerTier]);
  const hasWatashiMapVisual = useMemo(() => {
    return isLegacyMap && hasWatashiMapRenderableContent(contentJson);
  }, [contentJson, isLegacyMap]);
  const watashiMapPayload = useMemo(() => {
    if (!hasWatashiMapVisual) return null;
    return normalizeWatashiMapPayload(contentJson, {
      contentText,
      reportMode: fetchedReportMode,
      viewerTier,
    });
  }, [contentJson, contentText, fetchedReportMode, hasWatashiMapVisual, viewerTier]);
  const detailReportVisible = useMemo(() => {
    if (!hasWatashiMapVisual) return true;
    return !!(watashiMapPayload?.detail_report?.visible || watashiMapPayload?.visibility?.detail_report_visible);
  }, [hasWatashiMapVisual, watashiMapPayload]);

  // Analysis → Self Structure の動的リンクなどで「該当ブロックへスクロール」したい場合に使用
  const scrollRef = useRef(null);
  const [anchorY, setAnchorY] = useState(null);

  const lines = useMemo(() => {
    return String(contentText || "").split("\n");
  }, [contentText]);

  const targetIndex = useMemo(() => {
    const key = String(initialAnchorKey || "");
    if (!key) return null;

    const patternsByKey = {
      outline: [/輪郭/, /自己/],
      pattern: [/反応/, /刺激/, /パターン/, /刺激→/],
      conditions: [/安定条件/, /崩れ条件/, /安心/, /維持/, /回復/],
      change: [/差分/, /変化/, /前回/, /更新/],
      next: [/観測ポイント/, /来月/, /次/],
    };

    const pats = patternsByKey[key] || patternsByKey.pattern;
    for (let i = 0; i < lines.length; i += 1) {
      const s = String(lines[i] || "");
      if (pats.some((re) => re.test(s))) return i;
    }

    // fallback: 見出し番号で当てる（テンプレに近い想定）
    if (key === "outline") {
      const idx = lines.findIndex((l) => /^\s*1\s*[\.\)\:：]/.test(String(l || "")));
      return idx >= 0 ? idx : null;
    }
    if (key === "pattern") {
      const idx = lines.findIndex((l) => /^\s*2\s*[\.\)\:：]/.test(String(l || "")));
      return idx >= 0 ? idx : null;
    }
    if (key === "conditions") {
      const idx = lines.findIndex((l) => /^\s*3\s*[\.\)\:：]/.test(String(l || "")));
      return idx >= 0 ? idx : null;
    }
    if (key === "next") {
      const idx = lines.findIndex((l) => /^\s*6\s*[\.\)\:：]/.test(String(l || "")));
      return idx >= 0 ? idx : null;
    }
    if (key === "change") {
      const idx = lines.findIndex((l) => /^\s*7\s*[\.\)\:：]/.test(String(l || "")));
      return idx >= 0 ? idx : null;
    }
    return null;
  }, [initialAnchorKey, lines]);

  useEffect(() => {
    if (anchorY == null) return;
    try {
      scrollRef.current?.scrollTo({ y: Math.max(Number(anchorY) - 12, 0), animated: true });
    } catch {
      // ignore
    }
  }, [anchorY]);

  return (
    <SafeAreaView edges={["left", "right"]} style={[styles.container, themed.container]}>
      {/* Header */}
      <View style={[styles.header, themed.header]}>
        <CocolonBackButton onPress={onBack} style={[styles.backBtn, { width: 44 }]} accessibilityLabel="わたしマップの履歴に戻る" />

        <Text style={[styles.headerTitle, themed.headerTitle]}>
          {title}
        </Text>
        {/* PDF保存ボタンは非表示 */}
        <View style={{ width: 44 }} />
      </View>

      {!!range ? <Text style={[styles.range, themed.range]}>{range}</Text> : null}

      <ScrollView ref={scrollRef} contentContainerStyle={styles.body}>
        {subscriptionLoading ? (
          <Text style={[styles.empty, themed.empty]}>プラン情報を確認しています…</Text>
        ) : (
          <>
            {!isLegacyMap && canViewVersionedMap ? (
              <WatashiMapV2Renderer contentJson={contentJson} colors={colors} isDark={isDark} />
            ) : null}

            {!isLegacyMap && !canViewVersionedMap ? (
              <Text style={[styles.empty, themed.empty]}>{viewerTier === 'free'
                ? '過去のわたしマップはPlusプラン以上で読めます。'
                : getWatashiMapDetailLockLabel(viewerTier, fetchedReportMode)}</Text>
            ) : null}
            {hasWatashiMapVisual ? (
              <WatashiMapRenderer
                contentJson={contentJson}
                contentText={contentText}
                colors={colors}
                isDark={isDark}
                reportMode={fetchedReportMode}
                viewerTier={viewerTier}
                onUpgradePress={onOpenSubscription}
              />
            ) : null}

            {isLegacyMap && !canViewFullText && !hasWatashiMapVisual ? (
              <Text style={[styles.empty, themed.empty]}>
                {getWatashiMapDetailLockLabel(viewerTier, fetchedReportMode)}
              </Text>
            ) : null}

            {isLegacyMap && ((contentText && canViewFullText && (!hasWatashiMapVisual || detailReportVisible)) || (!hasWatashiMapVisual && canViewFullText && !contentText)) ? (
              <View style={[styles.bodyCard, themed.bodyCard]}>
                {hasWatashiMapVisual && contentText ? (
                  <Text style={[styles.sectionLabel, themed.sectionLabel]}>詳しい自己分析レポート</Text>
                ) : null}
                {contentText ? (
                  lines.map((line, idx) => {
                    const isTarget = targetIndex != null && idx === targetIndex;

                    if (isTarget) {
                      return (
                        <View
                          key={`l-${idx}`}
                          onLayout={(e) => {
                            const y = e?.nativeEvent?.layout?.y;
                            if (typeof y === "number") setAnchorY(y);
                          }}
                        >
                          <Text style={[styles.p, themed.p, styles.anchorLine, themed.anchorLine]}>
                            {line}
                          </Text>
                        </View>
                      );
                    }

                    return (
                      <Text key={`l-${idx}`} style={[styles.p, themed.p]}>
                        {line}
                      </Text>
                    );
                  })
                ) : (
                  <Text style={[styles.empty, themed.empty]}>まだ地図にできる観測が少なめです</Text>
                )}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(COLORS, ui) {
  const text = ui?.text || {};
  return StyleSheet.create(applyTypographyTokens({
  container: {
      flex: 1,
      backgroundColor: COLORS.BG_SILVER,
    },
  header: {
      paddingTop: 12,
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 0,
      borderBottomColor: COLORS.CARD_BORDER,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  backBtn: {
      flexDirection: "row",
      alignItems: "center",
      width: 70,
      minHeight: 44,
      justifyContent: 'center',
    },
  backText: {
      marginLeft: 2,
      color: COLORS.TEXT_ON_LIGHT,
    },
  headerTitle: {
      flex: 1,
      marginHorizontal: 8,
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      textAlign: "center",
    },

  pdfBtn: {
      width: 70,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      minHeight: 44,
    },
  pdfText: {
      marginLeft: 4,
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    },

  range: {
      paddingHorizontal: 20,
      paddingTop: 0,
      paddingBottom: 12,
      color: COLORS.TEXT_SUBTLE,
      width: '100%',
      maxWidth: 680,
      alignSelf: 'center',
    },

  body: {
      paddingHorizontal: 20,
      paddingVertical: 0,
      paddingBottom: 24,
      width: '100%',
      maxWidth: 680,
      alignSelf: 'center',
    },
  bodyCard: {
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      borderRadius: 24,
      backgroundColor: COLORS.FIELD_BG,
      padding: 20,
    },
  sectionLabel: {
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginBottom: 12,
    },
  p: {
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 8,
    },
  anchorLine: {
      fontWeight: '600',
      backgroundColor: COLORS.SURFACE_TONAL,
      color: COLORS.ON_SURFACE_TONAL,
    },
  empty: {
      padding: 16,
      color: COLORS.TEXT_SUBTLE,
    },
  }, ui, {"backText":"button","headerTitle":"screenTitle","pdfText":"button","range":"meta","sectionLabel":"sectionTitle","p":"body","empty":"description"}));
}
