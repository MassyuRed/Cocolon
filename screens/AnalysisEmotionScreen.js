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
        感情分析の見方を選んでください。{"\n"}
        最新のレポートを見るか、過去の履歴をたどるかを選べます。
      </AnalysisDescription>

      <AnalysisMediumCard
        title="レポート"
        description="最新の感情分析レポートを確認します"
        onPress={() => toggleSection("report")}
        badgeVisible={hasAnyUnread}
        chevron={expandedSection === "report" ? "up" : "down"}
        accessibilityLabel="最新の感情分析レポートを選ぶ"
      />

      {expandedSection === "report" ? (
        <View style={{ marginTop: 8 }}>
          <AnalysisOptionRow
            label="日"
            onPress={onOpenLatestDaily}
            badgeVisible={unreadDaily}
            accessibilityLabel="最新の日報を開く"
          />
          <View style={{ marginTop: 8 }}>
            <AnalysisOptionRow
              label="週"
              onPress={onOpenLatestWeekly}
              badgeVisible={unreadWeekly}
              accessibilityLabel="最新の週報を開く"
            />
          </View>
          <View style={{ marginTop: 8 }}>
            <AnalysisOptionRow
              label="月"
              onPress={onOpenLatestMonthly}
              badgeVisible={unreadMonthly}
              accessibilityLabel="最新の月報を開く"
            />
          </View>
        </View>
      ) : null}

      <View style={{ marginTop: 12 }}>
        <AnalysisMediumCard
          title="履歴"
          description="過去の感情分析レポートを振り返ります"
          onPress={() => toggleSection("history")}
          badgeVisible={hasAnyUnread}
          chevron={expandedSection === "history" ? "up" : "down"}
          accessibilityLabel="感情分析レポート履歴を選ぶ"
        />
      </View>

      {expandedSection === "history" ? (
        <View style={{ marginTop: 8 }}>
          <AnalysisOptionRow
            label="日"
            onPress={onOpenDailyHistory}
            badgeVisible={unreadDaily}
            accessibilityLabel="日報履歴を開く"
          />
          <View style={{ marginTop: 8 }}>
            <AnalysisOptionRow
              label="週"
              onPress={onOpenWeeklyHistory}
              badgeVisible={unreadWeekly}
              accessibilityLabel="週報履歴を開く"
            />
          </View>
          <View style={{ marginTop: 8 }}>
            <AnalysisOptionRow
              label="月"
              onPress={onOpenMonthlyHistory}
              badgeVisible={unreadMonthly}
              accessibilityLabel="月報履歴を開く"
            />
          </View>
        </View>
      ) : null}
    </AnalysisMenuScroll>
  );
}
