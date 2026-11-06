import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonPressable from "../components/CocolonPressable";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { AnalysisMenuScroll, useAnalysisMenuStyles } from "./AnalysisMenuCommon";

function createLocalStyles(colors, ui) {
  return StyleSheet.create(applyTypographyTokens({
    group: { gap: 3 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      minHeight: 76,
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: 10,
      backgroundColor: colors.PANEL_BG,
    },
    firstRow: { borderTopLeftRadius: 24, borderTopRightRadius: 24 },
    lastRow: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    icon: {
      width: 32,
      height: 32,
      flexShrink: 0,
      borderRadius: 11,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.SURFACE_TONAL,
    },
    content: { flex: 1, minWidth: 0, gap: 2 },
    label: { color: colors.TEXT_ON_LIGHT, flexShrink: 1 },
    description: { color: colors.TEXT_SUBTLE, flexShrink: 1 },
  }, ui, { label: "button", description: "description" }));
}

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { styles, colors, ui } = useAnalysisMenuStyles();
  const localStyles = useMemo(() => createLocalStyles(colors, ui), [colors, ui]);
  const settings = [
    { title: "アプリ設定", description: "カラーテーマ・通知の受け取り方", icon: "options-outline", route: "SettingsAppSettings", accessibilityLabel: "アプリ設定を開く" },
    { title: "サブスク加入状況", description: "現在のプラン・購入の復元・契約の管理", icon: "diamond-outline", route: "SubscriptionSelect", accessibilityLabel: "サブスク加入状況を開く" },
    { title: "その他", description: "チュートリアル・ログアウト・アカウント削除", icon: "person-circle-outline", route: "SettingsOther", accessibilityLabel: "その他の設定を開く" },
  ];

  return (
    <AnalysisMenuScroll>
      <View style={styles.homeHeaderRow}>
        <View style={styles.homeTitleRow}>
          <Text style={styles.homeTitle}>設定</Text>
        </View>
      </View>

      <View style={localStyles.group}>
        {settings.map((item, index) => (
          <CocolonPressable
            key={item.route}
            style={[localStyles.row, index === 0 && localStyles.firstRow, index === settings.length - 1 && localStyles.lastRow]}
            onPress={() => navigation.navigate(item.route)}
            accessibilityLabel={item.accessibilityLabel}
          >
            <View style={localStyles.icon} accessible={false} importantForAccessibility="no-hide-descendants">
              <Ionicons name={item.icon} size={18} color={colors.ON_SURFACE_TONAL} />
            </View>
            <View style={localStyles.content}>
              <Text style={localStyles.label}>{item.title}</Text>
              <Text style={localStyles.description}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.TEXT_SUBTLE} />
          </CocolonPressable>
        ))}
      </View>
    </AnalysisMenuScroll>
  );
}

