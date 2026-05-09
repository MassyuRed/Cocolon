import React from "react";
import { Platform, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonButton from "../../components/CocolonButton";
import CocolonSwitch from "../../components/CocolonSwitch";

export default function InputActionArea({
  notificationRef,
  pieceButtonRef,
  okButtonRef,
  doNotSendEmotionNotification,
  isTutorialMode,
  registerInputInteraction,
  setSendEmotionNotification,
  handlePreviewPiece,
  canPreviewPiece,
  piecePreviewLoading,
  handleOk,
  canSubmit,
  submitting,
  styles,
  colors,
}) {
  return (
    <View style={styles.heroActionArea}>
      <View
        ref={notificationRef}
        collapsable={false}
        style={[styles.preferenceCard, styles.preferenceCardInActionArea]}
      >
        <View style={styles.preferenceRow}>
          <View style={styles.preferenceLeft}>
            <Ionicons
              name="notifications-outline"
              size={18}
              color={colors.TEXT_SUBTLE}
              style={styles.preferenceIcon}
            />
            <View style={styles.preferenceTextWrap}>
              <Text style={styles.preferenceTitle}>感情通知を送らない</Text>
              <Text style={styles.preferenceDesc}>
                オンにするとフォロー中ユーザーに通知されません。
              </Text>
            </View>
          </View>
          <CocolonSwitch
            value={doNotSendEmotionNotification}
            onValueChange={(v) => {
              if (isTutorialMode) return;
              registerInputInteraction?.();
              setSendEmotionNotification(!v);
            }}
            trackColor={{ false: "#D1D5DB", true: colors.GOLD_BUTTON }}
            thumbColor={
              Platform.OS === "android"
                ? doNotSendEmotionNotification
                  ? "#FFFFFF"
                  : "#F9FAFB"
                : undefined
            }
            ios_backgroundColor="#D1D5DB"
            disabled={isTutorialMode}
            accessibilityLabel="感情通知を送らない設定を切り替える"
          />
        </View>
      </View>

      <View ref={pieceButtonRef} collapsable={false} style={styles.buttonWrapper}>
        <CocolonButton
          variant="secondary"
          onPress={handlePreviewPiece}
          disabled={!canPreviewPiece}
          loading={piecePreviewLoading}
          accessibilityLabel="ピースを生成する"
        >
          ピースを生成する
        </CocolonButton>
      </View>

      <View ref={okButtonRef} collapsable={false} style={styles.buttonWrapper}>
        <CocolonButton
          variant="primary"
          onPress={handleOk}
          disabled={!canSubmit}
          loading={submitting}
          accessibilityLabel="この内容でOK"
        >
          この内容でOK
        </CocolonButton>
      </View>
    </View>
  );
}
