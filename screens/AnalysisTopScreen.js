import React from "react";
import { Text, View } from "react-native";
import {
  AnalysisMenuScroll,
  useAnalysisMenuStyles,
} from "./AnalysisMenuCommon";
import { MenuActionCard } from "./MenuActionCardCommon";

export default function AnalysisTopScreen({
  onOpenEmotionAnalysis,
  onOpenSelfStructure,
  tutorialScrollRef,
  onTutorialScroll,
  tutorialRefs,
  emotionUpdateLabel,
  selfStructureUpdateLabel,
  unreadEmotion = false,
  unreadSelfStructure = false,
}) {
  const { styles } = useAnalysisMenuStyles();

  return (
    <AnalysisMenuScroll scrollRef={tutorialScrollRef} onScroll={onTutorialScroll}>
      <View style={styles.homeHeaderRow}>
        <View ref={tutorialRefs?.titleRef} collapsable={false} style={styles.homeTitleRow}>
          <Text style={styles.homeTitle}>分析</Text>
        </View>
      </View>

      <View ref={tutorialRefs?.emotionRef} collapsable={false}>
        <MenuActionCard
          title="感情分析"
          description="日・週・月の感情の流れを確認します"
          metaText={emotionUpdateLabel}
          buttonLabel="感情分析を見る"
          buttonIconName="analytics-outline"
          onPress={onOpenEmotionAnalysis}
          badgeVisible={unreadEmotion}
          accessibilityLabel="感情分析を見る"
        />
      </View>

      <View ref={tutorialRefs?.selfStructureRef} collapsable={false} style={{ marginTop: 16 }}>
        <MenuActionCard
          title="わたしマップ"
          description="場面ごとの役割と行動パターンを確認します"
          metaText={selfStructureUpdateLabel}
          buttonLabel="わたしマップを見る"
          buttonIconName="git-network-outline"
          onPress={onOpenSelfStructure}
          badgeVisible={unreadSelfStructure}
          accessibilityLabel="わたしマップを見る"
        />
      </View>

    </AnalysisMenuScroll>
  );
}
