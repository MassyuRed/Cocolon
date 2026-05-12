import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CocolonBackButton from "../components/CocolonBackButton";

import { apiGet, apiPost } from "../lib/apiClient";
import { ANALYSIS_WIRE, buildAnalysisReportWeeklyDaysPath } from "../lib/compat/legacyWireContracts";

// 🎨 Theme
import { useTheme } from "../theme/ThemeContext";
import { useSubscription } from "../SubscriptionContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import {
  buildStandardUpgradeCardCopy,
  canViewAnalysisDeep,
  canViewAnalysisFullText,
  isEmotionReportType,
  normalizeSubscriptionTier,
} from "./analysisReport/analysisReportAccessPolicy";
import {
  EMOTIONS,
  coerceNum,
  formatMinutesJa,
  formatRange,
  safeParseJson,
} from "./analysisReport/analysisReportFormatters";
import {
  buildDaysFromRows,
  extractStandardTimeBuckets,
  extractStructuralReport,
  getTopEmotionPairs,
  normalizeControlPatterns,
  normalizeDeepRecoveryRows,
  normalizeDeepTransitionEdges,
  normalizeMemoThemes,
  normalizeMonthlyPhaseItems,
  normalizeMonthlyShiftItems,
  normalizePatternEpisodes,
} from "./analysisReport/analysisReportNormalize";
import { exportTextToPdf } from "./analysisReport/analysisReportHtmlExport";
import { PieRingChart } from "./analysisReport/AnalysisReportCharts";
import AnalysisReportUpgradeCard from "./analysisReport/AnalysisReportUpgradeCard";
import KokoroWeatherForecastStrip from "./analysisReport/KokoroWeatherForecastStrip";
import KokoroWeatherDetailModal from "./analysisReport/KokoroWeatherDetailModal";

/**
 * AnalysisReportViewerScreen
 * ------------------------------------------------------------
 * 履歴レポートの詳細表示。
 * 以前は content_text のみ表示していたが、
 * ・月報: content_json.metrics.weeks
 * ・週報: content_json.days（なければ期間内の emotions から再計算）
 * を使って、生成画面と同様のグラフを表示できるようにする。
 */

export default function AnalysisReportViewerScreen({
  report,
  onBack,
  onOpenPieceDeepDive, // 互換のため残す（今は未使用）
  onOpenSubscription, // ✅ Analysis paywall CTA（SubscriptionSelectへ）
  embedded = false,
  hideHeader = false,
  disableActions = false,
  onMarkedRead,
}) {
  // 🎨 theme
  const { themeName, colors } = useTheme();
  const { tier: ctxSubscriptionTier, loading: subscriptionContextLoading } = useSubscription();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";
  const screenBg = isDark ? colors.BG_SILVER : "#FFFFFF";
  // Subscription tier (fail-closed: unknown => free)
  const [subscriptionTier, setSubscriptionTier] = useState("free");
  const [tierLoading, setTierLoading] = useState(true);
  const [selectedKokoroWeatherItem, setSelectedKokoroWeatherItem] = useState(null);

  useEffect(() => {
    const tierFromReport = report?.viewer_tier;
    if (tierFromReport) {
      setSubscriptionTier(normalizeSubscriptionTier(tierFromReport));
      setTierLoading(false);
      return;
    }
    if (subscriptionContextLoading) {
      setTierLoading(true);
      return;
    }
    setSubscriptionTier(normalizeSubscriptionTier(ctxSubscriptionTier));
    setTierLoading(false);
  }, [ctxSubscriptionTier, report?.viewer_tier, subscriptionContextLoading]);


  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const reportId = report?.id;
        if (!reportId || cancelled) return;

        await apiPost("/report-reads/mark", {
          report_id: String(reportId),
          report_table: ANALYSIS_WIRE.reportFamily.table,
          report_scope: ANALYSIS_WIRE.reportFamily.scope,
        });
        try {
          await onMarkedRead?.(String(reportId));
        } catch (callbackError) {
          console.warn("AnalysisReportViewerScreen: onMarkedRead callback failed", callbackError);
        }
      } catch (e) {
        console.warn("AnalysisReportViewerScreen: failed to mark report read", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [onMarkedRead, report?.id]);


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
      range: { color: ui?.text?.description ?? colors.TEXT_SUBTLE },

      // ScrollView の余白部分まで黒くする（内容が短いと白が見えるのを防止）
      body: { backgroundColor: colors.BG_SILVER, flexGrow: 1 },

      p: { color: colors.TEXT_ON_LIGHT },
      empty: { color: ui?.text?.description ?? colors.TEXT_SUBTLE },

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
      paywallNote: { color: ui?.text?.description ?? colors.TEXT_SUBTLE },
      paywallTrialBadge: {
        backgroundColor: colors.FIELD_BG || colors.PANEL_BG || colors.BG_SILVER,
        borderColor: colors.BORDER_GOLD,
      },
      paywallTrialBadgeText: { color: colors.TITLE_GOLD || colors.TEXT_ON_LIGHT },
      paywallTrialHeadline: { color: colors.TITLE_GOLD || colors.TEXT_ON_LIGHT },
      gridLabel: { color: ui?.text?.description ?? colors.TEXT_SUBTLE },
      gridDivider: { backgroundColor: colors.CARD_BORDER },
      colLabel: { color: ui?.text?.description ?? colors.TEXT_SUBTLE },
      errorText: { color: "#FCA5A5" },
      emptyText: { color: ui?.text?.description ?? colors.TEXT_SUBTLE },
    };
  }, [isDark, colors, ui]);

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

  const kokoroWeatherPayload = useMemo(() => {
    const direct = contentJson?.kokoroWeather || contentJson?.kokoro_weather;
    if (direct && typeof direct === "object") return direct;
    const standard = standardReport?.kokoroWeather || standardReport?.kokoro_weather;
    return standard && typeof standard === "object" ? standard : null;
  }, [contentJson, standardReport]);

  useEffect(() => {
    setSelectedKokoroWeatherItem(null);
  }, [report?.id, reportType]);

  const openKokoroWeatherDetail = useCallback((item) => {
    if (!item || disableActions) return;
    setSelectedKokoroWeatherItem(item);
  }, [disableActions]);

  const closeKokoroWeatherDetail = useCallback(() => {
    setSelectedKokoroWeatherItem(null);
  }, []);

  const canViewStandardText = useMemo(
    () => canViewAnalysisFullText(subscriptionTier),
    [subscriptionTier]
  );
  const canViewDeepText = useMemo(
    () => canViewAnalysisDeep(subscriptionTier),
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
        const json = await apiGet(buildAnalysisReportWeeklyDaysPath(reportId));
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


const deepScopeVersion = useMemo(() => {
  return String(
    deepReport?.scopeVersion || deepReport?.scope_version || ""
  ).trim();
}, [deepReport]);

const deepMemoThemes = useMemo(() => {
  if (!deepReport) return [];
  return normalizeMemoThemes(
    deepReport.memoThemes ||
    deepReport.memo_themes ||
    deepReport.features?.memoThemes ||
    deepReport.features?.memo_themes ||
    deepReport.summary?.themeItems
  );
}, [deepReport]);

const deepPatternEpisodes = useMemo(() => {
  if (!deepReport) return [];
  return normalizePatternEpisodes(
    deepReport.patternEpisodes ||
    deepReport.pattern_episodes ||
    deepReport.features?.patternEpisodes ||
    deepReport.features?.pattern_episodes ||
    deepReport.summary?.patternItems
  );
}, [deepReport]);

const isMonthlyDeepV2 = useMemo(() => {
  return reportType === "monthly" && deepScopeVersion === ANALYSIS_WIRE.deepScopeVersion.monthly;
}, [reportType, deepScopeVersion]);

const isWeeklyDeepV2Like = useMemo(() => {
  if (reportType !== "weekly") return false;
  if (deepScopeVersion === ANALYSIS_WIRE.deepScopeVersion.weekly) return true;
  return deepMemoThemes.length > 0 || deepPatternEpisodes.length > 0;
}, [reportType, deepScopeVersion, deepMemoThemes, deepPatternEpisodes]);

const deepMonthlyPhaseItems = useMemo(() => {
  if (!deepReport) return [];
  return normalizeMonthlyPhaseItems(
    deepReport.summary?.phaseItems ||
      deepReport.summary?.phase_items ||
      deepReport.monthlyPhases ||
      deepReport.monthly_phases ||
      deepReport.features?.monthlyPhases ||
      deepReport.features?.monthly_phases
  );
}, [deepReport]);

const deepMonthlyShiftItems = useMemo(() => {
  if (!deepReport) return [];
  return normalizeMonthlyShiftItems(
    deepReport.summary?.shiftItems ||
      deepReport.summary?.shift_items ||
      deepReport.monthlyShifts ||
      deepReport.monthly_shifts ||
      deepReport.features?.monthlyShifts ||
      deepReport.features?.monthly_shifts
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

const showDeepMemoThemes = useMemo(() => {
  if (!canViewDeepText) return false;
  if (!(isWeeklyDeepV2Like || isMonthlyDeepV2)) return false;
  return Array.isArray(deepMemoThemes) && deepMemoThemes.length > 0;
}, [canViewDeepText, isWeeklyDeepV2Like, isMonthlyDeepV2, deepMemoThemes]);

const isDeepPatternEpisodeMode = useMemo(() => {
  if (!canViewDeepText) return false;
  if (!(isWeeklyDeepV2Like || isMonthlyDeepV2)) return false;
  return Array.isArray(deepPatternEpisodes) && deepPatternEpisodes.length > 0;
}, [canViewDeepText, isWeeklyDeepV2Like, isMonthlyDeepV2, deepPatternEpisodes]);

const showDeepPatternEpisodes = isDeepPatternEpisodeMode;

const visibleDeepPatterns = useMemo(() => {
  if (isDeepPatternEpisodeMode) return deepPatternEpisodes;
  return deepControlPatterns;
}, [isDeepPatternEpisodeMode, deepPatternEpisodes, deepControlPatterns]);

const showDeepPatterns = useMemo(() => {
  if (!canViewDeepText) return false;
  return Array.isArray(visibleDeepPatterns) && visibleDeepPatterns.length > 0;
}, [canViewDeepText, visibleDeepPatterns]);

const showDeepMonthlyPhases = useMemo(() => {
  if (!canViewDeepText) return false;
  if (!isMonthlyDeepV2) return false;
  return Array.isArray(deepMonthlyPhaseItems) && deepMonthlyPhaseItems.length > 0;
}, [canViewDeepText, isMonthlyDeepV2, deepMonthlyPhaseItems]);

const showDeepMonthlyShift = useMemo(() => {
  if (!canViewDeepText) return false;
  if (!isMonthlyDeepV2) return false;
  return Array.isArray(deepMonthlyShiftItems) && deepMonthlyShiftItems.length > 0;
}, [canViewDeepText, isMonthlyDeepV2, deepMonthlyShiftItems]);

const showDeepMonthlyPhaseSection = useMemo(() => {
  if (!canViewDeepText) return false;
  if (!isMonthlyDeepV2) return false;
  return showDeepMonthlyPhases || showDeepMonthlyShift;
}, [
  canViewDeepText,
  isMonthlyDeepV2,
  showDeepMonthlyPhases,
  showDeepMonthlyShift,
]);

const deepMonthlySectionTitle = useMemo(() => {
  if (deepMonthlyPhaseItems.length >= 2 || deepMonthlyShiftItems.length > 0) {
    return "前半と後半で変わっていたこと";
  }
  return "今月の中で見えていた流れ";
}, [deepMonthlyPhaseItems, deepMonthlyShiftItems]);

const deepTransitionSectionTitle = useMemo(() => {
  if (isWeeklyDeepV2Like && deepMemoThemes.length > 0) {
    return "言葉と気持ちがつながった流れ";
  }
  if (isMonthlyDeepV2) {
    return "言葉と気持ちがつながった流れ";
  }
  return "よく見られた感情の流れ";
}, [isWeeklyDeepV2Like, isMonthlyDeepV2, deepMemoThemes]);

const deepPatternSectionTitle = useMemo(() => {
  if (isWeeklyDeepV2Like && isDeepPatternEpisodeMode) {
    return "今週、くり返しやすかったパターン";
  }
  if (isMonthlyDeepV2 && isDeepPatternEpisodeMode) {
    return "今月、くり返しやすかったパターン";
  }
  return "観測された制御パターン";
}, [isWeeklyDeepV2Like, isMonthlyDeepV2, isDeepPatternEpisodeMode]);

  const bodyContent = (
    <>
        <KokoroWeatherForecastStrip
          kokoroWeather={kokoroWeatherPayload}
          reportType={reportType}
          disableActions={disableActions}
          onSelectItem={openKokoroWeatherDetail}
        />

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
                        { fontSize: ui?.font?.sectionLabel ?? 14, color: ui?.text?.description ?? colors.TEXT_SUBTLE },
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


        {showDeepMemoThemes ? (
          <View style={[styles.chartCard, themed.chartCard]}>
            <Text style={[styles.chartTitle, themed.chartTitle]}>
              あなたの言葉から見えていたテーマ
            </Text>

            <View style={styles.deepList}>
              {deepMemoThemes.slice(0, 2).map((theme) => (
                <View
                  key={theme.themeId}
                  style={[
                    styles.memoThemeCard,
                    {
                      backgroundColor: isDark ? colors.FIELD_BG : "#FFFFFF",
                      borderColor: isDark ? colors.CARD_BORDER : "#E5E7EB",
                    },
                  ]}
                >
                  <Text style={[styles.memoThemeTitle, themed.chartTitle]}>{theme.themeLabel}</Text>

                  <View style={styles.memoThemeChipRow}>
                    {theme.phraseSamples.slice(0, 2).map((phrase) => (
                      <View key={`${theme.themeId}-${phrase}`} style={styles.memoThemeChip}>
                        <Text style={styles.memoThemeChipText}>「{phrase}」</Text>
                      </View>
                    ))}
                  </View>

                  {theme.meaningComment ? (
                    <Text style={[styles.memoThemeMeaning, themed.legendText]}>{theme.meaningComment}</Text>
                  ) : null}

                  {Array.isArray(theme.linkedRouteLabels) && theme.linkedRouteLabels.length > 0 ? (
                    <Text style={[styles.memoThemeMeta, themed.legendText]}>
                      つながりやすかった流れ: {theme.linkedRouteLabels.slice(0, 2).join(" / ")}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {showDeepTransitionChart ? (
          <View style={[styles.chartCard, themed.chartCard]}>
            <Text style={[styles.chartTitle, themed.chartTitle]}>
              {deepTransitionSectionTitle}
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
              {deepPatternSectionTitle}
            </Text>
            <View style={styles.deepList}>
              {visibleDeepPatterns.slice(0, 5).map((pattern) => {
                if (isDeepPatternEpisodeMode) {
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
                      <Text style={[styles.patternTitle, themed.chartTitle]}>
                        {pattern.patternLabel || (reportType === "monthly" ? "今月、くり返しやすかった流れ" : "今週、くり返しやすかった流れ")}
                      </Text>
                      {pattern.patternComment ? (
                        <Text style={[styles.patternDesc, themed.legendText]}>{pattern.patternComment}</Text>
                      ) : null}
                      {Array.isArray(pattern.routeLabels) && pattern.routeLabels.length > 0 ? (
                        <Text style={[styles.patternMeta, themed.legendText]}>
                          代表的な流れ: {pattern.routeLabels.slice(0, 2).join(" / ")}
                        </Text>
                      ) : null}
                      {pattern.recoveryRouteLabel ? (
                        <Text style={[styles.patternMeta, themed.legendText]}>
                          戻りやすかった流れ: {pattern.recoveryRouteLabel}
                        </Text>
                      ) : null}
                    </View>
                  );
                }

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
        

{showDeepMonthlyPhaseSection ? (
  <View style={[styles.chartCard, themed.chartCard]}>
    <Text style={[styles.chartTitle, themed.chartTitle]}>
      {deepMonthlySectionTitle}
    </Text>

    <View style={styles.deepList}>
      {showDeepMonthlyPhases
        ? deepMonthlyPhaseItems.slice(0, 2).map((phase) => (
            <View
              key={phase.phaseId}
              style={[
                styles.patternCard,
                {
                  backgroundColor: isDark ? colors.FIELD_BG : "#FFFFFF",
                  borderColor: isDark ? colors.CARD_BORDER : "#E5E7EB",
                },
              ]}
            >
              <Text style={[styles.patternTitle, themed.chartTitle]}>
                {phase.phaseFocusLabel
                  ? `${phase.phaseLabel}: ${phase.phaseFocusLabel}`
                  : phase.phaseLabel}
              </Text>

              {phase.phaseComment ? (
                <Text style={[styles.patternDesc, themed.legendText]}>
                  {phase.phaseComment}
                </Text>
              ) : null}

              {phase.phraseSamples.length > 0 ? (
                <View style={styles.memoThemeChipRow}>
                  {phase.phraseSamples.slice(0, 2).map((phrase) => (
                    <View key={`${phase.phaseId}-${phrase}`} style={styles.memoThemeChip}>
                      <Text style={styles.memoThemeChipText}>「{phrase}」</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              {phase.themeLabels.length > 0 ? (
                <Text style={[styles.patternMeta, themed.legendText]}>
                  見えやすかったテーマ: {phase.themeLabels.slice(0, 2).join(" / ")}
                </Text>
              ) : null}

              {phase.routeLabels.length > 0 ? (
                <Text style={[styles.patternMeta, themed.legendText]}>
                  動きやすかった流れ: {phase.routeLabels.slice(0, 2).join(" / ")}
                </Text>
              ) : null}

              {phase.recoveryRouteLabel ? (
                <Text style={[styles.patternMeta, themed.legendText]}>
                  戻りやすかった流れ: {phase.recoveryRouteLabel}
                </Text>
              ) : null}
            </View>
          ))
        : null}

      {showDeepMonthlyShift ? (
        <View
          style={[
            styles.patternCard,
            {
              backgroundColor: isDark ? colors.FIELD_BG : "#FFFFFF",
              borderColor: isDark ? colors.CARD_BORDER : "#E5E7EB",
            },
          ]}
        >
          <Text style={[styles.patternTitle, themed.chartTitle]}>
            {deepMonthlyShiftItems[0]?.shiftLabel || "月の中で流れが変化"}
          </Text>

          {deepMonthlyShiftItems[0]?.shiftComment ? (
            <Text style={[styles.patternDesc, themed.legendText]}>
              {deepMonthlyShiftItems[0].shiftComment}
            </Text>
          ) : null}

          {deepMonthlyShiftItems[0]?.settlingRouteLabels?.length > 0 ? (
            <Text style={[styles.patternMeta, themed.legendText]}>
              前半で目立っていた流れ: {deepMonthlyShiftItems[0].settlingRouteLabels.join(" / ")}
            </Text>
          ) : null}

          {deepMonthlyShiftItems[0]?.emergingRouteLabels?.length > 0 ? (
            <Text style={[styles.patternMeta, themed.legendText]}>
              後半で増えた流れ: {deepMonthlyShiftItems[0].emergingRouteLabels.join(" / ")}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  </View>
) : null}

        <AnalysisReportUpgradeCard
          visible={showStandardUpgradeCard}
          tierLoading={tierLoading}
          copy={standardUpgradeCardCopy}
          styles={styles}
          themed={themed}
          isDark={isDark}
          colors={colors}
          ui={ui}
          disableActions={disableActions}
          onOpenSubscription={onOpenSubscription}
        />

        {/* ===== Text (stored snapshot) ===== */}
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


        {/* ✅ 「自己構造トピック候補」パネル（AnalysisCrossLinkSection）は不要なので表示しない */}

    </>
  );

  if (embedded) {
    return (
      <View style={{ backgroundColor: screenBg }}>
        <View style={styles.embeddedHeader}>
          <Text style={[styles.embeddedTitle, themed.headerTitle]}>{title}</Text>
          {!!range ? <Text style={[styles.range, themed.range]}>{range}</Text> : null}
        </View>
        <View style={[styles.body, themed.body]}>{bodyContent}</View>
        <KokoroWeatherDetailModal
          visible={!!selectedKokoroWeatherItem}
          item={selectedKokoroWeatherItem}
          reportType={reportType}
          onClose={closeKokoroWeatherDetail}
        />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, themed.container, { backgroundColor: screenBg }]}
    >
      {/* Header */}
      {!hideHeader ? (
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
                color={ui?.text?.primary ?? colors.TEXT_ON_LIGHT}
              />
              <Text style={[styles.pdfText, themed.pdfText]}>PDF</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 70 }} />
          )}
          */}
          <View style={{ width: 70 }} />
        </View>
      ) : null}

      {!!range ? <Text style={[styles.range, themed.range]}>{range}</Text> : null}

      <ScrollView
        style={{ backgroundColor: screenBg }}
        contentContainerStyle={[styles.body, themed.body]}
      >
        {bodyContent}
      </ScrollView>
      <KokoroWeatherDetailModal
        visible={!!selectedKokoroWeatherItem}
        item={selectedKokoroWeatherItem}
        reportType={reportType}
        onClose={closeKokoroWeatherDetail}
      />
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
  backBtn: { flexDirection: "row", alignItems: "center", width: 70 },
  backText: { marginLeft: 2, color: text.description ?? COLORS.TEXT_SUBTLE, fontSize: 13, fontWeight: "600" },
  headerTitle: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 13,
    fontWeight: "800",
    color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    textAlign: "center",
  },
  embeddedHeader: {
    paddingHorizontal: 2,
    paddingTop: 4,
    paddingBottom: 6,
  },
  embeddedTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: text.primary ?? COLORS.TEXT_ON_LIGHT,
  },

  pdfBtn: {
    width: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  pdfText: { marginLeft: 4, fontSize: 12, color: text.primary ?? COLORS.TEXT_ON_LIGHT, fontWeight: "700" },

  range: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 2,
    color: text.description ?? COLORS.TEXT_SUBTLE,
    fontSize: 12,
  },

  body: { paddingHorizontal: 14, paddingVertical: 12, paddingBottom: 24 },

  // text
  p: { fontSize: 14, lineHeight: 20, color: text.primary ?? COLORS.TEXT_ON_LIGHT },
  empty: { padding: 16, color: text.description ?? COLORS.TEXT_SUBTLE },

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
    color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    marginRight: 2,
  },
  paywallLead: {
    fontSize: 18,
    lineHeight: 25,
    fontWeight: "900",
    color: text.primary ?? COLORS.TEXT_ON_LIGHT,
  },
  paywallBodyStrong: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
    color: text.primary ?? COLORS.TEXT_ON_LIGHT,
  },
  paywallNote: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: text.description ?? COLORS.TEXT_SUBTLE,
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
  chartTitle: { fontWeight: "700", color: text.primary ?? COLORS.TEXT_ON_LIGHT, marginBottom: 8 },

  legendRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 6 },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 6,
  },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { color: text.description ?? COLORS.TEXT_SUBTLE, fontSize: 12 },

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
  gridLabel: { width: 26, fontSize: 10, color: text.subtle ?? COLORS.TEXT_SUBTLE },
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
  colLabelWeekly: { marginTop: 4, fontSize: 10, color: text.description ?? COLORS.TEXT_SUBTLE },

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
  colLabelMonthly: { marginTop: 6, fontSize: 11, color: text.description ?? COLORS.TEXT_SUBTLE },

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
    color: text.primary ?? COLORS.TEXT_ON_LIGHT,
  },
  timeBucketMeta: {
    marginTop: 2,
    fontSize: 11,
    color: text.description ?? COLORS.TEXT_SUBTLE,
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
    color: text.primary ?? COLORS.TEXT_ON_LIGHT,
  },
  timeBucketCenterSub: {
    marginTop: 1,
    fontSize: 10,
    color: text.description ?? COLORS.TEXT_SUBTLE,
  },
  timeBucketSummary: {
    marginTop: 8,
    minHeight: 34,
    justifyContent: "center",
  },
  timeBucketSummaryText: {
    fontSize: 11,
    lineHeight: 16,
    color: text.description ?? COLORS.TEXT_SUBTLE,
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
    color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    marginRight: 8,
  },
  deepRowMeta: {
    fontSize: 11,
    color: text.description ?? COLORS.TEXT_SUBTLE,
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
    color: text.description ?? COLORS.TEXT_SUBTLE,
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
    color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    marginBottom: 4,
  },
  patternDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: text.description ?? COLORS.TEXT_SUBTLE,
  },
  patternMeta: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
    color: text.description ?? COLORS.TEXT_SUBTLE,
  },
  memoThemeCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  memoThemeTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: text.primary ?? COLORS.TEXT_ON_LIGHT,
  },
  memoThemeChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    marginBottom: 4,
  },
  memoThemeChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    marginRight: 6,
    marginBottom: 6,
  },
  memoThemeChipText: {
    fontSize: 11,
    color: text.description ?? COLORS.TEXT_SUBTLE,
    fontWeight: "600",
  },
  memoThemeMeaning: {
    fontSize: 12,
    lineHeight: 18,
    color: text.description ?? COLORS.TEXT_SUBTLE,
  },
  memoThemeMeta: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
    color: text.description ?? COLORS.TEXT_SUBTLE,
  },
  }, ui));
}
