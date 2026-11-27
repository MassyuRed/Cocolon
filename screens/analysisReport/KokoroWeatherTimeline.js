import React, { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import Ionicons from "react-native-vector-icons/Ionicons";
import CocolonPressable from "../../components/CocolonPressable";
import { useKokoroWeather } from "../analysis/useKokoroWeather";
import { applyTypographyTokens } from "../../ui/applyTypographyTokens";
import { EMOTION_COLORS as WEATHER_EMOTIONS } from "../../ui/emotionColors";
import KokoroWeatherPeriodChart from "./KokoroWeatherPeriodChart";

const PERIODS = [{ key: "today", label: "今日" }, { key: "week", label: "週" }, { key: "month", label: "月" }];
const shortDate = value => `${Number(value?.slice(5, 7))}/${Number(value?.slice(8, 10))}`;
const strength = weight => ({ 1: "弱", 2: "中", 3: "強" }[weight] || `${weight}`);
const emptyLabel = item => item?.status === "future" ? "これから" : item?.status === "outside_history" ? "閲覧範囲外" : "記録なし";
const mayViewDay = item => item?.status !== "future" && item?.status !== "outside_history";

function WeatherRing({ item, size = 130, colors, styles, compact = false }) {
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = WEATHER_EMOTIONS.reduce((sum, emotion) => sum + (item?.emotion_weights?.[emotion.key] || 0), 0);
  let offset = 0;
  return <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={StyleSheet.absoluteFill} accessible={false}>
      <Circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={colors.CARD_BORDER} strokeWidth={14} />
      <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
        {WEATHER_EMOTIONS.map(emotion => {
          const weight = item?.emotion_weights?.[emotion.key] || 0;
          if (!weight || !total) return null;
          const length = weight / total * circumference;
          const segment = <Circle key={emotion.key} cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={emotion.color}
            strokeWidth={14} strokeDasharray={`${length} ${circumference - length}`} strokeDashoffset={-offset} />;
          offset += length;
          return segment;
        })}
      </G>
    </Svg>
    <Text style={compact ? styles.bandCount : styles.count}>{item?.input_count || (compact ? "—" : "0")}</Text>
    {!compact ? <Text style={styles.meta}>件の入力</Text> : null}
  </View>;
}

function Legend({ item, styles }) {
  return <View style={styles.legend}>
    {WEATHER_EMOTIONS.map(emotion => <View key={emotion.key} style={styles.legendRow}>
      <View style={[styles.dot, { backgroundColor: emotion.color }]} />
      <Text style={styles.body}>{emotion.label}</Text>
      {item ? <Text style={styles.percent}>{item.emotion_share_pct?.[emotion.key] || 0}%</Text> : null}
    </View>)}
  </View>;
}

export default function KokoroWeatherTimeline({
  colors, ui, refreshRevision = 0, period: controlledPeriod, onPeriodChange, sampleData, active = true,
  selectedDate, onDateSelect, requireDateSelection = false, testIDPrefix,
}) {
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const [localPeriod, setPeriod] = useState("today");
  const period = controlledPeriod || localPeriod;
  const [anchor, setAnchor] = useState(null);
  const [localSelection, setSelection] = useState(null);
  const selection = period !== "today" && selectedDate !== undefined ? selectedDate : localSelection;
  const isSample = sampleData !== undefined;
  const live = useKokoroWeather(period, anchor, refreshRevision, !isSample, active);
  const { data, loading, error, retry } = isSample ? { data: sampleData } : live;
  const selectPeriod = next => { setPeriod(next); setAnchor(null); setSelection(null); onPeriodChange?.(next); };
  const selectDate = date => {
    setSelection(date);
    onDateSelect?.(date);
  };
  const move = next => { if (next) { setAnchor(next); setSelection(null); } };
  const isDay = period === "today";
  // Keep the selected-day read keyed to the same date while Analysis is hidden.
  // The authorized snapshot is only used for the selection; rendering still follows data.
  const selectionData = isSample ? data : live.cachedData ?? data;
  const items = (isDay ? selectionData?.time_buckets : selectionData?.items) || [];
  const selectable = isDay ? items : items.filter(mayViewDay);
  const newestFirst = [...selectable].reverse();
  const selected = selectable.find(item => (item.key || item.date) === selection) ||
    (isDay ? newestFirst.find(mayViewDay) : requireDateSelection ? undefined :
      newestFirst.find(item => item.input_count > 0) || newestFirst[0]);
  const selectedIndex = selectable.indexOf(selected);
  // Weekly and monthly responses only return aggregates. The daily endpoint
  // supplies the original timestamps and strengths under the same access rules.
  const selectedDateForRead = !isSample && !isDay && selected?.input_count > 0 ? selected.date : null;
  const detail = useKokoroWeather("today", selectedDateForRead, refreshRevision, !!selectedDateForRead, active);
  const detailMatchesDay = !!selectedDateForRead && detail.data?.start_date === selectedDateForRead &&
    detail.data?.end_date === selectedDateForRead;
  const detailItem = detailMatchesDay ? detail.data.summary : selected;
  const detailRecords = detailMatchesDay ? detail.data.time_buckets.flatMap(bucket => bucket.records)
    .sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at)) :
    !selectedDateForRead ? selected?.records || [] : [];
  const periodTitle = period === "today" ? (anchor ? "この日の感情" : "今日の感情") : period === "week" ? "この週のこころグラフ" : "この月のこころグラフ";
  const range = data ? (period === "month" ? `${data.start_date.slice(0, 4)}年${Number(data.start_date.slice(5, 7))}月` : `${data.start_date.slice(0, 4)}年 ${shortDate(data.start_date)}${period === "week" ? `–${shortDate(data.end_date)}` : ""}`) : "";
  if (!active) return null;
  return <View style={styles.root}>
    <View style={styles.periodRow}>
      <View style={styles.tabs}>{PERIODS.map(item => <CocolonPressable key={item.key} onPress={() => selectPeriod(item.key)}
        style={[styles.tab, item.key === period && styles.activeTab]} accessibilityRole="tab" accessibilityLabel={item.label} accessibilityState={{ selected: item.key === period }}
        testID={testIDPrefix ? `${testIDPrefix}-period-${item.key}` : undefined}>
        <Text style={[styles.tabText, item.key === period && styles.activeText]}>{item.label}</Text>
      </CocolonPressable>)}</View>
      {data && !isSample ? <View style={styles.rangeRow}>
        <CocolonPressable onPress={() => move(data.previous_anchor)} disabled={!data.previous_anchor} style={styles.arrow} accessibilityLabel="前の期間" accessibilityState={{ disabled: !data.previous_anchor }}>
          <Ionicons name="chevron-back" size={19} color={data.previous_anchor ? colors.TITLE_GOLD : colors.TEXT_SUBTLE} />
        </CocolonPressable>
        <Text style={styles.meta}>{range}</Text>
        <CocolonPressable onPress={() => move(data.next_anchor)} disabled={!data.next_anchor} style={styles.arrow} accessibilityLabel="次の期間" accessibilityState={{ disabled: !data.next_anchor }}>
          <Ionicons name="chevron-forward" size={19} color={data.next_anchor ? colors.TITLE_GOLD : colors.TEXT_SUBTLE} />
        </CocolonPressable>
      </View> : null}
    </View>
    {loading ? <View style={styles.card}><ActivityIndicator color={colors.TITLE_GOLD} /><Text style={styles.note}>感情の記録を読み込んでいます</Text></View> : error ?
      <View style={styles.card}><Text style={styles.body}>こころグラフを読み込めませんでした。</Text><CocolonPressable onPress={retry} style={styles.retry} accessibilityRole="button"><Text style={styles.link}>もう一度読み込む</Text></CocolonPressable></View> : data ? <>
        <View style={styles.card}>
          <View style={styles.heading}><View style={styles.headingText}><Text style={styles.meta}>{isSample ? "表示例 · " : ""}{periodTitle}</Text>
            <Text style={styles.title}>{data.summary.input_count ? `${data.summary.input_count}件の入力から見える気持ち` : "感情の記録はまだありません"}</Text></View>
          </View>
          {isDay ? <>
            <View style={styles.composition}><WeatherRing item={data.summary} colors={colors} styles={styles} /><Legend item={data.summary} styles={styles} /></View>
            <Text style={styles.meta}>割合は、選んだ感情と強さ（弱1・中2・強3）から集計しています。</Text>
          </> : <>
            <Text style={styles.note}>{data.summary.recorded_days}日分の記録</Text>
            <KokoroWeatherPeriodChart items={items} period={period} selectedDate={selected?.date}
              onDateSelect={selectDate} colors={colors} ui={ui} emotions={WEATHER_EMOTIONS} testIDPrefix={testIDPrefix} />
            <Text style={styles.meta}>点は、その日に記録した感情です。日をタップすると内訳が見られます。</Text>
          </>}
          {data.partial_history ? <Text style={styles.note}>閲覧できる期間の記録を表示しています。</Text> : null}
        </View>
        {isDay ? <>
          <Text style={styles.section}>時間帯ごとのこころ</Text>
          <View style={styles.bands}>{items.map(item => <CocolonPressable key={item.key} containerStyle={styles.bandSlot} style={[styles.band, selected?.key === item.key && styles.selectedBand]}
            onPress={() => setSelection(item.key)} accessibilityRole="button" accessibilityLabel={`${item.label}、${item.hours}、${item.input_count}件`} accessibilityState={{ selected: selected?.key === item.key }}>
            <Text style={styles.bandTitle}>{item.label}</Text><WeatherRing item={item} size={58} compact colors={colors} styles={styles} />
            <Text style={styles.bandMeta}>{item.input_count ? `${item.input_count}件` : emptyLabel(item)}</Text>
          </CocolonPressable>)}</View>
        </> : null}
        {selected ? <View style={styles.card} testID={testIDPrefix ? `${testIDPrefix}-detail` : undefined}>
          <View style={styles.heading}><Text style={styles.section}>{isDay ? `${selected.label} ${selected.hours}` : `${shortDate(selected.date)}の記録`}</Text>
            {!isDay ? <View style={styles.rangeRow}>
              <CocolonPressable style={styles.arrow} disabled={selectedIndex <= 0} accessibilityLabel="前の日の内訳" onPress={() => selectDate(selectable[selectedIndex - 1].date)}><Ionicons name="chevron-back" size={18} color={colors.TITLE_GOLD} /></CocolonPressable>
              <CocolonPressable style={styles.arrow} disabled={selectedIndex >= selectable.length - 1} accessibilityLabel="次の日の内訳" onPress={() => selectDate(selectable[selectedIndex + 1].date)}><Ionicons name="chevron-forward" size={18} color={colors.TITLE_GOLD} /></CocolonPressable>
            </View> : null}</View>
          <Text style={styles.body}>{detailItem.input_count ? `${detailItem.input_count}件の入力` : emptyLabel(detailItem)}</Text>
          {detailItem.input_count ? <Legend item={detailItem} styles={styles} /> : null}
          {selectedDateForRead && detail.loading ? <Text style={styles.note}>記録の内訳を読み込んでいます。</Text> : null}
          {selectedDateForRead && !detail.loading && !detailMatchesDay ? <>
            <Text style={styles.note}>記録の内訳を読み込めませんでした。</Text>
            <CocolonPressable onPress={detail.retry} style={styles.retry} accessibilityLabel="内訳をもう一度読み込む">
              <Text style={styles.link}>もう一度読み込む</Text>
            </CocolonPressable>
          </> : null}
          {detailRecords.map((record, index) => <View key={`${record.created_at}:${index}`} style={styles.record}>
            <Text style={styles.meta}>{record.created_at.slice(11, 16)}</Text>
            <Text style={styles.body}>{record.emotions.map(emotion => `${WEATHER_EMOTIONS.find(value => value.key === emotion.key)?.label || ""}・${strength(emotion.weight)}`).join("　")}</Text>
          </View>)}
        </View> : null}
        <Text style={styles.footer}>入力した感情の記録を表示しています。記録のない時間・日は補っていません。</Text>
      </> : null}
  </View>;
}

function createStyles(colors, ui) {
  const frame = ui?.sectionFrame;
  return StyleSheet.create(applyTypographyTokens({
    root: { width: "100%", maxWidth: 640, alignSelf: "center", marginBottom: 14 },
    periodRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 16, gap: 4 },
    tabs: { flexDirection: "row", borderRadius: 24, padding: 3, backgroundColor: colors.FIELD_BG, ...frame },
    tab: { minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center", paddingHorizontal: 10, borderRadius: 22 },
    activeTab: { backgroundColor: colors.GOLD_BUTTON }, tabText: { color: colors.TEXT_ON_LIGHT }, activeText: { color: colors.ACCENT_TEXT },
    rangeRow: { flexDirection: "row", alignItems: "center" }, arrow: { width: 44, minHeight: 44, alignItems: "center", justifyContent: "center" },
    card: { backgroundColor: colors.FIELD_BG, borderRadius: 26, padding: 18, marginBottom: 16, ...frame },
    heading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 12 }, headingText: { flex: 1 },
    title: { color: colors.TEXT_ON_LIGHT, marginTop: 8 }, body: { color: colors.TEXT_ON_LIGHT, flexShrink: 1 },
    meta: { color: colors.TEXT_SUBTLE }, note: { color: colors.TEXT_SUBTLE, marginVertical: 12 },
    count: { fontSize: 30, fontWeight: "600", color: colors.TEXT_ON_LIGHT },
    composition: { flexDirection: "row", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "center", paddingVertical: 12, borderRadius: 22, backgroundColor: colors.SURFACE_TONAL },
    legend: { flexDirection: "row", flexWrap: "wrap", columnGap: 12, rowGap: 9, marginVertical: 8, flexShrink: 1, maxWidth: "100%" },
    legendRow: { flexDirection: "row", alignItems: "center", gap: 5 }, dot: { width: 8, height: 8, borderRadius: 4 }, percent: { color: colors.TEXT_ON_LIGHT },
    section: { color: colors.TEXT_ON_LIGHT, marginBottom: 10, flexShrink: 1 },
    bands: { flexDirection: "row", gap: 5, marginBottom: 16 },
    bandSlot: { flex: 1, minWidth: 0 }, band: { width: "100%", alignItems: "center", borderRadius: 20, paddingVertical: 12, borderWidth: 1, borderColor: frame?.borderWidth ? frame.borderColor : "transparent", backgroundColor: colors.FIELD_BG },
    selectedBand: { borderColor: colors.TITLE_GOLD, backgroundColor: colors.SURFACE_TONAL },
    bandTitle: { color: colors.TEXT_ON_LIGHT, marginBottom: 8 }, bandCount: { fontSize: 17, color: colors.TEXT_ON_LIGHT },
    bandMeta: { color: colors.TEXT_SUBTLE, fontSize: 10, marginTop: 8, textAlign: "center" },
    record: { borderTopWidth: 1, borderColor: colors.CARD_BORDER, paddingTop: 10, marginTop: 10, gap: 5 },
    footer: { color: colors.TEXT_SUBTLE, marginHorizontal: 6 }, retry: { minHeight: 44, justifyContent: "center", marginTop: 10 }, link: { color: colors.TITLE_GOLD },
  }, ui, { tabText: "button", title: "sectionTitle", body: "description", meta: "meta", note: "description", percent: "meta", section: "sectionTitle", bandTitle: "meta", footer: "meta", link: "button" }));
}
