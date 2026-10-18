import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppRuntime } from "../AppRuntimeContext";
import { useTheme } from "../theme/ThemeContext";
import AppRuntimeBlockingScreen from "./AppRuntimeBlockingScreen";
import { captureClientError } from "../lib/monitoring";

export default function AppRuntimeBootstrapGate({ children }) {
  const { runtime, refreshAppRuntime } = useAppRuntime();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const checkInFlightRef = useRef(false);
  const maintenanceAlertShownRef = useRef(null);
  const recommendedAlertShownRef = useRef(null);

  const runBootstrapCheck = React.useCallback(async () => {
    if (checkInFlightRef.current) return;
    checkInFlightRef.current = true;
    try {
      const nextRuntime = await refreshAppRuntime();
      const maintenanceMessage = String(nextRuntime?.maintenanceMessage || "").trim();
      if (maintenanceMessage && maintenanceAlertShownRef.current !== maintenanceMessage) {
        maintenanceAlertShownRef.current = maintenanceMessage;
        Alert.alert("お知らせ", maintenanceMessage);
      }

      const recommendedVersion = String(nextRuntime?.recommendedVersion || "").trim();
      if (
        recommendedVersion &&
        nextRuntime?.versionStatus?.recommendedOutdated &&
        recommendedAlertShownRef.current !== recommendedVersion
      ) {
        recommendedAlertShownRef.current = recommendedVersion;
        Alert.alert(
          "アプリ更新のお知らせ",
          `新しいバージョンがあります。可能であれば更新してからご利用ください。\n推奨バージョン: ${recommendedVersion} 以上`
        );
      }
    } catch (e) {
      console.log("[bootstrap] fetch failed:", e?.message || e);
      captureClientError(e, { event_name: "app_runtime_bootstrap_failed", scope: "bootstrap" });
    } finally {
      checkInFlightRef.current = false;
    }
  }, [refreshAppRuntime]);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!alive) return;
      await runBootstrapCheck();
    })();
    return () => { alive = false; };
  }, [runBootstrapCheck]);

  if (!runtime?.loaded && runtime?.loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (runtime?.versionStatus?.minimumBlocked) {
    return (
      <AppRuntimeBlockingScreen
        runtime={runtime}
        onRetry={runBootstrapCheck}
        retrying={runtime?.loading}
      />
    );
  }

  // Keep the same child position while retrying so unsaved input is not remounted.
  return (
    <View style={{ flex: 1 }}>
      {(runtime?.error || runtime?.loading) ? (
        <View style={{ backgroundColor: colors.PANEL_BG, paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: 8 }}>
          <Text accessibilityLiveRegion="polite" style={{ color: colors.TEXT_ON_LIGHT }}>
            {runtime?.loading
              ? "接続情報を確認しています…"
              : "接続情報を取得できませんでした。一部の機能を利用できない場合があります。"}
          </Text>
          <TouchableOpacity
            onPress={runBootstrapCheck}
            disabled={runtime?.loading}
            accessibilityRole="button"
            accessibilityLabel="接続情報を再確認する"
            style={{ minHeight: 44, justifyContent: "center", opacity: runtime?.loading ? 0.65 : 1 }}
          >
            <Text style={{ color: colors.TITLE_GOLD }}>もう一度確認する</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {children}
    </View>
  );
}
