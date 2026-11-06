import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { useTheme } from "../theme/ThemeContext";
import { useSubscription } from "../SubscriptionContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { supabase } from "../lib/supabase";
import { getHistoryRetentionLabel } from "../lib/historyRetentionLabel";
import CocolonBackButton from "../components/CocolonBackButton";
import CocolonPressable from "../components/CocolonPressable";
import { apiFetch, API_BASE_URL } from "../lib/apiClient";
import { PIECE_WIRE } from "../lib/compat/legacyWireContracts";

const API_BASE = API_BASE_URL;

const RESONANCE_PIECES_ENDPOINT = `${API_BASE}${PIECE_WIRE.routes.resonancePieces}`;
const PAGE_LIMIT = 50;

function formatDateTime(isoString) {
  try {
    const d = new Date(String(isoString || ""));
    if (Number.isNaN(d.getTime())) return String(isoString || "");
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${y}/${m}/${da} ${h}:${mi}`;
  } catch {
    return String(isoString || "");
  }
}

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

export default function ResonanceHistoryListScreen({ navigation }) {
  const { colors, themeName } = useTheme();
  const { tier: subscriptionTier, loading: subscriptionLoading } = useSubscription();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);

  const isDark = String(themeName || "").toLowerCase() === "dark";
  const historyRetentionLabel = useMemo(
    () => getHistoryRetentionLabel(subscriptionTier),
    [subscriptionTier]
  );
  const showHistoryRetentionLabel = !subscriptionLoading && !!historyRetentionLabel;

  const [order, setOrder] = useState("newest");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [errorText, setErrorText] = useState("");

  const abortRef = useRef(null);

  const fetchPage = useCallback(async ({ nextOrder, nextOffset, append }) => {
    const resolvedOrder = String(nextOrder || "newest").toLowerCase();
    const resolvedOffset = Math.max(0, Number(nextOffset || 0) || 0);

    try {
      abortRef.current?.abort?.();
    } catch {
      // noop
    }
    const controller = new AbortController();
    abortRef.current = controller;

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token ?? null;
    if (!accessToken) {
      throw new Error("ログイン情報が取得できませんでした。");
    }

    const url = `${RESONANCE_PIECES_ENDPOINT}?order=${encodeURIComponent(
      resolvedOrder
    )}&limit=${PAGE_LIMIT}&offset=${resolvedOffset}`;

    const res = await apiFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      signal: controller.signal,
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      const detail = json?.detail ? String(json.detail) : null;
      throw new Error(detail || "履歴の取得に失敗しました。");
    }

    const nextItems = Array.isArray(json?.items) ? json.items : [];
    setItems((prev) => {
      const merged = append ? [...(prev || []), ...nextItems] : nextItems;
      const seen = new Set();
      const out = [];
      for (const item of merged) {
        const key = String(item?.q_instance_id || "").trim();
        if (!key || seen.has(key)) continue;
        seen.add(key);
        out.push(item);
      }
      return out;
    });

    setHasMore(nextItems.length >= PAGE_LIMIT);
    setErrorText("");
  }, []);

  const fetchInitial = useCallback(async (nextOrder = order) => {
    setLoading(true);
    setLoadingMore(false);
    setHasMore(true);
    try {
      await fetchPage({ nextOrder, nextOffset: 0, append: false });
    } finally {
      setLoading(false);
    }
  }, [fetchPage, order]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchInitial(order);
    } finally {
      setRefreshing(false);
    }
  }, [fetchInitial, order]);

  const loadMore = useCallback(async () => {
    if (loading || refreshing || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextOffset = (items?.length || 0) || 0;
      await fetchPage({ nextOrder: order, nextOffset, append: true });
    } catch (e) {
      setErrorText(String(e?.message || e || "読み込みに失敗しました。"));
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [fetchPage, hasMore, items?.length, loading, loadingMore, order, refreshing]);

  useFocusEffect(
    useCallback(() => {
      fetchInitial(order).catch((e) => {
        setErrorText(String(e?.message || e || "読み込みに失敗しました。"));
        setLoading(false);
      });

      return () => {
        try {
          abortRef.current?.abort?.();
        } catch {
          // noop
        }
      };
    }, [fetchInitial, order])
  );

  const setOrderAndReload = useCallback(async (next) => {
    const value = String(next || "newest").toLowerCase();
    if (value === order) return;
    setOrder(value);
    try {
      await fetchInitial(value);
    } catch (e) {
      setErrorText(String(e?.message || e || "読み込みに失敗しました。"));
    }
  }, [fetchInitial, order]);

  const openPieceDetail = useCallback((item) => {
    const routeName = resolvePieceLibraryRouteName(navigation);
    const params = {
      viewedUserId: item?.owner_user_id || null,
      openQInstanceId: item?.q_instance_id || null,
      openQKey: item?.q_key || null,
      openTitle: item?.title || null,
      source: "resonance_history",
      openAt: Date.now(),
    };

    try {
      navigation?.navigate?.(routeName, params);
      return;
    } catch {
      // noop
    }

    try {
      const parent =
        typeof navigation?.getParent === "function" ? navigation.getParent() : null;
      parent?.navigate?.(routeName, params);
    } catch {
      // noop
    }
  }, [navigation]);

  const renderItem = useCallback(({ item }) => {
    const title = String(item?.title || "").trim() || "（未設定）";
    const owner = String(item?.owner_display_name || "").trim() || "—";
    const savedAt = formatDateTime(item?.saved_at);

    return (
      <CocolonPressable
        style={styles.card}
        onPress={() => openPieceDetail(item)}
        accessibilityLabel="共鳴したピースを開く"
      >
        <Text style={styles.itemTitle} numberOfLines={2}>
          {title}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>ユーザー：</Text>
          <Text style={styles.metaValue}>
            {owner}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>共鳴：</Text>
          <Text style={styles.metaValue}>
            {savedAt}
          </Text>
        </View>
      </CocolonPressable>
    );
  }, [openPieceDetail, styles]);

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.container}>
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
              accessibilityLabel="ピースに戻る"
            />
          </View>

          <View style={styles.headerCenter}>
            <Text style={styles.titleText}>共鳴履歴</Text>
          </View>

          <View style={styles.headerSide} />
        </View>

        <FlatList
            ListHeaderComponent={<View>        {showHistoryRetentionLabel ? (
          <Text style={styles.historyRetentionText}>{historyRetentionLabel}</Text>
        ) : null}

        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>並び替え</Text>

          <View style={styles.sortChips}>
            <CocolonPressable
              style={[
                styles.chip,
                order === "newest" ? styles.chipActive : styles.chipInactive,
              ]}
              onPress={() => setOrderAndReload("newest")}
              accessibilityLabel="新しい順" accessibilityState={{ selected: order === "newest" }}
            >
              <Text
                style={[
                  styles.chipText,
                  order === "newest" ? styles.chipTextActive : styles.chipTextInactive,
                ]}
              >
                新しい順
              </Text>
            </CocolonPressable>

            <CocolonPressable
              style={[
                styles.chip,
                order === "oldest" ? styles.chipActive : styles.chipInactive,
              ]}
              onPress={() => setOrderAndReload("oldest")}
              accessibilityLabel="古い順" accessibilityState={{ selected: order === "oldest" }}
            >
              <Text
                style={[
                  styles.chipText,
                  order === "oldest" ? styles.chipTextActive : styles.chipTextInactive,
                ]}
              >
                古い順
              </Text>
            </CocolonPressable>
          </View>
        </View>

        {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}

</View>}
            data={loading ? [] : items}
            keyExtractor={(item, index) =>
              String(item?.q_instance_id || index).replace(/\s/g, "")
            }
            renderItem={renderItem}
            contentContainerStyle={[
              styles.listContent,
              items?.length ? null : styles.emptyContent,
            ]}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onEndReachedThreshold={0.4}
            onEndReached={loadMore}
            ListEmptyComponent={
              <View style={{ paddingVertical: 32 }}>{loading ? <ActivityIndicator accessibilityLabel="共鳴履歴を読込中" /> : errorText ? null : <Text style={styles.emptyText}>共鳴したピースはまだありません。</Text>}</View>
            }
            ListFooterComponent={
              loadingMore ? (
                <View style={styles.footerLoading}>
                  <ActivityIndicator />
                </View>
              ) : null
            }
        />
      </View>
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
      flex: 1,
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
    historyRetentionText: {
      marginBottom: 10,
      color: COLORS.TEXT_SUBTLE,
    },
    sortRow: {
      flexDirection: "column",
      alignItems: "stretch",
      justifyContent: "space-between",
      marginBottom: 10,
      rowGap: 8,
    },
    sortLabel: {
      color: text.sectionLabel ?? COLORS.TEXT_ON_LIGHT,
    },
    sortChips: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      columnGap: 8,
      rowGap: 8,
    },
    chip: {
      borderRadius: 20,
      borderWidth: 1,
      paddingVertical: 10,
      paddingHorizontal: 16,
      marginLeft: 0,
      minHeight: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    chipActive: {
      backgroundColor: COLORS.SURFACE_TONAL,
      borderColor: COLORS.CARD_BORDER,
    },
    chipInactive: {
      backgroundColor: COLORS.FIELD_BG,
      borderColor: COLORS.CARD_BORDER,
    },
    chipText: {
      letterSpacing: 0,
    },
    chipTextActive: {
      color: COLORS.ON_SURFACE_TONAL,
    },
    chipTextInactive: {
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    listContent: {
      paddingBottom: 24,
    },
    card: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginBottom: 12,
    },
    itemTitle: {
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginTop: 8,
      flexWrap: "wrap",
    },
    metaLabel: {
      color: COLORS.TEXT_SUBTLE,
    },
    metaValue: {
      flex: 1,
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginLeft: 4,
      minWidth: 0,
      flexShrink: 1,
    },
    loadingBox: {
      paddingTop: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyContent: {
      flexGrow: 1,
      alignItems: "stretch",
      justifyContent: "flex-start",
      paddingTop: 0,
    },
    emptyText: {
      color: COLORS.TEXT_SUBTLE,
      textAlign: "center",
    },
    errorText: {
      color: COLORS.ERROR,
      marginBottom: 8,
    },
    footerLoading: {
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
    },
  }, ui, {"titleText":"screenTitle","historyRetentionText":"description","sortLabel":"description","chipText":"button","itemTitle":"sectionTitle","metaLabel":"description","metaValue":"description","emptyText":"body","errorText":"description"}));
}
