import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useAuth } from "../AuthContext";
import CocolonPressable from "../components/CocolonPressable";
import CocolonSwitch from "../components/CocolonSwitch";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
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
  THEME_PALETTES,
  THEME_VARIANTS,
  useTheme,
} from "../theme/ThemeContext";
import {
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
  return StyleSheet.create(applyTypographyTokens({
    sectionRow: {
      minHeight: 64,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: colors.PANEL_BG,
    },
    firstRow: { borderTopLeftRadius: 24, borderTopRightRadius: 24 },
    lastRow: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    sectionIcon: {
      width: 32,
      height: 32,
      flexShrink: 0,
      borderRadius: 11,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.SURFACE_TONAL,
    },
    sectionContent: { flex: 1, minWidth: 0, gap: 2 },
    sectionLabel: { color: colors.TEXT_ON_LIGHT, flexShrink: 1 },
    sectionMeta: { color: colors.TEXT_SUBTLE, flexShrink: 1 },
    groupWrap: {
      marginTop: 3,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: colors.PANEL_BG,
    },
    optionRow: {
      marginLeft: 0,
      minHeight: 48,
      borderRadius: 10,
      backgroundColor: colors.PANEL_BG,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    themeChoice: { borderRadius: 20, backgroundColor: colors.BG_SILVER },
    optionRowSelected: {
      backgroundColor: colors.SURFACE_TONAL,
    },
    optionRowDisabled: {
      opacity: 0.6,
    },
    optionRowInner: {
      flexDirection: "row",
      alignItems: 'center',
      justifyContent: "space-between",
      minWidth: 0,
      flexWrap: 'wrap',
      columnGap: 12,
      rowGap: 8,
    },
    optionLabel: {
      paddingRight: 0,
      color: colors.TEXT_ON_LIGHT,
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 120,
      minWidth: 0,
    },
    optionMetaWrap: {
      flexDirection: "row",
      alignItems: "center",
      minWidth: 0,
      maxWidth: '100%',
      flexShrink: 1,
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
      columnGap: 8,
      rowGap: 4,
    },
    optionMetaText: {
      color: colors.TEXT_SUBTLE,
      marginRight: 0,
      flexShrink: 1,
    },
    helperText: {
      marginTop: 8,
      marginHorizontal: 12,
      marginBottom: 4,
      color: colors.TEXT_SUBTLE,
    },
  }, ui, {"sectionLabel":"button","sectionMeta":"description","optionLabel":"button","optionMetaText":"meta","helperText":"description"}));
}

function SettingSectionRow({ icon, label, summary, expanded, onPress, position }) {
  const { colors, ui } = useAnalysisMenuStyles();
  const localStyles = useMemo(() => createLocalStyles(colors, ui), [colors, ui]);

  return (
    <CocolonPressable
      style={[localStyles.sectionRow, position === "first" && localStyles.firstRow, position === "last" && localStyles.lastRow]}
      onPress={onPress}
      accessibilityState={{ expanded }}
      accessibilityLabel={`${label}の設定を${expanded ? "閉じる" : "開く"}`}
      accessibilityValue={{ text: summary }}
    >
      <View style={localStyles.sectionIcon} accessible={false} importantForAccessibility="no-hide-descendants">
        <Ionicons name={icon} size={18} color={colors.ON_SURFACE_TONAL} />
      </View>
      <View style={localStyles.sectionContent}>
        <Text style={localStyles.sectionLabel}>{label}</Text>
        <Text style={localStyles.sectionMeta}>{summary}</Text>
      </View>
      <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={16} color={colors.TEXT_SUBTLE} />
    </CocolonPressable>
  );
}

function SettingChoiceRow({
  themeKey,
  label,
  selected,
  onPress,
  rightText,
}) {
  const { colors, ui } = useAnalysisMenuStyles();
  const localStyles = useMemo(() => createLocalStyles(colors, ui), [colors, ui]);

  return (
    <CocolonPressable
      style={[localStyles.optionRow, localStyles.themeChoice, selected && localStyles.optionRowSelected]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label}${selected ? " 現在選択中" : ""}`}
    >
      <View style={localStyles.optionRowInner}>
        <View accessible={false} importantForAccessibility="no-hide-descendants" style={{ width: 24, height: 24, flexShrink: 0, borderRadius: 12, borderWidth: 1, borderColor: THEME_PALETTES[themeKey].TITLE_GOLD, backgroundColor: THEME_PALETTES[themeKey].BG_SILVER, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: THEME_PALETTES[themeKey].GOLD_BUTTON }} />
        </View>
        <Text style={[localStyles.optionLabel, selected && { color: colors.ON_SURFACE_TONAL }]}>{label}</Text>
        <View style={localStyles.optionMetaWrap}>
          {rightText ? <Text style={[localStyles.optionMetaText, selected && { color: colors.ON_SURFACE_TONAL }]}>{rightText}</Text> : null}
          <Ionicons
            name={selected ? "checkmark-circle" : "ellipse-outline"}
            size={20}
            color={selected ? colors.ON_SURFACE_TONAL : colors.TEXT_SUBTLE}
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
        <Text style={[localStyles.optionLabel, disabled && { color: colors.TEXT_SUBTLE }]}>{label}</Text>
        <CocolonSwitch
          containerStyle={{ flexShrink: 0 }}
          accessible={false}
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
  const { user, authLoading, authOwnerGeneration } = useAuth();
  const ownerRequestRef = useRef(null);
  const { ui } = useAnalysisMenuStyles();
  const localStyles = useMemo(() => createLocalStyles(colors, ui), [colors, ui]);
  const fallbackTimezone = useMemo(
    () => resolveLocalTimezoneName("Asia/Tokyo"),
    []
  );

  const [expandedSection, setExpandedSection] = useState(null);
  const [notificationReadFailures, setNotificationReadFailures] = useState({});
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

  const failedNotificationLabels = Object.entries({ push: '全ての通知', question: '今日の問い通知', report: 'レポート配布通知', emotion: '感情通知' })
    .filter(([key]) => !!user?.id && notificationReadFailures[key] === user.id).map(([, label]) => label);

  const themeOptions = [
    { key: THEME_VARIANTS.DEFAULT },
    { key: THEME_VARIANTS.LIGHT },
    { key: THEME_VARIANTS.DARK },
  ];

  useEffect(() => {
    const controller = new AbortController();
    ownerRequestRef.current = { expectedUserId: user?.id, signal: controller.signal };
    setLocalProcessing(false);
    setNotificationReadFailures({});
    return () => controller.abort();
  }, [user?.id, authOwnerGeneration]);

  useEffect(() => {
    let cancelled = false;
    const request = ownerRequestRef.current;

    const loadPushEnabled = async () => {
      setNotificationReadFailures(previous => ({ ...previous, push: null }));
      if (!user?.id) {
        if (!cancelled) {
          setPushEnabled(true);
          setPushLoading(false);
        }
        return;
      }

      setPushLoading(true);
      try {
        const json = await apiGet("/account/profile/me", request);
        const enabled = json?.push_enabled;
        if (!cancelled) setPushEnabled(enabled !== false);
      } catch (error) {
        console.warn("SettingsAppSettingsScreen: load push_enabled failed", error);
        if (!cancelled) setNotificationReadFailures(previous => ({ ...previous, push: user.id }));
        if (!cancelled) setPushEnabled(true);
      } finally {
        if (!cancelled) setPushLoading(false);
      }
    };

    loadPushEnabled();
    return () => {
      cancelled = true;
    };
  }, [user?.id, authOwnerGeneration]);

  useEffect(() => {
    let cancelled = false;
    const request = ownerRequestRef.current;

    const loadTodayQuestion = async () => {
      setNotificationReadFailures(previous => ({ ...previous, question: null }));
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
        }, request);
        const settings = json?.settings ?? json ?? {};
        if (!cancelled) {
          setTodayQuestionNotificationEnabled(settings?.notification_enabled !== false);
          setTodayQuestionDeliveryTime(String(settings?.delivery_time_local || "18:00"));
          setTodayQuestionTimezone(String(settings?.timezone_name || fallbackTimezone));
        }
      } catch (error) {
        console.warn("SettingsAppSettingsScreen: load today question settings failed", error);
        if (!cancelled) setNotificationReadFailures(previous => ({ ...previous, question: user.id }));
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
  }, [fallbackTimezone, user?.id, authOwnerGeneration]);

  useEffect(() => {
    let cancelled = false;
    const request = ownerRequestRef.current;

    const loadReportDistribution = async () => {
      setNotificationReadFailures(previous => ({ ...previous, report: null }));
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
        }, request);
        const settings = json?.settings ?? json ?? {};
        if (!cancelled) {
          setReportDistributionNotificationEnabled(settings?.notification_enabled !== false);
          setReportDistributionDeliveryTime(String(settings?.delivery_time_local || "00:00"));
          setReportDistributionTimezone(String(settings?.timezone_name || fallbackTimezone));
        }
      } catch (error) {
        console.warn("SettingsAppSettingsScreen: load report distribution settings failed", error);
        if (!cancelled) setNotificationReadFailures(previous => ({ ...previous, report: user.id }));
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
  }, [fallbackTimezone, user?.id, authOwnerGeneration]);

  useEffect(() => {
    let cancelled = false;
    const request = ownerRequestRef.current;

    const loadEmotionNotification = async () => {
      setNotificationReadFailures(previous => ({ ...previous, emotion: null }));
      if (!user?.id) {
        if (!cancelled) {
          setEmotionNotificationEnabled(true);
          setEmotionNotificationLoading(false);
        }
        return;
      }

      setEmotionNotificationLoading(true);
      try {
        const json = await apiGet("/emotion-notifications/settings", request);
        if (!cancelled) {
          setEmotionNotificationEnabled(resolveEmotionNotificationEnabled(json));
        }
      } catch (error) {
        console.warn("SettingsAppSettingsScreen: load emotion notification settings failed", error);
        if (!cancelled) setNotificationReadFailures(previous => ({ ...previous, emotion: user.id }));
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
  }, [user?.id, authOwnerGeneration]);

  const toggleSection = (nextKey) => {
    setExpandedSection((current) => (current === nextKey ? null : nextKey));
  };

  const persistEmotionNotificationEnabled = async (next, request) => {
    await apiPost(
      `/emotion-notifications/settings/${encodeURIComponent(EMOTION_NOTIFICATION_GLOBAL_OWNER_ID)}`,
      { is_enabled: !!next }, request
    );
  };

  const updatePushEnabled = async (next) => {
    if (isBusy || notificationSettingsLoading) return;

    if (!user?.id) {
      Alert.alert("通知設定", "ログイン情報が取得できませんでした。");
      return;
    }

    const request = ownerRequestRef.current;
    if (request?.expectedUserId !== user.id || request.signal.aborted) return;
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
      await apiPatch("/account/profile/me", { push_enabled: nextEnabled }, request);
      if (request.signal.aborted) return;

      if (!nextEnabled) {
        const results = await Promise.allSettled([
          patchTodayQuestionSettings({
            notification_enabled: false,
            delivery_time_local: String(todayQuestionDeliveryTime || "18:00"),
            timezone_name: String(todayQuestionTimezone || fallbackTimezone),
          }, request),
          patchReportDistributionSettings({
            notification_enabled: false,
            delivery_time_local: String(reportDistributionDeliveryTime || "00:00"),
            timezone_name: String(reportDistributionTimezone || fallbackTimezone),
          }, request),
          persistEmotionNotificationEnabled(false, request),
        ]);

        if (request.signal.aborted) return;
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
      if (request.signal.aborted || error?.name === "AccountChangedError") return;
      console.warn("SettingsAppSettingsScreen: update push_enabled failed", error);
      setPushEnabled(previous.pushEnabled);
      setTodayQuestionNotificationEnabled(previous.todayQuestionNotificationEnabled);
      setReportDistributionNotificationEnabled(previous.reportDistributionNotificationEnabled);
      setEmotionNotificationEnabled(previous.emotionNotificationEnabled);
      Alert.alert("通知設定の更新に失敗しました", String(error?.message || error));
    } finally {
      if (!request.signal.aborted) setLocalProcessing(false);
    }
  };

  const updateTodayQuestionNotificationEnabled = async (next) => {
    if (isBusy || todayQuestionLoading || !pushEnabled) return;

    if (!user?.id) {
      Alert.alert("今日の問い通知", "ログイン情報が取得できませんでした。");
      return;
    }

    const request = ownerRequestRef.current;
    if (request?.expectedUserId !== user.id || request.signal.aborted) return;
    const previous = todayQuestionNotificationEnabled;
    setTodayQuestionNotificationEnabled(next);

    setLocalProcessing(true);
    try {
      await patchTodayQuestionSettings({
        notification_enabled: !!next,
        delivery_time_local: String(todayQuestionDeliveryTime || "18:00"),
        timezone_name: String(todayQuestionTimezone || fallbackTimezone),
      }, request);
    } catch (error) {
      if (request.signal.aborted || error?.name === "AccountChangedError") return;
      console.warn("SettingsAppSettingsScreen: update today question failed", error);
      setTodayQuestionNotificationEnabled(previous);
      Alert.alert("今日の問い通知", String(error?.message || "通知設定の更新に失敗しました。"));
    } finally {
      if (!request.signal.aborted) setLocalProcessing(false);
    }
  };

  const updateReportDistributionNotificationEnabled = async (next) => {
    if (isBusy || reportDistributionLoading || !pushEnabled) return;

    if (!user?.id) {
      Alert.alert("レポート配布通知", "ログイン情報が取得できませんでした。");
      return;
    }

    const request = ownerRequestRef.current;
    if (request?.expectedUserId !== user.id || request.signal.aborted) return;
    const previous = reportDistributionNotificationEnabled;
    setReportDistributionNotificationEnabled(next);

    setLocalProcessing(true);
    try {
      await patchReportDistributionSettings({
        notification_enabled: !!next,
        delivery_time_local: String(reportDistributionDeliveryTime || "00:00"),
        timezone_name: String(reportDistributionTimezone || fallbackTimezone),
      }, request);
    } catch (error) {
      if (request.signal.aborted || error?.name === "AccountChangedError") return;
      console.warn("SettingsAppSettingsScreen: update report distribution failed", error);
      setReportDistributionNotificationEnabled(previous);
      Alert.alert("レポート配布通知", String(error?.message || "通知設定の更新に失敗しました。"));
    } finally {
      if (!request.signal.aborted) setLocalProcessing(false);
    }
  };

  const updateEmotionNotificationEnabled = async (next) => {
    if (isBusy || emotionNotificationLoading || !pushEnabled) return;

    if (!user?.id) {
      Alert.alert("感情通知", "ログイン情報が取得できませんでした。");
      return;
    }

    const request = ownerRequestRef.current;
    if (request?.expectedUserId !== user.id || request.signal.aborted) return;
    const previous = emotionNotificationEnabled;
    setEmotionNotificationEnabled(next);

    setLocalProcessing(true);
    try {
      await persistEmotionNotificationEnabled(next, request);
    } catch (error) {
      if (request.signal.aborted || error?.name === "AccountChangedError") return;
      console.warn("SettingsAppSettingsScreen: update emotion notification failed", error);
      setEmotionNotificationEnabled(previous);
      Alert.alert("感情通知", String(error?.message || "通知設定の更新に失敗しました。"));
    } finally {
      if (!request.signal.aborted) setLocalProcessing(false);
    }
  };

  return (
    <AnalysisMenuScroll>
      <AnalysisSubHeader title="アプリ設定" onBack={() => navigation.goBack()} />

      <SettingSectionRow
        icon="color-palette-outline"
        label="カラーテーマ"
        summary={THEME_LABELS_JA[themeName] ?? themeName}
        expanded={expandedSection === "theme"}
        onPress={() => toggleSection("theme")}
        position="first"
      />

      {expandedSection === "theme" ? (
        <View style={localStyles.groupWrap}>
          {themeOptions.map((option, index) => (
            <View key={option.key} style={index > 0 ? { marginTop: 6 } : null}>
              <SettingChoiceRow
                themeKey={option.key}
                label={THEME_LABELS_JA[option.key] ?? option.key}
                selected={themeName === option.key}
                rightText={themeName === option.key ? "選択中" : undefined}
                onPress={() => setThemeName(option.key)}
              />
            </View>
          ))}
        </View>
      ) : null}

      <View style={{ marginTop: 3 }}>
        <SettingSectionRow
          icon="notifications-outline"
          label="通知設定"
          summary={notificationSettingsLoading ? "読み込み中…" : localProcessing ? "保存中…" : failedNotificationLabels.length > 0 ? "一部の設定を取得できませんでした" : pushEnabled ? "通知オン" : "通知オフ"}
          expanded={expandedSection === "notifications"}
          onPress={() => toggleSection("notifications")}
          position="last"
        />
      </View>

      {expandedSection === "notifications" ? (
        <View style={localStyles.groupWrap}>
          {notificationSettingsLoading ? <Text style={localStyles.helperText} accessibilityLiveRegion="polite">通知設定を読み込んでいます…</Text> : null}
          {localProcessing ? <Text style={localStyles.helperText} accessibilityLiveRegion="polite">通知設定を保存しています…</Text> : null}
          {failedNotificationLabels.length > 0 ? <Text style={[localStyles.helperText, { color: colors.ERROR }]} accessibilityRole="alert">読み込みに失敗した項目：{failedNotificationLabels.join('、')}。設定の表示を再確認するには、画面を開き直してください。</Text> : null}
          <SettingSwitchRow
            label="全ての通知"
            value={pushEnabled}
            onValueChange={updatePushEnabled}
            disabled={notificationSettingsLoading || isBusy}
          />

          <SettingSwitchRow
            label="今日の問い通知"
            value={todayQuestionNotificationEnabled}
            onValueChange={updateTodayQuestionNotificationEnabled}
            disabled={todayQuestionLoading || isBusy || !pushEnabled}
          />

          <SettingSwitchRow
            label="レポート配布通知"
            value={reportDistributionNotificationEnabled}
            onValueChange={updateReportDistributionNotificationEnabled}
            disabled={reportDistributionLoading || isBusy || !pushEnabled}
          />

          <SettingSwitchRow
            label="感情通知"
            value={emotionNotificationEnabled}
            onValueChange={updateEmotionNotificationEnabled}
            disabled={emotionNotificationLoading || isBusy || !pushEnabled}
          />

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

