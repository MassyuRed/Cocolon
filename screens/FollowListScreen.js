import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonPressable from "../components/CocolonPressable";
import UnreadBadge from "../components/UnreadBadge";
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { supabase } from "../lib/supabase";
import { useAuth } from "../AuthContext";
import { useOwnerRequestScope } from "../hooks/useOwnerRequestScope";
import { useUnread } from "../UnreadContext";
import { apiFetch, apiPost } from "../lib/apiClient";
import { CONNECT_WIRE, EMOTION_NOTIFICATION_WIRE, FOLLOW_WIRE, buildFollowListPath, buildFollowRequestsPath, buildFollowStatsPath, readEmotionNotificationOwnerId, readRelatedConnectCode } from "../lib/compat/legacyWireContracts";

const EMOTION_NOTIFICATION_SETTINGS_ENDPOINT = EMOTION_NOTIFICATION_WIRE.routes.settings;
const EMOTION_NOTIFICATION_GLOBAL_OWNER_ID = EMOTION_NOTIFICATION_WIRE.globalOwnerCompatId;

/**
 * FollowListScreen
 * - AccountScreen の「フォロー中 / フォロワー」タップで遷移してくる一覧画面
 * - DB: follow_links (legacy physical storage may still use historical naming)
 *   - following: viewer_user_id = viewedUserId の owner_user_id 一覧
 *   - followers: owner_user_id = viewedUserId の viewer_user_id 一覧
 *
 * NOTE:
 * - 「照会」は Profile screen で行う想定。
 *   ルート名はプロジェクト側の Navigator に合わせて必要なら変更してね。
 */

const TAB_FOLLOWING = "following";
const TAB_FOLLOWERS = "followers";
const TAB_REQUESTS = "requests";
const TAB_REQUESTED = "requested";

const FOLLOW_TABS = [
  { key: TAB_FOLLOWING, label: "フォロー中" },
  { key: TAB_FOLLOWERS, label: "フォロワー" },
  { key: TAB_REQUESTED, label: "申請中", selfOnly: true },
  { key: TAB_REQUESTS, label: "承認待ち", selfOnly: true },
];

function normalizeTab(t) {
  if (t === TAB_REQUESTS) return TAB_REQUESTS;
  if (t === TAB_REQUESTED) return TAB_REQUESTED;
  return t === TAB_FOLLOWERS ? TAB_FOLLOWERS : TAB_FOLLOWING;
}

function safeString(v) {
  return typeof v === "string" ? v : "";
}

function extractEmotionNotificationMap(payload) {
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.settings)
    ? payload.settings
    : Array.isArray(payload?.data)
    ? payload.data
    : [];

  const map = {};

  for (const row of rows) {
    if (!row || typeof row !== "object") continue;

    const ownerUserId = readEmotionNotificationOwnerId(row, "");

    if (!ownerUserId || ownerUserId === EMOTION_NOTIFICATION_GLOBAL_OWNER_ID) {
      continue;
    }

    const enabled =
      row?.is_enabled ??
      row?.isEnabled ??
      row?.enabled ??
      row?.is_on ??
      row?.isOn;

    if (typeof enabled === "boolean") {
      map[ownerUserId] = enabled;
    }
  }

  return map;
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
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);

  const { user, authOwnerGeneration } = useAuth();
  const { scope: ownerRequest, isCurrent: isOwnerCurrent } = useOwnerRequestScope(user?.id, authOwnerGeneration);
  const { getFeatureUnread, setUnread } = useUnread();

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
  const [emotionNotifMap, setEmotionNotifMap] = useState({});
  const [emotionNotifLoading, setEmotionNotifLoading] = useState(false);
  const [emotionNotifBusyId, setEmotionNotifBusyId] = useState(null);

  const isDark = themeName === "dark";
  const isSelfList = !!user && String(viewedUserId || "") === String(user.id);
  const selectionRef = useRef(null);
  if (!selectionRef.current || selectionRef.current.owner !== ownerRequest ||
      selectionRef.current.target !== viewedUserId || selectionRef.current.tab !== tab) {
    selectionRef.current = { owner: ownerRequest, target: viewedUserId, tab };
  }
  const selection = selectionRef.current;
  const listRequestSeq = useRef(0);
  const notificationRequestSeq = useRef(0);
  const countRequestSeq = useRef(0);
  const countScopeRef = useRef(null);
  if (!countScopeRef.current || countScopeRef.current.owner !== ownerRequest || countScopeRef.current.target !== viewedUserId) {
    countScopeRef.current = { owner: ownerRequest, target: viewedUserId };
  }
  const countScope = countScopeRef.current;
  useEffect(() => {
    setRequestActionLoadingId(null);
    setEmotionNotifBusyId(null);
  }, [ownerRequest]);
  const requestsUnread = isSelfList && !!getFeatureUnread("EmotionLog", "requests");

  const visibleTabs = useMemo(
    () => FOLLOW_TABS.filter((item) => isSelfList || !item.selfOnly),
    [isSelfList]
  );

  const countByTab = useMemo(
    () => ({
      [TAB_FOLLOWING]: followingCount,
      [TAB_FOLLOWERS]: followerCount,
      [TAB_REQUESTED]: requestedCount,
      [TAB_REQUESTS]: requestCount,
    }),
    [followingCount, followerCount, requestedCount, requestCount]
  );


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

  useEffect(() => {
    if (!isSelfList || tab !== TAB_REQUESTS || !isOwnerCurrent(ownerRequest)) return;

    let cancelled = false;

    (async () => {
      try {
        await apiPost(FOLLOW_WIRE.routes.requestsRead, {}, ownerRequest.options);
        if (!cancelled && isOwnerCurrent(ownerRequest)) {
          setUnread("EmotionLog", "requests", false);
        }
      } catch (e) {
        console.warn("FollowListScreen mark requests read error:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isSelfList, setUnread, tab, ownerRequest, isOwnerCurrent]);

  const refreshCounts = useCallback(async () => {
    if (!viewedUserId || !isOwnerCurrent(ownerRequest)) return;
    const sequence = ++countRequestSeq.current;
    const isFresh = () => isOwnerCurrent(ownerRequest) && countScopeRef.current === countScope &&
      countRequestSeq.current === sequence;

    setCountLoading(true);
    try {
      // Supabase RLS の影響を避けるため、count は MashOS API 経由で取得する
      let accessToken = null;
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        accessToken = sessionData?.session?.access_token ?? null;
        if (!isFresh()) return;
      } catch {
        accessToken = null;
      }

      const res = await apiFetch(
        buildFollowStatsPath(viewedUserId),
        {
          ...ownerRequest.options,
          method: "GET",
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json().catch(() => ({}));
      if (!isFresh()) return;
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
            buildFollowRequestsPath("incoming", { limit: 300 }),
            {
              ...ownerRequest.options,
          method: "GET",
              headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
            }
          );

          if (rres.ok) {
            const rjson = await rres.json().catch(() => ({}));
            const reqs = Array.isArray(rjson?.requests) ? rjson.requests : [];
            const total = Number(rjson?.total_items);
            if (isFresh()) setRequestCount(Number.isFinite(total) ? total : reqs.length);
          } else {
            if (isFresh()) setRequestCount(0);
          }
        } catch {
          // no-op
        }
        // 自分が送った申請（申請中）の件数も取得する（MashOS API 経由）
        try {
          const ores = await apiFetch(
            buildFollowRequestsPath("outgoing", { limit: 300 }),
            {
              ...ownerRequest.options,
          method: "GET",
              headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
            }
          );

          if (ores.ok) {
            const ojson = await ores.json().catch(() => ({}));
            const oreqs = Array.isArray(ojson?.requests) ? ojson.requests : [];
            const ototal = Number(ojson?.total_items);
            if (isFresh()) setRequestedCount(Number.isFinite(ototal) ? ototal : oreqs.length);
          } else {
            if (isFresh()) setRequestedCount(0);
          }
        } catch {
          if (isFresh()) setRequestedCount(0);
        }
      } else {
        if (isFresh()) setRequestCount(0);
        if (isFresh()) setRequestedCount(0);
      }
    } catch (e) {
      // no-op（一覧取得でエラー表示するため）
    } finally {
      if (isFresh()) setCountLoading(false);
    }
  }, [viewedUserId, user, isSelfList, ownerRequest, isOwnerCurrent, countScope]);

  const loadList = useCallback(async () => {
    if (!viewedUserId || !isOwnerCurrent(ownerRequest)) return;
    const sequence = ++listRequestSeq.current;
    const isFresh = () => isOwnerCurrent(ownerRequest) && selectionRef.current === selection &&
      listRequestSeq.current === sequence;

    setLoading(true);
    setErrorText("");

    try {
      // Supabase RLS の影響を避けるため、一覧は MashOS API 経由で取得する
      let accessToken = null;
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        accessToken = sessionData?.session?.access_token ?? null;
        if (!isOwnerCurrent(ownerRequest)) return;
      } catch {
        accessToken = null;
      }

      if (!isFresh()) return;
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
          buildFollowRequestsPath("outgoing", { limit: 300 }),
          {
            ...ownerRequest.options,
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
        if (!isFresh()) return;
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
              connect_code: readRelatedConnectCode(r, "target") || "",
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
          ? buildFollowRequestsPath("incoming", { limit: 300 })
          : buildFollowListPath({ targetUserId: viewedUserId, tab });

      const res = await apiFetch(url, {
        ...ownerRequest.options,
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
      if (!isFresh()) return;

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
              connect_code: readRelatedConnectCode(r, "requester") || "",
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
      if (!isFresh()) return;
      console.warn("FollowListScreen loadList error:", e);
      setRows([]);
      setErrorText(String(e?.message || e));
    } finally {
      if (isFresh()) setLoading(false);
    }
  }, [tab, viewedUserId, user, isSelfList, ownerRequest, isOwnerCurrent, selection]);

  useEffect(() => {
    refreshCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewedUserId, ownerRequest]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const loadEmotionNotificationSettings = useCallback(async () => {
    if (!isOwnerCurrent(ownerRequest)) return;
    const sequence = ++notificationRequestSeq.current;
    const isFresh = () => isOwnerCurrent(ownerRequest) && selectionRef.current === selection &&
      notificationRequestSeq.current === sequence;
    if (!user || !isSelfList || tab !== TAB_FOLLOWING) {
      setEmotionNotifMap({});
      setEmotionNotifLoading(false);
      return;
    }

    setEmotionNotifLoading(true);
    try {
      let accessToken = null;
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        accessToken = sessionData?.session?.access_token ?? null;
        if (!isOwnerCurrent(ownerRequest)) return;
      } catch {
        accessToken = null;
      }

      if (!accessToken) {
        throw new Error("ログイン情報が取得できませんでした。再ログインしてください。");
      }

      const res = await apiFetch(EMOTION_NOTIFICATION_SETTINGS_ENDPOINT, {
        ...ownerRequest.options,
          method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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
      if (!isFresh()) return;
      setEmotionNotifMap(extractEmotionNotificationMap(json));
    } catch (e) {
      if (!isFresh()) return;
      console.warn("FollowListScreen loadEmotionNotificationSettings error:", e);
      setEmotionNotifMap({});
    } finally {
      if (isFresh()) setEmotionNotifLoading(false);
    }
  }, [user, isSelfList, tab, ownerRequest, isOwnerCurrent, selection]);

  useEffect(() => {
    loadEmotionNotificationSettings();
  }, [loadEmotionNotificationSettings]);

  const openProfile = (targetId) => {
    if (!navigation?.navigate || !targetId) return;

    const routeName = resolveAccountRouteName(navigation);
    navigation.navigate(routeName, { viewedUserId: targetId });
  };

  const removeFollowLink = async (targetId) => {
    if (!targetId) return;

    // 自分のフォロー/フォロワー一覧のみ解除できる（他ユーザーの一覧は閲覧のみ）
    if (!user || !isSelfList || !isOwnerCurrent(ownerRequest)) return;

    try {
      setErrorText("");

      if (tab === TAB_FOLLOWING) {
        // following: 自分 -> 相手 のリンクを削除（unfollow）
        let accessToken = null;
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          accessToken = sessionData?.session?.access_token ?? null;
        if (!isOwnerCurrent(ownerRequest)) return;
        } catch {
          accessToken = null;
        }

        if (!accessToken) {
          throw new Error("ログイン情報が取得できませんでした。再ログインしてください。");
        }

        const res = await apiFetch(FOLLOW_WIRE.routes.delete, {
          ...ownerRequest.options,
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
        if (!isOwnerCurrent(ownerRequest)) return;
        } catch {
          accessToken = null;
        }

        if (!accessToken) {
          throw new Error("ログイン情報が取得できませんでした。再ログインしてください。");
        }

        const res = await apiFetch(FOLLOW_WIRE.routes.removeFollower, {
          ...ownerRequest.options,
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

      if (!isOwnerCurrent(ownerRequest) || selectionRef.current !== selection) return;
      setRows((prev) =>
        prev.filter((r) => String(r?.id || "") !== String(targetId))
      );
      refreshCounts();
    } catch (e) {
      if (!isOwnerCurrent(ownerRequest)) return;
      console.warn("removeFollowLink error:", e);
      setErrorText(String(e?.message || e));
    }
  };

  const actOnFollowRequest = async (requestId, action) => {
    const reqId = safeString(requestId).trim();
    if (!reqId) return;

    // 自分の承認待ち一覧のみ操作できる
    if (!user || !isSelfList || !isOwnerCurrent(ownerRequest)) return;

    if (requestActionLoadingId) return;

    setRequestActionLoadingId(reqId);

    try {
      setErrorText("");

      let accessToken = null;
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        accessToken = sessionData?.session?.access_token ?? null;
        if (!isOwnerCurrent(ownerRequest)) return;
      } catch {
        accessToken = null;
      }

      if (!accessToken) {
        throw new Error("ログイン情報が取得できませんでした。再ログインしてください。");
      }

      const endpoint =
        action === "approve"
          ? FOLLOW_WIRE.routes.approveRequest
          : FOLLOW_WIRE.routes.rejectRequest;

      const res = await apiFetch(endpoint, {
        ...ownerRequest.options,
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

      if (!isOwnerCurrent(ownerRequest) || selectionRef.current !== selection) return;
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
      if (!isOwnerCurrent(ownerRequest)) return;
      console.warn("actOnFollowRequest error:", e);
      setErrorText(String(e?.message || e));
    } finally {
      if (isOwnerCurrent(ownerRequest)) setRequestActionLoadingId(null);
    }
  };


  const cancelOutgoingFollowRequest = async (targetUserId, requestId) => {
    const tgt = String(targetUserId || "").trim();
    const reqId = String(requestId || tgt || "").trim();
    if (!tgt) return;

    // 自分の「申請中」一覧のみ操作できる
    if (!user || !isSelfList || !isOwnerCurrent(ownerRequest)) return;

    if (requestActionLoadingId) return;

    setRequestActionLoadingId(reqId);

    try {
      setErrorText("");

      let accessToken = null;
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        accessToken = sessionData?.session?.access_token ?? null;
        if (!isOwnerCurrent(ownerRequest)) return;
      } catch {
        accessToken = null;
      }

      if (!accessToken) {
        throw new Error("ログイン情報が取得できませんでした。再ログインしてください。");
      }

      const res = await apiFetch(FOLLOW_WIRE.routes.cancelRequest, {
        ...ownerRequest.options,
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

      if (!isOwnerCurrent(ownerRequest) || selectionRef.current !== selection) return;
      // 一覧から除去
      setRows((prev) => prev.filter((r) => String(r?.id || "") !== String(tgt)));
      setRequestedCount((prev) => {
        const n = Number(prev);
        if (!Number.isFinite(n)) return 0;
        return Math.max(0, n - 1);
      });

      refreshCounts();
    } catch (e) {
      if (!isOwnerCurrent(ownerRequest)) return;
      console.warn("cancelOutgoingFollowRequest error:", e);
      setErrorText(String(e?.message || e));
    } finally {
      if (isOwnerCurrent(ownerRequest)) setRequestActionLoadingId(null);
    }
  };

  const toggleEmotionNotification = async (targetUserId) => {
    const ownerUserId = String(targetUserId || "").trim();
    if (!ownerUserId) return;
    if (!user || !isSelfList || tab !== TAB_FOLLOWING || !isOwnerCurrent(ownerRequest)) return;
    if (emotionNotifBusyId) return;

    const currentEnabled = emotionNotifMap?.[ownerUserId] !== false;
    const nextEnabled = !currentEnabled;

    setEmotionNotifMap((prev) => ({ ...(prev || {}), [ownerUserId]: nextEnabled }));
    setEmotionNotifBusyId(ownerUserId);

    try {
      setErrorText("");

      let accessToken = null;
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        accessToken = sessionData?.session?.access_token ?? null;
        if (!isOwnerCurrent(ownerRequest)) return;
      } catch {
        accessToken = null;
      }

      if (!accessToken) {
        throw new Error("ログイン情報が取得できませんでした。再ログインしてください。");
      }

      const res = await apiFetch(
        `${EMOTION_NOTIFICATION_SETTINGS_ENDPOINT}/${encodeURIComponent(ownerUserId)}`,
        {
          ...ownerRequest.options,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ is_enabled: nextEnabled }),
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
    } catch (e) {
      if (!isOwnerCurrent(ownerRequest)) return;
      console.warn("toggleEmotionNotification error:", e);
      setEmotionNotifMap((prev) => ({ ...(prev || {}), [ownerUserId]: currentEnabled }));
      setErrorText(String(e?.message || e));
    } finally {
      if (isOwnerCurrent(ownerRequest)) setEmotionNotifBusyId(null);
    }
  };

  const renderItem = ({ item }) => {
    const name = safeString(item?.display_name) || "（未設定）";
    const isSelf = !!user && String(item?.id || "") === String(user.id);
    const canToggleEmotionNotification =
      isSelfList && tab === TAB_FOLLOWING && !isSelf;
    const isEmotionNotificationEnabled =
      emotionNotifMap?.[String(item?.id || "")] !== false;
    const isEmotionNotificationBusy =
      String(emotionNotifBusyId || "") === String(item?.id || "");

    const requestDisabled = !item?._follow_request_id || !!requestActionLoadingId;
    const outgoingDisabled = !item?.id || !!requestActionLoadingId;
    const notificationDisabled = !item?.id || emotionNotifLoading || isEmotionNotificationBusy;
    const requestForeground = requestDisabled ? colors.TEXT_SUBTLE : colors.ON_SURFACE_TONAL;
    const rejectForeground = requestDisabled ? colors.TEXT_SUBTLE : colors.ERROR;
    const outgoingForeground = outgoingDisabled ? colors.TEXT_SUBTLE : colors.ERROR;
    const notificationForeground = notificationDisabled ? colors.TEXT_SUBTLE : isEmotionNotificationEnabled ? colors.ON_SURFACE_TONAL : colors.TEXT_ON_LIGHT;
    return (
      <View style={styles.row}>
        <TouchableOpacity style={{ alignSelf: 'stretch', minWidth: 0, minHeight: 44, justifyContent: 'center' }} activeOpacity={0.75} onPress={() => openProfile(item?.id)} accessibilityRole="button" accessibilityLabel={`${name}${item?.is_private_account ? "（非公開アカウント）" : ""}のアカウントを開く`}>
          <View style={styles.nameRow}>
            <Text style={[styles.rowName, { flexShrink: 1 }]}>
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
            <Text style={styles.rowSub}>
              申請: {String(item?._request_created_at || "").slice(0, 10)}
            </Text>
          ) : null}
          {isSelfList && tab === TAB_FOLLOWING && !isSelf ? (
            <Text style={styles.rowSub}>
              感情通知: {isEmotionNotificationEnabled ? "ON" : "OFF"}
            </Text>
          ) : null}
        </TouchableOpacity>

        <View style={[styles.rowRight, !isSelfList && { marginTop: 0 }]}>
          {isSelf ? (
            <Text style={styles.selfTag}>あなた</Text>
          ) : tab === TAB_REQUESTS && isSelfList ? (
            <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <TouchableOpacity
                style={[styles.qnaBtn, requestDisabled && { backgroundColor: colors.FIELD_BG, borderColor: colors.CARD_BORDER }]}
                activeOpacity={0.8}
                accessibilityRole="button" accessibilityLabel={`${name}：承認`} accessibilityState={{ disabled: requestDisabled, busy: !!requestActionLoadingId && String(requestActionLoadingId) === String(item?._follow_request_id || "") }}
                onPress={() =>
                  actOnFollowRequest(item?._follow_request_id, "approve")
                }
                disabled={!item?._follow_request_id || !!requestActionLoadingId}
              >
                {String(requestActionLoadingId || "") ===
                String(item?._follow_request_id || "") ? (
                  <ActivityIndicator
                    size="small"
                    color={requestForeground}
                    style={{ marginRight: 6 }}
                  />
                ) : (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={requestForeground}
                    style={{ marginRight: 6 }}
                  />
                )}
                <Text style={[styles.qnaBtnText, { color: requestForeground }]}>承認</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.qnaBtn,
                  { backgroundColor: requestDisabled ? colors.FIELD_BG : colors.ERROR_BG, borderColor: requestDisabled ? colors.CARD_BORDER : colors.ERROR },
                ]}
                activeOpacity={0.8}
                accessibilityRole="button" accessibilityLabel={`${name}：拒否`} accessibilityState={{ disabled: requestDisabled, busy: !!requestActionLoadingId && String(requestActionLoadingId) === String(item?._follow_request_id || "") }}
                onPress={() =>
                  actOnFollowRequest(item?._follow_request_id, "reject")
                }
                disabled={!item?._follow_request_id || !!requestActionLoadingId}
              >
                {String(requestActionLoadingId || "") ===
                String(item?._follow_request_id || "") ? (
                  <ActivityIndicator
                    size="small"
                    color={rejectForeground}
                    style={{ marginRight: 6 }}
                  />
                ) : (
                  <Ionicons
                    name="close"
                    size={16}
                    color={rejectForeground}
                    style={{ marginRight: 6 }}
                  />
                )}
                <Text style={[styles.qnaBtnText, { color: rejectForeground }]}>拒否</Text>
              </TouchableOpacity>
            </View>
          ) : tab === TAB_REQUESTED && isSelfList ? (
            <TouchableOpacity
              style={[styles.qnaBtn, { backgroundColor: outgoingDisabled ? colors.FIELD_BG : colors.ERROR_BG, borderColor: outgoingDisabled ? colors.CARD_BORDER : colors.ERROR }]}
              activeOpacity={0.8}
                accessibilityRole="button" accessibilityLabel={`${name}：取消`} accessibilityState={{ disabled: outgoingDisabled, busy: !!requestActionLoadingId && String(requestActionLoadingId) === String(item?._follow_request_id || "") }}
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
                  color={outgoingForeground}
                  style={{ marginRight: 6 }}
                />
              ) : (
                <Ionicons
                  name="close"
                  size={16}
                  color={outgoingForeground}
                  style={{ marginRight: 6 }}
                />
              )}
              <Text style={[styles.qnaBtnText, { color: outgoingForeground }]}>取消</Text>
            </TouchableOpacity>
          ) : isSelfList && tab === TAB_FOLLOWING ? (
            <View style={styles.rowRightGroup}>
              {canToggleEmotionNotification ? (
                <TouchableOpacity
                  style={[
                    styles.iconPill,
                    { backgroundColor: notificationDisabled ? colors.FIELD_BG : isEmotionNotificationEnabled ? colors.SURFACE_TONAL : colors.PANEL_BG },
                    (emotionNotifLoading || isEmotionNotificationBusy) && styles.iconPillDisabled,
                  ]}
                  activeOpacity={0.8}
                  accessibilityRole="switch" accessibilityState={{ checked: isEmotionNotificationEnabled, disabled: notificationDisabled, busy: isEmotionNotificationBusy }}
                  onPress={() => toggleEmotionNotification(item?.id)}
                  disabled={!item?.id || emotionNotifLoading || isEmotionNotificationBusy}
                  accessibilityLabel={
                    isEmotionNotificationEnabled
                      ? `${name}からの感情通知をオフにする`
                      : `${name}からの感情通知をオンにする`
                  }
                >
                  {isEmotionNotificationBusy ? (
                    <ActivityIndicator size="small" color={notificationForeground} />
                  ) : (
                    <Ionicons
                      name={
                        isEmotionNotificationEnabled
                          ? "notifications-outline"
                          : "notifications-off-outline"
                      }
                      size={18}
                      color={notificationForeground}
                    />
                  )}
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={[styles.qnaBtn, { backgroundColor: colors.ERROR_BG, borderColor: colors.ERROR }]}
                activeOpacity={0.8}
                accessibilityRole="button" accessibilityLabel={`${name}：フォロー関係を削除`}
                onPress={() => removeFollowLink(item?.id)}
              >
                <Ionicons
                  name="trash-outline"
                  size={16}
                  color={colors.ERROR}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.qnaBtnText, { color: colors.ERROR }]}>削除</Text>
              </TouchableOpacity>
            </View>
          ) : isSelfList ? (
            <TouchableOpacity
              style={[styles.qnaBtn, { backgroundColor: colors.ERROR_BG, borderColor: colors.ERROR }]}
              activeOpacity={0.8}
                accessibilityRole="button" accessibilityLabel={`${name}：フォロー関係を削除`}
              onPress={() => removeFollowLink(item?.id)}
            >
              <Ionicons
                name="trash-outline"
                size={16}
                color={colors.ERROR}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.qnaBtnText, { color: colors.ERROR }]}>削除</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
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
    <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />

      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityRole="button" accessibilityLabel="前の画面に戻る"
          onPress={() => navigation?.goBack?.()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color={colors.TITLE_GOLD} />
        </TouchableOpacity>



        <TouchableOpacity
          onPress={() => {
            refreshCounts();
            loadList();
          }}
          accessibilityRole="button" accessibilityLabel="フォローリストを更新する"
          style={styles.refreshButton}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={18} color={colors.TITLE_GOLD} />
        </TouchableOpacity>
      </View>

      {/* リスト */}
      <FlatList
          ListHeaderComponent={<View><Text style={styles.headerTitle}>フォローリスト</Text>      {/* タブ */}
      <View style={styles.tabBar}>
        {visibleTabs.map((tabItem) => {
          const isActive = tab === tabItem.key;
          const count = countByTab[tabItem.key];
          const accessibilityLabel =
            countLoading || !Number.isFinite(Number(count))
              ? `${tabItem.label}を開く`
              : `${tabItem.label} ${Number(count)}件を開く`;

          return (
            <View key={tabItem.key} style={styles.tabItemWrap}>
              <CocolonPressable
                style={styles.tabItem}
                onPress={() => setTab(tabItem.key)}
                accessibilityLabel={accessibilityLabel}
                accessibilityRole="tab" accessibilityState={{ selected: isActive }}
              >
                <View
                  style={[
                    styles.tabLabelWrap,
                    isActive && styles.tabLabelWrapActive,
                  ]}
                >
                  <View style={styles.tabLabelRow}>
                    {isActive ? <Ionicons name="checkmark" size={16} color={colors.ON_SURFACE_TONAL} style={{ marginRight: 6 }} /> : null}
                    <Text
                      style={[
                        styles.tabLabelText,
                        isActive && styles.tabLabelTextActive,
                      ]}
                    >
                      {tabItem.label}
                    </Text>
                    <UnreadBadge
                      visible={tabItem.key === TAB_REQUESTS && requestsUnread}
                      style={styles.tabUnreadBadge}
                    />
                  </View>
                </View>
              </CocolonPressable>
            </View>
          );
        })}
      </View>
      {/* エラー表示 */}
      {errorText ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            処理を完了できませんでした: {errorText}
          </Text>
        </View>
      ) : null}

</View>}
          data={loading ? [] : rows}
          keyExtractor={(item) => String(item?.id)}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,

          ]}
          ListEmptyComponent={
            loading ? <View style={styles.loadingWrap}><ActivityIndicator color={colors.ON_SURFACE_TONAL} accessibilityLabel="フォローリストを読込中" /></View> : errorText ? null : <Text style={styles.emptyText}>{emptyText}</Text>
          }
        />
    </SafeAreaView>
  );
}

function createStyles(COLORS, ui) {
  const text = ui?.text || {};
  return StyleSheet.create(applyTypographyTokens({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.BG_SILVER,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 8,
      width: "100%",
      maxWidth: 680,
      alignSelf: "center",
    },
    backButton: {
      padding: 10,
      width: 44,
      minHeight: 44,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 22,
    },
    refreshButton: {
      padding: 10,
      width: 44,
      alignItems: "center",
      minHeight: 44,
      justifyContent: "center",
      borderRadius: 22,
    },
    headerTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
      minWidth: 0,
      marginBottom: 16,
    },

    tabBar: {
      flexDirection: "row",
      alignItems: "stretch",
      justifyContent: "flex-start",
      borderBottomWidth: 0,
      marginHorizontal: -4,
      marginBottom: 16,
      flexWrap: "wrap",
    },
    tabItemWrap: {
      width: "50%",
      padding: 4,
      minWidth: 0,
    },
    tabItem: {
      alignItems: "stretch",
      justifyContent: "center",
      paddingTop: 0,
      paddingHorizontal: 0,
      minHeight: 48,
    },
    tabLabelWrap: {
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
      minHeight: 48,
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      borderRadius: ui?.radius?.button ?? 24,
      backgroundColor: COLORS.FIELD_BG,
    },
    tabLabelRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
      minWidth: 0,
    },
    tabLabelWrapActive: {
      borderBottomColor: COLORS.ON_SURFACE_TONAL,
      borderColor: COLORS.ON_SURFACE_TONAL,
      backgroundColor: COLORS.SURFACE_TONAL,
    },
    tabLabelText: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
      textAlign: "center",
    },
    tabLabelTextActive: {
      color: COLORS.ON_SURFACE_TONAL,
    },
    tabUnreadBadge: {
      marginLeft: 6,
      alignSelf: "center",
      flexShrink: 0,
    },

    errorBox: {
      marginHorizontal: 0,
      marginBottom: 16,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.ERROR,
      backgroundColor: COLORS.ERROR_BG,
    },
    errorText: {
      color: COLORS.ERROR,
    },

    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 32,
      flexGrow: 1,
      width: "100%",
      maxWidth: 680,
      alignSelf: "center",
    },

    row: {
      flexDirection: "column",
      alignItems: "stretch",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderRadius: ui?.radius?.card ?? 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      marginBottom: 12,
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      minWidth: 0,
    },
    rowName: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
      minWidth: 0,
    },
    rowSub: {
      marginTop: 4,
      color: COLORS.TEXT_SUBTLE,
    },

    rowRight: {
      alignItems: "flex-start",
      justifyContent: "center",
      alignSelf: "stretch",
      marginTop: 12,
      minWidth: 0,
    },
    rowRightGroup: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 8,
    },
    iconPill: {
      width: 44,
      height: 44,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      alignItems: "center",
      justifyContent: "center",
    },
    iconPillDisabled: {
      backgroundColor: COLORS.FIELD_BG,
    },

    qnaBtn: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.SURFACE_TONAL,
      backgroundColor: COLORS.SURFACE_TONAL,
      minHeight: 44,
      justifyContent: "center",
      maxWidth: "100%",
    },
    qnaBtnText: {
      color: COLORS.ON_SURFACE_TONAL,
      flexShrink: 1,
      textAlign: "center",
    },

    selfTag: {
      color: COLORS.ON_SURFACE_TONAL,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.SURFACE_TONAL,
      backgroundColor: COLORS.SURFACE_TONAL,
    },

    loadingWrap: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 32,
    },
    emptyText: {
      textAlign: "center",
      color: COLORS.TEXT_SUBTLE,
      paddingVertical: 32,
    },
  }, ui, {"headerTitle":"screenTitle","tabLabelText":"button","errorText":"description","rowName":"body","rowSub":"description","qnaBtnText":"button","selfTag":"meta","emptyText":"description"}));
}
