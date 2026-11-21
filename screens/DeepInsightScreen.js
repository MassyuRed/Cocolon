import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../AuthContext";
import CocolonButton from "../components/CocolonButton";
import CocolonPressable from "../components/CocolonPressable";
import useDeepInsight, { isUnanswered } from "../features/home/useDeepInsight";
import { useTheme } from "../theme/ThemeContext";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { makeUiTokens } from "../ui/uiTokens";
import { AnalysisSubHeader } from "./AnalysisMenuCommon";

const TITLE = "わたしを知る問い";
const THEMES = ["人間関係", "自分の価値観", "仕事・学び", "日々の過ごし方", "これからのこと"];
const LANE_LABELS = { records: "記録をふりかえる", theme: "テーマから考える" };
const MAX_ANSWER_LENGTH = 2000;

export default function DeepInsightScreen({ navigation }) {
  const { user, authOwnerGeneration } = useAuth();
  const { colors, themeName } = useTheme();
  const styles = useMemo(() => createStyles(colors, themeName), [colors, themeName]);

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <AnalysisSubHeader title={TITLE} onBack={() => navigation.goBack()} />
          {user?.id ? (
            <DeepInsightContent
              key={`${user.id}:${authOwnerGeneration}`}
              ownerId={user.id}
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

function DeepInsightContent({ ownerId, navigation, styles, colors }) {
  const { data, loadError, questionLoads, questionErrors, reload, issueRecords, issueTheme, answer } =
    useDeepInsight(ownerId);
  const [theme, setTheme] = useState(null);

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
  const themePending = isUnanswered(data.theme);
  const history = (data.history || []).filter((item) =>
    !(recordPending && item.id === data.records.id) && !(themePending && item.id === data.theme.id));

  return (
    <>
      <View style={styles.card}>
        <Text accessibilityRole="header" style={styles.heading}>{LANE_LABELS.records}</Text>
        {recordPending ? (
          <AnswerForm key={data.records.id} question={data.records} answer={answer} styles={styles} colors={colors} />
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

      <View style={styles.card}>
        <Text accessibilityRole="header" style={styles.heading}>{LANE_LABELS.theme}</Text>
        {!data.can_use_theme && (
          <>
            <Text style={styles.body}>気になるテーマを選ぶと、Emlisからそのテーマに沿った問いを受け取れます。Plus・Premiumで利用できます。</Text>
            <CocolonButton variant="secondary" onPress={() => navigation.navigate("SubscriptionSelect")}>プランを見る</CocolonButton>
          </>
        )}
        {themePending ? (
          <AnswerForm key={data.theme.id} question={data.theme} answer={answer} styles={styles} colors={colors} />
        ) : data.can_use_theme && (data.theme_available_today ? (
          <>
            <Text style={styles.body}>今日考えたいテーマを選んでください。</Text>
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
          <Text style={styles.body}>{data.theme?.answered_at ? "回答を保存しました。回答の履歴から見返せます。" : "今日のテーマから考える問いは発行済みです。"}</Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text accessibilityRole="header" style={styles.heading}>回答の履歴</Text>
        {history.length === 0 && <Text style={styles.body}>まだ履歴はありません。</Text>}
        {history.map((question) => (
          <View key={question.id} style={styles.historyItem}>
            <Text style={styles.detail}>{question.issued_on} · {question.theme || LANE_LABELS[question.lane]}</Text>
            {isUnanswered(question) ? (
              <AnswerForm question={question} answer={answer} styles={styles} colors={colors} showTheme={false} />
            ) : (
              <>
                <Text style={styles.question}>{question.question_text}</Text>
                <Text style={styles.body} selectable>{question.answer_text}</Text>
              </>
            )}
          </View>
        ))}
      </View>
    </>
  );
}

function AnswerForm({ question, answer, styles, colors, showTheme = true }) {
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const inFlight = useRef(false);

  const save = async () => {
    const text = draft.trim();
    if (!text || inFlight.current) return;
    inFlight.current = true;
    setSaving(true);
    setError(false);
    try {
      await answer(question, text);
    } catch (requestError) {
      if (requestError?.name !== "AbortError" && requestError?.name !== "AccountChangedError") setError(true);
    } finally {
      inFlight.current = false;
      setSaving(false);
    }
  };

  return (
    <View style={styles.form}>
      {showTheme && question.theme && <Text style={styles.detail}>{question.theme}</Text>}
      <Text style={styles.question}>{question.question_text}</Text>
      <TextInput
        accessibilityLabel={`${LANE_LABELS[question.lane]}への回答`}
        placeholder="わたしの言葉で答える"
        placeholderTextColor={colors.TEXT_SUBTLE}
        value={draft}
        onChangeText={setDraft}
        editable={!saving}
        maxLength={MAX_ANSWER_LENGTH}
        multiline
        style={styles.input}
      />
      {error && <Text accessibilityRole="alert" style={styles.error}>回答を保存できませんでした。もう一度お試しください。</Text>}
      <CocolonButton disabled={!draft.trim()} loading={saving} onPress={save}>回答を保存する</CocolonButton>
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
    historyItem: { paddingVertical: 12, gap: 6, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.CARD_BORDER },
  }, ui));
}
