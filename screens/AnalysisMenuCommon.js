import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CocolonBackButton from "../components/CocolonBackButton";
import CocolonPressable from "../components/CocolonPressable";
import { ScreenUnreadBadge } from "../components/UnreadBadge";
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";

export function useAnalysisMenuStyles() {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  return { styles, colors, ui, themeName };
}

export function AnalysisMenuScroll({ children, scrollRef, onScroll }) {
  const { styles } = useAnalysisMenuStyles();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={[
        styles.scrollContainer,
        { paddingBottom: 24 + (insets?.bottom || 0) },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={16}
      onScroll={onScroll}
    >
      {children}
    </ScrollView>
  );
}

export function AnalysisSubHeader({ title, onBack }) {
  const { styles, colors } = useAnalysisMenuStyles();

  return (
    <View style={styles.subHeaderRow}>
      <View style={styles.subHeaderSide}>
        <CocolonBackButton
          onPress={onBack}
          style={styles.backButton}
          accessibilityLabel={`${title}から戻る`}
        />
      </View>

      <Text style={[styles.subHeaderTitle, { color: colors.TITLE_GOLD }]} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.subHeaderSide} />
    </View>
  );
}

export function AnalysisDescription({ children }) {
  const { styles } = useAnalysisMenuStyles();

  return <Text style={styles.descriptionText}>{children}</Text>;
}

export function AnalysisLargeCard({
  title,
  description,
  updateLabel,
  onPress,
  badgeVisible = false,
  accessibilityLabel,
}) {
  const { styles } = useAnalysisMenuStyles();

  return (
    <CocolonPressable
      style={styles.largeCard}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel || title}
    >
      <View style={styles.largeCardContent}>
        <View>
          <View style={styles.cardTitleRow}>
            <Text numberOfLines={1} style={styles.largeCardTitle}>
              {title}
            </Text>
            <ScreenUnreadBadge
              visible={badgeVisible}
              style={styles.largeCardBadge}
            />
          </View>
          <Text style={styles.largeCardDescription}>{description}</Text>
        </View>

        <Text style={styles.largeCardUpdate}>{updateLabel}</Text>
      </View>
    </CocolonPressable>
  );
}

export function AnalysisMediumCard({
  title,
  description,
  onPress,
  badgeVisible = false,
  chevron = "forward",
  accessibilityLabel,
}) {
  const { styles } = useAnalysisMenuStyles();

  const iconName =
    chevron === "down"
      ? "chevron-down"
      : chevron === "up"
        ? "chevron-up"
        : "chevron-forward";

  return (
    <CocolonPressable
      style={styles.mediumCard}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel || title}
    >
      <View style={styles.mediumCardContent}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.mediumCardTitle}>{title}</Text>
          <ScreenUnreadBadge
            visible={badgeVisible}
            style={styles.mediumCardBadge}
          />
          <Ionicons name={iconName} size={18} style={styles.chevronIcon} />
        </View>
        <Text style={styles.mediumCardDescription}>{description}</Text>
      </View>
    </CocolonPressable>
  );
}

export function AnalysisOptionRow({
  label,
  meta,
  onPress,
  badgeVisible = false,
  accessibilityLabel,
}) {
  const { styles } = useAnalysisMenuStyles();

  return (
    <CocolonPressable
      style={styles.optionRow}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel || label}
    >
      <View style={styles.optionRowInner}>
        <View style={styles.optionLabelWrap}>
          <Text style={styles.optionLabel}>{label}</Text>
          <ScreenUnreadBadge
            visible={badgeVisible}
            style={styles.optionBadge}
          />
        </View>

        <View style={styles.optionMetaWrap}>
          {meta ? <Text style={styles.optionMeta}>{meta}</Text> : null}
          <Ionicons name="chevron-forward" size={18} style={styles.chevronIcon} />
        </View>
      </View>
    </CocolonPressable>
  );
}

function createStyles(colors, ui) {
  const text = ui?.text || {};

  return StyleSheet.create(
    applyTypographyTokens(
      {
        scrollContainer: {
          paddingTop: 16,
          paddingHorizontal: 20,
        },

        homeHeaderRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        },
        homeTitleRow: {
          flexDirection: "row",
          alignItems: "center",
        },
        homeTitle: {
          fontSize: 26,
          lineHeight: 32,
          fontWeight: "800",
          letterSpacing: 0.8,
          color: colors.TITLE_GOLD,
        },
        guideButton: {
          width: 36,
          height: 32,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.FIELD_BG,
          borderWidth: 1,
          borderColor: colors.CARD_BORDER,
          marginLeft: 10,
        },

        subHeaderRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        },
        subHeaderSide: {
          width: 70,
          alignItems: "flex-start",
          justifyContent: "center",
        },
        backButton: {
          paddingHorizontal: 4,
          paddingVertical: 4,
        },
        subHeaderTitle: {
          flex: 1,
          textAlign: "center",
          fontSize: 26,
          lineHeight: 32,
          fontWeight: "800",
          letterSpacing: 0.6,
        },

        descriptionText: {
          fontSize: 13,
          lineHeight: 20,
          color: text.description ?? colors.TEXT_ON_LIGHT,
          marginBottom: 20,
        },

        summaryBlock: {
          marginBottom: 14,
        },
        summaryInner: {
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: colors.CARD_BORDER,
          paddingVertical: 8,
        },
        summaryHeaderRow: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 4,
        },
        summaryIcon: {
          marginRight: 6,
        },
        summaryLabel: {
          fontSize: 11,
          fontWeight: "800",
          letterSpacing: 0.3,
          color: text.primary ?? colors.TEXT_ON_LIGHT,
        },
        summaryText: {
          fontSize: 12,
          lineHeight: 18,
          color: text.primary ?? colors.TEXT_ON_LIGHT,
          marginBottom: 2,
        },

        largeCard: {
          minHeight: 126,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: colors.BORDER_GOLD,
          backgroundColor: colors.FIELD_BG,
          paddingHorizontal: 20,
          paddingVertical: 18,
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 6 },
          elevation: 5,
        },
        largeCardContent: {
          flex: 1,
          justifyContent: "space-between",
        },
        cardTitleRow: {
          flexDirection: "row",
          alignItems: "center",
        },
        largeCardTitle: {
          flex: 1,
          fontSize: 22,
          lineHeight: 30,
          fontWeight: "900",
          color: text.primary ?? colors.TEXT_ON_LIGHT,
          letterSpacing: 0.2,
          includeFontPadding: true,
          marginRight: 8,
          paddingBottom: 1,
        },
        largeCardBadge: {
          marginLeft: 8,
          alignSelf: "flex-start",
        },
        largeCardDescription: {
          marginTop: 10,
          fontSize: 13,
          lineHeight: 19,
          color: text.description ?? colors.TEXT_ON_LIGHT,
        },
        largeCardUpdate: {
          marginTop: 12,
          fontSize: 11,
          lineHeight: 16,
          color: text.description ?? colors.TEXT_ON_LIGHT,
        },

        mediumCard: {
          minHeight: 78,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.CARD_BORDER,
          backgroundColor: colors.FIELD_BG,
          paddingHorizontal: 18,
          paddingVertical: 15,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        },
        mediumCardContent: {
          flex: 1,
          justifyContent: "center",
        },
        mediumCardTitle: {
          flex: 1,
          fontSize: 21,
          fontWeight: "800",
          color: text.primary ?? colors.TEXT_ON_LIGHT,
        },
        mediumCardBadge: {
          marginLeft: 8,
          marginRight: 10,
        },
        mediumCardDescription: {
          marginTop: 6,
          fontSize: 13,
          lineHeight: 18,
          color: text.description ?? colors.TEXT_ON_LIGHT,
        },
        chevronIcon: {
          color: colors.TEXT_SUBTLE,
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
        optionRowInner: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        optionLabelWrap: {
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
          paddingRight: 12,
        },
        optionLabel: {
          fontSize: 18,
          fontWeight: "700",
          color: text.primary ?? colors.TEXT_ON_LIGHT,
        },
        optionBadge: {
          marginLeft: 8,
        },
        optionMetaWrap: {
          flexDirection: "row",
          alignItems: "center",
        },
        optionMeta: {
          fontSize: 12,
          lineHeight: 16,
          color: text.description ?? colors.TEXT_ON_LIGHT,
          marginRight: 8,
        },
      },
      ui
    )
  );
}
