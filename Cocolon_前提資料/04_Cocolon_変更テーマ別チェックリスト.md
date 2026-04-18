---
doc_id: cocolon_change_theme_checklists
title: "Cocolon 変更テーマ別チェックリスト"
revision_date: "2026-04-18"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 133
  mashos-api: 247
purpose: "変更テーマから必要ファイルと rule file を逆引きできるようにする（EmlisAI 更新版）"
---

# 1. 使い方

変更指示を受けたら、まずテーマを 1 つ決める。  
そのテーマの表を上から順に確認する。

順番は固定。

1. `命名`
2. `frontend entry`
3. `client lib / shared`
4. `backend api`
5. `runtime / governance`
6. `rule files`

# 2. テーマ別

## 2-1. Input / Home

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/InputScreen.js`, `components/NoticeModal.js`, `components/TodayQuestionCard.js`, `components/EmotionReflectionPreviewModal.js`, `screens/NoticeHistoryScreen.js`, `screens/TodayQuestionHistoryScreen.js` |
| client lib | `lib/noticeApi.js`, `lib/todayQuestionApi.js`, `lib/emotionReflectionApi.js`, `lib/apiClient.js` |
| backend api | `api_emotion_submit.py`, `emotion_submit_service.py`, `api_notice.py`, `api_today_question.py`, `api_input_summary.py`, `api_global_summary.py`, `api_emotion_reflection.py` |
| runtime / governance | `emlis_ai_reply_service.py`, `emlis_ai_context_service.py`, `input_feedback_text_templates.py`, `astor_snapshot_enqueue.py`, `astor_worker.py`, `publish_governance.py`, `startup_snapshot_store.py` |
| rule files | `API_CONTRACT_POLICY.md`, `check_no_direct_supabase.py` |

見落とし禁止:
- Input の変更でも startup / unread / summary に波及することがある
- 入力直後返答が絡むなら EmlisAI 系も必ず見る
- `InputScreen.js` だけ見て終わらせない

## 2-2. Analysis / MyWeb

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/MyWebScreen.js`, `screens/MyWebContentFirstScreen.js`, `screens/MyWebReportHistoryScreen.js`, `screens/MyWebReportViewerScreen.js`, `screens/MyWebHistoryScreen.js`, `screens/DeepInsightScreen.js` |
| client lib | `lib/apiClient.js`, `lib/historyRetentionLabel.js` |
| backend api | `api_myweb_reports.py`, `api_myweb_reads.py`, `api_report_reads.py`, `api_deep_insight.py`, `api_cron_distribution.py` |
| runtime / governance | `publish_governance.py`, `response_microcache.py`, `astor_material_snapshots.py`, `astor_worker.py` |
| rule files | `API_CONTRACT_POLICY.md`, `PUBLIC_API_REGISTRY.md` |

## 2-3. Self Structure

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/MyWebSelfStructureScreen.js`, `screens/SelfStructureReportGenerateScreen.js`, `screens/SelfStructureReportHistoryScreen.js`, `screens/SelfStructureReportViewerScreen.js` |
| client lib | `lib/apiClient.js`, `SubscriptionContext.js` |
| backend api | `api_myprofile.py`, `api_myprofile_reports_read.py` |
| runtime / governance | `astor_material_snapshots.py`, `astor_worker.py`, `astor_myprofile_report.py`, `analysis_engine/self_structure_engine/*`, `publish_governance.py`, `subscription.py` |
| rule files | `API_CONTRACT_POLICY.md` |

## 2-4. Piece画面 / Nexus

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/MyModelEntryScreen.js`, `screens/NexusScreen.js`, `screens/MyModelScreen.js`, `screens/MyModelReflectionsScreen.js`, `screens/MyModelReactionHistoryScreen.js` |
| client lib | `lib/nexusApi.js`, `lib/apiClient.js` |
| backend api | `api_nexus.py`, `api_mymodel_qna.py`, `api_friends.py` |
| runtime / governance | `generated_reflection_display.py`, `astor_reflection_store.py`, `astor_reflection_engine.py`, `publish_governance.py` |
| rule files | `API_CONTRACT_POLICY.md`, `PUBLIC_API_REGISTRY.md` |

## 2-5. Piece単体 / generated reflection / qna

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/MyModelReflectionsScreen.js`, `screens/NexusScreen.js`, `screens/nexus/NexusReflectionCard.js` |
| client lib | `lib/nexusApi.js` |
| backend api | `api_mymodel_qna.py`, `api_nexus.py` |
| runtime / governance | `generated_reflection_display.py`, `generated_reflection_identity.py`, `astor_reflection_store.py`, `reflection_publish_entitlements.py`, `publish_governance.py` |
| rule files | `API_CONTRACT_POLICY.md` |

## 2-6. ProfileCreate

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/MyModelCreateScreen.js`, `screens/AccountScreen.js` |
| client lib | `lib/apiClient.js` |
| backend api | `api_mymodel_create.py` |
| runtime / governance | `mymodel_entitlements.py`, `subscription.py`, `subscription_store.py`, `astor_material_snapshots.py` |
| rule files | `API_CONTRACT_POLICY.md` |

## 2-7. EmotionGeneratedPiece

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/InputScreen.js`, `components/EmotionReflectionPreviewModal.js` |
| client lib | `lib/emotionReflectionApi.js` |
| backend api | `api_emotion_reflection.py`, `emotion_submit_service.py` |
| runtime / governance | `emlis_ai_reply_service.py`, `emotion_reflection_generation_service.py`, `emotion_reflection_store.py`, `emotion_submit_service.py`, `reflection_publish_entitlements.py`, `publish_governance.py` |
| rule files | `API_CONTRACT_POLICY.md` |

見落とし禁止:
- Input submit と Piece storage の両方に触る可能性がある
- publish 後返答は通常入力と同じ EmlisAI path を通る

## 2-8. EmotionLog / 感情通知 / Follow

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/EmotionLogScreen.js`, `screens/FollowListScreen.js`, `screens/AccountScreen.js` |
| client lib | `lib/apiClient.js` |
| backend api | `api_friends.py`, `api_myprofile.py` |
| runtime / governance | `astor_friend_feed_store.py`, `startup_snapshot_store.py`, `response_microcache.py` |
| rule files | `API_CONTRACT_POLICY.md`, `PUBLIC_API_REGISTRY.md` |

## 2-9. Ranking

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/RankingTopScreen.js` と各ランキング詳細 |
| client lib | `lib/apiClient.js` |
| backend api | `api_ranking.py`, `api_ranking_login_streak.py`, `api_ranking_mymodel_*` |
| runtime / governance | `astor_ranking_boards.py`, `astor_ranking_enqueue.py`, `astor_worker.py` |
| rule files | `API_CONTRACT_POLICY.md` |

## 2-10. Account / Settings / Subscription / Distribution

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/AccountScreen.js`, `screens/SettingsScreen.js`, `screens/SettingsAppSettingsScreen.js`, `screens/SettingsOtherScreen.js`, `screens/SubscriptionSelectScreen.js`, `lib/iap/iapRuntimeCatalog.js` |
| client lib | `lib/subscriptionApi.js`, `lib/reportDistributionApi.js`, `lib/iap/*` |
| backend api | `api_account_lifecycle.py`, `api_account_status.py`, `api_account_visibility.py`, `api_subscription.py`, `subscription_bootstrap_store.py`, `api_report_distribution_settings.py` |
| runtime / governance | `emlis_ai_capability.py`, `subscription.py`, `subscription_store.py`, `report_distribution_settings_store.py`, `publish_governance.py` |
| rule files | `Cocolon/SUBSCRIPTION_RELEASE_PHASE3.md`, `Cocolon/SUBSCRIPTION_RELEASE_PHASE4.md`, `ai/docs/iap_subscription_update.md`, `API_CONTRACT_POLICY.md` |

見落とし禁止:
- EmlisAI の Plus / Premium 差分は copy だけでなく runtime capability とセットで確認する

## 2-11. App startup / unread / bootstrap

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `App.js`, `UnreadContext.js`, `components/UnreadBadge.js` |
| client lib | `lib/apiClient.js`, `lib/noticeApi.js`, `lib/todayQuestionApi.js` |
| backend api | `api_app_bootstrap.py`, `api_notice.py`, `api_today_question.py`, `api_report_reads.py`, `api_global_summary.py`, `api_input_summary.py`, `api_subscription.py` |
| runtime / governance | `startup_snapshot_store.py`, `subscription_bootstrap_store.py`, `response_microcache.py` |
| rule files | `API_CONTRACT_POLICY.md`, `PUBLIC_API_REGISTRY.md` |

## 2-12. Tutorial

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `TutorialContext.js`, `components/TutorialOverlay.js`, 関連 screen |
| client lib | 該当なし |
| backend api | 該当なし |
| runtime / governance | 該当なし |
| rule files | `ai/docs/TUTORIAL_STABILITY_REDESIGN.md` |

## 2-13. Public API contract 変更

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `lib/apiClient.js`, 該当 screen |
| client lib | `lib/apiClient.js` |
| backend api | 該当 `api_*.py` |
| runtime / governance | `api_contract_registry.py`, `middleware_api_contract.py`, `tests/contract/*` |
| rule files | `API_CONTRACT_POLICY.md`, `PUBLIC_API_REGISTRY.md`, `NATIONAL_ALIGNMENT_AUDIT_PHASE5.md`, `check_no_direct_supabase.py` |

## 2-14. EmlisAI immediate response

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/InputScreen.js`, `screens/SubscriptionSelectScreen.js`, `lib/iap/iapRuntimeCatalog.js` |
| client lib | `lib/subscriptionApi.js`, `lib/emotionReflectionApi.js` |
| backend api | `api_emotion_submit.py`, `api_emotion_reflection.py`, `api_subscription.py` |
| runtime / governance | `emotion_submit_service.py`, `emlis_ai_capability.py`, `emlis_ai_context_service.py`, `emlis_ai_world_model_service.py`, `emlis_ai_style_profile_service.py`, `emlis_ai_reply_service.py`, `emlis_ai_greeting_state_store.py`, `emotion_history_search_service.py`, `subscription_bootstrap_store.py`, `input_feedback_text_templates.py` |
| rule files | `API_CONTRACT_POLICY.md`, `ai/docs/emlis_ai_greeting_state.sql`, `tests/contract/test_emlis_ai_contracts.py`, `tests/test_emlis_ai_greeting_state_store.py` |

見落とし禁止:
- `comment_text` を消さない
- Free で履歴を取りに行かない
- Plus から履歴 retrieval を必須にする
- Premium の差分は personalization 深度で出す
- greeting-state は DB と repo/doc を同期管理する
