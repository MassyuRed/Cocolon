import { useState } from "react";

import { apiGet } from "../../lib/apiClient";
import { buildPublicProfileByShareCodePath } from "../../lib/compat/legacyWireContracts";
import { normalizeDisplayName } from "./accountModel";

export function useAccountIdSearch({ navigation, user }) {
  const [idSearchQuery, setIdSearchQuery] = useState("");
  const [idSearchLoading, setIdSearchLoading] = useState(false);
  const [idSearchResult, setIdSearchResult] = useState(null);
  const [idSearchError, setIdSearchError] = useState("");

  const onChangeIdSearchQuery = (value) => {
    setIdSearchQuery(value);
    if (idSearchResult) setIdSearchResult(null);
    if (idSearchError) setIdSearchError("");
  };

  const navigateToAccount = (nextUserId) => {
    const normalizedUserId = String(nextUserId || "").trim();
    if (!normalizedUserId || !navigation?.navigate) return;

    navigation.navigate("Account", {
      viewedUserId: normalizedUserId,
      userId: normalizedUserId,
      user_id: normalizedUserId,
    });
  };

  const searchUserById = async () => {
    if (idSearchLoading) return;

    const code = String(idSearchQuery || "").trim();
    if (!code) {
      setIdSearchResult(null);
      setIdSearchError("ユーザーIDを入力してください。");
      return;
    }

    setIdSearchLoading(true);
    setIdSearchResult(null);
    setIdSearchError("");

    try {
      const json = await apiGet(buildPublicProfileByShareCodePath(code), { auth: false });
      const resolvedUserId = String(
        json?.user_id || json?.target_user_id || json?.id || ""
      ).trim();

      if (!resolvedUserId) {
        throw new Error("user_id not found");
      }

      let resolvedDisplayName = normalizeDisplayName(json?.display_name || "");

      if (user) {
        try {
          const profileJson = await apiGet(
            `/account/profile?target_user_id=${encodeURIComponent(resolvedUserId)}`
          );
          resolvedDisplayName =
            normalizeDisplayName(profileJson?.display_name || resolvedDisplayName) ||
            resolvedDisplayName;
        } catch (profileError) {
          console.warn("AccountScreen: ID search profile fetch failed", profileError);
        }
      }

      setIdSearchResult({
        userId: resolvedUserId,
        displayName: resolvedDisplayName || "（ユーザー名未設定）",
      });
    } catch (e) {
      console.warn("AccountScreen: ID search failed", e);
      setIdSearchResult(null);
      setIdSearchError("該当するユーザーが見つかりませんでした。");
    } finally {
      setIdSearchLoading(false);
    }
  };

  return {
    idSearchQuery,
    idSearchLoading,
    idSearchResult,
    idSearchError,
    onChangeIdSearchQuery,
    searchUserById,
    navigateToAccount,
  };
}
