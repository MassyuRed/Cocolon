import React, { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonPressable from "../../components/CocolonPressable";
import { ScreenUnreadBadge } from "../../components/UnreadBadge";
import { useTheme } from "../../theme/ThemeContext";
import { makeUiTokens } from "../../ui/uiTokens";
import { applyTypographyTokens } from "../../ui/applyTypographyTokens";
import { readShareCode } from "../../lib/compat/legacyWireContracts";
import { isPieceResonated, isPieceV2Post, readPieceViewerState } from "./nexusHistoryModel";
import { formatDateLabel } from "./nexusNormalize";

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

  const ownerName = String(item?.owner?.display_name || readShareCode(item?.owner, "") || "ユーザー").trim();
  const createdAt = formatDateLabel(item?.created_at);
  const body = String(item?.body || "").trim();
  const title = String(item?.question?.title || "").trim();
  const publishedPiece = isPieceV2Post(item);
  const viewerState = readPieceViewerState(item);
  const isNew = viewerState?.is_new === true || viewerState?.isNew === true;
  const isResonated = isPieceResonated(item);
  const resonances = Number(item?.metrics?.resonances ?? item?.resonances ?? 0) || 0;
  const countLabel = `${resonances}件`;
  const heart = (
    <>
      <Ionicons
        name={isResonated ? "heart" : "heart-outline"}
        size={18}
        color={isResonated ? colors.TITLE_GOLD : colors.TEXT_SUBTLE}
        accessible={false}
      />
      <Text style={styles.metricText} testID="nexus-piece-resonance-count">{resonances}</Text>
    </>
  );

  return (
    <View style={styles.card}>
      <View style={styles.headerRow} testID="nexus-piece-card-header">
        {onPressOwner ? (
          <CocolonPressable
            containerStyle={styles.ownerTarget}
            style={styles.ownerChip}
            onPress={onPressOwner}
            accessibilityLabel={`${ownerName}のアカウントを開く`}
          >
            <Text style={styles.ownerText}>{ownerName}</Text>
          </CocolonPressable>
        ) : (
          <View style={[styles.ownerTarget, styles.ownerChip]}>
            <Text style={styles.ownerText}>{ownerName}</Text>
          </View>
        )}
        <View style={styles.timeRow}>
          {createdAt ? <Text style={styles.timeText}>{createdAt}</Text> : null}
          <ScreenUnreadBadge visible={isNew} />
        </View>
      </View>

      {publishedPiece ? null : (
        <>
          <Text style={styles.questionLabel}>問い</Text>
          <Text style={styles.questionText}>{title || "—"}</Text>
          <Text style={styles.bodyLabel}>答え</Text>
        </>
      )}
      <Text style={styles.bodyText}>{body || "—"}</Text>

      <View style={styles.metricsRow}>
        {canResonate ? (
          <CocolonPressable
            style={[styles.metricChip, resonanceSubmitting && styles.metricPending]}
            onPress={onPressResonance}
            disabled={resonanceSubmitting}
            accessibilityLabel={isResonated ? "共鳴を取り消す" : "共鳴する"}
            accessibilityState={{ selected: isResonated, busy: resonanceSubmitting }}
            accessibilityValue={{ text: countLabel }}
            testID="nexus-piece-resonance-toggle"
          >
            {heart}
          </CocolonPressable>
        ) : (
          <View style={styles.metricChip} accessible accessibilityLabel={`共鳴 ${countLabel}`}>
            {heart}
          </View>
        )}
        {canDelete ? (
          <CocolonPressable
            style={styles.deleteButton}
            onPress={onPressDelete}
            disabled={deleteSubmitting}
            accessibilityLabel="ピースを削除する"
          >
            {deleteSubmitting ? <ActivityIndicator size="small" color={colors.TEXT_SUBTLE} /> : (
              <Text style={styles.deleteText}>削除</Text>
            )}
          </CocolonPressable>
        ) : null}
      </View>
    </View>
  );
}

function createStyles(colors, ui) {
  return StyleSheet.create(applyTypographyTokens({
    card: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: ui.sectionFrame.borderColor,
      backgroundColor: colors.FIELD_BG,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 20,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 16,
      borderBottomWidth: StyleSheet.hairlineWidth || 1,
      borderBottomColor: ui.sectionFrame.borderColor,
    },
    ownerTarget: { flex: 1, minWidth: 0 },
    ownerChip: { justifyContent: "center", minHeight: 44 },
    ownerText: {
      ...ui.typography.button,
      color: colors.TITLE_GOLD,
      fontWeight: "700",
    },
    timeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      flexWrap: "wrap",
      maxWidth: "55%",
      gap: 6,
    },
    timeText: {
      color: ui.text.description ?? colors.TEXT_SUBTLE,
      flexShrink: 1,
      textAlign: "right",
    },
    questionLabel: { color: colors.TEXT_SUBTLE, marginBottom: 6 },
    questionText: { color: colors.TEXT_ON_LIGHT, marginBottom: 16 },
    bodyLabel: { color: colors.TEXT_SUBTLE, marginBottom: 6 },
    bodyText: { color: colors.TEXT_ON_LIGHT },
    metricsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      marginTop: 16,
      gap: 8,
    },
    metricChip: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44,
      minWidth: 44,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.PANEL_BG,
      gap: 6,
    },
    metricPending: { opacity: 0.65 },
    metricText: { color: ui.text.description ?? colors.TEXT_SUBTLE },
    deleteButton: { justifyContent: "center", minHeight: 44, paddingHorizontal: 8 },
    deleteText: { color: colors.ERROR },
  }, ui, {
    timeText: "meta", questionLabel: "meta", questionText: "description",
    bodyLabel: "description", bodyText: "body", metricText: "meta", deleteText: "button",
  }));
}
