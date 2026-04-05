import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
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
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";

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
const TIME_PICKER_ITEM_HEIGHT = 44;
const TIME_PICKER_VISIBLE_ROWS = 5;
const TIME_PICKER_HEIGHT = TIME_PICKER_ITEM_HEIGHT * TIME_PICKER_VISIBLE_ROWS;
const TIME_PICKER_VERTICAL_PADDING =
  (TIME_PICKER_HEIGHT - TIME_PICKER_ITEM_HEIGHT) / 2;

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, "0")
);
const MINUTE_OPTIONS = ["00", "30"];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeHalfHour(hourValue, minuteValue) {
  let hour = Number.isFinite(hourValue) ? hourValue : 0;
  let minute = Number.isFinite(minuteValue) ? minuteValue : 0;

  if (minute < 15) {
    minute = 0;
  } else if (minute < 45) {
    minute = 30;
  } else {
    minute = 0;
    hour = (hour + 1) % 24;
  }

  return {
    hour: clamp(hour, 0, 23),
    minute,
  };
}

function parseTimeParts(value, fallback = "00:00") {
  const rawValue = String(value || "").trim();
  const rawFallback = String(fallback || "00:00").trim();
  const match = rawValue.match(/^(?:([01]\d|2[0-3])):([0-5]\d)$/);
  const fallbackMatch = rawFallback.match(/^(?:([01]\d|2[0-3])):([0-5]\d)$/);

  const safeHour = Number(match?.[1] ?? fallbackMatch?.[1] ?? 0);
  const safeMinute = Number(match?.[2] ?? fallbackMatch?.[2] ?? 0);
  const normalized = normalizeHalfHour(safeHour, safeMinute);

  return {
    hourLabel: String(normalized.hour).padStart(2, "0"),
    minuteLabel: String(normalized.minute).padStart(2, "0"),
  };
}

function buildTimeString(hourLabel, minuteLabel) {
  return `${String(hourLabel).padStart(2, "0")}:${String(minuteLabel).padStart(2, "0")}`;
}

function normalizeDisplayTime(value, fallback = "00:00") {
  const { hourLabel, minuteLabel } = parseTimeParts(value, fallback);
  return buildTimeString(hourLabel, minuteLabel);
}

function TimeWheelColumn({
  options,
  selectedValue,
  onChange,
  disabled,
  styles,
  accessibilityLabel,
}) {
  const listRef = useRef(null);
  const selectedIndex = Math.max(0, options.indexOf(selectedValue));

  const scrollToIndex = (index, animated = true) => {
    const safeIndex = clamp(index, 0, options.length - 1);
    listRef.current?.scrollToOffset({
      offset: safeIndex * TIME_PICKER_ITEM_HEIGHT,
      animated,
    });
  };

  const settleAtOffset = (offsetY) => {
    const nextIndex = clamp(
      Math.round((Number(offsetY) || 0) / TIME_PICKER_ITEM_HEIGHT),
      0,
      options.length - 1
    );
    scrollToIndex(nextIndex);
    onChange(options[nextIndex]);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      scrollToIndex(selectedIndex, false);
    }, 0);

    return () => clearTimeout(timerId);
  }, [selectedIndex]);

  return (
    <FlatList
      ref={listRef}
      data={options}
      keyExtractor={(item) => item}
      style={styles.timePickerColumnList}
      contentContainerStyle={styles.timePickerColumnContent}
      scrollEnabled={!disabled}
      nestedScrollEnabled
      bounces={false}
      overScrollMode="never"
      showsVerticalScrollIndicator={false}
      snapToInterval={TIME_PICKER_ITEM_HEIGHT}
      decelerationRate="fast"
      onMomentumScrollEnd={(event) =>
        settleAtOffset(event?.nativeEvent?.contentOffset?.y)
      }
      onScrollEndDrag={(event) =>
        settleAtOffset(event?.nativeEvent?.contentOffset?.y)
      }
      getItemLayout={(_, index) => ({
        length: TIME_PICKER_ITEM_HEIGHT,
        offset: TIME_PICKER_ITEM_HEIGHT * index,
        index,
      })}
      renderItem={({ item, index }) => {
        const isActive = index === selectedIndex;

        return (
          <Pressable
            onPress={() => {
              if (disabled) return;
              scrollToIndex(index);
              onChange(item);
            }}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={`${accessibilityLabel} ${item}`}
            style={styles.timePickerItem}
          >
            <Text
              style={[
                styles.timePickerItemText,
                isActive && styles.timePickerItemTextActive,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

function TimePickerModal({
  visible,
  title,
  value,
  onCancel,
  onConfirm,
  styles,
}) {
  const [draftHour, setDraftHour] = useState("00");
  const [draftMinute, setDraftMinute] = useState("00");

  useEffect(() => {
    if (!visible) return;

    const { hourLabel, minuteLabel } = parseTimeParts(value);
    setDraftHour(hourLabel);
    setDraftMinute(minuteLabel);
  }, [visible, value]);

  const draftValue = buildTimeString(draftHour, draftMinute);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.timePickerModalRoot}>
        <Pressable style={styles.timePickerBackdrop} onPress={onCancel} />

        <View style={styles.timePickerCard}>
          <Text style={styles.timePickerEyebrow}>通知時刻</Text>
          <Text style={styles.timePickerTitle}>{title}</Text>
          <Text style={styles.timePickerValueLabel}>{draftValue}</Text>

          <View style={styles.timePickerMetaRow}>
            <View style={styles.timePickerMetaBadge}>
              <Text style={styles.timePickerMetaBadgeText}>30分刻み</Text>
            </View>
            <Text style={styles.timePickerHint}>上下にスワイプして選択</Text>
          </View>

          <View style={styles.timePickerColumnGuideRow}>
            <Text style={styles.timePickerColumnGuideText}>時</Text>
            <View style={styles.timePickerColumnGuideSpacer} />
            <Text style={styles.timePickerColumnGuideText}>分</Text>
          </View>

          <View style={styles.timePickerWheelFrame}>
            <View pointerEvents="none" style={styles.timePickerSelectionBand} />
            <View pointerEvents="none" style={styles.timePickerSelectionBandTopLine} />
            <View pointerEvents="none" style={styles.timePickerSelectionBandBottomLine} />
            <View pointerEvents="none" style={styles.timePickerFadeTop} />
            <View pointerEvents="none" style={styles.timePickerFadeBottom} />

            <View style={styles.timePickerColumn}>
              <TimeWheelColumn
                options={HOUR_OPTIONS}
                selectedValue={draftHour}
                onChange={setDraftHour}
                disabled={!visible}
                styles={styles}
                accessibilityLabel="時間"
              />
            </View>

            <Text style={styles.timePickerSeparator}>:</Text>

            <View style={styles.timePickerColumn}>
              <TimeWheelColumn
                options={MINUTE_OPTIONS}
                selectedValue={draftMinute}
                onChange={setDraftMinute}
                disabled={!visible}
                styles={styles}
                accessibilityLabel="分"
              />
            </View>
          </View>

          <View style={styles.timePickerActions}>
            <View style={styles.timePickerActionButton}>
              <CocolonButton variant="secondary" onPress={onCancel}>
                キャンセル
              </CocolonButton>
            </View>

            <View style={styles.timePickerActionButton}>
              <CocolonButton variant="primary" onPress={() => onConfirm(draftValue)}>
                決定
              </CocolonButton>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function SettingsScreen({ navigation }) {
  const { colors, themeName, setThemeName } = useTheme();
  const { signOut, authLoading, user } = useAuth();
  const { startTutorial } = useTutorial();
  const { setUnread } = useUnread();

  const [localProcessing, setLocalProcessing] = useState(false);
  const isBusy = authLoading || localProcessing;

  const isDark = themeName === THEME_VARIANTS.DARK;
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, isDark, ui), [colors, isDark, ui]);
  const showNotificationTimeSettings = false; // 時刻設定UIと保存ボタンは一時非表示

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
  const [timePickerTarget, setTimePickerTarget] = useState(null);

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
          setTodayQuestionDeliveryTime(
            normalizeDisplayTime(settings?.delivery_time_local || "18:00", "18:00")
          );
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
          setReportDistributionDeliveryTime(
            normalizeDisplayTime(settings?.delivery_time_local || "00:00", "00:00")
          );
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

  const saveTodayQuestionSettings = async ({
    notificationEnabled = todayQuestionNotificationEnabled,
    deliveryTime = todayQuestionDeliveryTime,
    timezoneName = todayQuestionTimezone,
    showSuccessAlert = true,
  } = {}) => {
    if (isBusy || todayQuestionLoading) return false;

    if (!user?.id) {
      Alert.alert("今日の問い通知", "ログイン情報が取得できませんでした。");
      return false;
    }

    const hhmm = String(deliveryTime || "").trim();
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hhmm)) {
      Alert.alert("今日の問い通知", "通知時刻を選択してください。");
      return false;
    }

    setLocalProcessing(true);
    try {
      await patchTodayQuestionSettings({
        notification_enabled: !!notificationEnabled,
        delivery_time_local: hhmm,
        timezone_name: String(timezoneName || resolveLocalTimezoneName("Asia/Tokyo")),
      });
      if (showSuccessAlert) {
        Alert.alert("今日の問い通知", "通知設定を保存しました。");
      }
      return true;
    } catch (e) {
      console.warn("SettingsScreen: save today question settings failed", e);
      Alert.alert("今日の問い通知", String(e?.message || "通知設定の保存に失敗しました。"));
      return false;
    } finally {
      setLocalProcessing(false);
    }
  };

  const updateTodayQuestionNotificationEnabled = async (next) => {
    if (isBusy || todayQuestionLoading || !pushEnabled) return;

    const prev = todayQuestionNotificationEnabled;
    setTodayQuestionNotificationEnabled(next);

    const ok = await saveTodayQuestionSettings({
      notificationEnabled: next,
      deliveryTime: normalizeDisplayTime(todayQuestionDeliveryTime || "18:00", "18:00"),
      timezoneName: todayQuestionTimezone,
      showSuccessAlert: false,
    });

    if (!ok) {
      setTodayQuestionNotificationEnabled(prev);
    }
  };

  const saveReportDistributionSettings = async ({
    notificationEnabled = reportDistributionNotificationEnabled,
    deliveryTime = reportDistributionDeliveryTime,
    timezoneName = reportDistributionTimezone,
    showSuccessAlert = true,
  } = {}) => {
    if (isBusy || reportDistributionLoading) return false;

    if (!user?.id) {
      Alert.alert("レポート配布通知", "ログイン情報が取得できませんでした。");
      return false;
    }

    const hhmm = String(deliveryTime || "").trim();
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hhmm)) {
      Alert.alert("レポート配布通知", "通知時刻を選択してください。");
      return false;
    }

    setLocalProcessing(true);
    try {
      await patchReportDistributionSettings({
        notification_enabled: !!notificationEnabled,
        delivery_time_local: hhmm,
        timezone_name: String(timezoneName || resolveLocalTimezoneName("Asia/Tokyo")),
      });
      if (showSuccessAlert) {
        Alert.alert("レポート配布通知", "通知設定を保存しました。");
      }
      return true;
    } catch (e) {
      console.warn("SettingsScreen: save report distribution settings failed", e);
      Alert.alert("レポート配布通知", String(e?.message || "通知設定の保存に失敗しました。"));
      return false;
    } finally {
      setLocalProcessing(false);
    }
  };

  const updateReportDistributionNotificationEnabled = async (next) => {
    if (isBusy || reportDistributionLoading || !pushEnabled) return;

    const prev = reportDistributionNotificationEnabled;
    setReportDistributionNotificationEnabled(next);

    const ok = await saveReportDistributionSettings({
      notificationEnabled: next,
      deliveryTime: normalizeDisplayTime(reportDistributionDeliveryTime || "00:00", "00:00"),
      timezoneName: reportDistributionTimezone,
      showSuccessAlert: false,
    });

    if (!ok) {
      setReportDistributionNotificationEnabled(prev);
    }
  };

  const openTimePicker = (target) => {
    if (isBusy) return;

    if (target === "todayQuestion" && todayQuestionLoading) return;
    if (target === "reportDistribution" && reportDistributionLoading) return;

    setTimePickerTarget(target);
  };

  const closeTimePicker = () => {
    setTimePickerTarget(null);
  };

  const confirmTimePicker = (nextValue) => {
    if (timePickerTarget === "todayQuestion") {
      setTodayQuestionDeliveryTime(nextValue);
    }

    if (timePickerTarget === "reportDistribution") {
      setReportDistributionDeliveryTime(nextValue);
    }

    setTimePickerTarget(null);
  };

  const activeTimePickerConfig =
    timePickerTarget === "todayQuestion"
      ? {
          title: "今日の問いの通知時刻",
          value: todayQuestionDeliveryTime,
        }
      : timePickerTarget === "reportDistribution"
        ? {
            title: "レポート配布の通知時刻",
            value: reportDistributionDeliveryTime,
          }
        : null;


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
                        fontSize: ui?.font?.sectionLabel ?? 14,
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
                    <Text style={styles.rowLabel}>すべての通知</Text>
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
                    onValueChange={updateTodayQuestionNotificationEnabled}
                    disabled={todayQuestionLoading || isBusy || !pushEnabled}
                  />
                </View>

                <View style={styles.divider} />

                {showNotificationTimeSettings ? (
                  <>
                    <View style={styles.inlineBlock}>
                      <Text style={styles.subLabel}>通知時刻</Text>
                      <CocolonPressable
                        style={[
                          styles.timeField,
                          (todayQuestionLoading || isBusy) && styles.timeFieldDisabled,
                        ]}
                        onPress={() => openTimePicker("todayQuestion")}
                        disabled={todayQuestionLoading || isBusy}
                        accessibilityLabel="今日の問い通知の時間を選択"
                      >
                        <View style={styles.timeFieldValueWrap}>
                          <Text style={styles.timeFieldCaption}>現在の設定</Text>
                          <Text style={styles.timeFieldText}>{todayQuestionDeliveryTime}</Text>
                        </View>

                        <View style={styles.timeFieldMeta}>
                          <View style={styles.timeFieldChip}>
                            <Text style={styles.timeFieldChipText}>30分刻み</Text>
                          </View>
                          <Ionicons
                            name="chevron-down"
                            size={18}
                            color={colors.TEXT_SUBTLE}
                          />
                        </View>
                      </CocolonPressable>
                      <Text style={[styles.sectionHelpText, { marginTop: 8, marginBottom: 0 }]}>
                        タップすると、ホイールで通知時間をお選びいただけます。
                      </Text>
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
                  </>
                ) : null}

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
                    onValueChange={updateReportDistributionNotificationEnabled}
                    disabled={reportDistributionLoading || isBusy || !pushEnabled}
                  />
                </View>

                {showNotificationTimeSettings ? (
                  <>
                    <View style={styles.divider} />

                    <View style={styles.inlineBlock}>
                      <Text style={styles.subLabel}>通知時刻</Text>
                      <CocolonPressable
                        style={[
                          styles.timeField,
                          (reportDistributionLoading || isBusy) && styles.timeFieldDisabled,
                        ]}
                        onPress={() => openTimePicker("reportDistribution")}
                        disabled={reportDistributionLoading || isBusy}
                        accessibilityLabel="レポート配布通知の時間を選択"
                      >
                        <View style={styles.timeFieldValueWrap}>
                          <Text style={styles.timeFieldCaption}>現在の設定</Text>
                          <Text style={styles.timeFieldText}>{reportDistributionDeliveryTime}</Text>
                        </View>

                        <View style={styles.timeFieldMeta}>
                          <View style={styles.timeFieldChip}>
                            <Text style={styles.timeFieldChipText}>30分刻み</Text>
                          </View>
                          <Ionicons
                            name="chevron-down"
                            size={18}
                            color={colors.TEXT_SUBTLE}
                          />
                        </View>
                      </CocolonPressable>

                      <Text style={[styles.sectionHelpText, { marginTop: 10, marginBottom: 0 }]}>
                        日報・週報・月報などのレポートをまとめてお知らせします。
                      </Text>
                      <Text style={[styles.sectionHelpText, { marginTop: 6, marginBottom: 0 }]}>
                        タップすると、ホイールで通知時間をお選びいただけます。
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
                  </>
                ) : null}
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

      <TimePickerModal
        visible={!!activeTimePickerConfig}
        title={activeTimePickerConfig?.title || "通知時間"}
        value={activeTimePickerConfig?.value || "00:00"}
        onCancel={closeTimePicker}
        onConfirm={confirmTimePicker}
        styles={styles}
      />
    </SafeAreaView>
  );
}

function createStyles(COLORS, isDark = false, ui) {
  const TEXT_SUB = COLORS.TEXT_ON_LIGHT;
  const TIME_TEXT = isDark ? COLORS.TEXT_ON_LIGHT : "#111111";

  return StyleSheet.create(applyTypographyTokens({
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
    timeField: {
      minHeight: 60,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: isDark ? "rgba(212,175,55,0.28)" : "rgba(180,146,72,0.22)",
      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#FFFFFF",
      paddingHorizontal: 14,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: "#000",
      shadowOpacity: isDark ? 0.18 : 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
    },
    timeFieldDisabled: {
      opacity: 0.55,
    },
    timeFieldValueWrap: {
      flexShrink: 1,
    },
    timeFieldCaption: {
      marginBottom: 4,
      fontSize: 10,
      fontWeight: "700",
      letterSpacing: 0.6,
      color: TIME_TEXT,
    },
    timeFieldText: {
      fontSize: 24,
      fontWeight: "800",
      color: TIME_TEXT,
      letterSpacing: 1.2,
      fontVariant: ["tabular-nums"],
    },
    timeFieldMeta: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 12,
    },
    timeFieldChip: {
      marginRight: 8,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: isDark ? "rgba(212,175,55,0.12)" : "rgba(180,146,72,0.1)",
      borderWidth: 1,
      borderColor: isDark ? "rgba(212,175,55,0.2)" : "rgba(180,146,72,0.16)",
    },
    timeFieldChipText: {
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 0.3,
      color: COLORS.TITLE_GOLD,
    },
    timePickerModalRoot: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    timePickerBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(15, 23, 42, 0.46)",
    },
    timePickerCard: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.BORDER_GOLD,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 16,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 12 },
      elevation: 12,
    },
    timePickerEyebrow: {
      fontSize: 10,
      fontWeight: "800",
      color: TIME_TEXT,
      textAlign: "center",
      letterSpacing: 1.2,
      marginBottom: 4,
    },
    timePickerTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      textAlign: "center",
      letterSpacing: 0.4,
    },
    timePickerValueLabel: {
      marginTop: 6,
      marginBottom: 10,
      fontSize: 30,
      fontWeight: "800",
      color: TIME_TEXT,
      textAlign: "center",
      letterSpacing: 1.4,
      fontVariant: ["tabular-nums"],
    },
    timePickerMetaRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    timePickerMetaBadge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 999,
      backgroundColor: isDark ? "rgba(212,175,55,0.14)" : "rgba(180,146,72,0.1)",
      borderWidth: 1,
      borderColor: isDark ? "rgba(212,175,55,0.24)" : "rgba(180,146,72,0.16)",
      marginRight: 8,
    },
    timePickerMetaBadgeText: {
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 0.4,
      color: COLORS.TITLE_GOLD,
    },
    timePickerHint: {
      fontSize: 11,
      fontWeight: "600",
      color: TIME_TEXT,
    },
    timePickerColumnGuideRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    timePickerColumnGuideText: {
      width: 92,
      textAlign: "center",
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 1,
      color: TIME_TEXT,
    },
    timePickerColumnGuideSpacer: {
      width: 28,
      marginHorizontal: 2,
    },
    timePickerWheelFrame: {
      height: TIME_PICKER_HEIGHT,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: isDark ? "rgba(212,175,55,0.18)" : COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
    },
    timePickerSelectionBand: {
      position: "absolute",
      left: 12,
      right: 12,
      top: TIME_PICKER_VERTICAL_PADDING,
      height: TIME_PICKER_ITEM_HEIGHT,
      borderRadius: 14,
      backgroundColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.05)",
      borderWidth: 1,
      borderColor: isDark ? "rgba(212,175,55,0.14)" : "rgba(180,146,72,0.12)",
    },
    timePickerSelectionBandTopLine: {
      position: "absolute",
      left: 20,
      right: 20,
      top: TIME_PICKER_VERTICAL_PADDING,
      height: 1,
      backgroundColor: isDark ? "rgba(212,175,55,0.45)" : "rgba(180,146,72,0.3)",
      zIndex: 1,
    },
    timePickerSelectionBandBottomLine: {
      position: "absolute",
      left: 20,
      right: 20,
      top: TIME_PICKER_VERTICAL_PADDING + TIME_PICKER_ITEM_HEIGHT - 1,
      height: 1,
      backgroundColor: isDark ? "rgba(212,175,55,0.45)" : "rgba(180,146,72,0.3)",
      zIndex: 1,
    },
    timePickerFadeTop: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      height: TIME_PICKER_VERTICAL_PADDING,
      backgroundColor: isDark ? "rgba(16,24,32,0.22)" : "rgba(255,255,255,0.5)",
    },
    timePickerFadeBottom: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: TIME_PICKER_VERTICAL_PADDING,
      backgroundColor: isDark ? "rgba(16,24,32,0.22)" : "rgba(255,255,255,0.5)",
    },
    timePickerColumn: {
      width: 92,
      height: "100%",
      justifyContent: "center",
    },
    timePickerColumnList: {
      flex: 1,
    },
    timePickerColumnContent: {
      paddingVertical: TIME_PICKER_VERTICAL_PADDING,
    },
    timePickerItem: {
      height: TIME_PICKER_ITEM_HEIGHT,
      alignItems: "center",
      justifyContent: "center",
    },
    timePickerItemText: {
      fontSize: 21,
      fontWeight: "600",
      color: COLORS.TEXT_SUBTLE,
      letterSpacing: 0.8,
      opacity: 0.78,
    },
    timePickerItemTextActive: {
      color: TIME_TEXT,
      fontWeight: "800",
      fontSize: 24,
      opacity: 1,
    },
    timePickerSeparator: {
      width: 28,
      textAlign: "center",
      fontSize: 26,
      fontWeight: "800",
      color: TIME_TEXT,
      marginHorizontal: 2,
    },
    timePickerActions: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 16,
      marginHorizontal: -4,
    },
    timePickerActionButton: {
      flex: 1,
      marginHorizontal: 4,
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
  }, ui));
}
