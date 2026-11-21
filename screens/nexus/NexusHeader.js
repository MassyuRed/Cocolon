import React from "react";
import { Text, View } from "react-native";

import PieceScreenIntro from "../piece/PieceScreenIntro";
import CocolonPressable from "../../components/CocolonPressable";

export default function NexusHeader({
  titleRef,
  styles,
  colors,
  ui,
  canReadOwnPieces,
  handleOpenOwnerHistory,
}) {
  return (
    <View>
      <PieceScreenIntro titleRef={titleRef} colors={colors} ui={ui} />
      {canReadOwnPieces ? (
        <CocolonPressable
          style={styles.ownerHistoryButton}
          onPress={handleOpenOwnerHistory}
          accessibilityLabel="自分のピースを開く"
        >
          <Text style={styles.ownerHistoryButtonText}>自分のピースを開く</Text>
        </CocolonPressable>
      ) : null}
    </View>
  );
}
