import React from "react";
import { Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function InputToastOverlay({ message, styles, colors }) {
  if (!message) return null;
  return (
    <View pointerEvents="none" style={styles.toastOverlay}>
      <View style={styles.toastCard}>
        <Ionicons
          name="checkmark-circle-outline"
          size={20}
          color={colors.TITLE_GOLD}
          style={{ marginRight: 8 }}
        />
        <Text style={styles.toastText} numberOfLines={3}>
          {message}
        </Text>
      </View>
    </View>
  );
}
