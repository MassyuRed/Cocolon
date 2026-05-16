---
title: "02C_Cocolon_国家システム資料_契約_境界_検証系"
revision_date: "2026-05-16"
---

# 02C. 契約 / 境界 / 検証系

この章では contract、policy、boundary guard、test、runtime config を扱う。

## C1. RN contract / boundary / compatibility files

### `Cocolon/.env.subscription.public.example`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: App support file. Current system: app support / build config.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `Cocolon/AppRuntimeContext.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: `/app/bootstrap` の contractをRN側で受けるruntime boundary。feature flag / version guard / maintenance message の消費境界。
- 上流:
  - `Cocolon/App.js` — provider
  - `Cocolon/features/home/useHomeState.js` — import
  - `Cocolon/screens/SettingsOtherScreen.js` — import
  - `Cocolon/screens/SubscriptionSelectScreen.js` — import
  - `Cocolon/screens/TodayQuestionHistoryScreen.js` — import
- 下流:
  - `Cocolon/lib/apiClient.js` — import
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py` — endpoint /app/bootstrap
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/features/home/useHomeState.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/screens/SettingsOtherScreen.js`
  - `Cocolon/screens/SubscriptionSelectScreen.js`
  - `Cocolon/screens/TodayQuestionHistoryScreen.js`
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py`

### `Cocolon/AuthScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: App support file. Current system: app provider / context boundary.
- 上流:
  - `Cocolon/App.js` — import
- 下流:
  - `Cocolon/AuthContext.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/AuthContext.js`

### `Cocolon/TutorialContext.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: App support file. Current system: app provider / context boundary.
- 上流:
  - `Cocolon/App.js` — import
  - `Cocolon/screens/EmotionLogScreen.js` — import
  - `Cocolon/screens/InputScreen.js` — import
  - `Cocolon/screens/MyModelReactionHistoryScreen.js` — import
  - `Cocolon/screens/MyModelReflectionsScreen.js` — import
  - `Cocolon/screens/MyModelScreen.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
  - `Cocolon/screens/NexusScreen.js` — import
  - `Cocolon/screens/SettingsOtherScreen.js` — import
- 下流:
  - `Cocolon/lib/api/account/profileApi.js` — import
- 落とすと漏れる関連ファイル:
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

### `Cocolon/TutorialOverlay.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: App support file. Current system: app support / misc.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `Cocolon/babel.config.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: App support file. Current system: app support / misc.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `Cocolon/components/TutorialOverlay.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `legacy-live`
- 国家システム上の役割: RN shared component module. Current system: tutorial shared UI.
- 上流:
  - `Cocolon/screens/EmotionLogScreen.js` — import
  - `Cocolon/screens/InputScreen.js` — import
  - `Cocolon/screens/MyModelReflectionsScreen.js` — import
  - `Cocolon/screens/MyModelScreen.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
  - `Cocolon/screens/NexusScreen.js` — import
  - `mashos-api/ai/docs/TUTORIAL_STABILITY_REDESIGN.md` — document reference
- 下流:
  - `Cocolon/theme/ThemeContext.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/screens/EmotionLogScreen.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/screens/MyModelReflectionsScreen.js`
  - `Cocolon/screens/MyModelScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/NexusScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `mashos-api/ai/docs/TUTORIAL_STABILITY_REDESIGN.md`

### `Cocolon/components/TutorialStartModal.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: RN shared component module. Current system: tutorial shared UI.
- 上流:
  - `Cocolon/screens/InputScreen.js` — import
- 下流:
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/theme/ThemeContext.js`

### `Cocolon/components/UnreadBadge.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: RN shared component module. Current system: startup / unread shared UI.
- 上流:
  - `Cocolon/App.js` — import
  - `Cocolon/screens/InputScreen.js` — import
  - `Cocolon/screens/MenuActionCardCommon.js` — import
  - `Cocolon/screens/MyModelMenuCommon.js` — import
  - `Cocolon/screens/MyWebMenuCommon.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
  - `Cocolon/screens/NoticeHistoryScreen.js` — import
- 下流:
  - `Cocolon/theme/ThemeContext.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/screens/MenuActionCardCommon.js`
  - `Cocolon/screens/MyModelMenuCommon.js`
  - `Cocolon/screens/MyWebMenuCommon.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/NoticeHistoryScreen.js`
  - `Cocolon/theme/ThemeContext.js`

### `Cocolon/eslint.config.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: https://docs.expo.dev/guides/using-eslint/
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `Cocolon/expo-env.d.ts`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: / <reference types="expo/types" />
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `Cocolon/lib/accountLocalCleanup.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: 退会後local cleanup boundary。input draft / self-structure seen / 旧analysis latest report cache / 新こころ天気 latest report cache を対象userId単位で削除する。
- 上流:
  - `Cocolon/screens/SettingsOtherScreen.js` — import
- 下流:
  - `Cocolon/lib/inputDraftStorage.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/lib/inputDraftStorage.js`
  - `Cocolon/screens/SettingsOtherScreen.js`

### `Cocolon/lib/iap/iapConfig.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: lib/iap/iapConfig.js
- 上流:
  - `Cocolon/SUBSCRIPTION_RELEASE_PHASE3.md` — document reference
  - `Cocolon/lib/iap/iapRuntimeCatalog.js` — import
  - `Cocolon/lib/iap/iapService.js` — import
  - `Cocolon/screens/AccountScreen.js` — import
  - `Cocolon/screens/SubscriptionSelectScreen.js` — import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `Cocolon/SUBSCRIPTION_RELEASE_PHASE3.md`
  - `Cocolon/lib/iap/iapRuntimeCatalog.js`
  - `Cocolon/lib/iap/iapService.js`
  - `Cocolon/screens/AccountScreen.js`
  - `Cocolon/screens/SubscriptionSelectScreen.js`

### `Cocolon/lib/iap/iapRuntimeCatalog.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `legacy-live`
- 国家システム上の役割: Frontend helper / boundary module. Current system: subscription / IAP runtime.
- 上流:
  - `Cocolon/SubscriptionContext.js` — import
  - `Cocolon/lib/iap/iapService.js` — import
  - `Cocolon/screens/SubscriptionSelectScreen.js` — import
- 下流:
  - `Cocolon/lib/iap/iapConfig.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/SubscriptionContext.js`
  - `Cocolon/lib/iap/iapConfig.js`
  - `Cocolon/lib/iap/iapService.js`
  - `Cocolon/screens/SubscriptionSelectScreen.js`

### `Cocolon/lib/iap/iapService.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `legacy-live`
- 国家システム上の役割: lib/iap/iapService.js
- 上流:
  - `Cocolon/App.js` — import
  - `Cocolon/screens/AccountScreen.js` — import
  - `Cocolon/screens/SubscriptionSelectScreen.js` — import
- 下流:
  - `Cocolon/lib/iap/iapConfig.js` — import
  - `Cocolon/lib/iap/iapRuntimeCatalog.js` — import
  - `Cocolon/lib/subscriptionApi.js` — import
  - `Cocolon/lib/supabase.ts` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/lib/iap/iapConfig.js`
  - `Cocolon/lib/iap/iapRuntimeCatalog.js`
  - `Cocolon/lib/subscriptionApi.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/screens/AccountScreen.js`
  - `Cocolon/screens/SubscriptionSelectScreen.js`

### `Cocolon/lib/iap/index.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: lib/iap/index.js
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `Cocolon/lib/supabase.ts`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: lib/supabase.ts
- 上流:
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
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
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

### `Cocolon/lib/user.ts`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: lib/user.ts
- 上流:
  - `Cocolon/App.js` — import
  - `Cocolon/screens/MyModelReflectionsScreen.js` — import
  - `Cocolon/screens/MyModelScreen.js` — import
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js` — import
- 下流:
  - `Cocolon/lib/supabase.ts` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/screens/MyModelReflectionsScreen.js`
  - `Cocolon/screens/MyModelScreen.js`
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js`

### `Cocolon/metro.config.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: App support file. Current system: app support / misc.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `Cocolon/patches/@react-native-community+blur+4.4.1.patch`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `retired-current-reference`
- 旧記載状態: `legacy-live`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: Runtime patch for third-party dependency behavior.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `Cocolon/patches/@react-native-community+slider+5.0.1.patch`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `retired-current-reference`
- 旧記載状態: `legacy-live`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: Runtime patch for third-party dependency behavior.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `Cocolon/patches/react-native-svg+13.14.0.patch`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `retired-current-reference`
- 旧記載状態: `legacy-live`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: Runtime patch for third-party dependency behavior.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `Cocolon/patches/react-native-vector-icons+10.3.0.patch`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `retired-current-reference`
- 旧記載状態: `legacy-live`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: Runtime patch for third-party dependency behavior.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `Cocolon/react-native.config.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: App support file. Current system: app support / misc.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `Cocolon/screens/EmotionRankingScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: RN screen module. Current system: app support / misc.
- 上流:
  - `Cocolon/App.js` — import
- 下流:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — endpoint /ranking/emotions
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` — endpoint /ranking/emotions
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py`


## C2. Contract / regression tests

### `mashos-api/ai/tests/contract/conftest.py`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Test module that constrains current backend behavior.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/tests/contract/fixtures/account_display_name_availability_response_shape_v1.json`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Contract fixture file used by API contract / snapshot tests.
- 上流:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`

### `mashos-api/ai/tests/contract/fixtures/account_profile_me_response_shape_v1.json`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Contract fixture file used by API contract / snapshot tests.
- 上流:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`

### `mashos-api/ai/tests/contract/fixtures/app_bootstrap_request_client_meta_v1.json`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Contract fixture file used by API contract / snapshot tests.
- 上流:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`

### `mashos-api/ai/tests/contract/fixtures/app_bootstrap_response_shape_v1.json`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Contract fixture file used by API contract / snapshot tests.
- 上流:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`

### `mashos-api/ai/tests/contract/fixtures/app_startup_response_shape_v1.json`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Contract fixture file used by API contract / snapshot tests.
- 上流:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`

### `mashos-api/ai/tests/contract/fixtures/global_summary_response_shape_v1.json`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Contract fixture file used by API contract / snapshot tests.
- 上流:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`

### `mashos-api/ai/tests/contract/fixtures/home_state_response_shape_v1.json`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Contract fixture file used by API contract / snapshot tests.
- 上流:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`

### `mashos-api/ai/tests/contract/fixtures/legacy_emotion_submit_request_v1.json`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Contract fixture file used by API contract / snapshot tests.
- 上流:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`

### `mashos-api/ai/tests/contract/fixtures/legacy_emotion_submit_response_shape_v1.json`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Contract fixture file used by API contract / snapshot tests.
- 上流:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`

### `mashos-api/ai/tests/contract/fixtures/legacy_mymodel_create_answers_request_v1.json`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Contract fixture file used by API contract / snapshot tests.
- 上流:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`

### `mashos-api/ai/tests/contract/fixtures/mymodel_create_answers_response_shape_v1.json`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Contract fixture file used by API contract / snapshot tests.
- 上流:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`

### `mashos-api/ai/tests/contract/fixtures/mymodel_create_questions_response_shape_v1.json`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Contract fixture file used by API contract / snapshot tests.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/tests/contract/fixtures/myprofile_latest_status_response_shape_v1.json`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Contract fixture file used by API contract / snapshot tests.
- 上流:
  - `mashos-api/ai/tests/contract/test_myprofile_latest_regression.py` — fixture
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/tests/contract/test_myprofile_latest_regression.py`

### `mashos-api/ai/tests/contract/fixtures/myprofile_reports_history_response_shape_v1.json`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Contract fixture file used by API contract / snapshot tests.
- 上流:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`

### `mashos-api/ai/tests/contract/fixtures/report_distribution_settings_response_shape_v1.json`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Contract fixture file used by API contract / snapshot tests.
- 上流:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`

### `mashos-api/ai/tests/contract/fixtures/report_reads_myweb_unread_status_response_shape_v1.json`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Contract fixture file used by API contract / snapshot tests.
- 上流:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — fixture
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`

### `mashos-api/ai/tests/contract/fixtures/subscription_bootstrap_response_shape_v1.json`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Contract fixture file used by API contract / snapshot tests.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/tests/contract/test_api_contract_headers.py`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `legacy-live`
- 国家システム上の役割: Test module that constrains current backend behavior.
- 上流:
  - なし
- 下流:
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
- 落とすと漏れる関連ファイル:
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

### `mashos-api/ai/tests/contract/test_api_contract_registry.py`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `legacy-live`
- 国家システム上の役割: Test module that constrains current backend behavior.
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/api_contract_registry.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_contract_registry.py`

### `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `legacy-live`
- 国家システム上の役割: Test module that constrains current backend behavior.
- 上流:
  - なし
- 下流:
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
- 落とすと漏れる関連ファイル:
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

### `mashos-api/ai/tests/contract/test_emlis_ai_contracts.py`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `legacy-live`
- 国家システム上の役割: Test module that constrains current backend behavior.
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — import
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — import
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py` — import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_subscription.py`
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py`

### `mashos-api/ai/tests/contract/test_generated_reflection_display_contracts.py`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Test module that constrains current backend behavior.
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — import
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py` — import
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — import
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py`

### `mashos-api/ai/tests/contract/test_generated_reflection_maintenance_contracts.py`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Test module that constrains current backend behavior.
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_reflection_engine.py` — import
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — import
  - `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py` — import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/astor_reflection_engine.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py`

### `mashos-api/ai/tests/contract/test_mymodel_reflection_display_contracts.py`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `legacy-live`
- 国家システム上の役割: Test module that constrains current backend behavior.
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — import
  - `mashos-api/ai/services/ai_inference/api_profile_create.py` — import
  - `mashos-api/ai/services/ai_inference/reflection_text_formatter.py` — import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/api_profile_create.py`
  - `mashos-api/ai/services/ai_inference/reflection_text_formatter.py`

### `mashos-api/ai/tests/contract/test_myprofile_latest_regression.py`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Test module that constrains current backend behavior.
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — import
  - `mashos-api/ai/services/ai_inference/subscription.py` — import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — import
  - `mashos-api/ai/tests/contract/fixtures/myprofile_latest_status_response_shape_v1.json` — fixture
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/tests/contract/fixtures/myprofile_latest_status_response_shape_v1.json`

### `mashos-api/ai/tests/contract/test_notice_contracts.py`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Test module that constrains current backend behavior.
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/api_notice.py` — import
  - `mashos-api/ai/services/ai_inference/notice_store.py` — import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_notice.py`
  - `mashos-api/ai/services/ai_inference/notice_store.py`

### `mashos-api/ai/tests/contract/test_publish_governance.py`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `legacy-live`
- 国家システム上の役割: Test module that constrains current backend behavior.
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/api_global_summary.py` — import
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py` — import
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — import
  - `mashos-api/ai/services/ai_inference/api_report_reads.py` — import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_global_summary.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
  - `mashos-api/ai/services/ai_inference/api_report_reads.py`

### `mashos-api/ai/tests/contract/test_rn_surface_guards.py`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Test module that constrains current backend behavior.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/tests/contract/test_subscription_bootstrap_contracts.py`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Test module that constrains current backend behavior.
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_subscription.py`

### `mashos-api/ai/tests/smoke_test.py`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Test module that constrains current backend behavior.
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/guards/date_guard.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/guards/date_guard.py`

### `mashos-api/ai/tests/test_emlis_ai_greeting_state_store.py`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Test module that constrains current backend behavior.
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py` — import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py`

### `mashos-api/ai/tests/test_emlis_ai_observation_kernel.py`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Test module that constrains current backend behavior.
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_capability.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_observation_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_capability.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_observation_kernel.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py`

### `mashos-api/ai/tests/test_emlis_ai_user_model_store.py`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Test module that constrains current backend behavior.
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py` — import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py`


## C3. Policy / rule documents

### `mashos-api/ai/docs/API_CONTRACT_POLICY.md`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `legacy-live`
- 国家システム上の役割: Cocolon Public API Contract Policy
- 上流:
  - なし
- 下流:
  - `mashos-api/scripts/check_no_direct_supabase.py` — document reference
- 落とすと漏れる関連ファイル:
  - `mashos-api/scripts/check_no_direct_supabase.py`

### `mashos-api/ai/docs/NATIONAL_ALIGNMENT_AUDIT_PHASE5.md`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `legacy-live`
- 国家システム上の役割: National Alignment Audit — Phase 5
- 上流:
  - なし
- 下流:
  - `Cocolon/lib/apiClient.js` — document reference
- 落とすと漏れる関連ファイル:
  - `Cocolon/lib/apiClient.js`

### `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `legacy-live`
- 国家システム上の役割: Cocolon Public API Registry
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/docs/TUTORIAL_STABILITY_REDESIGN.md`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Tutorial Stability Redesign
- 上流:
  - なし
- 下流:
  - `Cocolon/components/TutorialOverlay.js` — document reference
- 落とすと漏れる関連ファイル:
  - `Cocolon/components/TutorialOverlay.js`

### `mashos-api/ai/docs/api_contract.txt`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Rule / policy / behavior document used when editing runtime files.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/docs/data_ingest_guide.txt`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Rule / policy / behavior document used when editing runtime files.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/docs/iap_subscription_update.md`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: IAP: /subscription/update 導入メモ（MVP）
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/docs/{{AI_NAME}}_spec.txt`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `shared`
- 国家システム上の役割: Rule / policy / behavior document used when editing runtime files.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし


## C4. Guard / maintenance scripts

### `mashos-api/scripts/backfill_generated_reflection_display_cleanup.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: Maintenance or guard script for current runtime / contract discipline.
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py`

### `mashos-api/scripts/check_no_direct_supabase.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: Maintenance or guard script for current runtime / contract discipline.
- 上流:
  - `mashos-api/ai/docs/API_CONTRACT_POLICY.md` — document reference
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/docs/API_CONTRACT_POLICY.md`

### `mashos-api/scripts/mashos_cron_runner.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: mashos_cron_runner.py (Phase 4.5)
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし


## C5. Runtime config / support docs / build boundary

### `mashos-api/ai/.env`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: Backend support module. Current system: backend support document.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/Makefile`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: Backend support module. Current system: backend support document.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/POST_MIGRATION_CHECKLIST.md`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: Post Migration Checklist
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/README_MIGRATION_QUICKSTART.md`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: MashOS/ai Quickstart (after migration)
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/configs/app_ids.yaml`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: Config / schema / text asset used by current backend support or contract flow.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/configs/model_train.yaml`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: Config / schema / text asset used by current backend support or contract flow.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/configs/runtime.yaml`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: Config / schema / text asset used by current backend support or contract flow.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/services/ai_inference/.env.subscription.backend.example`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: Backend support module. Current system: backend support / misc.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/services/ai_inference/analysis_engine_adapter.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: Backend support module. Current system: backend support / misc.
- 上流:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 下流:
  - `mashos-api/ai/services/analysis_engine/models.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/analysis_engine/models.py`

### `mashos-api/ai/services/ai_inference/api_contract_registry.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `legacy-live`
- 国家システム上の役割: FastAPI route module in ai_inference.
- 上流:
  - `mashos-api/ai/services/ai_inference/middleware_api_contract.py` — from import
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py` — from import
  - `mashos-api/ai/tests/contract/test_api_contract_registry.py` — from import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/middleware_api_contract.py`
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py`
  - `mashos-api/ai/tests/contract/test_api_contract_registry.py`

### `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `legacy-live`
- 国家システム上の役割: Phase 4: 0:00配布を“本当に配布”にする（サーバCron）
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
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
- 落とすと漏れる関連ファイル:
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

### `mashos-api/ai/services/ai_inference/api_emotion_history_manage.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: FastAPI route module for DELETE /emotion/history/{emotion_id}
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/api_emotion_history_search.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: Emotion History Search API (server-side)
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/publish_governance.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/publish_governance.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`

### `mashos-api/ai/services/ai_inference/api_emotion_secret.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: Emotion Secret Update API for Cocolon
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`

### `mashos-api/ai/services/ai_inference/api_nexus.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: Nexus read-side routes for the new emotion-generated Reflection feed.
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`

### `mashos-api/ai/services/ai_inference/api_public_profile.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `legacy-live`
- 国家システム上の役割: Public (unauthenticated) profile resolver for share URLs.
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/app.py`

### `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: FastAPI route module for GET /report-distribution/settings, PATCH /report-distribution/settings
- 上流:
  - `Cocolon/lib/reportDistributionApi.js` — endpoint /report-distribution/settings
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/active_users_store.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/report_distribution_settings_store.py` — from import
- 落とすと漏れる関連ファイル:
  - `Cocolon/lib/reportDistributionApi.js`
  - `mashos-api/ai/services/ai_inference/active_users_store.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/report_distribution_settings_store.py`
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`

### `mashos-api/ai/services/ai_inference/api_subscription.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: FastAPI route module for GET /subscription/bootstrap, GET /subscription/me, POST /subscription/update
- 上流:
  - `Cocolon/lib/subscriptionApi.js` — endpoint /subscription/bootstrap
  - `Cocolon/lib/subscriptionApi.js` — endpoint /subscription/me
  - `Cocolon/lib/subscriptionApi.js` — endpoint /subscription/update
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/tests/contract/test_emlis_ai_contracts.py` — import
  - `mashos-api/ai/tests/contract/test_subscription_bootstrap_contracts.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/active_users_store.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/client_compat.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_projection.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py` — from import
- 落とすと漏れる関連ファイル:
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

### `mashos-api/ai/services/ai_inference/app.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `legacy-live`
- 国家システム上の役割: Cocolon MyModel Inference API (Release-oriented)
- 上流:
  - なし
- 下流:
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
- 落とすと漏れる関連ファイル:
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

### `mashos-api/ai/services/ai_inference/client_compat.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: Backend support module. Current system: runtime boundary / infrastructure.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_home_state.py` — from import
  - `mashos-api/ai/services/ai_inference/api_notice.py` — from import
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/middleware_active_user_touch.py` — from import
  - `mashos-api/ai/services/ai_inference/notice_store.py` — from import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_home_state.py`
  - `mashos-api/ai/services/ai_inference/api_notice.py`
  - `mashos-api/ai/services/ai_inference/api_subscription.py`
  - `mashos-api/ai/services/ai_inference/middleware_active_user_touch.py`
  - `mashos-api/ai/services/ai_inference/notice_store.py`

### `mashos-api/ai/services/ai_inference/cron_run_store.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: Phase11+ : Cron結果をSupabaseテーブルに永続化（ダッシュボード化）
- 上流:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/observability.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/observability.py`

### `mashos-api/ai/services/ai_inference/emotion_history_search_service.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: Backend support module. Current system: EmlisAI / immediate reply runtime.
- 上流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/generation_lock.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: Phase10: 競合対策（同時実行の防止）
- 上流:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/observability.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/observability.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/guards/date_guard.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: Backend support module. Current system: runtime boundary / infrastructure.
- 上流:
  - `mashos-api/ai/services/ai_inference/persona_engine.py` — from import
  - `mashos-api/ai/tests/smoke_test.py` — from import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/persona_engine.py`
  - `mashos-api/ai/tests/smoke_test.py`

### `mashos-api/ai/services/ai_inference/middleware_active_user_touch.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: middleware_active_user_touch.py (Phase 8++++++)
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/active_users_store.py` — from import
  - `mashos-api/ai/services/ai_inference/client_compat.py` — from import
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_auth_token_cache.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/active_users_store.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/client_compat.py`
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_auth_token_cache.py`

### `mashos-api/ai/services/ai_inference/middleware_api_contract.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `legacy-live`
- 国家システム上の役割: Backend support module. Current system: runtime boundary / infrastructure.
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_contract_registry.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_contract_registry.py`
  - `mashos-api/ai/services/ai_inference/app.py`

### `mashos-api/ai/services/ai_inference/middleware_request_perf.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: Backend support module. Current system: runtime boundary / infrastructure.
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/observability.py` — from import
  - `mashos-api/ai/services/ai_inference/request_metrics.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/observability.py`
  - `mashos-api/ai/services/ai_inference/request_metrics.py`

### `mashos-api/ai/services/ai_inference/mymodel_entitlements.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: Single source of truth for MyModel Create / Reflections entitlement rules.
- 上流:
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/api_profile_create.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py`
  - `mashos-api/ai/services/ai_inference/api_profile_create.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`

### `mashos-api/ai/services/ai_inference/myprofile_section_text_templates.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: myprofile_section_text_templates.py (Phase9+)
- 上流:
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — from import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`

### `mashos-api/ai/services/ai_inference/myweb_report_schema.json`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: Config / schema / text asset used by current backend support or contract flow.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/services/ai_inference/piece_generated_metrics.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `legacy-live`
- 国家システム上の役割: Helpers for generated Piece totals and rankings.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_account_status.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_account_status_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_kernel.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_account_status.py`
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
  - `mashos-api/ai/services/ai_inference/astor_account_status_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_kernel.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/prompt_templates.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: Server-side prompt templates registry (Phase5)
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/app.py`

### `mashos-api/ai/services/ai_inference/prompts/interpret.en.txt`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: Runtime prompt / response template asset consumed by backend services.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/services/ai_inference/prompts/interpret.ja.txt`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: Runtime prompt / response template asset consumed by backend services.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/services/ai_inference/report_text_templates.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: report_text_templates.py (Phase9)
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/services/ai_inference/requirements.txt`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: Config / schema / text asset used by current backend support or contract flow.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/services/ai_inference/structure_dict.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: Mash構造辞書ローダー & 簡易応答エンジン
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myweb_insight.py` — from import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`
  - `mashos-api/ai/services/ai_inference/astor_myweb_insight.py`

### `mashos-api/ai/services/ai_inference/supabase_auth_token_cache.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: supabase_auth_token_cache.py (Phase 8+++)
- 上流:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/middleware_active_user_touch.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/middleware_active_user_touch.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/supabase_client.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: Shared Supabase HTTP client (Phase 1)
- 上流:
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
- 下流:
  - `mashos-api/ai/services/ai_inference/request_metrics.py` — from import
- 落とすと漏れる関連ファイル:
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

### `mashos-api/ai/services/ai_inference/templates/response_template.en.json`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: Runtime prompt / response template asset consumed by backend services.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/services/ai_inference/templates/response_template.ja.json`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: Runtime prompt / response template asset consumed by backend services.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし


## C6. 2026-04-22 差分更新 (compat / addendum / schema)

### `mashos-api/ai/services/ai_inference/api_nexus_compat.py`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: canonical public surface から外した discoveries route を 410 で隔離する compat route module。
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/api_nexus.py`

### `mashos-api/ai/docs/COCOLON_STRUCTURE_UNIFICATION_ADDENDUM_2026_04_21.md`
- repo: `mashos-api`
- 国家システム区分: `Contract`
- 現行状態: `active`
- 国家システム上の役割: 三大要素の canonical owner / compat 隔離 / artifact-only 契約を補強する addendum。
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/api_nexus.py` — document reference
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — document reference
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py` — document reference
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — document reference
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` — document reference
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_nexus.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`

### `mashos-api/ai/docs/emlis_ai_user_models.sql`
- repo: `mashos-api`
- 国家システム区分: `Boundary`
- 現行状態: `active`
- 国家システム上の役割: EmlisAI derived user model store の schema DDL。immediate reply observation kernel の永続化境界を拘束する。
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py` — schema support
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py`

# 2026-04-25 差分追記: Contract / Boundary / Test current補正

- `tests/contract` は current owner 側の monkeypatch / response model に接続済みです。
- RN surface guard は direct Supabase/raw fetch を増やさない境界として維持します。
- legacy route は残っていますが、旧構造を runtime 本体として残すためではなく、DB/legacy contract retirement までの互換境界です。


# 2026-04-27 差分追記: public contract registry cleanup / verification boundary

## 変更した国家システム対象 files

| file | 国家システム区分 | 差分 |
|---|---|---|
| `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md` | Contract | current public route の未登録分を追加し、legacy `/friends/*` alias の一部に deprecated + replacement を明示した |
| `mashos-api/ai/services/ai_inference/api_contract_registry.py` | Boundary / Contract registry | registry rows を current route と legacy alias replacement に合わせた |
| `mashos-api/ai/services/ai_inference/api_emotion_log.py` | Boundary | `/emotion-log/feed` に response_model metadata を明示した |
| `mashos-api/ai/services/ai_inference/api_nexus.py` | Boundary | `/nexus/emotion-log` / `/nexus/emotion-ranking` に response_model metadata を明示した |
| `mashos-api/ai/tests/contract/test_api_contract_registry.py` | Contract test | current route 必須一覧と friends alias deprecated replacement guard を追加した |

## public contract registry 状態

- public contract rows: `155`
- deprecated rows: `46`
- deprecated with replacement: `39`
- deprecated no replacement / retired compat: `7`
- active legacy named public rows: `8`

active legacy named public rows は、主に `mymodel/qna/*` 系です。これは semantic route migration / public contract retirement の別工程で判断します。今回の差分では retire / handler削除は行いません。

## smoke確認

- endpoint write smoke: `status=pass`
- `hard_502_count=0`
- `non_2xx_count=0`
- `writes_enabled=true`
- `POST /profile-create/answers`: `200`
- `POST /emotion-notifications/settings/{friend_user_id}`: `200`
- `POST /report-reads/mark`: `200`
- `POST /piece/view` / `POST /piece/resonance`: `q_instance_id not found` のため今回対象外

## 今回も削除しないもの

- legacy route handler
- old named API file
- DB object
- RN source file
- `mymodel/qna/*` active legacy named public contract

# 2026-04-28 差分追記: Contract / Boundary / Verification補正

## 新規国家システム file block

### `mashos-api/ai/tests/contract/test_new_national_core_analysis_contracts.py`
- repo: `mashos-api`
- 国家システム区分: `Contract test`
- 現行状態: `active`
- 国家システム上の役割: 分析構造のcapability profile、Report Validity Gate、`reportValidity` additive metaを検証する。
- 上流:
  - `mashos-api/ai/services/ai_inference/analysis_capability.py`
  - `mashos-api/ai/services/ai_inference/analysis_report_validity_gate.py`
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_analysis_reports.py`
  - `mashos-api/ai/services/ai_inference/api_self_structure.py`

### `mashos-api/ai/tests/contract/test_new_national_core_emlis_contracts.py`
- repo: `mashos-api`
- 国家システム区分: `Contract test`
- 現行状態: `active`
- 国家システム上の役割: EmlisAI構造のcapability拡張、quality gate、Free履歴禁止、診断/断定抑制を検証する。
- 上流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_capability.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_quality_gate.py`
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`

### `mashos-api/ai/tests/contract/test_new_national_core_piece_contracts.py`
- repo: `mashos-api`
- 国家システム区分: `Contract test`
- 現行状態: `active`
- 国家システム上の役割: 三大中核registry、Piece preview response、Piece safety policy、preview=published hash契約を検証する。
- 上流:
  - `mashos-api/ai/services/ai_inference/core_contract_registry.py`
  - `mashos-api/ai/services/ai_inference/piece_generation_policy.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_piece.py`
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `Cocolon/components/EmotionPiecePreviewModal.js`

## 既存 file の差分

- `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md` と `mashos-api/ai/services/ai_inference/api_contract_registry.py` は、新国家システムのadditive contractを反映する。
- `mashos-api/ai/services/ai_inference/api_emotion_piece.py` は `piece_text` / visibility / generation / transform / safety contractをadditive追加する。
- `mashos-api/ai/services/ai_inference/api_analysis_reports.py` は `reportValidity` metaをadditive保存する。
- `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` は `quality_gate` metaをadditive接続する。
- `mashos-api/scripts/cocolon_load_test.py` と `mashos-api/scripts/astor_worker_status.py` は、release前の高負荷・worker滞留確認に使う検証境界である。

# 2026-05-05 差分追記: EmlisAI / Piece Gate and contract tests

## EmlisAI guard files

| file | guard内容 |
|---|---|
| `emlis_ai_reply_final_review_service.py` | raw phrase破綻、文末反復、文章構成不足、current inputにない内容の混入を検出 |
| `emlis_ai_quality_gate.py` | final review結果、meaning coverage、presence、構成、例文特化禁止、pre-return可否をmeta化する |
| `emlis_ai_safe_reply_fallback_service.py` | Gate fail時に、現在入力のsafe phrase / meaning blockからfallbackを作る |

## Piece guard files

| file | guard内容 |
|---|---|
| `emotion_piece_generation_service.py` | communicative core、focus_key、core answer、broken phrase repairを扱う |
| `piece_generated_display.py` | display text / answer hash / quality flags / public display正規化を扱う |
| `piece_generation_policy.py` | publish可能性、visibility、安全化、hash契約を扱う |

## current regression / contract tests

- `mashos-api/ai/tests/contract/test_emlis_ai_contracts.py`
- `mashos-api/ai/tests/contract/test_new_national_core_emlis_contracts.py`
- `mashos-api/ai/tests/contract/test_new_national_core_piece_contracts.py`
- `mashos-api/ai/tests/test_emlis_ai_phrase_shaping_service.py`
- `mashos-api/ai/tests/test_emlis_ai_input_meaning_block_service.py`
- `mashos-api/ai/tests/test_emlis_ai_reply_final_review_service.py`
- `mashos-api/ai/tests/test_emlis_ai_quality_gate_pre_return.py`
- `mashos-api/ai/tests/test_emlis_ai_response_composition_service.py`
- `mashos-api/ai/tests/test_emlis_ai_current_input_grounding_guard.py`
- `mashos-api/ai/tests/test_emotion_piece_generation_long_input_core.py`
- `mashos-api/ai/tests/test_emotion_piece_generation_self_and_others_happiness.py`

EmlisAI / Pieceのテストは、例文の固定回答を覚えさせる目的ではなく、汎用処理経路とcontractを守るために使う。


# 2026-05-07 差分追記: value observation contract / guard境界

value observationは三大中核構造に共通する観測信号だが、public API contract上はadditive metaとして扱う。既存fieldを削除・renameしない。

| path | 国家システム区分 | 拘束する内容 |
|---|---|---|
| `mashos-api/ai/services/ai_inference/value_observation_types.py` | Contract / shared type | `cocolon.value_observation.v1` schema、signal / plan metaの形 |
| `mashos-api/ai/services/ai_inference/cocolon_value_observation_service.py` | Boundary / observation service | 例文固定ではなく、現在入力から汎用signalを抽出すること |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_final_review_service.py` | Guard | 内部観測語・責め語・診断風表現を返答本文へ出さないこと |
| `mashos-api/ai/services/ai_inference/piece_generation_policy.py` | Policy | `overcompression_risk` / `overcompression_blocked` / `value_observation_signal_keys` をpolicy metaで保持すること |
| `mashos-api/ai/services/ai_inference/analysis_report_validity_gate.py` | Guard | value observation素材をemotion/self_structure domain境界内で扱うこと |

`ValueObservationSignal.no_diagnosis` / `no_personality_claim` は、出力を診断や人格断定にしないための境界です。Analysisでは単発入力だけで人格断定せず、複数入力・期間・material_countと一緒に扱う。


# 2026-05-09 差分追記: API contract / safety / validation boundary

| contract | additive field / rule |
|---|---|
| `GET /today-question/current` | `question_origin` / `personal_question_id` / `source_anchor` / `question_type` を追加返却する。古いRNはtext/choicesだけでも動く |
| `POST /today-question/answers` | `question_origin` / `personal_question_id` / `source_anchor_hash` を受け、違うpersonal候補への回答混入を防ぐ |
| `GET /today-question/history` | `question_origin` / `source_anchor_summary` を返す。履歴表示は短い引用のみ |
| `POST /cron/today-question/personal-refresh` | Premiumユーザーのpersonal候補生成・更新を行う内部route |
| 安全境界 | `anchor_text` は元入力に実在するliteral substringのみ。通知本文に引用しない。公開面へ自動転用しない |

SQL境界は `today_question_personal_followup_v1.sql` で追加され、ユーザーにより実行済みです。DB destructive変更ではなく、personal followup用の追加テーブル・追加カラム・index・FKです。


# 2026-05-09 実ファイル再照合: current owner補正

この表は `Cocolon(138).zip` / `mashos-api_2(26).zip` の実ファイル一覧と、この資料内の current 参照を照合した補正です。
旧本文内の `active` / `shared` / `legacy-live` 表記よりも、この表を優先します。旧名称はDB physical name / compat / 旧route説明として保管できるが、current実ファイルownerとしては扱いません。

| 旧参照path | 実ファイル照合 | current owner / 読み方 |
|---|---|---|
| `Cocolon/expo-env.d.ts` | local snapshot未収録 | 今回local snapshotには存在しない。Expo generated type helper扱い。current runtime sourceとして扱わない。 |
| `Cocolon/patches/@react-native-community+blur+4.4.1.patch` | local snapshot未収録 | 今回local snapshotには存在しない。patch-package対象としてcurrent active file扱いしない。 |
| `Cocolon/patches/@react-native-community+slider+5.0.1.patch` | local snapshot未収録 | 今回local snapshotには存在しない。patch-package対象としてcurrent active file扱いしない。 |
| `Cocolon/patches/react-native-svg+13.14.0.patch` | local snapshot未収録 | 今回local snapshotには存在しない。patch-package対象としてcurrent active file扱いしない。 |
| `Cocolon/patches/react-native-vector-icons+10.3.0.patch` | local snapshot未収録 | 今回local snapshotには存在しない。patch-package対象としてcurrent active file扱いしない。 |
| `Cocolon/react-native.config.js` | local snapshot未収録 | 今回local snapshotには存在しない。native/config補助はGitHub正本確認済みconfig群を優先し、このpathをcurrent sourceとして扱わない。 |
| `Cocolon/screens/DeepInsightScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisScreen.js / Cocolon/screens/AnalysisContentFirstScreen.js。DeepInsight単独screenは今回local snapshotには存在しない。 |
| `Cocolon/screens/EchoesHistoryListScreen.js` | local snapshot未収録 | Cocolon/screens/ResonanceHistoryListScreen.js |
| `Cocolon/screens/MyModelDiscoveriesRankingScreen.js` | local snapshot未収録 | current ranking surfaceでは単独Discoveries screenは存在しない。RankingTop / PieceResonanceRanking / backend ranking viewsを優先する。 |
| `Cocolon/screens/MyModelEchoesRankingScreen.js` | local snapshot未収録 | Cocolon/screens/PieceResonanceRankingScreen.js |
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
| `mashos-api/ai/services/ai_inference/api_ranking_mymodel_discoveries.py` | local snapshot未収録 | 今回local snapshotには存在しない。current ranking ownerは api_ranking.py / api_ranking_piece_views.py / api_ranking_piece_resonances.py / api_ranking_mymodel_views.py / api_ranking_mymodel_resonances.py。 |

# 2026-05-09 差分追記: `/ops/client-events` contract / privacy boundary

本番運用監視として `POST /ops/client-events` を追加する。これはRN client eventのbest-effort受信であり、product state mutationやDB保存を行わない。

| path | contract / boundary |
|---|---|
| `mashos-api/ai/services/ai_inference/api_client_events.py` | `ClientEventRequest` / `ClientEventResponse`、redaction、optional auth user hash、structured log / alert log |
| `mashos-api/ai/services/ai_inference/app.py` | `register_client_event_routes(app)` を登録 |
| `mashos-api/ai/services/ai_inference/api_contract_registry.py` | `POST /ops/client-events` を `ops.client_events.write.v1` として registry へ追加 |
| `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md` | public API registry docsへ追記 |
| `mashos-api/ai/tests/contract/test_client_events_contract.py` | endpoint / redaction / registry contract test |
| `Cocolon/lib/monitoring.js` | RN側の送信helper。Monitoring failureはruntimeを止めない |
| `Cocolon/lib/apiClient.js` | API error captureを追加。API request / response contractは変更しない |

## privacy / safety rule

- Authorization、token、password、secret、api key、email、UUID、長いtoken風文字列はredactする。
- raw `user_id` はlogに出さず、`user_hash` のみ扱う。
- `stored=false` のresponseで示す通り、現行実装はDB保存しない。
- 監視endpointの失敗はアプリ動作を止めない。
- monitoring endpointは診断用であり、Cocolonのユーザーデータ保存・削除・公開ポリシーを変更しない。

# 2026-05-09 差分追記: Ops client events contract / RN split guard

## `/ops/client-events` contract

| file | 契約上の役割 |
|---|---|
| `mashos-api/ai/services/ai_inference/api_client_events.py` | RN client eventを受けるops endpoint。redaction / user_hash / structured logを扱う |
| `mashos-api/ai/services/ai_inference/app.py` | `register_client_event_routes(app)` を登録する |
| `mashos-api/ai/services/ai_inference/api_contract_registry.py` | `POST /ops/client-events` をpublic contract registryへ追加 |
| `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md` | public API registry docsへops endpointを記載 |
| `mashos-api/ai/tests/contract/test_client_events_contract.py` | payload shape / redaction / registry contractの回帰test |

監視payloadは、token / Authorization / email / UUID / 長いtoken風文字列をredactする。raw user_idはログへ直接出さず、`user_hash` を使う。DB保存は行わない。

## RN screen split guard

| file | 契約上の役割 |
|---|---|
| `Cocolon/tests/rn-screen-contracts.test.js` | 分割後のentry shellとsubmodule接続を確認するRN screen contract test |

RN screen split testは表示導線のguardであり、backend public APIやDB write pathを変更しない。

# 2026-05-09 差分追記: EmlisAI multi-perspective Gate / contract tests

EmlisAI観測本文の契約は、固定文が出ることではなく、複数視点構造とfail-closedが守られることとして読む。

| guard / test | current owner | 役割 |
|---|---|---|
| Reader Gate | `emlis_ai_listener_reader_judge.py` | 出力だけを読んで、意味・話者・会話性・report臭を判定する |
| Grounding Gate | `emlis_ai_grounding_judge.py` | 各文がEvidenceSpanまたはRelationに支えられるかを判定する |
| Template / Echo Gate | `emlis_ai_template_echo_guard.py` | 旧文型、復唱、過去出力類似を検出する |
| Display Gate | `emlis_ai_display_gate.py` | いずれかのGateで落ちた出力は `observation_status=rejected` とし、本文を空にする |
| Pipeline regression | `ai/tests/test_emlis_ai_multi_perspective_pipeline.py` | `passed` / `rejected` / `safety_blocked` / legacy fallback未使用を検証する |
| Test helper | `ai/tests/emlis_multi_perspective_test_helpers.py` | 複数視点pipeline test用の補助 |

contract上、`input_feedback.comment_text` は残るが、`observation_status=passed` の時だけ本文が入る。`input_feedback.emlis_ai.multi_perspective.legacy_input_feedback_template_used` と `legacy_safe_fallback_used` はfalseとして扱う。

# 2026-05-10 差分追記: EmlisAI Phase8 contract / guard / regression boundary

Phase8の契約は、固定文が出ることではなく、実入力に対して `passed` にしてよい本文だけを通すことです。正解文一致ではなく、構造保持・禁止表面・Gate結果で検証する。

| guard / test | current owner | 検証すること |
|---|---|---|
| Limited sentence quality | `emlis_ai_limited_sentence_quality_guard.py` | `不安。` / `怒り。` など感情ラベル単独行、未完了断片、汎用接続語尾を落とす |
| Template/Echo連携 | `emlis_ai_template_echo_guard.py` | Phase8 quality rejection reasons を既存Template/Echo Gateへ接続する |
| Display trace | `emlis_ai_display_gate.py` | Phase8 quality reportをtraceへ残す |
| Phase8 fixture | `ai/tests/fixtures/emlis_ai_phase8_cases.py` | 7ケースの入力・期待profile・must_keep・禁止表面を保持する |
| Phase8 regression | `ai/tests/test_emlis_ai_phase8_real_input_quality.py` | profile判定、本文品質、禁止表面、guard通過を検証する |

public API route、request shape、DB write pathは変更しません。`input_feedback.comment_text` は互換payload名として保持し、表示可否は `input_feedback.emlis_ai.observation_status` を正とします。


# 2026-05-11 差分追記: 共通文章生成基盤 contract / boundary / test

共通文章生成基盤では、route名やDB名ではなく、文章出力の品質・根拠・安全境界をtestで固定します。

| test群 | 固定する境界 |
|---|---|
| `test_cocolon_text_generation_core_types.py` / `evidence.py` / `composer.py` | 共通型、根拠、fail-closed結果型 |
| `test_cocolon_text_generation_core_guards.py` | 日本語破綻、根拠不足、テンプレ臭、過剰断定、must_keep欠落 |
| `test_cocolon_text_generation_core_emlis_observation_adapter.py` | Emlisのpassed-only / 空本文fail-closed / meta接続 |
| `test_cocolon_text_generation_core_piece_*` | Pieceの問い・答え分離、過圧縮防止、preview/publish境界 |
| `test_cocolon_text_generation_core_analysis_*` | Analysisのdomain分離、非診断Gate、payload shape維持 |
| `test_cocolon_text_generation_core_boundary.py` / `phase14_final_boundary.py` | 三大中核の出力目的・名称・契約が混ざらないこと |

既存 `test_new_national_core_*_contracts.py` には、共通文章生成基盤がadditive metaとして残り、既存公開契約を破壊しないことの確認が追加されています。

# 2026-05-12 差分追記: こころ天気 contract / QA boundary

こころ天気導入は、既存routeへのadditive field追加とRN表示層追加として扱います。public routeのrenameやDB physical renameではありません。

| test / guard | 固定すること |
|---|---|
| `mashos-api/ai/tests/test_kokoro_weather_service.py` | こころ温度、weather_key、観測メモ、`no_observation` のservice単体挙動 |
| `mashos-api/ai/tests/test_analysis_home_summary_current_weather.py` | `/analysis/home-summary` が `current_weather` を返しても既存 `weekly` / `monthly` / `input_status` が消えないこと |
| `mashos-api/ai/tests/test_analysis_report_kokoro_weather.py` | daily / weekly / monthly レポートの `content_json.kokoroWeather` 生成 |
| `mashos-api/ai/tests/test_kokoro_weather_phase6_qa.py` | 未来予測・注意報・良悪判定にならないこと、Free/Plus/Premium境界、自己分析非対象、旧感情分析レポート非表示 |
| `Cocolon/tests/rn-screen-contracts.test.js` | `KokoroWeatherCurrentCard` / `ForecastStrip` / `DetailModal` / formatter / `isKokoroWeatherReportRecord` / cache namespace / fail-closed guard の存在とAnalysis screen接続 |

契約上の読み方:

- `current_weather` は `/analysis/home-summary` のadditive fieldです。
- `content_json.kokoroWeather` はreport content_jsonのadditive fieldです。
- `daily` / `weekly` / `monthly` は契約上の内部値として維持します。
- 表示名 `こころ天気（日/週/月）` はvisible copyであり、DB/API名の一括renameではありません。

# 2026-05-13 差分追記: こころ天気非表示filter contract / QA boundary

旧感情分析レポート非表示移行では、互換表示ではなく fail-closed が契約境界です。`kokoroWeather` が成立しない日/週/月レポートは、API・未読・RN表示で正式対象にしません。

| test / guard | 固定すること |
|---|---|
| `mashos-api/ai/tests/test_analysis_report_kokoro_weather.py` | `_is_kokoro_weather_report_row`、ready projection、ready latest body、detail 404、weekly-days 404、analysis unread filter |
| `mashos-api/ai/tests/contract/test_publish_governance.py` | publish/access policyを通ったready artifactがこころ天気payloadを持つ前提と、旧fallbackを使わない境界 |
| `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` | unread/status系snapshotとready artifact fixtureがこころ天気payloadを前提にしていること |
| `Cocolon/tests/rn-screen-contracts.test.js` | 新cache namespace、旧cache cleanup、`isKokoroWeatherReportRecord`、history / viewer fail-closed、detail path helper |

確認観点:

- 旧レポートしかない場合、ready items は空またはこころ天気基準で返る。
- 旧レポートID直指定では旧本文を返さない。
- 旧レポートは未読バッジを立てない。
- stateやlocal cacheから旧レポートが入っても、Viewerは `content_text` / `standardReport.contentText` を表示しない。

## 2026-05-13 差分追記: わたしマップ contract / validation / QA 境界

`わたしマップ` は public route 変更ではなく additive payload と visible copy 変更で導入する。contract 上は `/self-structure/*` を維持する。

| area | current fact |
|---|---|
| public API | `/self-structure/latest` / `/self-structure/monthly/ensure` / `/self-structure/reports/{report_id}` は維持。`content_json.watashiMap` は additive field。 |
| Free light | `/self-structure/latest` は Free でも `report_mode=light` 概要を返せる。既存 paid row を light 表示へ投影し、保存済み standard/deep を上書きしない。 |
| subscription | `allowed_self_structure_modes_for_tier` が Free=light / Plus=standard / Premium=deep(structural) の境界を読む。 |
| renderer QA | `WatashiMapRenderer` は `watashiMap` / `selfStructureDeepVisual` / `content_text` fallback を持つ。 |
| safety QA | `あなたは〇〇タイプ`、人格断定、改善指導、未来予測に寄せない。役割は `この場面では〇〇の役割が立ち上がりやすい` と読む。 |
| path QA | `components/selfStructure/watashiMapAccessPolicy.js` が存在し、screen import path と一致している。root `components/watashiMapAccessPolicy.js` は同内容の互換copyとして扱う。 |

追加/更新された主な回帰テスト:

| file | 確認内容 |
|---|---|
| `mashos-api/ai/tests/contract/test_self_structure_latest_free_light.py` | Free latest の light payload / `watashiMap` / lock 境界。 |
| `mashos-api/ai/tests/test_self_structure_watashi_map_payload.py` | report generation 時の `content_json.watashiMap` と legacy payload 互換。 |
| `mashos-api/ai/tests/test_subscription_self_structure_modes.py` | tier 別 Self Structure / わたしマップ mode。 |
| `mashos-api/ai/tests/test_watashi_map_service.py` | builder / projection / not enough observation / type断定回避。 |
| `Cocolon/tests/rn-screen-contracts.test.js` | renderer / lock / label / tutorial fixture / guide copy。 |

# 2026-05-15 差分追記: EmlisAI Step15-20 contract / boundary / verification

EmlisAI A案到達工程のcontract / boundary / verificationとして、次のcurrent pathを確認する。

## runtime / contract owner

| file | 構造上の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/stabilization.py` | Step15 共通Core安定化。CoreTextPayload / TextGenerationResult / Guard結果 / used_evidence_span_ids / quality_flags が共通形式かをmeta化し、中核別出力目的・public契約・DB名を共通Coreへ移さないことを確認する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_rollout_metrics_service.py` | Step16 段階リリース計測。attempted / passed / rejected / unavailable / safety_blocked / primary_reason / coverage_group / composer_model をdeveloper/QA metaへ集計する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_ap0_migration_decision_service.py` | Step18 A-P0移行判定。coverage matrix / rollout metrics / diagnostic_summary / Guard結果から、Step19へ進むかB案の戻り先Stepへ返すmetaを作る。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_a_plan_equivalent_composer_service.py` | Step19 A案相当Composer導入。A-P0 green時だけ `cocolon_emlis_observation_composer.a1.v1` へpromoteし、B案Gate / scoped graph / fail-closed / passed-onlyを維持する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_long_term_quality_service.py` | Step20 長期品質。previous output similarity、surface variation、history/cross core evidence-only、distance boundary、QA metricsをdeveloper/QA metaへ残す。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_composer_client_registry.py` | Default composer registry。Step19でA案相当composer aliasを受け、Limited / A-1相当を環境値で切り替えられるが、既存route/response keyは変えない。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_coverage_matrix_service.py` | Step08 coverage matrix。停止理由をB-S1拡張対象のcoverage groupへ変換するdeveloper meta。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_release_service.py` | Phase7 / Step16 release gate。off/internal/tutorial/limited_cases/all の段階リリース判断とmetrics sourceを持つ。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_safety_boundary_service.py` | Step10 safety boundary。Composer前に危険境界をreason code化して止める非生成helper。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_user_address_service.py` | Emlis観測の呼びかけpolicy。display name callを一箇所に閉じ、二人称依存を抑える。 |

## verification owner

| file | 構造上の意味 |
|---|---|
| `mashos-api/ai/tests/test_cocolon_text_generation_core_step15_stabilization.py` | Step15の共通形式・Emlis契約維持・境界drift検出・render metaを固定する回帰。 |
| `mashos-api/ai/tests/test_emlis_ai_step16_rollout_metrics.py` | Step16のrollout metric event / aggregate / reply meta接続を固定する回帰。 |
| `mashos-api/ai/tests/fixtures/emlis_ai_step17_broad_input_cases.py` | Step17 広い入力fixture。生活・体調・人間関係・学習・仕事・長文・履歴・cross coreを正解文一致ではなく構造条件で固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_step17_broad_input_fixtures.py` | Step17 fixtureのcoverage、forbidden_surface、evidence/scope条件を固定する回帰。 |
| `mashos-api/ai/tests/test_emlis_ai_step18_ap0_migration_decision.py` | Step18のGreen条件、未達時return_steps、passed-onlyだけで進めない判定を固定する回帰。 |
| `mashos-api/ai/tests/test_emlis_ai_step19_a_plan_equivalent_composer.py` | Step19のpromotion条件、未達時hold、B案境界維持、registry / limited composer接続を固定する回帰。 |
| `mashos-api/ai/tests/test_emlis_ai_step20_long_term_quality.py` | Step20の反復表面、履歴補完禁止、距離感drift、A-2長期運用品質metaを固定する回帰。 |
| `mashos-api/ai/tests/test_emlis_ai_composer_client_registry.py` | Step02/06/19 registry・default composer・safety precedence回帰。 |
| `mashos-api/ai/tests/test_emlis_ai_coverage_matrix_service.py` | Step08 coverage matrix group / reason mapping回帰。 |
| `mashos-api/ai/tests/test_emlis_ai_diagnostic_summary.py` | Step01-10 diagnostic_summaryとsafety precedence回帰。 |
| `mashos-api/ai/tests/test_emlis_ai_evidence_ledger_service.py` | Evidence Ledgerがsource span / offset / current input境界を保持し、本文生成しないことの回帰。 |
| `mashos-api/ai/tests/test_emlis_ai_limited_composer_client.py` | LimitedComposerのPhraseUnit / role / SentencePlan / fixed surface禁止回帰。 |
| `mashos-api/ai/tests/test_emlis_ai_limited_observation_scope_service.py` | Scoped graph、included/excluded、safety_blocked、Step09 scope拡張回帰。 |
| `mashos-api/ai/tests/test_emlis_ai_perspective_board_integrator.py` | Perspective board -> ObservationGraph integrationの構造回帰。 |
| `mashos-api/ai/tests/test_emlis_ai_phase6_regression_contracts.py` | B案partial observation / non-passed空本文 / release readiness contract回帰。 |
| `mashos-api/ai/tests/test_emlis_ai_phase7_staged_release.py` | Phase7 staged releaseのlimited_cases接続回帰。 |
| `mashos-api/ai/tests/test_emlis_ai_safety_boundary_service.py` | Safety boundary reason code / graph・evidence検出回帰。 |
| `mashos-api/ai/tests/test_emlis_ai_scoped_grounding.py` | scoped graphだけをGrounding対象にし、excluded evidenceでoverclaimを支えない回帰。 |
| `mashos-api/ai/tests/test_emlis_ai_specialist_observers.py` | specialist observersが本文を作らずstructured reportだけ返す回帰。 |
| `mashos-api/ai/tests/test_emlis_ai_step13_surface_realizer.py` | Step13 surface policy、generic closing、TemplateGuard回帰。 |
| `mashos-api/ai/tests/test_emlis_ai_step14_guard_strengthening.py` | Step14 grounding / diagnosis-like / general knowledge / repeated surface回帰。 |
| `mashos-api/ai/tests/test_emlis_ai_template_echo_guard_phase5.py` | Phase5 Template/Echo Gateの反復表面・過剰引用回帰。 |

## contract固定

- `input_feedback.comment_text` は `observation_status=passed` かつ本文ありの場合だけユーザー表示する。
- Common Coreは品質・根拠・Guardを共有する層であり、Emlis / Piece / Analysis の出力目的を統合しない。
- A案相当composer名はinternal `composer_model` であり、public route / DB physical name / RN visible nameのrenameではない。
- `test_emlis_ai_contracts.py` が環境依存で `jwt` importに止まる場合でも、JWT/subscription周辺をこの差分の対象にしない。

# 2026-05-15 差分追記: 限定Composer拡張 Step0-11 contract / verification

限定Composer拡張で追加されたcontractは、表示率を上げるためのGate緩和ではなく、non-passed時に本文を出さないこと、binding / relation / scorecardがtraceできることを固定するものです。

| contract / guard | owner | 変更境界 |
|---|---|---|
| passed-only表示 | `emlis_ai_display_gate.py`, `emlis_ai_limited_composer_e2e_contract.py`, `test_emlis_ai_display_contract.py` | `observation_status=passed` かつ本文ありの場合だけ `comment_text` を出す。 |
| SentenceBinding contract | `cocolon_text_generation_core/types.py`, `emlis_ai_limited_composer_client.py`, `test_emlis_ai_limited_composer_sentence_binding.py` | body文とbinding数を一致させ、根拠・phrase・relationを追跡する。 |
| binding-aware Grounding | `emlis_ai_grounding_judge.py`, `cocolon_text_generation_core/guards/grounding.py`, `test_emlis_ai_binding_aware_grounding.py` | declared evidence / phrase / relationを読むが、declared evidence not foundはfail-closed。 |
| Gate binding trace | `emlis_ai_display_gate.py`, `cocolon_text_generation_core/adapters/emlis_observation_composer.py`, `test_emlis_ai_gate_binding_reflection.py` | reader / grounding / template / display traceにbinding metaを残す。 |
| Exit Gate | `emlis_ai_limited_composer_extension_exit_gate.py`, `test_emlis_ai_limited_composer_extension_exit_gate.py` | 限定Composer拡張完了を完全Composer初期版の入口条件として判定する。 |

禁止: `comment_text` をnon-passedで露出する変更、固定完成文テンプレ追加、外部AI/ローカルLLM導入、DB/API/RN表示名rename。

# 2026-05-16 差分追記: 完全Composer初期版 Commit1-13 contract / verification

Complete Composer初期版は、表示率を上げるためにGateを緩める変更ではない。契約上の確認対象は、public response shapeを維持しながら、内部meta・repair trace・scorecard eventが増えてもRN表示がpassed-onlyのままかどうかである。

## contract / boundary owner

| owner | 固定する境界 |
|---|---|
| `emlis_ai_complete_composer_initial_meta.py` | 限定/完全Composer呼称metaとAP0 decision reportは内部meta。visible名ではない。 |
| `emlis_ai_complete_composer_types.py` | Complete内部型はpublic response shapeではない。 |
| `emlis_ai_complete_grounding_service.py` / `emlis_ai_grounding_judge.py` | Complete binding-aware Groundingを追加してもGate閾値を緩めない。 |
| `emlis_ai_complete_self_repair_service.py` | repairは新規意味追加ではなく、根拠・relationを保った調整だけ。 |
| `emlis_ai_complete_composer_client.py` / `emlis_ai_composer_client_registry.py` | AP0 green / rollout許可なしではComplete clientを解決しない。 |
| `emlis_ai_complete_reply_diagnostics_service.py` / `emlis_ai_reply_service.py` | diagnostics / scorecard eventをadditive接続し、`comment_text` の既存契約を変えない。 |
| `emlis_ai_complete_scorecard_service.py` | scorecardはQA metaであり、表示判定そのものではない。 |
| `Cocolon/tests/rn-screen-contracts.test.js` | public `observation_status` と `comment_text` のみでmodal payloadを作ることを固定する。 |

## verification owner

| test | 確認内容 |
|---|---|
| `test_emlis_ai_complete_composer_initial_commit1.py` | AP0 report / 呼称meta / registry meta。 |
| `test_emlis_ai_complete_composer_types.py` | Complete内部型のfail-closed契約。 |
| `test_emlis_ai_complete_material_service.py` | material段階の根拠不足・断片除外。 |
| `test_emlis_ai_complete_focus_selector.py` | coverage group別FocusSelector。 |
| `test_emlis_ai_complete_relation_graph.py` | RelationGraph 2.0 bridge。 |
| `test_emlis_ai_complete_sentence_plan_v2.py` | SentencePlan 2.0。 |
| `test_emlis_ai_complete_surface_realizer_v2.py` | Surface Realizer 2.0。 |
| `test_emlis_ai_complete_grounding_binding.py` | Binding-aware Grounding強化。 |
| `test_emlis_ai_complete_self_repair.py` | Self-Repair Loop。 |
| `test_emlis_ai_complete_composer_client.py` | CompleteComposerClient統合。 |
| `test_emlis_ai_complete_e2e_contract.py` | Reply diagnostics統合後のE2E contract。 |
| `test_emlis_ai_complete_scorecard.py` | Scorecard / fixture拡張。 |
| `rn-screen-contracts.test.js` | RN contract regression。 |

境界維持:
- DB physical name、既存API route、public response key、RN表示名 `Emlisの観測` は変更しない。
- `input_feedback.comment_text` は `observation_status=passed` かつ本文ありの場合だけ表示する。
- 外部AIレンタル、ローカルLLM、固定完成文テンプレ、入力専用テンプレは追加しない。
- raw user input を改善資料として要求しない。改善は diagnostic_summary / Gate reason / coverage / binding / repair trace / scorecard event で行う。
- これは完全Composer商品品質版ではなく、限定Composerの安全境界を土台にした完全Composer初期版のAlpha実装として読む。
