import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonPressable from "../../components/CocolonPressable";
import NexusPieceCard from "./NexusPieceCard";
import {
  PIECE_ORDER_LATEST,
  PIECE_ORDER_OLDEST,
} from "./nexusRouteModel";
import {
  resolvePieceQInstanceId,
  resolvePieceOwnerUserId,
} from "./nexusHistoryModel";

function NexusPieceControls({
  visible,
  styles,
  colors,
  ownerOptionsLoading,
  selectedOwnerLabel,
  setOwnerPickerVisible,
  pieceOrder,
  handleSetPieceOrder,
}) {
  if (!visible) return null;

  return (
    <View style={styles.pieceControls}>
      <CocolonPressable
        style={[
          styles.ownerFilterButton,
          ownerOptionsLoading && styles.ownerFilterButtonDisabled,
        ]}
        onPress={() => setOwnerPickerVisible(true)}
        disabled={ownerOptionsLoading}
        accessibilityLabel="表示ユーザーを選択する"
      >
        <View style={styles.ownerFilterButtonContent}>
          <View style={styles.ownerFilterSideSlot} />
          <Text style={styles.ownerFilterButtonText} numberOfLines={1}>
            {selectedOwnerLabel}
          </Text>
          <View style={styles.ownerFilterSideSlot}>
            {ownerOptionsLoading ? (
              <ActivityIndicator size="small" color={colors.TEXT_SUBTLE} />
            ) : (
              <Ionicons
                name="chevron-down-outline"
                size={16}
                color={colors.TEXT_SUBTLE}
              />
            )}
          </View>
        </View>
      </CocolonPressable>

      <View style={styles.pieceSortRow}>
        <CocolonPressable
          style={[
            styles.pieceSortButton,
            pieceOrder === PIECE_ORDER_LATEST && styles.pieceSortButtonActive,
          ]}
          onPress={() => handleSetPieceOrder(PIECE_ORDER_LATEST)}
          accessibilityLabel="新しい順で表示する"
        >
          <Text
            style={[
              styles.pieceSortButtonText,
              pieceOrder === PIECE_ORDER_LATEST && styles.pieceSortButtonTextActive,
            ]}
          >
            新しい順
          </Text>
        </CocolonPressable>
        <CocolonPressable
          style={[
            styles.pieceSortButton,
            styles.pieceSortButtonSpacer,
            pieceOrder === PIECE_ORDER_OLDEST && styles.pieceSortButtonActive,
          ]}
          onPress={() => handleSetPieceOrder(PIECE_ORDER_OLDEST)}
          accessibilityLabel="古い順で表示する"
        >
          <Text
            style={[
              styles.pieceSortButtonText,
              pieceOrder === PIECE_ORDER_OLDEST && styles.pieceSortButtonTextActive,
            ]}
          >
            古い順
          </Text>
        </CocolonPressable>
      </View>
    </View>
  );
}

export default function NexusPieceFeedSection({
  isTutorialMode,
  tutorialPieceItems,
  selfPieceCardRef,
  followedPieceCardRef,
  handleOpenOwner,
  showPieceControls,
  styles,
  colors,
  ownerOptionsLoading,
  selectedOwnerLabel,
  setOwnerPickerVisible,
  pieceOrder,
  handleSetPieceOrder,
  pieceState,
  pieceEmptyText,
  viewerUserId,
  canResonatePiece,
  resonanceSubmittingIds,
  handlePressPieceResonance,
  pieceDeleteSubmittingIds,
  handlePressPieceDelete,
}) {
  if (isTutorialMode) {
    if (!tutorialPieceItems.length) {
      return <Text style={styles.emptyText}>表示できるピースがまだありません。</Text>;
    }
    return tutorialPieceItems.map((item, index) => {
      const tutorialKind = String(item?.tutorial_kind || item?.tutorialKind || "");
      const ownerName = String(item?.owner?.display_name || item?.display_name || "").trim();
      const targetRef =
        tutorialKind === "self" || ownerName === "自分"
          ? selfPieceCardRef
          : tutorialKind === "mock" || ownerName === "User"
          ? followedPieceCardRef
          : index === 0
          ? selfPieceCardRef
          : index === 1
          ? followedPieceCardRef
          : null;

      return (
        <View key={String(item?.q_instance_id || `tutorial-piece-${index}`)} ref={targetRef} collapsable={false}>
          <NexusPieceCard item={item} onPressOwner={() => handleOpenOwner(item?.owner?.user_id)} />
        </View>
      );
    });
  }

  let content = null;
  if (pieceState.loading) {
    content = <ActivityIndicator style={styles.loader} color={colors.TITLE_GOLD} />;
  } else if (pieceState.error) {
    content = <Text style={styles.errorText}>{pieceState.error}</Text>;
  } else if (!Array.isArray(pieceState.items) || pieceState.items.length <= 0) {
    content = <Text style={styles.emptyText}>{pieceEmptyText}</Text>;
  } else {
    content = pieceState.items.map((item) => {
      const qInstanceId = resolvePieceQInstanceId(item);
      const ownerUserId = resolvePieceOwnerUserId(item);
      const canDeletePiece = !!qInstanceId && !!viewerUserId && ownerUserId === viewerUserId;
      return (
        <NexusPieceCard
          key={String(qInstanceId || Math.random())}
          item={item}
          onPressOwner={() => handleOpenOwner(item?.owner?.user_id)}
          canResonate={canResonatePiece(item)}
          resonanceSubmitting={!!resonanceSubmittingIds[qInstanceId]}
          onPressResonance={() => handlePressPieceResonance(item)}
          canDelete={canDeletePiece}
          deleteSubmitting={!!pieceDeleteSubmittingIds[qInstanceId]}
          onPressDelete={() => handlePressPieceDelete(item)}
        />
      );
    });
  }

  return (
    <View>
      <NexusPieceControls
        visible={showPieceControls}
        styles={styles}
        colors={colors}
        ownerOptionsLoading={ownerOptionsLoading}
        selectedOwnerLabel={selectedOwnerLabel}
        setOwnerPickerVisible={setOwnerPickerVisible}
        pieceOrder={pieceOrder}
        handleSetPieceOrder={handleSetPieceOrder}
      />
      {content}
    </View>
  );
}
