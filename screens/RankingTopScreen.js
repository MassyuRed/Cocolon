import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { supabase } from "../lib/supabase";
import { apiFetch } from "../lib/apiClient";
import { useTheme } from "../theme/ThemeContext";

// UI (Design System)
import CocolonPressable from "../components/CocolonPressable";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";

const API_BASE =
  process.env.EXPO_PUBLIC_MYMODEL_API_URL || "https://mashos-api.onrender.com";

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
    key: "pieceGenerated",
    icon: "help-circle-outline",
    title: "Piece生成数ランキング",
    endpoint: "/ranking/mymodel_questions",
    range: "year",
    routeName: "RankingMyModelQuestions",
    valueKeys: [
      "mymodel_questions_total",
      "questions_total",
      "question_total",
      "question_count",
      "count",
      "value",
    ],
  },
  {
    key: "resonances",
    icon: "heart-outline",
    title: "共鳴数ランキング",
    endpoint: "/ranking/mymodel_resonances",
    range: "day",
    routeName: "RankingMyModelResonances",
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
    <SafeAreaView style={styles.container}>
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
            <Text style={styles.panelTitle}>Ranking</Text>
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

function RankingPreviewCard({ styles, colors, config, state, onOpenAll }) {
  const rows = Array.isArray(state?.rows) ? state.rows : [];

  return (
    <View style={styles.rankingCard}>
      <View style={styles.rankingCardHeader}>
        <View style={styles.rankingIconWrap}>
          <Ionicons name={config.icon} size={20} color={colors.TEXT_ON_LIGHT} />
        </View>
        <Text style={styles.rankingCardTitle} numberOfLines={2}>
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
              key={`${config.key}-${row?.user_id || row?.id || index}`}
              styles={styles}
              row={row}
              index={index}
              valueKeys={config.valueKeys}
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
        <Ionicons name="chevron-forward" size={16} color={colors.ACCENT_TEXT} />
      </CocolonPressable>
    </View>
  );
}

function RankingPreviewRow({ styles, row, index, valueKeys }) {
  const rank = row?.rank ?? index + 1;
  const name = String(row?.display_name || row?.name || "—").trim() || "—";
  const value = pickRankingValue(row, valueKeys);
  const isPrivateAccount = !!(row?.is_private_account ?? row?.isPrivateAccount);

  return (
    <View style={styles.previewRow}>
      <Text style={styles.previewRankText}>{rank}位</Text>
      <View style={styles.previewNameWrap}>
        <Text style={styles.previewNameText} numberOfLines={1}>
          {name}
        </Text>
        {isPrivateAccount ? (
          <Ionicons name="shield-outline" size={13} style={styles.privateShield} />
        ) : null}
      </View>
      <Text style={styles.previewValueText}>{value}</Text>
    </View>
  );
}

function createStyles(COLORS, ui) {
  const font = ui?.font || {};
  const text = ui?.text || {};

  return StyleSheet.create(applyTypographyTokens({
    container: { flex: 1, backgroundColor: COLORS.PANEL_BG },
    scrollContainer: {
      paddingTop: 16,
      paddingBottom: 32,
      alignItems: "stretch",
      paddingHorizontal: 18,
    },
    panelHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    panelTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      letterSpacing: 0.8,
    },
    panelTitleRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    guideTitleButton: {
      width: 36,
      height: 32,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      marginLeft: 10,
    },

    rankingList: {
      marginTop: 4,
    },
    rankingCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginBottom: 14,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    rankingCardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    rankingIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.PANEL_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      marginRight: 10,
    },
    rankingCardTitle: {
      flex: 1,
      textAlign: "right",
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "900",
      color: COLORS.TITLE_GOLD,
    },
    previewBody: {
      borderTopWidth: 1,
      borderTopColor: COLORS.CARD_BORDER,
      paddingTop: 4,
    },
    previewStatusRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
    },
    previewStatusText: {
      marginLeft: 8,
      fontSize: 12,
      color: text.description ?? COLORS.TEXT_ON_LIGHT,
    },
    previewErrorText: {
      paddingVertical: 10,
      fontSize: 12,
      color: "#B91C1C",
    },
    previewEmptyText: {
      paddingVertical: 10,
      fontSize: 12,
      color: COLORS.TEXT_SUBTLE,
    },
    previewRow: {
      minHeight: 34,
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 7,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
    },
    previewRankText: {
      width: 42,
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
    },
    previewNameWrap: {
      flex: 1,
      minWidth: 0,
      flexDirection: "row",
      alignItems: "center",
      paddingRight: 8,
    },
    previewNameText: {
      flexShrink: 1,
      minWidth: 0,
      fontSize: font.body ?? 13,
      fontWeight: "700",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    privateShield: {
      marginLeft: 5,
      color: COLORS.TITLE_GOLD,
      opacity: 0.7,
    },
    previewValueText: {
      minWidth: 44,
      textAlign: "right",
      fontSize: 13,
      fontWeight: "900",
      color: COLORS.TEXT_ON_LIGHT,
    },
    showAllButton: {
      marginTop: 10,
      alignSelf: "flex-end",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
    },
    showAllButtonText: {
      marginRight: 3,
      fontSize: 12,
      fontWeight: "900",
      color: COLORS.ACCENT_TEXT,
    },

    noteCard: {
      marginTop: 2,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    noteText: {
      marginLeft: 8,
      fontSize: font.description ?? 9,
      color: text.description ?? COLORS.TEXT_ON_LIGHT,
      flex: 1,
    },
  }, ui));
}
