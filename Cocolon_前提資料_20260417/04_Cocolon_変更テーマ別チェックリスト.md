---
doc_id: cocolon_change_theme_checklists
title: "Cocolon 変更テーマ別チェックリスト"
revision_date: "2026-04-17"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 133
  mashos-api: 238
purpose: "変更テーマから必要ファイルと rule file を逆引きできるようにする"
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
| backend api | `api_emotion_submit.py`, `api_notice.py`, `api_today_question.py`, `api_input_summary.py`, `api_global_summary.py`, `api_emotion_reflection.py` |
| runtime / governance | `astor_snapshot_enqueue.py`, `astor_worker.py`, `publish_governance.py`, `startup_snapshot_store.py` |
| rule files | `API_CONTRACT_POLICY.md`, `check_no_direct_supabase.py` |

見落とし禁止:
- Input の変更でも startup / unread / summary に波及することがある
- Piece 作成ボタンが絡むなら EmotionGeneratedPiece 側も見る

## 2-2. Analysis / MyWeb

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/MyWebScreen.js`, `screens/MyWebContentFirstScreen.js`, `screens/MyWebReportHistoryScreen.js`, `screens/MyWebReportViewerScreen.js`, `screens/MyWebHistoryScreen.js`, `screens/DeepInsightScreen.js` |
| client lib | `lib/apiClient.js`, `lib/historyRetentionLabel.js` |
| backend api | `api_myweb_reports.py`, `api_myweb_reads.py`, `api_report_reads.py`, `api_deep_insight.py`, `api_cron_distribution.py` |
| runtime / governance | `publish_governance.py`, `response_microcache.py`, `astor_material_snapshots.py`, `astor_worker.py` |
| rule files | `API_CONTRACT_POLICY.md`, `PUBLIC_API_REGISTRY.md` |

見落とし禁止:
- `MyWebScreen.js` は hub なので、1 サブ画面だけ見て終わらない
- read/unread / ready/detail / publish をセットで見る

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
- UI の `deep` と backend canonical の `structural` を混同しない
- latest preview と monthly history を区別する

## 2-4. Piece画面 / Nexus

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/MyModelEntryScreen.js`, `screens/NexusScreen.js`, `screens/MyModelScreen.js`, `screens/MyModelReflectionsScreen.js`, `screens/MyModelReactionHistoryScreen.js` |
| client lib | `lib/nexusApi.js`, `lib/apiClient.js` |
| backend api | `api_nexus.py`, `api_mymodel_qna.py`, `api_friends.py` |
| runtime / governance | `generated_reflection_display.py`, `astor_reflection_store.py`, `astor_reflection_engine.py`, `publish_governance.py` |
| rule files | `API_CONTRACT_POLICY.md`, `PUBLIC_API_REGISTRY.md` |

見落とし禁止:
- `NexusScreen` だけで完結しない
- `Piece画面` と `Piece単体` を混同しない

## 2-5. Piece単体 / generated reflection / qna

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/MyModelReflectionsScreen.js`, `screens/NexusScreen.js`, `screens/nexus/NexusReflectionCard.js` |
| client lib | `lib/nexusApi.js` |
| backend api | `api_mymodel_qna.py`, `api_nexus.py` |
| runtime / governance | `generated_reflection_display.py`, `generated_reflection_identity.py`, `astor_reflection_store.py`, `reflection_publish_entitlements.py`, `publish_governance.py` |
| rule files | `API_CONTRACT_POLICY.md` |

見落とし禁止:
- Reflection canonical は backend 側に残る
- visible copy を Piece に変えても storage canonical は別

## 2-6. ProfileCreate

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/MyModelCreateScreen.js`, `screens/AccountScreen.js` |
| client lib | `lib/apiClient.js` |
| backend api | `api_mymodel_create.py` |
| runtime / governance | `mymodel_entitlements.py`, `subscription.py`, `subscription_store.py`, `astor_material_snapshots.py` |
| rule files | `API_CONTRACT_POLICY.md` |

見落とし禁止:
- 固定プロフィール資産
- EmotionGeneratedPiece と混同しない

## 2-7. EmotionGeneratedPiece

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/InputScreen.js`, `components/EmotionReflectionPreviewModal.js` |
| client lib | `lib/emotionReflectionApi.js` |
| backend api | `api_emotion_reflection.py` |
| runtime / governance | `emotion_reflection_generation_service.py`, `emotion_reflection_store.py`, `emotion_submit_service.py`, `reflection_publish_entitlements.py`, `publish_governance.py` |
| rule files | `API_CONTRACT_POLICY.md` |

見落とし禁止:
- Input submit と Piece storage の両方に触る可能性がある
- quota / preview / publish / cancel を分けて確認する

## 2-8. EmotionLog / 感情通知 / Follow

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `screens/EmotionLogScreen.js`, `screens/FollowListScreen.js`, `screens/AccountScreen.js` |
| client lib | `lib/apiClient.js` |
| backend api | `api_friends.py`, `api_myprofile.py` |
| runtime / governance | `astor_friend_feed_store.py`, `startup_snapshot_store.py`, `response_microcache.py` |
| rule files | `API_CONTRACT_POLICY.md`, `PUBLIC_API_REGISTRY.md` |

見落とし禁止:
- UI 名は感情通知でも、backend は `/emotion-log/*` と `/friends/*` 互換を持つ
- memo 本文を出さない設計を崩さない

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
| frontend | `screens/AccountScreen.js`, `screens/SettingsScreen.js`, `screens/SettingsAppSettingsScreen.js`, `screens/SettingsOtherScreen.js`, `screens/SubscriptionSelectScreen.js` |
| client lib | `lib/subscriptionApi.js`, `lib/reportDistributionApi.js`, `lib/iap/*` |
| backend api | `api_account_lifecycle.py`, `api_account_status.py`, `api_account_visibility.py`, `api_subscription.py`, `api_report_distribution_settings.py` |
| runtime / governance | `subscription.py`, `subscription_store.py`, `report_distribution_settings_store.py`, `publish_governance.py` |
| rule files | `Cocolon/SUBSCRIPTION_RELEASE_PHASE3.md`, `Cocolon/SUBSCRIPTION_RELEASE_PHASE4.md`, `ai/docs/iap_subscription_update.md` |

## 2-11. App startup / unread / bootstrap

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `App.js`, `UnreadContext.js`, `components/UnreadBadge.js` |
| client lib | `lib/apiClient.js`, `lib/noticeApi.js`, `lib/todayQuestionApi.js` |
| backend api | `api_app_bootstrap.py`, `api_notice.py`, `api_today_question.py`, `api_report_reads.py`, `api_global_summary.py`, `api_input_summary.py` |
| runtime / governance | `startup_snapshot_store.py`, `response_microcache.py` |
| rule files | `API_CONTRACT_POLICY.md`, `PUBLIC_API_REGISTRY.md` |

見落とし禁止:
- `App.js` だけ直しても startup payload が合っていないと崩れる

## 2-12. Tutorial

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `TutorialContext.js`, `components/TutorialOverlay.js`, 関連 screen |
| client lib | 該当なし |
| backend api | 該当なし |
| runtime / governance | 該当なし |
| rule files | `ai/docs/TUTORIAL_STABILITY_REDESIGN.md` |

見落とし禁止:
- overlay 基盤を見ずに screen 個別の timeout 修正をしない

## 2-13. Public API contract 変更

| 確認層 | まず開く |
|---|---|
| 命名 | `03_Cocolon_命名体系.md` |
| frontend | `lib/apiClient.js`, 該当 screen |
| client lib | `lib/apiClient.js` |
| backend api | 該当 `api_*.py` |
| runtime / governance | `api_contract_registry.py`, `middleware_api_contract.py`, `tests/contract/*` |
| rule files | `API_CONTRACT_POLICY.md`, `PUBLIC_API_REGISTRY.md`, `NATIONAL_ALIGNMENT_AUDIT_PHASE5.md`, `check_no_direct_supabase.py` |

見落とし禁止:
- additive-only
- breaking change は新 route/version
- old build compatibility は server 側で吸収
