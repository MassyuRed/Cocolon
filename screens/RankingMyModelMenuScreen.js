import React, { useCallback } from "react";
import { View } from "react-native";

import {
  MyModelDescription,
  MyModelMediumCard,
  MyModelMenuScroll,
  MyModelSubHeader,
} from "./MyModelMenuCommon";

export default function RankingMyModelMenuScreen({ navigation }) {
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
      <MyModelSubHeader title="Piece" onBack={handleBack} />

      <MyModelDescription>
        Pieceの公開面では、共鳴数を canonical ranking として扱います。
      </MyModelDescription>

      <View>
        <MyModelMediumCard
          title="共鳴数ランキング"
          description="共鳴数のランキングを確認します"
          onPress={() => navigation?.navigate?.("RankingMyModelResonances")}
          chevron="forward"
          accessibilityLabel="共鳴数ランキングを開く"
        />
      </View>
    </MyModelMenuScroll>
  );
}
