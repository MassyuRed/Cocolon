---
doc_id: cocolon_national_system_full_coverage
title: "Cocolon 国家システム資料"
revision_date: "2026-05-11"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 200
  mashos-api: 414
purpose: "華恋が国家システムに関係する全ファイルを Input -> Save -> Dispatch -> Snapshot -> Worker -> Publish -> Read -> RN の流れで復元できるようにする"
coverage:
  included_files_total: 614
  included_files_cocolon: 200
  included_files_mashos_api: 414
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

# 2-2. 2026-04-30 `/app/bootstrap` runtime flow

最新アプリでは、`/app/bootstrap` は `AppRuntimeContext.js` が取得し、`App.js` がruntime gateとして使います。  
これは国家システム上、`Read API / Startup -> RN display` の入口に置く構造です。

`api_app_bootstrap.py` → `Cocolon/lib/apiClient.js` → `Cocolon/AppRuntimeContext.js` → `Cocolon/App.js` → 各screen / hook

| flag / version | RN側の消費先 | 国家システム上の意味 |
|---|---|---|
| `minimum_supported_version` | `App.js` | 古いbuildを通常画面へ進ませない |
| `recommended_version` | `App.js` | 非強制の更新案内を出す |
| `maintenance_message` | `App.js` | 起動時のお知らせを出す |
| `account_delete_enabled` | `SettingsOtherScreen.js` | 退会API実行を機能単位で止める |
| `today_question_enabled` | `features/home/useHomeState.js` | Home上のToday Question表示を止める |
| `today_question_history_enabled` | `TodayQuestionHistoryScreen.js` | 履歴API呼び出しを止める |
| `subscription_sales_enabled` | `SubscriptionSelectScreen.js` | 新規購入導線だけを止める |

# 3. 章と対象件数

2026-04-22 版の詳細ブロックは保持する。2026-04-25 時点の国家システム coverage は後続の `2026-04-25 差分追記: national system coverage` を正本とする。

- latest full coverage listed in body: `614 files`
  - Cocolon: `200`
  - mashos-api: `414`

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

# 2026-04-28 差分追記: 新国家システム / worker・FCM・負荷試験 coverage override

## coverage 再確認

今回の基準面は `Cocolon_2(27).zip` / `mashos-api_5(7).zip` です。

- latest national-system coverage listed in body: `422 files`
  - Cocolon: `116`
  - mashos-api: `329`
- 旧本文の 408 files coverage は履歴として保持する
- この追記により、国家システムに関係する latest 422 files は `02` 本文内で全件追跡できる
- latest zip に存在しない旧本文 path: `0件`
- latest zip に対する 02 本文欠落は、下記14件を追記することで `0件`

## 三大中核構造の現行定義

国家システム上の **三大中核構造** は、以下の3つです。

1. `EmlisAI構造`
2. `分析構造`
3. `Piece構造`

`EmlisAI構造` は入力保存直後の即時理解応答、`分析構造` は蓄積入力から本人向け観測成果物を作る構造、`Piece構造` は感情入力から公開可能なPieceをpreview / confirm / publishする構造です。

## 追加された国家システム対象 files

| file | 国家システム区分 | 国家システム上の役割 | 同時確認 |
|---|---|---|---|
| `mashos-api/ai/services/ai_inference/core_contract_registry.py` | Contract / Dispatch | 三大中核構造のinput/output/storage/gate/read surfaceを固定する内部registry | `api_contract_registry.py`, `PUBLIC_API_REGISTRY.md` |
| `mashos-api/ai/services/ai_inference/emlis_ai_quality_gate.py` | Gate | EmlisAI即時応答の履歴利用・証拠・診断/断定抑制を判定する | `emlis_ai_reply_service.py`, `emotion_submit_service.py` |
| `mashos-api/ai/services/ai_inference/analysis_capability.py` | Gate | 分析構造のplan差分をcapability profileとして固定する | `api_analysis_reports.py`, `api_self_structure.py` |
| `mashos-api/ai/services/ai_inference/analysis_report_validity_gate.py` | Gate | 分析成果物の材料充分性・domain分離・診断/overclaim・表示妥当性を判定する | `api_analysis_reports.py`, `astor_self_structure_report.py` |
| `mashos-api/ai/services/ai_inference/piece_generation_policy.py` | Gate / Publish | Piece preview前の公開安全化、status、hash、safety metaを固定する | `api_emotion_piece.py`, `emotion_piece_generation_service.py`, `emotion_piece_store.py` |
| `mashos-api/ai/services/ai_inference/fcm_push_queue.py` | Queue / Worker | FCM送信を `send_fcm_push_v1` jobに分離する | `api_emotion_submit.py`, `api_follow.py`, `api_today_question.py`, `api_cron_distribution.py`, `astor_worker.py` |
| `mashos-api/ai/services/ai_inference/.env.worker.example` | Worker / Config | 高負荷時のAPI/worker分離・FCM queue・stale復旧env例 | `WORKER_OPERATIONS.md`, `astor_worker.py` |
| `mashos-api/ai/docs/WORKER_OPERATIONS.md` | Operation | worker profile、queue stats、増設判断、stale復旧を固定する | `astor_worker.py`, `astor_worker_status.py` |
| `mashos-api/ai/docs/LOAD_TESTING.md` | Verification | endpoint別負荷試験、p95/p99、queue滞留確認手順を固定する | `cocolon_load_test.py`, `astor_worker_status.py` |
| `mashos-api/scripts/astor_worker_status.py` | Operation script | queue stats表示、stale running job復旧、pressure判定 | `astor_job_queue.py` |
| `mashos-api/scripts/cocolon_load_test.py` | Verification script | app-bootstrap/startup/home/emotion-submit/piece-preview/mix負荷試験 | `LOAD_TESTING.md` |
| `mashos-api/ai/tests/contract/test_new_national_core_analysis_contracts.py` | Contract test | 分析構造capability / validity gateの不変条件を守る | `analysis_capability.py`, `analysis_report_validity_gate.py` |
| `mashos-api/ai/tests/contract/test_new_national_core_emlis_contracts.py` | Contract test | EmlisAI構造capability / quality gateの不変条件を守る | `emlis_ai_capability.py`, `emlis_ai_quality_gate.py` |
| `mashos-api/ai/tests/contract/test_new_national_core_piece_contracts.py` | Contract test | 三大中核registryとPiece preview/publish契約の不変条件を守る | `core_contract_registry.py`, `piece_generation_policy.py`, `api_emotion_piece.py` |

## 既存国家システム file の今回差分

| file | 変更要点 |
|---|---|
| `Cocolon/components/EmotionPiecePreviewModal.js` | Piece preview表示を `piece_text || reflection_text` 互換へ寄せる |
| `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md` | 新国家システムのadditive contract / Piece field追加を反映 |
| `mashos-api/ai/services/ai_inference/api_analysis_reports.py` | `reportValidity` metaを分析成果物へadditive付与 |
| `mashos-api/ai/services/ai_inference/api_contract_registry.py` | 新field / current route contractをregistryへ反映 |
| `mashos-api/ai/services/ai_inference/api_cron_distribution.py` | report distribution pushをFCM専用queueへ移行 |
| `mashos-api/ai/services/ai_inference/api_emotion_piece.py` | `piece_text`, visibility/generation/transform/safety契約をadditive追加 |
| `mashos-api/ai/services/ai_inference/api_emotion_submit.py` | connection pool化、background制限、ASTOR thread退避、FCM queue enqueueを反映 |
| `mashos-api/ai/services/ai_inference/api_follow.py` | フォロー/フレンド申請通知をFCM専用queueへ移行 |
| `mashos-api/ai/services/ai_inference/api_self_structure.py` | 分析構造capability / validity gate接続を反映 |
| `mashos-api/ai/services/ai_inference/api_today_question.py` | 今日の問い通知をFCM専用queueへ移行 |
| `mashos-api/ai/services/ai_inference/astor_job_queue.py` | queue stats / stale running job復旧を追加 |
| `mashos-api/ai/services/ai_inference/astor_self_structure_report.py` | 自己構造reportにvalidity gate metaを接続 |
| `mashos-api/ai/services/ai_inference/astor_worker.py` | worker profile / notification profile / queue stats / FCM job handlerを追加 |
| `mashos-api/ai/services/ai_inference/emlis_ai_capability.py` | source_scope / cross_core_enabled / structure_model_enabled / max_reply_linesを予約 |
| `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` | context取得の並列化を反映 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | EmlisAI quality gate metaをadditive接続 |
| `mashos-api/ai/services/ai_inference/emlis_ai_types.py` | EmlisAI meta field拡張を反映 |
| `mashos-api/ai/services/ai_inference/emotion_piece_generation_service.py` | Piece公開安全化とpolicy生成をpreview前に接続 |
| `mashos-api/ai/services/ai_inference/emotion_piece_store.py` | preview/publish本文hashとstatus-only publish契約を反映 |
| `mashos-api/ai/services/ai_inference/emotion_submit_service.py` | EmlisAI即時応答timeout budgetを追加 |
| `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py` | Piece publish時の互換field / meta反映 |
| `mashos-api/ai/services/ai_inference/piece_generation_store.py` | Supabase通信の共有client化とPiece storage契約を反映 |


## 高負荷運用の新しい国家システム flow

`Input Gate` → `Save API` → `Immediate Reply timeout budget` → `Dispatch` → `Queue / Worker profile` → `FCM notification queue` → `Snapshot / Analysis / Publish` → `Read API / Startup` → `RN display`

この差分では、API hot pathに重い外部通信を抱え込ませないため、FCM送信は `send_fcm_push_v1` としてqueue化し、`ASTOR_WORKER_PROFILE=notification` のworkerで処理する。

# 2026-05-05 差分追記: EmlisAI / Piece current national flow

現行基準は `Cocolon(138).zip` / `mashos-api_2(26).zip`、coverage対象は `465 files` です。

## EmlisAI構造

`POST /emotion/submit` の保存直後に `input_feedback.comment_text` を返す。国家システム上は `Save API -> immediate reply -> response contract` の一部であり、ASTOR workerや分析reportとは分ける。

```text
api_emotion_submit.py / emotion_submit_service.py
  -> emlis_ai_reply_service.py
  -> context / capability / world model
  -> user word anchor / phrase shaping / meaning block / understanding frame
  -> response composition / observation kernel
  -> final review / quality gate
  -> safe fallback if needed
  -> input_feedback.comment_text + input_feedback.emlis_ai meta
```

## Piece構造

`emotion_piece_generation_service.py` は preview時点でquestion / answer_display_text / policy / hash材料を作る。publish時に本文を再生成しない構造は維持する。Pieceは「短縮要約」ではなく、入力の核を他者に伝わる一問一答へ整える。

```text
api_emotion_piece.py
  -> emotion_piece_generation_service.py
  -> piece_generated_display.py / piece_generation_policy.py
  -> emotion_piece_store.py
  -> home_gateway.emotion_reflection_publish_service.py
```

EmlisAI / Piece ともに、例文はruntime条件ではなく回帰テストとして扱う。


# 2026-05-07 差分追記: value observation / current full coverage補正

基準zipは `Cocolon(138).zip` / `mashos-api_2(26).zip` です。現行coverageは `Cocolon=125` / `mashos-api=340` / `total=465` です。旧本文は履歴として保持し、この差分追記を現行基準の補正として読む。

## 現行資料へ追加するファイル

| file | system | 構造上の意味 |
|---|---|---|
| `Cocolon/.github/workflows/ios-build.yml` | repo support / CI | iOS build系GitHub Actions workflow。app runtimeやpublic APIではなく、build確認用のsupport境界 |
| `Cocolon/.github/workflows/phase6_contract_guards.yml` | repo support / contract guard CI | Phase6 / contract guard系GitHub Actions workflow。三大中核構造のcontract破壊をCIで検出するsupport境界 |
| `mashos-api/ai/services/ai_inference/value_observation_types.py` | 三大中核構造 / shared value observation types | `ValueObservationSignal` / `ValueObservationPlan` / schema version を定義する共通型。EmlisAI/Piece/Analysisを直接結合しない |
| `mashos-api/ai/services/ai_inference/cocolon_value_observation_service.py` | 三大中核構造 / shared value observation service | Mash観測由来の5 signalを、固定返答ではなく汎用 lexical / structural rules として抽出する |
| `mashos-api/ai/services/ai_inference/emlis_context_anchor_service.py` | EmlisAI context anchor / cross-core context | report / piece / self structure系contextをEmlisAIへ渡すanchor境界。value observationはhidden personality claimにしない |
| `mashos-api/ai/tests/test_cocolon_value_observation_service.py` | regression test | 5 signal抽出を固定文一致ではなく `signal_key` / evidence / target core で検証する |
| `mashos-api/ai/tests/test_emlis_ai_value_observation_cases.py` | regression test | EmlisAIがvalue observation signalをmetaと返答候補へ接続できることを検証する |
| `mashos-api/ai/tests/test_emotion_piece_generation_value_observation.py` | regression test | Pieceがsignalから問い・答えを作り、過圧縮せずmetaへ保持することを検証する |
| `mashos-api/ai/tests/test_analysis_value_observation_boundary.py` | regression test | Analysis validity gateでvalue observation素材のdomain境界を検証する |

## 既存ファイルの今回差分

| file | 変更要点 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_types.py` | `WorldModelFacts` に `value_observation_signals` / `value_observation_plan` をadditive追加 |
| `mashos-api/ai/services/ai_inference/emlis_ai_world_model_service.py` | meaning block / shaped phrase 後にvalue observation signal / planを生成しworld modelへ保持 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_kernel.py` | value observation signalを `value_observation.*` candidate として返答候補へ追加 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | `input_feedback.emlis_ai.meta.value_observation` をadditiveに返す |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_final_review_service.py` | `コンフォートゾーン` / `スペック` / `精神の問題` / `皮算用` などの内部観測語を返答前reviewで遮断する |
| `mashos-api/ai/services/ai_inference/emlis_ai_quality_gate.py` | single-focus overcompression / long input underanswering などのGate要素を補強 |
| `mashos-api/ai/services/ai_inference/emlis_ai_safe_reply_fallback_service.py` | Gate fail時もvalue observation lineを使い、単なる受領文へ戻さない |
| `mashos-api/ai/services/ai_inference/emlis_ai_understanding_frame_service.py` | value observation接続に合わせ、understanding frame側の構造整合を維持 |
| `mashos-api/ai/services/ai_inference/emotion_piece_generation_service.py` | value observation signalからPieceCoreQuestionAnswerPlanを生成し、`must_keep_signal_keys` / `source_claims` / `overcompression_risk` をpiece_core metaへ追加 |
| `mashos-api/ai/services/ai_inference/piece_generation_policy.py` | `overcompression_risk` / `overcompression_blocked` / `value_observation_signal_keys` をpolicy metaへ追加 |
| `mashos-api/ai/services/ai_inference/analysis_report_validity_gate.py` | `value_observation_signal_keys` と `value_observation_domain_ok` をvalidity metaへ追加し、emotion/self_structure domain境界を維持 |

## 5つのvalue observation signal

| signal_key | 観測軸 | 三大中核構造での用途 |
|---|---|---|
| `stagnation_position_gap` | 作業量と前進感の不一致 | EmlisAIは停滞感を受け取り、Pieceは変化欲求を一問一答化し、Analysisは期間内の停滞/変化欲求として扱う |
| `outer_inner_role_gap` | 他者評価と自己実感の不一致 | EmlisAIは外側評価と内側実感のズレを返答し、Pieceは無理して保つ自分を伝達可能にする |
| `relationship_cost_asymmetry` | 関係維持コストの非対称性 | 怒りの下にある配慮負担を拾い、Pieceでは人間関係で疲れる場面として表現する |
| `inner_activity_fatigue_gap` | 外側の行動量と内側の消耗量の不一致 | 短文入力でも、行動量では測れない思考・緊張の負荷を扱う |
| `ideal_capacity_switch_gap` | 理想手順と処理容量のズレ | 計画不能ではなく、全体整理から即時処理への切替として自己構造分析へ渡す |

作業時は、これらのsignalを例文専用条件にしない。Mash様の文を固定返答として保存せず、現在入力から抽出したsource-groundedな観測信号として扱う。


# 2026-05-09 差分追記: latest国家システムcoverage補正とpersonal_followup flow

最新基準面は `Cocolon_前提資料(48).zip` / `Cocolon(138).zip` / `mashos-api_2(26).zip` です。最新実ファイルは `Cocolon` 125件、`mashos-api` 340件、合計465件です。02系では、入力保存、snapshot、worker、publish/read、contract、安全境界の観点から、本文coverageに未記載だったpathを下へ補正追記します。

## 02系coverage補正path

| file | 補正内容 |
|---|---|
| `Cocolon/app.json` | 02系coverage補正。国家システム資料の本文coverageへ追記 |
| `Cocolon/package-lock.json` | 02系coverage補正。国家システム資料の本文coverageへ追記 |
| `Cocolon/package.json` | 02系coverage補正。国家システム資料の本文coverageへ追記 |
| `Cocolon/screens/TutorialFlowScreen.js` | 02系coverage補正。国家システム資料の本文coverageへ追記 |
| `Cocolon/tutorial/generated/tutorialFixtures.generated.json` | 02系coverage補正。国家システム資料の本文coverageへ追記 |
| `Cocolon/tutorial/tutorialScenarioData.js` | 02系coverage補正。国家システム資料の本文coverageへ追記 |
| `mashos-api/ai/services/ai_inference/emlis_ai_input_meaning_block_service.py` | 02系coverage補正。国家システム資料の本文coverageへ追記 |
| `mashos-api/ai/services/ai_inference/emlis_ai_phrase_shaping_service.py` | 02系coverage補正。国家システム資料の本文coverageへ追記 |
| `mashos-api/ai/services/ai_inference/emlis_ai_response_composition_service.py` | 02系coverage補正。国家システム資料の本文coverageへ追記 |
| `mashos-api/ai/services/ai_inference/emlis_ai_user_word_anchor_service.py` | 02系coverage補正。国家システム資料の本文coverageへ追記 |
| `mashos-api/ai/services/ai_inference/today_question_personal_candidate_service.py` | 02系coverage補正。国家システム資料の本文coverageへ追記 |
| `mashos-api/ai/services/ai_inference/today_question_personal_question_service.py` | 02系coverage補正。国家システム資料の本文coverageへ追記 |
| `mashos-api/ai/services/ai_inference/today_question_personal_templates.py` | 02系coverage補正。国家システム資料の本文coverageへ追記 |
| `mashos-api/ai/tests/test_emlis_ai_composition_transition_guard.py` | 02系coverage補正。国家システム資料の本文coverageへ追記 |
| `mashos-api/ai/tests/test_emlis_ai_long_input_depth_reply.py` | 02系coverage補正。国家システム資料の本文coverageへ追記 |
| `mashos-api/ai/tests/test_emlis_ai_observation_kernel_companion_language.py` | 02系coverage補正。国家システム資料の本文coverageへ追記 |
| `mashos-api/ai/tests/test_emlis_ai_phrase_grammar_guard.py` | 02系coverage補正。国家システム資料の本文coverageへ追記 |
| `mashos-api/ai/tests/test_emlis_ai_response_composition_self_sacrifice.py` | 02系coverage補正。国家システム資料の本文coverageへ追記 |
| `mashos-api/ai/tests/test_emlis_ai_self_and_others_happiness_reply.py` | 02系coverage補正。国家システム資料の本文coverageへ追記 |
| `mashos-api/ai/tests/test_emlis_ai_whole_input_meaning_arc_service.py` | 02系coverage補正。国家システム資料の本文coverageへ追記 |
| `mashos-api/ai/tests/test_subscription_projection.py` | 02系coverage補正。国家システム資料の本文coverageへ追記 |
| `mashos-api/scripts/generate_tutorial_fixtures.py` | 02系coverage補正。国家システム資料の本文coverageへ追記 |


## 今日の問い personal_followup 国家システムflow

```text
Home current取得
  -> today_question_store が回答済みslotを確認
  -> Premium かつ personal_followup enabled かつ static fallback日でないか確認
  -> emotion入力からcandidate抽出
  -> source_anchorが元入力に実在する場合だけ personal question を作成/取得
  -> GET /today-question/current が question_origin=personal_followup を返す
  -> RNが既存Cardで表示し、submit時に personal_question_id / source_anchor_hash を送る
  -> today_question_answersへorigin/source_anchor snapshot込みで保存
  -> personal question status=answered
  -> self_structure snapshot refresh enqueue
  -> astor_material_snapshots / analysis_engine_adapter がself-only素材として分析へ渡す
```

## static fallback / sequence境界

- `static_role_probe` は既存100問テンプレです。
- `personal_followup` は追加層です。personal回答では `today_question_user_progress` のstatic sequenceを進めません。
- `TODAY_QUESTION_PERSONAL_STATIC_FALLBACK_EVERY_N_DAYS` により、Premiumでも定期的にstaticへ戻り、role evidenceの偏りを防ぎます。
- 候補なし、低信頼、anchor検証NG、安全除外時はstaticへfallbackします。

## 通知 / public面境界

- 今日の問いpersonal通知は、push本文に原文アンカーを出しません。
- `source_anchor` と今日の問い回答はself-onlyです。Piece公開、フォロー中ユーザー表示、公開feedへ自動転用しません。
- `account_delete_service.py` は `today_question_personal_candidates` / `today_question_personal_questions` も削除対象に含めます。


# 2026-05-09 実ファイル再照合: current full coverage補正

`Cocolon(138).zip` / `mashos-api_2(26).zip` の実ファイル一覧と本文coverageを再照合した結果、下記pathをcurrent coverageへ補正追記する。
既存本文は履歴として保持し、この差分追記を現行基準の補正として読む。

| path | 補正理由 |
|---|---|
| `mashos-api/ai/tests/test_emlis_ai_current_input_grounding_guard.py` | 02系coverage補正。EmlisAI品質Gate/意味保持/構成/groundingとPiece長文testを国家システム判断対象へ追加 |
| `mashos-api/ai/tests/test_emlis_ai_input_meaning_block_service.py` | 02系coverage補正。EmlisAI品質Gate/意味保持/構成/groundingとPiece長文testを国家システム判断対象へ追加 |
| `mashos-api/ai/tests/test_emlis_ai_phrase_shaping_service.py` | 02系coverage補正。EmlisAI品質Gate/意味保持/構成/groundingとPiece長文testを国家システム判断対象へ追加 |
| `mashos-api/ai/tests/test_emlis_ai_quality_gate_pre_return.py` | 02系coverage補正。EmlisAI品質Gate/意味保持/構成/groundingとPiece長文testを国家システム判断対象へ追加 |
| `mashos-api/ai/tests/test_emlis_ai_reply_final_review_service.py` | 02系coverage補正。EmlisAI品質Gate/意味保持/構成/groundingとPiece長文testを国家システム判断対象へ追加 |
| `mashos-api/ai/tests/test_emlis_ai_response_composition_service.py` | 02系coverage補正。EmlisAI品質Gate/意味保持/構成/groundingとPiece長文testを国家システム判断対象へ追加 |
| `mashos-api/ai/tests/test_emotion_piece_generation_long_input_core.py` | 02系coverage補正。EmlisAI品質Gate/意味保持/構成/groundingとPiece長文testを国家システム判断対象へ追加 |
| `mashos-api/ai/tests/test_emotion_piece_generation_self_and_others_happiness.py` | 02系coverage補正。EmlisAI品質Gate/意味保持/構成/groundingとPiece長文testを国家システム判断対象へ追加 |

# 2026-05-09 差分追記: RN screen split / client event monitoring 国家システム補正

最新基準面は `Cocolon_前提資料(51).zip` / `Cocolon_12(3).zip` / `mashos-api_4(10).zip` です。実ファイルは `Cocolon` 200件、`mashos-api` 342件、合計542件です。

RN巨大画面分割は、国家システムの public API / DB write path / queue / worker / read-side を変更しない。entry shellからsubmoduleへ責務を分けたため、国家システム判断では次を読む。

| flow | current owner | 国家システム上の読み方 |
|---|---|---|
| App startup | `Cocolon/App.js` / `Cocolon/navigation/RootNavigator.js` / `Cocolon/runtime/AppRuntimeBootstrapGate.js` | provider、auth gate、IAP observer、push token sync、bootstrap refreshのownerを分けて読む |
| Home input | `Cocolon/screens/InputScreen.js` / `Cocolon/screens/input/*` / `Cocolon/features/home/*` | 入力保存APIやToday Question送信APIは変えない。画面内state / modal / UI sectionのみ分離 |
| Analysis read | `Cocolon/screens/AnalysisScreen.js` / `Cocolon/screens/analysis/*` | report取得・既読・self-structure遷移のRN側ownerを分けて読む。backend read routeは変えない |
| Piece read / publish surface | `Cocolon/screens/PieceScreen.js` / `Cocolon/screens/NexusScreen.js` / `Cocolon/screens/piece/*` / `Cocolon/screens/nexus/*` | Piece home / Nexus surfaceを分割。EmotionPiece preview/publish API、Nexus API routeは変えない |
| Account surface | `Cocolon/screens/AccountScreen.js` / `Cocolon/screens/account/*` | Account profile / follow / visibility / subscriptionのRN側ownerを分けて読む。account deleteは別owner |
| Client observability | `Cocolon/lib/monitoring.js` -> `mashos-api/ai/services/ai_inference/api_client_events.py` | runtime failureをbest-effortで送る追加flow。product state / DB write path / user data mutationを行わない |

## 02系coverage補正path

| path | 補正内容 |
|---|---|
| Cocolon/components/GlobalFrameLayout.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/lib/monitoring.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/navigation/AnalysisStackNavigator.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/navigation/InputStackNavigator.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/navigation/MainTabs.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/navigation/PieceStackNavigator.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/navigation/RankingStackNavigator.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/navigation/RootNavigator.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/navigation/SettingsStackNavigator.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/navigation/linkingRuntime.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/navigation/navigationConstants.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/navigation/navigationRef.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/navigation/notificationRouting.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/runtime/AppRuntimeBlockingScreen.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/runtime/AppRuntimeBootstrapGate.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/account/AccountIdSearchSection.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/account/AccountNameEditModal.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/account/AccountProfileSection.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/account/AccountStatusSection.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/account/AccountVisibilitySection.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/account/accountModel.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/account/useAccountFollowState.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/account/useAccountIdSearch.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/account/useAccountProfile.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/account/useAccountSubscription.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/account/useAccountVisibility.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/analysis/analysisRouteModel.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/analysis/useAnalysisReportActions.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/analysis/useAnalysisRouteState.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/analysis/useAnalysisSelfStructureActions.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/analysis/useAnalysisTutorialOverlay.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/analysis/useAnalysisUnreadBadges.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/analysisReport/AnalysisReportCharts.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/analysisReport/AnalysisReportUpgradeCard.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/analysisReport/analysisReportAccessPolicy.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/analysisReport/analysisReportConstants.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/analysisReport/analysisReportFormatters.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/analysisReport/analysisReportHtmlExport.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/analysisReport/analysisReportNormalize.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/input/InputActionArea.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/input/InputCategorySection.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/input/InputEmotionSection.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/input/InputFeedbackReplyModal.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/input/InputMemoSection.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/input/InputPiecePreviewController.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/input/InputStartupModals.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/input/InputToastOverlay.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/input/inputDraftModel.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/input/inputFeedbackModel.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/input/inputLayoutModel.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/input/inputNoticeModel.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/input/inputOptions.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/input/useInputDraftPersistence.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/input/useInputFeedbackModal.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/input/useInputKeyboardAwareMemo.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/nexus/NexusEmotionLogSection.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/nexus/NexusHeader.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/nexus/NexusHistorySection.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/nexus/NexusOwnerPickerModal.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/nexus/NexusPieceFeedSection.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/nexus/NexusRecommendSection.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/nexus/NexusTabBar.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/nexus/NexusTodayEmotionSummary.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/nexus/nexusConstants.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/nexus/nexusHistoryModel.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/nexus/nexusNormalize.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/nexus/nexusRouteModel.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/piece/PieceHomeActionCard.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/piece/PieceHomeMainActions.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/piece/PieceRecommendModal.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/piece/PieceTutorialCreateModal.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/piece/usePieceHomeGlobalSummary.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/piece/usePieceHomeTutorial.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/screens/piece/usePieceRecommendUsers.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| Cocolon/tests/rn-screen-contracts.test.js | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| mashos-api/ai/services/ai_inference/api_client_events.py | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| mashos-api/ai/tests/contract/test_client_events_contract.py | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| mashos-api/ai/docs/PUBLIC_API_REGISTRY.md | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| mashos-api/ai/services/ai_inference/api_contract_registry.py | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |
| mashos-api/ai/services/ai_inference/app.py | 02系coverage補正。RN巨大画面分割または本番運用監視により国家システム判断対象へ追加 |

# 2026-05-09 差分追記: RN分割後の国家システム境界 / 本番運用監視

照合対象は `Cocolon_12(3).zip` / `mashos-api_4(10).zip` です。Cocolon側は 200件、mashos-api側は 342件、合計542件をcurrent coverageとして扱います。

RN巨大画面分割は、`Input -> Save -> Dispatch -> Snapshot / Queue / Worker -> Publish / Access Policy -> Read API / Startup -> RN display` の契約を変更しません。entry shellとsubdirectoryの関係は、RN display側の責務分割として読む。

本番運用監視は、通常の国家システムflowに追加されたops side-channelです。

`RN client error/API failure -> Cocolon/lib/monitoring.js -> POST /ops/client-events -> api_client_events.py -> privacy-safe structured log / alert log`

このflowはユーザーデータ保存・DB write path・public content publishとは別境界であり、monitoring payloadはtoken / Authorization / email / UUID / 長いtoken風文字列をredactする。

# 2026-05-09 差分追記: Input Save直後のEmlis観測fail-closed境界

国家システム上、`POST /emotion/submit` の保存成功と `Emlisの観測` の表示成功は分離して読む。保存自体は成功しても、Emlis観測本文がReader / Grounding / Template Guard / Safety / Display Gateを通らない場合、`input_feedback.comment_text` は空になり、RNはモーダルを表示しない。

```
Input Gate / Save API
  -> emotion_submit_service.py
  -> emlis_ai_reply_service.render_emlis_ai_reply()
  -> Evidence Ledger / Perspective Observers / ObservationGraph
  -> Conversation Composer
  -> Listener Reader / Grounding / Template Echo / Display Gate
  -> observation_status=passed の時だけ input_feedback.comment_text
  -> RN InputFeedback modal
```

`api_emotion_submit.py` は既存互換のため `input_feedback.comment_text` と `input_feedback.emlis_ai` を残すが、`comment_text` が空の場合は `input_feedback` をresponseから省略する。これにより、読めない観測文・旧テンプレfallbackを表示しない。

# 2026-05-10 差分追記: Emlisの観測 Phase8 quality gate / national flow

国家システム上、Phase8は `Input Gate -> Save API` の保存可否を変更しません。保存後の `Emlisの観測` が `passed` になるかどうかを、より厳密に品質判定する補強として読む。

```
Input Gate / Save API
  -> emotion_submit_service.py
  -> emlis_ai_reply_service.render_emlis_ai_reply()
  -> Evidence Ledger / Perspective Observers / ObservationGraph
  -> LimitedObservationScope
  -> CocolonLimitedComposerClient
  -> PhraseUnit / ObservationProfile / SentencePlan
  -> LimitedSentenceQualityGuard / Template Echo / Grounding / Reader / Display Gate
  -> observation_status=passed の時だけ input_feedback.comment_text
  -> RN InputFeedback modal
```

| national boundary | owner | 読み方 |
|---|---|---|
| 保存成功 | `emotion_submit_service.py` | Phase8で変更なし。Emlis観測失敗でも感情入力保存は成功し得る |
| 本文化範囲 | `emlis_ai_limited_observation_scope_service.py` | full graphから本文化してよいscoped graphを切る |
| 本文品質 | `emlis_ai_limited_composer_client.py` / `emlis_ai_limited_sentence_quality_guard.py` | 実入力レベルで意味が通る短文へ寄せ、破綻文を表示させない |
| 表示可否 | `emlis_ai_display_gate.py` | `passed` 以外は本文を空にするfail-closed方針を維持する |

Phase8は、読めない観測文を表示しないための品質層です。API互換の `input_feedback.comment_text` は維持しますが、`comment_text` に本文が入るのは `observation_status=passed` の場合だけです。


# 2026-05-11 差分追記: 共通文章生成基盤の国家システム上の位置

共通文章生成基盤は、国家システムflowのうち **Save / Dispatch 後の文章出力品質Gate** と **Contract / Boundary / Test** に属します。DB write path、queue、worker、read-side API、RN display routeを置換するものではありません。

```text
Input Gate -> Save API -> Emlis / Piece / Analysis runtime
          -> Core-specific Composer Adapter
          -> CocolonTextGenerationCore
          -> 中核別既存payloadへadditive meta
          -> RN display / read-side existing contract
```

| 中核 | 国家システム上の扱い | 維持する契約 |
|---|---|---|
| EmlisAI | `/emotion/submit` 保存後 immediate reply の候補文を共通Coreで検査 | `input_feedback.comment_text`, `observation_status`, passed-only表示 |
| Piece | `/emotion/piece/preview` 生成本文を共通Coreで検査し、publishでは再生成しない | `piece_text`, preview/publish hash, legacy互換名 |
| Analysis | Analysis report validity gateへ非診断・非断定text safetyをadditive接続 | `content_json`, `standardReport`, `contentText` |
