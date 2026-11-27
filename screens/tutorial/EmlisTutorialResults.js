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
import KokoroWeatherTimeline, { WEATHER_EMOTIONS } from "../analysisReport/KokoroWeatherTimeline";
import NexusEmotionLogSection from "../nexus/NexusEmotionLogSection";
import NexusPieceCard from "../nexus/NexusPieceCard";

const DEFAULT_PIECE_THEME = PIECE_LEGACY_THEME_IDS[0];
const ANSWERED_PIECE_TEXT = "先の約束を守れる範囲で、同僚の資料の確認だけを引き受けました。手伝うこともできて、少しほっとしました。";
const RECORD_PIECE_TEXT = "先に約束していた提出に間に合うよう、同僚の資料の確認だけ引き受けた。少しほっとした。";
const FOLLOWED_POST_TEXT = "朝に窓を開けると、空気がひんやりしていました。少しだけ早く起きて、ゆっくりお茶を飲みました。";
const FOLLOWED_PERSON = "かれん";
const PIECE_LABEL = "資料の確認だけを引き受けた日";
const OWN_POST = {
  source_type: "piece_v2",
  owner: { display_name: "自分" },
  created_at: "2026-11-26T10:00:00+09:00",
  metrics: { resonances: 0 },
};
const FOLLOWED_POST = {
  source_type: "piece_v2",
  owner: { display_name: FOLLOWED_PERSON },
  body: FOLLOWED_POST_TEXT,
  created_at: "2026-11-26T08:15:00+09:00",
  metrics: { resonances: 0 },
};
const TUTORIAL_FEED_TABS = [
  { id: "posts", label: "投稿" },
  { id: "notifications", label: "感情通知" },
];
const SAMPLE_EMOTION_LOG = {
  items: [{
    id: "tutorial-followed-emotion",
    ownerName: FOLLOWED_PERSON,
    timeLabel: "11/26 08:10",
    items: [{ type: "平穏", strength: "medium" }],
  }],
};

const SAMPLE_DATE = "2026-11-26";
const SAMPLE_RECORD = { created_at: `${SAMPLE_DATE}T10:00:00+09:00`, emotions: [{ key: "calm", weight: 1 }] };
const SAMPLE_CHART_RECORDS = [
  { created_at: "2026-11-23T08:40:00+09:00", emotions: [{ key: "joy", weight: 2 }] },
  { created_at: "2026-11-25T17:20:00+09:00", emotions: [{ key: "anxiety", weight: 2 }, { key: "calm", weight: 1 }] },
  SAMPLE_RECORD,
];

function sampleChartAggregate(records) {
  const weights = Object.fromEntries(WEATHER_EMOTIONS.map(({ key }) => [key, 0]));
  for (const record of records) {
    for (const { key, weight } of record.emotions) {
      weights[key] += weight;
    }
  }
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  return {
    input_count: records.length,
    records,
    emotion_weights: weights,
    emotion_share_pct: Object.fromEntries(
      Object.entries(weights).map(([key, weight]) => [key, totalWeight ? Math.round(weight * 100 / totalWeight) : 0])
    ),
    status: records.length ? "ok" : "no_observation",
  };
}

function sampleChartPeriod(firstDay, lastDay) {
  const items = Array.from({ length: lastDay - firstDay + 1 }, (_, offset) => {
    const day = firstDay + offset;
    const date = `2026-11-${String(day).padStart(2, "0")}`;
    return { date, ...sampleChartAggregate(SAMPLE_CHART_RECORDS.filter(record => record.created_at.startsWith(date))) };
  });
  return {
    start_date: items[0].date,
    end_date: items[items.length - 1].date,
    items,
    summary: {
      ...sampleChartAggregate(items.flatMap(item => item.records)),
      recorded_days: items.filter(item => item.input_count).length,
    },
  };
}

const SAMPLE_CHART = {
  today: {
    ...sampleChartPeriod(26, 26),
    time_buckets: [
      { key: "early", label: "深夜", hours: "0:00–6:00", ...sampleChartAggregate([]) },
      { key: "morning", label: "朝", hours: "6:00–12:00", ...sampleChartAggregate([SAMPLE_RECORD]) },
      { key: "afternoon", label: "昼", hours: "12:00–18:00", ...sampleChartAggregate([]) },
      { key: "night", label: "夜", hours: "18:00–24:00", ...sampleChartAggregate([]) },
    ],
  },
  week: sampleChartPeriod(23, 29),
  month: sampleChartPeriod(1, 30),
};

function PieceImagePreview({ themeId, text, styles }) {
  const palette = PIECE_THEME_COLORS[themeId];
  return (
    <View
      testID="emlis-tutorial-piece-preview"
      style={[styles.pieceCanvas, { backgroundColor: palette.canvas, borderColor: palette.border }]}
    >
      <View style={[styles.pieceSheet, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Text style={[styles.pieceText, { color: palette.text }]}>{text}</Text>
        <Text style={[styles.pieceBrand, { color: palette.branding }]}>Emlis</Text>
      </View>
    </View>
  );
}

export default function EmlisTutorialResults({ stage, onAdvance, includeAnswer }) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => makeStyles(colors, ui), [colors, ui]);
  const [pieceTheme, setPieceTheme] = useState(DEFAULT_PIECE_THEME);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [savedPiece, setSavedPiece] = useState(null);
  const [libraryScreen, setLibraryScreen] = useState("entry");
  const [imagePreviewed, setImagePreviewed] = useState(false);
  const [postConfirmationOpen, setPostConfirmationOpen] = useState(false);
  const [notificationPreview, setNotificationPreview] = useState("unopened");
  const [chartPeriod, setChartPeriod] = useState("today");
  const [selectedDay, setSelectedDay] = useState(null);
  const [mapDiagram, setMapDiagram] = useState("unopened");
  const pieceText = includeAnswer ? ANSWERED_PIECE_TEXT : RECORD_PIECE_TEXT;
  const differentTheme = pieceTheme !== DEFAULT_PIECE_THEME;
  const notificationsOpen = notificationPreview === "open";
  const weekOpen = chartPeriod === "week";
  const sampleDayOpened = selectedDay === SAMPLE_DATE;
  const mapOpen = mapDiagram === "open";

  if (stage === "piece") {
    return (
      <View style={styles.stage}>
        <Text accessibilityRole="header" style={styles.title}>ピースの作成</Text>
        <Text accessibilityLiveRegion="polite" style={styles.instruction}>
          {differentTheme
            ? `「${PIECE_THEME_LABELS[pieceTheme]}」に変わりました。「保存」を押すと、自分のピースに残せます。`
            : paletteOpen
              ? "別の配色を選んで、プレビューの変化を見てみましょう。"
              : "「配色」を押して、記録を残す一枚の見た目を変えてみましょう。"}
        </Text>
        <CocolonButton
          variant="secondary"
          onPress={() => setPaletteOpen(!paletteOpen)}
          accessibilityState={{ expanded: paletteOpen }}
          testID="emlis-tutorial-open-palette"
        >
          配色
        </CocolonButton>
        {paletteOpen ? (
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
        ) : null}
        <PieceImagePreview themeId={pieceTheme} text={pieceText} styles={styles} />
        <CocolonButton testID="emlis-tutorial-save-piece" disabled={!differentTheme} onPress={() => {
          setSavedPiece({ themeId: pieceTheme, text: pieceText });
          setLibraryScreen("entry");
          setImagePreviewed(false);
          setPostConfirmationOpen(false);
          setNotificationPreview("unopened");
          setChartPeriod("today");
          setSelectedDay(null);
          setMapDiagram("unopened");
          onAdvance();
        }}>
          保存
        </CocolonButton>
      </View>
    );
  }

  if (stage === "library") {
    return (
      <View style={styles.stage}>
        <Text accessibilityRole="header" style={styles.title}>保存したピース</Text>
        {libraryScreen === "entry" ? (
          <>
            <Text style={styles.instruction}>保存できました。「ピース」→「自分のピースを開く」で見返せます。</Text>
            <CocolonButton testID="emlis-tutorial-open-library" onPress={() => setLibraryScreen("list")}>
              自分のピースを開く
            </CocolonButton>
          </>
        ) : libraryScreen === "list" ? (
          <>
            <Text style={styles.instruction}>いま保存したピースを押して開きましょう。</Text>
            <CocolonPressable
              style={styles.savedRow}
              onPress={() => setLibraryScreen("detail")}
              testID="emlis-tutorial-open-library-piece"
            >
              <Ionicons name="image-outline" size={24} color={colors.TITLE_GOLD} accessible={false} />
              <View style={styles.rowText}>
                <Text style={styles.heading}>{PIECE_LABEL}</Text>
                <Text style={styles.caption}>非公開</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.TITLE_GOLD} accessible={false} />
            </CocolonPressable>
          </>
        ) : (
          <>
            <Text style={styles.instruction}>対応端末では「画像を保存」で写真に残せます。Emlisで分け合うときは「アプリ内に投稿する」を押します。</Text>
            <PieceImagePreview themeId={savedPiece.themeId} text={savedPiece.text} styles={styles} />
            <CocolonButton
              variant="secondary"
              testID="emlis-tutorial-image-preview"
              onPress={() => setImagePreviewed(true)}
            >
              画像を保存
            </CocolonButton>
            {imagePreviewed ? (
              <Text accessibilityLiveRegion="polite" style={styles.caption}>練習では写真に保存されません。</Text>
            ) : null}
            {postConfirmationOpen ? (
              <View style={styles.card} testID="emlis-tutorial-post-confirmation">
                <Text accessibilityRole="header" style={styles.heading}>アプリ内に投稿しますか？</Text>
                <Text style={styles.body}>実際の投稿は、ピースの公開を許可したフォロワーが見られます。</Text>
                <CocolonButton testID="emlis-tutorial-practice-post" onPress={() => {
                  setPostConfirmationOpen(false);
                  onAdvance();
                }}>
                  投稿する
                </CocolonButton>
                <CocolonButton variant="secondary" onPress={() => setPostConfirmationOpen(false)}>キャンセル</CocolonButton>
              </View>
            ) : (
              <CocolonButton testID="emlis-tutorial-open-post" onPress={() => setPostConfirmationOpen(true)}>
                アプリ内に投稿する
              </CocolonButton>
            )}
          </>
        )}
      </View>
    );
  }

  if (stage === "post") {
    return (
      <View style={styles.stage}>
        <Text accessibilityRole="header" style={styles.title}>ピース</Text>
        <Text accessibilityLiveRegion="polite" style={styles.instruction}>
          {notificationsOpen
            ? "相手の感情通知をオンにすると、フォロー中の人が感情を記録したときに、あなたに公開した感情通知が届きます。"
            : notificationPreview === "unopened"
              ? "練習の投稿が加わりました。次は「感情通知」を押してみましょう。"
              : "投稿と感情通知を見られました。次は「分析」を開きましょう。"}
        </Text>
        <View style={styles.feedTabs}>
          {TUTORIAL_FEED_TABS.map(({ id, label }) => {
            const opensNotifications = id === "notifications";
            const selected = opensNotifications === notificationsOpen;
            return (
              <CocolonPressable
                key={id}
                containerStyle={styles.feedTabContainer}
                style={[styles.feedTab, selected && styles.feedTabSelected]}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                testID={`emlis-tutorial-tab-${id}`}
                onPress={() => setNotificationPreview((current) => (
                  opensNotifications ? "open" : current === "open" ? "seen" : current
                ))}
              >
                <Text style={[styles.label, styles.feedTabText, selected && styles.feedTabTextSelected]}>{label}</Text>
              </CocolonPressable>
            );
          })}
        </View>
        {notificationsOpen ? (
          <>
            <View style={styles.card} testID="emlis-tutorial-notification-feed">
              <NexusEmotionLogSection emotionLogState={SAMPLE_EMOTION_LOG} styles={styles} colors={colors} ui={ui} />
            </View>
            <Text style={styles.caption}>ホームの「今回だけ感情通知を送らない」で、その記録の通知を止められます。</Text>
            <Text style={styles.instruction}>ここで、かれんが記録した感情・強さ・時刻を確認できます。「分析」を押して、自分の記録を振り返りましょう。</Text>
          </>
        ) : (
          <View testID="emlis-tutorial-post-feed">
            <Text style={[styles.caption, styles.feedExplanation]}>自分が投稿したピースと、フォロー中の人があなたに公開したピースを読めます。</Text>
            {savedPiece ? <NexusPieceCard item={{ ...OWN_POST, body: savedPiece.text }} /> : null}
            <NexusPieceCard item={FOLLOWED_POST} />
          </View>
        )}
        <CocolonButton
          testID="emlis-tutorial-open-chart"
          disabled={notificationPreview === "unopened"}
          onPress={onAdvance}
        >
          分析
        </CocolonButton>
      </View>
    );
  }

  if (stage === "chart") {
    return (
      <View style={styles.stage}>
        <Text accessibilityRole="header" style={styles.title}>こころグラフ</Text>
        <Text accessibilityLiveRegion="polite" style={styles.instruction}>
          {weekOpen
            ? sampleDayOpened
              ? "練習で選んだ「平穏・弱」が見つかりました。次は「わたしマップ」を開きましょう。"
              : "「26」を押して、練習で記録した気持ちを見つけましょう。"
            : "「週」を押すと、その週の気持ちを日ごとに比べられます。"}
        </Text>
        <KokoroWeatherTimeline
          colors={colors}
          ui={ui}
          period={chartPeriod}
          onPeriodChange={(period) => {
            setChartPeriod(period);
            setSelectedDay(null);
          }}
          selectedDate={selectedDay}
          onDateSelect={setSelectedDay}
          requireDateSelection
          sampleData={SAMPLE_CHART[chartPeriod]}
          testIDPrefix="emlis-tutorial-chart"
        />
        <CocolonButton testID="emlis-tutorial-open-map" disabled={!weekOpen || !sampleDayOpened} onPress={onAdvance}>
          わたしマップ
        </CocolonButton>
      </View>
    );
  }

  if (stage === "map") {
    return (
      <View style={styles.stage}>
        <Text accessibilityRole="header" style={styles.title}>わたしマップ</Text>
        <Text accessibilityLiveRegion="polite" style={styles.instruction}>
          {mapDiagram === "unopened"
            ? "わたしマップは、記録をつないで自分の選び方を振り返れます。「関係する部分を図で見る」を押してみましょう。"
            : "ふたつの記録に共通する選び方が見えました。「まとめを見る」で、練習した操作を振り返りましょう。"}
        </Text>
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
            <>
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
              <Text style={styles.caption}>別の日も、締め切りに間に合うよう連絡は断り、資料の確認だけを申し出ていました。</Text>
            </>
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
    instruction: {
      ...ui.typography.body, color: ui.text.primary, borderLeftWidth: 3,
      borderLeftColor: colors.TITLE_GOLD, paddingVertical: 6, paddingLeft: 12,
    },
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
    rowText: { flex: 1 },
    savedRow: {
      flexDirection: "row", alignItems: "center", gap: 10, minHeight: 56, padding: 14,
      borderWidth: 1, borderColor: colors.CARD_BORDER, borderRadius: ui.radius.lg,
      backgroundColor: colors.FIELD_BG,
    },
    feedExplanation: { marginBottom: 12 },
    feedTabs: {
      flexDirection: "row", gap: 4, padding: 4, borderWidth: 1,
      borderColor: colors.CARD_BORDER, borderRadius: ui.radius.card, backgroundColor: colors.FIELD_BG,
    },
    feedTabContainer: { flex: 1, minWidth: 0 },
    feedTab: { alignItems: "center", justifyContent: "center", minHeight: 48, padding: 8, borderRadius: ui.radius.xl },
    feedTabSelected: { backgroundColor: colors.GOLD_BUTTON },
    feedTabText: { textAlign: "center" },
    feedTabTextSelected: { color: colors.ACCENT_TEXT },
    emotionLogRow: { gap: 10, paddingTop: 12, borderTopWidth: 1, borderColor: colors.CARD_BORDER },
    emotionLogHeaderRow: { gap: 4 },
    emotionLogName: { ...ui.typography.body, color: colors.TEXT_ON_LIGHT },
    emotionLogTime: { ...ui.typography.meta, color: colors.TEXT_SUBTLE },
    emotionLogBadgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    emotionLogBadge: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: ui.radius.pill },
    emotionLogBadgeText: { ...ui.typography.description },
    mapToggle: { flexDirection: "row", alignItems: "center", gap: 8, minHeight: 44 },
    mapPath: { gap: 4, alignItems: "center" },
    mapNode: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: ui.radius.md, backgroundColor: colors.SURFACE_TONAL },
  });
}
