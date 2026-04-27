import React from "react";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { PieceLargeCard } from "./PieceMenuCommon";
import { AnalysisMenuScroll, useAnalysisMenuStyles } from "./AnalysisMenuCommon";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { styles } = useAnalysisMenuStyles();

  return (
    <AnalysisMenuScroll>
      <View style={styles.homeHeaderRow}>
        <View style={styles.homeTitleRow}>
          <Text style={styles.homeTitle}>Settings</Text>
        </View>
      </View>

      <PieceLargeCard
        title="アプリ設定"
        description="アプリの見た目や通知に関する設定です"
        onPress={() => navigation.navigate("SettingsAppSettings")}
        accessibilityLabel="アプリ設定を開く"
      />

      <View style={{ marginTop: 16 }}>
        <PieceLargeCard
          title="サブスク加入状況"
          description="サブスクの加入状況に関する画面です"
          onPress={() => navigation.navigate("SubscriptionSelect")}
          accessibilityLabel="サブスク加入状況を開く"
        />
      </View>

      <View style={{ marginTop: 16 }}>
        <PieceLargeCard
          title="その他"
          description="チュートリアルやアカウント操作に関する設定です"
          onPress={() => navigation.navigate("SettingsOther")}
          accessibilityLabel="その他の設定を開く"
        />
      </View>
    </AnalysisMenuScroll>
  );
}
