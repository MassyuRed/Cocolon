import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Linking, Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { supabase } from "./lib/supabase"; // ← 既存のクライアントを使う

const AuthContext = createContext(null);

const CONFIRMATION_GUIDE_LINES = [
  "no-reply@emlis.app から確認メールを送信しました。",
  "迷惑メールフォルダに入る場合もあります。",
  "メール内のリンクを開いて本登録を完了してください。",
];

const CONFIRMATION_GUIDE_TEXT = CONFIRMATION_GUIDE_LINES.join("\n");

// URL の ?query と #hash の両方から params を拾う
function parseUrlParams(url) {
  const params = new URLSearchParams();

  if (!url || typeof url !== "string") return {};

  // query
  const qIndex = url.indexOf("?");
  if (qIndex >= 0) {
    const queryPart = url.slice(qIndex + 1, url.includes("#") ? url.indexOf("#") : undefined);
    const qp = new URLSearchParams(queryPart);
    for (const [k, v] of qp.entries()) params.set(k, v);
  }

  // hash
  const hIndex = url.indexOf("#");
  if (hIndex >= 0) {
    const hashPart = url.slice(hIndex + 1);
    const hp = new URLSearchParams(hashPart);
    for (const [k, v] of hp.entries()) params.set(k, v);
  }

  return Object.fromEntries(params.entries());
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // パスワード再設定リンクから起動したとき、ログイン済みでも Auth 画面に留めるためのフラグ
  const [recoveryMode, setRecoveryMode] = useState(false);

  // profiles の ensure（メール確認フローでも必ず1行作る）
  const ensuredProfileUserIdRef = useRef(null);

  // push_token の同期（同一トークンの連続更新を避ける）
  const lastSyncedPushRef = useRef({ userId: null, token: null });

  const clearAuthError = () => setAuthError("");

  // 初期セッション取得 & 以降の変化を監視
  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;
      if (error) {
        console.warn("getSession error:", error);
      }
      setSession(data?.session ?? null);
      setInitializing(false);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession ?? null);
      if (event === "SIGNED_OUT") {
        setRecoveryMode(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ログイン/認証完了後に profiles を必ず用意する（confirm email で signUp 直後に session が無いケース対策）
  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) {
      ensuredProfileUserIdRef.current = null;
      lastSyncedPushRef.current = { userId: null, token: null };
      return;
    }
    if (ensuredProfileUserIdRef.current === userId) return;
    ensuredProfileUserIdRef.current = userId;

    const displayName =
      session?.user?.user_metadata?.display_name ||
      session?.user?.user_metadata?.displayName ||
      "ユーザー";

    let unsubscribeTokenRefresh = null;

    const syncPushToken = async (token) => {
      try {
        const t = String(token || "").trim();
        if (!t) return;

        // 同一ユーザー & 同一トークンの連続更新を避ける
        if (
          lastSyncedPushRef.current?.userId === userId &&
          lastSyncedPushRef.current?.token === t
        ) {
          return;
        }

        const { error: ptError } = await supabase
          .from("profiles")
          .update({
            push_token: t,
            push_platform: Platform?.OS || null,
            push_token_updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (ptError) {
          console.warn("profiles push_token update error:", ptError);
          return;
        }

        // 更新が成功した場合のみ「同期済み」として記録する
        lastSyncedPushRef.current = { userId, token: t };
      } catch (e) {
        console.warn("profiles push_token sync exception:", e);
      }
    };

    (async () => {
      try {
        // まずは 1 行を確実に作る。
        // profiles.display_name が NOT NULL のため、id だけの insert だと 23502 で落ちる。
        // 既存 row は上書きしたくないので、id 衝突時は ignore する。
        const initialDisplayName = String(displayName || "").trim() || "ユーザー";
        const { error: insertError } = await supabase
          .from("profiles")
          .upsert(
            {
              id: userId,
              display_name: initialDisplayName,
              push_platform: Platform?.OS || null,
              push_enabled: true,
            },
            { onConflict: "id", ignoreDuplicates: true }
          );

        if (insertError) {
          console.warn("profiles ensure upsert error:", insertError);
        }

        // display_name / push_platform が NULL のまま残るケース対策（既存値は上書きしない）
        if (displayName) {
          const { error: dnError } = await supabase
            .from("profiles")
            .update({ display_name: displayName })
            .eq("id", userId)
            .is("display_name", null);
          if (dnError) {
            console.warn("profiles ensure display_name update error:", dnError);
          }
        }

        if (Platform?.OS) {
          const { error: ppError } = await supabase
            .from("profiles")
            .update({ push_platform: Platform.OS })
            .eq("id", userId)
            .is("push_platform", null);
          if (ppError) {
            console.warn("profiles ensure push_platform update error:", ppError);
          }
        }

        // push_token を取得できる環境なら同期する（Android/iOS: FCM）
        if (Platform?.OS !== "web") {
          const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

          const tryFetchAndSyncTokenOnce = async () => {
            // ※ registerDeviceForRemoteMessages は iOS で必要になることがある（best-effort）
            try {
              await messaging().registerDeviceForRemoteMessages?.();
            } catch {
              // best-effort
            }

            // ※ 端末によっては permission 未付与だと token が取得できないことがあるので、可能なら許可を要求（best-effort）
            try {
              await messaging().requestPermission?.();
            } catch {
              // best-effort（拒否/未対応でも続行）
            }

            try {
              const token = await messaging().getToken();
              await syncPushToken(token);
              return true;
            } catch (e) {
              console.warn("messaging getToken error:", e);
              return false;
            }
          };

          // 初回で token が取れない/更新に失敗するケースがあるので、軽くリトライする
          await tryFetchAndSyncTokenOnce();
          await sleep(1500);
          await tryFetchAndSyncTokenOnce();
          await sleep(5000);
          await tryFetchAndSyncTokenOnce();
        }
      } catch (e) {
        console.warn("profiles ensure exception:", e);
      }
    })();

    // トークンが更新されたときも追従（best-effort）
    if (Platform?.OS !== "web") {
      try {
        unsubscribeTokenRefresh = messaging().onTokenRefresh((newToken) => {
          syncPushToken(newToken);
        });
      } catch (e) {
        console.warn("messaging onTokenRefresh setup error:", e);
      }
    }

    return () => {
      if (typeof unsubscribeTokenRefresh === "function") {
        try {
          unsubscribeTokenRefresh();
        } catch {
          // ignore
        }
      }
    };
  }, [session?.user?.id]);

  // Deep Link（Auth callback: signup / magiclink / recovery）を拾う
  useEffect(() => {
    let mounted = true;

    const handleUrl = async (url) => {
      try {
        const p = parseUrlParams(url);
        const type = String(p.type || "").toLowerCase();

        // Supabase の Auth callback（signup / magiclink / recovery など）を処理する
        // - recovery: パスワード再設定 → recoveryMode = true（AuthScreen に留める）
        // - それ以外: 通常ログイン扱い → recoveryMode = false
        const hasAnyToken =
          !!p.code ||
          (!!p.access_token && !!p.refresh_token) ||
          !!p.token_hash ||
          !!p.token;

        if (!hasAnyToken) return;

        // Supabase のフローに合わせて、code / access_token / token_hash のどれでも対応
        if (p.code) {
          const { error } = await supabase.auth.exchangeCodeForSession(p.code);
          if (error) throw error;
        } else if (p.access_token && p.refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token: p.access_token,
            refresh_token: p.refresh_token,
          });
          if (error) throw error;
        } else if (p.token_hash || p.token) {
          const { error } = await supabase.auth.verifyOtp({
            type: type || "recovery",
            token_hash: p.token_hash || p.token,
          });
          if (error) throw error;
        } else {
          throw new Error("認証用のトークンが見つかりませんでした。");
        }

        if (!mounted) return;
        setRecoveryMode(type === "recovery");
      } catch (e) {
        console.warn("handle auth link error:", e);
        if (!mounted) return;
        setAuthError(e?.message ?? String(e));
      }
    };

    // cold start
    (async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          await handleUrl(initialUrl);
        }
      } catch (e) {
        // ignore
      }
    })();

    // runtime
    const sub = Linking.addEventListener?.("url", ({ url }) => {
      handleUrl(url);
    });

    return () => {
      mounted = false;
      // RN のバージョン差分対応
      if (sub && typeof sub.remove === "function") sub.remove();
      // 旧API向け
      if (Linking.removeEventListener) {
        try {
          Linking.removeEventListener("url", handleUrl);
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const signUp = async ({ email, password, displayName }) => {
    setAuthError("");
    setAuthLoading(true);
    try {
      const emailRedirectTo =
        process.env.EXPO_PUBLIC_SIGNUP_REDIRECT_URL ||
        process.env.SIGNUP_REDIRECT_URL ||
        "cocolon://auth-callback";

      const safeDisplayName = String(displayName || "").trim() || "ユーザー";

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: safeDisplayName },
          emailRedirectTo,
          // 旧バージョン互換（supabase-js v1 系）
          redirectTo: emailRedirectTo,
        },
      });

      if (error) {
        console.error("signUp error:", error);
        throw error;
      }

      const user = data.user;
      const signupSession = data.session;

      // メール確認が有効だと session が null の場合もあるので、その場合はメッセージだけ返す
      if (!user || !signupSession) {
        return {
          needsConfirmation: true,
          message: CONFIRMATION_GUIDE_TEXT,
        };
      }

      // profiles に display_name を保存（friend_code は DB 側で自動生成）
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        display_name: safeDisplayName,
        push_platform: Platform?.OS || null,
      });

      if (profileError) {
        console.error("profiles upsert error:", profileError);
        throw profileError;
      }

      return { needsConfirmation: false };
    } catch (e) {
      setAuthError(e.message ?? String(e));
      throw e;
    } finally {
      setAuthLoading(false);
    }
  };

  const signIn = async ({ email, password }) => {
    setAuthError("");
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("signIn error:", error);

        // Supabase の「Confirm email」が有効な場合、確認前ログインはできない
        const msg = String(error?.message || "");
        if (msg.toLowerCase().includes("email not confirmed")) {
          throw new Error(
            `メールアドレスが確認されていません。\n${CONFIRMATION_GUIDE_TEXT}\n本登録完了後にログインしてください。`
          );
        }

        throw error;
      }
      // session の更新は onAuthStateChange が処理してくれる
      return data;
    } catch (e) {
      setAuthError(e.message ?? String(e));
      throw e;
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setRecoveryMode(false);
    } catch (e) {
      setAuthError(e.message ?? String(e));
    } finally {
      setAuthLoading(false);
    }
  };

  // 確認メールを再送（Confirm email が有効なとき用）
  const resendSignupConfirmationEmail = async ({ email }) => {
    setAuthError("");
    setAuthLoading(true);
    try {
      if (!supabase?.auth?.resend) {
        throw new Error(
          "確認メールの再送機能が利用できません（supabase-js のバージョンをご確認ください）。"
        );
      }

      const emailRedirectTo =
        process.env.EXPO_PUBLIC_SIGNUP_REDIRECT_URL ||
        process.env.SIGNUP_REDIRECT_URL ||
        "cocolon://auth-callback";

      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo,
          // 旧バージョン互換（supabase-js v1 系）
          redirectTo: emailRedirectTo,
        },
      });

      if (error) throw error;
      return { ok: true, message: CONFIRMATION_GUIDE_TEXT };
    } catch (e) {
      setAuthError(e.message ?? String(e));
      throw e;
    } finally {
      setAuthLoading(false);
    }
  };

  // ===== パスワードリセット（忘れた場合） =====

  // 送信先：Supabase が「パスワード再設定リンク」をメール送信してくれる
  const sendPasswordResetEmail = async ({ email }) => {
    setAuthError("");
    setAuthLoading(true);
    try {
      const redirectTo =
        process.env.EXPO_PUBLIC_PASSWORD_RESET_REDIRECT_URL ||
        process.env.PASSWORD_RESET_REDIRECT_URL ||
        "https://emlis.app/auth/reset";

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) throw error;
      return { ok: true };
    } catch (e) {
      setAuthError(e.message ?? String(e));
      throw e;
    } finally {
      setAuthLoading(false);
    }
  };

  // メールのリンク（type=recovery）から起動した状態で、新しいパスワードを確定
  const completePasswordRecovery = async ({ newPassword }) => {
    setAuthError("");
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;

      // 更新完了 → 通常モードへ
      setRecoveryMode(false);
      return { ok: true };
    } catch (e) {
      setAuthError(e.message ?? String(e));
      throw e;
    } finally {
      setAuthLoading(false);
    }
  };

  const cancelRecoveryMode = () => {
    setRecoveryMode(false);
  };

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      initializing,
      authLoading,
      authError,
      recoveryMode,

      clearAuthError,

      signUp,
      signIn,
      signOut,
      resendSignupConfirmationEmail,

      sendPasswordResetEmail,
      completePasswordRecovery,
      cancelRecoveryMode,
    }),
    [session, initializing, authLoading, authError, recoveryMode]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
