import Ionicons from "react-native-vector-icons/Ionicons";
import { BlurView } from "@react-native-community/blur";
import LinearGradient from "react-native-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// ★ パスはあなたの配置に合わせて調整してください
import { supabase } from "../lib/supabase";
import { CURRENT_USER_ID } from "../lib/user";

export default function InputScreen() {
  const navigation = useNavigation();

  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [memo, setMemo] = useState("");
  const [flowerState, setFlowerState] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [inputVisible, setInputVisible] = useState(true);

  const emotions = ["喜び", "悲しみ", "怒り", "不安", "平穏"];
  const strengths = ["weak", "medium", "strong"];
  const strengthLabels = { weak: "弱", medium: "中", strong: "強" };

  // Animations
  const swayAnim = useRef(new Animated.Value(0)).current;
  const breathAnim = useRef(new Animated.Value(1)).current;
  const bloomAnim = useRef(new Animated.Value(0)).current;
  const inputSlideAnim = useRef(new Animated.Value(0)).current;
  const inputOpacityAnim = useRef(new Animated.Value(1)).current;
  const bgColorAnim = useRef(new Animated.Value(0)).current;
  const [bgColors, setBgColors] = useState(["#ffffff", "#ffffff"]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const toggleEmotion = (cat) => {
    setSelectedEmotions((prev) => {
      const exists = prev.find((e) => e.type === cat);
      return exists
        ? prev.filter((e) => e.type !== cat)
        : [...prev, { type: cat, strength: "medium" }];
    });
  };

  const changeStrength = (cat, s) => {
    setSelectedEmotions((prev) =>
      prev.map((e) => (e.type === cat ? { ...e, strength: s } : e))
    );
  };

  const sendToMashOS = async () => {
    try {
      const response = await fetch("http://192.168.40.112:3000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user001",
          baseColor: { mode: "HSL", h: 200, s: 0.5, l: 0.5 },
          date: new Date().toISOString(),
          emotions: selectedEmotions,
          memo,
        }),
      });

      const data = await response.json();
      setFlowerState(data);

      // Supabase 保存
      const { error } = await supabase.from("emotions").insert([
        {
          user_id: CURRENT_USER_ID,
          emotions: selectedEmotions.map((e) => e.type),
          memo,
          flower: data.flower,
        },
      ]);
      if (error) {
        console.error("Supabase保存エラー:", error.message);
        Alert.alert("保存エラー", "データの保存に失敗しました");
      }

      // 背景色アニメーション
      bloomAnim.setValue(0);
      Animated.spring(bloomAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();

      const nextColor =
        data.climate?.weather === "sunny"
          ? "#FFE066"
          : data.climate?.weather === "cloudy"
          ? "#B0BEC5"
          : data.climate?.weather === "rainy"
          ? "#4FC3F7"
          : "#212121";

      setBgColors([bgColors[1], nextColor]);
      bgColorAnim.setValue(0);
      Animated.timing(bgColorAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }).start();
    } catch (error) {
      console.error("API通信エラー:", error);
      Alert.alert("エラー", "MashOS APIと通信できませんでした");
    }
  };

  const toneColor = flowerState?.flower?.toneColor;
  const shape = flowerState?.flower?.shape;
  const animation = flowerState?.flower?.animation;

  useEffect(() => {
    if (!animation) return;
    const { sway, breathAmplitude, bloomSpeed } = animation;

    swayAnim.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(swayAnim, {
          toValue: sway * 10,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(swayAnim, {
          toValue: -sway * 10,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(swayAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    breathAnim.setValue(1);
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1 + breathAmplitude,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: 1 - breathAmplitude,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    bloomAnim.setValue(0.8);
    Animated.timing(bloomAnim, {
      toValue: 1,
      duration: bloomSpeed * 4000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [animation]);

  const toggleInput = () => {
    if (inputVisible) {
      Animated.parallel([
        Animated.timing(inputSlideAnim, {
          toValue: 200,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(inputOpacityAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => setInputVisible(false));
    } else {
      setInputVisible(true);
      inputSlideAnim.setValue(200);
      inputOpacityAnim.setValue(0);
      Animated.parallel([
        Animated.timing(inputSlideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(inputOpacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleOk = async () => {
    await sendToMashOS();
    toggleInput();
  };

  const interpolatedBg = bgColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: bgColors,
  });

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View style={[styles.container, { backgroundColor: interpolatedBg }]}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={toggleInput}
            />

            {/* 🌸 花表示 */}
            <View style={styles.flowerContainer}>
              {[...Array(8)].map((_, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.petal,
                    {
                      backgroundColor: `hsl(${toneColor?.h ?? 200}, ${(toneColor?.s ?? 0.5) * 100}%, ${(toneColor?.l ?? 0.5) * 100}%)`,
                      transform: [
                        { rotate: `${i * 45}deg` },
                        { translateY: -(35 + (shape?.spread ?? 0) * 20) },
                        {
                          rotate: swayAnim.interpolate({
                            inputRange: [-10, 10],
                            outputRange: ["-5deg", "5deg"],
                          }),
                        },
                        { scale: breathAnim },
                        { scale: bloomAnim },
                      ],
                    },
                  ]}
                />
              ))}
              <Animated.View
                style={[
                  styles.center,
                  {
                    backgroundColor: `hsl(${toneColor?.h ?? 200}, ${(toneColor?.s ?? 0.5) * 100}%, ${(toneColor?.l ?? 0.5) * 100}%)`,
                    transform: [{ scale: breathAnim }, { scale: bloomAnim }],
                  },
                ]}
              />
            </View>

            {/* 花畑タブへ遷移 */}
            <TouchableOpacity
              style={styles.gardenButton}
              onPress={() => navigation.navigate("花畑")}
            >
              <Text style={styles.gardenButtonText}>花畑表示</Text>
            </TouchableOpacity>

            {/* 入力UI */}
            {inputVisible && (
              <Animated.View
                style={[
                  styles.inputWrapper,
                  { transform: [{ translateY: inputSlideAnim }], opacity: inputOpacityAnim },
                ]}
              >
                {/* expo-blur の代替：blurType/blurAmount を指定 */}
                <BlurView blurType="light" blurAmount={20} style={styles.blurCard}>
                  <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                  >
                    <Text style={styles.title}>今日の気持ちを入力</Text>

                    <View style={styles.buttons}>
                      {emotions.map((cat) => {
                        const emotion = selectedEmotions.find((e) => e.type === cat);
                        const on = !!emotion;
                        return (
                          <View key={cat} style={styles.emotionBlock}>
                            <TouchableOpacity
                              onPress={() => toggleEmotion(cat)}
                              style={[styles.chip, on && styles.chipOn]}
                              activeOpacity={0.8}
                            >
                              <Ionicons
                                name={
                                  cat === "喜び"
                                    ? "happy-outline"
                                    : cat === "悲しみ"
                                    ? "sad-outline"
                                    : cat === "怒り"
                                    ? "flash-outline"
                                    : cat === "不安"
                                    ? "alert-circle-outline"
                                    : "leaf-outline"
                                }
                                size={16}
                                color={on ? "#fff" : "#374151"}
                                style={{ marginRight: 4 }}
                              />
                              <Text style={[styles.chipText, on && styles.chipTextOn]}>{cat}</Text>
                            </TouchableOpacity>
                            {on && (
                              <View style={styles.strengthRow}>
                                {strengths.map((s) => (
                                  <TouchableOpacity
                                    key={s}
                                    onPress={() => changeStrength(cat, s)}
                                    style={[
                                      styles.strengthChip,
                                      emotion?.strength === s && styles.strengthChipOn,
                                    ]}
                                  >
                                    <Text
                                      style={[
                                        styles.strengthText,
                                        emotion?.strength === s && styles.strengthTextOn,
                                      ]}
                                    >
                                      {strengthLabels[s]}
                                    </Text>
                                  </TouchableOpacity>
                                ))}
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </View>

                    <Text style={styles.memoLabel}>メモ</Text>
                    <TextInput
                      style={styles.memo}
                      placeholder="自由に書いてみましょう"
                      value={memo}
                      onChangeText={setMemo}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                      placeholderTextColor="#9CA3AF"
                    />
                  </ScrollView>
                </BlurView>
              </Animated.View>
            )}

            {inputVisible && !keyboardVisible && (
              <View style={styles.fixedButtonWrapper}>
                <TouchableOpacity style={styles.okButton} activeOpacity={0.9} onPress={handleOk}>
                  <LinearGradient colors={["#6366F1", "#3B82F6"]} style={styles.okButtonGradient}>
                    <Text style={styles.okButtonText}>この内容でOK</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flowerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  petal: { position: "absolute", borderRadius: 20, width: 35, height: 70 },
  center: { width: 35, height: 35, borderRadius: 20 },
  gardenButton: {
    position: "absolute",
    top: 60,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  gardenButtonText: { fontSize: 12, fontWeight: "600", color: "#111" },
  inputWrapper: { position: "absolute", bottom: 0, left: 0, right: 0, height: "70%" },
  blurCard: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  scrollContent: { padding: 20 },
  title: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 16, color: "#111827" },
  buttons: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginBottom: 16 },
  emotionBlock: { width: "30%", alignItems: "center", marginBottom: 12 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
  },
  chipOn: { backgroundColor: "#6366F1" },
  chipText: { fontSize: 14, color: "#111827" },
  chipTextOn: { color: "#fff", fontWeight: "600" },
  strengthRow: { flexDirection: "row", justifyContent: "center", marginTop: 2 },
  strengthChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginHorizontal: 2,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
  },
  strengthChipOn: { backgroundColor: "#3B82F6" },
  strengthText: { fontSize: 12, color: "#111827" },
  strengthTextOn: { color: "#fff", fontWeight: "600" },
  memoLabel: { marginTop: 8, marginBottom: 6, fontSize: 16, fontWeight: "600", color: "#111827" },
  memo: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    fontSize: 14,
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  fixedButtonWrapper: { position: "absolute", bottom: Platform.OS === "ios" ? 80 : 60, left: 16, right: 16 },
  okButton: { borderRadius: 28, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 8 },
  okButtonGradient: { paddingVertical: 16, borderRadius: 28, alignItems: "center" },
  okButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
