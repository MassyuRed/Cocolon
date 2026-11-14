import React, { useCallback, useState } from "react";
import { View } from "react-native";

import {
  AnalysisDescription,
  AnalysisMediumCard,
  AnalysisMenuScroll,
  AnalysisOptionRow,
  AnalysisSubHeader,
} from "./AnalysisMenuCommon";

export default function AnalysisEmotionScreen({
  onBack,
  onOpenLatestDaily,
  onOpenLatestWeekly,
  onOpenLatestMonthly,
  onOpenDailyHistory,
  onOpenWeeklyHistory,
  onOpenMonthlyHistory,
  unreadDaily = false,
  unreadWeekly = false,
  unreadMonthly = false,
}) {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = useCallback((nextSection) => {
    setExpandedSection((prev) => (prev === nextSection ? null : nextSection));
  }, []);

  const hasAnyUnread = !!(unreadDaily || unreadWeekly || unreadMonthly);

  return (
    <AnalysisMenuScroll>
      <AnalysisSubHeader title="感情分析" onBack={onBack} />

      <AnalysisDescription>
        感情分析のこころグラフを選んでください。{"\n"}
        こころグラフ（日/週/月）の最新表示や、過去の履歴を確認できます。
      </AnalysisDescription>

      <AnalysisMediumCard
        title="レポート"
        description="最新のこころグラフ（日/週/月）を確認します"
        onPress={() => toggleSection("report")}
        badgeVisible={hasAnyUnread}
        chevron={expandedSection === "report" ? "up" : "down"}
        accessibilityLabel="最新のこころグラフを選ぶ"
      />

      {expandedSection === "report" ? (
        <View style={{ marginTop: 8 }}>
          <AnalysisOptionRow
            label="こころグラフ（日）"
            onPress={onOpenLatestDaily}
            badgeVisible={unreadDaily}
            accessibilityLabel="最新のこころグラフ（日）を開く"
          />
          <View style={{ marginTop: 8 }}>
            <AnalysisOptionRow
              label="こころグラフ（週）"
              onPress={onOpenLatestWeekly}
              badgeVisible={unreadWeekly}
              accessibilityLabel="最新のこころグラフ（週）を開く"
            />
          </View>
          <View style={{ marginTop: 8 }}>
            <AnalysisOptionRow
              label="こころグラフ（月）"
              onPress={onOpenLatestMonthly}
              badgeVisible={unreadMonthly}
              accessibilityLabel="最新のこころグラフ（月）を開く"
            />
          </View>
        </View>
      ) : null}

      <View style={{ marginTop: 12 }}>
        <AnalysisMediumCard
          title="履歴"
          description="過去のこころグラフを振り返ります"
          onPress={() => toggleSection("history")}
          badgeVisible={hasAnyUnread}
          chevron={expandedSection === "history" ? "up" : "down"}
          accessibilityLabel="こころグラフの履歴を選ぶ"
        />
      </View>

      {expandedSection === "history" ? (
        <View style={{ marginTop: 8 }}>
          <AnalysisOptionRow
            label="こころグラフ（日）"
            onPress={onOpenDailyHistory}
            badgeVisible={unreadDaily}
            accessibilityLabel="こころグラフ（日）の履歴を開く"
          />
          <View style={{ marginTop: 8 }}>
            <AnalysisOptionRow
              label="こころグラフ（週）"
              onPress={onOpenWeeklyHistory}
              badgeVisible={unreadWeekly}
              accessibilityLabel="こころグラフ（週）の履歴を開く"
            />
          </View>
          <View style={{ marginTop: 8 }}>
            <AnalysisOptionRow
              label="こころグラフ（月）"
              onPress={onOpenMonthlyHistory}
              badgeVisible={unreadMonthly}
              accessibilityLabel="こころグラフ（月）の履歴を開く"
            />
          </View>
        </View>
      ) : null}
    </AnalysisMenuScroll>
  );
}
