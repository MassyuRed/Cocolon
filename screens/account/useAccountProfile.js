import { useEffect, useState } from "react";
import { Alert, Share } from "react-native";

import { supabase } from "../../lib/supabase";
import { apiGet, apiPatch } from "../../lib/apiClient";
import {
  readConnectCode,
  readShareCode,
} from "../../lib/compat/legacyWireContracts";
import {
  DISPLAY_NAME_MAX_LENGTH,
  DISPLAY_NAME_TAKEN_MESSAGE,
  mapDisplayNameConflictMessage,
  normalizeDisplayName,
} from "./accountModel";

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

export function useAccountProfile({ user, targetUserId, isSelf }) {
  const [displayName, setDisplayName] = useState("");
  const [shareCode, setShareCode] = useState("");
  const [connectCode, setConnectCode] = useState("");
  const [loading, setLoading] = useState(true);

  const [nameDraft, setNameDraft] = useState("");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameChecking, setNameChecking] = useState(false);
  const [nameError, setNameError] = useState("");
  const [nameEditOpen, setNameEditOpen] = useState(false);

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
          setShareCode(String(readShareCode(json, "") || ""));
          setConnectCode(String(readConnectCode(json, "") || ""));
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

  const closeNameEdit = () => {
    if (nameSaving || nameChecking) return;
    setNameEditOpen(false);
    setNameError("");
  };

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
      const displayNameMessage = mapDisplayNameConflictMessage(e) || String(e?.message || e);
      if (displayNameMessage === DISPLAY_NAME_TAKEN_MESSAGE) {
        setNameError(displayNameMessage);
      }
      console.warn("profile update error:", e);
      Alert.alert("更新に失敗しました", displayNameMessage);
    } finally {
      setNameSaving(false);
    }
  };

  const onCopyShareCode = async () => {
    const code = String(shareCode || "").trim();
    if (!code) {
      Alert.alert("準備中", "ユーザーIDがまだ取得できていません。");
      return;
    }
    try {
      await Share.share({ message: code });
    } catch (e) {
      console.warn("copy share code failed:", e);
    }
  };

  const onShareProfile = async () => {
    const code = String(shareCode || "").trim();
    if (!code) {
      Alert.alert("準備中", "ユーザーIDがまだ取得できていません。");
      return;
    }
    const url = `https://emlis.app/u/${code}`;
    try {
      await Share.share({ message: url });
    } catch (e) {
      console.warn("share failed:", e);
    }
  };

  return {
    displayName,
    shareCode,
    connectCode,
    loading,
    nameDraft,
    setNameDraft,
    nameSaving,
    nameChecking,
    nameError,
    setNameError,
    nameEditOpen,
    openNameEdit,
    closeNameEdit,
    saveDisplayName,
    onCopyShareCode,
    onShareProfile,
  };
}
