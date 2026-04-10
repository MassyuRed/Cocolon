import React, { useCallback } from "react";
import { Alert, View } from "react-native";

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
      "本番では、共鳴や発見を行うと 共鳴 / 発見 の履歴が蓄積されます。\n\nチュートリアルでは、まずReflectionの作成と閲覧の流れを確認してください。"
    );
  }, []);

  const openEchoesHistory = useCallback(() => {
    if (isTutorialMode) {
      showTutorialHistoryInfo();
      return;
    }
    navigation?.navigate?.("EchoesHistoryList");
  }, [isTutorialMode, navigation, showTutorialHistoryInfo]);

  const openDiscoveriesHistory = useCallback(() => {
    if (isTutorialMode) {
      showTutorialHistoryInfo();
      return;
    }
    navigation?.navigate?.("DiscoveriesHistoryList");
  }, [isTutorialMode, navigation, showTutorialHistoryInfo]);

  return (
    <MyModelMenuScroll>
      <MyModelSubHeader title="履歴" onBack={handleBack} />

      <MyModelDescription>
        振り返りたい履歴を選んでください。{"\n"}
        Reflectionに対して行った共鳴と発見をそれぞれ確認できます。
      </MyModelDescription>

      <MyModelMediumCard
        title="共鳴履歴"
        description="共鳴したReflectionの履歴を確認します"
        onPress={openEchoesHistory}
        chevron="forward"
        accessibilityLabel="Echoes履歴を開く"
      />

      <View style={{ marginTop: 12 }}>
        <MyModelMediumCard
          title="発見履歴"
          description="発見したReflectionの履歴を確認します"
          onPress={openDiscoveriesHistory}
          chevron="forward"
          accessibilityLabel="Discoveries履歴を開く"
        />
      </View>
    </MyModelMenuScroll>
  );
}
