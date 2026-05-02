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
  Pressable,
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
  cancelEmotionPiece,
  previewEmotionPiece,
  publishEmotionPiece,
} from "../lib/api/home/emotionPieceApi";
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
import { EMOTION_NOTIFICATION_WIRE } from "../lib/compat/legacyWireContracts";
import TutorialOverlay, {
  syncTutorialSpotlightTarget,
  waitForTutorialFrames,
} from "../components/TutorialOverlay";
import TodayQuestionCard from "../components/TodayQuestionCard";
import TodayQuestionModal from "../components/TodayQuestionModal";
import NoticeModal from "../components/NoticeModal";
import { ScreenUnreadBadge } from "../components/UnreadBadge";
import EmotionPiecePreviewModal from "../components/EmotionPiecePreviewModal";
import {
  getTutorialEmlisReplyText,
  TUTORIAL_EMLIS_REPLY,
  TUTORIAL_INPUT_SAMPLE,
  TUTORIAL_PIECE_PREVIEW,
  TUTORIAL_SELF_PIECE,
  TUTORIAL_TOTAL_STEPS,
} from "../tutorial/tutorialScenarioData";

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
    // 新Piece仕様ではシークレットメモUIを表導線から外す。
    // 旧下書きに isSecret が残っていても、新UIでは常に false として扱う。
    isSecret: false,
    sendEmotionNotification: data?.sendEmotionNotification !== false,
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

const STRENGTH_LABEL_JA = Object.freeze({ weak: "弱", medium: "中", strong: "強" });

function strengthScoreForFeedback(strength) {
  return STRENGTH_SCORE[strength] || 0;
}

function formatEmotionForFeedback(entry) {
  const type = String(entry?.type || "").trim();
  if (!type) return "";
  if (type === SELF_INSIGHT) return type;
  const strength = String(entry?.strength || "").trim();
  const strengthLabel = STRENGTH_LABEL_JA[strength] || "";
  return strengthLabel ? `${type}（${strengthLabel}）` : type;
}

function buildInputFeedbackEmotionMeta(values) {
  const items = Array.isArray(values)
    ? values
        .map((entry) => ({
          type: String(entry?.type || "").trim(),
          strength: String(entry?.strength || "medium").trim() || "medium",
        }))
        .filter((entry) => entry.type)
    : [];

  if (items.length === 0) {
    return {
      emotionSummary: "",
      dominantSummary: "",
      dominantLabel: "",
    };
  }

  let dominant = items[0];
  for (const item of items) {
    if (strengthScoreForFeedback(item.strength) > strengthScoreForFeedback(dominant.strength)) {
      dominant = item;
    }
  }

  const emotionSummary = items
    .map((entry) => formatEmotionForFeedback(entry))
    .filter(Boolean)
    .join("／");
  const dominantLabel = formatEmotionForFeedback(dominant);

  return {
    emotionSummary: emotionSummary ? `選択した感情：${emotionSummary}` : "",
    dominantSummary: dominantLabel ? `中心として見ている感情：${dominantLabel}` : "",
    dominantLabel: dominantLabel ? `中心として見ている感情：${dominantLabel}` : "",
  };
}

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

// 感情ボタンの配置（2段構成：自己理解は平穏の隣）
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
const INPUT_TUTORIAL_STEP_END = 4;

/**
 * Home（InputScreen）
 * - 背景・パネル・ボタンなどを ThemeContext から取得
 */
export default function InputScreen({ navigation, route }) {
  const { colors, themeName } = useTheme();
  const { setUnread } = useUnread();
  const { session } = useAuth();
  const {
    isTutorialMode,
    tutorialFlagsLoaded,
    tutorialStep,
    tutorialResetToken,
    addTutorialEmotion,
    ensureTutorialPiecesSeed,
    setTutorialStep,
  } = useTutorial();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const currentUserId = String(session?.user?.id || "").trim();
  const tutorialDisplayName = useMemo(() => {
    const metadata = session?.user?.user_metadata || {};
    return (
      String(
        metadata?.display_name ||
          metadata?.displayName ||
          metadata?.name ||
          metadata?.full_name ||
          "ユーザー"
      ).trim() || "ユーザー"
    );
  }, [session?.user?.user_metadata]);
  const tutorialEmlisReplyText = useMemo(
    () => getTutorialEmlisReplyText(tutorialDisplayName),
    [tutorialDisplayName]
  );

  const isIOS = Platform.OS === "ios";

  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [memo, setMemo] = useState("");
  const [memoAction, setMemoAction] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showMemoSection, setShowMemoSection] = useState(true);
  // 展開式入力（タップで開く）
  const [activeField, setActiveField] = useState(null); // "memo" | "memoAction" | null
  const memoInputRef = useRef(null);
  const memoActionInputRef = useRef(null);
  const [memoContentHeight, setMemoContentHeight] = useState(44);
  const [memoActionContentHeight, setMemoActionContentHeight] = useState(44);

  const [isSecret, setIsSecret] = useState(false);
  const [sendEmotionNotification, setSendEmotionNotification] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [piecePreviewVisible, setPiecePreviewVisible] = useState(false);
  const [piecePreviewLoading, setPiecePreviewLoading] = useState(false);
  const [piecePublishLoading, setPiecePublishLoading] = useState(false);
  const [piecePreviewPayload, setPiecePreviewPayload] = useState(null);
  const [keyboardInset, setKeyboardInset] = useState(0);
  const wasTutorialModeRef = useRef(false);

  const resetLocalInputState = useCallback(() => {
    setSelectedEmotions([]);
    setMemo("");
    setMemoAction("");
    setSelectedCategories([]);
    setShowMemoSection(true);
    setActiveField(null);
    setMemoContentHeight(44);
    setMemoActionContentHeight(44);
    setIsSecret(false);
    setSendEmotionNotification(true);
    setPiecePreviewVisible(false);
    setPiecePreviewLoading(false);
    setPiecePublishLoading(false);
    setPiecePreviewPayload(null);
    setInputFeedbackModalVisible(false);
    setInputFeedbackModalText("");
    setInputFeedbackModalMeta({
      emotionSummary: "",
      dominantSummary: "",
      contextLabel: "",
    });
    setTutorialNavigateAfterReply(false);
    Keyboard.dismiss();
  }, []);

// --- Lightweight toast / input feedback modal ---
const toastTimerRef = useRef(null);
const tutorialEmotionLogNotifyTimerRef = useRef(null);
const [toastMessage, setToastMessage] = useState(null);
const [inputFeedbackModalVisible, setInputFeedbackModalVisible] = useState(false);
const [inputFeedbackModalText, setInputFeedbackModalText] = useState("");
const [inputFeedbackModalMeta, setInputFeedbackModalMeta] = useState({
  emotionSummary: "",
  dominantSummary: "",
  contextLabel: "",
});
const [tutorialNavigateAfterReply, setTutorialNavigateAfterReply] = useState(false);
const draftSaveTimerRef = useRef(null);
const draftLoadRequestIdRef = useRef(0);
const latestInputDraftDataRef = useRef(null);
const [pendingInputDraft, setPendingInputDraft] = useState(null);
const [draftRestoreModalVisible, setDraftRestoreModalVisible] = useState(false);
const [draftBootstrapComplete, setDraftBootstrapComplete] = useState(false);

const openInputFeedbackModal = useCallback((input = {}) => {
  const nextCommentText = String(input?.commentText || "").trim();
  if (!nextCommentText) return;
  setInputFeedbackModalText(nextCommentText);
  setInputFeedbackModalMeta({
    emotionSummary: String(input?.emotionSummary || "").trim(),
    dominantSummary: String(input?.dominantSummary || input?.dominantLabel || "").trim(),
    contextLabel: String(input?.contextLabel || "").trim(),
  });
  setInputFeedbackModalVisible(true);
}, []);

const closeInputFeedbackModal = useCallback(() => {
  setInputFeedbackModalVisible(false);

  if (!tutorialNavigateAfterReply || !isTutorialMode) return;

  setTutorialNavigateAfterReply(false);
  setTutorialStep(7);

  requestAnimationFrame(() => {
    try {
      const parent =
        typeof navigation?.getParent === "function" ? navigation.getParent() : null;
      if (parent && typeof parent.navigate === "function") {
        parent.navigate("Analysis");
        return;
      }
    } catch {
      // noop
    }

    try {
      navigation?.navigate?.("Analysis");
    } catch {
      // noop
    }
  });
}, [isTutorialMode, navigation, setTutorialStep, tutorialNavigateAfterReply]);

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

useEffect(() => {
  if (wasTutorialModeRef.current && !isTutorialMode) {
    resetLocalInputState();
  }
  wasTutorialModeRef.current = !!isTutorialMode;
}, [isTutorialMode, resetLocalInputState]);

useEffect(() => {
  if (!route?.params?.tutorialFinishedAt) return;
  resetLocalInputState();
  try {
    navigation?.setParams?.({ tutorialFinishedAt: null });
  } catch {
    // noop
  }
}, [navigation, resetLocalInputState, route?.params?.tutorialFinishedAt]);

const [isTodayQuestionExpanded, setIsTodayQuestionExpanded] = useState(false);
const [tutorialPromptDismissedThisSession, setTutorialPromptDismissedThisSession] =
  useState(false);

useEffect(() => {
  setTutorialPromptDismissedThisSession(false);
}, [currentUserId]);

const buildTutorialStartupCandidate = useCallback(() => null, []);

const homeState = useHomeState({
  currentUserId,
  isTutorialMode,
  tutorialFlagsLoaded,
  navigation,
  buildTutorialStartupCandidate,
});

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
    registerInputInteraction,
    rememberDismissedNotice,
    rememberDismissedTodayQuestionDay,
    setNoticePopup,
    setNoticeUnreadCount,
    startupModalVisible,
    startupQueuePreparing,
    todayQuestionBundle,
    todayQuestionLoading,
  } = homeState;

  const pieceQuota = homeState.pieceQuota;
  const setPieceQuota = homeState.setPieceQuota;


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
      parent.navigate("Analysis", {
        openTodayQuestionHistory: true,
        openTodayQuestionHistoryAt: Date.now(),
      });
      return;
    }
  } catch {
    // noop
  }

  try {
    navigation?.navigate?.("Analysis", {
      openTodayQuestionHistory: true,
      openTodayQuestionHistoryAt: Date.now(),
    });
  } catch {
    // noop
  }
}, [activeStartupPopup?.kind, closeStartupPopupWindow, navigation]);



const { height: windowHeight } = useWindowDimensions();
  const safeInsets = useSafeAreaInsets();

  const screenRootRef = useRef(null);
  const emotionAreaRef = useRef(null);
  const memoSectionRef = useRef(null);
  const notificationRef = useRef(null);
  const pieceButtonRef = useRef(null);
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

  useEffect(() => {
    if (!isInputTutorialStep) return;

    setShowMemoSection(true);
    setMemo(TUTORIAL_INPUT_SAMPLE.memo);
    setMemoAction(TUTORIAL_INPUT_SAMPLE.memoAction);
    setSelectedEmotions(TUTORIAL_INPUT_SAMPLE.emotions.map((item) => ({ ...item })));
    setSelectedCategories([...TUTORIAL_INPUT_SAMPLE.categories]);
    setSendEmotionNotification(TUTORIAL_INPUT_SAMPLE.sendEmotionNotification !== false);
    setMemoContentHeight(110);
    setMemoActionContentHeight(72);
    setIsSecret(false);
    setActiveField(null);
  }, [isInputTutorialStep]);

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
        sendEmotionNotification,
      }),
    [
      isSecret,
      memo,
      memoAction,
      selectedCategories,
      selectedEmotions,
      sendEmotionNotification,
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

  useEffect(() => {
    if (!tutorialResetToken) return;
    resetLocalInputState();
    setPendingInputDraft(null);
    setDraftRestoreModalVisible(false);
    void clearPersistedInputDraft();
  }, [clearPersistedInputDraft, resetLocalInputState, tutorialResetToken]);

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
    setSendEmotionNotification(restored.sendEmotionNotification);
    setShowMemoSection(
      restored.selectedEmotions.some((item) => item?.type === SELF_INSIGHT) ||
        restored.memo.trim().length > 0 ||
        restored.memoAction.trim().length > 0 ||
        restored.selectedCategories.length > 0
    );
    setActiveField(null);
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

  const openField = (field) => {
    registerInputInteraction();
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

  const doNotSendEmotionNotification = !sendEmotionNotification;
  const isDark = themeName === "dark";

  const isSelfInsightSelected = selectedEmotions.some(
    (e) => e.type === SELF_INSIGHT
  );
  const hasMemoInput =
    memo.trim().length > 0 || memoAction.trim().length > 0;
  const hasSelectedCategories = selectedCategories.length > 0;
  const canSubmit =
    !submitting &&
    hasMemoInput &&
    selectedEmotions.length > 0 &&
    hasSelectedCategories;
  const canPreviewPiece =
    !piecePreviewLoading &&
    !piecePublishLoading &&
    canSubmit;
  const hasUserStartedInput =
    selectedEmotions.length > 0 ||
    memo.trim().length > 0 ||
    memoAction.trim().length > 0 ||
    selectedCategories.length > 0 ||
    activeField !== null ||
    sendEmotionNotification === false;

  useEffect(() => {
    if (!hasUserStartedInput) return;
    registerInputInteraction();
  }, [hasUserStartedInput, registerInputInteraction]);

  const getTutorialTargetRef = useCallback(() => {
    if (!isInputTutorialStep) return null;

    switch (tutorialStep) {
      case 1:
        return memoSectionRef;
      case 2:
        return emotionAreaRef;
      case 3:
        return notificationRef;
      case 4:
        return pieceButtonRef;
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
          title: "軽い独り言で大丈夫です",
          message:
            "Emlisは1日1回の日記ではなく、書きたいときに書ける場所です。\n\n画面に入っている内容くらいの短い言葉でも大丈夫です。",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(2),
        };
      case 2:
        return {
          step: 2,
          mode: "info",
          title: "感情とカテゴリを選びます",
          message:
            "感情もカテゴリも複数選べます。\n\n今回は、平穏・喜び・不安と、生活・健康・価値観を選んだ状態です。",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(3),
        };
      case 3:
        return {
          step: 3,
          mode: "info",
          title: "感情通知",
          message:
            "感情通知は、入力した感情をフォロー中ユーザーへ通知する設定です。\n\n今回は通知する状態で見せます。",
          nextLabel: "次へ",
          onNext: () => setTutorialStep(4),
        };
      case 4:
        return {
          step: 4,
          mode: "action",
          title: "Pieceを作成します",
          message:
            "ラフな独り言を、問いと答えとして読みやすく整えます。",
          actionHint: "Pieceを作成する を押してください",
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

    const frame = requestAnimationFrame(() => {
      setTutorialStep(INPUT_TUTORIAL_STEP_START);
    });

    return () => {
      try {
        cancelAnimationFrame(frame);
      } catch {
        // noop
      }
    };
  }, [isTutorialMode, tutorialStep, setTutorialStep]);


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
    showMemoSection,
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
    if (isTutorialMode) return;
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
    if (isTutorialMode) return;
    registerInputInteraction();
    setSelectedEmotions((prev) =>
      prev.map((e) => (e.type === cat ? { ...e, strength: s } : e))
    );
  };

  const toggleCategory = (category) => {
    if (isTutorialMode) return;
    registerInputInteraction();
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
      [EMOTION_NOTIFICATION_WIRE.submitField]: sendEmotionNotification,
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
    sendEmotionNotification,
  ]);


  const handlePreviewPiece = useCallback(async () => {
    if (!canPreviewPiece) return;

    registerInputInteraction();

    if (isTutorialMode) {
      setPiecePreviewPayload({ ...TUTORIAL_PIECE_PREVIEW });
      setPiecePreviewVisible(true);
      return;
    }

    setPiecePreviewLoading(true);
    try {
      const payload = buildEmotionSubmitPayload();
      const preview = await previewEmotionPiece(payload);
      const quota = preview?.quota && typeof preview.quota === "object"
        ? preview.quota
        : null;
      if (quota) {
        setPieceQuota(quota);
      }
      setPiecePreviewPayload(preview && typeof preview === "object" ? preview : null);
      setPiecePreviewVisible(true);
    } catch (e) {
      console.warn("InputScreen: previewEmotionPiece failed", e);
      Alert.alert(
        "Pieceの生成",
        String(e?.message || "Pieceの生成に失敗しました。")
      );
    } finally {
      setPiecePreviewLoading(false);
    }
  }, [
    buildEmotionSubmitPayload,
    canPreviewPiece,
    isTutorialMode,
    registerInputInteraction,
  ]);

  const handleCancelPiecePreview = useCallback(async () => {
    const previewId = String(piecePreviewPayload?.preview_id || "").trim();
    setPiecePreviewVisible(false);

    if (isTutorialMode) {
      setPiecePreviewPayload(null);
      return;
    }

    if (!previewId) {
      setPiecePreviewPayload(null);
      return;
    }
    try {
      await cancelEmotionPiece(previewId);
    } catch (e) {
      console.warn("InputScreen: cancelEmotionPiece failed", e);
    } finally {
      setPiecePreviewPayload(null);
    }
  }, [isTutorialMode, piecePreviewPayload?.preview_id]);

  const handlePublishPiece = useCallback(async () => {
    const previewId = String(piecePreviewPayload?.preview_id || "").trim();
    if (!previewId || piecePublishLoading) return;

    if (isTutorialMode) {
      const inputFeedbackEmotionMeta = buildInputFeedbackEmotionMeta(selectedEmotions);
      setPiecePreviewVisible(false);
      setPiecePreviewPayload(null);
      void ensureTutorialPiecesSeed();
      await clearPersistedInputDraft();
      setPendingInputDraft(null);
      setDraftRestoreModalVisible(false);
      Keyboard.dismiss();
      setTutorialNavigateAfterReply(true);
      setTutorialStep(5);
      openInputFeedbackModal({
        commentText: tutorialEmlisReplyText,
        ...inputFeedbackEmotionMeta,
        contextLabel: TUTORIAL_EMLIS_REPLY.contextLabel,
      });
      return;
    }

    setPiecePublishLoading(true);
    try {
      const publishResult = await publishEmotionPiece(previewId);
      const inputFeedbackText = String(
        publishResult?.input_feedback?.comment_text || ""
      ).trim();
      const inputFeedbackEmotionMeta = buildInputFeedbackEmotionMeta(selectedEmotions);

      await clearPersistedInputDraft();
      setPendingInputDraft(null);
      setDraftRestoreModalVisible(false);

      setSelectedEmotions([]);
      setMemo("");
      setMemoAction("");
      setSelectedCategories([]);
      setShowMemoSection(true);
      setActiveField(null);
      setMemoContentHeight(44);
      setMemoActionContentHeight(44);
      setIsSecret(false);
      Keyboard.dismiss();

      setPiecePreviewVisible(false);
      setPiecePreviewPayload(null);

      const nextQuota = publishResult?.quota && typeof publishResult.quota === "object"
        ? publishResult.quota
        : null;
      if (nextQuota) {
        setPieceQuota(nextQuota);
      }

      await loadHomeState({ force: true, includeStartupCandidate: false });

      if (inputFeedbackText) {
        openInputFeedbackModal({
          commentText: inputFeedbackText,
          ...inputFeedbackEmotionMeta,
          contextLabel: "Pieceを作成しました",
        });
      } else {
        showToast("Pieceを作成しました");
      }
    } catch (e) {
      console.warn("InputScreen: publishEmotionPiece failed", e);
      Alert.alert(
        "Pieceの作成",
        String(e?.message || "Pieceの作成に失敗しました。")
      );
    } finally {
      setPiecePublishLoading(false);
    }
  }, [
    clearPersistedInputDraft,
    ensureTutorialPiecesSeed,
    isTutorialMode,
    loadHomeState,
    openInputFeedbackModal,
    piecePreviewPayload?.preview_id,
    piecePublishLoading,
    selectedEmotions,
    setTutorialStep,
    showToast,
    tutorialEmlisReplyText,
  ]);

  const handleOk = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      // 1) 入力内容を MashOS Emotion Submit API 用のペイロードに変換
      const payload = buildEmotionSubmitPayload();
      const emotionDetails = Array.isArray(payload?.emotions) ? payload.emotions : [];
      const inputFeedbackEmotionMeta = buildInputFeedbackEmotionMeta(emotionDetails);

      if (isTutorialMode) {
        addTutorialEmotion({
          id: `tutorial-emotion-${Date.now()}`,
          ...payload,
          piece: { ...TUTORIAL_SELF_PIECE },
          is_tutorial: true,
        });

        void ensureTutorialPiecesSeed();

        await clearPersistedInputDraft();
        setPendingInputDraft(null);
        setDraftRestoreModalVisible(false);
        Keyboard.dismiss();

        setTutorialNavigateAfterReply(true);
        openInputFeedbackModal({
          commentText: tutorialEmlisReplyText,
          ...inputFeedbackEmotionMeta,
          contextLabel: TUTORIAL_EMLIS_REPLY.contextLabel,
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
      setShowMemoSection(true);
      setActiveField(null);
      setMemoContentHeight(44);
      setMemoActionContentHeight(44);
      setIsSecret(false);
      Keyboard.dismiss();

      await loadHomeState({ force: true, includeStartupCandidate: false });

      if (inputFeedbackText) {
        openInputFeedbackModal({
          commentText: inputFeedbackText,
          ...inputFeedbackEmotionMeta,
        });
      } else {
        showToast(`記録しました${inputFeedbackEmotionMeta.emotionSummary ? `
${inputFeedbackEmotionMeta.emotionSummary}` : ""}`);
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
              currentScrollYRef.current =
                e?.nativeEvent?.contentOffset?.y ?? currentScrollYRef.current;
            }}
          >
{/* パネルヘッダー */}
              <View style={styles.panelHeader}>
                <View style={styles.panelTitleRow}>
                  <Text style={styles.panelTitle}>ホーム</Text>
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

              <View style={styles.homeOverviewBlock}>
                <View style={styles.globalSummaryBlock}>
                  <View style={styles.globalSummaryInner}>
                    <View style={styles.globalSummaryHeaderRow}>
                      <Ionicons
                        name="radio-outline"
                        size={14}
                        color={colors.TITLE_GOLD}
                        style={styles.globalSummaryIcon}
                      />
                      <Text style={styles.globalSummaryLabel}>今日の全体行動</Text>
                    </View>
                    <Text style={styles.globalSummaryText}>
                      {`今日、全体で ${
                        typeof globalEmotionUsers === "number" ? globalEmotionUsers : "—"
                      } 人が感情入力しました`}
                    </Text>
                  </View>
                </View>

                <View style={styles.homeQuickActionsRow}>
                  {!shouldHideTodayQuestionForTutorial && todayQuestionBundle?.question ? (
                    <Pressable
                      style={styles.homeQuickActionButton}
                      onPress={() => setIsTodayQuestionExpanded((prev) => !prev)}
                      accessibilityRole="button"
                      accessibilityLabel={`今日の問い ${todayQuestionStatusLabel}`}
                      accessibilityState={{ expanded: isTodayQuestionExpanded }}
                    >
                      <View style={styles.homeQuickActionLeft}>
                        <Ionicons
                          name="help-circle-outline"
                          size={17}
                          color={colors.TEXT_SUBTLE}
                          style={styles.homeQuickActionIcon}
                        />
                        <Text
                          style={styles.homeQuickActionTitle}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          今日の問い
                        </Text>
                      </View>
                      {todayQuestionLoading ? (
                        <ActivityIndicator
                          size="small"
                          color={colors.TEXT_SUBTLE}
                          style={styles.homeQuickActionSpinner}
                        />
                      ) : null}
                      <Ionicons
                        name={isTodayQuestionExpanded ? "chevron-up" : "chevron-down"}
                        size={17}
                        color={colors.TEXT_SUBTLE}
                      />
                    </Pressable>
                  ) : null}

                  <Pressable
                    style={styles.homeQuickActionButton}
                    onPress={handleOpenEmotionHistory}
                    accessibilityRole="button"
                    accessibilityLabel="入力履歴を開く"
                  >
                    <View style={styles.homeQuickActionLeft}>
                      <Ionicons
                        name="time-outline"
                        size={17}
                        color={colors.TEXT_SUBTLE}
                        style={styles.homeQuickActionIcon}
                      />
                      <Text
                        style={styles.homeQuickActionTitle}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        入力履歴
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={17}
                      color={colors.TEXT_SUBTLE}
                    />
                  </Pressable>
                </View>

                {!shouldHideTodayQuestionForTutorial && todayQuestionBundle?.question && isTodayQuestionExpanded ? (
                  <View style={styles.todayQuestionInlineContent}>
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

              <View style={styles.heroMemoCard}>
                <View style={styles.heroCardHeader}>
                  <Text style={styles.heroEyebrow}>感情入力</Text>
                  <Text style={styles.heroTitle}>今の気持ちを残す</Text>
                  <Text style={styles.heroLead}>
                    思ったことや起きたことを入力して、今の感情を選んでください。
                  </Text>
                </View>

                <View
                  ref={memoSectionRef}
                  collapsable={false}
                  style={styles.heroMemoInputGroup}
                >
                  <View style={styles.heroFieldBlock}>
                    <Text style={styles.heroFieldLabel}>思考内容（考えていること）</Text>
                    <Text style={styles.heroFieldHint}>
                      何を思った／どう感じた／どう解釈した？
                    </Text>
                    {(isTutorialMode || activeField === "memo") ? (
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
                          {...(isIOS && !isTutorialMode ? { defaultValue: memo } : { value: memo })}
                          onChangeText={isTutorialMode ? undefined : setMemo}
                          {...(isIOS && !isTutorialMode
                            ? {
                                onChange: (e) =>
                                  setMemo(e?.nativeEvent?.text ?? ""),
                              }
                            : {})}
                          editable={!isTutorialMode}
                          multiline
                          scrollEnabled
                          textAlignVertical="top"
                          placeholderTextColor={colors.TEXT_ON_LIGHT}
                          onFocus={(e) => {
                            if (isTutorialMode) return;
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
                            if (!isTutorialMode) setActiveField(null);
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
                        onPress={() => { if (!isTutorialMode) openField("memo"); }}
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
                  </View>

                  <View style={styles.heroFieldBlock}>
                    <Text style={styles.heroFieldLabel}>行動内容（実際に起こった出来事）</Text>
                    <Text style={styles.heroFieldHint}>
                      何が起きた／何をした／結果どうなった？
                    </Text>
                    {(isTutorialMode || activeField === "memoAction") ? (
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
                          {...(isIOS && !isTutorialMode
                            ? { defaultValue: memoAction }
                            : { value: memoAction })}
                          onChangeText={isTutorialMode ? undefined : setMemoAction}
                          {...(isIOS && !isTutorialMode
                            ? {
                                onChange: (e) =>
                                  setMemoAction(e?.nativeEvent?.text ?? ""),
                              }
                            : {})}
                          editable={!isTutorialMode}
                          multiline
                          scrollEnabled
                          textAlignVertical="top"
                          placeholderTextColor={colors.TEXT_ON_LIGHT}
                          onFocus={(e) => {
                            if (isTutorialMode) return;
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
                            if (!isTutorialMode) setActiveField(null);
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
                        onPress={() => { if (!isTutorialMode) openField("memoAction"); }}
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
                  </View>
                </View>

                <View
                  ref={emotionAreaRef}
                  collapsable={false}
                  style={styles.heroEmotionSection}
                >
                  <Text style={styles.heroFieldLabel}>感情</Text>
                  <Text style={styles.heroFieldHint}>
                    今の感情を選んでください。複数選択可能です。自己理解は単体選択のみです。
                  </Text>

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
                          const isSelfInsightButton = cat === SELF_INSIGHT;
                          const isDisabled = isSelfInsightSelected && !isSelfInsightButton;

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
                                      : cat === SELF_INSIGHT
                                      ? "bulb-outline"
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
                                {on && !isSelfInsightButton &&
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

                <View style={styles.categorySection}>
                  <Text style={styles.heroFieldLabel}>このメモの内容カテゴリ</Text>
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

                <View style={styles.heroActionArea}>
                  <View
                    ref={notificationRef}
                    collapsable={false}
                    style={[styles.preferenceCard, styles.preferenceCardInActionArea]}
                  >
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
                            感情通知を送らない
                          </Text>
                          <Text style={styles.preferenceDesc}>
                            オンにするとフォロー中ユーザーに通知されません。
                          </Text>
                        </View>
                      </View>
                      <CocolonSwitch
                        value={doNotSendEmotionNotification}
                        onValueChange={(v) => {
                          if (isTutorialMode) return;
                          registerInputInteraction();
                          setSendEmotionNotification(!v);
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
                        disabled={isTutorialMode}
                        accessibilityLabel="感情通知を送らない設定を切り替える"
                      />
                    </View>
                  </View>

                  <View
                    ref={pieceButtonRef}
                    collapsable={false}
                    style={styles.buttonWrapper}
                  >
                    <CocolonButton
                      variant="secondary"
                      onPress={handlePreviewPiece}
                      disabled={!canPreviewPiece}
                      loading={piecePreviewLoading}
                      accessibilityLabel="Pieceを作成する"
                    >
                      Pieceを作成する
                    </CocolonButton>
                  </View>

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
                </View>
              </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
          <Text style={styles.inputFeedbackTitle}>Emlisからの返答</Text>
        </View>
        {inputFeedbackModalMeta.contextLabel ? (
          <Text style={styles.inputFeedbackMetaText}>
            {inputFeedbackModalMeta.contextLabel}
          </Text>
        ) : null}
        {inputFeedbackModalMeta.emotionSummary ? (
          <Text style={styles.inputFeedbackMetaText}>
            {inputFeedbackModalMeta.emotionSummary}
          </Text>
        ) : null}
        {inputFeedbackModalMeta.dominantSummary ? (
          <Text style={styles.inputFeedbackMetaText}>
            {inputFeedbackModalMeta.dominantSummary}
          </Text>
        ) : null}
      </View>

      <ScrollView
        style={[
          styles.inputFeedbackBodyScroll,
          { maxHeight: Math.max(220, Math.min(470, Math.floor((windowHeight || 0) * 0.56) || 390)) },
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
          accessibilityLabel="Emlisからの返答を閉じる"
        >
          閉じる
        </CocolonButton>
      </View>
    </View>
  </View>
</Modal>

<EmotionPiecePreviewModal
  visible={piecePreviewVisible}
  preview={{
    ...(piecePreviewPayload || {}),
    quota: piecePreviewPayload?.quota || pieceQuota || null,
  }}
  publishLoading={piecePublishLoading}
  onClose={handleCancelPiecePreview}
  onPublish={handlePublishPiece}
  hideCancelButton={isTutorialMode}
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
    onTargetPress={tutorialStep === 4 ? handlePreviewPiece : undefined}
    onMetricsChange={setTutorialOverlayMetrics}
    actionHint={tutorialOverlayConfig.actionHint}
    showStepPill={false}
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
    homeOverviewBlock: {
      width: "100%",
      alignSelf: "stretch",
      marginBottom: 8,
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

    /** メインパネル（Piece共通） */
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
      width: "100%",
      alignSelf: "stretch",
      marginBottom: 8,
    },
    globalSummaryInner: {
      width: "100%",
      alignSelf: "stretch",
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderTopColor: COLORS.CARD_BORDER,
      borderBottomColor: COLORS.CARD_BORDER,
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
      fontWeight: "700",
      marginBottom: 2,
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
      display: "none",
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
    homeQuickActionsRow: {
      width: "100%",
      alignSelf: "stretch",
      flexDirection: "row",
      alignItems: "stretch",
      marginHorizontal: -4,
      marginBottom: 0,
    },
    homeQuickActionButton: {
      flex: 1,
      height: 40,
      minHeight: 40,
      maxHeight: 40,
      minWidth: 0,
      marginHorizontal: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 10,
      paddingVertical: 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      overflow: "hidden",
    },
    homeQuickActionLeft: {
      flex: 1,
      minWidth: 0,
      flexDirection: "row",
      alignItems: "center",
      paddingRight: 4,
    },
    homeQuickActionIcon: {
      flexShrink: 0,
      marginRight: 5,
    },
    homeQuickActionTextWrap: {
      flex: 1,
      minWidth: 0,
    },
    homeQuickActionTitle: {
      flex: 1,
      minWidth: 0,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    homeQuickActionMeta: {
      marginTop: 1,
      fontSize: 10,
      lineHeight: 14,
      fontWeight: "800",
      color: COLORS.TEXT_SUBTLE,
    },
    homeQuickActionMetaAnswered: {
      color: COLORS.TITLE_GOLD,
    },
    homeQuickActionSpinner: {
      marginRight: 4,
    },
    todayQuestionInlineContent: {
      marginTop: 8,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      overflow: "hidden",
      paddingHorizontal: 12,
      paddingTop: 12,
      paddingBottom: 12,
    },
    todayQuestionAccordionCard: {
      marginBottom: 10,
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
      marginBottom: 0,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      overflow: "hidden",
    },
    inputHistoryQuickButton: {
      minHeight: 46,
      paddingHorizontal: 12,
      paddingVertical: 12,
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
      fontSize: 13,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },
    inputHistoryQuickSubtitle: {
      marginTop: 2,
      fontSize: 11,
      lineHeight: 16,
      color: COLORS.TEXT_SUBTLE,
    },

    heroMemoCard: {
      marginBottom: 18,
      borderRadius: 26,
      borderWidth: 1,
      borderColor: COLORS.BORDER_GOLD,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 16,
      shadowColor: "#000",
      shadowOpacity: 0.14,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
    },
    heroCardHeader: {
      marginBottom: 12,
    },
    heroEyebrow: {
      fontSize: 11,
      lineHeight: 16,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      letterSpacing: 0.5,
    },
    heroTitle: {
      marginTop: 3,
      fontSize: 20,
      lineHeight: 28,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    heroLead: {
      marginTop: 6,
      fontSize: font.description ?? 12,
      lineHeight: 19,
      color: text.description ?? COLORS.TEXT_SUBTLE,
      fontWeight: "600",
    },
    heroMemoInputGroup: {
      marginTop: 2,
    },
    heroFieldBlock: {
      marginBottom: 14,
    },
    heroFieldLabel: {
      fontSize: font.sectionLabel ?? 12,
      lineHeight: 18,
      fontWeight: "800",
      color: text.sectionLabel ?? text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginBottom: 4,
    },
    heroFieldHint: {
      fontSize: font.description ?? 11,
      lineHeight: 17,
      color: text.description ?? COLORS.TEXT_SUBTLE,
      fontWeight: "600",
      marginBottom: 8,
    },
    heroEmotionSection: {
      marginTop: 2,
      marginBottom: 4,
    },
    heroActionArea: {
      marginTop: 10,
    },
    preferenceCardInActionArea: {
      marginTop: 0,
      marginBottom: 8,
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

