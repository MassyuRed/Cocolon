---
title: "01A_Cocolon_全体構造資料_アプリ基盤とHome系"
revision_date: "2026-05-18"
---

# 01A. アプリ基盤とHome系

この章では App root / provider / Home screen / notice / today-question / reflection preview / frontend Home API boundary / backend Home API / home_gateway / startup / EmlisAI immediate reply をまとめて扱う。

## A1. App root / provider / build boundary

### `Cocolon/.env.subscription.public.example`
- repo: `Cocolon`
- system: `app support / build config`
- 現行状態: `active`
- 役割: App support file. Current system: app support / build config.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - build / lint / env / repo-level support change

### `Cocolon/App.js`
- repo: `Cocolon`
- system: `app root / navigation`
- 現行状態: `active`
- 役割: App support file. Current system: app root / navigation.
- 直接関係ファイル:
  - `Cocolon/AppRuntimeContext.js` — import
  - `Cocolon/AuthContext.js` — import
  - `Cocolon/AuthScreen.js` — import
  - `Cocolon/SubscriptionContext.js` — import
  - `Cocolon/TutorialContext.js` — import
  - `Cocolon/UnreadContext.js` — import
  - `Cocolon/components/UnreadBadge.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/iap/iapService.js` — import
  - `Cocolon/lib/pushToken.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/lib/user.ts` — import
  - `Cocolon/screens/AccountScreen.js` — import
  - `Cocolon/screens/CocolonGuideScreen.js` — import
  - `Cocolon/screens/EchoesHistoryDetailScreen.js` — import
  - `Cocolon/screens/EchoesHistoryListScreen.js` — import
  - `Cocolon/screens/EmotionLogScreen.js` — import
  - `Cocolon/screens/EmotionRankingScreen.js` — import
  - `Cocolon/screens/FollowListScreen.js` — import
  - `Cocolon/screens/InputCountRankingScreen.js` — import
  - `Cocolon/screens/InputLengthRankingScreen.js` — import
  - `Cocolon/screens/InputScreen.js` — import
  - `Cocolon/screens/LoginStreakRankingScreen.js` — import
  - `Cocolon/screens/MyModelEchoesRankingScreen.js` — import
  - `Cocolon/screens/MyModelEntryScreen.js` — import
  - `Cocolon/screens/MyModelQuestionsRankingScreen.js` — import
  - `Cocolon/screens/MyModelReactionHistoryScreen.js` — import
  - `Cocolon/screens/MyModelReflectionsScreen.js` — import
  - `Cocolon/screens/MyModelScreen.js` — import
  - `Cocolon/screens/MyWebHistoryScreen.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
  - `Cocolon/screens/NoticeHistoryScreen.js` — import
  - `Cocolon/screens/ProfileCreateScreen.js` — import
  - `Cocolon/screens/RankingTopScreen.js` — import
  - `Cocolon/screens/SettingsAppSettingsScreen.js` — import
  - `Cocolon/screens/SettingsOtherScreen.js` — import
  - `Cocolon/screens/SettingsScreen.js` — import
  - `Cocolon/screens/SubscriptionSelectScreen.js` — import
  - `Cocolon/screens/TodayQuestionHistoryScreen.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py` — endpoint /account/profile/me
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py` — endpoint /app/bootstrap
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py` — endpoint /app/startup
  - `mashos-api/ai/services/ai_inference/api_friends.py` — endpoint /emotion-log/feed
  - `mashos-api/ai/services/ai_inference/api_friends.py` — endpoint /emotion-log/unread-status
  - `mashos-api/ai/services/ai_inference/api_friends.py` — endpoint /emotion-log/unread/read-feed
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — endpoint /mymodel/qna/unread-status
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — endpoint /myprofile/latest/status
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — endpoint /myweb/reports/ensure
- このファイルを直接参照するファイル:
  - `Cocolon/index.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/AppRuntimeContext.js`
  - `Cocolon/AuthContext.js`
  - `Cocolon/AuthScreen.js`
  - `Cocolon/SubscriptionContext.js`
  - `Cocolon/TutorialContext.js`
  - `Cocolon/UnreadContext.js`
  - `Cocolon/components/UnreadBadge.js`
  - `Cocolon/index.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/iap/iapService.js`
  - `Cocolon/lib/pushToken.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/lib/user.ts`
  - `Cocolon/screens/AccountScreen.js`
  - `Cocolon/screens/CocolonGuideScreen.js`
  - `Cocolon/screens/EchoesHistoryDetailScreen.js`
  - `Cocolon/screens/EchoesHistoryListScreen.js`
  - `Cocolon/screens/EmotionLogScreen.js`
  - `Cocolon/screens/EmotionRankingScreen.js`
  - `Cocolon/screens/FollowListScreen.js`
  - `Cocolon/screens/InputCountRankingScreen.js`
  - `Cocolon/screens/InputLengthRankingScreen.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/screens/LoginStreakRankingScreen.js`
  - `Cocolon/screens/MyModelEchoesRankingScreen.js`
  - `Cocolon/screens/MyModelEntryScreen.js`
  - `Cocolon/screens/MyModelQuestionsRankingScreen.js`
  - `Cocolon/screens/MyModelReactionHistoryScreen.js`
  - `Cocolon/screens/MyModelReflectionsScreen.js`
  - `Cocolon/screens/MyModelScreen.js`
  - `Cocolon/screens/MyWebHistoryScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/NoticeHistoryScreen.js`
  - `Cocolon/screens/ProfileCreateScreen.js`
  - `Cocolon/screens/RankingTopScreen.js`
  - `Cocolon/screens/SettingsAppSettingsScreen.js`
  - `Cocolon/screens/SettingsOtherScreen.js`
  - `Cocolon/screens/SettingsScreen.js`
  - `Cocolon/screens/SubscriptionSelectScreen.js`
  - `Cocolon/screens/TodayQuestionHistoryScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py`
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py`
  - `mashos-api/ai/services/ai_inference/api_friends.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
- 修正対象になりうる変更:
  - route, provider, startup, tab label, screen mount order

### `Cocolon/AppRuntimeContext.js`
- repo: `Cocolon`
- system: `app runtime / feature flag boundary`
- 現行状態: `active`
- 役割: `/app/bootstrap` の結果をRN全体で共有するruntime context。`minimum_supported_version` / `recommended_version` / `maintenance_message` / `feature_flags` を保持する。
- 直接関係ファイル:
  - `Cocolon/lib/apiClient.js` — import / `/app/bootstrap` fetch
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py` — endpoint /app/bootstrap
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — provider / version gate
  - `Cocolon/features/home/useHomeState.js` — `today_question_enabled`
  - `Cocolon/screens/SettingsOtherScreen.js` — `account_delete_enabled`
  - `Cocolon/screens/SubscriptionSelectScreen.js` — `subscription_sales_enabled`
  - `Cocolon/screens/TodayQuestionHistoryScreen.js` — `today_question_history_enabled`
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/features/home/useHomeState.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/screens/SettingsOtherScreen.js`
  - `Cocolon/screens/SubscriptionSelectScreen.js`
  - `Cocolon/screens/TodayQuestionHistoryScreen.js`
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py`
- 修正対象になりうる変更:
  - app bootstrap, version guard, maintenance message, feature flag, runtime kill switch

### `Cocolon/AuthContext.js`
- repo: `Cocolon`
- system: `app provider / context boundary`
- 現行状態: `shared`
- 役割: App support file. Current system: app provider / context boundary.
- 直接関係ファイル:
  - `Cocolon/lib/api/account/profileApi.js` — import
  - `Cocolon/lib/supabase.ts` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
  - `Cocolon/AuthScreen.js` — import
  - `Cocolon/screens/AccountScreen.js` — import
  - `Cocolon/screens/FollowListScreen.js` — import
  - `Cocolon/screens/InputScreen.js` — import
  - `Cocolon/screens/SettingsAppSettingsScreen.js` — import
  - `Cocolon/screens/SettingsOtherScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/AuthScreen.js`
  - `Cocolon/lib/api/account/profileApi.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/screens/AccountScreen.js`
  - `Cocolon/screens/FollowListScreen.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/screens/SettingsAppSettingsScreen.js`
  - `Cocolon/screens/SettingsOtherScreen.js`
- 修正対象になりうる変更:
  - auth, unread, tutorial, plan gating, global state propagation

### `Cocolon/AuthScreen.js`
- repo: `Cocolon`
- system: `app provider / context boundary`
- 現行状態: `active`
- 役割: App support file. Current system: app provider / context boundary.
- 直接関係ファイル:
  - `Cocolon/AuthContext.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/AuthContext.js`
- 修正対象になりうる変更:
  - auth, unread, tutorial, plan gating, global state propagation

### `Cocolon/SubscriptionContext.js`
- repo: `Cocolon`
- system: `app provider / context boundary`
- 現行状態: `shared`
- 役割: App support file. Current system: app provider / context boundary.
- 直接関係ファイル:
  - `Cocolon/lib/iap/iapRuntimeCatalog.js` — import
  - `Cocolon/lib/subscriptionApi.js` — import
  - `Cocolon/lib/supabase.ts` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
  - `Cocolon/screens/EchoesHistoryListScreen.js` — import
  - `Cocolon/screens/MyModelScreen.js` — import
  - `Cocolon/screens/MyWebHistoryScreen.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js` — import
  - `Cocolon/screens/SelfStructureReportViewerScreen.js` — import
  - `Cocolon/screens/SubscriptionSelectScreen.js` — import
  - `Cocolon/screens/TodayQuestionHistoryScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/lib/iap/iapRuntimeCatalog.js`
  - `Cocolon/lib/subscriptionApi.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/screens/EchoesHistoryListScreen.js`
  - `Cocolon/screens/MyModelScreen.js`
  - `Cocolon/screens/MyWebHistoryScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js`
  - `Cocolon/screens/SelfStructureReportViewerScreen.js`
  - `Cocolon/screens/SubscriptionSelectScreen.js`
  - `Cocolon/screens/TodayQuestionHistoryScreen.js`
- 修正対象になりうる変更:
  - auth, unread, tutorial, plan gating, global state propagation

### `Cocolon/TutorialContext.js`
- repo: `Cocolon`
- system: `app provider / context boundary`
- 現行状態: `shared`
- 役割: App support file. Current system: app provider / context boundary.
- 直接関係ファイル:
  - `Cocolon/lib/api/account/profileApi.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
  - `Cocolon/screens/EmotionLogScreen.js` — import
  - `Cocolon/screens/InputScreen.js` — import
  - `Cocolon/screens/MyModelReactionHistoryScreen.js` — import
  - `Cocolon/screens/MyModelReflectionsScreen.js` — import
  - `Cocolon/screens/MyModelScreen.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
  - `Cocolon/screens/NexusScreen.js` — import
  - `Cocolon/screens/SettingsOtherScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/lib/api/account/profileApi.js`
  - `Cocolon/screens/EmotionLogScreen.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/screens/MyModelReactionHistoryScreen.js`
  - `Cocolon/screens/MyModelReflectionsScreen.js`
  - `Cocolon/screens/MyModelScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/NexusScreen.js`
  - `Cocolon/screens/SettingsOtherScreen.js`
- 修正対象になりうる変更:
  - auth, unread, tutorial, plan gating, global state propagation

### `Cocolon/UnreadContext.js`
- repo: `Cocolon`
- system: `app provider / context boundary`
- 現行状態: `shared`
- 役割: App support file. Current system: app provider / context boundary.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
  - `Cocolon/screens/EmotionLogScreen.js` — import
  - `Cocolon/screens/InputScreen.js` — import
  - `Cocolon/screens/MyModelReflectionsScreen.js` — import
  - `Cocolon/screens/MyModelScreen.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
  - `Cocolon/screens/SettingsOtherScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/screens/EmotionLogScreen.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/screens/MyModelReflectionsScreen.js`
  - `Cocolon/screens/MyModelScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/SettingsOtherScreen.js`
- 修正対象になりうる変更:
  - auth, unread, tutorial, plan gating, global state propagation

### `Cocolon/babel.config.js`
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

### `Cocolon/eslint.config.js`
- repo: `Cocolon`
- system: `app support / misc`
- 現行状態: `active`
- 役割: https://docs.expo.dev/guides/using-eslint/
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - misc app support change

### `Cocolon/expo-env.d.ts`
- repo: `Cocolon`
- system: `app support / build config`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 役割: / <reference types="expo/types" />
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - build / lint / env / repo-level support change

### `Cocolon/index.js`
- repo: `Cocolon`
- system: `app root / navigation`
- 現行状態: `active`
- 役割: --- Polyfills: MUST be first ---
- 直接関係ファイル:
  - `Cocolon/App.js` — import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
- 修正対象になりうる変更:
  - route, provider, startup, tab label, screen mount order

### `Cocolon/metro.config.js`
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

### `Cocolon/react-native.config.js`
- repo: `Cocolon`
- system: `app support / misc`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 役割: App support file. Current system: app support / misc.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - misc app support change


## A2. Home surface / shared UI / orchestration

### `Cocolon/components/EmotionReflectionPreviewModal.js`
- repo: `Cocolon`
- system: `Home shared UI`
- 現行状態: `retired-current-reference`
- 旧記載状態: `shared`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 役割: RN shared component module. Current system: Home shared UI.
- 直接関係ファイル:
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/InputScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - notice, today-question, reflection preview, Home modal behavior

### `Cocolon/components/NoticeModal.js`
- repo: `Cocolon`
- system: `Home shared UI`
- 現行状態: `shared`
- 役割: RN shared component module. Current system: Home shared UI.
- 直接関係ファイル:
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/NoticeRichText.js` — import
  - `Cocolon/lib/noticeActionRuntime.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/InputScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/NoticeRichText.js`
  - `Cocolon/lib/noticeActionRuntime.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/theme/ThemeContext.js`
- 修正対象になりうる変更:
  - notice, today-question, reflection preview, Home modal behavior

### `Cocolon/components/NoticeRichText.js`
- repo: `Cocolon`
- system: `Home shared UI`
- 現行状態: `shared`
- 役割: RN shared component module. Current system: Home shared UI.
- 直接関係ファイル:
  - `Cocolon/lib/noticeActionRuntime.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/components/NoticeModal.js` — import
  - `Cocolon/screens/NoticeHistoryScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/NoticeModal.js`
  - `Cocolon/lib/noticeActionRuntime.js`
  - `Cocolon/screens/NoticeHistoryScreen.js`
- 修正対象になりうる変更:
  - notice, today-question, reflection preview, Home modal behavior

### `Cocolon/components/TodayQuestionCard.js`
- repo: `Cocolon`
- system: `Home shared UI`
- 現行状態: `shared`
- 役割: RN shared component module. Current system: Home shared UI.
- 直接関係ファイル:
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/components/TodayQuestionModal.js` — import
  - `Cocolon/screens/InputScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/components/TodayQuestionModal.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/theme/ThemeContext.js`
- 修正対象になりうる変更:
  - notice, today-question, reflection preview, Home modal behavior

### `Cocolon/components/TodayQuestionModal.js`
- repo: `Cocolon`
- system: `Home shared UI`
- 現行状態: `shared`
- 役割: RN shared component module. Current system: Home shared UI.
- 直接関係ファイル:
  - `Cocolon/components/TodayQuestionCard.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/InputScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/TodayQuestionCard.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/theme/ThemeContext.js`
- 修正対象になりうる変更:
  - notice, today-question, reflection preview, Home modal behavior

### `Cocolon/components/TutorialOverlay.js`
- repo: `Cocolon`
- system: `tutorial shared UI`
- 現行状態: `legacy-live`
- 役割: RN shared component module. Current system: tutorial shared UI.
- 直接関係ファイル:
  - `Cocolon/theme/ThemeContext.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/EmotionLogScreen.js` — import
  - `Cocolon/screens/InputScreen.js` — import
  - `Cocolon/screens/MyModelReflectionsScreen.js` — import
  - `Cocolon/screens/MyModelScreen.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
  - `Cocolon/screens/NexusScreen.js` — import
  - `mashos-api/ai/docs/TUTORIAL_STABILITY_REDESIGN.md` — document reference
- 修正時に必ず同時確認するファイル:
  - `Cocolon/screens/EmotionLogScreen.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/screens/MyModelReflectionsScreen.js`
  - `Cocolon/screens/MyModelScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/NexusScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `mashos-api/ai/docs/TUTORIAL_STABILITY_REDESIGN.md`
- 修正対象になりうる変更:
  - tutorial target measure, overlay behavior, proxy press

### `Cocolon/components/TutorialStartModal.js`
- repo: `Cocolon`
- system: `tutorial shared UI`
- 現行状態: `shared`
- 役割: RN shared component module. Current system: tutorial shared UI.
- 直接関係ファイル:
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/InputScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/theme/ThemeContext.js`
- 修正対象になりうる変更:
  - tutorial target measure, overlay behavior, proxy press

### `Cocolon/components/UnreadBadge.js`
- repo: `Cocolon`
- system: `startup / unread shared UI`
- 現行状態: `shared`
- 役割: RN shared component module. Current system: startup / unread shared UI.
- 直接関係ファイル:
  - `Cocolon/theme/ThemeContext.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
  - `Cocolon/screens/InputScreen.js` — import
  - `Cocolon/screens/MenuActionCardCommon.js` — import
  - `Cocolon/screens/MyModelMenuCommon.js` — import
  - `Cocolon/screens/MyWebMenuCommon.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
  - `Cocolon/screens/NoticeHistoryScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/screens/MenuActionCardCommon.js`
  - `Cocolon/screens/MyModelMenuCommon.js`
  - `Cocolon/screens/MyWebMenuCommon.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/NoticeHistoryScreen.js`
  - `Cocolon/theme/ThemeContext.js`
- 修正対象になりうる変更:
  - startup badge, unread visibility, startup payload display

### `Cocolon/features/home/useHomeActions.js`
- repo: `Cocolon`
- system: `Home orchestration hook`
- 現行状態: `shared`
- 役割: RN feature hook module. Current system: Home orchestration hook.
- 直接関係ファイル:
  - `Cocolon/features/home/useHomeState.js` — import
  - `Cocolon/lib/api/home/noticeApi.js` — import
  - `Cocolon/lib/api/home/todayQuestionApi.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/InputScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/features/home/useHomeState.js`
  - `Cocolon/lib/api/home/noticeApi.js`
  - `Cocolon/lib/api/home/todayQuestionApi.js`
  - `Cocolon/screens/InputScreen.js`
- 修正対象になりうる変更:
  - Home hydration, save action flow, startup popup, today_question_enabled flag, input action orchestration

### `Cocolon/features/home/useHomeState.js`
- repo: `Cocolon`
- system: `Home orchestration hook`
- 現行状態: `shared`
- 役割: RN feature hook module. Current system: Home orchestration hook.
- 直接関係ファイル:
  - `Cocolon/AppRuntimeContext.js` — import
  - `Cocolon/lib/api/home/homeStateApi.js` — import
  - `Cocolon/lib/api/home/todayQuestionApi.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/features/home/useHomeActions.js` — import
  - `Cocolon/screens/InputScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/AppRuntimeContext.js`
  - `Cocolon/features/home/useHomeActions.js`
  - `Cocolon/lib/api/home/homeStateApi.js`
  - `Cocolon/lib/api/home/todayQuestionApi.js`
  - `Cocolon/screens/InputScreen.js`
- 修正対象になりうる変更:
  - Home hydration, save action flow, startup popup, today_question_enabled flag, input action orchestration

### `Cocolon/screens/InputCountRankingScreen.js`
- repo: `Cocolon`
- system: `Home / input surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: Home / input surface.
- 直接関係ファイル:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — endpoint /ranking/input_count
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` — endpoint /ranking/input_count
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
  - Home screen, notice, today-question, emotion submit, reflection publish

### `Cocolon/screens/InputLengthRankingScreen.js`
- repo: `Cocolon`
- system: `Home / input surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: Home / input surface.
- 直接関係ファイル:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — endpoint /ranking/input_length
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` — endpoint /ranking/input_length
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
  - Home screen, notice, today-question, emotion submit, reflection publish

### `Cocolon/screens/InputScreen.js`
- repo: `Cocolon`
- system: `Home / input surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: Home / input surface.
- 直接関係ファイル:
  - `Cocolon/AuthContext.js` — import
  - `Cocolon/TutorialContext.js` — import
  - `Cocolon/UnreadContext.js` — import
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/components/CocolonSwitch.js` — import
  - `Cocolon/components/EmotionReflectionPreviewModal.js` — import
  - `Cocolon/components/NoticeModal.js` — import
  - `Cocolon/components/TodayQuestionCard.js` — import
  - `Cocolon/components/TodayQuestionModal.js` — import
  - `Cocolon/components/TutorialOverlay.js` — import
  - `Cocolon/components/TutorialStartModal.js` — import
  - `Cocolon/components/UnreadBadge.js` — import
  - `Cocolon/features/home/useHomeActions.js` — import
  - `Cocolon/features/home/useHomeState.js` — import
  - `Cocolon/lib/api/home/emotionReflectionApi.js` — import
  - `Cocolon/lib/api/home/emotionSubmitApi.js` — import
  - `Cocolon/lib/noticeActionRuntime.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/AuthContext.js`
  - `Cocolon/TutorialContext.js`
  - `Cocolon/UnreadContext.js`
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/components/CocolonSwitch.js`
  - `Cocolon/components/EmotionReflectionPreviewModal.js`
  - `Cocolon/components/NoticeModal.js`
  - `Cocolon/components/TodayQuestionCard.js`
  - `Cocolon/components/TodayQuestionModal.js`
  - `Cocolon/components/TutorialOverlay.js`
  - `Cocolon/components/TutorialStartModal.js`
  - `Cocolon/components/UnreadBadge.js`
  - `Cocolon/features/home/useHomeActions.js`
  - `Cocolon/features/home/useHomeState.js`
  - `Cocolon/lib/api/home/emotionReflectionApi.js`
  - `Cocolon/lib/api/home/emotionSubmitApi.js`
  - `Cocolon/lib/noticeActionRuntime.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - Home screen, notice, today-question, emotion submit, reflection publish

### `Cocolon/screens/NoticeHistoryScreen.js`
- repo: `Cocolon`
- system: `Home / input surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: Home / input surface.
- 直接関係ファイル:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/components/NoticeRichText.js` — import
  - `Cocolon/components/UnreadBadge.js` — import
  - `Cocolon/lib/noticeActionRuntime.js` — import
  - `Cocolon/lib/noticeApi.js` — import
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
  - `Cocolon/components/NoticeRichText.js`
  - `Cocolon/components/UnreadBadge.js`
  - `Cocolon/lib/noticeActionRuntime.js`
  - `Cocolon/lib/noticeApi.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - Home screen, notice, today-question, emotion submit, reflection publish

### `Cocolon/screens/TodayQuestionHistoryScreen.js`
- repo: `Cocolon`
- system: `Home / input surface`
- 現行状態: `shared`
- 役割: RN screen module. Current system: Home / input surface.
- 直接関係ファイル:
  - `Cocolon/SubscriptionContext.js` — import
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/lib/historyRetentionLabel.js` — import
  - `Cocolon/lib/todayQuestionApi.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/SubscriptionContext.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/lib/historyRetentionLabel.js`
  - `Cocolon/lib/todayQuestionApi.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - Home screen, notice, today-question, emotion submit, reflection publish


## A3. Frontend Home boundary / helpers

### `Cocolon/lib/api/client.js`
- repo: `Cocolon`
- system: `frontend API boundary`
- 現行状態: `shared`
- 役割: Frontend helper / boundary module. Current system: frontend API boundary.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `Cocolon/lib/api/account/profileApi.js` — import
  - `Cocolon/lib/api/home/emotionReflectionApi.js` — import
  - `Cocolon/lib/api/home/emotionSubmitApi.js` — import
  - `Cocolon/lib/api/home/homeStateApi.js` — import
  - `Cocolon/lib/api/home/noticeApi.js` — import
  - `Cocolon/lib/api/home/todayQuestionApi.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/lib/api/account/profileApi.js`
  - `Cocolon/lib/api/home/emotionReflectionApi.js`
  - `Cocolon/lib/api/home/emotionSubmitApi.js`
  - `Cocolon/lib/api/home/homeStateApi.js`
  - `Cocolon/lib/api/home/noticeApi.js`
  - `Cocolon/lib/api/home/todayQuestionApi.js`
- 修正対象になりうる変更:
  - all RN network calls and contract boundary

### `Cocolon/lib/api/home/emotionReflectionApi.js`
- repo: `Cocolon`
- system: `Home API client wrapper`
- 現行状態: `retired-current-reference`
- 旧記載状態: `shared`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 役割: Frontend API wrapper for /emotion/reflection/cancel, /emotion/reflection/preview, /emotion/reflection/publish, /emotion/reflection/quota.
- 直接関係ファイル:
  - `Cocolon/lib/api/client.js` — import
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — endpoint /emotion/reflection/cancel
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — endpoint /emotion/reflection/preview
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — endpoint /emotion/reflection/publish
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — endpoint /emotion/reflection/quota
- このファイルを直接参照するファイル:
  - `Cocolon/screens/InputScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/lib/api/client.js`
  - `Cocolon/screens/InputScreen.js`
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
- 修正対象になりうる変更:
  - frontend -> backend home route boundary

### `Cocolon/lib/api/home/emotionSubmitApi.js`
- repo: `Cocolon`
- system: `Home API client wrapper`
- 現行状態: `shared`
- 役割: Frontend API wrapper for /emotion/submit.
- 直接関係ファイル:
  - `Cocolon/lib/api/client.js` — import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — endpoint /emotion/submit
- このファイルを直接参照するファイル:
  - `Cocolon/screens/InputScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/lib/api/client.js`
  - `Cocolon/screens/InputScreen.js`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
- 修正対象になりうる変更:
  - frontend -> backend home route boundary

### `Cocolon/lib/api/home/homeStateApi.js`
- repo: `Cocolon`
- system: `Home API client wrapper`
- 現行状態: `shared`
- 役割: Frontend API wrapper. Current system: Home API client wrapper.
- 直接関係ファイル:
  - `Cocolon/lib/api/client.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/features/home/useHomeState.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/features/home/useHomeState.js`
  - `Cocolon/lib/api/client.js`
- 修正対象になりうる変更:
  - frontend -> backend home route boundary

### `Cocolon/lib/api/home/noticeApi.js`
- repo: `Cocolon`
- system: `Home API client wrapper`
- 現行状態: `shared`
- 役割: Frontend API wrapper for /notices/popup-seen, /notices/read.
- 直接関係ファイル:
  - `Cocolon/lib/api/client.js` — import
  - `mashos-api/ai/services/ai_inference/api_notice.py` — endpoint /notices/popup-seen
  - `mashos-api/ai/services/ai_inference/api_notice.py` — endpoint /notices/read
- このファイルを直接参照するファイル:
  - `Cocolon/features/home/useHomeActions.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/features/home/useHomeActions.js`
  - `Cocolon/lib/api/client.js`
  - `mashos-api/ai/services/ai_inference/api_notice.py`
- 修正対象になりうる変更:
  - frontend -> backend home route boundary

### `Cocolon/lib/api/home/todayQuestionApi.js`
- repo: `Cocolon`
- system: `Home API client wrapper`
- 現行状態: `shared`
- 役割: Frontend API wrapper for /today-question/answers, /today-question/settings.
- 直接関係ファイル:
  - `Cocolon/lib/api/client.js` — import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — endpoint /today-question/answers
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — endpoint /today-question/settings
- このファイルを直接参照するファイル:
  - `Cocolon/features/home/useHomeActions.js` — import
  - `Cocolon/features/home/useHomeState.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/features/home/useHomeActions.js`
  - `Cocolon/features/home/useHomeState.js`
  - `Cocolon/lib/api/client.js`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
- 修正対象になりうる変更:
  - frontend -> backend home route boundary

### `Cocolon/lib/apiClient.js`
- repo: `Cocolon`
- system: `frontend API boundary`
- 現行状態: `legacy-live`
- 役割: Frontend helper / boundary module. Current system: frontend API boundary.
- 直接関係ファイル:
  - `Cocolon/lib/supabase.ts` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
  - `Cocolon/lib/nexusApi.js` — import
  - `Cocolon/lib/reportDistributionApi.js` — import
  - `Cocolon/lib/subscriptionApi.js` — import
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
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js` — import
  - `Cocolon/screens/SettingsAppSettingsScreen.js` — import
  - `Cocolon/screens/SettingsOtherScreen.js` — import
  - `mashos-api/ai/docs/NATIONAL_ALIGNMENT_AUDIT_PHASE5.md` — document reference
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/lib/nexusApi.js`
  - `Cocolon/lib/reportDistributionApi.js`
  - `Cocolon/lib/subscriptionApi.js`
  - `Cocolon/lib/supabase.ts`
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
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js`
  - `Cocolon/screens/SettingsAppSettingsScreen.js`
  - `Cocolon/screens/SettingsOtherScreen.js`
  - `mashos-api/ai/docs/NATIONAL_ALIGNMENT_AUDIT_PHASE5.md`
- 修正対象になりうる変更:
  - all RN network calls and contract boundary

### `Cocolon/lib/emotionReflectionApi.js`
- repo: `Cocolon`
- system: `frontend compat API wrapper`
- 現行状態: `retired-current-reference`
- 旧記載状態: `legacy-live`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 役割: Frontend helper / boundary module. Current system: frontend compat API wrapper.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - legacy import path compatibility for frontend callers

### `Cocolon/lib/inputDraftStorage.js`
- repo: `Cocolon`
- system: `Home local runtime helper`
- 現行状態: `shared`
- 役割: Frontend helper / boundary module. Current system: Home local runtime helper.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `Cocolon/lib/accountLocalCleanup.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/lib/accountLocalCleanup.js`
- 修正対象になりうる変更:
  - Home local behavior, draft/runtime helper, popup runtime

### `Cocolon/lib/noticeActionRuntime.js`
- repo: `Cocolon`
- system: `Home local runtime helper`
- 現行状態: `shared`
- 役割: Frontend helper / boundary module. Current system: Home local runtime helper.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `Cocolon/components/NoticeModal.js` — import
  - `Cocolon/components/NoticeRichText.js` — import
  - `Cocolon/screens/InputScreen.js` — import
  - `Cocolon/screens/NoticeHistoryScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/NoticeModal.js`
  - `Cocolon/components/NoticeRichText.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/screens/NoticeHistoryScreen.js`
- 修正対象になりうる変更:
  - Home local behavior, draft/runtime helper, popup runtime

### `Cocolon/lib/noticeApi.js`
- repo: `Cocolon`
- system: `frontend compat API wrapper`
- 現行状態: `legacy-live`
- 役割: Frontend helper / boundary module. Current system: frontend compat API wrapper.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `Cocolon/screens/NoticeHistoryScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/screens/NoticeHistoryScreen.js`
- 修正対象になりうる変更:
  - legacy import path compatibility for frontend callers

### `Cocolon/lib/todayQuestionApi.js`
- repo: `Cocolon`
- system: `frontend compat API wrapper`
- 現行状態: `legacy-live`
- 役割: Frontend helper / boundary module. Current system: frontend compat API wrapper.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `Cocolon/screens/MyWebScreen.js` — import
  - `Cocolon/screens/SettingsAppSettingsScreen.js` — import
  - `Cocolon/screens/TodayQuestionHistoryScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/SettingsAppSettingsScreen.js`
  - `Cocolon/screens/TodayQuestionHistoryScreen.js`
- 修正対象になりうる変更:
  - legacy import path compatibility for frontend callers


## A4. Backend Home API / gateway / startup

### `mashos-api/ai/services/ai_inference/api_app_bootstrap.py`
- repo: `mashos-api`
- system: `Home / startup public API`
- 現行状態: `legacy-live`
- 役割: FastAPI route module for GET /app/bootstrap, GET /app/startup
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/client_compat.py` — from import
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` — from import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — endpoint /app/bootstrap
  - `Cocolon/App.js` — endpoint /app/startup
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py` — import
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/client_compat.py`
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py`
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py`
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
- 修正対象になりうる変更:
  - Home/startup read-write public contract

### `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
- repo: `mashos-api`
- system: `Home / startup public API`
- 現行状態: `legacy-live`
- 役割: New Reflection flow driven by the current emotion input only.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/client_compat.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_reflection_generation_service.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_reflection_store.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_submit_service.py` — from import
- このファイルを直接参照するファイル:
  - `Cocolon/lib/api/home/emotionReflectionApi.js` — endpoint /emotion/reflection/cancel
  - `Cocolon/lib/api/home/emotionReflectionApi.js` — endpoint /emotion/reflection/preview
  - `Cocolon/lib/api/home/emotionReflectionApi.js` — endpoint /emotion/reflection/publish
  - `Cocolon/lib/api/home/emotionReflectionApi.js` — endpoint /emotion/reflection/quota
  - `mashos-api/ai/services/ai_inference/api_home_state.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py` — import
  - `mashos-api/ai/tests/contract/test_emlis_ai_contracts.py` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/lib/api/home/emotionReflectionApi.js`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_home_state.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/client_compat.py`
  - `mashos-api/ai/services/ai_inference/emotion_reflection_generation_service.py`
  - `mashos-api/ai/services/ai_inference/emotion_reflection_store.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_submit_service.py`
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py`
  - `mashos-api/ai/tests/contract/test_emlis_ai_contracts.py`
- 修正対象になりうる変更:
  - Home/startup read-write public contract

### `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
- repo: `mashos-api`
- system: `Home / startup public API`
- 現行状態: `legacy-live`
- 役割: Emotion Submit API for Cocolon
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_core.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/client_compat.py` — from import
  - `mashos-api/ai/services/ai_inference/generation_lock.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py` — from import
  - `mashos-api/ai/services/ai_inference/input_feedback_text_templates.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_auth_token_cache.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `Cocolon/lib/api/home/emotionSubmitApi.js` — endpoint /emotion/submit
  - `mashos-api/ai/services/ai_inference/api_account_status.py` — from import
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py` — from import
  - `mashos-api/ai/services/ai_inference/api_activity_login.py` — from import
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py` — from import
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_history_search.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_secret.py` — from import
  - `mashos-api/ai/services/ai_inference/api_friends.py` — from import
  - `mashos-api/ai/services/ai_inference/api_input_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — from import
  - `mashos-api/ai/services/ai_inference/api_nexus.py` — from import
  - `mashos-api/ai/services/ai_inference/api_notice.py` — from import
  - `mashos-api/ai/services/ai_inference/api_profile_create.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` — from import
  - `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py` — from import
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
  - `mashos-api/ai/services/ai_inference/cron_run_store.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py` — from import
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py` — import
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — import
  - `mashos-api/ai/tests/contract/test_emlis_ai_contracts.py` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/lib/api/home/emotionSubmitApi.js`
  - `mashos-api/ai/services/ai_inference/api_account_status.py`
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py`
  - `mashos-api/ai/services/ai_inference/api_activity_login.py`
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py`
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_history_search.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_secret.py`
  - `mashos-api/ai/services/ai_inference/api_friends.py`
  - `mashos-api/ai/services/ai_inference/api_input_summary.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
  - `mashos-api/ai/services/ai_inference/api_nexus.py`
  - `mashos-api/ai/services/ai_inference/api_notice.py`
  - `mashos-api/ai/services/ai_inference/api_profile_create.py`
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py`
  - `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py`
  - `mashos-api/ai/services/ai_inference/api_subscription.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_core.py`
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/client_compat.py`
  - `mashos-api/ai/services/ai_inference/cron_run_store.py`
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py`
  - `mashos-api/ai/services/ai_inference/generation_lock.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py`
  - `mashos-api/ai/services/ai_inference/input_feedback_text_templates.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_auth_token_cache.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py`
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
  - `mashos-api/ai/tests/contract/test_emlis_ai_contracts.py`
- 修正対象になりうる変更:
  - Home/startup read-write public contract

### `mashos-api/ai/services/ai_inference/api_global_summary.py`
- repo: `mashos-api`
- system: `Home / startup public API`
- 現行状態: `legacy-live`
- 役割: Global Summary API
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_store.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_home_state.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py` — from import
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py` — import
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — import
  - `mashos-api/ai/tests/contract/test_publish_governance.py` — import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_home_state.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_store.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py`
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
  - `mashos-api/ai/tests/contract/test_publish_governance.py`
- 修正対象になりうる変更:
  - Home/startup read-write public contract

### `mashos-api/ai/services/ai_inference/api_home_state.py`
- repo: `mashos-api`
- system: `Home / startup public API`
- 現行状態: `shared`
- 役割: FastAPI route module for GET /home/state
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — from import
  - `mashos-api/ai/services/ai_inference/api_global_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/api_input_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/api_notice.py` — from import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — from import
  - `mashos-api/ai/services/ai_inference/client_compat.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_submit_service.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py` — import
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
  - `mashos-api/ai/services/ai_inference/api_global_summary.py`
  - `mashos-api/ai/services/ai_inference/api_input_summary.py`
  - `mashos-api/ai/services/ai_inference/api_notice.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/client_compat.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_submit_service.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py`
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py`
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
- 修正対象になりうる変更:
  - Home/startup read-write public contract

### `mashos-api/ai/services/ai_inference/api_input_summary.py`
- repo: `mashos-api`
- system: `Home / startup public API`
- 現行状態: `legacy-live`
- 役割: FastAPI route module for GET /input/summary
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_home_state.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_home_state.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - Home/startup read-write public contract

### `mashos-api/ai/services/ai_inference/api_notice.py`
- repo: `mashos-api`
- system: `Home / startup public API`
- 現行状態: `shared`
- 役割: FastAPI route module for GET /notices/current, GET /notices/history, POST /notices/read, POST /notices/popup-seen
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/active_users_store.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/client_compat.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py` — from import
  - `mashos-api/ai/services/ai_inference/notice_store.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
- このファイルを直接参照するファイル:
  - `Cocolon/lib/api/home/noticeApi.js` — endpoint /notices/popup-seen
  - `Cocolon/lib/api/home/noticeApi.js` — endpoint /notices/read
  - `mashos-api/ai/services/ai_inference/api_home_state.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py` — from import
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` — from import
  - `mashos-api/ai/tests/contract/test_notice_contracts.py` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/lib/api/home/noticeApi.js`
  - `mashos-api/ai/services/ai_inference/active_users_store.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_home_state.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/client_compat.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py`
  - `mashos-api/ai/services/ai_inference/notice_store.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py`
  - `mashos-api/ai/tests/contract/test_notice_contracts.py`
- 修正対象になりうる変更:
  - Home/startup read-write public contract

### `mashos-api/ai/services/ai_inference/api_today_question.py`
- repo: `mashos-api`
- system: `Home / startup public API`
- 現行状態: `shared`
- 役割: FastAPI route module for GET /today-question/current, GET /today-question/status, POST /today-question/answers, GET /today-question/history, PATCH /today-question/history/{answer_id}, GET /today-question/settings, PATCH /today-question/settings, POST /cron/today-question/push
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/active_users_store.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py` — from import
  - `mashos-api/ai/services/ai_inference/publish_governance.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/today_question_store.py` — from import
- このファイルを直接参照するファイル:
  - `Cocolon/lib/api/home/todayQuestionApi.js` — endpoint /today-question/answers
  - `Cocolon/lib/api/home/todayQuestionApi.js` — endpoint /today-question/settings
  - `mashos-api/ai/services/ai_inference/api_home_state.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py` — from import
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` — from import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/lib/api/home/todayQuestionApi.js`
  - `mashos-api/ai/services/ai_inference/active_users_store.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_home_state.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py`
  - `mashos-api/ai/services/ai_inference/publish_governance.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/today_question_store.py`
- 修正対象になりうる変更:
  - Home/startup read-write public contract

### `mashos-api/ai/services/ai_inference/home_gateway/__init__.py`
- repo: `mashos-api`
- system: `Home gateway / dispatch`
- 現行状態: `shared`
- 役割: Home write gateway for the national system.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - Home write command fan-out, startup invalidation, dispatch planning

### `mashos-api/ai/services/ai_inference/home_gateway/cache_invalidator.py`
- repo: `mashos-api`
- system: `Home gateway / dispatch`
- 現行状態: `shared`
- 役割: Home gateway runtime module. Current role: cache invalidator.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` — from import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py`
- 修正対象になりうる変更:
  - Home write command fan-out, startup invalidation, dispatch planning

### `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py`
- repo: `mashos-api`
- system: `Home gateway / dispatch`
- 現行状態: `shared`
- 役割: Home gateway runtime module. Current role: command gateway.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_notice.py` — from import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_notice.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py`
- 修正対象になりうる変更:
  - Home write command fan-out, startup invalidation, dispatch planning

### `mashos-api/ai/services/ai_inference/home_gateway/command_types.py`
- repo: `mashos-api`
- system: `Home gateway / dispatch`
- 現行状態: `shared`
- 役割: Home gateway runtime module. Current role: command types.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - Home write command fan-out, startup invalidation, dispatch planning

### `mashos-api/ai/services/ai_inference/home_gateway/dispatch_planner.py`
- repo: `mashos-api`
- system: `Home gateway / dispatch`
- 現行状態: `shared`
- 役割: Home gateway runtime module. Current role: dispatch planner.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - Home write command fan-out, startup invalidation, dispatch planning

### `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py`
- repo: `mashos-api`
- system: `Home gateway / dispatch`
- 現行状態: `shared`
- 役割: Home gateway runtime module. Current role: emotion reflection publish service.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_reflection_store.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py` — from import
  - `mashos-api/ai/services/ai_inference/reflection_publish_entitlements.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/emotion_reflection_store.py`
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py`
  - `mashos-api/ai/services/ai_inference/reflection_publish_entitlements.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
- 修正対象になりうる変更:
  - Home write command fan-out, startup invalidation, dispatch planning

### `mashos-api/ai/services/ai_inference/home_gateway/emotion_submit_service.py`
- repo: `mashos-api`
- system: `Home gateway / dispatch`
- 現行状態: `legacy-live`
- 役割: Home gateway runtime module. Current role: emotion submit service.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py` — import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — from import
  - `mashos-api/ai/services/ai_inference/api_home_state.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
  - `mashos-api/ai/services/ai_inference/api_home_state.py`
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py`
- 修正対象になりうる変更:
  - Home write command fan-out, startup invalidation, dispatch planning

### `mashos-api/ai/services/ai_inference/home_gateway/notice_command_service.py`
- repo: `mashos-api`
- system: `Home gateway / dispatch`
- 現行状態: `shared`
- 役割: Home gateway runtime module. Current role: notice command service.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/notice_store.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/notice_store.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
- 修正対象になりうる変更:
  - Home write command fan-out, startup invalidation, dispatch planning

### `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py`
- repo: `mashos-api`
- system: `Home gateway / dispatch`
- 現行状態: `shared`
- 役割: Home gateway runtime module. Current role: read model service.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_global_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/api_input_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/api_notice.py` — from import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_home_state.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_global_summary.py`
  - `mashos-api/ai/services/ai_inference/api_home_state.py`
  - `mashos-api/ai/services/ai_inference/api_input_summary.py`
  - `mashos-api/ai/services/ai_inference/api_notice.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
- 修正対象になりうる変更:
  - Home write command fan-out, startup invalidation, dispatch planning

### `mashos-api/ai/services/ai_inference/home_gateway/today_question_command_service.py`
- repo: `mashos-api`
- system: `Home gateway / dispatch`
- 現行状態: `shared`
- 役割: Home gateway runtime module. Current role: today question command service.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/today_question_store.py` — from import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py`
  - `mashos-api/ai/services/ai_inference/today_question_store.py`
- 修正対象になりうる変更:
  - Home write command fan-out, startup invalidation, dispatch planning

### `mashos-api/ai/services/ai_inference/notice_store.py`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `shared`
- 役割: Backend support module. Current system: backend support / misc.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/client_compat.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_notice.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/notice_command_service.py` — from import
  - `mashos-api/ai/tests/contract/test_notice_contracts.py` — import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_notice.py`
  - `mashos-api/ai/services/ai_inference/client_compat.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/notice_command_service.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/tests/contract/test_notice_contracts.py`
- 修正対象になりうる変更:
  - misc backend support change

### `mashos-api/ai/services/ai_inference/response_microcache.py`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `shared`
- 役割: Backend support module. Current system: backend support / misc.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/request_metrics.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_friends.py` — from import
  - `mashos-api/ai/services/ai_inference/api_global_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/api_input_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — from import
  - `mashos-api/ai/services/ai_inference/api_notice.py` — from import
  - `mashos-api/ai/services/ai_inference/api_report_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — import
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/cache_invalidator.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/notice_command_service.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py` — from import
  - `mashos-api/ai/services/ai_inference/notice_store.py` — from import
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` — from import
  - `mashos-api/ai/services/ai_inference/today_question_store.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_friends.py`
  - `mashos-api/ai/services/ai_inference/api_global_summary.py`
  - `mashos-api/ai/services/ai_inference/api_input_summary.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
  - `mashos-api/ai/services/ai_inference/api_notice.py`
  - `mashos-api/ai/services/ai_inference/api_report_reads.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/cache_invalidator.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/notice_command_service.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py`
  - `mashos-api/ai/services/ai_inference/notice_store.py`
  - `mashos-api/ai/services/ai_inference/request_metrics.py`
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py`
  - `mashos-api/ai/services/ai_inference/today_question_store.py`
- 修正対象になりうる変更:
  - misc backend support change

### `mashos-api/ai/services/ai_inference/startup_snapshot_store.py`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `legacy-live`
- 役割: Backend support module. Current system: backend support / misc.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_friends.py` — from import
  - `mashos-api/ai/services/ai_inference/api_notice.py` — from import
  - `mashos-api/ai/services/ai_inference/api_report_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py` — from import
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/cache_invalidator.py` — from import
  - `mashos-api/ai/services/ai_inference/middleware_active_user_touch.py` — from import
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py` — import
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py`
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py`
  - `mashos-api/ai/services/ai_inference/api_friends.py`
  - `mashos-api/ai/services/ai_inference/api_notice.py`
  - `mashos-api/ai/services/ai_inference/api_report_reads.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/cache_invalidator.py`
  - `mashos-api/ai/services/ai_inference/middleware_active_user_touch.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py`
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
- 修正対象になりうる変更:
  - misc backend support change

### `mashos-api/ai/services/ai_inference/today_question_store.py`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `shared`
- 役割: Backend support module. Current system: backend support / misc.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py` — from import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/today_question_command_service.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/today_question_command_service.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - misc backend support change


## A5. EmlisAI / immediate reply / Home runtime support

### `mashos-api/ai/services/ai_inference/active_users_store.py`
- repo: `mashos-api`
- system: `account runtime`
- 現行状態: `legacy-live`
- 役割: active_users_store.py (Phase 8+)
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_notice.py` — from import
  - `mashos-api/ai/services/ai_inference/api_profile_create.py` — from import
  - `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py` — from import
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — from import
  - `mashos-api/ai/services/ai_inference/middleware_active_user_touch.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_notice.py`
  - `mashos-api/ai/services/ai_inference/api_profile_create.py`
  - `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py`
  - `mashos-api/ai/services/ai_inference/api_subscription.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
  - `mashos-api/ai/services/ai_inference/middleware_active_user_touch.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - account lifecycle / status / visibility / active-user touch

### `mashos-api/ai/services/ai_inference/emlis_ai_capability.py`
- repo: `mashos-api`
- system: `EmlisAI / immediate reply runtime`
- 現行状態: `shared`
- 役割: Backend support module. Current system: EmlisAI / immediate reply runtime.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py` — from import
  - `mashos-api/ai/tests/test_emlis_ai_observation_kernel.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py`
  - `mashos-api/ai/tests/test_emlis_ai_observation_kernel.py`
- 修正対象になりうる変更:
  - input_feedback, world model, context/style/reply

### `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
- repo: `mashos-api`
- system: `EmlisAI / immediate reply runtime`
- 現行状態: `active`
- 役割: Backend support module. Current system: EmlisAI / immediate reply runtime.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_input_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_history_search_service.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
  - `mashos-api/ai/services/ai_inference/today_question_store.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_input_summary.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py`
  - `mashos-api/ai/services/ai_inference/emotion_history_search_service.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/services/ai_inference/today_question_store.py`
- 修正対象になりうる変更:
  - input_feedback, world model, context/style/reply

### `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py`
- repo: `mashos-api`
- system: `EmlisAI / immediate reply runtime`
- 現行状態: `shared`
- 役割: Backend support module. Current system: EmlisAI / immediate reply runtime.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` — from import
  - `mashos-api/ai/tests/test_emlis_ai_greeting_state_store.py` — import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/tests/test_emlis_ai_greeting_state_store.py`
- 修正対象になりうる変更:
  - input_feedback, world model, context/style/reply

### `mashos-api/ai/services/ai_inference/emlis_ai_observation_kernel.py`
- repo: `mashos-api`
- system: `EmlisAI / immediate reply runtime`
- 現行状態: `shared`
- 役割: Backend support module. Current system: EmlisAI / immediate reply runtime.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` — from import
  - `mashos-api/ai/tests/test_emlis_ai_observation_kernel.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py`
  - `mashos-api/ai/tests/test_emlis_ai_observation_kernel.py`
- 修正対象になりうる変更:
  - input_feedback, world model, context/style/reply

### `mashos-api/ai/services/ai_inference/emlis_ai_prompt.py`
- repo: `mashos-api`
- system: `EmlisAI / immediate reply runtime`
- 現行状態: `active`
- 役割: Backend support module. Current system: EmlisAI / immediate reply runtime.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - input_feedback, world model, context/style/reply

### `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
- repo: `mashos-api`
- system: `EmlisAI / immediate reply runtime`
- 現行状態: `active`
- 役割: Backend support module. Current system: EmlisAI / immediate reply runtime.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_capability.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_observation_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_style_profile_service.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_world_model_service.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_history_search_service.py` — from import
  - `mashos-api/ai/services/ai_inference/input_feedback_text_templates.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_capability.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_observation_kernel.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_style_profile_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_world_model_service.py`
  - `mashos-api/ai/services/ai_inference/emotion_history_search_service.py`
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py`
  - `mashos-api/ai/services/ai_inference/input_feedback_text_templates.py`
- 修正対象になりうる変更:
  - input_feedback, world model, context/style/reply

### `mashos-api/ai/services/ai_inference/emlis_ai_style_profile_service.py`
- repo: `mashos-api`
- system: `EmlisAI / immediate reply runtime`
- 現行状態: `active`
- 役割: Backend support module. Current system: EmlisAI / immediate reply runtime.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py`
- 修正対象になりうる変更:
  - input_feedback, world model, context/style/reply

### `mashos-api/ai/services/ai_inference/emlis_ai_types.py`
- repo: `mashos-api`
- system: `EmlisAI / immediate reply runtime`
- 現行状態: `shared`
- 役割: Backend support module. Current system: EmlisAI / immediate reply runtime.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_capability.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_observation_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_style_profile_service.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_world_model_service.py` — from import
  - `mashos-api/ai/tests/test_emlis_ai_observation_kernel.py` — from import
  - `mashos-api/ai/tests/test_emlis_ai_user_model_store.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_capability.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_observation_kernel.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_style_profile_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_world_model_service.py`
  - `mashos-api/ai/tests/test_emlis_ai_observation_kernel.py`
  - `mashos-api/ai/tests/test_emlis_ai_user_model_store.py`
- 修正対象になりうる変更:
  - input_feedback, world model, context/style/reply

### `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py`
- repo: `mashos-api`
- system: `EmlisAI / immediate reply runtime`
- 現行状態: `shared`
- 役割: Backend support module. Current system: EmlisAI / immediate reply runtime.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` — from import
  - `mashos-api/ai/tests/test_emlis_ai_user_model_store.py` — import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/tests/test_emlis_ai_user_model_store.py`
- 修正対象になりうる変更:
  - input_feedback, world model, context/style/reply

### `mashos-api/ai/services/ai_inference/emlis_ai_world_model_service.py`
- repo: `mashos-api`
- system: `EmlisAI / immediate reply runtime`
- 現行状態: `active`
- 役割: Backend support module. Current system: EmlisAI / immediate reply runtime.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py`
- 修正対象になりうる変更:
  - input_feedback, world model, context/style/reply

### `mashos-api/ai/services/ai_inference/emotion_reflection_generation_service.py`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `active`
- 役割: Deterministic preview generator for the new emotion-generated Reflection flow.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py`
- 修正対象になりうる変更:
  - misc backend support change

### `mashos-api/ai/services/ai_inference/emotion_reflection_store.py`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `shared`
- 役割: Store helpers for the new emotion-generated Reflection flow.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — from import
  - `mashos-api/ai/services/ai_inference/reflection_publish_entitlements.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py`
  - `mashos-api/ai/services/ai_inference/reflection_publish_entitlements.py`
- 修正対象になりうる変更:
  - misc backend support change

### `mashos-api/ai/services/ai_inference/emotion_submit_service.py`
- repo: `mashos-api`
- system: `EmlisAI / immediate reply runtime`
- 現行状態: `legacy-live`
- 役割: Shared helpers for emotion persistence flows.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_submit_service.py` — import
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py` — import
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — import
  - `mashos-api/ai/tests/contract/test_emlis_ai_contracts.py` — import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_submit_service.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py`
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
  - `mashos-api/ai/tests/contract/test_emlis_ai_contracts.py`
- 修正対象になりうる変更:
  - input_feedback, world model, context/style/reply

### `mashos-api/ai/services/ai_inference/input_feedback_text_templates.py`
- repo: `mashos-api`
- system: `EmlisAI / immediate reply runtime`
- 現行状態: `shared`
- 役割: 感情入力直後コメント（input_feedback.comment_text）の文面テンプレ管理と
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
- 修正対象になりうる変更:
  - input_feedback, world model, context/style/reply


## A6. 2026-04-22 差分更新 (EmlisAI reader boundary)

### 差分更新: `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
- repo: `mashos-api`
- system: `EmlisAI / immediate reply runtime`
- 現行状態: `active`
- 現在の役割: SourceBundle builder。`api_input_summary.py` / `api_myweb_reads.py` 直 import をやめ、`emlis_ai_readers.py` を唯一の read adapter boundary として使う。
- 2026-04-22 時点の直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_readers.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_history_search_service.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
  - `mashos-api/ai/services/ai_inference/today_question_store.py` — from import
- 2026-04-22 時点で必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_readers.py`
  - `mashos-api/ai/services/ai_inference/input_summary_reader.py`
  - `mashos-api/ai/services/ai_inference/analysis_summary_reader.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py`
- 差分要点:
  - EmlisAI は route module ではなく meaning-layer reader 契約に依存する

### `mashos-api/ai/services/ai_inference/emlis_ai_readers.py`
- repo: `mashos-api`
- system: `EmlisAI / immediate reply runtime`
- 現行状態: `active`
- 役割: EmlisAI 用の meaning-layer read adapter。入力要約と Analysis 要約 artifact を route module 非依存で渡す。
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/analysis_summary_reader.py` — from import
  - `mashos-api/ai/services/ai_inference/input_summary_reader.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
  - `mashos-api/ai/services/ai_inference/analysis_summary_reader.py`
  - `mashos-api/ai/services/ai_inference/input_summary_reader.py`
- 修正対象になりうる変更:
  - input_feedback, world model, context/style/reply

### `mashos-api/ai/services/ai_inference/input_summary_reader.py`
- repo: `mashos-api`
- system: `EmlisAI / immediate reply runtime`
- 現行状態: `active`
- 役割: Route file を経由せず canonical input summary snapshot を組み立てる reader。
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_readers.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_readers.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - input_feedback, world model, context/style/reply

### `mashos-api/ai/services/ai_inference/analysis_summary_reader.py`
- repo: `mashos-api`
- system: `EmlisAI / immediate reply runtime`
- 現行状態: `active`
- 役割: MyWeb home summary artifact を read-side owner 契約で読む reader。EmlisAI と Analysis read の共通 adapter。
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/publish_governance.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_readers.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_readers.py`
  - `mashos-api/ai/services/ai_inference/publish_governance.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - input_feedback, world model, context/style/reply

# 2026-04-25 差分追記: App / Home current補正

- `Cocolon(108).zip` では RN 側の Home / Input 境界は `Cocolon/features/home/useHomeActions.js`、`Cocolon/features/home/useHomeState.js`、`Cocolon/lib/api/home/*`、`Cocolon/lib/api/client.js`、`Cocolon/lib/apiClient.js` を中心に維持されています。
- Emotion preview 名は `EmotionReflection` から current `EmotionPiece` へ寄っています。current files は `Cocolon/components/EmotionPiecePreviewModal.js`、`Cocolon/lib/api/home/emotionPieceApi.js`、`Cocolon/lib/emotionPieceApi.js` です。
- legacy wire key の吸収は `Cocolon/lib/compat/legacyWireContracts.js` に集約されています。これは旧構造の実体ではなく、DB/legacy route 退役前の互換境界です。

# 2026-04-28 差分追記: Home / Input / EmlisAI hot path補正

この追記は、旧本文を壊さず、最新zipで増えた Home / Input / EmlisAI hot path 関係の新規・変更ファイルを補足する。

## 新規 file block

### `mashos-api/ai/services/ai_inference/emlis_ai_quality_gate.py`
- repo: `mashos-api`
- system: `EmlisAI構造 / immediate reply quality gate`
- 現行状態: `active`
- 役割: EmlisAI即時応答が current input central、履歴利用許可、証拠充足、診断/断定抑制、長文化抑制を満たすか判定し、`input_feedback.emlis_ai.quality_gate` に additive meta を返す。
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_capability.py`
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py`
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/tests/contract/test_new_national_core_emlis_contracts.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_observation_kernel.py`

### `mashos-api/ai/services/ai_inference/core_contract_registry.py`
- repo: `mashos-api`
- system: `新国家システム / 三大中核構造 registry`
- 現行状態: `active`
- 役割: `EmlisAI構造`、`分析構造`、`Piece構造` の input / output / storage / gate / read surface を固定する内部registry。
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_contract_registry.py`
  - `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md`
  - `mashos-api/ai/tests/contract/test_new_national_core_piece_contracts.py`
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_quality_gate.py`
  - `mashos-api/ai/services/ai_inference/analysis_report_validity_gate.py`
  - `mashos-api/ai/services/ai_inference/piece_generation_policy.py`

## 既存 file の差分

- `Cocolon/components/EmotionPiecePreviewModal.js` は、Piece preview表示で `piece_text || reflection_text` を読む互換表示に更新された。編集UIは追加しない。
- `mashos-api/ai/services/ai_inference/api_emotion_submit.py` は、共有Supabase client、background制限、ASTOR thread退避、FCM queue enqueueを含む hot path 補強済み。
- `mashos-api/ai/services/ai_inference/emotion_submit_service.py` は、EmlisAI即時応答に timeout budget を持つ。
- `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` は、独立context取得を並列化する。
- `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` / `emlis_ai_types.py` / `emlis_ai_capability.py` は、EmlisAI quality gate meta と capability拡張を保持する。

# 2026-05-05 差分追記: EmlisAI immediate reply current pipeline / Tutorial flow

## EmlisAI immediate reply の current pipeline

`input_feedback.comment_text` は `POST /emotion/submit` 保存直後に返す immediate reply です。現行構造では、例文専用の固定返答ではなく、次の汎用pipelineとして読む。

```text
current_input
  -> emlis_ai_user_word_anchor_service
  -> emlis_ai_phrase_shaping_service
  -> emlis_ai_input_meaning_block_service
  -> emlis_ai_understanding_frame_service
  -> emlis_ai_world_model_service
  -> emlis_ai_response_composition_service
  -> emlis_ai_observation_kernel
  -> emlis_ai_reply_service
  -> emlis_ai_reply_final_review_service
  -> emlis_ai_quality_gate
  -> emlis_ai_safe_reply_fallback_service, if needed
```

| file | 現状の役割 | 同時確認 |
|---|---|---|
| `emlis_ai_user_word_anchor_service.py` | current inputから、返答材料になるuser word anchorを抽出する | phrase shaping / meaning block |
| `emlis_ai_phrase_shaping_service.py` | raw anchorをそのまま差し込まず、会話文に入るphraseへ整形する | final review / quality gate |
| `emlis_ai_input_meaning_block_service.py` | phraseと段落・接続語から汎用意味ブロックを作る | composition / observation kernel |
| `emlis_ai_understanding_frame_service.py` | anchor/meaning blockの関係を理解frameへ整理する | world model |
| `emlis_ai_response_composition_service.py` | 意味ブロックを、入口・背景・緊張/限界・気づき・新しい向き・安心文へ並べる | observation kernel / final review |
| `emlis_ai_reply_final_review_service.py` | 破綻文、文末反復、構成不足、未grounded行を返答前に検出する | quality gate |
| `emlis_ai_quality_gate.py` | additive metaに加え、pre-return gateとして使われる | reply service / safe fallback |
| `emlis_ai_safe_reply_fallback_service.py` | Gate fail時に、例文固定文ではなく現在入力のsafe phrase / meaning blockから返答を作る | reply service |

EmlisAIの品質改善で触る場合は、`emlis_ai_reply_service.py` だけで判断せず、上記pipelineをまとめて見る。例文はruntime条件ではなくテストケースとして扱う。

## Tutorial flow / fixture boundary

- `Cocolon/screens/TutorialFlowScreen.js` は tutorial のintro/connection/other/finishを扱うRN screen。
- `Cocolon/tutorial/tutorialScenarioData.js` は `tutorial/generated/tutorialFixtures.generated.json` を読み、fixture不備時のfallback sampleも持つ。
- `mashos-api/scripts/generate_tutorial_fixtures.py` は実generation serviceからfixtureを生成する保守script。アプリ実行時のAPI pathではない。
- Tutorial fixture 内のEmlisAI / Piece文言は表示用静的データであり、EmlisAI runtimeの品質判定として扱わない。


# 2026-05-07 差分追記: EmlisAI value observation 接続

EmlisAI immediate reply は、既存の `user word anchor -> phrase shaping -> meaning block -> understanding frame -> world model -> observation kernel -> reply service -> final review / quality gate -> safe fallback` に、共通value observation layerをadditive接続する。

| file | 現状の役割 | 同時確認 |
|---|---|---|
| `value_observation_types.py` | 三大中核構造で共有する `ValueObservationSignal` / `ValueObservationPlan` の型定義 | `cocolon_value_observation_service.py` |
| `cocolon_value_observation_service.py` | 現在入力から5種類のvalue observation signalを抽出する。例文固定文ではなく汎用rule | `test_cocolon_value_observation_service.py` |
| `emlis_ai_world_model_service.py` | `value_observation_signals` / `value_observation_plan` をworld model factsへ保持 | `emlis_ai_types.py` |
| `emlis_ai_observation_kernel.py` | signalの `emlis_text` を `value_observation.*` candidateとして扱う | `emlis_ai_reply_service.py` |
| `emlis_ai_reply_service.py` | EmlisAI metaへvalue observationをadditiveにserializeする | `emlis_ai_quality_gate.py` |
| `emlis_ai_reply_final_review_service.py` | 内部観測語・責め語・断定語を返答前に遮断する | `emlis_ai_safe_reply_fallback_service.py` |
| `emlis_ai_safe_reply_fallback_service.py` | fallbackでもvalue observation lineを使い、単なる受領文へ戻さない | `emlis_ai_quality_gate.py` |

EmlisAIで出すのは内部観測語ではなく、ユーザー向けにsoftenした表現です。`コンフォートゾーン`、`スペック`、`精神の問題`、`皮算用` は内部観測語として扱い、返答本文には直接出さない。


# 2026-05-09 差分追記: Home / Today Question / Tutorial current boundary

| file | 追加・更新された読み方 |
|---|---|
| `Cocolon/features/home/useHomeActions.js` | 今日の問い回答時に `question_origin` / `personal_question_id` / `source_anchor_hash` をpayloadへ入れる。既存static回答との互換は維持する |
| `Cocolon/components/TodayQuestionCard.js` | `personal_followup` でも既存のquestion.text / choices表示を使う。個別生成感を強く出すラベルは不要 |
| `Cocolon/screens/TodayQuestionHistoryScreen.js` | personal回答の履歴では `source_anchor_summary.anchor_text` を `入力: 「...」` として短く表示する |
| `Cocolon/screens/InputScreen.js` | Tutorial Home説明時に `今日の全体行動` と `入力履歴` を非表示化し、感情選択とカテゴリ選択を別フェーズ化する |
| `Cocolon/tutorial/tutorialScenarioData.js` | `Emlis（エムリス）` 表記、ピース説明文、つながる3体験表の文言を最新UIに合わせる |
| `Cocolon/screens/NexusScreen.js` | フォロー中ユーザーのピース説明を「フォロー中ユーザーのピースも同じように閲覧できます。」へ更新済み |
| `Cocolon/screens/TutorialFlowScreen.js` | `Emlis（エムリス）` 読み仮名をチュートリアル案内へ反映する |


# 2026-05-09 実ファイル再照合: current owner補正

この表は `Cocolon(138).zip` / `mashos-api_2(26).zip` の実ファイル一覧と、この資料内の current 参照を照合した補正です。
旧本文内の `active` / `shared` / `legacy-live` 表記よりも、この表を優先します。旧名称はDB physical name / compat / 旧route説明として保管できるが、current実ファイルownerとしては扱いません。

| 旧参照path | 実ファイル照合 | current owner / 読み方 |
|---|---|---|
| `Cocolon/components/EmotionReflectionPreviewModal.js` | local snapshot未収録 | Cocolon/components/EmotionPiecePreviewModal.js |
| `Cocolon/expo-env.d.ts` | local snapshot未収録 | 今回local snapshotには存在しない。Expo generated type helper扱い。current runtime sourceとして扱わない。 |
| `Cocolon/lib/api/home/emotionReflectionApi.js` | local snapshot未収録 | Cocolon/lib/api/home/emotionPieceApi.js |
| `Cocolon/lib/emotionReflectionApi.js` | local snapshot未収録 | Cocolon/lib/api/home/emotionPieceApi.js。root legacy façadeは今回local snapshotには存在しない。 |
| `Cocolon/react-native.config.js` | local snapshot未収録 | 今回local snapshotには存在しない。native/config補助はGitHub正本確認済みconfig群を優先し、このpathをcurrent sourceとして扱わない。 |
| `Cocolon/screens/DeepInsightScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisScreen.js / Cocolon/screens/AnalysisContentFirstScreen.js。DeepInsight単独screenは今回local snapshotには存在しない。 |
| `Cocolon/screens/EchoesHistoryDetailScreen.js` | local snapshot未収録 | Cocolon/screens/ResonanceHistoryDetailScreen.js |
| `Cocolon/screens/EchoesHistoryListScreen.js` | local snapshot未収録 | Cocolon/screens/ResonanceHistoryListScreen.js |
| `Cocolon/screens/MyModelDiscoveriesRankingScreen.js` | local snapshot未収録 | current ranking surfaceでは単独Discoveries screenは存在しない。RankingTop / PieceResonanceRanking / backend ranking viewsを優先する。 |
| `Cocolon/screens/MyModelEchoesRankingScreen.js` | local snapshot未収録 | Cocolon/screens/PieceResonanceRankingScreen.js |
| `Cocolon/screens/MyModelEntryScreen.js` | local snapshot未収録 | Cocolon/screens/PieceEntryScreen.js |
| `Cocolon/screens/MyModelMenuCommon.js` | local snapshot未収録 | Cocolon/screens/PieceMenuCommon.js |
| `Cocolon/screens/MyModelQuestionsRankingScreen.js` | local snapshot未収録 | current ranking surfaceでは単独Questions screenは存在しない。RankingTop / InputCountRanking / InputLengthRanking / PieceResonanceRankingを優先する。 |
| `Cocolon/screens/MyModelReactionHistoryScreen.js` | local snapshot未収録 | Cocolon/screens/ResonanceHistoryListScreen.js / Cocolon/screens/ResonanceHistoryDetailScreen.js |
| `Cocolon/screens/MyModelReflectionsScreen.js` | local snapshot未収録 | Cocolon/screens/PieceLibraryScreen.js / Cocolon/screens/NexusScreen.js |
| `Cocolon/screens/MyModelScreen.js` | local snapshot未収録 | Cocolon/screens/PieceScreen.js / Cocolon/screens/PieceEntryScreen.js / Cocolon/screens/NexusScreen.js |
| `Cocolon/screens/MyWebEnsureClient.js` | local snapshot未収録 | Cocolon/screens/AnalysisEnsureClient.js |
| `Cocolon/screens/MyWebHistoryScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisHistoryScreen.js |
| `Cocolon/screens/MyWebMenuCommon.js` | local snapshot未収録 | Cocolon/screens/AnalysisMenuCommon.js |
| `Cocolon/screens/MyWebReportHistoryScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisReportHistoryScreen.js |
| `Cocolon/screens/MyWebReportViewerScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisReportViewerScreen.js |
| `Cocolon/screens/MyWebScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisScreen.js |

# 2026-05-09 差分追記: App root / Home split / monitoring boundary

RN巨大画面分割により、App root と Home(Input) は entry shell + submodule 構造として読む。

## App root / navigation / runtime

| path | current role |
|---|---|
| `Cocolon/App.js` | provider順、NavigationContainer、初期push通知接続、monitoring初期化を持つentry shell |
| `Cocolon/components/GlobalFrameLayout.js` | global frame表示component。App.jsから分離された表示境界 |
| `Cocolon/navigation/navigationRef.js` | navigationRef singleton とpending notification route queueのowner |
| `Cocolon/navigation/notificationRouting.js` | push通知dataからInput / Analysis / Piece(EmotionLog)へのroute解決を行う |
| `Cocolon/navigation/linkingRuntime.js` | app link / share code / public profile解決とAccount遷移を扱う |
| `Cocolon/navigation/InputStackNavigator.js` | Input stack route定義。route名は変更しない |
| `Cocolon/navigation/AnalysisStackNavigator.js` | Analysis stack route定義。AnalysisからPiece deep dive導線を維持する |
| `Cocolon/navigation/PieceStackNavigator.js` | Piece stack route定義。PieceLibrary / EmotionLog / TutorialFlow route名を維持する |
| `Cocolon/navigation/RankingStackNavigator.js` | Ranking stack route定義 |
| `Cocolon/navigation/SettingsStackNavigator.js` | Settings stack route定義 |
| `Cocolon/navigation/MainTabs.js` | tab bar / unread badge / startup warmup / self-structure bannerを扱う |
| `Cocolon/navigation/RootNavigator.js` | auth gate、IAP observer、push token sync、root runtimeを扱う |
| `Cocolon/runtime/AppRuntimeBootstrapGate.js` | `/app/bootstrap` refreshとbootstrap失敗監視を扱う |
| `Cocolon/runtime/AppRuntimeBlockingScreen.js` | minimum version block / maintenance表示境界 |

## Home / Input split

| path | current role |
|---|---|
| `Cocolon/screens/InputScreen.js` | Home/Input entry shell。API導線とrender全体のownerとして残る |
| `Cocolon/screens/input/inputOptions.js` | emotion/category/tutorial step等の入力定数 |
| `Cocolon/screens/input/inputDraftModel.js` | input draft normalize / TTL / storage key model |
| `Cocolon/screens/input/inputFeedbackModel.js` | Emlis返答modalへ渡す感情meta整形 |
| `Cocolon/screens/input/inputLayoutModel.js` | memo input height / keyboard-aware layout helper |
| `Cocolon/screens/input/inputNoticeModel.js` | welcome notice popup判定 |
| `Cocolon/screens/input/useInputDraftPersistence.js` | 下書き保存・復元・破棄・blur/background保存 |
| `Cocolon/screens/input/useInputFeedbackModal.js` | Emlis返答modal開閉とtutorial後Analysis遷移 |
| `Cocolon/screens/input/useInputKeyboardAwareMemo.js` | memo/memoActionの高さ・keyboard inset・focus scroll |
| `Cocolon/screens/input/InputEmotionSection.js` | 感情選択UI section |
| `Cocolon/screens/input/InputCategorySection.js` | カテゴリ選択UI section |
| `Cocolon/screens/input/InputMemoSection.js` | memo / memoAction UI section |
| `Cocolon/screens/input/InputActionArea.js` | 送信 / Piece preview等のaction area |
| `Cocolon/screens/input/InputStartupModals.js` | Notice / Today Question / draft restoreなどstartup modal接続 |
| `Cocolon/screens/input/InputFeedbackReplyModal.js` | Emlis返答modal表示component |
| `Cocolon/screens/input/InputPiecePreviewController.js` | EmotionPiecePreviewModal接続 |
| `Cocolon/screens/input/InputToastOverlay.js` | toast表示境界 |

## RN monitoring

| path | current role |
|---|---|
| `Cocolon/lib/monitoring.js` | RN client event / global JS error / API errorのprivacy-safe送信helper |
| `Cocolon/lib/apiClient.js` | API失敗時に `captureApiError` を呼ぶ。request / response shapeは変更しない |

監視はbest-effortであり、送信失敗してもアプリ動作を止めない。

# 2026-05-09 差分追記: App root / Home分割 / 監視 current boundary

| file | 役割 | 同時確認 |
|---|---|---|
| `Cocolon/App.js` | provider順とNavigationContainerを保持するentry shell | `navigation/RootNavigator.js`, `runtime/AppRuntimeBootstrapGate.js`, `lib/monitoring.js` |
| `Cocolon/navigation/navigationRef.js` | navigationRef singletonと通知route queue | `notificationRouting.js`, `RootNavigator.js` |
| `Cocolon/navigation/notificationRouting.js` | push通知からInput / Analysis / EmotionLogへ開くroute resolver | `RootNavigator.js`, `App.js` |
| `Cocolon/navigation/linkingRuntime.js` | app link / share code / public profile解決 | `apiClient.js`, `legacyWireContracts.js` |
| `Cocolon/navigation/InputStackNavigator.js` | Input stack entry | `InputScreen.js`, `TutorialFlowScreen.js`, `TodayQuestionHistoryScreen.js` |
| `Cocolon/navigation/MainTabs.js` | tab、unread、startup warmup、self-structure banner | `UnreadContext.js`, `SubscriptionContext.js` |
| `Cocolon/navigation/RootNavigator.js` | auth gate、IAP observer、push token sync、root navigator | `monitoring.js`, `pushToken.js`, `iapService.js` |
| `Cocolon/runtime/AppRuntimeBootstrapGate.js` | `/app/bootstrap` 初期化とruntime gate | `AppRuntimeContext.js`, `monitoring.js` |
| `Cocolon/runtime/AppRuntimeBlockingScreen.js` | minimum version blocking display | `AppRuntimeContext.js` |
| `Cocolon/components/GlobalFrameLayout.js` | App共通frame layout | `MainTabs.js` |
| `Cocolon/lib/monitoring.js` | RN側本番運用監視。global error / API failure / runtime failureを送信 | `apiClient.js`, `api_client_events.py` |
| `Cocolon/lib/apiClient.js` | API共通client。失敗時にmonitoringへprivacy-safe eventを渡す | `monitoring.js` |

## Home/Input split files

| file | 役割 |
|---|---|
| `Cocolon/screens/input/inputOptions.js` | emotion / category / tutorial step定数 |
| `Cocolon/screens/input/inputDraftModel.js` | Input draft normalize / TTL / storage key model |
| `Cocolon/screens/input/inputFeedbackModel.js` | Emlis返答modal用の感情meta作成 |
| `Cocolon/screens/input/inputLayoutModel.js` | memo input height / keyboard layout helper |
| `Cocolon/screens/input/inputNoticeModel.js` | welcome notice判定 |
| `Cocolon/screens/input/useInputDraftPersistence.js` | 下書き保存・復元・破棄・blur/background保存 |
| `Cocolon/screens/input/useInputFeedbackModal.js` | Emlis返答modalとtutorial後Analysis遷移 |
| `Cocolon/screens/input/useInputKeyboardAwareMemo.js` | keyboard inset / memo height / focus scroll |
| `Cocolon/screens/input/InputEmotionSection.js` | 感情選択UI |
| `Cocolon/screens/input/InputCategorySection.js` | カテゴリ選択UI |
| `Cocolon/screens/input/InputMemoSection.js` | memo / memoAction UI |
| `Cocolon/screens/input/InputActionArea.js` | 送信 / Piece preview / notification action area |
| `Cocolon/screens/input/InputStartupModals.js` | notice / today question / draft restore modal接続 |
| `Cocolon/screens/input/InputFeedbackReplyModal.js` | Emlis返答modal表示 |
| `Cocolon/screens/input/InputPiecePreviewController.js` | EmotionPiecePreviewModal接続 |
| `Cocolon/screens/input/InputToastOverlay.js` | lightweight toast表示 |

`InputScreen.js` はentry shellです。`submitEmotionInput`、`previewEmotionPiece`、`publishEmotionPiece`、`useHomeState`、`useHomeActions` の契約・route・payloadは変更しません。

# 2026-05-09 差分追記: EmlisAI multi-perspective observation path

この差分では、Home/Input直後の `Emlisの観測` 表示経路が変更されています。`InputScreen.js` は保存結果の `input_feedback.comment_text` と `input_feedback.emlis_ai.observation_status` を読み、`useInputFeedbackModal.js` は `observation_status` が `passed` 以外ならモーダルを開きません。`InputFeedbackReplyModal.js` 自体も同じ条件で二重に表示制御します。

## frontend current owner

| file | 役割 |
|---|---|
| `Cocolon/screens/InputScreen.js` | `/emotion/submit` / Piece publish後の `input_feedback` を読み、`observationStatus` をmodal hookへ渡す |
| `Cocolon/screens/input/useInputFeedbackModal.js` | `observation_status` が `passed` 以外、または本文空の場合は表示しない |
| `Cocolon/screens/input/InputFeedbackReplyModal.js` | タイトルは `Emlisの観測`。`observationStatus` による表示制御を保持する |

## backend current owner

| file | 役割 |
|---|---|
| `emlis_ai_reply_service.py` | `multi_perspective_observation.v1` のorchestrator |
| `emlis_ai_evidence_ledger_service.py` | EvidenceSpanを作る |
| `emlis_ai_perspective_observers.py` / `emlis_ai_perspective_board.py` | 複数視点の観測結果を作り集約する |
| `emlis_ai_observation_integrator_service.py` | ObservationGraphへ統合する |
| `emlis_ai_conversation_composer_service.py` | 観測構造を会話文へ変換する |
| `emlis_ai_listener_reader_judge.py` / `emlis_ai_grounding_judge.py` / `emlis_ai_template_echo_guard.py` | 読解可能性、根拠、テンプレ・復唱を判定する |
| `emlis_ai_display_gate.py` | fail-closed表示判定を行う |

旧 `emlis_ai_observation_kernel.py`、`emlis_ai_safe_reply_fallback_service.py`、`input_feedback_text_templates.py` はファイルとして残る場合でも、今回の `render_emlis_ai_reply()` のEmlis観測本文経路では固定fallbackとして使わない。

# 2026-05-10 差分追記: Home/Input直後 Emlisの観測 Phase8 quality path

Phase8では、Home/Input側の画面・API呼び出しは変更しません。変更は backend の `Emlisの観測` 本文品質層に限定されます。

| flow | owner | 読み方 |
|---|---|---|
| RN input submit | `Cocolon/screens/InputScreen.js` / `features/home/useHomeActions.js` | 従来どおり `/emotion/submit` を呼ぶ。Phase8用の新payloadは追加しない |
| modal表示 | `screens/input/useInputFeedbackModal.js` / `InputFeedbackReplyModal.js` | `observation_status=passed` かつ本文ありの場合だけ表示する。Phase8で表示条件は変更しない |
| backend quality composer | `emlis_ai_limited_composer_client.py` | scoped graphをPhraseUnit / ObservationProfile / SentencePlanへ変換して本文候補を作る |
| quality guard | `emlis_ai_limited_sentence_quality_guard.py` | `不安。` / `怒り。` / `がつながっています` / `同じ中にあります` など、今回の実入力で出た破綻表面を落とす |

Home/Inputを触る時は、Phase8をフロント導線追加として扱わない。表示可否は引き続き backend Display Gate の `observation_status` に従います。


# 2026-05-11 差分追記: Emlis immediate reply と共通文章生成基盤

`mashos-api_15(2).zip` では、RN側の `InputFeedbackReplyModal.js` / `useInputFeedbackModal.js` / `InputScreen.js` に変更はありません。表示名 `Emlisの観測`、`observation_status=passed` かつ本文ありの表示条件、`input_feedback.comment_text` 契約は維持されています。

backend側では `emlis_ai_limited_composer_client.py` と `emlis_ai_reply_service.py` が共通文章生成基盤へadditive接続されました。Emlisの本文候補は `EmlisObservationComposer` adapterを通って `CoreTextComposer` / 共通Guardで検査され、reject時は空本文でfail-closedします。scoped graph、used evidence、coverage scope、fixed_string_renderer_used=false の境界は維持して読む。

# 2026-05-15 差分追記: EmlisAI A案到達 Step15-20 runtime map

EmlisAI immediate reply は、B案のfail-closed構造を維持したまま、A案相当へ進むためのmeta / QA / rollout層が追加された。読み方は「本文生成を広げるための無条件fallback」ではなく、「通してよい範囲と進める条件を可視化する段階promotion」です。

```text
emotion submit
 -> render_emlis_ai_reply
 -> Evidence Ledger / Perspective Observers / ObservationGraph
 -> LimitedObservationScope / safety boundary
 -> composer registry / rollout stage
 -> LimitedComposer or A-plan-equivalent composer candidate
 -> Common Core / Step15 stabilization
 -> Reader / Grounding / Template Echo / Display Gate
 -> Step16 rollout metrics
 -> Step18 A-P0 migration decision
 -> Step19 A-1 equivalent composer meta
 -> Step20 long-term quality meta
 -> observation_status=passed かつ comment_textありの場合だけ表示
```

## Step15-20 owner

| file | 構造上の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/stabilization.py` | Step15 共通Core安定化。CoreTextPayload / TextGenerationResult / Guard結果 / used_evidence_span_ids / quality_flags が共通形式かをmeta化し、中核別出力目的・public契約・DB名を共通Coreへ移さないことを確認する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_rollout_metrics_service.py` | Step16 段階リリース計測。attempted / passed / rejected / unavailable / safety_blocked / primary_reason / coverage_group / composer_model をdeveloper/QA metaへ集計する。 |
| `mashos-api/ai/tests/test_cocolon_text_generation_core_step15_stabilization.py` | Step15の共通形式・Emlis契約維持・境界drift検出・render metaを固定する回帰。 |
| `mashos-api/ai/tests/test_emlis_ai_step16_rollout_metrics.py` | Step16のrollout metric event / aggregate / reply meta接続を固定する回帰。 |
| `mashos-api/ai/tests/fixtures/emlis_ai_step17_broad_input_cases.py` | Step17 広い入力fixture。生活・体調・人間関係・学習・仕事・長文・履歴・cross coreを正解文一致ではなく構造条件で固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_step17_broad_input_fixtures.py` | Step17 fixtureのcoverage、forbidden_surface、evidence/scope条件を固定する回帰。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_ap0_migration_decision_service.py` | Step18 A-P0移行判定。coverage matrix / rollout metrics / diagnostic_summary / Guard結果から、Step19へ進むかB案の戻り先Stepへ返すmetaを作る。 |
| `mashos-api/ai/tests/test_emlis_ai_step18_ap0_migration_decision.py` | Step18のGreen条件、未達時return_steps、passed-onlyだけで進めない判定を固定する回帰。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_a_plan_equivalent_composer_service.py` | Step19 A案相当Composer導入。A-P0 green時だけ `cocolon_emlis_observation_composer.a1.v1` へpromoteし、B案Gate / scoped graph / fail-closed / passed-onlyを維持する。 |
| `mashos-api/ai/tests/test_emlis_ai_step19_a_plan_equivalent_composer.py` | Step19のpromotion条件、未達時hold、B案境界維持、registry / limited composer接続を固定する回帰。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_long_term_quality_service.py` | Step20 長期品質。previous output similarity、surface variation、history/cross core evidence-only、distance boundary、QA metricsをdeveloper/QA metaへ残す。 |
| `mashos-api/ai/tests/test_emlis_ai_step20_long_term_quality.py` | Step20の反復表面、履歴補完禁止、距離感drift、A-2長期運用品質metaを固定する回帰。 |

## 既存ownerへの接続変更

| file | 差分の読み方 |
|---|---|
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/__init__.py` | Step15 `stabilization.py` の型・定数・report builderを公開し、共通Coreから参照できるようにした。 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/emlis_observation_composer.py` | Emlis adapter metaへ `step15_common_core_stabilization` / `common_core_stabilization` を追加し、Step19 metaを透過する。 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/types.py` | metaのJSON-safe変換を再帰対応にし、GuardResult metaが文字列化されず共通形式で残るようにした。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_composer_client_registry.py` | Limited composerに加えてA案相当composer aliasを解決できるようにした。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_client.py` | Step19 A案相当client / model promotion metaをLimitedComposer境界に接続する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_release_service.py` | Step16 metricsで使うrelease meta / rollout stageの情報を保持する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | Step15 ready、Step16 metrics、Step18 A-P0 decision、Step19 A-1 meta、Step20 A-2 quality metaをdiagnostic_summary / multi_perspectiveへadditive接続する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_template_echo_guard.py` | Template/Echo GuardがA案相当composer model markerをAI生成側として扱えるようにした。 |

## 変更時の注意

- `emlis_ai_reply_service.py` は Step15/16/18/19/20 meta を `diagnostic_summary` / `multi_perspective` へadditive接続する。ユーザー表示本文のfallbackではない。
- `emlis_ai_composer_client_registry.py` はA案相当composer aliasを解決できるが、環境値で無理に `all` 固定して問題を隠さない。
- `emlis_ai_template_echo_guard.py` はA案相当model markerをAI生成候補として扱う。固定観測文や旧safe fallbackを許可する変更ではない。
- 履歴・DerivedUserModel・cross core材料は、本文で本心を補完するためではなく、evidence-only / scope-onlyのQA metaとして扱う。

# 2026-05-15 差分追記: EmlisAI 限定Composer拡張 Step0-11 runtime map

`mashos-api_12(4).zip` では、EmlisAI immediate reply の限定Composer拡張として、候補生成前後の診断・文単位根拠束縛・relation・binding-aware Grounding・Gate trace・限定Surface・scorecard・E2E表示契約が追加されています。これはユーザー表示文を無条件に増やす変更ではなく、Emlisの観測を `passed` で表示できる条件を内部metaで説明し、完全Composer初期版へ進む足場を作る変更です。

## runtime flow補正

```text
render_emlis_ai_reply
 -> composer registry connection visibility
 -> limited composer candidate
 -> PhraseUnit material quality
 -> relation taxonomy
 -> SentenceBinding bundle
 -> limited Surface Realizer
 -> Reader / binding-aware Grounding / Template Guard
 -> Display Gate
 -> Step9 scorecard
 -> Step10 display contract
 -> Step11 limited extension Exit Gate
 -> input_feedback.comment_text only when passed
```

## 新規runtime owner

| file | 役割 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_extension_baseline.py` | baseline / connection visibility / diagnostic_summary v2 / binding presenceのmeta-only helper。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_relation_taxonomy.py` | relation typeを定義し、`relation_not_expressed` を構造で追えるようにする。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_surface_realizer.py` | opener、particle、predicate、tail variationをrelationごとに選ぶ限定Surface Realizer。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_e2e_contract.py` | `comment_text` passed-onlyのE2E表示契約をmeta化する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_extension_exit_gate.py` | 限定Composer拡張完了と完全Composer初期版入口条件を判定する。 |

## 変更runtime owner

| file | 役割 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_client.py` | SentenceBinding bundle、relation taxonomy、PhraseUnit材料品質、限定Surface Realizer metaをComposer出力へ追加する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | Step0-11 metaを `diagnostic_summary` / top-level meta / `multi_perspective` / `phase_gate` へ接続する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_grounding_judge.py` | binding declared evidence / phrase / relationをGrounding根拠として読む。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_display_gate.py` | reader / grounding / template / display traceにbinding情報を残し、non-passed空本文を維持する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_coverage_matrix_service.py` | coverage_group別scorecardとbinding coverageを集計する。 |

禁止: この差分を理由に、外部AI、ローカルLLM、固定完成文、入力専用テンプレ、Gate緩和、`input_feedback.comment_text` の表示条件変更を入れない。

# 2026-05-16 差分追記: EmlisAI 完全Composer初期版 Commit1-13 runtime map

`mashos-api_15(3).zip` では、`Emlisの観測` の内部Composerが、限定Composer拡張の足場から完全Composer初期版へ進むためのruntime層を持ちました。これはRN表示名・public response key・DB physical nameを変更するものではありません。

## runtime flow補正

`emotion_submit_service.py` / `api_emotion_submit.py` から見える公開契約は維持し、内部では `emlis_ai_reply_service.py` が CompleteComposerClient / diagnostics / scorecard meta を受け取る。`comment_text` は従来どおり `observation_status=passed` かつ本文ありの場合だけ表示される。

## Complete Composer初期版 owner

| owner | 役割 |
|---|---|
| `emlis_ai_complete_composer_initial_meta.py` | AP0 decision report と限定/完全Composer呼称metaをadditiveに保持する。 |
| `emlis_ai_complete_composer_types.py` | `CompleteComposerCandidate` / `CompleteSentencePlanV2` / `RepairTrace` の内部型。 |
| `emlis_ai_complete_material_service.py` | EvidenceSpan / PhraseUnit-like row から本文化可能な材料だけを作る。 |
| `emlis_ai_complete_focus_selector.py` | coverage groupから本文に出す観測核を選ぶ。 |
| `emlis_ai_complete_relation_graph_service.py` | relation taxonomyをObservationGraph 2.0へ橋渡しする。 |
| `emlis_ai_complete_sentence_planner.py` | 2〜5文のSentencePlan 2.0を作る。 |
| `emlis_ai_complete_surface_realizer.py` | 文法部品から自然文を組み、surface_signatureをmetaへ残す。 |
| `emlis_ai_complete_grounding_binding.py` / `emlis_ai_complete_grounding_service.py` | Complete用bindingをGroundingJudgeへ渡す。 |
| `emlis_ai_complete_self_repair_service.py` | Gate reasonに応じた安全な自己修復を最大2回だけ行う。 |
| `emlis_ai_complete_composer_client.py` | AP0 green / rollout許可 / no fallback / used evidenceありの場合だけComplete初期版pipelineを統合する。 |
| `emlis_ai_complete_reply_diagnostics_service.py` | reply meta / repair trace / scorecard eventを安全に整形する。 |
| `emlis_ai_complete_scorecard_service.py` | coverage group別に表示到達率・binding・読まれた感・安全性・非テンプレ性を集計する。 |

## RN側の固定

`Cocolon/tests/rn-screen-contracts.test.js` はStep13 regressionとして、Complete Composer初期版metaだけでfrontendが表示を開かないこと、statusを `passed` に補正しないこと、表示名が `Emlisの観測` のままであることを固定する。`InputScreen.js` / `InputFeedbackReplyModal.js` / `useInputFeedbackModal.js` の実装変更ではない。

境界維持:
- DB physical name、既存API route、public response key、RN表示名 `Emlisの観測` は変更しない。
- `input_feedback.comment_text` は `observation_status=passed` かつ本文ありの場合だけ表示する。
- 外部AIレンタル、ローカルLLM、固定完成文テンプレ、入力専用テンプレは追加しない。
- raw user input を改善資料として要求しない。改善は diagnostic_summary / Gate reason / coverage / binding / repair trace / scorecard event で行う。
- これは完全Composer商品品質版ではなく、限定Composerの安全境界を土台にした完全Composer初期版のAlpha実装として読む。


# 2026-05-16 差分追記: EmlisAI immediate reply / 完全Composer初期版 E2E表示開通 Step0-9

最新基準面は `Cocolon_前提資料(87).zip` / `Cocolon_10(7).zip` / `mashos-api_10(10).zip`。Home/Input直後の EmlisAI immediate reply では、完全Composer初期版を通常ルートへ接続するために Entry AP0 / resolver注入 / candidate生成経路 / Final AP0 / scorecard / fixture QA meta が追加されています。

| path | アプリ基盤 / Home系での読み方 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_initial_fixture_qa_service.py` | Home/Input直後replyのComplete初期版QA集計service。表示到達・binding・Gate reasonをsanitized metaとして残す。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_initial_entry_ap0.py` | Entry AP0 helperのfail-closedを固定するtest。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_initial_entry_route.py` | `render_emlis_ai_reply()` の通常経路でEntry AP0 seedからresolver注入、Final AP0 / scorecard接続までを固定するtest。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_initial_step7_integration.py` | AP0/rollout/Gate状態ごとのE2E表示可否を固定するintegration test。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_initial_step9_fixture_qa.py` | fixture / QA runがraw入力やcomment_textを混入させず、product scorecard seedを作ることを固定するtest。 |

RN側は `input_feedback.comment_text` と public `observation_status` だけを表示条件にし、Complete metaだけでは `Emlisの観測` を表示しない。

# 2026-05-16 差分追記: EmlisAI 商品品質版接続 Step0-7 runtime map

Input保存直後の `Emlisの観測` は、Cocolon RN側の表示条件を変えず、backend内部で Complete Composer 初期版の品質接続層を追加している。作業時は次のownerを同時に読む。

| 層 | owner | 読み方 |
|---|---|---|
| Binding contract | `emlis_ai_display_gate.py`, `emlis_ai_reply_service.py` | `binding_present` / `binding_available` / `binding_required` / `binding_missing` / `binding_used` / `binding_support_source` を分けて読む。 |
| Coverage | `emlis_ai_complete_scorecard_service.py`, `emlis_ai_complete_focus_selector.py`, `emlis_ai_complete_sentence_planner.py` | 商品品質版の対象母集団を coverage_group で定義する。fixture文字列へのruntime分岐ではない。 |
| Grounding | `emlis_ai_complete_grounding_binding.py`, `emlis_ai_complete_grounding_service.py`, `emlis_ai_grounding_judge.py` | sentence_idごとに Evidence / PhraseUnit / relation の根拠を確認する。 |
| Surface / Template | `emlis_ai_complete_surface_realizer.py`, `emlis_ai_template_echo_guard.py` | surface_signature、connector、ending、raw echo、same-endingをmetaで検出する。 |
| Self-Repair | `emlis_ai_complete_self_repair_service.py` | Gate reasonに応じて安全なplan/surface調整だけを行う。 |
| Tone | `emlis_ai_complete_tone_policy.py` | Emlisの距離感をTonePolicyとしてSurface前に制約する。 |
| Scorecard / Blind QA | `emlis_ai_complete_product_quality_scorecard_service.py` | machine metrics と Blind QA を分ける。読まれた感はBlind QA由来として扱う。 |
| Release ladder | `emlis_ai_complete_release_ladder_service.py` | internal -> limited -> broader_beta -> product_gate の判定metaを作る。release適用ではない。 |

RN側は `Cocolon/tests/rn-screen-contracts.test.js` の passed-only regression を維持する。Complete / ProductQuality metaだけでmodalを表示しない。


# 2026-05-17 差分追記: Input / EmlisAI positive_recovery relation contract

`Cocolon_9(8).zip` / `mashos-api_9(8).zip` では、Input直後の `Emlisの観測` について、positive_recovery 系入力の `relation_not_expressed` を backend 内部で修正する relation surface contract が追加された。これは Home/Input surface の表示条件変更ではなく、Reader / Surface / Self-Repair の語彙整合と diagnostic meta の追加として読む。

| path | アプリ基盤 / Home系での読み方 |
|---|---|
| `Cocolon/screens/InputScreen.js` | 一時的な `[Emlis observation debug]` console log は削除済み。`openInputFeedbackModal` は従来どおり本文ありの場合だけ呼ばれる。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_relation_surface_contract.py` | recovery relation cue / marker を共有する契約。固定完成文fallbackではなく、Reader / Surface / Self-Repair の基準合わせ。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_listener_reader_judge.py` | `detect_relation_surface()` を使い、recovery relation cue が本文にある場合だけ `relation_not_expressed` を回避する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_self_repair_service.py` | `relation_not_expressed` 時に declared relation の範囲で marker を付与し、意味追加しない。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py` | recovery relation line を relation surface contract と整合させ、surface_signature / grounding inputにcontract metaを残す。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_reply_diagnostics_service.py` | Reader signal / Self-Repair markerをdiagnostic_summaryにadditive接続する。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_product_quality_positive_recovery_e2e.py` | positive_recovery fixtureで、Reader relation_not_expressed が今回ケースで消えることを固定するE2E regression。 |


# 2026-05-17 差分追記: Input / EmlisAI Observation Diagnostic Lockdown frontend boundary

`Cocolon_9(9).zip` / `mashos-api_9(9).zip` では、Input直後の `Emlisの観測` について、RN表示条件を変えずに frontend 側の診断行を追加しています。これは `Emlisの観測` を強制表示する変更ではなく、backend が `passed + comment_text` を返したか、RNがそれを受けてmodalを開いたかを `trace_id` で照合するための診断です。

| owner | 読み方 |
|---|---|
| `Cocolon/screens/input/inputFeedbackObservationDiagnostics.js` | `buildEmlisObservationFrontendDiagnostic()` / `dumpEmlisObservationFrontendDiagnostic()` / `logEmlisObservationFrontendDiagnostic()` を持つ。`trace_id`、`observation_status`、`comment_text_length`、`modal_opened` だけを扱う。 |
| `Cocolon/screens/InputScreen.js` | submit後、`openInputFeedbackModal(...)` の結果が確定した直後に `logEmlisObservationFrontendDiagnostic(...)` を呼ぶ。modal表示条件は既存の `inputFeedbackText` と public statusのまま。 |
| `Cocolon/tests/rn-screen-contracts.test.js` | RN診断helperがenv opt-in、text-free、no forced passedであることを固定する。 |

RN側env:
- `EXPO_PUBLIC_EMLIS_OBSERVATION_DIAGNOSTIC_LOG`
- `EXPO_PUBLIC_COCOLON_EMLIS_OBSERVATION_DIAGNOSTIC_LOG`

守る境界:
- `diagnostic_summary` や Complete meta が `passed` 相当でも、public `input_feedback.emlis_ai.observation_status` が `passed` でなければRNは表示しない。
- `comment_text` 本文はfrontend diagnosticへ出さない。`comment_text_length` / `comment_text_present` だけを見る。
- `Emlisの観測` のvisible名、modal title、public response keyは変更しない。

# 2026-05-17 差分追記: Input / EmlisAI Reader Relation Surface Step0-8 runtime map

`Cocolon_9(10).zip` / `mashos-api_9(10).zip` では、Cocolon RN側に今回の追加変更はありません。backend側で、Observation Diagnostic Lockdownの classification `candidate_generated_but_reader_rejected` に対して Reader Relation Surface Step0-8 が実装されています。Home/Input直後の runtime mapでは、`openInputFeedbackModal` ではなく、`render_emlis_ai_reply()` 内部の Reader / limited A1 repair 層として読む。

| owner | アプリ基盤 / Home系での読み方 |
|---|---|
| `emlis_ai_listener_reader_judge.py` | `Emlisです。` と敬称つき宛名をReader contractとして認識する。 |
| `emlis_ai_reply_service.py` | relation type抽出、Reader呼び出し、retry reason allowlist、limited repair diagnostic接続を担う。 |
| `emlis_ai_limited_composer_client.py` | limited/A1候補に対し、previous Reader rejection reasonがある場合だけrepair adapterを通す。 |
| `emlis_ai_complete_reply_diagnostics_service.py` | limited repair状態を diagnostic_summary / phase_gate metaへ接続する。 |
| `emlis_ai_observation_diagnostic_lockdown.py` | backend一行診断へ limited repair状態を載せる。 |
| `emlis_ai_complete_composer_client.py` | Complete self-repairへ渡す理由を既存の修復可能理由に限定する。 |

RN側は引き続き `input_feedback.comment_text` と public `observation_status` だけで `Emlisの観測` を表示する。limited repair metaやdiagnostic metaだけではmodalを開かない。

# 2026-05-18 差分追記: Input / EmlisAI ProductGate Measurement Step0-10 runtime map

`Cocolon_11(3).zip` では RN runtime file の追加・変更はありません。`Emlisの観測` は引き続き `input_feedback.emlis_ai.observation_status === "passed"` かつ public `input_feedback.comment_text` 非空のときだけ開きます。

`mashos-api_11(6).zip` では、既存の backend/RN 診断行を材料にして、表示/非表示の submit 単位分類を scorecard / release ladder / next action / local report / Exit Gate へ渡す runtime支援層が増えています。これは `/emotion/submit` の保存処理やRN modal条件を変更するruntimeではなく、診断・測定・次工程判断の internal / local tool runtimeです。

```text
/emotion/submit public response
 -> backend diagnostic row: emlis_observation_diagnostic_lockdown
 -> RN frontend row: emlis_observation_frontend_result
 -> diagnostic compare / join semantics
 -> measurement connection
 -> ProductQualityScorecard event
 -> Release ladder
 -> next_action_routing
 -> local JSON/Markdown report
 -> Exit Gate summary
```

runtime上の固定:
- backendが `passed + comment_text` でも、frontend diagnosticがjoinされて `modal_opened=true` でない限り `display_confirmed` にはしない。
- RN diagnosticが欠ける場合は `frontend_diagnostic_missing_or_not_captured` として残し、表示確認済みに数えない。
- local toolはlog行からmeta-only reportを作るだけで、submit pathやpublic responseを変更しない。
- Exit Gateがreadyでも、public releaseやProduct Gate達成として扱わない。
