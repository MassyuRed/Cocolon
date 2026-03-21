import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useTheme } from "../theme/ThemeContext";
import { getNoticeButtonActions } from "../lib/noticeActionRuntime";
import CocolonButton from "./CocolonButton";
import NoticeRichText from "./NoticeRichText";

function formatNoticeDateLabel(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const dt = new Date(raw);
    if (Number.isNaN(dt.getTime())) return raw;
    const yyyy = dt.getFullYear();
    const mm = `${dt.getMonth() + 1}`.padStart(2, "0");
    const dd = `${dt.getDate()}`.padStart(2, "0");
    return `${yyyy}.${mm}.${dd}`;
  } catch {
    return raw;
  }
}

export default function NoticeModal({
  visible,
  notice,
  loading = false,
  onClose,
  onOpenHistory,
  onPressAction,
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const title = String(notice?.title || "お知らせ").trim() || "お知らせ";
  const body = String(notice?.body || "").trim();
  const publishedLabel = formatNoticeDateLabel(notice?.published_at);
  const buttonActions = useMemo(
    () => getNoticeButtonActions(notice?.actions, notice?.cta),
    [notice?.actions, notice?.cta],
  );
  const hasButtonActions = buttonActions.length > 0;

  return (
    <Modal
      visible={!!visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.overlayTouch} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.closeRow}>
            <Pressable
              style={styles.closeButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="お知らせを閉じる"
              hitSlop={8}
            >
              <Ionicons name="close" size={18} color={colors.TEXT_ON_LIGHT} />
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color={colors.TEXT_SUBTLE} />
              <Text style={styles.loadingText}>お知らせを読み込み中…</Text>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.badgeText}>お知らせ</Text>
              <Text style={styles.title}>{title}</Text>
              {publishedLabel ? (
                <Text style={styles.metaText}>配信日: {publishedLabel}</Text>
              ) : null}

              <ScrollView
                style={styles.bodyScroll}
                contentContainerStyle={styles.bodyScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <NoticeRichText
                  body={body || "現在表示できる本文はありません。"}
                  bodySegments={notice?.body_segments}
                  actions={notice?.actions}
                  onPressAction={onPressAction}
                  textStyle={styles.bodyText}
                  linkStyle={styles.bodyLinkText}
                />
              </ScrollView>

              {buttonActions.map((action, index) => (
                <View
                  key={`${String(action?.key || action?.label || index)}-${index}`}
                  style={styles.buttonBlock}
                >
                  <CocolonButton
                    variant={index === 0 ? "primary" : "secondary"}
                    onPress={() => onPressAction?.(action)}
                    accessibilityLabel={String(action?.label || "")}
                  >
                    {String(action?.label || "")}
                  </CocolonButton>
                </View>
              ))}

              <View style={styles.buttonBlock}>
                <CocolonButton
                  variant={hasButtonActions ? "secondary" : "primary"}
                  onPress={onOpenHistory}
                  accessibilityLabel="お知らせ履歴を開く"
                >
                  履歴で見る
                </CocolonButton>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

function createStyles(COLORS) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(15, 23, 42, 0.35)",
      justifyContent: "center",
      paddingHorizontal: 18,
    },
    overlayTouch: {
      ...StyleSheet.absoluteFillObject,
    },
    sheet: {
      borderRadius: 24,
      overflow: "hidden",
      backgroundColor: COLORS.PANEL_BG,
      borderWidth: 1,
      borderColor: COLORS.BORDER_GOLD,
      padding: 8,
      maxHeight: "82%",
    },
    closeRow: {
      alignItems: "flex-end",
      marginBottom: 4,
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      alignItems: "center",
      justifyContent: "center",
    },
    loadingWrap: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 32,
      paddingHorizontal: 20,
    },
    loadingText: {
      marginTop: 10,
      fontSize: 13,
      color: COLORS.TEXT_ON_LIGHT,
    },
    card: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    badgeText: {
      fontSize: 11,
      lineHeight: 16,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      marginBottom: 8,
    },
    title: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    metaText: {
      marginTop: 8,
      fontSize: 11,
      lineHeight: 16,
      color: COLORS.TEXT_ON_LIGHT,
    },
    bodyScroll: {
      marginTop: 12,
      maxHeight: 260,
    },
    bodyScrollContent: {
      paddingBottom: 4,
    },
    bodyText: {
      fontSize: 14,
      lineHeight: 22,
      color: COLORS.TEXT_ON_LIGHT,
    },
    bodyLinkText: {
      color: COLORS.TITLE_GOLD,
      textDecorationLine: "underline",
      fontWeight: "700",
    },
    buttonBlock: {
      marginTop: 12,
    },
  });
}
