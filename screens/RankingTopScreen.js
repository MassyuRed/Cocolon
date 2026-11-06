import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

import { supabase } from "../lib/supabase";
import { apiFetch, API_BASE_URL } from "../lib/apiClient";
import { PIECE_WIRE } from "../lib/compat/legacyWireContracts";
import { useTheme } from "../theme/ThemeContext";

// UI (Design System)
import CocolonPressable from "../components/CocolonPressable";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";

const API_BASE = API_BASE_URL;

const PREVIEW_LIMIT = 5;

const RANKING_PREVIEWS = [
  {
    key: "loginStreak",
    icon: "flame-outline",
    title: "連続ログイン日数ランキング",
    endpoint: "/ranking/login_streak",
    range: "year",
    routeName: "RankingLoginStreak",
    valueKeys: ["streak_days", "streak", "value", "count"],
  },
  {
    key: "inputCount",
    icon: "create-outline",
    title: "入力数ランキング",
    endpoint: "/ranking/input_count",
    range: "day",
    routeName: "RankingInputCount",
    valueKeys: ["input_count", "count", "value"],
  },
  {
    key: "inputLength",
    icon: "chatbox-ellipses-outline",
    title: "入力文字数ランキング",
    endpoint: "/ranking/input_length",
    range: "day",
    routeName: "RankingInputLength",
    valueKeys: ["total_chars", "chars", "value"],
  },
  {
    key: "resonances",
    icon: "heart-outline",
    title: "共鳴数ランキング",
    endpoint: PIECE_WIRE.routes.rankingResonances,
    range: "day",
    routeName: "RankingPieceResonances",
    valueKeys: ["resonance_count", "resonances", "count", "value"],
  },
];

function buildInitialPreviewState() {
  return RANKING_PREVIEWS.reduce((acc, item) => {
    acc[item.key] = { loading: true, error: "", rows: [] };
    return acc;
  }, {});
}

async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token || null;
}

const ACCOUNT_ROUTE_CANDIDATES = [
  "Account",
  "AccountPage",
  "AccountScreen",
  "UserAccount",
  "UserPage",
  "UserProfile",
  "Profile",
];

function navigateToAccount(navigation, userId) {
  if (!userId) return;

  const params = { viewedUserId: userId, userId, user_id: userId };

  let nav = navigation;
  while (nav) {
    const state = nav.getState?.();
    const routeNames = state?.routeNames;

    if (Array.isArray(routeNames)) {
      const name = ACCOUNT_ROUTE_CANDIDATES.find((c) => routeNames.includes(c));
      if (name) {
        try {
          nav.navigate(name, params);
        } catch {
          // noop
        }
        return;
      }
    }

    nav = nav.getParent?.();
  }

  // fallback
  try {
    navigation?.navigate?.(ACCOUNT_ROUTE_CANDIDATES[0], params);
  } catch {
    // noop
  }
}

function extractRankingRows(json) {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.items)) return json.items;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.rows)) return json.rows;
  return [];
}

function pickRankingValue(row, keys) {
  const src = row && typeof row === "object" ? row : {};
  for (const key of Array.isArray(keys) ? keys : []) {
    if (src[key] !== undefined && src[key] !== null && src[key] !== "") {
      return String(src[key]);
    }
  }
  return "0";
}

async function fetchRankingPreview(config, accessToken) {
  if (!accessToken) throw new Error("access_token が取得できませんでした");

  const url = new URL(config.endpoint, API_BASE);
  url.searchParams.set("range", config.range);
  url.searchParams.set("limit", String(PREVIEW_LIMIT));

  const res = await apiFetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`APIエラー: ${res.status} ${text}`);
  }

  const json = await res.json().catch(() => null);
  return extractRankingRows(json).slice(0, PREVIEW_LIMIT);
}

/**
 * RankingTopScreen
 * - ランキング機能のTOP
 * - 各ランキングの上位5件を最初から表示
 */
export default function RankingTopScreen({ navigation }) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";

  const [previewState, setPreviewState] = useState(() => buildInitialPreviewState());

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setPreviewState(buildInitialPreviewState());

      try {
        const accessToken = await getAccessToken();
        const results = await Promise.all(
          RANKING_PREVIEWS.map(async (config) => {
            try {
              const rows = await fetchRankingPreview(config, accessToken);
              return [config.key, { loading: false, error: "", rows }];
            } catch (e) {
              return [
                config.key,
                {
                  loading: false,
                  error: String(e?.message || e || "ランキングを取得できませんでした"),
                  rows: [],
                },
              ];
            }
          })
        );

        if (!cancelled) {
          const nextState = results.reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {});
          setPreviewState(nextState);
        }
      } catch (e) {
        if (!cancelled) {
          const errorState = RANKING_PREVIEWS.reduce((acc, item) => {
            acc[item.key] = {
              loading: false,
              error: String(e?.message || e || "ランキングを取得できませんでした"),
              rows: [],
            };
            return acc;
          }, {});
          setPreviewState(errorState);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handlePressGuide = () => {
    try {
      navigation?.navigate?.("CocolonGuide", { screenId: "RankingTopScreen" });
    } catch {
      // noop
    }
  };

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.panelHeader}>
          <View style={styles.panelTitleRow}>
            <Text style={styles.panelTitle}>ランキング</Text>
            <CocolonPressable
              style={styles.guideTitleButton}
              onPress={handlePressGuide}
              accessibilityLabel="ガイドを開く"
            >
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={colors.TEXT_ON_LIGHT}
              />
            </CocolonPressable>
          </View>
        </View>

        <View style={styles.rankingList}>
          {RANKING_PREVIEWS.map((config) => (
            <RankingPreviewCard
              key={config.key}
              styles={styles}
              colors={colors}
              config={config}
              state={previewState[config.key]}
              navigation={navigation}
              onOpenAll={() => navigation?.navigate?.(config.routeName)}
            />
          ))}
        </View>

        <View style={styles.noteCard}>
          <Ionicons name="information-circle-outline" size={16} color={colors.TEXT_SUBTLE} />
          <Text style={styles.noteText}>
            集計の区切りは日本時間（JST）0:00です。
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function RankingPreviewCard({ styles, colors, config, state, navigation, onOpenAll }) {
  const rows = Array.isArray(state?.rows) ? state.rows : [];

  return (
    <View style={styles.rankingCard}>
      <View style={styles.rankingCardHeader}>
        <View style={styles.rankingIconWrap}>
          <Ionicons name={config.icon} size={20} color={colors.ON_SURFACE_TONAL} />
        </View>
        <Text style={styles.rankingCardTitle}>
          {config.title}
        </Text>
      </View>

      <View style={styles.previewBody}>
        {state?.loading ? (
          <View style={styles.previewStatusRow}>
            <ActivityIndicator size="small" color={colors.TITLE_GOLD} />
            <Text style={styles.previewStatusText}>読み込み中…</Text>
          </View>
        ) : state?.error ? (
          <Text style={styles.previewErrorText}>ランキングを取得できませんでした</Text>
        ) : rows.length <= 0 ? (
          <Text style={styles.previewEmptyText}>データがありません</Text>
        ) : (
          rows.map((row, index) => (
            <RankingPreviewRow
              key={`${config.key}-${row?.user_id || row?.userId || row?.id || index}`}
              styles={styles}
              row={row}
              index={index}
              valueKeys={config.valueKeys}
              navigation={navigation}
            />
          ))
        )}
      </View>

      <CocolonPressable
        style={styles.showAllButton}
        onPress={onOpenAll}
        accessibilityLabel={`${config.title}を全表示`}
      >
        <Text style={styles.showAllButtonText}>全表示</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.ON_SURFACE_TONAL} />
      </CocolonPressable>
    </View>
  );
}

function RankingPreviewRow({ styles, row, index, valueKeys, navigation }) {
  const rank = row?.rank ?? index + 1;
  const name = String(row?.display_name || row?.name || "—").trim() || "—";
  const value = pickRankingValue(row, valueKeys);
  const userId = row?.user_id || row?.userId || row?.id;
  const isPrivateAccount = !!(row?.is_private_account ?? row?.isPrivateAccount);
  const onPressAccount = userId ? () => navigateToAccount(navigation, userId) : undefined;

  return (
    <TouchableOpacity
      style={styles.previewRow}
      onPress={onPressAccount}
      disabled={!onPressAccount}
      activeOpacity={0.85}
    >
      <View style={styles.previewPrimaryRow}>
        <Text style={[styles.previewRankText, styles.previewRankLabel]}>
          {rank}位
        </Text>
        <View style={[styles.previewNameWrap, onPressAccount && styles.previewNameTap]}>
          <View style={styles.previewNameLabelRow}>
            <Text style={styles.previewNameText}>
              {name}
            </Text>
            {isPrivateAccount ? (
              <Ionicons name="shield-outline" size={13} style={styles.privateShield} />
            ) : null}
          </View>
        </View>
      </View>
      <View style={styles.previewValueRow}>
        <View style={{ flex: 1 }} />
        <Text style={styles.previewValueText}>{value}</Text>
      </View>
    </TouchableOpacity>
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
    scrollContainer: {
      paddingTop: 16,
      paddingBottom: 32,
      alignItems: "stretch",
      paddingHorizontal: 16,
      flexGrow: 1,
      width: "100%",
      maxWidth: 640,
      alignSelf: "center",
    },
    panelHeader: {
      flexDirection: "column",
      alignItems: "stretch",
      justifyContent: "flex-start",
      marginBottom: 24,
      gap: 8,
    },
    panelTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      letterSpacing: 0,
      flexShrink: 1,
      minWidth: 0,
    },
    panelTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      minWidth: 0,
      alignSelf: "stretch",
    },
    guideTitleButton: {
      width: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      marginLeft: 10,
      minHeight: 44,
      flexShrink: 0,
    },

    rankingList: {
      marginTop: 4,
    },
    rankingCard: {
      borderRadius: ui?.radius?.card ?? 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    rankingCardHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 16,
      minWidth: 0,
    },
    rankingIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.SURFACE_TONAL,
      borderWidth: 1,
      borderColor: COLORS.SURFACE_TONAL,
      marginRight: 12,
    },
    rankingCardTitle: {
      flex: 1,
      textAlign: "left",
      color: COLORS.TEXT_ON_LIGHT,
      minWidth: 0,
    },
    previewBody: {
      borderTopWidth: 1,
      borderTopColor: COLORS.CARD_BORDER,
      paddingTop: 8,
    },
    previewStatusRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      flexWrap: "wrap",
    },
    previewStatusText: {
      marginLeft: 8,
      color: COLORS.TEXT_SUBTLE,
      flexShrink: 1,
    },
    previewErrorText: {
      paddingVertical: 16,
      color: COLORS.ERROR,
    },
    previewEmptyText: {
      paddingVertical: 16,
      color: COLORS.TEXT_SUBTLE,
    },
    previewRow: {
      minHeight: 44,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
    },
    previewPrimaryRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      minWidth: 0,
    },
    previewRankText: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
      minWidth: 0,
    },
    previewRankLabel: {
      flexShrink: 0,
      marginRight: 8,
    },
    previewNameWrap: {
      flexDirection: "row",
      alignItems: "flex-start",
      alignSelf: "flex-start",
      maxWidth: "100%",
      flex: 1,
      minWidth: 0,
    },
    previewNameLabelRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      flexShrink: 1,
      minWidth: 0,
      flex: 1,
    },
    previewNameText: {
      flexShrink: 1,
      minWidth: 0,
      color: COLORS.TEXT_ON_LIGHT,
    },
    privateShield: {
      marginLeft: 6,
      color: COLORS.TEXT_SUBTLE,
      flexShrink: 0,
    },
    previewNameTap: {
      paddingVertical: 2,
      paddingHorizontal: 2,
      borderRadius: 10,
      minWidth: 0,
    },
    previewValueRow: {
      marginTop: 8,
      flexDirection: "row",
      alignItems: "center",
      minWidth: 0,
    },
    previewValueText: {
      color: COLORS.TEXT_ON_LIGHT,
      marginLeft: 10,
      flexShrink: 1,
      textAlign: "right",
      minWidth: 0,
    },
    showAllButton: {
      marginTop: 10,
      alignSelf: "flex-end",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: ui?.radius?.button ?? 24,
      borderWidth: 1,
      borderColor: COLORS.SURFACE_TONAL,
      backgroundColor: COLORS.SURFACE_TONAL,
      minHeight: 44,
      maxWidth: "100%",
    },
    showAllButtonText: {
      marginRight: 3,
      color: COLORS.ON_SURFACE_TONAL,
      flexShrink: 1,
      textAlign: "center",
    },

    noteCard: {
      marginTop: 2,
      flexDirection: "row",
      alignItems: "flex-start",
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    noteText: {
      marginLeft: 8,
      color: COLORS.TEXT_SUBTLE,
      flex: 1,
    },
  }, ui, {"panelTitle":"screenTitle","rankingCardTitle":"sectionTitle","previewStatusText":"description","previewErrorText":"description","previewEmptyText":"description","previewRankText":"body","previewNameText":"body","previewValueText":"body","showAllButtonText":"button","noteText":"description"}));
}
