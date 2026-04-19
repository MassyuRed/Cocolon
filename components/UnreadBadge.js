import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "../theme/ThemeContext";

export function BottomTabUnreadBadge({
  visible = true,
  style,
  textStyle,
}) {
  return (
    <UnreadBadge
      visible={visible}
      variant="new"
      label="NEW"
      style={style}
      textStyle={textStyle}
    />
  );
}

export function ScreenUnreadBadge({
  visible = true,
  style,
}) {
  return (
    <UnreadBadge
      visible={visible}
      variant="dot"
      style={style}
    />
  );
}

export default function UnreadBadge({
  visible = true,
  variant = "new", // "new" | "dot"
  label = "NEW",
  style,
  textStyle,
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!visible) return null;

  if (variant === "dot") {
    return <View pointerEvents="none" style={[styles.dot, style]} />;
  }

  return (
    <View pointerEvents="none" style={[styles.badge, style]}>
      <Text style={[styles.badgeText, textStyle]}>{label}</Text>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors?.ALERT_RED || colors?.DANGER_RED || "#E53935",
    },
    badge: {
      minHeight: 16,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors?.ALERT_RED_DARK || colors?.DANGER_RED_DARK || "#C62828",
      backgroundColor: colors?.ALERT_RED || colors?.DANGER_RED || "#E53935",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-start",
    },
    badgeText: {
      fontSize: 9,
      lineHeight: 11,
      fontWeight: "800",
      color: "#FFFFFF",
      includeFontPadding: false,
    },
  });
}
