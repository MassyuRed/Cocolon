// CocolonButton.js
import React, { useMemo, useRef, useCallback, useState, useEffect } from "react";
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";

/**
 * CocolonButton
 * - variants: primary / secondary
 * - width: 100% + maxWidth(520) + center
 * - press motion: scale(0.97) for 100ms
 * - depth: float -> pressed (shadow/elevation)
 */
export default function CocolonButton({
  variant = "primary",
  children,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  accessibilityLabel,
  testID,
}) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);

  // Motion / depth tuning（上品設定: uiTokens 基準）
  const PRESS_SCALE = ui?.motion?.pressScale ?? 0.97;
  const PRESS_DURATION_MS = ui?.motion?.pressDurationMs ?? 100;

  const shadowFloat =
    ui?.shadow?.float ?? {
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
    };

  const shadowPressed =
    ui?.shadow?.pressed ?? {
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    };

  const shadowDisabled =
    ui?.shadow?.disabled ?? {
      shadowColor: "#000",
      shadowOpacity: 0.03,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 2 },
      elevation: 0,
    };

  const isDisabled = !!disabled || !!loading;
  const [pressed, setPressed] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;

  const animateScale = useCallback(
    (toValue) => {
      Animated.timing(scale, {
        toValue,
        duration: PRESS_DURATION_MS,
        useNativeDriver: true,
      }).start();
    },
    [scale, PRESS_DURATION_MS]
  );

  const onPressIn = useCallback(() => {
    if (isDisabled) return;
    setPressed(true);
    animateScale(PRESS_SCALE);
  }, [animateScale, isDisabled, PRESS_SCALE]);

  const onPressOut = useCallback(() => {
    setPressed(false);
    animateScale(1);
  }, [animateScale]);

  // onPress で loading=true に切り替わった場合でも押下状態を解除する
  useEffect(() => {
    if (!isDisabled) return;
    setPressed(false);
    animateScale(1);
  }, [isDisabled, animateScale]);


  const v = String(variant || "primary").toLowerCase();
  const isPrimary = v === "primary";

  const containerStyle = [
    styles.base,
    {
      maxWidth: ui.layout.maxButtonWidth,
      borderRadius: ui.radius.pill,
      borderColor: isPrimary ? colors.GOLD_BUTTON_BORDER : colors.CARD_BORDER,
      backgroundColor: isPrimary ? colors.GOLD_BUTTON : colors.FIELD_BG,
    },
    isDisabled ? shadowDisabled : pressed ? shadowPressed : shadowFloat,
    isDisabled && styles.disabled,
    style,
    { transform: [{ scale }] },
  ];

  const labelStyle = [
    styles.label,
    {
      fontSize: ui.font.button,
      color: isPrimary ? "#FFFFFF" : colors.TEXT_ON_LIGHT,
      fontWeight: "800",
    },
    textStyle,
  ];

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={isDisabled}
      style={[styles.pressable, { maxWidth: ui.layout.maxButtonWidth }]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      <Animated.View style={containerStyle}>
        {loading ? (
          <ActivityIndicator color={isPrimary ? "#FFFFFF" : colors.TEXT_ON_LIGHT} />
        ) : typeof children === "string" || typeof children === "number" ? (
          <Text style={labelStyle} numberOfLines={1}>
            {children}
          </Text>
        ) : (
          children
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
    alignSelf: "center",
  },
  base: {
    width: "100%",
    alignSelf: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 48,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    letterSpacing: 0.2,
  },
  disabled: {
    opacity: 0.55,
  },
});
