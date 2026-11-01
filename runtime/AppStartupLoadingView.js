import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export default function AppStartupLoadingView({ overlay = false }) {
  const { colors } = useTheme();
  return (
    <View accessibilityViewIsModal accessibilityLabel="アプリを読み込んでいます"
      style={[{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.BG_SILVER },
        overlay && { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, zIndex: 1000, elevation: 1000 }]}>
      <ActivityIndicator color={colors.TITLE_GOLD} />
      <Text accessibilityLiveRegion="polite" style={{ color: colors.TEXT_ON_LIGHT, marginTop: 12 }}>読み込んでいます…</Text>
    </View>
  );
}
