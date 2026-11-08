import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonPressable from "../components/CocolonPressable";
import { ScreenUnreadBadge } from "../components/UnreadBadge";
import AnalysisReportViewerScreen from "./AnalysisReportViewerScreen";
import SelfStructureReportGenerateScreen from "./SelfStructureReportGenerateScreen";
import WatashiMapRenderer from "../components/selfStructure/WatashiMapRenderer";
import KokoroWeatherTimeline from "./analysisReport/KokoroWeatherTimeline";
import { isKokoroWeatherReportRecord } from "./analysisReport/kokoroWeatherFormatters";
import {
  AnalysisMenuScroll,
  useAnalysisMenuStyles,
} from "./AnalysisMenuCommon";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";

const ANALYSIS_TABS = [
  { key: "emotion", label: "こころ天気" },
  { key: "self", label: "わたしマップ" },
];

const EMOTION_REPORT_TABS = [
  { key: "daily", label: "こころ天気（日）" },
  { key: "weekly", label: "こころ天気（週）" },
  { key: "monthly", label: "こころ天気（月）" },
];

function safeParseTutorialContentJson(raw) {
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

function createLocalStyles(colors, ui) {
  const text = ui?.text || {};
  return StyleSheet.create(
    applyTypographyTokens(
      {
        tabBar: {
      flexDirection: "row",
      alignItems: "stretch",
      justifyContent: "space-between",
      gap: 8,
      marginBottom: 16,
    },
        periodRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 12,
    },
        secondaryTabBar: {
      flexDirection: "row",
      alignItems: "stretch",
      backgroundColor: colors.FIELD_BG,
      borderRadius: 22,
      padding: 3,
      maxWidth: "100%",
      flexShrink: 1,
    },
        tabItemWrap: {
      flex: 1,
      minWidth: 0,
      flexShrink: 1,
    },
        tabItem: {
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44,
      width: "100%",
    },
        tabLabelWrap: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      minHeight: 44,
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 24,
      backgroundColor: colors.SURFACE_TONAL,
      minWidth: 0,
    },
        tabLabelWrapActive: {
      backgroundColor: colors.GOLD_BUTTON,
    },
        periodTabItemWrap: {
      minWidth: 44,
      flexShrink: 0,
    },
        periodTabItem: {
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44,
      minWidth: 44,
      paddingHorizontal: 2,
      paddingVertical: 2,
    },
        periodTabLabelWrap: {
      alignItems: "center",
      justifyContent: "center",
      minHeight: 40,
      minWidth: 40,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 20,
      maxWidth: "100%",
    },
        periodTabLabelWrapActive: {
      backgroundColor: colors.GOLD_BUTTON,
    },
        tabIcon: {
      marginRight: 6,
      flexShrink: 0,
    },
        tabLabelRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      minWidth: 0,
    },
        periodTabLabelRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 0,
    },
        tabLabelText: {
      color: colors.ON_SURFACE_TONAL,
      flexShrink: 1,
      minWidth: 0,
      textAlign: "center",
    },
        tabLabelTextActive: {
      color: colors.ACCENT_TEXT,
    },
        tabBadge: {
      marginLeft: 6,
      alignSelf: "center",
      flexShrink: 0,
    },
        updateLabel: {
      color: text.description ?? colors.TEXT_SUBTLE,
      flexShrink: 1,
      minWidth: 0,
    },
        selfUpdateLabel: {
      marginBottom: 10,
    },
        emptyCard: {
      borderRadius: 24,
      backgroundColor: colors.FIELD_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginBottom: 10,
      width: "100%",
      maxWidth: 640,
      alignSelf: "center",
    },
        emptyTitle: {
      color: text.primary ?? colors.TEXT_ON_LIGHT,
    },
        emptyText: {
      marginTop: 6,
      color: text.description ?? colors.TEXT_SUBTLE,
    },
        connectionCard: {
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      borderRadius: 24,
      backgroundColor: colors.FIELD_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginBottom: 14,
      width: "100%",
      maxWidth: 640,
      alignSelf: "center",
    },
        connectionTitle: {
      color: text.primary ?? colors.TEXT_ON_LIGHT,
      marginBottom: 10,
    },
        connectionRow: {
          borderTopWidth: 1,
          borderTopColor: colors.CARD_BORDER,
          paddingTop: 10,
          marginTop: 10,
        },
        connectionRowFirst: {
          borderTopWidth: 0,
          paddingTop: 0,
          marginTop: 0,
        },
        connectionRowTitle: {
      color: colors.TITLE_GOLD,
    },
        connectionRowText: {
      marginTop: 4,
      color: text.description ?? colors.TEXT_SUBTLE,
    },
        loadingWrap: {
          paddingVertical: 24,
          alignItems: "center",
          justifyContent: "center",
        },
        historyInlineLink: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "stretch",
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 18,
      backgroundColor: colors.FIELD_BG,
      marginTop: 4,
      minHeight: 44,
      maxWidth: "100%",
    },
        historyInlineText: {
      color: colors.TITLE_GOLD,
      marginRight: 4,
      minWidth: 0,
      flexShrink: 1,
    },
        historyInlineBadge: {
      marginRight: 6,
      alignSelf: "center",
      flexShrink: 0,
    },
      },
      ui, {"tabLabelText":"button","updateLabel":"meta","emptyTitle":"sectionTitle","emptyText":"description","connectionTitle":"sectionTitle","connectionRowTitle":"button","connectionRowText":"description","historyInlineText":"button"}
    )
  );
}

export default function AnalysisContentFirstScreen({
  onOpenGuide,
  tutorialScrollRef,
  onTutorialScroll,
  tutorialRefs,
  emotionUpdateLabel,
  selfStructureUpdateLabel,
  unreadEmotion = false,
  unreadSelfStructure = false,
  unreadDaily = false,
  unreadWeekly = false,
  unreadMonthly = false,
  unreadSelfStructureLatest = false,
  unreadSelfStructureHistory = false,
  latestReports,
  homeSummariesLoading = false,
  onOpenDailyHistory,
  onOpenWeeklyHistory,
  onOpenMonthlyHistory,
  onOpenSelfHistory,
  onOpenSubscription,
  onRefreshEmotionUnread,
  onLatestSeenVersion,
  isTutorialMode = false,
  tutorialStep = 0,
  tutorialReports = null,
  tutorialSelfAnalysisGuide = null,
  tutorialWatashiMapReport = null,
}) {
  const { styles, colors, ui, themeName } = useAnalysisMenuStyles();
  const localStyles = useMemo(() => createLocalStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";

  const [activeAnalysisTab, setActiveAnalysisTab] = useState("emotion");
  const [activeEmotionReportType, setActiveEmotionReportType] = useState("daily");

  useEffect(() => {
    if (!isTutorialMode) return;

    if (tutorialStep === 12) {
      setActiveAnalysisTab("self");
      return;
    }

    setActiveAnalysisTab("emotion");
    if (tutorialStep === 11) {
      setActiveEmotionReportType("monthly");
    } else if (tutorialStep === 10) {
      setActiveEmotionReportType("weekly");
    } else {
      setActiveEmotionReportType("daily");
    }
  }, [isTutorialMode, tutorialStep]);

  const effectiveLatestReports =
    isTutorialMode && tutorialReports && typeof tutorialReports === "object"
      ? tutorialReports
      : latestReports;
  const currentEmotionReportCandidate =
    effectiveLatestReports && typeof effectiveLatestReports === "object"
      ? effectiveLatestReports[activeEmotionReportType] || null
      : null;
  const currentEmotionReport = isKokoroWeatherReportRecord(currentEmotionReportCandidate)
    ? currentEmotionReportCandidate
    : null;
  const tutorialWatashiMapContentJson = useMemo(
    () => safeParseTutorialContentJson(tutorialWatashiMapReport?.content_json),
    [tutorialWatashiMapReport?.content_json]
  );
  const effectiveHomeSummariesLoading = isTutorialMode ? false : homeSummariesLoading;
  const currentEmotionHistoryLabel =
    EMOTION_REPORT_TABS.find((tab) => tab.key === activeEmotionReportType)?.label || "こころ天気（日）";

  const handleOpenCurrentEmotionHistory = () => {
    if (activeEmotionReportType === "weekly") {
      onOpenWeeklyHistory?.();
      return;
    }
    if (activeEmotionReportType === "monthly") {
      onOpenMonthlyHistory?.();
      return;
    }
    onOpenDailyHistory?.();
  };

  const renderTab = ({ tabKey, label, displayLabel = label, icon, active, badgeVisible, onPress, targetRef = null, period = false }) => {
    const content = (
      <CocolonPressable
        style={period ? localStyles.periodTabItem : localStyles.tabItem}
        onPress={isTutorialMode ? undefined : onPress}
        disabled={isTutorialMode}
        accessibilityLabel={label}
        accessibilityState={{ selected: active }}
      >
        <View
          style={[
            period ? localStyles.periodTabLabelWrap : localStyles.tabLabelWrap,
            active && (period ? localStyles.periodTabLabelWrapActive : localStyles.tabLabelWrapActive),
          ]}
        >
          <View style={period ? localStyles.periodTabLabelRow : localStyles.tabLabelRow}>
            {icon ? (
              <Ionicons name={icon} size={17} color={active ? colors.ACCENT_TEXT : colors.ON_SURFACE_TONAL} style={localStyles.tabIcon} />
            ) : null}
            <Text
              style={[
                localStyles.tabLabelText,
                active && localStyles.tabLabelTextActive,
              ]}
            >
              {displayLabel}
            </Text>
            {badgeVisible ? (
              <ScreenUnreadBadge
                visible={badgeVisible}
                style={localStyles.tabBadge}
              />
            ) : null}
          </View>
        </View>
      </CocolonPressable>
    );

    if (targetRef) {
      return (
        <View key={tabKey} ref={targetRef} collapsable={false} style={localStyles.tabItemWrap}>
          {content}
        </View>
      );
    }

    return <View key={tabKey} style={period ? localStyles.periodTabItemWrap : localStyles.tabItemWrap}>{content}</View>;
  };

  return (
    <AnalysisMenuScroll scrollRef={tutorialScrollRef} onScroll={onTutorialScroll}>
      <View style={styles.homeHeaderRow}>
        <View ref={tutorialRefs?.titleRef} collapsable={false} style={styles.homeTitleRow}>
          <Text style={styles.homeTitle}>分析</Text>
          <View ref={tutorialRefs?.guideRef} collapsable={false}>
            <CocolonPressable
              style={styles.guideButton}
              onPress={isTutorialMode ? undefined : onOpenGuide}
              disabled={isTutorialMode}
              accessibilityLabel="Analysisのガイドを開く"
            >
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={colors.TEXT_ON_LIGHT}
              />
            </CocolonPressable>
          </View>
        </View>
      </View>

      <View style={localStyles.tabBar}>
        {ANALYSIS_TABS.map((tab) =>
          renderTab({
            tabKey: tab.key,
            label: tab.label,
            icon: tab.key === "emotion" ? "partly-sunny-outline" : "git-network-outline",
            active: activeAnalysisTab === tab.key,
            badgeVisible: tab.key === "emotion" ? unreadEmotion : unreadSelfStructure,
            onPress: () => setActiveAnalysisTab(tab.key),
            targetRef: tab.key === "emotion" ? tutorialRefs?.emotionRef : tutorialRefs?.selfStructureRef,
          })
        )}
      </View>

      {activeAnalysisTab === "emotion" ? (
        <>
          {!isTutorialMode ? (
            <KokoroWeatherTimeline
              colors={colors}
              ui={ui}
              period={{ daily: "today", weekly: "week", monthly: "month" }[activeEmotionReportType]}
              onPeriodChange={(period) => setActiveEmotionReportType({ today: "daily", week: "weekly", month: "monthly" }[period])}
            />
          ) : (
          <>
          <View style={localStyles.periodRow}>
            <View style={localStyles.secondaryTabBar}>
              {EMOTION_REPORT_TABS.map((tab) =>
                renderTab({
                  tabKey: tab.key,
                  label: tab.label,
                  displayLabel: { daily: "日", weekly: "週", monthly: "月" }[tab.key],
                  period: true,
                  active: activeEmotionReportType === tab.key,
                  badgeVisible:
                    (tab.key === "daily" && unreadDaily) ||
                    (tab.key === "weekly" && unreadWeekly) ||
                    (tab.key === "monthly" && unreadMonthly),
                  onPress: () => setActiveEmotionReportType(tab.key),
                })
              )}
            </View>
            <Text style={localStyles.updateLabel}>{emotionUpdateLabel}</Text>
          </View>

          <View ref={tutorialRefs?.reportRef} collapsable={false}>
            {effectiveHomeSummariesLoading && !currentEmotionReport ? (
              <View style={localStyles.loadingWrap}>
                <ActivityIndicator size="small" color={colors.TEXT_SUBTLE} />
              </View>
            ) : currentEmotionReport ? (
              <AnalysisReportViewerScreen
                report={currentEmotionReport}
                embedded
                hideHeader
                disableActions={isTutorialMode}
                onOpenSubscription={onOpenSubscription}
                onMarkedRead={onRefreshEmotionUnread}
              />
            ) : (
              <View style={localStyles.emptyCard}>
                <Text style={localStyles.emptyTitle}>最新の{currentEmotionHistoryLabel}はまだありません</Text>
                <Text style={localStyles.emptyText}>
                  入力後にレポートが作成されると、ここに最初から表示されます。
                </Text>
              </View>
            )}
          </View>

          </>
          )}

          {!isTutorialMode ? (
          <CocolonPressable
            style={localStyles.historyInlineLink}
            onPress={handleOpenCurrentEmotionHistory}
            accessibilityLabel={`${currentEmotionHistoryLabel}の履歴を見る`}
          >
            <Text style={localStyles.historyInlineText}>{currentEmotionHistoryLabel}の履歴を見る</Text>
            <ScreenUnreadBadge
              visible={(activeEmotionReportType === "daily" && unreadDaily) ||
                (activeEmotionReportType === "weekly" && unreadWeekly) ||
                (activeEmotionReportType === "monthly" && unreadMonthly)}
              style={localStyles.historyInlineBadge}
            />
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.TEXT_SUBTLE}
            />
          </CocolonPressable>
          ) : null}
        </>
      ) : (
        <>
          <Text style={[localStyles.updateLabel, localStyles.selfUpdateLabel]}>{selfStructureUpdateLabel}</Text>

          <View ref={tutorialRefs?.selfReportRef} collapsable={false}>
            {isTutorialMode ? (
              <>
                <View style={localStyles.emptyCard}>
                  <Text style={localStyles.emptyTitle}>
                    {String(tutorialSelfAnalysisGuide?.title || "わたしマップ")}
                  </Text>
                  <Text style={localStyles.emptyText}>
                    {String(tutorialSelfAnalysisGuide?.body || "わたしマップでは、場面ごとの役割と行動パターンを確認できます。")}
                  </Text>
                </View>
                {tutorialWatashiMapContentJson ? (
                  <WatashiMapRenderer
                    showPlanNotice={false}
                    contentJson={tutorialWatashiMapContentJson}
                    contentText={tutorialWatashiMapReport?.content_text || tutorialWatashiMapReport?.contentText || ""}
                    reportMode={tutorialWatashiMapReport?.report_mode || tutorialWatashiMapReport?.reportMode || "light"}
                    viewerTier={tutorialWatashiMapReport?.viewer_tier || tutorialWatashiMapReport?.viewerTier || "free"}
                    periodLabel={tutorialWatashiMapReport?.period_label || tutorialWatashiMapReport?.periodLabel || "練習用の表示例"}
                    colors={colors}
                    isDark={isDark}
                    onUpgradePress={onOpenSubscription}
                  />
                ) : null}
              </>
            ) : (
              <>
                <SelfStructureReportGenerateScreen
                  embedded
                  hideHeader
                  showTitle={false}
                  titleOverride="今のわたしマップ"
                  useServerDefaultMode
                  onLatestSeenVersion={onLatestSeenVersion}
                />
              </>
            )}
          </View>

          {!isTutorialMode ? (
          <CocolonPressable
            style={localStyles.historyInlineLink}
            onPress={onOpenSelfHistory}
            accessibilityLabel="わたしマップの履歴を見る"
          >
            <Text style={localStyles.historyInlineText}>わたしマップの履歴を見る</Text>
            <ScreenUnreadBadge
              visible={unreadSelfStructureHistory}
              style={localStyles.historyInlineBadge}
            />
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.TEXT_SUBTLE}
            />
          </CocolonPressable>
          ) : null}
        </>
      )}
    </AnalysisMenuScroll>
  );
}

