import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Linking, Platform } from "react-native";
import { supabase } from "./lib/supabase"; // ← 既存のクライアントを使う
import {
  clearAccountProfilePushToken,
  ensureAccountProfile,
} from "./lib/api/account/profileApi";

const AuthContext = createContext(null);

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
      return;
    }
    if (ensuredProfileUserIdRef.current === userId) return;
    ensuredProfileUserIdRef.current = userId;

    const displayName =
      session?.user?.user_metadata?.display_name ||
      session?.user?.user_metadata?.displayName ||
      "ユーザー";

    (async () => {
      try {
        await ensureAccountProfile({
          displayName,
          pushPlatform: Platform?.OS || null,
        });
      } catch (e) {
        console.warn("profiles ensure exception:", e);
      }
    })();

    return undefined;
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

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName || "ユーザー" },
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
          message:
            "サインアップしました。メールを確認して本登録を完了してください。",
        };
      }

      // profile 行の ensure と初期表示名/端末情報の保存は backend API 経由に統一する
      try {
        await ensureAccountProfile({
          displayName: displayName || "ユーザー",
          pushPlatform: Platform?.OS || null,
          accessToken: signupSession?.access_token || null,
        });
      } catch (profileError) {
        console.error("account/profile/me ensure error:", profileError);
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
            "メールアドレスが確認されていません。受信箱の確認メールを開いて認証を完了してからログインしてください。"
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

  const signOut = async (options = {}) => {
    const { skipPushTokenClear = false, rethrow = false } = options || {};

    setAuthError("");
    setAuthLoading(true);
    try {
      const currentUserId = session?.user?.id;
      if (currentUserId && !skipPushTokenClear) {
        try {
          await clearAccountProfilePushToken({
            pushPlatform: Platform?.OS || null,
          });
        } catch (clearErr) {
          console.warn("profiles push_token clear exception:", clearErr);
        }
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setRecoveryMode(false);
    } catch (e) {
      setAuthError(e.message ?? String(e));
      if (rethrow) throw e;
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
      return { ok: true };
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
    [
      session,
      initializing,
      authLoading,
      authError,
      recoveryMode,
    ]
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
