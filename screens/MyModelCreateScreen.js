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
  View,
  useWindowDimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CocolonBackButton from "../components/CocolonBackButton";
import { useNavigation } from "@react-navigation/native";

import { useTheme } from "../theme/ThemeContext";
import { supabase } from "../lib/supabase";

import { useSubscription } from "../SubscriptionContext";

// UI (Design System)
import CocolonPressable from "../components/CocolonPressable";
import CocolonSwitch from "../components/CocolonSwitch";
import CocolonButton from "../components/CocolonButton";
import { makeUiTokens } from "../ui/uiTokens";
import { apiFetch } from "../lib/apiClient";

// ---- API base ----
const API_BASE =
  process.env.EXPO_PUBLIC_MYMODEL_API_URL || "https://mashos-api.onrender.com";
const QUESTIONS_ENDPOINT = `${API_BASE}/mymodel/create/questions`;
const ANSWERS_ENDPOINT = `${API_BASE}/mymodel/create/answers`;

// パネル高さ（MyProfile 近似）
const PANEL_MIN_HEIGHT = 690;

// 5問ずつ表示（ページ制）
const PAGE_SIZE = 5;

export default function MyModelCreateScreen({ onBack, onOpenSubscription }) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";
  const isIOS = Platform.OS === "ios";

  const navigation = useNavigation();

  const { isPaid: isPaidFromCtx, tier: subscriptionTier } = useSubscription();

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

  const openSubscriptionSelect = useCallback(() => {
    if (typeof onOpenSubscription === "function") {
      try {
        onOpenSubscription();
        return;
      } catch {
        // fall through
      }
    }

    // Navigate to SubscriptionSelect (unify paywall CTA behavior)
    try {
      if (navigation && typeof navigation.navigate === "function") {
        navigation.navigate("SubscriptionSelect");
        return;
      }
      const parent =
        typeof navigation?.getParent === "function" ? navigation.getParent() : null;
      if (parent && typeof parent.navigate === "function") {
        parent.navigate("SubscriptionSelect");
        return;
      }
    } catch {
      // fall through
    }

    Alert.alert("プラン確認", "加入画面を開けませんでした。もう一度お試しください。");
  }, [navigation, onOpenSubscription]);

  const promptSubscriptionForLockedPages = useCallback(() => {
    Alert.alert(
      "ReflectionCreate",
      "2ページ目以降はPlus会員以上で利用できます。\n\nPlus会員以上で全ての問いに回答できるようになります。",
      [
        { text: "閉じる", style: "cancel" },
        { text: "プランを見る", onPress: openSubscriptionSelect },
      ]
    );
  }, [openSubscriptionSelect]);

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


  const [page, setPage] = useState(0);


  const isPaidUser = useMemo(() => {
    // Prefer SubscriptionContext when available; fall back to server meta.
    if (subscriptionTier && subscriptionTier !== "unknown") return !!isPaidFromCtx;
    const mTier = String(meta?.subscription_tier || "").trim().toLowerCase();
    return mTier === "plus" || mTier === "premium";
  }, [isPaidFromCtx, meta, subscriptionTier]);

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


      // ページ位置を維持（無料は1ページ目固定）
      const tierFromMeta = String(m?.subscription_tier || "").trim().toLowerCase();
      const paidFromMeta = tierFromMeta === "plus" || tierFromMeta === "premium";
      const nextTotalPages = Math.max(1, Math.ceil(qs.length / PAGE_SIZE));
      setPage((prev) => {
        const p0 = typeof prev === "number" ? prev : 0;
        if (!paidFromMeta) return 0;
        return Math.min(Math.max(0, p0), nextTotalPages - 1);
      });

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
      setPage(0);
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

  const totalPages = Math.max(1, Math.ceil((questions?.length || 0) / PAGE_SIZE));
  const safePage = isPaidUser ? Math.min(page, totalPages - 1) : 0;
  const pageStart = safePage * PAGE_SIZE;
  const pageQuestions = (questions || []).slice(pageStart, pageStart + PAGE_SIZE);
  const canGoPrev = safePage > 0;
  const canGoNext = isPaidUser && safePage < totalPages - 1;

  const changePage = useCallback(
    (next) => {
      const total = Array.isArray(questions) ? questions.length : 0;
      const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
      const maxPage = pages - 1;
      let n = parseInt(String(next), 10);
      if (!Number.isFinite(n)) n = 0;
      n = Math.max(0, Math.min(maxPage, n));

      if (!isPaidUser && n > 0) return;

      Keyboard.dismiss();
      setFocusedQuestionId(null);
      lastFocusTargetRef.current = null;
      setPage(n);

      requestAnimationFrame(() => {
        try {
          scrollRef.current?.scrollTo?.({ y: 0, animated: true });
        } catch {
          // noop
        }
      });
    },
    [isPaidUser, questions]
  );

  const placeholderDefault =
    String(uiTexts?.placeholder_default || "一言でも大丈夫です").trim() ||
    "一言でも大丈夫です";
  const introSubscriptionBenefit =
    String(
      uiTexts?.intro_subscription_benefit ||
        "サブスク加入することで、回答後編集と追加の問いが表示されます。"
    ).trim() || "サブスク加入することで、回答後編集と追加の問いが表示されます。";
  const introSecretToggleNote =
    String(
      uiTexts?.intro_secret_toggle_note ||
        "（シークレットメモのオンオフ切り替えは可能です。）"
    ).trim() || "（シークレットメモのオンオフ切り替えは可能です。）";

  const answeredCount = Number(meta?.answered_count ?? 0) || 0;
  const totalQuestions = Number(meta?.total_questions ?? 10) || 10;

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
          {/* ヘッダー */}
          <View style={styles.panelHeader}>
            <CocolonBackButton onPress={onBack} style={{ width: 72 }} />

            <Text style={styles.panelTitle}>ReflectionCreate</Text>

            <View style={{ width: 72 }} />
          </View>

          {/* 説明 */}
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>問いに答えて、MyModelを構築</Text>
            <Text style={styles.introText}>
              全てに答える必要はありません。{"\n"}
              「保存する」を押せば、答えた問いのみ「回答済み」となります。{"\n"}
              {introSubscriptionBenefit}{"\n"}
              {introSecretToggleNote}{"\n"}{"\n"}
              2ページ目以降はPlus会員以上で利用できます。
            </Text>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>
                回答済み：{answeredCount}/{totalQuestions}
              </Text>
              <CocolonPressable
                style={[styles.lockedBtn, { alignSelf: "center", paddingVertical: 6 }]}
                onPress={openSubscriptionSelect}
              >
                <Ionicons name="sparkles-outline" size={16} color="#FFFFFF" />
                <Text style={styles.lockedBtnText}>プランを見る</Text>
              </CocolonPressable>
            </View>
          </View>

          {/* 質問リスト */}
          {loading ? (
            <ActivityIndicator style={{ marginTop: 16 }} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : questions.length === 0 ? (
            <Text style={styles.emptyText}>いまは質問がありません。</Text>
          ) : (
            <View style={{ marginTop: 6 }}>
              {totalPages > 1 ? (
                <View style={styles.pageTabsRow}>
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const locked = !isPaidUser && i > 0;
                    const active = i === safePage;

                    return (
                      <CocolonPressable
                        key={`page-${i}`}
                        style={[
                          styles.pageTab,
                          active && styles.pageTabActive,
                          locked && styles.pageTabLocked,
                        ]}
                        onPress={() => {
                          if (locked) {
                            promptSubscriptionForLockedPages();
                            return;
                          }
                          changePage(i);
                        }}
                      >
                        {locked ? (
                          <Ionicons
                            name="lock-closed-outline"
                            size={14}
                            color={colors.BORDER_GOLD}
                            style={{ marginRight: 4 }}
                          />
                        ) : null}
                        <Text
                          style={[
                            styles.pageTabText,
                            active && styles.pageTabTextActive,
                          ]}
                        >
                          {i + 1}
                        </Text>
                      </CocolonPressable>
                    );
                  })}
                </View>
              ) : null}

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
                            color={colors.ACCENT_TEXT}
                            style={{ marginRight: 4 }}
                          />
                          <Text style={[styles.qStatusText, styles.qStatusTextAnswered]}>
                            {answeredStatusLabel}
                          </Text>
                        </View>
                      ) : (
                        <View style={[styles.qStatusPill, { opacity: 0.7 }]}>
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
                          placeholderTextColor={colors.TEXT_ON_LIGHT}
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
                              オンにするとMyModel照会時に反映されません。{"\n"}分析レポートには反映されます。
                            </Text>
                          </View>
                        </View>
                        <CocolonSwitch
                          value={isSecret}
                          onValueChange={(v) => setSecretValue(q.id, v)}
                          disabled={secretDisabled}
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
                  color="#FFFFFF"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.goldButtonText}>保存する</Text>
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

  return StyleSheet.create({
    // ベース
    container: { flex: 1, backgroundColor: COLORS.PANEL_BG },
    body: { flex: 1 },
    bodyContent: {
      paddingTop: 16,
      alignItems: "stretch",
      paddingHorizontal: 18,
      paddingBottom: 32,
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
      fontSize: font.title ?? 20,
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
      fontSize: font.sectionLabel ?? 12,
      fontWeight: "700",
      color: text.sectionLabel ?? text.primary ?? COLORS.TEXT_ON_LIGHT,
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
      fontSize: 10,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
    },
    progressRow: {
      marginTop: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    progressText: {
      fontSize: font.sectionLabel ?? 12,
      fontWeight: "800",
      color: text.sectionLabel ?? text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    progressSubText: {
      fontSize: 12,
      color: COLORS.TEXT_ON_LIGHT,
      opacity: 0.85,
    },

    pageTabsRow: {
      marginTop: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
    },
    pageTab: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 12,
      height: 32,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      marginRight: 6,
      marginBottom: 6,
    },
    pageTabActive: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    pageTabLocked: {
      opacity: 0.6,
    },
    pageTabText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    pageTabTextActive: {
      color: COLORS.ACCENT_TEXT,
    },

    qBlock: {
      marginBottom: 14,
      padding: 12,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
    },
    qHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 6,
    },
    qLabel: {
      fontSize: font.sectionLabel ?? 12,
      fontWeight: "800",
      color: text.sectionLabel ?? text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    qStatusPill: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    qStatusPillAnswered: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    qStatusText: {
      fontSize: 11,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },
    qStatusTextAnswered: {
      color: COLORS.ACCENT_TEXT,
    },
    qText: {
      fontSize: font.body ?? 14,
      lineHeight: 20,
      fontWeight: "700",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginBottom: 6,
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
      fontSize: font.body ?? 14,
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
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

    lockedCard: {
      marginTop: 10,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    lockedText: {
      fontSize: 11,
      lineHeight: 16,
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 10,
    },
    lockedBtn: {
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
    lockedBtnText: {
      marginLeft: 6,
      fontSize: 12,
      fontWeight: "800",
      color: "#FFFFFF",
    },

    /**
     * 設定風トグル（文章 + ON/OFF）
     * - InputScreen の「シークレットメモ」と同じ見た目
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
      fontSize: font.description ?? 9,
      lineHeight: 15,
      color: text.description ?? COLORS.TEXT_ON_LIGHT,
    },

    actions: {
      marginTop: 6,
      alignItems: "stretch",
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
  });
}
