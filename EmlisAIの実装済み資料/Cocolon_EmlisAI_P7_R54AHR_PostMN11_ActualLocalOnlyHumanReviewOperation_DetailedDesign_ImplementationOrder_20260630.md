---
title: Cocolon / EmlisAI P7-R54-AHR Post-MN11 Actual Local-only Human Review Operation 詳細設計書・実装順
created_at: 2026-06-30 JST
author: 華恋
work_mode: 共鳴構造モード / local-only review
source_mode: local_received_zip
github_connection_check: not_required_by_mash_instruction
base_pre_design_memo: Cocolon_EmlisAI_P7_R54AHR_PostMN11_ActualLocalOnlyHumanReviewOperation_PreDesignMemo_20260630.md
artifact_scope: detailed_design_md_only
work_type: 詳細設計書 / 実装順 / json・schema案内包
code_change: none
json_schema_file_creation: none
actual_body_full_packet_generation: none
actual_local_human_review_execution: none
actual_rows_creation: none
actual_disposal_purge_execution: none
p5_finalization: none
p6_start: none
p8_start: none
p8_question_design: none
p8_question_implementation: none
r52_actual_execution: none
p7_complete: none
release_decision: none
chosen_stage: P7-R54-AHR Post-MN11 Actual Local-only Human Review Operation / Evidence Intake Re-entry
---

# Cocolon / EmlisAI P7-R54-AHR Post-MN11 Actual Local-only Human Review Operation 詳細設計書・実装順

対象: Cocolon / EmlisAI / P7 Product Quality Runner / R54-AHR / Post-EX18 MN00-MN11後 / actual local-only human review operation / body-free evidence intake / PostCR22 EX re-entry  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
実装扱い: 本書は設計書です。コード変更・json/schema実ファイル作成・body-full packet生成・actual human review実行・actual rows作成・purge実行は行いません。  
json / schema実ファイル化: なし。本書内の案のみ。実ファイル化は実装段階で現物コード・既存schema配置・既存Guard・既存test結果を見て判断します。  
GitHub接続確認: Mash指定により不要。ローカル受領zip基準。  

---

## 0. 結論

次に進める段階は、次で固定します。

```text
P7-R54-AHR Post-MN11
Actual Local-only Human Review Operation / Evidence Intake Re-entry
```

この設計は、P8観測補助問いの設計ではありません。  
この設計は、P6 limited human readfeel開始ではありません。  
この設計は、R52 actual execution再開ではありません。  
この設計は、P5 final / P7 complete / release decisionではありません。  
この設計は、MN00-MN11のようなmanual decision wrapperをもう一段増やすことを主目的にしません。

MN00-MN11で固定された現在判定は次です。

```text
manual_decision_ref:
  RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED

actual_review_evidence_status_ref:
  actual_review_evidence_missing_real_review_required

next_required_step:
  actual_local_only_human_review_operation_required_before_p5_p6_p8_r52_decision

actual_review_evidence_complete_from_real_review:
  false

p5_final_allowed:
  false
p6_start_allowed:
  false
p8_start_allowed:
  false
r52_actual_execution_confirmed:
  false
p7_complete:
  false
release_allowed:
  false
```

したがって、実装段階で向かうべきものは、次です。

```text
actual local-only human review evidenceを、
body-full local-only / body-free evidence / purge / no-leak / no-promotion の境界で成立させるoperation。
```

華恋の判断として、この工程の核は「機能追加」ではありません。  
Cocolonがユーザーの言葉を雑に扱っていないことを、helper greenではなく、実読由来のbody-free証跡で確認するための工程です。

---

## 1. なぜこのoperation設計が必要か

Cocolon / EmlisAIの価値は、ユーザーが書いた言葉に対して、入力直後に「読まれた形」で返ることにあります。  
P5 User Label Connectionは、Cocolonが「毎回説明し直さなくてよい場所」になるための核です。

ここで実レビュー由来の証跡がないままP8観測補助問いへ進むと、問い機能が次のように変質します。

```text
本来:
  EmlisAI本体が読める範囲と、短い問いで補助すべき範囲を分けるための補助。

危険な変質:
  EmlisAI本体が読めていない箇所を、問い返しで先送りする逃げ道。
```

Cocolonとして在るべき姿は、問いを増やす前に、まず実ケースで「本当に読めているか」を確認することです。  
そのため、この設計ではP8の問い文・trigger・API・DB・RN UIを設計せず、actual local-only human review evidenceを成立させる運用境界へ戻します。

この設計で守る中心線は次です。

```text
1. 人間がactual local-onlyで24ケースを読む。
2. body-fullはlocal-only内でだけ扱う。
3. 成果物へ残すのはbody-free receipt / rows / counts / refsだけにする。
4. reviewer notes本文、raw input、returned body、history body、question text、path、hashを残さない。
5. actual evidenceとfixtureを分離する。
6. 実レビュー由来の証跡が揃っても、P5/P6/P8/R52/P7/releaseを自動昇格しない。
```

---

## 2. 参照資料・現状固定

### 2.1 ローカル受領zip

```text
Cocolon_前提資料(271).zip
EmlisAIの実装済み資料(88).zip
Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(7).zip
Cocolon(261).zip
mashos-api(174).zip
```

### 2.2 必読前提・作業姿勢

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
```

本設計で固定する作業姿勢:

```text
- 確認していないものを確認済みと言わない。
- helper green / selected regression greenを、実レビュー完了へ読み替えない。
- unit test rows / actual-shaped fixture rowsを、actual human review evidenceへ昇格しない。
- 設計と実装を混ぜない。
- 本書では、json/schema案を記述しても実ファイル化しない。
- API / DB / RN / runtime / response key / User Label Connection runtimeを勝手に触らない。
- P8観測補助問いは、P7実ケース観察メモが揃ってから設計する。
```

### 2.3 ロードマップ固定

```text
P7:
  Product Quality Runner / Long-run Product Gate

P7/P8 Bridge:
  P7のP5 human Blind QA / P6 limited human readfeel / 実機modal確認では、観測補助問いを実装しない。
  P7では、body-freeの「問い必要性観察メモ」を残す。
  P8開始時に、その実ケース観察メモを根拠として観測補助問いを詳細設計する。

P8:
  Personal Continuity / Derived User Model
  P8開始時点では、P7で集めた実ケース観察メモを根拠にする。
```

禁止として固定すること:

```text
- P7途中でP8 question API / DB / RN UIを実装しない。
- 問い発生ロジック、保存schema、response key、plan guardを確定しない。
- Emlis本体の読感不足を、問い返しで補う扱いにしない。
- raw input / raw answer / comment_text bodyをreview packetやpublic metaへ出さない。
```

### 2.4 実装済み資料・実ファイル

主に確認した資料・実ファイル:

```text
EmlisAIの実装済み資料/
  Cocolon_EmlisAI_P7_R54ActualLocalOnlyHumanReviewOperation_Reentry_DetailedDesign_ImplementationOrder_20260625.md
  Cocolon_EmlisAI_P7_R54ActualHumanReviewExecution_BodyFreeEvidenceIntake_DetailedDesign_ImplementationOrder_20260627.md
  Cocolon_EmlisAI_P7_R54AHR_CurrentReceivedSnapshotActualLocalReviewOperation_DetailedDesign_ImplementationOrder_20260628.md
  Cocolon_EmlisAI_P7_R54AHR_PostCR22_ActualLocalOnlyHumanReviewExecution_EvidenceCompletion_DetailedDesign_ImplementationOrder_20260629.md
  Cocolon_EmlisAI_P7_R54AHR_PostEX18_ReturnToActualReviewOperation_DetailedDesign_ImplementationOrder_20260630.md

mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_actual_local_review_operation_reentry_20260625.py
  emlis_ai_p7_r54_actual_human_review_execution_bodyfree_intake_20260627.py
  emlis_ai_p7_r54_ahr_current_received_snapshot_actual_local_review_operation_20260628.py
  emlis_ai_p7_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_20260629.py
  emlis_ai_p7_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_20260630.py

mashos-api/ai/tests/
  R54_AHR_PostCR22_ActualLocalReviewExecutionEvidenceCompletion_EX18_Result_20260630.md
  R54_AHR_PostEX18_ManualNextDecision_ReturnToActualReviewOperation_MN00_MN01_Result_20260630.md
  R54_AHR_PostEX18_ManualNextDecision_ReturnToActualReviewOperation_MN02_MN03_Result_20260630.md
  R54_AHR_PostEX18_ManualNextDecision_ReturnToActualReviewOperation_MN04_MN05_Result_20260630.md
  R54_AHR_PostEX18_ManualNextDecision_ReturnToActualReviewOperation_MN06_MN07_Result_20260630.md
  R54_AHR_PostEX18_ManualNextDecision_ReturnToActualReviewOperation_MN08_MN09_Result_20260630.md
  R54_AHR_PostEX18_ManualNextDecision_ReturnToActualReviewOperation_MN10_MN11_Result_20260630.md
```

### 2.5 現在地

```text
current_phase:
  P7 Product Quality Runner / Long-run Product Gate

current_stage:
  R54-AHR Post-EX18 Manual Next Decision MN00-MN11 reflected

current_decision:
  RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED

current_required_next_step:
  actual_local_only_human_review_operation_required_before_p5_p6_p8_r52_decision

actual_review_basis_ref:
  current_received_snapshot_264_85_258_171

required_case_count:
  24
```

成立していること:

```text
- Post-CR22 EX00〜EX18のbody-free evidence completion helper lineが存在する。
- Post-EX18 MN00〜MN11のmanual next decision helperが存在する。
- MN00〜MN11は、EX18 greenをactual review completeへ誤昇格させない。
- MN00〜MN11は、actual review evidence missing real review required を返す。
- P5 / P6 / P8 / R52 / P7 / release の自動昇格はfalseに保持されている。
```

成立していないこと:

```text
- actual body-full packetを今回生成したこと。
- actual 24-case local-only human reviewを今回実行したこと。
- actual operation receiptを作成したこと。
- actual sanitized review result rows 24件を作成したこと。
- actual rating rows 24件を作成したこと。
- actual question need observation rows 24件を作成したこと。
- actual disposal / purge receiptを作成したこと。
- actual_review_evidence_complete_from_real_review がtrueになったこと。
- full backend suite green。
- RN contract green。
- RN real-device modal verified。
```

---

## 3. 対象範囲 / 非対象範囲

### 3.1 対象範囲

本設計で扱うもの:

```text
1. Post-MN11 actual operation scope freeze
2. MN11 decision intake / current basis ref確認
3. local-only operation preflight
4. explicit allow / operator boundary
5. review_session_id / 24-case manifest boundary
6. body-full packet generation request / local-only receipt境界
7. reviewer person boundary
8. selection-only reviewer form
9. actual 24-case local-only human review execution protocol
10. actual operation receipt intake
11. sanitized review result rows 24件のbody-free intake
12. rating rows 24件のbody-free normalization
13. readfeel / label connection / safe display / blocker分類
14. question need observation rows 24件のbody-free normalization
15. disposal / purge receipt
16. no-body / no-question / no-path / no-hash / no-touch validation
17. fixture / actual evidence separation
18. existing PostCR22 EX07〜EX18 re-entry mapping
19. evidence complete predicate
20. downstream manual decision hold
21. validation plan
22. result memo envelope
```

### 3.2 非対象範囲

本設計で扱わないもの:

```text
- P8 question API
- P8 DB
- P8 RN UI
- question trigger logic
- question text / draft question text
- question answer persistence
- API route追加・変更
- request key / response key変更
- public response top-level key追加
- DB schema変更
- DB migration
- RN production UI変更
- Emlis runtime generation変更
- User Label Connection runtime変更
- Gate threshold変更
- R52 actual execution
- P5 final判定
- P6開始
- P7 complete判定
- release decision
- full backend suite green claim
- RN real-device modal verified claim
```

### 3.3 no-touch contract

本設計の実装段階でも、基本契約は次です。

```text
api_changed: false
db_changed: false
rn_changed: false
runtime_changed: false
response_key_changed: false
public_response_top_level_key_added: false
user_label_connection_runtime_changed: false
p8_question_implementation_started: false
r52_actual_execution_started_here: false
release_decision_started_here: false
```

例外:

```text
実装段階で、既存internal helperにbody-free validationやschema-like constantを追加する可能性はある。
ただし、それはlocal-only actual evidence intakeを安全に受けるための最小補助であり、API / DB / RN / runtime変更ではない。
```

---

## 4. 設計方針

### 4.1 もう一段の判定wrapperを主目的にしない

MN00〜MN11は、すでに次を判断済みです。

```text
RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED
```

ここでさらに同種のmanual decision helperを重ねると、Cocolonとして確認すべき「実際に読んだか」から離れ、helper greenを積み増す方向に寄ります。  
そのため、Post-MN11では、判断器の精密化ではなく、actual local-only operationを成立させる運用・証跡・re-entryを設計します。

### 4.2 existing OP / EX lineを壊さず使う

既存lineには次があります。

```text
R54-OP00〜OP24:
  actual local review operation re-entry の広い運用順。

Post-CR22 EX00〜EX18:
  actual-source guard / operation receipt / rows / rating / question observation / disposal / evidence complete predicate / candidate-only separation。

Post-EX18 MN00〜MN11:
  EX18 holdをactual review completeへ読み替えず、return operation requiredへ分類する薄いmanual decision layer。
```

Post-MN11実装では、第一候補として既存 `OP` と `EX` の責務を再利用します。  
新規helperを作る場合も、巨大wrapperではなく、次だけに限定します。

```text
- MN11 outputをoperation preflightへ渡すbody-free bridge。
- actual review operation receipt / rows / disposalをexisting EX07〜EX18へ戻すre-entry envelope。
- body / question / path / hash / promotion claimの最終scan。
```

### 4.3 actual evidence と contract fixture を分ける

```text
actual evidence:
  人間reviewerがlocal-onlyで24ケースを読み、selection-only formへ記入した結果から作られたbody-free証跡。

contract fixture:
  helper / unit test / regression testのために作られたactual-shaped data。
```

禁止:

```text
- contract fixtureをactual evidenceへ読み替える。
- helper default rowsをactual review rowsへ読み替える。
- historical rowsをcurrent actual review rowsへ読み替える。
- 華恋の内部読解だけをactual human reviewへ読み替える。
```

### 4.4 body-fullはlocal-only、成果物はbody-free

local-only operationではbody-full packetが必要になる可能性があります。  
ただし、成果物へ残すものはbody-freeに閉じます。

成果物に残せるもの:

```text
receipt_ref
review_session_id
reviewer_person_ref
case_count
row_count
axis_score_refs
rating_distribution_ref
blocker_count_ref
question_need_primary_class_ref
ambiguity_kind_ref
one_question_fit_ref
p8_material_candidate_only_ref
disposal_receipt_ref
no_leak_validation_ref
actual_review_evidence_complete_predicate_ref
```

成果物に残してはいけないもの:

```text
raw input
returned Emlis body
comment_text body
history body
reviewer notes body
reviewer free text
question text
draft question text
question answer body
local absolute path
body hash
terminal output body
stdout / stderr / traceback body
```

### 4.5 question need observation は残すが、問いは作らない

P7/P8 Bridgeとして、問い必要性観察メモは残します。  
ただし、これはP8問い実装ではありません。

許可:

```text
- 問いなしで十分観測できたかの分類。
- 問いがあれば補完リスクを下げられたかの分類。
- 問いが体験を重くしないかの分類。
- 1問で足りる曖昧さかの分類。
- Emlis本体の観測力で返すべきかの分類。
- Plus向け1問候補 / Premium深掘り候補のbody-free分類。
```

禁止:

```text
- question_text
- draft_question_text
- question trigger
- question API
- question DB
- question RN UI
- question answer保存
- P8 start allowed claim
```

---

## 5. local-only operation boundary

### 5.1 operation state

Post-MN11 actual operationの状態は、body-free stateとして次を使います。

```text
NOT_STARTED
PREFLIGHT_BLOCKED
PREFLIGHT_READY
BODY_FULL_PACKET_REQUESTED_BODYFREE
PACKET_GENERATED_LOCAL_ONLY
PACKET_SCAN_PASSED_BODYFREE
REVIEWER_FORM_READY
REVIEW_IN_PROGRESS_LOCAL_ONLY
PAUSED_LOCAL_ONLY
ABORTED_BODY_PURGED
REVIEW_COMPLETED_SELECTION_ROWS_READY
OPERATION_RECEIPT_READY_BODYFREE
ROWS_ACCEPTED_BODYFREE
RATING_NORMALIZED_BODYFREE
QUESTION_OBSERVATION_NORMALIZED_BODYFREE
DISPOSAL_VERIFIED_BODYFREE
NO_LEAK_VALIDATED_BODYFREE
EVIDENCE_COMPLETE_CANDIDATE_BODYFREE
DOWNSTREAM_MANUAL_DECISION_HOLD
EVIDENCE_BLOCKED
```

### 5.2 allowed transition

```text
NOT_STARTED
  -> PREFLIGHT_READY
  -> BODY_FULL_PACKET_REQUESTED_BODYFREE
  -> PACKET_GENERATED_LOCAL_ONLY
  -> PACKET_SCAN_PASSED_BODYFREE
  -> REVIEWER_FORM_READY
  -> REVIEW_IN_PROGRESS_LOCAL_ONLY
  -> REVIEW_COMPLETED_SELECTION_ROWS_READY
  -> OPERATION_RECEIPT_READY_BODYFREE
  -> ROWS_ACCEPTED_BODYFREE
  -> RATING_NORMALIZED_BODYFREE
  -> QUESTION_OBSERVATION_NORMALIZED_BODYFREE
  -> DISPOSAL_VERIFIED_BODYFREE
  -> NO_LEAK_VALIDATED_BODYFREE
  -> EVIDENCE_COMPLETE_CANDIDATE_BODYFREE
  -> DOWNSTREAM_MANUAL_DECISION_HOLD
```

pause / abort:

```text
REVIEW_IN_PROGRESS_LOCAL_ONLY -> PAUSED_LOCAL_ONLY -> REVIEW_IN_PROGRESS_LOCAL_ONLY
REVIEW_IN_PROGRESS_LOCAL_ONLY -> ABORTED_BODY_PURGED
PACKET_GENERATED_LOCAL_ONLY -> ABORTED_BODY_PURGED
```

禁止transition:

```text
NOT_STARTED -> EVIDENCE_COMPLETE_CANDIDATE_BODYFREE
PREFLIGHT_READY -> EVIDENCE_COMPLETE_CANDIDATE_BODYFREE
PACKET_GENERATED_LOCAL_ONLY -> P8_START
ROWS_ACCEPTED_BODYFREE -> R52_ACTUAL_EXECUTION
EVIDENCE_COMPLETE_CANDIDATE_BODYFREE -> RELEASE_ALLOWED
```

---

## 6. explicit allow / operator / reviewer / approver boundary

### 6.1 role refs

本設計では、個人情報ではなくbody-free role refだけを残します。

```text
operation_controller_ref:
  local_operation_controller_ref_bodyfree

operator_ref:
  local_packet_operator_ref_bodyfree

reviewer_person_ref:
  local_person_reviewer_ref_001_bodyfree

approver_ref:
  downstream_manual_decision_approver_ref_bodyfree_optional
```

role定義:

```text
operation_controller:
  operation scope、explicit allow、purge、result memo境界を管理する役割。

operator:
  local-only packet生成・削除・body-free receipt化を実施する役割。

reviewer:
  人間として24ケースを実読し、selection-only formへ記入する役割。

approver:
  actual evidence complete後のP5/P6/P8/R52/P7/release判断を別工程で見る役割。
```

固定:

```text
reviewer_is_person: true
reviewer_person_confirmed: true
reviewer_local_only_read_receipt_present: required
reviewer_identity_public_export_allowed: false
reviewer_free_text_export_allowed: false
reviewer_notes_body_export_allowed: false
```

### 6.2 explicit allow

body-full packet生成は、明示的allowがない限り行いません。

allowに含めるbody-free項目:

```text
explicit_allow_ref
allow_scope_ref
review_session_id
actual_review_basis_ref
required_case_count
local_only_required
body_full_packet_generation_allowed_for_local_review_only
body_full_export_allowed: false
body_free_summary_export_allowed: true
retention_policy_ref
disposal_policy_ref
export_denylist_policy_ref
no_path_hash_in_artifact_required
```

allowに入れてはいけないもの:

```text
local absolute path
raw body
returned body
history body
reviewer notes body
body hash
question text
```

---

## 7. 24-case manifest boundary

required countは、既存CR lineと合わせて24で固定します。

```text
required_case_count: 24
case_ref_id_count: 24
blind_case_id_count: 24
packet_ref_id_count: 24
selection_row_count_required: 24
sanitized_review_result_row_count_required: 24
rating_row_count_required: 24
question_need_observation_row_count_required: 24
```

manifest distributionは、既存Post-CR22 / CR04の分布を継承します。

```text
history_line_eligible_input: 4
standard_state_answer_owned_history: 4
self_understanding_owned_history: 3
uncertainty_support_owned_history: 3
change_future_intention_owned_history: 3
relationship_gratitude_recovery_owned_history: 3
low_information_history_not_eligible: 2
free_tier_history_present_not_allowed: 2
```

boundary:

```text
- P4-R11 24 rowsと混同しない。
- R54 P5 Blind QA 24-case manifestとして扱う。
- case_ref_id / blind_case_id / packet_ref_idで追跡する。
- reviewer-facing packet本文は成果物へ残さない。
- family / tier / history policyはbody-free refとしてだけ残す。
```

---

## 8. body-full packet generation boundary

### 8.1 packet generation request

body-full packet generation requestはbody-freeで作ります。

requestに含めてよいもの:

```text
packet_generation_request_ref
review_session_id
actual_review_basis_ref
required_case_count: 24
case_manifest_ref
explicit_allow_ref
local_only_required: true
must_not_export: true
packet_completeness_scan_required: true
export_denylist_scan_required: true
purge_required: true
body_free: true
```

requestに含めてはいけないもの:

```text
raw input
returned Emlis body
history body
reviewer notes body
local absolute path
body hash
terminal output body
question text
```

### 8.2 packet generation local operation

実装段階で明示的allowがある場合のみ、local-only root内でbody-full packetを生成します。  
ただし、本書では生成しません。

local operationの設計条件:

```text
- local-only root以外へ書かない。
- git / artifact / public meta / result memoへ本文を出さない。
- packet completion結果はcount / boolean / refsだけにする。
- packet pathを成果物へ残さない。
- packet body hashを成果物へ残さない。
- packetはreview後にpurge対象にする。
```

### 8.3 packet completeness / export denylist scan

scanで見るもの:

```text
packet_count == 24
case_ref_id_count == 24
blind_case_id_count == 24
packet_ref_id_count == 24
reviewer_packet_required_fields_present == true
export_denylist_policy_applied == true
body_full_exported_to_artifact == false
local_absolute_path_in_artifact == false
body_hash_in_artifact == false
```

---

## 9. reviewer person boundary / selection-only form

### 9.1 reviewer成立条件

actual human reviewとして認める最低条件:

```text
reviewer_is_person: true
reviewer_person_confirmed: true
reviewer_local_only_read_receipt_present: true
actual_human_review_executed_by_person: true
reviewed_case_count: 24
selection_row_count: 24
local_only: true
must_not_export: true
selection_only: true
```

禁止:

```text
- AI helper出力をhuman reviewへ変換する。
- 華恋の内部判断だけをperson reviewへ変換する。
- unit test用rowsをactual review rowsへ変換する。
- reviewer free textを成果物へ残す。
- reviewer notes bodyを成果物へ残す。
- question text / draft question textを成果物へ残す。
- 24件未満をcomplete扱いする。
```

### 9.2 rating axes

既存CR lineのsix axesを正本として扱います。

```text
history_connection_naturalness: target 0.90
creepy_absence: target 0.95
overclaim_absence: target 0.95
self_blame_non_amplification: target 0.95
wants_more_input_or_accumulation: target 0.85
non_shallow_repeat: target 0.90
```

readfeel / label connection / safe displayの読み替え:

```text
readfeel:
  six axes全体、verdict、readfeel_blocker_idsで見る。

label connection:
  history_connection_naturalness / label_connection_quality_ref / boundary_history_line_leakで見る。

safe display:
  creepy_absence / overclaim_absence / self_blame_non_amplification / no body leak / no tier-history leakで見る。

blocker:
  readfeel_blocker_ids / execution_blocker_ids / repair_required_refsで見る。
```

### 9.3 verdict options

```text
PASS
YELLOW
REPAIR_REQUIRED
RED
BLOCKED
NOT_REVIEWABLE
```

### 9.4 sanitized_reason_ids options

```text
record_returned_as_natural_line
history_line_weak_or_generic
history_line_overread_or_creepy
current_input_overridden_by_history
boundary_history_correctly_not_used
low_information_correctly_not_deep_read
free_tier_history_correctly_not_used
question_may_reduce_overread_risk_later
p5_surface_repair_required
p4_current_surface_repair_required
safe_display_risk_detected
execution_blocker_present
```

### 9.5 readfeel_blocker_ids options

```text
history_connection_weak
history_line_creepy_or_overread
current_input_overridden_by_history
overclaim_or_unearned_certainty
self_blame_amplified
shallow_repeat_or_generic
wants_less_input_or_no_accumulation
boundary_history_line_leak
safe_display_risk
```

### 9.6 execution_blocker_ids options

```text
packet_missing
packet_not_local_only
case_manifest_incomplete
reviewer_not_assigned
reviewer_selection_incomplete
forbidden_body_leak
question_text_leak
disposal_missing
no_touch_violation
source_guard_missing
```

---

## 10. actual 24-case review execution protocol

本書ではactual reviewを実行しません。  
実装・運用段階で明示的allowがあり、local-only preflightが通った場合の手順を次に固定します。

```text
1. operation_controllerがscope / explicit allow / purge policyを確認する。
2. operatorがbody-free packet generation requestを作る。
3. operatorがlocal-only root内でbody-full packetを生成する。
4. packet completeness / export denylist scanをbody-freeで通す。
5. reviewerへselection-only formを提示する。
6. reviewerはlocal-only packetを読み、24ケースすべてにselection-onlyで回答する。
7. reviewer notesが必要な場合もlocal-onlyに閉じ、成果物へ本文を出さない。
8. reviewerはquestion textを書かず、問い必要性分類だけを選ぶ。
9. operatorがactual operation receiptをbody-freeで作る。
10. sanitized review result rows 24件をbody-freeで受ける。
11. rating rows 24件をbody-freeに正規化する。
12. question need observation rows 24件をbody-freeに正規化する。
13. body-full packet / temporary form / reviewer notesをpurgeする。
14. disposal receiptをbody-freeで残す。
15. no-leak validationを通す。
16. existing PostCR22 EX07〜EX18へre-entryする。
17. evidence complete predicateを判定する。
18. downstreamはmanual decision holdへ渡し、自動昇格しない。
```

actual run成立条件:

```text
reviewer_local_only_read_receipt_present: true
reviewed_case_count: 24
selection_row_count: 24
actual_human_review_executed_by_person: true
body_full_exported: false
reviewer_free_text_exported: false
question_text_materialized: false
```

---

## 11. body-free evidence intake

実レビュー後に必要になるbody-free bundleは次です。

```text
actual_operation_receipt:
  required

sanitized_review_result_rows:
  row_count: 24

rating_rows:
  row_count: 24

question_need_observation_rows:
  row_count: 24

disposal_receipt:
  required

no_leak_validation:
  required

actual_review_evidence_complete_predicate:
  required
```

bundle全体の禁止:

```text
raw input included: false
returned Emlis body included: false
history body included: false
comment_text body included: false
reviewer notes body included: false
reviewer free text included: false
question text included: false
draft question text included: false
local absolute path included: false
body hash included: false
terminal output body included: false
stdout / stderr / traceback included: false
```

---

## 12. actual operation receipt

actual operation receiptは、人間がlocal-onlyで24件を読んだことを示すbody-free receiptです。

必須項目:

```text
schema_version
operation_receipt_ref
review_session_id
actual_review_basis_ref
reviewer_person_ref
reviewer_is_person
reviewer_person_confirmed
reviewer_local_only_read_receipt_present
review_started_at_bucket_ref
review_completed_at_bucket_ref
reviewed_case_count
selection_row_count
local_only
must_not_export
selection_only
actual_source_ref
body_free
```

入力例:

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.post_mn11.actual_operation_receipt.bodyfree.v1",
  "operation_receipt_ref": "postmn11_actual_operation_receipt_ref_20260630_001",
  "review_session_id": "r54_ahr_postmn11_actual_local_review_session_20260630_current_received_264_85_258_171_v1",
  "actual_review_basis_ref": "current_received_snapshot_264_85_258_171",
  "reviewer_person_ref": "local_person_reviewer_ref_001_bodyfree",
  "reviewer_is_person": true,
  "reviewer_person_confirmed": true,
  "reviewer_local_only_read_receipt_present": true,
  "review_started_at_bucket_ref": "review_started_bucket_20260630_local_only",
  "review_completed_at_bucket_ref": "review_completed_bucket_20260630_local_only",
  "reviewed_case_count": 24,
  "selection_row_count": 24,
  "local_only": true,
  "must_not_export": true,
  "selection_only": true,
  "actual_source_ref": "actual_person_local_only_review_operation_receipt",
  "body_free": true
}
```

fail-closed:

```text
- operation_receipt_refなし。
- reviewer_person_ref不一致。
- reviewer_is_person false。
- reviewer_local_only_read_receipt_present false。
- reviewed_case_count != 24。
- selection_row_count != 24。
- actual_source_refがallowedでない。
- body-free禁止項目が混入している。
```

---

## 13. sanitized review result rows

### 13.1 row必須項目

```text
schema_version
review_session_id
operation_receipt_ref
review_result_row_ref
case_ref_id
blind_case_id
packet_ref_id
reviewer_person_ref
reviewed_at_bucket_ref
axis_scores
axis_score_count
axis_pass_flags
verdict_ref
label_connection_quality_ref
safe_display_check_refs
sanitized_reason_ids
readfeel_blocker_ids
execution_blocker_ids
question_need_primary_class_ref
ambiguity_kind_refs
one_question_fit_ref
repair_required_refs
plan_candidate_flags
row_source_ref
row_created_by_helper
row_created_for_unit_test
row_is_synthetic_contract_fixture
historical_row_reused
selection_only
selection_only_row
body_free
```

### 13.2 axis_scores

```text
history_connection_naturalness: 0.0〜1.0
creepy_absence: 0.0〜1.0
overclaim_absence: 0.0〜1.0
self_blame_non_amplification: 0.0〜1.0
wants_more_input_or_accumulation: 0.0〜1.0
non_shallow_repeat: 0.0〜1.0
```

### 13.3 label_connection_quality_ref

```text
label_connection_present_natural
label_connection_weak_or_generic
label_connection_overread_or_creepy
current_input_overridden_by_history
history_correctly_not_used_due_to_boundary
history_present_but_tier_not_allowed_correctly_blocked
insufficient_material_to_rate_label_connection
```

### 13.4 safe_display_check_refs

```text
no_overclaim_or_unearned_certainty
no_creepy_history_overread
no_self_blame_amplification
no_boundary_history_line_leak
no_tier_policy_leak
no_body_leak
no_question_text_leak
safe_display_risk_detected
```

### 13.5 provenance guard

```text
row_source_ref: actual_person_selection_only_rows_local_review
row_created_by_helper: false
row_created_for_unit_test: false
row_is_synthetic_contract_fixture: false
historical_row_reused: false
operation_receipt_ref matches actual operation receipt
reviewer_person_ref matches operation receipt
review_session_id matches session envelope
```

fail-closed:

```text
- row_count != 24。
- case_ref_id / blind_case_id / packet_ref_id mismatch。
- axis欠落またはscore範囲外。
- allowed option外のref。
- free text / body / question text / path / hash混入。
- helper / unit test / synthetic / historical source flagがactual扱いになっている。
```

---

## 14. rating rows

rating rowsはsanitized review result rowsからbody-freeに正規化します。  
ratingはP5 final判定ではありません。decision materialです。

必須出力:

```text
rating_row_count: 24
axis_refs: six axes
axis_score_count_per_row: 6
axis_target_thresholds_present: true
axis_pass_flags_per_row
below_target_axis_refs_per_row
average_axis_scores
label_connection_distribution_ref
safe_display_distribution_ref
verdict_distribution_ref
readfeel_blocker_count_ref
execution_blocker_count_ref
all_axis_target_passed
actual_rating_rows_materialized_from_actual_rows
rating_decision_material_only: true
p5_final_allowed: false
```

threshold:

```text
history_connection_naturalness >= 0.90
creepy_absence >= 0.95
overclaim_absence >= 0.95
self_blame_non_amplification >= 0.95
wants_more_input_or_accumulation >= 0.85
non_shallow_repeat >= 0.90
```

fail-closed:

```text
- sanitized row count != 24。
- source guard未通過。
- actual row由来でない。
- axis refs不一致。
- score範囲外。
- ratingをP5 finalへ変換している。
```

---

## 15. readfeel / label connection / safe display / blocker classification

分類refs:

```text
no_blocker
p5_readfeel_repair_required
p5_history_connection_weak
p5_creepy_or_overclaim_risk
p5_self_blame_amplification_risk
p5_safe_display_risk
p4_current_only_surface_repair_required
operation_blocked_missing_receipt
operation_blocked_body_leak
operation_blocked_question_text
operation_blocked_disposal_missing
operation_blocked_no_touch_violation
inconclusive_insufficient_material
```

P8材料候補へ流してよい条件:

```text
- operation blockerなし。
- P5 repair requiredなし。
- P4 repair requiredなし。
- readfeel blockerなし。
- safe display riskなし。
- question_need_primary_class_refがP8材料候補系。
- one_question_fit_ref == fits_one_question。
- question_would_make_immediate_observation_heavy ではない。
```

fail-closed:

```text
- P5/P4/operation/readfeel/safe-display blockerをP8 candidateへ逃がす。
- RED / BLOCKED / NOT_REVIEWABLEをcandidateへ逃がす。
- safe display riskを問いで補う扱いにする。
```

---

## 16. question need observation rows

### 16.1 目的

P7/P8 Bridgeとして、P8を勘で設計しないためのbody-free観察材料を残します。  
ただし、問い文・trigger・API・DB・RN UI・response keyは作りません。

### 16.2 row必須項目

```text
schema_version
review_session_id
operation_receipt_ref
question_need_row_ref
case_ref_id
blind_case_id
packet_ref_id
question_need_primary_class_ref
ambiguity_kind_refs
one_question_fit_ref
repair_required_refs
p8_material_candidate_only
plus_single_question_candidate_later
premium_deep_dive_candidate_later
question_text_materialized_here
draft_question_text_materialized_here
question_trigger_logic_materialized_here
p8_implementation_spec_finalized_here
body_free
```

### 16.3 question_need_primary_class_ref

```text
no_question_needed_emlis_can_observe
question_may_reduce_overread_risk
question_would_make_immediate_observation_heavy
not_question_emlis_readfeel_repair_required
not_question_p5_surface_repair_required
not_question_p4_current_surface_repair_required
not_question_gate_boundary_required
plus_single_question_candidate_later
premium_deep_dive_candidate_later
insufficient_material_execution_blocker
```

### 16.4 ambiguity_kind_refs

```text
no_material_ambiguity
missing_target
missing_time_scope
missing_emotion_intensity
missing_relation_context
missing_action_intention
conflicting_current_and_history_signal
low_information_current_input
boundary_or_tier_unclear
history_connection_basis_unclear
self_blame_or_safety_boundary_unclear
```

### 16.5 one_question_fit_ref

```text
not_needed
fits_one_question
needs_more_than_one_question_not_p7
would_delay_immediate_observation
unsafe_or_boundary_not_question
repair_required_not_question
insufficient_material
```

### 16.6 repair_required_refs

```text
no_repair_required
emlis_readfeel_repair_required
p5_surface_repair_required
p4_current_surface_repair_required
gate_boundary_repair_required
safe_display_repair_required
```

### 16.7 固定false

```text
question_text_materialized_here: false
draft_question_text_materialized_here: false
question_trigger_logic_materialized_here: false
question_answer_storage_materialized_here: false
p8_implementation_spec_finalized_here: false
p8_start_allowed: false
```

fail-closed:

```text
- question textを作る。
- draft question textを作る。
- P8 implementation spec finalizedをtrueにする。
- P8 start allowedをtrueにする。
- Emlis本体の読感不足を問い候補へ逃がす。
```

---

## 17. disposal / purge receipt

body-full packet / reviewer notes / temporary formは、review後にpurge対象です。  
disposal receiptにはbody-free情報だけを残します。

必須項目:

```text
schema_version
disposal_receipt_ref
review_session_id
operation_receipt_ref
disposal_status_ref
packet_materialized_for_review
body_removed
reviewer_notes_removed
temporary_form_removed
content_hash_of_body_stored
body_hash_stored
local_absolute_path_included
reviewer_notes_body_stored
pause_abort_status_ref
retention_policy_ref
expiration_policy_ref
actual_source_ref
body_free
```

入力例:

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.post_mn11.disposal_receipt.bodyfree.v1",
  "disposal_receipt_ref": "postmn11_disposal_receipt_ref_20260630_001",
  "review_session_id": "r54_ahr_postmn11_actual_local_review_session_20260630_current_received_264_85_258_171_v1",
  "operation_receipt_ref": "postmn11_actual_operation_receipt_ref_20260630_001",
  "disposal_status_ref": "BODY_PURGED",
  "packet_materialized_for_review": true,
  "body_removed": true,
  "reviewer_notes_removed": true,
  "temporary_form_removed": true,
  "content_hash_of_body_stored": false,
  "body_hash_stored": false,
  "local_absolute_path_included": false,
  "reviewer_notes_body_stored": false,
  "pause_abort_status_ref": "review_completed_without_abort_body_purged",
  "retention_policy_ref": "local_body_full_packet_max_72h_or_shorter",
  "expiration_policy_ref": "post_review_body_full_packet_expired_or_purged",
  "actual_source_ref": "actual_local_disposal_receipt_bodyfree",
  "body_free": true
}
```

fail-closed:

```text
- disposal receiptなし。
- packet materializedなのにbody_removed trueなし。
- disposal_status_ref == DISPOSAL_FAILED。
- body hash保存。
- local path保存。
- reviewer notes body保存。
- temporary formのbodyが残っている。
```

---

## 18. no-leak validation

検査対象:

```text
operation scope material
preflight material
packet generation request
packet receipt
operation receipt
sanitized rows
rating rows
question need rows
disposal receipt
evidence completion summary
result memo envelope
```

禁止key / 禁止値:

```text
raw_input
input_body
raw_body
returned_body
returned_emlis_body
emlis_body
history_body
history_surface
comment_text
comment_text_body
reviewer_free_text
reviewer_notes
reviewer_notes_body
question_text
draft_question_text
question_body
answer_body
local_path
local_absolute_path
body_hash
content_hash_of_body
terminal_output
stdout
stderr
traceback
```

no-touch検査:

```text
api_changed == false
db_changed == false
rn_changed == false
runtime_changed == false
response_key_changed == false
public_response_top_level_key_added == false
user_label_connection_runtime_changed == false
p8_question_implementation_started == false
r52_actual_execution_started_here == false
release_decision_started_here == false
```

passed条件:

```text
no_body_leak_validation_passed: true
no_question_text_validation_passed: true
no_path_hash_validation_passed: true
no_terminal_output_body_validation_passed: true
no_touch_validation_passed: true
```

fail-closed:

```text
禁止keyが1つでも出たら停止。
body hashは安全そうに見えても、body-full存在証跡に近いため成果物へ残さない。
local absolute pathは漏洩・環境依存・body-full所在情報のため成果物へ残さない。
```

---

## 19. existing PostCR22 EX line re-entry

実レビュー実施後は、Post-MN11独自の巨大処理で完結させず、既存PostCR22 EX07〜EX18の責務へ戻します。

```text
actual_operation_receipt -> existing PostCR22 EX07
actual selection rows provenance -> existing PostCR22 EX08
sanitized review result rows -> existing PostCR22 EX09
rating rows -> existing PostCR22 EX10
blocker classification -> existing PostCR22 EX11
question need observation rows -> existing PostCR22 EX12
rating-question consistency -> existing PostCR22 EX13
disposal / purge receipt -> existing PostCR22 EX14
final no-leak validation -> existing PostCR22 EX15
actual_review_evidence_complete predicate -> existing PostCR22 EX16
candidate-only separation -> existing PostCR22 EX17
validation / result memo / next hold -> existing PostCR22 EX18
```

Post-MN11側で行うこと:

```text
- MN11のreturn operation requiredを、actual operation preflightへ接続する。
- actual source guardを強制する。
- operation receipt / rows / disposal receiptがbody-freeで揃ったことを確認する。
- EX07〜EX18へ入れる形に揃える。
```

Post-MN11側でしないこと:

```text
- EX07〜EX18を再実装する。
- EX18 readyをR52 actual executionへ変換する。
- evidence completeをP5/P6/P8/P7/releaseへ自動昇格する。
```

---

## 20. actual_review_evidence_complete predicate

true候補になる条件:

```text
actual_source_guard_passed: true
actual_human_review_executed_by_person: true
reviewed_case_count: 24
sanitized_review_result_row_count: 24
rating_row_count: 24
question_need_observation_row_count: 24
disposal_verified: true
no_body_leak_validation_passed: true
no_question_text_validation_passed: true
no_path_hash_validation_passed: true
no_touch_validation_passed: true
consistency_guard_passed: true
actual_review_evidence_complete_from_real_review: true
```

completeでもtrueにしないもの:

```text
p5_human_blind_qa_confirmed_final: false
p5_confirmed_final: false
p5_final_allowed: false
p6_start_allowed: false
p8_start_allowed: false
r52_reintake_execution_requested_here: false
actual_r52_reintake_execution_confirmed: false
p7_complete: false
release_allowed: false
```

next_required_step:

```text
if evidence incomplete:
  continue_or_retry_actual_local_only_human_review_operation_before_downstream_decision

if evidence complete from real review:
  downstream_manual_decision_required_without_auto_execution

if leak / invalid source / promotion claim:
  stop_and_repair_bodyfree_evidence_boundary
```

---

## 21. downstream manual decision hold

actual_review_evidence_complete_from_real_review がtrue候補になっても、次を自動で実行しません。

```text
P5 final: manual decision required
P6 start: manual decision required
P8 start: manual decision required
R52 actual execution: manual decision required
P7 complete: manual decision required
release allowed: manual decision required
```

candidate-only refs:

```text
P5_CONFIRMED_CANDIDATE_BODYFREE_ONLY
P5_REPAIR_REQUIRED_BEFORE_R52_REINTAKE
P4_CURRENT_ONLY_REPAIR_REQUIRED_BEFORE_R52_REINTAKE
R54_OPERATION_BLOCKED_BODY_LEAK_OR_QUESTION_TEXT
R54_OPERATION_BLOCKED_DISPOSAL_NOT_VERIFIED
R54_OPERATION_INCONCLUSIVE_INSUFFICIENT_MATERIAL
P6_LIMITED_HUMAN_READFEEL_CANDIDATE_ONLY
P8_QUESTION_NEED_OBSERVATION_MATERIAL_CANDIDATE_ONLY
R52_REINTAKE_HANDOFF_CANDIDATE_ONLY
```

固定:

```text
P5 confirmed candidate != P5 final
P6 candidate-only != P6 start
P8 material candidate-only != P8 start
R52 handoff candidate != R52 actual execution
```

---

## 22. 実装候補ファイル構成

本書では実ファイル化しません。実装段階で現物コード・既存schema配置・既存Guard・既存test結果を見て判断します。

### 22.1 第一候補: 既存OP / EX helper再利用

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_actual_local_review_operation_reentry_20260625.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_20260629.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_20260630.py
```

再利用理由:

```text
- OP lineはlocal-only operation順を既に持つ。
- PostCR22 EX lineはactual source guard / rows / disposal / evidence predicateを既に持つ。
- MN lineはreturn operation requiredを既に分類している。
```

### 22.2 新規internal helperが必要な場合の候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_mn11_actual_local_only_human_review_operation_20260630.py
```

役割は最小に限定:

```text
- MN11 output intake。
- explicit allow / preflight / operation session envelope。
- actual operation receipt / rows / disposal bundleのbody-free validation。
- PostCR22 EX07〜EX18 re-entry envelope。
- result memo用body-free summary。
```

含めない役割:

```text
- body-full packet本文生成ロジックそのものの公開化。
- P8 question text / trigger / API / DB / RN UI。
- R52 actual execution。
- P5 final判定。
- release decision。
```

### 22.3 候補test modules

```text
mashos-api/ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op00_op01_20260630.py
mashos-api/ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op02_op03_20260630.py
mashos-api/ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op04_op05_20260630.py
mashos-api/ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op06_op07_20260630.py
mashos-api/ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op08_op09_20260630.py
mashos-api/ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op10_op11_20260630.py
mashos-api/ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op12_op13_20260630.py
mashos-api/ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op14_op15_20260630.py
mashos-api/ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op16_op17_20260630.py
mashos-api/ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op18_op19_20260630.py
mashos-api/ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op20_op21_20260630.py
mashos-api/ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op22_op23_contract_20260630.py
```

注意:

```text
test rowsはcontract fixtureであり、actual evidenceではない。
unit test greenはactual human review completeではない。
```

### 22.4 候補result memo

```text
mashos-api/ai/tests/R54_AHR_PostMN11_ActualLocalOnlyHumanReviewOperation_PMN_OP00_OP23_Result_20260630.md
```

result memo必須section:

```text
implementation_scope
changed_files
target_tests
selected_regression
compileall
mn11_intake_status
local_only_preflight_status
explicit_allow_status
actual_body_full_packet_generation_status
actual_human_review_execution_status
actual_operation_receipt_status
sanitized_review_result_row_status
rating_row_status
question_need_observation_row_status
disposal_purge_status
no_leak_validation_status
actual_review_evidence_status
reentry_mapping_status
not_claimed_boundary
next_required_step
```

result memoに入れてはいけないもの:

```text
raw input
returned body
comment_text body
history body
reviewer notes body
question text / draft question text
local absolute path
body hash
terminal output body
stdout / stderr / traceback body
```

---

## 23. 実装順

### 全体依存順

```text
PMN-OP00 scope / no-touch / no-promotion boundary freeze
PMN-OP01 MN11 manual decision intake / basis confirmation
PMN-OP02 existing OP / EX / MN support material inventory
PMN-OP03 review session envelope / actual source guard freeze
PMN-OP04 local-only preflight / explicit allow boundary
PMN-OP05 24-case manifest refreeze
PMN-OP06 body-full packet generation request body-free builder
PMN-OP07 packet generation local operation receipt boundary
PMN-OP08 packet completeness / export denylist scan
PMN-OP09 reviewer person boundary / selection-only form freeze
PMN-OP10 actual 24-case human review execution protocol / state capture
PMN-OP11 actual operation receipt intake
PMN-OP12 sanitized review result rows intake / provenance guard
PMN-OP13 rating row normalization / threshold summary
PMN-OP14 readfeel / label connection / safe display / blocker classification
PMN-OP15 question need observation row normalization
PMN-OP16 rating-question consistency guard
PMN-OP17 disposal / purge receipt intake
PMN-OP18 final no-body / no-question / no-path / no-hash / no-touch validation
PMN-OP19 actual_review_evidence_complete predicate
PMN-OP20 P5 / P6 / P8 / R52 candidate-only separation
PMN-OP21 existing PostCR22 EX07〜EX18 re-entry mapping
PMN-OP22 validation command matrix / result memo envelope
PMN-OP23 acceptance / fail-closed finalizer
```

### PMN-OP00: scope / no-touch / no-promotion boundary freeze

目的:

```text
本工程がPost-MN11 actual local-only human review operationであり、P8設計・P6開始・R52実行・P5 final・release判断ではないことを固定する。
```

出力:

```text
post_mn11_actual_operation_scope_confirmed: true
p8_question_design_out_of_scope: true
p8_question_implementation_out_of_scope: true
p6_start_out_of_scope: true
r52_actual_execution_out_of_scope: true
p5_finalization_out_of_scope: true
p7_complete_out_of_scope: true
release_decision_out_of_scope: true
no_touch_boundary_confirmed: true
no_promotion_boundary_confirmed: true
```

### PMN-OP01: MN11 manual decision intake / basis confirmation

目的:

```text
MN11 outputをbody-freeに受け、RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED と current_received_snapshot_264_85_258_171 basisを確認する。
```

必須確認:

```text
manual_decision_ref == RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED
actual_review_evidence_status_ref == actual_review_evidence_missing_real_review_required
next_required_step == actual_local_only_human_review_operation_required_before_p5_p6_p8_r52_decision
actual_review_evidence_complete_from_real_review == false
actual_review_basis_ref == current_received_snapshot_264_85_258_171
```

fail-closed:

```text
- MN11 result memo / envelope missing。
- basis refをlatest zip labelへ置換している。
- MN11 greenをactual review completeへ読み替えている。
```

### PMN-OP02: existing OP / EX / MN support material inventory

目的:

```text
既存helperを壊さず、どこを再利用し、どこに最小bridgeが必要か確認する。
```

確認対象:

```text
R54-OP00〜OP24 local operation line
PostCR22 EX07〜EX18 evidence completion line
PostEX18 MN00〜MN11 manual decision line
```

出力:

```text
existing_op_line_reuse_candidate: true
existing_ex_line_reentry_candidate: true
new_giant_wrapper_required: false
minimal_bridge_allowed_if_needed: true
```

### PMN-OP03: review session envelope / actual source guard freeze

目的:

```text
review_session_idとactual-source guardを固定し、synthetic rowsの昇格を防ぐ。
```

出力:

```text
review_session_id
actual_source_guard_required: true
allowed_actual_source_refs
forbidden_actual_source_refs
helper_default_rows_allowed_as_actual: false
unit_test_rows_allowed_as_actual: false
historical_rows_allowed_as_actual: false
body_free: true
```

### PMN-OP04: local-only preflight / explicit allow boundary

目的:

```text
body-full packet生成前に、local-only / explicit allow / retention / disposal / export denylistを固定する。
```

必須項目:

```text
local_review_root_ref_present: true
explicit_allow_ref_present: true
retention_policy_ref_present: true
disposal_policy_ref_present: true
export_denylist_policy_ref_present: true
local_only: true
must_not_export: true
body_full_packet_export_allowed: false
body_free_summary_export_allowed: true
```

### PMN-OP05: 24-case manifest refreeze

目的:

```text
R54 P5 Human Blind QAの24-case manifestをbody-freeに固定する。
```

出力:

```text
total_case_count: 24
case_ref_id_count: 24
blind_case_id_count: 24
packet_ref_id_count: 24
p4_r11_rows_confused_as_r54_review_rows: false
```

### PMN-OP06: body-full packet generation request body-free builder

目的:

```text
body-full packet生成を実行するのではなく、local-only生成要求をbody-freeで作る。
```

出力:

```text
packet_generation_request_ref
explicit_allow_ref
local_only_required: true
required_case_count: 24
purge_required: true
body_free: true
```

### PMN-OP07: packet generation local operation receipt boundary

目的:

```text
実装段階でpacketが生成された場合に、本文を残さずbody-free receiptだけを受ける境界を定義する。
```

出力:

```text
packet_generation_receipt_ref
packet_materialized_local_only: true
packet_count: 24
body_full_exported: false
local_absolute_path_included: false
body_hash_stored: false
body_free: true
```

### PMN-OP08: packet completeness / export denylist scan

目的:

```text
reviewに必要なpacketが揃い、export対象へ漏れていないことをbody-freeで確認する。
```

passed条件:

```text
packet_count == 24
packet_ref_id_count == 24
packet_completeness_scan_passed == true
export_denylist_scan_passed == true
body_full_exported == false
```

### PMN-OP09: reviewer person boundary / selection-only form freeze

目的:

```text
reviewerが人間であり、free textではなくselection-onlyで記入する形式を固定する。
```

出力:

```text
reviewer_person_ref
reviewer_is_person: true
selection_only_form_ready: true
free_text_field_export_allowed: false
question_text_field_present: false
required_axis_count: 6
required_case_count: 24
```

### PMN-OP10: actual 24-case human review execution protocol / state capture

目的:

```text
人間がlocal-onlyで24ケースを実読し、selection-only formへ評価を入れる運用手順と状態だけをbody-freeに残す。
```

出力:

```text
review_state_ref
review_started_bucket_ref
review_completed_bucket_ref
reviewed_case_count
selection_row_count
actual_human_review_executed_by_person
```

注意:

```text
本書ではactual reviewを実行しない。
実装段階のtest fixtureはactual human reviewではない。
```

### PMN-OP11: actual operation receipt intake

目的:

```text
人間がlocal-onlyで24件を読んだことを、body-free operation receiptとして受ける。
```

passed条件:

```text
reviewer_local_only_read_receipt_present == true
reviewed_case_count == 24
selection_row_count == 24
actual_source_ref == actual_person_local_only_review_operation_receipt
```

### PMN-OP12: sanitized review result rows intake / provenance guard

目的:

```text
actual review由来の24件selection-only rowsを、body-free sanitized rowsとして受ける。
```

passed条件:

```text
sanitized_review_result_row_count == 24
row_source_ref == actual_person_selection_only_rows_local_review
row_created_by_helper == false
row_created_for_unit_test == false
row_is_synthetic_contract_fixture == false
historical_row_reused == false
```

### PMN-OP13: rating row normalization / threshold summary

目的:

```text
sanitized rowsからrating rows 24件をbody-freeに正規化する。
```

出力:

```text
rating_row_count: 24
axis_refs: six axes
average_axis_scores
below_target_axis_refs
rating_decision_material_only: true
p5_final_allowed: false
```

### PMN-OP14: readfeel / label connection / safe display / blocker classification

目的:

```text
P5 repair / P4 repair / safe display / operation blocker / inconclusive / clean candidateを分離する。
```

fail-closed:

```text
- blockerをP8 candidateへ逃がす。
- safe display riskを問い候補へ逃がす。
- RED / BLOCKED / NOT_REVIEWABLEをcandidateにする。
```

### PMN-OP15: question need observation row normalization

目的:

```text
24件のquestion need observation rowsをbody-freeで作る。問い文・draft問い文は作らない。
```

出力:

```text
question_need_observation_row_count: 24
question_text_materialized_here: false
draft_question_text_materialized_here: false
p8_question_implementation_spec_finalized_here: false
p8_start_allowed: false
```

### PMN-OP16: rating-question consistency guard

目的:

```text
ratingとquestion observationが矛盾していないかを検査し、問い返しへの逃げを防ぐ。
```

検出例:

```text
- axis target未満なのにP8 candidateへしている。
- creepy / overclaim / self_blame / safe display riskがあるのに質問候補へしている。
- readfeel blockerがあるのに質問候補へしている。
- insufficient material / execution blockerなのに質問候補へしている。
- question_would_make_immediate_observation_heavyなのにP8 candidateへしている。
```

### PMN-OP17: disposal / purge receipt intake

目的:

```text
local-only body-full packet lifecycleをbody-free receiptで閉じる。
```

passed条件:

```text
disposal_receipt_ref present
disposal_status_ref == BODY_PURGED
body_removed == true
reviewer_notes_removed == true
temporary_form_removed == true
body_hash_stored == false
local_absolute_path_included == false
```

### PMN-OP18: final no-body / no-question / no-path / no-hash / no-touch validation

目的:

```text
OP00〜OP17のbody-free artifactsを横断し、body / question / path / hash / no-touch違反がないことを確認する。
```

passed条件:

```text
no_body_leak_validation_passed: true
no_question_text_validation_passed: true
no_path_hash_validation_passed: true
no_terminal_output_body_validation_passed: true
no_touch_validation_passed: true
```

### PMN-OP19: actual_review_evidence_complete predicate

目的:

```text
実レビュー由来の証跡が揃った場合だけ、actual_review_evidence_complete_from_real_reviewをtrue候補にする。
```

complete条件:

```text
actual_source_guard_passed: true
actual_human_review_executed_by_person: true
reviewed_case_count: 24
sanitized_review_result_row_count: 24
rating_row_count: 24
question_need_observation_row_count: 24
disposal_verified: true
no_body_leak_validation_passed: true
no_question_text_validation_passed: true
no_path_hash_validation_passed: true
no_touch_validation_passed: true
consistency_guard_passed: true
```

### PMN-OP20: P5 / P6 / P8 / R52 candidate-only separation

目的:

```text
evidence complete後も、downstreamをcandidate-onlyに分離し、自動昇格を防ぐ。
```

固定:

```text
p5_final_allowed: false
p6_start_allowed: false
p8_start_allowed: false
r52_actual_execution_confirmed: false
p7_complete: false
release_allowed: false
```

### PMN-OP21: existing PostCR22 EX07〜EX18 re-entry mapping

目的:

```text
operation receipt / rows / disposal / validationを既存EX lineへ戻す。
```

出力:

```text
postcr22_ex07_ex18_reentry_mapping_ready: true
reentry_executed_here: false unless implementation explicitly runs it
r52_actual_execution_started_here: false
```

### PMN-OP22: validation command matrix / result memo envelope

目的:

```text
実装結果をbody-free result memoへ閉じる。
```

result memoに記録すること:

```text
target tests
selected regression
compileall
actual operation status
actual evidence status
not claimed boundary
next required step
```

### PMN-OP23: acceptance / fail-closed finalizer

目的:

```text
Post-MN11 actual operationとしての完了条件と停止条件を最後にまとめる。
```

ready条件:

```text
scope_confirmed == true
mn11_return_operation_required_intake_passed == true
local_only_preflight_passed == true
actual_source_guard_passed == true
no_body_leak_validation_passed == true
no_question_text_validation_passed == true
no_path_hash_validation_passed == true
no_touch_validation_passed == true
no_promotion_boundary_confirmed == true
```

blocked条件:

```text
body leak detected
question text detected
local path / hash detected
promotion claim detected
MN11 result memo missing
MN11 next_required_step mismatch
unit test rows used as actual evidence
actual basis ref overwritten by latest zip label
reviewed_case_count != 24
row counts != 24
disposal receipt missing
```

---

## 24. json / schema案

本章は実装に使う候補schemaです。  
**本書ではjson / schemaファイルを実ファイル化しません。実ファイル化は実装段階で判断します。**

### 24.1 `post_mn11_actual_operation_scope.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_mn11.actual_operation_scope.bodyfree.v1",
  "title": "Post-MN11 Actual Local-only Human Review Operation Scope - Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "chosen_stage",
    "manual_decision_ref",
    "next_required_step",
    "actual_review_basis_ref",
    "required_case_count",
    "no_touch_boundary_confirmed",
    "no_promotion_boundary_confirmed",
    "p8_question_design_started",
    "p8_question_implementation_started",
    "p5_final_allowed",
    "p6_start_allowed",
    "p8_start_allowed",
    "r52_actual_execution_confirmed",
    "p7_complete",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.ahr.post_mn11.actual_operation_scope.bodyfree.v1" },
    "chosen_stage": { "const": "P7-R54-AHR Post-MN11 Actual Local-only Human Review Operation / Evidence Intake Re-entry" },
    "manual_decision_ref": { "const": "RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED" },
    "next_required_step": { "const": "actual_local_only_human_review_operation_required_before_p5_p6_p8_r52_decision" },
    "actual_review_basis_ref": { "const": "current_received_snapshot_264_85_258_171" },
    "required_case_count": { "const": 24 },
    "no_touch_boundary_confirmed": { "const": true },
    "no_promotion_boundary_confirmed": { "const": true },
    "p8_question_design_started": { "const": false },
    "p8_question_implementation_started": { "const": false },
    "p5_final_allowed": { "const": false },
    "p6_start_allowed": { "const": false },
    "p8_start_allowed": { "const": false },
    "r52_actual_execution_confirmed": { "const": false },
    "p7_complete": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 24.2 `post_mn11_local_only_preflight_allow.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_mn11.local_only_preflight_allow.bodyfree.v1",
  "title": "Post-MN11 Local-only Preflight Allow - Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "explicit_allow_ref",
    "allow_scope_ref",
    "review_session_id",
    "actual_review_basis_ref",
    "required_case_count",
    "local_only_required",
    "body_full_packet_generation_allowed_for_local_review_only",
    "body_full_export_allowed",
    "body_free_summary_export_allowed",
    "retention_policy_ref",
    "disposal_policy_ref",
    "export_denylist_policy_ref",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.ahr.post_mn11.local_only_preflight_allow.bodyfree.v1" },
    "explicit_allow_ref": { "type": "string", "pattern": "^[A-Za-z0-9_.:-]+$", "maxLength": 180 },
    "allow_scope_ref": { "const": "post_mn11_actual_review_local_only_body_full_packet_generation_for_24case_review_only" },
    "review_session_id": { "type": "string", "pattern": "^[a-z0-9_:-]+$", "maxLength": 220 },
    "actual_review_basis_ref": { "const": "current_received_snapshot_264_85_258_171" },
    "required_case_count": { "const": 24 },
    "local_only_required": { "const": true },
    "body_full_packet_generation_allowed_for_local_review_only": { "const": true },
    "body_full_export_allowed": { "const": false },
    "body_free_summary_export_allowed": { "const": true },
    "retention_policy_ref": { "enum": ["local_body_full_packet_max_72h_or_shorter", "local_body_full_packet_same_day_purge"] },
    "disposal_policy_ref": { "const": "post_review_body_full_packet_and_notes_purge_required" },
    "export_denylist_policy_ref": { "const": "deny_raw_body_question_text_path_hash_terminal_output" },
    "body_free": { "const": true }
  }
}
```

### 24.3 `post_mn11_review_session_envelope.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_mn11.review_session_envelope.bodyfree.v1",
  "title": "Post-MN11 Review Session Envelope - Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "actual_review_basis_ref",
    "required_case_count",
    "actual_source_guard_required",
    "allowed_actual_source_refs",
    "forbidden_actual_source_refs",
    "helper_default_rows_allowed_as_actual",
    "unit_test_rows_allowed_as_actual",
    "historical_rows_allowed_as_actual",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.ahr.post_mn11.review_session_envelope.bodyfree.v1" },
    "review_session_id": { "type": "string", "pattern": "^[a-z0-9_:-]+$", "maxLength": 220 },
    "actual_review_basis_ref": { "const": "current_received_snapshot_264_85_258_171" },
    "required_case_count": { "const": 24 },
    "actual_source_guard_required": { "const": true },
    "allowed_actual_source_refs": {
      "type": "array",
      "items": {
        "enum": [
          "actual_person_local_only_review_operation_receipt",
          "actual_person_selection_only_rows_local_review",
          "actual_local_body_full_packet_generation_receipt_bodyfree",
          "actual_local_disposal_receipt_bodyfree"
        ]
      },
      "minItems": 4,
      "uniqueItems": true
    },
    "forbidden_actual_source_refs": {
      "type": "array",
      "items": {
        "enum": [
          "helper_default_rows",
          "unit_test_rows",
          "synthetic_contract_fixture_rows",
          "historical_ahr_rows",
          "internal_assistant_inference_only"
        ]
      },
      "minItems": 5,
      "uniqueItems": true
    },
    "helper_default_rows_allowed_as_actual": { "const": false },
    "unit_test_rows_allowed_as_actual": { "const": false },
    "historical_rows_allowed_as_actual": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 24.4 `post_mn11_actual_operation_receipt.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_mn11.actual_operation_receipt.bodyfree.v1",
  "title": "Post-MN11 Actual Human Review Operation Receipt - Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_receipt_ref",
    "review_session_id",
    "actual_review_basis_ref",
    "reviewer_person_ref",
    "reviewer_is_person",
    "reviewer_person_confirmed",
    "reviewer_local_only_read_receipt_present",
    "reviewed_case_count",
    "selection_row_count",
    "local_only",
    "must_not_export",
    "selection_only",
    "actual_source_ref",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.ahr.post_mn11.actual_operation_receipt.bodyfree.v1" },
    "operation_receipt_ref": { "type": "string", "pattern": "^[A-Za-z0-9_.:-]+$", "maxLength": 180 },
    "review_session_id": { "type": "string", "pattern": "^[a-z0-9_:-]+$", "maxLength": 220 },
    "actual_review_basis_ref": { "const": "current_received_snapshot_264_85_258_171" },
    "reviewer_person_ref": { "type": "string", "pattern": "^[A-Za-z0-9_.:-]+$", "maxLength": 160 },
    "reviewer_is_person": { "const": true },
    "reviewer_person_confirmed": { "const": true },
    "reviewer_local_only_read_receipt_present": { "const": true },
    "reviewed_case_count": { "const": 24 },
    "selection_row_count": { "const": 24 },
    "local_only": { "const": true },
    "must_not_export": { "const": true },
    "selection_only": { "const": true },
    "actual_source_ref": { "const": "actual_person_local_only_review_operation_receipt" },
    "raw_input_included": { "const": false },
    "returned_emlis_body_included": { "const": false },
    "history_surface_included": { "const": false },
    "question_text_included": { "const": false },
    "local_absolute_path_included": { "const": false },
    "body_hash_included": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 24.5 `post_mn11_sanitized_review_result_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_mn11.sanitized_review_result_row.bodyfree.v1",
  "title": "Post-MN11 Sanitized Selection-only Review Result Row - Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "operation_receipt_ref",
    "review_result_row_ref",
    "case_ref_id",
    "blind_case_id",
    "packet_ref_id",
    "reviewer_person_ref",
    "axis_scores",
    "axis_score_count",
    "verdict_ref",
    "label_connection_quality_ref",
    "safe_display_check_refs",
    "sanitized_reason_ids",
    "readfeel_blocker_ids",
    "execution_blocker_ids",
    "question_need_primary_class_ref",
    "ambiguity_kind_refs",
    "one_question_fit_ref",
    "repair_required_refs",
    "plan_candidate_flags",
    "row_source_ref",
    "row_created_by_helper",
    "row_created_for_unit_test",
    "row_is_synthetic_contract_fixture",
    "historical_row_reused",
    "selection_only",
    "selection_only_row",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.ahr.post_mn11.sanitized_review_result_row.bodyfree.v1" },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 220 },
    "operation_receipt_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "review_result_row_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "case_ref_id": { "type": "string", "pattern": "^cral_case_ref_\\d{3}$" },
    "blind_case_id": { "type": "string", "pattern": "^cral_blind_case_\\d{3}$" },
    "packet_ref_id": { "type": "string", "pattern": "^cral_packet_ref_\\d{3}$" },
    "reviewer_person_ref": { "type": "string", "minLength": 1, "maxLength": 160 },
    "axis_scores": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "history_connection_naturalness",
        "creepy_absence",
        "overclaim_absence",
        "self_blame_non_amplification",
        "wants_more_input_or_accumulation",
        "non_shallow_repeat"
      ],
      "properties": {
        "history_connection_naturalness": { "type": "number", "minimum": 0, "maximum": 1 },
        "creepy_absence": { "type": "number", "minimum": 0, "maximum": 1 },
        "overclaim_absence": { "type": "number", "minimum": 0, "maximum": 1 },
        "self_blame_non_amplification": { "type": "number", "minimum": 0, "maximum": 1 },
        "wants_more_input_or_accumulation": { "type": "number", "minimum": 0, "maximum": 1 },
        "non_shallow_repeat": { "type": "number", "minimum": 0, "maximum": 1 }
      }
    },
    "axis_score_count": { "const": 6 },
    "verdict_ref": { "enum": ["PASS", "YELLOW", "REPAIR_REQUIRED", "RED", "BLOCKED", "NOT_REVIEWABLE"] },
    "label_connection_quality_ref": {
      "enum": [
        "label_connection_present_natural",
        "label_connection_weak_or_generic",
        "label_connection_overread_or_creepy",
        "current_input_overridden_by_history",
        "history_correctly_not_used_due_to_boundary",
        "history_present_but_tier_not_allowed_correctly_blocked",
        "insufficient_material_to_rate_label_connection"
      ]
    },
    "safe_display_check_refs": { "type": "array", "items": { "type": "string", "maxLength": 120 }, "uniqueItems": true },
    "sanitized_reason_ids": { "type": "array", "items": { "type": "string", "maxLength": 120 }, "uniqueItems": true },
    "readfeel_blocker_ids": { "type": "array", "items": { "type": "string", "maxLength": 120 }, "uniqueItems": true },
    "execution_blocker_ids": { "type": "array", "items": { "type": "string", "maxLength": 120 }, "uniqueItems": true },
    "question_need_primary_class_ref": { "type": "string", "maxLength": 160 },
    "ambiguity_kind_refs": { "type": "array", "items": { "type": "string", "maxLength": 120 }, "uniqueItems": true },
    "one_question_fit_ref": { "type": "string", "maxLength": 120 },
    "repair_required_refs": { "type": "array", "items": { "type": "string", "maxLength": 120 }, "uniqueItems": true },
    "plan_candidate_flags": { "type": "array", "items": { "type": "string", "maxLength": 120 }, "uniqueItems": true },
    "row_source_ref": { "const": "actual_person_selection_only_rows_local_review" },
    "row_created_by_helper": { "const": false },
    "row_created_for_unit_test": { "const": false },
    "row_is_synthetic_contract_fixture": { "const": false },
    "historical_row_reused": { "const": false },
    "selection_only": { "const": true },
    "selection_only_row": { "const": true },
    "body_free": { "const": true }
  }
}
```

### 24.6 `post_mn11_question_need_observation_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_mn11.question_need_observation_row.bodyfree.v1",
  "title": "Post-MN11 Question Need Observation Row - Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "operation_receipt_ref",
    "question_need_row_ref",
    "case_ref_id",
    "blind_case_id",
    "packet_ref_id",
    "question_need_primary_class_ref",
    "ambiguity_kind_refs",
    "one_question_fit_ref",
    "repair_required_refs",
    "p8_material_candidate_only",
    "question_text_materialized_here",
    "draft_question_text_materialized_here",
    "question_trigger_logic_materialized_here",
    "p8_implementation_spec_finalized_here",
    "p8_start_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.ahr.post_mn11.question_need_observation_row.bodyfree.v1" },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 220 },
    "operation_receipt_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "question_need_row_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "case_ref_id": { "type": "string", "pattern": "^cral_case_ref_\\d{3}$" },
    "blind_case_id": { "type": "string", "pattern": "^cral_blind_case_\\d{3}$" },
    "packet_ref_id": { "type": "string", "pattern": "^cral_packet_ref_\\d{3}$" },
    "question_need_primary_class_ref": {
      "enum": [
        "no_question_needed_emlis_can_observe",
        "question_may_reduce_overread_risk",
        "question_would_make_immediate_observation_heavy",
        "not_question_emlis_readfeel_repair_required",
        "not_question_p5_surface_repair_required",
        "not_question_p4_current_surface_repair_required",
        "not_question_gate_boundary_required",
        "plus_single_question_candidate_later",
        "premium_deep_dive_candidate_later",
        "insufficient_material_execution_blocker"
      ]
    },
    "ambiguity_kind_refs": { "type": "array", "items": { "type": "string", "maxLength": 120 }, "uniqueItems": true },
    "one_question_fit_ref": { "enum": ["not_needed", "fits_one_question", "needs_more_than_one_question_not_p7", "would_delay_immediate_observation", "unsafe_or_boundary_not_question", "repair_required_not_question", "insufficient_material"] },
    "repair_required_refs": { "type": "array", "items": { "type": "string", "maxLength": 120 }, "uniqueItems": true },
    "p8_material_candidate_only": { "type": "boolean" },
    "plus_single_question_candidate_later": { "type": "boolean" },
    "premium_deep_dive_candidate_later": { "type": "boolean" },
    "question_text_materialized_here": { "const": false },
    "draft_question_text_materialized_here": { "const": false },
    "question_trigger_logic_materialized_here": { "const": false },
    "p8_implementation_spec_finalized_here": { "const": false },
    "p8_start_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 24.7 `post_mn11_disposal_receipt.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_mn11.disposal_receipt.bodyfree.v1",
  "title": "Post-MN11 Disposal Receipt - Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "disposal_receipt_ref",
    "review_session_id",
    "operation_receipt_ref",
    "disposal_status_ref",
    "packet_materialized_for_review",
    "body_removed",
    "reviewer_notes_removed",
    "temporary_form_removed",
    "body_hash_stored",
    "local_absolute_path_included",
    "reviewer_notes_body_stored",
    "actual_source_ref",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.ahr.post_mn11.disposal_receipt.bodyfree.v1" },
    "disposal_receipt_ref": { "type": "string", "pattern": "^[A-Za-z0-9_.:-]+$", "maxLength": 180 },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 220 },
    "operation_receipt_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "disposal_status_ref": { "enum": ["BODY_PURGED", "ABORTED_BODY_PURGED"] },
    "packet_materialized_for_review": { "type": "boolean" },
    "body_removed": { "const": true },
    "reviewer_notes_removed": { "const": true },
    "temporary_form_removed": { "const": true },
    "content_hash_of_body_stored": { "const": false },
    "body_hash_stored": { "const": false },
    "local_absolute_path_included": { "const": false },
    "reviewer_notes_body_stored": { "const": false },
    "actual_source_ref": { "const": "actual_local_disposal_receipt_bodyfree" },
    "body_free": { "const": true }
  }
}
```

### 24.8 `post_mn11_evidence_completion_summary.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_mn11.evidence_completion_summary.bodyfree.v1",
  "title": "Post-MN11 Evidence Completion Summary - Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "actual_review_basis_ref",
    "actual_source_guard_passed",
    "actual_human_review_executed_by_person",
    "reviewed_case_count",
    "sanitized_review_result_row_count",
    "rating_row_count",
    "question_need_observation_row_count",
    "disposal_verified",
    "no_body_leak_validation_passed",
    "no_question_text_validation_passed",
    "no_path_hash_validation_passed",
    "no_touch_validation_passed",
    "consistency_guard_passed",
    "actual_review_evidence_complete_from_real_review",
    "p5_final_allowed",
    "p6_start_allowed",
    "p8_start_allowed",
    "r52_actual_execution_confirmed",
    "p7_complete",
    "release_allowed",
    "next_required_step",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.ahr.post_mn11.evidence_completion_summary.bodyfree.v1" },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 220 },
    "actual_review_basis_ref": { "const": "current_received_snapshot_264_85_258_171" },
    "actual_source_guard_passed": { "type": "boolean" },
    "actual_human_review_executed_by_person": { "type": "boolean" },
    "reviewed_case_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "sanitized_review_result_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "rating_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "question_need_observation_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "disposal_verified": { "type": "boolean" },
    "no_body_leak_validation_passed": { "type": "boolean" },
    "no_question_text_validation_passed": { "type": "boolean" },
    "no_path_hash_validation_passed": { "type": "boolean" },
    "no_touch_validation_passed": { "type": "boolean" },
    "consistency_guard_passed": { "type": "boolean" },
    "actual_review_evidence_complete_from_real_review": { "type": "boolean" },
    "p5_final_allowed": { "const": false },
    "p6_start_allowed": { "const": false },
    "p8_start_allowed": { "const": false },
    "r52_actual_execution_confirmed": { "const": false },
    "p7_complete": { "const": false },
    "release_allowed": { "const": false },
    "next_required_step": {
      "enum": [
        "continue_or_retry_actual_local_only_human_review_operation_before_downstream_decision",
        "downstream_manual_decision_required_without_auto_execution",
        "stop_and_repair_bodyfree_evidence_boundary"
      ]
    },
    "body_free": { "const": true }
  }
}
```

---

## 25. validation plan

### 25.1 target tests候補

```text
PYTHONPATH=ai/services/ai_inference python -m pytest -q \
  ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op00_op01_20260630.py

PYTHONPATH=ai/services/ai_inference python -m pytest -q \
  ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op02_op03_20260630.py

PYTHONPATH=ai/services/ai_inference python -m pytest -q \
  ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op04_op05_20260630.py

PYTHONPATH=ai/services/ai_inference python -m pytest -q \
  ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op06_op07_20260630.py

PYTHONPATH=ai/services/ai_inference python -m pytest -q \
  ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op08_op09_20260630.py

PYTHONPATH=ai/services/ai_inference python -m pytest -q \
  ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op10_op11_20260630.py

PYTHONPATH=ai/services/ai_inference python -m pytest -q \
  ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op12_op13_20260630.py

PYTHONPATH=ai/services/ai_inference python -m pytest -q \
  ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op14_op15_20260630.py

PYTHONPATH=ai/services/ai_inference python -m pytest -q \
  ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op16_op17_20260630.py

PYTHONPATH=ai/services/ai_inference python -m pytest -q \
  ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op18_op19_20260630.py

PYTHONPATH=ai/services/ai_inference python -m pytest -q \
  ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op20_op21_20260630.py

PYTHONPATH=ai/services/ai_inference python -m pytest -q \
  ai/tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op22_op23_contract_20260630.py
```

### 25.2 selected regression候補

```text
PYTHONPATH=ai/services/ai_inference python -m pytest -q \
  ai/tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn00_mn01_20260630.py \
  ai/tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn02_mn03_contract_20260630.py \
  ai/tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn04_mn05_contract_20260630.py \
  ai/tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn06_mn07_contract_20260630.py \
  ai/tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn08_mn09_contract_20260630.py \
  ai/tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn10_mn11_contract_20260630.py

PYTHONPATH=ai/services/ai_inference python -m pytest -q \
  ai/tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex00_ex01_20260629.py \
  ai/tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex02_ex03_20260629.py \
  ai/tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex04_ex05_20260629.py \
  ai/tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex06_ex07_20260629.py \
  ai/tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex08_ex09_20260629.py \
  ai/tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex10_ex11_20260629.py \
  ai/tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex12_ex13_20260629.py \
  ai/tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex14_ex15_20260629.py \
  ai/tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex16_ex17_20260629.py \
  ai/tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex18_20260630.py

PYTHONPATH=ai/services/ai_inference python -m compileall -q ai/services/ai_inference ai/tests
```

### 25.3 validationで主張してはいけないこと

```text
- target tests green = actual human review complete
- selected regression green = full backend suite green
- compileall green = product quality pass
- operation receipt schema green = actual operation receipt exists
- fixture rows schema green = actual rows exist
- MN11 green = body-full packet generated
- evidence complete candidate = P5 final / P6 start / P8 start / R52 actual execution / release allowed
```

---

## 26. fail-closed条件

次が1つでも発生した場合、actual_review_evidence_completeへ進めません。

```text
- MN11 greenをactual human review completeへ読み替える。
- actual source guardがない。
- helper default rows / unit test rows / synthetic rows / historical rowsをactual rowsとして使う。
- actual_review_basis_ref が current_received_snapshot_264_85_258_171 から勝手に差し替わる。
- 24-case manifestが24件でない。
- explicit allowなしにbody-full packetを生成する。
- body-full packetがlocal-onlyでない。
- body-full packet contentが成果物へ混ざる。
- raw input / returned Emlis body / history body / comment_text bodyが成果物へ混ざる。
- reviewer free text / reviewer notes bodyが成果物へ混ざる。
- question text / draft question textが成果物へ混ざる。
- local absolute path / body hash / terminal output bodyが成果物へ混ざる。
- reviewerがpersonである確認を省略している。
- reviewer local-only read receiptがない。
- reviewed_case_count != 24。
- selection_row_count != 24。
- sanitized_review_result_row_count != 24。
- rating_row_count != 24。
- question_need_observation_row_count != 24。
- disposal receiptがない。
- disposalがverifiedでない。
- no_body_leak / no_question_text / no_path_hash / no_touch validationが通っていない。
- P5 repair required caseをP8 material candidateへ逃がしている。
- P4 current-only repair required caseをP8 material candidateへ逃がしている。
- execution blocker caseをP8 material candidateへ逃がしている。
- readfeel blocker caseをP8 material candidateへ逃がしている。
- safe display riskをP8 material candidateへ逃がしている。
- P8 material candidate-onlyをP8 start allowedへ変換している。
- P5 confirmed candidateをP5 finalへ変換している。
- R52 handoff readyをR52 actual execution済みへ変換している。
- full backend suite未実行をgreen扱いしている。
- RN contract greenをRN実機modal確認として扱っている。
```

recovery:

```text
- body leak検出時は成果物作成を停止し、漏洩artifactを破棄対象として扱う。
- source guard不成立時は、rowsをactual evidenceとして扱わず、operation retryまたはreceipt修正へ戻す。
- basis ref差し替えが必要な場合は、Post-MN11 actual operationでは扱わず、basis refreeze工程として別設計へ分離する。
- disposal missing時はevidence completeへ進まず、purge実行またはabort body purgedへ戻す。
```

---

## 27. acceptance criteria

### 27.1 この設計書の完了条件

```text
- md設計書が作成されている。
- Post-MN11 actual local-only human review operationとして対象範囲が定義されている。
- 実装順PMN-OP00〜PMN-OP23が定義されている。
- local-only / explicit allow / operator / reviewer / approver boundaryが定義されている。
- body-full handling / disposal / no-leak境界が定義されている。
- sanitized rows / rating rows / question need observation rowsのbody-free仕様が定義されている。
- json/schema案が本書内にあり、実ファイル化しないことが明記されている。
- fixture / actual evidence分離が明記されている。
- existing PostCR22 EX07〜EX18へのre-entryが明記されている。
- P5/P6/P8/R52/P7/releaseへ自動昇格させない条件が明記されている。
```

### 27.2 実装完了条件

```text
- 既存OP / EX / MN helper再利用、またはPost-MN11最小bridgeが実装される。
- PMN-OP00〜PMN-OP23相当のtarget testsがgreen。
- MN00〜MN11 selected regressionがgreen。
- PostCR22 EX00〜EX18 selected regressionがgreen。
- compileallがgreen。
- result memoがbody-freeで作られる。
- code変更範囲がP7-R54-AHR Post-MN11 actual local-only human review operation boundaryに閉じている。
```

注意:

```text
実装greenだけでは actual_review_evidence_complete_from_real_review ではない。
実レビュー由来のreceipt / rows / disposalが必要。
```

### 27.3 actual review evidence complete条件

```text
actual_source_guard_passed: true
actual_human_review_executed_by_person: true
reviewed_case_count: 24
sanitized_review_result_row_count: 24
rating_row_count: 24
question_need_observation_row_count: 24
disposal_verified: true
no_body_leak_validation_passed: true
no_question_text_validation_passed: true
no_path_hash_validation_passed: true
no_touch_validation_passed: true
consistency_guard_passed: true
actual_review_evidence_complete_from_real_review: true
```

### 27.4 complete後も未成立のまま保持するもの

```text
p5_human_blind_qa_confirmed_final: false
p5_confirmed_final: false
p5_final_allowed: false
p6_start_allowed: false
p8_start_allowed: false
r52_reintake_execution_requested_here: false
actual_r52_reintake_execution_confirmed: false
p7_complete: false
release_allowed: false
```

---

## 28. 確認済み

```text
- 今回の指示は、検討メモを基に実装順を含めた詳細設計書をmdで作ること。
- 本作業は設計であり、実装ではない。
- GitHub接続確認はMash指定により不要。
- Cocolon_前提資料(271)とwork_attitude_rules_for_karenを確認した。
- ロードマップでは、P7/P8 Bridgeの観測補助問いはP7中に実装しないと固定されている。
- P8開始時の問い詳細設計は、P7で集めた実ケースの問い必要性観察メモを根拠にする。
- 最新前提資料では、Post-EX18 MN00-MN11 reflected は true。
- 最新前提資料では、manual_decision_ref は RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED。
- 最新前提資料では、actual_review_evidence_complete_from_real_review は false。
- 最新前提資料では、P5 final / P6 start / P8 start / R52 actual execution / P7 complete / release allowed は false。
- MN10-MN11 result memoでは、actual body-full packet generation / actual local human review / actual rows / disposal purge は not_run。
- MN00-MN11 target は 62 passed と記録されている。
- 対象helperのcompileall は passed と記録されている。
```

---

## 29. 未確認

```text
- actual body-full packet generation。
- actual 24-case local-only human review execution。
- actual operation receipt。
- actual sanitized review result rows 24件。
- actual rating rows 24件。
- actual question need observation rows 24件。
- actual disposal / purge receipt。
- actual review evidence complete from real review。
- full backend suite green。
- RN contract green。
- RN real-device modal verified。
- P5 final allowed。
- P6 start allowed。
- P8 start allowed。
- R52 actual execution confirmed。
- P7 complete。
- release allowed。
```

---

## 30. 書かれていない

```text
- MN00-MN11 green後にP8へ進んでよい、とは書かれていない。
- EX18 / MN11 greenをactual human review completeとして扱ってよい、とは書かれていない。
- unit test rowsをactual evidenceへ昇格してよい、とは書かれていない。
- P7中にquestion API / DB / RN UI / trigger / response keyを作ってよい、とは書かれていない。
- P8 material candidate-onlyをP8 start allowedへ読み替えてよい、とは書かれていない。
- body-full packetの本文・path・hash・reviewer notes本文を成果物へ残してよい、とは書かれていない。
- actual evidence completeが成立したらP5/P6/P8/R52/P7/releaseへ自動昇格してよい、とは書かれていない。
```

---

## 31. 推測禁止

```text
禁止1:
  target tests greenだから、実レビューが完了したと推測すること。

禁止2:
  actual-shaped fixture rowsがあるから、actual evidenceがあると推測すること。

禁止3:
  P8材料候補があるから、P8開始可能と推測すること。

禁止4:
  P7/P8 Bridgeがあるから、P7中に問い機能を設計・実装してよいと推測すること。

禁止5:
  latest zip labelを、actual review basisへ勝手に置換すること。

禁止6:
  body-full packetを扱う必要があるから、成果物へ本文・path・hashを残してよいと推測すること。

禁止7:
  actual_review_evidence_complete_from_real_reviewがtrue候補になったら、P5 final / P6 start / P8 start / R52 actual execution / P7 complete / release allowedをtrueへ変換すること。
```

---

## 32. 次に実行すべきこと

次に実行すべきことは、実装段階で次を判断することです。

```text
1. 既存OP / EX / MN helperだけでPost-MN11 actual operation bridgeを構成できるか確認する。
2. 足りない場合だけ、Post-MN11最小internal helperを追加する。
3. PMN-OP00〜PMN-OP23のtarget testsを作成する。
4. json/schema案を実ファイル化するかは、既存schema配置・既存Guard・既存test結果を見て判断する。
5. body-full packet生成は、明示的allowとlocal-only preflightが揃うまで実行しない。
6. actual human reviewは、人間reviewer・24件・selection-only・purge・no-leakが揃う運用として実行する。
7. 実レビュー由来のbody-free証跡が揃った場合だけ、downstream manual decisionへ渡す。
```

華恋の意見としては、最初の実装は新規巨大helperではなく、既存 `OP / EX / MN` の再利用可否を確かめる小さなbridgeから始めるのが安全です。  
ただし、body-fullを扱う段階では、設計上の強い禁止だけでは足りません。実装では、denylist scan・source guard・receipt count・purge receiptを、全部fail-closedにする必要があります。
