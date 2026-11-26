import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonScreenIntro from "../components/CocolonScreenIntro";
import CocolonPressable from "../components/CocolonPressable";
import { ScreenUnreadBadge } from "../components/UnreadBadge";
import SelfStructureReportGenerateScreen from "./SelfStructureReportGenerateScreen";
import WatashiMapRenderer from "../components/selfStructure/WatashiMapRenderer";
import KokoroWeatherTimeline from "./analysisReport/KokoroWeatherTimeline";
import {
  AnalysisMenuScroll,
  useAnalysisMenuStyles,
} from "./AnalysisMenuCommon";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { formatLatestUpdateLabel } from "./analysis/analysisRouteModel";

const ANALYSIS_TABS = [
  { key: "emotion", label: "こころグラフ" },
  { key: "self", label: "わたしマップ" },
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
      ...ui?.sectionFrame,
    },
        tabLabelWrapActive: {
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
      ...ui?.sectionFrame,
    },
        emptyTitle: {
      color: text.primary ?? colors.TEXT_ON_LIGHT,
    },
        emptyText: {
      marginTop: 6,
      color: text.description ?? colors.TEXT_SUBTLE,
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
      ...ui?.sectionFrame,
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
      ui, {"tabLabelText":"button","updateLabel":"meta","emptyTitle":"sectionTitle","emptyText":"description","historyInlineText":"button"}
    )
  );
}

export default function AnalysisContentFirstScreen({
  onOpenGuide,
  tutorialScrollRef,
  onTutorialScroll,
  tutorialRefs,
  graphOpenRequest,
  selfStructureUpdateLabel,
  unreadSelfStructure = false,
  unreadSelfStructureHistory = false,
  onOpenSelfHistory,
  onOpenSubscription,
  onLatestSeenVersion,
  mapReadSnapshot,
  currentMapStatus,
  isTutorialMode = false,
  tutorialStep = 0,
  tutorialGraphData = null,
  tutorialSelfAnalysisGuide = null,
  tutorialWatashiMapReport = null,
}) {
  const { colors, ui, themeName } = useAnalysisMenuStyles();
  const localStyles = useMemo(() => createLocalStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";

  const [activeAnalysisTab, setActiveAnalysisTab] = useState("emotion");
  const [graphPeriod, setGraphPeriod] = useState("today");
  const [graphRevision, setGraphRevision] = useState(0);
  const showGraph = activeAnalysisTab === "emotion";

  useEffect(() => {
    if (!graphOpenRequest || isTutorialMode) return;
    setActiveAnalysisTab("emotion");
    setGraphPeriod(graphOpenRequest.period);
    setGraphRevision(value => value + 1);
  }, [graphOpenRequest, isTutorialMode]);

  useEffect(() => {
    if (!isTutorialMode) return;

    if (tutorialStep === 12) {
      setActiveAnalysisTab("self");
      return;
    }

    setActiveAnalysisTab("emotion");
    if (tutorialStep === 11) {
      setGraphPeriod("month");
    } else if (tutorialStep === 10) {
      setGraphPeriod("week");
    } else {
      setGraphPeriod("today");
    }
  }, [isTutorialMode, tutorialStep]);

  const tutorialWatashiMapContentJson = useMemo(
    () => safeParseTutorialContentJson(tutorialWatashiMapReport?.content_json),
    [tutorialWatashiMapReport?.content_json]
  );
  const renderTab = ({ tabKey, label, icon, active, badgeVisible, onPress, targetRef = null }) => {
    const content = (
      <CocolonPressable
        style={localStyles.tabItem}
        onPress={isTutorialMode ? undefined : onPress}
        disabled={isTutorialMode}
        accessibilityLabel={label}
        accessibilityState={{ selected: active }}
      >
        <View
          style={[
            localStyles.tabLabelWrap,
            active && localStyles.tabLabelWrapActive,
          ]}
        >
          <View style={localStyles.tabLabelRow}>
            {icon ? (
              <Ionicons name={icon} size={17} color={active ? colors.ACCENT_TEXT : colors.ON_SURFACE_TONAL} style={localStyles.tabIcon} />
            ) : null}
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
      <CocolonScreenIntro
        eyebrow="あなたの記録から"
        title="わたしを、振り返る。"
        description="気持ちと、日々の選択を少しずつ。"
        titleRef={tutorialRefs?.titleRef}
        colors={colors}
        ui={ui}
      />

      <View style={localStyles.tabBar}>
        {ANALYSIS_TABS.map((tab) =>
          renderTab({
            tabKey: tab.key,
            label: tab.label,
            icon: tab.key === "emotion" ? "bar-chart-outline" : "git-network-outline",
            active: activeAnalysisTab === tab.key,
            badgeVisible: tab.key === "self" && unreadSelfStructure,
            onPress: () => setActiveAnalysisTab(tab.key),
            targetRef: tab.key === "emotion" ? tutorialRefs?.emotionRef : tutorialRefs?.selfStructureRef,
          })
        )}
      </View>

      <View ref={tutorialRefs?.reportRef} collapsable={false} style={showGraph ? undefined : { display: "none" }}>
        <KokoroWeatherTimeline
          key={graphRevision}
          colors={colors}
          ui={ui}
          period={graphPeriod}
          onPeriodChange={setGraphPeriod}
          sampleData={isTutorialMode ? (tutorialGraphData?.[graphPeriod] ?? null) : undefined}
          active={showGraph}
        />
      </View>
      {!showGraph ? (
        <>
          {isTutorialMode ? (
            <Text style={[localStyles.updateLabel, localStyles.selfUpdateLabel]}>{selfStructureUpdateLabel}</Text>
          ) : null}

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
                  renderLatestUpdateLabel={generatedAt => (
                    <Text style={[localStyles.updateLabel, localStyles.selfUpdateLabel]}>
                      {formatLatestUpdateLabel(generatedAt)}
                    </Text>
                  )}
                  onLatestSeenVersion={onLatestSeenVersion}
                  mapReadSnapshot={mapReadSnapshot}
                  currentMapStatus={currentMapStatus}
                  onOpenGuide={onOpenGuide}
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
      ) : null}
    </AnalysisMenuScroll>
  );
}

