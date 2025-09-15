import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

// ★ Supabase のパスは調整してね
import { supabase } from "../lib/supabase";
import { CURRENT_USER_ID } from "../lib/user";

export default function HistoryScreen() {
  const [emotionsData, setEmotionsData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("emotions")
        .select("id, created_at, emotions, memo")
        .eq("user_id", CURRENT_USER_ID)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("履歴取得エラー:", error.message);
      } else {
        setEmotionsData(
          data.map((d) => ({
            id: d.id,
            date: new Date(d.created_at).toLocaleDateString("ja-JP", {
              month: "numeric",
              day: "numeric",
            }),
            emotions: d.emotions || [],
            memo: d.memo || "",
          }))
        );
      }
    };

    fetchHistory();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, marginTop: 40 }}>
      <Text style={styles.sectionTitle}>履歴リスト</Text>
      <FlatList
        data={emotionsData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.emotions}>{item.emotions.join(", ")}</Text>
            {item.memo ? <Text style={styles.memo}>{item.memo}</Text> : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  row: {
    marginBottom: 12,
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  date: { fontWeight: "bold", marginBottom: 4 },
  emotions: { color: "#333" },
  memo: { color: "#555", marginTop: 4, fontStyle: "italic" },
});
