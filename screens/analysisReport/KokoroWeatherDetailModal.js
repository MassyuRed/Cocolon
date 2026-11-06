import React, { useMemo } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Phase 4: 時間帯別こころ天気を横スクロールで確認する詳細Modal。
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../../theme/ThemeContext";
import { makeUiTokens, MODAL_ORIENTATIONS } from "../../ui/uiTokens";
import { applyTypographyTokens } from "../../ui/applyTypographyTokens";
import {
  buildEmotionShareText,
  buildKokoroWeatherDetailTitle,
  formatDominantEmotion,
  getKokoroWeatherDetailBuckets,
  normalizeKokoroWeatherItem,
} from "./kokoroWeatherFormatters";

function createStyles(colors, ui) {
  const text = ui?.text || {};
  return StyleSheet.create(
    applyTypographyTokens(
      {
        backdrop: {
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.32)",
        },
        sheet: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      backgroundColor: colors.PANEL_BG,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 20,
      maxHeight: '90%',
      width: '100%',
      maxWidth: 640,
      alignSelf: 'center',
      flexShrink: 1,
      minHeight: 0,
    },
        handle: {
      alignSelf: "center",
      width: 42,
      height: 4,
      borderRadius: 999,
      backgroundColor: colors.CARD_BORDER,
      marginBottom: 16,
    },
        headerRow: {
      flexDirection: "row",
      alignItems: 'flex-start',
      justifyContent: "space-between",
      marginBottom: 16,
    },
        title: {
      flex: 1,
      color: text.primary ?? colors.TEXT_ON_LIGHT,
      marginRight: 12,
      minWidth: 0,
      flexShrink: 1,
    },
        closeButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.FIELD_BG,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      flexShrink: 0,
    },
        summaryCard: {
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      borderRadius: 24,
      backgroundColor: colors.FIELD_BG,
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginBottom: 16,
    },
        summaryTop: {
      flexDirection: "row",
      alignItems: 'flex-start',
    },
        weatherText: {
      marginLeft: 10,
      color: text.primary ?? colors.TEXT_ON_LIGHT,
      flex: 1,
      minWidth: 0,
      flexShrink: 1,
    },
        tempText: {
      marginTop: 8,
      color: text.primary ?? colors.TEXT_ON_LIGHT,
    },
        metaText: {
      marginTop: 8,
      color: text.description ?? colors.TEXT_SUBTLE,
    },
        memoBox: {
      marginTop: 12,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: colors.SURFACE_TONAL,
    },
        memoLabel: {
      color: colors.ON_SURFACE_TONAL,
    },
        memoDetail: {
      marginTop: 8,
      color: colors.ON_SURFACE_TONAL,
    },
        sectionTitle: {
      marginTop: 8,
      marginBottom: 12,
      color: text.primary ?? colors.TEXT_ON_LIGHT,
    },
        bucketCard: {
      width: 168,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      backgroundColor: colors.FIELD_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginRight: 12,
      minHeight: 0,
    },
        bucketLabel: {
      color: text.primary ?? colors.TEXT_ON_LIGHT,
      marginBottom: 8,
    },
        bucketIconWrap: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
      backgroundColor: colors.SURFACE_TONAL,
      marginBottom: 8,
      minHeight: 52,
      paddingVertical: 8,
    },
        bucketWeather: {
      color: text.primary ?? colors.TEXT_ON_LIGHT,
      textAlign: "center",
    },
        bucketTemp: {
      marginTop: 6,
      color: colors.TEXT_ON_LIGHT,
      textAlign: "center",
    },
        bucketMeta: {
      marginTop: 6,
      color: text.description ?? colors.TEXT_SUBTLE,
      textAlign: "center",
    },
        emptyText: {
      color: text.description ?? colors.TEXT_SUBTLE,
    },
      },
      ui, {"title":"modalTitle","weatherText":"sectionTitle","tempText":"button","metaText":"description","memoLabel":"button","memoDetail":"body","sectionTitle":"sectionTitle","bucketLabel":"button","bucketWeather":"button","bucketTemp":"body","bucketMeta":"description","emptyText":"description"}
    )
  );
}

export default function KokoroWeatherDetailModal({ visible, item, detail, reportType, onClose }) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const normalized = useMemo(() => normalizeKokoroWeatherItem(item || detail || {}), [detail, item]);
  const buckets = useMemo(() => getKokoroWeatherDetailBuckets(normalized), [normalized]);
  const title = buildKokoroWeatherDetailTitle(normalized, reportType);
  const dominant = formatDominantEmotion(normalized?.dominantEmotion);
  const shareText = buildEmotionShareText(normalized?.emotionSharePct, 2);

  return (
    <Modal visible={!!visible} transparent animationType="slide" onRequestClose={onClose} supportedOrientations={MODAL_ORIENTATIONS}>
      <SafeAreaProvider><SafeAreaView edges={["top", "bottom", "left", "right"]} style={styles.backdrop}>
      <TouchableOpacity style={StyleSheet.absoluteFillObject} activeOpacity={1} onPress={onClose} accessibilityLabel="こころ天気の詳細を閉じる" accessibilityRole="button" />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityLabel="こころ天気の詳細を閉じる"
              accessibilityRole="button"
              // こころ天気詳細を閉じる
            >
              <Ionicons name="close" size={20} color={colors.TEXT_ON_LIGHT} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingBottom: 8 }}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryTop}>
              <Ionicons name={normalized?.iconName || "ellipse-outline"} size={24} color={colors.TITLE_GOLD} />
              <Text style={styles.weatherText}>{normalized?.weatherLabel || "こころ天気"}</Text>
            </View>
            <Text style={styles.tempText}>こころ温度 {normalized?.temperatureDisplay || normalized?.temperatureHighDisplay || "—"}</Text>
            {dominant || shareText ? <Text style={styles.metaText}>中心に見えた気持ち: {dominant || shareText}</Text> : null}
            {normalized?.observationMemo?.visible ? (
              <View style={styles.memoBox}>
                <Text style={styles.memoLabel}>{normalized.observationMemo.label || "観測メモあり"}</Text>
                {normalized.observationMemo.detail ? <Text style={styles.memoDetail}>{normalized.observationMemo.detail}</Text> : null}
              </View>
            ) : null}
          </View>

          <Text style={styles.sectionTitle}>時間帯別こころ天気</Text>
          {buckets.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {buckets.map((bucket, idx) => {
                const bucketDominant = formatDominantEmotion(bucket.dominantEmotion);
                const bucketShare = buildEmotionShareText(bucket.emotionSharePct, 1);
                const key = bucket.id || bucket.bucketKey || `bucket-${idx}`;
                return (
                  <View key={key} style={styles.bucketCard}>
                    <Text style={styles.bucketLabel}>{bucket.label}</Text>
                    <View style={styles.bucketIconWrap}>
                      <Ionicons name={bucket.iconName || "ellipse-outline"} size={26} color={colors.TITLE_GOLD} />
                    </View>
                    <Text style={styles.bucketWeather}>{bucket.weatherLabel}</Text>
                    <Text style={styles.bucketTemp}>{bucket.temperatureDisplay || bucket.temperatureHighDisplay || "—"}</Text>
                    {bucketDominant || bucketShare ? <Text style={styles.bucketMeta}>{bucketDominant || bucketShare}</Text> : null}
                    {bucket.observationMemo?.visible ? <Text style={styles.bucketMeta}>{bucket.observationMemo.label}</Text> : null}
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <Text style={styles.emptyText}>時間帯別のこころ天気はまだありません。</Text>
          )}
          </ScrollView>
        </View>
      </SafeAreaView></SafeAreaProvider>
    </Modal>
  );
}
