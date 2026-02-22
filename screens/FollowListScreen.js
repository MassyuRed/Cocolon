import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useTheme } from "../theme/ThemeContext";
import { supabase } from "../lib/supabase";
import { useAuth } from "../AuthContext";

// MyModel（MashOS）API
const MYMODEL_API_BASE_URL =
  process.env.EXPO_PUBLIC_MYMODEL_API_URL || "https://mashos-api.onrender.com";

/**
 * FollowListScreen
 * - AccountScreen の「フォロー中 / フォロワー」タップで遷移してくる一覧画面
 * - DB: myprofile_links (viewer_user_id -> owner_user_id)
 *   - following: viewer_user_id = viewedUserId の owner_user_id 一覧
 *   - followers: owner_user_id = viewedUserId の viewer_user_id 一覧
 *
 * NOTE:
 * - 「照会」は MyProfileScreen で行う想定。
 *   ルート名はプロジェクト側の Navigator に合わせて必要なら変更してね。
 */

const TAB_FOLLOWING = "following";
const TAB_FOLLOWERS = "followers";

function normalizeTab(t) {
  return t === TAB_FOLLOWERS ? TAB_FOLLOWERS : TAB_FOLLOWING;
}

function safeString(v) {
  return typeof v === "string" ? v : "";
}


function PrivateMembraneBadge({ size = 16, color = "#FFFFFF", style }) {
  return (
    <View
      style={style}
      pointerEvents="none"
      accessibilityLabel="非公開アカウント"
    >
      <Ionicons
        name="shield-outline"
        size={size}
        color={color}
        style={{ opacity: 0.7 }}
      />
    </View>
  );
}


// navigation の state を再帰的に探索して、指定 routeName が存在するか確認
function hasRouteNameInState(state, routeName) {
  if (!state) return false;

  const routeNames = state?.routeNames;
  if (Array.isArray(routeNames) && routeNames.includes(routeName)) return true;

  const routes = state?.routes;
  if (Array.isArray(routes)) {
    for (const r of routes) {
      if (r?.state && hasRouteNameInState(r.state, routeName)) return true;
    }
  }
  return false;
}

function resolveMyProfileRouteName(navigation) {
  // 候補（プロジェクトに合わせて増やしてOK）
  const candidates = ["MyProfile", "MyProfileScreen"];

  const root = navigation?.getRootState?.();
  const local = navigation?.getState?.();

  for (const name of candidates) {
    if (hasRouteNameInState(root, name) || hasRouteNameInState(local, name)) {
      return name;
    }
  }

  // 見つからない場合のデフォルト（プロジェクト側で調整してね）
  return "MyProfile";
}

function resolveAccountRouteName(navigation) {
  // 候補（プロジェクトに合わせて増やしてOK）
  const candidates = ["Account", "AccountScreen"];

  const root = navigation?.getRootState?.();
  const local = navigation?.getState?.();

  for (const name of candidates) {
    if (hasRouteNameInState(root, name) || hasRouteNameInState(local, name)) {
      return name;
    }
  }

  // 見つからない場合のデフォルト（プロジェクト側で調整してね）
  return "Account";
}

export default function FollowListScreen({ navigation, route }) {
  const { colors, themeName } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { user } = useAuth();

  const viewedUserId =
    route?.params?.viewedUserId || route?.params?.targetUserId || user?.id || null;

  const [tab, setTab] = useState(normalizeTab(route?.params?.initialTab));
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]); // profiles[]
  const [errorText, setErrorText] = useState("");

  const [followingCount, setFollowingCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [countLoading, setCountLoading] = useState(false);

  const isDark = themeName === "dark";
  const isSelfList = !!user && String(viewedUserId || "") === String(user.id);


  // 遷移元から initialTab が変わって再表示されるケースに追従
  useEffect(() => {
    const next = normalizeTab(route?.params?.initialTab);
    setTab(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.initialTab]);

  const refreshCounts = useCallback(async () => {
    if (!viewedUserId) return;

    setCountLoading(true);
    try {
      // Supabase RLS の影響を避けるため、count は MashOS API 経由で取得する
      let accessToken = null;
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        accessToken = sessionData?.session?.access_token ?? null;
      } catch {
        accessToken = null;
      }

      const res = await fetch(
        `${MYMODEL_API_BASE_URL}/myprofile/follow-stats?target_user_id=${encodeURIComponent(
          String(viewedUserId)
        )}`,
        {
          method: "GET",
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json().catch(() => ({}));
      const followingCnt = Number(json?.following_count);
      const followerCnt = Number(json?.follower_count);

      if (Number.isFinite(followingCnt)) {
        setFollowingCount(followingCnt);
      }
      if (Number.isFinite(followerCnt)) {
        setFollowerCount(followerCnt);
      }
    } catch (e) {
      // no-op（一覧取得でエラー表示するため）
    } finally {
      setCountLoading(false);
    }
  }, [viewedUserId]);

  const loadList = useCallback(async () => {
    if (!viewedUserId) return;

    setLoading(true);
    setErrorText("");

    try {
      // Supabase RLS の影響を避けるため、一覧は MashOS API 経由で取得する
      let accessToken = null;
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        accessToken = sessionData?.session?.access_token ?? null;
      } catch {
        accessToken = null;
      }

      const res = await fetch(
        `${MYMODEL_API_BASE_URL}/myprofile/follow-list?target_user_id=${encodeURIComponent(
          String(viewedUserId)
        )}&tab=${encodeURIComponent(String(tab))}`,
        {
          method: "GET",
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        }
      );

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const j = await res.json();
          if (j && typeof j.detail === "string") msg = j.detail;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }

      const json = await res.json().catch(() => ({}));
      const list = Array.isArray(json?.rows) ? json.rows : [];
      setRows(list);
    } catch (e) {
      console.warn("FollowListScreen loadList error:", e);
      setRows([]);
      setErrorText(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }, [tab, viewedUserId]);

  useEffect(() => {
    refreshCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewedUserId]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const openMyProfile = (targetId) => {
    if (!navigation?.navigate || !targetId) return;

    const routeName = resolveAccountRouteName(navigation);
    navigation.navigate(routeName, { viewedUserId: targetId });
  };

  const removeFollowLink = async (targetId) => {
    if (!targetId) return;

    // 自分のフォロー/フォロワー一覧のみ解除できる（他ユーザーの一覧は閲覧のみ）
    if (!user || !isSelfList) return;

    try {
      setErrorText("");

      if (tab === TAB_FOLLOWING) {
        // following: 自分 -> 相手 のリンクを削除（unfollow）
        let accessToken = null;
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          accessToken = sessionData?.session?.access_token ?? null;
        } catch {
          accessToken = null;
        }

        if (!accessToken) {
          throw new Error("ログイン情報が取得できませんでした。再ログインしてください。");
        }

        const res = await fetch(`${MYMODEL_API_BASE_URL}/myprofile/unfollow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ owner_user_id: String(targetId) }),
        });

        if (!res.ok) {
          let msg = `HTTP ${res.status}`;
          try {
            const j = await res.json();
            if (j && typeof j.detail === "string") msg = j.detail;
          } catch {
            // ignore
          }
          throw new Error(msg);
        }
      } else {
        // followers: 相手 -> 自分 のリンクを削除（フォロワー解除）
        // Supabase RLS の影響を避けるため、MashOS API（service_role）経由で削除する
        let accessToken = null;
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          accessToken = sessionData?.session?.access_token ?? null;
        } catch {
          accessToken = null;
        }

        if (!accessToken) {
          throw new Error("ログイン情報が取得できませんでした。再ログインしてください。");
        }

        const res = await fetch(`${MYMODEL_API_BASE_URL}/myprofile/remove-follower`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ viewer_user_id: String(targetId) }),
        });

        if (!res.ok) {
          let msg = `HTTP ${res.status}`;
          try {
            const j = await res.json();
            if (j && typeof j.detail === "string") msg = j.detail;
          } catch {
            // ignore
          }
          throw new Error(msg);
        }
      }

      setRows((prev) =>
        prev.filter((r) => String(r?.id || "") !== String(targetId))
      );
      refreshCounts();
    } catch (e) {
      console.warn("removeFollowLink error:", e);
      setErrorText(String(e?.message || e));
    }
  };

  const renderItem = ({ item }) => {
    const name = safeString(item?.display_name) || "（未設定）";
    const isSelf = !!user && String(item?.id || "") === String(user.id);

    return (
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.75}
        onPress={() => openMyProfile(item?.id)}
      >
        <View style={{ flex: 1, paddingRight: 10 }}>
          <View style={styles.nameRow}>
            <Text style={[styles.rowName, { flexShrink: 1 }]} numberOfLines={1}>
              {name}
            </Text>
            {item?.is_private_account ? (
              <PrivateMembraneBadge
                size={16}
                color={colors.TITLE_GOLD}
                style={{ marginLeft: 6, marginTop: 1 }}
              />
            ) : null}
          </View>
        </View>

        <View style={styles.rowRight}>
          {isSelf ? (
            <Text style={styles.selfTag}>あなた</Text>
          ) : isSelfList ? (
            <TouchableOpacity
              style={styles.qnaBtn}
              activeOpacity={0.8}
              onPress={() => removeFollowLink(item?.id)}
            >
              <Ionicons
                name="trash-outline"
                size={16}
                color={colors.TEXT_ON_LIGHT}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.qnaBtnText}>削除</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const emptyText =
    tab === TAB_FOLLOWING ? "フォロー中のユーザーはいません。" : "フォロワーはいません。";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />

      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack?.()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color={colors.TITLE_GOLD} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Follow</Text>

        <TouchableOpacity
          onPress={() => {
            refreshCounts();
            loadList();
          }}
          style={styles.refreshButton}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={18} color={colors.TITLE_GOLD} />
        </TouchableOpacity>
      </View>

      {/* タブ */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, tab === TAB_FOLLOWING && styles.tabActive]}
          onPress={() => setTab(TAB_FOLLOWING)}
          activeOpacity={0.85}
        >
          <Text style={[styles.tabText, tab === TAB_FOLLOWING && styles.tabTextActive]}>
            フォロー中{" "}
            {countLoading ? "…" : `(${String(followingCount)})`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, tab === TAB_FOLLOWERS && styles.tabActive]}
          onPress={() => setTab(TAB_FOLLOWERS)}
          activeOpacity={0.85}
        >
          <Text style={[styles.tabText, tab === TAB_FOLLOWERS && styles.tabTextActive]}>
            フォロワー{" "}
            {countLoading ? "…" : `(${String(followerCount)})`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* エラー表示 */}
      {errorText ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            読み込みに失敗しました: {errorText}
          </Text>
        </View>
      ) : null}

      {/* リスト */}
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(item) => String(item?.id)}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            rows.length === 0 && { flex: 1, justifyContent: "center" },
          ]}
          ListEmptyComponent={
            <Text style={styles.emptyText}>{emptyText}</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

function createStyles(COLORS) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.PANEL_BG,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 10,
    },
    backButton: {
      padding: 4,
      width: 34,
    },
    refreshButton: {
      padding: 6,
      width: 34,
      alignItems: "flex-end",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
    },

    tabsRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      alignItems: "center",
      justifyContent: "center",
    },
    tabActive: {
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
    },
    tabText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    tabTextActive: {
      color: "#FFFFFF",
    },

    errorBox: {
      marginHorizontal: 20,
      marginBottom: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    errorText: {
      fontSize: 12,
      color: COLORS.TEXT_ON_LIGHT,
      lineHeight: 16,
    },

    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      marginBottom: 10,
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    rowName: {
      fontSize: 14,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    rowSub: {
      marginTop: 2,
      fontSize: 12,
      color: COLORS.TEXT_ON_LIGHT,
      opacity: 0.75,
    },

    rowRight: {
      alignItems: "flex-end",
      justifyContent: "center",
    },

    qnaBtn: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
    },
    qnaBtnText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },

    selfTag: {
      fontSize: 11,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
    },

    loadingWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyText: {
      textAlign: "center",
      fontSize: 13,
      color: COLORS.TEXT_ON_LIGHT,
      opacity: 0.85,
    },
  });
}
