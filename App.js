import React from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createBottomTabNavigator,
  BottomTabBar,
} from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Auth
import { AuthProvider, useAuth } from "./AuthContext";
import AuthScreen from "./AuthScreen";

// Screens
import InputScreen from "./screens/InputScreen";
import MyWebScreen from "./screens/MyWebScreen";
import MyProfileScreen from "./screens/MyProfileScreen";
import FriendsScreen from "./screens/FriendsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import AccountScreen from "./screens/AccountScreen"; // アカウント画面

// 🎨 Theme
import { ThemeProvider, useTheme } from "./theme/ThemeContext";

const Tab = createBottomTabNavigator();

// ★ カスタムTabBar：Accountタブだけを非表示にしつつ、幅は5つ分で均等に
function CocolonTabBar(props) {
  const { state } = props;

  const currentRoute = state.routes[state.index];

  // Account画面のときはタブバー自体を消す
  if (currentRoute.name === "Account") {
    return null;
  }

  // Account 以外の5つだけで TabBar を描画
  const filteredRoutes = state.routes.filter(
    (route) => route.name !== "Account"
  );

  const filteredState = {
    ...state,
    routes: filteredRoutes,
  };

  return <BottomTabBar {...props} state={filteredState} />;
}

function MainTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Input"
      tabBar={(props) => <CocolonTabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case "Input":
              iconName = "create-outline";
              break;
            case "MyWeb":
              iconName = "globe-outline";
              break;
            case "MyProfile":
              iconName = "cube-outline";
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
        tabBarActiveTintColor: colors.TITLE_GOLD,
        tabBarInactiveTintColor: colors.TEXT_SUBTLE,
        tabBarStyle: {
          backgroundColor: colors.PANEL_BG,
          borderTopColor: colors.BORDER_GOLD,
        },
        tabBarLabel: ({ focused, color }) => {
          let label;
          switch (route.name) {
            case "Input":
              label = "Home";
              break;
            case "MyWeb":
              label = "MyWeb";
              break;
            case "MyProfile":
              label = "MyProfile";
              break;
            case "Friends":
              label = "Frend";
              break;
            case "Settings":
              label = "Setting";
              break;
            default:
              label = route.name;
          }
          return (
            <Text
              style={{
                color,
                fontSize: 12,
                fontWeight: focused ? "700" : "400",
              }}
            >
              {label}
            </Text>
          );
        },
      })}
    >
      {/* 5つの通常タブ */}
      <Tab.Screen name="Input" component={InputScreen} />
      <Tab.Screen name="MyWeb" component={MyWebScreen} />
      <Tab.Screen name="MyProfile" component={MyProfileScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      {/* 画面遷移専用の Account タブ（タブバーには出さない） */}
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarButton: () => null, // 念のためボタンも描画しない
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { session, initializing, recoveryMode } = useAuth();

  if (initializing) {
    // 必要であればここをSplash画面などに差し替えてOK
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  // パスワード再設定（recovery）で起動したときは、ログイン済みでも AuthScreen に留める
  if (recoveryMode) {
    return <AuthScreen />;
  }

  // ログインしていないときは AuthScreen を表示
  if (!session) {
    return <AuthScreen />;
  }

  // ログイン済みならメインタブを表示
  return <MainTabs />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </ThemeProvider>
  );
}
