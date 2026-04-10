import React, { useCallback } from "react";

import {
  MyModelDescription,
  MyModelMediumCard,
  MyModelMenuScroll,
  MyModelSubHeader,
} from "./MyModelMenuCommon";

export default function RankingAllUsersScreen({ navigation }) {
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
      <MyModelSubHeader title="全ユーザー" onBack={handleBack} />

      <MyModelDescription>
        全ユーザーに関するランキングを選んでください。
      </MyModelDescription>

      <MyModelMediumCard
        title="感情ランキング"
        description="感情ごとのランキングを確認します"
        onPress={() => navigation?.navigate?.("RankingEmotion")}
        chevron="forward"
        accessibilityLabel="感情ランキングを開く"
      />
    </MyModelMenuScroll>
  );
}
