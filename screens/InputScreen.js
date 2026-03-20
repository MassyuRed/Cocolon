import Ionicons from "react-native-vector-icons/Ionicons";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from "react-native";

// Supabase Auth
import { apiGet, apiPost } from "../lib/apiClient";
import {
  getTodayQuestionCurrent,
  submitTodayQuestionAnswer,
  resolveLocalTimezoneName,
} from "../lib/todayQuestionApi";
import { getNoticesCurrent, markNoticePopupSeen } from "../lib/noticeApi";

// テーマ
import { useTheme } from "../theme/ThemeContext";

import { useUnread } from "../UnreadContext";
import { useTutorial } from "../TutorialContext";

// UI (Design System)
import CocolonButton from "../components/CocolonButton";
import CocolonPressable from "../components/CocolonPressable";
import CocolonSwitch from "../components/CocolonSwitch";
import { makeUiTokens } from "../ui/uiTokens";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TutorialOverlay, {
  syncTutorialSpotlightTarget,
  waitForTutorialFrames,
} from "../components/TutorialOverlay";
import TodayQuestionCard from "../components/TodayQuestionCard";
import TodayQuestionModal from "../components/TodayQuestionModal";
import NoticeModal from "../components/NoticeModal";
import UnreadBadge from "../components/UnreadBadge";

// MashOS Emotion Submit API
// ※ 現在は MashOS を Render 上で稼働させているため、
//   開発ビルド / 本番ビルドを問わず同じクラウド URL を利用する。
//   （ローカル API に戻したい場合はここを書き換える）

const GLOBAL_SUMMARY_PATH = "/global_summary";

// パネル高さ（他画面と同じルールで調整可能）
const PANEL_MIN_HEIGHT = 690;

// 強度→数値（分析用）。UIには使わない
const STRENGTH_SCORE = Object.freeze({ weak: 1, medium: 2, strong: 3 });

const SELF_INSIGHT = "自己理解";

function getInputLocalTimezoneName() {
  return resolveLocalTimezoneName("Asia/Tokyo");
}

// 感情ボタンの配置（2段構成：下段右は空き）
const EMOTION_ROWS = [
  ["喜び", "悲しみ", "怒り"],
  ["不安", "平穏", null],
];

const CATEGORY_OPTIONS = Object.freeze([
  "生活",
  "仕事",
  "趣味",
  "人間関係",
  "恋愛",
  "健康",
  "学習",
  "価値観",
  "人生",
]);

const INPUT_TUTORIAL_STEP_START = 1;
const INPUT_TUTORIAL_STEP_END = 6;
const TUTORIAL_TOTAL_STEPS = 23;

/**
 * Home（InputScreen）
 * - 背景・パネル・ボタンなどを ThemeContext から取得
 */
export default function InputScreen({ navigation }) {
  const { colors, themeName } = useTheme();
  const { setUnread } = useUnread();
  const {
    isTutorialMode,
    tutorialStep,
    addTutorialEmotion,
    addTutorialFriendFeedItem,
    setTutorialStep,
  } = useTutorial();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);

  const isIOS = Platform.OS === "ios";

  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [memo, setMemo] = useState("");
  const [memoAction, setMemoAction] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showMemoSection, setShowMemoSection] = useState(false);
  // 展開式入力（タップで開く）
  const [activeField, setActiveField] = useState(null); // "memo" | "memoAction" | null
  const memoInputRef = useRef(null);
  const memoActionInputRef = useRef(null);
  const [memoContentHeight, setMemoContentHeight] = useState(44);
  const [memoActionContentHeight, setMemoActionContentHeight] = useState(44);

  const [isSecret, setIsSecret] = useState(false);
  const [sendFriendNotification, setSendFriendNotification] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [keyboardInset, setKeyboardInset] = useState(0);

// --- Toast (lightweight feedback after submit) ---
const toastTimerRef = useRef(null);
const tutorialFriendNotifyTimerRef = useRef(null);
const [toastMessage, setToastMessage] = useState(null);

const showToast = useCallback((msg) => {
  try {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  } catch {
    // noop
  }
  setToastMessage(String(msg || ""));
  toastTimerRef.current = setTimeout(() => {
    setToastMessage(null);
    toastTimerRef.current = null;
  }, 3000);
}, []);

useEffect(() => {
  return () => {
    try {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    } catch {
      // noop
    }
    try {
      if (tutorialFriendNotifyTimerRef.current) {
        clearTimeout(tutorialFriendNotifyTimerRef.current);
      }
    } catch {
      // noop
    }
  };
}, []);

const [globalEmotionUsers, setGlobalEmotionUsers] = useState(null);
const appStateRef = useRef(AppState.currentState);

const fetchGlobalSummary = useCallback(async () => {
  try {
    const json = await apiGet(GLOBAL_SUMMARY_PATH, { auth: false });
    const nextEmotionUsers = Number(json?.emotion_users);
    if (Number.isFinite(nextEmotionUsers)) {
      setGlobalEmotionUsers(nextEmotionUsers);
    }
  } catch {
    // keep previous value
  }
}, []);

  
// --- Home summary (persistent: today / this month) ---
const [homeTodayCount, setHomeTodayCount] = useState(null);
const [homeMonthCount, setHomeMonthCount] = useState(null);
const [homeWeekCount, setHomeWeekCount] = useState(null);
const [homeStreakDays, setHomeStreakDays] = useState(null);

const [todayQuestionBundle, setTodayQuestionBundle] = useState(null);
const [todayQuestionLoading, setTodayQuestionLoading] = useState(false);
const [todayQuestionSubmitting, setTodayQuestionSubmitting] = useState(false);
const [todayQuestionModalVisible, setTodayQuestionModalVisible] = useState(false);
const dismissedTodayQuestionDayRef = useRef(null);
const todayQuestionRequestIdRef = useRef(0);

const clearTodayQuestionUi = useCallback(() => {
  setTodayQuestionBundle(null);
  setTodayQuestionModalVisible(false);
  setTodayQuestionLoading(false);
}, []);

const [noticeFeatureEnabled, setNoticeFeatureEnabled] = useState(true);
const [noticeUnreadCount, setNoticeUnreadCount] = useState(0);
const [noticePopup, setNoticePopup] = useState(null);
const [noticeLoading, setNoticeLoading] = useState(false);
const [noticeModalVisible, setNoticeModalVisible] = useState(false);
const dismissedNoticeIdRef = useRef(null);
const noticeRequestIdRef = useRef(0);

const clearNoticeUi = useCallback(() => {
  setNoticeFeatureEnabled(true);
  setNoticeUnreadCount(0);
  setNoticePopup(null);
  setNoticeModalVisible(false);
  setNoticeLoading(false);
}, []);

const homeBadgeLabel = useMemo(() => {
  const m = typeof homeMonthCount === "number" ? homeMonthCount : null;
  const w = typeof homeWeekCount === "number" ? homeWeekCount : null;
  const s = typeof homeStreakDays === "number" ? homeStreakDays : null;

  // まずは月間の大きな称号（最上位）
  if (m != null) {
    if (m >= 60) return "観測レジェンド";
  }

  // 連続観測（“継続”を強調）
  if (s != null) {
    if (s >= 30) return "連続30日観測";
    if (s >= 14) return "連続2週間観測";
    if (s >= 7) return "連続1週間観測";
    if (s >= 3) return "連続3日観測";
  }

  // 週内の観測密度（“今週”を強調）
  if (w != null) {
    if (w >= 7) return "今週コンプリート";
    if (w >= 5) return "今週ハイペース";
  }

  // 月間（中位以下）
  if (m != null) {
    if (m >= 30) return "観測マスター";
    if (m >= 15) return "観測ルーティン";
    if (m >= 7) return "一週間観測";
    if (m >= 3) return "観測ウォームアップ";
    if (m >= 1) return "初観測";
  }

  return null;
}, [homeMonthCount, homeWeekCount, homeStreakDays]);


const refreshHomeCounts = useCallback(async () => {
  try {
    const json = await apiGet("/input/summary");
    const todayCount = Number(json?.today_count ?? 0);
    const weekCount = Number(json?.week_count ?? 0);
    const monthCount = Number(json?.month_count ?? 0);
    const streakDays = Number(json?.streak_days ?? 0);

    setHomeTodayCount(Number.isFinite(todayCount) ? todayCount : 0);
    setHomeWeekCount(Number.isFinite(weekCount) ? weekCount : 0);
    setHomeMonthCount(Number.isFinite(monthCount) ? monthCount : 0);
    setHomeStreakDays(Number.isFinite(streakDays) ? streakDays : 0);

    return {
      todayCount,
      weekCount,
      monthCount,
      streakDays,
      lastInputAt: json?.last_input_at || null,
    };
  } catch (e) {
    console.warn("InputScreen: refreshHomeCounts failed", e);
    return null;
  }
}, []);

useEffect(() => {
  refreshHomeCounts();

  let unsubscribe = null;
  try {
    unsubscribe = navigation?.addListener?.("focus", refreshHomeCounts);
  } catch {
    // noop
  }

  return () => {
    try {
      if (typeof unsubscribe === "function") unsubscribe();
    } catch {
      // noop
    }
  };
}, [navigation, refreshHomeCounts]);

useEffect(() => {
  fetchGlobalSummary();

  let unsubscribe = null;
  try {
    unsubscribe = navigation?.addListener?.("focus", fetchGlobalSummary);
  } catch {
    // noop
  }

  return () => {
    try {
      if (typeof unsubscribe === "function") unsubscribe();
    } catch {
      // noop
    }
  };
}, [navigation, fetchGlobalSummary]);

useEffect(() => {
  const subscription = AppState.addEventListener("change", (nextAppState) => {
    if (/inactive|background/.test(appStateRef.current) && nextAppState === "active") {
      fetchGlobalSummary();
    }
    appStateRef.current = nextAppState;
  });

  return () => {
    try {
      subscription?.remove?.();
    } catch {
      // noop
    }
  };
}, [fetchGlobalSummary]);

const loadTodayQuestion = useCallback(async () => {
  const requestId = todayQuestionRequestIdRef.current + 1;
  todayQuestionRequestIdRef.current = requestId;

  if (isTutorialMode) {
    clearTodayQuestionUi();
    return;
  }

  const timezoneName = getInputLocalTimezoneName();
  setTodayQuestionLoading(true);
  try {
    const json = await getTodayQuestionCurrent({ timezone_name: timezoneName });
    if (todayQuestionRequestIdRef.current !== requestId || isTutorialMode) return;

    setTodayQuestionBundle(json || null);

    const unanswered = json?.question && json?.answer_status !== "answered";
    const serviceDayKey = String(json?.service_day_key || "");
    if (
      unanswered &&
      serviceDayKey &&
      dismissedTodayQuestionDayRef.current !== serviceDayKey
    ) {
      setTodayQuestionModalVisible(true);
    } else {
      setTodayQuestionModalVisible(false);
    }
  } catch (e) {
    if (todayQuestionRequestIdRef.current !== requestId || isTutorialMode) return;
    console.warn("InputScreen: loadTodayQuestion failed", e);
    clearTodayQuestionUi();
  } finally {
    if (todayQuestionRequestIdRef.current === requestId) {
      setTodayQuestionLoading(false);
    }
  }
}, [clearTodayQuestionUi, isTutorialMode]);

useEffect(() => {
  loadTodayQuestion();

  let unsubscribe = null;
  try {
    unsubscribe = navigation?.addListener?.("focus", loadTodayQuestion);
  } catch {
    // noop
  }

  return () => {
    try {
      if (typeof unsubscribe === "function") unsubscribe();
    } catch {
      // noop
    }
  };
}, [navigation, loadTodayQuestion]);

const loadNotices = useCallback(async () => {
  const requestId = noticeRequestIdRef.current + 1;
  noticeRequestIdRef.current = requestId;

  if (isTutorialMode) {
    clearNoticeUi();
    return;
  }

  setNoticeLoading(true);
  try {
    const json = await getNoticesCurrent();
    if (noticeRequestIdRef.current !== requestId || isTutorialMode) return;

    const featureEnabled = json?.feature_enabled !== false;
    const unreadCount = Math.max(0, Number(json?.unread_count) || 0);
    const popupNotice = json?.popup_notice && typeof json?.popup_notice === "object"
      ? json.popup_notice
      : null;
    const popupNoticeId = String(popupNotice?.notice_id || "").trim();

    setNoticeFeatureEnabled(featureEnabled);
    setNoticeUnreadCount(unreadCount);
    setNoticePopup(popupNotice);

    if (
      featureEnabled &&
      popupNotice &&
      popupNoticeId &&
      dismissedNoticeIdRef.current !== popupNoticeId
    ) {
      setNoticeModalVisible(true);
    } else {
      setNoticeModalVisible(false);
    }
  } catch (e) {
    if (noticeRequestIdRef.current !== requestId || isTutorialMode) return;
    console.warn("InputScreen: loadNotices failed", e);
    clearNoticeUi();
  } finally {
    if (noticeRequestIdRef.current === requestId) {
      setNoticeLoading(false);
    }
  }
}, [clearNoticeUi, isTutorialMode]);

useEffect(() => {
  loadNotices();

  let unsubscribe = null;
  try {
    unsubscribe = navigation?.addListener?.("focus", loadNotices);
  } catch {
    // noop
  }

  return () => {
    try {
      if (typeof unsubscribe === "function") unsubscribe();
    } catch {
      // noop
    }
  };
}, [navigation, loadNotices]);

const markCurrentNoticePopupSeen = useCallback(async () => {
  const noticeId = String(noticePopup?.notice_id || "").trim();
  if (!noticeId) return;
  dismissedNoticeIdRef.current = noticeId;
  try {
    await markNoticePopupSeen({ notice_id: noticeId });
  } catch (e) {
    console.warn("InputScreen: markNoticePopupSeen failed", e);
  }
}, [noticePopup?.notice_id]);

const handleDismissTodayQuestionModal = useCallback(() => {
  const serviceDayKey = String(todayQuestionBundle?.service_day_key || "");
  if (serviceDayKey) {
    dismissedTodayQuestionDayRef.current = serviceDayKey;
  }
  setTodayQuestionModalVisible(false);
}, [todayQuestionBundle?.service_day_key]);

const handleOpenTodayQuestionHistory = useCallback(() => {
  try {
    const parent = typeof navigation?.getParent === "function" ? navigation.getParent() : null;
    if (parent && typeof parent.navigate === "function") {
      parent.navigate("MyWeb", {
        openTodayQuestionHistory: true,
        openTodayQuestionHistoryAt: Date.now(),
      });
      return;
    }
  } catch {
    // noop
  }

  try {
    navigation?.navigate?.("MyWeb", {
      openTodayQuestionHistory: true,
      openTodayQuestionHistoryAt: Date.now(),
    });
  } catch {
    // noop
  }
}, [navigation]);

const handleSubmitTodayQuestion = useCallback(async (payload) => {
  if (!todayQuestionBundle?.question?.question_id) return;

  setTodayQuestionSubmitting(true);
  try {
    await submitTodayQuestionAnswer({
      service_day_key: todayQuestionBundle?.service_day_key,
      question_id: todayQuestionBundle?.question?.question_id,
      sequence_no: todayQuestionBundle?.progress?.sequence_no,
      ...payload,
    });
    showToast("今日の問いを保存しました");
    dismissedTodayQuestionDayRef.current = String(todayQuestionBundle?.service_day_key || "");
    await loadTodayQuestion();
    setTodayQuestionModalVisible(false);
  } catch (e) {
    console.warn("InputScreen: submitTodayQuestion failed", e);
    Alert.alert("今日の問い", String(e?.message || "保存に失敗しました。"));
  } finally {
    setTodayQuestionSubmitting(false);
  }
}, [loadTodayQuestion, showToast, todayQuestionBundle]);

const { height: windowHeight } = useWindowDimensions();
  const safeInsets = useSafeAreaInsets();

  const screenRootRef = useRef(null);
  const emotionAreaRef = useRef(null);
  const memoSectionRef = useRef(null);
  const memoToggleButtonRef = useRef(null);
  const okButtonRef = useRef(null);
  const strengthRowRefs = useRef({});
  const currentScrollYRef = useRef(0);
  const [tutorialTargetRect, setTutorialTargetRect] = useState(null);
  const [tutorialOverlayMetrics, setTutorialOverlayMetrics] = useState(null);

  const isInputTutorialStep =
    isTutorialMode &&
    tutorialStep >= INPUT_TUTORIAL_STEP_START &&
    tutorialStep <= INPUT_TUTORIAL_STEP_END;
  const shouldHideTodayQuestionForTutorial = isTutorialMode;

  // 入力欄はできるだけ伸ばしつつ、一定以上は TextInput 内スクロールに切り替える
  const inputMaxHeight = useMemo(() => {
    const h = windowHeight || 0;
    if (!h) return 520;

    // キーボード表示中は、画面に収まる範囲を優先して上限を決める（それ以上は TextInput 内でスクロール）
    if (keyboardInset > 0) {
      const remaining = h - keyboardInset;
      return Math.max(160, Math.floor(remaining - 60));
    }

    // キーボード未表示時は、画面の大半まで伸ばせるようにする
    return Math.max(260, Math.floor(h * 0.75));
  }, [windowHeight, keyboardInset]);


  // メモ入力がキーボードに隠れないようにスクロール追従
  const scrollRef = useRef(null);
  const memoFocusedRef = useRef(false);
  const focusedFieldRef = useRef(null); // "memo" | "memoAction" | null
  const lastFocusTargetRef = useRef(null);

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

  const openField = (field) => {
    setActiveField(field);
    // state反映後に focus する（render完了を待つ）
    setTimeout(() => {
      try {
        if (field === "memo") memoInputRef.current?.focus?.();
        if (field === "memoAction") memoActionInputRef.current?.focus?.();
      } catch {
        // noop
      }
    }, 50);
  };


  useEffect(() => {
    const showEvt =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e) => {
      const h = e?.endCoordinates?.height ?? 0;
      setKeyboardInset(h);
      requestAnimationFrame(() => {
        scrollToFocusedInput();
      });
    };

    const onHide = () => {
      setKeyboardInset(0);
    };

    const subShow = Keyboard.addListener(showEvt, onShow);
    const subHide = Keyboard.addListener(hideEvt, onHide);

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, [scrollToFocusedInput]);

  const doNotNotifyFriends = !sendFriendNotification;
  const isDark = themeName === "dark";

  const isSelfInsightSelected = selectedEmotions.some(
    (e) => e.type === SELF_INSIGHT
  );
  const hasMemoInput =
    memo.trim().length > 0 || memoAction.trim().length > 0;
  const requiresCategorySelection = hasMemoInput;
  const hasSelectedCategories = selectedCategories.length > 0;
  const canSubmit =
    !submitting &&
    selectedEmotions.length > 0 &&
    (!isSelfInsightSelected || hasMemoInput) &&
    (!requiresCategorySelection || hasSelectedCategories);

  const getTutorialTargetRef = useCallback(() => {
    if (!isInputTutorialStep) return null;

    switch (tutorialStep) {
      case 1:
      case 2:
        return emotionAreaRef;
      case 3: {
        const selectedType = selectedEmotions?.[0]?.type || null;
        if (!selectedType) return emotionAreaRef;
        return strengthRowRefs.current?.[selectedType] || emotionAreaRef;
      }
      case 4:
        return memoToggleButtonRef;
      case 5:
      case 6:
        return okButtonRef;
      default:
        return null;
    }
  }, [isInputTutorialStep, tutorialStep, selectedEmotions, showMemoSection]);

  const tutorialOverlayConfig = useMemo(() => {
    if (!isInputTutorialStep) return null;

    switch (tutorialStep) {
      case 1:
        return {
          step: 1,
          mode: "info",
          title: "感情を選びます",
          message:
            "ここで今日の感情を選びます\n\n複数の感情を選ぶこともできます",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(2),
        };
      case 2:
        return {
          step: 2,
          mode: "action",
          title: "感情を選んでみましょう",
          message: "まずは感情を1つ以上選んでみましょう",
          actionHint: "感情ボタンを押してください",
        };
      case 3:
        return {
          step: 3,
          mode: "info",
          title: "感情の強さを選びます",
          message:
            "感情を選ぶと、弱 / 中 / 強 を選べます\n\n感情の強さも記録されます",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(4),
        };
      case 4:
        return {
          step: 4,
          mode: "info",
          title: "メモも使えます",
          message:
            "必要なときはここからメモ入力ができます\n\nメモを書くと\n分析レポートの精度が上がります",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(5),
        };
      case 5:
        return {
          step: 5,
          mode: "info",
          title: "送信します",
          message: "入力が終わったら\nこのボタンで送信します",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(6),
          cardPlacement: "top",
        };
      case 6:
        return {
          step: 6,
          mode: "action",
          title: "送信してみましょう",
          message: "感情を送信してみましょう",
          actionHint: "「この内容でOK」を押してください",
          cardPlacement: "top",
        };
      default:
        return null;
    }
  }, [isInputTutorialStep, tutorialStep, setTutorialStep]);

  const syncTutorialTargetRect = useCallback(async () => {
    if (!isInputTutorialStep) {
      return null;
    }

    const targetRef = getTutorialTargetRef();
    if (!targetRef || !screenRootRef.current) {
      return null;
    }

    return syncTutorialSpotlightTarget({
      enabled: isInputTutorialStep,
      targetRef,
      rootRef: screenRootRef,
      scrollRef,
      currentScrollYRef,
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
    isInputTutorialStep,
    safeInsets,
    tutorialOverlayConfig?.cardPlacement,
    tutorialOverlayMetrics,
    windowHeight,
  ]);

  useEffect(() => {
    if (!isTutorialMode) return;
    if (tutorialStep > 0) return;
    if (
      !!todayQuestionBundle?.question ||
      todayQuestionModalVisible ||
      todayQuestionLoading ||
      noticeModalVisible ||
      noticeLoading
    ) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      setTutorialStep(1);
    });

    return () => {
      try {
        cancelAnimationFrame(frame);
      } catch {
        // noop
      }
    };
  }, [
    isTutorialMode,
    tutorialStep,
    !!todayQuestionBundle?.question,
    todayQuestionLoading,
    todayQuestionModalVisible,
    noticeLoading,
    noticeModalVisible,
    setTutorialStep,
  ]);

  useEffect(() => {
    if (!isTutorialMode) return;
    todayQuestionRequestIdRef.current += 1;
    clearTodayQuestionUi();
    noticeRequestIdRef.current += 1;
    clearNoticeUi();
  }, [clearNoticeUi, clearTodayQuestionUi, isTutorialMode]);

  useEffect(() => {
    if (!isTutorialMode) return;
    if (tutorialStep >= 4) return;
    if (!showMemoSection) return;
    if (isSelfInsightSelected) return;
    setShowMemoSection(false);
  }, [isTutorialMode, tutorialStep, showMemoSection, isSelfInsightSelected]);

  useLayoutEffect(() => {
    if (!isInputTutorialStep) {
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
    isInputTutorialStep,
    tutorialStep,
    selectedEmotions,
    showMemoSection,
    memo,
    memoAction,
    keyboardInset,
    shouldHideTodayQuestionForTutorial,
    !!todayQuestionBundle?.question,
    todayQuestionLoading,
    todayQuestionModalVisible,
    noticeLoading,
    noticeModalVisible,
    tutorialOverlayMetrics,
    syncTutorialTargetRect,
  ]);

  useEffect(() => {
    if (isSelfInsightSelected) {
      setShowMemoSection(true);
    }
  }, [isSelfInsightSelected]);

  useEffect(() => {
    if (!hasMemoInput && selectedCategories.length > 0) {
      setSelectedCategories([]);
    }
  }, [hasMemoInput, selectedCategories.length]);

  const toggleEmotion = (cat) => {
    setSelectedEmotions((prev) => {
      let next = prev;

      // 「自己理解」は単独選択（他の感情をクリアして選択）
      if (cat === SELF_INSIGHT) {
        const exists = prev.find((e) => e.type === SELF_INSIGHT);
        next = exists
          ? prev.filter((e) => e.type !== SELF_INSIGHT)
          : [{ type: SELF_INSIGHT, strength: "medium" }];
      } else if (prev.some((e) => e.type === SELF_INSIGHT)) {
        // 「自己理解」選択中は他の感情を押せない
        next = prev;
      } else {
        const exists = prev.find((e) => e.type === cat);
        next = exists
          ? prev.filter((e) => e.type !== cat)
          : [...prev, { type: cat, strength: "medium" }];
      }

      if (
        isTutorialMode &&
        tutorialStep === 2 &&
        next.some((e) => e.type !== SELF_INSIGHT)
      ) {
        requestAnimationFrame(() => {
          setTutorialStep(3);
        });
      }

      return next;
    });
  };

  const changeStrength = (cat, s) => {
    setSelectedEmotions((prev) =>
      prev.map((e) => (e.type === cat ? { ...e, strength: s } : e))
    );
  };

  const toggleCategory = (category) => {
    if (!hasMemoInput) return;
    const nextCategory = String(category || "").trim();
    if (!nextCategory) return;
    setSelectedCategories((prev) => {
      const exists = prev.includes(nextCategory);
      return exists
        ? prev.filter((item) => item !== nextCategory)
        : [...prev, nextCategory];
    });
  };

  const handleOk = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      // 1) 入力内容を MashOS Emotion Submit API 用のペイロードに変換
      const emotionDetails = selectedEmotions.map((e) => ({
        type: e.type,
        strength: e.strength,
      }));
      const createdAt = new Date().toISOString();

      const payload = {
        emotions: emotionDetails,
        memo,
        created_at: createdAt,
        is_secret: isSecret,
        notify_friends: sendFriendNotification,
      };

      if (hasMemoInput && selectedCategories.length > 0) {
        payload.category = selectedCategories;
      }

      if (memoAction && memoAction.trim().length > 0) {
        payload.memo_action = memoAction;
      }

      const strengthScore = (s) =>
        s === "strong" ? 3 : s === "medium" ? 2 : s === "weak" ? 1 : 0;
      let dominant = null;
      for (const e of emotionDetails || []) {
        if (
          !dominant ||
          strengthScore(e.strength) > strengthScore(dominant.strength)
        ) {
          dominant = e;
        }
      }
      const strengthLabelJa = { weak: "弱", medium: "中", strong: "強" };
      const dominantType = dominant?.type || "—";
      const dominantStrength =
        dominant && dominantType !== SELF_INSIGHT
          ? strengthLabelJa[dominant.strength] || ""
          : "";
      const dominantSuffix = dominantStrength ? `（${dominantStrength}）` : "";

      if (isTutorialMode) {
        addTutorialEmotion({
          id: `tutorial-emotion-${Date.now()}`,
          ...payload,
          is_tutorial: true,
        });

        try {
          setTutorialStep(7);
        } catch {
          // noop
        }

        setSelectedEmotions([]);
        setMemo("");
        setMemoAction("");
        setSelectedCategories([]);
        setShowMemoSection(false);
        setActiveField(null);
        setMemoContentHeight(44);
        setMemoActionContentHeight(44);
        setIsSecret(false);
        Keyboard.dismiss();

        showToast(`チュートリアルに記録しました
主感情：${dominantType}${dominantSuffix}`);

        if (sendFriendNotification) {
          try {
            if (tutorialFriendNotifyTimerRef.current) {
              clearTimeout(tutorialFriendNotifyTimerRef.current);
            }
          } catch {
            // noop
          }

          tutorialFriendNotifyTimerRef.current = setTimeout(() => {
            const tutorialFriendName = "（仮のユーザー名）";
            const feedCreatedAt = new Date().toISOString();
            const feedTimeLabel = new Date(feedCreatedAt).toLocaleString("ja-JP", {
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            try {
              addTutorialFriendFeedItem({
                id: `tutorial-friend-feed-${Date.now()}`,
                ownerName: tutorialFriendName,
                owner_name: tutorialFriendName,
                items: emotionDetails.map((e) => ({
                  type: e.type,
                  strength: e.strength,
                })),
                emotions: emotionDetails.map((e) => ({
                  type: e.type,
                  strength: e.strength,
                })),
                created_at: feedCreatedAt,
                timeLabel: feedTimeLabel,
                is_tutorial: true,
              });
            } catch {
              // noop
            }

            try {
              setUnread("Friends", "feed", true);
            } catch {
              // noop
            }

            tutorialFriendNotifyTimerRef.current = null;
          }, 3000);
        }

        requestAnimationFrame(() => {
          try {
            navigation?.navigate?.("MyWeb");
            return;
          } catch {
            // noop
          }

          try {
            const parent =
              typeof navigation?.getParent === "function"
                ? navigation.getParent()
                : null;
            parent?.navigate?.("MyWeb");
          } catch {
            // noop
          }
        });
        return;
      }

      await apiPost("/emotion/submit", payload);
      // 送信が成功したら、入力状態をリセットし、完了メッセージ（Toast）を表示する
      setSelectedEmotions([]);
      setMemo("");
      setMemoAction("");
      setSelectedCategories([]);
      setShowMemoSection(false);
      setActiveField(null);
      setMemoContentHeight(44);
      setMemoActionContentHeight(44);
      setIsSecret(false);
      Keyboard.dismiss();

      // まずは軽い即時フィードバック（カウント取得失敗時のフォールバックにもなる）
      showToast(`記録しました
主感情：${dominantType}${dominantSuffix}`);
      const summaryPromise = refreshHomeCounts();
      void fetchGlobalSummary();
      const summary = await summaryPromise;
      if (summary?.todayCount != null && summary?.monthCount != null) {
        showToast(`今日の観測：${summary.todayCount}回目 / 今月：${summary.monthCount}回達成
主感情：${dominantType}${dominantSuffix}`);
      }
    } catch (error) {
      console.error("入力処理エラー:", error);
      Alert.alert(
        "エラー",
        `入力の保存処理に失敗しました。
${String(error?.message || error)}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenNoticeHistory = useCallback(async () => {
    const openNoticeId = String(noticePopup?.notice_id || "").trim() || null;
    setNoticeModalVisible(false);
    await markCurrentNoticePopupSeen();
    try {
      navigation?.navigate?.("NoticeHistory", {
        open_notice_id: openNoticeId,
        open_notice_at: Date.now(),
      });
    } catch {
      // noop
    }
  }, [markCurrentNoticePopupSeen, navigation, noticePopup?.notice_id]);

  const openNoticeInternalRoute = useCallback((routeName, params = {}) => {
    const safeRouteName = String(routeName || "").trim();
    if (!safeRouteName) return false;
    try {
      navigation?.navigate?.(safeRouteName, params);
      return true;
    } catch {
      // noop
    }
    try {
      const parent =
        typeof navigation?.getParent === "function"
          ? navigation.getParent()
          : null;
      parent?.navigate?.(safeRouteName, params);
      return true;
    } catch {
      // noop
    }
    return false;
  }, [navigation]);

  const handlePressNoticeCta = useCallback(async () => {
    const cta = noticePopup?.cta && typeof noticePopup.cta === "object"
      ? noticePopup.cta
      : null;
    const kind = String(cta?.kind || "none").trim().toLowerCase();
    if (!cta || !kind || kind === "none") {
      return;
    }

    setNoticeModalVisible(false);
    await markCurrentNoticePopupSeen();

    if (kind === "url") {
      const url = String(cta?.url || "").trim();
      if (!url) return;
      try {
        await Linking.openURL(url);
      } catch (e) {
        Alert.alert("お知らせ", String(e?.message || "リンクを開けませんでした。"));
      }
      return;
    }

    if (kind === "internal_route") {
      const routeName = String(cta?.route || "").trim();
      if (!routeName) return;
      const params = cta?.params && typeof cta.params === "object" ? cta.params : {};
      const opened = openNoticeInternalRoute(routeName, params);
      if (!opened) {
        Alert.alert("お知らせ", "遷移先を開けませんでした。");
      }
    }
  }, [markCurrentNoticePopupSeen, noticePopup, openNoticeInternalRoute]);

  const handleDismissNoticeModal = useCallback(async () => {
    setNoticeModalVisible(false);
    await markCurrentNoticePopupSeen();
  }, [markCurrentNoticePopupSeen]);

  const handlePressNotifications = useCallback(() => {
    try {
      navigation?.navigate?.("NoticeHistory", {
        open_notice_id: null,
        open_notice_at: Date.now(),
      });
    } catch {
      // noop
    }
  }, [navigation]);

  const handlePressGuide = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate("CocolonGuide", { screenId: "home" });
    } else {
      Alert.alert("ガイド", "ガイド画面へのナビゲーションがまだ設定されていません。");
    }
  };

  const handlePressAccount = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate("Account");
    } else {
      Alert.alert(
        "アカウント",
        "アカウント画面へのナビゲーションがまだ設定されていません。"
      );
    }
  };

  return (
    <View ref={screenRootRef} collapsable={false} style={styles.safeArea}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />
      <View style={styles.safeContent}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={[
              styles.scrollContainer,
              { paddingBottom: 32 + keyboardInset },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              currentScrollYRef.current =
                e?.nativeEvent?.contentOffset?.y ?? currentScrollYRef.current;
            }}
          >
{/* パネルヘッダー */}
              <View style={styles.panelHeader}>
                <View style={styles.panelTitleRow}>
                  <Text style={styles.panelTitle}>Home</Text>
                  <CocolonPressable
                    style={styles.guideTitleButton}
                    onPress={handlePressGuide}
                    accessibilityLabel="ガイドを開く"
                  >
                    <Ionicons
                      name="help-circle-outline"
                      size={20}
                      color={colors.TEXT_ON_LIGHT}
                    />
                  </CocolonPressable>
                </View>

                <View style={styles.headerRight}>
                  <CocolonPressable
                    style={styles.accountIconButton}
                    onPress={handlePressAccount}
                    accessibilityLabel="アカウントページを開く"
                  >
                    <Ionicons
                      name="person-circle-outline"
                      size={20}
                      color={colors.TEXT_ON_LIGHT}
                    />
                  </CocolonPressable>
                  <CocolonPressable
                    style={styles.noticePill}
                    onPress={handlePressNotifications}
                    accessibilityLabel="お知らせを開く"
                  >
                    <Ionicons
                      name="notifications-outline"
                      size={20}
                      color={colors.TEXT_ON_LIGHT}
                    />
                    {noticeFeatureEnabled && noticeUnreadCount > 0 ? (
                      <UnreadBadge
                        variant="dot"
                        style={styles.noticeBadgeDot}
                      />
                    ) : null}
                  </CocolonPressable>
                </View>
              </View>

              <View style={styles.globalSummaryBlock}>
                <View style={styles.globalSummaryInner}>
                  <View style={styles.globalSummaryHeaderRow}>
                    <Ionicons
                      name="radio-outline"
                      size={14}
                      color={colors.TITLE_GOLD}
                      style={styles.globalSummaryIcon}
                    />
                    <Text style={styles.globalSummaryLabel}>今日の全体活動</Text>
                  </View>
                  <Text style={styles.globalSummaryText}>
                    {`今日、全体で ${
                      typeof globalEmotionUsers === "number" ? globalEmotionUsers : "—"
                    } 人が感情入力しました`}
                  </Text>
                </View>
              </View>

              {/* 今日の観測（常設） */}
              <View style={styles.homeStatsCard}>
                <View style={styles.homeStatsRow}>
                  <Text style={styles.homeStatsLabel}>今日の観測</Text>
                  <Text style={styles.homeStatsValue}>
                    {typeof homeTodayCount === "number"
                      ? `${homeTodayCount}回目`
                      : "—"}
                  </Text>
                </View>
                {homeBadgeLabel ? (
                  <View style={styles.homeBadgeRow}>
                    <Ionicons
                      name="ribbon-outline"
                      size={16}
                      color={colors.TITLE_GOLD}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.homeBadgeText}>{homeBadgeLabel}</Text>
                  </View>
                ) : null}
              </View>

              {!shouldHideTodayQuestionForTutorial && todayQuestionBundle?.question ? (
                <View style={{ marginBottom: 14 }}>
                  <TodayQuestionCard
                    question={todayQuestionBundle?.question}
                    answerSummary={todayQuestionBundle?.answer_summary || null}
                    loading={todayQuestionLoading}
                    submitting={todayQuestionSubmitting}
                    showHistoryButton
                    onSubmit={handleSubmitTodayQuestion}
                    onOpenHistory={handleOpenTodayQuestionHistory}
                  />
                </View>
              ) : null}

              {/* 「今の気持ちを入力」エリア */}
              <View
                ref={emotionAreaRef}
                collapsable={false}
                style={styles.section}
              >
                <Text style={[styles.sectionLabel, { fontWeight: "700" }]}>
                  感情を選択
                </Text>

                {/* 感情ボタン群（2段レイアウト） */}
                <View style={styles.buttons}>
                  {EMOTION_ROWS.map((row, rowIndex) => (
                    <View key={`row-${rowIndex}`} style={styles.emotionRow}>
                      {row.map((cat, colIndex) => {
                        if (!cat) {
                          return (
                            <View
                              key={`empty-${rowIndex}-${colIndex}`}
                              style={styles.emotionBlock}
                            />
                          );
                        }

                        const emotion = selectedEmotions.find(
                          (e) => e.type === cat
                        );
                        const on = !!emotion;
                        const isDisabled = isSelfInsightSelected;

                        return (
                          <View key={cat} style={styles.emotionBlock}>
                            <CocolonPressable
                              onPress={() => toggleEmotion(cat)}
                              disabled={isDisabled}
                              style={[
                                styles.chip,
                                on && styles.chipOn,
                                isDisabled && { opacity: 0.45 },
                              ]}
                            >
                              <Ionicons
                                name={
                                  cat === "喜び"
                                    ? "happy-outline"
                                    : cat === "悲しみ"
                                    ? "sad-outline"
                                    : cat === "怒り"
                                    ? "flash-outline"
                                    : cat === "不安"
                                    ? "alert-circle-outline"
                                    : "leaf-outline"
                                }
                                size={16}
                                color={
                                  on ? colors.ACCENT_TEXT : colors.TEXT_SUBTLE
                                }
                                style={{ marginRight: 4 }}
                              />
                              <Text
                                style={[
                                  styles.chipText,
                                  on && styles.chipTextOn,
                                ]}
                              >
                                {cat}
                              </Text>
                            </CocolonPressable>

                            <View
                              ref={(node) => {
                                strengthRowRefs.current[cat] = node;
                              }}
                              collapsable={false}
                              style={styles.strengthRow}
                            >
                              {on &&
                                ["weak", "medium", "strong"].map((s) => (
                                  <CocolonPressable
                                    key={s}
                                    onPress={() => changeStrength(cat, s)}
                                    style={[
                                      styles.strengthChip,
                                      emotion?.strength === s &&
                                        styles.strengthChipOn,
                                    ]}
                                  >
                                    <Text
                                      style={[
                                        styles.strengthText,
                                        emotion?.strength === s &&
                                          styles.strengthTextOn,
                                      ]}
                                    >
                                      {{
                                        weak: "弱",
                                        medium: "中",
                                        strong: "強",
                                      }[s]}
                                    </Text>
                                  </CocolonPressable>
                                ))}
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { fontWeight: "700" }]}>
                  自分のことで発見や気づきがあったときはこちら
                </Text>
                <CocolonPressable
                  onPress={() => toggleEmotion(SELF_INSIGHT)}
                  style={[
                    styles.selfInsightCard,
                    isSelfInsightSelected && styles.selfInsightCardOn,
                  ]}
                  accessibilityLabel="自己理解モードを切り替える"
                >
                  <View style={styles.selfInsightRow}>
                    <View style={styles.selfInsightLeft}>
                      <Ionicons
                        name="bulb-outline"
                        size={18}
                        color={
                          isSelfInsightSelected
                            ? colors.ACCENT_TEXT
                            : colors.TEXT_SUBTLE
                        }
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={[
                          styles.selfInsightText,
                          isSelfInsightSelected && styles.selfInsightTextOn,
                        ]}
                      >
                        自己理解モード
                      </Text>
                    </View>
                    <Ionicons
                      name={
                        isSelfInsightSelected
                          ? "checkmark-circle"
                          : "chevron-forward"
                      }
                      size={18}
                      color={
                        isSelfInsightSelected
                          ? colors.ACCENT_TEXT
                          : colors.TEXT_SUBTLE
                      }
                    />
                  </View>
                </CocolonPressable>
              </View>

              <View style={styles.section}>
                <View style={styles.preferenceCard}>
                  <View style={styles.preferenceRow}>
                    <View style={styles.preferenceLeft}>
                      <Ionicons
                        name="notifications-outline"
                        size={18}
                        color={colors.TEXT_SUBTLE}
                        style={styles.preferenceIcon}
                      />
                      <View style={styles.preferenceTextWrap}>
                        <Text style={styles.preferenceTitle}>
                          フレンドに通知しない
                        </Text>
                        <Text style={styles.preferenceDesc}>
                          オンにすると感情入力がフレンドに通知されません。
                        </Text>
                      </View>
                    </View>
                    <CocolonSwitch
                      value={doNotNotifyFriends}
                      onValueChange={(v) => setSendFriendNotification(!v)}
                      trackColor={{
                        false: "#D1D5DB",
                        true: colors.GOLD_BUTTON,
                      }}
                      thumbColor={
                        Platform.OS === "android"
                          ? doNotNotifyFriends
                            ? "#FFFFFF"
                            : "#F9FAFB"
                          : undefined
                      }
                      ios_backgroundColor="#D1D5DB"
                      accessibilityLabel="フレンドに通知しない設定を切り替える"
                    />
                  </View>
                </View>

                {showMemoSection ? (
                  <View
                    ref={memoSectionRef}
                    collapsable={false}
                    style={styles.memoSection}
                  >
                    <View style={styles.memoRevealDividerBlock}>
                      <View style={styles.memoRevealDivider} />
                    </View>
                    <Text
                      style={[styles.sectionLabel, { fontWeight: "700" }]}
                    >
                      思考内容（自己世界の出来事）：{"\n"}何を思った／どう感じた／どう解釈した？
                    </Text>
                    {activeField === "memo" ? (
                      <View style={[styles.memoCard, styles.memoCardExpanded]}>
                        <TextInput
                          ref={memoInputRef}
                          style={[
                            styles.memoInput,
                            {
                              flex: 0,
                              width: "100%",
                              height: Math.min(
                                Math.max(memoContentHeight || 44, 44),
                                inputMaxHeight
                              ),
                            },
                          ]}
                          placeholder="ここに書いてください。"
                          {...(isIOS ? { defaultValue: memo } : { value: memo })}
                          onChangeText={setMemo}
                          {...(isIOS
                            ? {
                                onChange: (e) =>
                                  setMemo(e?.nativeEvent?.text ?? ""),
                              }
                            : {})}
                          multiline
                          scrollEnabled
                          textAlignVertical="top"
                          placeholderTextColor={colors.TEXT_ON_LIGHT}
                          onFocus={(e) => {
                            lastFocusTargetRef.current =
                              e?.target ?? e?.nativeEvent?.target ?? null;
                            memoFocusedRef.current = true;
                            focusedFieldRef.current = "memo";
                            requestAnimationFrame(() => scrollToFocusedInput());
                          }}
                          onBlur={() => {
                            memoFocusedRef.current = false;
                            focusedFieldRef.current = null;
                            lastFocusTargetRef.current = null;
                            setActiveField(null);
                          }}
                          onContentSizeChange={(e) => {
                            const h = e?.nativeEvent?.contentSize?.height ?? 0;
                            if (h) setMemoContentHeight(h);
                            if (focusedFieldRef.current !== "memo") return;
                            requestAnimationFrame(() => scrollToFocusedInput());
                          }}
                        />
                      </View>
                    ) : (
                      <CocolonPressable
                        style={[styles.memoCard, styles.memoCardCollapsed]}
                        onPress={() => openField("memo")}
                        accessibilityLabel="思考内容を入力する"
                      >
                        <View style={styles.collapsedRow}>
                          <View style={styles.collapsedLeft}>
                            <Ionicons
                              name="create-outline"
                              size={18}
                              color={colors.TEXT_SUBTLE}
                              style={{ marginRight: 8 }}
                            />
                            <Text
                              style={[
                                styles.collapsedText,
                                !(memo && memo.trim().length > 0) &&
                                  styles.collapsedTextPlaceholder,
                              ]}
                              numberOfLines={1}
                            >
                              {memo && memo.trim().length > 0
                                ? memo.replace(/\s+/g, " ").trim()
                                : "ここに書いてください。"}
                            </Text>
                          </View>
                          <Ionicons
                            name="chevron-down"
                            size={18}
                            color={colors.TEXT_SUBTLE}
                          />
                        </View>
                      </CocolonPressable>
                    )}

                    <Text
                      style={[
                        styles.sectionLabel,
                        { marginTop: 10, fontWeight: "700" },
                      ]}
                    >
                      行動内容（実世界の出来事）：{"\n"}何が起きた／何をした（できなかった）／結果どうなった？
                    </Text>
                    {activeField === "memoAction" ? (
                      <View style={[styles.memoCard, styles.memoCardExpanded]}>
                        <TextInput
                          ref={memoActionInputRef}
                          style={[
                            styles.memoInput,
                            {
                              flex: 0,
                              width: "100%",
                              height: Math.min(
                                Math.max(memoActionContentHeight || 44, 44),
                                inputMaxHeight
                              ),
                            },
                          ]}
                          placeholder="ここに書いてください。"
                          {...(isIOS
                            ? { defaultValue: memoAction }
                            : { value: memoAction })}
                          onChangeText={setMemoAction}
                          {...(isIOS
                            ? {
                                onChange: (e) =>
                                  setMemoAction(e?.nativeEvent?.text ?? ""),
                              }
                            : {})}
                          multiline
                          scrollEnabled
                          textAlignVertical="top"
                          placeholderTextColor={colors.TEXT_ON_LIGHT}
                          onFocus={(e) => {
                            lastFocusTargetRef.current =
                              e?.target ?? e?.nativeEvent?.target ?? null;
                            memoFocusedRef.current = true;
                            focusedFieldRef.current = "memoAction";
                            requestAnimationFrame(() => scrollToFocusedInput());
                          }}
                          onBlur={() => {
                            memoFocusedRef.current = false;
                            focusedFieldRef.current = null;
                            lastFocusTargetRef.current = null;
                            setActiveField(null);
                          }}
                          onContentSizeChange={(e) => {
                            const h = e?.nativeEvent?.contentSize?.height ?? 0;
                            if (h) setMemoActionContentHeight(h);
                            if (focusedFieldRef.current !== "memoAction") return;
                            requestAnimationFrame(() => scrollToFocusedInput());
                          }}
                        />
                      </View>
                    ) : (
                      <CocolonPressable
                        style={[styles.memoCard, styles.memoCardCollapsed]}
                        onPress={() => openField("memoAction")}
                        accessibilityLabel="行動内容を入力する"
                      >
                        <View style={styles.collapsedRow}>
                          <View style={styles.collapsedLeft}>
                            <Ionicons
                              name="walk-outline"
                              size={18}
                              color={colors.TEXT_SUBTLE}
                              style={{ marginRight: 8 }}
                            />
                            <Text
                              style={[
                                styles.collapsedText,
                                !(memoAction && memoAction.trim().length > 0) &&
                                  styles.collapsedTextPlaceholder,
                              ]}
                              numberOfLines={1}
                            >
                              {memoAction && memoAction.trim().length > 0
                                ? memoAction.replace(/\s+/g, " ").trim()
                                : "ここに書いてください。"}
                            </Text>
                          </View>
                          <Ionicons
                            name="chevron-down"
                            size={18}
                            color={colors.TEXT_SUBTLE}
                          />
                        </View>
                      </CocolonPressable>
                    )}

                    <View style={styles.categorySection}>
                      <Text
                        style={[styles.sectionLabel, { fontWeight: "700" }]}
                      >
                        このメモの内容カテゴリ
                      </Text>
                      <Text style={styles.categoryHintText}>
                        {hasMemoInput
                          ? "この出来事や思考に近いカテゴリを、1つ以上選んでください。"
                          : "思考内容または行動内容を入力すると選択できます。"}
                      </Text>
                      <View style={styles.categoryGrid}>
                        {CATEGORY_OPTIONS.map((category) => {
                          const isActive = selectedCategories.includes(category);
                          const isDisabled = !hasMemoInput;
                          return (
                            <CocolonPressable
                              key={category}
                              onPress={() => toggleCategory(category)}
                              disabled={isDisabled}
                              style={[
                                styles.categoryChip,
                                isActive && styles.categoryChipOn,
                                isDisabled && styles.categoryChipDisabled,
                              ]}
                              accessibilityLabel={`${category}カテゴリを選択する`}
                            >
                              <Text
                                style={[
                                  styles.categoryChipText,
                                  isActive && styles.categoryChipTextOn,
                                  isDisabled && styles.categoryChipTextDisabled,
                                ]}
                              >
                                {category}
                              </Text>
                            </CocolonPressable>
                          );
                        })}
                      </View>
                      {hasMemoInput && !hasSelectedCategories ? (
                        <Text style={styles.categoryRequiredText}>
                          メモを入力した場合は、カテゴリを1つ以上選択してください。
                        </Text>
                      ) : null}
                    </View>

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
                            <Text style={styles.preferenceTitle}>
                              シークレットメモ
                            </Text>
                            <Text style={styles.preferenceDesc}>
                              オンにするとMyModel照会時に反映されません。{"\n"}
                              分析レポートには反映されます。
                            </Text>
                          </View>
                        </View>
                        <CocolonSwitch
                          value={isSecret}
                          onValueChange={setIsSecret}
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
                ) : null}

                <View
                  ref={okButtonRef}
                  collapsable={false}
                  style={styles.buttonWrapper}
                >
                  <CocolonButton
                    variant="primary"
                    onPress={handleOk}
                    disabled={!canSubmit}
                    loading={submitting}
                    accessibilityLabel="この内容でOK"
                  >
                    この内容でOK
                  </CocolonButton>
                </View>

                {!isSelfInsightSelected ? (
                  <View
                    ref={memoToggleButtonRef}
                    collapsable={false}
                    style={styles.memoToggleButtonWrapper}
                  >
                    <CocolonPressable
                      style={styles.memoToggleButton}
                      onPress={() => {
                        if (showMemoSection) {
                          setActiveField(null);
                          Keyboard.dismiss();
                        }
                        setShowMemoSection((prev) => !prev);
                      }}
                      accessibilityLabel={
                        showMemoSection
                          ? "メモ入力を閉じる"
                          : "メモ入力を開く"
                      }
                    >
                      <Ionicons
                        name={showMemoSection ? "chevron-up" : "chevron-down"}
                        size={18}
                        color="#000000"
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.memoToggleText}>
                        {showMemoSection ? "メモを閉じる" : "メモを書く"}
                      </Text>
                    </CocolonPressable>
                  </View>
                ) : null}
              </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
<NoticeModal
  visible={!isTutorialMode && noticeFeatureEnabled && noticeModalVisible && !!noticePopup}
  notice={noticePopup}
  loading={noticeLoading}
  onClose={handleDismissNoticeModal}
  onOpenHistory={handleOpenNoticeHistory}
  onPressCta={handlePressNoticeCta}
/>
<TodayQuestionModal
  visible={!shouldHideTodayQuestionForTutorial && !noticeModalVisible && todayQuestionModalVisible && !!todayQuestionBundle?.question && todayQuestionBundle?.answer_status !== "answered"}
  question={todayQuestionBundle?.question}
  answerSummary={todayQuestionBundle?.answer_summary || null}
  loading={todayQuestionLoading}
  submitting={todayQuestionSubmitting}
  onClose={handleDismissTodayQuestionModal}
  onSubmit={handleSubmitTodayQuestion}
  onOpenHistory={handleOpenTodayQuestionHistory}
/>
      </View>

{tutorialOverlayConfig ? (
  <TutorialOverlay
    visible={!!tutorialOverlayConfig}
    targetRect={tutorialTargetRect}
    title={tutorialOverlayConfig.title}
    message={tutorialOverlayConfig.message}
    step={tutorialOverlayConfig.step}
    totalSteps={TUTORIAL_TOTAL_STEPS}
    mode={tutorialOverlayConfig.mode}
    nextLabel={tutorialOverlayConfig.nextLabel}
    onNext={tutorialOverlayConfig.onNext}
    onTargetPress={tutorialStep === 6 ? handleOk : undefined}
    onMetricsChange={setTutorialOverlayMetrics}
    actionHint={tutorialOverlayConfig.actionHint}
    cardPlacement={tutorialOverlayConfig.cardPlacement}
  />
) : null}

{toastMessage ? (
  <View pointerEvents="none" style={styles.toastOverlay}>
    <View style={styles.toastCard}>
      <Ionicons
        name="checkmark-circle-outline"
        size={20}
        color={colors.TITLE_GOLD}
        style={{ marginRight: 8 }}
      />
      <Text style={styles.toastText} numberOfLines={3}>
        {toastMessage}
      </Text>
    </View>
  </View>
) : null}

    </View>
  );
}

function createStyles(COLORS, ui) {
  const font = ui?.font || {};
  const text = ui?.text || {};
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.PANEL_BG,
    },
    safeContent: {
      flex: 1,
    },
    scrollContainer: {
      paddingTop: 16,
      paddingBottom: 32,
      paddingHorizontal: 18,
      alignItems: "stretch",
    },

    /** ブランドヘッダー */
    appTitleWrapper: {
      alignItems: "center",
      marginBottom: 14,
    },
    appTitleText: {
      fontFamily: "CormorantGaramond-Bold",
      fontSize: 24,
      color: COLORS.BRAND_GOLD,
      letterSpacing: 1.2,
    },
    appSubtitleText: {
      fontFamily: "CormorantGaramond-Regular",
      marginTop: 4,
      fontSize: 11,
      color: COLORS.BRAND_GOLD,
      letterSpacing: 0.8,
    },

    /** メインパネル（MyModel共通） */
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
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    panelTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      letterSpacing: 0.8,
    },
    panelTitleRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    guideTitleButton: {
      width: 36,
      height: 32,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      marginLeft: 10,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    globalSummaryBlock: {
      marginBottom: 14,
    },
    globalSummaryInner: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingVertical: 8,
    },
    globalSummaryHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    globalSummaryIcon: {
      marginRight: 6,
    },
    globalSummaryLabel: {
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 0.3,
      color: COLORS.TEXT_ON_LIGHT,
    },
    globalSummaryText: {
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
    },
    accountIconButton: {
      width: 42,
      height: 38,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      marginRight: 10,
    },
    noticePill: {
      width: 42,
      height: 38,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      position: "relative",
      overflow: "visible",
    },
    noticeBadgeDot: {
      position: "absolute",
      top: 8,
      right: 8,
    },

    /** 今日の観測（常設） */
    homeStatsCard: {
      marginBottom: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    homeStatsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 2,
    },
    homeStatsLabel: {
      fontSize: 12,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },
    homeStatsValue: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },

    homeBadgeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      marginTop: 6,
    },
    homeBadgeText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
    },

    /** セクション共通 */
    section: {
      marginBottom: 18,
    },
    sectionLabel: {
      fontSize: font.sectionLabel ?? 12,
      color: text.sectionLabel ?? text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginBottom: 8,
    },

    /** 感情ボタン */
    buttons: {
      marginTop: 2,
    },
    selfInsightCard: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 14,
      paddingVertical: 12,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    selfInsightCardOn: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    selfInsightRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    selfInsightLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      paddingRight: 8,
    },
    selfInsightText: {
      fontSize: 14,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },
    selfInsightTextOn: {
      color: COLORS.ACCENT_TEXT,
    },
    emotionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    emotionBlock: {
      width: "30%",
      alignItems: "center",
    },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 14,
      marginBottom: 4,
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    chipOn: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    chipText: {
      fontSize: 14,
      color: COLORS.TEXT_ON_LIGHT,
    },
    // アクティブ時は ACCENT_TEXT（＝白）で塗る
    chipTextOn: {
      color: COLORS.ACCENT_TEXT,
      fontWeight: "600",
    },

    /** 感情強度（高さ固定） */
    strengthRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 2,
      height: 28,
    },
    strengthChip: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      marginHorizontal: 2,
      borderRadius: 10,
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
    },
    strengthChipOn: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    strengthText: {
      fontSize: 12,
      color: COLORS.TEXT_ON_LIGHT,
    },
    strengthTextOn: {
      color: COLORS.ACCENT_TEXT,
      fontWeight: "600",
    },

    categorySection: {
      marginTop: 12,
      marginBottom: 10,
    },
    categoryHintText: {
      marginBottom: 10,
      fontSize: 11,
      lineHeight: 16,
      color: "#000000",
    },
    categoryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginHorizontal: -4,
    },
    categoryChip: {
      minWidth: "28%",
      marginHorizontal: 4,
      marginBottom: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    categoryChipOn: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      transform: [{ scale: 1.04 }],
    },
    categoryChipDisabled: {
      opacity: 0.45,
    },
    categoryChipText: {
      fontSize: 12,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },
    categoryChipTextOn: {
      color: COLORS.ACCENT_TEXT,
    },
    categoryChipTextDisabled: {
      color: COLORS.TEXT_SUBTLE,
    },
    categoryRequiredText: {
      marginTop: 2,
      fontSize: 11,
      lineHeight: 16,
      color: "#B91C1C",
    },

    /** メモ入力カード（展開式：タップで開く） */
    memoCard: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 12,
      paddingVertical: 10,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    memoCardCollapsed: {
      minHeight: 54,
      justifyContent: "center",
    },
    memoCardExpanded: {
      minHeight: 120,
    },
    collapsedRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    collapsedLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      paddingRight: 8,
    },
    collapsedText: {
      flex: 1,
      fontSize: 14,
      color: COLORS.TEXT_ON_LIGHT,
    },
    collapsedTextPlaceholder: {
      color: COLORS.TEXT_SUBTLE,
    },
    memoInput: {
      flex: 1,
      minHeight: 90,
      fontSize: 14,
      color: COLORS.TEXT_ON_LIGHT,
    },
    memoSection: {
      marginTop: 0,
    },
    memoRevealDividerBlock: {
      marginTop: 28,
      marginBottom: 24,
    },
    memoRevealDivider: {
      height: 1,
      backgroundColor: COLORS.CARD_BORDER,
    },


    /**
     * 設定風トグル（文章 + ON/OFF）
     * - シークレットメモ（既存機能）
     * - フレンド通知（通知しない設定）
     */
    preferenceCard: {
      marginTop: 18,
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
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },
    preferenceDivider: {
      height: 1,
      backgroundColor: COLORS.CARD_BORDER,
      marginLeft: 12,
    },


    /** シークレット */
    secretToggle: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      marginTop: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    secretToggleOn: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    secretToggleText: {
      fontSize: 12,
      color: "#374151",
      fontWeight: "600",
    },
    secretToggleTextOn: {
      color: COLORS.ACCENT_TEXT,
    },
    secretHint: {
      marginTop: 6,
      fontSize: 11,
      lineHeight: 16,
      color: "#374151",
    },
    /** goldButton（共通） */
    buttonWrapper: {
      marginTop: 8,
      width: "100%",
    },
    memoToggleButtonWrapper: {
      alignSelf: "stretch",
    },
    memoToggleButton: {
      marginTop: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    memoToggleText: {
      fontSize: 13,
      fontWeight: "800",
      color: "#000000",
    },
    goldButton: {
      paddingVertical: 13,
      paddingHorizontal: 28,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOpacity: 0.22,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 7 },
      elevation: 9,
    },
    goldButtonText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 15,
    },
    goldButtonDisabled: {
      opacity: 0.5,
      shadowOpacity: 0.05,
    },

/** Toast */
toastOverlay: {
  position: "absolute",
  left: 18,
  right: 18,
  bottom: 18,
  alignItems: "center",
},
toastCard: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 14,
  paddingHorizontal: 18,
  borderRadius: 18,
  backgroundColor: COLORS.FIELD_BG,
  borderWidth: 1,
  borderColor: COLORS.CARD_BORDER,
  shadowColor: "#000",
  shadowOpacity: 0.18,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 6,
},
toastText: {
  flexShrink: 1,
  fontSize: 15,
  lineHeight: 22,
  fontWeight: "700",
  color: COLORS.TEXT_ON_LIGHT,
},
  });
}

