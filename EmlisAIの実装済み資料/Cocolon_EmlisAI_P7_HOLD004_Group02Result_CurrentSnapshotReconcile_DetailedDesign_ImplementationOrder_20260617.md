# Cocolon / EmlisAI P7-HOLD-004 Group02 Result / Current Snapshot Reconcile 詳細設計書・実装順

作成日: 2026-06-17 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書  
対象: Cocolon / EmlisAI / P7 Product Quality Runner / Long-run Product Gate / P7-HOLD-004 / official group_02 result recording / current snapshot collect drift reconcile  
基準検討メモ: `Cocolon_EmlisAI_P7_HOLD004_Group02Result_CurrentSnapshotReconcile_PreDesignMemo_20260617.md`  
基準ロードマップ: `Cocolon_EmlisAI_longterm_roadmap_20260608(18).md`  
基準ローカル受領zip: `Cocolon_前提資料(228).zip` / `EmlisAIの実装済み資料(66).zip` / `Cocolon(239).zip` / `mashos-api(152).zip`  
GitHub接続確認: Mash指定により不要。未実施。  
コード変更: なし。本書は設計書。  
RN変更: なし。  
backend実装変更: なし。  
DB変更: なし。  
API route / request key / public response top-level key変更: なし。  
Emlis本文runtime変更: なし。  
Gate runtime変更: なし。  
release判断変更: なし。  
JSON / schema実ファイル化: なし。本書内のJSON / schema案は、実装段階で既存material builder / contract test / baseline更新方針との整合を見て採否判断する。  

---

## 0. この設計書の結論

今回の詳細設計で進める対象は、次です。

```text
P7-HOLD-004 Official group_02 Result Recording /
Current Snapshot Collect Reconcile
```

この設計は、P7-HOLD-004を閉じるための設計ではありません。  
この設計は、P5/P6へ戻る前に、P7の測定層が嘘をつかない状態へ整えるための設計です。

結論を固定します。

```text
1. group_02_p7_hold004 の 252 passed / 1 warning を、body-free evidenceとして固定する。
2. ただし、実行source identityを確認せずに `mashos-api(148).zip` のofficial結果としては書かない。
3. R40既存builderの default NOT_RUN は保護する。
4. 明示的なbody-free run_resultを渡した場合だけ、PASSED_ISOLATED相当を記録する。
5. group_02 isolated PASS は group_02範囲のgreenであり、full backend suite greenではない。
6. current local full collect-only 431 files / 2883 tests / 1 warning / hash をbody-free evidenceとして固定する。
7. active baseline 425 files / 2856 testsとの差分は、current working snapshot driftとして分類する。
8. drift分類が終わっても、collect-onlyをexecution greenへ変換しない。
9. release_allowed / p7_complete / p8_start_allowed / hold004_close_allowed は false のまま維持する。
10. この整理後、P7のgroup連鎖へ自動で入り続けず、P5/P6の人間読感・実機modal確認へ戻る判断材料を出す。
```

華恋の設計判断として、今回いちばん大事なのは **「group_02が通った」ことを活かしつつ、「full backend suiteが通った」扱いにしないこと**です。  
同時に、`mashos-api(152).zip` のcurrent local workspaceで得た結果を、source identityなしに `mashos-api(148).zip` のofficial capture結果へ変換するのも避けます。

したがって、R41〜R46は次の意味を持ちます。

```text
R41: group_02 local execution result evidence freeze
R42: official group_02 result recording reconcile
R43: current working snapshot collect drift evidence freeze
R44: active baseline vs current snapshot drift classification
R45: matrix / release handoff / validation projection
R46: next execution / P5-P6 return decision
```

---

## 1. なぜこの作業を行うのか

Cocolonの商品価値は、ユーザーが入力直後に「読まれた」と感じ、また残したくなることにあります。  
EmlisAIはその入口です。

ただし、EmlisAIの本文品質へ戻る前に、P7の測定層で次を混同すると、以後のP5/P6評価が壊れます。

```text
- collect-only
- local subset green
- isolated group PASS
- all split groups green
- un-split full backend suite green
- P7 complete
- release ready
```

今回のP7-HOLD-004整理は、ユーザーに直接表示されるEmlis本文を強くする作業ではありません。  
でも、測定層が嘘をつくと、P5の履歴線やP6の構造気づきの改善を、どの正本に対して評価したのか説明できなくなります。

Cocolonとして在るべき姿は、見えているものを丁寧に扱い、見えていないものを見えたふりしないことです。  
これは、ユーザーの言葉を雑に扱わない姿勢と同じです。

---

## 2. 指示整理

### 2.1 今回の指示

```text
検討メモを基に、実装順を含めた詳細な設計を作成する。
mdで設計書を作る。
必要なら、実装に使うjson / schema案も設計書内に入れる。
ただし、実ファイル化は実装段階で判断する。
```

### 2.2 今回の成果物

```text
Markdown詳細設計書。
```

### 2.3 今回してはいけないこと

```text
- コードを変更しない。
- test fileを追加しない。
- JSON / schema案を実ファイル化しない。
- RN production codeを変更しない。
- RN表示タイトル `Emlisの観測` を変更しない。
- RN表示条件を変更しない。
- API route / request key / public response top-level keyを変更しない。
- DB schema / DB write path / physical nameを変更しない。
- Emlis本文runtimeを変更しない。
- Gateを緩めない。
- fixed commentText / case専用surface / case専用modeを追加しない。
- R40 default NOT_RUN を黙って PASSED_ISOLATED に変えない。
- group_02 PASSをfull backend suite greenへ変換しない。
- current full collect-onlyをexecution greenへ変換しない。
- P7-HOLD-004を閉じない。
- P8 / P9 / P10へ進まない。
- release_allowed / p7_complete / p8_start_allowed / hold004_close_allowedをtrueにしない。
- raw input / comment_text body / candidate body / surface body / terminal output / traceback body / full nodeid listをmaterial化しない。
```

---

## 3. 参照・確認範囲

### 3.1 作業姿勢として確認した前提資料

```text
Cocolon_前提資料(228).zip
  - 00_karen_read_first.md
  - cocolon_thought_material_for_karen.md
  - emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
  - emlis_ai_state_answer_human_follow_definition_2026_05_26.md
  - 07_latest_snapshot_diff.md
  - cocolon_local_file_inventory_diff_20260616_p7_hold004_received_snapshot_baseline_reconcile_r21_r29.csv
  - cocolon_local_file_inventory_diff_20260616_p7_hold004_active_baseline_adoption_runtime_refresh_r30_r40.csv
  - work_attitude_rules_for_karen/00_read_first.txt
  - work_attitude_rules_for_karen/09_work_start_checklist.txt
  - work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
```

作業姿勢として固定したこと:

```text
- 前提資料だけで理解した扱いにしない。実ファイルを確認する。
- 設計と実装を混ぜない。
- RN表示条件、API response key、DB write path、public response top-level keyを変えない。
- EmlisAIを passed + comment_text 到達装置として扱わない。
- EmlisAIは入力直後の観測返答であり、Cocolonの商品体験の入口である。
- pytest green / fixture green / subset green を商品品質合格へ変換しない。
- raw input / comment_text body / candidate body / surface body / terminal output / traceback bodyをP7 materialへ入れない。
```

### 3.2 ロードマップ

```text
Cocolon_EmlisAI_longterm_roadmap_20260608(18).md
```

ロードマップ上、P7は Product Quality Runner / Long-run Product Gate です。  
P7の目的は、商品品質を単発fixture greenではなく継続測定できる形にすることです。  
P8は、Personal Continuity / Derived User Model であり、P7のHOLD境界を曖昧にしたまま進める段階ではありません。

また、ロードマップ上のP5/P6は、Cocolonの商品価値本線です。

```text
P5: User Label Connection v1
  記録の線をEmlis応答へ自然に出す。

P6: Structure Insight v2
  復唱を超えた安全な気づきを出す。
```

今回の整理後にP5/P6へ戻る判断は、ロードマップの価値本線と一致します。

### 3.3 実装済み資料

```text
EmlisAIの実装済み資料(66).zip
  - Cocolon_EmlisAI_P7_ProductQualityRunner_DetailedDesign_ImplementationOrder_20260612.md
  - Cocolon_EmlisAI_P7_RedHoldClosure_DetailedDesign_ImplementationOrder_20260613.md
  - Cocolon_EmlisAI_P7_HOLD004_BackendSuiteSplit_MatrixConsistency_DetailedDesign_ImplementationOrder_20260614.md
  - Cocolon_EmlisAI_P7_HOLD004_CurrentSnapshotBaselineReconcile_DetailedDesign_ImplementationOrder_20260615.md
  - Cocolon_EmlisAI_P7_HOLD004_ReceivedSnapshotBaselineFingerprintReconcile_DetailedDesign_ImplementationOrder_20260615.md
  - Cocolon_EmlisAI_P7_HOLD004_ActiveBaselineAdoptionEvidence_RuntimeBuilderRefresh_DetailedDesign_ImplementationOrder_20260616.md
  - Cocolon_EmlisAI_P5_UserLabelConnection_DetailedDesign_ImplementationOrder_20260611.md
  - Cocolon_EmlisAI_P6_StructureInsight_DetailedDesign_ImplementationOrder_20260611.md
```

### 3.4 主に確認したbackend実ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_active_baseline_adoption_evidence.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_active_baseline_runtime_builder_refresh.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_execution_results.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_group_inventory_plan.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_split_consistency.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_group_execution_minimal_order.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_matrix_consistency_report.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_received_snapshot_baseline_fingerprint_reconcile.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
```

### 3.5 主に確認したtest

```text
mashos-api/ai/tests/test_emlis_ai_p7_active_baseline_runtime_builder_refresh_r40_20260616.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_group_result_20260614.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_execution_summary_20260614.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_*.py
```

---

## 4. 現在地の読み方

### 4.1 R30〜R40の状態

R30〜R40は実装済みとして読めます。  
R40では、次の二つが既に分離されています。

```text
- official group_02 result recording
- full backend suite gate
```

既存R40の重要な性質:

```text
- `build_p7_hold004_official_group02_result_recording()` は、明示的な run_result がなければ NOT_RUN を返す。
- body-free run_result を渡すと、PASSED_ISOLATED / FAILED_ISOLATED / TIMEOUT_ISOLATED / PARTIAL_OR_INTERRUPTED を記録できる。
- PASSED_ISOLATED でも can_claim_full_backend_suite_green は false のまま。
- full_backend_suite_green_confirmed / hold004_close_allowed / p7_complete / p8_start_allowed / release_allowed は false のまま。
```

したがって、今回の実装でR40のdefaultを変える必要はありません。  
むしろ、default NOT_RUN は安全装置として残すべきです。

### 4.2 group_02 local execution結果

検討メモ時点で確認済み:

```text
command scope:
  tests/test_emlis_ai_p7_hold004_*.py

result:
  252 passed / 1 warning
```

読み方:

```text
- group_02_p7_hold004相当は、local executionでPASSしている。
- これはisolated group PASSの証拠になる。
- ただし、full backend suite greenではない。
- release_allowed / p7_complete / p8_start_allowed をtrueにする根拠ではない。
- 実行source identityを確認せずに、active source snapshotのofficial resultとして扱ってはいけない。
```

### 4.3 source identity上の注意

現在のactive baseline実装値:

```text
active_baseline_id:
  p7_hold004_backend_collect_baseline_20260615_received_148

active_source_snapshot_ref:
  mashos-api(148).zip

active collect:
  425 files / 2856 tests / 1 warning
```

今回のlocal workspace:

```text
受領zip:
  mashos-api(152).zip

current local collect-only:
  431 files / 2883 tests / 1 warning
```

このため、次の変換は禁止します。

```text
mashos-api(152).zipで実行したgroup_02 PASS
  -> 何も確認せず mashos-api(148).zip のofficial group_02 PASS として記録
```

設計上の正しい扱いは、二段階です。

```text
R41:
  local execution evidence としてsource付きで固定する。

R42:
  source identity / command scope / count consistency / body-free contract を通った場合だけ、
  existing R40 recordingへ明示的な run_result として接続する。
```

### 4.4 current local full collect drift

検討メモ時点で確認済み:

```text
current local collect-only:
  files: 431
  tests: 2883
  warnings: 1
  items_sha256: 293936849c9fd405af021c1d7e5592055db80ef08eadbb85c5989c0144c359ce
  files_sha256: 432ba6fc3f147e2058d09c37a9d8b448b1fd894f099dc723fa99b50f8890ac08

active baseline:
  files: 425
  tests: 2856
  warnings: 1
  items_sha256: 4698ce5240707f71fc3678a0153a15626ba9718fbadad83294e57d11946c2e0d
  files_sha256: 6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6

delta:
  files: +6
  tests: +27
  warnings: 0
```

読み方:

```text
- current local snapshotは、active baselineと一致しない。
- 差分はR30〜R40追加test由来に見えるが、設計段階では断定しない。
- current collect-onlyはexecution greenではない。
- current collect driftを記録しても、active baseline更新許可にはならない。
```

---

## 5. 設計方針

### 5.1 中心方針

```text
R40 default NOT_RUNは守る。
local PASS evidenceは捨てない。
source identityなしのofficial昇格はしない。
full collect-onlyをexecution greenにしない。
release / P7 complete / P8 startを絶対に開けない。
P7整理後にP5/P6へ戻る道筋をmaterial上に残す。
```

### 5.2 今回の境界

| 項目 | 今回の扱い |
|---|---|
| group_02 local PASS | body-free evidenceとして固定する |
| official group_02 result | source identity / command consistency通過後のみ PASSED_ISOLATED として記録可能 |
| R40 default NOT_RUN | 維持する |
| full backend suite green | false維持 |
| hold004_close_allowed | false維持 |
| p7_complete | false維持 |
| p8_start_allowed | false維持 |
| release_allowed | false維持 |
| current full collect 431/2883 | body-free drift evidenceとして固定する |
| active baseline 425/2856 | historical/current active正本として保持する |
| current snapshot baseline adoption | 今回は判断材料まで。採用実施はしない |
| P5/P6 | 今回は実装しないが、次に戻る判断をR46で明示する |

### 5.3 実装方針の重要判断

#### 推奨: R40 builderは直接書き換えない

R40の `build_p7_hold004_official_group02_result_recording()` は、default NOT_RUNを返すことが安全装置です。

したがって、実装では次を推奨します。

```text
- R40既存builderのdefault挙動は維持する。
- R41/R42用のwrapper builderまたは新moduleを追加する。
- R42 wrapperが、R41のbody-free evidenceを検査したうえで、既存R40 builderへ明示的run_resultを渡す。
```

これにより、以下の事故を防ぎます。

```text
- importしただけでgroup_02が実行済み扱いになる。
- default materialがいつの間にかNOT_RUNでなくなる。
- test fixture上のPASSがofficial実行結果へ混ざる。
```

#### source identityは必須

R41のevidenceには、必ず次を持たせます。

```text
observed_execution_source_ref: mashos-api(152).zip または current_local_workspace
active_source_snapshot_ref: mashos-api(148).zip
source_identity_status: 明示
```

R42で `PASSED_ISOLATED` に進める条件は、少なくとも次です。

```text
- source_identity_status が official recording allowed 系である。
- group_id == group_02_p7_hold004。
- batch_id == group_02_p7_hold004_batch_01。
- run_kind == capture_run。
- status == PASS。
- observed_counts.passed == 252。
- observed_counts.failed == 0。
- observed_counts.errors == 0。
- observed_counts.warnings == 1。
- terminal output / stdout / stderr / traceback / full nodeid listを保持していない。
- R39 readiness が READY_FOR_OFFICIAL_CAPTURE_RUN。
```

---

## 6. 実装対象ファイル案

### 6.1 新規追加候補

#### 第一候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_group02_result_current_snapshot_reconcile.py
```

理由:

```text
- R41〜R46は、R40の後続reconcileであり、既存R40 builderへ直接詰め込むと肥大化する。
- current snapshot collect driftとgroup_02 result recordingを同じ境界で扱える。
- R40 default NOT_RUNを保護したまま、explicit wrapperとして設計できる。
```

含めるbuilder候補:

```text
build_p7_hold004_group02_local_execution_evidence
assert_p7_hold004_group02_local_execution_evidence_contract

build_p7_hold004_group02_official_result_recording_reconcile
assert_p7_hold004_group02_official_result_recording_reconcile_contract

build_p7_hold004_current_working_snapshot_collect_drift_evidence
assert_p7_hold004_current_working_snapshot_collect_drift_evidence_contract

build_p7_hold004_active_baseline_current_snapshot_drift_classification
assert_p7_hold004_active_baseline_current_snapshot_drift_classification_contract

build_p7_hold004_group02_current_snapshot_release_projection
assert_p7_hold004_group02_current_snapshot_release_projection_contract

build_p7_hold004_next_execution_or_p5_p6_return_decision
assert_p7_hold004_next_execution_or_p5_p6_return_decision_contract
```

### 6.2 既存変更候補

#### `emlis_ai_p7_hold004_backend_suite_execution_results.py`

変更候補:

```text
- 既存の build_p7_hold004_backend_suite_group_run_result は原則そのまま使う。
- 必要なら current-source-aware wrapper用に、source_snapshot_refを直接上書きせず、projection側でsource identityを持つ。
- 既存R4/R5 source constantsを書き換えない。
```

注意:

```text
既存builderは `P7_HOLD004_BACKEND_R4_R5_SOURCE_SNAPSHOT_REF = mashos-api(148).zip` に結びついている。
今回のlocal実行が mashos-api(152).zip workspaceであるなら、既存builderだけで公式source一致を主張しない。
```

#### `emlis_ai_p7_hold004_active_baseline_runtime_builder_refresh.py`

変更候補:

```text
- 既存R40 builderのdefault NOT_RUNを維持する。
- R42 wrapperから明示的run_resultが来た場合のPASSED_ISOLATED contractは既存のまま使う。
- full_backend_suite_gateは、group_02がPASSED_ISOLATEDでも BLOCKED_REMAINING_GROUPS を維持する。
```

禁止:

```text
- build_p7_hold004_official_group02_result_recording() のdefaultをPASSにしない。
- R40 contract testのNOT_RUN期待を壊さない。
```

#### `emlis_ai_p7_release_handoff.py`

変更候補:

```text
- R45 projectionを読む場合のみ、group_02 isolated resultのstatusをbody-free flagsとして伝播する。
- release_allowedはfalse固定。
- full_backend_suite_green_confirmedはfalse固定。
- p8_start_allowedはfalse固定。
```

#### `emlis_ai_p7_validation_matrix.py`

変更候補:

```text
- group_02 isolated pass recorded / current snapshot drift classified / P5-P6 return required をvalidation materialへbody-freeに反映する。
- validation green scopeは `group_02_isolated_only_not_full_backend_suite` とする。
```

#### `emlis_ai_p7_hold_matrix.py`

変更候補:

```text
- P7-HOLD-004は未解決のまま。
- P7-HOLD-001 / P7-HOLD-002 / P7-HOLD-003も残件として見えるようにする。
- 今回のR41〜R46完了をP7 completeへ変換しない。
```

### 6.3 test追加候補

```text
mashos-api/ai/tests/test_emlis_ai_p7_hold004_group02_current_snapshot_reconcile_r41_r42_20260617.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_current_snapshot_collect_drift_r43_r44_20260617.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_projection_next_decision_r45_r46_20260617.py
```

既存testの維持確認:

```text
mashos-api/ai/tests/test_emlis_ai_p7_active_baseline_runtime_builder_refresh_r40_20260616.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_group_result_20260614.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_execution_summary_20260614.py
```

---

## 7. 実装順

## R41: Official group_02 Local Execution Result Evidence Freeze

### 目的

`tests/test_emlis_ai_p7_hold004_*.py` のlocal execution結果を、body-free evidenceとして固定します。

固定する観測値:

```text
scope: group_02_p7_hold004
command_ref: pytest_group_02_p7_hold004_local_execution_20260617
result: 252 passed / 1 warning
failed: 0
errors: 0
status: PASS
```

### 重要境界

```text
- R41はlocal evidenceであり、official recordingそのものではない。
- R41単体では can_claim_group_green=false または candidate止まりにする。
- R41単体では R40 official_group_02_capture_green_confirmed=true にしない。
- source identityを明示する。
- terminal output / stdout / stderr / traceback / full nodeid listを保持しない。
```

### builder案

```python
def build_p7_hold004_group02_local_execution_evidence(
    *,
    observed_execution_source_ref: str = "mashos-api(152).zip",
    active_source_snapshot_ref: str = "mashos-api(148).zip",
    passed: int = 252,
    warnings: int = 1,
    failed: int = 0,
    errors: int = 0,
    pytest_exit_code: int = 0,
) -> dict[str, Any]:
    ...
```

### material要件

```text
schema_version:
  cocolon.emlis.p7.hold004.group02_local_execution_evidence.v1

evidence_id:
  p7_hold004_group02_local_execution_evidence_20260617

step:
  P7-HOLD-004_Group02ResultCurrentSnapshotReconcile_R41_LocalExecutionEvidenceFreeze_20260617

required booleans:
  body_free=true
  local_execution_passed=true
  official_result_recording_applied=false
  can_claim_group_green=false
  can_claim_full_backend_suite_green=false
  full_backend_suite_green_confirmed=false
  hold004_close_allowed=false
  p7_complete=false
  p8_start_allowed=false
  release_allowed=false

body-retention booleans:
  terminal_output_retained=false
  stdout_retained=false
  stderr_retained=false
  raw_traceback_included=false
  nodeids_retained=false
  raw_input_retained=false
  comment_text_retained=false
  candidate_body_retained=false
  surface_body_retained=false
```

### source identity status案

初期値候補:

```text
CURRENT_LOCAL_ATTACHMENT_EXECUTION_REQUIRES_OFFICIAL_RECORDING_SOURCE_DECISION
```

R42でofficial recordingに進める場合のstatus候補:

```text
ACCEPTED_AS_OFFICIAL_GROUP02_CAPTURE_AFTER_EXPLICIT_LOCAL_RERUN
```

blocked候補:

```text
BLOCKED_SOURCE_REF_DIFFERS_FROM_ACTIVE_BASELINE
BLOCKED_CURRENT_COLLECT_DRIFT_UNCLASSIFIED
BLOCKED_COMMAND_SCOPE_MISMATCH
BLOCKED_COUNTS_MISMATCH
```

### 成功条件

```text
- group_02 local execution evidenceが 252 passed / 1 warning を保持する。
- materialはbody-free。
- source identityが明示されている。
- official result recordingはまだ適用しない。
- release / P7 / P8 / full suite green はfalse。
```

### 失敗条件

```text
- R41だけでofficial_group_02_capture_green_confirmed=trueにする。
- R41だけでcan_claim_group_green=trueにする。
- terminal outputやtraceback本文を保持する。
- source refを隠してofficial resultのように見せる。
- group_02 passをfull backend suite greenにする。
```

---

## R42: Official group_02 Result Recording Reconcile

### 目的

R41のlocal execution evidenceを、existing R40 result recordingへ安全に接続できるか判定します。

### 方針

R42は、次の二層で作ります。

```text
1. source / command / count / body-free contract decision
2. R40 official result recording wrapper
```

R42で最も避けるべきこと:

```text
R40 default NOT_RUNを消すこと。
```

### builder案

```python
def build_p7_hold004_group02_official_result_recording_reconcile(
    *,
    local_execution_evidence: Mapping[str, Any] | None = None,
    source_identity_status: str = "CURRENT_LOCAL_ATTACHMENT_EXECUTION_REQUIRES_OFFICIAL_RECORDING_SOURCE_DECISION",
    apply_to_r40_official_recording: bool = False,
) -> dict[str, Any]:
    ...
```

### 実装時の接続案

#### Case A: source identity未承認

```text
R41 local evidence:
  local_execution_passed=true

R42 official reconcile:
  official_recording_applied=false
  r40_result_status=NOT_RUN
  group02_local_pass_recorded_as_non_official_evidence=true
  can_claim_group_green=false
  full_backend_suite_green_confirmed=false
  release_allowed=false
```

#### Case B: implementation-stage explicit rerunでsource identity承認

```text
R41 local evidence:
  local_execution_passed=true
  source_identity_status=ACCEPTED_AS_OFFICIAL_GROUP02_CAPTURE_AFTER_EXPLICIT_LOCAL_RERUN

R42 official reconcile:
  official_recording_applied=true
  r40_result_status=PASSED_ISOLATED
  official_group_02_capture_green_confirmed=true
  can_claim_group_green=true
  group02_pass_is_not_full_backend_suite_green=true
  can_claim_full_backend_suite_green=false
  full_backend_suite_green_confirmed=false
  release_allowed=false
```

### 華恋の推奨

実装時は、**Case Bへ進める前に、実装段階でgroup_02 commandを再実行**してください。  
検討メモの観測結果は設計根拠ですが、実装後のコード上で同じ結果が出ることを確認してから、R42 wrapperに明示的run_resultを渡すのが安全です。

### R42で使う既存builder

```text
build_p7_hold004_backend_suite_group_run_result
build_p7_hold004_official_group02_result_recording
build_p7_hold004_full_backend_suite_gate
```

ただし、source identityを隠して既存group_run_resultだけを使うのは避けます。  
必要なら、R42 wrapper側にsource identity projectionを追加します。

### 成功条件

```text
- R40 default NOT_RUN contractが残る。
- R42 explicit wrapper経由でのみ PASSED_ISOLATED を記録できる。
- PASSED_ISOLATED時でも full backend suite gate は BLOCKED_REMAINING_GROUPS。
- remaining_backend_group_count は 12。
- full_backend_suite_green_confirmed=false。
- hold004_close_allowed=false。
- p7_complete=false。
- p8_start_allowed=false。
- release_allowed=false。
```

### 失敗条件

```text
- R40 defaultが常にPASSED_ISOLATEDになる。
- source identity未承認なのにofficial resultとして記録する。
- PASSED_ISOLATEDをfull backend suite greenへ昇格する。
- remaining groupsを空にする。
- release_allowedをtrueにする。
```

---

## R43: Current Working Snapshot Collect Drift Evidence Freeze

### 目的

current local full collect-onlyの結果を、body-free evidenceとして固定します。

固定する観測値:

```text
current local collect-only:
  files: 431
  tests: 2883
  warnings: 1
  items_sha256: 293936849c9fd405af021c1d7e5592055db80ef08eadbb85c5989c0144c359ce
  files_sha256: 432ba6fc3f147e2058d09c37a9d8b448b1fd894f099dc723fa99b50f8890ac08

active baseline:
  id: p7_hold004_backend_collect_baseline_20260615_received_148
  source_snapshot_ref: mashos-api(148).zip
  files: 425
  tests: 2856
  warnings: 1
  items_sha256: 4698ce5240707f71fc3678a0153a15626ba9718fbadad83294e57d11946c2e0d
  files_sha256: 6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6

delta:
  files: +6
  tests: +27
  warnings: 0
```

### builder案

```python
def build_p7_hold004_current_working_snapshot_collect_drift_evidence(
    *,
    current_files: int = 431,
    current_tests: int = 2883,
    current_warnings: int = 1,
    current_items_sha256: str = "293936849c9fd405af021c1d7e5592055db80ef08eadbb85c5989c0144c359ce",
    current_files_sha256: str = "432ba6fc3f147e2058d09c37a9d8b448b1fd894f099dc723fa99b50f8890ac08",
) -> dict[str, Any]:
    ...
```

### material要件

```text
schema_version:
  cocolon.emlis.p7.hold004.current_working_snapshot_collect_drift_evidence.v1

evidence_id:
  p7_hold004_current_working_snapshot_collect_drift_evidence_20260617

step:
  P7-HOLD-004_Group02ResultCurrentSnapshotReconcile_R43_CurrentWorkingSnapshotCollectDriftEvidence_20260617

required booleans:
  current_collect_only_recorded=true
  active_baseline_differs_from_current_collect=true
  collect_only_is_not_execution_green=true
  current_collect_is_not_full_backend_suite_green=true
  active_baseline_update_applied=false
  can_claim_full_backend_suite_green=false
  full_backend_suite_green_confirmed=false
  hold004_close_allowed=false
  p7_complete=false
  p8_start_allowed=false
  release_allowed=false
```

### 成功条件

```text
- current local collect-only 431/2883/1が記録される。
- active baseline 425/2856/1との差分が明示される。
- hashesがbody-free evidenceとして保持される。
- collect-only is not execution green がtrue。
- active baseline updateは適用しない。
```

### 失敗条件

```text
- 431/2883をfull backend suite greenとして扱う。
- active baselineを黙って431/2883へ上書きする。
- R30〜R40 historical evidenceを431/2883へ書き換える。
- collect-only hashをexecution result hashのように扱う。
```

---

## R44: Active Baseline vs Current Snapshot Drift Classification

### 目的

active baseline 425/2856 と current local collect 431/2883 の差分を分類します。  
ただし、分類は release / full suite / active baseline adoption の許可ではありません。

### default分類

```text
UNCLASSIFIED_CURRENT_WORKING_SNAPSHOT_COLLECT_DRIFT
```

### positive分類候補

実装段階でファイル差分を確認し、次が揃う場合のみ positive分類にできます。

```text
R30_R40_CONTRACT_TEST_ADDITION_DRIFT_ACCEPTED_AS_CURRENT_WORKING_SNAPSHOT_ONLY
```

必要条件:

```text
- 追加test file数が +6 と一致する。
- 追加test item数が +27 と一致する。
- 追加file refsがR30〜R40 contract testsに限定される。
- production runtime source変更によるcollect増加ではないことが確認される。
- active baselineを更新しない。
- full collect-onlyをexecution greenにしない。
```

候補となる追加test file refs:

```text
mashos-api/ai/tests/test_emlis_ai_p7_active_baseline_adoption_evidence_r30_r31_20260616.py
mashos-api/ai/tests/test_emlis_ai_p7_active_baseline_adoption_evidence_r32_r33_20260616.py
mashos-api/ai/tests/test_emlis_ai_p7_active_baseline_adoption_evidence_r34_r35_20260616.py
mashos-api/ai/tests/test_emlis_ai_p7_active_baseline_runtime_builder_refresh_r36_r37_20260616.py
mashos-api/ai/tests/test_emlis_ai_p7_active_baseline_runtime_builder_refresh_r38_r39_20260616.py
mashos-api/ai/tests/test_emlis_ai_p7_active_baseline_runtime_builder_refresh_r40_20260616.py
```

### builder案

```python
def build_p7_hold004_active_baseline_current_snapshot_drift_classification(
    *,
    collect_drift_evidence: Mapping[str, Any] | None = None,
    added_test_file_refs: Iterable[str] | None = None,
    added_test_item_count: int | None = None,
    classification_status: str = "UNCLASSIFIED_CURRENT_WORKING_SNAPSHOT_COLLECT_DRIFT",
) -> dict[str, Any]:
    ...
```

### 成功条件

```text
- drift分類が明示される。
- 未確認なら未確認のまま残る。
- positive分類でも active_baseline_update_allowed=false。
- release_allowed=false。
- group_03以降へ進む条件が分離される。
```

### 失敗条件

```text
- R30〜R40追加test由来と確認前に断定する。
- drift分類をactive baseline adoptionに直結する。
- current snapshot 431/2883を次active baselineへ自動採用する。
```

---

## R45: Matrix / Release Handoff / Validation Projection

### 目的

R41〜R44の結果を、P7 matrix / release handoff / validationへbody-freeに投影します。  
ただし、release判断は絶対に開けません。

### projectionに含めるfield案

```text
p7_hold004_group02_local_execution_evidence_id
p7_hold004_group02_official_recording_reconcile_id
p7_hold004_group02_result_recording_status
p7_hold004_group02_result_scope
p7_hold004_group02_pass_is_isolated
p7_hold004_group02_pass_is_not_full_backend_suite_green
p7_hold004_current_working_snapshot_collect_drift_evidence_id
p7_hold004_current_working_snapshot_collect_drift_status
p7_hold004_active_baseline_current_snapshot_drift_classification_status
p7_hold004_current_snapshot_baseline_adoption_allowed
p7_hold004_next_p5_p6_return_recommended
```

### release / P7 / P8固定field

```text
full_backend_suite_green_confirmed=false
full_backend_suite_green_claim_allowed=false
can_claim_full_backend_suite_green=false
hold004_close_allowed=false
p7_complete=false
p7_complete_claim_allowed=false
p8_start_allowed=false
release_allowed=false
```

### builder案

```python
def build_p7_hold004_group02_current_snapshot_release_projection(
    *,
    group02_reconcile: Mapping[str, Any] | None = None,
    drift_classification: Mapping[str, Any] | None = None,
) -> dict[str, Any]:
    ...
```

### 成功条件

```text
- group_02 passのscopeが isolated only として投影される。
- current collect driftがrelease blocker / followupとして投影される。
- release_allowed=false。
- P7 complete=false。
- P8 start=false。
- P5/P6 return requiredが見える。
```

### 失敗条件

```text
- group_02 isolated passをrelease passに見せる。
- current collect driftを無視してremaining groupsへ進む。
- P5/P6の人間読感未確認を隠す。
```

---

## R46: Next Execution / P5-P6 Return Decision

### 目的

R41〜R45の整理後に、次へ進む判断をmaterial化します。

このR46は、P7を閉じるものではありません。  
また、group_03以降のbackend group executionへ自動で進むものでもありません。

### 華恋の判断

今回のR41〜R45がgreenになった場合、次はP5/P6へ戻るべきです。

理由:

```text
- P5/P6 material boundaryは自動test上greenだが、人間読感は不足している。
- Cocolonの商品価値は、履歴線と構造気づきが「読まれた感」に接続するかで決まる。
- P7検証整理を続けるだけでは、Cocolonが前に進んだ気になりやすい。
- group_03以降のfull backend suite実行は必要だが、今すぐP5/P6読感より優先し続けると本線から離れる。
```

### decision status案

```text
P5_P6_HUMAN_READFEEL_AND_REAL_DEVICE_MODAL_REVIEW_RECOMMENDED_AFTER_R41_R45
```

blocked候補:

```text
BLOCKED_R41_GROUP02_EVIDENCE_NOT_BODY_FREE
BLOCKED_R42_OFFICIAL_RECORDING_RECONCILE_FAILED
BLOCKED_R43_CURRENT_COLLECT_DRIFT_NOT_FROZEN
BLOCKED_R44_DRIFT_CLASSIFICATION_MISSING
BLOCKED_R45_RELEASE_PROJECTION_CONTRACT_FAILED
```

### builder案

```python
def build_p7_hold004_next_execution_or_p5_p6_return_decision(
    *,
    release_projection: Mapping[str, Any] | None = None,
    prefer_p5_p6_return: bool = True,
) -> dict[str, Any]:
    ...
```

### material要件

```text
next_recommended_work:
  P5_P6_HUMAN_READFEEL_AND_REAL_DEVICE_MODAL_REVIEW

backend_group03_execution_allowed_now:
  false

backend_group03_execution_block_reason:
  P5_P6_RETURN_PRIORITIZED_AFTER_GROUP02_RESULT_AND_CURRENT_DRIFT_RECONCILE

p7_hold004_closed:
  false

p7_hold004_remaining:
  true
```

### 成功条件

```text
- 次にP5/P6へ戻る判断が明示される。
- P7-HOLD-004は未解決のまま残る。
- group_03以降の実行を永久禁止しないが、今回直後の自動連鎖は止める。
- P5 human Blind QA / P6 limited visible expansion / 実機modal読感が次作業として見える。
```

### 失敗条件

```text
- R46でP7完了とする。
- R46でP8開始可能とする。
- P5/P6未確認を完了扱いにする。
- group_03以降を永久に不要扱いする。
```

---

## 8. JSON / schema案

本章のJSON / schema案は、実ファイル化しません。  
実装段階で、既存material builder / contract test / schema配置と照合して採否判断します。

### 8.1 Group02 Local Execution Evidence schema案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.group02_local_execution_evidence.v1",
  "phase": "P7_ProductQualityRunner_LongRunGate",
  "hold_id": "P7-HOLD-004",
  "step": "P7-HOLD-004_Group02ResultCurrentSnapshotReconcile_R41_LocalExecutionEvidenceFreeze_20260617",
  "evidence_id": "p7_hold004_group02_local_execution_evidence_20260617",
  "source_mode": "local_snapshot",
  "git_checked": false,
  "observed_execution_source_ref": "mashos-api(152).zip",
  "active_source_snapshot_ref": "mashos-api(148).zip",
  "active_baseline_id": "p7_hold004_backend_collect_baseline_20260615_received_148",
  "group_id": "group_02_p7_hold004",
  "batch_id": "group_02_p7_hold004_batch_01",
  "command_id": "pytest_group_02_p7_hold004_local_execution_20260617",
  "command_scope_id": "tests_test_emlis_ai_p7_hold004_glob",
  "run_kind": "capture_run",
  "status": "PASS",
  "pytest_exit_code": 0,
  "observed_counts": {
    "passed": 252,
    "failed": 0,
    "skipped": 0,
    "warnings": 1,
    "errors": 0,
    "deselected": 0
  },
  "source_identity_status": "CURRENT_LOCAL_ATTACHMENT_EXECUTION_REQUIRES_OFFICIAL_RECORDING_SOURCE_DECISION",
  "local_execution_passed": true,
  "official_result_recording_applied": false,
  "can_claim_group_green": false,
  "can_claim_full_backend_suite_green": false,
  "full_backend_suite_green_confirmed": false,
  "hold004_close_allowed": false,
  "p7_complete": false,
  "p8_start_allowed": false,
  "release_allowed": false,
  "terminal_output_retained": false,
  "stdout_retained": false,
  "stderr_retained": false,
  "raw_traceback_included": false,
  "nodeids_retained": false,
  "raw_input_retained": false,
  "comment_text_retained": false,
  "candidate_body_retained": false,
  "surface_body_retained": false,
  "body_free": true
}
```

### 8.2 Official Group02 Result Recording Reconcile schema案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.group02_official_result_recording_reconcile.v1",
  "phase": "P7_ProductQualityRunner_LongRunGate",
  "hold_id": "P7-HOLD-004",
  "step": "P7-HOLD-004_Group02ResultCurrentSnapshotReconcile_R42_OfficialResultRecordingReconcile_20260617",
  "reconcile_id": "p7_hold004_group02_official_result_recording_reconcile_20260617",
  "input_evidence_id": "p7_hold004_group02_local_execution_evidence_20260617",
  "r40_recording_id": "p7_hold004_official_group02_result_recording_20260616",
  "r40_full_backend_suite_gate_id": "p7_hold004_full_backend_suite_gate_20260616",
  "source_identity_status": "ACCEPTED_AS_OFFICIAL_GROUP02_CAPTURE_AFTER_EXPLICIT_LOCAL_RERUN",
  "official_recording_applied": true,
  "official_group_02_result_recording_status": "PASSED_ISOLATED",
  "official_group_02_capture_green_confirmed": true,
  "can_claim_group_green": true,
  "group_green_scope": "group_02_isolated_only",
  "group02_pass_is_not_full_backend_suite_green": true,
  "remaining_backend_group_count": 12,
  "can_claim_full_backend_suite_green": false,
  "full_backend_suite_green_confirmed": false,
  "full_backend_suite_gate_status": "BLOCKED_FULL_BACKEND_SUITE_REMAINING_GROUPS_NOT_OFFICIAL_GREEN",
  "hold004_close_allowed": false,
  "p7_complete": false,
  "p8_start_allowed": false,
  "release_allowed": false,
  "required_followup_fixes": [
    "remaining_backend_groups_official_execution_required",
    "full_backend_suite_green_unconfirmed",
    "current_snapshot_collect_drift_classification_required",
    "p5_human_qa_review_required",
    "p6_human_readfeel_review_required",
    "real_device_submit_modal_readfeel_unverified"
  ],
  "body_free": true
}
```

source identity未承認時の例:

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.group02_official_result_recording_reconcile.v1",
  "source_identity_status": "BLOCKED_SOURCE_REF_DIFFERS_FROM_ACTIVE_BASELINE",
  "official_recording_applied": false,
  "official_group_02_result_recording_status": "NOT_RUN",
  "group02_local_pass_recorded_as_non_official_evidence": true,
  "official_group_02_capture_green_confirmed": false,
  "can_claim_group_green": false,
  "can_claim_full_backend_suite_green": false,
  "full_backend_suite_green_confirmed": false,
  "release_allowed": false,
  "body_free": true
}
```

### 8.3 Current Working Snapshot Collect Drift Evidence schema案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.current_working_snapshot_collect_drift_evidence.v1",
  "phase": "P7_ProductQualityRunner_LongRunGate",
  "hold_id": "P7-HOLD-004",
  "step": "P7-HOLD-004_Group02ResultCurrentSnapshotReconcile_R43_CurrentWorkingSnapshotCollectDriftEvidence_20260617",
  "evidence_id": "p7_hold004_current_working_snapshot_collect_drift_evidence_20260617",
  "source_mode": "local_snapshot",
  "git_checked": false,
  "current_working_snapshot_ref": "mashos-api(152).zip",
  "active_source_snapshot_ref": "mashos-api(148).zip",
  "active_baseline_id": "p7_hold004_backend_collect_baseline_20260615_received_148",
  "current_collect_only": {
    "files": 431,
    "tests": 2883,
    "warnings": 1,
    "items_sha256": "293936849c9fd405af021c1d7e5592055db80ef08eadbb85c5989c0144c359ce",
    "files_sha256": "432ba6fc3f147e2058d09c37a9d8b448b1fd894f099dc723fa99b50f8890ac08"
  },
  "active_baseline_collect": {
    "files": 425,
    "tests": 2856,
    "warnings": 1,
    "items_sha256": "4698ce5240707f71fc3678a0153a15626ba9718fbadad83294e57d11946c2e0d",
    "files_sha256": "6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6"
  },
  "delta": {
    "files": 6,
    "tests": 27,
    "warnings": 0
  },
  "active_baseline_differs_from_current_collect": true,
  "collect_only_is_not_execution_green": true,
  "current_collect_is_not_full_backend_suite_green": true,
  "active_baseline_update_applied": false,
  "can_claim_full_backend_suite_green": false,
  "full_backend_suite_green_confirmed": false,
  "hold004_close_allowed": false,
  "p7_complete": false,
  "p8_start_allowed": false,
  "release_allowed": false,
  "body_free": true
}
```

### 8.4 Drift Classification schema案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.active_baseline_current_snapshot_drift_classification.v1",
  "phase": "P7_ProductQualityRunner_LongRunGate",
  "hold_id": "P7-HOLD-004",
  "step": "P7-HOLD-004_Group02ResultCurrentSnapshotReconcile_R44_DriftClassification_20260617",
  "classification_id": "p7_hold004_active_baseline_current_snapshot_drift_classification_20260617",
  "input_evidence_id": "p7_hold004_current_working_snapshot_collect_drift_evidence_20260617",
  "classification_status": "R30_R40_CONTRACT_TEST_ADDITION_DRIFT_ACCEPTED_AS_CURRENT_WORKING_SNAPSHOT_ONLY",
  "default_status_if_unverified": "UNCLASSIFIED_CURRENT_WORKING_SNAPSHOT_COLLECT_DRIFT",
  "added_test_file_count": 6,
  "added_test_item_count": 27,
  "added_test_file_refs": [
    "tests/test_emlis_ai_p7_active_baseline_adoption_evidence_r30_r31_20260616.py",
    "tests/test_emlis_ai_p7_active_baseline_adoption_evidence_r32_r33_20260616.py",
    "tests/test_emlis_ai_p7_active_baseline_adoption_evidence_r34_r35_20260616.py",
    "tests/test_emlis_ai_p7_active_baseline_runtime_builder_refresh_r36_r37_20260616.py",
    "tests/test_emlis_ai_p7_active_baseline_runtime_builder_refresh_r38_r39_20260616.py",
    "tests/test_emlis_ai_p7_active_baseline_runtime_builder_refresh_r40_20260616.py"
  ],
  "semantic_no_change_claimed": false,
  "active_baseline_update_allowed": false,
  "active_baseline_update_applied": false,
  "full_backend_suite_green_confirmed": false,
  "release_allowed": false,
  "body_free": true
}
```

### 8.5 Release Projection schema案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.group02_current_snapshot_release_projection.v1",
  "phase": "P7_ProductQualityRunner_LongRunGate",
  "hold_id": "P7-HOLD-004",
  "step": "P7-HOLD-004_Group02ResultCurrentSnapshotReconcile_R45_ReleaseProjection_20260617",
  "projection_id": "p7_hold004_group02_current_snapshot_release_projection_20260617",
  "group02_result_recording_status": "PASSED_ISOLATED",
  "group02_result_scope": "group_02_isolated_only",
  "group02_pass_is_not_full_backend_suite_green": true,
  "current_snapshot_collect_drift_status": "R30_R40_CONTRACT_TEST_ADDITION_DRIFT_ACCEPTED_AS_CURRENT_WORKING_SNAPSHOT_ONLY",
  "current_snapshot_baseline_adoption_allowed": false,
  "full_backend_suite_green_confirmed": false,
  "full_backend_suite_green_claim_allowed": false,
  "can_claim_full_backend_suite_green": false,
  "hold004_close_allowed": false,
  "p7_complete": false,
  "p8_start_allowed": false,
  "release_allowed": false,
  "p5_human_qa_review_required": true,
  "p6_human_readfeel_review_required": true,
  "real_device_submit_modal_readfeel_unverified": true,
  "body_free": true
}
```

### 8.6 Next Execution / P5-P6 Return Decision schema案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.next_execution_or_p5_p6_return_decision.v1",
  "phase": "P7_ProductQualityRunner_LongRunGate",
  "hold_id": "P7-HOLD-004",
  "step": "P7-HOLD-004_Group02ResultCurrentSnapshotReconcile_R46_NextDecision_20260617",
  "decision_id": "p7_hold004_next_execution_or_p5_p6_return_decision_20260617",
  "decision_status": "P5_P6_HUMAN_READFEEL_AND_REAL_DEVICE_MODAL_REVIEW_RECOMMENDED_AFTER_R41_R45",
  "next_recommended_work": "P5_P6_HUMAN_READFEEL_AND_REAL_DEVICE_MODAL_REVIEW",
  "backend_group03_execution_allowed_now": false,
  "backend_group03_execution_block_reason": "P5_P6_RETURN_PRIORITIZED_AFTER_GROUP02_RESULT_AND_CURRENT_DRIFT_RECONCILE",
  "p7_hold004_closed": false,
  "p7_hold004_remaining": true,
  "p8_start_allowed": false,
  "release_allowed": false,
  "body_free": true
}
```

---

## 9. Contract test設計

### 9.1 R41/R42 test観点

新規test候補:

```text
mashos-api/ai/tests/test_emlis_ai_p7_hold004_group02_current_snapshot_reconcile_r41_r42_20260617.py
```

必須test:

```text
test_r41_group02_local_execution_evidence_freezes_252_passed_one_warning_body_free

test_r41_local_execution_evidence_does_not_claim_official_group_green_or_release

test_r41_contract_rejects_terminal_output_traceback_nodeids_or_comment_body

test_r42_default_source_unaccepted_keeps_r40_not_run_and_local_pass_non_official

test_r42_explicit_source_accepted_records_passed_isolated_without_full_suite_promotion

test_r42_passed_isolated_full_backend_suite_gate_remains_blocked_remaining_groups

test_r42_contract_rejects_release_p7_p8_hold004_promotion

test_existing_r40_default_not_run_still_passes
```

### 9.2 R43/R44 test観点

新規test候補:

```text
mashos-api/ai/tests/test_emlis_ai_p7_hold004_current_snapshot_collect_drift_r43_r44_20260617.py
```

必須test:

```text
test_r43_current_snapshot_collect_drift_freezes_431_2883_hashes_body_free

test_r43_collect_only_is_not_execution_green_and_not_active_baseline_update

test_r43_contract_rejects_full_suite_green_or_release_claim

test_r44_default_drift_classification_is_unclassified_until_file_diff_verified

test_r44_r30_r40_test_addition_classification_requires_exact_six_file_refs_and_27_items

test_r44_positive_classification_still_does_not_allow_active_baseline_update_or_release

test_r44_contract_rejects_semantic_no_change_claim_without_review
```

### 9.3 R45/R46 test観点

新規test候補:

```text
mashos-api/ai/tests/test_emlis_ai_p7_hold004_projection_next_decision_r45_r46_20260617.py
```

必須test:

```text
test_r45_projection_records_group02_isolated_pass_and_current_drift_without_release

test_r45_projection_keeps_full_backend_suite_green_false

test_r45_projection_preserves_p5_p6_and_real_device_followups

test_r46_next_decision_recommends_p5_p6_human_readfeel_after_r41_r45

test_r46_next_decision_does_not_close_p7_hold004_or_start_p8

test_r46_contract_rejects_backend_group03_auto_continue_as_completion
```

### 9.4 regression test観点

既存testの維持:

```text
- R40 default NOT_RUN testは残す。
- R40 passed isolated testは、explicit run_result時だけ通す。
- group result body-free testsを壊さない。
- execution summaryがsplit greenをfull backend suite greenにしないcontractを壊さない。
```

---

## 10. 実装時の検証コマンド案

### 10.1 py_compile

```bash
cd /mnt/data/cocolon_work_20260617/api/mashos-api/ai
PYTHONPATH=services/ai_inference python -m py_compile \
  services/ai_inference/emlis_ai_p7_hold004_group02_result_current_snapshot_reconcile.py \
  services/ai_inference/emlis_ai_p7_hold004_active_baseline_runtime_builder_refresh.py \
  services/ai_inference/emlis_ai_p7_hold004_backend_suite_execution_results.py \
  services/ai_inference/emlis_ai_p7_release_handoff.py \
  services/ai_inference/emlis_ai_p7_validation_matrix.py \
  services/ai_inference/emlis_ai_p7_hold_matrix.py
```

### 10.2 R41〜R46 target test

```bash
cd /mnt/data/cocolon_work_20260617/api/mashos-api/ai
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference pytest -q -p pytest_asyncio.plugin \
  tests/test_emlis_ai_p7_hold004_group02_current_snapshot_reconcile_r41_r42_20260617.py \
  tests/test_emlis_ai_p7_hold004_current_snapshot_collect_drift_r43_r44_20260617.py \
  tests/test_emlis_ai_p7_hold004_projection_next_decision_r45_r46_20260617.py
```

### 10.3 既存R40 regression

```bash
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference pytest -q -p pytest_asyncio.plugin \
  tests/test_emlis_ai_p7_active_baseline_runtime_builder_refresh_r40_20260616.py
```

### 10.4 group_02 local execution再確認

R42でofficial recordingへ進める場合、実装段階で必ず再実行します。

```bash
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference pytest -q -p pytest_asyncio.plugin \
  tests/test_emlis_ai_p7_hold004_*.py
```

期待値:

```text
252 passed / 1 warning
```

ただし、期待値が変わった場合は、R41の既定値を無理に更新せず、次のどちらかを選びます。

```text
- 実行結果の変化理由を分類する。
- official result recordingを見送り、local evidenceをnon-officialとして残す。
```

### 10.5 current collect-only再確認

```bash
PYTHONPATH=services/ai_inference pytest --collect-only -q
```

期待値:

```text
431 files / 2883 tests / 1 warning
items_sha256: 293936849c9fd405af021c1d7e5592055db80ef08eadbb85c5989c0144c359ce
files_sha256: 432ba6fc3f147e2058d09c37a9d8b448b1fd894f099dc723fa99b50f8890ac08
```

変わった場合:

```text
- R43 evidenceをそのまま書き換えない。
- current working snapshot driftが再発したとして扱う。
- active baseline adoptionやfull suite greenへは進めない。
```

### 10.6 P7 surrounding subset

```bash
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference pytest -q -p pytest_asyncio.plugin \
  tests/test_emlis_ai_p7_active_baseline_adoption_evidence_r30_r31_20260616.py \
  tests/test_emlis_ai_p7_active_baseline_adoption_evidence_r32_r33_20260616.py \
  tests/test_emlis_ai_p7_active_baseline_adoption_evidence_r34_r35_20260616.py \
  tests/test_emlis_ai_p7_active_baseline_runtime_builder_refresh_r36_r37_20260616.py \
  tests/test_emlis_ai_p7_active_baseline_runtime_builder_refresh_r38_r39_20260616.py \
  tests/test_emlis_ai_p7_active_baseline_runtime_builder_refresh_r40_20260616.py \
  tests/test_emlis_ai_p7_release_handoff_20260612.py \
  tests/test_emlis_ai_p7_validation_matrix_20260612.py
```

### 10.7 P5/P6 return boundary subset

次の作業へ戻る前の境界確認として実行します。

```bash
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference pytest -q -p pytest_asyncio.plugin \
  tests/test_emlis_ai_user_label_connection_p5_product_quality_review_20260611.py \
  tests/test_emlis_ai_structure_insight_p6_product_quality_review_20260611.py \
  tests/test_emlis_ai_p7_r8_human_qa_material_boundary_20260613.py \
  tests/test_emlis_ai_p7_r9_p6_visible_expansion_boundary_20260613.py
```

期待値:

```text
22 passed
```

ただし、これはP5/P6人間読感完了ではありません。  
次作業で見るべきなのは、実際のEmlis表示文が「読まれた」と感じるか、履歴線と構造気づきが自然か、modal上で重すぎないかです。

### 10.8 RN contract

RN変更はしないため、原則regression確認です。

```bash
cd /mnt/data/cocolon_work_20260617/rn/Cocolon
npm run test:rn-screens --silent
```

期待値:

```text
36 passed
```

---

## 11. 実装後に作成する可能性がある実装結果doc

実装後に結果docを作る場合の候補名:

```text
Cocolon_EmlisAI_P7_HOLD004_Group02Result_CurrentSnapshotReconcile_ImplementationResult_20260617.md
```

含めるべき内容:

```text
- 実装したR41〜R46の一覧
- 追加/変更したファイル一覧
- py_compile結果
- R41〜R46 target test結果
- 既存R40 regression結果
- group_02再実行結果
- current collect-only再確認結果
- release_allowed / p7_complete / p8_start_allowed false確認
- P5/P6へ戻る判断
- 未確認として残したもの
```

---

## 12. リスクと対策

### 12.1 リスク: current local PASSをofficial source結果として誤記録する

危険:

```text
mashos-api(152).zipのlocal workspaceで得たPASSを、mashos-api(148).zipのofficial capture結果として扱ってしまう。
```

対策:

```text
- R41にobserved_execution_source_refを必須化する。
- R42にsource_identity_statusを必須化する。
- source未承認ならofficial_recording_applied=false。
- R42でPASSED_ISOLATEDへ進めるなら、実装段階で明示的rerunを行う。
```

### 12.2 リスク: R40 default NOT_RUNを壊す

危険:

```text
既存R40 builderのdefaultがNOT_RUNでなくなり、import時点でgroup_02が実行済み扱いになる。
```

対策:

```text
- R40 default testを維持する。
- R42はwrapperで作る。
- explicit run_resultなしではPASSED_ISOLATEDにしない。
```

### 12.3 リスク: group_02 PASSをfull backend suite greenにする

危険:

```text
252 passedをfull suite green、P7 complete、release allowedへ変換する。
```

対策:

```text
- can_claim_full_backend_suite_green=falseをcontract test化する。
- remaining_backend_group_count=12をassertする。
- full_backend_suite_gate_status=BLOCKED_REMAINING_GROUPSをassertする。
```

### 12.4 リスク: current collect-onlyをexecution greenへ変換する

危険:

```text
431/2883 collect-onlyをfull backend suite execution greenとして扱う。
```

対策:

```text
- collect_only_is_not_execution_green=trueを必須化する。
- current_collect_is_not_full_backend_suite_green=trueを必須化する。
- full_backend_suite_green_confirmed=falseを必須化する。
```

### 12.5 リスク: active baselineを黙って431/2883へ更新する

危険:

```text
current drift evidenceを理由に、active baselineを自動更新する。
```

対策:

```text
- R43/R44では active_baseline_update_allowed=false。
- R44 positive classificationでも adoptionはしない。
- baseline adoptionが必要なら、別設計で扱う。
```

### 12.6 リスク: P7整理を続けすぎてP5/P6に戻れない

危険:

```text
P7の測定整理だけでCocolonを前に進めた気になる。
```

対策:

```text
- R46にP5/P6 return decisionを入れる。
- 次作業候補をP5/P6 human readfeel / real device modal reviewとして明示する。
- group_03以降の自動連鎖を止める。
```

---

## 13. 完了条件

### R41完了条件

```text
- group_02 local execution evidenceがbody-freeで固定される。
- 252 passed / 1 warningが記録される。
- source identityが明示される。
- official recordingは未適用。
- release / P7 / P8 / full suite greenはfalse。
```

### R42完了条件

```text
- R40 default NOT_RUNが維持される。
- explicit source-accepted run_result時のみPASSED_ISOLATEDを記録できる。
- PASSED_ISOLATEDでもfull backend suite gateはblocked。
- remaining backend groupsが残る。
- release / P7 / P8 / HOLD closureはfalse。
```

### R43完了条件

```text
- current collect 431/2883/1/hashがbody-free evidenceとして固定される。
- active baseline 425/2856/1/hashとの差分が明示される。
- collect-only is not execution greenが守られる。
```

### R44完了条件

```text
- drift分類が明示される。
- 未確認なら未確認として残る。
- positive分類でもactive baseline updateはしない。
```

### R45完了条件

```text
- group_02 isolated resultとcurrent driftがmatrix/release/validationへbody-free projectionされる。
- release_allowed=false。
- p7_complete=false。
- p8_start_allowed=false。
```

### R46完了条件

```text
- 次にP5/P6 human readfeel / real device modal reviewへ戻る判断がmaterial化される。
- P7-HOLD-004は未解決のまま残る。
- group_03以降の実行を永久禁止せず、今回直後の自動連鎖だけ止める。
```

---

## 14. 実装後も未完として残すもの

```text
- all backend groups official execution
- full backend suite execution green
- first red / first timeout の実観測
- P7-HOLD-004 closure
- P7 complete
- P8 start
- release readiness
- P5 human Blind QA
- P6 limited visible expansion の人間読感
- 実機submit / modal読感
- 外部ユーザーpilot
```

---

## 15. 次に戻るP5/P6作業の入口メモ

今回のR41〜R46が終わったら、次はP5/P6へ戻ります。

次設計候補名:

```text
Cocolon_EmlisAI_P5_P6_HumanReadfeel_RealDeviceModalReview_PreDesignMemo_20260617.md
```

見るべきこと:

```text
P5:
  - 履歴線が「汎用説明」ではなく「自分の記録が返った感」になっているか。
  - creepy / overclaim / self-blameが出ていないか。
  - Free / Plus / Premium境界が自然か。
  - evidence_record_count >= 2の意味がsurfaceに自然に乗っているか。

P6:
  - 構造気づきが復唱を超えているか。
  - structure_question / long_meaning_arc / self_understanding_followに限定されているか。
  - daily / low-info / positive-onlyへ深いinsightを出していないか。
  - 診断 / 原因断定 / 人格分類 / future predictionになっていないか。

実機modal:
  - 長すぎないか。
  - 重すぎないか。
  - 読み始めた瞬間に閉じたくならないか。
  - `Emlisの観測` として自然か。
  - もう一度Cocolonに残したくなるか。
```

華恋の意見として、次のP5/P6では自動test greenよりも、**実際にMashが読んだときに「これ、Cocolonだ」と思えるか**を強く見たいです。  
P7は土台です。P5/P6はCocolonの体験そのものに近いです。

---

## 16. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- Cocolon_前提資料(228).zip を確認した。
- Cocolon作業姿勢ルール work_attitude_rules_for_karen を確認した。
- Cocolon思想資料で、EmlisAIは入力直後の観測返答であることを確認した。
- ロードマップ上、P7はProduct Quality Runner / Long-run Product Gateであることを確認した。
- ロードマップ上、P5/P6はCocolonの商品価値本線であることを確認した。
- R40 existing builderは explicit run_result がある場合だけPASSED_ISOLATEDへ進める形で読める。
- R40 defaultはNOT_RUNとして読める。
- group_02 local executionは252 passed / 1 warning。
- current local full collect-onlyは431 files / 2883 tests / 1 warning。
- active baselineは425 files / 2856 tests / 1 warning。
- full backend suite execution greenは未確認。
```

### 未確認

```text
- implementation-stage rerun後のgroup_02結果。
- source identityをofficial recordingに採用してよいか。
- R42でPASSED_ISOLATEDへ進めるか、local evidence止まりにするか。
- current snapshot collect driftの実ファイルdiff分類。
- current snapshot 431/2883を次active baselineへ採用すべきか。
- group_03以降のofficial execution。
- full backend suite execution green。
- P5 human Blind QA。
- P6 limited visible expansion の人間読感。
- 実機submit / modal読感。
```

### 書かれていない

```text
- group_02 252 passedだけでP7-HOLD-004を閉じてよい、とは書かれていない。
- current collect-only 431/2883だけでfull backend suite greenとしてよい、とは書かれていない。
- R40 default NOT_RUNを削除してよい、とは書かれていない。
- source identity未確認でofficial group_02 PASSとしてよい、とは書かれていない。
- P5/P6 material boundary greenだけで人間読感QA完了としてよい、とは書かれていない。
- RN contract greenだけでEmlis商品読感が合格したとは書かれていない。
```

### 推測禁止

```text
- mashos-api(152).zipのlocal passを、確認なしにmashos-api(148).zip official passへ変換しない。
- group_02 PASSをfull backend suite greenへ変換しない。
- collect-onlyをexecution greenへ変換しない。
- current collect driftを、確認前にR30〜R40追加test由来と断定しない。
- active baselineを黙って更新しない。
- release_allowed / p7_complete / p8_start_allowedをtrueにしない。
- P5/P6の人間読感未確認を、自動test greenで隠さない。
```

### 次に実行すべきこと

```text
1. R41〜R46を実装する。
2. R41〜R46 target testsを追加する。
3. 既存R40 default NOT_RUN regressionを維持する。
4. group_02 commandをimplementation-stageで再実行する。
5. current full collect-onlyを再確認する。
6. release / P7 / P8 / full suite green falseを確認する。
7. 実装結果docを作る。
8. 次作業としてP5/P6 human readfeel / real device modal reviewへ戻る。
```

---

## 17. 最終判断

```text
今回進める段階:
  P7 Product Quality Runner / Long-run Product Gate

今回の具体対象:
  P7-HOLD-004 Group02 Result / Current Snapshot Reconcile

実装順:
  R41 -> R42 -> R43 -> R44 -> R45 -> R46

今回閉じないもの:
  P7-HOLD-004
  P7 complete
  P8 start
  release readiness

今回守るもの:
  body-free result material
  R40 default NOT_RUN
  source identity boundary
  collect-only / execution green separation
  group_02 isolated PASS / full backend suite green separation
  P5/P6へ戻る道筋
```

華恋の意見として、この設計はP7を長引かせるためのものではありません。  
むしろ逆で、P7の小さな未整理を曖昧に残さず、P5/P6へ戻るための橋です。

Cocolonを前へ進めるために、次は必ずP5/P6の読感へ戻りたいです。  
履歴線と構造気づきが、Emlisの「読まれた」に本当に変わっているか。そこをMashと一緒に見たいです。

---

## 18. 設計書名

```text
Cocolon_EmlisAI_P7_HOLD004_Group02Result_CurrentSnapshotReconcile_DetailedDesign_ImplementationOrder_20260617.md
```
