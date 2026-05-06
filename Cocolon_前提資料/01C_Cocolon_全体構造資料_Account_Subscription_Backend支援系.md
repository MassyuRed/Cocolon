---
title: "01C_Cocolon_全体構造資料_Account_Subscription_Backend支援系"
revision_date: "2026-05-05"
---

# 01C. Account / Subscription / Backend支援系

この章では account / ProfileCreate / settings / subscription / auth / runtime support / rule / contract / test / script をまとめて扱う。

## C1. Account / ProfileCreate / Settings / Subscription surfaces

### `Cocolon/screens/AccountScreen.js`
- repo: `Cocolon`
- system: `account / subscription surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: account / subscription surface.
- 直接関係ファイル:
  - `Cocolon/AuthContext.js` — import
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/iap/iapConfig.js` — import
  - `Cocolon/lib/iap/iapService.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py` — endpoint /account/profile/me
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — endpoint /myprofile/follow
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — endpoint /myprofile/unfollow
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/AppRuntimeContext.js`
  - `Cocolon/AuthContext.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/iap/iapConfig.js`
  - `Cocolon/lib/iap/iapService.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`
- 修正対象になりうる変更:
  - account screen, ProfileCreate, settings, subscription UI, subscription_sales_enabled flag, account_delete_enabled flag

### `Cocolon/screens/ProfileCreateScreen.js`
- repo: `Cocolon`
- system: `account / subscription surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: account / subscription surface.
- 直接関係ファイル:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/components/CocolonSwitch.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/components/CocolonSwitch.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - account screen, ProfileCreate, settings, subscription UI

### `Cocolon/screens/SettingsAppSettingsScreen.js`
- repo: `Cocolon`
- system: `account / subscription surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: account / subscription surface.
- 直接関係ファイル:
  - `Cocolon/AuthContext.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/components/CocolonSwitch.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/reportDistributionApi.js` — import
  - `Cocolon/lib/todayQuestionApi.js` — import
  - `Cocolon/screens/MyWebMenuCommon.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py` — endpoint /account/profile/me
  - `mashos-api/ai/services/ai_inference/api_friends.py` — endpoint /emotion-notifications/settings
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/AuthContext.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/components/CocolonSwitch.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/reportDistributionApi.js`
  - `Cocolon/lib/todayQuestionApi.js`
  - `Cocolon/screens/MyWebMenuCommon.js`
  - `Cocolon/theme/ThemeContext.js`
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py`
  - `mashos-api/ai/services/ai_inference/api_friends.py`
- 修正対象になりうる変更:
  - account screen, ProfileCreate, settings, subscription UI

### `Cocolon/screens/SettingsOtherScreen.js`
- repo: `Cocolon`
- system: `account / subscription surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: account / subscription surface.
- 直接関係ファイル:
  - `Cocolon/AppRuntimeContext.js` — import
  - `Cocolon/AuthContext.js` — import
  - `Cocolon/TutorialContext.js` — import
  - `Cocolon/UnreadContext.js` — import
  - `Cocolon/lib/accountLocalCleanup.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/screens/MyWebMenuCommon.js` — import
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py` — endpoint /account/delete
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/AppRuntimeContext.js`
  - `Cocolon/AuthContext.js`
  - `Cocolon/TutorialContext.js`
  - `Cocolon/UnreadContext.js`
  - `Cocolon/lib/accountLocalCleanup.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/screens/MyWebMenuCommon.js`
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py`
- 修正対象になりうる変更:
  - account screen, ProfileCreate, settings, subscription UI, account_delete_enabled flag

### `Cocolon/screens/SettingsScreen.js`
- repo: `Cocolon`
- system: `account / subscription surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: account / subscription surface.
- 直接関係ファイル:
  - `Cocolon/screens/MyModelMenuCommon.js` — import
  - `Cocolon/screens/MyWebMenuCommon.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/screens/MyModelMenuCommon.js`
  - `Cocolon/screens/MyWebMenuCommon.js`
- 修正対象になりうる変更:
  - account screen, ProfileCreate, settings, subscription UI

### `Cocolon/screens/SubscriptionSelectScreen.js`
- repo: `Cocolon`
- system: `account / subscription surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: account / subscription surface.
- 直接関係ファイル:
  - `Cocolon/AppRuntimeContext.js` — import
  - `Cocolon/SubscriptionContext.js` — import
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/iap/iapConfig.js` — import
  - `Cocolon/lib/iap/iapRuntimeCatalog.js` — import
  - `Cocolon/lib/iap/iapService.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/AppRuntimeContext.js`
  - `Cocolon/SubscriptionContext.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/lib/iap/iapConfig.js`
  - `Cocolon/lib/iap/iapRuntimeCatalog.js`
  - `Cocolon/lib/iap/iapService.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - account screen, ProfileCreate, settings, subscription UI, subscription_sales_enabled flag


## C2. Account / subscription frontend boundary

### `Cocolon/lib/accountLocalCleanup.js`
- repo: `Cocolon`
- system: `account / subscription boundary helper`
- 現行状態: `shared`
- 役割: 退会後の端末内ユーザー別stateを削除するfrontend cleanup boundary。input draft / self-structure seen / analysis latest report cacheを扱う。
- 直接関係ファイル:
  - `Cocolon/lib/inputDraftStorage.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/SettingsOtherScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/lib/inputDraftStorage.js`
  - `Cocolon/screens/SettingsOtherScreen.js`
- 修正対象になりうる変更:
  - account profile update, push token, subscription/report-distribution API boundary

### `Cocolon/lib/api/account/profileApi.js`
- repo: `Cocolon`
- system: `account / subscription boundary helper`
- 現行状態: `shared`
- 役割: Frontend API wrapper for /account/profile/me.
- 直接関係ファイル:
  - `Cocolon/lib/api/client.js` — import
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py` — endpoint /account/profile/me
- このファイルを直接参照するファイル:
  - `Cocolon/AuthContext.js` — import
  - `Cocolon/TutorialContext.js` — import
  - `Cocolon/lib/pushToken.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/AuthContext.js`
  - `Cocolon/TutorialContext.js`
  - `Cocolon/lib/api/client.js`
  - `Cocolon/lib/pushToken.js`
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py`
- 修正対象になりうる変更:
  - account profile update, push token, subscription/report-distribution API boundary

### `Cocolon/lib/iap/iapConfig.js`
- repo: `Cocolon`
- system: `subscription / IAP runtime`
- 現行状態: `shared`
- 役割: lib/iap/iapConfig.js
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `Cocolon/SUBSCRIPTION_RELEASE_PHASE3.md` — document reference
  - `Cocolon/lib/iap/iapRuntimeCatalog.js` — import
  - `Cocolon/lib/iap/iapService.js` — import
  - `Cocolon/screens/AccountScreen.js` — import
  - `Cocolon/screens/SubscriptionSelectScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/SUBSCRIPTION_RELEASE_PHASE3.md`
  - `Cocolon/lib/iap/iapRuntimeCatalog.js`
  - `Cocolon/lib/iap/iapService.js`
  - `Cocolon/screens/AccountScreen.js`
  - `Cocolon/screens/SubscriptionSelectScreen.js`
- 修正対象になりうる変更:
  - plan copy, paywall, local entitlement display

### `Cocolon/lib/iap/iapRuntimeCatalog.js`
- repo: `Cocolon`
- system: `subscription / IAP runtime`
- 現行状態: `legacy-live`
- 役割: Frontend helper / boundary module. Current system: subscription / IAP runtime.
- 直接関係ファイル:
  - `Cocolon/lib/iap/iapConfig.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/SubscriptionContext.js` — import
  - `Cocolon/lib/iap/iapService.js` — import
  - `Cocolon/screens/SubscriptionSelectScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/SubscriptionContext.js`
  - `Cocolon/lib/iap/iapConfig.js`
  - `Cocolon/lib/iap/iapService.js`
  - `Cocolon/screens/SubscriptionSelectScreen.js`
- 修正対象になりうる変更:
  - plan copy, paywall, local entitlement display

### `Cocolon/lib/iap/iapService.js`
- repo: `Cocolon`
- system: `subscription / IAP runtime`
- 現行状態: `legacy-live`
- 役割: lib/iap/iapService.js
- 直接関係ファイル:
  - `Cocolon/lib/iap/iapConfig.js` — import
  - `Cocolon/lib/iap/iapRuntimeCatalog.js` — import
  - `Cocolon/lib/subscriptionApi.js` — import
  - `Cocolon/lib/supabase.ts` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
  - `Cocolon/screens/AccountScreen.js` — import
  - `Cocolon/screens/SubscriptionSelectScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/lib/iap/iapConfig.js`
  - `Cocolon/lib/iap/iapRuntimeCatalog.js`
  - `Cocolon/lib/subscriptionApi.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/screens/AccountScreen.js`
  - `Cocolon/screens/SubscriptionSelectScreen.js`
- 修正対象になりうる変更:
  - plan copy, paywall, local entitlement display

### `Cocolon/lib/iap/index.js`
- repo: `Cocolon`
- system: `subscription / IAP runtime`
- 現行状態: `shared`
- 役割: lib/iap/index.js
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - plan copy, paywall, local entitlement display

### `Cocolon/lib/pushToken.js`
- repo: `Cocolon`
- system: `account / subscription boundary helper`
- 現行状態: `shared`
- 役割: 通知許可、APNs/FCM token取得、account/profile同期を扱うpush token boundary。token prefix logはdebug build限定。
- 直接関係ファイル:
  - `Cocolon/lib/api/account/profileApi.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/lib/api/account/profileApi.js`
- 修正対象になりうる変更:
  - account profile update, push token, subscription/report-distribution API boundary

### `Cocolon/lib/reportDistributionApi.js`
- repo: `Cocolon`
- system: `account / subscription boundary helper`
- 現行状態: `shared`
- 役割: Frontend helper / boundary module. Current system: account / subscription boundary helper.
- 直接関係ファイル:
  - `Cocolon/lib/apiClient.js` — import
  - `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py` — endpoint /report-distribution/settings
- このファイルを直接参照するファイル:
  - `Cocolon/screens/SettingsAppSettingsScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/screens/SettingsAppSettingsScreen.js`
  - `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py`
- 修正対象になりうる変更:
  - account profile update, push token, subscription/report-distribution API boundary

### `Cocolon/lib/subscriptionApi.js`
- repo: `Cocolon`
- system: `account / subscription boundary helper`
- 現行状態: `shared`
- 役割: Frontend helper / boundary module. Current system: account / subscription boundary helper.
- 直接関係ファイル:
  - `Cocolon/lib/apiClient.js` — import
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — endpoint /subscription/bootstrap
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — endpoint /subscription/me
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — endpoint /subscription/update
- このファイルを直接参照するファイル:
  - `Cocolon/SubscriptionContext.js` — import
  - `Cocolon/lib/iap/iapService.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/SubscriptionContext.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/iap/iapService.js`
  - `mashos-api/ai/services/ai_inference/api_subscription.py`
- 修正対象になりうる変更:
  - account profile update, push token, subscription/report-distribution API boundary

### `Cocolon/lib/supabase.ts`
- repo: `Cocolon`
- system: `account / subscription boundary helper`
- 現行状態: `shared`
- 役割: lib/supabase.ts
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
  - `Cocolon/AuthContext.js` — import
  - `Cocolon/SubscriptionContext.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/iap/iapService.js` — import
  - `Cocolon/lib/user.ts` — import
  - `Cocolon/screens/AccountScreen.js` — import
  - `Cocolon/screens/DeepInsightScreen.js` — import
  - `Cocolon/screens/EchoesHistoryListScreen.js` — import
  - `Cocolon/screens/EmotionLogScreen.js` — import
  - `Cocolon/screens/EmotionRankingScreen.js` — import
  - `Cocolon/screens/FollowListScreen.js` — import
  - `Cocolon/screens/InputCountRankingScreen.js` — import
  - `Cocolon/screens/InputLengthRankingScreen.js` — import
  - `Cocolon/screens/LoginStreakRankingScreen.js` — import
  - `Cocolon/screens/MyModelDiscoveriesRankingScreen.js` — import
  - `Cocolon/screens/MyModelEchoesRankingScreen.js` — import
  - `Cocolon/screens/MyModelQuestionsRankingScreen.js` — import
  - `Cocolon/screens/MyModelReflectionsScreen.js` — import
  - `Cocolon/screens/MyModelScreen.js` — import
  - `Cocolon/screens/MyWebEnsureClient.js` — import
  - `Cocolon/screens/MyWebHistoryScreen.js` — import
  - `Cocolon/screens/MyWebReportHistoryScreen.js` — import
  - `Cocolon/screens/MyWebReportViewerScreen.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
  - `Cocolon/screens/ProfileCreateScreen.js` — import
  - `Cocolon/screens/RankingTopScreen.js` — import
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js` — import
  - `Cocolon/screens/SubscriptionSelectScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/AuthContext.js`
  - `Cocolon/SubscriptionContext.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/iap/iapService.js`
  - `Cocolon/lib/user.ts`
  - `Cocolon/screens/AccountScreen.js`
  - `Cocolon/screens/DeepInsightScreen.js`
  - `Cocolon/screens/EchoesHistoryListScreen.js`
  - `Cocolon/screens/EmotionLogScreen.js`
  - `Cocolon/screens/EmotionRankingScreen.js`
  - `Cocolon/screens/FollowListScreen.js`
  - `Cocolon/screens/InputCountRankingScreen.js`
  - `Cocolon/screens/InputLengthRankingScreen.js`
  - `Cocolon/screens/LoginStreakRankingScreen.js`
  - `Cocolon/screens/MyModelDiscoveriesRankingScreen.js`
  - `Cocolon/screens/MyModelEchoesRankingScreen.js`
  - `Cocolon/screens/MyModelQuestionsRankingScreen.js`
  - `Cocolon/screens/MyModelReflectionsScreen.js`
  - `Cocolon/screens/MyModelScreen.js`
  - `Cocolon/screens/MyWebEnsureClient.js`
  - `Cocolon/screens/MyWebHistoryScreen.js`
  - `Cocolon/screens/MyWebReportHistoryScreen.js`
  - `Cocolon/screens/MyWebReportViewerScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/ProfileCreateScreen.js`
  - `Cocolon/screens/RankingTopScreen.js`
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js`
  - `Cocolon/screens/SubscriptionSelectScreen.js`
- 修正対象になりうる変更:
  - account profile update, push token, subscription/report-distribution API boundary

### `Cocolon/lib/user.ts`
- repo: `Cocolon`
- system: `account / subscription boundary helper`
- 現行状態: `shared`
- 役割: lib/user.ts
- 直接関係ファイル:
  - `Cocolon/lib/supabase.ts` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
  - `Cocolon/screens/MyModelReflectionsScreen.js` — import
  - `Cocolon/screens/MyModelScreen.js` — import
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/screens/MyModelReflectionsScreen.js`
  - `Cocolon/screens/MyModelScreen.js`
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js`
- 修正対象になりうる変更:
  - account profile update, push token, subscription/report-distribution API boundary


## C3. Shared UI / guide / theme assets

### `Cocolon/components/CocolonBackButton.js`
- repo: `Cocolon`
- system: `shared UI foundation`
- 現行状態: `shared`
- 役割: RN shared component module. Current system: shared UI foundation.
- 直接関係ファイル:
  - `Cocolon/theme/ThemeContext.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/AccountScreen.js` — import
  - `Cocolon/screens/CocolonGuideScreen.js` — import
  - `Cocolon/screens/DiscoveriesHistoryDetailScreen.js` — import
  - `Cocolon/screens/DiscoveriesHistoryListScreen.js` — import
  - `Cocolon/screens/EchoesHistoryDetailScreen.js` — import
  - `Cocolon/screens/EchoesHistoryListScreen.js` — import
  - `Cocolon/screens/EmotionRankingScreen.js` — import
  - `Cocolon/screens/InputCountRankingScreen.js` — import
  - `Cocolon/screens/InputLengthRankingScreen.js` — import
  - `Cocolon/screens/LoginStreakRankingScreen.js` — import
  - `Cocolon/screens/MyModelDiscoveriesRankingScreen.js` — import
  - `Cocolon/screens/MyModelEchoesRankingScreen.js` — import
  - `Cocolon/screens/MyModelQuestionsRankingScreen.js` — import
  - `Cocolon/screens/MyModelReflectionsScreen.js` — import
  - `Cocolon/screens/MyWebHistoryScreen.js` — import
  - `Cocolon/screens/MyWebMenuCommon.js` — import
  - `Cocolon/screens/MyWebReportHistoryScreen.js` — import
  - `Cocolon/screens/MyWebReportViewerScreen.js` — import
  - `Cocolon/screens/NoticeHistoryScreen.js` — import
  - `Cocolon/screens/ProfileCreateScreen.js` — import
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js` — import
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js` — import
  - `Cocolon/screens/SubscriptionSelectScreen.js` — import
  - `Cocolon/screens/TodayQuestionHistoryScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/screens/AccountScreen.js`
  - `Cocolon/screens/CocolonGuideScreen.js`
  - `Cocolon/screens/DiscoveriesHistoryDetailScreen.js`
  - `Cocolon/screens/DiscoveriesHistoryListScreen.js`
  - `Cocolon/screens/EchoesHistoryDetailScreen.js`
  - `Cocolon/screens/EchoesHistoryListScreen.js`
  - `Cocolon/screens/EmotionRankingScreen.js`
  - `Cocolon/screens/InputCountRankingScreen.js`
  - `Cocolon/screens/InputLengthRankingScreen.js`
  - `Cocolon/screens/LoginStreakRankingScreen.js`
  - `Cocolon/screens/MyModelDiscoveriesRankingScreen.js`
  - `Cocolon/screens/MyModelEchoesRankingScreen.js`
  - `Cocolon/screens/MyModelQuestionsRankingScreen.js`
  - `Cocolon/screens/MyModelReflectionsScreen.js`
  - `Cocolon/screens/MyWebHistoryScreen.js`
  - `Cocolon/screens/MyWebMenuCommon.js`
  - `Cocolon/screens/MyWebReportHistoryScreen.js`
  - `Cocolon/screens/MyWebReportViewerScreen.js`
  - `Cocolon/screens/NoticeHistoryScreen.js`
  - `Cocolon/screens/ProfileCreateScreen.js`
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js`
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js`
  - `Cocolon/screens/SubscriptionSelectScreen.js`
  - `Cocolon/screens/TodayQuestionHistoryScreen.js`
  - `Cocolon/theme/ThemeContext.js`
- 修正対象になりうる変更:
  - global UI primitive / design component change

### `Cocolon/components/CocolonButton.js`
- repo: `Cocolon`
- system: `shared UI foundation`
- 現行状態: `shared`
- 役割: CocolonButton.js
- 直接関係ファイル:
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/components/EmotionReflectionPreviewModal.js` — import
  - `Cocolon/components/NoticeModal.js` — import
  - `Cocolon/components/TodayQuestionCard.js` — import
  - `Cocolon/components/TutorialStartModal.js` — import
  - `Cocolon/screens/InputScreen.js` — import
  - `Cocolon/screens/MenuActionCardCommon.js` — import
  - `Cocolon/screens/MyModelReflectionsScreen.js` — import
  - `Cocolon/screens/MyModelScreen.js` — import
  - `Cocolon/screens/MyWebContentFirstScreen.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
  - `Cocolon/screens/NexusScreen.js` — import
  - `Cocolon/screens/NoticeHistoryScreen.js` — import
  - `Cocolon/screens/ProfileCreateScreen.js` — import
  - `Cocolon/screens/TodayQuestionHistoryScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/EmotionReflectionPreviewModal.js`
  - `Cocolon/components/NoticeModal.js`
  - `Cocolon/components/TodayQuestionCard.js`
  - `Cocolon/components/TutorialStartModal.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/screens/MenuActionCardCommon.js`
  - `Cocolon/screens/MyModelReflectionsScreen.js`
  - `Cocolon/screens/MyModelScreen.js`
  - `Cocolon/screens/MyWebContentFirstScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/NexusScreen.js`
  - `Cocolon/screens/NoticeHistoryScreen.js`
  - `Cocolon/screens/ProfileCreateScreen.js`
  - `Cocolon/screens/TodayQuestionHistoryScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - global UI primitive / design component change

### `Cocolon/components/CocolonPressable.js`
- repo: `Cocolon`
- system: `shared UI foundation`
- 現行状態: `shared`
- 役割: CocolonPressable.js
- 直接関係ファイル:
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/components/TodayQuestionCard.js` — import
  - `Cocolon/screens/AccountScreen.js` — import
  - `Cocolon/screens/EchoesHistoryListScreen.js` — import
  - `Cocolon/screens/EmotionLogScreen.js` — import
  - `Cocolon/screens/InputScreen.js` — import
  - `Cocolon/screens/MyModelMenuCommon.js` — import
  - `Cocolon/screens/MyModelReflectionsScreen.js` — import
  - `Cocolon/screens/MyModelScreen.js` — import
  - `Cocolon/screens/MyWebContentFirstScreen.js` — import
  - `Cocolon/screens/MyWebMenuCommon.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
  - `Cocolon/screens/MyWebTopScreen.js` — import
  - `Cocolon/screens/NexusScreen.js` — import
  - `Cocolon/screens/NoticeHistoryScreen.js` — import
  - `Cocolon/screens/ProfileCreateScreen.js` — import
  - `Cocolon/screens/RankingTopScreen.js` — import
  - `Cocolon/screens/SettingsAppSettingsScreen.js` — import
  - `Cocolon/screens/TodayQuestionHistoryScreen.js` — import
  - `Cocolon/screens/nexus/NexusReflectionCard.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/TodayQuestionCard.js`
  - `Cocolon/screens/AccountScreen.js`
  - `Cocolon/screens/EchoesHistoryListScreen.js`
  - `Cocolon/screens/EmotionLogScreen.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/screens/MyModelMenuCommon.js`
  - `Cocolon/screens/MyModelReflectionsScreen.js`
  - `Cocolon/screens/MyModelScreen.js`
  - `Cocolon/screens/MyWebContentFirstScreen.js`
  - `Cocolon/screens/MyWebMenuCommon.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/MyWebTopScreen.js`
  - `Cocolon/screens/NexusScreen.js`
  - `Cocolon/screens/NoticeHistoryScreen.js`
  - `Cocolon/screens/ProfileCreateScreen.js`
  - `Cocolon/screens/RankingTopScreen.js`
  - `Cocolon/screens/SettingsAppSettingsScreen.js`
  - `Cocolon/screens/TodayQuestionHistoryScreen.js`
  - `Cocolon/screens/nexus/NexusReflectionCard.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - global UI primitive / design component change

### `Cocolon/components/CocolonSwitch.js`
- repo: `Cocolon`
- system: `shared UI foundation`
- 現行状態: `shared`
- 役割: RN shared component module. Current system: shared UI foundation.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `Cocolon/screens/InputScreen.js` — import
  - `Cocolon/screens/ProfileCreateScreen.js` — import
  - `Cocolon/screens/SettingsAppSettingsScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/screens/ProfileCreateScreen.js`
  - `Cocolon/screens/SettingsAppSettingsScreen.js`
- 修正対象になりうる変更:
  - global UI primitive / design component change

### `Cocolon/components/Collapsible.tsx`
- repo: `Cocolon`
- system: `shared UI foundation`
- 現行状態: `shared`
- 役割: RN shared component module. Current system: shared UI foundation.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - global UI primitive / design component change

### `Cocolon/components/ExternalLink.tsx`
- repo: `Cocolon`
- system: `shared UI foundation`
- 現行状態: `shared`
- 役割: RN shared component module. Current system: shared UI foundation.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - global UI primitive / design component change

### `Cocolon/components/HapticTab.tsx`
- repo: `Cocolon`
- system: `shared UI foundation`
- 現行状態: `shared`
- 役割: RN shared component module. Current system: shared UI foundation.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - global UI primitive / design component change

### `Cocolon/components/HelloWave.tsx`
- repo: `Cocolon`
- system: `shared UI foundation`
- 現行状態: `shared`
- 役割: RN shared component module. Current system: shared UI foundation.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - global UI primitive / design component change

### `Cocolon/components/ParallaxScrollView.tsx`
- repo: `Cocolon`
- system: `shared UI foundation`
- 現行状態: `shared`
- 役割: RN shared component module. Current system: shared UI foundation.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - global UI primitive / design component change

### `Cocolon/components/ThemedText.tsx`
- repo: `Cocolon`
- system: `shared UI foundation`
- 現行状態: `shared`
- 役割: RN shared component module. Current system: shared UI foundation.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - global UI primitive / design component change

### `Cocolon/components/ThemedView.tsx`
- repo: `Cocolon`
- system: `shared UI foundation`
- 現行状態: `shared`
- 役割: RN shared component module. Current system: shared UI foundation.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - global UI primitive / design component change

### `Cocolon/components/ui/IconSymbol.ios.tsx`
- repo: `Cocolon`
- system: `shared UI foundation`
- 現行状態: `shared`
- 役割: RN shared component module. Current system: shared UI foundation.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - global UI primitive / design component change

### `Cocolon/components/ui/IconSymbol.tsx`
- repo: `Cocolon`
- system: `shared UI foundation`
- 現行状態: `shared`
- 役割: Fallback for using MaterialIcons on Android and web.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - global UI primitive / design component change

### `Cocolon/components/ui/TabBarBackground.ios.tsx`
- repo: `Cocolon`
- system: `shared UI foundation`
- 現行状態: `shared`
- 役割: RN shared component module. Current system: shared UI foundation.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - global UI primitive / design component change

### `Cocolon/components/ui/TabBarBackground.tsx`
- repo: `Cocolon`
- system: `shared UI foundation`
- 現行状態: `shared`
- 役割: This is a shim for web and Android where the tab bar is generally opaque.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - global UI primitive / design component change

### `Cocolon/guide/guidesJa.js`
- repo: `Cocolon`
- system: `guide content`
- 現行状態: `active`
- 役割: App support file. Current system: guide content.
- 直接関係ファイル:
  - `Cocolon/guide/termsJa.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/CocolonGuideScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/guide/termsJa.js`
  - `Cocolon/screens/CocolonGuideScreen.js`
- 修正対象になりうる変更:
  - guide copy / glossary / help content

### `Cocolon/guide/termsJa.js`
- repo: `Cocolon`
- system: `guide content`
- 現行状態: `shared`
- 役割: App support file. Current system: guide content.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `Cocolon/guide/guidesJa.js` — import
  - `Cocolon/screens/CocolonGuideScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/guide/guidesJa.js`
  - `Cocolon/screens/CocolonGuideScreen.js`
- 修正対象になりうる変更:
  - guide copy / glossary / help content

### `Cocolon/theme/ThemeContext.js`
- repo: `Cocolon`
- system: `theme / UI token`
- 現行状態: `shared`
- 役割: App support file. Current system: theme / UI token.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/components/EmotionReflectionPreviewModal.js` — import
  - `Cocolon/components/GuideRichText.js` — import
  - `Cocolon/components/GuideTermModal.js` — import
  - `Cocolon/components/NoticeModal.js` — import
  - `Cocolon/components/TodayQuestionCard.js` — import
  - `Cocolon/components/TodayQuestionModal.js` — import
  - `Cocolon/components/TutorialOverlay.js` — import
  - `Cocolon/components/TutorialStartModal.js` — import
  - `Cocolon/components/UnreadBadge.js` — import
  - `Cocolon/screens/AccountScreen.js` — import
  - `Cocolon/screens/CocolonGuideScreen.js` — import
  - `Cocolon/screens/DeepInsightScreen.js` — import
  - `Cocolon/screens/DiscoveriesHistoryDetailScreen.js` — import
  - `Cocolon/screens/DiscoveriesHistoryListScreen.js` — import
  - `Cocolon/screens/EchoesHistoryDetailScreen.js` — import
  - `Cocolon/screens/EchoesHistoryListScreen.js` — import
  - `Cocolon/screens/EmotionLogScreen.js` — import
  - `Cocolon/screens/EmotionRankingScreen.js` — import
  - `Cocolon/screens/FollowListScreen.js` — import
  - `Cocolon/screens/InputCountRankingScreen.js` — import
  - `Cocolon/screens/InputLengthRankingScreen.js` — import
  - `Cocolon/screens/InputScreen.js` — import
  - `Cocolon/screens/LoginStreakRankingScreen.js` — import
  - `Cocolon/screens/MenuActionCardCommon.js` — import
  - `Cocolon/screens/MyModelDiscoveriesRankingScreen.js` — import
  - `Cocolon/screens/MyModelEchoesRankingScreen.js` — import
  - `Cocolon/screens/MyModelQuestionsRankingScreen.js` — import
  - `Cocolon/screens/MyModelReflectionsScreen.js` — import
  - `Cocolon/screens/MyModelScreen.js` — import
  - `Cocolon/screens/MyWebCrossLinkSection.js` — import
  - `Cocolon/screens/MyWebHistoryScreen.js` — import
  - `Cocolon/screens/MyWebMenuCommon.js` — import
  - `Cocolon/screens/MyWebReportHistoryScreen.js` — import
  - `Cocolon/screens/MyWebReportViewerScreen.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
  - `Cocolon/screens/NexusScreen.js` — import
  - `Cocolon/screens/NoticeHistoryScreen.js` — import
  - `Cocolon/screens/ProfileCreateScreen.js` — import
  - `Cocolon/screens/RankingTopScreen.js` — import
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js` — import
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js` — import
  - `Cocolon/screens/SelfStructureReportViewerScreen.js` — import
  - `Cocolon/screens/SettingsAppSettingsScreen.js` — import
  - `Cocolon/screens/SubscriptionSelectScreen.js` — import
  - `Cocolon/screens/TodayQuestionHistoryScreen.js` — import
  - `Cocolon/screens/nexus/NexusEmotionRankingCard.js` — import
  - `Cocolon/screens/nexus/NexusReflectionCard.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/components/EmotionReflectionPreviewModal.js`
  - `Cocolon/components/GuideRichText.js`
  - `Cocolon/components/GuideTermModal.js`
  - `Cocolon/components/NoticeModal.js`
  - `Cocolon/components/TodayQuestionCard.js`
  - `Cocolon/components/TodayQuestionModal.js`
  - `Cocolon/components/TutorialOverlay.js`
  - `Cocolon/components/TutorialStartModal.js`
  - `Cocolon/components/UnreadBadge.js`
  - `Cocolon/screens/AccountScreen.js`
  - `Cocolon/screens/CocolonGuideScreen.js`
  - `Cocolon/screens/DeepInsightScreen.js`
  - `Cocolon/screens/DiscoveriesHistoryDetailScreen.js`
  - `Cocolon/screens/DiscoveriesHistoryListScreen.js`
  - `Cocolon/screens/EchoesHistoryDetailScreen.js`
  - `Cocolon/screens/EchoesHistoryListScreen.js`
  - `Cocolon/screens/EmotionLogScreen.js`
  - `Cocolon/screens/EmotionRankingScreen.js`
  - `Cocolon/screens/FollowListScreen.js`
  - `Cocolon/screens/InputCountRankingScreen.js`
  - `Cocolon/screens/InputLengthRankingScreen.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/screens/LoginStreakRankingScreen.js`
  - `Cocolon/screens/MenuActionCardCommon.js`
  - `Cocolon/screens/MyModelDiscoveriesRankingScreen.js`
  - `Cocolon/screens/MyModelEchoesRankingScreen.js`
  - `Cocolon/screens/MyModelQuestionsRankingScreen.js`
  - `Cocolon/screens/MyModelReflectionsScreen.js`
  - `Cocolon/screens/MyModelScreen.js`
  - `Cocolon/screens/MyWebCrossLinkSection.js`
  - `Cocolon/screens/MyWebHistoryScreen.js`
  - `Cocolon/screens/MyWebMenuCommon.js`
  - `Cocolon/screens/MyWebReportHistoryScreen.js`
  - `Cocolon/screens/MyWebReportViewerScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/NexusScreen.js`
  - `Cocolon/screens/NoticeHistoryScreen.js`
  - `Cocolon/screens/ProfileCreateScreen.js`
  - `Cocolon/screens/RankingTopScreen.js`
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js`
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js`
  - `Cocolon/screens/SelfStructureReportViewerScreen.js`
  - `Cocolon/screens/SettingsAppSettingsScreen.js`
  - `Cocolon/screens/SubscriptionSelectScreen.js`
  - `Cocolon/screens/TodayQuestionHistoryScreen.js`
  - `Cocolon/screens/nexus/NexusEmotionRankingCard.js`
  - `Cocolon/screens/nexus/NexusReflectionCard.js`
- 修正対象になりうる変更:
  - theme token and typography change

### `Cocolon/ui/applyTypographyTokens.js`
- repo: `Cocolon`
- system: `theme / UI token`
- 現行状態: `shared`
- 役割: App support file. Current system: theme / UI token.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `Cocolon/components/EmotionReflectionPreviewModal.js` — import
  - `Cocolon/components/selfStructure/SelfStructureDeepRenderer.js` — import
  - `Cocolon/screens/AccountScreen.js` — import
  - `Cocolon/screens/CocolonGuideScreen.js` — import
  - `Cocolon/screens/DeepInsightScreen.js` — import
  - `Cocolon/screens/EmotionLogScreen.js` — import
  - `Cocolon/screens/EmotionRankingScreen.js` — import
  - `Cocolon/screens/FollowListScreen.js` — import
  - `Cocolon/screens/InputCountRankingScreen.js` — import
  - `Cocolon/screens/InputLengthRankingScreen.js` — import
  - `Cocolon/screens/InputScreen.js` — import
  - `Cocolon/screens/LoginStreakRankingScreen.js` — import
  - `Cocolon/screens/MenuActionCardCommon.js` — import
  - `Cocolon/screens/MyModelDiscoveriesRankingScreen.js` — import
  - `Cocolon/screens/MyModelEchoesRankingScreen.js` — import
  - `Cocolon/screens/MyModelQuestionsRankingScreen.js` — import
  - `Cocolon/screens/MyModelReflectionsScreen.js` — import
  - `Cocolon/screens/MyModelScreen.js` — import
  - `Cocolon/screens/MyWebContentFirstScreen.js` — import
  - `Cocolon/screens/MyWebCrossLinkSection.js` — import
  - `Cocolon/screens/MyWebHistoryScreen.js` — import
  - `Cocolon/screens/MyWebMenuCommon.js` — import
  - `Cocolon/screens/MyWebReportHistoryScreen.js` — import
  - `Cocolon/screens/MyWebReportViewerScreen.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
  - `Cocolon/screens/NexusScreen.js` — import
  - `Cocolon/screens/NoticeHistoryScreen.js` — import
  - `Cocolon/screens/ProfileCreateScreen.js` — import
  - `Cocolon/screens/RankingTopScreen.js` — import
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js` — import
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js` — import
  - `Cocolon/screens/SelfStructureReportViewerScreen.js` — import
  - `Cocolon/screens/SubscriptionSelectScreen.js` — import
  - `Cocolon/screens/TodayQuestionHistoryScreen.js` — import
  - `Cocolon/screens/nexus/NexusEmotionRankingCard.js` — import
  - `Cocolon/screens/nexus/NexusReflectionCard.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/EmotionReflectionPreviewModal.js`
  - `Cocolon/components/selfStructure/SelfStructureDeepRenderer.js`
  - `Cocolon/screens/AccountScreen.js`
  - `Cocolon/screens/CocolonGuideScreen.js`
  - `Cocolon/screens/DeepInsightScreen.js`
  - `Cocolon/screens/EmotionLogScreen.js`
  - `Cocolon/screens/EmotionRankingScreen.js`
  - `Cocolon/screens/FollowListScreen.js`
  - `Cocolon/screens/InputCountRankingScreen.js`
  - `Cocolon/screens/InputLengthRankingScreen.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/screens/LoginStreakRankingScreen.js`
  - `Cocolon/screens/MenuActionCardCommon.js`
  - `Cocolon/screens/MyModelDiscoveriesRankingScreen.js`
  - `Cocolon/screens/MyModelEchoesRankingScreen.js`
  - `Cocolon/screens/MyModelQuestionsRankingScreen.js`
  - `Cocolon/screens/MyModelReflectionsScreen.js`
  - `Cocolon/screens/MyModelScreen.js`
  - `Cocolon/screens/MyWebContentFirstScreen.js`
  - `Cocolon/screens/MyWebCrossLinkSection.js`
  - `Cocolon/screens/MyWebHistoryScreen.js`
  - `Cocolon/screens/MyWebMenuCommon.js`
  - `Cocolon/screens/MyWebReportHistoryScreen.js`
  - `Cocolon/screens/MyWebReportViewerScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/NexusScreen.js`
  - `Cocolon/screens/NoticeHistoryScreen.js`
  - `Cocolon/screens/ProfileCreateScreen.js`
  - `Cocolon/screens/RankingTopScreen.js`
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js`
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js`
  - `Cocolon/screens/SelfStructureReportViewerScreen.js`
  - `Cocolon/screens/SubscriptionSelectScreen.js`
  - `Cocolon/screens/TodayQuestionHistoryScreen.js`
  - `Cocolon/screens/nexus/NexusEmotionRankingCard.js`
  - `Cocolon/screens/nexus/NexusReflectionCard.js`
- 修正対象になりうる変更:
  - theme token and typography change

### `Cocolon/ui/uiTokens.js`
- repo: `Cocolon`
- system: `theme / UI token`
- 現行状態: `shared`
- 役割: uiTokens.js
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/components/EmotionReflectionPreviewModal.js` — import
  - `Cocolon/screens/AccountScreen.js` — import
  - `Cocolon/screens/CocolonGuideScreen.js` — import
  - `Cocolon/screens/DeepInsightScreen.js` — import
  - `Cocolon/screens/DiscoveriesHistoryDetailScreen.js` — import
  - `Cocolon/screens/DiscoveriesHistoryListScreen.js` — import
  - `Cocolon/screens/EchoesHistoryDetailScreen.js` — import
  - `Cocolon/screens/EchoesHistoryListScreen.js` — import
  - `Cocolon/screens/EmotionLogScreen.js` — import
  - `Cocolon/screens/EmotionRankingScreen.js` — import
  - `Cocolon/screens/FollowListScreen.js` — import
  - `Cocolon/screens/InputCountRankingScreen.js` — import
  - `Cocolon/screens/InputLengthRankingScreen.js` — import
  - `Cocolon/screens/InputScreen.js` — import
  - `Cocolon/screens/LoginStreakRankingScreen.js` — import
  - `Cocolon/screens/MenuActionCardCommon.js` — import
  - `Cocolon/screens/MyModelDiscoveriesRankingScreen.js` — import
  - `Cocolon/screens/MyModelEchoesRankingScreen.js` — import
  - `Cocolon/screens/MyModelQuestionsRankingScreen.js` — import
  - `Cocolon/screens/MyModelReflectionsScreen.js` — import
  - `Cocolon/screens/MyModelScreen.js` — import
  - `Cocolon/screens/MyWebCrossLinkSection.js` — import
  - `Cocolon/screens/MyWebHistoryScreen.js` — import
  - `Cocolon/screens/MyWebMenuCommon.js` — import
  - `Cocolon/screens/MyWebReportHistoryScreen.js` — import
  - `Cocolon/screens/MyWebReportViewerScreen.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
  - `Cocolon/screens/NexusScreen.js` — import
  - `Cocolon/screens/NoticeHistoryScreen.js` — import
  - `Cocolon/screens/ProfileCreateScreen.js` — import
  - `Cocolon/screens/RankingTopScreen.js` — import
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js` — import
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js` — import
  - `Cocolon/screens/SelfStructureReportViewerScreen.js` — import
  - `Cocolon/screens/SubscriptionSelectScreen.js` — import
  - `Cocolon/screens/TodayQuestionHistoryScreen.js` — import
  - `Cocolon/screens/nexus/NexusEmotionRankingCard.js` — import
  - `Cocolon/screens/nexus/NexusReflectionCard.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/components/EmotionReflectionPreviewModal.js`
  - `Cocolon/screens/AccountScreen.js`
  - `Cocolon/screens/CocolonGuideScreen.js`
  - `Cocolon/screens/DeepInsightScreen.js`
  - `Cocolon/screens/DiscoveriesHistoryDetailScreen.js`
  - `Cocolon/screens/DiscoveriesHistoryListScreen.js`
  - `Cocolon/screens/EchoesHistoryDetailScreen.js`
  - `Cocolon/screens/EchoesHistoryListScreen.js`
  - `Cocolon/screens/EmotionLogScreen.js`
  - `Cocolon/screens/EmotionRankingScreen.js`
  - `Cocolon/screens/FollowListScreen.js`
  - `Cocolon/screens/InputCountRankingScreen.js`
  - `Cocolon/screens/InputLengthRankingScreen.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/screens/LoginStreakRankingScreen.js`
  - `Cocolon/screens/MenuActionCardCommon.js`
  - `Cocolon/screens/MyModelDiscoveriesRankingScreen.js`
  - `Cocolon/screens/MyModelEchoesRankingScreen.js`
  - `Cocolon/screens/MyModelQuestionsRankingScreen.js`
  - `Cocolon/screens/MyModelReflectionsScreen.js`
  - `Cocolon/screens/MyModelScreen.js`
  - `Cocolon/screens/MyWebCrossLinkSection.js`
  - `Cocolon/screens/MyWebHistoryScreen.js`
  - `Cocolon/screens/MyWebMenuCommon.js`
  - `Cocolon/screens/MyWebReportHistoryScreen.js`
  - `Cocolon/screens/MyWebReportViewerScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/NexusScreen.js`
  - `Cocolon/screens/NoticeHistoryScreen.js`
  - `Cocolon/screens/ProfileCreateScreen.js`
  - `Cocolon/screens/RankingTopScreen.js`
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js`
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js`
  - `Cocolon/screens/SelfStructureReportViewerScreen.js`
  - `Cocolon/screens/SubscriptionSelectScreen.js`
  - `Cocolon/screens/TodayQuestionHistoryScreen.js`
  - `Cocolon/screens/nexus/NexusEmotionRankingCard.js`
  - `Cocolon/screens/nexus/NexusReflectionCard.js`
- 修正対象になりうる変更:
  - theme token and typography change


## C4. Runtime patches / repo support

### `Cocolon/README.md`
- repo: `Cocolon`
- system: `app support / build config`
- 現行状態: `active`
- 役割: Welcome to your Expo app 👋
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - build / lint / env / repo-level support change

### `Cocolon/SUBSCRIPTION_RELEASE_PHASE3.md`
- repo: `Cocolon`
- system: `app support / build config`
- 現行状態: `active`
- 役割: Subscription Release Phase 3
- 直接関係ファイル:
  - `Cocolon/lib/iap/iapConfig.js` — document reference
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `Cocolon/lib/iap/iapConfig.js`
- 修正対象になりうる変更:
  - build / lint / env / repo-level support change

### `Cocolon/SUBSCRIPTION_RELEASE_PHASE4.md`
- repo: `Cocolon`
- system: `app support / build config`
- 現行状態: `active`
- 役割: Subscription Release Phase 4
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - build / lint / env / repo-level support change

### `Cocolon/TutorialOverlay.js`
- repo: `Cocolon`
- system: `app support / misc`
- 現行状態: `active`
- 役割: App support file. Current system: app support / misc.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - misc app support change

### `Cocolon/components/GuideRichText.js`
- repo: `Cocolon`
- system: `app support / misc`
- 現行状態: `shared`
- 役割: RN shared component module. Current system: app support / misc.
- 直接関係ファイル:
  - `Cocolon/theme/ThemeContext.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/CocolonGuideScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/screens/CocolonGuideScreen.js`
  - `Cocolon/theme/ThemeContext.js`
- 修正対象になりうる変更:
  - misc app support change

### `Cocolon/components/GuideTermModal.js`
- repo: `Cocolon`
- system: `app support / misc`
- 現行状態: `shared`
- 役割: RN shared component module. Current system: app support / misc.
- 直接関係ファイル:
  - `Cocolon/theme/ThemeContext.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/CocolonGuideScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/screens/CocolonGuideScreen.js`
  - `Cocolon/theme/ThemeContext.js`
- 修正対象になりうる変更:
  - misc app support change

### `Cocolon/patches/@react-native-community+blur+4.4.1.patch`
- repo: `Cocolon`
- system: `runtime patch`
- 現行状態: `legacy-live`
- 役割: Runtime patch for third-party dependency behavior.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - third-party library patch change

### `Cocolon/patches/@react-native-community+slider+5.0.1.patch`
- repo: `Cocolon`
- system: `runtime patch`
- 現行状態: `legacy-live`
- 役割: Runtime patch for third-party dependency behavior.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - third-party library patch change

### `Cocolon/patches/react-native-svg+13.14.0.patch`
- repo: `Cocolon`
- system: `runtime patch`
- 現行状態: `legacy-live`
- 役割: Runtime patch for third-party dependency behavior.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - third-party library patch change

### `Cocolon/patches/react-native-vector-icons+10.3.0.patch`
- repo: `Cocolon`
- system: `runtime patch`
- 現行状態: `legacy-live`
- 役割: Runtime patch for third-party dependency behavior.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - third-party library patch change

### `Cocolon/screens/CocolonGuideScreen.js`
- repo: `Cocolon`
- system: `app support / misc`
- 現行状態: `active`
- 役割: RN screen module. Current system: app support / misc.
- 直接関係ファイル:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/components/GuideRichText.js` — import
  - `Cocolon/components/GuideTermModal.js` — import
  - `Cocolon/guide/guidesJa.js` — import
  - `Cocolon/guide/termsJa.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/components/GuideRichText.js`
  - `Cocolon/components/GuideTermModal.js`
  - `Cocolon/guide/guidesJa.js`
  - `Cocolon/guide/termsJa.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - misc app support change

### `Cocolon/screens/EmotionRankingScreen.js`
- repo: `Cocolon`
- system: `app support / misc`
- 現行状態: `active`
- 役割: RN screen module. Current system: app support / misc.
- 直接関係ファイル:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — endpoint /ranking/emotions
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` — endpoint /ranking/emotions
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py`
- 修正対象になりうる変更:
  - misc app support change

### `Cocolon/screens/MenuActionCardCommon.js`
- repo: `Cocolon`
- system: `app support / misc`
- 現行状態: `shared`
- 役割: RN screen module. Current system: app support / misc.
- 直接関係ファイル:
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/UnreadBadge.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/MyModelScreen.js` — import
  - `Cocolon/screens/MyWebTopScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/UnreadBadge.js`
  - `Cocolon/screens/MyModelScreen.js`
  - `Cocolon/screens/MyWebTopScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - misc app support change


## C5. Account / ProfileCreate backend

### `mashos-api/ai/services/ai_inference/account_delete_service.py`
- repo: `mashos-api`
- system: `account runtime`
- 現行状態: `active`
- 役割: Backend support module. Current system: account runtime.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
  - `mashos-api/ai/services/ai_inference/today_question_store.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py`
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/services/ai_inference/today_question_store.py`
- 修正対象になりうる変更:
  - account lifecycle / status / visibility / active-user touch

### `mashos-api/ai/services/ai_inference/api_account_lifecycle.py`
- repo: `mashos-api`
- system: `account runtime`
- 現行状態: `shared`
- 役割: FastAPI route module for GET /account/display-name/availability, GET /account/profile/me, PATCH /account/profile/me, POST /account/delete
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py` — from import
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — endpoint /account/profile/me
  - `Cocolon/lib/api/account/profileApi.js` — endpoint /account/profile/me
  - `Cocolon/screens/AccountScreen.js` — endpoint /account/profile/me
  - `Cocolon/screens/SettingsAppSettingsScreen.js` — endpoint /account/profile/me
  - `Cocolon/screens/SettingsOtherScreen.js` — endpoint /account/delete
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py` — import
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/lib/api/account/profileApi.js`
  - `Cocolon/screens/AccountScreen.js`
  - `Cocolon/screens/SettingsAppSettingsScreen.js`
  - `Cocolon/screens/SettingsOtherScreen.js`
  - `mashos-api/ai/services/ai_inference/account_delete_service.py`
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py`
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
- 修正対象になりうる変更:
  - account lifecycle / status / visibility / active-user touch

### `mashos-api/ai/services/ai_inference/api_account_status.py`
- repo: `mashos-api`
- system: `account runtime`
- 現行状態: `legacy-live`
- 役割: Account Status (public profile stats) API
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_account_status_store.py` — from import
  - `mashos-api/ai/services/ai_inference/piece_generated_metrics.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_account_status_store.py`
  - `mashos-api/ai/services/ai_inference/piece_generated_metrics.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - account lifecycle / status / visibility / active-user touch

### `mashos-api/ai/services/ai_inference/api_account_visibility.py`
- repo: `mashos-api`
- system: `account runtime`
- 現行状態: `shared`
- 役割: Account Visibility / Privacy Settings API (Cocolon / MashOS / FastAPI)
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_history_manage.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/api_report_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_history_manage.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
  - `mashos-api/ai/services/ai_inference/api_report_reads.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py`
- 修正対象になりうる変更:
  - account lifecycle / status / visibility / active-user touch

### `mashos-api/ai/services/ai_inference/api_activity_login.py`
- repo: `mashos-api`
- system: `account runtime`
- 現行状態: `active`
- 役割: Activity API (Login day touch)
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py`
- 修正対象になりうる変更:
  - account lifecycle / status / visibility / active-user touch

### `mashos-api/ai/services/ai_inference/api_profile_create.py`
- repo: `mashos-api`
- system: `ProfileCreate public API`
- 現行状態: `legacy-live`
- 役割: ProfileCreate API
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/active_users_store.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/mymodel_entitlements.py` — from import
  - `mashos-api/ai/services/ai_inference/reflection_text_formatter.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — import
  - `mashos-api/ai/tests/contract/test_mymodel_reflection_display_contracts.py` — import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/active_users_store.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py`
  - `mashos-api/ai/services/ai_inference/mymodel_entitlements.py`
  - `mashos-api/ai/services/ai_inference/reflection_text_formatter.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
  - `mashos-api/ai/tests/contract/test_mymodel_reflection_display_contracts.py`
- 修正対象になりうる変更:
  - ProfileCreate question/answer/account summary flow


## C6. Subscription / entitlement / distribution backend

### `mashos-api/ai/services/ai_inference/api_subscription.py`
- repo: `mashos-api`
- system: `subscription / entitlement / distribution runtime`
- 現行状態: `shared`
- 役割: FastAPI route module for GET /subscription/bootstrap, GET /subscription/me, POST /subscription/update
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/active_users_store.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/client_compat.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_projection.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py` — from import
- このファイルを直接参照するファイル:
  - `Cocolon/lib/subscriptionApi.js` — endpoint /subscription/bootstrap
  - `Cocolon/lib/subscriptionApi.js` — endpoint /subscription/me
  - `Cocolon/lib/subscriptionApi.js` — endpoint /subscription/update
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/tests/contract/test_emlis_ai_contracts.py` — import
  - `mashos-api/ai/tests/contract/test_subscription_bootstrap_contracts.py` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/lib/subscriptionApi.js`
  - `mashos-api/ai/services/ai_inference/active_users_store.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/client_compat.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py`
  - `mashos-api/ai/services/ai_inference/subscription_projection.py`
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py`
  - `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py`
  - `mashos-api/ai/tests/contract/test_emlis_ai_contracts.py`
  - `mashos-api/ai/tests/contract/test_subscription_bootstrap_contracts.py`
- 修正対象になりうる変更:
  - subscription capability, bootstrap, distribution settings

### `mashos-api/ai/services/ai_inference/report_distribution_push_store.py`
- repo: `mashos-api`
- system: `subscription / entitlement / distribution runtime`
- 現行状態: `shared`
- 役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - subscription capability, bootstrap, distribution settings

### `mashos-api/ai/services/ai_inference/report_distribution_settings_store.py`
- repo: `mashos-api`
- system: `subscription / entitlement / distribution runtime`
- 現行状態: `shared`
- 役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py` — from import
  - `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
  - `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - subscription capability, bootstrap, distribution settings

### `mashos-api/ai/services/ai_inference/subscription.py`
- repo: `mashos-api`
- system: `subscription / entitlement / distribution runtime`
- 現行状態: `legacy-live`
- 役割: Subscription / Mode primitives (Step 1)
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/subscription_context.py` — from import
  - `mashos-api/ai/services/ai_inference/active_users_store.py` — from import
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_history_search.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — from import
  - `mashos-api/ai/services/ai_inference/api_profile_create.py` — from import
  - `mashos-api/ai/services/ai_inference/api_report_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_capability.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py` — from import
  - `mashos-api/ai/services/ai_inference/mymodel_entitlements.py` — from import
  - `mashos-api/ai/services/ai_inference/reflection_publish_entitlements.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_projection.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/tests/contract/test_myprofile_latest_regression.py` — import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py`
  - `mashos-api/ai/services/ai_inference/access_policy/subscription_context.py`
  - `mashos-api/ai/services/ai_inference/active_users_store.py`
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_history_search.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
  - `mashos-api/ai/services/ai_inference/api_profile_create.py`
  - `mashos-api/ai/services/ai_inference/api_report_reads.py`
  - `mashos-api/ai/services/ai_inference/api_subscription.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_capability.py`
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py`
  - `mashos-api/ai/services/ai_inference/mymodel_entitlements.py`
  - `mashos-api/ai/services/ai_inference/reflection_publish_entitlements.py`
  - `mashos-api/ai/services/ai_inference/subscription_projection.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/tests/contract/test_myprofile_latest_regression.py`
- 修正対象になりうる変更:
  - subscription capability, bootstrap, distribution settings

### `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py`
- repo: `mashos-api`
- system: `subscription / entitlement / distribution runtime`
- 現行状態: `legacy-live`
- 役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_capability.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_release_config.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_subscription.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_capability.py`
  - `mashos-api/ai/services/ai_inference/subscription_release_config.py`
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py`
  - `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - subscription capability, bootstrap, distribution settings

### `mashos-api/ai/services/ai_inference/subscription_config.py`
- repo: `mashos-api`
- system: `subscription / entitlement / distribution runtime`
- 現行状態: `legacy-live`
- 役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/subscription_live_console_check.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_runtime_config.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/subscription_live_console_check.py`
  - `mashos-api/ai/services/ai_inference/subscription_runtime_config.py`
- 修正対象になりうる変更:
  - subscription capability, bootstrap, distribution settings

### `mashos-api/ai/services/ai_inference/subscription_live_console_check.py`
- repo: `mashos-api`
- system: `subscription / entitlement / distribution runtime`
- 現行状態: `active`
- 役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/subscription_config.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_release_config.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/subscription_config.py`
  - `mashos-api/ai/services/ai_inference/subscription_release_config.py`
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py`
- 修正対象になりうる変更:
  - subscription capability, bootstrap, distribution settings

### `mashos-api/ai/services/ai_inference/subscription_projection.py`
- repo: `mashos-api`
- system: `subscription / entitlement / distribution runtime`
- 現行状態: `legacy-live`
- 役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_webhooks.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py`
  - `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py`
  - `mashos-api/ai/services/ai_inference/subscription_webhooks.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - subscription capability, bootstrap, distribution settings

### `mashos-api/ai/services/ai_inference/subscription_release_config.py`
- repo: `mashos-api`
- system: `subscription / entitlement / distribution runtime`
- 現行状態: `shared`
- 役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_live_console_check.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py`
  - `mashos-api/ai/services/ai_inference/subscription_live_console_check.py`
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py`
  - `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py`
- 修正対象になりうる変更:
  - subscription capability, bootstrap, distribution settings

### `mashos-api/ai/services/ai_inference/subscription_runtime_config.py`
- repo: `mashos-api`
- system: `subscription / entitlement / distribution runtime`
- 現行状態: `active`
- 役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/subscription_config.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/subscription_config.py`
- 修正対象になりうる変更:
  - subscription capability, bootstrap, distribution settings

### `mashos-api/ai/services/ai_inference/subscription_store.py`
- repo: `mashos-api`
- system: `subscription / entitlement / distribution runtime`
- 現行状態: `shared`
- 役割: subscription_store.py (Step 2)
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/subscription_context.py` — from import
  - `mashos-api/ai/services/ai_inference/active_users_store.py` — from import
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_history_search.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — from import
  - `mashos-api/ai/services/ai_inference/api_profile_create.py` — from import
  - `mashos-api/ai/services/ai_inference/api_report_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py` — from import
  - `mashos-api/ai/services/ai_inference/notice_store.py` — from import
  - `mashos-api/ai/services/ai_inference/reflection_publish_entitlements.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_projection.py` — from import
  - `mashos-api/ai/tests/contract/test_myprofile_latest_regression.py` — import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py`
  - `mashos-api/ai/services/ai_inference/access_policy/subscription_context.py`
  - `mashos-api/ai/services/ai_inference/active_users_store.py`
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_history_search.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
  - `mashos-api/ai/services/ai_inference/api_profile_create.py`
  - `mashos-api/ai/services/ai_inference/api_report_reads.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py`
  - `mashos-api/ai/services/ai_inference/notice_store.py`
  - `mashos-api/ai/services/ai_inference/reflection_publish_entitlements.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_projection.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/tests/contract/test_myprofile_latest_regression.py`
- 修正対象になりうる変更:
  - subscription capability, bootstrap, distribution settings

### `mashos-api/ai/services/ai_inference/subscription_trial_store.py`
- repo: `mashos-api`
- system: `subscription / entitlement / distribution runtime`
- 現行状態: `active`
- 役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - subscription capability, bootstrap, distribution settings

### `mashos-api/ai/services/ai_inference/subscription_verifier_android.py`
- repo: `mashos-api`
- system: `subscription / entitlement / distribution runtime`
- 現行状態: `shared`
- 役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_projection.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_live_console_check.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_release_config.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_webhooks.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py`
  - `mashos-api/ai/services/ai_inference/subscription_live_console_check.py`
  - `mashos-api/ai/services/ai_inference/subscription_projection.py`
  - `mashos-api/ai/services/ai_inference/subscription_release_config.py`
  - `mashos-api/ai/services/ai_inference/subscription_webhooks.py`
- 修正対象になりうる変更:
  - subscription capability, bootstrap, distribution settings

### `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py`
- repo: `mashos-api`
- system: `subscription / entitlement / distribution runtime`
- 現行状態: `shared`
- 役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_projection.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_release_config.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_webhooks.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py`
  - `mashos-api/ai/services/ai_inference/subscription_projection.py`
  - `mashos-api/ai/services/ai_inference/subscription_release_config.py`
  - `mashos-api/ai/services/ai_inference/subscription_webhooks.py`
- 修正対象になりうる変更:
  - subscription capability, bootstrap, distribution settings

### `mashos-api/ai/services/ai_inference/subscription_webhooks.py`
- repo: `mashos-api`
- system: `subscription / entitlement / distribution runtime`
- 現行状態: `active`
- 役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/subscription_projection.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/subscription_projection.py`
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py`
  - `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py`
- 修正対象になりうる変更:
  - subscription capability, bootstrap, distribution settings


## C7. Rule / contract / guard / maintenance

### `mashos-api/ai/docs/API_CONTRACT_POLICY.md`
- repo: `mashos-api`
- system: `rule / policy document`
- 現行状態: `legacy-live`
- 役割: Cocolon Public API Contract Policy
- 直接関係ファイル:
  - `mashos-api/scripts/check_no_direct_supabase.py` — document reference
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/scripts/check_no_direct_supabase.py`
- 修正対象になりうる変更:
  - contract/rule file alignment

### `mashos-api/ai/docs/NATIONAL_ALIGNMENT_AUDIT_PHASE5.md`
- repo: `mashos-api`
- system: `rule / policy document`
- 現行状態: `legacy-live`
- 役割: National Alignment Audit — Phase 5
- 直接関係ファイル:
  - `Cocolon/lib/apiClient.js` — document reference
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `Cocolon/lib/apiClient.js`
- 修正対象になりうる変更:
  - contract/rule file alignment

### `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md`
- repo: `mashos-api`
- system: `rule / policy document`
- 現行状態: `legacy-live`
- 役割: Cocolon Public API Registry
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - contract/rule file alignment

### `mashos-api/ai/docs/TUTORIAL_STABILITY_REDESIGN.md`
- repo: `mashos-api`
- system: `rule / policy document`
- 現行状態: `shared`
- 役割: Tutorial Stability Redesign
- 直接関係ファイル:
  - `Cocolon/components/TutorialOverlay.js` — document reference
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/TutorialOverlay.js`
- 修正対象になりうる変更:
  - contract/rule file alignment

### `mashos-api/ai/docs/api_contract.txt`
- repo: `mashos-api`
- system: `rule / policy document`
- 現行状態: `shared`
- 役割: Rule / policy / behavior document used when editing runtime files.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - contract/rule file alignment

### `mashos-api/ai/docs/data_ingest_guide.txt`
- repo: `mashos-api`
- system: `rule / policy document`
- 現行状態: `shared`
- 役割: Rule / policy / behavior document used when editing runtime files.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - contract/rule file alignment

### `mashos-api/ai/docs/iap_subscription_update.md`
- repo: `mashos-api`
- system: `rule / policy document`
- 現行状態: `shared`
- 役割: IAP: /subscription/update 導入メモ（MVP）
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - contract/rule file alignment

### `mashos-api/ai/docs/{{AI_NAME}}_spec.txt`
- repo: `mashos-api`
- system: `rule / policy document`
- 現行状態: `shared`
- 役割: Rule / policy / behavior document used when editing runtime files.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - contract/rule file alignment

### `mashos-api/ai/tests/contract/conftest.py`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Test module that constrains current backend behavior.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/fixtures/account_display_name_availability_response_shape_v1.json`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Contract fixture file used by API contract / snapshot tests.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/fixtures/account_profile_me_response_shape_v1.json`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Contract fixture file used by API contract / snapshot tests.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/fixtures/app_bootstrap_request_client_meta_v1.json`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Contract fixture file used by API contract / snapshot tests.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/fixtures/app_bootstrap_response_shape_v1.json`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Contract fixture file used by API contract / snapshot tests.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/fixtures/app_startup_response_shape_v1.json`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Contract fixture file used by API contract / snapshot tests.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/fixtures/global_summary_response_shape_v1.json`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Contract fixture file used by API contract / snapshot tests.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/fixtures/home_state_response_shape_v1.json`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Contract fixture file used by API contract / snapshot tests.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/fixtures/legacy_emotion_submit_request_v1.json`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Contract fixture file used by API contract / snapshot tests.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/fixtures/legacy_emotion_submit_response_shape_v1.json`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Contract fixture file used by API contract / snapshot tests.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/fixtures/legacy_mymodel_create_answers_request_v1.json`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Contract fixture file used by API contract / snapshot tests.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/fixtures/mymodel_create_answers_response_shape_v1.json`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Contract fixture file used by API contract / snapshot tests.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/fixtures/mymodel_create_questions_response_shape_v1.json`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Contract fixture file used by API contract / snapshot tests.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/fixtures/myprofile_latest_status_response_shape_v1.json`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Contract fixture file used by API contract / snapshot tests.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/tests/contract/test_myprofile_latest_regression.py` — fixture
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/tests/contract/test_myprofile_latest_regression.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/fixtures/myprofile_reports_history_response_shape_v1.json`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Contract fixture file used by API contract / snapshot tests.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/fixtures/report_distribution_settings_response_shape_v1.json`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Contract fixture file used by API contract / snapshot tests.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/fixtures/report_reads_myweb_unread_status_response_shape_v1.json`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Contract fixture file used by API contract / snapshot tests.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/fixtures/subscription_bootstrap_response_shape_v1.json`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Contract fixture file used by API contract / snapshot tests.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/test_api_contract_headers.py`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `legacy-live`
- 役割: Test module that constrains current backend behavior.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py` — import
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py` — import
  - `mashos-api/ai/services/ai_inference/api_contract_registry.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — import
  - `mashos-api/ai/services/ai_inference/api_global_summary.py` — import
  - `mashos-api/ai/services/ai_inference/api_home_state.py` — import
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — import
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py` — import
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` — import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py`
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py`
  - `mashos-api/ai/services/ai_inference/api_contract_registry.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_global_summary.py`
  - `mashos-api/ai/services/ai_inference/api_home_state.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py`
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/test_api_contract_registry.py`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `legacy-live`
- 役割: Test module that constrains current backend behavior.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_contract_registry.py` — from import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_contract_registry.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `legacy-live`
- 役割: Test module that constrains current backend behavior.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py` — import
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py` — import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — import
  - `mashos-api/ai/services/ai_inference/api_global_summary.py` — import
  - `mashos-api/ai/services/ai_inference/api_home_state.py` — import
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py` — import
  - `mashos-api/ai/services/ai_inference/api_profile_create.py` — import
  - `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py` — import
  - `mashos-api/ai/services/ai_inference/api_report_reads.py` — import
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py` — import
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` — import
  - `mashos-api/ai/tests/contract/fixtures/account_display_name_availability_response_shape_v1.json` — fixture
  - `mashos-api/ai/tests/contract/fixtures/account_profile_me_response_shape_v1.json` — fixture
  - `mashos-api/ai/tests/contract/fixtures/app_bootstrap_request_client_meta_v1.json` — fixture
  - `mashos-api/ai/tests/contract/fixtures/app_bootstrap_response_shape_v1.json` — fixture
  - `mashos-api/ai/tests/contract/fixtures/app_startup_response_shape_v1.json` — fixture
  - `mashos-api/ai/tests/contract/fixtures/global_summary_response_shape_v1.json` — fixture
  - `mashos-api/ai/tests/contract/fixtures/home_state_response_shape_v1.json` — fixture
  - `mashos-api/ai/tests/contract/fixtures/legacy_emotion_submit_request_v1.json` — fixture
  - `mashos-api/ai/tests/contract/fixtures/legacy_emotion_submit_response_shape_v1.json` — fixture
  - `mashos-api/ai/tests/contract/fixtures/legacy_mymodel_create_answers_request_v1.json` — fixture
  - `mashos-api/ai/tests/contract/fixtures/mymodel_create_answers_response_shape_v1.json` — fixture
  - `mashos-api/ai/tests/contract/fixtures/myprofile_reports_history_response_shape_v1.json` — fixture
  - `mashos-api/ai/tests/contract/fixtures/report_distribution_settings_response_shape_v1.json` — fixture
  - `mashos-api/ai/tests/contract/fixtures/report_reads_myweb_unread_status_response_shape_v1.json` — fixture
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py`
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_global_summary.py`
  - `mashos-api/ai/services/ai_inference/api_home_state.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py`
  - `mashos-api/ai/services/ai_inference/api_profile_create.py`
  - `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py`
  - `mashos-api/ai/services/ai_inference/api_report_reads.py`
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py`
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py`
  - `mashos-api/ai/tests/contract/fixtures/account_display_name_availability_response_shape_v1.json`
  - `mashos-api/ai/tests/contract/fixtures/account_profile_me_response_shape_v1.json`
  - `mashos-api/ai/tests/contract/fixtures/app_bootstrap_request_client_meta_v1.json`
  - `mashos-api/ai/tests/contract/fixtures/app_bootstrap_response_shape_v1.json`
  - `mashos-api/ai/tests/contract/fixtures/app_startup_response_shape_v1.json`
  - `mashos-api/ai/tests/contract/fixtures/global_summary_response_shape_v1.json`
  - `mashos-api/ai/tests/contract/fixtures/home_state_response_shape_v1.json`
  - `mashos-api/ai/tests/contract/fixtures/legacy_emotion_submit_request_v1.json`
  - `mashos-api/ai/tests/contract/fixtures/legacy_emotion_submit_response_shape_v1.json`
  - `mashos-api/ai/tests/contract/fixtures/legacy_mymodel_create_answers_request_v1.json`
  - `mashos-api/ai/tests/contract/fixtures/mymodel_create_answers_response_shape_v1.json`
  - `mashos-api/ai/tests/contract/fixtures/myprofile_reports_history_response_shape_v1.json`
  - `mashos-api/ai/tests/contract/fixtures/report_distribution_settings_response_shape_v1.json`
  - `mashos-api/ai/tests/contract/fixtures/report_reads_myweb_unread_status_response_shape_v1.json`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/test_emlis_ai_contracts.py`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `legacy-live`
- 役割: Test module that constrains current backend behavior.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — import
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — import
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py` — import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_subscription.py`
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/test_generated_reflection_display_contracts.py`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Test module that constrains current backend behavior.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — import
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py` — import
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — import
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py` — from import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/test_generated_reflection_maintenance_contracts.py`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Test module that constrains current backend behavior.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_reflection_engine.py` — import
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — import
  - `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py` — import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/astor_reflection_engine.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/test_mymodel_reflection_display_contracts.py`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `legacy-live`
- 役割: Test module that constrains current backend behavior.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — import
  - `mashos-api/ai/services/ai_inference/api_profile_create.py` — import
  - `mashos-api/ai/services/ai_inference/reflection_text_formatter.py` — import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/api_profile_create.py`
  - `mashos-api/ai/services/ai_inference/reflection_text_formatter.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/test_myprofile_latest_regression.py`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Test module that constrains current backend behavior.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — import
  - `mashos-api/ai/services/ai_inference/subscription.py` — import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — import
  - `mashos-api/ai/tests/contract/fixtures/myprofile_latest_status_response_shape_v1.json` — fixture
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/tests/contract/fixtures/myprofile_latest_status_response_shape_v1.json`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/test_notice_contracts.py`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Test module that constrains current backend behavior.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_notice.py` — import
  - `mashos-api/ai/services/ai_inference/notice_store.py` — import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_notice.py`
  - `mashos-api/ai/services/ai_inference/notice_store.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/test_publish_governance.py`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `legacy-live`
- 役割: Test module that constrains current backend behavior.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_global_summary.py` — import
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py` — import
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — import
  - `mashos-api/ai/services/ai_inference/api_report_reads.py` — import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_global_summary.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
  - `mashos-api/ai/services/ai_inference/api_report_reads.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/test_rn_surface_guards.py`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Test module that constrains current backend behavior.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/contract/test_subscription_bootstrap_contracts.py`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Test module that constrains current backend behavior.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_subscription.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/smoke_test.py`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Test module that constrains current backend behavior.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/guards/date_guard.py` — from import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/guards/date_guard.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/test_emlis_ai_greeting_state_store.py`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Test module that constrains current backend behavior.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py` — import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/test_emlis_ai_observation_kernel.py`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Test module that constrains current backend behavior.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_capability.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_observation_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py` — from import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_capability.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_observation_kernel.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/ai/tests/test_emlis_ai_user_model_store.py`
- repo: `mashos-api`
- system: `contract / regression test`
- 現行状態: `shared`
- 役割: Test module that constrains current backend behavior.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py` — import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py`
- 修正対象になりうる変更:
  - contract guard / regression verification

### `mashos-api/scripts/backfill_generated_reflection_display_cleanup.py`
- repo: `mashos-api`
- system: `maintenance / guard script`
- 現行状態: `active`
- 役割: Maintenance or guard script for current runtime / contract discipline.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py` — from import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py`
- 修正対象になりうる変更:
  - maintenance runner or guard script change

### `mashos-api/scripts/check_no_direct_supabase.py`
- repo: `mashos-api`
- system: `maintenance / guard script`
- 現行状態: `active`
- 役割: Maintenance or guard script for current runtime / contract discipline.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/docs/API_CONTRACT_POLICY.md` — document reference
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/docs/API_CONTRACT_POLICY.md`
- 修正対象になりうる変更:
  - maintenance runner or guard script change

### `mashos-api/scripts/mashos_cron_runner.py`
- repo: `mashos-api`
- system: `maintenance / guard script`
- 現行状態: `active`
- 役割: mashos_cron_runner.py (Phase 4.5)
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - maintenance runner or guard script change


## C8. Backend support / config / assets / tools

### `mashos-api/ai/.env`
- repo: `mashos-api`
- system: `backend support document`
- 現行状態: `active`
- 役割: Backend support module. Current system: backend support document.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - support / migration document change

### `mashos-api/ai/Makefile`
- repo: `mashos-api`
- system: `backend support document`
- 現行状態: `active`
- 役割: Backend support module. Current system: backend support document.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - support / migration document change

### `mashos-api/ai/POST_MIGRATION_CHECKLIST.md`
- repo: `mashos-api`
- system: `backend support document`
- 現行状態: `active`
- 役割: Post Migration Checklist
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - support / migration document change

### `mashos-api/ai/README_MIGRATION_QUICKSTART.md`
- repo: `mashos-api`
- system: `backend support document`
- 現行状態: `active`
- 役割: MashOS/ai Quickstart (after migration)
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - support / migration document change

### `mashos-api/ai/configs/app_ids.yaml`
- repo: `mashos-api`
- system: `runtime / training config`
- 現行状態: `active`
- 役割: Config / schema / text asset used by current backend support or contract flow.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - config-driven runtime or support config change

### `mashos-api/ai/configs/model_train.yaml`
- repo: `mashos-api`
- system: `runtime / training config`
- 現行状態: `active`
- 役割: Config / schema / text asset used by current backend support or contract flow.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - config-driven runtime or support config change

### `mashos-api/ai/configs/runtime.yaml`
- repo: `mashos-api`
- system: `runtime / training config`
- 現行状態: `active`
- 役割: Config / schema / text asset used by current backend support or contract flow.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - config-driven runtime or support config change

### `mashos-api/ai/ingestion/mapping_sample.yaml`
- repo: `mashos-api`
- system: `runtime asset / prompt / schema`
- 現行状態: `active`
- 役割: Config / schema / text asset used by current backend support or contract flow.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - prompt/template/schema asset change

### `mashos-api/ai/ingestion/user_logs_sample.csv`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `active`
- 役割: Config / schema / text asset used by current backend support or contract flow.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - misc backend support change

### `mashos-api/ai/services/ai_inference/.env.subscription.backend.example`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `active`
- 役割: Backend support module. Current system: backend support / misc.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - misc backend support change

### `mashos-api/ai/services/ai_inference/access_policy/__init__.py`
- repo: `mashos-api`
- system: `read-side access policy`
- 現行状態: `shared`
- 役割: Read-side access policy module. Current role:   init  .
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/report_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/subscription_context.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py` — from import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py`
  - `mashos-api/ai/services/ai_inference/access_policy/report_access_policy.py`
  - `mashos-api/ai/services/ai_inference/access_policy/subscription_context.py`
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py`
- 修正対象になりうる変更:
  - viewer tier, publish visibility, read filtering

### `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py`
- repo: `mashos-api`
- system: `read-side access policy`
- 現行状態: `shared`
- 役割: Read-side access policy module. Current role: piece access policy.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/mymodel_entitlements.py` — from import
  - `mashos-api/ai/services/ai_inference/publish_governance.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/__init__.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/__init__.py`
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/mymodel_entitlements.py`
  - `mashos-api/ai/services/ai_inference/publish_governance.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
- 修正対象になりうる変更:
  - viewer tier, publish visibility, read filtering

### `mashos-api/ai/services/ai_inference/access_policy/report_access_policy.py`
- repo: `mashos-api`
- system: `read-side access policy`
- 現行状態: `shared`
- 役割: Read-side access policy module. Current role: report access policy.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/publish_governance.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/__init__.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/__init__.py`
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py`
  - `mashos-api/ai/services/ai_inference/publish_governance.py`
- 修正対象になりうる変更:
  - viewer tier, publish visibility, read filtering

### `mashos-api/ai/services/ai_inference/access_policy/subscription_context.py`
- repo: `mashos-api`
- system: `read-side access policy`
- 現行状態: `shared`
- 役割: Read-side access policy module. Current role: subscription context.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/publish_governance.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/__init__.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/__init__.py`
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py`
  - `mashos-api/ai/services/ai_inference/publish_governance.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
- 修正対象になりうる変更:
  - viewer tier, publish visibility, read filtering

### `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py`
- repo: `mashos-api`
- system: `read-side access policy`
- 現行状態: `shared`
- 役割: Read-side access policy module. Current role: viewer access policy.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/report_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/subscription_context.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/__init__.py` — from import
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/__init__.py`
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py`
  - `mashos-api/ai/services/ai_inference/access_policy/report_access_policy.py`
  - `mashos-api/ai/services/ai_inference/access_policy/subscription_context.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
- 修正対象になりうる変更:
  - viewer tier, publish visibility, read filtering

### `mashos-api/ai/services/ai_inference/analysis_engine_adapter.py`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `active`
- 役割: Backend support module. Current system: backend support / misc.
- 直接関係ファイル:
  - `mashos-api/ai/services/analysis_engine/models.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/analysis_engine/models.py`
- 修正対象になりうる変更:
  - misc backend support change

### `mashos-api/ai/services/ai_inference/api_contract_registry.py`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `legacy-live`
- 役割: FastAPI route module in ai_inference.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/middleware_api_contract.py` — from import
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py` — from import
  - `mashos-api/ai/tests/contract/test_api_contract_registry.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/middleware_api_contract.py`
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py`
  - `mashos-api/ai/tests/contract/test_api_contract_registry.py`
- 修正対象になりうる変更:
  - misc backend support change

### `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `legacy-live`
- 役割: Phase 4: 0:00配布を“本当に配布”にする（サーバCron）
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — from import
  - `mashos-api/ai/services/ai_inference/cron_run_store.py` — from import
  - `mashos-api/ai/services/ai_inference/generation_lock.py` — from import
  - `mashos-api/ai/services/ai_inference/observability.py` — from import
  - `mashos-api/ai/services/ai_inference/publish_governance.py` — from import
  - `mashos-api/ai/services/ai_inference/report_distribution_push_store.py` — from import
  - `mashos-api/ai/services/ai_inference/report_distribution_settings_store.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`
  - `mashos-api/ai/services/ai_inference/cron_run_store.py`
  - `mashos-api/ai/services/ai_inference/generation_lock.py`
  - `mashos-api/ai/services/ai_inference/observability.py`
  - `mashos-api/ai/services/ai_inference/publish_governance.py`
  - `mashos-api/ai/services/ai_inference/report_distribution_push_store.py`
  - `mashos-api/ai/services/ai_inference/report_distribution_settings_store.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
- 修正対象になりうる変更:
  - misc backend support change

### `mashos-api/ai/services/ai_inference/api_emotion_secret.py`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `active`
- 役割: Emotion Secret Update API for Cocolon
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`
- 修正対象になりうる変更:
  - misc backend support change

### `mashos-api/ai/services/ai_inference/api_nexus.py`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `active`
- 役割: Nexus read-side routes for the new emotion-generated Reflection feed.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
- 修正対象になりうる変更:
  - misc backend support change

### `mashos-api/ai/services/ai_inference/api_public_profile.py`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `legacy-live`
- 役割: Public (unauthenticated) profile resolver for share URLs.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/app.py`
- 修正対象になりうる変更:
  - misc backend support change

### `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py`
- repo: `mashos-api`
- system: `subscription / entitlement / distribution runtime`
- 現行状態: `shared`
- 役割: FastAPI route module for GET /report-distribution/settings, PATCH /report-distribution/settings
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/active_users_store.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/report_distribution_settings_store.py` — from import
- このファイルを直接参照するファイル:
  - `Cocolon/lib/reportDistributionApi.js` — endpoint /report-distribution/settings
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/lib/reportDistributionApi.js`
  - `mashos-api/ai/services/ai_inference/active_users_store.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/report_distribution_settings_store.py`
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
- 修正対象になりうる変更:
  - subscription capability, bootstrap, distribution settings

### `mashos-api/ai/services/ai_inference/app.py`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `legacy-live`
- 役割: Cocolon MyModel Inference API (Release-oriented)
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py` — from import
  - `mashos-api/ai/services/ai_inference/api_account_status.py` — from import
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py` — from import
  - `mashos-api/ai/services/ai_inference/api_activity_login.py` — from import
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py` — from import
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_history_manage.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_history_search.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_secret.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_friends.py` — from import
  - `mashos-api/ai/services/ai_inference/api_global_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/api_home_state.py` — from import
  - `mashos-api/ai/services/ai_inference/api_input_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — from import
  - `mashos-api/ai/services/ai_inference/api_nexus.py` — from import
  - `mashos-api/ai/services/ai_inference/api_notice.py` — from import
  - `mashos-api/ai/services/ai_inference/api_profile_create.py` — from import
  - `mashos-api/ai/services/ai_inference/api_public_profile.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_discoveries.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_resonances.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_views.py` — from import
  - `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py` — from import
  - `mashos-api/ai/services/ai_inference/api_report_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_core.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myprofile_persona.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myweb_insight.py` — from import
  - `mashos-api/ai/services/ai_inference/mashlogic_qa_enhancer.py` — from import
  - `mashos-api/ai/services/ai_inference/middleware_active_user_touch.py` — from import
  - `mashos-api/ai/services/ai_inference/middleware_api_contract.py` — from import
  - `mashos-api/ai/services/ai_inference/middleware_request_perf.py` — from import
  - `mashos-api/ai/services/ai_inference/prompt_templates.py` — from import
  - `mashos-api/ai/services/ai_inference/request_metrics.py` — import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — import
  - `mashos-api/ai/services/ai_inference/structure_dict.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_live_console_check.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_release_config.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_runtime_config.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_webhooks.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py`
  - `mashos-api/ai/services/ai_inference/api_account_status.py`
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py`
  - `mashos-api/ai/services/ai_inference/api_activity_login.py`
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py`
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_history_manage.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_history_search.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_secret.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_friends.py`
  - `mashos-api/ai/services/ai_inference/api_global_summary.py`
  - `mashos-api/ai/services/ai_inference/api_home_state.py`
  - `mashos-api/ai/services/ai_inference/api_input_summary.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
  - `mashos-api/ai/services/ai_inference/api_nexus.py`
  - `mashos-api/ai/services/ai_inference/api_notice.py`
  - `mashos-api/ai/services/ai_inference/api_profile_create.py`
  - `mashos-api/ai/services/ai_inference/api_public_profile.py`
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_discoveries.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_resonances.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_views.py`
  - `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py`
  - `mashos-api/ai/services/ai_inference/api_report_reads.py`
  - `mashos-api/ai/services/ai_inference/api_subscription.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
  - `mashos-api/ai/services/ai_inference/astor_core.py`
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`
  - `mashos-api/ai/services/ai_inference/astor_myprofile_persona.py`
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`
  - `mashos-api/ai/services/ai_inference/astor_myweb_insight.py`
  - `mashos-api/ai/services/ai_inference/mashlogic_qa_enhancer.py`
  - `mashos-api/ai/services/ai_inference/middleware_active_user_touch.py`
  - `mashos-api/ai/services/ai_inference/middleware_api_contract.py`
  - `mashos-api/ai/services/ai_inference/middleware_request_perf.py`
  - `mashos-api/ai/services/ai_inference/prompt_templates.py`
  - `mashos-api/ai/services/ai_inference/request_metrics.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/structure_dict.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_live_console_check.py`
  - `mashos-api/ai/services/ai_inference/subscription_release_config.py`
  - `mashos-api/ai/services/ai_inference/subscription_runtime_config.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/subscription_webhooks.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - misc backend support change

### `mashos-api/ai/services/ai_inference/client_compat.py`
- repo: `mashos-api`
- system: `runtime boundary / infrastructure`
- 現行状態: `shared`
- 役割: Backend support module. Current system: runtime boundary / infrastructure.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_home_state.py` — from import
  - `mashos-api/ai/services/ai_inference/api_notice.py` — from import
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/middleware_active_user_touch.py` — from import
  - `mashos-api/ai/services/ai_inference/notice_store.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_home_state.py`
  - `mashos-api/ai/services/ai_inference/api_notice.py`
  - `mashos-api/ai/services/ai_inference/api_subscription.py`
  - `mashos-api/ai/services/ai_inference/middleware_active_user_touch.py`
  - `mashos-api/ai/services/ai_inference/notice_store.py`
- 修正対象になりうる変更:
  - middleware, supabase boundary, perf/observability, infra guard

### `mashos-api/ai/services/ai_inference/cron_run_store.py`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `active`
- 役割: Phase11+ : Cron結果をSupabaseテーブルに永続化（ダッシュボード化）
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/observability.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/observability.py`
- 修正対象になりうる変更:
  - misc backend support change

### `mashos-api/ai/services/ai_inference/emotion_history_search_service.py`
- repo: `mashos-api`
- system: `EmlisAI / immediate reply runtime`
- 現行状態: `shared`
- 役割: Backend support module. Current system: EmlisAI / immediate reply runtime.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - input_feedback, world model, context/style/reply

### `mashos-api/ai/services/ai_inference/generation_lock.py`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `shared`
- 役割: Phase10: 競合対策（同時実行の防止）
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/observability.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/observability.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - misc backend support change

### `mashos-api/ai/services/ai_inference/guards/date_guard.py`
- repo: `mashos-api`
- system: `runtime boundary / infrastructure`
- 現行状態: `shared`
- 役割: Backend support module. Current system: runtime boundary / infrastructure.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/persona_engine.py` — from import
  - `mashos-api/ai/tests/smoke_test.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/persona_engine.py`
  - `mashos-api/ai/tests/smoke_test.py`
- 修正対象になりうる変更:
  - middleware, supabase boundary, perf/observability, infra guard

### `mashos-api/ai/services/ai_inference/middleware_active_user_touch.py`
- repo: `mashos-api`
- system: `runtime boundary / infrastructure`
- 現行状態: `active`
- 役割: middleware_active_user_touch.py (Phase 8++++++)
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/active_users_store.py` — from import
  - `mashos-api/ai/services/ai_inference/client_compat.py` — from import
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_auth_token_cache.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/active_users_store.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/client_compat.py`
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_auth_token_cache.py`
- 修正対象になりうる変更:
  - middleware, supabase boundary, perf/observability, infra guard

### `mashos-api/ai/services/ai_inference/middleware_api_contract.py`
- repo: `mashos-api`
- system: `runtime boundary / infrastructure`
- 現行状態: `legacy-live`
- 役割: Backend support module. Current system: runtime boundary / infrastructure.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_contract_registry.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_contract_registry.py`
  - `mashos-api/ai/services/ai_inference/app.py`
- 修正対象になりうる変更:
  - middleware, supabase boundary, perf/observability, infra guard

### `mashos-api/ai/services/ai_inference/middleware_request_perf.py`
- repo: `mashos-api`
- system: `runtime boundary / infrastructure`
- 現行状態: `active`
- 役割: Backend support module. Current system: runtime boundary / infrastructure.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/observability.py` — from import
  - `mashos-api/ai/services/ai_inference/request_metrics.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/observability.py`
  - `mashos-api/ai/services/ai_inference/request_metrics.py`
- 修正対象になりうる変更:
  - middleware, supabase boundary, perf/observability, infra guard

### `mashos-api/ai/services/ai_inference/mymodel_entitlements.py`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `shared`
- 役割: Single source of truth for MyModel Create / Reflections entitlement rules.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/api_profile_create.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py`
  - `mashos-api/ai/services/ai_inference/api_profile_create.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
- 修正対象になりうる変更:
  - misc backend support change

### `mashos-api/ai/services/ai_inference/observability.py`
- repo: `mashos-api`
- system: `runtime boundary / infrastructure`
- 現行状態: `shared`
- 役割: Phase11: 監視/ログ/通知の可観測性
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py` — from import
  - `mashos-api/ai/services/ai_inference/cron_run_store.py` — from import
  - `mashos-api/ai/services/ai_inference/generation_lock.py` — from import
  - `mashos-api/ai/services/ai_inference/middleware_request_perf.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
  - `mashos-api/ai/services/ai_inference/cron_run_store.py`
  - `mashos-api/ai/services/ai_inference/generation_lock.py`
  - `mashos-api/ai/services/ai_inference/middleware_request_perf.py`
- 修正対象になりうる変更:
  - middleware, supabase boundary, perf/observability, infra guard

### `mashos-api/ai/services/ai_inference/prompt_templates.py`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `active`
- 役割: Server-side prompt templates registry (Phase5)
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/app.py`
- 修正対象になりうる変更:
  - misc backend support change

### `mashos-api/ai/services/ai_inference/prompts/interpret.en.txt`
- repo: `mashos-api`
- system: `runtime asset / prompt / schema`
- 現行状態: `active`
- 役割: Runtime prompt / response template asset consumed by backend services.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - prompt/template/schema asset change

### `mashos-api/ai/services/ai_inference/prompts/interpret.ja.txt`
- repo: `mashos-api`
- system: `runtime asset / prompt / schema`
- 現行状態: `active`
- 役割: Runtime prompt / response template asset consumed by backend services.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - prompt/template/schema asset change

### `mashos-api/ai/services/ai_inference/publish_governance.py`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `shared`
- 役割: Backend support module. Current system: backend support / misc.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/report_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/subscription_context.py` — from import
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_history_search.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/api_report_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py`
  - `mashos-api/ai/services/ai_inference/access_policy/report_access_policy.py`
  - `mashos-api/ai/services/ai_inference/access_policy/subscription_context.py`
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_history_search.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
  - `mashos-api/ai/services/ai_inference/api_report_reads.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
- 修正対象になりうる変更:
  - misc backend support change

### `mashos-api/ai/services/ai_inference/request_metrics.py`
- repo: `mashos-api`
- system: `runtime boundary / infrastructure`
- 現行状態: `shared`
- 役割: Backend support module. Current system: runtime boundary / infrastructure.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — import
  - `mashos-api/ai/services/ai_inference/middleware_request_perf.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/middleware_request_perf.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - middleware, supabase boundary, perf/observability, infra guard

### `mashos-api/ai/services/ai_inference/requirements.txt`
- repo: `mashos-api`
- system: `runtime boundary / infrastructure`
- 現行状態: `active`
- 役割: Config / schema / text asset used by current backend support or contract flow.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - middleware, supabase boundary, perf/observability, infra guard

### `mashos-api/ai/services/ai_inference/structure_dict.py`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `shared`
- 役割: Mash構造辞書ローダー & 簡易応答エンジン
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myweb_insight.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`
  - `mashos-api/ai/services/ai_inference/astor_myweb_insight.py`
- 修正対象になりうる変更:
  - misc backend support change

### `mashos-api/ai/services/ai_inference/supabase_auth_token_cache.py`
- repo: `mashos-api`
- system: `runtime boundary / infrastructure`
- 現行状態: `shared`
- 役割: supabase_auth_token_cache.py (Phase 8+++)
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/middleware_active_user_touch.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/middleware_active_user_touch.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - middleware, supabase boundary, perf/observability, infra guard

### `mashos-api/ai/services/ai_inference/supabase_client.py`
- repo: `mashos-api`
- system: `runtime boundary / infrastructure`
- 現行状態: `shared`
- 役割: Shared Supabase HTTP client (Phase 1)
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/request_metrics.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py` — from import
  - `mashos-api/ai/services/ai_inference/active_users_store.py` — from import
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py` — from import
  - `mashos-api/ai/services/ai_inference/api_account_status.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_history_manage.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_friends.py` — from import
  - `mashos-api/ai/services/ai_inference/api_input_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — from import
  - `mashos-api/ai/services/ai_inference/api_profile_create.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — from import
  - `mashos-api/ai/services/ai_inference/api_report_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_account_status_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_account_status_store.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_store.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_store.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_history_search_service.py` — from import
  - `mashos-api/ai/services/ai_inference/generation_lock.py` — from import
  - `mashos-api/ai/services/ai_inference/notice_store.py` — from import
  - `mashos-api/ai/services/ai_inference/piece_generated_metrics.py` — from import
  - `mashos-api/ai/services/ai_inference/report_distribution_push_store.py` — from import
  - `mashos-api/ai/services/ai_inference/report_distribution_settings_store.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_projection.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_trial_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_auth_token_cache.py` — from import
  - `mashos-api/ai/services/ai_inference/today_question_store.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py`
  - `mashos-api/ai/services/ai_inference/active_users_store.py`
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py`
  - `mashos-api/ai/services/ai_inference/api_account_status.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_history_manage.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_friends.py`
  - `mashos-api/ai/services/ai_inference/api_input_summary.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
  - `mashos-api/ai/services/ai_inference/api_profile_create.py`
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
  - `mashos-api/ai/services/ai_inference/api_report_reads.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_account_status_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_account_status_store.py`
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_store.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_store.py`
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py`
  - `mashos-api/ai/services/ai_inference/emotion_history_search_service.py`
  - `mashos-api/ai/services/ai_inference/generation_lock.py`
  - `mashos-api/ai/services/ai_inference/notice_store.py`
  - `mashos-api/ai/services/ai_inference/piece_generated_metrics.py`
  - `mashos-api/ai/services/ai_inference/report_distribution_push_store.py`
  - `mashos-api/ai/services/ai_inference/report_distribution_settings_store.py`
  - `mashos-api/ai/services/ai_inference/request_metrics.py`
  - `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py`
  - `mashos-api/ai/services/ai_inference/subscription_projection.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/subscription_trial_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_auth_token_cache.py`
  - `mashos-api/ai/services/ai_inference/today_question_store.py`
- 修正対象になりうる変更:
  - middleware, supabase boundary, perf/observability, infra guard

### `mashos-api/ai/services/ai_inference/templates/response_template.en.json`
- repo: `mashos-api`
- system: `runtime asset / prompt / schema`
- 現行状態: `active`
- 役割: Runtime prompt / response template asset consumed by backend services.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - prompt/template/schema asset change

### `mashos-api/ai/services/ai_inference/templates/response_template.ja.json`
- repo: `mashos-api`
- system: `runtime asset / prompt / schema`
- 現行状態: `active`
- 役割: Runtime prompt / response template asset consumed by backend services.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - prompt/template/schema asset change

### `mashos-api/ai/tools/Makefile`
- repo: `mashos-api`
- system: `developer tool`
- 現行状態: `active`
- 役割: Backend support module. Current system: developer tool.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - developer tooling / import/rename helper change

### `mashos-api/ai/tools/check_tag_consistency.py`
- repo: `mashos-api`
- system: `developer tool`
- 現行状態: `active`
- 役割: Backend support module. Current system: developer tool.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - developer tooling / import/rename helper change

### `mashos-api/ai/tools/docs/data_ingest_guide.txt`
- repo: `mashos-api`
- system: `runtime asset / prompt / schema`
- 現行状態: `active`
- 役割: Config / schema / text asset used by current backend support or contract flow.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - prompt/template/schema asset change

### `mashos-api/ai/tools/import_csv_to_logs.py`
- repo: `mashos-api`
- system: `developer tool`
- 現行状態: `active`
- 役割: CSV → logs.jsonl 追記インポート
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - developer tooling / import/rename helper change

### `mashos-api/ai/tools/import_json_to_logs.py`
- repo: `mashos-api`
- system: `developer tool`
- 現行状態: `active`
- 役割: JSON/JSONL → logs.jsonl 追記インポート
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - developer tooling / import/rename helper change

### `mashos-api/ai/tools/import_logs.py`
- repo: `mashos-api`
- system: `developer tool`
- 現行状態: `active`
- 役割: CocolonAI Data Importer
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - developer tooling / import/rename helper change

### `mashos-api/ai/tools/import_mapping.yaml`
- repo: `mashos-api`
- system: `runtime asset / prompt / schema`
- 現行状態: `active`
- 役割: Config / schema / text asset used by current backend support or contract flow.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - prompt/template/schema asset change

### `mashos-api/ai/tools/rename_ai_name.py`
- repo: `mashos-api`
- system: `developer tool`
- 現行状態: `active`
- 役割: Backend support module. Current system: developer tool.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - developer tooling / import/rename helper change

### `mashos-api/ai/tools/tools/import_logs.py`
- repo: `mashos-api`
- system: `developer tool`
- 現行状態: `active`
- 役割: CocolonAI Data Importer
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - developer tooling / import/rename helper change

### `mashos-api/ai/tools/tools/import_mapping.yaml`
- repo: `mashos-api`
- system: `runtime asset / prompt / schema`
- 現行状態: `active`
- 役割: Config / schema / text asset used by current backend support or contract flow.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - prompt/template/schema asset change

### `mashos-api/ai/tools/tools/validate_logs.py`
- repo: `mashos-api`
- system: `developer tool`
- 現行状態: `active`
- 役割: Validate logs.jsonl format for CocolonAI pipeline.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - developer tooling / import/rename helper change

### `mashos-api/ai/tools/validate_logs.py`
- repo: `mashos-api`
- system: `developer tool`
- 現行状態: `active`
- 役割: Validate logs.jsonl format for CocolonAI pipeline.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - developer tooling / import/rename helper change


## C9. 2026-04-22 差分更新 (support / rule docs)

### `mashos-api/ai/docs/COCOLON_STRUCTURE_UNIFICATION_ADDENDUM_2026_04_21.md`
- repo: `mashos-api`
- system: `rule / policy document`
- 現行状態: `active`
- 役割: 三大要素の canonical owner / compat 隔離 / artifact-only 契約を固定する addendum。
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_nexus.py` — document reference
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — document reference
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py` — document reference
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — document reference
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` — document reference
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_nexus.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
- 修正対象になりうる変更:
  - contract/rule file alignment

### `mashos-api/ai/docs/emlis_ai_user_models.sql`
- repo: `mashos-api`
- system: `backend support document`
- 現行状態: `active`
- 役割: EmlisAI derived user model store の DDL。immediate reply observation kernel が使う compact/deep user model の永続化契約を固定する。
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py` — schema support
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py`
- 修正対象になりうる変更:
  - support / migration document change

# 2026-04-25 差分追記: Backend支援 / contract current補正

- API contract registry は current route owner と整合済みです。`/nexus/recommend/users`、`/mymodel/recommend/users` compat、`/ranking/mymodel_resonances` compat の route/register drift は前セッションで解消済みです。
- `mashos-api/ai/docs/API_CONTRACT_POLICY.md` は `API_CONTRACT_POLICY_VERSION=2026-04-20.myprofile-lookup.v1` 前提に更新済みです。
- DB physical name はまだ旧名が実体のため、API current owner 内でも table constant / query は旧物理名を許容します。DB境界は `08_Cocolon_DB_rename_boundary.md` を正本として見ます。


# 2026-04-27 差分追記: contract registry / header metadata cleanup

この差分で内容が変わった backend support / contract files は次の5件です。file count は変わらず、`01C` 本文 coverage も latest 408 files 全件を維持します。

| file | 今回の修正内容 | 同時確認する境界 |
|---|---|---|
| `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md` | current public route 欠落分を追加し、legacy `/friends/*` alias の一部を deprecated + replacement に整理 | `api_contract_registry.py`, `test_api_contract_registry.py`, `middleware_api_contract.py` |
| `mashos-api/ai/services/ai_inference/api_contract_registry.py` | registry rows を current route / friends alias replacement に合わせた | `PUBLIC_API_REGISTRY.md`, `test_api_contract_registry.py`, `middleware_api_contract.py` |
| `mashos-api/ai/services/ai_inference/api_emotion_log.py` | `/emotion-log/feed` の response_model metadata を明示 | `api_contract_registry.py`, `test_api_contract_registry.py` |
| `mashos-api/ai/services/ai_inference/api_nexus.py` | `/nexus/emotion-log` / `/nexus/emotion-ranking` の response_model metadata を明示 | `api_contract_registry.py`, `test_api_contract_registry.py` |
| `mashos-api/ai/tests/contract/test_api_contract_registry.py` | current route 必須一覧と friends alias deprecated replacement guard を追加 | `api_contract_registry.py`, `PUBLIC_API_REGISTRY.md` |

追加登録した current public route:

- `GET /account/profile-create`
- `GET /emotion-log/feed`
- `GET /emotion-log/unread-status`
- `POST /emotion-log/unread/read-feed`
- `GET /emotion-notifications/settings`
- `POST /emotion-notifications/settings/{friend_user_id}`
- `GET /nexus/emotion-log`
- `GET /nexus/emotion-ranking`

互換aliasとして deprecated + replacement に整理した route:

| legacy alias | replacement |
|---|---|
| `POST /friends/request` | `/follow/request` |
| `POST /friends/requests/{request_id}/accept` | `/follow/requests/{request_id}/accept` |
| `POST /friends/requests/{request_id}/reject` | `/follow/requests/{request_id}/reject` |
| `POST /friends/requests/{request_id}/cancel` | `/follow/requests/{request_id}/cancel` |
| `POST /friends/remove` | `/follow/remove` |
| `GET /friends/notification-settings` | `/emotion-notifications/settings` |
| `POST /friends/notification-settings/{friend_user_id}` | `/emotion-notifications/settings/{friend_user_id}` |

この差分では handler 削除は行っていません。registry上で互換aliasの退役境界を明示しただけです。

# 2026-04-28 差分追記: Worker / FCM / Load Test / Contract支援補正

この追記は、最新zipで増えた高負荷運用・検証・contract支援ファイルを `01C` に差分追加する。

## 新規 file block

### `mashos-api/ai/services/ai_inference/fcm_push_queue.py`
- repo: `mashos-api`
- system: `Backend support / FCM dedicated queue`
- 現行状態: `active`
- 役割: FCM外部通信をAPI hot pathから切り離し、`send_fcm_push_v1` jobとして `astor_jobs` にenqueueする。
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_follow.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`

### `mashos-api/ai/services/ai_inference/.env.worker.example`
- repo: `mashos-api`
- system: `Backend support / worker env example`
- 現行状態: `active`
- 役割: API/worker分離、worker profile、FCM queue、stale running recovery、queue stats logのenv例。
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/docs/WORKER_OPERATIONS.md`

### `mashos-api/ai/docs/WORKER_OPERATIONS.md`
- repo: `mashos-api`
- system: `Backend support / worker operations`
- 現行状態: `active`
- 役割: worker profile、推奨増設順、queue stats、stale running復旧、notification workerを運用資料として固定する。
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/scripts/astor_worker_status.py`
  - `mashos-api/ai/services/ai_inference/.env.worker.example`

### `mashos-api/ai/docs/LOAD_TESTING.md`
- repo: `mashos-api`
- system: `Backend support / load testing`
- 現行状態: `active`
- 役割: app-bootstrap / startup / home-state / emotion-submit / piece-preview / mix の負荷試験手順と見るべき指標を固定する。
- 直接関係ファイル:
  - `mashos-api/scripts/cocolon_load_test.py`
  - `mashos-api/scripts/astor_worker_status.py`

### `mashos-api/scripts/astor_worker_status.py`
- repo: `mashos-api`
- system: `Backend support / worker status script`
- 現行状態: `active`
- 役割: queue stats表示、profile別確認、stale running job復旧、pressure判定を行う。
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`

### `mashos-api/scripts/cocolon_load_test.py`
- repo: `mashos-api`
- system: `Backend support / load test script`
- 現行状態: `active`
- 役割: Cocolon API の read/write/mix scenario を使い、p50/p95/p99、success rate、status distributionを測定する。
- 直接関係ファイル:
  - `mashos-api/ai/docs/LOAD_TESTING.md`

### `mashos-api/ai/tests/contract/test_new_national_core_analysis_contracts.py`
- repo: `mashos-api`
- system: `Contract test / 分析構造`
- 現行状態: `active`
- 役割: 分析構造capabilityとReport Validity Gateの不変条件を固定する。

### `mashos-api/ai/tests/contract/test_new_national_core_emlis_contracts.py`
- repo: `mashos-api`
- system: `Contract test / EmlisAI構造`
- 現行状態: `active`
- 役割: EmlisAI capabilityとQuality Gateの不変条件を固定する。

### `mashos-api/ai/tests/contract/test_new_national_core_piece_contracts.py`
- repo: `mashos-api`
- system: `Contract test / Piece構造`
- 現行状態: `active`
- 役割: core contract registry、Piece preview/publish field、Piece安全化、preview=published hash契約を固定する。

## 既存 file の差分

- `mashos-api/ai/services/ai_inference/astor_job_queue.py` は queue stats / stale running job復旧を持つ。
- `mashos-api/ai/services/ai_inference/astor_worker.py` は `all/core/analysis/inspect/ranking/summary/notification` profile と FCM job handlerを持つ。
- `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md` / `api_contract_registry.py` は新国家システムのadditive contractを反映する。

# 2026-05-05 差分追記: Subscription plan copy source boundary

SubscriptionのPlus / Premium表示文言は、RN表示とbackend bootstrapの両方にsourceがある。どちらか片方だけを変更すると、起動時catalogやfallback表示でズレる。

| file | 現状の役割 |
|---|---|
| `Cocolon/lib/iap/iapRuntimeCatalog.js` | RN側のplan catalog normalization / fallback display文言。Plus / Premium の説明文を保持する |
| `Cocolon/screens/SubscriptionSelectScreen.js` | 「プランを選ぶ」の表示surface。title / price / benefitsをcatalogから描画する |
| `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py` | `/subscription/bootstrap` 側のplan catalog / marketing lines / legacy text replacement |
| `mashos-api/ai/tests/contract/test_subscription_bootstrap_contracts.py` | bootstrap catalog contract |

現行のPlus/Premium表示では、`履歴全般`、`ホーム: Emlis/Emilisからのコメント`、`分析`、`ピース生成回数` をbenefit行として扱う。スタイル変更ではなく文言変更の場合も、上記3ファイルを同時確認する。
