import React from "react";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { AnalysisDescription, AnalysisMediumCard, AnalysisMenuScroll, useAnalysisMenuStyles } from "./AnalysisMenuCommon";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { styles } = useAnalysisMenuStyles();

  return (
    <AnalysisMenuScroll>
      <View style={styles.homeHeaderRow}>
        <View style={styles.homeTitleRow}>
          <Text style={styles.homeTitle}>設定</Text>
        </View>
      </View>

      <AnalysisDescription>見た目や通知、プラン、アカウントの設定を確認できます。</AnalysisDescription>

      <AnalysisMediumCard
        title="アプリ設定"
        description="カラーテーマ・通知の受け取り方"
        onPress={() => navigation.navigate("SettingsAppSettings")}
        accessibilityLabel="アプリ設定を開く"
      />

      <View style={{ marginTop: 16 }}>
        <AnalysisMediumCard
          title="サブスク加入状況"
          description="現在のプラン・購入の復元・契約の管理"
          onPress={() => navigation.navigate("SubscriptionSelect")}
          accessibilityLabel="サブスク加入状況を開く"
        />
      </View>

      <View style={{ marginTop: 16 }}>
        <AnalysisMediumCard
          title="その他"
          description="チュートリアル・ログアウト・アカウント削除"
          onPress={() => navigation.navigate("SettingsOther")}
          accessibilityLabel="その他の設定を開く"
        />
      </View>
    </AnalysisMenuScroll>
  );
}

