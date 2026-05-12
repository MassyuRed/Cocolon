---
title: "02B_Cocolon_国家システム資料_Snapshot_Worker_Publish_Read系"
revision_date: "2026-05-12"
---

# 02B. Snapshot / Worker / Publish / Read系

この章では snapshot、queue、worker、publish / access policy、read-side API、startup、RN read surfaces を扱う。

## B1. RN app root / startup / provider boundary

### `Cocolon/App.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: App support file. Current system: app root / navigation.
- 上流:
  - `Cocolon/index.js` — import
- 下流:
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
- 落とすと漏れる関連ファイル:
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

### `Cocolon/AppRuntimeContext.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: `/app/bootstrap` の runtime state をRN全体へ渡す Read/Startup boundary。version gate、maintenance message、feature flagsを保持する。
- 上流:
  - `Cocolon/App.js` — import / provider
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

### `Cocolon/AuthContext.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: App support file. Current system: app provider / context boundary.
- 上流:
  - `Cocolon/App.js` — import
  - `Cocolon/AuthScreen.js` — import
  - `Cocolon/screens/AccountScreen.js` — import
  - `Cocolon/screens/FollowListScreen.js` — import
  - `Cocolon/screens/InputScreen.js` — import
  - `Cocolon/screens/SettingsAppSettingsScreen.js` — import
  - `Cocolon/screens/SettingsOtherScreen.js` — import
- 下流:
  - `Cocolon/lib/api/account/profileApi.js` — import
  - `Cocolon/lib/supabase.ts` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/AuthScreen.js`
  - `Cocolon/lib/api/account/profileApi.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/screens/AccountScreen.js`
  - `Cocolon/screens/FollowListScreen.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/screens/SettingsAppSettingsScreen.js`
  - `Cocolon/screens/SettingsOtherScreen.js`

### `Cocolon/SubscriptionContext.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: App support file. Current system: app provider / context boundary.
- 上流:
  - `Cocolon/App.js` — import
  - `Cocolon/screens/EchoesHistoryListScreen.js` — import
  - `Cocolon/screens/MyModelScreen.js` — import
  - `Cocolon/screens/MyWebHistoryScreen.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js` — import
  - `Cocolon/screens/SelfStructureReportViewerScreen.js` — import
  - `Cocolon/screens/SubscriptionSelectScreen.js` — import
  - `Cocolon/screens/TodayQuestionHistoryScreen.js` — import
- 下流:
  - `Cocolon/lib/iap/iapRuntimeCatalog.js` — import
  - `Cocolon/lib/subscriptionApi.js` — import
  - `Cocolon/lib/supabase.ts` — import
- 落とすと漏れる関連ファイル:
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

### `Cocolon/UnreadContext.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: App support file. Current system: app provider / context boundary.
- 上流:
  - `Cocolon/App.js` — import
  - `Cocolon/screens/EmotionLogScreen.js` — import
  - `Cocolon/screens/InputScreen.js` — import
  - `Cocolon/screens/MyModelReflectionsScreen.js` — import
  - `Cocolon/screens/MyModelScreen.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
  - `Cocolon/screens/SettingsOtherScreen.js` — import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/screens/EmotionLogScreen.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/screens/MyModelReflectionsScreen.js`
  - `Cocolon/screens/MyModelScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/SettingsOtherScreen.js`

### `Cocolon/index.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: --- Polyfills: MUST be first ---
- 上流:
  - なし
- 下流:
  - `Cocolon/App.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`


## B10. Account / subscription runtime tied to national state

### `mashos-api/ai/services/ai_inference/account_delete_service.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: Backend support module. Current system: account runtime.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
  - `mashos-api/ai/services/ai_inference/today_question_store.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py`
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/services/ai_inference/today_question_store.py`

### `mashos-api/ai/services/ai_inference/active_users_store.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `legacy-live`
- 国家システム上の役割: active_users_store.py (Phase 8+)
- 上流:
  - `mashos-api/ai/services/ai_inference/api_notice.py` — from import
  - `mashos-api/ai/services/ai_inference/api_profile_create.py` — from import
  - `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py` — from import
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — from import
  - `mashos-api/ai/services/ai_inference/middleware_active_user_touch.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_notice.py`
  - `mashos-api/ai/services/ai_inference/api_profile_create.py`
  - `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py`
  - `mashos-api/ai/services/ai_inference/api_subscription.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
  - `mashos-api/ai/services/ai_inference/middleware_active_user_touch.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/api_account_lifecycle.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: FastAPI route module for GET /account/display-name/availability, GET /account/profile/me, PATCH /account/profile/me, POST /account/delete
- 上流:
  - `Cocolon/App.js` — endpoint /account/profile/me
  - `Cocolon/lib/api/account/profileApi.js` — endpoint /account/profile/me
  - `Cocolon/screens/AccountScreen.js` — endpoint /account/profile/me
  - `Cocolon/screens/SettingsAppSettingsScreen.js` — endpoint /account/profile/me
  - `Cocolon/screens/SettingsOtherScreen.js` — endpoint /account/delete
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py` — import
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py` — from import
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
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

### `mashos-api/ai/services/ai_inference/api_account_status.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `legacy-live`
- 国家システム上の役割: Account Status (public profile stats) API
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_account_status_store.py` — from import
  - `mashos-api/ai/services/ai_inference/piece_generated_metrics.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_account_status_store.py`
  - `mashos-api/ai/services/ai_inference/piece_generated_metrics.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/api_account_visibility.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: Account Visibility / Privacy Settings API (Cocolon / MashOS / FastAPI)
- 上流:
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_history_manage.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/api_report_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_history_manage.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
  - `mashos-api/ai/services/ai_inference/api_report_reads.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py`

### `mashos-api/ai/services/ai_inference/api_activity_login.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: Activity API (Login day touch)
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py`

### `mashos-api/ai/services/ai_inference/observability.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: Phase11: 監視/ログ/通知の可観測性
- 上流:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py` — from import
  - `mashos-api/ai/services/ai_inference/cron_run_store.py` — from import
  - `mashos-api/ai/services/ai_inference/generation_lock.py` — from import
  - `mashos-api/ai/services/ai_inference/middleware_request_perf.py` — from import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
  - `mashos-api/ai/services/ai_inference/cron_run_store.py`
  - `mashos-api/ai/services/ai_inference/generation_lock.py`
  - `mashos-api/ai/services/ai_inference/middleware_request_perf.py`

### `mashos-api/ai/services/ai_inference/report_distribution_push_store.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/report_distribution_settings_store.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py` — from import
  - `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
  - `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/request_metrics.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: Backend support module. Current system: runtime boundary / infrastructure.
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — import
  - `mashos-api/ai/services/ai_inference/middleware_request_perf.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/middleware_request_perf.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/subscription.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `legacy-live`
- 国家システム上の役割: Subscription / Mode primitives (Step 1)
- 上流:
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
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
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

### `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `legacy-live`
- 国家システム上の役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_release_config.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_capability.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_subscription.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_capability.py`
  - `mashos-api/ai/services/ai_inference/subscription_release_config.py`
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py`
  - `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/subscription_config.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `legacy-live`
- 国家システム上の役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 上流:
  - `mashos-api/ai/services/ai_inference/subscription_live_console_check.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_runtime_config.py` — from import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/subscription_live_console_check.py`
  - `mashos-api/ai/services/ai_inference/subscription_runtime_config.py`

### `mashos-api/ai/services/ai_inference/subscription_live_console_check.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/subscription_config.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_release_config.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/subscription_config.py`
  - `mashos-api/ai/services/ai_inference/subscription_release_config.py`
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py`

### `mashos-api/ai/services/ai_inference/subscription_projection.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `legacy-live`
- 国家システム上の役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_webhooks.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py`
  - `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py`
  - `mashos-api/ai/services/ai_inference/subscription_webhooks.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/subscription_release_config.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_live_console_check.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py`
  - `mashos-api/ai/services/ai_inference/subscription_live_console_check.py`
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py`
  - `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py`

### `mashos-api/ai/services/ai_inference/subscription_runtime_config.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/subscription_config.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/subscription_config.py`

### `mashos-api/ai/services/ai_inference/subscription_store.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: subscription_store.py (Step 2)
- 上流:
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
- 下流:
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
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

### `mashos-api/ai/services/ai_inference/subscription_trial_store.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/subscription_verifier_android.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_live_console_check.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_release_config.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_webhooks.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_projection.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py`
  - `mashos-api/ai/services/ai_inference/subscription_live_console_check.py`
  - `mashos-api/ai/services/ai_inference/subscription_projection.py`
  - `mashos-api/ai/services/ai_inference/subscription_release_config.py`
  - `mashos-api/ai/services/ai_inference/subscription_webhooks.py`

### `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_release_config.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_webhooks.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_projection.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py`
  - `mashos-api/ai/services/ai_inference/subscription_projection.py`
  - `mashos-api/ai/services/ai_inference/subscription_release_config.py`
  - `mashos-api/ai/services/ai_inference/subscription_webhooks.py`

### `mashos-api/ai/services/ai_inference/subscription_webhooks.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: Backend support module. Current system: subscription / entitlement / distribution runtime.
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/subscription_projection.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/subscription_projection.py`
  - `mashos-api/ai/services/ai_inference/subscription_verifier_android.py`
  - `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py`


## B2. RN Analysis / Self Structure read surfaces

### `Cocolon/components/selfStructure/SelfStructureDeepRenderer.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: RN shared component module. Current system: Analysis / Self Structure surface.
- 上流:
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js` — import
  - `Cocolon/screens/SelfStructureReportViewerScreen.js` — import
- 下流:
  - `Cocolon/ui/applyTypographyTokens.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js`
  - `Cocolon/screens/SelfStructureReportViewerScreen.js`
  - `Cocolon/ui/applyTypographyTokens.js`

### `Cocolon/screens/MyWebContentFirstScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: Analysis / Self Structure surface.
- 上流:
  - `Cocolon/screens/MyWebScreen.js` — import
- 下流:
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/screens/MyWebMenuCommon.js` — import
  - `Cocolon/screens/MyWebReportViewerScreen.js` — import
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/screens/MyWebMenuCommon.js`
  - `Cocolon/screens/MyWebReportViewerScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js`
  - `Cocolon/ui/applyTypographyTokens.js`

### `Cocolon/screens/MyWebEmotionAnalysisScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: Analysis / Self Structure surface.
- 上流:
  - `Cocolon/screens/MyWebScreen.js` — import
- 下流:
  - `Cocolon/screens/MyWebMenuCommon.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/screens/MyWebMenuCommon.js`
  - `Cocolon/screens/MyWebScreen.js`

### `Cocolon/screens/MyWebEnsureClient.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: MyWebEnsureClient.js
- 上流:
  - なし
- 下流:
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`

### `Cocolon/screens/MyWebHistoryScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `shared`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: Analysis / Self Structure surface.
- 上流:
  - `Cocolon/App.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
- 下流:
  - `Cocolon/AppRuntimeContext.js` — import
  - `Cocolon/SubscriptionContext.js` — import
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/historyRetentionLabel.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/AppRuntimeContext.js`
  - `Cocolon/SubscriptionContext.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/historyRetentionLabel.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`

### `Cocolon/screens/MyWebInputHistoryMenuScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: Analysis / Self Structure surface.
- 上流:
  - `Cocolon/screens/MyWebScreen.js` — import
- 下流:
  - `Cocolon/screens/MyWebMenuCommon.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/screens/MyWebMenuCommon.js`
  - `Cocolon/screens/MyWebScreen.js`

### `Cocolon/screens/MyWebReportHistoryScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `legacy-live`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: Analysis / Self Structure surface.
- 上流:
  - `Cocolon/screens/MyWebScreen.js` — import
- 下流:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/historyRetentionLabel.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/screens/MyWebReportScheduleUtils.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_report_reads.py` — endpoint /report-reads/mark
- 落とすと漏れる関連ファイル:
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/historyRetentionLabel.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/screens/MyWebReportScheduleUtils.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_report_reads.py`

### `Cocolon/screens/MyWebReportViewerScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `legacy-live`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: Analysis / Self Structure surface.
- 上流:
  - `Cocolon/screens/MyWebContentFirstScreen.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
- 下流:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_report_reads.py` — endpoint /report-reads/mark
- 落とすと漏れる関連ファイル:
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/screens/MyWebContentFirstScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_report_reads.py`

### `Cocolon/screens/MyWebScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: Analysis / Self Structure surface.
- 上流:
  - `Cocolon/App.js` — import
- 下流:
  - `Cocolon/SubscriptionContext.js` — import
  - `Cocolon/TutorialContext.js` — import
  - `Cocolon/UnreadContext.js` — import
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/components/TutorialOverlay.js` — import
  - `Cocolon/components/UnreadBadge.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/lib/todayQuestionApi.js` — import
  - `Cocolon/screens/MyWebContentFirstScreen.js` — import
  - `Cocolon/screens/MyWebEmotionAnalysisScreen.js` — import
  - `Cocolon/screens/MyWebHistoryScreen.js` — import
  - `Cocolon/screens/MyWebInputHistoryMenuScreen.js` — import
  - `Cocolon/screens/MyWebReportHistoryScreen.js` — import
  - `Cocolon/screens/MyWebReportViewerScreen.js` — import
  - `Cocolon/screens/MyWebSelfStructureScreen.js` — import
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js` — import
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js` — import
  - `Cocolon/screens/SelfStructureReportViewerScreen.js` — import
  - `Cocolon/screens/TodayQuestionHistoryScreen.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — endpoint /myprofile/latest/status
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — endpoint /myweb/home-summary
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — endpoint /myweb/reports/ensure
  - `mashos-api/ai/services/ai_inference/api_report_reads.py` — endpoint /report-reads/mark
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/SubscriptionContext.js`
  - `Cocolon/TutorialContext.js`
  - `Cocolon/UnreadContext.js`
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/components/TutorialOverlay.js`
  - `Cocolon/components/UnreadBadge.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/lib/todayQuestionApi.js`
  - `Cocolon/screens/MyWebContentFirstScreen.js`
  - `Cocolon/screens/MyWebEmotionAnalysisScreen.js`
  - `Cocolon/screens/MyWebHistoryScreen.js`
  - `Cocolon/screens/MyWebInputHistoryMenuScreen.js`
  - `Cocolon/screens/MyWebReportHistoryScreen.js`
  - `Cocolon/screens/MyWebReportViewerScreen.js`
  - `Cocolon/screens/MyWebSelfStructureScreen.js`
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js`
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js`
  - `Cocolon/screens/SelfStructureReportViewerScreen.js`
  - `Cocolon/screens/TodayQuestionHistoryScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
  - `mashos-api/ai/services/ai_inference/api_report_reads.py`

### `Cocolon/screens/MyWebSelfStructureScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: Analysis / Self Structure surface.
- 上流:
  - `Cocolon/screens/MyWebScreen.js` — import
- 下流:
  - `Cocolon/screens/MyWebMenuCommon.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/screens/MyWebMenuCommon.js`
  - `Cocolon/screens/MyWebScreen.js`

### `Cocolon/screens/MyWebTopScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: Analysis / Self Structure surface.
- 上流:
  - なし
- 下流:
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/screens/MenuActionCardCommon.js` — import
  - `Cocolon/screens/MyWebMenuCommon.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/screens/MenuActionCardCommon.js`
  - `Cocolon/screens/MyWebMenuCommon.js`

### `Cocolon/screens/SelfStructureReportGenerateScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: RN screen module. Current system: app support / misc.
- 上流:
  - `Cocolon/screens/MyWebContentFirstScreen.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
- 下流:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/components/selfStructure/SelfStructureDeepRenderer.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/lib/user.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — endpoint /myprofile/latest/status
- 落とすと漏れる関連ファイル:
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/components/selfStructure/SelfStructureDeepRenderer.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/lib/user.ts`
  - `Cocolon/screens/MyWebContentFirstScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`

### `Cocolon/screens/SelfStructureReportHistoryScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: RN screen module. Current system: app support / misc.
- 上流:
  - `Cocolon/screens/MyWebScreen.js` — import
- 下流:
  - `Cocolon/SubscriptionContext.js` — import
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/historyRetentionLabel.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_report_reads.py` — endpoint /report-reads/mark
- 落とすと漏れる関連ファイル:
  - `Cocolon/SubscriptionContext.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/historyRetentionLabel.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_report_reads.py`

### `Cocolon/screens/SelfStructureReportViewerScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: RN screen module. Current system: app support / misc.
- 上流:
  - `Cocolon/screens/MyWebScreen.js` — import
- 下流:
  - `Cocolon/SubscriptionContext.js` — import
  - `Cocolon/components/selfStructure/SelfStructureDeepRenderer.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/SubscriptionContext.js`
  - `Cocolon/components/selfStructure/SelfStructureDeepRenderer.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`


## B3. RN Piece / Nexus read surfaces

### `Cocolon/lib/nexusApi.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: Frontend helper / boundary module. Current system: Piece / Nexus API wrapper.
- 上流:
  - `Cocolon/screens/NexusScreen.js` — import
- 下流:
  - `Cocolon/lib/apiClient.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/screens/NexusScreen.js`

### `Cocolon/screens/MyModelDiscoveriesRankingScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: Piece / Nexus surface.
- 上流:
  - なし
- 下流:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_discoveries.py` — endpoint /ranking/mymodel_discoveries
- 落とすと漏れる関連ファイル:
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_discoveries.py`

### `Cocolon/screens/MyModelEchoesRankingScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: Piece / Nexus surface.
- 上流:
  - `Cocolon/App.js` — import
- 下流:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_resonances.py` — endpoint /ranking/mymodel_resonances
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_resonances.py`

### `Cocolon/screens/MyModelEntryScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: Piece / Nexus surface.
- 上流:
  - `Cocolon/App.js` — import
- 下流:
  - `Cocolon/screens/MyModelScreen.js` — import
  - `Cocolon/screens/NexusScreen.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/screens/MyModelScreen.js`
  - `Cocolon/screens/NexusScreen.js`

### `Cocolon/screens/MyModelQuestionsRankingScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: Piece / Nexus surface.
- 上流:
  - `Cocolon/App.js` — import
- 下流:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — endpoint /ranking/mymodel_questions
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_ranking.py`

### `Cocolon/screens/MyModelReactionHistoryScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: Piece / Nexus surface.
- 上流:
  - `Cocolon/App.js` — import
- 下流:
  - `Cocolon/TutorialContext.js` — import
  - `Cocolon/screens/MyModelMenuCommon.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/TutorialContext.js`
  - `Cocolon/screens/MyModelMenuCommon.js`

### `Cocolon/screens/MyModelReflectionsScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: Piece / Nexus surface.
- 上流:
  - `Cocolon/App.js` — import
- 下流:
  - `Cocolon/TutorialContext.js` — import
  - `Cocolon/UnreadContext.js` — import
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/components/TutorialOverlay.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/lib/user.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/TutorialContext.js`
  - `Cocolon/UnreadContext.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/components/TutorialOverlay.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/lib/user.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`

### `Cocolon/screens/MyModelScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `shared`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: Piece / Nexus surface.
- 上流:
  - `Cocolon/App.js` — import
  - `Cocolon/screens/MyModelEntryScreen.js` — import
- 下流:
  - `Cocolon/SubscriptionContext.js` — import
  - `Cocolon/TutorialContext.js` — import
  - `Cocolon/UnreadContext.js` — import
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/components/TutorialOverlay.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/lib/user.ts` — import
  - `Cocolon/screens/MenuActionCardCommon.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/SubscriptionContext.js`
  - `Cocolon/TutorialContext.js`
  - `Cocolon/UnreadContext.js`
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/components/TutorialOverlay.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/lib/user.ts`
  - `Cocolon/screens/MenuActionCardCommon.js`
  - `Cocolon/screens/MyModelEntryScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`

### `Cocolon/screens/NexusScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: RN screen module. Current system: Piece / Nexus surface.
- 上流:
  - `Cocolon/screens/MyModelEntryScreen.js` — import
- 下流:
  - `Cocolon/TutorialContext.js` — import
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/components/TutorialOverlay.js` — import
  - `Cocolon/lib/nexusApi.js` — import
  - `Cocolon/screens/nexus/NexusReflectionCard.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/TutorialContext.js`
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/components/TutorialOverlay.js`
  - `Cocolon/lib/nexusApi.js`
  - `Cocolon/screens/MyModelEntryScreen.js`
  - `Cocolon/screens/nexus/NexusReflectionCard.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`

### `Cocolon/screens/nexus/NexusEmotionRankingCard.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: RN screen module. Current system: Piece / Nexus surface.
- 上流:
  - なし
- 下流:
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`

### `Cocolon/screens/nexus/NexusReflectionCard.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: Piece / Nexus surface.
- 上流:
  - `Cocolon/screens/NexusScreen.js` — import
- 下流:
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/screens/NexusScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`


## B4. RN EmotionLog / Ranking read surfaces

### `Cocolon/screens/DiscoveriesHistoryDetailScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: ranking / history surface.
- 上流:
  - なし
- 下流:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/uiTokens.js`

### `Cocolon/screens/DiscoveriesHistoryListScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: ranking / history surface.
- 上流:
  - なし
- 下流:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/uiTokens.js`

### `Cocolon/screens/EchoesHistoryDetailScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: ranking / history surface.
- 上流:
  - `Cocolon/App.js` — import
- 下流:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/uiTokens.js`

### `Cocolon/screens/EchoesHistoryListScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: ranking / history surface.
- 上流:
  - `Cocolon/App.js` — import
- 下流:
  - `Cocolon/SubscriptionContext.js` — import
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/historyRetentionLabel.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/SubscriptionContext.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/historyRetentionLabel.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/uiTokens.js`

### `Cocolon/screens/EmotionLogScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: RN screen module. Current system: EmotionLog / social surface.
- 上流:
  - `Cocolon/App.js` — import
- 下流:
  - `Cocolon/TutorialContext.js` — import
  - `Cocolon/UnreadContext.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/components/TutorialOverlay.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/TutorialContext.js`
  - `Cocolon/UnreadContext.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/components/TutorialOverlay.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`

### `Cocolon/screens/FollowListScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: RN screen module. Current system: EmotionLog / social surface.
- 上流:
  - `Cocolon/App.js` — import
- 下流:
  - `Cocolon/AuthContext.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — endpoint /myprofile/follow-requests/approve
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — endpoint /myprofile/follow-requests/reject
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/AuthContext.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`

### `Cocolon/screens/LoginStreakRankingScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: RN screen module. Current system: ranking / history surface.
- 上流:
  - `Cocolon/App.js` — import
- 下流:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` — endpoint /ranking/login_streak
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py`

### `Cocolon/screens/RankingAllUsersScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: ranking / history surface.
- 上流:
  - なし
- 下流:
  - `Cocolon/screens/MyModelMenuCommon.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/screens/MyModelMenuCommon.js`

### `Cocolon/screens/RankingMyModelMenuScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: ranking / history surface.
- 上流:
  - なし
- 下流:
  - `Cocolon/screens/MyModelMenuCommon.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/screens/MyModelMenuCommon.js`

### `Cocolon/screens/RankingPersonalUsersScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: RN screen module. Current system: ranking / history surface.
- 上流:
  - なし
- 下流:
  - `Cocolon/screens/MyModelMenuCommon.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/screens/MyModelMenuCommon.js`

### `Cocolon/screens/RankingTopScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: RN screen module. Current system: ranking / history surface.
- 上流:
  - `Cocolon/App.js` — import
- 下流:
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — endpoint /ranking/input_count
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — endpoint /ranking/input_length
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — endpoint /ranking/mymodel_questions
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` — endpoint /ranking/input_count
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` — endpoint /ranking/input_length
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` — endpoint /ranking/login_streak
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_resonances.py` — endpoint /ranking/mymodel_resonances
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_resonances.py`


## B5. RN boundary helpers tied to national read-side

### `Cocolon/lib/api/account/profileApi.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: Frontend API wrapper for /account/profile/me.
- 上流:
  - `Cocolon/AuthContext.js` — import
  - `Cocolon/TutorialContext.js` — import
  - `Cocolon/lib/pushToken.js` — import
- 下流:
  - `Cocolon/lib/api/client.js` — import
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py` — endpoint /account/profile/me
- 落とすと漏れる関連ファイル:
  - `Cocolon/AuthContext.js`
  - `Cocolon/TutorialContext.js`
  - `Cocolon/lib/api/client.js`
  - `Cocolon/lib/pushToken.js`
  - `mashos-api/ai/services/ai_inference/api_account_lifecycle.py`

### `Cocolon/lib/historyRetentionLabel.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: Frontend helper / boundary module. Current system: app support / misc.
- 上流:
  - `Cocolon/screens/EchoesHistoryListScreen.js` — import
  - `Cocolon/screens/MyWebHistoryScreen.js` — import
  - `Cocolon/screens/MyWebReportHistoryScreen.js` — import
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js` — import
  - `Cocolon/screens/TodayQuestionHistoryScreen.js` — import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `Cocolon/screens/EchoesHistoryListScreen.js`
  - `Cocolon/screens/MyWebHistoryScreen.js`
  - `Cocolon/screens/MyWebReportHistoryScreen.js`
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js`
  - `Cocolon/screens/TodayQuestionHistoryScreen.js`

### `Cocolon/lib/pushToken.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: Push token取得・account/profile同期 boundary。release buildではtoken prefix logを出さない。
- 上流:
  - `Cocolon/App.js` — import
- 下流:
  - `Cocolon/lib/api/account/profileApi.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/lib/api/account/profileApi.js`

### `Cocolon/lib/reportDistributionApi.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: Frontend helper / boundary module. Current system: account / subscription boundary helper.
- 上流:
  - `Cocolon/screens/SettingsAppSettingsScreen.js` — import
- 下流:
  - `Cocolon/lib/apiClient.js` — import
  - `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py` — endpoint /report-distribution/settings
- 落とすと漏れる関連ファイル:
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/screens/SettingsAppSettingsScreen.js`
  - `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py`

### `Cocolon/lib/subscriptionApi.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: Frontend helper / boundary module. Current system: account / subscription boundary helper.
- 上流:
  - `Cocolon/SubscriptionContext.js` — import
  - `Cocolon/lib/iap/iapService.js` — import
- 下流:
  - `Cocolon/lib/apiClient.js` — import
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — endpoint /subscription/bootstrap
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — endpoint /subscription/me
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — endpoint /subscription/update
- 落とすと漏れる関連ファイル:
  - `Cocolon/SubscriptionContext.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/iap/iapService.js`
  - `mashos-api/ai/services/ai_inference/api_subscription.py`

### `Cocolon/screens/AccountScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: RN screen module. Current system: account / subscription surface.
- 上流:
  - `Cocolon/App.js` — import
- 下流:
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
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
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

### `Cocolon/screens/ProfileCreateScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: RN screen module. Current system: account / subscription surface.
- 上流:
  - `Cocolon/App.js` — import
- 下流:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/components/CocolonSwitch.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- 落とすと漏れる関連ファイル:
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

### `Cocolon/screens/SubscriptionSelectScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: RN screen module. Current system: account / subscription surface.
- 上流:
  - `Cocolon/App.js` — import
  - `Cocolon/AppRuntimeContext.js` — import
- 下流:
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
- 落とすと漏れる関連ファイル:
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


## B6. Snapshot / queue / worker / derived-state core

### `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: Shared helper for enqueuing ASTOR account status refresh jobs.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_activity_login.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/api_profile_create.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_activity_login.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/api_profile_create.py`
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`

### `mashos-api/ai/services/ai_inference/astor_account_status_kernel.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: Account Status summary generation kernel for ASTOR (Phase 1).
- 上流:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_account_status_store.py` — from import
  - `mashos-api/ai/services/ai_inference/piece_generated_metrics.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/astor_account_status_store.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/piece_generated_metrics.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/astor_account_status_store.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: Storage helpers for ASTOR account status summary artifacts.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_account_status.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_account_status_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_account_status.py`
  - `mashos-api/ai/services/ai_inference/astor_account_status_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/astor_core.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: ASTOR Core v0.1
- 上流:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_myweb_insight.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_patterns.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_structure_matcher.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_myweb_insight.py`
  - `mashos-api/ai/services/ai_inference/astor_patterns.py`
  - `mashos-api/ai/services/ai_inference/astor_structure_matcher.py`

### `mashos-api/ai/services/ai_inference/astor_friend_feed_enqueue.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `legacy-live`
- 国家システム上の役割: Shared helper for enqueuing ASTOR emotion log feed refresh jobs.
- 上流:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`

### `mashos-api/ai/services/ai_inference/astor_friend_feed_kernel.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `legacy-live`
- 国家システム上の役割: EmotionLog feed generation kernel for ASTOR (Phase 1).
- 上流:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_store.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/astor_friend_feed_store.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `legacy-live`
- 国家システム上の役割: Storage helpers for ASTOR EmotionLog feed summary artifacts.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_friends.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_friends.py`
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: Shared helper for enqueuing ASTOR global summary refresh jobs.
- 上流:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_history_manage.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_global_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_global_summary_store.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_history_manage.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_global_summary.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_store.py`
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`

### `mashos-api/ai/services/ai_inference/astor_global_summary_kernel.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `legacy-live`
- 国家システム上の役割: Global Summary generation kernel for ASTOR (Step 1).
- 上流:
  - `mashos-api/ai/services/ai_inference/api_global_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_global_summary_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_global_summary.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_store.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/astor_global_summary_store.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `legacy-live`
- 国家システム上の役割: Storage helpers for ASTOR global summary artifacts.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_global_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_global_summary.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/astor_job_queue.py`
- repo: `mashos-api`
- 国家システム区分: `Queue`
- 現行状態: `shared`
- 国家システム上の役割: Phase 6: DB-backed job queue for ASTOR heavy processing
- 上流:
  - `mashos-api/ai/services/ai_inference/api_emotion_secret.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_material_snapshots.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_secret.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_material_snapshots.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/astor_material_snapshots.py`
- repo: `mashos-api`
- 国家システム区分: `Snapshot`
- 現行状態: `legacy-live`
- 国家システム上の役割: Phase X: Central Material Snapshot Generator (v1)
- 上流:
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py` — from import
  - `mashos-api/ai/services/ai_inference/reflection_text_formatter.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/reflection_text_formatter.py`

### `mashos-api/ai/services/ai_inference/astor_myprofile_persona.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: ASTOR MyModel Persona Context v0.1
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_patterns.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_patterns.py`

### `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `legacy-live`
- 国家システム上の役割: ASTOR MyProfile（月次）自己構造分析レポート生成
- 上流:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_patterns.py` — from import
  - `mashos-api/ai/services/ai_inference/generation_lock.py` — from import
  - `mashos-api/ai/services/ai_inference/myprofile_section_text_templates.py` — from import
  - `mashos-api/ai/services/ai_inference/structure_dict.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/rules.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_patterns.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/generation_lock.py`
  - `mashos-api/ai/services/ai_inference/myprofile_section_text_templates.py`
  - `mashos-api/ai/services/ai_inference/structure_dict.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/rules.py`

### `mashos-api/ai/services/ai_inference/astor_myweb_insight.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: ASTOR MyWeb Insight v0.3
- 上流:
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_core.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_patterns.py` — from import
  - `mashos-api/ai/services/ai_inference/structure_dict.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_core.py`
  - `mashos-api/ai/services/ai_inference/astor_patterns.py`
  - `mashos-api/ai/services/ai_inference/structure_dict.py`

### `mashos-api/ai/services/ai_inference/astor_patterns.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: ASTOR 用の「構造語パターン集約ストア」。
- 上流:
  - `mashos-api/ai/services/ai_inference/astor_core.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myprofile_persona.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myweb_insight.py` — from import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/astor_core.py`
  - `mashos-api/ai/services/ai_inference/astor_myprofile_persona.py`
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`
  - `mashos-api/ai/services/ai_inference/astor_myweb_insight.py`

### `mashos-api/ai/services/ai_inference/astor_ranking_boards.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: Storage helpers for ASTOR ranking board artifacts.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_discoveries.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_resonances.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_views.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_discoveries.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_resonances.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_views.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: Shared helper for enqueuing ASTOR ranking board refresh jobs.
- 上流:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py` — from import
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py` — from import
  - `mashos-api/ai/services/ai_inference/api_activity_login.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py`
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py`
  - `mashos-api/ai/services/ai_inference/api_activity_login.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`

### `mashos-api/ai/services/ai_inference/astor_ranking_kernel.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: Ranking board generation kernel for ASTOR (Phase 1).
- 上流:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py` — from import
  - `mashos-api/ai/services/ai_inference/piece_generated_metrics.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/piece_generated_metrics.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/astor_reflection_engine.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: Premium Reflection generation engine (v1)
- 上流:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
  - `mashos-api/ai/tests/contract/test_generated_reflection_maintenance_contracts.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py`
  - `mashos-api/ai/tests/contract/test_generated_reflection_maintenance_contracts.py`

### `mashos-api/ai/services/ai_inference/astor_reflection_store.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `legacy-live`
- 国家システム上の役割: Premium Reflection store layer (v1)
- 上流:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_reflection_store.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py` — from import
  - `mashos-api/ai/tests/contract/test_generated_reflection_display_contracts.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/emotion_reflection_store.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py`
  - `mashos-api/ai/tests/contract/test_generated_reflection_display_contracts.py`

### `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py`
- repo: `mashos-api`
- 国家システム区分: `Snapshot`
- 現行状態: `shared`
- 国家システム上の役割: Shared helper for enqueuing ASTOR material snapshot refresh jobs.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/api_profile_create.py` — from import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/today_question_command_service.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/api_profile_create.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/today_question_command_service.py`

### `mashos-api/ai/services/ai_inference/astor_structure_matcher.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: ASTOR 用の「構造語マッチング」モジュール。
- 上流:
  - `mashos-api/ai/services/ai_inference/astor_core.py` — from import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/astor_core.py`

### `mashos-api/ai/services/ai_inference/astor_worker.py`
- repo: `mashos-api`
- 国家システム区分: `Worker`
- 現行状態: `legacy-live`
- 国家システム上の役割: Phase 6: ASTOR heavy processing worker (Render Background Worker)
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/analysis_engine_adapter.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_account_status_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_account_status_store.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_store.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_store.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_material_snapshots.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_reflection_engine.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — from import
  - `mashos-api/ai/services/ai_inference/generation_lock.py` — from import
  - `mashos-api/ai/services/ai_inference/report_distribution_push_store.py` — from import
  - `mashos-api/ai/services/ai_inference/request_metrics.py` — import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
  - `mashos-api/ai/services/analysis_engine/__init__.py` — from import
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/daily.py` — from import
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/monthly.py` — from import
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/weekly.py` — from import
  - `mashos-api/ai/services/analysis_engine/models.py` — from import
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/builders.py` — from import
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/fusion.py` — from import
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/signal_extraction.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/analysis_engine_adapter.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
  - `mashos-api/ai/services/ai_inference/astor_account_status_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_account_status_store.py`
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_store.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_store.py`
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`
  - `mashos-api/ai/services/ai_inference/astor_material_snapshots.py`
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_reflection_engine.py`
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
  - `mashos-api/ai/services/ai_inference/generation_lock.py`
  - `mashos-api/ai/services/ai_inference/report_distribution_push_store.py`
  - `mashos-api/ai/services/ai_inference/request_metrics.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/services/analysis_engine/__init__.py`
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/daily.py`
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/monthly.py`
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/weekly.py`
  - `mashos-api/ai/services/analysis_engine/models.py`
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/builders.py`
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/fusion.py`
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/signal_extraction.py`


## B7. Analysis / generation / reflection engines

### `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
- repo: `mashos-api`
- 国家システム区分: `Worker`
- 現行状態: `legacy-live`
- 国家システム上の役割: Deterministic public-display builder for Premium generated reflections.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/api_nexus.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_reflection_generation_service.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_reflection_store.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py` — from import
  - `mashos-api/ai/tests/contract/test_generated_reflection_display_contracts.py` — import
  - `mashos-api/ai/tests/contract/test_generated_reflection_maintenance_contracts.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/reflection_text_formatter.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/api_nexus.py`
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/emotion_reflection_generation_service.py`
  - `mashos-api/ai/services/ai_inference/emotion_reflection_store.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py`
  - `mashos-api/ai/services/ai_inference/reflection_text_formatter.py`
  - `mashos-api/ai/tests/contract/test_generated_reflection_display_contracts.py`
  - `mashos-api/ai/tests/contract/test_generated_reflection_maintenance_contracts.py`

### `mashos-api/ai/services/ai_inference/generated_reflection_identity.py`
- repo: `mashos-api`
- 国家システム区分: `Worker`
- 現行状態: `shared`
- 国家システム上の役割: Helpers for Premium generated Reflection public identity.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_reflection_engine.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_reflection_generation_service.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py` — from import
  - `mashos-api/ai/tests/contract/test_generated_reflection_display_contracts.py` — from import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/astor_reflection_engine.py`
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py`
  - `mashos-api/ai/services/ai_inference/emotion_reflection_generation_service.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py`
  - `mashos-api/ai/tests/contract/test_generated_reflection_display_contracts.py`

### `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py`
- repo: `mashos-api`
- 国家システム区分: `Worker`
- 現行状態: `shared`
- 国家システム上の役割: Backfill / cleanup helpers for Premium generated reflections.
- 上流:
  - `mashos-api/ai/tests/contract/test_generated_reflection_maintenance_contracts.py` — import
  - `mashos-api/scripts/backfill_generated_reflection_display_cleanup.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py`
  - `mashos-api/ai/tests/contract/test_generated_reflection_maintenance_contracts.py`
  - `mashos-api/scripts/backfill_generated_reflection_display_cleanup.py`

### `mashos-api/ai/services/ai_inference/mashlogic_profile_enhancer.py`
- repo: `mashos-api`
- 国家システム区分: `Worker`
- 現行状態: `active`
- 国家システム上の役割: Deep-mode enhancer for MyProfile monthly reports.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/services/ai_inference/mashlogic_qa_enhancer.py`
- repo: `mashos-api`
- 国家システム区分: `Worker`
- 現行状態: `active`
- 国家システム上の役割: Deep-mode enhancer for MyProfile Q&A responses.
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/app.py`

### `mashos-api/ai/services/ai_inference/persona_engine.py`
- repo: `mashos-api`
- 国家システム区分: `Worker`
- 現行状態: `active`
- 国家システム上の役割: 既存 app.py 内の compose_response / detect_lang / contains_date_like_adv 相当を
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/guards/date_guard.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/guards/date_guard.py`

### `mashos-api/ai/services/ai_inference/reflection_publish_entitlements.py`
- repo: `mashos-api`
- 国家システム区分: `Worker`
- 現行状態: `shared`
- 国家システム上の役割: Monthly publish quota rules for the new emotion-generated Reflection flow.
- 上流:
  - `mashos-api/ai/services/ai_inference/emotion_reflection_store.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/emotion_reflection_store.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`

### `mashos-api/ai/services/ai_inference/reflection_text_formatter.py`
- repo: `mashos-api`
- 国家システム区分: `Worker`
- 現行状態: `shared`
- 国家システム上の役割: Deterministic formatter for MyModel Create -> Reflections public display text.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/api_profile_create.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_material_snapshots.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — from import
  - `mashos-api/ai/tests/contract/test_mymodel_reflection_display_contracts.py` — import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/api_profile_create.py`
  - `mashos-api/ai/services/ai_inference/astor_material_snapshots.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
  - `mashos-api/ai/tests/contract/test_mymodel_reflection_display_contracts.py`

### `mashos-api/ai/services/analysis_engine/__init__.py`
- repo: `mashos-api`
- 国家システム区分: `Worker`
- 現行状態: `shared`
- 国家システム上の役割: Analysis engine module. Current role inferred from file name:   init  .
- 上流:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
  - `mashos-api/ai/services/examples/demo.py` — from import
- 下流:
  - `mashos-api/ai/services/analysis_engine/baseline.py` — from import
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/daily.py` — from import
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/monthly.py` — from import
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/weekly.py` — from import
  - `mashos-api/ai/services/analysis_engine/models.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/analysis_engine/baseline.py`
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/daily.py`
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/monthly.py`
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/weekly.py`
  - `mashos-api/ai/services/analysis_engine/models.py`
  - `mashos-api/ai/services/examples/demo.py`

### `mashos-api/ai/services/analysis_engine/baseline.py`
- repo: `mashos-api`
- 国家システム区分: `Worker`
- 現行状態: `active`
- 国家システム上の役割: Analysis engine module. Current role inferred from file name: baseline.
- 上流:
  - `mashos-api/ai/services/analysis_engine/__init__.py` — from import
- 下流:
  - `mashos-api/ai/services/analysis_engine/models.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/analysis_engine/__init__.py`
  - `mashos-api/ai/services/analysis_engine/models.py`

### `mashos-api/ai/services/analysis_engine/emotion_structure_engine/daily.py`
- repo: `mashos-api`
- 国家システム区分: `Worker`
- 現行状態: `shared`
- 国家システム上の役割: Analysis engine module. Current role inferred from file name: daily.
- 上流:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
  - `mashos-api/ai/services/analysis_engine/__init__.py` — from import
- 下流:
  - `mashos-api/ai/services/analysis_engine/models.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/analysis_engine/__init__.py`
  - `mashos-api/ai/services/analysis_engine/models.py`

### `mashos-api/ai/services/analysis_engine/emotion_structure_engine/monthly.py`
- repo: `mashos-api`
- 国家システム区分: `Worker`
- 現行状態: `legacy-live`
- 国家システム上の役割: Analysis engine module. Current role inferred from file name: monthly.
- 上流:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
  - `mashos-api/ai/services/analysis_engine/__init__.py` — from import
- 下流:
  - `mashos-api/ai/services/analysis_engine/models.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/analysis_engine/__init__.py`
  - `mashos-api/ai/services/analysis_engine/models.py`

### `mashos-api/ai/services/analysis_engine/emotion_structure_engine/weekly.py`
- repo: `mashos-api`
- 国家システム区分: `Worker`
- 現行状態: `legacy-live`
- 国家システム上の役割: Analysis engine module. Current role inferred from file name: weekly.
- 上流:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
  - `mashos-api/ai/services/analysis_engine/__init__.py` — from import
- 下流:
  - `mashos-api/ai/services/analysis_engine/models.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/analysis_engine/__init__.py`
  - `mashos-api/ai/services/analysis_engine/models.py`

### `mashos-api/ai/services/analysis_engine/models.py`
- repo: `mashos-api`
- 国家システム区分: `Worker`
- 現行状態: `shared`
- 国家システム上の役割: Analysis engine module. Current role inferred from file name: models.
- 上流:
  - `mashos-api/ai/services/ai_inference/analysis_engine_adapter.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
  - `mashos-api/ai/services/analysis_engine/__init__.py` — from import
  - `mashos-api/ai/services/analysis_engine/baseline.py` — from import
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/daily.py` — from import
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/monthly.py` — from import
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/weekly.py` — from import
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/builders.py` — from import
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/fusion.py` — from import
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/rules.py` — from import
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/signal_extraction.py` — from import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/analysis_engine_adapter.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/analysis_engine/__init__.py`
  - `mashos-api/ai/services/analysis_engine/baseline.py`
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/daily.py`
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/monthly.py`
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/weekly.py`
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/builders.py`
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/fusion.py`
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/rules.py`
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/signal_extraction.py`

### `mashos-api/ai/services/analysis_engine/self_structure_engine/builders.py`
- repo: `mashos-api`
- 国家システム区分: `Worker`
- 現行状態: `active`
- 国家システム上の役割: Analysis engine module. Current role inferred from file name: builders.
- 上流:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 下流:
  - `mashos-api/ai/services/analysis_engine/models.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/analysis_engine/models.py`

### `mashos-api/ai/services/analysis_engine/self_structure_engine/fusion.py`
- repo: `mashos-api`
- 国家システム区分: `Worker`
- 現行状態: `active`
- 国家システム上の役割: Analysis engine module. Current role inferred from file name: fusion.
- 上流:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 下流:
  - `mashos-api/ai/services/analysis_engine/models.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/analysis_engine/models.py`

### `mashos-api/ai/services/analysis_engine/self_structure_engine/rules.py`
- repo: `mashos-api`
- 国家システム区分: `Worker`
- 現行状態: `active`
- 国家システム上の役割: Analysis engine module. Current role inferred from file name: rules.
- 上流:
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — from import
- 下流:
  - `mashos-api/ai/services/analysis_engine/models.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`
  - `mashos-api/ai/services/analysis_engine/models.py`

### `mashos-api/ai/services/analysis_engine/self_structure_engine/signal_extraction.py`
- repo: `mashos-api`
- 国家システム区分: `Worker`
- 現行状態: `legacy-live`
- 国家システム上の役割: Analysis engine module. Current role inferred from file name: signal extraction.
- 上流:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 下流:
  - `mashos-api/ai/services/analysis_engine/models.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/analysis_engine/models.py`


## B8. Publish / visibility / access policy

### `mashos-api/ai/services/ai_inference/access_policy/__init__.py`
- repo: `mashos-api`
- 国家システム区分: `Publish`
- 現行状態: `shared`
- 国家システム上の役割: Read-side access policy module. Current role:   init  .
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/report_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/subscription_context.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py`
  - `mashos-api/ai/services/ai_inference/access_policy/report_access_policy.py`
  - `mashos-api/ai/services/ai_inference/access_policy/subscription_context.py`
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py`

### `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py`
- repo: `mashos-api`
- 国家システム区分: `Publish`
- 現行状態: `shared`
- 国家システム上の役割: Read-side access policy module. Current role: piece access policy.
- 上流:
  - `mashos-api/ai/services/ai_inference/access_policy/__init__.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/mymodel_entitlements.py` — from import
  - `mashos-api/ai/services/ai_inference/publish_governance.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/__init__.py`
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/mymodel_entitlements.py`
  - `mashos-api/ai/services/ai_inference/publish_governance.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`

### `mashos-api/ai/services/ai_inference/access_policy/report_access_policy.py`
- repo: `mashos-api`
- 国家システム区分: `Publish`
- 現行状態: `shared`
- 国家システム上の役割: Read-side access policy module. Current role: report access policy.
- 上流:
  - `mashos-api/ai/services/ai_inference/access_policy/__init__.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/publish_governance.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/__init__.py`
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py`
  - `mashos-api/ai/services/ai_inference/publish_governance.py`

### `mashos-api/ai/services/ai_inference/access_policy/subscription_context.py`
- repo: `mashos-api`
- 国家システム区分: `Publish`
- 現行状態: `shared`
- 国家システム上の役割: Read-side access policy module. Current role: subscription context.
- 上流:
  - `mashos-api/ai/services/ai_inference/access_policy/__init__.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/publish_governance.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/__init__.py`
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py`
  - `mashos-api/ai/services/ai_inference/publish_governance.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`

### `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py`
- repo: `mashos-api`
- 国家システム区分: `Publish`
- 現行状態: `shared`
- 国家システム上の役割: Read-side access policy module. Current role: viewer access policy.
- 上流:
  - `mashos-api/ai/services/ai_inference/access_policy/__init__.py` — from import
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/report_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/subscription_context.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/__init__.py`
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py`
  - `mashos-api/ai/services/ai_inference/access_policy/report_access_policy.py`
  - `mashos-api/ai/services/ai_inference/access_policy/subscription_context.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`

### `mashos-api/ai/services/ai_inference/publish_governance.py`
- repo: `mashos-api`
- 国家システム区分: `Publish`
- 現行状態: `shared`
- 国家システム上の役割: Backend support module. Current system: backend support / misc.
- 上流:
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/report_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/subscription_context.py` — from import
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_history_search.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/api_report_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — from import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py`
  - `mashos-api/ai/services/ai_inference/access_policy/report_access_policy.py`
  - `mashos-api/ai/services/ai_inference/access_policy/subscription_context.py`
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_history_search.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
  - `mashos-api/ai/services/ai_inference/api_report_reads.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`


## B9. Read-side / startup / presentation APIs

### `mashos-api/ai/services/ai_inference/api_app_bootstrap.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `legacy-live`
- 国家システム上の役割: FastAPI route module for GET /app/bootstrap, GET /app/startup
- 上流:
  - `Cocolon/App.js` — endpoint /app/bootstrap
  - `Cocolon/App.js` — endpoint /app/startup
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py` — import
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/client_compat.py` — from import
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` — from import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/client_compat.py`
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py`
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py`
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`

### `mashos-api/ai/services/ai_inference/api_friends.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `legacy-live`
- 国家システム上の役割: Legacy Friends / EmotionLog API for Cocolon (MashOS / FastAPI)
- 上流:
  - `Cocolon/App.js` — endpoint /emotion-log/feed
  - `Cocolon/App.js` — endpoint /emotion-log/unread-status
  - `Cocolon/App.js` — endpoint /emotion-log/unread/read-feed
  - `Cocolon/screens/SettingsAppSettingsScreen.js` — endpoint /emotion-notifications/settings
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_store.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/screens/SettingsAppSettingsScreen.js`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_store.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `legacy-live`
- 国家システム上の役割: MyModel 一問一答（新構造）API
- 上流:
  - `Cocolon/App.js` — endpoint /mymodel/qna/unread-status
  - `mashos-api/ai/services/ai_inference/api_nexus.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/tests/contract/test_generated_reflection_display_contracts.py` — import
  - `mashos-api/ai/tests/contract/test_mymodel_reflection_display_contracts.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_profile_create.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py` — from import
  - `mashos-api/ai/services/ai_inference/reflection_text_formatter.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py`
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_nexus.py`
  - `mashos-api/ai/services/ai_inference/api_profile_create.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py`
  - `mashos-api/ai/services/ai_inference/reflection_text_formatter.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/tests/contract/test_generated_reflection_display_contracts.py`
  - `mashos-api/ai/tests/contract/test_mymodel_reflection_display_contracts.py`

### `mashos-api/ai/services/ai_inference/api_myprofile.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `legacy-live`
- 国家システム上の役割: MyProfile ID (share) API for Cocolon (MashOS / FastAPI)
- 上流:
  - `Cocolon/App.js` — endpoint /myprofile/latest/status
  - `Cocolon/screens/AccountScreen.js` — endpoint /myprofile/follow
  - `Cocolon/screens/AccountScreen.js` — endpoint /myprofile/unfollow
  - `Cocolon/screens/FollowListScreen.js` — endpoint /myprofile/follow-requests/approve
  - `Cocolon/screens/FollowListScreen.js` — endpoint /myprofile/follow-requests/reject
  - `Cocolon/screens/MyWebScreen.js` — endpoint /myprofile/latest/status
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js` — endpoint /myprofile/latest/status
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py` — import
  - `mashos-api/ai/tests/contract/test_myprofile_latest_regression.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — from import
  - `mashos-api/ai/services/ai_inference/generation_lock.py` — from import
  - `mashos-api/ai/services/ai_inference/report_distribution_push_store.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/screens/AccountScreen.js`
  - `Cocolon/screens/FollowListScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`
  - `mashos-api/ai/services/ai_inference/generation_lock.py`
  - `mashos-api/ai/services/ai_inference/report_distribution_push_store.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py`
  - `mashos-api/ai/tests/contract/test_myprofile_latest_regression.py`

### `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `legacy-live`
- 国家システム上の役割: FastAPI route module for GET /myprofile/reports/history, GET /myprofile/reports/{report_id}
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — import
  - `mashos-api/ai/tests/contract/test_publish_governance.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py`
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
  - `mashos-api/ai/tests/contract/test_publish_governance.py`

### `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: FastAPI route module for GET /myweb/home-summary, GET /myweb/reports/{report_id}/weekly-days
- 上流:
  - `Cocolon/screens/MyWebScreen.js` — endpoint /myweb/home-summary
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` — from import
  - `mashos-api/ai/tests/contract/test_publish_governance.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py` — from import
  - `mashos-api/ai/services/ai_inference/api_input_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/publish_governance.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `Cocolon/screens/MyWebScreen.js`
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py`
  - `mashos-api/ai/services/ai_inference/api_input_summary.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
  - `mashos-api/ai/services/ai_inference/publish_governance.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/tests/contract/test_publish_governance.py`

### `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `legacy-live`
- 国家システム上の役割: Phase1: MyWeb ensure API (on-demand, per-user)
- 上流:
  - `Cocolon/App.js` — endpoint /myweb/reports/ensure
  - `Cocolon/screens/MyWebScreen.js` — endpoint /myweb/reports/ensure
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_material_snapshots.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myweb_insight.py` — from import
  - `mashos-api/ai/services/ai_inference/generation_lock.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py`
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`
  - `mashos-api/ai/services/ai_inference/astor_material_snapshots.py`
  - `mashos-api/ai/services/ai_inference/astor_myweb_insight.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/generation_lock.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/api_ranking.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `legacy-live`
- 国家システム上の役割: Ranking API for Cocolon (MashOS / FastAPI)
- 上流:
  - `Cocolon/screens/EmotionRankingScreen.js` — endpoint /ranking/emotions
  - `Cocolon/screens/InputCountRankingScreen.js` — endpoint /ranking/input_count
  - `Cocolon/screens/InputLengthRankingScreen.js` — endpoint /ranking/input_length
  - `Cocolon/screens/MyModelQuestionsRankingScreen.js` — endpoint /ranking/mymodel_questions
  - `Cocolon/screens/RankingTopScreen.js` — endpoint /ranking/input_count
  - `Cocolon/screens/RankingTopScreen.js` — endpoint /ranking/input_length
  - `Cocolon/screens/RankingTopScreen.js` — endpoint /ranking/mymodel_questions
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_discoveries.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_resonances.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_views.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py` — from import
  - `mashos-api/ai/services/ai_inference/piece_generated_metrics.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `Cocolon/screens/EmotionRankingScreen.js`
  - `Cocolon/screens/InputCountRankingScreen.js`
  - `Cocolon/screens/InputLengthRankingScreen.js`
  - `Cocolon/screens/MyModelQuestionsRankingScreen.js`
  - `Cocolon/screens/RankingTopScreen.js`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_discoveries.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_resonances.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_views.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py`
  - `mashos-api/ai/services/ai_inference/piece_generated_metrics.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: Ranking API for Cocolon (MashOS / FastAPI)
- 上流:
  - `Cocolon/screens/EmotionRankingScreen.js` — endpoint /ranking/emotions
  - `Cocolon/screens/InputCountRankingScreen.js` — endpoint /ranking/input_count
  - `Cocolon/screens/InputLengthRankingScreen.js` — endpoint /ranking/input_length
  - `Cocolon/screens/LoginStreakRankingScreen.js` — endpoint /ranking/login_streak
  - `Cocolon/screens/RankingTopScreen.js` — endpoint /ranking/input_count
  - `Cocolon/screens/RankingTopScreen.js` — endpoint /ranking/input_length
  - `Cocolon/screens/RankingTopScreen.js` — endpoint /ranking/login_streak
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py` — from import
- 落とすと漏れる関連ファイル:
  - `Cocolon/screens/EmotionRankingScreen.js`
  - `Cocolon/screens/InputCountRankingScreen.js`
  - `Cocolon/screens/InputLengthRankingScreen.js`
  - `Cocolon/screens/LoginStreakRankingScreen.js`
  - `Cocolon/screens/RankingTopScreen.js`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py`

### `mashos-api/ai/services/ai_inference/api_ranking_mymodel_discoveries.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `retired-current-reference`
- 旧記載状態: `shared`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
- 国家システム上の役割: MyModel QnA Discoveries Ranking API (Cocolon / MashOS / FastAPI)
- 上流:
  - `Cocolon/screens/MyModelDiscoveriesRankingScreen.js` — endpoint /ranking/mymodel_discoveries
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py` — from import
- 落とすと漏れる関連ファイル:
  - `Cocolon/screens/MyModelDiscoveriesRankingScreen.js`
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py`

### `mashos-api/ai/services/ai_inference/api_ranking_mymodel_resonances.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: MyModel QnA Resonances Ranking API (Cocolon / MashOS / FastAPI)
- 上流:
  - `Cocolon/screens/MyModelEchoesRankingScreen.js` — endpoint /ranking/mymodel_resonances
  - `Cocolon/screens/RankingTopScreen.js` — endpoint /ranking/mymodel_resonances
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py` — from import
- 落とすと漏れる関連ファイル:
  - `Cocolon/screens/MyModelEchoesRankingScreen.js`
  - `Cocolon/screens/RankingTopScreen.js`
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py`

### `mashos-api/ai/services/ai_inference/api_ranking_mymodel_views.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: MyModel QnA Views Ranking API (Cocolon / MashOS / FastAPI)
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py`

### `mashos-api/ai/services/ai_inference/api_report_reads.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: FastAPI route module for GET /report-reads/status, POST /report-reads/mark, GET /report-reads/myweb-unread-status
- 上流:
  - `Cocolon/screens/MyWebReportHistoryScreen.js` — endpoint /report-reads/mark
  - `Cocolon/screens/MyWebReportViewerScreen.js` — endpoint /report-reads/mark
  - `Cocolon/screens/MyWebScreen.js` — endpoint /report-reads/mark
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js` — endpoint /report-reads/mark
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` — from import
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — import
  - `mashos-api/ai/tests/contract/test_publish_governance.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py` — from import
  - `mashos-api/ai/services/ai_inference/publish_governance.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `Cocolon/screens/MyWebReportHistoryScreen.js`
  - `Cocolon/screens/MyWebReportViewerScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js`
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/publish_governance.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
  - `mashos-api/ai/tests/contract/test_publish_governance.py`

### `mashos-api/ai/services/ai_inference/response_microcache.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `shared`
- 国家システム上の役割: Backend support module. Current system: backend support / misc.
- 上流:
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
- 下流:
  - `mashos-api/ai/services/ai_inference/request_metrics.py` — from import
- 落とすと漏れる関連ファイル:
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

### `mashos-api/ai/services/ai_inference/startup_snapshot_store.py`
- repo: `mashos-api`
- 国家システム区分: `Startup`
- 現行状態: `legacy-live`
- 国家システム上の役割: Backend support module. Current system: backend support / misc.
- 上流:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py` — from import
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/cache_invalidator.py` — from import
  - `mashos-api/ai/services/ai_inference/middleware_active_user_touch.py` — from import
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py` — import
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_friends.py` — from import
  - `mashos-api/ai/services/ai_inference/api_notice.py` — from import
  - `mashos-api/ai/services/ai_inference/api_report_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
- 落とすと漏れる関連ファイル:
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


## B11. 2026-04-22 差分更新 (三大要素完了反映)

### `mashos-api/ai/services/ai_inference/report_artifact_read_service.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: report artifact family (`myweb` / `self_structure`) の history/detail 読取を共通化する read-side service。
- 上流:
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py`
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/piece_public_read_service.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: canonical public Piece body owner。`emotion_generated` source 固定で list/detail/unread-status を構築する。
- 上流:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/api_nexus.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — from import
  - `mashos-api/ai/services/ai_inference/piece_generated_reflection_access.py` — from import
  - `mashos-api/ai/services/ai_inference/piece_public_read_store.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/api_nexus.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
  - `mashos-api/ai/services/ai_inference/piece_generated_reflection_access.py`
  - `mashos-api/ai/services/ai_inference/piece_public_read_store.py`

### `mashos-api/ai/services/ai_inference/piece_public_read_store.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: Piece public read 用の route-neutral repository helper。
- 上流:
  - `mashos-api/ai/services/ai_inference/piece_generated_reflection_access.py` — from import
  - `mashos-api/ai/services/ai_inference/piece_public_read_service.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/piece_generated_reflection_access.py`
  - `mashos-api/ai/services/ai_inference/piece_public_read_service.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/piece_generated_reflection_access.py`
- repo: `mashos-api`
- 国家システム区分: `Read`
- 現行状態: `active`
- 国家システム上の役割: generated reflection access decision / canonical row resolve helper。
- 上流:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/piece_public_read_service.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py` — from import
  - `mashos-api/ai/services/ai_inference/piece_public_read_store.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py`
  - `mashos-api/ai/services/ai_inference/piece_public_read_service.py`
  - `mashos-api/ai/services/ai_inference/piece_public_read_store.py`

### 差分更新まとめ: 既存 national-system owner の current override
- `Cocolon/lib/nexusApi.js` — public Piece hot path の唯一 frontend wrapper。
- `Cocolon/screens/NexusScreen.js` — canonical public Piece feed/view。
- `Cocolon/screens/MyModelScreen.js` — owner-side menu only。discoveries summary を現役 surface として持たない。
- `Cocolon/screens/MyModelReflectionsScreen.js` — owner-side reflection / Echoes management。public list/detail/unread は `nexusApi` 経由。
- `mashos-api/ai/services/ai_inference/api_nexus.py` — public Piece read の canonical route owner。
- `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — compatibility / reaction / owner-side layer。public read body は持たない。
- `mashos-api/ai/services/ai_inference/api_myprofile.py` — status / trigger façade。latest/monthly refresh は shared refresher へ委譲。
- `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py` — façade only。history/detail read 本体は `report_artifact_read_service.py` へ委譲。
- `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — artifact-only read。`analysis_summary_reader.py` / `input_summary_reader.py` を使う。
- `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — projection-first runtime only。production module に legacy ready builder / flag を持たない。
- `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — latest/monthly shared refresher + builder owner。

# 2026-04-25 差分追記: Snapshot / Worker / Publish / Read current補正

- Analysis worker/read 正本は `astor_analysis_insight.py` / `api_analysis_reports.py` / `api_analysis_reads.py` / `report_artifact_read_service.py` です。
- Self Structure worker/read 正本は `astor_self_structure_report.py` / `astor_self_structure_persona.py` / `api_self_structure.py` / `api_self_structure_reports.py` です。
- Piece generation/read 正本は `piece_generation_engine.py` / `piece_generation_store.py` / `piece_generated_*` / `piece_public_read_service.py` / `api_piece_runtime.py` です。
- EmotionLog feed 正本は `astor_emotion_log_feed_*` / `api_emotion_log.py` です。旧 `astor_friend_feed_*` は compat façade です。

# 2026-04-28 差分追記: Worker / Queue / FCM / Load Test補正

## 新規国家システム file block

### `mashos-api/ai/services/ai_inference/fcm_push_queue.py`
- repo: `mashos-api`
- 国家システム区分: `Queue / Worker`
- 現行状態: `active`
- 国家システム上の役割: FCM push送信をAPI/cron/worker内の直接外部通信から切り離し、`send_fcm_push_v1` jobとして `astor_jobs` にenqueueする。
- 上流:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_follow.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`
  - `mashos-api/ai/docs/WORKER_OPERATIONS.md`

### `mashos-api/ai/services/ai_inference/.env.worker.example`
- repo: `mashos-api`
- 国家システム区分: `Worker / Config`
- 現行状態: `active`
- 国家システム上の役割: 高負荷時にAPI serviceとworker serviceを分けるためのenv例。`ASTOR_WORKER_PROFILE`、FCM queue、stale running復旧を含む。
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/docs/WORKER_OPERATIONS.md`

### `mashos-api/ai/docs/WORKER_OPERATIONS.md`
- repo: `mashos-api`
- 国家システム区分: `Operation`
- 現行状態: `active`
- 国家システム上の役割: worker profile、増設順、queue滞留確認、stale running復旧、notification workerを運用面で固定する。
- 上流:
  - なし
- 下流:
  - `mashos-api/scripts/astor_worker_status.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/.env.worker.example`

### `mashos-api/scripts/astor_worker_status.py`
- repo: `mashos-api`
- 国家システム区分: `Operation / Verification`
- 現行状態: `active`
- 国家システム上の役割: queue stats、profile別滞留、stale running job復旧、pressure判定を行う。
- 上流:
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/docs/WORKER_OPERATIONS.md`

### `mashos-api/ai/docs/LOAD_TESTING.md`
- repo: `mashos-api`
- 国家システム区分: `Verification`
- 現行状態: `active`
- 国家システム上の役割: read/write/mixの負荷試験手順とp50/p95/p99、queue滞留確認を固定する。
- 上流:
  - なし
- 下流:
  - `mashos-api/scripts/cocolon_load_test.py`
- 落とすと漏れる関連ファイル:
  - `mashos-api/scripts/astor_worker_status.py`

### `mashos-api/scripts/cocolon_load_test.py`
- repo: `mashos-api`
- 国家システム区分: `Verification`
- 現行状態: `active`
- 国家システム上の役割: `app-bootstrap`、`startup`、`home-state`、`emotion-submit`、`piece-preview`、`mix` の負荷試験を行う。
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/docs/LOAD_TESTING.md`

## 既存 file の差分

- `mashos-api/ai/services/ai_inference/astor_job_queue.py` は `ready_queued`、`delayed_queued`、`running`、`failed`、`oldest_ready_age_seconds`、`stale_running_count` 等のqueue statsとstale復旧を持つ。
- `mashos-api/ai/services/ai_inference/astor_worker.py` は `all/core/analysis/inspect/ranking/summary/notification` profileを持ち、`send_fcm_push_v1` をnotification profileで処理する。
- `mashos-api/ai/services/ai_inference/api_cron_distribution.py` / `api_today_question.py` / `api_follow.py` は通知を直接FCM送信せず、queueへ逃がす。


# 2026-05-09 差分追記: Snapshot / Worker / Publish / Read current boundary

| file | Snapshot / Worker / Read上の役割 |
|---|---|
| `mashos-api/ai/services/ai_inference/astor_material_snapshots.py` | `today_question_answers` からstatic/personal両方の回答をself_structure素材へ変換する。public面には出さない |
| `mashos-api/ai/services/ai_inference/analysis_engine_adapter.py` | personal回答の `question_type` / `source_anchor` / hidden_meta を分析入力へ渡す |
| `mashos-api/ai/services/ai_inference/api_today_question.py` | `GET /today-question/history` で `question_origin` と `source_anchor_summary` を返す |
| `mashos-api/ai/services/ai_inference/api_emotion_submit.py` | 感情通知Pushは `send_fcm_push_v1` queueまたはdirectで処理する。queue modeではAPI側credential不足でenqueueを止めない |
| `mashos-api/ai/services/ai_inference/.env.worker.example` | `ASTOR_WORKER_PROFILE=all` をsingle/local worker例にし、notification worker分離時のみ `core` を使う |

personal_followupのsource_anchorは、通知や公開feedでは使わず、アプリ内表示・履歴・self_structure用途に限定します。


# 2026-05-09 実ファイル再照合: current owner補正

この表は `Cocolon(138).zip` / `mashos-api_2(26).zip` の実ファイル一覧と、この資料内の current 参照を照合した補正です。
旧本文内の `active` / `shared` / `legacy-live` 表記よりも、この表を優先します。旧名称はDB physical name / compat / 旧route説明として保管できるが、current実ファイルownerとしては扱いません。

| 旧参照path | 実ファイル照合 | current owner / 読み方 |
|---|---|---|
| `Cocolon/screens/DiscoveriesHistoryDetailScreen.js` | local snapshot未収録 | Cocolon/screens/PieceLibraryScreen.js / Cocolon/screens/NexusScreen.js。Discoveries専用history detailはcurrent fileとして存在しない。 |
| `Cocolon/screens/DiscoveriesHistoryListScreen.js` | local snapshot未収録 | Cocolon/screens/PieceLibraryScreen.js / Cocolon/screens/NexusScreen.js。Discoveries専用history listはcurrent fileとして存在しない。 |
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
| `Cocolon/screens/MyWebContentFirstScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisContentFirstScreen.js |
| `Cocolon/screens/MyWebEmotionAnalysisScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisEmotionScreen.js |
| `Cocolon/screens/MyWebEnsureClient.js` | local snapshot未収録 | Cocolon/screens/AnalysisEnsureClient.js |
| `Cocolon/screens/MyWebHistoryScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisHistoryScreen.js |
| `Cocolon/screens/MyWebInputHistoryMenuScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisInputHistoryMenuScreen.js |
| `Cocolon/screens/MyWebMenuCommon.js` | local snapshot未収録 | Cocolon/screens/AnalysisMenuCommon.js |
| `Cocolon/screens/MyWebReportHistoryScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisReportHistoryScreen.js |
| `Cocolon/screens/MyWebReportScheduleUtils.js` | local snapshot未収録 | Cocolon/screens/AnalysisReportScheduleUtils.js |
| `Cocolon/screens/MyWebReportViewerScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisReportViewerScreen.js |
| `Cocolon/screens/MyWebScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisScreen.js |
| `Cocolon/screens/MyWebSelfStructureScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisSelfStructureScreen.js |
| `Cocolon/screens/MyWebTopScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisTopScreen.js |
| `Cocolon/screens/RankingAllUsersScreen.js` | local snapshot未収録 | Cocolon/screens/RankingTopScreen.js と各ranking screen。AllUsers専用screenはcurrent fileとして存在しない。 |
| `Cocolon/screens/RankingMyModelMenuScreen.js` | local snapshot未収録 | Cocolon/screens/RankingTopScreen.js |
| `Cocolon/screens/RankingPersonalUsersScreen.js` | local snapshot未収録 | Cocolon/screens/RankingTopScreen.js と current ranking screen群。PersonalUsers専用screenはcurrent fileとして存在しない。 |
| `Cocolon/screens/nexus/NexusReflectionCard.js` | local snapshot未収録 | Cocolon/screens/nexus/NexusPieceCard.js |
| `mashos-api/ai/services/ai_inference/api_ranking_mymodel_discoveries.py` | local snapshot未収録 | 今回local snapshotには存在しない。current ranking ownerは api_ranking.py / api_ranking_piece_views.py / api_ranking_piece_resonances.py / api_ranking_mymodel_views.py / api_ranking_mymodel_resonances.py。 |

# 2026-05-09 差分追記: App root split / startup / read-side display boundary

App rootは `App.js` entry shellから、`navigation/*`、`runtime/*`、`components/GlobalFrameLayout.js` へ分割されています。startup / push / linking / read-side display のroute名は変更しません。

| file | 国家システム上の読み方 |
|---|---|
| `navigation/RootNavigator.js` | auth gate、IAP observer、push token sync、root stack制御。provider順序を変えない |
| `navigation/MainTabs.js` | startup warmup、unread prefetch、self-structure banner、tab表示 |
| `navigation/notificationRouting.js` | push通知payloadからInput / Analysis / EmotionLogへ開くroute解決 |
| `navigation/linkingRuntime.js` | share code linkからAccount表示へつなぐread-side route解決 |
| `runtime/AppRuntimeBootstrapGate.js` | `/app/bootstrap` の取得とruntime gate |
| `runtime/AppRuntimeBlockingScreen.js` | minimum supported version block表示 |
| `components/GlobalFrameLayout.js` | display frame。data contractとは別境界 |

本番監視では、RootNavigator / AppRuntimeBootstrapGate で発生したpush / IAP / bootstrap系エラーを `lib/monitoring.js` へ渡す。これはstartup snapshotやread-side payloadの形を変えない。

# 2026-05-12 差分追記: こころ天気 Snapshot / Publish / Read boundary

こころ天気は、Analysisのread-sideとreport artifact payloadに追加された表現層です。snapshot / publish / access policyの既存判断を置き換えません。

| 境界 | owner | 読み方 |
|---|---|---|
| current weather read | `api_analysis_reads.py` / `kokoro_weather_service.py` | 今日0:00〜現在の本人向け観測を作り、`/analysis/home-summary.current_weather` として返す。今日入力がない場合は `status=no_observation` |
| report artifact payload | `api_analysis_reports.py` / `kokoro_weather_service.py` | `content_json.kokoroWeather` を `standardReport` / `metrics` / `days` / `weeks` の既存payloadへadditive追加する |
| RN report display | `AnalysisReportViewerScreen.js` / `KokoroWeatherForecastStrip.js` / `KokoroWeatherDetailModal.js` | `kokoroWeather` がある時だけ天気図風UIを表示し、ない時は従来のグラフ/本文のみ表示する |
| publish governance | `publish_governance.py` / `access_policy/report_access_policy.py` | 変更なし。表示対象・履歴保持・tier判定は既存結果を使う |

`current_weather` は他者公開用surfaceではありません。`kokoroWeather` も既存レポートの補助表示であり、レポートの公開可否や履歴保持の判定を上書きしません。
