import React from "react";
import { Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import PieceScreenIntro from "../piece/PieceScreenIntro";
import CocolonPressable from "../../components/CocolonPressable";

export default function NexusHeader({
  titleRef,
  styles,
  colors,
  ui,
  isTutorialMode,
  viewerUserId,
  canReadOwnPieces,
  handleOpenOwnerHistory,
  handleOpenFollowList,
  onRefresh,
}) {
  return (
    <View>
      <View style={styles.panelHeaderActions}>
        {!isTutorialMode ? (
          <CocolonPressable
            style={[
              styles.refreshButton,
              styles.followListButton,
              !viewerUserId && styles.headerButtonDisabled,
            ]}
            onPress={handleOpenFollowList}
            disabled={!viewerUserId}
            accessibilityLabel="自分のフォローリストを開く"
          >
            <Ionicons
              name="people-outline"
              size={18}
              color={colors.TEXT_ON_LIGHT}
            />
          </CocolonPressable>
        ) : null}
        <CocolonPressable
          style={styles.refreshButton}
          onPress={onRefresh}
          accessibilityLabel="ピースを再読み込みする"
        >
          <Ionicons
            name="refresh-outline"
            size={18}
            color={colors.TEXT_ON_LIGHT}
          />
        </CocolonPressable>
      </View>
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
