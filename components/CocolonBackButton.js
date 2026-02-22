import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../theme/ThemeContext";

/**
 * CocolonBackButton
 * - Design is unified across screens.
 * - Behavior:
 *    - If navigation.canGoBack(): goBack()
 *    - Else: navigate to fallbackRouteName (default: "Home")
 *
 * Props:
 *  - navigation: optional (if omitted, uses useNavigation())
 *  - fallbackRouteName: string (default: "Home")
 *  - fallbackParams: object (optional)
 *  - onPress: function (optional; overrides default behavior)
 *  - style: style object/array for the touchable
 *  - iconSize: number (default: 22)
 *  - accessibilityLabel: string (default: "戻る")
 *  - disabled: boolean
 */
export default function CocolonBackButton({
  navigation: navigationProp,
  fallbackRouteName = "Home",
  fallbackParams,
  onPress,
  style,
  iconSize = 22,
  accessibilityLabel = "戻る",
  disabled = false,
  testID,
}) {
  const navigation = navigationProp || useNavigation();
  const { colors } = useTheme();

  const handlePress = useMemo(() => {
    return () => {
      if (disabled) return;

      // Allow caller to override behavior if needed.
      if (typeof onPress === "function") {
        onPress();
        return;
      }

      if (navigation?.canGoBack?.() && navigation?.goBack) {
        navigation.goBack();
        return;
      }

      if (fallbackRouteName && navigation?.navigate) {
        navigation.navigate(fallbackRouteName, fallbackParams);
      }
    };
  }, [disabled, onPress, navigation, fallbackRouteName, fallbackParams]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.backButton, style]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      testID={testID}
    >
      <Ionicons name="chevron-back" size={iconSize} color={colors.TITLE_GOLD} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    padding: 4,
  },
});
