import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
import { CommonActions } from "@react-navigation/native";
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
import { navigationRef } from "../navigation/navigationRef";
import {
  TUTORIAL_CONNECTION_ROWS,
  TUTORIAL_INTRO_FLOWCHART,
  TUTORIAL_OTHER_ELEMENTS_GUIDE,
  TUTORIAL_TOTAL_STEPS,
} from "../tutorial/tutorialScenarioData";

const STEP_INTRO = 1;
const STEP_CONNECTION = 17;
const STEP_OTHER = 18;
const STEP_FINISH = 19;

const HOME_TAB_RESET_ROUTES = [
  "Input",
  "Analysis",
  "Piece",
  "RankingTop",
  "Settings",
];

function resetRootToHome(params) {
  try {
    if (!navigationRef.isReady()) return false;
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: HOME_TAB_RESET_ROUTES.map((name, index) => {
          if (index !== 0) return { name };
          return {
            name: "Input",
            params: {
              screen: "Input",
              params,
            },
            state: {
              index: 0,
              routes: [{ name: "Input", params }],
            },
          };
        }),
      })
    );
    return true;
  } catch {
    return false;
  }
}

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
  const mountedRef = useRef(true);
  const [tutorialTargetRect, setTutorialTargetRect] = useState(null);
  const [tutorialOverlayMetrics, setTutorialOverlayMetrics] = useState(null);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const isTutorialFlowStep =
    !!isTutorialMode &&
    (tutorialStep === STEP_INTRO ||
      tutorialStep === STEP_CONNECTION ||
      tutorialStep === STEP_OTHER);

  const navigateHome = useCallback((options = {}) => {
    const markFinished = options?.markFinished === true;
    const params = markFinished
      ? { tutorialFinishedAt: Date.now(), tutorialInitialReset: true }
      : undefined;

    if (markFinished && resetRootToHome(params)) {
      return;
    }

    try {
      navigation?.popToTop?.();
    } catch {
      // noop
    }

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
      if (navigationRef.isReady()) {
        navigationRef.navigate("Input", {
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

    let completed = false;
    try {
      await endTutorial();
      completed = true;
      requestAnimationFrame(() => {
        navigateHome({ markFinished: true });
      });
    } catch (e) {
      console.warn("TutorialFlowScreen: failed to complete tutorial", e);
    } finally {
      if (!completed && mountedRef.current) {
        setFinishing(false);
      }
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
            "まずは、感情入力からつながる4つの体験を確認します。",
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
            <Text style={styles.cardTitle}>感情入力からつながる4つの体験</Text>
          </View>
          {shouldShowFinalSections ? (
            <ConnectionSummaryTable rows={TUTORIAL_CONNECTION_ROWS} styles={styles} />
          ) : (
            <ConnectionIntroFlowchart data={TUTORIAL_INTRO_FLOWCHART} styles={styles} />
          )}
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


function ConnectionIntroFlowchart({ data, styles }) {
  const source = data?.source || {};
  const nodes = Array.isArray(data?.nodes) ? data.nodes : [];

  return (
    <>
      <Text style={styles.cardLead}>{String(data?.lead || "")}</Text>
      <View style={styles.flowchartRoot}>
        <View style={styles.flowSourceCard}>
          <Text style={styles.flowSourceTitle}>{String(source?.title || "")}</Text>
          <Text style={styles.flowSourceCaption}>{String(source?.caption || "")}</Text>
        </View>

        <View style={styles.flowConnectorWrap}>
          <View style={styles.flowConnectorLine} />
          <Text style={styles.flowConnectorArrow}>▼</Text>
          <View style={styles.flowConnectorPill}>
            <Text style={styles.flowConnectorLabel}>{String(data?.connector || "")}</Text>
          </View>
        </View>

        <View style={styles.flowNodeRows}>
          {nodes.map((node, index) => (
            <View
              key={`${node?.title || "flow-node"}-${index}`}
              style={[
                styles.flowNodeRow,
                index === nodes.length - 1 && styles.flowNodeRowLast,
              ]}
            >
              <View style={styles.flowBranchColumn}>
                <View
                  style={[
                    styles.flowBranchVerticalLine,
                    index === 0 && styles.flowBranchVerticalLineFirst,
                    index === nodes.length - 1 && styles.flowBranchVerticalLineLast,
                  ]}
                />
                <View style={styles.flowBranchDot} />
              </View>
              <View style={styles.flowBranchArm} />
              <View style={styles.flowNodeCard}>
                <Text style={styles.flowNodeLabel}>{String(node?.label || "")}</Text>
                <Text style={styles.flowNodeTitle}>{String(node?.title || "")}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}

function ConnectionSummaryTable({ rows, styles }) {
  const safeRows = Array.isArray(rows) ? rows : [];

  return (
    <>
      <Text style={styles.cardLead}>
        Emlisは感情入力をすることで様々な機能を楽しむことができます。その中でも主要な4つの要素を説明します。
      </Text>
      {safeRows.map((row, index) => (
        <View
          key={`${row?.title || "connection"}-${index}`}
          style={[styles.connectionRow, index === 0 && styles.connectionRowFirst]}
        >
          <Text style={styles.connectionTitle}>{String(row?.title || "")}</Text>
          <Text style={styles.connectionText}>{String(row?.description || "")}</Text>
          <Text style={styles.connectionExample}>{String(row?.example || "")}</Text>
        </View>
      ))}
    </>
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
    flowchartRoot: {
      marginTop: 12,
    },
    flowSourceCard: {
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: COLORS.BORDER_GOLD,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 14,
      paddingVertical: 12,
      alignItems: "center",
    },
    flowSourceTitle: {
      fontSize: 16,
      lineHeight: 23,
      fontWeight: "900",
      color: COLORS.TITLE_GOLD,
      textAlign: "center",
    },
    flowSourceCaption: {
      ...text.caption,
      marginTop: 2,
      color: text.description ?? COLORS.TEXT_SUBTLE,
      textAlign: "center",
    },
    flowConnectorWrap: {
      alignItems: "center",
      marginVertical: 10,
    },
    flowConnectorLine: {
      width: 2,
      height: 18,
      borderRadius: 1,
      backgroundColor: COLORS.BORDER_GOLD,
      opacity: 0.85,
    },
    flowConnectorArrow: {
      fontSize: 13,
      lineHeight: 16,
      fontWeight: "900",
      color: COLORS.TITLE_GOLD,
      marginTop: -1,
      marginBottom: 4,
    },
    flowConnectorPill: {
      borderRadius: 13,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 12,
      paddingVertical: 5,
      alignSelf: "center",
    },
    flowConnectorLabel: {
      fontSize: 12,
      lineHeight: 17,
      fontWeight: "900",
      color: COLORS.TITLE_GOLD,
      textAlign: "center",
    },
    flowNodeRows: {
      marginTop: 2,
    },
    flowNodeRow: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 62,
      marginBottom: 10,
    },
    flowNodeRowLast: {
      marginBottom: 0,
    },
    flowBranchColumn: {
      width: 18,
      alignSelf: "stretch",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    flowBranchVerticalLine: {
      position: "absolute",
      top: -10,
      bottom: -10,
      width: 2,
      borderRadius: 1,
      backgroundColor: COLORS.BORDER_GOLD,
      opacity: 0.85,
    },
    flowBranchVerticalLineFirst: {
      top: 22,
    },
    flowBranchVerticalLineLast: {
      bottom: 22,
    },
    flowBranchDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: COLORS.TITLE_GOLD,
      zIndex: 1,
    },
    flowBranchArm: {
      width: 14,
      height: 2,
      borderRadius: 1,
      backgroundColor: COLORS.BORDER_GOLD,
      opacity: 0.85,
      marginRight: 6,
    },
    flowNodeCard: {
      flex: 1,
      borderRadius: 13,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    flowNodeLabel: {
      fontSize: 12,
      lineHeight: 17,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      marginBottom: 2,
    },
    flowNodeTitle: {
      fontSize: 15,
      lineHeight: 21,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
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
