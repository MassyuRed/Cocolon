---
title: "02C_Cocolon_国家システム資料_契約_境界_検証系"
revision_date: "2026-04-28"
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
- 現行状態: `active`
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
- 国家システム上の役割: Frontend helper / boundary module. Current system: account / subscription boundary helper.
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
- 現行状態: `legacy-live`
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
- 現行状態: `legacy-live`
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
- 現行状態: `legacy-live`
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
- 現行状態: `legacy-live`
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
- 現行状態: `active`
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
