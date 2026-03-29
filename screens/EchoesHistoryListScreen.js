import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { useTheme } from "../theme/ThemeContext";
import { useSubscription } from "../SubscriptionContext";
import { makeUiTokens } from "../ui/uiTokens";
import { supabase } from "../lib/supabase";
import { getHistoryRetentionLabel } from "../lib/historyRetentionLabel";

// UI
import CocolonBackButton from "../components/CocolonBackButton";
import CocolonPressable from "../components/CocolonPressable";
import { apiFetch } from "../lib/apiClient";

/**
 * EchoesHistoryListScreen
 * - Echoes（共鳴）履歴一覧（履歴ありのみ）
 * - 表示：Reflection の問い / ユーザー表示名 / 保存日時
 * - 並び替え：新しい順 / 古い順
 * - 詳細画面は後続フェーズで追加予定（onPress は fail-soft）
 */

// Prefer Expo env var if present (avoid hard-coding across dev/prod)
const API_BASE = String(
  (typeof process !== "undefined" && process?.env?.EXPO_PUBLIC_MYMODEL_API_URL) ||
    "https://mashos-api.onrender.com"
).replace(/\/+$/, "");

const ECHOES_REFLECTIONS_ENDPOINT = `${API_BASE}/mymodel/qna/echoes/reflections`;

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

export default function EchoesHistoryListScreen({ navigation }) {
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

  const [order, setOrder] = useState("newest"); // newest | oldest
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [errorText, setErrorText] = useState("");

  const abortRef = useRef(null);

  const fetchPage = useCallback(
    async ({ nextOrder, nextOffset, append }) => {
      const resolvedOrder = String(nextOrder || "newest").toLowerCase();
      const resolvedOffset = Math.max(0, Number(nextOffset || 0) || 0);

      // Abort previous request (best-effort)
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

      const url = `${ECHOES_REFLECTIONS_ENDPOINT}?order=${encodeURIComponent(
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

        // Deduplicate by q_instance_id (keep first)
        const seen = new Set();
        const out = [];
        for (const it of merged) {
          const key = String(it?.q_instance_id || "").trim();
          if (!key || seen.has(key)) continue;
          seen.add(key);
          out.push(it);
        }
        return out;
      });

      setHasMore(nextItems.length >= PAGE_LIMIT);
      setErrorText("");
    },
    []
  );

  const fetchInitial = useCallback(
    async (nextOrder = order) => {
      setLoading(true);
      setLoadingMore(false);
      setHasMore(true);
      try {
        await fetchPage({ nextOrder, nextOffset: 0, append: false });
      } finally {
        setLoading(false);
      }
    },
    [fetchPage, order]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchInitial(order);
    } catch (e) {
      // handled in fetchPage -> errorText
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
      // If it fails, just stop pagination; list still usable
      setErrorText(String(e?.message || e || "読み込みに失敗しました。"));
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [fetchPage, hasMore, items?.length, loading, loadingMore, order, refreshing]);

  // Fetch when screen is focused (so it reflects latest saves)
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

  // Order toggle
  const setOrderAndReload = useCallback(
    async (next) => {
      const v = String(next || "newest").toLowerCase();
      if (v === order) return;
      setOrder(v);
      try {
        await fetchInitial(v);
      } catch (e) {
        setErrorText(String(e?.message || e || "読み込みに失敗しました。"));
      }
    },
    [fetchInitial, order]
  );

  const renderItem = useCallback(
    ({ item }) => {
      const title = String(item?.title || "").trim() || "（未設定）";
      const owner = String(item?.owner_display_name || "").trim() || "—";
      const savedAt = formatDateTime(item?.saved_at);

      return (
        <CocolonPressable
          style={styles.card}
          onPress={() => {
            // Detail screen is planned in the next phase.
            // Fail-soft: don't crash if the route isn't registered yet.
            try {
              navigation?.navigate?.("EchoesHistoryDetail", {
                q_instance_id: item?.q_instance_id,
                q_key: item?.q_key,
                owner_display_name: item?.owner_display_name,
              });
            } catch (e) {
              Alert.alert("準備中", "履歴詳細画面はこれから作成します。");
            }
          }}
          accessibilityLabel="Echoes履歴 詳細へ"
        >
          <Text style={styles.itemTitle} numberOfLines={2}>
            {title}
          </Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>ユーザー：</Text>
            <Text style={styles.metaValue} numberOfLines={1}>
              {owner}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>保存：</Text>
            <Text style={styles.metaValue} numberOfLines={1}>
              {savedAt}
            </Text>
          </View>
        </CocolonPressable>
      );
    },
    [navigation, styles]
  );

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
              fallbackRouteName="MyModel"
              accessibilityLabel="MyModelに戻る"
            />
          </View>

          <View style={styles.headerCenter}>
            <Text style={styles.titleText}>Echoes履歴</Text>
          </View>

          {/* Right placeholder (for center alignment) */}
          <View style={styles.headerSide} />
        </View>

        {showHistoryRetentionLabel ? (
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
              accessibilityLabel="新しい順"
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
              accessibilityLabel="古い順"
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

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator />
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(it, idx) =>
              String(it?.q_instance_id || idx).replace(/\s/g, "")
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
              <Text style={styles.emptyText}>Echoes履歴がまだありません。</Text>
            }
            ListFooterComponent={
              loadingMore ? (
                <View style={styles.footerLoading}>
                  <ActivityIndicator />
                </View>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function createStyles(COLORS, ui) {
  const font = ui?.font || {};
  const text = ui?.text || {};

  return StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.PANEL_BG },
    body: {
      flex: 1,
      paddingTop: 16,
      paddingHorizontal: 18,
      paddingBottom: 18,
    },

    // Header
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
    historyRetentionText: {
      marginBottom: 10,
      fontSize: font.sectionLabel ?? 12,
      fontWeight: "600",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    },

    // Sort
    sortRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    sortLabel: {
      fontSize: font.sectionLabel ?? 12,
      fontWeight: "700",
      color: text.sectionLabel ?? COLORS.TEXT_ON_LIGHT,
    },
    sortChips: {
      flexDirection: "row",
      alignItems: "center",
    },
    chip: {
      borderRadius: ui?.radius?.pill ?? 999,
      borderWidth: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginLeft: 8,
    },
    chipActive: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    chipInactive: {
      backgroundColor: COLORS.FIELD_BG,
      borderColor: COLORS.CARD_BORDER,
    },
    chipText: {
      fontSize: font.sectionLabel ?? 12,
      fontWeight: "800",
      letterSpacing: 0.2,
    },
    chipTextActive: {
      color: "#FFFFFF",
    },
    chipTextInactive: {
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    },

    // List
    listContent: {
      paddingBottom: 24,
    },
    card: {
      borderRadius: ui?.radius?.md ?? 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginBottom: 10,
    },
    itemTitle: {
      fontSize: font.body ?? 14,
      fontWeight: "800",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      lineHeight: 20,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },
    metaLabel: {
      fontSize: font.sectionLabel ?? 12,
      color: text.sectionLabel ?? COLORS.TEXT_ON_LIGHT,
      fontWeight: "700",
    },
    metaValue: {
      flex: 1,
      fontSize: font.sectionLabel ?? 12,
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginLeft: 4,
      fontWeight: "700",
    },

    loadingBox: {
      paddingTop: 18,
      alignItems: "center",
      justifyContent: "center",
    },

    emptyContent: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 40,
    },
    emptyText: {
      fontSize: font.body ?? 14,
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      textAlign: "center",
    },

    errorText: {
      fontSize: font.sectionLabel ?? 12,
      color: "#EF4444",
      marginBottom: 8,
      fontWeight: "700",
    },

    footerLoading: {
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}
