import React from "react";
import { Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonPressable from "../components/CocolonPressable";
import {
  MyWebMenuScroll,
  useMyWebMenuStyles,
} from "./MyWebMenuCommon";
import { MenuActionCard } from "./MenuActionCardCommon";

export default function MyWebTopScreen({
  onOpenGuide,
  onOpenEmotionAnalysis,
  onOpenSelfStructure,
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
}) {
  const { styles, colors } = useMyWebMenuStyles();


  const safeTodayCount = Math.max(0, Number(todayCount) || 0);
  const safeWeekCount = Math.max(0, Number(weekCount) || 0);
  const safeMonthCount = Math.max(0, Number(monthCount) || 0);

  return (
    <MyWebMenuScroll scrollRef={tutorialScrollRef} onScroll={onTutorialScroll}>
      <View style={styles.homeHeaderRow}>
        <View ref={tutorialRefs?.titleRef} collapsable={false} style={styles.homeTitleRow}>
          <Text style={styles.homeTitle}>Analysis</Text>
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
          title="自己構造"
          description="考え方や反応の傾向を確認します"
          metaText={selfStructureUpdateLabel}
          buttonLabel="自己構造を見る"
          buttonIconName="git-network-outline"
          onPress={onOpenSelfStructure}
          badgeVisible={unreadSelfStructure}
          accessibilityLabel="自己構造を見る"
        />
      </View>

    </MyWebMenuScroll>
  );
}
