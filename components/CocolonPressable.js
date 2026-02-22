// CocolonPressable.js
import React, { useMemo, useRef, useCallback, useEffect } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";

/**
 * CocolonPressable
 * - チップ/行/カード/ピルなど「押せるUI」向けの共通押下モーション
 * - press motion: scale(ui.motion.pressScale) for ui.motion.pressDurationMs（上品設定）
 * - 見た目（padding/背景/影など）は caller の `style` に任せる（上書きしない）
 */
export default function CocolonPressable({
  children,
  onPress,
  onLongPress,
  disabled = false,
  style,
  accessibilityLabel,
  accessibilityRole = "button",
  testID,
  hitSlop,
}) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);

  const PRESS_SCALE = ui?.motion?.pressScale ?? 0.97;
  const PRESS_DURATION_MS = ui?.motion?.pressDurationMs ?? 100;

  const isDisabled = !!disabled;

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
    animateScale(PRESS_SCALE);
  }, [animateScale, isDisabled, PRESS_SCALE]);

  const onPressOut = useCallback(() => {
    if (isDisabled) return;
    animateScale(1);
  }, [animateScale, isDisabled]);

  // 押下中に disabled に切り替わった場合でも元に戻す（念のため）
  useEffect(() => {
    if (!isDisabled) return;
    animateScale(1);
  }, [isDisabled, animateScale]);

  // style に transform が含まれていても壊さないように scale を末尾に追加する
  const { baseStyle, transformPrefix } = useMemo(() => {
    const flat = style ? StyleSheet.flatten(style) : null;
    if (!flat) return { baseStyle: null, transformPrefix: [] };

    const { transform, ...rest } = flat;
    const prefix = transform
      ? Array.isArray(transform)
        ? transform
        : [transform]
      : [];
    return { baseStyle: rest, transformPrefix: prefix };
  }, [style]);

  const animatedStyle = [
    baseStyle,
    {
      transform: [...transformPrefix, { scale }],
    },
  ];

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={isDisabled}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      hitSlop={hitSlop}
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
}
