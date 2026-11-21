import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

import { useAuth } from "../../AuthContext";
import { apiFetch } from "../../lib/apiClient";
import {
  ACCOUNT_WIRE,
  readShareCodePublic,
} from "../../lib/compat/legacyWireContracts";

const DEFAULT_ACCOUNT_VISIBILITY = {
  is_share_code_public: true,
  is_recommendation_enabled: true,
  is_ranking_visible: true,
  is_private_account: false,
};

export function useAccountVisibility({ navigation, user, isSelf }) {
  const { authOwnerGeneration } = useAuth();
  const ownerRequestRef = useRef(null);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [visibilitySaving, setVisibilitySaving] = useState(false);
  const [accountVisibility, setAccountVisibility] = useState(DEFAULT_ACCOUNT_VISIBILITY);

  useEffect(() => {
    const controller = new AbortController();
    ownerRequestRef.current = { expectedUserId: user?.id, signal: controller.signal };
    setAccountSettingsOpen(false);
    setVisibilityLoading(false);
    setVisibilitySaving(false);
    setAccountVisibility(DEFAULT_ACCOUNT_VISIBILITY);
    return () => controller.abort();
  }, [user?.id, isSelf, authOwnerGeneration]);

  const loadAccountVisibilityMe = async () => {
    if (!user || !isSelf) return;
    const request = ownerRequestRef.current;
    if (request?.expectedUserId !== user.id || request.signal.aborted) return;

    setVisibilityLoading(true);
    try {
      const res = await apiFetch(ACCOUNT_WIRE.routes.visibilityMe, {
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
      if (json && typeof json === "object") {
        setAccountVisibility((prev) => ({
          ...prev,
          is_share_code_public: readShareCodePublic(json, false),
          is_recommendation_enabled: !!json.is_recommendation_enabled,
          is_ranking_visible: !!json.is_ranking_visible,
          is_private_account: !!json.is_private_account,
        }));
      }
    } catch (e) {
      if (request.signal.aborted || e?.name === "AccountChangedError") return;
      console.warn("loadAccountVisibilityMe error:", e);
      Alert.alert("取得に失敗しました", String(e?.message || e));
    } finally {
      if (!request.signal.aborted) setVisibilityLoading(false);
    }
  };

  const patchAccountVisibilityMe = async (patch) => {
    if (!user || !isSelf) return;
    const request = ownerRequestRef.current;
    if (request?.expectedUserId !== user.id || request.signal.aborted) return;
    if (visibilitySaving) return;

    const body = patch && typeof patch === "object" ? patch : null;
    if (!body || Object.keys(body).length === 0) return;

    setVisibilitySaving(true);
    try {
      const res = await apiFetch(ACCOUNT_WIRE.routes.visibilityMe, {
        ...request,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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
      if (request.signal.aborted) return;
      if (json && typeof json === "object") {
        setAccountVisibility((prev) => ({
          ...prev,
          is_share_code_public:
            typeof readShareCodePublic(json, undefined) === "boolean"
              ? readShareCodePublic(json, prev.is_share_code_public)
              : prev.is_share_code_public,
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
      if (request.signal.aborted || e?.name === "AccountChangedError") return;
      console.warn("patchAccountVisibilityMe error:", e);
      Alert.alert("更新に失敗しました", String(e?.message || e));
    } finally {
      if (!request.signal.aborted) setVisibilitySaving(false);
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

  useEffect(() => {
    if (!accountSettingsOpen) return;
    loadAccountVisibilityMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountSettingsOpen]);

  useEffect(() => {
    if (!user || !isSelf) return;
    const request = ownerRequestRef.current;
    if (request?.expectedUserId !== user.id || request.signal.aborted) return;
    loadAccountVisibilityMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isSelf, authOwnerGeneration]);

  useEffect(() => {
    if (!navigation?.addListener) return undefined;

    const unsubscribe = navigation.addListener("focus", () => {
      loadAccountVisibilityMe();
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, user, isSelf]);

  return {
    accountSettingsOpen,
    accountVisibility,
    visibilityLoading,
    visibilitySaving,
    loadAccountVisibilityMe,
    patchAccountVisibilityMe,
    openAccountSettings,
    closeAccountSettings,
  };
}
