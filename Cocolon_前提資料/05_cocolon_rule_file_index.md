---
doc_id: cocolon_rule_file_index
title: "Cocolon ルールファイル索引"
revision_date: "2026-08-01"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "canonical_current_authority_plus_last_structural_audit"
current_authority: "07_latest_snapshot_diff.md"
last_structural_audit_source:
  Cocolon: "MassyuRed/Cocolon:main@7533587673f1e895ea056b18562deaa6059f0aba"
  mashos-api: "MassyuRed/mashos-api:main@a904ba192b05ca1445e32006b64fc87e7cda48bf"
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


# 2026-06-04 差分追記: EmlisAI User Label Connection Observation v1 rule / test index

User Label Connection Observation v1を触る場合は、設計書、作業姿勢資料、EmlisAI是正方針、既存Structure Insight Gate、User Fact Grounding Boundary、public feedback meta sanitizerを同時確認する。これは「履歴を使った決めつけ」ではなく、Cocolonの記憶ラベル方式を、断定しない観測線としてEmlisAIへ返すbackend internal layerである。

| rule / guard / test | owner | 触る時 |
|---|---|---|
| 設計正本 | `Cocolon_EmlisAI_UserLabelConnectionObservation_v1_Design_2026-06-03.md` | Point / Line / Mechanism / Observation、禁止claim、Phase境界を確認する時。 |
| Contract inventory | `emlis_ai_user_label_connection_contract_inventory.py`, `test_emlis_ai_user_label_connection_e2e_contract.py` | `/emotion/submit`、RN表示、public meta、composer接続境界を確認する時。 |
| Point / Material / Edge | `emlis_ai_user_label_connection_types.py`, `emlis_ai_user_label_connection_material.py`, `test_emlis_ai_user_label_connection_material.py`, `test_emlis_ai_user_label_connection_edge_family_score.py` | current input / owned history / edge family / private scoreを触る時。 |
| Free / raw meta boundary | `test_emlis_ai_user_label_connection_free_tier_boundary.py`, `test_emlis_ai_user_label_connection_no_raw_text_meta.py` | Free current_input_onlyやraw非混入を確認する時。 |
| Candidate | `emlis_ai_user_label_connection_candidate.py`, `test_emlis_ai_user_label_connection_candidate.py` | Mechanism candidate、evidence count、current included、forbidden claimsを触る時。 |
| Gate | `emlis_ai_user_label_connection_gate.py`, `test_emlis_ai_user_label_connection_gate.py`, `test_emlis_ai_user_label_connection_low_information_boundary.py` | scope marker、soft marker、safety adjacent、low information、claim blockを触る時。 |
| Surface / visible connection | `emlis_ai_user_label_connection_surface.py`, `test_emlis_ai_user_label_connection_surface.py` | limited surface planやPhase8 comment_text接続を触る時。 |
| Meta sanitizer / reply flow | `emlis_ai_user_label_connection_public_meta.py`, `emlis_ai_public_feedback_meta.py`, `emlis_ai_reply_service.py`, `test_emlis_ai_user_label_connection_public_boundary.py` | 既存 `input_feedback.emlis_ai` safe summaryやreply flow integrationを触る時。 |
| Product Quality QA | `emlis_ai_user_label_connection_product_quality_qa.py`, `test_emlis_ai_user_label_connection_product_quality_qa.py` | Blind QA候補、ratings-only summary、pytest green非成果境界を触る時。 |
| Derived Model cache consideration | `emlis_ai_user_label_connection_derived_model_cache.py`, `test_emlis_ai_user_label_connection_derived_model_cache.py` | cache検討、runtime measurement、DB/cache read/write禁止を触る時。 |

対象回帰:

```text
python -m pytest -q   ai/tests/test_emlis_ai_user_label_connection_*.py   ai/tests/test_emlis_ai_phase20_7_public_boundary_rn_contract.py
```

RN production contractを確認する場合は次も維持する。

```text
node --test tests/rn-screen-contracts.test.js
```

禁止:

```text
- User Label ConnectionをRN新画面・public status・public response top-level keyとして扱う。
- 既存Structure Insight Gateを緩めて履歴接続candidateを通す。
- `input_feedback.emlis_ai.user_label_connection` のsafe summaryを表示sourceにする。
- raw input / memo / memo_action / history raw text / comment_text body / candidate body / surface bodyをmetaへ入れる。
- Freeでowned historyを使う。
- low_information / safety adjacent / self-denial / target judgementを履歴接続で通常観測へ昇格する。
- Phase10をcache実装済み、Derived User Modelへの永続化済み、DB schema変更済みとして読む。
```


# 2026-06-04 差分追記: EmlisAI Product Quality Measurement / Blocker Repair Phase0-8 rule / test index

EmlisAIの商品品質計測、Blocker Matrix、Blind QA Integration、Release Decision、Validation Planを触る場合は、Phase20撤回保持再設計、Product Read Feel / Structure Insight、User Label Connection QAに加えて次を同時確認する。

| rule / test | 何を拘束するか | いつ必須か |
|---|---|---|
| `emlis_ai_product_quality_contract_freeze.py` | RN/API/DB/public response/Product QA materialの不変契約 | 商品品質計測の入口、contract変更有無を確認する時 |
| `emlis_ai_product_quality_measurement_event.py` | ProductQualityEventV1のtext-free normalizer / public display reach判定 | Runner、scorecard、Blocker Matrixへ渡すeventを触る時 |
| `emlis_ai_product_quality_measurement_runner.py` | Local Composer Bootstrap、MeasurementRunV1、QA material接続 | 実入力family計測、Composer blocker、run summaryを触る時 |
| `emlis_ai_product_quality_blocker_matrix.py` | blocker taxonomy / owner area / repair policy / repair queue | blocker別生成修正の入口を触る時 |
| `emlis_ai_product_quality_generation_repair_design.py` | repair track / execution order / fixed template禁止 | Phase5生成修正設計materialを触る時 |
| `emlis_ai_product_quality_blind_qa_integration.py` | ratings-only review、coverage、machine metrics代替禁止 | Blind QAをrelease判断へ接続する時 |
| `emlis_ai_product_release_decision.py` | internal release decision、release_blockers、followup fixes | release_allowed / release_stage判断を触る時 |
| `emlis_ai_product_quality_validation_plan.py` | validation order、required tests、acceptance criteria | Phase8検証計画とvalidation readinessを触る時 |
| `test_emlis_ai_product_quality_*.py` / `test_emlis_ai_product_release_decision.py` | Phase0-8内部contract回帰 | Phase0-8 materialを修正する時 |

禁止: `product_gate_ready` / `public_release_applied` をPhase0-8 materialでtrueにする、Blind QA未実施をgreen扱いする、Release Decision greenを即rolloutと読む、public response / RN / DB contractを変える。

# 2026-06-05 差分追記: EmlisAI Gate Recovery public surface leak repair P0-P12 rule / guard索引

Gate Recovery public leak修正では、次のrule / guard / testを同時確認する。

| path | 何を拘束するか | いつ必須か |
|---|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_public_constants.py` | public leak blocker / source kind / public role定数 | Gate Recovery public boundary、ProductQuality blocker、repair designを触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_public_boundary.py` | Gate Recovery由来candidateをpublic表示してよいかの判定 | `recover_emlis_gate_failure()`、post-final recovery、reply_service差し替えを触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_public_candidate_builder.py` | public candidate source選択、low-info回復、bounded original repair | Gate Recovery後に本文候補を作る/選ぶ時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_public_surface_validation_plan.py` | P0〜P11後のbackend / RN / 実機validation plan | 実装後validation、release判定、商品品質測定を触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_product_quality_measurement_event.py` | `surface_origin` normalizer / public leak blocker検出 | ProductQualityEventを変更する時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_product_quality_measurement_runner.py` | surface_origin集計 / P12 validation plan接続 | Measurement Runnerやrun blockerを触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_product_quality_blocker_matrix.py` | Gate Recovery public leak blockerのowner / severity / repair policy | Blocker分類を触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_product_quality_generation_repair_design.py` | gate_recovery_public_surface_boundary_repair track | Generation repair queueを触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_product_quality_validation_plan.py` | P12追加validation items / allowed source / forbidden fragment | ProductQuality validationを触る時 |

P0〜P12関連の主な回帰test:

```text
mashos-api/ai/tests/test_emlis_ai_gate_recovery_public_surface_boundary.py
mashos-api/ai/tests/test_emlis_ai_gate_recovery_public_boundary_decision.py
mashos-api/ai/tests/test_emlis_ai_reply_service_gate_recovery_public_boundary_p4.py
mashos-api/ai/tests/test_emlis_ai_gate_recovery_public_candidate_builder_p5.py
mashos-api/ai/tests/test_emlis_ai_gate_recovery_low_information_recovery_p6.py
mashos-api/ai/tests/test_emlis_ai_gate_recovery_original_candidate_repair_p7.py
mashos-api/ai/tests/test_emlis_ai_product_quality_surface_origin_p8.py
mashos-api/ai/tests/test_emlis_ai_product_quality_gate_recovery_repair_design_p9.py
Cocolon/tests/rn-screen-contracts.test.js
mashos-api/ai/tests/test_emlis_ai_real_device_gate_recovery_regression_p11.py
mashos-api/ai/tests/test_emlis_ai_gate_recovery_public_surface_validation_plan_p12.py
```


禁止:

```text
- Gate Recovery material surfaceをfixed fallbackではないとmeta宣言してpublicに通す。
- `_build_recovery_comment_text()` 由来の本文をpublic fallbackとして使う。
- RN contract testをsource lineage表示分岐のために変更する。
- ProductQuality validation planを実行済み・release済みの証明として扱う。
```


# 2026-06-06 差分追記: EmlisAI Normal Observation Public Recovery P0-P9 rule / test index

通常・高情報量入力が `surface_grammar` / `relation_skeleton` / `visible_surface` 系で落ちた後の復旧を触る場合は、Gate Recovery public surface leak repair P0-P12に加えて次を同時確認する。

| rule / guard / test | 何を拘束するか | いつ必須か |
|---|---|---|
| `emlis_ai_gate_recovery_public_constants.py` | `normal_observation_rebuild_candidate` source kind / missing blocker / allowed public source | public candidate sourceを追加・判定する時 |
| `emlis_ai_gate_recovery_public_candidate_builder.py` | normal rebuild eligibility、reason family正規化、recovery plan target、public candidate build | 通常候補が表面品質で落ちた後のrebuildを触る時 |
| `emlis_ai_gate_recovery_loop.py` | normal rebuild candidateをlow-information recoveryと分け、既存Gateへ通す | Gate Recovery loop採用・source phase・observation_quality_metaを触る時 |
| `emlis_ai_reply_service.py` | actual adopted public candidateの出自summary、post-final二重試行防止 | final pre-return / post-final recoveryを触る時 |
| `emlis_ai_display_gate.py` | rerender attempt metaの保持。Gate判定緩和ではない | display decision metaを正規化する時 |
| `emlis_ai_product_quality_measurement_event.py` | normal rebuildをsurface_origin unknown扱いにしない | ProductQualityEvent / scorecardを触る時 |
| `emlis_ai_product_quality_validation_plan.py` | P12 allowed public candidate sourceとしてnormal rebuildを扱う | validation plan / allowed sourceを触る時 |
| `emlis_ai_public_feedback_meta.py` | normal rebuild attempted / applied / source kindをbody-free public summaryへ出す | public diagnostic summaryを触る時 |

P0〜P9関連の主な回帰test:

```text
mashos-api/ai/tests/test_emlis_ai_gate_recovery_normal_observation_rebuild_p8.py
mashos-api/ai/tests/test_emlis_ai_gate_recovery_public_candidate_builder_p3_plan.py
mashos-api/ai/tests/test_emlis_ai_gate_recovery_normal_observation_rebuild_builder_p4.py
mashos-api/ai/tests/test_emlis_ai_gate_recovery_normal_observation_rebuild_loop_p5.py
mashos-api/ai/tests/test_emlis_ai_reply_service_normal_observation_rebuild_p6.py
mashos-api/ai/tests/test_emlis_ai_product_quality_normal_observation_rebuild_p7.py
mashos-api/ai/tests/test_emlis_ai_product_quality_surface_origin_p8.py
mashos-api/ai/tests/test_emlis_ai_real_device_gate_recovery_regression_p11.py
Cocolon/tests/rn-screen-contracts.test.js
```

禁止:

```text
- RN側で non-passed / empty comment_text を表示する。
- Surface Gate / Display Gate / Runtime Gateを緩める。
- Gate Recovery material surfaceをnormal rebuild候補として流用する。
- composer disabled / source unavailable / phase_not_completeを通常観測rebuildで補う。
- safety / emergency / infra failureを通常観測としてpassed化する。
- raw input / original candidate body / candidate body / comment_text bodyをmetaやProductQuality eventへ入れる。
- 固定完成文やcase専用fixture分岐でnormal rebuildを通す。
```


# 2026-06-06 差分追記: EmlisAI Public Observation Recovery P0-P10 rule / test index

Public Observation Recoveryを触る場合は、Gate Recovery public surface leak repair P0-P12、Normal Observation Public Recovery、Phase20是正方針に加えて次を同時確認する。

| rule / guard / test | 何を拘束するか | いつ必須か |
|---|---|---|
| `emlis_ai_public_observation_recovery_status.py` | `public_reached` / `rn_visible` / `product_surface_valid` と失敗分類 | 表示到達と商品surface成立を分ける時 |
| `emlis_ai_public_surface_requirement.py` | labelled two-stage / plain / low-info / safety / infraの要求surface | candidate採用前のsurface familyを決める時 |
| `emlis_ai_gate_recovery_public_candidate_builder.py` | normal rebuild two-stage boundary、P5/P6 candidate採用順 | public candidate sourceを選ぶ時 |
| `emlis_ai_product_surface_validation.py` | rn_visibleとproduct_surface_validの分離 | D/Phase17系のplain誤成功を止める時 |
| `emlis_ai_complete_initial_surface_availability.py` | complete_initial_surface_unavailableのsource診断 | C系の表示不達原因を切る時 |
| `emlis_ai_complete_initial_surface_recomposition.py` | C系source unavailableを別laneで再構成 | safe / material sufficient / source unavailableを沈黙で終わらせない時 |
| `emlis_ai_labelled_two_stage_surface_recomposition.py` | two_stage_requiredのlabelled二段再構成 | D/Phase17/ProductVisibleをplainへ落とさない時 |
| `emotion_submit_service.py` | public feedback inclusion summary三段階化 | `/emotion/submit` 診断summaryを触る時 |
| `emlis_ai_public_feedback_meta.py` | public_surface_lineage / body-free public meta | `input_feedback.emlis_ai` summaryを触る時 |
| `emlis_ai_product_quality_measurement_event.py` | P5/P6 source originをProductQualityで区別 | scorecard / event / lineageを触る時 |

P0〜P10関連の主な回帰test:

```text
mashos-api/ai/tests/test_emlis_ai_public_observation_recovery_acceptance_p0.py
mashos-api/ai/tests/test_emlis_ai_public_surface_requirement_p1.py
mashos-api/ai/tests/test_emlis_ai_gate_recovery_normal_observation_rebuild_boundary_p2.py
mashos-api/ai/tests/test_emlis_ai_product_surface_validation_p3.py
mashos-api/ai/tests/test_emlis_ai_complete_initial_surface_availability_p4.py
mashos-api/ai/tests/test_emlis_ai_complete_initial_surface_recomposition_p5.py
mashos-api/ai/tests/test_emlis_ai_labelled_two_stage_surface_recomposition_p6.py
mashos-api/ai/tests/test_emotion_submit_public_feedback_inclusion_summary_p7.py
mashos-api/ai/tests/test_emlis_ai_public_meta_product_quality_lineage_p8.py
mashos-api/ai/tests/test_emotion_submit_phase19_real_device_abcd_public_feedback_e2e.py
mashos-api/ai/tests/test_emotion_submit_two_stage_reception_e2e.py
mashos-api/ai/tests/test_emlis_ai_two_stage_product_visible_fixture_completion.py
Cocolon/tests/rn-screen-contracts.test.js
```

禁止:

```text
- RN側で non-passed / empty comment_text を表示する。
- `public_reached` や `product_surface_valid` をpublic response keyにする。
- source unavailableをnormal rebuildで補う。
- two_stage_requiredをplain normal rebuildで成功扱いする。
- Gate Recovery material surface / diagnostic recovery surfaceを本文へ出す。
- raw input / original candidate body / candidate body / comment_text bodyをmetaやProductQuality eventへ入れる。
- fixed fallback、case専用route、case専用surfaceでAcceptanceを通す。
```

# 2026-06-07 差分追記: EmlisAI Limited Grounding / Low Information 受け取り必須化 P0-P9 rule / test index

最新実ファイル `mashos-api_10(27).zip` では、limited / low-information reception-requiredのrule / guard / regressionが追加・変更されている。RN側のrule / screen contract変更はない。

## Production owner / guard

| path | 何を拘束するか |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_public_surface_requirement.py` | limited_groundingをlabelled two-stageへ分岐し、low_informationもreception required shapeへする。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_public_candidate_builder.py` | limited_groundingを低情報laneから外し、labelled two-stage recompositionへ送る。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_labelled_two_stage_surface_recomposition.py` | limited_groundingをP6二段recomposition対象にする。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_limited_grounding_reception_surface.py` | limited_grounding用の受け取りsurface plan / composer / summary。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_low_information_observation_composer.py` | true low_informationの `見えたこと： / Emlisから：` body assembly。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_observation_surface_realizer_tone.py` | low_informationのreception-required shapeをrealizer側で崩さない。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_product_surface_validation.py` | reception-required shapeとquestion dominance guardをproduct surface validationへ接続する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_question_dominance_guard.py` | 質問先行・質問だけ・質問中心surfaceをbody-free summaryで検出する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_input_material_bundle.py` | 回復・未来意図・関係願い・比較基準・小さな変化等のsemantic material ids。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_initial_surface_recomposition.py` | source unavailable側でもlimited_grounding reception helperへ戻せるようにする。 |

## Regression / contract tests

| path | 固定する境界 |
|---|---|
| `mashos-api/ai/tests/test_emlis_ai_hij_input_material_bundle_current_p0.py` | H=eligible、I/J=limited_groundingのcurrent material基準。 |
| `mashos-api/ai/tests/test_emlis_ai_public_surface_requirement_limited_lowinfo_reception_p1.py` | limitedとlow_informationのsurface requirement分岐。 |
| `mashos-api/ai/tests/test_emlis_ai_gate_recovery_limited_lowinfo_reception_p2.py` | limited_groundingを低情報laneから外すrouting。 |
| `mashos-api/ai/tests/test_emlis_ai_labelled_two_stage_limited_reception_p3.py` | limited_groundingのlabelled two-stage recomposition。 |
| `mashos-api/ai/tests/test_emlis_ai_limited_grounding_reception_surface_p4.py` | limited reception helperのbody-free plan / semantic material。 |
| `mashos-api/ai/tests/test_emlis_ai_low_information_reception_required_p5.py` | true low_informationの受け取り必須化。 |
| `mashos-api/ai/tests/test_emlis_ai_product_surface_question_dominance_guard_p6.py` | question dominance guardとproduct surface validation。 |
| `mashos-api/ai/tests/test_emlis_ai_input_material_bundle_semantics_p7.py` | semantic material idsの一般化とcategory-only禁止。 |
| `mashos-api/ai/tests/test_emlis_ai_hij_reception_required_regression_p8.py` | H/I/J E2E public response回帰。 |
| `mashos-api/ai/tests/test_emlis_ai_existing_regression_contract_p9.py` | 既存RN/API/Gate/public meta contract確認。 |

作業時の注意:

```text
- `question_dominance_guard` は文章生成ではなくvalidation guardとして読む。
- H/I/J testはcase専用runtime routeではなく、一般材料認識とpublic contractの回帰として読む。
- low_informationを消したり、長文を自動でeligibleへ上げたりしない。
```

# 2026-06-07 差分追記: EmlisAI D相当入力 source-unavailable normal observation recovery rule / test index

最新実ファイル `mashos-api_11(18).zip` では、D相当入力のsource-unavailable recoveryに関するrule / guard / regressionが追加・変更されている。RN側のrule / screen contract変更はない。

## Production owner / guard

| path | 何を拘束するか |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_public_surface_requirement.py` | relation transition materialを持つeligible通常観測を `labelled_two_stage` 要求へ寄せる。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_initial_surface_availability.py` | source unavailable family / material_sufficient / surface_requirement_family / recovery_laneをbody-free summaryに固定する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_initial_surface_recomposition.py` | source unavailable後のcomplete initial surface recomposition permissionとbody-free candidate metaを拘束する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_public_candidate_builder.py` | recovery plan / candidate summaryをbody-freeに保持する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | recomposition candidateを既存Gate chainへ通し、通過時だけ採用する。 |

## Regression / contract test

| path | 固定すること |
|---|---|
| `mashos-api/ai/tests/test_emlis_ai_d_source_unavailable_normal_observation_recovery.py` | D相当入力がsafe + eligible + source_unavailableから `normal_observation / passed / comment_textあり` へ戻ること。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_initial_surface_recomposition_body_free_p7.py` | candidate metaがbody-freeで、raw input / comment_text body / candidate bodyを持たないこと。 |
| `mashos-api/ai/tests/test_emlis_ai_complete_initial_surface_recomposition_existing_gate_chain_p8.py` | candidate生成と採用を分け、既存Gate全通過時だけ採用すること。 |
| `mashos-api/ai/tests/test_emlis_ai_phase20_10_real_device_recheck.py` | A/B/C/Dの回帰、特にDが `normal_observation / passed` を維持すること。 |

このrule indexでの禁止:

```text
Gateを緩めてgreenにする
D exact fixtureをruntime条件にする
fixed fallback / fixed commentTextを追加する
source unavailableをnormal rebuildで偽装する
bodyをpublic metaへ出す
RN表示条件をbackend診断metaへ依存させる
```

# 2026-06-08 差分追記: EmlisAI P0-P1 public input_feedback arrival rule / test index

public `input_feedback` 到達、`Emlisの観測` 表示境界、`visible_surface_acceptance_gate` のpublic inclusion意味論を触る場合は、次を同時確認する。

| path | 何を拘束するか | いつ必須か |
|---|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py` | `should_include_public_input_feedback()` とpublic-safe `input_feedback.emlis_ai` meta境界。yellow/warn policy、fail-closed、body-free markerを扱う。 | public feedback meta / inclusion条件を触る時 |
| `mashos-api/ai/services/ai_inference/emotion_submit_service.py` | `/emotion/submit` のpublic feedback inclusion summary。`public_reached` / `rn_visible` / `product_surface_valid` の分類を扱う。 | submit response summary / diagnosticを触る時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_product_surface_validation.py` | product surface validation。visible yellow/warn warning-onlyとstrict gate blockを分ける。 | product_surface_valid / rn_visible / public_gate_blockedを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_public_feedback_meta.py` | yellow/warn allow、repair_required block、true unavailable / safety fail-closed、no body leakの単体regression。 | public feedback meta変更時 |
| `mashos-api/ai/tests/test_emotion_submit_public_feedback_inclusion_summary_p7.py` | inclusion summaryがyellow/warnをabsence reasonへ落とさないこと。 | submit summary変更時 |
| `mashos-api/ai/tests/test_emlis_ai_product_surface_validation_p3.py` | product validation側のpublic gate / rn_visible誤分類を防ぐ。 | product surface validation変更時 |
| `mashos-api/ai/tests/test_emlis_ai_display_contract.py` | Red A到達、Red B safe recovery、no body leakをE2E display contractとして守る。 | Emlis display contract変更時 |
| `mashos-api/ai/tests/test_emlis_ai_user_label_connection_e2e_contract.py` | User Label Connection public meta sanitizer。body-free markerは許可し、raw body / raw text leakは禁止する。 | User Label Connection public meta変更時 |

追加された実装記録doc:

```text
mashos-api/ai/docs/Cocolon_EmlisAI_P0_P1_PublicInputFeedbackArrivalContractRepair_RedLedger_Step0_20260608.md
mashos-api/ai/docs/Cocolon_EmlisAI_P0_P1_PublicInputFeedbackArrivalContractRepair_Step5_RedA_E2EGreen_20260608.md
mashos-api/ai/docs/Cocolon_EmlisAI_P0_P1_PublicInputFeedbackArrivalContractRepair_RedBClassification_Step6_20260608.md
mashos-api/ai/docs/Cocolon_EmlisAI_P0_P1_PublicInputFeedbackArrivalContractRepair_Step10_ExistingGreenRegression_20260608.md
```

固定する読み方:

```text
- `classification=yellow` + `action=warn` はpublic inclusionのterminal blockerではない。
- `repair_required` / `red` / `rerender_surface` / `reroute_low_information` / `block` / `fail_closed` はblockerである。
- true unavailable / infrastructure_error / safety_blockedはcomment_textがあってもfail-closedする。
- body-free marker `candidate_body_included=false` をbody leakとして扱わない。
- raw `candidate_body` key、candidate_comment_text、raw input、comment_text bodyは引き続き禁止する。
- RN表示条件、RN表示タイトル、/emotion/submit route、DB write path、public response top-level keyは変えない。
```


# 2026-06-09 差分追記: EmlisAI P3 Product Read Feel Baseline P3-0〜P3-9 rule / test index

EmlisAI Product Read Feel baselineを触る場合は、P3-0〜P3-9の各層がbody-free / ratings-only / no-runtime-changeの境界であることを同時確認する。P3 baselineは、本文生成を直す前に「読まれた形へ届いているか」を測るための足場であり、Gate緩和・固定返信テンプレ・case専用分岐で通してはいけない。

| 領域 | 必ず確認するfile | 触る時 |
|---|---|---|
| P3-0 Contract Freeze | `emlis_ai_product_quality_contract_freeze.py`, `test_emlis_ai_product_readfeel_p3_contract_freeze_20260609.py` | P3評価fixtureやProductQuality meta boundaryを触る時。 |
| P3-1 Baseline Case Matrix | `tests/fixtures/emlis_ai_product_readfeel_baseline_cases_20260609.py`, `test_emlis_ai_product_readfeel_baseline_case_matrix_20260609.py` | 60件baseline、family coverage、coverage_slicesを触る時。 |
| P3-2 Local Output Capture | `tests/fixtures/emlis_ai_product_readfeel_p3_local_output_capture_20260609.py`, `test_emlis_ai_product_readfeel_p3_local_output_capture_20260609.py` | local review packet / sanitized current output eventを触る時。 |
| P3-3 Inventory Connection | `emlis_ai_product_quality_measurement_event.py`, `emlis_ai_product_readfeel_current_output_inventory.py`, `tests/fixtures/emlis_ai_product_readfeel_p3_inventory_connection_20260609.py`, `test_emlis_ai_product_readfeel_p3_inventory_connection_20260609.py` | body-free eventをinventory / scorecardへ接続する時。 |
| P3-4 Verdict Split | `emlis_ai_product_readfeel_p3_verdict_split.py`, `tests/fixtures/emlis_ai_product_readfeel_p3_verdict_split_20260609.py`, `test_emlis_ai_product_readfeel_p3_verdict_split_20260609.py` | P2 RED / P1 display repair / P3 repair / P3 yellow / passを分ける時。 |
| P3-5 Blind QA Ratings | `emlis_ai_product_readfeel_p3_blind_qa_ratings_review.py`, `tests/fixtures/emlis_ai_product_readfeel_p3_blind_qa_ratings_review_20260609.py`, `test_emlis_ai_product_readfeel_p3_blind_qa_ratings_review_20260609.py` | read_feelingやfamily別ratingsをscorecardへ接続する時。 |
| P3-6 Repair Priority Ledger | `emlis_ai_product_readfeel_p3_repair_priority_ledger.py`, `tests/fixtures/emlis_ai_product_readfeel_p3_repair_priority_ledger_20260609.py`, `test_emlis_ai_product_readfeel_p3_repair_priority_ledger_20260609.py` | 最初に直すblocker、候補ファイル、禁止修正を固定する時。 |
| P3-7 First Repair Design | `emlis_ai_product_readfeel_p3_first_repair_design.py`, `tests/fixtures/emlis_ai_product_readfeel_p3_first_repair_design_20260609.py`, `test_emlis_ai_product_readfeel_p3_first_repair_design_20260609.py` | runtime修正前の小修正設計を固定する時。 |
| P3-8 Regression | `emlis_ai_product_readfeel_p3_regression.py`, `tests/fixtures/emlis_ai_product_readfeel_p3_regression_20260609.py`, `test_emlis_ai_product_readfeel_p3_regression_20260609.py` | P3修正前後のrequired / optional suite判定を触る時。 |
| P3-9 P4/P5 Decision | `emlis_ai_product_readfeel_p3_p4_p5_connection_decision.py`, `tests/fixtures/emlis_ai_product_readfeel_p3_p4_p5_connection_decision_20260609.py`, `test_emlis_ai_product_readfeel_p3_p4_p5_connection_decision_20260609.py` | P4 family tuningへ進むか、P5履歴線強化を保留するか判断する時。 |

禁止:

```text
P3 baseline fixture本文をruntime条件にする。
exact comment_text一致を成功条件にする。
Gateを緩めて表示率だけを上げる。
P2 REDをP3読感修正へ混ぜる。
read_feelingをmachine metricsやverdictから自動補完する。
P5履歴線でcurrent-only読感不足を隠す。
```


# 2026-06-10 差分追記: EmlisAI P4 Family Product Tuning P4-0〜P4-10 rule / test index

EmlisAI Product Read FeelのP4 family tuningを触る場合は、P4-0〜P4-10がbody-free / ratings-only / no-contract-change境界でつながっていることを同時確認する。特にP4-6〜P4-8のruntime owner tuningは、Gate緩和や固定文ではなく、既存owner上のfamily読感補正として読む。

| 領域 | 必ず確認するfile | 触る時 |
|---|---|---|
| P4-0 Connection Freeze | `test_emlis_ai_product_readfeel_p4_connection_freeze_20260610.py`, `emlis_ai_product_readfeel_p3_p4_p5_connection_decision.py` | P4/P5接続判断、P5 hold、visible strengthening境界を触る時。 |
| P4-1 Target Case Selection | `emlis_ai_product_readfeel_p4_target_case_selection.py`, `tests/fixtures/emlis_ai_product_readfeel_p4_target_cases_20260610.py`, `test_emlis_ai_product_readfeel_p4_target_case_selection_20260610.py` | P4対象case、family coverage、target layerを触る時。 |
| P4-2 Material Audit | `emlis_ai_product_readfeel_p4_material_audit.py`, `tests/fixtures/emlis_ai_product_readfeel_p4_material_audit_20260610.py`, `test_emlis_ai_product_readfeel_p4_material_audit_20260610.py` | visible material slot、material quality、rich input overroute replayを触る時。 |
| P4-3 Surface Requirement Boundary | `emlis_ai_public_surface_requirement.py`, `test_emlis_ai_product_readfeel_p4_surface_requirement_boundary_20260610.py` | low_information / limited_grounding / source_unavailable / rich input境界を触る時。 |
| P4-4 Family Tuning Policy | `emlis_ai_product_readfeel_p4_family_tuning_policy.py`, `tests/fixtures/emlis_ai_product_readfeel_p4_family_tuning_policy_20260610.py`, `test_emlis_ai_product_readfeel_p4_family_tuning_policy_20260610.py` | ratio、temperature、section role、required anchor、forbidden surface classを触る時。 |
| P4-5 Surface Signature Audit | `emlis_ai_product_readfeel_p4_surface_signature_audit.py`, `tests/fixtures/emlis_ai_product_readfeel_p4_surface_signature_audit_20260610.py`, `test_emlis_ai_product_readfeel_p4_surface_signature_audit_20260610.py` | generic reception、repeated signature、question-only collapseを触る時。 |
| P4-6 daily_unpleasant | `emlis_ai_shared_reception_evidence.py`, `emlis_ai_reception_mode_resolver.py`, `emlis_ai_state_answer_ratio_policy.py`, `emlis_ai_complete_surface_realizer.py`, `test_emlis_ai_product_readfeel_p4_daily_unpleasant_family_tuning_20260610.py` | daily_unpleasantのevent / reaction anchor、ratio、surface realizationを触る時。 |
| P4-7 structure_question | `emlis_ai_two_stage_section_surface_plan.py`, `emlis_ai_state_answer_ratio_policy.py`, `emlis_ai_complete_surface_realizer.py`, `test_emlis_ai_product_readfeel_p4_structure_question_family_tuning_20260610.py` | structure_questionのsection role、ratio、P6過剰Insight境界を触る時。 |
| P4-8 self_denial yellow | `emlis_ai_product_readfeel_p4_self_denial_yellow_review.py`, `emlis_ai_state_answer_special_cases.py`, `emlis_ai_safety_triage.py`, `test_emlis_ai_product_readfeel_p4_self_denial_yellow_review_20260610.py` | self_denial yellow、安全隣接、identity claim as fact禁止を触る時。 |
| P4-9 Ratings-only Review | `emlis_ai_product_readfeel_p4_ratings_review.py`, `tests/fixtures/emlis_ai_product_readfeel_p4_ratings_review_20260610.py`, `test_emlis_ai_product_readfeel_p4_ratings_review_20260610.py` | P4改善判定、P3-9再判定、ratings-only materialを触る時。 |
| P4-10 Regression Handoff | `emlis_ai_product_readfeel_p4_regression_handoff.py`, `tests/fixtures/emlis_ai_product_readfeel_p4_regression_handoff_20260610.py`, `test_emlis_ai_product_readfeel_p4_regression_handoff_20260610.py` | required regression status、P5 hold re-check、handoff可否を触る時。 |

禁止:

```text
P4 fixture本文をruntime条件にする。
exact comment_text一致を成功条件にする。
Gateを緩めて表示率だけを上げる。
family policyを完成文テンプレートとして扱う。
generic/repeated検知をpublic本文として出す。
read_feelingをmachine metricsやverdictから自動補完する。
P5履歴線でcurrent-only読感不足を隠す。
required regression missing / timeoutをP5 readyとして扱う。
```


# 2026-06-11 差分追記: EmlisAI P5 User Label Connection P5-0〜P5-7 rule / test index

EmlisAI User Label Connection P5を触る場合は、P5-0〜P5-7がbody-free / ratings-only / limited visible / no-contract-change境界でつながっていることを同時確認する。P5は履歴線を使うが、current-only読感不足を覆うための深読みではなく、既存comment_textを主役にした短い補助線としてのみ扱う。

| 領域 | 必ず確認するfile | 触る時 |
|---|---|---|
| P5-0 Readiness Freeze | `emlis_ai_user_label_connection_p5_readiness.py`, `test_emlis_ai_user_label_connection_p5_readiness_freeze_20260611.py` | P4-10 handoff、current-only readfeel re-check、P5 entry allowed / holdを触る時。 |
| P5-1 Visibility Boundary | `emlis_ai_user_label_connection_p5_visibility_boundary.py`, `test_emlis_ai_user_label_connection_p5_visibility_boundary_20260611.py` | Plus/Premium owned history、existing comment_text、existing gates、Free/current-only境界を触る時。 |
| P5-2 Eligibility Matrix | `emlis_ai_user_label_connection_p5_eligibility_matrix.py`, `test_emlis_ai_user_label_connection_p5_eligibility_matrix_20260611.py` | connectable family、edge family、review_required / meta_only / blocked分類を触る時。 |
| P5-3 Surface Role Plan | `emlis_ai_user_label_connection_p5_surface_role_plan.py`, `test_emlis_ai_user_label_connection_p5_surface_role_plan_20260611.py` | current observation first、history support line、forbidden roleを触る時。 |
| P5-4 Safety Guard | `emlis_ai_user_label_connection_p5_safety_guard.py`, `test_emlis_ai_user_label_connection_p5_safety_guard_20260611.py` | creepy / overclaim / self-blame / always / cause / diagnosis / advice claimを触る時。 |
| P5-5 Ratings-only Product QA | `emlis_ai_user_label_connection_p5_product_quality_review.py`, `test_emlis_ai_user_label_connection_p5_product_quality_review_20260611.py` | history_connection_naturalness、creepy_absence、overclaim_absence、current_input_not_masked_by_history等のratings-only QAを触る時。 |
| P5-6 Limited Visible Connection | `emlis_ai_user_label_connection_p5_limited_visible_connection.py`, `test_emlis_ai_user_label_connection_p5_limited_visible_connection_20260611.py` | existing comment_textへのhistory-line support section接続、public/RN契約維持を触る時。 |
| P5-7 Regression / P6 Hold | `emlis_ai_user_label_connection_p5_regression_handoff.py`, `test_emlis_ai_user_label_connection_p5_regression_handoff_20260611.py` | P6 ready / P6 hold / P5 continue / P4 return、required regression suiteを触る時。 |

禁止:

```text
P5履歴線でcurrent-only読感不足を隠す。
Free tierでhistory / user dictionaryを使う。
evidence_record_count < 2 で履歴線を出す。
low_information / safety adjacent / self_denial / target judgementへ初期P5 visibleを出す。
creepy / overclaim / self-blame / always / cause / diagnosis / advice claimをvisibleへ通す。
ratings-only QAへraw input、comment_text body、reviewer free textを保持する。
P5 Product Quality QA passをrelease_allowedへ変換する。
P6 readyをP6実装済みまたはpublic release可能と読む。
RN表示条件、API route、request key、public response top-level key、DB physical schemaを増やす。
```

# 2026-06-12 差分追記: EmlisAI P6 Structure Insight v2 P6-0〜P6-9 rule / test index

EmlisAI Structure Insight v2を触る場合は、P6-0〜P6-9がbody-free / ratings-only / limited family / no-contract-change境界でつながっていることを同時確認する。P6は「深い分析文を増やす工程」ではなく、P4 current-only読感とP5履歴線を壊さず、限定familyだけで安全な構造気づき候補をP7へ渡せるかを判定する工程である。

| 領域 | 必ず確認するfile | 触る時 |
|---|---|---|
| P6-0 Entry Freeze | `emlis_ai_structure_insight_p6_entry_freeze.py`, `test_emlis_ai_structure_insight_p6_entry_freeze_20260611.py` | P5-7 handoff、P6 entry allowed / hold、P5/P4 returnを触る時。 |
| P6-1 Inventory | `emlis_ai_structure_insight_p6_inventory.py`, `test_emlis_ai_structure_insight_p6_inventory_20260611.py` | 既存Structure Insight candidate / gate / surface / long-run gateの流用範囲を触る時。 |
| P6-2 Family Boundary | `emlis_ai_structure_insight_p6_family_boundary.py`, `test_emlis_ai_structure_insight_p6_family_boundary_20260611.py` | target family、no-connect family、daily / low-info / safety adjacent suppressionを触る時。 |
| P6-3 Relation Policy | `emlis_ai_structure_insight_p6_relation_policy.py`, `test_emlis_ai_structure_insight_p6_relation_policy_20260611.py` | relation family risk、initial visible / review / meta-only / blockedを触る時。 |
| P6-4 Quality Rubric | `emlis_ai_structure_insight_p6_quality_rubric.py`, `test_emlis_ai_structure_insight_p6_quality_rubric_20260611.py` | ratings-only評価、read_feeling / insight_delta / forbidden claim absenceを触る時。 |
| P6-5 Gate Hardening | `emlis_ai_structure_insight_p6_gate_hardening.py`, `test_emlis_ai_structure_insight_p6_gate_hardening_20260611.py` | soft expression、diagnosis / personality / cause / advice / future prediction / target judgement blockを触る時。 |
| P6-6 Surface Role Plan | `emlis_ai_structure_insight_p6_surface_role_plan.py`, `test_emlis_ai_structure_insight_p6_surface_role_plan_20260611.py` | `structure_question` limited plan、insight seed count、section placementを触る時。 |
| P6-7 Family Review | `emlis_ai_structure_insight_p6_family_review.py`, `test_emlis_ai_structure_insight_p6_family_review_20260611.py` | `long_meaning_arc` / `self_understanding_follow` のallow / hold / blockを触る時。 |
| P6-8 Product QA | `emlis_ai_structure_insight_p6_product_quality_review.py`, `test_emlis_ai_structure_insight_p6_product_quality_review_20260611.py` | ratings-only Product QA、unsafe / weak / ready、P7 field candidatesを触る時。 |
| P6-9 Regression Handoff | `emlis_ai_structure_insight_p6_regression_handoff.py`, `test_emlis_ai_structure_insight_p6_regression_handoff_20260611.py` | P7 ready / hold / P6 continue / P5 return / P4 returnを触る時。 |

禁止:

```text
P6 fixture本文をruntime条件にする。
Structure Insight用public response keyを追加する。
Gateを緩めて深い文を通す。
daily / low-information / positive-only / safety adjacentへ深いinsightを強制する。
soft markerだけで診断・原因・人格・相手判断を通す。
P5履歴線やP6 insightでcurrent-only読感不足を隠す。
ratings-only QAへraw input、comment_text body、candidate body、reviewer free textを保持する。
P6 Product QA / regression handoffをrelease_allowedへ変換する。
```


# 2026-06-12 差分追記: EmlisAI P7 Product Quality Runner / Long-run Product Gate rule / test index

EmlisAI P7を触る場合は、P7-0〜P7-9がbody-free / red-preserving / release-closed境界でつながっていることを同時確認する。P7は「商品品質を通ったことにするrunner」ではなく、P5/P6後続の測定材料、赤、HOLD、timeout、release handoff materialを分けるbackend内部構造として読む。

| 領域 | 必ず確認するfile | 触る時 |
|---|---|---|
| P7-0 Handoff Normalizer | `emlis_ai_p7_contracts.py`, `emlis_ai_p7_handoff_normalizer.py`, `test_emlis_ai_p7_handoff_normalizer_20260612.py` | P5/P6 handoff、body-free intake、P7 ready false境界を触る時。 |
| P7-1 Red Ledger | `emlis_ai_p7_red_ledger.py`, `test_emlis_ai_p7_red_ledger_20260612.py` | P7-RED-001〜003、P7-HOLD-001〜004、P7-OUT-001〜008を触る時。 |
| P7-2 Module Inventory | `emlis_ai_p7_module_inventory.py`, `test_emlis_ai_p7_module_inventory_20260612.py` | 既存Product Quality moduleのreuse / adapter / heavy isolation / release decision isolationを触る時。 |
| P7-3 Runner Plan | `emlis_ai_p7_runner_plan.py`, `test_emlis_ai_p7_runner_plan_20260612.py` | runner group、command matrix、timeout budget、heavy E2E isolationを触る時。 |
| P7-4 Event Bridge | `emlis_ai_p7_event_bridge.py`, `test_emlis_ai_p7_event_bridge_20260612.py` | ProductQualityEvent bridge、P7ScorecardRow、body-free flagsを触る時。 |
| P7-5 Evaluation Matrix | `emlis_ai_p7_evaluation_matrix.py`, `test_emlis_ai_p7_evaluation_matrix_20260612.py` | family / sequence / history-line evaluation matrixを触る時。 |
| P7-6 Blind QA Material | `emlis_ai_p7_blind_qa_material.py`, `test_emlis_ai_p7_blind_qa_material_20260612.py` | ratings-only Blind QA material、review_missing / rating_requiredを触る時。 |
| P7-7 Long-run Gate Handoff | `emlis_ai_p7_long_run_gate_handoff.py`, `test_emlis_ai_p7_long_run_gate_handoff_20260612.py` | long-run candidate material、history-line value growth、risk aggregationを触る時。 |
| P7-8 Release Handoff | `emlis_ai_p7_release_handoff.py`, `test_emlis_ai_p7_release_handoff_20260612.py` | release decision handoff material、release_decision_input_ready / release_allowed分離を触る時。 |
| P7-9 Validation Matrix | `emlis_ai_p7_validation_matrix.py`, `test_emlis_ai_p7_validation_matrix_20260612.py`, `docs/Cocolon_EmlisAI_P7_ProductQualityRunner_ImplementationResult_20260612.md` | green claim scope、RED/HOLD/timeout isolation、implementation resultを触る時。 |

禁止:

```text
P7 core greenをP7 completeと読む。
existing Product Quality subset greenをfull backend suite greenと読む。
Positive Recovery赤を古いtest扱いで閉じる。
Product Quality Connection E2E timeoutを環境扱いで閉じる。
P5/P6 HOLDやhuman QA未完をgreen化する。
read_feelingをmachine metricsで補完する。
Product Pass / Long-run candidateをRelease Readyへ変換する。
release_allowedをP7からtrueにする。
raw input / comment_text body / candidate body / surface body / reviewer free textをP7 materialへ入れる。
RN表示条件、API route、request key、public response top-level key、DB physical schemaを増やす。
```



# 2026-06-13 差分追記: EmlisAI P7 RED・HOLD Closure R0〜R12 rule / test index

EmlisAI P7 RED・HOLD closureを触る場合は、P7-0〜P7-9のbody-free measurementに加えて、R0〜R12のstrict relation / fail-closed / timeout isolation / HOLD matrix / release validation境界を同時確認する。R0〜R12時点ではP7-RED-001 / 002はclosed、P7-RED-003とP7-HOLD-001〜004は未解消として保持する。R13後はP7-RED-003もCLOSEDへ更新済みだが、P7-HOLD-001〜004は未解消として保持する。

| 領域 | 必ず確認するfile | 触る時 |
|---|---|---|
| R1 strict relation trace | `emlis_ai_relation_surface_contract.py`, `emlis_ai_complete_reply_diagnostics_service.py`, `test_emlis_ai_positive_recovery_strict_relation_trace_20260613.py` | `recovery` と `recovery_load_bridge` の混同、diagnostic trace、body-free metaを触る時。 |
| R2/R3 contract / Gate Recovery | `emlis_ai_relation_surface_contract.py`, `emlis_ai_gate_recovery_loop.py`, `test_emlis_ai_positive_recovery_r2_r3_contract_boundary_20260613.py` | relation type / signal key / marker key分離、合成ReaderReportを触る時。 |
| R4/R5 fail-closed | `emlis_ai_reply_service.py`, `emlis_ai_display_gate.py`, `test_emlis_ai_positive_recovery_r4_r5_fail_closed_boundary_20260613.py`, `test_emlis_ai_complete_product_quality_positive_recovery_e2e.py` | Positive Recoveryのrelation surface missing / rejected / comment_text empty境界を触る時。 |
| R6 timeout isolation | `emlis_ai_p7_timeout_isolation.py`, `emlis_ai_p7_runner_plan.py`, `test_emlis_ai_p7_connection_e2e_timeout_isolation_20260613.py` | Product Quality Connection E2E timeout / hangをP7 core greenへ混ぜない境界を触る時。 |
| R7 red classification | `emlis_ai_p7_red_closure_classification.py`, `test_emlis_ai_p7_red_closure_classification_matrix_20260613.py` | P7-RED-001 / 002 / 003のclosed/classified/unresolved状態を触る時。 |
| R8 human QA boundary | `emlis_ai_p7_blind_qa_material.py`, `emlis_ai_p7_event_bridge.py`, `test_emlis_ai_p7_r8_human_qa_material_boundary_20260613.py` | P5 human QA material、ratings-only、reviewer free text exclusionを触る時。 |
| R9 P6 visible boundary | `emlis_ai_p7_event_bridge.py`, `emlis_ai_p7_validation_matrix.py`, `test_emlis_ai_p7_r9_p6_visible_expansion_boundary_20260613.py` | structure_question限定visible、meta-only/no-connect family boundaryを触る時。 |
| R10 HOLD matrix | `emlis_ai_p7_hold_matrix.py`, `test_emlis_ai_p7_r10_real_device_full_backend_hold_matrix_20260613.py` | 実機submit / modal読感未確認、full backend suite未実行を触る時。 |
| R11 release / validation | `emlis_ai_p7_release_handoff.py`, `emlis_ai_p7_validation_matrix.py`, `test_emlis_ai_p7_r11_release_validation_final_alignment_20260613.py` | release_allowed=false、P7 complete false、P8 start falseの最終整合を触る時。 |
| R12 implementation result | `docs/Cocolon_EmlisAI_P7_RedHoldClosure_ImplementationResult_20260613.md` | R0〜R11実装結果、green/red/timeout/unverified、次工程を確認する時。 |

確認済みテスト読み:

```text
R0〜R11主要確認suite: 34 passed
P7 core + R6〜R11: 70 passed
既存Product Quality reuse subset: 31 passed
Product Quality Connection E2E: timeout / EXIT_STATUS:124
```

禁止:

```text
P7-RED-003 timeoutを環境問題として閉じる。
R0〜R11主要suite greenをfull backend suite greenと読む。
P7 core + R6〜R11 greenをP7 completeと読む。
P5 human QA material boundaryをhuman QA完了と読む。
P6 visible expansion blockedをvisible拡張済みと読む。
R10 HOLD matrixを実機submit確認済みと読む。
release handoff materialをrelease_allowedと読む。
P8へ進むためにHOLDをgreen化する。
```


# 2026-06-13 差分追記: EmlisAI P7-RED-003 Body-Free Leak Guard Repair R13 rule / test index

EmlisAI P7-RED-003 body-free leak guard repairを触る場合は、R13-0〜R13-11のbody-free contract / helper / E2E / classification / validation / release handoffを同時確認する。R13はtestを甘くする工程ではなく、raw body leak検査を構造化し、safe rubric vocabularyの誤検知を分離する工程である。

| 領域 | 必ず確認するfile | 触る時 |
|---|---|---|
| R13 contract / helper | `emlis_ai_p7_body_free_leak_guard.py`, `test_emlis_ai_p7_body_free_leak_guard_contract_20260613.py`, `test_emlis_ai_p7_body_free_leak_guard_20260613.py` | current_input key/raw body/input id、safe rubric vocabulary、failure output policyを触る時。 |
| Product Quality Connection E2E | `test_emlis_ai_complete_product_quality_connection_e2e.py` | scorecard body-free boundary、raw memo / memo_action / source_text / current_input object混入検査を触る時。 |
| timeout observation | `emlis_ai_p7_timeout_isolation.py`, `test_emlis_ai_p7_connection_e2e_timeout_isolation_20260613.py` | P7-RED-003のTIMEOUT_ISOLATED / PASSED_ISOLATED扱いを触る時。 |
| red closure classification | `emlis_ai_p7_red_closure_classification.py`, `test_emlis_ai_p7_red_closure_classification_matrix_20260613.py` | P7-RED-003をCLOSED / unresolvedに分類する境界を触る時。 |
| validation matrix | `emlis_ai_p7_validation_matrix.py`, `test_emlis_ai_p7_validation_matrix_20260612.py` | product_quality_connection_timeout_closed、closed_red_refs、p7_complete falseを触る時。 |
| release handoff | `emlis_ai_p7_release_handoff.py`, `test_emlis_ai_p7_release_handoff_20260612.py`, `test_emlis_ai_p7_r11_release_validation_final_alignment_20260613.py` | RED-003 closed伝播、unresolved_timeout_refs空、P7-HOLD保持、release_allowed=falseを触る時。 |
| R13 result docs | `docs/Cocolon_EmlisAI_P7_RED003_R13_*.md`, `docs/Cocolon_EmlisAI_P7_RED003_BodyFreeLeakGuardRepair_ImplementationResult_20260613.md` | R13各段階の実装結果、検証結果、未確認、推測禁止を確認する時。 |

確認済みテスト読み:

```text
R13 related minimum / validation / release subset: 40 passed
Product Quality Connection E2E timeout wrapper: 1 passed / EXIT_STATUS:0
P7 core + R6〜R11 subset: 72 passed
既存Product Quality reuse subset: 31 passed
RN contract: 36 passed
```

禁止:

```text
current_input safe vocabulary許可をraw current_input許可へ拡張する。
body-free helperを通したからraw body検査不要と読む。
Product Quality Connection E2E greenをP7 completeと読む。
P7-RED-003 closedをP8 start allowedやrelease_allowedへ変換する。
R13 subset greenをfull backend suite greenと読む。
RN contract greenを実機submit / modal読感確認済みと読む。
P7-HOLD-001〜004を閉じる。
```

# 2026-06-13 差分追記: EmlisAI P7-HOLD-004 Phase16 Composer Red Classification R0〜R9 rule / test index

EmlisAI P7-HOLD-004 Phase16 Complete Composer red classificationを触る場合は、R0〜R9のclassification / path matrix / candidate-display boundary / metadata summary / adjacent red / validation・release handoff / implementation result documentを同時確認する。R0〜R9はP7-HOLD-004を閉じる工程ではなく、full backend suite green未確認HOLDの中身を次赤へ進められる粒度に分けるbackend internal-only差分である。

| 領域 | 確認するfile | 触る時の意味 |
|---|---|---|
| R0/R1 classification | `emlis_ai_p7_hold004_phase16_composer_classification.py`, `test_emlis_ai_p7_hold004_phase16_composer_classification_20260613.py` | Phase16 Complete Composer redをbody-freeに分類し、P7-HOLD-004 unresolvedを保持する時。 |
| R2/R3 path matrix / decision | `emlis_ai_p7_hold004_path_matrix.py`, `test_emlis_ai_p7_hold004_path_matrix_decision_rule_20260613.py` | direct / conversation / public daily / adjacent public pathを分け、R4-A/R4-B判断を固定する時。 |
| R4-A runtime repair | `emlis_ai_complete_composer_client.py`, `test_emlis_ai_p7_hold004_r4_candidate_boundary_20260613.py` | two-stage surface structural readyとtone/display blockerを分け、candidate generationを復帰させる時。 |
| R4-B replacement design | `emlis_ai_p7_hold004_r4_contract_material.py`, `test_emlis_ai_p7_hold004_r4_candidate_boundary_replacement_20260613.py` | stale contract expectationの場合の置換設計materialを扱う時。今回の現行判断はR4-A。 |
| R5/R6 metadata / adjacent red | `emlis_ai_complete_composer_client.py`, `emlis_ai_p7_hold004_path_matrix.py`, `test_emlis_ai_p7_hold004_r5_r6_metadata_adjacent_boundary_20260613.py` | top-level composer_meta summaryとpositive public fixture adjacent red分離を触る時。 |
| R7/R8 matrix handoff | `emlis_ai_p7_hold_matrix.py`, `emlis_ai_p7_validation_matrix.py`, `emlis_ai_p7_release_handoff.py`, `test_emlis_ai_p7_hold004_r7_r8_validation_release_handoff_20260613.py` | HOLD-004 materialをP7 hold / validation / release handoffへ流し、closureしない境界を触る時。 |
| R9 implementation result | `docs/Cocolon_EmlisAI_P7_HOLD004_Phase16ComposerRedClassification_ImplementationResult_20260613.md`, `test_emlis_ai_p7_hold004_r9_implementation_result_handoff_20260613.py` | 実装結果document、doc path参照、non-closure claim、release false維持を確認する時。 |

確認済みvalidation:

```text
R0/R1 classification: 2 passed, 1 warning
R2/R3 path matrix / decision rule: 4 passed
R7/R8 validation / release handoff: 3 passed
target Phase16 Complete Composer: 2 passed
R9 implementation result / handoff: 3 passed
前提資料更新時spot確認: R9 implementation result / handoff = 3 passed
R7/R8 / target Phase16はR9実装結果documentの記録として保持。今回の前提資料更新ではfull backend suite green確認へ変換しない。
```

禁止:

```text
Phase16 target greenをfull backend suite greenと読む。
P7-HOLD-004をR9で閉じた扱いにする。
generatedをpublic display permissionと同一視する。
Gate / Display / Grounding / Template / Toneを緩める。
fixed commentText / case専用branchを追加する。
adjacent public redをdaily_A target修復で閉じた扱いにする。
P7 complete / P8 start allowed / release_allowedをtrueにする。
```

# 2026-06-13 差分追記: P7-HOLD-004 Phase16 Composer Red Classification R0〜R9必読索引

P7-HOLD-004 / full backend suite切り分け / Phase16 Complete Composer candidate boundaryを触る場合、次を先に読む。

## 実装結果doc

| path | 何を拘束するか |
|---|---|
| `mashos-api/ai/docs/Cocolon_EmlisAI_P7_HOLD004_Phase16ComposerRedClassification_ImplementationResult_20260613.md` | R0〜R9の実装結果、target green、adjacent public red、full backend suite未確認、P7/P8/release false維持を固定する。 |

## P7-HOLD-004 classification / matrix / contract material

| path | 何を拘束するか |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_phase16_composer_classification.py` | Phase16 Complete Composer redをbody-free classified materialとして扱う。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_path_matrix.py` | direct / conversation / public daily / adjacent public pathを混ぜない。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_r4_contract_material.py` | stale contract replacement候補を保持するが、現行R3判断ではR4-Aを選ぶ。 |

## 修正owner

| path | 読むべき理由 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_complete_composer_client.py` | candidate generation と tone/display readiness の境界修復owner。Gate緩和・public表示許可ではない。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py` | HOLD-004 Phase16 materialをP7 hold matrixへ接続するowner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py` | HOLD-004 classified red / implementation result doc参照 / full suite green falseを保持するowner。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py` | release handoffへHOLD-004 follow-upを渡しつつrelease_allowed=falseを維持するowner。 |

## regression test

```text
mashos-api/ai/tests/test_emlis_ai_p7_hold004_phase16_composer_classification_20260613.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_path_matrix_decision_rule_20260613.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_r4_candidate_boundary_20260613.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_r4_candidate_boundary_replacement_20260613.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_r5_r6_metadata_adjacent_boundary_20260613.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_r7_r8_validation_release_handoff_20260613.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_r9_implementation_result_handoff_20260613.py
```

この索引で禁止する誤読:

```text
Phase16 target green = full backend suite green
HOLD-004 registered = HOLD-004 closed
R9 doc added = release ready
candidate generated = public display allowed
R4-A repair = Gate relaxation
adjacent public red = daily_A修復でclosed
```

# 2026-06-14 差分追記: EmlisAI P7-HOLD-004 Positive Public Shape Boundary R0〜R8 rule / test index

EmlisAI P7-HOLD-004 Positive Public Shape Boundaryを触る場合は、Phase16 Composer Red Classification R0〜R9に加えて、R0〜R8のpositive public shape / expression-difficulty / safety regression / matrix / handoff / implementation result documentを同時確認する。R0〜R8はP7-HOLD-004を閉じる工程ではなく、positive public targetをgreenにしつつfull backend suite未確認を残すbackend internal-only差分である。

| 領域 | 確認するfile | 触る時の意味 |
|---|---|---|
| R0/R1 positive boundary material | `emlis_ai_p7_hold004_positive_public_shape_boundary.py`, `test_emlis_ai_p7_hold004_positive_public_shape_boundary_20260614.py` | positive public adjacent redをbody-freeに分類し、release/P8/P7 complete falseを固定する時。 |
| R2 safety triage boundary | `emlis_ai_safety_triage.py` | expression difficultyとtrue self-denialを分け、emergency/support requiredを維持する時。 |
| R3 material route | `emlis_ai_input_material_bundle.py`, `test_emlis_ai_p7_hold004_positive_public_shape_boundary_20260614.py` | positive inputが `safety_triage_required` に潰れずeligible materialとして扱われるか確認する時。 |
| R4 public E2E | `test_emlis_ai_p7_hold004_positive_public_shape_boundary_20260614.py` | `/emotion/submit` public pathがlabelled two-stageへ戻り、self_denial candidateへ戻らないことを確認する時。 |
| R5 safety regression | `emlis_ai_safety_triage.py`, `test_emlis_ai_safety_triage_response_contract.py`, `test_emlis_ai_public_surface_requirement_p1.py`, `test_emlis_ai_gate_recovery_public_candidate_builder_p5.py` | true self-denial / emergency / support requiredを通常観測へ戻していないか確認する時。 |
| R6/R7 matrix / validation / release handoff | `emlis_ai_p7_hold_matrix.py`, `emlis_ai_p7_validation_matrix.py`, `emlis_ai_p7_release_handoff.py` | positive boundary target greenをP7 matrixへ渡しつつ、HOLD-004 close / full suite green / release_allowedをfalseに保つ時。 |
| R8 implementation result | `docs/Cocolon_EmlisAI_P7_HOLD004_PositivePublicShapeBoundary_ImplementationResult_20260614.md` | R0〜R8実装結果、確認済み、未確認、doc path/ref、非release境界を確認する時。 |

確認済みvalidation:

```text
R8実装結果doc内記録:
  py_compile: passed
  R0〜R8 target file including R4 public E2E: 24 passed, 1 warning
  R0〜R8 target subset excluding R4 public E2E: 23 passed, 1 deselected
  release / validation / handoff related subset: 36 passed, 1 deselected
  R4 public E2E single target: 1 passed, 1 warning

前提資料更新時spot確認:
  py_compile: passed
  tests/test_emlis_ai_p7_hold004_positive_public_shape_boundary_20260614.py -k 'not r4_emotion_submit': 23 passed, 1 deselected
```

禁止:

```text
positive public shape target greenをfull backend suite greenと読む。
R8 doc追加をP7-HOLD-004 closureと読む。
release handoff doc refをrelease_allowedの根拠にする。
self-denial false positive修正をsafety gate relaxationと読む。
true self-denial / emergency / support requiredを通常観測へ戻す。
positive_change_after_work_streaming専用branchやfixed commentTextで通す。
R4-B positive transition material ruleを、不要確認後に追加する。
RN表示条件、API route、request key、public response top-level key、DB physical schemaを増やす。
```

# 2026-06-14 差分追記: EmlisAI P7-HOLD-004 Step5 Candidate Gate Preservation R0〜R12 rule / test index

EmlisAI P7-HOLD-004 Step5 Candidate Gate Preservation / Display Binding Contract Consistencyを触る場合は、R0〜R12のclassification / display binding decision / stale expectation replacement / mixed HOLD material / Step5 meta / validation・release handoff / implementation result documentを同時確認する。R0〜R12はP7-HOLD-004を閉じる工程ではなく、Step5赤を閉じられる範囲と残HOLDへ分けるbackend internal-only差分である。

| 領域 | 必ず確認するfile | 触る時 |
|---|---|---|
| R0〜R6 classification material | `emlis_ai_p7_hold004_step5_candidate_gate_classification.py`, `test_emlis_ai_p7_hold004_step5_candidate_gate_classification_20260614.py` | Step5赤ID、conflict matrix、Decision Rule、owner layer、R4C/R4D、R5/R6 material helperを触る時。 |
| Display binding decision | `emlis_ai_display_gate.py` | `display_sentence_binding_missing`、binding_missing without exception、comment_text allowed / blocked を触る時。 |
| Display expected count source | `emlis_ai_limited_composer_extension_baseline.py` | Display binding trace / expected count source / `binding_missing=false` alignmentを触る時。 |
| Step5 diagnostic meta | `emlis_ai_reply_service.py` | candidate path、Gate保存、Display binding consistency、public assignment consistency のbody-free metaを触る時。 |
| P7 hold matrix | `emlis_ai_p7_hold_matrix.py` | Step5 display-binding redとR4D mixed HOLD materialをP7-HOLD-004に残す時。 |
| P7 validation matrix | `emlis_ai_p7_validation_matrix.py` | Step5 display-binding material、validation row、full suite green false、P7 complete falseを触る時。 |
| release handoff | `emlis_ai_p7_release_handoff.py` | Step5 implementation result doc ref、release blockers、release_allowed=falseを触る時。 |
| stale expectation replacement | `test_emlis_ai_complete_initial_entry_route.py`, `test_emlis_ai_complete_initial_step7_integration.py` | 古いpublic-empty fail-closed期待をGate保存 / binding consistency / body-free boundaryへ置換した契約を触る時。 |
| R7/R8 target subset | `test_emlis_ai_p7_hold004_step5_r7_r8_target_subset_validation_20260614.py` | target/subset validation、body leak absence、HOLD material retentionを確認する時。 |
| R12 result doc | `docs/Cocolon_EmlisAI_P7_HOLD004_Step5CandidateGatePreservationRedClassification_ImplementationResult_20260614.md` | R0〜R12の実装結果、full backend maxfail未完走、次赤未取得、non-closure claimを確認する時。 |

確認済みvalidation:

```text
前提資料更新時spot確認:
  py_compile relevant Step5 / P7-HOLD-004 files: ok
  R0〜R8 classification / target tests: 22 passed

R12 implementation result doc内記録:
  R8 subset: 7 passed
  full backend suite collect-only: 2673 tests collected / exit_status=0
  full backend suite maxfail=1: attempted / completed=false / next_red_captured=false
```

禁止:

```text
Step5 target greenをfull backend suite greenと読む。
R4-C stale expectation replacementをtest期待の単純緩和と読む。
Display binding trace alignmentをGate緩和と読む。
public_comment_text_presentだけを表示許可根拠にする。
R12 doc追加をP7-HOLD-004 closureと読む。
collect-only成功をfull backend suite greenと読む。
full backend maxfail attemptedを次赤取得済みと読む。
P7 complete / P8 start allowed / release_allowedをtrueにする。
```

# 2026-06-15 差分追記: EmlisAI P7-HOLD-004 Backend Suite Split / Matrix Consistency R0〜R12 rule / test index

EmlisAI P7-HOLD-004 Backend Suite Split / Matrix Consistencyを触る場合は、Step5 Candidate Gate Preservation R0〜R12に加えて、R0〜R12のcollect baseline / group inventory / execution plan / result normalizer / execution summary / matrix consistency / minimal group execution orderを同時確認する。R0〜R12はP7-HOLD-004を閉じる工程ではなく、full backend suite未確認をbody-freeに分割して読むためのbackend internal-only差分である。

## Backend suite split / matrix consistency owner

| 用途 | 必読ファイル | 読む理由 |
|---|---|---|
| R0/R1 collect baseline | `emlis_ai_p7_hold004_backend_suite_split_consistency.py`, `test_emlis_ai_p7_hold004_backend_suite_collect_baseline_20260614.py` | 416 files / 2673 tests / 1 warning、body-free、release false、full suite green falseを固定する時。 |
| R2/R3 inventory / plan | `emlis_ai_p7_hold004_backend_suite_group_inventory_plan.py`, `test_emlis_ai_p7_hold004_backend_suite_group_inventory_20260614.py`, `test_emlis_ai_p7_hold004_backend_suite_execution_plan_20260614.py` | 13 group / 19 batch / timeout budget / capture-confirmation分離を確認する時。 |
| R4/R5 result / summary | `emlis_ai_p7_hold004_backend_suite_execution_results.py`, `test_emlis_ai_p7_hold004_backend_suite_group_result_20260614.py`, `test_emlis_ai_p7_hold004_backend_suite_execution_summary_20260614.py` | PASS / FAIL / TIMEOUT / NOT_RUNなどのstatus正規化とexecution summaryを触る時。 |
| R6/R7 backend split / R10 hold | `emlis_ai_p7_hold_matrix.py`, `test_emlis_ai_p7_hold004_backend_suite_matrix_connection_20260615.py` | execution summaryとRED closure正本をbackend split / R10 hold matrixへ渡す時。 |
| R8/R9 release / validation | `emlis_ai_p7_release_handoff.py`, `emlis_ai_p7_validation_matrix.py`, `test_emlis_ai_p7_hold004_release_validation_connection_20260615.py` | release handoff / validation matrixへsplit summaryとmatrix consistencyを接続する時。 |
| R10 matrix consistency | `emlis_ai_p7_hold004_matrix_consistency_report.py`, `test_emlis_ai_p7_hold004_matrix_consistency_report_20260615.py` | backend_split / R10 / release_handoff / validationのRED/HOLD/release false整合を見る時。 |
| R11 minimal execution order | `emlis_ai_p7_hold004_group_execution_minimal_order.py`, `test_emlis_ai_p7_hold004_group_execution_minimal_order_20260615.py` | group_02_p7_hold004から走らせ、fail/timeoutで止める最小確認順を見る時。 |
| R12 result doc | `docs/Cocolon_EmlisAI_P7_HOLD004_BackendSuiteSplit_MatrixConsistency_ImplementationResult_20260615.md` | R0〜R12の実装結果、検証結果、未確認、前提資料反映diffを確認する時。 |

前提資料更新時に確認した結果:

```text
py_compile relevant R0〜R11 files: ok
R0〜R11 added tests: 183 passed
R0〜R11 + existing P7 subset: 207 passed
```

禁止する読み方:

```text
R0〜R12 material実装をP7-HOLD-004 closureと読む。
13 group inventory作成をgroup execution完了と読む。
default matrix consistency PASSをrelease readyと読む。
R0〜R11 test greenをfull backend suite greenと読む。
release_allowed / p7_complete / p8_start_allowedをtrueにする。
```


# 2026-06-15 差分追記: EmlisAI P7-HOLD-004 Current Snapshot Baseline Reconcile R13〜R20 rule / test index

EmlisAI P7-HOLD-004 Current Snapshot Baseline Reconcileを触る場合は、Backend Suite Split / Matrix Consistency R0〜R12に加えて、R13〜R20のcurrent baseline reconcile / active collect baseline / group inventory / execution plan / execution summary / matrix reconnect / official group_02 adoption rule / implementation result documentを同時確認する。

R13〜R20はP7-HOLD-004を閉じる工程ではなく、old baseline 416 / 2673をcurrent baselineとして扱わないためのbackend internal-only差分である。

| 用途 | 必読ファイル | 読む理由 |
|---|---|---|
| R13 reconcile material | `emlis_ai_p7_hold004_current_snapshot_baseline_reconcile.py`, `test_emlis_ai_p7_hold004_backend_suite_collect_baseline_20260614.py` | previous/current baselineを混同していないか確認する時。 |
| R14 collect baseline | `emlis_ai_p7_hold004_backend_suite_split_consistency.py`, `test_emlis_ai_p7_hold004_backend_suite_collect_baseline_20260614.py` | active collect baselineが425 files / 2856 tests / 1 warningであることを確認する時。 |
| R15 group inventory | `emlis_ai_p7_hold004_backend_suite_group_inventory_plan.py`, `test_emlis_ai_p7_hold004_backend_suite_group_inventory_20260614.py` | group_02が19 files / 252 tests、totalが425 / 2856であることを確認する時。 |
| R16 execution plan / minimal order | `emlis_ai_p7_hold004_backend_suite_group_inventory_plan.py`, `emlis_ai_p7_hold004_group_execution_minimal_order.py`, `test_emlis_ai_p7_hold004_backend_suite_execution_plan_20260614.py`, `test_emlis_ai_p7_hold004_group_execution_minimal_order_20260615.py` | first_capture_group_idとcurrent plan connectionを確認する時。 |
| R17 execution summary | `emlis_ai_p7_hold004_backend_suite_execution_results.py`, `test_emlis_ai_p7_hold004_backend_suite_execution_summary_20260614.py`, `test_emlis_ai_p7_hold004_backend_suite_group_result_20260614.py` | group result / summaryがcurrent baselineを参照しているか確認する時。 |
| R18 matrix reconnect | `emlis_ai_p7_hold004_matrix_consistency_report.py`, `emlis_ai_p7_hold_matrix.py`, `emlis_ai_p7_release_handoff.py`, `emlis_ai_p7_validation_matrix.py` | matrix / handoff / validationが同じcurrent baselineを読んでいるか確認する時。 |
| R19 official group_02 adoption | `emlis_ai_p7_hold004_backend_suite_execution_results.py`, `test_emlis_ai_p7_hold004_backend_suite_group_result_20260614.py` | official group_02 capture resultを採用できる条件を確認する時。 |
| R20 implementation result | `mashos-api/ai/docs/Cocolon_EmlisAI_P7_HOLD004_CurrentSnapshotBaselineReconcile_ImplementationResult_20260615.md` | 確認済み / 未確認 / 書かれていない / 推測禁止を確認する時。 |

検証基準として読む結果:

```text
py_compile relevant R13〜R20 files: ok
R13〜R20 target tests: 183 passed
full collect-only: 2856 tests collected / 1 warning
group_02 collect-only: 252 tests collected / 1 warning
```

禁止する読み:

```text
R13〜R20完了をP7-HOLD-004 closureと読む。
current collect-onlyをfull backend suite greenと読む。
group_02 collect-only / ad hoc passをofficial resultと読む。
R19 adoption rule fixedをofficial run executedと読む。
old baseline idのrun resultをcurrent official resultへ混ぜる。
release_allowed / p8_start_allowedをtrueにする。
```

# 2026-06-16 差分追記: EmlisAI P7-HOLD-004 Received Snapshot Baseline Fingerprint Reconcile R21〜R29 rule / test index

EmlisAI P7-HOLD-004 Received Snapshot Baseline Fingerprint Reconcileを触る場合は、Current Snapshot Baseline Reconcile R13〜R20に加えて、R21〜R29のreceived snapshot scope / collect summary / fingerprint reconcile / adoption evidence / official group_02 readiness / timeout policy / verification procedureを同時確認する。

R21〜R29はP7-HOLD-004を閉じる工程ではなく、received snapshot mismatchをbody-freeに分類してofficial capture前に止めるbackend internal-only差分である。

| 用途 | 必読ファイル | 読む理由 |
|---|---|---|
| R21/R22 received scope / collect summary | `emlis_ai_p7_hold004_received_snapshot_baseline_fingerprint_reconcile.py`, `test_emlis_ai_p7_hold004_backend_suite_collect_baseline_20260614.py` | `received_zip_ref=mashos-api(148).zip` とactive source snapshotを混同せず、nodeid一覧やterminal outputなしでcollect summaryを読む時。 |
| R23/R24 reconcile / adoption decision | `emlis_ai_p7_hold004_received_snapshot_baseline_fingerprint_reconcile.py`, `test_emlis_ai_p7_hold004_backend_suite_collect_baseline_20260614.py` | count / warning / file hash / item hash / source identityを分け、item hash mismatch未分類ではactive baseline更新を止める時。 |
| R25 official group_02 readiness | `emlis_ai_p7_hold004_backend_suite_execution_results.py`, `test_emlis_ai_p7_hold004_backend_suite_group_result_20260614.py` | readiness blocked時にPASS形materialをofficial resultへ採用しない時。 |
| R26 matrix / handoff / validation | `emlis_ai_p7_hold004_matrix_consistency_report.py`, `emlis_ai_p7_hold_matrix.py`, `emlis_ai_p7_release_handoff.py`, `emlis_ai_p7_validation_matrix.py`, related matrix tests | received snapshot mismatch unresolvedをmatrix上もREVIEW_REQUIRED / blockerとして残す時。 |
| R27 / Pre-R29 adoption evidence | `emlis_ai_p7_hold004_received_snapshot_baseline_fingerprint_reconcile.py`, `test_emlis_ai_p7_hold004_backend_suite_collect_baseline_20260614.py` | manual booleanだけでactive baseline adoptionを成立させず、repeat collect / root cause / source identity / semantics / traceability evidenceを確認する時。 |
| R28 timeout policy | `emlis_ai_p7_hold004_backend_suite_execution_results.py`, `test_emlis_ai_p7_hold004_backend_suite_group_result_20260614.py` | group_02 TIMEOUTをgreenにも即FAILにもせず、long-run classification materialとして読む時。 |
| R29 verification procedure | `emlis_ai_p7_hold004_received_snapshot_baseline_fingerprint_reconcile.py`, `test_emlis_ai_p7_hold004_backend_suite_collect_baseline_20260614.py` | py_compile / focused subset / full collect-only / group_02 collect-only / group_02 conditional full runの読み方を固定する時。 |

検証基準として読む結果:

```text
py_compile relevant R21〜R29 files: ok
R25/R26 + R27/R28 + R29 focused subset: 85 passed
R21〜R29 P7-HOLD-004 target subset: 183 passed
full backend collect-only: 425 files / 2856 tests / 1 warning / item fingerprint 4698ce5240707f71fc3678a0153a15626ba9718fbadad83294e57d11946c2e0d
group_02 collect-only: 19 files / 252 tests / 1 warning
```

禁止する読み:

```text
received snapshot item fingerprintをactive baselineへ即採用する。
source_snapshot_refをmashos-api(148).zipへ昇格済みと読む。
full collect-onlyをexecution greenと読む。
group_02 collect-onlyをofficial greenと読む。
TIMEOUTをgreenまたは即FAILへ変換する。
R29完了をP7-HOLD-004 closureと読む。
release_allowed / p8_start_allowedをtrueにする。
```

# 2026-06-16 差分追記: EmlisAI P7-HOLD-004 Active Baseline Adoption Evidence / Runtime Builder Refresh R30〜R40 rule / test index

EmlisAI P7-HOLD-004 Active Baseline Adoption Evidence / Runtime Builder Refreshを触る場合は、R21〜R29に加えて、R30〜R40のadoption evidence / post-adoption active baseline / runtime builder refresh / official group_02 result recording / full backend suite gateを同時確認する。

R30〜R40はP7-HOLD-004を閉じる工程ではなく、received snapshot evidenceをactive baselineへ採用し、runtime material buildersへ反映し、次のofficial group_02 captureを実行できる状態へ進めるbackend internal-only差分である。

| 用途 | 必読ファイル | 読む理由 |
|---|---|---|
| R30〜R35 adoption evidence | `emlis_ai_p7_hold004_active_baseline_adoption_evidence.py`, `test_emlis_ai_p7_active_baseline_adoption_evidence_r30_r31_20260616.py`, `test_emlis_ai_p7_active_baseline_adoption_evidence_r32_r33_20260616.py`, `test_emlis_ai_p7_active_baseline_adoption_evidence_r34_r35_20260616.py` | repeat collect / source identity / root cause / semantics / adoption evidence / conditional gateを確認する時。 |
| R36〜R40 runtime refresh | `emlis_ai_p7_hold004_active_baseline_runtime_builder_refresh.py`, `test_emlis_ai_p7_active_baseline_runtime_builder_refresh_r36_r37_20260616.py`, `test_emlis_ai_p7_active_baseline_runtime_builder_refresh_r38_r39_20260616.py`, `test_emlis_ai_p7_active_baseline_runtime_builder_refresh_r40_20260616.py` | post-adoption active baseline / runtime builder refresh / matrix refresh / official group_02 result recording / full backend suite gateを確認する時。 |
| Runtime builder connection | `emlis_ai_p7_hold004_backend_suite_split_consistency.py`, `emlis_ai_p7_hold004_backend_suite_group_inventory_plan.py`, `emlis_ai_p7_hold004_backend_suite_execution_results.py`, `emlis_ai_p7_hold004_group_execution_minimal_order.py` | builder群がcurrent active baseline id `p7_hold004_backend_collect_baseline_20260615_received_148` を読んでいるか確認する時。 |
| Matrix / release / validation | `emlis_ai_p7_hold004_matrix_consistency_report.py`, `emlis_ai_p7_hold_matrix.py`, `emlis_ai_p7_release_handoff.py`, `emlis_ai_p7_validation_matrix.py` | received snapshot mismatch resolvedとactive baseline refresh appliedが伝播しているが、release / P8 / HOLD closureがfalseのままか確認する時。 |
| Historical reconcile boundary | `emlis_ai_p7_hold004_received_snapshot_baseline_fingerprint_reconcile.py` | R21〜R29のat-receipt materialを後から書き換えていないか確認する時。 |

検証基準として読む結果:

```text
py_compile relevant R30〜R40 implementation files: ok
R30〜R40 active baseline adoption / runtime refresh tests: 27 passed
group_02 collect-only: 19 files / 252 tests / 1 warning
full backend collect-only after R30〜R40 tests added: 431 files / 2883 tests / 1 warning
```

禁止する読み:

```text
R30〜R40完了をP7-HOLD-004 closureと読む。
post-adoption active baselineをfull backend suite greenと読む。
official group_02 readiness READYをgreenと読む。
result_status NOT_RUNを実行済みと読む。
group_02 isolated PASSだけでfull backend suite greenと読む。
release_allowed / p8_start_allowedをtrueにする。
```

# 2026-06-17 差分追記: EmlisAI P7-HOLD-004 Group02 Result / Current Snapshot Reconcile R41〜R46 rule / test index

EmlisAI P7-HOLD-004 Group02 Result / Current Snapshot Reconcileを触る場合は、R30〜R40に加えて、R41〜R46のgroup_02 local evidence / official result recording reconcile / current working snapshot collect drift / release projection / P5-P6 return decisionを同時確認する。

R41〜R46はP7-HOLD-004を閉じる工程ではなく、P5/P6へ戻る前にP7測定層が嘘をつかないようにするbackend internal-only差分である。

## 必読module / test

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_group02_result_current_snapshot_reconcile.py
mashos-api/ai/tests/test_emlis_ai_p7_group02_current_snapshot_reconcile_r41_r42_20260617.py
mashos-api/ai/tests/test_emlis_ai_p7_current_snapshot_collect_drift_r43_r44_20260617.py
mashos-api/ai/tests/test_emlis_ai_p7_projection_next_decision_r45_r46_20260617.py
```

## 維持確認する既存contract

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_active_baseline_runtime_builder_refresh.py
mashos-api/ai/tests/test_emlis_ai_p7_active_baseline_runtime_builder_refresh_r40_20260616.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_execution_results.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py
```

## 前提資料更新時確認

```text
py_compile R41〜R46 reconcile module: ok
R41〜R46 target contract tests: 23 passed
R40 regression: 4 passed
P5/P6 return boundary subset: 22 passed
group_02 collect-only: 19 files / 252 tests / 1 warning
full backend collect-only after R41〜R46 tests present: 434 files / 2906 tests / 1 warning
```

## 禁止する読み

```text
R41〜R46完了をP7-HOLD-004 closureと読む。
R42 PASSED_ISOLATEDをfull backend suite greenと読む。
R43/R44 collect drift classificationをactive baseline updateと読む。
R45 projectionをrelease permissionと読む。
R46 P5/P6 return decisionをP5/P6人間読感完了と読む。
group_03 deferredを永久禁止・永久不要と読む。
```

# 2026-06-18 差分追記: EmlisAI P7-R46 Display Contract / P5-P6 Return R0〜R14 rule / test index

EmlisAI P7-R46 Display Contract Red Classification / P5-P6 Returnを触る場合は、R0〜R14のsource lineage / public meta final-source consistency / P5-P6 handoff / real device closed validationを同時確認する。

R0〜R14はP7-HOLD-004を閉じる工程ではなく、P5/P6 human readfeelと実機modal確認へ戻る前に、表示契約と評価材料が嘘をつかないようにするbackend internal-only差分である。

| 用途 | 必読ファイル | 読む理由 |
|---|---|---|
| R0/R1 red ledger | `docs/Cocolon_EmlisAI_P7_R46_DisplayContractRedLedger_20260617.md` | RED-DC-001 / RED-DC-002の初期分類、body-free red ledger、Gate relaxationではないことを確認する時。 |
| R2/R3 source lineage / recovery lane | `docs/Cocolon_EmlisAI_P7_R46_SourceLineageRecoveryLaneMatrix_R2_R3_20260617.md`, `emlis_ai_gate_recovery_public_candidate_builder.py`, `emlis_ai_labelled_two_stage_surface_recomposition.py`, `emlis_ai_reply_service.py` | root / recovery_input / pre_public / final sourceを混同しない時。 |
| R4/R5 body-free lineage / RED-DC-001 | `emlis_ai_body_free_public_source_lineage.py`, `test_emlis_ai_body_free_public_source_lineage_r4_r5_20260617.py` | source lineageをpublic material化しても本文body leakしないこと、root sourceがfinal sourceで上書きされないことを確認する時。 |
| R6/R7 RED-DC-002 / display contract | `tests/test_emlis_ai_display_contract.py`, `test_emlis_ai_display_contract_lineage_semantics_r6_r7_20260617.py` | complete_initial pre-public attemptとlabelled final public sourceを意味別にassertする時。 |
| R8/R9 public meta guard | `emlis_ai_public_feedback_meta.py`, `test_emlis_ai_public_meta_final_source_consistency_guard_r8_r9_20260617.py` | public_surface_lineageがstale pre-public sourceをfinalとして出さないか確認する時。 |
| R10/R11 P5/P6 handoff | `emlis_ai_p7_r46_p5_p6_human_readfeel_handoff_material.py`, `test_emlis_ai_p7_r46_p5_p6_human_readfeel_handoff_material_r10_r11_20260617.py` | actual review body packetなしで、P5/P6 human readfeelへ渡すbody-free入口を確認する時。 |
| R12/R13 real device / closed validation | `emlis_ai_p7_r46_real_device_modal_review_closed_validation.py`, `test_emlis_ai_p7_r46_real_device_modal_review_closed_validation_r12_r13_20260617.py` | 実機未確認をNOT_RUNのまま保持し、P7 / release / P8を閉じているか確認する時。 |
| R14 next decision ledger | `emlis_ai_p7_r46_next_decision_handoff_ledger.py`, `test_emlis_ai_p7_r46_next_decision_handoff_ledger_r14_20260617.py` | branch A-E-X、次順、unresolved holds、release closed flagsを確認する時。 |

検証基準として読む結果:

```text
py_compile relevant R0〜R14 implementation files: ok
display contract: 5 passed
R4〜R14 combined: 33 passed
P5 major subset: 63 passed / 1 warning
P6 major subset: 43 passed
API public contract + two-stage reception E2E: 10 passed / 3 warnings
full backend collect-only: 440 files / 2934 tests / 1 warning
```

禁止する読み:

```text
R0〜R14完了をP7-HOLD-004 closureと読む。
display contract greenをP5/P6 human readfeel合格と読む。
P5/P6 handoff materialをactual review packet作成済みと読む。
real device checklistを実機modal読感確認済みと読む。
R14 branch Aをrelease permissionまたはP8 start allowedと読む。
full backend collect-onlyをexecution greenと読む。
```

# 2026-06-18 差分追記: EmlisAI P7-R47 Local Review Packet Policy R0〜R15 rule / test index

EmlisAI P7-R47 Local Review Packet Policyを触る場合は、R0〜R15のlocal-only storage / export denylist / body-full schema / body-free manifest / rating-blocker rows / reviewer notes / disposal / P5-P6-real-device packet policy / R46 ledger connection / contract test / validation matrix / touch boundaryを同時確認する。

R47はP5/P6/実機読感を完了する工程ではなく、本文入りreview packetを扱う前に、P7 materialへ本文やfree textを混ぜないためのbackend internal-only差分である。

## 必読module / test

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r47_local_review_packet_policy.py
mashos-api/ai/tests/test_emlis_ai_p7_r47_local_review_packet_policy_r0_r1_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r47_local_review_packet_policy_r2_r3_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r47_local_review_packet_policy_r4_r5_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r47_local_review_packet_policy_r6_r7_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r47_local_review_packet_policy_r8_r9_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r47_local_review_packet_policy_r10_r11_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r47_local_review_packet_policy_r12_r13_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r47_local_review_packet_policy_r14_r15_20260618.py
```

## 維持確認する既存contract

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r46_next_decision_handoff_ledger.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r46_p5_p6_human_readfeel_handoff_material.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r46_real_device_modal_review_closed_validation.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_contracts.py
mashos-api/ai/tests/test_emlis_ai_display_contract.py
```

## 前提資料更新時確認

```text
py_compile R47 policy module: ok
R47 R0/R1〜R14/R15 target: 275 passed
display + R46 regression + R47 R0/R1〜R14/R15: 308 passed
backend collect-only: 448 test files / 3209 tests / 1 warning
```

## 禁止する読み

```text
R47 policy readyをP5/P6/実機review完了と読む。
body-full packet schema固定をbody-full packet生成済みと読む。
P5 human Blind QA start allowed after policyをP5 confirmedと読む。
P6 packet policy固定をP6開始許可または完了と読む。
real device packet policy固定を実機modal確認済みと読む。
R47 target greenをfull backend suite greenと読む。
release_allowed / p7_complete / p8_start_allowed / hold004_close_allowedをtrueにする。
```

# 2026-06-19 差分追記: P7-R48 P5 Human Blind QA Actual Review Packet R0〜R18 rule索引

P7-R48 P5 human Blind QA actual review packet preparationを触る場合、次を同時確認する。

R48はP5/P6/実機読感を完了する工程ではなく、P5履歴線を人間が読むためのlocal-only/body-free境界、rating/blocker/disposal/handoff、candidate gate、regression/no-touch/touch boundaryを固定するbackend internal-only差分である。

## 必読module / test

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r0_r1_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r2_r3_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r4_r5_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r6_r7_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r8_r9_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r10_r11_20260619.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r12_r13_20260619.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r14_r15_20260619.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r16_r17_20260619.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r18_20260619.py
```

## 特に守る境界

```text
COCOLON_EMLIS_LOCAL_REVIEW_ROOT未設定ではbody-full generation不可。
valid root + explicit allowが揃ってもR48内ではbody-full packet本体を生成した扱いにしない。
reviewer-facing local packet schemaをbody-free materialへ混ぜない。
current_input_review_surface / returned_emlis_surface / bounded_owned_history_review_surface / reviewer free text / local absolute path / body hashを前提資料・release material・成果物zipへ残さない。
readfeel blockerとexecution blockerを混ぜない。
ratingだけでP5 confirmed候補にしない。
P5 confirmed candidateとP5 confirmed本体を分ける。
collect-onlyをfull backend suite greenと読まない。
RN/API/DB/public response shape/Emlis本文runtime/Gate thresholdをno-touchにする。
```

## 前提資料更新時確認

```text
py_compile R48 policy module: ok
R48 R0/R1〜R18 target: 82 passed by split execution
backend collect-only: 3291 tests collected / 1 warning
```

# 2026-06-20 差分追記: P7-R49 P5 Human Blind QA Actual Review Execution + Question Need Observation R0〜R18 rule索引

P7-R49 P5 human Blind QA actual review execution scaffold / question need observation bridgeを触る場合、次を同時確認する。

R49はP5/P6/実機読感を完了する工程ではなく、P5履歴線のactual review sessionを始めるためのbody-free controller、local-only preflight、rating/blocker/disposal接続、question need observation row/summary、P5/P6/P8候補handoff、no body leak/no question text、validation/no-touch boundaryを固定するbackend internal-only差分である。

## 必読module / test

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution.py
mashos-api/ai/tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r0_r1_20260619.py
mashos-api/ai/tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r2_r3_20260619.py
mashos-api/ai/tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r4_r5_20260619.py
mashos-api/ai/tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r6_r7_20260619.py
mashos-api/ai/tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r8_r9_20260619.py
mashos-api/ai/tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r10_r11_20260619.py
mashos-api/ai/tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r12_r13_20260619.py
mashos-api/ai/tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r14_r15_20260619.py
mashos-api/ai/tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r16_r17_20260619.py
mashos-api/ai/tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r18_20260619.py
```

## 特に守る境界

```text
R49で観測補助問い本文を作らない。
question_text / draft_question_text / reviewer_free_text / raw input / raw answer / returned surface / local path / body hashをbody-free materialへ混ぜない。
readfeel blockerとexecution blockerを混ぜない。
ratingの赤や修正必要をquestion_may_reduce_overread_riskで隠さない。
P5 confirmed candidateとP5 confirmed本体を分ける。
P6 start candidateとP6 start allowedを分ける。
P8 design material candidateとP8 start allowed / P8 implementationを分ける。
validation command matrixを実行済みgreenやrelease許可へ変換しない。
RN/API/DB/public response shape/Emlis本文runtime/User Label Connection runtime/Gate thresholdをno-touchにする。
```

## 前提資料更新時確認

```text
py_compile R49 helper and target tests: ok
R49 helper imported constants: implemented_steps_count=19 / not_yet_implemented_steps=empty
R49 final patch validation handoff: 76 passed by split execution
```

# 2026-06-20 差分追記: EmlisAI P7-R50 Manual Run Decision rule / contract索引

P7-R50 P5 Human Blind QA Actual Review Manual Run Decisionを触る場合、次を同時確認する。

| path | 何を拘束するか | いつ必須か |
|---|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision.py` | R50 R0〜R20のmanual run decision、local-only/body-free境界、P5/P6/P8 candidate handoff、no-touch boundary | P5 actual human Blind QA local-only manual runへ進む前 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r0_r1_20260620.py` | R49 handoff、P7/P8 Bridge、R50 scope/status enum | R50入口・current source確認時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r2_r3_20260620.py` | prior validation evidence adoption、GO/NO_GO decision | manual run可否を判定する時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r4_r5_20260620.py` | local-only root / explicit allow / export denylist、24-case protocol | body-full packet生成前のpreflight時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r6_r7_20260620.py` | body-full packet generation request、reviewer instruction / rating form | reviewer packet生成要求とformを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r8_r9_20260620.py` | rating row normalizer、readfeel/execution blocker ingestion | rating / blocker row契約を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r10_r11_20260620.py` | question need observation row normalizer、rating consistency guard | P8材料候補をP5修正回避に使わない確認時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r12_r13_20260620.py` | pause / abort / expiration、disposal receipt builder/verifier | review中断・期限切れ・廃棄確認を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r14_r15_20260620.py` | body-free post-review summary、P5 confirmed / repair / inconclusive decision | review結果集計とP5候補判断を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r16_r17_20260620.py` | P6/P8 candidate handoff | P6/P8へ材料を渡す時。ただし開始許可ではない |
| `mashos-api/ai/tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r18_r19_20260620.py` | no body leak / no question text guard、validation matrix | body-free materialやvalidation結果の扱いを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r20_20260620.py` | touch candidate / no-touch boundary | R50実装範囲がRN/API/DB/runtime/P8/releaseへ広がっていないか確認する時 |

注意:

```text
R50はlocal-only manual reviewへ入る前の境界固定であり、actual human review完了ではない。
R50 target greenを商品価値合格やrelease readinessへ変換しない。
```

# 2026-06-21 差分追記: EmlisAI P7-R51 Actual Local-Only Manual Run rule / contract索引

P7-R51 P5 Human Blind QA Actual Local-Only Manual Runを触る場合、次を同時確認する。

| path | 何を拘束するか | いつ必須か |
|---|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run.py` | R51 R0〜R20のactual local-only manual run body-free controller、P5/P6/P8 candidate handoff、no body leak / no-touch boundary | R51結果をP6/P8判断面へ渡す前 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_r0_r1_20260620.py` | R50 handoff、R49 timeout handling | R51入口・validation evidence確認時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_r2_r3_20260620.py` | local root / explicit allow / purge plan、actual review session envelope | body-full packet request前のpreflight時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_r4_r5_20260620.py` | 24-case manifest、local-only packet generation request | 24-case packet要求を固定する時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_r6_r7_20260620.py` | packet completeness / export denylist、reviewer instruction / rating form | review前のpacket evidenceとformを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_r8_r9_20260620.py` | sanitized actual review capture、rating row normalization | review結果rowのbody-free変換を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_r10_r11_20260620.py` | readfeel/execution blocker ingestion、question need observation normalization | blockerやP8材料候補を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_r12_r13_20260620.py` | rating-question consistency、pause / abort / expiration | P5弱さを問いで隠さない確認・session lifecycle確認時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_r14_r15_20260620.py` | purge evidence、disposal receipt builder/verifier | body-full packet / reviewer notes廃棄確認を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_r16_r17_20260620.py` | post-review summary、P5 decision | P5 confirmed candidate / repair / inconclusiveを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_r18_r19_20260620.py` | P6/P8 candidate handoff | P6/P8へ材料を渡す時。ただし開始許可ではない |
| `mashos-api/ai/tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_r20_20260621.py` | no body leak / no question text / no-touch boundary | R51結果を後続判断へ渡す前の最終境界確認時 |

注意:

```text
R51はbody-free handoff materialを作れる段階であり、P5 confirmed final、P6 start allowed、P8 start allowed、P7 complete、release readinessではない。
R51 target greenを、full backend suite greenや商品価値合格へ変換しない。
```

# 2026-06-21 差分追記: EmlisAI P7-R52 R51 Body-Free Handoff Evidence Decision Gate rule / contract索引

P7-R52 R51 Body-Free Handoff Evidence Review / P6-P8 Start Decision Gateを触る場合、次を同時確認する。

| path | 何を拘束するか | いつ必須か |
|---|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate.py` | R52 R0〜R15のbody-free evidence decision gate、P5/P6/P8 candidate separation、no-auto-allow、no-touch boundary | R51 handoff後のP6/P8判断面を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_r0_r1_20260621.py` | current received snapshot / validation evidence matrix | R52 source refreezeやvalidation evidenceを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_r2_r3_20260621.py` | R51 body-free intake / forbidden payload scan | R51 handoff materialの受け取り境界を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_r4_r5_20260621.py` | actual review evidence completeness / evidence missing NO_GO | R51 actual review evidence判定を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_r6_r7_20260621.py` | disposal safety / execution blocker gate | disposal未検証やexecution blockerを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_r8_r9_20260621.py` | rating-question consistency / P5 readfeel blocker gate | P5修正対象とP8材料候補の分離を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_r10_r11_20260621.py` | P5 confirmed candidate / P6 limited readfeel candidate separation | 候補を開始許可へ誤昇格しない確認時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_r12_r13_20260621.py` | P8 question material candidate separation / final decision composer | P8材料候補とP8 start allowedを分ける時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_r14_r15_20260621.py` | no-touch boundary validation / documentation output | RN/API/DB/runtime/public response/P8実装へ差分が広がっていないか確認する時 |

注意:

```text
R52はP6/P8へ進める許可証ではない。
R52 target greenを、P5 confirmed final / P6 start allowed / P8 start allowed / P7 complete / release readinessへ変換しない。
R52で扱うdocumentation outputはbody-free summaryであり、schema/json/md実ファイル化やP8詳細設計開始ではない。
```


# 2026-06-21 差分追記: EmlisAI P7-R53 R51 Actual Local-Only Human Review Execution Evidence Materialization rule / contract索引

P7-R53 R51 Actual Local-Only Human Review Execution Evidence Materializationを触る場合、次を同時確認する。

| path | 何を拘束するか | いつ必須か |
|---|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization.py` | R53 R0〜R21のR51 actual local-only review execution evidence materialization、current snapshot override、body-free evidence、P5/P6/P8 candidate separation、R52 re-intake handoff、no body leak / no question text / no-touch boundary | R52後にR51 actual reviewへ戻るmaterialization layerを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization_r0_r1_20260621.py` | current received snapshot refreeze / R51-R52 source delta freeze | 今回受領snapshotと古いR51/R52 helper refsを分ける時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization_r2_r3_20260621.py` | R49 timeout / validation evidence preflight、R51 R0/R1 current snapshot override | actual review前validationとR51 builder adoptionを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization_r4_r5_20260621.py` | explicit allow / local root / purge plan preflight、actual review session envelope | body-full local-only材料の入口を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization_r6_r7_20260621.py` | 24-case manifest freeze、local-only body-full packet request / optional writer boundary | review manifestやpacket generation requestを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization_r8_r9_20260621.py` | packet completeness / export denylist scan、reviewer instruction / rating form freeze | packet evidenceとreviewer formを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization_r10_r11_20260621.py` | actual human review result capture、rating row normalization | sanitized review result rowsとrating rowsを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization_r12_r13_20260621.py` | readfeel blocker / execution blocker ingestion、question need observation row normalization | blockerや問い必要性観察rowを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization_r14_r15_20260621.py` | rating/question consistency guard、pause / abort / expiration protocol | P5弱さを問い候補へ逃がさない確認、session lifecycleを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization_r16_r17_20260621.py` | purge / disposal receipt、body-free post-review summary | body-full packet / reviewer notes廃棄証跡とsummaryを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization_r18_r19_20260621.py` | P5 decision candidate separation、P6 limited human readfeel candidate handoff | P5候補判定やP6材料候補を触る時。ただし開始許可ではない |
| `mashos-api/ai/tests/test_emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization_r20_r21_20260621.py` | P8 question design material candidate handoff、final no-body-leak / no-question-text / no-touch validation、R52 re-intake handoff | P8材料候補とR52再投入材料を触る時。ただしP8 startではない |

注意:

```text
R53はR52後にR51 actual local-only reviewへ戻るためのbody-free materialization layerであり、actual human review完了ではない。
R53 target greenを、P5 confirmed final / P6 start allowed / P8 start allowed / P7 complete / release readinessへ変換しない。
R53で扱うP8 question design material candidateは、question text / draft question / API / DB / RN / response key / trigger logic / storage schemaではない。
```

# 2026-06-23 差分追記: EmlisAI P7-R54 P5 Actual Local Review Result Handoff rule / contract索引

P7-R54 P5 Human Blind QA Actual Local Review Execution / Body-Free Result Handoffを触る場合、次を同時確認する。

| path | 何を拘束するか | いつ必須か |
|---|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff.py` | R54 R0〜R23のP5 actual review result handoff、body-free evidence、P5/P6/P8 candidate separation、R52 re-intake、validation command matrix、no body leak / no question text / no-touch boundary | R53後のP5 actual review resultをR52へ戻すmaterialを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r0_r1_20260622.py` | scope / current snapshot refreeze、R53 source delta override | R54入口・古いsource refsとの分離を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r2_r3_20260622.py` | R49〜R53 validation evidence intake、local-only root / explicit allow / purge plan preflight | actual review前validationとbody-full入口を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r4_r5_20260622.py` | actual review session envelope、24-case manifest freeze | review sessionやmanifestを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r6_r7_20260622.py` | local-only body-full packet generation request、packet completeness / export denylist scan | packet requestとreview前scanを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r8_r9_20260622.py` | reviewer instruction / rating form freeze、actual human review operation state capture | reviewer formやoperation stateを結果取り込みと混ぜずに触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r10_r11_20260622.py` | sanitized actual review result capture、rating row normalization | sanitized rowsとrating rowsを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r12_r13_20260623.py` | readfeel/execution blocker ingestion、question need observation row normalization | blockerや問い必要性観察rowを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r14_r15_20260623.py` | rating/question observation consistency guard、pause / abort / expiration protocol | P5弱さを問い候補へ逃がさない確認、session lifecycleを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r16_r17_20260623.py` | purge / disposal receipt、body-free post-review summary | body-full packet / reviewer notes廃棄証跡とsummaryを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r18_r19_20260623.py` | P5 decision candidate separation、P6 limited human readfeel candidate handoff | P5候補判定やP6材料候補を触る時。ただし開始許可ではない |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r20_r21_20260623.py` | P8 question design material candidate handoff、final no-body-leak / no-question-text / no-touch validation | P8材料候補と最終body-free/no-touch境界を触る時。ただしP8 startではない |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r22_r23_20260623.py` | R52 re-intake handoff、validation command matrix / documentation output | R52再投入材料とvalidation matrixを触る時。ただしgreen誇張やrelease判断ではない |

注意:

```text
R54はP5 actual local-only review resultをR52へ戻すためのbody-free result handoff layerであり、actual human review完了ではない。
R54 target greenを、P5 confirmed final / P6 start allowed / P8 start allowed / P7 complete / release readinessへ変換しない。
R54で扱うP8 question design material candidateは、question text / draft question / API / DB / RN / response key / trigger logic / storage schemaではない。
R54 validation command matrixは、未実行・timeout・collect-onlyをfull backend suite greenへ変換する資料ではない。
```

# 2026-06-24 差分追記: EmlisAI P7-R55 R54 Evidence Reconcile / R52 Re-intake Decision rule / contract索引

P7-R55 R54 Evidence Reconcile / Current Received Snapshot Refreeze / R52 Re-intake Decision Materializationを触る場合、次を同時確認する。

| path | 何を拘束するか | いつ必須か |
|---|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization.py` | R55 R0〜R10のcurrent snapshot refreeze、prior helper source reconcile、validation evidence claim level、R54 default handoff intake、body-free forbidden payload scan、actual review evidence gap、R52 re-intake decision、P5/P6/P8/release separation、final no-touch、validation command matrix、final summary | R54 handoff evidenceをR52 re-intake判断材料へ接続する時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r0_r1_20260623.py` | scope / current snapshot refreeze、prior helper source reconcile | R55入口・旧R52/R53/R54 source refsとの分離を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r2_r3_20260623.py` | validation evidence reconcile、R54 default handoff intake | split green / timeout / collect-only / not runを混同せずR54 default handoffを受ける時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r4_r5_20260623.py` | body-free forbidden payload scan、actual review evidence gap assessment | body leakやactual review evidence missingをP5/P8/releaseへ誤昇格させない時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r6_r7_20260623.py` | R52 re-intake decision materialization、P5/P6/P8/release separation | R55-owned decisionとR52 existing equivalent、P5 candidate/finalやP8 material/startを分ける時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r8_r9_20260623.py` | final no-touch boundary、validation command matrix documentation output | API/DB/RN/runtime/P8 question no-touchとcommand matrixのgreen claim boundaryを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r10_20260624.py` | final summary | R55結果をR54 actual local-only human reviewへ戻すsummaryとして読む時 |

注意:

```text
R55はP8観測補助問いの詳細設計・実装ではない。
R55 final summaryはR55_R52_RETURN_TO_R54_ACTUAL_REVIEW_REQUIREDであり、P6/P8/release許可ではない。
R55 target greenを、P5 actual review完了 / P5 confirmed final / P6 start allowed / P8 start allowed / P7 complete / release readinessへ変換しない。
R55 validation command matrixは、未実行・timeout・collect-onlyをfull backend suite greenへ変換する資料ではない。
```

# 2026-06-24 差分追記: EmlisAI P4 Runtime Backfill / H Future Direction Surface Repair必読セット

P4 current-only読感、H/I/J reception-required regression、`recovered_energy_future_direction`、または `emlis_ai_labelled_two_stage_surface_recomposition.py` を触る場合、次を同時確認する。

| path | 何を拘束するか | いつ必須か |
|---|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_labelled_two_stage_surface_recomposition.py` | eligible non-limited labelled two-stage surfaceでsemantic focusをgeneric fallbackより前に扱うruntime owner | labelled two-stage visible surface / generic surface / future-direction surfaceを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p4_runtime_backfill_hij_future_direction_surface_audit_20260624.py` | R0/R1 red ledger / material lineage / candidate lineage / body-free boundary | H future-direction redの分類やclosure statusを読む時 |
| `mashos-api/ai/tests/test_emlis_ai_p4_runtime_backfill_hij_future_direction_surface_repair_20260624.py` | R2/R3 semantic focus helperとlabelled two-stage surface specificity | `cocolon.emlis.surface_semantic_focus.v1` や `eligible_surface_semantic_focus_connected` を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p4_runtime_backfill_hij_future_direction_generic_surface_guard_20260624.py` | R4/R5 generic surface guard。test_audit_onlyでありruntime Gateではない | `生活について、平穏の動き` 等のgeneric surface再発を扱う時 |
| `mashos-api/ai/tests/test_emlis_ai_hij_reception_required_regression_p8.py` | H/I/J submit E2E green境界 | H修正がI/J limited_groundingを壊していないか確認する時 |
| `mashos-api/ai/tests/Cocolon_EmlisAI_P4_RuntimeBackfill_HIJ_FutureDirectionSurfaceRepair_ImplementationResult_20260624.md` | R10 handoff。closed / 未確認 / 書かれていない / 推測禁止を固定 | R0〜R10の結果を次作業判断に使う時 |

この必読セットを読む時の禁止事項:

```text
- H case専用routeを足さない。
- H caseをlimited_groundingへ分類変更しない。
- exact fixed comment_textをruntimeへ入れない。
- Gateを緩めない。
- public metaへraw input / comment_text body / candidate bodyを入れない。
- H/I/J greenをP4完了やP5/P6/P8開始へ変換しない。
```



# 2026-06-25 差分追記: EmlisAI P4-R11 Residual Family Current-only Surface Audit必読セット

P4残familyのcurrent-only読感、surface specificity、R54へ戻る前のbody-free audit / triage、またはP4-R12 targeted repair候補を触る場合、次を同時確認する。

| path | 何を拘束するか | いつ必須か |
|---|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_r11_residual_family_surface_audit.py` | R10/R55位置固定、6 target groups、body-free audit row、case ref selection、material route audit、surface path audit | P4-R11 scope / case refs / material route / surface pathを読む時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_r11_surface_specificity_role_verdict_audit.py` | surface role id、generic signature id、temperature mismatch、verdict、repair candidate layerをbody-freeに分類する | visible surface specificity / PASS-YELLOW-REPAIR-RED分類を読む時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_r11_summary_decision_handoff.py` | R54 return candidate / P4-R12 targeted repair / coverage expansionのdecision handoffを固定する | R11結果を次工程へ渡す時 |
| `mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_r11_scope_matrix_20260624.py` | R11-0/R11-1 contract freeze / residual family scope matrix | R10 H/I/J closureやR55 hold境界を壊していないか確認する時 |
| `mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_r11_body_free_schema_20260624.py` | R11-2 body-free audit row / meta-only guard | raw input / comment_text body / candidate body / question text混入を防ぐ時 |
| `mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_r11_case_ref_selection_coverage_20260624.py` | R11-3 case ref selection / coverage audit | 6 groups × 4 refs / 24 refs coverageを読む時 |
| `mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_r11_material_route_audit_20260624.py` | R11-4 material route audit | eligible / limited_grounding / safety_triage_requiredを混同しない時 |
| `mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_r11_surface_path_audit_20260624.py` | R11-5 surface path audit | selected route kindやhistory_line_surface_used=false境界を確認する時 |
| `mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_r11_surface_specificity_role_audit_20260624.py` | R11-6 surface specificity role audit | required/observed/missing role idsやgeneric signature idsを読む時 |
| `mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_r11_verdict_repair_candidate_classification_20260624.py` | R11-7 verdict / repair candidate classification | blockerをP5/P8へ逃がさずP4 repair候補へ分ける時 |
| `mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_r11_summary_decision_handoff_20260624.py` | R11-8 summary / decision handoff summary | all-pass / blocker pathsのsummaryを読む時 |
| `mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_r11_decision_handoff_20260624.py` | R11-8/R11-9 decision boundary | P6/P8/releaseをtrue化しないことを確認する時 |
| `mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_r11_targeted_tests_20260624.py` | R11-9 targeted test manifest / no actual rows boundary | target tests追加の意味とcollect-only増分を読む時 |
| `mashos-api/ai/tests/Cocolon_EmlisAI_P4_R11_R10_R11_ExistingRegression_RuntimeBackfillRegression_Result_20260625.md` | R11-10/R11-11 regression result memo | P4 existing regression / H-I-J runtime backfill regressionを読む時 |
| `mashos-api/ai/tests/Cocolon_EmlisAI_P4_R11_R12_R13_P3ReadFeel_R54R55HoldBoundaryRegression_Result_20260625.md` | R11-12/R11-13 regression result memo | P3 Product Read Feel / R54-R55 hold boundaryを読む時 |
| `mashos-api/ai/tests/Cocolon_EmlisAI_P4_R11_ResidualFamilyCurrentOnlySurfaceAudit_ImplementationResult_20260625.md` | R11-14/R11-15 final result memo / handoff | RN contract / compile / collect-only / final next stepを読む時 |

この必読セットを読む時の禁止事項:

```text
- P4-R11をruntime修正として広げない。
- P4-R11 audit rowsをR54 actual review rowsやP5 rating rowsとして扱わない。
- R11 all-pass helper pathを外部ユーザー読感確認済みとして扱わない。
- R55 holdをP4-R11 greenで上書きしない。
- P8観測補助問いのAPI / DB / RN / response key / trigger logicが実装済みと読まない。
- collect-only passをfull backend suite greenとして扱わない。
```


# 2026-06-26 差分追記: EmlisAI P7-R54 Actual Local-only Human Review Operation Re-entry必読セット

R54 actual local-only human review operation re-entry、R52 re-intake handoff、P6 candidate handoff、P8 material candidate handoff、validation command matrix、またはP5 Human Blind QA actual review evidence境界を触る場合、次を同時確認する。

| path | 何を拘束するか | いつ必須か |
|---|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_actual_local_review_operation_reentry_20260625.py` | OP00〜OP24のactual local-only human review operation re-entry helper。scope/no-touch、current refs、source delta、R55 hold、preflight、manifest、packet request/receipt、review state、sanitized rows、rating/question/blocker/disposal/R52 handoff、validation matrixをbody-freeに固定する | R55後にR54 actual review operationへ戻る材料を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_actual_local_review_operation_reentry_op00_op01_20260625.py` | scope / no-touch boundary freeze、operation current snapshot refs refreeze | operation入口・current refsを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_actual_local_review_operation_reentry_op02_op03_20260625.py` | historical helper source delta reconcile、R55 hold intake | 旧helper refsと今回operation refsを分ける時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_actual_local_review_operation_reentry_op04_op05_20260625.py` | local-only preflight、24-case manifest freeze | body-full packet入口とreview case manifestを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_actual_local_review_operation_reentry_op06_op07_20260625.py` | body-free packet generation request、local packet generation receipt boundary | packet request / receiptをactual review完了と混ぜない時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_actual_local_review_operation_reentry_op08_op09_20260625.py` | packet completeness / export denylist scan、reviewer instruction / rating form freeze | packet漏えい・reviewer form・free text禁止を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_actual_local_review_operation_reentry_op10_op11_20260625.py` | actual human review operation state capture、sanitized review result capture | reviewer stateやbody-free selectionsを扱う時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_actual_local_review_operation_reentry_op12_op13_20260625.py` | rating row normalization、readfeel blocker / execution blocker ingestion | rating / blocker分類をP5修正・運用修正へ分ける時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_actual_local_review_operation_reentry_op14_op15_20260625.py` | question need observation normalization、rating/question consistency guard | P5修正対象をP8材料で隠さないか確認する時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_actual_local_review_operation_reentry_op16_op17_20260625.py` | pause / abort / expiration protocol、purge / disposal receipt | session中断・期限切れ・廃棄receipt境界を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_actual_local_review_operation_reentry_op18_op19_20260625.py` | body-free post-review summary、P5 decision candidate separation | summaryやP5 confirmed candidate / repair / inconclusive分岐を触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_actual_local_review_operation_reentry_op20_op21_20260625.py` | P6 candidate handoff、P8 material candidate handoff | 候補handoffをstart_allowedへ変換しない時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_actual_local_review_operation_reentry_op22_op23_20260625.py` | final no-body-leak / no-question-text / no-touch validation、R52 re-intake handoff | R52へ戻すbody-free handoffを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_actual_local_review_operation_reentry_op24_20260625.py` | validation command matrix / documentation output | selected regression / collect-only / unexecuted scopeをgreen誇張しない時 |

この必読セットを読む時の禁止事項:

```text
- OP00〜OP24 target greenをactual human review完了として扱わない。
- body-free packet request / receiptをbody-full packet成果物として扱わない。
- helperによるdisposal receipt受領をlocal file deletion実行そのものとして扱わない。
- P5 confirmed candidateをP5 confirmed finalへ変換しない。
- P6 candidate / P8 material candidateをstart_allowedへ変換しない。
- P8 question text / trigger / API / DB / RN / response keyが実装済みと読まない。
- validation command matrixをfull backend suite greenやrelease readinessとして読まない。
```


# 2026-06-26 差分追記: EmlisAI P7-R54 Actual Review Execution Evidence Materialization必読セット

R54-EV00〜EV22、actual review execution evidence materialization、R52 re-intake handoff、P6 candidate-only handoff、P8 material candidate-only handoff、またはfinal validation / documentation outputを触る場合、次を同時確認する。

| path | 何を拘束するか | いつ必須か |
|---|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_actual_review_execution_evidence_materialization_20260626.py` | EV00〜EV22のbody-free materialization helper。20260626 refs、R55 hold、preflight、manifest、packet request、selection intake、rating/question/blocker/disposal、P5/P6/P8候補、R52 handoff、validation matrixを固定する | R54 actual review evidence materializationを触る時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_actual_review_execution_evidence_materialization_ev00_ev01_20260626.py` | scope/no-touch boundaryとexisting helper capability inspection | operation入口と既存R54-OP reuse境界を読む時 |
| `mashos-api/ai/tests/test_emlis_ai_p7_r54_actual_review_execution_evidence_materialization_ev02_ev03_20260626.py` | operation_current_refs 20260626 refreezeとR55 hold intake | actual review basisとR55 holdを読む時 |
| `mashos-api/ai/tests/test_r54_ev04_ev05_20260626.py` | local-only preflightと24-case manifest | body-full packet前提とcase manifestを読む時 |
| `mashos-api/ai/tests/test_r54_ev06_ev07_20260626.py` | body-full packet generation request body-free化とlocal operation boundary instruction | packet本体・local path・hashを成果物へ混ぜない時 |
| `mashos-api/ai/tests/test_r54_ev08_ev09_20260626.py` | reviewer selection-only formとsanitized review result row intake | reviewer free textやquestion text混入を防ぐ時 |
| `mashos-api/ai/tests/test_r54_ev10_ev11_20260626.py` | rating row normalizationとreadfeel/execution blocker ingestion | ratingとblocker分類を読む時 |
| `mashos-api/ai/tests/test_r54_ev12_ev13_20260626.py` | question need observation row normalizationとrating/question consistency guard | P5修正対象をP8材料へ逃がさない時 |
| `mashos-api/ai/tests/test_r54_ev14_ev15_20260626.py` | pause/abort/expiration protocolとpurge/disposal receipt | local-only削除境界を読む時 |
| `mashos-api/ai/tests/test_r54_ev16_ev17_20260626.py` | body-free post-review summaryとP5 decision candidate separation | P5 confirmed candidate / repair / P4-R12 / inconclusiveを分ける時 |
| `mashos-api/ai/tests/test_r54_ev18_ev19_20260626.py` | P6 candidate-only handoffとP8 material candidate-only handoff | 候補をstart_allowedへ変換しない時 |
| `mashos-api/ai/tests/test_r54_ev20_ev21_20260626.py` | final no-body-leak / no-question-text / no-touch validationとR52 re-intake handoff | body-free evidence completeをP5 finalへ誤変換しない時 |
| `mashos-api/ai/tests/test_r54_ev22_20260626.py` | validation command matrix / documentation output | collect-onlyやhelper greenを過剰claimへ変換しない時 |
| `mashos-api/ai/tests/R54_EV02_EV03_Result_20260626.md` 〜 `R54_EV22_Result_20260626.md` | EV02〜EV22の実装結果・未実施・validation record | 各EVの確認済み / 未実施を読む時 |
| `mashos-api/ai/tests/Cocolon_EmlisAI_P7_R54ActualLocalReviewOperation_ExecutionEvidenceMaterialization_EV00_EV01_ImplementationResult_20260626.md` | EV00〜EV01の実装結果 | 既存helper capabilityとthin wrapper判断を読む時 |

この必読セットを読む時の禁止事項:

```text
- EV00〜EV22 target greenをactual human review完了として扱わない。
- body-full packet生成要求をbody-full packet生成済みとして扱わない。
- reviewer selection row intakeを実レビュー完了として扱わない。
- rating/question normalizationをactual reviewer rows実記入済みとして扱わない。
- P5 confirmed candidateをP5 confirmed finalへ変換しない。
- P6 candidate / P8 material candidateをstart_allowedへ変換しない。
- P8 question text / trigger / API / DB / RN / response keyが実装済みと読まない。
- validation matrixやcollect-onlyをfull backend suite greenやrelease readinessとして読まない。
```


# 2026-06-27 差分追記: R54-CLR00〜CLR24必読セット

R54 Current Snapshot Local Review Runを扱う場合、次を必ず同時に読む。

| 種別 | 対象 | 読み方 |
|---|---|---|
| service helper | `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_current_snapshot_local_review_run*.py` | body-free wrapper / no-touch boundary。 |
| test | `mashos-api/ai/tests/test_r54_current_snapshot_local_review_run_clr*.py` | contract validation。synthetic rowsであり、actual human review証明ではない。 |
| result memo | `mashos-api/ai/tests/R54_CLR*_Result_20260627.md` | validation scope / 未確認 / no-touch境界の記録。 |
| premise diff CSV | `r54clr_diff_20260627.csv` | 前提資料側の短名coverage一覧。 |

禁止する読み替え:

```text
helper green -> actual human review complete
selected regression green -> full backend suite green
RN contract not re-run -> RN real-device verified
R52 handoff envelope ready -> R52-side processing complete
P8 material candidate-only -> P8 implementation start
```

```text
not confirmed by this premise update:
  full backend suite green
  RN contract re-run
  RN real-device modal verification
  actual body-full packet content generation
  actual local-only human review execution by a person
  actual rating rows from real human review
  actual question need observation rows from real human review
  actual R52-side re-intake processing execution
  P5 final
  P6 start
  P8 start
  P7 complete
  release_allowed
```


# 2026-06-28 差分追記: R54-AHR00〜AHR24必読セット

R54 Actual Human Review Execution / Body-Free Evidence Intakeを扱う場合、次を必ず同時に読む。

| 種別 | 対象 | 読み方 |
|---|---|---|
| service helper | `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_actual_human_review_execution_bodyfree_intake_20260627.py` | AHR00〜AHR24のbody-free wrapper / receipt boundary。actual reviewをhelperだけで実行済みにしない。 |
| test | `mashos-api/ai/tests/test_r54_actual_human_review_execution_bodyfree_intake_ahr*.py` | contract validation。helper green / selected regressionであり、full backend suite greenや実機確認ではない。 |
| result memo | `mashos-api/ai/tests/R54_AHR*_BodyFreeEvidenceIntake_Result_20260627.md` | validation scope / 未確認 / no-touch境界の記録。AHR10以降もlive external review実行済みとは読まない。 |
| premise diff CSV | `r54ahr_diff_20260628.csv` | 前提資料側の短名coverage一覧。 |

禁止する読み替え:

```text
AHR helper green -> actual human review complete
AHR10 receipt intake helper -> this premise update ran person review
AHR11/AHR12/AHR14 normalizers -> live external review rows confirmed
AHR17 disposal receipt intake -> helper executed local file deletion
AHR19 P5 candidate -> P5 final
AHR20 P6 candidate-only -> P6 start_allowed
AHR21 P8 material candidate-only -> P8 implementation start
AHR23 R52 handoff envelope -> R52-side processing complete
AHR24 validation matrix -> full backend suite green / RN real-device verified / release readiness
```

```text
not confirmed by this premise update:
  full backend suite green
  RN contract re-run
  RN real-device modal verification
  actual live local-only human review execution by a person
  actual live body-full packet content generation
  actual live rating rows from external review
  actual live question need observation rows from external review
  actual live disposal / purge operation
  actual R52-side re-intake processing execution
  P5 final
  P6 start
  P8 start
  P7 complete
  release_allowed
```

# 2026-06-28 差分追記: R54-AHR-CS00〜CS18必読セット

| 種別 | path | 読み方 |
|---|---|---|
| service helper | `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_current_snapshot_actual_review_reentry_20260628.py` | CS00〜CS18のbody-free current snapshot actual review re-entry helper。existing AHR helperを直接書き換えない。 |
| target tests | `mashos-api/ai/tests/test_r54_ahr_current_snapshot_actual_review_reentry_cs00_cs01_20260628.py` ... `test_r54_ahr_current_snapshot_actual_review_reentry_cs18_20260628.py` | no-touch / body-free / no-question-text / candidate-only / handoff-not-executedを確認する。 |
| result memos | `mashos-api/ai/tests/R54_AHR_CS00_CS01_CurrentSnapshotActualReviewReentry_Result_20260628.md` ... `R54_AHR_CS18_CurrentSnapshotActualReviewReentry_Result_20260628.md` | CSごとのvalidation readingとclaim boundary。 |
| premise diff CSV | `r54cs_diff_20260628.csv` | 前提資料側の短名coverage一覧。 |

必読時の注意:

```text
CS00〜CS18 green != actual human review complete
P5 confirmed candidate != P5 final
P8 material candidate-only != P8 start allowed
R52 handoff ready != R52 actual re-intake executed
selected regression green != full backend suite green
```



# 2026-06-29 差分追記: R54-AHR-CR00〜CR22必読セット

| 種別 | path | 何を拘束するか |
|---|---|---|
| service helper | `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_current_received_snapshot_actual_local_review_operation_20260628.py` | CR00〜CR22のbody-free current received actual local-only review operation helper。existing AHR / CS helperを直接書き換えない。 |
| target tests | `mashos-api/ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr00_cr01_20260628.py` ... `test_r54_ahr_current_received_actual_local_review_operation_cr22_20260628.py` | CRごとのcontract / no-body / no-question / no-touch / candidate-only境界を検査する。 |
| result memos | `mashos-api/ai/tests/R54_AHR_CR00_CR01_CurrentReceivedActualLocalReviewOperation_Result_20260628.md` ... `R54_AHR_CR22_CurrentReceivedActualLocalReviewOperation_Result_20260628.md` | CRごとのvalidation readingとclaim boundary。 |
| premise diff CSV | `r54cr_diff_20260629.csv` | 前提資料側の短名coverage一覧。 |

必読の禁止読み:

```text
CR00〜CR22 green != actual human review complete
CR16 evidence predicate != P5 final
CR18 P6 candidate-only != P6 start
CR19 P8 material candidate-only != P8 start / P8 question implementation
CR20 R52 handoff candidate envelope != R52 actual execution
CR22 documentation output != P7 complete / release allowed
```


# 2026-06-30 差分追記: R54-AHR Post-CR22 EX00〜EX18必読セット

| 種別 | path | 何を拘束するか |
|---|---|---|
| service helper | `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_20260629.py` | EX00〜EX18のbody-free Post-CR22 execution evidence completion wrapper。CR helper greenやunit test fixtureをactual review evidenceへ昇格させない。 |
| target tests | `mashos-api/ai/tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex00_ex01_20260629.py` ... `test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex18_20260630.py` | EXごとのcontract / no-body / no-question / no-touch / actual-source guard / candidate-only / next-decision hold境界を検査する。 |
| result memos | `mashos-api/ai/tests/R54_AHR_PostCR22_ActualLocalReviewExecutionEvidenceCompletion_EX00_EX01_Result_20260629.md` ... `R54_AHR_PostCR22_ActualLocalReviewExecutionEvidenceCompletion_EX18_Result_20260630.md` | EXごとのvalidation readingとclaim boundary。EX18でvalidation matrix / result memo / next-decision holdを閉じる。 |
| premise diff CSV | `r54pc22_diff_20260630.csv` | 前提資料側の短名coverage一覧。 |

必読の禁止読み:

```text
EX00〜EX18 green != actual human review complete
EX07 operation receipt intake != this premise update ran actual person review
EX09 sanitized rows intake != this premise update created actual selection rows
EX16 actual_review_evidence_complete predicate != P5 final / P6 start / P8 start / R52 execution / release
EX17 P5/P6/P8/R52 candidate-only separation != downstream stage start or execution
EX18 validation command matrix / result memo / next-decision hold != P7 complete / release allowed
```



# 2026-06-30 差分追記: R54-AHR Post-EX18 MN00〜MN11必読セット

| 種別 | path | 何を拘束するか |
|---|---|---|
| service helper | `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_20260630.py` | MN00〜MN11のbody-free Post-EX18 manual next-decision helper。EX18 greenやunit test fixtureをactual review evidenceへ昇格させず、RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIREDへ閉じる。 |
| target tests | `mashos-api/ai/tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn00_mn01_20260630.py` ... `test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn10_mn11_contract_20260630.py` | MNごとのcontract / no-body / no-question / no-path / no-hash / no-promotion / re-entry mapping / acceptance境界を検査する。 |
| result memos | `mashos-api/ai/tests/R54_AHR_PostEX18_ManualNextDecision_ReturnToActualReviewOperation_MN00_MN01_Result_20260630.md` ... `R54_AHR_PostEX18_ManualNextDecision_ReturnToActualReviewOperation_MN10_MN11_Result_20260630.md` | MNごとのvalidation readingとclaim boundary。MN11でacceptance / fail-closed finalizerを閉じる。 |
| premise diff CSV | `r54mn_diff_20260630.csv` | 前提資料側の短名coverage一覧。 |

必読の禁止読み:

```text
MN00〜MN11 green != actual human review complete
MN03 manual decision ready != P5/P6/P8/R52 downstream execution allowed
MN04 return operation plan != actual review operation executed
MN05 expected evidence intake bundle boundary != actual rows created
MN06 no-leak scan clean != P7 complete / release allowed
MN08 re-entry mapping != Post-CR22 EX07〜EX18 actual re-entry executed
MN11 acceptance / fail-closed finalizer != release allowed
```


# 2026-06-30 差分追記: R54-AHR Post-MN11 PMN-OP00〜OP23必読セット

| 区分 | path | 読み方 |
|---|---|---|
| service helper | `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_mn11_actual_local_only_human_review_operation_20260630.py` | PMN-OP00〜OP23のbody-free Post-MN11 actual local-only human review operation bridge。MN11のRETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIREDを受け、actual operation evidenceを安全に受ける境界を作るが、actual review実行済みとは読まない。 |
| target tests | `mashos-api/ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op00_op01_20260630.py` ... `test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op22_op23_contract_20260630.py` | PMN-OP00〜OP23の段階別contract tests。target greenはhelper contract成立であり、actual evidence completeではない。 |
| result memos | `mashos-api/ai/tests/R54_AHR_PostMN11_ActualLocalOnlyHumanReviewOperation_PMN_OP00_OP01_Result_20260630.md` ... `R54_AHR_PostMN11_ActualLocalOnlyHumanReviewOperation_PMN_OP00_OP23_Result_20260630.md` | PMNごとのvalidation readingとclaim boundary。OP00_OP23 result memoでvalidation command matrix / acceptance fail-closed finalizerを閉じる。 |
| premise diff CSV | `r54pmn_diff_20260630.csv` | 前提資料側の短名coverage一覧。source implementation 25件とgenerated `__pycache__` 28件を分けて記録する。 |

PMN-OP00〜OP23を読むときの禁止:

```text
PMN-OP00〜OP23 green != actual human review complete
contract fixture predicate pass != actual review evidence complete
generated __pycache__ != source implementation change
PostCR22 EX07〜EX18 mapping != re-entry executed
P5 final / P6 start / P8 start / R52 actual execution / P7 complete / release allowed != permitted
```

# 2026-07-02 差分追記: R54-AHR Post-PMN23 DMH-OP00〜OP18必読セット

| 区分 | path | 読み方 |
|---|---|---|
| service helper | `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_20260701.py` | DMH-OP00〜OP18のbody-free Post-PMN23 downstream manual decision hold evidence intake helper。PMN-OP23後のmanual holdを受け、actual evidence bundleを検査し、OP18でmanual downstream decision requiredへ閉じるが、actual review新規実行済みとは読まない。 |
| target tests | `mashos-api/ai/tests/test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op00_op01_20260701.py` ... `test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op18_20260702.py` | DMH-OP00〜OP18の段階別contract tests。target greenはhelper contract成立であり、actual human review executionではない。 |
| result memos | `mashos-api/ai/tests/R54_AHR_PostPMN23_DownstreamManualDecisionHold_EvidenceIntake_DMH_OP00_OP01_Result_20260701.md` ... `R54_AHR_PostPMN23_DownstreamManualDecisionHold_EvidenceIntake_DMH_OP18_Result_20260702.md` | DMHごとのvalidation readingとclaim boundary。OP18 result memoでdownstream manual decision hold finalizerを閉じる。 |
| premise diff CSV | `r54dmh_diff_20260702.csv` | 前提資料側の短名coverage一覧。21 entries added / 0 changed / 0 removedを記録する。 |

DMH-OP00〜OP18を読むときの禁止:

```text
DMH-OP00〜OP18 green != actual human review execution
OP16 actual_review_evidence_complete candidate != P5 final / P6 start / P8 start / R52 actual execution / P7 complete / release allowed
OP17 re-entry envelope != PostCR22 EX07〜EX18 actual re-entry executed
OP18 finalizer != downstream decision complete
P8 question design / implementation / API / DB / RN / trigger / question_text != started
```

# 2026-07-03 差分追記: R54-AHR Post-DMH18 DMD-OP00〜OP08必読セット

| 種別 | path | 読み方 |
|---|---|---|
| service helper | `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_dmh18_downstream_manual_decision_triage_20260703.py` | DMD-OP00〜OP08のbody-free Post-DMH18 downstream manual decision / actual evidence status triage helper。OP18 candidateをreal-operation claimへ昇格せず、current default branchをevidence incomplete / not claimedとして固定する。 |
| target tests | `mashos-api/ai/tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op00_op01_20260703.py` ... `test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op08_result_20260703.py` | DMD-OP00〜OP08の段階別contract tests。target greenはhelper contract成立であり、actual human review executionではない。 |
| result memos | `mashos-api/ai/tests/R54_AHR_PostDMH18_DownstreamManualDecision_ActualEvidenceStatusTriage_DMD_OP00_OP01_Result_20260703.md` ... `R54_AHR_PostDMH18_DownstreamManualDecision_ActualEvidenceStatusTriage_DMD_OP00_OP08_Result_20260703.md` | DMDごとのvalidation readingとclaim boundary。OP08 result memoでbody-free result memo / target tests / regression closureを閉じる。 |
| premise diff CSV | `r54dmd_diff_20260703.csv` | 前提資料側の短名coverage一覧。11 entries added / 0 changed / 0 removedを記録する。 |

DMD-OP00〜OP08を読むときの禁止:

```text
DMD-OP00〜OP08 green != actual human review execution
DMD current default branch != P8 start allowed
DMD branch C != downstream auto execution allowed
DMD result memo closure != P7 complete / release allowed
```

# 2026-07-03 差分追記: R54-AHR Post-DMD08 ALR-OP00〜OP12必読セット

| 種別 | path | 読み方 |
|---|---|---|
| service helper | `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_20260703.py` | ALR-OP00〜OP12のbody-free Post-DMD08 continue/retry actual local review operation helper。DMD-OP08 branchを受け、4分岐resolver / state machine / allow boundary / packet request envelope / receipt rows purge guards / non-promotion hold / result closureまでを扱うが、actual review実行済みとは読まない。 |
| target tests | `mashos-api/ai/tests/test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op00_op01_20260703.py` ... `test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op12_result_20260703.py` | ALR-OP00〜OP12の段階別contract tests。target greenはhelper contract成立であり、actual human review executionではない。 |
| result memos | `mashos-api/ai/tests/R54_AHR_PostDMD08_ContinueRetryActualLocalOnlyHumanReviewOperation_ALR_OP00_OP01_Result_20260703.md` ... `R54_AHR_PostDMD08_ContinueRetryActualLocalOnlyHumanReviewOperation_ALR_OP00_OP12_Result_20260703.md` | ALRごとのvalidation readingとclaim boundary。OP12 result memoでbody-free result memo / target tests / selected regression closureを閉じる。 |
| premise diff CSV | `r54alr_diff_20260703.csv` | 前提資料側の短名coverage一覧。15 entries added / 0 changed / 0 removedを記録する。 |

ALR-OP00〜OP12を読むときの禁止:

```text
ALR-OP00〜OP12 green != actual human review execution
retry_or_start_required != actual review started
explicit local-only allow required != allow granted
packet request envelope != body-full packet generated
schema guard ready != actual receipt / rows / purge created
OP12 result memo closure != P7 complete / release allowed
```

# 2026-07-04 差分追記: R54-AHR Post-ALR12 ELR-OP00〜OP19必読セット

Post-ALR12 actual local-only review start/retry入口、actual evidence intake、DMD-compatible handoff、downstream manual decision holdを触る場合は、次を必ず同時に確認する。

| 種別 | path | 読み方 |
|---|---|---|
| service helper | `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_20260703.py` | ELR-OP00〜OP19のbody-free Post-ALR12 explicit local-only review start/retry helper。actual reviewを実行したとは読まない。 |
| target tests | `mashos-api/ai/tests/test_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_elr_op00_op01_20260703.py` ... `test_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_elr_op18_op19_20260703.py` | ELR-OP00〜OP19の段階別contract tests。target greenはhelper contract成立であり、actual human review executionではない。 |
| result memos | `mashos-api/ai/tests/R54_AHR_PostALR12_ExplicitLocalOnlyReviewStartRetryOperation_ELR_OP00_OP01_Result_20260703.md` ... `R54_AHR_PostALR12_ExplicitLocalOnlyReviewStartRetryOperation_ELR_OP00_OP19_Result_20260704.md` | body-free validation / not-claimed / no-promotion境界の記録。result memo closureをP7 completeやrelease readyにしない。 |
| premise diff CSV | `r54elr_diff_20260704.csv` | 前提資料側の短名coverage一覧。21 entries added / 0 changed / 0 removedを記録する。 |

ELR-OP00〜OP19を読むときの禁止:

```text
ELR helper green != actual human review execution
allow receipt accepted != helper granted allow
packet receipt accepted != body-full packet generated by helper
actual operation receipt intake != helper-created actual receipt
rows normalization != helper-created actual rows
complete predicate candidate != downstream auto promotion
DMD-compatible receipt adapter != DMD re-run / R52 execution
result memo closure != P7 complete / release ready
```

# 2026-07-04 差分追記: R54-AHR Post-ELR19 DHR-OP00〜OP09必読セット

Post-ELR19 downstream manual decision handoff-or-retry、DMD handoff plan candidate、actual source claim separation、retry/start required branchを触る場合は、次を必ず同時に確認する。

| 種別 | path | 読み方 |
|---|---|---|
| service helper | `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py` | DHR-OP00〜OP09のbody-free Post-ELR19 handoff-or-retry helper。DMD / R52 / P8 / releaseを実行したとは読まない。 |
| target tests | `mashos-api/ai/tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op00_op01_20260704.py` ... `test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op08_op09_result_20260704.py` | DHR-OP00〜OP09の段階別contract tests。target greenはhelper contract成立であり、actual human review executionやDMD executionではない。 |
| result memos | `mashos-api/ai/tests/R54_AHR_PostELR19_DownstreamManualDecision_HandoffOrRetry_DHR_OP00_OP01_Result_20260704.md` ... `R54_AHR_PostELR19_DownstreamManualDecision_HandoffOrRetry_DHR_OP00_OP09_Result_20260704.md` | body-free result memo。current default branchはretry/start requiredで、current default DMD handoff planはmaterialized false。 |
| premise diff CSV | `r54dhr_diff_20260704.csv` | 前提資料側の短名coverage一覧。11 entries added / 0 changed / 0 removedを記録する。 |

DHR-OP00〜OP09を読むときの禁止:

```text
DHR helper greenをactual review完了へ変換しない。
DHR-OP03 receipt shape validをactual source confirmedへ変換しない。
DHR-OP08 handoff plan candidate pathをDMD実行済みへ変換しない。
DHR-OP09 result memo closureをP8 start / R52 execution / release allowedへ変換しない。
```


# 2026-07-04 差分追記: R54-AHR Post-DHR09 RSR-OP00〜OP16必読セット

Post-DHR09 actual local-only review retry/start decision、explicit local-only allow gate、body-full packet transient request boundary、actual operation receipt / rows / question need / purge receipt intake、DHR re-intake materialを触る場合は、次を必ず同時に確認する。

| 種別 | path | 読み方 |
|---|---|---|
| service helper | `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_20260704.py` | RSR-OP00〜OP16のbody-free Post-DHR09 retry/start decision helper。actual review、receipt/rows/purge、DHR/DMD/R52/P5/P6/P8/P7/releaseを実行したとは読まない。 |
| target tests | `mashos-api/ai/tests/test_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_rsr_op00_op01_20260704.py` ... `test_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_rsr_op16_result_20260704.py` | RSR-OP00〜OP16の段階別contract tests。target greenはhelper contract成立であり、actual human review executionやDHR re-intake executionではない。 |
| result memos | `mashos-api/ai/tests/R54_AHR_PostDHR09_ActualLocalReview_RetryStartDecision_RSR_OP00_OP01_Result_20260704.md` ... `R54_AHR_PostDHR09_ActualLocalReview_RetryStartDecision_RSR_OP00_OP16_Result_20260704.md` | body-free result memo。OP16 closureはRSR helper境界のclosureであり、actual review完了・P7 complete・release readyではない。 |
| premise diff CSV | `r54rsr_diff_20260704.csv` | 前提資料側の短名coverage一覧。19 entries added / 0 changed / 0 removedを記録する。 |

RSR-OP00〜OP16を読むときの禁止:

```text
RSR helper greenをactual review完了へ変換しない。
RSR-OP03 allow receipt gateをMashの実許可作成へ変換しない。
RSR-OP06 packet request boundaryをbody-full packet生成済みへ変換しない。
RSR-OP10 actual operation receipt intakeをhelper-created receiptへ変換しない。
RSR-OP11 rows intakeをhelper-created rowsへ変換しない。
RSR-OP12 question need observation rowsをP8 question spec / question_textへ変換しない。
RSR-OP13 purge receipt intakeをhelper-executed purgeへ変換しない。
RSR-OP15 complete candidateをDHR/DMD/R52/P5/P6/P8/P7/release自動実行へ変換しない。
RSR-OP16 result memo closureをP7 complete / release allowedへ変換しない。
```


# 2026-07-05 差分追記: R54-AHR Post-RSR16 DRI-OP00〜OP12必読セット

Post-RSR16 DHR actual source claim re-intake material、DHR-OP04 external actual source claim adapter candidate、body-free / no-promotion / source-kind rescanを触る場合は、次を必ず同時に確認する。

| 種別 | path | 読み方 |
|---|---|---|
| service helper | `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_20260705.py` | DRI-OP00〜OP12のbody-free Post-RSR16 DHR actual source claim re-intake material helper。DHR-OP04 / DHR re-intake / DMD / R52 / P8 / releaseを実行したとは読まない。 |
| target tests | `mashos-api/ai/tests/test_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_dri_op00_op01_20260705.py` ... `test_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_dri_op12_result_20260705.py` | DRI-OP00〜OP12の段階別contract tests。target greenはhelper contract成立であり、actual human review executionやDHR re-intake executionではない。 |
| result memos | `mashos-api/ai/tests/R54_AHR_PostRSR16_DHRActualSourceClaimReintake_DRI_OP00_OP01_Result_20260705.md` ... `R54_AHR_PostRSR16_DHRActualSourceClaimReintake_DRI_OP00_OP12_Result_20260705.md` | body-free result memo。OP12 closureはDRI helper境界のclosureであり、DHR-OP04 call・DHR source claim confirmation・P7 complete・release readyではない。 |
| premise diff CSV | `r54dri_diff_20260705.csv` | 前提資料側の短名coverage一覧。15 entries added / 0 changed / 0 removedを記録する。 |

DRI-OP00〜OP12を読むときの禁止:

```text
DRI helper greenをactual review完了へ変換しない。
DRI-OP04 receipt revalidationをhelper-created receiptへ変換しない。
DRI-OP05 rows / ratings revalidationをhelper-created rowsへ変換しない。
DRI-OP06 question need observation rowsをP8 question spec / question_textへ変換しない。
DRI-OP07 purge receipt revalidationをhelper-executed purgeへ変換しない。
DRI-OP09 adapter candidateをDHR-OP04 called / DHR confirmedへ変換しない。
DRI-OP10 ready branchをdownstream auto executionへ変換しない。
DRI-OP12 result memo closureをP7 complete / release allowedへ変換しない。
```


# 2026-07-05 差分追記: R54-AHR Post-DRI MRB-OP00〜OP08必読セット

Post-DRI / DHR-OP04 manual re-intake boundary、DRI-OP09 adapter candidate、DHR-OP03 ready material、manual DHR-OP04 result capture、DHR-OP04 stop classifierを触る場合は、次を必ず同時に確認する。

| 種別 | path | 読み方 |
|---|---|---|
| service helper | `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_dri_dhr_op04_manual_reintake_20260705.py` | MRB-OP00〜OP08のbody-free Post-DRI / DHR-OP04 manual re-intake helper。DHR-OP05 / DMD / R52 / P8 / releaseを実行したとは読まない。 |
| target tests | `mashos-api/ai/tests/test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op00_op01_20260705.py` ... `test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op08_result_20260705.py` | MRB-OP00〜OP08の段階別contract tests。target greenはhelper contract成立であり、actual human review executionやfull backend suite greenではない。 |
| result memos | `mashos-api/ai/tests/R54_AHR_PostDRI_DHROP04ManualReintake_MRB_OP00_OP01_Result_20260705.md` ... `R54_AHR_PostDRI_DHROP04ManualReintake_MRB_OP00_OP08_Result_20260705.md` | body-free result memo。OP08 closureはMRB helper境界のclosureであり、P7 complete・release readyではない。 |
| premise diff CSV | `r54mrb_diff_20260705.csv` | 前提資料側の短名coverage一覧。11 entries added / 0 changed / 0 removedを記録する。 |

MRB-OP00〜OP08を読むときの禁止:

```text
MRB helper greenをactual review完了へ変換しない。
DRI-OP09 adapter candidateをDHR confirmed resultへ変換しない。
DHR-OP03 ready materialをactual source claim confirmedへ変換しない。
MRB-OP04 input envelope readyをDHR-OP04 calledへ変換しない。
MRB-OP05 DHR-OP04 result captureをDHR-OP05 / DMD / R52 / P8 / release auto allowedへ変換しない。
MRB-OP08 result memo closureをP7 complete / release allowedへ変換しない。
```

# 2026-07-06 差分追記: R54-AHR Post-MRB08 RDB-OP00〜OP08必読セット

Post-MRB08 / DHR-OP04 result manual decision boundary、MRB-OP08 result memo intake、branch/status consistency、manual decision lane、next-stage candidate envelopeを触る場合は、次を必ず同時に確認する。

| 種別 | path | 読み方 |
|---|---|---|
| service helper | `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_20260705.py` | RDB-OP00〜OP08のbody-free Post-MRB08 / DHR-OP04 result manual decision helper。DHR-OP05 / DMD / R52 / P8 / releaseを実行したとは読まない。 |
| target tests | `mashos-api/ai/tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op00_op01_20260705.py` ... `test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op08_result_20260705.py` | RDB-OP00〜OP08の段階別contract tests。target greenはhelper contract成立であり、candidate実行やfull backend suite greenではない。 |
| result memos | `mashos-api/ai/tests/R54_AHR_PostMRB08_DHROP04ResultManualDecision_RDB_OP00_OP01_Result_20260705.md` ... `R54_AHR_PostMRB08_DHROP04ResultManualDecision_RDB_OP00_OP08_Result_20260705.md` | body-free result memo。OP08 closureはRDB helper境界のclosureであり、DHR-OP05実行・P7 complete・release readyではない。 |
| premise diff CSV | `r54rdb_diff_20260706.csv` | 前提資料側の短名coverage一覧。11 entries added / 0 changed / 0 removedを記録する。 |

RDB-OP00〜OP08を読むときの禁止:

```text
RDB helper greenをDHR-OP05実行許可へ変換しない。
MRB-OP08 intakeをDHR-OP05 calledへ変換しない。
branch/status consistency greenをdownstream auto executionへ変換しない。
manual decision materialを下流実行結果へ変換しない。
next-stage candidate envelopeをcandidate executionへ変換しない。
RDB-OP08 result memo closureをP8 start / P7 complete / release allowedへ変換しない。
```

# 2026-07-06 差分追記: R54-AHR Post-RDB08 NCI-OP00〜OP08必読セット

Post-RDB08 selected next-stage candidate intake / manual lane confirmation boundary、RDB-OP08 result memo intake、candidate shape validation、lane consistency resolver、handoff-or-stop envelopeを触る場合は、次を必ず同時に確認する。

| 種別 | path | 読み方 |
|---|---|---|
| service helper | `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_20260706.py` | NCI-OP00〜OP08のbody-free Post-RDB08 selected candidate intake helper。selected_next_stage_candidate / handoff-or-stop envelope / DHR-OP05 / DMD / R52 / P8 / releaseを実行したとは読まない。 |
| target tests | `mashos-api/ai/tests/test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op00_op01_20260706.py` ... `test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op08_result_20260706.py` | NCI-OP00〜OP08の段階別contract tests。target greenはhelper contract成立であり、candidate実行やfull backend suite greenではない。 |
| result memos | `mashos-api/ai/tests/R54_AHR_PostRDB08_SelectedNextStageCandidateIntake_NCI_OP00_OP01_Result_20260706.md` ... `R54_AHR_PostRDB08_SelectedNextStageCandidateIntake_NCI_OP00_OP08_Result_20260706.md` | body-free result memo。OP08でNCI closureしてもDHR-OP05実行許可やP8開始許可ではない。 |
| premise diff CSV | `r54nci_diff_20260706.csv` | 前提資料側の短名coverage一覧。11 entries added / 0 changed / 0 removedを記録する。 |

NCI-OP00〜OP08を読むときの禁止:

```text
NCI target greenをselected_next_stage_candidate executionとして読まない。
selected lane resolvedをbranch先実行済みとして読まない。
DHR-OP05 candidateをDHR-OP05 call / builder callとして読まない。
retry/start laneをactual review開始済みとして読まない。
waiting laneをraw evidence / body-full packet request済みとして読まない。
repair laneをrepair execution済みとして読まない。
NCI-OP08 result memo closureをP8 start / P7 complete / release allowedへ変換しない。
```

# 2026-07-07 差分追記: R54-AHR Post-NCI PNT-OP00〜OP08必読セット

Post-NCI selected handoff-or-stop decision triage / next boundary selection、NCI-OP08 closure intake、selected_handoff_or_stop shape validation、lane resolver、next boundary selection materializationを触る場合は、次を必ず同時に確認する。

| 種別 | path | 読み方 |
|---|---|---|
| service helper | `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_20260707.py` | PNT-OP00〜OP08のbody-free Post-NCI triage helper。selected_handoff_or_stop_ref / selected_post_nci_next_boundary_ref / DHR-OP05 / DMD / R52 / P8 / releaseを実行したとは読まない。 |
| target tests | `mashos-api/ai/tests/test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op00_op01_20260707.py` ... `test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op08_result_20260707.py` | PNT-OP00〜OP08の段階別contract tests。target greenはhelper contract成立であり、candidate実行やfull backend suite greenではない。 |
| result memos | `mashos-api/ai/tests/R54_AHR_PostNCI_SelectedHandoffOrStopDecisionTriage_PNT_OP00_OP01_Result_20260707.md` ... `R54_AHR_PostNCI_SelectedHandoffOrStopDecisionTriage_PNT_R11_NextWorkDecision_20260707.md` | body-free result memo。R11で次作業判断してもDHR-OP05実行許可やP8開始許可ではない。 |
| premise diff CSV | `r54pnt_diff_20260707.csv` | 前提資料側の短名coverage一覧。16 entries added / 0 changed / 0 removedを記録する。 |

PNT-OP00〜OP08を読むときの禁止:

```text
PNT target greenをselected_handoff_or_stop_ref executionとして読まない。
selected lane resolvedをbranch先実行済みとして読まない。
next boundary selection materialをselected_post_nci_next_boundary_ref executionとして読まない。
DHR-OP05 candidateをDHR-OP05 call / builder callとして読まない。
retry/start laneをactual review開始済みとして読まない。
waiting laneをraw evidence / body-full packet request済みとして読まない。
repair laneをrepair execution済みとして読まない。
R10 validation closureをfull backend / RN / real-device greenとして読まない。
R11 next work decisionをP8 start / P7 complete / release allowedへ変換しない。
```

# 2026-07-08 差分追記: R54-AHR Post-PNT PCM-OP00〜OP08必読セット

Post-PNT PCMを読むときは、次を必読扱いにする。

| 種別 | path | 読み方 |
|---|---|---|
| service helper | `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_20260707.py` | PCM-OP00〜OP08のbody-free Post-PNT closed material confirmation helper。PNT-OP08 material synthesis、selected_pcm_next_boundary execution、DHR-OP05、DMD、R52、P8、releaseを実行したとは読まない。 |
| target tests | `mashos-api/ai/tests/test_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_pcm_op00_op01_20260707.py` ... `test_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_pcm_op08_result_20260707.py` | PCM-OP00〜OP08の段階別contract tests。target greenはhelper contract成立であり、current lane inferenceやfull backend suite greenではない。 |
| result memos | `mashos-api/ai/tests/R54_AHR_PostPNT_ClosedMaterialNextBoundaryConfirmation_PCM_OP00_OP01_Result_20260707.md` ... `R54_AHR_PostPNT_ClosedMaterialNextBoundaryConfirmation_PCM_R11_NextWorkDecision_20260707.md` | PCM closure / target validation / selected regression / compileall / result memo closure / next work decisionをbody-freeで記録する。 |
| premise diff CSV | `r54pcm_diff_20260708.csv` | 前提資料側の短名coverage一覧。16 entries added / 0 changed / 0 removedを記録する。 |

PCM-OP00〜OP08を読むときの禁止:

```text
PCM target greenをcurrent lane確定として読まない。
PNT-OP08 default builder call / material synthesisが行われたとは読まない。
PNT R11 decision table / six outcome summaryを単一closed materialとして読まない。
next_design_document_allowedをDHR-OP05 / actual review / repair execution permissionとして読まない。
wait_hold / stopを次設計候補へpromoteしない。
R7/R8/R9 greenをfull backend suite green / RN contract green / RN real-device verifiedとして読まない。
R10/R11 closureをP5 final / P6 start / P8 start / P7 complete / release readyとして読まない。
```

# 2026-07-09 差分追記: R54-AHR Post-PCM DHB-OP00〜OP08必読セット

Post-PCM DHR-OP05 Manual Handoff Boundaryを読むときは、次を必読扱いにする。

| 種別 | path | 読み方 |
|---|---|---|
| service helper | `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_20260708.py` | DHB-OP00〜OP08のbody-free Post-PCM manual handoff helper。DHR-OP05 call / existing builder call / DHR-OP06 / DMD / R52 / P8 / releaseを実行したとは読まない。 |
| target tests | `mashos-api/ai/tests/test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_r0_r1_20260708.py` ... `test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op08_result_20260708.py` | DHB skeleton / OP00〜OP08の段階別contract tests。target greenはhelper contract成立であり、current lane inferenceやfull backend suite greenではない。 |
| fixture / modified regression tests | `mashos-api/ai/tests/r54_ahr_post_pnt_pcm_compact_pnt_op08_fixture_20260708.py` and modified Post-PNT PCM regression tests | R8 selected regressionのfixture intake repair。production helperやPCM runtime behaviorの変更ではない。 |
| result memos | `mashos-api/ai/tests/R54_AHR_PostPCM_DHROP05ManualHandoffBoundary_DHB_R7_TargetValidation_Result_20260708.md` ... `R54_AHR_PostPCM_DHROP05ManualHandoffBoundary_DHB_R11_NextWorkDecision_20260708.md` | DHB validation / selected regression / compileall / result memo closure / next work decisionをbody-freeで記録する。DHR-OP05 execution allowanceはnone。 |
| premise diff CSV | `r54dhb_diff_20260709.csv` | 前提資料側の短名coverage一覧。13 entries added / 5 changed / 0 removedを記録する。 |

DHB-OP00〜OP08を読むときの禁止:

```text
DHB helper greenをDHR-OP05実行許可へ変換しない。
PCM R11 memoやtarget/regression/compileall greenをcurrent lane確定として読まない。
manual handoff envelope readyをDHR-OP05 builder input実行済みとして読まない。
compatibility crosswalkを既存DHR-OP05 preflight scan結果として読まない。
R8 split greenをone-shot selected regression completion greenとして読まない。
R10/R11 result memo closureをP8 start / P7 complete / release allowedへ変換しない。
```

# 2026-07-09 差分追記: R54-AHR Post-DHB DHC-OP00〜OP08必読セット

Post-DHB DHR-OP05 Manual Call / Existing Preflight Scan Execution Considerationを読むときは、次を必読扱いにする。

| 種別 | path | 読み方 |
|---|---|---|
| service helper | `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_20260709.py` | DHC-OP00〜OP08のbody-free Post-DHB manual call consideration helper。DHR-OP05 runtime call / DHR-OP06 / DMD / R52 / P8 / releaseを実行したとは読まない。 |
| target tests | `mashos-api/ai/tests/test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_r0_r1_20260709.py` ... `test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_op08_result_20260709.py` | DHC skeleton / OP00〜OP08の段階別contract tests。target greenはhelper contract成立であり、runtime execution permissionやfull backend suite greenではない。 |
| result memos | `mashos-api/ai/tests/R54_AHR_PostDHB_DHROP05ManualCallExecutionConsideration_DHC_R7_TargetValidation_Result_20260709.md` ... `R54_AHR_PostDHB_DHROP05ManualCallExecutionConsideration_DHC_R11_NextWorkDecision_20260709.md` | DHC validation / selected regression / compileall / result memo closure / next work decisionをbody-freeで記録する。current execution allowanceはnone。 |
| premise diff CSV | `r54dhc_diff_20260709.csv` | 前提資料側の短名coverage一覧。12 entries added / 0 changed / 0 removedを記録する。 |

DHC-OP00〜OP08を読むときの禁止:

```text
DHC helper greenをDHR-OP05 runtime execution許可へ変換しない。
DHB handoff envelope readyをDHR-OP04 actual source claim separationとして読まない。
explicit OP04 materialなしでexisting DHR-OP05 builderを呼べるとは読まない。
DHC-OP04 controlled builder pathをruntime execution済みとして読まない。
scan clear stoppedをDHR-OP06 call permissionとして読まない。
R10/R11 result memo closureをP8 start / P7 complete / release allowedへ変換しない。
```

# 2026-07-10 差分追記: R54-AHR Post-DHC DHD必読セット

Post-DHC Direction Decision Boundaryを読むときは、次を必読扱いにします。

| 種別 | path | 読み方 |
|---|---|---|
| service helper | `mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_dhc_direction_decision_boundary_20260709.py` | DHD R0〜R1 / OP00〜OP08のbody-free direction decision helper。DHC result合成、DHR-OP06 call、P7 actual evaluation、P8、releaseを実行したとは読まない。 |
| target tests | `mashos-api/ai/tests/test_r54_ahr_post_dhc_direction_decision_boundary_dhd_r0_r1_20260709.py` ... `test_r54_ahr_post_dhc_direction_decision_boundary_dhd_op08_result_20260709.py` | DHD段階別contract tests。six direction outcome、decision/candidate pair、no-touch、stopped closureを固定する。greenはruntime permissionではない。 |
| result memos | `mashos-api/ai/tests/R54_AHR_PostDHC_DirectionDecisionBoundary_DHD_R7_TargetValidation_Result_20260709.md` ... `R54_AHR_PostDHC_DirectionDecisionBoundary_DHD_R11_NextWorkDecision_20260709.md` | 294 target / 865 selected / optional readfeel 15 / five-file compileall / R10 closure / R11 next-work decisionを記録する。current execution allowanceはnone。 |
| premise diff CSV | `r54dhd_diff_20260710.csv` | 前提資料側の短名coverage一覧。12 entries added / 0 changed / 0 removedを記録する。 |

DHDを読むときの禁止:

```text
DHD helper greenをcurrent production direction確定や実行許可へ変換しない。
DHC R11 memoやDHC greenをcurrent selected DHC-OP08 materialへ変換しない。
DHR-OP06 considerationをDHR-OP06 builder callへ変換しない。
P7 readfeel reconnection design firstをactual evaluation / P7 completeへ変換しない。
OP08 closureをselected direction実行済みとして読まない。
optional readfeel regression greenをproduct readinessへ変換しない。
R10/R11 closureをP8 start / question_text / release allowedへ変換しない。
```

# 2026-07-11 差分追記: P7-PQR / Grounded Adaptive Observation 必読セット

## P7-PQR actual local reviewを読むとき

| 種別 | path | 必読理由 |
|---|---|---|
| preflight | `mashos-api/ai/tests/P7_PQR_I0_I3Q_Preflight_Result_20260710.md` | I0〜I3-Qのcurrent basis、blocked条件、actual rows 0を固定する。 |
| blank sidecar | `mashos-api/ai/tests/P7_PQR_I3Q_Sidecar_Form_20260710.md` | 24-slot formをactual evidenceへ昇格させない。 |
| controller | `mashos-api/ai/tools/emlis_p7_p5_actual_local_review.py` | local root / exact allow / human attestation / Pass A-B-C / purgeのfail-closed owner。 |
| controller test | `mashos-api/ai/tests/test_emlis_p7_p5_actual_local_review_20260710.py` | controller contract。今回12 passed。 |
| operation result | `P7_PQR_P5_Actual24_LocalReview_Operation_Result_20260710.md`, `P7_PQR_P5_Actual24_LocalReview_ExecutionAttempt2_Result_20260710.md` | `P5_EXECUTION_BLOCKED_STOPPED`、human rows 0、P5/P6/P8/release falseを固定する。 |
| diff | `p7pqr_diff_20260711.csv` | 7 addedのfile-level正本。 |

## Grounded Adaptive Observationを読むとき

| 種別 | path | 必読理由 |
|---|---|---|
| I0 | `tests/helpers/emlis_ai_grounded_observation_i0_inventory.py`, `tests/test_emlis_ai_grounded_observation_i0_inventory.py` | frozen inventory / reachability。current localでは4 passed / 3 failedなのでgreen扱い禁止。 |
| I1-I2 | `services/ai_inference/emlis_ai_grounded_observation_plan.py`, `tests/test_emlis_ai_grounded_observation_plan_i1.py` | canonical plan、real evidence ids、nuclei / relations / coverage / Safety policy。 |
| I3-I4 | `services/ai_inference/emlis_ai_grounded_sentence_surface.py`, `tests/test_emlis_ai_grounded_observation_i2_i4.py` | functional surface、low-info / limited / self-denial overlay、plan-preserving recovery。 |
| I5 | `services/ai_inference/emlis_ai_grounded_observation_gate.py`, `services/ai_inference/emlis_ai_reply_service.py`, `tests/test_emlis_ai_grounded_observation_i5.py` | canonical public reply cutoverとsemantic Gate。external API/DB/RN contractは維持。 |
| I6 | `tests/helpers/emlis_ai_grounded_observation_i6_cases.py`, `tests/test_emlis_ai_grounded_observation_i6.py` | known4 + unseen12、metamorphic / Safety / anti-template / reachability QA。 |
| I7 | `tests/helpers/emlis_ai_grounded_observation_i7_readfeel.py`, `tests/test_emlis_ai_grounded_observation_i7.py` | local readfeelと8 canonical device evidence gate。旧A〜D logsはruntime mismatch。 |
| diff | `gao_diff_20260711.csv` | 12 added / 16 changedのfile-level正本。 |

同時に必ず読む既存前提:

```text
emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
cocolon_thought_material_for_karen.md
emlis_ai_state_answer_human_follow_definition_2026_05_26.md
02C_cocolon_contract_boundary_validation.md
07_latest_snapshot_diff.md
```

禁止する読み:

```text
focused test greenをfull backend greenへ昇格しない。
I0 / legacy regressionの7 failuresを無視しない。
functional surfaceをfixed sentence templateと同一視しない。
旧A〜D exact fixtureやdevice logsをruntime条件にしない。
I5 internal reply cutoverをpublic API / DB / RN contract変更と混同しない。
P7-PQRのcontrollerやblank formをhuman Product QA実績にしない。
```

# 2026-07-11 差分追記: P7 Gate 0 current-input 意味保持・読感修復 必読セット

指定設計を実装済みとして読む場合でも、設計書だけで完了判断せず、次のactual filesを順に確認します。

| 種別 | path | 必読理由 |
|---|---|---|
| 指定設計 | `Cocolon_EmlisAI_P7_Gate0_CurrentInput_SemanticRetention_ReadfeelRepair_DetailedDesign_ImplementationOrder_20260711.md` | R0〜R10の目的、停止条件、8項目、Gate 0完了条件。actual implementation/resultが優先。 |
| R0/R1 result | `mashos-api/ai/tests/Gate0_R0_R1_Result_20260711.md` | baseline・owner・failure classification・intentional RED。 |
| R2/R3 result | `mashos-api/ai/tests/Gate0_R2_R3_Result_20260711.md` | required retention・relation endpoint/direction/reversal修復。 |
| R6/R7 result | `mashos-api/ai/tests/Gate0_R6_R7_Result_20260711.md` | inventory/historical alignment、affected matrix、full-suite非主張。 |
| R8/R9/R10 result | `mashos-api/ai/tests/Gate0_R8_R9_R10_Result_20260711.md` | 7 pass / 9 repair、`GATE0_REPAIR_RETURN_STOPPED`、packet未生成。 |
| Plan owner | `mashos-api/ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | semantic version i2.v1、major arc retention、relation semantics。 |
| Surface owner | `mashos-api/ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py` | lexical fidelity、relation surface、human follow role。 |
| Gate owner | `mashos-api/ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | semantic subcheckとrepetition guard。human readの代替ではない。 |
| I0 | `tests/helpers/emlis_ai_grounded_observation_i0_inventory.py`, `tests/test_emlis_ai_grounded_observation_i0_inventory.py` | final fingerprint、canonical reachability、legacy zero-reachability、Safety owner。 |
| R1/R5 tests | `tests/test_emlis_ai_gate0_r1_semantic_retention.py`, `tests/test_emlis_ai_gate0_r5_semantic_subchecks.py` | exact bodyではなくnucleus/relation/lexical/follow/Gate構造を固定。 |
| I7 actual read boundary | `tests/helpers/emlis_ai_grounded_observation_i7_readfeel.py`, `tests/test_emlis_ai_grounded_observation_i7.py` | automated candidateとactual human readを分離。 |
| R8 receipt / R9 decision | `tests/fixtures/emlis_gate0_r8_karen_local_review_receipt_20260711.json`, `tests/fixtures/emlis_gate0_r9_decision_20260711.json` | body-free actual verdictと二値decisionの正本。 |
| exact8 boundary | `tests/helpers/emlis_ai_gate0_r9_r10_boundary.py`, `tests/test_emlis_ai_gate0_r8_r10_boundary.py` | 16/16 local passなしでpacketを作らない。 |
| local-only body-full | `tests/local_only/emlis_gate0_r0_baseline_20260711.json`, `tests/local_only/emlis_gate0_r8_local_comparison_20260711.json` | before/after actual read材料。public meta・実機証拠ではない。 |
| historical display | `tests/test_emlis_ai_phase20_10_real_device_recheck.py` | historical local display contract。actual device evidence=false。 |
| premise diff | `gate0_diff_20260711.csv` | 16 added / 10 changed / 0 removed、更新前後SHA-256。 |

必読順:

```text
設計の停止条件
-> R0/R1 baseline / RED
-> current Plan / Surface / Gate source
-> R2/R3・R6/R7 result
-> R8 body-free receipt
-> R9 decision
-> R10 fail-closed boundary
-> premise diff CSV
```

禁止する読み:

```text
R1/R5 structural greenをhuman read passへ変換しない。
automated 16/16をGate 0 passへ変換しない。
7 local_human_pass / 9 repair_requiredを部分合格へ緩和しない。
body-full local-only artifactをpublic meta / actual device evidenceへ昇格しない。
historical Phase20-10 testをactual device provenanceとして扱わない。
exact8 helper実装をexact8 packet生成済みとして扱わない。
GATE0_REPAIR_RETURN_STOPPEDのままP5 / P6 / P8 / releaseへ進めない。
```

# 2026-07-11 差分追記: P7 Gate 0 読感修復・Gate判定契約閉包 必読セット

指定設計の実装後を読むときは、旧R0〜R10資料だけで完了判断せず、次を順に確認します。

| 種別 | path | 必読理由 |
|---|---|---|
| 指定設計 | `Cocolon_EmlisAI_P7_Gate0_ReadfeelRepair_GateContractClosure_DetailedDesign_ImplementationOrder_20260711.md` | RR0〜RR10のcontract、validation順、stop条件。actual source/result/evidenceを優先。 |
| RR0-RR2 result | `mashos-api/ai/tests/Gate0_RR0_RR2_Result_20260711.md` | freeze、structural RED、Plan role/target修復。 |
| RR3-RR6 result | `mashos-api/ai/tests/Gate0_RR3_RR6_Result_20260711.md` | delivery/relation/clause surfaceとdecision v2。 |
| RR7-RR10 result | `mashos-api/ai/tests/Gate0_RR7_RR10_Result_20260711.md` | obsolete import移管、RR8 validation failure、RR9/RR10未開始。 |
| RR0 freeze | `tests/fixtures/gate0_rr0_freeze_20260711.json`, `tests/helpers/generate_emlis_ai_gate0_rr0_freeze.py` | pre-repair source/case/reason/body-free freeze。 |
| Plan owner | `services/ai_inference/emlis_ai_grounded_observation_plan.py` | shared role classifier、role-first target、semantic i2.v2。 |
| Surface owner | `services/ai_inference/emlis_ai_grounded_sentence_surface.py` | delivery、relation surface role、complete-clause safety、clause unit。 |
| structural tests | `tests/test_emlis_ai_gate0_rr1_structural_red.py`, `tests/test_emlis_ai_gate0_rr3_rr5_surface_contract.py` | exact本文ではなく一般構造を固定。 |
| decision v2 | `tests/helpers/emlis_ai_gate0_r9_r10_boundary.py`, `tests/test_emlis_ai_gate0_rr6_decision_contract_v2.py`, `tests/test_emlis_ai_gate0_r8_r10_boundary.py` | validation evidenceとexact8 fail-closed。 |
| artifact generator | `tests/helpers/generate_emlis_ai_gate0_r8_r9_artifacts.py` | hard-coded greenなし。fingerprint一致必須。 |
| RR8 evidence | `tests/fixtures/gate0_rr8_validation_20260711.json` | V1-V5、172 failure refs、current stopのbody-free正本。 |
| migrated old tests | `tests/test_emlis_ai_bounded_repair_reroute_step7.py`, `tests/test_emlis_ai_complete_initial_surface_recomposition_existing_gate_chain_p8.py` | private helperを復活させずcanonical ownerへ移管。 |
| premise diff | `g0rr_diff_20260711.csv` | 11 added / 8 changed / 0 removed、before/after size・SHA-256。短名。 |

必読順:

```text
指定設計のstop条件
-> RR0 freeze / RR1 structural tests
-> current Plan / Surface source
-> RR3-RR6 decision contract v2
-> RR7 migrated tests / I0 inventory
-> RR8 validation fixture
-> current stop
-> premise diff CSV
```

禁止する読み:

```text
structural greenをhuman product passへ変換しない。
V1-V4 greenだけでfull validation passにしない。
full backend 172 failuresを既知原因として推測しない。
旧7/9/0 receiptをpost-RR7 fingerprintのreviewとして流用しない。
RR7-RR10 resultというファイル名だけでRR9/RR10実施済みにしない。
productionへ削除済みprivate helper・旧substantive routeを戻さない。
exact8、P5、P6、P8、releaseを開始済みにしない。
```

# 2026-07-12 差分追記: P7 Gate 0 FB172 failure closure 必読セット

| 種別 | path | 拘束すること |
|---|---|---|
| 指定設計 | `Cocolon_EmlisAI_P7_Gate0_FB172_FailureClosure_Design_20260711.md` | B0〜B7の設計名。今回の受領ZIP内に実体はないためactual result/test/ledgerを実装確認の正本にする |
| B0〜B2 result | `mashos-api/ai/tests/Gate0_FB172_B0_B2_Result_20260712.md` | baseline/ref freeze、environment isolation、B1/B2 migration、50 pending時点の停止 |
| B3〜B5 result | `mashos-api/ai/tests/Gate0_FB172_B3_B5_Result_20260712.md` | exact body撤回、P5/P6 hold、public/Safety/low-information、13 pending時点の停止 |
| owner ledger | `mashos-api/ai/tests/fixtures/fb172_owner_ledger_20260712.json` | official 172 refs、B0〜B7分類、current owner、protected obligation、変更許可、closure state |
| environment evidence | `mashos-api/ai/tests/fixtures/fb172_environment_20260712.json` | official RR8 baselineと段階validation記録。final collect値は再確認12714を優先 |
| migration registry | `mashos-api/ai/tests/helpers/emlis_ai_fb172_migration.py` | historical node IDをcurrent obligationへtest-onlyで移管 |
| pytest setup | `mashos-api/ai/tests/conftest.py` | ai_inference import pathとFB172 migration plugin接続。production ownerではない |
| B0/B1/B2 integrity | `mashos-api/ai/tests/test_emlis_ai_fb172_b0_b2_migration.py` | frozen counts、old owner非復活、current meta/low-information/Safety obligation |
| B3〜B7 integrity | `mashos-api/ai/tests/test_emlis_ai_fb172_b3_b5_migration.py` | final batch closure、hold、B6 single production permission、B7 negative reachability |
| B6 current owner | `mashos-api/ai/tests/test_emlis_ai_fb172_b6_current_owner.py` | relation direction、D/H lineage、canonical reply、old material ID非依存 |
| sentence owner | `mashos-api/ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py` | directional relation groupのfrom-before-to stable ordering |
| Gate owner | `mashos-api/ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | sentence ownerと同一定数でrequired direction/reversal判定 |
| B7 inventory | `mashos-api/ai/tests/helpers/emlis_ai_grounded_observation_i0_inventory.py` / `test_emlis_ai_grounded_observation_i0_inventory.py` | retired route/tokenのpublic entry negative reachability |
| API registry | `mashos-api/ai/tests/contract/test_api_contract_registry.py` | session-shared app stateを避けたclean subprocess route検査 |
| premise diff | `fb172_diff_20260712.csv` | 8 added / 6 changedのfile-level before/after SHA-256 |

必ず分ける読み:

```text
B0-B7 ledger pending 0 != full backend green
frozen 172 selected 172 passed != V5 all pass
test-only migration != production legacy owner restoration
P5/P6 hold test green != P5/P6 runtime start
public E2E current path確認 != API schema change
full collect 12714 / 0 errors != full backend pass
```

current stopは `12543 passed / 169 failed / 2 skipped` による `GATE0_TEST_OR_CONTRACT_BLOCKED_STOPPED` です。same16、Gate0 pass decision、exact8、device、P5、P6、P8、releaseへ進めません。

# 2026-07-12 差分追記: P7 Gate A Post-FB172 current-input closure 必読セット

| 種別 | path | 拘束すること |
|---|---|---|
| 指定設計 | `Cocolon_EmlisAI_P7_GateA_PostFB172_CurrentInputClosure_DetailedDesign_ImplementationOrder_20260711.md` | GA0〜GA9、同一fingerprint、full backend、same16、Karen read、exact8後stopの設計境界 |
| GA0 / GA1 result | `mashos-api/ai/tests/GateA_GA0_GA1_Result_20260712.md` | pre-repair 169 failure freeze、official dependency、13 RED / 9 pass。GA2以降の完了証拠ではない |
| freeze helper | `mashos-api/ai/tests/helpers/gate0_rr_gatea_ga0_freeze.py` | deterministic source / same16 / failure-set body-free freeze |
| freeze artifact | `mashos-api/ai/tests/local_only/gatea_ga0_freeze_bodyfree_20260712.json` | baseline fingerprint、169 refs、raw input / reply / comment非収録 |
| GA0 integrity | `mashos-api/ai/tests/test_emlis_ai_gatea_ga0_freeze.py` | archive / source / same16 / failure-set hash integrity |
| GA1 structural | `mashos-api/ai/tests/test_emlis_ai_gatea_ga1_structural_red.py` | contribution、self-denial、stem、closure、clause、short、metamorphic、no-exact-body |
| GA2 contract | `mashos-api/ai/tests/test_emlis_ai_gatea_ga2_contract.py` | generic Plan / Sentence / Surface / Gate repairとcase-specific branch禁止 |
| Plan owner | `mashos-api/ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | follow role / selected target / contribution delivery owner |
| Surface owner | `mashos-api/ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py` | relation role、human-follow contribution、closure modality/scope、clause/de-dup surface |
| Gate owner | `mashos-api/ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | misclassification、duplicate、closure mismatch、stem、short-state loop rejection |
| GA5 ledger | `mashos-api/ai/tests/fixtures/gatea_ga5_residual_closure_20260712.json` | frozen 169をO0〜O5 current ownerへ投影しopen 0を固定 |
| GA5 integrity | `mashos-api/ai/tests/test_emlis_ai_gatea_ga5_closure.py` | owner evidence、cwd normalization、fail-closed、body-free closure |
| GA6 official | `mashos-api/ai/tests/fixtures/gate0_rr_gatea_ga6_official_20260712.json` | same16 deterministic / semantic Gate / public path 各16/16、本文非収録 |
| GA7 Karen receipt | `mashos-api/ai/tests/fixtures/gate0_rr_gatea_ga7_karen_review_20260712.json` | local human 16 pass / 0 repair / 0 fatal。device evidenceではない |
| GA8 validation | `mashos-api/ai/tests/fixtures/gate0_rr_gatea_ga8_validation_20260712.json` | targeted 303、Safety/public 69、RN carried-forward 36、collect 12834、backend 12832 green |
| GA8 decision | `mashos-api/ai/tests/fixtures/gate0_rr_gatea_ga8_decision_20260712.json` | Gate0 local pass、exact8許可、device未開始、P5/P6/P8 false |
| exact8 packet | `mashos-api/ai/tests/fixtures/gate0_rr_gatea_ga8_exact8_20260712.json` | local-only exact8。ready待機。本文を前提資料/public metaへ転記しない |
| final link | `mashos-api/ai/tests/fixtures/gate0_rr_gatea_ga8_final_link_20260712.json` | freeze / ledger / same16 / review / validation / decision / exact8 hash接続、open 0 |
| inventory helper | `mashos-api/ai/tests/helpers/emlis_ai_grounded_observation_i0_inventory.py` | current source / known fixture / prohibited route inventoryを最新bytesへ整合 |
| FB172 migration | `mashos-api/ai/tests/helpers/emlis_ai_fb172_migration.py` | historical test-only migrationのcurrent Grounded assertionsをGateA semanticsへ整合 |
| semantic retention | `mashos-api/ai/tests/test_emlis_ai_gate0_r1_semantic_retention.py` | protective counterdirection retention |
| semantic Gate subchecks | `mashos-api/ai/tests/test_emlis_ai_gate0_r5_semantic_subchecks.py` | counterdirection誤分類とshort-state duplicate rejection |
| surface contract | `mashos-api/ai/tests/test_emlis_ai_gate0_rr3_rr5_surface_contract.py` | self-denial contribution delivery / integrated ownership |
| grounded I2-I4 | `mashos-api/ai/tests/test_emlis_ai_grounded_observation_i2_i4.py` | current Plan / Surface semantic regression |
| premise diff | `gatea_diff_20260712.csv` | 14 added / 9 changed / 0 removed、before/after size・SHA-256。短名 |

必読順:

```text
指定設計
-> GA0 freeze / GA1 structural RED
-> current Plan / Surface / Gate
-> GA2 generic contract
-> GA5 residual owner closure
-> GA8 validation
-> GA6 same16 + GA7 Karen receipt
-> GA8 decision / exact8 / final link
-> current stop
-> premise diff CSV
```

必ず分ける読み:

```text
GA1 RED作成 != repair完了
focused 120 pass != official full backend rerun
RN carried-forward 36 pass != RN production source再検証・変更
same16 automated 16/16 != Karen human pass
Karen local 16/16 != device 8/8
Gate0 local pass != Gate B / P8 / release
exact8 packet ready != device evidence取得済み
decision時点 exact8_packet_generated=false != current packet不存在
body-full exact8 local artifact != premise/public metaへ本文掲載許可
```

current stopは `GATE0_LOCAL_PASS_DEVICE_PACKET_READY_STOPPED` です。次はMash様のexact8実機確認であり、P5、P6、P8、releaseは開始しません。

# 2026-07-12 差分追記: Grounded Human Reception作業時の必読owner

## production owner

| path | 読む理由 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | mandatory two-stageとbody-free Reception Planのowner |
| `mashos-api/ai/services/ai_inference/emlis_ai_grounded_human_reception.py` | act / stance / referent / Surfaceの専用owner |
| `mashos-api/ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py` | observation / reception行の分離とvisible two-stage join |
| `mashos-api/ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | seven Reception Gatesと旧semantic Gateのowner |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | public return直前のfour guards |

## evidence / test owner

| path | 読む理由 |
|---|---|
| `mashos-api/ai/tests/fixtures/grounded_human_reception_exact8_v2_20260712.json` | app-valid exact8 current input identity |
| `mashos-api/ai/tests/fixtures/grounded_human_reception_r6_local_qa_receipt_20260712.json` | technical acceptanceとboundary regression |
| `mashos-api/ai/tests/fixtures/grounded_human_reception_r6_karen_review_receipt_20260712.json` | 実機前local product readの履歴。current pass ownerではない |
| `mashos-api/ai/tests/fixtures/grounded_human_reception_r7_representative4_device_readiness_20260712.json` | device証拠要件と停止条件。latest bytesではnot_run |
| `mashos-api/ai/tests/test_emlis_ai_grounded_human_reception_r0_baseline.py` 〜 `r7_representative4_device_ready.py` | R0〜R7 contractと進行捏造防止 |
| `ghr_diff_20260712.csv` | latest premise basis以降の49実ファイル差分 |

## 読み違えてはいけないrule

- exact fixture語句、case ID、expected hash、完成文をproduction routeに使わない。
- 入力が長いから文字数比例で全要素へ返答する設計にしない。
- 短い入力を二〜三文へ水増ししない。
- 人間的応答の多様性をrandom synonymで作らない。
- technical pass、local human read、actual-device evidence、Product Read Feel、P5/P6/P8開始許可を分離する。
- external実機証拠がrepo receiptより新しい場合、古いreceiptをcurrent statusとして使わない。
- この2026-07-12 snapshotではresponse-depth detailed designは未実装。2026-07-14 current statusは後続節を優先する。

# 2026-07-14 差分追記: Response Depth / Richness Repair必読owner

## 読む順序

1. `Cocolon_EmlisAI_R8_GroundedHumanReception_ResponseDepth_RichnessRepair_DetailedDesign_ImplementationOrder_20260712.md`
2. `ai/tests/GroundedHumanReception_RR0_RR1_Result_20260712.md`
3. `ai/tests/GroundedHumanReception_RR2_RR3_Result_20260712.md`
4. `ai/tests/GroundedHumanReception_RR4_RR5_Result_20260712.md`
5. `ai/tests/GroundedHumanReception_RR6_RR7_Result_20260712.md`
6. `ai/docs/Cocolon_EmlisAI_GroundedHumanReception_RR8_RR9_LocalQA_KarenReadFeel_ImplementationResult_20260713.md`
7. `ai/docs/Cocolon_EmlisAI_GroundedHumanReception_RR10_Representative4_ActualDeviceDirectionCheck_ImplementationResult_20260713.md`

## production / contract owner

| path | current responsibility |
|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | Opportunity、Depth Policy、MovePlan |
| `ai/services/ai_inference/emlis_ai_grounded_human_reception.py` | Clause / Move単位のhuman reception realization |
| `ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py` | multi-Move sentence surfaceと二段join |
| `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | 12 Reception Gates、Depth / Move / non-enumeration検査 |
| `ai/services/ai_inference/emlis_ai_reply_service.py` | public return直前のfinal fail-closed guard |
| `ai/tests/fixtures/grounded_human_reception_rr0_r8_freeze_20260712.json` | repair前failure / progression freeze |
| `ai/tests/fixtures/grounded_human_reception_rr8_local_qa_receipt_20260713.json` | RR8 technical acceptance。実機authorityなし |
| `ai/tests/fixtures/grounded_human_reception_rr9_karen_review_receipt_20260713.json` | 9件×13軸local read。progression authorityなし |
| `ai/tests/fixtures/grounded_human_reception_rr10_representative4_device_readiness_20260713.json` | RR10 body-free readiness。actual deviceはnot_run |
| `ai/tools/emlis_grounded_human_reception_rr10_verify_device_evidence.py` | 実機証拠bundleのpath / bytes整合検査。実機操作の真正性自体は証明しない |

## 読み違え禁止

- RR0〜RR9実装とRR10 readinessを、RR10 actual-device PASS、RR11、RR12完了へ拡張しない。
- RR9華恋local human passをMash判定や進行権限へ変換しない。
- RR10 expected packet / templateを実結果で上書きしない。
- 12 Gate technical passを商品読感passへ変換しない。
- file-level差分は`eai714_diff.csv`の`R8_RESPONSE_DEPTH`行を読む。

# 2026-07-14 差分追記: Model-Free Natural Language Surface v2必読owner

## 読む順序

1. `Cocolon_EmlisAI_ModelFreeNaturalLanguageSurfaceV2_DetailedDesign_ImplementationOrder_20260713.md`
2. `ai/docs/Cocolon_EmlisAI_NLSv2_AllSteps_Audit_Correction_20260713.md`
3. `ai/docs/Cocolon_EmlisAI_NLSv2_S0_S1_Result_20260713.md`から`S12_S13_DeviceCheck_Blocked_Result_20260713.md`までの段階別result
4. `ai/tests/fixtures/emlis_nls_v2_all_steps_audit_20260713.json`
5. 各Step freeze / receipt / test

監査訂正文書とaudit receiptを、段階別resultの冒頭に追加された訂正よりも含むcurrent全Step authorityとして読む。過去freezeとone-shot receiptは変更せず、current判定だけを訂正する。

## offline module owner

| path | current responsibility / boundary |
|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_reception_content_plan_v2.py` | ContentPlan v2。Step 3 underimplemented |
| `ai/services/ai_inference/emlis_ai_grounded_reception_candidate_plan_v2.py` | CandidatePlan v2。Step 4 partial |
| `ai/services/ai_inference/emlis_ai_grounded_human_reception_v2.py` | candidate Surface。Step 5 product goal unmet |
| `ai/services/ai_inference/emlis_ai_grounded_reception_candidate_selector_v2.py` | 14 Hard Gate / Soft score。Step 6 semantic gate underimplemented |

これら4 moduleはoffline candidate branchであり、production runtime ownerではない。

## freeze / receipt / test owner

| path | 読む理由 |
|---|---|
| `ai/tests/fixtures/emlis_nls_v2_s0_freeze_20260713.json` | 設計・owner・no-change boundary |
| `ai/tests/fixtures/emlis_nls_v2_s1_receipt_20260713.json` | v1 baseline receipt |
| `ai/tests/fixtures/emlis_nls_v2_s2_corpus_manifest_20260713.json` | 70件identity / cohort manifest。本文を前提資料へ載せない |
| `ai/tests/fixtures/emlis_nls_v2_s7_freeze_20260713.json` | 歴史artifact。監査後はcompletion ownerではない |
| `ai/tests/fixtures/emlis_nls_v2_s8_s9_protocol_freeze_20260713.json` | A/B one-shot protocol |
| `ai/tests/fixtures/emlis_nls_v2_s8_holdout_a_receipt_20260713.json` | run 1 / STOPを保持 |
| `ai/tests/fixtures/emlis_nls_v2_s9_holdout_b_receipt_20260713.json` | not_evaluated。A STOP後の正しい遮断 |
| `ai/tests/fixtures/emlis_nls_v2_s10_s11_runtime_blocked_20260713.json` | shadow / switch停止証拠。feature実装証拠ではない |
| `ai/tests/fixtures/emlis_nls_v2_s12_s13_device_blocked_20260713.json` | v1 device baselineとv2停止証拠。formal v2実機passではない |
| `ai/tests/test_emlis_nls_v2_all_steps_audit.py` | Step 3 / 4 / 6欠陥、freeze保全、AST runner検査のcurrent audit test |

## 読み違え禁止

- Step 7 freezeをcurrent合格ownerへ戻さない。
- Holdout A / BをDevelopment化、再開封、同一v2の再評価へ使わない。
- `62 passed / 3 classified failed`のpass数だけを切り出して全Step greenと書かない。
- blocked guard / receiptをStep 10〜13のfeature実装と呼ばない。
- 4 moduleの存在をruntime import、shadow、owner switchと同一視しない。
- 次のsource変更は新versionとfresh independent holdoutを前提にする。
- file-level差分は`eai714_diff.csv`の`NLS_V2`行を読む。

# 2026-07-20 差分追記: NLS v3 Step 11必読owner / rule index

## 2026-07-20 authority read order（履歴）

| order | artifact | role |
|---:|---|---|
| 1 | `NLSv3_Step11_Cycle001_rc0031_Session_Handoff_20260720.md` | current status / navigation |
| 2 | `Cocolon_EmlisAI_ModelFreeNaturalLanguageSurfaceV3_DetailedDesign_ImplementationOrder_20260714_Revised_Cycle.md` | invariant / order / acceptance |
| 3 | `NLSv3_Step11_rc0031_PropositionSurface_Design20_3_Impact_Addendum_20260720.md` | current narrow allowed scope |
| 4 | `NLSv3_Step11_rc0031_ImpactBoundary_BodyFree_Receipt_20260720.json` | scope identity / non-claim |
| 5 | rc0030 E3 machine / Product Read STOP handoff and receipts | immediate predecessor result |
| 6 | GitHub pin上のactual paths | current bytes |

## rc0031 conditional existing owner

| path | responsibility |
|---|---|
| `ai/services/ai_inference/emlis_ai_step11_grounded_lexicalization_v3.py` | conditional predicate-ready projection。P1必要性判定前は編集しない |
| `ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py` | root proposition、relation、distribution、Receptionのprimary repair |
| `ai/services/ai_inference/emlis_ai_step11_natural_surface_matcher_v3.py` | Body-only Parser / Independent Matcher lockstep |
| `ai/services/ai_inference/emlis_ai_step11_hard_gate_v3.py` | additive Gate / selector lockstep |

exact 4はclosed maximumであり、全4編集義務ではありません。既存prefixはimmutableです。new fileは補遺§7.2のexact 18 maximum allowlistだけで、phase active subsetを守ります。

## current gate / evidence owner

| artifact / test family | rule |
|---|---|
| P1 exact 7 | 1 freeze PASS + 6 semantic intentional RED。source edit前freeze |
| new pending attack exact 24 | root / schema / relation / distribution / Reception / boundary各4 |
| forward / inverse independence | inverseがforward plan / AST / span / self-claimを読まない |
| E3 representative8 | machine 8 / 8後に2 reviewer Product Read |
| E4 frozen100 | E3 Product Read acceptance後のみread-only |
| formal closure | E4後の別authority / new run ID |

## immutable predecessor groups

- Step 9全20 owner / manifest
- E1b successor authority
- rc0027 default、rc0028、rc0029、rc0030
- Content Selection / Discourse / Planning Frontier
- Grounded Human Reception authority
- shared/public runtime / route / reply / DB / RN / Safety / question
- corpus / historical Product Read

file-level current deltaは`eai720_diff.csv`です。GitHub compare 235 pathのうち、既に`eai714_diff.csv`へ反映済みNLS v2 10 pathと、未反映NLS v3 225 pathを分離しています。

# 2026-07-21 差分追記: current authority / rc0031 P3 rule index

## current authority read order

| order | artifact | role |
|---:|---|---|
| 1 | `07_latest_snapshot_diff.md` | canonical current authority / latest exact heads / STOP |
| 2 | Revised Cycle設計 | invariant / phase order / acceptance |
| 3 | `NLSv3_Step11_rc0031_P3_PrerequisiteConsistency_Design20_3_Addendum_RED_Handoff_20260721.md` | latest prerequisite reconciliation / next authority |
| 4 | `NLSv3_Step11_rc0031_P3_PrerequisiteConsistency_RED_BodyFree_Receipt_20260721.json` | body-free exact result / non-claim |
| 5 | SurfaceGrammar / BodyDimension / FinalInverse補遺 | P3 blocker lineage |
| 6 | VerifiedBaseReuseComposition GREEN handoff / receipt | private reuse GREEN boundary |
| 7 | P2 Freeze handoff / receipt | immutable forward predecessor |
| 8 | GitHub上のactual paths | current bytes |

## current rule owner

| owner | fixed rule |
|---|---|
| `11_cocolon_github_transport_and_session_continuity.md` | GitHub反映方法と完了判定の唯一のcurrent正本 |
| `07_latest_snapshot_diff.md` | 作業完了ごとの小さいcurrent authority更新 |
| `work_attitude_rules_for_karen/00_read_first.txt` | current authority / actual environment / GitHub contract必読 |
| `work_attitude_rules_for_karen/08_artifact_delivery_rules.txt` | GitHub成功時ZIPなし、実反映不能時だけ変更file限定ZIP |
| `work_attitude_rules_for_karen/09_work_start_checklist.txt` | current contractに沿うwrite前後check |
| `work_attitude_rules_for_karen/10_stop_judgment_and_unwritten_rules.txt` | target conflict / actual failure / unknown / no permission / unapproved or irreversible operationだけの停止境界 |

# HISTORICAL_NON_NORMATIVE: 2026-07-25 GitHub transport / session continuity

この節のdeploy key、SSH、fingerprint、full fetch、exact leaseは当時の履歴であり、current GitHub反映条件または停止条件ではない。

| owner | responsibility |
|---|---|
| `11_cocolon_github_transport_and_session_continuity.md` | 登録済みCocolon deploy keyの非秘密identity、repository scope、SSH 443 / host identity、sessionごとの認証・full fetch・exact lease再確認 |
| `07_latest_snapshot_diff.md` | 当該checkpointで実測したtransport capabilityと、formal authorityへの影響をsecret-freeで差分記録 |
| `work_attitude_rules_for_karen/08_artifact_delivery_rules.txt` | unleased force / history rewriteと、承認済みexact expected-old-SHA leaseを区別 |
| `work_attitude_rules_for_karen/09_work_start_checklist.txt` | credential fingerprint、host、remote、live H0、fetch、receive-pack / lease preflightをsessionごとに再確認 |
| `work_attitude_rules_for_karen/10_stop_judgment_and_unwritten_rules.txt` | credential露出、fingerprint / host / repository不一致、認証失敗、lease拒否、post-fetch不能時のSTOP |

Karen-DiaryはCocolon transport前提の正本ではありません。秘密情報を残さず、Cocolon作業のcontinuityは上記ownerで復元します。

# 2026-07-25 差分追記: Mash様への作業依頼説明owner

| owner | responsibility |
|---|---|
| `work_attitude_rules_for_karen/07_forbidden_shifting_burden_to_user.txt` | Mash様へ作業を求める前の代行不能確認、現在状態→直接原因→依頼操作による解消→代替不能→未実施 / 完了時の影響という必要性説明、目的・端末・時間 / session制約・開始画面・一操作ずつの手順・禁止事項・完了条件・返答・華恋follow-upを全て含む説明contract |
| `work_attitude_rules_for_karen/00_read_first.txt` | 詳細説明をCocolon作業の絶対ruleとして必読化 |
| `work_attitude_rules_for_karen/09_work_start_checklist.txt` | Mash様へ依頼を出す直前の説明完全性check |
| `work_attitude_rules_for_karen/99_integrated_paste_each_time.txt` | 毎回読む統合ruleへ同じ境界を固定 |
| `11_cocolon_github_transport_and_session_continuity.md` | GitHub反映の唯一のcurrent契約。実際のwrite権限不足が確認された場合だけ、必要な権限回復説明の参照先にもなる |

専門用語だけ、複数案だけ、または「ファイルパスを教えてください」だけの依頼は不十分です。Mash様が追加質問なしで安全に完了できる画面操作単位まで説明します。

# HISTORICAL_NON_NORMATIVE: 2026-07-25 GitHub Actions publication guardian rule index

| owner / rule | responsibility |
|---|---|
| `12_cocolon_github_actions_publication_guard.md` | Actions番人の状態、request canonicalization、actor、locked path、exact lease、postverification、reconcile、5試験、activation、SSH fallback境界 |
| `.github/workflows/cocolon_formal_publication_guard.yml` | trusted default-branch入口、job別最小権限、static queue、bootstrapのproduction / sandbox静的disabled |
| `.github/cocolon_formal_publication_guard/guardian.py` | 不信Issue入力のstrict検査、candidate非実行、Git object検査、direct-child再構築、write gate、typed receipt |
| `.github/cocolon_formal_publication_guard/policy_v1.json` | repository ID、actor allowlist、mode、production / sandbox flag、branch namespace、locked path、上限 |
| `.github/cocolon_formal_publication_guard/request_v1.schema.json` | production / sandbox / fault / reconcile依頼票の公開shape |
| `.github/cocolon_formal_publication_guard/test_guardian.py` | local security regression。GitHub sandbox 5試験の代用ではない |
| `11_cocolon_github_transport_and_session_continuity.md` | migration中のactive SSH exact lease、Replacement 02、maintenance / fallback route |
| `07_latest_snapshot_diff.md` | installed disabled state、未確認、次checkpoint、D1非開始のcurrent authority |

この節全体はGuardian構築当時の履歴である。Guardianは`RETIRED_DISABLED`であり、`11`の旧SSH exact lease、Guardian workflow、Issue-driven publication、sandbox publicationをcurrent routeとして読まない。

## rc0031 current gate

- P1 exact7は`1 PASS / 6 intentional RED`。
- P2 current tree exact24は`23 PASS / 1 historical path-scope RED`。semantic regressionに数えない。
- private verified reuse exact10は`10 PASS`だが、private / disconnected boundaryを越えない。
- P3 exact24は`15 PASS / 9 intentional RED`。Product Surface grammarは未解決。
- P3 Product Surface successor、Parser / Matcher append、P4、runtime / manifest、E2以降は未開始。
- 次のauthorityはProduct Surface grammarのdesign-only + Product Readまで。Surface実装はSTOP。

## 2026-07-26 current actual environment / guardian retirement index

`12_cocolon_github_actions_publication_guard.md`はhistorical owner /
retired system recordです。current execution authorityではありません。
workflowはrepository metadataで`disabled_manually`です。再開には、
changed actual environmentを根拠とするMash様の新しい明示authorityが必要です。

work attitude owner:

- `03_forbidden_insufficient_premise_and_actual_file_check.txt`:
  current actual environment、比例性、future trigger、system中止条件の正本。
- `09_work_start_checklist.txt`:
  proportionality check、same-package continuation、結果不明時の停止条件の正本。

過去のguardian owner参照、Issue、run、branch、refはhistorical evidenceとして
保持し、current routeとして再利用しません。


# 2026-07-27 CURRENT GitHub reflection contract index

- 唯一のcurrent正本:
  `11_cocolon_github_transport_and_session_continuity.md`の
  `CURRENT_NORMATIVE_CONTRACT`。
- 作業者:
  華恋だけ。Mash様が承認したscopeだけを書く。
- 方法:
  現在利用できるGitHub機能。特定鍵・transport・command・single commitを必須にしない。
- pre/post:
  current latest、approved exact path、target conflict、target bytes、今回のwrite commit群のchanged path、latestへの全成果物包含を確認する。
- stop:
  target conflict、actual write failure、unknown result、actual no permission、unapproved path requirement、delete/history rewrite/unapproved irreversible operationだけ。
- priority:
  過去・後続の設計、test、receipt、planは条件を厳しくできない。
- change authority:
  Mash様が変更条文と変更後内容を別作業として明示承認した場合だけ。

旧transport条件だけで失敗するactive testは、作業停止理由ではなくtest不具合とする。

# 2026-08-01 CURRENT Work test-runner runtime continuity index

| owner / rule | current responsibility |
|---|---|
| `13_cocolon_work_test_runner_runtime_continuity.md` | Work-local Python / pytest test-runnerのsession continuity、identity、discovery、readiness recovery、target admissionの技術正本 |
| `work_attitude_rules_for_karen/16_test_runner_runtime_continuity_and_one_shot_prelaunch.txt` | 華恋の毎session・毎targeted pytest authorityの強制実行規則 |
| `work_attitude_rules_for_karen/00_read_first.txt` | pytest依存作業で13 / 16を必読化 |
| `work_attitude_rules_for_karen/03_forbidden_insufficient_premise_and_actual_file_check.txt` | 過去READYではなくcurrent runtime実体とidentityを確認 |
| `work_attitude_rules_for_karen/07_forbidden_shifting_burden_to_user.txt` | Work-local runtime不足をMash様へのpath / venv / pytest要求へ変換しない |
| `work_attitude_rules_for_karen/09_work_start_checklist.txt` §S | target authority前のcontinuity / readiness / exact entrypoint check |
| `work_attitude_rules_for_karen/10_stop_judgment_and_unwritten_rules.txt` | prelaunch不成立をtargeted invocation 0のSTOPへ分類し、Work recoveryへ戻す |
| `work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt` | sessionを跨ぐ忘却をMash様のpath保持負担にしない |
| `work_attitude_rules_for_karen/99_integrated_paste_each_time.txt` | 毎回読む統合ruleのruntime continuity要約 |
| `11_cocolon_github_transport_and_session_continuity.md` | GitHub反映方法と完了判定のみ。runtime technical ownerではなく、本更新で変更しない |

read order:

```text
pytest-dependent work
  -> 07 current authority
  -> 13 runtime continuity technical contract
  -> 16 Karen behavioral rule
  -> 09 checklist §S
  -> active runtime-specific frozen authority / lock
  -> actual Work runtime candidate
```

absolute pathはcurrent-session private locatorであり、identityまたはpersistence証明
ではありません。interpreter executable SHA-256単独も、pytest-bearing
runtime-root / site contextを証明しません。

session boundary後は過去READYをcurrent continuity未確認へ戻し、candidate探索scopeを
固定して静的再発見します。static identityが一致してもそれだけでREADYとせず、
Gate B fresh readinessまで成立した場合だけ再利用します。見つからない場合はMash様の
作業へ変換せず、GitHub-tracked procedureにfrozen lock-derived rematerializationの
別authorityへ戻ります。
