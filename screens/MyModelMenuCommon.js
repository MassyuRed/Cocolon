import React from "react";
import { Text, View } from "react-native";

import CocolonPressable from "../components/CocolonPressable";
import UnreadBadge from "../components/UnreadBadge";
import {
  MyWebDescription,
  MyWebMediumCard,
  MyWebMenuScroll,
  MyWebSubHeader,
  useMyWebMenuStyles,
} from "./MyWebMenuCommon";

export const MyModelMenuScroll = MyWebMenuScroll;
export const MyModelSubHeader = MyWebSubHeader;
export const MyModelDescription = MyWebDescription;
export const MyModelMediumCard = MyWebMediumCard;

export function MyModelLargeCard({
  title,
  description,
  onPress,
  badgeVisible = false,
  accessibilityLabel,
  style,
}) {
  const { styles } = useMyWebMenuStyles();

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
            <UnreadBadge
              visible={badgeVisible}
              variant="new"
              label="NEW"
              style={styles.largeCardBadge}
            />
          </View>
          <Text style={styles.largeCardDescription}>{description}</Text>
        </View>
      </View>
    </CocolonPressable>
  );
}
