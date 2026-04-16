import React, { useCallback } from "react";
import { Alert } from "react-native";

import { useTutorial } from "../TutorialContext";
import {
  MyModelDescription,
  MyModelMediumCard,
  MyModelMenuScroll,
  MyModelSubHeader,
} from "./MyModelMenuCommon";

export default function MyModelReactionHistoryScreen({ navigation }) {
  const { isTutorialMode } = useTutorial();

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
      navigation?.navigate?.("MyModel");
    } catch {
      // noop
    }
  }, [navigation]);

  const showTutorialHistoryInfo = useCallback(() => {
    Alert.alert(
      "履歴（チュートリアル）",
      "本番では、共鳴したPieceの履歴がここに蓄積されます。\n\nチュートリアルでは、まずPieceの作成と閲覧の流れを確認してください。"
    );
  }, []);

  const openEchoesHistory = useCallback(() => {
    if (isTutorialMode) {
      showTutorialHistoryInfo();
      return;
    }
    navigation?.navigate?.("EchoesHistoryList");
  }, [isTutorialMode, navigation, showTutorialHistoryInfo]);

  return (
    <MyModelMenuScroll>
      <MyModelSubHeader title="履歴" onBack={handleBack} />

      <MyModelDescription>
        共鳴したPieceの履歴を確認できます。{"\n"}
        一覧から選ぶと、そのPiece詳細を開きます。
      </MyModelDescription>

      <MyModelMediumCard
        title="共鳴履歴"
        description="共鳴したPieceの履歴を確認します"
        onPress={openEchoesHistory}
        chevron="forward"
        accessibilityLabel="共鳴履歴を開く"
      />
    </MyModelMenuScroll>
  );
}
