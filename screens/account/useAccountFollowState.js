import { useEffect, useState } from "react";
import { Alert } from "react-native";

import { supabase } from "../../lib/supabase";
import { apiFetch, apiPost } from "../../lib/apiClient";
import {
  ACCOUNT_WIRE,
  FOLLOW_WIRE,
  buildFollowStatsPath,
} from "../../lib/compat/legacyWireContracts";
import { readAccountStatusValue } from "./accountModel";

export function useAccountFollowState({
  navigation,
  user,
  targetUserId,
  connectCode,
}) {
  const [followingCount, setFollowingCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followCountLoading, setFollowCountLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowRequested, setIsFollowRequested] = useState(false);
  const [followActionLoading, setFollowActionLoading] = useState(false);

  const [accountStatus, setAccountStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");

  const refreshFollowState = async () => {
    if (!targetUserId) return;

    setFollowCountLoading(true);
    try {
      let accessToken = null;
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        accessToken = sessionData?.session?.access_token ?? null;
      } catch {
        accessToken = null;
      }

      const res = await apiFetch(buildFollowStatsPath(targetUserId), {
        method: "GET",
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {},
      });

      if (!res.ok) {
        let detail = `HTTP ${res.status}`;
        try {
          const j = await res.json();
          if (j && typeof j.detail === "string") detail = j.detail;
        } catch {}
        throw new Error(detail);
      }

      const json = await res.json().catch(() => ({}));

      const followingCnt = Number(json?.following_count ?? 0) || 0;
      const followerCnt = Number(json?.follower_count ?? 0) || 0;
      const isFollowingServer = !!json?.is_following;
      const isFollowRequestedServer = !!json?.is_follow_requested;

      setFollowingCount(followingCnt);
      setFollowerCount(followerCnt);

      const isSelfNow = !!user && String(targetUserId || "") === String(user.id);
      if (user && !isSelfNow) {
        setIsFollowing(isFollowingServer);
        setIsFollowRequested(!isFollowingServer && isFollowRequestedServer);
      } else {
        setIsFollowing(false);
        setIsFollowRequested(false);
      }
    } catch (e) {
      console.warn("refreshFollowState error:", e);
    } finally {
      setFollowCountLoading(false);
    }
  };

  const refreshAccountStatus = async () => {
    if (!targetUserId) return;

    setStatusLoading(true);
    setStatusError("");
    try {
      let accessToken = null;
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        accessToken = sessionData?.session?.access_token ?? null;
      } catch {
        accessToken = null;
      }

      if (!accessToken) {
        throw new Error("アクセストークンが取得できませんでした");
      }

      const qs = `target_user_id=${encodeURIComponent(String(targetUserId))}`;
      const res = await apiFetch(`${ACCOUNT_WIRE.routes.status}?${qs}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        let detail = `HTTP ${res.status}`;
        try {
          const j = await res.json();
          if (j && typeof j.detail === "string") detail = j.detail;
        } catch {}
        throw new Error(detail);
      }

      const json = await res.json().catch(() => ({}));
      setAccountStatus(json && typeof json === "object" ? json : {});
    } catch (e) {
      console.warn("refreshAccountStatus error:", e);
      setAccountStatus(null);
      setStatusError(String(e?.message || e));
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    refreshFollowState();
    refreshAccountStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, targetUserId]);

  useEffect(() => {
    if (!navigation?.addListener) return undefined;

    const unsubscribe = navigation.addListener("focus", () => {
      refreshFollowState();
      refreshAccountStatus();
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, user, targetUserId]);

  const onToggleFollow = async () => {
    if (followActionLoading) return;

    if (!user) {
      Alert.alert("ログインが必要です", "フォローするにはログインが必要です。");
      return;
    }

    const isSelfNow = !!user && String(targetUserId || "") === String(user.id);
    if (isSelfNow) return;

    const code = String(connectCode || "").trim();
    if (!code && !targetUserId) {
      Alert.alert("準備中", "相手のユーザーIDがまだ取得できていません。");
      return;
    }

    setFollowActionLoading(true);
    try {
      const endpoint = isFollowing ? FOLLOW_WIRE.routes.delete : FOLLOW_WIRE.routes.create;
      const body = code
        ? { connect_code: code }
        : { owner_user_id: targetUserId };
      const json = await apiPost(endpoint, body);
      const nextFollowing = !!json?.is_following;
      const nextRequested = !!json?.is_follow_requested && !nextFollowing;

      setIsFollowing(nextFollowing);
      setIsFollowRequested(nextRequested);

      await refreshFollowState();
    } catch (e) {
      console.warn("toggle follow error:", e);
      Alert.alert("操作に失敗しました", String(e?.message || e));
    } finally {
      setFollowActionLoading(false);
    }
  };

  const openFollowList = (initialTab) => {
    if (!targetUserId) return;
    if (!navigation?.navigate) return;

    navigation.navigate("FollowListScreen", {
      viewedUserId: targetUserId,
      connectCode: connectCode || null,
      initialTab: initialTab || "following",
    });
  };

  const statusValue = (key, fallbackKeys = []) =>
    readAccountStatusValue(accountStatus, key, fallbackKeys);

  return {
    followingCount,
    followerCount,
    followCountLoading,
    isFollowing,
    isFollowRequested,
    followActionLoading,
    accountStatus,
    statusLoading,
    statusError,
    refreshFollowState,
    refreshAccountStatus,
    onToggleFollow,
    openFollowList,
    statusValue,
  };
}
