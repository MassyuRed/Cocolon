import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CocolonScreenIntro({ eyebrow, title, description, colors, ui, titleRef }) {
  const supportingText = [ui.typography.meta, { color: colors.TEXT_SUBTLE }];
  return (
    <View ref={titleRef} collapsable={false} style={styles.intro}>
      <Text style={supportingText}>{eyebrow}</Text>
      <Text accessibilityRole="header" style={[ui.typography.screenTitle, { color: colors.TITLE_GOLD }]}>
        {title}
      </Text>
      <Text style={supportingText}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: { alignSelf: "stretch", gap: 4, marginBottom: 16 },
});
