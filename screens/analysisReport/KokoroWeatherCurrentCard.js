import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonPressable from "../../components/CocolonPressable";
import { useTheme } from "../../theme/ThemeContext";
import { applyTypographyTokens } from "../../ui/applyTypographyTokens";
import { makeUiTokens } from "../../ui/uiTokens";

const WEATHER_ICON = Object.freeze({
  clear: "sunny-outline",
  partly_cloudy: "partly-sunny-outline",
  cloudy: "cloud-outline",
  soft_rain: "rainy-outline",
  windy: "leaf-outline",
  mixed: "shuffle-outline",
  unknown: "ellipse-outline",
});

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function asString(value, fallback = "") {
  const v = String(value ?? "").trim();
  return v || fallback;
}

function asNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function formatTemperatureValue(value) {
  const n = asNumber(value);
  if (n == null) return "";
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}°` : `${rounded.toFixed(1)}°`;
}

function resolveTemperatureDisplay(currentWeather) {
  const temperature = asObject(currentWeather?.temperature);
  const display = asString(temperature.display);
  if (display) return display.replace(/℃/g, "°");
  return formatTemperatureValue(temperature.current);
}

function resolveWeather(currentWeather) {
  const weather = asObject(currentWeather?.weather);
  const key = asString(weather.key, "unknown");
  return {
    key,
    label: asString(weather.label, asString(currentWeather?.weather_label, "観測少なめ")),
    icon: WEATHER_ICON[key] || WEATHER_ICON.unknown,
  };
}

function resolveDominantEmotion(currentWeather) {
  const dominant = asObject(currentWeather?.dominant_emotion);
  const label = asString(dominant.label);
  const share = asNumber(dominant.share_pct);
  if (!label) return "";
  return share == null ? label : `${label} ${Math.round(share)}%`;
}

function isRenderableCurrentWeather(currentWeather) {
  if (!currentWeather || typeof currentWeather !== "object") return false;
  const status = asString(currentWeather.status).toLowerCase();
  return status === "ok" || status === "no_observation";
}

function createStyles(colors, ui) {
  const text = ui?.text || {};
  return StyleSheet.create(
    applyTypographyTokens(
      {
        card: {
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      borderRadius: 24,
      backgroundColor: colors.PANEL_BG,
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginBottom: 16,
      ...ui?.shadow?.float,
      width: '100%',
      maxWidth: 640,
      alignSelf: 'center',
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
        headerRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        titleWrap: {
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 1,
      minWidth: 0,
      flex: 1,
    },
        title: {
      color: colors.TEXT_ON_LIGHT,
      marginLeft: 6,
      flexShrink: 1,
      minWidth: 0,
    },
        periodText: {
      color: text.description ?? colors.TEXT_SUBTLE,
      marginTop: 2,
    },
        mainRow: {
      flexDirection: "row",
      alignItems: 'flex-start',
      marginTop: 16,
    },
        iconBox: {
      width: 64,
      height: 64,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.SURFACE_TONAL,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      marginRight: 12,
      flexShrink: 0,
    },
        weatherTextWrap: {
          flex: 1,
          minWidth: 0,
        },
        weatherLabel: {
      color: colors.TEXT_ON_LIGHT,
    },
        metaRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      marginTop: 8,
      gap: 8,
    },
        metaPill: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor: colors.FIELD_BG,
      maxWidth: '100%',
    },
        metaText: {
      color: text.primary ?? colors.TEXT_ON_LIGHT,
      marginLeft: 4,
      flexShrink: 1,
      minWidth: 0,
    },
        memoBox: {
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      backgroundColor: colors.SURFACE_TONAL,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginTop: 16,
    },
        memoLabelRow: {
      flexDirection: "row",
      alignItems: 'flex-start',
    },
        memoLabel: {
      color: colors.ON_SURFACE_TONAL,
      marginLeft: 5,
      flexShrink: 1,
    },
        memoDetail: {
      marginTop: 8,
      color: colors.ON_SURFACE_TONAL,
    },
        emptyTitle: {
      marginTop: 10,
      color: text.primary ?? colors.TEXT_ON_LIGHT,
    },
        emptyBody: {
      marginTop: 6,
      color: text.description ?? colors.TEXT_SUBTLE,
    },
        action: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: 'center',
      marginTop: 10,
      paddingVertical: 10,
      minHeight: 44,
      maxWidth: '100%',
    },
        actionText: {
      color: colors.TITLE_GOLD,
      marginRight: 4,
      flexShrink: 1,
    },
      },
      ui, {"title":"sectionTitle","periodText":"meta","weatherLabel":"modalTitle","metaText":"description","memoLabel":"button","memoDetail":"body","emptyTitle":"sectionTitle","emptyBody":"description","actionText":"button"}
    )
  );
}

export default function KokoroWeatherCurrentCard({ currentWeather, onOpenPrevious }) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);

  if (!isRenderableCurrentWeather(currentWeather)) return null;

  const status = asString(currentWeather.status).toLowerCase();
  const label = asString(currentWeather.label, "今のこころ天気");
  const previousAvailable = Boolean(currentWeather.previous_available);
  const canOpenPrevious = previousAvailable && typeof onOpenPrevious === "function";

  if (status === "no_observation") {
    const emptyTitle = asString(currentWeather.empty_title, "今日はまだ観測がありません");
    const emptyActionLabel = asString(currentWeather.empty_action_label, "前回のこころ天気を見る");

    return (
      <View style={styles.card} accessibilityLabel="今のこころ天気">
        <View style={styles.headerRow}>
          <View style={styles.titleWrap}>
            <Ionicons name="time-outline" size={17} color={colors.TITLE_GOLD} />
            <Text style={styles.title}>{label}</Text>
          </View>
        </View>
        <Text style={styles.emptyTitle}>{emptyTitle}</Text>
        <Text style={styles.emptyBody}>
          今日0:00から現在までの入力をもとに、こころの状態を観測します。
        </Text>
        {canOpenPrevious ? (
          <CocolonPressable
            style={styles.action}
            onPress={onOpenPrevious}
            accessibilityLabel={emptyActionLabel}
          >
            <Text style={styles.actionText}>{emptyActionLabel}</Text>
            <Ionicons name="chevron-forward" size={15} color={colors.TITLE_GOLD} />
          </CocolonPressable>
        ) : null}
      </View>
    );
  }

  const weather = resolveWeather(currentWeather);
  const temperatureDisplay = resolveTemperatureDisplay(currentWeather);
  const dominantEmotionText = resolveDominantEmotion(currentWeather);
  const fluctuation = asObject(currentWeather.fluctuation);
  const fluctuationLabel = asString(fluctuation.label);
  const observationMemo = asObject(currentWeather.observation_memo);
  const memoVisible = Boolean(observationMemo.visible);
  const memoLabel = asString(observationMemo.label, "観測メモあり");
  const memoDetail = asString(observationMemo.detail);

  return (
    <View style={styles.card} accessibilityLabel="今のこころ天気">
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Ionicons name="time-outline" size={17} color={colors.TITLE_GOLD} />
          <Text style={styles.title}>{label}</Text>
        </View>
      </View>
      <Text style={styles.periodText}>今日0:00〜現在の観測</Text>

      <View style={styles.mainRow}>
        <View style={styles.iconBox}>
          <Ionicons name={weather.icon} size={34} color={colors.TITLE_GOLD} />
        </View>
        <View style={styles.weatherTextWrap}>
          <Text style={styles.weatherLabel}>{weather.label}</Text>
          <View style={styles.metaRow}>
            {temperatureDisplay ? (
              <View style={styles.metaPill}>
                <Ionicons name="thermometer-outline" size={13} color={colors.TEXT_ON_LIGHT} />
                <Text style={styles.metaText}>こころ温度 {temperatureDisplay}</Text>
              </View>
            ) : null}
            {dominantEmotionText ? (
              <View style={styles.metaPill}>
                <Ionicons name="ellipse-outline" size={12} color={colors.TEXT_ON_LIGHT} />
                <Text style={styles.metaText}>{dominantEmotionText}</Text>
              </View>
            ) : null}
            {fluctuationLabel ? (
              <View style={styles.metaPill}>
                <Ionicons name="pulse-outline" size={13} color={colors.TEXT_ON_LIGHT} />
                <Text style={styles.metaText}>{fluctuationLabel}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      {memoVisible ? (
        <View style={styles.memoBox}>
          <View style={styles.memoLabelRow}>
            <Ionicons name="document-text-outline" size={14} color={colors.TITLE_GOLD} />
            <Text style={styles.memoLabel}>{memoLabel}</Text>
          </View>
          {memoDetail ? <Text style={styles.memoDetail}>{memoDetail}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

