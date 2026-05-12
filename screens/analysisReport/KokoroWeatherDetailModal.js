import React, { useMemo } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Phase 4: 時間帯別こころ天気を横スクロールで確認する詳細Modal。
import Ionicons from "react-native-vector-icons/Ionicons";

import { useTheme } from "../../theme/ThemeContext";
import { makeUiTokens } from "../../ui/uiTokens";
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
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          backgroundColor: colors.BG_SILVER || "#FFFFFF",
          paddingHorizontal: 18,
          paddingTop: 14,
          paddingBottom: 24,
          maxHeight: "82%",
        },
        handle: {
          alignSelf: "center",
          width: 42,
          height: 4,
          borderRadius: 999,
          backgroundColor: colors.CARD_BORDER,
          marginBottom: 12,
        },
        headerRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        },
        title: {
          flex: 1,
          fontSize: 16,
          fontWeight: "900",
          color: text.primary ?? colors.TEXT_ON_LIGHT,
          marginRight: 12,
        },
        closeButton: {
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.FIELD_BG,
          borderWidth: 1,
          borderColor: colors.CARD_BORDER,
        },
        summaryCard: {
          borderWidth: 1,
          borderColor: colors.CARD_BORDER,
          borderRadius: 16,
          backgroundColor: colors.FIELD_BG,
          paddingHorizontal: 14,
          paddingVertical: 14,
          marginBottom: 12,
        },
        summaryTop: {
          flexDirection: "row",
          alignItems: "center",
        },
        weatherText: {
          marginLeft: 10,
          fontSize: 15,
          fontWeight: "900",
          color: text.primary ?? colors.TEXT_ON_LIGHT,
        },
        tempText: {
          marginTop: 8,
          fontSize: 13,
          fontWeight: "800",
          color: text.primary ?? colors.TEXT_ON_LIGHT,
        },
        metaText: {
          marginTop: 6,
          fontSize: 12,
          lineHeight: 18,
          color: text.description ?? colors.TEXT_SUBTLE,
        },
        memoBox: {
          marginTop: 10,
          borderRadius: 12,
          paddingHorizontal: 10,
          paddingVertical: 8,
          backgroundColor: "#FEF3C7",
        },
        memoLabel: {
          fontSize: 12,
          fontWeight: "900",
          color: "#92400E",
        },
        memoDetail: {
          marginTop: 3,
          fontSize: 12,
          lineHeight: 18,
          color: "#92400E",
        },
        sectionTitle: {
          marginTop: 6,
          marginBottom: 10,
          fontSize: 13,
          fontWeight: "900",
          color: text.primary ?? colors.TEXT_ON_LIGHT,
        },
        bucketCard: {
          width: 126,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.CARD_BORDER,
          backgroundColor: colors.FIELD_BG,
          paddingHorizontal: 10,
          paddingVertical: 10,
          marginRight: 10,
          minHeight: 132,
        },
        bucketLabel: {
          fontSize: 12,
          fontWeight: "900",
          color: text.primary ?? colors.TEXT_ON_LIGHT,
          marginBottom: 8,
        },
        bucketIconWrap: {
          height: 42,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
          backgroundColor: colors.PANEL_BG,
          marginBottom: 8,
        },
        bucketWeather: {
          fontSize: 12,
          fontWeight: "900",
          color: text.primary ?? colors.TEXT_ON_LIGHT,
          textAlign: "center",
        },
        bucketTemp: {
          marginTop: 6,
          fontSize: 15,
          fontWeight: "900",
          color: colors.TITLE_GOLD,
          textAlign: "center",
        },
        bucketMeta: {
          marginTop: 6,
          fontSize: 11,
          lineHeight: 16,
          color: text.description ?? colors.TEXT_SUBTLE,
          textAlign: "center",
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
    <Modal visible={!!visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.sheet} activeOpacity={1} onPress={() => {}}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityLabel="こころ天気の詳細を閉じる"
              // こころ天気詳細を閉じる
            >
              <Ionicons name="close" size={20} color={colors.TEXT_ON_LIGHT} />
            </TouchableOpacity>
          </View>

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
                    <Text style={styles.bucketLabel} numberOfLines={1}>{bucket.label}</Text>
                    <View style={styles.bucketIconWrap}>
                      <Ionicons name={bucket.iconName || "ellipse-outline"} size={26} color={colors.TITLE_GOLD} />
                    </View>
                    <Text style={styles.bucketWeather} numberOfLines={1}>{bucket.weatherLabel}</Text>
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
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
