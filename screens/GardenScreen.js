import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// ★ supabase の相対パスは必要に応じて調整してください
import { supabase } from "../lib/supabase";
import { CURRENT_USER_ID } from "../lib/user";

const { width, height } = Dimensions.get("window");

export default function GardenScreen() {
  const navigation = useNavigation();
  const [flowers, setFlowers] = useState([]);

  useEffect(() => {
    const fetchFlowers = async () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      const { data, error } = await supabase
        .from("emotions")
        .select("id, created_at, flower")
        .eq("user_id", CURRENT_USER_ID)
        .gte("created_at", start.toISOString())
        .lt("created_at", end.toISOString())
        .order("created_at", { ascending: true });

      if (error) {
        console.error("取得エラー:", error.message);
      } else {
        setFlowers(data);
      }
    };

    fetchFlowers();
  }, []);

  return (
    <View style={styles.container}>
      {/* 戻るボタン */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>戻る</Text>
      </TouchableOpacity>

      <Text style={styles.title}>今月の花畑</Text>
      <View style={styles.flowerContainer}>
        {flowers.map((f) => (
          <View key={f.id} style={styles.flowerWrapper}>
            <Flower flowerData={f.flower} />
            <Text style={styles.dateText}>
              {new Date(f.created_at).getDate()}日
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// 花サイズ
const flowerSize = width / 8;

// Flowerコンポーネント（DBのtoneColorを使用）
const Flower = ({ flowerData }) => {
  if (!flowerData) return null;

  const toneColor = flowerData.toneColor || { h: 200, s: 0.5, l: 0.5 };

  return (
    <View style={styles.flower}>
      {[...Array(5)].map((_, i) => (
        <View
          key={i}
          style={[
            styles.petal,
            {
              backgroundColor: `hsl(${toneColor.h}, ${
                toneColor.s * 100
              }%, ${toneColor.l * 100}%)`,
              transform: [{ rotate: `${i * 72}deg` }],
            },
          ]}
        />
      ))}
      <View
        style={[
          styles.center,
          {
            backgroundColor: `hsl(${toneColor.h}, ${
              toneColor.s * 100
            }%, ${toneColor.l * 100}%)`,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 12,
    color: "#333",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 120,
    marginBottom: 20,
  },
  flowerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: width * 0.95,
  },
  flowerWrapper: {
    alignItems: "center",
    marginVertical: height / 150,
    width: width / 4.5,
  },
  flower: {
    width: flowerSize,
    height: flowerSize,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  petal: {
    position: "absolute",
    width: flowerSize * 0.6,
    height: flowerSize * 0.9,
    borderRadius: flowerSize / 2,
  },
  center: {
    width: flowerSize * 0.4,
    height: flowerSize * 0.4,
    borderRadius: flowerSize / 2,
    position: "absolute",
  },
  dateText: {
    fontSize: 9,
    marginTop: 3,
    color: "#333",
  },
});
