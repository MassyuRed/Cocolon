import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppRuntime } from "../AppRuntimeContext";
import { useAuth } from "../AuthContext";
import { useSubscription } from "../SubscriptionContext";
import CocolonButton from "../components/CocolonButton";
import CocolonPressable from "../components/CocolonPressable";
import CocolonSwitch from "../components/CocolonSwitch";
import useDeepInsight, { isUnanswered } from "../features/home/useDeepInsight";
import { useTheme } from "../theme/ThemeContext";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { makeUiTokens } from "../ui/uiTokens";
import { AnalysisSubHeader } from "./AnalysisMenuCommon";

const TITLE = "わたしを知る問い";
const THEMES = ["人間関係", "自分の価値観", "仕事・学び", "日々の過ごし方", "これからのこと"];
const LANE_LABELS = { records: "記録をふりかえる", theme: "テーマから考える" };
const MAX_ANSWER_LENGTH = 2000;
const SOURCE_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const NIL_ID = "00000000-0000-0000-0000-000000000000";
const validSourceId = (id) => typeof id === "string" && id !== NIL_ID && SOURCE_ID.test(id);
const THEME_TIME_FORMAT = new Intl.DateTimeFormat("ja-JP", {
  month: "long", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Tokyo",
});
export const DeepInsightReturnCacheContext = createContext(null);

export default function DeepInsightScreen({ navigation, route }) {
  const { user, authOwnerGeneration } = useAuth();
  const { tier, planCode, entitlementStatus, expiresAt } = useSubscription();
  const returnCache = useContext(DeepInsightReturnCacheContext);
  const accessKey = JSON.stringify([user?.id, authOwnerGeneration, tier, planCode, entitlementStatus, expiresAt]);
  const { colors, themeName } = useTheme();
  const styles = useMemo(() => createStyles(colors, themeName), [colors, themeName]);
  const notification = route?.params?.notification;
  const scroll = useRef(null);

  useEffect(() => {
    if (notification?.lane === "theme") scroll.current?.scrollTo({ y: 0, animated: false });
  }, [notification]);

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.screen}>
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <AnalysisSubHeader title={TITLE} onBack={() => navigation.goBack()} />
          {user?.id ? (
            <DeepInsightContent
              key={accessKey}
              ownerId={user.id}
              accessKey={accessKey}
              returnCache={returnCache}
              expiresAt={expiresAt}
              notification={notification}
              scroll={scroll}
              navigation={navigation}
              styles={styles}
              colors={colors}
            />
          ) : <Text style={styles.body}>利用するにはログインしてください。</Text>}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function DeepInsightContent({ ownerId, accessKey, returnCache, expiresAt, notification, scroll, navigation, styles, colors }) {
  const { data, loadError, notifiedQuestion, notificationReadFailed, themeRefreshError, questionLoads, questionErrors,
    reload, refreshTheme, issueRecords, issueTheme, answer,
    notificationSaving, notificationError, setThemeNotification } = useDeepInsight(ownerId, notification, { accessKey, returnCache, expiresAt });
  const { isFeatureEnabled } = useAppRuntime();
  const { subscriptionBootstrap, tier } = useSubscription();
  const [theme, setTheme] = useState(null);
  const [drafts, setDrafts] = useState({});
  const inFlightAnswers = useRef(new Set());
  const scrolledNotification = useRef(null);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  const openingPiece = useRef(false);
  useEffect(() => navigation.addListener("focus", () => { openingPiece.current = false; }), [navigation]);
  const pieceSelection = useRef(null);
  const canCreatePiece = data?.can_use_records === true && tier === "premium" &&
    isFeatureEnabled("piece_v2_preview_enabled", false) === true;
  pieceSelection.current = canCreatePiece ? { data, notifiedQuestion } : null;

  const updateDraft = (id, fields) => setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...fields } }));

  const saveAnswer = async (question) => {
    const id = question.id;
    const text = drafts[id]?.text?.trim();
    if (!text || inFlightAnswers.current.has(id)) return;
    inFlightAnswers.current.add(id);
    updateDraft(id, { saving: true, error: false });
    try {
      if (await answer(question, text)) updateDraft(id, { text: "" });
    } catch (error) {
      if (error?.name !== "AbortError" && error?.name !== "AccountChangedError") updateDraft(id, { error: true });
    } finally {
      inFlightAnswers.current.delete(id);
      updateDraft(id, { saving: false });
    }
  };

  const renderAnswer = (question, showTheme = true) => (
    <AnswerForm key={question.id} question={question} draft={drafts[question.id]} styles={styles} colors={colors}
      showTheme={showTheme} onChangeText={(text) => updateDraft(question.id, { text })} onSave={() => saveAnswer(question)} />
  );

  const openPiece = ({ id, piece_source_input_id: inputId }) => {
    const active = pieceSelection.current;
    if (!mounted.current || openingPiece.current || navigation.isFocused?.() === false ||
        AppState.currentState !== "active" || !active ||
        ![active.data.records, ...(active.data.history || []), active.notifiedQuestion].some((row) =>
          row?.id === id && row.lane === "records" && row.answered_at && row.piece_source_input_id === inputId)) return;
    openingPiece.current = true;
    try {
      const bytes = new Uint8Array(16);
      globalThis.crypto.getRandomValues(bytes);
      const idempotencyKey = "piece-preview-" + Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
      navigation.getParent().navigate("Piece", {
        screen: "PieceCreate", initial: false, params: { savedInput: {
          savedInputId: inputId, expectedUserId: ownerId, idempotencyKey, deepInsightQuestionId: id,
        } },
      });
    } catch {
      openingPiece.current = false;
      Alert.alert("ピースの作成", "作成画面を開けませんでした。もう一度お試しください。");
    }
  };

  if (loadError) {
    return (
      <View style={styles.card}>
        <Text style={styles.error} accessibilityRole="alert">問いと回答を読み込めませんでした。</Text>
        <CocolonButton variant="secondary" onPress={reload}>再読み込み</CocolonButton>
      </View>
    );
  }

  if (!data) return <ActivityIndicator color={colors.TITLE_GOLD} accessibilityLabel="問いを読み込み中" />;

  const recordPending = isUnanswered(data.records);
  const premiumPlan = subscriptionBootstrap?.plans?.premium;
  const canOfferPremium = premiumPlan?.visible === true && premiumPlan?.purchasable === true
    && subscriptionBootstrap.sales_enabled !== false && subscriptionBootstrap.client_sales_enabled !== false
    && isFeatureEnabled("subscription_sales_enabled", true);
  const showRecords = notificationReadFailed || recordPending || data.can_use_records !== false || canOfferPremium;
  const themePending = isUnanswered(data.theme);
  const nextThemeAt = Date.parse(data.theme_next_available_at);
  const nextThemeLabel = Number.isFinite(nextThemeAt) ? THEME_TIME_FORMAT.format(nextThemeAt) : null;
  const history = (data.history || []).filter((item) =>
    !(recordPending && item.id === data.records.id) && !(themePending && item.id === data.theme.id));
  const notifiedHistoryQuestion = notifiedQuestion
    && !(recordPending && data.records.id === notifiedQuestion.id) ? notifiedQuestion : null;
  const displayedHistory = notifiedHistoryQuestion
    ? [notifiedHistoryQuestion, ...history.filter((item) => item.id !== notifiedHistoryQuestion.id)]
    : history;
  let notificationTarget = null;
  if (notification?.lane === "records") {
    if (notificationReadFailed) notificationTarget = "records";
    else if (notifiedQuestion?.id === notification.questionId) {
      notificationTarget = notifiedHistoryQuestion ? "history" : "records";
    }
  }
  const scrollToNotification = (section) => section === notificationTarget
    ? ({ nativeEvent: { layout: { y } } }) => {
      const previous = scrolledNotification.current;
      if (!scroll.current || (previous?.notification === notification && !previous.readFailed)) return;
      if (previous?.notification !== notification || previous.section !== section) {
        scroll.current.scrollTo({ y, animated: false });
      }
      scrolledNotification.current = { notification, section, readFailed: notificationReadFailed };
    } : undefined;

  const recordsCard = showRecords && (
    <View key="records" style={styles.card} onLayout={scrollToNotification("records")}>
      <Text accessibilityRole="header" style={styles.heading}>{LANE_LABELS.records}</Text>
      {notificationReadFailed && (
        <>
          <Text style={styles.error} accessibilityRole="alert">通知に対応する問いを読み込めませんでした。</Text>
          <CocolonButton variant="secondary" onPress={reload}>もう一度確認する</CocolonButton>
        </>
      )}
      {recordPending ? (
        renderAnswer(data.records)
      ) : data.can_use_records === false ? (
        <>
          <Text style={styles.body}>記録やこれまでの回答から、考えを深める問いを受け取れます。Premiumで利用できます。</Text>
          <CocolonButton variant="secondary" onPress={() => navigation.navigate("SubscriptionSelect")}>プランを見る</CocolonButton>
        </>
      ) : questionLoads.records ? (
        <ActivityIndicator color={colors.TITLE_GOLD} accessibilityLabel="ふりかえりの問いを確認中" />
      ) : questionErrors.records ? (
        <>
          <Text style={styles.error} accessibilityRole="alert">ふりかえりの問いを確認できませんでした。</Text>
          <CocolonButton variant="secondary" onPress={issueRecords}>もう一度確認する</CocolonButton>
        </>
      ) : (
        <Text style={styles.body}>
          {data.records?.answered_at ? "回答を保存しました。回答の履歴から見返せます。" : "今は新しいふりかえりの問いがありません。"}
        </Text>
      )}
    </View>
  );

  const themeCard = (
    <View key="theme" style={styles.card}>
      <Text accessibilityRole="header" style={styles.heading}>{LANE_LABELS.theme}</Text>
      {!data.can_use_theme && (
        <Text style={styles.body}>今はテーマの問いを受け取れません。</Text>
      )}
      {themePending ? (
        renderAnswer(data.theme)
      ) : data.can_use_theme && (data.theme_available_today ? (
        <>
          <Text style={styles.body}>考えたいテーマを選んでください。</Text>
          <View style={styles.themes}>
            {THEMES.map((item) => (
              <CocolonPressable
                key={item}
                onPress={() => setTheme(item)}
                disabled={questionLoads.theme}
                accessibilityLabel={item}
                accessibilityState={{ selected: theme === item }}
                style={[styles.theme, theme === item && styles.themeSelected]}
              >
                <Text style={[styles.themeLabel, theme === item && styles.themeSelectedLabel]}>{item}</Text>
              </CocolonPressable>
            ))}
          </View>
          {questionErrors.theme && <Text style={styles.error} accessibilityRole="alert">テーマの問いを受け取れませんでした。もう一度お試しください。</Text>}
          <CocolonButton disabled={!theme} loading={questionLoads.theme} onPress={() => issueTheme(theme)}>
            問いを受け取る
          </CocolonButton>
        </>
      ) : (
        data.theme?.answered_at ? <Text style={styles.body}>回答を保存しました。回答の履歴から見返せます。</Text>
          : !nextThemeLabel && <Text style={styles.body}>テーマの問いは発行済みです。</Text>
      ))}
      {data.can_use_theme && !data.theme_available_today && nextThemeLabel && (
        <Text style={styles.detail}>次の問いは{nextThemeLabel}（日本時間）から受け取れます。</Text>
      )}
      {themeRefreshError && (
        <>
          <Text style={styles.error} accessibilityRole="alert">新しい問いを受け取れるか確認できませんでした。</Text>
          <CocolonButton variant="secondary" onPress={refreshTheme}>もう一度確認する</CocolonButton>
        </>
      )}
      {data.can_use_theme && typeof data.theme_notification_enabled === "boolean" && (
        <>
          <View style={styles.notificationRow}>
            <Text style={styles.notificationLabel}>次の問いを受け取れるときに通知する</Text>
            <CocolonSwitch accessibilityLabel="次の問いを受け取れるときに通知する"
              value={data.theme_notification_enabled} onValueChange={setThemeNotification}
              disabled={notificationSaving} iosRightInset={0} />
          </View>
          {notificationError && <Text accessibilityRole="alert" style={styles.error}>通知設定を保存できませんでした。</Text>}
        </>
      )}
    </View>
  );

  const historyCard = (
    <View key="history" style={styles.card} onLayout={scrollToNotification("history")}>
      <Text accessibilityRole="header" style={styles.heading}>回答の履歴</Text>
      {displayedHistory.length === 0 && <Text style={styles.body}>まだ履歴はありません。</Text>}
      {displayedHistory.map((question) => (
        <View key={question.id} style={styles.historyItem}>
          <Text style={styles.detail}>{question.issued_on} · {question.theme || LANE_LABELS[question.lane]}</Text>
          {isUnanswered(question) ? (
            renderAnswer(question, false)
          ) : (
            <>
              <Text style={styles.question}>{question.question_text}</Text>
              <Text style={styles.body} selectable>{question.answer_text}</Text>
              {canCreatePiece && question.lane === "records" && question.answered_at &&
                validSourceId(question.id) && validSourceId(question.piece_source_input_id) && (
                  <CocolonButton variant="secondary" onPress={() => openPiece(question)}>
                    この回答を含めてピースを作成
                  </CocolonButton>
              )}
            </>
          )}
        </View>
      ))}
    </View>
  );

  return [themeCard, recordsCard, historyCard];
}

function AnswerForm({ question, draft, styles, colors, showTheme, onChangeText, onSave }) {
  const { text = "", saving = false, error = false } = draft || {};
  return (
    <View style={styles.form}>
      {showTheme && question.theme && <Text style={styles.detail}>{question.theme}</Text>}
      <Text style={styles.question}>{question.question_text}</Text>
      <TextInput
        accessibilityLabel={`${LANE_LABELS[question.lane]}への回答`}
        placeholder="わたしの言葉で答える"
        placeholderTextColor={colors.TEXT_SUBTLE}
        value={text}
        onChangeText={onChangeText}
        editable={!saving}
        maxLength={MAX_ANSWER_LENGTH}
        multiline
        style={styles.input}
      />
      {error && <Text accessibilityRole="alert" style={styles.error}>回答を保存できませんでした。もう一度お試しください。</Text>}
      <CocolonButton disabled={!text.trim()} loading={saving} onPress={onSave}>回答を保存する</CocolonButton>
    </View>
  );
}

function createStyles(colors, themeName) {
  const ui = makeUiTokens(colors, themeName);
  return StyleSheet.create(applyTypographyTokens({
    screen: { flex: 1, backgroundColor: colors.BG_SILVER },
    content: { width: "100%", maxWidth: 600, alignSelf: "center", padding: 20, paddingBottom: 32, gap: 16 },
    card: { gap: 12, padding: 16, borderWidth: 1, borderColor: colors.CARD_BORDER, borderRadius: ui.radius.card, backgroundColor: colors.PANEL_BG },
    heading: { ...ui.typography.sectionTitle, color: colors.TITLE_GOLD },
    question: { fontSize: ui.font.body, color: colors.TEXT_ON_LIGHT, fontWeight: "600", lineHeight: 25 },
    body: { fontSize: ui.font.body, color: colors.TEXT_ON_LIGHT, lineHeight: 24 },
    detail: { ...ui.typography.meta, color: colors.TEXT_SUBTLE },
    error: { fontSize: ui.font.body, color: colors.ERROR, lineHeight: 24 },
    form: { gap: 12 },
    input: { minHeight: 104, padding: 12, fontSize: ui.font.body, textAlignVertical: "top", color: colors.TEXT_ON_LIGHT, borderRadius: 12, borderWidth: 1, borderColor: colors.CARD_BORDER, backgroundColor: colors.FIELD_BG },
    themes: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    theme: { paddingHorizontal: 12, minHeight: 44, justifyContent: "center", borderWidth: 1, borderColor: colors.CARD_BORDER, borderRadius: 22 },
    themeSelected: { backgroundColor: colors.SURFACE_TONAL, borderColor: colors.TITLE_GOLD },
    themeLabel: { fontSize: ui.font.body, color: colors.TEXT_ON_LIGHT },
    themeSelectedLabel: { color: colors.ON_SURFACE_TONAL, fontWeight: "600" },
    notificationRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    notificationLabel: { flex: 1, fontSize: ui.font.body, color: colors.TEXT_ON_LIGHT, lineHeight: 24 },
    historyItem: { paddingVertical: 12, gap: 6, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.CARD_BORDER },
  }, ui));
}
