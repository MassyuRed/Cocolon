import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

import { useAuth } from "../../AuthContext";
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
  const { authOwnerGeneration } = useAuth();
  const ownerRequestRef = useRef(null);
  const [followingCount, setFollowingCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followCountLoading, setFollowCountLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowRequested, setIsFollowRequested] = useState(false);
  const [followActionLoading, setFollowActionLoading] = useState(false);

  const [accountStatus, setAccountStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    ownerRequestRef.current = { expectedUserId: user?.id, signal: controller.signal };
    setFollowingCount(0);
    setFollowerCount(0);
    setFollowCountLoading(false);
    setIsFollowing(false);
    setIsFollowRequested(false);
    setFollowActionLoading(false);
    setAccountStatus(null);
    setStatusLoading(false);
    setStatusError("");
    return () => controller.abort();
  }, [user?.id, targetUserId, authOwnerGeneration]);

  const refreshFollowState = async () => {
    if (!user?.id || !targetUserId) return;
    const request = ownerRequestRef.current;
    if (request?.expectedUserId !== user.id || request.signal.aborted) return;

    setFollowCountLoading(true);
    try {
      const res = await apiFetch(buildFollowStatsPath(targetUserId), {
        ...request,
        method: "GET",
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
      if (request.signal.aborted) return;

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
      if (request.signal.aborted || e?.name === "AccountChangedError") return;
      console.warn("refreshFollowState error:", e);
    } finally {
      if (!request.signal.aborted) setFollowCountLoading(false);
    }
  };

  const refreshAccountStatus = async () => {
    if (!user?.id || !targetUserId) return;
    const request = ownerRequestRef.current;
    if (request?.expectedUserId !== user.id || request.signal.aborted) return;

    setStatusLoading(true);
    setStatusError("");
    try {
      const qs = `target_user_id=${encodeURIComponent(String(targetUserId))}`;
      const res = await apiFetch(`${ACCOUNT_WIRE.routes.status}?${qs}`, {
        ...request,
        method: "GET",
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
      if (request.signal.aborted) return;
      setAccountStatus(json && typeof json === "object" ? json : {});
    } catch (e) {
      if (request.signal.aborted || e?.name === "AccountChangedError") return;
      console.warn("refreshAccountStatus error:", e);
      setAccountStatus(null);
      setStatusError(String(e?.message || e));
    } finally {
      if (!request.signal.aborted) setStatusLoading(false);
    }
  };

  useEffect(() => {
    refreshFollowState();
    refreshAccountStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, targetUserId, authOwnerGeneration]);

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

    const request = ownerRequestRef.current;
    if (request?.expectedUserId !== user.id || request.signal.aborted) return;
    setFollowActionLoading(true);
    try {
      const endpoint = isFollowing ? FOLLOW_WIRE.routes.delete : FOLLOW_WIRE.routes.create;
      const body = code
        ? { connect_code: code }
        : { owner_user_id: targetUserId };
      const json = await apiPost(endpoint, body, request);
      if (request.signal.aborted) return;
      const nextFollowing = !!json?.is_following;
      const nextRequested = !!json?.is_follow_requested && !nextFollowing;

      setIsFollowing(nextFollowing);
      setIsFollowRequested(nextRequested);

      await refreshFollowState();
    } catch (e) {
      if (request.signal.aborted || e?.name === "AccountChangedError") return;
      console.warn("toggle follow error:", e);
      Alert.alert("操作に失敗しました", String(e?.message || e));
    } finally {
      if (!request.signal.aborted) setFollowActionLoading(false);
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
