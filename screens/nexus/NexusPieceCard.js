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
          <Text style={styles.ownerText}>
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
              accessibilityState={{ expanded: menuVisible, busy: deleteSubmitting }}
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
            accessibilityState={{ selected: isResonated, busy: resonanceSubmitting }}
            hitSlop={8}
          >
            {resonanceSubmitting ? (
              <ActivityIndicator size="small" color={colors.TEXT_SUBTLE} />
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
              color={colors.ERROR}
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
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
    headerRow: {
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: "space-between",
      marginBottom: 16,
      gap: 8,
    },
    ownerChip: {
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 1,
      paddingRight: 0,
      width: '100%',
      minHeight: 44,
    },
    ownerIcon: {
      marginRight: 6,
    },
    ownerText: {
      color: COLORS.TEXT_ON_LIGHT,
      flex: 1,
      minWidth: 0,
    },
    headerRight: {
      alignItems: 'center',
      justifyContent: 'space-between',
      minWidth: 0,
      flexDirection: 'row',
      gap: 8,
    },
    moreButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 0,
    },
    moreButtonDisabled: {

    },
    moreButtonSpacer: {
      width: 44,
      height: 44,
      marginBottom: 0,
    },
    timeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      flexWrap: 'wrap',
      flexShrink: 1,
      gap: 6,
    },
    timeText: {
      color: text.description ?? COLORS.TEXT_SUBTLE,
      flexShrink: 1,
    },
    newBadge: {
      marginLeft: 0,
    },
    actionMenu: {
      position: 'relative',
      elevation: 1,
      minWidth: 0,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      paddingVertical: 4,
      width: '100%',
      marginTop: 12,
    },
    actionMenuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      minHeight: 44,
    },
    actionMenuIcon: {
      marginRight: 8,
    },
    actionMenuDeleteText: {
      color: COLORS.ERROR,
    },
    questionBlock: {
      position: "relative",
      zIndex: 1,
    },
    questionLabel: {
      color: COLORS.TEXT_SUBTLE,
      marginBottom: 6,
    },
    questionText: {
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 16,
    },
    bodyLabel: {
      color: COLORS.TEXT_SUBTLE,
      marginBottom: 6,
    },
    bodyText: {
      color: COLORS.TEXT_ON_LIGHT,
    },
    metricsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 16,
      flexWrap: 'wrap',
      gap: 8,
    },
    metricChip: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: COLORS.PANEL_BG,
      marginRight: 0,
    },
    metricIcon: {
      marginRight: 4,
    },
    metricText: {
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },
    resonanceButton: {
      minWidth: 74,
      minHeight: 44,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      paddingHorizontal: 16,
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    resonanceButtonDone: {
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    resonanceButtonDisabled: {
      backgroundColor: COLORS.FIELD_BG,
      borderColor: COLORS.CARD_BORDER,
    },
    resonanceButtonText: {
      color: COLORS.ACCENT_TEXT,
    },
    resonanceButtonTextDone: {
      color: COLORS.TEXT_SUBTLE,
    },
  }, ui, {"ownerText":"button","timeText":"meta","actionMenuDeleteText":"button","questionLabel":"meta","questionText":"description","bodyLabel":"description","bodyText":"body","metricText":"meta","resonanceButtonText":"button"}));
}
