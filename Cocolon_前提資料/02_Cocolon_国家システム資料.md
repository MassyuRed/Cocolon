---
doc_id: cocolon_national_system_full_coverage
title: "Cocolon 国家システム資料"
revision_date: "2026-04-27"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 116
  mashos-api: 292
purpose: "華恋が国家システムに関係する全ファイルを Input -> Save -> Dispatch -> Snapshot -> Worker -> Publish -> Read -> RN の流れで復元できるようにする"
coverage:
  included_files_total: 408
  included_files_cocolon: 116
  included_files_mashos_api: 292
---

# 1. 1行定義

ここでいう国家システムは、**入力保存 API 群 + dispatch / gateway + material snapshot + queue + worker + publish / access policy + startup snapshot + read-side API + RN surface** をまとめた運用全体です。  
backend だけで終わらず、**RN surface まで含めて state の流れを固定する**ものとして扱います。

# 2. 現在の国家システム flow

`Input Gate` → `Save API` → `Dispatch` → `Snapshot / Queue / Worker` → `Publish / Access Policy` → `Read API / Startup` → `RN display`

補足:
- `home_gateway` は Home 由来 write の fan-out 集約点
- `startup_snapshot_store` は startup 断面
- `access_policy` は read-side visibility / tier 判定の集約点
- `EmlisAI` は保存直後 immediate reply path を持つ
- 2026-04-22 反映で、三大要素の中核 owner は comment / analysis / piece ごとに 1 本流へ固定した

# 3. 章と対象件数

2026-04-22 版の詳細ブロックは保持する。2026-04-25 時点の国家システム coverage は後続の `2026-04-25 差分追記: national system coverage` を正本とする。

- latest full coverage listed in body: `408 files`
  - Cocolon: `116`
  - mashos-api: `292`

# 4. 読み方

- `02A` で **入力・保存・dispatch** を追う
- `02B` で **snapshot / worker / publish / read / RN** を追う
- `02C` で **contract / boundary / test / guard** を追う

# 5. current drift / 注意点

- frontend 文字列に現れる endpoint のうち、backend route 側に直接見えないものは drift 候補として 07 に別記する
- ProfileCreate は current public 名だが、canonical table 名には `mymodel_create_*` が残る
- 旧 compat import path はまだ live なものがあるため、消したい時は呼び元を全部確認する

# 2026-04-25 差分追記: national system coverage

この章は、旧本文を破壊せず、国家システムに関係する全ファイルを本文へ追記するための coverage 補正です。`listed: non-national/support/sample` は state flow の正本ではありませんが、除外判断を本文内で見えるように記載します。

- 基準zip: `Cocolon(108).zip` / `mashos-api(30).zip`
- latest file count: `Cocolon=116` / `mashos-api=292` / `total=408`
- 既存の詳細ブロックは 2026-04-22 版の本文を保持しています。2026-04-25 時点の正本 coverage は、この差分追記ブロックで補正します。

| file | role | 2026-04-25 classification |
| --- | --- | --- |
| `Cocolon/.env.subscription.public.example` | RN app/support | include: RN national-system surface/boundary |
| `Cocolon/App.js` | RN app/support | include: RN national-system surface/boundary |
| `Cocolon/AuthContext.js` | RN app/support | include: RN national-system surface/boundary |
| `Cocolon/AuthScreen.js` | RN app/support | listed: RN app support |
| `Cocolon/REMOVE_RETIRED_COMPAT_FILES.txt` | RN app/support | listed: RN app support |
| `Cocolon/SUBSCRIPTION_RELEASE_PHASE3.md` | RN app/support | include: RN national-system surface/boundary |
| `Cocolon/SUBSCRIPTION_RELEASE_PHASE4.md` | RN app/support | include: RN national-system surface/boundary |
| `Cocolon/SubscriptionContext.js` | RN app/support | include: RN national-system surface/boundary |
| `Cocolon/TutorialContext.js` | RN app/support | include: RN national-system surface/boundary |
| `Cocolon/TutorialOverlay.js` | RN app/support | listed: RN app support |
| `Cocolon/UnreadContext.js` | RN app/support | include: RN national-system surface/boundary |
| `Cocolon/components/CocolonBackButton.js` | RN component/shared UI | include: RN shared UI/support for national surfaces |
| `Cocolon/components/CocolonButton.js` | RN component/shared UI | include: RN shared UI/support for national surfaces |
| `Cocolon/components/CocolonPressable.js` | RN component/shared UI | include: RN shared UI/support for national surfaces |
| `Cocolon/components/CocolonSwitch.js` | RN component/shared UI | include: RN shared UI/support for national surfaces |
| `Cocolon/components/Collapsible.tsx` | RN component/shared UI | include: RN shared UI/support for national surfaces |
| `Cocolon/components/EmotionPiecePreviewModal.js` | RN component/shared UI | include: RN national-system surface/boundary |
| `Cocolon/components/ExternalLink.tsx` | RN component/shared UI | include: RN shared UI/support for national surfaces |
| `Cocolon/components/GuideRichText.js` | RN component/shared UI | include: RN national-system surface/boundary |
| `Cocolon/components/GuideTermModal.js` | RN component/shared UI | include: RN national-system surface/boundary |
| `Cocolon/components/HapticTab.tsx` | RN component/shared UI | include: RN shared UI/support for national surfaces |
| `Cocolon/components/HelloWave.tsx` | RN component/shared UI | include: RN shared UI/support for national surfaces |
| `Cocolon/components/NoticeModal.js` | RN component/shared UI | include: RN national-system surface/boundary |
| `Cocolon/components/NoticeRichText.js` | RN component/shared UI | include: RN national-system surface/boundary |
| `Cocolon/components/ParallaxScrollView.tsx` | RN component/shared UI | include: RN shared UI/support for national surfaces |
| `Cocolon/components/ThemedText.tsx` | RN component/shared UI | include: RN shared UI/support for national surfaces |
| `Cocolon/components/ThemedView.tsx` | RN component/shared UI | include: RN shared UI/support for national surfaces |
| `Cocolon/components/TodayQuestionCard.js` | RN component/shared UI | include: RN national-system surface/boundary |
| `Cocolon/components/TodayQuestionModal.js` | RN component/shared UI | include: RN national-system surface/boundary |
| `Cocolon/components/TutorialOverlay.js` | RN component/shared UI | include: RN shared UI/support for national surfaces |
| `Cocolon/components/TutorialStartModal.js` | RN component/shared UI | include: RN shared UI/support for national surfaces |
| `Cocolon/components/UnreadBadge.js` | RN component/shared UI | include: RN national-system surface/boundary |
| `Cocolon/components/selfStructure/SelfStructureDeepRenderer.js` | RN component/shared UI | include: RN national-system surface/boundary |
| `Cocolon/components/ui/IconSymbol.ios.tsx` | RN component/shared UI | include: RN shared UI/support for national surfaces |
| `Cocolon/components/ui/IconSymbol.tsx` | RN component/shared UI | include: RN shared UI/support for national surfaces |
| `Cocolon/components/ui/TabBarBackground.ios.tsx` | RN component/shared UI | include: RN shared UI/support for national surfaces |
| `Cocolon/components/ui/TabBarBackground.tsx` | RN component/shared UI | include: RN shared UI/support for national surfaces |
| `Cocolon/features/home/useHomeActions.js` | Home hook/state boundary | include: RN national-system surface/boundary |
| `Cocolon/features/home/useHomeState.js` | Home hook/state boundary | include: RN national-system surface/boundary |
| `Cocolon/guide/guidesJa.js` | RN app/support | include: RN national-system surface/boundary |
| `Cocolon/guide/termsJa.js` | RN app/support | include: RN national-system surface/boundary |
| `Cocolon/index.js` | RN app/support | listed: RN app support |
| `Cocolon/lib/accountLocalCleanup.js` | RN app/support | include: RN national-system surface/boundary |
| `Cocolon/lib/api/account/profileApi.js` | frontend API boundary | include: RN national-system surface/boundary |
| `Cocolon/lib/api/client.js` | frontend API boundary | include: RN national-system surface/boundary |
| `Cocolon/lib/api/home/emotionPieceApi.js` | frontend API boundary | include: RN national-system surface/boundary |
| `Cocolon/lib/api/home/emotionSubmitApi.js` | frontend API boundary | include: RN national-system surface/boundary |
| `Cocolon/lib/api/home/homeStateApi.js` | frontend API boundary | include: RN national-system surface/boundary |
| `Cocolon/lib/api/home/noticeApi.js` | frontend API boundary | include: RN national-system surface/boundary |
| `Cocolon/lib/api/home/todayQuestionApi.js` | frontend API boundary | include: RN national-system surface/boundary |
| `Cocolon/lib/apiClient.js` | frontend API boundary | include: RN national-system surface/boundary |
| `Cocolon/lib/compat/legacyWireContracts.js` | frontend legacy wire compatibility | include: RN national-system surface/boundary |
| `Cocolon/lib/emotionPieceApi.js` | frontend API boundary | include: RN national-system surface/boundary |
| `Cocolon/lib/historyRetentionLabel.js` | RN app/support | listed: RN app support |
| `Cocolon/lib/iap/iapConfig.js` | RN app/support | listed: RN app support |
| `Cocolon/lib/iap/iapRuntimeCatalog.js` | RN app/support | listed: RN app support |
| `Cocolon/lib/iap/iapService.js` | RN app/support | listed: RN app support |
| `Cocolon/lib/iap/index.js` | RN app/support | listed: RN app support |
| `Cocolon/lib/inputDraftStorage.js` | RN app/support | include: RN national-system surface/boundary |
| `Cocolon/lib/nexusApi.js` | frontend API boundary | include: RN national-system surface/boundary |
| `Cocolon/lib/noticeActionRuntime.js` | RN app/support | include: RN national-system surface/boundary |
| `Cocolon/lib/noticeApi.js` | frontend API boundary | include: RN national-system surface/boundary |
| `Cocolon/lib/pushToken.js` | RN app/support | include: RN national-system surface/boundary |
| `Cocolon/lib/reportDistributionApi.js` | frontend API boundary | include: RN national-system surface/boundary |
| `Cocolon/lib/subscriptionApi.js` | frontend API boundary | include: RN national-system surface/boundary |
| `Cocolon/lib/supabase.ts` | RN app/support | include: RN national-system surface/boundary |
| `Cocolon/lib/todayQuestionApi.js` | frontend API boundary | include: RN national-system surface/boundary |
| `Cocolon/lib/user.ts` | RN app/support | include: RN national-system surface/boundary |
| `Cocolon/screens/AccountScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/AnalysisContentFirstScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/AnalysisCrossLinkSection.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/AnalysisEmotionScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/AnalysisEnsureClient.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/AnalysisHistoryScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/AnalysisInputHistoryMenuScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/AnalysisMenuCommon.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/AnalysisReportHistoryScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/AnalysisReportScheduleUtils.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/AnalysisReportViewerScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/AnalysisScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/AnalysisSelfStructureScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/AnalysisTopScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/CocolonGuideScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/EmotionLogScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/EmotionRankingScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/FollowListScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/InputCountRankingScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/InputLengthRankingScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/InputScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/LoginStreakRankingScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/MenuActionCardCommon.js` | RN screen/surface | listed: RN app support |
| `Cocolon/screens/NexusScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/NoticeHistoryScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/PieceEntryScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/PieceHistoryMenuScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/PieceLibraryScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/PieceMenuCommon.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/PieceResonanceRankingScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/PieceScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/ProfileCreateScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/RankingTopScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/ResonanceHistoryDetailScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/ResonanceHistoryListScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/SelfStructureReportGenerateScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/SelfStructureReportHistoryScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/SelfStructureReportViewerScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/SettingsAppSettingsScreen.js` | RN screen/surface | listed: RN app support |
| `Cocolon/screens/SettingsOtherScreen.js` | RN screen/surface | listed: RN app support |
| `Cocolon/screens/SettingsScreen.js` | RN screen/surface | listed: RN app support |
| `Cocolon/screens/SubscriptionSelectScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/TodayQuestionHistoryScreen.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/nexus/NexusEmotionRankingCard.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/screens/nexus/NexusPieceCard.js` | RN screen/surface | include: RN national-system surface/boundary |
| `Cocolon/theme/ThemeContext.js` | RN app/support | include: RN national-system surface/boundary |
| `Cocolon/ui/applyTypographyTokens.js` | RN app/support | include: RN shared UI/support for national surfaces |
| `Cocolon/ui/uiTokens.js` | RN app/support | include: RN shared UI/support for national surfaces |
| `mashos-api/ai/.env` | backend support | include: runtime/config support |
| `mashos-api/ai/Makefile` | backend support | include: runtime/config support |
| `mashos-api/ai/POST_MIGRATION_CHECKLIST.md` | backend support | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/README_MIGRATION_QUICKSTART.md` | backend support | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/configs/app_ids.yaml` | backend support | include: runtime/config support |
| `mashos-api/ai/configs/model_train.yaml` | backend support | include: runtime/config support |
| `mashos-api/ai/configs/runtime.yaml` | backend support | include: runtime/config support |
| `mashos-api/ai/data/config/astor_structure_dict.json` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/data/processed/features.json` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/data/processed/structure_dictionary.json` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/data/processed/summary.txt` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/data/raw/README_ingest.txt` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/data/raw/import_template.csv` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/data/raw/logs.jsonl` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/data/raw/schema.json` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/data/raw/template.csv` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/data/raw/template.json` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/data/train/{{AI_NAME}}_interpret_train.jsonl` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/docs/API_CONTRACT_POLICY.md` | docs/policy/SQL | include: policy/contract/documentation support |
| `mashos-api/ai/docs/COCOLON_STRUCTURE_UNIFICATION_ADDENDUM_2026_04_21.md` | docs/policy/SQL | include: policy/contract/documentation support |
| `mashos-api/ai/docs/NATIONAL_ALIGNMENT_AUDIT_PHASE5.md` | docs/policy/SQL | include: policy/contract/documentation support |
| `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md` | docs/policy/SQL | include: policy/contract/documentation support |
| `mashos-api/ai/docs/TUTORIAL_STABILITY_REDESIGN.md` | docs/policy/SQL | include: policy/contract/documentation support |
| `mashos-api/ai/docs/api_contract.txt` | docs/policy/SQL | include: policy/contract/documentation support |
| `mashos-api/ai/docs/data_ingest_guide.txt` | docs/policy/SQL | include: policy/contract/documentation support |
| `mashos-api/ai/docs/emlis_ai_user_models.sql` | docs/policy/SQL | include: policy/contract/documentation support |
| `mashos-api/ai/docs/iap_subscription_update.md` | docs/policy/SQL | include: policy/contract/documentation support |
| `mashos-api/ai/docs/{{AI_NAME}}_spec.txt` | docs/policy/SQL | include: policy/contract/documentation support |
| `mashos-api/ai/ingestion/mapping_sample.yaml` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/ingestion/user_logs_sample.csv` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/services/ai_inference/.env.subscription.backend.example` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/_samples/lora_load_example.py` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/access_policy/__init__.py` | access policy | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py` | access policy | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/access_policy/report_access_policy.py` | access policy | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/access_policy/subscription_context.py` | access policy | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py` | access policy | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/account_delete_service.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/active_users_store.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/analysis_engine_adapter.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/analysis_report_schema.json` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/analysis_summary_reader.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_account_lifecycle.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_account_status.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_account_visibility.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_activity_login.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_analysis_compat.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_analysis_reads.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_analysis_reports.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_app_bootstrap.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_connect.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_contract_registry.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_cron_distribution.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_emotion_history_manage.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_emotion_history_search.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_emotion_log.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_emotion_notification_settings.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_emotion_piece.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_emotion_secret.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_emotion_submit.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_follow.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_follow_graph.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_friends.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_global_summary.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_home_state.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_input_summary.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_myprofile.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_myweb_reads.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_myweb_reports.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_nexus.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_nexus_compat.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_notice.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_piece_compat.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_piece_runtime.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_profile_create.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_public_profile.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_ranking.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_ranking_mymodel_resonances.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_ranking_mymodel_views.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_ranking_piece_resonances.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_ranking_piece_views.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_relationship_compat.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_report_reads.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_retired_legacy_compat.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_self_structure.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_self_structure_reports.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_subscription.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/api_today_question.py` | backend public API owner/compat | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/app.py` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_account_status_kernel.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_account_status_store.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_analysis_insight.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_core.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_emotion_log_feed_enqueue.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_emotion_log_feed_kernel.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_emotion_log_feed_store.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_friend_feed_enqueue.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_friend_feed_kernel.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_friend_feed_store.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_global_summary_kernel.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_global_summary_store.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_job_queue.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_material_snapshots.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_myprofile_persona.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_myweb_insight.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_patterns.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_ranking_boards.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_ranking_kernel.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_reflection_engine.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_reflection_store.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_self_structure_persona.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_self_structure_report.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_structure_matcher.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/astor_worker.py` | ASTOR worker/queue/store | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/client_compat.py` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/cron_run_store.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/emlis_ai_capability.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_kernel.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/emlis_ai_prompt.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/emlis_ai_readers.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/emlis_ai_style_profile_service.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/emlis_ai_types.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/emlis_ai_world_model_service.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/emotion_history_search_service.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/emotion_piece_generation_service.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/emotion_piece_store.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/emotion_reflection_generation_service.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/emotion_reflection_store.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/emotion_submit_service.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/generated_reflection_display.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/generated_reflection_identity.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/generation_lock.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/guards/date_guard.py` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/home_gateway/__init__.py` | Home gateway | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/home_gateway/cache_invalidator.py` | Home gateway | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py` | Home gateway | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/home_gateway/command_types.py` | Home gateway | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/home_gateway/dispatch_planner.py` | Home gateway | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py` | Home gateway | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/home_gateway/emotion_submit_service.py` | Home gateway | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/home_gateway/notice_command_service.py` | Home gateway | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py` | Home gateway | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/home_gateway/today_question_command_service.py` | Home gateway | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/input_feedback_text_templates.py` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/input_summary_reader.py` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/mashlogic_profile_enhancer.py` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/mashlogic_qa_enhancer.py` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/middleware_active_user_touch.py` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/middleware_api_contract.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/middleware_request_perf.py` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/mymodel_entitlements.py` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/myprofile_section_text_templates.py` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/myweb_report_schema.json` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/notice_store.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/observability.py` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/persona_engine.py` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/piece_generated_access.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/piece_generated_display.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/piece_generated_identity.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/piece_generated_maintenance.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/piece_generated_metrics.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/piece_generated_reflection_access.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/piece_generation_engine.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/piece_generation_store.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/piece_public_read_service.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/piece_public_read_store.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/piece_publish_entitlements.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/piece_text_formatter.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/profile_create_entitlements.py` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/prompt_templates.py` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/prompts/interpret.en.txt` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/prompts/interpret.ja.txt` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/publish_governance.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/reflection_publish_entitlements.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/reflection_text_formatter.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/report_artifact_read_service.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/report_distribution_push_store.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/report_distribution_settings_store.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/report_text_templates.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/request_metrics.py` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/requirements.txt` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/response_microcache.py` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/route_compat_delegate.py` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/self_structure_section_text_templates.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/structure_dict.py` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/subscription.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/subscription_config.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/subscription_live_console_check.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/subscription_projection.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/subscription_release_config.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/subscription_runtime_config.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/subscription_store.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/subscription_trial_store.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/subscription_verifier_android.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/subscription_verifier_ios.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/subscription_webhooks.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/supabase_auth_token_cache.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/supabase_client.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/ai_inference/templates/response_template.en.json` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/templates/response_template.ja.json` | backend support | include: backend shared runtime support |
| `mashos-api/ai/services/ai_inference/today_question_store.py` | backend support | include: backend national-system runtime/boundary |
| `mashos-api/ai/services/analysis_engine/__init__.py` | analysis engine | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/services/analysis_engine/baseline.py` | analysis engine | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/services/analysis_engine/emotion_structure_engine/daily.py` | analysis engine | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/services/analysis_engine/emotion_structure_engine/monthly.py` | analysis engine | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/services/analysis_engine/emotion_structure_engine/weekly.py` | analysis engine | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/services/analysis_engine/models.py` | analysis engine | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/services/analysis_engine/self_structure_engine/builders.py` | analysis engine | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/services/analysis_engine/self_structure_engine/fusion.py` | analysis engine | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/services/analysis_engine/self_structure_engine/rules.py` | analysis engine | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/services/analysis_engine/self_structure_engine/signal_extraction.py` | analysis engine | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/services/analysis_engine/templates/README.md` | analysis engine | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/services/examples/demo.py` | backend support | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/services/structure_engine/extract.py` | backend support | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/services/structure_engine/templates/summary.txt` | backend support | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/tests/contract/conftest.py` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/fixtures/account_display_name_availability_response_shape_v1.json` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/fixtures/account_profile_me_response_shape_v1.json` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/fixtures/app_bootstrap_request_client_meta_v1.json` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/fixtures/app_bootstrap_response_shape_v1.json` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/fixtures/app_startup_response_shape_v1.json` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/fixtures/global_summary_response_shape_v1.json` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/fixtures/home_state_response_shape_v1.json` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/fixtures/legacy_emotion_submit_request_v1.json` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/fixtures/legacy_emotion_submit_response_shape_v1.json` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/fixtures/legacy_mymodel_create_answers_request_v1.json` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/fixtures/mymodel_create_answers_response_shape_v1.json` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/fixtures/mymodel_create_questions_response_shape_v1.json` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/fixtures/myprofile_latest_status_response_shape_v1.json` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/fixtures/myprofile_reports_history_response_shape_v1.json` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/fixtures/report_distribution_settings_response_shape_v1.json` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/fixtures/report_reads_myweb_unread_status_response_shape_v1.json` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/fixtures/subscription_bootstrap_response_shape_v1.json` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/test_api_contract_headers.py` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/test_api_contract_registry.py` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/test_emlis_ai_contracts.py` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/test_generated_reflection_display_contracts.py` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/test_generated_reflection_maintenance_contracts.py` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/test_mymodel_reflection_display_contracts.py` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/test_myprofile_latest_regression.py` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/test_notice_contracts.py` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/test_publish_governance.py` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/test_rn_surface_guards.py` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/contract/test_subscription_bootstrap_contracts.py` | contract test/fixture | include: national contract/test guard |
| `mashos-api/ai/tests/smoke_test.py` | backend support | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/tests/test_emlis_ai_greeting_state_store.py` | backend support | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/tests/test_emlis_ai_observation_kernel.py` | backend support | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/tests/test_emlis_ai_user_model_store.py` | backend support | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/tools/Makefile` | support/sample/training | include: runtime/config support |
| `mashos-api/ai/tools/check_tag_consistency.py` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/tools/data/raw/import_template.csv` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/tools/data/train/{{AI_NAME}}_interpret_train.jsonl` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/tools/docs/data_ingest_guide.txt` | docs/policy/SQL | include: policy/contract/documentation support |
| `mashos-api/ai/tools/import_csv_to_logs.py` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/tools/import_json_to_logs.py` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/tools/import_logs.py` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/tools/import_mapping.yaml` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/tools/rename_ai_name.py` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/tools/tools/import_logs.py` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/tools/tools/import_mapping.yaml` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/tools/tools/validate_logs.py` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/tools/training/README.md` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/tools/training/requirements.txt` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/tools/training/train_lora.py` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/tools/training/trainset_skeleton.py` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/tools/validate_logs.py` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/training/README.md` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/training/build_dataset.py` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/training/eval.py` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/training/requirements.txt` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/ai/training/train_lora.py` | support/sample/training | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/scripts/backfill_generated_reflection_display_cleanup.py` | script/operation guard | listed: non-national/support/sample; not a current state-flow owner |
| `mashos-api/scripts/check_no_direct_supabase.py` | script/operation guard | include: operational/national guard script |
| `mashos-api/scripts/mashos_cron_runner.py` | script/operation guard | include: operational/national guard script |


# 2026-04-26 差分追記: latest national-system coverage 検証

`Cocolon(108).zip` / `mashos-api(30).zip` の file path 集合を `02` 系本文と照合した結果、国家システム判断対象の current 全ファイルは引き続き本文内に記載済みです。

- Cocolon: `116/116`
- mashos-api: `292/292`
- total: `408/408`
- `02A` / `02B` / `02C` の本文記載欠落: `0`

国家システム直接対象外の support / sample / training 系も、除外判断が見えるよう `02` 本文内に分類付きで記載済みです。今回の差分では国家システムの DB read boundary が変わり、read-only path は current bridge view、write path は旧物理 table を維持します。

## 2026-04-26 国家システム DB read/write 境界

| area | read-only current view | write/update/delete/upsert old physical |
|---|---|---|
| ProfileCreate questions | `profile_create_questions` | n/a |
| ProfileCreate answers | `profile_create_answers` | `mymodel_create_answers` |
| Piece metrics/read-state | `piece_metrics`, `piece_reads` | `mymodel_qna_metrics`, `mymodel_qna_reads` |
| Emotion notification settings | `emotion_notification_settings` | `friend_notification_settings` |
| Analysis reports | `analysis_reports` | `myweb_reports` |
| Self Structure reports | `self_structure_reports` | `myprofile_reports` |
| EmotionLog feed | `emotion_log_feed` | `friend_emotion_feed` |
| EmotionLog feed summaries | `emotion_log_feed_summaries` | `friend_feed_summaries` |
| Piece library | `pieces` | `mymodel_reflections` |



# 2026-04-27 差分追記: latest national-system coverage / smoke結果

## coverage 再確認

- 基準面: `Cocolon_5(12).zip` / `mashos-api_5(6).zip`
- latest file count: `Cocolon=116` / `mashos-api=292` / `total=408`
- この `02` 系本文には、国家システムに関係する latest 408 files を全件記載している
- 国家システム直接対象外の support/sample/training 系も、除外判断が見えるよう本文内に分類付きで残している

## 今回の国家システム差分

今回の差分は Contract / Boundary / Test の整理です。DB、RN source、route handler deletion は対象外です。

- Contract: `PUBLIC_API_REGISTRY.md` / `api_contract_registry.py` に current route 欠落分を追加
- Boundary: `/emotion-log/feed`, `/nexus/emotion-log`, `/nexus/emotion-ranking` に response_model metadata を付け、public contract guard に接続できるようにした
- Test: `test_api_contract_registry.py` に current route 必須一覧と friends alias deprecated replacement guard を追加
- Runtime smoke: endpoint write smoke は `status=pass`, `hard_502_count=0`, `non_2xx_count=0`
- Deferred: Piece write smoke は対象 Piece が存在しないため今回対象外。Piece が1件以上公開・閲覧可能になった時点で再確認する
