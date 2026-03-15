import React, { useEffect, useState, useMemo } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useAuth } from "../AuthContext";
import { useTutorial } from "../TutorialContext";
import { useUnread } from "../UnreadContext";

// 🎨 テーマコンテキスト
import {
  useTheme,
  THEME_VARIANTS,
  THEME_LABELS_JA,
} from "../theme/ThemeContext";

// UI (Design System)
import CocolonButton from "../components/CocolonButton";
import CocolonPressable from "../components/CocolonPressable";

import CocolonSwitch from "../components/CocolonSwitch";
import { apiGet, apiPatch, apiPost } from "../lib/apiClient";
import {
  getTodayQuestionSettings,
  patchTodayQuestionSettings,
  resolveLocalTimezoneName,
} from "../lib/todayQuestionApi";
import {
  getReportDistributionSettings,
  patchReportDistributionSettings,
} from "../lib/reportDistributionApi";
// ここを変えると Setting のパネル高さを調整できる
// ※ 本改修で「背景＆タイトル固定 / パネル内スクロール」に変更したため、
//    minHeight は見た目の基準として残しつつ、パネル自体は flex で収まるようにしています。
const PANEL_MIN_HEIGHT = 680;

export default function SettingsScreen({ navigation }) {
  const { colors, themeName, setThemeName } = useTheme();
  const { signOut, authLoading, user } = useAuth();
  const { startTutorial } = useTutorial();
  const { setUnread } = useUnread();

  const [localProcessing, setLocalProcessing] = useState(false);
  const isBusy = authLoading || localProcessing;

  const isDark = themeName === THEME_VARIANTS.DARK;
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  // Push通知（受信）のON/OFF（アプリ内設定）
  const [pushEnabled, setPushEnabled] = useState(true);
  const [pushLoading, setPushLoading] = useState(true);

  const [todayQuestionNotificationEnabled, setTodayQuestionNotificationEnabled] = useState(true);
  const [todayQuestionDeliveryTime, setTodayQuestionDeliveryTime] = useState("18:00");
  const [todayQuestionTimezone, setTodayQuestionTimezone] = useState(resolveLocalTimezoneName("Asia/Tokyo"));
  const [todayQuestionLoading, setTodayQuestionLoading] = useState(true);

  const [reportDistributionNotificationEnabled, setReportDistributionNotificationEnabled] = useState(true);
  const [reportDistributionDeliveryTime, setReportDistributionDeliveryTime] = useState("00:00");
  const [reportDistributionTimezone, setReportDistributionTimezone] = useState(resolveLocalTimezoneName("Asia/Tokyo"));
  const [reportDistributionLoading, setReportDistributionLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // 未ログイン時は既定ONとして扱う
      if (!user?.id) {
        if (!cancelled) {
          setPushEnabled(true);
          setPushLoading(false);
        }
        return;
      }

      setPushLoading(true);
      try {
        const json = await apiGet("/account/profile/me");
        const enabled = json?.push_enabled;
        if (!cancelled) setPushEnabled(enabled !== false);
      } catch (e) {
        console.warn("SettingsScreen: load push_enabled failed", e);
        if (!cancelled) setPushEnabled(true);
      } finally {
        if (!cancelled) setPushLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    let cancelled = false;

    const loadTodayQuestionSettings = async () => {
      if (!user?.id) {
        if (!cancelled) {
          setTodayQuestionNotificationEnabled(true);
          setTodayQuestionDeliveryTime("18:00");
          setTodayQuestionTimezone(resolveLocalTimezoneName("Asia/Tokyo"));
          setTodayQuestionLoading(false);
        }
        return;
      }

      setTodayQuestionLoading(true);
      try {
        const json = await getTodayQuestionSettings({
          timezone_name: resolveLocalTimezoneName("Asia/Tokyo"),
        });
        const settings = json?.settings ?? json ?? {};
        if (!cancelled) {
          setTodayQuestionNotificationEnabled(settings?.notification_enabled !== false);
          setTodayQuestionDeliveryTime(String(settings?.delivery_time_local || "18:00"));
          setTodayQuestionTimezone(String(settings?.timezone_name || resolveLocalTimezoneName("Asia/Tokyo")));
        }
      } catch (e) {
        console.warn("SettingsScreen: load today question settings failed", e);
        if (!cancelled) {
          setTodayQuestionNotificationEnabled(true);
          setTodayQuestionDeliveryTime("18:00");
          setTodayQuestionTimezone(resolveLocalTimezoneName("Asia/Tokyo"));
        }
      } finally {
        if (!cancelled) setTodayQuestionLoading(false);
      }
    };

    loadTodayQuestionSettings();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    let cancelled = false;

    const loadReportDistributionSettings = async () => {
      if (!user?.id) {
        if (!cancelled) {
          setReportDistributionNotificationEnabled(true);
          setReportDistributionDeliveryTime("00:00");
          setReportDistributionTimezone(resolveLocalTimezoneName("Asia/Tokyo"));
          setReportDistributionLoading(false);
        }
        return;
      }

      setReportDistributionLoading(true);
      try {
        const json = await getReportDistributionSettings({
          timezone_name: resolveLocalTimezoneName("Asia/Tokyo"),
        });
        const settings = json?.settings ?? json ?? {};
        if (!cancelled) {
          setReportDistributionNotificationEnabled(settings?.notification_enabled !== false);
          setReportDistributionDeliveryTime(String(settings?.delivery_time_local || "00:00"));
          setReportDistributionTimezone(String(settings?.timezone_name || resolveLocalTimezoneName("Asia/Tokyo")));
        }
      } catch (e) {
        console.warn("SettingsScreen: load report distribution settings failed", e);
        if (!cancelled) {
          setReportDistributionNotificationEnabled(true);
          setReportDistributionDeliveryTime("00:00");
          setReportDistributionTimezone(resolveLocalTimezoneName("Asia/Tokyo"));
        }
      } finally {
        if (!cancelled) setReportDistributionLoading(false);
      }
    };

    loadReportDistributionSettings();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const updatePushEnabled = async (next) => {
    if (isBusy || pushLoading) return;

    if (!user?.id) {
      Alert.alert("通知設定", "ログイン情報が取得できませんでした。");
      return;
    }

    const prev = pushEnabled;
    setPushEnabled(next);

    setLocalProcessing(true);
    try {
      await apiPatch("/account/profile/me", { push_enabled: next });
    } catch (e) {
      console.warn("SettingsScreen: update push_enabled failed", e);
      setPushEnabled(prev);
      Alert.alert("通知設定の更新に失敗しました", String(e?.message || e));
    } finally {
      setLocalProcessing(false);
    }
  };

  const saveTodayQuestionSettings = async () => {
    if (isBusy || todayQuestionLoading) return;

    if (!user?.id) {
      Alert.alert("今日の問い通知", "ログイン情報が取得できませんでした。");
      return;
    }

    const hhmm = String(todayQuestionDeliveryTime || "").trim();
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hhmm)) {
      Alert.alert("今日の問い通知", "通知する時間は 18:00 のように入力してください。");
      return;
    }

    setLocalProcessing(true);
    try {
      await patchTodayQuestionSettings({
        notification_enabled: !!todayQuestionNotificationEnabled,
        delivery_time_local: hhmm,
        timezone_name: String(todayQuestionTimezone || resolveLocalTimezoneName("Asia/Tokyo")),
      });
      Alert.alert("今日の問い通知", "通知設定を保存しました。");
    } catch (e) {
      console.warn("SettingsScreen: save today question settings failed", e);
      Alert.alert("今日の問い通知", String(e?.message || "通知設定の保存に失敗しました。"));
    } finally {
      setLocalProcessing(false);
    }
  };

  const saveReportDistributionSettings = async () => {
    if (isBusy || reportDistributionLoading) return;

    if (!user?.id) {
      Alert.alert("レポート配布通知", "ログイン情報が取得できませんでした。");
      return;
    }

    const hhmm = String(reportDistributionDeliveryTime || "").trim();
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hhmm)) {
      Alert.alert("レポート配布通知", "通知する時間は 00:00 のように入力してください。");
      return;
    }

    setLocalProcessing(true);
    try {
      await patchReportDistributionSettings({
        notification_enabled: !!reportDistributionNotificationEnabled,
        delivery_time_local: hhmm,
        timezone_name: String(reportDistributionTimezone || resolveLocalTimezoneName("Asia/Tokyo")),
      });
      Alert.alert("レポート配布通知", "通知設定を保存しました。");
    } catch (e) {
      console.warn("SettingsScreen: save report distribution settings failed", e);
      Alert.alert("レポート配布通知", String(e?.message || "通知設定の保存に失敗しました。"));
    } finally {
      setLocalProcessing(false);
    }
  };


  // サブスク加入状況（SubscriptionSelect へ移動）
  const openSubscriptionSelect = () => {
    try {
      if (navigation?.navigate) {
        navigation.navigate("SubscriptionSelect");
        return;
      }
    } catch {
      // no-op
    }
    Alert.alert(
      "サブスク",
      "加入状況画面を開けませんでした。もう一度お試しください。"
    );
  };



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



  // テーマ選択肢（key は内部値、ラベルは ThemeContext 側で集約管理）
  const themeOptions = [
    { key: THEME_VARIANTS.DEFAULT },
    { key: THEME_VARIANTS.LIGHT },
    { key: THEME_VARIANTS.DARK },
  ];

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
      "この操作は取り消せません。\n\nアカウントに紐づくデータを削除してログアウトします。",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除する",
          style: "destructive",
          onPress: async () => {
            setLocalProcessing(true);
            try {
              const json = await apiPost("/account/delete", {});
              await signOut();

              const failed = Array.isArray(json?.failed_tables) ? json.failed_tables : [];
              if (failed.length > 0) {
                Alert.alert(
                  "アカウント削除",
                  "一部のデータを削除できませんでしたが、ログアウトしました。"
                );
              } else {
                Alert.alert("アカウント削除", "削除が完了しました。ログアウトしました。");
              }
            } catch (e) {
              console.error("SettingsScreen: delete account failed", e);
              Alert.alert(
                "アカウント削除に失敗しました",
                String(e?.message || e)
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />

      {/* 画面全体は固定（背景＆タイトル固定） */}
      <View style={styles.screenContainer}>
        {/* コンテンツ（スクロール） */}
          {/* パネルヘッダー */}
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Setting</Text>
          </View>

          <ScrollView
            style={styles.panelScroll}
            contentContainerStyle={styles.panelScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* カラーテーマ */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { fontWeight: "700" }]}>カラーテーマ</Text>
              <View style={styles.themeRow}>
                {themeOptions.map((opt) => {
                  const active = themeName === opt.key;
                  const label = THEME_LABELS_JA[opt.key] ?? opt.key;
                  return (
                    <CocolonButton
                      key={opt.key}
                      variant={active ? "primary" : "secondary"}
                      onPress={() => setThemeName(opt.key)}
                      accessibilityLabel={`テーマ ${label} を選択`}
                      style={{ marginBottom: 8 }}
                      textStyle={{
                        fontSize: 12,
                        fontWeight: active ? "700" : "600",
                      }}
                    >
                      {label}
                    </CocolonButton>
                  );
                })}
              </View>
            </View>



            {/* サブスク */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { fontWeight: "700" }]}>サブスク</Text>

              <View style={styles.card}>
                <CocolonPressable
                  style={styles.row}
                  onPress={openSubscriptionSelect}
                  disabled={isBusy}
                  accessibilityLabel="サブスク加入状況を開く"
                >
                  <View style={styles.rowLeft}>
                    <View style={styles.rowIconWrap}>
                      <Ionicons
                        name="card-outline"
                        size={18}
                        color="#000"
                      />
                    </View>
                    <Text style={styles.rowLabel}>サブスク加入状況</Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.TEXT_SUBTLE}
                  />
                </CocolonPressable>
              </View>
            </View>
            {/* 通知 */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { fontWeight: "700" }]}>通知</Text>

              <View style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.rowLeft}>
                    <View style={styles.rowIconWrap}>
                      <Ionicons
                        name="notifications-outline"
                        size={18}
                        color="#000"
                      />
                    </View>
                    <Text style={styles.rowLabel}>通知を受け取る</Text>
                  </View>

                  <CocolonSwitch
                    value={pushEnabled}
                    onValueChange={updatePushEnabled}
                    disabled={pushLoading || isBusy}
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                  <View style={styles.rowLeft}>
                    <View style={styles.rowIconWrap}>
                      <Ionicons
                        name="help-circle-outline"
                        size={18}
                        color="#000"
                      />
                    </View>
                    <Text style={styles.rowLabel}>今日の問い通知</Text>
                  </View>

                  <CocolonSwitch
                    value={todayQuestionNotificationEnabled}
                    onValueChange={setTodayQuestionNotificationEnabled}
                    disabled={todayQuestionLoading || isBusy || !pushEnabled}
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.inlineBlock}>
                  <Text style={styles.subLabel}>通知する時間</Text>
                  <TextInput
                    value={todayQuestionDeliveryTime}
                    onChangeText={setTodayQuestionDeliveryTime}
                    editable={!todayQuestionLoading && !isBusy}
                    placeholder="18:00"
                    placeholderTextColor={isDark ? "rgba(255,255,255,0.45)" : "#9CA3AF"}
                    style={styles.inlineInput}
                    keyboardType="numbers-and-punctuation"
                    autoCapitalize="none"
                    autoCorrect={false}
                    selectionColor={colors.TITLE_GOLD}
                  />
                  {!pushEnabled ? (
                    <Text style={[styles.sectionHelpText, { marginTop: 6, marginBottom: 0 }]}>
                      「通知を受け取る」がオフのため、今日の問いのお知らせは届きません。
                    </Text>
                  ) : null}

                  <View style={{ marginTop: 12 }}>
                    <CocolonButton
                      variant="secondary"
                      onPress={saveTodayQuestionSettings}
                      disabled={todayQuestionLoading || isBusy}
                      loading={todayQuestionLoading && !todayQuestionDeliveryTime}
                    >
                      今日の問い通知を保存
                    </CocolonButton>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                  <View style={styles.rowLeft}>
                    <View style={styles.rowIconWrap}>
                      <Ionicons
                        name="document-text-outline"
                        size={18}
                        color="#000"
                      />
                    </View>
                    <Text style={styles.rowLabel}>レポート配布通知</Text>
                  </View>

                  <CocolonSwitch
                    value={reportDistributionNotificationEnabled}
                    onValueChange={setReportDistributionNotificationEnabled}
                    disabled={reportDistributionLoading || isBusy || !pushEnabled}
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.inlineBlock}>
                  <Text style={styles.subLabel}>通知する時間</Text>
                  <TextInput
                    value={reportDistributionDeliveryTime}
                    onChangeText={setReportDistributionDeliveryTime}
                    editable={!reportDistributionLoading && !isBusy}
                    placeholder="00:00"
                    placeholderTextColor={isDark ? "rgba(255,255,255,0.45)" : "#9CA3AF"}
                    style={styles.inlineInput}
                    keyboardType="numbers-and-punctuation"
                    autoCapitalize="none"
                    autoCorrect={false}
                    selectionColor={colors.TITLE_GOLD}
                  />

                  <Text style={[styles.sectionHelpText, { marginTop: 10, marginBottom: 0 }]}>
                    日報・週報・月報などのレポートをまとめてお知らせします。
                  </Text>
                  {!pushEnabled ? (
                    <Text style={[styles.sectionHelpText, { marginTop: 6, marginBottom: 0 }]}>
                      「通知を受け取る」がオフのため、レポートのお知らせは届きません。
                    </Text>
                  ) : null}

                  <View style={{ marginTop: 12 }}>
                    <CocolonButton
                      variant="secondary"
                      onPress={saveReportDistributionSettings}
                      disabled={reportDistributionLoading || isBusy}
                      loading={reportDistributionLoading && !reportDistributionDeliveryTime}
                    >
                      レポート配布通知を保存
                    </CocolonButton>
                  </View>
                </View>
              </View>
            </View>

            {/* チュートリアル */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { fontWeight: "700" }]}>チュートリアル</Text>

              <View style={styles.card}>
                <CocolonPressable
                  style={styles.row}
                  onPress={openTutorialRestart}
                  disabled={isBusy}
                  accessibilityLabel="チュートリアルを再体験する"
                >
                  <View style={styles.rowLeft}>
                    <View style={styles.rowIconWrap}>
                      <Ionicons
                        name="school-outline"
                        size={18}
                        color="#000"
                      />
                    </View>
                    <Text style={styles.rowLabel}>チュートリアルを再体験する</Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.TEXT_SUBTLE}
                  />
                </CocolonPressable>
              </View>

              <Text style={styles.sectionHelpText}>
                感情入力・Reflection・フレンド通知の流れを、本番保存なしで体験できます。
              </Text>
            </View>

            {/* カラーテーマの下に、ログアウト / アカウント削除 */}
            <View style={styles.section}>
              <View style={styles.actionsColumn}>
                <CocolonButton
                  variant="primary"
                  onPress={handleLogout}
                  disabled={isBusy}
                  accessibilityLabel="ログアウト"
                  style={{ marginTop: 8 }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="log-out-outline"
                      size={18}
                      color="#fff"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.goldButtonText}>ログアウト</Text>
                  </View>
                </CocolonButton>

                <CocolonButton
                  variant="primary"
                  onPress={handleDeleteAccount}
                  disabled={isBusy}
                  accessibilityLabel="アカウント削除"
                  style={{
                    marginTop: 8,
                    backgroundColor: "#EF4444",
                    borderColor: "#B91C1C",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="person-remove-outline"
                      size={18}
                      color="#fff"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.dangerButtonText}>アカウント削除</Text>
                  </View>
                </CocolonButton>
              </View>
            </View>
          </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function createStyles(COLORS, isDark = false) {
  const TEXT_SUB = COLORS.TEXT_ON_LIGHT;
  const TIME_TEXT = isDark ? COLORS.TEXT_ON_LIGHT : "#111111";

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.PANEL_BG,
    },

    // 画面全体（固定）
    screenContainer: {
      flex: 1,
      paddingTop: 16,
      paddingBottom: 16,
      paddingHorizontal: 18,
      alignItems: "stretch",
    },

    // Emlis ヘッダー
    appTitleWrapper: {
      alignItems: "center",
      marginBottom: 14,
    },
    appTitleText: {
      fontFamily: "CormorantGaramond-Bold",
      fontSize: 24,
      color: COLORS.BRAND_GOLD,
      letterSpacing: 1.2,
    },
    appSubtitleText: {
      fontFamily: "CormorantGaramond-Regular",
      marginTop: 4,
      fontSize: 11,
      color: COLORS.BRAND_GOLD,
      letterSpacing: 0.8,
    },

    // メインパネル（内部スクロール）
    panel: {
      width: "94%",
      height: PANEL_MIN_HEIGHT,
      minHeight: 0,
      backgroundColor: COLORS.PANEL_BG,
      borderRadius: 26,
      borderWidth: 2,
      borderColor: COLORS.BORDER_GOLD,
      paddingHorizontal: 18,
      paddingVertical: 20,
      shadowColor: "#000",
      shadowOpacity: 0.24,
      shadowRadius: 26,
      shadowOffset: { width: 0, height: 16 },
      elevation: 12,
    },

    panelHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    panelTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      letterSpacing: 0.8,
    },

    panelScroll: {
      flex: 1,
    },
    panelScrollContent: {
      paddingBottom: 18,
    },

    section: {
      marginBottom: 18,
    },
    sectionLabel: {
      fontSize: 12,
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 8,
    },

    sectionHelpText: {
      marginTop: 8,
      fontSize: 11,
      lineHeight: 16,
      color: TEXT_SUB,
    },

    // テーマ選択（縦に3つ並べる）
    themeRow: {
      marginTop: 4,
    },
    themeChip: {
      width: "100%",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    themeChipActive: {
      backgroundColor: COLORS.GOLD_BUTTON,
    },
    themeChipLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: COLORS.TEXT_ON_LIGHT,
      textAlign: "center",
    },
    // アクティブ時は常に ACCENT_TEXT（＝白）で塗る
    themeChipLabelActive: {
      color: COLORS.ACCENT_TEXT,
      fontWeight: "700",
    },

    // カード（スイッチ群）
    card: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      paddingHorizontal: 10,
      paddingVertical: 6,
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
    },
    rowLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    rowIconWrap: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: "#EEF2FF",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
    },
    rowLabel: {
      color: TEXT_SUB,
      fontSize: 15,
      fontWeight: "700",
    },
    divider: {
      height: 1,
      backgroundColor: "#F1F5F9",
    },

    inlineBlock: {
      paddingVertical: 12,
    },
    subLabel: {
      fontSize: 13,
      fontWeight: "700",
      color: TIME_TEXT,
      marginBottom: 8,
    },
    inlineInput: {
      fontSize: 18,
      fontWeight: "700",
      color: TIME_TEXT,
      paddingVertical: 4,
      paddingHorizontal: 0,
      backgroundColor: "transparent",
    },

    // アクションボタン群
    actionsColumn: {
      marginTop: 4,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      borderRadius: 999,
      marginTop: 8,
      elevation: 4,
      shadowColor: "#000",
      shadowOpacity: 0.12,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      borderWidth: 1,
    },
    goldButton: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    dangerButton: {
      backgroundColor: "#EF4444",
      borderColor: "#B91C1C",
    },
    goldButtonText: {
      color: "#fff",
      fontWeight: "800",
      fontSize: 15,
    },
    dangerButtonText: {
      color: "#fff",
      fontWeight: "800",
      fontSize: 15,
    },
  });
}
