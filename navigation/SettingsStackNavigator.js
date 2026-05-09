import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SettingsScreen from "../screens/SettingsScreen";
import SettingsAppSettingsScreen from "../screens/SettingsAppSettingsScreen";
import SettingsOtherScreen from "../screens/SettingsOtherScreen";
import AccountScreen from "../screens/AccountScreen";
import CocolonGuideScreen from "../screens/CocolonGuideScreen";
import SubscriptionSelectScreen from "../screens/SubscriptionSelectScreen";
import FollowListScreen from "../screens/FollowListScreen";
import { useTheme } from "../theme/ThemeContext";

const SettingsStack = createNativeStackNavigator();

export default function SettingsStackNavigator() {
  const { colors } = useTheme();
  return (
    <SettingsStack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.PANEL_BG },
      }}
    >
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="SettingsAppSettings" component={SettingsAppSettingsScreen} />
      <SettingsStack.Screen name="SettingsOther" component={SettingsOtherScreen} />
      <SettingsStack.Screen name="Account" component={AccountScreen} />
      <SettingsStack.Screen name="CocolonGuide" component={CocolonGuideScreen} />
      <SettingsStack.Screen name="SubscriptionSelect" component={SubscriptionSelectScreen} />
      <SettingsStack.Screen name="FollowListScreen" component={FollowListScreen} />
    </SettingsStack.Navigator>
  );
}
