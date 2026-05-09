import React from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { readShareCode } from "../../lib/compat/legacyWireContracts";

export default function PieceRecommendModal({
  visible,
  styles,
  colors,
  users,
  loading,
  error,
  onClose,
  onRefresh,
  onOpenAccount,
}) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>おすすめ</Text>
            <View style={styles.headerRight}>
              <Pressable onPress={onRefresh} style={styles.recoRefreshBtn}>
                <Ionicons name="refresh" size={16} color={colors.TITLE_GOLD} />
              </Pressable>

              <Pressable onPress={onClose} style={[styles.modalCloseBtn, { marginLeft: 8 }]}>
                <Ionicons name="close" size={18} color={colors.TEXT_ON_LIGHT} />
              </Pressable>
            </View>
          </View>

          <ScrollView style={styles.listArea}>
            <Text style={styles.recoSectionLabel}>アクティブユーザー</Text>

            {loading ? (
              <View style={styles.recoLoadingRow}>
                <ActivityIndicator color={colors.TEXT_SUBTLE} />
                <Text style={styles.recoLoadingText}>読み込み中…</Text>
              </View>
            ) : (users || []).length > 0 ? (
              <View style={{ marginTop: 8 }}>
                {(users || []).map((u) => {
                  const uid = u?.id || u?.user_id || u?.userId;
                  const name = String(u?.display_name || "").trim() || "（未設定）";
                  const handle = String(readShareCode(u, "") || "").trim();
                  return (
                    <Pressable
                      key={String(uid || Math.random())}
                      onPress={() => onOpenAccount(uid)}
                      style={styles.recoUserRow}
                    >
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text style={styles.recoUserName} numberOfLines={1}>{name}</Text>
                        <Text style={styles.recoUserSub} numberOfLines={1}>
                          {handle ? `@${handle}` : " "}
                        </Text>
                      </View>

                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={colors.TEXT_SUBTLE}
                        style={{ marginLeft: 10 }}
                      />
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <Text style={styles.recoEmptyText}>
                {error ? `取得に失敗: ${error}` : "候補ユーザーがいません。"}
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
