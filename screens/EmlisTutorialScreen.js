import React, { useEffect, useMemo, useRef, useState } from "react";
import { AccessibilityInfo, Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CocolonBackButton from "../components/CocolonBackButton";
import CocolonButton from "../components/CocolonButton";
import { useTheme } from "../theme/ThemeContext";
import { useTutorial } from "../TutorialContext";
import { makeUiTokens } from "../ui/uiTokens";
import EmlisTutorialResults from "./tutorial/EmlisTutorialResults";

const STAGES = [
  "welcome", "record", "question", "reply", "piece", "library", "post", "chart", "map", "summary",
];
const QUESTION = "どんなところに、いちばんほっとしましたか？";
const ANSWER = "先の約束を守りながら、同僚の手伝いもできたことです。";
const SUMMARY = [
  ["ホーム", "気持ちや出来事を記録する"],
  ["Emlisからの応答", "記録への返事を読む。問いが出たら答えることもできる"],
  ["ピース", "記録を画像にして保存する。投稿するとフォロワーに届けられる"],
  ["分析", "気持ちの変化や、自分が大切にしてきたことを振り返る"],
];

export default function EmlisTutorialScreen({ navigation, route }) {
  const { colors, themeName } = useTheme();
  const { endTutorial, skipTutorial } = useTutorial();
  const styles = useMemo(
    () => createStyles(colors, makeUiTokens(colors, themeName)),
    [colors, themeName]
  );
  const firstVisit = route.params?.entry === "first";
  const [stageIndex, setStageIndex] = useState(0);
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

  const back = () => {
    setStageIndex((current) => current === stageIndex ? current - 1 : current);
  };

  const exit = async (completed) => {
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
  };

  const showProgress = stage !== "welcome";
  const replyVisible = stage === "reply";

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
              <Text style={styles.body}>サンプルの記録で、Emlisを試してみましょう。</Text>
              <CocolonButton title="はじめる" onPress={advance} disabled={closing} />
              <CocolonButton
                title={firstVisit ? "あとで" : "閉じる"}
                variant="secondary"
                onPress={() => exit(false)}
                disabled={closing}
              />
            </>
          )}

          {stage === "record" && (
            <>
              <Text accessibilityRole="header" style={styles.title}>ホーム</Text>
              <View style={styles.card}>
                <Text style={styles.label}>サンプルの記録</Text>
                <View style={styles.field}>
                  <Text style={styles.label}>考えたこと・感じたこと</Text>
                  <Text style={styles.body}>少しほっとした。</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>出来事・行動</Text>
                  <Text style={styles.body}>資料の確認だけ引き受けた。</Text>
                </View>
                <View style={styles.tags}>
                  <Text style={styles.tag}>平穏・中</Text>
                  <Text style={styles.tag}>仕事</Text>
                </View>
              </View>
              <CocolonButton title="この内容でOK" onPress={advance} />
            </>
          )}

          {(stage === "question" || replyVisible) && (
            <>
              <Text accessibilityRole="header" style={styles.title}>Emlisからの応答</Text>
              <View style={styles.card}>
                <Text style={styles.body}>資料の確認だけを引き受けて、少しほっとしたんですね。</Text>
                <Text style={styles.prompt}>{QUESTION}</Text>
              </View>
              {replyVisible ? (
                <>
                  <View style={[styles.card, styles.answer]}>
                    <Text style={styles.label}>あなたの回答</Text>
                    <Text style={styles.body}>{ANSWER}</Text>
                  </View>
                  <View style={styles.card}>
                    <Text accessibilityRole="header" style={styles.label}>Emlis</Text>
                    <Text accessibilityLiveRegion="polite" style={styles.body}>
                      先の約束も、同僚を手伝いたい気持ちも、どちらも大切にできたんですね。できる範囲で力になれたこと、Emlisも嬉しいです。
                    </Text>
                  </View>
                  <CocolonButton title="ピースの作成" onPress={advance} />
                </>
              ) : (
                <CocolonButton title={ANSWER} variant="secondary" onPress={advance} />
              )}
            </>
          )}

          <EmlisTutorialResults stage={stage} onAdvance={advance} />

          {stage === "summary" && (
            <>
              <Text accessibilityRole="header" style={styles.title}>Emlisの使い方</Text>
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
    prompt: { ...ui.typography.sectionTitle, color: ui.text.primary },
    card: {
      padding: 16, gap: 12, borderRadius: ui.radius.card, borderWidth: 1,
      borderColor: colors.CARD_BORDER, backgroundColor: colors.PANEL_BG,
    },
    field: { gap: 4, borderRadius: ui.radius.lg, padding: 12, backgroundColor: colors.FIELD_BG },
    tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    tag: {
      ...ui.typography.description, backgroundColor: colors.SURFACE_TONAL,
      color: colors.ON_SURFACE_TONAL, paddingHorizontal: 12, paddingVertical: 4, borderRadius: ui.radius.pill,
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
