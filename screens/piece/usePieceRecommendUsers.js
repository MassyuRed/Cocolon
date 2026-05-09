import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

import { apiFetch, API_BASE_URL } from "../../lib/apiClient";
import { PIECE_WIRE } from "../../lib/compat/legacyWireContracts";
import { getCurrentUserId } from "../../lib/user";
import { supabase } from "../../lib/supabase";

const PIECE_RECOMMEND_USERS_ENDPOINT = `${API_BASE_URL}${PIECE_WIRE.routes.recommendUsers}`;
const PREFETCH_MAX_AGE_MS = 2 * 60 * 1000;

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
  const candidates = ["Account", "AccountScreen"];
  const root = navigation?.getRootState?.();
  const local = navigation?.getState?.();

  for (const name of candidates) {
    if (hasRouteNameInState(root, name) || hasRouteNameInState(local, name)) {
      return name;
    }
  }
  return "Account";
}

async function getAuthContext() {
  let userId = null;
  let accessToken = null;
  try {
    userId = await getCurrentUserId();
  } catch (e) {
    console.warn("PieceScreen(Home): failed to resolve userId", e);
  }
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    accessToken = sessionData?.session?.access_token ?? null;
  } catch (e) {
    console.warn("PieceScreen(Home): failed to resolve auth session", e);
  }
  return { userId, accessToken };
}

export function usePieceRecommendUsers({
  navigation,
  isTutorialMode,
  getPrefetchEntry,
  getPrefetchEntryFresh,
  setPrefetch,
}) {
  const [recoModalVisible, setRecoModalVisible] = useState(false);
  const [recoUsersLoading, setRecoUsersLoading] = useState(false);
  const [recoUsersError, setRecoUsersError] = useState("");
  const [recoUsers, setRecoUsers] = useState([]);

  const resetRecommendState = useCallback(() => {
    setRecoModalVisible(false);
    setRecoUsersLoading(false);
    setRecoUsersError("");
  }, []);

  const loadRecommendUsers = useCallback(async (opts) => {
    const silent = !!opts?.silent;
    if (!silent) {
      setRecoUsersLoading(true);
    }
    setRecoUsersError("");

    try {
      const { userId, accessToken } = await getAuthContext();
      if (!accessToken) {
        setRecoUsers([]);
        setRecoUsersError("ログインが必要です");
        return;
      }

      const params = new URLSearchParams();
      params.append("limit", "20");
      const url = `${PIECE_RECOMMEND_USERS_ENDPOINT}?${params.toString()}`;

      const res = await apiFetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = json?.detail || json?.message || `HTTP ${res.status}`;
        throw new Error(String(msg));
      }

      const users =
        (Array.isArray(json?.users) && json.users) ||
        (Array.isArray(json?.items) && json.items) ||
        (Array.isArray(json?.rows) && json.rows) ||
        [];

      setRecoUsers(users);

      try {
        setPrefetch("Piece", "recoUsers", { userId: userId || null, items: users });
      } catch {
        // noop
      }
    } catch (e) {
      setRecoUsers([]);
      setRecoUsersError(String(e?.message || e));
    } finally {
      setRecoUsersLoading(false);
    }
  }, [setPrefetch]);

  const openAccount = useCallback(
    (targetUserId) => {
      const tid = targetUserId ? String(targetUserId) : "";
      if (!tid || !navigation?.navigate) return;

      setRecoModalVisible(false);

      const routeName = resolveAccountRouteName(navigation);
      try {
        navigation.navigate(routeName, { viewedUserId: tid, targetUserId: tid });
      } catch {
        try {
          navigation.navigate("Account", { viewedUserId: tid, targetUserId: tid });
        } catch {
          // ignore
        }
      }
    },
    [navigation]
  );

  const showTutorialRecommendInfo = useCallback(() => {
    Alert.alert(
      "おすすめ（チュートリアル）",
      "新しいユーザーや問いを探せます。\n\nこの後は、フォロー中ユーザーのピースも確認できます。"
    );
  }, []);

  useEffect(() => {
    if (isTutorialMode) {
      setRecoUsers([]);
      setRecoUsersError("");
      setRecoUsersLoading(false);
      return;
    }

    try {
      const entry = getPrefetchEntryFresh
        ? getPrefetchEntryFresh("Piece", "recoUsers", PREFETCH_MAX_AGE_MS)
        : getPrefetchEntry?.("Piece", "recoUsers");
      const cached = entry?.value;
      const items = Array.isArray(cached?.items) ? cached.items : null;
      if (items) {
        setRecoUsers(items);
        setRecoUsersError("");
        setRecoUsersLoading(false);
      }
    } catch {
      // noop
    }

    const hasCache = (() => {
      try {
        const entry = getPrefetchEntryFresh
          ? getPrefetchEntryFresh("Piece", "recoUsers", PREFETCH_MAX_AGE_MS)
          : getPrefetchEntry?.("Piece", "recoUsers");
        return Array.isArray(entry?.value?.items);
      } catch {
        return false;
      }
    })();

    loadRecommendUsers({ silent: hasCache });
  }, [getPrefetchEntry, getPrefetchEntryFresh, isTutorialMode, loadRecommendUsers]);

  return {
    recoModalVisible,
    setRecoModalVisible,
    recoUsersLoading,
    recoUsersError,
    recoUsers,
    loadRecommendUsers,
    openAccount,
    showTutorialRecommendInfo,
    resetRecommendState,
  };
}

export default usePieceRecommendUsers;
