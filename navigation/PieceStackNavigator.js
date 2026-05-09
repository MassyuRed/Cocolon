import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PieceEntryScreen from "../screens/PieceEntryScreen";
import PieceLibraryScreen from "../screens/PieceLibraryScreen";
import TutorialFlowScreen from "../screens/TutorialFlowScreen";
import PieceHistoryMenuScreen from "../screens/PieceHistoryMenuScreen";
import ResonanceHistoryListScreen from "../screens/ResonanceHistoryListScreen";
import ResonanceHistoryDetailScreen from "../screens/ResonanceHistoryDetailScreen";
import EmotionLogScreen from "../screens/EmotionLogScreen";
import AccountScreen from "../screens/AccountScreen";
import CocolonGuideScreen from "../screens/CocolonGuideScreen";
import SubscriptionSelectScreen from "../screens/SubscriptionSelectScreen";
import FollowListScreen from "../screens/FollowListScreen";

const PieceStack = createNativeStackNavigator();

export default function PieceStackNavigator({ linkPayload, onConsumeLinkPayload, onEmotionLogDisplayed }) {
  return (
    <PieceStack.Navigator initialRouteName="Piece" screenOptions={{ headerShown: false }}>
      <PieceStack.Screen name="Piece">
        {(navProps) => (
          <PieceEntryScreen
            {...navProps}
            linkPayload={linkPayload}
            onConsumeLinkPayload={onConsumeLinkPayload}
            onOpenSubscription={() => {
              try {
                navProps?.navigation?.navigate("SubscriptionSelect");
              } catch {}
            }}
          />
        )}
      </PieceStack.Screen>

      <PieceStack.Screen name="PieceLibrary" component={PieceLibraryScreen} />
      <PieceStack.Screen name="TutorialFlow" component={TutorialFlowScreen} />
      <PieceStack.Screen name="PieceHistory" component={PieceHistoryMenuScreen} />
      <PieceStack.Screen name="ResonanceHistoryList" component={ResonanceHistoryListScreen} />
      <PieceStack.Screen name="ResonanceHistoryDetail" component={ResonanceHistoryDetailScreen} />
      <PieceStack.Screen name="EmotionLog">
        {(navProps) => (
          <EmotionLogScreen
            {...navProps}
            screenMode="log"
            onEmotionLogDisplayed={onEmotionLogDisplayed}
          />
        )}
      </PieceStack.Screen>
      <PieceStack.Screen name="Account" component={AccountScreen} />
      <PieceStack.Screen name="CocolonGuide" component={CocolonGuideScreen} />
      <PieceStack.Screen name="SubscriptionSelect" component={SubscriptionSelectScreen} />
      <PieceStack.Screen name="FollowListScreen" component={FollowListScreen} />
    </PieceStack.Navigator>
  );
}
