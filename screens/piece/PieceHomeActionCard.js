import React from "react";

import { MenuActionCard } from "../MenuActionCardCommon";

export default function PieceHomeActionCard({
  title,
  description,
  buttonLabel,
  buttonIconName,
  onPress,
  badgeVisible = false,
  accessibilityLabel,
}) {
  return (
    <MenuActionCard
      title={title}
      description={description}
      buttonLabel={buttonLabel}
      buttonIconName={buttonIconName}
      onPress={onPress}
      badgeVisible={badgeVisible}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
