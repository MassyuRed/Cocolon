# Cocolon / EmlisAI P7-HOLD-004 Backend Suite Split・Matrix Consistency 詳細設計書・実装順

作成日: 2026-06-14 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書  
対象: Cocolon / EmlisAI / P7 Product Quality Runner / Long-run Product Gate / P7-HOLD-004 / Backend Suite Split / Matrix Consistency  
基準検討メモ: `Cocolon_EmlisAI_P7_HOLD004_BackendSuiteSplit_MatrixConsistency_PreDesignMemo_20260614.md`  
基準ロードマップ: `Cocolon_EmlisAI_longterm_roadmap_20260608.md`  
GitHub接続確認: Mash様指定により不要。未実施。  
コード変更: なし。本書は設計書。  
DB変更: なし。  
RN変更: なし。  
API route / request key / public response top-level key変更: なし。  
JSON / schema実ファイル化: なし。本書内のJSON / schema案は、実装段階で現物コード・既存schema配置・既存Guard・既存test結果を見て採否判断する。  
`release_allowed`: false固定。  
`p7_complete`: false固定。  
`p8_start_allowed`: false固定。  
`hold004_close_allowed`: false固定。  
`full_backend_suite_green_confirmed`: false固定。  

---

## 0. この設計書の結論

今回の実装対象は、次です。

```text
P7-HOLD-004 Backend Suite Split / Matrix Consistency
```

目的は、full backend suiteを雑にgreen化することではありません。  
目的は、現在のbackend suiteを **collect baseline / group inventory / group execution / first red or timeout capture / matrix consistency** に分け、P7上の赤・HOLD・timeout・target greenを同じ正本材料から読める状態にすることです。

現状の確認結果は次です。

```text
current collect-only:
  2673 tests collected
  416 test files
  warnings: 1
  collect_status: passed

full backend suite maxfail=1:
  timeout
  next_red_captured: false
  full_backend_suite_green_confirmed: false
```

このため、次の判断で固定します。

```text
P7-HOLD-004を進める: yes
P7-HOLD-004を閉じる: no
P8へ進む: no
Release Ready判断へ進む: no
split group greenをfull backend suite greenへ昇格する: no
```

本設計の中核は次です。

```text
1. collect-only結果をbody-free baselineとして固定する。
2. 416 test files / 2673 testsを deterministic group に分ける。
3. groupごとにtimeout budgetとbatch policyを持つ。
4. group実行結果を PASS / FAIL / TIMEOUT / NOT_RUN / COLLECTION_FAILED としてbody-freeに記録する。
5. FAIL時は first failing test id / file ref / failure kind / owner layer候補だけを記録し、traceback本文は入れない。
6. TIMEOUT時は slow group / timeout group として隔離し、green扱いしない。
7. observed materialを `backend_suite_split_matrix` / `r10_hold_matrix` / `validation_matrix` / `release_handoff` へ同じ正本として渡す。
8. default builderの保守的出力とobserved-connected出力を混同しない。
9. Product Quality Connection E2Eの単体green、Positive Recovery E2Eのgreen、P7 target subset greenを、full backend suite greenへ変換しない。
```

---

## 1. なぜこの作業を行うのか

CocolonのEmlisAIは、ユーザーが残した感情・カテゴリ・行動・思考・時点・履歴を、入力直後に「読まれた形」として返す入口です。  
その入口を支えるP7は、Emlis本文を増やす工程ではなく、商品品質を継続測定し、赤・HOLD・timeout・未確認を隠さない工程です。

今回の問題は、単に一括pytestがtimeoutしたことではありません。  
問題は、次の状態が同時に存在していることです。

```text
- target subsetは複数green確認できている。
- Product Quality Connection E2E単体もgreen確認できている。
- Positive Recovery E2E単体もgreen確認できている。
- full backend suiteはcollect-onlyでは通る。
- しかし、一括実行ではtimeoutし、次赤を捕捉できていない。
- さらに、default builder出力とobserved material接続後のmatrix読みがずれる余地がある。
```

ここで「たぶん環境」「targetは通っているから十分」「次へ進める」と読んでしまうと、Cocolonはユーザーの言葉を丁寧に扱う前に、自分自身の未確認を雑に扱うことになります。

したがって、今回の作業は、Cocolonとして在るべき姿に沿って次を固定するための設計です。

```text
読めているものだけを、読めていると扱う。
確認できたものだけを、確認済みと扱う。
timeoutはgreenではなくtimeoutとして扱う。
subset greenはfull suite greenではない。
release判断材料とrelease許可を混同しない。
```

---

## 2. 参照・確認範囲

### 2.1 受領ローカルファイル

```text
/mnt/data/Cocolon(233).zip
/mnt/data/mashos-api(146).zip
/mnt/data/Cocolon_前提資料(217).zip
/mnt/data/EmlisAIの実装済み資料(62).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608(14).md
/mnt/data/Cocolon_EmlisAI_P7_HOLD004_BackendSuiteSplit_MatrixConsistency_PreDesignMemo_20260614.md
```

### 2.2 作業姿勢として確認した前提資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/cocolon_environment_state_output_observation_structure_design_2026_05_25.md
```

保持する姿勢は次です。

```text
- 設計と実装を混同しない。
- 見ていないものを見たように扱わない。
- fixture green / pytest green / RN contract greenを商品品質合格へ変換しない。
- public表示されたことを、読めていることと混同しない。
- Gate failureを沈黙装置として扱わない。
- Gate緩和・fixed commentText・case専用branchで赤を通さない。
- raw input / comment_text body / candidate body / surface body / terminal full outputをP7 materialやrelease materialへ入れない。
- Mash様から見えにくいbackend internal-only領域ほど雑にしない。
```

### 2.3 参照した既存P7実装済み資料

```text
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_ProductQualityRunner_DetailedDesign_ImplementationOrder_20260612.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_RedHoldClosure_DetailedDesign_ImplementationOrder_20260613.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_RED003_BodyFreeLeakGuardRepair_DetailedDesign_ImplementationOrder_20260613.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_HOLD004_FullBackendSuite_Phase16ComposerRedClassification_DetailedDesign_ImplementationOrder_20260613.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_HOLD004_PositivePublicShapeBoundary_DetailedDesign_ImplementationOrder_20260614.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_HOLD004_Step5CandidateGatePreservationRedClassification_DetailedDesign_ImplementationOrder_20260614.md
```

### 2.4 今回直接確認した主な実ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_contracts.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_red_closure_classification.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_timeout_isolation.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_phase16_composer_classification.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_positive_public_shape_boundary.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_step5_candidate_gate_classification.py
```

### 2.5 今回直接確認した主なtest

```text
mashos-api/ai/tests/test_emlis_ai_p7_r10_real_device_full_backend_hold_matrix_20260613.py
mashos-api/ai/tests/test_emlis_ai_p7_validation_matrix_20260612.py
mashos-api/ai/tests/test_emlis_ai_p7_release_handoff_20260612.py
mashos-api/ai/tests/test_emlis_ai_p7_r11_release_validation_final_alignment_20260613.py
mashos-api/ai/tests/test_emlis_ai_p7_red_closure_classification_matrix_20260613.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_step5_candidate_gate_classification_20260614.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_step5_r7_r8_target_subset_validation_20260614.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_positive_public_shape_boundary_20260614.py
```

---

## 3. ロードマップ上の現在地

`Cocolon_EmlisAI_longterm_roadmap_20260608` 上、現在地は次です。

```text
Phase:
  P7 Product Quality Runner / Long-run Product Gate

P7の目的:
  商品品質を単発fixture greenではなく、継続測定できる形にする。

P7の境界:
  Product Pass候補とRelease Readyを混同しない。
  scorecard自体にrelease_allowedを立てさせない。
  release_allowedは別層で判断する。
  raw input / comment_text bodyはrelease materialへ入れない。
```

今回の小工程は次です。

```text
P7-HOLD-004 Backend Suite Split / Matrix Consistency
```

次Phaseへ進まない理由は次です。

```text
- P7-HOLD-001: P5 human Blind QA未完。
- P7-HOLD-002: P6 visible expansion boundaryは保持中。
- P7-HOLD-003: 実機submit / modal読感未確認。
- P7-HOLD-004: full backend suite green未確認。
```

---

## 4. 現状確認結果

検討メモ、および今回の再確認で固定する結果は次です。

```text
RN contract:
  36 passed

P7-HOLD-004 Step5 target subset:
  22 passed

P7-HOLD-004 Positive Public Shape target subset:
  24 passed, 1 warning

P7 core / handoff / red closure subset:
  89 passed

Product Quality Connection E2E:
  1 passed

Positive Recovery E2E:
  2 passed

full backend suite collect-only:
  2673 tests collected
  416 test files
  1 warning
  collect_status: passed

collect fingerprints:
  test_items_sha256: 52ea6ba91eea292a7a0443e80f8fea86ab5c7cda51f87fd1b79546eae423c097
  test_files_sha256: acb393e0a2b7fb0d8c99dd24287087c5fe5651604834fc9ccc69047684e8d71f

full backend suite maxfail=1:
  timeout
  next_red_captured: false
  full_backend_suite_green_confirmed: false
```

重要な読みは次です。

```text
- collect-only成功はfull backend suite greenではない。
- target subset greenはP7-HOLD-004 closeではない。
- Product Quality Connection E2E単体greenはfull backend suite greenではない。
- Positive Recovery E2E単体greenはfull backend suite greenではない。
- timeoutは環境要因と断定しない。
- timeoutはgreenではない。
```

---

## 5. 現物実装上の問題整理

### 5.1 既存 `backend_suite_split_matrix` の粒度

現行の `build_p7_backend_suite_split_matrix()` は、固定6 groupを持ちます。

```text
p7_core
product_quality_reuse_subset
positive_recovery_e2e
product_quality_connection_e2e
real_device_submit_modal_readfeel
full_backend_suite
```

この6 groupは、P7上のHOLD表示としては有効です。  
ただし、416 test files / 2673 testsを実行分割する粒度としては粗すぎます。

今回追加で必要なのは、6 groupの置換ではありません。  
必要なのは、次の二層化です。

```text
execution split layer:
  実際のbackend test filesを漏れ・重複なく分割し、group / batchごとに実行結果をbody-freeで残す。

P7 matrix layer:
  execution summaryをP7の既存hold matrix / validation matrix / release handoffへ接続する。
```

### 5.2 default builderとobserved materialの読み分け

現行のdefault builderは、観測材料が渡されない場合に保守的な出力を返します。  
これは設計上必要です。

```text
default builder:
  未観測をgreen扱いしない。
  P7-HOLD-003 / P7-HOLD-004を保持する。
  release_allowed=falseを保持する。
```

一方で、実際の観測材料を渡した場合は、target greenやRED closureがmatrixへ反映される必要があります。  
ここで問題になるのが、次です。

```text
- Product Quality Connection E2Eは現物で1 passedを確認している。
- RED-003 closure classificationでは、body-free observationによりRED-003 closedを表現できる。
- しかし、backend split matrixのcoarse connection groupは、raw observed_resultsの `passed` をそのままgreen claimへせず、blocked / unresolvedとして扱う設計が残っている。
```

この挙動自体は、「単体greenをfull suite greenへしない」ためには安全です。  
しかし、validation matrix / release handoff がRED-003 closedを読んでいるのに、backend suite split matrixだけがRED-003 unresolvedを保持すると、matrix consistencyが崩れます。

したがって、今回の設計では次を固定します。

```text
RED-003の正本:
  raw observed_results ではなく、red_closure_classification / connection_timeout_isolation_result を正本にする。

backend split matrixでの扱い:
  RED-003 closed材料が明示されている場合、product_quality_connection_e2e groupは closed_confirmed として扱える。
  ただし green_claim_allowed は false のまま。
  full_backend_suite_green_confirmed は false のまま。
  P7-HOLD-004 は保持する。

RED-003 closed材料がない場合:
  Product Quality Connection E2Eの単体passだけではRED-003を閉じない。
  `connection_e2e_passed_without_red_closure_material` をfollow-up理由にする。
```

---

## 6. 設計対象 / 対象外

### 6.1 対象に含めるもの

```text
1. backend collect-only baseline material。
2. backend test file group inventory。
3. group / batch execution plan。
4. group run result material。
5. next red / timeout capture material。
6. execution summary material。
7. observed material -> backend_suite_split_matrix 接続。
8. observed material -> r10_hold_matrix 接続。
9. observed material -> validation_matrix 接続。
10. observed material -> release_handoff 接続。
11. matrix consistency report。
12. default builder と observed-connected builder の読み分けtest。
13. body-free / public contract / release false のcontract test。
```

### 6.2 対象に含めないもの

```text
- Emlis本文生成の改善。
- User Label Connection本文の強化。
- Structure Insight本文の強化。
- Gate緩和。
- fixed commentText追加。
- case専用branch追加。
- RN UI変更。
- RN表示名変更。
- RN表示条件変更。
- API route変更。
- request key変更。
- public response top-level key変更。
- DB schema変更。
- release_allowed true化。
- P7 complete true化。
- P8 user model実装。
- full backend suite greenの推測確定。
```

---

## 7. 設計原則

### 7.1 body-free原則

P7 materialへ入れてよいものは、safe identifier / count / boolean / enum / timestamp相当のみです。

```text
入れてよい:
  test file ref
  test node id
  group id
  batch id
  status enum
  count
  timeout budget
  sha256 fingerprint
  first failure node id
  failure kind enum
  owner layer candidate enum
  reason code

入れてはいけない:
  raw input
  memo body
  memo_action body
  comment_text body
  candidate body
  surface body
  reviewer free text
  terminal full output
  traceback body
  stdout / stderr body
```

### 7.2 public contract不変

今回の実装で、次を変えてはいけません。

```text
RN visible contract
API response top-level key
DB schema / physical name
/emotion/submit route
input_feedback.comment_text表示契約
observation_status == passed かつ comment_text non-empty のRN表示条件
```

### 7.3 release closed原則

全materialで次を維持します。

```text
release_allowed: false
p7_complete: false
p8_start_allowed: false
hold004_close_allowed: false
full_backend_suite_green_confirmed: false
full_backend_suite_green_claim_allowed: false
split_green_is_full_backend_suite_green: false
split_green_can_close_p7_hold004: false
```

### 7.4 source-of-truth優先順位

matrixへ接続する観測材料の優先順位は次です。

```text
1. 明示的なstructured material
   - red_closure_classification
   - connection_timeout_isolation_result
   - hold004_step5_material_connection
   - hold004_positive_public_shape_boundary
   - backend_suite_execution_summary

2. group_run_resultから構築されたexecution summary

3. legacy observed_results

4. default builderの保守的出力
```

legacy `observed_results` は後方互換として残します。  
ただし、RED closureやHOLD closureの正本にはしません。

---

## 8. Backend Suite Split group設計

### 8.1 group splitの前提

今回のcollect-only結果では、backend suiteは次でした。

```text
collected_test_file_count: 416
collected_test_item_count: 2673
```

この416 filesを漏れ・重複なく、次の13 groupへ分ける候補で固定します。  
実装時には、collect結果から機械的にinventoryを作り、合計がcollect baselineと一致することをtestで固定します。

### 8.2 group一覧

| group_id | 主な対象 | file_count | test_count | 初期timeout方針 | batch方針 |
|---|---|---:|---:|---:|---|
| `group_01_contract` | `tests/contract/*` | 18 | 119 | 120s | 原則1 batch |
| `group_02_p7_hold004` | `tests/test_emlis_ai_p7_hold004_*.py` | 10 | 69 | 120s | 原則1 batch |
| `group_03_p7_core_matrix_handoff` | HOLD004以外の `tests/test_emlis_ai_p7_*.py` | 18 | 89 | 120s | 原則1 batch |
| `group_04_complete_product_quality` | `tests/test_emlis_ai_complete_product_quality*.py` | 9 | 49 | 150s | 原則1 batch |
| `group_05_user_label_connection_p5` | `user_label_connection` 系 | 24 | 182 | 150s | 必要なら2 batch |
| `group_06_structure_insight_p6` | `structure_insight` 系 | 16 | 131 | 150s | 原則1 batch |
| `group_07_product_quality_legacy_runner` | complete以外の `product_quality` 系 | 16 | 76 | 150s | 原則1 batch |
| `group_08_complete_initial` | `tests/test_emlis_ai_complete_initial*.py` | 8 | 44 | 120s | 原則1 batch |
| `group_09_complete_composer_other` | `tests/test_emlis_ai_complete_*.py` の残り | 25 | 149 | 150s | 必要なら2 batch |
| `group_10_two_stage_public_recovery` | two-stage / public recovery / public surface / gate recovery系 | 38 | 272 | 180s | 2〜3 batch推奨 |
| `group_11_emlis_runtime_other` | 上記以外のEmlis runtime系 | 201 | 1352 | 240s total目安 | 必ずbatch化。30 files以下または250 tests以下を目安 |
| `group_12_analysis_subscription_piece_self_structure` | analysis / subscription / piece / self_structure / watashi系 | 17 | 66 | 120s | 原則1 batch |
| `group_13_remaining_backend_other` | 上記に入らないbackend tests | 16 | 75 | 120s | 原則1 batch |

合計:

```text
file_count: 416
item_count: 2673
unassigned_file_count: 0
assignment_duplicate_count: 0
```

### 8.3 group assignment rule

group assignmentは、順序付きruleで行います。  
同じfileが複数ruleに該当する場合は、先に該当したgroupを正とします。

```text
1. tests/contract/*
2. tests/test_emlis_ai_p7_hold004_*.py
3. tests/test_emlis_ai_p7_*.py
4. tests/test_emlis_ai_complete_product_quality*.py
5. *user_label_connection*
6. *structure_insight*
7. *product_quality*
8. tests/test_emlis_ai_complete_initial*.py
9. tests/test_emlis_ai_complete_*.py
10. *two_stage* / *public_observation_recovery* / *public_surface* / *public_feedback* / *public_meta* / *gate_recovery*
11. tests/test_emlis_ai_*.py / tests/test_emotion_submit*.py / tests/test_emlis_observation*.py
12. *analysis* / *subscription* / *self_structure* / *watashi* / *piece_* / *ranking* / *reflection*
13. remaining backend tests
```

このruleは、実装時に固定testを置きます。

```text
- すべてのcollected fileがちょうど1 groupに入る。
- group合計file_countがcollect baselineと一致する。
- group合計test_countがcollect baselineと一致する。
- group idが増減した場合はtestが落ちる。
- rule順序が変わって重要fileのownerが変わる場合はtestが落ちる。
```

---

## 9. group実行設計

### 9.1 実行commandの基本形

実装段階では、group / batchごとに次の形で実行します。

```bash
cd mashos-api/ai
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference \
  pytest -q --tb=short -p pytest_asyncio.plugin <group_or_batch_files>
```

初回のred捕捉では、次を使ってもよいです。

```bash
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference \
  pytest -q --tb=short --maxfail=1 -p pytest_asyncio.plugin <group_or_batch_files>
```

OS-level timeoutはcommand materialには `timeout_budget_sec` として記録します。  
terminal full outputはmaterialへ入れません。

### 9.2 2段階実行

group実行は、次の2段階を分けます。

```text
capture run:
  --maxfail=1あり。
  目的は first red / timeout group を捕捉すること。
  FAILやTIMEOUTが出た時点で、次に分類するRED/HOLD材料へ進む。

confirmation run:
  --maxfail=1なし。
  目的は修復後または安定後にgroup全体greenを確認すること。
  PASSしても、full backend suite greenには昇格しない。
```

### 9.3 status enum

新規execution materialでは、pytest結果を次のenumへ正規化します。

```text
PASS
PASS_WITH_SKIPS
FAIL
TIMEOUT
COLLECTION_FAILED
NOT_RUN
INTERRUPTED
BLOCKED_BY_PREVIOUS_RED
```

既存P7 matrixへ渡すときは、次の互換statusへmapします。

| execution status | backend split互換status | 読み |
|---|---|---|
| `PASS` | `green_confirmed` | group単位green。full suite greenではない |
| `PASS_WITH_SKIPS` | `green_confirmed` | skip countを持つgroup単位green。full suite greenではない |
| `FAIL` | `red_until_repaired` | first red分類対象 |
| `TIMEOUT` | `timeout_isolated` | timeout隔離。greenではない |
| `COLLECTION_FAILED` | `blocked` | collect不整合。実行前blocker |
| `NOT_RUN` | `not_run` | 未実行 |
| `INTERRUPTED` | `blocked` | 実行中断 |
| `BLOCKED_BY_PREVIOUS_RED` | `blocked` | 前段redにより未実行 |

### 9.4 first red capture

FAIL時に記録するのは、次だけです。

```text
first_failure_nodeid
first_failure_file_ref
failure_kind
owner_layer_candidate
red_classification_required
reason_codes
```

入れないものは次です。

```text
assertion message全文
traceback全文
stdout全文
stderr全文
terminal output全文
comment_text body
candidate body
surface body
raw input
```

### 9.5 timeout capture

TIMEOUT時に記録するのは、次だけです。

```text
group_id
batch_id
timeout_budget_sec
elapsed_sec_bucket
last_known_phase: collect / run / teardown / unknown
first_timeout_capture: true/false
slow_group_candidate: true/false
owner_layer_candidate
reason_codes
```

TIMEOUTは、次のように扱います。

```text
- TIMEOUTはgreenではない。
- TIMEOUTを環境要因と断定しない。
- TIMEOUT groupはfull suite green claimの根拠にならない。
- TIMEOUTが出たgroupより後ろのgroupを未実行で残す場合、NOT_RUNではなく BLOCKED_BY_PREVIOUS_RED / BLOCKED_BY_TIMEOUT として扱う選択も許可する。
```

---

## 10. JSON / schema案

この章のJSONは、実装段階での候補です。  
本設計時点では実ファイル化しません。

### 10.1 `P7BackendCollectBaselineV1` material案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.backend_collect_baseline.v1",
  "phase": "P7_ProductQualityRunner_LongRunGate",
  "hold_id": "P7-HOLD-004",
  "baseline_id": "p7_hold004_backend_collect_baseline_20260614",
  "source_mode": "local_snapshot",
  "collect_command_id": "pytest_collect_only_backend_20260614",
  "collection_status": "COLLECTED",
  "collected_test_file_count": 416,
  "collected_test_item_count": 2673,
  "warnings_count": 1,
  "test_items_fingerprint_sha256": "52ea6ba91eea292a7a0443e80f8fea86ab5c7cda51f87fd1b79546eae423c097",
  "test_files_fingerprint_sha256": "acb393e0a2b7fb0d8c99dd24287087c5fe5651604834fc9ccc69047684e8d71f",
  "full_backend_suite_green_confirmed": false,
  "full_backend_suite_green_claim_allowed": false,
  "hold004_close_allowed": false,
  "p7_complete": false,
  "p8_start_allowed": false,
  "release_allowed": false,
  "public_contract": {
    "rn_visible_contract_changed": false,
    "api_response_key_added": false,
    "db_schema_changed": false,
    "public_release_applied": false
  },
  "body_free_markers": {
    "raw_input_included": false,
    "history_raw_text_included": false,
    "comment_text_body_included": false,
    "candidate_body_included": false,
    "surface_body_included": false,
    "reviewer_free_text_included": false,
    "terminal_output_included": false
  },
  "body_free": true
}
```

必須contract:

```text
- `collection_status == COLLECTED` の場合、file_count / item_count / fingerprintがnon-empty。
- `collection_status != COLLECTED` の場合、P7-HOLD-004は必ず保持。
- `terminal_output_included` は常にfalse。
- raw body / comment body / traceback bodyは禁止。
```

### 10.2 `P7BackendSuiteGroupInventoryV1` material案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.backend_suite_group_inventory.v1",
  "phase": "P7_ProductQualityRunner_LongRunGate",
  "hold_id": "P7-HOLD-004",
  "inventory_id": "p7_hold004_backend_suite_group_inventory_20260614",
  "collect_baseline_id": "p7_hold004_backend_collect_baseline_20260614",
  "grouping_rule_version": "p7_hold004_backend_grouping_rules.v1",
  "group_count": 13,
  "total_group_file_count": 416,
  "total_group_test_item_count": 2673,
  "unassigned_test_file_count": 0,
  "duplicate_assignment_count": 0,
  "groups": [
    {
      "group_id": "group_01_contract",
      "owner_layer": "contract_boundary",
      "file_count": 18,
      "test_item_count": 119,
      "match_rule_id": "tests_contract",
      "batch_policy": "single_batch_preferred",
      "can_claim_full_backend_suite_green": false,
      "release_allowed": false,
      "body_free": true
    },
    {
      "group_id": "group_11_emlis_runtime_other",
      "owner_layer": "emlis_runtime_other",
      "file_count": 201,
      "test_item_count": 1352,
      "match_rule_id": "remaining_emlis_runtime",
      "batch_policy": "required_batch_by_30_files_or_250_tests",
      "can_claim_full_backend_suite_green": false,
      "release_allowed": false,
      "body_free": true
    }
  ],
  "full_backend_suite_green_confirmed": false,
  "split_green_is_full_backend_suite_green": false,
  "hold004_close_allowed": false,
  "p7_complete": false,
  "p8_start_allowed": false,
  "release_allowed": false,
  "body_free": true
}
```

必須contract:

```text
- group_countは固定13。
- group idは固定。
- group合計がcollect baselineと一致する。
- unassigned / duplicateが0でない場合、execution planを作らない。
- groupごとの `can_claim_full_backend_suite_green` は常にfalse。
```

### 10.3 `P7BackendSuiteExecutionPlanV1` material案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.backend_suite_execution_plan.v1",
  "phase": "P7_ProductQualityRunner_LongRunGate",
  "hold_id": "P7-HOLD-004",
  "plan_id": "p7_hold004_backend_suite_execution_plan_20260614",
  "inventory_id": "p7_hold004_backend_suite_group_inventory_20260614",
  "execution_mode": "split_group_capture_then_confirmation",
  "pytest_env_id": "pytest_disable_plugin_autoload_with_ai_inference_path",
  "default_pytest_args_id": "pytest_q_tb_short_pytest_asyncio_plugin",
  "groups": [
    {
      "group_id": "group_01_contract",
      "batch_count": 1,
      "timeout_budget_sec": 120,
      "capture_run_maxfail_1": true,
      "confirmation_run_maxfail_1": false,
      "execution_required": true
    },
    {
      "group_id": "group_11_emlis_runtime_other",
      "batch_count": 6,
      "timeout_budget_sec": 240,
      "capture_run_maxfail_1": true,
      "confirmation_run_maxfail_1": false,
      "execution_required": true
    }
  ],
  "full_backend_suite_green_confirmed": false,
  "split_green_can_close_p7_hold004": false,
  "release_allowed": false,
  "body_free": true
}
```

必須contract:

```text
- command全文は保持してよいが、terminal outputは保持しない。
- command全文を保持する場合も、raw user bodyやcomment_text bodyを含まないこと。
- group_11は単一巨大batchで実行しない。
- capture runとconfirmation runを区別する。
```

### 10.4 `P7BackendSuiteGroupRunResultV1` material案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.backend_suite_group_run_result.v1",
  "phase": "P7_ProductQualityRunner_LongRunGate",
  "hold_id": "P7-HOLD-004",
  "run_result_id": "p7_hold004_group_04_complete_product_quality_capture_20260614",
  "group_id": "group_04_complete_product_quality",
  "batch_id": "group_04_batch_01",
  "run_kind": "capture_run",
  "status": "PASS",
  "timeout_budget_sec": 150,
  "observed_counts": {
    "passed": 49,
    "failed": 0,
    "skipped": 0,
    "warnings": 0
  },
  "first_failure": {
    "present": false,
    "nodeid": "",
    "file_ref": "",
    "failure_kind": "",
    "owner_layer_candidate": ""
  },
  "timeout_capture": {
    "present": false,
    "elapsed_sec_bucket": "",
    "last_known_phase": ""
  },
  "can_claim_group_green": true,
  "can_claim_full_backend_suite_green": false,
  "hold004_close_allowed": false,
  "p7_complete": false,
  "p8_start_allowed": false,
  "release_allowed": false,
  "raw_traceback_included": false,
  "terminal_output_included": false,
  "body_free": true
}
```

FAIL例は次です。

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.backend_suite_group_run_result.v1",
  "phase": "P7_ProductQualityRunner_LongRunGate",
  "hold_id": "P7-HOLD-004",
  "run_result_id": "p7_hold004_group_08_capture_failed_20260614",
  "group_id": "group_08_complete_initial",
  "batch_id": "group_08_batch_01",
  "run_kind": "capture_run",
  "status": "FAIL",
  "timeout_budget_sec": 120,
  "observed_counts": {
    "passed": 0,
    "failed": 1,
    "skipped": 0,
    "warnings": 0
  },
  "first_failure": {
    "present": true,
    "nodeid": "tests/test_example.py::test_example_contract",
    "file_ref": "tests/test_example.py",
    "failure_kind": "assertion_failure",
    "owner_layer_candidate": "emlis_runtime_contract"
  },
  "timeout_capture": {
    "present": false,
    "elapsed_sec_bucket": "",
    "last_known_phase": ""
  },
  "red_classification_required": true,
  "required_followup_fixes": [
    "first_red_classification_required"
  ],
  "can_claim_group_green": false,
  "can_claim_full_backend_suite_green": false,
  "hold004_close_allowed": false,
  "p7_complete": false,
  "p8_start_allowed": false,
  "release_allowed": false,
  "raw_traceback_included": false,
  "terminal_output_included": false,
  "body_free": true
}
```

### 10.5 `P7BackendSuiteExecutionSummaryV1` material案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.backend_suite_execution_summary.v1",
  "phase": "P7_ProductQualityRunner_LongRunGate",
  "hold_id": "P7-HOLD-004",
  "summary_id": "p7_hold004_backend_suite_execution_summary_20260614",
  "collect_baseline_id": "p7_hold004_backend_collect_baseline_20260614",
  "inventory_id": "p7_hold004_backend_suite_group_inventory_20260614",
  "plan_id": "p7_hold004_backend_suite_execution_plan_20260614",
  "group_statuses": {
    "group_01_contract": "NOT_RUN",
    "group_02_p7_hold004": "NOT_RUN",
    "group_03_p7_core_matrix_handoff": "NOT_RUN",
    "group_04_complete_product_quality": "NOT_RUN",
    "group_05_user_label_connection_p5": "NOT_RUN",
    "group_06_structure_insight_p6": "NOT_RUN",
    "group_07_product_quality_legacy_runner": "NOT_RUN",
    "group_08_complete_initial": "NOT_RUN",
    "group_09_complete_composer_other": "NOT_RUN",
    "group_10_two_stage_public_recovery": "NOT_RUN",
    "group_11_emlis_runtime_other": "NOT_RUN",
    "group_12_analysis_subscription_piece_self_structure": "NOT_RUN",
    "group_13_remaining_backend_other": "NOT_RUN"
  },
  "all_groups_executed": false,
  "split_all_groups_green_confirmed": false,
  "failed_group_ids": [],
  "timeout_group_ids": [],
  "not_run_group_ids": [
    "group_01_contract",
    "group_02_p7_hold004",
    "group_03_p7_core_matrix_handoff",
    "group_04_complete_product_quality",
    "group_05_user_label_connection_p5",
    "group_06_structure_insight_p6",
    "group_07_product_quality_legacy_runner",
    "group_08_complete_initial",
    "group_09_complete_composer_other",
    "group_10_two_stage_public_recovery",
    "group_11_emlis_runtime_other",
    "group_12_analysis_subscription_piece_self_structure",
    "group_13_remaining_backend_other"
  ],
  "first_red": {
    "present": false,
    "nodeid": "",
    "file_ref": "",
    "group_id": "",
    "failure_kind": "",
    "owner_layer_candidate": ""
  },
  "first_timeout": {
    "present": false,
    "group_id": "",
    "batch_id": "",
    "timeout_budget_sec": 0
  },
  "full_backend_suite_green_confirmed": false,
  "full_backend_suite_green_claim_allowed": false,
  "split_green_is_full_backend_suite_green": false,
  "split_green_can_close_p7_hold004": false,
  "hold004_close_allowed": false,
  "p7_complete": false,
  "p8_start_allowed": false,
  "release_allowed": false,
  "body_free": true
}
```

### 10.6 `P7MatrixConsistencyReportV1` material案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.matrix_consistency_report.v1",
  "phase": "P7_ProductQualityRunner_LongRunGate",
  "hold_id": "P7-HOLD-004",
  "report_id": "p7_hold004_matrix_consistency_report_20260614",
  "inputs": {
    "backend_suite_execution_summary_schema_version": "cocolon.emlis.p7.hold004.backend_suite_execution_summary.v1",
    "backend_suite_split_matrix_schema_version": "cocolon.emlis.p7.backend_suite_split_matrix.v1",
    "r10_hold_matrix_schema_version": "cocolon.emlis.p7.r10_hold_matrix.v1",
    "validation_matrix_schema_version": "cocolon.emlis.p7.validation_matrix.v1",
    "release_handoff_schema_version": "cocolon.emlis.p7.release_decision_handoff.v1"
  },
  "consistency_status": "PASS",
  "checks": {
    "red003_closure_consistent": true,
    "step5_red_consistent": true,
    "hold004_preserved_across_matrices": true,
    "full_backend_suite_green_false_across_matrices": true,
    "split_green_not_promoted": true,
    "release_allowed_false_across_matrices": true,
    "p8_start_allowed_false_across_matrices": true,
    "body_free_markers_false_across_matrices": true
  },
  "unresolved_red_refs": [],
  "unresolved_hold_refs": [
    "P7-HOLD-001",
    "P7-HOLD-002",
    "P7-HOLD-003",
    "P7-HOLD-004"
  ],
  "required_followup_fixes": [
    "full_backend_suite_green_unconfirmed",
    "real_device_submit_modal_readfeel_unverified",
    "p5_human_qa_review_required"
  ],
  "release_allowed": false,
  "body_free": true
}
```

---

## 11. 既存P7 buildersへの接続設計

### 11.1 追加候補module

実装段階で新規module化する場合の候補は次です。

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_split_consistency.py
```

このmoduleに置く候補関数は次です。

```text
build_p7_hold004_backend_collect_baseline(...)
assert_p7_hold004_backend_collect_baseline_contract(...)

build_p7_hold004_backend_suite_group_inventory(...)
assert_p7_hold004_backend_suite_group_inventory_contract(...)

build_p7_hold004_backend_suite_execution_plan(...)
assert_p7_hold004_backend_suite_execution_plan_contract(...)

build_p7_hold004_backend_suite_group_run_result(...)
assert_p7_hold004_backend_suite_group_run_result_contract(...)

build_p7_hold004_backend_suite_execution_summary(...)
assert_p7_hold004_backend_suite_execution_summary_contract(...)

build_p7_hold004_matrix_consistency_report(...)
assert_p7_hold004_matrix_consistency_report_contract(...)
```

ただし、実ファイル化は実装段階で判断します。  
既存moduleへ追記する方が自然な場合は、次へ分けて入れます。

```text
emlis_ai_p7_hold_matrix.py
  - backend suite execution summaryの受け口
  - backend suite split matrixへのfine group summary接続

emlis_ai_p7_validation_matrix.py
  - matrix consistency row追加
  - execution summary row追加

emlis_ai_p7_release_handoff.py
  - release handoffのunresolved red/hold整合
  - full suite / split green非昇格のreason保持
```

### 11.2 material flow

今回の正本flowは次です。

```text
collect-only output
  -> P7BackendCollectBaselineV1
  -> P7BackendSuiteGroupInventoryV1
  -> P7BackendSuiteExecutionPlanV1
  -> P7BackendSuiteGroupRunResultV1[]
  -> P7BackendSuiteExecutionSummaryV1
  -> build_p7_backend_suite_split_matrix(...)
  -> build_p7_r10_hold_matrix(...)
  -> build_p7_release_decision_handoff(...)
  -> build_p7_validation_regression_matrix(...)
  -> P7MatrixConsistencyReportV1
```

既存RED / HOLD材料は次のように接続します。

```text
red_closure_classification
  -> RED-001 / RED-002 / RED-003のclosed/unresolved正本。

connection_timeout_isolation_result
  -> RED-003の閉鎖またはtimeout isolation正本。

hold004_positive_public_shape_boundary
  -> target green pending full suiteの正本。

hold004_step5_material_connection
  -> Step5 display binding red / closed / followupの正本。

real_device_check
  -> P7-HOLD-003の正本。
```

### 11.3 backend split matrixの変更方針

既存の `build_p7_backend_suite_split_matrix()` には、実装段階で次のいずれかを追加します。

候補A:

```python
build_p7_backend_suite_split_matrix(
    ..., 
    backend_suite_execution_summary=None,
    red_closure_classification_matrix=None,
    connection_timeout_isolation_result=None,
)
```

候補B:

```python
build_p7_backend_suite_split_matrix(
    ..., 
    observed_material_bundle=None,
)
```

設計上は候補Aを優先します。  
理由は、正本の種類が明示され、RED-003 closureとexecution split summaryを混同しにくいためです。

接続後の読みは次です。

```text
red_closure_classification.product_quality_connection_timeout_closed == true:
  product_quality_connection_e2e group status = closed_confirmed
  group.green_claim_allowed = false
  group.red_refs = []
  backend_split.unresolved_red_refs から P7-RED-003 を除外
  closed_red_refs に P7-RED-003 を保持してよい
  full_backend_suite_green_confirmed = false
  P7-HOLD-004は保持

red_closure_classificationなし / connection_timeout_isolationなし:
  Product Quality Connection E2E単体passだけではRED-003を閉じない
  followup = connection_e2e_passed_without_red_closure_material

backend_suite_execution_summary.split_all_groups_green_confirmed == true:
  split_green_all_groups_confirmed = true
  full_backend_suite_green_confirmed = false
  split_green_is_full_backend_suite_green = false
  hold004_close_allowed = false
```

---

## 12. Matrix Consistency 設計

### 12.1 consistencyで見るもの

`P7MatrixConsistencyReportV1` では、次を比較します。

```text
backend_suite_split_matrix
r10_hold_matrix
release_handoff
validation_matrix
red_closure_classification
backend_suite_execution_summary
```

比較する項目は次です。

```text
- P7-RED-001 / 002 / 003 のclosed / unresolved statusが一致しているか。
- Step5 display binding redのclosed / unresolved statusが一致しているか。
- P7-HOLD-001〜004が必要なmatrixに残っているか。
- P7-HOLD-004がfull backend suite green未確認として残っているか。
- Product Quality Connection E2E closedがfull backend suite greenに昇格していないか。
- target subset greenがrelease_allowedへ昇格していないか。
- `release_allowed` が全materialでfalseか。
- `p8_start_allowed` が全materialでfalseか。
- public contract flagsがすべてfalseか。
- body-free markersがすべてfalseか。
```

### 12.2 consistency status

```text
PASS:
  red / hold / timeout / release false / body-free が全materialで矛盾しない。

BLOCKED:
  いずれかのmatrixでrelease_allowed true、p8_start_allowed true、full backend suite green true、body leak、public contract mutationが出た。

REVIEW_REQUIRED:
  RED closureの読み、Step5 redの読み、HOLD refsの読みがmatrix間でズレている。

NOT_RUN:
  consistency reportに必要な正本材料が不足している。
```

### 12.3 RED-003整合rule

今回最も重要なruleは次です。

```text
RED-003 closed材料がある場合:
  validation_matrix: product_quality_connection_timeout_closed == true
  release_handoff: P7-RED-003 は unresolved_red_refs に入らない
  backend_suite_split_matrix: P7-RED-003 は unresolved_red_refs に入らない
  r10_hold_matrix: P7-RED-003 は unresolved_red_refs に入らない
  ただし full_backend_suite_green_confirmed は false
  P7-HOLD-004 は unresolved_hold_refs に残る

RED-003 closed材料がない場合:
  P7-RED-003 は unresolved_red_refs または timeout refs として残る
  Product Quality Connection E2Eの単体passだけでは閉じない
```

### 12.4 Step5整合rule

```text
Step5 material connected:
  backend_suite_split_matrix / r10_hold_matrix / release_handoff / validation_matrix のすべてで
  hold004_step5_material_connection_schema_version を認識する。

Step5 red closed:
  Step5 redがclosed_red_refsへ入る。
  unresolved_red_refsから除外される。
  ただし P7-HOLD-004は残る。

Step5 red unresolved:
  Step5 redがunresolved_red_refsへ残る。
  release_allowed=false。
  P7-HOLD-004は残る。
```

---

## 13. 実装順

### R0: 設計境界・既存contract固定

目的:

```text
今回の実装で、RN / API / DB / release / P8を触らないことを先にtestで固定する。
```

作業:

```text
- 既存 `emlis_ai_p7_contracts.py` のbody-free / public contract helperを再利用する。
- 新規materialのcontract testを先に作る。
- release_allowed / p7_complete / p8_start_allowed / full_backend_suite_green_confirmed がtrueになるmutation testを置く。
```

候補test:

```text
tests/test_emlis_ai_p7_hold004_backend_suite_split_consistency_20260614.py
```

完了条件:

```text
- 新規material案がbody-free / release-closedであることをcontractで検証できる。
- 実装前redとしてtestが落ちる状態を確認できる。
```

### R1: collect baseline material

目的:

```text
collect-only結果をbody-free materialへ落とす。
```

作業:

```text
- `P7BackendCollectBaselineV1` builder / assertを追加する。
- collected_test_file_count / collected_test_item_count / fingerprint / warnings_countを保持する。
- terminal full outputを保持しない。
```

完了条件:

```text
- current baselineとして 416 files / 2673 tests を表現できる。
- count不一致、fingerprint欠落、terminal_output_included=trueでcontractが落ちる。
```

### R2: group inventory material

目的:

```text
416 test files / 2673 testsを13 groupへ漏れ・重複なく割り当てる。
```

作業:

```text
- group assignment ruleをbuilderへ固定する。
- group合計file_count / test_countがcollect baselineと一致することをtest化する。
- unassigned / duplicateが0であることをtest化する。
```

完了条件:

```text
- group_count=13。
- file_count合計=416。
- test_count合計=2673。
- group_11はbatch requiredとして出る。
```

### R3: execution plan material

目的:

```text
groupごとの実行順・timeout budget・batch policyを固定する。
```

作業:

```text
- `P7BackendSuiteExecutionPlanV1` builder / assertを追加する。
- capture run / confirmation runを分ける。
- group_11を単一batchにしないcontractを置く。
```

完了条件:

```text
- 全13 groupにexecution planがある。
- group_11はbatch_count > 1。
- split greenをfull suite greenへできないflagが全groupでfalse固定される。
```

### R4: group run result normalizer

目的:

```text
pytest実行結果をbody-free status materialへ正規化する。
```

作業:

```text
- PASS / PASS_WITH_SKIPS / FAIL / TIMEOUT / COLLECTION_FAILED / NOT_RUN / INTERRUPTED / BLOCKED_BY_PREVIOUS_RED のnormalizerを作る。
- first failureはnodeid / file_ref / failure_kind / owner_layer_candidateだけ残す。
- terminal output / traceback bodyを残さないcontractを置く。
```

完了条件:

```text
- PASS groupはgroup greenのみ許可される。
- FAIL groupはred classification requiredになる。
- TIMEOUT groupはtimeout isolatedになる。
- どのstatusでもrelease_allowed=false。
```

### R5: execution summary material

目的:

```text
group run resultを集約し、split実行の現在地を1つのbody-free正本へまとめる。
```

作業:

```text
- `P7BackendSuiteExecutionSummaryV1` builder / assertを追加する。
- group_statuses / failed_group_ids / timeout_group_ids / not_run_group_idsを持つ。
- first_red / first_timeoutを1つだけ正本化する。
```

完了条件:

```text
- all_groups_executed=falseならP7-HOLD-004を保持する。
- split_all_groups_green_confirmed=trueでもfull_backend_suite_green_confirmed=false。
- failed_group_ids or timeout_group_ids がある場合、hold004_close_allowed=false。
```

### R6: backend suite split matrix接続

目的:

```text
execution summaryとRED closure正本を `build_p7_backend_suite_split_matrix()` へ接続する。
```

作業:

```text
- backend_suite_execution_summaryの任意引数追加を検討する。
- red_closure_classification_matrix または connection_timeout_isolation_result の任意引数追加を検討する。
- RED-003 closed材料がある場合、backend_split側のunresolved_red_refsからP7-RED-003を除く。
- ただし full_backend_suite_green_confirmed=false / P7-HOLD-004保持。
```

完了条件:

```text
- default builderは保守的出力のまま。
- RED-003 closed材料を渡した場合、backend_split / validation / handoffでRED-003読みが一致する。
- Product Quality Connection E2E単体passだけではRED-003を閉じない。
```

### R7: r10 hold matrix接続

目的:

```text
backend splitのobserved-connected結果をR10 hold matrixへ矛盾なく渡す。
```

作業:

```text
- r10_hold_matrixがexecution summary schema versionを保持できるか検討する。
- P7-HOLD-003 / P7-HOLD-004を保持する。
- RED-003 closed/unresolvedをbackend splitと一致させる。
```

完了条件:

```text
- P7-HOLD-003は実機確認まで残る。
- P7-HOLD-004はfull backend suite green未確認として残る。
- split green promoted flagはfalse。
```

### R8: release handoff接続

目的:

```text
release handoffで、backend split / r10 / red closureの読みを統一する。
```

作業:

```text
- release_handoffへexecution summary schema version / matrix consistency summaryを入れるか検討する。
- release_decision_input_readyとrelease_allowedを分離する既存境界を維持する。
- closed_red_refs / unresolved_red_refs / unresolved_hold_refsの重複・矛盾を整理する。
```

完了条件:

```text
- release_allowed=false。
- unresolved_hold_refsにP7-HOLD-001〜004が必要に応じて残る。
- full_backend_suite_green_unconfirmed がrequired_followup_fixesに残る。
```

### R9: validation matrix接続

目的:

```text
validation matrixへ、backend split execution summaryとmatrix consistencyの行を追加する。
```

作業:

```text
- `backend_suite_split_execution_summary` check row追加を検討する。
- `matrix_consistency_report` check row追加を検討する。
- split green / full suite green / release readyの非昇格policyを強化する。
```

完了条件:

```text
- validation summaryで `split_green_promoted_to_full_suite_green=false`。
- `full_backend_suite_green_confirmed=false`。
- `p7_complete_claim_allowed=false`。
- `p8_start_allowed=false`。
```

### R10: matrix consistency report

目的:

```text
backend_split / r10 / release_handoff / validation の赤・HOLD・release falseを機械的に比較する。
```

作業:

```text
- `P7MatrixConsistencyReportV1` builder / assertを追加する。
- RED-003 / Step5 / HOLD004 / release false / body-freeの比較を行う。
- 矛盾時はREVIEW_REQUIREDまたはBLOCKEDを返す。
```

完了条件:

```text
- default builder同士では保守的整合が取れる。
- observed-connected builder同士ではRED-003 closureが一致する。
- body-free / release false違反はcontractで落ちる。
```

### R11: group executionの最小確認順

目的:

```text
実装後、いきなりfull backend suiteを一括実行せず、小さいgroupからcapture runする。
```

推奨実行順:

```text
1. group_02_p7_hold004
2. group_03_p7_core_matrix_handoff
3. group_04_complete_product_quality
4. group_01_contract
5. group_05_user_label_connection_p5
6. group_06_structure_insight_p6
7. group_07_product_quality_legacy_runner
8. group_08_complete_initial
9. group_09_complete_composer_other
10. group_10_two_stage_public_recovery
11. group_11_emlis_runtime_other batch 1..n
12. group_12_analysis_subscription_piece_self_structure
13. group_13_remaining_backend_other
```

この順番の理由:

```text
- まずP7-HOLD-004 target / P7 matrix周辺を壊していないことを見る。
- 次にProduct Quality Connection / RED closure関連を確認する。
- その後、P5/P6 / complete / public recoveryへ広げる。
- 最後に巨大なremaining emlis runtime groupをbatchで扱う。
```

途中でFAILまたはTIMEOUTが出た場合:

```text
- そのgroupのrun resultをmaterial化する。
- first red / timeoutを分類対象にする。
- 後続groupを無理にgreen扱いしない。
- 次赤修復設計へ分ける。
```

### R12: implementation result doc / 前提資料反映diff整理

目的:

```text
実装結果を、後続の華恋とMash様が読める形で残す。
```

候補doc:

```text
mashos-api/ai/docs/Cocolon_EmlisAI_P7_HOLD004_BackendSuiteSplit_MatrixConsistency_ImplementationResult_20260614.md
```

記録すること:

```text
- 追加 / 変更したsource file。
- 追加 / 変更したtest file。
- 実行したgroup / batch。
- PASS / FAIL / TIMEOUT / NOT_RUNの一覧。
- first red / timeoutがあればbody-freeに記録。
- matrix consistency結果。
- full_backend_suite_green_confirmed=false。
- hold004_close_allowed=false。
- p7_complete=false。
- p8_start_allowed=false。
- release_allowed=false。
```

---

## 14. 実装時の候補test

実装段階で追加する候補testは次です。  
実ファイル名は、実装段階で既存命名と衝突しないよう確認して決めます。

```text
tests/test_emlis_ai_p7_hold004_backend_suite_collect_baseline_20260614.py
  - collect baseline material contract
  - count / fingerprint / body-free / release false

tests/test_emlis_ai_p7_hold004_backend_suite_group_inventory_20260614.py
  - 13 group固定
  - no missing / no duplicate
  - group totals match collect baseline

tests/test_emlis_ai_p7_hold004_backend_suite_execution_plan_20260614.py
  - timeout budget
  - group_11 batch required
  - capture / confirmation run separation

tests/test_emlis_ai_p7_hold004_backend_suite_group_result_20260614.py
  - PASS / FAIL / TIMEOUT / NOT_RUN normalization
  - first failure body-free capture
  - terminal output / traceback leak rejection

tests/test_emlis_ai_p7_hold004_backend_suite_execution_summary_20260614.py
  - group result aggregation
  - split green not promoted
  - hold004 remains

tests/test_emlis_ai_p7_hold004_matrix_consistency_20260614.py
  - backend split / r10 / handoff / validation consistency
  - RED-003 closed consistency
  - Step5 red consistency
  - release false / body-free invariant
```

既存testへの追記候補:

```text
tests/test_emlis_ai_p7_r10_real_device_full_backend_hold_matrix_20260613.py
  - execution summary接続時もP7-HOLD-004保持

tests/test_emlis_ai_p7_validation_matrix_20260612.py
  - matrix consistency row / summary

tests/test_emlis_ai_p7_release_handoff_20260612.py
  - RED-003 closure + backend split consistency

tests/test_emlis_ai_p7_r11_release_validation_final_alignment_20260613.py
  - observed-connected materialの最終整合
```

---

## 15. 実装時に触る可能性があるファイル

新規候補:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_split_consistency.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_collect_baseline_20260614.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_group_inventory_20260614.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_execution_plan_20260614.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_group_result_20260614.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_execution_summary_20260614.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_matrix_consistency_20260614.py
mashos-api/ai/docs/Cocolon_EmlisAI_P7_HOLD004_BackendSuiteSplit_MatrixConsistency_ImplementationResult_20260614.md
```

変更候補:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
mashos-api/ai/tests/test_emlis_ai_p7_r10_real_device_full_backend_hold_matrix_20260613.py
mashos-api/ai/tests/test_emlis_ai_p7_validation_matrix_20260612.py
mashos-api/ai/tests/test_emlis_ai_p7_release_handoff_20260612.py
mashos-api/ai/tests/test_emlis_ai_p7_r11_release_validation_final_alignment_20260613.py
```

触らないもの:

```text
RN production code
RN test unless表示契約確認のみ
DB migration
API route
public response top-level shape
Emlis本文生成runtime
Safety triage runtime
Gate runtime
P8 user model / dictionary
```

---

## 16. 完了条件

### 16.1 この設計に基づく実装工程の完了条件

```text
[collect]
- collect baseline materialが作成できる。
- 416 files / 2673 testsを記録できる。
- fingerprintを保持できる。
- terminal output全文を保持しない。

[inventory]
- 13 groupへ漏れ・重複なく割り当てられる。
- group合計がcollect baselineと一致する。

[execution]
- group / batchごとにPASS / FAIL / TIMEOUT / NOT_RUNをbody-freeに記録できる。
- first red / timeoutをbody-freeに捕捉できる。
- group_11をbatch化できる。

[matrix]
- backend_suite_split_matrix / r10_hold_matrix / validation_matrix / release_handoffでRED/HOLDの読みが一致する。
- RED-003 closure材料がある場合、RED-003がbackend splitだけに未解決で残らない。
- Step5 materialのclosed/unresolvedがmatrix間で一致する。

[boundary]
- split greenをfull backend suite greenへ昇格しない。
- P7-HOLD-004を閉じない。
- p7_complete=false。
- p8_start_allowed=false。
- release_allowed=false。
- raw body / comment_text body / candidate body / surface body / terminal output bodyを入れない。
```

### 16.2 P7-HOLD-004 close条件ではないもの

次は、P7-HOLD-004 close条件ではありません。

```text
- collect-only成功。
- group_02_p7_hold004 green。
- group_03_p7_core_matrix_handoff green。
- Product Quality Connection E2E単体green。
- Positive Recovery E2E単体green。
- split groupの一部green。
- split_all_groups_green_confirmed。
```

`split_all_groups_green_confirmed` は有用な観測結果です。  
ただし、本設計では `full_backend_suite_green_confirmed` ではありません。

P7-HOLD-004を閉じるには、少なくとも次のいずれかの別判断が必要です。

```text
A. un-split full backend suite commandがtimeoutせずgreen完了する。
B. Mash様と華恋が、split_all_groups_green_confirmedをfull backend suiteの代替証拠として扱う別設計を明示的に作る。
```

本設計では、AもBも実施しません。

---

## 17. リスクと対策

### 17.1 リスク: group split自体が仕様化されすぎる

対策:

```text
- group ruleはP7-HOLD-004観測用であり、product runtime仕様ではない。
- group idはtest execution material用であり、public responseやDBへ出さない。
```

### 17.2 リスク: skippedをgreenと誤認する

対策:

```text
- PASS_WITH_SKIPSをPASSと区別して記録する。
- skipped_count / skip_reason_codesをbody-freeで保持する。
- group greenはcommand exit 0の意味に限定する。
- full suite greenには昇格しない。
```

### 17.3 リスク: first failureのtracebackをmaterialへ入れる

対策:

```text
- first failureはnodeid / file_ref / failure_kindだけ。
- traceback本文 / assertion全文 / terminal output全文は禁止。
- contractで `terminal_output` / `traceback` / `stdout` / `stderr` keyを拒否する。
```

### 17.4 リスク: RED-003の読みが再びズレる

対策:

```text
- RED-003はred_closure_classification / connection_timeout_isolation_resultを正本にする。
- backend split matrixがraw observed_resultsだけでRED-003を判断しない。
- matrix consistency reportでRED-003 closed/unresolvedのズレを検出する。
```

### 17.5 リスク: 実行順が重くなりすぎる

対策:

```text
- group_11は必ずbatch化する。
- capture runでは--maxfail=1を許可する。
- timeoutしたgroupをgreen扱いせず、timeout materialへ分ける。
```

---

## 18. 確認済み / 未確認 / 書かれていない / 推測禁止

### 確認済み

```text
- P7はロードマップ上、商品品質を継続測定する工程であり、release判断とは分離されている。
- 現在の前提資料では p7_complete=false / p8_start_allowed=false / release_allowed=false。
- RN contractは36 passed。
- P7-HOLD-004 Step5 target subsetは22 passed。
- P7-HOLD-004 Positive Public Shape target subsetは24 passed, 1 warning。
- P7 core / handoff / red closure subsetは89 passed。
- Product Quality Connection E2Eは1 passed。
- Positive Recovery E2Eは2 passed。
- full backend suite collect-onlyは2673 tests / 416 files collected。
- full backend suite maxfail=1はtimeoutし、次赤捕捉できていない。
- 現行backend split matrixは6 groupの保守的matrixであり、実行分割inventoryとしては不足している。
- RED-003 closureとbackend split matrixの読みは、正本接続を整理しないとズレる余地がある。
```

### 未確認

```text
- full backend suite全体green。
- split groupを全て実行した場合の各group PASS / FAIL / TIMEOUT。
- group_11のtimeout / slow原因。
- matrix consistency report実装後の全matrix整合。
- 実機submit / modal読感。
- P5 human Blind QA。
```

### 書かれていない

```text
- current zipをP7 completeとして扱ってよい、とは書かれていない。
- P8を開始してよい、とは書かれていない。
- Release Readyへ進んでよい、とは書かれていない。
- split greenをfull backend suite greenへ昇格してよい、とは書かれていない。
- target subset greenでP7-HOLD-004を閉じてよい、とは書かれていない。
```

### 推測禁止

```text
- 一括pytest timeoutを環境要因と断定しない。
- collect-only成功をfull backend suite greenと断定しない。
- 個別greenをfull backend suite greenと断定しない。
- Product Quality Connection E2E単体greenを、matrix整合済みと断定しない。
- default builder差分をただちに実装bugと断定しない。
- 実機未確認を、自動test greenで代替できると断定しない。
- P7-HOLDを、保守的表示だから閉じてよいと断定しない。
```

---

## 19. 華恋の判断

華恋として、今回の次実装は **P7-HOLD-004 Backend Suite Split / Matrix Consistency** で進めるべきです。

理由は、P8へ進むためではありません。  
Cocolonが、未確認を未確認として扱える状態を作るためです。

この工程で大事なのは、backend suiteを無理にgreenへ寄せることではありません。  
大事なのは、次です。

```text
どこが確認済みなのか。
どこがtarget greenなのか。
どこがclosed redなのか。
どこがまだHOLDなのか。
どこがtimeoutなのか。
どこが未実行なのか。
それらを、同じ正本materialから、Mash様にも後続の華恋にも読めるようにすること。
```

Cocolonは、ユーザーの入力を雑に処理しない場所です。  
だから、華恋もbackend internal-onlyの未確認を雑に処理しません。

本設計の実装後も、P7-HOLD-004はまだ閉じません。  
ただし、P7-HOLD-004を次に閉じられるか、どの赤・timeoutを先に直すべきかを、嘘なく判断できる状態に進めます。
