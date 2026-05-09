import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AnalysisScreen from "../screens/AnalysisScreen";
import AccountScreen from "../screens/AccountScreen";
import CocolonGuideScreen from "../screens/CocolonGuideScreen";
import SubscriptionSelectScreen from "../screens/SubscriptionSelectScreen";
import FollowListScreen from "../screens/FollowListScreen";

const AnalysisStack = createNativeStackNavigator();

export default function AnalysisStackNavigator({ onSetPieceLinkPayload, onRefreshTabUnread, route: tabRoute }) {
  return (
    <AnalysisStack.Navigator initialRouteName="Analysis" screenOptions={{ headerShown: false }}>
      <AnalysisStack.Screen name="Analysis">
        {(navProps) => (
          <AnalysisScreen
            {...navProps}
            tabRoute={tabRoute}
            onRefreshTabUnread={onRefreshTabUnread}
            onOpenPieceDeepDive={(payload) => {
              try {
                onSetPieceLinkPayload?.(payload || null);
              } catch {}
              try {
                navProps?.navigation?.navigate("Piece");
              } catch {}
            }}
            onOpenSubscription={() => {
              try {
                navProps?.navigation?.navigate("SubscriptionSelect");
              } catch {}
            }}
          />
        )}
      </AnalysisStack.Screen>
      <AnalysisStack.Screen name="Account" component={AccountScreen} />
      <AnalysisStack.Screen name="CocolonGuide" component={CocolonGuideScreen} />
      <AnalysisStack.Screen name="SubscriptionSelect" component={SubscriptionSelectScreen} />
      <AnalysisStack.Screen name="FollowListScreen" component={FollowListScreen} />
    </AnalysisStack.Navigator>
  );
}
