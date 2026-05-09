import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import CocolonPressable from "../../components/CocolonPressable";
import NexusPieceCard from "./NexusPieceCard";
import { HISTORY_ORDER_LATEST, HISTORY_ORDER_OLDEST } from "./nexusRouteModel";
import { resolvePieceQInstanceId, resolvePieceOwnerUserId } from "./nexusHistoryModel";

function NexusHistoryControls({ visible, historyOrder, handleSetHistoryOrder, styles }) {
  if (!visible) return null;
  return (
    <View style={styles.historyControls}>
      <View style={styles.historySortRow}>
        <CocolonPressable
          style={[styles.historySortButton, historyOrder === HISTORY_ORDER_LATEST && styles.historySortButtonActive]}
          onPress={() => handleSetHistoryOrder(HISTORY_ORDER_LATEST)}
          accessibilityLabel="履歴を新しい順で表示する"
        >
          <Text style={[styles.historySortButtonText, historyOrder === HISTORY_ORDER_LATEST && styles.historySortButtonTextActive]}>新しい順</Text>
        </CocolonPressable>
        <CocolonPressable
          style={[styles.historySortButton, styles.historySortButtonSpacer, historyOrder === HISTORY_ORDER_OLDEST && styles.historySortButtonActive]}
          onPress={() => handleSetHistoryOrder(HISTORY_ORDER_OLDEST)}
          accessibilityLabel="履歴を古い順で表示する"
        >
          <Text style={[styles.historySortButtonText, historyOrder === HISTORY_ORDER_OLDEST && styles.historySortButtonTextActive]}>古い順</Text>
        </CocolonPressable>
      </View>
    </View>
  );
}

export default function NexusHistorySection({
  isTutorialMode,
  historyState,
  historyOrder,
  historyLoadedModeKey,
  styles,
  colors,
  handleSetHistoryOrder,
  handleOpenOwner,
  canResonatePiece,
  resonanceSubmittingIds,
  handlePressPieceResonance,
}) {
  const historyOrderLoaded = historyState.order === historyOrder && !!historyState.loadedModes?.[historyLoadedModeKey];
  let content = null;
  if (!historyOrderLoaded) {
    content = <ActivityIndicator style={styles.loader} color={colors.TITLE_GOLD} />;
  } else if (historyState.error && !historyState.resonances.length) {
    content = <Text style={styles.errorText}>{historyState.error}</Text>;
  } else if (!historyState.resonances.length) {
    content = <Text style={styles.emptyText}>共鳴したピースはまだありません。</Text>;
  } else {
    content = historyState.resonances.map((item, index) => {
      const qInstanceId = resolvePieceQInstanceId(item) || `history-${index}`;
      const ownerUserId = resolvePieceOwnerUserId(item);
      return (
        <NexusPieceCard
          key={String(qInstanceId)}
          item={item}
          onPressOwner={() => handleOpenOwner(ownerUserId)}
          canResonate={canResonatePiece(item)}
          resonanceSubmitting={!!resonanceSubmittingIds[qInstanceId]}
          onPressResonance={() => handlePressPieceResonance(item)}
        />
      );
    });
  }
  return (
    <View>
      <NexusHistoryControls visible={!isTutorialMode} historyOrder={historyOrder} handleSetHistoryOrder={handleSetHistoryOrder} styles={styles} />
      {content}
    </View>
  );
}
