---
title: "02C_Cocolon_国家システム資料_契約_境界_検証系"
revision_date: "2026-06-01"
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

# 2026-05-16 差分追記: 商品品質版接続 Step0-7 contract / verification

Complete Composer初期版のE2E表示開通後、商品品質版接続 Step0-7 では次のcontract / regressionを追加で読む。

| contract | owner / test | 固定すること |
|---|---|---|
| Gate binding contract v2 | `emlis_ai_display_gate.py`, `test_emlis_ai_gate_binding_contract_v2.py`, `test_emlis_ai_diagnostic_summary_v2.py` | `binding_present` と `binding_used` を混同しない。Reader / Templateは原則 `binding_used=false`。 |
| Product quality coverage | `emlis_ai_complete_scorecard_service.py`, `test_emlis_ai_complete_product_quality_coverage.py` | coverage_group別に eligible / passed / rejected / unavailable reasonを集計する。 |
| Grounding relation binding v2 | `emlis_ai_complete_grounding_service.py`, `test_emlis_ai_complete_grounding_relation_binding_v2.py` | sentence_id単位の Evidence / PhraseUnit / relation を見て unsupported / relation_not_expressed を返す。 |
| Surface variation v2 | `emlis_ai_complete_surface_realizer.py`, `emlis_ai_template_echo_guard.py`, `test_emlis_ai_complete_surface_variation_v2.py` | surface_signature / same-ending / connector repetition / raw echoを検出する。 |
| Self-Repair v2 | `emlis_ai_complete_self_repair_service.py`, `test_emlis_ai_complete_self_repair_v2.py`, `test_emlis_ai_complete_self_repair_product_quality_v2.py` | reason別repair policy、meaning_added=false、gate_relaxed=falseを固定する。 |
| Tone Engine | `emlis_ai_complete_tone_policy.py`, `test_emlis_ai_complete_tone_engine_v2.py` | TonePolicyとToneGuardReportをmeta-onlyで扱い、診断調・命令調・過剰慰めを防ぐ。 |
| Product Quality Scorecard / Blind QA | `emlis_ai_complete_product_quality_scorecard_service.py`, `test_emlis_ai_complete_product_quality_scorecard.py`, `test_emlis_ai_complete_product_quality_scorecard_blind_qa.py`, `test_emlis_ai_complete_product_quality_connection_e2e.py` | machine metrics と Blind QA を分離し、Product Gate到達扱いにしない。 |
| Release ladder | `emlis_ai_complete_release_ladder_service.py`, `test_emlis_ai_complete_release_ladder_v2.py`, `test_emlis_ai_complete_release_ladder_connection_e2e.py` | internal / limited / broader_beta / product_gate判定をmeta-onlyで出す。public release appliedはfalse。 |
| RN passed-only | `Cocolon/tests/rn-screen-contracts.test.js` | Complete / ProductQuality metaだけでRN modalを出さない。 |

確認済み: `PYTHONPATH=services/ai_inference pytest -q tests/test_emlis_ai_*.py` は `421 passed`、`npm test -- --runInBand` は `21 passed`。ただしこれは商品品質版release完了ではなく、契約と判断材料が接続された確認として読む。

# 2026-05-17 差分追記: EmlisAI positive_recovery relation contract / regression boundary

positive_recovery relation_not_expressed 修正で守るcontractは次の通りです。

| contract | 固定内容 |
|---|---|
| relation surface contract | `emlis.relation_surface_contract.v1`。Reader / Surface / Self-Repair のcue語彙を揃える。 |
| Reader過緩和防止 | `関係` 単独、generic cue単独、relation cueなし3文候補では recovery relationを通さない。 |
| Self-Repair | declared relationだけを明示する。meaning_added=false / relation_ids_preserved=true / gate_relaxed=false。 |
| Surface | recovery relation lineをsurface_signature / grounding input / realization metaへ残す。固定完成文fallbackではない。 |
| Diagnostic | `reader_relation_signal_*` / `self_repair_relation_marker_*` はmeta-only。public response shapeは変えない。 |
| Log | 一時観測ログはdefault off。enabled時もraw input / public comment_text本文を出さない。 |
| RN | relation metaでは表示しない。public `observation_status=passed` + `comment_text` 非空だけ表示。 |

必須regression:
- `test_emlis_ai_relation_surface_contract.py`
- `test_emlis_ai_listener_reader_relation_surface_contract.py`
- `test_emlis_ai_listener_reader_relation_not_over_relaxed.py`
- `test_emlis_ai_complete_self_repair_positive_recovery_relation.py`
- `test_emlis_ai_complete_surface_recovery_relation_line.py`
- `test_emlis_ai_positive_recovery_relation_diagnostic_connection.py`
- `test_emlis_ai_complete_product_quality_positive_recovery_e2e.py`
- `test_emlis_ai_step7_log_cleanup.py`

禁止:
- Readerの `relation_not_expressed` を単純削除する。
- rejected / unavailable をRN表示する。
- recovery markerで入力にない原因・診断・prior loadを発明する。
- 通知400を同じ修正軸に混ぜる。



# 2026-05-17 差分追記: Observation Diagnostic Lockdown contract / verification boundary

Observation Diagnostic Lockdown Step0-8 で守るcontractは次の通りです。

| contract | 固定内容 |
|---|---|
| passed-only表示 | `input_feedback.comment_text` は public `observation_status=passed` かつ本文ありの場合だけRNで表示する。diagnostic metaだけでは表示しない。 |
| backend one-line diagnostic | submit 1回につき、env opt-in時だけ `emlis_observation_diagnostic_lockdown` を1本出す。success / exception両方を扱う。 |
| RN one-line diagnostic | env opt-in時だけ `emlis_observation_frontend_result` を1本出す。public statusをdiagnostic metaから強制 `passed` に補正しない。 |
| no raw text | raw input / memo / current_input / public comment_text / preview textを診断log・compare・branchへ入れない。 |
| compare | backend/RNを `trace_id` / `emotion_log_id` でjoinし、first divergenceを出す。backendだけ、RNだけで結論を出さない。 |
| branching | classification別に次に触る層を固定する。`unclassified_non_display` / `unknown_diagnostic_missing` は原因修正禁止。 |

必須regression:
- `test_emlis_ai_observation_diagnostic_lockdown.py`
- `test_emotion_submit_observation_diagnostic_log.py`
- `test_emlis_ai_observation_diagnostic_reply_meta.py`
- `test_emlis_ai_observation_diagnostic_backend_step5.py`
- `test_emlis_ai_observation_diagnostic_compare_step7.py`
- `test_emlis_ai_observation_diagnostic_branching_step8.py`
- `Cocolon/tests/rn-screen-contracts.test.js`

確認済み:
- backend diagnostic Step1-8対象: `47 passed, 1 warning`
- RN contract: `22 passed`

禁止:
- diagnostic分類前にSelfRepair / Surface Realizer / Tone Engineへ進む。
- Display Gate / Grounding / Readerを緩める。
- fixed observation sentence / input-specific template を追加する。
- DB/API/RN visible titleをrenameする。

# 2026-05-17 差分追記: EmlisAI Reader Relation Surface contract / verification boundary

Reader Relation Surface Step0-8 は、Observation Diagnostic Lockdownで確定した `candidate_generated_but_reader_rejected` への backend 修正です。検証系では、表示条件やGateを緩めたかではなく、Reader契約とlimited/A1 repairが fail-closed のまま接続されているかを確認します。

| 契約 | 確認すること |
|---|---|
| 宛名契約 | greeting生成側が許容する `さん/様/くん/君/ちゃん/氏` をReaderも許容する。敬称なしの任意名前は広く通さない。 |
| relation契約 | Readerへ渡すのは surface relation type。graph edge id、runtime branch id、`conflict.e1` などは expected relation として渡さない。 |
| repair契約 | limited/A1 repairは `addressee_not_clear` / `relation_not_expressed` だけを対象にする。Complete self-repairとは混ぜない。 |
| core / Gate契約 | repair後も core evaluation、Reader、Grounding、Template、Display Gate を通す。落ちた場合は従来通り `unavailable` / non-passed。 |
| diagnostic契約 | `limited_reader_repair` のattempted/applied/operations/marker key/relation typeだけを出す。raw input、memo、current_input、comment_text本文は出さない。 |
| test契約 | Reader repair直結・strict relation・product-quality・diagnostic系を通す。実装確認では EmlisAI関連 `531 passed, 1 warning` が現状基準。 |

非対象: RN表示条件、modal起動条件、response key、API route、DB physical name、Display Gate / Grounding / Template Guard の緩和。

# 2026-05-18 差分追記: ProductGate Measurement Step0-10 contract / verification boundary

ProductGate Measurement Step0-10 で守るcontractは次の通りです。これはProduct Gate達成判定ではなく、Product Gateへ進む測定接続の完了境界です。

## contract / boundary owner

| owner | 固定するcontract |
|---|---|
| `emlis_ai_complete_product_quality_measurement_contract_inventory.py` | `/emotion/submit`、`input_feedback.comment_text`、`input_feedback.emlis_ai.observation_status`、RN passed-only、DB physical name、Gate fail-closed、meta-only、Exit Gate非releaseを固定する。 |
| `emlis_ai_observation_diagnostic_compare.py` | backend passedとdisplay confirmedを分離する。frontend未join / modal falseはdisplay countへ入れない。 |
| `emlis_ai_complete_product_quality_measurement_connection.py` | scorecard event、coverage group、Blind QA candidate、next action routing、Exit Gate summaryをmeta-onlyで構築する。 |
| `emlis_ai_complete_product_quality_scorecard_service.py` | read_feelingはBlind QA由来。machine metricsだけでは埋めない。 |
| `emlis_ai_complete_release_ladder_service.py` | coverage missing / Blind QA missing / contract breakをrelease blockerとして扱う。 |
| `emlis_observation_product_quality_measurement.py` | local JSON/Markdown outputはdiagnostic log行だけから作り、raw input / public comment本文を含めない。 |

## verification owner

| test | 固定すること |
|---|---|
| `test_emlis_ai_complete_product_quality_measurement_contract_inventory_step0.py` | Step0-10 scope、contract locks、non-targets。 |
| `test_emlis_ai_complete_product_quality_measurement_connection.py` | display_confirmed counting、scorecard / release connection、coverage、Blind QA、routing、Exit Gate。 |
| `test_emlis_observation_product_quality_measurement_tool_step8.py` | local tool outputのmeta-only / JSON / Markdown。 |
| `test_emlis_ai_complete_product_quality_measurement_regression_step9.py` | public contract / meta-only / counting semantics / RN表示期待値。 |
| `test_emlis_ai_complete_product_quality_measurement_exit_gate_step10.py` | diagnostic missing、backend rejected、passed hidden、display confirmed のfixture。 |

禁止:
- backend passedだけを `passed_display_count` として数えない。
- regression greenやExit Gate readyをProduct Gate達成・public releaseとして扱わない。
- RN表示条件、public response key、DB physical name、Gate条件を測定のために変えない。
- raw入力本文・public `comment_text` 本文をdiagnostic / scorecard / release / local toolへ入れない。

# 2026-05-20 差分追記: Runtime Surface Quality Step0-12 contract / verification boundary

Runtime Surface Quality Step0-12 で守るcontractは次の通りです。これはProduct Gate達成判定ではなく、ProductGate Measurement後に表示文品質を測定し、次branchへ引き渡すための完了境界です。

## contract / boundary owner

| owner | 固定するcontract |
|---|---|
| `emlis_ai_runtime_surface_quality_contract_inventory.py` | Step0-12 scope、RN/API/DB/Gate非対象、meta-only、handoff-onlyを固定する。 |
| `emlis_ai_runtime_surface_source_lock.py` | composer_source分類とversion metaを本文なしで保持し、raw input / public comment_text本文を出さない。 |
| `emlis_ai_complete_surface_quality_signature.py` | surface signatureはkey / count / hash / warning codeのみ。本文保存ではない。 |
| `emlis_ai_complete_product_quality_scorecard_service.py` | surface metrics / tone metrics / Blind QA / Long-runをscorecardへ接続し、read feelingはmachine metricsで自動採点しない。 |
| `emlis_ai_complete_surface_quality_branching.py` | 複数blocker時の分岐優先順位を固定し、unknown / diagnostic missingのまま修正へ進まない。 |
| `emlis_ai_runtime_surface_exit_gate.py` | `product_gate_ready` / `product_gate_reached` / `public_release_applied` をfalseのまま、handoff summaryだけを出す。 |

## verification owner

| test | 固定すること |
|---|---|
| `test_emlis_ai_runtime_surface_quality_contract_inventory_step0.py` | Step0-12 scope、contract locks、forbidden keys。 |
| `test_emlis_ai_runtime_surface_source_lock_step1.py` | source lock、complete_initial誤分類防止、meta-only。 |
| `test_emlis_ai_complete_surface_quality_signature_step2.py` | signature / template major / grammar warning / no raw text。 |
| `test_emlis_ai_runtime_surface_scorecard_metrics_step3.py` | scorecard surface metrics。 |
| `test_emlis_ai_runtime_surface_coverage_baseline_step4.py` | required coverage groups、missing group blocker。 |
| `test_emlis_ai_runtime_surface_quality_branching_step5.py` | branch優先順位、repair_allowed境界。 |
| `test_emlis_ai_runtime_surface_complete_activation_branch_step6.py` | AP0 / rollout / registry / complete runtime alignment。 |
| `test_emlis_ai_runtime_surface_realizer_anti_template_step7.py` | fixed template追加なしのanti-template。 |
| `test_emlis_ai_runtime_surface_phrase_unit_grammar_normalizer_step8.py` | grammar normalizer / unsupported_completion_added=false。 |
| `test_emlis_ai_runtime_surface_tone_engine_2_1_step9.py` | tone major、read feeling machine auto-fill禁止。 |
| `test_emlis_ai_runtime_surface_self_repair_step10.py` | bounded repair、meaning_added=false。 |
| `test_emlis_ai_runtime_surface_blind_qa_long_run_step11.py` | Blind QA candidateは本文なし、rating-only。 |
| `test_emlis_ai_runtime_surface_exit_gate_step12.py` | Exit Gateはhandoff-only、public release false。 |

禁止:
- RN表示条件、public response key、DB physical name、Gate条件を測定のために変えない。
- raw入力本文・public `comment_text` 本文をdiagnostic / scorecard / release / QA候補へ入れない。
- fixed observation sentence / input-specific template / external AI / local LLMを追加しない。
- Step12完了をProduct Gate達成・public release適用として扱わない。

# 2026-05-21 差分追記: Observation Reply Step0-14 contract / verification boundary

EmlisAI 観測返答 Step0-14 で守るcontractは次の通りです。これはpublic APIやDB物理名を変更する工程ではなく、EmlisAI reply runtimeのbranch / meta / display repair / scorecard / handoffを固定する工程です。

観測返答 Step0-14 の固定契約:

- 通常入力でEmlis renderが完走し安全境界を通過する場合、`eligible_observation` または `low_information_observation` を返す。
- 低情報観測は新しいpublic `observation_status` ではなく、内部metaの `observation_reply_kind=low_information_observation` として扱う。
- RN表示条件は引き続き `observation_status === passed` かつ `commentText` 非空。
- Freeではユーザー辞書を使わない。サブスクでは明示/非明示の2モードで使うが、低情報入力を辞書だけでeligible化しない。
- 推論鎖は入力内関係からの3段階まで。出来事・人格・診断・行動指示を足さない。
- Display Gateは緩めない。低情報branch側の本文品質を満たして `passed + comment_text` にする。
- Step10 repairは、Phase7 rollout block / composer pre-connection rollout stop / release gate block / 非修復AI-generated rejectionを低情報観測へ救済しない。これらは `unavailable` / `rejected` のままfail-closedに残す。
- DB physical name、public API route、public response key、RN title `Emlisの観測` は変更しない。
- Step14はhandoff-onlyであり、Product Gate達成・public release適用を宣言しない。

## contract / verification owner

| 領域 | 確認file |
|---|---|
| Reply Contract / Inventory | `emlis_ai_observation_reply_contract.py`, `emlis_ai_observation_reply_contract_inventory.py`, `test_emlis_ai_observation_reply_contract.py`, `test_emlis_ai_observation_current_display_contract.py` |
| Eligibility / Low Information | `emlis_ai_observation_eligibility_service.py`, `test_emlis_ai_observation_eligibility_service.py`, `test_emlis_ai_low_information_red_cases.py` |
| User Fact Boundary | `emlis_ai_user_fact_grounding_boundary.py`, `test_emlis_ai_user_fact_grounding_boundary.py` |
| Internal Question / Dictionary / Material | `emlis_ai_internal_question_service.py`, `emlis_ai_observation_dictionary_loader.py`, `emlis_ai_observation_material_connector.py` |
| SentencePlan / Surface / Tone | `emlis_ai_observation_sentence_plan_roles.py`, `emlis_ai_observation_surface_realizer_tone.py`, `emlis_ai_observation_surface_realizer.py` |
| Display / Repair | `emlis_ai_observation_display_repair_integration.py`, `emlis_ai_display_gate.py`, `emlis_ai_reply_service.py`, `test_emlis_ai_observation_display_repair_integration.py`, `test_emlis_ai_phase7_staged_release.py`, `test_emlis_ai_display_contract.py` |
| RN optional meta | `test_emlis_ai_observation_rn_optional_meta_contract.py`, `rn-screen-contracts.test.js` |
| Scorecard / Fixture / Exit | `emlis_ai_observation_scorecard_blind_qa.py`, `emlis_ai_observation_regression_fixture_coverage.py`, `emlis_ai_observation_exit_gate_handoff.py` |

## 2026-05-22 差分追記: Step10 Repair Boundary contract / verification

`mashos-api_6(27).zip` のStep10 Repair Boundary修正で、次のcontractを前提資料に追加固定します。

| contract | 固定内容 |
|---|---|
| rollout block fail-closed | `connection_status=blocked_rollout`、`pre_connection_stop_stage=rollout`、`limited_composer_rollout_not_allowed` は低情報repairで表示化しない。 |
| reply_service二重防御 | `limited_release_decision` / `composer_client_resolution` / `phase7_rollout_gate` を見て、Phase7 rollout block時は `repair_allowed=False` / `step10_blocked_by_phase7_rollout` にする。 |
| ordinary low-information維持 | `feature_flag_disabled` やordinary unavailableを理由に、真正の低情報入力を一律blockしない。 |
| non-repairable candidate rejection | `unsupported_sentence` / `graph_evidence_not_used` / `core_relation_not_reflected` / `phase8_body_too_short` はAI-generated candidateの非修復rejectionとして低情報branchへ逃がさない。 |
| meta整合 | Step10 metaに `applied=false`、`comment_text_allowed=false`、runtime block reason、composer block reasons、public contract非変更flagsを残す。 |
| contract非変更 | RN表示条件、public API route、DB physical name、public response key、`observation_status` enumは変更しない。 |

確認対象test:

- `test_phase7_internal_stage_blocks_non_allowlisted_default_client`
- `test_step10_does_not_repair_blocked_rollout_resolution`
- `test_step10_rollout_block_meta_contract_is_attached_consistently`
- `test_step10_reply_service_runtime_block_reason_only_blocks_rollout`
- `test_step10_e2e_rejected_candidate_never_exposes_generated_body`


# 2026-05-21 差分追記: Emlis観測専用辞書 Phase0-5 contract / guard

Emlis観測専用辞書 Phase0-5 のcontract / guardは、既存public contractを広げるためではなく、内部辞書がpublic route・response・DB・RN表示条件を動かさないことを検査するために追加されています。

| guard / test | owner | 固定する境界 |
|---|---|---|
| current input bundle test | `tests/test_emlis_ai_current_input_bundle.py` | 内部正規化で legacy `current_input` shapeを壊さない。 |
| schema test | `tests/test_emlis_ai_observation_structure_dictionary_schema.py` | 構造観測辞書のschema / dictionaryが実装用schemaに従う。 |
| loader test | `tests/test_emlis_ai_observation_structure_dictionary_loader.py` | entry / relation参照、forbidden inference、contract boundary flagを検査する。 |
| phase4 connection test | `tests/test_emlis_ai_observation_structure_phase4_connection.py` | Gate / Composer接続がmeta-onlyであり、辞書が完成文を返さないことを固定する。 |
| phase5 fixture / Blind QA test | `tests/test_emlis_ai_observation_structure_phase5_fixtures_blind_qa.py` | 7fixture、category_parallel / category_overlap、raw text非混入、public contract維持を固定する。 |

禁止: contract guardを理由にpublic response keyを増減する、`observation_status` enumを増やす、`comment_text`生成元を辞書へ移す、DB physical nameをrenameする、Display Gateを緩める。

# 2026-05-22 差分追記: Emlis観測専用辞書 ActionConversion / UnformedSelfInsight Phase0-8 contract / guard

Emlis観測専用辞書 ActionConversion / UnformedSelfInsight Phase0-8 のcontract / guardは、既存public contractを広げるためではなく、内部辞書の観測材料追加がpublic route・response・DB・RN表示条件を動かさないことを検査するために追加されています。

| guard / test | owner | 固定する境界 |
|---|---|---|
| schema test | `tests/test_emlis_ai_observation_structure_dictionary_schema.py` | `19 relations / 18 entries`、追加relation / entry、surface_policy、completed reply / raw text系key非混入を固定する。 |
| loader test | `tests/test_emlis_ai_observation_structure_dictionary_loader.py` | `我慢した` / `言えなかった` / `合わせた` / `わからない` のentry選択、追加relation選択、low_information_boundaryを固定する。 |
| phase4 connection test | `tests/test_emlis_ai_observation_structure_phase4_connection.py` | 単語だけで強接続しないrelationと、memo / memo_action差分や閉じ方根拠がある場合だけ接続するrelationを固定する。 |
| phase5 fixture / Blind QA test | `tests/test_emlis_ai_observation_structure_phase5_fixtures_blind_qa.py` | 追加6caseの expected / forbidden relation、low information候補、material fieldsを固定する。 |
| phase6 forbidden inference / meta-only test | `tests/test_emlis_ai_observation_structure_phase6_forbidden_inference_meta_contract.py` | raw input / memo / memo_action / comment_text / completed reply / 辞書本文 / forbidden inference本文がmetaへ漏れないことを固定する。 |
| Step10回帰 | `test_emlis_ai_phase7_staged_release.py`, `test_emlis_ai_observation_display_repair_integration.py`, `test_emlis_ai_observation_current_display_contract.py`, `test_emlis_ai_observation_reply_contract.py`, `test_emlis_ai_low_information_observation_composer.py`, `test_emlis_ai_runtime_surface_self_repair_step10.py` | 新規辞書材料が rollout block / release gate block / unavailable を `passed + comment_text` に変えないことを確認する。 |

Phase6 meta-only contractで明示falseとして保管する主なflag:

```text
dictionary_returns_completed_reply
dictionary_returned_completed_reply
completed_reply_from_dictionary
display_gate_relaxed
api_route_changed
response_key_changed
db_physical_name_changed
rn_visible_contract_changed
cause_inferred_from_category
cause_inferred_from_emotion_strength
personality_tendency_allowed
```

禁止: contract guardを理由にpublic response keyを増減する、`observation_status` enumを増やす、`comment_text`生成元を辞書へ移す、DB physical nameをrenameする、Display Gateを緩める、forbidden inference本文やraw inputをmetaへ保存する。



# 2026-05-23 差分追記: Runtime Surface Pre-Return Gate / Shallow V2 contract / guard

EmlisAI Runtime Surface Pre-Return Gate + Shallow Surface Realizer V2 Step0-10 のcontract / guardは、既存public contractを広げるためではなく、壊れたsurface候補が `passed + comment_text` としてRNに届かないことを検査するために追加されています。

| guard / test | owner | 固定する境界 |
|---|---|---|
| runtime surface pre-return gate | `emlis_ai_runtime_surface_pre_return_gate.py`, `test_emlis_ai_runtime_surface_pre_return_gate.py` | `surface_template_major` / `generic_center_phrase` / `same_connector_run` / `malformed_phrase_unit` をmeta-onlyでblock reason化する。 |
| display pre-return connection | `emlis_ai_display_gate.py`, `emlis_ai_reply_service.py`, `test_emlis_ai_runtime_surface_pre_return_gate_step2.py` | surface fatal候補を `observation_status=passed` にせず、comment_textを空にする。 |
| malformed nominalization guard | `emlis_ai_limited_sentence_quality_guard.py`, `emlis_ai_phrase_unit_grammar_normalizer.py`, `test_emlis_ai_malformed_nominalization_phrase_unit_guard.py` | `今までこと` / `大丈夫こと` / `まだないかこと` / `〜なくてこと` などを本文生成へ渡さない。 |
| shallow phrase unit guard | `emlis_ai_limited_composer_client.py`, `test_emlis_ai_shallow_phrase_unit_guard_step4.py` | shallow phrase unit作成時にguardを通し、safe unitだけをrealizerへ渡す。 |
| Shallow Surface Realizer V2 | `emlis_ai_limited_composer_client.py`, `test_emlis_ai_shallow_surface_realizer_v2_step5.py` | `Xが中心にあります` / `その中でも` 反復を標準表示から外し、role-based surfaceにする。 |
| low information specificity | `emlis_ai_low_information_observation_composer.py`, `test_emlis_ai_low_information_specificity_policy_step6.py` | safe anchorがある時に完全抽象へ逃げない。ただしraw long copyやevent / fact捏造をしない。 |
| bounded repair / reroute | `emlis_ai_bounded_repair_reroute.py`, `test_emlis_ai_bounded_repair_reroute_step7.py` | shallow V2 rerenderは1回だけ。safety / rollout / release gate / non-repairable rejectionは表示化しない。 |
| diagnostics / scorecard | `emlis_ai_complete_reply_diagnostics_service.py`, `emlis_ai_complete_scorecard_service.py`, `test_emlis_ai_*diagnostics_scorecard_step8.py` | runtime surface gate結果をscorecard / diagnosticsへmeta-onlyで渡す。 |
| diagnostic lockdown / QA | `emlis_ai_observation_diagnostic_lockdown.py`, `test_emlis_ai_observation_diagnostic_lockdown_surface_gate_step9.py` | Render-visible lockdownログで `surface_quality_blocked` として分類できる。 |
| exit criteria | `emlis_ai_runtime_surface_exit_criteria.py`, `test_emlis_ai_runtime_surface_exit_criteria_step10.py` | 表示本文のexit criteriaをmeta-onlyで判定する。実機確認結果ではなく確認基準。 |

禁止: contract guardを理由にpublic response keyを増減する、`observation_status` enumを増やす、RN表示条件を `observation_reply_kind` やsurface reasonで分岐する、DB physical nameをrenameする、Display Gate / Grounding / Template Guardを緩める、raw inputやpublic `comment_text` 本文をdiagnosticsへ保存する。


# 2026-05-24 差分追記: EmlisAI public feedback meta boundary / timeout recovery / low-information prompt / notification uuid boundary

EmlisAI immediate responseの最新contractは、internal metaとpublic metaを分けることです。RN visible contractは従来どおり `passed + comment_text` だけを見ます。

## Public feedback meta boundary

| key / boundary | 最新contract |
|---|---|
| `input_feedback.comment_text` | 表示本文の互換key。key名は変更しない。 |
| `input_feedback.emlis_ai` | `emlis.public_input_feedback_meta.v1` のpublic-safe subset。内部meta全文ではない。 |
| `public_feedback_meta_boundary` | `sanitized=true`, `internal_meta_returned=false`, `raw_input_included=false`, `comment_text_included=false`, `max_bytes=12288` を持つ境界marker。 |
| `observation_status` | public enumは既存の `passed` / `rejected` / `unavailable` / `safety_blocked` のまま。 |
| input_feedback inclusion | `comment_text` 非空 + public `observation_status == "passed"` の時だけ返す。 |

public metaへ出さないもの: `raw_input`、`memo`、`memo_text`、`raw_text`、`current_input`、`evidence_spans`、`observation_graph`、`perspective_reports`、`complete_reply_service_diagnostics`、scorecard全文、fixture QA全文、public `comment_text` 本文。

## Test / guard

| test / guard | 固定する境界 |
|---|---|
| `test_emlis_ai_public_feedback_meta.py` | sanitizer whitelist、hard byte limit、fail-closed unavailable meta。 |
| `test_emotion_submit_public_feedback_meta_boundary.py` | route response肥大化防止、raw非混入、passed + comment_textのみfeedback返却。 |
| `test_emotion_reflection_publish_public_feedback_contract.py` | publish pathでも同じpublic feedback inclusion条件を使う。 |
| `test_emotion_submit_observation_diagnostic_log.py` | public responseはsanitized、diagnostic lockdownはinternal metaを使える。 |
| `test_emotion_submit_notification_settings_uuid_boundary.py` | uuid型owner filterへglobal sentinelを混ぜない。 |
| `rn-screen-contracts.test.js` | timeout時に保存失敗断定を使わない、再送しない、draftをclearしない。 |

low-information質問surfaceは、runtime本文で `よければ、何がありましたか。` を出さず、`詳しく残せそうなら、〜残してみませんか。` 系を正規質問surfaceとして扱う。

禁止: public response keyをrenameする、public `observation_status` enumを増やす、RN表示条件を `observation_reply_kind` やdiagnosticsに寄せる、Display Gate / Grounding / Template Guardを緩める、raw本文をdiagnostics / public metaへ入れる。


# 2026-05-24 差分追記: Visible Surface Acceptance QA Step0-8 contract / guard

Visible Surface Acceptance QA Step0-8 のcontract / guardは、表示率を上げるためではなく、`passed + comment_text` としてRNに出る本文が表示文品質を満たすかをpublic表示前に検査するために追加されています。public route、response key、DB physical name、RN表示条件は変更しません。

| guard / test | owner | 固定する境界 |
|---|---|---|
| inventory fixture | `tests/fixtures/emlis_ai_visible_surface_acceptance_fixtures.py`, `test_emlis_ai_visible_surface_acceptance_inventory_step0.py` | スクショ由来のred / repair_required / pass / out_of_scope。`Userさん` はaccount nameなら赤ケースではない。 |
| `たりこと` guard | `emlis_ai_phrase_unit_grammar_normalizer.py`, `emlis_ai_limited_sentence_quality_guard.py`, `test_emlis_ai_malformed_nominalization_phrase_unit_guard.py` | `したりこと` / `たりこと` を `malformed_nominalization_tari_fragment` として止め、安全な `したこと` / `したりすること` は通す。 |
| Runtime Surface接続 | `emlis_ai_runtime_surface_pre_return_gate.py`, `test_emlis_ai_runtime_surface_pre_return_gate.py`, `test_emlis_ai_runtime_surface_pre_return_gate_step2.py` | comment_text表面で `たりこと` が見つかれば `passed=false` / malformed count増加 / rejection reason付与。 |
| Visible Surface Acceptance Gate | `emlis_ai_visible_surface_acceptance_gate.py`, `test_emlis_ai_visible_surface_acceptance_gate.py` | meta-only report、中心感情/本文焦点bridge、positive-only over-burden、malformed visible surfaceの判定。 |
| reply path connection | `emlis_ai_reply_service.py`, `emlis_ai_display_gate.py`, `emlis_ai_observation_display_repair_integration.py`, `test_emlis_ai_visible_surface_acceptance_reply_path_step4.py` | red / repair_required / block / fail_closedを表示前fail-closedへ接続。yellow/warnは停止しない。 |
| low-information tone profile | `emlis_ai_low_information_observation_composer.py`, `emlis_ai_observation_surface_realizer_tone.py`, `test_emlis_ai_low_information_tone_profile_step5.py` | positive_only / negative_only / mixed / self_insight / neutral_or_unknownのtone境界。 |
| public meta sanitizer | `emlis_ai_public_feedback_meta.py`, `test_emlis_ai_public_feedback_meta.py`, `test_emotion_submit_public_feedback_meta_boundary.py` | visible gate summaryは小さいsubsetだけ。raw input / evidence / comment_text本文をpublic metaへ入れない。blocking時はfeedbackを返さない。 |
| RN contract | `Cocolon/tests/rn-screen-contracts.test.js` | `visible_surface_acceptance_gate` metaだけでRN modalを表示しない。public `passed + comment_text` のみ表示する。 |
| regression execution stability | `emlis_ai_observation_structure_dictionary_loader.py`, `test_emlis_ai_observation_structure_dictionary_loader.py`, `test_emlis_ai_observation_structure_dictionary_schema.py` | `jsonschema` import依存でcollectionが詰まらないよう、bundled schema subsetをstdlib検証する。 |

Visible Surface Acceptance Gate reportのpublic-safe summaryとして許可される範囲:

```text
evaluated
passed
classification
action
rejection_reasons
```

禁止: gate reportへ raw input / raw text / evidence text / comment_text body / candidate_comment_text を入れる、visible gate blockingなのに `input_feedback` を返す、RN表示条件を `visible_surface_acceptance_gate.passed` に変える、`observation_status` enumを増やす、DB physical name / write pathを変える、固定fallback文で壊れたsurfaceを覆う。


# 2026-05-25 差分追記: Product Visible Surface Reliability + Koto Splice Repair contract / guard

EmlisAI Product Visible Surface Reliability + Koto Splice Repair Step0-8 のcontract / guardは、表示率を上げるための緩和ではなく、C相当の壊れたsurfaceを `passed + comment_text` としてRNに届けないための追加境界です。

| guard / test | owner | 固定する境界 |
|---|---|---|
| fixture inventory | `tests/fixtures/emlis_ai_visible_surface_acceptance_fixtures.py`, `tests/fixtures/emlis_ai_runtime_surface_red_fixtures.py`, `test_emlis_ai_visible_surface_acceptance_inventory_step0.py` | A pass、B repair_required、C red、runtime redを固定する。 |
| PhraseUnit / Limited Guard | `emlis_ai_phrase_unit_grammar_normalizer.py`, `emlis_ai_limited_sentence_quality_guard.py`, `test_emlis_ai_malformed_nominalization_phrase_unit_guard.py` | `取らなければこと` / `予感こと` / `ことこと` を止め、`感じたこと` / `必要なこと` / `予定のこと` を巻き込まない。 |
| Runtime Surface Gate | `emlis_ai_runtime_surface_pre_return_gate.py`, `emlis_ai_complete_surface_quality_signature.py`, `test_emlis_ai_runtime_surface_pre_return_gate.py`, `test_emlis_ai_complete_surface_quality_signature_step2.py` | comment_text全体のkoto spliceを検出し、meta-only code / countで返す。 |
| Visible Surface Acceptance Gate | `emlis_ai_visible_surface_acceptance_gate.py`, `test_emlis_ai_visible_surface_acceptance_gate.py` | koto spliceはred。relation skeleton / analytic registerはrepair_requiredへ回す。 |
| Shallow Surface Realizer V2 | `emlis_ai_relation_surface_contract.py`, `emlis_ai_limited_composer_client.py`, `test_emlis_ai_relation_surface_contract.py`, `test_emlis_ai_limited_composer_client.py` | `PhraseSurfaceShapeSignal` と圧縮により、危険phraseを `こと` に直結しない。 |
| bounded repair reroute | `emlis_ai_bounded_repair_reroute.py`, `emlis_ai_reply_service.py`, `test_emlis_ai_bounded_repair_reroute_step7.py` | Visible Gate `rerender_surface` を一回修復に接続し、二回目以降や非修復理由はfail-closedにする。 |
| public meta / diagnostic | `emlis_ai_public_feedback_meta.py`, `emotion_submit_service.py`, `emlis_ai_observation_diagnostic_lockdown.py`, `test_emlis_ai_public_feedback_meta.py`, `test_emotion_submit_observation_diagnostic_log.py` | `display_absence_summary` は本文なしのcode / boolean / countだけにする。 |
| RN contract | `Cocolon/tests/rn-screen-contracts.test.js` | Step7 diagnostic meta、visible gate meta、candidate_comment_text、raw_inputではRN表示を開かない。 |

禁止: `こと` を全面禁止する、safeな `感じたこと` まで落とす、visible gate metaだけで表示を開く、public metaへcandidate本文を入れる、Gateを緩める、固定fallback文へ戻す、外部AI / local LLMを追加する。


# 2026-05-26 差分追記: ESO surface contract completion / public meta verification boundary

EmlisAI Environment State Output Surface Contract Completion Phase0-6 で守るcontractは次の通り。

| contract | 固定内容 |
|---|---|
| candidate completion | `environment_state_output_frame` connected + single_record_only + scope_marker_required の時だけ、surface validation前にfirst body lineへscope markerを一度だけ付与する。 |
| idempotent | 既存markerがある場合は二重付与しない。greeting lineには付けない。 |
| forbidden surface | 期間傾向・人格傾向・診断・category原因化・emotion strength原因化・回復処方は、markerの有無に関係なくrejectする。 |
| runtime double check | normalize前で補完しても、runtime pre-return gateで実comment_text上のmarker presenceを再確認する。signatureのみでは通さない。 |
| public meta boundary | completion result / raw input / surface contract full payload / candidate body / output theme ids をpublic metaへ出さない。 |
| display contract | `observation_status=passed` かつcomment_text非空の時だけpublic `input_feedback` を返す。 |

必須regression:

- `test_emlis_ai_environment_state_output_surface_contract_completion.py`
- `test_emlis_ai_runtime_surface_pre_return_gate.py`
- `test_emlis_ai_public_feedback_meta.py`
- `test_emotion_submit_public_feedback_meta_boundary.py`
- `test_cocolon_text_generation_core_emlis_observation_adapter.py`
- `test_cocolon_text_generation_core_step15_stabilization.py`
- `test_emlis_ai_limited_composer_client.py`
- `test_emlis_ai_observation_display_repair_integration.py`

禁止: `environment_state_output_scope_marker_missing` を無視する、common core passedをpublic passedへ上書きする、forbidden claimをmarkerで修復する、runtime pre-return gateを削除する、public metaへ内部completion resultやraw inputを出す。


# 2026-05-26 差分追記: EmlisAI状態回答 Phase8-10 contract / public meta boundary

EmlisAI状態回答と人間的フォローのcontract / guardは、表示率を上げるための緩和ではなく、内部materialがpublic responseやPiece / Analysisへ漏れないようにするための追加境界です。

| contract / guard | owner | 固定する境界 |
|---|---|---|
| 状態回答surface contract | `emlis_ai_state_answer_surface_contract.py`, `test_emlis_ai_state_answer_surface_contract.py` | internal materialとして観測層・フォロー層を分ける。public key化しない。 |
| Gate boundary | `emlis_ai_state_answer_gate_boundary.py`, `test_emlis_ai_state_answer_gate_boundary.py` | 診断、行動指示、人格断定、原因断定、単発傾向化、怒り同意をblockする。 |
| Public meta boundary | `emlis_ai_public_feedback_meta.py`, `test_emlis_ai_state_answer_public_meta_boundary.py`, `test_emotion_submit_public_feedback_meta_boundary.py` | raw input / memo / memo_action / raw_text / evidence text / comment_text body / state answer contract bodyをpublicへ出さない。 |
| Display gate boundary | `emlis_ai_display_gate.py`, `emlis_ai_runtime_surface_pre_return_gate.py`, `emlis_ai_visible_surface_acceptance_gate.py` | Gate blocked surfaceを `passed + comment_text` として出さない。 |
| Composer role plan | `emlis_ai_state_answer_composer_contract.py`, `test_emlis_ai_state_answer_composer_connection.py` | 完成文テンプレではなく、Observation section / Human follow sectionのrole planとして渡す。 |
| 表示品質QA | `test_emlis_ai_state_answer_visible_surface_qa.py` | 正解文一致ではなく、構造保持・比率・フォロー主役・禁止表面・public meta境界を検査する。 |
| 横断contract | `tests/contract/test_emlis_state_answer_phase10_cross_contract_regression.py`, `test_emlis_ai_state_answer_phase10_cross_contract_regression.py` | `/emotion/submit` public response維持、internal materialのpublic key化防止、Piece/AnalysisへのEmlis温度漏れ防止を固定する。 |

禁止: `/emotion/submit` routeやresponse modelを変える、`environment_state_output_frame` / `emlis_state_answer_surface_contract` / `state_answer_composer_role_plan` をpublic response key化する、visible gate / state answer gate metaだけでRN表示を開く、Piece / AnalysisへEmlisAIの話しかけ温度や人間的フォローを混ぜる。


# 2026-05-30 差分追記: Phase18商品品質安定化 contract / verification boundary

Phase18で確認するcontract / verificationは、表示率を上げるための緩和ではなく、既存public / RN contractを守ったまま商品品質赤を潰すための内部境界である。

| contract / guard | owner | 固定する境界 |
|---|---|---|
| Product Quality Matrix | `tests/helpers/emlis_ai_phase18_product_quality_matrix.py`, `test_emlis_ai_phase18_product_quality_stabilization.py` | Phase18対象のgreen/redをmeta-onlyで固定する。 |
| TwoStage Applicability | `emlis_ai_two_stage_applicability.py`, `test_emlis_ai_phase18_two_stage_applicability.py` | required適用境界。低情報・legacy・pre-connectionをlabel missingで巻き込まない。 |
| Candidate path | `emlis_ai_complete_composer_client.py`, `emlis_ai_reply_service.py`, `test_emlis_ai_phase18_complete_initial_candidate_path.py` | candidate generationとpublic display decisionを分ける。 |
| Low information repair | `emlis_ai_observation_display_repair_integration.py`, `test_emlis_ai_phase18_low_information_public_repair_boundary.py` | 短い低情報だけrepairし、safety / scope / AP0 / provided candidateをpassed化しない。 |
| Mode context | `emlis_ai_two_stage_section_surface_plan.py`, `emlis_ai_complete_sentence_planner.py`, `emlis_ai_complete_surface_realizer.py`, `test_emlis_ai_phase18_daily_unpleasant_mode_context.py` | daily_unpleasantをratio / mode contextでSurfaceRealizerへ渡す。 |
| Meta sanitizer | `emlis_ai_state_answer_surface_contract.py`, `emlis_ai_observation_structure_material_service.py`, `emlis_ai_observation_structure_connection_service.py`, `test_emlis_ai_phase18_state_answer_surface_contract_meta_sanitizer.py` | `surface_policy` 本体、辞書本文、raw input、comment bodyをmetaへ出さない。 |
| Diagnostic taxonomy | `emlis_ai_diagnostic_failure_taxonomy.py`, diagnostic tests | canonical classification + legacy aliasesをmeta-safeに扱う。 |
| Readability QA | `emlis_ai_visible_readability_quality.py`, `emlis_ai_visible_surface_acceptance_gate.py`, `test_emlis_ai_phase18_visible_readability_quality.py` | 内部role語・relation skeleton・反復・単純言い換えを検査する。 |
| Public E2E / RN contract | `test_emotion_submit_phase18_product_quality_e2e.py`, `Cocolon/tests/rn-screen-contracts.test.js` | public response shapeとRN `passed + commentText`契約を維持する。 |

禁止: Gate / Grounding / Reader / Templateを緩める、public response keyを追加する、RNでPhase18 metaを表示条件にする、raw input / generated candidate text / comment_text body / surface_policy本体をpublic metaへ入れる。
# 2026-06-01 差分追記: Phase20 contract / verification boundary

Phase20で確認するcontract / verificationは、表示率だけを上げるための緩和ではなく、既存public / RN contractを守ったまま、EmlisAIを入力直後の観測返答へ戻すための内部境界である。

| contract / verification | 主な実ファイル | 読み方 |
|---|---|---|
| Internal Response Contract | `emlis_ai_response_contract.py`, `test_emlis_ai_response_contract.py` | `response_kind -> public observation_status / comment_text_required / input_feedback_allowed` の対応を固定する。 |
| Safety Triage | `emlis_ai_safety_triage.py`, `test_emlis_ai_safety_triage_response_contract.py` | 自己否定安全応答と緊急安全境界を分け、危険入力を通常観測で上書きしない。 |
| Input Material Bundle | `emlis_ai_input_material_bundle.py`, `test_emlis_ai_input_material_bundle_phase20_3.py` | 文字数・case語彙ではなく入力束から材料量を読む。 |
| Gate Recovery Loop | `emlis_ai_gate_recovery_loop.py`, `test_emlis_ai_gate_recovery_loop_phase20_5.py` | Gate failureを短縮・限定・低情報/安全応答へ回し、emergency / infra以外のemptyをfatalにする。 |
| Public Boundary / RN Contract | `emlis_ai_public_feedback_meta.py`, `emotion_submit_service.py`, `test_emlis_ai_public_boundary_phase20_7.py`, `Cocolon/tests/rn-screen-contracts.test.js` | internal metaをpublic表示源にせず、RNは `passed + commentText` だけを見る。 |
| QA Matrix | `emlis_ai_response_contract_qa_matrix.py`, `test_emlis_ai_response_contract_qa_matrix_phase20_8.py` | exact generated text一致ではなく、family品質とfatal条件を確認する。 |
| Phase19 Withdrawal / Real-device recheck | `test_emlis_ai_phase20_9_phase19_withdrawal.py`, `test_emlis_ai_phase20_10_real_device_recheck.py` | C/D専用route撤回とA低情報実機再確認を回帰として固定する。 |
| Post-final Gate Recovery | `emlis_ai_reply_service.py`, `emlis_ai_gate_recovery_loop.py`, `test_emlis_ai_post_final_gate_recovery_phase20_13.py` | final pre-return gate後にdisplayable response kindが空白終了へ戻らないこと、safety / infraを通常観測へ偽装しないことを固定する。 |
| Gate Recovery Surface Binding QA | `emlis_ai_gate_recovery_loop.py`, `test_emlis_ai_gate_recovery_surface_phase20_15.py` | Gate Recovery surfaceのmaterial binding / family / repetitionを本文なしで検査し、fixed fallback化を検出する。 |

禁止: Gate / Grounding / Reader / Templateを緩める、public response keyを追加する、RNでPhase20 internal metaを表示条件にする、raw input / generated candidate text / comment_text body / internal contract body / surface binding bodyをpublic metaへ入れる。post-final recoveryはsafety emergency / infrastructureを通常観測へ変換するために使わない。
