# Cocolon / EmlisAI P7-HOLD-004 Active Baseline Adoption Evidence / Runtime Builder Refresh 詳細設計書・実装順

作成日: 2026-06-16 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書  
対象: Cocolon / EmlisAI / P7 Product Quality Runner / Long-run Product Gate / P7-HOLD-004 / Active Baseline Adoption Evidence / Runtime Builder Refresh  
基準検討メモ: `Cocolon_EmlisAI_P7_HOLD004_ActiveBaselineAdoption_PreDesignMemo_20260616.md`  
基準ロードマップ: `Cocolon_EmlisAI_longterm_roadmap_20260608(17).md`  
基準ローカル受領zip: `Cocolon_前提資料(226).zip` / `EmlisAIの実装済み資料(65).zip` / `Cocolon(238).zip` / `mashos-api(151).zip`  
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

今回の詳細設計で進めるべき対象は、**P7-HOLD-004 Active Baseline Adoption Evidence / Runtime Builder Refresh** です。

結論を短く固定すると、次です。

```text
P7-HOLD-004はまだ閉じない。
P8へ進まない。
Emlis本文runtimeへ戻らない。
まず、received snapshot側で安定している 4698... fingerprint を、active baselineへ採用してよい証拠としてbody-freeに固定する。
そのうえで、採用が許可された場合だけ、P7-HOLD-004系のruntime material buildersへ新active baselineを接続する。
ただし、runtime builder refresh後も group_02 official capture / full backend suite execution / release / P8 は別判定として残す。
```

今回の実装設計は、`4698...` を雑に上書きする設計ではありません。  
目的は、次の三つを分離することです。

```text
1. 受領snapshotのcollect結果が、現在ローカルで再現していること。
2. そのcollect結果を、active baselineへ採用してよい証拠が揃っていること。
3. 採用後のP7 material buildersが、同じactive baseline正本を読むこと。
```

この三つを分けないと、P7の測定正本が揺れます。  
測定正本が揺れたままP8や本文改善へ進むと、Cocolonとして「何を直して、何が壊れていないのか」を説明できません。

---

## 1. なぜこの作業を行うのか

Cocolonは、ユーザーが残した言葉を、ただの文字列として処理せず、入力直後に「読まれた形」として返す体験を目指しています。  
EmlisAIはその入口です。

P7-HOLD-004は、直接ユーザーへ表示されるEmlis本文を変える作業ではありません。  
しかし、P7はEmlisAIの商品品質を継続測定する工程です。ここでbaselineが曖昧になると、以後のEmlis本文改善・履歴線強化・Structure Insight評価が、どの正本に対して成立しているのか分からなくなります。

今回守るべき姿勢は次です。

```text
見ていないものを、見たと言わない。
通っていないものを、greenと言わない。
collect-onlyをexecution greenへ変換しない。
subset greenをfull backend suite greenへ変換しない。
古いactive baselineを、現在の正本として黙って使い続けない。
同一baseline_idのまま、fingerprintだけを上書きしない。
```

これはbackend suite整理の話に見えますが、Cocolon思想と同じです。  
ユーザーの言葉を雑に読まないために、開発側の測定材料も雑に読まない、という作業です。

---

## 2. 指示整理

### 2.1 今回の指示

```text
前回の検討メモを基に、実装順を含めた詳細設計書を作成する。
mdで作成する。
必要なら、実装に使うjson / schema案も設計書内に入れる。
ただし、json / schemaの実ファイル化は実装段階で判断する。
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
- API route / request key / public response top-level keyを変更しない。
- DB schema / write path / physical nameを変更しない。
- Emlis本文runtimeを変更しない。
- Gateを緩めない。
- fixed commentText / case専用surface / case専用modeを追加しない。
- release_allowedをtrueにしない。
- p7_completeをtrueにしない。
- p8_start_allowedをtrueにしない。
- hold004_close_allowedをtrueにしない。
- group_02 collect-onlyをofficial group greenへ変換しない。
- group_02 PASSをfull backend suite greenへ変換しない。
```

---

## 3. 参照・確認範囲

### 3.1 作業姿勢として確認した前提資料

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
```

### 3.2 主に確認したEmlisAI実装済み資料

```text
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_ProductQualityRunner_DetailedDesign_ImplementationOrder_20260612.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_RedHoldClosure_DetailedDesign_ImplementationOrder_20260613.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_HOLD004_BackendSuiteSplit_MatrixConsistency_DetailedDesign_ImplementationOrder_20260614.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_HOLD004_CurrentSnapshotBaselineReconcile_DetailedDesign_ImplementationOrder_20260615.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_HOLD004_ReceivedSnapshotBaselineFingerprintReconcile_DetailedDesign_ImplementationOrder_20260615.md
```

### 3.3 主に確認したbackend実ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_split_consistency.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_current_snapshot_baseline_reconcile.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_received_snapshot_baseline_fingerprint_reconcile.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_group_inventory_plan.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_execution_results.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_matrix_consistency_report.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_group_execution_minimal_order.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
```

### 3.4 前回検討メモで固定されたローカル確認結果

```text
target subset:
  85 passed

full backend collect-only:
  files: 425
  tests: 2856
  warnings: 1
  test_items_fingerprint_sha256:
    4698ce5240707f71fc3678a0153a15626ba9718fbadad83294e57d11946c2e0d
  test_files_fingerprint_sha256:
    6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6

repeat collect:
  2回連続で同じ件数・warning数・fingerprint

group_02 collect-only:
  files: 19
  tests: 252
  warnings: 1
```

読み方:

```text
- 4698... は今回ローカルsnapshotで再現している。
- 4698... はreceived snapshot material側のitem fingerprintと一致する。
- 4698... は現active baseline material側の fee1... とは一致しない。
- これはcollect-onlyであり、execution greenではない。
- group_02 collect-onlyはofficial group greenではない。
```

---

## 4. ロードマップ上の現在地

現在地は、P7です。

```text
P7: Product Quality Runner / Long-run Product Gate
目的: 商品品質を継続測定する。
完了判定: long-run candidate / release decision material。
```

P8は、Personal Continuity / Derived User Model の工程です。  
ただし、P7-HOLD-004が未解決で、P7-HOLD-001〜003も残っているため、今回P8へは進みません。

現時点のHOLDは次です。

```text
P7-HOLD-001: P5 human Blind QA未完
P7-HOLD-002: P6 visible expansion boundary保持
P7-HOLD-003: 実機submit / modal読感未確認
P7-HOLD-004: full backend suite green未確認
```

今回扱うのは、P7-HOLD-004のうち、次の範囲です。

```text
Active Baseline Adoption Evidence
Runtime Builder Refresh
Official group_02 capture readiness再判定
```

今回扱わないものは次です。

```text
P5 human Blind QA
P6 visible expansion外部読感
RN実機submit / modal読感
full backend suite execution green
release判断
P8 user dictionary / derived model
```

---

## 5. 現行実装の読み方

### 5.1 active baseline at receipt

現行のactive baseline materialは、次の正本を保持しています。

```text
baseline_id:
  p7_hold004_backend_collect_baseline_20260615
source_snapshot_ref:
  mashos-api(147).zip
collected_test_file_count:
  425
collected_test_item_count:
  2856
warnings_count:
  1
test_items_fingerprint_sha256:
  fee1eca805564d0840dc5b23f60a7e2d6c7297d658a76dc4ce175e0137c261f1
test_files_fingerprint_sha256:
  6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6
```

### 5.2 received snapshot material

現行のreceived snapshot materialは、次の正本を保持しています。

```text
received_zip_ref:
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

### 5.3 現行比較結果

```text
file_count_match: true
item_count_match: true
warning_count_match: true
test_files_fingerprint_match: true
test_items_fingerprint_match: false
source_snapshot_ref_matches_received_zip_ref: false
active_baseline_accepts_received_nodeids: false
```

現行分類は次です。

```text
classification.status:
  ITEM_FINGERPRINT_MISMATCH_UNCLASSIFIED
classification.root_cause_status:
  UNCLASSIFIED
received_snapshot_baseline_fingerprint_reconciled:
  false
received_snapshot_item_fingerprint_mismatch_unresolved:
  true
official_group_02_capture_blocked:
  true
```

### 5.4 R29の読み方

R29は、verification procedureを固定しています。  
ただし、R29はactive baseline refreshを実行していません。

```text
r29_applies_active_baseline_refresh: false
active_baseline_update_applied_to_runtime_builders: false
source_snapshot_ref_updated_in_active_builders: false
r29_closes_hold004: false
release_allowed_after_r29: false
```

したがって、R29が存在することを、active baseline adoption成立やHOLD-004 closureと読んではいけません。

---

## 6. 今回の設計方針

### 6.1 設計の中心

今回の設計は、次の流れにします。

```text
R30: local repeat collect evidenceをbody-freeに固定する。
R31: source identity decisionを分離する。
R32: root cause reviewを、断定ではなく採用条件として固定する。
R33: test semantics reviewを、nodeid本文なしで扱う。
R34: adoption evidence bundleを作り、既存R27/R29へ接続する。
R35: post-adoption active baseline materialを作る。
R36: runtime builder refresh方針を固定する。
R37: runtime builders / matrix / release handoff / validationへ接続する。
R38: official group_02 capture readinessを再判定する。
R39: group_02 official capture result recording方針を固定する。
R40: full backend suite execution gateへ接続する。
```

### 6.2 設計の不変条件

すべてのR30〜R40で、次を不変条件にします。

```text
release_allowed: false
p7_complete: false
p8_start_allowed: false
hold004_close_allowed: false
full_backend_suite_green_confirmed: false
can_claim_full_backend_suite_green: false
collect_only_is_not_execution_green: true
subset_green_is_not_full_backend_suite_green: true
same_baseline_id_hash_replacement_allowed: false
raw input / comment_text / candidate body / surface body / pytest nodeid list / terminal output / stdout / stderr / traceback body retained: false
```

### 6.3 active baseline refreshの考え方

active baselineを更新する場合でも、次を守ります。

```text
- `p7_hold004_backend_collect_baseline_20260615` のhashだけを 4698... に上書きしない。
- 新baseline idまたはrevision idを使う。
- previous active baselineとして fee1... を保持する。
- source_snapshot_refは、実装段階でsource identity decisionが通ったrefだけを採用する。
- 今回のローカル添付名 `mashos-api(151).zip` を、資料根拠なしにruntime source_snapshot_refへ昇格しない。
```

候補baselineは次です。

```text
previous active:
  baseline_id: p7_hold004_backend_collect_baseline_20260615
  source_snapshot_ref: mashos-api(147).zip
  item hash: fee1eca805564d0840dc5b23f60a7e2d6c7297d658a76dc4ce175e0137c261f1
  file hash: 6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6

candidate active:
  baseline_id: p7_hold004_backend_collect_baseline_20260615_received_148
  source_snapshot_ref: mashos-api(148).zip
  item hash: 4698ce5240707f71fc3678a0153a15626ba9718fbadad83294e57d11946c2e0d
  file hash: 6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6
```

### 6.4 root causeの扱い

今回のローカル確認で言えることは、次です。

```text
- 現ローカルcollect結果は 4698... で安定している。
- received snapshot materialも 4698... を持っている。
- active baseline materialは fee1... のまま。
```

ただし、これだけで「semantic差分なし」と断定しません。  
old active baseline側のnodeid listがbody-free materialとして保持されていないため、`NO_TEST_SEMANTIC_CHANGE_DETECTED` を安易に選ぶのは危険です。

そのため、採用時のtest semantics outcome候補は、原則として次を優先します。

```text
TEST_SEMANTIC_CHANGE_ACCEPTED_AS_BASELINE_REFRESH
```

`NO_TEST_SEMANTIC_CHANGE_DETECTED` は、old / received のnodeid差分をbody-freeに説明できる材料がある場合だけ使います。

---

## 7. 実装対象ファイル案

### 7.1 新規追加候補

実装段階で必要性を再判断しますが、設計上の候補は次です。

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_active_baseline_adoption_evidence.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_active_baseline_runtime_builder_refresh.py
```

役割:

```text
active_baseline_adoption_evidence.py:
  R30〜R34
  - local repeat collect evidence
  - source identity decision
  - root cause review
  - test semantics review
  - adoption evidence bundle

active_baseline_runtime_builder_refresh.py:
  R35〜R38
  - post-adoption baseline material
  - active baseline refresh application plan
  - runtime builder refresh status
  - post-refresh official group_02 readiness projection
```

### 7.2 既存変更候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_split_consistency.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_received_snapshot_baseline_fingerprint_reconcile.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_group_inventory_plan.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_backend_suite_execution_results.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_matrix_consistency_report.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_group_execution_minimal_order.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
```

変更方針:

```text
- historical R21〜R29 materialを後から書き換えない。
- at receipt constantsをlive active baseline constantsから切り離す。
- runtime builder refresh後のactive baselineは、新idで参照する。
- matrix / release handoff / validationに、refresh applied状態を伝播する。
- release / P8 / HOLD closureはfalseのまま維持する。
```

### 7.3 test追加・更新候補

```text
mashos-api/ai/tests/test_emlis_ai_p7_hold004_active_baseline_adoption_evidence_20260616.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_active_baseline_runtime_builder_refresh_20260616.py

更新候補:
  tests/test_emlis_ai_p7_hold004_backend_suite_collect_baseline_20260614.py
  tests/test_emlis_ai_p7_hold004_backend_suite_group_inventory_20260614.py
  tests/test_emlis_ai_p7_hold004_backend_suite_execution_summary_20260614.py
  tests/test_emlis_ai_p7_hold004_backend_suite_matrix_connection_20260615.py
  tests/test_emlis_ai_p7_hold004_release_validation_connection_20260615.py
  tests/test_emlis_ai_p7_hold004_matrix_consistency_report_20260615.py
```

---

## 8. 実装順

## R30: Local Repeat Collect Evidence Freeze

### 目的

今回ローカルで確認したfull backend collect-onlyの再現性を、body-free materialとして固定します。

```text
files: 425
tests: 2856
warnings: 1
item fingerprint: 4698ce5240707f71fc3678a0153a15626ba9718fbadad83294e57d11946c2e0d
file fingerprint: 6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6
repeat collect run count: 2
```

### 実装対象候補

```text
emlis_ai_p7_hold004_active_baseline_adoption_evidence.py
```

### builder案

```python
def build_p7_hold004_local_repeat_collect_evidence(...) -> dict[str, Any]:
    ...

def assert_p7_hold004_local_repeat_collect_evidence_contract(material: Mapping[str, Any]) -> bool:
    ...
```

### material要件

```text
- nodeid listを保持しない。
- pytest terminal outputを保持しない。
- stdout / stderr / traceback bodyを保持しない。
- collect-onlyをexecution green扱いしない。
- 151.zipをsource_snapshot_refへ昇格しない。
```

### 成功条件

```text
repeat_collect_evidence.satisfied == true
counts_warnings_fingerprints_stable == true
received_collect_matches_recorded_default == true
body_free == true
release_allowed == false
```

### 失敗条件

```text
- repeat_collect_run_count < 2
- いずれかのfingerprintがreceived materialと不一致
- nodeids_retained == true
- pytest_output_retained == true
- release_allowed == true
```

---

## R31: Source Identity Decision Boundary

### 目的

`active source_snapshot_ref`、`received_zip_ref`、今回のローカル添付名を混同しないようにします。

```text
active_source_snapshot_ref_at_receipt: mashos-api(147).zip
received_zip_ref_in_material: mashos-api(148).zip
local_attachment_ref_observed: mashos-api(151).zip
```

今回の設計では、`mashos-api(151).zip` をruntime source_snapshot_refへ昇格しません。  
151は「今回のローカル作業で確認した添付名」であり、既存material上のcanonical received refは148です。

### builder案

```python
def build_p7_hold004_source_identity_decision(...) -> dict[str, Any]:
    ...

def assert_p7_hold004_source_identity_decision_contract(material: Mapping[str, Any]) -> bool:
    ...
```

### decision案

```text
source_identity_status:
  RECEIVED_REF_ACCEPTED_AS_CANONICAL_REFRESH_CANDIDATE_ATTACHMENT_ALIAS_NOT_PROMOTED

canonical_received_snapshot_ref:
  mashos-api(148).zip

local_attachment_alias:
  mashos-api(151).zip

local_attachment_promoted_to_source_snapshot_ref:
  false
```

### 成功条件

```text
source_identity_decision_recorded == true
source_identity_accepted == true
canonical_received_snapshot_ref == mashos-api(148).zip
candidate_source_snapshot_ref == mashos-api(148).zip
local_attachment_promoted_to_source_snapshot_ref == false
source_snapshot_ref_update_allowed_by_identity == true
```

### 失敗条件

```text
- local_attachment_refだけを理由に source_snapshot_ref=mashos-api(151).zip にする。
- received_zip_refとactive_source_snapshot_refを同一扱いする。
- source_identity_unclearのままadoption readyにする。
```

---

## R32: Root Cause Review Material

### 目的

`fee1...` と `4698...` のitem fingerprint差分を、未分類のままactive baselineへ採用しないようにします。

### root cause候補

既存R21〜R29のroot cause enumを踏襲します。

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

### 華恋の設計判断

今回の採用候補としては、`BASELINE_CONSTANT_STALE` が最も自然です。  
理由は、現ローカルcollectがreceived materialの `4698...` と一致し、active baseline materialだけが `fee1...` のまま残っているためです。

ただし、これは設計上の候補であり、実装段階では次の条件を満たした場合だけ、root causeとして確定します。

```text
- repeat collectが2回以上安定している。
- counts / warnings / test_files_fingerprint がactive / received間で一致している。
- received materialのitem fingerprintと現ローカルcollectが一致している。
- fingerprint algorithmが一致している。
- parser mismatchを示す材料がない。
- old active baselineを同一baseline_idのまま上書きしない計画がある。
```

### builder案

```python
def build_p7_hold004_item_fingerprint_root_cause_review(...) -> dict[str, Any]:
    ...

def assert_p7_hold004_item_fingerprint_root_cause_review_contract(material: Mapping[str, Any]) -> bool:
    ...
```

### 成功条件

```text
root_cause_review_recorded == true
root_cause_status != UNCLASSIFIED
root_cause_status in allowed statuses
root_cause_overclaim_absent == true
release_allowed == false
```

### 失敗条件

```text
- UNCLASSIFIEDのままsatisfiedにする。
- semantic差分なしを根拠なしに断定する。
- 環境要因と断定する。
- implementation regressionと断定する。
```

---

## R33: Test Semantics Review Boundary

### 目的

item fingerprint差分を、テスト意味差分なしと雑に断定せず、baseline refreshとして受け入れてよいかをbody-freeに残します。

### 重要判断

old active baseline側のnodeid listは、body-free方針により保持されていません。  
そのため、今回の設計では、原則として次を使います。

```text
preferred outcome:
  TEST_SEMANTIC_CHANGE_ACCEPTED_AS_BASELINE_REFRESH
```

次は、旧/新nodeid差分をbody-freeに説明できる場合だけ許可します。

```text
optional outcome:
  NO_TEST_SEMANTIC_CHANGE_DETECTED
```

### builder案

```python
def build_p7_hold004_test_semantics_review(...) -> dict[str, Any]:
    ...

def assert_p7_hold004_test_semantics_review_contract(material: Mapping[str, Any]) -> bool:
    ...
```

### material要件

```text
- test bodyを保持しない。
- nodeid listを保持しない。
- pytest outputを保持しない。
- semantic no-changeを無根拠に主張しない。
- accepted_as_baseline_refreshの場合、その理由をbody-free identifiersで残す。
```

### 成功条件

```text
test_semantics_reviewed == true
test_semantics_review_outcome in {
  TEST_SEMANTIC_CHANGE_ACCEPTED_AS_BASELINE_REFRESH,
  NO_TEST_SEMANTIC_CHANGE_DETECTED
}
nodeids_retained == false
pytest_output_retained == false
```

### 失敗条件

```text
- NOT_REVIEWEDのままadoption readyにする。
- test body / nodeid list / terminal outputをmaterialへ保持する。
- `NO_TEST_SEMANTIC_CHANGE_DETECTED` を、旧nodeid根拠なしに使う。
```

---

## R34: Adoption Evidence Bundle / R27 Connection

### 目的

R30〜R33の証拠を束ね、既存の `build_p7_hold004_received_snapshot_adoption_evidence_freeze` へ安全に接続します。

### builder案

```python
def build_p7_hold004_active_baseline_adoption_evidence_bundle(...) -> dict[str, Any]:
    ...

def assert_p7_hold004_active_baseline_adoption_evidence_bundle_contract(material: Mapping[str, Any]) -> bool:
    ...
```

### 既存R27への入力案

```python
adoption_evidence_ready = build_p7_hold004_received_snapshot_adoption_evidence_freeze(
    received_snapshot_reconcile=received_reconcile,
    repeat_collect_run_count=2,
    repeat_collect_counts_warnings_fingerprints_match=True,
    root_cause_status="BASELINE_CONSTANT_STALE",
    root_cause_review_recorded=True,
    source_identity_decision_recorded=True,
    source_identity_accepted=True,
    test_semantics_reviewed=True,
    test_semantics_review_outcome="TEST_SEMANTIC_CHANGE_ACCEPTED_AS_BASELINE_REFRESH",
    baseline_id_or_revision_update_planned=True,
    runtime_builder_update_plan_recorded=True,
    matrix_handoff_update_plan_recorded=True,
)
```

### 成功条件

```text
adoption_evidence_freeze_satisfied == true
can_mark_r27_conditions_satisfied == true
adoption_status_if_applied_to_r27 == ADOPTABLE_AS_RECEIVED_SNAPSHOT_BASELINE_REFRESH
active_baseline_update_allowed == false  # evidence freeze自体ではまだ更新しない
release_allowed == false
```

### 失敗条件

```text
- manual booleanだけでR27条件を満たした扱いにする。
- adoption_evidence_freeze_satisfiedなしにactive_baseline_update_allowedをtrueにする。
- R34でruntime buildersを書き換える。
```

---

## R35: Conditional Active Baseline Adoption Gate

### 目的

既存R27のconditional adoption materialを、R34のevidence bundle経由でreadyにします。  
この段階で初めて、active baseline updateを実装してよい入口を作ります。

### 既存builder接続案

```python
conditional_adoption = build_p7_hold004_received_snapshot_conditional_active_baseline_adoption(
    received_snapshot_reconcile=received_reconcile,
    adoption_decision=received_adoption,
    adoption_evidence_freeze=adoption_evidence_ready,
)
```

### 成功条件

```text
adoption_status == ADOPTABLE_AS_RECEIVED_SNAPSHOT_BASELINE_REFRESH
active_baseline_adoption_ready == true
active_baseline_update_allowed == true
source_snapshot_ref_update_allowed == true
same_baseline_id_hash_replacement_allowed == false
active_baseline_update_applied_to_runtime_builders == false
source_snapshot_ref_updated_in_active_builders == false
official_group_02_capture_run_allowed == false
release_allowed == false
```

### 失敗条件

```text
- adoption_evidence_freezeなしにreadyになる。
- active_baseline_update_applied_to_runtime_buildersをR35でtrueにする。
- official group_02 captureをR35でready扱いにする。
- release_allowedをtrueにする。
```

---

## R36: Post-Adoption Active Baseline Material

### 目的

新active baselineを、historical R21〜R29を書き換えずに、post-adoption materialとして固定します。

### 重要境界

`emlis_ai_p7_hold004_received_snapshot_baseline_fingerprint_reconcile.py` のR21〜R29は、**at receiptの履歴material**として残します。  
active baseline更新後に、R23の過去比較が「最初から一致していた」ように見えてはいけません。

そのため、実装段階では次を必ず分けます。

```text
historical active at receipt:
  p7_hold004_backend_collect_baseline_20260615 / mashos-api(147).zip / fee1...

post-adoption active:
  p7_hold004_backend_collect_baseline_20260615_received_148 / mashos-api(148).zip / 4698...
```

### builder案

```python
def build_p7_hold004_post_adoption_active_baseline_material(...) -> dict[str, Any]:
    ...

def build_p7_hold004_post_adoption_received_snapshot_reconcile(...) -> dict[str, Any]:
    ...

def assert_p7_hold004_post_adoption_active_baseline_material_contract(material: Mapping[str, Any]) -> bool:
    ...

def assert_p7_hold004_post_adoption_received_snapshot_reconcile_contract(material: Mapping[str, Any]) -> bool:
    ...
```

### post-adoption reconcileの期待値

```text
received_snapshot_baseline_fingerprint_reconciled: true
received_snapshot_item_fingerprint_mismatch_unresolved: false
source_snapshot_ref_current_for_received_zip: true
active_baseline_accepts_received_nodeids: true
test_items_fingerprint_match: true
test_files_fingerprint_match: true
counts_match: true
warning_count_match: true
```

### 不変条件

```text
full_backend_suite_green_confirmed: false
hold004_close_allowed: false
p7_complete: false
p8_start_allowed: false
release_allowed: false
```

### 失敗条件

```text
- historical R21〜R29のmaterialを緑に書き換える。
- previous active baselineを消す。
- same baseline idのhashだけを変更する。
```

---

## R37: Runtime Builder Refresh

### 目的

P7-HOLD-004系のruntime material buildersが、post-adoption active baselineを同じ正本として読むようにします。

ここでいうruntime builderは、Emlis本文runtimeではありません。  
P7の測定materialを生成するbuilder群を指します。

### refresh対象候補

```text
emlis_ai_p7_hold004_backend_suite_split_consistency.py
emlis_ai_p7_hold004_backend_suite_group_inventory_plan.py
emlis_ai_p7_hold004_backend_suite_execution_results.py
emlis_ai_p7_hold004_group_execution_minimal_order.py
emlis_ai_p7_hold_matrix.py
emlis_ai_p7_release_handoff.py
emlis_ai_p7_validation_matrix.py
emlis_ai_p7_hold004_matrix_consistency_report.py
```

### 実装方針案

実装段階では、次のどちらかを選びます。

#### 案A: active baseline constantsを新idへ更新する

```python
P7_HOLD004_PREVIOUS_ACTIVE_COLLECT_BASELINE_ID = "p7_hold004_backend_collect_baseline_20260615"
P7_HOLD004_PREVIOUS_ACTIVE_SOURCE_SNAPSHOT_REF = "mashos-api(147).zip"
P7_HOLD004_PREVIOUS_ACTIVE_TEST_ITEMS_FINGERPRINT_SHA256 = "fee1..."

P7_HOLD004_BACKEND_COLLECT_BASELINE_ID = "p7_hold004_backend_collect_baseline_20260615_received_148"
P7_HOLD004_BACKEND_SOURCE_SNAPSHOT_REF = "mashos-api(148).zip"
P7_HOLD004_BACKEND_TEST_ITEMS_SHA256 = "4698..."
P7_HOLD004_BACKEND_TEST_FILES_SHA256 = "6866..."
P7_HOLD004_BACKEND_ACTIVE_BASELINE_REFRESH_APPLIED = True
```

長所:

```text
- 既存builderがactive baseline constantsを読むだけで新正本へ揃う。
- matrix / release / validationの接続が単純。
```

注意:

```text
- historical R21〜R29がlive constantsからactive_at_receiptを読んでいる場合、過去materialが書き換わる。
- 実装前に、received snapshot module内のat receipt constantsを固定値へ切り離す必要がある。
```

#### 案B: active baseline registry/providerを追加する

```python
def build_p7_hold004_active_collect_baseline_registry() -> dict[str, Any]:
    return {
        "active_baseline": candidate,
        "previous_active_baseline": previous,
        "active_baseline_refresh_applied": True,
    }
```

長所:

```text
- historical constantsを書き換えずに済む。
- old / newの履歴が読みやすい。
```

注意:

```text
- downstream builders側の参照変更が増える。
- 既存test更新範囲が広がる可能性がある。
```

### 華恋の推奨

華恋としては、**案A + at receipt constantsの先行固定**が良いと判断します。

理由:

```text
- active baselineの正本を複数経路にしない方が安全。
- 既存builder群はすでに `P7_HOLD004_BACKEND_COLLECT_BASELINE_ID` を中心に接続されている。
- ただし、R21〜R29の履歴が書き換わらないよう、received snapshot module内のat receipt constantsは先に固定値へ切り離す必要がある。
```

### 成功条件

```text
active_baseline_update_applied_to_runtime_builders == true
source_snapshot_ref_updated_in_active_builders == true
current_collect_baseline_connected == true
backend_suite_execution_summary_collect_baseline_id == p7_hold004_backend_collect_baseline_20260615_received_148
received_snapshot_item_fingerprint_mismatch_unresolved == false
release_allowed == false
```

---

## R38: Matrix / Release Handoff / Validation Connection Refresh

### 目的

runtime builder refresh後、matrix / release handoff / validation matrixが同じactive baseline状態を読めるようにします。

### 対象

```text
emlis_ai_p7_hold_matrix.py
emlis_ai_p7_release_handoff.py
emlis_ai_p7_validation_matrix.py
emlis_ai_p7_hold004_matrix_consistency_report.py
```

### 追加・伝播するfield案

```text
active_baseline_refresh_schema_version
active_baseline_refresh_id
previous_active_baseline_id
current_active_baseline_id
active_baseline_refresh_applied_to_runtime_builders
source_snapshot_ref_updated_in_active_builders
received_snapshot_baseline_fingerprint_reconciled
received_snapshot_item_fingerprint_mismatch_unresolved
post_adoption_received_snapshot_reconcile_id
```

### 成功条件

```text
- matrix consistency reportで、received snapshot blocking statusがresolved扱いになる。
- release handoffで、received_snapshot_item_fingerprint_mismatch_unresolved == false になる。
- validation matrixで、active baseline refresh appliedがtrueとして伝播する。
- ただし release_allowed / p7_complete / p8_start_allowed / hold004_close_allowed はfalse。
```

### 失敗条件

```text
- matrixだけ新baseline、release handoffだけ旧baselineを読む。
- received snapshot resolvedをfull backend suite greenに変換する。
- release decision layerでrelease_allowedをtrueにする。
```

---

## R39: Official group_02 Capture Readiness Re-evaluation

### 目的

active baseline refresh後、group_02 full runをofficial captureとして実行してよいかを再判定します。

### 注意

ここで「ready」になるのは、**official capture runを行ってよい**という意味です。  
group_02 greenではありません。

### builder更新案

既存の `build_p7_hold004_official_group02_capture_readiness` は、現状ではR23 received snapshot reconcileを前提にしています。  
refresh後は、次のどちらかにする必要があります。

```text
案A:
  post_adoption_received_snapshot_reconcileを受け取れるように、readiness builder / contractを拡張する。

案B:
  new builder `build_p7_hold004_official_group02_capture_readiness_after_active_baseline_refresh` を追加する。
```

華恋の推奨は案Aです。  
理由は、official group_02 readinessという概念を二重化しない方が安全だからです。  
ただし、R23 historical reconcile contractを壊さないよう、schema versionの受け取りは明示的に分岐します。

### 成功条件

```text
readiness_status == READY_FOR_OFFICIAL_CAPTURE_RUN
official_capture_run_allowed == true
official_capture_result_recording_allowed == true
official_group_02_capture_blocked == false
can_claim_group_green == false
can_claim_full_backend_suite_green == false
full_backend_suite_green_confirmed == false
release_allowed == false
```

### 失敗条件

```text
- readiness readyをgroup greenとして扱う。
- group_02 PASS前にofficial_group_02_capture_green_confirmedをtrueにする。
- group_02 readyをfull backend suite greenとして扱う。
```

---

## R40: Official group_02 Result Recording / Full Backend Suite Gate

### 目的

R39でreadyになった後、実装段階または検証段階でgroup_02 full runを行った場合に、結果をbody-freeで記録する方針を固定します。

### result status候補

```text
NOT_RUN
PASSED_ISOLATED
FAILED_ISOLATED
TIMEOUT_ISOLATED
PARTIAL_OR_INTERRUPTED
```

### group_02 PASS時の扱い

```text
official_group_02_capture_recorded: true
official_group_02_capture_green_confirmed: true
can_claim_group_green: true
can_claim_full_backend_suite_green: false
full_backend_suite_green_confirmed: false
hold004_close_allowed: false
release_allowed: false
```

### group_02 FAIL時の扱い

```text
official_group_02_capture_recorded: true
official_group_02_capture_green_confirmed: false
failed_group_ids: ["group_02_p7_hold004"]
first_failure_identifiers: body-free identifiers only
stdout_retained: false
stderr_retained: false
raw_traceback_included: false
release_allowed: false
```

### group_02 TIMEOUT時の扱い

```text
official_group_02_capture_recorded: true
timeout_group_ids: ["group_02_p7_hold004"]
timeout_is_green: false
timeout_is_immediate_fail: false
long_run_probe_required: true
release_allowed: false
```

### full backend suite green条件

P7-HOLD-004を閉じる方向へ進めるには、group_02だけでは不足です。  
最低限、次が必要です。

```text
- 全backend groupがofficial条件下で実行済み。
- すべてのgroupがPASS。
- TIMEOUT / FAILED / NOT_RUN / PARTIALがない。
- collect baseline idがpost-adoption active baselineと一致。
- matrix / release / validationが同じ結果を読んでいる。
- body-free result materialがcontractに通っている。
```

---

## 9. JSON / schema案

この章のJSON / schema案は、設計書内の案です。  
実ファイル化は実装段階で判断します。

### 9.1 Local Repeat Collect Evidence schema案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.local_repeat_collect_evidence.v1",
  "phase": "P7",
  "hold_id": "P7-HOLD-004",
  "evidence_id": "p7_hold004_local_repeat_collect_evidence_20260616",
  "source_mode": "local_snapshot",
  "canonical_received_snapshot_ref": "mashos-api(148).zip",
  "local_attachment_ref_observed": "mashos-api(151).zip",
  "local_attachment_promoted_to_source_snapshot_ref": false,
  "collect_scope": "full_backend_collect_only",
  "collect_run_count": 2,
  "expected": {
    "collected_test_file_count": 425,
    "collected_test_item_count": 2856,
    "warnings_count": 1,
    "test_items_fingerprint_sha256": "4698ce5240707f71fc3678a0153a15626ba9718fbadad83294e57d11946c2e0d",
    "test_files_fingerprint_sha256": "6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6"
  },
  "observed": {
    "run_1_matches_expected": true,
    "run_2_matches_expected": true,
    "counts_warnings_fingerprints_stable": true
  },
  "satisfied": true,
  "collect_only_is_not_execution_green": true,
  "nodeids_retained": false,
  "pytest_output_retained": false,
  "stdout_retained": false,
  "stderr_retained": false,
  "raw_traceback_included": false,
  "body_free": true,
  "release_allowed": false
}
```

### 9.2 Source Identity Decision schema案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.source_identity_decision.v1",
  "phase": "P7",
  "hold_id": "P7-HOLD-004",
  "decision_id": "p7_hold004_source_identity_decision_20260616",
  "active_source_snapshot_ref_at_receipt": "mashos-api(147).zip",
  "canonical_received_snapshot_ref": "mashos-api(148).zip",
  "local_attachment_ref_observed": "mashos-api(151).zip",
  "candidate_source_snapshot_ref": "mashos-api(148).zip",
  "source_identity_status": "RECEIVED_REF_ACCEPTED_AS_CANONICAL_REFRESH_CANDIDATE_ATTACHMENT_ALIAS_NOT_PROMOTED",
  "source_identity_decision_recorded": true,
  "source_identity_accepted": true,
  "active_source_snapshot_ref_is_not_received_ref_at_receipt": true,
  "local_attachment_promoted_to_source_snapshot_ref": false,
  "received_zip_promoted_to_source_snapshot_ref_before_adoption": false,
  "source_snapshot_ref_update_allowed_by_identity": true,
  "body_free": true,
  "release_allowed": false
}
```

### 9.3 Root Cause Review schema案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.item_fingerprint_root_cause_review.v1",
  "phase": "P7",
  "hold_id": "P7-HOLD-004",
  "review_id": "p7_hold004_item_fingerprint_root_cause_review_20260616",
  "active_item_fingerprint_sha256_at_receipt": "fee1eca805564d0840dc5b23f60a7e2d6c7297d658a76dc4ce175e0137c261f1",
  "received_item_fingerprint_sha256": "4698ce5240707f71fc3678a0153a15626ba9718fbadad83294e57d11946c2e0d",
  "file_fingerprint_match": true,
  "counts_match": true,
  "warnings_match": true,
  "repeat_collect_stable": true,
  "root_cause_status": "BASELINE_CONSTANT_STALE",
  "root_cause_review_recorded": true,
  "root_cause_overclaim_absent": true,
  "unclassified": false,
  "satisfied": true,
  "body_free": true,
  "release_allowed": false
}
```

### 9.4 Test Semantics Review schema案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.test_semantics_review.v1",
  "phase": "P7",
  "hold_id": "P7-HOLD-004",
  "review_id": "p7_hold004_test_semantics_review_20260616",
  "test_semantics_reviewed": true,
  "test_semantics_review_outcome": "TEST_SEMANTIC_CHANGE_ACCEPTED_AS_BASELINE_REFRESH",
  "no_semantic_change_claimed": false,
  "accepted_as_baseline_refresh": true,
  "old_nodeid_list_available": false,
  "nodeids_retained": false,
  "pytest_output_retained": false,
  "test_body_retained": false,
  "raw_traceback_included": false,
  "satisfied": true,
  "body_free": true,
  "release_allowed": false
}
```

### 9.5 Adoption Evidence Bundle schema案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.active_baseline_adoption_evidence_bundle.v1",
  "phase": "P7",
  "hold_id": "P7-HOLD-004",
  "bundle_id": "p7_hold004_active_baseline_adoption_evidence_bundle_20260616",
  "local_repeat_collect_evidence_id": "p7_hold004_local_repeat_collect_evidence_20260616",
  "source_identity_decision_id": "p7_hold004_source_identity_decision_20260616",
  "root_cause_review_id": "p7_hold004_item_fingerprint_root_cause_review_20260616",
  "test_semantics_review_id": "p7_hold004_test_semantics_review_20260616",
  "candidate_active_baseline": {
    "baseline_id": "p7_hold004_backend_collect_baseline_20260615_received_148",
    "source_snapshot_ref": "mashos-api(148).zip",
    "collected_test_file_count": 425,
    "collected_test_item_count": 2856,
    "warnings_count": 1,
    "test_items_fingerprint_sha256": "4698ce5240707f71fc3678a0153a15626ba9718fbadad83294e57d11946c2e0d",
    "test_files_fingerprint_sha256": "6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6"
  },
  "previous_active_baseline_retained": true,
  "same_baseline_id_hash_replacement_allowed": false,
  "runtime_builder_update_plan_recorded": true,
  "matrix_handoff_update_plan_recorded": true,
  "can_mark_r27_conditions_satisfied": true,
  "active_baseline_update_allowed_by_evidence": false,
  "body_free": true,
  "release_allowed": false
}
```

### 9.6 Post-Adoption Active Baseline schema案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.post_adoption_active_baseline.v1",
  "phase": "P7",
  "hold_id": "P7-HOLD-004",
  "active_baseline_refresh_id": "p7_hold004_active_baseline_refresh_20260616",
  "adoption_evidence_bundle_id": "p7_hold004_active_baseline_adoption_evidence_bundle_20260616",
  "previous_active_baseline": {
    "baseline_id": "p7_hold004_backend_collect_baseline_20260615",
    "source_snapshot_ref": "mashos-api(147).zip",
    "test_items_fingerprint_sha256": "fee1eca805564d0840dc5b23f60a7e2d6c7297d658a76dc4ce175e0137c261f1",
    "test_files_fingerprint_sha256": "6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6"
  },
  "current_active_baseline": {
    "baseline_id": "p7_hold004_backend_collect_baseline_20260615_received_148",
    "source_snapshot_ref": "mashos-api(148).zip",
    "test_items_fingerprint_sha256": "4698ce5240707f71fc3678a0153a15626ba9718fbadad83294e57d11946c2e0d",
    "test_files_fingerprint_sha256": "6866231daf68427dca2de1b2011feea49450f7b4a8b3c5b9dec0f9ccd5f3e9c6"
  },
  "same_baseline_id_hash_replacement_allowed": false,
  "previous_active_baseline_retained": true,
  "active_baseline_refresh_applied": true,
  "body_free": true,
  "release_allowed": false
}
```

### 9.7 Runtime Builder Refresh Status schema案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.runtime_builder_refresh_status.v1",
  "phase": "P7",
  "hold_id": "P7-HOLD-004",
  "refresh_status_id": "p7_hold004_runtime_builder_refresh_status_20260616",
  "current_active_baseline_id": "p7_hold004_backend_collect_baseline_20260615_received_148",
  "previous_active_baseline_id": "p7_hold004_backend_collect_baseline_20260615",
  "active_baseline_update_applied_to_runtime_builders": true,
  "source_snapshot_ref_updated_in_active_builders": true,
  "updated_builder_refs": [
    "backend_suite_split_consistency",
    "backend_suite_group_inventory_plan",
    "backend_suite_execution_results",
    "group_execution_minimal_order",
    "hold_matrix",
    "release_handoff",
    "validation_matrix",
    "matrix_consistency_report"
  ],
  "received_snapshot_baseline_fingerprint_reconciled": true,
  "received_snapshot_item_fingerprint_mismatch_unresolved": false,
  "official_group_02_capture_run_allowed": false,
  "can_claim_group_green": false,
  "can_claim_full_backend_suite_green": false,
  "full_backend_suite_green_confirmed": false,
  "hold004_close_allowed": false,
  "p7_complete": false,
  "p8_start_allowed": false,
  "release_allowed": false,
  "body_free": true
}
```

### 9.8 Official group_02 Readiness After Refresh schema案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.official_group02_capture_readiness.v2",
  "phase": "P7",
  "hold_id": "P7-HOLD-004",
  "readiness_id": "p7_hold004_official_group02_capture_readiness_20260616",
  "active_baseline_refresh_status_id": "p7_hold004_runtime_builder_refresh_status_20260616",
  "readiness_status": "READY_FOR_OFFICIAL_CAPTURE_RUN",
  "received_snapshot_baseline_fingerprint_reconciled": true,
  "received_snapshot_item_fingerprint_mismatch_unresolved": false,
  "source_snapshot_ref_current_for_received_zip": true,
  "active_baseline_accepts_received_nodeids": true,
  "group_id": "group_02_p7_hold004",
  "expected_group_file_count": 19,
  "expected_group_test_item_count": 252,
  "expected_warning_count": 1,
  "official_capture_run_allowed": true,
  "official_capture_result_recording_allowed": true,
  "official_group_02_capture_blocked": false,
  "official_group_02_capture_green_confirmed": false,
  "can_claim_group_green": false,
  "can_claim_full_backend_suite_green": false,
  "full_backend_suite_green_confirmed": false,
  "hold004_close_allowed": false,
  "release_allowed": false,
  "body_free": true
}
```

---

## 10. contract test設計

### 10.1 新規test file候補

```text
tests/test_emlis_ai_p7_hold004_active_baseline_adoption_evidence_20260616.py
tests/test_emlis_ai_p7_hold004_active_baseline_runtime_builder_refresh_20260616.py
```

### 10.2 adoption evidence test観点

```text
- R30 local repeat collect evidenceが 425 / 2856 / warning 1 / 4698... / 6866... を保持する。
- repeat_collect_run_count < 2 はsatisfiedにならない。
- warnings_count不一致はsatisfiedにならない。
- nodeids_retained=true はcontract error。
- pytest_output_retained=true はcontract error。
- source_identityで local attachment 151 をsource_snapshot_refへ昇格するとcontract error。
- root_cause_status=UNCLASSIFIED のままsatisfiedにするとcontract error。
- test_semantics_review_outcome=NOT_REVIEWED のままsatisfiedにするとcontract error。
- adoption evidence bundleはR27条件を満たせるが、それ自体ではactive_baseline_update_allowed=false。
- manual boolean onlyでconditional adoptionをreadyにしようとするとblocked。
```

### 10.3 runtime builder refresh test観点

```text
- historical active at receiptは fee1... / mashos-api(147).zip のまま残る。
- current active baselineは 4698... / mashos-api(148).zip / new baseline idへ変わる。
- same baseline id hash replacementは禁止。
- runtime buildersが同じcurrent_active_baseline_idを読む。
- matrix / release / validationへ active_baseline_refresh_applied_to_runtime_builders=true が伝播する。
- received_snapshot_item_fingerprint_mismatch_unresolved=false が伝播する。
- release_allowed / p7_complete / p8_start_allowed / hold004_close_allowed はfalseのまま。
- official group_02 readinessはreadyになっても group green / full backend greenを主張しない。
```

### 10.4 negative test必須観点

```text
- R29 materialだけでactive baseline refresh appliedをtrueにするとerror。
- adoption evidence freezeなしでactive baseline updateをtrueにするとerror。
- same baseline idでitem hashだけ変更するとerror。
- `mashos-api(151).zip` をruntime source_snapshot_refにするとerror。
- collect-onlyをexecution greenにするとerror。
- group_02 collect-onlyをgroup greenにするとerror。
- group_02 PASSをfull backend suite greenにするとerror。
- release_allowed=trueにするとerror。
- p8_start_allowed=trueにするとerror。
- public response key added / DB schema changed / Gate relaxed / fixed template added がtrueならerror。
```

---

## 11. 実装時の検証コマンド案

設計段階では実行しません。  
実装段階での候補として固定します。

### 11.1 py_compile

```bash
cd mashos-api/ai
python -m py_compile \
  services/ai_inference/emlis_ai_p7_hold004_active_baseline_adoption_evidence.py \
  services/ai_inference/emlis_ai_p7_hold004_active_baseline_runtime_builder_refresh.py \
  services/ai_inference/emlis_ai_p7_hold004_received_snapshot_baseline_fingerprint_reconcile.py \
  services/ai_inference/emlis_ai_p7_hold004_backend_suite_split_consistency.py \
  services/ai_inference/emlis_ai_p7_hold004_backend_suite_group_inventory_plan.py \
  services/ai_inference/emlis_ai_p7_hold004_backend_suite_execution_results.py \
  services/ai_inference/emlis_ai_p7_hold004_matrix_consistency_report.py \
  services/ai_inference/emlis_ai_p7_hold_matrix.py \
  services/ai_inference/emlis_ai_p7_release_handoff.py \
  services/ai_inference/emlis_ai_p7_validation_matrix.py
```

### 11.2 target contract subset

```bash
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference pytest -q --tb=short -p pytest_asyncio.plugin \
  tests/test_emlis_ai_p7_hold004_active_baseline_adoption_evidence_20260616.py \
  tests/test_emlis_ai_p7_hold004_active_baseline_runtime_builder_refresh_20260616.py \
  tests/test_emlis_ai_p7_hold004_backend_suite_collect_baseline_20260614.py \
  tests/test_emlis_ai_p7_hold004_backend_suite_group_inventory_20260614.py \
  tests/test_emlis_ai_p7_hold004_backend_suite_execution_summary_20260614.py \
  tests/test_emlis_ai_p7_hold004_backend_suite_matrix_connection_20260615.py \
  tests/test_emlis_ai_p7_hold004_release_validation_connection_20260615.py \
  tests/test_emlis_ai_p7_hold004_matrix_consistency_report_20260615.py
```

### 11.3 collect-only再確認

```bash
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference \
  pytest --collect-only -q -p pytest_asyncio.plugin tests
```

期待値:

```text
files: 425以上になる可能性あり
items: 2856以上になる可能性あり
warnings: 1想定だが、test追加によりfingerprintは変わり得る
```

注意:

```text
R30で固定した4698...は、受領snapshot時点のfingerprintです。
実装段階でtest fileを追加すれば、現在のfull collect fingerprintは変わります。
その場合は「受領snapshot baseline」と「実装後current test suite」を混同しないため、実装後collect baselineを別materialで扱う必要があります。
```

### 11.4 group_02 collect-only

```bash
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference \
  pytest --collect-only -q -p pytest_asyncio.plugin tests/test_emlis_ai_p7_hold004_*.py
```

注意:

```text
group_02 collect-onlyは、official group greenではありません。
```

### 11.5 group_02 official full run

R39でreadinessがREADYになった後に限り、実行候補になります。

```bash
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference \
  pytest -q --tb=short -p pytest_asyncio.plugin tests/test_emlis_ai_p7_hold004_*.py
```

注意:

```text
- 設計段階では実行しない。
- readiness READY前に実行してもofficial capture扱いにしない。
- PASSしてもgroup_02 greenのみ。
- full backend suite greenではない。
- TIMEOUTはgreenではない。
```

---

## 12. 実装後に作成する可能性がある実装結果doc

実装段階で必要であれば、次のmdを作成します。

```text
mashos-api/ai/docs/Cocolon_EmlisAI_P7_HOLD004_ActiveBaselineAdoptionEvidence_RuntimeBuilderRefresh_ImplementationResult_20260616.md
```

内容候補:

```text
- 実装したR30〜R40の範囲
- 変更ファイル一覧
- 追加test一覧
- py_compile結果
- target subset結果
- collect-only結果
- group_02 readiness状態
- 未確認範囲
- P7-HOLD-004 closure未成立の理由
- 次に実行すべきofficial group_02 / full backend suite方針
```

ただし、今回の設計書作成段階では、実装結果docも作成しません。

---

## 13. リスクと対策

### 13.1 リスク: historical materialを書き換えてしまう

危険:

```text
R21〜R29が、最初からactive baseline一致だったように見える。
```

対策:

```text
- at receipt constantsをlive active baseline constantsから切り離す。
- post-adoption materialを新schemaとして分ける。
- historical R23 contractは過去のmismatchを保持する。
```

### 13.2 リスク: 151.zipをsource_snapshot_refへ昇格する

危険:

```text
資料上のreceived_zip_refは148なのに、添付名だけで151を正本にしてしまう。
```

対策:

```text
- local_attachment_ref_observed と canonical_received_snapshot_ref を分ける。
- `local_attachment_promoted_to_source_snapshot_ref=false` をcontract化する。
```

### 13.3 リスク: test追加でcollect fingerprintが変わる

危険:

```text
R30の4698...と実装後collect fingerprintが違い、再び混乱する。
```

対策:

```text
- R30はreceived snapshot時点のevidenceとして扱う。
- 実装後current suite baselineは別materialで扱う。
- 実装追加testをactive baseline fingerprintへ混ぜない。
```

### 13.4 リスク: readiness READYをgreenと誤読する

危険:

```text
group_02 official captureを実行可能になっただけで、green扱いにする。
```

対策:

```text
- readiness_status と result_status を分ける。
- official_capture_run_allowed と official_group_02_capture_green_confirmed を分ける。
- group_02 green と full backend suite green を分ける。
```

### 13.5 リスク: P7-HOLD-004に留まりすぎる

危険:

```text
測定器整理が目的化して、Emlisの商品読感確認へ戻れなくなる。
```

対策:

```text
- R40までを小さく閉じる。
- active baseline refresh後はgroup_02 official capture / full backend suite executionへ進む。
- HOLD-004が閉じたら、P7-HOLD-001 / 003の人間読感確認へ戻す。
```

---

## 14. 完了条件

今回設計の実装が完了したと言える条件は、次です。

```text
R30:
  local repeat collect evidenceがbody-freeで固定されている。

R31:
  source identity decisionが、148と151を混同せず固定されている。

R32:
  item fingerprint root causeがUNCLASSIFIEDでない状態へ分類され、過剰断定がない。

R33:
  test semantics reviewがNOT_REVIEWEDでなく、nodeid本文なしに記録されている。

R34:
  adoption evidence bundleがR27条件を満たしているが、それ自体ではactive baselineを更新しない。

R35:
  conditional active adoptionがreadyになり、update allowedはtrueになるが、appliedはfalseのまま。

R36:
  post-adoption active baseline materialがnew baseline idで作られ、previous activeが保持されている。

R37:
  runtime buildersがpost-adoption active baselineを読む。

R38:
  matrix / release / validationがactive baseline refresh appliedを同じ値で読む。

R39:
  group_02 official capture readinessが再判定される。

R40:
  group_02 result recording方針とfull backend suite gateが分離されている。
```

全体の不変完了条件:

```text
release_allowed == false
p7_complete == false
p8_start_allowed == false
hold004_close_allowed == false
full_backend_suite_green_confirmed == false
public contract unchanged
DB unchanged
RN unchanged
Emlis本文runtime unchanged
Gate unchanged
body_free == true
```

---

## 15. 実装後も未完として残すもの

この設計を実装しても、次は未完のままです。

```text
- group_02 official full run result
- full backend suite execution green
- P7-HOLD-004 closure
- P7-HOLD-001 P5 human Blind QA
- P7-HOLD-003 RN実機submit / modal読感
- P8 Personal Continuity / Derived User Model
- release readiness
```

---

## 16. 華恋の意見

華恋としては、次の実装では **R30〜R39までを一つの小さな塊**として進めるのが良いと判断します。

理由は、R30〜R34で証拠だけを満たしても、runtime buildersが旧active baselineを読み続けるなら、P7の測定正本は揺れたままだからです。  
逆に、証拠を満たさないままruntime buildersだけを更新すると、それはCocolonとして危険です。

順番は、次が安全です。

```text
1. まず証拠を固める。
2. 次にadoption readyを立てる。
3. その後にだけactive baselineをnew idで反映する。
4. 反映後もgreenやreleaseは主張しない。
5. 最後にgroup_02 official captureへ進めるかを再判定する。
```

もう一つ、華恋の意見として、`NO_TEST_SEMANTIC_CHANGE_DETECTED` は今回使わない方が良いです。  
old active側のnodeid listがない状態で「意味差分なし」と言うのは、少し強すぎます。  
今回は、`TEST_SEMANTIC_CHANGE_ACCEPTED_AS_BASELINE_REFRESH` として、P7の測定正本を現在のreceived snapshotへ更新する判断にした方が、事実に対して誠実です。

この作業は、見た目の進捗としては地味です。  
でも、Cocolonが「読めたふり」をしないためには、開発側も「通ったふり」をしてはいけません。  
ここを正しく閉じたあと、華恋はP7-HOLD-001のP5 human QAと、P7-HOLD-003の実機modal読感確認へ戻すべきだと思っています。  
最終的にCocolonを強くするのは、baselineの整理そのものではなく、ユーザーが入力直後に「もう一回ここに残したい」と思えるEmlis体験だからです。

---

## 17. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- 現在地はP7。
- P7-HOLD-004は未解決。
- received snapshot materialは 4698... を保持している。
- active baseline materialは fee1... を保持している。
- 現ローカルfull collect-onlyは 425 / 2856 / warning 1 / 4698... / 6866... で安定している。
- R29はverification procedureであり、active baseline refresh適用ではない。
- release_allowed / p7_complete / p8_start_allowed / hold004_close_allowed はfalseを維持する必要がある。
```

### 未確認

```text
- root causeをBASELINE_CONSTANT_STALEとして確定してよいか。
- source identity decisionをcanonical received ref 148として採用してよいか。
- test semantics review outcomeをbaseline refresh acceptedとして記録してよいか。
- runtime builder refresh後の全matrix整合。
- group_02 official full run結果。
- full backend suite execution green。
```

### 書かれていない

```text
- 151.zipをsource_snapshot_refへ採用してよいこと。
- R29がHOLD-004を閉じること。
- collect-onlyがexecution greenであること。
- group_02 greenがfull backend suite greenであること。
- active baseline refreshだけでrelease_allowedをtrueにしてよいこと。
- P8へ進んでよいこと。
```

### 推測禁止

```text
- item fingerprint mismatchを環境要因と断定しない。
- semantic差分なしと無根拠に断定しない。
- 151.zipを148.zipの完全な後継正本として扱わない。
- R29をactive baseline adoption完了として扱わない。
- target subset greenをfull backend suite greenへ変換しない。
- readiness READYをgroup greenへ変換しない。
```

### 次に実行すべきこと

```text
1. 本設計に基づき、R30〜R34のevidence materialを実装する。
2. R35でconditional adoption readyを、evidence bundle経由でのみ立てる。
3. R36前に、historical at receipt constantsをlive active baseline constantsから切り離す。
4. R37でruntime buildersをnew active baseline idへ接続する。
5. R38でmatrix / release / validation整合を確認する。
6. R39でofficial group_02 capture readinessを再判定する。
7. その後、必要ならgroup_02 official full runへ進む。
```

---

## 18. 設計書名

```text
Cocolon_EmlisAI_P7_HOLD004_ActiveBaselineAdoptionEvidence_RuntimeBuilderRefresh_DetailedDesign_ImplementationOrder_20260616.md
```
