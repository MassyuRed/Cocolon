import React from "react";
import { Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonPressable from "../../components/CocolonPressable";
import { EMOTION_ROWS, SELF_INSIGHT } from "./inputOptions";

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
  return (
    <View ref={sectionRef} collapsable={false} style={styles.heroEmotionSection}>
      <Text style={styles.heroFieldLabel}>感情選択</Text>
      <Text style={styles.heroFieldHint}>
        今の感情を選んでください。複数選択可能です。自己理解は単体選択のみです。
      </Text>

      <View style={styles.buttons}>
        {EMOTION_ROWS.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.emotionRow}>
            {row.map((cat, colIndex) => {
              if (!cat) {
                return <View key={`empty-${rowIndex}-${colIndex}`} style={styles.emotionBlock} />;
              }

              const emotion = selectedEmotions.find((e) => e.type === cat);
              const on = !!emotion;
              const isSelfInsightButton = cat === SELF_INSIGHT;
              const isDisabled = isSelfInsightSelected && !isSelfInsightButton;

              return (
                <View key={cat} style={styles.emotionBlock}>
                  <CocolonPressable
                    onPress={() => toggleEmotion(cat)}
                    disabled={isDisabled}
                    style={[styles.chip, on && styles.chipOn, isDisabled && { opacity: 0.45 }]}
                  >
                    <Ionicons
                      name={iconNameForEmotion(cat)}
                      size={16}
                      color={on ? colors.ACCENT_TEXT : colors.TEXT_SUBTLE}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={[styles.chipText, on && styles.chipTextOn]}>{cat}</Text>
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
        ))}
      </View>
    </View>
  );
}
