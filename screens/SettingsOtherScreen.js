import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useAuth } from "../AuthContext";
import { useTutorial } from "../TutorialContext";
import { useUnread } from "../UnreadContext";
import { useAppRuntime } from "../AppRuntimeContext";
import { apiPost } from "../lib/apiClient";
import { clearDeletedAccountLocalState } from "../lib/accountLocalCleanup";
import CocolonPressable from "../components/CocolonPressable";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import {
  AnalysisMenuScroll,
  AnalysisSubHeader,
  useAnalysisMenuStyles,
} from "./AnalysisMenuCommon";

function createLocalStyles(colors, ui) {
  return StyleSheet.create(applyTypographyTokens({
    group: { gap: 3 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      minHeight: 56,
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: 10,
      backgroundColor: colors.PANEL_BG,
    },
    firstRow: { borderTopLeftRadius: 24, borderTopRightRadius: 24 },
    lastRow: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    icon: {
      width: 32,
      height: 32,
      flexShrink: 0,
      borderRadius: 11,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.SURFACE_TONAL,
    },
    content: { flex: 1, minWidth: 0, gap: 2 },
    label: { color: colors.TEXT_ON_LIGHT, flexShrink: 1 },
    description: { color: colors.TEXT_SUBTLE, flexShrink: 1 },
    helperText: { color: colors.TEXT_SUBTLE, marginTop: 12 },
    disabled: { opacity: 0.6 },
  }, ui, { label: "button", description: "description", helperText: "description" }));
}

function SettingActionRow({ title, description, icon, onPress, disabled, destructive, position }) {
  const { colors, ui } = useAnalysisMenuStyles();
  const localStyles = useMemo(() => createLocalStyles(colors, ui), [colors, ui]);
  const foreground = disabled ? colors.TEXT_SUBTLE : destructive ? colors.ERROR : colors.TEXT_ON_LIGHT;

  return (
    <CocolonPressable
      style={[localStyles.row, position === "first" && localStyles.firstRow, position === "last" && localStyles.lastRow, disabled && localStyles.disabled]}
      disabled={disabled}
      onPress={onPress}
      accessibilityLabel={title}
    >
      <View style={[localStyles.icon, destructive && { backgroundColor: colors.ERROR_BG }]} accessible={false} importantForAccessibility="no-hide-descendants">
        <Ionicons name={icon} size={18} color={destructive ? colors.ERROR : colors.ON_SURFACE_TONAL} />
      </View>
      <View style={localStyles.content}>
        <Text style={[localStyles.label, { color: foreground }]}>{title}</Text>
        {description ? <Text style={localStyles.description}>{description}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.TEXT_SUBTLE} />
    </CocolonPressable>
  );
}

export default function SettingsOtherScreen({ navigation, embedded = false }) {
  const { signOut, authLoading, user } = useAuth();
  const { startTutorial, setTutorialStep } = useTutorial();
  const { setUnread } = useUnread();
  const { isFeatureEnabled } = useAppRuntime();
  const [localProcessing, setLocalProcessing] = useState(false);
  const isBusy = authLoading || localProcessing;
  const accountDeleteEnabled = isFeatureEnabled("account_delete_enabled", true);
  const { colors, ui } = useAnalysisMenuStyles();
  const localStyles = useMemo(() => createLocalStyles(colors, ui), [colors, ui]);

  const openTutorialRestart = () => {
    if (isBusy) return;

    Alert.alert(
      "チュートリアル",
      "チュートリアルを最初から再体験しますか？\n\n現在の入力や記録はそのままです。",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "開始する",
          onPress: () => {
            try {
              const started = startTutorial();
              if (started === false) return;
              setTutorialStep(1);
            } catch {
              // noop
            }

            try {
              setUnread("EmotionLog", "tutorial", false);
            } catch {
              // noop
            }

            try {
              const parent =
                typeof navigation?.getParent === "function"
                  ? navigation.getParent()
                  : null;
              if (parent && typeof parent.navigate === "function") {
                parent.navigate("Input", { screen: "TutorialIntro" });
                return;
              }
            } catch {
              // noop
            }

            try {
              if (navigation?.navigate) {
                navigation.navigate("Input", { screen: "TutorialIntro" });
                return;
              }
            } catch {
              // noop
            }

            Alert.alert(
              "チュートリアル",
              "チュートリアルを開始状態にしました。"
            );
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    if (isBusy) return;

    Alert.alert("ログアウト", "ログアウトしますか？", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "ログアウト",
        style: "destructive",
        onPress: async () => {
          setLocalProcessing(true);
          try {
            await signOut();
          } finally {
            setLocalProcessing(false);
          }
        },
      },
    ]);
  };

  const executeDeleteAccount = async () => {
    if (!accountDeleteEnabled) {
      Alert.alert(
        "アカウント削除",
        "現在、アカウント削除機能は一時的に利用できません。時間をおいて、もう一度お試しください。"
      );
      return;
    }

    const userId = user?.id;
    if (!userId) {
      Alert.alert("アカウント削除", "ログイン情報が取得できませんでした。");
      return;
    }

    setLocalProcessing(true);
    try {
      await apiPost("/account/delete", {}, { expectedUserId: userId });
      await clearDeletedAccountLocalState(userId);
      await signOut({ skipPushTokenClear: true, rethrow: true, expectedUserId: userId });
    } catch (error) {
      console.error("SettingsOtherScreen: delete account failed", error);
      Alert.alert(
        "アカウント削除に失敗しました",
        "時間をおいて、もう一度お試しください。解決しない場合はサポートへお問い合わせください。"
      );
    } finally {
      setLocalProcessing(false);
    }
  };

  const openFinalDeleteAccountConfirm = () => {
    Alert.alert(
      "最終確認",
      "本当にアカウントを削除しますか？この操作は取り消せません。",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除する",
          style: "destructive",
          onPress: executeDeleteAccount,
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    if (isBusy) return;

    if (!accountDeleteEnabled) {
      Alert.alert(
        "アカウント削除",
        "現在、アカウント削除機能は一時的に利用できません。時間をおいて、もう一度お試しください。"
      );
      return;
    }

    if (!user?.id) {
      Alert.alert("アカウント削除", "ログイン情報が取得できませんでした。");
      return;
    }

    Alert.alert(
      "アカウント削除",
      "この操作を行うと、アカウント情報とこのアカウントに紐づくすべての入力・履歴・関連データが削除されます。削除後は元に戻せません。",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "次へ",
          style: "destructive",
          onPress: openFinalDeleteAccountConfirm,
        },
      ]
    );
  };

  const Container = embedded ? View : AnalysisMenuScroll;
  return (
    <Container>
      {!embedded ? <AnalysisSubHeader title="その他" onBack={() => navigation.goBack()} /> : null}

      <View style={localStyles.group}>
        <SettingActionRow
          title="チュートリアルを再体験する"
          description={embedded ? undefined : "入力や記録はそのままです"}
          icon="book-outline"
          disabled={isBusy}
          onPress={openTutorialRestart}
          position="first"
        />
        <SettingActionRow
          title="ログアウト"
          icon="log-out-outline"
          disabled={isBusy}
          onPress={handleLogout}
        />
        <SettingActionRow
          title="アカウント削除"
          icon="person-remove-outline"
          description={
            embedded && accountDeleteEnabled ? undefined : accountDeleteEnabled
              ? "アカウント情報と全入力を削除します"
              : "現在、この機能は一時的に利用できません"
          }
          disabled={isBusy}
          destructive
          onPress={handleDeleteAccount}
          position="last"
        />
      </View>
      {localProcessing ? <Text style={localStyles.helperText} accessibilityLiveRegion="polite">処理しています…</Text> : null}
    </Container>
  );
}
