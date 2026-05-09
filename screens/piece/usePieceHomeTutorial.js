import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Alert, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  measureTutorialTarget,
  syncTutorialSpotlightTarget,
  waitForTutorialFrames,
} from "../../components/TutorialOverlay";

export const TUTORIAL_PIECE_QUESTION = "理想の休日の過ごし方は？";
export const PIECE_TUTORIAL_STEP_START = 12;
export const PIECE_TUTORIAL_STEP_END = 15;
export const TUTORIAL_TOTAL_STEPS = 21;

export const TUTORIAL_MOCK_PIECES = Object.freeze([
  {
    id: "tutorial-piece-mock-1",
    q_instance_id: "tutorial-q-mock-1",
    q_key: "tutorial-holiday",
    title: TUTORIAL_PIECE_QUESTION,
    body:
      "朝は少しゆっくり起きて、好きな音楽を流しながらコーヒーを飲みます。午後は本屋か静かなカフェで過ごして、夜は早めに眠れる休日が理想です。",
    owner_user_id: "tutorial-follow-1",
    display_name: "User",
    share_code: "HANAKO123",
    is_tutorial: true,
    tutorial_kind: "mock",
    created_at: "2026-01-01T09:00:00.000Z",
    resonances: 4,
    views: 12,
    is_new: true,
  },
]);

function hasRouteNameInState(state, routeName) {
  if (!state) return false;

  const routeNames = state?.routeNames;
  if (Array.isArray(routeNames) && routeNames.includes(routeName)) return true;

  const routes = state?.routes;
  if (Array.isArray(routes)) {
    for (const r of routes) {
      if (r?.state && hasRouteNameInState(r.state, routeName)) return true;
    }
  }
  return false;
}

function resolvePieceLibraryRouteName(navigation) {
  const candidates = ["PieceLibrary", "PieceLibraryScreen"];
  const root = navigation?.getRootState?.();
  const local = navigation?.getState?.();

  for (const name of candidates) {
    if (hasRouteNameInState(root, name) || hasRouteNameInState(local, name)) {
      return name;
    }
  }
  return "PieceLibrary";
}

function mergeTutorialRects(...rects) {
  const validRects = rects.filter(Boolean);
  if (!validRects.length) return null;

  const left = Math.min(...validRects.map((rect) => Number(rect.x) || 0));
  const top = Math.min(...validRects.map((rect) => Number(rect.y) || 0));
  const right = Math.max(
    ...validRects.map((rect) => Number(rect.right ?? ((Number(rect.x) || 0) + (Number(rect.width) || 0))) || 0)
  );
  const bottom = Math.max(
    ...validRects.map((rect) => Number(rect.bottom ?? ((Number(rect.y) || 0) + (Number(rect.height) || 0))) || 0)
  );

  return {
    x: left,
    y: top,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
    right,
    bottom,
  };
}

export function usePieceHomeTutorial({
  navigation,
  targetUserId,
  isTutorialMode,
  tutorialStep,
  tutorialPieces,
  setTutorialPieces,
  setTutorialStep,
  tutorialSurfaceEnabled,
  screenRootRef,
}) {
  const { height: windowHeight } = useWindowDimensions();
  const safeInsets = useSafeAreaInsets();
  const tutorialScrollRef = useRef(null);
  const tutorialScrollYRef = useRef(0);
  const pieceTitleRef = useRef(null);
  const pieceLibraryButtonRef = useRef(null);
  const createButtonRef = useRef(null);
  const [tutorialTargetRect, setTutorialTargetRect] = useState(null);
  const [tutorialOverlayMetrics, setTutorialOverlayMetrics] = useState(null);
  const modalOverlayRootRef = useRef(null);
  const tutorialCreateScrollRef = useRef(null);
  const tutorialCreateScrollYRef = useRef(0);
  const tutorialCreateQuestionInputWrapRef = useRef(null);
  const tutorialCreateInputWrapRef = useRef(null);
  const tutorialCreateSaveButtonRef = useRef(null);
  const [tutorialModalTargetRect, setTutorialModalTargetRect] = useState(null);
  const [tutorialModalOverlayMetrics, setTutorialModalOverlayMetrics] = useState(null);

  const [tutorialCreateVisible, setTutorialCreateVisible] = useState(false);
  const [tutorialCreateAnswer, setTutorialCreateAnswer] = useState("");
  const [tutorialCreateSubmitting, setTutorialCreateSubmitting] = useState(false);
  const [tutorialCreateError, setTutorialCreateError] = useState("");

  const tutorialSelfPiece = useMemo(
    () =>
      (Array.isArray(tutorialPieces) ? tutorialPieces : []).find(
        (item) => String(item?.tutorial_kind || "") === "self"
      ) || null,
    [tutorialPieces]
  );
  const tutorialHasSelfPiece = !!tutorialSelfPiece;

  const isPieceTutorialStep =
    tutorialSurfaceEnabled &&
    !!isTutorialMode &&
    tutorialStep >= PIECE_TUTORIAL_STEP_START &&
    tutorialStep <= PIECE_TUTORIAL_STEP_END;
  const isPieceTutorialVisible = isPieceTutorialStep && !tutorialCreateVisible;

  const handleTutorialScroll = useCallback((e) => {
    tutorialScrollYRef.current =
      e?.nativeEvent?.contentOffset?.y ?? tutorialScrollYRef.current;
  }, []);

  const getTutorialTargetRef = useCallback(() => {
    if (!isPieceTutorialVisible) return null;

    switch (tutorialStep) {
      case 12:
        return pieceTitleRef;
      case 13:
      case 14:
        return createButtonRef;
      case 15:
        return pieceLibraryButtonRef;
      default:
        return null;
    }
  }, [isPieceTutorialVisible, tutorialStep]);

  const tutorialOverlayConfig = useMemo(() => {
    if (!isPieceTutorialVisible) return null;

    switch (tutorialStep) {
      case 12:
        return {
          step: 12,
          mode: "info",
          title: "ピース",
          message: "ここでは\nピースを生成し、閲覧できます",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(13),
        };
      case 13:
        return {
          step: 13,
          mode: "info",
          title: "作成",
          message: "まずはここで\nピースを生成します",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(14),
        };
      case 14:
        return {
          step: 14,
          mode: "action",
          title: "作成してみましょう",
          message: "作成を開いて\nピースを生成してみましょう",
          actionHint: "作成 を押してください",
        };
      case 15:
        return {
          step: 15,
          mode: "action",
          title: "閲覧で確認できます",
          message: "生成したピースは\n閲覧から確認できます\n\n開いてみましょう",
          actionHint: "閲覧 を押してください",
        };
      default:
        return null;
    }
  }, [isPieceTutorialVisible, tutorialStep, setTutorialStep]);

  const tutorialModalOverlayConfig = useMemo(() => {
    if (!tutorialSurfaceEnabled || !isTutorialMode || !tutorialCreateVisible || tutorialStep !== 14) {
      return null;
    }

    return {
      step: 14,
      mode: "action",
      title: "作成してみましょう",
      message: "回答を入力したら、保存ボタンを押してください",
      actionHint: "入力して保存してください",
      footerText:
        "この問い1つで、ピースの生成から閲覧までの流れを体験できます。",
    };
  }, [isTutorialMode, tutorialCreateVisible, tutorialStep, tutorialSurfaceEnabled]);

  const syncTutorialTargetRect = useCallback(async () => {
    if (!isPieceTutorialVisible) return null;

    const targetRef = getTutorialTargetRef();
    if (!targetRef || !screenRootRef.current) return null;

    return syncTutorialSpotlightTarget({
      enabled: isPieceTutorialVisible,
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
    isPieceTutorialVisible,
    safeInsets,
    screenRootRef,
    tutorialOverlayConfig?.cardPlacement,
    tutorialOverlayMetrics,
    windowHeight,
  ]);

  useEffect(() => {
    if (!tutorialSurfaceEnabled || !isTutorialMode || !tutorialHasSelfPiece) return;
    if (tutorialStep < PIECE_TUTORIAL_STEP_START || tutorialStep >= 15) return;
    setTutorialStep(15);
  }, [isTutorialMode, tutorialHasSelfPiece, tutorialStep, setTutorialStep, tutorialSurfaceEnabled]);

  useLayoutEffect(() => {
    if (!isPieceTutorialVisible) {
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
    isPieceTutorialVisible,
    tutorialStep,
    tutorialCreateVisible,
    tutorialHasSelfPiece,
    tutorialCreateAnswer,
    tutorialOverlayMetrics,
    syncTutorialTargetRect,
  ]);

  const syncTutorialModalTargetRect = useCallback(async () => {
    if (!tutorialModalOverlayConfig || !modalOverlayRootRef.current) {
      return null;
    }

    const measureOptions = {
      maxAttempts: 3,
      settleFrames: 1,
      coordinateSpace: "window",
      overlayWindowRect: tutorialModalOverlayMetrics?.overlayWindowRect,
    };

    const questionRect = await measureTutorialTarget(
      tutorialCreateQuestionInputWrapRef,
      modalOverlayRootRef,
      measureOptions
    );
    const saveRect = await measureTutorialTarget(
      tutorialCreateSaveButtonRef,
      modalOverlayRootRef,
      measureOptions
    );

    return mergeTutorialRects(questionRect, saveRect) || questionRect || saveRect;
  }, [tutorialModalOverlayConfig, tutorialModalOverlayMetrics]);

  useEffect(() => {
    if (!tutorialSurfaceEnabled || !isTutorialMode || !tutorialHasSelfPiece) return;
    setTutorialStep((prev) => (prev < 15 ? 15 : prev));
  }, [isTutorialMode, tutorialHasSelfPiece, setTutorialStep, tutorialSurfaceEnabled]);

  useLayoutEffect(() => {
    if (!tutorialModalOverlayConfig) {
      setTutorialModalTargetRect(null);
      setTutorialModalOverlayMetrics(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      await waitForTutorialFrames(2);
      if (cancelled) return;

      const nextRect = await syncTutorialModalTargetRect();
      if (!cancelled) {
        setTutorialModalTargetRect(nextRect);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [
    tutorialModalOverlayConfig,
    tutorialCreateSubmitting,
    tutorialModalOverlayMetrics,
    syncTutorialModalTargetRect,
  ]);

  const openTutorialCreate = useCallback(() => {
    tutorialCreateScrollYRef.current = 0;
    setTutorialCreateAnswer(String(tutorialSelfPiece?.body || ""));
    setTutorialCreateError("");
    setTutorialCreateVisible(true);
  }, [tutorialSelfPiece]);

  const closeTutorialCreate = useCallback((opts = {}) => {
    if (!opts?.force && tutorialCreateSubmitting) return;
    setTutorialCreateVisible(false);
    setTutorialCreateError("");
  }, [tutorialCreateSubmitting]);

  const resetTutorialCreateState = useCallback(() => {
    tutorialCreateScrollYRef.current = 0;
    setTutorialCreateVisible(false);
    setTutorialCreateSubmitting(false);
    setTutorialCreateError("");
  }, []);

  const navigateToPieceLibrary = useCallback(() => {
    if (!navigation?.navigate) return;

    const routeName = resolvePieceLibraryRouteName(navigation);
    const params =
      targetUserId != null
        ? { viewedUserId: String(targetUserId), targetUserId: String(targetUserId) }
        : {};

    try {
      navigation.navigate(routeName, params);
    } catch {
      Alert.alert(
        "ピース一覧を開けません",
        "ピース一覧画面が navigation に未登録の可能性があります。\nApp.js の登録を確認してください。"
      );
    }
  }, [navigation, targetUserId]);

  const saveTutorialPiece = useCallback(() => {
    const answer = String(tutorialCreateAnswer || "").trim();
    if (!answer) {
      setTutorialCreateError("回答を入力してください。");
      return;
    }

    setTutorialCreateSubmitting(true);
    try {
      const createdAt = new Date().toISOString();
      const selfPiece = {
        id: "tutorial-piece-self",
        q_instance_id: "tutorial-q-self",
        q_key: "tutorial-holiday",
        title: TUTORIAL_PIECE_QUESTION,
        body: answer,
        owner_user_id: "tutorial-self",
        display_name: "自分",
        share_code: "YOU",
        is_tutorial: true,
        tutorial_kind: "self",
        created_at: createdAt,
        resonances: 0,
        views: 0,
        is_new: true,
      };

      setTutorialPieces((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        const others = safePrev.filter(
          (item) => String(item?.tutorial_kind || "") !== "self"
        );
        const hasMock = others.some(
          (item) => String(item?.tutorial_kind || "") === "mock"
        );
        const mockItems = hasMock
          ? others
          : TUTORIAL_MOCK_PIECES.map((item) => ({ ...item }));

        return [selfPiece, ...mockItems];
      });
      setTutorialStep((prev) => (prev < 15 ? 15 : prev));
      setTutorialCreateVisible(false);
      setTutorialCreateError("");
    } finally {
      setTutorialCreateSubmitting(false);
    }
  }, [tutorialCreateAnswer, setTutorialPieces, setTutorialStep]);

  const openPieceLibrary = useCallback(() => {
    if (tutorialSurfaceEnabled && isTutorialMode && !tutorialHasSelfPiece) {
      Alert.alert(
        "先にピースを生成しましょう",
        `チュートリアルでは、まず「${TUTORIAL_PIECE_QUESTION}」に答えると、生成から閲覧までの流れが分かります。`,
        [
          { text: "閉じる", style: "cancel" },
          { text: "作成する", onPress: openTutorialCreate },
        ]
      );
      return;
    }

    if (tutorialSurfaceEnabled && isTutorialMode) {
      setTutorialStep((prev) => (prev < 16 ? 16 : prev));
    }

    navigateToPieceLibrary();
  }, [
    isTutorialMode,
    navigateToPieceLibrary,
    openTutorialCreate,
    setTutorialStep,
    tutorialHasSelfPiece,
    tutorialSurfaceEnabled,
  ]);

  return {
    tutorialScrollRef,
    pieceTitleRef,
    pieceLibraryButtonRef,
    createButtonRef,
    handleTutorialScroll,
    tutorialOverlayConfig,
    isPieceTutorialVisible,
    tutorialTargetRect,
    setTutorialOverlayMetrics,
    modalOverlayRootRef,
    tutorialCreateScrollRef,
    tutorialCreateScrollYRef,
    tutorialCreateQuestionInputWrapRef,
    tutorialCreateInputWrapRef,
    tutorialCreateSaveButtonRef,
    tutorialModalTargetRect,
    tutorialModalOverlayConfig,
    setTutorialModalOverlayMetrics,
    tutorialSelfPiece,
    tutorialHasSelfPiece,
    tutorialCreateVisible,
    tutorialCreateAnswer,
    setTutorialCreateAnswer,
    tutorialCreateSubmitting,
    tutorialCreateError,
    setTutorialCreateError,
    openTutorialCreate,
    closeTutorialCreate,
    resetTutorialCreateState,
    saveTutorialPiece,
    navigateToPieceLibrary,
    openPieceLibrary,
  };
}

export default usePieceHomeTutorial;
