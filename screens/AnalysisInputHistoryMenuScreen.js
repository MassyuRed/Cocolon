import React from "react";
import { View } from "react-native";

import {
  AnalysisDescription,
  AnalysisMediumCard,
  AnalysisMenuScroll,
  AnalysisSubHeader,
} from "./AnalysisMenuCommon";

export default function AnalysisInputHistoryMenuScreen({
  onBack,
  onOpenEmotionHistory,
  onOpenTodayQuestionHistory,
}) {
  return (
    <AnalysisMenuScroll>
      <AnalysisSubHeader title="入力履歴" onBack={onBack} />

      <AnalysisDescription>
        振り返りたい履歴を選んでください。{"\n"}
        感情入力と今日の問いをそれぞれ確認できます。
      </AnalysisDescription>

      <AnalysisMediumCard
        title="感情入力履歴"
        description="過去の感情入力を振り返ります"
        onPress={onOpenEmotionHistory}
        chevron="forward"
        accessibilityLabel="感情入力履歴を開く"
      />

      <View style={{ marginTop: 12 }}>
        <AnalysisMediumCard
          title="今日の問い履歴"
          description="過去の今日の問いと回答を振り返ります"
          onPress={onOpenTodayQuestionHistory}
          chevron="forward"
          accessibilityLabel="今日の問い履歴を開く"
        />
      </View>
    </AnalysisMenuScroll>
  );
}
