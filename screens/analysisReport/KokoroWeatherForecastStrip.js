import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonPressable from "../../components/CocolonPressable";
import { useTheme } from "../../theme/ThemeContext";
import { makeUiTokens } from "../../ui/uiTokens";
import { applyTypographyTokens } from "../../ui/applyTypographyTokens";
import {
  buildEmotionShareText,
  formatDominantEmotion,
  getKokoroWeatherItems,
  getKokoroWeatherReportLabel,
  isKokoroWeatherRenderable,
  normalizeKokoroWeather,
} from "./kokoroWeatherFormatters";

function createStyles(colors, ui, fontScale = 1) {
  const text = ui?.text || {};
  return StyleSheet.create(
    applyTypographyTokens(
      {
        card: {
      borderRadius: 24,
      backgroundColor: colors.PANEL_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginBottom: 16,
      width: '100%',
      maxWidth: 640,
      alignSelf: 'center',
    },
        titleRow: {
      flexDirection: "row",
      alignItems: 'center',
      flexWrap: "wrap",
      marginBottom: 8,
      rowGap: 4,
    },
        title: {
      color: text.primary ?? colors.TEXT_ON_LIGHT,
      marginLeft: 8,
      flexShrink: 1,
      minWidth: 0,
    },
        periodLabel: {
      marginLeft: 8,
      color: text.description ?? colors.TEXT_SUBTLE,
      flexShrink: 1,
      maxWidth: '100%',
    },
        summaryRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 4,
      marginBottom: 8,
    },
        chip: {
      borderRadius: 10,
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: colors.SURFACE_TONAL,
      marginRight: 6,
      marginBottom: 6,
      maxWidth: '100%',
    },
        chipText: {
      color: colors.ON_SURFACE_TONAL,
      flexShrink: 1,
    },
        helperText: {
      marginBottom: 10,
      color: text.description ?? colors.TEXT_SUBTLE,
    },
        itemContainer: {
      width: Math.max(140, Math.min(224, 140 * fontScale)),
      marginRight: 8,
      flexShrink: 0,
    },
        item: {
      width: "100%",
      borderRadius: 16,
      backgroundColor: colors.SURFACE_TONAL,
      paddingHorizontal: 12,
      paddingVertical: 12,
      minHeight: 0,
    },
        itemDisabled: {
      backgroundColor: colors.SURFACE_TONAL,
    },
        itemLabel: {
      color: text.primary ?? colors.TEXT_ON_LIGHT,
      marginBottom: 6,
      flexShrink: 1,
    },
        iconWrap: {
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 6,
      minHeight: 36,
      paddingVertical: 4,
    },
        weatherLabel: {
      color: text.primary ?? colors.TEXT_ON_LIGHT,
      textAlign: "center",
    },
        tempRow: {
      flexDirection: "row",
      alignItems: 'flex-start',
      justifyContent: "space-between",
      marginTop: 6,
      flexWrap: 'wrap',
      columnGap: 8,
      rowGap: 4,
    },
        tempLabel: {
      color: text.description ?? colors.TEXT_SUBTLE,
      flexShrink: 1,
    },
        highTemp: {
      color: colors.TEXT_ON_LIGHT,
      flexShrink: 1,
    },
        lowTemp: {
      color: colors.TEXT_ON_LIGHT,
      flexShrink: 1,
    },
        dominantText: {
      marginTop: 6,
      color: text.description ?? colors.TEXT_SUBTLE,
      textAlign: "center",
    },
        memoBadge: {
      alignSelf: "center",
      marginTop: 6,
      borderRadius: 10,
      paddingHorizontal: 6,
      paddingVertical: 4,
      backgroundColor: colors.PANEL_BG,
      maxWidth: '100%',
    },
        memoText: {
      color: colors.ON_SURFACE_TONAL,
      textAlign: 'center',
      flexShrink: 1,
    },
        emptyText: {
      color: text.description ?? colors.TEXT_SUBTLE,
    },
      },
      ui, {"title":"sectionTitle","periodLabel":"meta","chipText":"description","helperText":"description","itemLabel":"button","weatherLabel":"button","tempLabel":"meta","highTemp":"button","lowTemp":"button","dominantText":"description","memoText":"meta","emptyText":"description"}
    )
  );
}

function Chip({ styles, children }) {
  if (!children) return null;
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{children}</Text>
    </View>
  );
}

export default function KokoroWeatherForecastStrip({
  kokoroWeather,
  reportType,
  onPressItem,
  onOpenDetail,
  onSelectItem,
  disableActions = false,
  disabled = false,
}) {
  const { colors, themeName } = useTheme();
  const { fontScale } = useWindowDimensions();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui, fontScale), [colors, ui, fontScale]);
  const weather = useMemo(() => normalizeKokoroWeather(kokoroWeather, reportType), [kokoroWeather, reportType]);
  const items = useMemo(() => getKokoroWeatherItems(weather), [weather]);

  if (!isKokoroWeatherRenderable(weather)) return null;

  const effectiveReportType = reportType || weather?.reportType;
  const summary = weather?.summary || {};
  const summaryDominant = formatDominantEmotion(summary.dominantEmotion);
  const summaryShareText = buildEmotionShareText(summary.emotionSharePct, 2);
  const isDisabled = Boolean(disableActions || disabled);

  const handleSelect = (item) => {
    if (isDisabled || !item) return;
    if (typeof onPressItem === "function") {
      onPressItem(item);
      return;
    }
    if (typeof onSelectItem === "function") {
      onSelectItem(item);
      return;
    }
    if (typeof onOpenDetail === "function") {
      onOpenDetail(item);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Ionicons name={summary.iconName || "partly-sunny-outline"} size={18} color={colors.TITLE_GOLD} />
        <Text style={styles.title}>こころグラフ</Text>
        <Text style={styles.periodLabel}>{getKokoroWeatherReportLabel(effectiveReportType)}</Text>
        {weather?.periodLabel ? <Text style={styles.periodLabel}>{weather.periodLabel}</Text> : null}
      </View>

      <View style={styles.summaryRow}>
        <Chip styles={styles}>{summary.weatherLabel}</Chip>
        <Chip styles={styles}>{summary.temperatureHighDisplay ? `最高 ${summary.temperatureHighDisplay}` : ""}</Chip>
        <Chip styles={styles}>{summary.temperatureLowDisplay ? `最低 ${summary.temperatureLowDisplay}` : ""}</Chip>
        <Chip styles={styles}>{summaryDominant ? `中心 ${summaryDominant}` : summaryShareText}</Chip>
        <Chip styles={styles}>{summary.observationMemo?.visible ? summary.observationMemo.label : ""}</Chip>
      </View>

      {items.length > 0 ? (
        <>
          <Text style={styles.helperText}>対象をタップすると、時間帯別のこころグラフを横にスクロールして確認できます。</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {items.map((item, idx) => {
              const dominant = formatDominantEmotion(item.dominantEmotion);
              const shareText = buildEmotionShareText(item.emotionSharePct, 2);
              const key = item.id || item.dateKey || item.bucketKey || `kokoro-weather-${idx}`;
              return (
                <CocolonPressable
                  key={key}
                  containerStyle={styles.itemContainer}
                  onPress={() => handleSelect(item)}
                  disabled={isDisabled}
                  accessibilityLabel={`${item.label || "対象"}のこころグラフ詳細を開く`}
                >
                  <View style={[styles.item, isDisabled && styles.itemDisabled]}>
                    <Text style={styles.itemLabel}>{item.label}</Text>
                    <View style={styles.iconWrap}>
                      <Ionicons name={item.iconName || "ellipse-outline"} size={28} color={colors.TITLE_GOLD} />
                    </View>
                    <Text style={styles.weatherLabel}>{item.weatherLabel}</Text>
                    <View style={styles.tempRow}>
                      <Text style={styles.tempLabel}>最高</Text>
                      <Text style={styles.highTemp}>{item.temperatureHighDisplay || "—"}</Text>
                    </View>
                    <View style={styles.tempRow}>
                      <Text style={styles.tempLabel}>最低</Text>
                      <Text style={styles.lowTemp}>{item.temperatureLowDisplay || "—"}</Text>
                    </View>
                    <Text style={styles.dominantText}>{dominant || shareText || "観測少なめ"}</Text>
                    {item.observationMemo?.visible ? (
                      <View style={styles.memoBadge}>
                        <Text style={styles.memoText}>{item.observationMemo.label || "観測メモ"}</Text>
                      </View>
                    ) : null}
                  </View>
                </CocolonPressable>
              );
            })}
          </ScrollView>
        </>
      ) : (
        <Text style={styles.emptyText}>この期間のこころグラフはまだ表示できません。</Text>
      )}
    </View>
  );
}
