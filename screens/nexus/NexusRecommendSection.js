import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

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
          <CocolonPressable key={user.id} style={[styles.simpleCard, { flexDirection: 'row', alignItems: 'center', gap: 12 }]} onPress={() => handleOpenOwner(user.id)} accessibilityLabel={`${user.displayName}のアカウントを開く`}>
            <View style={[styles.simpleCardHeader, { flex: 1, minWidth: 0 }]}>
              <Text style={styles.simpleCardTitle}>{user.displayName}</Text>
              {user.shareCode ? <Text style={styles.simpleCardMeta}>{user.shareCode}</Text> : null}
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.TEXT_SUBTLE} />
          </CocolonPressable>
        ))
      )}
    </View>
  );
}
