import React from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
          placeholderTextColor={ui?.text?.description ?? colors.TEXT_SUBTLE}
          value={idSearchQuery}
          onChangeText={onChangeIdSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={searchUserById}
          editable={!idSearchLoading}
        />
        <TouchableOpacity
          style={[
            styles.idSearchButton,
            idSearchLoading && styles.idSearchButtonDisabled,
          ]}
          onPress={searchUserById}
          activeOpacity={0.85}
          disabled={idSearchLoading}
          accessibilityLabel="ユーザーIDを検索"
        >
          {idSearchLoading ? (
            <ActivityIndicator size="small" color={colors.ACCENT_TEXT} />
          ) : (
            <Text style={styles.idSearchButtonText}>検索</Text>
          )}
        </TouchableOpacity>
      </View>

      {idSearchResult ? (
        <TouchableOpacity
          style={styles.idSearchResultButton}
          onPress={() => navigateToAccount(idSearchResult.userId)}
          activeOpacity={0.85}
          accessibilityLabel="検索したアカウントを開く"
        >
          <Text style={styles.idSearchResultName} numberOfLines={1}>
            {idSearchResult.displayName}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.TEXT_ON_LIGHT}
            style={{ marginLeft: 8, opacity: 0.65 }}
          />
        </TouchableOpacity>
      ) : idSearchError ? (
        <Text style={styles.idSearchErrorText}>{idSearchError}</Text>
      ) : null}
    </View>
  );
}
