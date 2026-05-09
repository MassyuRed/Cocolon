import React, { useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuth } from "../AuthContext";
import { useTheme } from "../theme/ThemeContext";
import CocolonBackButton from "../components/CocolonBackButton";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { readShareCodePublic } from "../lib/compat/legacyWireContracts";

import {
  PANEL_MIN_HEIGHT,
} from "./account/accountModel";
import { useAccountProfile } from "./account/useAccountProfile";
import { useAccountFollowState } from "./account/useAccountFollowState";
import { useAccountVisibility } from "./account/useAccountVisibility";
import { useAccountSubscription } from "./account/useAccountSubscription";
import { useAccountIdSearch } from "./account/useAccountIdSearch";
import AccountProfileSection from "./account/AccountProfileSection";
import AccountIdSearchSection from "./account/AccountIdSearchSection";
import AccountStatusSection from "./account/AccountStatusSection";
import AccountNameEditModal from "./account/AccountNameEditModal";
import AccountVisibilitySection from "./account/AccountVisibilitySection";

export default function AccountScreen({ navigation, route, viewedUserId }) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);

  const { user } = useAuth();
  const routeViewedUserId = route?.params?.viewedUserId;
  const targetUserId = viewedUserId || routeViewedUserId || user?.id || null;
  const isSelf = !!user && String(targetUserId || "") === String(user.id);
  const isDark = themeName === "dark";

  const profile = useAccountProfile({ user, targetUserId, isSelf });
  const visibility = useAccountVisibility({ navigation, user, isSelf });
  const followState = useAccountFollowState({
    navigation,
    user,
    targetUserId,
    connectCode: profile.connectCode,
  });
  const accountSubscription = useAccountSubscription({ user });
  void accountSubscription;
  const idSearch = useAccountIdSearch({ navigation, user });

  const userIdForDisplay = user ? profile.shareCode || "（生成中）" : "未ログイン";

  const isPrivateAccount = !!(
    (isSelf && visibility.accountVisibility?.is_private_account) ||
      (!isSelf && (followState.accountStatus?.is_private_account || followState.accountStatus?.isPrivateAccount))
  );

  const isShareCodePublic = !!(
    readShareCodePublic(followState.accountStatus, false) ??
      followState.accountStatus?.isShareCodePublic ??
      followState.accountStatus?.shareCodePublic
  );

  const canShowShareCode = !user || isSelf || isShareCodePublic;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />
      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <CocolonBackButton
              navigation={navigation}
              fallbackRouteName="Home"
              style={styles.backButton}
            />
            <Text style={styles.headerTitle}>アカウント</Text>
            <View style={{ width: 22 }} />
          </View>

          <AccountProfileSection
            styles={styles}
            colors={colors}
            ui={ui}
            user={user}
            isSelf={isSelf}
            loading={profile.loading}
            nameSaving={profile.nameSaving}
            displayName={profile.displayName}
            shareCode={profile.shareCode}
            userIdForDisplay={userIdForDisplay}
            isPrivateAccount={isPrivateAccount}
            canShowShareCode={canShowShareCode}
            followingCount={followState.followingCount}
            followerCount={followState.followerCount}
            followCountLoading={followState.followCountLoading}
            isFollowing={followState.isFollowing}
            isFollowRequested={followState.isFollowRequested}
            followActionLoading={followState.followActionLoading}
            targetUserId={targetUserId}
            openNameEdit={profile.openNameEdit}
            onCopyShareCode={profile.onCopyShareCode}
            onShareProfile={profile.onShareProfile}
            openAccountSettings={visibility.openAccountSettings}
            onToggleFollow={followState.onToggleFollow}
            openFollowList={followState.openFollowList}
          />

          <AccountIdSearchSection
            styles={styles}
            colors={colors}
            ui={ui}
            idSearchQuery={idSearch.idSearchQuery}
            idSearchLoading={idSearch.idSearchLoading}
            idSearchResult={idSearch.idSearchResult}
            idSearchError={idSearch.idSearchError}
            onChangeIdSearchQuery={idSearch.onChangeIdSearchQuery}
            searchUserById={idSearch.searchUserById}
            navigateToAccount={idSearch.navigateToAccount}
          />

          <AccountStatusSection
            styles={styles}
            statusLoading={followState.statusLoading}
            statusError={followState.statusError}
            statusValue={followState.statusValue}
          />
        </ScrollView>
      </View>

      {isSelf ? (
        <AccountNameEditModal
          visible={profile.nameEditOpen}
          styles={styles}
          colors={colors}
          ui={ui}
          nameDraft={profile.nameDraft}
          setNameDraft={profile.setNameDraft}
          nameSaving={profile.nameSaving}
          nameChecking={profile.nameChecking}
          nameError={profile.nameError}
          setNameError={profile.setNameError}
          closeNameEdit={profile.closeNameEdit}
          saveDisplayName={profile.saveDisplayName}
        />
      ) : null}

      {isSelf ? (
        <AccountVisibilitySection
          visible={visibility.accountSettingsOpen}
          styles={styles}
          colors={colors}
          accountVisibility={visibility.accountVisibility}
          visibilityLoading={visibility.visibilityLoading}
          visibilitySaving={visibility.visibilitySaving}
          closeAccountSettings={visibility.closeAccountSettings}
          patchAccountVisibilityMe={visibility.patchAccountVisibilityMe}
        />
      ) : null}
    </SafeAreaView>
  );
}

function createStyles(COLORS, ui) {
  const text = ui?.text || {};
  return StyleSheet.create(applyTypographyTokens({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.PANEL_BG,
    },
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    scrollContent: {
      paddingBottom: 24,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
    },
    card: {
      backgroundColor: COLORS.PANEL_BG,
      borderRadius: 24,
      borderWidth: 2,
      borderColor: COLORS.BORDER_GOLD,
      paddingHorizontal: 18,
      paddingVertical: 20,
      minHeight: PANEL_MIN_HEIGHT,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 8,
    },

    infoSection: {
      marginTop: 8,
    },

    statusSection: {
      marginTop: 18,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: COLORS.CARD_BORDER,
    },
    idSearchSection: {
      marginTop: 18,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: COLORS.CARD_BORDER,
    },
    idSearchRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    idSearchInput: {
      flex: 1,
      height: 42,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      fontSize: 14,
      color: COLORS.TEXT_ON_LIGHT,
    },
    idSearchButton: {
      marginLeft: 8,
      minWidth: 72,
      height: 42,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 12,
    },
    idSearchButtonDisabled: {
      opacity: 0.6,
    },
    idSearchButtonText: {
      fontSize: 13,
      fontWeight: "800",
      color: COLORS.ACCENT_TEXT,
    },
    idSearchResultButton: {
      marginTop: 10,
      minHeight: 44,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 12,
      paddingVertical: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    idSearchResultName: {
      flex: 1,
      fontSize: 13,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    idSearchErrorText: {
      marginTop: 8,
      fontSize: 11,
      lineHeight: 16,
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },
    statusTitle: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 10,
      letterSpacing: 0.3,
    },
    statusCard: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    statusRow: {
      flexDirection: "column",
      alignItems: "stretch",
      justifyContent: "flex-start",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
    },
    kvRowTop: {
      flexDirection: "row",
      alignItems: "center",
    },
    kvRowBottom: {
      marginTop: 8,
      flexDirection: "row",
      alignItems: "center",
    },
    statusRowLabel: {
      fontSize: 12,
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
    },
    labelIconBtn: {
      marginLeft: 6,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 8,
    },
    labelIconBtnDisabled: {
      opacity: 0.5,
    },
    statusRowValue: {
      fontSize: 13,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      flexShrink: 0,
      textAlign: "right",
    },

    profileRowValue: {
      fontSize: 13,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      flexShrink: 0,
      textAlign: "right",
    },
    statusErrorText: {
      marginTop: 8,
      fontSize: 10,
      color: COLORS.TEXT_ON_LIGHT,
      opacity: 0.8,
    },
    label: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    value: {
      marginTop: 2,
      fontSize: 25,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    valueRight: {
      marginTop: 2,
      fontSize: 25,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      alignSelf: "flex-end",
      textAlign: "right",
    },

    infoBlockValueRow: {
      alignSelf: "flex-end",
      marginTop: 2,
    },

    profileText: {
      marginTop: 4,
      fontSize: 13,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
    },
    // ---- Follow / Follower ----
    followBtn: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      marginTop: 8,
    },
    followBtnFollowing: {
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    followBtnText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    followBtnTextOnGold: {
      color: "#FFFFFF",
    },
    followStatsRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
    },
    followStatItem: {
      flexDirection: "row",
      alignItems: "baseline",
    },
    followStatNumber: {
      fontSize: 14,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      marginRight: 4,
    },
    followStatLabel: {
      fontSize: 12,
      color: COLORS.TEXT_ON_LIGHT,
    },
    followCountBlock: {
      marginTop: 12,
    },
    followCountValue: {
      marginTop: 2,
      fontSize: 14,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      alignSelf: "flex-end",
      textAlign: "right",
    },


    // ---- DisplayName edit ----
    editNameBtn: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      marginTop: 8,
    },
    editNameBtnDisabled: {
      opacity: 0.5,
    },
    editNameBtnText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },

    profileActionRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginTop: 0,
      marginBottom: 16,
    },

    accountSettingsBtn: {
      width: 42,
      height: 38,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
    },
    accountSettingsBtnDisabled: {
      opacity: 0.5,
    },

    // ---- Modal (display name edit) ----
    modalBackdrop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.25)",
    },
    nameModalCard: {
      position: "absolute",
      left: 20,
      right: 20,
      top: 140,
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 16,
      padding: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 12 },
      elevation: 12,
    },

    // ---- Account settings modal ----
    settingsModalCard: {
      position: "absolute",
      left: 20,
      right: 20,
      top: 120,
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 16,
      padding: 12,
      paddingBottom: 64,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 12 },
      elevation: 12,
    },
    settingsModalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
    },
    settingsTabRow: {
      flex: 1,
      flexDirection: "row",
      backgroundColor: COLORS.PANEL_BG,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      overflow: "hidden",
      marginLeft: 10,
    },
    modalHeaderSpinner: {
      position: "absolute",
      right: 12,
      top: 6,
    },
    settingsTabBtn: {
      flex: 1,
      paddingVertical: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    settingsTabBtnActive: {
      backgroundColor: COLORS.GOLD_BUTTON,
    },
    settingsTabText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    settingsTabTextActive: {
      color: COLORS.ACCENT_TEXT,
    },

    settingsModalTitle: {
      fontSize: 14,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    visibilityRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
    },
    visibilityLeft: {
      flex: 1,
      paddingRight: 12,
    },
    visibilityTitle: {
      fontSize: 13,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    visibilityDesc: {
      marginTop: 4,
      fontSize: 9,
      lineHeight: 15,
      color: COLORS.TEXT_ON_LIGHT,
    },
    visibilityRight: {
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
    },
    visibilityChoiceBtn: {
      minWidth: 70,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      alignItems: "center",
      justifyContent: "center",
    },
    visibilityChoiceBtnActive: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    visibilityChoiceText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    visibilityChoiceTextActive: {
      color: COLORS.ACCENT_TEXT,
    },

    // ---- Profile edit modal ----
    profileModalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
      marginBottom: 10,
    },
    profileSaveBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: COLORS.GOLD_BUTTON,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      alignItems: "center",
      justifyContent: "center",
      minWidth: 64,
    },
    profileSaveBtnBottom: {
      position: "absolute",
      right: 12,
      bottom: 12,
    },
    profileSaveBtnDisabled: {
      opacity: 0.6,
    },
    profileSaveBtnText: {
      fontSize: 12,
      fontWeight: "800",
      color: "#FFFFFF",
    },
    profileCoverPlaceholder: {
      height: 120,
      borderRadius: 12,
      backgroundColor: COLORS.PANEL_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    profileCoverImage: {
      width: "100%",
      height: "100%",
      borderRadius: 12,
    },
    profileFieldLabel: {
      marginTop: 12,
      fontSize: 12,
      color: COLORS.TEXT_ON_LIGHT,
    },
    profileBioInput: {
      height: 96,
      paddingTop: 10,
    },

    nameModalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
      marginBottom: 10,
    },
    nameModalTitle: {
      fontSize: 14,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    nameModalCloseBtn: {
      paddingHorizontal: 6,
      paddingVertical: 4,
      borderRadius: 10,
    },
    nameModalHint: {
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 10,
    },
    nameInput: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 10,
      paddingVertical: 10,
      fontSize: 14,
      color: COLORS.TEXT_ON_LIGHT,
    },
    nameHelperText: {
      marginTop: 8,
      fontSize: 11,
      lineHeight: 16,
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },
    nameErrorText: {
      marginTop: 8,
      fontSize: 11,
      lineHeight: 16,
      color: "#B91C1C",
    },
    nameModalActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 12,
    },
    nameModalBtn: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      alignItems: "center",
      justifyContent: "center",
      minWidth: 90,
    },
    nameModalBtnGhost: {
      marginRight: 8,
    },
    nameModalBtnPrimary: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    nameModalBtnDisabled: {
      opacity: 0.6,
    },
    nameModalBtnText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    nameModalBtnGhostText: {
      color: COLORS.TEXT_ON_LIGHT,
    },
    nameModalBtnPrimaryText: {
      color: "#FFFFFF",
    },

    valueMono: {
      marginTop: 2,
      fontSize: 11,
      color: COLORS.TEXT_ON_LIGHT,
    },
    valueMonoRight: {
      marginTop: 2,
      fontSize: 11,
      color: COLORS.TITLE_GOLD,
      alignSelf: "flex-end",
      textAlign: "right",
    },


    // ---- Subscription ----
    subscriptionSection: {
      marginTop: 22,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: COLORS.CARD_BORDER,
    },
    subRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    subBadge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    subBadgeText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    subNote: {
      fontSize: 12,
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 8,
    },
    subErrorText: {
      fontSize: 10,
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 10,
    },

restoreBtn: {
  alignSelf: "flex-start",
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 999,
  backgroundColor: COLORS.PANEL_BG,
  borderWidth: 1,
  borderColor: COLORS.CARD_BORDER,
  marginBottom: 10,
},
restoreBtnText: {
  fontSize: 13,
  fontWeight: "800",
  color: COLORS.TEXT_ON_LIGHT,
},

    subCta: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: COLORS.GOLD_BUTTON,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    subCtaText: {
      fontSize: 13,
      fontWeight: "800",
      color: COLORS.ACCENT_TEXT,
    },
  }, ui));
}
