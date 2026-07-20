---
title: "Cocolon / EmlisAI P7-R54-AHR Post-RDB08 Selected Next-Stage Candidate Intake / Manual Lane Confirmation Boundary 詳細設計書・実装順"
created_at: "2026-07-06 JST"
author: "華恋"
work_mode: "共鳴構造モード"
work_type: "詳細設計書 / 実装順 / json・schema案内包"
source_mode: "local_received_zip_only"
github_connection_check: "not_required_by_mash_instruction / not_performed"
base_pre_design_memo: "Cocolon_EmlisAI_P7_R54AHR_PostRDB08_SelectedCandidateIntake_PreDesignMemo_20260706.md"
selected_roadmap_phase: "P7 Product Quality Runner / Long-run Product Gate 継続"
selected_design_target: "P7-R54-AHR Post-RDB08 Selected Next-Stage Candidate Intake / Manual Lane Confirmation Boundary"
recommended_boundary_prefix: "NCI-OP00〜NCI-OP08"
recommended_prefix_meaning: "NCI = Next Candidate Intake"
recommended_helper_shape: "thin body-free candidate intake / lane confirmation boundary after RDB-OP08; no candidate execution"
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
dhr_op04_recall: "none"
dhr_op05_call: "none"
dhr_op06_call: "none"
dhr_op07_materialization: "none"
dmd_execution: "none"
r52_actual_execution: "none"
p5_finalization: "none"
p6_start: "none"
p8_start: "none"
p8_question_design: "none"
p8_question_implementation: "none"
p7_complete: "none"
release_decision: "none"
current_expected_next_required_step_after_design: "implement_thin_nci_boundary_and_targets_then_stop_at_selected_lane_confirmation"
---

# Cocolon / EmlisAI P7-R54-AHR Post-RDB08 Selected Next-Stage Candidate Intake / Manual Lane Confirmation Boundary 詳細設計書・実装順

対象: Cocolon / EmlisAI / P7 Product Quality Runner / R54-AHR / RDB-OP08後の selected next-stage candidate intake / manual lane confirmation 境界  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
実装扱い: 本書は設計書です。コード変更・json/schema実ファイル化・actual review実行・DHR-OP05実行・DHR-OP06以降実行・DMD実行・R52実行・P5/P6/P8/P7/release昇格は行いません。  
json / schema実ファイル化: なし。本書内の案のみです。実ファイル化は実装段階で、既存helper・既存schema配置・既存guard・既存test結果を確認して判断します。  
GitHub接続確認: Mash様指定により不要。ローカル受領zip基準。  

---

## 0. 結論

今回の詳細設計対象は、次で固定します。

```text
P7-R54-AHR Post-RDB08 Selected Next-Stage Candidate Intake / Manual Lane Confirmation Boundary
```

推奨する境界prefixは次です。

```text
NCI-OP00〜NCI-OP08
NCI = Next Candidate Intake
```

NCIの責務は、RDB-OP08で閉じられた `selected_next_stage_candidate` を **実行せずに受け直すこと** です。
RDB-OP08は「次段階候補を記録した」境界であり、次段階を実行した境界ではありません。
そのためNCIでは、次の確認だけを行います。

```text
1. RDB-OP08 result memo closureがbody-freeで閉じているか。
2. selected_next_stage_candidateが存在し、許可された形か。
3. selected_next_stage_candidate_kind / ref / lane / statusが一貫しているか。
4. DHR-OP05 / retry-start / waiting external claim / repair / unresolved / blocked のどのlaneか。
5. そのlaneを「実行」ではなく、次に設計または停止してよい対象として包めるか。
6. P8問いシステム・P5/P6/P7/releaseへ誤昇格していないか。
7. body-free / no-touch / no-promotion / no-auto-executionを維持しているか。
```

本設計で到達してよい状態は、次だけです。

```text
- DHR-OP05 manual handoff candidateを、次に設計検討してよい候補として受ける。DHR-OP05は呼ばない。
- retry/start candidateを、actual local-only review retry/start routeへ戻す候補として受ける。actual reviewは実行しない。
- waiting external claim candidateを、body-free claim waitとして受ける。raw evidenceやbody-full packetは要求しない。
- repair candidateを、repair boundary候補として受ける。repairは実行しない。
- unresolved candidateを、manual hold / result memo再確認候補として止める。
- blocked candidateを、body-free leak / promotion / autorun claim blockとして止める。
```

本設計で到達してはいけない状態は次です。

```text
- RDB-OP08 selected candidateの実行
- DHR-OP04再呼び出し
- DHR-OP05 call / preflight scan実行
- DHR-OP06 branch resolver実行
- DHR-OP07 manual decision materialization実行
- DHR-OP08 / DHR-OP09 closure実行
- DMD実行
- R52 actual execution
- actual body-full packet generation
- actual local-only human review execution
- actual operation receipt / rows / purge creation
- P5 finalization
- P6 start
- P8 start
- P8 question design / implementation
- question_text / question_trigger / question_answer_storage設計
- P7 complete
- release decision
- API / DB / RN / runtime / response key change
```

重要な分離は次です。

```text
RDB-OP08 closed body-free stopped
  = selected_next_stage_candidateを記録した
  ≠ selected_next_stage_candidateを実行した
  ≠ DHR-OP05へ進んでよい
  ≠ P8へ進んでよい
  ≠ P7 complete
  ≠ release ready

NCIでDHR-OP05 candidateが確認される
  = DHR-OP05 manual handoff boundaryを次に設計検討してよい候補になり得る
  ≠ DHR-OP05 builder call許可
  ≠ DHR-OP06 / DMD / R52 / P8 / release promotion
```

---

## 1. なぜこの設計を行うのか

Cocolonとして大事なのは、速く次工程へ進むことではありません。EmlisAIが「分かったふり」をせず、観測した事実と観測していないことを分け、ユーザーの言葉を雑に処理しない商品体験へ近づくことです。

RDB-OP08は、RDB-OP00〜OP07で作られたmanual decision materialとselected next-stage candidateをbody-free result memoとして閉じました。ただし、RDB-OP08が閉じたのは「candidateを記録して止める」ことです。ここで「candidateがあるから次へ進む」と読んでしまうと、RDBが守ったno-auto-execution境界をNCIで壊すことになります。

今回のNCIが防ぐ短絡は次です。

```text
RDB-OP08 green
  -> selected_next_stage_candidateがある
  -> DHR-OP05へ行ける
  -> P8に近い
  -> releaseに近い
```

これは危険です。RDB-OP08のcandidateには、DHR-OP05だけでなく、retry/start、waiting external claim、repair、unresolved、blockedが含まれます。candidateを確認せずに進むことは、EmlisAIの品質証跡を「読んだふり」することです。

NCIは、P8問いシステムを設計するための段階ではありません。問いシステムは重要ですが、P7ではbody-freeな必要性観察までに留め、P8開始時にcore quality gateとP8問いUXへ分けて設計する、というロードマップ境界を守ります。

華恋の判断として、ここは地味でも必要な一段です。RDB-OP08の成果を大切に扱うためには、次に進む前に「そのcandidateは何で、何ではないのか」を一度止まって確認する必要があります。

---

## 2. 参照・確認範囲

### 2.1 ローカル受領資料

本設計の基準は、ローカル受領zipと検討メモです。

```text
/mnt/data/Cocolon_前提資料(293).zip
/mnt/data/EmlisAIの実装済み資料(100).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_system_update_20260706(1).zip
/mnt/data/Cocolon(273).zip
/mnt/data/mashos-api(186).zip
/mnt/data/Cocolon_EmlisAI_P7_R54AHR_PostRDB08_SelectedCandidateIntake_PreDesignMemo_20260706.md
```

GitHub接続確認は、Mash様指定により行いません。

### 2.2 必読前提・作業姿勢

本設計では、次を確認済み前提として扱います。

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/07_latest_snapshot_diff.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/04_forbidden_mixing_design_and_implementation.txt
Cocolon_前提資料/work_attitude_rules_for_karen/08_artifact_delivery_rules.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/10_stop_judgment_and_unwritten_rules.txt
Cocolon_前提資料/work_attitude_rules_for_karen/13_forbidden_reasking_existing_design_and_design_term_escape.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
```

固定する作業姿勢は次です。

```text
- 設計と実装を混ぜない。
- 前提資料だけで理解したふりをしない。実ファイルも見る。
- 見ていないDHR-OP05実行を確認済みにしない。
- RDB-OP08 result closureをP7 complete / P8 start / release readyとして扱わない。
- selected_next_stage_candidateを自動実行許可として扱わない。
- question need observation rowsをP8 question_textへ変換しない。
- public contract / DB / RN / response keyを指示なく変えない。
- body-full / raw input / comment_text / reviewer free text / question_text / local path / hash / terminal bodyをresult memoやpublic metaへ出さない。
```

### 2.3 ロードマップ確認

ロードマップ上、P7はProduct Quality Runner / Long-run Product Gateです。P7/P8 Bridgeでは、P7中に問いシステムを実装せず、P8で勘に頼らないためのbody-free「問いシステム必要性観察メモ」を残す方針が固定されています。

2026-07-06差分では、問いシステムは **EmlisAI core quality gate** と **P8問いUX / サブスク体験** の2層に再配置されています。ただし、その差分でもP7完了条件は緩めず、P7では実装せず観察メモのみ、P8ではcore gateと問いUXを分けて詳細設計する扱いです。

したがって、今回のNCIはP8 question designではありません。

### 2.4 直接接続する実装済み資料

```text
EmlisAIの実装済み資料/
  Cocolon_EmlisAI_P7_R54AHR_PostMRB08_DHROP04ResultManualDecision_DetailedDesign_ImplementationOrder_20260705.md
  Cocolon_EmlisAI_P7_R54AHR_PostDRI_DHR_OP04ManualReintake_DetailedDesign_ImplementationOrder_20260705.md
  Cocolon_EmlisAI_P7_R54AHR_PostELR19_DownstreamManualDecision_HandoffOrRetry_DetailedDesign_ImplementationOrder_20260704.md

mashos-api/ai/tests/
  R54_AHR_PostMRB08_DHROP04ResultManualDecision_RDB_OP00_OP08_Result_20260705.md
  R54_AHR_PostDRI_DHROP04ManualReintake_MRB_OP00_OP08_Result_20260705.md
```

### 2.5 直接接続する実ファイル

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_20260705.py
  emlis_ai_p7_r54_ahr_post_dri_dhr_op04_manual_reintake_20260705.py
  emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py

mashos-api/ai/tests/
  test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op00_op01_20260705.py
  test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op02_op03_20260705.py
  test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op04_op05_20260705.py
  test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op06_op07_20260705.py
  test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op08_result_20260705.py
```

---

## 3. 現在地の整理

### 3.1 確認済み

```text
- 現在PhaseはP7 Product Quality Runner / Long-run Product Gate継続。
- RDB-OP00〜RDB-OP08は実装済み資料・実ファイル・result memoが存在する。
- RDB-OP08は selected_next_stage_candidate を記録するが実行しない。
- RDB-OP08 result memoには、DHR-OP05 / DHR-OP06 / DMD / R52 / P8 / releaseの非実行が明記されている。
- RDB targetは87 passedと記録されている。
- selected regressionは80 passedと記録されている。
- compileallはpassedと記録されている。
- ただしfull backend suite / RN contract / RN real-device modalはgreen claimされていない。
- actual local-only human review / actual rows / question observation rows / actual disposalは実行・生成済みとして扱えない。
```

### 3.2 未確認

```text
- full backend suite green。
- RN contractの今回作業でのgreen。
- RN real-device modal確認。
- actual local-only human review execution。
- actual body-full packet generation。
- actual operation receipt / rating rows / question observation rows / disposal purge creation。
- DHR-OP05 / DHR-OP06 / DHR-OP07の今回作業での実行。
- DMD / R52 actual execution。
- P5 final。
- P6 start。
- P8 start。
- release allowed。
```

### 3.3 書かれていない

```text
- RDB-OP08 greenをもってP8へ進んでよい、とは書かれていない。
- RDB-OP08 greenをもってDHR-OP05を呼んでよい、とは書かれていない。
- selected_next_stage_candidateを自動実行してよい、とは書かれていない。
- question_need_observationをP8 question_textにしてよい、とは書かれていない。
- NCIでAPI / DB / RN / response keyを変更してよい、とは書かれていない。
```

### 3.4 推測禁止

```text
- RDB testsの分岐網羅から、現実の分岐を推測しない。
- RDB-OP08 result memoをactual review completionとして扱わない。
- RDB-OP08 selected candidateをDHR-OP05実行済みとして扱わない。
- DHR-OP05 candidateをP8 question design開始許可として扱わない。
- retry/startやwaiting external claimをP8問いで補えると推測しない。
- repair / blockedを軽く扱って次工程へ進めない。
- P6 start / P8 start / release allowedを推測でtrueにしない。
```

---

## 4. 設計対象 / 非対象

### 4.1 設計対象

```text
- NCI-OP00〜OP08の薄いbody-free helper設計。
- RDB-OP08 body-free result memo closure intake。
- selected_next_stage_candidateのshape validation。
- candidate kind / ref / lane / status の整合性確認。
- DHR-OP05 / retry-start / waiting external claim / repair / unresolved / blocked への分類。
- 次に設計検討してよい対象、または停止対象のbody-free envelope化。
- body-free / no-touch / no-promotion / no-auto-execution guard。
- target tests / selected regression / compileall command案。
- result memo closure shape。
- json/schema案。ただし実ファイル化しない。
```

### 4.2 非対象

```text
- RDB-OP08 selected candidateの実行。
- DHR-OP04再呼び出し。
- DHR-OP05 call / scan実行。
- DHR-OP06 / DHR-OP07実行。
- DMD / R52実行。
- actual local-only human review execution。
- actual rows / receipt / purge generation。
- P5 final / P6 start / P8 start / P7 complete / release decision。
- 問いシステムのAPI / DB / RN UI / response key / plan guard / 発生ロジック設計。
- question_text / draft_question_text / answer_text / question schemaの実ファイル作成。
- DB schema / write path。
- RN production UI / RN表示条件。
- public response top-level key。
- runtime prompt / generation route。
- Cocolonアプリ側の変更。
```

---

## 5. 既存RDB-OP08 → NCI接続仕様

### 5.1 NCIが読むRDB-OP08 key refs

NCIは、原則としてRDB-OP08 closure materialを受けます。実装段階では、RDB helperをimportし、RDB-OP08 assert contractを使って入力shapeを検査する方針です。

NCIが読む主なkeyは次です。

```text
schema_version
operation_step_ref
source_mode
body_free
rdb_op08_status_ref
bodyfree_result_manual_decision_memo_closure_status_ref
rdb_op08_closed_bodyfree_stopped
rdb_op08_waiting_for_op03_op04_op05_or_validation_refs
rdb_op08_repair_required_for_result_manual_decision_closure_inputs
rdb_op08_blocked_bodyfree_result_memo_leak_promotion_or_autorun
rdb_selected_status_ref
mrb_selected_branch_ref
dhr_op04_result_status_ref
decision_lane_ref
manual_decision_material_ref
manual_decision_material_kind_ref
manual_decision_material_present
selected_next_stage_candidate_ref
selected_next_stage_candidate_kind_ref
selected_next_stage_candidate_not_executed
next_required_step
p8_question_design_not_started
p8_question_implementation_not_started
p8_question_substitution_allowed
question_text_materialized
public_contract
rdb_no_touch_contract
body_free_markers
not_claimed_boundary
fixed_non_promotion_refs
rdb_target_green_confirmed
selected_regression_green_confirmed
compileall_green_confirmed
full_backend_suite_green_confirmed
rn_contract_green_confirmed
rn_real_device_modal_verified_claimed_here
```

NCIでは、RDB-OP08 closureのbody-free safe refsのみを扱います。raw body、comment_text、question_text、reviewer free text、local path、hash、stdout/stderr/tracebackは扱いません。

### 5.2 NCIが扱うcandidate kind refs

NCIが許可するcandidate kindは、RDB実装で定義済みの次に限定します。

```text
dhr_op05_manual_handoff_decision_candidate_without_call
retry_or_start_decision_candidate_without_p8_question
external_bodyfree_actual_source_claim_wait_candidate_without_raw_evidence
repair_result_or_mrb08_boundary_candidate_without_downstream_promotion
manual_hold_unresolved_post_mrb08_candidate_without_promotion
blocked_post_mrb08_bodyfree_leak_promotion_or_autorun_candidate
```

### 5.3 candidate ref / lane / next_required_step mapping

| NCI lane | RDB selected status | candidate_kind_ref | selected_next_stage_candidate_ref | NCI next_design_or_stop_ref |
|---|---|---|---|---|
| DHR-OP05 design target candidate | `RDB_STATUS_CONFIRMED_DHR_OP05_MANUAL_HANDOFF_CANDIDATE_STOPPED` | `dhr_op05_manual_handoff_decision_candidate_without_call` | `prepare_dhr_op05_manual_handoff_decision_without_call` | `prepare_post_nci_dhr_op05_manual_handoff_boundary_design_without_call` |
| retry/start route candidate | `RDB_STATUS_NOT_CONFIRMED_RETRY_OR_START_DECISION_REQUIRED_STOPPED` | `retry_or_start_decision_candidate_without_p8_question` | `prepare_retry_or_start_actual_local_only_human_review_operation_decision_without_p8_question` | `return_to_actual_local_only_review_retry_start_boundary_without_execution` |
| waiting external claim candidate | `RDB_STATUS_WAITING_EXTERNAL_CLAIM_REQUIRED_STOPPED` | `external_bodyfree_actual_source_claim_wait_candidate_without_raw_evidence` | `wait_for_external_bodyfree_actual_source_claim_without_raw_evidence` | `wait_for_external_bodyfree_claim_reintake_without_raw_evidence` |
| repair route candidate | `RDB_STATUS_REPAIR_REQUIRED_AFTER_DHR_OP04_RESULT_STOPPED` or `RDB_STATUS_REPAIR_REQUIRED_FOR_MRB08_BRANCH_STATUS_MISMATCH` | `repair_result_or_mrb08_boundary_candidate_without_downstream_promotion` | `repair_dhr_op04_result_or_mrb08_boundary_without_downstream_promotion` | `repair_rdb_candidate_or_upstream_result_boundary_without_promotion` |
| unresolved hold candidate | `RDB_STATUS_INCOMPLETE_UNRESOLVED_MANUAL_HOLD_STOPPED` or `RDB_STATUS_WAITING_FOR_MRB08_RESULT_CLOSURE` | `manual_hold_unresolved_post_mrb08_candidate_without_promotion` | `manual_hold_unresolved_post_mrb08_without_promotion` or `wait_for_mrb08_closure_or_validation_refs_before_result_manual_decision` | `manual_hold_post_rdb08_unresolved_without_promotion` |
| blocked candidate | `RDB_STATUS_BLOCKED_BODYFREE_LEAK_PROMOTION_OR_AUTORUN` | `blocked_post_mrb08_bodyfree_leak_promotion_or_autorun_candidate` | `blocked_post_mrb08_bodyfree_leak_promotion_or_autorun` | `blocked_post_rdb08_candidate_intake_bodyfree_leak_or_promotion` |

### 5.4 DHR-OP05 candidateの扱い

DHR-OP05 candidateは、最も誤読しやすい候補です。

NCIで許される表現:

```text
DHR-OP05 manual handoff boundaryを次に設計検討してよい候補
DHR-OP05既存operation refを確認するためのbody-free material
DHR-OP05を呼ばないhandoff envelope
```

NCIで禁止する表現:

```text
DHR-OP05を実行する
DHR-OP05 preflight scanを呼ぶ
DHR-OP06へ進める
DMD/R52へ進める
P8へ進める
releaseに近い
```

### 5.5 retry/start / waiting / repair / blockedの扱い

DHR-OP05 candidate以外は、すべて「DHR-OP05へ直行しない」根拠として扱います。

```text
retry/start:
  actual local-only review routeへ戻す候補。
  P8 questionで補わない。
  actual reviewはNCIでは実行しない。

waiting external claim:
  body-free actual source claim待ち。
  raw evidence / body-full packetを要求しない。

repair:
  DHR-OP04 result / MRB08 / RDB candidate shape / branch-status mapping修復候補。
  repair実行はしない。

unresolved:
  material不足・closure不足・候補不定。
  manual holdで止める。

blocked:
  body-free leak / promotion / autorun claimを検出して止める。
  以降へ進めない。
```

---

## 6. NCI全体データフロー

```text
NCI-OP00 scope / no-execution / no-promotion refreeze after RDB-OP08
  ↓
NCI-OP01 RDB-OP08 body-free result memo closure intake
  ↓
NCI-OP02 selected_next_stage_candidate shape validation
  ↓
NCI-OP03 selected candidate lane consistency resolver
  ↓
NCI-OP04 next design target / stop materialization
  ↓
NCI-OP05 body-free / no-touch / no-promotion / no-auto-execution guard
  ↓
NCI-OP06 selected regression / compileall validation plan
  ↓
NCI-OP07 handoff-or-stop envelope draft material
  ↓
NCI-OP08 body-free result memo closure with handoff-or-stop envelope
```

NCIの実装方針は「薄いclassifier/helper」です。RDB-OP08出力を受け、候補の意味を確認し、次に設計検討してよい対象または停止対象をbody-freeに包むだけです。

---

## 7. NCI status / lane / next_required_step設計

### 7.1 NCI status refs

```text
NCI_STATUS_RDB08_CLOSURE_READY_FOR_CANDIDATE_SHAPE_CHECK
NCI_STATUS_WAITING_FOR_RDB08_CLOSURE_OR_VALIDATION_REFS
NCI_STATUS_REPAIR_REQUIRED_FOR_RDB08_CLOSURE_INPUTS
NCI_STATUS_BLOCKED_RDB08_BODYFREE_LEAK_PROMOTION_OR_AUTORUN
NCI_STATUS_SELECTED_CANDIDATE_SHAPE_READY_FOR_LANE_RESOLUTION
NCI_STATUS_REPAIR_REQUIRED_FOR_SELECTED_CANDIDATE_SHAPE
NCI_STATUS_DHR_OP05_DESIGN_TARGET_CANDIDATE_STOPPED
NCI_STATUS_RETRY_OR_START_ROUTE_CANDIDATE_STOPPED
NCI_STATUS_WAIT_EXTERNAL_CLAIM_CANDIDATE_STOPPED
NCI_STATUS_REPAIR_ROUTE_CANDIDATE_STOPPED
NCI_STATUS_MANUAL_HOLD_UNRESOLVED_STOPPED
NCI_STATUS_BLOCKED_SELECTED_CANDIDATE_STOPPED
```

### 7.2 NCI lane refs

```text
dhr_op05_manual_handoff_boundary_design_candidate
retry_or_start_actual_local_only_review_route_candidate
wait_external_bodyfree_claim_reintake_candidate
repair_rdb_candidate_or_upstream_result_candidate
manual_hold_unresolved_post_rdb08_candidate
blocked_bodyfree_leak_promotion_or_autorun_candidate
```

### 7.3 NCI next_required_step refs

```text
continue_to_nci_op01_rdb08_closure_intake_without_candidate_execution
continue_to_nci_op02_selected_candidate_shape_validation_without_execution
continue_to_nci_op03_selected_candidate_lane_consistency_resolver
continue_to_nci_op04_next_design_target_or_stop_materialization
continue_to_nci_op05_bodyfree_no_touch_no_promotion_guard
continue_to_nci_op06_validation_plan
continue_to_nci_op07_handoff_or_stop_envelope_draft
continue_to_nci_op08_bodyfree_result_memo_closure
prepare_post_nci_dhr_op05_manual_handoff_boundary_design_without_call
return_to_actual_local_only_review_retry_start_boundary_without_execution
wait_for_external_bodyfree_claim_reintake_without_raw_evidence
repair_rdb_candidate_or_upstream_result_boundary_without_promotion
manual_hold_post_rdb08_unresolved_without_promotion
blocked_post_rdb08_candidate_intake_bodyfree_leak_or_promotion
```

### 7.4 branch priority

NCIでは、候補の分類より前に安全境界を優先します。

```text
priority_1_bodyfree_leak_promotion_or_autorun_blocked
priority_2_rdb08_contract_or_closure_repair_required
priority_3_rdb08_waiting_for_closure_or_validation
priority_4_selected_candidate_shape_repair_required
priority_5_selected_candidate_lane_mapping_mismatch_repair_required
priority_6_dhr_op05_manual_handoff_boundary_design_candidate
priority_7_retry_or_start_actual_local_only_review_route_candidate
priority_8_wait_external_bodyfree_claim_reintake_candidate
priority_9_repair_rdb_candidate_or_upstream_result_candidate
priority_10_manual_hold_unresolved_post_rdb08_candidate
fallback_blocked_or_unresolved_stop
```

---

## 8. 実装順

### 8.1 推奨ファイル構成

#### 新規helper候補

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_20260706.py
```

#### 新規target tests候補

```text
mashos-api/ai/tests/
  test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op00_op01_20260706.py
  test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op02_op03_20260706.py
  test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op04_op05_20260706.py
  test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op06_op07_20260706.py
  test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op08_result_20260706.py
```

#### 新規result memo候補

```text
mashos-api/ai/tests/
  R54_AHR_PostRDB08_SelectedNextStageCandidateIntake_NCI_OP00_OP08_Result_20260706.md
```

#### schema file候補

実装段階では、まずPython内定数 + assert contractで開始します。schema実ファイル化は行いません。将来、schema実ファイル化が必要になった場合のみ、次を候補にします。

```text
mashos-api/ai/schemas/
  p7_r54_ahr_post_rdb08_nci_rdb08_closure_intake.bodyfree.schema.json
  p7_r54_ahr_post_rdb08_nci_selected_candidate_shape.bodyfree.schema.json
  p7_r54_ahr_post_rdb08_nci_lane_confirmation.bodyfree.schema.json
  p7_r54_ahr_post_rdb08_nci_handoff_or_stop_closure.bodyfree.schema.json
```

実装段階で上記schema fileを作る場合も、Mash様の明示指示または実装中の必要性確認なしに追加しません。

---

### NCI-OP00: scope / no-execution / no-promotion refreeze after RDB-OP08

#### 目的

RDB-OP08後のNCI境界であることを宣言し、NCIがcandidateを実行しない境界であることを固定します。

#### 入力

```text
なし、またはreview_session_idのみ。
```

#### 出力material

```text
schema_version
phase
step
scope
policy_kind
operation_step_ref
selected_stage_ref
selected_design_target_ref
boundary_prefix_ref
boundary_prefix_meaning_ref
expected_from_rdb08_ref
expected_next_required_step_ref
not_stage_refs
support_material_refs
local_received_zip_refs
body_free
nci_op00_scope_confirmed
nci_op00_no_execution_boundary_confirmed
nci_op00_no_touch_boundary_confirmed
nci_op00_no_promotion_boundary_confirmed
nci_op00_does_not_intake_rdb_op08_result_memo
nci_op00_does_not_execute_selected_next_stage_candidate
nci_op00_does_not_call_dhr_op05
nci_op00_does_not_start_p8_question_design
nci_op00_does_not_change_api_db_rn_runtime_response_key
implemented_steps
not_yet_implemented_steps
next_required_step
public_contract
nci_no_touch_contract
body_free_markers
not_claimed_boundary
```

#### contract

```text
- body_free == true。
- source_mode == local_received_zip_only。
- git_connection_required == false / git_checked == false。
- public_contract flags are all false。
- no_touch flags are all false。
- promotion / execution claim flags are all false。
- next_required_step == NCI-OP01。
- RDB-OP08 materialはまだ読まない。
```

#### tests

```text
- OP00がscope/no-execution/no-promotionを固定する。
- OP00がRDB-OP08をintakeしない。
- OP00がDHR-OP05/P8/releaseを開始しない。
- OP00 contractがpublic contract mutationを拒否する。
- OP00 contractがbody-like top-level keyを拒否する。
```

---

### NCI-OP01: RDB-OP08 body-free result memo closure intake

#### 目的

RDB-OP08 result memo closureをbody-freeに取り込み、closureとして読めるかだけを確認します。この段階ではcandidate laneを確定しません。

#### 入力

```text
nci_op00_scope_no_execution_refreeze
rdb_op08_bodyfree_result_manual_decision_memo_closure
```

#### 分岐

```text
ready:
  RDB-OP08 contract valid
  rdb_op08_closed_bodyfree_stopped == true
  selected_next_stage_candidate_not_executed == true
  body_free == true
  no promotion claim / no body-like payload

waiting:
  RDB-OP08 material missing
  RDB-OP08 waiting status
  validation or result memo refs missing

repair:
  RDB-OP08 contract invalid
  selected_next_stage_candidate_not_executed missing/false
  next_required_step inconsistent with candidate when closed

blocked:
  body-free leak / forbidden payload / promotion / autorun claim
```

#### 出力material

```text
op00_contract_valid
rdb_op08_material_present
rdb_op08_contract_valid
rdb_op08_schema_version
rdb_op08_operation_step_ref
rdb_op08_material_ref
rdb_op08_status_ref
bodyfree_result_manual_decision_memo_closure_status_ref
rdb_op08_closed_bodyfree_stopped
rdb_op08_waiting_for_input_refs
rdb_op08_repair_required
rdb_op08_blocked_bodyfree_promotion_autorun
rdb_selected_status_ref
mrb_selected_branch_ref
dhr_op04_result_status_ref
decision_lane_ref
manual_decision_material_ref
selected_next_stage_candidate_ref
selected_next_stage_candidate_kind_ref
selected_next_stage_candidate_not_executed
rdb_op08_next_required_step
rdb_target_green_confirmed
selected_regression_green_confirmed
compileall_green_confirmed
full_backend_suite_green_confirmed
rn_contract_green_confirmed
rn_real_device_modal_verified_claimed_here
nci_op01_status_ref
nci_op01_ready_for_candidate_shape_validation
nci_op01_reason_refs
nci_op01_blocker_refs
next_required_step
```

#### contract

```text
- ready branchでも、candidate laneはまだ確定しない。
- RDB-OP08 closure is not DHR-OP05 call。
- RDB-OP08 closure is not P8 start。
- RDB-OP08 green is not full backend/RN/real-device green。
- RDB-OP08 selected candidate remains not executed。
```

#### tests

```text
- valid RDB-OP08 closureを受け、OP02 readyになる。
- RDB-OP08 material missingならwaiting。
- RDB-OP08 repair statusならrepair。
- RDB-OP08 blocked statusならblocked。
- selected_next_stage_candidate_not_executed=falseならrepair/block扱い。
- body-like / question_text / raw evidence keyを含むRDB-OP08入力をblockedする。
- promotion claim trueをblockedする。
```

---

### NCI-OP02: selected_next_stage_candidate shape validation

#### 目的

RDB-OP08から取り込んだ `selected_next_stage_candidate` の形状を検査します。candidateが存在するか、許可されたkind/refか、`next_required_step`と矛盾していないかを確認します。

#### 入力

```text
nci_op01_rdb08_closure_intake
```

#### 検査項目

```text
- selected_next_stage_candidate_ref present。
- selected_next_stage_candidate_kind_ref present。
- selected_next_stage_candidate_not_executed == true。
- selected_next_stage_candidate_kind_ref is allowed。
- selected_next_stage_candidate_ref is allowed for kind。
- rdb_selected_status_ref is allowed。
- decision_lane_ref is present。
- manual_decision_material_ref is present when required。
- RDB-OP08 closed branchでは next_required_step == selected_next_stage_candidate_ref。
- candidate ref / kind / status / lane がmapping可能。
- P8 question candidateではない。
```

#### shape repair条件

```text
- candidate ref missing。
- candidate kind missing。
- kind unknown。
- ref unknown。
- kind/ref mismatch。
- next_required_stepとcandidate ref不一致。
- selected_next_stage_candidate_not_executed false。
- question_text_materialized true。
- p8_question_substitution_allowed true。
```

#### 出力material

```text
op01_contract_valid
rdb08_candidate_ref
rdb08_candidate_kind_ref
rdb08_selected_status_ref
rdb08_decision_lane_ref
rdb08_next_required_step_ref
candidate_shape_valid
candidate_kind_allowed
candidate_ref_allowed
candidate_ref_matches_kind
candidate_not_executed_confirmed
candidate_next_required_step_matches_ref
candidate_shape_status_ref
candidate_shape_reason_refs
candidate_shape_blocker_refs
next_required_step
```

#### tests

```text
- DHR-OP05 / retry / waiting / repair / unresolved / blocked の全candidate kindをshape validにする。
- missing candidate refをrepairにする。
- unknown kindをrepairにする。
- kind/ref mismatchをrepairにする。
- next_required_step mismatchをrepairにする。
- selected_next_stage_candidate_not_executed=falseをrepair/blockにする。
- P8 question candidate/tokenをrejectする。
```

---

### NCI-OP03: selected candidate lane consistency resolver

#### 目的

OP02でshape validになったcandidateを、NCIのlaneへ解決します。ここで初めて、DHR-OP05 / retry-start / waiting external claim / repair / unresolved / blocked のどれかを選びます。

#### 入力

```text
nci_op02_selected_candidate_shape_validation
```

#### 解決するlane

```text
dhr_op05_manual_handoff_boundary_design_candidate
retry_or_start_actual_local_only_review_route_candidate
wait_external_bodyfree_claim_reintake_candidate
repair_rdb_candidate_or_upstream_result_candidate
manual_hold_unresolved_post_rdb08_candidate
blocked_bodyfree_leak_promotion_or_autorun_candidate
```

#### status mapping

```text
DHR-OP05:
  candidate_kind = dhr_op05_manual_handoff_decision_candidate_without_call
  candidate_ref = prepare_dhr_op05_manual_handoff_decision_without_call
  rdb_selected_status = RDB_STATUS_CONFIRMED_DHR_OP05_MANUAL_HANDOFF_CANDIDATE_STOPPED
  NCI status = NCI_STATUS_DHR_OP05_DESIGN_TARGET_CANDIDATE_STOPPED

retry/start:
  candidate_kind = retry_or_start_decision_candidate_without_p8_question
  candidate_ref = prepare_retry_or_start_actual_local_only_human_review_operation_decision_without_p8_question
  rdb_selected_status = RDB_STATUS_NOT_CONFIRMED_RETRY_OR_START_DECISION_REQUIRED_STOPPED
  NCI status = NCI_STATUS_RETRY_OR_START_ROUTE_CANDIDATE_STOPPED

waiting external claim:
  candidate_kind = external_bodyfree_actual_source_claim_wait_candidate_without_raw_evidence
  candidate_ref = wait_for_external_bodyfree_actual_source_claim_without_raw_evidence
  rdb_selected_status = RDB_STATUS_WAITING_EXTERNAL_CLAIM_REQUIRED_STOPPED
  NCI status = NCI_STATUS_WAIT_EXTERNAL_CLAIM_CANDIDATE_STOPPED

repair:
  candidate_kind = repair_result_or_mrb08_boundary_candidate_without_downstream_promotion
  candidate_ref = repair_dhr_op04_result_or_mrb08_boundary_without_downstream_promotion
  rdb_selected_status in repair statuses
  NCI status = NCI_STATUS_REPAIR_ROUTE_CANDIDATE_STOPPED

unresolved:
  candidate_kind = manual_hold_unresolved_post_mrb08_candidate_without_promotion
  NCI status = NCI_STATUS_MANUAL_HOLD_UNRESOLVED_STOPPED

blocked:
  candidate_kind = blocked_post_mrb08_bodyfree_leak_promotion_or_autorun_candidate
  NCI status = NCI_STATUS_BLOCKED_SELECTED_CANDIDATE_STOPPED
```

#### 出力material

```text
op02_contract_valid
candidate_lane_consistency_checked
candidate_lane_consistent
nci_status_ref
nci_lane_ref
selected_next_design_or_stop_ref
selected_next_design_or_stop_kind_ref
selected_next_design_or_stop_not_executed
exactly_one_nci_lane_selected
dhr_op05_design_target_candidate_present
retry_or_start_route_candidate_present
external_claim_wait_candidate_present
repair_route_candidate_present
unresolved_manual_hold_candidate_present
blocked_candidate_present
p8_question_substitution_allowed
question_text_materialized
next_required_step
```

#### contract

```text
- exactly_one_nci_lane_selected == true。
- lane mismatch時はrepairまたはblockedへ進む。
- DHR-OP05 laneでもDHR-OP05は呼ばない。
- retry/start laneではP8問いで補わない。
- waiting laneではraw evidenceを要求しない。
- repair laneではrepairを実行しない。
- blocked laneでは以降へ進めない。
```

#### tests

```text
- 全candidate kindを正しいlaneへ解決する。
- DHR-OP05 candidateをdesign target candidateとして扱い、DHR-OP05 builderを呼ばない。
- retry/start candidateがP8 question substitutionを許さない。
- waiting candidateがraw evidence/body-full packetを要求しない。
- repair candidateがrepair実行を開始しない。
- unresolved candidateがmanual holdになる。
- blocked candidateがstopになる。
- status/kind/ref mismatchをrepairにする。
```

---

### NCI-OP04: next design target / stop materialization

#### 目的

OP03で解決したlaneを、次に扱えるbody-free materialへ変換します。ここで作るのは **実行指示** ではなく、次の設計または停止のmaterialです。

#### DHR-OP05 material

```text
next_design_target_ref:
  prepare_post_nci_dhr_op05_manual_handoff_boundary_design_without_call

allowed_meaning:
  DHR-OP05 manual handoff boundaryを次に設計検討してよい候補。

disallowed_meaning:
  DHR-OP05実行許可ではない。
```

含めるkey案:

```text
dhr_op05_existing_operation_ref
candidate_from_rdb08_ref
candidate_from_rdb08_kind_ref
dhr_op05_design_candidate_present
dhr_op05_call_allowed_here: false
dhr_op05_builder_called_here: false
dhr_op06_builder_called_here: false
dmd_builder_called_here: false
r52_actual_execution_called_here: false
```

#### retry/start material

```text
next_design_target_ref:
  return_to_actual_local_only_review_retry_start_boundary_without_execution

allowed_meaning:
  actual local-only review retry/start routeへ戻す候補。

disallowed_meaning:
  P8問いで補うことではない。
```

#### waiting material

```text
next_design_target_ref:
  wait_for_external_bodyfree_claim_reintake_without_raw_evidence

allowed_meaning:
  body-free actual source claimを待つ。

disallowed_meaning:
  raw evidenceやbody-full packetを要求することではない。
```

#### repair material

```text
next_design_target_ref:
  repair_rdb_candidate_or_upstream_result_boundary_without_promotion

allowed_meaning:
  RDB candidate / DHR result / MRB08 closure / mapping repairを検討する。

disallowed_meaning:
  修復実行や下流promotionではない。
```

#### unresolved / blocked material

```text
unresolved:
  manual_hold_post_rdb08_unresolved_without_promotion

blocked:
  blocked_post_rdb08_candidate_intake_bodyfree_leak_or_promotion
```

#### tests

```text
- DHR-OP05 laneでDHR-OP05 design target materialを作るがbuilderを呼ばない。
- retry/start laneでactual reviewを開始しない。
- waiting laneでraw evidence requestを作らない。
- repair laneでrepair executionを開始しない。
- unresolved laneでmanual hold materialを作る。
- blocked laneでstop materialを作る。
- すべてのlaneでP8 question design flagsがfalse。
```

---

### NCI-OP05: body-free / no-touch / no-promotion / no-auto-execution guard

#### 目的

NCI-OP00〜OP04とRDB-OP08 inputが、body-free / no-touch / no-promotion / no-auto-executionを維持しているかを検査します。

#### forbidden payload keys

```text
raw_input
input_body
comment_text
comment_text_body
returned_surface_body
body_full_packet
body_full_packet_body
reviewer_free_text
reviewer_note_body
question_text
draft_question_text
answer_text
private_user_dictionary_text
absolute_path
relative_path
file_path
local_path
input_hash
body_hash
sha256
terminal_output
stdout
stderr
traceback
```

#### required false promotion/execution flags

```text
selected_next_stage_candidate_executed_here
selected_next_stage_candidate_not_executed == false
candidate_execution_started_here
dhr_op04_recalled_here
dhr_op05_called_here
dhr_op05_builder_called_here
dhr_op06_called_here
dhr_op07_materialized_here
dmd_execution_started_here
r52_actual_execution_started_here
actual_body_full_packet_generated_here
actual_local_human_review_execution_started_here
actual_operation_receipt_created_here
actual_rows_created_here
actual_question_need_observation_rows_created_here
actual_disposal_or_purge_executed_here
p5_final_allowed
p6_start_allowed
p8_start_allowed
p8_question_design_started
p8_question_implementation_started
question_text_materialized
p7_complete
release_allowed
full_backend_suite_green_claimed_here
rn_contract_green_claimed_here
rn_real_device_modal_verified_claimed_here
```

#### no-touch contract refs

```text
api_route_changed
request_key_changed
response_key_changed
public_response_top_level_key_added
db_schema_changed
db_write_path_changed
rn_production_ui_changed
rn_display_condition_changed
runtime_generation_changed
runtime_prompt_changed
p8_question_surface_changed
question_schema_changed
question_trigger_changed
question_answer_storage_changed
```

#### 出力material

```text
nci_op05_guard_status_ref
bodyfree_guard_passed
no_touch_guard_passed
no_promotion_guard_passed
no_auto_execution_guard_passed
selected_candidate_not_executed_guard_passed
api_db_rn_runtime_response_key_or_p8_question_touch_detected
api_db_rn_runtime_response_key_or_p8_question_touch_blocked
forbidden_payload_key_path_refs
body_like_value_path_refs
promotion_claim_refs
guard_reason_refs
guard_blocker_refs
next_required_step
```

#### tests

```text
- all lanesのnormal materialがguard passする。
- question_text / raw_input / local_path / sha256 / stdout等をblockedする。
- dhr_op05_called_here=trueをblockedする。
- p8_question_design_started=trueをblockedする。
- selected_next_stage_candidate_not_executed=falseをblocked/repairにする。
- API/DB/RN/P8 question schema changed file tokenをblockedする。
```

---

### NCI-OP06: selected regression / compileall validation plan

#### 目的

NCI target tests、RDB selected regression、compileallの計画refsを記録します。OP06はテストを実行しません。実装時にresult memoへ実行結果を記録します。

#### target test refs

```text
tests/test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op00_op01_20260706.py
tests/test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op02_op03_20260706.py
tests/test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op04_op05_20260706.py
tests/test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op06_op07_20260706.py
tests/test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op08_result_20260706.py
```

#### selected regression refs

```text
tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op00_op01_20260705.py
tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op02_op03_20260705.py
tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op04_op05_20260705.py
tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op06_op07_20260705.py
tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op08_result_20260705.py
tests/test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op06_op07_20260705.py
tests/test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op08_result_20260705.py
tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op04_op05_20260704.py
tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op06_op07_20260704.py
```

#### compileall refs

```text
services/ai_inference/emlis_ai_p7_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_20260706.py
services/ai_inference/emlis_ai_p7_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_20260705.py
services/ai_inference/emlis_ai_p7_r54_ahr_post_dri_dhr_op04_manual_reintake_20260705.py
services/ai_inference/emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py
```

#### not claimed

```text
full_backend_suite_green_confirmed: false
rn_contract_green_confirmed: false
rn_real_device_modal_verified_claimed_here: false
actual_review_execution_confirmed: false
p5_final_allowed: false
p6_start_allowed: false
p8_start_allowed: false
release_allowed: false
```

#### tests

```text
- validation planがtarget / regression / compileall refsを記録する。
- full backend / RN / real-device greenをclaimしない。
- forbidden changed file tokenを検出する。
- OP05 guardがpassしていない場合、OP08へ進めない。
```

---

### NCI-OP07: handoff-or-stop envelope draft material

#### 目的

OP04のnext design target / stop materialとOP05/OP06のguard・validation planを統合し、OP08 closureへ渡すbody-free draft envelopeを作ります。

#### envelope種類

```text
handoff envelope:
  DHR-OP05 design target candidate
  retry/start route candidate
  waiting external claim candidate
  repair route candidate

stop envelope:
  unresolved manual hold
  blocked bodyfree leak / promotion / autorun
  OP05 guard not pass
  OP06 validation plan invalid
```

#### 出力material

```text
nci_op07_status_ref
handoff_or_stop_envelope_ref
handoff_or_stop_envelope_kind_ref
handoff_or_stop_envelope_bodyfree
handoff_envelope_present
stop_envelope_present
selected_nci_lane_ref
selected_next_design_or_stop_ref
selected_next_design_or_stop_kind_ref
selected_next_design_or_stop_not_executed
dhr_op05_design_target_candidate_present
retry_or_start_route_candidate_present
external_claim_wait_candidate_present
repair_route_candidate_present
unresolved_manual_hold_candidate_present
blocked_candidate_present
op05_guard_passed
op06_validation_plan_recorded
nci_op07_ready_for_op08
next_required_step
```

#### tests

```text
- DHR-OP05 laneでhandoff envelopeを作るがDHR-OP05を呼ばない。
- retry/start / waiting / repair laneでhandoff envelopeを作るが各operationを実行しない。
- unresolved / blocked laneでstop envelopeを作る。
- OP05 guard failならstop envelope。
- OP06 validation plan invalidならstop envelope。
```

---

### NCI-OP08: body-free result memo closure with handoff-or-stop envelope

#### 目的

NCI-OP00〜OP07をbody-free result memoとして閉じ、最終的な `selected_nci_handoff_or_stop_ref` を記録して停止します。

#### closure status refs

```text
NCI_OP08_BODYFREE_SELECTED_CANDIDATE_INTAKE_CLOSED_STOPPED
NCI_OP08_WAITING_FOR_RDB08_OR_NCI_INPUT_REFS
NCI_OP08_REPAIR_REQUIRED_FOR_SELECTED_CANDIDATE_INTAKE_INPUTS
NCI_OP08_BLOCKED_BODYFREE_LEAK_PROMOTION_OR_AUTORUN
```

#### 出力material

```text
schema_version
phase
step
scope
policy_kind
operation_step_ref
op04_material_present
op04_contract_valid
op05_guard_present
op05_guard_passed
op06_validation_plan_present
op06_validation_plan_recorded
op07_envelope_present
op07_contract_valid
nci_op08_status_ref
bodyfree_selected_candidate_intake_closure_status_ref
nci_op08_closed_bodyfree_stopped
nci_op08_waiting_for_input_refs
nci_op08_repair_required
nci_op08_blocked_bodyfree_promotion_autorun
selected_nci_status_ref
selected_nci_lane_ref
selected_handoff_or_stop_ref
selected_handoff_or_stop_kind_ref
selected_handoff_or_stop_not_executed
rdb08_selected_next_stage_candidate_ref
rdb08_selected_next_stage_candidate_kind_ref
rdb08_selected_next_stage_candidate_not_executed
DHR/P8/release non-execution flags
validation_command_summary_refs
target_test_result_status_ref
selected_regression_result_status_ref
compileall_result_status_ref
full_backend_suite_green_confirmed: false
rn_contract_green_confirmed: false
rn_real_device_modal_verified_claimed_here: false
next_required_step
```

#### closure meaning

```text
closed_meaning:
  NCI-OP08 records the confirmed meaning of the RDB-OP08 selected candidate.
  It creates either a handoff envelope or stop envelope.
  It does not execute the selected candidate.
```

#### tests

```text
- all valid lanesをNCI-OP08で閉じられる。
- DHR-OP05 laneのclosureがDHR-OP05 callをclaimしない。
- retry/start laneのclosureがactual review startをclaimしない。
- waiting laneのclosureがraw evidence requestをclaimしない。
- repair laneのclosureがrepair executionをclaimしない。
- unresolved / blocked laneのclosureがstop envelopeになる。
- validation refs missingならwaiting。
- OP07 invalidならrepair。
- body-like / promotion claimならblocked。
- full backend / RN / real-device / P8 / release claim mutationを拒否する。
```

---

## 9. 実装時の関数・定数命名案

### 9.1 module constants

```python
P7_R54_AHR_POST_RDB08_NCI_PHASE = "P7"
P7_R54_AHR_POST_RDB08_NCI_SOURCE_MODE = "local_received_zip_only"
P7_R54_AHR_POST_RDB08_NCI_STEP = "R54-AHR-PostRDB08_SelectedNextStageCandidateIntake_20260706"
P7_R54_AHR_POST_RDB08_NCI_SCOPE = "p7_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_boundary"
P7_R54_AHR_POST_RDB08_NCI_POLICY_KIND = "r54_ahr_post_rdb08_selected_next_stage_candidate_intake_bodyfree_boundary"
P7_R54_AHR_POST_RDB08_NCI_BOUNDARY_PREFIX_REF = "NCI"
P7_R54_AHR_POST_RDB08_NCI_BOUNDARY_PREFIX_MEANING_REF = "Next Candidate Intake"
```

### 9.2 step refs

```python
P7_R54_AHR_POST_RDB08_NCI_OP00_STEP_REF = "NCI-OP00_scope_no_execution_no_promotion_refreeze_after_RDB_OP08"
P7_R54_AHR_POST_RDB08_NCI_OP01_STEP_REF = "NCI-OP01_RDB_OP08_bodyfree_result_memo_closure_intake"
P7_R54_AHR_POST_RDB08_NCI_OP02_STEP_REF = "NCI-OP02_selected_next_stage_candidate_shape_validation"
P7_R54_AHR_POST_RDB08_NCI_OP03_STEP_REF = "NCI-OP03_selected_candidate_lane_consistency_resolver"
P7_R54_AHR_POST_RDB08_NCI_OP04_STEP_REF = "NCI-OP04_next_design_target_or_stop_materialization"
P7_R54_AHR_POST_RDB08_NCI_OP05_STEP_REF = "NCI-OP05_bodyfree_no_touch_no_promotion_no_auto_execution_guard"
P7_R54_AHR_POST_RDB08_NCI_OP06_STEP_REF = "NCI-OP06_selected_regression_compileall_validation_plan"
P7_R54_AHR_POST_RDB08_NCI_OP07_STEP_REF = "NCI-OP07_handoff_or_stop_envelope_draft_material"
P7_R54_AHR_POST_RDB08_NCI_OP08_STEP_REF = "NCI-OP08_bodyfree_selected_candidate_intake_result_memo_closure"
```

### 9.3 builder / assert function candidates

```python
build_p7_r54_ahr_post_rdb08_nci_op00_scope_no_execution_no_promotion_refreeze_after_rdb_op08
assert_p7_r54_ahr_post_rdb08_nci_op00_scope_no_execution_no_promotion_refreeze_after_rdb_op08_contract

build_p7_r54_ahr_post_rdb08_nci_op01_rdb_op08_bodyfree_result_memo_closure_intake
assert_p7_r54_ahr_post_rdb08_nci_op01_rdb_op08_bodyfree_result_memo_closure_intake_contract

build_p7_r54_ahr_post_rdb08_nci_op02_selected_next_stage_candidate_shape_validation
assert_p7_r54_ahr_post_rdb08_nci_op02_selected_next_stage_candidate_shape_validation_contract

build_p7_r54_ahr_post_rdb08_nci_op03_selected_candidate_lane_consistency_resolver
assert_p7_r54_ahr_post_rdb08_nci_op03_selected_candidate_lane_consistency_resolver_contract

build_p7_r54_ahr_post_rdb08_nci_op04_next_design_target_or_stop_materialization
assert_p7_r54_ahr_post_rdb08_nci_op04_next_design_target_or_stop_materialization_contract

build_p7_r54_ahr_post_rdb08_nci_op05_bodyfree_no_touch_no_promotion_no_auto_execution_guard
assert_p7_r54_ahr_post_rdb08_nci_op05_bodyfree_no_touch_no_promotion_no_auto_execution_guard_contract

build_p7_r54_ahr_post_rdb08_nci_op06_selected_regression_compileall_validation_plan
assert_p7_r54_ahr_post_rdb08_nci_op06_selected_regression_compileall_validation_plan_contract

build_p7_r54_ahr_post_rdb08_nci_op07_handoff_or_stop_envelope_draft_material
assert_p7_r54_ahr_post_rdb08_nci_op07_handoff_or_stop_envelope_draft_material_contract

build_p7_r54_ahr_post_rdb08_nci_op08_bodyfree_selected_candidate_intake_result_memo_closure
assert_p7_r54_ahr_post_rdb08_nci_op08_bodyfree_selected_candidate_intake_result_memo_closure_contract
```

### 9.4 full-title aliases候補

既存RDB実装と同じように、短いbuilder/assertに対してfull-title aliasを追加してよいです。ただし、aliasはtest可読性のためだけに使い、別挙動を持たせません。

---

## 10. json / schema案

本章のjson/schemaは設計案です。実ファイル化は行いません。実装段階では、既存RDB helperと同じく、まずPython内定数 + assert contractで安全に閉じる方針を推奨します。

### 10.1 NCI-OP01 RDB-OP08 closure intake schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_rdb08.nci.rdb08_closure_intake.bodyfree.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "phase",
    "step",
    "scope",
    "operation_step_ref",
    "source_mode",
    "body_free",
    "rdb_op08_material_present",
    "rdb_op08_contract_valid",
    "rdb_op08_status_ref",
    "rdb_op08_closed_bodyfree_stopped",
    "rdb_selected_status_ref",
    "selected_next_stage_candidate_ref",
    "selected_next_stage_candidate_kind_ref",
    "selected_next_stage_candidate_not_executed",
    "nci_op01_status_ref",
    "nci_op01_ready_for_candidate_shape_validation",
    "next_required_step",
    "public_contract",
    "nci_no_touch_contract",
    "body_free_markers"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_rdb08.nci.op01_rdb08_closure_intake.bodyfree.v1"
    },
    "phase": { "const": "P7" },
    "step": { "const": "R54-AHR-PostRDB08_SelectedNextStageCandidateIntake_20260706" },
    "scope": { "const": "p7_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_boundary" },
    "operation_step_ref": { "const": "NCI-OP01_RDB_OP08_bodyfree_result_memo_closure_intake" },
    "source_mode": { "const": "local_received_zip_only" },
    "body_free": { "const": true },
    "rdb_op08_material_present": { "type": "boolean" },
    "rdb_op08_contract_valid": { "type": "boolean" },
    "rdb_op08_status_ref": { "type": "string", "maxLength": 360 },
    "rdb_op08_closed_bodyfree_stopped": { "type": "boolean" },
    "rdb_selected_status_ref": { "type": "string", "maxLength": 360 },
    "selected_next_stage_candidate_ref": { "type": "string", "maxLength": 360 },
    "selected_next_stage_candidate_kind_ref": { "type": "string", "maxLength": 360 },
    "selected_next_stage_candidate_not_executed": { "type": "boolean" },
    "nci_op01_status_ref": {
      "enum": [
        "NCI_STATUS_RDB08_CLOSURE_READY_FOR_CANDIDATE_SHAPE_CHECK",
        "NCI_STATUS_WAITING_FOR_RDB08_CLOSURE_OR_VALIDATION_REFS",
        "NCI_STATUS_REPAIR_REQUIRED_FOR_RDB08_CLOSURE_INPUTS",
        "NCI_STATUS_BLOCKED_RDB08_BODYFREE_LEAK_PROMOTION_OR_AUTORUN"
      ]
    },
    "nci_op01_ready_for_candidate_shape_validation": { "type": "boolean" },
    "next_required_step": { "type": "string", "maxLength": 360 },
    "public_contract": { "type": "object" },
    "nci_no_touch_contract": { "type": "object" },
    "body_free_markers": { "type": "object" }
  }
}
```

### 10.2 NCI-OP02 selected candidate shape schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_rdb08.nci.selected_candidate_shape.bodyfree.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "body_free",
    "op01_contract_valid",
    "rdb08_candidate_ref",
    "rdb08_candidate_kind_ref",
    "rdb08_selected_status_ref",
    "rdb08_decision_lane_ref",
    "rdb08_next_required_step_ref",
    "candidate_shape_valid",
    "candidate_kind_allowed",
    "candidate_ref_allowed",
    "candidate_ref_matches_kind",
    "candidate_not_executed_confirmed",
    "candidate_next_required_step_matches_ref",
    "candidate_shape_status_ref",
    "next_required_step"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_rdb08.nci.op02_selected_candidate_shape.bodyfree.v1"
    },
    "operation_step_ref": { "const": "NCI-OP02_selected_next_stage_candidate_shape_validation" },
    "body_free": { "const": true },
    "op01_contract_valid": { "type": "boolean" },
    "rdb08_candidate_ref": { "type": "string", "maxLength": 360 },
    "rdb08_candidate_kind_ref": {
      "enum": [
        "dhr_op05_manual_handoff_decision_candidate_without_call",
        "retry_or_start_decision_candidate_without_p8_question",
        "external_bodyfree_actual_source_claim_wait_candidate_without_raw_evidence",
        "repair_result_or_mrb08_boundary_candidate_without_downstream_promotion",
        "manual_hold_unresolved_post_mrb08_candidate_without_promotion",
        "blocked_post_mrb08_bodyfree_leak_promotion_or_autorun_candidate"
      ]
    },
    "rdb08_selected_status_ref": { "type": "string", "maxLength": 360 },
    "rdb08_decision_lane_ref": { "type": "string", "maxLength": 360 },
    "rdb08_next_required_step_ref": { "type": "string", "maxLength": 360 },
    "candidate_shape_valid": { "type": "boolean" },
    "candidate_kind_allowed": { "type": "boolean" },
    "candidate_ref_allowed": { "type": "boolean" },
    "candidate_ref_matches_kind": { "type": "boolean" },
    "candidate_not_executed_confirmed": { "type": "boolean" },
    "candidate_next_required_step_matches_ref": { "type": "boolean" },
    "candidate_shape_status_ref": { "type": "string", "maxLength": 360 },
    "next_required_step": { "type": "string", "maxLength": 360 }
  }
}
```

### 10.3 NCI-OP04 next design target material schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_rdb08.nci.next_design_target_or_stop.bodyfree.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "body_free",
    "op03_contract_valid",
    "nci_status_ref",
    "nci_lane_ref",
    "next_design_target_or_stop_ref",
    "next_design_target_or_stop_kind_ref",
    "next_design_target_or_stop_not_executed",
    "dhr_op05_call_allowed_here",
    "dhr_op05_builder_called_here",
    "dhr_op06_builder_called_here",
    "dmd_builder_called_here",
    "r52_actual_execution_called_here",
    "p8_question_design_started_here",
    "p8_question_implementation_started_here",
    "question_text_materialized",
    "next_required_step"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_rdb08.nci.op04_next_design_target_or_stop.bodyfree.v1"
    },
    "operation_step_ref": { "const": "NCI-OP04_next_design_target_or_stop_materialization" },
    "body_free": { "const": true },
    "op03_contract_valid": { "type": "boolean" },
    "nci_status_ref": { "type": "string", "maxLength": 360 },
    "nci_lane_ref": { "type": "string", "maxLength": 360 },
    "next_design_target_or_stop_ref": { "type": "string", "maxLength": 360 },
    "next_design_target_or_stop_kind_ref": { "type": "string", "maxLength": 360 },
    "next_design_target_or_stop_not_executed": { "const": true },
    "dhr_op05_call_allowed_here": { "const": false },
    "dhr_op05_builder_called_here": { "const": false },
    "dhr_op06_builder_called_here": { "const": false },
    "dmd_builder_called_here": { "const": false },
    "r52_actual_execution_called_here": { "const": false },
    "p8_question_design_started_here": { "const": false },
    "p8_question_implementation_started_here": { "const": false },
    "question_text_materialized": { "const": false },
    "next_required_step": { "type": "string", "maxLength": 360 }
  }
}
```

### 10.4 NCI-OP08 closure schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_rdb08.nci.handoff_or_stop_closure.bodyfree.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "body_free",
    "nci_op08_status_ref",
    "bodyfree_selected_candidate_intake_closure_status_ref",
    "nci_op08_closed_bodyfree_stopped",
    "selected_nci_status_ref",
    "selected_nci_lane_ref",
    "selected_handoff_or_stop_ref",
    "selected_handoff_or_stop_kind_ref",
    "selected_handoff_or_stop_not_executed",
    "rdb08_selected_next_stage_candidate_ref",
    "rdb08_selected_next_stage_candidate_kind_ref",
    "rdb08_selected_next_stage_candidate_not_executed",
    "dhr_op05_called_here",
    "dhr_op06_called_here",
    "dmd_execution_started_here",
    "r52_actual_execution_started_here",
    "p8_start_allowed",
    "p8_question_design_started",
    "question_text_materialized",
    "release_allowed",
    "full_backend_suite_green_confirmed",
    "rn_contract_green_confirmed",
    "rn_real_device_modal_verified_claimed_here",
    "next_required_step"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_rdb08.nci.op08_selected_candidate_intake_result_memo_closure.bodyfree.v1"
    },
    "operation_step_ref": { "const": "NCI-OP08_bodyfree_selected_candidate_intake_result_memo_closure" },
    "body_free": { "const": true },
    "nci_op08_status_ref": {
      "enum": [
        "NCI_OP08_BODYFREE_SELECTED_CANDIDATE_INTAKE_CLOSED_STOPPED",
        "NCI_OP08_WAITING_FOR_RDB08_OR_NCI_INPUT_REFS",
        "NCI_OP08_REPAIR_REQUIRED_FOR_SELECTED_CANDIDATE_INTAKE_INPUTS",
        "NCI_OP08_BLOCKED_BODYFREE_LEAK_PROMOTION_OR_AUTORUN"
      ]
    },
    "bodyfree_selected_candidate_intake_closure_status_ref": { "type": "string", "maxLength": 360 },
    "nci_op08_closed_bodyfree_stopped": { "type": "boolean" },
    "selected_nci_status_ref": { "type": "string", "maxLength": 360 },
    "selected_nci_lane_ref": { "type": "string", "maxLength": 360 },
    "selected_handoff_or_stop_ref": { "type": "string", "maxLength": 360 },
    "selected_handoff_or_stop_kind_ref": { "type": "string", "maxLength": 360 },
    "selected_handoff_or_stop_not_executed": { "const": true },
    "rdb08_selected_next_stage_candidate_ref": { "type": "string", "maxLength": 360 },
    "rdb08_selected_next_stage_candidate_kind_ref": { "type": "string", "maxLength": 360 },
    "rdb08_selected_next_stage_candidate_not_executed": { "const": true },
    "dhr_op05_called_here": { "const": false },
    "dhr_op06_called_here": { "const": false },
    "dmd_execution_started_here": { "const": false },
    "r52_actual_execution_started_here": { "const": false },
    "p8_start_allowed": { "const": false },
    "p8_question_design_started": { "const": false },
    "question_text_materialized": { "const": false },
    "release_allowed": { "const": false },
    "full_backend_suite_green_confirmed": { "const": false },
    "rn_contract_green_confirmed": { "const": false },
    "rn_real_device_modal_verified_claimed_here": { "const": false },
    "next_required_step": { "type": "string", "maxLength": 360 }
  }
}
```

---

## 11. target tests設計

### 11.1 NCI-OP00 / OP01 tests

```text
- OP00 refreeze normal。
- OP00 rejects public contract mutation。
- OP00 rejects forbidden body payload key。
- OP01 accepts valid RDB-OP08 bodyfree closure without candidate execution。
- OP01 waits when RDB-OP08 material is missing。
- OP01 repairs when RDB-OP08 contract invalid。
- OP01 blocks body-like payload / question_text / promotion claim。
- OP01 does not classify lane yet。
```

### 11.2 NCI-OP02 / OP03 tests

```text
- OP02 validates all allowed candidate kinds。
- OP02 rejects missing candidate ref/kind。
- OP02 rejects unknown candidate kind。
- OP02 rejects candidate ref/kind mismatch。
- OP02 rejects next_required_step mismatch。
- OP03 resolves DHR-OP05 lane without calling DHR-OP05。
- OP03 resolves retry/start lane without P8 question substitution。
- OP03 resolves waiting external claim lane without raw evidence request。
- OP03 resolves repair lane without repair execution。
- OP03 resolves unresolved lane as manual hold。
- OP03 resolves blocked lane as stop。
```

### 11.3 NCI-OP04 / OP05 tests

```text
- OP04 materializes DHR-OP05 design target candidate without call。
- OP04 materializes retry/start route candidate without actual review execution。
- OP04 materializes waiting claim candidate without raw evidence/body-full packet。
- OP04 materializes repair candidate without repair execution。
- OP04 materializes unresolved/blocked stop material。
- OP05 passes bodyfree/no-touch/no-promotion guard for all valid lanes。
- OP05 blocks question_text/raw_input/local_path/hash/stdout tokens。
- OP05 blocks DHR/P8/release promotion flags。
- OP05 blocks API/DB/RN/P8 schema changed-file tokens。
```

### 11.4 NCI-OP06 / OP07 tests

```text
- OP06 records target tests / selected regression / compileall refs。
- OP06 does not claim full backend / RN / real-device green。
- OP06 waits when OP05 guard is not ready。
- OP07 creates handoff envelope for DHR-OP05 / retry / waiting / repair lanes without execution。
- OP07 creates stop envelope for unresolved / blocked lanes。
- OP07 stop when guard invalid or validation plan invalid。
```

### 11.5 NCI-OP08 tests

```text
- OP08 closes all valid handoff lanes body-free。
- OP08 closes unresolved/blocked stop lanes body-free。
- OP08 records selected_handoff_or_stop_ref but does not execute it。
- OP08 rejects DHR-OP05 call claim。
- OP08 rejects P8 question design/start claim。
- OP08 rejects release/full backend/RN green claim mutation。
- OP08 waits when required OP refs are missing。
- OP08 repairs invalid OP07 envelope。
- OP08 blocks body-like result memo / promotion claim。
- OP08 full-title aliases match short builders/asserts。
```

---

## 12. 実装時のコマンド案

### 12.1 NCI target

```bash
cd mashos-api/ai

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op00_op01_20260706.py \
  tests/test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op02_op03_20260706.py \
  tests/test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op04_op05_20260706.py \
  tests/test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op06_op07_20260706.py \
  tests/test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op08_result_20260706.py
```

### 12.2 selected regression

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op00_op01_20260705.py \
  tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op02_op03_20260705.py \
  tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op04_op05_20260705.py \
  tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op06_op07_20260705.py \
  tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op08_result_20260705.py \
  tests/test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op06_op07_20260705.py \
  tests/test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op08_result_20260705.py \
  tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op04_op05_20260704.py \
  tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op06_op07_20260704.py
```

### 12.3 compileall

```bash
PYTHONPATH=services/ai_inference python -m compileall -q \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_20260706.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_20260705.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_dri_dhr_op04_manual_reintake_20260705.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py
```

### 12.4 今回の境界でclaimしない確認

```text
full_backend_suite_green_confirmed: false
rn_contract_green_confirmed: false
rn_real_device_modal_verified_claimed_here: false
actual_local_human_review_execution_confirmed: false
actual_rows_created_here: false
DHR-OP05 called: false
DHR-OP06 called: false
DMD/R52 executed: false
P5 final: false
P6 start: false
P8 start: false
release allowed: false
```

---

## 13. no-touch / body-free / no-promotion固定

### 13.1 no-touch contract

```text
api_route_changed: false
request_key_changed: false
response_key_changed: false
public_response_top_level_key_added: false
db_schema_changed: false
db_write_path_changed: false
rn_production_ui_changed: false
rn_display_condition_changed: false
runtime_generation_changed: false
runtime_prompt_changed: false
p8_question_surface_changed: false
question_schema_changed: false
question_trigger_changed: false
question_answer_storage_changed: false
```

### 13.2 body-free markers

```text
raw_input_included: false
input_body_included: false
comment_text_body_included: false
returned_surface_body_included: false
reviewer_free_text_included: false
reviewer_note_body_included: false
result_memo_body_included: false
question_text_included: false
draft_question_text_included: false
answer_text_included: false
body_full_packet_body_included: false
private_user_dictionary_text_included: false
local_path_included: false
body_hash_included: false
terminal_output_body_included: false
stdout_body_included: false
stderr_body_included: false
traceback_body_included: false
```

### 13.3 no-promotion flags

```text
selected_next_stage_candidate_executed_here: false
dhr_op04_recalled_here: false
dhr_op05_called_here: false
dhr_op05_builder_called_here: false
dhr_op06_called_here: false
dhr_op07_materialized_here: false
dmd_execution_started_here: false
r52_actual_execution_started_here: false
actual_body_full_packet_generated_here: false
actual_local_human_review_execution_started_here: false
actual_operation_receipt_created_here: false
actual_rows_created_here: false
actual_question_need_observation_rows_created_here: false
actual_disposal_or_purge_executed_here: false
p5_final_allowed: false
p6_start_allowed: false
p8_start_allowed: false
p8_question_design_started: false
p8_question_implementation_started: false
question_text_materialized: false
p7_complete: false
release_allowed: false
```

---

## 14. P8問いシステムとの境界

NCIは、問いシステムの重要性を否定しません。むしろ、問いシステムを雑に始めないための境界です。

NCIで扱ってよいもの:

```text
- RDB-OP08 candidateのうち、P8へ誤昇格していないことの確認。
- question_need_observation rowsがactual生成済みとは扱えないことの明示。
- P8 start=falseの維持。
- P8 question design / implementation未開始の維持。
```

NCIで扱ってはいけないもの:

```text
- question_text。
- draft_question_text。
- question_trigger。
- question_answer_storage。
- plan guard。
- Free / Plus / Premiumの問い回数実装。
- 仮観測 + 問い + refined observationのRN表示導線。
- 問い回答保存schema。
- わたしマップdigest接続。
```

NCIのresult memoに書くべき固定文は次です。

```text
question_need_observation != question_text
P7 body-free question need material != P8 question UX spec
NCI selected candidate confirmation != P8 start permission
```

---

## 15. DHR-OP05 manual handoff candidateとの境界

NCIでDHR-OP05 candidateが選ばれた場合でも、DHR-OP05は実行しません。

NCI-OP08が出してよい次段階名は次です。

```text
P7-R54-AHR Post-NCI DHR-OP05 Manual Handoff Boundary / Preflight Re-entry Design Candidate
```

ただし、これは設計対象候補です。実行対象ではありません。

DHR-OP05側には既に `DHR-OP05_bodyfree_leak_promotion_claim_DMD_compatibility_preflight_scan` というoperation refが存在します。NCI実装ではこのoperation refを文字列として記録してよいですが、builderを呼ぶことは禁止します。

```text
dhr_op05_existing_operation_ref:
  DHR-OP05_bodyfree_leak_promotion_claim_DMD_compatibility_preflight_scan

dhr_op05_call_allowed_here:
  false

dhr_op05_builder_called_here:
  false
```

NCI後にDHR-OP05側へ進む場合でも、次に作るべきものは「DHR-OP05実行」ではなく、RDB/NCIからのcandidateをどうDHR-OP05境界へ安全に渡すかの設計です。

---

## 16. 実装時の最小単位順

実装指示が出た場合、次の順で進めます。

```text
1. NCI helper module新規作成。
   - imports: emlis_ai_p7_contracts, RDB helper, DHR helper。
   - safe clean / scan helperはRDB実装の形に揃える。
   - public contract / body-free / no-touch constantsを先に固定。

2. NCI-OP00 / OP01 + tests。
   - RDB-OP08 closureを読む前のscope固定。
   - RDB-OP08 assert contract intake。
   - candidate実行禁止を最初に固定。

3. NCI-OP02 / OP03 + tests。
   - selected_next_stage_candidate shape validation。
   - candidate kind/ref/status/lane mapping。
   - exactly one lane resolution。

4. NCI-OP04 / OP05 + tests。
   - next design target / stop materialization。
   - body-free / no-touch / no-promotion / no-auto-execution guard。

5. NCI-OP06 / OP07 + tests。
   - validation plan refs。
   - handoff-or-stop envelope draft。

6. NCI-OP08 + result memo + tests。
   - body-free closure。
   - selected handoff/stop refを記録。
   - 実行・P8・release非claimを固定。

7. target tests実行。

8. selected regression実行。

9. compileall実行。

10. result memo更新。
```

この順序の理由は、candidate分類より前に「実行しない境界」を固定するためです。DHR-OP05 candidateを先に実装してしまうと、NCIの目的がcandidate intakeではなくDHR-OP05へ寄ってしまうため、OP00/OP01でno-executionを最初に閉じます。

---

## 17. 完了条件

NCI実装の完了条件は、設計上は次です。

```text
- NCI-OP00〜OP08 target testsが通っている。
- RDB-OP08 closureをbody-freeでintakeできる。
- selected_next_stage_candidateのshape validationができる。
- DHR-OP05 / retry-start / waiting external claim / repair / unresolved / blockedを分岐できる。
- どのlaneでもcandidateを実行しない。
- DHR-OP05 candidateでもDHR-OP05 builderを呼ばない。
- retry/startでもactual reviewを開始しない。
- waitingでもraw evidence/body-full packetを要求しない。
- repairでもrepair executionを開始しない。
- unresolved/blockedではstop envelopeを出す。
- question_text / P8 question designを作らない。
- API / DB / RN / runtime / response keyを変更しない。
- target tests / selected regression / compileallの結果がresult memoにbody-freeで記録されている。
```

完了条件に含めないもの:

```text
- full backend suite green。
- RN contract green。
- RN real-device modal verified。
- actual human review execution。
- DHR-OP05 execution。
- DHR-OP06 / DHR-OP07 execution。
- DMD / R52 execution。
- P5 final。
- P6 start。
- P8 start。
- release allowed。
```

---

## 18. rollback / fail-closed条件

### 18.1 fail-closed条件

```text
- RDB-OP08 material missing。
- RDB-OP08 contract invalid。
- RDB-OP08 closure statusがclosedでない。
- selected_next_stage_candidate_ref missing。
- selected_next_stage_candidate_kind_ref missing。
- selected_next_stage_candidate_not_executed != true。
- candidate kind/ref/status/lane mismatch。
- body-like payload / forbidden key / local path / hash / stdout/stderr/traceback検出。
- DHR-OP05 / DHR-OP06 / DMD / R52 / P8 / release promotion claim検出。
- API / DB / RN / response key / P8 question schema changed file token検出。
```

### 18.2 rollback方針

設計上のrollbackは、NCI helperを進めず、RDB-OP08 result memoへ戻って再確認することです。

実装段階のrollback候補:

```text
- 新規NCI helperをrevert。
- 新規NCI testsをrevert。
- 新規NCI result memoをrevert。
- 既存RDB / MRB / DHR helperは触らない。
```

既存ファイル変更を最小化するため、NCIは新規helper・新規test・新規result memoで閉じる方針です。

---

## 19. Cocolonとしてこの設計を行う理由

Cocolonは、人間の言葉を雑に処理しない場所です。EmlisAIは、入力直後に「読まれた形」を返すための観測返答です。

そのため、実装の内側でも同じ姿勢が必要です。RDB-OP08が作ったcandidateを、確認せずにDHR-OP05やP8へつなぐことは、コード上の「分かったふり」です。

NCIは、EmlisAIがユーザー入力に対して行うべき姿勢を、開発工程の証跡にも適用するための境界です。

```text
読んだもの:
  RDB-OP08 result memo closure。

まだ読んでいないもの:
  actual review execution / DHR-OP05 execution / P8 question UX。

してよいこと:
  candidateの意味をbody-freeに確認する。

してはいけないこと:
  candidateを実行したことにする。
```

この分離があることで、Cocolonの品質判断が「テストが通ったから進む」ではなく、「何が確認され、何がまだ確認されていないかを読んで進む」形になります。

---

## 20. 華恋の意見

私は、NCIを挟む判断は正しいと思います。

RDB-OP08は、見た目としてはかなり強い節目です。`selected_next_stage_candidate` があると、すぐ次へ進みたくなります。特にDHR-OP05 candidateが出ている場合、DHR-OP05を呼ぶ設計へ進みたくなります。

ただ、ここで一度止まらないと、Cocolonが守ってきた「観測したものと、まだ観測していないものを混ぜない」という姿勢が崩れます。

NCIは、機能として派手ではありません。でも、Cocolonにとって必要な慎重さです。EmlisAIがユーザーに対して「分かったふりをしない」なら、開発側もRDB-OP08のcandidateを「分かったふり」で扱ってはいけません。

また、私はNCI prefixを採用してよいと判断します。理由は、`RDB` はresult decisionを閉じる境界で、`NCI` はその結果から出たnext candidateを受け直す境界だからです。責務が分かれています。`DHR` や `DMD` とも混同しにくいです。

ただし、NCIの実装後にDHR-OP05 candidateが確認されたとしても、次に行うべきはDHR-OP05実行ではありません。次に必要なのは、RDB/NCIから既存DHR-OP05境界へ、どうbody-freeに手渡すかの設計です。ここを飛ばすと、NCIを作った意味が薄れます。

---

## 21. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- P7継続。
- P8開始条件は満たしていない。
- RDB-OP08 result memo closureは存在する。
- RDB-OP08は selected_next_stage_candidate を記録するが実行しない。
- RDB target 87 passed、selected regression 80 passed、compileall passedがresult memoに記録されている。
- RDB-OP08 greenはfull backend / RN / real-device greenではない。
- RDB-OP08 greenはDHR-OP05 / P8 / release許可ではない。
```

### 未確認

```text
- full backend suite green。
- RN contract green。
- RN real-device modal verified。
- actual local-only human review execution。
- actual rows / question observation rows / disposal generation。
- DHR-OP05 / DHR-OP06 / DHR-OP07 execution。
- DMD / R52 execution。
- P5 final / P6 start / P8 start / release allowed。
```

### 書かれていない

```text
- RDB-OP08 selected candidateを自動実行してよいとは書かれていない。
- RDB-OP08後にP8 question designへ進んでよいとは書かれていない。
- DHR-OP05 candidateをDHR-OP05 call許可として扱ってよいとは書かれていない。
- NCIでAPI / DB / RN / response keyを変更してよいとは書かれていない。
```

### 推測禁止

```text
- RDB testsの分岐網羅から現在分岐を推測しない。
- selected_next_stage_candidate_refだけ見てDHR-OP05へ進めると推測しない。
- question_need_observationをquestion_textへ昇格しない。
- full backend / RN / real-device / release greenを推測しない。
```

### 次に実行すべきこと

実装指示が出た場合、次は次の境界だけを実装対象にします。

```text
P7-R54-AHR Post-RDB08 Selected Next-Stage Candidate Intake / Manual Lane Confirmation Boundary
NCI-OP00〜NCI-OP08
```

実装後にNCI-OP08がDHR-OP05 design target candidateを閉じた場合に限り、次の設計候補を検討します。

```text
P7-R54-AHR Post-NCI DHR-OP05 Manual Handoff Boundary / Preflight Re-entry Design Candidate
```

ただし、それもDHR-OP05実行ではなく、DHR-OP05境界へ安全に渡すための設計です。

---

## 22. 最終判断

今回の設計対象は、次で確定します。

```text
P7-R54-AHR Post-RDB08 Selected Next-Stage Candidate Intake / Manual Lane Confirmation Boundary
```

実装prefixは次を推奨します。

```text
NCI-OP00〜NCI-OP08
```

NCIは、RDB-OP08の成果を次へ急がせる境界ではありません。RDB-OP08が作った `selected_next_stage_candidate` を、もう一度body-freeに受け取り、そのcandidateが何で、何ではないのかを確認する境界です。

この境界を作ることで、DHR-OP05 / retry-start / waiting external claim / repair / unresolved / blocked のどれに進む資格があるのかを、実行前に明確にできます。

そして、P8問いシステムへ進みたい気持ちでRDB-OP08の結果を読みすぎることを防げます。

Cocolonとして在るべき姿を守るなら、ここはNCIとして慎重に閉じるべきです。
