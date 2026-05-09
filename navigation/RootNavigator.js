import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "../AuthContext";
import AuthScreen from "../AuthScreen";
import { useSubscription } from "../SubscriptionContext";
import { useTutorial } from "../TutorialContext";
import { startIapPurchaseObserver, stopIapPurchaseObserver } from "../lib/iap/iapService";
import { startPushTokenSync, syncPushTokenOnce } from "../lib/pushToken";
import { captureClientError } from "../lib/monitoring";
import { tryOpenRouteIfPending } from "./navigationRef";
import MainTabs from "./MainTabs";

export default function RootNavigator() {
  const { session, initializing, recoveryMode } = useAuth();
  const { subscriptionBootstrapLoaded } = useSubscription();
  const { tutorialResetToken } = useTutorial();

  useEffect(() => {
    if (!session || recoveryMode || !subscriptionBootstrapLoaded) {
      stopIapPurchaseObserver();
      return;
    }
    startIapPurchaseObserver().catch((e) => {
      console.log("IAP observer start failed:", e?.message || e);
      captureClientError(e, { event_name: "iap_observer_start_failed", scope: "iap" });
    });
    return () => {
      stopIapPurchaseObserver();
    };
  }, [!!session, recoveryMode, subscriptionBootstrapLoaded]);

  useEffect(() => {
    if (!session || recoveryMode) return;
    const userId = session?.user?.id;
    if (!userId) return;
    syncPushTokenOnce({ userId }).catch((e) => {
      console.log("[push] syncPushTokenOnce failed:", e?.message || e);
      captureClientError(e, { event_name: "push_token_sync_once_failed", scope: "push" });
    });
    let unsubscribe = null;
    try {
      unsubscribe = startPushTokenSync({ userId });
    } catch (e) {
      console.log("[push] startPushTokenSync failed:", e?.message || e);
      captureClientError(e, { event_name: "push_token_sync_start_failed", scope: "push" });
    }
    return () => {
      try {
        if (typeof unsubscribe === "function") unsubscribe();
      } catch {}
    };
  }, [session?.user?.id, recoveryMode]);

  useEffect(() => {
    if (!session || recoveryMode) return;
    const t = setTimeout(() => {
      tryOpenRouteIfPending();
    }, 0);
    return () => { clearTimeout(t); };
  }, [!!session, recoveryMode]);

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (recoveryMode) return <AuthScreen />;
  if (!session) return <AuthScreen />;
  return <MainTabs key={`main-tabs-${tutorialResetToken || 0}`} />;
}
