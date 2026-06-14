---
doc_id: cocolon_current_snapshot_diff
title: "Cocolon 最新スナップショット差分"
revision_date: "2026-06-14"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
source_snapshot:
  premise: "Cocolon_前提資料(216).zip"
  Cocolon: "Cocolon(232).zip"
  mashos-api: "mashos-api_9(38).zip"
file_counts:
  Cocolon: 217
  mashos-api: 1012
  total: 1229
purpose: "最新zipから見えるCocolonの構造差分を、華恋の作業用地図として固定する"
---

# 1. 今回の基準面

この版は、次のzipを最新基準にします。

| source | count | 差分 |
|---|---:|---|
| `Cocolon(232).zip` | 217 | Cocolon側は今回差分対象外。production RN UI、RN表示タイトル、RN表示条件、public response shapeの変更なしとして読む。 |
| `mashos-api_9(38).zip` | 1012 | P7-HOLD-004 Step5 Candidate Gate Preservation Red Classification R0〜R12成果物を含む最新backend。 |
| total | 1229 | Step5 display-binding red classification、target/subset validation、implementation result document、full backend suite未確認保持までのcoverage対象。 |

この資料は、作業記録ではなく、**最新アプリ構造の読み方**を固定するための差分資料です。2026-06-14時点の最新正本は末尾の `2026-06-14 差分追記: EmlisAI P7-HOLD-004 Step5 Candidate Gate Preservation R0〜R12 latest snapshot diff` とこの冒頭summaryです。P7-HOLD-004はPositive Public Shape target greenの後に、Step5 display-binding red classification / target subset green / implementation result doc作成まで進んだが、full backend suite green、P7 complete、P8 start、release_allowedはいずれも未成立です。

# 2. Cocolon側の2026-05-12差分履歴

`Cocolon_6(29).zip` 時点では、RN側にこころ天気の表示componentが4件追加され、Analysis表示・ガイド・チュートリアル・サブスク文言・screen contractが更新されていました。2026-05-13時点の旧レポート非表示差分は末尾の最新sectionを優先します。

## 2-1. 追加ファイル

| file | 構造上の意味 |
|---|---|
| `Cocolon/screens/analysisReport/KokoroWeatherCurrentCard.js` | Analysisトップの「今のこころ天気」カード |
| `Cocolon/screens/analysisReport/KokoroWeatherForecastStrip.js` | レポート内の天気図風横並びUI |
| `Cocolon/screens/analysisReport/KokoroWeatherDetailModal.js` | 対象日/週の時間帯別詳細Modal |
| `Cocolon/screens/analysisReport/kokoroWeatherFormatters.js` | こころ天気payloadと表示文言のnormalize |

## 2-2. 変更ファイル

| 区分 | 件数 | 最新構造 |
|---|---:|---|
| Analysis Top / route state | 3 | `AnalysisContentFirstScreen.js`、`AnalysisScreen.js`、`useAnalysisReportActions.js` が `current_weather` を受け取り表示する |
| Report UI / access copy | 3 | `AnalysisReportViewerScreen.js`、`analysisReportAccessPolicy.js`、`AnalysisReportHistoryScreen.js` が `kokoroWeather` とこころ天気表示名に対応する |
| Menu / labels / tutorial | 4 | `AnalysisEmotionScreen.js`、`analysisRouteModel.js`、`useAnalysisTutorialOverlay.js`、`tutorialScenarioData.js` をこころ天気表示へ更新する |
| Guide / plan / fixture / test | 5 | `guide/*`、`iapRuntimeCatalog.js`、`tutorialFixtures.generated.json`、`rn-screen-contracts.test.js` を更新する |

# 3. API側の2026-05-12差分履歴

`mashos-api_6(13).zip` 時点では、こころ天気生成serviceとQA testが追加され、Analysis read/report/push/subscription copyが更新されていました。2026-05-13時点のready/detail/unread filter差分は末尾の最新sectionを優先します。

## 3-1. 追加ファイル

| file | 構造上の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/kokoro_weather_service.py` | current_weather / report kokoroWeather / time_buckets / observation_memo / こころ温度の生成service |
| `mashos-api/ai/tests/test_kokoro_weather_service.py` | service単体test |
| `mashos-api/ai/tests/test_analysis_home_summary_current_weather.py` | `/analysis/home-summary.current_weather` additive field test |
| `mashos-api/ai/tests/test_analysis_report_kokoro_weather.py` | `content_json.kokoroWeather` report generation test |
| `mashos-api/ai/tests/test_kokoro_weather_phase6_qa.py` | 非未来予測・非注意報・非良悪判定・自己分析非対象・tier/old report互換QA test |

## 3-2. 変更ファイル

| file | 最新構造 |
|---|---|
| `mashos-api/ai/services/ai_inference/api_analysis_reads.py` | `current_weather` を `/analysis/home-summary` にadditive追加 |
| `mashos-api/ai/services/ai_inference/api_analysis_reports.py` | `content_json.kokoroWeather` を日/週/月レポートへadditive追加し、タイトルをこころ天気表示へ更新 |
| `mashos-api/ai/services/ai_inference/api_cron_distribution.py` | 感情分析レポート配布Push copyをこころ天気表示へ更新 |
| `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py` | backend subscription plan copyをこころ天気基準へ同期 |

# 4. 2026-05-12 coverage履歴

このsectionのcoverageは、こころ天気差分時点の履歴です。最新coverageは冒頭summaryと末尾の `2026-05-13 差分追記: わたしマップ実装 snapshot差分` を優先します。

| coverage | count |
|---|---:|
| Cocolon | 204 |
| mashos-api | 419 |
| total | 623 |

# 5. 前提資料としての変更

| file | 変更理由 |
|---|---|
| `00_karen_read_first.md` | 最新基準面を `Cocolon_6(29).zip` / `mashos-api_6(13).zip` へ更新し、こころ天気current boundaryを追記 |
| `01_cocolon_overall_structure.md` | こころ天気導入後の全体構造とcoverageを追記 |
| `01B_cocolon_overall_structure_analysis_piece_emotionlog_ranking.md` | Analysis感情分析のこころ天気 RN / Backend ownerを追記 |
| `01C_cocolon_overall_structure_account_subscription_backend_support.md` | こころ天気copy / subscription boundaryを追記 |
| `02_cocolon_national_system.md` | こころ天気のRead API / Report payload / RN display flowを追記 |
| `02B_cocolon_national_system_snapshot_worker_publish_read.md` | current_weather / kokoroWeather のpublish/read boundaryを追記 |
| `02C_cocolon_contract_boundary_validation.md` | こころ天気contract / QA boundaryを追記 |
| `03_cocolon_naming_system.md` | こころ天気 visible名と internal key / payload名の読み分けを追記 |
| `05_cocolon_rule_file_index.md` | こころ天気 rule / guard / test索引を追記 |
| `07_latest_snapshot_diff.md` | 最新実ファイル差分と追加/変更pathを反映 |
| `09_Cocolon_名称混在保管と構造境界_2026-05-10.md` | こころ天気名称混在境界を追記 |
| `manifest.json` | 最新snapshot、coverage、追加path、境界維持を反映 |

# 6. この差分で扱わないもの

この資料はタスク表ではないため、次の項目を「残タスク」として管理しません。  
必要になった時は、該当する構造資料を読んで判断します。

- DB physical rename / drop
- DB write path switch
- public API route rename
- existing response key rename
- RN画面導線追加
- 外部AI導入
- 旧名称APIファイル削除
- JSON一括置換
- product analytics実装

# 7. 作業時の結論

最新の前提資料は、次の目的で使います。

- Cocolonの全体構造を読む。
- 国家システムを読む。
- こころ天気はAnalysisの感情分析側の表示・要約拡張として読み、自己分析・Piece・EmlisAIへ広げない。
- DBや名称混在を読み間違えない。
- 旧名称を見つけても、資料で保管されている互換・DB境界ならrenameしない。
- 修正対象は、稼働・契約・データ保護に影響する箇所だけに限定する。


# 2026-05-05 差分追記: current snapshot差分

## Cocolon側で現行資料に追加するファイル

| file | 構造上の意味 |
|---|---|
| `Cocolon/app.json` | RN app display metadata。displayNameは `Emlis` |
| `Cocolon/package.json` / `Cocolon/package-lock.json` | RN dependency / script / build boundary |
| `Cocolon/screens/TutorialFlowScreen.js` | Tutorial後半の独立flow screen。Input / Piece stackから到達する |
| `Cocolon/tutorial/tutorialScenarioData.js` | Tutorial fixture reader / fallback sample owner |
| `Cocolon/tutorial/generated/tutorialFixtures.generated.json` | Tutorial表示用の生成済みfixture |

## mashos-api側で現行資料に追加するファイル

| file | 構造上の意味 |
|---|---|
| `mashos-api/scripts/generate_tutorial_fixtures.py` | 実generation serviceからtutorial fixtureを作る保守script |
| `emlis_ai_user_word_anchor_service.py` | current inputからuser word anchorを抽出 |
| `emlis_ai_phrase_shaping_service.py` | raw phraseを会話文に安全な形へ整形 |
| `emlis_ai_input_meaning_block_service.py` | 汎用意味ブロック抽出 |
| `emlis_ai_understanding_frame_service.py` | 理解frame構築 |
| `emlis_ai_response_composition_service.py` | 返答構成計画 |
| `emlis_ai_reply_final_review_service.py` | 返答前final review |
| `emlis_ai_safe_reply_fallback_service.py` | Gate fail時のsafe fallback |
| `test_emlis_ai_*` 追加群 | EmlisAI汎用pipeline / Gate / composition regression |
| `test_emotion_piece_generation_*` 追加群 | Piece communicative core regression |

## 既存構造の現状補正

- EmlisAIは、例文特化コードではなく、`読解 -> 意味分解 -> 構成 -> 自然文生成 -> 最終品質確認` の汎用pipelineとして扱う。
- Pieceは、カテゴリ一般質問への過圧縮ではなく、入力全体の核を他者に伝わる一問一答へ整える。
- Tutorial fixtureはruntime生成ではなく、生成済み表示fixtureとして扱う。
- Subscription plan copyは `iapRuntimeCatalog.js` / `SubscriptionSelectScreen.js` / `subscription_bootstrap_store.py` の3箇所を同時確認する。


# 2026-05-07 差分追記: value observation current snapshot差分

## Cocolon側で現行資料に追加するファイル

| file | 構造上の意味 |
|---|---|
| `Cocolon/.github/workflows/ios-build.yml` | iOS build確認用GitHub Actions workflow。runtimeではなくrepo supportとして扱う |
| `Cocolon/.github/workflows/phase6_contract_guards.yml` | Phase6 contract guard用GitHub Actions workflow。public contract / 三大中核構造の破壊検出に関係する |

## mashos-api側で現行資料に追加するファイル

| file | 構造上の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/value_observation_types.py` | `ValueObservationSignal` / `ValueObservationPlan` / schema version を定義する共通型 |
| `mashos-api/ai/services/ai_inference/cocolon_value_observation_service.py` | 5つのvalue observation signalを固定文ではなく汎用ruleとして抽出するservice |
| `mashos-api/ai/services/ai_inference/emlis_context_anchor_service.py` | EmlisAIへcross-core contextを渡すanchor境界。value observationを人格断定として扱わない |
| `mashos-api/ai/tests/test_cocolon_value_observation_service.py` | shared value observation serviceのsignal抽出test |
| `mashos-api/ai/tests/test_emlis_ai_value_observation_cases.py` | EmlisAIのvalue observation接続test |
| `mashos-api/ai/tests/test_emotion_piece_generation_value_observation.py` | Piece生成のvalue observation / overcompression防止test |
| `mashos-api/ai/tests/test_analysis_value_observation_boundary.py` | Analysis validity gateのvalue observation domain boundary test |

## 既存構造の現状補正

- EmlisAIは、value observation signalをworld model / observation candidate / meta / fallback / quality gateへadditive接続する。
- Pieceは、短縮要約ではなく、`must_keep_signal_keys` と `source_claims` を保持してユーザーの言いたい核を他者へ伝わる形に整える。
- Analysisは、value observationを単発の人格断定にせず、self_structure domain素材としてmaterial boundary内で扱う。
- `02B_cocolon_national_system_snapshot_worker_publish_read.md` と `08_cocolon_db_rename_boundary.md` は今回の前提資料zip内に存在するため、manifestのdocs listにも残し、それぞれの構造境界の正本として扱う。


# 2026-05-09 差分追記: latest actual diff from previous received files

比較元は直前実ファイル `Cocolon(138).zip` の前段として受領済みの `Cocolon_2(43).zip` と、`mashos-api_2(26).zip` の前段として受領済みの `mashos-api_2(25).zip` です。比較先は `Cocolon(138).zip` / `mashos-api_2(26).zip` です。

## 追加ファイル

| file | 補正内容 |
|---|---|
| `mashos-api/ai/services/ai_inference/today_question_personal_candidate_service.py` | latest実ファイルで新規追加。前提資料coverageへ追記 |
| `mashos-api/ai/services/ai_inference/today_question_personal_question_service.py` | latest実ファイルで新規追加。前提資料coverageへ追記 |
| `mashos-api/ai/services/ai_inference/today_question_personal_templates.py` | latest実ファイルで新規追加。前提資料coverageへ追記 |

## 変更ファイル

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

## 削除ファイル

| file | 補正内容 |
|---|---|
| `0件` | 差分なし |


## 前提資料coverage差分

### 前提資料全体で未記載だった最新path
| file | 補正内容 |
|---|---|
| `mashos-api/ai/services/ai_inference/today_question_personal_candidate_service.py` | 前提資料全体coverage補正。最新実ファイルとして明示 |
| `mashos-api/ai/services/ai_inference/today_question_personal_question_service.py` | 前提資料全体coverage補正。最新実ファイルとして明示 |
| `mashos-api/ai/services/ai_inference/today_question_personal_templates.py` | 前提資料全体coverage補正。最新実ファイルとして明示 |
| `mashos-api/ai/tests/test_emlis_ai_composition_transition_guard.py` | 前提資料全体coverage補正。最新実ファイルとして明示 |
| `mashos-api/ai/tests/test_emlis_ai_long_input_depth_reply.py` | 前提資料全体coverage補正。最新実ファイルとして明示 |
| `mashos-api/ai/tests/test_emlis_ai_observation_kernel_companion_language.py` | 前提資料全体coverage補正。最新実ファイルとして明示 |
| `mashos-api/ai/tests/test_emlis_ai_phrase_grammar_guard.py` | 前提資料全体coverage補正。最新実ファイルとして明示 |
| `mashos-api/ai/tests/test_emlis_ai_response_composition_self_sacrifice.py` | 前提資料全体coverage補正。最新実ファイルとして明示 |
| `mashos-api/ai/tests/test_emlis_ai_self_and_others_happiness_reply.py` | 前提資料全体coverage補正。最新実ファイルとして明示 |
| `mashos-api/ai/tests/test_emlis_ai_whole_input_meaning_arc_service.py` | 前提資料全体coverage補正。最新実ファイルとして明示 |
| `mashos-api/ai/tests/test_subscription_projection.py` | 前提資料全体coverage補正。最新実ファイルとして明示 |

### 01系で未記載だった最新path
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

### 02系で未記載だった最新path
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


## SQL差分

`today_question_personal_followup_v1.sql` は別ファイルとして受領され、ユーザー確認でSQL実行済みです。内容は `today_question_personal_candidates` / `today_question_personal_questions` の追加、`today_question_answers` への `question_origin` / `personal_question_id` / `source_type` / `source_id` / `source_field` / `anchor_text` / `question_type` / `source_anchor_snapshot_json` 追加、personal回答用の `question_id` nullable化、index/FK追加です。

# 2026-05-09 差分追記: GitHub正本の再現性確認

ローカル受領zipでは容量都合によりnative project / config / support scriptが省かれる場合があるため、再現性判断はGitHub上の `MassyuRed/Cocolon` 正本を併せて確認する。

| 確認項目 | GitHub上の状態 | 前提資料での扱い |
|---|---|---|
| `Cocolon/scripts/postinstall.js` | 存在。stale patchを退避して `patch-package` を実行する処理あり | `package.json` の `postinstall` scriptはGitHub正本で対応fileあり。ローカルzip欠落のみで再現性欠落扱いにしない |
| `Cocolon/scripts/reset-project.js` | 存在。`package.json` の `reset-project` script に対応するfileあり | support scriptとしてGitHub正本を確認先にする |
| `Cocolon/android/app/build.gradle` | 存在。release signing、Hermes、minify、16KB/flexible page size対応の設定あり | Android native release構成はGitHub正本に存在する |
| `Cocolon/ios/Podfile` | 存在。iOS 15.1、static frameworks、Firebase static framework、CI archive向け署名抑制処理あり | iOS native dependency構成はGitHub正本に存在する |
| `Cocolon/babel.config.js` | 存在。React Native babel preset と Reanimated plugin 設定あり | Metro/Babel構成はGitHub正本に存在する |
| `Cocolon/metro.config.js` | 存在。SVG transformer設定あり | SVG asset build構成はGitHub正本に存在する |
| `Cocolon/eslint.config.js` | 存在。Expo ESLint flat configあり | lint構成はGitHub正本に存在する |
| `Cocolon/tsconfig.json` | 存在。`strict: true` 設定あり | TypeScript設定はGitHub正本に存在する |
| `Cocolon/.github/workflows/ios-build.yml` | 存在。checkout、Pod install、署名、archive、export、TestFlight uploadまであり | TestFlight build workflowはGitHub正本に存在する |

結論: 2026-05-09時点の「再現できるソース」評価では、ローカルzipだけを根拠にnative/config/support script欠落と判断しない。GitHub正本に上記構成が存在するため、前提資料上はrelease reproducibility boundary確認済みとして扱う。



# 2026-05-09 差分追記: current参照の実ファイル再照合結果

照合対象: `Cocolon_前提資料(48).zip` / `Cocolon(138).zip` / `mashos-api_2(26).zip`。

- Cocolon実ファイル: `125`件。GitHub正本で確認済みのnative/config/support scriptは、ローカル軽量zip未収録でも欠落扱いにしない。
- mashos-api実ファイル: `340`件。
- `01` coverageでは Piece long input / self-and-others happiness test 2件を補正追記。
- `02` coverageでは EmlisAI current-input grounding / meaning block / phrase shaping / pre-return quality gate / final review / response composition と Piece long input 系test 8件を補正追記。
- 旧MyWeb / MyModel / Echoes / Discoveries / EmotionReflection系の旧file sectionは、実ファイルに存在しない場合 `retired-current-reference` として読む。current ownerは `01A` / `01B` / `01C` / `02A` / `02B` / `02C` の末尾補正表を優先する。

# 2026-05-09 差分追記: `Cocolon_12(3).zip` / `mashos-api_4(10).zip` current snapshot差分

この差分は、`Cocolon(138).zip` / `mashos-api_2(26).zip` から `Cocolon_12(3).zip` / `mashos-api_4(10).zip` への実ファイル差分です。前提資料 `Cocolon_前提資料(51).zip` はこのcurrent snapshotを現行基準として読む。

| source | previous | current | added | changed | removed |
|---|---|---|---:|---:|---:|
| Cocolon | `Cocolon(138).zip` | `Cocolon_12(3).zip` | 75 | 9 | 0 |
| mashos-api | `mashos-api_2(26).zip` | `mashos-api_4(10).zip` | 2 | 3 | 0 |

## Cocolon added files

| path | 補正内容 |
|---|---|
| Cocolon/components/GlobalFrameLayout.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/lib/monitoring.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/navigation/AnalysisStackNavigator.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/navigation/InputStackNavigator.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/navigation/MainTabs.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/navigation/PieceStackNavigator.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/navigation/RankingStackNavigator.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/navigation/RootNavigator.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/navigation/SettingsStackNavigator.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/navigation/linkingRuntime.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/navigation/navigationConstants.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/navigation/navigationRef.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/navigation/notificationRouting.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/runtime/AppRuntimeBlockingScreen.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/runtime/AppRuntimeBootstrapGate.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/account/AccountIdSearchSection.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/account/AccountNameEditModal.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/account/AccountProfileSection.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/account/AccountStatusSection.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/account/AccountVisibilitySection.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/account/accountModel.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/account/useAccountFollowState.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/account/useAccountIdSearch.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/account/useAccountProfile.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/account/useAccountSubscription.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/account/useAccountVisibility.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/analysis/analysisRouteModel.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/analysis/useAnalysisReportActions.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/analysis/useAnalysisRouteState.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/analysis/useAnalysisSelfStructureActions.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/analysis/useAnalysisTutorialOverlay.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/analysis/useAnalysisUnreadBadges.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/analysisReport/AnalysisReportCharts.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/analysisReport/AnalysisReportUpgradeCard.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/analysisReport/analysisReportAccessPolicy.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/analysisReport/analysisReportConstants.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/analysisReport/analysisReportFormatters.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/analysisReport/analysisReportHtmlExport.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/analysisReport/analysisReportNormalize.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/input/InputActionArea.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/input/InputCategorySection.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/input/InputEmotionSection.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/input/InputFeedbackReplyModal.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/input/InputMemoSection.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/input/InputPiecePreviewController.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/input/InputStartupModals.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/input/InputToastOverlay.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/input/inputDraftModel.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/input/inputFeedbackModel.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/input/inputLayoutModel.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/input/inputNoticeModel.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/input/inputOptions.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/input/useInputDraftPersistence.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/input/useInputFeedbackModal.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/input/useInputKeyboardAwareMemo.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/nexus/NexusEmotionLogSection.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/nexus/NexusHeader.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/nexus/NexusHistorySection.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/nexus/NexusOwnerPickerModal.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/nexus/NexusPieceFeedSection.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/nexus/NexusRecommendSection.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/nexus/NexusTabBar.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/nexus/NexusTodayEmotionSummary.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/nexus/nexusConstants.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/nexus/nexusHistoryModel.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/nexus/nexusNormalize.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/nexus/nexusRouteModel.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/piece/PieceHomeActionCard.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/piece/PieceHomeMainActions.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/piece/PieceRecommendModal.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/piece/PieceTutorialCreateModal.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/piece/usePieceHomeGlobalSummary.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/piece/usePieceHomeTutorial.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/screens/piece/usePieceRecommendUsers.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |
| Cocolon/tests/rn-screen-contracts.test.js | RN巨大画面分割 / App.js分割 / 本番運用監視による追加 |

## Cocolon changed files

| path | 補正内容 |
|---|---|
| Cocolon/App.js | entry shell化、screen split接続、監視接続、またはnpm test script追加による変更 |
| Cocolon/lib/apiClient.js | entry shell化、screen split接続、監視接続、またはnpm test script追加による変更 |
| Cocolon/package.json | entry shell化、screen split接続、監視接続、またはnpm test script追加による変更 |
| Cocolon/screens/AccountScreen.js | entry shell化、screen split接続、監視接続、またはnpm test script追加による変更 |
| Cocolon/screens/AnalysisReportViewerScreen.js | entry shell化、screen split接続、監視接続、またはnpm test script追加による変更 |
| Cocolon/screens/AnalysisScreen.js | entry shell化、screen split接続、監視接続、またはnpm test script追加による変更 |
| Cocolon/screens/InputScreen.js | entry shell化、screen split接続、監視接続、またはnpm test script追加による変更 |
| Cocolon/screens/NexusScreen.js | entry shell化、screen split接続、監視接続、またはnpm test script追加による変更 |
| Cocolon/screens/PieceScreen.js | entry shell化、screen split接続、監視接続、またはnpm test script追加による変更 |

## mashos-api added files

| path | 補正内容 |
|---|---|
| mashos-api/ai/services/ai_inference/api_client_events.py | 本番運用監視 `/ops/client-events` 追加 |
| mashos-api/ai/tests/contract/test_client_events_contract.py | 本番運用監視 `/ops/client-events` 追加 |

## mashos-api changed files

| path | 補正内容 |
|---|---|
| mashos-api/ai/docs/PUBLIC_API_REGISTRY.md | 監視endpoint登録 / public contract registry / docs更新 |
| mashos-api/ai/services/ai_inference/api_contract_registry.py | 監視endpoint登録 / public contract registry / docs更新 |
| mashos-api/ai/services/ai_inference/app.py | 監視endpoint登録 / public contract registry / docs更新 |

## current boundary notes

- `Cocolon/screens/PieceLibraryScreen.js` は今回のcurrent snapshotでも未分割です。Phase 3は別工程として扱う。
- `Cocolon/App.js` は薄いentry shellになり、navigation/runtime配下がroot navigationとruntime gateのcurrent ownerです。
- `mashos-api/ai/services/ai_inference/api_client_events.py` はDB保存を行わない監視endpointです。privacy-safe structured log / alert logのみを扱う。

# 2026-05-09 差分追記: `Cocolon_12(3).zip` / `mashos-api_4(10).zip` current差分

照合基準: 前回資料基準 `Cocolon(138).zip` / `mashos-api_2(26).zip` から、現状実ファイル `Cocolon_12(3).zip` / `mashos-api_4(10).zip` への差分です。

| source | previous count | current count | added | changed | removed |
|---|---:|---:|---:|---:|---:|
| Cocolon | 125 | 200 | 75 | 9 | 0 |
| mashos-api | 340 | 342 | 2 | 3 | 0 |
| total | 465 | 542 | 77 | 12 | 0 |

## Cocolon 追加path

| file | 読み方 |
|---|---|
| `Cocolon/components/GlobalFrameLayout.js` | App.js分割component。global frame layout owner |
| `Cocolon/lib/monitoring.js` | RN本番運用監視client |
| `Cocolon/navigation/AnalysisStackNavigator.js` | App.js分割module。root navigation / stack / push / linking owner |
| `Cocolon/navigation/InputStackNavigator.js` | App.js分割module。root navigation / stack / push / linking owner |
| `Cocolon/navigation/MainTabs.js` | App.js分割module。root navigation / stack / push / linking owner |
| `Cocolon/navigation/PieceStackNavigator.js` | App.js分割module。root navigation / stack / push / linking owner |
| `Cocolon/navigation/RankingStackNavigator.js` | App.js分割module。root navigation / stack / push / linking owner |
| `Cocolon/navigation/RootNavigator.js` | App.js分割module。root navigation / stack / push / linking owner |
| `Cocolon/navigation/SettingsStackNavigator.js` | App.js分割module。root navigation / stack / push / linking owner |
| `Cocolon/navigation/linkingRuntime.js` | App.js分割module。root navigation / stack / push / linking owner |
| `Cocolon/navigation/navigationConstants.js` | App.js分割module。root navigation / stack / push / linking owner |
| `Cocolon/navigation/navigationRef.js` | App.js分割module。root navigation / stack / push / linking owner |
| `Cocolon/navigation/notificationRouting.js` | App.js分割module。root navigation / stack / push / linking owner |
| `Cocolon/runtime/AppRuntimeBlockingScreen.js` | App.js分割module。runtime bootstrap / version gate owner |
| `Cocolon/runtime/AppRuntimeBootstrapGate.js` | App.js分割module。runtime bootstrap / version gate owner |
| `Cocolon/screens/account/AccountIdSearchSection.js` | AccountScreen分割module。profile/follow/visibility/subscription/search内部owner |
| `Cocolon/screens/account/AccountNameEditModal.js` | AccountScreen分割module。profile/follow/visibility/subscription/search内部owner |
| `Cocolon/screens/account/AccountProfileSection.js` | AccountScreen分割module。profile/follow/visibility/subscription/search内部owner |
| `Cocolon/screens/account/AccountStatusSection.js` | AccountScreen分割module。profile/follow/visibility/subscription/search内部owner |
| `Cocolon/screens/account/AccountVisibilitySection.js` | AccountScreen分割module。profile/follow/visibility/subscription/search内部owner |
| `Cocolon/screens/account/accountModel.js` | AccountScreen分割module。profile/follow/visibility/subscription/search内部owner |
| `Cocolon/screens/account/useAccountFollowState.js` | AccountScreen分割module。profile/follow/visibility/subscription/search内部owner |
| `Cocolon/screens/account/useAccountIdSearch.js` | AccountScreen分割module。profile/follow/visibility/subscription/search内部owner |
| `Cocolon/screens/account/useAccountProfile.js` | AccountScreen分割module。profile/follow/visibility/subscription/search内部owner |
| `Cocolon/screens/account/useAccountSubscription.js` | AccountScreen分割module。profile/follow/visibility/subscription/search内部owner |
| `Cocolon/screens/account/useAccountVisibility.js` | AccountScreen分割module。profile/follow/visibility/subscription/search内部owner |
| `Cocolon/screens/analysis/analysisRouteModel.js` | AnalysisScreen分割module。route/unread/report/self-structure/tutorial内部owner |
| `Cocolon/screens/analysis/useAnalysisReportActions.js` | AnalysisScreen分割module。route/unread/report/self-structure/tutorial内部owner |
| `Cocolon/screens/analysis/useAnalysisRouteState.js` | AnalysisScreen分割module。route/unread/report/self-structure/tutorial内部owner |
| `Cocolon/screens/analysis/useAnalysisSelfStructureActions.js` | AnalysisScreen分割module。route/unread/report/self-structure/tutorial内部owner |
| `Cocolon/screens/analysis/useAnalysisTutorialOverlay.js` | AnalysisScreen分割module。route/unread/report/self-structure/tutorial内部owner |
| `Cocolon/screens/analysis/useAnalysisUnreadBadges.js` | AnalysisScreen分割module。route/unread/report/self-structure/tutorial内部owner |
| `Cocolon/screens/analysisReport/AnalysisReportCharts.js` | AnalysisReportViewerScreen分割module。report表示/正規化/export内部owner |
| `Cocolon/screens/analysisReport/AnalysisReportUpgradeCard.js` | AnalysisReportViewerScreen分割module。report表示/正規化/export内部owner |
| `Cocolon/screens/analysisReport/analysisReportAccessPolicy.js` | AnalysisReportViewerScreen分割module。report表示/正規化/export内部owner |
| `Cocolon/screens/analysisReport/analysisReportConstants.js` | AnalysisReportViewerScreen分割module。report表示/正規化/export内部owner |
| `Cocolon/screens/analysisReport/analysisReportFormatters.js` | AnalysisReportViewerScreen分割module。report表示/正規化/export内部owner |
| `Cocolon/screens/analysisReport/analysisReportHtmlExport.js` | AnalysisReportViewerScreen分割module。report表示/正規化/export内部owner |
| `Cocolon/screens/analysisReport/analysisReportNormalize.js` | AnalysisReportViewerScreen分割module。report表示/正規化/export内部owner |
| `Cocolon/screens/input/InputActionArea.js` | InputScreen分割module。Home/Input entry shellの内部owner |
| `Cocolon/screens/input/InputCategorySection.js` | InputScreen分割module。Home/Input entry shellの内部owner |
| `Cocolon/screens/input/InputEmotionSection.js` | InputScreen分割module。Home/Input entry shellの内部owner |
| `Cocolon/screens/input/InputFeedbackReplyModal.js` | InputScreen分割module。Home/Input entry shellの内部owner |
| `Cocolon/screens/input/InputMemoSection.js` | InputScreen分割module。Home/Input entry shellの内部owner |
| `Cocolon/screens/input/InputPiecePreviewController.js` | InputScreen分割module。Home/Input entry shellの内部owner |
| `Cocolon/screens/input/InputStartupModals.js` | InputScreen分割module。Home/Input entry shellの内部owner |
| `Cocolon/screens/input/InputToastOverlay.js` | InputScreen分割module。Home/Input entry shellの内部owner |
| `Cocolon/screens/input/inputDraftModel.js` | InputScreen分割module。Home/Input entry shellの内部owner |
| `Cocolon/screens/input/inputFeedbackModel.js` | InputScreen分割module。Home/Input entry shellの内部owner |
| `Cocolon/screens/input/inputLayoutModel.js` | InputScreen分割module。Home/Input entry shellの内部owner |
| `Cocolon/screens/input/inputNoticeModel.js` | InputScreen分割module。Home/Input entry shellの内部owner |
| `Cocolon/screens/input/inputOptions.js` | InputScreen分割module。Home/Input entry shellの内部owner |
| `Cocolon/screens/input/useInputDraftPersistence.js` | InputScreen分割module。Home/Input entry shellの内部owner |
| `Cocolon/screens/input/useInputFeedbackModal.js` | InputScreen分割module。Home/Input entry shellの内部owner |
| `Cocolon/screens/input/useInputKeyboardAwareMemo.js` | InputScreen分割module。Home/Input entry shellの内部owner |
| `Cocolon/screens/nexus/NexusEmotionLogSection.js` | NexusScreen分割module。Piece/Nexus surfaceの内部owner |
| `Cocolon/screens/nexus/NexusHeader.js` | NexusScreen分割module。Piece/Nexus surfaceの内部owner |
| `Cocolon/screens/nexus/NexusHistorySection.js` | NexusScreen分割module。Piece/Nexus surfaceの内部owner |
| `Cocolon/screens/nexus/NexusOwnerPickerModal.js` | NexusScreen分割module。Piece/Nexus surfaceの内部owner |
| `Cocolon/screens/nexus/NexusPieceFeedSection.js` | NexusScreen分割module。Piece/Nexus surfaceの内部owner |
| `Cocolon/screens/nexus/NexusRecommendSection.js` | NexusScreen分割module。Piece/Nexus surfaceの内部owner |
| `Cocolon/screens/nexus/NexusTabBar.js` | NexusScreen分割module。Piece/Nexus surfaceの内部owner |
| `Cocolon/screens/nexus/NexusTodayEmotionSummary.js` | NexusScreen分割module。Piece/Nexus surfaceの内部owner |
| `Cocolon/screens/nexus/nexusConstants.js` | NexusScreen分割module。Piece/Nexus surfaceの内部owner |
| `Cocolon/screens/nexus/nexusHistoryModel.js` | NexusScreen分割module。Piece/Nexus surfaceの内部owner |
| `Cocolon/screens/nexus/nexusNormalize.js` | NexusScreen分割module。Piece/Nexus surfaceの内部owner |
| `Cocolon/screens/nexus/nexusRouteModel.js` | NexusScreen分割module。Piece/Nexus surfaceの内部owner |
| `Cocolon/screens/piece/PieceHomeActionCard.js` | PieceScreen分割module。home/tutorial/recommend内部owner |
| `Cocolon/screens/piece/PieceHomeMainActions.js` | PieceScreen分割module。home/tutorial/recommend内部owner |
| `Cocolon/screens/piece/PieceRecommendModal.js` | PieceScreen分割module。home/tutorial/recommend内部owner |
| `Cocolon/screens/piece/PieceTutorialCreateModal.js` | PieceScreen分割module。home/tutorial/recommend内部owner |
| `Cocolon/screens/piece/usePieceHomeGlobalSummary.js` | PieceScreen分割module。home/tutorial/recommend内部owner |
| `Cocolon/screens/piece/usePieceHomeTutorial.js` | PieceScreen分割module。home/tutorial/recommend内部owner |
| `Cocolon/screens/piece/usePieceRecommendUsers.js` | PieceScreen分割module。home/tutorial/recommend内部owner |
| `Cocolon/tests/rn-screen-contracts.test.js` | RN screen split contract guard |

## Cocolon 変更path

| file | 読み方 |
|---|---|
| `Cocolon/App.js` | entry shell / API client / package script更新。route名・API契約は維持 |
| `Cocolon/lib/apiClient.js` | entry shell / API client / package script更新。route名・API契約は維持 |
| `Cocolon/package.json` | entry shell / API client / package script更新。route名・API契約は維持 |
| `Cocolon/screens/AccountScreen.js` | entry shell / API client / package script更新。route名・API契約は維持 |
| `Cocolon/screens/AnalysisReportViewerScreen.js` | entry shell / API client / package script更新。route名・API契約は維持 |
| `Cocolon/screens/AnalysisScreen.js` | entry shell / API client / package script更新。route名・API契約は維持 |
| `Cocolon/screens/InputScreen.js` | entry shell / API client / package script更新。route名・API契約は維持 |
| `Cocolon/screens/NexusScreen.js` | entry shell / API client / package script更新。route名・API契約は維持 |
| `Cocolon/screens/PieceScreen.js` | entry shell / API client / package script更新。route名・API契約は維持 |

## mashos-api 追加path

| file | 読み方 |
|---|---|
| `mashos-api/ai/services/ai_inference/api_client_events.py` | 本番運用監視endpoint `/ops/client-events` owner |
| `mashos-api/ai/tests/contract/test_client_events_contract.py` | client event contract / redaction regression |

## mashos-api 変更path

| file | 読み方 |
|---|---|
| `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md` | client events route / public contract / registry更新 |
| `mashos-api/ai/services/ai_inference/api_contract_registry.py` | client events route / public contract / registry更新 |
| `mashos-api/ai/services/ai_inference/app.py` | client events route / public contract / registry更新 |

## 読み方

- RN巨大画面分割で追加されたsubdirectory fileは、新機能ではなく旧entry shellの内部ownerとして読む。
- `PieceLibraryScreen.js` はこのcurrent基準では未分割のcurrent ownerとして残る。
- `POST /ops/client-events` は本番運用監視のops endpoint。DB write pathや公開content flowとは別境界。
- removed fileは0件のため、今回の前提資料更新では既存entry shellの削除は扱わない。

# 2026-05-09 差分追記: EmlisAI multi-perspective latest actual diff

比較元は直前実ファイル `Cocolon_5(18).zip` / `mashos-api_5(12).zip`、比較先は `Cocolon_6(28).zip` / `mashos-api_6(8).zip` です。

| source | previous count | current count | 差分 |
|---|---:|---:|---|
| Cocolon | 200 | 200 | 追加0 / 削除0 / 変更3 |
| mashos-api | 345 | 356 | 追加11 / 削除0 / 変更15 |
| total | 545 | 556 | 追加11 / 削除0 / 変更18 |

## Cocolon 変更path

| file | 読み方 |
|---|---|
| `Cocolon/screens/InputScreen.js` | Emlis観測の表示可否・`observation_status` 連携を更新 |
| `Cocolon/screens/input/InputFeedbackReplyModal.js` | Emlis観測の表示可否・`observation_status` 連携を更新 |
| `Cocolon/screens/input/useInputFeedbackModal.js` | Emlis観測の表示可否・`observation_status` 連携を更新 |

## mashos-api 追加path

| file | 読み方 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_conversation_composer_service.py` | EmlisAI multi-perspective observation pipelineの追加owner |
| `mashos-api/ai/services/ai_inference/emlis_ai_display_gate.py` | EmlisAI multi-perspective observation pipelineの追加owner |
| `mashos-api/ai/services/ai_inference/emlis_ai_evidence_ledger_service.py` | EmlisAI multi-perspective observation pipelineの追加owner |
| `mashos-api/ai/services/ai_inference/emlis_ai_grounding_judge.py` | EmlisAI multi-perspective observation pipelineの追加owner |
| `mashos-api/ai/services/ai_inference/emlis_ai_listener_reader_judge.py` | EmlisAI multi-perspective observation pipelineの追加owner |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_integrator_service.py` | EmlisAI multi-perspective observation pipelineの追加owner |
| `mashos-api/ai/services/ai_inference/emlis_ai_perspective_board.py` | EmlisAI multi-perspective observation pipelineの追加owner |
| `mashos-api/ai/services/ai_inference/emlis_ai_perspective_observers.py` | EmlisAI multi-perspective observation pipelineの追加owner |
| `mashos-api/ai/services/ai_inference/emlis_ai_template_echo_guard.py` | EmlisAI multi-perspective observation pipelineの追加owner |
| `mashos-api/ai/tests/emlis_multi_perspective_test_helpers.py` | EmlisAI multi-perspective observation pipelineの追加owner |
| `mashos-api/ai/tests/test_emlis_ai_multi_perspective_pipeline.py` | EmlisAI multi-perspective observation pipelineの追加owner |

## mashos-api 変更path

| file | 読み方 |
|---|---|
| `mashos-api/ai/services/ai_inference/api_emotion_submit.py` | EmlisAI multi-perspective / fail-closed / contract testに合わせて更新 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_frame_service.py` | EmlisAI multi-perspective / fail-closed / contract testに合わせて更新 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_kernel.py` | EmlisAI multi-perspective / fail-closed / contract testに合わせて更新 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | EmlisAI multi-perspective / fail-closed / contract testに合わせて更新 |
| `mashos-api/ai/services/ai_inference/emlis_ai_safe_reply_fallback_service.py` | EmlisAI multi-perspective / fail-closed / contract testに合わせて更新 |
| `mashos-api/ai/services/ai_inference/emlis_ai_types.py` | EmlisAI multi-perspective / fail-closed / contract testに合わせて更新 |
| `mashos-api/ai/services/ai_inference/emotion_submit_service.py` | EmlisAI multi-perspective / fail-closed / contract testに合わせて更新 |
| `mashos-api/ai/services/ai_inference/input_feedback_text_templates.py` | EmlisAI multi-perspective / fail-closed / contract testに合わせて更新 |
| `mashos-api/ai/tests/test_emlis_ai_long_input_depth_reply.py` | EmlisAI multi-perspective / fail-closed / contract testに合わせて更新 |
| `mashos-api/ai/tests/test_emlis_ai_observation_frame_service.py` | EmlisAI multi-perspective / fail-closed / contract testに合わせて更新 |
| `mashos-api/ai/tests/test_emlis_ai_observation_kernel.py` | EmlisAI multi-perspective / fail-closed / contract testに合わせて更新 |
| `mashos-api/ai/tests/test_emlis_ai_observation_kernel_companion_language.py` | EmlisAI multi-perspective / fail-closed / contract testに合わせて更新 |
| `mashos-api/ai/tests/test_emlis_ai_response_composition_self_sacrifice.py` | EmlisAI multi-perspective / fail-closed / contract testに合わせて更新 |
| `mashos-api/ai/tests/test_emlis_ai_self_and_others_happiness_reply.py` | EmlisAI multi-perspective / fail-closed / contract testに合わせて更新 |
| `mashos-api/ai/tests/test_emlis_ai_value_observation_cases.py` | EmlisAI multi-perspective / fail-closed / contract testに合わせて更新 |

## 読み方

- `emlis_ai_reply_service.py` は `multi_perspective_observation.v1` のorchestratorとして読む。
- `input_feedback.comment_text` は互換payload名として残るが、`observation_status=passed` の場合だけ本文を持つ。
- `observation_status` が `rejected` / `unavailable` / `safety_blocked` の場合、RNは `Emlisの観測` モーダルを表示しない。
- 旧 `input_feedback_text_templates.py` や `emlis_ai_safe_reply_fallback_service.py` は、今回のEmlis観測本文の固定fallbackとして扱わない。

# 2026-05-10 差分追記: Phase8 LimitedComposer実入力品質改善 actual diff

比較元は `Cocolon_8(5).zip` / `mashos-api_8(8).zip`、比較先は `Cocolon_8(6).zip` / `mashos-api_9(2).zip` です。Cocolon側は追加・削除・変更なし。mashos-api側は4件追加、7件変更です。

## Cocolon側 actual diff

| 種別 | file | 補正内容 |
|---|---|---|
| added | `0件` | 変更なし |
| changed | `0件` | 変更なし |
| removed | `0件` | 変更なし |

## mashos-api側 added

| file | 構造上の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_sentence_quality_guard.py` | Phase8本文品質Guard。感情ラベル単独行、未完了断片、汎用接続語尾を検出する |
| `mashos-api/ai/tests/fixtures/__init__.py` | Phase8 fixture package marker |
| `mashos-api/ai/tests/fixtures/emlis_ai_phase8_cases.py` | 7つの入力回帰ケース、期待profile、must_keep、禁止表面を保持する |
| `mashos-api/ai/tests/test_emlis_ai_phase8_real_input_quality.py` | Phase8実入力品質回帰test。正解文一致ではなく、profile / must_keep / forbidden surface / guard通過で検証する |

## mashos-api側 changed

| file | 最新構造 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_client.py` | EvidenceSpanを直接貼らず、`EmlisPhraseUnit` / `ObservationProfile` / `SentencePlan` を経由して本文候補を作る |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_observation_scope_service.py` | 実入力に近い関係性葛藤や現実逃避型をB案scopeとして扱えるよう補正する |
| `mashos-api/ai/services/ai_inference/emlis_ai_template_echo_guard.py` | Phase8 quality reportをTemplate/Echo Guardへ接続し、破綻表面をrejectする |
| `mashos-api/ai/services/ai_inference/emlis_ai_display_gate.py` | Phase8 quality reportをdisplay traceへ残す |
| `mashos-api/ai/services/ai_inference/emlis_ai_types.py` | Phase8 quality metaを保持できるよう型を拡張する |
| `mashos-api/ai/services/ai_inference/emlis_ai_evidence_ledger_service.py` | Phase8 profile判定・PhraseUnit化に必要な根拠span保持を補正する |
| `mashos-api/ai/services/ai_inference/emlis_ai_perspective_observers.py` | Phase8 profileに必要な観測claim / relation補助を追加する |

## 読み方

- Phase8は、B案をA案へ一気に拡張する工程ではありません。
- 実ユーザー入力レベルで出た破綻文を回帰ケース化し、意味が通る観測文へ引き上げる品質改善です。
- `InputFeedbackReplyModal.js` などRN側表示制御は変更していません。
- DB physical name、public API route、既存response keyは変更していません。


# 2026-05-11 差分追記: 共通文章生成基盤 current snapshot差分

比較元は前提資料内の旧基準面 `Cocolon(149).zip` / `mashos-api(65).zip`、比較先は `Cocolon_15(1).zip` / `mashos-api_15(2).zip`。Cocolon側は差分なし。mashos-api側のみ、共通文章生成基盤の実装完了差分が入っています。

| source | previous count | current count | added | changed | removed |
|---|---:|---:|---:|---:|---:|
| Cocolon | 200 | 200 | 0 | 0 | 0 |
| mashos-api | 374 | 414 | 40 | 11 | 0 |
| total | 574 | 614 | 40 | 11 | 0 |

## mashos-api 追加path

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

## mashos-api 変更path

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

## 構造補正

- `cocolon_text_generation_core` はDB/route/visible名ではなく、三大中核に共通する文章品質・根拠・安全の基盤である。
- EmlisAIは `input_feedback.comment_text` と passed-only表示を維持したまま、候補文を共通Coreで検査する。
- Pieceは `piece_text` と preview/publish同一性を維持したまま、問い/答えを共通Coreで検査する。
- Analysisは `content_json` / `standardReport` / `contentText` を維持したまま、非診断・非断定Gateを共通Coreで補強する。
- DB physical name、DB write path、public API route、既存response key、RN画面導線の変更はない。

## 確認結果

- `pytest --collect-only`: 332 tests collected
- 共通文章生成基盤 Phase2〜Phase14 周辺: 70 passed
- Emlis / Piece / Analysis 周辺回帰 + 三大中核contract: 96 passed
- Pydantic非推奨警告2件は既存警告であり、今回差分による失敗ではない。
- 全体pytestはこの差分更新作業では実行していない。

# 2026-05-12 差分追記: こころ天気 current snapshot差分

比較元は前提資料内の旧基準面 `Cocolon(151).zip` / `mashos-api(67).zip`、比較先は `Cocolon_6(29).zip` / `mashos-api_6(13).zip`。こころ天気導入Phase 0〜6の実装差分が入っています。

| source | previous count | current count | added | changed | removed |
|---|---:|---:|---:|---:|---:|
| Cocolon | 200 | 204 | 4 | 15 | 0 |
| mashos-api | 414 | 419 | 5 | 4 | 0 |
| total | 614 | 623 | 9 | 19 | 0 |

## Cocolon 追加path

| file | 構造上の意味 |
|---|---|
| `Cocolon/screens/analysisReport/KokoroWeatherCurrentCard.js` | Analysisトップの「今のこころ天気」カード。`current_weather` を表示し、無入力時は「今日はまだ観測がありません」と「前回のこころ天気を見る」を出す |
| `Cocolon/screens/analysisReport/KokoroWeatherForecastStrip.js` | レポート内の天気図風横並びUI。`content_json.kokoroWeather.items` を表示する |
| `Cocolon/screens/analysisReport/KokoroWeatherDetailModal.js` | 対象日/週の時間帯別こころ天気を横スクロールで表示するModal |
| `Cocolon/screens/analysisReport/kokoroWeatherFormatters.js` | `weather_key` / こころ温度 / 感情比率 / 観測メモ / fallback文言のnormalize |

## Cocolon 変更path

| file | 最新構造 |
|---|---|
| `Cocolon/screens/AnalysisContentFirstScreen.js` | Analysisトップに `KokoroWeatherCurrentCard` を追加し、感情分析タブを `こころ天気（日/週/月）` 表示へ更新 |
| `Cocolon/screens/analysis/useAnalysisReportActions.js` | `/analysis/home-summary` の `current_weather` を `entryMeta.currentWeather` へ保持 |
| `Cocolon/screens/AnalysisScreen.js` | CurrentCardの前回導線、latest report連携、Analysisトップへのprop受け渡しを追加 |
| `Cocolon/screens/AnalysisReportViewerScreen.js` | `content_json.kokoroWeather` が成立する場合のみForecastStripとDetailModalを表示。旧感情分析本文へのfallbackは2026-05-13差分で表示対象外へ更新 |
| `Cocolon/screens/AnalysisEmotionScreen.js` | 感情分析メニューの表示を `こころ天気（日/週/月）` に更新 |
| `Cocolon/screens/AnalysisReportHistoryScreen.js` | 履歴見出し・空表示・PDF/共有文言をこころ天気表示へ更新 |
| `Cocolon/screens/analysis/analysisRouteModel.js` | report type labelをこころ天気表示へ更新。内部typeは維持 |
| `Cocolon/screens/analysis/useAnalysisTutorialOverlay.js` | Tutorial overlayのAnalysis説明をこころ天気（日/週/月）へ更新 |
| `Cocolon/screens/analysisReport/analysisReportAccessPolicy.js` | Free/Plus/Premium向けのupgrade copyをこころ天気基準へ更新 |
| `Cocolon/guide/guidesJa.js` / `Cocolon/guide/termsJa.js` | 感情分析ガイド・用語をこころ天気の観測表現へ更新。自己分析説明は維持 |
| `Cocolon/lib/iap/iapRuntimeCatalog.js` | Plus/Premiumのplan copyをこころ天気の詳しい本文・深い観測へ更新。SKU等は維持 |
| `Cocolon/tutorial/tutorialScenarioData.js` / `tutorial/generated/tutorialFixtures.generated.json` | Tutorial表示名とfixtureに `kokoroWeather` 例を追加 |
| `Cocolon/tests/rn-screen-contracts.test.js` | こころ天気componentとAnalysis接続の回帰確認を追加 |

## mashos-api 追加path

| file | 構造上の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/kokoro_weather_service.py` | こころ天気生成service。current_weather、report kokoroWeather、時間帯bucket、観測メモ、温度表示を集約 |
| `mashos-api/ai/tests/test_kokoro_weather_service.py` | service単体のこころ温度、weather_key、観測メモ、no_observation回帰 |
| `mashos-api/ai/tests/test_analysis_home_summary_current_weather.py` | `/analysis/home-summary.current_weather` のadditive field回帰 |
| `mashos-api/ai/tests/test_analysis_report_kokoro_weather.py` | daily / weekly / monthly の `content_json.kokoroWeather` 生成回帰 |
| `mashos-api/ai/tests/test_kokoro_weather_phase6_qa.py` | 未来予測・注意報・良悪判定・自己分析非対象・履歴/tier境界・旧感情分析レポート非表示を固定するQA test |

## mashos-api 変更path

| file | 最新構造 |
|---|---|
| `mashos-api/ai/services/ai_inference/api_analysis_reads.py` | `MyWebHomeSummaryResponse` に `current_weather` をadditive追加。失敗時も既存summaryは維持 |
| `mashos-api/ai/services/ai_inference/api_analysis_reports.py` | レポート生成時に `content_json.kokoroWeather` をadditive追加し、日/週/月タイトルを `こころ天気（日/週/月）` へ更新 |
| `mashos-api/ai/services/ai_inference/api_cron_distribution.py` | 感情分析レポート配布Pushの文言をこころ天気表示へ更新。cron構造は維持 |
| `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py` | backend subscription bootstrapのplan copyをこころ天気基準へ同期。tier / entitlementは維持 |

## 構造補正

- こころ天気はAnalysisの感情分析側だけに適用する。Self Structure / 自己分析は既存構造を維持する。
- `current_weather` と `kokoroWeather` はadditive fieldであり、DB physical name、public route、既存response keyの破壊的変更ではない。
- `daily` / `weekly` / `monthly` は内部キーとして維持し、表示名だけ `こころ天気（日）` / `こころ天気（週）` / `こころ天気（月）` に寄せる。
- `観測メモあり` は注意報ではなく、過去〜現在の変化構造を示す観測ラベルとして読む。

# 2026-05-13 差分追記: こころ天気旧レポート非表示 snapshot差分

比較元は前提資料内の旧基準面 `Cocolon(154).zip` / `mashos-api(69).zip`、比較先は `Cocolon_4(22).zip` / `mashos-api_4(16).zip`。ファイル数は変わらず、既存ownerのfilter / guard / testが更新されています。

| source | previous count | current count | added | changed | removed |
|---|---:|---:|---:|---:|---:|
| Cocolon | 204 | 204 | 0 | 9 | 0 |
| mashos-api | 419 | 419 | 0 | 6 | 0 |
| total | 623 | 623 | 0 | 15 | 0 |

## Cocolon 変更path

| file | 最新構造 |
|---|---|
| `Cocolon/screens/analysisReport/kokoroWeatherFormatters.js` | `isKokoroWeatherReportRecord` を追加し、canonical / snake_case / standardReport内payload / projection aliasからこころ天気表示可否を判定する |
| `Cocolon/screens/analysis/useAnalysisReportActions.js` | latest cache namespaceを `cocolon:kokoroWeatherLatestReport:v1` に変更し、旧cacheを読まず、こころ天気成立レポートだけcacheする |
| `Cocolon/screens/AnalysisReportHistoryScreen.js` | ready結果をfrontendでもfilterし、開く/Export前にdetail APIで本体を取り直す。旧レポートは表示対象外alertにする |
| `Cocolon/screens/AnalysisReportViewerScreen.js` | 旧レポートstateが渡っても旧本文fallbackやweekly-days fallbackを出さず、表示対象外カードを出す |
| `Cocolon/screens/AnalysisContentFirstScreen.js` | latestReportsから旧レポートへfallbackしない保険guardを持つ |
| `Cocolon/screens/AnalysisScreen.js` | cached latest reportを `isKokoroWeatherReportRecord` で確認し、旧cacheを採用しない |
| `Cocolon/lib/accountLocalCleanup.js` | 旧 `cocolon:analysisLatestReport` と新 `cocolon:kokoroWeatherLatestReport:v1` の両prefixを退会後cleanup対象にする |
| `Cocolon/lib/compat/legacyWireContracts.js` | `buildAnalysisReportDetailPath` を追加し、weekly-days pathをdetail path helperから組み立てる |
| `Cocolon/tests/rn-screen-contracts.test.js` | cache namespace、formatter guard、history / viewer fail-closed、cleanup、detail path helperのcontractを追加確認する |

## mashos-api 変更path

| file | 最新構造 |
|---|---|
| `mashos-api/ai/services/ai_inference/api_analysis_reports.py` | `KOKORO_WEATHER_SCHEMA_VERSION`、projection alias、`_is_kokoro_weather_report_row` を追加。ready / detail APIで旧レポートを除外し、microcache keyに `kokoro_weather_only` とversionを含める |
| `mashos-api/ai/services/ai_inference/api_analysis_reads.py` | weekly-days補助readで `kokoroWeather` 不成立の旧週レポートを404にする |
| `mashos-api/ai/services/ai_inference/api_report_reads.py` | analysis unreadのID抽出でこころ天気成立レポートだけを対象にし、旧レポートで未読を立てない |
| `mashos-api/ai/tests/test_analysis_report_kokoro_weather.py` | helper、ready projection、ready latest body、detail、weekly-days、unread filterの回帰を追加 |
| `mashos-api/ai/tests/contract/test_publish_governance.py` | ready artifact / weekly-days / publish governanceのcontract fixtureをこころ天気payload前提に更新 |
| `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` | unread/status系snapshotとready artifact fixtureをこころ天気payload前提に更新 |

## 構造補正

- 旧感情分析レポートはDBから削除しない。
- ユーザー可視領域では、`content_json.kokoroWeather.version == "kokoro.weather.v1"` が成立する日/週/月レポートだけをこころ天気として扱う。
- 旧latest cacheは通常readしないが、退会後cleanupでは削除対象に残す。
- `daily` / `weekly` / `monthly`、`/analysis/*` route、DB physical name、publish governanceの物理境界は維持する。

# 2026-05-13 差分追記: わたしマップ実装 snapshot差分

この版は、`Cocolon_8(7).zip` / `mashos-api_8(10).zip` を最新実ファイルとして確認した。file count は次の通り。

| source | count | 差分 |
|---|---:|---|
| `Cocolon_8(7).zip` | 214 | わたしマップ renderer / card / formatter / access policy、Top UI / labels / history / tutorial / guide / IAP 文言の更新を含む |
| `mashos-api_8(10).zip` | 424 | `watashi_map_service.py`、Free light API、`content_json.watashiMap`、subscription mode、backend tests を含む |
| total | 638 | 前提資料coverage対象 |

## 追加ファイル

### Cocolon

| file | 構造上の意味 |
|---|---|
| `Cocolon/components/selfStructure/WatashiMapRenderer.js` | わたしマップ表示 owner |
| `Cocolon/components/selfStructure/WatashiMapOverviewCard.js` | 今のわたしマップ概要 |
| `Cocolon/components/selfStructure/RoleSwitchList.js` | 役割スイッチ一覧 |
| `Cocolon/components/selfStructure/RoutePatternCard.js` | よく通るルート |
| `Cocolon/components/selfStructure/CrossroadCard.js` | 迷いやすい分かれ道 |
| `Cocolon/components/selfStructure/UnknownAreaCard.js` | まだ地図にない場所 |
| `Cocolon/components/selfStructure/watashiMapFormatters.js` | payload normalize / legacy fallback |
| `Cocolon/components/watashiMapAccessPolicy.js` | tier / detail / history policy。latest zip では root 配置 |
| `Cocolon/components/WatashiMapRenderer.js` | latest zip に存在する root copy。現行 screen owner は `components/selfStructure/WatashiMapRenderer.js` |
| `Cocolon/components/watashiMapFormatters.js` | latest zip に存在する root copy。現行 screen owner は `components/selfStructure/watashiMapFormatters.js` |

### mashos-api

| file | 構造上の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/watashi_map_service.py` | watashiMap builder / projection / adapter owner |
| `mashos-api/ai/tests/contract/test_self_structure_latest_free_light.py` | Free latest light contract |
| `mashos-api/ai/tests/test_self_structure_watashi_map_payload.py` | report generation payload contract |
| `mashos-api/ai/tests/test_subscription_self_structure_modes.py` | tier mode boundary |
| `mashos-api/ai/tests/test_watashi_map_service.py` | service unit / safety |

## 変更ファイルの読み方

- `api_self_structure.py` は Free 403 を撤回し、`light` の概要だけ返せるようにしている。paid row は上書きせず投影する。
- `astor_self_structure_report.py` は `content_json.watashiMap` を additive 追加する。legacy payload は消さない。
- `subscription.py` は Self Structure / わたしマップ用 allowed mode helper を持つ。
- `api_contract_registry.py` は `watashiMap` を additive contract note として扱う。
- RN 側は `AnalysisContentFirstScreen.js` / Generate / Viewer / History / guide / tutorial / IAP copy を `わたしマップ` へ寄せる。

## current path watch

最新実ファイルでは `Cocolon/components/selfStructure/watashiMapAccessPolicy.js` が存在し、`SelfStructureReportHistoryScreen.js` と `SelfStructureReportViewerScreen.js` の `../components/selfStructure/watashiMapAccessPolicy` import と一致している。root `Cocolon/components/watashiMapAccessPolicy.js` は同内容の互換copyとして残る。

# 2026-05-15 差分追記: EmlisAI A案到達 Step15-20 snapshot差分

この版は、`Cocolon_前提資料(78).zip` の前提資料を基準に、最新実ファイル `Cocolon_7(10).zip` / `mashos-api_7(13).zip` を確認した差分更新です。最新coverageは `Cocolon=216` / `mashos-api=443` / `total=659`。

| source | current count | 前提資料本文との差分読み |
|---|---:|---|
| `Cocolon_7(10).zip` | 216 | 実装差分ではなくcoverage補完として2pathを明記。前回のわたしマップaccess policy import mismatch watchは解消済み |
| `mashos-api_7(13).zip` | 443 | EmlisAI Step15-20の12path追加と8path変更を中心に、Step0-14で本文未記載だったcurrent pathも補完 |
| total | 659 | 01/02/07/manifestのcoverageを659件に更新 |

## Cocolon coverage補完path

| file | 構造上の意味 |
|---|---|
| `Cocolon/components/selfStructure/watashiMapAccessPolicy.js` | わたしマップの tier / report_mode / history / detail lock policy。`SelfStructureReportHistoryScreen.js` と `SelfStructureReportViewerScreen.js` が参照する現行配置。root copyと同内容で、前回のimport path mismatch watchは解消済みとして読む。 |
| `Cocolon/lib/analysisHomeSummaryRefreshSignal.js` | 入力保存後にAnalysis Home Summaryをbest-effortでdirty化し、`AnalysisScreen.js` 側でconsumeするRN local refresh signal。API route / DB / 保存構造は変更しない。 |

## mashos-api Step15-20 新規path

| file | 構造上の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/stabilization.py` | Step15 共通Core安定化。CoreTextPayload / TextGenerationResult / Guard結果 / used_evidence_span_ids / quality_flags が共通形式かをmeta化し、中核別出力目的・public契約・DB名を共通Coreへ移さないことを確認する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_rollout_metrics_service.py` | Step16 段階リリース計測。attempted / passed / rejected / unavailable / safety_blocked / primary_reason / coverage_group / composer_model をdeveloper/QA metaへ集計する。 |
| `mashos-api/ai/tests/test_cocolon_text_generation_core_step15_stabilization.py` | Step15の共通形式・Emlis契約維持・境界drift検出・render metaを固定する回帰。 |
| `mashos-api/ai/tests/test_emlis_ai_step16_rollout_metrics.py` | Step16のrollout metric event / aggregate / reply meta接続を固定する回帰。 |
| `mashos-api/ai/tests/fixtures/emlis_ai_step17_broad_input_cases.py` | Step17 広い入力fixture。生活・体調・人間関係・学習・仕事・長文・履歴・cross coreを正解文一致ではなく構造条件で固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_step17_broad_input_fixtures.py` | Step17 fixtureのcoverage、forbidden_surface、evidence/scope条件を固定する回帰。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_ap0_migration_decision_service.py` | Step18 A-P0移行判定。coverage matrix / rollout metrics / diagnostic_summary / Guard結果から、Step19へ進むかB案の戻り先Stepへ返すmetaを作る。 |
| `mashos-api/ai/tests/test_emlis_ai_step18_ap0_migration_decision.py` | Step18のGreen条件、未達時return_steps、passed-onlyだけで進めない判定を固定する回帰。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_a_plan_equivalent_composer_service.py` | Step19 A案相当Composer導入。A-P0 green時だけ `cocolon_emlis_observation_composer.a1.v1` へpromoteし、B案Gate / scoped graph / fail-closed / passed-onlyを維持する。 |
| `mashos-api/ai/tests/test_emlis_ai_step19_a_plan_equivalent_composer.py` | Step19のpromotion条件、未達時hold、B案境界維持、registry / limited composer接続を固定する回帰。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_long_term_quality_service.py` | Step20 長期品質。previous output similarity、surface variation、history/cross core evidence-only、distance boundary、QA metricsをdeveloper/QA metaへ残す。 |
| `mashos-api/ai/tests/test_emlis_ai_step20_long_term_quality.py` | Step20の反復表面、履歴補完禁止、距離感drift、A-2長期運用品質metaを固定する回帰。 |

## mashos-api Step0-14 / existing current path coverage補完

| file | 構造上の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_composer_client_registry.py` | Default composer registry。Step19でA案相当composer aliasを受け、Limited / A-1相当を環境値で切り替えられるが、既存route/response keyは変えない。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_coverage_matrix_service.py` | Step08 coverage matrix。停止理由をB-S1拡張対象のcoverage groupへ変換するdeveloper meta。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_release_service.py` | Phase7 / Step16 release gate。off/internal/tutorial/limited_cases/all の段階リリース判断とmetrics sourceを持つ。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_safety_boundary_service.py` | Step10 safety boundary。Composer前に危険境界をreason code化して止める非生成helper。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_user_address_service.py` | Emlis観測の呼びかけpolicy。display name callを一箇所に閉じ、二人称依存を抑える。 |
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

## mashos-api Step15-20 変更path

| file | 差分の読み方 |
|---|---|
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/__init__.py` | Step15 `stabilization.py` の型・定数・report builderを公開し、共通Coreから参照できるようにした。 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/emlis_observation_composer.py` | Emlis adapter metaへ `step15_common_core_stabilization` / `common_core_stabilization` を追加し、Step19 metaを透過する。 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/types.py` | metaのJSON-safe変換を再帰対応にし、GuardResult metaが文字列化されず共通形式で残るようにした。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_composer_client_registry.py` | Limited composerに加えてA案相当composer aliasを解決できるようにした。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_client.py` | Step19 A案相当client / model promotion metaをLimitedComposer境界に接続する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_release_service.py` | Step16 metricsで使うrelease meta / rollout stageの情報を保持する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | Step15 ready、Step16 metrics、Step18 A-P0 decision、Step19 A-1 meta、Step20 A-2 quality metaをdiagnostic_summary / multi_perspectiveへadditive接続する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_template_echo_guard.py` | Template/Echo GuardがA案相当composer model markerをAI生成側として扱えるようにした。 |

## 境界維持

- DB physical name / bridge view / write path / destructive rename は変更しない。
- public API route、既存response key、RN visible nameを変更しない。
- EmlisAIのユーザー可視本文は `observation_status=passed` かつ `comment_text` ありの場合だけ表示する。
- Step16 / Step18 / Step20 はdeveloper / QA metaであり、ユーザー向け本文を生成しない。
- Step19 A案相当Composerは、B案Gate・scoped graph・fail-closedを保持した内部composer model promotionとして読む。

# 2026-05-15 差分追記: EmlisAI 限定Composer拡張 Step0-11 snapshot差分

最新実ファイル `Cocolon_12(4).zip` / `mashos-api_12(4).zip` を確認した。`Cocolon` 側の追加・削除・変更は 0 件。`mashos-api` 側は、旧基準 `mashos-api(74).zip` から 16 件追加・16 件変更、削除 0 件。現在のfile countは `Cocolon=216` / `mashos-api=459` / `total=675`。

## 追加ファイル

| file | 差分の読み方 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_e2e_contract.py` | 新規。限定Composer拡張 Step0-11 の実装/回帰として追加。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_extension_baseline.py` | 新規。限定Composer拡張 Step0-11 の実装/回帰として追加。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_extension_exit_gate.py` | 新規。限定Composer拡張 Step0-11 の実装/回帰として追加。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_relation_taxonomy.py` | 新規。限定Composer拡張 Step0-11 の実装/回帰として追加。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_surface_realizer.py` | 新規。限定Composer拡張 Step0-11 の実装/回帰として追加。 |
| `mashos-api/ai/tests/test_emlis_ai_binding_aware_grounding.py` | 新規。限定Composer拡張 Step0-11 の実装/回帰として追加。 |
| `mashos-api/ai/tests/test_emlis_ai_diagnostic_summary_v2.py` | 新規。限定Composer拡張 Step0-11 の実装/回帰として追加。 |
| `mashos-api/ai/tests/test_emlis_ai_display_contract.py` | 新規。限定Composer拡張 Step0-11 の実装/回帰として追加。 |
| `mashos-api/ai/tests/test_emlis_ai_gate_binding_reflection.py` | 新規。限定Composer拡張 Step0-11 の実装/回帰として追加。 |
| `mashos-api/ai/tests/test_emlis_ai_limited_composer_extension_exit_gate.py` | 新規。限定Composer拡張 Step0-11 の実装/回帰として追加。 |
| `mashos-api/ai/tests/test_emlis_ai_limited_composer_extension_steps_0_1.py` | 新規。限定Composer拡張 Step0-11 の実装/回帰として追加。 |
| `mashos-api/ai/tests/test_emlis_ai_limited_composer_phrase_unit_material.py` | 新規。限定Composer拡張 Step0-11 の実装/回帰として追加。 |
| `mashos-api/ai/tests/test_emlis_ai_limited_composer_sentence_binding.py` | 新規。限定Composer拡張 Step0-11 の実装/回帰として追加。 |
| `mashos-api/ai/tests/test_emlis_ai_limited_relation_taxonomy.py` | 新規。限定Composer拡張 Step0-11 の実装/回帰として追加。 |
| `mashos-api/ai/tests/test_emlis_ai_limited_surface_realizer_stabilization.py` | 新規。限定Composer拡張 Step0-11 の実装/回帰として追加。 |
| `mashos-api/ai/tests/test_emlis_ai_scorecard_harness.py` | 新規。限定Composer拡張 Step0-11 の実装/回帰として追加。 |

## 変更ファイル

| file | 差分の読み方 |
|---|---|
| `mashos-api/ai/.env` | 変更。限定Composer拡張 Step0-11 のmeta / binding / guard / contractをadditive接続。 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/__init__.py` | 変更。限定Composer拡張 Step0-11 のmeta / binding / guard / contractをadditive接続。 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/emlis_observation_composer.py` | 変更。限定Composer拡張 Step0-11 のmeta / binding / guard / contractをadditive接続。 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/composer.py` | 変更。限定Composer拡張 Step0-11 のmeta / binding / guard / contractをadditive接続。 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/guards/grounding.py` | 変更。限定Composer拡張 Step0-11 のmeta / binding / guard / contractをadditive接続。 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/types.py` | 変更。限定Composer拡張 Step0-11 のmeta / binding / guard / contractをadditive接続。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_composer_client_registry.py` | 変更。限定Composer拡張 Step0-11 のmeta / binding / guard / contractをadditive接続。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_coverage_matrix_service.py` | 変更。限定Composer拡張 Step0-11 のmeta / binding / guard / contractをadditive接続。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_display_gate.py` | 変更。限定Composer拡張 Step0-11 のmeta / binding / guard / contractをadditive接続。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_grounding_judge.py` | 変更。限定Composer拡張 Step0-11 のmeta / binding / guard / contractをadditive接続。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_client.py` | 変更。限定Composer拡張 Step0-11 のmeta / binding / guard / contractをadditive接続。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_sentence_quality_guard.py` | 変更。限定Composer拡張 Step0-11 のmeta / binding / guard / contractをadditive接続。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_phrase_shaping_service.py` | 変更。限定Composer拡張 Step0-11 のmeta / binding / guard / contractをadditive接続。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | 変更。限定Composer拡張 Step0-11 のmeta / binding / guard / contractをadditive接続。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_types.py` | 変更。限定Composer拡張 Step0-11 のmeta / binding / guard / contractをadditive接続。 |
| `mashos-api/ai/tests/test_emlis_ai_phrase_shaping_service.py` | 変更。限定Composer拡張 Step0-11 のmeta / binding / guard / contractをadditive接続。 |

## 追加差分の要点

| 領域 | 内容 |
|---|---|
| baseline / connection | `limited_composer_extension_baseline`、`connection_visibility`、`composer_client_not_connected` 切り分けをmeta化。 |
| diagnostic_summary | `failed_stage`、`coverage_group`、`binding_present`、`binding_missing`、`binding_count` をraw入力なしで確認可能にする。 |
| SentenceBinding | body文ごとに evidence / phrase / relation を束縛し、Groundingの後追い表面一致依存を減らす。 |
| PhraseUnit材料 | 未完了断片・助詞残り・感情ラベル単独・長すぎる原文貼り付けを材料段階で落とす。 |
| relation taxonomy | `contrast`、`coexistence`、`pressure`、`recovery`、`approach_avoidance` 等をcanonical relationとして追う。 |
| binding-aware Grounding | EmlisAI Guard と Common Core Guard の両方で declared evidence / phrase / relation を読む。 |
| Gate binding trace | reader / grounding / template / display traceへ `binding_used` 等を残す。 |
| limited Surface Realizer | opener / particle / predicate / tail variationをrelationごとに選び、固定完成文増殖を避ける。 |
| scorecard / E2E | coverage_group別結果、binding coverage、passed-only表示契約、Exit Gateをtestで固定する。 |

## 境界維持

- `input_feedback.comment_text` は `observation_status=passed` かつ本文ありの場合だけ表示する。
- Display Gate / Reader / Grounding / Template Guard は緩めない。
- 外部AIレンタル、ローカルLLM、固定完成文テンプレ、入力専用テンプレは追加しない。
- DB physical name、public route、existing response key、RN visible名は変更しない。
- raw入力本文を前提資料やdiagnostic metaにコピーしない。
- この差分は「完全Composerを完成させた」ではなく、「完全Composer初期版へ進むための限定Composer拡張完了Exit Gateを固定した」と読む。

# 2026-05-16 差分追記: EmlisAI 完全Composer初期版 Commit1-13 snapshot差分

比較元は前提資料内の旧 current 基準 `Cocolon_12(4).zip` / `mashos-api_12(4).zip`、比較先は `Cocolon_15(2).zip` / `mashos-api_15(3).zip`。Cocolon側は file count 216 のまま `tests/rn-screen-contracts.test.js` のみがComplete初期版contract regressionとして更新されている。mashos-api側は 459件から484件へ増え、Complete Composer初期版の新規service / testが追加されている。

## Cocolon 変更path

| path | 差分の意味 |
|---|---|
| `Cocolon/tests/rn-screen-contracts.test.js` | Step13 RN contract regression。Complete metaが入ってもpublic `observation_status=passed` かつ `comment_text` 非空でなければ `Emlisの観測` modalを作らない。 |

## mashos-api 追加path

| path | 差分の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_composer_initial_meta.py` | Complete Composer初期版の追加runtime owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_composer_types.py` | Complete Composer初期版の追加runtime owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_material_service.py` | Complete Composer初期版の追加runtime owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_focus_selector.py` | Complete Composer初期版の追加runtime owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_relation_graph_service.py` | Complete Composer初期版の追加runtime owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_sentence_planner.py` | Complete Composer初期版の追加runtime owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py` | Complete Composer初期版の追加runtime owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_grounding_binding.py` | Complete Composer初期版の追加runtime owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_grounding_service.py` | Complete Composer初期版の追加runtime owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_self_repair_service.py` | Complete Composer初期版の追加runtime owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_composer_client.py` | Complete Composer初期版の追加runtime owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_reply_diagnostics_service.py` | Complete Composer初期版の追加runtime owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_scorecard_service.py` | Complete Composer初期版の追加runtime owner。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_composer_initial_commit1.py` | Complete Composer初期版の回帰test / contract。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_composer_types.py` | Complete Composer初期版の回帰test / contract。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_material_service.py` | Complete Composer初期版の回帰test / contract。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_focus_selector.py` | Complete Composer初期版の回帰test / contract。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_relation_graph.py` | Complete Composer初期版の回帰test / contract。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_sentence_plan_v2.py` | Complete Composer初期版の回帰test / contract。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_surface_realizer_v2.py` | Complete Composer初期版の回帰test / contract。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_grounding_binding.py` | Complete Composer初期版の回帰test / contract。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_self_repair.py` | Complete Composer初期版の回帰test / contract。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_composer_client.py` | Complete Composer初期版の回帰test / contract。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_e2e_contract.py` | Complete Composer初期版の回帰test / contract。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_scorecard.py` | Complete Composer初期版の回帰test / contract。 |

## mashos-api 変更path

| path | 差分の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_ap0_migration_decision_service.py` | Complete Composer初期版meta / gate / registry / diagnostics接続の既存owner変更。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_a_plan_equivalent_composer_service.py` | Complete Composer初期版meta / gate / registry / diagnostics接続の既存owner変更。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_composer_client_registry.py` | Complete Composer初期版meta / gate / registry / diagnostics接続の既存owner変更。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_grounding_judge.py` | Complete Composer初期版meta / gate / registry / diagnostics接続の既存owner変更。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | Complete Composer初期版meta / gate / registry / diagnostics接続の既存owner変更。 |
| `mashos-api/ai/tests/test_emlis_ai_composer_client_registry.py` | Complete Composer初期版meta / gate / registry / diagnostics接続の既存owner変更。 |
| `mashos-api/ai/tests/test_emlis_ai_step19_a_plan_equivalent_composer.py` | Complete Composer初期版meta / gate / registry / diagnostics接続の既存owner変更。 |
| `Cocolon/tests/rn-screen-contracts.test.js` | Complete Composer初期版meta / gate / registry / diagnostics接続の既存owner変更。 |

## 構造補正

- 限定Composer拡張 Step0-11 は、完全Composer初期版の土台として残る。
- 完全Composer初期版 Commit1-13 は、Product Gate版ではない。AP0 / rollout / evidence / no fallback / passed-only境界を守るAlpha実装として読む。
- RN側は実画面をComplete metaへ依存させず、contract testだけで表示契約を固定する。
- scorecard / fixture / blind QA rubric は品質評価metaであり、表示Gateそのものではない。

## 境界維持

境界維持:
- DB physical name、既存API route、public response key、RN表示名 `Emlisの観測` は変更しない。
- `input_feedback.comment_text` は `observation_status=passed` かつ本文ありの場合だけ表示する。
- 外部AIレンタル、ローカルLLM、固定完成文テンプレ、入力専用テンプレは追加しない。
- raw user input を改善資料として要求しない。改善は diagnostic_summary / Gate reason / coverage / binding / repair trace / scorecard event で行う。
- これは完全Composer商品品質版ではなく、限定Composerの安全境界を土台にした完全Composer初期版のAlpha実装として読む。

# 2026-05-16 差分追記: EmlisAI 完全Composer初期版 E2E表示開通 Step0-9 snapshot差分

比較対象は、前提資料 `Cocolon_前提資料(87).zip` と最新実ファイル `Cocolon_10(7).zip` / `mashos-api_10(10).zip` です。Cocolon側は file count `216` のまま、mashos-api側は file count `489`、合計 `705` を最新coverage対象として読む。

## 前提資料に未記載だった current path

| path | 差分の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_initial_fixture_qa_service.py` | Step9 fixture / QA runの新規service。scorecard event / fixture suite / recordsをsanitized metaとして集計し、product scorecard seedを作る。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_initial_entry_ap0.py` | Step0 / Step1 Entry AP0 helperの回帰test。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_initial_entry_route.py` | Step2-6 reply route接続の回帰test。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_initial_step7_integration.py` | Step7 integration test。AP0 red / rollout red / Gate rejected / Gate passedをE2Eで固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_initial_step9_fixture_qa.py` | Step9 fixture / QA runの回帰test。raw入力・comment_text混入禁止とscorecard seed接続を固定する。 |

## 既存ownerの読み方更新

| path | 最新の読み方 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_ap0_migration_decision_service.py` | Step18 Final AP0に加え、registry前の `build_complete_initial_entry_ap0_decision()` を持つ。Entry AP0とFinal AP0は循環防止のため分けて読む。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | Step2-6 / Step9の接続owner。Entry AP0 preview、resolver注入、resolution meta、candidate generation path、Final AP0 / scorecard、fixture / QA run metaをdiagnostic_summary / phase_gateへadditiveに残す。 |
| `Cocolon/tests/rn-screen-contracts.test.js` | Step8 RN contract regression。Complete metaだけでpublic statusを上書きせず、passed + textのみ表示することを固定する。 |

## 実行確認

| 対象 | 結果 |
|---|---|
| backend Step1-9確認 | `38 passed` |
| RN contract regression | `21 passed` |

## 構造補正

- E2E表示開通 Step0-9 は、完全Composer商品品質版ではなく、商品品質版に進むための完全Composer初期版の正規基礎段階。
- Entry AP0がgreenでも、Reader / Grounding / Template / Display Gateで落ちた場合は表示しない。
- Step9 fixture / QA runはmeta-onlyであり、public `comment_text` を書かない。
- DB physical name、public API route、既存response key、RN visible名 `Emlisの観測` は変更しない。

# 2026-05-16 差分追記: EmlisAI 商品品質版接続 Step0-7 snapshot差分

比較対象は、前提資料 `Cocolon_前提資料(90).zip` と最新実ファイル `Cocolon_8(11).zip` / `mashos-api_8(16).zip` です。Cocolon側は `216` 件のまま追加・削除・変更なし。mashos-api側は `489 -> 504` 件、合計 `720` 件を最新coverage対象として読む。

## Cocolon 差分

| 区分 | 結果 |
|---|---|
| 追加 | 0 |
| 変更 | 0 |
| 削除 | 0 |
| RN contract | `npm test -- --runInBand` で `21 passed`。Complete / ProductQuality metaだけではRN modalを表示しない。 |

## mashos-api 追加path

| path | 差分の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_product_quality_scorecard_service.py` | Step6 Product Quality Scorecard / Blind QA service。machine metrics とBlind QAを分離する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_release_ladder_service.py` | Step7 Release ladder service。Step6 scorecardからinternal / limited / broader_beta / product_gate判定metaを作る。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_tone_policy.py` | Step5 Tone Engine service。TonePolicy / ToneGuardReportをSurface前制約として作る。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_grounding_relation_binding_v2.py` | Step0-7 商品品質版接続 regression / contract。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_product_quality_connection_e2e.py` | Step0-7 商品品質版接続 regression / contract。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_product_quality_coverage.py` | Step0-7 商品品質版接続 regression / contract。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_product_quality_scorecard.py` | Step0-7 商品品質版接続 regression / contract。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_product_quality_scorecard_blind_qa.py` | Step0-7 商品品質版接続 regression / contract。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_release_ladder_connection_e2e.py` | Step0-7 商品品質版接続 regression / contract。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_release_ladder_v2.py` | Step0-7 商品品質版接続 regression / contract。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_self_repair_product_quality_v2.py` | Step0-7 商品品質版接続 regression / contract。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_self_repair_v2.py` | Step0-7 商品品質版接続 regression / contract。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_surface_variation_v2.py` | Step0-7 商品品質版接続 regression / contract。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_tone_engine_v2.py` | Step0-7 商品品質版接続 regression / contract。 |
| `mashos-api/ai/tests/test_emlis_ai_gate_binding_contract_v2.py` | Step0-7 商品品質版接続 regression / contract。 |

## mashos-api 変更path

| path | 差分の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_composer_client.py` | 商品品質版接続 Step0-7 の既存owner変更。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_composer_types.py` | 商品品質版接続 Step0-7 の既存owner変更。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_focus_selector.py` | 商品品質版接続 Step0-7 の既存owner変更。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_grounding_binding.py` | 商品品質版接続 Step0-7 の既存owner変更。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_grounding_service.py` | 商品品質版接続 Step0-7 の既存owner変更。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_reply_diagnostics_service.py` | 商品品質版接続 Step0-7 の既存owner変更。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_scorecard_service.py` | 商品品質版接続 Step0-7 の既存owner変更。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_self_repair_service.py` | 商品品質版接続 Step0-7 の既存owner変更。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_sentence_planner.py` | 商品品質版接続 Step0-7 の既存owner変更。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py` | 商品品質版接続 Step0-7 の既存owner変更。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_display_gate.py` | 商品品質版接続 Step0-7 の既存owner変更。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_grounding_judge.py` | 商品品質版接続 Step0-7 の既存owner変更。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_extension_baseline.py` | 商品品質版接続 Step0-7 の既存owner変更。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | 商品品質版接続 Step0-7 の既存owner変更。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_template_echo_guard.py` | 商品品質版接続 Step0-7 の既存owner変更。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_types.py` | 商品品質版接続 Step0-7 の既存owner変更。 |
| `mashos-api/ai/tests/test_emlis_ai_diagnostic_summary_v2.py` | 商品品質版接続 Step0-7 の既存owner変更。 |
| `mashos-api/ai/tests/test_emlis_ai_gate_binding_reflection.py` | 商品品質版接続 Step0-7 の既存owner変更。 |

## Step0-7 の読み方

| Step | 読み方 |
|---|---|
| Step0 binding_used契約整理 | `binding_used` はbinding存在ではなくGate判断で実際に使用したことを示す。 |
| Step1 coverage suite拡張 | 商品品質版のeligible母集団をcoverage_groupで定義する。`desire_fear` をcurrent coverageとして持つ。 |
| Step2 Grounding強化 | sentence_idごとにEvidence / PhraseUnit / relationを照合する。 |
| Step3 Surface variation強化 | 完成文増殖ではなくsurface_signature / connector / endingで非テンプレ性を測る。 |
| Step4 Self-Repair強化 | Gate reasonごとに安全なrepair policyを持ち、meaning_added=false / gate_relaxed=falseを固定する。 |
| Step5 Tone Engine | Emlisの距離感をTonePolicyとしてSurface前制約へ接続する。 |
| Step6 Scorecard / Blind QA | machine metricsとBlind QAを分け、read_feelingはBlind QA由来として扱う。 |
| Step7 Release ladder接続 | internal -> limited -> broader_beta -> product_gate の判定metaを作る。Step7単体ではpublic releaseを適用しない。 |

## 実行確認

| 対象 | 結果 |
|---|---|
| backend EmlisAI regression | `PYTHONPATH=services/ai_inference pytest -q tests/test_emlis_ai_*.py` -> `421 passed` |
| RN passed-only contract | `npm test -- --runInBand` -> `21 passed` |

## 境界維持

- 商品品質版接続 Step0-7 は Product Gate release そのものではない。
- ProductQualityScorecard / Release ladder は meta-only で、public `comment_text` を直接書かない。
- Gate緩和、固定文fallback、外部AI / local LLM、DB/API/RN契約renameは行わない。
- RNは `observation_status=passed` かつ `comment_text` 非空の場合だけ `Emlisの観測` を表示する。

# 2026-05-17 差分追記: EmlisAI positive_recovery relation_not_expressed Step0-7 snapshot差分

比較対象は、前提資料 `Cocolon_前提資料(92).zip` と最新実ファイル `Cocolon_9(8).zip` / `mashos-api_9(8).zip` です。Cocolon側は file count `216` のまま、InputScreenの一時debug log整理が反映されています。mashos-api側は file count `514`、合計 `730` を最新coverage対象として読む。

## Cocolon 変更path

| path | 差分の意味 |
|---|---|
| `Cocolon/screens/InputScreen.js` | Step7 log cleanup。一時確認用の `[Emlis observation debug]` console logを削除し、passed + comment_text のmodal表示契約は維持する。 |

## mashos-api 追加path

| path | 差分の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_relation_surface_contract.py` | Step1 relation surface contract。Reader / Surface / Self-Repair 共有の relation cue / recovery marker / detection meta。 |
| `mashos-api/ai/tests/test_emlis_ai_positive_recovery_relation_baseline.py` | Step0 baseline。positive_recovery の `relation_not_expressed` 再現とStep2後の回帰固定。 |
| `mashos-api/ai/tests/test_emlis_ai_relation_surface_contract.py` | Step1 contract unit test。generic / recovery cue、raw input非依存、過緩和防止。 |
| `mashos-api/ai/tests/test_emlis_ai_listener_reader_relation_surface_contract.py` | Step2 Reader contract test。relation surface cueをReaderが検出することを固定。 |
| `mashos-api/ai/tests/test_emlis_ai_listener_reader_relation_not_over_relaxed.py` | Step2 over-relaxation防止。relation cueなし・generic cueのみのrecoveryを通さない。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_self_repair_positive_recovery_relation.py` | Step3 Self-Repair recovery marker test。meaning_added=false / relation preservation / gate_relaxed=false。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_surface_recovery_relation_line.py` | Step4 Surface recovery relation line test。contract marker / surface_signature / grounding meta。 |
| `mashos-api/ai/tests/test_emlis_ai_positive_recovery_relation_diagnostic_connection.py` | Step5 diagnostic connection test。reader_relation_signal / self_repair_relation_marker meta。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_product_quality_positive_recovery_e2e.py` | Step6 E2E / regression。positive_recoveryでReader `relation_not_expressed` が消え、Gateが緩まないことを固定。 |
| `mashos-api/ai/tests/test_emlis_ai_step7_log_cleanup.py` | Step7 log cleanup test。debug log default off、flag on時もmeta-only、raw input / comment_text本文非混入。 |

## mashos-api 変更path

| path | 差分の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_listener_reader_judge.py` | Step2。legacy `_RELATION_RE` と relation surface contract detectionを併用し、検出結果をReaderReportへ残す。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_self_repair_service.py` | Step3。recovery markerをcontractへ寄せ、repair trace / grounding input / result metaへmarker情報を残す。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_composer_types.py` | Step3。RepairTrace.as_meta() が relation marker signal系metaを落とさないようadditive拡張。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py` | Step4。recovery relation line / connector / predicate / surface_signatureをcontractに整合。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_types.py` | Step5。ListenerReaderReportへrelation surface diagnostic fieldをadditive追加。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_display_gate.py` | Step5。reader gate traceへ relation_surface_contract_version / reader_relation_signal_* を追加。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_reply_diagnostics_service.py` | Step5。positive_recovery_relation_diagnostic / relation_surface_diagnostic / step5_relation_diagnostic を構築・接続。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | Step5。relation diagnosticを diagnostic_summary / phase_gate / top-level metaへ接続。 |
| `mashos-api/ai/services/ai_inference/emotion_submit_service.py` | Step7。`emlis_observation_result` 常時logをenv flag配下へ整理し、例外stack traceもdebug flag配下に置く。通常時はfail-closed warningだけ残す。 |

## Step0-7 の読み方

| Step | 読み方 |
|---|---|
| Step0 baseline固定 | 非表示原因を `stage=reader / primary_reason=relation_not_expressed / coverage_group=positive_recovery` としてfixture化する。 |
| Step1 relation surface contract | Reader / Surface / Self-Repair のrelation cue語彙を共有する。`関係` 単独passは禁止。 |
| Step2 Reader relation検出contract化 | recovery cueを含む候補だけを検出し、relation cueがない3文候補は引き続きrejectedにする。 |
| Step3 Self-Repair recovery marker | declared relationだけを明示する。`meaning_added=false` / `relation_ids_preserved=true` / `gate_relaxed=false` を保持。 |
| Step4 Surface recovery relation line | recovery relation lineをcontract marker / surface_signatureと整合する。固定文fallbackではない。 |
| Step5 diagnostic接続 | `reader_relation_signal_*` と `self_repair_relation_marker_*` をraw inputなしでdiagnosticに残す。 |
| Step6 E2E / regression | positive_recoveryでReader `relation_not_expressed` が消えることと、Gate非緩和を固定する。 |
| Step7 ログ一時コード整理 | RN一時console log削除、backend観測結果logのenv flag化。通常ログにraw input / comment_text本文を出さない。 |

## 実行確認

| 対象 | 結果 |
|---|---|
| Step0-7対象テスト | `32 passed` |
| E2E / product quality connection関連回帰 | `6 passed` |
| Step6時点の対象テスト | `24 passed` |
| Step5 diagnostic / E2E 関連回帰 | `7 passed` |

## 境界維持

- positive_recovery relation_not_expressed 修正は、Gate緩和ではなく、Reader / Surface / Self-Repair のrelation surface contract整合として読む。
- RNは `observation_status=passed` かつ `comment_text` 非空の場合だけ `Emlisの観測` を表示する。
- fixed fallback、外部AI / local LLM、DB/API/RN契約renameは追加しない。
- raw inputはdiagnostic / log / scorecardへ混入させない。
- 通知400は別件であり、この差分の成否判定には使わない。


# 2026-05-17 差分追記: EmlisAI Observation Diagnostic Lockdown Step0-8 snapshot差分

比較対象は、前提資料 `Cocolon_前提資料(94).zip` と最新実ファイル `Cocolon_9(9).zip` / `mashos-api_9(9).zip` です。Cocolon側は file count `217`、mashos-api側は file count `525`、合計 `742` を最新coverage対象として読む。

## Cocolon 追加path

| path | 差分の意味 |
|---|---|
| `Cocolon/screens/input/inputFeedbackObservationDiagnostics.js` | RN frontend診断helper。`trace_id` / `observation_status` / `comment_text_length` / `modal_opened` をmeta-onlyで出す。 |

## Cocolon 変更path

| path | 差分の意味 |
|---|---|
| `Cocolon/screens/InputScreen.js` | `openInputFeedbackModal` 後に `logEmlisObservationFrontendDiagnostic(...)` を呼ぶ。表示条件は変えない。 |
| `Cocolon/tests/rn-screen-contracts.test.js` | Step6 RN tests。診断helper、no raw text、no forced passed、passed-only契約を固定する。 |

## mashos-api 追加path

| path | 差分の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_diagnostic_lockdown.py` | Step1 backend helper。既存metaを診断schemaへ正規化し、classificationを返す。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_diagnostic_compare.py` | Step7 compare service。backend/RN診断logをparse / joinし、first divergenceを出す。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_diagnostic_branching.py` | Step8 branching service。classificationから次工程のtarget layer / touch_files / do_not_touchを固定する。 |
| `mashos-api/ai/tools/emlis_observation_compare_1135_1136.py` | 11:35/11:36比較CLI。markdown / json出力。 |
| `mashos-api/ai/tools/emlis_observation_route_next_step.py` | compare結果またはlogから次工程branchを出すCLI。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_diagnostic_lockdown.py` | helper classification / no raw input test。 |
| `mashos-api/ai/tests/test_emotion_submit_observation_diagnostic_log.py` | submit one-line diagnostic log test。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_diagnostic_reply_meta.py` | reply meta補強test。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_diagnostic_backend_step5.py` | backend Step5 contract / fail-closed / safe reason extraction test。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_diagnostic_compare_step7.py` | compare Step7 test。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_diagnostic_branching_step8.py` | branching Step8 test。 |

## mashos-api 変更path

| path | 差分の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/emotion_submit_service.py` | Step2。`input_feedback_comment` / `input_feedback_meta` 確定後にbackend診断行を出す。exception pathもfail-closed metaで診断する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | Step3。`observation_diagnostic_lockdown_ready`、`candidate_generated_before_display_gate`、gate / repair extractabilityをadditive接続。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_reply_diagnostics_service.py` | Step3。complete diagnostics側のcandidate / gate / repair metaを診断helperで拾える形に補強。 |

## Step0-8 の読み方

| Step | 読み方 |
|---|---|
| Step0 baseline / evidence固定 | コード変更なし。11:35非表示 / 11:36表示はスクショだけでは原因確定できないため、診断schemaで見る対象として固定する。 |
| Step1 backend helper | `classification` を作るが、Gateや表示条件は変えない。 |
| Step2 submit接続 | submit 1回につきbackend診断行を1本だけ出す。通常はenv off。 |
| Step3 reply meta補強 | candidate / gate / repair をraw入力なしで抽出可能にする。public response shapeは変えない。 |
| Step4 RN frontend診断 | public statusとmodal_openedだけを出す。diagnostic metaでpassed補正しない。 |
| Step5 backend tests | fail-closed、no raw text、Display contract、classificationを固定する。 |
| Step6 RN tests | RN診断helperとpassed-only contractを固定する。 |
| Step7 11:35/11:36比較 | backend/RN診断行をjoinし、最初の差分層を出す。スクショ単体では原因断定しない。 |
| Step8 分類別次工程へ分岐 | 原因確定前の修正を禁止し、`target_layer` / `do_not_touch` / `repair_allowed` を出す。 |

## 実行確認

| 対象 | 結果 |
|---|---|
| backend diagnostic Step1-8対象 | `47 passed, 1 warning` |
| RN contract | `22 passed` |

## 境界維持

- `input_feedback.comment_text` は public `observation_status=passed` かつ本文ありの場合だけ表示する。
- raw input / memo / current_input / public comment_text本文は診断log・compare・branchに入れない。
- backendだけ、RNだけで原因を断定しない。`trace_id` / `emotion_log_id` でjoinする。
- `unclassified_non_display` / `unknown_diagnostic_missing` は原因修正ではなくdiagnostic enrichmentへ戻す。
- Gate緩和、固定文fallback、外部AI / local LLM、DB/API/RN契約renameは追加しない。

# 2026-05-17 差分追記: EmlisAI Reader Relation Surface Step0-8 snapshot差分

比較対象は、前提資料 `Cocolon_前提資料(96).zip` と最新実ファイル `Cocolon_9(10).zip` / `mashos-api_9(10).zip` です。Cocolon側のsource file countは `217` のまま、mashos-api側source file countは `535`、合計 `752` を最新coverage対象として読む。今回の差分は、Observation Diagnostic Lockdownで確定した `candidate_generated_but_reader_rejected` に対する backend 実修正です。

## Cocolon 差分

Cocolon側に今回のsource追加・変更はありません。RN側は既存の `inputFeedbackObservationDiagnostics.js` と `InputScreen.js` のopt-in診断、および public `observation_status=passed` + `comment_text` 非空のみ表示する契約を維持します。

## mashos-api 追加path

| path | 差分の意味 |
|---|---|
| `mashos-api/ai/tests/test_emlis_ai_listener_reader_addressee_contract.py` | Step0/1。Reader宛名contractの失敗再現と敬称suffix整合。 |
| `mashos-api/ai/tests/test_emlis_ai_limited_reader_repair.py` | Step0/5。limited reader repairのrelation marker適用。 |
| `mashos-api/ai/tests/test_emlis_ai_a1_reader_relation_repair_e2e.py` | Step0/5。A1 equivalentがlimited reader repairを通るE2E。 |
| `mashos-api/ai/tests/test_emlis_ai_reply_service_expected_relation_types.py` | Step2。Readerへ渡すexpected relation typeとedge id除外。 |
| `mashos-api/ai/tests/test_emlis_ai_limited_previous_rejection_reasons.py` | Step3。previous rejection reason読解のunit test。 |
| `mashos-api/ai/tests/test_emlis_ai_limited_reader_previous_rejection_reasons.py` | Step3/5。Reader由来reasonだけをlimited repair対象にする。 |
| `mashos-api/ai/tests/test_emlis_ai_limited_addressee_repair.py` | Step4。宛名repairの最小適用と意味追加禁止。 |
| `mashos-api/ai/tests/test_emlis_ai_limited_reader_repair_core_hook.py` | Step6。repair adapterがcore evaluation前に入ること。 |
| `mashos-api/ai/tests/test_emlis_ai_limited_reader_repair_diagnostics.py` | Step7。limited repair状態が本文なしでdiagnosticへ出ること。 |
| `mashos-api/ai/tests/conftest.py` | Step8。EmlisAI test群のlocal pytest import support。 |

## mashos-api 変更path

| path | 差分の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_listener_reader_judge.py` | Step1。Readerの宛名判定をgreeting policyの敬称suffixと一致させる。relation判定は緩めない。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | Step2/7/8。`expected_relation_types` をReaderへ渡し、limited repair診断metaを接続し、retry reasonをcomposerが消費できる理由に限定する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_client.py` | Step3-6/8。previous rejection reason読解、宛名repair、relation marker repair、core hook、source guard regressionを担う。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_reply_diagnostics_service.py` | Step7。`limited_reader_repair` のattempted/applied/marker metaをsafe diagnosticへ接続する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_diagnostic_lockdown.py` | Step7。backend診断payloadへ limited repair状態を追加する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_composer_client.py` | Step8。Complete self-repairへ渡すrejection reasonを `ALLOWED_REPAIR_REASONS` に限定する。 |

## Step0-8 の読み方

| Step | 読み方 |
|---|---|
| Step0 失敗再現 | `candidate_generated_but_reader_rejected` をtestで再現し、同じ原因が残らないことを確認する。 |
| Step1 宛名contract | `様` 等のvalid greetingをReaderが認識する。敬称なし任意名を広く通さない。 |
| Step2 expected_relation_types | relation surface typeをReaderへ渡し、graph edge idを混ぜない。 |
| Step3 previous reason | limited/A1が `composition_contract.previous_rejection_reasons` を読めるようにする。 |
| Step4 addressee repair | `addressee_not_clear` の場合だけ先頭宛名行を最小置換する。 |
| Step5 relation marker | `relation_not_expressed` の場合だけ既存 relation surface contract のmarkerを使う。 |
| Step6 core hook | repair後もcore evaluation / Gateを通し、fail-closedを維持する。 |
| Step7 diagnostic meta | limited repair状態をmeta-onlyでbackend診断へ接続する。 |
| Step8 tests | 直結テスト、strict relation、product-quality、diagnostic、EmlisAI関連全体を通す。 |

## 実行確認

| 対象 | 結果 |
|---|---|
| Step8指定テスト | `43 passed` |
| Step0-7回帰確認セット | `67 passed` |
| EmlisAI関連全体 | `531 passed, 1 warning` |

## 境界維持

- RN表示条件、モーダル起動条件、response key、API route、DB physical nameは変更しない。
- Display Gate / Reader / Grounding / Template Guardを緩めない。Reader契約の不一致を整合するだけ。
- relation markerは `relation_surface_contract` のphrase/metaを使い、固定fallback文を追加しない。
- raw input / memo / current_input / public `comment_text` 本文はdiagnostic logへ出さない。
- backendがpassedなのにRNで表示されない状態が確認された場合だけ、次段でRNを切り分ける。

# 2026-05-18 差分追記: EmlisAI ProductGate Measurement Step0-10 snapshot差分

比較対象は、前提資料 `Cocolon_前提資料(98).zip` と最新実ファイル `Cocolon_11(3).zip` / `mashos-api_11(6).zip` です。Cocolon側のsource file countは `217` のまま、mashos-api側source file countは `543`、合計 `760` を最新coverage対象として読む。今回の差分は、Reader Relation Surface修正後の表示/非表示分類を ProductQualityScorecard / Release ladder / next action routing / local report / Exit Gate へ接続する測定工程です。

## Cocolon 差分

Cocolon側に今回のsource追加・変更はありません。RN側は既存の `inputFeedbackObservationDiagnostics.js` と `InputScreen.js` のopt-in診断、および public `observation_status=passed` + `comment_text` 非空のみ表示する契約を維持します。

## mashos-api 追加path

| path | 差分の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_product_quality_measurement_contract_inventory.py` | Step0/9/10。ProductGate Measurementのcontract inventory、allowed touch files、non-targets、Exit Gate非release境界を固定する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_product_quality_measurement_connection.py` | Step3-7/10。joined diagnostic rowをscorecard eventへ変換し、scorecard / release ladder / coverage / Blind QA / next action / Exit Gateを1つのreportへ接続する。 |
| `mashos-api/ai/tools/emlis_observation_product_quality_measurement.py` | Step8。backend/RN診断log行からJSON/Markdownのmeta-only measurement reportを出すlocal tool。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_product_quality_measurement_contract_inventory_step0.py` | Step0/9/10。contract inventory regression。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_product_quality_measurement_connection.py` | Step3-7/10。measurement connection regression。 |
| `mashos-api/ai/tests/test_emlis_observation_product_quality_measurement_tool_step8.py` | Step8。local tool JSON/Markdown / meta-only regression。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_product_quality_measurement_regression_step9.py` | Step9。public contract / counting semantics / RN表示期待値 regression。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_product_quality_measurement_exit_gate_step10.py` | Step10。Exit Gate four fixture regression。 |

## mashos-api 変更path

| path | 差分の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_diagnostic_compare.py` | Step1-2。diagnostic capture statusとbackend/frontend join semanticsを追加する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_product_quality_scorecard_service.py` | Step3/5/6。display_confirmed count、coverage group aggregation、Blind QA separationを受ける。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_release_ladder_service.py` | Step5。coverage group missing / incomplete を release blocker として扱う。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_diagnostic_compare_step7.py` | Step1-2のcapture gap / join semantics regressionを追加する。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_diagnostic_branching_step8.py` | Step1/7のunknown / unclassified routing regressionを追加する。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_product_quality_scorecard.py` | Step3/6のcounting / Blind QA separation regressionを追加する。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_release_ladder_v2.py` | Step5のcoverage blocker regressionを追加する。 |

## Step0-10 の読み方

| Step | 読み方 |
|---|---|
| Step0 基準固定 / contract inventory | 触る候補fileと触らないcontractを固定する。 |
| Step1 diagnostic capture status | 診断行不足を Reader / RN 等へ決め打ちせず diagnostic gap として扱う。 |
| Step2 backend/frontend join semantics | backend passedとRN表示確認を分離し、`display_confirmed` のみ表示countへ入れる。 |
| Step3 joined row -> scorecard event adapter | joined rowをProductQualityScorecard eventへ変換する。 |
| Step4 measurement run builder | scorecardとrelease ladderを1つのmeasurement reportへ接続する。 |
| Step5 coverage group aggregation | 全7coverage groupを集計し、missingをblockerとして残す。 |
| Step6 Blind QA separation | read feelingはBlind QA review由来だけで入れる。 |
| Step7 next action routing | classification / top rejection reasons / release blockersから次branchを決める。 |
| Step8 local tool output | diagnostic log行からJSON/Markdown reportを出す。 |
| Step9 regression tests | public contract、meta-only、counting semantics、RN期待値を固定する。 |
| Step10 Exit Gate | Product Gate達成ではなく、測定接続完了と次修正判断可能性を固定する。 |

## 境界維持

- `input_feedback.comment_text` は public `observation_status=passed` かつ本文ありの場合だけ表示する。
- backend passedだけでは `passed_display_count` に入れない。frontend join + modal_opened が必要。
- raw input / memo / current_input / public `comment_text` 本文はdiagnostic log・scorecard event・local tool・release ladderへ出さない。
- coverage group missingは `short_daily` に寄せず、blockerとして残す。
- `read_feeling_score` はBlind QA review由来であり、machine metricsだけで埋めない。
- Exit Gate ready / regression green は Product Gate達成でもpublic release適用でもない。
- Gate緩和、固定文fallback、外部AI / local LLM、DB/API/RN契約renameは追加しない。

# 2026-05-20 差分追記: EmlisAI Runtime Surface Quality Step0-12 snapshot差分

比較対象は、前提資料 `Cocolon_前提資料(101).zip` と最新実ファイル `Cocolon_13(2).zip` / `mashos-api_13(5).zip` です。Cocolon側のsource file countは `217` のまま、mashos-api側source file countは `543 -> 568`、合計 `760 -> 785` を最新coverage対象として読む。今回の差分は、ProductGate Measurement Step0-10後に、表示された観測文のruntime source / surface signature / scorecard surface metrics / coverage baseline / next branch / QA / Exit Gateをmeta-onlyで接続する工程です。

## Cocolon側

Cocolon RN側のsource追加・変更はありません。`InputFeedbackReplyModal` / `useInputFeedbackModal` / `InputScreen` の表示契約は維持され、`Emlisの観測` は public `observation_status=passed` かつ `comment_text` 非空の場合だけ表示します。

## mashos-api追加path

| path | 差分の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_runtime_surface_quality_contract_inventory.py` | Step0。Runtime Surface Quality工程のcontract inventory。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_runtime_surface_source_lock.py` | Step1。実表示文のcomposer / surface / tone / repair由来を本文なしで固定する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_quality_signature.py` | Step2。line role / connector / predicate / ending / grammar warning / signature hashを作る。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_runtime_surface_coverage_baseline.py` | Step4。coverage group別のruntime surface baselineを集計する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_quality_branching.py` | Step5。runtime / grounding / grammar / surface / tone / QAの次branchを決める。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_runtime_surface_complete_activation_branch.py` | Step6。complete_initial runtimeが実際に測定可能か確認する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer_anti_template.py` | Step7。固定文ではなく文法部品選択をanti-template化する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_phrase_unit_grammar_normalizer.py` | Step8。PhraseUnitの不自然な名詞化・助詞残り・未完了句を材料段階で扱う。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_runtime_surface_tone_engine_2_1.py` | Step9。診断化・命令・慰めすぎ・距離感崩れをmeta-onlyで検出する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_runtime_surface_self_repair.py` | Step10。surface reasonをbounded self-repair targetへ変換する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_runtime_surface_blind_qa_long_run.py` | Step11。Blind QA候補とLong-run signature diversityを本文なしで扱う。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_runtime_surface_exit_gate.py` | Step12。handoff-onlyのExit Gate summaryを作る。 |
| `mashos-api/ai/tests/test_emlis_ai_runtime_surface_quality_contract_inventory_step0.py` | Step0。contract inventory regression。 |
| `mashos-api/ai/tests/test_emlis_ai_runtime_surface_source_lock_step1.py` | Step1。source lock regression。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_surface_quality_signature_step2.py` | Step2。surface signature regression。 |
| `mashos-api/ai/tests/test_emlis_ai_runtime_surface_scorecard_metrics_step3.py` | Step3。scorecard surface metrics regression。 |
| `mashos-api/ai/tests/test_emlis_ai_runtime_surface_coverage_baseline_step4.py` | Step4。coverage baseline regression。 |
| `mashos-api/ai/tests/test_emlis_ai_runtime_surface_quality_branching_step5.py` | Step5。branch resolver regression。 |
| `mashos-api/ai/tests/test_emlis_ai_runtime_surface_complete_activation_branch_step6.py` | Step6。complete runtime activation branch regression。 |
| `mashos-api/ai/tests/test_emlis_ai_runtime_surface_realizer_anti_template_step7.py` | Step7。anti-template regression。 |
| `mashos-api/ai/tests/test_emlis_ai_runtime_surface_phrase_unit_grammar_normalizer_step8.py` | Step8。grammar normalizer regression。 |
| `mashos-api/ai/tests/test_emlis_ai_runtime_surface_tone_engine_2_1_step9.py` | Step9。Tone Engine 2.1 regression。 |
| `mashos-api/ai/tests/test_emlis_ai_runtime_surface_self_repair_step10.py` | Step10。surface-aware self-repair regression。 |
| `mashos-api/ai/tests/test_emlis_ai_runtime_surface_blind_qa_long_run_step11.py` | Step11。Blind QA / Long-run regression。 |
| `mashos-api/ai/tests/test_emlis_ai_runtime_surface_exit_gate_step12.py` | Step12。Exit Gate regression。 |

## mashos-api変更path

| path | 差分の意味 |
|---|---|
| `emlis_ai_reply_service.py` | source lock、complete activation、signature、grammar/tone metaをruntime metaへ接続する。 |
| `emlis_ai_complete_reply_diagnostics_service.py` | runtime surface / grammar / tone diagnosticsを本文なしでsummaryへ接続する。 |
| `emlis_ai_complete_product_quality_measurement_connection.py` | Step1-12 report、scorecard surface metrics、branch、self-repair、Blind QA、Exit Gateを接続する。 |
| `emlis_ai_complete_product_quality_scorecard_service.py` | surface metrics / tone metrics / self-repair / Blind QA / Long-runをscorecardへ接続する。 |
| `emlis_ai_complete_release_ladder_service.py` | surface / coverage / QA / Exit Gate blockerをrelease ladderへ接続する。 |
| `emlis_ai_complete_scorecard_service.py` | coverage runtime baselineとの集計境界を接続する。 |
| `emlis_ai_coverage_matrix_service.py` | coverage group missingをshort_dailyへ流さず保持する。 |
| `emlis_ai_complete_surface_realizer.py` | Step7 anti-templateとStep9 tone guardへ接続する。 |
| `emlis_ai_complete_sentence_planner.py` | relation line / anti-template向けのplan情報を整える。 |
| `emlis_ai_relation_surface_contract.py` | relation markerが固定骨格に戻らないようsurface contractを調整する。 |
| `emlis_ai_complete_material_service.py` | PhraseUnit Grammar Normalizerを材料段階へ接続する。 |
| `emlis_ai_phrase_shaping_service.py` | 不自然な名詞化・助詞残りをgrammar normalizerへ渡す。 |
| `emlis_ai_reply_final_review_service.py` | grammar / tone final review guardを追加する。 |
| `emlis_ai_complete_tone_policy.py` | Tone Engine 2.1の距離感・ending policyへ接続する。 |
| `emlis_ai_complete_self_repair_service.py` | surface-aware repair reason aliasを受ける。 |
| `emlis_ai_long_term_quality_service.py` | long-run surface signature diversityを接続する。 |

## Step0-12 の読み方

| Step | owner | current boundary |
|---|---|---|
| Step0 Baseline / Contract Inventory | `emlis_ai_runtime_surface_quality_contract_inventory.py` | Post ProductGate Measurement のRuntime Surface Quality工程をmeta-onlyで開始し、RN/API/DB/Gate/public release非対象を固定する。 |
| Step1 Runtime Surface Source Lock | `emlis_ai_runtime_surface_source_lock.py`, `emlis_ai_reply_service.py` | 実表示文が complete_initial / limited / a1_equivalent / unavailable のどのruntime由来かを本文なしmetaで固定する。 |
| Step2 Surface Signature Measurement | `emlis_ai_complete_surface_quality_signature.py` | line role、connector、predicate、ending、grammar warning、signature hashを作り、同型骨格を本文なしで測定する。 |
| Step3 Scorecard Surface Metrics接続 | `emlis_ai_complete_product_quality_scorecard_service.py`, `emlis_ai_complete_product_quality_measurement_connection.py` | surface_signature / surface_major / grammar_warning をscorecard eventへ接続し、template majorをrelease blockerへ渡す。 |
| Step4 Coverage Runtime Baseline | `emlis_ai_runtime_surface_coverage_baseline.py`, `emlis_ai_coverage_matrix_service.py` | 7coverage group別にdisplay / binding / surface / grammarの詰まりを集計し、missingを `coverage_group_missing` として残す。 |
| Step5 Branch Resolver | `emlis_ai_complete_surface_quality_branching.py` | runtime / grounding / grammar / surface / tone / Blind QAの次branchを優先順位で決め、原因未分類のまま修正へ進まない。 |
| Step6 Complete Runtime Activation Branch | `emlis_ai_runtime_surface_complete_activation_branch.py` | Step5がcomplete_runtime_activationを選んだ場合、AP0 / rollout / registry / source-lock alignmentを確認し、Complete由来と誤分類しない。 |
| Step7 Surface Realizer 2.1 Anti-Template | `emlis_ai_complete_surface_realizer_anti_template.py`, `emlis_ai_complete_surface_realizer.py`, `emlis_ai_complete_sentence_planner.py` | 固定完成文を増やさず、opening / connector / predicate / ending / relation lineの偏りを分散制御する。 |
| Step8 PhraseUnit Grammar Normalizer | `emlis_ai_phrase_unit_grammar_normalizer.py`, `emlis_ai_complete_material_service.py`, `emlis_ai_phrase_shaping_service.py` | `離れこと` 系、不自然な名詞化、助詞残り、未完了句を材料段階でdrop / rephrase / deferし、根拠なし補完を足さない。 |
| Step9 Tone Engine 2.1 | `emlis_ai_runtime_surface_tone_engine_2_1.py`, `emlis_ai_complete_tone_policy.py`, `emlis_ai_reply_final_review_service.py` | 診断化、命令、慰めすぎ、一般論化、距離感崩れ、ending同型反復を検出し、read feelingはBlind QAへ残す。 |
| Step10 Surface-aware Self-Repair | `emlis_ai_runtime_surface_self_repair.py`, `emlis_ai_complete_self_repair_service.py` | surface reason / grammar warning / gate reasonをbounded repair targetへ変換し、意味を足さず再計画する。 |
| Step11 Blind QA / Long-run | `emlis_ai_runtime_surface_blind_qa_long_run.py`, `emlis_ai_long_term_quality_service.py` | Blind QA候補をrow id / coverage / classificationで管理し、Long-runでsignature repetitionを測る。本文は保持しない。 |
| Step12 Exit Gate | `emlis_ai_runtime_surface_exit_gate.py`, `emlis_ai_complete_release_ladder_service.py` | Runtime Surface Quality工程のhandoff-only出口。next branch / release blockers / coverage gaps / QA gapsを残すが、Product Gate達成・public releaseはfalse。 |

## 境界維持

- Cocolon RN側のsource file countは `217` のままです。`Emlisの観測` は引き続き public `observation_status=passed` かつ `input_feedback.comment_text` 非空の場合だけ表示します。
- `/emotion/submit` route、public response key、DB physical name、DB write path、RN modal条件は変更しません。
- Reader / Grounding / Template / Display Gate は緩めません。表示率向上のために `rejected` を表示しません。
- raw input、memo、current_input、public `comment_text` 本文はdiagnostic / scorecard / release ladder / local report / Blind QA候補へ保存しません。
- 固定完成文テンプレ、入力専用runtime分岐、外部AI / local LLMは追加しません。
- Step12 Exit Gateはhandoff-onlyです。Product Gate達成、High Quality到達、public release適用、商品品質版完成宣言ではありません。

# 2026-05-21 差分追記: EmlisAI 観測返答 Step0-14 snapshot差分

比較対象は、前提資料 `Cocolon_前提資料(104).zip` と最新実ファイル `Cocolon_16(1).zip` / `mashos-api_16(2).zip` です。Cocolon側のsource file countは `217` のまま、mashos-api側source file countは `568 -> 601`、合計 `785 -> 818` を最新coverage対象として読む。今回の差分は、Runtime Surface Quality Step0-12後に、EmlisAI観測返答を `eligible_observation` / `low_information_observation` へroutingし、低情報入力も正規branchとして `passed + comment_text` へ接続する工程です。

## Cocolon側の変更ファイル

| file | 差分の読み方 |
|---|---|
| `Cocolon/screens/input/inputFeedbackModel.js` | Observation Reply Step11 optional meta / RN contractの確認対象。 |
| `Cocolon/screens/input/inputFeedbackObservationDiagnostics.js` | Observation Reply Step11 optional meta / RN contractの確認対象。 |
| `Cocolon/tests/rn-screen-contracts.test.js` | Observation Reply Step11 optional meta / RN contractの確認対象。 |

## mashos-api側の新規ファイル

| file | 差分の読み方 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_reply_contract.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_reply_contract_inventory.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_eligibility_service.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_user_fact_grounding_boundary.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_internal_question_service.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/services/ai_inference/config/emlis_observation_dictionary.schema.json` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/services/ai_inference/config/emlis_observation_dictionary.v1.json` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_dictionary_loader.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_material_connector.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_sentence_plan_roles.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_low_information_observation_composer.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_surface_realizer_tone.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_surface_realizer.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_display_repair_integration.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_scorecard_blind_qa.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_regression_fixture_coverage.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_exit_gate_handoff.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_reply_contract.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_current_display_contract.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/tests/test_emlis_ai_low_information_red_cases.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_eligibility_service.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/tests/test_emlis_ai_user_fact_grounding_boundary.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/tests/test_emlis_ai_internal_question_service.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_dictionary_loader.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_material_connector.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_sentence_plan_roles.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/tests/test_emlis_ai_low_information_observation_composer.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_surface_realizer_tone.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_display_repair_integration.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_rn_optional_meta_contract.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_scorecard_blind_qa.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_regression_fixture_coverage.py` | Observation Reply Step0-14 の新規owner。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_exit_gate_handoff.py` | Observation Reply Step0-14 の新規owner。 |

## mashos-api側の変更ファイル

| file | 差分の読み方 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_display_gate.py` | Observation Reply Step0-14 を既存Composer / Gate / Scorecardへ接続する変更owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | Observation Reply Step0-14 を既存Composer / Gate / Scorecardへ接続する変更owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_material_service.py` | Observation Reply Step0-14 を既存Composer / Gate / Scorecardへ接続する変更owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_focus_selector.py` | Observation Reply Step0-14 を既存Composer / Gate / Scorecardへ接続する変更owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_relation_graph_service.py` | Observation Reply Step0-14 を既存Composer / Gate / Scorecardへ接続する変更owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_sentence_planner.py` | Observation Reply Step0-14 を既存Composer / Gate / Scorecardへ接続する変更owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py` | Observation Reply Step0-14 を既存Composer / Gate / Scorecardへ接続する変更owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_tone_policy.py` | Observation Reply Step0-14 を既存Composer / Gate / Scorecardへ接続する変更owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_template_echo_guard.py` | Observation Reply Step0-14 を既存Composer / Gate / Scorecardへ接続する変更owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_product_quality_scorecard_service.py` | Observation Reply Step0-14 を既存Composer / Gate / Scorecardへ接続する変更owner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_product_quality_measurement_connection.py` | Observation Reply Step0-14 を既存Composer / Gate / Scorecardへ接続する変更owner。 |

| Step | 実装名 | 主なowner | 構造上の読み方 |
|---|---|---|---|
| Step0 | Baseline / Contract Inventory | `emlis_ai_observation_reply_contract_inventory.py` | 現行表示契約・Free境界・低情報red casesを固定する。 |
| Step1 | Observation Reply Contract | `emlis_ai_observation_reply_contract.py` | `eligible_observation` / `low_information_observation` をpublic statusではなくmeta契約として定義する。 |
| Step2 | Observation Eligibility Router | `emlis_ai_observation_eligibility_service.py` | 文字数ではなく現在入力の根拠・関係・曖昧さでeligible/low_informationを分類する。 |
| Step3 | User Fact Grounding Boundary | `emlis_ai_user_fact_grounding_boundary.py` | Freeではユーザー辞書を使わず、サブスクでも辞書だけで低情報をeligible化しない。 |
| Step4 | Internal Question Layer | `emlis_ai_internal_question_service.py` | 入力から答えられる内部問い、user factで補助できる問い、答えられない問いをmeta化する。 |
| Step5 | Observation Dictionary Schema | `config/emlis_observation_dictionary.*`, `emlis_ai_observation_dictionary_loader.py` | 完成文テンプレではなく観測語彙・質問語彙の素材辞書を管理する。 |
| Step6 | Material / Focus / Relation Connector | `emlis_ai_observation_material_connector.py` | eligibility / unknown slot / inference depth を Complete Material / Focus / Relation層へ流す。 |
| Step7 | SentencePlan Observation Roles | `emlis_ai_observation_sentence_plan_roles.py`, `emlis_ai_complete_sentence_planner.py` | 既存line_roleを壊さず `line.meta.observation_roles` で4役割・低情報roleを持つ。 |
| Step8 | Low Information Observation Composer | `emlis_ai_low_information_observation_composer.py` | 低情報入力を正規branchとして、見える範囲の観測と質問を作る。 |
| Step9 | Surface Realizer / Tone Update | `emlis_ai_observation_surface_realizer_tone.py`, `emlis_ai_observation_surface_realizer.py` | 低情報質問ending、eligible状態言語化、Tone / Template Guardを観測role対応にする。 |
| Step10 | Display / Repair Integration | `emlis_ai_observation_display_repair_integration.py`, `emlis_ai_reply_service.py`, `emlis_ai_display_gate.py` | 低情報観測も既存 `passed + comment_text` 契約で表示可能にする。Gateは緩めない。 |
| Step11 | RN Contract Test / Optional Meta | `inputFeedbackModel.js`, `inputFeedbackObservationDiagnostics.js`, `rn-screen-contracts.test.js` | `observation_reply_kind` は任意meta。表示可否は `passed + commentText` のまま。 |
| Step12 | Scorecard / Blind QA | `emlis_ai_observation_scorecard_blind_qa.py` | always_display / false_eligible / user fact違反 / overclaim / template反復などをmeta-onlyで測る。 |
| Step13 | Regression Fixture Coverage | `emlis_ai_observation_regression_fixture_coverage.py` | 低情報・eligible・Free境界・サブスク明示/非明示fact・過剰補完誘発のcoverageを固定する。 |
| Step14 | Exit Gate / Handoff | `emlis_ai_observation_exit_gate_handoff.py` | release宣言ではなく、次工程へ渡せるかのhandoff-only exit gate。 |

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

# 2026-05-21 差分追記: Emlis観測専用辞書 Phase0-5 snapshot差分

比較対象は、前提資料 `Cocolon_前提資料(106).zip` と最新実ファイル `Cocolon_6(32).zip` / `mashos-api_6(26).zip` です。Cocolon側のsource file countは `217` のまま、mashos-api側source file countは `601 -> 613`、合計 `818 -> 830` を最新coverage対象として読む。今回の差分は、EmlisAI 観測返答 Step0-14 の上に、Emlis観測専用辞書を入力束 / relation / inference chain / Gate materialとして実装する工程です。

## Cocolon側の変更ファイル

今回の差分では、RN側のsource追加・変更はありません。RN表示条件は既存の `passed + commentText` のままです。

## mashos-api側の新規ファイル

| file | 差分の読み方 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_current_input_bundle.py` | Phase1 owner。`current_input` をEmlisAI内部入力束として正規化する。 |
| `mashos-api/ai/services/ai_inference/config/emlis_observation_structure_dictionary.schema.json` | Phase2 owner。構造観測辞書の実装用schema。 |
| `mashos-api/ai/services/ai_inference/config/emlis_observation_structure_dictionary.v1.json` | Phase2 owner。初期relation / entry / policyを持つ構造観測辞書。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_dictionary_loader.py` | Phase3 owner。load / validate / select helper。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_material_service.py` | Phase4 owner。辞書からtext-free observation structure materialを作る。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_connection_service.py` | Phase4 owner。Gate / Composer接続reportを作る。 |
| `mashos-api/ai/tests/test_emlis_ai_current_input_bundle.py` | Phase1 test。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_structure_dictionary_schema.py` | Phase2 schema test。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_structure_dictionary_loader.py` | Phase3 loader / validator test。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_structure_phase4_connection.py` | Phase4 connection test。 |
| `mashos-api/ai/tests/fixtures/emlis_ai_observation_structure_phase5_cases.py` | Phase5 fixture / Blind QA cases。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_structure_phase5_fixtures_blind_qa.py` | Phase5 fixture / Blind QA test。 |

## mashos-api側の変更ファイル

| file | 差分の読み方 |
|---|---|
| `mashos-api/ai/services/ai_inference/emotion_submit_service.py` | current_input を内部入力束として正規化して渡す。public `/emotion/submit` contractは維持。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | 構造観測辞書接続metaをreply pathへadditiveに接続する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` | current_inputを内部正規化して読む。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_evidence_ledger_service.py` | current_input正規化と構造材料読みの境界を維持する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_eligibility_service.py` | 構造materialをeligible / low-information境界の補助材料として扱う。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_internal_question_service.py` | 構造辞書の内部問いを既存のinternal question層へ接続する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_display_gate.py` | structure gate reportをtraceへadditiveに接続する。Gateは緩めない。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_conversation_composer_service.py` | observation_structure_materialをComposer materialとして読む。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_kernel.py` | 構造観測辞書connectionをobservation kernel側へ接続する。 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/emlis_observation_composer.py` | 共通文章生成基盤adapterで構造materialを完成文ではなく材料として扱う。 |

## Phase0-5の固定契約

- `/emotion/submit` のpublic route、request key、response keyは変更しない。
- DB physical name、DB write path、RN visible contract、`Emlisの観測` の表示条件は変更しない。
- `input_feedback.comment_text` は引き続きpublic表示本文の互換keyとして保持する。
- `emlis_observation_dictionary.v1.json` は表面素材 / guard signature 系辞書として残し、構造観測辞書は別ファイルで持つ。
- 構造観測辞書は完成返答文テンプレ集ではなく、入力束から relation / internal question / allowed・forbidden inference / gate material を作る内部辞書として読む。
- 構造material / connection metaには raw `memo` / `memo_action` / 完成返答本文を流さない。

# 2026-05-22 差分追記: EmlisAI Step10 Repair Boundary snapshot差分

比較対象は、前提資料 `Cocolon_前提資料(109).zip` と最新実ファイル `Cocolon_6(33).zip` / `mashos-api_6(27).zip` です。Cocolon側のsource file countは `217` のまま、mashos-api側source file countも `613` のまま、合計 `830` を最新coverage対象として読む。今回の差分は新規ファイル追加ではなく、既存のStep10 Display / Repair Integrationが、Phase7 rollout blockやpre-connection blockを低情報観測として表示化しないための境界補正です。

## Cocolon側の変更ファイル

今回の差分では、RN側のsource追加・変更はありません。RN表示条件は既存の `observation_status === passed` かつ `commentText` 非空のままです。

## mashos-api側の変更ファイル

| file | 差分の読み方 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_display_repair_integration.py` | `_composer_resolution_block_reasons()` を拡張し、`blocked_rollout`、`pre_connection_stop_stage=rollout`、`limited_composer_rollout_not_allowed`、`complete_initial_rollout_not_allowed`、`phase7_rollout_gate_blocked` をStep10 repair不可理由として扱う。`unsupported_sentence` 等の非修復AI-generated rejectionも低情報branchへ逃がさない。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | `_step10_repair_runtime_block_reason()` を二重防御として使い、Phase7 rollout block時に `repair_allowed=False` / `step10_blocked_by_phase7_rollout` をStep10 repairへ渡す。feature flag disabledやordinary unavailableは一律blockしない。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_display_repair_integration.py` | blocked rollout単体test、Step10 meta整合test、feature flag disabledと低情報repairの境界test、safety fail-closed testを持つ。 |
| `mashos-api/ai/tests/test_emlis_ai_phase7_staged_release.py` | 非allowlist internal rolloutで `reply.comment_text == ""`、Step10 `applied == false`、blocked reasons、public contract非変更を固定する。reply_service runtime block helperも確認する。 |

## 固定された境界

- 通常の低情報入力は `low_information_observation` として `passed + comment_text` へ接続できる。
- Phase7 rollout block / composer pre-connection rollout stop / release gate block は、観測品質上のfailureではなく実行不可境界として `unavailable` / empty commentのまま残す。
- `limited_composer_rollout_not_allowed` はStep10 repair不可reasonとして扱う。
- `feature_flag_disabled` やordinary unavailableは、今回のrollout block理由とは別扱いにし、真正の低情報入力を一律blockしない。
- AI-generated candidate が `unsupported_sentence` / `graph_evidence_not_used` / `core_relation_not_reflected` / `phase8_body_too_short` でrejectedされた場合、低情報branchへ再ルーティングして本文表示しない。
- Step10 metaは `applied=false`、`low_information_repair_applied=false`、`comment_text_allowed=false`、`blocked_reasons` にruntime + composer理由、`public_status_extended=false`、`rn_visible_contract_changed=false`、`api_route_changed=false`、`db_physical_name_changed=false` を保持する。

## 実ファイル確認結果

| 確認 | 結果 |
|---|---|
| source count | `Cocolon=217`、`mashos-api=613`、`total=830`。新規source file追加なし。 |
| Cocolon差分 | RN source変更なし。 |
| mashos-api差分 | 既存4ファイルのみ変更。 |
| 主要確認test | `test_phase7_internal_stage_blocks_non_allowlisted_default_client`、`test_step10_does_not_repair_blocked_rollout_resolution`、`test_step10_rollout_block_meta_contract_is_attached_consistently`、`test_step10_e2e_rejected_candidate_never_exposes_generated_body` を確認対象として扱う。 |

## 変更していないcontract

- `/emotion/submit` public route
- request / response key
- `input_feedback.comment_text`
- `input_feedback.emlis_ai.observation_status`
- public `observation_status` enum
- RN visible title `Emlisの観測`
- RN表示条件 `passed + commentText`
- DB physical name / write path
- Emlis観測専用辞書json / schema
- Cocolon基盤構造辞書


# 2026-05-22 差分追記: Emlis観測専用辞書 UpdateDesign ActionConversion / UnformedSelfInsight snapshot差分

比較対象は、前提資料 `Cocolon_前提資料(111).zip` と最新実ファイル `Cocolon_8(12).zip` / `mashos-api_8(23).zip` です。Cocolon側のsource file countは `217` のまま、mashos-api側source file countは `613 -> 614`、合計 `830 -> 831` を最新coverage対象として読む。今回の差分は、Emlis観測専用辞書 Phase0-5 の上に、ActionConversion / UnformedSelfInsight / 飲み込んだ言葉の観測拡張を追加する工程です。

## Cocolon側の変更ファイル

今回の差分では、RN側のsource追加・変更はありません。RN表示条件は既存の `observation_status === passed` かつ `commentText` 非空のままです。

## mashos-api側の新規ファイル

| file | 差分の読み方 |
|---|---|
| `mashos-api/ai/tests/test_emlis_ai_observation_structure_phase6_forbidden_inference_meta_contract.py` | Phase6 forbidden inference / meta-only contract。raw input、public `comment_text`、完成返答文、辞書本文、public contract driftの混入を検査する。 |

## mashos-api側の変更ファイル

| file | 差分の読み方 |
|---|---|
| `mashos-api/ai/services/ai_inference/config/emlis_observation_structure_dictionary.v1.json` | `dictionary_version` を `emlis.observation_structure_dictionary.action_conversion_unformed_self_insight.2026-05-22` へ更新し、5 relation / 4 entryを追加。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_structure_dictionary_schema.py` | `19 relations / 18 entries`、追加relation / entry、surface policy、surface dictionary混入なしを固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_structure_dictionary_loader.py` | `我慢した` / `言えなかった` / `合わせた` / `わからない` のselect、追加relation、low_information_boundaryを固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_structure_phase4_connection.py` | 単語だけで強接続してよいrelationと、memo/memo_action差分・閉じ方根拠が必要なrelationを固定する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_material_service.py` | 新規relation用の明示語・根拠検出と、meta-only false flagsを追加する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_connection_service.py` | `relation_candidates` の過剰接続filterと、meta-only false flagsを追加する。 |
| `mashos-api/ai/tests/fixtures/emlis_ai_observation_structure_phase5_cases.py` | 6 fixture caseを追加し、expected / forbidden relation、low-information候補、material fieldsを固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_structure_phase5_fixtures_blind_qa.py` | fixtureを通じて material / connection のexpected / forbidden relationを検証する。 |

## 追加された辞書構造

| 種別 | 追加ID |
|---|---|
| relation | `unexpressed_output_stop`, `self_shape_alignment`, `action_conversion_history`, `conversion_history_closure`, `unformed_self_insight` |
| entry | `word_could_not_say`, `word_aligned_to_context`, `word_gaman`, `word_wakaranai` |

`emlis_observation_structure_dictionary.v1.json` は `19 relations / 18 entries` として読む。schema jsonは変更していない。`emlis_observation_dictionary.v1.json` も変更していない。

## Phase0-8の実装結果

| Phase | 実ファイル上の結果 |
|---|---|
| Phase 0 | ローカル基準面を確認。既存Step10 / structure dictionary周辺回帰を確認。 |
| Phase 1 | schema / loader testを先に更新。 |
| Phase 2 | 構造観測辞書JSONへ 5 relation / 4 entryを追加。 |
| Phase 3 | material / connection の接続テストを追加し、過剰接続をfailureとして固定。 |
| Phase 4 | material_service / connection_service を最小修正し、根拠なし強接続を防止。 |
| Phase 5 | Phase5 fixture / Blind QA caseを追加。 |
| Phase 6 | forbidden inference / meta-only contract testを追加し、service meta flagsを明示falseに揃える。 |
| Phase 7 | Step10 RepairBoundary回帰を通過。source変更なし。 |
| Phase 8 | 最終対象テスト一式を通過。source変更なし。 |

## 実ファイル確認結果

| 確認 | 結果 |
|---|---|
| source count | `Cocolon=217`、`mashos-api=614`、`total=831`。 |
| Cocolon差分 | RN source変更なし。 |
| mashos-api差分 | 1ファイル新規、8ファイル変更。 |
| 構造辞書 | `relations=19`、`entries=18`。 |
| 対象回帰 | `119 passed`。 |

## 変更していないcontract

- `/emotion/submit` public route
- request / response key
- `input_feedback.comment_text`
- `input_feedback.emlis_ai.observation_status`
- public `observation_status` enum
- RN visible title `Emlisの観測`
- RN表示条件 `passed + commentText`
- DB physical name / write path
- `emlis_observation_structure_dictionary.schema.json`
- `emlis_observation_dictionary.v1.json`
- Composer / Surface Realizer の完成返答文テンプレ
- Cocolon基盤構造辞書への正式登録


# 2026-05-23 差分追記: EmlisAI Runtime Surface Pre-Return Gate + Shallow Surface Realizer V2 Step0-10 snapshot差分

比較対象は、前提資料 `Cocolon_前提資料(113).zip` と最新実ファイル `Cocolon_12(5).zip` / `mashos-api_12(8).zip` です。Cocolon側のsource file countは `217` のまま、mashos-api側source file countは `614 -> 630`、合計 `831 -> 847` を最新coverage対象として読む。今回の差分は、EmlisAI reply runtimeで壊れたsurface候補が `passed + comment_text` にならないように、表示前gate、phrase unit guard、Shallow V2、low-information specificity、bounded repair / reroute、diagnostics / scorecard、exit criteriaを追加・接続する工程です。

## Cocolon側の変更ファイル

今回の差分では、RN側のsource file countは `217` のままです。`InputFeedbackReplyModal.js` / `useInputFeedbackModal.js` / `inputFeedbackModel.js` は、引き続き `observation_status === passed` かつ `commentText` 非空で `Emlisの観測` を表示する契約として読む。

## mashos-api側の新規ファイル

| file | 差分の読み方 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_runtime_surface_pre_return_gate.py` | Runtime Surface Pre-Return Gate contract。surface signatureと候補metaを評価し、表示前にallow/block/rerender/reroute/fail_closedを決める。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_bounded_repair_reroute.py` | surface fatal時のbounded repair / reroute decision。Shallow V2 rerenderは1回だけ。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_runtime_surface_exit_criteria.py` | 実機確認で見るべきexit criteriaをmeta-onlyで固定するhelper。 |
| `mashos-api/ai/tests/fixtures/emlis_ai_runtime_surface_red_fixtures.py` | `今までこと`、`大丈夫こと`、`その中でも` 連続など、public表示禁止surface fixture。 |
| `mashos-api/ai/tests/test_emlis_ai_runtime_surface_pre_return_gate.py` | Step0/1 red fixture / gate contract test。 |
| `mashos-api/ai/tests/test_emlis_ai_runtime_surface_pre_return_gate_step2.py` | Step2 表示前path接続test。 |
| `mashos-api/ai/tests/test_emlis_ai_malformed_nominalization_phrase_unit_guard.py` | Step3 壊れた `〜こと` phrase unit guard test。 |
| `mashos-api/ai/tests/test_emlis_ai_shallow_phrase_unit_guard_step4.py` | Step4 shallow phrase unit作成時guard test。 |
| `mashos-api/ai/tests/test_emlis_ai_shallow_surface_realizer_v2_step5.py` | Step5 Shallow Surface Realizer V2 test。 |
| `mashos-api/ai/tests/test_emlis_ai_low_information_specificity_policy_step6.py` | Step6 Low Information Specificity policy test。 |
| `mashos-api/ai/tests/test_emlis_ai_bounded_repair_reroute_step7.py` | Step7 bounded repair / reroute test。 |
| `mashos-api/ai/tests/test_emlis_ai_diagnostics_scorecard_step8.py` | Step8 diagnostics / scorecard test。 |
| `mashos-api/ai/tests/test_emlis_ai_runtime_surface_diagnostics_scorecard_step8.py` | Step8 runtime surface diagnostics / scorecard接続test。 |
| `mashos-api/ai/tests/test_emlis_ai_runtime_surface_regression_qa_step9.py` | Step9 Regression / QA test。 |
| `mashos-api/ai/tests/test_emlis_ai_observation_diagnostic_lockdown_surface_gate_step9.py` | Step9 diagnostic_lockdown surface gate分類test。 |
| `mashos-api/ai/tests/test_emlis_ai_runtime_surface_exit_criteria_step10.py` | Step10 exit criteria test。 |

## mashos-api側の変更ファイル

| file | 差分の読み方 |
|---|---|
| `mashos-api/ai/services/ai_inference/requirements.txt` | `jsonschema>=4.21.1` を追加。schema validationの実行依存。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_display_gate.py` | Runtime Surface Pre-Return Gate reportを最終表示判定に接続する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | surface gate実行、bounded rerender/reroute、diagnostic_summary / phase_gate_metaへの伝播を接続する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_display_repair_integration.py` | repair pathがsurface gateを迂回してpassedにしないようにする。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_sentence_quality_guard.py` | malformed nominalization reason / material quality guardを強化する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_phrase_unit_grammar_normalizer.py` | 壊れた `〜こと` phrase unitをDROP / DEFER / safe rephraseに寄せる。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_client.py` | shallow phrase unit guardとShallow Surface Realizer V2を実装する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_low_information_observation_composer.py` | safe anchorがある低情報入力のSpecificity planを追加する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_surface_realizer_tone.py` | anchor-specific低情報質問を汎用質問へ戻さないよう保持する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_reply_diagnostics_service.py` | runtime surface gate / Shallow V2 / Low Information Specificity diagnosticsを追加する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_scorecard_service.py` | runtime surface gate failureやmalformed phraseをscorecardへ集計する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_diagnostic_lockdown.py` | surface_quality_blocked分類とStep10 exit criteria summaryを追加する。 |
| `mashos-api/ai/tests/test_emlis_ai_limited_composer_client.py` | Shallow V2実装に合わせて既存limited composer回帰を更新する。 |

## Step0-10の実装結果

| Step | 実ファイル上の結果 |
|---|---|
| Step0 | スクショ由来の壊れたsurfaceをred fixtureとして固定。良文固定ではなくpublic表示禁止fixture。 |
| Step1 | `emlis.runtime_surface_pre_return_gate.v1` のin-code contract / schemaを定義。 |
| Step2 | reply_service / display_gate / repair_integrationへpre-return gateを接続。 |
| Step3 | malformed nominalization guardを強化し、壊れた `〜こと` を本文へ渡さない境界を作成。 |
| Step4 | shallow phrase unit作成時にguardを適用。 |
| Step5 | Shallow Surface Realizer V2で旧 `中心/その中でも` skeletonを標準表示から外す。 |
| Step6 | low-information safe anchor specificityを追加。 |
| Step7 | bounded repair / reroute contractを追加。 |
| Step8 | diagnostics / scorecardをruntime surface gate対応に更新。 |
| Step9 | Regression / QA と diagnostic_lockdown surface分類を追加。 |
| Step10 | 実機ログで見るべきexit criteriaをhelper / lockdown / testで固定。 |

## 実ファイル確認結果

| 確認 | 結果 |
|---|---|
| source count | `Cocolon=217`、`mashos-api=630`、`total=847`。 |
| Cocolon差分 | RN表示契約は `passed + commentText` のまま。 |
| mashos-api差分 | 16ファイル新規、既存backend owner / testを必要箇所のみ更新。 |
| 主要確認test | Step0-10主要回帰 `68 passed`、表示契約・repair・diagnostic_lockdown回帰 `39 passed`。 |

## 変更していないcontract

- `/emotion/submit` public route
- request / response key
- `input_feedback.comment_text`
- `input_feedback.emlis_ai.observation_status`
- public `observation_status` enum
- RN visible title `Emlisの観測`
- RN表示条件 `passed + commentText`
- DB physical name / write path
- `emlis_observation_structure_dictionary.schema.json`
- `emlis_observation_dictionary.v1.json`
- Composer / Surface Realizer の完成返答文テンプレ
- 外部AI / local LLM 前提


# 2026-05-24 差分追記: EmlisAI public feedback meta boundary / timeout recovery / low-information prompt / notification uuid boundary

この差分は、`Cocolon_前提資料(115).zip` と最新実ファイル `Cocolon_9(11).zip` / `mashos-api_9(15).zip` を確認した結果を、前提資料へ差分追記するものです。Cocolon側source countは `217` のまま、mashos-api側source countは `630 -> 635`、合計 `847 -> 852` として読む。今回の差分は、長文入力時のpublic response肥大化とRN timeout表示、低情報質問文、notification uuid warningを、既存contractを変えずに整理する工程です。

## 実装結果

| Step | 実ファイル上の結果 |
|---|---|
| Step0 | baseline確認対象は保持。RN表示契約とbackend Runtime Surface系を壊さない前提で進めた。 |
| Step1 | `test_emlis_ai_public_feedback_meta.py` でpublic meta sanitizerを先にred test化。 |
| Step2 | `emlis_ai_public_feedback_meta.py` を追加し、public-safe whitelist / hard byte limit / fail-closed unavailable metaを実装。 |
| Step3 | `emotion_submit_service.py` に接続。diagnostic log / lockdownはinternal meta、public responseはsanitized metaに分離。 |
| Step4 | `api_emotion_submit.py` / `home_gateway/emotion_reflection_publish_service.py` で `comment_text` 非空 + public `observation_status=passed` の時だけ `input_feedback` を返すよう更新。 |
| Step5 | `test_emotion_submit_public_feedback_meta_boundary.py` で巨大internal metaでもroute responseが肥大化しないこと、raw非混入、meta-only fail-closedでfeedbackを返さないことを固定。 |
| Step6 | `emotionSubmitApi.js` / `InputScreen.js` / `rn-screen-contracts.test.js` を更新。`/emotion/submit` timeoutは30000ms、TimeoutError時は保存失敗断定を避け、Home再読込を一度試し、入力欄/draftを残す。 |
| Step7 | low-information質問surfaceを `詳しく残せそうなら、〜残してみませんか。` 系へ更新。旧 `よければ、何がありましたか。` はruntime outputで禁止。 |
| Step8 | notification settingsの `owner_user_id` uuid filterへglobal sentinelを混ぜないhelper / testを追加。 |

## 追加・変更された主なowner

| 区分 | owner |
|---|---|
| public meta boundary | `emlis_ai_public_feedback_meta.py`, `test_emlis_ai_public_feedback_meta.py`, `test_emotion_submit_public_feedback_meta_boundary.py` |
| service / route接続 | `emotion_submit_service.py`, `api_emotion_submit.py`, `home_gateway/emotion_reflection_publish_service.py`, `test_emotion_submit_observation_diagnostic_log.py`, `test_emotion_reflection_publish_public_feedback_contract.py`, `contract/test_emlis_ai_contracts.py` |
| RN timeout recovery | `Cocolon/lib/api/home/emotionSubmitApi.js`, `Cocolon/screens/InputScreen.js`, `Cocolon/tests/rn-screen-contracts.test.js` |
| low-information question surface | `config/emlis_observation_dictionary.v1.json`, `emlis_ai_low_information_observation_composer.py`, `emlis_ai_observation_surface_realizer_tone.py`, `emlis_ai_observation_display_repair_integration.py`, 関連low-information / dictionary / runtime regression tests |
| notification uuid boundary | `api_emotion_submit.py`, `test_emotion_submit_notification_settings_uuid_boundary.py` |

## 実ファイル確認結果

| 確認 | 結果 |
|---|---|
| source count | `Cocolon=217`、`mashos-api=635`、`total=852`。 |
| Cocolon差分 | RN側は `/emotion/submit` 専用timeoutとtimeout recovery文言 / Home再読込 / draft保持を追加。Emlis表示条件は `passed + commentText` のまま。 |
| mashos-api差分 | public feedback meta sanitizer、internal/public meta分離、input_feedback返却条件、response肥大化回帰、low-information質問surface、notification uuid filter境界を追加。 |
| 実機確認 | この前提資料更新時点では、Render / 実機のresponseBytes、timeout再現消失、uuid warning消失は未確認。実ファイルと設計上の境界更新だけを前提資料へ反映する。 |

変更していないcontract:

- `/emotion/submit` public route
- request payload / response top-level key
- `input_feedback.comment_text`
- `input_feedback.emlis_ai`
- public `observation_status` enum
- RN visible title `Emlisの観測`
- RN表示条件 `passed + commentText`
- DB physical name / write path
- timeout時の自動再送禁止
- EmlisAI固定テンプレ共感文禁止


# 2026-05-24 差分追記: EmlisAI Visible Surface Acceptance QA Step0-8 snapshot差分

この差分は、`Cocolon_前提資料(117).zip` と最新実ファイル `Cocolon_9(12).zip` / `mashos-api_9(16).zip` を確認した結果を、前提資料へ差分追記するものです。Cocolon側source countは `217` のまま、mashos-api側source countは `635 -> 641`、合計 `852 -> 858` を最新coverage対象として読む。今回の差分は、EmlisAI immediate responseを「表示されるか」から「商品表示として読まれてよいか」へ進める、表示文品質受け入れGateの実装です。

## 実装結果

| Step | 実ファイル上の結果 |
|---|---|
| Step0 | `tests/fixtures/emlis_ai_visible_surface_acceptance_fixtures.py` を追加し、スクショ由来の malformed `たりこと`、中心感情/本文焦点ズレ、mixed pass、low-information prompt pass、`Userさん` out_of_scope をinventory化。 |
| Step1 | `emlis_ai_phrase_unit_grammar_normalizer.py` / `emlis_ai_limited_sentence_quality_guard.py` に `malformed_nominalization_tari_fragment` を追加。安全ケース `したこと` / `したりすること` / `見たり聞いたりすること` は通す。 |
| Step2 | `emlis_ai_runtime_surface_pre_return_gate.py` へ `たりこと` 検出を接続し、surface上でも `malformed_phrase_unit_count >= 1` として止める。 |
| Step3 | `emlis_ai_visible_surface_acceptance_gate.py` を追加。中心感情推定、冒頭焦点、bridge、positive-only over-burden、visible malformed surfaceをmeta-only reportで判定する。 |
| Step4 | `emlis_ai_reply_service.py` / `emlis_ai_display_gate.py` / `emlis_ai_observation_display_repair_integration.py` へ接続し、visible gate blocking時はpublic表示前にfail-closedする。 |
| Step5 | `emlis_ai_low_information_observation_composer.py` / `emlis_ai_observation_surface_realizer_tone.py` に tone profileを接続し、positive_onlyで負荷anchorなしの場合は重さ系をdefaultにしない。 |
| Step6 | `emlis_ai_public_feedback_meta.py` で `visible_surface_acceptance_gate` のpublic-safe summaryだけを許可し、raw input / evidence / comment_text本文はpublic metaへ入れない。blocking時は `input_feedback` を返さない。 |
| Step7 | `Cocolon/tests/rn-screen-contracts.test.js` にRN contract回帰を追加し、visible gate metaだけでは表示せず、`passed + comment_text` のみで表示することを固定。 |
| Step8 | `emlis_ai_observation_structure_dictionary_loader.py` の `jsonschema` eager importを外し、bundled schema subsetをstdlib検証へ寄せて回帰テストcollectionを安定化。 |

## 追加・変更された主なowner

| 区分 | owner |
|---|---|
| Visible Surface Acceptance Gate | `mashos-api/ai/services/ai_inference/emlis_ai_visible_surface_acceptance_gate.py`, `mashos-api/ai/tests/test_emlis_ai_visible_surface_acceptance_gate.py` |
| 表示文QA inventory | `mashos-api/ai/tests/fixtures/emlis_ai_visible_surface_acceptance_fixtures.py`, `mashos-api/ai/tests/test_emlis_ai_visible_surface_acceptance_inventory_step0.py` |
| `たりこと` malformed nominalization | `emlis_ai_phrase_unit_grammar_normalizer.py`, `emlis_ai_limited_sentence_quality_guard.py`, `emlis_ai_runtime_surface_pre_return_gate.py`, `test_emlis_ai_malformed_nominalization_phrase_unit_guard.py`, `test_emlis_ai_runtime_surface_pre_return_gate_step2.py` |
| reply path接続 | `emlis_ai_reply_service.py`, `emlis_ai_display_gate.py`, `emlis_ai_observation_display_repair_integration.py`, `test_emlis_ai_visible_surface_acceptance_reply_path_step4.py` |
| low-information tone profile | `emlis_ai_low_information_observation_composer.py`, `emlis_ai_observation_surface_realizer_tone.py`, `test_emlis_ai_low_information_tone_profile_step5.py` |
| public meta sanitizer | `emlis_ai_public_feedback_meta.py`, `test_emlis_ai_public_feedback_meta.py`, `test_emotion_submit_public_feedback_meta_boundary.py` |
| RN contract | `Cocolon/tests/rn-screen-contracts.test.js` |
| 回帰実行安定化 | `emlis_ai_observation_structure_dictionary_loader.py` |

## 実ファイル確認結果

| 確認 | 結果 |
|---|---|
| source count | `Cocolon=217`、`mashos-api=641`、`total=858`。 |
| Cocolon差分 | RN画面本体は変更なし。`rn-screen-contracts.test.js` にVisible Surface Acceptance QA契約を追加し、`Emlisの観測` 表示条件は `passed + commentText` のまま。 |
| mashos-api差分 | Visible Surface Acceptance Gate、表示文QA fixture、`たりこと` guard接続、reply path / display gate接続、low-information tone profile、public-safe visible gate summary、辞書loader import安定化を追加。 |
| 対象回帰 | Step0-8中核回帰 `100 passed, 1 warning`、関連回帰 `40 passed`、辞書loader / schema / eligibility周辺 `93 passed`、RN contract `27 passed` として前工程報告で確認済み。 |

## 変更していないcontract

- `/emotion/submit` public route
- request payload / response top-level key
- `input_feedback.comment_text`
- `input_feedback.emlis_ai.observation_status`
- public `observation_status` enum
- RN visible title `Emlisの観測`
- RN表示条件 `passed + commentText`
- DB physical name / write path
- `Userさん` のaccount name表示を赤ケースにしない方針
- 外部AI / local LLM 非使用
- EmlisAI固定テンプレ共感文禁止


# 2026-05-25 差分追記: EmlisAI Product Visible Surface Reliability + Koto Splice Repair Step0-8 snapshot差分

この差分は、`Cocolon_前提資料(120).zip` と最新実ファイル `Cocolon_8(14).zip` / `mashos-api_8(27).zip` を確認した結果を、前提資料へ差分追記するものです。source countは `Cocolon=217`、`mashos-api=641`、`total=858` のままです。今回の差分は、前回の Visible Surface Acceptance QA の上に、C相当の `取らなければこと` / `予感こと` 系を商品表示REDとして固定し、B相当の機械的relation文を修復対象へ回し、block後に一回だけ安全再表面化へ回す境界を足したものです。

## 実装結果

| Step | 実ファイル上の結果 |
|---|---|
| Step0 | RN表示条件、タイトル、public meta boundary、Display Gate fail-closed境界を確認。RN本体、API route、DB write pathは変更しない。 |
| Step1 | A/B/C/表示なしの visible / runtime fixture inventoryを更新。`visible_surface_red_conditional_koto_splice_20260524`、`visible_surface_red_prediction_noun_koto_splice_20260524`、`visible_surface_repair_relation_skeleton_mechanical_20260524`、`runtime_surface_red_*` を基準化。 |
| Step2 | `emlis_ai_phrase_unit_grammar_normalizer.py` / `emlis_ai_limited_sentence_quality_guard.py` に `malformed_nominalization_conditional_fragment`、`malformed_nominalization_prediction_noun_fragment`、`residual_koto_splice_fragment`、`long_clause_koto_attachment_risk` を追加。`感じたこと` / `必要なこと` / `予定のこと` / `予感があること` / `しなければならないこと` は巻き込まない。 |
| Step3 | `emlis_ai_complete_surface_quality_signature.py` / `emlis_ai_runtime_surface_pre_return_gate.py` へ新koto splice codeを反映。`koto_splice_detected` / `koto_splice_codes` / `surface_malformed_nominalization_codes` をmeta-onlyで持ち、shallow pathなら `rerender_shallow_v2`、再修復不可ならblockへ寄せる。 |
| Step4 | `emlis_ai_visible_surface_acceptance_gate.py` で新koto splice codeをRED化し、`surface_relation_skeleton_major` / `surface_relation_skeleton_stack` / `analytic_register_leak` を計算する。C相当はred、B相当はrepair_required、A相当はpassに分ける。 |
| Step5 | `emlis_ai_relation_surface_contract.py` に `PhraseSurfaceShapeSignal` / `classify_phrase_surface_shape(...)` / `compress_phrase_for_relation_surface(...)` を追加し、`emlis_ai_limited_composer_client.py` で `phrase + こと` 直結と長いraw clauseのrelation line流入を避ける。`状態が一色ではありません` / `一つの要素だけではありません` の機械的stackは標準relation文から外す。 |
| Step6 | `emlis_ai_bounded_repair_reroute.py` / `emlis_ai_reply_service.py` へ `visible_surface_acceptance_gate_report` を接続し、Visible Gateの `action=rerender_surface` も一回修復候補へ回す。`rerender_attempt_limit=1` は維持する。 |
| Step7 | `emlis_ai_public_feedback_meta.py` / `emotion_submit_service.py` / `emlis_ai_reply_service.py` / `emlis_ai_observation_diagnostic_lockdown.py` へ `display_absence_summary` と `candidate_blocked_koto_splice` / `candidate_blocked_relation_skeleton` / `candidate_repair_attempted` 等のpublic-safe / internal diagnostic分類を追加。raw input、candidate本文、comment_text本文は出さない。 |
| Step8 | `Cocolon/tests/rn-screen-contracts.test.js` に、Step7 diagnostic metaだけではRN表示を開かない契約を追加。表示条件は public `input_feedback.comment_text` + `emlis_ai.observation_status=passed` のまま。 |

## 追加・変更された主なowner

| 区分 | owner |
|---|---|
| koto splice fixture inventory | `tests/fixtures/emlis_ai_visible_surface_acceptance_fixtures.py`, `tests/fixtures/emlis_ai_runtime_surface_red_fixtures.py`, `test_emlis_ai_visible_surface_acceptance_inventory_step0.py` |
| PhraseUnit / Limited Guard | `emlis_ai_phrase_unit_grammar_normalizer.py`, `emlis_ai_limited_sentence_quality_guard.py`, `test_emlis_ai_malformed_nominalization_phrase_unit_guard.py` |
| Runtime Surface Gate | `emlis_ai_complete_surface_quality_signature.py`, `emlis_ai_runtime_surface_pre_return_gate.py`, `test_emlis_ai_runtime_surface_pre_return_gate.py`, `test_emlis_ai_complete_surface_quality_signature_step2.py` |
| Visible Surface Acceptance Gate | `emlis_ai_visible_surface_acceptance_gate.py`, `test_emlis_ai_visible_surface_acceptance_gate.py` |
| Shallow Surface Realizer V2安全化 | `emlis_ai_relation_surface_contract.py`, `emlis_ai_limited_composer_client.py`, `test_emlis_ai_relation_surface_contract.py`, `test_emlis_ai_limited_composer_client.py` |
| bounded repair reroute | `emlis_ai_bounded_repair_reroute.py`, `emlis_ai_reply_service.py`, `test_emlis_ai_bounded_repair_reroute_step7.py` |
| public meta / diagnostic summary | `emlis_ai_public_feedback_meta.py`, `emotion_submit_service.py`, `emlis_ai_observation_diagnostic_lockdown.py`, `test_emlis_ai_public_feedback_meta.py`, `test_emotion_submit_observation_diagnostic_log.py` |
| RN contract | `Cocolon/tests/rn-screen-contracts.test.js` |

## 実ファイル確認結果

| 確認 | 結果 |
|---|---|
| source count | `Cocolon=217`、`mashos-api=641`、`total=858`。 |
| backend Step0-7周辺回帰 | `173 passed`。`PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference:tests python -m pytest -q ...` で確認。 |
| backend async diagnostic / contract | `8 passed, 1 warning`。warningは既存の Pydantic `@root_validator` deprecation。 |
| RN contract | `28 passed`。`npm test -- tests/rn-screen-contracts.test.js --runInBand` で確認。 |

## 変更していないcontract

- `/emotion/submit` public route
- request payload / response top-level key
- `input_feedback.comment_text`
- `input_feedback.emlis_ai.observation_status`
- RN visible title `Emlisの観測`
- RN表示条件 `passed + commentText`
- DB physical name / write path
- Display Gate / Grounding / Template Guardの緩和禁止
- raw input / evidence text / candidate本文 / public `comment_text` 本文のpublic meta混入禁止
- 外部AI / local LLM / 固定テンプレfallback 非使用

# 2026-05-25 差分追記: 環境状態出力観測構造 Phase0-1 前提資料差分

この差分は、`cocolon_environment_state_output_observation_structure_design_2026_05_25.md` をPhase0の新規設計書として追加し、Phase1として前提資料へ参照順・思想・命名・構造境界・ルール索引を差分反映するものです。実ファイルのコード変更、DB変更、API route変更、response key変更、RN表示条件変更、json/schema実ファイル化は行いません。

## 新規ファイル

| file | 構造上の意味 |
|---|---|
| `cocolon_environment_state_output_observation_structure_design_2026_05_25.md` | Cocolonの基本観測単位を「環境ラベル × 状態ラベル × 出力内容」として固定し、EmlisAI / Piece / Analysis へ段階展開するための正本設計書。 |

## 変更ファイル

| file | 変更内容 |
|---|---|
| `00_karen_read_first.md` | 読む順へ新規設計書を追加し、Phase0-1の前提資料境界を追記。 |
| `cocolon_thought_material_for_karen.md` | Cocolonの基本観測単位として「環境 × 状態 × 出力内容」を追記。 |
| `03_cocolon_naming_system.md` | `環境状態出力観測構造` / `environment_state_output_frame` 等を内部設計名・material候補として保管。 |
| `09_naming_boundary.md` | 既存field名・public contractを変えずに読む構造境界を追記。 |
| `05_cocolon_rule_file_index.md` | category原因化禁止、1件傾向化禁止、Analysis診断化禁止、Piece過圧縮防止を索引化。 |
| `07_latest_snapshot_diff.md` | このPhase0-1差分を記録。 |
| `manifest.json` | 新規設計書をdocsへ追加し、Phase0-1の資料差分snapshotを追加。 |

## 固定した読み方

```text
Cocolonの基本観測単位は、文章単体ではない。
Cocolonの基本観測単位は、環境ラベル × 状態ラベル × 出力内容である。
```

実装上の対応は次のように読む。

| 構造軸 | 既存field | 読み方 |
|---|---|---|
| 環境 | `category` + `memo_action` | 話題方向 / 実世界で起きたこと・したこと・状況 |
| 状態 | `emotion_details` + `strength` | 状態ラベル / 状態の重さ |
| 出力 | `memo` | その環境・状態で外に置かれた思考・解釈・出力内容 |
| 時間 | `created_at` | 観測時点。傾向化には再出現を見る。 |

## 三大中核への展開方針

| 中核 | 使い方 | 禁止 |
|---|---|---|
| EmlisAI | 現在入力1件を「今回の入力では」の範囲で観測する。 | 1件で傾向化しない。 |
| Piece | 公開可能な問いと答えへ整える時、環境・状態・出力条件を削りすぎない。 | 短縮要約で核を潰さない。 |
| Analysis | 期間内で同じ環境・状態・似た出力が再出現しているかを見る。 | 診断・人格化・タイプ分類しない。 |

## 変更していないcontract

- `/emotion/submit` public route
- request payload / response top-level key
- `input_feedback.comment_text`
- `input_feedback.emlis_ai.observation_status`
- public `observation_status` enum
- RN visible title `Emlisの観測`
- RN表示条件 `passed + commentText`
- DB physical name / write path
- json/schema実ファイル
- 外部AI / local LLM / 固定テンプレfallback

## 次工程

Phase2以降で、EmlisAI current input bundle との接続設計へ進む。`environment_state_output_frame` は内部material候補であり、実ファイル化は実装段階で現物コード・既存schema配置・テスト結果を見て判断する。


# 2026-05-25 差分追記: 環境状態出力観測構造 Phase2 current input bundle 接続

この差分は、Phase0-1で固定した `環境状態出力観測構造` を、EmlisAI current input bundle へ接続するための Phase2 実装である。Phase2では、公開payload・API route・DB physical name・RN表示条件・json/schema実ファイルを変更せず、`emlis_ai_current_input_bundle.py` の内部summaryとして、現在入力が `環境 / 状態 / 出力 / 時間` の各軸に必要な材料を持つことだけを text-free に固定した。

## 確認結果

| 確認項目 | 結果 |
|---|---|
| Phase1 前提資料追記 | `00_karen_read_first.md` / `cocolon_thought_material_for_karen.md` / `03_cocolon_naming_system.md` / `09_naming_boundary.md` / `05_cocolon_rule_file_index.md` / `07_latest_snapshot_diff.md` / `manifest.json` に反映済み。 |
| Phase0 設計書本体 | `manifest.json` と各資料から参照されているが、受領した `Cocolon_前提資料(122).zip` 内には実ファイル本体が見当たらなかったため、今回差分zipへ同梱して補完する。 |
| public contract | 変更なし。 |
| RN表示条件 | 変更なし。 |
| json/schema実ファイル化 | なし。 |

## 修正ファイル

| repository | file | 変更内容 |
|---|---|---|
| Cocolon_前提資料 | `cocolon_environment_state_output_observation_structure_design_2026_05_25.md` | 受領zipで欠落していたPhase0設計書本体を差分zipに再同梱。 |
| Cocolon_前提資料 | `07_latest_snapshot_diff.md` | Phase2 current input bundle 接続差分を追記。 |
| Cocolon_前提資料 | `manifest.json` | Phase2 source snapshot / policyを追記。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_current_input_bundle.py` | `to_environment_state_output_connection_summary()` を追加し、環境・状態・出力・時間の材料有無を text-free に返す。`normalize_emlis_current_input()` の返却shapeは変更しない。 |
| mashos-api | `ai/tests/test_emlis_ai_current_input_bundle.py` | Phase2 connection summary の軸材料、text-free性、category原因化禁止、single_record境界、public contract不変を固定するテストを追加。 |

## Phase2で固定した内部summary

`EmlisCurrentInputBundle.to_environment_state_output_connection_summary()` は、次だけを返す。

```text
- schema_version / phase / bundle_schema_version
- axis_presence
- environment_axis: category / memo_action があるか、categoryをcauseにしない境界
- state_axis: emotion_details / emotions があるか、strengthをcauseにしない境界
- output_axis: memo があるか、personality / period_tendencyにしない境界
- time_axis: single_recordであり、period tendencyへ使わない境界
- surface_policy: public payload変更なし、raw textなし、comment_textなし、schema実ファイル化なし
```

これは Phase3 の `environment_state_output_frame` builder ではない。Phase2では、current input bundle が後段builderへ渡せる材料を持つことを固定するだけである。

## 維持した禁止境界

```text
- /emotion/submit route変更なし
- request / response key変更なし
- DB physical name変更なし
- RN visible title / passed + commentText表示条件変更なし
- public metaへraw input / raw text / comment_text body追加なし
- categoryから原因を作らない
- emotion strengthから原因を作らない
- 1件の入力から期間傾向を作らない
- 回復処方を作らない
- schema json実ファイル化なし
```

## 実行テスト

```text
cd mashos-api/ai
pytest -q tests/test_emlis_ai_current_input_bundle.py
# 6 passed

pytest -q tests/test_emlis_ai_current_input_bundle.py tests/test_emlis_ai_current_input_grounding_guard.py
# 7 passed

pytest -q tests/test_emlis_ai_observation_structure_phase4_connection.py tests/test_emlis_ai_observation_structure_phase6_forbidden_inference_meta_contract.py tests/test_emlis_ai_public_feedback_meta.py
# 34 passed

python3 -m py_compile ai/services/ai_inference/emlis_ai_current_input_bundle.py
# passed
```

## 次の実装段階

次は Phase3 として、`EmlisCurrentInputBundle` から実際の `environment_state_output_frame` を作る内部builderを検討する。ただし、Phase3でも公開payload・DB・RN表示条件を変更せず、完成文ではなく text-free material として実装する。


# 2026-05-25 差分追記: 環境状態出力観測構造 Phase3 frame builder 内部実装

この差分は、Phase2で current input bundle に接続した `環境状態出力観測構造` を、Phase3として内部 `environment_state_output_frame` builder へ進めるものです。公開payload、API route、DB physical name、RN表示条件、json/schema実ファイルは変更しません。

## 確認結果

| 確認項目 | 結果 |
|---|---|
| Phase0設計書 | `cocolon_environment_state_output_observation_structure_design_2026_05_25.md` が前提資料内に存在。 |
| Phase1前提資料差分 | READ_FIRST / 思想資料 / 命名体系 / 名称混在境界 / ルール索引 / 最新差分 / manifest に反映済み。 |
| Phase2 current input bundle 接続 | `emlis_ai_current_input_bundle.py` に `to_environment_state_output_connection_summary()` があり、testで固定済み。 |
| public contract | 変更なし。 |
| RN表示条件 | 変更なし。 |
| json/schema実ファイル化 | なし。 |

## 修正ファイル

| repository | file | 変更内容 |
|---|---|---|
| Cocolon_前提資料 | `05_cocolon_rule_file_index.md` | 環境状態出力観測構造の単発観測frame builder ownerをPhase3実装済みとして更新。 |
| Cocolon_前提資料 | `07_latest_snapshot_diff.md` | Phase3 frame builder 差分を追記。 |
| Cocolon_前提資料 | `manifest.json` | Phase3 source snapshot / policyを追記。 |
| mashos-api | `ai/services/ai_inference/cocolon_environment_state_output_frame.py` | `EmlisCurrentInputBundle` から `environment_state_output_frame` を作る内部builderを新規追加。 |
| mashos-api | `ai/tests/test_cocolon_environment_state_output_frame.py` | 単発frame、text-free性、category原因化禁止、emotion strength原因化禁止、state_text_gap境界、missing axis境界を固定するテストを新規追加。 |

## Phase3で実装した内部frame

`build_environment_state_output_frame(...)` は、現在入力1件を次の内部materialへ変換する。

```text
- schema_version: cocolon.environment_state_output_frame.v1
- material_id: environment_state_output_frame
- phase: Phase3_environment_state_output_frame_builder
- source: source_record_id / selected_at / current_input / bundle_schema_version
- axis_presence: environment / state / output があるか
- environment_axis: category labels、memo_action evidence ids、categoryはcauseではない境界
- state_axis: emotion labels、strength summary、state_text_gap candidate、diagnosisではない境界
- output_axis: memo evidence ids、bounded output theme candidates、personality / period tendencyではない境界
- time_axis: single_recordであり、period tendencyへ使わない境界
- observation_structure_bridge: 既存Emlis観測辞書relation idとの候補接続。表示文には使わない。
- evidence: source_field / span_id / text_hash。raw memo / memo_action textは入れない。
- surface_policy: 完成文生成なし、comment_text生成なし、public contract変更なし、1件傾向化なし。
```

## 維持した禁止境界

```text
- /emotion/submit route変更なし
- request / response key変更なし
- DB physical name変更なし
- RN visible title / passed + commentText表示条件変更なし
- public metaへraw input / raw text / comment_text body追加なし
- categoryから原因を作らない
- emotion strengthから原因を作らない
- 1件の入力から期間傾向を作らない
- 1件の入力から人格・性格・タイプを作らない
- 回復処方を作らない
- 完成文テンプレを作らない
- schema json実ファイル化なし
```

## 実行テスト

```text
cd mashos-api/ai
pytest -q tests/test_cocolon_environment_state_output_frame.py tests/test_emlis_ai_current_input_bundle.py
# 10 passed

pytest -q tests/test_cocolon_environment_state_output_frame.py tests/test_emlis_ai_current_input_bundle.py tests/test_emlis_ai_current_input_grounding_guard.py tests/test_emlis_ai_observation_structure_phase4_connection.py tests/test_emlis_ai_observation_structure_phase6_forbidden_inference_meta_contract.py tests/test_emlis_ai_public_feedback_meta.py
# 45 passed

python3 -m py_compile services/ai_inference/cocolon_environment_state_output_frame.py services/ai_inference/emlis_ai_current_input_bundle.py
# passed
```

## 次の実装段階

次は Phase4 として、`environment_state_output_frame` を EmlisAI observation structure material へ接続する。ただし、Phase4でも完成文・public text・raw inputを返さず、Gate / Composerが参照できる内部materialとして接続する。

# 2026-05-25 差分追記: 環境状態出力観測構造 Phase4 EmlisAI observation material 接続

この差分は、Phase3で追加した `environment_state_output_frame` builder を、Phase4として EmlisAI observation structure material / connection / Display Gate trace へ接続するものです。公開payload、API route、DB physical name、RN表示条件、json/schema実ファイルは変更しません。`environment_state_output_frame` 本体はpublic response keyにはせず、Gate / Composerが参照できる内部safe projectionとして扱います。

## 確認結果

| 確認項目 | 結果 |
|---|---|
| Phase0設計書 | `cocolon_environment_state_output_observation_structure_design_2026_05_25.md` が前提資料内に存在。 |
| Phase1前提資料差分 | READ_FIRST / 思想資料 / 命名体系 / 名称混在境界 / ルール索引 / 最新差分 / manifest に反映済み。 |
| Phase2 current input bundle 接続 | `EmlisCurrentInputBundle.to_environment_state_output_connection_summary()` が存在。 |
| Phase3 frame builder | `cocolon_environment_state_output_frame.py` が存在し、単発入力からtext-free frameを作成できる。 |
| public contract | 変更なし。 |
| RN表示条件 | 変更なし。 |
| json/schema実ファイル化 | なし。 |

## 修正ファイル

| repository | file | 変更内容 |
|---|---|---|
| Cocolon_前提資料 | `05_cocolon_rule_file_index.md` | Phase4時点のowner / test indexへ更新。 |
| Cocolon_前提資料 | `07_latest_snapshot_diff.md` | Phase4 observation material 接続差分を追記。 |
| Cocolon_前提資料 | `manifest.json` | Phase4 source snapshot / policyを追記。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_observation_structure_material_service.py` | `environment_state_output_frame` を material のsafe projectionとして接続。`as_meta()` / `composer_payload()` / forward metaに内部materialとして追加。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_observation_structure_connection_service.py` | connection meta / composer metaへ `environment_state_output_frame` のsummaryを追加。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_display_gate.py` | observation structure gate traceへ `environment_state_output_frame` summary flagsをmeta-onlyで渡す。Display Gateは緩めない。 |
| mashos-api | `ai/tests/test_emlis_ai_observation_structure_phase4_connection.py` | material / connection / composer payload / Display Gate traceへsafe projectionが接続されること、raw textやpublic textが混入しないことを固定。 |

## Phase4で接続した内部material

```text
- environment_state_output_frame はpublic response keyではない。
- material / composer payload上では phase4_gate_composer_safe_projection として保持する。
- full builderの surface_policy はそのまま転送せず、frame_policy として閉じたboolean / ids / forbidden_claimsへ投影する。
- memo / memo_action のraw textは転送しない。
- outputは output_theme_ids などの構造idに留める。
- Gate traceには axis_presence / output_theme_ids / connected flags のみをmeta-onlyで渡す。
```

## 維持した禁止境界

```text
- /emotion/submit route変更なし
- request / response key変更なし
- DB physical name変更なし
- RN visible title / passed + commentText表示条件変更なし
- public metaへraw input / raw text / comment_text body追加なし
- environment_state_output_frameをpublic response keyとして追加しない
- categoryから原因を作らない
- emotion strengthから原因を作らない
- 1件の入力から期間傾向を作らない
- 1件の入力から人格・性格・タイプを作らない
- 回復処方を作らない
- 完成文テンプレを作らない
- schema json実ファイル化なし
- Display Gate / Grounding / Template Guardを緩めない
```

## 実行テスト

```text
cd mashos-api/ai
pytest -q tests/test_emlis_ai_observation_structure_phase4_connection.py
# 14 passed

pytest -q tests/test_cocolon_environment_state_output_frame.py tests/test_emlis_ai_current_input_bundle.py tests/test_emlis_ai_current_input_grounding_guard.py tests/test_emlis_ai_observation_structure_phase4_connection.py tests/test_emlis_ai_observation_structure_phase6_forbidden_inference_meta_contract.py tests/test_emlis_ai_public_feedback_meta.py
# 47 passed

python3 -m py_compile services/ai_inference/cocolon_environment_state_output_frame.py services/ai_inference/emlis_ai_observation_structure_material_service.py services/ai_inference/emlis_ai_observation_structure_connection_service.py services/ai_inference/emlis_ai_display_gate.py
# passed
```

## 次の実装段階

次は Phase5 として、EmlisObservationComposer で `environment_state_output_frame` safe projection を限定利用するか検討する。ただし、Phase5でも表示する場合は「今回の入力では」の単発観測範囲に限定し、傾向・性格・原因・回復方法としては出さない。


# 2026-05-25 差分追記: 環境状態出力観測構造 Phase5 EmlisObservationComposer 限定利用

この差分は、Phase4で EmlisAI observation structure material へ接続した `environment_state_output_frame` safe projection を、Phase5として EmlisObservationComposer / Runtime Surface Pre-Return Gate / Display Gate で限定利用できるようにするものです。公開payload、API route、DB physical name、RN表示条件、json/schema実ファイルは変更しません。

Phase5の目的は、`environment_state_output_frame` を完成文テンプレとして使うことではなく、Composerが表示文に使う場合の表面契約を固定することです。表示文に出る場合は「今回の入力では」等の単発観測範囲に限定し、傾向・性格・原因・回復方法として表面化させません。今回の更新では、Phase4 safe projectionに raw text を含まない `output_theme_candidates` を追加し、Limited Composerではそれを安全なtheme unitとscope markerとして限定利用できるようにしました。

## 確認結果

| 確認項目 | 結果 |
|---|---|
| Phase0設計書 | `cocolon_environment_state_output_observation_structure_design_2026_05_25.md` が前提資料内に存在。 |
| Phase1前提資料差分 | READ_FIRST / 思想資料 / 命名体系 / 名称混在境界 / ルール索引 / 最新差分 / manifest に反映済み。 |
| Phase2 current input bundle 接続 | `EmlisCurrentInputBundle.to_environment_state_output_connection_summary()` が存在。 |
| Phase3 frame builder | `cocolon_environment_state_output_frame.py` が存在し、単発入力からtext-free frameを作成できる。 |
| Phase4 observation material 接続 | `environment_state_output_frame` が material / connection / Display Gate trace へsafe projectionとして接続済み。 |
| public contract | 変更なし。 |
| RN表示条件 | 変更なし。 |
| json/schema実ファイル化 | なし。 |

## 修正ファイル

| repository | file | 変更内容 |
|---|---|---|
| Cocolon_前提資料 | `05_cocolon_rule_file_index.md` | Phase5時点のowner / test indexへ更新。 |
| Cocolon_前提資料 | `07_latest_snapshot_diff.md` | Phase5 EmlisObservationComposer 限定利用差分を追記。 |
| Cocolon_前提資料 | `manifest.json` | Phase5 source snapshot / policyを追記。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_observation_structure_material_service.py` | Phase4 safe projectionへ raw textを含まない `output_theme_candidates` を追加。Composerで使えるのはtheme id / evidence ids / confidenceのみ。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_conversation_composer_service.py` | Composer payloadへ `environment_state_output_surface_contract` を追加。Composer応答が単発観測範囲を外れた場合は `schema_invalid` として空本文にする。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_limited_composer_client.py` | `environment_state_output_frame` を安全なtheme unitと「今回の入力では」scope markerに限定して利用。1件入力から傾向・人格・原因・回復方法は生成しない。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_runtime_surface_pre_return_gate.py` | 表示直前Gateで、scope marker欠落、1件傾向化、人格/タイプ化、category原因化、回復処方surfaceをmeta-onlyで検出してblockする。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_display_gate.py` | Runtime Surface GateのPhase5判定をDisplay Gate traceへmeta-onlyで渡す。Display Gateは緩めない。 |
| mashos-api | `ai/tests/test_emlis_ai_observation_structure_phase5_limited_use.py` | Phase5のComposer payload、正常単発観測surface、傾向/人格/原因/回復処方surface blocking、Display Gate fail-closedを固定。 |

## Phase5で追加した限定利用契約

```text
- environment_state_output_surface_contract をComposer payloadへ追加する。
- contractは raw memo / raw memo_action / completed reply を含まない。
- 表示文に使う場合は single_record / 「今回の入力では」等のscope markerを必須にする。
- allowed_surface_claim_strength は single_observation に限定する。
- output_theme_ids / output_theme_candidates は構造idと根拠idとして渡すが、傾向・人格・原因・回復方法の表示には使わない。
- Limited Composerが使う場合は、raw textではなく安全なtheme phrase unitとして扱い、必ずsingle_record scope markerを付ける。
- Composerがoverclaim surfaceを返した場合は schema_invalid とし、comment_textを空にする。
- Runtime Surface Pre-Return Gateでも同じoverclaim surfaceをblockし、Display Gateへmeta-only traceを渡す。
```

## Phase5で止めるsurface

```text
- scope markerなしで environment_state_output_frame を使う表示文
- 1件入力から「いつも」「毎回」「傾向」「出やすい」「なりやすい」「パターン」とする表示文
- 「タイプ」「性格」「人格」「本質」「こういう人」などの人格・性格化表示文
- categoryや感情を原因として扱う表示文
- 「回復方法」「治る」「解決策」「戻りやすい」「すべき」などの処方表示文
```

## 維持した禁止境界

```text
- /emotion/submit route変更なし
- request / response key変更なし
- DB physical name変更なし
- RN visible title / passed + commentText表示条件変更なし
- public metaへraw input / raw text / comment_text body追加なし
- environment_state_output_frameをpublic response keyとして追加しない
- categoryから原因を作らない
- emotion strengthから原因を作らない
- 1件の入力から期間傾向を作らない
- 1件の入力から人格・性格・タイプを作らない
- 回復処方を作らない
- 完成文テンプレを作らない
- schema json実ファイル化なし
- Display Gate / Grounding / Template Guardを緩めない
```

## 実行テスト

```text
cd mashos-api/ai
pytest -q tests/test_emlis_ai_observation_structure_phase5_limited_use.py
# 6 passed

pytest -q tests/test_emlis_ai_observation_structure_phase5_limited_use.py tests/test_emlis_ai_observation_structure_phase5_fixtures_blind_qa.py tests/test_emlis_ai_observation_structure_phase4_connection.py tests/test_cocolon_environment_state_output_frame.py tests/test_emlis_ai_current_input_bundle.py tests/test_emlis_ai_runtime_surface_pre_return_gate.py tests/test_emlis_ai_observation_current_display_contract.py tests/test_emlis_ai_observation_structure_phase6_forbidden_inference_meta_contract.py tests/test_emlis_ai_public_feedback_meta.py
# 110 passed

python3 -m py_compile services/ai_inference/emlis_ai_conversation_composer_service.py services/ai_inference/emlis_ai_runtime_surface_pre_return_gate.py services/ai_inference/emlis_ai_display_gate.py services/ai_inference/emlis_ai_limited_composer_client.py services/ai_inference/cocolon_environment_state_output_frame.py services/ai_inference/emlis_ai_observation_structure_material_service.py services/ai_inference/emlis_ai_observation_structure_connection_service.py
# passed
```

## 次の実装段階

次は Phase6 として、PieceComposer への過圧縮防止接続を検討する。ただし、PieceではEmlisAIの話しかけ文や単発観測文を流用せず、環境・状態・出力条件を削りすぎてユーザーの核が潰れないようにするための内部材料として扱う。

# 2026-05-25 差分追記: 環境状態出力観測構造 Phase6 PieceComposer 過圧縮防止接続

この差分は、Phase3で内部実装した `environment_state_output_frame` を、Phase6としてPieceComposerの過圧縮防止へ接続するものです。接続目的は、Pieceの公開可能な問いと答えをEmlisAIの観測文へ寄せることではなく、環境・状態・出力条件を削りすぎてユーザーの核が「不安です」等の状態ラベル単体に潰れることを防ぐことです。

## 確認結果

| 確認項目 | 結果 |
|---|---|
| Phase0設計書 | `cocolon_environment_state_output_observation_structure_design_2026_05_25.md` が前提資料内に存在。 |
| Phase1前提資料差分 | READ_FIRST / 思想資料 / 命名体系 / 名称混在境界 / ルール索引 / 最新差分 / manifest に反映済み。 |
| Phase2 current input bundle 接続 | `EmlisCurrentInputBundle.to_environment_state_output_connection_summary()` が存在。 |
| Phase3 frame builder | `cocolon_environment_state_output_frame.py` が存在し、単発入力からtext-free frameを作成できる。 |
| Phase4 observation material 接続 | `environment_state_output_frame` が EmlisAI material / connection / Display Gate trace へsafe projectionとして接続済み。 |
| Phase5 EmlisObservationComposer限定利用 | 単発観測scope marker / Runtime Surface Gate / Display Gate traceの限定利用が実装済み。 |
| Phase6 Piece過圧縮防止接続 | 今回実装済み。 |
| public contract | 変更なし。 |
| RN表示条件 | 変更なし。 |
| json/schema実ファイル化 | なし。 |

## 新規・修正ファイル

| repository | file | 変更内容 |
|---|---|---|
| Cocolon_前提資料 | `05_cocolon_rule_file_index.md` | Phase6 PieceComposer過圧縮防止のowner / test indexへ更新。 |
| Cocolon_前提資料 | `07_latest_snapshot_diff.md` | Phase6 PieceComposer過圧縮防止接続差分を追記。 |
| Cocolon_前提資料 | `manifest.json` | Phase6 source snapshot / policyを追記。 |
| mashos-api | `ai/services/ai_inference/cocolon_text_generation_core/adapters/piece_environment_state_output_guard.py` | `environment_state_output_frame` からPiece用must_keep signalを作る内部guardを追加。raw `memo` / `memo_action` 本文は返さず、public response keyも追加しない。 |
| mashos-api | `ai/services/ai_inference/cocolon_text_generation_core/adapters/piece_composer_input_contract.py` | Piece input contractへPhase6 guardを接続し、`must_keep_signal_keys` / `source_claims` / `overcompression_risk` / safety policyへ反映。 |
| mashos-api | `ai/services/ai_inference/cocolon_text_generation_core/adapters/piece_composer.py` | runtime plan / safety policy / common core guardへPhase6 guard metaを渡し、state-only過圧縮をrejectできるようにした。 |
| mashos-api | `ai/services/ai_inference/emotion_piece_generation_service.py` | core planがない場合に限り、環境・状態・出力条件を保持するPiece preview文へ補助する。Pieceはユーザー主体の一問一答であり、Emlis調にはしない。 |
| mashos-api | `ai/tests/test_piece_environment_state_output_phase6.py` | 「仕事 × 不安 × 継続不安」を「不安です」だけへ潰さないこと、state-only過圧縮reject、guard raw text非混入を固定。 |

## Phase6で追加した接続契約

```text
- environment_state_output_frame をPieceComposerへ接続する。
- 接続はPieceのmust_keep / overcompression preventionとして扱う。
- PieceはEmlisの観測文ではなく、ユーザー主体の公開可能な一問一答を維持する。
- `eso_environment:*` / `eso_state:*` / `eso_output:*` をmust_keep signalとして扱う。
- raw memo / raw memo_action 本文はPiece ESO guard materialへ入れない。
- core planがない場合だけ、環境・状態・出力条件を保持するpreview文を補助する。
- common core guardでstate-only過圧縮をrejectできるようにする。
```

## 維持した禁止境界

```text
- /emotion/submit route変更なし
- request / response key変更なし
- DB physical name変更なし
- RN visible title / passed + commentText表示条件変更なし
- json/schema実ファイル化なし
- environment_state_output_frameをpublic response keyとして追加しない
- raw memo / raw memo_action textをPiece guard materialへ入れない
- PieceをEmlis調の話しかけ文にしない
- PieceでAnalysis期間傾向を出さない
- categoryから原因を作らない
- emotion strengthから原因を作らない
- 1件入力から傾向・人格・性格・タイプを作らない
- 回復処方を作らない
- 入力にない結論や解決策を足さない
- preview / publish同一性とpiece_text_hashを壊さない
- Display Gate / Grounding / Template Guardを緩めない
```

## 実行テスト

```text
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q tests/test_piece_environment_state_output_phase6.py
# 4 passed

PYTHONPATH=services/ai_inference pytest -q tests/test_piece_environment_state_output_phase6.py tests/test_cocolon_text_generation_core_piece_composer.py tests/test_cocolon_text_generation_core_piece_input_contract.py tests/test_emotion_piece_generation_value_observation.py tests/test_emotion_piece_generation_long_input_core.py tests/test_emotion_piece_generation_self_and_others_happiness.py tests/contract/test_new_national_core_piece_contracts.py tests/test_cocolon_environment_state_output_frame.py tests/test_emlis_ai_observation_structure_phase5_limited_use.py
# 34 passed

PYTHONPATH=services/ai_inference python3 -m py_compile services/ai_inference/cocolon_text_generation_core/adapters/piece_environment_state_output_guard.py services/ai_inference/cocolon_text_generation_core/adapters/piece_composer_input_contract.py services/ai_inference/cocolon_text_generation_core/adapters/piece_composer.py services/ai_inference/emotion_piece_generation_service.py tests/test_piece_environment_state_output_phase6.py
# passed
```

## 次の実装段階

次は Phase7 として、Analysis向け傾向materialの内部設計を検討する。ただし、Analysis表示接続は最後にし、期間内再出現・record数・代表根拠を持たない傾向表現は出さない。

# 2026-05-25 差分追記: 環境状態出力観測構造 Phase7 Analysis向け傾向material 内部設計

この差分は、Phase3で内部実装した `environment_state_output_frame` を、Phase7としてAnalysis向けの期間再出現materialへ展開する内部設計実装です。接続目的は、Analysisのpublicレポート本文を生成することではなく、保存済みrecordsから `conditional_output_tendency` と `recovery_label_path` をtext-free内部materialとして作れるようにすることです。

## 確認結果

| 確認項目 | 結果 |
|---|---|
| Phase0設計書 | `cocolon_environment_state_output_observation_structure_design_2026_05_25.md` が前提資料内に存在。 |
| Phase1前提資料差分 | READ_FIRST / 思想資料 / 命名体系 / 名称混在境界 / ルール索引 / 最新差分 / manifest に反映済み。 |
| Phase2 current input bundle 接続 | `EmlisCurrentInputBundle.to_environment_state_output_connection_summary()` が存在。 |
| Phase3 frame builder | `cocolon_environment_state_output_frame.py` が存在し、単発入力からtext-free frameを作成できる。 |
| Phase4 observation material 接続 | `environment_state_output_frame` が EmlisAI material / connection / Display Gate trace へsafe projectionとして接続済み。 |
| Phase5 EmlisObservationComposer限定利用 | 単発観測scope marker / Runtime Surface Gate / Display Gate traceの限定利用が実装済み。 |
| Phase6 Piece過圧縮防止接続 | PieceComposerのmust_keep / overcompression preventionとして実装済み。 |
| Phase7 Analysis向け傾向material内部設計 | 今回実装済み。 |
| public Analysis text接続 | 未実装。 |
| public contract | 変更なし。 |
| RN表示条件 | 変更なし。 |
| json/schema実ファイル化 | なし。 |

## 新規・修正ファイル

| repository | file | 変更内容 |
|---|---|---|
| Cocolon_前提資料 | `05_cocolon_rule_file_index.md` | Phase7 Analysis向け傾向materialのowner / test indexを追記。 |
| Cocolon_前提資料 | `07_latest_snapshot_diff.md` | Phase7 Analysis向け傾向material内部設計差分を追記。 |
| Cocolon_前提資料 | `manifest.json` | Phase7 source snapshot / policyを追記。 |
| mashos-api | `ai/services/ai_inference/cocolon_text_generation_core/adapters/analysis_environment_state_output_material.py` | 保存済みrecordsからsafe frame projectionを作り、`conditional_output_tendency` / `recovery_label_path` を内部materialとして生成するPhase7 moduleを追加。 |
| mashos-api | `ai/tests/test_analysis_environment_state_output_phase7.py` | 期間再出現material、1件傾向化禁止、回復経路処方禁止、self-structure素材混入拒否、summary meta-only / raw text非混入を固定。 |

## Phase7で追加した内部material契約

```text
- 保存済みrecordsから safe frame projection を作る。
- frame projectionはsource id、axis presence、environment/state/output theme ids、evidence span idsのみを持つ。
- raw memo / raw memo_action textは返さない。
- 同じ environment × state × output_theme が2件以上再出現した場合にconditional_output_tendency候補とする。
- 1件入力はsingle observationに留め、period tendencyにはしない。
- recovery_label_pathは隣接record順序上のsequence observationであり、回復・治療・処方としては扱わない。
- self-structure source materialが混入した場合はrejected_sourcesへ隔離し、emotion/self material mixingを許可しない。
- public Analysis text / content_json / standardReport / contentTextへは接続しない。
```

## 維持した禁止境界

```text
- Analysis public report text生成なし
- content_json / standardReport / contentText変更なし
- /emotion/submit route変更なし
- request / response key変更なし
- DB physical name変更なし
- RN表示条件変更なし
- json/schema実ファイル化なし
- environment_state_output_frameをpublic response keyとして追加しない
- raw memo / raw memo_action textをAnalysis materialへ入れない
- categoryから原因を作らない
- emotion strengthから原因を作らない
- 1件入力から傾向・人格・性格・タイプを作らない
- recovery_label_pathを治療・処方・回復方法にしない
- 感情分析materialとself-structure素材を混ぜない
- EmlisAI / Piece の温度や表面文をAnalysisへ流用しない
```

## 実行テスト

```text
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q tests/test_analysis_environment_state_output_phase7.py
# 5 passed

PYTHONPATH=services/ai_inference pytest -q tests/test_analysis_environment_state_output_phase7.py tests/test_piece_environment_state_output_phase6.py tests/test_cocolon_text_generation_core_analysis_input_contract.py tests/test_cocolon_text_generation_core_analysis_composer.py tests/test_cocolon_environment_state_output_frame.py tests/test_emlis_ai_observation_structure_phase5_limited_use.py
# 31 passed

PYTHONPATH=services/ai_inference python3 -m py_compile services/ai_inference/cocolon_text_generation_core/adapters/analysis_environment_state_output_material.py tests/test_analysis_environment_state_output_phase7.py
# passed
```

## 次の実装段階

次は Phase8 として、AnalysisComposer への表示接続を検討する。ただし、Phase8では `record_count` / `distinct_day_count` / `representative_evidence_span_ids` を持つmaterialだけを「この期間の記録では」という期間限定表現で扱い、診断・断定・人格化・回復処方を防ぐ専用Guardを維持する。


# 2026-05-25 差分追記: 環境状態出力観測構造 Phase8 AnalysisComposer への表示接続

この差分は、Phase7で作成した `analysis_environment_state_output_period_material` を、Phase8としてAnalysisComposerの表示候補へ安全に接続する実装です。接続目的は、`conditional_output_tendency` / `recovery_label_path` を、期間限定・非診断・非処方のAnalysis観測文として扱えるようにすることです。

## 確認結果

| 確認項目 | 結果 |
|---|---|
| Phase0設計書 | `cocolon_environment_state_output_observation_structure_design_2026_05_25.md` が前提資料内に存在。 |
| Phase1前提資料差分 | READ_FIRST / 思想資料 / 命名体系 / 名称混在境界 / ルール索引 / 最新差分 / manifest に反映済み。 |
| Phase2 current input bundle 接続 | `EmlisCurrentInputBundle.to_environment_state_output_connection_summary()` が存在。 |
| Phase3 frame builder | `cocolon_environment_state_output_frame.py` が存在し、単発入力からtext-free frameを作成できる。 |
| Phase4 observation material 接続 | `environment_state_output_frame` がEmlisAI material / connection / Display Gate traceへsafe projectionとして接続済み。 |
| Phase5 EmlisObservationComposer限定利用 | 単発観測scope marker / Runtime Surface Gate / Display Gate traceの限定利用が実装済み。 |
| Phase6 Piece過圧縮防止接続 | PieceComposerのmust_keep / overcompression preventionとして実装済み。 |
| Phase7 Analysis向け傾向material内部設計 | `conditional_output_tendency` / `recovery_label_path` をinternal materialとして生成済み。 |
| Phase8 AnalysisComposer表示接続 | 今回実装済み。 |
| public contract | 変更なし。 |
| RN表示条件 | 変更なし。 |
| json/schema実ファイル化 | なし。 |

## 新規・修正ファイル

| repository | file | 変更内容 |
|---|---|---|
| Cocolon_前提資料 | `05_cocolon_rule_file_index.md` | Phase8 AnalysisComposer表示接続のowner / test indexを追記。 |
| Cocolon_前提資料 | `07_latest_snapshot_diff.md` | Phase8 AnalysisComposer表示接続差分を追記。 |
| Cocolon_前提資料 | `manifest.json` | Phase8 source snapshot / policyを追記。 |
| mashos-api | `ai/services/ai_inference/cocolon_text_generation_core/adapters/analysis_environment_state_output_surface.py` | Phase7 materialをAnalysisComposer用のsafe display candidate / safe summary sourcesへ変換するPhase8 moduleを追加。 |
| mashos-api | `ai/services/ai_inference/cocolon_text_generation_core/adapters/analysis_composer.py` | Phase7 materialを直接受けた場合にPhase8 surfaceへ変換し、AnalysisComposerでGuardする接続を追加。 |
| mashos-api | `ai/services/ai_inference/analysis_report_validity_gate.py` | Analysis text safety側の処方・原因・断定surface検出語を強化。 |
| mashos-api | `ai/services/ai_inference/cocolon_text_generation_core/adapters/__init__.py` | Phase8 wrapper exportを追加。 |
| mashos-api | `ai/services/ai_inference/cocolon_text_generation_core/__init__.py` | Phase8 wrapper exportを追加。 |
| mashos-api | `ai/tests/test_analysis_environment_state_output_phase8_display_connection.py` | Phase8表示候補、raw text非混入、AnalysisComposer直接接続、1件傾向化禁止、回復処方禁止、safety rejectionを固定。 |

## Phase8で追加した表示接続契約

```text
- conditional_output_tendency は record_count >= 2 のものだけを表示候補にする。
- 表示文は「この期間の記録では」で始まる期間限定観測にする。
- environment / state / output_theme はsafe labelとして使い、raw memo / raw memo_action textは使わない。
- record_count / distinct_day_count / matching_frame_ids / representative_evidence_span_ids を source_claims に保持する。
- recovery_label_path は「その後の記録では」というsequence observationに限定する。
- 「戻りやすい」「回復方法」「治る」「処方」などの処方表現を禁止する。
- AnalysisComposerへ渡すmaterial_sourcesは、raw Phase7 materialではなく、safe summary rowsへ変換する。
- content_json / standardReport / contentText はこのPhaseでshape変更しない。
```

## 維持した禁止境界

```text
- /emotion/submit route変更なし
- request / response key変更なし
- DB physical name変更なし
- RN表示条件変更なし
- json/schema実ファイル化なし
- analysis_report_schema.json変更なし
- raw memo / raw memo_action textをsurface candidate / metaへ入れない
- 1件入力からperiod tendencyを作らない
- categoryから原因を作らない
- emotion strengthから原因を作らない
- recovery_label_pathを治療・処方・回復方法にしない
- Analysisを診断・性格分類・人格タイプ化しない
- EmlisAI / Piece の温度や表面文をAnalysisへ流用しない
```

## 実行テスト

```text
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q tests/test_analysis_environment_state_output_phase8_display_connection.py
# 6 passed

PYTHONPATH=services/ai_inference pytest -q tests/test_analysis_environment_state_output_phase8_display_connection.py tests/test_analysis_environment_state_output_phase7.py tests/test_cocolon_text_generation_core_analysis_input_contract.py tests/test_cocolon_text_generation_core_analysis_composer.py tests/test_analysis_value_observation_boundary.py tests/contract/test_new_national_core_analysis_contracts.py tests/test_piece_environment_state_output_phase6.py tests/test_cocolon_environment_state_output_frame.py tests/test_emlis_ai_observation_structure_phase5_limited_use.py
# 47 passed

PYTHONPATH=services/ai_inference python3 -m py_compile services/ai_inference/cocolon_text_generation_core/adapters/analysis_environment_state_output_surface.py services/ai_inference/cocolon_text_generation_core/adapters/analysis_environment_state_output_material.py services/ai_inference/cocolon_text_generation_core/adapters/analysis_composer.py services/ai_inference/cocolon_text_generation_core/adapters/__init__.py services/ai_inference/cocolon_text_generation_core/__init__.py services/ai_inference/analysis_report_validity_gate.py tests/test_analysis_environment_state_output_phase8_display_connection.py
# passed
```

## 次の実装段階

次は Phase9 として、Emlis / Piece / Analysis の横断境界テストと、RN表示契約・API route / response key / DB physical name の非破壊確認を進める。Phase8でAnalysis表示接続を行ったため、Phase9では特に、AnalysisへEmlisの温度やPieceの公開Q&A文体が混ざっていないこと、Analysisが診断・断定・処方に寄っていないことを横断確認する。

# 2026-05-25 差分追記: 環境状態出力観測構造 Phase9 横断テストと前提資料更新

この差分は、Phase0〜8で接続した `environment_state_output_frame` / Piece過圧縮防止 / Analysis期間観測表示が、三大中核の境界を壊していないかを横断確認するPhase9実装です。Phase9の目的は新しい公開機能を足すことではなく、Emlisは単発観測、Pieceは核保持、Analysisは期間観測という役割分離をテストと前提資料へ固定することです。

## 確認結果

| 確認項目 | 結果 |
|---|---|
| Phase0設計書 | `cocolon_environment_state_output_observation_structure_design_2026_05_25.md` が前提資料内に存在。 |
| Phase1前提資料差分 | READ_FIRST / 思想資料 / 命名体系 / 名称混在境界 / ルール索引 / 最新差分 / manifest に反映済み。 |
| Phase2 current input bundle 接続 | `EmlisCurrentInputBundle.to_environment_state_output_connection_summary()` が存在。 |
| Phase3 frame builder | `cocolon_environment_state_output_frame.py` が存在し、単発入力からtext-free frameを作成できる。 |
| Phase4 observation material 接続 | `environment_state_output_frame` がEmlisAI material / connection / Display Gate traceへsafe projectionとして接続済み。 |
| Phase5 EmlisObservationComposer限定利用 | 単発観測scope marker / Runtime Surface Gate / Display Gate traceの限定利用が実装済み。 |
| Phase6 Piece過圧縮防止接続 | PieceComposerのmust_keep / overcompression preventionとして実装済み。 |
| Phase7 Analysis向け傾向material内部設計 | `conditional_output_tendency` / `recovery_label_path` をinternal materialとして生成済み。 |
| Phase8 AnalysisComposer表示接続 | 前提資料には反映済み。受領した `mashos-api_8(28).zip` ではPhase8 backend実ファイルが未反映だったため、今回差分でPhase8 backend差分を補完。 |
| Phase9 横断テスト | 今回実装済み。 |
| public contract | 変更なし。 |
| RN表示条件 | 変更なし。Cocolon RN実ファイルの新規変更は今回なし。 |
| json/schema実ファイル化 | なし。 |

## 新規・修正ファイル

| repository | file | 変更内容 |
|---|---|---|
| Cocolon_前提資料 | `05_cocolon_rule_file_index.md` | Phase9横断テストのowner / test indexを追記。 |
| Cocolon_前提資料 | `07_latest_snapshot_diff.md` | Phase9横断テスト差分を追記。 |
| Cocolon_前提資料 | `manifest.json` | Phase9 source snapshot / policyを追記。 |
| mashos-api | `ai/services/ai_inference/cocolon_text_generation_core/adapters/analysis_environment_state_output_surface.py` | Phase8補完。Phase7 materialをAnalysisComposer用のsafe display candidateへ変換するmodule。 |
| mashos-api | `ai/services/ai_inference/cocolon_text_generation_core/adapters/analysis_composer.py` | Phase8補完 + Phase9補正。Phase7 materialのsafe surface接続と、Analysisで `今回の入力では` scope markerを弾くcross-core safetyを追加。 |
| mashos-api | `ai/services/ai_inference/analysis_report_validity_gate.py` | Phase8補完 + Phase9補正。Analysis validity gateで `今回の入力では` scope markerを弾くcross-core safetyを追加。 |
| mashos-api | `ai/services/ai_inference/cocolon_text_generation_core/adapters/__init__.py` | Phase8補完。Analysis ESO surface wrapper exportを追加。 |
| mashos-api | `ai/services/ai_inference/cocolon_text_generation_core/__init__.py` | Phase8補完。Analysis ESO surface wrapper exportを追加。 |
| mashos-api | `ai/tests/test_analysis_environment_state_output_phase8_display_connection.py` | Phase8補完。Analysis表示接続テスト。 |
| mashos-api | `ai/tests/test_environment_state_output_phase9_cross_core_contract.py` | Phase9新規。Emlis / Piece / Analysis 横断境界、public meta、submit route / response / DB name contractを固定。 |

## Phase9で固定した横断契約

```text
- EmlisAIは single_record scope の単発観測として扱う。
- EmlisAIで `period_tendency_from_single_record` はfalseのまま。
- Pieceは `eso_environment:*` / `eso_state:*` / `eso_output:*` をmust_keep signalとして扱い、核の過圧縮を防ぐ。
- PieceはEmlis調の話しかけ文やAnalysis期間傾向文体へ寄せない。
- Analysisは `この期間の記録では` をscope markerにした期間観測だけを表示候補にする。
- Analysisは `今回の入力では` をscope markerにした単発観測文体を拒否する。
- public Emlis metaには `environment_state_output_frame` / raw memo / raw memo_action / comment_text bodyを入れない。
- `/emotion/submit` route、`EmotionSubmitResponse`、`EmotionSubmitInputFeedback`、`friend_emotion_feed` defaultは変更しない。
```

## 維持した禁止境界

```text
- /emotion/submit route変更なし
- request / response key変更なし
- DB physical name変更なし
- RN表示条件変更なし
- Cocolon RN実ファイル変更なし
- json/schema実ファイル化なし
- environment_state_output_frameをpublic response keyとして追加しない
- raw memo / raw memo_action textをpublic meta / Piece guard / Analysis surfaceへ入れない
- Emlis単発scope markerをAnalysis期間観測へ流用しない
- Analysis期間scope markerをEmlis単発返答へ流用しない
- Pieceを短縮要約へ潰さない
- categoryから原因を作らない
- emotion strengthから原因を作らない
- 1件入力から傾向・人格・性格・タイプを作らない
- recovery_label_pathを治療・処方・回復方法にしない
```

## 実行テスト

```text
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q tests/test_environment_state_output_phase9_cross_core_contract.py
# 5 passed
```

## 完了扱い

Phase9時点で、環境状態出力観測構造は次の役割分離で固定する。

```text
EmlisAI: 現在入力1件の単発観測。
Piece: 公開可能な一問一答で核を過圧縮しないためのmust_keep素材。
Analysis: 期間内再出現とsequence observationを、診断ではない観測文として扱う。
共通文章生成基盤: 品質・根拠・安全を担い、各中核の出力目的はComposer側で保持する。
```

## Phase9 追加実行テスト

```text
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q tests/test_environment_state_output_phase9_cross_core_contract.py tests/test_analysis_environment_state_output_phase8_display_connection.py tests/test_analysis_environment_state_output_phase7.py tests/test_piece_environment_state_output_phase6.py tests/test_cocolon_environment_state_output_frame.py tests/test_emlis_ai_observation_structure_phase5_limited_use.py tests/test_emlis_ai_public_feedback_meta.py tests/test_emotion_submit_public_feedback_meta_boundary.py tests/test_cocolon_text_generation_core_analysis_composer.py tests/test_cocolon_text_generation_core_piece_composer.py tests/contract/test_new_national_core_analysis_contracts.py tests/contract/test_new_national_core_piece_contracts.py tests/contract/test_new_national_core_emlis_contracts.py
# 75 passed, 2 warnings

PYTHONPATH=services/ai_inference python3 -m py_compile services/ai_inference/cocolon_text_generation_core/adapters/analysis_environment_state_output_surface.py services/ai_inference/cocolon_text_generation_core/adapters/analysis_composer.py services/ai_inference/analysis_report_validity_gate.py services/ai_inference/cocolon_text_generation_core/adapters/__init__.py services/ai_inference/cocolon_text_generation_core/__init__.py tests/test_analysis_environment_state_output_phase8_display_connection.py tests/test_environment_state_output_phase9_cross_core_contract.py
# passed
```

2件のPydantic deprecation warningは既存の `api_emotion_submit.py` / `test_new_national_core_piece_contracts.py` 由来で、Phase9差分による失敗ではない。

# 2026-05-26 差分追記: EmlisAI Environment State Output Surface Contract Completion Phase0-6 snapshot差分

最新実ファイル `Cocolon_7(14).zip` / `mashos-api_7(30).zip` では、Cocolon側のRN表示条件を変えず、mashos-api側でEmlisAI Environment State Output Surface Contract Completion Phase0-6 が反映されている。

## 追加・中心owner

| file | 構造上の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_environment_state_output_surface_contract_completion.py` | `environment_state_output_frame` connected + single_record_only + scope_marker_required のcandidateに対して、scope marker補完、idempotent、greeting skip、forbidden surface rejectionを担うshared helper。 |

## 主な更新owner

| file | 差分の読み方 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_conversation_composer_service.py` | candidate text抽出後・surface validation前にmarker completionを適用する。completion rejectionがあればschema_invalid / empty comment_text側に残す。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_runtime_surface_pre_return_gate.py` | normalize前で整ったcandidateでも、返却直前に実comment_text上のmarker presenceとforbidden claimを再確認する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py` | runtime block、terminal surface block、marker check failure、comment_text欠落時にpublic `input_feedback` を出さない。 |
| `mashos-api/ai/services/ai_inference/emotion_submit_service.py` | public feedback contractを通ったcomment_textだけを `/emotion/submit` responseへ返す。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_display_repair_integration.py` | 非repairable unavailable candidateやユーザー由来signalなし入力をlow-information repairで表示側へ持ち上げない。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_client.py` | limited composer source監査上のfallback固定文混入を避ける。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | diagnostic_summary / multi_perspective内部metaの同期を行い、public表示契約とは分ける。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_relation_surface_contract.py` | relation surface contractの一部表現を、根拠表現として通る自然なsurfaceへ補正する。 |

## 保持された公開契約

```text
- /emotion/submit route変更なし
- request / response key変更なし
- DB physical name変更なし
- RN表示名 `Emlisの観測` 変更なし
- RN表示条件 `passed + commentText` 変更なし
- `input_feedback.comment_text` 変更なし
- `input_feedback.emlis_ai.observation_status` 変更なし
- 辞書ファイル変更なし
- json/schema実ファイル化なし
```

## 新しい読み方

`environment_state_output_scope_marker_missing` は、辞書不足ではなく、単一入力観測を期間傾向・人格傾向に見せないためのsurface contract違反として扱う。補完は完成文テンプレではなく、`今回の入力では` 等のscope markerをfirst body lineへ一度だけ付ける最小整形である。

forbidden surface claim、つまり期間傾向・人格傾向・診断・category原因化・emotion strength原因化・回復処方は、scope markerがあってもpassedにしない。runtime pre-return gateでも再確認し、public metaにはcompletion result / raw input / candidate bodyを出さない。

## 前提資料更新時のtargeted確認

```text
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_environment_state_output_surface_contract_completion.py \
  tests/test_emlis_ai_runtime_surface_pre_return_gate.py \
  tests/test_emlis_ai_public_feedback_meta.py \
  tests/test_emotion_submit_public_feedback_meta_boundary.py \
  tests/test_environment_state_output_phase9_cross_core_contract.py
# 71 passed
```

全量pytestは前提資料更新時には実行していない。次の段階は、実機ログで `passed / unavailable / rejected` の比率、`environment_state_output_scope_marker_missing` の残存、表示文の自然さ、診断化・原因化・人格化の有無を見ること。辞書質問回は、surface contractが通った後に観測material不足が実機ログで見えた場合だけ扱う。

# 2026-05-26 差分追記: EmlisAI状態回答と人間的フォロー Phase0-1 snapshot差分

今回のPhase0-1は、`emlis_ai_state_answer_human_follow_definition_2026_05_26.md` をEmlisAI専用出力思想資料として前提資料へ追加し、前提資料側の参照順・思想・命名・ルール・名称境界・manifestを更新する差分である。`Cocolon(187).zip` と `mashos-api(100).zip` の実コードは変更しない。

## Phase扱い

| Phase | 今回の扱い |
|---|---|
| Phase 0 | 設計書は提供済み。前提資料内の新規資料として配置する。 |
| Phase 1 | READ_FIRST、思想資料、命名体系、ルール索引、名称混在境界、最新差分、manifestへ差分反映する。 |
| Phase 2以降 | backend internal material、Selector、Ratio Resolver、Special Handling、比喩material、Composer / Gate / QA接続は未実装。 |

## 新規・修正ファイル

| repository | file | 変更内容 |
|---|---|---|
| Cocolon_前提資料 | `emlis_ai_state_answer_human_follow_definition_2026_05_26.md` | 新規追加。EmlisAI状態回答と人間的フォローの出力思想・surface contract設計の正本資料。 |
| Cocolon_前提資料 | `00_karen_read_first.md` | 読む順に本資料を追加し、Phase0-1の前提資料境界を追記。 |
| Cocolon_前提資料 | `cocolon_thought_material_for_karen.md` | EmlisAIは行動指示ではなく状態回答を返し、人間的フォローへ着地する思想を追記。 |
| Cocolon_前提資料 | `03_cocolon_naming_system.md` | 状態回答、人間的フォロー、フォロー4、観測6:フォロー4、Emlisの限定的反対意見、安全日常比喩を内部設計名として登録。 |
| Cocolon_前提資料 | `05_cocolon_rule_file_index.md` | 状態回答・人間的フォロー・自己否定例外・怒り境界・比喩境界を触る時のrule / test indexを追記。 |
| Cocolon_前提資料 | `07_latest_snapshot_diff.md` | 本Phase0-1差分を追記。 |
| Cocolon_前提資料 | `09_naming_boundary.md` | 本資料がEmlisAI専用出力思想であり、visible名・DB/API・public responseをrenameしない境界を追記。 |
| Cocolon_前提資料 | `manifest.json` | 本資料のdocs登録、Phase0-1 snapshot / policyを追記。 |

## 固定した読み方

```text
Cocolon環境状態出力観測構造 = 何を見るか。
EmlisAI状態回答と人間的フォロー = それをEmlisAIがどう返すか。
```

EmlisAIは、行動の正解を押しつけず、現在入力から「今の自分が何をしている状態か」を返す。表示は、構造観測 / 状態回答と、人間的フォロー / Emlisの感想の二層として読む。基本は `観測6 : フォロー4` だが、入力の重さや構造理解要求に応じて振れ幅を持つ。

## 維持した禁止境界

```text
- /emotion/submit route変更なし
- request / response key変更なし
- DB physical name変更なし
- RN表示名 `Emlisの観測` 変更なし
- RN表示条件 `passed + commentText` 変更なし
- `input_feedback.comment_text` 変更なし
- `input_feedback.emlis_ai.observation_status` 変更なし
- public metaへraw input / memo / memo_action / comment_text bodyを入れない
- json/schema実ファイル化なし
- backendコード変更なし
- RN UI変更なし
- 本資料内の例文をruntime固定文にしない
- EmlisAIを慰めだけ、行動指示、診断、人格断定、原因断定へ寄せない
- 怒りで相手評価に同意しない
- 自己否定で根拠なし慰めや人格肯定へ逃がさない
- 比喩を自由生成しない
```

## 前提資料更新時の確認

前提資料差分であるため、backend pytest / RN testは実行対象外。確認は、対象資料の存在、manifest JSON parse、差分ファイル一覧の一致で行う。


# 2026-05-26 差分追記: EmlisAI状態回答と人間的フォロー Phase2-10 実装反映 snapshot差分

最新実ファイル `Cocolon_10(9).zip` / `mashos-api_10(16).zip` を確認した。`Cocolon_10(9).zip` はPhase0開始時点の `Cocolon(187).zip` と実ファイル差分なし。`mashos-api_10(16).zip` は `mashos-api(100).zip` から、新規19件・修正16件・削除0件で、Phase2-10のbackend実装と回帰testを含む。

## source snapshot

| source | file count | sha256 |
|---|---:|---|
| `Cocolon_前提資料(137).zip` | 38 | `6f1ae81cea8d83fccdbb20f6902c8298e4c80ebcea62cbf39d01ab44e21a16b2` |
| `Cocolon_10(9).zip` | 217 | `5995062a3604eb4ad06937492c0b00d89870cd57209dab4169e92b8dd6babd58` |
| `mashos-api_10(16).zip` | 672 | `8e12afc4437aff121ca4d1de18449a113444e34919e9ae57ec1d8eddc2786770` |
| total実ファイル | 889 | - |

## Phase2-10の実装読み方

| Phase | 実装内容 | 主なowner |
|---|---|---|
| Phase2 | 状態回答surface contract materialの内部実装 | `emlis_ai_state_answer_surface_contract.py`, `test_emlis_ai_state_answer_surface_contract.py`, `emlis_ai_observation_structure_material_service.py` |
| Phase3 | フォロー4 Selectorの実装 | `emlis_ai_human_follow_selector.py`, `test_emlis_ai_human_follow_selector.py` |
| Phase4 | 比率Resolverの実装 | `emlis_ai_state_answer_ratio_policy.py`, `test_emlis_ai_state_answer_ratio_policy.py` |
| Phase5 | 自己否定・怒りSpecial Handling実装 | `emlis_ai_state_answer_special_cases.py`, `test_emlis_ai_state_answer_self_denial_and_anger.py`, Tone / Gate owners |
| Phase6 | 安全比喩materialの内部実装 | `emlis_ai_safe_daily_metaphor_material.py`, `test_emlis_ai_safe_daily_metaphor_material.py` |
| Phase7 | LimitedComposer / ConversationComposerへの接続 | `emlis_ai_state_answer_composer_contract.py`, `test_emlis_ai_state_answer_composer_connection.py`, composer owners |
| Phase8 | Gate / Public Meta境界の強化 | `emlis_ai_state_answer_gate_boundary.py`, `test_emlis_ai_state_answer_gate_boundary.py`, `test_emlis_ai_state_answer_public_meta_boundary.py`, gate / public meta owners |
| Phase9 | 表示品質QA / 受け入れ基準 | `tests/fixtures/emlis_ai_state_answer_cases.py`, `test_emlis_ai_state_answer_visible_surface_qa.py` |
| Phase10 | 横断contract回帰 | `tests/contract/test_emlis_state_answer_phase10_cross_contract_regression.py`, `test_emlis_ai_state_answer_phase10_cross_contract_regression.py`, Piece / Analysis adapter owners |

## 新規ファイル

| repository | file | 変更内容 |
|---|---|---|
| mashos-api | `ai/services/ai_inference/emlis_ai_state_answer_surface_contract.py` | 状態回答surface contract internal material。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_human_follow_selector.py` | フォロー4 Selector material。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_state_answer_ratio_policy.py` | 観測 / フォロー比率Resolver material。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_state_answer_special_cases.py` | 自己否定・怒りspecial handling material。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_safe_daily_metaphor_material.py` | 安全日常比喩material。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_state_answer_composer_contract.py` | Composer role plan contract。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_state_answer_gate_boundary.py` | Gate / Public Meta boundary material。 |
| mashos-api | `ai/tests/test_emlis_ai_state_answer_surface_contract.py` | Phase2回帰。 |
| mashos-api | `ai/tests/test_emlis_ai_human_follow_selector.py` | Phase3回帰。 |
| mashos-api | `ai/tests/test_emlis_ai_state_answer_ratio_policy.py` | Phase4回帰。 |
| mashos-api | `ai/tests/test_emlis_ai_state_answer_self_denial_and_anger.py` | Phase5回帰。 |
| mashos-api | `ai/tests/test_emlis_ai_safe_daily_metaphor_material.py` | Phase6回帰。 |
| mashos-api | `ai/tests/test_emlis_ai_state_answer_composer_connection.py` | Phase7回帰。 |
| mashos-api | `ai/tests/test_emlis_ai_state_answer_gate_boundary.py` | Phase8 Gate回帰。 |
| mashos-api | `ai/tests/test_emlis_ai_state_answer_public_meta_boundary.py` | Phase8 Public Meta回帰。 |
| mashos-api | `ai/tests/fixtures/emlis_ai_state_answer_cases.py` | Phase9 QA fixture。 |
| mashos-api | `ai/tests/test_emlis_ai_state_answer_visible_surface_qa.py` | Phase9表示品質QA。 |
| mashos-api | `ai/tests/contract/test_emlis_state_answer_phase10_cross_contract_regression.py` | Phase10横断contract回帰。 |
| mashos-api | `ai/tests/test_emlis_ai_state_answer_phase10_cross_contract_regression.py` | Phase10補助横断回帰。 |

## 修正ファイル

| repository | file | 変更内容 |
|---|---|---|
| mashos-api | `ai/services/ai_inference/emlis_ai_observation_structure_material_service.py` | 状態回答surface contractを内部materialへ接続。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_conversation_composer_service.py` | Composer payload / composition contractへ状態回答role planを接続。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_limited_composer_client.py` | LimitedComposer meta / SentencePlanへ状態回答section情報を接続。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_runtime_surface_pre_return_gate.py` | Phase5 / Phase8 special case and forbidden claim boundaryを表示前Gateへ接続。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_visible_surface_acceptance_gate.py` | 状態回答Gate boundaryと自己否定・怒り境界を接続。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_runtime_surface_tone_engine_2_1.py` | 自己否定の限定的反対意見を根拠あり例外として扱い、過剰慰め等はblock側へ残す。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_display_gate.py` | Gate boundary blocked surfaceがpassed + comment_textとして出ないように接続。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_public_feedback_meta.py` | 状態回答boundary summaryだけをpublic-safe subsetとして返す。raw本文は返さない。 |
| mashos-api | `ai/services/ai_inference/cocolon_text_generation_core/adapters/analysis_composer.py` | Phase10でEmlisAI状態回答温度のAnalysis流入防止を追加。 |
| mashos-api | `ai/services/ai_inference/cocolon_text_generation_core/adapters/analysis_composer_input_contract.py` | Analysis input contractへのEmlis material混入防止。 |
| mashos-api | `ai/services/ai_inference/cocolon_text_generation_core/adapters/piece_composer.py` | Phase10でEmlisAI状態回答温度のPiece流入防止を追加。 |
| mashos-api | `ai/services/ai_inference/cocolon_text_generation_core/adapters/piece_composer_input_contract.py` | Piece input contractへのEmlis material混入防止。 |
| mashos-api | `ai/tests/contract/test_new_national_core_emlis_contracts.py` | Phase10 Emlis contract回帰の追加。 |
| mashos-api | `ai/tests/test_emlis_ai_public_feedback_meta.py` | Public Feedback Meta境界回帰の追加。 |
| mashos-api | `ai/tests/test_emotion_submit_public_feedback_meta_boundary.py` | `/emotion/submit` public feedback境界回帰の追加。 |
| mashos-api | `ai/tests/test_environment_state_output_phase9_cross_core_contract.py` | ESO / state answer横断境界回帰の追加。 |

## 固定したcontract

```text
- /emotion/submit route変更なし
- request / response key変更なし
- DB physical name変更なし
- RN表示名 `Emlisの観測` 変更なし
- RN表示条件 `passed + commentText` 変更なし
- input_feedback.comment_text 契約変更なし
- public observation_status enum変更なし
- environment_state_output_frame / emlis_state_answer_surface_contract / state_answer_composer_role_plan をpublic key化しない
- raw memo / memo_action / comment_text body / raw evidence / contract body をpublic metaへ入れない
- json/schema実ファイル化なし
- 完成文テンプレ追加なし
- 外部AI / ローカルLLM前提追加なし
- Piece / AnalysisへEmlisAI状態回答の温度・文体・materialを流さない
```

## 前提資料更新時の確認

今回の前提資料差分更新では、実ファイルzipの差分確認、対象前提資料の差分追記、`manifest.json` parse、出力zip integrity確認を行う。backend全量pytest / RN testは実行対象外。

# 2026-05-29 差分追記: EmlisAI TwoStage Composer Surface Connection Phase16-0〜16-9 snapshot差分

## 基準zip

| source | count | 読み方 |
|---|---:|---|
| `Cocolon_10(10).zip` | 217 | RN production UIは変更なし。Phase16-9として `rn-screen-contracts.test.js` に、二段Composer本文を既存 `commentText` でそのまま表示する回帰を追加。 |
| `mashos-api_10(18).zip` | 696 | CompleteComposer実出力から `/emotion/submit` public feedbackまで二段 `comment_text` を接続済み。 |
| total | 913 | 前提資料差分更新対象snapshot。 |

## Phase16の実装読み方

| Phase | 実装内容 | 主なowner |
|---|---|---|
| Phase16-0 | CompleteComposer direct / ConversationComposer / emotion submit相当のredを追加し、二段shape・禁止surface・public meta非混入を固定。 | `test_emlis_ai_complete_composer_two_stage_surface_connection.py`, `test_emlis_ai_two_stage_required_gate_connection.py`, `test_emotion_submit_two_stage_reception_e2e.py` |
| Phase16-1 | `two_stage_required` をGateへ伝搬し、required + label missingをfail-closed。 | `emlis_ai_reply_service.py`, `emlis_ai_visible_surface_acceptance_gate.py`, `emlis_ai_state_answer_gate_boundary.py`, `emlis_ai_two_stage_reception_gate.py` |
| Phase16-2 | TwoStage Section Surface Planを内部material化。 | `emlis_ai_two_stage_section_surface_plan.py`, `emlis_ai_state_answer_composer_contract.py` |
| Phase16-3 | CompleteSentencePlanへsection metaを伝搬。 | `emlis_ai_complete_sentence_planner.py`, `emlis_ai_complete_composer_types.py` |
| Phase16-4 | CompleteSurfaceRealizerでlabelled two-stage `comment_text` を生成。 | `emlis_ai_complete_surface_realizer.py` |
| Phase16-5 | daily unpleasant向けsurface品質を調整。 | `emlis_ai_complete_surface_realizer.py`, `emlis_ai_two_stage_reception_gate.py` |
| Phase16-6 | CompleteComposerClient pipelineへsection planを正規接続。 | `emlis_ai_complete_composer_client.py` |
| Phase16-7 | Gate / self-repair / unavailable reasonを整理。 | `emlis_ai_two_stage_reception_gate.py`, `emlis_ai_complete_self_repair_service.py`, `emlis_ai_complete_composer_client.py` |
| Phase16-8 | `/emotion/submit` E2Eで public `input_feedback.comment_text` への二段到達を確認。 | `emlis_ai_reply_service.py`, `emlis_ai_listener_reader_judge.py`, `emlis_ai_grounding_judge.py`, `emlis_ai_runtime_surface_pre_return_gate.py`, `test_emotion_submit_two_stage_reception_e2e.py` |
| Phase16-9 | RN回帰。二段本文を既存 `commentText` として扱い、RN側parseやsplit key fallbackをしない。 | `Cocolon/tests/rn-screen-contracts.test.js` |

## 追加・更新として特に読むファイル

| repository | file | 読み方 |
|---|---|---|
| mashos-api | `ai/services/ai_inference/emlis_ai_two_stage_section_surface_plan.py` | Phase16-2の内部material。完成返答文・raw input・public keyを持たない。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_complete_sentence_planner.py` | `CompleteSentencePlanLine.meta` へsection metaを伝搬する。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_complete_surface_realizer.py` | section metaから二段joinを行い、daily unpleasant surface quality summaryを持つ。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_complete_composer_client.py` | two_stage plan / surface summary / unavailable reasonをComposer metaへsummaryとして接続する。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_complete_self_repair_service.py` | label / section boundary repairのみ許可し、本文固定補完をしない。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_two_stage_reception_gate.py` | required未実現、label missing、section empty、section meta missing等のreasonを切り分ける。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_reply_service.py` | CompleteComposerClient明示経路、composer_meta、visible gate接続を扱う。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_listener_reader_judge.py` | labelled two-stage surfaceをaddressee clearとして扱う。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_grounding_judge.py` | `見えたこと：` / `Emlisから：` labelだけを本文claim扱いしない。 |
| mashos-api | `ai/services/ai_inference/emlis_ai_runtime_surface_pre_return_gate.py` | 二段label先頭形をscope markerとして扱う。 |
| mashos-api | `ai/tests/test_emlis_ai_two_stage_section_surface_plan.py` | Phase16-2 material contract回帰。 |
| mashos-api | `ai/tests/test_emlis_ai_complete_sentence_plan_two_stage_section_meta.py` | Phase16-3 section meta回帰。 |
| mashos-api | `ai/tests/test_emlis_ai_complete_surface_realizer_two_stage_comment_text.py` | Phase16-4 labelled two-stage surface回帰。 |
| mashos-api | `ai/tests/test_emlis_ai_complete_surface_realizer_daily_unpleasant_reception_quality.py` | Phase16-5 daily unpleasant surface品質回帰。 |
| mashos-api | `ai/tests/test_emlis_ai_complete_composer_two_stage_surface_connection.py` | Phase16-6 CompleteComposer接続回帰。 |
| mashos-api | `ai/tests/test_emlis_ai_two_stage_phase16_7_gate_self_repair_unavailable.py` | Phase16-7 reason / repair回帰。 |
| mashos-api | `ai/tests/test_emotion_submit_two_stage_reception_e2e.py` | Phase16-8 public feedback到達回帰。 |
| Cocolon | `tests/rn-screen-contracts.test.js` | Phase16-9 RN public contract回帰。 |

## 固定したcontract

```text
- /emotion/submit route変更なし
- request payload / response top-level key変更なし
- input_feedback.comment_text public key変更なし
- input_feedback.emlis_ai.observation_status enum追加なし
- RN visible title Emlisの観測 変更なし
- RN表示条件 passed + commentText 変更なし
- RN production UI二カード化なし
- DB physical name / write path変更なし
- 外部AI / local LLM前提追加なし
- Gate緩和なし
- Python固定本文補完なし
```

`two_stage_section_surface_plan`、`two_stage_surface_realization`、`daily_unpleasant_reception_surface_quality`、`phase16_7_unavailable_reason_codes` はinternal summaryであり、public schemaとして扱わない。

# 2026-05-30 差分追記: EmlisAI TwoStage Product-Visible Fixture Completion Phase17-0〜17-10 snapshot差分

最新実ファイル `Cocolon_11(4).zip` / `mashos-api_11(11).zip` を確認した。`Cocolon_前提資料(148).zip` はPhase16基準の作業用地図であり、最新実ファイル側にはPhase17-0〜17-10の商品到達fixture補完が入っているため、この差分を前提資料へ追記する。

## source snapshot

| source | file count | sha256 |
|---|---:|---|
| `Cocolon_前提資料(148).zip` | 38 | `b4c55519cac5e972adba7675be014c112c13f12a06db1134753bee881c268ed2` |
| `Cocolon_11(4).zip` | 217 | `df9cbec341aebe376fdb8750b299876115c81ac77a23da074f111d59cb607bc3` |
| `mashos-api_11(11).zip` | 699 | `aef04e0d0151011d029824742feccf12ebbea3983174118b20e2a20c2801a3af` |
| total実ファイル | 916 | - |

## Phase17の実装読み方

| Phase | 実装内容 | 主なowner |
|---|---|---|
| Phase17-0 | 5件fixtureのproduct-visible到達diagnostic testを追加。Aだけ通る状態を完成扱いにしない。 | `tests/test_emlis_ai_two_stage_product_visible_fixture_completion.py` |
| Phase17-1 | 商品到達fixture評価helperを追加。分類はmeta-onlyで、runtime完成文やpublic keyを持たない。 | `tests/helpers/emlis_ai_two_stage_product_visible_fixture_assertions.py` |
| Phase17-2 | internal role語の表面化辞書とunknown role fallbackを補い、英語role語を本文へ出さない。 | `emlis_ai_complete_surface_realizer.py`, surface realizer tests |
| Phase17-3 | mode-specific two-stage surface policyを追加。`daily_unpleasant_reception` 以外のmodeも商品文へ寄せる。 | `emlis_ai_complete_surface_realizer.py` |
| Phase17-4 | mode別section budgetを正規化し、5件fixtureを原則 `observation 1 / reception 2` へ揃える。 | `emlis_ai_two_stage_section_surface_plan.py`, `emlis_ai_complete_sentence_planner.py` |
| Phase17-5 | TwoStage Gate / Visible Gateで内部role語漏れ・relation skeleton漏れをfail-closedで止める。 | `emlis_ai_two_stage_reception_gate.py`, `emlis_ai_visible_surface_acceptance_gate.py` |
| Phase17-6 | ログ3の `effort_pace_context` grounding relation bindingを追加。Groundingを緩めず、relation表現と根拠結合を要求する。 | `emlis_ai_complete_grounding_binding.py`, `emlis_ai_complete_grounding_service.py`, `emlis_ai_grounding_judge.py` |
| Phase17-7 | self-repair / unavailable reasonを商品到達向けに整理し、diagnostic-only reasonとrepair handoff reasonを分離する。 | `emlis_ai_complete_self_repair_service.py`, `emlis_ai_complete_composer_client.py`, `emlis_ai_complete_surface_realizer.py` |
| Phase17-8 | `/emotion/submit` 5件E2Eを追加し、public `input_feedback.comment_text` へ二段本文が届くことを固定する。 | `tests/test_emotion_submit_two_stage_reception_e2e.py`, label-only guard補正 |
| Phase17-9 | RN contract回帰を追加。5件fixture相当の二段本文を既存 `commentText` としてそのまま保持する。 | `Cocolon/tests/rn-screen-contracts.test.js` |
| Phase17-10 | 既存回帰を通すため、test helper / E2Eのheavy diagnostic保持を軽量化する。production serviceは変更しない。 | `tests/helpers/emlis_ai_two_stage_product_visible_fixture_assertions.py`, `tests/test_emotion_submit_two_stage_reception_e2e.py` |

## 最新実ファイル差分

Phase16基準の `Cocolon(195).zip` / `mashos-api(108).zip` から見ると、Phase17で確認した差分は次である。

### Cocolon

| 区分 | 件数 | 内容 |
|---|---:|---|
| 追加 | 0 | なし |
| 削除 | 0 | なし |
| 修正 | 1 | `Cocolon/tests/rn-screen-contracts.test.js` にPhase17-9 RN contract回帰を追加 |

### mashos-api

| 区分 | 件数 | 内容 |
|---|---:|---|
| 追加 | 3 | `ai/tests/helpers/__init__.py`, `ai/tests/helpers/emlis_ai_two_stage_product_visible_fixture_assertions.py`, `ai/tests/test_emlis_ai_two_stage_product_visible_fixture_completion.py` |
| 削除 | 0 | なし |
| 修正 | 19 | CompleteComposer / SentencePlanner / SurfaceRealizer / Grounding / Gate / self-repair / quality guard / E2E / 各test回帰のPhase17差分 |

## Phase17で増えた主なinternal名

| internal名 | 読み方 | public化しないもの |
|---|---|---|
| `product_visible_fixture_evaluation` | 5件fixtureの商品到達をtest helperで分類するmeta-only評価。 | public response key、RN表示source、ユーザー設定。 |
| `product_visible_surface_policy` | CompleteSurfaceRealizer内のmode-specific surface方針summary。 | 完成文テンプレ、固定返答辞書。 |
| `two_stage_mode_section_budget` | mode別のobservation / reception文数境界。 | UI設定、public schema、文字数固定契約。 |
| `two_stage_internal_role_label_leak` | 内部role語が本文に漏れた場合のGate reason。 | public `observation_status` enum。 |
| `two_stage_relation_skeleton_leak_surface` | relation skeletonが表示本文へ漏れた場合のGate reason。 | 表示率向上のためのGate緩和。 |
| `phase17_6_grounding_relation_binding` | effort / pace系のrelation表面化と根拠binding summary。 | Grounding緩和、unsupported sentence許可。 |
| `phase17_7_self_repair_unavailable_reason` | self-repair / unavailable reasonのsummary-only meta。 | comment_text本文格納、raw input格納。 |
| `phase17_10_public_contract_prescan` | test helperがpublic meta body leakを軽量確認するための内部test summary。 | runtime public meta。 |

## 5件fixtureの現在地

次の5件は、最新実ファイル上で商品到達対象として固定されている。

```text
daily_unpleasant_encounter_A
self_confidence_uncertainty_B
positive_change_after_work_streaming
self_blame_to_gentle_self_observation
independence_life_health_money_pace
```

共通の読み方:

```text
- comment_text は既存 input_feedback.comment_text だけを使う。
- shape は 見えたこと： / Emlisから： のlabelled two-stage text。
- public metaに raw input / memo / memo_action / comment_text body を入れない。
- Gate / Grounding は緩めない。
- fixture本文や設計書内の例文をruntime固定文にしない。
- RNは二段本文をsplitしない。
```

## 変更していない境界

```text
- /emotion/submit route
- request payload
- response top-level key
- input_feedback.comment_text
- input_feedback.emlis_ai.observation_status
- observation_text / reception_text public key
- observation_status public enum
- DB physical name / write path
- RN production UI
- RN表示名 Emlisの観測
- RN表示条件 passed + commentText
- 外部AI / local LLM前提
```

## この前提資料更新で触った資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/03_cocolon_naming_system.md
Cocolon_前提資料/07_latest_snapshot_diff.md
Cocolon_前提資料/09_naming_boundary.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/manifest.json
```

01 / 02系のfull inventory本文は全面再生成しない。今回の差分は、Phase17で増えたEmlisAI商品到達fixture補完の読み方を、最新基準面・名称境界・構造境界・EmlisAI出力思想資料・manifestへ反映する差分更新である。


# 2026-05-30 差分追記: EmlisAI Product Quality Stabilization Phase18-0〜18-11 snapshot差分

最新実ファイル `Cocolon_12(7).zip` / `mashos-api_12(10).zip` を確認した。`Cocolon_前提資料(150).zip` はPhase17基準の作業用地図であり、最新実ファイル側にはPhase18-0〜18-11の商品品質安定化が入っているため、この差分を前提資料へ追記する。

## source snapshot

| source | file count | sha256 |
|---|---:|---|
| `Cocolon_前提資料(150).zip` | 38 | `de695dafbad34ea88bfebf5170ee7ca4616c1d1161da5ff8c9dde9c3e8b87b9e` |
| `Cocolon_12(7).zip` | 217 | `45af7f062ef69874c7671ae46fb2cdb1ce230a51feb8b6e0ee5b24ec73da32b0` |
| `mashos-api_12(10).zip` | 712 | `1b024fb814bda1c8b475cdf49727244c7743d57040a0e8965292c7ce6a2dc3a7` |
| total実ファイル | 929 | - |

## Phase18の実装読み方

| Phase | 実装内容 | 主なowner |
|---|---|---|
| Phase18-0/1 | ローカル基準面とProduct Quality Regression Matrix helperを追加。赤を仕様化せずrelease blockerとして固定する。 | `tests/helpers/emlis_ai_phase18_product_quality_matrix.py`, `test_emlis_ai_phase18_product_quality_stabilization.py` |
| Phase18-2 | TwoStage Applicability Contractを追加し、低情報 / legacy / pre-connection pathをlabel missing terminalで巻き込まない。 | `emlis_ai_two_stage_applicability.py`, `emlis_ai_two_stage_reception_gate.py`, `emlis_ai_complete_composer_client.py` |
| Phase18-3 | Complete Initial candidate generation pathを復旧し、candidate生成とpublic表示判定を分離する。 | `emlis_ai_complete_composer_client.py`, `emlis_ai_complete_surface_realizer.py`, `emlis_ai_reply_service.py` |
| Phase18-4 | low-information public repair contractを追加し、短い低情報入力をpassedへ戻す一方、safety / scope / AP0 / non-repairable failureをpassed化しない。 | `emlis_ai_observation_display_repair_integration.py`, `test_emlis_ai_phase18_low_information_public_repair_boundary.py` |
| Phase18-5 | daily_unpleasant mode context / surface policyを修正し、`reception_mode_id` / `ratio_reason` をSurfaceRealizerへ伝搬する。 | `emlis_ai_two_stage_section_surface_plan.py`, `emlis_ai_complete_sentence_planner.py`, `emlis_ai_complete_surface_realizer.py` |
| Phase18-6 | observation structure / state answer surface contractのmeta-only sanitizationを修正し、`surface_policy` 本体や辞書本文をpayloadへ出さない。 | `emlis_ai_state_answer_surface_contract.py`, `emlis_ai_observation_structure_material_service.py`, `emlis_ai_observation_structure_connection_service.py` |
| Phase18-7 | diagnostic classification taxonomyを追加し、canonical classificationとlegacy aliasをmeta-safeに整理する。 | `emlis_ai_diagnostic_failure_taxonomy.py`, `emlis_ai_observation_diagnostic_lockdown.py`, `emlis_ai_observation_diagnostic_branching.py`, `emlis_ai_reply_service.py` |
| Phase18-8 | 表示文読感QAを追加し、内部role語、relation skeleton、便利語反復、単純言い換えをfail-closed / repair-requiredで検出する。 | `emlis_ai_visible_readability_quality.py`, `emlis_ai_visible_surface_acceptance_gate.py`, `emlis_ai_complete_surface_realizer.py` |
| Phase18-9 | `/emotion/submit` 商品品質E2Eを追加し、低情報、Complete Initial generated-but-display-rejected、meta boundary、timeout recoveryをpublic response境界で固定する。 | `test_emotion_submit_phase18_product_quality_e2e.py`, `emlis_ai_observation_display_repair_integration.py` |
| Phase18-10 | RN contractを再確認し、RNがPhase18 backend metaを読まず `commentText` だけを表示することを固定する。 | `Cocolon/tests/rn-screen-contracts.test.js` |
| Phase18-11 | 既存回帰を広く通し、低情報repairの過剰適用を絞る。 | `emlis_ai_observation_display_repair_integration.py` |

## 最新実ファイル差分

Phase17基準の `Cocolon(196).zip` / `mashos-api(109).zip` から見ると、Phase18で確認した差分は次である。

### Cocolon

| 区分 | 件数 | 内容 |
|---|---:|---|
| 追加 | 0 | なし |
| 削除 | 0 | なし |
| 修正 | 1 | `Cocolon/tests/rn-screen-contracts.test.js` にPhase18-10 RN contract回帰を追加 |

### mashos-api

| 区分 | 件数 | 内容 |
|---|---:|---|
| 追加 | 13 | `emlis_ai_two_stage_applicability.py`, `emlis_ai_diagnostic_failure_taxonomy.py`, `emlis_ai_visible_readability_quality.py`, Phase18 test helper / dedicated tests / `/emotion/submit` product quality E2E |
| 削除 | 0 | なし |
| 修正 | 17 | CompleteComposer / SentencePlanner / SurfaceRealizer / low-information repair / state answer meta sanitizer / diagnostic lockdown / diagnostic branching / visible gate / 既存test回帰のPhase18差分 |

#### 追加ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_diagnostic_failure_taxonomy.py
mashos-api/ai/services/ai_inference/emlis_ai_two_stage_applicability.py
mashos-api/ai/services/ai_inference/emlis_ai_visible_readability_quality.py
mashos-api/ai/tests/helpers/emlis_ai_phase18_product_quality_matrix.py
mashos-api/ai/tests/test_emlis_ai_phase18_complete_initial_candidate_path.py
mashos-api/ai/tests/test_emlis_ai_phase18_daily_unpleasant_mode_context.py
mashos-api/ai/tests/test_emlis_ai_phase18_diagnostic_classification_taxonomy.py
mashos-api/ai/tests/test_emlis_ai_phase18_low_information_public_repair_boundary.py
mashos-api/ai/tests/test_emlis_ai_phase18_product_quality_stabilization.py
mashos-api/ai/tests/test_emlis_ai_phase18_state_answer_surface_contract_meta_sanitizer.py
mashos-api/ai/tests/test_emlis_ai_phase18_two_stage_applicability.py
mashos-api/ai/tests/test_emlis_ai_phase18_visible_readability_quality.py
mashos-api/ai/tests/test_emotion_submit_phase18_product_quality_e2e.py
```

#### 修正ファイル

```text
Cocolon/tests/rn-screen-contracts.test.js
mashos-api/ai/services/ai_inference/emlis_ai_complete_composer_client.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_sentence_planner.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py
mashos-api/ai/services/ai_inference/emlis_ai_observation_diagnostic_branching.py
mashos-api/ai/services/ai_inference/emlis_ai_observation_diagnostic_lockdown.py
mashos-api/ai/services/ai_inference/emlis_ai_observation_display_repair_integration.py
mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_connection_service.py
mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_material_service.py
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_state_answer_ratio_policy.py
mashos-api/ai/services/ai_inference/emlis_ai_state_answer_surface_contract.py
mashos-api/ai/services/ai_inference/emlis_ai_two_stage_reception_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_two_stage_section_surface_plan.py
mashos-api/ai/services/ai_inference/emlis_ai_visible_surface_acceptance_gate.py
mashos-api/ai/tests/test_emlis_ai_diagnostic_summary.py
mashos-api/ai/tests/test_emlis_ai_observation_structure_phase4_connection.py
mashos-api/ai/tests/test_emlis_ai_state_answer_surface_contract.py
```

## Phase18で増えた主なinternal名

| internal名 | 読み方 | public化しないもの |
|---|---|---|
| `product_quality_regression_matrix` | Phase18対象の基準面とrelease blockerをmeta-onlyで一覧化する。 | runtime public meta、表示source。 |
| `two_stage_applicability_decision` | TwoStage requiredの適用境界を判定する。 | RN表示条件、ユーザー設定mode。 |
| `low_information_public_repair_contract` | 低情報repairのeligible / block reason / final statusを本文なしで示す。 | safety / scope / AP0のpassed化。 |
| `two_stage_mode_context` | daily_unpleasant等のmode contextをline / SurfaceRealizerへ伝搬する。 | case_id固定文、public key。 |
| `meta_only_sanitizer` | `surface_policy`本体や辞書本文をsummary flagsへ変換する。 | 辞書本文、raw input、comment_text body。 |
| `diagnostic_failure_taxonomy` | 表示不可理由をcanonical分類とlegacy aliasで整理する。 | public `observation_status` enum。 |
| `visible_readability_quality` | 反復・内部role語・relation skeleton・単純言い換えを検査する。 | 完成返答テンプレ、本文保存。 |
| `public_feedback_boundary_check` | `/emotion/submit` public responseのmeta boundaryをE2Eで確認する。 | response key追加、RN表示条件変更。 |

## 変更していない境界

```text
- /emotion/submit route
- request payload
- response top-level key
- input_feedback.comment_text
- input_feedback.emlis_ai.observation_status
- observation_text / reception_text public key
- observation_status public enum
- DB physical name / write path
- RN production UI
- RN表示名 Emlisの観測
- RN表示条件 passed + commentText
- 外部AI / local LLM前提
- Gate / Grounding / Reader / Templateの緩和
- 完成返答テンプレ / case_id固定runtime本文
```

## この前提資料更新で触った資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/01_cocolon_overall_structure.md
Cocolon_前提資料/01A_cocolon_overall_structure_app_foundation_home.md
Cocolon_前提資料/02_cocolon_national_system.md
Cocolon_前提資料/02A_cocolon_national_system_input_save_dispatch.md
Cocolon_前提資料/02C_cocolon_contract_boundary_validation.md
Cocolon_前提資料/03_cocolon_naming_system.md
Cocolon_前提資料/04_cocolon_change_theme_checklist.md
Cocolon_前提資料/05_cocolon_rule_file_index.md
Cocolon_前提資料/07_latest_snapshot_diff.md
Cocolon_前提資料/09_naming_boundary.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/manifest.json
```

01 / 02系のfull inventory本文は全面再生成しない。今回の差分は、Phase18で増えたEmlisAI商品品質安定化の読み方と新規internal ownerを、必要箇所へ差分追記する更新である。

# 2026-06-01 差分追記: EmlisAI Phase20-0〜20-10実装反映 snapshot差分

最新実ファイル `Cocolon_12(9).zip` / `mashos-api_12(12).zip` を確認した。`Cocolon_前提資料(158).zip` はEmlisAI是正方針を持つが、実装反映状態はPhase18 / Phase19撤回方針中心であり、最新実ファイル側にはPhase20-0〜20-10の実装が入っているため、この差分を前提資料へ追記する。

## 確認snapshot

| source | count | sha256 |
|---|---:|---|
| `Cocolon_前提資料(158).zip` | 41 premise files | `d0137544ed5a5946d49565ab425e9c162cc37db30cf1aab741a6b2646cf5744b` |
| `Cocolon_12(9).zip` | 217 | `8f6e2687c30b6e0832e717e75efe8c1ac712feee9bc7c0522921084e487c7f5e` |
| `mashos-api_12(12).zip` | 736 | `e59f063380fe309e959fd5e48fd09fd400ebc683f3d5215c7cc29d2714be314d` |

## Phase20の実装読み方

| Phase | 実装読み方 | 主なpath |
|---|---|---|
| Phase20-0 | Phase19差分を分類し、A/C/D exact fixtureを回帰fixtureへ意味変更する。production挙動はこの段階では変えない。 | `ai/tests/helpers/emlis_ai_phase20_phase19_diff_inventory.py`, `ai/tests/test_emlis_ai_phase20_phase19_diff_inventory.py` |
| Phase20-1 | Internal Response Contractを追加し、`response_kind` を内部判断の中心にする。 | `ai/services/ai_inference/emlis_ai_response_contract.py` |
| Phase20-2 | Safety Triageを追加し、自己否定安全応答、safety support、緊急安全境界を分ける。 | `emlis_ai_safety_triage.py`, `emlis_ai_self_denial_safe_state_answer.py` |
| Phase20-3 | Input Material Bundle / Eligibility Routerを追加し、文字数やC/D専用cueではなく入力束で材料量を読む。 | `emlis_ai_input_material_bundle.py`, `emlis_ai_observation_eligibility_router.py` |
| Phase20-4 | Low Information Observationを汎用復旧し、見えている範囲とunknown slotsを分けて返す。 | `emlis_ai_low_information_observation_composer.py`, `test_emlis_ai_low_information_observation_phase20_4.py` |
| Phase20-5 | Gate Recovery Loopを追加し、Gate failureを短縮・限定・断定弱化・低情報/安全応答へ回す。 | `emlis_ai_gate_recovery_loop.py`, `test_emlis_ai_gate_recovery_loop_phase20_5.py` |
| Phase20-6 | Generic SentencePlan / Surfaceへ移し、C/D専用完成surfaceをruntime本線から外す。 | `emlis_ai_complete_surface_realizer.py`, `test_emlis_ai_generic_sentence_surface_realizer_phase20_6.py` |
| Phase20-7 | Public Boundary / RN Contractを整理し、internal response contractやdiagnosticをpublic表示sourceへ出さない。 | `emlis_ai_public_feedback_meta.py`, `emotion_submit_service.py`, `Cocolon/tests/rn-screen-contracts.test.js` |
| Phase20-8 | QA Matrixを追加し、exact generated text一致ではなくfamily品質とfatal条件で見る。 | `emlis_ai_response_contract_qa_matrix.py`, `test_emlis_ai_response_contract_qa_matrix_phase20_8.py` |
| Phase20-9 | Phase19 C/D専用mode・cue・完成surfaceをproduction本線から撤回し、汎用materialへ吸収する。 | `emlis_ai_shared_reception_evidence.py`, `emlis_ai_reception_mode_resolver.py`, `emlis_ai_complete_surface_realizer.py`, `test_emlis_ai_phase20_9_phase19_withdrawal.py` |
| Phase20-10 | 実機ログでAだけ表示されなかったscope-only blocker問題を、低情報material成立時だけ補正する。 | `emlis_ai_observation_display_repair_integration.py`, `test_emlis_ai_phase20_10_real_device_recheck.py` |
| Phase20-11 | Mash様の実機確認により、Phase20のA/B/C/Dサンプル入力すべてでRN modal「Emlisの観測」が表示されたことを資料同期として記録する。 | 資料同期のみ。production RN UI / DB / API / public response key 変更なし。 |

## 最新実ファイル上の主な追加 / 変更path

| 区分 | path | 読み方 |
|---|---|---|
| 追加 | `mashos-api/ai/services/ai_inference/emlis_ai_response_contract.py` | 内部response_kind contract。 |
| 追加 | `mashos-api/ai/services/ai_inference/emlis_ai_safety_triage.py` | safety triage分類。 |
| 追加 | `mashos-api/ai/services/ai_inference/emlis_ai_self_denial_safe_state_answer.py` | 自己否定安全応答surface。 |
| 追加 | `mashos-api/ai/services/ai_inference/emlis_ai_input_material_bundle.py` | 入力material bundle。 |
| 追加 | `mashos-api/ai/services/ai_inference/emlis_ai_observation_eligibility_router.py` | material quality -> response kind routing。 |
| 追加 | `mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_loop.py` | Gate failure recovery policy。 |
| 追加 | `mashos-api/ai/services/ai_inference/emlis_ai_response_contract_qa_matrix.py` | QA Matrix helper。 |
| 追加 | `mashos-api/ai/tests/helpers/emlis_ai_phase20_phase19_diff_inventory.py` | Phase19差分分類inventory。 |
| 追加 | `mashos-api/ai/tests/test_emlis_ai_phase20_10_real_device_recheck.py` | 実機A/B/C/D再確認fixture。 |
| 変更 | `mashos-api/ai/services/ai_inference/emlis_ai_observation_display_repair_integration.py` | 低情報material成立時のscope-only blockerをA実機非表示の最終理由にしない。 |
| 変更 | `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | response_kind / safety triage / material bundle / recovery結果をreply生成に接続。 |
| 変更 | `mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py` | internal contract / mode / diagnostic bodyをpublic metaへ漏らさない。 |
| 変更 | `mashos-api/ai/services/ai_inference/emotion_submit_service.py` | public input_feedback境界をPhase20 response_kindに合わせて保持。 |
| 変更 | `mashos-api/ai/services/ai_inference/emlis_ai_shared_reception_evidence.py` | Phase19 C/D専用cueをproduction本線から撤回し、generic relation materialへ寄せる。 |
| 変更 | `mashos-api/ai/services/ai_inference/emlis_ai_reception_mode_resolver.py` | C/D専用mode priorityを本線から外す。 |
| 変更 | `mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py` | mode別完成surfaceではなくgeneric sentence plan / surface ruleへ寄せる。 |
| 変更 | `mashos-api/ai/services/ai_inference/config/emlis_reception_assistance_dictionary.v1.json` | C/D専用surface復旧ではなくgeneric materialとして扱う。 |
| 維持 | `Cocolon/tests/rn-screen-contracts.test.js` | RN production UIは変更せず、`passed + commentText` のshape / behavior contractを維持。 |

## Phase20後の固定境界

```text
DB physical schema: 変更なし
API route: 追加なし
RN production UI: 変更なし
public response key: 追加なし
public observation_status enum: 増やさない
visible body: input_feedback.comment_text のみ
RN modal title: Emlisの観測
RN open condition: observation_status == passed && commentText non-empty
```

## A/B/C/D実機確認fixtureの扱い

```text
A:
  low_information_observation として表示する。
  scope-only blockerで無応答にしない。

B:
  self_denial_safe_state_answer として、自己否定を本人の事実として確定しない。

C / D:
  C/D専用mode・cue・完成surfaceではなく、generic sentence plan / generic relation materialで返す。

A/C/D exact fixture:
  runtime条件ではなく、無応答・case専用route・safety境界破壊の再発を検出する回帰fixture。
```

## Phase20-11 資料同期 / Mash実機ABCD表示確認

```text
Mash様の実機確認により、Phase20にあるA/B/C/Dサンプル入力すべてでRN modal「Emlisの観測」が表示されたことを確認済みとして読む。
この確認は表示有無の確認であり、文章品質・読感品質・商品品質の最終合格ではない。
raw input本文、comment_text本文、実レスポンスJSON本文、スクリーンショット本文は前提資料へ記録しない。
ABCDは引き続き回帰fixtureであり、case専用runtime route、case専用mode、case専用cue、完成文テンプレ、exact commentText一致の根拠にしない。
```


01 / 02系のfull inventory本文は全面再生成しない。今回の差分は、Phase20で増えたEmlisAI撤回保持再設計のcurrent owner、public/RN境界、内部名、QA・実機再確認の読み方を、必要箇所へ差分追記する更新である。

# 2026-06-01 差分追記: EmlisAI Phase20-12〜20-15 表示信頼性補強 snapshot差分

最新実ファイル `Cocolon_5(22).zip` / `mashos-api_5(47).zip` を確認した。`Cocolon_前提資料(161).zip` はPhase20-11までを記録済みであり、最新実ファイル側にはPhase20-12〜20-15の表示信頼性補強が入っているため、この差分を前提資料へ追記する。

## 確認snapshot

| source | count | sha256 |
|---|---:|---|
| `Cocolon_前提資料(161).zip` | 41 premise files | `f149da67d933b45ef9eaef2fb6b871367c8320c8a50360a5a150d2688112016b` |
| `Cocolon_5(22).zip` | 217 | `3b4185f2950d3f5fc6d26a09197bcef842353fbfc922abf5b263e9bf7ad443e7` |
| `mashos-api_5(47).zip` | 738 | `99e666592689d8f575ec4f9e369531542049ca307c904b6f4f7acb239a73923f` |
| total実ファイル | 955 | - |

## Phase20-12〜20-15の実装読み方

| Phase | 実装読み方 | 主なpath |
|---|---|---|
| Phase20-12 | `render_emlis_ai_reply()` の旧fail-closed説明コメントを、displayable response kindではbounded repair / recoveryを通す説明へ更新した。実装ロジックは変更しない。 | `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` |
| Phase20-13 | final pre-return gate後にdisplayable response kindが空白へ戻らないこと、safety / infraを通常Emlis観測としてpassed化しないことをregression testで固定した。 | `mashos-api/ai/tests/test_emlis_ai_post_final_gate_recovery_phase20_13.py` |
| Phase20-14 | post-final gate recoveryを実装し、normal / low_information / limited_grounding がfinal pre-return gate後に落ちても、safety / infraでない限り一回だけ回復を試す。 | `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`, `mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_loop.py` |
| Phase20-15 | Gate Recovery surface binding meta / repetition QAを追加し、fixed fallback化を本文一致ではなくmaterial slot / relation family / surface familyで検出する。 | `mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_loop.py`, `mashos-api/ai/tests/test_emlis_ai_gate_recovery_surface_phase20_15.py` |

## 最新実ファイル上の差分

### Cocolon

| 区分 | 件数 | 内容 |
|---|---:|---|
| 追加 | 0 | なし |
| 削除 | 0 | なし |
| 修正 | 0 | production RN UI / RN contract変更なし |

### mashos-api

| 区分 | 件数 | 内容 |
|---|---:|---|
| 追加 | 2 | `test_emlis_ai_post_final_gate_recovery_phase20_13.py`, `test_emlis_ai_gate_recovery_surface_phase20_15.py` |
| 削除 | 0 | なし |
| 修正 | 2 | `emlis_ai_reply_service.py`, `emlis_ai_gate_recovery_loop.py` |

## 追加 / 修正path

```text
追加:
  mashos-api/ai/tests/test_emlis_ai_post_final_gate_recovery_phase20_13.py
  mashos-api/ai/tests/test_emlis_ai_gate_recovery_surface_phase20_15.py

修正:
  mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
  mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_loop.py
```

## Phase20-12〜20-15後の固定境界

```text
- RN production UIは変更しない。
- /emotion/submit route、request key、response keyは変更しない。
- public response key、observation_status enum、DB physical schemaは増やさない。
- response_kind / safety_triage_kind / material_quality / phase20_13_post_final_gate_recovery / phase20_15_gate_recovery_surface_binding はRN表示sourceではない。
- post-final recoveryは、Gateを緩めるものではなく、displayable response kindの最後の空白戻りを一回だけ回復する内部境界である。
- safety_blocked_emergency / infrastructure_error / safety_support_required は通常Emlis観測としてpassed化しない。
- Gate Recovery surface binding metaは本文・raw input・comment_text bodyを保存しない。
- fixed_fallback_used=falseだけを合格根拠にせず、surface family / closing family / relation family / repetition QAで確認する。
```

## 確認したテスト

```text
python -m py_compile
  services/ai_inference/emlis_ai_reply_service.py
  services/ai_inference/emlis_ai_gate_recovery_loop.py
  tests/test_emlis_ai_post_final_gate_recovery_phase20_13.py
  tests/test_emlis_ai_gate_recovery_surface_phase20_15.py

python -m pytest tests/test_emlis_ai_post_final_gate_recovery_phase20_13.py -q
  5 passed

python -m pytest tests/test_emlis_ai_gate_recovery_surface_phase20_15.py tests/test_emlis_ai_gate_recovery_loop_phase20_5.py -q
  17 passed

python -m pytest tests/test_emlis_ai_response_contract_qa_matrix_phase20_8.py tests/test_emlis_ai_phase20_7_public_boundary_rn_contract.py tests/test_emlis_ai_public_boundary_phase20_7.py tests/test_emlis_ai_phase20_10_real_device_recheck.py -q
  28 passed, 1 warning
```

warningは既存の Pydantic `root_validator` deprecation warning であり、Phase20-12〜20-15差分とは直接関係しない。

## この前提資料更新で触った資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/01_cocolon_overall_structure.md
Cocolon_前提資料/01A_cocolon_overall_structure_app_foundation_home.md
Cocolon_前提資料/02_cocolon_national_system.md
Cocolon_前提資料/02A_cocolon_national_system_input_save_dispatch.md
Cocolon_前提資料/02C_cocolon_contract_boundary_validation.md
Cocolon_前提資料/03_cocolon_naming_system.md
Cocolon_前提資料/04_cocolon_change_theme_checklist.md
Cocolon_前提資料/05_cocolon_rule_file_index.md
Cocolon_前提資料/07_latest_snapshot_diff.md
Cocolon_前提資料/09_naming_boundary.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/manifest.json
```

01 / 02系のfull inventory本文は全面再生成しない。今回の差分は、Phase20-12〜20-15で増えた表示信頼性補強、post-final recovery、Gate Recovery surface binding / repetition QAの読み方を、必要箇所へ差分追記する更新である。

# 2026-06-03 差分追記: EmlisAI Product Read Feel v1 / Structure Insight v2 Phase1-11 snapshot差分

最新実ファイル `Cocolon_12(10).zip` / `mashos-api_12(13).zip` を確認した。`Cocolon_前提資料(165).zip` はPhase20-12〜20-15の表示信頼性補強までを基準面として持つが、最新backendにはProduct Read Feel v1 / Structure Insight v2のPhase1〜11実装が入っているため、この差分を前提資料へ追記する。

## 確認snapshot

| source | count | sha256 |
|---|---:|---|
| `Cocolon_前提資料(165).zip` | 39 premise files | `faa51796893bc1e8bc0c26f74599ad5a14c0795997e07733105477dba068fc0f` |
| `Cocolon_12(10).zip` | 217 | `a1ff199a84249fcc2f2311ad4d22a57babfa6f6e19ebea631d75827dc557f0d7` |
| `mashos-api_12(13).zip` | 759 | `b700cfa126e6268db3ef0187a7370b2b31279c33ffe4178cefbd69935bcb0425` |
| total実ファイル | 976 | - |

RN側は、手元の前回RN実体 `Cocolon(204).zip` と `Cocolon_12(10).zip` が同一であることを確認した。今回の差分はbackend内部のEmlisAI QA / scorecard / Structure Insight候補・Gate・Long-run Product Gate接続であり、RN production UIの差分ではない。

## Phase1〜11の実装読み方

| Phase | 実装読み方 | 主なpath |
|---|---|---|
| Phase1 | family別の現在出力棚卸しを作り、表示不達・契約違反・表面破綻・読感不足・構造気づき不足へ分類する。 | `mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_current_output_inventory.py` |
| Phase2 | Product Read Feel rubricを定義し、Blind QA ratingsとmachine metricsを分離する。`read_feeling` をmachine metricsで自動補完しない。 | `mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_rubric.py` |
| Phase3 | fixture familyをmeta-only registryとして定義する。exact comment_text一致やcase専用runtime条件には使わない。 | `mashos-api/ai/tests/fixtures/emlis_ai_product_readfeel_fixture_families.py` |
| Phase4 | Product Read Feel evaluatorをmeta-only scorecardとして追加し、v1 product pass候補とv2 readinessを分ける。 | `mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_scorecard.py` |
| Phase5 | 現在surfaceのv1修正として、positive過重化、self-denial identity claim事実化、low-information重すぎ問題を補正する。 | `emlis_ai_state_answer_ratio_policy.py`, `emlis_ai_two_stage_section_surface_plan.py`, `emlis_ai_complete_surface_realizer.py` |
| Phase6 | mirror-only / self-report-only detectorを追加し、v1ではYELLOW / REPAIR_REQUIRED、v2ではinsight_delta gapへ接続する。 | `mashos-api/ai/services/ai_inference/emlis_ai_mirror_only_surface_detector.py` |
| Phase7 | Structure Insight候補を表示文ではなく内部materialとして作る。source field ids、evidence slot count、inference strength、soft expression必須を持つ。 | `mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_candidate.py` |
| Phase8 | Mash構造知識の辞書化プロセスをdoc / testで固定する。診断辞書・性格辞書・一般論辞書にしない。 | `mashos-api/ai/docs/Cocolon_EmlisAI_構造辞書更新運用_華恋用_2026-06-02.md`, `mashos-api/ai/tests/test_emlis_ai_structure_dictionary_update_operation_phase8.py` |
| Phase9 | Structure Insight Gateを追加し、unsafe insight / diagnosis / personality claim / cause claim / target judgement / soft expression missingを止める。 | `mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_gate.py` |
| Phase10 | Structure Insight surfaceを限定familyだけに接続する。Gateを通し、daily / low-informationへ深いinsightを無理に出さない。 | `mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_surface.py` |
| Phase11 | Long-run QA / Product Gate candidate materialを追加し、5件・10件連続、family横断反復、insight同構文反復を見てv1/v2を分ける。 | `mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_long_run_product_gate.py` |

## 最新実ファイル上の差分

### Cocolon

| 区分 | 件数 | 内容 |
|---|---:|---|
| 追加 | 0 | なし |
| 削除 | 0 | なし |
| 修正 | 0 | RN production UI / RN contract変更なし |

### mashos-api

Phase20-12〜20-15基準面の手元実体 `mashos-api(117).zip` と最新 `mashos-api_12(13).zip` を比較した範囲では、backend側は21ファイル追加、7ファイル修正、削除0として読む。

```text
追加:
  mashos-api/ai/docs/Cocolon_EmlisAI_構造辞書更新運用_華恋用_2026-06-02.md
  mashos-api/ai/services/ai_inference/emlis_ai_mirror_only_surface_detector.py
  mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_current_output_inventory.py
  mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_long_run_product_gate.py
  mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_rubric.py
  mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_scorecard.py
  mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_candidate.py
  mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_gate.py
  mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_surface.py
  mashos-api/ai/tests/fixtures/emlis_ai_product_readfeel_fixture_families.py
  mashos-api/ai/tests/test_emlis_ai_mirror_only_surface_detector.py
  mashos-api/ai/tests/test_emlis_ai_product_readfeel_current_output_inventory_phase1.py
  mashos-api/ai/tests/test_emlis_ai_product_readfeel_fixture_families.py
  mashos-api/ai/tests/test_emlis_ai_product_readfeel_phase11_long_run_product_gate.py
  mashos-api/ai/tests/test_emlis_ai_product_readfeel_rubric.py
  mashos-api/ai/tests/test_emlis_ai_product_readfeel_scorecard.py
  mashos-api/ai/tests/test_emlis_ai_product_readfeel_surface_v1_phase5.py
  mashos-api/ai/tests/test_emlis_ai_structure_dictionary_update_operation_phase8.py
  mashos-api/ai/tests/test_emlis_ai_structure_insight_candidate.py
  mashos-api/ai/tests/test_emlis_ai_structure_insight_gate.py
  mashos-api/ai/tests/test_emlis_ai_structure_insight_surface_phase10.py

修正:
  mashos-api/ai/services/ai_inference/emlis_ai_complete_composer_client.py
  mashos-api/ai/services/ai_inference/emlis_ai_complete_product_quality_scorecard_service.py
  mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py
  mashos-api/ai/services/ai_inference/emlis_ai_observation_scorecard_blind_qa.py
  mashos-api/ai/services/ai_inference/emlis_ai_runtime_surface_blind_qa_long_run.py
  mashos-api/ai/services/ai_inference/emlis_ai_state_answer_ratio_policy.py
  mashos-api/ai/services/ai_inference/emlis_ai_two_stage_section_surface_plan.py
```

## Product Read Feel / Structure Insight後の固定境界

```text
- /emotion/submit route、request key、response keyは変更しない。
- public response key、observation_status enum、DB physical schemaは増やさない。
- RN production UI、RN表示タイトル、RN表示条件は変更しない。
- Product Read Feel v1 / Structure Insight v2 / PRODUCT_PASS / STRUCTURE_INSIGHT_READY は内部評価語であり、public statusではない。
- read_feelingはBlind QAで評価し、machine metricsから自動補完しない。
- fixture familyは正解本文一致ではなく、family別読感・禁止境界・ratio・v2 opportunityを見る。
- mirror-only detector、Structure Insight candidate、Structure Insight Gate、Long-run Product Gate candidateは本文やraw inputをmetaへ保持しない。
- Phase11ではProduct Gate candidate materialを作るが、product_gate_ready / public_release_applied はfalseのまま。release判断は別工程に残す。
- Structure Insight surfaceは限定family接続であり、low_information / daily_unpleasant / daily_positive / positive_onlyへ深い構造気づきを無理に出さない。
```

## 日本語ファイル名の扱い

`mashos-api_12(13).zip` にはPhase8運用docとして日本語名pathが残っている。zip展開環境によってはこのpathがescape名や文字化け名に見える可能性があるため、今後の差分成果物・新規運用doc・前提資料更新成果物ではASCII file nameを優先する。同じ内容の日本語名ファイルとescape名ファイルを重複追加して補正しない。

## この前提資料更新で触った資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/01_cocolon_overall_structure.md
Cocolon_前提資料/02C_cocolon_contract_boundary_validation.md
Cocolon_前提資料/05_cocolon_rule_file_index.md
Cocolon_前提資料/07_latest_snapshot_diff.md
Cocolon_前提資料/09_naming_boundary.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/manifest.json
```

01 / 02系のfull inventory本文は全面再生成しない。今回の差分は、Product Read Feel v1 / Structure Insight v2 Phase1〜11で増えたbackend内部material、QA、scorecard、Gate、Long-run Product Gate candidate、filename encoding boundaryの読み方を必要箇所へ差分追記する更新である。


# 2026-06-04 差分追記: EmlisAI User Label Connection Observation v1 Phase0-10 latest snapshot diff

## 基準面

```text
前提資料: Cocolon_前提資料(171).zip
RN実ファイル: Cocolon_11(6).zip
backend実ファイル: mashos-api_11(15).zip
比較基準: Cocolon(206).zip / mashos-api(119).zip
```

## Cocolon / RN

`Cocolon_11(6).zip` は `Cocolon(206).zip` と比較して追加0、削除0、修正0として確認する。User Label Connection Observation v1 Phase0-10では、RN production UI、RN表示タイトル、RN表示条件、RN contract sourceは変更されていない。

## mashos-api

`mashos-api(119).zip` から `mashos-api_11(15).zip` への全体差分は追加22、修正2、削除1である。このうちUser Label Connection Observation v1関連差分は追加21、修正2、削除0として読む。残る追加1・削除1は、既存の構造辞書運用docがUnicode名からescape名へ見えるfilename encoding差分であり、User Label Connection実装差分ではない。

```text
追加:
  mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_candidate.py
  mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_contract_inventory.py
  mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_derived_model_cache.py
  mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_gate.py
  mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_material.py
  mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_product_quality_qa.py
  mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_public_meta.py
  mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_surface.py
  mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_types.py
  mashos-api/ai/tests/test_emlis_ai_user_label_connection_candidate.py
  mashos-api/ai/tests/test_emlis_ai_user_label_connection_derived_model_cache.py
  mashos-api/ai/tests/test_emlis_ai_user_label_connection_e2e_contract.py
  mashos-api/ai/tests/test_emlis_ai_user_label_connection_edge_family_score.py
  mashos-api/ai/tests/test_emlis_ai_user_label_connection_free_tier_boundary.py
  mashos-api/ai/tests/test_emlis_ai_user_label_connection_gate.py
  mashos-api/ai/tests/test_emlis_ai_user_label_connection_low_information_boundary.py
  mashos-api/ai/tests/test_emlis_ai_user_label_connection_material.py
  mashos-api/ai/tests/test_emlis_ai_user_label_connection_no_raw_text_meta.py
  mashos-api/ai/tests/test_emlis_ai_user_label_connection_product_quality_qa.py
  mashos-api/ai/tests/test_emlis_ai_user_label_connection_public_boundary.py
  mashos-api/ai/tests/test_emlis_ai_user_label_connection_surface.py

修正:
  mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
  mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py

filename encoding差分（ULC対象外）:
  追加: mashos-api/ai/docs/Cocolon_EmlisAI_#U69cb#U9020#U8f9e#U66f8#U66f4#U65b0#U904b#U7528_#U83ef#U604b#U7528_2026-06-02.md
  削除: mashos-api/ai/docs/Cocolon_EmlisAI_構造辞書更新運用_華恋用_2026-06-02.md
```

## Phase別の実装差分

| Phase | 最新の読み方 | 主な実ファイル |
|---|---|---|
| Phase0 | 設計書を前提資料へ追加し、初回実装境界を固定する。 | `Cocolon_EmlisAI_UserLabelConnectionObservation_v1_Design_2026-06-03.md` |
| Phase1 | Contract inventory / 接続点確認で、`/emotion/submit`、RN表示条件、public meta、DB physical boundary、Structure Insight Gate非緩和を固定する。 | `emlis_ai_user_label_connection_contract_inventory.py`, `test_emlis_ai_user_label_connection_e2e_contract.py` |
| Phase2 | current input / owned history を `UserLabelPoint` と text-free `UserLabelConnectionMaterial` へ正規化する。 | `emlis_ai_user_label_connection_types.py`, `emlis_ai_user_label_connection_material.py`, `test_emlis_ai_user_label_connection_material.py`, `test_emlis_ai_user_label_connection_free_tier_boundary.py`, `test_emlis_ai_user_label_connection_no_raw_text_meta.py` |
| Phase3 | material内でedge familyとprivate scoreを生成する。scoreはpublicへ出さない。 | `emlis_ai_user_label_connection_material.py`, `test_emlis_ai_user_label_connection_edge_family_score.py` |
| Phase4 | edgeからMechanism candidateを作る。candidateはGate前にvisible化しない。 | `emlis_ai_user_label_connection_candidate.py`, `test_emlis_ai_user_label_connection_candidate.py` |
| Phase5 | User Label Connection専用Gateを追加し、Free/history、grounding、low_information、scope/soft marker、禁止claim、raw text混入をblockする。 | `emlis_ai_user_label_connection_gate.py`, `test_emlis_ai_user_label_connection_gate.py`, `test_emlis_ai_user_label_connection_low_information_boundary.py` |
| Phase6 | Gate通過candidateを限定Surface Planへ変換する。connectable familyは `structure_question` / `long_meaning_arc` / `self_understanding_follow` に限定する。 | `emlis_ai_user_label_connection_surface.py`, `test_emlis_ai_user_label_connection_surface.py` |
| Phase7 | reply flowへmeta-onlyで接続し、`input_feedback.emlis_ai.user_label_connection` にはsafe summaryのみを出す。 | `emlis_ai_user_label_connection_public_meta.py`, `emlis_ai_public_feedback_meta.py`, `emlis_ai_reply_service.py`, `test_emlis_ai_user_label_connection_public_boundary.py` |
| Phase8 | 限定familyだけを既存 `Emlisの観測` 本文へ接続する。scope marker / soft marker / runtime gate / visible acceptanceを再評価する。 | `emlis_ai_user_label_connection_surface.py`, `emlis_ai_user_label_connection_public_meta.py`, `emlis_ai_reply_service.py`, `test_emlis_ai_user_label_connection_surface.py`, `test_emlis_ai_user_label_connection_public_boundary.py` |
| Phase9 | Product Quality QA / Blind QA materialを追加し、pytest greenだけでは商品品質合格にしない境界を固定する。 | `emlis_ai_user_label_connection_product_quality_qa.py`, `test_emlis_ai_user_label_connection_product_quality_qa.py` |
| Phase10 | Derived User Model cacheは実装ではなく検討metaのみ。runtime computed materialをsource of truthとして維持する。 | `emlis_ai_user_label_connection_derived_model_cache.py`, `test_emlis_ai_user_label_connection_derived_model_cache.py` |

## 不変境界

```text
- RN production UI、RN表示タイトル `Emlisの観測`、RN表示条件は変更しない。
- /emotion/submit route、request key、response key、DB physical nameは変更しない。
- public response keyは追加しない。既存 input_feedback.emlis_ai 内のsafe summaryのみ additive に扱う。
- raw current input、raw history input、memo、memo_action、comment_text body、candidate body、surface body、QA review bodyをmeta/publicへ保持しない。
- User Fact Grounding Boundary と既存Structure Insight Gateを緩めない。
- Freeでは履歴接続を使わず current_input_only を維持する。
- low_informationを履歴だけでeligibleへ昇格させない。
- scope marker / soft markerなしの履歴接続surfaceを出さない。
- diagnosis / personality / cause / advice / future_prediction / always / should claimを出さない。
- Phase10時点では cache read / write / persist / DB schema変更 / label_connection_map実データ永続化をしない。
```

## 検証済み

```text
cd mashos-api
python -m pytest -q ai/tests/test_emlis_ai_user_label_connection_*.py ai/tests/test_emlis_ai_phase20_7_public_boundary_rn_contract.py
107 passed, 1 warning

cd Cocolon
node --test tests/rn-screen-contracts.test.js
35 passed
```

warningは既存Pydantic deprecation warningであり、今回差分の失敗ではない。

## sha256

| source | sha256 |
|---|---|
| `Cocolon_前提資料(171).zip` | `92caaed35379e4ac80f0fab98361f1cd65bb8e147dcf2506ec4ad8aff9f33b1f` |
| `Cocolon_11(6).zip` | `27b53d403195d8b24032dc6863a6e0bf8a4d0bd2fd0f3693afffa850243ed397` |
| `mashos-api_11(15).zip` | `b314492d912247855228024932f1e8a3f868d5af486abfd13fe91deec85f2565` |


# 2026-06-04 差分追記: EmlisAI Product Quality Measurement / Blocker Repair Phase0-8 latest snapshot diff

今回のローカル最新基準:

```text
前提資料: Cocolon_前提資料(173).zip
RN実ファイル: Cocolon_9(17).zip
backend実ファイル: mashos-api_9(27).zip
Cocolon file count: 217
mashos-api file count: 797
total file count: 1014
```

Cocolon側は、EmlisAI Product Quality Measurement Phase0-8に伴うproduction RN UI、RN表示タイトル、RN表示条件、public response shapeの変更はない。`Cocolon/tests/rn-screen-contracts.test.js` は引き続き `passed + commentText` の既存契約を守るための確認対象として読む。

mashos-api側では、前提資料上のUser Label Connection Observation v1 Phase0-10後に、EmlisAI Product Quality Measurement / Blocker Repair Phase0-8として次のbackend internal-onlyファイルを最新構造へ追加して読む。

| 追加/反映file | snapshot上の意味 |
|---|---|
| `ai/services/ai_inference/emlis_ai_product_quality_contract_freeze.py` | Phase0 contract freeze material。 |
| `ai/services/ai_inference/emlis_ai_product_quality_measurement_event.py` | Phase2 ProductQualityEventV1 schema / normalizer。 |
| `ai/services/ai_inference/emlis_ai_product_quality_measurement_runner.py` | Phase1 bootstrap + Phase3 runner + Phase4-8接続hub。 |
| `ai/services/ai_inference/emlis_ai_product_quality_blocker_matrix.py` | Phase4 blocker matrix。 |
| `ai/services/ai_inference/emlis_ai_product_quality_generation_repair_design.py` | Phase5 blocker別生成修正設計material。 |
| `ai/services/ai_inference/emlis_ai_product_quality_blind_qa_integration.py` | Phase6 Blind QA Integration。 |
| `ai/services/ai_inference/emlis_ai_product_release_decision.py` | Phase7 Release Decision Layer。 |
| `ai/services/ai_inference/emlis_ai_product_quality_validation_plan.py` | Phase8 Validation Plan。 |
| `ai/tests/test_emlis_ai_product_quality_phase0_contract_freeze.py` | Phase0 contract freeze test。 |
| `ai/tests/test_emlis_ai_product_quality_phase1_local_composer_bootstrap.py` | Phase1 composer bootstrap test。 |
| `ai/tests/test_emlis_ai_product_quality_measurement_event.py` | Phase2 event normalizer test。 |
| `ai/tests/test_emlis_ai_product_quality_measurement_runner.py` | Phase3 runner test。 |
| `ai/tests/test_emlis_ai_product_quality_blocker_matrix.py` | Phase4 matrix test。 |
| `ai/tests/test_emlis_ai_product_quality_generation_repair_design.py` | Phase5 repair design test。 |
| `ai/tests/test_emlis_ai_product_quality_blind_qa_integration.py` | Phase6 Blind QA integration test。 |
| `ai/tests/test_emlis_ai_product_release_decision.py` | Phase7 release decision test。 |
| `ai/tests/test_emlis_ai_product_quality_validation_plan.py` | Phase8 validation plan test。 |

読み方:

- 今回の差分は、商品品質到達宣言ではなく、計測・blocker分解・Blind QA・内部release判断・検証計画の基盤追加である。
- `product_release_decision.release_allowed` や `phase8_validation_passed` は内部materialであり、public releaseやall rollout適用ではない。
- validation未実行、Blind QA未実施、Phase11未green、blocker残存はrelease不可として読む。

不変境界:

```text
RN production UI変更なし
RN表示タイトル `Emlisの観測` 変更なし
RN表示条件 `observation_status === passed && commentText non-empty` 変更なし
/emotion/submit route / request key / public response top-level shape 変更なし
DB physical schema / write path 変更なし
public response key追加なし
Gate緩和なし
固定テンプレート追加なし
A/C/D fixture専用runtime branch追加なし
product_gate_ready / public_release_applied を立てない
raw input / comment_text body / candidate body / surface body をrelease materialへ入れない
```

# 2026-06-05 差分追記: EmlisAI Gate Recovery Public Surface Leak Repair P0-P12 latest snapshot diff

最新実ファイル `Cocolon_13(5).zip` / `mashos-api_13(8).zip` を確認した。`Cocolon_前提資料(176).zip` は2026-06-04のProduct Quality Measurement Phase0-8 / User Label Connection Observation基準を持つが、最新実ファイル側にはGate Recovery public surface leak repair P0〜P12が追加実装されているため、この差分を前提資料へ追記する。

## 基準zip

| source | file count | sha256 |
|---|---:|---|
| `Cocolon_前提資料(176).zip` | 43 | `217f3e1827cd85bed8bca2efc77ab485567c7f2fa6d235e7cba51683831bd3a4` |
| `Cocolon_13(5).zip` | 217 | `162b6903d386389c5e4d165ff8853096476851fc973b68ea68a2007c669d0f1b` |
| `mashos-api_13(8).zip` | 812 | `697de196a378649f8aaf769f7f0cbf06ecfa739653633754210abe17ae6de1a0` |
| total source | 1029 | - |

`mashos-api(121).zip` / `Cocolon(208).zip` をGate Recovery public surface leak repair前の比較基準として見ると、差分は次の通り。

| repo | added | changed | removed | 読み方 |
|---|---:|---:|---:|---|
| Cocolon | 0 | 1 | 0 | RN production UI変更なし。`rn-screen-contracts.test.js` でP10 contract回帰を追加。 |
| mashos-api | 15 | 11 | 0 | P0〜P12のboundary / builder / ProductQuality / validation / regression fixtureを追加・接続。 |

`mashos-api_12(14).zip` から `mashos-api_13(8).zip` への最終差分だけを見ると、P12 validation plan finalizationとして backend 2件追加・3件変更である。

## Cocolon側変更

| path | 読み方 |
|---|---|
| `Cocolon/tests/rn-screen-contracts.test.js` | RNが `passed + commentText` の既存契約だけでmodal payloadを作ること、non-passedやempty bodyではGate Recovery leakを表示しないことを固定する。production RN UIは変更しない。 |

## mashos-api側追加ファイル

| path | 追加された構造 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_public_constants.py` | P0/P1: public leak blocker / source kind / public role定数。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_public_boundary.py` | P2: GateRecoveryPublicBoundaryDecision。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_public_candidate_builder.py` | P5/P6/P7: public candidate builder、low-information recovery、bounded original repair。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_public_surface_validation_plan.py` | P12: 実装後validation plan。 |
| `mashos-api/ai/tests/fixtures/emlis_ai_real_device_gate_recovery_regression_cases_p11.py` | P11: F/E/G実機確認caseをmeta-only fixture化。 |
| `mashos-api/ai/tests/test_emlis_ai_gate_recovery_public_surface_boundary.py` | P0: public leak RED / blocker固定。 |
| `mashos-api/ai/tests/test_emlis_ai_gate_recovery_public_boundary_decision.py` | P2: boundary decision単体確認。 |
| `mashos-api/ai/tests/test_emlis_ai_gate_recovery_public_candidate_builder_p5.py` | P5: public candidate builder確認。 |
| `mashos-api/ai/tests/test_emlis_ai_gate_recovery_low_information_recovery_p6.py` | P6: low-information recovery接続確認。 |
| `mashos-api/ai/tests/test_emlis_ai_gate_recovery_original_candidate_repair_p7.py` | P7: bounded original repair確認。 |
| `mashos-api/ai/tests/test_emlis_ai_reply_service_gate_recovery_public_boundary_p4.py` | P4: reply_service保険境界確認。 |
| `mashos-api/ai/tests/test_emlis_ai_product_quality_surface_origin_p8.py` | P8: ProductQuality surface_origin確認。 |
| `mashos-api/ai/tests/test_emlis_ai_product_quality_gate_recovery_repair_design_p9.py` | P9: blocker matrix / generation repair design確認。 |
| `mashos-api/ai/tests/test_emlis_ai_real_device_gate_recovery_regression_p11.py` | P11: 実機確認caseを専用route化しない回帰確認。 |
| `mashos-api/ai/tests/test_emlis_ai_gate_recovery_public_surface_validation_plan_p12.py` | P12: post-implementation validation plan確認。 |

## mashos-api側変更ファイル

| path | 変更された構造 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_loop.py` | P3/P6/P7: public boundaryをrecovery loopへ接続し、builder結果だけを既存Gateへ流す。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | P4/P7: pre / post-final差し替え前の保険境界、original candidate受け渡し。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_product_quality_measurement_event.py` | P8: `surface_origin` normalizer / public leak blocker検出。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_product_quality_measurement_runner.py` | P8/P12: surface_origin集計、P12 validation plan出力。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_product_quality_blocker_matrix.py` | P9: Gate Recovery public leak blockerのcritical / release_blocking / owner分類。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_product_quality_generation_repair_design.py` | P9: `gate_recovery_public_surface_boundary_repair` track追加。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_product_quality_validation_plan.py` | P12: P12 validation item / backend・frontend・real-device validation commands追加。 |
| `mashos-api/ai/tests/test_emlis_ai_gate_recovery_loop_phase20_5.py` | P3以降のfail-closed / allowed source期待値へ更新。 |
| `mashos-api/ai/tests/test_emlis_ai_gate_recovery_surface_phase20_15.py` | Gate Recovery surface binding / public leak防止期待値を更新。 |
| `mashos-api/ai/tests/test_emlis_ai_post_final_gate_recovery_phase20_13.py` | post-final recoveryでmaterial surfaceをpublic昇格しない期待値へ更新。 |
| `mashos-api/ai/tests/test_emlis_ai_product_quality_validation_plan.py` | P12統合後のvalidation plan期待値へ更新。 |

## 固定する読み方

```text
Gate Recovery material surface は public comment_text の本文生成者ではない。
Gate Recovery は、表示本文を作る場所ではなく、回復境界・candidate source選択・QA blocker化の入口として読む。
```

allowed public sourceは次のように読む。

```text
complete_initial_composer
limited_composer
low_information_observation_composer
self_denial_safe_state_answer
bounded_repaired_original_candidate
complete_self_repair_candidate
```

forbidden public sourceは次である。

```text
phase20_5_gate_recovery_material_surface
phase20_13_post_final_gate_recovery_material_surface
diagnostic_recovery_surface
_build_recovery_comment_text() 由来の固定骨格文
「今回の入力では...」「原因や結論までは...」「誰かを良い悪いで...」系の内部姿勢文
```

## 01 / 02 full inventory本文の扱い

今回の差分は、P0〜P12で増えたGate Recovery public boundary / candidate builder / ProductQuality surface_origin / RN contract / regression fixture / validation planの読み方を、必要箇所へ差分追記する更新である。01 / 02系のfull inventory本文は全面再生成しない。


# 2026-06-06 差分追記: EmlisAI Normal Observation Public Recovery P0-P9 latest snapshot diff

比較対象は、前提資料 `Cocolon_前提資料(178).zip` と最新実ファイル `Cocolon_10(13).zip` / `mashos-api_10(25).zip` です。Cocolon側source countは `217` のまま、mashos-api側source countは前提資料上の直前基準 `812 -> 818`、合計 `1029 -> 1035` を最新coverage対象として読む。

今回の差分は、情報量がある通常入力で EmlisAI 候補が生成済みなのに `surface_grammar` / `relation_skeleton` / `visible_surface` 系で落ちた場合、`comment_text` 空で終わらせず、Gateを緩めず、公開用の `normal_observation_rebuild_candidate` を一回だけ作って既存Gateへ再投入するbackend内部補強である。

## 追加ファイル

| file | 構造上の意味 |
|---|---|
| `mashos-api/ai/tests/test_emlis_ai_gate_recovery_normal_observation_rebuild_p8.py` | P0赤テストからP8回帰へ更新された通常観測rebuild lineage test。 |
| `mashos-api/ai/tests/test_emlis_ai_gate_recovery_public_candidate_builder_p3_plan.py` | recovery plan / target selection / reason family固定test。 |
| `mashos-api/ai/tests/test_emlis_ai_gate_recovery_normal_observation_rebuild_builder_p4.py` | normal observation rebuild builderのeligibility、body-free meta、防御条件test。 |
| `mashos-api/ai/tests/test_emlis_ai_gate_recovery_normal_observation_rebuild_loop_p5.py` | Gate Recovery loopでnormal rebuild candidateが既存Gateを通ることを固定するtest。 |
| `mashos-api/ai/tests/test_emlis_ai_reply_service_normal_observation_rebuild_p6.py` | reply_service post-final経路でactual adopted candidate sourceを保持するtest。 |
| `mashos-api/ai/tests/test_emlis_ai_product_quality_normal_observation_rebuild_p7.py` | ProductQuality / public feedback diagnosticsでnormal rebuildをbody-freeに扱うtest。 |

## 変更された主な既存owner

| file | 差分の読み方 |
|---|---|
| `emlis_ai_gate_recovery_public_constants.py` | `normal_observation_rebuild_candidate` source kindとmissing blockerをallowed public candidate sourceとして追加。 |
| `emlis_ai_gate_recovery_public_candidate_builder.py` | surface failure familyを判定し、通常観測rebuild candidateを生成・選択する中心owner。Gate Recovery material surfaceは流用しない。 |
| `emlis_ai_gate_recovery_loop.py` | normal rebuild candidateをlow-information recoveryと分け、Reader / Grounding / Template / Runtime / Visible / Display Gateへ通す。 |
| `emlis_ai_reply_service.py` | pre / post-final採用候補の出自summaryをbody-freeに持ち、diagnostic material surfaceとの混同を避ける。 |
| `emlis_ai_display_gate.py` | rerender attempt系metaを正規化結果へ通す最小変更。Gate判定は緩めない。 |
| `emlis_ai_product_quality_measurement_event.py` | surface originとしてnormal rebuildをunknown扱いにせず、attempted / appliedをbody-free eventへ反映。 |
| `emlis_ai_product_quality_validation_plan.py` | P12 allowed public candidate sourceにnormal rebuildを追加。 |
| `emlis_ai_public_feedback_meta.py` | public diagnostic summaryにnormal rebuildのattempted / applied / source kindを本文なしで出す。 |
| `tests/fixtures/emlis_ai_real_device_gate_recovery_regression_cases_p11.py` / `test_emlis_ai_real_device_gate_recovery_regression_p11.py` | Gate Recovery material surface leakはblockedのまま、normal rebuildはpublic candidate lineageとして扱う回帰を追加。 |

## 最新flowでの読み方

```text
/emotion/submit save path
  -> render_emlis_ai_reply()
  -> original composer candidate generated / ai_generated
  -> Runtime / Visible / Display Gate failure
  -> failure family = surface_grammar / relation_skeleton / visible_surface / runtime_surface
  -> Gate Recovery public candidate builder
  -> normal_observation_rebuild_candidate
  -> existing Reader / Grounding / Template / Runtime / Visible / Display Gate
  -> passed + comment_text の場合だけ input_feedback としてRNへ届く
```

## 維持されたcontract

```text
- RN production UIは変更しない。
- RN表示タイトルは `Emlisの観測` のまま。
- RN表示条件は `input_feedback.emlis_ai.observation_status == passed` かつ `input_feedback.comment_text` 非空のまま。
- API route / request key / response key / DB write pathは変更しない。
- Display / Runtime / Visible / Grounding / Template / Safety Gateを緩めない。
- Gate Recovery material surfaceはpublic本文にしない。
- composer disabled / source unavailable / safety / infra failureを通常観測rebuildで偽装しない。
- raw input / original candidate body / candidate body / comment_text bodyをpublic metaやProductQuality eventへ入れない。
- schema実ファイル化は行っていない。
```

## ローカル検証

最新実ファイルに対して、normal observation rebuild主要関連backend回帰を確認した。

```text
backend normal observation rebuild主要関連: 56 passed
RN contract: 36 passed
```

P9はローカル検証工程であり、今回の最新実ファイルzip内に追加のproduction code変更はない。


# 2026-06-06 差分追記: EmlisAI Public Observation Recovery P0-P10 snapshot diff

今回の最新実ファイルは `Cocolon_11(8).zip` / `mashos-api_11(17).zip` として確認する。Cocolon側は作業開始時実体 `Cocolon(210).zip` から変更なし。mashos-api側は作業開始時実体 `mashos-api(123).zip` から、EmlisAI Public Observation Recovery P0〜P10として次の差分がある。

| repo | added | changed | removed |
|---|---:|---:|---:|
| Cocolon | 0 | 0 | 0 |
| mashos-api | 16 | 11 | 0 |

主な追加ファイル:

```text
mashos-api/ai/services/ai_inference/emlis_ai_public_observation_recovery_status.py
mashos-api/ai/services/ai_inference/emlis_ai_public_surface_requirement.py
mashos-api/ai/services/ai_inference/emlis_ai_product_surface_validation.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_initial_surface_availability.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_initial_surface_recomposition.py
mashos-api/ai/services/ai_inference/emlis_ai_labelled_two_stage_surface_recomposition.py
mashos-api/ai/tests/test_emlis_ai_public_observation_recovery_acceptance_p0.py
mashos-api/ai/tests/test_emlis_ai_public_surface_requirement_p1.py
mashos-api/ai/tests/test_emlis_ai_gate_recovery_normal_observation_rebuild_boundary_p2.py
mashos-api/ai/tests/test_emlis_ai_product_surface_validation_p3.py
mashos-api/ai/tests/test_emlis_ai_complete_initial_surface_availability_p4.py
mashos-api/ai/tests/test_emlis_ai_complete_initial_surface_recomposition_p5.py
mashos-api/ai/tests/test_emlis_ai_labelled_two_stage_surface_recomposition_p6.py
mashos-api/ai/tests/test_emotion_submit_public_feedback_inclusion_summary_p7.py
mashos-api/ai/tests/test_emlis_ai_public_meta_product_quality_lineage_p8.py
```

主な変更ファイル:

```text
mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_public_constants.py
mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_public_candidate_builder.py
mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_loop.py
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
mashos-api/ai/services/ai_inference/emlis_ai_product_quality_measurement_event.py
mashos-api/ai/services/ai_inference/emlis_ai_product_quality_validation_plan.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py
mashos-api/ai/services/ai_inference/emotion_submit_service.py
mashos-api/ai/tests/helpers/emlis_ai_public_observation_recovery_p0.py
mashos-api/ai/tests/helpers/emlis_ai_phase19_public_feedback_matrix.py
mashos-api/ai/tests/test_emotion_submit_phase19_real_device_abcd_public_feedback_e2e.py
```

差分詳細は `cocolon_local_file_inventory_diff_20260606.csv` に保持する。今回の差分はbackend内部の回復lane / meta / test診断補正であり、RN production UI、API route、DB write path、public response top-level keyの変更ではない。


# 2026-06-07 差分追記: EmlisAI Limited Grounding / Low Information 受け取り必須化 P0-P9 latest snapshot diff

比較対象は、前提資料 `Cocolon_前提資料(182).zip` と最新実ファイル `Cocolon_10(14).zip` / `mashos-api_10(27).zip` です。Cocolon側source countは `217` のまま、mashos-api側source countは直前実装基準 `834 -> 846`、合計 `1051 -> 1063` を最新coverage対象として読む。

今回の差分は、`limited_grounding` を true `low_information` と同じ質問中心surfaceへ潰さず、正式観測に届かない場合でも `Emlisから` の受け取りを返すbackend内部補強である。RN側、API route、DB write path、public response top-level keyは変更しない。

## 基準zip

| source | file count | sha256 |
|---|---:|---|
| `Cocolon_前提資料(182).zip` | 46 | `1a24fecff0ece27e7cec47e5922df9698cb89f048dc6217b213c9a34cd3f8331` |
| `Cocolon_10(14).zip` | 217 | `528c4988c83491345c96f593b018e5c3cf80018e762e92ed9369fd8b8946175c` |
| `mashos-api_10(27).zip` | 846 | `68f4b9b31d31dd4a72b12812ca2820118436a1dfdad95481a690294af3523735` |
| total app source | 1063 | - |

`Cocolon(211).zip` / `mashos-api(124).zip` を今回実装前の比較基準として見ると、差分は次の通り。

| repo | added | changed | removed | 読み方 |
|---|---:|---:|---:|---|
| Cocolon | 0 | 0 | 0 | RN production UI変更なし。`Emlisの観測` の表示契約も変更なし。 |
| mashos-api | 12 | 9 | 0 | P0〜P9のsurface requirement / recovery routing / reception helper / low-information composer / question guard / semantic material / E2E contractを追加・接続。 |

## 追加ファイル

| file | 構造上の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_grounding_reception_surface.py` | limited_grounding用の受け取りsurface helper。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_question_dominance_guard.py` | 質問支配を検出するbody-free guard。 |
| `mashos-api/ai/tests/test_emlis_ai_existing_regression_contract_p9.py` | P0〜P9のreception-required回帰 / contract確認。 |
| `mashos-api/ai/tests/test_emlis_ai_gate_recovery_limited_lowinfo_reception_p2.py` | P0〜P9のreception-required回帰 / contract確認。 |
| `mashos-api/ai/tests/test_emlis_ai_hij_input_material_bundle_current_p0.py` | P0〜P9のreception-required回帰 / contract確認。 |
| `mashos-api/ai/tests/test_emlis_ai_hij_reception_required_regression_p8.py` | P0〜P9のreception-required回帰 / contract確認。 |
| `mashos-api/ai/tests/test_emlis_ai_input_material_bundle_semantics_p7.py` | P0〜P9のreception-required回帰 / contract確認。 |
| `mashos-api/ai/tests/test_emlis_ai_labelled_two_stage_limited_reception_p3.py` | P0〜P9のreception-required回帰 / contract確認。 |
| `mashos-api/ai/tests/test_emlis_ai_limited_grounding_reception_surface_p4.py` | P0〜P9のreception-required回帰 / contract確認。 |
| `mashos-api/ai/tests/test_emlis_ai_low_information_reception_required_p5.py` | P0〜P9のreception-required回帰 / contract確認。 |
| `mashos-api/ai/tests/test_emlis_ai_product_surface_question_dominance_guard_p6.py` | P0〜P9のreception-required回帰 / contract確認。 |
| `mashos-api/ai/tests/test_emlis_ai_public_surface_requirement_limited_lowinfo_reception_p1.py` | P0〜P9のreception-required回帰 / contract確認。 |

## 変更された主な既存owner

| file | 差分の読み方 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_initial_surface_recomposition.py` | source unavailable側でもlimited_grounding reception surface helperへ戻せるようにする。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_public_candidate_builder.py` | limited_groundingを低情報laneから外し、labelled two-stage recomposition targetへ送る。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_input_material_bundle.py` | recovered_energy / future_intention / relationship_wish / comparison_baseline_shift / small_change_preservation / value_preservation / self_observationを追加する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_labelled_two_stage_surface_recomposition.py` | limited_groundingをunsupportedから外し、reception helperへ接続する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_low_information_observation_composer.py` | true low_informationを二段reception-required shapeへ組み立てる。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_surface_realizer_tone.py` | low_informationの二段bodyをline再連結で壊さないようにする。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_product_surface_validation.py` | question dominance guardとreception-required validationを追加する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_public_surface_requirement.py` | limited_grounding / low_informationのsurface requirementを分離する。 |
| `mashos-api/ai/tests/test_emlis_ai_gate_recovery_low_information_recovery_p6.py` | low_information recoveryの期待をreception-required shapeへ更新する。 |

## 最新flowでの読み方

```text
/emotion/submit save path
  -> render_emlis_ai_reply()
  -> input material bundle
  -> material_quality = eligible / limited_grounding / low_information / safety / infra
  -> public surface requirement
  -> limited_grounding: labelled_two_stage_surface_recomposition_candidate + limited_grounding_reception_surface
  -> low_information: low_information_observation_composer with reception-required body
  -> product_surface_validation + question_dominance_guard
  -> passed + comment_text の場合だけ input_feedback としてRNへ届く
```

## 維持されたcontract

```text
RN production UI変更なし
RN表示タイトル `Emlisの観測` 変更なし
RN表示条件 `input_feedback.emlis_ai.observation_status == passed && input_feedback.comment_text non-empty` 変更なし
/emotion/submit route変更なし
request key変更なし
public response top-level key変更なし
DB physical schema / write path変更なし
Gate緩和なし
固定テンプレート追加なし
H/I/J専用case route / case専用surface / fixed commentText追加なし
raw input / original body / candidate body / comment_text body のpublic meta混入なし
```

この差分で更新しないもの:

```text
- 01 / 02 full inventory本文の全面再生成は行わない。
- local CSV inventoryの全面再生成は行わない。
- H/I/J入力本文や完成文を前提資料内のruntime固定文として追加しない。
```

# 2026-06-07 差分追記: EmlisAI D相当入力 source-unavailable normal observation recovery latest snapshot diff

比較対象は、前提資料 `Cocolon_前提資料(186).zip` と最新実ファイル `Cocolon_11(9).zip` / `mashos-api_11(18).zip`。Cocolon側source file countは `217` のまま、mashos-api側source file countは `849`、合計 `1066` を最新coverage対象として読む。

## 基準zip / hash

| source | count | sha256 |
|---|---:|---|
| `Cocolon_前提資料(186).zip` | 46 | `daf9fa20896f52301ed7f97f2c57a985801336ba96cd451a44dfe3bd8fc9b9b5` |
| `Cocolon_11(9).zip` | 217 | `f29417b9cafe5ee4494428ebb92e4c3e3c926cc9fd75794360b91698b938d8e1` |
| `mashos-api_11(18).zip` | 849 | `317133d1949d1050e918d808bfd551b8ccaf485fa1e494a763eb3fed3a65c576` |
| total app source | 1066 | - |

`mashos-api(126).zip` を今回実装前の比較基準として見ると、D相当入力のbackend赤修正差分は次の通り。

| repo | added | changed | removed | 読み方 |
|---|---:|---:|---:|---|
| Cocolon | 0 | 0 | 0 | RN production UI変更なし。`Emlisの観測` の表示契約も変更なし。 |
| mashos-api | 3 | 8 | 0 | source-unavailable availability / recomposition permission / body-free meta / existing Gate chain adoption / focused regressionを追加・接続。 |

## 追加ファイル

| file | 構造上の意味 |
|---|---|
| `mashos-api/ai/tests/test_emlis_ai_d_source_unavailable_normal_observation_recovery.py` | D相当入力をD専用routeではなく、safe eligible source-unavailable normal observation recoveryとして固定するfocused regression。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_initial_surface_recomposition_body_free_p7.py` | recomposition candidate metaがraw input / comment_text body / candidate bodyを含まないことを固定するbody-free regression。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_initial_surface_recomposition_existing_gate_chain_p8.py` | recomposition candidateが既存Gate chain全通過後にだけ採用され、Gate失敗時はfail-closedになることを固定するregression。 |

## 変更された主な既存owner

| file | 差分の読み方 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_public_surface_requirement.py` | material relationship transition helperを追加し、safe + eligible + high_information_input + relation/action/change/value系materialを `labelled_two_stage` 要求へ寄せる。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_initial_surface_availability.py` | `limited_composer_shallow_empty_candidate` をsource unavailable familyに含め、material route / surface requirementをavailabilityへ渡して `complete_initial_surface_recomposition` laneへ送る。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_initial_surface_recomposition.py` | source unavailable後のsafe eligible normal observationについて、complete initial client未解決でもrecompositionを許可し、candidate metaをbody-freeに保つ。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_public_candidate_builder.py` | recovery plan / selected candidateのcontract flagsにbody-free / case-specific route否定を保持する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | recomposition candidateを既存Gate chainへ通し、candidate generatedとadopted/appliedを分ける。 |

## 検証結果

| 対象 | 結果 |
|---|---|
| `test_emlis_ai_phase20_10_real_device_recheck.py` | `4 passed` |
| `test_emlis_ai_d_source_unavailable_normal_observation_recovery.py` + `test_emlis_ai_complete_initial_surface_recomposition_existing_gate_chain_p8.py` | `5 passed` |
| `test_emlis_ai_public_observation_recovery_acceptance_p0.py` + `test_emlis_ai_hij_reception_required_regression_p8.py` + `test_emlis_ai_existing_regression_contract_p9.py` | `14 passed, 1 warning` |
| `npm run test:rn-screens` | `36 passed / 0 failed` |

warningは既存のPydantic V1 style `@root_validator` に関する非失敗warningであり、今回の差分では触らない。

## 境界維持

- RN production UI、RN表示タイトル、RN表示条件、public response shapeは変更しない。
- `/emotion/submit` route、request key、DB physical schema / write pathは変更しない。
- `D` exact fixture、Phase20-10、Phase19 tokenをruntime条件にしない。
- Gate Recovery material surfaceをpublic本文へ出さない。
- source unavailableをnormal observation rebuildで読めたふりにしない。
- candidate body / raw input / comment_text bodyをmetaへ入れない。
- Gateを緩めず、既存Gate chainを全通過したcandidateだけ採用する。

# 2026-06-08 差分追記: EmlisAI P0-P1 Public Input Feedback Arrival Contract Repair Step0-10 latest snapshot diff

比較対象は、前提資料 `Cocolon_前提資料(190).zip` と最新実ファイル `Cocolon_11(10).zip` / `mashos-api_11(19).zip`。Cocolon側source file countは `217` のまま、mashos-api側source file countは `853`、合計 `1070` を最新coverage対象として読む。

## 基準zip / hash

| source | count | sha256 |
|---|---:|---|
| `Cocolon_前提資料(190).zip` | 49 | `fbbaf4fb86ae1b9f90f386fc5520c0ec714749fed0b3502f52fa05013205dd09` |
| `Cocolon_11(10).zip` | 217 | `aecd0dea738875b768939f5646360a7bfd94671660cb0892d564d97cb53d632d` |
| `mashos-api_11(19).zip` | 853 | `02fc41d8eaf3405798daeae52c62423e72e3cc7683fe612efbc8dfe5c81b2e7c` |
| total app source | 1070 | - |

`Cocolon(216).zip` / `mashos-api(129).zip` を今回のP0-P1着手前実体として見ると、Public Input Feedback Arrival Contract Repair差分は次の通り。

| repo | added | changed | removed | 読み方 |
|---|---:|---:|---:|---|
| Cocolon | 0 | 0 | 0 | RN production UI変更なし。`Emlisの観測` の表示契約も変更なし。 |
| mashos-api | 4 | 8 | 0 | public feedback meta / submit inclusion summary / product_surface_validation / display contract / User Label sanitizerを、yellow/warn public arrival policyとbody-free meta境界へ揃える。 |

## 追加ファイル

| file | 構造上の意味 |
|---|---|
| `mashos-api/ai/docs/Cocolon_EmlisAI_P0_P1_PublicInputFeedbackArrivalContractRepair_RedLedger_Step0_20260608.md` | 作業前baselineとRed A/Bのledgerを固定する。 |
| `mashos-api/ai/docs/Cocolon_EmlisAI_P0_P1_PublicInputFeedbackArrivalContractRepair_Step5_RedA_E2EGreen_20260608.md` | Red Aがpublic `input_feedback` へ到達し、body-free public metaを維持したことを記録する。 |
| `mashos-api/ai/docs/Cocolon_EmlisAI_P0_P1_PublicInputFeedbackArrivalContractRepair_RedBClassification_Step6_20260608.md` | Red B1/B2をstale_contract_expectationとして分類し、true unavailable / safetyは別regressionで守る根拠を記録する。 |
| `mashos-api/ai/docs/Cocolon_EmlisAI_P0_P1_PublicInputFeedbackArrivalContractRepair_Step10_ExistingGreenRegression_20260608.md` | Step10の既存green回帰確認とUser Label Connection sanitizer assertion更新を記録する。 |

## 変更された主な既存owner

| file | 差分の読み方 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py` | `visible_surface_acceptance_gate` の `yellow / warn` をpublic arrival terminal blockerにせず、`repair_required / red / rerender_surface / reroute_low_information / block / fail_closed` はblockする。body-free markerを強化する。 |
| `mashos-api/ai/services/ai_inference/emotion_submit_service.py` | submit inclusion summaryを同じpolicyへ揃え、yellow/warnを `public_feedback_not_included_visible_surface_gate` やabsence reasonにしない。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_product_surface_validation.py` | `visible_surface_acceptance_gate` だけyellow/warn public arrival policyを適用し、runtime / display / state_answer / two_stageはstrictのまま維持する。 |
| `mashos-api/ai/tests/test_emlis_ai_public_feedback_meta.py` | Red A focused test、true unavailable / safety fail-closed regression、Step8 no body leak regressionを固定する。 |
| `mashos-api/ai/tests/test_emotion_submit_public_feedback_inclusion_summary_p7.py` | submit inclusion summary上でyellow/warnをabsence扱いにしないことを固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_product_surface_validation_p3.py` | yellow/warn時の `rn_visible` 維持とruntime strict維持を固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_display_contract.py` | Red A/Bのdisplay contractを現行契約へ更新し、safe recoveryは表示可、元body / raw / candidate bodyは出さない境界を固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_user_label_connection_e2e_contract.py` | `candidate_body_included=false` をbody-free markerとして許可し、raw candidate body key/bodyの漏れは禁止する契約へ更新する。 |

## 最新flowでの読み方

```text
/emotion/submit save path
  -> render_emlis_ai_reply()
  -> display_decision / public_meta build
  -> should_include_public_input_feedback(comment_text, public_meta)
  -> visible_surface_acceptance_gate:
       yellow + warn = public arrival warning-only
       repair_required / red / rerender_surface / reroute_low_information / block / fail_closed = terminal blocker
  -> public input_feedback included only when observation_status=passed and comment_text non-empty and terminal blockers absent
  -> product_surface_validation separates public_reached / rn_visible / product_surface_valid
  -> RN displays only passed + comment_text as `Emlisの観測`
```

## 維持されたcontract

```text
RN production UI変更なし
RN表示タイトル `Emlisの観測` 変更なし
RN表示条件 `input_feedback.emlis_ai.observation_status == passed && input_feedback.comment_text non-empty` 変更なし
/emotion/submit route変更なし
request key変更なし
public response top-level key変更なし
DB physical schema / write path変更なし
Gate緩和なし
fixed fallback / case専用route / case専用surface追加なし
true unavailable / infrastructure_error / safety_blocked のfail-closed維持
raw input / original body / candidate body / comment_text body のpublic meta混入なし
```

## ローカル確認

今回の前提資料更新作業中に、最新実ファイルzipから展開した実体で次を確認した。

```text
Cocolon source diff:
  0 added / 0 changed / 0 removed

P0-P1 backend focused suite:
  tests/test_emlis_ai_public_feedback_meta.py
  tests/test_emotion_submit_public_feedback_inclusion_summary_p7.py
  tests/test_emlis_ai_product_surface_validation_p3.py
  tests/test_emlis_ai_display_contract.py
  51 passed / 1 warning

User Label Connection sanitizer focused:
  1 passed / 1 warning
```

また、最新実ファイル内のStep10確認記録では次が保持されている。

```text
RN contract: 36 passed / 0 failed
API contract: 4 passed / 3 warnings
TwoStage emotion submit E2E: 6 passed / 1 warning
Public Recovery / D / limited grounding subset: 53 passed / 1 warning
User Label Connection / Product Read Feel subset: 108 passed / 1 warning
Focused suite: 51 passed / 1 warning
```

この差分で更新しないもの:

```text
- 01 / 02 full inventory本文の全面再生成は行わない。
- RN production UI、API route、DB write path、public response top-level keyは更新しない。
- public metaへ本文を移す設計にはしない。
```


# 2026-06-09 差分追記: EmlisAI P3 Product Read Feel Baseline P3-0〜P3-9 latest snapshot diff

比較対象は、前提資料 `Cocolon_前提資料(193).zip` と最新実ファイル `Cocolon(219).zip` / `mashos-api(132).zip` です。前提資料上の直前基準面は `Cocolon_11(10).zip` / `mashos-api_11(19).zip` だが、差分算出では手元の同系統前回実体 `Cocolon(217).zip` / `mashos-api(130).zip` を比較元として使用した。

## 基準zip / hash

| source | count | sha256 |
|---|---:|---|
| `Cocolon_前提資料(193).zip` | 49 | `8b67afa37a88b9910a7e43dfad998a0a0c8b5badf62090467ca5fc0c4bfc23c9` |
| `Cocolon(219).zip` | 217 | `a63de4ebdb67b34e7b4db0871a7302f4ae8ee75a8157c299571c4933fd58cfda` |
| `mashos-api(132).zip` | 878 | `b88d85fc27154fbb56c727e8a651b0e14b2f0a302a880eba83893a0e8acf9c24` |
| total app source | 1095 | - |

## source差分

| repo | added | changed | removed | 読み方 |
|---|---:|---:|---:|---|
| Cocolon | 0 | 0 | 0 | RN production UI変更なし。`Emlisの観測` の表示契約も変更なし。 |
| mashos-api | 25 | 3 | 0 | P3 Product Read Feel baseline P3-0〜P3-9のbody-free測定・分類・判断境界を追加する。runtime本文生成修正ではない。 |

差分詳細は `cocolon_local_file_inventory_diff_20260609_p3_product_readfeel_baseline.csv` に保持する。

## 追加ファイル

| file | 構造上の意味 |
|---|---|
| `ai/services/ai_inference/emlis_ai_product_readfeel_p3_blind_qa_ratings_review.py` | P3-5 Blind QA ratings-only review. |
| `ai/services/ai_inference/emlis_ai_product_readfeel_p3_first_repair_design.py` | P3-7 first repair design. |
| `ai/services/ai_inference/emlis_ai_product_readfeel_p3_p4_p5_connection_decision.py` | P3-9 P4/P5 connection decision. |
| `ai/services/ai_inference/emlis_ai_product_readfeel_p3_regression.py` | P3-8 regression boundary. |
| `ai/services/ai_inference/emlis_ai_product_readfeel_p3_repair_priority_ledger.py` | P3-6 repair priority ledger. |
| `ai/services/ai_inference/emlis_ai_product_readfeel_p3_verdict_split.py` | P3-4 P2/P3 verdict split. |
| `ai/tests/fixtures/emlis_ai_product_readfeel_baseline_cases_20260609.py` | P3-1 baseline case matrix: 12 required families × 5 synthetic local QA cases. |
| `ai/tests/fixtures/emlis_ai_product_readfeel_p3_blind_qa_ratings_review_20260609.py` | P3-5 Blind QA ratings-only review. |
| `ai/tests/fixtures/emlis_ai_product_readfeel_p3_first_repair_design_20260609.py` | P3-7 first repair design. |
| `ai/tests/fixtures/emlis_ai_product_readfeel_p3_inventory_connection_20260609.py` | P3-3 sanitized event / inventory connection fixture and test. |
| `ai/tests/fixtures/emlis_ai_product_readfeel_p3_local_output_capture_20260609.py` | P3-2 local output capture: separates local review packet from body-free sanitized event. |
| `ai/tests/fixtures/emlis_ai_product_readfeel_p3_p4_p5_connection_decision_20260609.py` | P3-9 P4/P5 connection decision. |
| `ai/tests/fixtures/emlis_ai_product_readfeel_p3_regression_20260609.py` | P3-8 regression boundary. |
| `ai/tests/fixtures/emlis_ai_product_readfeel_p3_repair_priority_ledger_20260609.py` | P3-6 repair priority ledger. |
| `ai/tests/fixtures/emlis_ai_product_readfeel_p3_verdict_split_20260609.py` | P3-4 P2/P3 verdict split. |
| `ai/tests/test_emlis_ai_product_readfeel_baseline_case_matrix_20260609.py` | P3 Product Read Feel baseline support file. |
| `ai/tests/test_emlis_ai_product_readfeel_p3_blind_qa_ratings_review_20260609.py` | P3-5 Blind QA ratings-only review. |
| `ai/tests/test_emlis_ai_product_readfeel_p3_contract_freeze_20260609.py` | P3 Product Read Feel baseline support file. |
| `ai/tests/test_emlis_ai_product_readfeel_p3_first_repair_design_20260609.py` | P3-7 first repair design. |
| `ai/tests/test_emlis_ai_product_readfeel_p3_inventory_connection_20260609.py` | P3-3 sanitized event / inventory connection fixture and test. |
| `ai/tests/test_emlis_ai_product_readfeel_p3_local_output_capture_20260609.py` | P3-2 local output capture: separates local review packet from body-free sanitized event. |
| `ai/tests/test_emlis_ai_product_readfeel_p3_p4_p5_connection_decision_20260609.py` | P3-9 P4/P5 connection decision. |
| `ai/tests/test_emlis_ai_product_readfeel_p3_regression_20260609.py` | P3-8 regression boundary. |
| `ai/tests/test_emlis_ai_product_readfeel_p3_repair_priority_ledger_20260609.py` | P3-6 repair priority ledger. |
| `ai/tests/test_emlis_ai_product_readfeel_p3_verdict_split_20260609.py` | P3-4 P2/P3 verdict split. |

## 変更された主な既存owner

| file | 差分の読み方 |
|---|---|
| `ai/services/ai_inference/emlis_ai_product_quality_contract_freeze.py` | P3-0 contract freeze strengthened with exact comment_text / case-specific runtime branch / fixture-string branching guards. |
| `ai/services/ai_inference/emlis_ai_product_quality_measurement_event.py` | P3-3 adapter from body-free sanitized current-output event to ProductQuality scorecard row. |
| `ai/services/ai_inference/emlis_ai_product_readfeel_current_output_inventory.py` | P3-3 reason markers added for readfeel_gap / structure_insight_gap classification. |

## P3-0〜P3-9の読み方

| Phase | 最新の読み方 | 主な実ファイル |
|---|---|---|
| P3-0 Contract Freeze | P3 baseline用fixtureがruntime分岐・固定返信文・exact `comment_text` 要求へ漏れないよう、不変境界を追加で固定する。 | `emlis_ai_product_quality_contract_freeze.py`, `test_emlis_ai_product_readfeel_p3_contract_freeze_20260609.py` |
| P3-1 Baseline Case Matrix | 既存12 required families × 5件 = 60件のsynthetic local QA入力を固定する。`limited_grounding` / `source_unavailable_high_information` / `history_line_eligible` はfamily追加ではなくcoverage_slicesで扱う。 | `tests/fixtures/emlis_ai_product_readfeel_baseline_cases_20260609.py`, `test_emlis_ai_product_readfeel_baseline_case_matrix_20260609.py` |
| P3-2 Local Output Capture | 本文ありのLocal Review Packetとbody-free Sanitized Current Output Eventを分離する。 | `tests/fixtures/emlis_ai_product_readfeel_p3_local_output_capture_20260609.py`, `test_emlis_ai_product_readfeel_p3_local_output_capture_20260609.py` |
| P3-3 Sanitized Event / Inventory接続 | body-free sanitized eventをCurrent Output Inventory / ProductQuality scorecard row / Product Read Feel scorecardへ接続する。 | `emlis_ai_product_quality_measurement_event.py`, `emlis_ai_product_readfeel_current_output_inventory.py`, `tests/fixtures/emlis_ai_product_readfeel_p3_inventory_connection_20260609.py` |
| P3-4 P2/P3 Verdict Split | P2 RED、P1 display repair、P3 repair required、P3 yellow、P3 pass、not evaluatedを分ける。 | `emlis_ai_product_readfeel_p3_verdict_split.py` |
| P3-5 Blind QA Ratings-only Review | 人間が本文を読むlocal QAと、scorecardへ渡すratings-only materialを分ける。`read_feeling` はmachine metricsやverdictから自動補完しない。 | `emlis_ai_product_readfeel_p3_blind_qa_ratings_review.py` |
| P3-6 Repair Priority Ledger | P2/P3 verdictとratings-only結果から、最初に直すblockerを最大2件へ絞る。 | `emlis_ai_product_readfeel_p3_repair_priority_ledger.py` |
| P3-7 First Repair Design | rich inputのlow_information過剰落ち、generic/repeated surfaceなどに対し、runtime修正前のbody-free設計を固定する。 | `emlis_ai_product_readfeel_p3_first_repair_design.py` |
| P3-8 Regression | P3 runtime修正へ進む前のrequired / optional / manual回帰境界を固定する。 | `emlis_ai_product_readfeel_p3_regression.py` |
| P3-9 P4/P5接続判断 | P4 family別商品チューニングへ進めるか、P5 User Label Connection可視強化へ進めるかをbody-freeで判断する。defaultの読みはP4 next / P5 hold。 | `emlis_ai_product_readfeel_p3_p4_p5_connection_decision.py` |

## 最新flowでの読み方

```text
P3-1 baseline case matrix
  -> P3-2 local output capture
       local review packet: synthetic input + comment_text body, local QA only
       sanitized current output event: body-free ids / booleans / counts / reason codes
  -> P3-3 inventory / ProductQuality scorecard row / Product Read Feel scorecard connection
  -> P3-4 P2/P3 verdict split
  -> P3-5 Blind QA ratings-only review connection
  -> P3-6 repair priority ledger
  -> P3-7 first repair design
  -> P3-8 regression boundary
  -> P3-9 P4/P5 connection decision
```

## 維持されたcontract

```text
RN production UI変更なし
RN表示タイトル `Emlisの観測` 変更なし
RN表示条件 `input_feedback.emlis_ai.observation_status == passed && input_feedback.comment_text non-empty` 変更なし
/emotion/submit route変更なし
request key / public response top-level key変更なし
DB physical schema / write path変更なし
Gate緩和なし
fixed commentText / fixed sentence template追加なし
case専用runtime分岐 / fixture文字列runtime条件追加なし
comment_text生成ロジック変更なし
P4は2026-06-09時点では未実装。2026-06-10差分ではP4-0〜P4-10実装反映済みとして末尾追補を優先する。
P5 User Label Connection可視文強化は、2026-06-11差分ではP5-0〜P5-7のbackend内部限定接続として実装済み。P6 Structure Insight v2は、2026-06-12差分ではP6-0〜P6-9のbackend内部boundary / QA / P7 hold decisionとして反映済み。
raw input / memo / memo_action / candidate body / comment_text body のpublic meta・scorecard混入なし
```

## ローカル確認

今回の前提資料更新作業中に、最新実ファイルzipから展開した実体で次を確認した。

```text
Cocolon source diff:
  0 added / 0 changed / 0 removed

mashos-api source diff from previous local baseline:
  25 added / 3 changed / 0 removed

P3 added/changed python py_compile:
  passed

P3-0 / P3-1 / P3-2 focused:
  16 passed

P3-3 focused:
  4 passed

P3-4 focused:
  6 passed
```

`P3-0〜P3-9` grouped pytestは今回のローカル前提資料更新中にもtimeoutした。これは前段からYELLOWとして扱っていたgrouped実行timeoutであり、上記focused greenとは分けて読む。前提資料更新では、実装を緩めてtimeoutを消すことはしない。

この差分で更新しないもの:

```text
- RN production UI、API route、DB write path、public response top-level keyは更新しない。
- comment_text生成ロジックは更新しない。
- Gate緩和や固定返信テンプレ追加はしない。
- P4 family別商品チューニングは2026-06-10差分でP4-0〜P4-10として反映済み。旧P3時点の未実装記述は履歴として読む。
- P5 User Label Connection可視文強化はしない。
- 01 / 02 full inventory本文の全面再生成は行わない。
```


# 2026-06-10 差分追記: EmlisAI P4 Family Product Tuning P4-0〜P4-10 latest snapshot diff

最新実ファイル `Cocolon_11(11).zip` / `mashos-api_11(20).zip` を確認した。Cocolon RN側は217 filesで、production RN UI、RN表示タイトル、RN表示条件、public response shapeの変更は前提資料上の差分対象にしない。backend側は903 filesで、P3 Product Read Feel baselineの後続としてP4 Family Product Tuning P4-0〜P4-10が追加・接続されている。

## source snapshot

| source | count | sha256 |
|---|---:|---|
| `Cocolon_前提資料(195).zip` | 51 | `b5a81ae07d5710368380886192dee32d3656d26c0a9aaaa0980c7ee95d6658e0` |
| `Cocolon_11(11).zip` | 217 | `f4f889cc55cc4ffec0d6b65bd23ba910e9396176dd903ce8cc511aedca100b3a` |
| `mashos-api_11(20).zip` | 903 | `3932e70fbbd91b57a3bb06e784a932983d307778606a0add585330256c857e4a` |
| total app source | 1120 | latest actual source count |

## P4で追加された主なbackend owner

| path | 構造上の意味 |
|---|---|
| `ai/services/ai_inference/emlis_ai_product_readfeel_p4_target_case_selection.py` | P4-1 target case selection。P3-9 decisionとbaseline case matrixから、P4対象caseをbody-freeに選ぶ。 |
| `ai/services/ai_inference/emlis_ai_product_readfeel_p4_material_audit.py` | P4-2 material audit。visible material slot / material quality / surface requirement / blocker flagsを監査する。 |
| `ai/services/ai_inference/emlis_ai_product_readfeel_p4_family_tuning_policy.py` | P4-4 family tuning policy。ratio / temperature / section role / required anchor / forbidden surface classを固定する。 |
| `ai/services/ai_inference/emlis_ai_product_readfeel_p4_surface_signature_audit.py` | P4-5 surface signature audit。generic / repeated / question-only collapseをbody-free signatureとして検知する。 |
| `ai/services/ai_inference/emlis_ai_product_readfeel_p4_self_denial_yellow_review.py` | P4-8 self_denial yellow review。自己否定を事実承認せず、安全隣接境界とsurface品質を監査する。 |
| `ai/services/ai_inference/emlis_ai_product_readfeel_p4_ratings_review.py` | P4-9 ratings-only review。P4後の読感をbody-free rating materialで再判定し、P3-9へ戻す。 |
| `ai/services/ai_inference/emlis_ai_product_readfeel_p4_regression_handoff.py` | P4-10 regression / P5 hold re-check / handoff。required regression statusとP4-9結果からP5 holdを判断する。 |

## P4で接続・更新された主な既存owner

| path | 差分の読み方 |
|---|---|
| `ai/services/ai_inference/emlis_ai_public_surface_requirement.py` | P4-3。rich visible material、true low_information、limited_grounding、source_unavailable high-informationのsurface requirement境界を補正する。 |
| `ai/services/ai_inference/emlis_ai_shared_reception_evidence.py` | P4-6 / P4-7 / P4-8。daily_unpleasant、structure_question、self_denialのvisible evidenceを拾う。 |
| `ai/services/ai_inference/emlis_ai_reception_mode_resolver.py` | P4 familyごとのreception modeを低情報質問routeへ潰さない。 |
| `ai/services/ai_inference/emlis_ai_state_answer_ratio_policy.py` | daily_unpleasant、structure_question、self_denialのobservation / reception比率をP4 policyへ寄せる。 |
| `ai/services/ai_inference/emlis_ai_two_stage_section_surface_plan.py` | structure_questionのsection role / orderをP4 policyへ寄せる。 |
| `ai/services/ai_inference/emlis_ai_complete_surface_realizer.py` | daily_unpleasant / structure_questionのsurface anchorを既存realizerで扱う。 |
| `ai/services/ai_inference/emlis_ai_state_answer_special_cases.py` | self_denialでidentity claim as fact、過剰肯定テンプレ、absolute supportを避ける。 |
| `ai/services/ai_inference/emlis_ai_safety_triage.py` | self_denial yellowとsafety support / emergencyを分離する。 |
| `ai/services/ai_inference/config/emlis_reception_assistance_dictionary.v1.json` | daily_unpleasant / self_denial等のreception assistance materialを補う。 |

## P4-0〜P4-10の読み方

| Phase | 最新の読み方 |
|---|---|
| P4-0 | P3-9のP4 next / P5 holdを凍結し、P5 visible strengtheningへ先に進まない。 |
| P4-1 | P4 target caseをbody-freeに選び、case id / family / coverage slice / blocker / target layerだけを保持する。 |
| P4-2 | local synthetic case materialを一時的に読み、visible slot / material quality / surface requirement / blocker flagsだけを残す。 |
| P4-3 | low_information / limited_grounding / rich input / source_unavailable high-informationのpublic surface requirement境界を補正する。 |
| P4-4 | daily_unpleasant / structure_question / self_denialなどのfamily policyをratio・temperature・section roleで固定する。 |
| P4-5 | generic reception surface、repeated closing、question-only collapse、required anchor missingをbody-freeで検知する。 |
| P4-6 | daily_unpleasantでevent / reaction / reception anchorを拾い、不快を消さず、相手断定や重分析へ寄せない。 |
| P4-7 | structure_questionで構造の問いをcurrent input内の関係・詰まりとして読み、P6過剰Insightへ飛ばさない。 |
| P4-8 | self_denialをyellow safety-adjacentとして扱い、自己否定の事実承認と安全boundary bypassを防ぐ。 |
| P4-9 | P4 target subsetをratings-onlyで再判定し、full current-only clean evidenceがない限りP5 holdを維持する。 |
| P4-10 | P4-9結果とrequired regression statusをまとめ、missing / timeout / not greenがあればP5 holdを維持する。 |

## 最新flowでの読み方

```text
P3-9 P4/P5 connection decision
  -> P4-0 connection freeze
  -> P4-1 target case selection
  -> P4-2 material audit
  -> P4-3 surface requirement boundary
  -> P4-4 family tuning policy
  -> P4-5 surface signature audit
  -> P4-6 daily_unpleasant runtime owner tuning
  -> P4-7 structure_question runtime owner tuning
  -> P4-8 self_denial yellow review
  -> P4-9 ratings-only review / P3-9 re-judgement
  -> P4-10 regression / P5 hold re-check / handoff
```

## 維持されたcontract

```text
RN production UI変更なし
RN表示タイトル `Emlisの観測` 変更なし
RN表示条件 `input_feedback.emlis_ai.observation_status == passed && input_feedback.comment_text non-empty` 変更なし
/emotion/submit route変更なし
request key / public response top-level key変更なし
DB physical schema / write path変更なし
Gate緩和なし
fixed commentText / fixed sentence template追加なし
case専用runtime分岐 / fixture文字列runtime条件追加なし
P5 User Label Connection可視文強化はbackend内部のlimited visible connection / regression handoffとして実装済み
raw input / memo / memo_action / candidate body / comment_text body / history raw text のpublic meta・scorecard・handoff summary混入なし
```

## ローカル確認

今回の前提資料更新作業中に、最新実ファイルzipから展開した実体で次を確認した。

```text
Cocolon source count:
  217 files

mashos-api source count:
  903 files

P4 key module py_compile:
  passed

P4 dedicated tests present:
  test_emlis_ai_product_readfeel_p4_connection_freeze_20260610.py
  test_emlis_ai_product_readfeel_p4_target_case_selection_20260610.py
  test_emlis_ai_product_readfeel_p4_material_audit_20260610.py
  test_emlis_ai_product_readfeel_p4_surface_requirement_boundary_20260610.py
  test_emlis_ai_product_readfeel_p4_family_tuning_policy_20260610.py
  test_emlis_ai_product_readfeel_p4_surface_signature_audit_20260610.py
  test_emlis_ai_product_readfeel_p4_daily_unpleasant_family_tuning_20260610.py
  test_emlis_ai_product_readfeel_p4_structure_question_family_tuning_20260610.py
  test_emlis_ai_product_readfeel_p4_self_denial_yellow_review_20260610.py
  test_emlis_ai_product_readfeel_p4_ratings_review_20260610.py
  test_emlis_ai_product_readfeel_p4_regression_handoff_20260610.py
```

この前提資料更新環境では `pytest` module がないため、P4 pytest suiteの再実行はしていない。実装zip側に専用test実体が存在することと、P4主要moduleの構文compileを確認した。pytest結果は各P4実装handoff時の記録を優先する。

この差分で更新しないもの:

```text
- RN production UI、API route、DB write path、public response top-level keyは更新しない。
- Gate緩和や固定返信テンプレ追加はしない。
- P5 User Label Connection以外のP6 Structure Insight v2実装はしない。
- 01 / 02 full inventory本文の全面再生成は行わない。
```


# 2026-06-11 差分追記: EmlisAI P5 User Label Connection P5-0〜P5-7 latest snapshot diff

最新実ファイル `Cocolon_8(17).zip` / `mashos-api_8(48).zip` を確認した。Cocolon RN側は217 filesで、production RN UI、RN表示タイトル、RN表示条件、public response shapeの変更は前提資料上の差分対象にしない。backend側は919 filesで、P4-10 handoffの後続としてP5 User Label Connection P5-0〜P5-7が追加・接続されている。

| source | count | sha256 |
|---|---:|---|
| `Cocolon_前提資料(197).zip` | 50 | `1289a6d3d25f5f258faa7bedcdbdb00d3e6572a2307393e13f301bf85e40369b` |
| `Cocolon_8(17).zip` | 217 | `961a20f6b524bb30ab37e7a9781814785444c3fcdbde41ee3030f6e0cc861254` |
| `mashos-api_8(48).zip` | 919 | `0a18251963d1a40a399f52f311da293d7243af0d884d20bb0cbe5800b1a21d0f` |
| total app source | 1136 | latest actual source count |

## P5で追加された主なbackend owner

| path | 構造上の意味 |
|---|---|
| `ai/services/ai_inference/emlis_ai_user_label_connection_p5_readiness.py` | P5-0。P4-10 handoffからP5 entry / holdをbody-freeに再確認する。 |
| `ai/services/ai_inference/emlis_ai_user_label_connection_p5_visibility_boundary.py` | P5-1。Plus/Premium owned history、existing comment_text、existing gates、Free/current-only境界を判定する。 |
| `ai/services/ai_inference/emlis_ai_user_label_connection_p5_eligibility_matrix.py` | P5-2。connectable family / edge familyごとのconnectable、meta_only、review_required、blockedを固定する。 |
| `ai/services/ai_inference/emlis_ai_user_label_connection_p5_surface_role_plan.py` | P5-3。current observation first、history support line、forbidden roleをbody-free role planにする。 |
| `ai/services/ai_inference/emlis_ai_user_label_connection_p5_safety_guard.py` | P5-4。creepy / overclaim / self-blame / always / cause / diagnosis / advice claimをblockする。 |
| `ai/services/ai_inference/emlis_ai_user_label_connection_p5_product_quality_review.py` | P5-5。ratings-only Product Quality QAでlimited visible候補を評価する。 |
| `ai/services/ai_inference/emlis_ai_user_label_connection_p5_limited_visible_connection.py` | P5-6。条件を満たした時だけ既存 `comment_text` へ短いhistory-line support sectionを接続する。 |
| `ai/services/ai_inference/emlis_ai_user_label_connection_p5_regression_handoff.py` | P5-7。P5 regression handoffとP6 hold decisionをbody-freeで作る。 |

## P5-0〜P5-7の読み方

| Phase | 最新の読み方 |
|---|---|
| P5-0 | P4 handoff / current-only readfeelを再確認し、P5 entry allowed / holdをbody-freeで分ける。 |
| P5-1 | existing comment_text non-empty、observation passed、existing gates、Plus/Premium owned history、evidence 2件以上を確認する。 |
| P5-2 | family / edge familyごとの履歴線eligibilityを固定し、suppressed familyをvisibleへ漏らさない。 |
| P5-3 | 履歴線は主役ではなく補助線。current observation first、history support line、not personality boundaryをrole化する。 |
| P5-4 | creepy / overclaim / self-blame / always / cause / diagnosis / advice / future predictionを初期P5 visibleから落とす。 |
| P5-5 | Product Qualityをratings-onlyで評価し、raw input、comment_text body、reviewer free textを保持しない。 |
| P5-6 | P5-0〜P5-5と既存Gateが通った時だけ、既存 `comment_text` へ限定接続する。public response shapeは変えない。 |
| P5-7 | required regression statusとP5状態から、`p6_ready` / `p6_hold` / `p5_continue` / `p4_return` を分類する。 |

## 最新flowでの読み方

```text
P3-9 P4/P5 connection decision
  -> P4-0〜P4-10 current-only Product Read Feel tuning / handoff
  -> P5-0〜P5-5 readiness / eligibility / guard / ratings-only QA
  -> P5-6 limited visible connection
  -> P5-7 regression / P6 hold decision
```

## 維持されたcontract

```text
RN production UI変更なし
RN表示タイトル `Emlisの観測` 変更なし
RN表示条件 `input_feedback.emlis_ai.observation_status == passed && input_feedback.comment_text non-empty` 変更なし
/emotion/submit route変更なし
request key / public response top-level key変更なし
DB physical schema / write path変更なし
Gate緩和なし
fixed commentText / fixed sentence template追加なし
case専用runtime分岐 / fixture文字列runtime条件追加なし
Product Quality QA passをrelease_allowedへ変換しない
raw input / memo / memo_action / candidate body / comment_text body / history raw text のpublic meta・scorecard・handoff summary混入なし
```

## ローカル確認

今回の前提資料更新作業中に、最新実ファイルzipから展開した実体で次を確認した。

```text
Cocolon source count:
  217 files

mashos-api source count:
  919 files

P5 key module py_compile:
  passed

P5 direct test function execution with pytest.raises stub:
  67 passed

P5 dedicated tests present:
  test_emlis_ai_user_label_connection_p5_readiness_freeze_20260611.py
  test_emlis_ai_user_label_connection_p5_visibility_boundary_20260611.py
  test_emlis_ai_user_label_connection_p5_eligibility_matrix_20260611.py
  test_emlis_ai_user_label_connection_p5_surface_role_plan_20260611.py
  test_emlis_ai_user_label_connection_p5_safety_guard_20260611.py
  test_emlis_ai_user_label_connection_p5_product_quality_review_20260611.py
  test_emlis_ai_user_label_connection_p5_limited_visible_connection_20260611.py
  test_emlis_ai_user_label_connection_p5_regression_handoff_20260611.py
```

この前提資料更新環境では `pytest` module がないため、pytest runner自体の再実行はしていない。代替として、P5-0〜P5-7のtest関数を `pytest.raises` stub付きで直接実行し、67件通過を確認した。

この差分で更新しないもの:

```text
- RN production UI、API route、DB write path、public response top-level keyは更新しない。
- Gate緩和や固定返信テンプレ追加はしない。
- P6 Structure Insight v2実装はしない。
- 01 / 02 full inventory本文の全面再生成は行わない。
```


# 2026-06-12 差分追記: EmlisAI P5/P6 runtime repair R0〜R10 latest snapshot diff

この差分は、P5/P6を「module/testがあるから完了」と読まないための現在地更新案です。  
比較元は `mashos-api(138).zip`、比較先は `mashos-api_10(32).zip` です。Cocolon RN側は変更対象にしていません。

## 追加ファイル

| file | R step | 構造上の意味 |
|---|---:|---|
| `mashos-api/ai/docs/Cocolon_EmlisAI_P5_P6_RedLedger_RuntimeRepair_R0_20260612.md` | R0 | P5/P6 red ledger固定。P5/P6 test greenをruntime完了にしない境界を固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_user_label_connection_p5_runtime_bridge_20260612.py` | R1/R2 | P5 runtime bridge赤テスト・本線接続確認。 |
| `mashos-api/ai/tests/test_emlis_ai_user_label_connection_p5_visible_connection_r3_boundary_20260612.py` | R3 | P5 visible connectionが旧Phase8直呼びではなくP5-6境界経由であることを固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_user_label_connection_p5_public_meta_human_qa_boundary_r4_20260612.py` | R4 | P5 public/meta boundaryとhuman QA未完分離を固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_user_label_connection_p5_body_free_public_meta_boundary_r4_20260612.py` | R4 | P5 body-free public/meta境界を固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_runtime_bridge_20260612.py` | R5/R6 | P6 runtime bridge赤テスト・P5 handoff後評価層接続確認。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_p6_limited_surface_connection.py` | R7/R8 | P6 limited surfaceをstructure_questionのみに限定し、no-connect familyをblockする境界module。 |
| `mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_limited_surface_r7_20260612.py` | R7 | P6 limited surfaceがstructure_question限定・1 seed・再Gate必須であることを固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_no_connect_regression_r8_20260612.py` | R8 | low-info / daily / positive / safety / target judgement等のno-connect family regressionを固定する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p5_p6_split_test_matrix.py` | R9 | P5/P6 split test matrixとhandoff lockをbody-freeに固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_p5_p6_split_test_matrix_handoff_r9_20260612.py` | R9 | split matrix / handoff lock / full suite shortcut禁止を固定する。 |

## 変更ファイル

| file | R step | 変更内容 |
|---|---:|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | R2/R3/R6/R7/R8/R9 | P5 chainをreply_service本線へ接続し、P6をP5 handoff後のruntime評価層へ接続。P6 limited surfaceはstructure_question限定。R9 handoff lockを内部metaへ追加。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py` | R4/R6/R7/R8 | P5/P6 runtime bridge summaryを既存meta経路へbody-freeでsanitize。public top-level keyは増やさない。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_p5_limited_visible_connection.py` | R3/R4 | 旧Phase8 connectorをP5-6内部adapter化し、visible connection route / post-connection regate / human QA boundaryを追加。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_p5_product_quality_review.py` | R4 | P5 Product Quality Reviewをratings-only / human QA未完分離として固定。 |
| `mashos-api/ai/tests/test_emlis_ai_user_label_connection_p5_limited_visible_connection_20260611.py` | R3/R4 | P5-6 boundary / human QA separationに合わせた回帰確認を追加。 |

削除ファイルはありません。

## 検証結果

```text
python -m py_compile target R0〜R9 files
=> passed

PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_user_label_connection_p5_runtime_bridge_20260612.py \
  tests/test_emlis_ai_user_label_connection_p5_visible_connection_r3_boundary_20260612.py \
  tests/test_emlis_ai_user_label_connection_p5_public_meta_human_qa_boundary_r4_20260612.py \
  tests/test_emlis_ai_user_label_connection_p5_body_free_public_meta_boundary_r4_20260612.py \
  tests/test_emlis_ai_structure_insight_p6_runtime_bridge_20260612.py \
  tests/test_emlis_ai_structure_insight_p6_limited_surface_r7_20260612.py \
  tests/test_emlis_ai_structure_insight_p6_no_connect_regression_r8_20260612.py \
  tests/test_emlis_ai_p5_p6_split_test_matrix_handoff_r9_20260612.py
=> 46 passed
```

この確認はR0〜R9 targeted / split matrixの確認であり、full backend suite greenではありません。

## 最新の読み方

```text
P5:
  runtime bridgeはreply_service本線に接続済み。
  旧Phase8 visible connector直呼びではなく、P5-6境界経由として読む。
  ただし、P5-HOLD-001 human QA未完は残る。
  product_quality_confirmed / release_allowedはtrue化しない。

P6:
  runtime bridgeはP5 handoff後の評価層に接続済み。
  limited surfaceはstructure_questionだけに限定する。
  no-connect familyではvisible_applied=falseを維持する。
  P6 Product QAはratings/material層であり、P7 readyではない。

R9:
  split test matrix / handoff lockを固定済み。
  full backend suite一括green shortcutは禁止。

P7:
  このP5/P6 runtime repair section時点では未着手・対象外だった。
  最新正本では、後続のP7差分追記を優先し、P7-0〜P7-9はbackend internal-only測定構造として実装済みと読む。
```

## 禁止する誤読

```text
P5 module/test存在 = P5 runtime完了
P5 runtime_evaluated = P5商品品質確認済み
P5 visible_applied = human QA完了
P6 module/test存在 = Structure Insightが実応答に出ている
P6 visible_applied = P7 ready
R0〜R9 targeted green = full backend suite green
P5/P6 handoff = release_allowed
```

## 次工程へ渡すもの

```text
P5/P6 body-free handoff
split test matrix
no-connect family regression結果
P5-HOLD-001 human QA未完
P6-HOLD-001 long/self-understanding初期visible横展開禁止
P7-0〜P7-9は別設計として実装済み。直後のP7差分追記を優先する。
```


# 2026-06-12 差分追記: EmlisAI P7 Product Quality Runner / Long-run Product Gate P7-0〜P7-9 latest snapshot diff

この差分は、P5/P6 runtime repair後の材料を「release ready」と読まないためのP7実装反映です。比較対象は、前提資料上でP7実装が未反映だった状態と、最新実ファイル `mashos-api_6(56).zip` です。Cocolon RN側は今回の受領差分対象ではなく、P7はbackend internal-only測定構造として読む。

## 追加ファイル

| file | P7 step | 構造上の意味 |
|---|---:|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_contracts.py` | P7-0/P7-1 | P7共通schema id、RED/HOLD/OUT id、body-free / public contract markerを固定する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_handoff_normalizer.py` | P7-0 | P5/P6 handoffをsafe id / bool / count / reason codeだけへ正規化し、P7 ready / release readyへ変換しない。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_red_ledger.py` | P7-1 | P7-RED-001〜003、P7-HOLD-001〜004、P7-OUT-001〜008をbody-free ledgerとして保持する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_module_inventory.py` | P7-2 | 既存Product Quality系moduleをreuse_direct / reuse_with_adapter / heavy_e2e_isolated / release_decision_isolatedへ分類する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_runner_plan.py` | P7-3 | P7 core、existing reuse、heavy isolated red、timeout budgetを分け、heavy E2Eを本線green条件から隔離する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_event_bridge.py` | P7-4 | `ProductQualityEventV1` とP7 handoff / red ledgerをbody-free scorecard rowへbridgeする。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_evaluation_matrix.py` | P7-5 | family / sequence / history-line matrixを作り、PRODUCT_PASS候補をrelease readyへ変換しない。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_blind_qa_material.py` | P7-6 | ratings-only Blind QA materialを作る。未レビューdimensionをreview_missing / rating_requiredに残す。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_long_run_gate_handoff.py` | P7-7 | Long-run Product Gate candidate materialを作る。red / holdがある場合はblocked / review_requiredへ残す。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py` | P7-8 | Release Decisionへ渡す材料を分離する。`release_decision_input_ready` と `release_allowed` を混同しない。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py` | P7-9 | greenと呼べる範囲、RED/HOLD/isolated/unverifiedとして残す範囲をmatrix化する。 |
| `mashos-api/ai/docs/Cocolon_EmlisAI_P7_ProductQualityRunner_ImplementationResult_20260612.md` | P7-9 | P7-8/P7-9実装結果、確認結果、維持したRED/HOLD、変更していないcontractを記録する。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_handoff_normalizer_20260612.py` | P7-0 | handoff normalizerのbody-free / release-closed境界を固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_red_ledger_20260612.py` | P7-1 | red ledger / blocker registryの初期RED/HOLD/OUTを固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_module_inventory_20260612.py` | P7-2 | module inventory / adapter分類を固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_runner_plan_20260612.py` | P7-3 | runner plan / timeout budget / heavy isolationを固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_event_bridge_20260612.py` | P7-4 | Product Quality Event bridge / body-free scorecard row接続を固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_evaluation_matrix_20260612.py` | P7-5 | family / sequence / history-line evaluation matrixを固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_blind_qa_material_20260612.py` | P7-6 | ratings-only Blind QA material exportを固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_long_run_gate_handoff_20260612.py` | P7-7 | Long-run Product Gate candidate materialを固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_release_handoff_20260612.py` | P7-8 | Release Decision handoff material分離を固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_validation_matrix_20260612.py` | P7-9 | Validation / regression matrixを固定する。 |

## 差分count

| source | added | changed | removed | 読み |
|---|---:|---:|---:|---|
| Cocolon | 0 | 0 | 0 | 今回のP7差分対象外。RN production UI / 表示条件 / public response shapeは変えない。 |
| mashos-api | 22 | 0 | 0 | P7-0〜P7-9のbackend internal-only測定構造を追加。 |

## P7の読み方

```text
P5/P6 R9 body-free handoff lock
  -> P7-0 handoff intake / normalizer
  -> P7-1 red ledger / blocker registry
  -> P7-2 module inventory / adapter classification
  -> P7-3 runner plan / command matrix / timeout budget
  -> P7-4 ProductQualityEvent bridge / scorecard row
  -> P7-5 family / sequence / history-line evaluation matrix
  -> P7-6 ratings-only Blind QA material
  -> P7-7 Long-run Product Gate candidate material
  -> P7-8 Release Decision handoff material
  -> P7-9 validation / regression matrix
```

P7は、Emlis本文を増やす工程でも、Product Pass候補をRelease Readyへ上げる工程でもない。P7の成果物は、body-free measurement rows、red / hold / blocker refs、ratings-required candidates、long-run candidate material、release decision handoff materialであり、`release_allowed` はfalseのまま読む。

## ローカル確認

```text
P7-0〜P7-9 core:
  50 passed

existing Product Quality reuse subset:
  31 passed, 1 warning
```

warningは既存 `pytest.mark.asyncio` unknown mark由来として読む。Positive Recovery E2EとProduct Quality Connection E2Eは、P7本線green条件ではなく、P7-RED-001 / P7-RED-002 / P7-RED-003として保持・隔離する。

## 維持されたcontract

```text
RN production UI変更なし
RN表示タイトル `Emlisの観測` 変更なし
RN表示条件 `input_feedback.emlis_ai.observation_status == passed && input_feedback.comment_text non-empty` 変更なし
/emotion/submit route変更なし
request key / public response top-level key変更なし
DB physical schema / write path変更なし
fixed commentText / fixed surface追加なし
Emlis本文生成追加なし
P5/P6 HOLDのgreen化なし
heavy E2E timeout / hangのgreen化なし
full backend suite green未確認の断定なし
release_allowed true化なし
Product Pass / Long-run candidate -> Release Ready変換なし
raw input / comment_text body / candidate body / surface body / reviewer free text のscorecard・handoff・public meta混入なし
```


# 2026-06-13 差分追記: EmlisAI P7 RED・HOLD Closure R0〜R12 latest snapshot diff

比較元は、P7-0〜P7-9実装後に受領していた `mashos-api(141).zip` です。比較先は、今回の最新実ファイル `mashos-api_8(51).zip` です。Cocolon側の最新実ファイルは今回受領していないため、RN基準面は既存の `Cocolon_10(16).zip` を継続参照します。

## 追加ファイル

| file | 補正内容 |
|---|---|
| `mashos-api/ai/docs/Cocolon_EmlisAI_P7_RedHoldClosure_ImplementationResult_20260613.md` | R12実装結果md。R0〜R11の確認済み、未確認、red/timeout/HOLD、推測禁止、次工程を記録する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py` | R10。実機submit / modal読感未確認、full backend suite未実行を自動greenへ吸収しないHOLD matrix。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_red_closure_classification.py` | R7。P7-RED-001〜003をCLOSED / CLASSIFIED / TIMEOUT_ISOLATEDとしてbody-freeに分類するmatrix。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_timeout_isolation.py` | R6。Product Quality Connection E2E timeout / hangをP7 core greenへ混ぜないisolation material。 |
| `mashos-api/ai/tests/test_emlis_ai_positive_recovery_strict_relation_trace_20260613.py` | R1 strict relation trace regression。 |
| `mashos-api/ai/tests/test_emlis_ai_positive_recovery_r2_r3_contract_boundary_20260613.py` | R2/R3 relation type / signal key / marker key分離とGate Recovery合成ReaderReport境界test。 |
| `mashos-api/ai/tests/test_emlis_ai_positive_recovery_r4_r5_fail_closed_boundary_20260613.py` | R4/R5 Positive Recovery fail-closed境界test。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_connection_e2e_timeout_isolation_20260613.py` | R6 timeout isolation regression。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_red_closure_classification_matrix_20260613.py` | R7 red closure classification regression。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r8_human_qa_material_boundary_20260613.py` | R8 P5 human QA material boundary regression。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r9_p6_visible_expansion_boundary_20260613.py` | R9 P6 visible expansion boundary validation regression。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r10_real_device_full_backend_hold_matrix_20260613.py` | R10 real-device / full backend HOLD matrix regression。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r11_release_validation_final_alignment_20260613.py` | R11 release handoff / validation final alignment regression。 |

## 変更ファイル

| file | 補正内容 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_relation_surface_contract.py` | Positive Recoveryで、広いrelation type `recovery` と具体signal key `recovery_load_bridge` 系を分離する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_loop.py` | `used_relation_ids=["recovery"]` をReader signal keyへ昇格せず、合成surfaceからstrict relationを再検出する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | repair後もstrict relation surfaceがmissingなら、Positive Recoveryをpassedへ進ませない。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_display_gate.py` | strict relation missing時のdisplay fail-closed / comment_text_allowed=false境界を保持する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_reply_diagnostics_service.py` | strict relation trace / source priority / broad type only / fail-closed metaをbody-freeに保持する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_runner_plan.py` | P7-RED-003 timeout isolationとgreen claim splitをrunner planへ反映する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py` | unresolved RED/HOLD、timeout、human QA、実機/full suite未確認をrelease blocker materialへ反映し、release_allowed=falseを維持する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py` | R6〜R11のvalidation row / final summaryを追加し、P7 complete / P8 start / release_allowedをfalseで整合する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_blind_qa_material.py` | P5 human QA material boundaryを追加し、reviewer free textや本文をrelease materialへ流さない。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_event_bridge.py` | P7 RED/HOLD、human QA、P6 visible boundaryをbody-free scorecard rowへ保持する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_long_run_gate_handoff.py` | long-run candidateをrelease readyへ変換せず、P5 human QA requiredを保持する。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_product_quality_positive_recovery_e2e.py` | Positive Recovery RED-001 / RED-002 closureとfail-closed回帰防止を更新する。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_release_handoff_20260612.py` | R6〜R11のrelease handoff未解消RED/HOLD保持を確認する。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_validation_matrix_20260612.py` | R6〜R11のvalidation matrix最終整合を確認する。 |

## 確認済みvalidation

最新実ファイル `mashos-api_8(51).zip` 展開後に、次を確認した。

```text
R0〜R11主要確認suite: 34 passed
P7 core + R6〜R11: 70 passed
既存Product Quality reuse subset: 31 passed
Product Quality Connection E2E: timeout / EXIT_STATUS:124（R0〜R12時点。R13後は timeout 30s wrapper で 1 passed / EXIT_STATUS:0）
```

## 最新状態の読み方

```text
P7-RED-001: CLOSED
P7-RED-002: CLOSED
P7-RED-003: CLASSIFIED / TIMEOUT_ISOLATED / 未解消（R0〜R12時点。R13後はCLOSED / body_free_guard_repaired / PASSED_ISOLATEDへ更新済み。最新状態は下記R13差分追記を参照）
P7-HOLD-001: 未解消
P7-HOLD-002: 未解消
P7-HOLD-003: 未解消
P7-HOLD-004: 未解消
P7 complete: false
P8 start allowed: false
release_allowed: false
```

## 前提資料としての変更

| file | 変更理由 |
|---|---|
| `00_karen_read_first.md` | 最新基準面を `mashos-api_8(51).zip` へ更新し、P7 RED・HOLD closure R0〜R12の読み方を追記。 |
| `01_cocolon_overall_structure.md` | backend internal-onlyのstrict relation / timeout isolation / HOLD matrix / release validation構造を追記。 |
| `02_cocolon_national_system.md` | 国家システム上、production ingress / RN / API / DBを増やさず、P7 internal laneとして読む境界を追記。 |
| `02C_cocolon_contract_boundary_validation.md` | relation type/signal分離、fail-closed、RED/HOLD保持、release_allowed=falseのcontractを追記。 |
| `05_cocolon_rule_file_index.md` | R0〜R12で追加・修正されたservice/test/docの確認索引を追記。 |
| `07_latest_snapshot_diff.md` | 最新実ファイル差分と追加/変更pathを反映。 |
| `manifest.json` | 最新snapshot、diff counts、test result、modified premise filesを反映。 |
| `cocolon_local_file_inventory_diff_20260613_p7_red_hold_closure_r0_r12.csv` | `mashos-api(141).zip` -> `mashos-api_8(51).zip` の追加13件・変更14件を記録。 |

## 禁止する読み方

```text
P7-RED-003 timeoutを環境問題として閉じる。
P7 core + R6〜R11 70 passedをP7 completeと読む。
R0〜R11主要suite 34 passedをfull backend suite greenと読む。
P5 human QA material boundaryをP5 human QA完了と読む。
P6 visible expansion blockedをP6 visible拡張済みと読む。
R10 HOLD matrixを実機submit確認済みと読む。
release handoff materialの存在をrelease_allowedと読む。
P8へ進むために未解消HOLDをgreen化する。
```


# 2026-06-13 差分追記: EmlisAI P7-RED-003 Body-Free Leak Guard Repair R13-0〜R13-11 latest snapshot diff

比較元は、P7 RED・HOLD Closure R0〜R12反映後に受領していた `mashos-api(142).zip` です。比較先は、今回の最新実ファイル `mashos-api_7(54).zip` です。Cocolon側はR13差分対象外であり、RN contract確認基準として `Cocolon(230).zip` を参照します。

## 追加ファイル

| file | 補正内容 |
|---|---|
| `mashos-api/ai/docs/Cocolon_EmlisAI_P7_RED003_R13_0_R13_1_BaselineAndBodyFreeContract_ImplementationResult_20260613.md` | R13-0/R13-1結果md。baseline再現固定とbody-free leak guard contract定義を記録する。 |
| `mashos-api/ai/docs/Cocolon_EmlisAI_P7_RED003_R13_2_R13_3_BodyFreeLeakGuardHelper_ImplementationResult_20260613.md` | R13-2/R13-3結果md。helper追加と単体test境界を記録する。 |
| `mashos-api/ai/docs/Cocolon_EmlisAI_P7_RED003_R13_4_R13_5_ProductQualityConnectionE2E_ImplementationResult_20260613.md` | R13-4/R13-5結果md。Product Quality Connection E2E更新とdefault pytest timeout解消確認を記録する。 |
| `mashos-api/ai/docs/Cocolon_EmlisAI_P7_RED003_R13_6_R13_7_ObservationAndRedClosureClassification_ImplementationResult_20260613.md` | R13-6/R13-7結果md。PASSED_ISOLATED observationとRED-003 closed classification pathを記録する。 |
| `mashos-api/ai/docs/Cocolon_EmlisAI_P7_RED003_R13_8_R13_9_ValidationAndReleaseHandoff_ImplementationResult_20260613.md` | R13-8/R13-9結果md。validation matrix / release handoffへのRED-003 closed伝播を記録する。 |
| `mashos-api/ai/docs/Cocolon_EmlisAI_P7_RED003_BodyFreeLeakGuardRepair_ImplementationResult_20260613.md` | R13-10/R13-11最終実装結果md。regression suite、RED-003判定、残HOLD、未確認を記録する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_body_free_leak_guard.py` | P7 body-free leak guard helper。forbidden key / forbidden raw value / forbidden true flag / allowed safe vocabulary / failure output policyを構造化する。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_body_free_leak_guard_contract_20260613.py` | body-free leak guard contract test。raw valueをcontract materialへ持たない境界を固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_body_free_leak_guard_20260613.py` | helper単体test。current_input key、raw memo body、input id、true marker、safe rubric vocabularyを分けて検査する。 |

## 変更ファイル

| file | 補正内容 |
|---|---|
| `mashos-api/ai/tests/test_emlis_ai_complete_product_quality_connection_e2e.py` | 50万文字超serializedへのglobal substring assertionをやめ、構造化body-free guardへ置換する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_timeout_isolation.py` | R13修復後の `PASSED_ISOLATED` / `product_quality_scorecard_body_free_guard` observationを追加する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_red_closure_classification.py` | P7-RED-003を `body_free_guard_repaired` としてCLOSEDにできるclassification pathを追加する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py` | `product_quality_connection_timeout_closed=true` とRED-003 closedをvalidation summaryへ伝播する。P7 complete / P8 / releaseはfalse維持。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py` | closed_red_refsへP7-RED-003を伝播し、unresolved_red_refs / unresolved_timeout_refsから外す。ただしHOLD保持によりreview_required / release_allowed=false。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_connection_e2e_timeout_isolation_20260613.py` | R13 passed observation / timeout resolved boundaryを確認する。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_red_closure_classification_matrix_20260613.py` | P7-RED-003 closed / body_free_guard_repaired matrixを確認する。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_validation_matrix_20260612.py` | validation matrix上のRED-003 closed伝播とHOLD保持を確認する。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_release_handoff_20260612.py` | release handoff上のRED-003 closed伝播、unresolved_timeout_refs空、HOLD保持を確認する。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r11_release_validation_final_alignment_20260613.py` | R11 final alignmentをR13後のRED-003 closed / HOLD保持へ更新する。 |

削除ファイルはありません。

## 差分count

| source | added | changed | removed | 読み |
|---|---:|---:|---:|---|
| Cocolon | 0 | 0 | 0 | R13はbackend internal-only。RN production UI / 表示条件 / public response shapeは変えない。 |
| mashos-api | 9 | 10 | 0 | P7-RED-003 body-free leak guard repair R13-0〜R13-11を追加・更新。 |

## 確認済みvalidation

最新実ファイル `mashos-api_7(54).zip` 展開後の実装結果mdでは、次が確認済みとして記録されている。

```text
R13 related minimum / validation / release subset: 40 passed
Product Quality Connection E2E timeout wrapper: 1 passed / EXIT_STATUS:0
P7 core + R6〜R11 subset: 72 passed
既存Product Quality reuse subset: 31 passed
RN contract: 36 passed
```

## 最新状態の読み方

```text
P7-RED-001: CLOSED
P7-RED-002: CLOSED
P7-RED-003: CLOSED / body_free_guard_repaired / PASSED_ISOLATED
P7-HOLD-001: 未解消 / P5 human QA未完
P7-HOLD-002: 未解消 / P6 visible expansion blocked・validatedだがHOLD保持
P7-HOLD-003: 未解消 / 実機submit・modal読感未確認
P7-HOLD-004: 未解消 / full backend suite green未確認

P7 complete: false
P8 start allowed: false
release_allowed: false
```

## 前提資料としての変更

| file | 変更理由 |
|---|---|
| `00_karen_read_first.md` | 最新基準面を `mashos-api_7(54).zip` へ更新し、R13後のRED-003 closed / HOLD保持を追記。 |
| `01_cocolon_overall_structure.md` | P7-RED-003 body-free leak guard repairのbackend internal-only構造を追記。 |
| `02_cocolon_national_system.md` | 国家システム上、production ingress / RN / API / DBを増やさず、P7 internal測定laneとして読む境界を追記。 |
| `02C_cocolon_contract_boundary_validation.md` | body-free leak guard contract、safe vocabulary許可、RED-003 closed伝播、release_allowed=falseを追記。 |
| `05_cocolon_rule_file_index.md` | R13で追加・修正されたservice/test/docの確認索引を追記。 |
| `07_latest_snapshot_diff.md` | 最新実ファイル差分と追加/変更pathを反映。 |
| `manifest.json` | 最新snapshot、diff counts、test result、modified premise filesを反映。 |
| `cocolon_local_file_inventory_diff_20260613_p7_red003_body_free_leak_guard_repair_r13.csv` | `mashos-api(142).zip` -> `mashos-api_7(54).zip` の追加9件・変更10件を記録。 |

## 禁止する読み方

```text
P7-RED-003 closedをP7 completeと読む。
Product Quality Connection E2E greenを商品品質合格と読む。
R13 regression suite greenをfull backend suite greenと読む。
RN contract greenを実機submit / modal読感確認済みと読む。
P7-HOLD-001〜004をgreen化する。
release_input_status=review_requiredをrelease readyと読む。
P8へ進むために未確認HOLDを閉じる。
```

# 2026-06-13 差分追記: EmlisAI P7-HOLD-004 Phase16 Composer Red Classification R0〜R9 latest snapshot diff

比較元は、P7-RED-003 R13反映済みの利用可能backend基準 `mashos-api(143).zip` です。比較先は、今回の最新実ファイル `mashos-api_7(55).zip` です。Cocolon側は今回のHOLD-004差分対象外であり、RN contract確認基準として `Cocolon(230).zip` を参照します。

## 追加ファイル

```text
  mashos-api/ai/docs/Cocolon_EmlisAI_P7_HOLD004_Phase16ComposerRedClassification_ImplementationResult_20260613.md
  mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_path_matrix.py
  mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_phase16_composer_classification.py
  mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_r4_contract_material.py
  mashos-api/ai/tests/test_emlis_ai_p7_hold004_path_matrix_decision_rule_20260613.py
  mashos-api/ai/tests/test_emlis_ai_p7_hold004_phase16_composer_classification_20260613.py
  mashos-api/ai/tests/test_emlis_ai_p7_hold004_r4_candidate_boundary_20260613.py
  mashos-api/ai/tests/test_emlis_ai_p7_hold004_r4_candidate_boundary_replacement_20260613.py
  mashos-api/ai/tests/test_emlis_ai_p7_hold004_r5_r6_metadata_adjacent_boundary_20260613.py
  mashos-api/ai/tests/test_emlis_ai_p7_hold004_r7_r8_validation_release_handoff_20260613.py
  mashos-api/ai/tests/test_emlis_ai_p7_hold004_r9_implementation_result_handoff_20260613.py
```

## 変更ファイル

```text
  mashos-api/ai/services/ai_inference/emlis_ai_complete_composer_client.py
  mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py
  mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
  mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
```

削除ファイルはありません。

## 差分count

| source | added | changed | removed | 読み |
|---|---:|---:|---:|---|
| Cocolon | 0 | 0 | 0 | 今回差分はbackend internal-only。RN production UI / 表示条件 / public response shapeは変えない。 |
| mashos-api | 11 | 4 | 0 | P7-HOLD-004 Phase16 Composer Red Classification R0〜R9を追加・更新。 |

```text
diff_inventory: cocolon_local_file_inventory_diff_20260613_p7_hold004_phase16_composer_red_classification_r0_r9.csv
diff_inventory_sha256: 652ab14f43a16a6335287737160ab2d8c04fb5ff13478e4c330fd5dde93f65a4
```

## 前提資料へ反映する最新状態

```text
P7-RED-001: CLOSED
P7-RED-002: CLOSED
P7-RED-003: CLOSED / body_free_guard_repaired / PASSED_ISOLATED
P7-HOLD-001: 未解消 / P5 human QA未完
P7-HOLD-002: 未解消 / P6 visible expansion blocked・validatedだがHOLD保持
P7-HOLD-003: 未解消 / 実機submit・modal読感未確認
P7-HOLD-004: 未解消 / Phase16 candidate boundary classified and registered / full backend suite green未確認

hold004_phase16_classified_red_present: true
hold004_phase16_candidate_boundary_registered: true
hold004_public_adjacent_red_registered: true
hold004_phase16_implementation_result_documented: true
full_backend_suite_green_confirmed: false
p7_complete: false
p8_start_allowed: false
release_allowed: false
```

## 実装結果documentから反映する確認結果

```text
R0/R1 classification: 2 passed, 1 warning
R2/R3 path matrix / decision rule: 4 passed
R7/R8 validation / release handoff: 3 passed
target Phase16 Complete Composer direct/conversation: 2 passed
R9 implementation result / handoff: 3 passed
```

今回の前提資料更新時に追加で確認した範囲は、実ファイル差分、主要file存在、R9 implementation result handoff test `3 passed` です。full backend suite green、public two-stage fixture suite全体、実機submit / modal読感、P5 human QAは未確認として残します。

## 前提資料としての変更

| file | 変更理由 |
|---|---|
| `00_karen_read_first.md` | 最新基準面を `mashos-api_7(55).zip` へ更新し、P7-HOLD-004 R0〜R9後のHOLD保持・禁止誤読を追記。 |
| `01_cocolon_overall_structure.md` | Phase16 candidate boundary分類、path matrix、candidate/display境界修復、metadata summary、P7 matrix接続のbackend internal-only構造を追記。 |
| `02_cocolon_national_system.md` | 国家システム上、production ingress / RN / API / DBを増やさず、P7 internal測定laneとして読む境界を追記。 |
| `02C_cocolon_contract_boundary_validation.md` | generatedとpublic display permission分離、HOLD-004未close、release_allowed=falseのcontractを追記。 |
| `05_cocolon_rule_file_index.md` | P7-HOLD-004 R0〜R9で読むべきdoc/service/test owner索引を追記。 |
| `07_latest_snapshot_diff.md` | 最新実ファイル差分と追加/変更pathを反映。 |
| `manifest.json` | 最新snapshot、diff counts、policy、modified premise filesを反映。 |
| `cocolon_local_file_inventory_diff_20260613_p7_hold004_phase16_composer_red_classification_r0_r9.csv` | `mashos-api(143).zip` -> `mashos-api_7(55).zip` の追加11件・変更4件を記録。 |

## 禁止する読み方

```text
target Phase16 Composer greenをfull backend suite greenと読む。
R9 implementation result doc追加をP7-HOLD-004 closureと読む。
adjacent public redをdaily_A修復で閉じた扱いにする。
generatedをpublic display permissionと同一視する。
tone_guard削除・Gate緩和・fixed commentText追加・case専用branch追加が行われたと読む。
P7 complete / P8 start allowed / release_allowedをtrueにする。
RN UI / RN表示条件 / API route / request key / public response top-level key / DB write pathを変更済みと読む。
raw input / comment_text body / candidate body / surface body / reviewer free textをscorecard・handoff・public metaへ入れる。
```

# 2026-06-14 差分追記: EmlisAI P7-HOLD-004 Step5 Candidate Gate Preservation R0〜R12 latest snapshot diff

この差分は、前提資料上で未反映だった P7-HOLD-004 Step5 Candidate Gate Preservation Red Classification R0〜R12 を、最新実ファイル `mashos-api_9(38).zip` から確認して追記するものです。Cocolon側は今回差分対象外のため、RN UI / RN表示条件 / public response top-level key は変更なしとして扱い、backend差分のみを更新します。

比較上、前提資料更新時に照合可能だった直前backend基準 `mashos-api(145).zip` から最新 `mashos-api_9(38).zip` へのStep5関連差分は、追加4件・変更8件・削除0件です。

```text
diff_inventory: cocolon_local_file_inventory_diff_20260614_p7_hold004_step5_candidate_gate_preservation_r0_r12.csv
diff_inventory_sha256: dd2bfbdfd9e165201629777aa5586a19307979ab8873b512ced437ec565938e1
```

## 追加ファイル

| file | 構造上の意味 |
|---|---|
| `mashos-api/ai/docs/Cocolon_EmlisAI_P7_HOLD004_Step5CandidateGatePreservationRedClassification_ImplementationResult_20260614.md` | R12 implementation result document。R0〜R12、target/subset validation、full backend maxfail未完走、次赤未取得、false release/P7/P8を記録する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_step5_candidate_gate_classification.py` | R0〜R6のStep5 body-free classification / conflict matrix / decision rule / owner layer / R4C/R4D / R5/R6 helper material。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_hold004_step5_candidate_gate_classification_20260614.py` | R0〜R6 classification materialの回帰test。binding missing + passed、stale expectation、mixed HOLD、body-free境界を固定する。 |
| `mashos-api/ai/tests/test_emlis_ai_p7_hold004_step5_r7_r8_target_subset_validation_20260614.py` | R7/R8 target subset validation。Display binding consistency、public assignment consistency、HOLD material保持、body leak absenceを固定する。 |

## 変更ファイル

| file | 変更の読み方 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_display_gate.py` | `display_sentence_binding_missing` をfail-closed境界として扱い、binding_missing without exception とcomment_text許可の関係を明示する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_extension_baseline.py` | Display expected binding count sourceを実際のdisplayable / accepted sentence binding rowへ揃え、passed display traceが`binding_missing=false`で整合するようにする。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | Step5 diagnostic / multi_perspective metaに candidate path / Gate preservation / Display binding consistency / public assignment consistency をbody-freeで追加する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py` | Step5 display-binding redとmixed HOLD materialをP7-HOLD-004へ保持する。HOLD closeへは昇格しない。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py` | Step5 material / validation row / implementation result doc参照を持つ。full backend suite green、P7 complete、release_allowedはfalse維持。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py` | Step5 materialとR12 doc refをrelease handoffへ渡すが、release_allowed=falseを維持する。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_initial_entry_route.py` | 古い「public表示禁止」期待を、Gate保存・Display binding consistency・public assignment consistency・body-free boundaryへ置換する。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_initial_step7_integration.py` | Step7 integration側の旧fail-closed期待を、Display binding/public assignment contract consistencyへ置換する。 |

## 確認結果

```text
前提資料更新時spot確認:
  latest marker presence: confirmed
  py_compile relevant Step5 / P7-HOLD-004 files: ok
  R0〜R8 classification / target tests: 22 passed

R12 implementation result doc内記録:
  R8 subset: 7 passed
  full backend suite collect-only: 2673 tests collected / exit_status=0
  full backend suite maxfail=1: attempted / completed=false / next_red_captured=false
```

## 前提資料としての変更

| file | 変更理由 |
|---|---|
| `00_karen_read_first.md` | 最新基準面を `mashos-api_9(38).zip` へ更新し、P7-HOLD-004 Step5 R0〜R12の読み方を追記。 |
| `01_cocolon_overall_structure.md` | Step5 candidate gate preservationをP7 internal laneとして追記。 |
| `02_cocolon_national_system.md` | 国家システム上、production ingress / RN / API / DBを増やさないbackend internal差分として追記。 |
| `02C_cocolon_contract_boundary_validation.md` | Display binding consistency / public assignment consistency / stale expectation replacement / full suite未確認のcontractを追記。 |
| `05_cocolon_rule_file_index.md` | R0〜R12で追加・修正されたservice/test/docの確認索引を追記。 |
| `07_latest_snapshot_diff.md` | 最新実ファイル差分と追加/変更pathを反映。 |
| `manifest.json` | 最新snapshot、coverage、追加path、境界維持、diff csv参照を反映。 |
| `cocolon_local_file_inventory_diff_20260614_p7_hold004_step5_candidate_gate_preservation_r0_r12.csv` | 最新backend差分のadded/changed pathとsha256を記録。 |

## 禁止する読み方

```text
R0〜R8 target green = full backend suite green
R8 subset green = P7-HOLD-004 closed
collect-only = full backend suite green
R11 maxfail attempted = 次赤取得済み
R4-C stale expectation replacement = test緩和だけのgreen化
R4-B display binding trace repair = Gate緩和
public comment_text present = 読めている証明
R12 doc追加 = release ready
```
