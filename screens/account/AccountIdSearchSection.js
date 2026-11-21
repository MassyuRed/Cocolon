import React from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CocolonButton from "../../components/CocolonButton";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function AccountIdSearchSection({
  styles,
  colors,
  ui,
  idSearchQuery,
  idSearchLoading,
  idSearchResult,
  idSearchError,
  onChangeIdSearchQuery,
  searchUserById,
  navigateToAccount,
}) {
  return (
    <View style={styles.idSearchSection}>
      <Text style={styles.statusTitle}>ID検索</Text>
      <View style={styles.idSearchRow}>
        <TextInput
          style={styles.idSearchInput}
          placeholder="ユーザーID"
          accessibilityLabel="検索するユーザーID"
          placeholderTextColor={ui?.text?.description ?? colors.TEXT_SUBTLE}
          value={idSearchQuery}
          onChangeText={onChangeIdSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={searchUserById}
          editable={!idSearchLoading}
        />
        <CocolonButton variant="primary" title="検索" loading={idSearchLoading}
          style={[styles.idSearchButton, idSearchLoading && styles.idSearchButtonDisabled]}
          onPress={searchUserById} disabled={idSearchLoading} accessibilityLabel="ユーザーIDを検索" />
      </View>

      {idSearchResult ? (
        <TouchableOpacity
          style={styles.idSearchResultButton}
          onPress={() => navigateToAccount(idSearchResult.userId)}
          activeOpacity={0.85}
          accessibilityLabel="検索したアカウントを開く"
        >
          <Text style={styles.idSearchResultName}>
            {idSearchResult.displayName}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.TEXT_ON_LIGHT}
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      ) : idSearchError ? (
        <Text style={styles.idSearchErrorText}>{idSearchError}</Text>
      ) : null}
    </View>
  );
}
