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
  mashos-api: 250
purpose: "変更テーマから必要ファイルと rule file を逆引きできるようにする（Home write gate / Piece再定義版）"
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

## 2-1. Home / Input / write gate

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/InputScreen.js`, `components/NoticeModal.js`, `components/TodayQuestionCard.js`, `components/EmotionReflectionPreviewModal.js`, `screens/NoticeHistoryScreen.js`, `screens/TodayQuestionHistoryScreen.js` |
| client lib | `lib/noticeApi.js`, `lib/todayQuestionApi.js`, `lib/emotionReflectionApi.js`, `lib/apiClient.js` |
| backend api | `api_emotion_submit.py`, `emotion_submit_service.py`, `api_notice.py`, `api_today_question.py`, `api_input_summary.py`, `api_global_summary.py`, `api_emotion_reflection.py` |
| runtime / governance | `emlis_ai_reply_service.py`, `emlis_ai_context_service.py`, `input_feedback_text_templates.py`, `astor_snapshot_enqueue.py`, `astor_worker.py`, `publish_governance.py`, `startup_snapshot_store.py` |
| rule files | `API_CONTRACT_POLICY.md`, `check_no_direct_supabase.py` |

見落とし禁止:
- Home は唯一の primary write gate として読む
- Piece 作成入口を Piece画面 / ProfileCreate / DeepInsight に戻さない
- `InputScreen.js` だけ見て終わらせない

## 2-2. Analysis / MyWeb

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/MyWebScreen.js`, `screens/MyWebContentFirstScreen.js`, `screens/MyWebReportHistoryScreen.js`, `screens/MyWebReportViewerScreen.js`, `screens/MyWebHistoryScreen.js` |
| client lib | `lib/apiClient.js`, `lib/historyRetentionLabel.js` |
| backend api | `api_myweb_reports.py`, `api_myweb_reads.py`, `api_report_reads.py`, `api_cron_distribution.py` |
| runtime / governance | `publish_governance.py`, `response_microcache.py`, `astor_material_snapshots.py`, `astor_worker.py` |
| rule files | `API_CONTRACT_POLICY.md`, `PUBLIC_API_REGISTRY.md` |

見落とし禁止:
- current live flow では DeepInsight route を MyWeb に戻さない
- orphan cleanup をする時だけ `screens/DeepInsightScreen.js` / `api_deep_insight.py` を別枠で確認する

## 2-3. Self Structure

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/MyWebSelfStructureScreen.js`, `screens/SelfStructureReportGenerateScreen.js`, `screens/SelfStructureReportHistoryScreen.js`, `screens/SelfStructureReportViewerScreen.js` |
| client lib | `lib/apiClient.js`, `SubscriptionContext.js` |
| backend api | `api_myprofile.py`, `api_myprofile_reports_read.py` |
| runtime / governance | `astor_material_snapshots.py`, `astor_worker.py`, `astor_myprofile_report.py`, `analysis_engine/self_structure_engine/*`, `publish_governance.py`, `subscription.py` |
| rule files | `API_CONTRACT_POLICY.md` |

見落とし禁止:
- ProfileCreate / DeepInsight を材料へ戻さない
- emotion input 起点の material と account-only asset を混ぜない

## 2-4. Piece画面 / Nexus / read-social

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/MyModelEntryScreen.js`, `screens/MyModelScreen.js`, `screens/NexusScreen.js`, `screens/MyModelReflectionsScreen.js`, `screens/MyModelReactionHistoryScreen.js`, `lib/nexusApi.js` |
| client lib | `lib/nexusApi.js`, `lib/apiClient.js` |
| backend api | `api_nexus.py`, `api_mymodel_qna.py` |
| runtime / governance | `generated_reflection_display.py`, `astor_reflection_store.py`, `astor_reflection_engine.py`, `publish_governance.py` |
| rule files | `API_CONTRACT_POLICY.md`, `PUBLIC_API_REGISTRY.md` |

見落とし禁止:
- current visible flow では Piece 画面から作成しない
- `trending / holders` UI を勝手に復活させない
- generated Piece read path と legacy question discovery route を混同しない

## 2-5. Piece単体 / generated reflection / qna

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/InputScreen.js`, `components/EmotionReflectionPreviewModal.js`, `screens/MyModelReflectionsScreen.js`, `screens/NexusScreen.js` |
| client lib | `lib/emotionReflectionApi.js`, `lib/nexusApi.js` |
| backend api | `api_emotion_reflection.py`, `api_nexus.py`, `api_mymodel_qna.py` |
| runtime / governance | `reflection_publish_entitlements.py`, `emotion_reflection_generation_service.py`, `emotion_reflection_store.py`, `emotion_submit_service.py`, `publish_governance.py` |
| rule files | `API_CONTRACT_POLICY.md` |

見落とし禁止:
- current input only 仕様を崩さない
- ProfileCreate question corpus を Piece source に戻さない

## 2-6. ProfileCreate / account asset

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/AccountScreen.js`, `screens/MyModelCreateScreen.js`, `App.js` |
| client lib | `lib/apiClient.js` |
| backend api | `api_mymodel_create.py` |
| runtime / governance | `mymodel_entitlements.py`, `subscription.py`, `subscription_store.py` |
| rule files | `API_CONTRACT_POLICY.md` |

見落とし禁止:
- Account-only asset として扱う
- snapshot / self structure / ranking / Piece discovery に再接続しない
- `MyModelCreate` canonical を消す話と、意味の孤立化を混ぜない

## 2-7. DeepInsight (legacy cleanup only)

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/MyWebScreen.js`, `screens/DeepInsightScreen.js`, `App.js` |
| client lib | 該当なし |
| backend api | `app.py`, `api_contract_registry.py`, `api_deep_insight.py` |
| runtime / governance | `PUBLIC_API_REGISTRY.md`, `tests/contract/test_api_contract_registry.py` |
| rule files | `API_CONTRACT_POLICY.md`, `PUBLIC_API_REGISTRY.md` |

見落とし禁止:
- file 存在だけで live route があると判断しない
- public route / registry / app registration / current frontend flow をセットで確認する

## 2-8. EmotionLog / 感情通知 / Follow

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/EmotionLogScreen.js`, `screens/FollowListScreen.js`, `screens/AccountScreen.js` |
| client lib | `lib/apiClient.js` |
| backend api | `api_friends.py`, `api_myprofile.py` |
| runtime / governance | `astor_friend_feed_store.py`, `startup_snapshot_store.py`, `response_microcache.py` |
| rule files | `API_CONTRACT_POLICY.md`, `PUBLIC_API_REGISTRY.md` |

## 2-9. Ranking / Piece count

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/RankingTopScreen.js`, `screens/MyModelQuestionsRankingScreen.js`, `screens/InputCountRankingScreen.js`, `screens/InputLengthRankingScreen.js` |
| client lib | `lib/apiClient.js` |
| backend api | `api_ranking.py`, `api_account_status.py` |
| runtime / governance | `astor_ranking_kernel.py`, `astor_ranking_boards.py`, `astor_account_status_store.py`, `astor_account_status_kernel.py`, `astor_worker.py` |
| rule files | `API_CONTRACT_POLICY.md`, `PUBLIC_API_REGISTRY.md` |

見落とし禁止:
- Piece 数の visible meaning は generated Piece
- response key は `mymodel_questions_total` / `questions_total` の legacy 名を維持している
- key rename と semantics change を混ぜない

## 2-10. Account / Settings / Subscription

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/AccountScreen.js`, `screens/SettingsScreen.js`, `screens/SettingsAppSettingsScreen.js`, `screens/SettingsOtherScreen.js`, `screens/SubscriptionSelectScreen.js`, `lib/iap/iapRuntimeCatalog.js` |
| client lib | `lib/subscriptionApi.js`, `lib/reportDistributionApi.js`, `lib/iap/*` |
| backend api | `api_account_lifecycle.py`, `api_account_status.py`, `api_account_visibility.py`, `api_subscription.py`, `subscription_bootstrap_store.py`, `api_report_distribution_settings.py` |
| runtime / governance | `emlis_ai_capability.py`, `subscription.py`, `subscription_store.py`, `report_distribution_settings_store.py`, `publish_governance.py`, `astor_account_status_store.py` |
| rule files | `Cocolon/SUBSCRIPTION_RELEASE_PHASE3.md`, `Cocolon/SUBSCRIPTION_RELEASE_PHASE4.md`, `ai/docs/iap_subscription_update.md`, `API_CONTRACT_POLICY.md` |

見落とし禁止:
- ProfileCreate 編集特典の obsolete copy を戻さない
- Piece count / account status / ranking semantics をセットで見る

## 2-11. App startup / unread / bootstrap

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `App.js`, `UnreadContext.js`, `components/NoticeModal.js`, `components/TodayQuestionCard.js` |
| client lib | `lib/apiClient.js`, `lib/noticeApi.js`, `lib/todayQuestionApi.js` |
| backend api | `api_app_bootstrap.py`, `api_notice.py`, `api_today_question.py`, `api_report_reads.py`, `api_global_summary.py`, `api_input_summary.py`, `api_subscription.py` |
| runtime / governance | `startup_snapshot_store.py`, `subscription_bootstrap_store.py`, `response_microcache.py` |
| rule files | `API_CONTRACT_POLICY.md`, `PUBLIC_API_REGISTRY.md` |

## 2-12. Public API contract / live route

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `lib/apiClient.js`, 該当 screen |
| client lib | `lib/apiClient.js` |
| backend api | 該当 `api_*.py`, `app.py`, `api_contract_registry.py` |
| runtime / governance | `PUBLIC_API_REGISTRY.md`, `tests/contract/*`, `backend_route_inventory.csv`, `public_api_registry.csv` |
| rule files | `API_CONTRACT_POLICY.md`, `PUBLIC_API_REGISTRY.md`, `NATIONAL_ALIGNMENT_AUDIT_PHASE5.md`, `check_no_direct_supabase.py` |

見落とし禁止:
- DeepInsight のように file が残っても current live route と限らない
- Piece count のように semantics が変わっても key 名は維持されうる
