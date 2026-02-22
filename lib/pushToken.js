// lib/pushToken.js
//
// Push Token（端末トークン）を取得して Supabase profiles に保存する
//
// 目的:
//  - iOS/Android で通知許可 → Token取得 → Supabase同期 を「確実に通す」
//  - iOS は registerDeviceForRemoteMessages() が済んでいないと getToken() が失敗することがあるため
//    そこを吸収する（firebase.json で auto register をOFFにしている場合など）
//
// NOTE:
//  - Android 13+ は POST_NOTIFICATIONS のランタイム許可が必要
//  - FCM トークンは「回転」する可能性があるため、起動/ログイン時の再同期 + onTokenRefresh 追従が前提
//
// 使い方（既存のまま）:
//   syncPushTokenOnce({ userId })
//   startPushTokenSync({ userId })

import { PermissionsAndroid, Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { supabase } from "./supabase";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ensureNotificationPermission() {
  // iOS: 許可 + Remote Messages 登録（APNs）を済ませてから token 取得できるようにする
  if (Platform.OS === "ios") {
    try {
      // auto-init を明示 ON（存在しない環境もあるので best-effort）
      try {
        await messaging().setAutoInitEnabled(true);
      } catch {
        // noop
      }

      // ここが重要: iOS は remote messages 登録が済んでないと getToken が落ちがち
      try {
        await messaging().registerDeviceForRemoteMessages();
      } catch (e) {
        // ここで落ちても requestPermission で進めるので best-effort
        console.log("[push] registerDeviceForRemoteMessages failed:", e?.message || e);
      }

      const authStatus = await messaging().requestPermission();
      const AUTH = messaging.AuthorizationStatus?.AUTHORIZED;
      const PROV = messaging.AuthorizationStatus?.PROVISIONAL;

      // AuthorizationStatus が取れない環境は truthy 判定
      if (AUTH == null && PROV == null) return Boolean(authStatus);

      return authStatus === AUTH || authStatus === PROV;
    } catch (e) {
      console.log("[push] requestPermission failed:", e?.message || e);
      return false;
    }
  }

  // Android: API 33+ はランタイム許可
  if (Platform.OS === "android") {
    try {
      const apiLevel = Number(Platform.Version) || 0;
      if (apiLevel >= 33) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        return result === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } catch (e) {
      console.log("[push] POST_NOTIFICATIONS request failed:", e?.message || e);
      return false;
    }
  }

  return false;
}

async function getFcmTokenWithRetry({ attempts = 6 } = {}) {
  let lastErr = null;

  for (let i = 1; i <= attempts; i++) {
    try {
      // iOS: 念のため remote messages 登録を毎回 best-effort（初回だけ失敗するケースがある）
      if (Platform.OS === "ios") {
        try {
          await messaging().registerDeviceForRemoteMessages();
        } catch {
          // noop
        }
      }

      const token = await messaging().getToken();
      const t = String(token || "").trim();
      if (t) return t;
    } catch (e) {
      lastErr = e;
    }

    // token が生成されるまで少し待つ（指数ではなく段階的に伸ばす）
    await sleep(250 * i);
  }

  const msg = lastErr?.message || String(lastErr || "");
  throw new Error(`[push] FCM token not available. ${msg}`);
}

async function saveTokenToSupabase({ userId, token }) {
  if (!userId) throw new Error("[push] userId is required");
  const t = String(token || "").trim();
  if (!t) return;

  // 安全策:
  //  - profiles 行が無い状態で upsert すると display_name NOT NULL 制約に巻き込まれる可能性がある
  //  - ここでは update のみ
  const { data: rows, error: selectError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .limit(1);

  if (selectError) throw selectError;

  if (!rows || rows.length === 0) {
    // ここは AuthContext 側で profiles を ensure する設計なので、基本的には起きない想定
    // ただし race で起きる可能性があるので、呼び出し側でリトライする
    const err = new Error(`[push] profiles row not found for userId=${userId}`);
    err.code = "PROFILE_NOT_READY";
    throw err;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      push_token: t,
      push_platform: Platform.OS,
      push_token_updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (updateError) throw updateError;
}

/**
 * 起動/ログイン時に1回だけ token を同期する
 */
export async function syncPushTokenOnce({ userId }) {
  const ok = await ensureNotificationPermission();
  if (!ok) {
    return { ok: false, reason: "permission_not_granted" };
  }

  // iOS: デバッグ用（APNsトークンが取れてるか）※取れなくても FCM token が取れることはある
  if (Platform.OS === "ios") {
    try {
      const apns = await messaging().getAPNSToken();
      if (apns) {
        console.log("[push] apns token:", String(apns).slice(0, 12) + "...");
      } else {
        console.log("[push] apns token is empty (simulator or capability issue?)");
      }
    } catch {
      // noop
    }
  }

  const token = await getFcmTokenWithRetry({ attempts: 8 });
  console.log("[push] fcm token:", String(token).slice(0, 12) + "...", "platform=", Platform.OS);

  // profiles がまだ無い race を吸収する（最大 ~2秒くらい待つ）
  for (let i = 1; i <= 6; i++) {
    try {
      await saveTokenToSupabase({ userId, token });
      return { ok: true, token };
    } catch (e) {
      if (e?.code !== "PROFILE_NOT_READY") throw e;
      await sleep(350 * i);
    }
  }

  // 6回リトライしても無い = 何かがおかしい（AuthContext の profiles ensure が動いてない等）
  throw new Error("[push] profiles row not ready after retries");
}

/**
 * token の更新に追従する（unsubscribe を返す）
 */
export function startPushTokenSync({ userId }) {
  return messaging().onTokenRefresh(async (token) => {
    try {
      await saveTokenToSupabase({ userId, token });
    } catch (e) {
      console.log("[push] save refreshed token failed:", e?.message || e);
    }
  });
}
