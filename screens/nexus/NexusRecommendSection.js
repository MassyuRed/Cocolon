import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import CocolonPressable from "../../components/CocolonPressable";

export default function NexusRecommendSection({ recommendState, styles, colors, handleOpenOwner }) {
  if (recommendState.loading) {
    return <ActivityIndicator style={styles.loader} color={colors.TITLE_GOLD} />;
  }
  if (recommendState.error) {
    return <Text style={styles.errorText}>{recommendState.error}</Text>;
  }
  return (
    <View>
      <Text style={styles.subsectionTitle}>おすすめユーザー</Text>
      {recommendState.users.length <= 0 ? (
        <Text style={styles.emptyText}>おすすめユーザーはまだありません。</Text>
      ) : (
        recommendState.users.map((user) => (
          <CocolonPressable key={user.id} style={styles.simpleCard} onPress={() => handleOpenOwner(user.id)}>
            <View style={styles.simpleCardHeader}>
              <Text style={styles.simpleCardTitle}>{user.displayName}</Text>
              {user.shareCode ? <Text style={styles.simpleCardMeta}>{user.shareCode}</Text> : null}
            </View>
          </CocolonPressable>
        ))
      )}
    </View>
  );
}
