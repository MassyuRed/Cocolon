import React from "react";
import { Text, View } from "react-native";

import CocolonPressable from "../components/CocolonPressable";
import { ScreenUnreadBadge } from "../components/UnreadBadge";
import {
  AnalysisDescription,
  AnalysisMediumCard,
  AnalysisMenuScroll,
  AnalysisSubHeader,
  useAnalysisMenuStyles,
} from "./AnalysisMenuCommon";

export const PieceMenuScroll = AnalysisMenuScroll;
export const PieceSubHeader = AnalysisSubHeader;
export const PieceDescription = AnalysisDescription;
export const PieceMediumCard = AnalysisMediumCard;

export function PieceLargeCard({
  title,
  description,
  onPress,
  badgeVisible = false,
  accessibilityLabel,
  style,
}) {
  const { styles } = useAnalysisMenuStyles();

  return (
    <CocolonPressable
      style={[styles.largeCard, style]}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel || title}
    >
      <View style={[styles.largeCardContent, { justifyContent: "center" }]}>
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
      </View>
    </CocolonPressable>
  );
}
