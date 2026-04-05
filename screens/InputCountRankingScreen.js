import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CocolonBackButton from "../components/CocolonBackButton";

import { supabase } from "../lib/supabase";
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { apiFetch } from "../lib/apiClient";

const API_BASE =
  process.env.EXPO_PUBLIC_MYMODEL_API_URL || "https://mashos-api.onrender.com";

const RANGE_OPTIONS = [
  { key: "day", label: "今日" },
  { key: "week", label: "過去7日間" },
  { key: "month", label: "過去30日間" },
  { key: "year", label: "トータル" },
];

async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token || null;
}

async function fetchJsonWithAuth(url) {
  const token = await getAccessToken();
  if (!token) throw new Error("access_token が取得できませんでした");

  const res = await apiFetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`APIエラー: ${res.status} ${t}`);
  }

  const json = await res.json().catch(() => null);
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.items)) return json.items;
  if (json && Array.isArray(json.data)) return json.data;
  return [];
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

function RangeSelector({ styles, colors, value, onChange }) {
  return (
    <View style={styles.rangeRow}>
      {RANGE_OPTIONS.map((opt) => {
        const on = opt.key === value;
        return (
          <TouchableOpacity
            key={opt.key}
            style={[styles.rangeChip, on && styles.rangeChipOn]}
            onPress={() => onChange(opt.key)}
            activeOpacity={0.85}
          >
            <Text style={[styles.rangeText, on && styles.rangeTextOn]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function RankingHeader({ styles, title, navigation }) {
  return (
    <View style={styles.panelHeader}>
      <CocolonBackButton
        navigation={navigation}
        fallbackRouteName="RankingTop"
        style={styles.backBtn}
      />

      <Text style={styles.panelTitle}>{title}</Text>

      <View style={{ width: 72 }} />
    </View>
  );
}

function RankingRow({ styles, left, right, onPressLeft, isPrivateAccount }) {
  const raw = String(left ?? "");
  const i = raw.indexOf("位");
  const rankLabel = i >= 0 ? raw.slice(0, i + 1).trim() : "";
  const nameLabel = i >= 0 ? raw.slice(i + 1).trim() : raw;

  return (
    <TouchableOpacity
      style={styles.rowCard}
      onPress={onPressLeft}
      disabled={!onPressLeft}
      activeOpacity={0.85}
    >
      <View style={styles.rowTop}>
        {rankLabel ? (
          <Text style={[styles.rowLeft, { flexShrink: 0, marginRight: 6 }]}>
            {rankLabel}
          </Text>
        ) : null}

        <View style={[styles.nameRow, onPressLeft && styles.nameTap]}>
          <View style={styles.nameLabelRow}>
            <Text style={[styles.rowLeft, styles.nameLabelText]} numberOfLines={1}>
              {nameLabel}
            </Text>
            {isPrivateAccount ? (
              <Ionicons name="shield-outline" size={14} style={styles.privateShield} />
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.rowBottom}>
        <View style={{ flex: 1 }} />
        <Text style={styles.rowRight}>{right}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function InputCountRankingScreen({ navigation }) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";

  const [range, setRange] = useState("day");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const url = new URL("/ranking/input_count", API_BASE);
      url.searchParams.set("range", range);
      url.searchParams.set("limit", "100");
      const data = await fetchJsonWithAuth(url.toString());
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      const msg = String(e?.message || e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!error) return;
    // 画面上にも出すけど、初期は気づきやすいようにアラートも出す
    Alert.alert("ランキング取得エラー", error);
  }, [error]);



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <RankingHeader styles={styles} title="入力数ランキング" navigation={navigation} />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>集計範囲</Text>
          <RangeSelector
            styles={styles}
            colors={colors}
            value={range}
            onChange={setRange}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ランキング</Text>

          {loading ? (
            <ActivityIndicator style={{ marginTop: 10 }} />
          ) : error ? (
            <Text style={styles.errorText}>取得エラー: {error}</Text>
          ) : rows.length === 0 ? (
            <Text style={styles.emptyText}>データがありません</Text>
          ) : (
            rows.map((r, idx) => {
              const userId = r?.user_id || r?.userId || r?.id;

              return (
                <RankingRow
                  key={`${r?.user_id || "user"}-${idx}`}
                  styles={styles}
                  onPressLeft={
                    userId ? () => navigateToAccount(navigation, userId) : undefined
                  }
                  isPrivateAccount={!!(r?.is_private_account || r?.isPrivateAccount)}
                  left={`${r?.rank ?? idx + 1}位  ${r?.display_name || r?.name || "—"}`}
                  sub={null}
                  right={`${r?.input_count ?? r?.count ?? 0}`}
                />
              );;
            })
          )}
        </View>

        <TouchableOpacity
          style={styles.reloadBtn}
          onPress={load}
          activeOpacity={0.85}
        >
          <Ionicons name="refresh-outline" size={16} color={colors.ACCENT_TEXT} />
          <Text style={styles.reloadText}>更新</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(COLORS, ui) {
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
      fontSize: 18,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      letterSpacing: 0.6,
    },
    backBtn: {
      width: 72,
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 4,
    },
    backText: {
      marginLeft: 2,
      fontSize: 12,
      color: COLORS.TEXT_SUBTLE,
      fontWeight: "600",
    },

    section: { marginTop: 6, marginBottom: 10 },
    sectionLabel: {
      fontSize: 12,
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 8,
    },

    rangeRow: {
      flexDirection: "row",
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      overflow: "hidden",
    },
    rangeChip: {
      flex: 1,
      paddingVertical: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    rangeChipOn: {
      backgroundColor: COLORS.GOLD_BUTTON,
    },
    rangeText: {
      fontSize: 12,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },
    rangeTextOn: {
      color: COLORS.ACCENT_TEXT,
    },

    rowCard: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginBottom: 8,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    rowTop: {
      flexDirection: "row",
      alignItems: "center",
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      maxWidth: "100%",
    },
    nameLabelRow: {
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 1,
      minWidth: 0,
    },
    nameLabelText: {
      flexShrink: 1,
      minWidth: 0,
    },
    privateShield: {
      marginLeft: 6,
      color: COLORS.TITLE_GOLD,
      opacity: 0.7,
    },
    nameTap: {
      paddingVertical: 2,
      paddingHorizontal: 2,
      borderRadius: 10,
    },
    rowBottom: {
      marginTop: 8,
      flexDirection: "row",
      alignItems: "center",
    },rowLeft: {
      fontSize: 13,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
    },
    rowSub: {
      marginTop: 2,
      fontSize: 11,
      color: COLORS.TEXT_SUBTLE,
    },
    rowRight: {
      fontSize: 13,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      marginLeft: 10,
    },

    errorText: { color: "#B91C1C" },
    emptyText: { color: COLORS.TEXT_SUBTLE },

    reloadBtn: {
      marginTop: 6,
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    reloadText: {
      marginLeft: 6,
      color: COLORS.ACCENT_TEXT,
      fontWeight: "800",
      fontSize: 12,
    },
  }, ui));
}
