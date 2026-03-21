import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useTheme } from "../theme/ThemeContext";
import CocolonBackButton from "../components/CocolonBackButton";
import CocolonButton from "../components/CocolonButton";
import CocolonPressable from "../components/CocolonPressable";
import NoticeRichText from "../components/NoticeRichText";
import UnreadBadge from "../components/UnreadBadge";
import {
  getNoticeButtonActions,
  openNoticeAction,
} from "../lib/noticeActionRuntime";
import {
  getNoticesHistory,
  markNoticesRead,
} from "../lib/noticeApi";

const HISTORY_PAGE_LIMIT = 50;

function formatNoticeDateLabel(value) {
  const raw = String(value || "").trim();
  if (!raw) return "—";
  try {
    const dt = new Date(raw);
    if (Number.isNaN(dt.getTime())) return raw;
    const yyyy = dt.getFullYear();
    const mm = `${dt.getMonth() + 1}`.padStart(2, "0");
    const dd = `${dt.getDate()}`.padStart(2, "0");
    return `${yyyy}.${mm}.${dd}`;
  } catch {
    return raw;
  }
}

function formatNoticeDateTimeLabel(value) {
  const raw = String(value || "").trim();
  if (!raw) return "—";
  try {
    const dt = new Date(raw);
    if (Number.isNaN(dt.getTime())) return raw;
    const yyyy = dt.getFullYear();
    const mm = `${dt.getMonth() + 1}`.padStart(2, "0");
    const dd = `${dt.getDate()}`.padStart(2, "0");
    const hh = `${dt.getHours()}`.padStart(2, "0");
    const mi = `${dt.getMinutes()}`.padStart(2, "0");
    return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
  } catch {
    return raw;
  }
}

export default function NoticeHistoryScreen({ navigation, route }) {
  const { colors, themeName } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isDark = themeName === "dark";
  const isIOS = Platform.OS === "ios";

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [nextOffset, setNextOffset] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const handledOpenKeyRef = useRef("");

  const requestedOpenId = String(route?.params?.open_notice_id || "").trim();
  const requestedOpenAt = String(route?.params?.open_notice_at || "").trim();
  const requestedOpenKey = `${requestedOpenId}:${requestedOpenAt}`;

  const mergeRows = useCallback((prevRows, nextRows, append) => {
    if (!append) return nextRows;
    const seen = new Set((prevRows || []).map((item) => String(item?.notice_id || "")));
    const merged = [...(prevRows || [])];
    for (const row of nextRows || []) {
      const id = String(row?.notice_id || "");
      if (!id || seen.has(id)) continue;
      seen.add(id);
      merged.push(row);
    }
    return merged;
  }, []);

  const load = useCallback(async ({ append = false, offset = 0 } = {}) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    try {
      const json = await getNoticesHistory({
        limit: HISTORY_PAGE_LIMIT,
        offset,
      });
      const rows = Array.isArray(json?.items) ? json.items : [];
      setItems((prev) => mergeRows(prev, rows, append));
      setHasMore(Boolean(json?.has_more));
      setNextOffset(
        typeof json?.next_offset === "number"
          ? json.next_offset
          : json?.next_offset != null
            ? Number(json.next_offset)
            : null,
      );
      setUnreadCount(Math.max(0, Number(json?.unread_count) || 0));
    } catch (e) {
      console.warn("NoticeHistoryScreen: load failed", e);
      if (!append) {
        setItems([]);
        Alert.alert("お知らせ", "履歴の取得に失敗しました。");
      }
      setHasMore(false);
      setNextOffset(null);
      setUnreadCount(0);
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  }, [mergeRows]);

  useEffect(() => {
    load({ append: false, offset: 0 });

    let unsubscribe = null;
    try {
      unsubscribe = navigation?.addListener?.("focus", () => {
        load({ append: false, offset: 0 });
      });
    } catch {
      // noop
    }

    return () => {
      try {
        if (typeof unsubscribe === "function") unsubscribe();
      } catch {
        // noop
      }
    };
  }, [load, navigation]);

  const markReadLocally = useCallback((noticeIds, readAt) => {
    const ids = new Set((noticeIds || []).map((value) => String(value || "")).filter(Boolean));
    if (ids.size === 0) return;
    setItems((prev) =>
      (prev || []).map((item) => {
        const noticeId = String(item?.notice_id || "");
        if (!ids.has(noticeId) || item?.is_read) return item;
        return {
          ...item,
          is_read: true,
          read_at: item?.read_at || readAt,
        };
      }),
    );
  }, []);

  const markReadForIds = useCallback(async (noticeIds) => {
    const ids = (noticeIds || []).map((value) => String(value || "").trim()).filter(Boolean);
    if (!ids.length) return;

    const unreadBefore = new Set(
      (items || [])
        .filter((item) => !item?.is_read)
        .map((item) => String(item?.notice_id || "")),
    );
    const targetUnreadIds = ids.filter((id) => unreadBefore.has(id));
    if (!targetUnreadIds.length) return;

    const fallbackUnreadCount = Math.max(0, unreadCount - targetUnreadIds.length);
    const readAt = new Date().toISOString();
    markReadLocally(targetUnreadIds, readAt);
    setUnreadCount(fallbackUnreadCount);

    try {
      const res = await markNoticesRead({ notice_ids: targetUnreadIds });
      if (typeof res?.unread_count === "number") {
        setUnreadCount(Math.max(0, Number(res.unread_count) || 0));
      }
    } catch (e) {
      console.warn("NoticeHistoryScreen: mark read failed", e);
    }
  }, [items, markReadLocally, unreadCount]);

  useEffect(() => {
    if (!requestedOpenId || !requestedOpenKey) return;
    if (!items.length) return;
    if (handledOpenKeyRef.current === requestedOpenKey) return;
    const target = items.find((item) => String(item?.notice_id || "") === requestedOpenId);
    if (!target) return;
    handledOpenKeyRef.current = requestedOpenKey;
    setExpandedId(requestedOpenId);
    if (!target?.is_read) {
      void markReadForIds([requestedOpenId]);
    }
  }, [items, markReadForIds, requestedOpenId, requestedOpenKey]);

  const handleToggleItem = useCallback((item) => {
    const noticeId = String(item?.notice_id || "").trim();
    if (!noticeId) return;
    setExpandedId((prev) => {
      const next = prev === noticeId ? null : noticeId;
      if (next === noticeId && !item?.is_read) {
        void markReadForIds([noticeId]);
      }
      return next;
    });
  }, [markReadForIds]);

  const openInternalRoute = useCallback((routeName, params = {}) => {
    const safeRouteName = String(routeName || "").trim();
    if (!safeRouteName) return false;
    try {
      navigation?.navigate?.(safeRouteName, params);
      return true;
    } catch {
      // noop
    }
    try {
      const parent = typeof navigation?.getParent === "function" ? navigation.getParent() : null;
      parent?.navigate?.(safeRouteName, params);
      return true;
    } catch {
      // noop
    }
    return false;
  }, [navigation]);

  const handlePressAction = useCallback(async (item, action) => {
    if (!action) return;

    if (!item?.is_read && item?.notice_id) {
      await markReadForIds([String(item.notice_id)]);
    }

    try {
      await openNoticeAction(action, { openInternalRoute });
    } catch (e) {
      Alert.alert("お知らせ", String(e?.message || "リンクを開けませんでした。"));
    }
  }, [markReadForIds, openInternalRoute]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore || nextOffset == null) return;
    await load({ append: true, offset: nextOffset });
  }, [hasMore, load, loading, loadingMore, nextOffset]);

  const renderItem = useCallback(({ item }) => {
    const noticeId = String(item?.notice_id || "");
    const expanded = expandedId === noticeId;
    const category = String(item?.category || "").trim();
    const buttonActions = getNoticeButtonActions(item?.actions, item?.cta);

    return (
      <View style={styles.itemCard}>
        <CocolonPressable
          style={styles.itemHeader}
          onPress={() => handleToggleItem(item)}
          accessibilityLabel="お知らせ詳細を開く"
        >
          <View style={styles.itemHeaderLeft}>
            <Text style={styles.itemDay}>{formatNoticeDateLabel(item?.published_at)}</Text>
            <Text style={styles.itemTitle} numberOfLines={2}>
              {item?.title || "お知らせ"}
            </Text>
          </View>
          <View style={styles.itemHeaderRight}>
            {!item?.is_read ? (
              <UnreadBadge variant="new" label="NEW" style={styles.itemUnreadBadge} />
            ) : null}
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.TEXT_SUBTLE}
            />
          </View>
        </CocolonPressable>

        {expanded ? (
          <View style={styles.itemBody}>
            <NoticeRichText
              body={String(item?.body || "").trim() || "本文はありません。"}
              bodySegments={item?.body_segments}
              actions={item?.actions}
              onPressAction={(action) => handlePressAction(item, action)}
              textStyle={styles.bodyText}
              linkStyle={styles.bodyLinkText}
            />

            <View style={styles.metaBlock}>
              <Text style={styles.metaText}>
                配信日時: {formatNoticeDateTimeLabel(item?.published_at)}
              </Text>
              {item?.read_at ? (
                <Text style={styles.metaText}>
                  既読: {formatNoticeDateTimeLabel(item?.read_at)}
                </Text>
              ) : null}
            </View>

            {category && category !== "other" ? (
              <View style={styles.categoryChip}>
                <Text style={styles.categoryChipText}>{category}</Text>
              </View>
            ) : null}

            {buttonActions.map((action, index) => (
              <View
                key={`${String(action?.key || action?.label || index)}-${index}`}
                style={styles.ctaButtonWrap}
              >
                <CocolonButton
                  variant="secondary"
                  onPress={() => handlePressAction(item, action)}
                  accessibilityLabel={String(action?.label || "")}
                >
                  {String(action?.label || "")}
                </CocolonButton>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    );
  }, [colors.TEXT_SUBTLE, expandedId, handlePressAction, handleToggleItem, styles]);

  const header = useMemo(() => (
    <View>
      <View style={styles.header}>
        <CocolonBackButton
          onPress={() => navigation?.goBack?.()}
          style={styles.backButton}
          accessibilityLabel="Homeに戻る"
        />
        <Text style={styles.headerTitle}>お知らせ</Text>
        <View style={styles.headerSpacer} />
      </View>
      <Text style={styles.helpText}>
        タイトルをタップすると本文を開けます。最新のお知らせから順に確認できます。
      </Text>
      {unreadCount > 0 ? (
        <View style={styles.unreadSummaryRow}>
          <UnreadBadge variant="new" label="NEW" />
          <Text style={styles.unreadSummaryText}>未読 {unreadCount} 件</Text>
        </View>
      ) : null}
    </View>
  ), [navigation, styles, unreadCount]);

  const empty = useMemo(() => {
    if (loading) {
      return (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={colors.TEXT_SUBTLE} />
          <Text style={styles.loadingText}>履歴を読み込み中…</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>まだ表示できるお知らせはありません。</Text>
      </View>
    );
  }, [colors.TEXT_SUBTLE, loading, styles]);

  const footer = useMemo(() => {
    if (loadingMore) {
      return (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={colors.TEXT_SUBTLE} />
        </View>
      );
    }
    if (hasMore) {
      return (
        <CocolonPressable
          style={styles.loadMoreBtn}
          onPress={loadMore}
          accessibilityLabel="さらにお知らせを読み込む"
        >
          <Text style={styles.loadMoreText}>さらに表示</Text>
        </CocolonPressable>
      );
    }
    return <View style={{ height: 4 }} />;
  }, [colors.TEXT_SUBTLE, hasMore, loadMore, loadingMore, styles]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />
      <View style={styles.container}>
        <FlatList
          data={items}
          keyExtractor={(item, index) => String(item?.notice_id || index)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={header}
          ListEmptyComponent={empty}
          ListFooterComponent={footer}
          removeClippedSubviews={!isIOS}
        />
      </View>
    </SafeAreaView>
  );
}

function createStyles(COLORS) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.PANEL_BG,
    },
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    listContent: {
      paddingBottom: 24,
      flexGrow: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
    },
    headerSpacer: {
      width: 22,
    },
    helpText: {
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 12,
    },
    unreadSummaryRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      gap: 8,
    },
    unreadSummaryText: {
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },
    loadingWrap: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 24,
    },
    loadingText: {
      marginTop: 8,
      fontSize: 13,
      color: COLORS.TEXT_ON_LIGHT,
    },
    emptyCard: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    emptyText: {
      fontSize: 13,
      color: COLORS.TEXT_ON_LIGHT,
    },
    itemCard: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      marginBottom: 12,
      overflow: "hidden",
    },
    itemHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    itemHeaderLeft: {
      flex: 1,
      paddingRight: 12,
    },
    itemHeaderRight: {
      alignItems: "flex-end",
      justifyContent: "center",
    },
    itemUnreadBadge: {
      marginBottom: 8,
      alignSelf: "flex-end",
    },
    itemDay: {
      fontSize: 11,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      marginBottom: 4,
    },
    itemTitle: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },
    itemBody: {
      paddingHorizontal: 14,
      paddingBottom: 14,
      borderTopWidth: 1,
      borderTopColor: COLORS.CARD_BORDER,
    },
    bodyText: {
      marginTop: 12,
      fontSize: 14,
      lineHeight: 22,
      color: COLORS.TEXT_ON_LIGHT,
    },
    bodyLinkText: {
      color: COLORS.TITLE_GOLD,
      textDecorationLine: "underline",
      fontWeight: "700",
    },
    metaBlock: {
      marginTop: 12,
    },
    metaText: {
      fontSize: 11,
      lineHeight: 17,
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 4,
    },
    categoryChip: {
      marginTop: 10,
      alignSelf: "flex-start",
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    categoryChipText: {
      fontSize: 11,
      lineHeight: 15,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
      textTransform: "capitalize",
    },
    ctaButtonWrap: {
      marginTop: 12,
    },
    loadMoreBtn: {
      marginTop: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    loadMoreText: {
      fontSize: 13,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },
  });
}
