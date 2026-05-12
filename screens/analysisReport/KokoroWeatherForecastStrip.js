import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
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

function createStyles(colors, ui) {
  const text = ui?.text || {};
  return StyleSheet.create(
    applyTypographyTokens(
      {
        card: {
          borderWidth: 1,
          borderColor: colors.CARD_BORDER,
          borderRadius: 16,
          backgroundColor: colors.FIELD_BG,
          paddingHorizontal: 14,
          paddingVertical: 14,
          marginBottom: 14,
        },
        titleRow: {
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 8,
        },
        title: {
          fontSize: 14,
          fontWeight: "900",
          color: text.primary ?? colors.TEXT_ON_LIGHT,
          marginLeft: 8,
        },
        periodLabel: {
          marginLeft: 8,
          fontSize: 11,
          fontWeight: "700",
          color: text.description ?? colors.TEXT_SUBTLE,
        },
        summaryRow: {
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 6,
          marginBottom: 10,
        },
        chip: {
          borderRadius: 999,
          paddingHorizontal: 9,
          paddingVertical: 5,
          backgroundColor: colors.PANEL_BG,
          borderWidth: 1,
          borderColor: colors.CARD_BORDER,
          marginRight: 6,
          marginBottom: 6,
        },
        chipText: {
          fontSize: 11,
          fontWeight: "800",
          color: text.primary ?? colors.TEXT_ON_LIGHT,
        },
        helperText: {
          marginBottom: 10,
          fontSize: 11,
          lineHeight: 16,
          color: text.description ?? colors.TEXT_SUBTLE,
        },
        item: {
          width: 116,
          borderRadius: 14,
          backgroundColor: colors.PANEL_BG,
          borderWidth: 1,
          borderColor: colors.CARD_BORDER,
          paddingHorizontal: 10,
          paddingVertical: 10,
          marginRight: 10,
          minHeight: 138,
        },
        itemDisabled: {
          opacity: 0.82,
        },
        itemLabel: {
          fontSize: 12,
          fontWeight: "900",
          color: text.primary ?? colors.TEXT_ON_LIGHT,
          marginBottom: 8,
        },
        iconWrap: {
          height: 44,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.FIELD_BG,
          marginBottom: 8,
        },
        weatherLabel: {
          fontSize: 12,
          fontWeight: "900",
          color: text.primary ?? colors.TEXT_ON_LIGHT,
          textAlign: "center",
          minHeight: 18,
        },
        tempRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 8,
        },
        tempLabel: {
          fontSize: 10,
          fontWeight: "800",
          color: text.description ?? colors.TEXT_SUBTLE,
        },
        highTemp: {
          fontSize: 15,
          fontWeight: "900",
          color: "#EA580C",
        },
        lowTemp: {
          fontSize: 15,
          fontWeight: "900",
          color: "#2563EB",
        },
        dominantText: {
          marginTop: 7,
          fontSize: 11,
          lineHeight: 16,
          color: text.description ?? colors.TEXT_SUBTLE,
          textAlign: "center",
        },
        memoBadge: {
          alignSelf: "center",
          marginTop: 7,
          borderRadius: 999,
          paddingHorizontal: 8,
          paddingVertical: 3,
          backgroundColor: "#FEF3C7",
        },
        memoText: {
          fontSize: 10,
          fontWeight: "900",
          color: "#92400E",
        },
        emptyText: {
          fontSize: 12,
          lineHeight: 18,
          color: text.description ?? colors.TEXT_SUBTLE,
        },
      },
      ui
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
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
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
        <Text style={styles.title}>こころ天気図</Text>
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
          <Text style={styles.helperText}>対象をタップすると、時間帯別のこころ天気を横にスクロールして確認できます。</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {items.map((item, idx) => {
              const dominant = formatDominantEmotion(item.dominantEmotion);
              const shareText = buildEmotionShareText(item.emotionSharePct, 2);
              const key = item.id || item.dateKey || item.bucketKey || `kokoro-weather-${idx}`;
              return (
                <CocolonPressable
                  key={key}
                  onPress={() => handleSelect(item)}
                  disabled={isDisabled}
                  accessibilityLabel={`${item.label || "対象"}のこころ天気詳細を開く`}
                >
                  <View style={[styles.item, isDisabled && styles.itemDisabled]}>
                    <Text style={styles.itemLabel} numberOfLines={1}>{item.label}</Text>
                    <View style={styles.iconWrap}>
                      <Ionicons name={item.iconName || "ellipse-outline"} size={28} color={colors.TITLE_GOLD} />
                    </View>
                    <Text style={styles.weatherLabel} numberOfLines={1}>{item.weatherLabel}</Text>
                    <View style={styles.tempRow}>
                      <Text style={styles.tempLabel}>最高</Text>
                      <Text style={styles.highTemp}>{item.temperatureHighDisplay || "—"}</Text>
                    </View>
                    <View style={styles.tempRow}>
                      <Text style={styles.tempLabel}>最低</Text>
                      <Text style={styles.lowTemp}>{item.temperatureLowDisplay || "—"}</Text>
                    </View>
                    <Text style={styles.dominantText} numberOfLines={2}>{dominant || shareText || "観測少なめ"}</Text>
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
        <Text style={styles.emptyText}>この期間のこころ天気はまだ表示できません。</Text>
      )}
    </View>
  );
}
