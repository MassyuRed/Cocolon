import React, { useEffect, useState, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { supabase } from "../lib/supabase";
import { useAuth } from "../AuthContext"; // パスはプロジェクト構成に合わせて調整してね
import { useTheme } from "../theme/ThemeContext";
import CocolonBackButton from "../components/CocolonBackButton";
import CocolonPressable from "../components/CocolonPressable";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";

// IAP（購入復元）
import {
  restoreAvailablePurchases,
  syncPurchaseToSubscriptionTier,
} from "../lib/iap/iapService";
import { getPlanSku } from "../lib/iap/iapConfig";
import { apiGet, apiPost, apiPatch, apiFetch } from "../lib/apiClient";

// 🔧 ここを変えると Account 画面のパネル高さが変わる
const PANEL_MIN_HEIGHT = 695;
const DISPLAY_NAME_MAX_LENGTH = 20;
const DISPLAY_NAME_TAKEN_MESSAGE = "このユーザー名はすでに使われています。";

function normalizeDisplayName(value) {
  return String(value || "").trim();
}

function mapDisplayNameConflictMessage(errorLike) {
  const raw = String(errorLike?.message || errorLike || "");
  const lower = raw.toLowerCase();
  if (lower.includes("profiles_display_name_unique")) {
    return DISPLAY_NAME_TAKEN_MESSAGE;
  }
  if (
    lower.includes("display_name") &&
    (lower.includes("unique") || lower.includes("duplicate") || lower.includes("already"))
  ) {
    return DISPLAY_NAME_TAKEN_MESSAGE;
  }
  return "";
}

async function checkDisplayNameAvailability(candidate) {
  const normalized = normalizeDisplayName(candidate);
  if (!normalized) return false;

  try {
    const json = await apiGet(
      `/account/display-name/availability?candidate=${encodeURIComponent(normalized)}`
    );
    return typeof json?.available === "boolean" ? json.available : !!json?.available;
  } catch (e) {
    console.warn("AccountScreen: display name availability check failed", e);
    return null;
  }
}

// MyModel（MashOS）API
const MYMODEL_API_BASE_URL =
  process.env.EXPO_PUBLIC_MYMODEL_API_URL || "https://mashos-api.onrender.com";

// Tier → ラベル
const SUB_TIER_LABEL = {
  free: "Freeプラン",
  plus: "Plusプラン",
  premium: "Premiumプラン",
};

// Tier → MyProfile許可モード（フロント仮定義：types.ts が無い前提）
const TIER_ALLOWED_MYPROFILE_MODES = {
  free: ["light"],
  plus: ["light", "standard"],
  premium: ["light", "standard", "deep"],
};

function normalizeSubscriptionTier(raw) {
  const t = String(raw || "").trim().toLowerCase();
  if (t === "plus" || t === "premium" || t === "free") return t;
  return "free";
}

function formatAllowedModes(modes) {
  const arr = Array.isArray(modes) ? modes : [];
  if (arr.length === 0) return "light";
  // 表示順を固定
  const order = ["light", "standard", "deep"];
  return order.filter((m) => arr.includes(m)).join(" / ");
}

function getNavigatorRouteNames(navigationLike) {
  try {
    const state = navigationLike?.getState?.();
    return Array.isArray(state?.routeNames) ? state.routeNames : [];
  } catch {
    return [];
  }
}


function findNavigationForRoute(navigationLike, routeName) {
  let current = navigationLike;
  while (current) {
    const routeNames = getNavigatorRouteNames(current);
    if (routeNames.includes(routeName)) {
      return current;
    }
    try {
      current = current?.getParent?.() || null;
    } catch {
      current = null;
    }
  }
  return null;
}


async function fetchSubscriptionMe() {
  const fallbackTier = "free";
  const fallbackModes = TIER_ALLOWED_MYPROFILE_MODES[fallbackTier];

  // Supabase セッションからアクセストークンを取得して Authorization ヘッダに載せる
  let accessToken = null;
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    accessToken = sessionData?.session?.access_token ?? null;
  } catch (e) {
    // ここは握りつぶして fail-closed
    accessToken = null;
  }

  if (!accessToken) {
    return {
      subscription_tier: fallbackTier,
      allowed_myprofile_modes: fallbackModes,
      _error: "no_access_token",
    };
  }

  const res = await apiFetch(`${MYMODEL_API_BASE_URL}/subscription/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    return {
      subscription_tier: fallbackTier,
      allowed_myprofile_modes: fallbackModes,
      _error: `http_${res.status}`,
    };
  }

  const json = await res.json().catch(() => ({}));

  const tier = normalizeSubscriptionTier(json?.subscription_tier ?? json?.tier);
  const allowed =
    (Array.isArray(json?.allowed_myprofile_modes) && json.allowed_myprofile_modes) ||
    (Array.isArray(json?.allowedMyProfileModes) && json.allowedMyProfileModes) ||
    TIER_ALLOWED_MYPROFILE_MODES[tier] ||
    fallbackModes;

  return {
    subscription_tier: tier,
    allowed_myprofile_modes: allowed,
  };
}

export default function AccountScreen({ navigation, route, viewedUserId }) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);

  const { user } = useAuth();
  const routeViewedUserId = route?.params?.viewedUserId;
  const targetUserId = viewedUserId || routeViewedUserId || user?.id || null;
  const [displayName, setDisplayName] = useState("");
  const [friendCode, setFriendCode] = useState("");
  const [myProfileCode, setMyProfileCode] = useState("");
  const [loading, setLoading] = useState(true);
  // Follow / Follower（MyModel フォロー）
  const [followingCount, setFollowingCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followCountLoading, setFollowCountLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowRequested, setIsFollowRequested] = useState(false);
  const [followActionLoading, setFollowActionLoading] = useState(false);

  // ステータス（アカウント公開情報）
  const [accountStatus, setAccountStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");

  const [profileCreateLoading, setProfileCreateLoading] = useState(false);
  const [profileCreateError, setProfileCreateError] = useState("");
  const [profileCreateItems, setProfileCreateItems] = useState([]);
  const [profileCreateMeta, setProfileCreateMeta] = useState(null);

  // ユーザー名の再設定（編集）
  const [nameDraft, setNameDraft] = useState("");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameChecking, setNameChecking] = useState(false);
  const [nameError, setNameError] = useState("");
  const [nameEditOpen, setNameEditOpen] = useState(false);

  // アカウント設定（公開 / 非公開）
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [visibilitySaving, setVisibilitySaving] = useState(false);
  const [accountVisibility, setAccountVisibility] = useState({
    is_friend_code_public: true,
    is_recommendation_enabled: true,
    is_ranking_visible: true,
    is_private_account: false,
  });

  // サブスク表示
  const [subTier, setSubTier] = useState("free");
  const [subAllowedModes, setSubAllowedModes] = useState(["light"]);
  const [subLoading, setSubLoading] = useState(true);
  const [subError, setSubError] = useState("");
  const [restoreLoading, setRestoreLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        const isSelfNow = String(targetUserId || "") === String(user.id);
        const json = isSelfNow
          ? await apiGet("/account/profile/me")
          : await apiGet(
              `/account/profile?target_user_id=${encodeURIComponent(
                String(targetUserId || user.id)
              )}`
            );

        if (!cancelled) {
          setDisplayName(String(json?.display_name || ""));
          setFriendCode(String(json?.friend_code || ""));
          setMyProfileCode(String(json?.myprofile_code || ""));
        }
      } catch (e) {
        console.warn("loadProfile error:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [user, targetUserId]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // 未ログインなら free 表示で固定
      if (!user) {
        if (!cancelled) {
          setSubTier("free");
          setSubAllowedModes(["light"]);
          setSubLoading(false);
          setSubError("");
        }
        return;
      }

      setSubLoading(true);
      setSubError("");

      try {
        const me = await fetchSubscriptionMe();
        if (!cancelled) {
          const tier = normalizeSubscriptionTier(me?.subscription_tier);
          setSubTier(tier);
          setSubAllowedModes(
            Array.isArray(me?.allowed_myprofile_modes)
              ? me.allowed_myprofile_modes
              : TIER_ALLOWED_MYPROFILE_MODES[tier] || ["light"]
          );
          setSubError(me?._error ? String(me._error) : "");
        }
      } catch (e) {
        if (!cancelled) {
          setSubTier("free"); // fail-closed
          setSubAllowedModes(["light"]);
          setSubError(String(e?.message || e));
        }
      } finally {
        if (!cancelled) setSubLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);


  // ------------------------------
  // Follow / Follower（MyModel フォロー）
  // - DB: myprofile_links (viewer_user_id -> owner_user_id)
  // - 指定: myProfileCode（myprofile_code）を起点に owner_user_id を解決してから follow/unfollow
  // ------------------------------

  const refreshFollowState = async () => {
    if (!targetUserId) return;

    setFollowCountLoading(true);
    try {
      // Supabase RLS の影響を避けるため、follow/follower の取得も MashOS API 経由で行う
      let accessToken = null;
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        accessToken = sessionData?.session?.access_token ?? null;
      } catch {
        accessToken = null;
      }

      const qs = `target_user_id=${encodeURIComponent(String(targetUserId))}`;
      const res = await apiFetch(`${MYMODEL_API_BASE_URL}/myprofile/follow-stats?${qs}`, {
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

      // 自分が表示中アカウントをフォローしているか
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
      const res = await apiFetch(`${MYMODEL_API_BASE_URL}/account/status?${qs}`, {
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


  const refreshProfileCreate = async () => {
    if (!targetUserId || !user) {
      setProfileCreateItems([]);
      setProfileCreateMeta(null);
      setProfileCreateError("");
      return;
    }

    setProfileCreateLoading(true);
    setProfileCreateError("");
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
      const res = await apiFetch(`${MYMODEL_API_BASE_URL}/account/profile-create?${qs}`, {
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
      setProfileCreateItems(Array.isArray(json?.items) ? json.items : []);
      setProfileCreateMeta(json?.meta && typeof json.meta === "object" ? json.meta : null);
    } catch (e) {
      console.warn("refreshProfileCreate error:", e);
      setProfileCreateItems([]);
      setProfileCreateMeta(null);
      setProfileCreateError(String(e?.message || e));
    } finally {
      setProfileCreateLoading(false);
    }
  };

  const openProfileCreate = () => {
    if (!user || !isSelf) return;

    const screenParams = {
      returnToAccount: true,
      viewedUserId: String(user?.id || targetUserId || ""),
    };

    const directNav = findNavigationForRoute(navigation, "MyModelCreate");
    if (directNav) {
      try {
        directNav.navigate("MyModelCreate", screenParams);
        return;
      } catch {
        // noop
      }
    }

    const tabNav = findNavigationForRoute(navigation, "MyModel");
    if (tabNav) {
      try {
        tabNav.navigate("MyModel", {
          screen: "MyModelCreate",
          params: screenParams,
        });
        return;
      } catch {
        // noop
      }
    }

    Alert.alert("開けません", "ProfileCreate を開けませんでした。もう一度お試しください。");
  };

  useEffect(() => {
    refreshFollowState();
    refreshAccountStatus();
    loadAccountVisibilityMe();
    refreshProfileCreate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, targetUserId]);


  // 画面に戻ってきたタイミングでもフォロー数を最新化（navigation focus）
  useEffect(() => {
    if (!navigation?.addListener) return;

    const unsubscribe = navigation.addListener("focus", () => {
      refreshFollowState();
      refreshAccountStatus();
      loadAccountVisibilityMe();
      refreshProfileCreate();
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

    const code = String(myProfileCode || "").trim();
    if (!code && !targetUserId) {
      Alert.alert("準備中", "相手のMyModelIDがまだ取得できていません。");
      return;
    }

    setFollowActionLoading(true);
    try {
      const endpoint = isFollowing ? "/myprofile/unfollow" : "/myprofile/follow";
      const body = code
        ? { myprofile_code: code }
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
      myprofileCode: myProfileCode || null,
      initialTab: initialTab || "following",
    });
  };

  // 画面に表示するのは「短い公開ID（friend_code）」をユーザーIDとして扱う
  const userIdForDisplay = user ? friendCode || "（生成中）" : "未ログイン";
  const myProfileIdForDisplay = user
    ? myProfileCode || "（生成中）"
    : "未ログイン";
  const isDark = themeName === "dark";

  const isSelf = !!user && String(targetUserId || "") === String(user.id);

  const isPrivateAccount = !!(
    (isSelf && accountVisibility?.is_private_account) ||
      (!isSelf && (accountStatus?.is_private_account || accountStatus?.isPrivateAccount))
  );

  const isFriendCodePublic = !!(
    accountStatus?.is_friend_code_public ??
      accountStatus?.isFriendCodePublic ??
      accountStatus?.friend_code_public ??
      accountStatus?.friendCodePublic
  );

  const canShowFriendCode = !user || isSelf || isFriendCodePublic;

  const statusValue = (key, fallbackKeys = []) => {
    const obj = accountStatus && typeof accountStatus === "object" ? accountStatus : null;
    const keys = [key, ...(Array.isArray(fallbackKeys) ? fallbackKeys : [])];
    for (const k of keys) {
      const v = obj ? obj[k] : undefined;
      if (v === null || v === undefined) continue;
      const n = Number(v);
      if (Number.isFinite(n)) return String(Math.trunc(n));
    }
    return "—";
  };

  const tierLabel = SUB_TIER_LABEL[subTier] || "Freeプラン";
  const profileCreateTotal = Number(profileCreateMeta?.total_questions ?? 5) || 5;
  const profileCreateAnsweredCount = Number(profileCreateMeta?.answered_count ?? profileCreateItems.length ?? 0) || 0;
  const profileCreateVisibleItems = Array.isArray(profileCreateItems) ? profileCreateItems : [];

  const tierPrice =
    subTier === "plus"
      ? "月額480円"
      : subTier === "premium"
      ? "月額980円"
      : "無料";

  const openNameEdit = () => {
    if (!user) {
      Alert.alert("ログインが必要です", "ユーザー名の編集にはログインが必要です。");
      return;
    }
    if (!isSelf) return;
    setNameDraft(displayName || "");
    setNameError("");
    setNameChecking(false);
    setNameEditOpen(true);
  };

  const onCopyFriendCode = async () => {
    const code = String(friendCode || "").trim();
    if (!code) {
      Alert.alert("準備中", "共有コードがまだ取得できていません。");
      return;
    }
    try {
      // FriendScreen のフレンド登録ポップアップ内と同じ導線（Share）
      await Share.share({ message: code });
    } catch (e) {
      console.warn("copy friend code failed:", e);
    }
  };

  const onShareProfile = async () => {
    const code = String(friendCode || "").trim();
    if (!code) {
      Alert.alert("準備中", "共有コードがまだ取得できていません。");
      return;
    }
    const url = `https://emlis.app/u/${code}`;
    try {
      await Share.share({ message: url });
    } catch (e) {
      console.warn("share failed:", e);
    }
  };

  const openAccountSettings = () => {
    if (!user) {
      Alert.alert("ログインが必要です", "アカウント設定を開くにはログインが必要です。");
      return;
    }
    if (!isSelf) return;
    setAccountSettingsOpen(true);
  };

  const closeAccountSettings = () => {
    if (visibilitySaving) return;
    setAccountSettingsOpen(false);
  };

  const closeNameEdit = () => {
    if (nameSaving || nameChecking) return;
    setNameEditOpen(false);
    setNameError("");
  };

  const loadAccountVisibilityMe = async () => {
    if (!user || !isSelf) return;

    setVisibilityLoading(true);
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

      const res = await apiFetch(`${MYMODEL_API_BASE_URL}/account/visibility/me`, {
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
      if (json && typeof json === "object") {
        setAccountVisibility((prev) => ({
          ...prev,
          is_friend_code_public: !!json.is_friend_code_public,
          is_recommendation_enabled: !!json.is_recommendation_enabled,
          is_ranking_visible: !!json.is_ranking_visible,
          is_private_account: !!json.is_private_account,
        }));
      }
    } catch (e) {
      console.warn("loadAccountVisibilityMe error:", e);
      Alert.alert("取得に失敗しました", String(e?.message || e));
    } finally {
      setVisibilityLoading(false);
    }
  };

  const patchAccountVisibilityMe = async (patch) => {
    if (!user || !isSelf) return;
    if (visibilitySaving) return;

    const body = patch && typeof patch === "object" ? patch : null;
    if (!body || Object.keys(body).length === 0) return;

    setVisibilitySaving(true);
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

      const res = await apiFetch(`${MYMODEL_API_BASE_URL}/account/visibility/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
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
      if (json && typeof json === "object") {
        setAccountVisibility((prev) => ({
          ...prev,
          is_friend_code_public:
            typeof json.is_friend_code_public === "boolean"
              ? json.is_friend_code_public
              : prev.is_friend_code_public,
          is_recommendation_enabled:
            typeof json.is_recommendation_enabled === "boolean"
              ? json.is_recommendation_enabled
              : prev.is_recommendation_enabled,
          is_ranking_visible:
            typeof json.is_ranking_visible === "boolean"
              ? json.is_ranking_visible
              : prev.is_ranking_visible,
          is_private_account:
            typeof json.is_private_account === "boolean"
              ? json.is_private_account
              : prev.is_private_account,
        }));
      }
    } catch (e) {
      console.warn("patchAccountVisibilityMe error:", e);
      Alert.alert("更新に失敗しました", String(e?.message || e));
    } finally {
      setVisibilitySaving(false);
    }
  };

  useEffect(() => {
    if (!accountSettingsOpen) return;
    loadAccountVisibilityMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountSettingsOpen]);

  const saveDisplayName = async () => {
    if (nameSaving || nameChecking) return;

    if (!user) {
      Alert.alert("ログインが必要です", "ユーザー名の編集にはログインが必要です。");
      return;
    }
    if (!isSelf) return;

    const nextName = normalizeDisplayName(nameDraft);

    if (!nextName) {
      setNameError("ユーザー名を入力してください。");
      Alert.alert("入力してください", "ユーザー名を入力してください。");
      return;
    }

    if (nextName.length > DISPLAY_NAME_MAX_LENGTH) {
      const message = `ユーザー名は${DISPLAY_NAME_MAX_LENGTH}文字以内で入力してください。`;
      setNameError(message);
      Alert.alert("文字数オーバー", message);
      return;
    }

    setNameError("");
    setNameChecking(true);
    try {
      const available = await checkDisplayNameAvailability(nextName);
      if (available === false) {
        setNameError(DISPLAY_NAME_TAKEN_MESSAGE);
        return;
      }
    } finally {
      setNameChecking(false);
    }

    setNameSaving(true);
    try {
      const json = await apiPatch("/account/profile/me", {
        display_name: nextName,
      });

      // Auth の user_metadata も同期（失敗しても server-owned profile 側が更新できていればOK）
      try {
        await supabase.auth.updateUser({
          data: { display_name: nextName },
        });
      } catch (e) {
        console.warn("updateUser metadata failed:", e);
      }

      const resolvedDisplayName = normalizeDisplayName(json?.display_name || nextName);
      setDisplayName(resolvedDisplayName || nextName);
      setNameDraft(resolvedDisplayName || nextName);
      setNameEditOpen(false);
      setNameError("");
      Alert.alert("更新完了", "ユーザー名を更新しました。");
    } catch (e) {
      const friendlyMessage = mapDisplayNameConflictMessage(e) || String(e?.message || e);
      if (friendlyMessage === DISPLAY_NAME_TAKEN_MESSAGE) {
        setNameError(friendlyMessage);
      }
      console.warn("profile update error:", e);
      Alert.alert("更新に失敗しました", friendlyMessage);
    } finally {
      setNameSaving(false);
    }
  };

const refreshSubscriptionState = async () => {
  // 未ログインなら free 表示で固定
  if (!user) {
    setSubTier("free");
    setSubAllowedModes(["light"]);
    setSubError("");
    setSubLoading(false);
    return;
  }

  setSubLoading(true);
  setSubError("");
  try {
    const me = await fetchSubscriptionMe();
    const tier = normalizeSubscriptionTier(me?.subscription_tier);
    setSubTier(tier);
    setSubAllowedModes(
      Array.isArray(me?.allowed_myprofile_modes)
        ? me.allowed_myprofile_modes
        : TIER_ALLOWED_MYPROFILE_MODES[tier] || ["light"]
    );
    setSubError(me?._error ? String(me._error) : "");
  } catch (e) {
    setSubTier("free"); // fail-closed
    setSubAllowedModes(["light"]);
    setSubError(String(e?.message || e));
  } finally {
    setSubLoading(false);
  }
};

const onRestorePurchases = async () => {
  if (restoreLoading) return;

  if (!user) {
    Alert.alert("ログインが必要です", "購入の復元にはログインが必要です。");
    return;
  }

  setRestoreLoading(true);

  try {
    // 1) ストア側の「利用可能な購入」を取得
    const purchases = await restoreAvailablePurchases();

    if (!Array.isArray(purchases) || purchases.length === 0) {
      Alert.alert("購入履歴がありません", "復元できる購入が見つかりませんでした。");
      return;
    }

    // 2) Cocolonの SKU に合うものだけを選別（Premium優先）
    const plusSku = getPlanSku("plus");
    const premiumSku = getPlanSku("premium");

    const normalized = purchases.map((p) => ({
      purchase: p,
      productId: String(p?.productId || p?.product_id || "").trim(),
    }));

    const premiumPurchase =
      premiumSku &&
      normalized.find((x) => x.productId === premiumSku)?.purchase;

    const plusPurchase =
      plusSku && normalized.find((x) => x.productId === plusSku)?.purchase;

    const targetPurchase = premiumPurchase || plusPurchase || null;

    if (!targetPurchase) {
      Alert.alert(
        "購入履歴が見つかりません",
        "Cocolonのサブスクリプション購入が見つかりませんでした。"
      );
      return;
    }

    // 3) MashOSへ反映（/subscription/update）→ 成功したら finishTransaction も内部で実行
    await syncPurchaseToSubscriptionTier(targetPurchase);

    // 4) 反映確認（/subscription/me を再取得）
    await refreshSubscriptionState();

    Alert.alert("復元が完了しました", "プラン情報を更新しました。");
  } catch (e) {
    Alert.alert(
      "復元に失敗しました",
      String(e?.message || e || "復元に失敗しました。")
    );
  } finally {
    setRestoreLoading(false);
  }
};

  const VisibilitySettingRow = ({
    title,
    description,
    isPublic,
    onPressPublic,
    onPressPrivate,
    disabled,
  }) => {
    const publicActive = !!isPublic;
    const privateActive = !isPublic;

    return (
      <View style={styles.visibilityRow}>
        <View style={styles.visibilityLeft}>
          <Text style={styles.visibilityTitle}>{title}</Text>
          {description ? (
            <Text style={styles.visibilityDesc}>{description}</Text>
          ) : null}
        </View>

        <View style={styles.visibilityRight}>
          <TouchableOpacity
            style={[
              styles.visibilityChoiceBtn,
              publicActive && styles.visibilityChoiceBtnActive,
            ]}
            onPress={onPressPublic}
            activeOpacity={0.85}
            disabled={disabled || publicActive}
          >
            <Text
              style={[
                styles.visibilityChoiceText,
                publicActive && styles.visibilityChoiceTextActive,
              ]}
            >
              公開
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.visibilityChoiceBtn,
              privateActive && styles.visibilityChoiceBtnActive,
              { marginLeft: 8 },
            ]}
            onPress={onPressPrivate}
            activeOpacity={0.85}
            disabled={disabled || privateActive}
          >
            <Text
              style={[
                styles.visibilityChoiceText,
                privateActive && styles.visibilityChoiceTextActive,
              ]}
            >
              非公開
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />
      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ヘッダー */}
          <View style={styles.header}>
            <CocolonBackButton
              navigation={navigation}
              fallbackRouteName="Home"
              style={styles.backButton}
            />
            <Text style={styles.headerTitle}>Account</Text>
            <View style={{ width: 22 }} />
          </View>

          {/* 本体 */}

          {isSelf ? (
            <View
              style={[styles.profileActionRow, { justifyContent: "flex-end" }]}
            >
                            <CocolonPressable
                style={[
                  styles.accountSettingsBtn,
                  { marginRight: 10 },
                  (loading || !user) && styles.accountSettingsBtnDisabled,
                ]}
                onPress={onShareProfile}
                disabled={loading || !user}
                accessibilityLabel="共有"
              >
                <Ionicons
                  name="share-outline"
                  size={20}
                  color={colors.TEXT_ON_LIGHT}
                />
              </CocolonPressable>

<CocolonPressable
                style={[
                  styles.accountSettingsBtn,
                  (loading || !user) && styles.accountSettingsBtnDisabled,
                ]}
                onPress={openAccountSettings}
                disabled={loading || !user}
                accessibilityLabel="アカウント設定"
              >
                <Ionicons
                  name="settings-outline"
                  size={20}
                  color={colors.TEXT_ON_LIGHT}
                />
              </CocolonPressable>
            </View>
          ) : user ? (
            <TouchableOpacity
              style={[
                styles.followBtn,
                (isFollowing || isFollowRequested) && styles.followBtnFollowing,
                { marginTop: 0, marginBottom: 16 },
                (loading || followActionLoading) && styles.editNameBtnDisabled,
              ]}
              onPress={onToggleFollow}
              activeOpacity={0.85}
              disabled={loading || followActionLoading || isFollowRequested}
              accessibilityLabel={
                isFollowing ? "フォロー解除" : isFollowRequested ? "申請中" : "フォローする"
              }
            >
              {followActionLoading ? (
                <ActivityIndicator
                  size="small"
                  color={
                    isFollowing || isFollowRequested
                      ? colors.TEXT_ON_LIGHT
                      : "#FFFFFF"
                  }
                  style={{ marginRight: 6 }}
                />
              ) : (
                <Ionicons
                  name={
                    isFollowing
                      ? "checkmark"
                      : isFollowRequested
                      ? "time-outline"
                      : "person-add-outline"
                  }
                  size={18}
                  color={
                    isFollowing || isFollowRequested
                      ? colors.TEXT_ON_LIGHT
                      : "#FFFFFF"
                  }
                  style={{ marginRight: 6 }}
                />
              )}
              <Text
                style={[
                  styles.followBtnText,
                  !isFollowing && !isFollowRequested && styles.followBtnTextOnGold,
                ]}
              >
                {isFollowing ? "フォロー中" : isFollowRequested ? "申請中" : "フォローする"}
              </Text>
            </TouchableOpacity>
          ) : null}

          <View style={styles.infoSection}>
            <Text style={styles.statusTitle}>プロフィール</Text>

            <View style={styles.statusCard}>
              <ProfileRow
                styles={styles}
                label="ユーザー名"
                labelAction={
                  isSelf && user ? (
                    <Pressable
                      style={[
                        styles.labelIconBtn,
                        (loading || nameSaving) && styles.labelIconBtnDisabled,
                      ]}
                      onPress={openNameEdit}
                      disabled={loading || nameSaving}
                      accessibilityLabel="ユーザー名を編集"
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name="create-outline"
                        size={12}
                        color={colors.TEXT_ON_LIGHT}
                      />
                    </Pressable>
                  ) : null
                }
                value={
                  loading ? (
                    "…"
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        maxWidth: "100%",
                      }}
                    >
                      <Text
                        style={[styles.profileRowValue, { flexShrink: 1 }]}
                        numberOfLines={1}
                      >
                        {displayName || "（未設定）"}
                      </Text>
                      {isPrivateAccount ? (
                        <Ionicons
                          name="shield-outline"
                          size={14}
                          color={colors.TITLE_GOLD}
                          style={{ marginLeft: 6, opacity: 0.7 }}
                        />
                      ) : null}
                    </View>
                  )
                }
              />
              <ProfileRow
                styles={styles}
                label="フォロー数"
                value={followCountLoading ? "…" : String(followingCount)}
                onPress={() => openFollowList("following")}
                disabled={!targetUserId}
              />
              <ProfileRow
                styles={styles}
                label="フォロワー数"
                value={followCountLoading ? "…" : String(followerCount)}
                onPress={() => openFollowList("followers")}
                disabled={!targetUserId}
              />
              {canShowFriendCode ? (
                <ProfileRow
                  styles={styles}
                  label="共有コード"
                  labelAction={
                    user ? (
                      <Pressable
                        style={[
                          styles.labelIconBtn,
                          (loading || !String(friendCode || "").trim()) &&
                            styles.labelIconBtnDisabled,
                        ]}
                        onPress={onCopyFriendCode}
                        disabled={loading || !String(friendCode || "").trim()}
                        accessibilityLabel="共有コードをコピー"
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons
                          name="copy-outline"
                          size={12}
                          color={colors.TEXT_ON_LIGHT}
                        />
                      </Pressable>
                    ) : null
                  }
                  value={userIdForDisplay}
                />
              ) : null}

            </View>

            <Text
              style={{
                marginTop: 6,
                fontSize: ui?.font?.sectionLabel ?? 14,
                lineHeight: 19,
                color: ui?.text?.description ?? colors.TEXT_SUBTLE,
              }}
            >
              ※フォロー数とフォロワー数をタップすれば、一覧で表示されます。
            </Text>
          </View>

          <View style={styles.statusSection}>
            <Text style={styles.statusTitle}>ProfileCreate</Text>

            {profileCreateLoading ? (
              <ActivityIndicator style={{ marginTop: 6 }} />
            ) : (
              <View style={styles.statusCard}>
                {isSelf ? (
                  <View style={styles.profileCreateHeaderRow}>
                    <View style={{ flex: 1, paddingRight: 12 }}>
                      <Text style={styles.profileCreateSummaryText}>
                        回答済み：{profileCreateAnsweredCount}/{profileCreateTotal}
                      </Text>
                      <Text style={styles.profileCreateHintText}>
                        固定的な自己紹介 / プロフィール資産として使われます。
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.profileCreateEditBtn}
                      onPress={openProfileCreate}
                      activeOpacity={0.85}
                      disabled={loading}
                    >
                      <Ionicons
                        name="create-outline"
                        size={16}
                        color="#FFFFFF"
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.profileCreateEditBtnText}>編集する</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                {profileCreateVisibleItems.length > 0 ? (
                  profileCreateVisibleItems.map((item, index) => (
                    <View
                      key={String(item?.question_id || index)}
                      style={[
                        styles.profileCreateItem,
                        index === profileCreateVisibleItems.length - 1 && styles.profileCreateItemLast,
                      ]}
                    >
                      <Text style={styles.profileCreateQuestion}>{item?.question_text || ""}</Text>
                      <Text style={styles.profileCreateAnswer}>{item?.answer_text || ""}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.profileCreateEmptyText}>
                    {isSelf
                      ? "まだ回答はありません。『編集する』から入力できます。"
                      : "まだ公開されている回答はありません。"}
                  </Text>
                )}
              </View>
            )}

            {profileCreateError ? (
              <Text style={styles.statusErrorText}>取得エラー: {profileCreateError}</Text>
            ) : null}
          </View>

          {/* ステータス */}
          <View style={styles.statusSection}>
            <Text style={styles.statusTitle}>ステータス</Text>

            {statusLoading ? (
              <ActivityIndicator style={{ marginTop: 6 }} />
            ) : (
              <View style={styles.statusCard}>
                <StatusRow
                  styles={styles}
                  label="ログイン日数"
                  value={statusValue("login_days_total", ["loginDaysTotal"])}
                />
                <StatusRow
                  styles={styles}
                  label="連続ログイン日数"
                  value={statusValue("login_streak_max", ["loginStreakMax", "streak_max"])}
                />
                <StatusRow
                  styles={styles}
                  label="入力数"
                  value={statusValue("input_count_total", ["inputCountTotal"])}
                />
                <StatusRow
                  styles={styles}
                  label="入力文字数"
                  value={statusValue("input_chars_total", ["inputCharsTotal", "input_length_total", "inputLengthTotal"])}
                />
                <StatusRow
                  styles={styles}
                  label="Reflectionの所持数"
                  value={statusValue("mymodel_questions_total", ["mymodelQuestionsTotal", "mymodel_q_total"])}
                />
                <StatusRow
                  styles={styles}
                  label="Reflectionが共鳴された数"
                  value={statusValue("mymodel_resonances_total", ["mymodelResonancesTotal", "resonances_total"])}
                />
                <StatusRow
                  styles={styles}
                  label="Reflectionが発見された数"
                  value={statusValue("mymodel_discoveries_total", ["mymodelDiscoveriesTotal", "discoveries_total"])}
                />
              </View>
            )}

            {statusError ? (
              <Text style={styles.statusErrorText}>取得エラー: {statusError}</Text>
            ) : null}
          </View>


        </ScrollView>
      </View>


      {/* ユーザー名編集モーダル（ユーザー名行のペンマーク） */}
      {isSelf ? (
        <Modal
          visible={nameEditOpen}
          transparent
          animationType="fade"
          onRequestClose={closeNameEdit}
        >
          <Pressable style={styles.modalBackdrop} onPress={closeNameEdit} />

          <View style={styles.nameModalCard}>
            <View style={styles.nameModalHeader}>
              <Text style={styles.nameModalTitle}>ユーザー名の編集</Text>
              <TouchableOpacity
                style={styles.nameModalCloseBtn}
                onPress={closeNameEdit}
                disabled={nameSaving || nameChecking}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={20} color={colors.TEXT_ON_LIGHT} />
              </TouchableOpacity>
            </View>

            <Text style={styles.nameModalHint}>新しいユーザー名を入力してください。</Text>

            <TextInput
              style={styles.nameInput}
              placeholder="ユーザー名"
              placeholderTextColor={colors.TEXT_SUBTLE}
              value={nameDraft}
              onChangeText={(value) => {
                setNameDraft(value);
                if (nameError) setNameError("");
              }}
              editable={!nameSaving && !nameChecking}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={DISPLAY_NAME_MAX_LENGTH}
              returnKeyType="done"
              onSubmitEditing={saveDisplayName}
            />

            {nameError ? (
              <Text style={styles.nameErrorText}>{nameError}</Text>
            ) : nameChecking ? (
              <Text style={styles.nameHelperText}>ユーザー名の重複を確認しています…</Text>
            ) : (
              <Text style={styles.nameHelperText}>※ユーザー名は他ユーザーに公開されます。（{DISPLAY_NAME_MAX_LENGTH}文字まで）</Text>
            )}

            <View style={styles.nameModalActions}>
              <TouchableOpacity
                style={[styles.nameModalBtn, styles.nameModalBtnGhost]}
                onPress={closeNameEdit}
                disabled={nameSaving || nameChecking}
                activeOpacity={0.85}
              >
                <Text style={[styles.nameModalBtnText, styles.nameModalBtnGhostText]}>
                  キャンセル
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.nameModalBtn,
                  styles.nameModalBtnPrimary,
                  (nameSaving || nameChecking) && styles.nameModalBtnDisabled,
                ]}
                onPress={saveDisplayName}
                disabled={nameSaving || nameChecking}
                activeOpacity={0.85}
              >
                {nameSaving || nameChecking ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={[styles.nameModalBtnText, styles.nameModalBtnPrimaryText]}>
                    保存
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : null}

      {/* アカウント設定モーダル（歯車ボタン） */}
      {isSelf ? (
        <Modal
          visible={accountSettingsOpen}
          transparent
          animationType="fade"
          onRequestClose={closeAccountSettings}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={closeAccountSettings}
          />

          <View style={styles.settingsModalCard}>
            <View style={styles.settingsModalHeader}>
              <TouchableOpacity
                style={styles.nameModalCloseBtn}
                onPress={closeAccountSettings}
                disabled={visibilitySaving}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={20} color={colors.TEXT_ON_LIGHT} />
              </TouchableOpacity>

              <View style={{ flex: 1, marginLeft: 10, alignItems: "center" }}>
                <Text style={styles.settingsModalTitle}>アカウントの設定</Text>
              </View>

              {visibilitySaving ? (
                <ActivityIndicator
                  size="small"
                  color={colors.TITLE_GOLD}
                  style={styles.modalHeaderSpinner}
                />
              ) : null}
            </View>

            {visibilityLoading ? (
              <ActivityIndicator style={{ marginTop: 14 }} />
            ) : (
              <View style={{ marginTop: 10 }}>
                <VisibilitySettingRow
                  title="MyModelの公開設定"
                  description="非公開にすると、フォロー時に承認が必要になります。おすすめにも表示されなくなります"
                  isPublic={!accountVisibility.is_private_account}
                  onPressPublic={() =>
                    patchAccountVisibilityMe({
                      is_private_account: false,
                      is_recommendation_enabled: true,
                    })
                  }
                  onPressPrivate={() =>
                    patchAccountVisibilityMe({
                      is_private_account: true,
                      is_recommendation_enabled: false,
                    })
                  }
                  disabled={visibilitySaving}
                />
                <VisibilitySettingRow
                  title="ランキング表示設定"
                  isPublic={!!accountVisibility.is_ranking_visible}
                  onPressPublic={() =>
                    patchAccountVisibilityMe({ is_ranking_visible: true })
                  }
                  onPressPrivate={() =>
                    patchAccountVisibilityMe({ is_ranking_visible: false })
                  }
                  disabled={visibilitySaving}
                />

                <VisibilitySettingRow
                  title="共有コード表示設定"
                  isPublic={!!accountVisibility.is_friend_code_public}
                  onPressPublic={() =>
                    patchAccountVisibilityMe({ is_friend_code_public: true })
                  }
                  onPressPrivate={() =>
                    patchAccountVisibilityMe({ is_friend_code_public: false })
                  }
                  disabled={visibilitySaving}
                />
              </View>
            )}
          </View>
        </Modal>
      ) : null}
    </SafeAreaView>
  );
}


function ProfileRow({ styles, label, labelAction, value, onPress, disabled }) {
  const valueNode =
    typeof value === "string" || typeof value === "number" ? (
      <Text style={styles.profileRowValue}>{String(value)}</Text>
    ) : (
      value
    );

  const inner = (
    <>
      <View style={styles.kvRowTop}>
        <Text style={styles.statusRowLabel}>{label}</Text>
        {labelAction ? labelAction : null}
      </View>
      <View style={styles.kvRowBottom}>
        <View style={{ flex: 1 }} />
        {valueNode}
      </View>
    </>
  );

  if (typeof onPress === "function") {
    return (
      <TouchableOpacity
        style={styles.statusRow}
        activeOpacity={0.7}
        onPress={onPress}
        disabled={!!disabled}
      >
        {inner}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.statusRow}>
      {inner}
    </View>
  );
}

function StatusRow({ styles, label, value }) {
  return (
    <View style={styles.statusRow}>
      <View style={styles.kvRowTop}>
        <Text style={styles.statusRowLabel}>{label}</Text>
      </View>
      <View style={styles.kvRowBottom}>
        <View style={{ flex: 1 }} />
        <Text style={styles.statusRowValue}>{value}</Text>
      </View>
    </View>
  );
}

function createStyles(COLORS, ui) {
  return StyleSheet.create(applyTypographyTokens({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.PANEL_BG,
    },
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    scrollContent: {
      paddingBottom: 24,
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
    card: {
      backgroundColor: COLORS.PANEL_BG,
      borderRadius: 24,
      borderWidth: 2,
      borderColor: COLORS.BORDER_GOLD,
      paddingHorizontal: 18,
      paddingVertical: 20,
      minHeight: PANEL_MIN_HEIGHT,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 8,
    },

    infoSection: {
      marginTop: 8,
    },

    statusSection: {
      marginTop: 18,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: COLORS.CARD_BORDER,
    },
    statusTitle: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 10,
      letterSpacing: 0.3,
    },
    statusCard: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    statusRow: {
      flexDirection: "column",
      alignItems: "stretch",
      justifyContent: "flex-start",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
    },
    kvRowTop: {
      flexDirection: "row",
      alignItems: "center",
    },
    kvRowBottom: {
      marginTop: 8,
      flexDirection: "row",
      alignItems: "center",
    },
    statusRowLabel: {
      fontSize: 12,
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
    },
    labelIconBtn: {
      marginLeft: 6,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 8,
    },
    labelIconBtnDisabled: {
      opacity: 0.5,
    },
    statusRowValue: {
      fontSize: 13,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      flexShrink: 0,
      textAlign: "right",
    },

    profileRowValue: {
      fontSize: 13,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      flexShrink: 0,
      textAlign: "right",
    },
    statusErrorText: {
      marginTop: 8,
      fontSize: 10,
      color: COLORS.TEXT_ON_LIGHT,
      opacity: 0.8,
    },
    profileCreateHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 10,
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
    },
    profileCreateSummaryText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
    },
    profileCreateHintText: {
      marginTop: 4,
      fontSize: 11,
      lineHeight: 16,
      color: COLORS.TEXT_ON_LIGHT,
      opacity: 0.85,
    },
    profileCreateEditBtn: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
    },
    profileCreateEditBtnText: {
      fontSize: 12,
      fontWeight: "800",
      color: "#FFFFFF",
    },
    profileCreateItem: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
    },
    profileCreateItemLast: {
      borderBottomWidth: 0,
      paddingBottom: 0,
    },
    profileCreateQuestion: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 6,
    },
    profileCreateAnswer: {
      fontSize: 13,
      lineHeight: 20,
      color: COLORS.TITLE_GOLD,
    },
    profileCreateEmptyText: {
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
      opacity: 0.9,
    },
    label: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    value: {
      marginTop: 2,
      fontSize: 25,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    valueRight: {
      marginTop: 2,
      fontSize: 25,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      alignSelf: "flex-end",
      textAlign: "right",
    },

    infoBlockValueRow: {
      alignSelf: "flex-end",
      marginTop: 2,
    },

    profileText: {
      marginTop: 4,
      fontSize: 13,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
    },
    // ---- Follow / Follower ----
    followBtn: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      marginTop: 8,
    },
    followBtnFollowing: {
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    followBtnText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    followBtnTextOnGold: {
      color: "#FFFFFF",
    },
    followStatsRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
    },
    followStatItem: {
      flexDirection: "row",
      alignItems: "baseline",
    },
    followStatNumber: {
      fontSize: 14,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      marginRight: 4,
    },
    followStatLabel: {
      fontSize: 12,
      color: COLORS.TEXT_ON_LIGHT,
    },
    followCountBlock: {
      marginTop: 12,
    },
    followCountValue: {
      marginTop: 2,
      fontSize: 14,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      alignSelf: "flex-end",
      textAlign: "right",
    },


    // ---- DisplayName edit ----
    editNameBtn: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      marginTop: 8,
    },
    editNameBtnDisabled: {
      opacity: 0.5,
    },
    editNameBtnText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },

    profileActionRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginTop: 0,
      marginBottom: 16,
    },

    accountSettingsBtn: {
      width: 42,
      height: 38,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
    },
    accountSettingsBtnDisabled: {
      opacity: 0.5,
    },

    // ---- Modal (display name edit) ----
    modalBackdrop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.25)",
    },
    nameModalCard: {
      position: "absolute",
      left: 20,
      right: 20,
      top: 140,
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 16,
      padding: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 12 },
      elevation: 12,
    },

    // ---- Account settings modal ----
    settingsModalCard: {
      position: "absolute",
      left: 20,
      right: 20,
      top: 120,
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 16,
      padding: 12,
      paddingBottom: 64,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 12 },
      elevation: 12,
    },
    settingsModalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
    },
    settingsTabRow: {
      flex: 1,
      flexDirection: "row",
      backgroundColor: COLORS.PANEL_BG,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      overflow: "hidden",
      marginLeft: 10,
    },
    modalHeaderSpinner: {
      position: "absolute",
      right: 12,
      top: 6,
    },
    settingsTabBtn: {
      flex: 1,
      paddingVertical: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    settingsTabBtnActive: {
      backgroundColor: COLORS.GOLD_BUTTON,
    },
    settingsTabText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    settingsTabTextActive: {
      color: COLORS.ACCENT_TEXT,
    },

    settingsModalTitle: {
      fontSize: 14,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    visibilityRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
    },
    visibilityLeft: {
      flex: 1,
      paddingRight: 12,
    },
    visibilityTitle: {
      fontSize: 13,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    visibilityDesc: {
      marginTop: 4,
      fontSize: 9,
      lineHeight: 15,
      color: COLORS.TEXT_ON_LIGHT,
    },
    visibilityRight: {
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
    },
    visibilityChoiceBtn: {
      minWidth: 70,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      alignItems: "center",
      justifyContent: "center",
    },
    visibilityChoiceBtnActive: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    visibilityChoiceText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    visibilityChoiceTextActive: {
      color: COLORS.ACCENT_TEXT,
    },

    // ---- Profile edit modal ----
    profileModalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
      marginBottom: 10,
    },
    profileSaveBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: COLORS.GOLD_BUTTON,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      alignItems: "center",
      justifyContent: "center",
      minWidth: 64,
    },
    profileSaveBtnBottom: {
      position: "absolute",
      right: 12,
      bottom: 12,
    },
    profileSaveBtnDisabled: {
      opacity: 0.6,
    },
    profileSaveBtnText: {
      fontSize: 12,
      fontWeight: "800",
      color: "#FFFFFF",
    },
    profileCoverPlaceholder: {
      height: 120,
      borderRadius: 12,
      backgroundColor: COLORS.PANEL_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    profileCoverImage: {
      width: "100%",
      height: "100%",
      borderRadius: 12,
    },
    profileFieldLabel: {
      marginTop: 12,
      fontSize: 12,
      color: COLORS.TEXT_ON_LIGHT,
    },
    profileBioInput: {
      height: 96,
      paddingTop: 10,
    },

    nameModalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
      marginBottom: 10,
    },
    nameModalTitle: {
      fontSize: 14,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    nameModalCloseBtn: {
      paddingHorizontal: 6,
      paddingVertical: 4,
      borderRadius: 10,
    },
    nameModalHint: {
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 10,
    },
    nameInput: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 10,
      paddingVertical: 10,
      fontSize: 14,
      color: COLORS.TEXT_ON_LIGHT,
    },
    nameHelperText: {
      marginTop: 8,
      fontSize: 11,
      lineHeight: 16,
      color: COLORS.TEXT_SUBTLE,
    },
    nameErrorText: {
      marginTop: 8,
      fontSize: 11,
      lineHeight: 16,
      color: "#B91C1C",
    },
    nameModalActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 12,
    },
    nameModalBtn: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      alignItems: "center",
      justifyContent: "center",
      minWidth: 90,
    },
    nameModalBtnGhost: {
      marginRight: 8,
    },
    nameModalBtnPrimary: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    nameModalBtnDisabled: {
      opacity: 0.6,
    },
    nameModalBtnText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    nameModalBtnGhostText: {
      color: COLORS.TEXT_ON_LIGHT,
    },
    nameModalBtnPrimaryText: {
      color: "#FFFFFF",
    },

    valueMono: {
      marginTop: 2,
      fontSize: 11,
      color: COLORS.TEXT_ON_LIGHT,
    },
    valueMonoRight: {
      marginTop: 2,
      fontSize: 11,
      color: COLORS.TITLE_GOLD,
      alignSelf: "flex-end",
      textAlign: "right",
    },


    // ---- Subscription ----
    subscriptionSection: {
      marginTop: 22,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: COLORS.CARD_BORDER,
    },
    subRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    subBadge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    subBadgeText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    subNote: {
      fontSize: 12,
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 8,
    },
    subErrorText: {
      fontSize: 10,
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 10,
    },

restoreBtn: {
  alignSelf: "flex-start",
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 999,
  backgroundColor: COLORS.PANEL_BG,
  borderWidth: 1,
  borderColor: COLORS.CARD_BORDER,
  marginBottom: 10,
},
restoreBtnText: {
  fontSize: 13,
  fontWeight: "800",
  color: COLORS.TEXT_ON_LIGHT,
},

    subCta: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: COLORS.GOLD_BUTTON,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    subCtaText: {
      fontSize: 13,
      fontWeight: "800",
      color: COLORS.ACCENT_TEXT,
    },
  }, ui));
}
