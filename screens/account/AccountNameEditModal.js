import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CocolonButton from "../../components/CocolonButton";
import Ionicons from "react-native-vector-icons/Ionicons";

import { DISPLAY_NAME_MAX_LENGTH } from "./accountModel";

export default function AccountNameEditModal({
  visible,
  styles,
  colors,
  ui,
  nameDraft,
  setNameDraft,
  nameSaving,
  nameChecking,
  nameError,
  setNameError,
  closeNameEdit,
  saveDisplayName,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={closeNameEdit}
    >
      <SafeAreaProvider style={{ flex: 1 }}>
      <Pressable style={styles.modalBackdrop} onPress={closeNameEdit} />

      <SafeAreaView edges={["top", "right", "bottom", "left"]} style={{ flex: 1 }} pointerEvents="box-none">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} pointerEvents="box-none">
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }} pointerEvents="box-none">
      <View style={styles.nameModalCard} accessibilityViewIsModal>
      <ScrollView style={{ flexShrink: 1 }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 4 }}>
        <View style={styles.nameModalHeader}>
          <Text style={styles.nameModalTitle}>ユーザー名の編集</Text>
          <TouchableOpacity
            style={styles.nameModalCloseBtn}
            onPress={closeNameEdit}
            disabled={nameSaving || nameChecking}
            activeOpacity={0.8}
            accessibilityRole="button" accessibilityLabel="ユーザー名の編集を閉じる"
          >
            <Ionicons name="close" size={20} color={colors.TEXT_ON_LIGHT} />
          </TouchableOpacity>
        </View>

        <Text style={styles.nameModalHint}>ユーザー名は他のユーザーに公開されます。</Text>
        <Text style={styles.nameModalHint}>新しいユーザー名</Text>

        <TextInput
          style={styles.nameInput}
          placeholder="ユーザー名"
          accessibilityLabel="新しいユーザー名"
          placeholderTextColor={ui?.text?.description ?? colors.TEXT_SUBTLE}
          value={nameDraft}
          onChangeText={(value) => {
            setNameDraft(value);
            if (nameError) setNameError("");
          }}
          editable={!nameSaving && !nameChecking}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={DISPLAY_NAME_MAX_LENGTH}
          returnKeyType="done"
          onSubmitEditing={saveDisplayName}
        />

        {nameError ? (
          <Text style={styles.nameErrorText} accessibilityRole="alert">{nameError}</Text>
        ) : nameChecking ? (
          <Text style={styles.nameHelperText} accessibilityLiveRegion="polite">ユーザー名の重複を確認しています…</Text>
        ) : (
          <Text style={styles.nameHelperText}>{DISPLAY_NAME_MAX_LENGTH}文字まで入力できます。</Text>
        )}

        <View style={styles.nameModalActions}>
          <CocolonButton variant="primary" title="保存" onPress={saveDisplayName}
            loading={nameSaving || nameChecking} disabled={nameSaving || nameChecking} />
          <CocolonButton variant="secondary" title="キャンセル" onPress={closeNameEdit}
            disabled={nameSaving || nameChecking} />
        </View>
      </ScrollView>
      </View>
      </View>
      </KeyboardAvoidingView></SafeAreaView></SafeAreaProvider>
    </Modal>
  );
}
