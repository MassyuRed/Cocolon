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

import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
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
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
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
      <SafeAreaProvider style={styles.backdrop}>
        <Pressable style={styles.overlayTouch} onPress={onClose} />
        <SafeAreaView edges={["top", "bottom", "left", "right"]} style={{ flex: 1, justifyContent: "center", padding: 20 }} pointerEvents="box-none">
        <View style={styles.sheet}>

          <View style={styles.headerRow}>
            <Text
              style={[
                styles.badgeText,
                isWelcomeVariant ? styles.badgeTextWelcome : null,
              ]}
            >
              {String(headerLabel || "お知らせ")}
            </Text>
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
            <ScrollView style={styles.bodyScroll} contentContainerStyle={[styles.card, isWelcomeVariant ? styles.cardWelcome : null, styles.bodyScrollContent]} showsVerticalScrollIndicator={false}>
              <Text style={[styles.title, isWelcomeVariant ? styles.titleWelcome : null]}>
                {title}
              </Text>
              {showPublishedDate !== false && publishedLabel ? (
                <Text style={styles.metaText}>配信日: {publishedLabel}</Text>
              ) : null}

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
            </ScrollView>
          )}
        </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

function createStyles(COLORS, ui) {
  return StyleSheet.create(applyTypographyTokens({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(15, 23, 42, 0.35)",
    },
    overlayTouch: {
      ...StyleSheet.absoluteFillObject,
    },
    sheet: {
      borderRadius: 24,
      overflow: "hidden",
      backgroundColor: COLORS.PANEL_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 20,
      maxHeight: "100%",
      width: "100%",
      maxWidth: 640,
      flexShrink: 1,
      alignSelf: "center",
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: {"width":0,"height":2},
      elevation: 1,
    },
    closeButton: {
      width: 44,
      height: 44,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
      flexShrink: 0,
    },
    headerRow: {
      minHeight: 44,
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 0,
      marginBottom: 16,
      flexDirection: "row",
      gap: 12,
      minWidth: 0,
    },
    loadingWrap: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 32,
      paddingHorizontal: 0,
    },
    loadingText: {
      marginTop: 10,
      color: COLORS.TEXT_SUBTLE,
    },
    card: {
      backgroundColor: "transparent",
      borderRadius: 0,
      borderWidth: 0,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 0,
      paddingVertical: 0,
      minWidth: 0,
    },
    cardWelcome: {
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    badgeText: {
      color: COLORS.TEXT_SUBTLE,
      textAlign: "left",
      flex: 1,
      minWidth: 0,
      flexShrink: 1,
    },
    badgeTextWelcome: {
      color: COLORS.TEXT_SUBTLE,
    },
    title: {
      color: COLORS.TEXT_ON_LIGHT,
      minWidth: 0,
      flexShrink: 1,
    },
    titleWelcome: {
      color: COLORS.TEXT_ON_LIGHT,
    },
    metaText: {
      marginTop: 8,
      color: COLORS.TEXT_SUBTLE,
    },
    bodyScroll: {
      marginTop: 0,
      flexShrink: 1,
    },
    bodyScrollWelcome: {
      marginTop: 0,
    },
    bodyScrollContent: {
      paddingBottom: 4,
    },
    bodyText: {
      color: COLORS.TEXT_ON_LIGHT,
    },
    bodyTextWelcome: {
      color: COLORS.TEXT_ON_LIGHT,
    },
    bodyLinkText: {
      color: COLORS.TITLE_GOLD,
      textDecorationLine: "underline",
    },
    bodyLinkTextWelcome: {
      color: COLORS.TITLE_GOLD,
      textDecorationLine: "underline",
    },
    buttonBlock: {
      marginTop: 12,
      width: "100%",
      maxWidth: 520,
      alignSelf: "center",
    },
  }, ui, {"loadingText":"description","badgeText":"description","badgeTextWelcome":"description","title":"modalTitle","titleWelcome":"modalTitle","metaText":"meta","bodyText":"body","bodyTextWelcome":"body","bodyLinkText":"body","bodyLinkTextWelcome":"body"}));
}
