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
import { apiFetch } from "../lib/apiClient";

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
const TAB_REQUESTS = "requests";
const TAB_REQUESTED = "requested";

function normalizeTab(t) {
  if (t === TAB_REQUESTS) return TAB_REQUESTS;
  if (t === TAB_REQUESTED) return TAB_REQUESTED;
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
  const [requestCount, setRequestCount] = useState(0);
  const [requestedCount, setRequestedCount] = useState(0);
  const [requestActionLoadingId, setRequestActionLoadingId] = useState(null);

  const isDark = themeName === "dark";
  const isSelfList = !!user && String(viewedUserId || "") === String(user.id);


  // 遷移元から initialTab が変わって再表示されるケースに追従
  useEffect(() => {
    const next = normalizeTab(route?.params?.initialTab);
    setTab(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.initialTab]);

  // 自分以外の一覧で「承認待ち」タブが選ばれてしまった場合はフォロー中へ戻す
  useEffect(() => {
    if (!isSelfList && (tab === TAB_REQUESTS || tab === TAB_REQUESTED)) {
      setTab(TAB_FOLLOWING);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelfList, tab]);

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

      const res = await apiFetch(
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
      // 自分の一覧の場合のみ、承認待ち（フォロー申請）の件数も取得する
      if (user && isSelfList) {
        try {
          const rres = await apiFetch(
            `${MYMODEL_API_BASE_URL}/myprofile/follow-requests/incoming?limit=300`,
            {
              method: "GET",
              headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
            }
          );

          if (rres.ok) {
            const rjson = await rres.json().catch(() => ({}));
            const reqs = Array.isArray(rjson?.requests) ? rjson.requests : [];
            const total = Number(rjson?.total_items);
            setRequestCount(Number.isFinite(total) ? total : reqs.length);
          } else {
            setRequestCount(0);
          }
        } catch {
          // no-op
        }
        // 自分が送った申請（申請中）の件数も取得する（MashOS API 経由）
        try {
          const ores = await apiFetch(
            `${MYMODEL_API_BASE_URL}/myprofile/follow-requests/outgoing?limit=300`,
            {
              method: "GET",
              headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
            }
          );

          if (ores.ok) {
            const ojson = await ores.json().catch(() => ({}));
            const oreqs = Array.isArray(ojson?.requests) ? ojson.requests : [];
            const ototal = Number(ojson?.total_items);
            setRequestedCount(Number.isFinite(ototal) ? ototal : oreqs.length);
          } else {
            setRequestedCount(0);
          }
        } catch {
          setRequestedCount(0);
        }
      } else {
        setRequestCount(0);
        setRequestedCount(0);
      }
    } catch (e) {
      // no-op（一覧取得でエラー表示するため）
    } finally {
      setCountLoading(false);
    }
  }, [viewedUserId, user, isSelfList]);

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

      // 「承認待ち」タブは自分の一覧のみ表示する（他ユーザーの申請は見られない）
      if ((tab === TAB_REQUESTS || tab === TAB_REQUESTED) && !isSelfList) {
        setRows([]);
        return;
      }


      // 「申請中」タブ（自分が送ったフォロー申請）は MashOS API 経由で取得する
      if (tab === TAB_REQUESTED) {
        if (!user || !isSelfList) {
          setRows([]);
          setRequestedCount(0);
          return;
        }

        if (!accessToken) {
          throw new Error("ログイン情報が取得できませんでした。再ログインしてください。");
        }

        const ores = await apiFetch(
          `${MYMODEL_API_BASE_URL}/myprofile/follow-requests/outgoing?limit=300`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!ores.ok) {
          let msg = `HTTP ${ores.status}`;
          try {
            const j = await ores.json();
            if (j && typeof j.detail === "string") msg = j.detail;
          } catch {
            // ignore
          }
          throw new Error(msg);
        }

        const ojson = await ores.json().catch(() => ({}));
        const reqs = Array.isArray(ojson?.requests) ? ojson.requests : [];
        const total = Number(ojson?.total_items);
        setRequestedCount(Number.isFinite(total) ? total : reqs.length);

        const list = reqs
          .map((r) => {
            const targetId = safeString(r?.target_user_id).trim();
            const requestId = safeString(r?.request_id).trim();
            if (!targetId || !requestId) return null;

            return {
              id: targetId,
              display_name: safeString(r?.target_display_name) || "（未設定）",
              myprofile_code: safeString(r?.target_myprofile_code) || "",
              _follow_request_id: requestId,
              _request_created_at: safeString(r?.created_at) || "",
              _request_target_user_id: targetId,
            };
          })
          .filter(Boolean);

        setRows(list);
        return;
      }


      const url =
        tab === TAB_REQUESTS
          ? `${MYMODEL_API_BASE_URL}/myprofile/follow-requests/incoming?limit=300`
          : `${MYMODEL_API_BASE_URL}/myprofile/follow-list?target_user_id=${encodeURIComponent(
              String(viewedUserId)
            )}&tab=${encodeURIComponent(String(tab))}`;

      const res = await apiFetch(url, {
        method: "GET",
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
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

      const json = await res.json().catch(() => ({}));

      if (tab === TAB_REQUESTS) {
        const reqs = Array.isArray(json?.requests) ? json.requests : [];
        const total = Number(json?.total_items);
        setRequestCount(Number.isFinite(total) ? total : reqs.length);

        const list = reqs
          .map((r) => {
            const requesterId = safeString(r?.requester_user_id).trim();
            const requestId = safeString(r?.request_id).trim();
            if (!requesterId || !requestId) return null;

            return {
              id: requesterId,
              display_name: safeString(r?.requester_display_name) || "（未設定）",
              myprofile_code: safeString(r?.requester_myprofile_code) || "",
              _follow_request_id: requestId,
              _request_created_at: safeString(r?.created_at) || "",
            };
          })
          .filter(Boolean);

        setRows(list);
      } else {
        const list = Array.isArray(json?.rows) ? json.rows : [];
        setRows(list);
      }
    } catch (e) {
      console.warn("FollowListScreen loadList error:", e);
      setRows([]);
      setErrorText(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }, [tab, viewedUserId, user, isSelfList]);

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

        const res = await apiFetch(`${MYMODEL_API_BASE_URL}/myprofile/unfollow`, {
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

        const res = await apiFetch(`${MYMODEL_API_BASE_URL}/myprofile/remove-follower`, {
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

  const actOnFollowRequest = async (requestId, action) => {
    const reqId = safeString(requestId).trim();
    if (!reqId) return;

    // 自分の承認待ち一覧のみ操作できる
    if (!user || !isSelfList) return;

    if (requestActionLoadingId) return;

    setRequestActionLoadingId(reqId);

    try {
      setErrorText("");

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

      const endpoint =
        action === "approve"
          ? "/myprofile/follow-requests/approve"
          : "/myprofile/follow-requests/reject";

      const res = await apiFetch(`${MYMODEL_API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ request_id: reqId }),
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

      // 一覧から除去
      setRows((prev) =>
        prev.filter((r) => String(r?._follow_request_id || "") !== String(reqId))
      );
      setRequestCount((prev) => {
        const n = Number(prev);
        if (!Number.isFinite(n)) return 0;
        return Math.max(0, n - 1);
      });

      refreshCounts();
    } catch (e) {
      console.warn("actOnFollowRequest error:", e);
      setErrorText(String(e?.message || e));
    } finally {
      setRequestActionLoadingId(null);
    }
  };


  const cancelOutgoingFollowRequest = async (targetUserId, requestId) => {
    const tgt = String(targetUserId || "").trim();
    const reqId = String(requestId || tgt || "").trim();
    if (!tgt) return;

    // 自分の「申請中」一覧のみ操作できる
    if (!user || !isSelfList) return;

    if (requestActionLoadingId) return;

    setRequestActionLoadingId(reqId);

    try {
      setErrorText("");

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

      const res = await apiFetch(`${MYMODEL_API_BASE_URL}/myprofile/follow-request/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ target_user_id: tgt }),
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

      // 一覧から除去
      setRows((prev) => prev.filter((r) => String(r?.id || "") !== String(tgt)));
      setRequestedCount((prev) => {
        const n = Number(prev);
        if (!Number.isFinite(n)) return 0;
        return Math.max(0, n - 1);
      });

      refreshCounts();
    } catch (e) {
      console.warn("cancelOutgoingFollowRequest error:", e);
      setErrorText(String(e?.message || e));
    } finally {
      setRequestActionLoadingId(null);
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
          {(tab === TAB_REQUESTS || tab === TAB_REQUESTED) && item?._request_created_at ? (
            <Text style={styles.rowSub} numberOfLines={1}>
              申請: {String(item?._request_created_at || "").slice(0, 10)}
            </Text>
          ) : null}
        </View>

        <View style={styles.rowRight}>
          {isSelf ? (
            <Text style={styles.selfTag}>あなた</Text>
          ) : tab === TAB_REQUESTS && isSelfList ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={[styles.qnaBtn, !!requestActionLoadingId && { opacity: 0.5 }]}
                activeOpacity={0.8}
                onPress={() =>
                  actOnFollowRequest(item?._follow_request_id, "approve")
                }
                disabled={!item?._follow_request_id || !!requestActionLoadingId}
              >
                {String(requestActionLoadingId || "") ===
                String(item?._follow_request_id || "") ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.TEXT_ON_LIGHT}
                    style={{ marginRight: 6 }}
                  />
                ) : (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={colors.TEXT_ON_LIGHT}
                    style={{ marginRight: 6 }}
                  />
                )}
                <Text style={styles.qnaBtnText}>承認</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.qnaBtn,
                  { marginLeft: 8 },
                  !!requestActionLoadingId && { opacity: 0.5 },
                ]}
                activeOpacity={0.8}
                onPress={() =>
                  actOnFollowRequest(item?._follow_request_id, "reject")
                }
                disabled={!item?._follow_request_id || !!requestActionLoadingId}
              >
                {String(requestActionLoadingId || "") ===
                String(item?._follow_request_id || "") ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.TEXT_ON_LIGHT}
                    style={{ marginRight: 6 }}
                  />
                ) : (
                  <Ionicons
                    name="close"
                    size={16}
                    color={colors.TEXT_ON_LIGHT}
                    style={{ marginRight: 6 }}
                  />
                )}
                <Text style={styles.qnaBtnText}>拒否</Text>
              </TouchableOpacity>
            </View>
          ) : tab === TAB_REQUESTED && isSelfList ? (
            <TouchableOpacity
              style={[styles.qnaBtn, !!requestActionLoadingId && { opacity: 0.5 }]}
              activeOpacity={0.8}
              onPress={() =>
                cancelOutgoingFollowRequest(
                  item?._request_target_user_id || item?.id,
                  item?._follow_request_id
                )
              }
              disabled={!item?.id || !!requestActionLoadingId}
            >
              {String(requestActionLoadingId || "") ===
              String(item?._follow_request_id || "") ? (
                <ActivityIndicator
                  size="small"
                  color={colors.TEXT_ON_LIGHT}
                  style={{ marginRight: 6 }}
                />
              ) : (
                <Ionicons
                  name="close"
                  size={16}
                  color={colors.TEXT_ON_LIGHT}
                  style={{ marginRight: 6 }}
                />
              )}
              <Text style={styles.qnaBtnText}>取消</Text>
            </TouchableOpacity>
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
    tab === TAB_FOLLOWING
      ? "フォロー中のユーザーはいません。"
      : tab === TAB_FOLLOWERS
      ? "フォロワーはいません。"
      : tab === TAB_REQUESTED
      ? "申請中のユーザーはいません。"
      : "承認待ちの申請はありません。";

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

        {isSelfList ? (
          <>
            <TouchableOpacity
              style={[styles.tab, tab === TAB_REQUESTED && styles.tabActive]}
              onPress={() => setTab(TAB_REQUESTED)}
              activeOpacity={0.85}
            >
              <Text style={[styles.tabText, tab === TAB_REQUESTED && styles.tabTextActive]}>
                申請中{" "}
                {countLoading ? "…" : `(${String(requestedCount)})`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, tab === TAB_REQUESTS && styles.tabActive]}
              onPress={() => setTab(TAB_REQUESTS)}
              activeOpacity={0.85}
            >
              <Text style={[styles.tabText, tab === TAB_REQUESTS && styles.tabTextActive]}>
                承認待ち{" "}
                {countLoading ? "…" : `(${String(requestCount)})`}
              </Text>
            </TouchableOpacity>
          </>
        ) : null}
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
