import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Alert, StatusBar, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useTheme } from "../theme/ThemeContext";
import { useUnread } from "../UnreadContext";
import { useTutorial } from "../TutorialContext";
import TutorialOverlay from "../components/TutorialOverlay";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import PieceHomeMainActions from "./piece/PieceHomeMainActions";
import PieceRecommendModal from "./piece/PieceRecommendModal";
import PieceTutorialCreateModal from "./piece/PieceTutorialCreateModal";
import usePieceHomeGlobalSummary from "./piece/usePieceHomeGlobalSummary";
import usePieceHomeTutorial, { TUTORIAL_TOTAL_STEPS } from "./piece/usePieceHomeTutorial";
import usePieceRecommendUsers from "./piece/usePieceRecommendUsers";

/**
 * PieceScreen (Home)
 * -------------------
 * - Piece の「Home」画面として、軽い導線のみを提供します
 *   - フォロー切替（Piece対象ユーザー切替）
 *   - 履歴導線（Resonance一覧へ）
 *   - おすすめ導線（現状はモーダルのまま）
 *   - 「Pieceを開く」ボタン（→ PieceLibraryScreen へ）
 */

const PANEL_MIN_HEIGHT = 690;

export default function PieceScreen({ route } = {}) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const navigation = useNavigation();

  const {
    getFeatureUnread,
    getPrefetchEntry,
    getPrefetchEntryFresh,
    setPrefetch,
  } = useUnread();
  const {
    isTutorialMode,
    tutorialStep,
    tutorialPieces,
    setTutorialPieces,
    setTutorialStep,
  } = useTutorial();
  const tutorialSurfaceEnabled = false;

  const screenRootRef = useRef(null);

  const initialViewedUserId =
    route?.params?.viewedUserId ||
    route?.params?.targetUserId ||
    route?.params?.userId ||
    null;
  const targetUserId = initialViewedUserId ? String(initialViewedUserId) : null;

  const unreadPieces = !(tutorialSurfaceEnabled && isTutorialMode) && !!getFeatureUnread("Piece", "piecesNew");
  const unreadEmotionLog = !!getFeatureUnread("EmotionLog", "feed");

  const {
    globalPieceCount,
    globalResonanceCount,
  } = usePieceHomeGlobalSummary({ navigation, isTutorialMode });

  const recommend = usePieceRecommendUsers({
    navigation,
    isTutorialMode,
    getPrefetchEntry,
    getPrefetchEntryFresh,
    setPrefetch,
  });

  const tutorial = usePieceHomeTutorial({
    navigation,
    targetUserId,
    isTutorialMode,
    tutorialStep,
    tutorialPieces,
    setTutorialPieces,
    setTutorialStep,
    tutorialSurfaceEnabled,
    screenRootRef,
  });

  const isDark = themeName === "dark";

  const resetToMain = useCallback(() => {
    recommend.resetRecommendState();
    tutorial.resetTutorialCreateState();
  }, [recommend, tutorial]);

  useEffect(() => {
    if (!navigation?.addListener) return;

    const unsubscribe = navigation.addListener("tabPress", () => {
      if (navigation.isFocused()) {
        resetToMain();
      }
    });

    return unsubscribe;
  }, [navigation, resetToMain]);

  useEffect(() => {
    if (!navigation?.addListener) return;
    const unsubscribe = navigation.addListener("blur", () => {
      resetToMain();
    });
    return unsubscribe;
  }, [navigation, resetToMain]);

  const openPieceCreateFromHome = useCallback(() => {
    if (tutorialSurfaceEnabled && isTutorialMode) {
      tutorial.openTutorialCreate();
      return;
    }

    Alert.alert("Homeから生成してください", "ピースの生成は Home 画面から行います。");
  }, [isTutorialMode, tutorial, tutorialSurfaceEnabled]);

  const openReactionHistory = useCallback(() => {
    if (!navigation?.navigate) return;

    try {
      navigation.navigate("PieceHistory");
    } catch {
      Alert.alert(
        "履歴を開けません",
        "履歴画面が navigation に未登録の可能性があります。"
      );
    }
  }, [navigation]);

  const openEmotionLog = useCallback(() => {
    if (!navigation?.navigate) return;

    try {
      navigation.navigate("EmotionLog");
    } catch {
      Alert.alert(
        "感情ログを開けません",
        "感情ログ画面が navigation に未登録の可能性があります。"
      );
    }
  }, [navigation]);

  const handlePressGuide = useCallback(() => {
    try {
      if (navigation && typeof navigation.navigate === "function") {
        navigation.navigate("CocolonGuide", { screenId: "piece" });
        return;
      }
    } catch {
      // noop
    }

    try {
      const parent =
        typeof navigation?.getParent === "function" ? navigation.getParent() : null;
      if (parent && typeof parent.navigate === "function") {
        parent.navigate("CocolonGuide", { screenId: "piece" });
        return;
      }
    } catch {
      // noop
    }

    Alert.alert("ガイド", "ガイド画面へのナビゲーションがまだ設定されていません。");
  }, [navigation]);

  const openRecommend = useCallback(() => {
    if (tutorialSurfaceEnabled && isTutorialMode) {
      recommend.showTutorialRecommendInfo();
      return;
    }

    recommend.setRecoModalVisible(true);
    recommend.loadRecommendUsers();
  }, [isTutorialMode, recommend, tutorialSurfaceEnabled]);

  return (
    <View ref={screenRootRef} collapsable={false} style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />

      <View style={styles.safeContent}>
        <PieceHomeMainActions
          styles={styles}
          colors={colors}
          tutorialSurfaceEnabled={tutorialSurfaceEnabled}
          isTutorialMode={isTutorialMode}
          tutorialHasSelfPiece={tutorial.tutorialHasSelfPiece}
          globalPieceCount={globalPieceCount}
          globalResonanceCount={globalResonanceCount}
          unreadPieces={unreadPieces}
          unreadEmotionLog={unreadEmotionLog}
          refs={{
            tutorialScrollRef: tutorial.tutorialScrollRef,
            pieceTitleRef: tutorial.pieceTitleRef,
            pieceLibraryButtonRef: tutorial.pieceLibraryButtonRef,
            createButtonRef: tutorial.createButtonRef,
          }}
          onScroll={tutorial.handleTutorialScroll}
          onPressGuide={handlePressGuide}
          onOpenPieceLibrary={tutorial.openPieceLibrary}
          onOpenEmotionLog={openEmotionLog}
          onOpenPieceCreate={openPieceCreateFromHome}
          onOpenRecommend={openRecommend}
          onOpenReactionHistory={openReactionHistory}
        />
      </View>

      {tutorial.tutorialOverlayConfig ? (
        <TutorialOverlay
          visible={tutorial.isPieceTutorialVisible}
          targetRect={tutorial.tutorialTargetRect}
          title={tutorial.tutorialOverlayConfig.title}
          message={tutorial.tutorialOverlayConfig.message}
          step={tutorial.tutorialOverlayConfig.step}
          totalSteps={TUTORIAL_TOTAL_STEPS}
          mode={tutorial.tutorialOverlayConfig.mode}
          nextLabel={tutorial.tutorialOverlayConfig.nextLabel}
          onNext={tutorial.tutorialOverlayConfig.onNext}
          actionHint={tutorial.tutorialOverlayConfig.actionHint}
          cardPlacement={tutorial.tutorialOverlayConfig.cardPlacement || "bottom"}
          onTargetPress={
            tutorialStep === 14
              ? tutorial.openTutorialCreate
              : tutorialStep === 15
                ? tutorial.openPieceLibrary
                : undefined
          }
          onMetricsChange={tutorial.setTutorialOverlayMetrics}
        />
      ) : null}

      <PieceTutorialCreateModal
        visible={tutorial.tutorialCreateVisible}
        styles={styles}
        colors={colors}
        ui={ui}
        refs={{
          modalOverlayRootRef: tutorial.modalOverlayRootRef,
          tutorialCreateScrollRef: tutorial.tutorialCreateScrollRef,
          tutorialCreateScrollYRef: tutorial.tutorialCreateScrollYRef,
          tutorialCreateQuestionInputWrapRef: tutorial.tutorialCreateQuestionInputWrapRef,
          tutorialCreateInputWrapRef: tutorial.tutorialCreateInputWrapRef,
          tutorialCreateSaveButtonRef: tutorial.tutorialCreateSaveButtonRef,
        }}
        answer={tutorial.tutorialCreateAnswer}
        setAnswer={tutorial.setTutorialCreateAnswer}
        error={tutorial.tutorialCreateError}
        setError={tutorial.setTutorialCreateError}
        submitting={tutorial.tutorialCreateSubmitting}
        onClose={tutorial.closeTutorialCreate}
        onSave={tutorial.saveTutorialPiece}
        isTutorialMode={isTutorialMode}
        tutorialStep={tutorialStep}
        tutorialModalOverlayConfig={tutorial.tutorialModalOverlayConfig}
        tutorialModalTargetRect={tutorial.tutorialModalTargetRect}
        setTutorialModalOverlayMetrics={tutorial.setTutorialModalOverlayMetrics}
      />

      <PieceRecommendModal
        visible={recommend.recoModalVisible}
        styles={styles}
        colors={colors}
        users={recommend.recoUsers}
        loading={recommend.recoUsersLoading}
        error={recommend.recoUsersError}
        onClose={() => recommend.setRecoModalVisible(false)}
        onRefresh={recommend.loadRecommendUsers}
        onOpenAccount={recommend.openAccount}
      />
    </View>
  );
}

function createStyles(COLORS, ui) {
  const font = ui?.font || {};
  const text = ui?.text || {};
  return StyleSheet.create(applyTypographyTokens({
    container: { flex: 1, backgroundColor: COLORS.PANEL_BG },
    safeContent: { flex: 1 },
    body: { flex: 1 },
    bodyContent: {
      paddingTop: 16,
      paddingHorizontal: 18,
      alignItems: "stretch",
      paddingBottom: 32,
      minHeight: PANEL_MIN_HEIGHT,
    },

    // Header
    panelHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
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
      marginBottom: 2,
    },

    homeActionCard: {
      borderRadius: 26,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 22,
      paddingTop: 18,
      paddingBottom: 20,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    homeActionCardTitleRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    homeActionCardTitle: {
      flex: 1,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: "800",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      letterSpacing: 0.2,
    },
    homeActionCardBadge: {
      marginLeft: 10,
    },
    homeActionCardDescription: {
      marginTop: 10,
      fontSize: 14,
      lineHeight: 21,
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },
    homeActionButton: {
      marginTop: 18,
      borderRadius: 999,
      paddingVertical: 16,
      paddingHorizontal: 18,
      shadowColor: "#000",
      shadowOpacity: 0.16,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    homeActionButtonRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    homeActionButtonIcon: {
      marginRight: 10,
    },
    homeActionButtonText: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: "800",
      color: "#FFFFFF",
      letterSpacing: 0.2,
    },

    // Recommend
    recoCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginBottom: 12,
    },
    recoTitle: {
      fontSize: 13,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
    },
    recoSummaryText: {
      marginTop: 6,
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
      opacity: 0.9,
    },
    createTitleRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    createUnreadBadge: {
      marginLeft: 8,
    },
    recoRefreshBtn: {
      width: 34,
      height: 34,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      alignItems: "center",
      justifyContent: "center",
    },
    recoToggleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
      marginBottom: 10,
    },
    recoTogglePill: {
      flex: 1,
      marginRight: 8,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      alignItems: "center",
      justifyContent: "center",
    },
    recoTogglePillActive: {
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
    },
    recoToggleText: {
      fontSize: 11,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
    },
    recoToggleTextActive: {
      color: "#FFFFFF",
    },
    recoSectionLabel: {
      fontSize: font.sectionLabel ?? 12,
      fontWeight: "800",
      color: text.sectionLabel ?? text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    recoPillScroll: { marginTop: 8 },
    recoPill: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      maxWidth: 240,
    },
    recoPillActive: {
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
    },
    recoPillText: {
      fontSize: 11,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
    },
    recoPillTextActive: {
      color: "#FFFFFF",
    },
    recoEmptyText: {
      marginTop: 8,
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
      opacity: 0.85,
    },
    recoLoadingRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },
    recoLoadingText: {
      marginLeft: 10,
      fontSize: 12,
      color: COLORS.TEXT_ON_LIGHT,
      opacity: 0.85,
    },

    // Home
    qnaIntroCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 12,
    },
    qnaIntroTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    qnaIntroTitle: {
      fontSize: 13,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 0,
    },
    qnaIntroText: {
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
    },

    // Actions
    actions: { marginTop: 6, marginBottom: 2 },
    targetRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
    },
    targetLabel: {
      fontSize: font.sectionLabel ?? 12,
      color: text.sectionLabel ?? text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    targetNamePressable: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      maxWidth: "80%",
    },
    targetName: {
      fontSize: 12,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
    },

    // Shared button row
    btnRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    goldButtonText: {
      fontSize: 13,
      fontWeight: "900",
      color: "#FFFFFF",
      letterSpacing: 0.6,
    },
    neutralButtonText: {
      fontSize: 13,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
      letterSpacing: 0.6,
    },

    // History
    historyCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginBottom: 12,
    },
    historyCardTitle: {
      fontSize: 13,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
    },
    historyEntry: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    historyEntryText: {
      fontSize: 13,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
    },

    // Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.35)",
      paddingHorizontal: 16,
      justifyContent: "center",
    },
    modalCard: {
      borderRadius: 22,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
      maxHeight: "82%",
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    modalTitle: {
      fontSize: 14,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
    },
    modalCloseBtn: {
      width: 36,
      height: 36,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.FIELD_BG,
    },
    modalLoading: {
      paddingVertical: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    modalLoadingText: {
      marginTop: 10,
      fontSize: 12,
      color: COLORS.TEXT_ON_LIGHT,
      opacity: 0.9,
    },
    modalEmpty: {
      paddingVertical: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    modalEmptyText: {
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
      opacity: 0.9,
      textAlign: "center",
    },
    listArea: { paddingBottom: 4 },
    modalScrollContent: { paddingBottom: 12 },

    // Recommend users list rows
    recoUserRow: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 8,
    },
    recoUserName: {
      fontSize: 13,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
    },
    recoUserSub: {
      marginTop: 2,
      fontSize: font.description ?? 9,
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },

    // Follow picker list rows
    listRow: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 8,
    },
    listRowActive: {
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.PANEL_BG,
    },
    rowTitleLine: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    rowTitle: {
      flex: 1,
      fontSize: 13,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
      paddingRight: 10,
    },
    activeBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      backgroundColor: COLORS.GOLD_BUTTON,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      alignSelf: "flex-start",
    },
    activeBadgeText: {
      fontSize: 10,
      fontWeight: "900",
      color: "#FFFFFF",
    },
    pickerEmptyInline: {
      paddingVertical: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    tutorialQuestionCard: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    tutorialQuestionLabel: {
      fontSize: 11,
      fontWeight: "900",
      color: COLORS.TITLE_GOLD,
      marginBottom: 4,
    },
    tutorialTextArea: {
      marginTop: 8,
      minHeight: 120,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 13,
      lineHeight: 19,
      color: COLORS.TEXT_ON_LIGHT,
    },
    tutorialHelperText: {
      marginTop: 8,
      fontSize: 11,
      lineHeight: 16,
      color: text.description ?? COLORS.TEXT_SUBTLE,
      opacity: 0.9,
    },
    modeErrorText: {
      marginTop: 10,
      fontSize: 11,
      lineHeight: 16,
      color: "#B91C1C",
      textAlign: "center",
    },
  }, ui));
}

