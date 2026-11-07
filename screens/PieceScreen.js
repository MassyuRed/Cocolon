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
    container: {
      flex: 1,
      backgroundColor: COLORS.BG_SILVER,
    },
    safeContent: { flex: 1 },
    body: { flex: 1 },
    bodyContent: {
      paddingTop: 16,
      paddingHorizontal: 20,
      alignItems: "stretch",
      paddingBottom: 32,
      width: '100%',
      maxWidth: 640,
      alignSelf: 'center',
    },

    // Header
    panelHeader: {
      flexDirection: "row",
      alignItems: 'flex-start',
      justifyContent: "space-between",
      marginBottom: 20,
      columnGap: 12,
    },
    panelTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      letterSpacing: 0,
      flexShrink: 1,
      minWidth: 0,
    },
    panelTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      minWidth: 0,
    },
    guideTitleButton: {
      width: 44,
      height: 44,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      marginLeft: 10,
      flexShrink: 0,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
    },
    globalSummaryBlock: {
      marginBottom: 20,
    },
    globalSummaryInner: {
      borderTopWidth: 0,
      borderBottomWidth: 0,
      borderColor: COLORS.CARD_BORDER,
      paddingVertical: 16,
      borderRadius: 24,
      backgroundColor: COLORS.SURFACE_TONAL,
      paddingHorizontal: 20,
    },
    globalSummaryHeaderRow: {
      flexDirection: "row",
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    globalSummaryIcon: {
      marginRight: 6,
    },
    globalSummaryLabel: {
      letterSpacing: 0,
      color: COLORS.ON_SURFACE_TONAL,
      flexShrink: 1,
    },
    globalSummaryText: {
      color: COLORS.ON_SURFACE_TONAL,
      marginBottom: 4,
    },

    homeActionCard: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 20,
      shadowColor: "#000",
      shadowOpacity: 0,
      shadowRadius: 0,
      shadowOffset: { width: 0, height: 4 },
      elevation: 0,
    },
    homeActionCardTitleRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    homeActionCardTitle: {
      flex: 1,
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      letterSpacing: 0,
      minWidth: 0,
      flexShrink: 1,
    },
    homeActionCardBadge: {
      marginLeft: 10,
    },
    homeActionCardDescription: {
      marginTop: 8,
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },
    homeActionButton: {
      marginTop: 18,
      borderRadius: 24,
      paddingVertical: 14,
      paddingHorizontal: 20,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
      minHeight: 52,
      maxWidth: 520,
    },
    homeActionButtonRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      maxWidth: '100%',
    },
    homeActionButtonIcon: {
      marginRight: 10,
    },
    homeActionButtonText: {
      color: COLORS.ACCENT_TEXT,
      letterSpacing: 0,
      flexShrink: 1,
      textAlign: 'center',
    },

    // Recommend
    recoCard: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginBottom: 16,
    },
    recoTitle: {
      color: COLORS.TEXT_ON_LIGHT,
    },
    recoSummaryText: {
      marginTop: 8,
      color: COLORS.TEXT_ON_LIGHT,
    },
    createTitleRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    createUnreadBadge: {
      marginLeft: 8,
    },
    recoRefreshBtn: {
      width: 44,
      height: 44,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    recoToggleRow: {
      flexDirection: "row",
      alignItems: 'stretch',
      marginTop: 4,
      marginBottom: 12,
      columnGap: 8,
    },
    recoTogglePill: {
      flex: 1,
      marginRight: 0,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44,
      paddingHorizontal: 12,
    },
    recoTogglePillActive: {
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.SURFACE_TONAL,
    },
    recoToggleText: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
      textAlign: 'center',
    },
    recoToggleTextActive: {
      color: COLORS.ON_SURFACE_TONAL,
    },
    recoSectionLabel: {
      color: text.sectionLabel ?? text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    recoPillScroll: { marginTop: 8 },
    recoPill: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      maxWidth: 320,
      minHeight: 44,
    },
    recoPillActive: {
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.SURFACE_TONAL,
    },
    recoPillText: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
    },
    recoPillTextActive: {
      color: COLORS.ON_SURFACE_TONAL,
    },
    recoEmptyText: {
      marginTop: 8,
      color: COLORS.TEXT_SUBTLE,
    },
    recoLoadingRow: {
      flexDirection: "row",
      alignItems: 'flex-start',
      marginTop: 8,
    },
    recoLoadingText: {
      marginLeft: 10,
      color: COLORS.TEXT_SUBTLE,
      flexShrink: 1,
    },

    // Home
    qnaIntroCard: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginBottom: 16,
    },
    qnaIntroTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    qnaIntroTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 0,
    },
    qnaIntroText: {
      color: COLORS.TEXT_ON_LIGHT,
    },

    // Actions
    actions: {
      marginTop: 16,
      marginBottom: 12,
    },
    targetRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: 'flex-start',
      marginBottom: 16,
      flexWrap: 'wrap',
      columnGap: 8,
      rowGap: 8,
    },
    targetLabel: {
      color: text.sectionLabel ?? text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    targetNamePressable: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 0,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      maxWidth: '100%',
      minHeight: 44,
    },
    targetName: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
      minWidth: 0,
    },

    // Shared button row
    btnRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      maxWidth: '100%',
    },
    goldButtonText: {
      color: COLORS.ACCENT_TEXT,
      letterSpacing: 0,
      flexShrink: 1,
      textAlign: 'center',
    },
    neutralButtonText: {
      color: COLORS.TEXT_ON_LIGHT,
      letterSpacing: 0,
      flexShrink: 1,
      textAlign: 'center',
    },

    // History
    historyCard: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginBottom: 16,
    },
    historyCardTitle: {
      color: COLORS.TEXT_ON_LIGHT,
    },
    historyEntry: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
      minHeight: 52,
    },
    historyEntryText: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
    },

    // Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.35)",
      paddingHorizontal: 16,
      justifyContent: "center",
      paddingVertical: 16,
    },
    modalCard: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 20,
      paddingVertical: 20,
      maxHeight: '90%',
      width: '100%',
      maxWidth: 640,
      alignSelf: 'center',
      flexShrink: 1,
      minHeight: 0,
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: 'flex-start',
      justifyContent: "space-between",
      marginBottom: 16,
      columnGap: 12,
    },
    modalTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      flex: 1,
      minWidth: 0,
      flexShrink: 1,
    },
    modalCloseBtn: {
      width: 44,
      height: 44,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.FIELD_BG,
      flexShrink: 0,
    },
    modalLoading: {
      paddingVertical: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    modalLoadingText: {
      marginTop: 10,
      color: COLORS.TEXT_SUBTLE,
    },
    modalEmpty: {
      paddingVertical: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    modalEmptyText: {
      color: COLORS.TEXT_SUBTLE,
      textAlign: "center",
    },
    listArea: {
      paddingBottom: 8,
      flexShrink: 1,
      minHeight: 0,
    },
    modalScrollContent: {
      paddingBottom: 16,
    },

    // Recommend users list rows
    recoUserRow: {
      flexDirection: "row",
      alignItems: 'center',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginBottom: 8,
      minHeight: 64,
    },
    recoUserName: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
    },
    recoUserSub: {
      marginTop: 2,
      color: text.description ?? COLORS.TEXT_SUBTLE,
      flexShrink: 1,
    },

    // Follow picker list rows
    listRow: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginBottom: 8,
      minHeight: 64,
    },
    listRowActive: {
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.SURFACE_TONAL,
    },
    rowTitleLine: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      flexWrap: 'wrap',
      columnGap: 8,
      rowGap: 6,
    },
    rowTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      paddingRight: 0,
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 160,
      minWidth: 0,
    },
    activeBadge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: COLORS.SURFACE_TONAL,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      alignSelf: "flex-start",
      maxWidth: '100%',
    },
    activeBadgeText: {
      color: COLORS.ON_SURFACE_TONAL,
      flexShrink: 1,
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
      backgroundColor: COLORS.SURFACE_TONAL,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    tutorialQuestionLabel: {
      color: COLORS.ON_SURFACE_TONAL,
      marginBottom: 8,
    },
    tutorialTextArea: {
      marginTop: 8,
      minHeight: 144,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
      color: COLORS.TEXT_ON_LIGHT,
    },
    tutorialHelperText: {
      marginTop: 8,
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },
    modeErrorText: {
      marginTop: 10,
      color: COLORS.ERROR,
      textAlign: "center",
    },
  }, ui, {"panelTitle":"screenTitle","globalSummaryLabel":"button","globalSummaryText":"description","homeActionCardTitle":"sectionTitle","homeActionCardDescription":"description","homeActionButtonText":"button","recoTitle":"sectionTitle","recoSummaryText":"description","recoToggleText":"button","recoToggleTextActive":"button","recoSectionLabel":"sectionTitle","recoPillText":"button","recoPillTextActive":"button","recoEmptyText":"description","recoLoadingText":"description","qnaIntroTitle":"sectionTitle","qnaIntroText":"description","targetLabel":"button","targetName":"button","goldButtonText":"button","neutralButtonText":"button","historyCardTitle":"sectionTitle","historyEntryText":"button","modalTitle":"modalTitle","modalLoadingText":"description","modalEmptyText":"description","recoUserName":"button","recoUserSub":"meta","rowTitle":"button","activeBadgeText":"meta","tutorialQuestionLabel":"button","tutorialTextArea":"body","tutorialHelperText":"description","modeErrorText":"description"}));
}

