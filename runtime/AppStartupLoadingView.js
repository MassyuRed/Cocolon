import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";

export default function AppStartupLoadingView({ overlay = false }) {
  const { colors, themeName } = useTheme();
  const ui = makeUiTokens(colors, themeName);
  return (
    <View accessibilityViewIsModal accessibilityLabel="アプリを読み込んでいます"
      style={[{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.BG_SILVER },
        overlay && { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, zIndex: 1000, elevation: 1000 }]}>
      <Text style={{ color: colors.BRAND_GOLD, fontFamily: "CormorantGaramond-Bold", fontSize: 38, marginBottom: 20 }}>Emlis</Text>
      <ActivityIndicator color={colors.TITLE_GOLD} />
      <Text accessibilityLiveRegion="polite" style={{ ...ui.typography.description, color: colors.TEXT_SUBTLE, marginTop: 16 }}>読み込んでいます…</Text>
    </View>
  );
}
