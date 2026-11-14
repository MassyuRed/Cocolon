import React, { useCallback } from "react";
import { Alert, View } from "react-native";

import { useTutorial } from "../TutorialContext";
import { useAppRuntime } from "../AppRuntimeContext";
import {
  PieceDescription,
  PieceMediumCard,
  PieceMenuScroll,
  PieceSubHeader,
} from "./PieceMenuCommon";

export default function PieceHistoryMenuScreen({ navigation }) {
  const { isTutorialMode } = useTutorial();
  const { isFeatureEnabled } = useAppRuntime();
  const canReadOwnPieces = !isTutorialMode && isFeatureEnabled('piece_v2_owner_read_enabled', false);

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
      navigation?.navigate?.("Piece");
    } catch {
      // noop
    }
  }, [navigation]);

  const showTutorialHistoryInfo = useCallback(() => {
    Alert.alert(
      "履歴（チュートリアル）",
      "本番では、共鳴したピースの履歴がここに蓄積されます。\n\nチュートリアルでは、まずピースの生成と閲覧の流れを確認してください。"
    );
  }, []);

  const openResonanceHistory = useCallback(() => {
    if (isTutorialMode) {
      showTutorialHistoryInfo();
      return;
    }
    navigation?.navigate?.("ResonanceHistoryList");
  }, [isTutorialMode, navigation, showTutorialHistoryInfo]);

  return (
    <PieceMenuScroll>
      <PieceSubHeader title="履歴" onBack={handleBack} />

      <PieceDescription>
        共鳴したピースの履歴を確認できます。{"\n"}
        履歴を選ぶと、ピースの詳細を確認できます。
      </PieceDescription>

      <PieceMediumCard
        title="共鳴履歴"
        description="共鳴したピースの履歴を確認します"
        onPress={openResonanceHistory}
        chevron="forward"
        accessibilityLabel="共鳴履歴を開く"
      />
      {canReadOwnPieces ? <View style={{ marginTop: 12 }}><PieceMediumCard
        title="自分のPiece"
        description="保存したPieceの本文と公開範囲を確認します"
        onPress={() => navigation?.navigate?.("PieceOwnerHistory", { savedPiece: null })}
        chevron="forward"
        accessibilityLabel="自分のPieceを開く"
      /></View> : null}
    </PieceMenuScroll>
  );
}
