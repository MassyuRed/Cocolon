import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "./AuthContext"; // 置いた場所によってパス調整してね
import { supabase } from "./lib/supabase";

const PLACEHOLDER_COLOR = "#6B7280";
const INPUT_TEXT_COLOR = "#111827";
const PASSWORD_MIN_LENGTH = 6;
const DISPLAY_NAME_MAX_LENGTH = 20;
const RESEND_COOLDOWN_SECONDS = 30;
const DISPLAY_NAME_TAKEN_MESSAGE = "このユーザー名はすでに使われています。";

function normalizeDisplayName(value) {
  return String(value || "").trim();
}

function mapDisplayNameConflictMessage(errorLike) {
  const raw = String(errorLike?.message || errorLike || "");
  const lower = raw.toLowerCase();
  if (lower.includes("profiles_display_name_unique")) {
    return DISPLAY_NAME_TAKEN_MESSAGE;
  }
  if (
    lower.includes("display_name") &&
    (lower.includes("unique") || lower.includes("duplicate") || lower.includes("already"))
  ) {
    return DISPLAY_NAME_TAKEN_MESSAGE;
  }
  return "";
}

async function checkDisplayNameAvailability(candidate) {
  const normalized = normalizeDisplayName(candidate);
  if (!normalized) return false;

  try {
    const { data, error } = await supabase.rpc("is_display_name_available", {
      p_candidate: normalized,
      p_exclude_user_id: null,
    });
    if (error) throw error;
    return typeof data === "boolean" ? data : !!data;
  } catch (e) {
    console.warn("AuthScreen: display name availability check failed", e);
    return null;
  }
}

export default function AuthScreen() {
  const {
    signIn,
    signUp,
    resendSignupConfirmationEmail,
    authLoading,
    authError,
    clearAuthError,
    recoveryMode,
    sendPasswordResetEmail,
    completePasswordRecovery,
    cancelRecoveryMode,
  } = useAuth();

  // mode:
  // - signin: ログイン
  // - signup: 新規登録
  // - forgot: メール入力（パスワード再設定リンク送信）
  // - reset:  新しいパスワード設定（メールのリンクから起動したとき）
  const [mode, setMode] = useState(recoveryMode ? "reset" : "signin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPassword2, setShowNewPassword2] = useState(false);

  const [resendCooldown, setResendCooldown] = useState(0);
  const [info, setInfo] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");
  const [displayNameChecking, setDisplayNameChecking] = useState(false);

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const password2InputRef = useRef(null);
  const displayNameInputRef = useRef(null);
  const resetPasswordInputRef = useRef(null);
  const resetPassword2InputRef = useRef(null);

  const trimmedEmail = useMemo(() => email.trim(), [email]);
  const trimmedDisplayName = useMemo(() => normalizeDisplayName(displayName), [displayName]);

  const duplicateDisplayNameError = useMemo(() => {
    if (mode !== "signup") return "";
    return displayNameError || mapDisplayNameConflictMessage(authError);
  }, [authError, displayNameError, mode]);

  // recoveryMode が true になったら自動で reset 画面へ
  useEffect(() => {
    if (recoveryMode) {
      setMode("reset");
      setInfo("メールのリンクを確認しました。新しいパスワードを設定してください。");
      clearAuthError?.();
    }
  }, [recoveryMode, clearAuthError]);

  useEffect(() => {
    if (resendCooldown <= 0) return undefined;
    const timer = setTimeout(() => setResendCooldown((prev) => Math.max(prev - 1, 0)), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const resetTransientState = () => {
    setInfo("");
    clearAuthError?.();
    setShowPassword(false);
    setShowPassword2(false);
    setShowNewPassword(false);
    setShowNewPassword2(false);
    setDisplayNameError("");
    setDisplayNameChecking(false);
  };

  const toggleSignMode = () => {
    setMode((m) => (m === "signin" ? "signup" : "signin"));
    resetTransientState();
  };

  const goForgot = () => {
    setMode("forgot");
    resetTransientState();
  };

  const goSignIn = () => {
    setMode("signin");
    resetTransientState();
  };

  const goSignUp = () => {
    setMode("signup");
    resetTransientState();
  };

  const cancelReset = () => {
    cancelRecoveryMode?.();
    setMode("signin");
    setInfo("");
    setNewPassword("");
    setNewPassword2("");
    setShowNewPassword(false);
    setShowNewPassword2(false);
    clearAuthError?.();
  };

  const showResendConfirm = useMemo(() => {
    if (!trimmedEmail) return false;
    const text = `${authError || ""} ${info || ""}`.toLowerCase();
    return (
      text.includes("email not confirmed") ||
      text.includes("確認されていません") ||
      text.includes("メールを確認") ||
      text.includes("本登録")
    );
  }, [trimmedEmail, authError, info]);

  const handleResendConfirmation = async () => {
    if (!trimmedEmail || resendCooldown > 0) return;
    setInfo("");
    clearAuthError?.();

    try {
      const result = await resendSignupConfirmationEmail({ email: trimmedEmail });
      setInfo(
        result?.message ||
          "no-reply@emlis.app から確認メールを再送しました。\n迷惑メールフォルダも含めて受信箱をご確認ください。"
      );
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (e) {
      // AuthContext側で authError に反映しているので、ここでは何もしなくてOK
    }
  };

  const handleDisplayNameBlur = async () => {
    if (mode !== "signup") return;

    const nextName = normalizeDisplayName(displayName);
    if (!nextName) {
      setDisplayNameError("");
      return;
    }

    setDisplayNameChecking(true);
    try {
      const available = await checkDisplayNameAvailability(nextName);
      if (available === false) {
        setDisplayNameError(DISPLAY_NAME_TAKEN_MESSAGE);
      } else if (available === true) {
        setDisplayNameError("");
      }
    } finally {
      setDisplayNameChecking(false);
    }
  };

  const disabled = useMemo(() => {
    if (authLoading) return true;

    if (mode === "signin") {
      return !trimmedEmail || !password;
    }
    if (mode === "signup") {
      if (!trimmedEmail || !password || !password2 || !trimmedDisplayName) return true;
      if (password.length < PASSWORD_MIN_LENGTH) return true;
      if (password !== password2) return true;
      if (displayNameChecking) return true;
      return false;
    }
    if (mode === "forgot") {
      return !trimmedEmail;
    }
    if (mode === "reset") {
      if (!newPassword || !newPassword2) return true;
      if (newPassword.length < PASSWORD_MIN_LENGTH) return true;
      if (newPassword !== newPassword2) return true;
      return false;
    }

    return true;
  }, [
    authLoading,
    mode,
    trimmedEmail,
    password,
    password2,
    trimmedDisplayName,
    newPassword,
    newPassword2,
    displayNameChecking,
  ]);

  const primaryButtonLabel = useMemo(() => {
    switch (mode) {
      case "signin":
        return "ログイン";
      case "signup":
        return "アカウント作成";
      case "forgot":
        return "再設定リンクを送信";
      case "reset":
        return "新しいパスワードを設定";
      default:
        return "送信";
    }
  }, [mode]);

  const subtitle = useMemo(() => {
    switch (mode) {
      case "signin":
        return "ログイン";
      case "signup":
        return "アカウント作成";
      case "forgot":
        return "パスワード再設定";
      case "reset":
        return "新しいパスワード設定";
      default:
        return "";
    }
  }, [mode]);

  const handleSubmit = async () => {
    setInfo("");
    clearAuthError?.();

    try {
      if (mode === "signin") {
        await signIn({ email: trimmedEmail, password });
        // 成功後は onAuthStateChange → session 更新 → ルート側で自動遷移
        return;
      }

      if (mode === "signup") {
        setDisplayNameError("");
        setDisplayNameChecking(true);
        try {
          const available = await checkDisplayNameAvailability(trimmedDisplayName);
          if (available === false) {
            setDisplayNameError(DISPLAY_NAME_TAKEN_MESSAGE);
            return;
          }
        } finally {
          setDisplayNameChecking(false);
        }

        const result = await signUp({
          email: trimmedEmail,
          password,
          displayName: trimmedDisplayName,
        });
        if (result?.needsConfirmation) {
          setInfo(`${result.message}\n（メール認証が完了したらログインできます）`);
          setMode("signin");
          setPassword("");
          setPassword2("");
          setDisplayName("");
          setDisplayNameError("");
          setShowPassword(false);
          setShowPassword2(false);
        } else {
          setInfo("アカウントを作成しました。自動的にログインされます。");
        }
        return;
      }

      if (mode === "forgot") {
        await sendPasswordResetEmail({ email: trimmedEmail });
        setInfo(
          "送信しました。メールに届いたリンクからパスワードを再設定してください。\n迷惑メールフォルダに入る場合もあります。"
        );
        return;
      }

      if (mode === "reset") {
        await completePasswordRecovery({ newPassword });
        setInfo("パスワードを更新しました。アプリに戻ります…");
        // recoveryMode が false になるので RootNavigator が MainTabs に戻す
        return;
      }
    } catch (e) {
      const friendlyNameError = mapDisplayNameConflictMessage(e) || mapDisplayNameConflictMessage(authError);
      if (mode === "signup" && friendlyNameError) {
        setDisplayNameError(friendlyNameError);
      }
      // AuthContext側で authError に反映しているので、ここでは何もしなくてOK
    }
  };

  const signupPasswordTooShort =
    mode === "signup" && !!password && password.length < PASSWORD_MIN_LENGTH;
  const resetPasswordTooShort =
    mode === "reset" && !!newPassword && newPassword.length < PASSWORD_MIN_LENGTH;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.title}>Emlis</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>

            {/* ============ reset（新パスワード設定） ============ */}
            {mode === "reset" ? (
              <>
                <Text style={styles.helpText}>
                  メールのリンクから起動した場合、ここで新しいパスワードを設定できます。
                </Text>

                <View style={styles.inputShell}>
                  <TextInput
                    ref={resetPasswordInputRef}
                    style={styles.inputWithToggle}
                    placeholder="新しいパスワード（6文字以上）"
                    placeholderTextColor={PLACEHOLDER_COLOR}
                    secureTextEntry={!showNewPassword}
                    autoComplete="new-password"
                    textContentType="newPassword"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    returnKeyType="next"
                    selectionColor="#4F46E5"
                    onSubmitEditing={() => resetPassword2InputRef.current?.focus?.()}
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword((prev) => !prev)}
                    style={styles.toggleInline}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.toggleInlineText}>
                      {showNewPassword ? "非表示" : "表示"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.inputShell}>
                  <TextInput
                    ref={resetPassword2InputRef}
                    style={styles.inputWithToggle}
                    placeholder="新しいパスワード（確認）"
                    placeholderTextColor={PLACEHOLDER_COLOR}
                    secureTextEntry={!showNewPassword2}
                    autoComplete="new-password"
                    textContentType="newPassword"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={newPassword2}
                    onChangeText={setNewPassword2}
                    returnKeyType="done"
                    selectionColor="#4F46E5"
                    onSubmitEditing={handleSubmit}
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword2((prev) => !prev)}
                    style={styles.toggleInline}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.toggleInlineText}>
                      {showNewPassword2 ? "非表示" : "表示"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {resetPasswordTooShort ? (
                  <Text style={styles.error}>パスワードは6文字以上で入力してください</Text>
                ) : null}

                {newPassword && newPassword2 && newPassword !== newPassword2 ? (
                  <Text style={styles.error}>パスワードが一致しません</Text>
                ) : null}

                {!!authError && !duplicateDisplayNameError ? (
                  <Text style={styles.error}>{authError}</Text>
                ) : null}
                {!!info && <Text style={styles.info}>{info}</Text>}

                <TouchableOpacity
                  style={[styles.button, disabled && styles.buttonDisabled]}
                  onPress={handleSubmit}
                  disabled={disabled}
                  activeOpacity={0.9}
                >
                  {authLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>{primaryButtonLabel}</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={cancelReset} style={styles.switchMode}>
                  <Text style={styles.switchText}>キャンセルしてログインに戻る</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* ============ email（signin/signup/forgot） ============ */}
                <TextInput
                  ref={emailInputRef}
                  style={styles.input}
                  placeholder="メールアドレス"
                  placeholderTextColor={PLACEHOLDER_COLOR}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  importantForAutofill="yes"
                  value={email}
                  onChangeText={setEmail}
                  returnKeyType={
                    mode === "forgot" ? "done" : mode === "signin" ? "next" : "next"
                  }
                  selectionColor="#4F46E5"
                  onSubmitEditing={() => {
                    if (mode === "forgot") {
                      handleSubmit();
                    } else {
                      passwordInputRef.current?.focus?.();
                    }
                  }}
                />

                {/* ============ password（signin/signup のみ） ============ */}
                {(mode === "signin" || mode === "signup") && (
                  <View style={styles.inputShell}>
                    <TextInput
                      ref={passwordInputRef}
                      style={styles.inputWithToggle}
                      placeholder="パスワード"
                      placeholderTextColor={PLACEHOLDER_COLOR}
                      secureTextEntry={!showPassword}
                      autoComplete={mode === "signup" ? "new-password" : "password"}
                      textContentType={mode === "signup" ? "newPassword" : "password"}
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={password}
                      onChangeText={setPassword}
                      returnKeyType={mode === "signup" ? "next" : "done"}
                      selectionColor="#4F46E5"
                      onSubmitEditing={() => {
                        if (mode === "signup") {
                          password2InputRef.current?.focus?.();
                        } else {
                          handleSubmit();
                        }
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword((prev) => !prev)}
                      style={styles.toggleInline}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.toggleInlineText}>
                        {showPassword ? "非表示" : "表示"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* パスワード（確認）（サインアップ時のみ） */}
                {mode === "signup" && (
                  <View style={styles.inputShell}>
                    <TextInput
                      ref={password2InputRef}
                      style={styles.inputWithToggle}
                      placeholder="パスワード（確認）"
                      placeholderTextColor={PLACEHOLDER_COLOR}
                      secureTextEntry={!showPassword2}
                      autoComplete="new-password"
                      textContentType="newPassword"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={password2}
                      onChangeText={setPassword2}
                      returnKeyType="next"
                      selectionColor="#4F46E5"
                      onSubmitEditing={() => displayNameInputRef.current?.focus?.()}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword2((prev) => !prev)}
                      style={styles.toggleInline}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.toggleInlineText}>
                        {showPassword2 ? "非表示" : "表示"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {signupPasswordTooShort ? (
                  <Text style={styles.error}>パスワードは6文字以上で入力してください</Text>
                ) : null}

                {mode === "signup" && password && password2 && password !== password2 ? (
                  <Text style={styles.error}>パスワードが一致しません</Text>
                ) : null}

                {/* 表示名（サインアップ時のみ） */}
                {mode === "signup" && (
                  <>
                    <TextInput
                      ref={displayNameInputRef}
                      style={styles.input}
                      placeholder="ユーザー名"
                      placeholderTextColor={PLACEHOLDER_COLOR}
                      autoComplete="username"
                      textContentType="username"
                      autoCorrect={false}
                      value={displayName}
                      onChangeText={(value) => {
                        setDisplayName(value);
                        if (displayNameError) setDisplayNameError("");
                      }}
                      onBlur={handleDisplayNameBlur}
                      maxLength={DISPLAY_NAME_MAX_LENGTH}
                      returnKeyType="done"
                      selectionColor="#4F46E5"
                      onSubmitEditing={handleSubmit}
                    />
                    {duplicateDisplayNameError ? (
                      <Text style={styles.error}>{duplicateDisplayNameError}</Text>
                    ) : displayNameChecking ? (
                      <Text style={styles.helperMuted}>ユーザー名の重複を確認しています…</Text>
                    ) : null}
                  </>
                )}

                {mode === "signup" ? (
                  <Text style={styles.noteText}>
                    ※ユーザー名は、他ユーザーに公開されます。（{DISPLAY_NAME_MAX_LENGTH}文字まで）
                  </Text>
                ) : null}

                {/* 「パスワードを忘れた方はこちら」 */}
                {mode === "signin" && (
                  <TouchableOpacity onPress={goForgot} style={styles.forgotWrap}>
                    <Text style={styles.forgotText}>パスワードを忘れた方はこちら</Text>
                  </TouchableOpacity>
                )}

                {!!authError && !duplicateDisplayNameError ? (
                  <Text style={styles.error}>{authError}</Text>
                ) : null}
                {!!info && <Text style={styles.info}>{info}</Text>}

                {(mode === "signin" || mode === "signup") && showResendConfirm ? (
                  <>
                    <TouchableOpacity
                      onPress={handleResendConfirmation}
                      style={[
                        styles.switchMode,
                        resendCooldown > 0 && styles.switchModeDisabled,
                      ]}
                      disabled={resendCooldown > 0}
                    >
                      <Text
                        style={[
                          styles.switchText,
                          resendCooldown > 0 && styles.switchTextDisabled,
                        ]}
                      >
                        {resendCooldown > 0
                          ? `確認メールを再送する（${resendCooldown}秒）`
                          : "確認メールを再送する"}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.helperMuted}>
                      no-reply@emlis.app から届きます。迷惑メールフォルダもご確認ください。
                    </Text>
                  </>
                ) : null}

                <TouchableOpacity
                  style={[styles.button, disabled && styles.buttonDisabled]}
                  onPress={handleSubmit}
                  disabled={disabled}
                  activeOpacity={0.9}
                >
                  {authLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>{primaryButtonLabel}</Text>
                  )}
                </TouchableOpacity>

                {/* ============ 下部リンク群 ============ */}
                {mode === "forgot" ? (
                  <View style={styles.bottomLinks}>
                    <TouchableOpacity onPress={goSignIn} style={styles.switchMode}>
                      <Text style={styles.switchText}>ログインに戻る</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={goSignUp} style={styles.switchMode}>
                      <Text style={styles.switchText}>アカウント作成へ</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity onPress={toggleSignMode} style={styles.switchMode}>
                    <Text style={styles.switchText}>
                      {mode === "signin"
                        ? "アカウントを持っていない場合はこちら"
                        : "すでにアカウントを持っている場合はこちら"}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#EEF2FF" },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 4,
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    color: "#374151",
  },
  helpText: {
    color: "#374151",
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    fontSize: 14,
    backgroundColor: "#F9FAFB",
    color: INPUT_TEXT_COLOR,
  },
  inputShell: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#F9FAFB",
  },
  inputWithToggle: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: INPUT_TEXT_COLOR,
  },
  toggleInline: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  toggleInlineText: {
    color: "#374151",
    fontSize: 12,
    fontWeight: "600",
  },
  forgotWrap: {
    alignItems: "flex-end",
    marginTop: -2,
    marginBottom: 8,
  },
  forgotText: {
    fontSize: 12,
    color: "#374151",
    textDecorationLine: "underline",
  },
  helperMuted: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
  },
  button: {
    marginTop: 12,
    backgroundColor: "#4F46E5",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  error: {
    color: "#B91C1C",
    marginTop: 4,
    marginBottom: 2,
    fontSize: 12,
    lineHeight: 18,
  },
  info: {
    color: "#374151",
    marginBottom: 4,
    fontSize: 12,
    lineHeight: 18,
  },
  noteText: {
    color: "#111827",
    marginTop: -2,
    marginBottom: 8,
    fontSize: 12,
  },
  bottomLinks: {
    marginTop: 10,
  },
  switchMode: {
    marginTop: 16,
    alignItems: "center",
  },
  switchModeDisabled: {
    opacity: 0.6,
  },
  switchText: {
    fontSize: 12,
    color: "#374151",
    textDecorationLine: "underline",
  },
  switchTextDisabled: {
    textDecorationLine: "none",
  },
});
