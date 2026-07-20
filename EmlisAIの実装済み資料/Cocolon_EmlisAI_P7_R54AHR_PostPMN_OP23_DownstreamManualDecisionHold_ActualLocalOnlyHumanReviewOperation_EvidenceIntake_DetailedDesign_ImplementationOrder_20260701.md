---
title: "Cocolon / EmlisAI P7-R54-AHR Post-PMN-OP23 Downstream Manual Decision Hold Actual Local-only Human Review Operation Evidence Intake 詳細設計書・実装順"
created_at: "2026-07-01 JST"
author: "華恋"
work_mode: "共鳴構造モード"
source_mode: "local_received_zip_only"
github_connection_check: "not_required_by_Mash_instruction"
base_pre_design_memo: "Cocolon_EmlisAI_P7_R54AHR_PostPMN_OP23_DownstreamManualDecisionHold_PreDesignMemo_20260701.md"
artifact_scope: "detailed_design_md_only"
work_type: "詳細設計書 / 実装順 / json・schema案内包"
code_change: "none"
json_schema_file_creation: "none"
actual_body_full_packet_generation: "none"
actual_local_human_review_execution: "none"
actual_rows_creation: "none"
actual_disposal_purge_execution: "none"
p5_finalization: "none"
p6_start: "none"
p8_start: "none"
p8_question_design: "none"
p8_question_implementation: "none"
r52_actual_execution: "none"
p7_complete: "none"
release_decision: "none"
selected_stage: "P7-R54-AHR Post-PMN-OP23 Downstream Manual Decision Hold -> Actual Local-only Human Review Operation Evidence Intake Entry"
---

# Cocolon / EmlisAI P7-R54-AHR Post-PMN-OP23 Downstream Manual Decision Hold Actual Local-only Human Review Operation Evidence Intake 詳細設計書・実装順

対象: Cocolon / EmlisAI / P7 Product Quality Runner / R54-AHR / Post-MN11 PMN-OP23後 / downstream manual decision hold / actual local-only human review operation / body-free evidence intake entry  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
実装扱い: 本書は設計書です。コード変更・json/schema実ファイル作成・body-full packet生成・actual local-only human review実行・actual rows作成・purge実行は行いません。  
json / schema実ファイル化: なし。本書内の案のみ。実ファイル化は実装段階で、既存helper・既存schema配置・既存Guard・既存test結果を確認して判断します。  
GitHub接続確認: Mash指定により不要。ローカル受領zip基準。  

---

## 0. 結論

次に進める実装段階は、P8ではありません。  
PMN-OP23までで閉じたbody-free helper contractを、次の実ケース証跡入口へ接続します。

```text
P7-R54-AHR Post-PMN-OP23 Downstream Manual Decision Hold
-> Actual Local-only Human Review Operation Evidence Intake Entry
```

この設計で作るべきものは、EmlisAIの新機能ではありません。  
この設計で作るべきものは、**actual local-only human reviewを開始・受入・停止できるbody-free evidence intake entry** です。

PMN-OP23時点で成立しているのは、次です。

```text
PMN-OP23 acceptance / fail-closed finalizer: implemented_bodyfree_contract
next_required_step: downstream_manual_decision_hold_after_post_mn11_pmn_op23_acceptance_bodyfree
api_changed: false
db_changed: false
rn_changed: false
runtime_changed: false
response_key_changed: false
p8_question_design: false
p8_question_implementation: false
p5_finalization: false
p6_start: false
r52_actual_execution: false
p7_complete: false
release_decision: false
```

ただし、次は未成立です。

```text
actual_body_full_packet_generation: not_run
actual_local_human_review_execution: not_run
actual_operation_receipt_from_real_operation: not_received
actual_sanitized_review_result_rows_from_real_operation: not_received
actual_rating_rows_from_real_operation: not_received
actual_question_need_observation_rows_from_real_operation: not_received
actual_disposal_purge_execution: not_run
actual_review_evidence_complete_from_real_operation_claimed: false
postcr22_ex_reentry_executed_here: false
full_backend_suite_green_claimed: false
rn_contract_green_claimed: false
rn_real_device_modal_verified_claimed: false
```

したがって、実装順は「PMN helperをさらに積む」ことを中心にしません。  
次の中心は、実レビュー由来のbody-free証跡を受けるために、PMN-OP23のhold状態からactual evidence intakeへ入る入口を作ることです。

華恋の判断として、この工程は地味ですが、Cocolonの商品価値に直結します。  
EmlisAIが本当に「読まれた形」を返せているかは、helper greenだけでは確認できません。body-fullを守りながら、人間が実ケースを読み、その結果だけをbody-freeで残す必要があります。

---

## 1. なぜこの設計を行うのか

Cocolon / EmlisAIは、ユーザー入力をただ分類したり、AIらしい返答を返したりするための機能ではありません。  
ユーザーが置いた感情・思考・行動・時点・過去記録とのつながりを、入力直後に「読まれた形」として返すことが中心です。

P8の問い設計へ進む前に、P7では次を確認しなければいけません。

```text
- EmlisAIが問いなしで読むべきケースを読めているか。
- 問いが必要に見えるケースが、本当に問いで補うべきものか。
- それともEmlisAI本体の読感・観測力・surface修正で直すべきものか。
- body-full入力を外へ出さずに、実ケースの評価証跡を残せるか。
```

ここを飛ばすと、P8の問い機能が「読めなかったことの補助」ではなく、「読めなかったことの逃げ道」になります。  
Cocolonとして大事なのは、ユーザーに質問する前に、まずユーザーの言葉を丁寧に読むことです。

そのため、本設計は次を目的にします。

```text
目的:
  PMN-OP23後のdownstream manual decision holdから、
  actual local-only human review operationへ安全に入り、
  実レビュー由来のbody-free evidenceを受けられる入口を作る。

非目的:
  P8質問機能を作ること。
  P5/P6/P8/R52/P7/releaseへ進めること。
  helper greenをactual human review evidenceへ読み替えること。
```

---

## 2. 参照資料・確認範囲

### 2.1 受領ローカル資料

```text
Cocolon_前提資料(274).zip
EmlisAIの実装済み資料(90).zip
Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(9).zip
Cocolon(263).zip
mashos-api(176).zip
Cocolon_EmlisAI_P7_R54AHR_PostPMN_OP23_DownstreamManualDecisionHold_PreDesignMemo_20260701.md
```

### 2.2 必読前提・作業姿勢

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/11_cocolon_area_specific_do_not_break.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/work_attitude_rules_for_karen/04_forbidden_mixing_design_and_implementation.txt
Cocolon_前提資料/work_attitude_rules_for_karen/08_artifact_delivery_rules.txt
Cocolon_前提資料/work_attitude_rules_for_karen/13_forbidden_reasking_existing_design_and_design_term_escape.txt
```

本設計で守る作業姿勢は次です。

```text
- 設計と実装を混ぜない。
- 前提資料だけで理解した風にしない。実ファイル・結果memoも確認する。
- helper green / pytest greenをactual human review completeへ読み替えない。
- 見ていない・受け取っていないactual evidenceを、存在するものとして扱わない。
- 指示されていないAPI / DB / RN / response key / runtime / P8機能を追加しない。
- Mashが確認しにくい場所ほど、body-free / no-touch / no-promotionを厳格にする。
```

### 2.3 EmlisAI前提

```text
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/cocolon_environment_state_output_observation_structure_design_2026_05_25.md
```

固定する読み方:

```text
- Cocolonは文字列処理サービスではない。
- EmlisAIは、入力直後の観測返答として「読まれた形」を返す出口である。
- EmlisAIを、passed + comment_textに到達したものだけ表示する許可装置へ戻さない。
- 低情報入力でも、わかったふりをしないが、無応答に潰さない。
- テンプレ共感、診断ラベル、人格断定、原因決め打ち、例文特化surfaceへ寄せない。
```

### 2.4 ロードマップ固定

```text
P7:
  Product Quality Runner / Long-run Product Gate

P7/P8 Bridge:
  P7中は観測補助問いを実装しない。
  body-freeの問い必要性観察メモだけを残す。
  P8開始時に、その実ケース観察メモを詳細設計材料として使う。

P8:
  Personal Continuity / Derived User Model
  actual review evidence未成立のまま開始しない。
```

禁止として固定すること:

```text
- P7中にP8 question API / DB / RN UIを実装しない。
- 問い発生ロジック、保存schema、response key、plan guardを確定しない。
- question_text / draft_question_textを作らない。
- Emlis本体の読感不足を問い返しで補う扱いにしない。
- raw input / raw answer / comment_text bodyをreview packetやpublic metaへ出さない。
```

### 2.5 実装済み資料・実ファイル

主に確認した現状証跡:

```text
EmlisAIの実装済み資料/
  Cocolon_EmlisAI_P7_R54AHR_PostMN11_ActualLocalOnlyHumanReviewOperation_DetailedDesign_ImplementationOrder_20260630.md

mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_mn11_actual_local_only_human_review_operation_20260630.py

mashos-api/ai/tests/
  R54_AHR_PostMN11_ActualLocalOnlyHumanReviewOperation_PMN_OP00_OP23_Result_20260630.md
  test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op22_op23_contract_20260630.py
```

---

## 3. 現在地固定

### 3.1 現在のmanual hold

PMN-OP23後の現在地は次です。

```text
current_stage:
  Post-MN11 PMN-OP23 acceptance / fail-closed finalizer reflected

current_hold:
  downstream_manual_decision_hold_after_post_mn11_pmn_op23_acceptance_bodyfree

manual_decision_ref:
  RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED

actual_review_evidence_status_ref:
  actual_review_evidence_missing_real_review_required

actual_review_basis_ref:
  current_received_snapshot_264_85_258_171

required_case_count:
  24
```

### 3.2 PMN-OP23までで成立しているもの

```text
- PMN-OP00〜OP23のbody-free helper contract lineが存在する。
- local-only preflight / explicit allow / packet generation request / operation receipt / rows / rating / question observation / disposal / no-leak / evidence predicate / candidate-only separation のcontract boundaryが存在する。
- PMN-OP22/OP23 targetは result memo上で37 passed。
- PMN-OP00〜OP23 grouped target totalは result memo上で461 passed across grouped target runs。
- Post-EX18 MN00-MN11 selected regressionは result memo上で62 passed。
- PostCR22 EX00-EX18 selected regressionは result memo上で361 passed。
- compileall target helperは result memo上でpassed。
- API / DB / RN / runtime / response keyは変更されていない扱い。
- P8質問設計・実装は開始していない扱い。
- P5/P6/P8/R52/P7/releaseの自動昇格はfalseに保持されている。
```

### 3.3 まだ成立していないもの

```text
- actual body-full packet generation
- actual 24-case local-only human review execution
- actual operation receipt from real operation
- actual sanitized review result rows from real operation
- actual rating rows from real operation
- actual question need observation rows from real operation
- actual disposal / purge receipt from real operation
- actual review evidence complete from real review
- actual PostCR22 EX07-EX18 re-entry execution
- full backend suite green
- RN contract green
- RN real-device modal verified
- P5 final
- P6 start
- P8 start
- R52 actual execution
- P7 complete
- release allowed
```

---

## 4. 対象範囲 / 非対象範囲

### 4.1 対象範囲

本設計で扱うもの:

```text
1. PMN-OP23 downstream manual decision hold intake
2. actual operation entry scope freeze
3. explicit allow receipt / local-only operation allow条件
4. local-only body-full packet handling boundary
5. 24-case manifest / review session envelope
6. human reviewer person confirmation
7. selection-only reviewer form
8. actual 24-case review operation state machine
9. actual operation receipt intake
10. sanitized body-free review result rows intake
11. body-free rating rows normalization
12. body-free question need observation rows normalization
13. rating-question consistency / blocker separation
14. disposal / purge receipt intake
15. no-body / no-question / no-path / no-hash / no-touch validation
16. fixture / contract / actual evidence separation
17. evidence complete predicate
18. PostCR22 EX07-EX18 actual evidence re-entry envelope
19. downstream manual decision hold result memo
20. fail-closed / rollback条件
```

### 4.2 非対象範囲

本設計で扱わないもの:

```text
- P8 question API
- P8 DB
- P8 RN UI
- question trigger logic
- question text / draft question text
- question answer persistence
- P8 user model / derived user model反映
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
- RN contract green claim
- RN real-device modal verified claim
```

### 4.3 no-touch contract

本設計の実装段階でも、原則は次です。

```text
api_changed: false
db_changed: false
rn_changed: false
runtime_changed: false
response_key_changed: false
public_response_top_level_key_added: false
user_label_connection_runtime_changed: false
p8_question_design_started: false
p8_question_implementation_started: false
r52_actual_execution_started_here: false
release_decision_started_here: false
```

例外候補:

```text
既存internal helperまたは最小新規internal helperに、body-free evidence intake validation / contract constants / result memo materializerを追加する可能性はある。
ただし、API / DB / RN / runtime / public response keyの変更ではない。
```

---

## 5. 設計方針

### 5.1 PMN-OP23をactual evidenceへ昇格しない

PMN-OP23は、acceptance / fail-closed finalizerです。  
これはactual human review completionではありません。

禁止:

```text
- PMN-OP23 acceptanceを actual_review_evidence_complete と扱う。
- PMN-OP22/OP23 37 passedを actual operation receipt と扱う。
- contract fixture rowsを actual review rows と扱う。
- helper predicateのtrue pathを real review evidence complete と扱う。
```

### 5.2 これ以上の巨大wrapperを主工程にしない

PMN-OP00〜OP23で、actual evidence intakeに必要なcontract boundaryは一度そろっています。  
ここから同じ種類のhelperを積み重ねるだけでは、実レビュー証跡の不足は解消しません。

したがって、実装段階の第一候補は次です。

```text
第一候補:
  既存Post-MN11 PMN helperを再利用し、
  PMN-OP23 holdをactual evidence intake entryへつなぐ最小bridgeを足す。

第二候補:
  足りない場合だけ、Post-PMN-OP23専用の最小internal helperを追加する。

禁止:
  新規巨大operation frameworkを作る。
  P8設計やP5/P6/R52/release判断を混ぜる。
```

### 5.3 body-fullはlocal-only、成果物はbody-free

actual reviewではbody-full packetを扱う可能性があります。  
ただし、成果物へ残すのはbody-free evidenceだけです。

成果物へ残してよいもの:

```text
review_session_id
actual_review_basis_ref
case_ref_id
blind_case_id
packet_ref_id
operation_receipt_ref
reviewer_person_ref_bodyfree
review_completed_bucket_ref
selection-only rating refs
classification refs
counts
booleans
receipt refs
disposal_receipt_ref
no_leak_validation_ref
evidence_completion_summary_ref
```

成果物へ残してはいけないもの:

```text
raw input
returned Emlis body
comment_text body
history body
packet body
reviewer notes body
reviewer free text
question text
draft question text
question answer body
local absolute path
body hash
content hash of body
terminal output body
stdout / stderr / traceback body
screenshot / OCR text / copied body fragment
```

### 5.4 actual evidence / contract evidence / 華恋の検討を分ける

```text
actual evidence:
  人間reviewerがlocal-onlyで24ケースを読み、selection-only formへ記入した結果から作られたbody-free証跡。

contract evidence:
  helper / unit test / regression test / schema validationのために作られたactual-shaped fixture。

華恋の検討:
  設計・境界確認・body-free policy判断。actual human reviewではない。
```

固定:

```text
contract evidence != actual evidence
華恋の設計検討 != actual human review
pytest green != actual human review complete
reviewer person receiptなし != actual operation receipt
```

### 5.5 question need observationは残すが、問いは作らない

P7/P8 Bridgeとして、問い必要性の分類は残します。  
ただし、P8問い機能は作りません。

許可:

```text
- 問いなしで十分観測できたか。
- 一問があれば補完リスクを下げられたか。
- 問いを出すと入力直後の観測体験を重くしないか。
- 問いではなくEmlis本体の読感修正で直すべきか。
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
- question answer storage
- P8 implementation spec finalized
- P8 start allowed claim
```

---

## 6. operation state machine

### 6.1 state refs

Post-PMN-OP23 evidence intake entryでは、状態をbody-free refsで扱います。

```text
DMH_NOT_STARTED
DMH_HOLD_INTAKE_BLOCKED
DMH_HOLD_INTAKE_READY
DMH_EXPLICIT_ALLOW_REQUIRED
DMH_EXPLICIT_ALLOW_ACCEPTED_BODYFREE
DMH_LOCAL_ONLY_WORKSPACE_READY_BODYFREE
DMH_BODY_FULL_PACKET_REQUESTED_BODYFREE
DMH_BODY_FULL_PACKET_GENERATED_LOCAL_ONLY
DMH_PACKET_SCAN_PASSED_BODYFREE
DMH_REVIEWER_FORM_READY
DMH_REVIEW_IN_PROGRESS_LOCAL_ONLY
DMH_PAUSED_LOCAL_ONLY
DMH_ABORTED_BODY_PURGED
DMH_REVIEW_COMPLETED_SELECTION_ROWS_READY
DMH_OPERATION_RECEIPT_ACCEPTED_BODYFREE
DMH_SANITIZED_ROWS_ACCEPTED_BODYFREE
DMH_RATING_ROWS_ACCEPTED_BODYFREE
DMH_QUESTION_OBSERVATION_ROWS_ACCEPTED_BODYFREE
DMH_DISPOSAL_VERIFIED_BODYFREE
DMH_NO_LEAK_VALIDATED_BODYFREE
DMH_EVIDENCE_COMPLETE_CANDIDATE_BODYFREE
DMH_POSTCR22_EX_REENTRY_CANDIDATE_BODYFREE
DMH_DOWNSTREAM_MANUAL_DECISION_HOLD
DMH_EVIDENCE_BLOCKED
```

### 6.2 allowed transition

```text
DMH_NOT_STARTED
  -> DMH_HOLD_INTAKE_READY
  -> DMH_EXPLICIT_ALLOW_REQUIRED
  -> DMH_EXPLICIT_ALLOW_ACCEPTED_BODYFREE
  -> DMH_LOCAL_ONLY_WORKSPACE_READY_BODYFREE
  -> DMH_BODY_FULL_PACKET_REQUESTED_BODYFREE
  -> DMH_BODY_FULL_PACKET_GENERATED_LOCAL_ONLY
  -> DMH_PACKET_SCAN_PASSED_BODYFREE
  -> DMH_REVIEWER_FORM_READY
  -> DMH_REVIEW_IN_PROGRESS_LOCAL_ONLY
  -> DMH_REVIEW_COMPLETED_SELECTION_ROWS_READY
  -> DMH_OPERATION_RECEIPT_ACCEPTED_BODYFREE
  -> DMH_SANITIZED_ROWS_ACCEPTED_BODYFREE
  -> DMH_RATING_ROWS_ACCEPTED_BODYFREE
  -> DMH_QUESTION_OBSERVATION_ROWS_ACCEPTED_BODYFREE
  -> DMH_DISPOSAL_VERIFIED_BODYFREE
  -> DMH_NO_LEAK_VALIDATED_BODYFREE
  -> DMH_EVIDENCE_COMPLETE_CANDIDATE_BODYFREE
  -> DMH_POSTCR22_EX_REENTRY_CANDIDATE_BODYFREE
  -> DMH_DOWNSTREAM_MANUAL_DECISION_HOLD
```

pause / abort:

```text
DMH_REVIEW_IN_PROGRESS_LOCAL_ONLY -> DMH_PAUSED_LOCAL_ONLY -> DMH_REVIEW_IN_PROGRESS_LOCAL_ONLY
DMH_REVIEW_IN_PROGRESS_LOCAL_ONLY -> DMH_ABORTED_BODY_PURGED
DMH_BODY_FULL_PACKET_GENERATED_LOCAL_ONLY -> DMH_ABORTED_BODY_PURGED
```

禁止transition:

```text
DMH_NOT_STARTED -> DMH_EVIDENCE_COMPLETE_CANDIDATE_BODYFREE
DMH_HOLD_INTAKE_READY -> DMH_BODY_FULL_PACKET_GENERATED_LOCAL_ONLY
DMH_BODY_FULL_PACKET_GENERATED_LOCAL_ONLY -> P8_START
DMH_SANITIZED_ROWS_ACCEPTED_BODYFREE -> R52_ACTUAL_EXECUTION
DMH_EVIDENCE_COMPLETE_CANDIDATE_BODYFREE -> RELEASE_ALLOWED
DMH_POSTCR22_EX_REENTRY_CANDIDATE_BODYFREE -> P7_COMPLETE
```

---

## 7. role boundary

本設計では、個人情報ではなくbody-free role refsだけを残します。

```text
operation_controller_ref:
  local_operation_controller_ref_bodyfree

operator_ref:
  local_packet_operator_ref_bodyfree

reviewer_person_ref:
  local_person_reviewer_ref_001_bodyfree

evidence_intake_validator_ref:
  local_bodyfree_evidence_intake_validator_ref

downstream_manual_decision_approver_ref:
  downstream_manual_decision_approver_ref_bodyfree_optional
```

role定義:

```text
operation_controller:
  scope、explicit allow、local-only境界、purge方針、result memo境界を管理する役割。

operator:
  local-only packet生成・packet削除・body-free receipt化を実施する役割。

reviewer:
  人間として24ケースを実読し、selection-only formへ記入する役割。

evidence_intake_validator:
  受領したbody-free receipt / rows / purge / no-leakを検査する役割。

downstream_manual_decision_approver:
  actual evidence complete候補後のP5/P6/P8/R52/P7/release判断を、別工程で見る役割。
```

固定:

```text
reviewer_is_person: true
reviewer_person_confirmed: true
reviewer_local_only_read_receipt_present: required
reviewer_identity_public_export_allowed: false
reviewer_free_text_export_allowed: false
reviewer_notes_body_export_allowed: false
ai_or_helper_substitution_allowed: false
```

---

## 8. 24-case review protocol

### 8.1 required unit

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

### 8.2 manifest distribution

既存R54/P5 Human Blind QA系の24-case manifest分布を継承する候補です。  
実装段階では、既存manifest helper・result memo・source実体を見て最終固定します。

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

### 8.3 manifest boundary

```text
- P4-R11 24 rowsと混同しない。
- R54 P5 Human Blind QA 24-case manifestとして扱う。
- case_ref_id / blind_case_id / packet_ref_idで追跡する。
- reviewer-facing packet本文は成果物へ残さない。
- family / tier / history policyはbody-free refとしてだけ残す。
- 24件未満はcomplete不可。
- duplicate case_ref / duplicate blind_case_id / duplicate packet_refはfail-closed。
```

---

## 9. reviewer form design

### 9.1 form principle

reviewer formはselection-onlyです。  
free text、本文引用、問い文、メモ欄、path記入欄、hash記入欄を置きません。

```text
form_type: selection_only
free_text_field_present: false
reviewer_note_field_present: false
question_text_field_present: false
draft_question_text_field_present: false
local_path_field_present: false
body_hash_field_present: false
```

### 9.2 rating axes

各caseで6軸を0.00〜1.00の選択式または段階式にします。  
実装段階では、既存PMN-OP13と同じaxis refsを使うことを第一候補にします。

```text
history_connection_naturalness
creepy_absence
overclaim_absence
self_blame_non_amplification
wants_more_input_or_accumulation
non_shallow_repeat
```

threshold候補:

```text
history_connection_naturalness >= 0.90
creepy_absence >= 0.95
overclaim_absence >= 0.95
self_blame_non_amplification >= 0.95
wants_more_input_or_accumulation >= 0.85
non_shallow_repeat >= 0.90
```

### 9.3 verdict refs

```text
PASS
YELLOW
REPAIR_REQUIRED
RED
BLOCKED
NOT_REVIEWABLE
```

### 9.4 blocker refs

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

---

## 10. question need observation design

### 10.1 目的

question need observation rowsは、P8を勘で作らないためのbody-free観察材料です。  
これはP8質問設計ではありません。

### 10.2 primary class refs

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

### 10.3 ambiguity kind refs

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

### 10.4 one question fit refs

```text
not_needed
fits_one_question
needs_more_than_one_question_not_p7
would_delay_immediate_observation
unsafe_or_boundary_not_question
repair_required_not_question
insufficient_material
```

### 10.5 fixed false flags

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
- blocker / RED / safe display riskをP8 material candidateへ逃がす。
```

---

## 11. body-full packet handling

### 11.1 explicit allow

body-full packet生成は、明示的allowがない限り実行しません。  
本書ではactual packet生成を行いません。

allowに含めてよいbody-free項目:

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

### 11.2 packet generation request

body-full packet generation requestはbody-freeで作ります。

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

### 11.3 local-only operation rule

```text
- local-only root以外へ書かない。
- git / artifact / public meta / result memoへ本文を出さない。
- packet completion結果はcount / boolean / refsだけにする。
- local absolute pathをresult memoへ出さない。
- body hashを成果物へ出さない。
- packetはreview後にpurge対象にする。
```

### 11.4 packet scan

body-freeで記録できるscan結果:

```text
packet_count: 24
packet_ref_id_count: 24
packet_completeness_scan_passed: true
export_denylist_scan_passed: true
body_full_exported: false
packet_content_included: false
question_text_included: false
local_absolute_path_included: false
body_hash_stored: false
terminal_output_body_included: false
```

---

## 12. body-free evidence bundle

実レビュー後に受けるbundleは次です。

```text
explicit_allow_receipt:
  body-full local-only operationを許可したbody-free receipt。

packet_generation_receipt:
  body-full packetがlocal-onlyで生成され、外部exportされていないことのbody-free receipt。

actual_operation_receipt:
  人間reviewerがlocal-onlyで24件を読んだことのbody-free receipt。

sanitized_review_result_rows:
  24件のselection-only body-free rows。

rating_rows:
  sanitized rowsから正規化した24件のbody-free rating rows。

question_need_observation_rows:
  P7/P8 Bridge用の24件body-free observation rows。質問文なし。

disposal_receipt:
  body-full packet / temporary form / reviewer notesのpurgeを示すbody-free receipt。

no_leak_validation_summary:
  body / question / path / hash / terminal output / no-touchの最終検査summary。

evidence_completion_summary:
  actual evidence complete candidateを判定するbody-free summary。
```

bundle全体の禁止:

```text
raw input included: false
comment_text body included: false
returned Emlis body included: false
history body included: false
reviewer notes body included: false
question text included: false
draft question text included: false
local absolute path included: false
body hash included: false
terminal output body included: false
```

---

## 13. 実装候補ファイル構成

本書では実ファイル化しません。実装段階で現物コード・既存schema配置・既存Guard・既存test結果を見て判断します。

### 13.1 第一候補: 既存PMN helperを拡張せず再利用する

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_mn11_actual_local_only_human_review_operation_20260630.py
```

再利用理由:

```text
- PMN-OP00〜OP23がすでにscope / allow / packet request / receipt / rows / rating / question observation / disposal / no-leak / evidence predicate / candidate-only / re-entry mappingを持つ。
- 既存のbody-free validationを壊さず、actual evidence intake entry側は薄いbundle assemblerにできる可能性がある。
- 追加wrapperを重ねるより、actual evidence不足へ直接向かえる。
```

### 13.2 第二候補: 最小internal helperを追加する場合

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_20260701.py
```

役割は最小に限定します。

```text
- PMN-OP23 finalizer output intake。
- explicit allow receipt / review session envelopeのbody-free受入。
- actual operation receipt / rows / disposal bundleのbody-free validation。
- existing PMN helperまたはPostCR22 EX07〜EX18 re-entryへ渡すbody-free envelope作成。
- result memo用body-free summary作成。
```

含めない役割:

```text
- body-full packet本文生成ロジックの公開化。
- P8 question text / trigger / API / DB / RN UI。
- R52 actual execution。
- P5 final判定。
- release decision。
```

### 13.3 候補test modules

```text
mashos-api/ai/tests/test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op00_op03_20260701.py
mashos-api/ai/tests/test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op04_op06_20260701.py
mashos-api/ai/tests/test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op07_op10_20260701.py
mashos-api/ai/tests/test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op11_op14_20260701.py
mashos-api/ai/tests/test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op15_op18_20260701.py
```

注意:

```text
test rowsはcontract fixtureであり、actual evidenceではない。
unit test greenはactual human review completeではない。
```

### 13.4 候補result memo

```text
mashos-api/ai/tests/R54_AHR_PostPMN23_DownstreamManualDecisionHold_EvidenceIntake_DMH_OP00_OP18_Result_20260701.md
```

result memo必須section:

```text
implementation_scope
changed_files
target_tests
selected_regression
compileall
pmn_op23_hold_intake_status
explicit_allow_status
actual_body_full_packet_generation_status
packet_scan_status
actual_human_review_execution_status
actual_operation_receipt_status
sanitized_review_result_row_status
rating_row_status
question_need_observation_row_status
disposal_purge_status
no_leak_validation_status
actual_review_evidence_status
postcr22_ex_reentry_status
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

## 14. 実装順

### 全体依存順

```text
DMH-OP00 scope / no-touch / no-promotion re-freeze
DMH-OP01 PMN-OP23 downstream manual decision hold intake
DMH-OP02 existing PMN / PostCR22 EX re-use decision
DMH-OP03 explicit allow receipt / local-only review session envelope
DMH-OP04 24-case manifest / packet request boundary
DMH-OP05 body-full packet generation receipt intake boundary
DMH-OP06 packet completeness / export denylist scan receipt
DMH-OP07 reviewer person confirmation / selection-only form finalization
DMH-OP08 actual review operation state machine / pause-abort lifecycle
DMH-OP09 actual operation receipt intake
DMH-OP10 sanitized review result rows intake / provenance guard
DMH-OP11 rating rows normalization / threshold summary
DMH-OP12 question need observation rows normalization
DMH-OP13 rating-question consistency / blocker separation
DMH-OP14 disposal / purge receipt intake
DMH-OP15 final no-body / no-question / no-path / no-hash / no-touch validation
DMH-OP16 actual_review_evidence_complete predicate
DMH-OP17 PostCR22 EX07-EX18 actual evidence re-entry envelope
DMH-OP18 result memo / downstream manual decision hold finalizer
```

### DMH-OP00: scope / no-touch / no-promotion re-freeze

目的:

```text
PMN-OP23後の工程がactual local-only human review evidence intake entryであり、P8設計・P6開始・R52実行・P5 final・release判断ではないことを再固定する。
```

出力:

```text
post_pmn23_dmh_scope_confirmed: true
actual_local_only_human_review_evidence_intake_entry: true
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

fail-closed:

```text
- scope内にP8質問設計が混入している。
- API / DB / RN / runtime / response key変更が前提になっている。
- PMN-OP23 acceptanceをactual evidence completeへ読み替えている。
```

### DMH-OP01: PMN-OP23 downstream manual decision hold intake

目的:

```text
PMN-OP23 outputをbody-freeに受け、downstream_manual_decision_hold_after_post_mn11_pmn_op23_acceptance_bodyfree を確認する。
```

必須確認:

```text
pmn_op23_acceptance_finalizer_present: true
pmn_op23_next_required_step == downstream_manual_decision_hold_after_post_mn11_pmn_op23_acceptance_bodyfree
actual_review_evidence_status_ref == actual_review_evidence_missing_real_review_required
actual_review_evidence_complete_from_real_review == false
actual_review_basis_ref == current_received_snapshot_264_85_258_171
```

fail-closed:

```text
- PMN-OP23 result memo / envelope missing。
- next_required_step mismatch。
- PMN-OP23 greenをactual human review completeへ読み替えている。
- basis refをlatest zip labelへ置換している。
```

### DMH-OP02: existing PMN / PostCR22 EX re-use decision

目的:

```text
既存PMN helperとPostCR22 EX lineを壊さず、追加が必要かを判断する。
```

出力:

```text
existing_pmn_helper_reuse_candidate: true
existing_postcr22_ex_reentry_candidate: true
new_giant_wrapper_required: false
minimal_evidence_intake_bridge_allowed_if_needed: true
```

fail-closed:

```text
- 既存helperの責務を再確認せず、新規巨大helperを作る。
- EX07〜EX18 re-entryを実行済みとして扱う。
- helper fixtureをactual evidenceへ変換する。
```

### DMH-OP03: explicit allow receipt / local-only review session envelope

目的:

```text
body-full packet生成前に、Mashの明示許可、local-only条件、retention / disposal / export denylistをbody-free receiptとして固定する。
```

必須項目:

```text
explicit_allow_ref_present: true
allow_scope_ref_present: true
review_session_id_present: true
actual_review_basis_ref_present: true
required_case_count: 24
local_only_required: true
body_full_packet_generation_allowed_for_local_review_only: true
body_full_export_allowed: false
body_free_summary_export_allowed: true
retention_policy_ref_present: true
disposal_policy_ref_present: true
export_denylist_policy_ref_present: true
```

fail-closed:

```text
- explicit allowなしにpacket生成へ進む。
- local path / raw body / body hash / question textがallow receiptへ混入する。
- disposal policyなし。
```

### DMH-OP04: 24-case manifest / packet request boundary

目的:

```text
24-case manifestをbody-freeに固定し、packet generation requestをbody-freeで作る。
```

出力:

```text
case_manifest_ref
case_ref_id_count: 24
blind_case_id_count: 24
packet_ref_id_count: 24
packet_generation_request_ref
local_only_required: true
purge_required: true
must_not_export: true
body_free: true
```

fail-closed:

```text
- manifest count != 24。
- duplicate case / blind / packet refs。
- packet requestに本文・path・hash・terminal outputが混入する。
```

### DMH-OP05: body-full packet generation receipt intake boundary

目的:

```text
実装段階でbody-full packetがlocal-only生成された場合に、本文を残さずbody-free receiptだけを受ける境界を定義する。
```

passed条件:

```text
packet_generation_receipt_ref present
packet_materialized_local_only: true
packet_count: 24
body_full_exported: false
local_absolute_path_included: false
body_hash_stored: false
packet_content_included: false
body_free: true
```

fail-closed:

```text
- receiptがない。
- packet_count != 24。
- local absolute path / body hash / packet contentがreceiptへ混入する。
- body_full_exported == true。
```

### DMH-OP06: packet completeness / export denylist scan receipt

目的:

```text
reviewに必要なpacketが揃い、成果物やexport対象へ漏れていないことをbody-freeで確認する。
```

passed条件:

```text
packet_completeness_scan_passed: true
export_denylist_scan_passed: true
packet_count: 24
packet_ref_id_count: 24
raw_input_detected_in_export: false
comment_text_detected_in_export: false
question_text_detected_in_export: false
local_path_detected_in_export: false
body_hash_detected_in_export: false
terminal_output_body_detected_in_export: false
```

fail-closed:

```text
- packet scan missing。
- any forbidden export detected。
- scanが実folderではなくfixtureだけを見ているのにactual scan扱いしている。
```

### DMH-OP07: reviewer person confirmation / selection-only form finalization

目的:

```text
reviewerが人間であり、selection-only formで記入することを固定する。
```

出力:

```text
reviewer_person_ref
reviewer_is_person: true
reviewer_person_confirmed: true
selection_only_form_ready: true
free_text_field_present: false
question_text_field_present: false
required_axis_count: 6
required_case_count: 24
ai_or_helper_substitution_allowed: false
```

fail-closed:

```text
- reviewer person confirmationなし。
- free text欄が成果物に残る。
- 華恋の設計検討やAI評価をhuman reviewとして扱う。
```

### DMH-OP08: actual review operation state machine / pause-abort lifecycle

目的:

```text
actual 24-case local-only reviewの開始・一時停止・中断・完了をbody-free状態だけで扱う。
```

出力:

```text
review_state_ref
review_started_bucket_ref
review_completed_bucket_ref
reviewed_case_count
selection_row_count
pause_abort_status_ref
actual_human_review_executed_by_person
```

fail-closed:

```text
- review stateに本文・question text・path・hashが混入する。
- partial reviewをcomplete扱いする。
- abort時にbody purgeへ進まない。
```

### DMH-OP09: actual operation receipt intake

目的:

```text
人間がlocal-onlyで24件を読んだことをbody-free operation receiptとして受ける。
```

passed条件:

```text
operation_receipt_ref present
reviewer_local_only_read_receipt_present: true
reviewed_case_count: 24
selection_row_count: 24
actual_source_ref == actual_person_local_only_review_operation_receipt
selection_only: true
body_free: true
```

fail-closed:

```text
- operation receiptなし。
- reviewer local-only read receiptなし。
- reviewed_case_count != 24。
- helper / unit test / synthetic sourceがactual扱い。
```

### DMH-OP10: sanitized review result rows intake / provenance guard

目的:

```text
actual review由来の24件selection-only rowsを、body-free sanitized rowsとして受ける。
```

passed条件:

```text
sanitized_review_result_row_count: 24
row_source_ref == actual_person_selection_only_rows_local_review
row_created_by_helper: false
row_created_for_unit_test: false
row_is_synthetic_contract_fixture: false
historical_row_reused: false
selection_only_row: true
body_free: true
```

fail-closed:

```text
- row_count != 24。
- case_ref / blind_case / packet_ref mismatch。
- axis欠落またはscore範囲外。
- allowed option外のref。
- free text / body / question text / path / hash混入。
```

### DMH-OP11: rating rows normalization / threshold summary

目的:

```text
sanitized rowsからrating rows 24件をbody-freeに正規化する。
```

出力:

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
actual_rating_rows_materialized_from_actual_rows: true
rating_decision_material_only: true
p5_final_allowed: false
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

### DMH-OP12: question need observation rows normalization

目的:

```text
P7/P8 Bridgeとして、24件のquestion need observation rowsをbody-freeで作る。問い文・draft問い文は作らない。
```

出力:

```text
question_need_observation_row_count: 24
question_text_materialized_here: false
draft_question_text_materialized_here: false
question_trigger_logic_materialized_here: false
question_answer_storage_materialized_here: false
p8_implementation_spec_finalized_here: false
p8_start_allowed: false
body_free: true
```

fail-closed:

```text
- question textを作る。
- draft question textを作る。
- P8 implementation spec finalizedをtrueにする。
- P8 start allowedをtrueにする。
- Emlis本体の読感不足を問い候補へ逃がす。
```

### DMH-OP13: rating-question consistency / blocker separation

目的:

```text
ratingとquestion observationの矛盾を防ぎ、修正・安全・読感blockerをP8 candidateへ逃がさない。
```

検出例:

```text
- axis target未満なのにP8 candidateへしている。
- creepy / overclaim / self_blame / safe display riskがあるのに質問候補へしている。
- readfeel blockerがあるのに質問候補へしている。
- insufficient material / execution blockerなのに質問候補へしている。
- question_would_make_immediate_observation_heavyなのにP8 candidateへしている。
```

passed条件:

```text
rating_question_consistency_guard_passed: true
p5_repair_required_cases_routed_to_p5_repair: true
p4_repair_required_cases_routed_to_p4_repair: true
safe_display_risk_cases_not_routed_to_p8: true
operation_blocker_cases_not_routed_to_p8: true
```

### DMH-OP14: disposal / purge receipt intake

目的:

```text
local-only body-full packet lifecycleをbody-free receiptで閉じる。
```

passed条件:

```text
disposal_receipt_ref present
disposal_status_ref in [BODY_PURGED, ABORTED_BODY_PURGED]
body_removed: true
reviewer_notes_removed: true
temporary_form_removed: true
content_hash_of_body_stored: false
body_hash_stored: false
local_absolute_path_included: false
reviewer_notes_body_stored: false
actual_source_ref == actual_local_disposal_receipt_bodyfree
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

### DMH-OP15: final no-body / no-question / no-path / no-hash / no-touch validation

目的:

```text
受け取ったbody-free artifactsを横断し、body / question / path / hash / terminal output / no-touch違反がないことを確認する。
```

検査対象:

```text
scope material
PMN-OP23 hold intake material
explicit allow receipt
packet generation receipt
packet scan receipt
operation receipt
sanitized rows
rating rows
question need rows
disposal receipt
evidence completion summary
result memo envelope
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
- 禁止key / 禁止値が1つでも出る。
- body hashを安全情報として保存している。
- local absolute pathを環境情報として保存している。
- stdout / stderr / traceback bodyをmemoへ貼っている。
```

### DMH-OP16: actual_review_evidence_complete predicate

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

### DMH-OP17: PostCR22 EX07-EX18 actual evidence re-entry envelope

目的:

```text
actual evidence bundleを既存PostCR22 EX07〜EX18の責務へ戻せる形に整える。ただし、本工程だけでR52 actual executionはしない。
```

mapping:

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

出力:

```text
postcr22_ex07_ex18_reentry_envelope_ready: true
postcr22_ex07_ex18_reentry_executed_here: false
r52_actual_execution_started_here: false
```

fail-closed:

```text
- re-entry envelope readyをre-entry executedへ読み替える。
- EX18 readyをR52 actual executionへ変換する。
- evidence completeをP5/P6/P8/P7/releaseへ自動昇格する。
```

### DMH-OP18: result memo / downstream manual decision hold finalizer

目的:

```text
実装結果・受入結果をbody-free result memoへ閉じ、次判断をdownstream manual decision holdへ渡す。
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

固定:

```text
P5 confirmed candidate != P5 final
P6 candidate-only != P6 start
P8 material candidate-only != P8 start
R52 handoff candidate != R52 actual execution
```

---

## 15. json / schema案

本章は実装に使う候補schemaです。  
**本書ではjson / schemaファイルを実ファイル化しません。実ファイル化は実装段階で判断します。**

### 15.1 `post_pmn23_dmh_scope.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_pmn23.dmh_scope.bodyfree.v1",
  "title": "Post-PMN23 Downstream Manual Decision Hold Scope - Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "chosen_stage",
    "pmn_op23_next_required_step",
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
    "schema_version": { "const": "cocolon.emlis.p7_r54.ahr.post_pmn23.dmh_scope.bodyfree.v1" },
    "chosen_stage": { "const": "P7-R54-AHR Post-PMN-OP23 Downstream Manual Decision Hold -> Actual Local-only Human Review Operation Evidence Intake Entry" },
    "pmn_op23_next_required_step": { "const": "downstream_manual_decision_hold_after_post_mn11_pmn_op23_acceptance_bodyfree" },
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

### 15.2 `post_pmn23_explicit_allow_receipt.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_pmn23.explicit_allow_receipt.bodyfree.v1",
  "title": "Post-PMN23 Explicit Allow Receipt - Body-free",
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
    "no_path_hash_in_artifact_required",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.ahr.post_pmn23.explicit_allow_receipt.bodyfree.v1" },
    "explicit_allow_ref": { "type": "string", "pattern": "^[A-Za-z0-9_.:-]+$", "maxLength": 180 },
    "allow_scope_ref": { "const": "post_pmn23_actual_review_local_only_body_full_packet_generation_for_24case_review_only" },
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
    "no_path_hash_in_artifact_required": { "const": true },
    "body_free": { "const": true }
  }
}
```

### 15.3 `post_pmn23_packet_generation_receipt.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_pmn23.packet_generation_receipt.bodyfree.v1",
  "title": "Post-PMN23 Packet Generation Receipt - Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "packet_generation_receipt_ref",
    "review_session_id",
    "actual_review_basis_ref",
    "packet_materialized_local_only",
    "packet_count",
    "packet_ref_id_count",
    "body_full_exported",
    "packet_content_included",
    "local_absolute_path_included",
    "body_hash_stored",
    "actual_source_ref",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.ahr.post_pmn23.packet_generation_receipt.bodyfree.v1" },
    "packet_generation_receipt_ref": { "type": "string", "pattern": "^[A-Za-z0-9_.:-]+$", "maxLength": 180 },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 220 },
    "actual_review_basis_ref": { "const": "current_received_snapshot_264_85_258_171" },
    "packet_materialized_local_only": { "const": true },
    "packet_count": { "const": 24 },
    "packet_ref_id_count": { "const": 24 },
    "body_full_exported": { "const": false },
    "packet_content_included": { "const": false },
    "local_absolute_path_included": { "const": false },
    "body_hash_stored": { "const": false },
    "actual_source_ref": { "const": "actual_local_body_full_packet_generation_receipt_bodyfree" },
    "body_free": { "const": true }
  }
}
```

### 15.4 `post_pmn23_actual_operation_receipt.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_pmn23.actual_operation_receipt.bodyfree.v1",
  "title": "Post-PMN23 Actual Human Review Operation Receipt - Body-free",
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
    "schema_version": { "const": "cocolon.emlis.p7_r54.ahr.post_pmn23.actual_operation_receipt.bodyfree.v1" },
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

### 15.5 `post_pmn23_sanitized_review_result_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_pmn23.sanitized_review_result_row.bodyfree.v1",
  "title": "Post-PMN23 Sanitized Selection-only Review Result Row - Body-free",
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
    "selection_only_row",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.ahr.post_pmn23.sanitized_review_result_row.bodyfree.v1" },
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
    "selection_only_row": { "const": true },
    "body_free": { "const": true }
  }
}
```

### 15.6 `post_pmn23_question_need_observation_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_pmn23.question_need_observation_row.bodyfree.v1",
  "title": "Post-PMN23 Question Need Observation Row - Body-free",
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
    "plus_single_question_candidate_later",
    "premium_deep_dive_candidate_later",
    "question_text_materialized_here",
    "draft_question_text_materialized_here",
    "question_trigger_logic_materialized_here",
    "question_answer_storage_materialized_here",
    "p8_implementation_spec_finalized_here",
    "p8_start_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.ahr.post_pmn23.question_need_observation_row.bodyfree.v1" },
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
    "question_answer_storage_materialized_here": { "const": false },
    "p8_implementation_spec_finalized_here": { "const": false },
    "p8_start_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 15.7 `post_pmn23_disposal_purge_receipt.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_pmn23.disposal_purge_receipt.bodyfree.v1",
  "title": "Post-PMN23 Disposal / Purge Receipt - Body-free",
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
    "content_hash_of_body_stored",
    "body_hash_stored",
    "local_absolute_path_included",
    "reviewer_notes_body_stored",
    "actual_source_ref",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.ahr.post_pmn23.disposal_purge_receipt.bodyfree.v1" },
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

### 15.8 `post_pmn23_evidence_completion_summary.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_pmn23.evidence_completion_summary.bodyfree.v1",
  "title": "Post-PMN23 Evidence Completion Summary - Body-free",
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
    "postcr22_ex_reentry_envelope_ready",
    "postcr22_ex_reentry_executed_here",
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
    "schema_version": { "const": "cocolon.emlis.p7_r54.ahr.post_pmn23.evidence_completion_summary.bodyfree.v1" },
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
    "postcr22_ex_reentry_envelope_ready": { "type": "boolean" },
    "postcr22_ex_reentry_executed_here": { "const": false },
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

## 16. validation plan

### 16.1 target tests候補

実装段階での候補です。今回、本書作成時には実行しません。

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op00_op03_20260701.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op04_op06_20260701.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op07_op10_20260701.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op11_op14_20260701.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op15_op18_20260701.py
```

### 16.2 selected regression候補

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op22_op23_contract_20260630.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn00_mn01_20260630.py \
  tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn02_mn03_contract_20260630.py \
  tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn04_mn05_contract_20260630.py \
  tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn06_mn07_contract_20260630.py \
  tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn08_mn09_contract_20260630.py \
  tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn10_mn11_contract_20260630.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex00_ex01_20260629.py \
  tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex02_ex03_20260629.py \
  tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex04_ex05_20260629.py \
  tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex06_ex07_20260629.py \
  tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex08_ex09_20260629.py \
  tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex10_ex11_20260629.py \
  tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex12_ex13_20260629.py \
  tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex14_ex15_20260629.py \
  tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex16_ex17_20260629.py \
  tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex18_20260630.py

python3 -m compileall -q services/ai_inference tests
```

### 16.3 validationで主張してはいけないこと

```text
- target tests green = actual human review complete
- selected regression green = full backend suite green
- compileall green = product quality pass
- operation receipt schema green = actual operation receipt exists
- fixture rows schema green = actual rows exist
- PMN-OP23 green = body-full packet generated
- evidence complete candidate = P5 final / P6 start / P8 start / R52 actual execution / release allowed
```

---

## 17. fail-closed条件

次が1つでも発生した場合、actual_review_evidence_completeへ進めません。

```text
- PMN-OP23 acceptanceをactual human review completeへ読み替える。
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
- basis ref差し替えが必要な場合は、Post-PMN-OP23 evidence intakeでは扱わず、basis refreeze工程として別設計へ分離する。
- disposal missing時はevidence completeへ進まず、purge実行またはabort body purgedへ戻す。
- P8候補へ逃がしたcaseは、P5/P4/readfeel/safe display repair分類へ戻す。
```

---

## 18. acceptance criteria

### 18.1 この設計書の完了条件

```text
- md設計書が作成されている。
- Post-PMN-OP23 downstream manual decision holdからactual evidence intake entryへ進む範囲が定義されている。
- 実装順DMH-OP00〜DMH-OP18が定義されている。
- local-only / explicit allow / operator / reviewer / validator / approver boundaryが定義されている。
- body-full handling / disposal / no-leak境界が定義されている。
- sanitized rows / rating rows / question need observation rowsのbody-free仕様が定義されている。
- json/schema案が本書内にあり、実ファイル化しないことが明記されている。
- fixture / contract / actual evidence分離が明記されている。
- existing PostCR22 EX07〜EX18へのre-entry envelopeが明記されている。
- P5/P6/P8/R52/P7/releaseへ自動昇格させない条件が明記されている。
```

### 18.2 実装完了条件

```text
- 既存PMN helper再利用、またはPost-PMN-OP23最小internal helperが実装される。
- DMH-OP00〜DMH-OP18相当のtarget testsがgreen。
- PMN-OP22/OP23 selected regressionがgreen。
- MN00〜MN11 selected regressionがgreen。
- PostCR22 EX00〜EX18 selected regressionがgreen。
- compileallがgreen。
- result memoがbody-freeで作られる。
- code変更範囲がP7-R54-AHR Post-PMN-OP23 evidence intake entry boundaryに閉じている。
```

注意:

```text
実装greenだけでは actual_review_evidence_complete_from_real_review ではない。
実レビュー由来のreceipt / rows / disposalが必要。
```

### 18.3 actual review evidence complete条件

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

### 18.4 complete後も未成立のまま保持するもの

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

## 19. 華恋の意見

華恋としては、次の実装は「新規巨大helper」ではなく、既存PMN helperとPostCR22 EX lineの再利用可否を最初に確認するのが安全だと考えます。  
PMN-OP23までで、かなり細かいbody-free contract boundaryは揃っています。ここでまた判定wrapperを増やし続けると、実レビュー証跡を作るという目的から離れます。

ただし、actual body-full packetを扱う段階では、設計上の禁止だけでは足りません。  
実装では、allow receipt、packet receipt、operation receipt、row source guard、purge receipt、no-leak scanを全部fail-closedにする必要があります。

P8の問い設計は魅力的ですが、今はまだ早いです。  
問いは、EmlisAIが読んだうえで補助が必要なときにだけ出るべきです。EmlisAIが読めていないところを問いで埋める構造にしてしまうと、Cocolonが目指す「ユーザーの言葉を丁寧に受け取る場所」からずれます。

そのため、次は、派手な機能ではなく、actual review evidenceを安全に成立させる入口へ進むのがよいです。

---

## 20. 確認済み

```text
- 今回の指示は、検討メモを基に実装順を含めた詳細設計書をmdで作ること。
- 本作業は設計であり、実装ではない。
- GitHub接続確認はMash指定により不要。
- Cocolon_前提資料(274)とwork_attitude_rules_for_karenを確認した。
- EmlisAI必読前提資料を確認した。
- ロードマップでは、P7/P8 Bridgeの観測補助問いはP7中に実装しないと固定されている。
- P8開始時の問い詳細設計は、P7で集めた実ケースの問い必要性観察メモを根拠にする。
- PMN-OP23までのbody-free acceptance / fail-closed finalizerは存在する。
- PMN-OP23のnext_required_stepは downstream_manual_decision_hold_after_post_mn11_pmn_op23_acceptance_bodyfree。
- PMN-OP22/OP23 targetは result memo上で37 passed。
- PMN-OP00〜OP23 grouped target totalは result memo上で461 passed across grouped target runs。
- Post-EX18 MN00-MN11 selected regressionは result memo上で62 passed。
- PostCR22 EX00-EX18 selected regressionは result memo上で361 passed。
- compileall target helperは result memo上でpassed。
- PMN-OP23 result memo上、actual body-full packet generation / actual local human review / actual rows / disposal purge は not_run / not_received。
- actual review evidence complete from real operation は false / not claimed。
- P5 final / P6 start / P8 start / R52 actual execution / P7 complete / release allowed は未成立。
```

---

## 21. 未確認

```text
- actual body-full packet generation。
- actual 24-case local-only human review execution。
- actual operation receipt。
- actual sanitized review result rows 24件。
- actual rating rows 24件。
- actual question need observation rows 24件。
- actual disposal / purge receipt。
- actual review evidence complete from real review。
- actual PostCR22 EX07〜EX18 re-entry execution。
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

## 22. 書かれていない

```text
- PMN-OP23 green後にP8へ進んでよい、とは書かれていない。
- PMN-OP23 acceptanceをactual human review completeとして扱ってよい、とは書かれていない。
- unit test rowsをactual evidenceへ昇格してよい、とは書かれていない。
- P7中にquestion API / DB / RN UI / trigger / response keyを作ってよい、とは書かれていない。
- P8 material candidate-onlyをP8 start allowedへ読み替えてよい、とは書かれていない。
- body-full packetの本文・path・hash・reviewer notes本文を成果物へ残してよい、とは書かれていない。
- actual evidence completeが成立したらP5/P6/P8/R52/P7/releaseへ自動昇格してよい、とは書かれていない。
```

---

## 23. 推測禁止

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

## 24. 次に実行すべきこと

次に実行すべきことは、実装段階で次を判断することです。

```text
1. 既存PMN helperだけでPost-PMN-OP23 evidence intake entryを構成できるか確認する。
2. 足りない場合だけ、Post-PMN-OP23最小internal helperを追加する。
3. DMH-OP00〜DMH-OP18のtarget testsを作成する。
4. json/schema案を実ファイル化するかは、既存schema配置・既存Guard・既存test結果を見て判断する。
5. body-full packet生成は、明示的allowとlocal-only preflightが揃うまで実行しない。
6. actual human reviewは、人間reviewer・24件・selection-only・purge・no-leakが揃う運用として実行する。
7. 実レビュー由来のbody-free証跡が揃った場合だけ、downstream manual decisionへ渡す。
```

最終判断:

```text
selected_next_stage:
  P7-R54-AHR Post-PMN-OP23 Downstream Manual Decision Hold
  -> Actual Local-only Human Review Operation Evidence Intake Entry

not_selected:
  - P8 question design
  - P8 question implementation
  - P6 limited human readfeel start
  - R52 actual execution
  - P5 finalization
  - P7 complete
  - release decision
  - additional helper-only wrapper as main stage
```
