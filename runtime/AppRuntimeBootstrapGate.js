import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

import { useAppRuntime } from "../AppRuntimeContext";
import AppRuntimeBlockingScreen from "./AppRuntimeBlockingScreen";
import { captureClientError } from "../lib/monitoring";

export default function AppRuntimeBootstrapGate({ children }) {
  const { runtime, refreshAppRuntime } = useAppRuntime();
  const maintenanceAlertShownRef = useRef(null);
  const recommendedAlertShownRef = useRef(null);

  const runBootstrapCheck = React.useCallback(async () => {
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

  return children;
}
