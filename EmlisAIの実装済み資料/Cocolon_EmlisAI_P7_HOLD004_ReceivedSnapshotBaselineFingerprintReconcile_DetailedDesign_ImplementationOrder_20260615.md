# Cocolon / EmlisAI P7-HOLD-004 受領snapshot baseline fingerprint reconcile 詳細設計書・実装順

作成日: 2026-06-15 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書  
対象: Cocolon / EmlisAI / P7 Product Quality Runner / Long-run Product Gate / P7-HOLD-004 / received snapshot baseline fingerprint reconcile / official group_02 capture前blocking rule  
基準検討メモ: `Cocolon_EmlisAI_P7_HOLD004_ReceivedSnapshotBaselineFingerprint_PreDesignMemo_20260615.md`  
基準ロードマップ: `Cocolon_EmlisAI_longterm_roadmap_20260608(16).md`  
基準ローカル受領zip: `Cocolon_前提資料(221).zip` / `EmlisAIの実装済み資料(64).zip` / `Cocolon(235).zip` / `mashos-api(148).zip`  
GitHub接続確認: Mash指定により不要。未実施。  
コード変更: なし。本書は設計書。  
RN変更: なし。  
backend実装変更: なし。  
DB変更: なし。  
API route / request key / public response top-level key変更: なし。  
Emlis本文runtime変更: なし。  
Gate runtime変更: なし。  
release判断変更: なし。  
JSON / schema実ファイル化: なし。本書内のJSON / schema案は、実装段階で既存material builder / 既存contract test / baseline更新方針との整合を見て採否判断する。  

---

## 0. この設計書の結論

今回の実装前に固定する結論は、次です。

```text
P7-HOLD-004は継続。
P8へ進まない。
P5/P6本文改善へ戻らない。
official group_02 captureへ進む前に、受領snapshotのbaseline fingerprint差分をbody-freeに分類する。
```

今回の設計対象は、既存R13〜R20のやり直しではありません。  
既存R13〜R20は、`mashos-api(147).zip` をsource_snapshot_refとする current baseline / group inventory / execution plan / matrix connection / official group_02 adoption rule を固定しました。

今回の受領zipは `mashos-api(148).zip` です。  
ローカルfull collect-onlyでは、件数とtest file fingerprintは既存materialと一致しましたが、test item fingerprintが一致しませんでした。

```text
既存active material:
  source_snapshot_ref: mashos-api(147).zip
  baseline_id: p7_hold004_backend_collect_baseline_20260615
  collected_test_file_count: 425
  collected_test_item_count: 2856
  warnings_count: 1
  test_items_fingerprint_sha256:
    fee1eca805564d0840dc5b23f60a7e2d6c7297d658a76dc4ce175e0137c261f1
  test_files_fingerprint_sha256:
    6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6

受領snapshot実測:
  received_zip_ref: mashos-api(148).zip
  collected_test_file_count: 425
  collected_test_item_count: 2856
  warnings_count: 1
  test_items_fingerprint_sha256:
    4698ce5240707f71fc3678a0153a15626ba9718fbadad83294e57d11946c2e0d
  test_files_fingerprint_sha256:
    6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6
```

この状態で、`group_02` のfull run結果をofficial扱いにしてはいけません。  
同じ425 files / 2856 testsでも、nodeid setのfingerprintが違うなら、どのbaselineに対する実行結果なのかが曖昧になるためです。

したがって、今回の設計は次の二段構えにします。

```text
必須実装範囲:
  R21〜R26
  - received_zip_ref と active source_snapshot_ref を分離する。
  - received collect fingerprint差分をbody-free material化する。
  - item fingerprint mismatch未分類の間、official group_02 captureをblockedにする。
  - matrix / release handoff / validation上も、P7-HOLD-004をopenのまま扱う。

条件付き実装範囲:
  R27〜R29
  - fingerprint差分のroot causeが分類され、採用条件を満たした場合だけ、active baseline更新へ進める。
  - active baseline更新時は、同一baseline_idで別fingerprintを黙って上書きしない。
  - group_02 full runがtimeoutする場合は、PASSではなくTIMEOUT materialとしてbody-freeに記録する。
```

最小実装では、`release_allowed` / `p7_complete` / `p8_start_allowed` / `hold004_close_allowed` / `full_backend_suite_green_confirmed` はすべてfalse固定です。

---

## 1. なぜこの作業を行うのか

P7は、EmlisAIの商品品質を継続測定できる状態にする工程です。  
ここで扱っているbackend suite baselineは、ユーザーに直接見える文章ではありません。  
それでも、ここを雑に扱うと、P7以降で「どの正本を通ったのか」を説明できなくなります。

Cocolonとして大切なのは、次です。

```text
読めていないものを、読めた扱いにしない。
確認していないものを、確認済み扱いにしない。
古い正本を、今の正本として扱わない。
subset greenを、full backend suite greenへ昇格しない。
```

EmlisAIは、ユーザーがCocolonへ置いた言葉を、ただの文字列ではなく「読まれた形」として返す入口です。  
その商品品質を測るP7で、baselineの同一性を曖昧にすると、Cocolon自身が「読めたふり」をしている状態になります。

今回の作業は、華やかな機能改善ではありません。  
でも、P7の測定正本を守るためには、official captureより先に必要です。

---

## 2. 指示整理

### 2.1 今回の指示

```text
検討メモを基に、実装順を含めた詳細な設計書を作成する。
mdで作成する。
必要ならjson / schema案を設計書内に入れる。
ただし、実ファイル化は実装段階で判断する。
```

### 2.2 今回の成果物

```text
Markdown詳細設計書。
```

### 2.3 今回してはいけないこと

```text
- コードを変更しない。
- backend test fileを追加しない。
- RN production codeを変更しない。
- API route / request key / public response top-level keyを変更しない。
- DB schema / write pathを変更しない。
- Emlis本文runtimeを変更しない。
- Gateを緩めない。
- fixed commentText / case専用surface / case専用modeを追加しない。
- group_02 collect-onlyをofficial greenへ変換しない。
- group_02未完了をgreen扱いしない。
- P7未完のままP8へ進めない。
- release_allowedをtrueにしない。
```

---

## 3. 参照・確認範囲

### 3.1 作業姿勢として確認した前提資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/03_forbidden_insufficient_premise_and_actual_file_check.txt
Cocolon_前提資料/work_attitude_rules_for_karen/04_forbidden_mixing_design_and_implementation.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/11_cocolon_area_specific_do_not_break.txt
Cocolon_前提資料/work_attitude_rules_for_karen/12_check_items_not_short_oath.txt
Cocolon_前提資料/work_attitude_rules_for_karen/13_forbidden_reasking_existing_design_and_design_term_escape.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/Cocolon_EmlisAI_UserLabelConnectionObservation_v1_Design_2026-06-03.md
```

### 3.2 主に確認したEmlisAI実装済み資料

```text
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_ProductQualityRunner_DetailedDesign_ImplementationOrder_20260612.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_RedHoldClosure_DetailedDesign_ImplementationOrder_20260613.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_RED003_BodyFreeLeakGuardRepair_DetailedDesign_ImplementationOrder_20260613.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_HOLD004_BackendSuiteSplit_MatrixConsistency_DetailedDesign_ImplementationOrder_20260614.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_HOLD004_CurrentSnapshotBaselineReconcile_DetailedDesign_ImplementationOrder_20260615.md
```

### 3.3 主に確認したbackend実装結果doc

```text
mashos-api/ai/docs/Cocolon_EmlisAI_P7_HOLD004_BackendSuiteSplit_MatrixConsistency_ImplementationResult_20260615.md
mashos-api/ai/docs/Cocolon_EmlisAI_P7_HOLD004_CurrentSnapshotBaselineReconcile_ImplementationResult_20260615.md
```

### 3.4 主に確認したbackend実ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_split_consistency.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_group_inventory_plan.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_execution_results.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_matrix_consistency_report.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_group_execution_minimal_order.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_current_snapshot_baseline_reconcile.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
```

---

## 4. 現状の整理

### 4.1 ロードマップ上の現在地

```text
現在Phase:
  P7 Product Quality Runner / Long-run Product Gate

継続HOLD:
  P7-HOLD-001: P5 human Blind QA未完
  P7-HOLD-002: P6 visible expansion boundary保持
  P7-HOLD-003: 実機submit / modal読感未確認
  P7-HOLD-004: full backend suite green未確認
```

P7は、Product Pass候補とRelease Readyを分ける工程です。  
P7で測定材料が整っても、それだけでrelease判断にはしません。

### 4.2 既存R13〜R20で固定済みのこと

```text
active collect baseline:
  baseline_id: p7_hold004_backend_collect_baseline_20260615
  source_snapshot_ref: mashos-api(147).zip
  collected_test_file_count: 425
  collected_test_item_count: 2856
  warnings_count: 1
  test_items_fingerprint_sha256:
    fee1eca805564d0840dc5b23f60a7e2d6c7297d658a76dc4ce175e0137c261f1
  test_files_fingerprint_sha256:
    6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6

group inventory:
  group_count: 13
  total_batch_count: 19
  total_group_file_count: 425
  total_group_test_item_count: 2856
  unassigned_test_file_count: 0
  duplicate_assignment_count: 0

group_02_p7_hold004:
  file_count: 19
  test_item_count: 252
  planned_batch_count: 1
  timeout_budget_sec: 120
```

### 4.3 受領snapshotで見えた差分

今回の `mashos-api(148).zip` では、full collect-onlyが次でした。

```text
status: passed
collected_test_file_count: 425
collected_test_item_count: 2856
warnings_count: 1

test_items_fingerprint_sha256:
  4698ce5240707f71fc3678a0153a15626ba9718fbadad83294e57d11946c2e0d

test_files_fingerprint_sha256:
  6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6
```

比較結果は次です。

| 比較項目 | 既存active | 受領snapshot | 判定 |
|---|---:|---:|---|
| test files | 425 | 425 | MATCH |
| test items | 2856 | 2856 | MATCH |
| warnings | 1 | 1 | MATCH |
| test files fingerprint | `686623...e9c6` | `686623...e9c6` | MATCH |
| test items fingerprint | `fee1ec...61f1` | `4698ce...2e0d` | MISMATCH |
| source snapshot | `mashos-api(147).zip` | `mashos-api(148).zip` | DIFFERENT |

この差分の読みは次です。

```text
- test file集合と件数は変わっていない可能性が高い。
- test item数も同じ。
- しかし、pytest nodeid setまたはnodeid表記が変わっている可能性がある。
- 既存baseline hashが古い可能性もある。
- pytest / plugin / Python versionによるnodeid表記差分の可能性も残る。
- 実テストsemantic差分の可能性も残る。
- どれかは未分類であり、現時点で断定しない。
```

### 4.4 group_02の現状

```text
group_02 collect-only:
  status: passed
  collected_test_file_count: 19
  collected_test_item_count: 252
  warnings_count: 1

existing official adoption rule:
  expected_group_file_count: 19
  expected_group_test_item_count: 252
  expected_warning_count: 1
  expected_timeout_budget_sec: 120
```

ただし、group_02 collect-onlyは実行greenではありません。  
また、今回ローカル枠でのgroup_02 full runは完了していないため、official group greenとして扱えません。

---

## 5. 設計原則

### 5.1 `source_snapshot_ref` と `received_zip_ref` を分ける

今回の重要な分離は次です。

```text
source_snapshot_ref:
  active materialが、どのsnapshotを正本として固定されたか。

received_zip_ref:
  今回の作業で受領したローカルzip名。
```

今回の状態は次です。

```text
active source_snapshot_ref:
  mashos-api(147).zip

received_zip_ref:
  mashos-api(148).zip
```

この2つが違うこと自体を不具合とは断定しません。  
ただし、同時にitem fingerprint差分があるため、official capture前にidentityを分けて記録する必要があります。

### 5.2 active baselineを黙って上書きしない

次は禁止します。

```text
- `p7_hold004_backend_collect_baseline_20260615` のまま、test item fingerprintだけを `4698...` へ差し替える。
- `source_snapshot_ref` を `mashos-api(148).zip` へ変えたのに、reconcile materialでprevious/current関係を残さない。
- item hash不一致を環境要因と断定してofficial captureへ進む。
```

active baselineを更新する場合は、少なくとも次のどちらかを必須にします。

```text
推奨A:
  baseline_id自体を更新する。
  例: p7_hold004_backend_collect_baseline_20260615_received_148

代替B:
  baseline_idを維持するなら、schema上のbaseline_revision_idを追加し、
  old fingerprint / new fingerprint / received_zip_ref / adoption decisionを同一materialで追跡可能にする。
```

華恋の推奨は **A: baseline_id更新** です。  
同じbaseline_idで別fingerprintを指すと、後から読む人が「同じ正本」と誤読する危険が高いためです。

### 5.3 nodeidはbodyではないが、terminal outputとして保持しない

pytest nodeidはユーザー入力本文ではありません。  
ただし、P7 materialのルールでは、terminal full output / stdout / stderr / traceback bodyを保持しない方針です。

そのため、materialには次のみを持たせます。

```text
許可:
  - counts
  - sha256 fingerprint
  - test file ref
  - group id
  - per-file test item count
  - per-file nodeid fingerprint
  - mismatch reason code
  - decision status

禁止:
  - full pytest collect output
  - stdout / stderr raw body
  - traceback body
  - 全nodeid一覧
  - comment_text body
  - candidate body
  - surface body
  - raw input / raw memo / history raw text
```

### 5.4 official group_02 captureの前提条件を増やす

既存R19のofficial group_02 adoption ruleは正しいです。  
ただし、今回の受領snapshot mismatchを見た後では、既存R19条件だけでは足りません。

既存R19条件に、次を前置きします。

```text
received_snapshot_baseline_fingerprint_reconciled == true
received_snapshot_item_fingerprint_mismatch_unresolved == false
active_baseline_accepts_received_collect_nodeids == true
source_snapshot_ref_current_for_received_zip == true
```

この前置きがfalseなら、group_02 runを実行してもofficial resultとして採用しません。

### 5.5 test追加がbaselineを動かすことを先に扱う

今回の実装で新しいtest fileやtest functionを追加すると、full backend collect baselineの `425 files / 2856 tests` 自体が変わります。  
baseline reconcileの実装で、baselineをさらに動かすのは危険です。

したがって、R21〜R26の推奨実装では次を守ります。

```text
- 新規test fileは追加しない。
- 新規test functionも追加しない。
- 既存P7-HOLD-004 test file内の既存test functionへassertを追加して検証する。
- 新規test functionが必要な場合は、R27以降のactive baseline更新と同じ修正単位にする。
```

これにより、R21〜R26の目的である「受領snapshot mismatchを分類してofficial captureを止める」を、collect baseline件数をさらに変えずに実装できます。

---

## 6. 推奨アーキテクチャ

### 6.1 全体flow

```text
existing active baseline material
  source_snapshot_ref=mashos-api(147).zip
  item_hash=fee1...
  file_hash=6866...

received snapshot collect summary
  received_zip_ref=mashos-api(148).zip
  item_hash=4698...
  file_hash=6866...

↓

R21-R24 Received Snapshot Baseline Fingerprint Reconcile
  - source identity separated
  - count/file/item comparison
  - mismatch status classified as unresolved
  - active update not allowed by default
  - official capture blocked

↓

R25 Official group_02 Capture Readiness Guard
  - existing R19 adoption rule remains
  - new guard blocks official run/result while mismatch unresolved

↓

R26 Matrix / Handoff / Validation connection
  - P7-HOLD-004 remains open
  - release_allowed=false
  - p7_complete=false
  - p8_start_allowed=false

↓ conditional only

R27 Active Baseline Adoption
  - repeated collect stable
  - source identity accepted
  - root cause classified
  - new baseline_id or revision id

↓ conditional only

R28 group_02 official capture / TIMEOUT policy
  - PASS may claim group green only
  - TIMEOUT is not green
  - batch split is separate design if needed
```

### 6.2 新規material候補

```text
P7ReceivedSnapshotCollectSummaryV1
  受領snapshotのcollect結果をbody-freeに要約する。

P7ReceivedSnapshotBaselineFingerprintReconcileV1
  active baselineと受領snapshotのcount / file hash / item hash / source identityを比較する。

P7ReceivedSnapshotBaselineAdoptionDecisionV1
  active baselineを更新してよいかを判定する。

P7OfficialGroup02CaptureReadinessV1
  R19 official group_02 adoption ruleへ進んでよいかを、received snapshot reconcile結果で前置き判定する。

P7Group02TimeoutClassificationPlanV1
  group_02 full runがtimeoutした場合に、greenではなくbody-free TIMEOUTとして記録する方針を固定する。
```

### 6.3 source file候補

```text
追加候補:
  mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_received_snapshot_baseline_fingerprint_reconcile.py

変更候補:
  mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_execution_results.py
  mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_matrix_consistency_report.py
  mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py
  mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
  mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py

条件付き変更候補:
  mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_split_consistency.py
  mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_group_inventory_plan.py
  mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_group_execution_minimal_order.py
```

条件付き変更候補は、R27でactive baselineを `mashos-api(148).zip` 正本へ更新する場合だけ触ります。

### 6.4 test file候補

R21〜R26では、新規test file / test functionを増やさないことを推奨します。

```text
変更候補:
  mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_collect_baseline_20260614.py
  mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_group_result_20260614.py
  mashos-api/ai/tests/test_emlis_ai_p7_hold004_backend_suite_matrix_connection_20260615.py
  mashos-api/ai/tests/test_emlis_ai_p7_hold004_release_validation_connection_20260615.py
  mashos-api/ai/tests/test_emlis_ai_p7_hold004_matrix_consistency_report_20260615.py
```

新規test fileを追加する場合は、full collect baseline件数が変わるため、同じ実装単位でactive baseline refreshを扱います。

---

## 7. 実装順詳細

## R21: received snapshot constants / scope freezeを追加する

目的:

```text
受領zip名と既存active source_snapshot_refを混同しないため、受領snapshot専用のmaterial builder入口を作る。
```

候補source:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_received_snapshot_baseline_fingerprint_reconcile.py
```

追加候補constants:

```python
P7_HOLD004_RECEIVED_SNAPSHOT_BASELINE_FINGERPRINT_RECONCILE_SCHEMA_VERSION = (
    "cocolon.emlis.p7.hold004.received_snapshot_baseline_fingerprint_reconcile.v1"
)
P7_HOLD004_RECEIVED_SNAPSHOT_BASELINE_FINGERPRINT_RECONCILE_STEP = (
    "P7-HOLD-004_ReceivedSnapshotBaselineFingerprintReconcile_R21_R26_20260615"
)
P7_HOLD004_RECEIVED_SNAPSHOT_BASELINE_FINGERPRINT_RECONCILE_ID = (
    "p7_hold004_received_snapshot_baseline_fingerprint_reconcile_20260615"
)
P7_HOLD004_RECEIVED_ZIP_REF = "mashos-api(148).zip"
P7_HOLD004_ACTIVE_SOURCE_SNAPSHOT_REF_AT_RECEIPT = "mashos-api(147).zip"
P7_HOLD004_RECEIVED_COLLECTED_TEST_FILE_COUNT = 425
P7_HOLD004_RECEIVED_COLLECTED_TEST_ITEM_COUNT = 2856
P7_HOLD004_RECEIVED_COLLECT_WARNINGS_COUNT = 1
P7_HOLD004_RECEIVED_TEST_ITEMS_FINGERPRINT_SHA256 = (
    "4698ce5240707f71fc3678a0153a15626ba9718fbadad83294e57d11946c2e0d"
)
P7_HOLD004_RECEIVED_TEST_FILES_FINGERPRINT_SHA256 = (
    "6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6"
)
```

実装内容:

```text
1. 新規moduleを追加する場合、public API / runtime / DB / RNへ接続しない。
2. existing active baselineはimportして読むだけにする。
3. received_zip_refをsource_snapshot_refへ即昇格しない。
4. release / P7 / P8 / full backend suite flagsはfalse固定にする。
5. body_free_markers / public_contract flagsを全falseで持つ。
```

完了条件:

```text
- 新規material builderがimportできる。
- `source_snapshot_ref` と `received_zip_ref` が別fieldとして出る。
- active baseline constantsはこのStepでは変更されていない。
- release_allowed=false / p7_complete=false / p8_start_allowed=false。
```

---

## R22: received collect summaryをbody-freeに作る

目的:

```text
受領snapshotのcollect結果を、nodeid一覧やterminal outputなしで記録する。
```

実装内容:

```text
1. 既存 `build_p7_hold004_backend_collect_summary_from_nodeids()` を再利用可能なら再利用する。
2. nodeidsを引数として受け取る場合でも、返すmaterialにはnodeids配列を入れない。
3. default materialでは、今回実測した 425 / 2856 / warnings 1 / item hash 4698... / file hash 6866... を持つ。
4. fingerprint_algorithmは既存R14と同一にする。
```

出力候補:

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.received_snapshot_collect_summary.v1",
  "phase": "P7_ProductQualityRunner_LongRunGate",
  "hold_id": "P7-HOLD-004",
  "received_zip_ref": "mashos-api(148).zip",
  "collect_command_id": "pytest_collect_only_backend_received_20260615",
  "collection_status": "COLLECTED",
  "collected_test_file_count": 425,
  "collected_test_item_count": 2856,
  "warnings_count": 1,
  "test_items_fingerprint_sha256": "4698ce5240707f71fc3678a0153a15626ba9718fbadad83294e57d11946c2e0d",
  "test_files_fingerprint_sha256": "6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6",
  "fingerprint_algorithm": "test_items=sha256(sorted_pytest_nodeids_joined_by_lf);test_files=sha256(ordered_unique_test_files_joined_by_lf)",
  "pytest_output_retained": false,
  "nodeids_retained": false,
  "body_free": true
}
```

完了条件:

```text
- count / fingerprint以外のterminal bodyを保持しない。
- `::test_` を含むnodeid一覧をmaterialに入れない。
- raw input / comment_text body / candidate body / surface bodyが入らない。
```

---

## R23: active baseline vs received snapshot fingerprint reconcile materialを作る

目的:

```text
active baselineと受領snapshotの差分を、原因断定せず分類可能な形にする。
```

実装内容:

```text
1. active baselineを既存builderから取得する。
2. received collect summaryと比較する。
3. count / file fingerprint / item fingerprint / source identityを別々に判定する。
4. 今回のdefault statusは `ITEM_FINGERPRINT_MISMATCH_UNCLASSIFIED` にする。
5. official captureはblockedにする。
6. active baseline更新はblockedにする。
```

比較field候補:

```text
comparison.counts_match: true
comparison.warning_count_match: true
comparison.test_files_fingerprint_match: true
comparison.test_items_fingerprint_match: false
comparison.source_snapshot_ref_matches_received_zip_ref: false
comparison.active_baseline_accepts_received_nodeids: false_or_not_evaluated
```

status候補:

```text
RECEIVED_SNAPSHOT_MATCHES_ACTIVE_BASELINE
ITEM_FINGERPRINT_MISMATCH_UNCLASSIFIED
SOURCE_SNAPSHOT_REF_DIFFERS_ITEM_HASH_MATCHES
COUNT_MISMATCH_BLOCKER
FILE_FINGERPRINT_MISMATCH_BLOCKER
COLLECTION_FAILED_BLOCKER
UNSTABLE_COLLECT_BLOCKER
```

今回のdefault:

```text
ITEM_FINGERPRINT_MISMATCH_UNCLASSIFIED
```

root cause classification候補:

```text
UNCLASSIFIED
BASELINE_CONSTANT_STALE
SOURCE_SNAPSHOT_REF_STALE
PYTEST_NODEID_FORMAT_CHANGED
PYTEST_PLUGIN_OR_ENVIRONMENT_CHANGED
TEST_NODEID_SET_CHANGED_WITH_SAME_COUNTS
TEST_SEMANTICS_CHANGED_WITHOUT_COUNT_DELTA
FINGERPRINT_ALGORITHM_MISMATCH
COLLECT_OUTPUT_PARSER_MISMATCH
```

完了条件:

```text
- 今回のdefault materialで item_fingerprint_match=false になる。
- root_cause_status=UNCLASSIFIED のまま active baseline updateを許可しない。
- official_group_02_capture_blocked=true。
- can_claim_group_green=false。
- full_backend_suite_green_confirmed=false。
- release_allowed=false。
```

---

## R24: source identity / adoption decisionを分離する

目的:

```text
受領zipをactive current baselineへ昇格してよい条件を、material上で明示する。
```

実装内容:

```text
1. `build_p7_hold004_received_snapshot_baseline_adoption_decision()` を追加する。
2. defaultでは adoption_status=BLOCKED_UNCLASSIFIED_ITEM_FINGERPRINT_MISMATCH にする。
3. active baseline replacementはfalseにする。
4. 採用可能な場合でも、release / P7 / P8 / full suite greenへ昇格しない。
```

adoption status候補:

```text
BLOCKED_UNCLASSIFIED_ITEM_FINGERPRINT_MISMATCH
BLOCKED_SOURCE_SNAPSHOT_IDENTITY_UNCLEAR
BLOCKED_UNSTABLE_REPEAT_COLLECT
REJECTED_COUNT_MISMATCH
REJECTED_FILE_FINGERPRINT_MISMATCH
REQUIRES_TEST_SEMANTICS_REVIEW
ADOPTABLE_AS_RECEIVED_SNAPSHOT_BASELINE_REFRESH
REFERENCE_ONLY_NO_ACTIVE_UPDATE
```

採用条件:

```text
1. full collect-onlyを同一環境で2回以上実行し、count / warning / item hash / file hashが安定している。
2. received_zip_refとsource_snapshot_refの関係をmaterial上で説明できる。
3. count / file fingerprintはactive baselineと一致、または差分が別baseline refreshとして説明されている。
4. item fingerprint差分のroot causeが `UNCLASSIFIED` ではない。
5. active baseline update時に、同一baseline_idで別fingerprintを黙って上書きしない。
6. group inventory / execution plan / matrix / release handoff / validationが同じbaseline idまたはrevision idを参照する。
7. public contract / DB / RN / Gate / Emlis本文runtimeを変更しない。
```

今回default decision:

```text
adoption_status: BLOCKED_UNCLASSIFIED_ITEM_FINGERPRINT_MISMATCH
active_baseline_update_allowed: false
official_group_02_capture_run_allowed: false
official_group_02_capture_result_recording_allowed: false
```

完了条件:

```text
- item fingerprint mismatch未分類ではactive baselineを更新できない。
- `mashos-api(148).zip` をsource_snapshot_refへ昇格しないまま、received_zip_refとして保持できる。
- 更新する場合の条件がmaterialで説明されている。
```

---

## R25: official group_02 capture readiness guardを追加する

目的:

```text
既存R19 adoption ruleの前に、received snapshot mismatch解消済みかを判定する。
```

候補source:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_execution_results.py
```

追加候補function:

```python
def build_p7_hold004_official_group02_capture_readiness(
    *,
    received_snapshot_reconcile: Mapping[str, Any] | None = None,
    adoption_decision: Mapping[str, Any] | None = None,
    adoption_rule: Mapping[str, Any] | None = None,
) -> dict[str, Any]:
    ...
```

readiness status候補:

```text
READY_FOR_OFFICIAL_CAPTURE_RUN
BLOCKED_BY_RECEIVED_SNAPSHOT_ITEM_FINGERPRINT_MISMATCH
BLOCKED_BY_RECEIVED_SNAPSHOT_SOURCE_IDENTITY_UNCLEAR
BLOCKED_BY_ACTIVE_BASELINE_NOT_RECEIVED_CURRENT
BLOCKED_BY_COLLECT_COUNT_MISMATCH
BLOCKED_BY_FILE_FINGERPRINT_MISMATCH
BLOCKED_BY_UNSTABLE_COLLECT
```

今回default:

```text
readiness_status:
  BLOCKED_BY_RECEIVED_SNAPSHOT_ITEM_FINGERPRINT_MISMATCH

official_capture_run_allowed:
  false

official_capture_result_recording_allowed:
  false
```

既存R19 adoption decisionとの関係:

```text
- R19 adoption ruleは残す。
- R19 adoption decisionだけでofficial capture可能とは扱わない。
- 新readiness guardがREADYになってから、R19のrun result adoptionへ進む。
```

完了条件:

```text
- received snapshot mismatch unresolvedなら、run_resultがPASS形でもofficial adoptionできない。
- group_02 collect-only 252 testsをgroup greenへ変換しない。
- PASS形のsynthetic materialでもfull_backend_suite_green_confirmed=false。
- release_allowed=false。
```

---

## R26: matrix / hold / release handoff / validationへblocking statusを接続する

目的:

```text
received snapshot mismatchが、backend internal materialだけで消えず、P7-HOLD-004の未解決理由として残るようにする。
```

候補source:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_matrix_consistency_report.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
```

接続方針:

```text
matrix_consistency_report:
  received_snapshot_item_fingerprint_mismatch_unresolved=true なら REVIEW_REQUIRED。

backend_suite_split_matrix:
  P7-HOLD-004 unresolved reasonに received_snapshot_collect_item_fingerprint_mismatch を追加。

r10_hold_matrix:
  P7-HOLD-004を継続。

release_handoff:
  release_allowed=false。
  release_blocker_refsに P7-HOLD-004 / received_snapshot_collect_item_fingerprint_mismatch を残す。

validation_matrix:
  P8 start false。
  full backend suite green false。
  official group_02 capture blockedをvalidation rowとして残す。
```

完了条件:

```text
- mismatchがmatrixでPASSに隠れない。
- release handoffがrelease_allowed=falseを維持する。
- validation matrixがP8 start falseを維持する。
- raw terminal output / raw nodeids / comment_text bodyを持たない。
```

---

## R27: active baseline adoptionは条件付きで実施する

目的:

```text
R21〜R26の結果、受領snapshotを新しいactive baselineとして採用してよいと分類された場合だけ、active baselineを更新する。
```

実施条件:

```text
- adoption_status == ADOPTABLE_AS_RECEIVED_SNAPSHOT_BASELINE_REFRESH
- root_cause_status != UNCLASSIFIED
- repeated_collect_stable == true
- received_zip_ref == mashos-api(148).zip
- source identity decisionがmaterialに残っている
- full collect summaryが 425 files / 2856 tests / warnings 1 / item hash 4698... / file hash 6866... で安定している
```

推奨active baseline更新:

```text
new active baseline id:
  p7_hold004_backend_collect_baseline_20260615_received_148

source_snapshot_ref:
  mashos-api(148).zip

collected_test_file_count:
  425

collected_test_item_count:
  2856

warnings_count:
  1

test_items_fingerprint_sha256:
  4698ce5240707f71fc3678a0153a15626ba9718fbadad83294e57d11946c2e0d

test_files_fingerprint_sha256:
  6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6
```

更新が必要になる候補:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_split_consistency.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_current_snapshot_baseline_reconcile.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_group_inventory_plan.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_execution_results.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_group_execution_minimal_order.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_matrix_consistency_report.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
```

注意:

```text
R27を実施すると、既存testのbaseline id / source_snapshot_ref / fingerprint assertionも更新が必要になる。
同一baseline_idのままfingerprintだけを更新するのは避ける。
ただし、実装段階で既存schema変更影響が大きすぎる場合は、baseline_revision_id追加案と比較する。
```

完了条件:

```text
- active baseline builderがreceived nodeids summaryをrejectしない。
- previous active baseline `p7_hold004_backend_collect_baseline_20260615` はprevious/legacyとして追跡可能。
- new active baseline id / source_snapshot_ref / fingerprintが全matrixで一致する。
- official group_02 captureは、まだ未実行ならgreen扱いしない。
```

---

## R28: group_02 timeout / long-run扱いを固定する

目的:

```text
group_02 full runが120秒または240秒枠で完了しない場合に、greenではなくTIMEOUT materialとして扱う。
```

実装内容:

```text
1. readiness guardがREADYになった後だけ、group_02 official capture runを実行対象にする。
2. 実行がtimeoutした場合、status=TIMEOUTのgroup run result materialを作る。
3. timeoutはFAILではないが、PASSでもない。
4. terminal output / stdout / stderr / traceback bodyを保存しない。
5. timeout materialはfirst redではなくtimeout classificationへ回す。
6. group_02 split再設計は別工程にする。
```

TIMEOUT material案:

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.backend_suite_group_run_result.v1",
  "hold_id": "P7-HOLD-004",
  "group_id": "group_02_p7_hold004",
  "batch_id": "group_02_p7_hold004_batch_01",
  "run_kind": "capture_run",
  "status": "TIMEOUT",
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
  "full_backend_suite_green_confirmed": false,
  "hold004_close_allowed": false,
  "p7_complete": false,
  "p8_start_allowed": false,
  "release_allowed": false,
  "terminal_output_retained": false,
  "stdout_retained": false,
  "stderr_retained": false,
  "raw_traceback_included": false,
  "body_free": true
}
```

完了条件:

```text
- TIMEOUTをgreen扱いしない。
- TIMEOUTを即FAILとも断定しない。
- timeout classification requiredとして次工程へ渡す。
- full backend suite green false維持。
```

---

## R29: 検証手順を固定する

目的:

```text
何をgreenと呼んでよいか、何をHOLD/blockedとして残すかを固定する。
```

### R21〜R26 mandatory scopeの検証

```bash
cd mashos-api/ai
python -m py_compile \
  services/ai_inference/emlis_ai_p7_hold004_received_snapshot_baseline_fingerprint_reconcile.py \
  services/ai_inference/emlis_ai_p7_hold004_backend_suite_execution_results.py \
  services/ai_inference/emlis_ai_p7_hold004_matrix_consistency_report.py \
  services/ai_inference/emlis_ai_p7_hold_matrix.py \
  services/ai_inference/emlis_ai_p7_release_handoff.py \
  services/ai_inference/emlis_ai_p7_validation_matrix.py
```

```bash
cd mashos-api/ai
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference pytest -q --tb=short -p pytest_asyncio.plugin \
  tests/test_emlis_ai_p7_hold004_backend_suite_collect_baseline_20260614.py \
  tests/test_emlis_ai_p7_hold004_backend_suite_group_result_20260614.py \
  tests/test_emlis_ai_p7_hold004_backend_suite_matrix_connection_20260615.py \
  tests/test_emlis_ai_p7_hold004_release_validation_connection_20260615.py \
  tests/test_emlis_ai_p7_hold004_matrix_consistency_report_20260615.py
```

期待:

```text
- target tests green。
- 新規test itemを増やしていない場合、full collect countは425 / 2856を維持。
- received snapshot materialはitem fingerprint mismatchを正しくblockedとして表す。
- official group_02 capture readinessはblocked。
- release_allowed=false。
```

### full collect-only確認

```bash
cd mashos-api/ai
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference \
  pytest --collect-only -q -p pytest_asyncio.plugin tests
```

R21〜R26のみの場合の読み:

```text
- 425 files / 2856 tests / warnings 1 を維持できているか確認する。
- item fingerprintは受領snapshot実測値 4698... になる。
- active baselineがまだfee1...なら、mismatchをblockedとして扱う。
```

R27まで実施した場合の読み:

```text
- active baselineが `mashos-api(148).zip` / 4698... へ更新されていることを確認する。
- builderへ実測nodeidsを渡してもrejectされないことを確認する。
- previous baselineが追跡可能なまま残っていることを確認する。
```

### group_02 collect-only確認

```bash
cd mashos-api/ai
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference \
  pytest --collect-only -q -p pytest_asyncio.plugin tests/test_emlis_ai_p7_hold004_*.py
```

期待:

```text
- 19 files / 252 tests / warnings 1。
- collect-onlyをofficial group greenへ変換しない。
```

### group_02 full run確認

実行は、readiness guardがREADYになった後だけです。

```bash
cd mashos-api/ai
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference \
  pytest -q --tb=short -p pytest_asyncio.plugin tests/test_emlis_ai_p7_hold004_*.py
```

読み:

```text
PASS:
  group_02 greenのみ。
  full backend suite greenではない。

FAIL:
  first_failure identifiersのみをbody-freeに記録。
  raw tracebackを保存しない。

TIMEOUT:
  timeout materialとして記録。
  green扱いしない。
```

---

## 8. JSON / schema案

ここに置くschemaは設計案です。  
実ファイル化は、実装段階で既存module構成・既存test count・baseline更新方針を見て判断します。

### 8.1 P7ReceivedSnapshotBaselineFingerprintReconcileV1 schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "P7ReceivedSnapshotBaselineFingerprintReconcileV1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "phase",
    "hold_id",
    "reconcile_id",
    "source_mode",
    "active_baseline",
    "received_snapshot",
    "comparison",
    "classification",
    "decision",
    "public_contract",
    "body_free_markers",
    "body_free",
    "full_backend_suite_green_confirmed",
    "hold004_close_allowed",
    "p7_complete",
    "p8_start_allowed",
    "release_allowed"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7.hold004.received_snapshot_baseline_fingerprint_reconcile.v1"
    },
    "phase": { "const": "P7_ProductQualityRunner_LongRunGate" },
    "hold_id": { "const": "P7-HOLD-004" },
    "reconcile_id": { "type": "string" },
    "source_mode": { "const": "local_snapshot" },
    "active_baseline": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "baseline_id",
        "source_snapshot_ref",
        "collected_test_file_count",
        "collected_test_item_count",
        "warnings_count",
        "test_items_fingerprint_sha256",
        "test_files_fingerprint_sha256"
      ],
      "properties": {
        "baseline_id": { "type": "string" },
        "source_snapshot_ref": { "type": "string" },
        "collected_test_file_count": { "type": "integer", "minimum": 0 },
        "collected_test_item_count": { "type": "integer", "minimum": 0 },
        "warnings_count": { "type": "integer", "minimum": 0 },
        "test_items_fingerprint_sha256": { "type": "string", "pattern": "^[0-9a-f]{64}$" },
        "test_files_fingerprint_sha256": { "type": "string", "pattern": "^[0-9a-f]{64}$" }
      }
    },
    "received_snapshot": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "received_zip_ref",
        "collected_test_file_count",
        "collected_test_item_count",
        "warnings_count",
        "test_items_fingerprint_sha256",
        "test_files_fingerprint_sha256",
        "pytest_output_retained",
        "nodeids_retained"
      ],
      "properties": {
        "received_zip_ref": { "type": "string" },
        "collected_test_file_count": { "type": "integer", "minimum": 0 },
        "collected_test_item_count": { "type": "integer", "minimum": 0 },
        "warnings_count": { "type": "integer", "minimum": 0 },
        "test_items_fingerprint_sha256": { "type": "string", "pattern": "^[0-9a-f]{64}$" },
        "test_files_fingerprint_sha256": { "type": "string", "pattern": "^[0-9a-f]{64}$" },
        "pytest_output_retained": { "const": false },
        "nodeids_retained": { "const": false }
      }
    },
    "comparison": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "counts_match",
        "warnings_match",
        "test_files_fingerprint_match",
        "test_items_fingerprint_match",
        "source_snapshot_ref_matches_received_zip_ref"
      ],
      "properties": {
        "counts_match": { "type": "boolean" },
        "warnings_match": { "type": "boolean" },
        "test_files_fingerprint_match": { "type": "boolean" },
        "test_items_fingerprint_match": { "type": "boolean" },
        "source_snapshot_ref_matches_received_zip_ref": { "type": "boolean" }
      }
    },
    "classification": {
      "type": "object",
      "additionalProperties": false,
      "required": ["status", "root_cause_status", "classification_required"],
      "properties": {
        "status": {
          "enum": [
            "RECEIVED_SNAPSHOT_MATCHES_ACTIVE_BASELINE",
            "ITEM_FINGERPRINT_MISMATCH_UNCLASSIFIED",
            "SOURCE_SNAPSHOT_REF_DIFFERS_ITEM_HASH_MATCHES",
            "COUNT_MISMATCH_BLOCKER",
            "FILE_FINGERPRINT_MISMATCH_BLOCKER",
            "COLLECTION_FAILED_BLOCKER",
            "UNSTABLE_COLLECT_BLOCKER"
          ]
        },
        "root_cause_status": {
          "enum": [
            "UNCLASSIFIED",
            "BASELINE_CONSTANT_STALE",
            "SOURCE_SNAPSHOT_REF_STALE",
            "PYTEST_NODEID_FORMAT_CHANGED",
            "PYTEST_PLUGIN_OR_ENVIRONMENT_CHANGED",
            "TEST_NODEID_SET_CHANGED_WITH_SAME_COUNTS",
            "TEST_SEMANTICS_CHANGED_WITHOUT_COUNT_DELTA",
            "FINGERPRINT_ALGORITHM_MISMATCH",
            "COLLECT_OUTPUT_PARSER_MISMATCH"
          ]
        },
        "classification_required": { "type": "boolean" }
      }
    },
    "decision": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "active_baseline_update_allowed",
        "official_group_02_capture_run_allowed",
        "official_group_02_capture_result_recording_allowed",
        "can_claim_group_green",
        "can_claim_full_backend_suite_green"
      ],
      "properties": {
        "active_baseline_update_allowed": { "type": "boolean" },
        "official_group_02_capture_run_allowed": { "type": "boolean" },
        "official_group_02_capture_result_recording_allowed": { "type": "boolean" },
        "can_claim_group_green": { "const": false },
        "can_claim_full_backend_suite_green": { "const": false }
      }
    },
    "public_contract": { "type": "object" },
    "body_free_markers": { "type": "object" },
    "body_free": { "const": true },
    "full_backend_suite_green_confirmed": { "const": false },
    "hold004_close_allowed": { "const": false },
    "p7_complete": { "const": false },
    "p8_start_allowed": { "const": false },
    "release_allowed": { "const": false }
  }
}
```

### 8.2 P7OfficialGroup02CaptureReadinessV1 material案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.official_group02_capture_readiness.v1",
  "phase": "P7_ProductQualityRunner_LongRunGate",
  "hold_id": "P7-HOLD-004",
  "readiness_id": "p7_hold004_group_02_official_capture_readiness_20260615",
  "received_reconcile_id": "p7_hold004_received_snapshot_baseline_fingerprint_reconcile_20260615",
  "adoption_rule_id": "p7_hold004_group_02_official_capture_adoption_rule_20260615",
  "readiness_status": "BLOCKED_BY_RECEIVED_SNAPSHOT_ITEM_FINGERPRINT_MISMATCH",
  "blocker_refs": [
    "received_snapshot_collect_item_fingerprint_mismatch",
    "source_snapshot_ref_identity_unclear"
  ],
  "group_id": "group_02_p7_hold004",
  "batch_id": "group_02_p7_hold004_batch_01",
  "expected_group_file_count": 19,
  "expected_group_test_item_count": 252,
  "expected_warning_count": 1,
  "official_capture_run_allowed": false,
  "official_capture_result_recording_allowed": false,
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
  "body_free": true
}
```

### 8.3 P7ReceivedSnapshotBaselineAdoptionDecisionV1 material案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.received_snapshot_baseline_adoption_decision.v1",
  "phase": "P7_ProductQualityRunner_LongRunGate",
  "hold_id": "P7-HOLD-004",
  "decision_id": "p7_hold004_received_snapshot_baseline_adoption_decision_20260615",
  "received_zip_ref": "mashos-api(148).zip",
  "active_baseline_id_at_receipt": "p7_hold004_backend_collect_baseline_20260615",
  "active_source_snapshot_ref_at_receipt": "mashos-api(147).zip",
  "candidate_new_baseline_id": "p7_hold004_backend_collect_baseline_20260615_received_148",
  "adoption_status": "BLOCKED_UNCLASSIFIED_ITEM_FINGERPRINT_MISMATCH",
  "root_cause_status": "UNCLASSIFIED",
  "required_evidence": {
    "repeat_collect_stability_required": true,
    "source_snapshot_identity_review_required": true,
    "test_semantics_review_required": true,
    "baseline_id_or_revision_update_required": true
  },
  "active_baseline_update_allowed": false,
  "source_snapshot_ref_update_allowed": false,
  "same_baseline_id_hash_replacement_allowed": false,
  "official_group_02_capture_blocked_until_adopted": true,
  "full_backend_suite_green_confirmed": false,
  "hold004_close_allowed": false,
  "p7_complete": false,
  "p8_start_allowed": false,
  "release_allowed": false,
  "body_free": true
}
```

### 8.4 P7Group02TimeoutClassificationPlanV1 material案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.group02_timeout_classification_plan.v1",
  "phase": "P7_ProductQualityRunner_LongRunGate",
  "hold_id": "P7-HOLD-004",
  "plan_id": "p7_hold004_group_02_timeout_classification_plan_20260615",
  "group_id": "group_02_p7_hold004",
  "batch_id": "group_02_p7_hold004_batch_01",
  "timeout_budget_sec": 120,
  "prior_local_attempts": {
    "attempt_120_sec_completed": false,
    "attempt_240_sec_completed": false,
    "official_green_confirmed": false
  },
  "timeout_result_policy": {
    "timeout_is_green": false,
    "timeout_is_immediate_fail": false,
    "timeout_classification_required": true,
    "batch_split_requires_new_design": true,
    "batch_green_is_group_green": false
  },
  "full_backend_suite_green_confirmed": false,
  "hold004_close_allowed": false,
  "p7_complete": false,
  "p8_start_allowed": false,
  "release_allowed": false,
  "terminal_output_retained": false,
  "stdout_retained": false,
  "stderr_retained": false,
  "raw_traceback_included": false,
  "body_free": true
}
```

---

## 9. rollback / fail-closed条件

### 9.1 rollback条件

実装段階で次が起きた場合、R21〜R26の範囲へ戻します。

```text
- 新規test追加によりfull collect baseline件数が意図せず変わった。
- received snapshot mismatchをmatrixがPASS扱いしてしまう。
- official group_02 capture readinessがblockedにならない。
- release_allowed / p7_complete / p8_start_allowed / hold004_close_allowed のいずれかがtrueになる。
- raw terminal output / stdout / stderr / traceback body / raw input / comment_text bodyがmaterialに入る。
- active baseline idを変えずにfingerprintだけが更新される。
```

### 9.2 fail-closed条件

次の場合、official captureへ進めず、material上はblockedにします。

```text
- count mismatch。
- file fingerprint mismatch。
- item fingerprint mismatchがUNCLASSIFIED。
- received_zip_refとsource_snapshot_refの関係が説明できない。
- repeat collectでfingerprintが揺れる。
- active baseline builderがreceived nodeids summaryをrejectする。
- group_02 collect-onlyが252ではない。
- group_02 full runがtimeoutしたのにPASS扱いされている。
```

fail-closed時の状態:

```text
full_backend_suite_green_confirmed=false
hold004_close_allowed=false
p7_complete=false
p8_start_allowed=false
release_allowed=false
official_capture_run_allowed=false
official_capture_result_recording_allowed=false
```

---

## 10. 完了条件

### 10.1 R21〜R26 mandatory scopeの完了条件

```text
- received_zip_ref=mashos-api(148).zip がsource_snapshot_refとは別fieldで保持される。
- active source_snapshot_ref=mashos-api(147).zip を黙って上書きしていない。
- full collect count 425 / 2856 / warning 1 をbody-freeに記録できる。
- file fingerprint match / item fingerprint mismatchを別々に判定できる。
- item fingerprint mismatch未分類ではactive baseline update_allowed=false。
- official group_02 capture readinessがblockedになる。
- group_02 collect-only 252 testsをofficial greenにしない。
- matrix / release / validationがP7-HOLD-004 openを維持する。
- release_allowed=false。
- p7_complete=false。
- p8_start_allowed=false。
- full_backend_suite_green_confirmed=false。
- hold004_close_allowed=false。
- body-free contractが維持される。
```

### 10.2 R27 conditional scopeの完了条件

```text
- adoption_statusがADOPTABLE_AS_RECEIVED_SNAPSHOT_BASELINE_REFRESHになっている。
- repeat collect stabilityがmaterialで確認されている。
- source identity decisionがmaterialで確認されている。
- new baseline idまたはbaseline_revision_idでfingerprint差分が追跡可能。
- `mashos-api(148).zip` と item fingerprint 4698... がactive currentとして全matrixへ接続される。
- previous active baselineが消えずに履歴として残る。
- group_02 official captureは、まだ実行していなければgreenではない。
```

### 10.3 R28 conditional scopeの完了条件

```text
- group_02 full run PASS時はgroup greenのみ。
- TIMEOUT時はTIMEOUT material。
- FAIL時はfirst failure identifiersのみ。
- terminal output / traceback bodyを保持しない。
- full backend suite greenへ昇格しない。
```

---

## 11. 書かれていない / 推測禁止

### 書かれていない

```text
- `mashos-api(148).zip` をactive source_snapshot_refへ即昇格してよいこと。
- `4698...` をactive baseline hashへ即採用してよいこと。
- `p7_hold004_backend_collect_baseline_20260615` のまま別hashへ上書きしてよいこと。
- group_02 collect-only 252 testsをofficial group greenへ変換してよいこと。
- group_02 full run未完了をgreen扱いしてよいこと。
- R21〜R26完了でP7-HOLD-004を閉じてよいこと。
- P8へ進めてよいこと。
- release_allowedをtrueにしてよいこと。
```

### 推測禁止

```text
- item fingerprint mismatchを環境要因と断定しない。
- item fingerprint mismatchを実装regressionと断定しない。
- source_snapshot_ref差分だけを理由に不具合断定しない。
- source_snapshot_ref差分だけを理由に無害断定しない。
- target subset greenをfull backend suite greenへ昇格しない。
- collect-onlyをexecution greenへ変換しない。
- PASS形synthetic materialをofficial run resultとして扱わない。
- timeoutをgreenとして扱わない。
- body-free materialへraw bodyを入れない。
```

---

## 12. 今回の設計で触らないもの

```text
RN:
  Cocolon/screens/InputScreen.js
  Cocolon/screens/input/useInputFeedbackModal.js
  Cocolon/screens/input/inputFeedbackModel.js
  Cocolon/screens/input/InputFeedbackReplyModal.js
  Cocolon/tests/rn-screen-contracts.test.js

backend production runtime:
  emotion_submit_service.py
  api_emotion_submit.py
  emlis_ai_reply_service.py
  Emlis本文composer / surface / gate系runtime

DB:
  schema / migration / write path / physical name

API contract:
  route
  request key
  public response top-level key
  input_feedback.comment_text visible contract

product scope:
  P5/P6本文改善
  User Label Connection surface強化
  Structure Insight横展開
  P8 user model / dictionary
  release decision true化
```

---

## 13. 確認済み / 未確認 / 次に実行すべきこと

確認済み:

```text
- 現在地はP7 Product Quality Runner / Long-run Product Gate。
- P7-HOLD-004は継続。
- active baselineはsource_snapshot_ref=mashos-api(147).zip。
- 受領zipはmashos-api(148).zip。
- full collect-onlyは425 files / 2856 tests / warnings 1。
- test files fingerprintはactive materialと一致。
- test items fingerprintはactive materialと不一致。
- group_02 collect-onlyは19 files / 252 tests / warnings 1。
- group_02 official greenは未確認。
- release_allowed / p7_complete / p8_start_allowedはfalse維持。
```

未確認:

```text
- item fingerprint mismatchのroot cause。
- `mashos-api(148).zip` と `mashos-api(147).zip` のsnapshot identity関係。
- pytest / plugin / Python version由来のnodeid差分か。
- 実テストsemantic差分か。
- repeated collectでitem hashが安定するか。
- group_02 full runがofficial条件下で完了するか。
- full backend suite execution green。
- 実機submit / modal読感。
- P5 human Blind QA。
- P6 visible expansion外部読感。
```

次に実行すべきこと:

```text
1. R21〜R26を最小実装として行う。
2. 新規test file / test functionを増やさず、既存test functionへassert追加する方針を優先する。
3. received snapshot mismatchをbody-free material化する。
4. official group_02 capture readinessをblockedにする。
5. R21〜R26の結果で採用条件が満たされた場合だけ、R27 active baseline adoptionへ進む。
6. group_02 full runは、readiness guardがREADYになるまでofficial扱いしない。
```

---

## 14. 華恋の判断

この設計で一番守るべきことは、`4698...` へ早く更新することではありません。  
守るべきことは、**どのsnapshotを、どのbaselineとして、どの実行結果へ接続しているのかを、後から壊れず読めるようにすること**です。

Cocolonは、ユーザーの言葉を雑に処理しない場所で在るべきです。  
そのCocolonのEmlisAI品質を測るP7で、baselineを雑に扱うことはできません。

だから今回の設計では、group_02 official captureへ急ぎません。  
まず、受領snapshotのidentityとitem fingerprint mismatchを止めて、body-freeに分類します。

この順番が、Cocolonとして在るべき姿に一番合っています。
