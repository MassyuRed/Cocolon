import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import CocolonBackButton from "../components/CocolonBackButton";

function hasRouteNameInState(state, routeName) {
  if (!state) return false;
  const routeNames = state?.routeNames;
  if (Array.isArray(routeNames) && routeNames.includes(routeName)) return true;
  const routes = state?.routes;
  if (Array.isArray(routes)) {
    for (const route of routes) {
      if (route?.state && hasRouteNameInState(route.state, routeName)) {
        return true;
      }
    }
  }
  return false;
}

function resolvePieceLibraryRouteName(navigation) {
  const candidates = ["PieceLibrary", "PieceLibraryScreen"];
  const root = navigation?.getRootState?.();
  const local = navigation?.getState?.();

  for (const name of candidates) {
    if (hasRouteNameInState(root, name) || hasRouteNameInState(local, name)) {
      return name;
    }
  }
  return "PieceLibrary";
}

export default function ResonanceHistoryDetailScreen({ navigation, route }) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = String(themeName || "").toLowerCase() === "dark";
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const routeName = resolvePieceLibraryRouteName(navigation);
    const params = {
      viewedUserId:
        route?.params?.owner_user_id ||
        route?.params?.ownerUserId ||
        null,
      openQInstanceId:
        route?.params?.q_instance_id ||
        route?.params?.qInstanceId ||
        null,
      openQKey:
        route?.params?.q_key ||
        route?.params?.qKey ||
        null,
      openTitle:
        route?.params?.title ||
        null,
      source: "resonance_history_detail",
      openAt: Date.now(),
    };

    try {
      navigation?.replace?.(routeName, params);
      return;
    } catch {
      // noop
    }

    try {
      navigation?.navigate?.(routeName, params);
      return;
    } catch {
      // noop
    }

    setFailed(true);
  }, [navigation, route?.params]);

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.headerRow}>
          <View style={styles.headerSide}>
            <CocolonBackButton
              navigation={navigation}
              fallbackRouteName="Piece"
              accessibilityLabel="ピースに戻る"
            />
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.titleText}>共鳴履歴</Text>
          </View>
          <View style={styles.headerSide} />
        </View>

        <View style={styles.messageCard}>
          {failed ? (
            <>
              <Text style={styles.messageTitle}>ピース詳細を開けませんでした</Text>
              <Text style={styles.messageText}>
                戻って、もう一度ピースを選んでください。
              </Text>
            </>
          ) : (
            <>
              <ActivityIndicator />
              <Text style={styles.messageText}>ピース詳細へ移動しています…</Text>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(COLORS, ui) {
  const font = ui?.font || {};
  const text = ui?.text || {};
  return StyleSheet.create(applyTypographyTokens({
    container: {
      flex: 1,
      backgroundColor: COLORS.BG_SILVER,
    },
    body: {
      flexGrow: 1,
      paddingTop: 16,
      paddingHorizontal: 20,
      paddingBottom: 20,
      width: "100%",
      maxWidth: 680,
      alignSelf: "center",
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    headerSide: {
      width: 52,
      alignItems: "flex-start",
      justifyContent: "center",
      minHeight: 44,
    },
    headerCenter: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    titleText: {
      color: COLORS.TITLE_GOLD,
      letterSpacing: 0,
      textAlign: "center",
      flexShrink: 1,
    },
    messageCard: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 20,
      paddingVertical: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    messageTitle: {
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginBottom: 8,
      textAlign: "center",
    },
    messageText: {
      marginTop: 10,
      color: COLORS.TEXT_SUBTLE,
      textAlign: "center",
    },
  }, ui, {"titleText":"screenTitle","messageTitle":"sectionTitle","messageText":"body"}));
}
