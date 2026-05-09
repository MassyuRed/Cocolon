import React from "react";
import { ScrollView, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonPressable from "../../components/CocolonPressable";
import PieceHomeActionCard from "./PieceHomeActionCard";
import { TUTORIAL_PIECE_QUESTION } from "./usePieceHomeTutorial";

export default function PieceHomeMainActions({
  styles,
  colors,
  tutorialSurfaceEnabled,
  isTutorialMode,
  tutorialHasSelfPiece,
  globalPieceCount,
  globalResonanceCount,
  unreadPieces,
  unreadEmotionLog,
  refs,
  onScroll,
  onPressGuide,
  onOpenPieceLibrary,
  onOpenEmotionLog,
  onOpenPieceCreate,
  onOpenRecommend,
  onOpenReactionHistory,
}) {
  return (
    <ScrollView
      ref={refs.tutorialScrollRef}
      style={styles.body}
      contentContainerStyle={styles.bodyContent}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      <View style={styles.panelHeader}>
        <View ref={refs.pieceTitleRef} collapsable={false} style={styles.panelTitleRow}>
          <Text style={styles.panelTitle}>ピース</Text>
          <CocolonPressable
            style={styles.guideTitleButton}
            onPress={onPressGuide}
            accessibilityLabel="ガイドを開く"
          >
            <Ionicons
              name="help-circle-outline"
              size={20}
              color={colors.TEXT_ON_LIGHT}
            />
          </CocolonPressable>
        </View>
        <View style={styles.headerRight} />
      </View>

      {tutorialSurfaceEnabled && isTutorialMode ? (
        <View style={styles.recoCard}>
          <Text style={styles.recoTitle}>チュートリアル</Text>
          <Text style={styles.recoSummaryText}>
            この画面では、1つの問いに答えてピースが生成され、ピース一覧で閲覧できる流れを体験します。
          </Text>
          <Text style={styles.recoSummaryText}>
            {tutorialHasSelfPiece
              ? "生成済みのピースがあります。次はピース一覧で、自分の回答やフォロー中ユーザーのピースを見てみましょう。"
              : `まずは「${TUTORIAL_PIECE_QUESTION}」に答えてみましょう。`}
          </Text>
          <Text style={styles.recoSummaryText}>
            生成したピースは、あとで一覧から確認できます。
          </Text>
        </View>
      ) : (
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
                typeof globalPieceCount === "number" ? globalPieceCount : "—"
              } 回のピース閲覧がありました`}
            </Text>
            <Text style={styles.globalSummaryText}>
              {`今日、全体で ${
                typeof globalResonanceCount === "number" ? globalResonanceCount : "—"
              } 回の共鳴がありました`}
            </Text>
          </View>
        </View>
      )}

      <View ref={refs.pieceLibraryButtonRef} collapsable={false}>
        <PieceHomeActionCard
          title="閲覧"
          description={
            tutorialSurfaceEnabled && isTutorialMode
              ? "生成したピースや、フォロー中ユーザーのピースを見ながら、ピースの流れを確認できます。"
              : "自分、またはフォロー中のユーザーが生成したピースを閲覧できます。"
          }
          buttonLabel="ピース一覧を開く"
          buttonIconName="open-outline"
          onPress={onOpenPieceLibrary}
          badgeVisible={unreadPieces}
          accessibilityLabel="ピース一覧を開く"
        />
      </View>

      <View style={{ marginTop: 16 }}>
        <PieceHomeActionCard
          title="感情通知"
          description="フォロー中ユーザーの感情入力を確認できます。"
          buttonLabel="感情ログを開く"
          buttonIconName="notifications-outline"
          onPress={onOpenEmotionLog}
          badgeVisible={unreadEmotionLog}
          accessibilityLabel="感情ログを開く"
        />
      </View>

      {tutorialSurfaceEnabled && isTutorialMode ? (
        <View ref={refs.createButtonRef} collapsable={false} style={{ marginTop: 16 }}>
          <PieceHomeActionCard
            title="作成"
            description={`チュートリアルでは「${TUTORIAL_PIECE_QUESTION}」に答えて、ピースを生成する流れを体験できます。`}
            buttonLabel="ピースを生成する"
            buttonIconName="create-outline"
            onPress={onOpenPieceCreate}
            badgeVisible={false}
            accessibilityLabel="ピースを生成する"
          />
        </View>
      ) : null}

      <View style={{ marginTop: 16 }}>
        <PieceHomeActionCard
          title="探す"
          description={
            tutorialSurfaceEnabled && isTutorialMode
              ? "ここから新しいユーザーを探せます。"
              : "新しいユーザーを探すことができます。"
          }
          buttonLabel="新しいユーザーを探す"
          buttonIconName="search-outline"
          onPress={onOpenRecommend}
          accessibilityLabel="新しいユーザーを探す"
        />
      </View>

      <View style={{ marginTop: 16 }}>
        <PieceHomeActionCard
          title="履歴"
          description="共鳴と発見の履歴を確認できます。"
          buttonLabel="履歴を確認する"
          buttonIconName="time-outline"
          onPress={onOpenReactionHistory}
          accessibilityLabel="履歴を確認する"
        />
      </View>
    </ScrollView>
  );
}
