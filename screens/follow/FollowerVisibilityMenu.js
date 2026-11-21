import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import CocolonButton from "../../components/CocolonButton";
import CocolonSwitch from "../../components/CocolonSwitch";
import { apiGet, apiPatch } from "../../lib/apiClient";
import { FOLLOW_WIRE } from "../../lib/compat/legacyWireContracts";
import { MODAL_ORIENTATIONS } from "../../ui/uiTokens";

const sharingOptions = [
  { key: "can_view_pieces", label: "ピース投稿" },
  { key: "can_receive_emotion_notifications", label: "感情通知" },
];

function requireFollowerSettings(value, followerId) {
  if (value?.follower_user_id !== followerId || sharingOptions.some(({ key }) => typeof value[key] !== "boolean")) {
    throw new Error("Follower settings unavailable");
  }
  return value;
}

export default function FollowerVisibilityMenu({
  follower, ownerRequest, isOwnerCurrent, onClose, colors, ui,
}) {
  const [settings, setSettings] = useState(null);
  const [busy, setBusy] = useState("load");
  const [error, setError] = useState("");
  const activeRequest = useRef(null);
  const followerId = follower.id;

  const loadSettings = useCallback(async () => {
    if (activeRequest.current || !isOwnerCurrent(ownerRequest)) return;
    const request = {};
    activeRequest.current = request;
    setBusy("load");
    setError("");
    setSettings(null);

    try {
      const result = await apiGet(FOLLOW_WIRE.routes.followerContentVisibility, ownerRequest.options);
      if (activeRequest.current !== request || !isOwnerCurrent(ownerRequest)) return;
      const row = Array.isArray(result?.items) && result.items.find(item => item?.follower_user_id === followerId);
      setSettings(requireFollowerSettings(row, followerId));
    } catch {
      if (activeRequest.current === request && isOwnerCurrent(ownerRequest)) {
        setError("公開範囲を取得できませんでした。");
      }
    } finally {
      if (activeRequest.current === request) {
        activeRequest.current = null;
        if (isOwnerCurrent(ownerRequest)) setBusy(null);
      }
    }
  }, [followerId, ownerRequest, isOwnerCurrent]);

  useEffect(() => {
    void loadSettings();
    return () => { activeRequest.current = null; };
  }, [loadSettings]);

  const setSharing = async (key, enabled) => {
    if (typeof enabled !== "boolean" || !settings || settings[key] === enabled || activeRequest.current || !isOwnerCurrent(ownerRequest)) return;
    const request = {};
    activeRequest.current = request;
    setBusy("save");
    setError("");

    try {
      const result = await apiPatch(
        `${FOLLOW_WIRE.routes.followers}/${encodeURIComponent(followerId)}/content-visibility`,
        { [key]: enabled },
        ownerRequest.options
      );
      if (activeRequest.current !== request || !isOwnerCurrent(ownerRequest)) return;
      const confirmed = requireFollowerSettings(result, followerId);
      if (confirmed[key] !== enabled) throw new Error("Follower settings not confirmed");
      setSettings(confirmed);
    } catch {
      if (activeRequest.current === request && isOwnerCurrent(ownerRequest)) {
        setSettings(null);
        setError("変更結果を確認できませんでした。公開範囲を読み直してください。");
      }
    } finally {
      if (activeRequest.current === request) {
        activeRequest.current = null;
        if (isOwnerCurrent(ownerRequest)) setBusy(null);
      }
    }
  };

  const close = () => { if (busy !== "save") onClose(); };
  return (
    <Modal visible transparent animationType="fade" onRequestClose={close} supportedOrientations={MODAL_ORIENTATIONS}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.backdrop}>
          <View style={[styles.card, { backgroundColor: colors.FIELD_BG, borderColor: colors.CARD_BORDER }]} accessibilityViewIsModal>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text
                accessibilityRole="header"
                style={[styles.title, ui?.typography?.sectionTitle, { color: colors.TEXT_ON_LIGHT }]}
              >
                {follower.name}への公開範囲
              </Text>
              {settings ? sharingOptions.map(({ key, label }) => (
                <View key={key} style={styles.option}>
                  <View style={styles.optionText}>
                    <Text style={[ui?.typography?.body, { color: colors.TEXT_ON_LIGHT }]}>{label}</Text>
                    <Text style={[ui?.typography?.meta, { color: colors.TEXT_SUBTLE }]}>
                      {settings[key] ? "公開" : "非公開"}
                    </Text>
                  </View>
                  <CocolonSwitch
                    accessibilityLabel={label}
                    accessibilityHint="オンで公開、オフで非公開"
                    disabled={!!busy}
                    value={settings[key]}
                    onValueChange={enabled => void setSharing(key, enabled)}
                  />
                </View>
              )) : null}
              {busy ? <ActivityIndicator color={colors.TITLE_GOLD} accessibilityLabel={busy === "save" ? "公開範囲を保存中" : "公開範囲を確認中"} /> : null}
              {error ? (
                <>
                  <Text accessibilityRole="alert" style={[ui?.typography?.body, { color: colors.ERROR }]}>{error}</Text>
                  <CocolonButton variant="secondary" title="公開範囲を読み直す" onPress={loadSettings} />
                </>
              ) : null}
            </ScrollView>
            <CocolonButton variant="secondary" title="閉じる" disabled={busy === "save"} onPress={close} />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, justifyContent: "center", alignItems: "center",
    padding: 20, backgroundColor: "rgba(15, 23, 42, 0.38)",
  },
  card: {
    width: "100%", maxWidth: 480, maxHeight: "100%",
    padding: 20, borderRadius: 24, borderWidth: 1, gap: 12,
  },
  title: { marginBottom: 12 },
  option: {
    minHeight: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12,
  },
  optionText: { flex: 1, minWidth: 0 },
});
