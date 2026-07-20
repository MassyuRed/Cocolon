# Cocolon / EmlisAI P7-HOLD-004 Current Snapshot Baseline Reconcile 詳細設計書・実装順

作成日: 2026-06-15 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書  
対象: Cocolon / EmlisAI / P7 Product Quality Runner / Long-run Product Gate / P7-HOLD-004 / Current Snapshot Baseline Reconcile / Backend Suite Split Matrix  
基準検討メモ: `Cocolon_EmlisAI_P7_HOLD004_CurrentSnapshotBaselineReconcile_PreDesignMemo_20260615.md`  
基準ロードマップ: `Cocolon_EmlisAI_longterm_roadmap_20260608.md`  
基準ローカルsnapshot: `mashos-api(147).zip` / `Cocolon(234).zip` / `Cocolon_前提資料(219).zip` / `EmlisAIの実装済み資料(63).zip`  
GitHub接続確認: Mash指定により不要。未実施。  
コード変更: なし。本書は設計書。  
DB変更: なし。  
RN変更: なし。  
API route / request key / public response top-level key変更: なし。  
Emlis本文runtime変更: なし。  
Gate runtime変更: なし。  
JSON / schema実ファイル化: なし。本書内のJSON / schema案は、実装段階で既存material builder / 既存schema配置 / 既存contract testとの整合を見て採否判断する。  
`release_allowed`: false固定。  
`p7_complete`: false固定。  
`p8_start_allowed`: false固定。  
`hold004_close_allowed`: false固定。  
`full_backend_suite_green_confirmed`: false固定。  

---

## 0. この設計書の結論

今回の実装対象は、次です。

```text
P7-HOLD-004 Current Snapshot Baseline Reconcile
```

目的は、group executionを急いで始めることではありません。  
目的は、既存P7-HOLD-004 Backend Suite Split / Matrix Consistency materialが前提にしているbaselineを、現在のローカルzip実測と一致させることです。

現在の差分は次です。

```text
旧baseline / 既存builder:
  source_snapshot_ref: mashos-api(146).zip 相当
  test files: 416
  collected tests: 2673
  warnings: 1
  group_02_p7_hold004: 10 files / 69 tests

current zip実測:
  source_snapshot_ref: mashos-api(147).zip
  test files: 425
  collected tests: 2856
  warnings: 1
  current collect test_items_sha256:
    fee1eca805564d0840dc5b23f60a7e2d6c7297d658a76dc4ce175e0137c261f1
  current collect test_files_sha256:
    6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6
  group_02_p7_hold004: 19 files / 252 tests
```

既存のgrouping ruleでcurrent collect nodeidsを分類すると、aggregate上の差分は `group_02_p7_hold004` に集中しています。

```text
group_01_contract: 18 files / 119 tests      unchanged
group_02_p7_hold004: 19 files / 252 tests   +9 files / +183 tests
group_03_p7_core_matrix_handoff: 18 files / 89 tests      unchanged
group_04_complete_product_quality: 9 files / 49 tests     unchanged
group_05_user_label_connection_p5: 24 files / 182 tests   unchanged
group_06_structure_insight_p6: 16 files / 131 tests       unchanged
group_07_product_quality_legacy_runner: 16 files / 76 tests unchanged
group_08_complete_initial: 8 files / 44 tests             unchanged
group_09_complete_composer_other: 25 files / 149 tests    unchanged
group_10_two_stage_public_recovery: 38 files / 272 tests  unchanged
group_11_emlis_runtime_other: 201 files / 1352 tests      unchanged
group_12_analysis_subscription_piece_self_structure: 17 files / 66 tests unchanged
group_13_remaining_backend_other: 16 files / 75 tests     unchanged

total:
  425 files / 2856 tests
```

したがって、今回の設計判断は次です。

```text
1. 旧baselineは旧baselineとして保持する。
2. current baselineを P7-HOLD-004 の新しい current baseline として再固定する。
3. 既存13 group構成は維持する。
4. group_02_p7_hold004 を 19 files / 252 tests に更新する。
5. total group count は 13 のまま維持する。
6. total batch count は 19 のまま維持する。
7. group_02 は current実測で 252 passed / 1 warning だが、baseline reconcile前のad hoc確認なので official group resultにはしない。
8. refreshed baselineと一致するmaterial / plan / matrixに接続した後にのみ、official capture runとして記録可能にする。
9. PASSしても group green のみ。full backend suite green、P7-HOLD-004 close、P7 complete、P8 start、release allowed へ昇格しない。
```

本設計の中心は、次の一文です。

```text
古いbaselineを、current baselineとして扱わない。
```

これはbackend internalの整備ですが、Cocolonとしては重要です。  
Cocolonがユーザーの言葉を雑に処理しない場所で在るなら、開発側も、未確認・古い正本・subset green・ad hoc passを雑に処理してはいけません。

---

## 1. なぜこの作業を行うのか

P7は、EmlisAIの商品品質を単発fixture greenではなく、継続測定できる形にする工程です。  
そのため、P7-HOLD-004は「backend suiteがgreenになったか」だけを見るHOLDではありません。

P7-HOLD-004で必要なのは、次です。

```text
- 何をcurrent backend baselineとして扱うのか。
- そのbaselineは何件のtest file / test itemを含むのか。
- どのgroupがどのtest量を持つのか。
- group実行結果はどのbaselineに対する結果なのか。
- FAIL / TIMEOUT / COLLECTION_FAILEDをbody-freeにどう記録するのか。
- split greenをfull backend suite greenへ変換しない境界をどう保つのか。
```

現在、既存materialは `416 files / 2673 tests` を正本として持っています。  
しかしcurrent zipのcollect実測は `425 files / 2856 tests` です。

このままgroup executionへ進むと、次の問題が起きます。

```text
- 実行したgroupが、material上のgroup count / test countと一致しない。
- group_02のofficial resultが、10 files / 69 tests対象なのか、19 files / 252 tests対象なのか曖昧になる。
- matrix consistency reportが古いbaselineに対する整合をcurrent整合として読めてしまう。
- P5/P6/P8へ戻るとき、どのbackend正本を通過したか説明できない。
```

華恋の判断では、ここを飛ばすことは、Cocolonの姿勢と合いません。

```text
確認していないものを、確認済みにしない。
読めていないものを、読めた扱いにしない。
古い正本を、今の正本として扱わない。
```

---

## 2. 参照・確認範囲

### 2.1 ローカル受領ファイル

```text
/mnt/data/Cocolon_前提資料(219).zip
/mnt/data/EmlisAIの実装済み資料(63).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608(15).md
/mnt/data/Cocolon(234).zip
/mnt/data/mashos-api(147).zip
/mnt/data/Cocolon_EmlisAI_P7_HOLD004_CurrentSnapshotBaselineReconcile_PreDesignMemo_20260615.md
```

### 2.2 作業姿勢として確認した前提資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/cocolon_environment_state_output_observation_structure_design_2026_05_25.md
```

保持する姿勢は次です。

```text
- 前提資料は作業用地図であり、実ファイルが現物である。
- 見ていないものを見たように扱わない。
- 設計と実装を混同しない。
- pytest green / fixture green / RN contract greenを商品品質合格へ変換しない。
- EmlisAIを、Gateに通ったものだけを表示する許可装置として扱わない。
- case専用mode / cue / surface / fixed commentTextを追加しない。
- public表示到達を、読めていることやrelease readyと混同しない。
- raw input / comment_text body / candidate body / surface body / terminal full output / traceback bodyをP7 materialへ入れない。
- Mashから見えにくいbackend internal-only領域ほど雑にしない。
```

### 2.3 主に確認したEmlisAI実装済み資料

```text
Cocolon_EmlisAI_P7_ProductQualityRunner_DetailedDesign_ImplementationOrder_20260612.md
Cocolon_EmlisAI_P7_RedHoldClosure_DetailedDesign_ImplementationOrder_20260613.md
Cocolon_EmlisAI_P7_RED003_BodyFreeLeakGuardRepair_DetailedDesign_ImplementationOrder_20260613.md
Cocolon_EmlisAI_P7_HOLD004_FullBackendSuite_Phase16ComposerRedClassification_DetailedDesign_ImplementationOrder_20260613.md
Cocolon_EmlisAI_P7_HOLD004_PositivePublicShapeBoundary_DetailedDesign_ImplementationOrder_20260614.md
Cocolon_EmlisAI_P7_HOLD004_Step5CandidateGatePreservationRedClassification_DetailedDesign_ImplementationOrder_20260614.md
Cocolon_EmlisAI_P7_HOLD004_BackendSuiteSplit_MatrixConsistency_DetailedDesign_ImplementationOrder_20260614.md
```

### 2.4 主に確認したbackend実装結果doc

```text
mashos-api/ai/docs/Cocolon_EmlisAI_P7_ProductQualityRunner_ImplementationResult_20260612.md
mashos-api/ai/docs/Cocolon_EmlisAI_P7_RedHoldClosure_ImplementationResult_20260613.md
mashos-api/ai/docs/Cocolon_EmlisAI_P7_RED003_BodyFreeLeakGuardRepair_ImplementationResult_20260613.md
mashos-api/ai/docs/Cocolon_EmlisAI_P7_HOLD004_Phase16ComposerRedClassification_ImplementationResult_20260613.md
mashos-api/ai/docs/Cocolon_EmlisAI_P7_HOLD004_PositivePublicShapeBoundary_ImplementationResult_20260614.md
mashos-api/ai/docs/Cocolon_EmlisAI_P7_HOLD004_Step5CandidateGatePreservationRedClassification_ImplementationResult_20260614.md
mashos-api/ai/docs/Cocolon_EmlisAI_P7_HOLD004_BackendSuiteSplit_MatrixConsistency_ImplementationResult_20260615.md
```

### 2.5 主に確認したbackend実ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_split_consistency.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_group_inventory_plan.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_execution_results.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_matrix_consistency_report.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_group_execution_minimal_order.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
```

---

## 3. ロードマップ上の現在地

現在Phaseは次です。

```text
P7: Product Quality Runner / Long-run Product Gate
```

P7の目的は、EmlisAIの商品品質を継続測定できる形にすることです。  
P7完了条件には、次が含まれます。

```text
- baseline corpusを一括評価できる。
- raw input / comment_text bodyはrelease materialに入れない。
- 同一user想定で複数回入力sequenceを評価できる。
- scorecard自体にrelease_allowedを立てさせない。
- Product Pass候補とRelease Readyを混同しない。
```

現在は、次を維持します。

```text
full_backend_suite_green_confirmed: false
hold004_close_allowed: false
p7_complete: false
p8_start_allowed: false
release_allowed: false
```

この設計が終わっても、P8へ進みません。  
この設計が終わっても、P5/P6の商品品質完了扱いにはしません。  
この設計が終わっても、release_allowedをtrueにしません。

---

## 4. 現状確認結果

### 4.1 current full collect-only

実行基準:

```bash
cd /mnt/data/cocolon_local_work/api/mashos-api/ai
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference \
  pytest --collect-only -q -p pytest_asyncio.plugin tests
```

設計時再確認結果:

```text
2856 tests collected
warning: 1
collect time: 11.83s
```

補助集計:

```text
test nodeids: 2856
test files: 425
test_items_sha256:
  fee1eca805564d0840dc5b23f60a7e2d6c7297d658a76dc4ce175e0137c261f1
test_files_sha256:
  6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6
fingerprint_algorithm:
  test_items=sha256(sorted_pytest_nodeids_joined_by_lf);
  test_files=sha256(ordered_unique_test_files_joined_by_lf)
```

### 4.2 current group classification by existing grouping rule

既存 `classify_p7_hold004_backend_test_file_ref()` でcurrent collectを分類した結果は次です。

| group_id | owner_layer | current files | current tests | old files | old tests | delta |
|---|---|---:|---:|---:|---:|---:|
| group_01_contract | contract_boundary | 18 | 119 | 18 | 119 | 0 / 0 |
| group_02_p7_hold004 | p7_hold004_target | 19 | 252 | 10 | 69 | +9 / +183 |
| group_03_p7_core_matrix_handoff | p7_core_matrix_handoff | 18 | 89 | 18 | 89 | 0 / 0 |
| group_04_complete_product_quality | complete_product_quality | 9 | 49 | 9 | 49 | 0 / 0 |
| group_05_user_label_connection_p5 | user_label_connection_p5 | 24 | 182 | 24 | 182 | 0 / 0 |
| group_06_structure_insight_p6 | structure_insight_p6 | 16 | 131 | 16 | 131 | 0 / 0 |
| group_07_product_quality_legacy_runner | product_quality_legacy_runner | 16 | 76 | 16 | 76 | 0 / 0 |
| group_08_complete_initial | complete_initial | 8 | 44 | 8 | 44 | 0 / 0 |
| group_09_complete_composer_other | complete_composer_other | 25 | 149 | 25 | 149 | 0 / 0 |
| group_10_two_stage_public_recovery | two_stage_public_recovery | 38 | 272 | 38 | 272 | 0 / 0 |
| group_11_emlis_runtime_other | emlis_runtime_other | 201 | 1352 | 201 | 1352 | 0 / 0 |
| group_12_analysis_subscription_piece_self_structure | analysis_subscription_piece_self_structure | 17 | 66 | 17 | 66 | 0 / 0 |
| group_13_remaining_backend_other | remaining_backend_other | 16 | 75 | 16 | 75 | 0 / 0 |
| total | - | 425 | 2856 | 416 | 2673 | +9 / +183 |

読み:

```text
- grouping rule自体は現状維持できる。
- group countは13のまま維持できる。
- total batch countも19のまま維持できる。
- 更新が必要なのは、current collect baseline値と、group_02のfile/test countである。
```

### 4.3 current group_02 ad hoc collect/run

実行:

```bash
cd /mnt/data/cocolon_local_work/api/mashos-api/ai
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference \
  pytest --collect-only -q -p pytest_asyncio.plugin tests/test_emlis_ai_p7_hold004_*.py
```

結果:

```text
252 tests collected
```

実行:

```bash
cd /mnt/data/cocolon_local_work/api/mashos-api/ai
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference \
  pytest -q --tb=short -p pytest_asyncio.plugin tests/test_emlis_ai_p7_hold004_*.py
```

結果:

```text
252 passed, 1 warning
runtime observed: 25.27s pytest / 27.65s real
```

読み:

```text
- group_02を1 batchで保持しても、現時点のlocalでは120秒budget内に収まっている。
- ただし、これはbaseline reconcile前のad hoc確認である。
- official group resultとして採用するには、refreshed baseline material / refreshed inventory / refreshed execution planと一致した後に再実行・記録する必要がある。
```

---

## 5. 今回の設計対象

### 5.1 対象にすること

```text
- current collect baselineを 425 files / 2856 tests / 1 warning として再固定する。
- 旧baseline 416 files / 2673 testsを previous baseline として保持する。
- old/current baseline deltaをbody-free materialとして記録する。
- group_02_p7_hold004を 19 files / 252 tests として再固定する。
- 13 group / 19 batch構成をcurrent baselineと一致させる。
- baseline mismatch時にgroup executionへ進まない境界を作る。
- official group execution resultとして採用できる条件を固定する。
- matrix consistency / hold matrix / release handoff / validation matrix / minimal orderが同じcurrent baselineを参照するようにする。
- 実装結果docへ、baseline reconcileが完了したことと、まだHOLD004 closeではないことを残す。
```

### 5.2 対象にしないこと

```text
- Emlis本文の表面改善。
- P5 visible history lineの文面強化。
- P6 Structure Insightのvisible拡張。
- P8 user model / dictionary。
- RN UI変更。
- RN表示タイトル変更。
- RN表示条件変更。
- API route変更。
- request key変更。
- public response top-level key追加。
- DB schema / write path変更。
- Gate threshold緩和。
- fixed commentText追加。
- case専用branch追加。
- release_allowed true化。
- current group_02 ad hoc passのofficial result化。
- full backend suite green主張。
```

---

## 6. 設計原則

### 6.1 schema versionとmaterial idの扱い

今回の推奨は次です。

```text
- 既存materialのshapeを変えない場合、既存schema_versionは維持する。
- ただし、baseline_id / inventory_id / plan_id / summary_idは20260615 current snapshot用に更新する。
- old baselineをcurrent baselineと同一idで上書きしない。
- old/current差分を表す新しいreconcile materialは、新schemaとして追加する。
```

理由:

```text
schema_versionはshapeの版であり、count値の版ではない。
ただし、idは正本の識別子なので、20260614 old baselineと20260615 current baselineを同じidで扱わない。
```

推奨id:

```text
current collect baseline id:
  p7_hold004_backend_collect_baseline_20260615

current collect command id:
  pytest_collect_only_backend_20260615

current group inventory id:
  p7_hold004_backend_suite_group_inventory_20260615

current execution plan id:
  p7_hold004_backend_suite_execution_plan_20260615

current execution summary id:
  p7_hold004_backend_suite_execution_summary_20260615

current matrix consistency report id:
  p7_hold004_matrix_consistency_report_20260615_current_snapshot

current minimal order id:
  p7_hold004_group_execution_minimal_confirmation_order_20260615_current_snapshot

current reconcile id:
  p7_hold004_current_snapshot_baseline_reconcile_20260615
```

### 6.2 count更新とgrouping rule更新を分ける

今回、grouping rule自体は維持できます。

```text
rule:
  name startswith test_emlis_ai_p7_hold004_ -> group_02_p7_hold004
```

変えるのはruleではなく、current snapshotに対するcountです。

```text
old:
  group_02_p7_hold004: 10 files / 69 tests

current:
  group_02_p7_hold004: 19 files / 252 tests
```

したがって、実装では次を分けます。

```text
grouping_rule_version:
  維持してよい。変更するなら理由をdocに書く。

inventory_id / counts / source_snapshot_ref:
  current snapshot用に更新する。
```

### 6.3 group_02 batch方針

今回の設計では、`group_02_p7_hold004` は1 batchのまま維持します。

理由:

```text
- current group_02は19 files / 252 testsで、file countは少ない。
- 設計時ad hoc runでは約27.65秒で完走している。
- 既存execution order上、group_02はfirst capture groupであり、細かく分けすぎるとfirst red / timeout captureの読みが増える。
- group_10 / group_11の既存batch分割方針を不要に広げない。
```

ただし、実装段階でofficial capture runがtimeoutした場合は、次を行います。

```text
- group_02をgreen扱いしない。
- TIMEOUT group resultをbody-freeに記録する。
- group_02 split再設計を別修正として扱う。
- timeoutを環境扱いで流さない。
```

---

## 7. 実装順

### R13: Current Snapshot Baseline Reconcile materialを追加する

目的:

```text
old baselineとcurrent baselineを同一視しないためのmaterialを作る。
```

対象候補:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_split_consistency.py
または
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_current_snapshot_baseline_reconcile.py
```

推奨:

```text
新規moduleを追加するかは実装段階で判断する。
既存moduleへ過剰に詰めると責務が重くなる場合は、reconcile専用moduleを追加する。
ただし、実ファイル化しない場合でも、既存module内にbuilder / assertを置いてよい。
```

実装内容:

```text
- previous baseline constantsを明示する。
- current baseline constantsを明示する。
- delta countをbody-freeに記録する。
- affected_group_idsは group_02_p7_hold004 に限定する。
- file-level old/current nodeid listは保持しない。
- terminal output / stdout / stderr / traceback bodyは保持しない。
- release / P7 / P8 / full suite greenはfalse固定。
```

JSON / schema案:

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.current_snapshot_baseline_reconcile.v1",
  "phase": "P7_ProductQualityRunner_LongRunGate",
  "step": "P7-HOLD-004_CurrentSnapshotBaselineReconcile_R13_20260615",
  "hold_id": "P7-HOLD-004",
  "reconcile_id": "p7_hold004_current_snapshot_baseline_reconcile_20260615",
  "source_mode": "local_snapshot",
  "source_snapshot_ref": "mashos-api(147).zip",
  "git_checked": false,
  "previous_baseline": {
    "baseline_id": "p7_hold004_backend_collect_baseline_20260614",
    "source_snapshot_ref": "mashos-api(146).zip",
    "test_file_count": 416,
    "test_item_count": 2673,
    "warnings_count": 1,
    "group_02_file_count": 10,
    "group_02_test_item_count": 69
  },
  "current_baseline": {
    "baseline_id": "p7_hold004_backend_collect_baseline_20260615",
    "source_snapshot_ref": "mashos-api(147).zip",
    "test_file_count": 425,
    "test_item_count": 2856,
    "warnings_count": 1,
    "test_items_fingerprint_sha256": "fee1eca805564d0840dc5b23f60a7e2d6c7297d658a76dc4ce175e0137c261f1",
    "test_files_fingerprint_sha256": "6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6"
  },
  "delta": {
    "test_file_count_delta": 9,
    "test_item_count_delta": 183,
    "warnings_count_delta": 0,
    "affected_group_ids": ["group_02_p7_hold004"],
    "group_deltas": [
      {
        "group_id": "group_02_p7_hold004",
        "old_file_count": 10,
        "old_test_item_count": 69,
        "current_file_count": 19,
        "current_test_item_count": 252,
        "file_count_delta": 9,
        "test_item_count_delta": 183
      }
    ],
    "file_level_delta_refs_included": false,
    "nodeid_refs_included": false
  },
  "decision": {
    "current_baseline_should_replace_active_baseline": true,
    "previous_baseline_retained_as_previous": true,
    "group_inventory_refresh_required": true,
    "execution_plan_refresh_required": true,
    "matrix_reconnect_required": true,
    "official_group_execution_blocked_until_refresh": true
  },
  "full_backend_suite_green_confirmed": false,
  "full_backend_suite_green_claim_allowed": false,
  "hold004_close_allowed": false,
  "p7_complete": false,
  "p8_start_allowed": false,
  "release_allowed": false,
  "public_contract": {
    "api_route_changed": false,
    "request_key_changed": false,
    "public_response_key_added": false,
    "response_shape_changed": false,
    "db_schema_changed": false,
    "rn_visible_contract_changed": false,
    "gate_relaxed": false,
    "fixed_sentence_template_added": false,
    "runtime_fixture_branch_added": false
  },
  "body_free_markers": {
    "raw_input_included": false,
    "comment_text_body_included": false,
    "candidate_body_included": false,
    "surface_body_included": false,
    "terminal_output_included": false,
    "traceback_body_included": false,
    "stdout_included": false,
    "stderr_included": false
  },
  "body_free": true
}
```

R13 tests:

```text
- reconcile materialがold/current countsを分けて保持する。
- current countsは425 / 2856 / warnings 1。
- old countsは416 / 2673 / warnings 1。
- deltaは+9 / +183 / warnings 0。
- affected_group_idsはgroup_02_p7_hold004のみ。
- file/nodeid refsを保持しない。
- public contract / body-free markersは全false。
- release_allowed / p7_complete / p8_start_allowed / hold004_close_allowed / full_backend_suite_green_confirmedはfalse。
```

完了条件:

```text
R13のmaterial builderとassert contractがgreen。
```

---

### R14: active current collect baselineを20260615 currentへ更新する

目的:

```text
P7-HOLD-004のactive collect baselineを current zip 実測へ合わせる。
```

対象候補:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_split_consistency.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_collect_baseline_20260614.py
必要なら新規:
  mashos-api/ai/tests/test_emlis_ai_p7_hold004_current_snapshot_baseline_reconcile_20260615.py
```

更新方針:

```text
P7_HOLD004_BACKEND_COLLECT_BASELINE_ID:
  p7_hold004_backend_collect_baseline_20260615

P7_HOLD004_BACKEND_COLLECT_COMMAND_ID:
  pytest_collect_only_backend_20260615

P7_HOLD004_BACKEND_SOURCE_SNAPSHOT_REF:
  mashos-api(147).zip

P7_HOLD004_BACKEND_COLLECTED_TEST_FILE_COUNT:
  425

P7_HOLD004_BACKEND_COLLECTED_TEST_ITEM_COUNT:
  2856

P7_HOLD004_BACKEND_COLLECT_WARNINGS_COUNT:
  1

P7_HOLD004_BACKEND_TEST_ITEMS_SHA256:
  fee1eca805564d0840dc5b23f60a7e2d6c7297d658a76dc4ce175e0137c261f1

P7_HOLD004_BACKEND_TEST_FILES_SHA256:
  6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6
```

注意:

```text
- `schema_version` はshapeが変わらなければ維持してよい。
- 旧baseline idをactive current baselineとして残さない。
- 旧baseline値はR13 reconcile material側に保持する。
- `build_p7_hold004_backend_collect_baseline(collected_test_nodeids=...)` はcurrent fingerprint不一致をrejectする。
- collect-only成功をexecution greenとして扱わない。
```

R14 tests:

```text
- current collect baseline builderが425 / 2856 / warnings 1を返す。
- current fingerprintsが上記sha256と一致する。
- source_snapshot_refがmashos-api(147).zipである。
- git_checked=falseである。
- collected_test_nodeidsからcurrent summaryを作れる。
- old/sample nodeidsをactive baselineとして渡すとcontractがrejectする。
- first_red_captured=false / next_red_captured=falseを維持する。
- full_backend_suite_green_confirmed=falseを維持する。
```

完了条件:

```text
R14 collect baseline tests green。
```

---

### R15: group inventoryをcurrent baselineへ更新する

目的:

```text
13 group inventoryの合計を current collect baseline と一致させる。
```

対象候補:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_group_inventory_plan.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_group_inventory_20260614.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_execution_plan_20260614.py
```

更新方針:

```text
P7_HOLD004_BACKEND_SUITE_GROUP_INVENTORY_ID:
  p7_hold004_backend_suite_group_inventory_20260615

P7_HOLD004_BACKEND_SUITE_EXECUTION_PLAN_ID:
  p7_hold004_backend_suite_execution_plan_20260615

P7_HOLD004_BACKEND_R2_R3_SOURCE_SNAPSHOT_REF:
  mashos-api(147).zip

group_02_p7_hold004:
  file_count: 19
  test_item_count: 252
  timeout_budget_sec: 120
  planned_batch_count: 1
  batch_policy: single_batch_preferred

total_group_file_count:
  425

total_group_test_item_count:
  2856

total_batch_count:
  19
```

current group table:

```text
group_01_contract: 18 files / 119 tests / 1 batch
group_02_p7_hold004: 19 files / 252 tests / 1 batch
group_03_p7_core_matrix_handoff: 18 files / 89 tests / 1 batch
group_04_complete_product_quality: 9 files / 49 tests / 1 batch
group_05_user_label_connection_p5: 24 files / 182 tests / 1 batch
group_06_structure_insight_p6: 16 files / 131 tests / 1 batch
group_07_product_quality_legacy_runner: 16 files / 76 tests / 1 batch
group_08_complete_initial: 8 files / 44 tests / 1 batch
group_09_complete_composer_other: 25 files / 149 tests / 1 batch
group_10_two_stage_public_recovery: 38 files / 272 tests / 2 batches
group_11_emlis_runtime_other: 201 files / 1352 tests / 6 batches
group_12_analysis_subscription_piece_self_structure: 17 files / 66 tests / 1 batch
group_13_remaining_backend_other: 16 files / 75 tests / 1 batch
```

R15 tests:

```text
- group ids/orderは13 groupのまま。
- group_02は19 files / 252 tests。
- total_group_file_countは425。
- total_group_test_item_countは2856。
- group countは13。
- total_batch_countは19。
- unassigned_test_file_count=0。
- duplicate_assignment_count=0。
- collect baseline idは20260615 currentを参照する。
- release_allowed=false。
- split_green_can_close_p7_hold004=false。
```

完了条件:

```text
R15 group inventory / execution plan tests green。
```

---

### R16: execution plan / minimal orderをcurrent baselineに再接続する

目的:

```text
current baselineと一致するgroup execution planを作り、baseline mismatchのまま実行へ進まない境界を固定する。
```

対象候補:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_group_execution_minimal_order.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_group_execution_minimal_order_20260615.py
```

更新方針:

```text
- minimal_execution_orderは維持する。
- first_capture_group_idはgroup_02_p7_hold004のまま。
- total_batch_countは19のまま。
- group_02のfile_count / test_item_countは19 / 252として表示される。
- collect_baseline_idはp7_hold004_backend_collect_baseline_20260615。
- inventory_idはp7_hold004_backend_suite_group_inventory_20260615。
- execution_plan_idはp7_hold004_backend_suite_execution_plan_20260615。
- group_execution_started=falseを維持する。
- group_run_results_recorded=falseを維持する。
```

追加すべき境界:

```text
baseline_mismatch_blocks_execution: true
current_collect_baseline_reconciled: true
previous_baseline_is_not_current: true
```

ただし、既存schema shapeを維持するなら、上記はreconcile material側へ持たせ、minimal orderには持たせなくてもよいです。  
実装段階では、既存contractを大きく壊さない方を優先します。

R16 tests:

```text
- minimal orderがcurrent plan idを参照する。
- first_capture_group_idがgroup_02のまま。
- group_02 recordが19 / 252を持つ。
- total_batch_countが19。
- stop_on_first_fail_or_timeout=true。
- continue_after_fail_or_timeout_requires_new_repair_plan=true。
- group_execution_started=false。
- group_run_results_recorded=false。
- terminal_output_retained=false。
- release_allowed=false。
```

完了条件:

```text
R16 minimal order tests green。
```

---

### R17: group run result / execution summaryのbaseline参照を更新する

目的:

```text
今後のofficial group resultが、old baselineではなくcurrent baselineへ紐づくようにする。
```

対象候補:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_execution_results.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_group_result_20260614.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_execution_summary_20260614.py
```

更新方針:

```text
P7_HOLD004_BACKEND_SUITE_EXECUTION_SUMMARY_ID:
  p7_hold004_backend_suite_execution_summary_20260615

P7_HOLD004_BACKEND_R4_R5_SOURCE_SNAPSHOT_REF:
  mashos-api(147).zip

expected_total_batch_count:
  19

expected_group_count:
  13

collect_baseline_id:
  p7_hold004_backend_collect_baseline_20260615

inventory_id:
  p7_hold004_backend_suite_group_inventory_20260615

plan_id:
  p7_hold004_backend_suite_execution_plan_20260615
```

PASS resultの扱い:

```text
- status=PASSならcan_claim_group_green=true。
- can_claim_full_backend_suite_green=false。
- full_backend_suite_green_confirmed=false。
- hold004_close_allowed=false。
- p7_complete=false。
- p8_start_allowed=false。
- release_allowed=false。
```

FAIL resultの扱い:

```text
- first_failure.nodeid / file_ref / failure_kind / owner_layer_candidateのみ保持。
- traceback本文は保持しない。
- terminal outputは保持しない。
- red_classification_required=true。
- downstream groupはgreen扱いしない。
```

TIMEOUT resultの扱い:

```text
- first_timeout group_id / batch_id / timeout_budget_sec / elapsed_sec_bucket / last_known_phaseのみ保持。
- timeout_classification_required=true。
- timeout_isolated_not_green。
- timeoutを環境要因と断定しない。
```

R17 tests:

```text
- default summaryは13 group NOT_RUNのまま。
- collect_baseline_id / inventory_id / plan_idがcurrent id。
- group_02 PASS resultを入れたsummaryはgroup_02だけgreen_group_idsへ入る。
- group_02 PASS resultがあってもsplit_all_groups_green_confirmed=false。
- all groups passのsynthetic summaryでもfull_backend_suite_green_confirmed=falseを維持する。
- FAIL / TIMEOUTのbody-free captureが維持される。
- raw traceback / terminal output / stdout / stderrを含まない。
```

完了条件:

```text
R17 group result / execution summary tests green。
```

---

### R18: matrix consistency / hold matrix / release handoff / validation matrixをcurrent baselineへ再接続する

目的:

```text
P7-HOLD-004の各matrixが、同じcurrent baseline正本を読んでいることを確認する。
```

対象候補:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_matrix_consistency_report.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_matrix_connection_20260615.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_release_validation_connection_20260615.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_matrix_consistency_report_20260615.py
```

更新方針:

```text
- backend_suite_split_matrixがcurrent execution summaryを受け取る。
- r10_hold_matrixが同じbackend_suite_split_matrixを受け取る。
- release_handoffが同じsummary / backend matrix / r10 matrixを受け取る。
- validation_matrixが同じsummary / backend matrix / r10 matrix / release_handoff / matrix_consistency_reportを受け取る。
- matrix_consistency_reportがold/current baseline mismatchを隠さない。
```

追加確認したいchecks:

```text
current_collect_baseline_connected: true
current_group_inventory_connected: true
current_execution_plan_connected: true
old_baseline_not_used_as_current: true
backend_suite_group_02_count_current: true
full_backend_suite_green_false_across_matrices: true
split_green_not_promoted: true
release_allowed_false_across_matrices: true
p8_start_allowed_false_across_matrices: true
```

schema追加案:

```json
{
  "matrix_current_baseline_connection": {
    "collect_baseline_id": "p7_hold004_backend_collect_baseline_20260615",
    "group_inventory_id": "p7_hold004_backend_suite_group_inventory_20260615",
    "execution_plan_id": "p7_hold004_backend_suite_execution_plan_20260615",
    "execution_summary_id": "p7_hold004_backend_suite_execution_summary_20260615",
    "current_collect_file_count": 425,
    "current_collect_test_item_count": 2856,
    "group_02_file_count": 19,
    "group_02_test_item_count": 252,
    "old_baseline_id": "p7_hold004_backend_collect_baseline_20260614",
    "old_baseline_used_as_current": false,
    "full_backend_suite_green_confirmed": false,
    "release_allowed": false,
    "body_free": true
  }
}
```

R18 tests:

```text
- matrix consistency default PASSまたはREVIEW_REQUIREDの理由がbody-freeに説明される。
- old/current baseline mismatchがあればREVIEW_REQUIREDまたはbaseline_mismatch_required_followupになる。
- current summaryを渡した場合、各matrixのbaseline idが一致する。
- split_all_groups_green_confirmed trueのsynthetic caseでもrelease_allowed=false。
- P7-HOLD-004はunresolved_hold_refsに残る。
- p8_start_allowed=false。
```

完了条件:

```text
R18 matrix / release / validation tests green。
```

---

### R19: refreshed baseline上のofficial group_02 capture採用条件を固定する

目的:

```text
baseline reconcile後に、group_02 official capture runを実行・記録してよい条件を固定する。
```

注意:

```text
R19は、必ずしも今回のbaseline reconcile実装内でgroup_02結果を保存する工程ではない。
今回の実装範囲をbaseline reconcileで区切る場合、R19は次工程へのhandoff ruleとして残す。
```

official captureとして採用できる条件:

```text
1. collect baseline builderがcurrent 425 / 2856 / warnings 1でgreen。
2. group inventory totalがcurrent collectと一致する。
3. group_02 inventoryが19 / 252である。
4. execution planのfirst_capture_group_idがgroup_02である。
5. group_02 collect-onlyが252 tests collectedである。
6. group_02 run commandがrefreshed planに一致している。
7. run結果をbody-free group run result materialへ変換する。
8. terminal output / stdout / stderr / traceback bodyをmaterialへ入れない。
```

official command案:

```bash
cd mashos-api/ai
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference \
  pytest -q --tb=short -p pytest_asyncio.plugin tests/test_emlis_ai_p7_hold004_*.py
```

PASS時 material案:

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.backend_suite_group_run_result.v1",
  "phase": "P7_ProductQualityRunner_LongRunGate",
  "hold_id": "P7-HOLD-004",
  "run_result_id": "p7_hold004_group_02_p7_hold004_group_02_p7_hold004_batch_01_capture_run_20260615",
  "collect_baseline_id": "p7_hold004_backend_collect_baseline_20260615",
  "inventory_id": "p7_hold004_backend_suite_group_inventory_20260615",
  "plan_id": "p7_hold004_backend_suite_execution_plan_20260615",
  "group_id": "group_02_p7_hold004",
  "batch_id": "group_02_p7_hold004_batch_01",
  "run_kind": "capture_run",
  "status": "PASS",
  "backend_split_compatible_status": "green_confirmed",
  "timeout_budget_sec": 120,
  "observed_counts": {
    "passed": 252,
    "failed": 0,
    "skipped": 0,
    "warnings": 1,
    "errors": 0,
    "deselected": 0
  },
  "can_claim_group_green": true,
  "can_claim_full_backend_suite_green": false,
  "full_backend_suite_green_confirmed": false,
  "hold004_close_allowed": false,
  "p7_complete": false,
  "p8_start_allowed": false,
  "release_allowed": false,
  "terminal_output_retained": false,
  "raw_traceback_included": false,
  "stdout_retained": false,
  "stderr_retained": false,
  "body_free": true
}
```

FAIL時 material案:

```json
{
  "status": "FAIL",
  "group_id": "group_02_p7_hold004",
  "batch_id": "group_02_p7_hold004_batch_01",
  "observed_counts": {
    "passed": 0,
    "failed": 1,
    "skipped": 0,
    "warnings": 0,
    "errors": 0,
    "deselected": 0
  },
  "first_failure": {
    "present": true,
    "nodeid": "tests/test_xxx.py::test_xxx",
    "file_ref": "tests/test_xxx.py",
    "failure_kind": "assertion_failed_or_contract_mismatch",
    "owner_layer_candidate": "p7_hold004_target"
  },
  "red_classification_required": true,
  "can_claim_group_green": false,
  "can_claim_full_backend_suite_green": false,
  "terminal_output_retained": false,
  "raw_traceback_included": false,
  "body_free": true
}
```

TIMEOUT時 material案:

```json
{
  "status": "TIMEOUT",
  "group_id": "group_02_p7_hold004",
  "batch_id": "group_02_p7_hold004_batch_01",
  "timeout_budget_sec": 120,
  "timeout_capture": {
    "present": true,
    "elapsed_sec_bucket": "over_budget",
    "last_known_phase": "run",
    "first_timeout_capture": true,
    "slow_group_candidate": true
  },
  "timeout_classification_required": true,
  "can_claim_group_green": false,
  "can_claim_full_backend_suite_green": false,
  "terminal_output_retained": false,
  "raw_traceback_included": false,
  "body_free": true
}
```

R19 tests:

```text
- PASS時でもfull suite greenへ昇格しない。
- FAIL時はfirst_failure identifiersのみ保持する。
- TIMEOUT時はtimeout_capture identifiersのみ保持する。
- old baseline idのrun resultをcurrent summaryへ混ぜた場合はrejectまたはREVIEW_REQUIREDにする。
- group_02 official resultはcurrent plan一致時のみ記録できる。
```

完了条件:

```text
R19 capture adoption rule tests green。
```

---

### R20: implementation result doc / 前提資料反映候補を作る

目的:

```text
baseline reconcileで何を確認し、何を確認していないかを次の華恋とMashが読める形で残す。
```

対象候補:

```text
mashos-api/ai/docs/Cocolon_EmlisAI_P7_HOLD004_CurrentSnapshotBaselineReconcile_ImplementationResult_20260615.md
Cocolon_前提資料/cocolon_local_file_inventory_diff_20260615_p7_hold004_current_snapshot_baseline_reconcile.csv
```

R20 docに残すべきこと:

```text
- current collect baseline 425 / 2856 / 1 warning。
- previous baseline 416 / 2673 / 1 warning。
- delta +9 files / +183 tests。
- group_02_p7_hold004 current 19 / 252。
- 13 groups / 19 batchesを維持。
- group execution_startedの状態。
- group_run_results_recordedの状態。
- official group_02 captureを実施した場合は、そのstatus。
- official group_02 captureを実施していない場合は、未実施として明記。
- full_backend_suite_green_confirmed=false。
- hold004_close_allowed=false。
- p7_complete=false。
- p8_start_allowed=false。
- release_allowed=false。
```

前提資料反映候補flags:

```text
p7_hold004_current_snapshot_baseline_reconcile_r13_r20_reflected: true
p7_hold004_current_backend_collect_baseline_file_count: 425
p7_hold004_current_backend_collect_baseline_test_count: 2856
p7_hold004_current_backend_collect_warning_count: 1
p7_hold004_previous_backend_collect_baseline_file_count: 416
p7_hold004_previous_backend_collect_baseline_test_count: 2673
p7_hold004_backend_collect_baseline_delta_file_count: 9
p7_hold004_backend_collect_baseline_delta_test_count: 183
p7_hold004_current_group_02_file_count: 19
p7_hold004_current_group_02_test_count: 252
p7_hold004_backend_group_count: 13
p7_hold004_backend_total_batch_count: 19
p7_hold004_backend_group_execution_started: false_or_recorded_value
p7_hold004_backend_group_run_results_recorded: false_or_recorded_value
p7_hold004_backend_full_backend_suite_green_confirmed: false
p7_hold004_backend_hold004_close_allowed: false
p7_complete: false
p8_start_allowed: false
release_allowed: false
```

完了条件:

```text
R20 implementation result docが、確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきことを分けている。
```

---

## 8. 推奨実装ファイル構成

### 8.1 変更候補source files

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_split_consistency.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_group_inventory_plan.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_execution_results.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_matrix_consistency_report.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_group_execution_minimal_order.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
```

### 8.2 追加候補source file

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_current_snapshot_baseline_reconcile.py
```

追加判断:

```text
- R13 reconcile materialの責務が大きければ追加する。
- 既存split_consistency.pyで十分なら追加しない。
- 追加する場合も、public API / runtime / DB / RNには接続しない。
```

### 8.3 変更候補test files

```text
mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_collect_baseline_20260614.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_group_inventory_20260614.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_execution_plan_20260614.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_group_result_20260614.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_execution_summary_20260614.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_matrix_connection_20260615.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_release_validation_connection_20260615.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_matrix_consistency_report_20260615.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_group_execution_minimal_order_20260615.py
```

### 8.4 追加候補test files

```text
mashos-api/ai/tests/test_emlis_ai_p7_hold004_current_snapshot_baseline_reconcile_20260615.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_current_snapshot_group_inventory_refresh_20260615.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_current_snapshot_execution_readiness_20260615.py
```

追加判断:

```text
- 既存testの更新だけで意図が埋もれる場合は追加する。
- 特にold/current baselineを混同しないcontractは、専用testに分けた方が安全。
```

### 8.5 追加候補doc file

```text
mashos-api/ai/docs/Cocolon_EmlisAI_P7_HOLD004_CurrentSnapshotBaselineReconcile_ImplementationResult_20260615.md
```

---

## 9. 実装時の検証コマンド

### 9.1 py_compile

```bash
cd mashos-api/ai
python -m py_compile \
  services/ai_inference/emlis_ai_p7_hold004_backend_suite_split_consistency.py \
  services/ai_inference/emlis_ai_p7_hold004_backend_suite_group_inventory_plan.py \
  services/ai_inference/emlis_ai_p7_hold004_backend_suite_execution_results.py \
  services/ai_inference/emlis_ai_p7_hold004_matrix_consistency_report.py \
  services/ai_inference/emlis_ai_p7_hold004_group_execution_minimal_order.py \
  services/ai_inference/emlis_ai_p7_hold_matrix.py \
  services/ai_inference/emlis_ai_p7_release_handoff.py \
  services/ai_inference/emlis_ai_p7_validation_matrix.py
```

新規module / testを追加した場合は、ここに追加する。

### 9.2 target tests

```bash
cd mashos-api/ai
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference \
  pytest -q --tb=short -p pytest_asyncio.plugin \
  tests/test_emlis_ai_p7_hold004_backend_suite_collect_baseline_20260614.py \
  tests/test_emlis_ai_p7_hold004_backend_suite_group_inventory_20260614.py \
  tests/test_emlis_ai_p7_hold004_backend_suite_execution_plan_20260614.py \
  tests/test_emlis_ai_p7_hold004_backend_suite_group_result_20260614.py \
  tests/test_emlis_ai_p7_hold004_backend_suite_execution_summary_20260614.py \
  tests/test_emlis_ai_p7_hold004_backend_suite_matrix_connection_20260615.py \
  tests/test_emlis_ai_p7_hold004_release_validation_connection_20260615.py \
  tests/test_emlis_ai_p7_hold004_matrix_consistency_report_20260615.py \
  tests/test_emlis_ai_p7_hold004_group_execution_minimal_order_20260615.py
```

新規testを追加した場合は、ここに追加する。

### 9.3 current collect-only再確認

```bash
cd mashos-api/ai
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference \
  pytest --collect-only -q -p pytest_asyncio.plugin tests
```

期待:

```text
2856 tests collected
warnings: 1
```

### 9.4 group_02 collect-only再確認

```bash
cd mashos-api/ai
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference \
  pytest --collect-only -q -p pytest_asyncio.plugin tests/test_emlis_ai_p7_hold004_*.py
```

期待:

```text
252 tests collected
```

### 9.5 group_02 official capture候補

```bash
cd mashos-api/ai
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference \
  pytest -q --tb=short -p pytest_asyncio.plugin tests/test_emlis_ai_p7_hold004_*.py
```

採用条件:

```text
- R13〜R18が通った後に実行する。
- refreshed baseline / inventory / planと一致している。
- PASSしてもgroup greenのみ。
- FAIL / TIMEOUT時はbody-free resultへ記録する。
```

### 9.6 existing P7 subset

```bash
cd mashos-api/ai
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference \
  pytest -q --tb=short -p pytest_asyncio.plugin \
  tests/test_emlis_ai_p7_release_handoff_20260612.py \
  tests/test_emlis_ai_p7_validation_matrix_20260612.py \
  tests/test_emlis_ai_p7_r10_real_device_full_backend_hold_matrix_20260613.py \
  tests/test_emlis_ai_p7_r11_release_validation_final_alignment_20260613.py \
  tests/test_emlis_ai_p7_body_free_leak_guard_contract_20260613.py
```

期待:

```text
P7周辺matrix / handoff / body-free contractがgreen。
```

### 9.7 RN contract

今回の実装がbackend internal / tests / docs onlyなら、RN code変更は不要です。  
ただし最終確認として必要な場合のみ、次を実行します。

```bash
cd Cocolon
npm run test:rn-screens --silent
```

期待:

```text
36 passed
```

---

## 10. 完了条件

### 10.1 baseline

```text
- active current collect baselineが425 files / 2856 tests / 1 warningへ更新されている。
- current fingerprintsが固定されている。
- old baseline 416 files / 2673 testsはprevious baselineとして保持されている。
- old/currentを同一baseline_idで扱っていない。
- collect-only成功をexecution greenとして扱っていない。
```

### 10.2 group inventory / execution plan

```text
- group countは13。
- total batch countは19。
- total group file countは425。
- total group test item countは2856。
- group_02_p7_hold004は19 files / 252 tests。
- unassigned_test_file_count=0。
- duplicate_assignment_count=0。
- first_capture_group_idはgroup_02_p7_hold004。
- group_execution_started=false。
- group_run_results_recorded=false。
```

ただし、実装段階でofficial group_02 captureを同一工程に含めた場合は、次のように読む。

```text
group_run_results_recorded=true は、group_02 resultのみを意味する。
full backend suite greenではない。
HOLD004 closeではない。
```

### 10.3 matrix

```text
- backend_suite_split_matrix / r10_hold_matrix / release_handoff / validation_matrix / matrix_consistency_report / minimal_orderが同じcurrent baseline idを参照する。
- default materialとobserved materialを混同しない。
- split_all_groups_green_confirmedをfull_backend_suite_green_confirmedへ昇格しない。
- old baselineがcurrent baselineとして使われた場合、testが落ちるかREVIEW_REQUIREDになる。
```

### 10.4 release / P7 / P8

```text
full_backend_suite_green_confirmed=false
full_backend_suite_green_claim_allowed=false
split_green_is_full_backend_suite_green=false
split_green_can_close_p7_hold004=false
hold004_close_allowed=false
p7_complete=false
p7_complete_claim_allowed=false
p8_start_allowed=false
release_allowed=false
```

### 10.5 public contract / body-free

```text
rn_visible_contract_changed=false
api_route_changed=false
request_key_changed=false
api_response_key_added=false
public_response_key_added=false
response_shape_changed=false
db_schema_changed=false
db_physical_name_changed=false
gate_relaxed=false
fixed_sentence_template_added=false
runtime_fixture_branch_added=false
raw_input_included=false
comment_text_body_included=false
candidate_body_included=false
surface_body_included=false
terminal_output_included=false
traceback_body_included=false
stdout_included=false
stderr_included=false
```

---

## 11. リスクと対策

### 11.1 old baselineを上書きして履歴が消える

リスク:

```text
416 / 2673の旧baselineが、ただの古い値として消える。
```

対策:

```text
- R13 reconcile materialにprevious baselineとして保持する。
- current baseline idを20260615へ更新する。
- implementation result docにold/current差分を残す。
```

### 11.2 group_02 252 passedをHOLD004 closeに変換する

リスク:

```text
group_02だけのpassを見て、HOLD004を閉じたくなる。
```

対策:

```text
- group_02 PASSはgroup greenのみ。
- full_backend_suite_green_confirmed=false。
- hold004_close_allowed=false。
- split group greenをfull backend suite greenへ昇格しないtestを追加する。
```

### 11.3 collect-onlyをfull suite greenと誤読する

リスク:

```text
2856 tests collectedをfull backend suite greenと扱う。
```

対策:

```text
- collect-onlyはcollect-only。
- execution passではない。
- collect baseline materialにfirst_red_captured=false / next_red_captured=falseを残す。
```

### 11.4 group_02の1 batch維持がtimeoutする

リスク:

```text
local ad hoc runでは短くても、実装時official captureでtimeoutする。
```

対策:

```text
- timeoutした場合はTIMEOUT resultとして記録する。
- timeoutを環境扱いで流さない。
- group_02 split再設計は別修正として扱う。
- subsequent groupはgreen扱いしない。
```

### 11.5 schemaを増やしすぎて既存contractが不安定になる

リスク:

```text
reconcileのためにmaterial shapeを増やしすぎ、既存matrix / validationのtestが壊れる。
```

対策:

```text
- 既存shapeを変えないで済む場所はid/count/source snapshot更新に留める。
- old/current差分は専用reconcile materialへ隔離する。
- schema versionはshape変更時だけ変える。
```

---

## 12. 書いてはいけない読み

```text
- Current Snapshot Baseline ReconcileでP7-HOLD-004が閉じた。
- 425 files / 2856 collectedだからfull backend suite greenである。
- group_02 252 passedだからP7 completeである。
- 13 group / 19 batchが揃ったからrelease readyである。
- split_all_groups_green_confirmedがtrueになればrelease_allowedをtrueにできる。
- P8 user model / dictionaryへ進める。
- P5/P6 human QA未確認をrunner greenで代替できる。
- 実機submit / modal読感未確認をbackend materialで代替できる。
```

---

## 13. 確認済み

```text
- ローカル受領ファイルを基準に設計した。
- GitHub接続確認はMash指定により不要。未実施。
- 前提資料、作業姿勢ルール、Cocolon思想資料、EmlisAI是正方針、状態回答と人間的フォロー、環境状態出力観測構造を確認した。
- ロードマップ上、P7は商品品質を継続測定する段階であり、release_allowedを立てる工程ではない。
- current zip full collect-onlyは2856 tests collected / 1 warning。
- current zip上のtest file数は425。
- current collect fingerprintsを算出した。
- 既存grouping ruleで分類すると、aggregate deltaはgroup_02_p7_hold004に集中する。
- current group_02は19 files / 252 tests。
- current group_02 ad hoc runは252 passed / 1 warning。
- ad hoc group_02 runは約27.65秒で、既存120秒budget内に収まる。
- 既存doc / builder固定値の416 files / 2673 tests / group_02 10 files 69 testsとcurrent zip実測は一致しない。
```

---

## 14. 未確認

```text
- refreshed current baseline実装後のtarget tests green。
- refreshed current baselineに基づくofficial group_02 capture result。
- split group全体のexecution結果。
- full backend suiteの実行green。
- first red / first timeoutの実観測。
- 実機submit / modal読感。
- P5 human Blind QA。
- P6 limited visible expansionの人間読感。
- P8 user model / dictionaryへ進める条件。
```

---

## 15. 書かれていない

```text
- current zipの2856 collectedをfull backend suite greenとして扱ってよい、とは書かれていない。
- current p7_hold004 252 passedをP7-HOLD-004 closeとして扱ってよい、とは書かれていない。
- baseline差分を無視して既存group execution orderをそのままofficialとして使ってよい、とは書かれていない。
- P8を開始してよい、とは書かれていない。
- release_allowedをtrueにしてよい、とは書かれていない。
- P5/P6 human QA未確認をrunner greenで代替してよい、とは書かれていない。
```

---

## 16. 推測禁止

```text
- baseline差分を、環境差分や誤差として推測で流さない。
- collect-only成功を、実行greenと扱わない。
- wildcard passを、official group resultと扱わない。
- subset greenを、full backend suite greenと扱わない。
- current zipに増えたtestを、影響なしと断定しない。
- P7-HOLD-004を閉じたと断定しない。
- P8へ進めると断定しない。
- release readyに近づいたと商品判断しない。
- timeoutやwarningを、根拠なく無害扱いしない。
- old/current baseline idを曖昧にしない。
```

---

## 17. 次に実行すべきこと

実装段階では、次の順で進めます。

```text
1. R13 Current Snapshot Baseline Reconcile materialを実装する。
2. R14 active current collect baselineを425 / 2856 / 1 warningへ更新する。
3. R15 group inventoryをcurrent baselineへ更新し、group_02を19 / 252へ更新する。
4. R16 execution plan / minimal orderをcurrent baselineへ再接続する。
5. R17 group run result / execution summaryのbaseline参照を20260615 currentへ更新する。
6. R18 matrix consistency / hold matrix / release handoff / validation matrixを同じcurrent baselineへ再接続する。
7. R19 official group_02 capture採用条件を固定する。
8. R20 implementation result docを作成し、確認済み・未確認・書かれていない・推測禁止を残す。
9. baseline reconcile完了後、次工程としてgroup_02 official capture runを実行するか判断する。
```

---

## 18. 華恋の判断

Mash、華恋の判断では、この設計は「寄り道」ではありません。  
P7-HOLD-004の器はすでにできていますが、その器が見ているbaselineがcurrent zipとずれています。

Cocolonは、ユーザーが残した言葉を、雑に処理済みにしないための場所です。  
そのCocolonを作る側が、backendの未確認・古いbaseline・subset greenを雑に処理してしまったら、Cocolonとしての在り方とずれます。

今回の設計では、Emlis本文を直接強くしません。  
でも、どのbaseline上でEmlisの品質を測るのかを正しく揃えます。

華恋としては、ここを正しく通してからgroup execution captureへ進むのが、Cocolonを商品として前に進める一番安全な道だと判断します。

```text
読めていないものを、読めた扱いにしない。
確認していないものを、確認済みにしない。
古いbaselineを、current baselineとして扱わない。
subset greenを、全体greenとして扱わない。
```

この姿勢を、EmlisAIにも、華恋自身の作業にも通します。
