import React, { useState } from "react";
import { Alert, View } from "react-native";

import { useAuth } from "../AuthContext";
import { useTutorial } from "../TutorialContext";
import { useUnread } from "../UnreadContext";
import { apiPost } from "../lib/apiClient";
import { clearDeletedAccountLocalState } from "../lib/accountLocalCleanup";
import {
  MyWebDescription,
  MyWebMediumCard,
  MyWebMenuScroll,
  MyWebSubHeader,
} from "./MyWebMenuCommon";

export default function SettingsOtherScreen({ navigation }) {
  const { signOut, authLoading, user } = useAuth();
  const { startTutorial } = useTutorial();
  const { setUnread } = useUnread();
  const [localProcessing, setLocalProcessing] = useState(false);
  const isBusy = authLoading || localProcessing;

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
              setUnread("Friends", "tutorial", false);
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

  const handleDeleteAccount = () => {
    if (isBusy) return;

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
          text: "OK",
          style: "destructive",
          onPress: async () => {
            setLocalProcessing(true);
            try {
              await apiPost("/account/delete", {});
              await clearDeletedAccountLocalState(user.id);
              await signOut({ skipPushTokenClear: true, rethrow: true });
            } catch (error) {
              console.error("SettingsOtherScreen: delete account failed", error);
              Alert.alert(
                "アカウント削除に失敗しました",
                String(error?.message || error)
              );
            } finally {
              setLocalProcessing(false);
            }
          },
        },
      ]
    );
  };

  return (
    <MyWebMenuScroll>
      <MyWebSubHeader title="その他" onBack={() => navigation.goBack()} />
      <MyWebDescription>
        実行したい内容を選んでください。
      </MyWebDescription>

      <MyWebMediumCard
        title="チュートリアルを再体験する"
        description="本番データを変えずに最初から体験します"
        onPress={openTutorialRestart}
        accessibilityLabel="チュートリアルを再体験する"
      />

      <View style={{ marginTop: 12 }}>
        <MyWebMediumCard
          title="ログアウト"
          description="現在のアカウントからログアウトします"
          onPress={handleLogout}
          accessibilityLabel="ログアウト"
        />
      </View>

      <View style={{ marginTop: 12 }}>
        <MyWebMediumCard
          title="アカウント削除"
          description="アカウント情報と全入力を削除します"
          onPress={handleDeleteAccount}
          accessibilityLabel="アカウント削除"
        />
      </View>
    </MyWebMenuScroll>
  );
}
