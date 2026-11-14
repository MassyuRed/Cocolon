import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CocolonButton from "./components/CocolonButton";
import { useAuth } from "./AuthContext"; // 置いた場所によってパス調整してね
import { useTheme } from "./theme/ThemeContext";
import { makeUiTokens } from "./ui/uiTokens";

const DISPLAY_NAME_MAX_LENGTH = 15;

function normalizeDisplayName(value) {
  return String(value || "").trim();
}

export default function AuthScreen() {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
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

  const [info, setInfo] = useState("");

  // recoveryMode が true になったら自動で reset 画面へ
  useEffect(() => {
    if (recoveryMode) {
      setMode("reset");
      setInfo("メールのリンクを確認しました。新しいパスワードを設定してください。");
      clearAuthError?.();
    }
  }, [recoveryMode]);

  const toggleSignMode = () => {
    setMode((m) => (m === "signin" ? "signup" : "signin"));
    setInfo("");
    clearAuthError?.();
  };

  const goForgot = () => {
    setMode("forgot");
    setInfo("");
    clearAuthError?.();
  };

  const goSignIn = () => {
    setMode("signin");
    setInfo("");
    clearAuthError?.();
  };

  const goSignUp = () => {
    setMode("signup");
    setInfo("");
    clearAuthError?.();
  };

  const cancelReset = () => {
    cancelRecoveryMode?.();
    setMode("signin");
    setInfo("");
    setNewPassword("");
    setNewPassword2("");
    clearAuthError?.();
  };


  const showResendConfirm = useMemo(() => {
    if (!email) return false;
    const text = `${authError || ""} ${info || ""}`.toLowerCase();
    return (
      text.includes("email not confirmed") ||
      text.includes("確認されていません") ||
      text.includes("メールを確認")
    );
  }, [email, authError, info]);

  const handleResendConfirmation = async () => {
    setInfo("");
    clearAuthError?.();

    try {
      await resendSignupConfirmationEmail({ email });
      setInfo("確認メールを再送しました。受信箱をご確認ください。");
    } catch (e) {
      // AuthContext側で authError に反映しているので、ここでは何もしなくてOK
    }
  };

  const disabled = useMemo(() => {
    if (authLoading) return true;

    if (mode === "signin") {
      return !email || !password;
    }
    if (mode === "signup") {
      const nextDisplayName = normalizeDisplayName(displayName);
      if (!email || !password || !password2 || !nextDisplayName) return true;
      if (nextDisplayName.length > DISPLAY_NAME_MAX_LENGTH) return true;
      if (password !== password2) return true;
      return false;
    }
    if (mode === "forgot") {
      return !email;
    }
    if (mode === "reset") {
      if (!newPassword || !newPassword2) return true;
      if (newPassword.length < 6) return true;
      if (newPassword !== newPassword2) return true;
      return false;
    }

    return true;
  }, [authLoading, mode, email, password, password2, displayName, newPassword, newPassword2]);

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
        await signIn({ email, password });
        // 成功後は onAuthStateChange → session 更新 → ルート側で自動遷移
        return;
      }

      if (mode === "signup") {
        const nextDisplayName = normalizeDisplayName(displayName);
        if (!nextDisplayName) {
          setInfo("ユーザー名を入力してください。");
          return;
        }
        if (nextDisplayName.length > DISPLAY_NAME_MAX_LENGTH) {
          setInfo(`ユーザー名は${DISPLAY_NAME_MAX_LENGTH}文字以内で入力してください。`);
          return;
        }
        const result = await signUp({ email, password, displayName: nextDisplayName });
        if (result?.needsConfirmation) {
          setInfo(`${result.message}\n（メール認証が完了したらログインできます）`);
          setMode("signin");
          setPassword("");
        } else {
          setInfo("アカウントを作成しました。自動的にログインされます。");
        }
        return;
      }

      if (mode === "forgot") {
        await sendPasswordResetEmail({ email });
        setInfo(
          "送信しました。メールに届いたリンクからパスワードを再設定してください。"
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
      // AuthContext側で authError に反映しているので、ここでは何もしなくてOK
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom", "left", "right"]} style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>Emlis</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {/* ============ reset（新パスワード設定） ============ */}
          {mode === "reset" ? (
            <>
              <Text style={styles.helpText}>
                メールのリンクから起動した場合、ここで新しいパスワードを設定できます。
              </Text>

              <View>
                <Text style={styles.fieldLabel}>新しいパスワード（6文字以上）</Text>
                <TextInput
                  accessibilityLabel="新しいパスワード（6文字以上）"
                  style={styles.input}
                  placeholder="新しいパスワード（6文字以上）"
                  placeholderTextColor={ui?.text?.description ?? colors.TEXT_SUBTLE}
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </View>

              <View>
                <Text style={styles.fieldLabel}>新しいパスワード（確認）</Text>
                <TextInput
                  accessibilityLabel="新しいパスワード（確認）"
                  style={styles.input}
                  placeholder="新しいパスワード（確認）"
                  placeholderTextColor={ui?.text?.description ?? colors.TEXT_SUBTLE}
                  secureTextEntry
                  value={newPassword2}
                  onChangeText={setNewPassword2}
                />
              </View>

              {newPassword && newPassword2 && newPassword !== newPassword2 ? (
                <Text style={styles.error}>パスワードが一致しません</Text>
              ) : null}

              {!!authError && <Text style={styles.error}>{authError}</Text>}
              {!!info && <Text style={styles.info}>{info}</Text>}

              {(mode === "signin" || mode === "signup") && showResendConfirm ? (
                <TouchableOpacity onPress={handleResendConfirmation} style={styles.switchMode}>
                  <Text style={styles.switchText}>確認メールを再送する</Text>
                </TouchableOpacity>
              ) : null}

              <CocolonButton
                style={styles.button}
                onPress={handleSubmit}
                disabled={disabled}
                loading={authLoading}
                title={primaryButtonLabel}
              />

              <TouchableOpacity onPress={cancelReset} style={styles.switchMode}>
                <Text style={styles.switchText}>キャンセルしてログインに戻る</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* ============ email（signin/signup/forgot） ============ */}
              <View>
                <Text style={styles.fieldLabel}>メールアドレス</Text>
                <TextInput
                  accessibilityLabel="メールアドレス"
                  style={styles.input}
                  placeholder="メールアドレス"
                  placeholderTextColor={ui?.text?.description ?? colors.TEXT_SUBTLE}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* ============ password（signin/signup のみ） ============ */}
              {(mode === "signin" || mode === "signup") && (
                <View>
                  <Text style={styles.fieldLabel}>パスワード</Text>
                  <TextInput
                    accessibilityLabel="パスワード"
                    style={styles.input}
                    placeholder="パスワード"
                    placeholderTextColor={ui?.text?.description ?? colors.TEXT_SUBTLE}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              )}

              {/* パスワード（確認）（サインアップ時のみ） */}
              {mode === "signup" && (
                <View>
                  <Text style={styles.fieldLabel}>パスワード（確認）</Text>
                  <TextInput
                    accessibilityLabel="パスワード（確認）"
                    style={styles.input}
                    placeholder="パスワード（確認）"
                    placeholderTextColor={ui?.text?.description ?? colors.TEXT_SUBTLE}
                    secureTextEntry
                    value={password2}
                    onChangeText={setPassword2}
                  />
                </View>
              )}

              {mode === "signup" && password && password2 && password !== password2 ? (
                <Text style={styles.error}>パスワードが一致しません</Text>
              ) : null}

              {/* 表示名（サインアップ時のみ） */}
              {mode === "signup" && (
                <View>
                  <Text style={styles.fieldLabel}>ユーザー名</Text>
                  <TextInput
                    accessibilityLabel="ユーザー名"
                    style={styles.input}
                    placeholder="ユーザー名"
                    placeholderTextColor={ui?.text?.description ?? colors.TEXT_SUBTLE}
                    value={displayName}
                    onChangeText={setDisplayName}
                    maxLength={DISPLAY_NAME_MAX_LENGTH}
                  />
                </View>
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

              {!!authError && <Text style={styles.error}>{authError}</Text>}
              {!!info && <Text style={styles.info}>{info}</Text>}

              {(mode === "signin" || mode === "signup") && showResendConfirm ? (
                <TouchableOpacity onPress={handleResendConfirmation} style={styles.switchMode}>
                  <Text style={styles.switchText}>確認メールを再送する</Text>
                </TouchableOpacity>
              ) : null}

              <CocolonButton
                style={styles.button}
                onPress={handleSubmit}
                disabled={disabled}
                loading={authLoading}
                title={primaryButtonLabel}
              />

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

function createStyles(COLORS, ui) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.BG_SILVER },
    container: { flex: 1 },
    scroll: { flex: 1 },
    scrollContent: { flexGrow: 1, justifyContent: "center", padding: 20 },
    card: {
      width: "100%", maxWidth: ui.layout.maxButtonWidth, alignSelf: "center",
      backgroundColor: COLORS.FIELD_BG, borderColor: COLORS.CARD_BORDER,
      borderWidth: 1, borderRadius: ui.radius.card, padding: 20,
      ...ui.shadow.float,
    },
    title: {
      fontFamily: "CormorantGaramond-Bold", fontSize: 38, textAlign: "center",
      marginBottom: 8, color: COLORS.BRAND_GOLD,
    },
    subtitle: { ...ui.typography.screenTitle, textAlign: "center", marginBottom: 24, color: COLORS.TEXT_ON_LIGHT },
    helpText: { ...ui.typography.description, marginBottom: 16, color: COLORS.TEXT_SUBTLE },
    fieldLabel: { ...ui.typography.description, color: COLORS.TEXT_ON_LIGHT, marginBottom: 6 },
    input: {
      ...ui.typography.input, color: COLORS.TEXT_ON_LIGHT,
      borderWidth: 1, borderColor: COLORS.CARD_BORDER, borderRadius: ui.radius.lg,
      paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16, minHeight: 52,
      backgroundColor: COLORS.FIELD_BG,
    },
    forgotWrap: { minHeight: 44, justifyContent: "center", alignItems: "flex-end", marginBottom: 8 },
    forgotText: { ...ui.typography.description, color: COLORS.TITLE_GOLD, textDecorationLine: "underline" },
    button: { marginTop: 12 },
    error: { ...ui.typography.description, color: COLORS.ERROR, backgroundColor: COLORS.ERROR_BG, padding: 12, borderRadius: 12, marginBottom: 12 },
    info: { ...ui.typography.description, color: COLORS.ON_SURFACE_TONAL, backgroundColor: COLORS.SURFACE_TONAL, padding: 12, borderRadius: 12, marginBottom: 12 },
    noteText: { ...ui.typography.description, color: COLORS.TEXT_SUBTLE, marginBottom: 12 },
    bottomLinks: { marginTop: 8 },
    switchMode: { minHeight: 44, marginTop: 12, alignItems: "center", justifyContent: "center" },
    switchText: { ...ui.typography.description, color: COLORS.TITLE_GOLD, textAlign: "center", textDecorationLine: "underline" },
  });
}
