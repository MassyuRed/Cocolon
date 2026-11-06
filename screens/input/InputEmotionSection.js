import React, { useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonPressable from "../../components/CocolonPressable";
import { EMOTION_ROWS, SELF_INSIGHT } from "./inputOptions";

const EMOTION_OPTIONS = EMOTION_ROWS.flat().filter(Boolean);
const GRID_GAP = 12;
const EMOTION_ICON_SIZE = 16;
const EMOTION_ICON_GAP = 4;

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
  const textStyle = StyleSheet.flatten(styles.chipText) || {};
  const longestLabel = Math.max(...EMOTION_OPTIONS.map(label => [...label].length));
  const minimumItemWidth =
    2 * (Number(chipStyle.paddingHorizontal) || 0) + 2 * (Number(chipStyle.borderWidth) || 0) +
    (longestLabel * (Number(textStyle.fontSize) || 15) + EMOTION_ICON_SIZE + EMOTION_ICON_GAP) * scale;
  const columns = Math.max(1, Math.min(3, Math.floor((gridWidth + GRID_GAP) / (minimumItemWidth + GRID_GAP))));
  const itemWidth = Math.max(1, (gridWidth - GRID_GAP * (columns - 1)) / columns);

  return (
    <View ref={sectionRef} collapsable={false} style={styles.heroEmotionSection}>
      <Text style={styles.heroFieldLabel}>感情選択</Text>
      <Text style={styles.heroFieldHint}>
        今の感情を選んでください。複数選択可能です。自己理解は単体選択のみです。
      </Text>

      <View
        style={styles.buttons}
        onLayout={event => {
          const nextWidth = Number(event?.nativeEvent?.layout?.width) || 0;
          if (nextWidth > 0) setMeasuredWidth(previous => Math.abs(previous - nextWidth) < 0.5 ? previous : nextWidth);
        }}
      >
        <View style={styles.emotionRow}>
          {EMOTION_OPTIONS.map(cat => {
            const emotion = selectedEmotions.find((e) => e.type === cat);
            const on = !!emotion;
            const isSelfInsightButton = cat === SELF_INSIGHT;
            const isDisabled = isSelfInsightSelected && !isSelfInsightButton;

            return (
              <View key={cat} style={[styles.emotionBlock, { width: itemWidth }]}>
                <CocolonPressable
                  containerStyle={styles.emotionChipContainer}
                  onPress={() => toggleEmotion(cat)}
                  disabled={isDisabled}
                  accessibilityLabel={cat}
                  accessibilityState={{ selected: on }}
                  style={[styles.chip, on && styles.chipOn]}
                >
                  <Ionicons
                    name={iconNameForEmotion(cat)}
                    size={EMOTION_ICON_SIZE}
                    color={isDisabled ? colors.TEXT_SUBTLE : on ? colors.ON_SURFACE_TONAL : colors.TEXT_SUBTLE}
                    style={{ marginRight: EMOTION_ICON_GAP, flexShrink: 0 }}
                  />
                  <Text style={[styles.chipText, on && styles.chipTextOn, isDisabled && { color: colors.TEXT_SUBTLE }]}>{cat}</Text>
                </CocolonPressable>

                <View
                  ref={(node) => {
                    strengthRowRefs.current[cat] = node;
                  }}
                  collapsable={false}
                  style={styles.strengthRow}
                >
                  {on && !isSelfInsightButton &&
                    ["weak", "medium", "strong"].map((s) => (
                      <CocolonPressable
                        key={s}
                        onPress={() => changeStrength(cat, s)}
                        accessibilityLabel={`${cat}の強さ：${STRENGTH_LABELS[s]}`}
                        accessibilityState={{ selected: emotion?.strength === s }}
                        style={[
                          styles.strengthChip,
                          emotion?.strength === s && styles.strengthChipOn,
                        ]}
                      >
                        <Text
                          style={[
                            styles.strengthText,
                            emotion?.strength === s && styles.strengthTextOn,
                          ]}
                        >
                          {STRENGTH_LABELS[s]}
                        </Text>
                      </CocolonPressable>
                    ))}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
