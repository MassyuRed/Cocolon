import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonPressable from "../../components/CocolonPressable";

function ProfileRow({ styles, label, labelAction, value, onPress, disabled }) {
  const valueNode =
    typeof value === "string" || typeof value === "number" ? (
      <Text style={styles.profileRowValue}>{String(value)}</Text>
    ) : (
      value
    );

  const inner = (
    <>
      <View style={styles.kvRowTop}>
        <Text style={styles.statusRowLabel}>{label}</Text>
        {labelAction ? labelAction : null}
      </View>
      <View style={styles.kvRowBottom}>
        {valueNode}
      </View>
    </>
  );

  if (typeof onPress === "function") {
    return (
      <TouchableOpacity
        style={styles.statusRow}
        activeOpacity={0.7}
        onPress={onPress}
        disabled={!!disabled}
        accessibilityRole="button"
      >
        {inner}
      </TouchableOpacity>
    );
  }

  return <View style={styles.statusRow}>{inner}</View>;
}

export default function AccountProfileSection({
  styles,
  colors,
  ui,
  user,
  isSelf,
  loading,
  nameSaving,
  displayName,
  shareCode,
  userIdForDisplay,
  isPrivateAccount,
  canShowShareCode,
  followingCount,
  followerCount,
  followCountLoading,
  isFollowing,
  isFollowRequested,
  followActionLoading,
  targetUserId,
  openNameEdit,
  onCopyShareCode,
  onShareProfile,
  openAccountSettings,
  onToggleFollow,
  openFollowList,
}) {
  const followForeground = loading || followActionLoading ? colors.TEXT_SUBTLE : isFollowing || isFollowRequested ? colors.ON_SURFACE_TONAL : colors.ACCENT_TEXT;
  return (
    <>
      {isSelf ? (
        <View
          style={[styles.profileActionRow, { justifyContent: "flex-end" }]}
        >
          <CocolonPressable
            style={[
              styles.accountSettingsBtn,
              (loading || !user) && styles.accountSettingsBtnDisabled,
            ]}
            onPress={onShareProfile}
            disabled={loading || !user}
            accessibilityLabel="プロフィールURLを共有"
          >
            <Ionicons
              name="share-outline"
              size={20}
              color={colors.TEXT_ON_LIGHT}
            />
          </CocolonPressable>

          <CocolonPressable
            style={[
              styles.accountSettingsBtn,
              (loading || !user) && styles.accountSettingsBtnDisabled,
            ]}
            onPress={openAccountSettings}
            disabled={loading || !user}
            accessibilityLabel="アカウント設定"
          >
            <Ionicons
              name="settings-outline"
              size={20}
              color={colors.TEXT_ON_LIGHT}
            />
          </CocolonPressable>
        </View>
      ) : user ? (
        <TouchableOpacity
          style={[
            styles.followBtn,
            (isFollowing || isFollowRequested) && styles.followBtnFollowing,
            { marginTop: 0, marginBottom: 16 },
            (loading || followActionLoading) && styles.editNameBtnDisabled,
          ]}
          onPress={onToggleFollow}
          activeOpacity={0.85}
          disabled={loading || followActionLoading || isFollowRequested}
          accessibilityRole="button" accessibilityState={{ disabled: loading || followActionLoading || isFollowRequested, busy: followActionLoading, selected: isFollowing || isFollowRequested }}
          accessibilityLabel={
            isFollowing ? "フォロー解除" : isFollowRequested ? "申請中" : "フォローする"
          }
        >
          {followActionLoading ? (
            <ActivityIndicator
              size="small"
              color={followForeground}
              style={{ marginRight: 6 }}
            />
          ) : (
            <Ionicons
              name={
                isFollowing
                  ? "checkmark"
                  : isFollowRequested
                  ? "time-outline"
                  : "person-add-outline"
              }
              size={18}
              color={followForeground}
              style={{ marginRight: 6 }}
            />
          )}
          <Text
            style={[
              styles.followBtnText,
              !isFollowing && !isFollowRequested && styles.followBtnTextOnGold,
              { color: followForeground },
            ]}
          >
            {isFollowing ? "フォロー中" : isFollowRequested ? "申請中" : "フォローする"}
          </Text>
        </TouchableOpacity>
      ) : null}

      <View style={styles.infoSection}>
        <Text style={styles.statusTitle}>プロフィール</Text>

        <View style={styles.statusCard}>
          <ProfileRow
            styles={styles}
            label="ユーザー名"
            labelAction={
              isSelf && user ? (
                <Pressable
                  style={[
                    styles.labelIconBtn,
                    (loading || nameSaving) && styles.labelIconBtnDisabled,
                  ]}
                  onPress={openNameEdit}
                  disabled={loading || nameSaving}
                  accessibilityLabel="ユーザー名を編集"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name="create-outline"
                    size={18}
                    color={colors.TEXT_ON_LIGHT}
                  />
                </Pressable>
              ) : null
            }
            value={
              loading ? (
                "…"
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    maxWidth: "100%",
                  }}
                >
                  <Text
                    style={[styles.value, { flexShrink: 1 }]}
                  >
                    {displayName || "（未設定）"}
                  </Text>
                  {isPrivateAccount ? (
                    <Ionicons
                      name="shield-outline"
                      size={14}
                      color={colors.TITLE_GOLD}
                      style={{ marginLeft: 6, opacity: 0.7 }}
                    />
                  ) : null}
                </View>
              )
            }
          />
          <ProfileRow
            styles={styles}
            label="フォロー数"
            value={followCountLoading ? "…" : String(followingCount)}
            onPress={() => openFollowList("following")}
            disabled={!targetUserId}
          />
          <ProfileRow
            styles={styles}
            label="フォロワー数"
            value={followCountLoading ? "…" : String(followerCount)}
            onPress={() => openFollowList("followers")}
            disabled={!targetUserId}
          />
          {canShowShareCode ? (
            <ProfileRow
              styles={styles}
              label="ユーザーID"
              labelAction={
                user ? (
                  <Pressable
                    style={[
                      styles.labelIconBtn,
                      (loading || !String(shareCode || "").trim()) &&
                        styles.labelIconBtnDisabled,
                    ]}
                    onPress={onCopyShareCode}
                    disabled={loading || !String(shareCode || "").trim()}
                    accessibilityLabel="ユーザーIDを共有"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name="share-outline"
                      size={18}
                      color={colors.TEXT_ON_LIGHT}
                    />
                  </Pressable>
                ) : null
              }
              value={userIdForDisplay}
            />
          ) : null}
        </View>

        <Text
          style={{
            marginTop: 6,
            ...ui.typography.description,
            color: ui?.text?.description ?? colors.TEXT_SUBTLE,
          }}
        >
          ※フォロー数とフォロワー数をタップすれば、一覧で表示されます。
        </Text>
      </View>
    </>
  );
}
