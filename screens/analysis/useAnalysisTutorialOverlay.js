import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
  syncTutorialSpotlightTarget,
  waitForTutorialFrames,
} from "../../components/TutorialOverlay";
import { ROUTE_HOME } from "./analysisRouteModel";

export const ANALYSIS_TUTORIAL_STEP_START = 8;
export const ANALYSIS_TUTORIAL_STEP_END = 12;

export function useAnalysisTutorialOverlay({
  isTutorialMode,
  tutorialStep,
  setTutorialStep,
  route,
  setRoute,
  navigation,
  screenRootRef,
  windowHeight,
  safeInsets,
  entryMeta,
  resetSelectedReports,
}) {
  const tutorialScrollRef = useRef(null);
  const tutorialScrollYRef = useRef(0);
  const [tutorialTargetRect, setTutorialTargetRect] = useState(null);
  const [tutorialOverlayMetrics, setTutorialOverlayMetrics] = useState(null);
  const analysisTitleRef = useRef(null);
  const analysisEmotionRef = useRef(null);
  const analysisSelfStructureRef = useRef(null);
  const analysisReportRef = useRef(null);
  const analysisSelfReportRef = useRef(null);
  const analysisGuideRef = useRef(null);

  const isAnalysisTutorialStep =
    !!isTutorialMode &&
    tutorialStep >= ANALYSIS_TUTORIAL_STEP_START &&
    tutorialStep <= ANALYSIS_TUTORIAL_STEP_END;
  const isAnalysisTutorialVisible = isAnalysisTutorialStep && route === ROUTE_HOME;

  const handleTutorialScroll = useCallback((e) => {
    tutorialScrollYRef.current =
      e?.nativeEvent?.contentOffset?.y ?? tutorialScrollYRef.current;
  }, []);

  const getTutorialTargetRef = useCallback(() => {
    if (!isAnalysisTutorialVisible) return null;

    switch (tutorialStep) {
      case 9:
      case 10:
      case 11:
        return analysisReportRef;
      case 12:
        return analysisSelfReportRef;
      default:
        return null;
    }
  }, [isAnalysisTutorialVisible, tutorialStep]);

  const tutorialOverlayConfig = useMemo(() => {
    if (!isAnalysisTutorialVisible) return null;

    switch (tutorialStep) {
      case 8:
        return {
          step: 8,
          mode: "info",
          title: "分析画面",
          message:
            "分析画面の説明をします。\n\nここでは分析レポートを閲覧することができます。",
          nextLabel: "こころ天気（日）へ",
          onNext: () => setTutorialStep(9),
          disableSpotlight: true,
          dimOpacity: 0,
        };
      case 9:
        return {
          step: 9,
          mode: "info",
          title: "こころ天気（日）",
          message:
            "こころ天気（日）では、その日の感情入力から見えるこころの状態を天気のように振り返れます。",
          nextLabel: "こころ天気（週）を見る",
          onNext: () => setTutorialStep(10),
          disableSpotlight: true,
          dimOpacity: 0,
          blockBackgroundTouches: false,
        };
      case 10:
        return {
          step: 10,
          mode: "info",
          title: "こころ天気（週）",
          message:
            "こころ天気（週）では、1週間分の感情入力から見える日ごとの流れを天気図のように振り返れます。",
          nextLabel: "こころ天気（月）を見る",
          onNext: () => setTutorialStep(11),
          disableSpotlight: true,
          dimOpacity: 0,
          blockBackgroundTouches: false,
        };
      case 11:
        return {
          step: 11,
          mode: "info",
          title: "こころ天気（月）",
          message:
            "こころ天気（月）では、月の中で繰り返し見えていたこころの流れを週ごとに振り返れます。",
          nextLabel: "自己分析へ",
          onNext: () => setTutorialStep(12),
          disableSpotlight: true,
          dimOpacity: 0,
          blockBackgroundTouches: false,
        };
      case 12:
        return {
          step: 12,
          mode: "info",
          title: "自己分析レポート",
          message:
            "自己分析レポートでは、日々の感情入力をもとに、自分の考え方や感情の傾向をより深く振り返ることができます。",
          nextLabel: "ピース画面へ",
          onNext: () => {
            setTutorialStep(13);
            requestAnimationFrame(() => {
              try {
                const parent =
                  typeof navigation?.getParent === "function"
                    ? navigation.getParent()
                    : null;
                if (parent && typeof parent.navigate === "function") {
                  parent.navigate("Piece");
                  return;
                }
              } catch {
                // no-op
              }

              try {
                navigation?.navigate?.("Piece");
              } catch {
                // no-op
              }
            });
          },
          cardPlacement: "bottom",
          disableSpotlight: true,
          dimOpacity: 0,
        };
      default:
        return null;
    }
  }, [isAnalysisTutorialVisible, tutorialStep, setTutorialStep, navigation]);

  const syncTutorialTargetRect = useCallback(async () => {
    if (!isAnalysisTutorialVisible || tutorialOverlayConfig?.disableSpotlight) {
      return null;
    }

    const targetRef = getTutorialTargetRef();
    if (!targetRef || !screenRootRef.current) {
      return null;
    }

    return syncTutorialSpotlightTarget({
      enabled: isAnalysisTutorialVisible,
      targetRef,
      rootRef: screenRootRef,
      scrollRef: tutorialScrollRef,
      currentScrollYRef: tutorialScrollYRef,
      overlayMetrics: tutorialOverlayMetrics,
      windowHeight,
      safeInsets,
      cardPlacement: tutorialOverlayConfig?.cardPlacement || "bottom",
      measureOptions: {
        maxAttempts: 3,
        settleFrames: 1,
      },
    });
  }, [
    getTutorialTargetRef,
    isAnalysisTutorialVisible,
    safeInsets,
    screenRootRef,
    tutorialOverlayConfig?.cardPlacement,
    tutorialOverlayConfig?.disableSpotlight,
    tutorialOverlayMetrics,
    windowHeight,
  ]);

  useEffect(() => {
    if (!isAnalysisTutorialStep) return;
    if (route === ROUTE_HOME) return;

    resetSelectedReports?.();
    setRoute(ROUTE_HOME);
  }, [isAnalysisTutorialStep, resetSelectedReports, route, setRoute]);

  useLayoutEffect(() => {
    if (!isAnalysisTutorialVisible) {
      setTutorialTargetRect(null);
      setTutorialOverlayMetrics(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      await waitForTutorialFrames(2);
      if (cancelled) return;

      const nextRect = await syncTutorialTargetRect();
      if (!cancelled) {
        setTutorialTargetRect(nextRect);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [
    entryMeta?.emotionLatestDate,
    entryMeta?.inputHistoryLatestDate,
    entryMeta?.selfStructureLatestDate,
    isAnalysisTutorialVisible,
    tutorialStep,
    tutorialOverlayMetrics,
    syncTutorialTargetRect,
  ]);

  return {
    isAnalysisTutorialStep,
    isAnalysisTutorialVisible,
    tutorialScrollRef,
    handleTutorialScroll,
    tutorialTargetRect,
    setTutorialOverlayMetrics,
    tutorialOverlayConfig,
    tutorialRefs: {
      titleRef: analysisTitleRef,
      emotionRef: analysisEmotionRef,
      selfStructureRef: analysisSelfStructureRef,
      reportRef: analysisReportRef,
      selfReportRef: analysisSelfReportRef,
      guideRef: analysisGuideRef,
    },
  };
}

export default useAnalysisTutorialOverlay;
