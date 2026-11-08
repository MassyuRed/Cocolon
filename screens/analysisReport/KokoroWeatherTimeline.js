import React, { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import Ionicons from "react-native-vector-icons/Ionicons";
import CocolonPressable from "../../components/CocolonPressable";
import { useKokoroWeather } from "../analysis/useKokoroWeather";
import { applyTypographyTokens } from "../../ui/applyTypographyTokens";

export const WEATHER_EMOTIONS = Object.freeze([
  { key: "joy", label: "喜び", color: "#D4AA45" },
  { key: "sadness", label: "悲しみ", color: "#7F9FBA" },
  { key: "anger", label: "怒り", color: "#CB8678" },
  { key: "anxiety", label: "不安", color: "#AA92B5" },
  { key: "calm", label: "平穏", color: "#809D85" },
]);
const PERIODS = [{ key: "today", label: "今日" }, { key: "week", label: "週" }, { key: "month", label: "月" }];
const shortDate = value => `${Number(value?.slice(5, 7))}/${Number(value?.slice(8, 10))}`;
const strength = weight => ({ 1: "弱", 2: "中", 3: "強" }[weight] || `${weight}`);
const emptyLabel = item => item?.status === "future" ? "これから" : item?.status === "outside_history" ? "閲覧範囲外" : "記録なし";

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

export default function KokoroWeatherTimeline({ colors, ui, refreshRevision = 0, period: controlledPeriod, onPeriodChange }) {
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const [localPeriod, setPeriod] = useState("today");
  const period = controlledPeriod || localPeriod;
  const [anchor, setAnchor] = useState(null);
  const [selection, setSelection] = useState(null);
  const { data, loading, error, retry } = useKokoroWeather(period, anchor, refreshRevision);
  const selectPeriod = next => { setPeriod(next); setAnchor(null); setSelection(null); onPeriodChange?.(next); };
  const move = next => { if (next) { setAnchor(next); setSelection(null); } };
  const items = period === "today" ? data?.time_buckets || [] : data?.items || [];
  const selected = items.find(item => (item.key || item.date) === selection) || [...items].reverse().find(item => item.status !== "future" && item.status !== "outside_history");
  const selectedIndex = items.indexOf(selected);
  const periodTitle = period === "today" ? (anchor ? "この日の天気" : "今日の天気") : period === "week" ? "この週のこころ天気" : "この月のこころ天気";
  const range = data ? (period === "month" ? `${data.start_date.slice(0, 4)}年${Number(data.start_date.slice(5, 7))}月` : `${data.start_date.slice(0, 4)}年 ${shortDate(data.start_date)}${period === "week" ? `–${shortDate(data.end_date)}` : ""}`) : "";
  return <View style={styles.root}>
    <View style={styles.periodRow}>
      <View style={styles.tabs}>{PERIODS.map(item => <CocolonPressable key={item.key} onPress={() => selectPeriod(item.key)}
        style={[styles.tab, item.key === period && styles.activeTab]} accessibilityRole="tab" accessibilityLabel={item.label} accessibilityState={{ selected: item.key === period }}>
        <Text style={[styles.tabText, item.key === period && styles.activeText]}>{item.label}</Text>
      </CocolonPressable>)}</View>
      {data ? <View style={styles.rangeRow}>
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
      <View style={styles.card}><Text style={styles.body}>こころ天気を読み込めませんでした。</Text><CocolonPressable onPress={retry} style={styles.retry} accessibilityRole="button"><Text style={styles.link}>もう一度読み込む</Text></CocolonPressable></View> : data ? <>
        <View style={styles.card}>
          <View style={styles.heading}><View style={styles.headingText}><Text style={styles.meta}>{periodTitle}</Text>
            <Text style={styles.title}>{data.summary.input_count ? `${data.summary.input_count}件の入力から見える気持ち` : "感情の記録はまだありません"}</Text></View>
            <Ionicons name="partly-sunny-outline" size={30} color={colors.TITLE_GOLD} /></View>
          {period === "today" ? <View style={styles.composition}><WeatherRing item={data.summary} colors={colors} styles={styles} /><Legend item={data.summary} styles={styles} /></View> :
            <><Text style={styles.note}>{data.summary.recorded_days}日分の記録</Text><Legend styles={styles} />
              <View style={styles.plot} accessibilityLabel="日ごとの感情の割合">
                {items.map((item, index) => {
                  const key = item.date;
                  const tick = period === "week" || index === 0 || index === items.length - 1 || ((Number(key.slice(8)) - 1) % 7 === 0 && items.length - 1 - index >= 4);
                  return <CocolonPressable key={key} containerStyle={styles.barSlot} style={styles.barButton} onPress={() => setSelection(key)} accessibilityRole="button"
                    accessibilityLabel={`${shortDate(key)}、${item.input_count}件${item.input_count ? "" : `、${emptyLabel(item)}`}`} accessibilityState={{ selected: selected?.date === key }}>
                    <View style={[styles.bar, !item.input_count && styles.emptyBar, selected?.date === key && styles.selectedBar]}>
                      {item.input_count ? WEATHER_EMOTIONS.map(emotion => <View key={emotion.key} style={{ height: `${item.emotion_share_pct[emotion.key]}%`, backgroundColor: emotion.color, width: "100%" }} />) : null}
                    </View>
                    <Text style={styles.tick} numberOfLines={1} adjustsFontSizeToFit>{tick ? Number(key.slice(8)) : " "}</Text>
                  </CocolonPressable>;
                })}
              </View>
              <Text style={styles.meta}>日をタップすると、その日の内訳が見られます。</Text></>}
          <Text style={styles.note}>{data.summary.description}</Text>
          <Text style={styles.meta}>割合は、選んだ感情と強さ（弱1・中2・強3）から集計しています。</Text>
          {data.partial_history ? <Text style={styles.note}>閲覧できる期間の記録を表示しています。</Text> : null}
        </View>
        {period === "today" ? <>
          <Text style={styles.section}>時間帯ごとのこころ</Text>
          <View style={styles.bands}>{items.map(item => <CocolonPressable key={item.key} containerStyle={styles.bandSlot} style={[styles.band, selected?.key === item.key && styles.selectedBand]}
            onPress={() => setSelection(item.key)} accessibilityRole="button" accessibilityLabel={`${item.label}、${item.hours}、${item.input_count}件`} accessibilityState={{ selected: selected?.key === item.key }}>
            <Text style={styles.bandTitle}>{item.label}</Text><WeatherRing item={item} size={58} compact colors={colors} styles={styles} />
            <Text style={styles.bandMeta}>{item.input_count ? `${item.input_count}件` : emptyLabel(item)}</Text>
          </CocolonPressable>)}</View>
        </> : null}
        {selected ? <View style={styles.card}>
          <View style={styles.heading}><Text style={styles.section}>{period === "today" ? `${selected.label} ${selected.hours}` : `${shortDate(selected.date)}の記録`}</Text>
            {period !== "today" ? <View style={styles.rangeRow}>
              <CocolonPressable style={styles.arrow} disabled={selectedIndex <= 0} accessibilityLabel="前の日の内訳" onPress={() => setSelection(items[selectedIndex - 1].date)}><Ionicons name="chevron-back" size={18} color={colors.TITLE_GOLD} /></CocolonPressable>
              <CocolonPressable style={styles.arrow} disabled={selectedIndex >= items.length - 1} accessibilityLabel="次の日の内訳" onPress={() => setSelection(items[selectedIndex + 1].date)}><Ionicons name="chevron-forward" size={18} color={colors.TITLE_GOLD} /></CocolonPressable>
            </View> : null}</View>
          <Text style={styles.body}>{selected.input_count ? `${selected.input_count}件の入力。${selected.description}` : emptyLabel(selected)}</Text>
          {selected.input_count ? <Legend item={selected} styles={styles} /> : null}
          {(selected.records || []).map((record, index) => <View key={`${record.created_at}:${index}`} style={styles.record}>
            <Text style={styles.meta}>{record.created_at.slice(11, 16)}</Text>
            <Text style={styles.body}>{record.emotions.map(emotion => `${WEATHER_EMOTIONS.find(value => value.key === emotion.key)?.label || ""}・${strength(emotion.weight)}`).join("　")}</Text>
          </View>)}
        </View> : null}
        <Text style={styles.footer}>入力した感情の記録を表示しています。記録のない時間・日は補っていません。</Text>
      </> : null}
  </View>;
}

function createStyles(colors, ui) {
  return StyleSheet.create(applyTypographyTokens({
    root: { width: "100%", maxWidth: 640, alignSelf: "center", marginBottom: 14 },
    periodRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 16, gap: 4 },
    tabs: { flexDirection: "row", borderRadius: 24, padding: 3, backgroundColor: colors.FIELD_BG },
    tab: { minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center", paddingHorizontal: 10, borderRadius: 22 },
    activeTab: { backgroundColor: colors.GOLD_BUTTON }, tabText: { color: colors.TEXT_ON_LIGHT }, activeText: { color: colors.ACCENT_TEXT },
    rangeRow: { flexDirection: "row", alignItems: "center" }, arrow: { width: 44, minHeight: 44, alignItems: "center", justifyContent: "center" },
    card: { backgroundColor: colors.FIELD_BG, borderRadius: 26, padding: 18, marginBottom: 16 },
    heading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 12 }, headingText: { flex: 1 },
    title: { color: colors.TEXT_ON_LIGHT, marginTop: 8 }, body: { color: colors.TEXT_ON_LIGHT, flexShrink: 1 },
    meta: { color: colors.TEXT_SUBTLE }, note: { color: colors.TEXT_SUBTLE, marginVertical: 12 },
    count: { fontSize: 30, fontWeight: "600", color: colors.TEXT_ON_LIGHT },
    composition: { flexDirection: "row", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "center", paddingVertical: 12, borderRadius: 22, backgroundColor: colors.SURFACE_TONAL },
    legend: { flexDirection: "row", flexWrap: "wrap", columnGap: 12, rowGap: 9, marginVertical: 8, flexShrink: 1, maxWidth: "100%" },
    legendRow: { flexDirection: "row", alignItems: "center", gap: 5 }, dot: { width: 8, height: 8, borderRadius: 4 }, percent: { color: colors.TEXT_ON_LIGHT },
    plot: { flexDirection: "row", alignItems: "flex-end", height: 178, marginTop: 12, marginBottom: 16 },
    barSlot: { flex: 1, minWidth: 0 }, barButton: { width: "100%", alignItems: "center", justifyContent: "flex-end", minHeight: 176 },
    bar: { width: "76%", maxWidth: 28, height: 140, flexDirection: "column-reverse", borderRadius: 4, overflow: "hidden" },
    emptyBar: { borderWidth: 1, borderColor: colors.CARD_BORDER, borderStyle: "dashed" }, selectedBar: { borderBottomWidth: 3, borderColor: colors.TITLE_GOLD },
    tick: { width: 24, fontSize: 9, color: colors.TEXT_SUBTLE, textAlign: "center", marginTop: 8 },
    section: { color: colors.TEXT_ON_LIGHT, marginBottom: 10, flexShrink: 1 },
    bands: { flexDirection: "row", gap: 5, marginBottom: 16 },
    bandSlot: { flex: 1, minWidth: 0 }, band: { width: "100%", alignItems: "center", borderRadius: 20, paddingVertical: 12, borderWidth: 1, borderColor: "transparent", backgroundColor: colors.FIELD_BG },
    selectedBand: { borderColor: colors.TITLE_GOLD, backgroundColor: colors.SURFACE_TONAL },
    bandTitle: { color: colors.TEXT_ON_LIGHT, marginBottom: 8 }, bandCount: { fontSize: 17, color: colors.TEXT_ON_LIGHT },
    bandMeta: { color: colors.TEXT_SUBTLE, fontSize: 10, marginTop: 8, textAlign: "center" },
    record: { borderTopWidth: 1, borderColor: colors.CARD_BORDER, paddingTop: 10, marginTop: 10, gap: 5 },
    footer: { color: colors.TEXT_SUBTLE, marginHorizontal: 6 }, retry: { minHeight: 44, justifyContent: "center", marginTop: 10 }, link: { color: colors.TITLE_GOLD },
  }, ui, { tabText: "button", title: "sectionTitle", body: "description", meta: "meta", note: "description", percent: "meta", section: "sectionTitle", bandTitle: "meta", footer: "meta", link: "button" }));
}
