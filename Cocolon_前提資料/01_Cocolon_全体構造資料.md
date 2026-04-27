---
doc_id: cocolon_overall_structure_full_coverage
title: "Cocolon 全体構造資料"
revision_date: "2026-04-27"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 116
  mashos-api: 292
purpose: "華恋が Cocolon 構造に関係する全ファイルを system / relation 単位で復元できるようにする"
coverage:
  included_files_total: 408
  included_files_cocolon: 116
  included_files_mashos_api: 292
---

# 1. 1行定義

現行の Cocolon は、**RN surface + frontend boundary + backend public API + gateway / policy / worker + tests / rules** が繋がって動く 1 つのアプリです。  
repo は分かれていても、理解の単位は **system / feature / flow** です。

# 2. 全体構造の読み方

- `01A` は **アプリ基盤 / Home / startup / immediate reply**
- `01B` は **Analysis / Piece / EmotionLog / Ranking / Self Structure**
- `01C` は **Account / Subscription / ProfileCreate / support / rule / test / script**

この分け方は repo 軸ではなく、**Cocolon 内で一緒に動くものを同じ章に置く**ためのものです。

# 3. 全体 flow

`App root` → `RN screen / component / hook` → `frontend API boundary` → `backend public API` → `gateway / service / store / ASTOR / worker / access policy` → `read-side API` → `RN display`

# 4. 今回の current fact

- `Home write` は backend 内部 `home_gateway` に集約される
- `Home read` は `GET /home/state` を持つ
- `read-side visibility` は `access_policy` に寄っている
- `ProfileCreate` は current public 名として残る
- `MyModelCreate` は public route / public screen 名から外れ、legacy canonical 名が一部に残る
- `inventory` は廃止し、本文側に coverage を持たせる
- 三大要素の構造混在は 2026-04-22 時点で完了判定へ入り、次段の主戦場は中核外の構造混在になった
- Piece public read は `api_nexus.py` / `piece_public_read_service.py`、Analysis read は `report_artifact_read_service.py`、EmlisAI read adapter は `emlis_ai_readers.py` + summary readers へ固定した

# 5. 章と対象件数

2026-04-22 版の詳細ブロックは保持する。2026-04-25 時点の latest full coverage は後続の `2026-04-25 差分追記: current full coverage` を正本とする。

- latest full coverage: `408 files`
  - Cocolon: `116`
  - mashos-api: `292`

# 6. 任意の 1 ファイルから辿る時の原則

1. そのファイルの **system** を見る
2. **直接関係ファイル** を追う
3. **このファイルを直接参照するファイル** を追う
4. **修正時に必ず同時確認するファイル** を開く
5. 国家システムに関係する変更なら `02` 系へ移る

# 2026-04-25 差分追記: current full coverage

この章は、旧本文を破壊せず、現時点の Cocolon 構造に関係する全ファイルを本文へ追記するための coverage 補正です。`listed: support/sample outside runtime structure` は runtime 正本ではありませんが、前提資料上の漏れを防ぐため現物として記載します。

- 基準zip: `Cocolon(108).zip` / `mashos-api(30).zip`
- latest file count: `Cocolon=116` / `mashos-api=292` / `total=408`
- 既存の詳細ブロックは 2026-04-22 版の本文を保持しています。2026-04-25 時点の正本 coverage は、この差分追記ブロックで補正します。


# 2026-04-26 差分追記: latest full coverage 検証

`Cocolon(108).zip` / `mashos-api(30).zip` の file path 集合を `01` 系本文と照合した結果、Cocolon 構造に関係する current 全ファイルは引き続き本文内に記載済みです。

- Cocolon: `116/116`
- mashos-api: `292/292`
- total: `408/408`
- `01A` / `01B` / `01C` の本文記載欠落: `0`

このため、2026-04-26 時点でも `01` 系は **Cocolon 構造に関係する全ファイルを本文で記載する** という coverage 方針を満たしています。新規ファイル追加はなく、今回の変更は DB bridge/API read-only 境界の差分追記です。

## 2026-04-26 API read-only bridge で確認必須になったファイル

以下は、DB current bridge view を使う read-only path の境界として今後の修正時に必ず確認するファイルです。write path は旧物理 table のまま保持します。

- `mashos-api/ai/services/ai_inference/api_profile_create.py`
- `mashos-api/ai/services/ai_inference/api_piece_runtime.py`
- `mashos-api/ai/services/ai_inference/api_ranking.py`
- `mashos-api/ai/services/ai_inference/piece_public_read_store.py`
- `mashos-api/ai/services/ai_inference/piece_generation_store.py`
- `mashos-api/ai/services/ai_inference/api_emotion_notification_settings.py`
- `mashos-api/ai/services/ai_inference/api_follow.py`
- `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
- `mashos-api/ai/services/ai_inference/analysis_summary_reader.py`
- `mashos-api/ai/services/ai_inference/api_analysis_reads.py`
- `mashos-api/ai/services/ai_inference/api_analysis_reports.py`
- `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
- `mashos-api/ai/services/ai_inference/api_report_reads.py`
- `mashos-api/ai/services/ai_inference/api_self_structure.py`
- `mashos-api/ai/services/ai_inference/app.py`
- `mashos-api/ai/services/ai_inference/astor_emotion_log_feed_kernel.py`
- `mashos-api/ai/services/ai_inference/astor_emotion_log_feed_store.py`
- `mashos-api/ai/services/ai_inference/astor_self_structure_report.py`
- `mashos-api/ai/services/ai_inference/astor_worker.py`
- `mashos-api/ai/services/ai_inference/report_artifact_read_service.py`
- `mashos-api/ai/services/ai_inference/emotion_piece_store.py`
- `mashos-api/ai/services/ai_inference/piece_generated_access.py`
- `mashos-api/ai/services/ai_inference/piece_generated_maintenance.py`
- `mashos-api/ai/services/ai_inference/piece_generated_metrics.py`

| file | role | 2026-04-25 classification |
| --- | --- | --- |
| `Cocolon/.env.subscription.public.example` | RN app/support | include: RN app structure |
| `Cocolon/App.js` | RN app/support | include: RN app structure |
| `Cocolon/AuthContext.js` | RN app/support | include: RN app structure |
| `Cocolon/AuthScreen.js` | RN app/support | include: RN app structure |
| `Cocolon/REMOVE_RETIRED_COMPAT_FILES.txt` | RN app/support | include: RN app structure |
| `Cocolon/SUBSCRIPTION_RELEASE_PHASE3.md` | RN app/support | include: RN app structure |
| `Cocolon/SUBSCRIPTION_RELEASE_PHASE4.md` | RN app/support | include: RN app structure |
| `Cocolon/SubscriptionContext.js` | RN app/support | include: RN app structure |
| `Cocolon/TutorialContext.js` | RN app/support | include: RN app structure |
| `Cocolon/TutorialOverlay.js` | RN app/support | include: RN app structure |
| `Cocolon/UnreadContext.js` | RN app/support | include: RN app structure |
| `Cocolon/components/CocolonBackButton.js` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/CocolonButton.js` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/CocolonPressable.js` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/CocolonSwitch.js` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/Collapsible.tsx` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/EmotionPiecePreviewModal.js` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/ExternalLink.tsx` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/GuideRichText.js` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/GuideTermModal.js` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/HapticTab.tsx` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/HelloWave.tsx` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/NoticeModal.js` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/NoticeRichText.js` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/ParallaxScrollView.tsx` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/ThemedText.tsx` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/ThemedView.tsx` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/TodayQuestionCard.js` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/TodayQuestionModal.js` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/TutorialOverlay.js` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/TutorialStartModal.js` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/UnreadBadge.js` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/selfStructure/SelfStructureDeepRenderer.js` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/ui/IconSymbol.ios.tsx` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/ui/IconSymbol.tsx` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/ui/TabBarBackground.ios.tsx` | RN component/shared UI | include: RN app structure |
| `Cocolon/components/ui/TabBarBackground.tsx` | RN component/shared UI | include: RN app structure |
| `Cocolon/features/home/useHomeActions.js` | Home hook/state boundary | include: RN app structure |
| `Cocolon/features/home/useHomeState.js` | Home hook/state boundary | include: RN app structure |
| `Cocolon/guide/guidesJa.js` | RN app/support | include: RN app structure |
| `Cocolon/guide/termsJa.js` | RN app/support | include: RN app structure |
| `Cocolon/index.js` | RN app/support | include: RN app structure |
| `Cocolon/lib/accountLocalCleanup.js` | RN app/support | include: RN app structure |
| `Cocolon/lib/api/account/profileApi.js` | frontend API boundary | include: RN app structure |
| `Cocolon/lib/api/client.js` | frontend API boundary | include: RN app structure |
| `Cocolon/lib/api/home/emotionPieceApi.js` | frontend API boundary | include: RN app structure |
| `Cocolon/lib/api/home/emotionSubmitApi.js` | frontend API boundary | include: RN app structure |
| `Cocolon/lib/api/home/homeStateApi.js` | frontend API boundary | include: RN app structure |
| `Cocolon/lib/api/home/noticeApi.js` | frontend API boundary | include: RN app structure |
| `Cocolon/lib/api/home/todayQuestionApi.js` | frontend API boundary | include: RN app structure |
| `Cocolon/lib/apiClient.js` | frontend API boundary | include: RN app structure |
| `Cocolon/lib/compat/legacyWireContracts.js` | frontend legacy wire compatibility | include: RN app structure |
| `Cocolon/lib/emotionPieceApi.js` | frontend API boundary | include: RN app structure |
| `Cocolon/lib/historyRetentionLabel.js` | RN app/support | include: RN app structure |
| `Cocolon/lib/iap/iapConfig.js` | RN app/support | include: RN app structure |
| `Cocolon/lib/iap/iapRuntimeCatalog.js` | RN app/support | include: RN app structure |
| `Cocolon/lib/iap/iapService.js` | RN app/support | include: RN app structure |
| `Cocolon/lib/iap/index.js` | RN app/support | include: RN app structure |
| `Cocolon/lib/inputDraftStorage.js` | RN app/support | include: RN app structure |
| `Cocolon/lib/nexusApi.js` | frontend API boundary | include: RN app structure |
| `Cocolon/lib/noticeActionRuntime.js` | RN app/support | include: RN app structure |
| `Cocolon/lib/noticeApi.js` | frontend API boundary | include: RN app structure |
| `Cocolon/lib/pushToken.js` | RN app/support | include: RN app structure |
| `Cocolon/lib/reportDistributionApi.js` | frontend API boundary | include: RN app structure |
| `Cocolon/lib/subscriptionApi.js` | frontend API boundary | include: RN app structure |
| `Cocolon/lib/supabase.ts` | RN app/support | include: RN app structure |
| `Cocolon/lib/todayQuestionApi.js` | frontend API boundary | include: RN app structure |
| `Cocolon/lib/user.ts` | RN app/support | include: RN app structure |
| `Cocolon/screens/AccountScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/AnalysisContentFirstScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/AnalysisCrossLinkSection.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/AnalysisEmotionScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/AnalysisEnsureClient.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/AnalysisHistoryScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/AnalysisInputHistoryMenuScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/AnalysisMenuCommon.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/AnalysisReportHistoryScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/AnalysisReportScheduleUtils.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/AnalysisReportViewerScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/AnalysisScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/AnalysisSelfStructureScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/AnalysisTopScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/CocolonGuideScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/EmotionLogScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/EmotionRankingScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/FollowListScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/InputCountRankingScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/InputLengthRankingScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/InputScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/LoginStreakRankingScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/MenuActionCardCommon.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/NexusScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/NoticeHistoryScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/PieceEntryScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/PieceHistoryMenuScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/PieceLibraryScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/PieceMenuCommon.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/PieceResonanceRankingScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/PieceScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/ProfileCreateScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/RankingTopScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/ResonanceHistoryDetailScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/ResonanceHistoryListScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/SelfStructureReportGenerateScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/SelfStructureReportHistoryScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/SelfStructureReportViewerScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/SettingsAppSettingsScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/SettingsOtherScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/SettingsScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/SubscriptionSelectScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/TodayQuestionHistoryScreen.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/nexus/NexusEmotionRankingCard.js` | RN screen/surface | include: RN app structure |
| `Cocolon/screens/nexus/NexusPieceCard.js` | RN screen/surface | include: RN app structure |
| `Cocolon/theme/ThemeContext.js` | RN app/support | include: RN app structure |
| `Cocolon/ui/applyTypographyTokens.js` | RN app/support | include: RN app structure |
| `Cocolon/ui/uiTokens.js` | RN app/support | include: RN app structure |
| `mashos-api/ai/.env` | backend support | include: runtime/config support |
| `mashos-api/ai/Makefile` | backend support | include: runtime/config support |
| `mashos-api/ai/POST_MIGRATION_CHECKLIST.md` | backend support | listed: repository support |
| `mashos-api/ai/README_MIGRATION_QUICKSTART.md` | backend support | listed: repository support |
| `mashos-api/ai/configs/app_ids.yaml` | backend support | include: runtime/config support |
| `mashos-api/ai/configs/model_train.yaml` | backend support | include: runtime/config support |
| `mashos-api/ai/configs/runtime.yaml` | backend support | include: runtime/config support |
| `mashos-api/ai/data/config/astor_structure_dict.json` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/data/processed/features.json` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/data/processed/structure_dictionary.json` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/data/processed/summary.txt` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/data/raw/README_ingest.txt` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/data/raw/import_template.csv` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/data/raw/logs.jsonl` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/data/raw/schema.json` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/data/raw/template.csv` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/data/raw/template.json` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/data/train/{{AI_NAME}}_interpret_train.jsonl` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/docs/API_CONTRACT_POLICY.md` | docs/policy/SQL | include: policy/docs structure |
| `mashos-api/ai/docs/COCOLON_STRUCTURE_UNIFICATION_ADDENDUM_2026_04_21.md` | docs/policy/SQL | include: policy/docs structure |
| `mashos-api/ai/docs/NATIONAL_ALIGNMENT_AUDIT_PHASE5.md` | docs/policy/SQL | include: policy/docs structure |
| `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md` | docs/policy/SQL | include: policy/docs structure |
| `mashos-api/ai/docs/TUTORIAL_STABILITY_REDESIGN.md` | docs/policy/SQL | include: policy/docs structure |
| `mashos-api/ai/docs/api_contract.txt` | docs/policy/SQL | include: policy/docs structure |
| `mashos-api/ai/docs/data_ingest_guide.txt` | docs/policy/SQL | include: policy/docs structure |
| `mashos-api/ai/docs/emlis_ai_user_models.sql` | docs/policy/SQL | include: policy/docs structure |
| `mashos-api/ai/docs/iap_subscription_update.md` | docs/policy/SQL | include: policy/docs structure |
| `mashos-api/ai/docs/{{AI_NAME}}_spec.txt` | docs/policy/SQL | include: policy/docs structure |
| `mashos-api/ai/ingestion/mapping_sample.yaml` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/ingestion/user_logs_sample.csv` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/services/ai_inference/.env.subscription.backend.example` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/_samples/lora_load_example.py` | backend support | listed: support/sample outside runtime structure |
| `mashos-api/ai/services/ai_inference/access_policy/__init__.py` | access policy | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py` | access policy | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/access_policy/report_access_policy.py` | access policy | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/access_policy/subscription_context.py` | access policy | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py` | access policy | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/account_delete_service.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/active_users_store.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/analysis_engine_adapter.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/analysis_report_schema.json` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/analysis_summary_reader.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_account_lifecycle.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_account_status.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_account_visibility.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_activity_login.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_analysis_compat.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_analysis_reads.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_analysis_reports.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_app_bootstrap.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_connect.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_contract_registry.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_cron_distribution.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_emotion_history_manage.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_emotion_history_search.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_emotion_log.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_emotion_notification_settings.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_emotion_piece.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_emotion_secret.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_emotion_submit.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_follow.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_follow_graph.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_friends.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_global_summary.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_home_state.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_input_summary.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_myprofile.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_myweb_reads.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_myweb_reports.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_nexus.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_nexus_compat.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_notice.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_piece_compat.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_piece_runtime.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_profile_create.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_public_profile.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_ranking.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_ranking_mymodel_resonances.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_ranking_mymodel_views.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_ranking_piece_resonances.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_ranking_piece_views.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_relationship_compat.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_report_reads.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_retired_legacy_compat.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_self_structure.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_self_structure_reports.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_subscription.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/api_today_question.py` | backend public API owner/compat | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/app.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_account_status_kernel.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_account_status_store.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_analysis_insight.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_core.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_emotion_log_feed_enqueue.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_emotion_log_feed_kernel.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_emotion_log_feed_store.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_friend_feed_enqueue.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_friend_feed_kernel.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_friend_feed_store.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_global_summary_kernel.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_global_summary_store.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_job_queue.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_material_snapshots.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_myprofile_persona.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_myweb_insight.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_patterns.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_ranking_boards.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_ranking_kernel.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_reflection_engine.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_reflection_store.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_self_structure_persona.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_self_structure_report.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_structure_matcher.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/astor_worker.py` | ASTOR worker/queue/store | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/client_compat.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/cron_run_store.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/emlis_ai_capability.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_kernel.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/emlis_ai_prompt.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/emlis_ai_readers.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/emlis_ai_style_profile_service.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/emlis_ai_types.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/emlis_ai_world_model_service.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/emotion_history_search_service.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/emotion_piece_generation_service.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/emotion_piece_store.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/emotion_reflection_generation_service.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/emotion_reflection_store.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/emotion_submit_service.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/generated_reflection_display.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/generated_reflection_identity.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/generation_lock.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/guards/date_guard.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/home_gateway/__init__.py` | Home gateway | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/home_gateway/cache_invalidator.py` | Home gateway | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py` | Home gateway | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/home_gateway/command_types.py` | Home gateway | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/home_gateway/dispatch_planner.py` | Home gateway | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py` | Home gateway | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/home_gateway/emotion_submit_service.py` | Home gateway | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/home_gateway/notice_command_service.py` | Home gateway | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py` | Home gateway | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/home_gateway/today_question_command_service.py` | Home gateway | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/input_feedback_text_templates.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/input_summary_reader.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/mashlogic_profile_enhancer.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/mashlogic_qa_enhancer.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/middleware_active_user_touch.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/middleware_api_contract.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/middleware_request_perf.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/mymodel_entitlements.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/myprofile_section_text_templates.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/myweb_report_schema.json` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/notice_store.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/observability.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/persona_engine.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/piece_generated_access.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/piece_generated_display.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/piece_generated_identity.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/piece_generated_maintenance.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/piece_generated_metrics.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/piece_generated_reflection_access.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/piece_generation_engine.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/piece_generation_store.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/piece_public_read_service.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/piece_public_read_store.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/piece_publish_entitlements.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/piece_text_formatter.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/profile_create_entitlements.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/prompt_templates.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/prompts/interpret.en.txt` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/prompts/interpret.ja.txt` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/publish_governance.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/reflection_publish_entitlements.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/reflection_text_formatter.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/report_artifact_read_service.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/report_distribution_push_store.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/report_distribution_settings_store.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/report_text_templates.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/request_metrics.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/requirements.txt` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/response_microcache.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/route_compat_delegate.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/self_structure_section_text_templates.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/structure_dict.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/subscription.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/subscription_config.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/subscription_live_console_check.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/subscription_projection.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/subscription_release_config.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/subscription_runtime_config.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/subscription_store.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/subscription_trial_store.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/subscription_verifier_android.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/subscription_webhooks.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/supabase_auth_token_cache.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/supabase_client.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/templates/response_template.en.json` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/templates/response_template.ja.json` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/ai_inference/today_question_store.py` | backend support | include: backend runtime/contract structure |
| `mashos-api/ai/services/analysis_engine/__init__.py` | analysis engine | include: analysis engine structure |
| `mashos-api/ai/services/analysis_engine/baseline.py` | analysis engine | include: analysis engine structure |
| `mashos-api/ai/services/analysis_engine/emotion_structure_engine/daily.py` | analysis engine | include: analysis engine structure |
| `mashos-api/ai/services/analysis_engine/emotion_structure_engine/monthly.py` | analysis engine | include: analysis engine structure |
| `mashos-api/ai/services/analysis_engine/emotion_structure_engine/weekly.py` | analysis engine | include: analysis engine structure |
| `mashos-api/ai/services/analysis_engine/models.py` | analysis engine | include: analysis engine structure |
| `mashos-api/ai/services/analysis_engine/self_structure_engine/builders.py` | analysis engine | include: analysis engine structure |
| `mashos-api/ai/services/analysis_engine/self_structure_engine/fusion.py` | analysis engine | include: analysis engine structure |
| `mashos-api/ai/services/analysis_engine/self_structure_engine/rules.py` | analysis engine | include: analysis engine structure |
| `mashos-api/ai/services/analysis_engine/self_structure_engine/signal_extraction.py` | analysis engine | include: analysis engine structure |
| `mashos-api/ai/services/analysis_engine/templates/README.md` | analysis engine | include: analysis engine structure |
| `mashos-api/ai/services/examples/demo.py` | backend support | listed: support/sample outside runtime structure |
| `mashos-api/ai/services/structure_engine/extract.py` | backend support | listed: support/sample outside runtime structure |
| `mashos-api/ai/services/structure_engine/templates/summary.txt` | backend support | listed: support/sample outside runtime structure |
| `mashos-api/ai/tests/contract/conftest.py` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/fixtures/account_display_name_availability_response_shape_v1.json` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/fixtures/account_profile_me_response_shape_v1.json` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/fixtures/app_bootstrap_request_client_meta_v1.json` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/fixtures/app_bootstrap_response_shape_v1.json` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/fixtures/app_startup_response_shape_v1.json` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/fixtures/global_summary_response_shape_v1.json` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/fixtures/home_state_response_shape_v1.json` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/fixtures/legacy_emotion_submit_request_v1.json` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/fixtures/legacy_emotion_submit_response_shape_v1.json` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/fixtures/legacy_mymodel_create_answers_request_v1.json` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/fixtures/mymodel_create_answers_response_shape_v1.json` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/fixtures/mymodel_create_questions_response_shape_v1.json` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/fixtures/myprofile_latest_status_response_shape_v1.json` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/fixtures/myprofile_reports_history_response_shape_v1.json` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/fixtures/report_distribution_settings_response_shape_v1.json` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/fixtures/report_reads_myweb_unread_status_response_shape_v1.json` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/fixtures/subscription_bootstrap_response_shape_v1.json` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/test_api_contract_headers.py` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/test_api_contract_registry.py` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/test_emlis_ai_contracts.py` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/test_generated_reflection_display_contracts.py` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/test_generated_reflection_maintenance_contracts.py` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/test_mymodel_reflection_display_contracts.py` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/test_myprofile_latest_regression.py` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/test_notice_contracts.py` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/test_publish_governance.py` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/test_rn_surface_guards.py` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/contract/test_subscription_bootstrap_contracts.py` | contract test/fixture | include: contract/test structure |
| `mashos-api/ai/tests/smoke_test.py` | backend support | include: contract/test structure |
| `mashos-api/ai/tests/test_emlis_ai_greeting_state_store.py` | backend support | include: contract/test structure |
| `mashos-api/ai/tests/test_emlis_ai_observation_kernel.py` | backend support | include: contract/test structure |
| `mashos-api/ai/tests/test_emlis_ai_user_model_store.py` | backend support | include: contract/test structure |
| `mashos-api/ai/tools/Makefile` | support/sample/training | include: maintenance/tooling support |
| `mashos-api/ai/tools/check_tag_consistency.py` | support/sample/training | include: maintenance/tooling support |
| `mashos-api/ai/tools/data/raw/import_template.csv` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/tools/data/train/{{AI_NAME}}_interpret_train.jsonl` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/tools/docs/data_ingest_guide.txt` | docs/policy/SQL | include: maintenance/tooling support |
| `mashos-api/ai/tools/import_csv_to_logs.py` | support/sample/training | include: maintenance/tooling support |
| `mashos-api/ai/tools/import_json_to_logs.py` | support/sample/training | include: maintenance/tooling support |
| `mashos-api/ai/tools/import_logs.py` | support/sample/training | include: maintenance/tooling support |
| `mashos-api/ai/tools/import_mapping.yaml` | support/sample/training | include: maintenance/tooling support |
| `mashos-api/ai/tools/rename_ai_name.py` | support/sample/training | include: maintenance/tooling support |
| `mashos-api/ai/tools/tools/import_logs.py` | support/sample/training | include: maintenance/tooling support |
| `mashos-api/ai/tools/tools/import_mapping.yaml` | support/sample/training | include: maintenance/tooling support |
| `mashos-api/ai/tools/tools/validate_logs.py` | support/sample/training | include: maintenance/tooling support |
| `mashos-api/ai/tools/training/README.md` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/tools/training/requirements.txt` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/tools/training/train_lora.py` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/tools/training/trainset_skeleton.py` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/tools/validate_logs.py` | support/sample/training | include: maintenance/tooling support |
| `mashos-api/ai/training/README.md` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/training/build_dataset.py` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/training/eval.py` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/training/requirements.txt` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/ai/training/train_lora.py` | support/sample/training | listed: support/sample outside runtime structure |
| `mashos-api/scripts/backfill_generated_reflection_display_cleanup.py` | script/operation guard | include: operational script structure |
| `mashos-api/scripts/check_no_direct_supabase.py` | script/operation guard | include: operational script structure |
| `mashos-api/scripts/mashos_cron_runner.py` | script/operation guard | include: operational script structure |


# 2026-04-27 差分追記: latest full coverage / public contract registry cleanup

## coverage 再確認

- 基準面: `Cocolon_5(12).zip` / `mashos-api_5(6).zip`
- latest file count: `Cocolon=116` / `mashos-api=292` / `total=408`
- この `01` 系本文には、Cocolon 構造に関係する latest 408 files を全件記載している
- Cocolon source file の追加/削除/内容差分: `0件`
- mashos-api source file の追加/削除: `0件`
- mashos-api source file の内容差分: `5件`

## 今回の構造差分対象 files

| file | 構造上の差分 |
|---|---|
| `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md` | current public route の未登録分を追加し、legacy `/friends/*` alias の一部を deprecated + replacement として整理した |
| `mashos-api/ai/services/ai_inference/api_contract_registry.py` | runtime contract registry に current route を追加し、legacy `/friends/*` alias の replacement を固定した |
| `mashos-api/ai/services/ai_inference/api_emotion_log.py` | `/emotion-log/feed` に `response_model=Dict[str, Any]` を付与し、contract registry guard 対象にできる境界を明示した |
| `mashos-api/ai/services/ai_inference/api_nexus.py` | `/nexus/emotion-ranking` / `/nexus/emotion-log` に `response_model=Any` を付与し、contract registry guard 対象にできる境界を明示した |
| `mashos-api/ai/tests/contract/test_api_contract_registry.py` | current route 必須一覧を拡張し、legacy friends alias が deprecated + replacement を持つことを検証する guard を追加した |

## 削除しないもの

この差分は public contract registry / header境界の整理であり、route handler / DB object / RN file の削除ではありません。旧名称APIファイル削除、legacy route retirement、DB physical rename/drop はまだ別工程です。
