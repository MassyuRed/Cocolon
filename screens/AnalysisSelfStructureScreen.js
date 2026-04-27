import React from "react";
import { View } from "react-native";

import {
  AnalysisDescription,
  AnalysisMediumCard,
  AnalysisMenuScroll,
  AnalysisSubHeader,
} from "./AnalysisMenuCommon";

export default function AnalysisSelfStructureScreen({
  onBack,
  onOpenLatestReport,
  onOpenHistory,
  unreadLatest = false,
  unreadHistory = false,
}) {
  return (
    <AnalysisMenuScroll>
      <AnalysisSubHeader title="自己分析" onBack={onBack} />

      <AnalysisDescription>
        自己分析の見方を選んでください。{"\n"}
        現在のレポートを見るか、過去の履歴をたどるかを選べます。
      </AnalysisDescription>

      <AnalysisMediumCard
        title="レポート"
        description="現在の自己分析を確認します"
        onPress={onOpenLatestReport}
        badgeVisible={unreadLatest}
        chevron="forward"
        accessibilityLabel="現在の自己分析を開く"
      />

      <View style={{ marginTop: 12 }}>
        <AnalysisMediumCard
          title="履歴"
          description="過去の自己分析を振り返ります"
          onPress={onOpenHistory}
          badgeVisible={unreadHistory}
          chevron="forward"
          accessibilityLabel="自己分析の履歴を開く"
        />
      </View>
    </AnalysisMenuScroll>
  );
}
