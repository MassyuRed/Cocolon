import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import CocolonPressable from "../../components/CocolonPressable";

const WEEKDAYS = ["月", "火", "水", "木", "金", "土", "日"];
const DAY_STATUS = {
  no_observation: { label: "記録なし", mark: "—" },
  future: { label: "これから", mark: "…" },
  outside_history: { label: "閲覧範囲外", mark: "／" },
};

const monthOf = date => Number(date.slice(5, 7));
const dayOf = date => Number(date.slice(8));
const weekdayOf = date => (new Date(`${date}T00:00:00Z`).getUTCDay() + 6) % 7;
const isUnavailable = item => item.status === "future" || item.status === "outside_history";
const hasEmotion = (item, emotion) => !isUnavailable(item) && item.emotion_weights?.[emotion.key] > 0;
const countLabel = item => `${item.input_count}件`;

function describeDay(item, emotions) {
  const date = `${monthOf(item.date)}/${dayOf(item.date)}`;
  const status = DAY_STATUS[item.status];
  if (status) return `${date}、${status.label}`;
  const names = emotions.filter(emotion => hasEmotion(item, emotion)).map(emotion => emotion.label);
  return [date, countLabel(item), names.join("・"), item.partial_history ? "一部閲覧範囲外" : ""]
    .filter(Boolean).join("、");
}

function calendarWeeks(items) {
  if (!items.length) return [];
  const month = items[0].date.slice(0, 7);
  const first = `${month}-01`;
  const daysInMonth = new Date(Date.UTC(Number(month.slice(0, 4)), monthOf(first), 0)).getUTCDate();
  const days = new Map(items.map(item => [item.date, item]));
  const lastDate = items[items.length - 1].date;
  const cells = Array(weekdayOf(first)).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${month}-${String(day).padStart(2, "0")}`;
    cells.push(days.get(date) || (date > lastDate ? { date, status: "future" } : null));
  }
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, index) => cells.slice(index * 7, index * 7 + 7));
}

function Marker({ item, emotion, small, highlight, styles, testIDPrefix }) {
  const recorded = hasEmotion(item, emotion);
  return (
    <View
      testID={!recorded || !testIDPrefix ? undefined : `${testIDPrefix}-emotion-${emotion.key}-${dayOf(item.date)}`}
      style={[
        styles.marker,
        small && styles.smallMarker,
        recorded && { backgroundColor: emotion.color },
        recorded && highlight && (highlight === emotion.key ? styles.highlightedMarker : styles.dimMarker),
      ]}
    />
  );
}

export default function KokoroWeatherPeriodChart({
  items, period, selectedDate, onDateSelect, colors, ui, emotions, testIDPrefix,
}) {
  const { fontScale = 1 } = useWindowDimensions();
  const styles = useMemo(() => createStyles(colors, ui, fontScale), [colors, ui, fontScale]);
  const [highlight, setHighlight] = useState(null);
  const weeks = useMemo(() => period === "month" ? calendarWeeks(items) : [], [items, period]);

  const renderDay = (item, small) => {
    const disabled = isUnavailable(item);
    const selected = selectedDate === item.date;
    const status = DAY_STATUS[item.status];
    const futureCalendarDay = small && item.status === "future";
    const markers = emotions.map(emotion => (
      <View key={emotion.key} style={small ? styles.calendarMarkerSlot : styles.weekRow}>
        <Marker item={item} emotion={emotion} small={small} highlight={small ? highlight : null}
          styles={styles} testIDPrefix={testIDPrefix} />
      </View>
    ));
    const statusMark = status ? <Text style={styles.meta}>{status.mark}</Text> : null;
    return (
      <CocolonPressable
        key={item.date}
        testID={testIDPrefix ? `${testIDPrefix}-day-${dayOf(item.date)}` : undefined}
        containerStyle={small ? styles.calendarSlot : styles.weekDaySlot}
        style={[
          small ? styles.calendarDay : styles.weekDay,
          disabled && styles.unavailable,
          selected && styles.selectedDay,
        ]}
        onPress={disabled ? undefined : () => onDateSelect(item.date)}
        disabled={disabled}
        accessibilityLabel={describeDay(item, emotions)}
        accessibilityState={{ selected, disabled }}
      >
        {small ? (
          <Text style={[styles.date, disabled && styles.subtleDate]}>{dayOf(item.date)}</Text>
        ) : (
          <View style={styles.weekHeader}>
            <Text style={[styles.date, disabled && styles.subtleDate]}>{dayOf(item.date)}</Text>
            <Text style={styles.meta}>{WEEKDAYS[weekdayOf(item.date)]}</Text>
          </View>
        )}
        {small ? (
          !futureCalendarDay && <View style={styles.calendarMarkers}>{statusMark || markers}</View>
        ) : (
          <>
            {markers}
            <View style={styles.weekRow}>{statusMark}</View>
          </>
        )}
      </CocolonPressable>
    );
  };

  return (
    <View testID={testIDPrefix ? `${testIDPrefix}-${period}-grid` : undefined} style={styles.root}>
      {period === "week" ? (
        <View style={styles.weekGrid}>
          <View style={styles.weekLabels} importantForAccessibility="no-hide-descendants">
            <View style={styles.weekHeader} />
            {emotions.map(emotion => (
              <View key={emotion.key} style={[styles.weekRow, styles.labelRow]}>
                <Text style={styles.label}>{emotion.label}</Text>
              </View>
            ))}
            <View style={[styles.weekRow, styles.labelRow]}><Text style={styles.meta}>記録</Text></View>
          </View>
          <ScrollView horizontal alwaysBounceHorizontal={false}
            contentContainerStyle={styles.weekColumns} style={styles.weekScroller}>
            {items.map(item => renderDay(item, false))}
          </ScrollView>
        </View>
      ) : (
        <>
          <View style={styles.filters}>
            {[{ key: null, label: "すべて" }, ...emotions].map(emotion => (
              <CocolonPressable
                key={emotion.key ?? "all"}
                testID={testIDPrefix ? `${testIDPrefix}-month-filter-${emotion.key ?? "all"}` : undefined}
                onPress={() => setHighlight(emotion.key)}
                accessibilityLabel={emotion.key ? emotion.label : "すべての感情"}
                accessibilityState={{ selected: highlight === emotion.key }}
                style={[styles.filter, highlight === emotion.key && styles.activeFilter]}
              >
                {emotion.color ? <View style={[styles.smallMarker, { backgroundColor: emotion.color }]} /> : null}
                <Text style={styles.label}>{emotion.label}</Text>
              </CocolonPressable>
            ))}
          </View>
          <View style={styles.calendar}>
            <View style={styles.calendarRow} importantForAccessibility="no-hide-descendants">
              {WEEKDAYS.map(label => (
                <Text key={label} style={[styles.meta, styles.calendarSlot, styles.weekday]}>{label}</Text>
              ))}
            </View>
            {weeks.map((week, index) => (
              <View key={index} style={styles.calendarRow}
                testID={testIDPrefix ? `${testIDPrefix}-month-row-${index + 1}` : undefined}>
                {week.map((item, column) => item ? renderDay(item, true) : (
                  <View key={`blank-${column}`} style={styles.calendarSlot} />
                ))}
              </View>
            ))}
          </View>
        </>
      )}
      <View style={styles.statusLegend}>
        {Object.entries(DAY_STATUS).map(([key, status]) => (
          <Text key={key} style={styles.meta}>
            {key === "future" && period === "month" ? "これからの日は日付のみ" : `${status.mark} ${status.label}`}
          </Text>
        ))}
      </View>
    </View>
  );
}

function createStyles(colors, ui, fontScale) {
  const scale = Math.max(1, fontScale);
  const frame = ui.sectionFrame?.borderColor || colors.CARD_BORDER;
  const primary = ui.text?.primary || colors.TEXT_ON_LIGHT;
  return StyleSheet.create({
    root: { marginTop: 12, gap: 12 },
    meta: { ...ui.typography?.meta, color: colors.TEXT_SUBTLE },
    label: { ...ui.typography?.meta, color: primary },
    date: { ...ui.typography?.meta, color: primary, fontWeight: "600", fontVariant: ["tabular-nums"] },
    subtleDate: { color: colors.TEXT_SUBTLE },
    weekGrid: { flexDirection: "row", borderWidth: 1, borderColor: frame, borderRadius: 14 },
    weekLabels: { alignSelf: "stretch", minWidth: Math.ceil(44 * scale), paddingHorizontal: 4, paddingTop: 1 },
    weekHeader: { height: Math.ceil(44 * scale), alignItems: "center", justifyContent: "center" },
    weekRow: { height: Math.ceil(29 * scale), alignItems: "center", justifyContent: "center", borderTopWidth: StyleSheet.hairlineWidth || 1, borderColor: frame },
    labelRow: { alignItems: "flex-start" },
    weekScroller: { flex: 1, minWidth: 0 },
    weekColumns: { flexGrow: 1, flexDirection: "row" },
    weekDaySlot: { flex: 1, minWidth: Math.ceil(28 * scale) },
    weekDay: { flex: 1, borderRadius: 8, borderWidth: 1, borderColor: "transparent" },
    selectedDay: { backgroundColor: colors.SURFACE_TONAL, borderColor: colors.TITLE_GOLD },
    unavailable: { backgroundColor: colors.PANEL_BG },
    marker: { width: 10, height: 10, borderRadius: 5, backgroundColor: "transparent" },
    smallMarker: { width: 5, height: 5, borderRadius: 3 },
    highlightedMarker: { transform: [{ scale: 1.3 }] },
    dimMarker: { opacity: 0.3 },
    filters: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    filter: {
      minHeight: 44, borderRadius: 22, paddingHorizontal: 9, flexDirection: "row", alignItems: "center",
      gap: 5, borderWidth: 1, borderColor: frame,
    },
    activeFilter: { backgroundColor: colors.SURFACE_TONAL, borderColor: colors.TITLE_GOLD },
    calendar: { gap: 4 },
    calendarRow: { flexDirection: "row", gap: 3, alignItems: "stretch" },
    calendarSlot: { flex: 1, minWidth: 0 },
    weekday: { textAlign: "center" },
    calendarDay: {
      flex: 1, minHeight: Math.ceil(48 * scale), alignItems: "center",
      borderRadius: 8, borderWidth: 1, borderColor: frame, gap: 2, paddingVertical: 4,
    },
    calendarMarkers: { flexDirection: "row", gap: 1, alignItems: "center", minHeight: Math.ceil(18 * scale) },
    calendarMarkerSlot: { width: 5, alignItems: "center" },
    statusLegend: { flexDirection: "row", flexWrap: "wrap", columnGap: 12, rowGap: 4 },
  });
}
