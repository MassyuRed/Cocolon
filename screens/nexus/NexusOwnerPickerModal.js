import React from "react";
import { Modal, ScrollView, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonButton from "../../components/CocolonButton";
import CocolonPressable from "../../components/CocolonPressable";
import { OWNER_FILTER_ALL, OWNER_FILTER_SELF, OWNER_FILTER_USER } from "./nexusRouteModel";

export default function NexusOwnerPickerModal({
  visible,
  onClose,
  styles,
  colors,
  ownerPickerOptions,
  ownerFilterMode,
  ownerFilterUserId,
  handleSelectOwnerOption,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.pickerBackdrop}>
        <View style={styles.pickerCard}>
          <View style={styles.pickerHeader}><Text style={styles.pickerTitle}>表示ユーザー</Text></View>
          <ScrollView style={styles.pickerScroll} contentContainerStyle={styles.pickerScrollContent}>
            {ownerPickerOptions.map((option) => {
              const isActive =
                (option.mode === OWNER_FILTER_ALL && ownerFilterMode === OWNER_FILTER_ALL) ||
                (option.mode === OWNER_FILTER_SELF && ownerFilterMode === OWNER_FILTER_SELF) ||
                (option.mode === OWNER_FILTER_USER && ownerFilterMode === OWNER_FILTER_USER && String(option.userId || "").trim() === String(ownerFilterUserId || "").trim());
              return (
                <CocolonPressable key={option.key} style={[styles.pickerOption, isActive && styles.pickerOptionActive]} onPress={() => handleSelectOwnerOption(option)} accessibilityLabel={`${option.label}のピースを表示する`}>
                  <View style={styles.pickerOptionTextWrap}>
                    <Text style={[styles.pickerOptionText, isActive && styles.pickerOptionTextActive]}>{option.label}</Text>
                    {option.meta ? <Text style={[styles.pickerOptionMeta, isActive && styles.pickerOptionMetaActive]}>{option.meta}</Text> : null}
                  </View>
                  {isActive ? <Ionicons name="checkmark" size={18} color={colors.TITLE_GOLD} /> : null}
                </CocolonPressable>
              );
            })}
          </ScrollView>
          <View style={styles.pickerActionRow}>
            <CocolonButton variant="secondary" onPress={onClose} accessibilityLabel="表示ユーザー選択を閉じる">閉じる</CocolonButton>
          </View>
        </View>
      </View>
    </Modal>
  );
}
