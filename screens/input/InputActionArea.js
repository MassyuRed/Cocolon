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
  emlisQuestionPreference,
  handlePreviewPiece,
  canPreviewPiece,
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
            thumbColor={
              Platform.OS === "android"
                ? doNotSendEmotionNotification
                  ? "#FFFFFF"
                  : "#F9FAFB"
                : undefined
            }
            disabled={isTutorialMode}
            accessibilityLabel="感情通知を送らない設定を切り替える"
          />
        </View>
      </View>

      {!isTutorialMode ? (
        <View style={[styles.preferenceCard, styles.preferenceCardInActionArea]}>
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceLeft}>
              <Ionicons name="chatbubble-outline" size={18} color={colors.TEXT_SUBTLE} style={styles.preferenceIcon} />
              <View style={styles.preferenceTextWrap}>
                <Text style={styles.preferenceTitle}>Emlisからの問いを受け取る</Text>
                <Text style={styles.preferenceDesc}>
                  必要なときだけ、今回の記録について問いを受け取ります。
                </Text>
              </View>
            </View>
            <CocolonSwitch
              value={emlisQuestionPreference?.value === true}
              onValueChange={(value) => {
                registerInputInteraction?.();
                void emlisQuestionPreference?.setValue(value);
              }}
              disabled={!emlisQuestionPreference?.canChange || submitting}
              accessibilityLabel="Emlisからの問いを受け取る"
            />
          </View>
          {emlisQuestionPreference?.error ? (
            <View>
              <Text style={styles.preferenceDesc} accessibilityRole="alert">{emlisQuestionPreference.error}</Text>
              {emlisQuestionPreference.needsSelection ? (
                <Text style={styles.preferenceDesc}>前回の設定は未確認です。スイッチで選び直すこともできます。</Text>
              ) : null}
              <CocolonButton variant="secondary" onPress={emlisQuestionPreference.retry}
                disabled={submitting} accessibilityLabel="問いの設定を再確認する">
                再確認する
              </CocolonButton>
            </View>
          ) : null}
        </View>
      ) : null}

      {isTutorialMode ? <View ref={pieceButtonRef} collapsable={false} style={styles.buttonWrapper}>
        <CocolonButton
          variant="secondary"
          onPress={handlePreviewPiece}
          disabled={!canPreviewPiece}
          accessibilityLabel="ピースを生成する"
        >
          ピースを生成する
        </CocolonButton>
      </View> : null}

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
