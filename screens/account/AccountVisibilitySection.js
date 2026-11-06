import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

import { ACCOUNT_WIRE } from "../../lib/compat/legacyWireContracts";

function VisibilitySettingRow({
  styles,
  colors,
  title,
  description,
  isPublic,
  onPressPublic,
  onPressPrivate,
  disabled,
}) {
  const publicActive = !!isPublic;
  const privateActive = !isPublic;

  return (
    <View style={styles.visibilityRow}>
      <View style={styles.visibilityLeft}>
        <Text style={styles.visibilityTitle}>{title}</Text>
        {description ? (
          <Text style={styles.visibilityDesc}>{description}</Text>
        ) : null}
      </View>

      <View style={styles.visibilityRight}>
        <TouchableOpacity
          style={[
            styles.visibilityChoiceBtn,
            disabled && { backgroundColor: colors.FIELD_BG, borderColor: colors.CARD_BORDER },
            publicActive && styles.visibilityChoiceBtnActive,
          ]}
          onPress={onPressPublic}
          activeOpacity={0.85}
          disabled={disabled || publicActive}
          accessibilityRole="button" accessibilityLabel={`${title}：公開`} accessibilityState={{ selected: publicActive, disabled: disabled || publicActive }}
        >
          <Text
            style={[
              styles.visibilityChoiceText,
              disabled && { color: colors.TEXT_SUBTLE },
              publicActive && styles.visibilityChoiceTextActive,
            ]}
          >
            {publicActive ? "✓ " : ""}公開
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.visibilityChoiceBtn,
            disabled && { backgroundColor: colors.FIELD_BG, borderColor: colors.CARD_BORDER },
            privateActive && styles.visibilityChoiceBtnActive,
          ]}
          onPress={onPressPrivate}
          activeOpacity={0.85}
          disabled={disabled || privateActive}
          accessibilityRole="button" accessibilityLabel={`${title}：非公開`} accessibilityState={{ selected: privateActive, disabled: disabled || privateActive }}
        >
          <Text
            style={[
              styles.visibilityChoiceText,
              disabled && { color: colors.TEXT_SUBTLE },
              privateActive && styles.visibilityChoiceTextActive,
            ]}
          >
            {privateActive ? "✓ " : ""}非公開
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AccountVisibilitySection({
  visible,
  styles,
  colors,
  accountVisibility,
  visibilityLoading,
  visibilitySaving,
  closeAccountSettings,
  patchAccountVisibilityMe,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={closeAccountSettings}
    >
      <SafeAreaProvider style={{ flex: 1 }}>
      <Pressable
        style={styles.modalBackdrop}
        onPress={closeAccountSettings}
      />

      <SafeAreaView edges={["top", "right", "bottom", "left"]} style={{ flex: 1 }} pointerEvents="box-none">
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }} pointerEvents="box-none">
      <View style={styles.settingsModalCard} accessibilityViewIsModal>
      <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingBottom: 4 }}>
        <View style={styles.settingsModalHeader}>
          <TouchableOpacity
            style={styles.nameModalCloseBtn}
            onPress={closeAccountSettings}
            disabled={visibilitySaving}
            activeOpacity={0.8}
            accessibilityRole="button" accessibilityLabel="アカウントの設定を閉じる"
          >
            <Ionicons name="close" size={20} color={colors.TEXT_ON_LIGHT} />
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 10, alignItems: "center" }}>
            <Text style={styles.settingsModalTitle}>アカウントの設定</Text>
          </View>

          {visibilitySaving ? (
            <ActivityIndicator
              size="small"
              color={colors.TITLE_GOLD}
              style={styles.modalHeaderSpinner}
            />
          ) : null}
        </View>

        {visibilityLoading ? (
          <ActivityIndicator color={colors.TITLE_GOLD} style={{ marginTop: 14 }} accessibilityLabel="公開設定を読込中" />
        ) : (
          <View style={{ marginTop: 10 }}>
            <VisibilitySettingRow
              styles={styles}
              colors={colors}
              title="アカウントの公開設定"
              description="非公開にすると、フォロー時に承認が必要になります。おすすめにも表示されなくなります"
              isPublic={!accountVisibility.is_private_account}
              onPressPublic={() =>
                patchAccountVisibilityMe({
                  is_private_account: false,
                  is_recommendation_enabled: true,
                })
              }
              onPressPrivate={() =>
                patchAccountVisibilityMe({
                  is_private_account: true,
                  is_recommendation_enabled: false,
                })
              }
              disabled={visibilitySaving}
            />


            <VisibilitySettingRow
              styles={styles}
              colors={colors}
              title="ユーザーID表示設定"
              isPublic={!!accountVisibility.is_share_code_public}
              onPressPublic={() =>
                patchAccountVisibilityMe({ [ACCOUNT_WIRE.fields.shareCodePublic]: true })
              }
              onPressPrivate={() =>
                patchAccountVisibilityMe({ [ACCOUNT_WIRE.fields.shareCodePublic]: false })
              }
              disabled={visibilitySaving}
            />
          </View>
        )}
      </ScrollView></View></View></SafeAreaView></SafeAreaProvider>
    </Modal>
  );
}
