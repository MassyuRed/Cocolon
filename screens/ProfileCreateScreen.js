import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import CocolonBackButton from "../components/CocolonBackButton";
import { useTheme } from "../theme/ThemeContext";
import { supabase } from "../lib/supabase";

// UI (Design System)
import CocolonPressable from "../components/CocolonPressable";
import CocolonSwitch from "../components/CocolonSwitch";
import CocolonButton from "../components/CocolonButton";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { apiFetch, API_BASE_URL } from "../lib/apiClient";

// ---- API base ----
const API_BASE = API_BASE_URL;
const QUESTIONS_ENDPOINT = `${API_BASE}/profile-create/questions`;
const ANSWERS_ENDPOINT = `${API_BASE}/profile-create/answers`;

// パネル高さ（Profile 近似）
const PANEL_MIN_HEIGHT = 690;

export default function ProfileCreateScreen({ onBack }) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";
  const isIOS = Platform.OS === "ios";


  // キーボードで入力欄が隠れないように追従スクロール
  const scrollRef = useRef(null);
  const lastFocusTargetRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { height: windowHeight } = useWindowDimensions();

  // 入力欄はできるだけ伸ばしつつ、一定以上は TextInput 内スクロールに切り替える
  const inputMaxHeight = useMemo(() => {
    const h = windowHeight || 0;
    if (!h) return 520;
    if (keyboardHeight > 0) {
      const remaining = h - keyboardHeight;
      return Math.max(160, Math.floor(remaining - 60));
    }
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
    } catch {
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [meta, setMeta] = useState(null);
  const [uiTexts, setUiTexts] = useState({});

  const [questions, setQuestions] = useState([]);
  const [draftAnswers, setDraftAnswers] = useState({});
  const [originalAnswers, setOriginalAnswers] = useState({});
  const [draftSecrets, setDraftSecrets] = useState({});
  const [originalSecrets, setOriginalSecrets] = useState({});



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

      const url = `${QUESTIONS_ENDPOINT}?build_tier=light`;
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
      const raw = Array.isArray(json?.questions) ? json.questions : [];

      // Normalize shape for UI
      const qs = raw
        .map((q) => {
          const id = q?.question_id ?? q?.id ?? null;
          if (!id) return null;
          return {
            id,
            text: String(q?.question_text ?? q?.text ?? ""),
            answer_text: typeof q?.answer_text === "string" ? q.answer_text : "",
            is_secret: q?.is_secret === true,
            can_edit: q?.can_edit === true || q?.editable === true,
            edit_block_reason:
              typeof q?.edit_block_reason === "string" ? q.edit_block_reason : null,
            placeholder:
              typeof q?.placeholder === "string" ? q.placeholder : null,
          };
        })
        .filter(Boolean);

      setQuestions(qs);

      const m = json?.meta && typeof json.meta === "object" ? json.meta : null;
      setMeta(m);

      const serverUiTexts = m?.ui_texts && typeof m.ui_texts === "object" ? m.ui_texts : {};
      setUiTexts(serverUiTexts);


      // Initialize answers (server values)
      const initDraft = {};
      const initOriginal = {};
      const initSecrets = {};
      const initOriginalSecrets = {};
      for (const q of qs) {
        initDraft[q.id] = q.answer_text || "";
        initOriginal[q.id] = q.answer_text || "";
        initSecrets[q.id] = !!q.is_secret;
        initOriginalSecrets[q.id] = !!q.is_secret;
      }
      setDraftAnswers(initDraft);
      setOriginalAnswers(initOriginal);
      setDraftSecrets(initSecrets);
      setOriginalSecrets(initOriginalSecrets);
      setFocusedQuestionId(null);
      setAnswerHeights({});
    } catch (e) {
      setError(buildErrorMessage(e));
      setQuestions([]);
      setDraftAnswers({});
      setOriginalAnswers({});
      setDraftSecrets({});
      setOriginalSecrets({});
      setFocusedQuestionId(null);
      setAnswerHeights({});
      setMeta(null);
      setUiTexts({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  function setAnswerText(questionId, text) {
    setDraftAnswers((prev) => ({ ...prev, [questionId]: text }));
  }

  function setSecretValue(questionId, value) {
    setDraftSecrets((prev) => ({ ...prev, [questionId]: !!value }));
  }

  const buildPayloadAnswers = useCallback(() => {
    const payload = [];

    for (const q of questions) {
      const curr = String(draftAnswers?.[q.id] ?? "");
      const currTrim = curr.trim();
      const orig = String(originalAnswers?.[q.id] ?? "");
      const origTrim = orig.trim();
      const currSecret = !!draftSecrets?.[q.id];
      const origSecret = !!originalSecrets?.[q.id];
      const answerChanged = currTrim !== origTrim;
      const secretChanged = currSecret !== origSecret;

      if (!answerChanged && !secretChanged) continue;

      if (!q.can_edit && answerChanged) continue;

      if (answerChanged) {
        if (currTrim.length > 0) {
          payload.push({
            question_id: q.id,
            answer_text: currTrim,
            is_secret: currSecret,
          });
          continue;
        }

        if (origTrim.length > 0 && q.can_edit) {
          payload.push({ question_id: q.id, answer_text: "", is_secret: currSecret });
        }
        continue;
      }

      if (secretChanged && currTrim.length > 0) {
        payload.push({
          question_id: q.id,
          is_secret: currSecret,
        });
      }
    }

    return payload;
  }, [questions, draftAnswers, originalAnswers, draftSecrets, originalSecrets]);

  const canSave = useMemo(() => {
    if (loading || saving) return false;
    const payload = buildPayloadAnswers();
    return payload.length > 0;
  }, [loading, saving, buildPayloadAnswers]);

  const handleSave = useCallback(async () => {
    if (!canSave) return;
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("ログイン情報の取得に失敗しました（tokenなし）");

      const payloadAnswers = buildPayloadAnswers();
      if (payloadAnswers.length === 0) {
        Alert.alert("保存できません", "回答が空です。");
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

      let okJson = null;
      try {
        okJson = await res.json();
      } catch {
        okJson = null;
      }

      const locked = Array.isArray(okJson?.meta?.locked) ? okJson.meta.locked : [];
      const invalid = Array.isArray(okJson?.meta?.invalid) ? okJson.meta.invalid : [];
      const serverTexts =
        okJson?.meta?.ui_texts && typeof okJson.meta.ui_texts === "object"
          ? okJson.meta.ui_texts
          : uiTexts;

      const msg =
        String(serverTexts?.create_completed_message || "保存しました。").trim() ||
        "保存しました。";

      // 通知（部分成功でも落とさない）
      if (locked.length > 0 || invalid.length > 0) {
        Alert.alert(
          "保存しました",
          `${msg}\n\n一部の回答は保存できませんでした。プランや入力内容をご確認ください。`
        );
      } else {
        Alert.alert("保存しました", msg);
      }

      setMessage(msg);

      // サーバ状態を再取得（編集可否・バッジ状態の反映）
      await loadQuestions();
    } catch (e) {
      setError(buildErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }, [canSave, buildPayloadAnswers, uiTexts, loadQuestions]);

  const pageStart = 0;
  const pageQuestions = questions || [];


  const placeholderDefault =
    String(uiTexts?.placeholder_default || "一言でも大丈夫です").trim() ||
    "一言でも大丈夫です";
  const introSubscriptionBenefit =
    String(
      uiTexts?.intro_subscription_benefit ||
        "ProfileCreate は固定的な自己紹介 / プロフィール資産です。"
    ).trim() || "ProfileCreate は固定的な自己紹介 / プロフィール資産です。";
  const introSecretToggleNote =
    String(
      uiTexts?.intro_secret_toggle_note ||
        "シークレットメモをオンにすると、他ユーザーの Account には表示されません。"
    ).trim() || "シークレットメモをオンにすると、他ユーザーの Account には表示されません。";

  const answeredCount = Number(meta?.answered_count ?? 0) || 0;
  const totalQuestions = Number(meta?.total_questions ?? 5) || 5;

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.container}>
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
          {/* ヘッダー */}
          <View style={styles.panelHeader}>
            <CocolonBackButton onPress={onBack} style={{ width: 44 }} />

            <Text style={styles.panelTitle}>ProfileCreate</Text>


          </View>

          {/* 説明 */}
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>5つの問いに答えて、プロフィールを作成</Text>
            <Text style={styles.introText}>
              {introSubscriptionBenefit}{"\n"}
              Account 画面で編集される、固定的な自己紹介 / プロフィール資産です。{"\n"}
              他ユーザーには、回答済みの項目だけが表示されます。{"\n"}
              全てに答える必要はありません。{"\n"}
              「保存する」を押すと、答えた内容だけが更新されます。{"\n"}
              {introSecretToggleNote}
            </Text>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>
                回答済み：{answeredCount}/{totalQuestions}
              </Text>
            </View>
          </View>

          {/* 質問リスト */}
          {loading ? (
            <ActivityIndicator color={colors.TEXT_SUBTLE} style={{ marginTop: 16 }} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : questions.length === 0 ? (
            <Text style={styles.emptyText}>いまは質問がありません。</Text>
          ) : (
            <View style={{ marginTop: 6 }}>
              {pageQuestions.map((q, idx) => {
                const isExpanded = focusedQuestionId === q.id;
                const rawAnswer = String(draftAnswers?.[q.id] ?? "");
                const hasAnswer = rawAnswer.trim().length > 0;
                const answeredStatusLabel =
                  hasAnswer && !q.can_edit ? "回答済み（編集不可）" : "回答済み";
                const previewLine = hasAnswer ? rawAnswer.trim().split(/\r?\n/)[0] : "";

                const placeholder = String(q.placeholder || placeholderDefault);

                const inputHeight = Math.max(
                  INPUT_MIN_HEIGHT,
                  Math.min(inputMaxHeight, answerHeights?.[q.id] ?? INPUT_MIN_HEIGHT)
                );

                const isSecret = !!draftSecrets?.[q.id];
                const secretDisabled = !!saving;

                return (
                  <View key={String(q.id || idx)} style={styles.qBlock}>
                    <View style={styles.qHeaderRow}>
                      <Text style={styles.qLabel}>{`Q${pageStart + idx + 1}`}</Text>
                      {hasAnswer ? (
                        <View style={[styles.qStatusPill, styles.qStatusPillAnswered]}>
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={14}
                            color={colors.ON_SURFACE_TONAL}
                            style={{ marginRight: 4 }}
                          />
                          <Text style={[styles.qStatusText, styles.qStatusTextAnswered]}>
                            {answeredStatusLabel}
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.qStatusPill}>
                          <Ionicons
                            name="ellipse-outline"
                            size={14}
                            color={colors.TEXT_SUBTLE}
                            style={{ marginRight: 4 }}
                          />
                          <Text style={styles.qStatusText}>未回答</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.qText}>{q.text}</Text>

                    {!isExpanded ? (
                      <CocolonPressable
                        style={styles.inputPreviewCard}
                        onPress={() => {
                          setFocusedQuestionId(q.id);
                          setTimeout(() => {
                            const ref = inputRefs.current?.[q.id];
                            if (ref && typeof ref.focus === "function") ref.focus();
                          }, 30);
                        }}
                      >
                        <Ionicons
                          name={q.can_edit ? "create-outline" : "document-text-outline"}
                          size={18}
                          color={colors.TEXT_SUBTLE}
                          style={styles.inputIcon}
                        />
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.previewText,
                            !hasAnswer && styles.previewPlaceholder,
                          ]}
                        >
                          {hasAnswer ? previewLine : placeholder}
                        </Text>
                        <Ionicons
                          name="chevron-down"
                          size={18}
                          color={colors.TEXT_SUBTLE}
                        />
                      </CocolonPressable>
                    ) : (
                      <View style={styles.inputCard}>
                        <Ionicons
                          name={q.can_edit ? "create-outline" : "document-text-outline"}
                          size={18}
                          color={colors.TEXT_SUBTLE}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          key={isIOS ? `${String(q.id)}-${q.can_edit ? "edit" : "locked"}` : undefined}
                          ref={(r) => {
                            if (r) inputRefs.current[q.id] = r;
                          }}
                          style={[styles.input, { minWidth: 0, height: inputHeight }]}
                          placeholder={placeholder}
                          placeholderTextColor={colors.TEXT_SUBTLE}
                          multiline
                          scrollEnabled
                          editable={!saving && q.can_edit}
                          {...(isIOS
                            ? { defaultValue: draftAnswers?.[q.id] ?? "" }
                            : { value: draftAnswers?.[q.id] ?? "" })}
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
                            setFocusedQuestionId((prev) => (prev === q.id ? null : prev));
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

                    {/* シークレットメモ（InputScreen と同仕様 / 各問ごと） */}
                    <View style={styles.preferenceCard}>
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
                              {introSecretToggleNote}
                            </Text>
                          </View>
                        </View>
                        <CocolonSwitch
                          value={isSecret}
                          onValueChange={(v) => setSecretValue(q.id, v)}
                          disabled={secretDisabled}
                          containerStyle={{ alignSelf: "flex-end" }}
                          accessibilityLabel="シークレットメモを切り替える"
                        />
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* 保存 */}
          <View style={styles.actions}>
            <CocolonButton
              variant="primary"
              onPress={handleSave}
              disabled={!canSave}
              loading={saving}
            >
              <View style={styles.btnRow}>
                <Ionicons
                  name="save-outline"
                  size={18}
                  color={!canSave ? colors.TEXT_SUBTLE : colors.ACCENT_TEXT}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.goldButtonText, { color: !canSave ? colors.TEXT_SUBTLE : colors.ACCENT_TEXT }]}>保存する</Text>
              </View>
            </CocolonButton>

          </View>

          {message ? <Text style={styles.successText}>{message}</Text> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(COLORS, ui) {
  const font = ui?.font || {};
  const text = ui?.text || {};

  return StyleSheet.create(applyTypographyTokens({
    // ベース
    container: {
      flex: 1,
      backgroundColor: COLORS.BG_SILVER,
    },
    body: { flex: 1 },
    bodyContent: {
      paddingTop: 16,
      alignItems: "stretch",
      paddingHorizontal: 16,
      paddingBottom: 32,
      flexGrow: 1,
      width: "100%",
      maxWidth: ui?.layout?.maxButtonWidth ?? 520,
      alignSelf: "center",
    },

    // メインパネル
    panel: {
      width: "100%",
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: ui?.radius?.card ?? 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 16,
      paddingVertical: 16,
      shadowColor: "#000",
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },

    panelHeader: {
      flexDirection: "column",
      alignItems: "stretch",
      justifyContent: "flex-start",
      marginBottom: 24,
      gap: 8,
    },
    panelTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      letterSpacing: 0,
      flexShrink: 1,
      minWidth: 0,
    },

    backPill: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: ui?.radius?.button ?? 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      minHeight: 44,
    },
    backText: {
      marginLeft: 3,
      color: COLORS.TEXT_ON_LIGHT,
    },

    introCard: {
      borderRadius: ui?.radius?.card ?? 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginBottom: 24,
    },
    introTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 12,
    },
    introText: {
      color: COLORS.TEXT_ON_LIGHT,
    },
    progressRow: {
      marginTop: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 8,
    },
    progressText: {
      color: COLORS.TEXT_SUBTLE,
    },
    progressSubText: {
      color: COLORS.TEXT_SUBTLE,
    },

    pageTabsRow: {
      marginTop: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      flexWrap: "wrap",
      gap: 8,
    },
    pageTab: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 12,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      marginRight: 0,
      marginBottom: 0,
      minHeight: 44,
      paddingVertical: 10,
      maxWidth: "100%",
    },
    pageTabActive: {
      backgroundColor: COLORS.SURFACE_TONAL,
      borderColor: COLORS.ON_SURFACE_TONAL,
    },
    pageTabLocked: {
      backgroundColor: COLORS.FIELD_BG,
      borderColor: COLORS.CARD_BORDER,
    },
    pageTabText: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
    },
    pageTabTextActive: {
      color: COLORS.ON_SURFACE_TONAL,
    },

    qBlock: {
      marginBottom: 16,
      padding: 16,
      borderRadius: ui?.radius?.card ?? 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    qHeaderRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      marginBottom: 12,
      flexWrap: "wrap",
      gap: 8,
    },
    qLabel: {
      color: COLORS.TEXT_SUBTLE,
    },
    qStatusPill: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      maxWidth: "100%",
    },
    qStatusPillAnswered: {
      backgroundColor: COLORS.SURFACE_TONAL,
      borderColor: COLORS.SURFACE_TONAL,
    },
    qStatusText: {
      color: COLORS.TEXT_SUBTLE,
      flexShrink: 1,
    },
    qStatusTextAnswered: {
      color: COLORS.ON_SURFACE_TONAL,
    },
    qText: {
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 12,
    },

    inputCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 12,
      paddingVertical: 10,
      shadowColor: "#000",
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    inputPreviewCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 12,
      paddingVertical: 10,
      shadowColor: "#000",
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
      minHeight: 52,
    },
    inputIcon: {
      marginTop: 4,
      marginRight: 8,
    },
    input: {
      flex: 1,
      color: COLORS.TEXT_ON_LIGHT,
      textAlignVertical: "top",
      minWidth: 0,
    },
    previewText: {
      flex: 1,
      color: COLORS.TEXT_ON_LIGHT,
      minWidth: 0,
    },
    previewPlaceholder: {
      color: COLORS.TEXT_SUBTLE,
    },

    lockedCard: {
      marginTop: 10,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    lockedText: {
      color: COLORS.TEXT_SUBTLE,
      marginBottom: 10,
    },
    lockedBtn: {
      alignSelf: "flex-end",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.SURFACE_TONAL,
      backgroundColor: COLORS.SURFACE_TONAL,
      minHeight: 44,
      maxWidth: "100%",
    },
    lockedBtnText: {
      marginLeft: 6,
      color: COLORS.ON_SURFACE_TONAL,
      flexShrink: 1,
      textAlign: "center",
    },

    /**
     * 設定風トグル（文章 + ON/OFF）
     * - InputScreen の「シークレットメモ」と同じ見た目
     */
    preferenceCard: {
      marginTop: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      overflow: "hidden",
    },
    preferenceRow: {
      flexDirection: "column",
      alignItems: "stretch",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      paddingVertical: 16,
      gap: 12,
    },
    preferenceLeft: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingRight: 0,
      alignSelf: "stretch",
      minWidth: 0,
    },
    preferenceIcon: {
      marginTop: 2,
      marginRight: 8,
    },
    preferenceTextWrap: {
      flex: 1,
      minWidth: 0,
    },
    preferenceTitle: {
      color: COLORS.TEXT_ON_LIGHT,
    },
    preferenceDesc: {
      marginTop: 4,
      color: COLORS.TEXT_SUBTLE,
    },

    actions: {
      marginTop: 8,
      alignItems: "stretch",
    },

    goldButton: {
      width: "100%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: ui?.radius?.button ?? 24,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
      marginTop: 6,
      minHeight: 52,
      maxWidth: ui?.layout?.maxButtonWidth ?? 520,
      alignSelf: "center",
    },
    goldButtonDisabled: {
      shadowOpacity: 0,
      backgroundColor: COLORS.FIELD_BG,
      borderColor: COLORS.CARD_BORDER,
    },
    goldButtonText: {
      color: COLORS.ACCENT_TEXT,
      flexShrink: 1,
      textAlign: "center",
    },
    btnRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      maxWidth: "100%",
    },

    ghostButton: {
      marginTop: 10,
      width: "100%",
      paddingVertical: 12,
      paddingHorizontal: 22,
      borderRadius: ui?.radius?.button ?? 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 52,
    },
    ghostButtonText: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
      textAlign: "center",
    },

    successText: {
      marginTop: 12,
      color: COLORS.TEXT_ON_LIGHT,
    },

    errorText: {
      marginTop: 12,
      color: COLORS.ERROR,
    },
    emptyText: {
      marginTop: 12,
      color: COLORS.TEXT_SUBTLE,
    },
  }, ui, {"panelTitle":"screenTitle","backText":"button","introTitle":"sectionTitle","introText":"body","progressText":"description","progressSubText":"description","pageTabText":"button","qLabel":"meta","qStatusText":"meta","qText":"body","input":"input","previewText":"body","lockedText":"description","lockedBtnText":"button","preferenceTitle":"body","preferenceDesc":"description","goldButtonText":"button","ghostButtonText":"button","successText":"body","errorText":"description","emptyText":"description"}));
}
