import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import InputScreen from "../screens/InputScreen";
import TutorialFlowScreen from "../screens/TutorialFlowScreen";
import AnalysisHistoryScreen from "../screens/AnalysisHistoryScreen";
import TodayQuestionHistoryScreen from "../screens/TodayQuestionHistoryScreen";
import CocolonGuideScreen from "../screens/CocolonGuideScreen";
import NoticeHistoryScreen from "../screens/NoticeHistoryScreen";
import AccountScreen from "../screens/AccountScreen";
import SubscriptionSelectScreen from "../screens/SubscriptionSelectScreen";
import FollowListScreen from "../screens/FollowListScreen";

const InputStack = createNativeStackNavigator();

export default function InputStackNavigator() {
  return (
    <InputStack.Navigator initialRouteName="Input" screenOptions={{ headerShown: false }}>
      <InputStack.Screen name="Input" component={InputScreen} />
      <InputStack.Screen name="TutorialIntro" component={TutorialFlowScreen} />
      <InputStack.Screen
        name="InputHistory"
        options={{ headerShown: false }}
      >
        {(navProps) => (
          <AnalysisHistoryScreen
            {...navProps}
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
      <InputStack.Screen
        name="TodayQuestionHistory"
        options={{ headerShown: false }}
      >
        {(navProps) => (
          <TodayQuestionHistoryScreen
            {...navProps}
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
  );
}
