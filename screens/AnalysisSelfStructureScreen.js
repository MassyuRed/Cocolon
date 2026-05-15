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
      <AnalysisSubHeader title="わたしマップ" onBack={onBack} />

      <AnalysisDescription>
        人は、相手や場所によって少しずつ違う自分で動いています。{"\n"}
        場面ごとの役割と、そのとき選びやすい行動を見ていきます。
      </AnalysisDescription>

      <AnalysisMediumCard
        title="今のわたしマップ"
        description="場面ごとの役割と行動傾向を確認します"
        onPress={onOpenLatestReport}
        badgeVisible={unreadLatest}
        chevron="forward"
        accessibilityLabel="今のわたしマップを開く"
      />

      <View style={{ marginTop: 12 }}>
        <AnalysisMediumCard
          title="わたしマップの履歴"
          description="過去の詳しい自己分析レポートを振り返ります"
          onPress={onOpenHistory}
          badgeVisible={unreadHistory}
          chevron="forward"
          accessibilityLabel="わたしマップの履歴を開く"
        />
      </View>
    </AnalysisMenuScroll>
  );
}
