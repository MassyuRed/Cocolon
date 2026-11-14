import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonButton from "../components/CocolonButton";
import { ScreenUnreadBadge } from "../components/UnreadBadge";
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";

export function useMenuActionCardStyles() {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  return { styles, colors, ui, themeName };
}

export function MenuActionCard({
  title,
  description,
  metaText,
  buttonLabel,
  buttonIconName,
  onPress,
  badgeVisible = false,
  accessibilityLabel,
  style,
  buttonStyle,
  compact = false,
  titleNumberOfLines,
}) {
  const { styles, colors } = useMenuActionCardStyles();

  return (
    <View style={[styles.card, compact ? styles.cardCompact : null, style]}>
      <View style={styles.titleRow}>
        <Text numberOfLines={titleNumberOfLines} style={[styles.title, compact ? styles.titleCompact : null]}>
          {title}
        </Text>
        <ScreenUnreadBadge
          visible={badgeVisible}
          style={styles.badge}
        />
      </View>

      {description ? (
        <Text style={[styles.description, compact ? styles.descriptionCompact : null]}>{description}</Text>
      ) : null}

      {metaText ? (
        <Text style={[styles.metaText, compact ? styles.metaTextCompact : null]}>{metaText}</Text>
      ) : null}

      <CocolonButton
        variant="primary"
        onPress={onPress}
        style={[styles.button, compact ? styles.buttonCompact : null, buttonStyle]}
        accessibilityLabel={accessibilityLabel || buttonLabel || `${title}を開く`}
      >
        <View style={styles.buttonRow}>
          {buttonIconName ? (
            <Ionicons name={buttonIconName} size={21} color={colors.ACCENT_TEXT} style={styles.buttonIcon} />
          ) : null}
          <Text style={[styles.buttonText, compact ? styles.buttonTextCompact : null]}>
            {buttonLabel || `${title}を開く`}
          </Text>
        </View>
      </CocolonButton>
    </View>
  );
}

function createStyles(colors, ui) {
  const text = ui?.text || {};

  return StyleSheet.create(
    applyTypographyTokens(
      {
        card: {
          borderRadius: ui.radius.card,
          borderWidth: 1,
          borderColor: colors.CARD_BORDER,
          backgroundColor: colors.FIELD_BG,
          paddingHorizontal: 20,
          paddingTop: 18,
          paddingBottom: 20,
          shadowColor: "#000",
          ...ui.shadow.float,
        },
        cardCompact: {
          borderRadius: 24,
          paddingHorizontal: 20,
          paddingTop: 17,
          paddingBottom: 18,
        },
        titleRow: {
          flexDirection: "row",
          alignItems: "center",
        },
        title: {
          flex: 1,
          fontSize: 16,
          lineHeight: 22,
          fontWeight: "800",
          color: text.primary ?? colors.TEXT_ON_LIGHT,
          letterSpacing: 0.2,
        },
        titleCompact: {
          fontSize: 15,
          lineHeight: 21,
        },
        badge: {
          marginLeft: 10,
          alignSelf: "flex-start",
        },
        description: {
          marginTop: 10,
          fontSize: 14,
          lineHeight: 21,
          color: text.description ?? colors.TEXT_ON_LIGHT,
        },
        descriptionCompact: {
          marginTop: 8,
          fontSize: 13,
          lineHeight: 20,
        },
        metaText: {
          marginTop: 8,
          fontSize: 11,
          lineHeight: 16,
          color: text.description ?? colors.TEXT_SUBTLE ?? colors.TEXT_ON_LIGHT,
        },
        metaTextCompact: {
          marginTop: 7,
        },
        button: {
          marginTop: 18,
          borderRadius: ui.radius.button,
          paddingVertical: 14,
          paddingHorizontal: 18,
          shadowColor: "#000",
          ...ui.shadow.float,
        },
        buttonCompact: {
          marginTop: 16,
          paddingVertical: 15,
        },
        buttonRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        buttonIcon: {
          marginRight: 10,
        },
        buttonText: {
          flexShrink: 1,
          textAlign: "center",
          fontSize: 16,
          lineHeight: 22,
          fontWeight: "800",
          color: colors.ACCENT_TEXT,
          letterSpacing: 0.2,
        },
        buttonTextCompact: {
          fontSize: 15,
          lineHeight: 21,
        },
      },
      ui,
      {
        title: "sectionTitle", titleCompact: "sectionTitle",
        description: "description", descriptionCompact: "description",
        metaText: "meta", buttonText: "button", buttonTextCompact: "button",
      }
    )
  );
}
