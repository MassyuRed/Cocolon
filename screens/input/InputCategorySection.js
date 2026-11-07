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
      <View style={styles.categoryHeader}>
        <Text style={styles.heroFieldLabel}>どんな場面？</Text>
        <Text style={styles.categoryMetaText}>複数選択可</Text>
      </View>
      <Text style={styles.categoryHintText}>
        {hasMemoInput
          ? "近いカテゴリを1つ以上選んでください。"
          : "文章を入力すると選べます。"}
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
              containerStyle={styles.categoryChipContainer}
              style={[
                styles.categoryChip,
                isActive && styles.categoryChipOn,
                isDisabled && styles.categoryChipDisabled,
              ]}
              accessibilityLabel={`${category}カテゴリを選択する`}
              accessibilityState={{ selected: isActive }}
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
