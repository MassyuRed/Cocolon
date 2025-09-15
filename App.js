import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Screens
import InputScreen from "./screens/InputScreen";
import GardenScreen from "./screens/GardenScreen";
import HistoryScreen from "./screens/HistoryScreen";
import FriendsScreen from "./screens/FriendsScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Input"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;

            switch (route.name) {
              case "Input":
                iconName = "create-outline";
                break;
              case "Garden":
                iconName = "flower-outline";
                break;
              case "History":
                iconName = "time-outline";
                break;
              case "Friends":
                iconName = "people-outline";
                break;
              case "Settings":
                iconName = "settings-outline";
                break;
              default:
                iconName = "ellipse-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#6366F1", // アクティブ時の色（紫系）
          tabBarInactiveTintColor: "gray",
          tabBarLabel: ({ focused, color }) => {
            let label;
            switch (route.name) {
              case "Input":
                label = "入力";
                break;
              case "Garden":
                label = "花畑";
                break;
              case "History":
                label = "履歴";
                break;
              case "Friends":
                label = "フレンド";
                break;
              case "Settings":
                label = "設定";
                break;
              default:
                label = route.name;
            }
            return (
              <Text style={{ color, fontSize: 12, fontWeight: focused ? "700" : "400" }}>
                {label}
              </Text>
            );
          },
        })}
      >
        <Tab.Screen name="Input" component={InputScreen} />
        <Tab.Screen name="Garden" component={GardenScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Friends" component={FriendsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

