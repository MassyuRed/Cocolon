import React from "react";
import { Text, View, Platform, StatusBar } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../theme/ThemeContext";

export const FRAME_BORDER_WIDTH = 2;

export default function GlobalFrameLayout({ children, frameEnabled, headerBottomSlot = null }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const androidExtraTop =
    Platform.OS === "android"
      ? Math.max(0, (StatusBar.currentHeight || 0) - (insets?.top || 0))
      : 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.BG_SILVER }}>
      {frameEnabled ? (
        <SafeAreaView
          edges={["top", "left", "right"]}
          style={{
            backgroundColor: colors.BG_SILVER,
            paddingTop: androidExtraTop,
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderBottomColor: colors.BORDER_GOLD,
              borderBottomWidth: FRAME_BORDER_WIDTH,
            }}
          >
            <Text
              style={{
                fontFamily: "CormorantGaramond-Bold",
                fontSize: 24,
                letterSpacing: 1.2,
                color: colors.BRAND_GOLD,
              }}
            >
              Emlis
            </Text>
            <Text
              style={{
                fontFamily: "CormorantGaramond-Regular",
                marginTop: 4,
                fontSize: 11,
                letterSpacing: 0.8,
                color: colors.BRAND_GOLD,
              }}
            >
              ～Emotion Limbic Internal Structure～
            </Text>
          </View>
        </SafeAreaView>
      ) : null}

      {headerBottomSlot ? (
        <View
          style={{
            backgroundColor: colors.BG_SILVER,
            paddingTop: 8,
            paddingBottom: 6,
            paddingHorizontal: 12,
            borderLeftColor: colors.BORDER_GOLD,
            borderRightColor: colors.BORDER_GOLD,
            borderLeftWidth: frameEnabled ? FRAME_BORDER_WIDTH : 0,
            borderRightWidth: frameEnabled ? FRAME_BORDER_WIDTH : 0,
          }}
        >
          {headerBottomSlot}
        </View>
      ) : null}

      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}
