import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AccessibilityInfo, Animated, BackHandler, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonBackButton from "../components/CocolonBackButton";
import CocolonButton from "../components/CocolonButton";
import CocolonPressable from "../components/CocolonPressable";
import { useTheme } from "../theme/ThemeContext";
import { useTutorial } from "../TutorialContext";
import { makeUiTokens } from "../ui/uiTokens";
import InputCategorySection from "./input/InputCategorySection";
import InputEmotionSection from "./input/InputEmotionSection";
import { SELF_INSIGHT } from "./input/inputOptions";
import EmlisTutorialResults from "./tutorial/EmlisTutorialResults";

const STAGES = [
  "welcome", "record", "question", "reply", "piece", "library", "post", "chart", "map", "summary",
];
const QUESTION = "どんなところに、いちばんほっとしましたか？";
const ANSWER = "先の約束を守りながら、同僚の手伝いもできたことです。";
const RECORD_FIELDS = [
  { id: "thought", label: "考えたこと・感じたこと", value: "少しほっとした。" },
  { id: "action", label: "出来事・行動", value: "先に約束していた提出に間に合うよう、同僚の資料の確認だけ引き受けた。" },
];
const SUMMARY = [
  ["感情入力", "「ホーム」で記録を保存。「入力履歴」から記録とEmlisの応答を見返す。"],
  ["ピース", "Emlisの応答からピースを作る。「ピース」→「自分のピースを開く」で編集後の画像を確認。"],
  ["フォロー機能", "「ピース」→「投稿」「感情通知」で、相手が公開した内容を見る。"],
  ["分析", "「分析」→「こころグラフ」「わたしマップ」で、気持ちの変化や選び方を振り返る。"],
];

function TutorialRecord({ visible, onSave, colors, styles }) {
  const [field, setField] = useState(null);
  const [opened, setOpened] = useState(false);
  const [emotions, setEmotions] = useState([]);
  const [categories, setCategories] = useState([]);
  const strengthRowRefs = useRef({});
  const selectedCalm = emotions.length === 1 && emotions[0].type === "平穏";
  const calmWeak = selectedCalm && emotions[0].strength === "weak";
  const ready = opened && calmWeak && categories.length === 1 && categories.includes("仕事");

  if (!visible) return null;

  const toggleEmotion = (type) => setEmotions((current) => {
    if (current.some((entry) => entry.type === type)) return current.filter((entry) => entry.type !== type);
    if (type === SELF_INSIGHT) return [{ type, strength: "medium" }];
    return [...current, { type, strength: "medium" }];
  });
  const changeStrength = (type, strength) => setEmotions((current) => (
    current.map((entry) => entry.type === type ? { ...entry, strength } : entry)
  ));
  const toggleCategory = (category) => setCategories((current) => (
    current.includes(category) ? current.filter((item) => item !== category) : [...current, category]
  ));

  return (
    <>
      <Text accessibilityRole="header" style={styles.title}>ホームで記録する</Text>
      {!opened && (
        <Text style={styles.instruction}>「考えたこと・感じたこと」か「出来事・行動」をタップすると、文章を書く欄が開きます。どちらかを開いてみましょう。</Text>
      )}
      <View style={styles.card}>
        <Text style={styles.label}>言葉にしてみる</Text>
        {RECORD_FIELDS.map(({ id, label, value }) => (
          <View key={id}>
            <CocolonPressable
              testID={`emlis-tutorial-record-${id}`}
              style={styles.field}
              accessibilityLabel={label}
              accessibilityState={{ expanded: field === id }}
              onPress={() => {
                setField((current) => current === id ? null : id);
                setOpened(true);
              }}
            >
              <Text style={[styles.body, styles.fieldLabel]}>{label}</Text>
              <Ionicons name={field === id ? "chevron-up" : "chevron-down"} size={18} color={colors.TITLE_GOLD} accessible={false} />
            </CocolonPressable>
            {field === id && <Text style={styles.example} accessibilityLiveRegion="polite">{value}</Text>}
          </View>
        ))}
      </View>
      {opened && (
        <>
          <Text accessibilityLiveRegion="polite" style={styles.instruction}>
            {selectedCalm
              ? (calmWeak ? "「平穏」の強さが「弱」になりました。" : "少しほっとした記録なので、「平穏の強さ」で「弱」をタップしましょう。")
              : "「今の気持ち」で「平穏」だけを選びましょう。選んだ感情は、もう一度押すと外せます。"}
          </Text>
          <InputEmotionSection
            selectedEmotions={emotions}
            isSelfInsightSelected={emotions.some((entry) => entry.type === SELF_INSIGHT)}
            toggleEmotion={toggleEmotion}
            changeStrength={changeStrength}
            strengthRowRefs={strengthRowRefs}
            colors={colors}
            styles={styles}
          />
        </>
      )}
      {opened && calmWeak && (
        <>
          <Text accessibilityLiveRegion="polite" style={styles.instruction}>
            {ready ? "「この内容でOK」を押すと記録が保存され、Emlisからの応答を開けます。" : "「どんな場面？」で「仕事」だけを選びましょう。普段は近い場面を複数選べます。"}
          </Text>
          <InputCategorySection
            hasMemoInput
            hasSelectedCategories={categories.length > 0}
            selectedCategories={categories}
            toggleCategory={toggleCategory}
            styles={styles}
          />
        </>
      )}
      <CocolonButton testID="emlis-tutorial-confirm-record" title="この内容でOK" disabled={!ready} onPress={ready ? onSave : undefined} />
    </>
  );
}

export default function EmlisTutorialScreen({ navigation, route }) {
  const { colors, themeName } = useTheme();
  const { endTutorial, skipTutorial } = useTutorial();
  const styles = useMemo(
    () => createStyles(colors, makeUiTokens(colors, themeName)),
    [colors, themeName]
  );
  const firstVisit = route.params?.entry === "first";
  const [stageIndex, setStageIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(true);
  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);
  const scrollRef = useRef(null);
  const transition = useRef(new Animated.Value(1)).current;
  const stage = STAGES[stageIndex];

  useEffect(() => {
    let current = true;
    let changed = false;
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", (enabled) => {
      changed = true;
      setReduceMotion(enabled);
    });
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (current && !changed) setReduceMotion(enabled);
    }).catch(() => {});
    return () => {
      current = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    if (reduceMotion || stageIndex === 0) {
      transition.setValue(1);
      return undefined;
    }
    transition.setValue(0);
    const animation = Animated.timing(transition, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [reduceMotion, stageIndex, transition]);

  const advance = () => {
    setStageIndex((current) => current === stageIndex ? current + 1 : current);
  };

  const back = useCallback(() => {
    if (stageIndex === 0) return;
    setStageIndex((current) => current === stageIndex ? current - 1 : current);
  }, [stageIndex]);

  const exit = useCallback(async (completed) => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    try {
      const result = firstVisit
        ? await (completed ? endTutorial() : skipTutorial())
        : undefined;
      if (result === false || !navigation.isFocused()) return;

      if (!firstVisit && !completed) {
        navigation.goBack();
        navigation.getParent()?.navigate("Settings");
      } else {
        navigation.popToTop();
      }
    } finally {
      closingRef.current = false;
      setClosing(false);
    }
  }, [endTutorial, firstVisit, navigation, skipTutorial]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!navigation.isFocused()) return false;
      if (closingRef.current) return true;
      if (stageIndex > 0) back();
      else void exit(false);
      return true;
    });
    return () => subscription.remove();
  }, [back, exit, navigation, stageIndex]);

  const showProgress = stage !== "welcome";
  const replyVisible = stage === "reply";
  const answerReady = answer.trim() === ANSWER;
  const finishQuestion = (sent) => {
    setAnswered(sent);
    advance();
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom", "left", "right"]}>
      {showProgress && (
        <View style={styles.toolbar}>
          <CocolonBackButton
            navigation={navigation}
            accessibilityLabel="前のステップに戻る"
            onPress={back}
            disabled={closing}
          />
          <View
            style={styles.progress}
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel="チュートリアルの進み具合"
            accessibilityValue={{ min: 0, max: STAGES.length - 1, now: stageIndex }}
          >
            <View style={[styles.progressFill, { width: `${(stageIndex / (STAGES.length - 1)) * 100}%` }]} />
          </View>
          <Text
            accessibilityRole="button"
            accessibilityState={{ disabled: closing }}
            onPress={closing ? undefined : () => exit(false)}
            style={styles.close}
          >
            {firstVisit ? "あとで" : "閉じる"}
          </Text>
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scroll, stage === "welcome" && styles.welcome]}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: transition.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }),
              transform: [{ translateY: transition.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
            },
          ]}
        >
          {stage === "welcome" && (
            <>
              <Text accessibilityRole="header" style={styles.title}>Emlis(エムリス)</Text>
              <Text style={styles.body}>練習用の記録で、ボタンを押しながら使い方を覚えましょう。練習した内容は自分の記録に残りません。</Text>
              <CocolonButton title="はじめる" onPress={advance} disabled={closing} />
              <CocolonButton
                title={firstVisit ? "あとで" : "閉じる"}
                variant="secondary"
                onPress={() => exit(false)}
                disabled={closing}
              />
            </>
          )}

          <TutorialRecord visible={stage === "record"} onSave={advance} colors={colors} styles={styles} />

          {(stage === "question" || replyVisible) && (
            <>
              <Text accessibilityRole="header" style={styles.title}>Emlisからの応答</Text>
              {!replyVisible && <Text style={styles.instruction}>記録を保存しました。問いが出たときは、答えを書くと、その内容に沿った応答が届きます。</Text>}
              <View style={styles.card}>
                <Text style={styles.body}>資料の確認だけを引き受けて、少しほっとしたんですね。</Text>
                <Text style={styles.label}>Emlisからの質問</Text>
                <Text style={styles.body}>{QUESTION}</Text>
              </View>
              {replyVisible ? (
                <>
                  {answered && (
                    <>
                      <View style={[styles.card, styles.answer]}>
                        <Text style={styles.label}>あなたの回答</Text>
                        <Text style={styles.body}>{ANSWER}</Text>
                      </View>
                      <View style={styles.card}>
                        <Text style={styles.label}>回答後の応答</Text>
                        <Text accessibilityLiveRegion="polite" style={styles.body}>
                          先の約束も、同僚を手伝いたい気持ちも、どちらも大切にできたんですね。できる範囲で力になれたこと、Emlisも嬉しいです。
                        </Text>
                      </View>
                    </>
                  )}
                  <Text style={styles.instruction}>
                    {answered ? "「この回答を含めてピースを作成」をタップすると、記録と回答を使って一枚にまとめられます。" : "問いをスキップしても記録は残ります。「ピースの作成」をタップして、記録を画像にしてみましょう。"}
                  </Text>
                  <CocolonButton title={answered ? "この回答を含めてピースを作成" : "ピースの作成"} onPress={advance} />
                </>
              ) : (
                <>
                  <Text accessibilityLiveRegion="polite" style={styles.instruction}>
                    {answerReady ? "「回答を送る」を押して、応答がどう変わるか見てみましょう。" : "普段は「この質問への回答」に自分の言葉を書きます。練習では「回答例を入力」を押しましょう。"}
                  </Text>
                  <TextInput testID="emlis-tutorial-answer-field" style={styles.answerField} value={answer} editable={false}
                    multiline placeholder="この質問への回答" placeholderTextColor={colors.TEXT_SUBTLE} accessibilityLabel="この質問への回答" />
                  {!answerReady && <CocolonButton title="回答例を入力" variant="secondary" onPress={() => setAnswer(ANSWER)} />}
                  <CocolonButton title="回答を送る" disabled={!answerReady} onPress={answerReady ? () => finishQuestion(true) : undefined} />
                  <CocolonButton title="今回はスキップ" variant="secondary" onPress={() => finishQuestion(false)} />
                </>
              )}
            </>
          )}

          <EmlisTutorialResults stage={stage} onAdvance={advance} includeAnswer={answered} />

          {stage === "summary" && (
            <>
              <Text accessibilityRole="header" style={styles.title}>Emlisの使い方</Text>
              <Text style={styles.body}>次に使うときは、この入口から開けます。</Text>
              <View style={styles.table}>
                {SUMMARY.map(([label, description], index) => (
                  <View key={label} style={[styles.row, index > 0 && styles.rowDivider]}>
                    <Text style={styles.rowLabel}>{label}</Text>
                    <Text style={styles.rowDescription}>{description}</Text>
                  </View>
                ))}
              </View>
              <CocolonButton title="自分の記録をはじめる" onPress={() => exit(true)} disabled={closing} />
            </>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors, ui) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.BG_SILVER },
    toolbar: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16 },
    progress: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.CARD_BORDER, overflow: "hidden" },
    progressFill: { height: "100%", backgroundColor: colors.TITLE_GOLD },
    close: { ...ui.typography.button, color: colors.TITLE_GOLD, padding: 12 },
    scroll: { flexGrow: 1, paddingHorizontal: 20, paddingVertical: 24 },
    welcome: { justifyContent: "center" },
    content: { width: "100%", maxWidth: 520, alignSelf: "center", gap: 16 },
    title: { ...ui.typography.screenTitle, color: colors.TITLE_GOLD },
    body: { ...ui.typography.body, color: ui.text.primary },
    label: { ...ui.typography.button, color: colors.TITLE_GOLD },
    instruction: {
      ...ui.typography.body, color: ui.text.primary, borderLeftWidth: 3,
      borderLeftColor: colors.TITLE_GOLD, paddingVertical: 6, paddingLeft: 12,
    },
    card: {
      padding: 16, gap: 12, borderRadius: ui.radius.card, borderWidth: 1,
      borderColor: colors.CARD_BORDER, backgroundColor: colors.PANEL_BG,
    },
    field: {
      minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8,
      borderRadius: ui.radius.lg, padding: 12, backgroundColor: colors.FIELD_BG, ...ui.sectionFrame,
    },
    fieldLabel: { flexShrink: 1 },
    example: { ...ui.typography.body, color: ui.text.primary, padding: 12 },
    heroFieldLabel: { ...ui.typography.sectionTitle, color: ui.text.primary },
    heroEmotionSection: { gap: 12, padding: 12, backgroundColor: colors.PANEL_BG, borderRadius: ui.radius.card, ...ui.sectionFrame },
    emotionSectionHeader: { flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", gap: 4 },
    emotionSectionMeta: { ...ui.typography.meta, color: colors.TEXT_SUBTLE },
    buttons: { gap: 6 },
    emotionRow: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
    emotionBlock: { alignItems: "stretch" },
    chip: { minHeight: 52, alignItems: "center", gap: 2, paddingVertical: 6, paddingHorizontal: 3 },
    chipText: { color: ui.text.primary, textAlign: "center" },
    chipTextOn: { color: colors.TITLE_GOLD },
    emotionIconSurface: { minWidth: 38, minHeight: 38, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: colors.FIELD_BG },
    emotionIconSurfaceOn: { backgroundColor: colors.GOLD_BUTTON },
    emotionFooter: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 },
    selfInsightCard: { justifyContent: "center", minHeight: 44, borderRadius: ui.radius.pill, backgroundColor: colors.FIELD_BG, paddingHorizontal: 10 },
    selfInsightCardOn: { backgroundColor: colors.SURFACE_TONAL },
    selfInsightRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    selfInsightText: { ...ui.typography.description, color: ui.text.primary },
    selfInsightTextOn: { color: colors.ON_SURFACE_TONAL },
    selfInsightHint: { ...ui.typography.meta, color: colors.TEXT_SUBTLE },
    strengthRow: { gap: 4 },
    strengthRowActive: { paddingTop: 6 },
    strengthLabel: { ...ui.typography.button, color: ui.text.primary },
    strengthOptions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    strengthChip: { minHeight: 44, minWidth: 52, alignItems: "center", justifyContent: "center", borderRadius: ui.radius.pill, backgroundColor: colors.FIELD_BG, ...ui.sectionFrame },
    strengthChipOn: { backgroundColor: colors.GOLD_BUTTON, borderColor: colors.GOLD_BUTTON_BORDER },
    strengthText: { ...ui.typography.button, color: ui.text.primary },
    strengthTextOn: { color: colors.ACCENT_TEXT },
    categorySection: { gap: 8 },
    categoryHeader: { flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", gap: 4 },
    categoryMetaText: { ...ui.typography.meta, color: colors.TEXT_SUBTLE },
    categoryHintText: { ...ui.typography.description, color: colors.TEXT_SUBTLE },
    categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    categoryChip: { minHeight: 44, minWidth: 54, paddingHorizontal: 12, justifyContent: "center", alignItems: "center",
      borderRadius: ui.radius.pill, backgroundColor: colors.FIELD_BG, borderWidth: 1, borderColor: colors.CARD_BORDER },
    categoryChipOn: { backgroundColor: colors.GOLD_BUTTON, borderColor: colors.GOLD_BUTTON_BORDER },
    categoryChipText: { ...ui.typography.button, color: ui.text.primary },
    categoryChipTextOn: { color: colors.ACCENT_TEXT },
    categoryRequiredText: { ...ui.typography.description, color: colors.TEXT_SUBTLE },
    answerField: {
      ...ui.typography.body, color: ui.text.primary, backgroundColor: colors.FIELD_BG,
      borderRadius: ui.radius.lg, borderWidth: 1, borderColor: colors.CARD_BORDER, minHeight: 80, padding: 12, textAlignVertical: "top",
    },
    answer: { backgroundColor: colors.SURFACE_TONAL },
    table: {
      borderRadius: ui.radius.lg, borderWidth: 1, borderColor: colors.CARD_BORDER,
      backgroundColor: colors.PANEL_BG,
    },
    row: { flexDirection: "row", gap: 12, padding: 12 },
    rowDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.CARD_BORDER },
    rowLabel: { flex: 2, ...ui.typography.button, color: colors.TITLE_GOLD },
    rowDescription: { flex: 3, ...ui.typography.description, color: ui.text.primary },
  });
}
