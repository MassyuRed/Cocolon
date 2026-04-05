import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Pressable,
  View,
  Switch,
  useWindowDimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { supabase } from "../lib/supabase";
import { apiFetch } from "../lib/apiClient";

// ---- API base ----
// MyProfile と同様に、まずは Render 上の MashOS API を利用
const API_BASE = "https://mashos-api.onrender.com";
const QUESTIONS_ENDPOINT = `${API_BASE}/deep_insight/questions`;
const ANSWERS_ENDPOINT = `${API_BASE}/deep_insight/answers`;

// パネル高さ（MyProfile 近似）
const PANEL_MIN_HEIGHT = 690;
export default function DeepInsightScreen({ onBack, onOpenSubscription }) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";

  const isIOS = Platform.OS === "ios";

  const navigation = useNavigation();

  // キーボードで入力欄が隠れないように追従スクロール
  const scrollRef = useRef(null);
  const lastFocusTargetRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const { height: windowHeight } = useWindowDimensions();

  // 入力欄はできるだけ伸ばしつつ、一定以上は TextInput 内スクロールに切り替える
  const inputMaxHeight = useMemo(() => {
    const h = windowHeight || 0;
    if (!h) return 520;

    // キーボード表示中は、画面に収まる範囲を優先して上限を決める（それ以上は TextInput 内でスクロール）
    if (keyboardHeight > 0) {
      const remaining = h - keyboardHeight;
      return Math.max(160, Math.floor(remaining - 60));
    }

    // キーボード未表示時は、画面の大半まで伸ばせるようにする
    return Math.max(260, Math.floor(h * 0.75));
  }, [windowHeight, keyboardHeight]);

  const [focusedQuestionId, setFocusedQuestionId] = useState(null);
  const inputRefs = useRef({});
  const [answerHeights, setAnswerHeights] = useState({});
  const INPUT_MIN_HEIGHT = 120;
  const scrollToFocusedInput = useCallback((extraOffset = 110) => {
    const sv = scrollRef.current;
    const target = lastFocusTargetRef.current;
    if (!sv || !target) return;
    try {
      sv.scrollResponderScrollNativeHandleToKeyboard(target, extraOffset, true);
    } catch (e) {
      // noop
    }
  }, []);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e) => {
      const h = e?.endCoordinates?.height ?? 0;
      setKeyboardHeight(h);
      requestAnimationFrame(() => scrollToFocusedInput());
    };

    const onHide = () => setKeyboardHeight(0);

    const subShow = Keyboard.addListener(showEvent, onShow);
    const subHide = Keyboard.addListener(hideEvent, onHide);

    return () => {
      subShow?.remove?.();
      subHide?.remove?.();
    };
  }, [scrollToFocusedInput]);


  const [uiConfig, setUiConfig] = useState(null);

  const openSubscriptionSelect = () => {
    // Prefer callback (if parent provides it)
    if (typeof onOpenSubscription === "function") {
      try {
        onOpenSubscription();
        return;
      } catch (e) {
        // fall through
      }
    }

    // Navigate to SubscriptionSelect (unify paywall CTA behavior)
    try {
      if (navigation && typeof navigation.navigate === "function") {
        navigation.navigate("SubscriptionSelect");
        return;
      }
      const parent = typeof navigation?.getParent === "function" ? navigation.getParent() : null;
      if (parent && typeof parent.navigate === "function") {
        parent.navigate("SubscriptionSelect");
        return;
      }
    } catch (e) {
      // fall through
    }

    // Fallback (if navigation is unavailable)
    const title = String(uiConfig?.strings?.paywall_alert_title || "Plusプランが必要です");
    const body = String(
      uiConfig?.strings?.paywall_alert_text ||
        "現在のプランでは「別の問いを受け取る」は利用できません。\n\nプラン画面をご確認ください。"
    );
    Alert.alert(title, body);
  };

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [secretMap, setSecretMap] = useState({});
  const [submittedMap, setSubmittedMap] = useState({});
  const [canRegenerate, setCanRegenerate] = useState(true);

  const uiStrings = (uiConfig && typeof uiConfig === "object" && uiConfig.strings && typeof uiConfig.strings === "object")
    ? uiConfig.strings
    : {};

  const t = (key, fallback) => {
    const v = uiStrings?.[key];
    return typeof v === "string" && v.trim().length > 0 ? v : fallback;
  };

  const showSecretToggle = uiConfig?.rules?.show_secret_toggle !== false;


  // ✅ Phase5.2: Deep Insight の設定/文面は可能な限り MashOS 側で管理（meta.ui_config）

  async function getAccessToken() {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token ?? null;
  }

  function buildErrorMessage(err) {
    if (!err) return "エラーが発生しました。";
    if (err.name === "AbortError")
      return "接続がタイムアウトしました（ネットワークを確認してください）。";
    const msg = String(err.message || err);
    if (/Network/i.test(msg)) return "サーバーへの接続に失敗しました。";
    return `エラー：${msg}`;
  }

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("ログイン情報の取得に失敗しました（tokenなし）");

      const url = `${QUESTIONS_ENDPOINT}?lang=ja`;
      const res = await apiFetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        let detail = `HTTP ${res.status}`;
        try {
          const j = await res.json();
          if (j && j.detail) detail = j.detail;
        } catch {}
        throw new Error(detail);
      }

      const json = await res.json();
      const qs = Array.isArray(json?.questions) ? json.questions : [];
      setQuestions(qs);
      setCanRegenerate(json?.meta?.can_regenerate !== false);

      // ✅ UI設定（max質問数/深掘り段数/文言/表示ルール）はサーバから受け取る（あれば）
      const serverUiConfig = (json?.meta && typeof json.meta === "object") ? json.meta.ui_config : null;
      if (serverUiConfig && typeof serverUiConfig === "object") {
        setUiConfig(serverUiConfig);
      }

      // 入力欄を初期化（質問が変わる前提）
      const initAnswers = {};
      const initSecret = {};
      for (const q of qs) {
        initAnswers[q.id] = "";
        initSecret[q.id] = false;
      }
      setAnswers(initAnswers);
      setSecretMap(initSecret);
      setSubmittedMap({});
      setFocusedQuestionId(null);
      setAnswerHeights({});
    } catch (e) {
      setError(buildErrorMessage(e));
      setQuestions([]);
      setAnswers({});
      setSecretMap({});
      setSubmittedMap({});
      setFocusedQuestionId(null);
      setAnswerHeights({});
      setCanRegenerate(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  function setAnswerText(questionId, text) {
    setAnswers((prev) => ({ ...prev, [questionId]: text }));
  }

  function toggleSecret(questionId) {
    setSecretMap((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  }

  const canSubmit = useMemo(() => {
    if (loading || submitting) return false;
    const any = questions.some((q) => (answers?.[q.id] || "").trim().length > 0);
    return any;
  }, [loading, submitting, questions, answers]);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("ログイン情報の取得に失敗しました（tokenなし）");

      const payloadAnswers = (questions || [])
        .map((q) => {
          const text = String(answers?.[q.id] || "").trim();
          if (!text) return null;
          return {
            question_id: q.id,
            structure_key: q.structure_key || null,
            text,
            is_secret: !!secretMap?.[q.id],
          };
        })
        .filter(Boolean);

      if (payloadAnswers.length === 0) {
        Alert.alert("送信できません", "回答が空です。");
        return;
      }

      const res = await apiFetch(ANSWERS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ answers: payloadAnswers }),
      });

      if (!res.ok) {
        let detail = `HTTP ${res.status}`;
        try {
          const j = await res.json();
          if (j && j.detail) detail = j.detail;
        } catch {}
        throw new Error(detail);
      }

      // ✅ 文面は可能な限り MashOS 側で管理（meta.ui_message があればそれを優先）
      let okJson = null;
      try {
        okJson = await res.json();
      } catch {
        okJson = null;
      }

      const serverMsg = String(okJson?.meta?.ui_message || "").trim();
      const forbiddenWord = ["A", "S", "T", "O", "R"].join("");
      const hasForbidden = new RegExp(forbiddenWord, "i").test(serverMsg);
      const uiMsg = !hasForbidden && serverMsg ? serverMsg : "回答を受け取りました。";


      // ✅ 送信済みの問いは再入力できないようにロックし、入力内容はクリアする（問いの再取得は行わない）
      const submittedIds = payloadAnswers.map((a) => a.question_id);
      setSubmittedMap((prev) => {
        const next = { ...(prev || {}) };
        for (const id of submittedIds) next[id] = true;
        return next;
      });
      setAnswers((prev) => {
        const next = { ...(prev || {}) };
        for (const id of submittedIds) next[id] = "";
        return next;
      });

      setMessage(uiMsg);
      Alert.alert("送信完了", uiMsg);
    } catch (e) {
      setError(buildErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, questions, answers, secretMap]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.body}
          contentContainerStyle={[
            styles.bodyContent,
            keyboardHeight ? { paddingBottom: 32 + keyboardHeight } : null,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* メインパネル */}
            {/* ヘッダー */}
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>{t("panel_title", "Deep Insight")}</Text>

              <Pressable style={styles.backPill} onPress={onBack}>
                <Ionicons name="chevron-back" size={16} color={colors.TEXT_SUBTLE} />
                <Text style={styles.backText}>{t("back_label", "MyWeb")}</Text>
              </Pressable>
            </View>

            {/* 説明 */}
            <View style={styles.introCard}>
              <Text style={styles.introTitle}>{t("intro_title", "問いを生成し、自己構造分析に反映します。")}</Text>
              <Text style={styles.introText}>
                {t("intro_text", "いまのあなたの構造をもう少し深く理解するための問いです。答えたくないものは空欄のままで大丈夫です。")}
              </Text>
            </View>

            {/* 質問リスト */}
            {loading ? (
              <ActivityIndicator style={{ marginTop: 16 }} />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : questions.length === 0 ? (
              <Text style={styles.emptyText}>{t("empty_text", "いまは質問がありません。")}</Text>
            ) : (
              <View style={{ marginTop: 6 }}>
                {questions.map((q, idx) => {
                  const secret = !!secretMap?.[q.id];
                  const submitted = !!submittedMap?.[q.id];
                  const isExpanded = focusedQuestionId === q.id;
                  const rawAnswer = String(answers?.[q.id] ?? "");
                  const hasAnswer = rawAnswer.trim().length > 0;
                  const previewLine = hasAnswer
                    ? rawAnswer.trim().split(/\r?\n/)[0]
                    : "";
                  const inputHeight = Math.max(
                    INPUT_MIN_HEIGHT,
                    Math.min(inputMaxHeight, answerHeights?.[q.id] ?? INPUT_MIN_HEIGHT)
                  );
                  return (
                    <View key={String(q.id || idx)} style={styles.qBlock}>
                      <Text style={styles.qLabel}>{`Q${idx + 1}${submitted ? "（送信済み）" : ""}`}</Text>
                      <Text style={styles.qText}>{q.text}</Text>
                      {q.hint ? <Text style={styles.hintText}>{q.hint}</Text> : null}

                      {!isExpanded ? (
                        <Pressable
                          style={[styles.inputPreviewCard, submitted && { opacity: 0.6 }]}
                          disabled={submitted}
                          onPress={() => {
                            if (submitted) return;
                            setFocusedQuestionId(q.id);
                            setTimeout(() => {
                              const ref = inputRefs.current?.[q.id];
                              if (ref && typeof ref.focus === "function") ref.focus();
                            }, 30);
                          }}
                        >
                          <Ionicons
                            name="create-outline"
                            size={18}
                            color={colors.TEXT_SUBTLE}
                            style={styles.inputIcon}
                          />
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.previewText,
                              !submitted && !hasAnswer && styles.previewPlaceholder,
                            ]}
                          >
                            {submitted
                              ? t("submitted_placeholder", "送信済み")
                              : hasAnswer
                              ? previewLine
                              : t("answer_placeholder", "ここに書いてください。")}
                          </Text>
                          {!submitted ? (
                            <Ionicons
                              name="chevron-down"
                              size={18}
                              color={colors.TEXT_SUBTLE}
                            />
                          ) : null}
                        </Pressable>
                      ) : (
                        <View style={styles.inputCard}>
                          <Ionicons
                            name="create-outline"
                            size={18}
                            color={colors.TEXT_SUBTLE}
                            style={styles.inputIcon}
                          />
                          <TextInput
                            key={isIOS ? `${String(q.id)}-${submitted ? "submitted" : "edit"}` : undefined}
                            ref={(r) => {
                              if (r) inputRefs.current[q.id] = r;
                            }}
                            style={[styles.input, { minWidth: 0, height: inputHeight }]}
                            placeholder={submitted ? t("submitted_placeholder", "送信済み") : t("answer_placeholder", "ここに書いてください。")}
                            placeholderTextColor={colors.TEXT_ON_LIGHT}
                            multiline
                            scrollEnabled
                            editable={!submitted}
                            {...(isIOS
                              ? { defaultValue: answers?.[q.id] ?? "" }
                              : { value: answers?.[q.id] ?? "" })}
                            onChangeText={(t) => setAnswerText(q.id, t)}
                            {...(isIOS
                              ? {
                                  onChange: (e) =>
                                    setAnswerText(q.id, e?.nativeEvent?.text ?? ""),
                                }
                              : {})}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onFocus={(e) => {
                              lastFocusTargetRef.current =
                                e?.target ?? e?.nativeEvent?.target ?? null;
                              setFocusedQuestionId(q.id);
                              requestAnimationFrame(() => scrollToFocusedInput());
                            }}
                            onBlur={() => {
                              setFocusedQuestionId((prev) =>
                                prev === q.id ? null : prev
                              );
                            }}
                            onContentSizeChange={(e) => {
                              const h =
                                e?.nativeEvent?.contentSize?.height ?? INPUT_MIN_HEIGHT;
                              setAnswerHeights((prev) => {
                                if ((prev?.[q.id] ?? 0) === h) return prev;
                                return { ...(prev || {}), [q.id]: h };
                              });
                              if (focusedQuestionId === q.id) {
                                requestAnimationFrame(() => scrollToFocusedInput());
                              }
                            }}
                          />
                        </View>
                      )}

                      {/* シークレット（Input画面と同じ ON/OFF 書式） */}
                      {showSecretToggle ? (
                        <View style={[styles.preferenceCard, submitted && { opacity: 0.6 }]}>
                          <View style={styles.preferenceRow}>
                            <View style={styles.preferenceLeft}>
                              <Ionicons
                                name={secret ? "lock-closed-outline" : "lock-open-outline"}
                                size={18}
                                color={colors.TEXT_SUBTLE}
                                style={styles.preferenceIcon}
                              />
                              <View style={styles.preferenceTextWrap}>
                                <Text style={styles.preferenceTitle}>シークレットメモ</Text>
                                <Text style={styles.preferenceDesc}>
                                  オンにすると他ユーザーのMyModel照会時に反映されなくなります。
                                </Text>
                              </View>
                            </View>

                            <Switch
                              value={secret}
                              disabled={submitted}
                              onValueChange={() => !submitted && toggleSecret(q.id)}
                              trackColor={{
                                false: "#D1D5DB",
                                true: colors.GOLD_BUTTON,
                              }}
                              thumbColor={
                                Platform.OS === "android"
                                  ? secret
                                    ? "#FFFFFF"
                                    : "#F9FAFB"
                                  : undefined
                              }
                              ios_backgroundColor="#D1D5DB"
                              accessibilityLabel="シークレットメモを切り替える"
                            />
                          </View>
                        </View>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            )}

            {/* 送信 */}
            <View style={styles.actions}>
              <Pressable
                style={[
                  styles.goldButton,
                  !canSubmit && styles.goldButtonDisabled,
                ]}
                disabled={!canSubmit}
                onPress={handleSubmit}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <View style={styles.btnRow}>
                    <Ionicons
                      name="paper-plane-outline"
                      size={18}
                      color="#FFFFFF"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.goldButtonText}>{t("submit_button", "送る")}</Text>
                  </View>
                )}
              </Pressable>

              <Pressable
                style={styles.ghostButton}
                onPress={() => {
                  // 無理に送らずに戻れる導線
                  if (typeof onBack === "function") onBack();
                }}
              >
                <Text style={styles.ghostButtonText}>{t("cancel_button", "今はやめておく")}</Text>
              </Pressable>
            </View>

            {/* メッセージ */}
            {message ? <Text style={styles.successText}>{message}</Text> : null}

            {/* 次の問い */}
            <View style={styles.nextWrap}>
              <Pressable
                style={[styles.refreshBtn, (loading || !canRegenerate) && styles.refreshBtnDisabled]}
                disabled={loading || !canRegenerate}
                onPress={loadQuestions}
              >
                <Ionicons
                  name="refresh-outline"
                  size={16}
                  color={colors.TEXT_SUBTLE}
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.refreshText}>{t("regenerate_button", "別の問いを受け取る")}</Text>
              </Pressable>

              {!loading && !error && !canRegenerate ? (
                <View style={styles.paywallCard}>
                  <Text style={styles.paywallTitle}>{t("paywall_title", "次の問いの生成は制限されています")}</Text>
                  <Text style={styles.paywallText}>
                    {t("paywall_text", "現在のプランでは「別の問いを受け取る」は利用できません。Plusプランになると、いつでも新しい問いを生成できます。")}
                  </Text>
                  <Pressable style={styles.paywallBtn} onPress={openSubscriptionSelect}>
                    <Ionicons name="sparkles-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.paywallBtnText}>{t("paywall_button", "プランを見る")}</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>


        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(COLORS, ui) {
  return StyleSheet.create(applyTypographyTokens({
    // ベース
    container: { flex: 1, backgroundColor: COLORS.PANEL_BG },
    body: { flex: 1 },
    bodyContent: {
      paddingTop: 16,
      alignItems: "stretch",
      paddingHorizontal: 18,
      paddingBottom: 32,
    },

    // 🔷 Emlis タイトル（2行ともテーマカラー）
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

    // メインパネル
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
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    panelTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      letterSpacing: 0.8,
    },

    backPill: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    backText: {
      marginLeft: 3,
      fontSize: 12,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },

    introCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 10,
    },
    introTitle: {
      fontSize: 13,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 4,
    },
    introText: {
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
    },

    qBlock: {
      marginBottom: 14,
      padding: 12,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
    },
    qLabel: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 6,
    },
    qText: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 6,
    },
    hintText: {
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 8,
    },

    inputCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 12,
      paddingVertical: 10,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    inputPreviewCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 12,
      paddingVertical: 10,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    inputIcon: {
      marginTop: 4,
      marginRight: 8,
    },
    input: {
      flex: 1,
      fontSize: 14,
      color: COLORS.TEXT_ON_LIGHT,
      textAlignVertical: "top",
    },
    previewText: {
      flex: 1,
      fontSize: 13,
      color: COLORS.TEXT_ON_LIGHT,
    },
    previewPlaceholder: {
      opacity: 0.65,
    },

    /**
     * 設定風トグル（文章 + ON/OFF）
     * - Input画面の「シークレットメモ」と同じ見た目に合わせる
     */
    preferenceCard: {
      marginTop: 10,
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
      fontSize: 11,
      lineHeight: 15,
      color: COLORS.TEXT_ON_LIGHT,
    },

    secretRow: {
      marginTop: 8,
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    secretPill: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    secretPillOff: {
      opacity: 0.85,
    },
    secretText: {
      marginLeft: 6,
      fontSize: 11,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },

    actions: {
      marginTop: 6,
      alignItems: "center",
    },

    goldButton: {
      width: "100%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOpacity: 0.22,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
      marginTop: 6,
    },
    goldButtonDisabled: {
      opacity: 0.5,
      shadowOpacity: 0.05,
    },
    goldButtonText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 15,
    },
    btnRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },

    ghostButton: {
      marginTop: 10,
      width: "100%",
      paddingVertical: 12,
      paddingHorizontal: 22,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      alignItems: "center",
      justifyContent: "center",
    },
    ghostButtonText: {
      fontSize: 13,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },

    successText: {
      marginTop: 12,
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
    },

    nextWrap: {
      marginTop: 14,
      alignItems: "center",
    },
    refreshBtn: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    refreshBtnDisabled: {
      opacity: 0.6,
    },
    refreshText: {
      fontSize: 12,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },

    paywallCard: {
      marginTop: 10,
      width: "100%",
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    paywallTitle: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 4,
    },
    paywallText: {
      fontSize: 11,
      lineHeight: 16,
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 10,
    },
    paywallBtn: {
      alignSelf: "flex-end",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
    },
    paywallBtnText: {
      marginLeft: 6,
      fontSize: 12,
      fontWeight: "800",
      color: "#FFFFFF",
    },

    errorText: {
      marginTop: 12,
      color: "#B91C1C",
      fontSize: 12,
      lineHeight: 18,
    },
    emptyText: {
      marginTop: 12,
      fontSize: 12,
      color: COLORS.TEXT_ON_LIGHT,
    },

    footer: {
      marginTop: 14,
      paddingHorizontal: 18,
    },
    footerText: {
      fontSize: 11,
      lineHeight: 16,
      color: COLORS.TEXT_ON_DARK,
      textAlign: "center",
    },
  }, ui));
}
