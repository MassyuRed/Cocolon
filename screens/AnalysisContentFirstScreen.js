import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonPressable from "../components/CocolonPressable";
import { ScreenUnreadBadge } from "../components/UnreadBadge";
import AnalysisReportViewerScreen from "./AnalysisReportViewerScreen";
import SelfStructureReportGenerateScreen from "./SelfStructureReportGenerateScreen";
import WatashiMapRenderer from "../components/selfStructure/WatashiMapRenderer";
import KokoroWeatherCurrentCard from "./analysisReport/KokoroWeatherCurrentCard";
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
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: colors.CARD_BORDER,
          marginBottom: 14,
        },
        secondaryTabBar: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: colors.CARD_BORDER,
          marginBottom: 12,
        },
        tabItemWrap: {
          flex: 1,
        },
        tabItem: {
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 10,
          paddingHorizontal: 4,
        },
        tabLabelWrap: {
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 9,
          borderBottomWidth: 2,
          borderBottomColor: "transparent",
        },
        tabLabelWrapActive: {
          borderBottomColor: colors.TITLE_GOLD,
        },
        tabLabelRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        tabLabelText: {
          fontSize: 13,
          fontWeight: "800",
          color: text.description ?? colors.TEXT_SUBTLE,
        },
        tabLabelTextActive: {
          color: colors.TITLE_GOLD,
        },
        tabBadge: {
          marginLeft: 6,
          alignSelf: "center",
        },
        updateLabel: {
          fontSize: 12,
          lineHeight: 18,
          color: text.description ?? colors.TEXT_SUBTLE,
          marginBottom: 10,
        },
        emptyCard: {
          borderWidth: 1,
          borderColor: colors.CARD_BORDER,
          borderRadius: 16,
          backgroundColor: colors.FIELD_BG,
          paddingHorizontal: 16,
          paddingVertical: 16,
          marginBottom: 10,
        },
        emptyTitle: {
          fontSize: 14,
          fontWeight: "800",
          color: text.primary ?? colors.TEXT_ON_LIGHT,
        },
        emptyText: {
          marginTop: 6,
          fontSize: 13,
          lineHeight: 20,
          color: text.description ?? colors.TEXT_SUBTLE,
        },
        connectionCard: {
          borderWidth: 1,
          borderColor: colors.CARD_BORDER,
          borderRadius: 16,
          backgroundColor: colors.FIELD_BG,
          paddingHorizontal: 14,
          paddingVertical: 14,
          marginBottom: 14,
        },
        connectionTitle: {
          fontSize: 14,
          fontWeight: "900",
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
          fontSize: 13,
          fontWeight: "900",
          color: colors.TITLE_GOLD,
        },
        connectionRowText: {
          marginTop: 4,
          fontSize: 12,
          lineHeight: 18,
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
          alignSelf: "flex-start",
          paddingVertical: 6,
          marginTop: 4,
        },
        historyInlineText: {
          fontSize: 13,
          fontWeight: "700",
          color: text.primary ?? colors.TEXT_ON_LIGHT,
          marginRight: 4,
        },
        historyInlineBadge: {
          marginRight: 6,
          alignSelf: "center",
        },
      },
      ui
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
  currentWeather = null,
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

  const handleOpenPreviousKokoroWeather = () => {
    if (typeof onOpenCurrentWeatherPrevious === "function") {
      onOpenCurrentWeatherPrevious();
      return;
    }
    setActiveAnalysisTab("emotion");
    setActiveEmotionReportType("daily");
    if (!isKokoroWeatherReportRecord(effectiveLatestReports?.daily)) {
      onOpenDailyHistory?.();
    }
  };

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

  const renderTab = ({ tabKey, label, active, badgeVisible, onPress, targetRef = null }) => {
    const content = (
      <CocolonPressable
        style={localStyles.tabItem}
        onPress={isTutorialMode ? undefined : onPress}
        disabled={isTutorialMode}
      >
        <View
          style={[
            localStyles.tabLabelWrap,
            active && localStyles.tabLabelWrapActive,
          ]}
        >
          <View style={localStyles.tabLabelRow}>
            <Text
              style={[
                localStyles.tabLabelText,
                active && localStyles.tabLabelTextActive,
              ]}
            >
              {label}
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

    return <View key={tabKey} style={localStyles.tabItemWrap}>{content}</View>;
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

      {!isTutorialMode && currentWeather ? (
        <KokoroWeatherCurrentCard
          currentWeather={currentWeather}
          colors={colors}
          ui={ui}
          onOpenPrevious={handleOpenPreviousKokoroWeather}
        />
      ) : null}

      <View style={localStyles.tabBar}>
        {ANALYSIS_TABS.map((tab) =>
          renderTab({
            tabKey: tab.key,
            label: tab.label,
            active: activeAnalysisTab === tab.key,
            badgeVisible: tab.key === "emotion" ? unreadEmotion : unreadSelfStructure,
            onPress: () => setActiveAnalysisTab(tab.key),
            targetRef: tab.key === "emotion" ? tutorialRefs?.emotionRef : tutorialRefs?.selfStructureRef,
          })
        )}
      </View>

      {activeAnalysisTab === "emotion" ? (
        <>
          <View style={localStyles.secondaryTabBar}>
            {EMOTION_REPORT_TABS.map((tab) =>
              renderTab({
                tabKey: tab.key,
                label: tab.label,
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
          <Text style={localStyles.updateLabel}>{selfStructureUpdateLabel}</Text>

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
                    contentJson={tutorialWatashiMapContentJson}
                    contentText={tutorialWatashiMapReport?.content_text || tutorialWatashiMapReport?.contentText || ""}
                    reportMode={tutorialWatashiMapReport?.report_mode || tutorialWatashiMapReport?.reportMode || "light"}
                    viewerTier={tutorialWatashiMapReport?.viewer_tier || tutorialWatashiMapReport?.viewerTier || "free"}
                    periodLabel={tutorialWatashiMapReport?.period_label || tutorialWatashiMapReport?.periodLabel || "直近28日"}
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
