import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../theme/ThemeContext";

export default function AppRuntimeBlockingScreen({ runtime, onRetry, retrying }) {
  const { colors } = useTheme();
  const minimumSupportedVersion = String(runtime?.minimumSupportedVersion || "").trim();

  return (
    <SafeAreaView
      edges={["top", "left", "right", "bottom"]}
      style={{ flex: 1, backgroundColor: colors.BG_SILVER }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 28,
        }}
      >
        <Text
          style={{
            color: colors.TITLE_GOLD,
            fontSize: 22,
            fontWeight: "800",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          アプリの更新が必要です
        </Text>
        <Text
          style={{
            color: colors.TEXT_ON_LIGHT,
            fontSize: 14,
            lineHeight: 22,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          {minimumSupportedVersion
            ? `現在のバージョンでは利用できません。最新バージョンへ更新してから、もう一度お試しください。\n必要バージョン: ${minimumSupportedVersion} 以上`
            : "現在のバージョンでは利用できません。最新バージョンへ更新してから、もう一度お試しください。"}
        </Text>
        <TouchableOpacity
          onPress={onRetry}
          disabled={retrying}
          style={{
            minWidth: 160,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 14,
            paddingVertical: 12,
            paddingHorizontal: 18,
            backgroundColor: colors.TITLE_GOLD,
            opacity: retrying ? 0.65 : 1,
          }}
          accessibilityLabel="アプリの利用可否を再確認する"
        >
          {retrying ? (
            <ActivityIndicator size="small" color={colors.PANEL_BG} />
          ) : (
            <Text style={{ color: colors.PANEL_BG, fontSize: 14, fontWeight: "800" }}>
              もう一度確認する
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
