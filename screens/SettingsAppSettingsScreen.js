import React, { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useAuth } from "../AuthContext";
import CocolonPressable from "../components/CocolonPressable";
import CocolonSwitch from "../components/CocolonSwitch";
import { apiGet, apiPatch, apiPost } from "../lib/apiClient";
import { EMOTION_NOTIFICATION_WIRE, readEmotionNotificationOwnerId } from "../lib/compat/legacyWireContracts";
import {
  getReportDistributionSettings,
  patchReportDistributionSettings,
} from "../lib/reportDistributionApi";
import {
  getTodayQuestionSettings,
  patchTodayQuestionSettings,
  resolveLocalTimezoneName,
} from "../lib/todayQuestionApi";
import {
  THEME_LABELS_JA,
  THEME_VARIANTS,
  useTheme,
} from "../theme/ThemeContext";
import {
  AnalysisDescription,
  AnalysisMediumCard,
  AnalysisMenuScroll,
  AnalysisSubHeader,
  useAnalysisMenuStyles,
} from "./AnalysisMenuCommon";

const EMOTION_NOTIFICATION_GLOBAL_OWNER_ID = EMOTION_NOTIFICATION_WIRE.globalOwnerCompatId;

function resolveEmotionNotificationEnabled(payload) {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.settings)
    ? payload.settings
    : Array.isArray(payload?.data)
    ? payload.data
    : [];

  const row = list.find((item) => {
    const notificationOwnerUserId = readEmotionNotificationOwnerId(item, "");

    return String(notificationOwnerUserId || "").trim() === EMOTION_NOTIFICATION_GLOBAL_OWNER_ID;
  });

  if (!row || typeof row !== "object") return true;

  const enabled =
    row?.is_enabled ??
    row?.isEnabled ??
    row?.enabled ??
    row?.is_on ??
    row?.isOn;

  return typeof enabled === "boolean" ? enabled : true;
}

function createLocalStyles(colors, ui) {
  const text = ui?.text || {};

  return StyleSheet.create({
    groupWrap: {
      marginTop: 8,
    },
    optionRow: {
      marginLeft: 12,
      minHeight: 58,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      backgroundColor: colors.FIELD_BG,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    optionRowSelected: {
      borderColor: colors.TITLE_GOLD,
      backgroundColor: colors.FIELD_BG,
    },
    optionRowDisabled: {
      opacity: 0.58,
    },
    optionRowInner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    optionLabel: {
      flex: 1,
      paddingRight: 12,
      fontSize: 18,
      fontWeight: "700",
      color: text.primary ?? colors.TEXT_ON_LIGHT,
    },
    optionMetaWrap: {
      flexDirection: "row",
      alignItems: "center",
    },
    optionMetaText: {
      fontSize: 12,
      lineHeight: 16,
      color: text.description ?? colors.TEXT_ON_LIGHT,
      marginRight: 8,
    },
    helperText: {
      marginTop: 10,
      marginLeft: 12,
      fontSize: 12,
      lineHeight: 18,
      color: text.description ?? colors.TEXT_ON_LIGHT,
    },
  });
}

function SettingChoiceRow({
  label,
  selected,
  onPress,
  rightText,
}) {
  const { colors, ui } = useAnalysisMenuStyles();
  const localStyles = useMemo(() => createLocalStyles(colors, ui), [colors, ui]);

  return (
    <CocolonPressable
      style={[localStyles.optionRow, selected && localStyles.optionRowSelected]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label}${selected ? " 現在選択中" : ""}`}
    >
      <View style={localStyles.optionRowInner}>
        <Text style={localStyles.optionLabel}>{label}</Text>
        <View style={localStyles.optionMetaWrap}>
          {rightText ? <Text style={localStyles.optionMetaText}>{rightText}</Text> : null}
          <Ionicons
            name={selected ? "checkmark-circle" : "ellipse-outline"}
            size={20}
            color={selected ? colors.TITLE_GOLD : colors.TEXT_SUBTLE}
          />
        </View>
      </View>
    </CocolonPressable>
  );
}

function SettingSwitchRow({
  label,
  value,
  onValueChange,
  disabled = false,
}) {
  const { colors, ui } = useAnalysisMenuStyles();
  const localStyles = useMemo(() => createLocalStyles(colors, ui), [colors, ui]);

  const handleToggle = () => {
    if (disabled) return;
    onValueChange(!value);
  };

  return (
    <CocolonPressable
      style={[
        localStyles.optionRow,
        disabled && localStyles.optionRowDisabled,
      ]}
      onPress={handleToggle}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={label}
    >
      <View style={localStyles.optionRowInner}>
        <Text style={localStyles.optionLabel}>{label}</Text>
        <CocolonSwitch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
        />
      </View>
    </CocolonPressable>
  );
}

export default function SettingsAppSettingsScreen({ navigation }) {
  const { colors, themeName, setThemeName } = useTheme();
  const { user, authLoading } = useAuth();
  const { ui } = useAnalysisMenuStyles();
  const localStyles = useMemo(() => createLocalStyles(colors, ui), [colors, ui]);
  const fallbackTimezone = useMemo(
    () => resolveLocalTimezoneName("Asia/Tokyo"),
    []
  );

  const [expandedSection, setExpandedSection] = useState(null);
  const [localProcessing, setLocalProcessing] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [pushLoading, setPushLoading] = useState(true);
  const [todayQuestionNotificationEnabled, setTodayQuestionNotificationEnabled] = useState(true);
  const [todayQuestionDeliveryTime, setTodayQuestionDeliveryTime] = useState("18:00");
  const [todayQuestionTimezone, setTodayQuestionTimezone] = useState(fallbackTimezone);
  const [todayQuestionLoading, setTodayQuestionLoading] = useState(true);
  const [reportDistributionNotificationEnabled, setReportDistributionNotificationEnabled] = useState(true);
  const [reportDistributionDeliveryTime, setReportDistributionDeliveryTime] = useState("00:00");
  const [reportDistributionTimezone, setReportDistributionTimezone] = useState(fallbackTimezone);
  const [reportDistributionLoading, setReportDistributionLoading] = useState(true);
  const [emotionNotificationEnabled, setEmotionNotificationEnabled] = useState(true);
  const [emotionNotificationLoading, setEmotionNotificationLoading] = useState(true);

  const isBusy = authLoading || localProcessing;
  const notificationSettingsLoading =
    pushLoading ||
    todayQuestionLoading ||
    reportDistributionLoading ||
    emotionNotificationLoading;

  const themeOptions = [
    { key: THEME_VARIANTS.DEFAULT },
    { key: THEME_VARIANTS.LIGHT },
    { key: THEME_VARIANTS.DARK },
  ];

  useEffect(() => {
    let cancelled = false;

    const loadPushEnabled = async () => {
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
      } catch (error) {
        console.warn("SettingsAppSettingsScreen: load push_enabled failed", error);
        if (!cancelled) setPushEnabled(true);
      } finally {
        if (!cancelled) setPushLoading(false);
      }
    };

    loadPushEnabled();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    let cancelled = false;

    const loadTodayQuestion = async () => {
      if (!user?.id) {
        if (!cancelled) {
          setTodayQuestionNotificationEnabled(true);
          setTodayQuestionDeliveryTime("18:00");
          setTodayQuestionTimezone(fallbackTimezone);
          setTodayQuestionLoading(false);
        }
        return;
      }

      setTodayQuestionLoading(true);
      try {
        const json = await getTodayQuestionSettings({
          timezone_name: fallbackTimezone,
        });
        const settings = json?.settings ?? json ?? {};
        if (!cancelled) {
          setTodayQuestionNotificationEnabled(settings?.notification_enabled !== false);
          setTodayQuestionDeliveryTime(String(settings?.delivery_time_local || "18:00"));
          setTodayQuestionTimezone(String(settings?.timezone_name || fallbackTimezone));
        }
      } catch (error) {
        console.warn("SettingsAppSettingsScreen: load today question settings failed", error);
        if (!cancelled) {
          setTodayQuestionNotificationEnabled(true);
          setTodayQuestionDeliveryTime("18:00");
          setTodayQuestionTimezone(fallbackTimezone);
        }
      } finally {
        if (!cancelled) setTodayQuestionLoading(false);
      }
    };

    loadTodayQuestion();
    return () => {
      cancelled = true;
    };
  }, [fallbackTimezone, user?.id]);

  useEffect(() => {
    let cancelled = false;

    const loadReportDistribution = async () => {
      if (!user?.id) {
        if (!cancelled) {
          setReportDistributionNotificationEnabled(true);
          setReportDistributionDeliveryTime("00:00");
          setReportDistributionTimezone(fallbackTimezone);
          setReportDistributionLoading(false);
        }
        return;
      }

      setReportDistributionLoading(true);
      try {
        const json = await getReportDistributionSettings({
          timezone_name: fallbackTimezone,
        });
        const settings = json?.settings ?? json ?? {};
        if (!cancelled) {
          setReportDistributionNotificationEnabled(settings?.notification_enabled !== false);
          setReportDistributionDeliveryTime(String(settings?.delivery_time_local || "00:00"));
          setReportDistributionTimezone(String(settings?.timezone_name || fallbackTimezone));
        }
      } catch (error) {
        console.warn("SettingsAppSettingsScreen: load report distribution settings failed", error);
        if (!cancelled) {
          setReportDistributionNotificationEnabled(true);
          setReportDistributionDeliveryTime("00:00");
          setReportDistributionTimezone(fallbackTimezone);
        }
      } finally {
        if (!cancelled) setReportDistributionLoading(false);
      }
    };

    loadReportDistribution();
    return () => {
      cancelled = true;
    };
  }, [fallbackTimezone, user?.id]);

  useEffect(() => {
    let cancelled = false;

    const loadEmotionNotification = async () => {
      if (!user?.id) {
        if (!cancelled) {
          setEmotionNotificationEnabled(true);
          setEmotionNotificationLoading(false);
        }
        return;
      }

      setEmotionNotificationLoading(true);
      try {
        const json = await apiGet("/emotion-notifications/settings");
        if (!cancelled) {
          setEmotionNotificationEnabled(resolveEmotionNotificationEnabled(json));
        }
      } catch (error) {
        console.warn("SettingsAppSettingsScreen: load emotion notification settings failed", error);
        if (!cancelled) {
          setEmotionNotificationEnabled(true);
        }
      } finally {
        if (!cancelled) setEmotionNotificationLoading(false);
      }
    };

    loadEmotionNotification();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const toggleSection = (nextKey) => {
    setExpandedSection((current) => (current === nextKey ? null : nextKey));
  };

  const persistEmotionNotificationEnabled = async (next) => {
    await apiPost(
      `/emotion-notifications/settings/${encodeURIComponent(EMOTION_NOTIFICATION_GLOBAL_OWNER_ID)}`,
      { is_enabled: !!next }
    );
  };

  const updatePushEnabled = async (next) => {
    if (isBusy || notificationSettingsLoading) return;

    if (!user?.id) {
      Alert.alert("通知設定", "ログイン情報が取得できませんでした。");
      return;
    }

    const nextEnabled = !!next;
    const previous = {
      pushEnabled,
      todayQuestionNotificationEnabled,
      reportDistributionNotificationEnabled,
      emotionNotificationEnabled,
    };

    setPushEnabled(nextEnabled);
    if (!nextEnabled) {
      setTodayQuestionNotificationEnabled(false);
      setReportDistributionNotificationEnabled(false);
      setEmotionNotificationEnabled(false);
    }

    setLocalProcessing(true);
    try {
      await apiPatch("/account/profile/me", { push_enabled: nextEnabled });

      if (!nextEnabled) {
        const results = await Promise.allSettled([
          patchTodayQuestionSettings({
            notification_enabled: false,
            delivery_time_local: String(todayQuestionDeliveryTime || "18:00"),
            timezone_name: String(todayQuestionTimezone || fallbackTimezone),
          }),
          patchReportDistributionSettings({
            notification_enabled: false,
            delivery_time_local: String(reportDistributionDeliveryTime || "00:00"),
            timezone_name: String(reportDistributionTimezone || fallbackTimezone),
          }),
          persistEmotionNotificationEnabled(false),
        ]);

        const failed = results.find((result) => result.status === "rejected");
        if (failed) {
          console.warn(
            "SettingsAppSettingsScreen: partial notification sync failed after push off",
            failed.reason
          );
          Alert.alert(
            "通知設定",
            "全ての通知はオフになりましたが、一部の個別設定の保存に失敗しました。"
          );
        }
      }
    } catch (error) {
      console.warn("SettingsAppSettingsScreen: update push_enabled failed", error);
      setPushEnabled(previous.pushEnabled);
      setTodayQuestionNotificationEnabled(previous.todayQuestionNotificationEnabled);
      setReportDistributionNotificationEnabled(previous.reportDistributionNotificationEnabled);
      setEmotionNotificationEnabled(previous.emotionNotificationEnabled);
      Alert.alert("通知設定の更新に失敗しました", String(error?.message || error));
    } finally {
      setLocalProcessing(false);
    }
  };

  const updateTodayQuestionNotificationEnabled = async (next) => {
    if (isBusy || todayQuestionLoading || !pushEnabled) return;

    if (!user?.id) {
      Alert.alert("今日の問い通知", "ログイン情報が取得できませんでした。");
      return;
    }

    const previous = todayQuestionNotificationEnabled;
    setTodayQuestionNotificationEnabled(next);

    setLocalProcessing(true);
    try {
      await patchTodayQuestionSettings({
        notification_enabled: !!next,
        delivery_time_local: String(todayQuestionDeliveryTime || "18:00"),
        timezone_name: String(todayQuestionTimezone || fallbackTimezone),
      });
    } catch (error) {
      console.warn("SettingsAppSettingsScreen: update today question failed", error);
      setTodayQuestionNotificationEnabled(previous);
      Alert.alert("今日の問い通知", String(error?.message || "通知設定の更新に失敗しました。"));
    } finally {
      setLocalProcessing(false);
    }
  };

  const updateReportDistributionNotificationEnabled = async (next) => {
    if (isBusy || reportDistributionLoading || !pushEnabled) return;

    if (!user?.id) {
      Alert.alert("レポート配布通知", "ログイン情報が取得できませんでした。");
      return;
    }

    const previous = reportDistributionNotificationEnabled;
    setReportDistributionNotificationEnabled(next);

    setLocalProcessing(true);
    try {
      await patchReportDistributionSettings({
        notification_enabled: !!next,
        delivery_time_local: String(reportDistributionDeliveryTime || "00:00"),
        timezone_name: String(reportDistributionTimezone || fallbackTimezone),
      });
    } catch (error) {
      console.warn("SettingsAppSettingsScreen: update report distribution failed", error);
      setReportDistributionNotificationEnabled(previous);
      Alert.alert("レポート配布通知", String(error?.message || "通知設定の更新に失敗しました。"));
    } finally {
      setLocalProcessing(false);
    }
  };

  const updateEmotionNotificationEnabled = async (next) => {
    if (isBusy || emotionNotificationLoading || !pushEnabled) return;

    if (!user?.id) {
      Alert.alert("感情通知", "ログイン情報が取得できませんでした。");
      return;
    }

    const previous = emotionNotificationEnabled;
    setEmotionNotificationEnabled(next);

    setLocalProcessing(true);
    try {
      await persistEmotionNotificationEnabled(next);
    } catch (error) {
      console.warn("SettingsAppSettingsScreen: update emotion notification failed", error);
      setEmotionNotificationEnabled(previous);
      Alert.alert("感情通知", String(error?.message || "通知設定の更新に失敗しました。"));
    } finally {
      setLocalProcessing(false);
    }
  };

  return (
    <AnalysisMenuScroll>
      <AnalysisSubHeader title="アプリ設定" onBack={() => navigation.goBack()} />
      <AnalysisDescription>
        変更したい設定を選んでください。
      </AnalysisDescription>

      <AnalysisMediumCard
        title="カラーテーマ"
        description="アプリの見た目を設定します"
        onPress={() => toggleSection("theme")}
        chevron={expandedSection === "theme" ? "up" : "down"}
        accessibilityLabel="カラーテーマの設定を開く"
      />

      {expandedSection === "theme" ? (
        <View style={localStyles.groupWrap}>
          {themeOptions.map((option, index) => (
            <View key={option.key} style={index > 0 ? { marginTop: 8 } : null}>
              <SettingChoiceRow
                label={THEME_LABELS_JA[option.key] ?? option.key}
                selected={themeName === option.key}
                rightText={themeName === option.key ? "現在" : undefined}
                onPress={() => setThemeName(option.key)}
              />
            </View>
          ))}
        </View>
      ) : null}

      <View style={{ marginTop: 12 }}>
        <AnalysisMediumCard
          title="通知設定"
          description="通知の受け取り方を設定します"
          onPress={() => toggleSection("notifications")}
          chevron={expandedSection === "notifications" ? "up" : "down"}
          accessibilityLabel="通知設定を開く"
        />
      </View>

      {expandedSection === "notifications" ? (
        <View style={localStyles.groupWrap}>
          <SettingSwitchRow
            label="全ての通知"
            value={pushEnabled}
            onValueChange={updatePushEnabled}
            disabled={notificationSettingsLoading || isBusy}
          />

          <View style={{ marginTop: 8 }}>
            <SettingSwitchRow
              label="今日の問い通知"
              value={todayQuestionNotificationEnabled}
              onValueChange={updateTodayQuestionNotificationEnabled}
              disabled={todayQuestionLoading || isBusy || !pushEnabled}
            />
          </View>

          <View style={{ marginTop: 8 }}>
            <SettingSwitchRow
              label="レポート配布通知"
              value={reportDistributionNotificationEnabled}
              onValueChange={updateReportDistributionNotificationEnabled}
              disabled={reportDistributionLoading || isBusy || !pushEnabled}
            />
          </View>

          <View style={{ marginTop: 8 }}>
            <SettingSwitchRow
              label="感情通知"
              value={emotionNotificationEnabled}
              onValueChange={updateEmotionNotificationEnabled}
              disabled={emotionNotificationLoading || isBusy || !pushEnabled}
            />
          </View>

          {!pushEnabled ? (
            <Text style={localStyles.helperText}>
              全ての通知がオフのため、個別の通知設定は変更できません。
            </Text>
          ) : null}
        </View>
      ) : null}
    </AnalysisMenuScroll>
  );
}
