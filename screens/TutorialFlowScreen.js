import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CocolonButton from "../components/CocolonButton";
import TutorialOverlay, {
  syncTutorialSpotlightTarget,
  waitForTutorialFrames,
} from "../components/TutorialOverlay";
import { useTutorial } from "../TutorialContext";
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import {
  TUTORIAL_CONNECTION_ROWS,
  TUTORIAL_OTHER_ELEMENTS_GUIDE,
  TUTORIAL_TOTAL_STEPS,
} from "../tutorial/tutorialScenarioData";

const STEP_INTRO = 1;
const STEP_CONNECTION = 16;
const STEP_OTHER = 17;
const STEP_FINISH = 18;

export default function TutorialFlowScreen({ navigation }) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";
  const { height: windowHeight } = useWindowDimensions();
  const safeInsets = useSafeAreaInsets();

  const {
    isTutorialMode,
    tutorialStep,
    setTutorialStep,
    endTutorial,
  } = useTutorial();

  const screenRootRef = useRef(null);
  const scrollRef = useRef(null);
  const currentScrollYRef = useRef(0);
  const connectionRef = useRef(null);
  const otherRef = useRef(null);
  const finishRef = useRef(null);
  const [tutorialTargetRect, setTutorialTargetRect] = useState(null);
  const [tutorialOverlayMetrics, setTutorialOverlayMetrics] = useState(null);
  const [finishing, setFinishing] = useState(false);

  const isTutorialFlowStep =
    !!isTutorialMode &&
    (tutorialStep === STEP_INTRO ||
      tutorialStep === STEP_CONNECTION ||
      tutorialStep === STEP_OTHER);

  const navigateHome = useCallback((options = {}) => {
    const markFinished = options?.markFinished === true;
    const params = markFinished ? { tutorialFinishedAt: Date.now() } : undefined;
    try {
      const parent =
        typeof navigation?.getParent === "function" ? navigation.getParent() : null;
      if (parent && typeof parent.navigate === "function") {
        parent.navigate("Input", {
          screen: "Input",
          params,
        });
        return;
      }
    } catch {
      // noop
    }

    try {
      navigation?.navigate?.("Input", params);
    } catch {
      // noop
    }
  }, [navigation]);

  const handleCompleteTutorial = useCallback(async () => {
    if (finishing) return;
    setFinishing(true);
    try {
      await endTutorial();
    } finally {
      setFinishing(false);
      requestAnimationFrame(() => {
        navigateHome({ markFinished: true });
      });
    }
  }, [endTutorial, finishing, navigateHome]);

  const getTutorialTargetRef = useCallback(() => {
    if (!isTutorialFlowStep) return null;
    if (tutorialStep === STEP_OTHER) return otherRef;
    if (tutorialStep === STEP_FINISH) return finishRef;
    return null;
  }, [isTutorialFlowStep, tutorialStep]);

  const tutorialOverlayConfig = useMemo(() => {
    if (!isTutorialFlowStep) return null;

    switch (tutorialStep) {
      case STEP_INTRO:
        return {
          step: STEP_INTRO,
          mode: "info",
          title: "Emlisについて",
          message:
            "Emlisは、感情入力をすることで様々な体験ができるアプリです。\n\n各画面の説明をします。",
          nextLabel: "ホーム画面へ",
          onNext: () => {
            setTutorialStep(2);
            requestAnimationFrame(() => navigateHome());
          },
          disableSpotlight: true,
          dimOpacity: 0,
        };
      case STEP_CONNECTION:
        return {
          step: STEP_CONNECTION,
          mode: "info",
          title: "Emlisについて",
          message:
            "Emlisのことを少しでもお分かりいただけたでしょうか？\n\n気軽に日々の感情や想いを言葉として入力してみてください。",
          nextLabel: "その他の機能へ",
          onNext: () => setTutorialStep(STEP_OTHER),
          disableSpotlight: true,
          dimOpacity: 0,
        };
      case STEP_OTHER:
        return {
          step: STEP_OTHER,
          mode: "info",
          title: "その他の機能",
          message:
            "感情入力に慣れてきたら、通知やランキングも少しずつ見てみてください。\n\n自分のペースで、Emlisの機能を広げていけます。",
          nextLabel: "終了へ",
          onNext: () => {
            setTutorialStep(STEP_FINISH);
            requestAnimationFrame(() => {
              try {
                scrollRef.current?.scrollToEnd?.({ animated: true });
              } catch {
                // noop
              }
            });
          },
        };
      case STEP_FINISH:
        return null;
      default:
        return null;
    }
  }, [isTutorialFlowStep, tutorialStep, setTutorialStep, navigateHome]);

  const syncTutorialTargetRect = useCallback(async () => {
    if (!isTutorialFlowStep) return null;
    const targetRef = getTutorialTargetRef();
    if (!targetRef || !screenRootRef.current) return null;

    return syncTutorialSpotlightTarget({
      enabled: isTutorialFlowStep,
      targetRef,
      rootRef: screenRootRef,
      scrollRef,
      currentScrollYRef,
      overlayMetrics: tutorialOverlayMetrics,
      windowHeight,
      safeInsets,
      cardPlacement: tutorialStep === STEP_FINISH ? "top" : "bottom",
      measureOptions: {
        maxAttempts: 3,
        settleFrames: 1,
      },
    });
  }, [
    getTutorialTargetRef,
    isTutorialFlowStep,
    safeInsets,
    tutorialOverlayMetrics,
    tutorialStep,
    windowHeight,
  ]);

  useLayoutEffect(() => {
    if (!isTutorialFlowStep) {
      setTutorialTargetRect(null);
      setTutorialOverlayMetrics(null);
      return;
    }

    let cancelled = false;
    const run = async () => {
      await waitForTutorialFrames(2);
      if (cancelled) return;
      const nextRect = await syncTutorialTargetRect();
      if (!cancelled) setTutorialTargetRect(nextRect);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [isTutorialFlowStep, tutorialStep, tutorialOverlayMetrics, syncTutorialTargetRect]);

  const shouldShowFinalSections = tutorialStep >= STEP_CONNECTION;

  return (
    <SafeAreaView ref={screenRootRef} collapsable={false} style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => {
          currentScrollYRef.current =
            e?.nativeEvent?.contentOffset?.y ?? currentScrollYRef.current;
        }}
      >
        <Text style={styles.screenTitle}>チュートリアル</Text>

        <View ref={connectionRef} collapsable={false} style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons
              name="git-branch-outline"
              size={18}
              color={colors.TITLE_GOLD}
              style={styles.cardIcon}
            />
            <Text style={styles.cardTitle}>感情入力からつながる3つの体験</Text>
          </View>
          <Text style={styles.cardLead}>
            Emlisは感情入力をすることで様々な機能を楽しむことができます。その中でも主要な3つの要素を説明します。
          </Text>
          {TUTORIAL_CONNECTION_ROWS.map((row, index) => (
            <View
              key={`${row?.title || "connection"}-${index}`}
              style={[styles.connectionRow, index === 0 && styles.connectionRowFirst]}
            >
              <Text style={styles.connectionTitle}>{String(row?.title || "")}</Text>
              <Text style={styles.connectionText}>{String(row?.description || "")}</Text>
              <Text style={styles.connectionExample}>{String(row?.example || "")}</Text>
            </View>
          ))}
        </View>

        {shouldShowFinalSections ? (
          <>
            <View ref={otherRef} collapsable={false} style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons
                  name="sparkles-outline"
                  size={18}
                  color={colors.TITLE_GOLD}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>{TUTORIAL_OTHER_ELEMENTS_GUIDE.title}</Text>
              </View>
              <Text style={styles.cardLead}>{TUTORIAL_OTHER_ELEMENTS_GUIDE.body}</Text>
            </View>

            <View ref={finishRef} collapsable={false} style={styles.finishCard}>
              <Text style={styles.finishTitle}>チュートリアルはこれにて終了です</Text>
              <Text style={styles.finishBody}>
                Emlisをお楽しみください。
              </Text>
              <CocolonButton
                variant="primary"
                onPress={handleCompleteTutorial}
                loading={finishing}
                disabled={finishing}
                accessibilityLabel="チュートリアルを終了してホームへ戻る"
              >
                ホームへ戻る
              </CocolonButton>
            </View>
          </>
        ) : null}
      </ScrollView>

      {tutorialOverlayConfig ? (
        <TutorialOverlay
          visible={isTutorialFlowStep}
          targetRect={tutorialOverlayConfig.disableSpotlight ? null : tutorialTargetRect}
          title={tutorialOverlayConfig.title}
          message={tutorialOverlayConfig.message}
          step={tutorialOverlayConfig.step}
          totalSteps={TUTORIAL_TOTAL_STEPS}
          mode={tutorialOverlayConfig.mode}
          nextLabel={tutorialOverlayConfig.nextLabel}
          onNext={tutorialOverlayConfig.onNext}
          onTargetPress={tutorialStep === STEP_FINISH ? handleCompleteTutorial : undefined}
          onMetricsChange={setTutorialOverlayMetrics}
          showStepPill={false}
          actionHint={tutorialOverlayConfig.actionHint}
          cardPlacement={tutorialStep === STEP_FINISH ? "top" : "bottom"}
          dimOpacity={tutorialOverlayConfig.dimOpacity}
          blockBackgroundTouches={tutorialOverlayConfig.blockBackgroundTouches !== false}
          primaryDisabled={finishing}
        />
      ) : null}
    </SafeAreaView>
  );
}

function createStyles(COLORS, ui) {
  const text = ui?.text || {};
  return StyleSheet.create(applyTypographyTokens({
    container: {
      flex: 1,
      backgroundColor: COLORS.PANEL_BG,
    },
    scrollContent: {
      paddingTop: 16,
      paddingBottom: 32,
      paddingHorizontal: 18,
      alignItems: "stretch",
    },
    screenTitle: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: "900",
      color: COLORS.TITLE_GOLD,
      textAlign: "center",
      marginBottom: 16,
    },
    card: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginBottom: 14,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    cardHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    cardIcon: {
      marginRight: 8,
    },
    cardTitle: {
      flex: 1,
      fontSize: 17,
      lineHeight: 24,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
    },
    cardLead: {
      fontSize: 14,
      lineHeight: 22,
      fontWeight: "600",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 6,
    },
    connectionRow: {
      borderTopWidth: 1,
      borderTopColor: COLORS.CARD_BORDER,
      paddingTop: 12,
      marginTop: 12,
    },
    connectionRowFirst: {
      marginTop: 10,
    },
    connectionTitle: {
      fontSize: 15,
      lineHeight: 22,
      fontWeight: "900",
      color: COLORS.TITLE_GOLD,
      marginBottom: 4,
    },
    connectionText: {
      fontSize: 13,
      lineHeight: 20,
      fontWeight: "600",
      color: COLORS.TEXT_ON_LIGHT,
    },
    connectionExample: {
      ...text.caption,
      marginTop: 4,
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },
    finishCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.BORDER_GOLD,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 16,
      paddingVertical: 18,
      marginTop: 2,
      marginBottom: 20,
    },
    finishTitle: {
      fontSize: 17,
      lineHeight: 24,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 8,
      textAlign: "center",
    },
    finishBody: {
      fontSize: 14,
      lineHeight: 22,
      fontWeight: "600",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 14,
      textAlign: "center",
    },
  }, ui));
}
