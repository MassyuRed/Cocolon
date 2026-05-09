import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { ACCOUNT_WIRE } from "../../lib/compat/legacyWireContracts";

function VisibilitySettingRow({
  styles,
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
            publicActive && styles.visibilityChoiceBtnActive,
          ]}
          onPress={onPressPublic}
          activeOpacity={0.85}
          disabled={disabled || publicActive}
        >
          <Text
            style={[
              styles.visibilityChoiceText,
              publicActive && styles.visibilityChoiceTextActive,
            ]}
          >
            公開
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.visibilityChoiceBtn,
            privateActive && styles.visibilityChoiceBtnActive,
            { marginLeft: 8 },
          ]}
          onPress={onPressPrivate}
          activeOpacity={0.85}
          disabled={disabled || privateActive}
        >
          <Text
            style={[
              styles.visibilityChoiceText,
              privateActive && styles.visibilityChoiceTextActive,
            ]}
          >
            非公開
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
      <Pressable
        style={styles.modalBackdrop}
        onPress={closeAccountSettings}
      />

      <View style={styles.settingsModalCard}>
        <View style={styles.settingsModalHeader}>
          <TouchableOpacity
            style={styles.nameModalCloseBtn}
            onPress={closeAccountSettings}
            disabled={visibilitySaving}
            activeOpacity={0.8}
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
          <ActivityIndicator style={{ marginTop: 14 }} />
        ) : (
          <View style={{ marginTop: 10 }}>
            <VisibilitySettingRow
              styles={styles}
              title="ピースの公開設定"
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
              title="ランキング表示設定"
              isPublic={!!accountVisibility.is_ranking_visible}
              onPressPublic={() =>
                patchAccountVisibilityMe({ is_ranking_visible: true })
              }
              onPressPrivate={() =>
                patchAccountVisibilityMe({ is_ranking_visible: false })
              }
              disabled={visibilitySaving}
            />

            <VisibilitySettingRow
              styles={styles}
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
      </View>
    </Modal>
  );
}
