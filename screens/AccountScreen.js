import React, { useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
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
    <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
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
            <View style={{ width: 44 }} />
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
      </KeyboardAvoidingView>

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
      backgroundColor: COLORS.BG_SILVER,
    },
    container: {
      flex: 1,
      paddingHorizontal: 0,
      paddingTop: 0,
    },
    scrollContent: {
      paddingBottom: 24,
      width: "100%",
      maxWidth: 680,
      alignSelf: "center",
      paddingHorizontal: 20,
      paddingTop: 16,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
      minWidth: 0,
      gap: 8,
    },
    backButton: {
      padding: 4,
      minWidth: 44,
      minHeight: 44,
    },
    headerTitle: {
      color: COLORS.TITLE_GOLD,
      flex: 1,
      minWidth: 0,
      flexShrink: 1,
      textAlign: "center",
    },
    card: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 20,
      paddingVertical: 20,
      shadowColor: ui.shadow.float.shadowColor,
      shadowOpacity: ui.shadow.float.shadowOpacity,
      shadowRadius: ui.shadow.float.shadowRadius,
      shadowOffset: ui.shadow.float.shadowOffset,
      elevation: ui.shadow.float.elevation,
    },
    sectionLabel: {
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
      paddingTop: 20,
      borderTopColor: COLORS.CARD_BORDER,
      paddingHorizontal: 20,
      paddingBottom: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      borderRadius: 24,
      backgroundColor: COLORS.FIELD_BG,
    },
    idSearchRow: {
      flexDirection: "column",
      alignItems: "stretch",
      gap: 12,
    },
    idSearchInput: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 16,
      color: COLORS.TEXT_ON_LIGHT,
      width: "100%",
      minHeight: 52,
      paddingVertical: 12,
    },
    idSearchButton: {
      marginLeft: 0,
      minWidth: 0,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
      width: "100%",
      minHeight: 52,
      paddingVertical: 12,
    },
    idSearchButtonDisabled: {
      backgroundColor: COLORS.FIELD_BG,
      borderColor: COLORS.CARD_BORDER,
    },
    idSearchButtonText: {
      color: COLORS.ACCENT_TEXT,
      textAlign: "center",
      flexShrink: 1,
    },
    idSearchResultButton: {
      marginTop: 10,
      minHeight: 52,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },
    idSearchResultName: {
      flex: 1,
      color: COLORS.TEXT_ON_LIGHT,
      minWidth: 0,
      flexShrink: 1,
    },
    idSearchErrorText: {
      marginTop: 8,
      color: COLORS.ERROR,
    },
    statusTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 10,
      letterSpacing: 0,
    },
    statusCard: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 20,
      paddingVertical: 20,
      shadowColor: ui.shadow.float.shadowColor,
      shadowOpacity: ui.shadow.float.shadowOpacity,
      shadowRadius: ui.shadow.float.shadowRadius,
      shadowOffset: ui.shadow.float.shadowOffset,
      elevation: ui.shadow.float.elevation,
    },
    statusRow: {
      flexDirection: "column",
      alignItems: "stretch",
      justifyContent: "flex-start",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
      minWidth: 0,
      minHeight: 60,
    },
    kvRowTop: {
      flexDirection: "row",
      alignItems: "center",
      minWidth: 0,
      flexWrap: "wrap",
      gap: 8,
    },
    kvRowBottom: {
      marginTop: 4,
      flexDirection: "row",
      alignItems: "center",
      minWidth: 0,
    },
    statusRowLabel: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
      minWidth: 0,
      maxWidth: "100%",
    },
    labelIconBtn: {
      marginLeft: 6,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 16,
      minWidth: 44,
      minHeight: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    labelIconBtnDisabled: {
      backgroundColor: COLORS.FIELD_BG,
    },
    statusRowValue: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
      textAlign: "right",
      minWidth: 0,
      maxWidth: "100%",
    },

    profileRowValue: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
      textAlign: "left",
      minWidth: 0,
      maxWidth: "100%",
    },
    statusErrorText: {
      marginTop: 8,
      color: COLORS.ERROR,
    },
    label: {
      color: COLORS.TEXT_ON_LIGHT,
    },
    value: {
      marginTop: 2,
      color: COLORS.TEXT_ON_LIGHT,
      minWidth: 0,
      flexShrink: 1,
    },
    valueRight: {
      marginTop: 2,
      color: COLORS.TITLE_GOLD,
      alignSelf: "flex-end",
      textAlign: "right",
      minWidth: 0,
      flexShrink: 1,
      maxWidth: "100%",
    },

    infoBlockValueRow: {
      alignSelf: "flex-end",
      marginTop: 2,
    },

    profileText: {
      marginTop: 4,
      color: COLORS.TEXT_ON_LIGHT,
    },
    // ---- Follow / Follower ----
    followBtn: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      backgroundColor: COLORS.GOLD_BUTTON,
      marginTop: 8,
      minHeight: 52,
      maxWidth: "100%",
      flexWrap: "wrap",
    },
    followBtnFollowing: {
      borderColor: COLORS.ON_SURFACE_TONAL,
      backgroundColor: COLORS.SURFACE_TONAL,
    },
    followBtnText: {
      color: COLORS.ON_SURFACE_TONAL,
      flexShrink: 1,
      minWidth: 0,
    },
    followBtnTextOnGold: {
      color: COLORS.ACCENT_TEXT,
    },
    followStatsRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
      flexWrap: "wrap",
      gap: 16,
    },
    followStatItem: {
      flexDirection: "row",
      alignItems: "baseline",
      flexWrap: "wrap",
      minWidth: 0,
    },
    followStatNumber: {
      color: COLORS.TITLE_GOLD,
      marginRight: 4,
    },
    followStatLabel: {
      color: COLORS.TEXT_ON_LIGHT,
      minWidth: 0,
      flexShrink: 1,
    },
    followCountBlock: {
      marginTop: 12,
    },
    followCountValue: {
      marginTop: 2,
      color: COLORS.TITLE_GOLD,
      alignSelf: "flex-end",
      textAlign: "right",
      minWidth: 0,
      flexShrink: 1,
      maxWidth: "100%",
    },


    // ---- DisplayName edit ----
    editNameBtn: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 24,
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      marginTop: 8,
      minHeight: 44,
      maxWidth: "100%",
    },
    editNameBtnDisabled: {
      backgroundColor: COLORS.FIELD_BG,
      borderColor: COLORS.CARD_BORDER,
    },
    editNameBtnText: {
      color: COLORS.TEXT_ON_LIGHT,
      minWidth: 0,
      flexShrink: 1,
    },

    profileActionRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginTop: 0,
      marginBottom: 16,
      flexWrap: "wrap",
      gap: 8,
    },

    accountSettingsBtn: {
      width: 44,
      height: 44,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
    },
    accountSettingsBtnDisabled: {
      backgroundColor: COLORS.FIELD_BG,
    },

    // ---- Modal (display name edit) ----
    modalBackdrop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.45)",
    },
    nameModalCard: {
      backgroundColor: COLORS.PANEL_BG,
      borderRadius: 24,
      padding: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      shadowColor: ui.shadow.float.shadowColor,
      shadowOpacity: ui.shadow.float.shadowOpacity,
      shadowRadius: ui.shadow.float.shadowRadius,
      shadowOffset: ui.shadow.float.shadowOffset,
      elevation: ui.shadow.float.elevation,
      width: "100%",
      maxWidth: 520,
      maxHeight: "100%",
      flexShrink: 1,
      alignSelf: "center",
    },

    // ---- Account settings modal ----
    settingsModalCard: {
      backgroundColor: COLORS.PANEL_BG,
      borderRadius: 24,
      padding: 20,
      paddingBottom: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      shadowColor: ui.shadow.float.shadowColor,
      shadowOpacity: ui.shadow.float.shadowOpacity,
      shadowRadius: ui.shadow.float.shadowRadius,
      shadowOffset: ui.shadow.float.shadowOffset,
      elevation: ui.shadow.float.elevation,
      width: "100%",
      maxWidth: 520,
      maxHeight: "100%",
      flexShrink: 1,
      alignSelf: "center",
    },
    settingsModalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
      gap: 12,
      minWidth: 0,
    },
    settingsTabRow: {
      flex: 1,
      flexDirection: "row",
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      overflow: "hidden",
      marginLeft: 0,
      flexWrap: "wrap",
      gap: 8,
    },
    modalHeaderSpinner: {
      flexShrink: 0,
    },
    settingsTabBtn: {
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44,
      minWidth: 0,
      paddingHorizontal: 12,
    },
    settingsTabBtnActive: {
      backgroundColor: COLORS.SURFACE_TONAL,
    },
    settingsTabText: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
      textAlign: "center",
    },
    settingsTabTextActive: {
      color: COLORS.ON_SURFACE_TONAL,
    },

    settingsModalTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
      minWidth: 0,
    },
    visibilityRow: {
      flexDirection: "column",
      alignItems: "stretch",
      justifyContent: "space-between",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
      gap: 12,
    },
    visibilityLeft: {
      paddingRight: 0,
      width: "100%",
    },
    visibilityTitle: {
      color: COLORS.TEXT_ON_LIGHT,
    },
    visibilityDesc: {
      marginTop: 8,
      color: COLORS.TEXT_SUBTLE,
    },
    visibilityRight: {
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 1,
      flexWrap: "wrap",
      gap: 8,
      maxWidth: "100%",
    },
    visibilityChoiceBtn: {
      minWidth: 70,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44,
      maxWidth: "100%",
      flexShrink: 1,
    },
    visibilityChoiceBtnActive: {
      backgroundColor: COLORS.SURFACE_TONAL,
      borderColor: COLORS.ON_SURFACE_TONAL,
    },
    visibilityChoiceText: {
      color: COLORS.TEXT_ON_LIGHT,
      textAlign: "center",
      flexShrink: 1,
    },
    visibilityChoiceTextActive: {
      color: COLORS.ON_SURFACE_TONAL,
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
      minWidth: 0,
      gap: 12,
    },
    profileSaveBtn: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 24,
      backgroundColor: COLORS.GOLD_BUTTON,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      alignItems: "center",
      justifyContent: "center",
      minWidth: 64,
      minHeight: 52,
      maxWidth: "100%",
    },
    profileSaveBtnBottom: {
      alignSelf: "center",
      marginTop: 12,
    },
    profileSaveBtnDisabled: {
      backgroundColor: COLORS.FIELD_BG,
      borderColor: COLORS.CARD_BORDER,
    },
    profileSaveBtnText: {
      color: COLORS.ACCENT_TEXT,
      textAlign: "center",
      flexShrink: 1,
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
      color: COLORS.TEXT_ON_LIGHT,
    },
    profileBioInput: {
      paddingTop: 12,
      minHeight: 120,
      maxHeight: 240,
      textAlignVertical: "top",
    },

    nameModalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.CARD_BORDER,
      marginBottom: 12,
      gap: 12,
      minWidth: 0,
    },
    nameModalTitle: {
      color: COLORS.TEXT_ON_LIGHT,
      flex: 1,
      flexShrink: 1,
      minWidth: 0,
    },
    nameModalCloseBtn: {
      paddingHorizontal: 6,
      paddingVertical: 4,
      borderRadius: 16,
      width: 44,
      height: 44,
      minWidth: 44,
      minHeight: 44,
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
    },
    nameModalHint: {
      color: COLORS.TEXT_SUBTLE,
      marginBottom: 10,
    },
    nameInput: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 16,
      paddingVertical: 12,
      color: COLORS.TEXT_ON_LIGHT,
      minHeight: 52,
    },
    nameHelperText: {
      marginTop: 8,
      color: COLORS.TEXT_SUBTLE,
    },
    nameErrorText: {
      marginTop: 8,
      color: COLORS.ERROR,
    },
    nameModalActions: {
      flexDirection: "column",
      justifyContent: "flex-end",
      marginTop: 20,
      alignItems: "stretch",
      gap: 12,
    },
    nameModalBtn: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      alignItems: "center",
      justifyContent: "center",
      minWidth: 90,
      width: "100%",
      maxWidth: 520,
      alignSelf: "center",
      minHeight: 52,
    },
    nameModalBtnGhost: {
      marginRight: 0,
    },
    nameModalBtnPrimary: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    nameModalBtnDisabled: {
      backgroundColor: COLORS.FIELD_BG,
      borderColor: COLORS.CARD_BORDER,
    },
    nameModalBtnText: {
      color: COLORS.TEXT_ON_LIGHT,
      textAlign: "center",
      flexShrink: 1,
    },
    nameModalBtnGhostText: {
      color: COLORS.TEXT_ON_LIGHT,
    },
    nameModalBtnPrimaryText: {
      color: COLORS.ACCENT_TEXT,
    },

    valueMono: {
      marginTop: 2,
      color: COLORS.TEXT_SUBTLE,
      minWidth: 0,
      flexShrink: 1,
    },
    valueMonoRight: {
      marginTop: 2,
      color: COLORS.TEXT_SUBTLE,
      alignSelf: "flex-end",
      textAlign: "right",
      minWidth: 0,
      flexShrink: 1,
      maxWidth: "100%",
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
      flexWrap: "wrap",
      gap: 12,
    },
    subBadge: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.SURFACE_TONAL,
    },
    subBadgeText: {
      color: COLORS.ON_SURFACE_TONAL,
    },
    subNote: {
      color: COLORS.TEXT_SUBTLE,
      marginBottom: 8,
    },
    subErrorText: {
      color: COLORS.ERROR,
      marginBottom: 10,
    },

restoreBtn: {
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 24,
      backgroundColor: COLORS.PANEL_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      marginBottom: 10,
      width: "100%",
      maxWidth: 520,
      minHeight: 52,
    },
restoreBtnText: {
      color: COLORS.TEXT_ON_LIGHT,
      flexShrink: 1,
      textAlign: "center",
    },

    subCta: {
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 24,
      backgroundColor: COLORS.GOLD_BUTTON,
      borderWidth: 1,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
      width: "100%",
      maxWidth: 520,
      minHeight: 52,
    },
    subCtaText: {
      color: COLORS.ACCENT_TEXT,
      flexShrink: 1,
      textAlign: "center",
    },
  }, ui, {"headerTitle":"screenTitle","sectionLabel":"sectionTitle","idSearchInput":"body","idSearchButtonText":"button","idSearchResultName":"body","idSearchErrorText":"description","statusTitle":"sectionTitle","statusRowLabel":"description","statusRowValue":"sectionTitle","profileRowValue":"body","statusErrorText":"description","label":"description","value":"modalTitle","valueRight":"modalTitle","profileText":"body","followBtnText":"button","followStatNumber":"sectionTitle","followStatLabel":"description","followCountValue":"sectionTitle","editNameBtnText":"button","settingsTabText":"button","settingsModalTitle":"modalTitle","visibilityTitle":"sectionTitle","visibilityDesc":"body","visibilityChoiceText":"button","profileSaveBtnText":"button","profileFieldLabel":"description","profileBioInput":"body","nameModalTitle":"modalTitle","nameModalHint":"description","nameInput":"body","nameHelperText":"description","nameErrorText":"body","nameModalBtnText":"button","valueMono":"meta","valueMonoRight":"meta","subBadgeText":"button","subNote":"description","subErrorText":"description","restoreBtnText":"button","subCtaText":"button"}));
}
