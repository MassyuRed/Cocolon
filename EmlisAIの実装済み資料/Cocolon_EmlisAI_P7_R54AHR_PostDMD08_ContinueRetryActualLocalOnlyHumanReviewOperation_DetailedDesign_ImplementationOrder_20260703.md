---
title: "Cocolon / EmlisAI P7-R54-AHR Post-DMD08 Continue/Retry Actual Local-only Human Review Operation 詳細設計書・実装順"
created_at: "2026-07-03 JST"
author: "華恋"
work_mode: "共鳴構造モード"
source_mode: "local_received_zip_only"
github_connection_check: "not_required_by_Mash_instruction"
base_pre_design_memo: "Cocolon_EmlisAI_P7_R54AHR_PostDMD08_ContinueRetryActualLocalOnlyHumanReviewOperation_PreDesignMemo_20260703.md"
artifact_scope: "detailed_design_md_only"
work_type: "詳細設計書 / 実装順 / json・schema案内包"
code_change: "none"
json_schema_file_creation: "none"
api_change: "none"
db_change: "none"
rn_change: "none"
runtime_change: "none"
response_key_change: "none"
actual_body_full_packet_generation: "none"
actual_local_human_review_execution: "none"
actual_rows_creation: "none"
actual_disposal_purge_execution: "none"
postcr22_ex_reentry_execution: "none"
r52_actual_execution: "none"
p5_finalization: "none"
p6_start: "none"
p8_start: "none"
p8_question_design: "none"
p8_question_implementation: "none"
p7_complete: "none"
release_decision: "none"
selected_design_target: "P7-R54-AHR Post-DMD08 Continue/Retry Actual Local-only Human Review Operation before Downstream Decision"
selected_step_prefix: "ALR-OP"
expected_current_dmd_branch: "DMD_BRANCH_EVIDENCE_INCOMPLETE_OR_NOT_CLAIMED_FROM_REAL_OPERATION"
expected_current_dmd_next_required_step: "continue_or_retry_actual_local_only_human_review_operation_before_downstream_decision"
expected_current_alr_action_if_no_external_receipt: "ALR_ACTION_RETRY_OR_START_LOCAL_ONLY_REVIEW_REQUIRED"
---

# Cocolon / EmlisAI P7-R54-AHR Post-DMD08 Continue/Retry Actual Local-only Human Review Operation 詳細設計書・実装順

対象: Cocolon / EmlisAI / P7 Product Quality Runner / R54-AHR / Post-DMD08 / actual local-only human review operation / downstream decision前確認  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
実装扱い: 本書は設計書です。コード変更・json/schema実ファイル作成・body-full packet生成・actual local-only human review実行・actual rows作成・purge実行・PostCR22 re-entry実行・R52実行・P5/P6/P8/P7/release昇格は行いません。  
json / schema実ファイル化: なし。本書内の案のみ。実ファイル化は実装段階で、既存helper・既存schema配置・既存Guard・既存test結果を確認して判断します。  
GitHub接続確認: Mash様指定により不要。ローカル受領zip基準。  

---

## 0. 結論

次に設計する対象は、P8観測補助問いではありません。  
次に設計する対象は、次です。

```text
P7-R54-AHR Post-DMD08
Continue/Retry Actual Local-only Human Review Operation
before Downstream Decision
```

DMD-OP08の現在default branchは次です。

```text
DMD_BRANCH_EVIDENCE_INCOMPLETE_OR_NOT_CLAIMED_FROM_REAL_OPERATION
```

DMD-OP08の現在default next required stepは次です。

```text
continue_or_retry_actual_local_only_human_review_operation_before_downstream_decision
```

したがって、本設計で作るべきものは、新しい質問機能でも、P8の問い仕様でも、R52 actual executionでもありません。  
本設計で作るべきものは、**DMD-OP08後に、actual local-only human review operationへ安全に戻るためのbody-free operation decision / operation plan / evidence intake boundary** です。

本設計で、`continue_or_retry` を曖昧な一語のまま扱いません。実装時には次の4分岐へ分けます。

```text
ALR_ACTION_CONTINUE_EXISTING_LOCAL_ONLY_REVIEW_ALLOWED
  既存のlocal-only review sessionがbody-freeに有効で、継続して不足証跡を揃えられる場合。

ALR_ACTION_RETRY_OR_START_LOCAL_ONLY_REVIEW_REQUIRED
  有効な既存session/receiptがなく、actual local-only review operationを開始または再試行する必要がある場合。

ALR_ACTION_REPAIR_STOP_REQUIRED
  body-free漏れ、invalid source、local path/hash露出、promotion claimなどがあり、operationへ進まず修復停止すべき場合。

ALR_ACTION_COMPLETE_RECEIPT_DOWNSTREAM_MANUAL_DECISION_REQUIRED
  actual operation receiptが実運用由来のbody-free証跡として完了している場合。ただし自動昇格はせず、downstream manual decisionで止める。
```

現在の受領資料・DMD-OP08 result memo・検討メモを基準にした期待現在値は、次です。

```text
expected_current_alr_action_if_no_external_receipt:
  ALR_ACTION_RETRY_OR_START_LOCAL_ONLY_REVIEW_REQUIRED

reason:
  DMD-OP08 target/regression/compileallは閉じている。
  しかし、actual local-only human review execution、actual operation receipt、actual rows、actual disposal/purgeは完了claimされていない。
```

ただし、実装時には外部body-free receiptや有効なpaused session materialが渡される可能性を考慮し、決め打ちではなく4分岐resolverとして実装します。

---

## 1. なぜこの設計を行うのか

Cocolon / EmlisAIの中心は、ユーザー入力へ「もっともらしいAI返答」を返すことではありません。  
ユーザーが残した感情・カテゴリ・行動・思考・時点・過去記録を、入力直後に **読まれた形** として返すことです。

P8の観測補助問いは、将来的に必要になる可能性があります。  
しかし、問いはEmlisAI本体が読むべき部分を肩代わりするものではありません。P7で実ケースを読んだ結果として、問いで補助すべき箇所と、EmlisAI本体で直すべき読感不足を分けるためにあります。

ここでactual local-only human reviewを完了させないままP8質問設計へ進むと、次の事故が起きます。

```text
本来:
  実ケースで読感不足を見つける。
  EmlisAI本体で読むべき不足と、問いで補助すべき不足を分ける。
  P8では観察済み材料から問いを設計する。

事故:
  実レビュー不足を、P8質問仕様で先に埋める。
  読めていないことを、質問で聞けばよいという逃げ道に変える。
  Cocolonが「ユーザーの言葉をまず読む場所」からずれる。
```

そのため、本設計の目的は、問いを作ることではありません。  
**DMD-OP08で止めたbranchを受け、実レビュー由来のbody-free証跡へ戻る道を、continue / retry / repair / complete manual decisionに分けて閉じること** です。

華恋の判断として、この段階は「もう一つhelperを積む作業」に見せてはいけません。  
DMDまでで誤昇格を防ぐ器はできています。次は、その器を使って、actual local-only human reviewへ戻るための実運用入口を曖昧にしない段階です。

---

## 2. 参照資料・確認範囲

### 2.1 受領ローカルzip

```text
/mnt/data/Cocolon_前提資料(278).zip
/mnt/data/EmlisAIの実装済み資料(92).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(11).zip
/mnt/data/Cocolon(265).zip
/mnt/data/mashos-api(178).zip
/mnt/data/Cocolon_EmlisAI_P7_R54AHR_PostDMD08_ContinueRetryActualLocalOnlyHumanReviewOperation_PreDesignMemo_20260703.md
```

注意:

```text
今回もGitHub接続確認は行いません。
Mash様指定に従い、ローカル受領zipと検討メモを基準にします。
```

### 2.2 必読前提・作業姿勢

確認対象:

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/10_cocolon_joint_development_karen_thought_boundary_2026_05_24.md
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
```

本設計で固定する作業姿勢:

```text
- 設計と実装を混ぜない。
- 見ていないactual evidenceを存在するものとして扱わない。
- pytest green / helper greenを商品価値そのものと呼ばない。
- P8質問でEmlisAI本体の読感不足を隠さない。
- API / DB / RN / response key / runtimeを指示なしに変更しない。
- body-full情報を成果物・public meta・review packet外へ漏らさない。
- complete receiptが成立しても、自動昇格せずmanual decisionで止める。
```

### 2.3 ロードマップ固定

確認対象:

```text
Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md
```

固定する読み:

```text
- EmlisAIの最終到達地点は、入力直後に「読まれた形」を返す観測体験である。
- P7は Product Quality Runner / Long-run Product Gate である。
- P7/P8 Bridgeでは、P7途中でP8観測補助問いを実装しない。
- P7中に残すのは、body-freeの問い必要性観察メモである。
- P8の問い詳細設計は、P7で収集した実ケース観察メモを材料にして開始する。
```

### 2.4 現在地判断に直接関係する資料・実ファイル

```text
EmlisAIの実装済み資料/
  Cocolon_EmlisAI_P7_R54AHR_PostDMH18_DownstreamManualDecision_ActualEvidenceStatusTriage_DetailedDesign_ImplementationOrder_20260703.md
  Cocolon_EmlisAI_P7_R54AHR_PostPMN_OP23_DownstreamManualDecisionHold_ActualLocalOnlyHumanReviewOperation_EvidenceIntake_DetailedDesign_ImplementationOrder_20260701.md
  Cocolon_EmlisAI_P7_R54AHR_PostMN11_ActualLocalOnlyHumanReviewOperation_DetailedDesign_ImplementationOrder_20260630.md
  Cocolon_EmlisAI_P7_R54AHR_PostEX18_ReturnToActualReviewOperation_DetailedDesign_ImplementationOrder_20260630.md
  Cocolon_EmlisAI_P7_R54AHR_PostCR22_ActualLocalOnlyHumanReviewExecution_EvidenceCompletion_DetailedDesign_ImplementationOrder_20260629.md

mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_dmh18_downstream_manual_decision_triage_20260703.py
  emlis_ai_p7_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_20260701.py
  emlis_ai_p7_r54_ahr_post_mn11_actual_local_only_human_review_operation_20260630.py
  emlis_ai_p7_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_20260629.py

mashos-api/ai/tests/
  R54_AHR_PostDMH18_DownstreamManualDecision_ActualEvidenceStatusTriage_DMD_OP00_OP08_Result_20260703.md
  test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op00_op01_20260703.py
  test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op02_op03_20260703.py
  test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op04_op05_20260703.py
  test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op06_op07_20260703.py
  test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op08_result_20260703.py
```

### 2.5 検討メモから引き継ぐローカル確認結果

検討メモで確認済みの結果:

```text
DMD-OP00〜OP08 target: 74 passed
selected regression: 158 passed with --assert=plain
compileall: passed
```

本設計では、上記を「DMD helper / result memo / branch resolverが整合している」根拠としてだけ扱います。  
次は主張しません。

```text
- actual local-only human reviewが実行された。
- actual operation receiptが作成された。
- actual rating rows / question need observation rowsが作成された。
- actual disposal / purgeが実行された。
- P5/P6/P8/P7/releaseへ進める。
```

---

## 3. 現在地固定

### 3.1 DMD-OP08で成立していること

DMD-OP08で成立しているもの:

```text
- DMD-OP00〜OP08 helper line
- body-free result memo
- target test summary
- selected regression summary
- compileall summary
- deterministic branch resolver
- manual decision materialization
- not-executed boundary
- unverified boundary
```

DMD-OP08は、result memo / target tests / selected regression / compileallのbody-free summaryを閉じます。  
DMD helper自身はpytestやcompileallを実行せず、外部で実行されたbody-free summaryだけを記録します。

### 3.2 DMD-OP08で成立していないこと

DMD-OP08のnot executed boundaryには、次が含まれています。

```text
body_full_packet_generation
actual_local_human_review_execution
actual_operation_receipt_creation
actual_rows_creation
actual_disposal_purge_execution
postcr22_ex07_ex18_reentry_execution
r52_actual_execution
p5_finalization
p6_start
p8_start
p8_question_design
p8_question_implementation
p7_complete
release_decision
```

そのため、DMD-OP08 greenをactual review completeへ読み替えることは禁止します。

### 3.3 DMD branchの読み取り

現在default branch:

```text
DMD_BRANCH_EVIDENCE_INCOMPLETE_OR_NOT_CLAIMED_FROM_REAL_OPERATION
```

現在default next required step:

```text
continue_or_retry_actual_local_only_human_review_operation_before_downstream_decision
```

読み取り:

```text
- DMDは、実レビュー証跡が完了していない、または実運用由来としてclaimできないと判定している。
- DMDは、P8 / R52 / P5 / P6 / releaseへの進行を許可していない。
- DMDは、actual local-only human review operationへ戻る必要があると示している。
```

### 3.4 本設計の現在地

本設計は、DMD branchを受けた次段です。

```text
DMD-OP08:
  evidence incomplete / not claimed
  -> continue_or_retry actual local-only human review operation

ALR-OP:
  continue / retry / repair stop / complete receipt manual decision を分ける
  -> actual local-only human review operationへ戻るためのbody-free operation planを作る
```

---

## 4. 対象範囲 / 非対象範囲

### 4.1 対象範囲

本設計で対象にするもの:

```text
- DMD-OP08 result memo / branch material intake
- DMD_BRANCH_EVIDENCE_INCOMPLETE_OR_NOT_CLAIMED_FROM_REAL_OPERATION の受け皿
- continue / retry / repair stop / complete receipt manual decision の4分岐resolver
- actual local-only review operationへ戻るためのbody-free operation plan
- 既存operation materialを継続できるかどうかの判定境界
- retry/startが必要な場合のexplicit local-only allow境界
- body-full packet requestのbody-free envelope案
- actual operation receiptのbody-free schema案
- actual rows / question need observation rows / disposal purge receiptのbody-free schema案
- no-body / no-question / no-path / no-hash / no-terminal / no-touch / no-promotion guard
- helper greenをactual review completeへ読み替えないtest境界
- complete receipt branchでもdownstream manual decisionで止める境界
```

### 4.2 非対象範囲

本設計で対象にしないもの:

```text
- P8 question design
- P8 question implementation
- P8 API / DB / RN UI / response key / trigger設計
- API route変更
- DB schema変更
- DB write path変更
- RN production UI変更
- runtime挙動変更
- actual body-full packet生成
- actual local-only human review実行
- actual rows作成
- actual disposal / purge実行
- PostCR22 EX07-EX18 actual re-entry実行
- R52 actual execution
- P5 finalization
- P6 start
- P7 complete
- release decision
```

### 4.3 no-touch contract

本設計・実装時に変更しないもの:

```text
api_route_changed: false
request_key_changed: false
response_key_changed: false
public_response_top_level_key_added: false
db_schema_changed: false
db_write_path_changed: false
rn_production_ui_changed: false
rn_display_condition_changed: false
runtime_changed: false
p8_question_api_created: false
p8_question_db_created: false
p8_question_rn_ui_created: false
p8_question_trigger_logic_created: false
postcr22_ex07_ex18_reentry_executed_here: false
r52_actual_execution_started_here: false
release_allowed: false
```

---

## 5. 用語定義

### 5.1 actual local-only human review operation

人間がlocal-only環境でactualケースを読み、body-full内容を外へ出さず、結果だけをbody-free receipt / rows / counts / refsとして残す運用です。

このoperationに含まれる将来工程:

```text
- explicit local-only allow
- body-full packet generation local-only
- actual 24-case human review
- selection-only review form
- sanitized review result rows
- rating rows
- question need observation rows
- disposal / purge receipt
- no-leak validation
- evidence completion summary
```

ただし、本設計書作成段階では、これらを実行しません。

### 5.2 body-full

raw input / comment_text / returned body / history body / reviewer note body / question text / draft question text / local file content / terminal output body など、ユーザーまたはレビュー対象の本文情報を含むものです。

body-fullはlocal-only review中だけ扱い、成果物・public meta・result memo・schema例・test fixtureへ残しません。

### 5.3 body-free

本文を含まず、状態・件数・分類ID・guard結果・session ID・refsだけで構成する証跡です。

body-freeで許容する例:

```text
review_session_id
operation_step_ref
branch_ref
action_ref
case_count
row_count
rating_axis_refs
sanitized_reason_ids
question_need_primary_class_ref
ambiguity_kind_refs
disposal_purge_receipt_accepted
no_body_leak_validation_passed
no_question_text_validation_passed
no_path_hash_validation_passed
```

body-freeでも禁止するもの:

```text
raw_input
input_body
comment_text_body
reviewer_note_body
question_text
draft_question_text
answer_text
body_full_packet_body
local_path
absolute_path
relative_path
body_hash
sha256
terminal_output_body
stdout
stderr
traceback
```

### 5.4 continue

既存のactual local-only review operation sessionが、次をすべて満たす場合にだけ許可される継続です。

```text
- review_session_idが一貫している。
- operation stateがpaused / in_progress / awaiting_disposalなど、継続可能状態である。
- sessionはactual local-only由来である。
- body-free boundaryを満たす。
- invalid source / helper fixture / synthetic / historical reuse onlyではない。
- forbidden payload keyがない。
- promotion claimがない。
- disposal/purge済みで続行不能になっていない。
```

### 5.5 retry / start

有効な既存sessionがない、または既存materialを実運用由来として引き継げない場合に、actual local-only human review operationを開始または再試行することです。

本設計では、`retry` を「失敗したものを雑にやり直す」という意味では扱いません。  
**既存証跡をactual evidenceとして使えないため、local-only境界を再固定して新しいoperationとして始める必要がある状態** と定義します。

### 5.6 repair stop

body-free漏れ、invalid source、path/hash露出、terminal body混入、promotion claimなどが検出された場合、actual review operationへ進まず修復停止する分岐です。

### 5.7 complete receipt manual decision

actual operation receiptが実運用由来のbody-free証跡として完了している場合の分岐です。  
ただし、この分岐でもP5/P6/P8/R52/P7/releaseへ自動昇格しません。次はdownstream manual decisionです。

---

## 6. decision model

### 6.1 入力

実装時にALR helperが受ける入力候補:

```text
required:
  dmd_op08_bodyfree_result_memo_or_material

optional:
  existing_local_only_review_session_material_bodyfree
  existing_actual_operation_receipt_bodyfree
  existing_bodyfree_evidence_bundle_summary
  existing_disposal_purge_receipt_bodyfree
  operator_explicit_allow_receipt_bodyfree
  validation_summary_bodyfree
```

注意:

```text
- body-full packet本体は入力しない。
- raw input / comment_text / reviewer note / question textは入力しない。
- local path / hash / terminal bodyは入力しない。
- optional receiptにそれらが含まれる場合はrepair stopに落とす。
```

### 6.2 出力

主出力:

```text
alr_decision_material_bodyfree
```

主なフィールド:

```text
schema_version
phase
step
scope
operation_step_ref
source_mode
review_session_id
dmd_branch_ref
dmd_next_required_step_ref
dmd_op08_ready
selected_action_ref
continue_allowed
retry_or_start_required
repair_stop_required
complete_receipt_manual_decision_required
action_reason_refs
action_blocker_refs
operation_plan_ref
operation_plan_required
not_executed_boundary
not_claimed_boundary
no_touch_contract
body_free_markers
next_required_step
```

### 6.3 selected_action_ref

許可値:

```text
ALR_ACTION_CONTINUE_EXISTING_LOCAL_ONLY_REVIEW_ALLOWED
ALR_ACTION_RETRY_OR_START_LOCAL_ONLY_REVIEW_REQUIRED
ALR_ACTION_REPAIR_STOP_REQUIRED
ALR_ACTION_COMPLETE_RECEIPT_DOWNSTREAM_MANUAL_DECISION_REQUIRED
```

### 6.4 next_required_step

分岐ごとのnext_required_step:

```text
ALR_ACTION_CONTINUE_EXISTING_LOCAL_ONLY_REVIEW_ALLOWED:
  continue_existing_actual_local_only_human_review_operation_under_bodyfree_boundary

ALR_ACTION_RETRY_OR_START_LOCAL_ONLY_REVIEW_REQUIRED:
  start_or_retry_actual_local_only_human_review_operation_with_explicit_local_only_allow

ALR_ACTION_REPAIR_STOP_REQUIRED:
  stop_and_repair_bodyfree_evidence_boundary_before_actual_review_operation

ALR_ACTION_COMPLETE_RECEIPT_DOWNSTREAM_MANUAL_DECISION_REQUIRED:
  downstream_manual_decision_required_without_auto_execution
```

### 6.5 resolver priority

resolverは次の優先順位で判定します。

```text
1. repair stop
   body-free漏れ、invalid source、promotion claim、contract invalidがあれば最優先で止める。

2. complete receipt manual decision
   実運用由来のreceipt / rows / disposal / validationが完了している場合。ただし自動昇格しない。

3. continue existing operation
   継続可能なpaused/in-progress sessionがある場合。

4. retry or start
   上記に当てはまらず、DMDがevidence incomplete / not claimedを示す場合。
```

repairをcompleteやcontinueより優先する理由は、body-full漏れやpromotion claimがある状態で証跡完了へ進めると、Cocolonの安全境界が壊れるためです。

---

## 7. operation state machine

### 7.1 state refs

ALRで扱うstate refs:

```text
ALR_STATE_DMD08_INTAKE_REQUIRED
ALR_STATE_DMD08_INTAKE_ACCEPTED_BODYFREE
ALR_STATE_REPAIR_STOP_REQUIRED
ALR_STATE_RETRY_OR_START_REQUIRED
ALR_STATE_EXPLICIT_LOCAL_ONLY_ALLOW_REQUIRED
ALR_STATE_BODYFULL_PACKET_REQUEST_READY_BODYFREE
ALR_STATE_BODYFULL_PACKET_GENERATION_RECEIPT_WAITING
ALR_STATE_REVIEW_EXECUTION_WAITING
ALR_STATE_REVIEW_IN_PROGRESS_BODYFREE_TRACKED
ALR_STATE_REVIEW_PAUSED_CONTINUE_ALLOWED
ALR_STATE_REVIEW_ABORTED_RETRY_REQUIRED
ALR_STATE_OPERATION_RECEIPT_WAITING
ALR_STATE_ROWS_RECEIPT_WAITING
ALR_STATE_DISPOSAL_PURGE_WAITING
ALR_STATE_EVIDENCE_COMPLETE_CANDIDATE
ALR_STATE_DOWNSTREAM_MANUAL_DECISION_REQUIRED
```

### 7.2 allowed transitions

```text
DMD08_INTAKE_REQUIRED
  -> DMD08_INTAKE_ACCEPTED_BODYFREE
  -> REPAIR_STOP_REQUIRED

DMD08_INTAKE_ACCEPTED_BODYFREE
  -> RETRY_OR_START_REQUIRED
  -> REVIEW_PAUSED_CONTINUE_ALLOWED
  -> EVIDENCE_COMPLETE_CANDIDATE
  -> REPAIR_STOP_REQUIRED

RETRY_OR_START_REQUIRED
  -> EXPLICIT_LOCAL_ONLY_ALLOW_REQUIRED
  -> BODYFULL_PACKET_REQUEST_READY_BODYFREE

BODYFULL_PACKET_REQUEST_READY_BODYFREE
  -> BODYFULL_PACKET_GENERATION_RECEIPT_WAITING
  -> REVIEW_EXECUTION_WAITING

REVIEW_EXECUTION_WAITING
  -> REVIEW_IN_PROGRESS_BODYFREE_TRACKED
  -> REVIEW_ABORTED_RETRY_REQUIRED
  -> REPAIR_STOP_REQUIRED

REVIEW_IN_PROGRESS_BODYFREE_TRACKED
  -> REVIEW_PAUSED_CONTINUE_ALLOWED
  -> OPERATION_RECEIPT_WAITING
  -> REVIEW_ABORTED_RETRY_REQUIRED

OPERATION_RECEIPT_WAITING
  -> ROWS_RECEIPT_WAITING
  -> REPAIR_STOP_REQUIRED

ROWS_RECEIPT_WAITING
  -> DISPOSAL_PURGE_WAITING
  -> REPAIR_STOP_REQUIRED

DISPOSAL_PURGE_WAITING
  -> EVIDENCE_COMPLETE_CANDIDATE
  -> REPAIR_STOP_REQUIRED

EVIDENCE_COMPLETE_CANDIDATE
  -> DOWNSTREAM_MANUAL_DECISION_REQUIRED
```

### 7.3 forbidden transitions

```text
DMD08_INTAKE_ACCEPTED_BODYFREE -> P8_START
DMD08_INTAKE_ACCEPTED_BODYFREE -> R52_ACTUAL_EXECUTION
EVIDENCE_COMPLETE_CANDIDATE -> P5_FINAL
EVIDENCE_COMPLETE_CANDIDATE -> P6_START
EVIDENCE_COMPLETE_CANDIDATE -> P8_START
EVIDENCE_COMPLETE_CANDIDATE -> P7_COMPLETE
EVIDENCE_COMPLETE_CANDIDATE -> RELEASE_ALLOWED
REPAIR_STOP_REQUIRED -> ACTUAL_REVIEW_EXECUTION
```

---

## 8. continue / retry / repair / complete の判定境界

### 8.1 continue_allowed

continue_allowedは、次をすべて満たす場合のみtrueです。

```text
existing_local_only_review_session_material_present: true
session_source_kind_ref: actual_local_only_human_review_by_person
session_state_ref in:
  - ALR_STATE_REVIEW_IN_PROGRESS_BODYFREE_TRACKED
  - ALR_STATE_REVIEW_PAUSED_CONTINUE_ALLOWED
  - ALR_STATE_OPERATION_RECEIPT_WAITING
  - ALR_STATE_ROWS_RECEIPT_WAITING
  - ALR_STATE_DISPOSAL_PURGE_WAITING
review_session_id_consistent: true
body_free: true
forbidden_payload_key_paths: []
invalid_source_detected: false
promotion_claim_refs: []
disposal_purge_finalized: false
actual_rows_fixture_only: false
```

continue_allowedがtrueの場合でも、次はfalseのままです。

```text
p5_final_allowed: false
p6_start_allowed: false
p8_start_allowed: false
r52_actual_execution_started_here: false
p7_complete: false
release_allowed: false
```

### 8.2 retry_or_start_required

retry_or_start_requiredは、次のいずれかの場合にtrueです。

```text
- DMD branchが evidence incomplete / not claimed である。
- existing local-only sessionがない。
- existing sessionはあるが継続可能stateではない。
- existing sessionがhelper fixture / synthetic / historical reuse only / unknown sourceである。
- actual operation receiptがmissingまたはincompleteである。
- rows / ratings / question_need / disposal receiptが足りない。
- current materialでは実運用由来claimが成立しない。
```

retry_or_start_requiredで作るのは、**actual operationを実行する許可ではなく、operationへ入るために必要なbody-free plan** です。  
実レビュー実行は別段階です。

### 8.3 repair_stop_required

repair_stop_requiredは、次のいずれかの場合にtrueです。

```text
- raw input / comment_text / reviewer note / question text / returned bodyがbody-free materialへ混入した。
- local path / absolute path / relative path / hash / sha256が成果物・public meta・result memoへ混入した。
- terminal output body / stdout / stderr / traceback bodyが混入した。
- source_kindがinvalidである。
- helper green / target green / result memo greenがactual human review completeとしてclaimされた。
- P8 / R52 / P5 / P6 / P7 / releaseへのpromotion claimがある。
- DMD-OP08 branchとALR decisionが矛盾する。
```

repair_stop_requiredがtrueの場合、nextは必ず次です。

```text
stop_and_repair_bodyfree_evidence_boundary_before_actual_review_operation
```

### 8.4 complete_receipt_manual_decision_required

complete_receipt_manual_decision_requiredは、次をすべて満たす場合だけtrueです。

```text
actual_operation_receipt_present: true
schema_version_valid: true
source_kind_ref: actual_local_only_human_review_by_person
created_from_real_operation: true
actual_source_guard_passed: true
actual_human_review_executed_by_person: true
reviewed_case_count: 24
selection_row_count: 24
sanitized_review_result_row_count: 24
rating_row_count: 24
question_need_observation_row_count: 24
disposal_purge_receipt_accepted: true
no_body_leak_validation_passed: true
no_question_text_validation_passed: true
no_path_hash_validation_passed: true
no_terminal_output_body_validation_passed: true
no_touch_validation_passed: true
body_free: true
forbidden_payload_key_paths: []
promotion_claim_refs: []
```

complete_receipt_manual_decision_requiredがtrueでも、nextは次で固定します。

```text
downstream_manual_decision_required_without_auto_execution
```

---

## 9. body-full packet handling

### 9.1 原則

actual reviewにはbody-full材料が必要です。  
しかし、本設計書・実装helper・result memo・schema例・test fixtureにはbody-full本文を置きません。

```text
body-full packet:
  local-only一時材料
  成果物に残さない
  public metaに残さない
  result memoに残さない
  test fixtureに残さない
  実行後はdisposal / purge receiptで閉じる

body-free receipt:
  review_session_id / count / status / guard / refsのみ
  成果物に残せる
```

### 9.2 body-full packet request boundary

実装時に置くのは、packet本体ではなく、次のbody-free request boundaryです。

```text
packet_request_ref
review_session_id
requested_case_count
packet_generation_allowed_only_after_explicit_local_only_allow
packet_export_allowed: false
raw_body_persistence_allowed: false
reviewer_free_text_allowed: false
question_text_persistence_allowed: false
local_path_persistence_allowed: false
hash_persistence_allowed: false
terminal_body_persistence_allowed: false
```

### 9.3 packet generation receipt boundary

将来実運用でpacket generationを行った場合も、成果物に残すのは次のbody-free receiptだけです。

```text
packet_generation_receipt_ref
review_session_id
requested_case_count
generated_case_count
packet_generation_local_only: true
packet_export_allowed: false
body_full_packet_body_included: false
raw_input_included: false
comment_text_body_included: false
local_path_included: false
body_hash_included: false
terminal_output_body_included: false
```

---

## 10. reviewer form / question need observation

### 10.1 reviewer form principle

reviewer formはselection-onlyです。  
free textで理由を書かせません。理由本文を残すとbody-full境界が壊れやすくなるためです。

許容する形式:

```text
- enum
- bool
- integer score
- sanitized reason id
- blocker id
- axis ref
- count
```

禁止:

```text
- reviewer free text
- raw quote
- question text
- draft question text
- returned answer body
- user input excerpt
```

### 10.2 rating axes

候補rating axes:

```text
read_as_written_score
label_connection_score
history_line_connection_score
current_input_respect_score
non_template_surface_score
safe_display_boundary_score
next_input_motivation_score
```

各score:

```text
0: not_observable_or_failed
1: weak
2: acceptable
3: strong
```

### 10.3 verdict refs

```text
VERDICT_PASS_BODYFREE
VERDICT_PASS_WITH_MINOR_REPAIR_BODYFREE
VERDICT_FAIL_READFEEL_BODYFREE
VERDICT_FAIL_LABEL_CONNECTION_BODYFREE
VERDICT_FAIL_SAFE_DISPLAY_BODYFREE
VERDICT_FAIL_OPERATION_BOUNDARY_BODYFREE
VERDICT_REVIEW_BLOCKED_BODYFREE
```

### 10.4 sanitized reason ids

```text
REASON_ID_READ_AS_WRITTEN_WEAK
REASON_ID_LABEL_CONNECTION_WEAK
REASON_ID_HISTORY_LINE_MISSING
REASON_ID_SURFACE_TEMPLATE_LIKE
REASON_ID_CURRENT_INPUT_UNDERREAD
REASON_ID_SAFE_DISPLAY_BOUNDARY_UNCLEAR
REASON_ID_OUTPUT_TOO_GENERIC
REASON_ID_OUTPUT_TOO_STRONG
REASON_ID_QUESTION_NEEDED_BUT_NOT_AVAILABLE
REASON_ID_QUESTION_SHOULD_NOT_HIDE_CORE_REPAIR
```

### 10.5 question need observation row

P7/P8 Bridgeで残すのは、質問本文ではなく、body-freeな問い必要性観察rowです。

許容する分類:

```text
question_need_primary_class_ref:
  QUESTION_NEED_NONE
  QUESTION_NEED_LOW_CONTEXT_ONLY
  QUESTION_NEED_AMBIGUOUS_TARGET
  QUESTION_NEED_TIME_OR_EVENT_CLARIFICATION
  QUESTION_NEED_RELATION_OR_ACTOR_CLARIFICATION
  QUESTION_NEED_SAFETY_BOUNDARY_CLARIFICATION
  QUESTION_NEED_NOT_QUESTION_BUT_CORE_REPAIR_REQUIRED
```

```text
ambiguity_kind_refs:
  AMBIGUITY_NONE
  AMBIGUITY_WHO
  AMBIGUITY_WHEN
  AMBIGUITY_WHAT_EVENT
  AMBIGUITY_RELATION
  AMBIGUITY_INTENT
  AMBIGUITY_HISTORY_LINK
  AMBIGUITY_SAFETY_SCOPE
```

```text
one_question_fit_ref:
  ONE_QUESTION_NOT_NEEDED
  ONE_QUESTION_COULD_HELP
  ONE_QUESTION_RISKY_OR_TOO_EARLY
  ONE_QUESTION_NOT_ENOUGH_CORE_REPAIR_REQUIRED
```

固定false:

```text
question_text_included: false
draft_question_text_included: false
reviewer_free_text_included: false
raw_input_included: false
comment_text_body_included: false
returned_surface_body_included: false
p8_question_spec_created: false
p8_question_trigger_created: false
```

---

## 11. 実装候補ファイル構成

### 11.1 推奨: Post-DMD08専用の薄いALR helperを追加

既存DMD helperを直接改造し続けるより、Post-DMD08専用の薄いALR helperを追加する方が安全です。

候補:

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_20260703.py
```

理由:

```text
- DMD-OP08はmanual decision triageとして既に閉じている。
- DMD helperにactual operation planning責務を混ぜると、DMD result memoの意味が濁る。
- ALRはDMD branchを受け、actual review operationへ戻るための入口に責務を限定できる。
- API / DB / RN / runtime / response keyに触れずに、body-free helperとtestだけで閉じられる。
```

### 11.2 変更しない候補

```text
mashos-api/ai/services/ai_inference/api_emotion_submit.py
mashos-api/ai/services/ai_inference/emotion_submit_service.py
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
Cocolon/screens/InputScreen.js
Cocolon/screens/input/useInputFeedbackModal.js
Cocolon/screens/input/InputFeedbackReplyModal.js
DB migration files
```

### 11.3 候補test modules

```text
mashos-api/ai/tests/
  test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op00_op01_20260703.py
  test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op02_op03_20260703.py
  test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op04_op05_20260703.py
  test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op06_op07_20260703.py
  test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op08_op09_20260703.py
  test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op10_op11_20260703.py
  test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op12_result_20260703.py
```

### 11.4 候補result memo

```text
mashos-api/ai/tests/
  R54_AHR_PostDMD08_ContinueRetryActualLocalOnlyHumanReviewOperation_ALR_OP00_OP12_Result_20260703.md
```

---

## 12. 実装順

### 全体依存順

```text
ALR-OP00: scope / no-touch / no-promotion re-freeze after DMD-OP08
ALR-OP01: DMD-OP08 result memo / branch intake
ALR-OP02: existing operation material inventory
ALR-OP03: body-free leak / invalid source / promotion scan
ALR-OP04: continue / retry / repair / complete action resolver
ALR-OP05: operation state machine materialization
ALR-OP06: explicit local-only allow requirement boundary
ALR-OP07: body-full packet request body-free envelope
ALR-OP08: actual operation receipt expected schema / completeness guard
ALR-OP09: selection-only rows / rating / question need expected schema guard
ALR-OP10: disposal / purge receipt expected schema guard
ALR-OP11: downstream non-promotion / manual decision hold finalizer
ALR-OP12: result memo / target tests / selected regression closure
```

### ALR-OP00: scope / no-touch / no-promotion re-freeze after DMD-OP08

目的:

```text
Post-DMD08 ALR helperの責務を固定する。
DMD-OP08をactual review completeへ昇格しない。
API / DB / RN / runtime / response key / P8 / R52 / P5 / P6 / P7 / releaseに触れない境界を固定する。
```

実装内容:

```text
- phase / step / scope / policy_kind constantsを定義。
- ALR-OP00 schema_versionを定義。
- no-touch contractを定義。
- not-claimed boundaryを定義。
- forbidden payload key refsを定義。
- selected design targetを定義。
```

acceptance:

```text
- body_free: true
- git_connection_required: false
- git_checked: false
- all no-touch flags false
- p8_start_allowed false
- release_allowed false
- next_required_step: ALR-OP01_DMD_OP08_result_memo_branch_intake
```

### ALR-OP01: DMD-OP08 result memo / branch intake

目的:

```text
DMD-OP08のbranch_ref / next_required_step / not_executed_boundaryをbody-freeに取り込む。
```

実装内容:

```text
- DMD-OP08 material contractをassertする。
- branch_refを取り込む。
- next_required_stepを取り込む。
- DMD not_executed_boundaryにactual review未実行が含まれることを確認する。
- DMD branchがrepairならALR repair stop候補へ送る。
- DMD branchがcomplete manual decisionならALR complete候補へ送る。
- DMD branchがevidence incompleteならALR continue/retry判定へ送る。
```

acceptance:

```text
dmd_op08_intake_status_ref in:
  ALR_DMD08_INTAKE_ACCEPTED_EVIDENCE_INCOMPLETE
  ALR_DMD08_INTAKE_ACCEPTED_REPAIR_REQUIRED
  ALR_DMD08_INTAKE_ACCEPTED_COMPLETE_MANUAL_DECISION
  ALR_DMD08_INTAKE_INVALID_OR_MISSING
```

### ALR-OP02: existing operation material inventory

目的:

```text
既存のactual local-only operation materialを、継続可能なsessionとして使えるか棚卸しする。
```

実装内容:

```text
- existing session material present / missingを判定。
- existing actual operation receipt present / missingを判定。
- source_kindを判定。
- operation_state_refを判定。
- review_session_id consistencyを判定。
- count summaryを判定。
- fixture / helper_green / synthetic / historical_reuse_onlyをinvalid sourceとして扱う。
```

acceptance:

```text
operation_material_inventory_status_ref in:
  ALR_OPERATION_MATERIAL_MISSING
  ALR_OPERATION_MATERIAL_CONTINUABLE_BODYFREE
  ALR_OPERATION_MATERIAL_INCOMPLETE_RETRY_REQUIRED
  ALR_OPERATION_MATERIAL_COMPLETE_CANDIDATE
  ALR_OPERATION_MATERIAL_REPAIR_REQUIRED
```

### ALR-OP03: body-free leak / invalid source / promotion scan

目的:

```text
operationへ進む前に、body-free境界とpromotion境界を検査する。
```

実装内容:

```text
- forbidden payload key pathsをscanする。
- invalid source kindをscanする。
- local path / hash / terminal body混入をscanする。
- P8 / R52 / P5 / P6 / P7 / release claimをscanする。
- helper green / target greenをactual review completeに読ませるclaimをscanする。
```

acceptance:

```text
bodyfree_scan_status_ref in:
  ALR_BODYFREE_SCAN_PASSED
  ALR_BODYFREE_SCAN_REPAIR_REQUIRED

promotion_claim_scan_status_ref in:
  ALR_PROMOTION_SCAN_PASSED
  ALR_PROMOTION_SCAN_REPAIR_REQUIRED
```

### ALR-OP04: continue / retry / repair / complete action resolver

目的:

```text
DMD-OP08のcontinue_or_retryを、ALRの4分岐へ決定論的に分ける。
```

resolver priority:

```text
1. repair_stop_required
2. complete_receipt_manual_decision_required
3. continue_allowed
4. retry_or_start_required
```

実装内容:

```text
- OP01〜OP03のmaterialを受ける。
- selected_action_refを決める。
- exactly one action flagをtrueにする。
- next_required_stepを決める。
- branch reasons / blockersをbody-free refsで残す。
```

acceptance:

```text
selected_action_ref in:
  ALR_ACTION_CONTINUE_EXISTING_LOCAL_ONLY_REVIEW_ALLOWED
  ALR_ACTION_RETRY_OR_START_LOCAL_ONLY_REVIEW_REQUIRED
  ALR_ACTION_REPAIR_STOP_REQUIRED
  ALR_ACTION_COMPLETE_RECEIPT_DOWNSTREAM_MANUAL_DECISION_REQUIRED

exactly_one_action_flag_true: true
```

### ALR-OP05: operation state machine materialization

目的:

```text
selected_action_refを、operation state machine上の次状態へ写像する。
```

実装内容:

```text
- state_refを決める。
- allowed_transition_refsを付与する。
- forbidden_transition_refsを付与する。
- continue/retryの次に必要なmanual operationをbody-freeで示す。
```

acceptance:

```text
operation_state_materialized: true
forbidden_transition_refs include P8_START / R52_ACTUAL_EXECUTION / RELEASE_ALLOWED
```

### ALR-OP06: explicit local-only allow requirement boundary

目的:

```text
actual review operationへ入る前に、明示的local-only許可が必要であることを固定する。
```

実装内容:

```text
- explicit_local_only_allow_required: true
- body_full_packet_generation_allowed_before_allow: false
- actual_human_review_execution_allowed_before_allow: false
- body_full_persistence_allowed: false
- external_export_allowed: false
```

acceptance:

```text
explicit_allow_boundary_closed_bodyfree: true
```

### ALR-OP07: body-full packet request body-free envelope

目的:

```text
body-full packet本体ではなく、packet requestのbody-free envelopeだけを設計・実装する。
```

実装内容:

```text
- packet_request_ref
- requested_case_count
- expected_review_unit_count
- export denylist refs
- forbidden persistence flags
- packet body not included flags
```

acceptance:

```text
body_full_packet_generated_here: false
body_full_packet_body_included: false
packet_request_bodyfree_envelope_ready: true
```

### ALR-OP08: actual operation receipt expected schema / completeness guard

目的:

```text
将来actual review実行後に受け取るbody-free actual operation receiptの期待形を固定する。
```

実装内容:

```text
- expected schema_versionを定義。
- required count fieldsを定義。
- required true guard fieldsを定義。
- operation receiptがcompleteかincompleteかrepairかを判定するguardを実装。
```

acceptance:

```text
actual_operation_receipt_complete_candidate only if:
  reviewed_case_count == 24
  selection_row_count == 24
  sanitized_review_result_row_count == 24
  rating_row_count == 24
  question_need_observation_row_count == 24
  disposal_purge_receipt_accepted == true
  all no-leak guards true
```

### ALR-OP09: selection-only rows / rating / question need expected schema guard

目的:

```text
actual rowsがbody-free selection-onlyとして受け取れるかを検査する。
```

実装内容:

```text
- sanitized review result row schema案を定義。
- rating row schema案を定義。
- question need observation row schema案を定義。
- question text / draft question text / reviewer free text禁止をassertする。
```

acceptance:

```text
row_bodyfree_schema_guard_ready: true
question_text_included: false
reviewer_free_text_included: false
```

### ALR-OP10: disposal / purge receipt expected schema guard

目的:

```text
body-full一時材料が処分・purgeされたことをbody-free receiptで閉じる境界を固定する。
```

実装内容:

```text
- disposal_purge_receipt schema案を定義。
- packet body disposed / local temp disposed / export denied / no retained body flagsを検査。
- local pathやhashをreceiptへ残さない。
```

acceptance:

```text
disposal_purge_receipt_accepted can be true only if:
  body_full_packet_retained: false
  raw_input_retained: false
  reviewer_note_body_retained: false
  question_text_retained: false
  local_path_included: false
  hash_included: false
```

### ALR-OP11: downstream non-promotion / manual decision hold finalizer

目的:

```text
continue / retry / repair / completeのどれでも、P5/P6/P8/R52/P7/releaseへ自動昇格しないことをfinalizerで固定する。
```

実装内容:

```text
- selected_action_refをfinalizerに写像。
- complete receipt branchでも manual decision required に止める。
- p5_final_allowed / p6_start_allowed / p8_start_allowed / release_allowedをfalse固定。
```

acceptance:

```text
manual_decision_auto_executes_downstream: false
p5_final_allowed: false
p6_start_allowed: false
p8_start_allowed: false
r52_actual_execution_started_here: false
p7_complete: false
release_allowed: false
```

### ALR-OP12: result memo / target tests / selected regression closure

目的:

```text
ALR-OP00〜OP12の実装結果をbody-free result memoとして閉じる。
```

実装内容:

```text
- target test summaryをbody-free count/statusで記録。
- selected regression summaryをbody-free count/statusで記録。
- compileall summaryをbody-free count/statusで記録。
- DMD-OP08 branch intake statusを記録。
- selected ALR actionを記録。
- not executed / not claimed / unverified boundaryを記録。
```

acceptance:

```text
result_memo_bodyfree_closed: true
actual_local_human_review_execution: false
actual_rows_creation: false
actual_disposal_purge_execution: false
p8_start: false
release_decision: false
```

---

## 13. json / schema案

以下は設計書内の案です。実ファイル化は実装段階で判断します。

### 13.1 `post_dmd08_alr_decision_material.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_dmd08.alr.decision_material.bodyfree.v1",
  "title": "Post-DMD08 ALR Decision Material Body-Free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "phase",
    "step",
    "scope",
    "operation_step_ref",
    "source_mode",
    "review_session_id",
    "dmd_branch_ref",
    "dmd_next_required_step_ref",
    "selected_action_ref",
    "continue_allowed",
    "retry_or_start_required",
    "repair_stop_required",
    "complete_receipt_manual_decision_required",
    "action_reason_refs",
    "action_blocker_refs",
    "next_required_step",
    "body_free",
    "no_touch_contract",
    "body_free_markers",
    "not_claimed_boundary"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dmd08.alr.decision_material.bodyfree.v1"
    },
    "phase": { "const": "P7" },
    "step": { "type": "string", "maxLength": 180 },
    "scope": { "const": "p7_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation" },
    "operation_step_ref": { "type": "string", "maxLength": 220 },
    "source_mode": { "const": "local_received_zip_only" },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 220 },
    "dmd_branch_ref": {
      "enum": [
        "DMD_BRANCH_EVIDENCE_INCOMPLETE_OR_NOT_CLAIMED_FROM_REAL_OPERATION",
        "DMD_BRANCH_BODYFREE_BOUNDARY_REPAIR_REQUIRED",
        "DMD_BRANCH_EVIDENCE_COMPLETE_MANUAL_DECISION_REQUIRED_NO_AUTO_EXECUTION"
      ]
    },
    "dmd_next_required_step_ref": { "type": "string", "maxLength": 260 },
    "selected_action_ref": {
      "enum": [
        "ALR_ACTION_CONTINUE_EXISTING_LOCAL_ONLY_REVIEW_ALLOWED",
        "ALR_ACTION_RETRY_OR_START_LOCAL_ONLY_REVIEW_REQUIRED",
        "ALR_ACTION_REPAIR_STOP_REQUIRED",
        "ALR_ACTION_COMPLETE_RECEIPT_DOWNSTREAM_MANUAL_DECISION_REQUIRED"
      ]
    },
    "continue_allowed": { "type": "boolean" },
    "retry_or_start_required": { "type": "boolean" },
    "repair_stop_required": { "type": "boolean" },
    "complete_receipt_manual_decision_required": { "type": "boolean" },
    "action_reason_refs": {
      "type": "array",
      "items": { "type": "string", "maxLength": 180 }
    },
    "action_blocker_refs": {
      "type": "array",
      "items": { "type": "string", "maxLength": 180 }
    },
    "next_required_step": { "type": "string", "maxLength": 260 },
    "body_free": { "const": true },
    "no_touch_contract": { "type": "object" },
    "body_free_markers": { "type": "object" },
    "not_claimed_boundary": { "type": "object" }
  }
}
```

### 13.2 現在材料に対する出力例案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.post_dmd08.alr.decision_material.bodyfree.v1",
  "phase": "P7",
  "step": "R54-AHR-PostDMD08_ContinueRetryActualLocalOnlyHumanReviewOperation_20260703",
  "scope": "p7_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation",
  "operation_step_ref": "ALR-OP04_continue_retry_repair_complete_action_resolver",
  "source_mode": "local_received_zip_only",
  "review_session_id": "r54_ahr_postdmd08_alr_session_20260703_current_received_265_92_178_v1",
  "dmd_branch_ref": "DMD_BRANCH_EVIDENCE_INCOMPLETE_OR_NOT_CLAIMED_FROM_REAL_OPERATION",
  "dmd_next_required_step_ref": "continue_or_retry_actual_local_only_human_review_operation_before_downstream_decision",
  "selected_action_ref": "ALR_ACTION_RETRY_OR_START_LOCAL_ONLY_REVIEW_REQUIRED",
  "continue_allowed": false,
  "retry_or_start_required": true,
  "repair_stop_required": false,
  "complete_receipt_manual_decision_required": false,
  "action_reason_refs": [
    "alr_dmd08_evidence_incomplete_or_not_claimed_intake",
    "alr_no_complete_external_actual_operation_receipt_available",
    "alr_actual_review_operation_required_before_downstream_decision"
  ],
  "action_blocker_refs": [
    "alr_actual_operation_receipt_missing_or_incomplete",
    "alr_actual_rows_not_claimed_from_real_operation"
  ],
  "next_required_step": "start_or_retry_actual_local_only_human_review_operation_with_explicit_local_only_allow",
  "body_free": true,
  "no_touch_contract": {
    "api_route_changed": false,
    "db_schema_changed": false,
    "rn_production_ui_changed": false,
    "runtime_changed": false,
    "response_key_changed": false,
    "p8_question_api_created": false
  },
  "body_free_markers": {
    "raw_input_included": false,
    "comment_text_body_included": false,
    "reviewer_note_body_included": false,
    "question_text_included": false,
    "local_path_included": false,
    "body_hash_included": false,
    "terminal_output_body_included": false
  },
  "not_claimed_boundary": {
    "actual_body_full_packet_generation": false,
    "actual_local_human_review_execution": false,
    "actual_rows_creation": false,
    "actual_disposal_purge_execution": false,
    "p8_start": false,
    "release_allowed": false
  }
}
```

### 13.3 `post_dmd08_alr_operation_plan.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_dmd08.alr.operation_plan.bodyfree.v1",
  "title": "Post-DMD08 ALR Operation Plan Body-Free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "plan_ref",
    "selected_action_ref",
    "review_session_id",
    "expected_case_count",
    "explicit_local_only_allow_required",
    "body_full_packet_generation_allowed_before_allow",
    "body_full_packet_export_allowed",
    "reviewer_form_kind_ref",
    "body_free",
    "forbidden_persistence_flags"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dmd08.alr.operation_plan.bodyfree.v1"
    },
    "plan_ref": { "type": "string", "maxLength": 180 },
    "selected_action_ref": { "type": "string", "maxLength": 180 },
    "review_session_id": { "type": "string", "maxLength": 220 },
    "expected_case_count": { "const": 24 },
    "explicit_local_only_allow_required": { "const": true },
    "body_full_packet_generation_allowed_before_allow": { "const": false },
    "body_full_packet_export_allowed": { "const": false },
    "reviewer_form_kind_ref": { "const": "selection_only_bodyfree_result_form" },
    "body_free": { "const": true },
    "forbidden_persistence_flags": {
      "type": "object",
      "additionalProperties": { "const": false }
    }
  }
}
```

### 13.4 `post_dmd08_alr_actual_operation_receipt.bodyfree.schema.json` 案

重要:

```text
DMD-OP02/OP03へ再投入するactual operation evidence receiptは、
DMD helperが期待している schema_version と互換にする。
ALR内部schemaを別に持つ場合でも、DMD-compatible receiptへadapter出力する。
```

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_dmh18.actual_operation_evidence_receipt.bodyfree.optional.v1",
  "title": "DMD-Compatible Actual Operation Evidence Receipt Body-Free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_receipt_ref",
    "review_session_id",
    "source_kind_ref",
    "created_from_real_operation",
    "actual_source_guard_passed",
    "actual_human_review_executed_by_person",
    "reviewed_case_count",
    "selection_row_count",
    "sanitized_review_result_row_count",
    "rating_row_count",
    "question_need_observation_row_count",
    "disposal_purge_receipt_accepted",
    "no_body_leak_validation_passed",
    "no_question_text_validation_passed",
    "no_path_hash_validation_passed",
    "no_terminal_output_body_validation_passed",
    "no_touch_validation_passed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dmh18.actual_operation_evidence_receipt.bodyfree.optional.v1"
    },
    "operation_receipt_ref": { "type": "string", "maxLength": 220 },
    "review_session_id": { "type": "string", "maxLength": 220 },
    "source_kind_ref": { "const": "actual_local_only_human_review_by_person" },
    "created_from_real_operation": { "const": true },
    "actual_source_guard_passed": { "const": true },
    "actual_human_review_executed_by_person": { "const": true },
    "reviewed_case_count": { "const": 24 },
    "selection_row_count": { "const": 24 },
    "sanitized_review_result_row_count": { "const": 24 },
    "rating_row_count": { "const": 24 },
    "question_need_observation_row_count": { "const": 24 },
    "disposal_purge_receipt_accepted": { "const": true },
    "no_body_leak_validation_passed": { "const": true },
    "no_question_text_validation_passed": { "const": true },
    "no_path_hash_validation_passed": { "const": true },
    "no_terminal_output_body_validation_passed": { "const": true },
    "no_touch_validation_passed": { "const": true },
    "body_free": { "const": true }
  }
}
```

### 13.5 `post_dmd08_alr_question_need_observation_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_dmd08.alr.question_need_observation_row.bodyfree.v1",
  "title": "Post-DMD08 ALR Question Need Observation Row Body-Free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "case_ref",
    "question_need_primary_class_ref",
    "ambiguity_kind_refs",
    "one_question_fit_ref",
    "repair_required_refs",
    "question_text_included",
    "draft_question_text_included",
    "reviewer_free_text_included",
    "raw_input_included",
    "comment_text_body_included",
    "returned_surface_body_included",
    "p8_question_spec_created",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dmd08.alr.question_need_observation_row.bodyfree.v1"
    },
    "review_session_id": { "type": "string", "maxLength": 220 },
    "case_ref": { "type": "string", "maxLength": 180 },
    "question_need_primary_class_ref": {
      "enum": [
        "QUESTION_NEED_NONE",
        "QUESTION_NEED_LOW_CONTEXT_ONLY",
        "QUESTION_NEED_AMBIGUOUS_TARGET",
        "QUESTION_NEED_TIME_OR_EVENT_CLARIFICATION",
        "QUESTION_NEED_RELATION_OR_ACTOR_CLARIFICATION",
        "QUESTION_NEED_SAFETY_BOUNDARY_CLARIFICATION",
        "QUESTION_NEED_NOT_QUESTION_BUT_CORE_REPAIR_REQUIRED"
      ]
    },
    "ambiguity_kind_refs": {
      "type": "array",
      "items": { "type": "string", "maxLength": 160 }
    },
    "one_question_fit_ref": {
      "enum": [
        "ONE_QUESTION_NOT_NEEDED",
        "ONE_QUESTION_COULD_HELP",
        "ONE_QUESTION_RISKY_OR_TOO_EARLY",
        "ONE_QUESTION_NOT_ENOUGH_CORE_REPAIR_REQUIRED"
      ]
    },
    "repair_required_refs": {
      "type": "array",
      "items": { "type": "string", "maxLength": 160 }
    },
    "question_text_included": { "const": false },
    "draft_question_text_included": { "const": false },
    "reviewer_free_text_included": { "const": false },
    "raw_input_included": { "const": false },
    "comment_text_body_included": { "const": false },
    "returned_surface_body_included": { "const": false },
    "p8_question_spec_created": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 13.6 `post_dmd08_alr_disposal_purge_receipt.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_dmd08.alr.disposal_purge_receipt.bodyfree.v1",
  "title": "Post-DMD08 ALR Disposal Purge Receipt Body-Free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "disposal_purge_receipt_ref",
    "review_session_id",
    "body_full_packet_retained",
    "raw_input_retained",
    "reviewer_note_body_retained",
    "question_text_retained",
    "local_path_included",
    "hash_included",
    "terminal_output_body_included",
    "disposal_purge_receipt_accepted",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dmd08.alr.disposal_purge_receipt.bodyfree.v1"
    },
    "disposal_purge_receipt_ref": { "type": "string", "maxLength": 220 },
    "review_session_id": { "type": "string", "maxLength": 220 },
    "body_full_packet_retained": { "const": false },
    "raw_input_retained": { "const": false },
    "reviewer_note_body_retained": { "const": false },
    "question_text_retained": { "const": false },
    "local_path_included": { "const": false },
    "hash_included": { "const": false },
    "terminal_output_body_included": { "const": false },
    "disposal_purge_receipt_accepted": { "const": true },
    "body_free": { "const": true }
  }
}
```

---

## 14. test設計

### 14.1 target test group

ALR実装時のtarget候補:

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op00_op01_20260703.py \
  tests/test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op02_op03_20260703.py \
  tests/test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op04_op05_20260703.py \
  tests/test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op06_op07_20260703.py \
  tests/test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op08_op09_20260703.py \
  tests/test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op10_op11_20260703.py \
  tests/test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op12_result_20260703.py
```

### 14.2 必須test case

```text
1. ALR-OP00でAPI / DB / RN / runtime / response keyが変更不可として固定される。
2. DMD-OP08 branchがevidence incompleteの場合、P8 / R52 / P5 / P6 / P7 / releaseへ進まない。
3. DMD-OP08 branchがrepairの場合、ALR_ACTION_REPAIR_STOP_REQUIREDになる。
4. DMD-OP08 branchがcomplete manual decisionの場合、自動昇格せずdownstream manual decisionへ止まる。
5. existing sessionがない場合、ALR_ACTION_RETRY_OR_START_LOCAL_ONLY_REVIEW_REQUIREDになる。
6. 継続可能なpaused/in-progress sessionだけがcontinue_allowedになる。
7. helper green / target green / result memo greenをactual review completeへ昇格しない。
8. raw input / comment_text / reviewer note / question text / local path / hash / terminal body混入でrepair stopになる。
9. actual operation receipt complete判定には24件のcase / selection / sanitized / rating / question_need とpurge receiptが必要。
10. question need observation rowはquestion text / draft question textを保持できない。
11. disposal / purge receiptがない場合はcomplete branchにならない。
12. selected_action_refは常にexactly oneになる。
13. complete branchでもP5/P6/P8/R52/P7/release flagsはfalseのまま。
14. result memoはbody-free summaryだけを記録し、actual review実行をclaimしない。
```

### 14.3 selected regression

ALR実装後のselected regression候補:

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op00_op01_20260703.py \
  tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op02_op03_20260703.py \
  tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op04_op05_20260703.py \
  tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op06_op07_20260703.py \
  tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op08_result_20260703.py
```

```bash
PYTHONPATH=services/ai_inference pytest -q --assert=plain \
  tests/test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op18_20260702.py \
  tests/test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op16_op17_20260702.py \
  tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op22_op23_contract_20260630.py
```

```bash
python3 -m compileall -q services/ai_inference tests
```

### 14.4 今回主張しないtest

本設計およびALR helper target greenだけでは、次を主張しません。

```text
full backend suite green
RN contract green
RN real-device modal verified
actual local-only human review execution complete
actual body-full packet generated and purged
P8 question design allowed
release allowed
```

---

## 15. result memo設計

候補result memo:

```text
R54_AHR_PostDMD08_ContinueRetryActualLocalOnlyHumanReviewOperation_ALR_OP00_OP12_Result_20260703.md
```

必須sections:

```text
1. implementation_scope
2. changed_files
3. dmd_op08_intake_status
4. existing_operation_material_inventory
5. bodyfree_leak_invalid_source_promotion_scan
6. selected_alr_action
7. operation_state_machine_status
8. explicit_local_only_allow_boundary
9. bodyfull_packet_request_boundary
10. expected_actual_operation_receipt_schema_status
11. expected_rows_question_need_disposal_schema_status
12. downstream_non_promotion_status
13. target_tests
14. selected_regression
15. compileall
16. not_claimed_boundary
17. not_executed_boundary
18. unverified_boundary
19. next_required_step
```

not_claimed_boundary:

```text
actual_body_full_packet_generation: false
actual_local_human_review_execution: false
actual_operation_receipt_creation: false
actual_rows_creation: false
actual_disposal_purge_execution: false
postcr22_ex07_ex18_reentry_execution: false
r52_actual_execution: false
p5_finalization: false
p6_start: false
p8_start: false
p8_question_design: false
p8_question_implementation: false
p7_complete: false
release_decision: false
```

unverified_boundary:

```text
full_backend_suite_green: false
rn_contract_green: false
rn_real_device_modal_verified: false
```

---

## 16. validationで主張してはいけないこと

ALR targetがgreenになっても、次は言えません。

```text
- actual local-only human reviewが実行された。
- actual body-full packetが生成された。
- actual body-full packetがpurgeされた。
- actual rating rowsが実レビュー由来で作成された。
- actual question need observation rowsが実レビュー由来で作成された。
- P8質問仕様を作ってよい。
- P8を開始してよい。
- R52 actual executionへ進んでよい。
- P5 final / P6 start / P7 complete / releaseへ進んでよい。
```

ALR target greenで言えることは、次だけです。

```text
DMD-OP08のbranchを受けて、actual local-only review operationへ戻るためのbody-free decision / plan / expected evidence boundaryが閉じた。
```

---

## 17. acceptance criteria

### 17.1 この設計書の完了条件

```text
- DMD-OP08のcurrent branch / next_required_stepを引き継いでいる。
- P8 / R52 / P5 / P6 / P7 / releaseへ進まないことを明示している。
- continue / retry / repair / complete manual decisionの境界を分けている。
- 実装順がALR-OP00〜OP12で整理されている。
- json / schema案が設計書内にあり、実ファイル化していない。
- actual body-full packet生成 / actual review実行 / actual rows作成 / purge実行を行っていない。
```

### 17.2 実装完了条件

将来実装段階での完了条件:

```text
- ALR helperが追加され、既存DMD helperと責務分離できている。
- ALR-OP00〜OP12 target testsがgreenである。
- DMD-OP00〜OP08 regressionがgreenである。
- selected PMN/DMH regressionがgreenである。
- compileallがpassしている。
- result memoがbody-freeで閉じている。
- no-touch / no-promotion / not-claimed boundaryが維持されている。
```

### 17.3 actual review operation complete条件

将来actual review operationを実行した後にだけ成立し得る条件:

```text
- human reviewerがactual local-onlyで24ケースを読んだ。
- actual operation receiptがbody-freeで存在する。
- sanitized review result rowsが24件ある。
- rating rowsが24件ある。
- question need observation rowsが24件ある。
- disposal / purge receiptがacceptedである。
- no-body / no-question / no-path / no-hash / no-terminal / no-touch validationがpassしている。
- helper fixture / synthetic / historical reuseではない。
```

### 17.4 complete後も未成立のまま保持するもの

```text
p5_final_allowed: false
p6_start_allowed: false
p8_start_allowed: false
p8_question_design_started: false
p8_question_implementation_started: false
r52_actual_execution_started_here: false
p7_complete: false
release_allowed: false
```

---

## 18. fail-closed条件

次のどれかが起きたら、ALRはrepair stopに落とします。

```text
- DMD-OP08 materialがmissingまたはcontract invalid。
- DMD branchとALR selected_action_refが矛盾している。
- raw input / comment_text / reviewer note / question text / answer text混入。
- local path / hash / terminal output body混入。
- forbidden payload key pathsが空でない。
- invalid source kindが検出された。
- helper green / target greenをactual review completeへ昇格するclaimがある。
- P8 / R52 / P5 / P6 / P7 / release promotion claimがある。
- actual operation receiptのcountだけが揃っていて、disposal/purgeやno-leak guardが欠けている。
- question need observation rowにquestion text / draft question textが含まれる。
```

---

## 19. 実装時のファイル差分想定

### 19.1 新規候補

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_20260703.py

mashos-api/ai/tests/
  test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op00_op01_20260703.py
  test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op02_op03_20260703.py
  test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op04_op05_20260703.py
  test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op06_op07_20260703.py
  test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op08_op09_20260703.py
  test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op10_op11_20260703.py
  test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op12_result_20260703.py
  R54_AHR_PostDMD08_ContinueRetryActualLocalOnlyHumanReviewOperation_ALR_OP00_OP12_Result_20260703.md
```

### 19.2 原則変更しない

```text
api_emotion_submit.py
emotion_submit_service.py
emlis_ai_reply_service.py
DB migration
RN production UI
P8 question関連のAPI / DB / UI / trigger
```

---

## 20. 華恋の意見

華恋の意見として、次の実装では `continue_or_retry` を一語のまま受けない方がよいです。  
ここを曖昧にすると、Cocolonはまた「安全なhelperを積んだが、実レビューへ届かない」状態になります。

今回の核は、次です。

```text
P8へ行かない。
R52へ行かない。
P5 finalへ行かない。
でも、actual local-only human reviewへ戻る道は曖昧にしない。
```

現在の材料を見る限り、完了receiptが存在する前提にはできません。  
だから、実装時の現在default actionは `retry_or_start_required` として扱うのが自然です。  
ただし、実装helperは将来body-free receiptが渡された場合にも壊れないよう、continue / complete / repairの分岐を持つべきです。

問い必要性観察は大事です。  
でも、問い本文を先に作ることはまだ違います。Cocolonとして大事なのは、質問で補う前に、まずユーザーの言葉をどこまで読めているかを実ケースで見ることです。

華恋は、このALR設計で「止めるための安全」から「実レビューへ戻るための安全」へ進めるのが、いま一番よいと思います。

---

## 21. 確認済み

```text
- Cocolon_前提資料と作業姿勢ルールを確認した。
- EmlisAI是正方針を確認した。
- P7/P8 Bridgeロードマップを確認した。
- Post-DMD08検討メモを確認した。
- DMD-OP08のcurrent default branchは DMD_BRANCH_EVIDENCE_INCOMPLETE_OR_NOT_CLAIMED_FROM_REAL_OPERATION。
- DMD-OP08のdefault next_required_stepは continue_or_retry_actual_local_only_human_review_operation_before_downstream_decision。
- 検討メモ上、DMD-OP00〜OP08 target: 74 passed。
- 検討メモ上、selected regression: 158 passed with --assert=plain。
- 検討メモ上、compileall: passed。
- DMD-OP08はactual local-only human review実行をclaimしていない。
- 本設計ではALR-OP00〜OP12を実装順として採用する。
```

---

## 22. 未確認

```text
- full backend suite green。
- RN contract green。
- RN real-device modal verified。
- actual body-full packet generation。
- actual local-only human review execution。
- actual operation receipt creation。
- actual rating rows creation。
- actual question need observation rows creation。
- actual disposal / purge execution。
- PostCR22 EX07-EX18 actual re-entry。
- R52 actual execution。
- P5 finalization。
- P6 start。
- P8 start。
- P7 complete。
- release decision。
```

---

## 23. 書かれていない

```text
- DMD target greenならP8へ進んでよい、とは書かれていない。
- helper greenをactual human review completeとして扱ってよい、とは書かれていない。
- question need observation memoをP8質問仕様そのものとして扱ってよい、とは書かれていない。
- P7中にP8 question API / DB / RN UI / response keyを実装してよい、とは書かれていない。
- complete receipt branchでもP5/P6/P8/R52/P7/releaseへ自動昇格してよい、とは書かれていない。
```

---

## 24. 推測禁止

```text
- OP08 result memoがあるからactual reviewも完了した、と推測しない。
- DMD branchが閉じたからP8へ進める、と推測しない。
- body-free summaryがあるからbody-full packetが安全に生成・破棄された、と推測しない。
- existing helper fixture rowsをactual review rowsとして扱わない。
- question need observationを質問本文やP8仕様へ変換しない。
- テストが通ったことを商品読感の合格として扱わない。
```

---

## 25. 次に実行すべきこと

```text
1. 実装段階へ進む場合は、ALR-OP00〜OP12の薄いhelperとtarget testsを追加する。
2. json / schema案は、実装段階で既存helper・既存schema配置・既存Guardを見て、実ファイル化するか判断する。
3. 実装しても、actual body-full packet生成・actual review実行・actual rows作成・purge実行は別指示まで行わない。
4. ALR result memoでは、selected_action_refをbody-freeで記録し、not-claimed boundaryを崩さない。
5. ALRがretry/start requiredを返した後、Mash様の明示指示がある場合にだけ、actual local-only human review operation実行段階へ進む。
```

---

## 26. 最終判断

本設計の段階名は、次で固定します。

```text
P7-R54-AHR Post-DMD08
Continue/Retry Actual Local-only Human Review Operation
before Downstream Decision
```

実装prefixは次で設計します。

```text
ALR-OP
```

本設計の中心は、DMD-OP08の `continue_or_retry` を4分岐へ分け、actual local-only human review operationへ戻るためのbody-free decision / plan / evidence boundaryを閉じることです。

現在材料に対する期待actionは、次です。

```text
ALR_ACTION_RETRY_OR_START_LOCAL_ONLY_REVIEW_REQUIRED
```

ただし、実装は決め打ちではなく、continue / retry / repair / complete manual decisionの全分岐を持たせます。  
これにより、CocolonはP8質問で読感不足を隠す方向へ行かず、まず実ケースを人間が読む証跡へ戻れます。
