import Ionicons from "react-native-vector-icons/Ionicons";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
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
import AsyncStorage from "@react-native-async-storage/async-storage";

// Supabase Auth
import { useAuth } from "../AuthContext";
import { submitEmotionInput } from "../lib/api/home/emotionSubmitApi";
import {
  cancelEmotionReflection,
  previewEmotionReflection,
  publishEmotionReflection,
} from "../lib/api/home/emotionReflectionApi";
import { getNoticeButtonActions, openNoticeAction } from "../lib/noticeActionRuntime";
import { STARTUP_POPUP_KIND, useHomeState } from "../features/home/useHomeState";
import { useHomeActions } from "../features/home/useHomeActions";

// テーマ
import { useTheme } from "../theme/ThemeContext";

import { useUnread } from "../UnreadContext";
import { useTutorial } from "../TutorialContext";

// UI (Design System)
import CocolonButton from "../components/CocolonButton";
import CocolonPressable from "../components/CocolonPressable";
import CocolonSwitch from "../components/CocolonSwitch";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TutorialOverlay, {
  syncTutorialSpotlightTarget,
  waitForTutorialFrames,
} from "../components/TutorialOverlay";
import TodayQuestionCard from "../components/TodayQuestionCard";
import TodayQuestionModal from "../components/TodayQuestionModal";
import NoticeModal from "../components/NoticeModal";
import TutorialStartModal from "../components/TutorialStartModal";
import { ScreenUnreadBadge } from "../components/UnreadBadge";
import EmotionReflectionPreviewModal from "../components/EmotionReflectionPreviewModal";

// 未送信下書きは InputScreen 内で自己完結させ、
// Metro の外部 helper 解決に依存しないようにする。

const INPUT_DRAFT_TTL_HOURS = 48;
const INPUT_DRAFT_TTL_MS = INPUT_DRAFT_TTL_HOURS * 60 * 60 * 1000;
const INPUT_DRAFT_STORAGE_VERSION = 1;
const INPUT_DRAFT_KEY_PREFIX = "cocolon.inputDraft.v1";
const VALID_STRENGTHS = new Set(["weak", "medium", "strong"]);

function isWelcomeNoticePopupCandidate(notice) {
  const explicitVariant = String(
    notice?.popup_variant ||
      notice?.notice_variant ||
      notice?.modal_variant ||
      notice?.variant ||
      "",
  )
    .trim()
    .toLowerCase();
  if (explicitVariant === "welcome" || explicitVariant === "intro") {
    return true;
  }

  const title = String(notice?.title || "").trim();
  if (title !== "はじめに") return false;

  const buttonActions = getNoticeButtonActions(notice?.actions, notice?.cta);
  return buttonActions.length === 0;
}

function normalizeDraftUserId(userId) {
  return String(userId || "").trim();
}

function buildInputDraftStorageKey(userId) {
  const normalizedUserId = normalizeDraftUserId(userId);
  if (!normalizedUserId) return null;
  return `${INPUT_DRAFT_KEY_PREFIX}:${normalizedUserId}`;
}

function normalizeDraftEmotionEntry(entry) {
  const type = String(entry?.type || "").trim();
  const strength = VALID_STRENGTHS.has(entry?.strength)
    ? entry.strength
    : "medium";
  if (!type) return null;
  return { type, strength };
}

function normalizeDraftStringArray(values) {
  if (!Array.isArray(values)) return [];

  const seen = new Set();
  const nextValues = [];

  for (const value of values) {
    const normalized = String(value || "").trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    nextValues.push(normalized);
  }

  return nextValues;
}

function normalizeInputDraftData(data = {}) {
  const selectedEmotions = Array.isArray(data?.selectedEmotions)
    ? data.selectedEmotions
        .map((entry) => normalizeDraftEmotionEntry(entry))
        .filter(Boolean)
    : [];

  return {
    selectedEmotions,
    memo: String(data?.memo || ""),
    memoAction: String(data?.memoAction || ""),
    selectedCategories: normalizeDraftStringArray(data?.selectedCategories),
    // 新Reflection仕様ではシークレットメモUIを表導線から外す。
    // 旧下書きに isSecret が残っていても、新UIでは常に false として扱う。
    isSecret: false,
    sendFriendNotification: data?.sendFriendNotification !== false,
  };
}

function hasInputDraftContent(data = {}) {
  const normalized = normalizeInputDraftData(data);
  return (
    normalized.selectedEmotions.length > 0 ||
    normalized.memo.trim().length > 0 ||
    normalized.memoAction.trim().length > 0 ||
    normalized.selectedCategories.length > 0
  );
}

function isInputDraftExpired(savedAt, nowMs = Date.now()) {
  const savedAtMs = new Date(savedAt).getTime();
  if (!Number.isFinite(savedAtMs)) return true;
  return nowMs - savedAtMs > INPUT_DRAFT_TTL_MS;
}

async function clearInputDraft(userId) {
  const storageKey = buildInputDraftStorageKey(userId);
  if (!storageKey) return;
  await AsyncStorage.removeItem(storageKey);
}

async function saveInputDraft(userId, data = {}) {
  const storageKey = buildInputDraftStorageKey(userId);
  const normalizedUserId = normalizeDraftUserId(userId);
  if (!storageKey || !normalizedUserId) return null;

  const normalizedData = normalizeInputDraftData(data);
  if (!hasInputDraftContent(normalizedData)) {
    await clearInputDraft(normalizedUserId);
    return null;
  }

  const payload = {
    version: INPUT_DRAFT_STORAGE_VERSION,
    userId: normalizedUserId,
    savedAt: new Date().toISOString(),
    data: normalizedData,
  };

  await AsyncStorage.setItem(storageKey, JSON.stringify(payload));
  return payload;
}

async function loadInputDraft(userId) {
  const storageKey = buildInputDraftStorageKey(userId);
  const normalizedUserId = normalizeDraftUserId(userId);
  if (!storageKey || !normalizedUserId) return null;

  const raw = await AsyncStorage.getItem(storageKey);
  if (!raw) return null;

  let parsed = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    await clearInputDraft(normalizedUserId);
    return null;
  }

  const normalizedData = normalizeInputDraftData(parsed?.data || {});
  const savedAt = parsed?.savedAt || null;

  if (
    parsed?.version !== INPUT_DRAFT_STORAGE_VERSION ||
    String(parsed?.userId || "").trim() !== normalizedUserId ||
    !savedAt ||
    isInputDraftExpired(savedAt) ||
    !hasInputDraftContent(normalizedData)
  ) {
    await clearInputDraft(normalizedUserId);
    return null;
  }

  return {
    version: INPUT_DRAFT_STORAGE_VERSION,
    userId: normalizedUserId,
    savedAt,
    data: normalizedData,
  };
}

// MashOS Emotion Submit API
// ※ 現在は MashOS を Render 上で稼働させているため、
//   開発ビルド / 本番ビルドを問わず同じクラウド URL を利用する。
//   （ローカル API に戻したい場合はここを書き換える）


// パネル高さ（他画面と同じルールで調整可能）
const PANEL_MIN_HEIGHT = 690;

// 強度→数値（分析用）。UIには使わない
const STRENGTH_SCORE = Object.freeze({ weak: 1, medium: 2, strong: 3 });

const SELF_INSIGHT = "自己理解";


function formatDraftSavedAt(savedAt) {
  const savedAtMs = new Date(savedAt).getTime();
  if (!Number.isFinite(savedAtMs)) return "";

  try {
    return new Date(savedAtMs).toLocaleString("ja-JP", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

// 感情ボタンの配置（2段構成：下段右は空き）
const EMOTION_ROWS = [
  ["喜び", "悲しみ", "怒り"],
  ["不安", "平穏", SELF_INSIGHT],
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
const TUTORIAL_TOTAL_STEPS = 21;


function getEmotionIconName(type) {
  if (type === SELF_INSIGHT) return "bulb-outline";
  if (type === "喜び") return "happy-outline";
  if (type === "悲しみ") return "sad-outline";
  if (type === "怒り") return "flash-outline";
  if (type === "不安") return "alert-circle-outline";
  return "leaf-outline";
}


/**
 * Home（InputScreen）
 * - 背景・パネル・ボタンなどを ThemeContext から取得
 */
export default function InputScreen({ navigation }) {
  const { colors, themeName } = useTheme();
  const { setUnread } = useUnread();
  const { session } = useAuth();
  const {
    isTutorialMode,
    tutorialFlagsLoaded,
    tutorialCompleted,
    tutorialSkipped,
    tutorialStep,
    addTutorialEmotion,
    addTutorialFriendFeedItem: addTutorialEmotionLogFeedItem,
    setTutorialStep,
    startTutorial,
    skipTutorial,
  } = useTutorial();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const currentUserId = String(session?.user?.id || "").trim();

  const isIOS = Platform.OS === "ios";

  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [memo, setMemo] = useState("");
  const [memoAction, setMemoAction] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const memoInputRef = useRef(null);
  const memoActionInputRef = useRef(null);
  const [memoContentHeight, setMemoContentHeight] = useState(44);
  const [memoActionContentHeight, setMemoActionContentHeight] = useState(44);

  const [isSecret, setIsSecret] = useState(false);
  const [sendFriendNotification, setSendFriendNotification] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reflectionPreviewVisible, setReflectionPreviewVisible] = useState(false);
  const [reflectionPreviewLoading, setReflectionPreviewLoading] = useState(false);
  const [reflectionPublishLoading, setReflectionPublishLoading] = useState(false);
  const [reflectionPreviewPayload, setReflectionPreviewPayload] = useState(null);
  const [keyboardInset, setKeyboardInset] = useState(0);

// --- Lightweight toast / input feedback modal ---
const toastTimerRef = useRef(null);
const tutorialEmotionLogNotifyTimerRef = useRef(null);
const [toastMessage, setToastMessage] = useState(null);
const [inputFeedbackModalVisible, setInputFeedbackModalVisible] = useState(false);
const [inputFeedbackModalText, setInputFeedbackModalText] = useState("");
const [inputFeedbackModalDominantLabel, setInputFeedbackModalDominantLabel] = useState("");
const draftSaveTimerRef = useRef(null);
const draftLoadRequestIdRef = useRef(0);
const latestInputDraftDataRef = useRef(null);
const [pendingInputDraft, setPendingInputDraft] = useState(null);
const [draftRestoreModalVisible, setDraftRestoreModalVisible] = useState(false);
const [draftBootstrapComplete, setDraftBootstrapComplete] = useState(false);

const openInputFeedbackModal = useCallback(({ commentText, dominantLabel = "" }) => {
  const nextCommentText = String(commentText || "").trim();
  if (!nextCommentText) return;
  setInputFeedbackModalText(nextCommentText);
  setInputFeedbackModalDominantLabel(String(dominantLabel || "").trim());
  setInputFeedbackModalVisible(true);
}, []);

const closeInputFeedbackModal = useCallback(() => {
  setInputFeedbackModalVisible(false);
}, []);

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
      if (tutorialEmotionLogNotifyTimerRef.current) {
        clearTimeout(tutorialEmotionLogNotifyTimerRef.current);
      }
    } catch {
      // noop
    }
    try {
      if (draftSaveTimerRef.current) {
        clearTimeout(draftSaveTimerRef.current);
      }
    } catch {
      // noop
    }
  };
}, []);

const [isTodayQuestionExpanded, setIsTodayQuestionExpanded] = useState(false);
const [tutorialPromptDismissedThisSession, setTutorialPromptDismissedThisSession] =
  useState(false);

useEffect(() => {
  setTutorialPromptDismissedThisSession(false);
}, [currentUserId]);

const buildTutorialStartupCandidate = useCallback(() => {
  if (!currentUserId) return null;
  if (!tutorialFlagsLoaded) return null;
  if (isTutorialMode) return null;
  if (tutorialCompleted || tutorialSkipped) return null;
  if (tutorialPromptDismissedThisSession) return null;
  return { kind: STARTUP_POPUP_KIND.TUTORIAL };
}, [
  currentUserId,
  isTutorialMode,
  tutorialCompleted,
  tutorialFlagsLoaded,
  tutorialPromptDismissedThisSession,
  tutorialSkipped,
]);

const {
  activeStartupPopup,
  advanceStartupPopupQueue,
  closeStartupPopupWindow,
  globalEmotionUsers,
  isNoticeStartupPopupVisible,
  isTodayQuestionStartupPopupVisible,
  isTutorialStartupPopupVisible,
  loadHomeState,
  noticeFeatureEnabled,
  noticeLoading,
  noticePopup,
  noticeUnreadCount,
  reflectionQuota,
  registerInputInteraction,
  rememberDismissedNotice,
  rememberDismissedTodayQuestionDay,
  setNoticePopup,
  setNoticeUnreadCount,
  setReflectionQuota,
  startupModalVisible,
  startupQueuePreparing,
  todayQuestionBundle,
  todayQuestionLoading,
} = useHomeState({
  currentUserId,
  isTutorialMode,
  tutorialFlagsLoaded,
  navigation,
  buildTutorialStartupCandidate,
});

const {
  todayQuestionSubmitting,
  handleSubmitTodayQuestion,
  markCurrentNoticePopupSeen,
  markCurrentNoticeRead,
} = useHomeActions({
  noticePopup,
  todayQuestionBundle,
  activeStartupPopupKind: activeStartupPopup?.kind,
  loadHomeState,
  advanceStartupPopupQueue,
  rememberDismissedNotice,
  rememberDismissedTodayQuestionDay,
  setNoticeUnreadCount,
  setNoticePopup,
  showToast,
});

useEffect(() => {
  setIsTodayQuestionExpanded(false);
}, [todayQuestionBundle?.service_day_key, todayQuestionBundle?.question?.question_id]);

const isWelcomeNoticeStartupPopup = useMemo(
  () => isWelcomeNoticePopupCandidate(noticePopup),
  [noticePopup],
);
const isTodayQuestionAnswered = todayQuestionBundle?.answer_status === "answered";
const todayQuestionStatusLabel = isTodayQuestionAnswered ? "回答済み" : "未回答";

const handleDismissTodayQuestionModal = useCallback(() => {
  const serviceDayKey = String(todayQuestionBundle?.service_day_key || "");
  if (serviceDayKey) {
    rememberDismissedTodayQuestionDay(serviceDayKey);
  }
  advanceStartupPopupQueue();
}, [advanceStartupPopupQueue, rememberDismissedTodayQuestionDay, todayQuestionBundle?.service_day_key]);

const handleOpenEmotionHistory = useCallback(() => {
  closeStartupPopupWindow();

  try {
    navigation?.navigate?.("InputHistory");
    return;
  } catch {
    // noop
  }

  try {
    const parent = typeof navigation?.getParent === "function" ? navigation.getParent() : null;
    if (parent && typeof parent.navigate === "function") {
      parent.navigate("Input", {
        screen: "InputHistory",
      });
      return;
    }
  } catch {
    // noop
  }
}, [closeStartupPopupWindow, navigation]);

const handleOpenTodayQuestionHistory = useCallback(() => {
  if (activeStartupPopup?.kind === STARTUP_POPUP_KIND.TODAY_QUESTION) {
    closeStartupPopupWindow();
  }

  try {
    navigation?.navigate?.("TodayQuestionHistory");
    return;
  } catch {
    // noop
  }

  try {
    const parent = typeof navigation?.getParent === "function" ? navigation.getParent() : null;
    if (parent && typeof parent.navigate === "function") {
      parent.navigate("Input", {
        screen: "TodayQuestionHistory",
      });
      return;
    }
  } catch {
    // noop
  }

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
}, [activeStartupPopup?.kind, closeStartupPopupWindow, navigation]);

const handleDismissTutorialStartModal = useCallback(() => {
  setTutorialPromptDismissedThisSession(true);
  advanceStartupPopupQueue();
}, [advanceStartupPopupQueue]);

const handleSkipTutorialPermanently = useCallback(async () => {
  setTutorialPromptDismissedThisSession(true);
  advanceStartupPopupQueue();
  try {
    await skipTutorial();
  } catch (e) {
    console.warn("InputScreen: skipTutorial failed", e);
  }
}, [advanceStartupPopupQueue, skipTutorial]);

const handleStartTutorialFromModal = useCallback(() => {
  setTutorialPromptDismissedThisSession(true);
  closeStartupPopupWindow();
  startTutorial();
  setTutorialStep(INPUT_TUTORIAL_STEP_START);
}, [closeStartupPopupWindow, setTutorialStep, startTutorial]);

const { height: windowHeight } = useWindowDimensions();
  const safeInsets = useSafeAreaInsets();

  const screenRootRef = useRef(null);
  const heroCardRef = useRef(null);
  const thoughtInputRef = useRef(null);
  const actionInputRef = useRef(null);
  const emotionAreaRef = useRef(null);
  const categorySectionRef = useRef(null);
  const okButtonRef = useRef(null);
  const strengthRowRefs = useRef({});
  const currentScrollYRef = useRef(0);
  const [tutorialTargetRect, setTutorialTargetRect] = useState(null);
  const [tutorialOverlayMetrics, setTutorialOverlayMetrics] = useState(null);
  const [heroCardHeaderY, setHeroCardHeaderY] = useState(null);
  const [heroRailInlineOffsetY, setHeroRailInlineOffsetY] = useState(null);
  const [compactRailVisible, setCompactRailVisible] = useState(false);

  const isInputTutorialStep =
    isTutorialMode &&
    tutorialStep >= INPUT_TUTORIAL_STEP_START &&
    tutorialStep <= INPUT_TUTORIAL_STEP_END;
  const shouldHideTodayQuestionForTutorial = isTutorialMode;
  const compactRailTop = Math.max(8, safeInsets.top + 4);

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

  const inputDraftData = useMemo(
    () =>
      normalizeInputDraftData({
        selectedEmotions,
        memo,
        memoAction,
        selectedCategories,
        isSecret,
        sendFriendNotification,
      }),
    [
      isSecret,
      memo,
      memoAction,
      selectedCategories,
      selectedEmotions,
      sendFriendNotification,
    ]
  );

  latestInputDraftDataRef.current = inputDraftData;

  const hasCurrentDraftContent = useMemo(
    () => hasInputDraftContent(inputDraftData),
    [inputDraftData]
  );

  const shouldShowDraftRestorePrompt = useMemo(() => {
    if (!pendingInputDraft) return false;
    if (isTutorialMode) return false;
    if (startupQueuePreparing || startupModalVisible) return false;
    if (noticeLoading || todayQuestionLoading) return false;
    if (inputFeedbackModalVisible) return false;
    if (hasCurrentDraftContent) return false;
    return true;
  }, [
    hasCurrentDraftContent,
    inputFeedbackModalVisible,
    isTutorialMode,
    noticeLoading,
    pendingInputDraft,
    startupModalVisible,
    startupQueuePreparing,
    todayQuestionLoading,
  ]);

  const draftPersistenceBlocked =
    !draftBootstrapComplete ||
    !currentUserId ||
    isTutorialMode ||
    !!pendingInputDraft ||
    draftRestoreModalVisible;

  const clearPersistedInputDraft = useCallback(async () => {
    if (!currentUserId) return;
    try {
      await clearInputDraft(currentUserId);
    } catch (e) {
      console.warn("InputScreen: clearInputDraft failed", e);
    }
  }, [currentUserId]);

  const persistCurrentInputDraft = useCallback(async () => {
    if (!currentUserId || isTutorialMode) return;

    const nextDraftData = normalizeInputDraftData(
      latestInputDraftDataRef.current || {}
    );

    try {
      if (hasInputDraftContent(nextDraftData)) {
        await saveInputDraft(currentUserId, nextDraftData);
      } else {
        await clearInputDraft(currentUserId);
      }
    } catch (e) {
      console.warn("InputScreen: persistCurrentInputDraft failed", e);
    }
  }, [currentUserId, isTutorialMode]);

  const restorePendingInputDraft = useCallback(() => {
    const restored = normalizeInputDraftData(pendingInputDraft?.data || {});
    setSelectedEmotions(restored.selectedEmotions);
    setMemo(restored.memo);
    setMemoAction(restored.memoAction);
    setSelectedCategories(restored.selectedCategories);
    setIsSecret(false);
    setSendFriendNotification(restored.sendFriendNotification);
    setMemoContentHeight(44);
    setMemoActionContentHeight(44);
    Keyboard.dismiss();
    setDraftRestoreModalVisible(false);
    setPendingInputDraft(null);
    showToast("前回の内容を復元しました");
  }, [pendingInputDraft, showToast]);

  const discardPendingInputDraft = useCallback(async () => {
    setDraftRestoreModalVisible(false);
    setPendingInputDraft(null);
    await clearPersistedInputDraft();
  }, [clearPersistedInputDraft]);

  const draftRestoreSavedAtLabel = useMemo(
    () => formatDraftSavedAt(pendingInputDraft?.savedAt),
    [pendingInputDraft?.savedAt]
  );

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

  useEffect(() => {
    let cancelled = false;
    const requestId = draftLoadRequestIdRef.current + 1;
    draftLoadRequestIdRef.current = requestId;

    if (!currentUserId || isTutorialMode) {
      setPendingInputDraft(null);
      setDraftRestoreModalVisible(false);
      setDraftBootstrapComplete(true);
      return () => {
        cancelled = true;
      };
    }

    setDraftBootstrapComplete(false);

    const run = async () => {
      try {
        const restored = await loadInputDraft(currentUserId);
        if (cancelled || draftLoadRequestIdRef.current !== requestId) return;

        if (restored && !hasInputDraftContent(latestInputDraftDataRef.current)) {
          setPendingInputDraft(restored);
        } else {
          setPendingInputDraft(null);
          setDraftRestoreModalVisible(false);
        }
      } catch (e) {
        if (!cancelled) {
          console.warn("InputScreen: loadInputDraft failed", e);
          setPendingInputDraft(null);
          setDraftRestoreModalVisible(false);
        }
      } finally {
        if (!cancelled && draftLoadRequestIdRef.current === requestId) {
          setDraftBootstrapComplete(true);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [currentUserId, isTutorialMode]);

  useEffect(() => {
    setDraftRestoreModalVisible(shouldShowDraftRestorePrompt);
  }, [shouldShowDraftRestorePrompt]);

  useEffect(() => {
    if (!pendingInputDraft) return;
    if (!hasCurrentDraftContent) return;
    setPendingInputDraft(null);
    setDraftRestoreModalVisible(false);
  }, [hasCurrentDraftContent, pendingInputDraft]);

  useEffect(() => {
    try {
      if (draftSaveTimerRef.current) {
        clearTimeout(draftSaveTimerRef.current);
        draftSaveTimerRef.current = null;
      }
    } catch {
      // noop
    }

    if (draftPersistenceBlocked) return;

    draftSaveTimerRef.current = setTimeout(() => {
      draftSaveTimerRef.current = null;
      void persistCurrentInputDraft();
    }, 1000);

    return () => {
      try {
        if (draftSaveTimerRef.current) {
          clearTimeout(draftSaveTimerRef.current);
          draftSaveTimerRef.current = null;
        }
      } catch {
        // noop
      }
    };
  }, [
    draftPersistenceBlocked,
    persistCurrentInputDraft,
    inputDraftData,
  ]);

  useEffect(() => {
    if (draftPersistenceBlocked) return;

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (/inactive|background/.test(String(nextAppState || ""))) {
        void persistCurrentInputDraft();
      }
    });

    return () => {
      try {
        subscription?.remove?.();
      } catch {
        // noop
      }
    };
  }, [draftPersistenceBlocked, persistCurrentInputDraft]);

  useEffect(() => {
    if (draftPersistenceBlocked) return;

    let unsubscribe = null;
    try {
      unsubscribe = navigation?.addListener?.("blur", () => {
        void persistCurrentInputDraft();
      });
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
  }, [draftPersistenceBlocked, navigation, persistCurrentInputDraft]);

  const doNotSendEmotionNotification = !sendFriendNotification;
  const isDark = themeName === "dark";

  const memoText = memo.trim();
  const memoActionText = memoAction.trim();
  const thoughtLength = memoText.length;
  const actionLength = memoActionText.length;

  const isSelfInsightSelected = selectedEmotions.some(
    (e) => e.type === SELF_INSIGHT
  );
  const hasThought = thoughtLength > 0;
  const hasAction = actionLength > 0;
  const hasMemoInput = hasThought || hasAction;
  const hasEmotion = selectedEmotions.length > 0;
  const hasSelectedCategories = selectedCategories.length > 0;
  const canOpenEmotionStep = hasThought && hasAction;
  const canOpenCategoryStep = canOpenEmotionStep && hasEmotion;
  const hasCategoryProgress = canOpenCategoryStep && hasSelectedCategories;
  const isHeroReady = hasCategoryProgress;
  const heroStage = isHeroReady
    ? "ready"
    : hasEmotion
      ? "emotionSelected"
      : canOpenEmotionStep
        ? "memoDual"
        : hasMemoInput
          ? "memoStarted"
          : "blank";
  const canSubmit = !submitting && isHeroReady;
  const canPreviewReflection =
    !isTutorialMode &&
    !reflectionPreviewLoading &&
    !reflectionPublishLoading &&
    isHeroReady;

  const heroRailItems = useMemo(() => ([
    { key: "thought", label: "思考", active: hasThought },
    { key: "action", label: "行動", active: hasAction },
    { key: "emotion", label: "感情", active: hasEmotion },
    { key: "category", label: "カテゴリ", active: hasCategoryProgress },
    { key: "ready", label: "Ready?", active: isHeroReady, ready: true },
  ]), [hasThought, hasAction, hasEmotion, hasCategoryProgress, isHeroReady]);

  const updateCompactRailVisibility = useCallback((scrollY = currentScrollYRef.current) => {
    const headerY = Number(heroCardHeaderY);
    const inlineOffsetY = Number(heroRailInlineOffsetY);
    const anchorY =
      Number.isFinite(headerY) && Number.isFinite(inlineOffsetY)
        ? headerY + inlineOffsetY
        : 0;
    const shouldShow = anchorY > 0 && scrollY >= Math.max(0, anchorY - compactRailTop);
    setCompactRailVisible((prev) => (prev === shouldShow ? prev : shouldShow));
  }, [heroCardHeaderY, heroRailInlineOffsetY, compactRailTop]);

  const hasUserStartedInput =
    selectedEmotions.length > 0 ||
    thoughtLength > 0 ||
    actionLength > 0 ||
    selectedCategories.length > 0 ||
    sendFriendNotification === false;

  useEffect(() => {
    if (!hasUserStartedInput) return;
    registerInputInteraction();
  }, [hasUserStartedInput, registerInputInteraction]);

  useEffect(() => {
    updateCompactRailVisibility(currentScrollYRef.current);
  }, [updateCompactRailVisibility]);

  const getTutorialTargetRef = useCallback(() => {
    if (!isInputTutorialStep) return null;

    switch (tutorialStep) {
      case 1:
      case 2:
        return heroCardRef;
      case 3:
      case 4:
        return emotionAreaRef;
      case 5:
        return categorySectionRef;
      case 6:
        return okButtonRef;
      default:
        return null;
    }
  }, [isInputTutorialStep, tutorialStep]);

  const tutorialOverlayConfig = useMemo(() => {
    if (!isInputTutorialStep) return null;

    switch (tutorialStep) {
      case 1:
        return {
          step: 1,
          mode: "info",
          title: "メモから始めます",
          message:
            "まずは思考内容と行動内容を書きます。\n\n感情入力カードがHomeの中心です。",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(2),
        };
      case 2:
        return {
          step: 2,
          mode: "action",
          title: "書いてみましょう",
          message: "思考内容と行動内容をどちらも入力してみましょう。",
          actionHint: "2つのメモ欄を入力してください",
        };
      case 3:
        return {
          step: 3,
          mode: "info",
          title: "次に感情を選びます",
          message:
            "メモを書いたあと、その入力に近い感情を選びます。",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(4),
        };
      case 4:
        return {
          step: 4,
          mode: "action",
          title: "感情を選びましょう",
          message: "いまの入力に近い感情を1つ以上選んでください。",
          actionHint: "感情ボタンを押してください",
        };
      case 5:
        return {
          step: 5,
          mode: "action",
          title: "カテゴリを選びましょう",
          message: "最後にカテゴリを1つ以上選ぶと Ready? が点灯します。",
          actionHint: "カテゴリを選択してください",
        };
      case 6:
        return {
          step: 6,
          mode: "action",
          title: "送信してみましょう",
          message: "Ready? が点いたら、この内容で送信できます。",
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
      startupQueuePreparing ||
      startupModalVisible ||
      !!todayQuestionBundle?.question ||
      todayQuestionLoading ||
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
    startupModalVisible,
    startupQueuePreparing,
    !!todayQuestionBundle?.question,
    todayQuestionLoading,
    noticeLoading,
    setTutorialStep,
  ]);



  useEffect(() => {
    if (!isTutorialMode) return;
    if (tutorialStep !== 2) return;
    if (!canOpenEmotionStep) return;
    const frame = requestAnimationFrame(() => {
      setTutorialStep(3);
    });
    return () => {
      try {
        cancelAnimationFrame(frame);
      } catch {
        // noop
      }
    };
  }, [canOpenEmotionStep, isTutorialMode, tutorialStep, setTutorialStep]);

  useEffect(() => {
    if (!isTutorialMode) return;
    if (tutorialStep !== 4) return;
    if (!hasEmotion) return;
    const frame = requestAnimationFrame(() => {
      setTutorialStep(5);
    });
    return () => {
      try {
        cancelAnimationFrame(frame);
      } catch {
        // noop
      }
    };
  }, [hasEmotion, isTutorialMode, tutorialStep, setTutorialStep]);

  useEffect(() => {
    if (!isTutorialMode) return;
    if (tutorialStep !== 5) return;
    if (!hasCategoryProgress) return;
    const frame = requestAnimationFrame(() => {
      setTutorialStep(6);
    });
    return () => {
      try {
        cancelAnimationFrame(frame);
      } catch {
        // noop
      }
    };
  }, [hasCategoryProgress, isTutorialMode, tutorialStep, setTutorialStep]);

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
    startupModalVisible,
    startupQueuePreparing,
    selectedEmotions,
    selectedCategories,
    memo,
    memoAction,
    keyboardInset,
    shouldHideTodayQuestionForTutorial,
    !!todayQuestionBundle?.question,
    todayQuestionLoading,
    noticeLoading,
    tutorialOverlayMetrics,
    syncTutorialTargetRect,
  ]);

  useEffect(() => {
    if (!hasMemoInput && selectedCategories.length > 0) {
      setSelectedCategories([]);
    }
  }, [hasMemoInput, selectedCategories.length]);

  const toggleEmotion = (cat) => {
    if (!canOpenEmotionStep) return;
    registerInputInteraction();
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

      return next;
    });
  };

  const changeStrength = (cat, s) => {
    registerInputInteraction();
    setSelectedEmotions((prev) =>
      prev.map((e) => (e.type === cat ? { ...e, strength: s } : e))
    );
  };

  const toggleCategory = (category) => {
    registerInputInteraction();
    if (!canOpenCategoryStep) return;
    const nextCategory = String(category || "").trim();
    if (!nextCategory) return;
    setSelectedCategories((prev) => {
      const exists = prev.includes(nextCategory);
      return exists
        ? prev.filter((item) => item !== nextCategory)
        : [...prev, nextCategory];
    });
  };

  const buildEmotionSubmitPayload = useCallback(() => {
    const emotionDetails = selectedEmotions.map((e) => ({
      type: e.type,
      strength: e.strength,
    }));

    const payload = {
      emotions: emotionDetails,
      memo,
      created_at: new Date().toISOString(),
      is_secret: false,
      notify_friends: sendFriendNotification,
    };

    if (hasMemoInput && selectedCategories.length > 0) {
      payload.category = selectedCategories;
    }

    if (memoAction && memoAction.trim().length > 0) {
      payload.memo_action = memoAction;
    }

    return payload;
  }, [
    hasMemoInput,
    memo,
    memoAction,
    selectedCategories,
    selectedEmotions,
    sendFriendNotification,
  ]);


  const handlePreviewReflection = useCallback(async () => {
    if (!canPreviewReflection) return;

    registerInputInteraction();
    setReflectionPreviewLoading(true);
    try {
      const payload = buildEmotionSubmitPayload();
      const preview = await previewEmotionReflection(payload);
      const quota = preview?.quota && typeof preview.quota === "object"
        ? preview.quota
        : null;
      if (quota) {
        setReflectionQuota(quota);
      }
      setReflectionPreviewPayload(preview && typeof preview === "object" ? preview : null);
      setReflectionPreviewVisible(true);
    } catch (e) {
      console.warn("InputScreen: previewEmotionReflection failed", e);
      Alert.alert(
        "Pieceの生成",
        String(e?.message || "Pieceの生成に失敗しました。")
      );
    } finally {
      setReflectionPreviewLoading(false);
    }
  }, [buildEmotionSubmitPayload, canPreviewReflection, registerInputInteraction]);

  const handleCancelReflectionPreview = useCallback(async () => {
    const previewId = String(reflectionPreviewPayload?.preview_id || "").trim();
    setReflectionPreviewVisible(false);
    if (!previewId) {
      setReflectionPreviewPayload(null);
      return;
    }
    try {
      await cancelEmotionReflection(previewId);
    } catch (e) {
      console.warn("InputScreen: cancelEmotionReflection failed", e);
    } finally {
      setReflectionPreviewPayload(null);
    }
  }, [reflectionPreviewPayload?.preview_id]);

  const handlePublishReflection = useCallback(async () => {
    const previewId = String(reflectionPreviewPayload?.preview_id || "").trim();
    if (!previewId || reflectionPublishLoading) return;

    setReflectionPublishLoading(true);
    try {
      const publishResult = await publishEmotionReflection(previewId);
      const inputFeedbackText = String(
        publishResult?.input_feedback?.comment_text || ""
      ).trim();

      await clearPersistedInputDraft();
      setPendingInputDraft(null);
      setDraftRestoreModalVisible(false);

      setSelectedEmotions([]);
      setMemo("");
      setMemoAction("");
      setSelectedCategories([]);
      setMemoContentHeight(44);
      setMemoActionContentHeight(44);
      setIsSecret(false);
      Keyboard.dismiss();

      setReflectionPreviewVisible(false);
      setReflectionPreviewPayload(null);

      const nextQuota = publishResult?.quota && typeof publishResult.quota === "object"
        ? publishResult.quota
        : null;
      if (nextQuota) {
        setReflectionQuota(nextQuota);
      }

      await loadHomeState({ force: true, includeStartupCandidate: false });

      if (inputFeedbackText) {
        openInputFeedbackModal({
          commentText: inputFeedbackText,
          dominantLabel: "Pieceを作成しました",
        });
      } else {
        showToast("Pieceを作成しました");
      }
    } catch (e) {
      console.warn("InputScreen: publishEmotionReflection failed", e);
      Alert.alert(
        "Pieceの作成",
        String(e?.message || "Pieceの作成に失敗しました。")
      );
    } finally {
      setReflectionPublishLoading(false);
    }
  }, [
    clearPersistedInputDraft,
    loadHomeState,
    openInputFeedbackModal,
    reflectionPreviewPayload?.preview_id,
    reflectionPublishLoading,
    showToast,
  ]);

  const handleOk = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      // 1) 入力内容を MashOS Emotion Submit API 用のペイロードに変換
      const payload = buildEmotionSubmitPayload();
      const emotionDetails = Array.isArray(payload?.emotions) ? payload.emotions : [];

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
        setMemoContentHeight(44);
        setMemoActionContentHeight(44);
        setIsSecret(false);
        Keyboard.dismiss();

        showToast(`チュートリアルに記録しました
主感情：${dominantType}${dominantSuffix}`);

        if (sendFriendNotification) {
          try {
            if (tutorialEmotionLogNotifyTimerRef.current) {
              clearTimeout(tutorialEmotionLogNotifyTimerRef.current);
            }
          } catch {
            // noop
          }

          tutorialEmotionLogNotifyTimerRef.current = setTimeout(() => {
            const tutorialUserName = "（仮のユーザー名）";
            const feedCreatedAt = new Date().toISOString();
            const feedTimeLabel = new Date(feedCreatedAt).toLocaleString("ja-JP", {
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            try {
              addTutorialEmotionLogFeedItem({
                id: `tutorial-emotion-log-feed-${Date.now()}`,
                ownerName: tutorialUserName,
                owner_name: tutorialUserName,
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
              setUnread("EmotionLog", "feed", true);
            } catch {
              // noop
            }

            tutorialEmotionLogNotifyTimerRef.current = null;
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

      const submitResult = await submitEmotionInput(payload);
      const inputFeedbackText = String(
        submitResult?.input_feedback?.comment_text ||
          submitResult?.inputFeedback?.commentText ||
          ""
      ).trim();

      await clearPersistedInputDraft();
      setPendingInputDraft(null);
      setDraftRestoreModalVisible(false);

      // 送信が成功したら、入力状態をリセットし、表示用データを更新する
      setSelectedEmotions([]);
      setMemo("");
      setMemoAction("");
      setSelectedCategories([]);
      setMemoContentHeight(44);
      setMemoActionContentHeight(44);
      setIsSecret(false);
      Keyboard.dismiss();

      await loadHomeState({ force: true, includeStartupCandidate: false });

      if (inputFeedbackText) {
        openInputFeedbackModal({
          commentText: inputFeedbackText,
          dominantLabel: `主感情：${dominantType}${dominantSuffix}`,
        });
      } else {
        showToast(`記録しました
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
    closeStartupPopupWindow();
    await markCurrentNoticePopupSeen();
    try {
      navigation?.navigate?.("NoticeHistory", {
        open_notice_id: openNoticeId,
        open_notice_at: Date.now(),
      });
    } catch {
      // noop
    }
  }, [
    closeStartupPopupWindow,
    markCurrentNoticePopupSeen,
    navigation,
    noticePopup?.notice_id,
  ]);

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

  const handlePressNoticeAction = useCallback(async (action) => {
    if (!action) return;

    closeStartupPopupWindow();
    await markCurrentNoticePopupSeen();
    await markCurrentNoticeRead();

    try {
      await openNoticeAction(action, { openInternalRoute: openNoticeInternalRoute });
    } catch (e) {
      Alert.alert("お知らせ", String(e?.message || "リンクを開けませんでした。"));
    }
  }, [
    closeStartupPopupWindow,
    markCurrentNoticePopupSeen,
    markCurrentNoticeRead,
    openNoticeInternalRoute,
  ]);

  const handleDismissNoticeModal = useCallback(async () => {
    advanceStartupPopupQueue();
    await markCurrentNoticePopupSeen();
  }, [advanceStartupPopupQueue, markCurrentNoticePopupSeen]);

  const handlePrimaryNoticeModalAction = useCallback(async () => {
    advanceStartupPopupQueue();
    await markCurrentNoticePopupSeen();
    await markCurrentNoticeRead();
  }, [
    advanceStartupPopupQueue,
    markCurrentNoticePopupSeen,
    markCurrentNoticeRead,
  ]);

  const handlePressNotifications = useCallback(() => {
    closeStartupPopupWindow();
    try {
      navigation?.navigate?.("NoticeHistory", {
        open_notice_id: null,
        open_notice_at: Date.now(),
      });
    } catch {
      // noop
    }
  }, [closeStartupPopupWindow, navigation]);

  const handlePressGuide = () => {
    closeStartupPopupWindow();
    if (navigation && navigation.navigate) {
      navigation.navigate("CocolonGuide", { screenId: "home" });
    } else {
      Alert.alert("ガイド", "ガイド画面へのナビゲーションがまだ設定されていません。");
    }
  };

  const handlePressAccount = () => {
    closeStartupPopupWindow();
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
            showsVerticalScrollIndicator
            scrollEventThrottle={16}
            onScrollBeginDrag={registerInputInteraction}
            onScroll={(e) => {
              const nextScrollY =
                e?.nativeEvent?.contentOffset?.y ?? currentScrollYRef.current;
              currentScrollYRef.current = nextScrollY;
              updateCompactRailVisibility(nextScrollY);
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
                      <ScreenUnreadBadge
                        visible
                        style={styles.noticeBadgeDot}
                      />
                    ) : null}
                  </CocolonPressable>
                </View>
              </View>

              <View style={styles.todayStatusSection}>
                <Text style={styles.todayStatusTitle}>今日の状況</Text>

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

                {!shouldHideTodayQuestionForTutorial && todayQuestionBundle?.question ? (
                  <View style={styles.todayQuestionAccordionCard}>
                    <CocolonPressable
                      style={styles.todayQuestionAccordionHeader}
                      onPress={() => setIsTodayQuestionExpanded((prev) => !prev)}
                      accessibilityRole="button"
                      accessibilityLabel={`今日の問い ${todayQuestionStatusLabel}`}
                      accessibilityState={{ expanded: isTodayQuestionExpanded }}
                    >
                      <Text style={styles.todayQuestionAccordionTitle}>今日の問い</Text>
                      <View style={styles.todayQuestionAccordionHeaderRight}>
                        <Text
                          style={[
                            styles.todayQuestionAccordionStatus,
                            isTodayQuestionAnswered && styles.todayQuestionAccordionStatusAnswered,
                          ]}
                        >
                          {todayQuestionStatusLabel}
                        </Text>
                        {todayQuestionLoading ? (
                          <ActivityIndicator
                            size="small"
                            color={colors.TEXT_SUBTLE}
                            style={styles.todayQuestionAccordionSpinner}
                          />
                        ) : null}
                        <Ionicons
                          name={isTodayQuestionExpanded ? "chevron-up" : "chevron-down"}
                          size={18}
                          color={colors.TEXT_ON_LIGHT}
                        />
                      </View>
                    </CocolonPressable>

                    {isTodayQuestionExpanded ? (
                      <View style={styles.todayQuestionAccordionContent}>
                        <TodayQuestionCard
                          question={todayQuestionBundle?.question}
                          answerSummary={todayQuestionBundle?.answer_summary || null}
                          loading={todayQuestionLoading}
                          submitting={todayQuestionSubmitting}
                          compact
                          hideHeader
                          embedded
                          showHistoryButton
                          onSubmit={handleSubmitTodayQuestion}
                          onOpenHistory={handleOpenTodayQuestionHistory}
                        />
                      </View>
                    ) : null}
                  </View>
                ) : null}

                <View style={styles.inputHistoryQuickCard}>
                  <CocolonPressable
                    style={styles.inputHistoryQuickButton}
                    onPress={handleOpenEmotionHistory}
                    accessibilityLabel="入力履歴を開く"
                  >
                    <View style={styles.inputHistoryQuickLeft}>
                      <Ionicons
                        name="time-outline"
                        size={18}
                        color={colors.TEXT_SUBTLE}
                        style={styles.inputHistoryQuickIcon}
                      />
                      <Text style={styles.inputHistoryQuickTitle}>入力履歴</Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={colors.TEXT_SUBTLE}
                    />
                  </CocolonPressable>
                </View>
              </View>

              <View
                ref={heroCardRef}
                collapsable={false}
                onLayout={(e) => {
                  const nextY = e?.nativeEvent?.layout?.y;
                  if (Number.isFinite(nextY)) {
                    setHeroCardHeaderY(nextY);
                  }
                }}
                style={[
                  styles.heroCardHeader,
                  heroStage !== "blank" && styles.heroCardHeaderActive,
                  isHeroReady && styles.heroCardHeaderReady,
                ]}
              >
                <View style={styles.heroHeader}>
                  <Text style={styles.heroTitle}>今の気持ちを入力</Text>
                  <View
                    style={styles.heroRail}
                    onLayout={(e) => {
                      const nextY = e?.nativeEvent?.layout?.y;
                      if (Number.isFinite(nextY)) {
                        setHeroRailInlineOffsetY(nextY);
                      }
                    }}
                  >
                    {heroRailItems.map((item) => (
                      <View
                        key={item.key}
                        style={[
                          styles.heroRailChip,
                          item.active && styles.heroRailChipOn,
                          item.ready && styles.heroRailChipReady,
                          item.ready && item.active && styles.heroRailChipReadyOn,
                        ]}
                      >
                        <Text
                          style={[
                            styles.heroRailChipText,
                            item.active && styles.heroRailChipTextOn,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.heroCardBody,
                  heroStage !== "blank" && styles.heroCardActive,
                  isHeroReady && styles.heroCardReady,
                ]}
              >
                <View
                  ref={thoughtInputRef}
                  collapsable={false}
                  style={[styles.heroFieldCard, styles.heroFieldCardPrimary]}
                >
                  <View style={styles.heroFieldHeader}>
                    <Text style={styles.heroFieldTitle}>
                      思考内容（自己世界の出来事）
                    </Text>
                  </View>
                  <Text style={styles.heroFieldHint}>
                    何を思った／どう感じた／どう解釈した？
                  </Text>
                  <TextInput
                    ref={memoInputRef}
                    style={[
                      styles.memoInput,
                      styles.heroFieldInput,
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
                      registerInputInteraction();
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
                    }}
                    onContentSizeChange={(e) => {
                      const h = e?.nativeEvent?.contentSize?.height ?? 0;
                      if (h) setMemoContentHeight(h);
                      if (focusedFieldRef.current !== "memo") return;
                      requestAnimationFrame(() => scrollToFocusedInput());
                    }}
                  />
                </View>

                <View
                  ref={actionInputRef}
                  collapsable={false}
                  style={styles.heroFieldCard}
                >
                  <View style={styles.heroFieldHeader}>
                    <Text style={styles.heroFieldTitle}>
                      行動内容（実世界の出来事）
                    </Text>
                  </View>
                  <Text style={styles.heroFieldHint}>
                    何が起きた／何をした（できなかった）／結果どうなった？
                  </Text>
                  <TextInput
                    ref={memoActionInputRef}
                    style={[
                      styles.memoInput,
                      styles.heroFieldInput,
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
                      registerInputInteraction();
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
                    }}
                    onContentSizeChange={(e) => {
                      const h = e?.nativeEvent?.contentSize?.height ?? 0;
                      if (h) setMemoActionContentHeight(h);
                      if (focusedFieldRef.current !== "memoAction") return;
                      requestAnimationFrame(() => scrollToFocusedInput());
                    }}
                  />
                </View>

                <View
                  ref={emotionAreaRef}
                  collapsable={false}
                  style={[
                    styles.heroStepBlock,
                    !canOpenEmotionStep && styles.heroStepBlockLocked,
                  ]}
                >
                  <View style={styles.heroStepHeader}>
                    <Text style={styles.heroStepTitle}>感情を選択</Text>
                    <Text style={styles.heroStepHint}>
                      {canOpenEmotionStep
                        ? "いまの入力に近い感情を選びます。"
                        : "思考内容と行動内容の入力後に選択できます。"}
                    </Text>
                  </View>

                  <View style={styles.buttons}>
                    {EMOTION_ROWS.map((row, rowIndex) => (
                      <View key={`row-${rowIndex}`} style={styles.emotionRow}>
                        {row.map((cat) => {
                          const emotion = selectedEmotions.find((e) => e.type === cat);
                          const on = !!emotion;
                          const isSelfInsightChip = cat === SELF_INSIGHT;
                          const isDisabled =
                            !canOpenEmotionStep ||
                            (!isSelfInsightChip && isSelfInsightSelected);

                          return (
                            <View key={cat} style={styles.emotionBlock}>
                              <CocolonPressable
                                onPress={() => toggleEmotion(cat)}
                                disabled={isDisabled}
                                style={[
                                  styles.chip,
                                  on && styles.chipOn,
                                  isDisabled && styles.heroStepCardLocked,
                                ]}
                              >
                                <Ionicons
                                  name={getEmotionIconName(cat)}
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
                                {on && cat !== SELF_INSIGHT
                                  ? ["weak", "medium", "strong"].map((s) => (
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
                                    ))
                                  : null}
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    ))}
                  </View>
                </View>

                <View
                  ref={categorySectionRef}
                  collapsable={false}
                  style={[
                    styles.heroStepBlock,
                    !canOpenCategoryStep && styles.heroStepBlockLocked,
                  ]}
                >
                  <View style={styles.heroStepHeader}>
                    <Text style={styles.heroStepTitle}>このメモの内容カテゴリ</Text>
                    <Text style={styles.heroStepHint}>
                      {canOpenCategoryStep
                        ? "この出来事や思考に近いカテゴリを、1つ以上選んでください。"
                        : "感情を選択するとカテゴリを選択できます。"}
                    </Text>
                  </View>
                  <View style={styles.categoryGrid}>
                    {CATEGORY_OPTIONS.map((category) => {
                      const isActive = selectedCategories.includes(category);
                      const isDisabled = !canOpenCategoryStep;
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
                  {canOpenCategoryStep && !hasSelectedCategories ? (
                    <Text style={styles.categoryRequiredText}>
                      カテゴリを1つ以上選択すると Ready? が点灯します。
                    </Text>
                  ) : null}
                </View>

                <View
                  style={[
                    styles.heroFooter,
                    isHeroReady && styles.heroFooterReady,
                  ]}
                >
                  <View style={styles.heroReadyRow}>
                    <Text
                      style={[
                        styles.heroReadyText,
                        isHeroReady && styles.heroReadyTextOn,
                      ]}
                    >
                      Ready?
                    </Text>
                  </View>

                  <View style={styles.heroFooterSettingRow}>
                    <View style={styles.heroFooterSettingLeft}>
                      <Ionicons
                        name="notifications-outline"
                        size={18}
                        color={colors.TEXT_SUBTLE}
                        style={styles.heroFooterSettingIcon}
                      />
                      <View style={styles.heroFooterSettingTextWrap}>
                        <Text style={styles.heroFooterSettingTitle}>
                          感情通知を送らない
                        </Text>
                        <Text style={styles.heroFooterSettingDesc}>
                          オンにすると感情入力がフォロー中ユーザーに通知されません。
                        </Text>
                      </View>
                    </View>
                    <CocolonSwitch
                      value={doNotSendEmotionNotification}
                      onValueChange={(v) => {
                        registerInputInteraction();
                        setSendFriendNotification(!v);
                      }}
                      trackColor={{
                        false: "#D1D5DB",
                        true: colors.GOLD_BUTTON,
                      }}
                      thumbColor={
                        Platform.OS === "android"
                          ? doNotSendEmotionNotification
                            ? "#FFFFFF"
                            : "#F9FAFB"
                          : undefined
                      }
                      ios_backgroundColor="#D1D5DB"
                      accessibilityLabel="感情通知を送らない設定を切り替える"
                    />
                  </View>

                  {!isTutorialMode ? (
                    <View style={styles.heroActionWrap}>
                      <CocolonButton
                        variant="secondary"
                        onPress={handlePreviewReflection}
                        disabled={!canPreviewReflection}
                        loading={reflectionPreviewLoading}
                        accessibilityLabel="Pieceを作成する"
                      >
                        Pieceを作成する
                      </CocolonButton>
                    </View>
                  ) : null}

                  <View
                    ref={okButtonRef}
                    collapsable={false}
                    style={styles.heroActionWrap}
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
                </View>
              </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      {compactRailVisible ? (
        <View
          pointerEvents="none"
          style={[
            styles.compactRailOverlay,
            { top: compactRailTop },
          ]}
        >
          <View style={styles.compactRailInner}>
            <View style={styles.compactRailRow}>
              {heroRailItems.map((item) => (
                <View
                  key={`compact-${item.key}`}
                  style={[
                    styles.heroRailChip,
                    styles.compactRailChip,
                    item.active && styles.heroRailChipOn,
                    item.ready && styles.heroRailChipReady,
                    item.ready && item.active && styles.heroRailChipReadyOn,
                  ]}
                >
                  <Text
                    style={[
                      styles.heroRailChipText,
                      styles.compactRailChipText,
                      item.active && styles.heroRailChipTextOn,
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      ) : null}
<NoticeModal
  visible={!isTutorialMode && noticeFeatureEnabled && isNoticeStartupPopupVisible && !!noticePopup}
  notice={noticePopup}
  loading={noticeLoading}
  onClose={handleDismissNoticeModal}
  onOpenHistory={handleOpenNoticeHistory}
  onPressAction={handlePressNoticeAction}
  variant={isWelcomeNoticeStartupPopup ? "welcome" : "default"}
  showPublishedDate={!isWelcomeNoticeStartupPopup}
  showHistoryButton={!isWelcomeNoticeStartupPopup}
  primaryCloseLabel={isWelcomeNoticeStartupPopup ? "はじめる" : null}
  onPrimaryClose={
    isWelcomeNoticeStartupPopup ? handlePrimaryNoticeModalAction : undefined
  }
/>
<TutorialStartModal
  visible={!isTutorialMode && isTutorialStartupPopupVisible}
  onDismiss={handleDismissTutorialStartModal}
  onSkipPermanently={handleSkipTutorialPermanently}
  onStart={handleStartTutorialFromModal}
/>
<TodayQuestionModal
  visible={!shouldHideTodayQuestionForTutorial && isTodayQuestionStartupPopupVisible && !!todayQuestionBundle?.question && todayQuestionBundle?.answer_status !== "answered"}
  question={todayQuestionBundle?.question}
  answerSummary={todayQuestionBundle?.answer_summary || null}
  loading={todayQuestionLoading}
  submitting={todayQuestionSubmitting}
  onClose={handleDismissTodayQuestionModal}
  onSubmit={handleSubmitTodayQuestion}
  onOpenHistory={handleOpenTodayQuestionHistory}
/>

<Modal
  visible={draftRestoreModalVisible}
  transparent
  animationType="fade"
  onRequestClose={() => {}}
>
  <View style={styles.draftRestoreBackdrop}>
    <View style={styles.draftRestoreCard}>
      <View style={styles.draftRestoreBadgeRow}>
        <View style={styles.draftRestoreBadge}>
          <Ionicons
            name="save-outline"
            size={15}
            color={colors.TITLE_GOLD}
            style={styles.draftRestoreBadgeIcon}
          />
          <Text style={styles.draftRestoreBadgeText}>一時保存した入力</Text>
        </View>
      </View>

      <View style={styles.draftRestoreHeader}>
        <Text style={styles.draftRestoreTitle}>前回の続きから入力できます</Text>
        <Text style={styles.draftRestoreLeadText}>
          送信前の内容を、この端末に自動で一時保存しています。
        </Text>
      </View>

      <View style={styles.draftRestoreInfoCard}>
        <View style={styles.draftRestoreInfoRow}>
          <Ionicons
            name="time-outline"
            size={16}
            color={colors.TITLE_GOLD}
            style={styles.draftRestoreInfoIcon}
          />
          <Text style={styles.draftRestoreInfoText}>
            {draftRestoreSavedAtLabel
              ? `${draftRestoreSavedAtLabel} に保存 / 保存期間 ${INPUT_DRAFT_TTL_HOURS}時間`
              : `保存期間は ${INPUT_DRAFT_TTL_HOURS}時間です`}
          </Text>
        </View>

        <Text style={styles.draftRestoreBodyText}>
          続きから入力する場合は前回の内容を復元し、新しく入力する場合は保存内容を削除して空の状態で開きます。
        </Text>
      </View>

      <View style={styles.draftRestoreActionColumn}>
        <CocolonButton
          variant="primary"
          onPress={restorePendingInputDraft}
          accessibilityLabel="前回の内容を復元して続きから入力する"
        >
          続きから入力する
        </CocolonButton>
        <View style={styles.draftRestoreSecondaryAction}>
          <CocolonButton
            variant="secondary"
            onPress={discardPendingInputDraft}
            accessibilityLabel="保存内容を削除して新しく入力する"
          >
            新しく入力する
          </CocolonButton>
        </View>
      </View>
    </View>
  </View>
</Modal>

<Modal
  visible={inputFeedbackModalVisible}
  transparent
  animationType="fade"
  onRequestClose={closeInputFeedbackModal}
>
  <View style={styles.inputFeedbackBackdrop}>
    <View
      style={[
        styles.inputFeedbackCard,
        { maxHeight: Math.max(380, Math.min(620, Math.floor((windowHeight || 0) * 0.84) || 560)) },
      ]}
    >
      <View style={styles.inputFeedbackHeader}>
        <View style={styles.inputFeedbackTitleRow}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={18}
            color={colors.TITLE_GOLD}
            style={styles.inputFeedbackTitleIcon}
          />
          <Text style={styles.inputFeedbackTitle}>入力へのコメント</Text>
        </View>
        {inputFeedbackModalDominantLabel ? (
          <Text style={styles.inputFeedbackMetaText}>
            {inputFeedbackModalDominantLabel}
          </Text>
        ) : null}
      </View>

      <ScrollView
        style={[
          styles.inputFeedbackBodyScroll,
          { maxHeight: Math.max(220, Math.min(420, Math.floor((windowHeight || 0) * 0.52) || 360)) },
        ]}
        contentContainerStyle={styles.inputFeedbackBodyContent}
        showsVerticalScrollIndicator
      >
        <Text style={styles.inputFeedbackBodyText}>
          {inputFeedbackModalText}
        </Text>
      </ScrollView>

      <View style={styles.inputFeedbackActionRow}>
        <CocolonButton
          variant="secondary"
          onPress={closeInputFeedbackModal}
          accessibilityLabel="感情入力へのコメントを閉じる"
        >
          閉じる
        </CocolonButton>
      </View>
    </View>
  </View>
</Modal>

<EmotionReflectionPreviewModal
  visible={reflectionPreviewVisible}
  preview={{
    ...(reflectionPreviewPayload || {}),
    quota: reflectionPreviewPayload?.quota || reflectionQuota || null,
  }}
  publishLoading={reflectionPublishLoading}
  onClose={handleCancelReflectionPreview}
  onPublish={handlePublishReflection}
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
  return StyleSheet.create(applyTypographyTokens({
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
      fontSize: 26,
      lineHeight: 32,
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
    inputTrialPromoCard: {
      marginBottom: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.BORDER_GOLD,
      backgroundColor: "#FFFFFF",
      paddingHorizontal: 14,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    inputTrialPromoHeadline: {
      flex: 1,
      marginRight: 12,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "800",
      color: "#000000",
    },
    inputTrialPromoButton: {
      flexShrink: 0,
      minHeight: 38,
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.BORDER_GOLD,
      backgroundColor: COLORS.BORDER_GOLD,
      alignItems: "center",
      justifyContent: "center",
    },
    inputTrialPromoButtonText: {
      fontSize: 12,
      fontWeight: "800",
      color: "#FFFFFF",
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
      display: "flex",
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
    todayQuestionAccordionCard: {
      marginBottom: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      overflow: "hidden",
    },
    todayQuestionAccordionHeader: {
      minHeight: 46,
      paddingHorizontal: 12,
      paddingVertical: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    todayQuestionAccordionTitle: {
      fontSize: 12,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },
    todayQuestionAccordionHeaderRight: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 12,
    },
    todayQuestionAccordionStatus: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      marginRight: 8,
    },
    todayQuestionAccordionStatusAnswered: {
      color: COLORS.TITLE_GOLD,
    },
    todayQuestionAccordionSpinner: {
      marginRight: 6,
    },
    todayQuestionAccordionContent: {
      borderTopWidth: 1,
      borderTopColor: COLORS.CARD_BORDER,
      paddingHorizontal: 12,
      paddingTop: 12,
      paddingBottom: 12,
    },

    inputHistoryQuickCard: {
      marginBottom: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      overflow: "hidden",
    },
    inputHistoryQuickButton: {
      minHeight: 46,
      paddingHorizontal: 12,
      paddingVertical: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    inputHistoryQuickLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      paddingRight: 12,
    },
    inputHistoryQuickIcon: {
      marginRight: 8,
    },
    inputHistoryQuickTextWrap: {
      flex: 1,
    },
    inputHistoryQuickTitle: {
      fontSize: 12,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },
    inputHistoryQuickSubtitle: {
      marginTop: 2,
      fontSize: 11,
      lineHeight: 16,
      color: COLORS.TEXT_SUBTLE,
    },

    todayStatusSection: {
      marginBottom: 18,
    },
    todayStatusTitle: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      marginBottom: 10,
    },

    heroCardHeader: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderWidth: 1,
      borderBottomWidth: 0,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 14,
      paddingTop: 16,
      paddingBottom: 12,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    heroCardHeaderActive: {
      shadowOpacity: 0.12,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 5,
    },
    heroCardHeaderReady: {
      borderColor: COLORS.BORDER_GOLD,
      shadowOpacity: 0.16,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    heroCardBody: {
      marginBottom: 18,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      borderWidth: 1,
      borderTopWidth: 0,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 14,
      paddingTop: 14,
      paddingBottom: 16,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    heroCardActive: {
      shadowOpacity: 0.12,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 5,
    },
    heroCardReady: {
      borderColor: COLORS.BORDER_GOLD,
      shadowOpacity: 0.16,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    heroRailStickyShell: {
      backgroundColor: COLORS.FIELD_BG,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 14,
      paddingTop: 2,
      paddingBottom: 8,
    },
    heroRailStickyInner: {
      backgroundColor: "transparent",
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    compactRailOverlay: {
      position: "absolute",
      left: 0,
      right: 0,
      paddingHorizontal: 18,
      paddingTop: 4,
      paddingBottom: 8,
      backgroundColor: COLORS.BG_SILVER,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
      zIndex: 30,
      shadowOpacity: 0,
      shadowRadius: 0,
      shadowOffset: { width: 0, height: 0 },
      elevation: 0,
    },
    compactRailInner: {
      backgroundColor: "transparent",
    },
    compactRailRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: -3,
    },
    heroHeader: {
      marginBottom: 0,
    },
    heroTitle: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 10,
    },
    heroRail: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginHorizontal: -4,
      marginBottom: 0,
    },
    heroRailChip: {
      marginHorizontal: 4,
      marginBottom: 8,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
    },
    heroRailChipOn: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    heroRailChipReady: {
      borderStyle: "dashed",
    },
    heroRailChipReadyOn: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      borderStyle: "solid",
    },
    heroRailChipText: {
      fontSize: 11,
      lineHeight: 16,
      fontWeight: "700",
      color: COLORS.TEXT_SUBTLE,
    },
    heroRailChipTextOn: {
      color: COLORS.ACCENT_TEXT,
    },
    compactRailChip: {
      marginHorizontal: 3,
      marginBottom: 0,
      paddingHorizontal: 8,
      paddingVertical: 5,
    },
    compactRailChipText: {
      fontSize: 10,
      lineHeight: 14,
    },
    heroDock: {
      marginTop: 12,
      minHeight: 50,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 10,
      paddingVertical: 10,
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
    },
    heroDockChip: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 10,
      paddingVertical: 6,
      marginRight: 8,
      marginBottom: 8,
    },
    heroDockChipText: {
      fontSize: 12,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },
    heroDockChipMeta: {
      fontSize: 11,
      fontWeight: "700",
      color: COLORS.TITLE_GOLD,
      marginLeft: 2,
    },
    heroFieldCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    heroFieldCardPrimary: {
      borderColor: COLORS.BORDER_GOLD,
    },
    heroFieldHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 6,
    },
    heroFieldTitle: {
      flex: 1,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      paddingRight: 10,
    },
    heroFieldMeta: {
      fontSize: 11,
      lineHeight: 16,
      fontWeight: "700",
      color: COLORS.TITLE_GOLD,
    },
    heroFieldHint: {
      fontSize: 12,
      lineHeight: 18,
      color: text.description ?? COLORS.TEXT_ON_LIGHT,
      marginBottom: 10,
    },
    heroFieldInput: {
      minHeight: 100,
    },
    heroStepBlock: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginBottom: 12,
    },
    heroStepBlockLocked: {
      opacity: 0.58,
    },
    heroStepCardLocked: {
      opacity: 0.45,
    },
    heroStepHeader: {
      marginBottom: 10,
    },
    heroStepTitle: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 4,
    },
    heroStepHint: {
      fontSize: 12,
      lineHeight: 18,
      color: text.description ?? COLORS.TEXT_ON_LIGHT,
    },
    heroFooter: {
      marginTop: 4,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    heroFooterReady: {
      borderColor: COLORS.BORDER_GOLD,
      backgroundColor: COLORS.FIELD_BG,
    },
    heroReadyRow: {
      alignItems: "flex-start",
      marginBottom: 10,
    },
    heroReadyText: {
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "800",
      color: COLORS.TEXT_SUBTLE,
    },
    heroReadyTextOn: {
      color: COLORS.TITLE_GOLD,
    },
    heroActionWrap: {
      width: "100%",
      marginTop: 8,
    },
    heroFooterSettingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 4,
    },
    heroFooterSettingLeft: {
      flexDirection: "row",
      alignItems: "flex-start",
      flex: 1,
      paddingRight: 12,
    },
    heroFooterSettingIcon: {
      marginTop: 2,
      marginRight: 8,
    },
    heroFooterSettingTextWrap: {
      flex: 1,
    },
    heroFooterSettingTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },
    heroFooterSettingDesc: {
      marginTop: 2,
      fontSize: font.description ?? 9,
      lineHeight: 15,
      color: text.description ?? COLORS.TEXT_ON_LIGHT,
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
     * - 感情通知（送信しない設定）
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

    draftRestoreBackdrop: {
      flex: 1,
      backgroundColor: "rgba(15, 23, 42, 0.34)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    draftRestoreCard: {
      width: "100%",
      maxWidth: 360,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.BORDER_GOLD,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 18,
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
    },
    draftRestoreBadgeRow: {
      alignItems: "center",
      marginBottom: 14,
    },
    draftRestoreBadge: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },
    draftRestoreBadgeIcon: {
      marginRight: 6,
    },
    draftRestoreBadgeText: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: "700",
      color: COLORS.TITLE_GOLD,
      textAlign: "center",
    },
    draftRestoreHeader: {
      alignItems: "center",
      marginBottom: 14,
    },
    draftRestoreTitle: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      textAlign: "center",
    },
    draftRestoreLeadText: {
      marginTop: 8,
      fontSize: 14,
      lineHeight: 22,
      fontWeight: "600",
      color: COLORS.TEXT_SUBTLE,
      textAlign: "center",
    },
    draftRestoreInfoCard: {
      width: "100%",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    draftRestoreInfoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    draftRestoreInfoIcon: {
      marginRight: 6,
    },
    draftRestoreInfoText: {
      flex: 1,
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "700",
      color: COLORS.TITLE_GOLD,
      textAlign: "left",
    },
    draftRestoreBodyText: {
      fontSize: 15,
      lineHeight: 24,
      fontWeight: "600",
      color: COLORS.TEXT_ON_LIGHT,
      textAlign: "left",
    },
    draftRestoreActionColumn: {
      marginTop: 16,
      width: "100%",
      alignSelf: "center",
    },
    draftRestoreSecondaryAction: {
      marginTop: 10,
    },
    inputFeedbackBackdrop: {
      flex: 1,
      backgroundColor: "rgba(15, 23, 42, 0.38)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    inputFeedbackCard: {
      width: "100%",
      maxWidth: 360,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.BORDER_GOLD,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 18,
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
    },
    inputFeedbackHeader: {
      alignItems: "center",
      marginBottom: 14,
    },
    inputFeedbackTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    inputFeedbackTitleIcon: {
      marginRight: 6,
    },
    inputFeedbackTitle: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      textAlign: "center",
    },
    inputFeedbackMetaText: {
      marginTop: 8,
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "700",
      color: COLORS.TITLE_GOLD,
      textAlign: "center",
    },
    inputFeedbackBodyScroll: {
      width: "100%",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    inputFeedbackBodyContent: {
      paddingHorizontal: 18,
      paddingVertical: 18,
    },
    inputFeedbackBodyText: {
      fontSize: 16,
      lineHeight: 28,
      fontWeight: "600",
      color: COLORS.TEXT_ON_LIGHT,
      textAlign: "left",
    },
    inputFeedbackActionRow: {
      marginTop: 16,
      width: "100%",
      alignSelf: "center",
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
  }, ui));
}

