import React from "react";
import { Text, View } from "react-native";

import CocolonPressable from "../../components/CocolonPressable";
import { CATEGORY_OPTIONS } from "./inputOptions";

export default function InputCategorySection({
  sectionRef,
  hasMemoInput,
  hasSelectedCategories,
  selectedCategories,
  toggleCategory,
  styles,
}) {
  return (
    <View ref={sectionRef} collapsable={false} style={styles.categorySection}>
      <Text style={styles.heroFieldLabel}>このメモの内容カテゴリ</Text>
      <Text style={styles.categoryHintText}>
        {hasMemoInput
          ? "この出来事や思考に近いカテゴリを、1つ以上選んでください。"
          : "思考内容または行動内容を入力すると選択できます。"}
      </Text>
      <View style={styles.categoryGrid}>
        {CATEGORY_OPTIONS.map((category) => {
          const isActive = selectedCategories.includes(category);
          const isDisabled = !hasMemoInput;
          return (
            <CocolonPressable
              key={category}
              onPress={() => toggleCategory(category)}
              disabled={isDisabled}
              style={[
                styles.categoryChip,
                isActive && styles.categoryChipOn,
                isDisabled && styles.categoryChipDisabled,
              ]}
              accessibilityLabel={`${category}カテゴリを選択する`}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  isActive && styles.categoryChipTextOn,
                  isDisabled && styles.categoryChipTextDisabled,
                ]}
              >
                {category}
              </Text>
            </CocolonPressable>
          );
        })}
      </View>
      {hasMemoInput && !hasSelectedCategories ? (
        <Text style={styles.categoryRequiredText}>
          メモを入力した場合は、カテゴリを1つ以上選択してください。
        </Text>
      ) : null}
    </View>
  );
}
