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

function normalizeVariant(value) {
  const variant = String(value || "default").trim().toLowerCase();
  if (variant === "welcome") return "welcome";
  return "default";
}

export default function NoticeModal({
  visible,
  notice,
  loading = false,
  onClose,
  onOpenHistory,
  onPressAction,
  variant = "default",
  headerLabel = "お知らせ",
  showPublishedDate = true,
  showHistoryButton = true,
  primaryCloseLabel = null,
  onPrimaryClose,
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const normalizedVariant = normalizeVariant(variant);
  const isWelcomeVariant = normalizedVariant === "welcome";
  const title = String(notice?.title || "お知らせ").trim() || "お知らせ";
  const body = String(notice?.body || "").trim();
  const publishedLabel = formatNoticeDateLabel(notice?.published_at);
  const buttonActions = useMemo(
    () => getNoticeButtonActions(notice?.actions, notice?.cta),
    [notice?.actions, notice?.cta],
  );
  const hasButtonActions = buttonActions.length > 0;
  const canShowHistoryButton =
    showHistoryButton !== false && typeof onOpenHistory === "function";
  const resolvedPrimaryCloseLabel = String(primaryCloseLabel || "").trim();
  const canShowPrimaryClose =
    !!resolvedPrimaryCloseLabel && typeof onPrimaryClose === "function";

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
          <Pressable
            style={styles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="お知らせを閉じる"
            hitSlop={8}
          >
            <Ionicons name="close" size={18} color={colors.TEXT_ON_LIGHT} />
          </Pressable>

          <View style={styles.headerRow}>
            <Text
              style={[
                styles.badgeText,
                isWelcomeVariant ? styles.badgeTextWelcome : null,
              ]}
              numberOfLines={1}
            >
              {String(headerLabel || "お知らせ")}
            </Text>
          </View>

          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color={colors.TEXT_SUBTLE} />
              <Text style={styles.loadingText}>お知らせを読み込み中…</Text>
            </View>
          ) : (
            <View style={[styles.card, isWelcomeVariant ? styles.cardWelcome : null]}>
              <Text style={[styles.title, isWelcomeVariant ? styles.titleWelcome : null]}>
                {title}
              </Text>
              {showPublishedDate !== false && publishedLabel ? (
                <Text style={styles.metaText}>配信日: {publishedLabel}</Text>
              ) : null}

              <ScrollView
                style={[
                  styles.bodyScroll,
                  isWelcomeVariant ? styles.bodyScrollWelcome : null,
                ]}
                contentContainerStyle={styles.bodyScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <NoticeRichText
                  body={body || "現在表示できる本文はありません。"}
                  bodySegments={notice?.body_segments}
                  actions={notice?.actions}
                  onPressAction={onPressAction}
                  textStyle={[
                    styles.bodyText,
                    isWelcomeVariant ? styles.bodyTextWelcome : null,
                  ]}
                  linkStyle={[
                    styles.bodyLinkText,
                    isWelcomeVariant ? styles.bodyLinkTextWelcome : null,
                  ]}
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

              {canShowHistoryButton ? (
                <View style={styles.buttonBlock}>
                  <CocolonButton
                    variant={hasButtonActions ? "secondary" : "primary"}
                    onPress={onOpenHistory}
                    accessibilityLabel="お知らせ履歴を開く"
                  >
                    履歴で見る
                  </CocolonButton>
                </View>
              ) : null}

              {canShowPrimaryClose ? (
                <View style={styles.buttonBlock}>
                  <CocolonButton
                    variant={hasButtonActions || canShowHistoryButton ? "secondary" : "primary"}
                    onPress={onPrimaryClose}
                    accessibilityLabel={resolvedPrimaryCloseLabel}
                  >
                    {resolvedPrimaryCloseLabel}
                  </CocolonButton>
                </View>
              ) : null}
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
      paddingHorizontal: 8,
      paddingTop: 10,
      paddingBottom: 8,
      maxHeight: "82%",
    },
    closeButton: {
      position: "absolute",
      top: 10,
      right: 8,
      width: 36,
      height: 36,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
    },
    headerRow: {
      minHeight: 38,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 56,
      marginBottom: 8,
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
    cardWelcome: {
      paddingHorizontal: 18,
      paddingVertical: 18,
    },
    badgeText: {
      fontSize: 11,
      lineHeight: 16,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      textAlign: "center",
    },
    badgeTextWelcome: {
      fontSize: 18,
      lineHeight: 26,
    },
    title: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    titleWelcome: {
      fontSize: 14,
      lineHeight: 22,
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
    bodyScrollWelcome: {
      marginTop: 10,
      maxHeight: 300,
    },
    bodyScrollContent: {
      paddingBottom: 4,
    },
    bodyText: {
      fontSize: 14,
      lineHeight: 22,
      color: COLORS.TEXT_ON_LIGHT,
    },
    bodyTextWelcome: {
      fontSize: 14,
      lineHeight: 22,
    },
    bodyLinkText: {
      color: COLORS.TITLE_GOLD,
      textDecorationLine: "underline",
      fontWeight: "700",
    },
    bodyLinkTextWelcome: {
      fontWeight: "800",
    },
    buttonBlock: {
      marginTop: 12,
    },
  });
}
