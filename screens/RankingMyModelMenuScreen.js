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
        Pieceに関するランキングを選んでください。
      </MyModelDescription>

      <MyModelMediumCard
        title="Pieceランキング"
        description="Pieceのランキングを確認します"
        onPress={() => navigation?.navigate?.("RankingMyModelQuestions")}
        chevron="forward"
        accessibilityLabel="Pieceランキングを開く"
      />

      <View style={{ marginTop: 12 }}>
        <MyModelMediumCard
          title="共鳴数ランキング"
          description="共鳴数のランキングを確認します"
          onPress={() => navigation?.navigate?.("RankingMyModelResonances")}
          chevron="forward"
          accessibilityLabel="共鳴数ランキングを開く"
        />
      </View>

      <View style={{ marginTop: 12 }}>
        <MyModelMediumCard
          title="発見数ランキング"
          description="発見数のランキングを確認します"
          onPress={() => navigation?.navigate?.("RankingMyModelDiscoveries")}
          chevron="forward"
          accessibilityLabel="発見数ランキングを開く"
        />
      </View>
    </MyModelMenuScroll>
  );
}
