import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";

import { ThemeProvider } from "./theme/ThemeContext";
import { AppRuntimeProvider } from "./AppRuntimeContext";
import { AuthProvider } from "./AuthContext";
import { SubscriptionProvider } from "./SubscriptionContext";
import { TutorialProvider } from "./TutorialContext";
import { UnreadProvider } from "./UnreadContext";
import AppRuntimeBootstrapGate from "./runtime/AppRuntimeBootstrapGate";
import RootNavigator from "./navigation/RootNavigator";
import { appLinking } from "./navigation/linkingRuntime";
import { requestOpenRouteFromNotification } from "./navigation/notificationRouting";
import { navigationRef, tryOpenRouteIfPending } from "./navigation/navigationRef";
import { captureClientError, initProductionMonitoring } from "./lib/monitoring";

export { navigationRef } from "./navigation/navigationRef";


export default function App() {
  useEffect(() => {
    initProductionMonitoring();
  }, []);

  useEffect(() => {
    const unsubscribeOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
      requestOpenRouteFromNotification(remoteMessage);
    });

    messaging().getInitialNotification().then((remoteMessage) => {
      if (remoteMessage) requestOpenRouteFromNotification(remoteMessage);
    }).catch((e) => {
      console.log("[push] getInitialNotification failed:", e?.message || e);
      captureClientError(e, { event_name: "push_initial_notification_failed", scope: "push" });
    });

    return () => {
      try {
        if (typeof unsubscribeOpened === "function") unsubscribeOpened();
      } catch {}
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppRuntimeProvider>
          <AuthProvider>
            <SubscriptionProvider>
              <TutorialProvider>
                <UnreadProvider>
                  <AppRuntimeBootstrapGate>
                    <NavigationContainer
                      ref={navigationRef}
                      linking={appLinking}
                      onReady={() => {
                        tryOpenRouteIfPending();
                      }}
                    >
                      <RootNavigator />
                    </NavigationContainer>
                  </AppRuntimeBootstrapGate>
                </UnreadProvider>
              </TutorialProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </AppRuntimeProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
