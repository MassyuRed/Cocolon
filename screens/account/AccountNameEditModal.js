import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
      <Pressable style={styles.modalBackdrop} onPress={closeNameEdit} />

      <View style={styles.nameModalCard}>
        <View style={styles.nameModalHeader}>
          <Text style={styles.nameModalTitle}>ユーザー名の編集</Text>
          <TouchableOpacity
            style={styles.nameModalCloseBtn}
            onPress={closeNameEdit}
            disabled={nameSaving || nameChecking}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={20} color={colors.TEXT_ON_LIGHT} />
          </TouchableOpacity>
        </View>

        <Text style={styles.nameModalHint}>新しいユーザー名を入力してください。</Text>

        <TextInput
          style={styles.nameInput}
          placeholder="ユーザー名"
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
          <Text style={styles.nameErrorText}>{nameError}</Text>
        ) : nameChecking ? (
          <Text style={styles.nameHelperText}>ユーザー名の重複を確認しています…</Text>
        ) : (
          <Text style={styles.nameHelperText}>※ユーザー名は他ユーザーに公開されます。（{DISPLAY_NAME_MAX_LENGTH}文字まで）</Text>
        )}

        <View style={styles.nameModalActions}>
          <TouchableOpacity
            style={[styles.nameModalBtn, styles.nameModalBtnGhost]}
            onPress={closeNameEdit}
            disabled={nameSaving || nameChecking}
            activeOpacity={0.85}
          >
            <Text style={[styles.nameModalBtnText, styles.nameModalBtnGhostText]}>
              キャンセル
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nameModalBtn,
              styles.nameModalBtnPrimary,
              (nameSaving || nameChecking) && styles.nameModalBtnDisabled,
            ]}
            onPress={saveDisplayName}
            disabled={nameSaving || nameChecking}
            activeOpacity={0.85}
          >
            {nameSaving || nameChecking ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={[styles.nameModalBtnText, styles.nameModalBtnPrimaryText]}>
                保存
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
