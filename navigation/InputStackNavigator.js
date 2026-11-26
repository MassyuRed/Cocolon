import React, { useEffect, useMemo } from "react";
import { AppState } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import InputScreen from "../screens/InputScreen";
import EmlisTutorialScreen from "../screens/EmlisTutorialScreen";
import AnalysisHistoryScreen from "../screens/AnalysisHistoryScreen";
import DeepInsightScreen, { DeepInsightReturnCacheContext } from "../screens/DeepInsightScreen";
import { useAuth } from "../AuthContext";
import CocolonGuideScreen from "../screens/CocolonGuideScreen";
import NoticeHistoryScreen from "../screens/NoticeHistoryScreen";
import AccountScreen from "../screens/AccountScreen";
import SubscriptionSelectScreen from "../screens/SubscriptionSelectScreen";
import FollowListScreen from "../screens/FollowListScreen";

const InputStack = createNativeStackNavigator();

export default function InputStackNavigator({ onInitialInputSettled, appStartupReady, saveRecovery }) {
  const { user, authOwnerGeneration } = useAuth();
  const ownerId = user?.id;
  const deepInsightCache = useMemo(() => ({ snapshot: null, foregroundRevision: 0 }), [ownerId, authOwnerGeneration]);
  const historyReadSnapshot = useMemo(() => ({ current: null }), [ownerId, authOwnerGeneration]);
  useEffect(() => {
    let previous = AppState.currentState;
    const subscription = AppState.addEventListener("change", (state) => {
      if (state !== "active") historyReadSnapshot.current = null;
      if (state === "active" && previous !== "active") deepInsightCache.foregroundRevision += 1;
      previous = state;
    });
    return () => subscription.remove();
  }, [deepInsightCache, historyReadSnapshot]);
  return (
    <DeepInsightReturnCacheContext.Provider value={deepInsightCache}>
    <InputStack.Navigator initialRouteName="Input" screenOptions={{ headerShown: false }}>
      <InputStack.Screen name="Input">
        {(props) => <InputScreen {...props} onInitialInputSettled={onInitialInputSettled}
          appStartupReady={appStartupReady} saveRecovery={saveRecovery} />}
      </InputStack.Screen>
      <InputStack.Screen name="DeepInsight" component={DeepInsightScreen} />
      <InputStack.Screen name="TutorialIntro" component={EmlisTutorialScreen} />
      <InputStack.Screen
        name="InputHistory"
        options={{ headerShown: false }}
      >
        {(navProps) => (
          <AnalysisHistoryScreen
            {...navProps}
            historyReadSnapshot={historyReadSnapshot}
            onBack={() => {
              try {
                if (navProps?.navigation?.canGoBack?.()) {
                  navProps.navigation.goBack();
                  return;
                }
              } catch {}

              try {
                navProps?.navigation?.navigate?.("Input");
              } catch {}
            }}
          />
        )}
      </InputStack.Screen>
      <InputStack.Screen name="CocolonGuide" component={CocolonGuideScreen} />
      <InputStack.Screen name="NoticeHistory" component={NoticeHistoryScreen} />
      <InputStack.Screen name="Account" component={AccountScreen} />
      <InputStack.Screen name="SubscriptionSelect" component={SubscriptionSelectScreen} />
      <InputStack.Screen name="FollowListScreen" component={FollowListScreen} />
    </InputStack.Navigator>
    </DeepInsightReturnCacheContext.Provider>
  );
}
