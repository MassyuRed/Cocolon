import React, { useState } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

// ダミーデータ（フレンドの感情履歴）
const dummyEmotions = [
  { id: "1", name: "華恋", emotion: "喜び", strength: "強", time: "5分前" },
  { id: "2", name: "Mash", emotion: "悲しみ", strength: "中", time: "2時間前" },
  { id: "3", name: "I-san", emotion: "怒り", strength: "弱", time: "昨日" },
];

// ダミーデータ（フレンド一覧）
const dummyFriends = [
  { id: "1", name: "華恋" },
  { id: "2", name: "Mash" },
  { id: "3", name: "I-san" },
];

export default function FriendsScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.emotion}>
        {item.emotion}（{item.strength}）
      </Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.title}>フレンド</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="people-circle-outline" size={30} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {/* フレンドの感情入力履歴 */}
      <View style={styles.scaleWrapper}>
        <FlatList
          data={dummyEmotions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.list}
        />
      </View>

      {/* フレンド一覧モーダル */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>フレンド一覧</Text>
            {dummyFriends.map((f) => (
              <Text key={f.id} style={styles.friendName}>
                {f.name}
              </Text>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#111827" },
  scaleWrapper: { transform: [{ scale: 0.9 }], width: "100%", flex: 1 },
  list: { flex: 1 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  name: { fontWeight: "600", color: "#374151", fontSize: 15 },
  emotion: { color: "#4B5563", fontSize: 15 },
  time: { color: "#9CA3AF", fontSize: 12 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  friendName: { fontSize: 16, marginVertical: 4 },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#6366F1",
    borderRadius: 8,
  },
  closeButtonText: { color: "#fff", fontWeight: "600" },
});

