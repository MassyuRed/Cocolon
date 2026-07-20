---
title: "Cocolon / EmlisAI P7-R54-AHR Post-DRI DHR-OP04 Manual Re-intake 詳細設計書・実装順"
created_at: "2026-07-05 JST"
author: "華恋"
work_mode: "共鳴構造モード"
work_type: "詳細設計書 / 実装順 / json・schema案内包"
source_mode: "local_received_zip_only"
github_connection_check: "not_required_by_mash_instruction / not_performed"
base_pre_design_memo: "Cocolon_EmlisAI_P7_R54AHR_PostDRI_DHR_OP04ManualReintake_PreDesignMemo_20260705.md"
selected_roadmap_phase: "P7 Product Quality Runner / Long-run Product Gate 継続"
selected_design_target: "P7-R54-AHR Post-DRI / DHR-OP04 Manual Re-intake Boundary"
recommended_boundary_prefix: "MRB-OP00〜MRB-OP08"
recommended_prefix_meaning: "MRB = Manual Re-intake Boundary"
recommended_helper_shape: "thin explicit manual boundary wrapper around existing DRI candidate and existing DHR-OP04, not downstream automation"
artifact_scope: "md design only"
code_change: "none"
json_schema_file_creation: "none"
api_change: "none"
db_change: "none"
rn_change: "none"
runtime_change: "none"
response_key_change: "none"
actual_body_full_packet_generation: "none"
actual_local_human_review_execution: "none"
actual_operation_receipt_creation: "none"
actual_rows_creation: "none"
actual_disposal_purge_execution: "none"
dhr_op04_manual_call_execution_in_this_design_work: "none"
dhr_op05_auto_call: "none"
dmd_execution: "none"
r52_actual_execution: "none"
p5_finalization: "none"
p6_start: "none"
p8_start: "none"
p8_question_design: "none"
p8_question_implementation: "none"
p7_complete: "none"
release_decision: "none"
current_expected_next_required_step_after_design: "implement_thin_mrb_boundary_and_targets_then_stop_after_dhr_op04_result"
---

# Cocolon / EmlisAI P7-R54-AHR Post-DRI DHR-OP04 Manual Re-intake 詳細設計書・実装順

対象: Cocolon / EmlisAI / P7 Product Quality Runner / R54-AHR / Post-RSR16 DRI / DHR-OP04 manual re-intake boundary  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
実装扱い: 本書は設計書です。コード変更・json/schema実ファイル化・actual review実行・DHR-OP04実行・DHR-OP05以降実行・DMD実行・R52実行・P5/P6/P8/P7/release昇格は行いません。  
json / schema実ファイル化: なし。本書内の案のみです。実ファイル化は実装段階で、既存helper・既存schema配置・既存guard・既存test結果を確認して判断します。  
GitHub接続確認: Mash様指定により不要。ローカル受領zip基準。  

---

## 0. 結論

今回の詳細設計対象は、次で固定します。

```text
P7-R54-AHR Post-DRI / DHR-OP04 Manual Re-intake Boundary
```

推奨する境界prefixは次です。

```text
MRB-OP00〜MRB-OP08
MRB = Manual Re-intake Boundary
```

推奨する実装単位は、既存DRI helperと既存DHR helperを直接大きく書き換えるのではなく、両者を明示的な手動境界としてつなぐ薄いwrapperです。

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_dri_dhr_op04_manual_reintake_20260705.py
```

このhelperの役割は、DRI-OP09 / OP10 / OP12で閉じたbody-free candidate materialを、既存DHR-OP04へ **明示手動投入** する条件を固定し、DHR-OP04結果をbody-freeで記録して、そこで止めることです。

本設計で到達してよい状態は次のどれかだけです。

```text
1. DHR-OP04 confirmed body-free result captured, then stopped
2. DHR-OP04 not confirmed / retry or start required captured, then stopped
3. DHR-OP04 waiting for external body-free actual source claim captured, then stopped
4. DHR-OP04 invalid / repair required captured, then stopped
5. DHR-OP04 manual call itself blocked / waiting / repair before call, then stopped
```

本設計で到達してはいけない状態は次です。

```text
- DHR-OP05 auto call
- DHR-OP06 auto branch resolve
- DHR-OP08 DMD handoff plan auto materialization
- DMD execution
- R52 actual execution
- actual body-full packet generation
- actual local-only human review execution
- actual operation receipt / rows / purge creation
- P5 finalization
- P6 start
- P8 start
- P8 question design / implementation
- P7 complete
- release decision
- API / DB / RN / runtime / response key change
```

重要な分離は次です。

```text
DRI-OP09 adapter candidate materialized
  ≠ DHR-OP04 called
  ≠ DHR actual source claim confirmed
  ≠ DHR re-intake complete
  ≠ DHR-OP05以降へ進行

MRBでDHR-OP04を明示手動callした結果を得た場合でも
  ≠ DHR-OP05 auto call
  ≠ DMD/R52/P8/release promotion
```

---

## 1. なぜこの設計を行うのか

Cocolonとして大事なのは、EmlisAIがユーザーの言葉を「処理済み」にすることではありません。ユーザーの入力直後に、その人の状態・感情・行動・思考・関係・揺れを、読まれた形で返せる商品へ近づけることです。

P7は、その商品品質をfixture greenやhelper greenではなく、実ケースの読感・body-free evidence・人間確認境界で積み上げる段階です。

DRI-OP09は、DHR-OP04が読めるexternal actual source claim adapter candidateを作っています。DRI-OP10は、そのcandidateを手動提供できるready branchに到達し得ます。DRI-OP12は、その結果をbody-free result memoとして閉じます。

ただし、DRI側でcandidateができたことは、まだDHR-OP04が判定したことではありません。ここを飛ばしてP8やDMDへ進むと、helperが作ったcandidate readyを「人間が読んだ証跡」「DHR confirmed」「releaseに近い材料」と誤読する危険があります。

今回必要なのは、問いを増やすことではありません。P5系の実レビュー材料がbody-freeのままDHR-OP04へ正しく戻れるかを、小さく厳密に確認することです。

華恋の判断として、ここは速く広げる段階ではありません。DHR-OP04へ渡す、DHR-OP04の判定を得る、そこで止める。この小さい境界を壊さず閉じることが、Cocolonの「人間の言葉を雑に処理しない」姿勢と一致します。

---

## 2. 参照・確認範囲

### 2.1 ローカル受領資料

本設計の基準は、ローカル受領zipと直前の検討メモです。

```text
/mnt/data/Cocolon_前提資料(288).zip
/mnt/data/EmlisAIの実装済み資料(97).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(16).zip
/mnt/data/Cocolon(270).zip
/mnt/data/mashos-api(183).zip
/mnt/data/Cocolon_EmlisAI_P7_R54AHR_PostDRI_DHR_OP04ManualReintake_PreDesignMemo_20260705.md
```

GitHub接続確認は、Mash様指定により行いません。

### 2.2 必読前提・作業姿勢

本設計では、次を確認済み前提として扱います。

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/04_forbidden_mixing_design_and_implementation.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/11_cocolon_area_specific_do_not_break.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
```

固定する作業姿勢は次です。

```text
- 設計と実装を混ぜない。
- 前提資料だけで理解したふりをしない。実ファイルも見る。
- 見ていないDHR-OP04実行を確認済みにしない。
- DRI candidateをDHR confirmed resultとして扱わない。
- DHR-OP04 resultをDHR-OP05 / DMD / R52 / P8 / releaseへ自動昇格しない。
- question need observation rowsをP8 question_textへ変換しない。
- public contract / DB / RN / response keyを指示なく変えない。
- body-full / raw input / comment_text / reviewer free text / question_text / local path / hash / terminal bodyをresult memoやpublic metaへ出さない。
```

### 2.3 実装済み設計資料

主な接続対象は次です。

```text
EmlisAIの実装済み資料/
  Cocolon_EmlisAI_P7_R54AHR_PostRSR16_DHRActualSourceClaimReintake_DetailedDesign_ImplementationOrder_20260705.md
  Cocolon_EmlisAI_P7_R54AHR_PostELR19_DownstreamManualDecision_HandoffOrRetry_DetailedDesign_ImplementationOrder_20260704.md
```

### 2.4 実ファイル

本設計で直接接続する既存helperは次です。

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_20260705.py
  emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py
  emlis_ai_p7_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_20260704.py
  emlis_ai_p7_r54_ahr_post_dmh18_downstream_manual_decision_triage_20260703.py
```

---

## 3. 現在地の整理

### 3.1 確認済み

```text
- 現在はP7 Product Quality Runner / Long-run Product Gate継続段階である。
- P8 question design / implementationへ進む段階ではない。
- DRI-OP00〜DRI-OP12はbackend internal-only / body-free / no-touch / no-promotion helper lineとして反映済み。
- DRIのnext_required_stepは、DHR-OP04へbody-free adapter materialを手動提供すること。
- DRI-OP09はDHR-OP04 readable candidateを作るが、DHR-OP04を呼ばない。
- DRI-OP10 ready branchはdownstream auto execution allowedではない。
- DRI-OP12 result memo closureはDHR re-intake executed / P8 start / P7 complete / release readyではない。
- DHR-OP04には external_actual_operation_evidence_claim_bodyfree_optional / external_actual_operation_evidence_claim_optional の受け口がある。
- DHR-OP04はOP03 ready状態も見るため、DRI candidate単体ではconfirmed条件にならない。
- DRI / RSR source kind と DHR / DMD expected source kind は actual_local_only_human_review_by_person で一致している。
- DRI adapter origin と DHR expected external actual source origin は external_local_only_human_review_receipt_or_manual_evidence_confirmation で一致している。
- DRI split target 227 passed は確認済み。ただしcombined run greenは主張しない。
- DHR OP04/OP05 target 36 passed は既存境界確認として確認済み。ただしDRI candidateをDHR-OP04へ実投入した確認ではない。
```

### 3.2 未確認

```text
- MRB helper / target testsの実装結果
- DRI candidateをDHR-OP04へ手動再投入した実行結果
- DHR-OP04 confirmed / not_confirmed / waiting / repair の実際の分岐
- DHR-OP04結果後のmanual decision material
- DHR-OP05以降のmanual handoff判断
- full backend suite green
- RN contract green
- RN real-device modal verified
- DMD execution
- R52 actual execution
- P5 final
- P6 start
- P8 start
- P7 complete
- release ready
```

### 3.3 書かれていない

```text
- DRI-OP09 adapter candidateをDHR confirmed resultとして扱ってよい、とは書かれていない。
- DRI-OP12 result memo closure後にP8へ進んでよい、とは書かれていない。
- DHR-OP04 confirmedをDHR-OP05 / DMD / R52 / P5 / P6 / P8 / P7 / releaseへ自動昇格してよい、とは書かれていない。
- question need observation rowsをP8 question spec / question_textへ変換してよい、とは書かれていない。
- API / DB / RN / response keyを今回変更してよい、とは書かれていない。
```

### 3.4 推測禁止

```text
- helper target通過をactual human review executionと推測しない。
- DRI candidate materializedをDHR-OP04 calledと推測しない。
- DHR-OP04 input candidateをactual source claim confirmedと推測しない。
- DHR-OP04 confirmedが得られたとしても、DHR-OP05 / DMD / R52 / P8 / release readyと推測しない。
- DRI-OP06 question need rowsをP8 question designと推測しない。
- combined DRI target runはタイムアウトしているため、combined greenと推測しない。
```

---

## 4. 設計対象と非対象

### 4.1 対象範囲

本設計の対象は、DRIからDHR-OP04へ明示的に手動再投入する境界です。

```text
DRI-OP09 external_actual_operation_evidence_claim_bodyfree_optional candidate
DRI-OP10 deterministic branch resolver / ready branch
DRI-OP12 result memo closure
DHR-OP03 ready material
DHR-OP04 actual source claim separation / invalid source classification
DHR-OP04 result capture
DHR-OP04後のstop / manual next decision material
```

本設計で作るべきものは次です。

```text
- MRB-OP00〜OP08の薄いhelper設計
- DRI ready material intake
- DHR-OP03 ready material intake
- manual re-intake request / envelope
- explicit DHR-OP04 call gate
- DHR-OP04 result capture summary
- confirmed / not_confirmed / waiting / invalid / pre-call blocked の分岐
- no-touch / no-promotion guard
- target tests / result memo案
```

### 4.2 非対象範囲

```text
- P8 question design / implementation
- question_text / question_trigger / question_answer_storage
- API route追加・変更
- DB schema / write path変更
- RN UI / RN contract / response key変更
- actual body-full packet generation
- actual local-only human review execution
- actual operation receipt / rows / purge creation
- DHR-OP05以降の自動実行
- DMD execution
- R52 actual execution
- P5 finalization
- P6 start
- P7 complete
- release decision
```

---

## 5. 既存DRI → 既存DHR-OP04 接続仕様

### 5.1 DRI側の提供材料

DRI-OP09のcandidateは、DHR-OP04へ渡す候補です。

候補名:

```text
external_actual_operation_evidence_claim_bodyfree_optional
```

DRI-OP09 candidateの主要key:

```text
schema_version
material_kind
review_session_id
source_kind_ref
actual_source_claim_source_kind_ref
actual_source_claim_origin_ref
actual_source_claim_bodyfree
actual_local_only_human_review_by_person_confirmed
actual_human_review_executed_by_person
operation_receipt_bodyfree_ref
sanitized_review_result_row_count
rating_row_count
question_need_observation_row_count
disposal_purge_receipt_bodyfree_ref
rsr_op15_branch_ref
rsr_op16_status_ref
body_free
dhr_op04_called_here
dhr_actual_source_claim_reintake_executed_here
dmd_execution_started_here
r52_actual_execution_started_here
p5_final_allowed
p6_start_allowed
p8_start_allowed
p8_question_design_started
p8_question_implementation_started
p7_complete
release_allowed
```

DRI candidateとして許される意味:

```text
DHR-OP04のexternal claim inputとして読めるbody-free candidate。
```

DRI candidateとして許されない意味:

```text
- DHR-OP04 called
- DHR actual source claim confirmed
- DHR re-intake executed
- DHR-OP05 ready
- DMD/R52/P8/release promotion
```

### 5.2 DHR-OP04側の受け口

既存DHR-OP04 builderの受け口は次です。

```python
build_p7_r54_ahr_post_elr19_dhr_op04_actual_source_claim_separation_invalid_source_classification(
    *,
    elr_op17_dmd_compatible_receipt_candidate_extraction: Mapping[str, Any] | None = None,
    op03_elr_op17_dmd_compatible_receipt_candidate_extraction: Mapping[str, Any] | None = None,
    external_actual_operation_evidence_claim_bodyfree_optional: Mapping[str, Any] | None = None,
    external_actual_operation_evidence_claim_optional: Mapping[str, Any] | None = None,
    review_session_id: Any = None,
) -> dict[str, Any]
```

MRBでは、既存DHR-OP04 builderのsignatureを変更しない方針です。DRI candidateは次の引数に渡します。

```text
external_actual_operation_evidence_claim_bodyfree_optional
```

DHR-OP03 ready materialは次のどちらかの既存引数に渡します。

```text
elr_op17_dmd_compatible_receipt_candidate_extraction
op03_elr_op17_dmd_compatible_receipt_candidate_extraction
```

### 5.3 DHR-OP03 ready materialを必須にする理由

DHR-OP04は、external claimだけでconfirmedにする境界ではありません。OP03が actual source claim separation に進めるready状態かも見ます。

そのため、MRBでは次を禁止します。

```text
- DRI candidateだけでDHR-OP04 confirmedを期待する。
- OP03 missingのままDHR-OP04を呼び、repair/waitの理由を曖昧にする。
- DRI candidateをDHR OP03 receipt candidateの代用品にする。
```

MRBでは、DHR-OP03 ready materialを独立した入力として扱います。

```text
DHR-OP03 ready material:
  dhr_op03_ready_for_actual_source_claim_separation = true
  receipt_shape_valid = true
  receipt_source_kind_valid = true
  receipt_count_fields_are_24 = true
  receipt_required_true_fields_passed = true
  receipt_body_free = true
  actual_source_claim_confirmed_for_downstream_handoff = false
```

ここでOP03はreceipt shapeの検査であり、actual source claim confirmationではありません。

---

## 6. MRB全体データフロー

```text
MRB-OP00 scope / no-touch / no-promotion refreeze
  ↓
MRB-OP01 DRI result memo / OP10 branch intake
  ↓
MRB-OP02 DRI-OP09 adapter candidate extraction and candidate scan
  ↓
MRB-OP03 DHR-OP03 ready material intake
  ↓
MRB-OP04 manual re-intake request + DHR-OP04 input envelope assembly
  ↓
MRB-OP05 explicit manual DHR-OP04 call and result capture
  ↓
MRB-OP06 DHR-OP04 result classifier + stop boundary
  ↓
MRB-OP07 no-touch selected regression guard
  ↓
MRB-OP08 body-free result memo closure
```

分岐概要:

```text
body leak / promotion / auto-execution flag true
  -> blocked before DHR-OP04 call

DRI OP10 not ready / DRI OP09 candidate absent
  -> wait or repair before DHR-OP04 call

DHR OP03 not ready
  -> wait or repair before DHR-OP04 call

manual re-intake request missing
  -> wait; DHR-OP04 call is not allowed

all preconditions ready
  -> call existing DHR-OP04 once, capture result, stop
```

---

## 7. MRB status / branch / next_required_step設計

### 7.1 MRB branch refs

```text
MRB_STATUS_READY_TO_CALL_DHR_OP04_MANUALLY_NO_DOWNSTREAM_AUTO_EXECUTION
MRB_STATUS_DHR_OP04_CONFIRMED_BODYFREE_STOPPED
MRB_STATUS_DHR_OP04_NOT_CONFIRMED_RETRY_OR_START_REQUIRED_STOPPED
MRB_STATUS_DHR_OP04_WAITING_EXTERNAL_CLAIM_STOPPED
MRB_STATUS_DHR_OP04_INVALID_REPAIR_REQUIRED_STOPPED
MRB_STATUS_WAITING_FOR_DRI_OR_DHR_OP03_MATERIAL
MRB_STATUS_REPAIR_REQUIRED_BEFORE_DHR_OP04_CALL
MRB_STATUS_BLOCKED_BODYFREE_LEAK_PROMOTION_OR_AUTORUN
MRB_STATUS_MANUAL_HOLD_UNRESOLVED_NO_PROMOTION
```

### 7.2 branch priority

branch resolverは、次の順に決定します。

```text
priority_1:
  body-like leak / forbidden payload / promotion claim / auto-execution flag true
  -> MRB_STATUS_BLOCKED_BODYFREE_LEAK_PROMOTION_OR_AUTORUN

priority_2:
  DRI OP10 contract invalid / DRI OP09 contract invalid / candidate malformed
  -> MRB_STATUS_REPAIR_REQUIRED_BEFORE_DHR_OP04_CALL

priority_3:
  DRI OP10 not ready / DRI OP09 candidate absent / DHR OP03 waiting / manual request absent
  -> MRB_STATUS_WAITING_FOR_DRI_OR_DHR_OP03_MATERIAL

priority_4:
  DHR OP03 repair required / origin or source claim shape repair required before safe handoff
  -> MRB_STATUS_REPAIR_REQUIRED_BEFORE_DHR_OP04_CALL

priority_5:
  all preconditions ready and manual request true
  -> MRB_STATUS_READY_TO_CALL_DHR_OP04_MANUALLY_NO_DOWNSTREAM_AUTO_EXECUTION

priority_6:
  after explicit DHR-OP04 result capture
  -> one of confirmed / not_confirmed / waiting / invalid stopped statuses

fallback:
  MRB_STATUS_MANUAL_HOLD_UNRESOLVED_NO_PROMOTION
```

### 7.3 DHR-OP04 result mapping

既存DHR-OP04 statusをMRB resultへ写します。

```text
DHR_ACTUAL_SOURCE_CLAIM_CONFIRMED_BODYFREE
  -> MRB_STATUS_DHR_OP04_CONFIRMED_BODYFREE_STOPPED

DHR_ACTUAL_SOURCE_CLAIM_NOT_CONFIRMED_RETRY_OR_START_REQUIRED
  -> MRB_STATUS_DHR_OP04_NOT_CONFIRMED_RETRY_OR_START_REQUIRED_STOPPED

DHR_ACTUAL_SOURCE_WAITING_FOR_EXTERNAL_BODYFREE_CLAIM
  -> MRB_STATUS_DHR_OP04_WAITING_EXTERNAL_CLAIM_STOPPED

DHR_ACTUAL_SOURCE_INVALID_REPAIR_REQUIRED
  -> MRB_STATUS_DHR_OP04_INVALID_REPAIR_REQUIRED_STOPPED
```

どのMRB resultでも、次は自動実行しません。

```text
dhr_op05_called_here: false
dhr_op06_branch_resolved_here: false
dmd_execution_started_here: false
r52_actual_execution_started_here: false
p5_final_allowed: false
p6_start_allowed: false
p8_start_allowed: false
p8_question_design_started: false
p8_question_implementation_started: false
p7_complete: false
release_allowed: false
```

### 7.4 next_required_step refs

```text
call_dhr_op04_manually_with_dri_bodyfree_actual_source_claim_adapter_and_dhr_op03_ready_material
manual_review_dhr_op04_confirmed_bodyfree_result_before_any_dhr_op05
manual_review_dhr_op04_not_confirmed_result_and_decide_retry_or_start_without_auto_execution
wait_for_external_bodyfree_actual_source_claim_before_manual_dhr_op04_reintake
repair_post_dri_to_dhr_op04_manual_reintake_boundary
blocked_post_dri_to_dhr_op04_bodyfree_leak_promotion_or_autorun
wait_for_dri_ready_candidate_or_dhr_op03_ready_material_before_manual_dhr_op04_reintake
manual_hold_after_dhr_op04_manual_reintake_without_downstream_promotion
```

---

## 8. 実装順

### 8.1 推奨ファイル構成

#### helper候補

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_dri_dhr_op04_manual_reintake_20260705.py
```

helperの性格:

```text
- 既存DRI helperと既存DHR helperを薄くつなぐ。
- DHR-OP04 builderのsignatureは変更しない。
- DRI helper内からDHR-OP04を自動呼び出ししない。
- MRB helper内でも、manual_reintake_request_bodyfree が明示されない限りDHR-OP04を呼ばない。
- DHR-OP04を呼んだ後は必ず停止し、DHR-OP05以降は呼ばない。
```

#### tests候補

```text
mashos-api/ai/tests/
  test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op00_op01_20260705.py
  test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op02_op03_20260705.py
  test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op04_op05_20260705.py
  test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op06_op07_20260705.py
  test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op08_result_20260705.py
```

#### result memo候補

```text
mashos-api/ai/tests/
  R54_AHR_PostDRI_DHROP04ManualReintake_MRB_OP00_OP08_Result_20260705.md
```

#### schema file候補

実装段階では、まずPython内定数 + assert contractで開始します。schema実ファイル化は行いません。

必要性が出た場合の候補名のみ、本書内に残します。

```text
mashos-api/ai/schemas/
  p7_r54_ahr_post_dri_mrb_manual_reintake_request.bodyfree.schema.json
  p7_r54_ahr_post_dri_mrb_dhr_op04_input_envelope.bodyfree.schema.json
  p7_r54_ahr_post_dri_mrb_dhr_op04_result_capture.bodyfree.schema.json
  p7_r54_ahr_post_dri_mrb_branch_result.bodyfree.schema.json
```

---

### MRB-OP00: scope / no-touch / no-promotion refreeze

目的:

```text
MRBの責務を固定する。
DRI candidateをDHR confirmed resultへ読み替えず、DHR-OP04以外へ進まないことを固定する。
```

実装内容:

```text
- phase / step / scope / policy_kind constantsを定義する。
- MRB-OP00 schema_versionを定義する。
- source_mode = local_received_zip_only を固定する。
- git_connection_required = false / git_checked = false を固定する。
- no-touch contractを定義する。
- not-claimed boundaryを定義する。
- selected_stage_ref = P7-R54-AHR Post-DRI / DHR-OP04 Manual Re-intake Boundary を固定する。
```

acceptance:

```text
body_free: true
api_route_changed: false
db_schema_changed: false
rn_production_ui_changed: false
runtime_generation_changed: false
response_key_changed: false
dri_candidate_promoted_to_dhr_confirmed: false
dhr_op04_called_here: false
dhr_op05_called_here: false
dmd_execution_started_here: false
r52_actual_execution_started_here: false
p5_final_allowed: false
p6_start_allowed: false
p8_start_allowed: false
p8_question_design_started: false
p8_question_implementation_started: false
p7_complete: false
release_allowed: false
next_required_step: MRB-OP01
```

---

### MRB-OP01: DRI result memo / OP10 branch intake

目的:

```text
DRI-OP12 result memo closureとDRI-OP10 deterministic branchをbody-freeに受け、manual DHR-OP04投入へ進めるready materialか確認する。
```

実装内容:

```text
- DRI-OP12 contract assertを呼ぶ。
- DRI-OP10 contract assertを呼ぶ。
- DRI-OP10 branch_refを読む。
- next_required_stepを読む。
- DRI result memo closureがbody-freeか確認する。
- DRI-OP12 closureをDHR-OP04 called / DHR confirmedとして読まない。
```

ready条件:

```text
dri_op12_contract_valid: true
dri_op10_contract_valid: true
dri_op10_branch_ref: DRI_STATUS_READY_FOR_DHR_ACTUAL_SOURCE_CLAIM_REINTAKE_MATERIAL_NO_AUTO_EXECUTION
dri_op10_next_required_step: provide_dri_bodyfree_actual_source_claim_adapter_material_to_dhr_op04_without_auto_execution
downstream_auto_execution_allowed: false
dhr_op04_called_by_dri: false
dhr_actual_source_claim_confirmed_by_dri: false
```

failure分岐:

```text
DRI OP10 wait:
  wait_for_dri_ready_candidate_or_dhr_op03_ready_material_before_manual_dhr_op04_reintake

DRI OP10 repair:
  repair_post_dri_to_dhr_op04_manual_reintake_boundary

DRI OP10 blocked:
  blocked_post_dri_to_dhr_op04_bodyfree_leak_promotion_or_autorun
```

---

### MRB-OP02: DRI-OP09 adapter candidate extraction and scan

目的:

```text
DRI-OP09のexternal_actual_operation_evidence_claim_bodyfree_optional candidateを取り出し、DHR-OP04 inputとして渡してよいbody-free materialか確認する。
```

実装内容:

```text
- DRI-OP09 contract assertを呼ぶ。
- external_actual_operation_evidence_claim_bodyfree_optional_presentを確認する。
- candidate key setがDHR-OP04 readable key refsと一致するか確認する。
- source_kind_ref / actual_source_claim_source_kind_refを確認する。
- actual_source_claim_origin_refを確認する。
- body_free / actual_source_claim_bodyfreeを確認する。
- human confirmed系flagを確認する。
- row count 24 / 24 / 24を確認する。
- forbidden payload key / body-like value / promotion claim / auto-execution flagをscanする。
```

acceptance:

```text
candidate_present: true
candidate_bodyfree: true
source_kind_ref: actual_local_only_human_review_by_person
actual_source_claim_source_kind_ref: actual_local_only_human_review_by_person
actual_source_claim_origin_ref: external_local_only_human_review_receipt_or_manual_evidence_confirmation
actual_local_only_human_review_by_person_confirmed: true
actual_human_review_executed_by_person: true
sanitized_review_result_row_count: 24
rating_row_count: 24
question_need_observation_row_count: 24
dhr_op04_called_here in candidate: false
dhr_actual_source_claim_reintake_executed_here in candidate: false
dmd_execution_started_here in candidate: false
r52_actual_execution_started_here in candidate: false
p5_final_allowed in candidate: false
p6_start_allowed in candidate: false
p8_start_allowed in candidate: false
p8_question_design_started in candidate: false
p8_question_implementation_started in candidate: false
p7_complete in candidate: false
release_allowed in candidate: false
```

pre-call blocked条件:

```text
- raw_input / comment_text / question_text / reviewer_free_text / local_path / body_hash / terminal_output_body を含む。
- DHR/DMD/R52/P5/P6/P8/P7/releaseへのpromotion claimを含む。
- auto-execution allowed flagがtrue。
- body_free false。
```

source_kindやoriginの不一致は、原則としてDHR-OP04のinvalid / not_confirmed分類対象にできます。ただし、body leakやpromotion claimを含むpayloadはMRBで先にblockedし、DHR-OP04へ渡しません。

---

### MRB-OP03: DHR-OP03 ready material intake

目的:

```text
DHR-OP04がactual source claim separationへ進めるために必要なDHR-OP03 ready materialを受ける。
```

実装内容:

```text
- DHR-OP03 contract assertを呼ぶ。
- dhr_op03_ready_for_actual_source_claim_separationを確認する。
- receipt_shape_valid / source_kind_valid / count fields / required true fields / body_freeを確認する。
- OP03がactual_source_claim_confirmedではないことを再固定する。
```

acceptance:

```text
op03_contract_valid: true
dhr_op03_ready_for_actual_source_claim_separation: true
receipt_shape_valid: true
receipt_source_kind_valid: true
receipt_count_fields_are_24: true
receipt_required_true_fields_passed: true
receipt_body_free: true
actual_source_claim_confirmed_for_downstream_handoff: false
receipt_claimed_as_actual_execution_by_dhr_op03: false
```

failure分岐:

```text
OP03 missing / waiting:
  wait_for_dri_ready_candidate_or_dhr_op03_ready_material_before_manual_dhr_op04_reintake

OP03 repair:
  repair_post_dri_to_dhr_op04_manual_reintake_boundary
```

---

### MRB-OP04: manual re-intake request + DHR-OP04 input envelope assembly

目的:

```text
DRI candidateとDHR-OP03 ready materialを、DHR-OP04へ明示手動投入するためのbody-free envelopeへまとめる。
```

ここで重要なのは、MRB-OP04はまだDHR-OP04を呼ばないことです。DHR-OP04を呼ぶのはMRB-OP05です。

実装内容:

```text
- manual_reintake_request_bodyfreeを受ける。
- manual_reintake_requested = true を確認する。
- requested_operation_step_ref = DHR-OP04_actual_source_claim_separation_invalid_source_classification を確認する。
- DRI OP09 candidateを external_actual_operation_evidence_claim_bodyfree_optional として格納する。
- DHR OP03 materialを op03_elr_op17_dmd_compatible_receipt_candidate_extraction として格納する。
- DHR-OP05以降のcall allowed flagをfalseにする。
- envelope全体をbody-free scanする。
```

acceptance:

```text
manual_reintake_requested: true
manual_request_bodyfree: true
requested_operation_step_ref: DHR-OP04_actual_source_claim_separation_invalid_source_classification
dri_op09_candidate_present: true
dri_op10_ready: true
dri_op12_closed_bodyfree: true
dhr_op03_ready: true
dhr_op04_input_envelope_ready: true
dhr_op04_called_here: false
dhr_op05_auto_call_allowed: false
downstream_auto_execution_allowed: false
```

manual requestがない場合:

```text
MRB_STATUS_WAITING_FOR_DRI_OR_DHR_OP03_MATERIAL
next_required_step: wait_for_dri_ready_candidate_or_dhr_op03_ready_material_before_manual_dhr_op04_reintake
```

---

### MRB-OP05: explicit manual DHR-OP04 call and result capture

目的:

```text
既存DHR-OP04 builderを明示手動境界として一回だけ呼び、DHR-OP04 resultをbody-freeで捕捉する。
```

呼び出し形:

```python
dhr_op04_result = dhr.build_p7_r54_ahr_post_elr19_dhr_op04_actual_source_claim_separation_invalid_source_classification(
    op03_elr_op17_dmd_compatible_receipt_candidate_extraction=dhr_op03_ready_material,
    external_actual_operation_evidence_claim_bodyfree_optional=dri_op09_external_actual_operation_evidence_claim_bodyfree_optional,
    review_session_id=review_session_id,
)
```

実装条件:

```text
- MRB-OP01 ready
- MRB-OP02 ready
- MRB-OP03 ready
- MRB-OP04 envelope ready
- manual_reintake_requested = true
- body-free scan clear
- no promotion claim
- downstream_auto_execution_allowed = false
```

呼び出し後に必ず実施すること:

```text
- DHR-OP04 contract assertを呼ぶ。
- DHR-OP04 statusをそのまま記録する。
- DHR-OP04 resultをMRB resultへmappingする。
- DHR-OP05を呼ばない。
- DHR-OP06を呼ばない。
- DMD/R52/P8/releaseへ進めない。
```

MRB-OP05のresultに置くべき固定flag:

```text
dhr_op04_called_by_manual_reintake_boundary: true
dhr_op04_called_by_dri: false
dhr_op04_called_by_mrb: true
dhr_op05_called_here: false
dhr_op06_called_here: false
dmd_execution_started_here: false
r52_actual_execution_started_here: false
p5_final_allowed: false
p6_start_allowed: false
p8_start_allowed: false
p8_question_design_started: false
p8_question_implementation_started: false
p7_complete: false
release_allowed: false
downstream_auto_execution_allowed: false
```

注意:

```text
MRB-OP05でDHR-OP04を呼ぶことは、DRIが自動実行したことではない。
ただし、MRB-OP05がDHR-OP04を呼んだ場合は、MRB result上で dhr_op04_called_by_manual_reintake_boundary = true として明示する。
```

---

### MRB-OP06: DHR-OP04 result classifier + stop boundary

目的:

```text
DHR-OP04結果を確認し、次工程をmanual decisionとして明示する。ただし、次工程を自動実行しない。
```

分類:

```text
DHR_ACTUAL_SOURCE_CLAIM_CONFIRMED_BODYFREE
  -> MRB_STATUS_DHR_OP04_CONFIRMED_BODYFREE_STOPPED
  -> next_required_step: manual_review_dhr_op04_confirmed_bodyfree_result_before_any_dhr_op05

DHR_ACTUAL_SOURCE_CLAIM_NOT_CONFIRMED_RETRY_OR_START_REQUIRED
  -> MRB_STATUS_DHR_OP04_NOT_CONFIRMED_RETRY_OR_START_REQUIRED_STOPPED
  -> next_required_step: manual_review_dhr_op04_not_confirmed_result_and_decide_retry_or_start_without_auto_execution

DHR_ACTUAL_SOURCE_WAITING_FOR_EXTERNAL_BODYFREE_CLAIM
  -> MRB_STATUS_DHR_OP04_WAITING_EXTERNAL_CLAIM_STOPPED
  -> next_required_step: wait_for_external_bodyfree_actual_source_claim_before_manual_dhr_op04_reintake

DHR_ACTUAL_SOURCE_INVALID_REPAIR_REQUIRED
  -> MRB_STATUS_DHR_OP04_INVALID_REPAIR_REQUIRED_STOPPED
  -> next_required_step: repair_post_dri_to_dhr_op04_manual_reintake_boundary
```

acceptance:

```text
exactly_one_mrb_result_branch: true
dhr_op04_result_status_ref captured
actual_source_claim_confirmed_for_downstream_handoff copied from DHR-OP04 result
next_required_step set to manual decision / wait / repair
dhr_op05_auto_call: false
downstream_auto_execution_allowed: false
```

DHR-OP04 confirmedの場合でも、自動実行しない理由:

```text
DHR-OP04はactual source claim separationの結果であり、DHR-OP05 preflight / DHR-OP06 branch resolver / DHR-OP08 DMD handoff plan / DMD executionではないため。
```

---

### MRB-OP07: no-touch selected regression guard

目的:

```text
MRB実装がAPI / DB / RN / runtime / response key / P8 question surfaceを触っていないことを固定する。
```

実装内容:

```text
- changed_file_refsを受ける。
- allowed changed file refsだけに限定する。
- Cocolon RN / API route / DB / response key / runtime prompt / P8 question surface tokenを拒否する。
- selected regression required refsを固定する。
```

allowed changed files案:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_dri_dhr_op04_manual_reintake_20260705.py
mashos-api/ai/tests/test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op00_op01_20260705.py
mashos-api/ai/tests/test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op02_op03_20260705.py
mashos-api/ai/tests/test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op04_op05_20260705.py
mashos-api/ai/tests/test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op06_op07_20260705.py
mashos-api/ai/tests/test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op08_result_20260705.py
mashos-api/ai/tests/R54_AHR_PostDRI_DHROP04ManualReintake_MRB_OP00_OP08_Result_20260705.md
```

blocked token refs:

```text
/Cocolon/
Cocolon/
/api/
/db/
database
schema.sql
migration
response_key
runtime_generation
runtime_prompt
question_route
question_schema
question_trigger
p8_question
```

---

### MRB-OP08: body-free result memo closure

目的:

```text
MRB-OP00〜OP07の結果、target tests、selected regression、compileall、no-touch確認をbody-free result memoとして閉じる。
```

result memoに残すべきもの:

```text
- MRB selected branch
- DRI-OP09 candidate input accepted / not accepted
- DRI-OP10 branch ref
- DRI-OP12 result memo closure intake status
- DHR-OP03 ready material status
- DHR-OP04 manual call performed by MRBか
- DHR-OP04 result status ref
- actual_source_claim_confirmed_for_downstream_handoff
- DHR-OP05 not called
- DMD/R52/P5/P6/P8/P7/release not started
- validation command summary
- combined runを実施していない場合はcombined greenを主張しない
```

result memoに入れてはいけないもの:

```text
- raw input
- comment_text body
- reviewer free text
- question_text
- local path body
- body hash
- terminal output body
- actual body-full review packet
- user identifiable review payload
```

---

## 9. helper API案

### 9.1 import方針

```python
from collections.abc import Mapping, Sequence
from typing import Any, Final

from emlis_ai_p7_contracts import clean_identifier, public_contract_flags
import emlis_ai_p7_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_20260705 as dri
import emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704 as dhr
```

補足:

```text
- dhr moduleはDHR-OP03 / OP04 builderとassert contractを呼ぶためにimportする。
- DRI moduleからDHR-OP04を呼ばない。
- MRB moduleが、manual_reintake_request_bodyfreeを確認した場合だけDHR-OP04を呼ぶ。
- DHR-OP05以降はimportしていても自動呼び出ししない。
```

### 9.2 build / assert関数命名案

```python
build_p7_r54_ahr_post_dri_mrb_op00_scope_no_touch_no_promotion_refreeze(...)
assert_p7_r54_ahr_post_dri_mrb_op00_scope_no_touch_no_promotion_refreeze_contract(data)

build_p7_r54_ahr_post_dri_mrb_op01_dri_result_memo_branch_intake(...)
assert_p7_r54_ahr_post_dri_mrb_op01_dri_result_memo_branch_intake_contract(data)

build_p7_r54_ahr_post_dri_mrb_op02_dri_op09_adapter_candidate_extraction(...)
assert_p7_r54_ahr_post_dri_mrb_op02_dri_op09_adapter_candidate_extraction_contract(data)

build_p7_r54_ahr_post_dri_mrb_op03_dhr_op03_ready_material_intake(...)
assert_p7_r54_ahr_post_dri_mrb_op03_dhr_op03_ready_material_intake_contract(data)

build_p7_r54_ahr_post_dri_mrb_op04_manual_reintake_request_and_input_envelope(...)
assert_p7_r54_ahr_post_dri_mrb_op04_manual_reintake_request_and_input_envelope_contract(data)

build_p7_r54_ahr_post_dri_mrb_op05_explicit_manual_dhr_op04_call_result_capture(...)
assert_p7_r54_ahr_post_dri_mrb_op05_explicit_manual_dhr_op04_call_result_capture_contract(data)

build_p7_r54_ahr_post_dri_mrb_op06_dhr_op04_result_classifier_stop_boundary(...)
assert_p7_r54_ahr_post_dri_mrb_op06_dhr_op04_result_classifier_stop_boundary_contract(data)

build_p7_r54_ahr_post_dri_mrb_op07_no_touch_selected_regression_guard(...)
assert_p7_r54_ahr_post_dri_mrb_op07_no_touch_selected_regression_guard_contract(data)

build_p7_r54_ahr_post_dri_mrb_op08_result_memo_tests_selected_regression_closure(...)
assert_p7_r54_ahr_post_dri_mrb_op08_result_memo_tests_selected_regression_closure_contract(data)
```

### 9.3 OP05受け取り引数案

```python
def build_p7_r54_ahr_post_dri_mrb_op05_explicit_manual_dhr_op04_call_result_capture(
    *,
    manual_reintake_input_envelope: Mapping[str, Any] | None = None,
    dri_op09_adapter_candidate_materialization: Mapping[str, Any] | None = None,
    dri_op10_branch_resolver: Mapping[str, Any] | None = None,
    dri_op12_result_memo_closure: Mapping[str, Any] | None = None,
    dhr_op03_elr_op17_dmd_compatible_receipt_candidate_extraction: Mapping[str, Any] | None = None,
    manual_reintake_request_bodyfree: Mapping[str, Any] | None = None,
    review_session_id: Any = None,
) -> dict[str, Any]:
    ...
```

実装時の原則:

```text
- envelopeがある場合はenvelopeを優先する。
- envelopeがない場合でも、必要なmaterialがすべて揃い、manual_reintake_request_bodyfreeがtrueの場合だけOP05でDHR-OP04を呼んでよい。
- manual_reintake_request_bodyfreeがない場合はDHR-OP04を呼ばずwaitingにする。
- DHR-OP04 resultを捕捉した後、DHR-OP05は呼ばない。
```

---

## 10. json / schema案

本章のjson/schemaは設計案です。実ファイル化は行いません。

### 10.1 manual re-intake request schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_dri.mrb.manual_reintake_request.bodyfree.v1",
  "title": "P7 R54 AHR Post-DRI MRB Manual Re-intake Request Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "material_kind",
    "review_session_id",
    "manual_reintake_requested",
    "requested_operation_step_ref",
    "requested_source_material_ref",
    "requested_target_helper_ref",
    "manual_request_bodyfree",
    "dhr_op04_only",
    "dhr_op05_auto_call_allowed",
    "downstream_auto_execution_allowed",
    "p8_question_design_started",
    "p8_question_implementation_started",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dri.mrb.manual_reintake_request.bodyfree.v1"
    },
    "material_kind": {
      "const": "dhr_op04_manual_reintake_request"
    },
    "review_session_id": {
      "type": "string",
      "minLength": 1,
      "maxLength": 180,
      "not": { "pattern": "[/\\\\]|sha256|stdout|stderr|traceback|raw_input|comment_text" }
    },
    "manual_reintake_requested": { "const": true },
    "requested_operation_step_ref": {
      "const": "DHR-OP04_actual_source_claim_separation_invalid_source_classification"
    },
    "requested_source_material_ref": {
      "const": "DRI-OP09_external_actual_operation_evidence_claim_bodyfree_optional_candidate"
    },
    "requested_target_helper_ref": {
      "const": "emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.build_p7_r54_ahr_post_elr19_dhr_op04_actual_source_claim_separation_invalid_source_classification"
    },
    "manual_request_bodyfree": { "const": true },
    "dhr_op04_only": { "const": true },
    "dhr_op05_auto_call_allowed": { "const": false },
    "downstream_auto_execution_allowed": { "const": false },
    "p8_question_design_started": { "const": false },
    "p8_question_implementation_started": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 10.2 DHR-OP04 input envelope schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_dri.mrb.dhr_op04_input_envelope.bodyfree.v1",
  "title": "P7 R54 AHR Post-DRI MRB DHR-OP04 Input Envelope Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "material_kind",
    "review_session_id",
    "manual_reintake_request_present",
    "manual_reintake_requested",
    "dri_op10_branch_ref",
    "dri_op10_ready_for_dhr_material",
    "dri_op09_candidate_present",
    "dri_op09_candidate_schema_version",
    "dri_op09_candidate_source_kind_ref",
    "dri_op09_candidate_origin_ref",
    "dhr_op03_ready",
    "dhr_op03_schema_version",
    "dhr_op04_input_ready",
    "external_actual_operation_evidence_claim_bodyfree_optional",
    "dhr_op04_called_here",
    "dhr_op05_auto_call_allowed",
    "downstream_auto_execution_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dri.mrb.dhr_op04_input_envelope.bodyfree.v1"
    },
    "material_kind": {
      "const": "dhr_op04_manual_reintake_input_envelope"
    },
    "review_session_id": {
      "type": "string",
      "minLength": 1,
      "maxLength": 180
    },
    "manual_reintake_request_present": { "const": true },
    "manual_reintake_requested": { "const": true },
    "dri_op10_branch_ref": {
      "const": "DRI_STATUS_READY_FOR_DHR_ACTUAL_SOURCE_CLAIM_REINTAKE_MATERIAL_NO_AUTO_EXECUTION"
    },
    "dri_op10_ready_for_dhr_material": { "const": true },
    "dri_op09_candidate_present": { "const": true },
    "dri_op09_candidate_schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_rsr16.dri.external_actual_operation_evidence_claim.bodyfree.v1"
    },
    "dri_op09_candidate_source_kind_ref": {
      "const": "actual_local_only_human_review_by_person"
    },
    "dri_op09_candidate_origin_ref": {
      "const": "external_local_only_human_review_receipt_or_manual_evidence_confirmation"
    },
    "dhr_op03_ready": { "const": true },
    "dhr_op03_schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_elr19.dhr.op03_elr_op17_dmd_compatible_receipt_candidate_extraction.bodyfree.v1"
    },
    "dhr_op04_input_ready": { "const": true },
    "external_actual_operation_evidence_claim_bodyfree_optional": {
      "type": "object"
    },
    "dhr_op04_called_here": { "const": false },
    "dhr_op05_auto_call_allowed": { "const": false },
    "downstream_auto_execution_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 10.3 DHR-OP04 result capture schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_dri.mrb.dhr_op04_result_capture.bodyfree.v1",
  "title": "P7 R54 AHR Post-DRI MRB DHR-OP04 Result Capture Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "material_kind",
    "review_session_id",
    "dhr_op04_called_by_manual_reintake_boundary",
    "dhr_op04_called_by_dri",
    "dhr_op04_contract_valid",
    "dhr_op04_status_ref",
    "mrb_result_status_ref",
    "actual_source_claim_confirmed_for_downstream_handoff",
    "actual_source_claim_bodyfree",
    "actual_source_claim_origin_ref",
    "dhr_op04_next_required_step_ref",
    "mrb_next_required_step",
    "dhr_op05_called_here",
    "dhr_op06_called_here",
    "dmd_execution_started_here",
    "r52_actual_execution_started_here",
    "p5_final_allowed",
    "p6_start_allowed",
    "p8_start_allowed",
    "p8_question_design_started",
    "p8_question_implementation_started",
    "p7_complete",
    "release_allowed",
    "downstream_auto_execution_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dri.mrb.dhr_op04_result_capture.bodyfree.v1"
    },
    "material_kind": {
      "const": "dhr_op04_manual_reintake_result_capture"
    },
    "review_session_id": {
      "type": "string",
      "minLength": 1,
      "maxLength": 180
    },
    "dhr_op04_called_by_manual_reintake_boundary": { "const": true },
    "dhr_op04_called_by_dri": { "const": false },
    "dhr_op04_contract_valid": { "type": "boolean" },
    "dhr_op04_status_ref": {
      "enum": [
        "DHR_ACTUAL_SOURCE_CLAIM_CONFIRMED_BODYFREE",
        "DHR_ACTUAL_SOURCE_CLAIM_NOT_CONFIRMED_RETRY_OR_START_REQUIRED",
        "DHR_ACTUAL_SOURCE_WAITING_FOR_EXTERNAL_BODYFREE_CLAIM",
        "DHR_ACTUAL_SOURCE_INVALID_REPAIR_REQUIRED"
      ]
    },
    "mrb_result_status_ref": {
      "enum": [
        "MRB_STATUS_DHR_OP04_CONFIRMED_BODYFREE_STOPPED",
        "MRB_STATUS_DHR_OP04_NOT_CONFIRMED_RETRY_OR_START_REQUIRED_STOPPED",
        "MRB_STATUS_DHR_OP04_WAITING_EXTERNAL_CLAIM_STOPPED",
        "MRB_STATUS_DHR_OP04_INVALID_REPAIR_REQUIRED_STOPPED"
      ]
    },
    "actual_source_claim_confirmed_for_downstream_handoff": { "type": "boolean" },
    "actual_source_claim_bodyfree": { "type": "boolean" },
    "actual_source_claim_origin_ref": {
      "type": "string",
      "maxLength": 220
    },
    "dhr_op04_next_required_step_ref": {
      "type": "string",
      "maxLength": 260
    },
    "mrb_next_required_step": {
      "enum": [
        "manual_review_dhr_op04_confirmed_bodyfree_result_before_any_dhr_op05",
        "manual_review_dhr_op04_not_confirmed_result_and_decide_retry_or_start_without_auto_execution",
        "wait_for_external_bodyfree_actual_source_claim_before_manual_dhr_op04_reintake",
        "repair_post_dri_to_dhr_op04_manual_reintake_boundary"
      ]
    },
    "dhr_op05_called_here": { "const": false },
    "dhr_op06_called_here": { "const": false },
    "dmd_execution_started_here": { "const": false },
    "r52_actual_execution_started_here": { "const": false },
    "p5_final_allowed": { "const": false },
    "p6_start_allowed": { "const": false },
    "p8_start_allowed": { "const": false },
    "p8_question_design_started": { "const": false },
    "p8_question_implementation_started": { "const": false },
    "p7_complete": { "const": false },
    "release_allowed": { "const": false },
    "downstream_auto_execution_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 10.4 branch result schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_dri.mrb.branch_result.bodyfree.v1",
  "title": "P7 R54 AHR Post-DRI MRB Branch Result Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "review_session_id",
    "mrb_branch_ref",
    "mrb_allowed_branch_refs",
    "next_required_step",
    "ready_to_call_dhr_op04_manually_no_downstream_auto_execution",
    "dhr_op04_result_captured",
    "dhr_op04_called_by_manual_reintake_boundary",
    "waiting_for_dri_or_dhr_op03_material",
    "repair_required_before_dhr_op04_call",
    "bodyfree_leak_promotion_or_autorun_blocked",
    "manual_hold_unresolved_no_promotion",
    "branch_reason_refs",
    "branch_blocker_refs",
    "dhr_op05_auto_call_allowed",
    "downstream_auto_execution_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dri.mrb.branch_result.bodyfree.v1"
    },
    "operation_step_ref": {
      "const": "MRB-OP06_dhr_op04_result_classifier_stop_boundary"
    },
    "review_session_id": {
      "type": "string",
      "minLength": 1,
      "maxLength": 180
    },
    "mrb_branch_ref": {
      "enum": [
        "MRB_STATUS_READY_TO_CALL_DHR_OP04_MANUALLY_NO_DOWNSTREAM_AUTO_EXECUTION",
        "MRB_STATUS_DHR_OP04_CONFIRMED_BODYFREE_STOPPED",
        "MRB_STATUS_DHR_OP04_NOT_CONFIRMED_RETRY_OR_START_REQUIRED_STOPPED",
        "MRB_STATUS_DHR_OP04_WAITING_EXTERNAL_CLAIM_STOPPED",
        "MRB_STATUS_DHR_OP04_INVALID_REPAIR_REQUIRED_STOPPED",
        "MRB_STATUS_WAITING_FOR_DRI_OR_DHR_OP03_MATERIAL",
        "MRB_STATUS_REPAIR_REQUIRED_BEFORE_DHR_OP04_CALL",
        "MRB_STATUS_BLOCKED_BODYFREE_LEAK_PROMOTION_OR_AUTORUN",
        "MRB_STATUS_MANUAL_HOLD_UNRESOLVED_NO_PROMOTION"
      ]
    },
    "mrb_allowed_branch_refs": {
      "type": "array",
      "minItems": 9,
      "maxItems": 9,
      "items": { "type": "string" }
    },
    "next_required_step": {
      "type": "string",
      "maxLength": 260
    },
    "ready_to_call_dhr_op04_manually_no_downstream_auto_execution": { "type": "boolean" },
    "dhr_op04_result_captured": { "type": "boolean" },
    "dhr_op04_called_by_manual_reintake_boundary": { "type": "boolean" },
    "waiting_for_dri_or_dhr_op03_material": { "type": "boolean" },
    "repair_required_before_dhr_op04_call": { "type": "boolean" },
    "bodyfree_leak_promotion_or_autorun_blocked": { "type": "boolean" },
    "manual_hold_unresolved_no_promotion": { "type": "boolean" },
    "branch_reason_refs": {
      "type": "array",
      "items": { "type": "string", "maxLength": 220 }
    },
    "branch_blocker_refs": {
      "type": "array",
      "items": { "type": "string", "maxLength": 220 }
    },
    "dhr_op05_auto_call_allowed": { "const": false },
    "downstream_auto_execution_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

---

## 11. target test設計

### 11.1 MRB-OP00 / OP01 tests

```text
test_mrb_op00_refreezes_scope_no_touch_no_promotion
test_mrb_op00_keeps_p8_and_release_flags_false
test_mrb_op01_accepts_dri_op12_closed_and_dri_op10_ready_branch
test_mrb_op01_does_not_treat_dri_op12_as_dhr_op04_called
test_mrb_op01_waits_when_dri_op10_is_waiting
test_mrb_op01_repairs_when_dri_op10_contract_invalid
test_mrb_op01_blocks_when_dri_op10_bodyfree_or_promotion_blocked
```

### 11.2 MRB-OP02 / OP03 tests

```text
test_mrb_op02_extracts_dri_op09_candidate_bodyfree
test_mrb_op02_requires_dhr_op04_readable_candidate_keys
test_mrb_op02_rejects_candidate_with_raw_input_comment_text_question_text_path_hash_or_terminal_body
test_mrb_op02_blocks_candidate_with_downstream_promotion_claim
test_mrb_op02_preserves_dri_candidate_not_dhr_confirmed_boundary
test_mrb_op03_accepts_dhr_op03_ready_material
test_mrb_op03_does_not_treat_op03_receipt_shape_as_actual_source_confirmation
test_mrb_op03_waits_when_dhr_op03_waiting
test_mrb_op03_repairs_when_dhr_op03_contract_invalid
```

### 11.3 MRB-OP04 / OP05 tests

```text
test_mrb_op04_requires_manual_reintake_request_bodyfree
test_mrb_op04_builds_dhr_op04_input_envelope_without_calling_dhr_op04
test_mrb_op04_keeps_dhr_op05_auto_call_false
test_mrb_op05_calls_existing_dhr_op04_only_when_manual_request_and_inputs_ready
test_mrb_op05_does_not_call_dhr_op04_when_manual_request_missing
test_mrb_op05_captures_dhr_op04_confirmed_result_and_stops
test_mrb_op05_captures_dhr_op04_not_confirmed_result_and_stops
test_mrb_op05_captures_dhr_op04_waiting_result_and_stops
test_mrb_op05_captures_dhr_op04_invalid_result_and_stops
test_mrb_op05_never_calls_dhr_op05_or_dhr_op06
```

### 11.4 MRB-OP06 / OP07 tests

```text
test_mrb_op06_maps_confirmed_result_to_confirmed_stopped_branch
test_mrb_op06_maps_not_confirmed_result_to_retry_or_start_stopped_branch
test_mrb_op06_maps_waiting_result_to_waiting_stopped_branch
test_mrb_op06_maps_invalid_result_to_repair_stopped_branch
test_mrb_op06_selects_exactly_one_branch
test_mrb_op06_keeps_downstream_auto_execution_false_for_all_branches
test_mrb_op07_allows_only_mrb_helper_tests_and_result_memo_changed_files
test_mrb_op07_blocks_cocolon_rn_api_db_response_key_runtime_or_p8_question_changes
test_mrb_op07_requires_selected_regression_and_compileall_refs
```

### 11.5 MRB-OP08 result tests

```text
test_mrb_op08_result_memo_closes_bodyfree_when_targets_and_selected_regression_recorded
test_mrb_op08_records_dhr_op04_result_but_not_dhr_op05_execution
test_mrb_op08_keeps_p8_p7_release_false
test_mrb_op08_rejects_result_memo_with_raw_body_or_question_text
test_mrb_op08_does_not_claim_full_backend_suite_green_when_not_run
```

---

## 12. 実装段階のvalidation command案

実装段階では、target splitを基本にします。combined runは、環境で完走した場合のみgreenと書けます。タイムアウトした場合はcombined greenを主張しません。

### 12.1 新規MRB target

```bash
cd /mnt/data/cocolon_work/mashos-api/ai

python3 -m pytest \
  tests/test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op00_op01_20260705.py \
  tests/test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op02_op03_20260705.py \
  tests/test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op04_op05_20260705.py \
  tests/test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op06_op07_20260705.py \
  tests/test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op08_result_20260705.py
```

### 12.2 DRI selected regression

最低限、DRI後半とresult memoは再確認します。

```bash
python3 -m pytest \
  tests/test_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_dri_op08_op09_20260705.py \
  tests/test_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_dri_op10_op11_20260705.py \
  tests/test_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_dri_op12_result_20260705.py
```

実装時にDRI OP04〜OP07材料を再生成・再接続する場合は、次も追加します。

```bash
python3 -m pytest \
  tests/test_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_dri_op04_op05_20260705.py \
  tests/test_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_dri_op06_op07_20260705.py
```

### 12.3 DHR selected regression

```bash
python3 -m pytest \
  tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op02_op03_20260704.py \
  tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op04_op05_20260704.py
```

### 12.4 compileall

```bash
python3 -m compileall -q \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_dri_dhr_op04_manual_reintake_20260705.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_20260705.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py
```

### 12.5 no-touch grep案

```bash
grep -R "p8_question\|question_trigger\|question_schema\|response_key\|runtime_prompt\|migration\|schema.sql" \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_dri_dhr_op04_manual_reintake_20260705.py \
  tests/test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_*_20260705.py
```

grepで該当が出た場合、設計意図に反する可能性が高いため、実装差分を停止して確認します。

---

## 13. result memoに残すべきvalidation summary

result memoには、次をbody-freeで残します。

```text
MRB target tests:
  MRB-OP00/OP01: xx passed
  MRB-OP02/OP03: xx passed
  MRB-OP04/OP05: xx passed
  MRB-OP06/OP07: xx passed
  MRB-OP08: xx passed

DRI selected regression:
  DRI-OP08/OP09: xx passed
  DRI-OP10/OP11: xx passed
  DRI-OP12: xx passed

DHR selected regression:
  DHR-OP02/OP03: xx passed
  DHR-OP04/OP05: xx passed

compileall:
  passed / failed

combined run:
  not run / timeout / passed
```

combined runが未実行またはtimeoutの場合:

```text
full_backend_suite_green_confirmed: false
combined_mrb_dri_dhr_green_confirmed: false
```

DHR-OP04結果欄:

```text
dhr_op04_called_by_manual_reintake_boundary: true / false
dhr_op04_status_ref: <DHR status or not_called>
actual_source_claim_confirmed_for_downstream_handoff: true / false
dhr_op05_called_here: false
dmd_execution_started_here: false
r52_actual_execution_started_here: false
p8_start_allowed: false
release_allowed: false
next_required_step: <manual decision / wait / repair>
```

---

## 14. 実装時の禁止事項

```text
- DRI helper内からDHR-OP04を自動呼び出ししない。
- MRB helperでmanual_reintake_request_bodyfreeなしにDHR-OP04を呼ばない。
- DHR-OP04結果をDHR-OP05 / DHR-OP06 / DHR-OP08 / DMD / R52へ自動接続しない。
- DHR-OP04 confirmedをP5 final / P6 start / P8 start / P7 complete / release readyへ昇格しない。
- DRI candidateをDHR confirmed resultとして扱わない。
- DHR-OP03 receipt shapeをactual source claim confirmedとして扱わない。
- question need observation rowsをP8 question spec / question_textへ変換しない。
- API / DB / RN / response keyを変更しない。
- actual body-full packetを生成しない。
- actual local-only human reviewを実行しない。
- actual operation receipt / rows / purgeをhelperが新規作成したと扱わない。
- body-full / raw input / comment_text / reviewer free text / question_text / local path / hash / terminal bodyをresult memoへ入れない。
```

---

## 15. 実装時の完了条件

実装完了と呼べる条件は次です。

```text
- MRB-OP00〜OP08 helperがbody-free / no-touch / no-promotionで実装されている。
- DRI-OP09 / OP10 / OP12 input条件がassert contractで固定されている。
- DHR-OP03 ready materialがassert contractで固定されている。
- manual_reintake_request_bodyfreeなしではDHR-OP04が呼ばれない。
- explicit manual requestありのready pathで、既存DHR-OP04 resultをcaptureできる。
- DHR-OP04 confirmed / not_confirmed / waiting / invalid の各分岐がtestで固定されている。
- どの分岐でもDHR-OP05以降へ自動で進まない。
- DMD / R52 / P5 / P6 / P8 / P7 / release flagsがfalseで固定されている。
- MRB target testsがsplit greenで記録されている。
- DRI selected regression / DHR selected regression / compileallが記録されている。
- combined runが通っていない場合はcombined greenを主張していない。
- result memoにraw/body-like materialを残していない。
```

この条件を満たしても、次はまだ未完了です。

```text
- DHR-OP05以降のmanual handoff判断
- DMD execution
- R52 actual execution
- P5 final
- P6 start
- P8 start
- P7 complete
- release ready
```

---

## 16. MRB後の次工程候補

MRB-OP08まで実装・target確認が終わった場合、次工程はDHR-OP04結果により分かれます。

### 16.1 DHR-OP04 confirmed body-free stopped

```text
next candidate:
  DHR-OP05以降へ進むかをmanual decisionとして設計する。

ただし:
  DHR-OP05 auto callはまだしない。
  DMD/R52/P8/releaseへは進めない。
```

### 16.2 DHR-OP04 not confirmed / retry or start required stopped

```text
next candidate:
  actual local-only human review operation retry/startへ戻すか、DHR側で必要なexternal body-free source claimを再確認する。

ただし:
  P8 questionで補う方向へ進めない。
```

### 16.3 DHR-OP04 waiting external claim stopped

```text
next candidate:
  external body-free actual source claimの不足材料を確認する。

ただし:
  raw evidenceやbody-full packetをMRB resultへ入れない。
```

### 16.4 DHR-OP04 invalid / repair stopped

```text
next candidate:
  source_kind / origin / body_free / promotion / OP03 ready materialのどこが壊れているかをrepair対象として切り分ける。
```

---

## 17. Cocolonとしての判断

この設計は、単にhelperを一枚増やすためのものではありません。DRI candidateができたことと、DHR-OP04が実際に判定したことを分けるための設計です。

Cocolonとして、ここを雑にすると、次の誤読が起きます。

```text
candidateができた
  -> 人間レビューが成立した
  -> DHR confirmedになった
  -> P8やreleaseに近づいた
```

この流れは危険です。Cocolonが人間の言葉を雑に処理しない場所であるなら、Cocolon自身の品質証跡も雑に扱わない必要があります。

本設計では、DRI adapter candidateをDHR-OP04へ渡し、DHR-OP04の判定を得て、そこで止めます。これは地味ですが、P7の実レビュー証跡境界を壊さないために必要な小さい段階です。

---

## 18. 華恋の意見

華恋としては、このMRB helperは「あると安全」だと考えます。

理由は、既存DRI helperと既存DHR helperだけでも、手動でDHR-OP04 builderへcandidateを渡すこと自体は可能に見えます。しかし、その場合、どの材料を組み合わせたのか、manual requestが明示されていたのか、DHR-OP04後に止まったのかが、targetとresult memoで見えにくくなります。

ここで必要なのは、処理を増やすことではなく、誤読の余地を減らすことです。

```text
- DRIが作ったcandidate
- DHR-OP03 ready material
- manual re-intake request
- DHR-OP04 result
- DHR-OP04後の停止
```

この5つを一つのbody-free MRB resultで見えるようにしておくと、次にDHR-OP05へ進むか、retry/startへ戻るか、repairするかを、嘘なく判断できます。

逆に、MRBを作らずにDHR-OP05以降へ進むのは早いです。P8へ進むのも早いです。今は、P7の実レビュー証跡を小さく、確実に、DHR-OP04へ通すところまでに留めるべきです。

---

## 19. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- 今回の設計対象はP7-R54-AHR Post-DRI / DHR-OP04 Manual Re-intake Boundary。
- P8 question design / implementationは対象外。
- DRI-OP09 candidateはDHR-OP04 readableだが、DHR-OP04を呼ばない。
- DRI-OP10 ready branchはdownstream auto execution allowedではない。
- DRI-OP12 result memo closureはP8 start / P7 complete / release readyではない。
- DHR-OP04には external_actual_operation_evidence_claim_bodyfree_optional の受け口がある。
- DHR-OP04はDHR-OP03 ready materialも確認する。
- DRI / RSR source kindとDHR / DMD expected source kindはactual_local_only_human_review_by_personで一致する。
- DRI adapter originとDHR expected external actual source originは一致する。
- MRBは薄い明示手動境界として設計する。
- 本設計ではコード変更しない。
```

### 未確認

```text
- MRB helper / target testsの実装結果。
- DRI candidateをDHR-OP04へ手動投入した実行結果。
- DHR-OP04 confirmed / not_confirmed / waiting / invalid の実際の分岐。
- DHR-OP04後のmanual decision結果。
- DHR-OP05以降の進行可否。
- full backend suite green。
- RN contract / RN real-device modal verified。
```

### 書かれていない

```text
- MRBなしでDHR-OP05へ進んでよい、とは書かれていない。
- DHR-OP04 confirmedをDHR-OP05以降へ自動昇格してよい、とは書かれていない。
- DRI candidateをDHR confirmed resultとして扱ってよい、とは書かれていない。
- question need rowsをP8 question textへ変換してよい、とは書かれていない。
- API / DB / RN / response keyを今回変更してよい、とは書かれていない。
```

### 推測禁止

```text
- DRI candidate materializedをDHR-OP04 calledと推測しない。
- DHR-OP04 input candidateをDHR confirmed resultと推測しない。
- DHR-OP04 confirmedが出てもDHR-OP05 / DMD / R52 / P8 / releaseへ進めると推測しない。
- OP03 receipt shape validをactual source claim confirmedと推測しない。
- helper greenをactual human review executionと推測しない。
- combined run未完了をcombined greenと推測しない。
```

### 次に実行すべきこと

```text
1. 実装段階では、MRB helperを薄く新規追加する。
2. MRB-OP00〜OP08を実装する。
3. DRI-OP09 / OP10 / OP12とDHR-OP03 ready materialのassert contractを先に固定する。
4. manual_reintake_request_bodyfreeがある場合だけDHR-OP04を呼ぶ。
5. DHR-OP04 resultをcapturedしたら必ず停止する。
6. DHR-OP05 / DMD / R52 / P8 / releaseへは自動進行しない。
7. target split / DRI selected regression / DHR selected regression / compileall / no-touchを記録する。
8. combined runが未完了またはtimeoutならcombined greenを主張しない。
```

---

## 20. 最終判断

次の実装段階で進めるべきものは、次です。

```text
P7-R54-AHR Post-DRI / DHR-OP04 Manual Re-intake Boundary
MRB-OP00〜MRB-OP08
```

実装方針は次で固定します。

```text
- 新しい大きなDHRやDMDを作らない。
- 既存DRI candidateと既存DHR-OP04を、薄いMRB helperで明示手動接続する。
- DHR-OP04を呼ぶ条件を厳密にする。
- DHR-OP04結果を得たら止める。
- DHR-OP05以降、DMD、R52、P8、releaseへは進めない。
```

Cocolonとして在るべき姿に照らすと、今は問いを足して広げる段階ではありません。実レビュー証跡をbody-freeで正しくDHR-OP04へ戻し、DHR-OP04の判定を見える形で止める段階です。
