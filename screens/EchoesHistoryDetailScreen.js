import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { apiGet, getAccessToken } from "../lib/apiClient";

// UI
import CocolonBackButton from "../components/CocolonBackButton";
import CocolonPressable from "../components/CocolonPressable";

/**
 * EchoesHistoryDetailScreen
 * - Reflection本文は API で再取得（/mymodel/qna/detail）
 * - Echoes 履歴は Reflection 単位（/mymodel/qna/echoes/history）
 * - 表示：
 *    - Reflection（問い / 本文）
 *    - あなたのEchoes（強度 / メモ）
 *    - 全体統計（合計 / 小中大）
 *    - タイムライン（匿名：強度 + 日時）
 */

// Prefer Expo env var if present (avoid hard-coding across dev/prod)
const API_BASE = String(
  (typeof process !== "undefined" && process?.env?.EXPO_PUBLIC_MYMODEL_API_URL) ||
    "https://mashos-api.onrender.com"
).replace(/\/+$/, "");

const QNA_DETAIL_ENDPOINT = `${API_BASE}/mymodel/qna/detail`;
const ECHOES_HISTORY_ENDPOINT = `${API_BASE}/mymodel/qna/echoes/history`;
const HISTORY_PAGE_LIMIT = 50;

const ECHO_STRENGTH_OPTIONS = Object.freeze([
  { key: "small", label: "静かに響いた", subLabel: "響き（小）" },
  { key: "medium", label: "心が動いた", subLabel: "響き（中）" },
  { key: "large", label: "深く響いた", subLabel: "響き（大）" },
]);

function labelForEchoStrength(strength) {
  const key = String(strength || "").toLowerCase();
  const opt = (ECHO_STRENGTH_OPTIONS || []).find((x) => x.key === key);
  return opt ? opt.label : key || "—";
}

function subLabelForEchoStrength(strength) {
  const key = String(strength || "").toLowerCase();
  const opt = (ECHO_STRENGTH_OPTIONS || []).find((x) => x.key === key);
  return opt ? opt.subLabel : "";
}

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

function parseOwnerUserIdFromInstanceId(qInstanceId) {
  const raw = String(qInstanceId || "");
  const i = raw.indexOf(":");
  if (i <= 0) return null;
  return raw.slice(0, i);
}

export default function EchoesHistoryDetailScreen({ navigation, route }) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);

  const isDark = String(themeName || "").toLowerCase() === "dark";

  const qInstanceId = String(route?.params?.q_instance_id || route?.params?.qInstanceId || "").trim();

  // Optional (best-effort): list -> detail can pass this; if not provided, we try to resolve from API
  const [ownerDisplayName, setOwnerDisplayName] = useState(() => {
    const v =
      route?.params?.owner_display_name ||
      route?.params?.ownerDisplayName ||
      route?.params?.owner_name ||
      route?.params?.ownerName;
    return typeof v === "string" ? v : "";
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [detail, setDetail] = useState(null);
  const [history, setHistory] = useState(null);
  const [timelineItems, setTimelineItems] = useState([]);
  const [historyLoadingMore, setHistoryLoadingMore] = useState(false);
  const [historyHasMore, setHistoryHasMore] = useState(false);
  const [historyNextOffset, setHistoryNextOffset] = useState(null);

  const abortRef = useRef(null);

  const resolveOwnerNameIfNeeded = useCallback(
    async (qId, signal) => {
      try {
        if (ownerDisplayName) return;
        const ownerUserId = parseOwnerUserIdFromInstanceId(qId);
        if (!ownerUserId) return;

        const json = await apiGet(
          `/account/profile?target_user_id=${encodeURIComponent(ownerUserId)}`,
          { signal }
        );
        const name = String(json?.display_name || "").trim();
        if (name) {
          setOwnerDisplayName(name);
        }
      } catch {
        // ignore (best-effort)
      }
    },
    [ownerDisplayName]
  );

  const fetchAll = useCallback(
    async ({ isRefresh = false } = {}) => {
      if (!qInstanceId) {
        setErrorText("q_instance_id が見つかりませんでした。");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // Abort any previous request
      try {
        if (abortRef.current) abortRef.current.abort();
      } catch {
        // noop
      }
      const controller = new AbortController();
      abortRef.current = controller;

      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const accessToken = await getAccessToken();
        if (!accessToken) throw new Error("ログイン情報が取得できませんでした。");

        const [detailJson, historyJson] = await Promise.all([
          apiGet(`/mymodel/qna/detail?q_instance_id=${encodeURIComponent(qInstanceId)}`, {
            signal: controller.signal,
          }),
          apiGet(
            `/mymodel/qna/echoes/history?q_instance_id=${encodeURIComponent(qInstanceId)}&limit=${HISTORY_PAGE_LIMIT}&offset=0`,
            { signal: controller.signal }
          ),
        ]);

        const nextHistory = historyJson && typeof historyJson === "object" ? historyJson : null;
        setDetail(detailJson && typeof detailJson === "object" ? detailJson : null);
        setHistory(nextHistory);
        setTimelineItems(Array.isArray(nextHistory?.items) ? nextHistory.items : []);
        setHistoryHasMore(Boolean(nextHistory?.has_more));
        setHistoryNextOffset(
          typeof nextHistory?.next_offset === "number"
            ? nextHistory.next_offset
            : nextHistory?.next_offset != null
              ? Number(nextHistory.next_offset)
              : null
        );

        setErrorText("");
        // Best-effort owner name resolution (not required for core UX)
        resolveOwnerNameIfNeeded(qInstanceId, controller.signal);
      } catch (e) {
        const msg = String(e?.message || e || "エラーが発生しました。");
        setErrorText(msg);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [qInstanceId, resolveOwnerNameIfNeeded]
  );

  useEffect(() => {
    fetchAll({ isRefresh: false });
    return () => {
      try {
        if (abortRef.current) abortRef.current.abort();
      } catch {
        // noop
      }
    };
  }, [fetchAll]);

  const onRefresh = useCallback(() => {
    fetchAll({ isRefresh: true });
  }, [fetchAll]);

  const loadMoreHistory = useCallback(async () => {
    if (loading || refreshing || historyLoadingMore || !historyHasMore || historyNextOffset == null) return;
    setHistoryLoadingMore(true);
    try {
      const json = await apiGet(
        `/mymodel/qna/echoes/history?q_instance_id=${encodeURIComponent(qInstanceId)}&limit=${HISTORY_PAGE_LIMIT}&offset=${historyNextOffset}`
      );
      const nextItems = Array.isArray(json?.items) ? json.items : [];
      setTimelineItems((prev) => {
        const existing = new Set((prev || []).map((item) => String(item?.id || item?.created_at || "")));
        const merged = [...(prev || [])];
        for (const item of nextItems) {
          const key = String(item?.id || item?.created_at || "");
          if (!key || existing.has(key)) continue;
          existing.add(key);
          merged.push(item);
        }
        return merged;
      });
      setHistory((prev) => (prev && typeof prev === "object" ? { ...prev, ...json, items: undefined } : json));
      setHistoryHasMore(Boolean(json?.has_more));
      setHistoryNextOffset(
        typeof json?.next_offset === "number"
          ? json.next_offset
          : json?.next_offset != null
            ? Number(json.next_offset)
            : null
      );
    } catch (e) {
      console.warn("EchoesHistoryDetailScreen.js: loadMore failed", e);
    } finally {
      setHistoryLoadingMore(false);
    }
  }, [loading, refreshing, historyLoadingMore, historyHasMore, historyNextOffset, qInstanceId]);

  const Header = useMemo(() => {
    return (
      <View>
        {/* Reflection */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Reflection</Text>

          {ownerDisplayName ? (
            <Text style={styles.metaText}>ユーザー：{ownerDisplayName}</Text>
          ) : null}

          <Text style={[styles.sectionLabel, { marginTop: 10 }]}>問い</Text>
          <Text style={styles.questionText}>
            {String(detail?.title || "—")}
          </Text>

          <Text style={[styles.sectionLabel, { marginTop: 10 }]}>内容</Text>
          <Text style={styles.bodyText}>
            {String(detail?.body || "—")}
          </Text>
        </View>

        {/* My Echoes */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>あなたのEchoes</Text>

          {history?.my_strength ? (
            <>
              <Text style={styles.myStrongText}>
                {labelForEchoStrength(history.my_strength)}
              </Text>
              <Text style={styles.mySubText}>
                {subLabelForEchoStrength(history.my_strength)}
              </Text>

              {history?.my_memo ? (
                <Text style={[styles.memoText, { marginTop: 10 }]}>
                  {String(history.my_memo)}
                </Text>
              ) : (
                <Text style={[styles.subtleText, { marginTop: 10 }]}>
                  メモなし
                </Text>
              )}
            </>
          ) : (
            <Text style={styles.subtleText}>まだ保存していません。</Text>
          )}
        </View>

        {/* Stats */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>全体統計</Text>

          <View style={styles.kvRow}>
            <Text style={styles.kvKey}>合計</Text>
            <Text style={styles.kvVal}>
              {Number(history?.total ?? 0) || 0}
            </Text>
          </View>
          <View style={styles.kvRow}>
            <Text style={styles.kvKey}>小</Text>
            <Text style={styles.kvVal}>
              {Number(history?.count_small ?? 0) || 0}
            </Text>
          </View>
          <View style={styles.kvRow}>
            <Text style={styles.kvKey}>中</Text>
            <Text style={styles.kvVal}>
              {Number(history?.count_medium ?? 0) || 0}
            </Text>
          </View>
          <View style={styles.kvRow}>
            <Text style={styles.kvKey}>大</Text>
            <Text style={styles.kvVal}>
              {Number(history?.count_large ?? 0) || 0}
            </Text>
          </View>
        </View>

        <Text style={styles.listTitle}>タイムライン</Text>
      </View>
    );
  }, [styles, ownerDisplayName, detail, history]);

  const renderItem = useCallback(
    ({ item }) => {
      const strength = String(item?.strength || "");
      const createdAt = String(item?.created_at || "");
      return (
        <View style={styles.timelineRow}>
          <View style={styles.timelineLeft}>
            <Text style={styles.timelineTitle}>{labelForEchoStrength(strength)}</Text>
            <Text style={styles.timelineSub}>{subLabelForEchoStrength(strength)}</Text>
          </View>
          <Text style={styles.timelineTime}>{formatDateTime(createdAt)}</Text>
        </View>
      );
    },
    [styles]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />

      <View style={styles.body}>
        {/* Header */}
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

        {loading ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator />
            {errorText ? (
              <Text style={[styles.errorText, { marginTop: 10 }]}>{errorText}</Text>
            ) : null}
          </View>
        ) : errorText ? (
          <View style={styles.centerLoading}>
            <Text style={styles.errorText}>{errorText}</Text>
            <CocolonPressable
              style={styles.retryBtn}
              onPress={() => fetchAll({ isRefresh: false })}
            >
              <Text style={styles.retryText}>再読み込み</Text>
            </CocolonPressable>
          </View>
        ) : (
          <FlatList
            data={timelineItems}
            keyExtractor={(it, idx) => `${String(it?.created_at || "")}:${idx}`}
            renderItem={renderItem}
            ListHeaderComponent={Header}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.TITLE_GOLD}
              />
            }
            ListEmptyComponent={
              <Text style={styles.subtleText}>まだ履歴がありません。</Text>
            }
            ListFooterComponent={
              historyLoadingMore ? (
                <View style={styles.listFooter}>
                  <ActivityIndicator size="small" color={colors.TITLE_GOLD} />
                </View>
              ) : historyHasMore ? (
                <CocolonPressable style={styles.loadMoreBtn} onPress={loadMoreHistory} accessibilityLabel="さらに履歴を読み込む">
                  <Text style={styles.loadMoreText}>さらに表示</Text>
                </CocolonPressable>
              ) : <View style={styles.listFooterSpacer} />
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

    // Cards / Sections
    card: {
      borderRadius: ui?.radius?.md ?? 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingVertical: 14,
      paddingHorizontal: 14,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: font.body ?? 14,
      fontWeight: "800",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginBottom: 6,
      letterSpacing: 0.3,
    },
    metaText: {
      fontSize: font.sectionLabel ?? 12,
      color: text.subtle ?? COLORS.TEXT_SUBTLE,
    },
    sectionLabel: {
      fontSize: font.sectionLabel ?? 12,
      fontWeight: "700",
      color: text.sectionLabel ?? COLORS.TEXT_ON_LIGHT,
      marginBottom: 4,
    },
    questionText: {
      fontSize: font.body ?? 14,
      fontWeight: "800",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      lineHeight: 20,
    },
    bodyText: {
      fontSize: font.body ?? 14,
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      lineHeight: 20,
    },
    myStrongText: {
      fontSize: font.body ?? 14,
      fontWeight: "800",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginTop: 4,
    },
    mySubText: {
      fontSize: font.description ?? 9,
      color: text.description ?? COLORS.TEXT_SUBTLE,
      marginTop: 2,
    },
    memoText: {
      fontSize: font.body ?? 14,
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
      lineHeight: 20,
    },
    subtleText: {
      fontSize: font.sectionLabel ?? 12,
      color: text.subtle ?? COLORS.TEXT_SUBTLE,
    },

    // Key-Value rows
    kvRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 6,
      borderTopWidth: 1,
      borderTopColor: COLORS.CARD_BORDER,
    },
    kvKey: {
      fontSize: font.sectionLabel ?? 12,
      fontWeight: "700",
      color: text.sectionLabel ?? COLORS.TEXT_ON_LIGHT,
    },
    kvVal: {
      fontSize: font.body ?? 14,
      fontWeight: "800",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    limitNote: {
      marginTop: 10,
      fontSize: font.description ?? 9,
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },

    listFooter: { paddingVertical: 16, alignItems: "center", justifyContent: "center" },
    listFooterSpacer: { height: 12 },
    loadMoreBtn: { borderRadius: 14, borderWidth: 1, borderColor: COLORS.CARD_BORDER, backgroundColor: COLORS.FIELD_BG, alignItems: "center", justifyContent: "center", paddingHorizontal: 14, paddingVertical: 10, marginBottom: 16 },
    loadMoreText: { fontSize: 13, fontWeight: "700", color: COLORS.TEXT_ON_LIGHT },
    listTitle: {
      marginTop: 4,
      marginBottom: 8,
      fontSize: font.sectionLabel ?? 12,
      fontWeight: "800",
      color: text.sectionLabel ?? COLORS.TEXT_ON_LIGHT,
    },
    listContent: {
      paddingBottom: 24,
    },

    // Timeline row
    timelineRow: {
      borderRadius: ui?.radius?.md ?? 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingVertical: 12,
      paddingHorizontal: 14,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    timelineLeft: {
      flex: 1,
      paddingRight: 10,
    },
    timelineTitle: {
      fontSize: font.body ?? 14,
      fontWeight: "800",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    timelineSub: {
      marginTop: 2,
      fontSize: font.description ?? 9,
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },
    timelineTime: {
      fontSize: font.sectionLabel ?? 12,
      color: text.subtle ?? COLORS.TEXT_SUBTLE,
    },

    // Loading / Error
    centerLoading: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 14,
    },
    errorText: {
      fontSize: font.sectionLabel ?? 12,
      color: "#EF4444",
      textAlign: "center",
    },
    retryBtn: {
      marginTop: 12,
      borderRadius: ui?.radius?.pill ?? 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingVertical: 10,
      paddingHorizontal: 14,
    },
    retryText: {
      fontSize: font.sectionLabel ?? 12,
      fontWeight: "800",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
  });
}
