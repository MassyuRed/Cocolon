import React, { useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonPressable from "../../components/CocolonPressable";
import { EMOTION_ROWS, SELF_INSIGHT } from "./inputOptions";

const EMOTION_OPTIONS = EMOTION_ROWS.flat().filter(Boolean);
const REGULAR_EMOTIONS = EMOTION_OPTIONS.filter(type => type !== SELF_INSIGHT);
const GRID_GAP = 4;
const EMOTION_ICON_SIZE = 24;
const EMOTION_LABEL_STYLE = Object.freeze({ fontSize: 13, lineHeight: 20, fontWeight: "600" });

const STRENGTH_LABELS = Object.freeze({
  weak: "弱",
  medium: "中",
  strong: "強",
});

function iconNameForEmotion(type) {
  if (type === "喜び") return "happy-outline";
  if (type === "悲しみ") return "sad-outline";
  if (type === "怒り") return "flash-outline";
  if (type === "不安") return "alert-circle-outline";
  if (type === SELF_INSIGHT) return "bulb-outline";
  return "leaf-outline";
}

export default function InputEmotionSection({
  sectionRef,
  selectedEmotions,
  isSelfInsightSelected,
  toggleEmotion,
  changeStrength,
  strengthRowRefs,
  styles,
  colors,
}) {
  const { width: windowWidth, fontScale } = useWindowDimensions();
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const gridWidth = measuredWidth || Math.max(1, Math.min(windowWidth, 680) - 80);
  const scale = Math.max(1, Number(fontScale) || 1);
  const chipStyle = StyleSheet.flatten(styles.chip) || {};
  const textStyle = StyleSheet.flatten([styles.chipText, EMOTION_LABEL_STYLE]) || {};
  const longestLabel = Math.max(...REGULAR_EMOTIONS.map(label => [...label].length));
  const minimumItemWidth = Math.max(
    44,
    longestLabel * (Number(textStyle.fontSize) || 13) * scale +
      2 * (Number(chipStyle.paddingHorizontal) || 0)
  );
  const columns = Math.max(1, Math.min(5, Math.floor((gridWidth + GRID_GAP) / (minimumItemWidth + GRID_GAP))));
  const itemWidth = Math.max(1, (gridWidth - GRID_GAP * (columns - 1)) / columns);

  const selfInsightEmotion = selectedEmotions.find(emotion => emotion.type === SELF_INSIGHT);

  return (
    <View ref={sectionRef} collapsable={false} style={styles.heroEmotionSection}>
      <View style={styles.emotionSectionHeader}>
        <Text style={styles.heroFieldLabel}>今の気持ち</Text>
        <Text style={styles.emotionSectionMeta}>複数選択可</Text>
      </View>

      <View
        style={styles.buttons}
        onLayout={event => {
          const nextWidth = Number(event?.nativeEvent?.layout?.width) || 0;
          if (nextWidth > 0) setMeasuredWidth(previous => Math.abs(previous - nextWidth) < 0.5 ? previous : nextWidth);
        }}
      >
        <View style={styles.emotionRow}>
          {REGULAR_EMOTIONS.map(cat => {
            const emotion = selectedEmotions.find(item => item.type === cat);
            const on = !!emotion;
            const isDisabled = isSelfInsightSelected;
            return (
              <View key={cat} style={[styles.emotionBlock, { width: itemWidth }]}>
                <CocolonPressable
                  containerStyle={styles.emotionChipContainer}
                  onPress={() => toggleEmotion(cat)}
                  disabled={isDisabled}
                  accessibilityLabel={cat}
                  accessibilityState={{ selected: on }}
                  style={styles.chip}
                >
                  <View style={[styles.emotionIconSurface, on && styles.emotionIconSurfaceOn]}>
                    <Ionicons
                      name={iconNameForEmotion(cat)}
                      size={EMOTION_ICON_SIZE}
                      color={isDisabled ? colors.TEXT_SUBTLE : on ? colors.ACCENT_TEXT : colors.TEXT_SUBTLE}
                    />
                  </View>
                  <Text style={[styles.chipText, EMOTION_LABEL_STYLE, on && styles.chipTextOn, isDisabled && { color: colors.TEXT_SUBTLE }]}>{cat}</Text>
                </CocolonPressable>
              </View>
            );
          })}
        </View>

        <View style={styles.emotionFooter}>
          <CocolonPressable
            containerStyle={styles.selfInsightContainer}
            onPress={() => toggleEmotion(SELF_INSIGHT)}
            accessibilityLabel={SELF_INSIGHT}
            accessibilityState={{ selected: !!selfInsightEmotion }}
            style={[styles.selfInsightCard, !!selfInsightEmotion && styles.selfInsightCardOn]}
          >
            <View style={styles.selfInsightRow}>
              <Ionicons name="bulb-outline" size={20} color={selfInsightEmotion ? colors.ON_SURFACE_TONAL : colors.TEXT_SUBTLE} />
              <Text style={[styles.selfInsightText, !!selfInsightEmotion && styles.selfInsightTextOn]}>{SELF_INSIGHT}</Text>
            </View>
          </CocolonPressable>
          <Text style={styles.selfInsightHint}>単独選択です。</Text>
        </View>

        {EMOTION_OPTIONS.map(cat => {
          const emotion = selectedEmotions.find(item => item.type === cat);
          const showStrength = !!emotion && cat !== SELF_INSIGHT;
          return (
            <View
              key={cat}
              ref={node => {
                strengthRowRefs.current[cat] = node;
              }}
              collapsable={false}
              style={[styles.strengthRow, showStrength && styles.strengthRowActive]}
            >
              {showStrength ? (
                <>
                  <Text style={styles.strengthLabel}>{cat}の強さ</Text>
                  <View style={styles.strengthOptions}>
                    {["weak", "medium", "strong"].map(s => (
                      <CocolonPressable
                        key={s}
                        onPress={() => changeStrength(cat, s)}
                        accessibilityLabel={`${cat}の強さ：${STRENGTH_LABELS[s]}`}
                        accessibilityState={{ selected: emotion.strength === s }}
                        style={[styles.strengthChip, emotion.strength === s && styles.strengthChipOn]}
                      >
                        <Text style={[styles.strengthText, emotion.strength === s && styles.strengthTextOn]}>
                          {STRENGTH_LABELS[s]}
                        </Text>
                      </CocolonPressable>
                    ))}
                  </View>
                </>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}
