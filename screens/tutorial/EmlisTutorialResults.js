import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonButton from "../../components/CocolonButton";
import CocolonPressable from "../../components/CocolonPressable";
import {
  PIECE_LEGACY_THEME_IDS,
  PIECE_THEME_COLORS,
  PIECE_THEME_LABELS,
} from "../../features/piece/piecePalette";
import { useTheme } from "../../theme/ThemeContext";
import { makeUiTokens } from "../../ui/uiTokens";

const DEFAULT_PIECE_THEME = PIECE_LEGACY_THEME_IDS[0];
const PIECE_TEXT = "先の約束を守れる範囲で、同僚の資料の確認だけを引き受けました。手伝うこともできて、少しほっとしました。";
const FOLLOWED_POST_TEXT = "朝に窓を開けると、空気がひんやりしていました。少しだけ早く起きて、ゆっくりお茶を飲みました。";

const CHART_EMOTIONS = {
  joy: { label: "喜び", color: "#D4AA45" },
  anxiety: { label: "不安", color: "#AA92B5" },
  calm: { label: "平穏", color: "#809D85" },
};
const CHART_DAYS = [
  { day: 23, weekday: "月", emotions: [{ key: "joy", weight: 2 }] },
  { day: 24, weekday: "火", emotions: [] },
  { day: 25, weekday: "水", emotions: [{ key: "anxiety", weight: 2 }, { key: "calm", weight: 1 }] },
  { day: 26, weekday: "木", emotions: [{ key: "calm", weight: 2 }] },
  { day: 27, weekday: "金", emotions: [] },
  { day: 28, weekday: "土", emotions: [] },
  { day: 29, weekday: "日", emotions: [] },
];
const STRENGTH_LABELS = { 1: "弱", 2: "中", 3: "強" };

function PieceImagePreview({ themeId, styles }) {
  const palette = PIECE_THEME_COLORS[themeId];
  return (
    <View
      testID="emlis-tutorial-piece-preview"
      style={[styles.pieceCanvas, { backgroundColor: palette.canvas, borderColor: palette.border }]}
    >
      <View style={[styles.pieceSheet, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Text style={[styles.pieceText, { color: palette.text }]}>{PIECE_TEXT}</Text>
        <Text style={[styles.pieceBrand, { color: palette.branding }]}>Emlis</Text>
      </View>
    </View>
  );
}

function ExamplePost({ name, text, styles, color }) {
  return (
    <View style={styles.post}>
      <View style={styles.row}>
        <Ionicons name="person-circle-outline" size={22} color={color} accessible={false} />
        <Text style={styles.label}>{name}</Text>
      </View>
      <Text style={styles.body}>{text}</Text>
    </View>
  );
}

function TutorialChart({ styles, selectedDay, setSelectedDay }) {
  return (
    <View style={styles.card}>
      <Text accessibilityRole="header" style={styles.heading}>この週の感情</Text>
      <Text style={styles.caption}>練習用の記録です。日をタップして、その日の内訳を開いてみましょう。</Text>
      <View style={styles.plot}>
        {CHART_DAYS.map((entry) => {
          const { day, weekday, emotions } = entry;
          const selected = selectedDay?.day === day;
          const weights = emotions.reduce((sum, emotion) => sum + emotion.weight, 0);
          return (
            <CocolonPressable
              key={day}
              containerStyle={styles.dayContainer}
              style={[styles.day, selected && styles.daySelected]}
              onPress={() => setSelectedDay(entry)}
              accessibilityLabel={`11月${day}日、${emotions.length ? "1件の入力" : "記録なし"}`}
              accessibilityState={{ selected }}
              testID={`emlis-tutorial-chart-day-${day}`}
            >
              <View style={[styles.bar, !weights && styles.emptyBar]}>
                {emotions.map(({ key, weight }) => (
                  <View
                    key={key}
                    style={{
                      height: `${(weight / weights) * 100}%`,
                      backgroundColor: CHART_EMOTIONS[key].color,
                    }}
                  />
                ))}
              </View>
              <Text accessible={false} style={styles.weekday}>{weekday}</Text>
              <Text accessible={false} style={[styles.date, selected && styles.selectedDate]}>{day}</Text>
            </CocolonPressable>
          );
        })}
      </View>
      <View style={styles.legend}>
        {Object.entries(CHART_EMOTIONS).map(([key, { label, color }]) => (
          <View key={key} style={styles.row}>
            <View style={[styles.dot, { backgroundColor: color }]} />
            <Text style={styles.caption}>{label}</Text>
          </View>
        ))}
      </View>
      {selectedDay ? (
        <View style={styles.inlineCard} accessibilityLiveRegion="polite" testID="emlis-tutorial-chart-detail">
          <Text accessibilityRole="header" style={styles.label}>{`11月${selectedDay.day}日の記録`}</Text>
          <Text style={styles.body}>
            {selectedDay.emotions.length
              ? selectedDay.emotions.map(({ key, weight }) => `${CHART_EMOTIONS[key].label}・${STRENGTH_LABELS[weight]}`).join("　")
              : "記録なし"}
          </Text>
        </View>
      ) : null}
      <Text style={styles.caption}>色の割合は、記録した感情とその強さから集計します。</Text>
    </View>
  );
}

export default function EmlisTutorialResults({ stage, onAdvance }) {
  const { colors, themeName } = useTheme();
  const styles = useMemo(() => makeStyles(colors, makeUiTokens(colors, themeName)), [colors, themeName]);
  const [pieceTheme, setPieceTheme] = useState(DEFAULT_PIECE_THEME);
  const [savedPieceTheme, setSavedPieceTheme] = useState(DEFAULT_PIECE_THEME);
  const [libraryPreview, setLibraryPreview] = useState("unopened");
  const [practicePost, setPracticePost] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [mapDiagram, setMapDiagram] = useState("unopened");
  const libraryOpen = libraryPreview === "open";
  const mapOpen = mapDiagram === "open";

  if (stage === "piece") {
    return (
      <View style={styles.stage}>
        <Text accessibilityRole="header" style={styles.title}>ピースの作成</Text>
        <Text style={styles.body}>練習の記録を、読み返せる一枚に整えました。背景を選ぶと、その場で見た目が変わります。</Text>
        <PieceImagePreview themeId={pieceTheme} styles={styles} />
        <Text style={styles.label}>背景</Text>
        <View style={styles.swatchRow}>
          {PIECE_LEGACY_THEME_IDS.map((themeId) => {
            const selected = pieceTheme === themeId;
            return (
              <CocolonPressable
                key={themeId}
                containerStyle={styles.swatchContainer}
                style={[styles.swatch, selected && styles.selectedSwatch]}
                accessibilityRole="radio"
                accessibilityLabel={PIECE_THEME_LABELS[themeId]}
                accessibilityState={{ checked: selected }}
                onPress={() => setPieceTheme(themeId)}
                testID={`emlis-tutorial-piece-theme-${themeId}`}
              >
                <View style={[
                  styles.swatchDot,
                  { backgroundColor: PIECE_THEME_COLORS[themeId].surface, borderColor: colors.CARD_BORDER },
                ]} />
                <Text style={styles.label}>{PIECE_THEME_LABELS[themeId]}</Text>
              </CocolonPressable>
            );
          })}
        </View>
        <CocolonButton testID="emlis-tutorial-save-piece" onPress={() => {
          setSavedPieceTheme(pieceTheme);
          onAdvance();
        }}>
          非公開で保存する
        </CocolonButton>
      </View>
    );
  }

  if (stage === "library") {
    return (
      <View style={styles.stage}>
        <Text accessibilityRole="header" style={styles.title}>保存したピース</Text>
        <Text style={styles.body}>非公開で保存したピースは、自分だけが読めます。</Text>
        <CocolonPressable
          style={styles.savedRow}
          onPress={() => setLibraryPreview(libraryOpen ? "seen" : "open")}
          accessibilityLabel={libraryOpen ? "練習のピースを閉じる" : "練習のピースを開く"}
          accessibilityState={{ expanded: libraryOpen }}
          testID="emlis-tutorial-open-library-piece"
        >
          <Ionicons name="image-outline" size={26} color={colors.TITLE_GOLD} accessible={false} />
          <View style={styles.rowText}>
            <Text style={styles.heading}>自分のピースを開く</Text>
            <Text style={styles.caption}>練習のピース・非公開</Text>
          </View>
          <Ionicons name={libraryOpen ? "chevron-up" : "chevron-down"} size={20} color={colors.TITLE_GOLD} accessible={false} />
        </CocolonPressable>
        {libraryOpen ? <PieceImagePreview themeId={savedPieceTheme} styles={styles} /> : null}
        <CocolonButton testID="emlis-tutorial-open-post" disabled={libraryPreview === "unopened"} onPress={onAdvance}>
          投稿の見え方を試す
        </CocolonButton>
      </View>
    );
  }

  if (stage === "post") {
    return (
      <View style={styles.stage}>
        <Text accessibilityRole="header" style={styles.title}>ピースの投稿</Text>
        <Text style={styles.body}>
          投稿した本文は、あなたと、あなたが公開を許可したフォロワーに表示されます。
        </Text>
        <Text style={styles.caption}>気になる人をフォローすると、その人があなたに公開している投稿をここで読めます。</Text>
        {!practicePost ? (
          <CocolonButton variant="secondary" testID="emlis-tutorial-practice-post" onPress={() => setPracticePost(true)}>
            練習で投稿する
          </CocolonButton>
        ) : (
          <Text accessibilityLiveRegion="polite" style={styles.caption}>
            練習のピースが、この見本の一覧に加わりました。
          </Text>
        )}
        <View style={styles.card} testID="emlis-tutorial-post-feed">
          <Text accessibilityRole="header" style={styles.heading}>投稿の見本</Text>
          {practicePost ? <ExamplePost name="自分の投稿（練習）" text={PIECE_TEXT} styles={styles} color={colors.TITLE_GOLD} /> : null}
          <ExamplePost name="フォロー中の人（見本）" text={FOLLOWED_POST_TEXT} styles={styles} color={colors.TITLE_GOLD} />
        </View>
        <CocolonButton testID="emlis-tutorial-open-chart" disabled={!practicePost} onPress={onAdvance}>
          分析を見てみる
        </CocolonButton>
      </View>
    );
  }

  if (stage === "chart") {
    return (
      <View style={styles.stage}>
        <Text accessibilityRole="header" style={styles.title}>こころグラフ</Text>
        <TutorialChart styles={styles} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
        <CocolonButton testID="emlis-tutorial-open-map" disabled={!selectedDay} onPress={onAdvance}>
          わたしマップを見る
        </CocolonButton>
      </View>
    );
  }

  if (stage === "map") {
    return (
      <View style={styles.stage}>
        <Text accessibilityRole="header" style={styles.title}>わたしマップ</Text>
        <Text style={styles.body}>記録から見えてきた、自分の選び方を振り返れます。</Text>
        <Text style={styles.caption}>別の日の記録「提出に間に合わなくなるので、連絡は断り、資料の確認だけ申し出た。」</Text>
        <View style={styles.card}>
          <Text accessibilityRole="header" style={styles.heading}>先の約束を守れる範囲</Text>
          <Text style={styles.body}>同僚を手伝うときは、先の約束を守れる範囲を選んでいます。</Text>
          <CocolonPressable
            style={styles.mapToggle}
            onPress={() => setMapDiagram(mapOpen ? "seen" : "open")}
            accessibilityState={{ expanded: mapOpen }}
            testID="emlis-tutorial-map-toggle"
          >
            <Ionicons name="git-network-outline" size={18} color={colors.TITLE_GOLD} accessible={false} />
            <Text style={styles.action}>{mapOpen ? "図を閉じる" : "関係する部分を図で見る"}</Text>
          </CocolonPressable>
          {mapOpen ? (
            <View
              accessible
              accessibilityLabel="先の約束を守れるかを確かめ、引き受ける範囲を選ぶ"
              testID="emlis-tutorial-map-diagram"
              style={styles.mapPath}
            >
              <View style={styles.mapNode}><Text style={styles.label}>先の約束を守る</Text></View>
              <Ionicons name="arrow-down" size={20} color={colors.TITLE_GOLD} accessible={false} />
              <View style={styles.mapNode}><Text style={styles.label}>手伝う範囲を選ぶ</Text></View>
            </View>
          ) : null}
        </View>
        <CocolonButton testID="emlis-tutorial-open-summary" disabled={mapDiagram === "unopened"} onPress={onAdvance}>
          まとめを見る
        </CocolonButton>
      </View>
    );
  }

  return null;
}

function makeStyles(colors, ui) {
  return StyleSheet.create({
    stage: { gap: 14 },
    title: { ...ui.typography.screenTitle, color: colors.TITLE_GOLD },
    body: { ...ui.typography.body, color: colors.TEXT_ON_LIGHT, flexShrink: 1 },
    caption: { ...ui.typography.description, color: colors.TEXT_SUBTLE, flexShrink: 1 },
    heading: { ...ui.typography.sectionTitle, color: colors.TITLE_GOLD, flexShrink: 1 },
    label: { ...ui.typography.button, color: colors.TEXT_ON_LIGHT, flexShrink: 1 },
    action: { ...ui.typography.button, color: colors.TITLE_GOLD, flexShrink: 1 },
    card: {
      gap: 12, padding: 16, borderWidth: 1, borderRadius: ui.radius.card,
      borderColor: colors.CARD_BORDER, backgroundColor: colors.FIELD_BG,
    },
    pieceCanvas: { width: "100%", alignSelf: "center", maxWidth: 382, borderWidth: 1, borderRadius: 22, padding: 14 },
    pieceSheet: { minHeight: 180, justifyContent: "space-between", borderWidth: 1, borderRadius: 15, padding: 20, gap: 18 },
    pieceText: { ...ui.typography.body },
    pieceBrand: { ...ui.typography.sectionTitle },
    swatchRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    swatchContainer: { flexGrow: 1, flexBasis: 124 },
    swatch: {
      flexDirection: "row", alignItems: "center", gap: 8, minHeight: 48, padding: 8,
      borderWidth: 1, borderColor: colors.CARD_BORDER, borderRadius: ui.radius.md,
      backgroundColor: colors.FIELD_BG,
    },
    selectedSwatch: { borderColor: colors.TITLE_GOLD, backgroundColor: colors.SURFACE_TONAL },
    swatchDot: { width: 18, height: 18, borderRadius: 9, borderWidth: 1 },
    row: { flexDirection: "row", alignItems: "center", gap: 8 },
    rowText: { flex: 1 },
    savedRow: {
      flexDirection: "row", alignItems: "center", gap: 10, minHeight: 56, padding: 14,
      borderWidth: 1, borderColor: colors.CARD_BORDER, borderRadius: ui.radius.lg,
      backgroundColor: colors.FIELD_BG,
    },
    post: { gap: 6, borderTopWidth: 1, borderColor: colors.CARD_BORDER, paddingTop: 12 },
    plot: { flexDirection: "row", alignItems: "flex-end" },
    dayContainer: { flex: 1, minWidth: 0 },
    day: { alignItems: "center", paddingVertical: 8, borderRadius: ui.radius.sm, gap: 4 },
    daySelected: { backgroundColor: colors.SURFACE_TONAL },
    bar: { width: "55%", maxWidth: 24, height: 72, borderRadius: 4, overflow: "hidden", flexDirection: "column-reverse" },
    emptyBar: { borderWidth: 1, borderColor: colors.CARD_BORDER, borderStyle: "dashed" },
    weekday: { ...ui.typography.meta, color: colors.TEXT_SUBTLE },
    date: { ...ui.typography.meta, color: colors.TEXT_SUBTLE },
    selectedDate: { color: colors.ON_SURFACE_TONAL, fontWeight: "700" },
    legend: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    dot: { width: 9, height: 9, borderRadius: 5 },
    inlineCard: { backgroundColor: colors.SURFACE_TONAL, borderRadius: ui.radius.md, padding: 10, gap: 3 },
    mapToggle: { flexDirection: "row", alignItems: "center", gap: 8, minHeight: 44 },
    mapPath: { gap: 4, alignItems: "center" },
    mapNode: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: ui.radius.md, backgroundColor: colors.SURFACE_TONAL },
  });
}
