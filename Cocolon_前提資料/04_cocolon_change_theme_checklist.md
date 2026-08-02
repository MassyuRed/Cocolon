---
doc_id: cocolon_change_theme_checklists
title: "Cocolon 変更テーマ別チェックリスト"
revision_date: "2026-08-02"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "canonical_current_authority_plus_last_structural_audit"
current_authority: "07_latest_snapshot_diff.md"
last_structural_audit_source:
  Cocolon: "MassyuRed/Cocolon:main@c5bab4ca174f95c5e689e33e0a00e1f35cfc44e3 plus the bounded corrections in the revision containing the 2026-08-02 audit checkpoint"
  mashos-api: "MassyuRed/mashos-api:main@315813c7bd3372462de926ddad74df567254a6b5"
purpose: "変更テーマから、華恋が読むべき構造資料を逆引きする"
---

# 1. 使い方

この資料はタスク表ではありません。  
Mash様から変更指示を受けた時に、華恋がどの構造資料を読むべきかを決めるための索引です。

読む順は固定です。

1. `00_karen_read_first.md`
2. `07_latest_snapshot_diff.md`
3. `03_cocolon_naming_system.md`
4. `09_naming_boundary.md`
5. 作業テーマに応じた `01` 系
6. 国家システムに関係する場合は `02` 系
7. contract / policy / guard に関係する場合は `05`
8. DB / rename / bridge view に関係する場合は `03` / `06` / `09`（DB名が関わる場合は `08` も読む。destructive DB変更はMash様が明示した場合だけ扱う）

# 2. テーマ別の最短読む順

## 2-1. Home / Input / notice / today-question / emotion reflection

1. `01_cocolon_overall_structure.md`
2. `01A_cocolon_overall_structure_app_foundation_home.md`
3. `02_cocolon_national_system.md`
4. `02A_cocolon_national_system_input_save_dispatch.md`
5. `02_cocolon_national_system.md`
6. `05_cocolon_rule_file_index.md`

## 2-2. App runtime / `/app/bootstrap` / feature flag / version gate

1. `01A_cocolon_overall_structure_app_foundation_home.md`
2. `02_cocolon_national_system.md`
3. `02_cocolon_national_system.md`
4. `02C_cocolon_contract_boundary_validation.md`
5. `05_cocolon_rule_file_index.md`
6. `mashos-api/ai/services/ai_inference/api_app_bootstrap.py`

同時確認するRN側の主な消費先:

- `Cocolon/AppRuntimeContext.js`
- `Cocolon/App.js`
- `Cocolon/features/home/useHomeState.js`
- `Cocolon/screens/SettingsOtherScreen.js`
- `Cocolon/screens/TodayQuestionHistoryScreen.js`
- `Cocolon/screens/SubscriptionSelectScreen.js`

## 2-3. Analysis / MyWeb / Self Structure / report

1. `01B_cocolon_overall_structure_analysis_piece_emotionlog_ranking.md`
2. `02_cocolon_national_system.md`
3. `02C_cocolon_contract_boundary_validation.md`
4. `05_cocolon_rule_file_index.md`
5. `03_cocolon_naming_system.md` / `09_naming_boundary.md`（DB名が関わる場合は `08` も読む）

## 2-4. Piece / Nexus / generated reflection / qna

1. `01B_cocolon_overall_structure_analysis_piece_emotionlog_ranking.md`
2. `02A_cocolon_national_system_input_save_dispatch.md`
3. `02_cocolon_national_system.md`
4. `02C_cocolon_contract_boundary_validation.md`
5. `05_cocolon_rule_file_index.md`
6. `03_cocolon_naming_system.md` / `09_naming_boundary.md`（DB名が関わる場合は `08` も読む）

Piece関係は、Mash様が明示した時だけPiece専用工程として扱います。

## 2-5. EmotionLog / social / ranking

1. `01B_cocolon_overall_structure_analysis_piece_emotionlog_ranking.md`
2. `02_cocolon_national_system.md`
3. `02C_cocolon_contract_boundary_validation.md`
4. `05_cocolon_rule_file_index.md`

## 2-6. Account / ProfileCreate / settings / account delete

1. `01C_cocolon_overall_structure_account_subscription_backend_support.md`
2. `02_cocolon_national_system.md`
3. `02C_cocolon_contract_boundary_validation.md`
4. `05_cocolon_rule_file_index.md`
5. `03_cocolon_naming_system.md` / `09_naming_boundary.md`（DB削除範囲が関わる場合。実削除は今回対象外）

主な同時確認ファイル:

- `Cocolon/screens/SettingsOtherScreen.js`
- `Cocolon/lib/accountLocalCleanup.js`
- `mashos-api/ai/services/ai_inference/api_account_lifecycle.py`

## 2-7. Subscription / IAP / 新規販売停止

1. `01C_cocolon_overall_structure_account_subscription_backend_support.md`
2. `02_cocolon_national_system.md`
3. `02C_cocolon_contract_boundary_validation.md`
4. `05_cocolon_rule_file_index.md`
5. `Cocolon/SUBSCRIPTION_RELEASE_PHASE3.md`
6. `Cocolon/SUBSCRIPTION_RELEASE_PHASE4.md`

主な同時確認ファイル:

- `Cocolon/screens/SubscriptionSelectScreen.js`
- `Cocolon/SubscriptionContext.js`
- `Cocolon/lib/iap/*`
- `mashos-api/ai/services/ai_inference/api_subscription.py`

## 2-8. worker / FCM queue / load test

1. `02_cocolon_national_system.md`
2. `02C_cocolon_contract_boundary_validation.md`
3. `05_cocolon_rule_file_index.md`
4. `mashos-api/ai/docs/WORKER_OPERATIONS.md`
5. `mashos-api/ai/docs/LOAD_TESTING.md`
6. `mashos-api/scripts/astor_worker_status.py`
7. `mashos-api/scripts/cocolon_load_test.py`

## 2-9. DB / bridge view / rename boundary

1. `03_cocolon_naming_system.md`
2. `06_cocolon_filename_change_hold_ledger.md`
3. `09_naming_boundary.md`
4. `01` 系の該当feature
5. `02` 系の該当国家システム
6. `05_cocolon_rule_file_index.md`

# 3. 実作業時の原則

- 単体ファイルだけで決めない。
- file block の **直接関係ファイル / 直接参照ファイル / 同時確認ファイル** を開く。
- national system に関係する変更は必ず `02` 系へ入る。
- route / request / response / startup / unread / entitlement / account delete / subscription を触る時は `05` を先に見る。
- 旧名称は、`09` に保管された構造境界ならrenameしない。
- `08_cocolon_db_rename_boundary.md` は存在するため、DB物理名・bridge・rename境界は `08` を正本として確認する。destructive変更はMash様が明示した場合だけ行う。名称読み分けは `03` / `06` / `09` でも確認する。

## 2-4A. EmlisAI immediate reply / input feedback

1. `01A_cocolon_overall_structure_app_foundation_home.md`
2. `02A_cocolon_national_system_input_save_dispatch.md`
3. `02C_cocolon_contract_boundary_validation.md`
4. `05_cocolon_rule_file_index.md`
5. `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
6. `mashos-api/ai/services/ai_inference/emlis_ai_world_model_service.py`
7. `mashos-api/ai/services/ai_inference/emlis_ai_observation_kernel.py`
8. `mashos-api/ai/services/ai_inference/emlis_ai_quality_gate.py`

EmlisAIは例文特化ではなく、読解・意味分解・文章構成・自然文生成・最終品質確認の汎用pipelineとして扱う。


# 2026-05-07 差分追記: 三大中核構造 / value observationを触る時

Mash様から「三大中核構造」「EmlisAI強化」「Pieceが短く潰れる」「分析の観測力」などの指示が出た場合、次を読む。

1. `00_karen_read_first.md`
2. `03_cocolon_naming_system.md`
3. `01A_cocolon_overall_structure_app_foundation_home.md`（EmlisAI immediate reply）
4. `01B_cocolon_overall_structure_analysis_piece_emotionlog_ranking.md`（Piece / Analysis）
5. `02A_cocolon_national_system_input_save_dispatch.md`（Input -> immediate reply / preview flow）
6. `02C_cocolon_contract_boundary_validation.md`（contract / guard / policy）
7. `05_cocolon_rule_file_index.md`

必ず確認する実ファイルは、`value_observation_types.py`、`cocolon_value_observation_service.py`、`emlis_ai_world_model_service.py`、`emlis_ai_observation_kernel.py`、`emotion_piece_generation_service.py`、`piece_generation_policy.py`、`analysis_report_validity_gate.py` です。


# 2026-05-09 差分追記: 今日の問いpersonal / 感情通知 / Tutorialチェック

## 今日の問いを触る場合

1. `00` → `03` → `09` → `01A` → `01C` → `02A` → `02C` → `08` の順で確認します。
2. `static_role_probe` を削除しません。
3. `personal_followup` はPremium追加層として扱います。
4. `anchor_text` は元入力に実在する短い文字列だけを表示します。
5. 通知文には個人の引用を出しません。
6. personal回答でstatic sequenceを進めません。
7. 回答保存後のself_structure refresh enqueueを維持します。

## 感情通知を触る場合

- local/API-only、queue worker、notification workerのどこでFCM送信するかを確認します。
- queue modeでは `send_fcm_push_v1` をconsumeできるworker profileが必要です。
- API側Firebase credential gateでqueue enqueueを止めない設計を維持します。

## Tutorialを触る場合

- `Emlis（エムリス）` 表記を維持します。
- Home説明時は `今日の全体行動` / `入力履歴` をチュートリアルでは隠す境界を確認します。
- 感情選択とカテゴリ選択は別フェーズとして扱います。

# 2026-05-09 差分追記: RN巨大画面分割 / 本番運用監視チェック

## RN巨大画面分割を触る時

| 変更テーマ | 必ず確認するfile |
|---|---|
| App root / navigation | `App.js`, `navigation/navigationRef.js`, `navigation/RootNavigator.js`, `navigation/MainTabs.js`, `runtime/AppRuntimeBootstrapGate.js` |
| Home / Input | `screens/InputScreen.js`, `screens/input/*`, `features/home/useHomeState.js`, `features/home/useHomeActions.js` |
| Nexus | `screens/NexusScreen.js`, `screens/nexus/*`, `lib/nexusApi.js` |
| Analysis report viewer | `screens/AnalysisReportViewerScreen.js`, `screens/analysisReport/*`, `SubscriptionContext.js` |
| Analysis home | `screens/AnalysisScreen.js`, `screens/analysis/*`, `UnreadContext.js` |
| Account | `screens/AccountScreen.js`, `screens/account/*`, `SubscriptionContext.js`, `SettingsOtherScreen.js` |
| Piece home | `screens/PieceScreen.js`, `screens/piece/*`, `screens/PieceEntryScreen.js` |
| PieceLibrary | `screens/PieceLibraryScreen.js`。Phase 3未実装のため、まだ単独巨大画面ownerとして読む |
| RN screen guard | `tests/rn-screen-contracts.test.js` |

禁止: screen split作業のついでにroute名、public API、DB write path、legacyWireContracts、visible/legacy名称を変更しない。

## 本番運用監視を触る時

| 変更テーマ | 必ず確認するfile |
|---|---|
| RN monitoring | `Cocolon/lib/monitoring.js`, `Cocolon/App.js`, `Cocolon/lib/apiClient.js`, `Cocolon/navigation/RootNavigator.js`, `Cocolon/runtime/AppRuntimeBootstrapGate.js` |
| backend monitoring endpoint | `mashos-api/ai/services/ai_inference/api_client_events.py`, `app.py`, `api_contract_registry.py` |
| public registry | `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md`, `mashos-api/ai/tests/contract/test_client_events_contract.py` |
| privacy / redaction | token / Authorization / email / UUID / user_id がraw logへ出ないこと |

監視はbest-effortであり、Cocolonのproduct stateやDB write pathを変更しない。

# 2026-05-09 差分追記: RN巨大画面分割後の変更チェックリスト

## 画面分割moduleを触る場合

1. entry shellを確認する。`App.js` / `InputScreen.js` / `AnalysisScreen.js` / `AnalysisReportViewerScreen.js` / `NexusScreen.js` / `PieceScreen.js` / `AccountScreen.js` はroute/import境界として残る。
2. 対象subdirectoryを確認する。
   - Home/Input: `screens/input/*`
   - Analysis: `screens/analysis/*`, `screens/analysisReport/*`
   - Nexus/Piece: `screens/nexus/*`, `screens/piece/*`
   - Account: `screens/account/*`
   - App root: `navigation/*`, `runtime/*`, `components/GlobalFrameLayout.js`
3. `tests/rn-screen-contracts.test.js` を確認し、分割後moduleの接続guardを壊さない。
4. 画面分割のついでにAPI route / DB write path / visible名 / legacy名を変更しない。

## 本番運用監視を触る場合

1. RN側は `lib/monitoring.js` と `lib/apiClient.js`、`App.js`、`navigation/RootNavigator.js`、`runtime/AppRuntimeBootstrapGate.js` を確認する。
2. backend側は `api_client_events.py`、`app.py`、`api_contract_registry.py`、`PUBLIC_API_REGISTRY.md`、`test_client_events_contract.py` を確認する。
3. token / Authorization / email / UUID / 長いtoken風文字列のredactionを維持する。
4. raw user_idをログに出さず、`user_hash` 境界を維持する。
5. 監視eventはDB保存ではなくstructured log / alert logとして扱う。


# 2026-05-11 差分追記: 共通文章生成基盤を触る時

共通文章生成基盤、EmlisObservationComposer、PieceComposer、AnalysisComposer、共通Guardを触る場合は次を確認する。

1. `00_karen_read_first.md` の共通基盤境界。
2. `03_cocolon_naming_system.md` の visible名 / route名 / DB名 / adapter名の分離。
3. `05_cocolon_rule_file_index.md` の共通Core rule / guard / test。
4. `09_naming_boundary.md` の名称混在境界。
5. 変更対象中核ごとに、Emlisはpassed-only、Pieceはpreview/publish同一性、Analysisは非診断・素材domain分離を確認する。

# 2026-05-13 差分追記: こころ天気の旧感情分析非表示を触る時

1. backendは `api_analysis_reports.py` の `_is_kokoro_weather_report_row`、ready/detail cache key、paginationを確認する。
2. weekly-days補助表示は `api_analysis_reads.py` で `kokoroWeather` 不成立を404にしているか確認する。
3. 未読バッジは `api_report_reads.py` で旧レポートIDを候補にしていないか確認する。
4. frontendは `kokoroWeatherFormatters.js` の `isKokoroWeatherReportRecord`、`useAnalysisReportActions.js` の `cocolon:kokoroWeatherLatestReport:v1`、History / Viewerのfail-closedを確認する。
5. 退会後cleanupでは旧 `cocolon:analysisLatestReport` と新 `cocolon:kokoroWeatherLatestReport:v1` の両方を削除対象にする。
6. 旧レポートをDBからDELETEしない。DB physical name、public route、`daily` / `weekly` / `monthly` 内部値を変更しない。

## 2026-05-13 差分追記: わたしマップ変更時チェックリスト

わたしマップ / 自己分析を触る時は、次を同時確認する。

| チェック | 見る場所 |
|---|---|
| Free を完全遮断していないか | `api_self_structure.py`, `useAnalysisSelfStructureActions.js`, `AnalysisContentFirstScreen.js` |
| `content_json.watashiMap` が additive で、legacy payload を消していないか | `astor_self_structure_report.py`, `watashi_map_service.py`, `test_self_structure_watashi_map_payload.py` |
| `あなたは〇〇タイプ` 風になっていないか | `watashi_map_service.py`, `WatashiMapRenderer.js`, guide / tutorial / IAP copy |
| route / DB physical name を rename していないか | `/self-structure/*`, `myprofile_reports`, `PUBLIC_API_REGISTRY`, `api_contract_registry.py` |
| renderer fallback が残っているか | `watashiMapFormatters.js`, `SelfStructureReportViewerScreen.js` |
| Free / Plus / Premium の履歴境界が一致しているか | `watashiMapAccessPolicy.js`, `SelfStructureReportHistoryScreen.js`, subscription tests |
| access policy import path が実ファイル配置と一致しているか | 最新実ファイルでは `components/selfStructure/watashiMapAccessPolicy.js` が存在し、History / Viewer import と一致。root copyは互換copyとして扱う |

# 2026-05-15 差分追記: EmlisAI A案到達 Step15-20 を触る時

EmlisAIのA案到達、A-P0判定、A案相当Composer、長期品質を触る時は、次の順で確認する。

1. `00_karen_read_first.md`
2. `01A_cocolon_overall_structure_app_foundation_home.md`
3. `02A_cocolon_national_system_input_save_dispatch.md`
4. `02C_cocolon_contract_boundary_validation.md`
5. `05_cocolon_rule_file_index.md`
6. `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
7. Step別owner: `cocolon_text_generation_core/stabilization.py`, `emlis_ai_rollout_metrics_service.py`, `emlis_ai_ap0_migration_decision_service.py`, `emlis_ai_a_plan_equivalent_composer_service.py`, `emlis_ai_long_term_quality_service.py`
8. Step別test: `test_cocolon_text_generation_core_step15_stabilization.py`, `test_emlis_ai_step16_rollout_metrics.py`, `test_emlis_ai_step17_broad_input_fixtures.py`, `test_emlis_ai_step18_ap0_migration_decision.py`, `test_emlis_ai_step19_a_plan_equivalent_composer.py`, `test_emlis_ai_step20_long_term_quality.py`

禁止: A案相当導入を理由に、固定観測文fallback、外部LLM導入、DB rename、public route変更、response key変更、passed-only表示の解除をしない。

# 2026-05-15 差分追記: EmlisAI 限定Composer拡張 Step0-11 を触る時

EmlisAIの限定Composer拡張、SentenceBinding、relation taxonomy、binding-aware Grounding、scorecard、E2E表示契約を触る時は、次の順で確認する。

1. `00_karen_read_first.md` の最新基準面と限定Composer拡張境界
2. `03_cocolon_naming_system.md` の限定Composer / 完全Composer / 完全Composer商品品質版の読み分け
3. `09_naming_boundary.md` の名称混在境界
4. `01A_cocolon_overall_structure_app_foundation_home.md` の runtime map
5. `02C_cocolon_contract_boundary_validation.md` の contract / verification
6. `05_cocolon_rule_file_index.md` の Guard / test 索引

確認必須: raw入力本文を要求せず、`diagnostic_summary` / `coverage_group` / `binding_diagnostic` / `gate_results` / `scorecard` で原因を見る。

禁止: Gate緩和、入力専用テンプレ、固定完成文、外部AI/ローカルLLM導入、DB/API/RN表示契約rename。

# 2026-05-16 差分追記: EmlisAI 完全Composer初期版 Commit1-13 を触る時

EmlisAIの完全Composer初期版、CompleteComposerClient、SentencePlan 2.0、Surface Realizer 2.0、Self-Repair、scorecard、RN passed-only contractを触る時は、次の順で確認する。

1. `00_karen_read_first.md` の最新基準面と完全Composer初期版境界
2. `03_cocolon_naming_system.md` の限定Composer / 完全Composer初期版 / 完全Composer商品品質版の読み分け
3. `01A_cocolon_overall_structure_app_foundation_home.md` のEmlisAI runtime map
4. `02A_cocolon_national_system_input_save_dispatch.md` のInput -> immediate reply flow
5. `02C_cocolon_contract_boundary_validation.md` のcontract / verification
6. `05_cocolon_rule_file_index.md` のComplete Composer rule / guard索引

確認禁止の逆条件:
- 表示率を上げるためにDisplay Gate / Grounding / Readerを緩めない。
- Complete内部metaをfrontendで直接見てpassed扱いにしない。
- 外部AIレンタル・ローカルLLM・固定完成文テンプレを追加しない。

# 2026-05-16 差分追記: EmlisAI 商品品質版接続 Step0-7 を触る時

EmlisAIのbinding contract、coverage、Grounding、Surface variation、Self-Repair、Tone Engine、Scorecard / Blind QA、Release ladderを触る時は、次の順で確認する。

1. `00_karen_read_first.md` の最新基準面と商品品質版接続境界。
2. `03_cocolon_naming_system.md` の完全Composer初期版 / 商品品質版接続 / Product Gate の読み分け。
3. `09_naming_boundary.md` の internal meta / public契約境界。
4. `01A_cocolon_overall_structure_app_foundation_home.md` のEmlisAI runtime map。
5. `02A_cocolon_national_system_input_save_dispatch.md` のInput -> immediate reply flow。
6. `02C_cocolon_contract_boundary_validation.md` のcontract / regression。
7. `05_cocolon_rule_file_index.md` のproduct quality rule / test index。

確認必須:
- `binding_used` は存在ではなくGate判断での使用を示す。
- `ProductQualityScorecard` と `Release ladder` は meta-only。Display Gateの代替ではない。
- Blind QAなしのread_feelingはProduct Gate到達扱いにしない。
- Product Gate条件に近づいても、Step7単体では public release applied / product quality released にしない。

禁止: Gate緩和、固定文fallback、外部AI/ローカルLLM、raw入力本文の改善資料化、DB/API/RN表示契約rename。

# 2026-05-17 差分追記: EmlisAI positive_recovery relation_not_expressed 修正チェックリスト

| 確認項目 | 見るファイル | OK条件 |
|---|---|---|
| relation cue契約 | `emlis_ai_relation_surface_contract.py` | recoveryは戻る/回復系と前段/負荷/重さ/流れ系の接続を要求する。`関係` 単独ではpassしない。 |
| Reader | `emlis_ai_listener_reader_judge.py` | relation cueがない候補は引き続き `relation_not_expressed`。recovery expected時にgeneric cueだけで通さない。 |
| Self-Repair | `emlis_ai_complete_self_repair_service.py` | marker付与時も meaning_added=false / relation_ids_preserved=true / gate_relaxed=false。 |
| Surface | `emlis_ai_complete_surface_realizer.py` | recovery relation lineをcontract key / surface_signature / grounding metaへ残す。固定完成文fallbackにしない。 |
| Diagnostic | `emlis_ai_complete_reply_diagnostics_service.py` / `emlis_ai_reply_service.py` | reader_relation_signal_* / self_repair_relation_marker_* がraw入力なしで見える。 |
| Log | `emotion_submit_service.py` | 一時logはdefault off。enabled時もcomment_text本文とraw inputを出さない。 |
| RN | `Cocolon/screens/InputScreen.js` / `tests/rn-screen-contracts.test.js` | relation metaでは表示せず、public passed + textだけ表示。 |

このチェックリストでNGが出た場合、Gateを緩めず、relation surface contract / Surface / Self-Repair / diagnostic の整合へ戻す。


# 2026-05-17 差分追記: EmlisAI Observation Diagnostic Lockdown チェックリスト

## 対象になる変更

- `/emotion/submit` が成功しているのに `Emlisの観測` が出ない原因を切り分ける。
- 11:35非表示 / 11:36表示のように、2件を同一schemaで比較する。
- candidate前、Reader、Grounding、Template、Display、RNのどこで差が出たかを確定する。

## 先に読む資料

1. `00_karen_read_first.md` の Observation Diagnostic Lockdown current boundary。
2. `01A_cocolon_overall_structure_app_foundation_home.md` の frontend boundary。
3. `02A_cocolon_national_system_input_save_dispatch.md` の `emotion_submit_service` 接続。
4. `02C_cocolon_contract_boundary_validation.md` の contract / verification boundary。
5. `05_cocolon_rule_file_index.md` の rule / test index。

## 必ず確認する実ファイル

| 層 | file |
|---|---|
| backend helper | `mashos-api/ai/services/ai_inference/emlis_ai_observation_diagnostic_lockdown.py` |
| submit接続 | `mashos-api/ai/services/ai_inference/emotion_submit_service.py` |
| reply meta | `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` / `emlis_ai_complete_reply_diagnostics_service.py` |
| compare | `mashos-api/ai/services/ai_inference/emlis_ai_observation_diagnostic_compare.py` |
| branch | `mashos-api/ai/services/ai_inference/emlis_ai_observation_diagnostic_branching.py` |
| RN diagnostic | `Cocolon/screens/input/inputFeedbackObservationDiagnostics.js` / `Cocolon/screens/InputScreen.js` |
| tests | `test_emlis_ai_observation_diagnostic_*.py`, `test_emotion_submit_observation_diagnostic_log.py`, `rn-screen-contracts.test.js` |

## 禁止

- classification未確定でComposer / Surface / Toneを修正する。
- Gateを緩める。
- fixed sentence / input-specific template を足す。
- raw input / public `comment_text` 本文をlogへ出す。
- backendだけ、RNだけで原因を断定する。

# 2026-05-17 差分追記: EmlisAI Reader Relation Surface 修正チェックリスト

Observation Diagnostic Lockdownで `candidate_generated_but_reader_rejected` が出た後の修正では、次を確認する。

| 確認対象 | owner | OK条件 |
|---|---|---|
| 宛名contract | `emlis_ai_listener_reader_judge.py` | greeting policyと同じ敬称suffixを許容し、敬称なし任意宛名は広く通さない。 |
| expected relation | `emlis_ai_reply_service.py` | sentence binding / composer metaからsurface relation typeをReaderへ渡す。edge idは除外する。 |
| limited/A1 previous reason | `emlis_ai_limited_composer_client.py` | `addressee_not_clear` / `relation_not_expressed` だけをlimited repair対象にする。 |
| addressee repair | `emlis_ai_limited_composer_client.py` | 先頭宛名行だけを置換し、本文意味・根拠を増やさない。 |
| relation marker repair | `emlis_ai_limited_composer_client.py` / `emlis_ai_relation_surface_contract.py` | 既存contractのmarker phrase/metaを使い、固定fallback文を追加しない。 |
| core hook | `_core_checked_response` | repair後もcore evaluation / Gateを通す。落ちたらfail-closed。 |
| diagnostic meta | `emlis_ai_complete_reply_diagnostics_service.py` / `emlis_ai_observation_diagnostic_lockdown.py` | limited repairのattempted/applied/marker情報だけを出し、raw input / comment_text本文は出さない。 |

禁止: RN表示条件変更、Display Gate緩和、Grounding緩和、Template Guard緩和、固定完成文、外部AI/local LLM、DB/API/RN rename。

# 2026-05-18 差分追記: EmlisAI ProductGate Measurement Step0-10 を触る時

EmlisAIのProductGate Measurement、diagnostic join、scorecard event adapter、coverage group aggregation、Blind QA separation、next action routing、local tool、Exit Gateを触る時は、次の順で確認する。

1. `00_karen_read_first.md` の最新基準面とProductGate Measurement境界。
2. `03_cocolon_naming_system.md` のProductGate Measurement / Product Gate / display_confirmedの読み分け。
3. `01_cocolon_overall_structure.md` のProductGate Measurement Step0-10 overall structure。
4. `01C_cocolon_overall_structure_account_subscription_backend_support.md` のbackend support / test map。
5. `02_cocolon_national_system.md` と `02A` のInput保存境界。
6. `02C_cocolon_contract_boundary_validation.md` のcontract / verification boundary。
7. `05_cocolon_rule_file_index.md` のProductGate Measurement rule / test index。
8. 最新実ファイルの `emlis_ai_complete_product_quality_measurement_*`、`emlis_observation_product_quality_measurement.py`、関連test。

固定:
- backend passedだけでdisplay countしない。
- diagnostic missingは原因修正へ進めない。
- Blind QAなしでread_feelingを埋めない。
- local tool outputへraw入力本文・public `comment_text` 本文を出さない。
- Exit Gate readyをProduct Gate達成やpublic release適用にしない。

# 2026-05-20 差分追記: EmlisAI Runtime Surface Quality Step0-12 を触る時

EmlisAIのRuntime Surface Quality、source lock、surface signature、scorecard surface metrics、coverage baseline、branch resolver、complete runtime activation、anti-template、grammar normalizer、Tone Engine 2.1、surface-aware self-repair、Blind QA / Long-run、Exit Gateを触る時は、次の順で確認する。

1. `00_karen_read_first.md` の最新基準面とRuntime Surface Quality境界。
2. `03_cocolon_naming_system.md` のRuntime Surface Quality / Product Gate / public releaseの読み分け。
3. `01_cocolon_overall_structure.md` のRuntime Surface Quality Step0-12 overall structure。
4. `01A_cocolon_overall_structure_app_foundation_home.md` のInput / EmlisAI runtime map。
5. `01C_cocolon_overall_structure_account_subscription_backend_support.md` のbackend support owner / tests。
6. `02A_cocolon_national_system_input_save_dispatch.md` の保存API非変更境界。
7. `02C_cocolon_contract_boundary_validation.md` のcontract / verification boundary。
8. `05_cocolon_rule_file_index.md` のRuntime Surface Quality rule / test index。
9. `09_naming_boundary.md` のinternal名保管境界。
10. 最新実ファイルzip上の対象file。

禁止: RN passed-only contractを緩める、`/emotion/submit` routeやresponse keyをrenameする、DB physical nameを変える、Gateを緩める、raw入力本文やpublic `comment_text` 本文をmetricへ入れる、Step12 Exit GateをProduct Gate達成扱いにする。

# 2026-05-21 差分追記: EmlisAI 観測返答 Step0-14 を触る時

EmlisAIの観測返答、eligible / low_information routing、ユーザー辞書境界、低情報Composer、Surface / Tone、Display Repair、Scorecard / Blind QA、Regression Fixture、Exit Gate / Handoffを触る時は、次の順で確認する。

1. `00_karen_read_first.md` の最新基準面とObservation Reply Step0-14境界。
2. `03_cocolon_naming_system.md` の `observation_reply_kind` / `low_information_observation` / public statusの読み分け。
3. `09_naming_boundary.md` のObservation Reply internal名保管境界。
4. `01_cocolon_overall_structure.md` のObservation Reply Step0-14 overall structure。
5. `01A_cocolon_overall_structure_app_foundation_home.md` のRN optional meta境界。
6. `01C_cocolon_overall_structure_account_subscription_backend_support.md` のbackend service / test map。
7. `02A_cocolon_national_system_input_save_dispatch.md` のimmediate reply / low-information branch接続。
8. `02C_cocolon_contract_boundary_validation.md` のcontract / verification boundary。
9. `05_cocolon_rule_file_index.md` のObservation Reply rule / test index。

禁止:

- 低情報観測を新しいpublic `observation_status` にしない。
- RN表示条件を `observation_reply_kind` だけで開くように変えない。
- Freeでユーザー辞書を使わない。
- サブスクでもユーザー辞書だけで低情報入力をeligible化しない。
- Display Gateを緩めて本文を通さない。
- 固定fallback、外部AI、local LLM、例文特化runtimeを復活させない。


# 2026-05-24 差分追記: EmlisAI public feedback meta boundary / timeout recovery / low-information prompt / notification uuid boundary

EmlisAI immediate response、`/emotion/submit`、RN timeout、low-information質問文、notification settingsを触る時は、次を最短読む順として固定する。

1. `00_karen_read_first.md` の最新基準面。
2. `01A_cocolon_overall_structure_app_foundation_home.md` のHome/Input timeout recovery境界。
3. `01C_cocolon_overall_structure_account_subscription_backend_support.md` のpublic feedback meta sanitizer / backend test map。
4. `02A_cocolon_national_system_input_save_dispatch.md` のSave後immediate response境界。
5. `02C_cocolon_contract_boundary_validation.md` のpublic response contract / test。
6. `05_cocolon_rule_file_index.md` のrule / test index。
7. `08_cocolon_db_rename_boundary.md` のnotification uuid sentinel boundary。
8. 最新実ファイルzip上の対象file。

同時確認する主な実ファイル:

- `Cocolon/lib/api/home/emotionSubmitApi.js`
- `Cocolon/screens/InputScreen.js`
- `Cocolon/tests/rn-screen-contracts.test.js`
- `mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py`
- `mashos-api/ai/services/ai_inference/emotion_submit_service.py`
- `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
- `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py`
- `mashos-api/ai/services/ai_inference/emlis_ai_low_information_observation_composer.py`
- `mashos-api/ai/services/ai_inference/emlis_ai_observation_surface_realizer_tone.py`
- `mashos-api/ai/services/ai_inference/emlis_ai_observation_display_repair_integration.py`
- `mashos-api/ai/services/ai_inference/config/emlis_observation_dictionary.v1.json`

禁止: timeout時の自動再送、保存失敗断定、public response key rename、internal Emlis meta全文返却、raw input / public comment本文のpublic meta混入、global sentinel文字列をuuid filterへ混ぜること。


# 2026-05-25 差分追記: EmlisAI Product Visible Surface Reliability + Koto Splice Repair を触る時

`取らなければこと` / `予感こと` 系、B相当の機械的relation文、表示なし診断、bounded repair reroute、RN diagnostic meta contractを触る時は、次の順で確認する。

1. `00_karen_read_first.md` の最新基準面。
2. `07_latest_snapshot_diff.md` の Product Visible Surface Reliability + Koto Splice Repair Step0-8 snapshot差分。
3. `01A_cocolon_overall_structure_app_foundation_home.md` のHome / Input / immediate reply境界。
4. `01C_cocolon_overall_structure_account_subscription_backend_support.md` のbackend support / test owner。
5. `02A_cocolon_national_system_input_save_dispatch.md` の保存API非変更境界。
6. `02C_cocolon_contract_boundary_validation.md` のcontract / guard。
7. `05_cocolon_rule_file_index.md` のrule / test index。
8. 最新実ファイルzip上の対象file。

同時確認する主な実ファイル:

- `mashos-api/ai/services/ai_inference/emlis_ai_phrase_unit_grammar_normalizer.py`
- `mashos-api/ai/services/ai_inference/emlis_ai_limited_sentence_quality_guard.py`
- `mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_quality_signature.py`
- `mashos-api/ai/services/ai_inference/emlis_ai_runtime_surface_pre_return_gate.py`
- `mashos-api/ai/services/ai_inference/emlis_ai_visible_surface_acceptance_gate.py`
- `mashos-api/ai/services/ai_inference/emlis_ai_relation_surface_contract.py`
- `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_client.py`
- `mashos-api/ai/services/ai_inference/emlis_ai_bounded_repair_reroute.py`
- `mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py`
- `mashos-api/ai/services/ai_inference/emotion_submit_service.py`
- `Cocolon/tests/rn-screen-contracts.test.js`

禁止: 表示率のためにGateを緩める、safeな `感じたこと` を巻き込む、public metaへraw input / candidate本文 / comment_text本文を入れる、RN表示条件をdiagnostic metaで開く、fixed fallback良文をruntimeに入れる、DB/API/RN contractをrenameする。

# 2026-05-26 差分追記: EmlisAI Environment State Output Surface Contract Completion を触る時

`environment_state_output_frame` をEmlisAI表示candidateへ使うpath、scope marker補完、runtime pre-return gate、public feedback meta境界、low-information repair境界を触る時は、次の順で確認する。

1. `00_karen_read_first.md` の最新基準面と「EmlisAI ESO surface contract completion Phase0-6」。
2. `cocolon_environment_state_output_observation_structure_design_2026_05_25.md` の単一入力観測境界と2026-05-26実装差分。
3. `01_cocolon_overall_structure.md` の全体構造差分。
4. `01A_cocolon_overall_structure_app_foundation_home.md` のHome / Input / RN表示非変更境界。
5. `01C_cocolon_overall_structure_account_subscription_backend_support.md` のbackend owner / test map。
6. `02A_cocolon_national_system_input_save_dispatch.md` のInput保存後 immediate reply境界。
7. `02C_cocolon_contract_boundary_validation.md` のcontract / meta boundary。
8. `03_cocolon_naming_system.md` と `09_naming_boundary.md` のinternal名 / public名の分離。
9. `05_cocolon_rule_file_index.md` のrule / test index。
10. 最新実ファイルzip上の対象file。

同時確認する主な実ファイル:

- `mashos-api/ai/services/ai_inference/emlis_ai_environment_state_output_surface_contract_completion.py`
- `mashos-api/ai/services/ai_inference/emlis_ai_conversation_composer_service.py`
- `mashos-api/ai/services/ai_inference/emlis_ai_runtime_surface_pre_return_gate.py`
- `mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py`
- `mashos-api/ai/services/ai_inference/emotion_submit_service.py`
- `mashos-api/ai/services/ai_inference/emlis_ai_observation_display_repair_integration.py`
- `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_client.py`
- `Cocolon/tests/rn-screen-contracts.test.js`

禁止: scope marker requirementをfalseにする、`environment_state_output_scope_marker_missing` をignoreする、forbidden surface claimをmarkerで修復する、runtime pre-return gateを削除・緩和する、signatureだけでmarker確認済みにする、`schema_invalid` / `rejected` / `unavailable` のcomment_textをpublicへ出す、completion result / raw input / candidate bodyをpublic metaへ出す、RN表示条件をdiagnostic metaで開く、DB/API/RN contractをrenameする。


# 2026-05-30 差分追記: EmlisAI Product Quality Stabilization Phase18 を触る時

EmlisAIの商品品質安定化、TwoStage適用境界、Complete Initial候補生成、低情報repair、daily_unpleasant mode context、meta-only sanitizer、diagnostic taxonomy、表示文読感QA、`/emotion/submit`商品品質E2E、RN contractを触る時は、次の順で確認する。

1. `00_karen_read_first.md` のPhase18反映と最新基準面。
2. `03_cocolon_naming_system.md` のPhase18 internal名の読み分け。
3. `09_naming_boundary.md` のPhase18 internal名保管境界。
4. `05_cocolon_rule_file_index.md` のPhase18 rule / test index。
5. `07_latest_snapshot_diff.md` のPhase18 snapshot差分。
6. 実ファイル側の対象helper / service / test。

主に確認する実ファイル:

```text
mashos-api/ai/services/ai_inference/emlis_ai_two_stage_applicability.py
mashos-api/ai/services/ai_inference/emlis_ai_diagnostic_failure_taxonomy.py
mashos-api/ai/services/ai_inference/emlis_ai_visible_readability_quality.py
mashos-api/ai/services/ai_inference/emlis_ai_observation_display_repair_integration.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_composer_client.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py
mashos-api/ai/services/ai_inference/emlis_ai_state_answer_surface_contract.py
mashos-api/ai/services/ai_inference/emlis_ai_visible_surface_acceptance_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/tests/test_emotion_submit_phase18_product_quality_e2e.py
Cocolon/tests/rn-screen-contracts.test.js
```

禁止: Phase18 internal metaをpublic response keyへ出す、RN側でPhase18 metaを表示条件にする、`observation_text` / `reception_text` を追加する、Gate / Grounding / Reader / Templateを緩める、低情報repairでsafety / scope / AP0 / provided candidate / non-low-information generated failureをpassed化する、辞書本文やsurface_policy本体をpayloadへ出す、完成返答テンプレやcase_id固定文をruntimeへ足す。
# 2026-06-01 差分追記: EmlisAI Phase20撤回保持再設計を触る時

EmlisAIのPhase20後実装を触る時は、最低限次を同時に読む。

1. `00_karen_read_first.md` のPhase20反映と最新基準面。
2. `emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md` の実装反映状態。
3. `03_cocolon_naming_system.md` のPhase20 internal名の読み分け。
4. `09_naming_boundary.md` のPhase20 internal名保管境界。
5. `05_cocolon_rule_file_index.md` のPhase20 rule / test index。
6. `07_latest_snapshot_diff.md` のPhase20 snapshot差分。

修正時の確認順:

```text
1. safety / infra / self-denial 境界かを確認する。
2. 入力束 thought / action / emotion / category から material_quality を確認する。
3. low-information / limited / normal の response_kind を確認する。
4. Gate failure がpre-public / post-finalのどちらで起きているか確認する。
5. displayable response kindなら、短縮・限定・再生成・低情報/安全応答またはpost-final recoveryへ回るか確認する。
6. Gate Recovery surfaceがfixed fallback化していないか、surface binding / repetition QAで確認する。
7. public sanitizer後に internal meta が漏れていないか確認する。
8. RNが commentText 以外を表示sourceにしていないか確認する。
```

禁止: Phase20 internal metaをpublic response keyへ出す、RN側で `response_kind` / `diagnostic_summary` / `material_quality` / `phase20_13_post_final_gate_recovery` / `phase20_15_gate_recovery_surface_binding` を表示条件にする、C/D専用mode・cue・完成surfaceを復活させる、A低情報をcase専用routeにする、Gate recoveryをfixed fallbackにする、自己否定を本人の事実として確定する、safety emergencyを通常Emlis観測としてpassed化する。


# 2026-06-04 差分追記: EmlisAI Product Quality Measurement / Blocker Repair Phase0-8 を触る時

EmlisAIの商品品質計測、Blocker Matrix、Blind QA Integration、Release Decision、Validation Planを触る時は、次の順で確認する。

1. `00_karen_read_first.md` のProduct Quality Measurement Phase0-8反映と最新基準面。
2. `emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md` のPhase19撤回保持再設計。
3. `Cocolon_EmlisAI_UserLabelConnectionObservation_v1_Design_2026-06-03.md` とUser Label Connection QA境界。
4. `01_cocolon_overall_structure.md` / `01C_cocolon_overall_structure_account_subscription_backend_support.md` のbackend internal owner map。
5. `02A_cocolon_national_system_input_save_dispatch.md` / `02C_cocolon_contract_boundary_validation.md` の保存後reply / contract境界。
6. `03_cocolon_naming_system.md` / `09_naming_boundary.md` のinternal名とpublic名の分離。
7. `05_cocolon_rule_file_index.md` のPhase0-8 rule / test index。
8. `07_latest_snapshot_diff.md` の最新snapshot差分。
9. 最新実ファイルzip上の対象file。

修正時の確認順:

```text
1. public/RN/DB契約を変えない対象か確認する。
2. ProductQualityEventV1が本文を持たないことを確認する。
3. Measurement Runnerが実入力familyをevent化し、成功扱いではなくblocker分解しているか確認する。
4. Blocker Matrixでowner area / repair policyが出ているか確認する。
5. Generation Repair Designを本文生成修正済みと誤読していないか確認する。
6. Blind QA未実施を機械指標で代替していないか確認する。
7. Release Decision / Validation Planがrolloutやpublic releaseを適用していないか確認する。
```

禁止: Phase0-8 internal materialをpublic response keyへ出す、RN表示条件にする、DB保存物にする、Gate緩和する、fixed templateやA/C/D専用runtime branchを追加する、validation未実行を商品品質到達と扱う。

# 2026-06-05 差分追記: EmlisAI Gate Recovery public surface leak repair P0-P12 を触る時

EmlisAIのGate Recovery、`recover_emlis_gate_failure()`、post-final recovery、`ProductQualityEvent`、Blocker Matrix、RN `passed + commentText` contractを触る時は、次を同時に読む。

1. `00_karen_read_first.md` の Gate Recovery Public Surface Leak Repair P0-P12 追補。
2. `07_latest_snapshot_diff.md` の P0-P12 latest snapshot diff。
3. `02C_cocolon_contract_boundary_validation.md` の Gate Recovery public surface leak repair contract / validation boundary。
4. `05_cocolon_rule_file_index.md` の Gate Recovery public surface leak repair rule / guard索引。
5. 最新実ファイル `emlis_ai_gate_recovery_public_boundary.py` / `emlis_ai_gate_recovery_public_candidate_builder.py` / `emlis_ai_gate_recovery_loop.py` / `emlis_ai_reply_service.py`。

確認すること:

- `phase20_5_gate_recovery_material_surface` / `phase20_13_post_final_gate_recovery_material_surface` がpublic `comment_text` へ昇格していないか。
- low-information回復が `low_information_observation_composer` を通っているか。
- 元Composer候補の再接続が bounded repaired original candidate として扱われているか。
- ProductQuality側に `surface_origin` が入り、表示到達sourceを見ているか。
- RN contractは `observation_status == passed && commentText non-empty` のままか。
- F/E/G実機確認caseを専用route / 専用surface / exact text条件にしていないか。

禁止:

```text
Gate Recovery material surface を仮表示文・fallback文・Emlis観測本文としてpublic表示する。
「今回の入力では...」「原因や結論までは...」「誰かを良い悪いで...」をEmlis観測本文として使う。
表示到達率だけでProductQuality greenにする。
RN側へsurface_origin / blocker / diagnostic_recovery_surface分岐を持ち込む。
validation planを理由にpublic response shape、DB physical schema、release flag、Gate条件を変更する。
```

# 2026-07-20 履歴断面: NLS v3 Step 11 Cycle 001を触る時

読む順:

1. `NLSv3_Step11_Cycle001_rc0031_Session_Handoff_20260720.md`
2. NLS v3 Revised Cycle設計の§18、§20.3、§21.1 / Step 11、§22
3. current RCの設計20.3影響範囲補遺とbody-free receipt
4. immediate predecessorのmachine / Product Read receipt
5. `00_karen_read_first.md` / `01` / `02` / `02C` / `05` / `07`
6. GitHub上の`Cocolon` / `mashos-api` head、predecessor、exact path

開始前check:

- [ ] 両repoのheadを取得したか
- [ ] floating mainではなくpredecessor commitを固定したか
- [ ] local materializationが同じpath / blob / hashか
- [ ] 現在地をStep 11 / Cycle 001と確認したか
- [ ] 前RCのmachine結果とProduct Read結果を分離したか
- [ ] current addendumがscope定義かimplementation authorityかを分けたか
- [ ] E4 / formal / Cycle 002のauthorityがあるか
- [ ] public / DB / RN / Safety / question ownerの非変更を確認したか

current rc0031では§14明示承認前に実装しません。承認後も最初はP1 exact 7 RED + new24だけで、production sourceを編集しません。

# 2026-07-21 差分追記: rc0031 P3 prerequisite consistency後の作業check

読む順:

1. `07_latest_snapshot_diff.md`
2. NLS v3 Revised Cycle設計
3. `NLSv3_Step11_rc0031_P3_PrerequisiteConsistency_Design20_3_Addendum_RED_Handoff_20260721.md`
4. 同Body-free receipt
5. SurfaceGrammar / BodyDimension / FinalInverse補遺
6. VerifiedBaseReuseComposition GREEN handoff / receipt
7. P2 Freeze handoff / receipt

開始前check:

- [ ] P3 exact24を`15 PASS / 9 intentional RED`と確認したか
- [ ] 9 REDの内訳をdimension surface 1 / fixed-slot prefix product contract 1 / final inverse 7と確認したか
- [ ] P2 current treeの1 REDをhistorical path-scopeとsemantic regressionに分けたか
- [ ] P2 forward owner / Catalogのsource-tree存在とproduction runtime未接続を分けたか
- [ ] Product Surface grammarが未解決で、P3 Surface successor実装が未開始だと確認したか
- [ ] 次のauthorityがProduct Surface grammarのdesign-only + Product Readに限定されるか
- [ ] Parser / Matcher / P4 / runtime / manifest / E2以降へ進んでいないか

禁止:

```text
P3 REDを理由にSurface successorを先行実装する。
test-local fixed-slot prefixを商品文法へ昇格する。
historical P2 path-scope REDをsemantic regressionとして修復する。
disconnected source-tree ownerの存在をpublic runtime接続済みと読む。
```

# 2026-08-02 current checklist: Step11 Recovery / GitHub / Work runtime

## NLS v3 Step11 Cycle001 Recovery Epoch001-004

- [ ] 07のEOF側最後の完全なcurrent sectionを解決したか
- [ ] tracked Planとlatest Result / Receipt / Handoffを読んだか
- [ ] rc0031節をhistorical predecessorとして扱い、current next authorityにしていないか
- [ ] Recovery source / tool / test / documentをlive API / DB / RN / production runtimeと分けたか
- [ ] prior epoch / observer / receiptを再parse、reclassify、retry、creditしていないか
- [ ] current terminal、Full R1、inactive next tokenを07 / Planと照合したか

## GitHub reflection / repository visibility / retired Guardian

- [ ] current visibilityをGitHub実測し、historical private記述をcurrentへ持ち上げていないか
- [ ] public visibilityと、Mash承認scope・華恋only writeを混同していないか
- [ ] GitHub反映は`11`の`CURRENT_NORMATIVE_CONTRACT`だけを正本にしたか
- [ ] `12`を`HISTORICAL_NON_NORMATIVE / RETIRED_DISABLED`として読み、Guardianを再起動していないか
- [ ] source参照、相互path、case、manifest entry、current/historical表示を全体監査したか

## Work test-runner continuity / targeted pytest

- [ ] pytest依存なら`13` → rule `16` → rule `09` §Sの順で読んだか
- [ ] historical READY / runtime-not-found断面とcurrent Gate B terminalを分けたか
- [ ] runtime / Gate B / pytest / target invocation counterを混同していないか
- [ ] current authorityが許可しないnetwork、runtime acquisition、fallback、retry、target実行を行っていないか
