import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonButton from "../components/CocolonButton";
import CocolonPressable from "../components/CocolonPressable";
import { ScreenUnreadBadge } from "../components/UnreadBadge";
import AnalysisReportViewerScreen from "./AnalysisReportViewerScreen";
import SelfStructureReportGenerateScreen from "./SelfStructureReportGenerateScreen";
import {
  AnalysisMenuScroll,
  useAnalysisMenuStyles,
} from "./AnalysisMenuCommon";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";

const ANALYSIS_TABS = [
  { key: "emotion", label: "感情分析" },
  { key: "self", label: "自己分析" },
];

const EMOTION_REPORT_TABS = [
  { key: "daily", label: "日報" },
  { key: "weekly", label: "週報" },
  { key: "monthly", label: "月報" },
];

function createLocalStyles(colors, ui) {
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
          color: colors.TEXT_SUBTLE,
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
          color: colors.TEXT_SUBTLE,
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
          color: colors.TEXT_ON_LIGHT,
        },
        emptyText: {
          marginTop: 6,
          fontSize: 13,
          lineHeight: 20,
          color: colors.TEXT_SUBTLE,
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
          color: colors.TEXT_ON_LIGHT,
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
          color: colors.TEXT_SUBTLE,
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
          color: colors.TEXT_ON_LIGHT,
          marginRight: 4,
        },
        historyInlineBadge: {
          marginRight: 6,
          alignSelf: "center",
        },
        paywallButtonWrap: {
          marginTop: 12,
        },
        paywallBtnText: {
          fontSize: 13,
          fontWeight: "900",
          color: "#FFFFFF",
          letterSpacing: 0.6,
        },
        paywallBtnRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
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
  todayCount = 0,
  weekCount = 0,
  monthCount = 0,
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
  isPaid = false,
  isTutorialMode = false,
  tutorialStep = 0,
  tutorialReports = null,
  tutorialCounts = null,
  tutorialConnectionRows = [],
  tutorialSelfAnalysisGuide = null,
}) {
  const { styles, colors, ui } = useAnalysisMenuStyles();
  const localStyles = useMemo(() => createLocalStyles(colors, ui), [colors, ui]);

  const [activeAnalysisTab, setActiveAnalysisTab] = useState("emotion");
  const [activeEmotionReportType, setActiveEmotionReportType] = useState("daily");

  useEffect(() => {
    if (!isTutorialMode) return;

    if (tutorialStep === 10) {
      setActiveAnalysisTab("self");
      return;
    }

    setActiveAnalysisTab("emotion");
    if (tutorialStep === 9) {
      setActiveEmotionReportType("monthly");
    } else if (tutorialStep === 8) {
      setActiveEmotionReportType("weekly");
    } else {
      setActiveEmotionReportType("daily");
    }
  }, [isTutorialMode, tutorialStep]);

  const effectiveCounts =
    isTutorialMode && tutorialCounts && typeof tutorialCounts === "object"
      ? tutorialCounts
      : null;
  const safeTodayCount = Math.max(0, Number(effectiveCounts?.today ?? todayCount) || 0);
  const safeWeekCount = Math.max(0, Number(effectiveCounts?.week ?? weekCount) || 0);
  const safeMonthCount = Math.max(0, Number(effectiveCounts?.month ?? monthCount) || 0);

  const effectiveLatestReports =
    isTutorialMode && tutorialReports && typeof tutorialReports === "object"
      ? tutorialReports
      : latestReports;
  const currentEmotionReport =
    effectiveLatestReports && typeof effectiveLatestReports === "object"
      ? effectiveLatestReports[activeEmotionReportType] || null
      : null;
  const effectiveHomeSummariesLoading = isTutorialMode ? false : homeSummariesLoading;
  const safeConnectionRows = Array.isArray(tutorialConnectionRows)
    ? tutorialConnectionRows
    : [];

  const currentEmotionHistoryLabel =
    EMOTION_REPORT_TABS.find((tab) => tab.key === activeEmotionReportType)?.label || "日報";

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
      <CocolonPressable style={localStyles.tabItem} onPress={onPress}>
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
              onPress={onOpenGuide}
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

      <View style={styles.summaryBlock}>
        <View style={styles.summaryInner}>
          <View style={styles.summaryHeaderRow}>
            <Ionicons
              name="radio-outline"
              size={14}
              color={colors.TITLE_GOLD}
              style={styles.summaryIcon}
            />
            <Text style={styles.summaryLabel}>あなたの入力状況</Text>
          </View>
          <Text style={styles.summaryText}>{`今日の入力回数は${safeTodayCount}回です`}</Text>
          <Text style={styles.summaryText}>{`今週の入力回数は${safeWeekCount}回です`}</Text>
          <Text style={styles.summaryText}>{`今月の入力回数は${safeMonthCount}回です`}</Text>
        </View>
      </View>

      {isTutorialMode && safeConnectionRows.length > 0 ? (
        <View style={localStyles.connectionCard}>
          <Text style={localStyles.connectionTitle}>感情入力からつながる三大要素</Text>
          {safeConnectionRows.map((row, index) => (
            <View
              key={`${row?.title || "row"}-${index}`}
              style={[
                localStyles.connectionRow,
                index === 0 && localStyles.connectionRowFirst,
              ]}
            >
              <Text style={localStyles.connectionRowTitle}>
                {String(row?.title || "")}
              </Text>
              <Text style={localStyles.connectionRowText}>
                {String(row?.description || "")}
              </Text>
              <Text style={localStyles.connectionRowText}>
                {String(row?.example || "")}
              </Text>
            </View>
          ))}
        </View>
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

          {effectiveHomeSummariesLoading && !currentEmotionReport ? (
            <View style={localStyles.loadingWrap}>
              <ActivityIndicator size="small" color={colors.TEXT_SUBTLE} />
            </View>
          ) : currentEmotionReport ? (
            <AnalysisReportViewerScreen
              report={currentEmotionReport}
              embedded
              hideHeader
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

          {isTutorialMode ? (
            <View style={localStyles.emptyCard}>
              <Text style={localStyles.emptyTitle}>
                {String(tutorialSelfAnalysisGuide?.title || "自己分析レポート")}
              </Text>
              <Text style={localStyles.emptyText}>
                {String(tutorialSelfAnalysisGuide?.body || "自己分析レポートはサブスク加入後に閲覧できます。")}
              </Text>
            </View>
          ) : isPaid ? (
            <SelfStructureReportGenerateScreen
              embedded
              hideHeader
              titleOverride="現在の自己分析"
              useServerDefaultMode
              onLatestSeenVersion={onLatestSeenVersion}
            />
          ) : (
            <View style={localStyles.emptyCard}>
              <Text style={localStyles.emptyTitle}>自己分析レポートはPlusプラン以上で利用できます</Text>
              <Text style={localStyles.emptyText}>
                加入すると、現在の自己分析レポートがここに最初から表示されます。
              </Text>
              <View style={localStyles.paywallButtonWrap}>
                <CocolonButton variant="secondary" onPress={onOpenSubscription}>
                  <View style={localStyles.paywallBtnRow}>
                    <Ionicons
                      name="sparkles-outline"
                      size={18}
                      color={colors.TEXT_ON_LIGHT}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={localStyles.paywallBtnText}>プランを見る</Text>
                  </View>
                </CocolonButton>
              </View>
            </View>
          )}

          {!isTutorialMode ? (
          <CocolonPressable
            style={localStyles.historyInlineLink}
            onPress={onOpenSelfHistory}
            accessibilityLabel="自己分析の履歴を見る"
          >
            <Text style={localStyles.historyInlineText}>自己分析の履歴を見る</Text>
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
