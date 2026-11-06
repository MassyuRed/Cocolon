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
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityState,
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
  const label = children ?? title;
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
      borderRadius: ui.radius.button,
      borderBottomRightRadius: isPrimary ? 12 : ui.radius.button,
      borderColor: isDisabled ? colors.CARD_BORDER : isPrimary ? colors.GOLD_BUTTON_BORDER : colors.CARD_BORDER,
      backgroundColor: isDisabled ? colors.FIELD_BG : isPrimary ? colors.GOLD_BUTTON : colors.FIELD_BG,
    },
    isDisabled ? shadowDisabled : pressed ? shadowPressed : shadowFloat,
    style,
    { transform: [{ scale }] },
  ];

  const labelStyle = [
    styles.label,
    {
      fontSize: ui.font.button,
      color: isDisabled ? colors.TEXT_SUBTLE : isPrimary ? colors.ACCENT_TEXT : colors.TEXT_ON_LIGHT,
      ...ui.typography.button,
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
      accessibilityState={{ ...accessibilityState, disabled: isDisabled, busy: !!loading }}
      testID={testID}
    >
      <Animated.View style={containerStyle}>
        {loading ? (
          <ActivityIndicator color={isDisabled ? colors.TEXT_SUBTLE : isPrimary ? colors.ACCENT_TEXT : colors.TEXT_ON_LIGHT} />
        ) : typeof label === "string" || typeof label === "number" ? (
          <Text style={labelStyle}>
            {label}
          </Text>
        ) : (
          label
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
    paddingHorizontal: 20,
    minHeight: 52,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    letterSpacing: 0.2,
    textAlign: "center",
  },
});

