> 2026-10-18最新：u346。独立不明が同居する別経験1更新後の二反応保持を修復。不明の原文・旧保存は保持し、不明への第三Receptionは未実装。末尾と[u346監査](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u346_UnknownAlongsidePairRetention_20261018.md)を参照。

> 最新EmlisAI file追跡：末尾u342。既存production3fileの逆順関係修復と旧checkpoint互換。STRUCTURE_MAP_DELTA_NONE。

> 最新EmlisAI file追跡：末尾u341。既存production1fileの程度参照修復。STRUCTURE_MAP_DELTA_NONE。

> 最新EmlisAI file追跡：末尾u340。既存3production ownerの別時点contrast表示修復。STRUCTURE_MAP_DELTA_NONE。

> 最新EmlisAI file追跡：末尾u336。既存8production file内の実Observation共同保持。STRUCTURE_MAP_DELTA_NONE。

> 最新EmlisAI file追跡：末尾u335。source認識・旧modeの既存3owner、STRUCTURE_MAP_DELTA_NONE。

> 最新EmlisAI file追跡：末尾u334。既存9owner、私有保持contract2＋decision版。STRUCTURE_MAP_DELTA_PRESENT。

> 最新EmlisAI file追跡：末尾u333。既存3owner、test／fixture追加。STRUCTURE_MAP_DELTA_NONE。

> 最新EmlisAI file追跡：末尾u332。STRUCTURE_MAP_DELTA_PRESENT（承認済み内部内容契約）。

> 最新EmlisAI file追跡は末尾u331（2026-10-18）。具体的対比の参照と独立関係読解。STRUCTURE_MAP_DELTA_NONE。

> 最新EmlisAI file追跡は末尾u330（2026-10-18）。既存OP／thread_engine内のscalar不明と別欄行動の受け取り修復。STRUCTURE_MAP_DELTA_NONE。

---
title: "01A_Cocolon_全体構造資料_アプリ基盤とHome系"
revision_date: "2026-06-05"
---

# 01A. アプリ基盤とHome系

この章では App root / provider / Home screen / notice / today-question / reflection preview / frontend Home API boundary / backend Home API / home_gateway / startup / EmlisAI immediate reply をまとめて扱う。

> 最新EmlisAI file追跡は末尾u329（2026-10-18）。既存observation_plan内の行動誤分類・派生関係修復と追加検査・凍結fixtureを記録する。STRUCTURE_MAP_DELTA_NONE。

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

# 2026-05-20 差分追記: Input / EmlisAI Runtime Surface Quality Step0-12 runtime map

`Cocolon_13(2).zip` では RN runtime file の追加・変更はありません。`Emlisの観測` は引き続き `input_feedback.emlis_ai.observation_status === "passed"` かつ public `input_feedback.comment_text` 非空のときだけ開きます。

`mashos-api_13(5).zip` では、ProductGate Measurementで表示到達が測れる状態になった後、表示された観測文のruntime由来・表層署名・coverage別baseline・branch・QAをbackend側で測るRuntime Surface Quality Step0-12が追加されています。これは `InputFeedbackReplyModal` や `useInputFeedbackModal` の表示条件を変えるものではありません。

```text
/emotion/submit public response
 -> EmlisAI reply runtime
 -> RuntimeSurfaceSourceLockV1
 -> SurfaceQualitySignatureV1
 -> Scorecard Surface Metrics
 -> Coverage Runtime Baseline
 -> Branch Resolver
 -> Surface / Grammar / Tone / Self-Repair / Blind QA / Long-run
 -> Exit Gate summary
```

runtime上の固定:
- Completeを要求しただけでは `complete_initial` 由来と扱わず、AP0 / rollout / registry / source-lock alignmentを確認する。
- surface signatureやtone reportは本文を保存せず、key / count / warning / hashだけを扱う。
- RN診断metaやruntime surface metaだけではmodalを開かない。
- Step12 Exit Gateがreadyでも、public releaseやProduct Gate達成として扱わない。

# 2026-05-21 差分追記: Input / RN EmlisAI Observation Reply optional meta map

`Cocolon_16(1).zip` では、RN側に新規fileはありません。`inputFeedbackModel.js` と `inputFeedbackObservationDiagnostics.js` と `rn-screen-contracts.test.js` は、EmlisAI 観測返答 Step11 の optional meta を扱うように更新されています。

| current file | 追加された読み方 | 変更していない契約 |
|---|---|---|
| `Cocolon/screens/input/inputFeedbackModel.js` | `normalizeEmlisObservationReplyKind` / `getEmlisObservationReplyKind` が `eligible_observation` / `low_information_observation` を任意metaとして読む。 | 表示可否は `observation_status === passed` かつ `commentText` 非空のまま。 |
| `Cocolon/screens/input/inputFeedbackObservationDiagnostics.js` | diagnosticに `observation_reply_kind` を出せる。 | raw input / comment_text本文はdiagnosticへ入れない。 |
| `Cocolon/tests/rn-screen-contracts.test.js` | low-information metaだけでは表示されず、`passed + commentText` の場合だけ表示する契約を固定する。 | RN public status enumとmodal title `Emlisの観測` は変更しない。 |

低情報観測は、RN上では新しい表示種別ではありません。backendが `observation_reply_kind=low_information_observation` をoptional metaとして渡しても、RNは既存通り `passed + commentText` の表示契約だけで開閉を判断します。

# 2026-05-21 差分追記: Input / Emlis観測専用辞書 Phase0-5 runtime map

`Cocolon_6(32).zip` ではRN側のsource追加・変更はありません。`mashos-api_6(26).zip` では、Input保存直後の EmlisAI reply path に、Emlis観測専用辞書 Phase0-5 がbackend内部材料として接続されています。Home/Input側では、`openInputFeedbackModal` や `inputFeedbackModel.js` の表示条件を変更した差分ではなく、`render_emlis_ai_reply()` 内部の入力束読み・Gate material・Composer materialとして読む。

| owner | アプリ基盤 / Home系での読み方 |
|---|---|
| `emlis_ai_current_input_bundle.py` | `/emotion/submit` 由来の `current_input` を `thought_text` / `action_text` / `emotions` / `categories` へ内部正規化する。 |
| `config/emlis_observation_structure_dictionary.schema.json` / `v1.json` | 既存の表面素材辞書とは別に、入力束・relation・内部問い・allowed / forbidden inferenceを持つ。 |
| `emlis_ai_observation_structure_dictionary_loader.py` | 構造観測辞書のschema、参照整合、禁止推論、contract drift flagを検証する。 |
| `emlis_ai_observation_structure_material_service.py` / `emlis_ai_observation_structure_connection_service.py` | `selected_entry_ids` / `selected_relation_ids` / `structure_question_ids` などのtext-free materialをGate / Composerへ渡す。 |
| `emlis_ai_display_gate.py` / `emlis_ai_conversation_composer_service.py` / `emlis_ai_reply_service.py` | 構造辞書materialを内部metaとして扱う。public `comment_text` やRN表示条件を直接生成・変更しない。 |
| `tests/fixtures/emlis_ai_observation_structure_phase5_cases.py` | 7fixtureとBlind QA rubricを持つ。完成返答文の固定正解ではない。 |

Home/Input側の不変契約:

- `/emotion/submit` のpublic route、request key、response keyは変更しない。
- DB physical name、DB write path、RN visible contract、`Emlisの観測` の表示条件は変更しない。
- `input_feedback.comment_text` は引き続きpublic表示本文の互換keyとして保持する。
- `emlis_observation_dictionary.v1.json` は表面素材 / guard signature 系辞書として残し、構造観測辞書は別ファイルで持つ。
- 構造観測辞書は完成返答文テンプレ集ではなく、入力束から relation / internal question / allowed・forbidden inference / gate material を作る内部辞書として読む。
- 構造material / connection metaには raw `memo` / `memo_action` / 完成返答本文を流さない。


# 2026-05-22 差分追記: Input / Emlis観測専用辞書 ActionConversion / UnformedSelfInsight runtime map

`Cocolon_8(12).zip` ではRN側のsource追加・変更はありません。`mashos-api_8(23).zip` では、Input保存直後の EmlisAI reply path に、ActionConversion / UnformedSelfInsight / 飲み込んだ言葉の観測拡張がbackend内部材料として接続されています。Home/Input側では、`openInputFeedbackModal` や `inputFeedbackModel.js` の表示条件を変更した差分ではなく、`render_emlis_ai_reply()` 内部の構造辞書material更新として読む。

| owner | アプリ基盤 / Home系での読み方 |
|---|---|
| `config/emlis_observation_structure_dictionary.v1.json` | 5 relation / 4 entryを追加する。 |
| `emlis_ai_observation_structure_material_service.py` | 入力語から `word_could_not_say` / `word_aligned_to_context` / `word_gaman` / `word_wakaranai` を選び、text-free materialにする。 |
| `emlis_ai_observation_structure_connection_service.py` | 単語だけで `thought_action_discrepancy` や `conversion_history_closure` を強接続しない。差分・閉じ方・圧力・負荷は入力束の根拠がある場合だけ接続する。 |
| `test_emlis_ai_observation_structure_phase6_forbidden_inference_meta_contract.py` | material / connection metaへ raw input、public `comment_text`、完成返答文、辞書本文を流さないことを固定する。 |

Home/Input側の不変契約: `/emotion/submit` のpublic route、request key、response key、RN modal条件、`Emlisの観測` のvisible titleは変更しない。今回の辞書材料は、Step10 rollout block / release gate block / pre-connection stop を表示可能文へ変えるものではない。


# 2026-05-24 差分追記: EmlisAI public feedback meta boundary / timeout recovery / low-information prompt / notification uuid boundary

Home / Input系での最新読み方は、RN表示条件を変えずに `/emotion/submit` の完了確認timeoutとEmlisAI public meta肥大化を分けて扱うことです。

| owner | Home/Input系での読み方 |
|---|---|
| `Cocolon/lib/api/home/emotionSubmitApi.js` | `/emotion/submit` 専用に `EMOTION_SUBMIT_TIMEOUT_MS = 30000` を渡す。これはpublic meta削減後の保険であり、巨大responseを許容するための本体修正ではない。 |
| `Cocolon/screens/InputScreen.js` | `TimeoutError` / `timed out` は通常の保存失敗Alertと分ける。timeout時は `loadHomeState({ force: true, includeStartupCandidate: false })` を一度試し、入力欄・draftをclearしない。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py` | RNへ返す `input_feedback.emlis_ai` をpublic-safe subsetへ縮小する。RNは内部diagnosticsを表示条件に使わない。 |
| `mashos-api/ai/services/ai_inference/api_emotion_submit.py` | `comment_text` 非空 + public `observation_status=passed` の時だけ `input_feedback` を組み立てる。 |

Home/Input側の不変契約: `Emlisの観測` のvisible title、`input_feedback.comment_text` key、`input_feedback.emlis_ai.observation_status`、表示条件 `passed + commentText` は変更しない。timeout時も自動再送しない。


# 2026-05-24 差分追記: Home / Input / EmlisAI Visible Surface Acceptance QA接続

`InputScreen.js -> /emotion/submit -> emotion_submit_service.py` の後、EmlisAI immediate replyは引き続き `Emlisの観測` として扱う。最新実ファイルでは、public meta boundary / timeout recoveryの後段に、表示文品質を受け入れ判定する Visible Surface Acceptance QA が接続されています。RN画面本体、API route、DB write path、表示名は変更しません。

```text
InputScreen.js
 -> submitEmotionInput()
 -> /emotion/submit
 -> emlis_ai_reply_service.render_emlis_ai_reply()
 -> runtime_surface_pre_return_gate
 -> visible_surface_acceptance_gate
 -> display_gate / repair integration
 -> build_public_emlis_input_feedback_meta()
 -> inputFeedbackModel.js
 -> InputFeedbackReplyModal.js
```

| owner | Home / Input上の読み方 |
|---|---|
| `emlis_ai_visible_surface_acceptance_gate.py` | RNヘッダーの中心感情と本文冒頭焦点のズレ、positive-only over-burden、visible malformed surfaceを表示前に評価するbackend gate。 |
| `emlis_ai_runtime_surface_pre_return_gate.py` | `たりこと` 系を含む表面文法破綻を、Visible Gate前のsurface fatalとして止める。 |
| `emlis_ai_reply_service.py` | candidate本文生成後にvisible gate reportを作る。本文やraw inputをreportへ保存しない。 |
| `emlis_ai_display_gate.py` | visible gateの `red / repair_required / block / fail_closed` を表示前fail-closed条件として読む。 |
| `emlis_ai_observation_display_repair_integration.py` | low-information repair候補にもvisible gateを通し、gateを通った場合だけappliedにする。 |
| `emlis_ai_low_information_observation_composer.py` | `positive_only / negative_only / mixed / self_insight / neutral_or_unknown` のtone profileで低情報surfaceを分ける。 |
| `emlis_ai_public_feedback_meta.py` | visible gate reportはpublic-safe summaryだけ残す。blocking時は `input_feedback` を返さない。 |
| `Cocolon/tests/rn-screen-contracts.test.js` | RNはvisible gate metaを直接表示判定に使わず、public `observation_status=passed` + `comment_text` non-emptyだけで表示する。 |

Home / Input側の不変契約:

- `InputFeedbackReplyModal.js` のvisible titleは `Emlisの観測` のまま。
- `inputFeedbackModel.js` の表示条件は `passed + commentText` のまま。
- `visible_surface_acceptance_gate` meta、hidden raw input、candidate body、evidence textをRN表示材料にしない。
- `/emotion/submit` timeout recoveryは保持する。visible gate failureを入力保存失敗として表示しない。


# 2026-05-25 差分追記: EmlisAI Product Visible Surface Reliability / Koto Splice Repair 接続

Home / Input系から見た最新構造では、`Emlisの観測` の表示条件は変わらず、backend側の表示前品質境界が強化されています。`Cocolon_8(14).zip` 側はRN本体変更ではなく、`tests/rn-screen-contracts.test.js` にStep7 diagnostic metaが表示条件を開かない回帰が追加されています。`mashos-api_8(27).zip` 側は、C相当のkoto splice RED固定、B相当のrelation skeleton修復、Shallow V2安全化、bounded repair reroute、public-safe diagnostic summaryを持ちます。

Home / Input / immediate reply上の読み方:

| flow | owner | 現行境界 |
|---|---|---|
| 表示候補生成 | `emlis_ai_reply_service.py`, `emlis_ai_limited_composer_client.py` | candidate本文生成後にRuntime Gate / Visible Gateへ進む。 |
| koto splice guard | `emlis_ai_phrase_unit_grammar_normalizer.py`, `emlis_ai_limited_sentence_quality_guard.py` | `取らなければこと` / `予感こと` / `ことこと` 等をcandidate material段階で止める。 |
| runtime surface gate | `emlis_ai_runtime_surface_pre_return_gate.py` | comment_text表面のkoto spliceを `koto_splice_detected` / `koto_splice_codes` としてmeta-onlyで持ち、危険時はrerenderまたはblock。 |
| visible acceptance gate | `emlis_ai_visible_surface_acceptance_gate.py` | C相当はred、B相当はrepair_required、A相当はpassに分ける。 |
| shallow relation safety | `emlis_ai_relation_surface_contract.py` | `PhraseSurfaceShapeSignal` と `compress_phrase_for_relation_surface(...)` により、義務・予感・長いraw clauseをrelation lineへ雑に渡さない。 |
| public meta / display absence | `emlis_ai_public_feedback_meta.py`, `emotion_submit_service.py` | `display_absence_summary` はcode / booleanだけで、raw inputやcandidate本文を出さない。 |
| RN display | `inputFeedbackModel.js`, `InputFeedbackReplyModal.js`, `rn-screen-contracts.test.js` | 表示タイトル `Emlisの観測` と `passed + commentText` を維持し、diagnostic metaだけでは表示しない。 |

禁止: koto splice検出を理由にRN表示条件を変える、表示率のためにGateを緩める、public metaへ本文を入れる、fixed fallback良文で上書きする、`/emotion/submit` のroute / key / DB write pathを変える。


# 2026-05-26 差分追記: Home / Input / EmlisAI ESO surface contract completion接続

`Cocolon_7(14).zip` 側のRN表示条件は変わらない。`mashos-api_7(30).zip` 側では、Home / Inputから `/emotion/submit` 後に返る `Emlisの観測` のcandidateが、環境状態出力観測構造を本文に使う場合だけ、backend内部で次の順に確認される。

```text
conversation composer candidate
→ normalize前 scope marker completion
→ environment_state_output surface rejection check
→ Runtime Surface Pre-Return Gate double check
→ Display Gate / public meta sanitizer
→ RN passed + commentText display
```

| owner | Home / Input上の読み方 |
|---|---|
| `emlis_ai_environment_state_output_surface_contract_completion.py` | `今回の入力では` 等の単発観測scope markerを、first body lineへ一度だけ付与するshared helper。完成文テンプレではない。 |
| `emlis_ai_conversation_composer_service.py` | candidate normalize前にhelperを通し、`environment_state_output_scope_marker_missing` をcandidate本文の整形不足として扱う。forbidden surface claimがあれば補完せずschema_invalidにする。 |
| `emlis_ai_runtime_surface_pre_return_gate.py` | normalize前で補完済みでも、返却直前に実comment_text上のmarkerを再確認する。signatureだけでは通さない。 |
| `emlis_ai_public_feedback_meta.py`, `emotion_submit_service.py` | completion result / surface contract / raw input / candidate bodyをpublic metaへ出さず、public `observation_status=passed` + comment_text非空の場合だけfeedbackを返す。 |

不変契約: `InputFeedbackReplyModal.js` のvisible title、`input_feedback.comment_text`、`input_feedback.emlis_ai.observation_status`、`/emotion/submit` route、RN表示条件 `passed + commentText` は変更しない。


# 2026-05-26 差分追記: Home / Input / EmlisAI状態回答と人間的フォロー Phase2-10 接続

Home / Input側から見た最新構造では、`Emlisの観測` の表示条件は変わらず、backend側で状態回答surface contractと人間的フォローの内部materialが接続されています。RN側 `Cocolon_10(9).zip` には今回差分なしです。

| flow | owner | 現行境界 |
|---|---|---|
| 入力整理 | `emlis_ai_current_input_bundle.py`, `cocolon_environment_state_output_frame.py` | memo / memo_action / emotions / category / created_atを、raw本文をpublicへ出さずに内部frameへ整理する。 |
| 状態回答contract | `emlis_ai_state_answer_surface_contract.py` | 観測層と人間的フォロー層をinternal materialに分ける。 |
| フォロー選択 | `emlis_ai_human_follow_selector.py` | 感情ラベル単体ではなく、frameのoutput themeやrelation roleを併用してfollow keyを選ぶ。 |
| 比率 / special handling / metaphor | `emlis_ai_state_answer_ratio_policy.py`, `emlis_ai_state_answer_special_cases.py`, `emlis_ai_safe_daily_metaphor_material.py` | 観測6:フォロー4、自己否定/怒り境界、安全日常比喩を内部materialとして扱う。 |
| Composer接続 | `emlis_ai_state_answer_composer_contract.py`, `emlis_ai_limited_composer_client.py`, `emlis_ai_conversation_composer_service.py` | 完成文テンプレではなく、Observation section / Human follow sectionのrole planとして渡す。 |
| 表示前Gate | `emlis_ai_state_answer_gate_boundary.py`, `emlis_ai_runtime_surface_pre_return_gate.py`, `emlis_ai_visible_surface_acceptance_gate.py`, `emlis_ai_display_gate.py` | 診断・行動指示・人格断定・原因断定・怒り同意・自己否定例外の暴走を表示前に止める。 |
| public meta | `emlis_ai_public_feedback_meta.py` | `input_feedback.emlis_ai` へ小さいsummaryだけを出し、contract body / raw evidence / comment_text bodyは返さない。 |

Home/Input側の不変契約:

- `InputFeedbackReplyModal.js` のvisible titleは `Emlisの観測` のまま。
- `inputFeedbackModel.js` の表示条件は `passed + commentText` のまま。
- `/emotion/submit` のroute、request key、response keyは変更しない。
- `input_feedback.comment_text` のpublic契約は変更しない。
- 状態回答contract / human_follow_layer / ratio_policy / special_handling / metaphor_policy はRN表示条件やpublic response keyではない。


# 2026-05-30 差分追記: Home / EmlisAI immediate reply Phase18 current owner

Phase18後のHome immediate replyでは、EmlisAIの表示可否は引き続きbackendで決まり、RNは既存 `commentText` を受け取るだけである。Home側production UI、`/emotion/submit` route、public response top-level keyは変更しない。

主なowner:

```text
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_composer_client.py
mashos-api/ai/services/ai_inference/emlis_ai_observation_display_repair_integration.py
mashos-api/ai/services/ai_inference/emlis_ai_two_stage_applicability.py
mashos-api/ai/services/ai_inference/emlis_ai_visible_readability_quality.py
mashos-api/ai/tests/test_emotion_submit_phase18_product_quality_e2e.py
Cocolon/tests/rn-screen-contracts.test.js
```

読み方:

- low-informationは短い入力だけrepair可能。保存・表示・診断の境界を混ぜない。
- Complete Initialはcandidate generationとpublic display decisionを分ける。
- daily_unpleasantはmode contextをSurfaceRealizerへ伝搬する。
- public metaへraw input、comment_text body、surface_policy本体を出さない。
- RNは `observation_text` / `reception_text` を要求しない。
# 2026-06-01 差分追記: Home / EmlisAI immediate reply Phase20 current owner

Phase20後のHome immediate replyでは、EmlisAIの表示可否は引き続きbackendで決まり、RNは既存 `commentText` を受け取るだけである。Home側production UI、`/emotion/submit` route、public response top-level keyは変更しない。

最新の読み方:

| 境界 | Phase20後の扱い |
|---|---|
| backend reply generation | `response_kind`、material bundle、Gate recovery、low-information composerにより、safety / infra以外の通常入力は観測応答へ向かう。 |
| public feedback | `build_public_emlis_input_feedback_meta(...)` のsanitized metaだけを返す。internal response contract / safety triage / repair attempts / mode id / diagnostic bodyは表示sourceにしない。 |
| RN modal | `input_feedback.emlis_ai.observation_status == passed` かつ `input_feedback.comment_text` 非空の場合だけ `Emlisの観測` を開く。 |
| A低情報実機再確認 | `emlis_ai_observation_display_repair_integration.py` で、低情報material成立時のscope-only blockerがEmlis観測表示を妨げないよう補正済み。 |

禁止: RN側で `response_kind` / `material_quality` / `safety_triage_kind` / `diagnostic_summary` / `observation_text` / `reception_text` を表示条件または本文sourceにすること。

Phase20-12〜20-15後の追加読み方:

| 境界 | 追加された扱い |
|---|---|
| fail-closed説明 | `emlis_ai_reply_service.py` の旧説明は、displayable response kindではbounded repair / recoveryを通す説明へ更新済み。 |
| post-final recovery | final pre-return gate後にnormal / low_information / limited_groundingが落ちても、safety / infraでない限り空白終了へ戻さず、一回だけpost-final recoveryを試す。 |
| Gate Recovery surface QA | `phase20_15_gate_recovery_surface_binding` はbackend内部metaであり、RN表示sourceではない。fixed fallback化をfamily / material bindingで検出する。 |

Home/Input側の不変契約は引き続き同じで、RN production UI、`/emotion/submit` route、public response key、`passed + commentText` 表示条件は変更しない。



# 2026-06-04 差分追記: Home / EmlisAI immediate reply Product Quality Measurement Phase0-8 current owner

Phase0〜8後のHome immediate replyでは、EmlisAIのruntime表示契約は引き続きbackend public boundaryで決まり、RNは既存 `commentText` を受け取るだけである。今回追加された `ProductQualityEventV1` / `Measurement Runner` / `Blocker Matrix` / `Release Decision` / `Validation Plan` は、Home production UIや `/emotion/submit` response shapeではなく、商品品質を測る内部QA基盤として読む。

主なowner:

```text
mashos-api/ai/services/ai_inference/emlis_ai_product_quality_contract_freeze.py
mashos-api/ai/services/ai_inference/emlis_ai_product_quality_measurement_event.py
mashos-api/ai/services/ai_inference/emlis_ai_product_quality_measurement_runner.py
mashos-api/ai/services/ai_inference/emlis_ai_product_quality_blocker_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_product_quality_blind_qa_integration.py
mashos-api/ai/services/ai_inference/emlis_ai_product_release_decision.py
mashos-api/ai/services/ai_inference/emlis_ai_product_quality_validation_plan.py
Cocolon/tests/rn-screen-contracts.test.js
```

読み方:

- `public_display_reached` はRN表示条件の代替ではなく、既存public feedback include条件と同じ表示到達判定である。
- `release_allowed` が内部material上でgreenになっても、RN表示条件、API route、DB write path、rollout flagは自動変更しない。
- Blind QA review queueはlocal review準備であり、RN表示payloadではない。

禁止: RN側で `product_release_decision` / `validation_plan` / `blocker_matrix` / `blind_qa_integration` を表示sourceや表示条件にしない。`comment_text` 以外の本文keyを要求しない。

# 2026-06-05 差分追記: Home / EmlisAI immediate reply Gate Recovery public boundary current owner

P0〜P12後のHome immediate replyでは、EmlisAIの表示可否は引き続きbackendで決まり、RNは既存 `commentText` を受け取るだけである。今回の修正は、Gate Recovery material surfaceを `passed + comment_text` としてpublicへ昇格させないためのbackend内部境界であり、Home production UI、`/emotion/submit` route、public response top-level keyは変更しない。

| 層 | latest owner | Home / Input上の意味 |
|---|---|---|
| Recovery boundary | `emlis_ai_gate_recovery_public_boundary.py` | diagnostic recovery surfaceをpublic候補として許可しない。 |
| Recovery loop | `emlis_ai_gate_recovery_loop.py` | boundary / builderを通したpublic candidateだけをGateへ流す。material surfaceはdiagnostic metaに留める。 |
| Reply service guard | `emlis_ai_reply_service.py` | pre / post-final差し替え直前にも保険境界を置く。 |
| Public candidate builder | `emlis_ai_gate_recovery_public_candidate_builder.py` | low-information composer / bounded repaired original candidate等へ回す。 |
| ProductQuality source lineage | `emlis_ai_product_quality_measurement_event.py`, `emlis_ai_product_quality_measurement_runner.py` | `surface_origin` で表示sourceを記録し、Gate Recovery material surface由来を成功扱いしない。 |
| RN contract | `Cocolon/tests/rn-screen-contracts.test.js` | RN production UIはsource lineageで分岐せず、`passed + commentText` の既存契約だけを守る。 |

Home/Input側では、`inputFeedbackModel.js` や `InputFeedbackReplyModal.js` の表示条件を変更した差分ではない。本文品質と表示sourceの修正責任はbackend側のGate Recovery public boundary / candidate builder / ProductQuality lineageにある。


# 2026-06-06 差分追記: Home / Input EmlisAI Public Observation Recovery P0-P10 current owner

P0〜P10後のHome / Input immediate replyでは、EmlisAIの表示可否は引き続きbackendで決まり、RNは既存 `commentText` を受け取るだけである。今回の修正は、safe通常入力のpublic feedback不達と、two-stage required入力のplain surface誤成功を分けて回復するbackend内部境界であり、Home production UI、`/emotion/submit` route、public response top-level keyは変更しない。

| 層 | latest owner | Home / Input上の意味 |
|---|---|---|
| Surface requirement | `emlis_ai_public_surface_requirement.py` | 入力がlabelled two-stage / plain / low-information / safety / infraのどれを要求するかを本文なしで決める。 |
| Product surface validation | `emlis_ai_product_surface_validation.py` | `rn_visible` と `product_surface_valid` を分ける。 |
| Complete initial recomposition | `emlis_ai_complete_initial_surface_recomposition.py` | C系source unavailableをnormal rebuildではない別laneで表示候補へ戻す。 |
| Labelled two-stage recomposition | `emlis_ai_labelled_two_stage_surface_recomposition.py` | D/Phase17/ProductVisible系を二段本文へ戻す。 |
| Public inclusion summary | `emotion_submit_service.py` | `public_reached` / `rn_visible` / `product_surface_valid` をinternal diagnosticとして持つ。 |
| RN contract | `Cocolon/tests/rn-screen-contracts.test.js` | RNはsource lineageで分岐せず、`passed + commentText` の既存契約だけを守る。 |

Home/Input側では、`inputFeedbackModel.js` や `InputFeedbackReplyModal.js` の表示条件を変更した差分ではない。本文品質と表示sourceの修正責任はbackend側のpublic observation recoveryにある。


# 2026-06-08 差分追記: Home / Input EmlisAI public input_feedback arrival current owner

P0-P1 Step 0〜10後のHome / Input immediate replyでは、EmlisAIの表示可否は引き続きbackendで決まり、RNは既存 `commentText` を受け取るだけである。今回の修正は、Display Gate側でwarning-onlyとして扱われた `visible_surface_acceptance_gate = yellow / warn` を、public inclusion側でterminal blockerにしないbackend内部境界であり、Home production UI、`/emotion/submit` route、public response top-level keyは変更しない。

| 層 | latest owner | Home / Input上の意味 |
|---|---|---|
| Public feedback meta | `emlis_ai_public_feedback_meta.py` | yellow/warn warning-onlyをpublic inclusion blockerにしない。true unavailable/safetyはfail-closed。 |
| Submit inclusion summary | `emotion_submit_service.py` | public_reached / rn_visibleをyellow/warnで欠落扱いしない。 |
| Product surface validation | `emlis_ai_product_surface_validation.py` | rn_visibleとproduct_surface_validを分け、runtime/display/state/two_stageはstrict維持。 |
| Display contract | `tests/test_emlis_ai_display_contract.py` | Red A/B1/B2を現行contractへ更新し、safe recoveryとbody leak禁止を両立する。 |
| RN contract | `Cocolon/tests/rn-screen-contracts.test.js` | RNはsource lineageで分岐せず、`passed + commentText` の既存契約だけを守る。 |

## 2026-09-11 Q2差分 — 元入力に所属するEmlis一往復

保存済み `emotions.id` → Q2 thread service → ANSWER/MEANING_UPDATE/OBSERVATIONの別commit → 専用認証API → Input/HistoryのEmlisThreadModal。元入力保存と国家fanoutの後に分岐し、補足回答で国家入力件数・通知・Astor queue・Piece/Analysis materialを増やさない。元入力/account削除はFK cascade、閲覧は既存retentionに従う。旧I5と共用Piece返信modalはdevelopment OFF時の境界を保持。

新設/変更全fileと直接変更しない影響ownerの役割表は [current_structure/01_emlis_ai_current_structure.md](current_structure/01_emlis_ai_current_structure.md) の2026-09-11 Q2節へ集約する。稼働DB適用・端末確認・本番接続は未成立。旧snapshot件数や旧全file inventoryを今回の全体再生成・新headのfresh証明として扱わない。

## 2026-09-11 Q3 — 有料履歴・逐次質問・解釈フレーム

Emlisは「今回の入力を読んだ観測→重要な一点の任意質問→本人回答で観測を深める」体験を担当する。回答・続行・フレーム操作は元入力に所属し、国家の入力件数・課金event・通知・Astor queueを増やさない。原入力の保存と既存fanoutは`emotion_submit_service`、履歴の閲覧期限は既存`publish_governance`が所有する。Piece／Analysisの入力許可、TodayQuestionの回答schema、旧I5 public wireを拡張しない。共有CMEE→既存Human Reception作者→Sentence Surface→独立逆検証の順を継承し、外部生成AIや別本文rendererは追加しない。

Q3の全変更ownerと本文確認した影響先は[current structure / EmlisAIの末尾Q3節](current_structure/01_emlis_ai_current_structure.md)を参照。通常入力・履歴の専用modalから本人続行とフレーム編集を行い、sourceの所有者・現在権限をserverで確認する。共通基盤の認証、親入力削除、課金権限、履歴保持、旧I5経路との接点を保持する。

Q1・Q2・Q3のコード実装を完了として記録し、次はQ4の実装統合、対象集合の初回/質問/回答後本文の確認と修正、旧client/保存版互換、公開用mode・単一生成ownerの接続準備、保存済み訂正を消さない停止・復旧のコードと検証へ進む。古いcandidate91単独修正ループやProduct Read PASS待ちへ戻さない。

実DB適用、端末・実課金の環境確認、Mashの正式商品判断、merge/deploy/公開切替は、API `ai/docs/EMLIS_DEPLOYMENT_AND_OPERATION_CHECKS.md`へ分離した未実施作業。これらが未実施という理由だけでQ3/Q4のコード作業を停止しない。機械成功・華恋の本文確認・Mashの商品合格・公開を相互に代用しない。


## 2026-09-11 Q4差分 — 元入力の所有者と単一観測経路

/app/bootstrap → AppRuntimeContext → Input/Historyのthread readerを接続。serverのlegacy/development/active/read_onlyで生成経路を一つ選び、旧clientへは保存済みcurrent本文だけを旧comment_textへ返す。停止中も本人の回答・意味訂正・履歴を保持する。RootNavigatorはuser IDでprivate tabを再作成し、InputScreenの送信/preview/publish/cancelは開始ownerと認証tokenのsessionを照合する。late responseは旧画面へ反映しない。

元emotions保存 → 国家fanout → Emlis観測の順と、件数・花・通知・Astor・Piece/Analysis/TodayQuestionの責務は保持する。回答・続行・frameは新規感情入力ではない。変更fileと本文確認した影響先の正確な役割表は[current_structure/01 のQ4節](current_structure/01_emlis_ai_current_structure.md)。Q4のAPI/RN実装とローカル検証を、稼働DB・端末・課金・商品合格・公開へ換算しない。

## 2026-10-14 u253 — Emlis承認済み限定変更の地図差分

Mashが「記録した限定変更で実装を進めてよろしいですか」に「進めていいよ」と明示承認したため、`EMLIS_APPRAISAL_COMPONENT_MEANING_20261014` は APPROVED_FOR_BOUNDED_IMPLEMENTATION。u252／weekly §5.6.2のNOT_APPROVEDは承認前の履歴であり、同じ実装を再承認待ちへ戻さない。承認は商品合格、配置、公開境界変更の承認ではない。

既存の ObservationPlan → thread projection → input-specific meaning → Stage1内容投影 → 唯一のHuman Reception作者 → Sentence Surface／独立inverse → 保存済み本文read の配置を維持し、明示評価と独立行動を保持する内部contractを限定更新した。STRUCTURE_MAP_DELTA_PRESENT。新production file／service／公開routeは0。

| 既存owner（API `ai/services/ai_inference/`以下） | 今回の限定責務差分 |
|---|---|
| `emlis_ai_grounded_observation_plan.py` | 原入力の明示評価と対象のsource-owned関係、既存主体／行為statusによる非実行等の除外、独立行動の保持。 |
| `cocolon_meaning_experience_engine/emlis_thread_projection.py` | 許可された対象付き評価＋本人実行行動だけcomponent契約へ入り、canonical Planとの照合を行う。 |
| `cocolon_meaning_experience_engine/emlis_input_specific_meaning.py` | 同一対象の競合を保ち、独立組を全requiredの一つのwhole readingへ集約する。 |
| `cocolon_meaning_experience_engine/contracts.py` | 私有versioned appraisal、全bundle所有、bundle-local difference witnessと独立検証。 |
| `cocolon_meaning_experience_engine/emlis_stage1_composition.py` | 選択済み対象と評価をtyped Reception内容へ投影し、現行manifestを更新する。 |
| `cocolon_meaning_experience_engine/emlis_stage1_response.py` | 同じ選択済みconfigurationと候補からReception内容を再導出して照合する。 |
| `emlis_ai_grounded_human_reception.py` | typed評価の対象・肯否・時点・程度を唯一の作者で文章化する。経験の受け取り内容は未完成。 |
| `emlis_ai_grounded_sentence_surface.py` | 元評価関係を回答時点の評価へ変換せずObservationへ残す。 |
| `emlis_ai_grounded_observation_gate.py` | 対象・主体・肯否・時点・程度を本文から読み、sourceと選択済み内容へ独立照合する。 |

検査配置：新規`ai/tests/test_cmee_emlis_result_appraisal.py`、既存`ai/tests/test_cmee_v1a_i1sx_contracts.py`、現行snapshot`ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json`。歴史的IM03 proofは変更しない。保存／DTO／RN表示のownerは既存`emlis_thread_service.py`・`emlis_thread_store.py`・`screens/input/useEmlisThread.js`・`screens/input/EmlisThreadModal.js`のままでsource変更なし。

状態は BOUNDED_IMPLEMENTATION_WIP / PRODUCT_NOT_CLEAR、初回単位未完了。対象・本人評価・肯否・時点・継続・程度を意味から本文へ保持できたが、現在のReceptionは評価命題の再表現に留まり、§9.2の「別の単純化されたobjectと区別して何として受け取ったか」を閉じていない。分類名と「受け取りました」を加えたことを商品品質の完成へ換算しない。

設計の規範は8/28文書末尾と詳細02、詳細地図はcurrent_structure/01・04、検証と残件は06／API handoff u253。原入力保存・国家fanout・件数・花・通知・Astor・Piece／Analysis／TodayQuestionの責務は不変。


### u254 — 評価撤回と旧意味再開の責務差分（2026-10-14 JST）

u253の限定承認を継続。STRUCTURE_MAP_DELTA_PRESENT。新production file/実行service/作者は追加しない。

| 既存file | 今回の責務差分 |
|---|---|
| `cocolon_meaning_experience_engine/emlis_answer_update.py` | 唯一の原文全文に属するappraisal両端の撤回。旧checkpoint又は真正な旧質問に合致する既知旧Planの厳密再導出。 |
| `emlis_ai_grounded_observation_plan.py`・`cocolon_meaning_experience_engine/emlis_question.py` | private keywordでpre-appraisal投影を再導出。通常生成は現行投影。 |
| `cocolon_meaning_experience_engine/emlis_thread_engine.py` | Q2のappraisal/旧Planも既存thread realizerへPrepared Planを渡す。NO_MATERIAL_UPDATEも同じ意味を保持。 |
| `emlis_ai_grounded_sentence_surface.py`・`emlis_ai_grounded_observation_gate.py` | 評価撤回後の対象を過去factとして表示し、独立inverseも現在感覚化・評価復活を拒否。 |
| `emlis_thread_service.py` | 本文生成と同じcheckpoint_refでeffective_plan_refを再導出し保存。 |

検査は既存`ai/tests/test_cmee_emlis_result_appraisal.py`と現行identity snapshot、新規`ai/tests/fixtures/cmee_emlis_pre_appraisal_checkpoint_v1.json`（未変更c458で実生成した合成checkpoint/question）に配置。保存store/SQL/公開DTO/API/RN/依存の契約は不変。Q2/Q3の旧pending再試行、旧完成本文の再read、旧Q2真正質問への新規回答、撤回後の保存/RN表示を確認。全過去版・Premium全履歴互換の保証ではない。

最終限定検査84PASS、共有4fileは196PASS/3FAILで旧3失敗をbaseline再現。詳細は06/API handoff u254。**PRODUCT_NOT_CLEAR**：経験の受け取り本文、評価の肯否訂正、対象だけ撤回した評価の残存は未完了。source保持と再開の修正を最初の一体単位の完成へ換算しない。


### u255 — 評価訂正と単独対象撤回の意味・本文責務（2026-10-14 JST）

`EMLIS_APPRAISAL_COMPONENT_MEANING_20261014`の限定承認を継続。STRUCTURE_MAP_DELTA_PRESENT。既存の意味更新→共有作者→独立本文検証→保存readの配置は同じ。

| 既存owner（API `ai/services/ai_inference/`以下） | 今回の差分 |
|---|---|
| `cocolon_meaning_experience_engine/emlis_answer_update.py` | 評価の置換sourceから肯否・時点・程度・継続を再導出。保存u254のPARTIAL checkpointは旧訂正parserの完全再導出と一致で再開する。 |
| `emlis_ai_grounded_observation_plan.py` | 訂正評価のABOUT所有と、対象撤回後に独立して残る評価を区別する。原文有限述語と意味codesを照合する。 |
| `emlis_ai_grounded_human_reception.py` | 選択済みLIMITED material受容内で訂正評価の対象と時点を文章化。対象撤回後に新しい対象を補わない。 |
| `emlis_ai_grounded_sentence_surface.py`・`emlis_ai_grounded_observation_gate.py` | 評価・時点を本文に残し、sourceから独立に再照合する。肯否復活・対象乗換え・回答時点への付替えを拒否する。 |

検査配置は既存`ai/tests/test_cmee_emlis_result_appraisal.py`と現行shared owner identity、新規`ai/tests/fixtures/cmee_emlis_pre_appraisal_correction_checkpoint_v1.json`（未変更8d635579の旧PARTIAL実生成2件）。production新file/service/外部AI、公開API/DTO/DB/SQL/RN、依存の変更はない。旧pre-appraisal互換・単一作者・Route A・他中核と国家の責務を保つ。

評価関連107PASS、Q2/Q3 application54PASS、現行identity1PASS。Q1の3失敗とQ3既存撤回関連14失敗は開始headでも再現し、全回帰合格とはしない。保存3本文のRN表示・履歴展開・再openも確認したがnative実機ではない。詳細は正本06／API handoff u255。

**BOUNDED_IMPLEMENTATION_WIP / PRODUCT_NOT_CLEAR。** 単独評価の肯否訂正と対象撤回は今回改善。経験の受け取り内容形成、複数評価の初回停止と撤回group、明示「今は」を含む訂正時点、same100・本人実機・正式Product Readは残る。今回の本文保持と互換を最初の一体単位の完成へ換算しない。


### u256 — 複数評価の本文・残存評価の合成（2026-10-14 JST）

同じ`EMLIS_APPRAISAL_COMPONENT_MEANING_20261014`内、STRUCTURE_MAP_DELTA_PRESENT。既存API ownerだけを更新：`emlis_ai_grounded_observation_plan.py`は独立した評価pairと残余dutyを3 Move内で保持、`emlis_ai_grounded_sentence_surface.py`は各対象/時点を持つ並列文、`emlis_ai_grounded_human_reception.py`はLIMITEDの有限評価・同値2評価の共有文、`emlis_ai_grounded_observation_gate.py`は全文と両sourceの独立検証、`cocolon_meaning_experience_engine/emlis_answer_update.py`は同回答内の対象撤回と評価訂正を合成する。旧辞書・作者配置、公開API/DB/SQL/RN、意味contract、依存は不変。新production fileなし。検査は既存`ai/tests/test_cmee_emlis_result_appraisal.py`（131 PASS）と現行shared identity snapshot。保存4ケースは実service＋隔離SQL、RN hook/modalの再openまで確認（native実機ではない）。Q2/Q3 application54 PASS。

**BOUNDED_IMPLEMENTATION_WIP / PRODUCT_NOT_CLEAR。** 1 received＋2評価の初回停止、片方/両対象撤回、同回答内訂正/撤回を修正。経験の内容形成、明示「今は」の訂正時点と保存互換、2 received＋2評価の初回停止、same100・実機・正式Product Readは残る。正本06／API handoff u256に実測・範囲・次の作業を記録した。0/3・candidate_ready=false・automatic_progression=falseを維持。

### u257 — 評価訂正の回答時点・旧意味再開（2026-10-14 JST）

同じ限定承認内、STRUCTURE_MAP_DELTA_PRESENT。既存API5ownerの責務を更新：`cocolon_meaning_experience_engine/emlis_answer_update.py`は新しい引用評価の「今は」を今回回答sourceへ結び、時点指定のない再訂正は先の回答anchorを保持する。対象撤回後の評価時点も保持し、保存済みu256 PARTIALは既知の旧解析で全checkpointを厳密再導出する。`emlis_ai_grounded_observation_plan.py`はsource/時点codeの整合と表示用時点、`emlis_ai_grounded_sentence_surface.py`と`emlis_ai_grounded_human_reception.py`は対象付き/撤回後/複数評価の時点表現、`emlis_ai_grounded_observation_gate.py`は作者から独立した時点照合を担う。新production file/service、公開API/DTO/DB/SQL/RN、意味schema、依存は不変。

検査は既存`ai/tests/test_cmee_emlis_result_appraisal.py`（152 PASS）、現行shared owner identity snapshot（実検査1 PASS）、未変更458a1fccから実生成した新規`ai/tests/fixtures/cmee_emlis_pre_appraisal_answer_time_checkpoint_v1.json`（旧PARTIAL2件）。Q2/Q3 application54 PASS、実service＋隔離SQL保存4本文のRN hook/modal表示・履歴・再open一致。native実機ではない。既存共有17失敗は未修正・未再実行。

**BOUNDED_IMPLEMENTATION_WIP / PRODUCT_NOT_CLEAR。** 元入力と回答の評価時点を分けたが、経験の内容形成は未達。次の主課題は§9.2/9.4の受け取り内容であり、時点修正完了を初回単位の完成にしない。2 received＋2評価の初回capability gap、same100・本人実機・正式Product Readも残る。詳細は正本06／API handoff u257。0/3・candidate_ready=false・automatic_progression=falseを維持。


### u258 — 明示「その時は」の再訂正と旧保存互換（2026-10-14 JST）

同じ限定承認内で先行u257（API11720b6／資料39a4714）を保持し、`cocolon_meaning_experience_engine/emlis_answer_update.py`の責務だけを追加修正した。先行回答の「今は」評価を新たな「その時は」で再訂正した場合、元入力envelopeへ戻し、旧回答anchorを残さない。対象撤回後も当時の評価だけを保持する。u257のsource検証・共通作者helper・独立readerは不変。先行u257で同訂正をPARTIAL保存した場合はprivateな旧解析modeで完全checkpointを再導出し、旧意味のまま再開する。

新fixture `ai/tests/fixtures/cmee_emlis_pre_appraisal_original_time_checkpoint_v1.json`は未変更11720b6の2round実checkpoint・本文2件。既存評価testへ新解釈2件＋旧互換2件を追加し156 PASS、既存Q2/Q3 application54 PASS、現行shared identity1 PASS。新しい保存2本文の実service＋隔離PGliteとRN hook/modal再open、旧PARTIALの本文保存503→retryを確認（native実機ではない）。新production file・意味schema・公開API/DB/SQL/RN・依存・他中核の変更なし。STRUCTURE_MAP_DELTA_PRESENT。詳細・反映版は設計06／API handoff u258。

**BOUNDED_IMPLEMENTATION_WIP / PRODUCT_NOT_CLEAR。** 次の主課題は先行u257のとおり§9.2/9.4の経験の受け取り内容形成。追加の組合せ検査を完成の代用にしない。2 received＋2評価の初回停止・既存共有17失敗・same100・本人実機・正式Product Readは別の残件として維持。0/3・candidate_ready=false・automatic_progression=false、10/17・10/31・12/18とPiece/Analysis主枠は不変。


### u260 — 確認済みの満足／納得をNORMALの本文へ反映（2026-10-14 JST）

Mashの意味確認は思想資料§12.10へ保存。同じ限定承認内、STRUCTURE_MAP_DELTA_PRESENT。既存API `ai/services/ai_inference/` 内の責務差分は次の4file。

| 既存owner | 今回の責務差分 |
|---|---|
| `cocolon_meaning_experience_engine/contracts.py` | 既存の評価内容から充足／本人内の理解と肯否の四区分を導出するproperty。永続化fieldやschemaを追加しない。 |
| `emlis_ai_grounded_human_reception.py` | NORMALの対象を本人内の充足／理解とともに文章化。否定評価も同じ対象へ限定し、程度付き納得は元の評価語を保持する。LIMITED作者は不変。 |
| `emlis_ai_grounded_observation_gate.py` | 実節から対象・本人内の状態・肯否・時点・程度・継続を作者なしで照合。whole inverseの既存plan-only replayは保持する。 |
| `emlis_ai_grounded_sentence_surface.py` | 上記の受容述語を既存receive markerとして認識。内容の作者・受理権限は追加しない。 |

検査配置は既存 `ai/tests/test_cmee_emlis_result_appraisal.py` と現行shared owner identity fixture。新production file/service、公開API/DTO/DB/SQL/RN、意味checkpoint schema、依存、他中核は不変。技術検証の詳細は06／API handoff u260。166評価検査・54 application検査、合成7保存本文とRN hook/modal再openを確認した（native実機ではない）。

**BOUNDED_IMPLEMENTATION_WIP / PRODUCT_NOT_CLEAR、初回単位未完了。** 今回は評価語を本人内の状態へ展開したNORMAL限定候補であり、四区分propertyだけでevent内容やReadingConsequenceを新たに解釈したとはしない。肯定の経験化・否定の併記には定義展開／関係反復が残る。§9.2/9.4の主観差分の完成ではない。目的・未完了の明示入力を活かせない例、同memo receivedで別行動へ焦点が移る例、2 received＋2評価の初回gap、既存共有17失敗・same100・本人実機・正式Product Readは残る。0/3・candidate_ready=false・automatic_progression=false・未配置を維持。

### u262 — 未成立fact・対象・満足の三点を保持する責務（2026-10-15 JST）

Mashは2026-10-15 06:17 JSTにu261限定提案を承認した。`EMLIS_APPRAISAL_CONNECTED_UNFINISHED_CONTEXT_20261014 = APPROVED_FOR_BOUNDED_IMPLEMENTATION`。STRUCTURE_MAP_DELTA_PRESENT。既存API `ai/services/ai_inference/` 内の責務を次のように接続する。

| 既存owner | 今回の責務差分 |
|---|---|
| `emlis_ai_grounded_observation_plan.py` | 有限な未成立fact・実行済み対象・肯定無程度の満足を原文の三範囲から認識し、ABOUT_TARGETと明示CONTRASTを保持。結果を表す「を…にした／できた」を他者主語と取り違えず、三点を一つのReception dutyへ渡す。 |
| `cocolon_meaning_experience_engine/emlis_thread_projection.py` | 評価と明示接続した未成立fact exact1だけをcomponentへ含め、他の独立requiredは本人の実行行動へ限定する。 |
| `cocolon_meaning_experience_engine/contracts.py` | 対比側に包まれた評価の既存role qualifier（種別・程度・時点・依存）を保持。transportとsource admissionを分離し、raw/direct再構成で失われるmarkerへ運搬条件を依存させない。schema／registryとexact2評価内容型は不変。 |
| `cocolon_meaning_experience_engine/emlis_stage1_composition.py` | 両評価端点の明示appraisal qualifierをentry条件とし、既存received/reasonを先取りしない。選択済み三点・二関係・qualifierを通常`EmlisAppraisalContent`のexact3/protected0へ投影。ReadingConsequenceへReception文言を加えない。 |
| `emlis_ai_grounded_human_reception.py` | sourceと選択済み三bindingを照合し、未成立の点と評価対象を区別した充足として唯一の作者が文章化する。各時点を保持し、未成立を本人の不能・知識不足へ変えない。 |
| `emlis_ai_grounded_observation_gate.py` | 作者から独立して三命題・対象・肯否・時点・対比を読む。whole inverseのplan-only replayは保持し、片側欠落・対象交換・未成立の誤同時化を受理しない。 |
| `emlis_ai_grounded_sentence_surface.py` | 同じ三点に対する既存Observation構文とReception markerを扱う。独立した作者や受理権限は追加しない。 |

検査配置は既存`ai/tests/test_cmee_emlis_result_appraisal.py`（最終187 PASS、既存166＋新21）と`ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json`（現行identity1 PASS）。Q2/Q3 application54 PASS、合成4本文の実service＋隔離PGlite保存とNoAuthor restart GET/start・RN hook/modal履歴/再open一致を確認した。旧checkpoint2件は完全一致で旧意味・旧停止を保持し、既存historical fixture4組10rowは不変。新しいfresh prepareだけが新三点本文を作る。途中のapplication20 FAILとqualifier投影不一致は06／API handoff u262に記録した。新production file・公開API/DTO/DB/SQL/RN・意味schema・製品依存・Piece/Analysis変更なし。実装反映版はAPI `da6ee56beba26bbf0d89c734230f363ba794a9b8`（PR3）。対応する設計・地図・weekly差分は本commit（PR30）に収録する。両PRはDraft、未配置。今回CI成功は未確認で、local検査と区別する。

**BOUNDED_IMPLEMENTATION_WIP / PRODUCT_NOT_CLEAR、初回単位未完了。** 0/3・candidate_ready=false・automatic_progression=false・未配置を維持し、構造成立を§9.2/9.4の商品完成へ換算しない。


### u264 — 本人の明示理由を満足の対象へ結ぶ限定実装（2026-10-15 JST）

Mashがu263のRule18 §11.3確認へ「進めていいよ」と承認した。`EMLIS_APPRAISAL_EXPLICIT_REASON_20261015 = APPROVED_FOR_BOUNDED_IMPLEMENTATION`。同一文に本人が肯定factとして明示した理由exact1、実行済み対象、肯定・無程度の満足（過去又は現在）を結ぶ限定追加を実装した。u253/u262承認も継続する。

| 既存API owner（`ai/services/ai_inference/` 配下） | u264の責務差分 |
|---|---|
| `emlis_ai_grounded_observation_plan.py` | 同一文の理由・対象・満足を原文三範囲として認識し、理由→満足と対象→満足を証明。一つのReception dutyへ渡し、理由なしの旧投影も維持する。 |
| `cocolon_meaning_experience_engine/contracts.py` | 私有SATISFACTION_REASONと該当direction row1.1、原因／結果role qualifierの運搬。ABOUT専用の例外を理由へ適用しない。 |
| `cocolon_meaning_experience_engine/emlis_input_specific_meaning.py` | source/carried両境界で三端点・二関係・SELF・単一軸・同一証拠を検証し、理由row1.1をconfigurationへ保持する。 |
| `cocolon_meaning_experience_engine/emlis_thread_projection.py` | sourceで証明済みの理由関係のみprivate scopeへ投影し、理由を独立requiredの行動と取り違えない。 |
| `cocolon_meaning_experience_engine/emlis_stage1_composition.py` | 選択された二関係と三bindingからMATERIAL_WEIGHT／RECEIVE_AS_MATERIALの内容を導出する。 |
| `emlis_ai_grounded_human_reception.py` | 選択binding／focalとsourceを照合し、満足の拠り所と対象を一つの受け取りへ文章化する。 |
| `emlis_ai_grounded_observation_gate.py` | 作者を呼ばず本文の三役割・時点・選択binding・focalを読む。欠落、交換、否定、発明した因果を拒否する。 |
| `emlis_ai_grounded_sentence_surface.py` | 既存本文inverseに今回の受容述語を保持する。新作者や新受理権限は持たない。 |
| `cocolon_meaning_experience_engine/emlis_question.py` | 旧意味復元時だけ理由分解を無効にした原planを渡す。 |
| `cocolon_meaning_experience_engine/emlis_answer_update.py` | 旧checkpoint／既発行質問を理由追加前の意味で厳密再検証し、その他の従来評価を維持する。 |
| `cocolon_meaning_experience_engine/emlis_thread_engine.py` | Q1でも理由追加前の準備済みplanを使い、旧checkpointを現行意味で再生成しない。 |


STRUCTURE_MAP_DELTA_PRESENT。新production file・engine・checker・registry・serviceは追加しない。公開API/DTO/DB/SQL/RN・製品依存・Piece/Analysisは変更0。内部の理由relation契約には上記versioned分岐を追加したため「内部schema変更なし」とは記録しない。検査配置は既存 `ai/tests/test_cmee_emlis_result_appraisal.py` と現行 `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json`。歴史IM03 proofは不変。

最終の既存評価file **236 PASS（既存187＋新49）** とQ2/Q3 application **54 PASS**、計 **290 PASS・109.87秒・既存依存warning2**。現行shared-owner identity **1 PASS・22.98秒**。language `5226a02541b35153ffb5be8c70a8611545d483381f27a19898938be3310541b2`、runtime `9360829fb81c0b5615152b9b1b6f9274209545eba4ee0e8a12de396d65b352b5`。理由削除／差替え・独立行動非混入・対象外21例・三役割／時点／binding／focalの改変拒否・旧完全checkpoint6件を確認。実sourceのSOURCE_STATED_CAUSE候補と通常direct endpoint supportから既存final relation validatorもPASS。合成4本文を実service＋隔離PGliteへ保存し、event payload一致・NoAuthor restart GET/startのDTO完全一致、実RN hook/modalで履歴展開とclose/reopenの本文/event一致を各4件確認した。git diff --check成功。runtimeは既存Python3.12.14/PGlite0.5.8/React18.3.1を使用。外部AI呼出・新有料service・製品依存追加0。これらは本人実機／正式Product Readではない。

**BOUNDED_IMPLEMENTATION_WIP / PRODUCT_NOT_CLEAR、初回単位未完了。** 正式商品受入れ0/3・candidate_ready=false・automatic_progression=false・未配置・Draft/open/unmergedを維持する。今回の理由欠落改善を§9.2/9.4全体の完成へ換算しない。


### u265 — 同一欄の本人received文に続く評価の読み落としを修正（2026-10-15 JST）

| 既存API owner（ai/services/ai_inference/） | u265の責務差分 |
|---|---|
| emlis_ai_grounded_observation_plan.py | received文法をraw-text helperへ抽出して共有。前文全体が単一received exact2、理由/未成立contextなしの評価に限り、受け手のSELF継続を許可。giver内の別主体やSELF giverを追加判定し、広い旧giver文法だけで本人扱いしない。旧意味復元時だけ新entryを無効化。 |
| cocolon_meaning_experience_engine/emlis_question.py | 新entryを無効化した原planを既存の厳密復元へ渡す。 |
| cocolon_meaning_experience_engine/emlis_answer_update.py | current→新entry無効→理由追加も無効→pre-appraisalの順で完全checkpointを照合。新しい意味へ旧IDを貼らない。 |
| cocolon_meaning_experience_engine/emlis_thread_engine.py | Q1の旧checkpointも旧prepared planから本文化し、現行sourceへの再解釈を避ける。 |

STRUCTURE_MAP_DELTA_PRESENT。既存production 4fileの責務変更のみ。新file/engine/author/checker/registry/service、内部意味schema・公開API/DTO/DB/SQL/RN、製品依存、Piece/Analysisの変更0。検査は既存test_cmee_emlis_result_appraisal.pyと現行shared-owner identity fixtureへ追加／更新し、歴史fixture/IM03 proofは変更しない。

意味・保存・実本文はcurrent01/04と06／API handoff u265。


### u266 — 理由付き満足とreceived経験が別欄にある初回本文の停止を修正（2026-10-15 JST）

| 既存API owner（ai/services/ai_inference/） | u266の責務差分 |
|---|---|
| emlis_ai_grounded_human_reception.py | validate_selected_subjective_reception_inputで既存LIMITEDのATTENTION/ATTEND_TO、全体binding、focalなしと、分割されたcontributionが理由・対象・満足の三端点を過不足なく所有することを確認。_source_owned_relational_focus_sentenceで本人の理由・対象・時点を限定的に受け取る。NORMALと未成立contextの条件は維持。 |
| emlis_ai_grounded_observation_gate.py | _read_relational_focus_discourseでLIMITEDの選択所有と三役割・時点・肯否を作者から独立して再照合。NORMALのexact3/focal検査も維持。 |
| ai/tests/test_cmee_emlis_result_appraisal.py（repo相対） | 両欄配置・過去/現在・理由差替え、独立reader、誤った役割/時点/理由、contribution借用/欠落/過剰を拒否する19検査を追加。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json（repo相対） | 実sourceから現行shared-owner identityを再計算。歴史fixture/IM03 proofは不変。 |

STRUCTURE_MAP_DELTA_PRESENT。既存production 2file・3関数の責務修正。source認識・投影・意味契約・checkpoint生成・公開API/DTO/DB/SQL/RN・依存は変更0。新file/engine/author/checker/registry/serviceは追加しない。

実本文・検証・既存撤回残件は06／API handoff u266、進行はweekly§5.6.16。


### u267 — 理由付き満足の原文全文撤回を既存訂正契約へ接続（2026-10-15 JST）

| 既存owner（API repo相対） | u267の責務差分 |
|---|---|
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py | _prepare_answerで既存source_owned_result_appraisal_reasonの証明を使い、原文全文の3owner撤回を許可。全span所有集合と候補一意を維持。prepare_emlis_meaningで旧checkpoint完全再導出modeを追加し、_prepare_emlis_meaning_from_planで各Q3 prefixへ引き渡す。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 両欄・理由差替え・評価時点、部分/他文引用、単独owner撤回、旧全checkpointと質問改変、実保存/NoAuthor再読を確認。重複理由文の既存認識残件も固定し、一括撤回へ拡張しない。 |

STRUCTURE_MAP_DELTA_PRESENT。既存production 1file・3関数の責務変更。新file/helper/engine/author/checker/registry/serviceは追加0。source認識・意味schema・公開API/DTO/DB/SQL/RN・製品依存は変更0。検査は既存test_cmee_emlis_result_appraisal.pyへ24件と未変更26d8ccc7で実取得した旧完全checkpoint4件を追加し、歴史fixture/IM03 proof・現行shared-owner identity fixtureは不変。

実本文・互換・検証・重複原文の残件は06／API handoff u267、進行はweekly§5.6.17。


### u268 — 重複原文の全文撤回を誤確定しない（2026-10-15 JST）

| 既存owner（API repo相対） | u268の責務差分 |
|---|---|
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py | _prepare_answerで直接一致＋証明済み全文groupを合わせた一意性を判定。prepare_emlis_meaningで明示旧checkpoint用precedenceを再導出し、_prepare_emlis_meaning_from_planから各prefixへ渡す。全文所有証明・置換処理・意味投影は不変。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 両欄配置×単独撤回／独立訂正併記の4ケースで未解決・原文保持・独立訂正を検証。未変更66613bc5から取得した旧完全checkpoint8件を本文状態まで比較。既存保存検査は維持。 |

STRUCTURE_MAP_DELTA_PRESENT。既存production 1file・3関数の変更。source認識・意味schema・公開API/DTO/DB/SQL/RN・製品依存は不変。新file/helper/engine/author/checker/registry/service追加0。歴史fixture/IM03 proof・現行shared-owner identity fixtureは変更しない。

重複原文は両表現を合わせて一意にできない限り未解決とする。source配置そのものは変えない。互換・検証の限定範囲と初回本文の残件は06／API handoff u268、進行はweekly§5.6.18。


### u269 — 隣接する同一理由文の初回本文を回復（2026-10-15 JST）

STRUCTURE_MAP_DELTA_PRESENT。既存production 5fileと既存test／現行identity fixtureを変更。新file・engine・author・checker・service・registryは追加0。既存sentence surface内に私有の意味等価証明helperを1つ追加。意味schema・公開API/DTO/DB/SQL/RN・製品依存・独立reader・品質gateは変更0。歴史fixture/IM03 proofは不変。

| 既存owner（API repo相対） | u269の責務差分 |
|---|---|
| ai/services/ai_inference/emlis_ai_grounded_observation_plan.py | 先頭の同一理由文2出現のSELFを個別scalarで証明。選択済み評価の同一span理由／対象supportを修復。旧source再導出flagを既存final projection鎖へ渡す。 |
| ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py | _repeated_reason_appraisal_relationsが二組の完全な意味／出典同値を証明し、既存merge/renderで6owner/4relationのbindingを保持したまま既存文法を一度描画。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py | original_meaning_planで旧重複source形の内部再導出指定を受け渡す。質問の公開契約は不変。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py | 旧source形と旧訂正modeを組み合わせて完全checkpointを再導出。古いcanonical質問にも同じ旧形を適用。新規回答の候補一意性は保持。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_engine.py | 復元した旧source形の初回本文はprepared planを使う。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 初回の両欄／Q1/Q3／理由／評価時点、6owner/4relation、非同一・他者scope、独立reader、旧checkpoint12件、実保存／NoAuthor再開を追加。旧重複source期待を6ownerへ更新。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行共有source ownerの正規計算値だけを再採録。歴史receiptを変更しない。 |

全体のRN→API→service/store→read→RN経路は維持。分析・Piece・国家・TodayQuestionの責務は不変。01B/01Cのcore間経路追加はない。詳細はAPI handoff u269／06／weekly§5.6.19。

**BOUNDED_IMPLEMENTATION_WIP / PRODUCT_NOT_CLEAR、初回一体単位未完了。** 正式受入0/3・candidate_ready=false・automatic_progression=false・未配置・Draft/open/unmergedを維持する。


### u270 — 2 received＋2評価のsource保持漏れを修復（2026-10-15 JST）

STRUCTURE_MAP_DELTA_PRESENT。既存production3file・既存test・現行identity fixtureと新規の合成旧checkpoint fixture1fileを変更。新helper/engine/author/checker/service/registry、公開API/DTO/DB/SQL/RN、製品依存の追加・変更は0。

| API repo相対path | u270の責務差分 |
|---|---|
| ai/services/ai_inference/emlis_ai_grounded_observation_plan.py | 既存final projection内でplain評価exact2とreceivedの全owner閉包を証明してretentionを修復。直接生成の既定は従来のまま。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py | threadのoriginal_meaning_planから昇格を明示有効化し、旧投影指定を渡す。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py | 限定旧retention planを完全checkpointとして再導出。既存の旧世代fallbackも旧retentionを維持。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 両欄・対象・肯否・時点、全8owner、逆読解、余分な材料、Q1上限残差、旧checkpoint、実保存／NoAuthor再開を検証。 |
| ai/tests/fixtures/cmee_emlis_plain_appraisal_retention_u268.json | 新規。未変更u268から実取得した合成旧checkpoint12例と旧本文状態。個人実入力ではない。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行共有ownerの正規identityを再採録。歴史receiptは不変。 |

RN→API→service/store→保存read→RNの経路と、分析・Piece・国家・TodayQuestionの責務は不変。01B/01Cの経路追加なし。本文・実測・限界はAPI handoff／06 u270、優先順はweekly§5.6.20。

**BOUNDED_IMPLEMENTATION_WIP / PRODUCT_NOT_CLEAR、初回一体単位未完了。** 正式受入0/3・candidate_ready=false・automatic_progression=false・未配置・Draft/open/unmergedを維持する。


## u271 — 重複理由文の各出現と別のreceived経験を初回Receptionへ保持（2026-10-15 JST）

STRUCTURE_MAP_DELTA_PRESENT。既存production 6file、既存testと現行identity fixtureを更新し、旧u269の合成checkpoint fixtureを1file追加。新しいengine・author・checker subsystem・service・registryは作らない。内部意味schemaの形、公開API/DTO/DB/SQL/RN、製品依存、Piece/Analysisは変更しない。歴史fixture／IM03 proofは保持。

| 既存owner（mashos-api相対） | u271の責務差分 |
|---|---|
| ai/services/ai_inference/emlis_ai_grounded_observation_plan.py | sourceに完全一致二文の証明属性。source_owned_duplicate_reason_appraisalsで別々の閉じた三owner群を検証し、既存duty／retained-group選択へ接続。resolverがある段階では実原文と別scalar位置も再確認。 |
| ai/services/ai_inference/emlis_ai_grounded_human_reception.py | _duplicate_reason_pairで既存二Move一文への適格性を判定。各exact3とcontributionを検証後に等価な有限文を一度描画し、両expression／Moveの可視bindingを保持。 |
| ai/services/ai_inference/emlis_ai_grounded_observation_gate.py | 既存pair readerで双方のLIMITED三役割を実本文から独立に照合。Observationは二文全体と全六核／四関係を照合。作者replay自体は既存full inverse内に残り、独立readerと混同しない。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py | original_meaning_planでu269の属性なしsourceを再導出する内部指定を伝搬。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py | 完全u269 checkpointを先に再導出し、既存u268以前の互換鎖を保持。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_engine.py | 旧u269 sourceの初回本文もprepared planから描画。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 新三Move期待・両欄の初回／境界／改変拒否／保存再試行／歴史互換。 |
| ai/tests/fixtures/cmee_emlis_u269_duplicate_source_checkpoints.json | 未変更u269から採録した合成12件。現行挙動への期待ではなく旧保存結果の互換証拠。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行正規計算値を更新。歴史proofや商品判定は変更しない。 |

適用境界は、原文同一fieldの完全一致二文・独立した第三の受け取りがある三Move・full／standard／LIMITED。重複二文だけの入力、両field各二文の十二核、別の理由、近似文、他者／引用、否定・程度付き満足・納得、PREMIUM複数round全般の完成は含まない。u269の認識文法は広げず、今回の証明属性は選択上の限定条件である。

**BOUNDED_IMPLEMENTATION_WIP / PRODUCT_NOT_CLEAR、初回一体単位未完了。** 正式受入0/3・candidate_ready=false・automatic_progression=false・未配置・Draft/open/unmergedを維持する。

実本文・検証と残件はAPI handoff／06 u271。01B/Cの隣接責務は不変。


### u272 — 訂正後のQ3本文停止を既存の意味・上限を保って修復（2026-10-15 JST）

STRUCTURE_MAP_DELTA_PRESENT。既存production2file／3関数、既存test1file、現行identity fixture1fileを更新。新規製品file・helper・engine・author・checker・service・registryは0。

| mashos-api相対path | u272の責務差分 |
|---|---|
| ai/services/ai_inference/emlis_ai_grounded_observation_plan.py | build_grounded_reception_opportunitiesで訂正評価のretained group順をsource順へ統一。_build_reception_depth_policy_and_movesで証明済み理由二組の役割と既存配置順を整合。 |
| ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py | _observation_surface_atomsで限定訂正経路のsource連結成分をarc identityへ接続。文法roleと経験identityを区別し、同一arc分割検出を保持。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 訂正後の実本文・両欄／理由／時点変種・独立逆読解・同一arc分割拒否・保存と再読を検証。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行共有ownerの正規identityを再採録。旧checkpointと歴史proofは変更しない。 |

u269〜271に記録した対象Q3の上限診断を訂正する。今回の再現では必要Observation contributionは6、既存capは8で、投影・生成・独立逆読解を通過していた。停止原因は、独立したsource groupを同じgeneric grammar role由来のsemantic arcと扱う最終検査での誤認、訂正後の重複理由二組に同じ受容predicate familyを割り当てる不整合、欄を入れ替えた訂正評価でinventoryとselectorのretained group順が異なる不整合の三点。過去の停止事実は保持するが、そのQ3原因記述を現在の判断に再利用しない。Q1の既存上限残件は別である。

RN→API→service/store→保存read→RNの既存経路、01B/Cの隣接責務は不変。u253/u264/u271の既存意味と§9.4の多対一可視unitを接続する整合修正。source認識・意味schema・checkpoint生成／旧再導出・NORMAL資格・Move数・Observation contribution上限・作者・独立reader・最終gateは変更しない。公開API/DTO/DB/SQL/RN・製品依存も不変。

実本文・検証・残件はAPI handoff／06 u272、優先順はweekly§5.6.22。

**BOUNDED_IMPLEMENTATION_WIP / PRODUCT_NOT_CLEAR、初回一体単位未完了。** 正式受入0/3・candidate_ready=false・automatic_progression=false・未配置・Draft/open/unmergedを維持する。


## u273 — 理由・対象・評価を一文で保持し、同じ評価の説明反復を減らす（2026-10-15 JST）

STRUCTURE_MAP_DELTA_PRESENT。新規production file／subsystemは追加せず、既存ownerの可視unit実現と独立読解責務を更新する。

| 既存owner（mashos-api相対） | u273の責務差分 |
|---|---|
| ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py | 閉じた理由・対象・評価を一文で実現。出現別bindingと旧plan表現を保持。 |
| ai/services/ai_inference/emlis_ai_grounded_observation_gate.py | 可視一文全体とsourceの三役割・全関係を作者非依存で照合。証明した関係だけに共有評価の構文を認める。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 既存反復期待の更新、te/deを含む三役割・意味改変拒否、保存再読と既存訂正停止の履歴境界。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行正規identityだけを再計算。歴史proofは不変。 |
| ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md | 実本文、検証分母、残件と次ownerを保存。 |

本人が明示した一つの理由と評価対象が同じ肯定・程度なしの満足へつながる場合、二関係を別文にして評価を二度出すObservationを一文へまとめた。sourceで証明済みの完全一致二出現も、六核・四関係・出現別根拠を保持して一文を共有する。原文同一性の証明がない近似文・別欄の別経験を統合しない。

意味選択・source認識・checkpoint・旧再導出・Reception・各上限は変更しない。旧二出現planに同一性証明がない場合、または旧撤回後に同じ原文二出現の片方だけ残る場合は従来の表現を保持する。歴史checkpoint fixture／IM03 proofは変更しない。API/DTO/DB/SQL/RN・製品依存・Piece/Analysisへの変更なし。

実本文・検証分母・既存訂正停止はAPI handoff／06 u273。

**BOUNDED_IMPLEMENTATION_WIP / PRODUCT_NOT_CLEAR、初回一体単位未完了。** 正式受入0/3・candidate_ready=false・automatic_progression=false・未配置・Draft/open/unmergedを維持する。


## u274 — 単独理由付き評価と別経験の訂正後本文を保存・再表示へ戻す（2026-10-15 JST）

STRUCTURE_MAP_DELTA_PRESENT。新規production file／subsystemは追加せず、既存ownerのsource成分識別責務を更新する。

| 既存owner（mashos-api相対） | u274の責務差分 |
|---|---|
| ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py | 既存plan/resolverをObservation行へ伝搬し、原文一出現・未解釈境界なしの単独理由評価へ既存source成分identityを適用。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 訂正後保存6条件をREFINEDへ更新、別成分／不当分割拒否／独立逆読解を8条件追加。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行正規identityだけを再計算。歴史proofは不変。 |
| ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md | 実本文、適格条件、保存・表示検証、残件と次ownerを保存。 |

既存_observation_surface_atomsへ既存plan/resolverを渡し、source_owned_result_appraisal_reasonが一組で、元の同欄・同文出現が一回、answer_interpretation_unresolved境界がない場合に、既存u272のsource成分identityを適用する。受理済み回答・thread source契約・既存関係型の条件も保つ。撤回後の一組だけを原文一出現と誤認せず、未解釈撤回の旧checkpointも新分岐から除外する。重複理由／訂正評価の既存u272分岐は変更しない。

同じsource成分を二行へ不当に分割した場合は引き続きrequired_arc_fragmented_without_reasonで拒否する。正当化atomの追加、gate緩和、意味選択・source認識・checkpoint schema・旧fixture／IM03 proof・本文作者・独立reader・Reception・各上限の変更はない。API/DTO/DB/SQL/RN・製品依存・Piece/Analysisも変更しない。

実本文・検証分母はAPI handoff／06 u274。

**BOUNDED_IMPLEMENTATION_WIP / PRODUCT_NOT_CLEAR、初回一体単位未完了。** 正式受入0/3・candidate_ready=false・automatic_progression=false・未配置・Draft/open/unmergedを維持する。


## u275 — 理由付き満足のLIMITED受け取りへ、選択済みの注意対象を明示（2026-10-15 JST）

STRUCTURE_MAP_DELTA_PRESENT。新規production file／subsystemなし。既存責務の変更は次のとおり。

| mashos-api相対path | 今回の変更 |
|---|---|
| ai/services/ai_inference/emlis_ai_grounded_human_reception.py | 理由付き満足のLIMITEDに選択済みATTENTIONを実現。旧二出現の片方だけ残る本文は保持。 |
| ai/services/ai_inference/emlis_ai_grounded_observation_gate.py | 新有限文を作者非依存で逆読解。旧互換の分岐も原文出現から判断し、失敗時のnominal救済を拒否。 |
| ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py | 既存attention markerへ新しい注意述語の文末を接続。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 語尾3形・過去現在・欄交換、改変拒否を拡張。既存の当該文面期待を更新。歴史checkpointは不変。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行共有ownerのidentityのみ再計算。 |

RN→API→service/store→保存read→RN経路、01B/Cの隣接責務、公開API/DTO/DB/SQL/RN・製品依存・外部AI禁止は不変。

作者と独立readerは同欄・同文の原文出現を各自確認し、一出現または既存の完全二組証明がある場合に新表現を使う。旧u267で二出現の片方だけ残るcheckpointは旧本文を維持する。旧fixtureを変更しない。readerは三役割、時点、本人の理由をsourceと照合し、原文改変・理由の唯一化・成長の捏造・旧確認文への逆戻りを拒否する。

**TECHNICAL_CREDIT / PRODUCT_NOT_CLEAR、初回一体単位未完了。** 正式受入0/3・candidate_ready=false・automatic_progression=false・Draft/open/unmerged・未配置を維持する。これは選択済み注意の可視化であり、§9.2/9.4全体の経験としての受け取り完成ではない。説明的な硬さ・反復、Q1の4経験上限、近似文／別欄二組、有限対象撤回後の不自然さ、旧receivedのgiver帰属、共有17失敗・same100・本人実機・正式Product Readは残る。


## u276 — 満足の対象だけを撤回した後の理由・評価を有限文へ戻す（2026-10-15 JST）

STRUCTURE_MAP_DELTA_PRESENT。新規production file／subsystemなし。既存ownerの責務差分：

| mashos-api相対path | 変更 |
|---|---|
| ai/services/ai_inference/emlis_ai_grounded_observation_plan.py | 既存選択は変えず、対象撤回後の残存理由／満足二役割を本文向けに識別。 |
| ai/services/ai_inference/emlis_ai_grounded_human_reception.py | 二binding／focalの所有を確認し、残存理由・評価時点・注意を有限文へ実現。 |
| ai/services/ai_inference/emlis_ai_grounded_observation_gate.py | 作者非依存に二役割・本人・肯否・時点・方向を逆読解。新有限文失敗のnominal救済を拒否。 |
| ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py | 既存attention markerへ「つながりに目を向けています」の文末を接続。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 撤回後の本文、三理由・時点・欄、独立readerと意味改変、focus／focalの境界を18検査で追加。旧検査・歴史fixtureは不変。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行共有ownerのidentityだけを再計算。 |

RN→API→service/store→保存read→RNの経路と01B/Cの隣接責務、公開API/DTO/DB/SQL/RN、製品依存・外部AI禁止は不変。

source_owned_relational_focusはplanありの本文経路だけで、同一sourceに残る理由／満足exact2・withdrawn_source_event・単独user_stated_cause・本人・肯定無程度・過去現在を確認する。planなしの選択／reference-mode導出は不変。既存作者と独立readerはLIMITEDのATTENTION/ATTEND_TO、RELATIONAL_NONCOLLAPSE/PRESERVE_BOTH_ENDPOINTS、二bindingと理由関係focalを照合する。理由削除・別理由・他者・否定・時点変更・因果逆転・唯一化・撤回対象の復活を拒否し、有限文reader失敗をnominal fallbackで救済しない。

**TECHNICAL_CREDIT / PRODUCT_NOT_CLEAR、初回一体単位未完了。** 正式受入0/3・candidate_ready=false・automatic_progression=false・Draft/open/unmerged・未配置を維持する。今回の有限文修正を経験理解・§9.2/9.4全体の完成へ換算しない。固定的で説明的な表現、撤回後に別received経験がReceptionへ選ばれない状態、Q1の4経験上限、近似文／別欄二組、旧receivedのgiver帰属、既存共有17失敗・same100・本人実機・正式Product Readは残る。


## u277 — 満足対象の撤回後も別received経験をReceptionへ残す（2026-10-15 JST）

STRUCTURE_MAP_DELTA_PRESENT。新規production file／subsystemなし。既存ownerの責務差分：

| mashos-api相対path | 変更 |
|---|---|
| ai/services/ai_inference/emlis_ai_grounded_observation_plan.py | 対象撤回後のsource証明を再利用し、理由／満足と一つの別received組を既存2 Moveへ保持。 |
| ai/services/ai_inference/emlis_ai_grounded_human_reception.py | source dutyとMove別contributionの所有を照合し、既存material attentionで残存理由の有限文を実現。 |
| ai/services/ai_inference/emlis_ai_grounded_observation_gate.py | 同じ限定scopeをsourceから再導出し、作者非依存に実本文の理由・満足・時点・所有を読む。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 既存撤回検査を二経験へ更新し、旧二received分岐12条件と追加action境界2条件を追加。意味改変拒否を維持。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行共有owner identityを再計算。歴史checkpoint fixtureは不変。 |

RN→API→service/store→保存read→RN、01B/C隣接責務、公開API/DTO/DB/SQL/RNと製品依存は不変。sentence surfaceの追加編集はない。

u276の同一source内の理由／満足exact2・withdrawn_source_event・単独user_stated_cause・本人・肯定無程度・過去現在という証明を既存plan owner内のhelperへ抽出した。これに加え、回答由来nucleusなし・残りが一つのreceived組という条件で_thread_retained_reaction_groupsから二つのdutyを返す。選択は既存LIMITED ATTENTION/ATTEND_TOの全source MATERIAL_WEIGHT/RECEIVE_AS_MATERIALを保ち、Moveごとのcontributionを理由／満足と別経験へ分離する。validatorと作者非依存readerはexact2 Move、required、reception_act順、sourceから再導出したduty tuple一致、理由側のselected contribution exact2、focalなしを確認する。従来のRELATIONAL_NONCOLLAPSE/PRESERVE_BOTH_ENDPOINTS分岐も維持する。schema・source認識文法・NORMAL資格・各上限を拡張せず、既承認の選択内の欠落を直した。

**TECHNICAL_CREDIT / PRODUCT_NOT_CLEAR、初回一体単位未完了。** 正式受入0/3・candidate_ready=false・automatic_progression=false・Draft/open/unmerged・未配置を維持する。今回の欠落回復を§9.2/9.4の経験理解・受け取り全体の完成へ換算しない。固定的な説明／言い換え、対象撤回後の複数receivedや追加actionを含む範囲、Q1の4経験上限、近似文／別欄二組、旧receivedのgiver帰属、既存共有17失敗・same100・本人実機・正式Product Readは残る。


## u278 — 評価の訂正・撤回後も残存理由の状態と元の時点を保つ（2026-10-15 JST）

STRUCTURE_MAP_DELTA_PRESENT。新規production file／subsystemなし。既存ownerの責務差分：

| mashos-api相対path | 変更 |
|---|---|
| ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py | 訂正・撤回で未接続になったoriginal理由のfact/stateと過去／現在を単独Observationへ実現。 |
| ai/services/ai_inference/emlis_ai_grounded_observation_gate.py | 既存独立readerで未接続・source・型・時点を本文から照合。現在感覚化や否定評価への新因果を拒否。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 実生成24条件と作者禁止の独立本文reader8条件を追加。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行共有owner identityを再計算。歴史checkpoint fixtureは不変。 |

RN→API→service/store→保存read→RN、01B/C隣接責務、公開API/DTO/DB/SQL/RNと製品依存は不変。source/plan/選択/Reception ownerは今回編集していない。

既存sentence surfaceのthread用単独Observationで、original memo/memo_action・required/explicit・本人・肯定fact/state・過去現在・appraisal_explicit_reason／reasoned_result_appraisal・relationなしを限定して実現する。既存gateの_body_inverse_intervening_eventsは、source spanと欄、全体で未接続の理由、型・時点・本人・極性を照合し、本文の状態文と引用内容を作者非依存に読む。source認識、checkpoint、plan、selected reception、Reception作者、schema、NORMAL資格、各上限は変更しない。

**TECHNICAL_CREDIT / PRODUCT_NOT_CLEAR、初回一体単位未完了。** 正式受入0/3・candidate_ready=false・automatic_progression=false・Draft/open/unmerged・未配置を維持する。固定的な注意／説明文の内容形成、§9.2/9.4、対象撤回後の複数receivedや追加action、Q1の4経験上限、近似文／別欄二組、旧receivedのgiver帰属、既存共有17失敗・same100・本人実機・正式Product Readは残る。631件PASSを既存共有17失敗の解消とはしない。


## u279 — 否定訂正後も別received経験を受け取りに残す（2026-10-15 JST）

STRUCTURE_MAP_DELTA_PRESENT。既存選択owner内の責務補修、新規production file／subsystemなし。

| mashos-api相対path | 今回の変更 |
|---|---|
| ai/services/ai_inference/emlis_ai_grounded_observation_plan.py | 否定訂正後の評価と別receivedを、所有が閉じた既存2 Moveへ保持。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 実本文・独立reader・source所有の回帰16検査を追加。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行共有owner identityのみ再計算。歴史fixture不変。 |

RN→API→service/store→保存read→RNと01B/Cの隣接責務は不変。

適用は、source-ownedな評価関係exact1、回答核exact1（本人・否定・無程度の満足・original_occasion・過去／現在）、同一原文の理由／対象exact2、孤立した肯定fact/stateの理由、残余required textがoriginal received exact1の場合。理由と対象の原文range・field/span・所有、関係閉包を確認する。理由はObservationだけへ残し、否定評価へ因果を付け直さない。追加action・複数received・理由なし評価・明示的な回答時点への訂正・別回答併記をこの修正へ含めない。source認識、意味checkpoint、schema、NORMAL資格、各上限、作者／独立reader、公開API/DTO/DB/RNと製品依存は不変。

## u281 — 明示評価とreceived経験の組別接続（2026-10-15）

STRUCTURE_MAP_DELTA_PRESENT。本人の明示評価（満足／納得）exact1組と本人received対比exact1組を、既存source認識と全required所有の範囲で別成分として比較し、whole候補／ReadingConsequence各exact1へ結ぶ。理由は既存の0/1。u279の当時の満足を否定へ訂正する範囲では、孤立理由をObservationだけに残し、対象／否定評価とreceivedの既存2 Moveへ別々の主観内容を結ぶ。追加action・複数received・曖昧／重複owner・明示回答時点変更等へ広げない。

| mashos-api相対path | u281の責務差分 |
|---|---|
| ai/services/ai_inference/cocolon_meaning_experience_engine/contracts.py | versioned exact7 opportunity、selected bundle所有・identity・relation/basis検証、旧exact3分岐保持。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_projection.py | 明示評価1＋received1のsource限定資格、組別opportunity、Moveからclaim/traceへの一意接続。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_response.py | 組別post-selection、同act別opportunityの保持。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_composition.py | NORMAL投影の組別所有、作者前のsource Move照合、旧envelope検証、新private型のmanifest登録。 |
| ai/services/ai_inference/emlis_ai_grounded_human_reception.py | NORMAL理由の主観mode/operatorと全selected contributionを検証。文面作者の新設なし。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 新選択内容・本文の対応、改ざん拒否と対象外境界、旧保存回帰。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行共有owner identity再計算。歴史fixtureは不変。 |
| ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md | 実結果、本文、再現範囲と残件。 |

RN→API→service/store→保存read→RNの隣接責務と01B/Cは不変。新production file／subsystemなし。詳細設計は8/28末尾u281、実検証は正本06／API handoff末尾u281。TECHNICAL_CREDIT / PRODUCT_NOT_CLEAR。初回一体単位未完了、正式受入0/3、candidate_ready=false、automatic_progression=false、Draft/open/unmerged・未配置。

## u282 — received本文作者と独立reader（2026-10-15）

STRUCTURE_MAP_DELTA_PRESENT。既存作者／readerの受け取り内容と局所文法を更新。新file／subsystem／型なし。

| mashos-api相対path | u282の責務差分 |
|---|---|
| ai/services/ai_inference/emlis_ai_grounded_human_reception.py | 既存received作者へselected decisionを渡し、組別noncollapseを本人経験の受け取りとして表す。 |
| ai/services/ai_inference/emlis_ai_grounded_observation_gate.py | 新文から対比・両端・肯否・時点と選択内容の所有を作者非依存で読む。旧文法を保持。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 対照入力、本文／選択改ざん、独立再読、対象外境界を追加。既存NORMAL本文期待を更新。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行共有owner identityのみ更新。 |
| ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md | 実本文・検証・途中失敗・残件を記録。 |

u281で選択済みの、本人の明示評価exact1組＋本人received対比exact1組のうち、NORMAL / ATTENTION / ATTEND_TO / RELATIONAL_NONCOLLAPSE / PRESERVE_BOTH_ENDPOINTSを持つreceived成分だけを扱う。selected contribution exact1、basis exact2（RELATION_LEFT／RELATION_RIGHT）、source-owned単一contrast、追加回答なし、裸の過去形感情形容詞、full finite文を条件にする。理由0/1と当時の満足を否定へ訂正する既存範囲を維持する。

RN→API→service/store→保存read→RNの隣接責務、01B/C、公開契約は不変。8/28意味設計・正本06・API handoff末尾u282を参照。TECHNICAL_CREDIT / PRODUCT_NOT_CLEAR。初回一体単位未完了、正式受入0/3、candidate_ready=false、automatic_progression=false。既存Draft/open/unmerged・未配置を維持する。

## u284 — 同一対象と二段対比のsource・意味・本文接続（2026-10-16）

STRUCTURE_MAP_DELTA_PRESENT。新production file／subsystemなし。新規は合成旧checkpoint fixture。

| mashos-api相対path | u284の責務差分 |
|---|---|
| ai/services/ai_inference/emlis_ai_grounded_observation_plan.py | 一意な対象参照、原文range、二段対比、役割と失格条件。既存sourceへの版別分岐。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/contracts.py | 新group／content契約、厳密な型dispatch、source qualifierと独立所有検証。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_input_specific_meaning.py | 4/5役割の一つの意味構造、閉じた関係所有、観測ペアに束縛した反事実。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_projection.py | 第一Moveの評価根拠を保持し、wholeの共同読みと2 Moveを接続。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_response.py | Move別根拠所有、理由付き評価の重複facet除外、独立命題投影。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_composition.py | 選択済みgroupを4役割contentと所有順へ結ぶ。新型manifest登録。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py | 旧source認識への明示分岐。旧質問の再導出を保持。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py | 旧checkpointの全体再導出、更新時のgroup証明／外側関係の失効。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_engine.py | 旧source planに束縛した本文経路の識別。 |
| ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py | 原文の内外対比を平坦化せず、同時性を足さない初回Observation。 |
| ai/services/ai_inference/emlis_ai_grounded_human_reception.py | 評価対象の違いを2 Moveで受け取り、選択所有・IRを照合。 |
| ai/services/ai_inference/emlis_ai_grounded_observation_gate.py | 作者を呼ばず実本文とsource／selected内容の全役割・対象・時点・否定を検査。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 新適格／不適格、訂正失効、本文改変拒否、旧保存再導出。700条件。 |
| ai/tests/fixtures/cmee_emlis_pre_shared_target_checkpoint_v1.json | 新規。変更前de95074から取得した合成旧完全checkpoint8件。新実装で再生成しない。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行共有ownerの再導出。歴史fixtureを更新しない。 |
| ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md | 実結果、再現条件、実本文、残件のAPI側記録。 |

RN→API→service/store→保存read→RNの隣接責務と01B/Cは不変。公開契約・製品依存は変更しない。設計は8/28 u284、versionは05、実検証は06／API handoff、最新順序はweekly §5.6.34。PRODUCT_NOT_CLEAR・初回一体単位未完了・正式0/3・未配置。

実装commit：[81f52ef](https://github.com/MassyuRed/mashos-api/commit/81f52ef02cc74cd889904ff80d0185bd0a7d3fee)。API16pathのremote全文・blob SHA・変更集合・親commitを照合済み。


## u285 — 訂正後に残るreceived対比へ同時性を加えない（2026-10-16 JST）

STRUCTURE_MAP_DELTA_PRESENT。既存本文owner内の補修。新production file／型／subsystemなし。

| mashos-api相対path | 今回の責務差分 |
|---|---|
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_surface.py | 原文共同読みの失効後、未改変のreceived関係・両端を確認し、既存作者へ対比IDを渡す。 |
| ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py | 対象対比だけを時間中立に実現。既定の旧経路と初回nested作者を保持。 |
| ai/services/ai_inference/emlis_ai_grounded_observation_gate.py | 新完全文法を既存の端点／source照合へ接続し、旧文法の互換を保持。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 追加19検査。実本文16条件、独立reader、元関係／node変化の除外。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行共有owner identityのみ更新。歴史fixture不変。 |
| ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md | 現在入口と結果・残件・再現範囲。 |

RN→API→service/store→保存read→RNと01B/Cの責務は不変。原文の共同読みをresolver付きで再検証でき、更新後はその共同読みが失効し、received関係が完全一致で残り、両端nodeが既存失効属性の除去以外に変わっていない場合だけ適用する。原文の対比・肯否・各端点の時制を引用から保持する。新しい共同読みを更新後へ存続させず、意味選択・checkpoint・Reception・source認識・schema・上限・公開API/DTO/DB/RN・製品依存を変えない。

検証は06／API handoff u285、最新順序はweekly§5.6.35。TECHNICAL_CREDIT / PRODUCT_NOT_CLEAR。初回一体単位未完了、正式受入0/3、candidate_ready=false、automatic_progression=false、Draft/open/unmerged・未配置を維持する。


## u286 — 理由なし否定訂正でも残った経験を受け取りへ保持（2026-10-16 JST）

STRUCTURE_MAP_DELTA_PRESENT。新production file／永続型／subsystemなし。

| mashos-api相対path | 今回の責務差分 |
|---|---|
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py | 原初共有対象と唯一の理由なし満足否定訂正を再証明し、未改変の2経験の選択証明をresponseへ渡す。 |
| ai/services/ai_inference/emlis_ai_grounded_observation_plan.py | 非保存の2group引数を既存opportunity／depthへ通し、同family代表の脱落を対象限定で防ぐ。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 追加14検査。両欄・反応2・本文保持／改変拒否・所有改変／対象外訂正／PARTIAL非適用。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行identity更新。歴史fixture不変。 |
| ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md | 現在入口・実結果・検証限界・残件。 |

emlis_answer_update._active_planで成立する一時的な選択証明を、既存response→human_reception_plan→opportunitiesとdepthへ引数で渡す。source認識・核／関係・checkpoint・schema・NORMAL資格・Projection・作者／reader文法・公開API/DTO/DB/RN・依存・各上限は不変。原初共同groupと外側対比は失効したまま、更新後はLIMITEDを保持する。一般の理由なし訂正を一括で拡張しない。

RN→API→service/store→保存read→RNと01B/Cの責務は不変。検証は正本06／API handoff u286、順序はweekly§5.6.36。TECHNICAL_CREDIT / PRODUCT_NOT_CLEAR。初回一体単位未完了、正式受入0/3、candidate_ready=false、automatic_progression=false、Draft/open/unmerged・未配置を維持する。


## u287 — 直前文を検証した共有対象評価参照で二重説明を削減（2026-10-16 JST）

STRUCTURE_MAP_DELTA_PRESENT。新production file／永続型／subsystemなし。

| mashos-api相対path | 今回の責務差分 |
|---|---|
| ai/services/ai_inference/emlis_ai_grounded_human_reception.py | 実際の直前評価文が検証済みの場合だけ「その満足」を使い、二重説明を削減する。未成立なら完全表現を維持。 |
| ai/services/ai_inference/emlis_ai_grounded_observation_gate.py | 既存preceding_contextを共有対象readerへ渡し、同一group・2 Move順序・前文全文のsource-owned読みを証明。旧明示文法も保持。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 追加9検査。両欄／時点／理由／反応・誤参照／前文改変拒否・完全表現保持。旧明示4役割検査も継続。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 編集完了時の現行identity。歴史fixture不変。 |
| ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md | 現在入口・実本文・検証結果／限界・残件。 |

既存human_reception作者へ参照可否を渡し、observation_gateの既存preceding_contextを共有対象readerまで接続した。source認識、核／関係、checkpoint、意味schema、NORMAL資格、Projection、2 Moveの選択、公開API/DTO/DB/RN、依存と各上限は変更しない。訂正で初回共同読みが失効する条件とu285/u286の残存経験保持も維持する。

RN→API→service/store→保存read→RNと01B/Cの責務は不変。検証は正本06／API handoff u287、再開順序はweekly§5.6.37。TECHNICAL_CREDIT / PRODUCT_NOT_CLEAR。初回一体単位未完了、正式受入0/3、candidate_ready=false、automatic_progression=false、Draft/open/unmerged・未配置。


## u289 — 承認済みの理由・対象・本人の充足を一つの内容型から本文へ接続（2026-10-16 JST）

STRUCTURE_MAP_DELTA_PRESENT。新production fileなし。既存private主観内容契約へ独立したversion armを追加した。旧base／evaluated-experience-v1のfield不変。

| mashos-api相対path | 今回の責務差分 |
|---|---|
| ai/services/ai_inference/cocolon_meaning_experience_engine/contracts.py | 新reasoned-experience-appraisal-v1。3 binding／2 relation、kind・polarity・理由／評価時点の専用検証とexact-type分岐。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_composition.py | admitted initial threadだけへ新内容を投影。旧非thread／回答後は旧base。論理契約manifest 73→74。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_response.py | 元のphase_A.admitted_sourceから期待内容を再構成するための引渡し。 |
| ai/services/ai_inference/emlis_ai_grounded_human_reception.py | 選択内容とsourceの一致を確認し、明示理由に根差した対象についての本人の充足を一文へ実現。 |
| ai/services/ai_inference/emlis_ai_grounded_observation_gate.py | 3役割／2関係と別時点のsource照合、専用有限文法。旧文法とu287前文参照の証明を維持。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 新規7検査、対象となる初回期待内容／本文の更新。歴史fixture・対象外assertion不変。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行owner identityだけを再計算。 |
| ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md | 承認・実装境界、実本文20種類、検証と限界・次の残件。 |

Mashは2026-10-16 09:21:56 JST、u288の「明示された理由・対象・本人の充足を、一つの受け取り内容として保持する限定案」とRule18 §11.3の個別承認対象である旨を引用し、「うん、進めていいよ。」と明示承認した。新private内容契約の限定追加をこの承認で実装した。満足の意味／明示理由認識の既承認は取り直していない。u288の未承認表記は提案時の履歴であり、現行状態は本節を優先する。

source認識・意味候補の採用資格・質問／Move／文数上限、公開API/DTO/DB/RN契約、依存は変更なし。新production file／engine／checker／serviceなし。稼働DB操作・deploy・mergeは0。

RN→API→service/store→保存read→RNと01B/Cの責務は不変。検証は正本06／API handoff u289、進行はweekly§5.6.39。

TECHNICAL_CREDIT / PRODUCT_NOT_CLEAR。初回一体単位未完了、正式受入0/3、candidate_ready=false、automatic_progression=false、Draft/open/unmerged・未配置。


## u294 — 承認済みの未変更received経験を更新後LIMITEDへ保持（2026-10-16 JST）

STRUCTURE_MAP_DELTA_PRESENT。既存6 production ownerへ更新後LIMITEDのprivate局所資格／内容対応を追加。新production file・engine・checker・serviceなし。

| mashos-api相対path | 今回の責務差分 |
|---|---|
| ai/services/ai_inference/cocolon_meaning_experience_engine/contracts.py | versioned private Eligibility／Content、current aggregateへの結合と局所seal、旧型と別の内容検証。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_projection.py | 別欄・完全更新exact1・received未変更を原source／accepted更新から再証明し、source candidate／contribution IDも再導出。現在のMoveへ局所内容を結ぶ。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_response.py | post-selectionでreceived二端点・一対比の局所経験命題を導出。全体aggregateの既存義務は保持。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_composition.py | 局所内容を現在のaggregate claim／trace／preimage／sealへ結んで専用sealを生成。 |
| ai/services/ai_inference/emlis_ai_grounded_human_reception.py | 識別hashを除く既存decision内容fieldを保持した別decision型で局所内容を受け、source資格を再検証して既存exact2経験文法へ渡す。裸形経験文法の対象外となる敬体／SELF topicは従来fallbackを保持。 |
| ai/services/ai_inference/emlis_ai_grounded_observation_gate.py | 局所資格と実本文の本人・役割・肯否・時点・対比を作者なしで照合。旧完全本文も保持。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 新規37検査。先行33（対象12／reader6／改変2／対象外12／legacy等1）＋fallback4。既存2関数の本文期待4条件／inverse変異2条件を新経験句へ更新。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行shared-owner identityを実sourceから再導出。歴史fixture不変。 |
| ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md | 承認・実本文・検証結果と限界・次の残件。 |

2026-10-16 11:26 JST、Mashがu293の限定案の実装を明示承認した。u293の未承認記載は提案時の履歴として保持し、現在の承認状態は本節を優先する。承認対象は、別欄の理由なし満足を当時の否定へ訂正する場合、または理由0/1の評価だけを撤回する場合に、未変更receivedの経験内容を更新後LIMITEDへ結ぶ資格とprivate内容対応の追加である。満足やreceivedの意味を再承認へ戻していない。

予定ownerのemlis_thread_surface.pyは変更不要。全体LIMITED・旧aggregate・意味checkpoint・核／関係・Observation・Move数を保持。RN→API→service/store→保存read→RNと01B/C、公開契約・DB・依存・他中核は不変。新source markerやglobal plan加工は行わない。詳細は05／8/28意味設計／06／API handoff u294、再開順はweekly§5.6.44。

TECHNICAL_CREDIT / PRODUCT_NOT_CLEAR。初回一体単位未完了、正式受入0/3、candidate_ready=false、automatic_progression=false、Draft/open/unmerged・未配置を維持する。限定箇所の保持確認を§9.2/9.4全体、本人実機または正式Product Readの合格へ換算しない。


## u299 — received先行の未成立事項付き満足と旧source互換（2026-10-16 JST）

STRUCTURE_MAP_DELTA_PRESENT。単一の本人received先行証明を既承認の未成立事項付き満足へ接続する。新production file・service・engine・依存なし。fresh sourceの認識は変わるが、意味schema／資格／内容型は追加しない。

| 実file（mashos-api） | 現在の責務差分 |
| --- | --- |
| ai/services/ai_inference/emlis_ai_grounded_observation_plan.py | exact1未成立contextへ既存SELF received先行証明を接続。private旧指定をtyped projectionへ伝搬し、直接final builderの既定は旧認識を維持。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py | original_meaning_planでfresh threadの新認識を明示。旧source世代は未成立継続も旧指定に固定。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py | 完全旧checkpoint／実発行旧質問を既存の全体再導出検証で復元する独立指定。既存互換鎖と別欄の能力を保持。 |
| ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py | 既存attention markerへ有限終端「対比に目を向けています」を接続。単独Moveでも受容文と認識し、既存source-owned全文readerを必須のまま保持。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 逆順同欄12・旧checkpoint11・旧質問3・所有境界・fresh Q1と直接builderの比較を既存回帰へ追加。訂正後の単独ATTENTION6件と意味改変拒否も追加。旧除外期待1件は現在の正例へ移動。 |
| ai/tests/fixtures/cmee_emlis_pre_unfinished_received_context_v1.json | 新規の合成互換fixture。変更前u298の完全checkpoint・本文・状態・理由・実質問／回答を固定。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行sourceから共有owner identityを再導出。既存歴史fixtureは変更しない。 |

原planを受け取る既存projector・thread_surface・本文作者・source-owned有限readerは変更なし。RN→API→service/store→保存read→RN、Piece/Analysisと01B/Cの責務は不変。全体01／current01/04、実装検証06／API handoff u299、再開weekly§5.6.49を参照。PRODUCT_NOT_CLEAR・正式0/3・未配置／未マージ。


## u301 — 初回二経験の意味選択owner（2026-10-17 JST）

2026-10-17 08:16:47 JST、Mashがu300の初回限定案に「うん、進めていいよ。」と明示承認した。Rule18 §11.3の追加資格承認は成立済み。u300の未承認表記は提案時の履歴であり、現在は本節を優先する。同じ承認を再要求しない。

STRUCTURE_MAP_DELTA_PRESENT。新production fileはなく、既存3 ownerの責務差分。

| mashos-api相対path | u301の責務差分 |
| --- | --- |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_projection.py | 既存の成分資格へ初回未成立三点＋received二点を限定接続。Preparedのlegacy/checkpoint、source／Move所有を検査。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_composition.py | admitted sourceから初回三点＋二点、五点三辺二Moveと原文範囲を独立に再確認。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_input_specific_meaning.py | 既存scope_keyへ未成立appraisal成分のsource由来の意味領域を保持し、独立projection検査でも再導出。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 既存検査を対象36生成、二成分所有、作者禁止reader、改変・対象外・legacy境界へ更新。収集件数958→980。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行shared-owner identityだけを実sourceから更新。歴史fixtureは不変。 |
| ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md | 承認、三ownerとなった理由、実本文、検証結果／限界と次工程。 |


資格／closureの二ownerだけでは二つの反応がgeneric scopeで衝突したため、既存source projectionの意味領域保持も必要になった。新source文法・作者分岐・schema／型／registry／上限は追加しない。意味境界は8/28設計u301／05、全18本文比較と29保存DTO・失敗履歴は06／API handoff u301、次はweekly§5.6.51。全体01・current01/04へ同期し、RN→API→service/store→保存read→RN、01B/C・Piece/Analysis・依存の責務は不変。

TECHNICAL_CREDIT / PRODUCT_NOT_CLEAR。初回一体単位未完了、正式受入0/3、candidate_ready=false、automatic_progression=false、Draft/open/unmerged・未配置。NORMALや回帰成功を商品合格へ換算しない。


## u305 — received先行の理由三点認識と限定旧source復元owner（2026-10-17 JST）

STRUCTURE_MAP_DELTA_PRESENT。既存SELF received先行証明を、同一文に閉じた承認済み理由・対象・満足の三点へ接続する。新production fileはなく、既存3 ownerの責務差分である。

| mashos-api相対path | u305の責務差分 |
| --- | --- |
| ai/services/ai_inference/emlis_ai_grounded_observation_plan.py | 単一の本人received先行文によるSELF継続を既存理由三点へ接続。private `legacy_received_reason_context` 指定をtyped projectionへ伝搬し、直接final builderの既定は旧認識（true）を維持する。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py | fresh threadでは新認識（旧指定false）を明示。旧source世代の再導出では旧指定trueを選び、旧Q1で使うsource認識を保持する。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py | 完全旧checkpointの限定旧source再導出を追加し、他欄の現行認識能力を保持する。旧IDへ新意味を貼らず、既存の全体一致検証を通す。 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 理由付きの同欄received先行、SELF／三点所有、旧source復元と質問／保存境界を既存回帰へ追加する。 |
| ai/tests/fixtures/cmee_emlis_pre_reason_received_context_v1.json | 未変更API `5f710c21c065db373ede844106670f7fb41b365d` から取得した合成互換証拠。有効13 rowと、質問未発行で回答を作成できなかった1 attemptを分離して保持する。 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行sourceの共有owner identityを再導出する。歴史fixtureは変更しない。 |

旧checkpoint保存済みの再試行は完全旧解釈、完成済み保存本文は非再生成とする。旧質問と現行質問が全体一致し回答checkpointが未保存の場合は旧版を識別できないため、現行source全体を再検証して新checkpointを作る既存動作を維持する。

意味schema・Move資格・NORMAL資格・作者／reader・公開API／DB／RN・依存とRN→API→service/store→保存read→RNの責務は不変。全体01／current01/04、実本文と検証は06／API handoff u305、次作業はweekly§5.6.55を参照。次は訂正後に未変更の理由付き満足が「理由への注意」へ弱まる内容欠落を意味選択から照合する。PRODUCT_NOT_CLEAR、初回一体単位未完了・正式受入0/3・candidate_ready=false・automatic_progression=false・未配置／未マージを維持する。


## u307 — 未変更理由三点の更新後局所内容（2026-10-17 JST）

u306限定案はMash承認済み。STRUCTURE_MAP_DELTA_PRESENT。新fileなし。既存6 ownerの責務を次のとおり追加する。

| mashos-api相対path | 更新後の責務 |
| --- | --- |
| ai/services/ai_inference/cocolon_meaning_experience_engine/contracts.py | 理由三点用private Eligibility／Content、全体aggregateとの厳密結合とseal。旧初回型／received型は維持 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_projection.py | 元source／単一received反応訂正から資格を再導出。private aggregate projectorとpublic carrier接続を分離し、全selectedを再導出照合 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_response.py | 選択済み三binding／source qualifier／候補・contribution／二方向関係から局所内容を導出 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_composition.py | 旧LIMITED投影・claim／traceへの結合、private内容封印、論理契約二型追加（74→76） |
| ai/services/ai_inference/emlis_ai_grounded_human_reception.py | 別selected carrierのsource再検証と、未変更の理由・対象・本人内の充足を既存経験文法へ接続 |
| ai/services/ai_inference/emlis_ai_grounded_observation_gate.py | 新局所型の有限reader分岐、三点・時点・実本文を独立逆検証 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 6配置／二時点・他理由対象・程度・資格除外・改変／再封印拒否・作者禁止readerの回帰 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行共有ownerのidentityのみ再導出。歴史fixture不変 |

既存emlis_answer_updateの義務証明は読取再利用・未変更。公開API／DB／RN、各上限、01B/C・Piece/Analysis責務、新依存は不変。実本文・保存40 DTO・互換・検証は06／API handoff u307、意味契約は05／8/28設計u307、次作業はweekly§5.6.57。PRODUCT_NOT_CLEAR・正式0/3・candidate_ready=false・automatic_progression=false・未配置。

## u315 — 追加回答後も理由付き満足を経験として保持（2026-10-17 JST）

Mashが2026-10-17 16:46:17 JSTにu314限定案を承認した。別received経験への一度の追加回答（現在／当時×肯定／否定）後も、未変更の理由・対象・満足を満足Moveの局所経験内容として保持する。全体LIMITED・aggregate・意味核辺・checkpoint・Observation・元反応／回答本文は不変。旧u307の当時肯定REVISE資格を維持する。

| 既存path（mashos-api） | 今回の責務差分 |
| --- | --- |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_projection.py | `_retained_reasoned_add_duties`で限定ADDを実sourceから証明。旧REVISE資格と併存させ、既存局所content／carrierへ接続。全source／selected再導出を維持 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/contracts.py | Eligibilityの説明docstringのみ訂正後から限定別更新へ整合。型／field／validatorは不変 |
| ai/tests/test_cmee_emlis_result_appraisal.py | ADD48、独立時点／程度、原意味不変、除外、再封印／source改変拒否、作者禁止finite reader |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行runtime owner identityのみ再導出。language identityと歴史fixtureは不変 |

`STRUCTURE_MAP_DELTA_PRESENT`。既存private V1三型を再利用し、field／schema／manifest／validatorは変更しない。`emlis_answer_update.py`のREVISE証明、作者／有限reader、公開API／DTO／DB／RN、各上限、新file／依存、01B/C・Piece/Analysisの責務は不変。完成済み保存本文は非再生成、未完成current checkpointは同じ受理意味・operation・既存履歴を保って現行本文へ再開する。

最新結果は06／API handoff u315、再開順はweekly §5.6.65。今回の追加承認を待ち直さない。説明の長さ・対象／語尾の反復など本文品質は残件。PRODUCT_NOT_CLEAR・初回一体単位未完了・正式0/3・candidate_ready=false・automatic_progression=false・Draft/open/unmerged・未配置。

## u317 — 丁寧形received先行の同一欄で後続評価を保持（2026-10-17 JST）

同じmemo／memo_actionの先頭にある単一SELF received経験のnegative過去丁寧反応を伝聞導入へ誤分類するsource認識を修復。既存本人受け手証明と実source「かったです」を条件に後続評価を保持する。共有report helper、作者／reader・意味資格／内容型・公開API／DB／RNは不変。currentの核辺・checkpoint・選択／Observationは修復に伴い変化する。

`_legacy_received_report_context` により旧sourceを完全再導出し、保存checkpoint／canonical questionと完全一致した場合だけ復元する。旧IDへcurrent意味を付け替えず、direct builderと以前のsourceモードを維持する。既存3owner内、production file／依存追加なし。STRUCTURE_MAP_DELTA_PRESENT。01B/CとPiece/Analysisの責務差分なし。

| 既存path（mashos-api） | 今回の責務差分 |
| --- | --- |
| ai/services/ai_inference/emlis_ai_grounded_observation_plan.py | 後続評価のreport拒否を既存SELF received証明の後へ配置。negative過去丁寧反応の誤拒否だけを閉じ、旧sourceモードを導出経路へ通す |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py | current source導出へフラグを渡し、以前のsourceモードは旧report拒否を維持 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py | u316の完全な旧sourceを再導出し、旧checkpoint／canonical questionの完全照合時だけ復元 |
| ai/tests/test_cmee_emlis_result_appraisal.py | 原文slice／所有／時点・更新・非対象・旧checkpoint14・保存非再生成を検証。受容保持10例は未解消 |
| ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json | 現行共有owner identityを再導出。歴史fixture不変 |

主回帰1,584 pass、104比較36変更68同一、service52case／RN78 DTO、旧checkpoint14を確認。実本文・互換・失敗を含む検証は06／API handoff u317、最新再開順はweekly §5.6.67。次は同一欄の評価訂正／撤回後の受容保持10例を既存条件と比較する。現在形／名詞形／肯定反応、本文自然さ・周辺既存失敗も未解消。PRODUCT_NOT_CLEAR・初回一体単位未完了・正式0/3・candidate_ready=false・automatic_progression=false・Draft/open/unmerged・未配置。

## u318追跡 — source作用域とLIMITED参照（2026-10-17）

製品構造は `STRUCTURE_MAP_DELTA_NONE`。既存grounded planの有限認知・contrast原文照合と選択後Reception binder内部を修復した。新production file/owner/経路はない。

| 追加ファイル | 責務 |
|---|---|
| mashos-api/ai/tests/test_cmee_emlis_source_scope_regressions.py | 推量の制約誤認、明示SELFの未確定認知と報告／他者topic拒否、LIMITED basis必須coverage、短いcontrastと一意marker原文証明を検証 |

実装・未加工全文・保存検証・未完了は [u318監査](audits/emlis_ai/Cocolon_EmlisAI_u318_SourceScope_and_LimitedBinding_20261017.md)。原03の作用域、汎用受容、旧失敗checkpoint等を残し、商品完了へ読み替えない。

## u319追跡 — 既存source・本文検査・checkpoint責務（2026-10-17）

`STRUCTURE_MAP_DELTA_NONE`。新production owner/公開経路はない。grounded observation planは有限経験/外側感情と内側推量、実contrast markerを証明。sentence surfaceは時点を加えない既存対比形、observation gateは両端原文と選択済みappraisalの独立文法、emlis_question/answer_updateは旧source checkpointの完全再導出を担当する。

既存 `mashos-api/ai/tests/test_cmee_emlis_source_scope_regressions.py` に、主体/推量/時制、NORMAL/LIMITED本文、44本文変異、旧checkpoint全payload・意味digest、既存nominal受容保持を追加。145件。現行identity fixtureのみ更新し、歴史的proofは変更しない。

最新実装・本文・検証は [u319監査](audits/emlis_ai/Cocolon_EmlisAI_u319_CognitiveFeelingScope_and_ContrastBody_20261017.md)。元10例9→10、固定100は71で全record一致。次は入力固有受容と他の主体/時点誤認、E05/E06。PRODUCT_NOT_CLEAR・初回一体単位未完了・未配置。

### u320 file追跡 — 内側時間主題と旧u319 checkpoint（2026-10-17）

既存source plan／question original plan入口／answer updateの旧意味再導出を修復。製品owner・契約・公開経路の追加はなくSTRUCTURE_MAP_DELTA_NONE。既存`ai/tests/test_cmee_emlis_source_scope_regressions.py`が時間主題・動詞活用／人topic境界・作者禁止reader・旧意味復元を確認する。新規`mashos-api/ai/tests/fixtures/cmee_emlis_u319_temporal_topic_checkpoint_v1.json`はd780c315から取得した4件の完全checkpoint／意味hash／public結果を保持し、旧意味への正確な再導出を検査するfixtureである。現行identity fixtureだけ再導出、歴史fixtureは不変。実測・本文と残件はu320監査と正本06 u320を参照。


### u324 file追跡 — 現在感情と本人の理由不明・旧u323 checkpoint（2026-10-18）

- `mashos-api/ai/tests/fixtures/cmee_emlis_u323_feeling_reason_checkpoint_v1.json`：新規。API `a1925d5d761b397aee9f939fc42a1d9305c4a19f` から修正前に取得した4件。原memo、完全checkpoint、public結果、元の核／関係SHA-256を保持。旧UNAVAILABLE2件／LIMITED2件。旧IDへ新しい意味を付け替えない互換検証に使用する。
- `mashos-api/ai/tests/test_cmee_emlis_source_scope_regressions.py` と `test_cmee_emlis_q3_thread.py`：既存fileの回帰・保存再表示を拡張。
- 製品変更は既存Plan／HR／surface／Gate／emlis_question／emlis_answer_updateの6owner内。新しい意味型・公開経路・保存schemaは追加しない。STRUCTURE_MAP_DELTA_NONE。
- 結果・未加工本文・限定範囲：[u324監査](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u324_FeelingReasonSelfScope_20261018.md)。


### u325 file追跡 — 選択済み不明対象の受け取り（2026-10-18）

- `mashos-api/ai/tests/fixtures/cmee_emlis_u324_unknown_object_checkpoint_v1.json`：新規。修正前API `0f78a0e25dd74a40aaedb28327658799ee1aa43b` の10件、完全checkpoint・核辺hash・選択内容hash・公開本文・question decisionを凍結。意味不変と参照方式のidentity更新を区別する。
- 既存Plan／HR／Gate／emlis_answer_update／emlis_thread_source内の修復。ThreadEvidenceSpanResolverは既存qualified evidenceの全fieldを読むread-only methodを追加。意味型・公開API・保存schema・経路は不変、STRUCTURE_MAP_DELTA_NONE。
- 検査は既存 `test_cmee_emlis_source_scope_regressions.py` に追加。[u325監査](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u325_UnknownObjectReception_20261018.md)に全文・残件・検証限界を記録。


### u326 file追跡 — 単独不明対象の受け取り（2026-10-18）

`STRUCTURE_MAP_DELTA_NONE`。単独memoの現在SELF・negative・uncertainを対象とする既存3製品owner内の修復であり、新製品file・公開経路・意味型・保存契約は追加しない。01B／01C、Piece／Analysisの責務差分はない。

| path（mashos-api） | 今回の責務差分 |
|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 単独不明の全文source・一核一span・現在SELF・関係なしを証明し、既存選択Moveの参照方式だけを明示へ変更。二核resolverの既定動作は維持 |
| `ai/services/ai_inference/emlis_ai_grounded_human_reception.py` | 一核専用の内部文法とslot／profileを照合し、既存UNFINISHED_OPENNESS／LEAVE_UNFINISHEDの内容を本人・対象・程度・否定付き有限文へ実現 |
| `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | 本人表現を原文へ逆復元し、対象節全体を作者非依存で照合。単独処理はsource証明済みの一核だけに限定 |
| `ai/tests/test_cmee_emlis_source_scope_regressions.py` | 既存fileへ49件追加。凍結意味・本人／対象／程度／否定・source対象外・空白・IR偽装を確認 |
| `ai/tests/fixtures/cmee_emlis_u325_single_unknown_checkpoint_v1.json` | 新規。修正前API `8df8bdb1d0076fe6c7895b7c423aa144182af4e6` の合成10件を凍結し、完全checkpoint・核辺・選択内容の同一性と、Reception差分／Observation・問いの保持を比較 |
| `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 既存の現行共有owner identityを実sourceから再導出。歴史fixtureは変更しない |

source_scope最終341 passed。実SQL／RPC serviceとAPI client／hook／Modal native stubは同じ6 DTOで保存本文・close/reopenを確認。別集合のQ3対照48 passed／既知3 failed、application54 passed、現行identity1 passedを含め、計444 passed／既知3 failed。全件成功ではない。最終source identityとGitHub反映commitは [u326監査](audits/emlis_ai/Cocolon_EmlisAI_u326_SingleUnknownObjectReception_20261018.md) を参照する。独立行動併記時の選択欠落は未修正。商品NOT_CLEAR・正式0/3・未配置を維持する。


### u327 file追跡 — 不明対象と別欄の独立行動を保持（2026-10-18）

`STRUCTURE_MAP_DELTA_NONE`。既存6製品owner内で、原source証明・既存選択・本文・旧意味再導出を接続する修復。新しい製品file／schema／公開経路はなく、01B／01C・Piece／Analysisの責務差分もない。

| path（mashos-api） | 今回の責務差分 |
|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | whole SELF current wh不明と別欄の独立実行済み行動を証明し、既存3属性と二責務選択へ接続。optional bounded cross-field wish／attempt誤関係だけを除去 |
| `ai/services/ai_inference/emlis_ai_grounded_human_reception.py` | 選択済みMATERIAL_WEIGHT／RECEIVE_AS_MATERIALのまま不明対象を有限文へ保持。u326の一核限定UNFINISHED文法は維持 |
| `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | 本人・対象・程度・否定と実本文を作者非依存で照合し、片方欠落や別内容への変更を拒否 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py` | 現行thread原意味準備へ今回修復を接続し、旧source再導出と分離 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | 旧u326 checkpointを完全な旧意味の再導出とidentity一致で復元 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_engine.py` | Q1公開経路で準備済みplanを本文生成へ維持。Q3と同じ原意味を使用 |
| `ai/tests/test_cmee_emlis_source_scope_regressions.py` | 既存fileへ94件追加。20入力×2公開経路、旧checkpoint20、本文改変18、対象外16 |
| `ai/tests/fixtures/cmee_emlis_u326_unknown_action_checkpoint_v1.json` | 新規。API `56fcaaec23a516de70fcc86f8f0caca94b86bc50` の合成20件を凍結し、旧意味・旧本文の保持と現行生成差分を比較 |
| `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 既存の現行source identityを再導出。凍結済み歴史fixtureは不変 |

source_scope435 passed、Q3対照54 passed／既知3 failed。別集合のapplication54 passed・identity1 passedを含め、計544 passed／既知3 failed、skip 0。実SQL／RPC serviceと実DTOを渡すAPI client／hook／Modal native stub各6件の全文・close/reopenを確認。全件成功や商品品質合格とはしない。最終結果・未加工20全文・意味世代の境界は [u327監査](audits/emlis_ai/Cocolon_EmlisAI_u327_IndependentUnknownActionReception_20261018.md) を参照する。


### u328 file追跡 — 同欄の本人不明と証明済み行動の本文停止修復（2026-10-18）

STRUCTURE_MAP_DELTA_NONE。製品4fileは既存のobservation_plan／human_reception／observation_gate／emlis_thread_engine。source証明・二責務選択・有限本文／独立reader・Q1接続を修復し、元のmemo欄と全sourceを保持する。新製品owner、契約、経路はない。01B／01C、Piece／Analysisに責務差分なし。

既存 `ai/tests/test_cmee_emlis_source_scope_regressions.py` に61件を追加。新規 `ai/tests/fixtures/cmee_emlis_u327_same_field_unknown_action_checkpoint_v1.json` は修正前API d2cdc5d…の合成16例のcheckpoint／核辺／選択／本文・問いを凍結。既存 `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` は現行sourceから再導出。歴史fixtureは不変。

source_scope496、Q3対照54＋既知3失敗、application54、identity1。合計605成功／既知3失敗、skip0。実service/PGlite7ケース、現行API client／hook／Modal native stub7ケースで保存・GET・元入力・履歴・再表示を確認。本人実機ではない。8本文停止を修復したが、机の8例は誤認・未提供を含め不変。深い受容・問い・商品品質は未完。

詳細・未加工16例・実装境界：[Cocolon_EmlisAI_u328_SameFieldUnknownActionReception_20261018.md](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u328_SameFieldUnknownActionReception_20261018.md)。


### u329 file追跡 — 同欄の行動誤分類と派生関係修復（2026-10-18）

STRUCTURE_MAP_DELTA_NONE。既存 `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` 一つのowner内で、原文の二完全文と単一目的語＋既存過去述語を証明し、value/eventの誤分類をaction/fact/pastへ修復。誤派生関係はID・端点・根拠を保持してoptional uncertaintyへ戻す。作者・reader・Q1/Q3はu328接続を継承し、新製品owner・schema・API/DB/RN変更なし。01B/01Cと他中核は構造差分なし。

既存 `ai/tests/test_cmee_emlis_source_scope_regressions.py` へ112検査を追加。旧拒否2例はlegacy planと明示し、17例の現行拒否は維持。新規 `ai/tests/fixtures/cmee_emlis_u328_same_field_action_checkpoint_v1.json` はAPI f58e6ba…の合成24例を凍結。既存 `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` は現行identity再導出。既存歴史fixtureは未変更。

source_scope608、Q3対照54＋既知3失敗、application54、identity1。計717成功／既知3失敗、skip0。実service/PGlite7件と同じDTOのAPI client/hook/Modal7件で保存・再表示を確認。24例の本文・行動意味を修復したが、反復・定型・深さ・問いは未完。

詳細・未加工24例・検証境界：[Cocolon_EmlisAI_u329_SameFieldFiniteActionRecognition_20261018.md](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u329_SameFieldFiniteActionRecognition_20261018.md)。


### u330 file追跡 — scalar不明と別欄行動の受け取り欠落（2026-10-18）

既存 `emlis_ai_grounded_observation_plan.py` の完全source証明・optional関係処理と、`cocolon_meaning_experience_engine/emlis_thread_engine.py` のQ1準備済み意味接続を修復。HR／Gateのwh専用表面は維持し、対象なし不明へ対象・理由を補わない。新しいarchitecture ownerはなくSTRUCTURE_MAP_DELTA_NONE。

`test_cmee_emlis_source_scope_regressions.py`へ90検査追加、新規 `fixtures/cmee_emlis_u329_scalar_action_checkpoint_v1.json`に変更前合成20例、現行 `fixtures/cmee_emlis_q1_shared_owner_identity_v1.json`を再導出。歴史fixture・既存assertionは未変更。本文8修復・12完全record一致、旧20checkpoint・保存6／RN6確認。既存handoff・正本06・07・weeklyへ同期。

詳細・未加工本文・検証境界：[Cocolon_EmlisAI_u330_ScalarUnknownActionRetention_20261018.md](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u330_ScalarUnknownActionRetention_20261018.md)。


### u331 file追跡 — 明示対比の2対象を保持（2026-10-18）

既存OPで原文fieldと2span・required関係を証明してreferenceを明示化、HRで有限節を名詞化、Gateで両端と対比構造を本文から独立読解、thread_engineでQ1も準備済みplanへ接続。新規architecture ownerはなくSTRUCTURE_MAP_DELTA_NONE。新規test `ai/tests/test_cmee_emlis_contrast_reference.py` と変更前20例 `ai/tests/fixtures/cmee_emlis_u330_contrast_reference_v1.json` を追加。現行shared-owner identityを再導出。既存handoff／06／07／weeklyに結果、監査に全本文と新主観選択の未採用案を記載。意味型・選択契約・公開API／DB／RNは不変。

詳細・全20例・次の未採用案：[Cocolon_EmlisAI_u331_ConcreteContrastReception_and_NextDecision_20261018.md](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u331_ConcreteContrastReception_and_NextDecision_20261018.md)。


### u332 file追跡 — source根拠付き二反応

既存製品8ownerに内部内容契約を追加。RN→API→service/store→保存read→RNは不変。新production file0。01B／01C、Piece／Analysis、公開API／DBの責務差分なし。

| mashos-api exact path | u332の責務差分 |
|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 二source役割・全field帰属・joint資格／origin・限定訂正grammar |
| `ai/services/ai_inference/emlis_ai_grounded_human_reception.py` | 選択済み二facetと訂正内容の有限本文 |
| `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | source役割と二facetの独立読解、旧generic救済の禁止 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/contracts.py` | 内部新content、閉じた検証、source qualifier搬送、LIMITED導出 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_composition.py` | NORMAL導出、manifest77・current identity |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py` | current意味と旧source modeの版分離 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | 旧checkpoint全体復元、訂正／撤回と残存責務 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_engine.py` | Q1のcurrent／legacy準備済み意味経路 |
| `ai/tests/test_cmee_emlis_relief_cognition.py` | 新規82検査：source、本文、作者禁止変異、更新、旧意味互換 |
| `ai/tests/fixtures/cmee_emlis_u331_relief_cognition_v1.json` | 新規：変更前u331合成20入力の記録 |
| `ai/tests/test_cmee_emlis_result_appraisal.py` | 現行manifest件数76→77のみ |
| `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 現行18payload／9ownerを再導出 |
| `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 最新契約・実装・検証・残件引継ぎ |

詳細・未加工本文・検証境界：[Cocolon_EmlisAI_u332_SourceBoundRelief_and_Listening_20261018.md](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u332_SourceBoundRelief_and_Listening_20261018.md)。

## u333 — 明示SELF継続修復のfile地図（2026-10-18）

STRUCTURE_MAP_DELTA_NONE。production owner・意味型・公開経路の追加なし。

| 実path | 変更責務 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 局所SELF継続証明・旧source mode。既存作者／readerは変更なし |
| `mashos-api/ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py` | 現行／全旧source modeの明示伝播 |
| `mashos-api/ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | 旧u332 checkpoint完全復元の優先経路 |
| `mashos-api/ai/tests/test_cmee_emlis_self_continuation.py` | 新規95検査。source・Q1/Q3・NORMAL/LIMITEDの独立変異・5更新・8SQL保存・帰属 |
| `mashos-api/ai/tests/fixtures/cmee_emlis_u332_self_continuation_v1.json` | 凍結u332実engineで取得した26例のcheckpoint／plan／selected・停止／本文・問い |
| `mashos-api/ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 現行source ASTからlanguage/runtime identityを再導出。歴史fixtureは不変 |
| `mashos-api/ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 修復・限界・具体的な次の承認案の所在 |

詳細：[Cocolon_EmlisAI_u333_SelfContinuation_and_IndependentUnknown_Boundary_20261018.md](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u333_SelfContinuation_and_IndependentUnknown_Boundary_20261018.md)。独立不明の保持契約試作は撤回済みで、上表の採用差分に含めない。

## u334 — 二反応と独立不明のfile地図

STRUCTURE_MAP_DELTA_PRESENT。新production file0。01B／01C、Piece／Analysis、公開API／DB責務の差分なし。

| mashos-api exact path | 責務差分 |
|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 全field・全spanの3対象証明、独立不明の版付き資格、二move、旧mode |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/contracts.py` | 新RetainedReliefCognitionEligibilityV1／ContentV1、全体claimとlocal既存contentの閉じた検証・seal |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_response.py` | 既存候補から局所二basisの承認済みcontentを導出 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_composition.py` | 一claim／trace／projectionを検証してlocal contentを封印、manifest79 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_projection.py` | 全寄与を二moveへ分配、現行初回資格、全source／aggregate再導出でcarrier全体を照合 |
| `ai/services/ai_inference/emlis_ai_grounded_human_reception.py` | 新decision版を私有入力として検証、既存unknown／二反応作者へ接続 |
| `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | local二反応＋独立不明の独立読解、facet欠落のgeneric救済を禁止 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py` | currentと全歴史source modeを分離・伝播 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | u333 checkpoint完全復元。既存Premium focus再構成でも証明済み二moveを維持 |
| `ai/tests/test_cmee_emlis_relief_unknown.py` | 新86検査、本文・source反例・作者禁止変異・再seal攻撃・旧18復元・manifest・3tier保存 |
| `ai/tests/fixtures/cmee_emlis_u333_relief_unknown_v1.json` | u333実engineから取得した合成18例の完全checkpoint／plan・selected hash／本文・問い・停止 |
| `ai/tests/test_cmee_emlis_relief_cognition.py` | 同じ二facetの検査helperを明示した新sidecarにも対応、現行manifest件数79 |
| `ai/tests/test_cmee_emlis_result_appraisal.py` | 現行manifest件数77→79のみ |
| `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 現行9ownerのASTからidentityを再導出。歴史証拠は変更しない |
| `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 承認・実装・実本文・互換・残件の引継ぎ |

詳細：[Cocolon_EmlisAI_u334_ReliefCognition_and_IndependentUnknown_Retention_20261018.md](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u334_ReliefCognition_and_IndependentUnknown_Retention_20261018.md)。

## u335 — 独立不明source修復のfile地図

新production file0。既存3owner。01B／01C、Piece／Analysis、公開API／DB責務の差分なし。STRUCTURE_MAP_DELTA_NONE。

| mashos-api exact path | 差分 |
|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 全三対象を再証明した場合だけreflexive核とlexical conflict辺を補正。旧source modeを保持 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py` | 現行と全歴史source modeの伝播 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | u334 checkpoint完全復元をu333以前より先に試行 |
| `ai/tests/test_cmee_emlis_relief_unknown_source.py` | 現行40・旧40完全record、Q1/Q3・作者禁止本文変異・偽provenance境界 |
| `ai/tests/fixtures/cmee_emlis_u334_relief_unknown_source_v1.json` | 凍結u334実engineの合成40例、checkpoint／plan・selected hash／本文・問い・停止 |
| `ai/tests/test_cmee_emlis_relief_unknown.py` | u334対照2例を旧checkpoint指定で検証。同じ期待値・全assertionを維持 |
| `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 最終source ASTからcurrent identityを再導出 |
| `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | source修復・互換・保存・未解決と短文化限定案への引継ぎ |

詳細：[Cocolon_EmlisAI_u335_ReliefUnknown_SourceRepair_and_Anaphoric_Proposal_20261018.md](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u335_ReliefUnknown_SourceRepair_and_Anaphoric_Proposal_20261018.md)。

## u336 — 実Observation共同保持のfile地図

新production file0、既存8file。01B／01C、Piece／Analysis、API／DB責務の差分なし。STRUCTURE_MAP_DELTA_NONE。

| mashos-api exact path | u336の差分 |
|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 既存pairの照応候補資格版、既存reference policyのANAPHORIC化、歴史source mode |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py` | 現行と全歴史flagの伝播 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | u335完全復元を先に試行、pair失効時に照応資格も消去 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_projection.py` | u335復元時は既存u334三対象carrier資格を維持 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_surface.py` | 既存行ownerで実Observationを先行生成、同じ文を作者へ渡す |
| `ai/services/ai_inference/emlis_ai_grounded_human_reception.py` | 既存唯一作者／replay／検証へ実Observationを渡し、適格時のみ短形 |
| `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | live selected pair→実Observation exact／一意証明→二facet短参照の独立読取 |
| `ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py` | 既存行生成の先行呼出し、最終bytes一致、実本文由来の検証、傾聴終止の検出 |
| `ai/tests/test_cmee_emlis_relief_anaphora.py` | 現行40、旧u33540、自然変種・二作者禁止変異・契約改変・全文fallback |
| `ai/tests/fixtures/cmee_emlis_u335_relief_anaphora_v1.json` | 凍結0717bd4dの全40record |
| `ai/tests/test_cmee_emlis_relief_cognition.py` | 承認済み共同保持と実本文変異へ期待を移す |
| `ai/tests/test_cmee_emlis_self_continuation.py` | SELF原文は実Observation、本文全体で主体／scope変異を拒否 |
| `ai/tests/test_cmee_emlis_relief_unknown.py` | 共同保持、独立不明、歴史controlの明示復元 |
| `ai/tests/test_cmee_emlis_relief_unknown_source.py` | u334 historical control保持と現行共同保持変異 |
| `ai/tests/test_cmee_emlis_source_scope_regressions.py` | pairのみ共同保持へ変更、古いno-op変異を実際の短形変異へ置換 |
| `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 最終sourceからcurrent identity再導出 |
| `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 承認範囲・実本文・検査・残件・PR反映への引継ぎ |

詳細：[Cocolon_EmlisAI_u336_ActualObservation_Anaphoric_Reception_20261018.md](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u336_ActualObservation_Anaphoric_Reception_20261018.md)。


## u337 — 残存安堵の本人の人称修復のfile地図

新production file0、既存production6file。01B／01C、Piece／Analysis、公開API／DB責務の差分なし。STRUCTURE_MAP_DELTA_NONE。

| mashos-api exact path | u337の差分 |
|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 元の適格pairで明示SELF安堵へ表現資格版を付ける。新意味型なし |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py` | 現行と全歴史source modeへ旧表現flagを伝播 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | u336の旧checkpoint全体を先に再導出して復元 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_projection.py` | 表現だけのlegacy flagで旧u336独立不明carrierを失効させない |
| `ai/services/ai_inference/emlis_ai_grounded_human_reception.py` | 原文の明示SELFを再証明し、単独残存安堵の先頭人称だけ「あなた」に変換 |
| `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | 共通appraisalの選択basis・live核・全原文から独立に人称を検証。汎用fallbackによる迂回禁止 |
| `ai/tests/test_cmee_emlis_relief_self_recipient.py` | 現行初回40／更新21、旧61完全復元、二作者禁止変異、偽根拠、資格対照、SQL保存再表示 |
| `ai/tests/fixtures/cmee_emlis_u336_self_recipient_v1.json` | 無変更u336 commit 703991eの実engineから取得した合成61完全record |
| `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 最終source ASTからcurrent identityを再導出。過去の凍結fixture不変更 |
| `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 実装・検証・残件の再開先 |

詳細：[Cocolon_EmlisAI_u337_SelfRecipient_AfterPairRevision_20261018.md](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u337_SelfRecipient_AfterPairRevision_20261018.md)。


## u339 — 過去SELF不明の限定修復のfile地図

STRUCTURE_MAP_DELTA_NONE。既存production9file、新production file0。01B／01C・Piece／Analysis・公開API／DBの責務差分なし。新test1・凍結fixture1と既存test4／current identityを以下に記録する。

| mashos-api exact path | u339の差分 |
|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 完全memo・一意の後置SELF・過去陰性wh節を再証明しsource_past_self_unknown:v1を付す。単独または完全pair末尾のみ |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/contracts.py` | 新資格・同一sourceに限るpast unknown binding。UNFINISHEDと既存enumを維持 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_projection.py` | 初回限定・完全source・唯一のUNKNOWN境界とspanを再証明。既存三対象保持を限定拡張 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py` | 新source modeと全歴史modeを分離。問いの範囲追加なし |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | 旧checkpoint全体の一致から旧意味・旧本文／停止を復元 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_engine.py` | 新資格付き初回はQ1入口もprepared planへ接続 |
| `ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py` | その時の認識として完全原文を示すObservation |
| `ai/services/ai_inference/emlis_ai_grounded_human_reception.py` | 過去の具体対象・程度・肯否を保持しSELFだけ聞き手の人称へ変換 |
| `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | 作者を呼ばない原文復元、selected内容／past軸の照合、専用reader失敗時のfallback拒否 |
| `ai/tests/test_cmee_emlis_past_unknown.py` | 新14／不変30、旧44完全復元、本文・選択・境界改変、SQL保存を検証 |
| `ai/tests/fixtures/cmee_emlis_u337_past_unknown_v1.json` | 無変更c26ece4から実行取得した合成44record。歴史原本 |
| `ai/tests/test_cmee_emlis_source_scope_regressions.py` | 単独過去1行の旧admission境界をu337凍結checkpointへ固定。現在の適格性は新testで確認 |
| `ai/tests/test_cmee_emlis_relief_anaphora.py` | 過去3歴史対照だけ旧checkpointを明示。既存assertion維持 |
| `ai/tests/test_cmee_emlis_relief_self_recipient.py` | 過去3初回歴史対照だけ旧checkpointを明示。更新の現在対照維持 |
| `ai/tests/test_cmee_emlis_relief_unknown.py` | 当時除外していた過去1行を歴史checkpointへ固定。既存assertion維持 |
| `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 最終sourceからcurrent identityを再導出。歴史fixtureは書き換えない |
| `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 今回の承認・結果・残件・再開先 |

詳細：[Cocolon_EmlisAI_u339_PastSelfUnknown_Implementation_20261018.md](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u339_PastSelfUnknown_Implementation_20261018.md)。


## u340 — 別時点contrastの表示修復

STRUCTURE_MAP_DELTA_NONE。新production owner／公開経路なし。01B／01Cの責務追加なし。Analysisの既存OP依存は維持し、既存builderは変更しない。

| mashos-api exact path | 今回の責務 |
|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 既存u331二対象のsource証明を再利用し、原文prefixと既存past／presentが一致するrequired contrastのみ表示義務に指定。認識・選択・builder不変 |
| `ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py` | 適格な単一対比行を完全原文2対象＋既存「一方で」文法で表示 |
| `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | 同じ対象の最終本文を作者なしで読む。原文両端・順序・一文全体を照合し同時性／因果／追加主張を拒否 |
| `ai/tests/test_cmee_emlis_separate_time_contrast.py` | 新72検査。12原本比較・Q1／Q3・checkpoint・作者禁止変異・資格偽装・同endpoint余剰辺・SQL保存 |
| `ai/tests/fixtures/cmee_emlis_u339_separate_time_contrast_v1.json` | 無変更d28e7bcから実行取得した12合成record。旧意味・旧本文の変更しない比較資料 |
| `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 最終sourceからcurrent identityのみ再導出。歴史identityは変更しない |
| `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 今回結果と資格外残件の再開位置 |

詳細：[u340監査](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u340_SeparateTimeContrast_20261018.md)。


## u341 — 「とても」をtopicの「も」と誤判定する参照を修復（2026-10-18）

ユーザーの残件作業・中断後再開の指示に基づき、全体設計01、全file地図01A、current_structure、canonical 06、最新weeklyとAPI handoffを確認した。u340反映済みHEADはAPI `741463920723bae5ac81d5052a779ca838778cfe`、Cocolon `5134acb7200ed635fe688332acc4410eb87e48ee`。既存設計内の参照実現修復として、Rule18の通常修復範囲で進めた。新しい意味資格・主観契約の拡張へ承認を流用していない。

既存OPの二対象contrast証明が「とても」の「も」をtopicとして除外していた。既存有限述語の直前にある一つの「とても」だけを検査用コピーから除き、他のtopic・主体・条件・引用・敬体の制限を維持した。原文は削らない。無変更u340から凍結した22入力の意味checkpoint・核・辺・selected.decisions・問い・reasonは不変。8入力はreference_modeだけを具体参照へ変え、派生参照と本文を修復した。plan全体／selected全containerが不変という主張はしない。対照14入力はplan・selectedまたは同じ停止・全artifactまで不変である。

8入力のReceptionは両方の原文を「こと」で受け取り、程度・肯否・時点を保持する。うち明示past/presentの6入力はu340の既存「一方で」表示へ自然に接続し、誤った「同時」を除去した。時点未指定の2入力は参照だけを修復し、Observationの旧「同時」は残る。不変の他者・引用・敬体等の旧誤読も品質合格には数えない。同じ旧意味checkpointでの修復本文とQ1/Q3の本文一致を確認した。

検証は重複除外 **228 passed／2 failed／skip0**（新54、関連173成功・2失敗、current identity1成功）。2失敗はu340 `degree` の旧plan完全一致要求（今回reference_mode修復との差）とu331 `distinct_times` の旧「同時」本文一致要求（u340から既知）。旧fixture／assertionは改変・xfail・skipしていない。前回の `explicit_self` 旧停止期待は今回の選定集合に含まず、解消済みとは扱わない。全suite GREEN・製品完成ではない。

実service＋隔離PGlite SQL/RPC12ケース（2原文×3tier×現行／合成旧完成）で、生成禁止engineによるGET／startの全DTO一致を確認。同じ12DTOを現行API client／hook／Modalへ通し、GETのみでclose/reopen各2回、全DTO・本文・original・timeline・質問／回答欄なしを確認した。旧完成は旧helper結果を生成時だけ局所再現し、開始原本の実本文と完全一致させた合成検査。本番旧DB・中断retry・本人実機の証明ではない。HTTP／Auth／nativeはstubである。

STRUCTURE_MAP_DELTA_NONE。既存production1file内の参照証明だけを変更。new production0、公開wire／DB／RN／依存／Safety／releaseは不変。新test1・開始原本fixture1・current owner identityを追跡した。Analysisは同じOP builderから核辺等を読むがreference_mode／human_reception_planを参照しないことをsource読取で確認した。Analysis全suiteの実行済みとはしない。作者とreaderはsource資格helperを共有し、reader変異20では作者呼出なしに最終本文の程度位置・時点・主体・肯否・両端・追加主張を検査した。

逆順「今日は疲れている。でも、昨日は友達と話せて嬉しかった。」は未提供のまま。明示contrastに加えてconflict observerが後半positive→前半limitの近接由来 `attempt_and_block` をrequiredで生成し、`RECEPTION_BINDING_CONFLICT_STOP`となる。参照helperの2辺拒否は正当であり緩めない。次は、完全二文・本人・既存有限述語・明示contrastを証明し、同じ両端を逆向きに結ぶ `conflict.eN` 単独／arcなし／endpoint span一致の誤派生辺だけを既存非required `uncertain_connection`へ戻す案を検討する。これは未実装。核辺とcheckpoint identityが変わるため、旧checkpoint後の復元は旧意味・旧未提供状態を保持し、新意味を旧IDへ付け替えない互換設計が必要である。

必要性=DIRECT_PRODUCT_OR_ACCEPTANCE_WORK、primary outcome=TECHNICAL_CREDIT。rootが実本文を読み、同Work補助がsourceを読取確認したが、正式な別model Pro／Ultra審査・正式Product Readとは数えない。PRODUCT_NOT_CLEAR／初回一体単位未完了／正式0/3／candidate_ready=false／automatic_progression=false。E04の受け止めの深さ、E05問い、E06〜E09、逆順・他者・時点未指定・敬体等は残る。10/20方式判断、10/31管理線、12/18目標、Piece/Analysis主枠53.25％は不変。既存Draft PRで継続、merge／配置なし。

実本文・全path・検証境界：[u341監査](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u341_ContrastDegree_20261018.md)。

### u341変更file地図

| repository | path | 役割 |
|---|---|---|
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 既存production owner。既存有限述語直前1個の程度語だけをtopic検査用コピーで区別 |
| mashos-api | `ai/tests/test_cmee_emlis_contrast_degree.py` | 新規。22比較／本文変異20／SQL保存12 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_u340_contrast_degree_v1.json` | 新規。無変更u340の22入力・意味／参照／実本文凍結 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 現行owner identityのみ更新。歴史証跡は保持 |
| mashos-api | `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 再開先・修復範囲・結果・未解消を追記 |
| Cocolon | `Cocolon_前提資料/01_cocolon_overall_structure.md` | 設計／構造／週次の今回差分追記 |
| Cocolon | `Cocolon_前提資料/01A_cocolon_overall_structure_app_foundation_home.md` | 設計／構造／週次の今回差分追記 |
| Cocolon | `Cocolon_前提資料/current_structure/01_emlis_ai_current_structure.md` | 設計／構造／週次の今回差分追記 |
| Cocolon | `Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md` | 設計／構造／週次の今回差分追記 |
| Cocolon | `Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261017.md` | 設計／構造／週次の今回差分追記 |
| Cocolon | `Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u341_ContrastDegree_20261018.md` | 新規。着手記録・実本文・検証・残件 |


## u342 — 今日→昨日の完全対比に加わる誤関係と本文停止を修復（2026-10-18）

Mashの残件継続指示に基づき、全体設計01・全file地図01A・current_structure・正本06・最新weekly・API handoffと作業規則、恒久incident全文を確認した。開始HEADはAPI `d663ce22836fd32604788605001d71e8561f7ba2`、Cocolon `1c3dcac03420bd8f37e0d6a0a325a1bb7cf9ce25`。u341で特定した逆順停止に対する、既存設計内のsource誤派生修復である。Rule18 LEVEL_2 standing delegation／current依頼の範囲で、rootが実装・検証・反映し、同Work補助はread-only調査を担当した。正式な別モデルPro／Ultra審査とは数えない。

完全原fieldで本人二文・既存有限述語・明示対比を証明し、原文prefixと既存semantic timeがpresent→pastで一致する場合に限定した。同じ両端の逆向き `attempt_and_block` が単一 `conflict.eN`／meaning arc空／endpoint span完全一致である場合だけ、既存 `uncertain_connection`／bounded_structural_inference／shouldへ戻す。元のcontrast、全核、誤辺を含むID・両端・根拠・certaintyは保持する。実markerの位置・原文切片・対比性も確認する。参照helperから完全二文のsource証明を既存OP内へ抽出し、選択と独立して使用した。u341の参照資格は拡張しない。

開始原本の合成22入力を凍結し、7入力で新しい意味checkpointと本文が成立した。対象は、通常／ひらがな／程度両端／程度過去側／「今日も・昨日も」／句読点違い／過去否定。現行のQ1/Q3本文が一致し、新checkpointで再開しても同じ本文となる。15対照はcheckpoint・plan・Q3 selectedまたは同じ停止・全artifact・問い・reasonが不変。全22入力の核は不変で、対象7入力の関係差分は逆向き誤辺のtype／grounding／retentionだけである。新しい主観内容・選択契約・質問資格を足していない。

今回の修復は意味関係を変えるため、u341の参照だけの修復と異なり、旧IDへ新しい意味を付けない。既存3ownerにlegacy modeを接続し、旧ID指定時にu341の全核辺を再導出して既存checkpoint照合を通す。22入力×Q1/Q3の44復元で、各経路の旧checkpoint・plan・全artifact・問い・reasonを保持した。Q3 selected全体または同じ投影停止も比較した。Q1 selected全体のu341 hashは凍結しておらず、Q3のsource refを含むhashと同一とは主張しない。さらに旧u337の44recordと旧u334の40recordの復元検査が通った。新flag単独で過去の別修復まで無効化せず、より古いsource modeからは今回修復も無効化する。新schemaは不要、Q1 engine／serviceの変更も不要だった。

最終検証は **374 passed／5 failed／skip0**（新119成功、関連255成功・5失敗。current identity1は関連集合に含む）。5失敗はu341の旧不変対照 `reverse`／`reverse_degree`、u340の旧意味・plan比較 `degree`／`reverse`、u331の旧「同時」表示比較 `distinct_times`。歴史fixture・旧assertionは変更・xfail・skipしていない。新119は原本比較22、旧復元44、作者を禁止した本文変異20、source関係変異16、foreign checkpoint拒否1、SQL保存・再開16である。最初の新規検査で検出した対象誤仮定3件とQ1/Q3 selected hash混同4件は、新規test側の仮定を修正した。開始原本fixtureは変更せず、途中実行を成功数へ加算しない。全suite GREEN・製品完成ではない。

実service＋隔離PGlite SQL/RPC16ケース：2原文×3tier×現行完成／旧未提供の12と、2原文×旧checkpoint保存前／後の確定中断4。現行完成と旧未提供は生成禁止engineによるGET／startで全DTO一致。確定中断は既存CancelledError経路を使い、checkpoint前はretryで現行意味を初めて作り、checkpoint後はprepareを呼ばず旧meaning event／payloadと旧未提供を保持した。意味eventは各1件、operationも維持する。旧未提供はRESPONSE_FAILED／body_not_validated／can_retry=falseであり、成功表示へ変えない。lost ACKや失効attempt、本番旧DBを検証したとはしない。

同じ16DTOを現行API client→hook→Modalへ渡し、GETのみでclose/reopen各2回、全DTO・本文または未提供表示・original・timeline・質問／回答欄なしを確認。HTTP／Auth／nativeはstubであり、本人実機・本番配置ではない。全7現行本文をrootが読み、時点・程度・肯否・原文順を維持し、因果や「同時」を足していないことを確認した。定型的な「小さくせずに受け止めています」は残り、E04の深さや正式Product Read完了に換算しない。

STRUCTURE_MAP_DELTA_NONE。既存production3file、新production0、新test1・原本fixture1・current identity。OP direct builderの新legacy引数の既定はTrueで、Analysis等の直接呼出しは従来経路を保持し、現行Emlis original_meaning_planだけFalseを明示する。Analysis全suiteは未実行。公開API／DB／RN／Safety／依存／releaseは不変。

残件：`past_then`「今は疲れている。ただ、その時は友達と話せて嬉しかった。」は後半がcurrent_inputで、ただもother_explicitに残り、今回の時点資格を満たさない。`now`「今は疲れている。しかし、昨日は友達と話せて嬉しかった。」は「しかし」が後半spanへ入り、明示contrastがなくattempt_and_block＋shift_from_toのまま停止する。他者・明示SELF・条件・敬体・時点未指定等の対照は従来の誤読／停止を含み、不変を品質合格と扱わない。次の読取位置は、これら未証明例の時間・接続詞のsource帰属と、既存契約内で修復できる共通原因である。語順一般への対応完了とは報告しない。

必要性=DIRECT_PRODUCT_OR_ACCEPTANCE_WORK、primary outcome=TECHNICAL_CREDIT。PRODUCT_NOT_CLEAR／初回一体単位未完了／正式0/3／candidate_ready=false／automatic_progression=false。E04深さ／E05問い／E06〜E09は未完。10/20方式判断・10/31管理線・12/18目標、Piece/Analysis主枠53.25％は不変。既存Draft PR継続、merge／配置なし。

実本文・全path・検証境界：[u342監査](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u342_ReverseContrast_20261018.md)。

### u342変更file地図

| repository | path | 役割 |
|---|---|---|
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 既存二文証明の抽出、逆向き誤辺だけの修復、direct builder旧mode |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py` | 現行／旧source modeから修復条件を伝播 |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | 旧checkpointの全意味再導出と既存照合 |
| mashos-api | `ai/tests/test_cmee_emlis_reverse_contrast.py` | 新規。原本比較、旧復元、独立本文読解、source変異、SQL保存／中断再開 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_u341_reverse_contrast_v1.json` | 新規。無変更u341から凍結した22入力・Q1/Q3旧記録 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 現行owner identityのみ更新、歴史証跡は保持 |
| mashos-api | `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 再開範囲・実績・互換境界・残件を追記 |
| Cocolon | `Cocolon_前提資料/01_cocolon_overall_structure.md` | 今回の設計・構造・週次差分 |
| Cocolon | `Cocolon_前提資料/01A_cocolon_overall_structure_app_foundation_home.md` | 今回の設計・構造・週次差分 |
| Cocolon | `Cocolon_前提資料/current_structure/01_emlis_ai_current_structure.md` | 今回の設計・構造・週次差分 |
| Cocolon | `Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md` | 今回の設計・構造・週次差分 |
| Cocolon | `Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261017.md` | 今回の設計・構造・週次差分 |
| Cocolon | `Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u342_ReverseContrast_20261018.md` | 新規。着手・実本文・検証・残件 |


## u343差分 — source時点・接続詞修復（2026-10-18）

STRUCTURE_MAP_DELTA_NONE。既存4production file内で修復し、公開wire／DB／RNの変更なし。本文・旧checkpoint全体・保存再開まで確認。[u343監査](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u343_PastThenContrast_20261018.md)に全16fileの地図と検証境界を記載する。

## u343変更file地図（16file）

| repository | path | 役割 |
|---|---|---|
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 時点・接続詞の原field証明、既存fragment参照、限定関係修復、direct旧mode |
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | 独立typed fragment読取と生の二対象照合 |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py` | 現行／歴史source modeの伝播 |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | u342全旧意味を再導出してcheckpoint照合 |
| mashos-api | `ai/tests/test_cmee_emlis_time_contrast_source.py` | 新規。現行・旧復元・独立本文・SQL保存／中断 |
| mashos-api | `ai/tests/test_cmee_emlis_time_contrast_proof.py` | 新規。原文・provenance・時点・fragment変異 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_u342_past_then_v1.json` | 新規。無変更u342の36record・両route |
| mashos-api | `ai/tests/fixtures/cmee_emlis_u342_inline_contrast_v1.json` | 新規。無変更u342の18record・両route |
| mashos-api | `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 現行owner証跡のみ更新 |
| mashos-api | `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 短い結果と正本への再開参照 |
| Cocolon | `Cocolon_前提資料/01_cocolon_overall_structure.md` | 今回差分・参照／本監査 |
| Cocolon | `Cocolon_前提資料/01A_cocolon_overall_structure_app_foundation_home.md` | 今回差分・参照／本監査 |
| Cocolon | `Cocolon_前提資料/current_structure/01_emlis_ai_current_structure.md` | 今回差分・参照／本監査 |
| Cocolon | `Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md` | 今回差分・参照／本監査 |
| Cocolon | `Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261017.md` | 今回差分・参照／本監査 |
| Cocolon | `Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u343_PastThenContrast_20261018.md` | 今回差分・参照／本監査 |


## u344差分 — 二反応の到達と更新保持（2026-10-18）

[u344監査](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u344_ReliefContinuity_20261018.md)に実本文・互換・保存の検証境界。公開wire／DB／RN不変、私有保持型2追加・logical81。

## u344変更file地図（24file）

| repository | path | 役割 |
|---|---|---|
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 既存pair証明に限定した表記認識、正規化済み関係の参照、撤回後の残存感情の共通選択 |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py` | 現行／全歴史source modeへの表記互換の伝播 |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | 不変pairと既受理1更新の出自証明、2責務保持、版付きcheckpointと旧完全復元 |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_projection.py` | 既存LIMITED集約を保った局所二反応、元入力／回答／plan／selectedの完全再証明 |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/contracts.py` | 更新専用eligibility/contentの私有2型。既存二反応内容と全体claimの結合検証 |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_composition.py` | 同じ二反応内容の封印と私有2型manifest、logical79→81 |
| mashos-api | `ai/tests/test_cmee_emlis_loneliness_orthography.py` | 新規。現行30例×Q1/Q3、旧復元、作者禁止読解、原文資格変異 |
| mashos-api | `ai/tests/test_cmee_emlis_loneliness_delivery.py` | 新規。pair自体の5訂正／撤回、隔離SQLの保存／再開7例 |
| mashos-api | `ai/tests/test_cmee_emlis_relief_update_retention.py` | 新規。17実質問例×Q1/Q3、初回不変・1回答保持・旧復元・独立読解／出自変異 |
| mashos-api | `ai/tests/test_cmee_emlis_relief_update_delivery.py` | 新規。隔離SQLの回答保存・旧完成／未提供・確定中断再開9例 |
| mashos-api | `ai/tests/test_cmee_emlis_relief_cognition.py` | 現在manifest件数のみ81へ同期。歴史fixture・本文期待は保持 |
| mashos-api | `ai/tests/test_cmee_emlis_relief_unknown.py` | 現在manifest件数のみ81へ同期。unknown保持資格・既存本文期待は保持 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_u343_loneliness_orthography_v1.json` | 新規。無変更u343の30入力×Q1/Q3の全record |
| mashos-api | `ai/tests/fixtures/cmee_emlis_u343_relief_update_v1.json` | 新規。無変更u343の17入力×Q1/Q3×初回／回答後の68全record |
| mashos-api | `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 現行ownerから再導出したidentity。scope・歴史proof保持 |
| mashos-api | `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 検証済み範囲・未完・次の実本文確認位置 |
| Cocolon | `Cocolon_前提資料/01_cocolon_overall_structure.md` | 今回差分・参照／本監査 |
| Cocolon | `Cocolon_前提資料/01A_cocolon_overall_structure_app_foundation_home.md` | 今回差分・参照／本監査 |
| Cocolon | `Cocolon_前提資料/07_latest_snapshot_diff.md` | 今回差分・参照／本監査 |
| Cocolon | `Cocolon_前提資料/current_structure/01_emlis_ai_current_structure.md` | 今回差分・参照／本監査 |
| Cocolon | `Cocolon_前提資料/current_structure/04_cmee_current_structure.md` | 今回差分・参照／本監査 |
| Cocolon | `Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md` | 今回差分・参照／本監査 |
| Cocolon | `Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261017.md` | 今回差分・参照／本監査 |
| Cocolon | `Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u344_ReliefContinuity_20261018.md` | 今回差分・参照／本監査 |


## u345 — 別経験への1回答後も、完全な観測と短い二反応を両立（2026-10-18）

u344に残った原文反復を、既承認のu336共同保持とu331/u332更新責務の範囲で修復した。未変更の安堵・寂しさpairと独立した別経験を既存行構成ownerで別行へ分け、pairの完全な原文をObservationへ残す。実Observationの完全一行・一意照応を要求するreaderは変更しない。意味checkpoint・全plan・selected・問い・decisionは不変で、新しい内容選択や反応は追加しない。

開始原本21入力の比較で、10入力×Q1/Q3の1回答後Receptionを短縮。初回42結果は不変。別の寂しさもある曖昧例は全文参照を保持。「かもしれなかった」はQ3で実問いを出せず、改善成功に数えない。対象集合の最終結果は重複除外323 passed／0 failed／skip 0（新規108、既存関連215）。全suite成功を意味しない。保存23DTOの現行API client→hook→Modalでclose/reopen各2回も確認。HTTP／Auth／nativeはstubで、実機・本番DBではない。

旧u343 checkpointは旧意味・全出力／停止を保持。u344と同じ意味checkpointから未完成本文を生成する場合は今回の行構成を使うが、既に完成・保存した本文は再生成せずそのまま返す。STRUCTURE_MAP_DELTA_NONE、既存production1file・新production0、logical81不変。公開wire／DB／RN／Safety／依存の変更なし。

必要性=DIRECT_PRODUCT_OR_ACCEPTANCE_WORK、primary outcome=TECHNICAL_CREDIT。PRODUCT_NOT_CLEAR／初回一体単位未完了／正式Product Read0/3／candidate_ready=false／automatic_progression=falseを維持。初回の長い混在Reception、extra_unknownの回答後のpair欠落、否定訂正、一般入力・任意多段、E04深さ／E05問い／E06〜E09・本人実機は残る。次は未変更の不明と二反応が追加回答後に同居するextra_unknownの責務脱落を原文・実問い・選択から診断し、既承認保持の修復と新しい内容判断を区別する。10/20方式判断、10/31管理線、12/18目標、Piece/Analysis主枠53.25％は維持。既存Draft PR3／PR30で継続、merge／配置なし。

全13file、未加工本文、検証・互換境界は[u345監査](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u345_ReliefObservationLayout_20261018.md)。

### u345変更file地図

| repository | path | 役割 |
|---|---|---|
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py` | 既存の行構成owner。保持pairと独立した別経験を別行にし、既存source-component arcを使用 |
| mashos-api | `ai/tests/test_cmee_emlis_relief_layout.py` | 新規。無変更u344比較、全意味・問い保持、独立本文読解、同一経験の分割拒否、旧保存準備の原本一致 |
| mashos-api | `ai/tests/test_cmee_emlis_relief_layout_delivery.py` | 新規。現行／u344完成本文の保存、生成なし再表示、保存済み意味からの中断再試行7件 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_u344_relief_layout_v1.json` | 新規。開始原本fc3bc928の21入力×Q1/Q3×初回／1回答の83結果と実問いなし1件 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 現在owner identityのみ再導出。歴史fixture・scopeは保持 |
| mashos-api | `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 今回結果・保存境界・残件・次の再開先 |
| Cocolon | `Cocolon_前提資料/01_cocolon_overall_structure.md` | 設計全体の最新差分と監査への入口 |
| Cocolon | `Cocolon_前提資料/01A_cocolon_overall_structure_app_foundation_home.md` | 今回13fileの全変更地図。01B/Cの既存担当範囲は変更なし |
| Cocolon | `Cocolon_前提資料/07_latest_snapshot_diff.md` | 今回のスナップショット差分 |
| Cocolon | `Cocolon_前提資料/current_structure/01_emlis_ai_current_structure.md` | EmlisAI現状・保持範囲・未完 |
| Cocolon | `Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md` | 実装順序・検証・進捗の正本追記 |
| Cocolon | `Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261017.md` | 最新週次への実績・残件追記 |
| Cocolon | `Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u345_ReliefObservationLayout_20261018.md` | 新規。本監査、判断根拠・実本文・検証境界・全変更file |


## u346 — 独立不明が同居しても、別経験の1更新後に既存二反応を保持（2026-10-18）

u345残件extra_unknownを修復した。初回から選ばれている安堵・寂しさpairを、別経験への受理済み1回答／訂正／event撤回後も維持する。末尾の独立current SELF wh-unknown1核は、原文・核・関係・Observationで不変のまま残し、既存2 moves／3選択対象を保つ。不明への第三Receptionは追加していない。

開始原本18入力×Q1/Q3の初回36結果は完全不変。9入力×2経路の現行更新でpairを回復し、残りの実更新は旧結果を保持。旧u345の全保存checkpointは全意味・選択・本文／停止へ復元する。別event撤回には後段のexact3構成guardも修復。旧本文未提供だったQ3の3入力は、本文成功後の既存停止理由へ到達するためdecision_reasonのみfree_round_completeからno_bound_personal_meaning_targetへ変わる。質問本体は追加しない。

対象集合の最終結果は重複除外187 passed／0 failed／skip 0（新規101、関連86）。保存8DTOを現行API client→hook→Modalでclose/reopen各2回確認した。HTTP／Auth／nativeはstub。全suite／実機／本番DBの成功を意味しない。

STRUCTURE_MAP_DELTA_NONE、既存production2file・新production0、logical81不変。新契約型／新unknown grammar／新AFFECTやSTANCEは追加せず、u334の初回exact3資格は不変。元の承認u331/u332の更新時保持を修復するRule18 LEVEL_2。公開wire／DB／RN／Safety／外部AI／依存／費用は変更しない。

必要性=DIRECT_PRODUCT_OR_ACCEPTANCE_WORK、primary outcome=TECHNICAL_CREDIT。PRODUCT_NOT_CLEAR／初回一体単位未完了／正式Product Read0/3／candidate_ready=false／automatic_progression=falseを維持。次は、初回から残るextra_unknownの独立不明へのReception欠落を、更新後の不明を応答対象へ加える場合の4対象／3 movesの責務と既承認u334 exact3境界に照らして整理する。今回の保持修復と混同せず、原文・実問い・未加工本文を起点とする。初回の長い混在Reception、pair否定訂正、一般入力・任意多段、E04〜E09、本人実機は未完。10/20方式判断、10/31管理線、12/18目標、Piece/Analysis主枠53.25％は不変。既存Draft PR3／PR30で継続、merge／配置なし。

全16file・未加工本文・失敗修正と互換境界は[u346監査](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u346_UnknownAlongsidePairRetention_20261018.md)。

### u346全変更file

| repository | path | 役割 |
|---|---|---|
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | 既存answer owner。末尾の独立current SELF wh-unknownを全原文で証明し、別経験の探索からだけ除外。unknownを不変保持して元pairを回復 |
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 既存撤回後の構成guard。source再導出済みpair＋残存感情に、関係のないcurrent SELF unknown1核が併存できるよう整合 |
| mashos-api | `ai/tests/test_cmee_emlis_unknown_pair_retention.py` | 新規。初回・旧保存の完全一致、現行の有限保持、source/active境界12改変、作者なし本文読解9改変 |
| mashos-api | `ai/tests/test_cmee_emlis_unknown_pair_delivery.py` | 新規。現行／旧保存6件と保存意味からの現行／旧中断再開2件、生成なしGET/start一致 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_u345_unknown_pair_retention_v1.json` | 新規。無変更u345で18入力×Q1/Q3の初回36、回答後31、実問いなし5を凍結 |
| mashos-api | `ai/tests/test_cmee_emlis_relief_update_retention.py` | extra_unknownを現行保持集合へ追加。旧u343凍結本文・意味は変更せず旧再導出も検証 |
| mashos-api | `ai/tests/test_cmee_emlis_relief_layout.py` | extra_unknownのu344行構成比較は当時の保存checkpointで固定。現行比較は新u345原本suiteで担当 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | current owner identityのみ再導出。過去proofは保持 |
| mashos-api | `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 修復範囲・新旧保存・残件・次の開始点を記録 |
| Cocolon | `Cocolon_前提資料/01_cocolon_overall_structure.md` | 全体設計の現行差分 |
| Cocolon | `Cocolon_前提資料/01A_cocolon_overall_structure_app_foundation_home.md` | 全16変更fileの地図。01B/Cの担当は不変 |
| Cocolon | `Cocolon_前提資料/07_latest_snapshot_diff.md` | 現行snapshot差分 |
| Cocolon | `Cocolon_前提資料/current_structure/01_emlis_ai_current_structure.md` | EmlisAI構造・有限な保持範囲・未完 |
| Cocolon | `Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md` | 実装順・検証・進捗の正本 |
| Cocolon | `Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261017.md` | 最新週次の実績と次の残件 |
| Cocolon | `Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u346_UnknownAlongsidePairRetention_20261018.md` | 新規。本監査、変更理由・未加工本文・検証・全file地図 |
