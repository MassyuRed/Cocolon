import React, { useState } from "react";
import { Alert, View } from "react-native";

import { useAuth } from "../AuthContext";
import { useTutorial } from "../TutorialContext";
import { useUnread } from "../UnreadContext";
import { useAppRuntime } from "../AppRuntimeContext";
import { apiPost } from "../lib/apiClient";
import { clearDeletedAccountLocalState } from "../lib/accountLocalCleanup";
import {
  AnalysisDescription,
  AnalysisMediumCard,
  AnalysisMenuScroll,
  AnalysisSubHeader,
} from "./AnalysisMenuCommon";

export default function SettingsOtherScreen({ navigation }) {
  const { signOut, authLoading, user } = useAuth();
  const { startTutorial } = useTutorial();
  const { setUnread } = useUnread();
  const { isFeatureEnabled } = useAppRuntime();
  const [localProcessing, setLocalProcessing] = useState(false);
  const isBusy = authLoading || localProcessing;
  const accountDeleteEnabled = isFeatureEnabled("account_delete_enabled", true);

  const openTutorialRestart = () => {
    if (isBusy) return;

    Alert.alert(
      "チュートリアル",
      "チュートリアルを最初から再体験しますか？\n\n本番データは変更されません。",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "開始する",
          onPress: () => {
            try {
              startTutorial();
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
                parent.navigate("Input");
                return;
              }
            } catch {
              // noop
            }

            try {
              if (navigation?.navigate) {
                navigation.navigate("Input");
                return;
              }
            } catch {
              // noop
            }

            Alert.alert(
              "チュートリアル",
              "チュートリアルを開始状態にしました。Homeから体験を始めてください。"
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
      await apiPost("/account/delete", {});
      await clearDeletedAccountLocalState(userId);
      await signOut({ skipPushTokenClear: true, rethrow: true });
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

  return (
    <AnalysisMenuScroll>
      <AnalysisSubHeader title="その他" onBack={() => navigation.goBack()} />
      <AnalysisDescription>
        実行したい内容を選んでください。
      </AnalysisDescription>

      <AnalysisMediumCard
        title="チュートリアルを再体験する"
        description="本番データを変えずに最初から体験します"
        onPress={openTutorialRestart}
        accessibilityLabel="チュートリアルを再体験する"
      />

      <View style={{ marginTop: 12 }}>
        <AnalysisMediumCard
          title="ログアウト"
          description="現在のアカウントからログアウトします"
          onPress={handleLogout}
          accessibilityLabel="ログアウト"
        />
      </View>

      <View style={{ marginTop: 12 }}>
        <AnalysisMediumCard
          title="アカウント削除"
          description={
            accountDeleteEnabled
              ? "アカウント情報と全入力を削除します"
              : "現在、この機能は一時的に利用できません"
          }
          onPress={handleDeleteAccount}
          accessibilityLabel="アカウント削除"
        />
      </View>
    </AnalysisMenuScroll>
  );
}
