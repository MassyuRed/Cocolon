import React, { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonPressable from "../../components/CocolonPressable";
import { ScreenUnreadBadge } from "../../components/UnreadBadge";
import { useTheme } from "../../theme/ThemeContext";
import { makeUiTokens } from "../../ui/uiTokens";
import { applyTypographyTokens } from "../../ui/applyTypographyTokens";
import { readShareCode } from "../../lib/compat/legacyWireContracts";

function formatDateLabel(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "";
  try {
    return d.toLocaleString("ja-JP", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function readViewerState(item) {
  return (
    (item?.viewer_state && typeof item.viewer_state === "object" ? item.viewer_state : null) ||
    (item?.viewerState && typeof item.viewerState === "object" ? item.viewerState : null) ||
    {}
  );
}

export default function NexusPieceCard({
  item,
  onPressOwner,
  onPressResonance,
  onPressDelete,
  canResonate = false,
  resonanceSubmitting = false,
  canDelete = false,
  deleteSubmitting = false,
}) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const [menuVisible, setMenuVisible] = useState(false);

  const ownerName = String(item?.owner?.display_name || readShareCode(item?.owner, "") || "ユーザー").trim();
  const createdAt = formatDateLabel(item?.created_at);
  const body = String(item?.body || "").trim();
  const title = String(item?.question?.title || "").trim();
  const viewerState = readViewerState(item);
  const isNew = viewerState?.is_new === true || viewerState?.isNew === true;
  const isResonated =
    viewerState?.is_resonated === true ||
    viewerState?.isResonated === true ||
    item?.is_resonated === true ||
    item?.isResonated === true;
  const resonances = Number(item?.metrics?.resonances ?? item?.resonances ?? 0) || 0;
  const showResonanceButton = !!canResonate;
  const showDeleteMenu = !!canDelete;
  const buttonDisabled = !!isResonated || !!resonanceSubmitting;
  const buttonLabel = isResonated ? "共鳴済み" : "共鳴";

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <CocolonPressable
          style={styles.ownerChip}
          onPress={onPressOwner}
          accessibilityLabel={`${ownerName}のアカウントを開く`}
        >
          <Ionicons
            name="person-circle-outline"
            size={16}
            color={colors.TEXT_ON_LIGHT}
            style={styles.ownerIcon}
          />
          <Text numberOfLines={1} style={styles.ownerText}>
            {ownerName}
          </Text>
        </CocolonPressable>

        <View style={styles.headerRight}>
          {showDeleteMenu ? (
            <CocolonPressable
              style={[styles.moreButton, deleteSubmitting && styles.moreButtonDisabled]}
              onPress={() => setMenuVisible((current) => !current)}
              disabled={deleteSubmitting}
              accessibilityLabel="ピースのメニューを開く"
              hitSlop={8}
            >
              {deleteSubmitting ? (
                <ActivityIndicator size="small" color={colors.TEXT_SUBTLE} />
              ) : (
                <Ionicons
                  name="ellipsis-horizontal"
                  size={18}
                  color={colors.TEXT_SUBTLE}
                />
              )}
            </CocolonPressable>
          ) : (
            <View style={styles.moreButtonSpacer} accessibilityElementsHidden importantForAccessibility="no" />
          )}
          <View style={styles.timeRow}>
            {createdAt ? <Text style={styles.timeText}>{createdAt}</Text> : null}
            <ScreenUnreadBadge visible={isNew} style={styles.newBadge} />
          </View>
        </View>
      </View>

      <View
        key={menuVisible ? "question-menu-open" : "question-menu-closed"}
        style={styles.questionBlock}
        collapsable={false}
      >
        <Text style={styles.questionLabel}>問い</Text>
        <Text style={styles.questionText}>{title || "—"}</Text>
      </View>

      <Text style={styles.bodyLabel}>答え</Text>
      <Text style={styles.bodyText}>{body || "—"}</Text>

      <View style={styles.metricsRow}>
        <View style={styles.metricChip}>
          <Ionicons
            name={isResonated ? "heart" : "heart-outline"}
            size={14}
            color={colors.TEXT_SUBTLE}
            style={styles.metricIcon}
          />
          <Text style={styles.metricText}>{resonances}</Text>
        </View>

        {showResonanceButton ? (
          <CocolonPressable
            style={[
              styles.resonanceButton,
              isResonated && styles.resonanceButtonDone,
              buttonDisabled && styles.resonanceButtonDisabled,
            ]}
            onPress={onPressResonance}
            disabled={buttonDisabled}
            accessibilityLabel={buttonLabel}
            hitSlop={8}
          >
            {resonanceSubmitting ? (
              <ActivityIndicator size="small" color={colors.TEXT_ON_LIGHT} />
            ) : (
              <Text
                style={[
                  styles.resonanceButtonText,
                  isResonated && styles.resonanceButtonTextDone,
                ]}
              >
                {buttonLabel}
              </Text>
            )}
          </CocolonPressable>
        ) : null}
      </View>

      {menuVisible && showDeleteMenu ? (
        <View style={styles.actionMenu} collapsable={false}>
          <CocolonPressable
            style={styles.actionMenuItem}
            onPress={() => {
              setMenuVisible(false);
              onPressDelete?.();
            }}
            disabled={deleteSubmitting}
            accessibilityLabel="ピースを削除する"
          >
            <Ionicons
              name="trash-outline"
              size={16}
              color="#DC2626"
              style={styles.actionMenuIcon}
            />
            <Text style={styles.actionMenuDeleteText}>削除</Text>
          </CocolonPressable>
        </View>
      ) : null}
    </View>
  );
}

function createStyles(COLORS, ui) {
  const font = ui?.font || {};
  const text = ui?.text || {};
  return StyleSheet.create(applyTypographyTokens({
    card: {
      position: "relative",
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 14,
      paddingVertical: 14,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    ownerChip: {
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 1,
      paddingRight: 8,
    },
    ownerIcon: {
      marginRight: 6,
    },
    ownerText: {
      fontSize: 13,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      maxWidth: 180,
    },
    headerRight: {
      alignItems: "flex-end",
      justifyContent: "flex-start",
      minWidth: 82,
    },
    moreButton: {
      width: 30,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 2,
    },
    moreButtonDisabled: {
      opacity: 0.58,
    },
    moreButtonSpacer: {
      width: 30,
      height: 28,
      marginBottom: 2,
    },
    timeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    timeText: {
      fontSize: 11,
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },
    newBadge: {
      marginLeft: 8,
    },
    actionMenu: {
      position: "absolute",
      top: 42,
      right: 10,
      zIndex: 20,
      elevation: 10,
      minWidth: 142,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      shadowColor: "#000",
      shadowOpacity: 0.14,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      paddingVertical: 4,
    },
    actionMenuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    actionMenuIcon: {
      marginRight: 8,
    },
    actionMenuDeleteText: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "900",
      color: "#DC2626",
    },
    questionBlock: {
      position: "relative",
      zIndex: 1,
    },
    questionLabel: {
      fontSize: 11,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      marginBottom: 4,
    },
    questionText: {
      fontSize: 15,
      lineHeight: 23,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 10,
    },
    bodyLabel: {
      fontSize: 11,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      marginBottom: 4,
    },
    bodyText: {
      fontSize: 14,
      lineHeight: 23,
      color: COLORS.TEXT_ON_LIGHT,
    },
    metricsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 12,
    },
    metricChip: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor: COLORS.PANEL_BG,
      marginRight: 8,
    },
    metricIcon: {
      marginRight: 4,
    },
    metricText: {
      fontSize: 12,
      color: text.description ?? COLORS.TEXT_SUBTLE,
      fontWeight: "700",
    },
    resonanceButton: {
      minWidth: 74,
      minHeight: 34,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      paddingHorizontal: 14,
      paddingVertical: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    resonanceButtonDone: {
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
    },
    resonanceButtonDisabled: {
      opacity: 0.72,
    },
    resonanceButtonText: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: "900",
      color: COLORS.ACCENT_TEXT,
    },
    resonanceButtonTextDone: {
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },
  }, ui));
}
