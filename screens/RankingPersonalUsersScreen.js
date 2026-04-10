import React, { useCallback } from "react";
import { View } from "react-native";

import {
  MyModelDescription,
  MyModelMediumCard,
  MyModelMenuScroll,
  MyModelSubHeader,
} from "./MyModelMenuCommon";

export default function RankingPersonalUsersScreen({ navigation }) {
  const handleBack = useCallback(() => {
    try {
      if (navigation?.canGoBack?.()) {
        navigation.goBack();
        return;
      }
    } catch {
      // noop
    }

    try {
      navigation?.navigate?.("RankingTop");
    } catch {
      // noop
    }
  }, [navigation]);

  return (
    <MyModelMenuScroll>
      <MyModelSubHeader title="個人ユーザー" onBack={handleBack} />

      <MyModelDescription>
        個人ユーザーのステータスに関するランキングを選んでください。
      </MyModelDescription>

      <MyModelMediumCard
        title="連続ログイン日数ランキング"
        description="連続ログイン日数のランキングを確認します"
        onPress={() => navigation?.navigate?.("RankingLoginStreak")}
        chevron="forward"
        accessibilityLabel="連続ログイン日数ランキングを開く"
      />

      <View style={{ marginTop: 12 }}>
        <MyModelMediumCard
          title="入力数ランキング"
          description="入力数のランキングを確認します"
          onPress={() => navigation?.navigate?.("RankingInputCount")}
          chevron="forward"
          accessibilityLabel="入力数ランキングを開く"
        />
      </View>

      <View style={{ marginTop: 12 }}>
        <MyModelMediumCard
          title="入力文字数ランキング"
          description="入力文字数のランキングを確認します"
          onPress={() => navigation?.navigate?.("RankingInputLength")}
          chevron="forward"
          accessibilityLabel="入力文字数ランキングを開く"
        />
      </View>
    </MyModelMenuScroll>
  );
}
