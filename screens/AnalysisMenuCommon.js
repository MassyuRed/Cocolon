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
        { paddingBottom: 24 + (insets?.bottom || 0), paddingLeft: 20 + (insets?.left || 0), paddingRight: 20 + (insets?.right || 0) },
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

      <Text style={[styles.subHeaderTitle, { color: colors.TITLE_GOLD }]}>
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
            <Text style={styles.largeCardTitle}>
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
      accessibilityState={chevron === "down" || chevron === "up" ? { expanded: chevron === "up" } : undefined}
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
      width: "100%",
      maxWidth: 680,
      alignSelf: "center",
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
      minWidth: 0,
      flexShrink: 1,
    },
        homeTitle: {
      letterSpacing: 0,
      color: colors.TITLE_GOLD,
      flexShrink: 1,
      minWidth: 0,
    },
        guideButton: {
          width: 44,
          height: 44,
          borderRadius: 22,
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
      width: 44,
      alignItems: "flex-start",
      justifyContent: "center",
      flexShrink: 0,
    },
        backButton: {
      paddingHorizontal: 4,
      paddingVertical: 4,
      minWidth: 44,
      minHeight: 44,
    },
        subHeaderTitle: {
      flex: 1,
      textAlign: "center",
      letterSpacing: 0,
      minWidth: 0,
      flexShrink: 1,
      marginHorizontal: 8,
    },

        descriptionText: {
      color: text.description ?? colors.TEXT_SUBTLE,
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
      letterSpacing: 0.3,
      color: text.primary ?? colors.TEXT_ON_LIGHT,
      flexShrink: 1,
    },
        summaryText: {
      color: text.primary ?? colors.TEXT_ON_LIGHT,
      marginBottom: 2,
      flexShrink: 1,
    },

        largeCard: {
      minHeight: 126,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      backgroundColor: colors.FIELD_BG,
      paddingHorizontal: 20,
      paddingVertical: 20,
      shadowColor: "#000",
      shadowOpacity: ui.shadow.float.shadowOpacity,
      shadowRadius: ui.shadow.float.shadowRadius,
      shadowOffset: ui.shadow.float.shadowOffset,
      elevation: ui.shadow.float.elevation,
    },
        largeCardContent: {
          flex: 1,
          justifyContent: "space-between",
        },
        cardTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      minWidth: 0,
    },
        largeCardTitle: {
      flex: 1,
      color: text.primary ?? colors.TEXT_ON_LIGHT,
      letterSpacing: 0.2,
      includeFontPadding: true,
      marginRight: 8,
      paddingBottom: 1,
      minWidth: 0,
      flexShrink: 1,
    },
        largeCardBadge: {
      marginLeft: 8,
      alignSelf: "flex-start",
      flexShrink: 0,
    },
        largeCardDescription: {
      marginTop: 10,
      color: text.description ?? colors.TEXT_SUBTLE,
    },
        largeCardUpdate: {
      marginTop: 12,
      color: text.description ?? colors.TEXT_SUBTLE,
    },

        mediumCard: {
      minHeight: 88,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      backgroundColor: colors.FIELD_BG,
      paddingHorizontal: 20,
      paddingVertical: 20,
      shadowColor: "#000",
      shadowOpacity: ui.shadow.float.shadowOpacity,
      shadowRadius: ui.shadow.float.shadowRadius,
      shadowOffset: ui.shadow.float.shadowOffset,
      elevation: ui.shadow.float.elevation,
    },
        mediumCardContent: {
          flex: 1,
          justifyContent: "center",
        },
        mediumCardTitle: {
      flex: 1,
      color: text.primary ?? colors.TEXT_ON_LIGHT,
      minWidth: 0,
      flexShrink: 1,
    },
        mediumCardBadge: {
      marginLeft: 8,
      marginRight: 10,
      flexShrink: 0,
    },
        mediumCardDescription: {
      marginTop: 6,
      color: text.description ?? colors.TEXT_SUBTLE,
    },
        chevronIcon: {
          color: text.description ?? colors.TEXT_SUBTLE,
        },

        optionRow: {
      marginLeft: 0,
      minHeight: 60,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      backgroundColor: colors.FIELD_BG,
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
        optionRowInner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minWidth: 0,
      flexWrap: "wrap",
      rowGap: 8,
    },
        optionLabelWrap: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      paddingRight: 12,
      minWidth: 0,
    },
        optionLabel: {
      color: text.primary ?? colors.TEXT_ON_LIGHT,
      flex: 1,
      minWidth: 0,
      flexShrink: 1,
    },
        optionBadge: {
      marginLeft: 8,
      flexShrink: 0,
    },
        optionMetaWrap: {
      flexDirection: "row",
      alignItems: "center",
      minWidth: 0,
      flexShrink: 1,
    },
        optionMeta: {
      color: text.description ?? colors.TEXT_SUBTLE,
      marginRight: 8,
      minWidth: 0,
      flexShrink: 1,
    },
      },
      ui, {"homeTitle":"screenTitle","subHeaderTitle":"screenTitle","descriptionText":"description","summaryLabel":"description","summaryText":"description","largeCardTitle":"sectionTitle","largeCardDescription":"description","largeCardUpdate":"meta","mediumCardTitle":"sectionTitle","mediumCardDescription":"description","optionLabel":"button","optionMeta":"meta"}
    )
  );
}

