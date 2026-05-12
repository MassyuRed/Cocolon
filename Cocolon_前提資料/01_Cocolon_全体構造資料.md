---
doc_id: cocolon_overall_structure_full_coverage
title: "Cocolon 全体構造資料"
revision_date: "2026-05-11"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 200
  mashos-api: 414
purpose: "華恋が Cocolon 構造に関係する全ファイルを system / relation 単位で復元できるようにする"
coverage:
  included_files_total: 614
  included_files_cocolon: 200
  included_files_mashos_api: 414
---

# 1. 1行定義

現行の Cocolon は、**RN surface + frontend boundary + backend public API + gateway / policy / worker + tests / rules** が繋がって動く 1 つのアプリです。  
repo は分かれていても、理解の単位は **system / feature / flow** です。

# 2. 全体構造の読み方

- `01A` は **アプリ基盤 / Home / startup / immediate reply / EmlisObservationComposer接続**
- `01B` は **Analysis / Piece / EmotionLog / Ranking / Self Structure / PieceComposer・AnalysisComposer接続**
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
- `CocolonTextGenerationCore` は三大中核の共通文章品質・根拠・安全基盤であり、出力目的・表示名・公開契約は中核別Composerが保持する

# 4-2. 2026-04-30 current app runtime map

最新基準面は `Cocolon(138).zip` / `mashos-api_2(26).zip` です。  
現在のcoverageは `Cocolon=125` / `mashos-api=340` / `total=465` です。

この更新は残タスク表ではなく、アプリのファイル構成として読む。

| file | system | 構造上の意味 |
|---|---|---|
| `Cocolon/AppRuntimeContext.js` | App runtime / feature flag boundary | `/app/bootstrap` を取得し、feature flag / version状態をアプリ全体へ渡す |
| `Cocolon/App.js` | App root / navigation / bootstrap gate | `AppRuntimeProvider` と `AppRuntimeBootstrapGate` を持ち、`API_BASE_URL` を `lib/apiClient.js` から読む |
| `Cocolon/screens/SettingsOtherScreen.js` | Account / Settings surface | `account_delete_enabled` を読み、退会導線を二段階確認にする |
| `Cocolon/lib/accountLocalCleanup.js` | Account local cleanup boundary | 退会後にユーザー別analysis cacheも削除対象にする |
| `Cocolon/features/home/useHomeState.js` | Home runtime hook | `today_question_enabled` を読み、Today Question表示・起動popup候補を制御する |
| `Cocolon/screens/TodayQuestionHistoryScreen.js` | Today Question history surface | `today_question_history_enabled` を読み、履歴API呼び出しを制御する |
| `Cocolon/screens/SubscriptionSelectScreen.js` | Subscription surface | `subscription_sales_enabled` を読み、新規購入導線だけを止められるようにする |
| `Cocolon/lib/pushToken.js` | Push token sync boundary | token prefix logをdebug build限定にする |

# 5. 章と対象件数

2026-04-22 版の詳細ブロックは保持する。2026-04-25 時点の latest full coverage は後続の `2026-04-25 差分追記: current full coverage` を正本とする。

- latest full coverage: `556 files`
  - Cocolon: `200`
  - mashos-api: `356`

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

# 2026-04-28 差分追記: 新国家システム / 高負荷基盤 coverage override

## coverage 再確認

今回の基準面は `Cocolon_2(27).zip` / `mashos-api_5(7).zip` です。

- latest full coverage listed in body: `422 files`
  - Cocolon: `116`
  - mashos-api: `329`
- 旧本文の 408 files coverage は履歴として保持する
- この追記により、Cocolon 構造に関係する latest 422 files は `01` 本文内で全件追跡できる
- latest zip に存在しない旧本文 path: `0件`
- latest zip に対する 01 本文欠落は、下記14件を追記することで `0件`

## 三大中核構造の現行定義

この資料でいう **三大中核構造** は、以下の3つです。

1. `EmlisAI構造`
2. `分析構造`
3. `Piece構造`

旧表現の `EmlisAI` / `分析構造` / `Piece生成機構` は、構造名としては上記に読み替えます。`Piece生成機構` は `Piece構造` の生成・preview・publish部分を指す下位工程として扱います。

## 追加された Cocolon 構造対象 files

| file | 01上の区分 | 役割 | 同時確認 |
|---|---|---|---|
| `mashos-api/ai/services/ai_inference/core_contract_registry.py` | 新国家システム / core registry | 三大中核構造を internal contract として固定する | `api_contract_registry.py`, `test_new_national_core_piece_contracts.py` |
| `mashos-api/ai/services/ai_inference/emlis_ai_quality_gate.py` | EmlisAI構造 | `input_feedback.comment_text` を壊さず、即時応答の品質Gate metaを付ける | `emlis_ai_reply_service.py`, `emotion_submit_service.py`, `emlis_ai_capability.py` |
| `mashos-api/ai/services/ai_inference/analysis_capability.py` | 分析構造 | plan名ではなくcapabilityで分析能力を判断する | `api_analysis_reports.py`, `api_self_structure.py`, `analysis_report_validity_gate.py` |
| `mashos-api/ai/services/ai_inference/analysis_report_validity_gate.py` | 分析構造 | material / domain / diagnosis / overclaim / display validityを判定する | `api_analysis_reports.py`, `astor_self_structure_report.py`, `api_self_structure.py` |
| `mashos-api/ai/services/ai_inference/piece_generation_policy.py` | Piece構造 | `piece_text` / visibility / generation / transform / safety / hashを固定する | `api_emotion_piece.py`, `emotion_piece_generation_service.py`, `emotion_piece_store.py` |
| `mashos-api/ai/services/ai_inference/fcm_push_queue.py` | 高負荷通知基盤 | FCM外部送信を `send_fcm_push_v1` jobとしてenqueueする | `api_emotion_submit.py`, `api_follow.py`, `api_today_question.py`, `api_cron_distribution.py`, `astor_worker.py` |
| `mashos-api/ai/services/ai_inference/.env.worker.example` | Worker運用基盤 | API/worker分離、profile、FCM queue、stale復旧のenv例 | `astor_worker.py`, `WORKER_OPERATIONS.md` |
| `mashos-api/ai/docs/WORKER_OPERATIONS.md` | Worker運用基盤 | worker profile / queue監視 / 増設判断を固定する運用資料 | `astor_worker.py`, `astor_worker_status.py` |
| `mashos-api/ai/docs/LOAD_TESTING.md` | 高負荷検証基盤 | p95/p99、queue滞留、scenario別負荷試験手順 | `scripts/cocolon_load_test.py`, `scripts/astor_worker_status.py` |
| `mashos-api/scripts/astor_worker_status.py` | Worker運用支援 | queue stats / stale running job復旧 / pressure判定 | `astor_job_queue.py`, `astor_worker.py` |
| `mashos-api/scripts/cocolon_load_test.py` | 高負荷検証支援 | startup/home/emotion-submit/piece-preview/mixの負荷試験 | `LOAD_TESTING.md` |
| `mashos-api/ai/tests/contract/test_new_national_core_analysis_contracts.py` | contract test | 分析構造のcapability / validity gateを固定する | `analysis_capability.py`, `analysis_report_validity_gate.py` |
| `mashos-api/ai/tests/contract/test_new_national_core_emlis_contracts.py` | contract test | EmlisAI構造のcapability / quality gateを固定する | `emlis_ai_capability.py`, `emlis_ai_quality_gate.py` |
| `mashos-api/ai/tests/contract/test_new_national_core_piece_contracts.py` | contract test | 三大中核registryとPiece構造のpreview/publish契約を固定する | `core_contract_registry.py`, `piece_generation_policy.py`, `api_emotion_piece.py` |


## 既存 file の今回差分

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


## 削除しないもの

- DB physical rename / drop
- legacy route handler
- old named API file
- RN source file
- current bridge view への write 切替
- `mymodel/qna/*` active legacy named public contract

# 2026-05-05 差分追記: current 452 files coverage補正

`Cocolon(138).zip` / `mashos-api_2(26).zip` の現行基準では、coverage対象は `465 files` です。

| source | count | 主な差分 |
|---|---:|---|
| Cocolon | 125 | Tutorial flow / generated tutorial fixture / package metadata / subscription runtime catalog 表示文言 |
| mashos-api | 340 | EmlisAI 汎用意味分解・文章構成・Gate層、Piece communicative core、tutorial fixture generator、関連test |
| total | 465 | 01/02 系の差分追記対象 |

この差分で新しく構造資料上に明示する current files は次です。

### Cocolon側

- `Cocolon/app.json` — React Native app display metadata。表示名は `Emlis`。
- `Cocolon/package.json` / `Cocolon/package-lock.json` — RN dependency / script boundary。
- `Cocolon/screens/TutorialFlowScreen.js` — tutorial後半の独立flow screen。`App.js` の `TutorialIntro` / Piece stack `TutorialFlow` から到達する。
- `Cocolon/tutorial/tutorialScenarioData.js` — tutorial表示用fixture読込・fallback sample定義。
- `Cocolon/tutorial/generated/tutorialFixtures.generated.json` — tutorial表示用の生成済みfixture。runtime生成ではなく静的fixtureとして読む。

### mashos-api側

- `mashos-api/scripts/generate_tutorial_fixtures.py` — 実generation serviceからtutorial fixtureを生成する保守用script。runtime UI pathではない。
- `mashos-api/ai/services/ai_inference/emlis_ai_input_meaning_block_service.py` — current inputを汎用意味ブロックへ分解する。
- `mashos-api/ai/services/ai_inference/emlis_ai_phrase_shaping_service.py` — raw phraseを会話文に入る安全なphraseへ整形する。
- `mashos-api/ai/services/ai_inference/emlis_ai_response_composition_service.py` — 意味ブロックを返答構成順へ並べる。
- `mashos-api/ai/services/ai_inference/emlis_ai_reply_final_review_service.py` — 返答前の文法・構成・自然さ review。
- `mashos-api/ai/services/ai_inference/emlis_ai_safe_reply_fallback_service.py` — Gate fail時の現在入力ベースsafe fallback。
- `mashos-api/ai/services/ai_inference/emlis_ai_understanding_frame_service.py` — anchor/phrase/meaning block を理解frameへ接続する。
- `mashos-api/ai/services/ai_inference/emlis_ai_user_word_anchor_service.py` — current input から user word anchor を抽出する。
- `mashos-api/ai/tests/test_emlis_ai_*` の追加群 — phrase shaping / meaning block / composition / final review / quality gate / grounding の回帰確認。
- `mashos-api/ai/tests/test_emotion_piece_generation_*` の追加群 — Piece core Q&A / communicative core の回帰確認。

旧版の `423 files` / `452 files` 記述は履歴として残っている箇所がありますが、現行作業基準は `465 files` です。


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


# 2026-05-09 差分追記: latest実ファイルcoverage補正と今日の問いpersonal_followup

最新基準面は `Cocolon_前提資料(48).zip` / `Cocolon(138).zip` / `mashos-api_2(26).zip` です。最新実ファイルは `Cocolon` 125件、`mashos-api` 340件、合計465件です。今回の更新では、今回実装分だけでなく、最新実ファイルと前提資料本文coverageの差分も確認し、01系coverageに未記載だったpathを下へ補正追記します。

## latest実ファイル差分

### 追加
| file | 補正内容 |
|---|---|
| `mashos-api/ai/services/ai_inference/today_question_personal_candidate_service.py` | latest実ファイルで新規追加。前提資料coverageへ追記 |
| `mashos-api/ai/services/ai_inference/today_question_personal_question_service.py` | latest実ファイルで新規追加。前提資料coverageへ追記 |
| `mashos-api/ai/services/ai_inference/today_question_personal_templates.py` | latest実ファイルで新規追加。前提資料coverageへ追記 |

### 変更
| file | 補正内容 |
|---|---|
| `Cocolon/components/TodayQuestionCard.js` | latest実ファイルで変更。前提資料の構造説明を差分更新 |
| `Cocolon/features/home/useHomeActions.js` | latest実ファイルで変更。前提資料の構造説明を差分更新 |
| `Cocolon/screens/TodayQuestionHistoryScreen.js` | latest実ファイルで変更。前提資料の構造説明を差分更新 |
| `mashos-api/ai/services/ai_inference/account_delete_service.py` | latest実ファイルで変更。前提資料の構造説明を差分更新 |
| `mashos-api/ai/services/ai_inference/analysis_engine_adapter.py` | latest実ファイルで変更。前提資料の構造説明を差分更新 |
| `mashos-api/ai/services/ai_inference/api_contract_registry.py` | latest実ファイルで変更。前提資料の構造説明を差分更新 |
| `mashos-api/ai/services/ai_inference/api_today_question.py` | latest実ファイルで変更。前提資料の構造説明を差分更新 |
| `mashos-api/ai/services/ai_inference/astor_material_snapshots.py` | latest実ファイルで変更。前提資料の構造説明を差分更新 |
| `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py` | latest実ファイルで変更。前提資料の構造説明を差分更新 |
| `mashos-api/ai/services/ai_inference/home_gateway/today_question_command_service.py` | latest実ファイルで変更。前提資料の構造説明を差分更新 |
| `mashos-api/ai/services/ai_inference/today_question_store.py` | latest実ファイルで変更。前提資料の構造説明を差分更新 |

### 削除
| file | 補正内容 |
|---|---|
| `0件` | 差分なし |


## 01系coverage補正path

| file | 補正内容 |
|---|---|
| `mashos-api/ai/services/ai_inference/today_question_personal_candidate_service.py` | 01系coverage補正。全体構造資料の本文coverageへ追記 |
| `mashos-api/ai/services/ai_inference/today_question_personal_question_service.py` | 01系coverage補正。全体構造資料の本文coverageへ追記 |
| `mashos-api/ai/services/ai_inference/today_question_personal_templates.py` | 01系coverage補正。全体構造資料の本文coverageへ追記 |
| `mashos-api/ai/tests/test_emlis_ai_composition_transition_guard.py` | 01系coverage補正。全体構造資料の本文coverageへ追記 |
| `mashos-api/ai/tests/test_emlis_ai_current_input_grounding_guard.py` | 01系coverage補正。全体構造資料の本文coverageへ追記 |
| `mashos-api/ai/tests/test_emlis_ai_input_meaning_block_service.py` | 01系coverage補正。全体構造資料の本文coverageへ追記 |
| `mashos-api/ai/tests/test_emlis_ai_long_input_depth_reply.py` | 01系coverage補正。全体構造資料の本文coverageへ追記 |
| `mashos-api/ai/tests/test_emlis_ai_observation_kernel_companion_language.py` | 01系coverage補正。全体構造資料の本文coverageへ追記 |
| `mashos-api/ai/tests/test_emlis_ai_phrase_grammar_guard.py` | 01系coverage補正。全体構造資料の本文coverageへ追記 |
| `mashos-api/ai/tests/test_emlis_ai_phrase_shaping_service.py` | 01系coverage補正。全体構造資料の本文coverageへ追記 |
| `mashos-api/ai/tests/test_emlis_ai_quality_gate_pre_return.py` | 01系coverage補正。全体構造資料の本文coverageへ追記 |
| `mashos-api/ai/tests/test_emlis_ai_reply_final_review_service.py` | 01系coverage補正。全体構造資料の本文coverageへ追記 |
| `mashos-api/ai/tests/test_emlis_ai_response_composition_self_sacrifice.py` | 01系coverage補正。全体構造資料の本文coverageへ追記 |
| `mashos-api/ai/tests/test_emlis_ai_response_composition_service.py` | 01系coverage補正。全体構造資料の本文coverageへ追記 |
| `mashos-api/ai/tests/test_emlis_ai_self_and_others_happiness_reply.py` | 01系coverage補正。全体構造資料の本文coverageへ追記 |
| `mashos-api/ai/tests/test_emlis_ai_whole_input_meaning_arc_service.py` | 01系coverage補正。全体構造資料の本文coverageへ追記 |
| `mashos-api/ai/tests/test_subscription_projection.py` | 01系coverage補正。全体構造資料の本文coverageへ追記 |


## 今日の問い vNext 構造

| file | 構造上の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/today_question_personal_templates.py` | `static_role_probe` / `personal_followup` のorigin定義、6種類のquestion_type、固定選択肢、hidden_meta、原文アンカー質問文を定義する |
| `mashos-api/ai/services/ai_inference/today_question_personal_candidate_service.py` | `emotions` の `memo` / `memo_action` から、literal substring の `anchor_text` を抽出し、重い内容を除外して候補化する。生成AIでユーザー発言を作らない |
| `mashos-api/ai/services/ai_inference/today_question_personal_question_service.py` | candidate から `today_question_personal_questions` へinsertできるpayloadを作る。質問文・choices・source_anchorをsnapshot-safeに固定する |
| `mashos-api/ai/services/ai_inference/today_question_store.py` | Premiumのみpersonalを差し込み、候補なし/低信頼/定期static fallback時は既存100問へ戻す。personal回答ではstatic sequenceを進めない |
| `mashos-api/ai/services/ai_inference/api_today_question.py` | `current` / `status` / `answers` / `history` に `question_origin` / `personal_question_id` / `source_anchor` をadditive返却・受信する |
| `Cocolon/features/home/useHomeActions.js` | current questionの `question_origin` / `personal_question_id` / `source_anchor_hash` を回答payloadに含める |
| `Cocolon/components/TodayQuestionCard.js` | personalでも既存UIで `question.text` とchoicesを表示する。監視感を避けるため強いpersonalラベルは出さない |
| `Cocolon/screens/TodayQuestionHistoryScreen.js` | 履歴に `source_anchor_summary.anchor_text` を短く表示する。公開面ではなくself-onlyの履歴として扱う |

## 感情通知 / Tutorial 反映

- `mashos-api/ai/services/ai_inference/api_emotion_submit.py` は、FCM queue modeでAPI側Firebase credentialを要求してenqueueを止めない構造へ更新済みです。
- `mashos-api/ai/services/ai_inference/.env.worker.example` は、単独worker/local worker例を `ASTOR_WORKER_PROFILE=all` にし、`send_fcm_push_v1` をconsumeできる前提へ更新済みです。
- Tutorialは `Emlis（エムリス）` 表記、感情選択/カテゴリ選択の分離、Home説明時のsummary/history非表示、ピース説明文の自然文化を反映済みです。


# 2026-05-09 実ファイル再照合: current full coverage補正

`Cocolon(138).zip` / `mashos-api_2(26).zip` の実ファイル一覧と本文coverageを再照合した結果、下記pathをcurrent coverageへ補正追記する。
既存本文は履歴として保持し、この差分追記を現行基準の補正として読む。

| path | 補正理由 |
|---|---|
| `mashos-api/ai/tests/test_emotion_piece_generation_long_input_core.py` | 01系coverage補正。Piece長文/自己他者幸福系testをcurrent full coverageへ追加 |
| `mashos-api/ai/tests/test_emotion_piece_generation_self_and_others_happiness.py` | 01系coverage補正。Piece長文/自己他者幸福系testをcurrent full coverageへ追加 |

# 2026-05-09 差分追記: RN巨大画面分割 / 本番運用監視 full coverage補正

最新基準面は `Cocolon_前提資料(51).zip` / `Cocolon_12(3).zip` / `mashos-api_4(10).zip` です。実ファイルは `Cocolon` 200件、`mashos-api` 342件、合計542件です。`Cocolon(138).zip` / `mashos-api_2(26).zip` からの差分として、RN画面分割moduleと本番運用監視moduleをcurrent full coverageへ追記します。

## Cocolon追加path

| path | 補正内容 |
|---|---|
| Cocolon/components/GlobalFrameLayout.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/lib/monitoring.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/navigation/AnalysisStackNavigator.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/navigation/InputStackNavigator.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/navigation/MainTabs.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/navigation/PieceStackNavigator.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/navigation/RankingStackNavigator.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/navigation/RootNavigator.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/navigation/SettingsStackNavigator.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/navigation/linkingRuntime.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/navigation/navigationConstants.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/navigation/navigationRef.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/navigation/notificationRouting.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/runtime/AppRuntimeBlockingScreen.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/runtime/AppRuntimeBootstrapGate.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/account/AccountIdSearchSection.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/account/AccountNameEditModal.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/account/AccountProfileSection.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/account/AccountStatusSection.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/account/AccountVisibilitySection.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/account/accountModel.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/account/useAccountFollowState.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/account/useAccountIdSearch.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/account/useAccountProfile.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/account/useAccountSubscription.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/account/useAccountVisibility.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/analysis/analysisRouteModel.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/analysis/useAnalysisReportActions.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/analysis/useAnalysisRouteState.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/analysis/useAnalysisSelfStructureActions.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/analysis/useAnalysisTutorialOverlay.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/analysis/useAnalysisUnreadBadges.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/analysisReport/AnalysisReportCharts.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/analysisReport/AnalysisReportUpgradeCard.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/analysisReport/analysisReportAccessPolicy.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/analysisReport/analysisReportConstants.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/analysisReport/analysisReportFormatters.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/analysisReport/analysisReportHtmlExport.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/analysisReport/analysisReportNormalize.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/input/InputActionArea.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/input/InputCategorySection.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/input/InputEmotionSection.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/input/InputFeedbackReplyModal.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/input/InputMemoSection.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/input/InputPiecePreviewController.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/input/InputStartupModals.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/input/InputToastOverlay.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/input/inputDraftModel.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/input/inputFeedbackModel.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/input/inputLayoutModel.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/input/inputNoticeModel.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/input/inputOptions.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/input/useInputDraftPersistence.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/input/useInputFeedbackModal.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/input/useInputKeyboardAwareMemo.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/nexus/NexusEmotionLogSection.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/nexus/NexusHeader.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/nexus/NexusHistorySection.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/nexus/NexusOwnerPickerModal.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/nexus/NexusPieceFeedSection.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/nexus/NexusRecommendSection.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/nexus/NexusTabBar.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/nexus/NexusTodayEmotionSummary.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/nexus/nexusConstants.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/nexus/nexusHistoryModel.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/nexus/nexusNormalize.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/nexus/nexusRouteModel.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/piece/PieceHomeActionCard.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/piece/PieceHomeMainActions.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/piece/PieceRecommendModal.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/piece/PieceTutorialCreateModal.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/piece/usePieceHomeGlobalSummary.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/piece/usePieceHomeTutorial.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/screens/piece/usePieceRecommendUsers.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |
| Cocolon/tests/rn-screen-contracts.test.js | RN巨大画面分割または本番運用監視のcurrent追加path。entry shell / section / hook / model / navigation / runtime / monitoringとして読む |

## Cocolon変更path

| path | 補正内容 |
|---|---|
| Cocolon/App.js | entry shell化、screen split接続、監視接続、またはscreen contract test script追加によるcurrent変更path |
| Cocolon/lib/apiClient.js | entry shell化、screen split接続、監視接続、またはscreen contract test script追加によるcurrent変更path |
| Cocolon/package.json | entry shell化、screen split接続、監視接続、またはscreen contract test script追加によるcurrent変更path |
| Cocolon/screens/AccountScreen.js | entry shell化、screen split接続、監視接続、またはscreen contract test script追加によるcurrent変更path |
| Cocolon/screens/AnalysisReportViewerScreen.js | entry shell化、screen split接続、監視接続、またはscreen contract test script追加によるcurrent変更path |
| Cocolon/screens/AnalysisScreen.js | entry shell化、screen split接続、監視接続、またはscreen contract test script追加によるcurrent変更path |
| Cocolon/screens/InputScreen.js | entry shell化、screen split接続、監視接続、またはscreen contract test script追加によるcurrent変更path |
| Cocolon/screens/NexusScreen.js | entry shell化、screen split接続、監視接続、またはscreen contract test script追加によるcurrent変更path |
| Cocolon/screens/PieceScreen.js | entry shell化、screen split接続、監視接続、またはscreen contract test script追加によるcurrent変更path |

## mashos-api追加path

| path | 補正内容 |
|---|---|
| mashos-api/ai/services/ai_inference/api_client_events.py | 本番運用監視 `/ops/client-events` の受信・contract testをcurrent coverageへ追加 |
| mashos-api/ai/tests/contract/test_client_events_contract.py | 本番運用監視 `/ops/client-events` の受信・contract testをcurrent coverageへ追加 |

## mashos-api変更path

| path | 補正内容 |
|---|---|
| mashos-api/ai/docs/PUBLIC_API_REGISTRY.md | `/ops/client-events` route登録、public contract registry、docs反映によるcurrent変更path |
| mashos-api/ai/services/ai_inference/api_contract_registry.py | `/ops/client-events` route登録、public contract registry、docs反映によるcurrent変更path |
| mashos-api/ai/services/ai_inference/app.py | `/ops/client-events` route登録、public contract registry、docs反映によるcurrent変更path |

## 削除path

| path | 補正内容 |
|---|---|
| `0件` | 今回のcurrent差分では実ファイル削除なし |

# 2026-05-09 差分追記: RN巨大画面分割と本番運用監視の全体構造

照合対象は `Cocolon_12(3).zip` / `mashos-api_4(10).zip` です。今回のcurrent実ファイルでは、Cocolon側が 200件、mashos-api側が 342件、合計542件になっています。

## Entry shell policy

既存の巨大画面fileは削除せず、route/importの入口として残します。新しく追加された `screens/input/*`、`screens/nexus/*`、`screens/analysis/*`、`screens/analysisReport/*`、`screens/account/*`、`screens/piece/*`、`navigation/*`、`runtime/*` は、旧entry shellの内部ownerとして読む。

## Current grouped owners

| group | current files | 読み方 |
|---|---|---|
| App root / navigation | `App.js`, `navigation/*`, `runtime/*`, `components/GlobalFrameLayout.js` | provider / route / push / linking / runtime gate を分離したApp root構造 |
| Home/Input | `screens/InputScreen.js`, `screens/input/*`, `features/home/*` | Home entry shell + input-specific hook/section/model。Home gatewayは従来ownerのまま |
| Analysis / report | `screens/AnalysisScreen.js`, `screens/analysis/*`, `screens/AnalysisReportViewerScreen.js`, `screens/analysisReport/*` | Analysis entry shell + report / unread / self-structure / tutorial / export / chart 分割 |
| Piece / Nexus | `screens/PieceScreen.js`, `screens/piece/*`, `screens/NexusScreen.js`, `screens/nexus/*`, `screens/PieceLibraryScreen.js` | Piece home / Nexus surfaceは分割済み。PieceLibraryScreenは今回時点で未分割entry ownerとして残る |
| Account | `screens/AccountScreen.js`, `screens/account/*` | profile/follow/visibility/subscription/searchの分割owner。account deleteはSettingsOtherScreenがowner |
| Monitoring | `lib/monitoring.js`, `mashos-api/ai/services/ai_inference/api_client_events.py` | RN client event -> backend ops log の本番運用監視境界 |

## 変更時の原則

- 画面分割moduleを触る時も、public API / DB write path / route名は変更しない。
- 旧entry shellに残るroute名を、subdirectory名へ置換しない。
- 本番運用監視はDB保存ではなくprivacy-safe structured log / alert logとして読む。

# 2026-05-09 差分追記: EmlisAI multi-perspective current owner

`Cocolon_6(28).zip` / `mashos-api_6(8).zip` では、入力直後のEmlisAIが `Emlisの観測` として複数視点観測pipelineへ切り替わっています。全体構造上は、Home/Inputの保存直後に発生する即時観測ですが、本文品質が通らない場合は表示しないfail-closed境界として読む。

| layer | current file | 全体構造上の意味 |
|---|---|---|
| Orchestrator | `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | `Evidence Ledger -> Observer -> Board -> Graph -> Composer -> Reader/Grounding/Template Guard -> Display Gate` を統括する |
| Evidence | `emlis_ai_evidence_ledger_service.py` | 原文根拠台帳。表示文は作らない |
| Observer | `emlis_ai_perspective_observers.py` | 明示内容、感情、葛藤、圧迫、限界、自己認識、価値/強さ、相手モデル、安全境界を分ける |
| Board | `emlis_ai_perspective_board.py` | 複数observerの `PerspectiveReport` を集約する |
| Integrator | `emlis_ai_observation_integrator_service.py` | `ObservationGraph` を作る。本文生成はしない |
| Composer | `emlis_ai_conversation_composer_service.py` | 観測構造から会話文を生成する |
| Reader | `emlis_ai_listener_reader_judge.py` | 出力だけを読んで、意味・話者・会話性を判定する |
| Grounding | `emlis_ai_grounding_judge.py` | 各文がEvidenceSpanまたはRelationに支えられるか判定する |
| Template/Echo | `emlis_ai_template_echo_guard.py` | 旧文型、復唱、過去出力類似を検出する |
| Display | `emlis_ai_display_gate.py` | `passed` 以外では本文を空にする |

RN側は `screens/InputScreen.js` が `input_feedback.emlis_ai.observation_status` を `useInputFeedbackModal.js` へ渡し、`InputFeedbackReplyModal.js` は `passed` またはstatusなしの互換ケースだけを表示します。

# 2026-05-10 差分追記: EmlisAI Phase8 LimitedComposer quality current owner

`Cocolon_8(6).zip` / `mashos-api_9(2).zip` では、Cocolon側ファイルの追加・削除・変更はありません。mashos-api側では、`Emlisの観測` の B案 LimitedComposer が Phase8 の実入力品質改善へ進んでいます。全体構造上は、Home/Input保存直後の immediate observation pipeline のうち、`Composer -> Guard -> Display` の品質層が補強されたものとして読む。

| layer | current file | 全体構造上の意味 |
|---|---|---|
| Phase8 Composer | `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_client.py` | EvidenceSpanを直接貼らず、PhraseUnit / ObservationProfile / SentencePlan経由で本文候補を作る |
| Sentence quality guard | `emlis_ai_limited_sentence_quality_guard.py` | 日本語破綻・感情ラベル単独行・汎用接続語尾を検出する新規Guard |
| Scope補正 | `emlis_ai_limited_observation_scope_service.py` | `relationship_approach_avoidance` / `reality_escape_tension` など、実入力に近い関係構造をB案scopeとして扱う |
| Evidence補正 | `emlis_ai_evidence_ledger_service.py` | Phase8 profileに必要な根拠spanを保持する |
| Observer補正 | `emlis_ai_perspective_observers.py` | Phase8 profileに必要な観測claim / relationを補助する |
| Template / Display | `emlis_ai_template_echo_guard.py` / `emlis_ai_display_gate.py` | Phase8 quality reportを既存Gateに接続し、破綻候補を `passed` にしない |
| Phase8 tests | `ai/tests/fixtures/emlis_ai_phase8_cases.py` / `ai/tests/test_emlis_ai_phase8_real_input_quality.py` | 7つの実入力回帰ケースを固定し、正解文一致ではなく構造保持と禁止表面で検証する |

RN側の `InputScreen.js` / `useInputFeedbackModal.js` / `InputFeedbackReplyModal.js` は今回変更なし。`observation_status=passed` かつ本文ありの場合だけ表示する既存制御を維持する。


# 2026-05-11 差分追記: 共通文章生成基盤 current coverage

照合対象は `Cocolon_前提資料(65).zip` / `Cocolon_15(1).zip` / `mashos-api_15(2).zip`。Cocolon側は追加・変更・削除なし。mashos-api側は、共通文章生成基盤の新規40件、既存接続・contract補正11件、削除0件です。

## 追加された共通基盤の構造

| 領域 | file群 | 構造上の意味 |
|---|---|---|
| 共通型・Composer | `cocolon_text_generation_core/types.py` / `policies.py` / `composer.py` / `result.py` | 中核非依存の `CoreTextPayload` / `TextGenerationResult` / fail-closed結果型 |
| 根拠・中間構造 | `evidence.py` / `phrase_units.py` / `sentence_plan.py` | `SourceAnchor` / `EvidenceSpanLike` / `PhraseUnit` / `SentencePlan` を共通化 |
| 共通Guard | `guards/*` | Grounding / JapaneseCoherence / TemplateEcho / OverclaimDiagnosis / MustKeepCoverage |
| 中核別adapter | `adapters/emlis_*` / `piece_*` / `analysis_*` | Emlis / Piece / Analysis の意味構造を共通Core入力へ変換 |
| 検証 | `test_cocolon_text_generation_core_*` | 共通Core、三大中核境界、fail-closed、契約維持を固定 |

## 既存runtimeへの接続補正

| file | 構造上の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/analysis_report_validity_gate.py` | Analysis保存可否Gateへ共通非診断・非断定text safety metaをadditive接続 |
| `mashos-api/ai/services/ai_inference/api_analysis_reports.py` | Analysis report payloadへ`textGenerationCore` / `analysis_composer` metaをadditive付与。既存shape維持 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_client.py` | Emlis候補を共通Coreへ通し、Guard reject時は空本文でfail-closed。scoped graph境界維持 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | Emlis reply metaへ`text_generation_core` / stop point / Piece・Analysis接続状態をadditive付与 |
| `mashos-api/ai/services/ai_inference/emotion_piece_generation_service.py` | Piece preview本文を共通Coreで検査。reject時は本文空・blocked、preview/publish再生成なし |
| `mashos-api/ai/services/ai_inference/piece_generation_policy.py` | Piece policy storage/public metaへ`text_generation_core` / `core_text_generation`を保持 |
| `mashos-api/ai/tests/contract/test_new_national_core_emlis_contracts.py` | 三大中核contractへ共通文章生成基盤の接続・未破壊境界を追加確認 |
| `mashos-api/ai/tests/contract/test_new_national_core_piece_contracts.py` | 三大中核contractへ共通文章生成基盤の接続・未破壊境界を追加確認 |
| `mashos-api/ai/tests/test_analysis_value_observation_boundary.py` | 既存回帰に共通文章生成基盤のmeta / fail-closed / 境界確認を追加 |
| `mashos-api/ai/tests/test_emlis_ai_phase8_real_input_quality.py` | 既存回帰に共通文章生成基盤のmeta / fail-closed / 境界確認を追加 |
| `mashos-api/ai/tests/test_emotion_piece_generation_value_observation.py` | 既存回帰に共通文章生成基盤のmeta / fail-closed / 境界確認を追加 |

## 新規path coverage

| file | 構造上の意味 |
|---|---|
| `mashos-api/ai/docs/Cocolon_TextGenerationCore_Phase0_2_Work_Memo_2026_05_11.md` | 共通文章生成基盤の作業境界・最終確認メモ。runtimeではなく作業用地図 / 検証メモとして扱う |
| `mashos-api/ai/docs/Cocolon_TextGenerationCore_Phase14_FinalVerification_2026_05_11.md` | 共通文章生成基盤の作業境界・最終確認メモ。runtimeではなく作業用地図 / 検証メモとして扱う |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/__init__.py` | CocolonTextGenerationCore本体。型、根拠、PhraseUnit、SentencePlan、CoreTextComposer、fail-closed結果型 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/__init__.py` | CocolonTextGenerationCore本体。型、根拠、PhraseUnit、SentencePlan、CoreTextComposer、fail-closed結果型 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/analysis_composer.py` | Analysisの素材domain・観測レポート本文を共通基盤へ渡すadapter。非診断Gateを固定 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/analysis_composer_input_contract.py` | Analysisの素材domain・観測レポート本文を共通基盤へ渡すadapter。非診断Gateを固定 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/analysis_evidence_adapter.py` | Analysisの素材domain・観測レポート本文を共通基盤へ渡すadapter。非診断Gateを固定 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/emlis_evidence_adapter.py` | Emlisの根拠・観測Composerを共通基盤へ接続するadapter。`comment_text`契約は維持 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/emlis_observation_composer.py` | Emlisの根拠・観測Composerを共通基盤へ接続するadapter。`comment_text`契約は維持 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/piece_composer.py` | Pieceの問い/答え・根拠を共通基盤へ渡すadapter。`piece_text` / preview-publish契約は維持 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/piece_composer_input_contract.py` | Pieceの問い/答え・根拠を共通基盤へ渡すadapter。`piece_text` / preview-publish契約は維持 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/piece_evidence_adapter.py` | Pieceの問い/答え・根拠を共通基盤へ渡すadapter。`piece_text` / preview-publish契約は維持 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/composer.py` | CocolonTextGenerationCore本体。型、根拠、PhraseUnit、SentencePlan、CoreTextComposer、fail-closed結果型 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/evidence.py` | CocolonTextGenerationCore本体。型、根拠、PhraseUnit、SentencePlan、CoreTextComposer、fail-closed結果型 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/guards/__init__.py` | 共通Guard。日本語破綻・根拠不足・テンプレ臭・過剰断定・must_keep欠落を中核横断で検査 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/guards/base.py` | 共通Guard。日本語破綻・根拠不足・テンプレ臭・過剰断定・must_keep欠落を中核横断で検査 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/guards/grounding.py` | 共通Guard。日本語破綻・根拠不足・テンプレ臭・過剰断定・must_keep欠落を中核横断で検査 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/guards/japanese_coherence.py` | 共通Guard。日本語破綻・根拠不足・テンプレ臭・過剰断定・must_keep欠落を中核横断で検査 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/guards/must_keep_coverage.py` | 共通Guard。日本語破綻・根拠不足・テンプレ臭・過剰断定・must_keep欠落を中核横断で検査 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/guards/overclaim_diagnosis.py` | 共通Guard。日本語破綻・根拠不足・テンプレ臭・過剰断定・must_keep欠落を中核横断で検査 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/guards/template_echo.py` | 共通Guard。日本語破綻・根拠不足・テンプレ臭・過剰断定・must_keep欠落を中核横断で検査 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/phrase_units.py` | CocolonTextGenerationCore本体。型、根拠、PhraseUnit、SentencePlan、CoreTextComposer、fail-closed結果型 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/policies.py` | CocolonTextGenerationCore本体。型、根拠、PhraseUnit、SentencePlan、CoreTextComposer、fail-closed結果型 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/result.py` | CocolonTextGenerationCore本体。型、根拠、PhraseUnit、SentencePlan、CoreTextComposer、fail-closed結果型 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/sentence_plan.py` | CocolonTextGenerationCore本体。型、根拠、PhraseUnit、SentencePlan、CoreTextComposer、fail-closed結果型 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/types.py` | CocolonTextGenerationCore本体。型、根拠、PhraseUnit、SentencePlan、CoreTextComposer、fail-closed結果型 |
| `mashos-api/ai/tests/test_cocolon_text_generation_core_analysis_composer.py` | 共通文章生成基盤 / 三大中核境界の回帰・contract・boundary test |
| `mashos-api/ai/tests/test_cocolon_text_generation_core_analysis_input_contract.py` | 共通文章生成基盤 / 三大中核境界の回帰・contract・boundary test |
| `mashos-api/ai/tests/test_cocolon_text_generation_core_boundary.py` | 共通文章生成基盤 / 三大中核境界の回帰・contract・boundary test |
| `mashos-api/ai/tests/test_cocolon_text_generation_core_composer.py` | 共通文章生成基盤 / 三大中核境界の回帰・contract・boundary test |
| `mashos-api/ai/tests/test_cocolon_text_generation_core_emlis_evidence_adapter.py` | 共通文章生成基盤 / 三大中核境界の回帰・contract・boundary test |
| `mashos-api/ai/tests/test_cocolon_text_generation_core_emlis_observation_adapter.py` | 共通文章生成基盤 / 三大中核境界の回帰・contract・boundary test |
| `mashos-api/ai/tests/test_cocolon_text_generation_core_evidence.py` | 共通文章生成基盤 / 三大中核境界の回帰・contract・boundary test |
| `mashos-api/ai/tests/test_cocolon_text_generation_core_guard_emlis_comparison.py` | 共通文章生成基盤 / 三大中核境界の回帰・contract・boundary test |
| `mashos-api/ai/tests/test_cocolon_text_generation_core_guards.py` | 共通文章生成基盤 / 三大中核境界の回帰・contract・boundary test |
| `mashos-api/ai/tests/test_cocolon_text_generation_core_phase14_final_boundary.py` | 共通文章生成基盤 / 三大中核境界の回帰・contract・boundary test |
| `mashos-api/ai/tests/test_cocolon_text_generation_core_piece_composer.py` | 共通文章生成基盤 / 三大中核境界の回帰・contract・boundary test |
| `mashos-api/ai/tests/test_cocolon_text_generation_core_piece_input_contract.py` | 共通文章生成基盤 / 三大中核境界の回帰・contract・boundary test |
| `mashos-api/ai/tests/test_cocolon_text_generation_core_types.py` | 共通文章生成基盤 / 三大中核境界の回帰・contract・boundary test |
| `mashos-api/ai/tests/test_cocolon_text_generation_phrase_units.py` | 共通文章生成基盤 / 三大中核境界の回帰・contract・boundary test |
