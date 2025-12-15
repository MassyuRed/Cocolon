import Ionicons from "react-native-vector-icons/Ionicons";
import React, { useState, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// Supabase Auth
import { supabase } from "../lib/supabase";

// テーマ
import { useTheme } from "../theme/ThemeContext";

// MashOS Emotion Submit API
// ※ 現在は MashOS を Render 上で稼働させているため、
//   開発ビルド / 本番ビルドを問わず同じクラウド URL を利用する。
//   （ローカル API に戻したい場合はここを書き換える）

const EMOTION_API_BASE_URL = "https://mashos-api.onrender.com";
const EMOTION_SUBMIT_URL = `${EMOTION_API_BASE_URL}/emotion/submit`;

// パネル高さ（他画面と同じルールで調整可能）
const PANEL_MIN_HEIGHT = 690;

// 強度→数値（分析用）。UIには使わない
const STRENGTH_SCORE = Object.freeze({ weak: 1, medium: 2, strong: 3 });

// 感情ボタンの配置（2段構成：平穏は悲しみの下、右端は空き）
const EMOTION_ROWS = [
  ["喜び", "悲しみ", "怒り"],
  ["不安", "平穏", null],
];

/**
 * Home（InputScreen）
 * - 背景・パネル・ボタンなどを ThemeContext から取得
 */
export default function InputScreen({ navigation }) {
  const { colors, themeName } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [memo, setMemo] = useState("");
  const [isSecret, setIsSecret] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = selectedEmotions.length > 0 && !submitting;
  const isDark = themeName === "dark";

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

  const handleOk = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      // 0) Supabase Auth から現在のセッション（JWT）を取得
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.warn("getSession error:", sessionError);
      }

      const accessToken = session?.access_token;
      if (!accessToken) {
        console.warn(
          "No access token. Emotion submit will be unauthenticated."
        );
      }

      // 1) 入力内容を MashOS Emotion Submit API 用のペイロードに変換
      const emotionDetails = selectedEmotions.map((e) => ({
        type: e.type,
        strength: e.strength,
      }));
      const createdAt = new Date().toISOString();

      const payload = {
        emotions: emotionDetails,
        memo,
        created_at: createdAt,
        is_secret: isSecret,
      };

      const headers = {
        "Content-Type": "application/json",
      };
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const res = await fetch(EMOTION_SUBMIT_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Emotion submit error:", res.status, text);
        Alert.alert(
          "保存エラー",
          "感情の保存に失敗しました。しばらくしてからもう一度試してください。"
        );
        return;
      }

      const data = await res.json();
      console.log("Emotion submit success:", data);

      // 送信が成功したら、入力状態をリセットし、完了メッセージを表示する
      setSelectedEmotions([]);
      setMemo("");
      setIsSecret(false);
      Keyboard.dismiss();
      Alert.alert("入力完了", "入力が完了しました。");
    } catch (error) {
      console.error("入力処理エラー:", error);
      Alert.alert(
        "エラー",
        `入力の保存処理に失敗しました。
${String(error?.message || error)}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePressNotifications = () => {
    Alert.alert("お知らせ", "ここにお知らせ一覧を表示（実装予定）");
  };

  const handlePressAccount = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate("Account");
    } else {
      Alert.alert(
        "アカウント",
        "アカウント画面へのナビゲーションがまだ設定されていません。"
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ブランドヘッダー（全画面共通） */}
            <View style={styles.appTitleWrapper}>
              <Text style={styles.appTitleText}>Emlis</Text>
              <Text style={styles.appSubtitleText}>
                ～Emotion Limbic Internal Structure～
              </Text>
            </View>

            {/* メインパネル（MyModelと同じレイアウトパターン） */}
            <View style={styles.panel}>
              {/* パネルヘッダー */}
              <View style={styles.panelHeader}>
                <Text style={styles.panelTitle}>Home</Text>
                <View style={styles.headerRight}>
                  <TouchableOpacity
                    style={styles.accountIconButton}
                    onPress={handlePressAccount}
                    activeOpacity={0.9}
                    accessibilityLabel="アカウントページを開く"
                  >
                    <Ionicons
                      name="person-circle-outline"
                      size={22}
                      color={colors.TEXT_ON_LIGHT}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.noticePill}
                    onPress={handlePressNotifications}
                    activeOpacity={0.85}
                    accessibilityLabel="お知らせを開く"
                  >
                    <Ionicons
                      name="notifications-outline"
                      size={18}
                      color={colors.TEXT_ON_LIGHT}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* 「今の気持ちを入力」エリア */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>今の気持ちを入力</Text>

                {/* 感情ボタン群（2段レイアウト） */}
                <View style={styles.buttons}>
                  {EMOTION_ROWS.map((row, rowIndex) => (
                    <View key={`row-${rowIndex}`} style={styles.emotionRow}>
                      {row.map((cat, colIndex) => {
                        if (!cat) {
                          // 右端の空きスペース用ダミー
                          return (
                            <View
                              key={`empty-${rowIndex}-${colIndex}`}
                              style={styles.emotionBlock}
                            />
                          );
                        }
                        const emotion = selectedEmotions.find(
                          (e) => e.type === cat
                        );
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
                                color={
                                  on ? colors.ACCENT_TEXT : colors.TEXT_SUBTLE
                                }
                                style={{ marginRight: 4 }}
                              />
                              <Text
                                style={[
                                  styles.chipText,
                                  on && styles.chipTextOn,
                                ]}
                              >
                                {cat}
                              </Text>
                            </TouchableOpacity>

                            {/* 高さは固定して中身だけ出し入れ */}
                            <View style={styles.strengthRow}>
                              {on &&
                                ["weak", "medium", "strong"].map((s) => (
                                  <TouchableOpacity
                                    key={s}
                                    onPress={() => changeStrength(cat, s)}
                                    style={[
                                      styles.strengthChip,
                                      emotion?.strength === s &&
                                        styles.strengthChipOn,
                                    ]}
                                    activeOpacity={0.8}
                                  >
                                    <Text
                                      style={[
                                        styles.strengthText,
                                        emotion?.strength === s &&
                                          styles.strengthTextOn,
                                      ]}
                                    >
                                      {{
                                        weak: "弱",
                                        medium: "中",
                                        strong: "強",
                                      }[s]}
                                    </Text>
                                  </TouchableOpacity>
                                ))}
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </View>

              {/* メモ入力（カードスタイル） */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>メモ</Text>
                <View style={styles.memoCard}>
                  <TextInput
                    style={styles.memoInput}
                    placeholder="自由に書いてみましょう"
                    value={memo}
                    onChangeText={setMemo}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    placeholderTextColor={colors.TEXT_SUBTLE}
                  />
                </View>
                <TouchableOpacity
                  style={[
                    styles.secretToggle,
                    isSecret && styles.secretToggleOn,
                  ]}
                  onPress={() => setIsSecret((v) => !v)}
                  activeOpacity={0.85}
                  accessibilityLabel="シークレット設定を切り替える"
                >
                  <Ionicons
                    name={
                      isSecret ? "lock-closed-outline" : "lock-open-outline"
                    }
                    size={16}
                    color={
                      isSecret ? colors.ACCENT_TEXT : colors.TEXT_SUBTLE
                    }
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.secretToggleText,
                      isSecret && styles.secretToggleTextOn,
                    ]}
                  >
                    {isSecret ? "シークレット：ON" : "シークレット：OFF"}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.secretHint}>
                  ※シークレットONのメモは、他ユーザーのMyProfile照会には反映されません。
                </Text>

              </View>

              {/* 送信ボタン（goldButton スタイル） */}
              <View style={styles.buttonWrapper}>
                <TouchableOpacity
                  style={[
                    styles.goldButton,
                    !canSubmit && styles.goldButtonDisabled,
                  ]}
                  activeOpacity={0.9}
                  onPress={handleOk}
                  disabled={!canSubmit}
                >
                  {submitting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.goldButtonText}>この内容でOK</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(COLORS) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.BG_SILVER,
    },
    scrollContainer: {
      paddingTop: 16,
      paddingBottom: 32,
      alignItems: "center",
    },

    /** ブランドヘッダー */
    appTitleWrapper: {
      alignItems: "center",
      marginBottom: 14,
    },
    appTitleText: {
      fontFamily: "CormorantGaramond-Bold",
      fontSize: 24,
      color: COLORS.BRAND_GOLD,
      letterSpacing: 1.2,
    },
    appSubtitleText: {
      fontFamily: "CormorantGaramond-Regular",
      marginTop: 4,
      fontSize: 11,
      color: COLORS.BRAND_GOLD,
      letterSpacing: 0.8,
    },

    /** メインパネル（MyModel共通） */
    panel: {
      width: "94%",
      minHeight: PANEL_MIN_HEIGHT,
      backgroundColor: COLORS.PANEL_BG,
      borderRadius: 26,
      borderWidth: 2,
      borderColor: COLORS.BORDER_GOLD,
      paddingHorizontal: 18,
      paddingVertical: 20,
      shadowColor: "#000",
      shadowOpacity: 0.24,
      shadowRadius: 26,
      shadowOffset: { width: 0, height: 16 },
      elevation: 12,
    },
    panelHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    panelTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      letterSpacing: 0.8,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    accountIconButton: {
      marginRight: 8,
      paddingHorizontal: 6,
      paddingVertical: 4,
    },
    noticePill: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },

    /** セクション共通 */
    section: {
      marginBottom: 18,
    },
    sectionLabel: {
      fontSize: 12,
      color: COLORS.TEXT_SUBTLE,
      marginBottom: 8,
    },

    /** 感情ボタン */
    buttons: {
      marginTop: 2,
    },
    emotionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    emotionBlock: {
      width: "30%",
      alignItems: "center",
    },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 14,
      marginBottom: 4,
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    chipOn: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    chipText: {
      fontSize: 14,
      color: COLORS.TEXT_ON_LIGHT,
    },
    // アクティブ時は ACCENT_TEXT（＝白）で塗る
    chipTextOn: {
      color: COLORS.ACCENT_TEXT,
      fontWeight: "600",
    },

    /** 感情強度（高さ固定） */
    strengthRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 2,
      height: 28,
    },
    strengthChip: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      marginHorizontal: 2,
      borderRadius: 10,
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
    },
    strengthChipOn: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    strengthText: {
      fontSize: 12,
      color: COLORS.TEXT_ON_LIGHT,
    },
    strengthTextOn: {
      color: COLORS.ACCENT_TEXT,
      fontWeight: "600",
    },

    /** メモ入力カード（高さを伸ばしてパネル下端をMyModelと揃える） */
    memoCard: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 12,
      paddingVertical: 10,
      minHeight: 280,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    memoInput: {
      flex: 1,
      minHeight: 90,
      fontSize: 14,
      color: COLORS.TEXT_ON_LIGHT,
    },


    /** シークレット */
    secretToggle: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      marginTop: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    secretToggleOn: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    secretToggleText: {
      fontSize: 12,
      color: COLORS.TEXT_SUBTLE,
      fontWeight: "600",
    },
    secretToggleTextOn: {
      color: COLORS.ACCENT_TEXT,
    },
    secretHint: {
      marginTop: 6,
      fontSize: 11,
      lineHeight: 16,
      color: COLORS.TEXT_SUBTLE,
    },
    /** goldButton（共通） */
    buttonWrapper: {
      marginTop: 8,
      alignItems: "center",
    },
    goldButton: {
      paddingVertical: 13,
      paddingHorizontal: 28,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOpacity: 0.22,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 7 },
      elevation: 9,
    },
    goldButtonText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 15,
    },
    goldButtonDisabled: {
      opacity: 0.5,
      shadowOpacity: 0.05,
    },
  });
}

