import Ionicons from "react-native-vector-icons/Ionicons";
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
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
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from "react-native";

// Supabase Auth
import { supabase } from "../lib/supabase";

// テーマ
import { useTheme } from "../theme/ThemeContext";

import { useUnread } from "../UnreadContext";

// UI (Design System)
import CocolonButton from "../components/CocolonButton";
import CocolonPressable from "../components/CocolonPressable";
import CocolonSwitch from "../components/CocolonSwitch";
import { makeUiTokens } from "../ui/uiTokens";

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

const SELF_INSIGHT = "自己理解";

// 感情ボタンの配置（2段構成：平穏は悲しみの下、右端は自己理解）
const EMOTION_ROWS = [
  ["喜び", "悲しみ", "怒り"],
  ["不安", "平穏", SELF_INSIGHT],
];

/**
 * Home（InputScreen）
 * - 背景・パネル・ボタンなどを ThemeContext から取得
 */
export default function InputScreen({ navigation }) {
  const { colors, themeName } = useTheme();
  const { setUnread } = useUnread();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);

  const isIOS = Platform.OS === "ios";

  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [memo, setMemo] = useState("");
  const [memoAction, setMemoAction] = useState("");
  // 展開式入力（タップで開く）
  const [activeField, setActiveField] = useState(null); // "memo" | "memoAction" | null
  const memoInputRef = useRef(null);
  const memoActionInputRef = useRef(null);
  const [memoContentHeight, setMemoContentHeight] = useState(44);
  const [memoActionContentHeight, setMemoActionContentHeight] = useState(44);

  const [isSecret, setIsSecret] = useState(false);
  const [sendFriendNotification, setSendFriendNotification] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [keyboardInset, setKeyboardInset] = useState(0);

  const { height: windowHeight } = useWindowDimensions();

  // 入力欄はできるだけ伸ばしつつ、一定以上は TextInput 内スクロールに切り替える
  const inputMaxHeight = useMemo(() => {
    const h = windowHeight || 0;
    if (!h) return 520;

    // キーボード表示中は、画面に収まる範囲を優先して上限を決める（それ以上は TextInput 内でスクロール）
    if (keyboardInset > 0) {
      const remaining = h - keyboardInset;
      return Math.max(160, Math.floor(remaining - 60));
    }

    // キーボード未表示時は、画面の大半まで伸ばせるようにする
    return Math.max(260, Math.floor(h * 0.75));
  }, [windowHeight, keyboardInset]);


  // メモ入力がキーボードに隠れないようにスクロール追従
  const scrollRef = useRef(null);
  const memoFocusedRef = useRef(false);
  const focusedFieldRef = useRef(null); // "memo" | "memoAction" | null
  const lastFocusTargetRef = useRef(null);

  const scrollToFocusedInput = useCallback((extraOffset = 110) => {
    const sv = scrollRef.current;
    const target = lastFocusTargetRef.current;
    if (!sv || !target) return;
    try {
      sv.scrollResponderScrollNativeHandleToKeyboard(target, extraOffset, true);
    } catch {
      // noop
    }
  }, []);

  const openField = (field) => {
    setActiveField(field);
    // state反映後に focus する（render完了を待つ）
    setTimeout(() => {
      try {
        if (field === "memo") memoInputRef.current?.focus?.();
        if (field === "memoAction") memoActionInputRef.current?.focus?.();
      } catch {
        // noop
      }
    }, 50);
  };


  useEffect(() => {
    const showEvt =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e) => {
      const h = e?.endCoordinates?.height ?? 0;
      setKeyboardInset(h);
      requestAnimationFrame(() => {
        scrollToFocusedInput();
      });
    };

    const onHide = () => {
      setKeyboardInset(0);
    };

    const subShow = Keyboard.addListener(showEvt, onShow);
    const subHide = Keyboard.addListener(hideEvt, onHide);

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, [scrollToFocusedInput]);

  const doNotNotifyFriends = !sendFriendNotification;

  const canSubmit = selectedEmotions.length > 0 && !submitting;
  const isDark = themeName === "dark";

  const isSelfInsightSelected = selectedEmotions.some(
    (e) => e.type === SELF_INSIGHT
  );

  const toggleEmotion = (cat) => {
    setSelectedEmotions((prev) => {
      // 「自己理解」は単独選択（他の感情をクリアして選択）
      if (cat === SELF_INSIGHT) {
        const exists = prev.find((e) => e.type === SELF_INSIGHT);
        return exists
          ? prev.filter((e) => e.type !== SELF_INSIGHT)
          : [{ type: SELF_INSIGHT, strength: "medium" }];
      }

      // 「自己理解」選択中は他の感情を押せない
      if (prev.some((e) => e.type === SELF_INSIGHT)) {
        return prev;
      }

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
        notify_friends: sendFriendNotification,
      };

      if (memoAction && memoAction.trim().length > 0) {
        payload.memo_action = memoAction;
      }

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

      console.log("Emotion submit accepted:", res.status);


      // 送信が成功したら、入力状態をリセットし、完了メッセージを表示する
      setSelectedEmotions([]);
      setMemo("");
      setMemoAction("");
      setActiveField(null);
      setMemoContentHeight(44);
      setMemoActionContentHeight(44);
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
    // 将来：お知らせ一覧を実装したら、既読化したタイミングで setUnread("Input", "notifications", false) を呼ぶ
    try {
      setUnread("Input", "notifications", false);
    } catch {
      // noop
    }
    Alert.alert("お知らせ", "ここにお知らせ一覧を表示（実装予定）");
  };

  const handlePressGuide = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate("CocolonGuide", { screenId: "home" });
    } else {
      Alert.alert("ガイド", "ガイド画面へのナビゲーションがまだ設定されていません。");
    }
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
            ref={scrollRef}
            contentContainerStyle={[
              styles.scrollContainer,
              { paddingBottom: 32 + keyboardInset },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
{/* パネルヘッダー */}
              <View style={styles.panelHeader}>
                <View style={styles.panelTitleRow}>
                  <Text style={styles.panelTitle}>Home</Text>
                  <CocolonPressable
                    style={styles.guideTitleButton}
                    onPress={handlePressGuide}
                    accessibilityLabel="ガイドを開く"
                  >
                    <Ionicons
                      name="help-circle-outline"
                      size={20}
                      color={colors.TEXT_ON_LIGHT}
                    />
                  </CocolonPressable>
                </View>

                <View style={styles.headerRight}>
                  <CocolonPressable
                    style={styles.accountIconButton}
                    onPress={handlePressAccount}
                    accessibilityLabel="アカウントページを開く"
                  >
                    <Ionicons
                      name="person-circle-outline"
                      size={20}
                      color={colors.TEXT_ON_LIGHT}
                    />
                  </CocolonPressable>
                  <CocolonPressable
                    style={styles.noticePill}
                    onPress={handlePressNotifications}
                    accessibilityLabel="お知らせを開く"
                  >
                    <Ionicons
                      name="notifications-outline"
                      size={20}
                      color={colors.TEXT_ON_LIGHT}
                    />
                  </CocolonPressable>
                </View>
              </View>

              {/* 「今の気持ちを入力」エリア */}
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { fontWeight: "700" }]}>感情を選択</Text>

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
                        const isDisabled =
                          isSelfInsightSelected && cat !== SELF_INSIGHT;
                        return (
                          <View key={cat} style={styles.emotionBlock}>
                            <CocolonPressable
                              onPress={() => toggleEmotion(cat)}
                              disabled={isDisabled}
                              style={[
                                styles.chip,
                                on && styles.chipOn,
                                isDisabled && { opacity: 0.45 },
                              ]}
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
                                    : cat === SELF_INSIGHT
                                    ? "bulb-outline"
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
                            </CocolonPressable>

                            {/* 高さは固定して中身だけ出し入れ */}
                            <View style={styles.strengthRow}>
                              {on &&
                                cat !== SELF_INSIGHT &&
                                ["weak", "medium", "strong"].map((s) => (
                                  <CocolonPressable
                                    key={s}
                                    onPress={() => changeStrength(cat, s)}
                                    style={[
                                      styles.strengthChip,
                                      emotion?.strength === s &&
                                        styles.strengthChipOn,
                                    ]}
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
                                  </CocolonPressable>
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
                <Text style={[styles.sectionLabel, { fontWeight: "700" }]}>思考内容（自己世界の出来事）：{"\n"}何を思った／どう感じた／どう解釈した？</Text>
                {activeField === "memo" ? (
                  <View style={[styles.memoCard, styles.memoCardExpanded]}>
                    <TextInput
                      ref={memoInputRef}
                      style={[
                        styles.memoInput,
                        {
                          flex: 0,
                          width: "100%",
                          height: Math.min(
                            Math.max(memoContentHeight || 44, 44),
                            inputMaxHeight
                          ),
                        },
                      ]}
                      placeholder="ここに書いてください。"
                      {...(isIOS ? { defaultValue: memo } : { value: memo })}
                      onChangeText={setMemo}
                      {...(isIOS ? { onChange: (e) => setMemo(e?.nativeEvent?.text ?? "") } : {})}
                      multiline
                      scrollEnabled
                      textAlignVertical="top"
                      placeholderTextColor={colors.TEXT_ON_LIGHT}
                      onFocus={(e) => {
                        lastFocusTargetRef.current =
                          e?.target ?? e?.nativeEvent?.target ?? null;
                        memoFocusedRef.current = true;
                        focusedFieldRef.current = "memo";
                        requestAnimationFrame(() => scrollToFocusedInput());
                      }}
                      onBlur={() => {
                        memoFocusedRef.current = false;
                        focusedFieldRef.current = null;
                        lastFocusTargetRef.current = null;
                        setActiveField(null);
                      }}
                      onContentSizeChange={(e) => {
                        const h = e?.nativeEvent?.contentSize?.height ?? 0;
                        if (h) setMemoContentHeight(h);
                        if (focusedFieldRef.current !== "memo") return;
                        // 長文入力時にカーソルが隠れないよう追従
                        requestAnimationFrame(() => scrollToFocusedInput());
                      }}
                    />
                  </View>
                ) : (
                  <CocolonPressable
                    style={[styles.memoCard, styles.memoCardCollapsed]}
                    onPress={() => openField("memo")}
                    accessibilityLabel="思考内容を入力する"
                  >
                    <View style={styles.collapsedRow}>
                      <View style={styles.collapsedLeft}>
                        <Ionicons
                          name="create-outline"
                          size={18}
                          color={colors.TEXT_SUBTLE}
                          style={{ marginRight: 8 }}
                        />
                        <Text
                          style={[
                            styles.collapsedText,
                            !(memo && memo.trim().length > 0) &&
                              styles.collapsedTextPlaceholder,
                          ]}
                          numberOfLines={1}
                        >
                          {memo && memo.trim().length > 0
                            ? memo.replace(/\s+/g, " ").trim()
                            : "ここに書いてください。"}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-down"
                        size={18}
                        color={colors.TEXT_SUBTLE}
                      />
                    </View>
                  </CocolonPressable>
                )}

                <Text style={[styles.sectionLabel, { marginTop: 10, fontWeight: "700" }]}>
                  行動内容（実世界の出来事）：{"\n"}何が起きた／何をした（できなかった）／結果どうなった？
                </Text>
                {activeField === "memoAction" ? (
                  <View style={[styles.memoCard, styles.memoCardExpanded]}>
                    <TextInput
                      ref={memoActionInputRef}
                      style={[
                        styles.memoInput,
                        {
                          flex: 0,
                          width: "100%",
                          height: Math.min(
                            Math.max(memoActionContentHeight || 44, 44),
                            inputMaxHeight
                          ),
                        },
                      ]}
                      placeholder="ここに書いてください。"
                      {...(isIOS ? { defaultValue: memoAction } : { value: memoAction })}
                      onChangeText={setMemoAction}
                      {...(isIOS ? { onChange: (e) => setMemoAction(e?.nativeEvent?.text ?? "") } : {})}
                      multiline
                      scrollEnabled
                      textAlignVertical="top"
                      placeholderTextColor={colors.TEXT_ON_LIGHT}
                      onFocus={(e) => {
                        lastFocusTargetRef.current =
                          e?.target ?? e?.nativeEvent?.target ?? null;
                        memoFocusedRef.current = true;
                        focusedFieldRef.current = "memoAction";
                        requestAnimationFrame(() => scrollToFocusedInput());
                      }}
                      onBlur={() => {
                        memoFocusedRef.current = false;
                        focusedFieldRef.current = null;
                        lastFocusTargetRef.current = null;
                        setActiveField(null);
                      }}
                      onContentSizeChange={(e) => {
                        const h = e?.nativeEvent?.contentSize?.height ?? 0;
                        if (h) setMemoActionContentHeight(h);
                        if (focusedFieldRef.current !== "memoAction") return;
                        // 長文入力時にカーソルが隠れないよう追従
                        requestAnimationFrame(() => scrollToFocusedInput());
                      }}
                    />
                  </View>
                ) : (
                  <CocolonPressable
                    style={[styles.memoCard, styles.memoCardCollapsed]}
                    onPress={() => openField("memoAction")}
                    accessibilityLabel="行動内容を入力する"
                  >
                    <View style={styles.collapsedRow}>
                      <View style={styles.collapsedLeft}>
                        <Ionicons
                          name="walk-outline"
                          size={18}
                          color={colors.TEXT_SUBTLE}
                          style={{ marginRight: 8 }}
                        />
                        <Text
                          style={[
                            styles.collapsedText,
                            !(memoAction && memoAction.trim().length > 0) &&
                              styles.collapsedTextPlaceholder,
                          ]}
                          numberOfLines={1}
                        >
                          {memoAction && memoAction.trim().length > 0
                            ? memoAction.replace(/\s+/g, " ").trim()
                            : "ここに書いてください。"}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-down"
                        size={18}
                        color={colors.TEXT_SUBTLE}
                      />
                    </View>
                  </CocolonPressable>
                )}
                {/* 設定風：文章 + ON/OFF スイッチ */}
                <View style={styles.preferenceCard}>
                  {/* シークレットメモ */}
                  <View style={styles.preferenceRow}>
                    <View style={styles.preferenceLeft}>
                      <Ionicons
                        name={
                          isSecret
                            ? "lock-closed-outline"
                            : "lock-open-outline"
                        }
                        size={18}
                        color={colors.TEXT_SUBTLE}
                        style={styles.preferenceIcon}
                      />
                      <View style={styles.preferenceTextWrap}>
                        <Text style={styles.preferenceTitle}>シークレットメモ</Text>
                        <Text style={styles.preferenceDesc}>
                          オンにするとMyModel照会時に反映されません。{"\n"}分析レポートには反映されます。
                        </Text>
                      </View>
                    </View>
                    <CocolonSwitch
                      value={isSecret}
                      onValueChange={setIsSecret}
                      trackColor={{
                        false: "#D1D5DB",
                        true: colors.GOLD_BUTTON,
                      }}
                      thumbColor={
                        Platform.OS === "android"
                          ? isSecret
                            ? "#FFFFFF"
                            : "#F9FAFB"
                          : undefined
                      }
                      ios_backgroundColor="#D1D5DB"
                      accessibilityLabel="シークレットメモを切り替える"
                    />
                  </View>

                  <View style={styles.preferenceDivider} />

                  {/* フレンド通知（通知しない） */}
                  <View style={styles.preferenceRow}>
                    <View style={styles.preferenceLeft}>
                      <Ionicons
                        name="notifications-outline"
                        size={18}
                        color={colors.TEXT_SUBTLE}
                        style={styles.preferenceIcon}
                      />
                      <View style={styles.preferenceTextWrap}>
                        <Text style={styles.preferenceTitle}>
                          フレンドに通知しない
                        </Text>
                        <Text style={styles.preferenceDesc}>
                          オンにすると入力がフレンドに通知されません。{"\n"}フレンドログにも表示されません。
                        </Text>
                      </View>
                    </View>
                    <CocolonSwitch
                      value={doNotNotifyFriends}
                      onValueChange={(v) => setSendFriendNotification(!v)}
                      trackColor={{
                        false: "#D1D5DB",
                        true: colors.GOLD_BUTTON,
                      }}
                      thumbColor={
                        Platform.OS === "android"
                          ? doNotNotifyFriends
                            ? "#FFFFFF"
                            : "#F9FAFB"
                          : undefined
                      }
                      ios_backgroundColor="#D1D5DB"
                      accessibilityLabel="フレンドに通知しない設定を切り替える"
                    />
                  </View>
                </View>

                <View style={{ paddingHorizontal: 12, paddingTop: 6 }}>
                  <Text style={styles.preferenceDesc}>
                    ※フレンドにメモ内容が送信されることはありません。
                  </Text>
                </View>

              </View>

              {/* 送信ボタン（goldButton スタイル） */}
              <View style={styles.buttonWrapper}>
                <CocolonButton
                  variant="primary"
                  onPress={handleOk}
                  disabled={!canSubmit}
                  loading={submitting}
                  accessibilityLabel="この内容でOK"
                >
                  この内容でOK
                </CocolonButton>
              </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(COLORS, ui) {
  const font = ui?.font || {};
  const text = ui?.text || {};
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.PANEL_BG,
    },
    scrollContainer: {
      paddingTop: 16,
      paddingBottom: 32,
      paddingHorizontal: 18,
      alignItems: "stretch",
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
    panelTitleRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    guideTitleButton: {
      width: 36,
      height: 32,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      marginLeft: 10,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    accountIconButton: {
      width: 42,
      height: 38,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      marginRight: 10,
    },
    noticePill: {
      width: 42,
      height: 38,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
    },

    /** セクション共通 */
    section: {
      marginBottom: 18,
    },
    sectionLabel: {
      fontSize: font.sectionLabel ?? 12,
      color: text.sectionLabel ?? text.primary ?? COLORS.TEXT_ON_LIGHT,
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

    /** メモ入力カード（展開式：タップで開く） */
    memoCard: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 12,
      paddingVertical: 10,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    memoCardCollapsed: {
      minHeight: 54,
      justifyContent: "center",
    },
    memoCardExpanded: {
      minHeight: 120,
    },
    collapsedRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    collapsedLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      paddingRight: 8,
    },
    collapsedText: {
      flex: 1,
      fontSize: 14,
      color: COLORS.TEXT_ON_LIGHT,
    },
    collapsedTextPlaceholder: {
      color: COLORS.TEXT_SUBTLE,
    },
    memoInput: {
      flex: 1,
      minHeight: 90,
      fontSize: 14,
      color: COLORS.TEXT_ON_LIGHT,
    },


    /**
     * 設定風トグル（文章 + ON/OFF）
     * - シークレットメモ（既存機能）
     * - フレンド通知（通知しない設定）
     */
    preferenceCard: {
      marginTop: 18,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      overflow: "hidden",
    },
    preferenceRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    preferenceLeft: {
      flexDirection: "row",
      alignItems: "flex-start",
      flex: 1,
      paddingRight: 12,
    },
    preferenceIcon: {
      marginTop: 2,
      marginRight: 8,
    },
    preferenceTextWrap: {
      flex: 1,
    },
    preferenceTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },
    preferenceDesc: {
      marginTop: 2,
      fontSize: font.description ?? 9,
      lineHeight: 15,
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },
    preferenceDivider: {
      height: 1,
      backgroundColor: COLORS.CARD_BORDER,
      marginLeft: 12,
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
      color: "#374151",
      fontWeight: "600",
    },
    secretToggleTextOn: {
      color: COLORS.ACCENT_TEXT,
    },
    secretHint: {
      marginTop: 6,
      fontSize: 11,
      lineHeight: 16,
      color: "#374151",
    },
    /** goldButton（共通） */
    buttonWrapper: {
      marginTop: 8,
      width: "100%",
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

