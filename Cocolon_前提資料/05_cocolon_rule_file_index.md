---
doc_id: cocolon_rule_file_index
title: "Cocolon ルールファイル索引"
revision_date: "2026-06-01"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
purpose: "見落とすと構造誤読や contract 破壊を起こしやすい rule / policy / guard / test を索引化する"
---

# 1. 先に結論

**rule / policy / contract を持つ変更は、画面や API の見た目より先に rule file を読む。**

# 2. 最重要 rule / policy

| path | 何を拘束するか | いつ必須か |
|---|---|---|
| `mashos-api/ai/docs/API_CONTRACT_POLICY.md` | public API の additive-only / 互換性 / header | public route / request / response を触る時 |
| `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md` | public route 一覧 / version policy | route 追加・置換・削除を触る時 |
| `mashos-api/ai/docs/NATIONAL_ALIGNMENT_AUDIT_PHASE5.md` | RN/API 境界・display-only 原則 | national system と boundary を触る時 |
| `mashos-api/ai/docs/TUTORIAL_STABILITY_REDESIGN.md` | tutorial 測定 / overlay / proxy press | tutorial を触る時 |
| `mashos-api/scripts/check_no_direct_supabase.py` | RN からの direct Supabase / raw fetch 禁止 | frontend data access を触る時 |
| `Cocolon/AppRuntimeContext.js` | `/app/bootstrap` runtime state / feature flag / version gate | 起動制御・機能停止flag・maintenance表示を触る時 |
| `mashos-api/ai/docs/COCOLON_STRUCTURE_UNIFICATION_ADDENDUM_2026_04_21.md` | 三大要素の canonical owner / compat 隔離 / artifact-only 契約 | Piece / Analysis / EmlisAI の本流固定を触る時 |

# 3. contract / regression を守る test 群

- `mashos-api/ai/tests/contract/test_api_contract_registry.py`
- `mashos-api/ai/tests/contract/test_api_contract_headers.py`
- `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
- `mashos-api/ai/tests/contract/test_notice_contracts.py`
- `mashos-api/ai/tests/contract/test_generated_reflection_display_contracts.py`
- `mashos-api/ai/tests/contract/test_mymodel_reflection_display_contracts.py`
- `mashos-api/ai/tests/contract/test_subscription_bootstrap_contracts.py`
- `mashos-api/ai/tests/contract/test_emlis_ai_contracts.py`
- `mashos-api/ai/tests/contract/test_publish_governance.py`
- `mashos-api/ai/tests/contract/test_rn_surface_guards.py`

# 4. current national system で特に重要な code rule

- `AppRuntimeContext.js` は `/app/bootstrap` のRN側runtime boundary。feature flag / version gate / maintenance message を触る時は `api_app_bootstrap.py` と消費screenを同時確認する
- `App.js` は API接続先を `lib/apiClient.js` の `API_BASE_URL` から読む。旧env名をApp.jsへ戻さない
- `home_gateway/*` を通る Home write は route adapter から分岐しない
- `access_policy/*` を使う read-side は route file で tier / visibility を再実装しない
- `startup_snapshot_store.py` と `api_app_bootstrap.py` は startup 断面の中心としてペアで見る
- `lib/api/client.js` / `lib/apiClient.js` は RN boundary の中心として見る
- `piece_public_read_service.py` / `api_nexus.py` / `api_mymodel_qna.py` は Piece public read / compat の owner 契約としてペアで見る
- `report_artifact_read_service.py` は report history/detail の共通 read owner であり、route file で storage/projection fallback を再実装しない
- `emlis_ai_readers.py` / `input_summary_reader.py` / `analysis_summary_reader.py` は EmlisAI reader boundary であり、EmlisAI 側から route file を直接 import しない

# 5. ProfileCreate / legacy 命名まわりの注意

- public 名は `ProfileCreate`
- canonical table 名や legacy text には `mymodel_create_*` が残る
- そのため rename / cleanup をする時は `03` と `01C` の file block を先に見る


# 2026-04-27 差分追記: public contract registry cleanup時の必読セット

public route 追加・置換・deprecated整理を行う場合、次の5件を同時確認する。

1. `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md`
2. `mashos-api/ai/services/ai_inference/api_contract_registry.py`
3. `mashos-api/ai/services/ai_inference/middleware_api_contract.py`
4. `mashos-api/ai/tests/contract/test_api_contract_registry.py`
5. 対象 route handler（今回の差分では `api_emotion_log.py` / `api_nexus.py`）

今回の差分では、route handler 削除ではなく registry / response_model metadata / registry guard の整合だけを行った。legacy route retirement を実施する場合は、RN release boundary と endpoint smoke を別途確認してから行う。

# 2026-04-28 差分追記: 新国家システム / worker / load test rule索引

## 新しく先に読むべき rule / operation / verification files

| path | 何を拘束するか | いつ必須か |
|---|---|---|
| `mashos-api/ai/services/ai_inference/core_contract_registry.py` | 三大中核構造のinput/output/storage/gate/read surface | EmlisAI構造 / 分析構造 / Piece構造を触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_quality_gate.py` | EmlisAI即時応答の品質Gate meta | `/emotion/submit` / immediate reply / capabilityを触る時 |
| `mashos-api/ai/services/ai_inference/analysis_report_validity_gate.py` | 分析成果物の保存可否・診断/断定抑制・domain分離 | Analysis / Self Structure reportを触る時 |
| `mashos-api/ai/services/ai_inference/piece_generation_policy.py` | Piece preview/publishのvisibility/generation/transform/safety/hash | EmotionPiece / Piece公開安全性を触る時 |
| `mashos-api/ai/docs/WORKER_OPERATIONS.md` | worker profile / queue滞留 / stale復旧 / notification worker | 高負荷運用・worker増設を触る時 |
| `mashos-api/ai/docs/LOAD_TESTING.md` | endpoint別負荷試験手順とp95/p99/queue確認 | release前の負荷確認を行う時 |
| `mashos-api/scripts/astor_worker_status.py` | queue stats / stale running recovery / pressure判定 | worker処理能力を確認する時 |
| `mashos-api/scripts/cocolon_load_test.py` | app-bootstrap/startup/home/emotion-submit/piece-preview/mixの負荷試験 | 100人/1000人相当の事前測定を行う時 |
| `mashos-api/ai/services/ai_inference/fcm_push_queue.py` | FCM送信の専用queue化 | 通知・cron・follow・emotion submitのpushを触る時 |

## 新しく守る contract test

- `mashos-api/ai/tests/contract/test_new_national_core_analysis_contracts.py`
- `mashos-api/ai/tests/contract/test_new_national_core_emlis_contracts.py`
- `mashos-api/ai/tests/contract/test_new_national_core_piece_contracts.py`

この3件は、三大中核構造を「機能」ではなく「中核構造」として扱うための最低限のguardである。

# 2026-05-05 差分追記: EmlisAI / Piece 汎用化後のrule索引

## EmlisAI immediate reply で必ず同時確認する rule / guard

| path | 何を拘束するか |
|---|---|
| `emlis_ai_phrase_shaping_service.py` | raw anchorをそのまま出力しない。会話文に入るphraseへ整形する |
| `emlis_ai_input_meaning_block_service.py` | current inputを汎用意味カテゴリへ分解する。例文固有語句をruntime条件にしない |
| `emlis_ai_response_composition_service.py` | 意味ブロックをユーザーが読める順番へ構成する |
| `emlis_ai_reply_final_review_service.py` | 返答前に文法・自然さ・構成・groundingを確認する |
| `emlis_ai_quality_gate.py` | pre-return gate / additive meta / example-specific guardを扱う |
| `emlis_ai_safe_reply_fallback_service.py` | Gate fail時も例文固定文ではなくcurrent inputから返す |

## Piece生成で必ず同時確認する rule / guard

| path | 何を拘束するか |
|---|---|
| `emotion_piece_generation_service.py` | core question / core answer / focus_key / communicative coreを扱う |
| `piece_generated_display.py` | generated answer display / hash / quality flags を扱う |
| `piece_generation_policy.py` | preview/publish safety / visibility / hash契約を扱う |

## 例文特化禁止の扱い

- 入力例はテストケースであり、runtime `if` 条件・固定返答・専用fallbackに使わない。
- 品質Gateは、例文語句が含まれるかではなく、意味カテゴリ・構成・grounding・自然文品質を判定する。
- regression testは、固定正解文ではなく、汎用経路を通っているかを確認する。


# 2026-05-07 差分追記: value observation / overcompression guard索引

| path | 何を拘束するか | いつ必須か |
|---|---|---|
| `mashos-api/ai/services/ai_inference/value_observation_types.py` | value observation schema / signal / plan meta | 三大中核構造の観測信号を触る時 |
| `mashos-api/ai/services/ai_inference/cocolon_value_observation_service.py` | 5 signalの汎用抽出。例文固定返答禁止 | EmlisAI / Piece / Analysisへ観測軸を追加する時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_final_review_service.py` | 内部観測語・責め語・断定語の返答本文流出防止 | EmlisAI本文を変える時 |
| `mashos-api/ai/services/ai_inference/piece_generation_policy.py` | Pieceの過圧縮防止、value observation signal key保持、preview/publish safety | Piece生成・publish契約を触る時 |
| `mashos-api/ai/services/ai_inference/analysis_report_validity_gate.py` | value observation素材のdomain境界と保存可否 | Analysis / Self Structure reportを触る時 |
| `mashos-api/ai/tests/test_cocolon_value_observation_service.py` | signal抽出regression | value observation serviceを変える時 |
| `mashos-api/ai/tests/test_emlis_ai_value_observation_cases.py` | EmlisAI接続regression | EmlisAI pipelineを変える時 |
| `mashos-api/ai/tests/test_emotion_piece_generation_value_observation.py` | Piece value observation / overcompression regression | Piece生成を変える時 |
| `mashos-api/ai/tests/test_analysis_value_observation_boundary.py` | Analysis domain boundary regression | Analysis validity gateを変える時 |


# 2026-05-09 差分追記: rule / contract index補正

| rule領域 | 参照file | 確認内容 |
|---|---|---|
| 今日の問いcontract | `mashos-api/ai/services/ai_inference/api_contract_registry.py` | personal_followup用additive fieldがpublic contractに記録されているか |
| 今日の問いstore | `mashos-api/ai/services/ai_inference/today_question_store.py` | static/personalのslot解決、Premium gate、static fallback、answer保存境界 |
| 原文アンカー安全 | `mashos-api/ai/services/ai_inference/today_question_personal_candidate_service.py` / `today_question_personal_templates.py` | literal anchorだけを表示し、AI解釈をユーザー発言にしない |
| self-only素材 | `mashos-api/ai/services/ai_inference/astor_material_snapshots.py` / `analysis_engine_adapter.py` | personal回答がself_structureへ行き、公開面へ出ないこと |
| 通知worker | `mashos-api/ai/services/ai_inference/api_emotion_submit.py` / `.env.worker.example` | FCM queue/direct/worker profileの境界 |
| DB/rename | `08_cocolon_db_rename_boundary.md` | DB physical name、bridge、write path、rename保留境界 |

# 2026-05-09 差分追記: RN screen split / client observability rule索引

| rule領域 | 参照file | 確認内容 |
|---|---|---|
| RN screen split guard | `Cocolon/tests/rn-screen-contracts.test.js` | entry shellと分割moduleの接続が壊れていないか |
| App root singleton | `Cocolon/navigation/navigationRef.js` | navigationRef singleton / pending notification routeを壊していないか |
| Push route resolver | `Cocolon/navigation/notificationRouting.js` | push通知からInput / Analysis / Piece(EmotionLog)へのroute解決が維持されているか |
| Linking runtime | `Cocolon/navigation/linkingRuntime.js` | share code / public profile linkのAccount遷移が維持されているか |
| Runtime gate | `Cocolon/runtime/AppRuntimeBootstrapGate.js` | `/app/bootstrap`失敗時の監視とruntime gateが維持されているか |
| RN monitoring | `Cocolon/lib/monitoring.js` | token / email / UUID redaction、dedupe、sample rate、best-effort送信が維持されているか |
| API error capture | `Cocolon/lib/apiClient.js` | API失敗captureがrequest / response shapeを変えていないか |
| Client event endpoint | `mashos-api/ai/services/ai_inference/api_client_events.py` | `/ops/client-events` がproduct stateを変更せず、privacy-safe logだけを出すか |
| Client event contract | `mashos-api/ai/tests/contract/test_client_events_contract.py` | endpoint / redaction / registryのcontract regression |
| Public registry | `mashos-api/ai/services/ai_inference/api_contract_registry.py` / `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md` | `ops.client_events.write.v1` がregistry/docsに同期しているか |

# 2026-05-09 差分追記: RN split / production monitoring rule索引

| rule領域 | 参照file | 確認内容 |
|---|---|---|
| RN screen split guard | `Cocolon/tests/rn-screen-contracts.test.js` | entry shellと分割moduleの接続確認。route名変更を防ぐ |
| App root split | `Cocolon/navigation/navigationRef.js` / `notificationRouting.js` / `linkingRuntime.js` / `RootNavigator.js` | navigationRef singleton、push routing、linking、provider順序を守る |
| Runtime gate | `Cocolon/runtime/AppRuntimeBootstrapGate.js` / `AppRuntimeBlockingScreen.js` | `/app/bootstrap`、minimum version block、maintenance表示境界 |
| RN monitoring | `Cocolon/lib/monitoring.js` / `Cocolon/lib/apiClient.js` | client event送信、API failure捕捉、privacy-safe payload整形 |
| Client event endpoint | `mashos-api/ai/services/ai_inference/api_client_events.py` | redaction、user_hash、structured log / alert log、DB保存なし |
| Ops public contract | `api_contract_registry.py` / `PUBLIC_API_REGISTRY.md` / `test_client_events_contract.py` | `/ops/client-events` contractと回帰test |

# 2026-05-09 差分追記: EmlisAI multi-perspective rule / guard索引

EmlisAI本文を触る場合、旧 `quality_gate` だけでなく、multi-perspectiveの各Gateを同時確認する。

| path | 何を拘束するか | いつ必須か |
|---|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_evidence_ledger_service.py` | 原文根拠を表示文へ直結させず `EvidenceSpan` として保持する | 入力読解・根拠抽出を触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_perspective_observers.py` | 複数視点ごとの `PerspectiveReport` を作る | 観測視点・claim/relationを触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_integrator_service.py` | `ObservationGraph` 統合。本文生成禁止層 | 中心状態・葛藤・圧迫・限界・強さの構造を触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_conversation_composer_service.py` | 観測構造を会話文にする | Emlis観測本文の文面生成を触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_listener_reader_judge.py` | 読解可能性、話者整合、会話性を判定する | 出力品質判定を触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_grounding_judge.py` | 各文の根拠対応を判定する | 原文根拠・関係保持を触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_template_echo_guard.py` | 旧テンプレ・復唱・過去出力類似を落とす | 固定文・テンプレ臭対策を触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_display_gate.py` | fail-closed表示判定 | `input_feedback.comment_text` の表示可否を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_multi_perspective_pipeline.py` | multi-perspective pipeline regression | EmlisAI pipeline変更時 |

固定観測文、旧safe fallback、`input_feedback_text_templates` へのEmlis観測本文fallbackを戻さない。

# 2026-05-10 差分追記: EmlisAI Phase8 LimitedComposer品質 rule / guard索引

EmlisAI本文品質を触る場合、Phase8の品質Guardとfixtureを必ず確認する。固定正解文を増やすのではなく、構造保持と禁止表面で品質を守る。

| path | 何を拘束するか | いつ必須か |
|---|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_client.py` | PhraseUnit / ObservationProfile / SentencePlan による B案本文生成。外部AI・固定文テンプレ禁止 | LimitedComposer本文を触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_sentence_quality_guard.py` | 感情ラベル単独行、未完了断片、汎用接続語尾を落とす | 文章品質・Gate条件を触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_observation_scope_service.py` | 本文化してよいscoped graphを切る | eligible / out_of_scope / safety_blocked 条件を触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_template_echo_guard.py` | Phase8 quality reportをTemplate/Echo Gateへ接続する | 破綻表面・復唱・テンプレ臭対策を触る時 |
| `mashos-api/ai/tests/fixtures/emlis_ai_phase8_cases.py` | 7つの実入力回帰fixture | Phase8品質変更時 |
| `mashos-api/ai/tests/test_emlis_ai_phase8_real_input_quality.py` | Phase8本文品質回帰 | Phase8関連変更時 |

禁止: `不安。` / `怒り。` / `喜び。` / `自己理解。` のような本文ラベル行を復活させない。`がつながっています` / `同じ中にあります` をEmlis観測本文の汎用接続として使わない。


# 2026-05-11 差分追記: 共通文章生成基盤 rule / guard索引

三大中核の文章出力品質を触る場合、次を必ず同時確認する。

| rule領域 | 参照file | 確認内容 |
|---|---|---|
| 共通型 / fail-closed | `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/types.py` / `composer.py` / `result.py` | payload不足・候補不足・Guard reject時に空本文へ落ちるか |
| 根拠adapter | `cocolon_text_generation_core/evidence.py` / `adapters/*_evidence_adapter.py` | `span_id` / `source_id` / `field` / `raw_text` / hashが消えないか |
| PhraseUnit / SentencePlan | `phrase_units.py` / `sentence_plan.py` | 中核固有の意味判定を共通側へ持ち込みすぎていないか |
| 共通Guard | `guards/grounding.py` / `japanese_coherence.py` / `template_echo.py` / `overclaim_diagnosis.py` / `must_keep_coverage.py` | 根拠不足、破綻日本語、テンプレ臭、診断・断定、核欠落を落とせるか |
| Emlis接続 | `adapters/emlis_observation_composer.py` / `emlis_ai_limited_composer_client.py` / `emlis_ai_reply_service.py` | `input_feedback.comment_text` と passed-only表示が壊れていないか |
| Piece接続 | `adapters/piece_composer.py` / `piece_composer_input_contract.py` / `emotion_piece_generation_service.py` / `piece_generation_policy.py` | `piece_text`、過圧縮防止、preview/publish同一性が維持されているか |
| Analysis接続 | `adapters/analysis_composer.py` / `analysis_composer_input_contract.py` / `analysis_report_validity_gate.py` / `api_analysis_reports.py` | `content_json` / `standardReport` / `contentText` を維持し、診断・断定をrejectするか |
| 横断境界 | `tests/test_cocolon_text_generation_core_boundary.py` / `tests/test_cocolon_text_generation_core_phase14_final_boundary.py` | 三大中核の目的・名称・表示契約が混ざっていないか |

禁止: 共通基盤を理由に、DB physical name、public API route、既存response key、visible名、RN画面導線を変更しない。Emlisの温度をPiece/Analysisへ流用しない。

# 2026-05-12 差分追記: こころ天気 rule / guard索引

こころ天気を触る時は、Analysisの表示追加として扱い、診断・未来予測・注意報・良悪判定へ寄せない。

| rule領域 | 参照file | 確認内容 |
|---|---|---|
| current_weather生成 | `mashos-api/ai/services/ai_inference/kokoro_weather_service.py` | 今日0:00〜現在の観測、`no_observation`、`20.3°` 表示、観測メモ判定が非診断・非未来予測になっているか |
| home-summary contract | `api_analysis_reads.py` / `test_analysis_home_summary_current_weather.py` | `current_weather` がadditive fieldで、既存 `weekly` / `monthly` / `input_status` を消していないか |
| report kokoroWeather | `api_analysis_reports.py` / `test_analysis_report_kokoro_weather.py` | `content_json.kokoroWeather` が正式表示対象の必須payloadになっており、標準本文・deepReport・publish policyの物理構造を壊していないか |
| RN top/report UI | `KokoroWeatherCurrentCard.js` / `KokoroWeatherForecastStrip.js` / `KokoroWeatherDetailModal.js` / `kokoroWeatherFormatters.js` / `rn-screen-contracts.test.js` | 旧レポートstateやcacheが入っても旧本文を表示せず、表示対象外としてfail-closedするか |
| Phase6 QA | `test_kokoro_weather_phase6_qa.py` | 注意報・警報・未来予測・良悪判定・自己分析こころ天気化が混入していないか |
| Copy / plan | `iapRuntimeCatalog.js` / `subscription_bootstrap_store.py` / `guide/*` / `tutorial/*` | サブスク差分は既存構造を維持し、こころ天気化は感情分析だけに適用されているか |

禁止: `注意報` / `警報` / 未来の危険予測 / 感情の良悪判定 / 自己分析のこころ天気化 / `℃` 表記の復活 / `daily`・`weekly`・`monthly` 内部キーのrename。

# 2026-05-13 差分追記: こころ天気旧レポート非表示 rule / guard索引

| rule領域 | 参照file | 確認内容 |
|---|---|---|
| backend正式表示対象 | `api_analysis_reports.py` / `test_analysis_report_kokoro_weather.py` | `_is_kokoro_weather_report_row` がfull row / projection rowの両方で動き、旧感情分析レポートをfalseにするか |
| ready / detail filter | `api_analysis_reports.py` | ready items、include_body latest、detail API、microcache keyが `kokoro_weather_only` / `kokoro.weather.v1` を前提にしているか |
| weekly-days / unread filter | `api_analysis_reads.py` / `api_report_reads.py` | 旧週レポートのdays補助表示と旧レポート未読バッジを発生させていないか |
| frontend表示対象guard | `kokoroWeatherFormatters.js` / `AnalysisReportHistoryScreen.js` / `AnalysisReportViewerScreen.js` | `isKokoroWeatherReportRecord` を通らないレポートで旧本文・PDF・weekly-days fallbackを出していないか |
| cache namespace | `useAnalysisReportActions.js` / `accountLocalCleanup.js` / `rn-screen-contracts.test.js` | 通常readは `cocolon:kokoroWeatherLatestReport:v1` だけを使い、cleanupは旧新両prefixを削除するか |

禁止: 旧レポート非表示をDB物理削除として実装しない。旧レポート調査・rollbackのため、DB rowは残す。

## 2026-05-13 差分追記: わたしマップ関連 rule / owner 索引

| 作業 | 必ず読むファイル |
|---|---|
| わたしマップ payload 生成 | `mashos-api/ai/services/ai_inference/watashi_map_service.py`, `astor_self_structure_report.py` |
| Free light / tier gate | `api_self_structure.py`, `subscription.py`, `subscription_projection.py`, `test_self_structure_latest_free_light.py`, `test_subscription_self_structure_modes.py` |
| renderer / fallback | `Cocolon/components/selfStructure/WatashiMapRenderer.js`, `watashiMapFormatters.js`, `SelfStructureReportViewerScreen.js` |
| history / detail lock | `SelfStructureReportHistoryScreen.js`, `SelfStructureReportViewerScreen.js`, `watashiMapAccessPolicy.js` |
| copy / tutorial / guide | `guide/guidesJa.js`, `guide/termsJa.js`, `tutorial/tutorialScenarioData.js`, `tutorial/generated/tutorialFixtures.generated.json`, `iapRuntimeCatalog.js`, `subscription_bootstrap_store.py` |
| contract | `api_contract_registry.py`, `mashos-api/ai/tests/contract/test_self_structure_latest_free_light.py`, `Cocolon/tests/rn-screen-contracts.test.js` |

注意: 最新実ファイルでは `components/selfStructure/watashiMapAccessPolicy.js` が存在し、screen import path と一致している。root `components/watashiMapAccessPolicy.js` は同内容の互換copyとして残る。

# 2026-05-15 差分追記: EmlisAI A案到達 Step15-20 rule / guard索引

EmlisAIのStep15-20では、本文を広げるほど、根拠なし補完・固定文復活・履歴補完・A案無条件promotionのリスクが増える。次をrule / guardとして同時確認する。

| rule領域 | 参照file | 確認内容 |
|---|---|---|
| Step15 共通Core安定化 | `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/stabilization.py` / `test_cocolon_text_generation_core_step15_stabilization.py` | 共通形式に寄せてもEmlisの`comment_text`契約・出力目的・DB/API境界が共通Coreへ移っていないか |
| Step16 rollout metrics | `emlis_ai_rollout_metrics_service.py` / `test_emlis_ai_step16_rollout_metrics.py` | attempted / passed / rejected / unavailable / safety_blocked / primary_reason / coverage_group / composer_model が残るか |
| Step17 broad fixtures | `tests/fixtures/emlis_ai_step17_broad_input_cases.py` / `test_emlis_ai_step17_broad_input_fixtures.py` | 正解文一致ではなく、used evidence / coverage / forbidden surface / quality flagsで固定されているか |
| Step18 A-P0 decision | `emlis_ai_ap0_migration_decision_service.py` / `test_emlis_ai_step18_ap0_migration_decision.py` | Green条件未達時にreturn_stepsへ戻し、passed-only metricsだけでA案へ進めていないか |
| Step19 A案相当Composer | `emlis_ai_a_plan_equivalent_composer_service.py` / `test_emlis_ai_step19_a_plan_equivalent_composer.py` | B案Gate、scoped graph、fail-closed、passed-onlyを維持したpromotionか |
| Step20 長期品質 | `emlis_ai_long_term_quality_service.py` / `test_emlis_ai_step20_long_term_quality.py` | 反復文型、距離感drift、history/cross coreの本心補完を検出できるか |
| Template / Echo | `emlis_ai_template_echo_guard.py` | A案相当model markerを許可しても、固定観測文・原文貼り付け・汎用締めを許可していないか |

禁止: `一緒に見ます` などの単独成立固定締め文、role別完成文、fallback観測文、履歴からの本心推定、一般論補完を本文へ戻さない。

# 2026-05-15 差分追記: 限定Composer拡張 Step0-11 rule / guard索引

限定Composer拡張では、表示率を上げるためにGateを緩めず、生成側の根拠束縛・relation・材料品質・surface componentを強くする。次をrule / guardとして同時確認する。

| 領域 | rule / guard owner | 見ること |
|---|---|---|
| 接続状態 | `emlis_ai_limited_composer_extension_baseline.py` / `emlis_ai_composer_client_registry.py` | `composer_client_not_connected` と接続後rejectionを分けられているか。 |
| diagnostic_summary | `emlis_ai_reply_service.py` / `emlis_ai_display_gate.py` | failed_stage、primary_reason、coverage_group、binding_missingがraw入力なしで分かるか。 |
| SentenceBinding | `cocolon_text_generation_core/types.py` / `emlis_ai_limited_composer_client.py` | body文ごとにevidence / phrase / relationが束縛されているか。 |
| PhraseUnit材料 | `emlis_ai_limited_sentence_quality_guard.py` / `emlis_ai_phrase_shaping_service.py` | 未完了断片・助詞残り・感情ラベル単独・長すぎる原文貼り付けを材料段階で落としているか。 |
| relation taxonomy | `emlis_ai_limited_relation_taxonomy.py` | `contrast` / `coexistence` / `pressure` / `recovery` / `approach_avoidance` 等がcanonical relationとして追えるか。 |
| binding-aware Grounding | `emlis_ai_grounding_judge.py` / `cocolon_text_generation_core/guards/grounding.py` | 表面一致だけでunsupportedにせず、declared evidence / phrase / relationを読めているか。 |
| Gate trace | `emlis_ai_display_gate.py` / `emlis_observation_composer.py` | reader / grounding / template / display traceにbinding_usedを残しているか。 |
| Surface Realizer | `emlis_ai_limited_surface_realizer.py` | 固定完成文ではなく、opener / particle / predicate / tailをrelationごとに選ぶか。 |
| scorecard / Exit Gate | `emlis_ai_coverage_matrix_service.py` / `emlis_ai_limited_composer_extension_exit_gate.py` | coverage_group別結果、binding coverage、次タスクが見えるか。 |
| E2E表示契約 | `emlis_ai_limited_composer_e2e_contract.py` / `test_emlis_ai_display_contract.py` | non-passedで `comment_text` が出ないか。 |

禁止: これらのrule / guardを迂回して、固定文や入力専用分岐でpassed率だけを上げる。

# 2026-05-16 差分追記: 完全Composer初期版 Commit1-13 rule / guard索引

Complete Composer初期版では、生成側を広げるほど、根拠なし補完・固定文復活・relation欠落・surface反復・frontend passed補正のリスクが増える。次をrule / guardとして同時確認する。

| scope | rule / guard / test | 確認すること |
|---|---|---|
| AP0 / 呼称meta | `emlis_ai_complete_composer_initial_meta.py`, `test_emlis_ai_complete_composer_initial_commit1.py` | 旧A案名をComplete初期版へ読み替えてもpublic契約を壊していないか。 |
| 内部型 | `emlis_ai_complete_composer_types.py`, `test_emlis_ai_complete_composer_types.py` | `CompleteComposerCandidate` / `SentencePlanV2` / `RepairTrace` が内部型に留まっているか。 |
| Material | `emlis_ai_complete_material_service.py`, `test_emlis_ai_complete_material_service.py` | 根拠不足、未完了断片、感情ラベル単独を材料段階で落としているか。 |
| Focus / Coverage | `emlis_ai_complete_focus_selector.py`, `test_emlis_ai_complete_focus_selector.py` | 全文要約ではなく観測核を選んでいるか。 |
| RelationGraph | `emlis_ai_complete_relation_graph_service.py`, `test_emlis_ai_complete_relation_graph.py` | relation_typeが本文生成前の制約として保持されているか。 |
| SentencePlan | `emlis_ai_complete_sentence_planner.py`, `test_emlis_ai_complete_sentence_plan_v2.py` | 文数・文順・must_include・repair policyがplan化されているか。 |
| Surface | `emlis_ai_complete_surface_realizer.py`, `test_emlis_ai_complete_surface_realizer_v2.py` | 完成文定数ではなく文法部品で組んでいるか。 |
| Grounding | `emlis_ai_complete_grounding_service.py`, `emlis_ai_grounding_judge.py`, `test_emlis_ai_complete_grounding_binding.py` | evidence / phrase / relation bindingを判定し、overclaimを通していないか。 |
| Self-Repair | `emlis_ai_complete_self_repair_service.py`, `test_emlis_ai_complete_self_repair.py` | repairが新規意味追加ではなく、最大2回の安全調整に収まっているか。 |
| Client / registry | `emlis_ai_complete_composer_client.py`, `emlis_ai_composer_client_registry.py`, `test_emlis_ai_complete_composer_client.py` | AP0 green / rollout許可なしでComplete clientを解決していないか。 |
| Reply diagnostics | `emlis_ai_complete_reply_diagnostics_service.py`, `emlis_ai_reply_service.py`, `test_emlis_ai_complete_e2e_contract.py` | diagnostics追加で`comment_text`や`observation_status`を上書きしていないか。 |
| Scorecard | `emlis_ai_complete_scorecard_service.py`, `test_emlis_ai_complete_scorecard.py` | scorecardがQA metaであり、表示判定そのものになっていないか。 |
| RN contract | `Cocolon/tests/rn-screen-contracts.test.js` | Complete metaをfrontendでspecial-caseせず、passed-only表示を守っているか。 |


# 2026-05-16 差分追記: EmlisAI 完全Composer初期版 E2E表示開通 Step0-9 rule / test index

最新基準面 `Cocolon_10(7).zip` / `mashos-api_10(10).zip` では、EmlisAI 完全Composer初期版の通常表示ルートを守るrule / regressionとして次を追加で読む。

| path | 何を拘束するか | いつ必須か |
|---|---|---|
| `mashos-api/ai/tests/test_emlis_ai_complete_initial_entry_ap0.py` | Entry AP0 helperのred/green、raw入力混入禁止、registry fail-closed | complete_initial起動条件、AP0判定、rollout境界を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_complete_initial_entry_route.py` | resolver前diagnostic seed、ap0_decision注入、resolution meta、Final AP0 / scorecard接続 | `emlis_ai_reply_service.py` の通常reply routeを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_complete_initial_step7_integration.py` | AP0 red / rollout red / AP0 green + rollout green / Gate rejected / Gate passed のE2E contract | Complete Composer初期版のE2E開通条件を触る時 |
| `Cocolon/tests/rn-screen-contracts.test.js` | Complete metaがpublic passed-only表示契約を上書きしないこと | RN表示条件、InputFeedback modal、`Emlisの観測` 表示境界を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_complete_initial_step9_fixture_qa.py` | Step9 fixture / QA runのsanitized meta、product scorecard seed、comment_text非書込 | fixture / QA run、scorecard meta、商品品質版scorecard seedを触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_initial_fixture_qa_service.py` | Step9 meta-only集計。raw input / comment_textを混入させず、表示到達・binding・Gate reason・非テンプレ性・安全性を集計する | Product scorecard前のQA集計を読む時 |

この索引の結論:
- 表示率を上げるために Gate を緩めない。
- Complete metaをRN表示条件にしない。
- `passed + comment_text` のpublic契約だけが表示条件。

# 2026-05-16 差分追記: EmlisAI 商品品質版接続 Step0-7 rule / test index

最新基準面 `Cocolon_8(11).zip` / `mashos-api_8(16).zip` では、商品品質版接続 Step0-7 のrule / regressionとして次を追加で読む。

| path | 拘束すること | いつ必須か |
|---|---|---|
| `mashos-api/ai/tests/test_emlis_ai_gate_binding_contract_v2.py` | Gate別 `binding_used` 契約、pre-connection false、Grounding / Display binding-aware true許容 | Gate diagnostic / Display traceを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_complete_product_quality_coverage.py` | Product quality coverage suite、`desire_fear` 正規化、coverage report | coverage_group / scorecard集計を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_complete_grounding_relation_binding_v2.py` | Grounding v2のsentence-level Evidence / PhraseUnit / relation判定 | Grounding / relation bindingを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_complete_surface_variation_v2.py` | surface_signature、same-ending、connector repetition、raw echo guard | Surface Realizer / Template Guardを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_complete_self_repair_v2.py` | reason別repair policy v2 | Self-Repairを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_complete_self_repair_product_quality_v2.py` | meaning_added=false、gate_relaxed=false、evidence/relation preservation | Product quality repair traceを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_complete_tone_engine_v2.py` | TonePolicy / ToneGuardReport、non-diagnostic / non-advice / over-empathy guard | Tone Engine / Surface tone制約を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_complete_product_quality_scorecard.py` | ProductQualityScorecard machine metrics | Step6 scorecard集計を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_complete_product_quality_scorecard_blind_qa.py` | Blind QA rubric / review / aggregate | read_feeling / Blind QAを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_complete_product_quality_connection_e2e.py` | Scorecard metaのreply接続、comment_text非混入、Gate非緩和 | reply diagnostics接続を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_complete_release_ladder_v2.py` | Release ladder criteria / guard / aggregate stage判定 | Release ladder logicを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_complete_release_ladder_connection_e2e.py` | release ladder metaのreply接続、public release未適用 | Step7 reply接続を触る時 |
| `Cocolon/tests/rn-screen-contracts.test.js` | RN passed-only modal display | backend metaが増えた時 |

# 2026-05-17 差分追記: positive_recovery relation_not_expressed rule / test index

positive_recovery の Reader `relation_not_expressed` 修正では、表示率のためにGateを緩めず、relation surface contract と回帰testを同時確認します。

| path | 拘束すること | いつ必須か |
|---|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_relation_surface_contract.py` | Reader / Surface / Self-Repair 共有の relation cue 契約。`関係` 単独pass禁止、recoveryは戻る/回復と前段/負荷/流れのbridgeを要求。 | relation cue、Reader relation判定、recovery markerを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_relation_surface_contract.py` | contract単体。generic / recovery cue検出、raw input非依存、過緩和防止。 | contract語彙を変える時 |
| `mashos-api/ai/tests/test_emlis_ai_listener_reader_relation_surface_contract.py` | Readerがcontract cueを検出して `relation_not_expressed` を解消すること。 | Reader判定を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_listener_reader_relation_not_over_relaxed.py` | relation cueのない候補やgeneric cueだけでrecoveryを通さないこと。 | Reader Gateの安全性を確認する時 |
| `mashos-api/ai/tests/test_emlis_ai_complete_self_repair_positive_recovery_relation.py` | Self-Repair markerが `meaning_added=false` / `relation_ids_preserved=true` / `gate_relaxed=false` を守ること。 | Self-Repair relation markerを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_complete_surface_recovery_relation_line.py` | Surface recovery relation lineがcontract marker / surface_signature / grounding metaを残すこと。 | Surface Realizer recovery表現を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_positive_recovery_relation_diagnostic_connection.py` | `reader_relation_signal_*` / `self_repair_relation_marker_*` がdiagnosticへraw inputなしで接続されること。 | diagnostic_summary / gate traceを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_complete_product_quality_positive_recovery_e2e.py` | positive_recovery E2EでReader `relation_not_expressed` が消え、Gateは緩まないこと。 | E2E / product quality connectionを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_step7_log_cleanup.py` | 一時debug logがdefault offで、raw input / public comment_text本文を出さないこと。 | `emotion_submit_service.py` のログを触る時 |
| `Cocolon/screens/InputScreen.js` | 一時debug console logを削除し、passed-only modal表示契約を維持すること。 | RN Input画面やEmlis観測modalを触る時 |

禁止: `relation_not_expressed` を単純に削除する、`関係` という単語だけでpassさせる、Self-Repairで入力にないprior load/causeを足す、rejected / unavailableをRN表示する。


# 2026-05-17 差分追記: Observation Diagnostic Lockdown rule / test index

最新基準面 `Cocolon_9(9).zip` / `mashos-api_9(9).zip` では、EmlisAI 非表示原因の診断固定rule / regressionとして次を追加で読む。

| rule / test | 拘束すること |
|---|---|
| `emlis_ai_observation_diagnostic_lockdown.py` | backend診断schema、classification、no raw text。 |
| `emlis_ai_observation_diagnostic_compare.py` | backend/RN log parse、join、first divergence。 |
| `emlis_ai_observation_diagnostic_branching.py` | classification別の次工程、touch_files / do_not_touch / repair_allowed。 |
| `inputFeedbackObservationDiagnostics.js` | RN診断はpublic status / text length / modal_openedのみ。diagnostic metaでstatusを補正しない。 |
| `test_emlis_ai_observation_diagnostic_lockdown.py` | 全classificationのfixture固定。 |
| `test_emotion_submit_observation_diagnostic_log.py` | success / exception pathの一行診断とenv opt-in。 |
| `test_emlis_ai_observation_diagnostic_reply_meta.py` | reply metaからcandidate / gate / repairを抽出できること。 |
| `test_emlis_ai_observation_diagnostic_backend_step5.py` | fail-closed、Display contract、dict reason safe extraction。 |
| `test_emlis_ai_observation_diagnostic_compare_step7.py` | 11:35/11:36比較用のparse / join / row / markdown / json。 |
| `test_emlis_ai_observation_diagnostic_branching_step8.py` | 分類別branchと原因修正禁止条件。 |
| `rn-screen-contracts.test.js` | RN診断helper、no forced passed、passed-only modal契約。 |

このrule群は、完全Composer商品品質版の文章改善ではなく、原因分類と次工程固定のための検証基盤です。`passed_displayed` はscorecard候補、`unclassified_non_display` / `unknown_diagnostic_missing` はdiagnostic enrichment対象として扱う。

# 2026-05-17 差分追記: EmlisAI Reader Relation Surface rule / guard索引

Reader Relation Surface Step0-8 を触る場合は、以下を同時確認する。目的は Reader rejected 原因の契約整合であり、表示条件やGate緩和ではない。

| rule / guard | owner | 触る時 |
|---|---|---|
| Greeting policy alignment | `emlis_ai_listener_reader_judge.py`, `emlis_ai_user_address_service.py` | 宛名・敬称・`Emlisです。` の扱いを変える時。 |
| Relation surface contract | `emlis_ai_relation_surface_contract.py`, `emlis_ai_listener_reader_judge.py` | relation cue / marker / strict recoveryを変える時。 |
| Expected relation handoff | `emlis_ai_reply_service.py`, `test_emlis_ai_reply_service_expected_relation_types.py` | Readerへ渡すrelation type抽出を変える時。 |
| Limited reader repair | `emlis_ai_limited_composer_client.py`, `test_emlis_ai_limited_*reader*repair*.py` | limited/A1の previous rejection repair を変える時。 |
| Complete self-repair allowlist | `emlis_ai_complete_composer_client.py`, `emlis_ai_complete_self_repair_service.py` | Complete self-repairへ渡すreasonを変える時。 |
| Diagnostic privacy | `emlis_ai_complete_reply_diagnostics_service.py`, `emlis_ai_observation_diagnostic_lockdown.py` | repair meta / diagnostic_summary / backend logを変える時。 |

禁止: `relation_not_expressed` を単語1つで通す、repairで意味を追加する、raw user input / public comment_text本文をdiagnosticへ出す、RN passed-only契約を変える。

# 2026-05-18 差分追記: EmlisAI ProductGate Measurement Step0-10 rule / test index

ProductGate Measurement Step0-10 を触る場合は、表示率を上げるpatchではなく、測定接続とcontract固定として次を同時確認する。

| rule / guard | owner | 触る時 |
|---|---|---|
| Contract inventory | `emlis_ai_complete_product_quality_measurement_contract_inventory.py`, `test_emlis_ai_complete_product_quality_measurement_contract_inventory_step0.py` | Step0-10の対象/非対象、public contract、Gate非緩和、Exit Gate非releaseを確認する時。 |
| Diagnostic capture / join semantics | `emlis_ai_observation_diagnostic_compare.py`, `test_emlis_ai_observation_diagnostic_compare_step7.py` | backend/RN診断行不足、`display_confirmed`、modal falseを扱う時。 |
| Branching guard | `emlis_ai_observation_diagnostic_branching.py`, `test_emlis_ai_observation_diagnostic_branching_step8.py` | unknown / unclassifiedをdiagnostic enrichmentへ戻す時。 |
| Measurement connection | `emlis_ai_complete_product_quality_measurement_connection.py`, `test_emlis_ai_complete_product_quality_measurement_connection.py` | joined row -> scorecard event、coverage、Blind QA、next action、Exit Gateを扱う時。 |
| Scorecard / Blind QA | `emlis_ai_complete_product_quality_scorecard_service.py`, `test_emlis_ai_complete_product_quality_scorecard.py`, `test_emlis_ai_complete_product_quality_scorecard_blind_qa.py` | display count、coverage group、read_feelingを扱う時。 |
| Release ladder | `emlis_ai_complete_release_ladder_service.py`, `test_emlis_ai_complete_release_ladder_v2.py`, `test_emlis_ai_complete_release_ladder_connection_e2e.py` | coverage不足・Blind QA不足・contract blockerを見る時。 |
| Local tool output | `tools/emlis_observation_product_quality_measurement.py`, `test_emlis_observation_product_quality_measurement_tool_step8.py` | log行からJSON/Markdown reportを出す時。 |
| Regression / Exit Gate | `test_emlis_ai_complete_product_quality_measurement_regression_step9.py`, `test_emlis_ai_complete_product_quality_measurement_exit_gate_step10.py` | public contract / counting semantics / four fixture / Exit Gateを固定する時。 |

禁止: RN passed-only contractを緩める、`/emotion/submit` routeやresponse keyをrenameする、DB physical nameを変える、Gateを緩める、raw入力本文やpublic `comment_text` 本文をreportへ入れる、Exit GateをProduct Gate達成扱いにする。

# 2026-05-20 差分追記: EmlisAI Runtime Surface Quality Step0-12 rule / test index

Runtime Surface Quality Step0-12 を触る場合は、表示文を固定文で良く見せるpatchではなく、meta-only測定・分岐・handoffとして次を同時確認する。

| rule / guard | owner | 触る時 |
|---|---|---|
| Runtime Surface contract inventory | `emlis_ai_runtime_surface_quality_contract_inventory.py`, `test_emlis_ai_runtime_surface_quality_contract_inventory_step0.py` | Step0-12の対象/非対象、public contract、Gate非緩和、handoff-onlyを確認する時。 |
| Runtime source lock | `emlis_ai_runtime_surface_source_lock.py`, `test_emlis_ai_runtime_surface_source_lock_step1.py` | complete_initial / limited / a1_equivalent の実表示由来を扱う時。 |
| Surface signature | `emlis_ai_complete_surface_quality_signature.py`, `test_emlis_ai_complete_surface_quality_signature_step2.py` | connector / predicate / ending / grammar warning / signature hashを扱う時。 |
| Scorecard surface metrics | `emlis_ai_complete_product_quality_scorecard_service.py`, `test_emlis_ai_runtime_surface_scorecard_metrics_step3.py` | surface repeat、grammar warning、template majorをscorecardへ接続する時。 |
| Coverage runtime baseline | `emlis_ai_runtime_surface_coverage_baseline.py`, `test_emlis_ai_runtime_surface_coverage_baseline_step4.py` | 7coverage group、coverage_group_missing、surface diversityを扱う時。 |
| Branch resolver | `emlis_ai_complete_surface_quality_branching.py`, `test_emlis_ai_runtime_surface_quality_branching_step5.py` | runtime / grounding / grammar / surface / tone / QA の次branchを決める時。 |
| Complete runtime activation | `emlis_ai_runtime_surface_complete_activation_branch.py`, `test_emlis_ai_runtime_surface_complete_activation_branch_step6.py` | AP0 / rollout / registry / source-lock alignmentを確認する時。 |
| Surface Realizer 2.1 Anti-Template | `emlis_ai_complete_surface_realizer_anti_template.py`, `test_emlis_ai_runtime_surface_realizer_anti_template_step7.py` | 固定完成文なしでopening / connector / predicate / endingを分散する時。 |
| PhraseUnit Grammar Normalizer | `emlis_ai_phrase_unit_grammar_normalizer.py`, `test_emlis_ai_runtime_surface_phrase_unit_grammar_normalizer_step8.py` | 不自然な名詞化・助詞残り・未完了句を材料段階で扱う時。 |
| Tone Engine 2.1 | `emlis_ai_runtime_surface_tone_engine_2_1.py`, `test_emlis_ai_runtime_surface_tone_engine_2_1_step9.py` | 診断化・命令・慰めすぎ・距離感崩れ・read feeling境界を扱う時。 |
| Surface-aware Self-Repair | `emlis_ai_runtime_surface_self_repair.py`, `test_emlis_ai_runtime_surface_self_repair_step10.py` | surface reasonを意味追加なしでrepair targetへ変換する時。 |
| Blind QA / Long-run | `emlis_ai_runtime_surface_blind_qa_long_run.py`, `test_emlis_ai_runtime_surface_blind_qa_long_run_step11.py` | Blind QA候補、rating-only、signature diversityを扱う時。 |
| Exit Gate | `emlis_ai_runtime_surface_exit_gate.py`, `test_emlis_ai_runtime_surface_exit_gate_step12.py` | handoff-only、release blockers、coverage gaps、QA gapsを扱う時。 |

禁止: RN passed-only contractを緩める、`/emotion/submit` routeやresponse keyをrenameする、DB physical nameを変える、Gateを緩める、raw入力本文やpublic `comment_text` 本文をreportへ入れる、Exit GateをProduct Gate達成扱いにする。

# 2026-05-21 差分追記: EmlisAI 観測返答 Step0-14 rule / test index

Observation Reply Step0-14 を触る場合は、表示率を上げるpatchではなく、観測返答branch / boundary / QA / handoff固定として次を同時確認する。

| rule / test領域 | file | いつ見るか |
|---|---|---|
| Reply contract | `emlis_ai_observation_reply_contract.py`, `test_emlis_ai_observation_reply_contract.py` | public statusを増やさずreply kindをmetaで扱うか確認する時。 |
| Current display contract | `test_emlis_ai_observation_current_display_contract.py` | `passed + comment_text` の表示契約を守っているか確認する時。 |
| Eligibility Router | `emlis_ai_observation_eligibility_service.py`, `test_emlis_ai_observation_eligibility_service.py` | 短文/長文曖昧入力のroutingを触る時。 |
| User Fact Boundary | `emlis_ai_user_fact_grounding_boundary.py`, `test_emlis_ai_user_fact_grounding_boundary.py` | Free / subscription / explicit / implicit / no-promotion境界を触る時。 |
| Internal Question | `emlis_ai_internal_question_service.py`, `test_emlis_ai_internal_question_service.py` | 推論深度1-3、答えられる問い/答えられない問いを触る時。 |
| Observation Dictionary | `config/emlis_observation_dictionary.*`, `emlis_ai_observation_dictionary_loader.py` | 観測語彙・質問語彙・禁止signatureを触る時。 |
| Material Connector | `emlis_ai_observation_material_connector.py`, `test_emlis_ai_observation_material_connector.py` | Complete Material / Focus / Relation層へ観測metaを流す時。 |
| SentencePlan Roles | `emlis_ai_observation_sentence_plan_roles.py`, `test_emlis_ai_observation_sentence_plan_roles.py` | 既存line_roleを壊さず観測role metaを付与する時。 |
| Low Information Composer | `emlis_ai_low_information_observation_composer.py`, `test_emlis_ai_low_information_observation_composer.py` | 低情報観測本文候補と質問を触る時。 |
| Surface / Tone | `emlis_ai_observation_surface_realizer_tone.py`, `emlis_ai_observation_surface_realizer.py`, `test_emlis_ai_observation_surface_realizer_tone.py` | question ending、Tone、Template Guard連携を触る時。 |
| Display / Repair | `emlis_ai_observation_display_repair_integration.py`, `emlis_ai_display_gate.py`, `emlis_ai_reply_service.py`, `test_emlis_ai_observation_display_repair_integration.py` | 低情報観測を `passed + comment_text` に接続する時。ただし rollout / pre-connection / 非修復candidate rejection を表示化しない境界も同時確認する。 |
| RN optional meta | `inputFeedbackModel.js`, `inputFeedbackObservationDiagnostics.js`, `rn-screen-contracts.test.js`, `test_emlis_ai_observation_rn_optional_meta_contract.py` | RN表示条件を変えずoptional metaだけ読む時。 |
| Scorecard / Blind QA | `emlis_ai_observation_scorecard_blind_qa.py`, `test_emlis_ai_observation_scorecard_blind_qa.py` | always display / false eligible / overclaim / template反復を測る時。 |
| Regression Fixture | `emlis_ai_observation_regression_fixture_coverage.py`, `test_emlis_ai_observation_regression_fixture_coverage.py` | 低情報・eligible・Free/サブスク境界coverageを触る時。 |
| Exit Gate / Handoff | `emlis_ai_observation_exit_gate_handoff.py`, `test_emlis_ai_observation_exit_gate_handoff.py` | handoff-onlyの合否・rollback条件を触る時。 |
| Step10 Repair Boundary | `emlis_ai_observation_display_repair_integration.py`, `emlis_ai_reply_service.py`, `test_emlis_ai_phase7_staged_release.py`, `test_emlis_ai_display_contract.py` | Phase7 rollout block / composer pre-connection rollout stop / release gate block / 非修復AI-generated rejectionを低情報repairで表示化しない境界を触る時。 |

# 2026-05-21 差分追記: Emlis観測専用辞書 Phase0-5 guard索引

Emlis観測専用辞書や `current_input` の読み方を触る時は、既存のAPI contract policyに加えて、次を同時確認する。

| path | 何を拘束するか | いつ必須か |
|---|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_current_input_bundle.py` | `memo` / `memo_action` / `emotion_details` / `category` の内部正規化境界 | `/emotion/submit` current_inputやEmlisAI入力束を触る時 |
| `mashos-api/ai/services/ai_inference/config/emlis_observation_structure_dictionary.schema.json` | 構造観測辞書の実装schema | Emlis観測専用辞書のjsonを触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_dictionary_loader.py` | schema validation、参照整合、forbidden inference、contract drift flag | 辞書loader / validator / relation参照を触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_material_service.py` | 構造辞書からGate / Composerへ渡すtext-free material | entry / relation / unknown slot / category overlapを触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_connection_service.py` | Gate / Composer connection reportとpublic contract drift防止 | Gate / Composer接続metaを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_observation_structure_phase5_fixtures_blind_qa.py` | 7fixture、Blind QA、raw text非混入、contract維持 | Emlis観測専用辞書の品質境界を変更する時 |

禁止: 構造辞書やfixtureの追加を、public `comment_text` 生成、RN表示条件変更、DB physical rename、Product Gate達成宣言として扱わない。

# 2026-05-22 差分追記: Emlis観測専用辞書 ActionConversion / UnformedSelfInsight Phase0-8 guard索引

Emlis観測専用辞書の ActionConversion / UnformedSelfInsight 実装、または `言えなかった` / `合わせた` / `我慢した` / `わからない` の観測接続を触る時は、既存のAPI contract policyとPhase0-5 guardに加えて、次を同時確認する。

| path | 何を拘束するか | いつ必須か |
|---|---|---|
| `mashos-api/ai/services/ai_inference/config/emlis_observation_structure_dictionary.v1.json` | 追加relation / entry、allowed / forbidden inference、surface_policy | 構造観測辞書JSONを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_observation_structure_dictionary_schema.py` | `19 relations / 18 entries`、schema互換、surface dictionary分離 | schema / 辞書数 / relation参照を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_observation_structure_dictionary_loader.py` | 追加input word選択、low_information_boundary、entry / relation select | loader / selectorを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_observation_structure_phase4_connection.py` | 単語だけで強接続しないrelation、差分根拠が必要なrelation | material / connection serviceを触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_material_service.py` | text-free material、public contract drift flag、原因補完 / 人格傾向禁止flag | Gate / Composer material metaを触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_connection_service.py` | connection / composer meta、辞書完成文禁止、public contract非変更flag | Gate / Composer接続metaを触る時 |
| `mashos-api/ai/tests/fixtures/emlis_ai_observation_structure_phase5_cases.py` | 追加6caseの expected / forbidden relation | Blind QA fixtureを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_observation_structure_phase6_forbidden_inference_meta_contract.py` | forbidden inference / raw input / comment_text / completed reply非混入 | meta-only contractを触る時 |

禁止: `我慢した` から本音内容・相手のため・自己犠牲を補完する、`合わせた` から主体性喪失を断定する、`言えなかった` から相手原因を補完する、`わからない` を low informationだけに潰す、辞書から完成返答文やpublic `comment_text` を返す。



# 2026-05-23 差分追記: EmlisAI Runtime Surface Pre-Return Gate + Shallow V2 Step0-10 rule / test index

Runtime Surface Pre-Return Gate + Shallow Surface Realizer V2 Step0-10 を触る場合は、テンプレ文を足して見た目だけ直すpatchではなく、表示前surface gate / phrase unit guard / Shallow V2 / low-information specificity / bounded repair / diagnostics / exit criteriaとして次を同時確認する。

| rule / guard | owner | 触る時 |
|---|---|---|
| Deployment dependency | `services/ai_inference/requirements.txt` | `jsonschema>=4.21.1` を外すと構造辞書schema validationが fail-closed する可能性がある。 |
| Runtime Surface Pre-Return Gate | `emlis_ai_runtime_surface_pre_return_gate.py`, `test_emlis_ai_runtime_surface_pre_return_gate.py` | 表示前surface fatal、meta-only schema、action contractを触る時。 |
| Display path connection | `emlis_ai_display_gate.py`, `emlis_ai_reply_service.py`, `test_emlis_ai_runtime_surface_pre_return_gate_step2.py` | blocked候補が `passed + comment_text` にならないことを確認する時。 |
| Malformed Nominalization Guard | `emlis_ai_limited_sentence_quality_guard.py`, `emlis_ai_phrase_unit_grammar_normalizer.py`, `test_emlis_ai_malformed_nominalization_phrase_unit_guard.py` | 壊れた `〜こと`、DROP / DEFER / safe rephraseを触る時。 |
| Shallow phrase unit guard | `emlis_ai_limited_composer_client.py`, `test_emlis_ai_shallow_phrase_unit_guard_step4.py` | shallow pathでgeneric phraseを作る時。 |
| Shallow Surface Realizer V2 | `emlis_ai_limited_composer_client.py`, `test_emlis_ai_shallow_surface_realizer_v2_step5.py` | `中心/その中でも` 骨格やconnector / predicate反復を触る時。 |
| Low Information Specificity | `emlis_ai_low_information_observation_composer.py`, `emlis_ai_observation_surface_realizer_tone.py`, `test_emlis_ai_low_information_specificity_policy_step6.py` | 低情報入力でsafe anchorを使うか、質問endingを保持するかを触る時。 |
| Bounded repair / reroute | `emlis_ai_bounded_repair_reroute.py`, `test_emlis_ai_bounded_repair_reroute_step7.py` | surface failure時のrerender / reroute / fail_closedを触る時。 |
| Diagnostics / Scorecard | `emlis_ai_complete_reply_diagnostics_service.py`, `emlis_ai_complete_scorecard_service.py`, `test_emlis_ai_diagnostics_scorecard_step8.py`, `test_emlis_ai_runtime_surface_diagnostics_scorecard_step8.py` | runtime surface gate結果をdiagnostics / scorecardへ渡す時。 |
| Regression / QA / Lockdown | `emlis_ai_observation_diagnostic_lockdown.py`, `test_emlis_ai_runtime_surface_regression_qa_step9.py`, `test_emlis_ai_observation_diagnostic_lockdown_surface_gate_step9.py` | Render-visible lockdown分類やred fixture regressionを触る時。 |
| Exit criteria | `emlis_ai_runtime_surface_exit_criteria.py`, `test_emlis_ai_runtime_surface_exit_criteria_step10.py` | 実機ログで見るべきpass/fail基準を触る時。 |

禁止: RN passed-only contractを緩める、`/emotion/submit` routeやresponse keyをrenameする、DB physical nameを変える、Display Gate / Grounding / Template Guardを緩める、壊れたsurfaceをlow-informationで覆って表示する、raw入力本文やpublic `comment_text` 本文をdiagnostics / scorecard / lockdownへ入れる。


# 2026-05-24 差分追記: EmlisAI public feedback meta boundary / timeout recovery / low-information prompt / notification uuid boundary

EmlisAI public feedback meta boundary / timeout recovery / low-information質問surface / notification uuid boundaryを触る場合は、次のrule / testを同時確認する。

| rule / guard / test | owner | 触る時 |
|---|---|---|
| Public feedback meta sanitizer | `emlis_ai_public_feedback_meta.py`, `test_emlis_ai_public_feedback_meta.py` | `input_feedback.emlis_ai` に残すkey、raw非混入、hard byte limit、fail-closed unavailable metaを触る時。 |
| Submit service internal/public split | `emotion_submit_service.py`, `test_emotion_submit_observation_diagnostic_log.py` | diagnostic log / lockdown用internal metaとpublic response metaの分離を触る時。 |
| Public response inclusion | `api_emotion_submit.py`, `home_gateway/emotion_reflection_publish_service.py`, `test_emotion_reflection_publish_public_feedback_contract.py`, `test_emotion_submit_public_feedback_meta_boundary.py`, `contract/test_emlis_ai_contracts.py` | `input_feedback` を返す条件、route response肥大化防止、raw非混入を触る時。 |
| RN timeout recovery | `emotionSubmitApi.js`, `InputScreen.js`, `rn-screen-contracts.test.js` | `/emotion/submit` timeout、保存失敗文言、Home再読込、draft保持を触る時。 |
| Low-information prompt surface | `emlis_ai_low_information_observation_composer.py`, `emlis_ai_observation_surface_realizer_tone.py`, `emlis_ai_observation_display_repair_integration.py`, `config/emlis_observation_dictionary.v1.json` | `詳しく残せそうなら、〜残してみませんか。` 系の質問surface、旧 `よければ、何がありましたか。` 禁止を触る時。 |
| Notification uuid boundary | `api_emotion_submit.py`, `test_emotion_submit_notification_settings_uuid_boundary.py` | `owner_user_id` uuid filter、`__global_emotion_notifications__` / `__global_friend_notifications__` の扱いを触る時。 |

禁止: public meta削減を理由にRN表示条件を変える、EmlisAIを固定テンプレ共感文へ戻す、Display Gateを緩める、notification warning対応としてDB schemaやwrite pathを勝手に変える。


# 2026-05-24 差分追記: EmlisAI Visible Surface Acceptance QA Step0-8 rule / test index

Visible Surface Acceptance QA Step0-8 を触る場合は、Runtime Surface Gateだけでなく、表示文QA inventory、Visible Surface Acceptance Gate、reply path、low-information tone profile、public meta sanitizer、RN contractを同時確認する。

| rule / guard / test | owner | 触る時 |
|---|---|---|
| Visible Surface QA inventory | `tests/fixtures/emlis_ai_visible_surface_acceptance_fixtures.py`, `test_emlis_ai_visible_surface_acceptance_inventory_step0.py` | スクショ由来のred / repair_required / pass / out_of_scopeを触る時。 |
| `たりこと` malformed nominalization | `emlis_ai_phrase_unit_grammar_normalizer.py`, `emlis_ai_limited_sentence_quality_guard.py`, `test_emlis_ai_malformed_nominalization_phrase_unit_guard.py` | `たりこと` / `したりこと` / safe `したりすること` の境界を触る時。 |
| Runtime Surface Pre-Return接続 | `emlis_ai_runtime_surface_pre_return_gate.py`, `test_emlis_ai_runtime_surface_pre_return_gate.py`, `test_emlis_ai_runtime_surface_pre_return_gate_step2.py` | comment_text表面の `たりこと` 検出やmalformed countを触る時。 |
| Visible Surface Acceptance Gate | `emlis_ai_visible_surface_acceptance_gate.py`, `test_emlis_ai_visible_surface_acceptance_gate.py` | 中心感情/本文冒頭焦点、bridge、positive-only over-burden、meta-only reportを触る時。 |
| Reply path / Display Gate connection | `emlis_ai_reply_service.py`, `emlis_ai_display_gate.py`, `emlis_ai_observation_display_repair_integration.py`, `test_emlis_ai_visible_surface_acceptance_reply_path_step4.py` | red / repair_required / block / fail_closedをpublic表示前fail-closedへ接続する時。 |
| Low-information tone profile | `emlis_ai_low_information_observation_composer.py`, `emlis_ai_observation_surface_realizer_tone.py`, `test_emlis_ai_low_information_tone_profile_step5.py` | positive_only / negative_only / mixed / self_insight / neutral_or_unknown のtoneを触る時。 |
| Public meta sanitizer | `emlis_ai_public_feedback_meta.py`, `test_emlis_ai_public_feedback_meta.py`, `test_emotion_submit_public_feedback_meta_boundary.py` | `visible_surface_acceptance_gate` summary、raw非混入、public hard byte limit、blocking時feedback非返却を触る時。 |
| RN contract | `Cocolon/tests/rn-screen-contracts.test.js` | `Emlisの観測`、`選択した感情：`、`中心として見ている感情：`、`passed + comment_text` 表示条件を触る時。 |
| Dictionary loader regression stability | `emlis_ai_observation_structure_dictionary_loader.py`, `test_emlis_ai_observation_structure_dictionary_loader.py`, `test_emlis_ai_observation_structure_dictionary_schema.py` | `jsonschema` eager import、schema subset validation、pytest collection実行性を触る時。 |

禁止: visible gate metaだけでRN表示可否を決める、public metaへcomment_text本文やraw inputを入れる、`Userさん` をaccount name由来なのに赤ケース扱いする、positive_onlyで根拠なく重さ系へ寄せる、Display Gate / Grounding / Template Guardを緩める。


# 2026-05-25 差分追記: EmlisAI Product Visible Surface Reliability + Koto Splice Repair rule / test index

Product Visible Surface Reliability + Koto Splice Repair Step0-8 を触る場合は、Visible Surface Gateだけでなく、PhraseUnit / Limited Guard、Runtime Surface Gate、Shallow Surface Realizer V2、bounded repair reroute、public meta / diagnostic summary、RN contractを同時確認する。

| rule / guard / test | owner | 触る時 |
|---|---|---|
| Koto splice fixture inventory | `tests/fixtures/emlis_ai_visible_surface_acceptance_fixtures.py`, `tests/fixtures/emlis_ai_runtime_surface_red_fixtures.py`, `test_emlis_ai_visible_surface_acceptance_inventory_step0.py` | A/B/C/表示なしfixture、expected classification、runtime red fixtureを触る時。 |
| PhraseUnit / Limited Guard | `emlis_ai_phrase_unit_grammar_normalizer.py`, `emlis_ai_limited_sentence_quality_guard.py`, `test_emlis_ai_malformed_nominalization_phrase_unit_guard.py` | `malformed_nominalization_conditional_fragment`、`malformed_nominalization_prediction_noun_fragment`、`residual_koto_splice_fragment`、`long_clause_koto_attachment_risk` を触る時。 |
| Runtime Surface Gate | `emlis_ai_complete_surface_quality_signature.py`, `emlis_ai_runtime_surface_pre_return_gate.py`, `test_emlis_ai_runtime_surface_pre_return_gate.py`, `test_emlis_ai_complete_surface_quality_signature_step2.py` | `koto_splice_detected` / `koto_splice_codes` / `surface_malformed_nominalization_codes` を触る時。 |
| Visible Surface Acceptance Gate | `emlis_ai_visible_surface_acceptance_gate.py`, `test_emlis_ai_visible_surface_acceptance_gate.py` | C red、B repair_required、relation skeleton / analytic register分類を触る時。 |
| Shallow Surface Realizer V2 safety | `emlis_ai_relation_surface_contract.py`, `emlis_ai_limited_composer_client.py`, `test_emlis_ai_relation_surface_contract.py`, `test_emlis_ai_limited_composer_client.py` | `PhraseSurfaceShapeSignal`、`compress_phrase_for_relation_surface(...)`、`phrase + こと` 直結禁止を触る時。 |
| bounded repair reroute | `emlis_ai_bounded_repair_reroute.py`, `emlis_ai_reply_service.py`, `test_emlis_ai_bounded_repair_reroute_step7.py` | Visible Gate `rerender_surface`、`surface_rerender_allowed`、`visible_surface_rerender_allowed`、one-shot rerenderを触る時。 |
| public meta / diagnostic summary | `emlis_ai_public_feedback_meta.py`, `emotion_submit_service.py`, `emlis_ai_observation_diagnostic_lockdown.py`, `test_emlis_ai_public_feedback_meta.py`, `test_emotion_submit_public_feedback_meta_boundary.py`, `test_emotion_submit_observation_diagnostic_log.py` | `display_absence_summary`、`candidate_blocked_koto_splice`、`candidate_repair_failed`、raw非混入を触る時。 |
| RN contract | `Cocolon/tests/rn-screen-contracts.test.js` | diagnostic meta / visible gate meta / candidate_comment_text / raw_input が表示条件を開かないことを触る時。 |

禁止: visible gate / diagnostic metaだけでRN表示する、public metaへ本文を入れる、Display Gate / Grounding / Template Guardを緩める、fixed fallback良文を入れる、`/emotion/submit` route / response key / DB write pathを変える。

# 2026-05-25 差分追記: 環境状態出力観測構造 rule / test index

環境状態出力観測構造を触る場合は、Cocolonが既に取得している `category` / `memo_action` / `emotion_details` / `memo` / `created_at` を、文章単体ではなく「環境ラベル × 状態ラベル × 出力内容」の観測単位として読む。Phase9時点では、current input bundle接続、単発観測frame builder、EmlisAI observation structure material / connection / Display Gate traceへのsafe projection接続、EmlisObservationComposerでの単発観測限定利用、PieceComposerへの過圧縮防止接続、Analysis向け期間再出現material、AnalysisComposer表示接続、横断境界テストまで実装済み。さらにEmlisAI ESO surface contract completionにより、単発観測scope marker補完、forbidden surface claim拒否、runtime二重確認、public meta境界、回帰補正がbackend内部品質境界として固定されている。

| rule / guard / test | owner / 候補 | 触る時 |
|---|---|---|
| Phase0正本設計書 | `cocolon_environment_state_output_observation_structure_design_2026_05_25.md` | この構造の定義、実装順、json/schema案、禁止境界を確認する時。 |
| current input bundle境界 | `emlis_ai_current_input_bundle.py`, `test_emlis_ai_current_input_bundle.py` | `memo` / `memo_action` / `emotion_details` / `category` / `created_at` を内部bundleへ読む時。 |
| 単発観測frame builder | `cocolon_environment_state_output_frame.py`, `test_cocolon_environment_state_output_frame.py` | `EmlisCurrentInputBundle` から `environment_state_output_frame` を作る時。Phase3で内部実装済み。完成文・public response・schema実ファイルは作らない。 |
| EmlisAI observation material接続 | `emlis_ai_observation_structure_material_service.py`, `emlis_ai_observation_structure_connection_service.py`, `emlis_ai_display_gate.py`, `test_emlis_ai_observation_structure_phase4_connection.py`, `test_emlis_ai_observation_structure_phase6_forbidden_inference_meta_contract.py` | `environment_state_output_frame` safe projectionをGate / Composer参照materialへ渡す時。Phase4で内部接続済み。完成文・public text・raw inputは返さない。 |
| EmlisAI単発観測限定利用 | `emlis_ai_observation_structure_material_service.py`, `emlis_ai_conversation_composer_service.py`, `emlis_ai_limited_composer_client.py`, `emlis_ai_runtime_surface_pre_return_gate.py`, `emlis_ai_display_gate.py`, `test_emlis_ai_observation_structure_phase5_limited_use.py`, `test_emlis_ai_observation_current_display_contract.py` | `environment_state_output_frame` を表示文に使う時。Phase4 safe projection内の `output_theme_candidates` はraw textを含まないtheme id / evidence idsとして扱い、Limited Composerでは安全なtheme unitとscope markerに限定する。必ず「今回の入力では」等の単発観測範囲に限定し、傾向・性格・原因・回復方法として出さない。Phase5で内部実装済み。 |
| Piece過圧縮防止 | `piece_environment_state_output_guard.py`, `piece_composer.py`, `piece_composer_input_contract.py`, `emotion_piece_generation_service.py`, `test_piece_environment_state_output_phase6.py` | 環境・状態・出力条件を削りすぎてPieceの核が潰れないか見る時。Phase6で `environment_state_output_frame` からPiece用must_keep signalを作り、ユーザー主体の一問一答で核を保持する。ただしEmlis調・Analysis傾向化・入力にない結論追加はしない。 |
| Analysis期間再出現 | `cocolon_text_generation_core/adapters/analysis_environment_state_output_material.py`, `test_analysis_environment_state_output_phase7.py` | Phase7で保存済みrecordsからsafe frame projectionを作り、`conditional_output_tendency` / `recovery_label_path` を内部materialとして設計する時。public Analysis textにはまだ接続しない。 |

禁止:

- categoryを原因にしない。
- emotion strengthを原因にしない。
- 1件の入力から傾向・人格・性格を作らない。
- recovery_label_pathを治療・処方・回復方法として表示しない。
- Analysisで「あなたはこういう人です」と言わない。
- Pieceで「不安です」だけへ潰すような過圧縮をしない。
- EmlisAIを完成文テンプレや固定共感文へ戻さない。
- Phase4 safe projectionを理由にDisplay Gateを緩めない。
- Phase5の表示利用では、scope markerなしで `environment_state_output_frame` を使わない。
- 1件入力から「いつも」「傾向」「タイプ」「原因」「回復方法」へ表面化しない。
- `environment_state_output_frame` をpublic response keyとして追加しない。
- `/emotion/submit` route、response key、DB write path、RN表示条件を変更しない。


# 2026-05-25 差分追記: 環境状態出力観測構造 Phase6 PieceComposer 過圧縮防止 rule / test index

Phase6で、`environment_state_output_frame` をPieceComposerへ接続する。ただし接続目的は、Piece本文をEmlisの観測文に寄せることではなく、公開可能な問いと答えへ整える過程で「環境・状態・出力条件」を削りすぎてユーザーの核を潰さないようにすることに限定する。

| rule / guard / test | owner | 拘束内容 |
|---|---|---|
| Piece ESO guard | `cocolon_text_generation_core/adapters/piece_environment_state_output_guard.py` | `environment_state_output_frame` から `eso_environment:*` / `eso_state:*` / `eso_output:*` のmust_keep signalを内部生成する。raw `memo` / `memo_action` 本文は返さない。 |
| Piece input contract | `cocolon_text_generation_core/adapters/piece_composer_input_contract.py` | Pieceの `must_keep_signal_keys` / `source_claims` / `overcompression_risk` へPhase6 guardを接続する。preview / publish同一性を壊さない。 |
| PieceComposer runtime | `cocolon_text_generation_core/adapters/piece_composer.py` | runtime plan / safety policy / common core guardへPhase6 guard metaを渡す。Emlis voice、Analysis period tendency、原因化、人格化、回復処方は禁止。 |
| Emotion Piece preview | `emotion_piece_generation_service.py` | core planがない場合にのみ、環境・状態・出力条件を保つpreview文へ補助する。Pieceはユーザー主体の一問一答であり、Emlisの話しかけ文ではない。 |
| Phase6 regression | `test_piece_environment_state_output_phase6.py` | 「仕事 × 不安 × 継続不安」を「不安です」だけに潰さないこと、state-only過圧縮をcommon coreでrejectすること、guardがraw textを含まないことを固定する。 |

禁止: `environment_state_output_frame` をpublic response keyへ出す、raw `memo` / `memo_action` をguard materialへ入れる、PieceをEmlis調にする、Analysisの期間傾向として出す、categoryを原因にする、emotion strengthを原因にする、1件入力から人格・性格・タイプを作る、入力にない解決策や結論を足す。


# 2026-05-25 差分追記: 環境状態出力観測構造 Phase7 Analysis向け傾向material 内部設計 rule / test index

Phase7では、`environment_state_output_frame` をAnalysisのpublic表示へ接続せず、保存済みrecordsから期間内再出現を見るための内部materialを設計・実装する。EmlisAIの単発観測文やPieceのmust_keep guardを流用せず、Analysisでは「この期間の記録では」という期間限定表現へ将来接続できる材料だけを保持する。

| rule / guard / test | owner | 拘束内容 |
|---|---|---|
| Analysis ESO period material | `cocolon_text_generation_core/adapters/analysis_environment_state_output_material.py` | 保存済みrecordsからtext-free safe frame projectionを作り、`conditional_output_tendency` と `recovery_label_path` を内部materialとして生成する。raw `memo` / `memo_action` 本文は返さない。 |
| conditional output tendency | `analysis_environment_state_output_material.py` | 同じ環境・状態・出力themeが期間内で再出現した場合だけ `recurrence_candidate` / `period_tendency_candidate` 等にする。1件入力をperiod tendencyにしない。 |
| recovery label path | `analysis_environment_state_output_material.py` | 状態が重い入力から、自己理解・平穏・安心等へ移る隣接recordを sequence observation として扱う。治療・処方・回復方法にはしない。 |
| domain boundary | `analysis_environment_state_output_material.py` | emotion log由来の `category` / `memo_action` は環境材料として許可するが、`text_primary` / `role_hint` 等のself-structure source material混入はrejected_sourcesへ隔離する。 |
| Phase7 regression | `test_analysis_environment_state_output_phase7.py` | 期間再出現material、1件傾向化禁止、回復経路処方禁止、self-structure素材混入拒否、summary meta-only / raw text非混入を固定する。 |

禁止: Phase7 materialからpublic Analysis本文を作る、Analysis content payload / standardReport / contentTextを変更する、json/schema実ファイル化する、categoryを原因にする、emotion strengthを原因にする、1件入力から傾向・人格・性格・タイプを作る、recovery_label_pathを治療・処方・回復方法として出す、感情分析materialとself-structure素材を混ぜる。


# 2026-05-25 差分追記: 環境状態出力観測構造 Phase8 AnalysisComposer表示接続 rule / test index

Phase8で `analysis_environment_state_output_period_material` をAnalysis表示候補へ接続する場合は、Phase7 materialのraw text非混入・record_count / distinct_day_count / representative evidence・期間限定表現・回復処方禁止を同時に確認する。AnalysisComposerに接続しても、content_json / standardReport / contentText の既存contractを勝手に変更してはいけない。

| rule / guard / test | owner | 触る時 |
|---|---|---|
| Phase8 ESO surface adapter | `analysis_environment_state_output_surface.py`, `test_analysis_environment_state_output_phase8_display_connection.py` | `conditional_output_tendency` / `recovery_label_path` をAnalysis表示候補へ変換する時。 |
| AnalysisComposer Phase8 direct connection | `analysis_composer.py`, `test_analysis_environment_state_output_phase8_display_connection.py` | Phase7 materialを `material_sources` として直接渡し、safe summary sourcesへ変換する時。 |
| Analysis strict overclaim wording | `analysis_composer.py`, `analysis_report_validity_gate.py` | 「戻りやすい」「回復方法」「原因です」「いつも」など、Analysisが処方・原因・断定に見えるsurfaceを触る時。 |
| Public contract non-mutation | `analysis_composer.py`, `analysis_report_validity_gate.py`, `analysis_report_schema.json` | Analysis表示接続後も `content_json` / `standardReport` / `contentText` のshapeを変えない境界を触る時。 |

禁止: Phase7 materialをraw materialのままAnalysisComposerへ流す、raw memo / raw memo_actionを表示候補やmetaへ入れる、1件入力をperiod tendencyにする、`recovery_label_path` を「戻りやすい」「回復方法」「治る」にする、categoryやemotion strengthから原因を作る、Analysisを診断・タイプ化・人格化する。

# 2026-05-25 差分追記: 環境状態出力観測構造 Phase9 横断テスト rule / test index

環境状態出力観測構造を触る場合は、Emlis / Piece / Analysis の役割が混ざっていないことを横断で確認する。Phase9では、単発観測・核保持・期間観測の境界、RN表示契約、public API route / response key / DB physical name の非破壊性をテストで固定する。

| rule / guard / test | owner | 触る時 |
|---|---|---|
| Phase9 cross-core contract | `mashos-api/ai/tests/test_environment_state_output_phase9_cross_core_contract.py` | 環境状態出力観測構造をEmlis / Piece / Analysisに横断接続する時。 |
| Emlis single-record material | `cocolon_environment_state_output_frame.py`, `emlis_ai_observation_structure_material_service.py` | `environment_state_output_frame` の単発観測scope、raw非混入、原因化禁止を触る時。 |
| Piece overcompression prevention | `piece_environment_state_output_guard.py`, `piece_composer_input_contract.py`, `piece_composer.py`, `emotion_piece_generation_service.py` | `eso_environment:*` / `eso_state:*` / `eso_output:*` のmust_keepや過圧縮防止を触る時。 |
| Analysis period observation | `analysis_environment_state_output_material.py`, `analysis_environment_state_output_surface.py`, `analysis_composer.py`, `analysis_report_validity_gate.py` | `conditional_output_tendency` / `recovery_label_path` の表示接続やAnalysis安全表面を触る時。 |
| Public feedback meta / RN display contract | `emlis_ai_public_feedback_meta.py`, `api_emotion_submit.py` | `input_feedback.emlis_ai` のpublic-safe meta、`passed + comment_text` 表示条件、raw非混入を触る時。 |
| Submit public contract static check | `api_emotion_submit.py` | `/emotion/submit` route、`EmotionSubmitResponse`、`EmotionSubmitInputFeedback`、`friend_emotion_feed` defaultを触る時。 |

禁止: Emlisの「今回の入力では」をAnalysis期間表現へ混ぜる、Analysisの「この期間の記録では」をEmlis単発返答へ混ぜる、Pieceを「不安です」へ過圧縮する、`environment_state_output_frame` をpublic response keyへ追加する、raw `memo` / `memo_action` をpublic meta / Analysis surface / Piece guardへ入れる、categoryやemotion strengthを原因化する、1件入力から期間傾向・人格・性格・タイプを作る、回復ラベル経路を治療・処方・回復方法として表示する。


# 2026-05-26 差分追記: EmlisAI ESO surface contract completion rule / test index

`environment_state_output_frame` をEmlisAI表示candidateへ使う場合は、scope marker補完・forbidden surface rejection・runtime二重確認・public meta境界を同時に確認する。これは表示率を上げるためのGate緩和ではなく、読めているmaterialをpublic surface contractに沿って安全に返す出口整合である。

| rule / guard / test | owner | 触る時 |
|---|---|---|
| Surface contract completion helper | `emlis_ai_environment_state_output_surface_contract_completion.py`, `test_emlis_ai_environment_state_output_surface_contract_completion.py` | marker補完、idempotent、greeting skip、forbidden surface rejectionを触る時。 |
| Conversation composer normalize前接続 | `emlis_ai_conversation_composer_service.py`, `test_cocolon_text_generation_core_emlis_observation_adapter.py`, `test_cocolon_text_generation_core_step15_stabilization.py` | candidate text抽出後・surface validation前のcompletion接続を触る時。 |
| Runtime pre-return double check | `emlis_ai_runtime_surface_pre_return_gate.py`, `test_emlis_ai_runtime_surface_pre_return_gate.py` | 補完済みcandidateだけを通し、未補完/forbidden claimをterminal blockにする境界を触る時。 |
| Public meta / response boundary | `emlis_ai_public_feedback_meta.py`, `emotion_submit_service.py`, `test_emlis_ai_public_feedback_meta.py`, `test_emotion_submit_public_feedback_meta_boundary.py` | internal completion resultやruntime blockをpublic responseへ出す/出さない判定を触る時。 |
| Low-information repair boundary | `emlis_ai_observation_display_repair_integration.py`, `test_emlis_ai_observation_display_repair_integration.py` | 非repairable unavailable candidateやユーザー由来signalなしの入力をrepairへ逃がさない境界を触る時。 |
| Limited composer source audit | `emlis_ai_limited_composer_client.py`, `test_emlis_ai_limited_composer_client.py` | fixed fallback / runtime fixed observation surfaceの混入監査を触る時。 |

禁止: scope marker requirementをfalseにする、`environment_state_output_scope_marker_missing` をignoreする、forbidden claimをmarker補完で修復する、runtime gateを緩める、`schema_invalid` / `rejected` / `unavailable` のcomment_textをpublicへ出す、completion resultやraw inputをpublic metaへ出す。

# 2026-05-26 差分追記: EmlisAI状態回答と人間的フォロー rule / test index

EmlisAI immediate response の状態回答・人間的フォローを触る場合は、`emlis_ai_state_answer_human_follow_definition_2026_05_26.md` と、`environment_state_output_frame` / Runtime Surface Gate / Visible Surface Gate / Public Feedback Meta boundary を同時確認する。Phase2-10ではbackend内部material / Composer role plan / Gate boundary / QA / cross-core contract regressionとして実装済みだが、API route、DB、RN表示条件、json/schema実ファイルは変更しない。

| rule / guard / test | owner | 触る時 |
|---|---|---|
| 正本設計資料 | `emlis_ai_state_answer_human_follow_definition_2026_05_26.md` | 状態回答、人間的フォロー、比率、自己否定例外、怒り境界、比喩境界を確認する時。 |
| 基盤観測構造 | `cocolon_environment_state_output_observation_structure_design_2026_05_25.md`, `cocolon_environment_state_output_frame.py` | 「何を見るか」と「EmlisAIがどう返すか」を混同しないために確認する時。 |
| 状態回答surface contract material | `emlis_ai_state_answer_surface_contract.py`, `test_emlis_ai_state_answer_surface_contract.py` | 観測層 / フォロー層 / ratio / special handling / metaphor / surface policyをinternal materialとして扱う時。 |
| フォロー4 Selector | `emlis_ai_human_follow_selector.py`, `test_emlis_ai_human_follow_selector.py` | primary / secondary / afterglow follow keyを入力タイプ別に選ぶ時。感情ラベル単体で選ばない。 |
| 比率Resolver | `emlis_ai_state_answer_ratio_policy.py`, `test_emlis_ai_state_answer_ratio_policy.py` | `観測6 : フォロー4` と振れ幅をsection role / sentence plan unit / follow key数で扱う時。 |
| 自己否定・怒りSpecial Handling | `emlis_ai_state_answer_special_cases.py`, `test_emlis_ai_state_answer_self_denial_and_anger.py` | 自己否定でfelt stateとidentity claimを分ける時、怒りでtarget judgement agreementを止める時。 |
| 安全日常比喩material | `emlis_ai_safe_daily_metaphor_material.py`, `test_emlis_ai_safe_daily_metaphor_material.py` | 構造理解要求時だけ安全比喩候補を扱う時。自由比喩生成はしない。 |
| Composer接続 | `emlis_ai_state_answer_composer_contract.py`, `test_emlis_ai_state_answer_composer_connection.py`, `emlis_ai_limited_composer_client.py`, `emlis_ai_conversation_composer_service.py` | 状態回答surface contractをObservation section / Human follow sectionのrole planとしてComposerへ渡す時。 |
| Gate / Public Meta境界 | `emlis_ai_state_answer_gate_boundary.py`, `test_emlis_ai_state_answer_gate_boundary.py`, `test_emlis_ai_state_answer_public_meta_boundary.py`, `emlis_ai_runtime_surface_pre_return_gate.py`, `emlis_ai_visible_surface_acceptance_gate.py`, `emlis_ai_display_gate.py`, `emlis_ai_public_feedback_meta.py` | forbidden claim、自己否定allowed exception、怒りtarget judgement block、raw非混入、passed-only表示を守る時。 |
| 表示品質QA | `tests/fixtures/emlis_ai_state_answer_cases.py`, `test_emlis_ai_state_answer_visible_surface_qa.py` | 正解文一致ではなく、構造保持・禁止表面・比率・フォロー主役・public meta境界で受け入れ判定する時。 |
| Phase10横断contract | `tests/contract/test_emlis_state_answer_phase10_cross_contract_regression.py`, `test_emlis_ai_state_answer_phase10_cross_contract_regression.py`, `test_new_national_core_emlis_contracts.py`, `test_environment_state_output_phase9_cross_core_contract.py` | `/emotion/submit` public response維持、internal materialのpublic key化防止、Piece/AnalysisへのEmlis温度漏れ防止を確認する時。 |
| Piece / Analysis adapter境界 | `analysis_composer.py`, `analysis_composer_input_contract.py`, `piece_composer.py`, `piece_composer_input_contract.py` | EmlisAI状態回答の温度・文体・materialをPiece / Analysisへ混ぜない境界を触る時。 |

禁止:

- EmlisAIを行動指示AIにする。
- 観測ゼロ、フォローゼロ、慰めだけ、行動指示だけにする。
- 診断、人格断定、原因断定、category原因化、emotion strength原因化、1件入力からの期間傾向化をする。
- フォローを「あなたは優しい人です」等の人格肯定にする。
- 自己否定入力で自己否定内容を放置する、または根拠なし慰め・絶対味方宣言へ逃がす。
- 怒り入力で相手評価や攻撃に同意する。
- 比喩を自由生成する、専門比喩・攻撃比喩・行動指示比喩にする。
- 本資料内の例文をruntime固定文・完成文定数・fallback文にする。
- `/emotion/submit` route、response key、`input_feedback.comment_text`、public `observation_status`、RN表示名 `Emlisの観測`、RN表示条件、DB write pathを変更する。
- `environment_state_output_frame` / `emlis_state_answer_surface_contract` / `state_answer_composer_role_plan` / `human_follow_layer` / `ratio_policy` / `special_handling` / `metaphor_policy` をpublic response keyにする。
- public metaへraw input / memo / memo_action / raw_text / evidence text / comment_text body / state answer contract bodyを入れる。
- Piece / Analysis側へEmlisの話しかけ温度、Emlisの感想、状態回答フォロー層を流用する。
- json/schema実ファイルを、現物配置未確認のまま追加する。


# 2026-05-30 差分追記: EmlisAI Product Quality Stabilization Phase18 rule / test index

EmlisAIの商品品質安定化を触る場合は、Phase18のhelper / testがmeta-only、public contract非変更、Gate非緩和であることを同時に確認する。

| rule / guard / test | owner | 触る時 |
|---|---|---|
| Product Quality Regression Matrix | `tests/helpers/emlis_ai_phase18_product_quality_matrix.py`, `test_emlis_ai_phase18_product_quality_stabilization.py` | Phase18基準面、release blocker、public contract非変更を確認する時。 |
| TwoStage Applicability | `emlis_ai_two_stage_applicability.py`, `test_emlis_ai_phase18_two_stage_applicability.py`, `emlis_ai_two_stage_reception_gate.py` | label missing / required境界、legacy / low-information / pre-connection exemptを触る時。 |
| Complete Initial candidate path | `emlis_ai_complete_composer_client.py`, `emlis_ai_reply_service.py`, `test_emlis_ai_phase18_complete_initial_candidate_path.py` | 候補生成とpublic表示判定の分離を触る時。 |
| Low-information public repair | `emlis_ai_observation_display_repair_integration.py`, `test_emlis_ai_phase18_low_information_public_repair_boundary.py`, low-information既存回帰 | 短い低情報入力のrepair、safety / scope / AP0 / provided candidate除外を触る時。 |
| daily_unpleasant mode context | `emlis_ai_two_stage_section_surface_plan.py`, `emlis_ai_complete_sentence_planner.py`, `emlis_ai_complete_surface_realizer.py`, `test_emlis_ai_phase18_daily_unpleasant_mode_context.py` | reception mode / ratio reason / section meta伝搬を触る時。 |
| Meta-only sanitizer | `emlis_ai_state_answer_surface_contract.py`, `emlis_ai_observation_structure_material_service.py`, `emlis_ai_observation_structure_connection_service.py`, `test_emlis_ai_phase18_state_answer_surface_contract_meta_sanitizer.py` | `surface_policy` 本体・辞書本文・raw text・comment bodyの非混入を触る時。 |
| Diagnostic taxonomy | `emlis_ai_diagnostic_failure_taxonomy.py`, `emlis_ai_observation_diagnostic_lockdown.py`, `emlis_ai_observation_diagnostic_branching.py`, `test_emlis_ai_phase18_diagnostic_classification_taxonomy.py` | canonical classification / legacy alias / meta-safe reason codeを触る時。 |
| Visible readability QA | `emlis_ai_visible_readability_quality.py`, `emlis_ai_visible_surface_acceptance_gate.py`, `test_emlis_ai_phase18_visible_readability_quality.py` | 反復、内部role語、relation skeleton、単純言い換えを検査する時。 |
| `/emotion/submit` product-quality E2E | `test_emotion_submit_phase18_product_quality_e2e.py`, `emlis_ai_observation_display_repair_integration.py` | public response境界、低情報E2E、timeout保存成功 / 表示fail-closedを確認する時。 |
| RN contract regression | `Cocolon/tests/rn-screen-contracts.test.js` | RNがPhase18 backend metaを読まず、既存 `commentText` だけで表示することを確認する時。 |

禁止: Phase18のためにpublic response key、RN production UI、DB physical name、API route、observation_status enumを変える。Gate / Grounding / Reader / Templateを緩める。raw input / candidate text / comment_text body / surface_policy本体をpublic metaへ入れる。



# 2026-05-31 差分追記: EmlisAI是正方針 / Phase19撤回保持再設計 rule / test index

EmlisAIの設計・診断・実装・前提資料更新を行う場合は、Phase19のA/C/D個別通過路線を本線成功扱いせず、次の資料とruleを同時確認する。

| rule / guard / test | owner | 触る時 |
|---|---|---|
| 是正方針正本 | `emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md` | EmlisAIの撤回・保持・再設計、Phase20実装順、Gate recovery、Safety triage、Low informationを触る時。 |
| 思想正本 | `cocolon_thought_material_for_karen.md` | EmlisAIを入力直後の観測返答として扱う根拠を確認する時。 |
| 状態回答・人間的フォロー | `emlis_ai_state_answer_human_follow_definition_2026_05_26.md` | 自己否定、安全隣接、観測層/フォロー層、行動指示化禁止を確認する時。 |
| 環境状態出力観測構造 | `cocolon_environment_state_output_observation_structure_design_2026_05_25.md` | 「何を見るか」と「どう返すか」を混同しないために確認する時。 |
| 作業姿勢ルール | `work_attitude_rules_for_karen/00_read_first.txt`, `05_forbidden_unrequested_completion_and_structure_addition.txt`, `09_work_start_checklist.txt`, `10_stop_judgment_and_unwritten_rules.txt`, `13_forbidden_reasking_existing_design_and_design_term_escape.txt`, `99_integrated_paste_each_time.txt` | EmlisAI作業前の必読・停止条件・構造テンプレ禁止を確認する時。 |

禁止:

- A/C/D exact fixture を runtime 条件にする。
- case専用mode / cue / surface / fixed commentText を追加する。
- Gate failure を empty comment_text / unavailable / rejected の無反応で終わらせる。
- `passed + comment_text` 到達をEmlisAIの目的として扱う。
- safety隣接入力を一律に通常観測非表示へ潰す。
- Phase19個別通過路線を本線成功扱いする。

保持:

- A/C/D fixture は失敗再現・回帰確認として保持する。
- public `input_feedback.comment_text` / `input_feedback.emlis_ai.observation_status` / RNタイトル `Emlisの観測` は、明示実装設計なしに変更しない。
- Gateは保持するが、沈黙装置ではなく安全な応答へ縮退させる品質境界として扱う。
# 2026-06-01 差分追記: EmlisAI Phase20 rule / test index

EmlisAIのPhase20撤回保持再設計を触る場合は、Phase20のhelper / testがpublic contract非変更、RN production UI非変更、C/D専用route撤回、低情報無応答防止、safety境界保持であることを同時に確認する。

| 領域 | 主なファイル | 使う時 |
|---|---|---|
| Phase19差分inventory | `tests/helpers/emlis_ai_phase20_phase19_diff_inventory.py`, `test_emlis_ai_phase20_phase19_diff_inventory.py` | Phase19由来のdelete / quarantine / generalize / retain分類を確認する時。 |
| Internal Response Contract | `emlis_ai_response_contract.py`, `test_emlis_ai_response_contract.py` | response_kindとpublic status mappingを触る時。 |
| Safety Triage | `emlis_ai_safety_triage.py`, `emlis_ai_self_denial_safe_state_answer.py`, `test_emlis_ai_safety_triage_response_contract.py` | 自己否定・safety support・emergency境界を触る時。 |
| Input Material Bundle | `emlis_ai_input_material_bundle.py`, `emlis_ai_observation_eligibility_router.py`, `test_emlis_ai_input_material_bundle_phase20_3.py` | thought / action / emotion / category材料判定を触る時。 |
| Low Information Observation | `emlis_ai_low_information_observation_composer.py`, `test_emlis_ai_low_information_observation_phase20_4.py`, `test_emlis_ai_phase20_10_real_device_recheck.py` | A相当の短文・材料不足入力が無応答にならないことを確認する時。 |
| Gate Recovery Loop | `emlis_ai_gate_recovery_loop.py`, `test_emlis_ai_gate_recovery_loop_phase20_5.py` | Gate failure後の短縮・限定・再生成・低情報/安全応答を確認する時。 |
| Generic SentencePlan / Surface | `emlis_ai_complete_surface_realizer.py`, `test_emlis_ai_generic_sentence_surface_realizer_phase20_6.py` | C/D専用完成surfaceを使わずgeneric surfaceで返す境界を確認する時。 |
| Public Boundary / RN Contract | `emlis_ai_public_feedback_meta.py`, `emotion_submit_service.py`, `test_emlis_ai_public_boundary_phase20_7.py`, `test_emlis_ai_phase20_7_public_boundary_rn_contract.py`, `Cocolon/tests/rn-screen-contracts.test.js` | public meta sanitizerとRN表示契約を確認する時。 |
| QA Matrix / Phase19撤回 | `emlis_ai_response_contract_qa_matrix.py`, `test_emlis_ai_response_contract_qa_matrix_phase20_8.py`, `test_emlis_ai_phase20_9_phase19_withdrawal.py` | exact text一致禁止、C/D専用runtime token撤回を確認する時。 |
| Post-final Gate Recovery | `emlis_ai_reply_service.py`, `emlis_ai_gate_recovery_loop.py`, `test_emlis_ai_post_final_gate_recovery_phase20_13.py` | final pre-return gate後に通常入力が空白終了へ戻らないこと、safety / infraが通常観測へ偽装されないことを確認する時。 |
| Gate Recovery Surface Binding QA | `emlis_ai_gate_recovery_loop.py`, `test_emlis_ai_gate_recovery_surface_phase20_15.py` | Gate Recovery surfaceがmaterial slots / relation family / unknown slotsに接続し、fixed fallback化していないことを確認する時。 |

禁止: Phase20のためにpublic response key、RN production UI、DB physical name、API route、observation_status enumを変える。Gate / Grounding / Reader / Templateを緩める。raw input / candidate text / comment_text body / internal contract body / surface binding bodyをpublic metaへ入れる。post-final recoveryをsafety emergency / infrastructureのpassed化に使わない。

# 2026-06-03 差分追記: EmlisAI Product Read Feel / Structure Insight Phase1-11 rule / test index

EmlisAIの商品読感評価、Structure Insight候補、Gate、Long-run QAを触る場合は、Phase20撤回保持再設計に加えて次を同時確認する。

| 領域 | 主なファイル | 使う時 |
|---|---|---|
| Current output inventory | `emlis_ai_product_readfeel_current_output_inventory.py`, `test_emlis_ai_product_readfeel_current_output_inventory_phase1.py` | family別の表示不達・契約違反・surface破綻・読感不足・構造気づき不足を確認する時。 |
| Product Read Feel rubric | `emlis_ai_product_readfeel_rubric.py`, `test_emlis_ai_product_readfeel_rubric.py` | read_feeling / follow_depth / evidence_boundary / insight_deltaの評価境界を確認する時。 |
| Fixture family registry | `tests/fixtures/emlis_ai_product_readfeel_fixture_families.py`, `test_emlis_ai_product_readfeel_fixture_families.py` | exact文一致ではなくfamily品質を見る時。 |
| Product Read Feel scorecard | `emlis_ai_product_readfeel_scorecard.py`, `test_emlis_ai_product_readfeel_scorecard.py` | v1 Product Read Feel evaluatorとv2 readinessを分ける時。 |
| v1 surface repair | `emlis_ai_state_answer_ratio_policy.py`, `emlis_ai_two_stage_section_surface_plan.py`, `emlis_ai_complete_surface_realizer.py`, `test_emlis_ai_product_readfeel_surface_v1_phase5.py` | positive / self_denial / low_information / daily_unpleasantのsurface読感を触る時。 |
| Mirror-only detector | `emlis_ai_mirror_only_surface_detector.py`, `test_emlis_ai_mirror_only_surface_detector.py` | ただ返しているだけの検出・v1 repair・v2 insight gap接続を確認する時。 |
| Structure Insight candidate | `emlis_ai_structure_insight_candidate.py`, `test_emlis_ai_structure_insight_candidate.py` | relation candidate / evidence ledger / soft expression policyを触る時。 |
| Structure dictionary operation | `ai/docs/Cocolon_EmlisAI_構造辞書更新運用_華恋用_2026-06-02.md`, `test_emlis_ai_structure_dictionary_update_operation_phase8.py` | Mash構造知識を完成文ではなく辞書候補に整理する時。 |
| Structure Insight Gate | `emlis_ai_structure_insight_gate.py`, `test_emlis_ai_structure_insight_gate.py` | unsafe insight / diagnosis / personality / cause / target judgement / soft expression不足を止める時。 |
| Limited-family surface | `emlis_ai_structure_insight_surface.py`, `test_emlis_ai_structure_insight_surface_phase10.py` | `structure_question` / `long_meaning_arc` / `self_understanding_follow` へ限定接続する時。 |
| Long-run Product Gate candidate | `emlis_ai_product_readfeel_long_run_product_gate.py`, `test_emlis_ai_product_readfeel_phase11_long_run_product_gate.py`, `emlis_ai_runtime_surface_blind_qa_long_run.py` | 5件・10件連続、family横断反復、v1/v2分離を確認する時。 |
| Complete scorecard connection | `emlis_ai_complete_product_quality_scorecard_service.py`, `test_emlis_ai_complete_product_quality_scorecard.py`, `test_emlis_ai_complete_product_quality_scorecard_blind_qa.py` | Product Read Feel / Structure Insight metaをcomplete scorecardで読む時。 |

禁止: Phase1〜11のためにpublic response key、RN production UI、DB physical name、API route、observation_status enumを変える。`PRODUCT_PASS` / `STRUCTURE_INSIGHT_READY` をpublic statusとして扱う。read_feelingをmachine metricsから自動補完する。raw input / comment_text body / candidate bodyをmetaへ保存する。日本語ファイル名の文字化けだけを理由に同内容ファイルを重複追加する。
