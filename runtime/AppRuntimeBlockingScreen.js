import React from "react";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../theme/ThemeContext";
import CocolonButton from "../components/CocolonButton";
import { makeUiTokens } from "../ui/uiTokens";

export default function AppRuntimeBlockingScreen({ runtime, onRetry, retrying }) {
  const { colors, themeName } = useTheme();
  const ui = makeUiTokens(colors, themeName);
  const minimumSupportedVersion = String(runtime?.minimumSupportedVersion || "").trim();

  return (
    <SafeAreaView
      edges={["top", "left", "right", "bottom"]}
      style={{ flex: 1, backgroundColor: colors.BG_SILVER }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <Text
          style={{
            color: colors.TITLE_GOLD,
            ...ui.typography.screenTitle,
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          アプリの更新が必要です
        </Text>
        <Text
          style={{
            color: colors.TEXT_ON_LIGHT,
            ...ui.typography.body,
            maxWidth: 520,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          {minimumSupportedVersion
            ? `現在のバージョンでは利用できません。最新バージョンへ更新してから、もう一度お試しください。\n必要バージョン: ${minimumSupportedVersion} 以上`
            : "現在のバージョンでは利用できません。最新バージョンへ更新してから、もう一度お試しください。"}
        </Text>
        <CocolonButton
          onPress={onRetry}
          disabled={retrying}
          loading={retrying}
          accessibilityLabel="アプリの利用可否を再確認する"
          title="もう一度確認する"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
