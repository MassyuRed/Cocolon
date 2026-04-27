import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
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
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />
      <View style={styles.body}>
        <View style={styles.headerRow}>
          <View style={styles.headerSide}>
            <CocolonBackButton
              navigation={navigation}
              fallbackRouteName="Piece"
              accessibilityLabel="Pieceに戻る"
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
              <Text style={styles.messageTitle}>Piece詳細を開けませんでした</Text>
              <Text style={styles.messageText}>
                共通Piece詳細画面の登録状況を確認してください。
              </Text>
            </>
          ) : (
            <>
              <ActivityIndicator />
              <Text style={styles.messageText}>Piece詳細へ移動しています…</Text>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

function createStyles(COLORS, ui) {
  const font = ui?.font || {};
  const text = ui?.text || {};
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.PANEL_BG },
    body: { flex: 1, paddingTop: 16, paddingHorizontal: 18, paddingBottom: 18 },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14,
    },
    headerSide: {
      width: 34,
      alignItems: "flex-start",
      justifyContent: "center",
    },
    headerCenter: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    titleText: {
      fontSize: font.title ?? 20,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      letterSpacing: 0.8,
    },
    messageCard: {
      borderRadius: ui?.radius?.md ?? 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 14,
      paddingVertical: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    messageTitle: {
      fontSize: font.body ?? 14,
      fontWeight: "800",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginBottom: 8,
      textAlign: "center",
    },
    messageText: {
      marginTop: 10,
      fontSize: font.body ?? 14,
      lineHeight: 20,
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      textAlign: "center",
    },
  });
}
