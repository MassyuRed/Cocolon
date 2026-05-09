import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RankingTopScreen from "../screens/RankingTopScreen";
import EmotionRankingScreen from "../screens/EmotionRankingScreen";
import InputCountRankingScreen from "../screens/InputCountRankingScreen";
import InputLengthRankingScreen from "../screens/InputLengthRankingScreen";
import PieceResonanceRankingScreen from "../screens/PieceResonanceRankingScreen";
import LoginStreakRankingScreen from "../screens/LoginStreakRankingScreen";
import AccountScreen from "../screens/AccountScreen";
import CocolonGuideScreen from "../screens/CocolonGuideScreen";
import SubscriptionSelectScreen from "../screens/SubscriptionSelectScreen";
import FollowListScreen from "../screens/FollowListScreen";

const RankingStack = createNativeStackNavigator();

export default function RankingStackNavigator() {
  return (
    <RankingStack.Navigator initialRouteName="RankingTop" screenOptions={{ headerShown: false }}>
      <RankingStack.Screen name="RankingTop" component={RankingTopScreen} />
      <RankingStack.Screen name="RankingEmotion" component={EmotionRankingScreen} />
      <RankingStack.Screen name="RankingInputCount" component={InputCountRankingScreen} />
      <RankingStack.Screen name="RankingInputLength" component={InputLengthRankingScreen} />
      <RankingStack.Screen name="RankingPieceResonances" component={PieceResonanceRankingScreen} />
      <RankingStack.Screen name="RankingLoginStreak" component={LoginStreakRankingScreen} />
      <RankingStack.Screen name="Account" component={AccountScreen} />
      <RankingStack.Screen name="CocolonGuide" component={CocolonGuideScreen} />
      <RankingStack.Screen name="SubscriptionSelect" component={SubscriptionSelectScreen} />
      <RankingStack.Screen name="FollowListScreen" component={FollowListScreen} />
    </RankingStack.Navigator>
  );
}
