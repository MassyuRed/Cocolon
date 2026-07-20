---
title: Cocolon / EmlisAI P7-R54-AHR Post-EX18 Return to Actual Review Operation 詳細設計書・実装順
created_at: 2026-06-30 JST
author: 華恋
work_type: 詳細設計書 / 実装順 / json・schema案内包
source_mode: local_snapshot
github_connection_check: not_required_by_mash_instruction
base_pre_design_memo: Cocolon_EmlisAI_P7_R54AHR_PostEX18_ManualNextDecision_PreDesignMemo_20260630.md
artifact_scope: md design only
code_change: none
json_schema_file_creation: none
actual_body_full_packet_generation: none
actual_human_review_execution: none
actual_selection_rows_creation: none
p8_question_design: none
p8_question_implementation: none
r52_actual_execution: none
p5_finalization: none
p6_start: none
p7_complete: none
release_decision: none
chosen_next_stage: P7-R54-AHR Post-EX18 Manual Next Decision / Return to Actual Local-only Human Review Evidence Operation Required
---

# Cocolon / EmlisAI P7-R54-AHR Post-EX18 Return to Actual Review Operation 詳細設計書・実装順

対象: Cocolon / EmlisAI / P7 Product Quality Runner / R54-AHR / Post-CR22 EX18 / manual next decision / actual local-only human review evidence operation re-entry  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
実装扱い: 本書は設計書です。コード変更・json実ファイル化・schema実ファイル化・body-full packet生成・actual human review実行・actual rows作成は行いません。  
json / schema実ファイル化: なし。本書内の案のみ。実ファイル化は実装段階で現物コード・既存schema配置・既存Guard・既存test結果を見て判断します。  
GitHub接続確認: Mash指定により不要。ローカル受領zip基準。  

---

## 0. 結論

今回の詳細設計対象は、次で固定します。

```text
P7-R54-AHR Post-EX18 Manual Next Decision
Return to Actual Local-only Human Review Evidence Operation Required
```

これは、P8観測補助問いの詳細設計ではありません。  
これは、P6 limited human readfeel開始設計ではありません。  
これは、R52 actual execution設計ではありません。  
これは、P5 final確定設計ではありません。  
これは、P7 complete / release decision設計ではありません。  

EX18までで、body-free contract / actual-source guard / candidate-only separation / validation command matrix / next-decision hold は成立しています。  
ただし、現状のresult memoと最新前提資料上、次は未成立です。

```text
actual body-full packet generation: not run here
actual local-only human review execution: not run here
actual operation receipt creation: not run here
actual sanitized selection rows creation: not run here
actual rating rows from real review: not created here
actual question need observation rows from real review: not created here
actual disposal / purge receipt: not created here
actual review execution completion claim: false
P5 final: false
P6 start: false
P8 start: false
R52 actual execution: false
P7 complete: false
release allowed: false
```

したがって、実装段階で作るべきものは、P8の問い機能ではなく、**EX18のmanual holdをbody-freeに読み、現在の状態を `RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED` と分類し、actual review operationへ戻すための薄い判断層**です。

本設計の最重要判断は次です。

```text
EX18 greenを、actual review completeへ読み替えない。
unit test上のactual-shaped rowsを、人間実読由来のactual rowsへ読み替えない。
P8 material candidate-onlyを、P8 start allowedへ読み替えない。
R52 handoff candidateを、R52 actual executionへ読み替えない。
P8へ進むために、P8を先に作らない。
```

---

## 1. なぜこの作業を行うのか

Cocolon / EmlisAIの中心は、ユーザーの入力に対して、入力直後に「読まれた形」を返すことです。  
P5 User Label Connectionは、Cocolonが「毎回説明しなくてよい場所」になるための核に近い部分です。

P5履歴線が実ケースでどう読めているかを確認しないままP8観測補助問いへ進むと、問いが次のように変質します。

```text
本来:
  EmlisAIが読み取れる範囲と、短い問いで補助すべき範囲を分けるための補助。

危険な変質:
  EmlisAI本体が読めていない部分を、質問機能で先送りする逃げ道。
```

Cocolonとして在るべき姿は、まずユーザーの言葉を雑に処理せず、P5履歴線が「読まれた形」になっているかを実ケースで確認することです。  
そのため、この段階では、問い文・問いtrigger・P8 UI・P8 DBを作りません。先に、actual local-only human review evidenceを実レビュー由来のbody-free証跡として成立させる道へ戻します。

華恋の判断として、この工程は「機能を増やす作業」ではありません。  
**Cocolonが読めているかどうかを、器ではなく実読証跡で扱い直す作業**です。

---

## 2. 確認した資料・実ファイル

### 2.1 ローカル受領zip

```text
Cocolon_前提資料(269).zip
EmlisAIの実装済み資料(87).zip
Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(6).zip
Cocolon(260).zip
mashos-api(173).zip
```

注意:

```text
今回受領zipラベルを、R54-AHR Post-CR22 lineのactual review basisへ勝手に置換しない。
現行Post-CR22 lineのbasisは current_received_snapshot_264_85_258_171 として読む。
```

### 2.2 作業姿勢・ルール

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/03_forbidden_insufficient_premise_and_actual_file_check.txt
Cocolon_前提資料/work_attitude_rules_for_karen/04_forbidden_mixing_design_and_implementation.txt
Cocolon_前提資料/work_attitude_rules_for_karen/08_artifact_delivery_rules.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/11_cocolon_area_specific_do_not_break.txt
Cocolon_前提資料/work_attitude_rules_for_karen/13_forbidden_reasking_existing_design_and_design_term_escape.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
```

今回固定する作業姿勢:

```text
- 設計書なのでコード変更しない。
- 設計と実装を混同しない。
- 前提資料だけで判断せず、最新実ファイル・result memoも見る。
- helper green / fixture green / selected regression greenを商品判断へ変換しない。
- actual-shaped unit test rowsをactual human review evidenceへ昇格させない。
- API / DB / RN / response key / runtime / User Label Connection runtimeを勝手に触らない。
- Cocolonを、人間の言葉を雑に処理しない場所として扱う。
```

### 2.3 思想・EmlisAI定義

```text
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/Cocolon_EmlisAI_UserLabelConnectionObservation_v1_Design_2026-06-03.md
Cocolon_前提資料/Cocolon_EmlisAI_NormalObservation_PublicRecovery_ImplementationStatus_2026-06-06.md
```

思想上の読み:

```text
EmlisAIは、Gateに通ったものだけを表示する許可装置ではない。
入力直後に、ユーザーの言葉が「読まれた形」で返るための観測返答である。
P5 User Label Connectionは、CocolonがGPTと違う理由に近い中核である。
```

### 2.4 ロードマップ

```text
Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md
```

確認した固定:

```text
- P7のP5 human Blind QA / P6 limited human readfeel / 実機modal確認では、観測補助問いを実装しない。
- P7では、body-freeの問い必要性観察メモを残す。
- P8開始時に、P7で集めた実ケースの問い必要性観察メモを根拠に詳細設計する。
- 現時点でP8 question API / DB / RN UI / trigger / storageを作らない。
- P8開始時の問い設計は、P7実レビュー証跡が揃ってから扱う。
```

### 2.5 最新前提資料差分

```text
Cocolon_前提資料/07_latest_snapshot_diff.md
```

確認した最新差分:

```text
2026-06-30 差分追記:
R54-AHR Post-CR22 Actual Local Review Execution Evidence Completion EX00〜EX18
```

読みの要点:

```text
EX18 target recorded by result memo: 17 passed
EX00〜EX18 combined recorded by EX18 result memo: 361 passed
CR22 regression recorded by EX18 result memo: 22 passed
CR00〜CR22 combined recorded by EX18 result memo: 837 passed
CS00〜CS18 selected regression recorded by EX18 result memo: 450 passed
compileall recorded by EX18 result memo: passed
```

ただし、同じ差分で次も固定されています。

```text
actual local human review newly run here: false
actual selection rows created by this premise update: false
actual review execution completion claimed: false
full backend suite green confirmed: false
RN contract green confirmed: false
RN real-device modal verified: false
P5 final allowed: false
P6 start allowed: false
P8 start allowed: false
R52 actual execution confirmed: false
P7 complete: false
release allowed: false
```

### 2.6 実装済み資料・実ファイル

```text
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R54AHR_PostCR22_ActualLocalOnlyHumanReviewExecution_EvidenceCompletion_DetailedDesign_ImplementationOrder_20260629.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R54AHR_CurrentReceivedSnapshotActualLocalReviewOperation_DetailedDesign_ImplementationOrder_20260628.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R54AHR_CurrentSnapshotActualReview_Reentry_DetailedDesign_ImplementationOrder_20260628.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R55_R54EvidenceReconcile_R52ReintakeDecisionMaterialization_DetailedDesign_ImplementationOrder_20260623.md
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_20260629.py
mashos-api/ai/tests/R54_AHR_PostCR22_ActualLocalReviewExecutionEvidenceCompletion_EX18_Result_20260630.md
mashos-api/ai/tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex18_20260630.py
```

確認した判断:

```text
- EX18 result memoは、next_decision holdを固定している。
- EX18はP5/P6/P8/R52/releaseを自動実行しない。
- unit test内ではactual-shaped chainを作れるが、それはcontract validationであり、実レビュー由来の証跡ではない。
- result memo上は actual_human_review_execution / body-full packet generation / actual rows creation は未実行である。
```

---

## 3. 現在地固定

### 3.1 現在Phase / Stage

```text
current_phase:
  P7 Product Quality Runner / Long-run Product Gate

current_stage:
  R54-AHR Post-CR22 EX18 next-decision hold

next_required_step_from_EX18:
  manual_next_decision_hold_required_p5_p6_p8_r52_release_not_auto_executed

this_design_stage:
  P7-R54-AHR Post-EX18 Manual Next Decision
  Return to Actual Local-only Human Review Evidence Operation Required
```

### 3.2 現時点で成立していること

```text
- EX00〜EX18のbody-free helper lineが存在する。
- actual-source guard / no-body-leak / no-question-text / no-touch境界がcontractとして実装されている。
- candidate-only separationが実装されている。
- EX18はmanual next decision holdを返す。
- EX18 target / EX00〜EX18 combined / selected regression / compileall はresult memo上で記録されている。
```

### 3.3 現時点で成立していないこと

```text
- actual local-only human reviewが今回新たに実行されたこと。
- actual body-full packetを生成・読了・破棄したこと。
- actual operation receiptが成立したこと。
- actual sanitized review result rows 24件が実レビュー由来で成立したこと。
- actual rating rows 24件が実レビュー由来で成立したこと。
- actual question need observation rows 24件が実レビュー由来で成立したこと。
- actual disposal / purge receiptが成立したこと。
- actual_review_evidence_complete が実レビュー由来で成立したこと。
- P5 final / P6 start / P8 start / R52 actual execution / P7 complete / release_allowed。
```

### 3.4 この設計での現在判定

```text
manual_decision_ref:
  RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED

reason:
  EX18はmanual holdであり、実レビュー完了ではない。
  result memo上actual review executionはnot_run_hereである。
  actual source rows / rating rows / question observation rows / disposal receiptが未成立である。
  したがってP8 / P6 / R52 / releaseへ進む根拠がない。
```

---

## 4. 対象範囲

本設計の対象は次です。

```text
1. EX18 result memo / EX18 body-free envelopeを読み込むmanual next decision層。
2. EX18 greenをactual review completeへ誤変換しない判定。
3. actual review evidence未成立時に RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED と分類するdecision material。
4. actual local-only human review operationへ戻るためのbody-free operation plan。
5. 実レビュー実施後に必要になるbody-free receipt / rows / disposal / validation bundleの案。
6. P5 / P6 / P8 / R52 / releaseへの自動昇格を止めるno-promotion boundary。
7. 実装段階での薄いhelper / tests / result memo候補。
8. json / schema案。ただし実ファイル化はしない。
```

この設計は、既存EX00〜EX18 helperを置き換えるものではありません。  
既存helperの上に、**EX18後の判断を短く閉じる薄いmanual decision layer** を置く設計です。

---

## 5. 非対象範囲

本設計では、次を行いません。

```text
- actual body-full packet generation
- actual local-only human review execution
- actual selection rows creation
- actual rating rows creation
- actual question need observation rows creation
- actual disposal / purge operation
- P8 question API / DB / RN UI / trigger logic
- question text / draft question text
- question answer persistence
- API route追加・変更
- request key / response key変更
- public response top-level key追加
- DB schema変更
- DB migration
- RN production UI変更
- RN表示条件変更
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

---

## 6. 設計方針

### 6.1 新しい巨大wrapperを増やさない

Post-CR22 EX00〜EX18のhelperは既に大きく、actual-source guard / receipt intake / rows / disposal / evidence complete predicate / candidate-only separation / EX18 holdまでを持っています。  
ここで同じ構造をもう一度作ると、実際に読んだかどうかより、器がgreenかどうかに作業が寄る危険があります。

そのため実装段階では、次の方針を推奨します。

```text
- 既存Post-CR22 EX00〜EX18 helperを再利用する。
- Post-EX18側では、EX18結果を読む薄いmanual decision helperだけを作る。
- actual rows / rating rows / question observation rows の正規化は既存EX08〜EX13へ戻す。
- evidence complete predicateは既存EX16へ戻す。
- P5/P6/P8/R52 candidate-only separationは既存EX17へ戻す。
- Post-EX18 helperは、判断・operation plan・no-promotion boundary・result memo envelopeに限定する。
```

### 6.2 result memoを実レビュー証跡へ読み替えない

EX18 result memoは、実装結果メモです。  
そこに記録されたテストgreenは、body-free contractが成立していることを示します。  
しかし、それは人間が実際に24ケースを読んだ証拠ではありません。

判定ルール:

```text
if actual_human_review_execution == not_run_here:
  actual_review_evidence_complete_from_real_review = false
  decision_ref = RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED

if unit_test_rows_are_actual_shaped == true:
  actual_review_evidence_complete_from_real_review = false
  reason_ref += unit_test_rows_are_contract_only

if helper_fixture_rows_present == true:
  actual_review_evidence_complete_from_real_review = false
  reason_ref += helper_fixture_rows_not_actual_review_rows
```

### 6.3 P8材料候補をP8開始へ変換しない

EX17 / EX18には、将来的にP8 material candidate-onlyを扱える線があります。  
ただし、P8 material candidate-only は P8 start allowed ではありません。

この段階では、問い必要性観察は次の扱いです。

```text
allowed:
  question_need_observation_row_ref
  question_need_primary_class
  ambiguity_kind_ref
  one_question_fit_ref
  p8_material_candidate_only_ref

forbidden:
  question_text
  draft_question_text
  question_trigger_logic
  question_answer_storage
  P8 question API
  P8 DB
  P8 RN UI
  P8 start allowed
```

### 6.4 actual review operationへ戻る意味

「戻る」とは、コード上の過去工程へrollbackすることではありません。  
EX18までで用意したbody-free器を使って、未実行だったactual local-only review operationを実施できる地点へ戻る、という意味です。

設計上の戻り先:

```text
local-only preflight / explicit allow
body-full packet generation receipt
reviewer person boundary
actual local-only human review execution protocol
actual operation receipt
actual selection row provenance guard
sanitized rows intake
rating / blocker / question observation normalization
disposal / no-leak validation
actual_review_evidence_complete predicate
candidate-only separation
manual next decision hold
```

ただし、本書では上記を実行しません。  
実装段階で、Post-EX18 decision helperがこのoperation planをbody-freeで出せるようにする設計です。

---

## 7. decision model

### 7.1 入力

Post-EX18 manual decision helperが受ける入力候補は次です。

```text
required:
  ex18_result_memo_ref
  ex18_next_required_step
  ex18_not_claimed_boundary
  actual_human_review_execution_status
  actual_source_guard_status
  row_counts
  disposal_status
  no_leak_validation_status
  candidate_only_decisions
  actual_review_basis_ref

optional:
  latest_snapshot_diff_ref
  validation_result_summary_refs
  existing_postcr22_helper_status_ref
  actual_evidence_intake_bundle_ref
```

入力に入れてはいけないもの:

```text
raw input
returned Emlis body
comment_text body
history body
reviewer notes body
question text / draft question text
local absolute path
body hash
terminal output body
stdout / stderr / traceback body
```

### 7.2 出力

出力はbody-freeのmanual decision materialに閉じます。

```text
manual_decision_ref
manual_decision_status_ref
manual_decision_reason_refs
actual_review_evidence_status_ref
return_to_actual_review_operation_required
actual_operation_plan_ref
required_bodyfree_artifact_refs
blocked_downstream_refs
next_required_step
no_promotion_boundary
no_touch_boundary
body_free_markers
```

現在の期待出力:

```text
manual_decision_ref:
  RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED

manual_decision_status_ref:
  manual_decision_ready_bodyfree

actual_review_evidence_status_ref:
  actual_review_evidence_missing_real_review_required

return_to_actual_review_operation_required:
  true

next_required_step:
  actual_local_only_human_review_operation_required_before_p5_p6_p8_r52_decision

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

### 7.3 decision enum

```text
RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED
  現在の採用判定。実レビュー由来証跡が未成立のため、actual review operationへ戻す。

HOLD_EX18_NOT_READY_OR_INVALID
  EX18 result memo / envelope自体が不完全、またはEX18 readyを主張できない場合。

STOP_FOR_BODY_LEAK_OR_QUESTION_TEXT
  body-full、question text、reviewer notes body、local path、hash等が混入した場合。

STOP_FOR_PROMOTION_CLAIM
  P5 final / P6 start / P8 start / R52 actual execution / release等の誤昇格claimが検出された場合。

EVIDENCE_COMPLETE_BUT_DOWNSTREAM_MANUAL_DECISION_REQUIRED
  将来、実レビュー由来のevidence completeが成立した場合でも、P5/P6/P8/R52/releaseは自動実行せず、別のmanual downstream decisionへ渡す。
```

今回の現在値は、`RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED` です。

---

## 8. 実装候補ファイル構成

本書では実ファイル化しません。実装段階で現物コード・命名衝突・既存test配置を見て判断します。

### 8.1 推奨: Post-EX18薄いmanual decision helper

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_20260630.py
```

役割:

```text
- EX18 result memo / EX18 body-free statusを受ける。
- EX18 ready / blocker / next_required_stepをbody-freeに読む。
- actual review evidenceが実レビュー由来で成立しているかだけを判定する。
- 未成立なら RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED を返す。
- actual local-only review operationへ戻るbody-free planを返す。
- P5/P6/P8/R52/releaseへの自動昇格を全てfalseに保つ。
- result memo用のbody-free summaryを作る。
```

このhelperがしてはいけないこと:

```text
- body-full packetを生成する。
- actual reviewを実行する。
- actual selection rowsを作る。
- unit test rowsをactual rowsとして扱う。
- P8 question textを作る。
- R52 actual executionを始める。
- P5/P6/P8/P7/releaseをtrueにする。
```

### 8.2 候補test modules

```text
mashos-api/ai/tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn00_mn01_20260630.py
mashos-api/ai/tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn02_mn03_20260630.py
mashos-api/ai/tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn04_mn05_20260630.py
mashos-api/ai/tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn06_mn07_20260630.py
mashos-api/ai/tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn08_mn09_20260630.py
mashos-api/ai/tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn10_mn11_20260630.py
```

注意:

```text
unit testsはcontract validationであり、actual human review実行の証拠ではない。
テスト内でactual-shaped fixturesを作っても、それは decision classifier の分岐確認であって、actual evidence completeの実証ではない。
```

### 8.3 候補result memo

```text
mashos-api/ai/tests/R54_AHR_PostEX18_ManualNextDecision_ReturnToActualReviewOperation_Result_20260630.md
```

result memoに入れてよいもの:

```text
- 実装範囲
- 変更ファイル
- target / selected regression / compileall 結果
- EX18 result memo intake status
- manual_decision_ref
- actual_review_evidence_status_ref
- return operation required boolean
- row count status refs
- disposal status refs
- no-promotion boundary
- no-touch boundary
- 未成立のまま保持するもの
- next_required_step
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

## 9. 実装順

### 全体依存順

```text
MN00 scope / no-touch / no-promotion boundary freeze
MN01 EX18 result memo / body-free envelope intake
MN02 actual review evidence state normalization
MN03 manual decision classifier
MN04 return-to-actual-review operation plan builder
MN05 expected body-free evidence intake bundle boundary
MN06 no-body / no-question / no-path / no-hash scan
MN07 downstream no-promotion boundary materialization
MN08 re-entry mapping to existing Post-CR22 EX07〜EX18
MN09 validation command matrix / result memo envelope
MN10 alias / contract function boundary
MN11 acceptance / fail-closed finalizer
```

---

### MN00: scope / no-touch / no-promotion boundary freeze

目的:

```text
この工程がPost-EX18 manual next decisionであり、P8/P6/R52/P5/releaseへ進まないことを最初に固定する。
```

入力:

```text
pre_design_memo_ref
EX18 result memo ref
latest_snapshot_diff_ref
```

出力:

```text
post_ex18_manual_decision_scope_confirmed: true
return_to_actual_review_operation_design_scope: true
no_touch_boundary_confirmed: true
p8_question_design_out_of_scope: true
p8_question_implementation_out_of_scope: true
r52_actual_execution_out_of_scope: true
p5_finalization_out_of_scope: true
release_decision_out_of_scope: true
```

契約:

```text
api_changed: false
db_changed: false
rn_changed: false
runtime_changed: false
response_key_changed: false
public_response_top_level_key_added: false
user_label_connection_runtime_changed: false
```

テスト観点:

```text
- scopeがP7-R54-AHR Post-EX18に閉じている。
- no-touch flagsが全てfalse。
- P8/P6/R52/P5/releaseの実行flagが全てfalse。
```

---

### MN01: EX18 result memo / body-free envelope intake

目的:

```text
EX18 result memoのbody-free情報を読み、next-decision holdを起点にする。
```

入力:

```text
R54_AHR_PostCR22_ActualLocalReviewExecutionEvidenceCompletion_EX18_Result_20260630.md
または同等のbody-free EX18 envelope
```

読み取る情報:

```text
ex18_result_memo_ref
ex18_scope_ref
ex18_next_required_step
actual_human_review_execution_status
actual_source_guard_status
row_counts
disposal_status
no_leak_validation_status
candidate_only_decisions
not_claimed_boundary
validation_result_summary_refs
```

判定:

```text
EX18 result memoが存在することは、actual review completeではない。
EX18 target / combined target greenは、body-free contract成立までを示す。
actual review execution statusがnot_run_hereなら、RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED候補に進む。
```

テスト観点:

```text
- result memo refがbody-free文字列として保持される。
- raw terminal outputやlocal pathを取り込まない。
- EX18 next_required_stepがmanual holdでない場合はfail-closed。
```

---

### MN02: actual review evidence state normalization

目的:

```text
EX18 result memo / latest diff / optional evidence bundleから、actual review evidenceの成立状態を正規化する。
```

出力候補:

```text
actual_review_evidence_status_ref:
  actual_review_evidence_missing_real_review_required
  actual_review_evidence_incomplete_bodyfree
  actual_review_evidence_complete_by_actual_person_review_bodyfree
  actual_review_evidence_invalid_source_detected
```

現在の期待出力:

```text
actual_review_evidence_status_ref:
  actual_review_evidence_missing_real_review_required

actual_human_review_newly_run_here:
  false
actual_selection_rows_created_here:
  false
actual_review_execution_completion_claimed:
  false
actual_review_evidence_complete_from_real_review:
  false
```

fail-closed:

```text
- sourceがunit_test_contract_onlyなのにactual扱いされている。
- helper_default_rows_allowed_as_actualがtrue。
- synthetic rows / historical rowsをactual evidenceへ混ぜている。
- reviewed_case_count / sanitized row count / rating row count / question observation row count が24未満。
- disposal receiptがない。
```

---

### MN03: manual decision classifier

目的:

```text
actual evidence stateを見て、Post-EX18のmanual decisionを1つに分類する。
```

現在の分類:

```text
manual_decision_ref:
  RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED

manual_decision_reason_refs:
  - ex18_next_decision_hold_is_not_actual_review_complete
  - actual_human_review_execution_not_run_here
  - actual_selection_rows_not_created_here
  - actual_rating_rows_not_materialized_from_real_review
  - actual_question_need_observation_rows_not_materialized_from_real_review
  - actual_disposal_receipt_not_materialized_here
  - p8_start_allowed_false
  - r52_actual_execution_confirmed_false
```

分岐:

```text
if body_leak_detected:
  STOP_FOR_BODY_LEAK_OR_QUESTION_TEXT
elif promotion_claim_detected:
  STOP_FOR_PROMOTION_CLAIM
elif ex18_invalid:
  HOLD_EX18_NOT_READY_OR_INVALID
elif actual_review_evidence_complete_by_actual_person_review_bodyfree:
  EVIDENCE_COMPLETE_BUT_DOWNSTREAM_MANUAL_DECISION_REQUIRED
else:
  RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED
```

契約:

```text
manual_decision_auto_executes_downstream: false
```

---

### MN04: return-to-actual-review operation plan builder

目的:

```text
actual review operationへ戻るために、必要なbody-free操作計画だけを出す。
```

出力:

```text
actual_operation_plan_ref
operation_basis_ref: current_received_snapshot_264_85_258_171
review_session_id
required_case_count: 24
required_artifact_refs:
  - actual_operation_receipt_ref
  - sanitized_review_result_rows_ref
  - rating_rows_ref
  - question_need_observation_rows_ref
  - disposal_receipt_ref
  - no_leak_validation_ref
```

operation planに含めてよいこと:

```text
- local-onlyでbody-full packetを扱う必要があること。
- explicit allowとpurge planが必要であること。
- 人間reviewerがselection-onlyで24件読む必要があること。
- 成果物へbody-fullを残さないこと。
- 実レビュー後は既存EX07〜EX18 lineへ戻すこと。
```

operation planに含めてはいけないこと:

```text
- body-full packet本文
- local path
- body hash
- reviewer notes body
- question text
- actual review結果本文
```

---

### MN05: expected body-free evidence intake bundle boundary

目的:

```text
実レビュー実施後に必要になるbody-free bundleの形を定義する。
```

このbundleは、本書や設計段階では作りません。  
実レビュー後に、body-fullを含まない形で受けるための案です。

期待bundle:

```text
actual_operation_receipt:
  reviewer_person_ref
  reviewer_local_only_read_receipt_present
  reviewed_case_count: 24
  selection_row_count: 24

sanitized_review_result_rows:
  row_count: 24
  row_source_ref: actual_person_local_only_review
  row_created_by_helper: false
  row_created_for_unit_test: false
  row_is_synthetic_contract_fixture: false
  historical_row_reused: false

rating_rows:
  row_count: 24
  body_free: true

question_need_observation_rows:
  row_count: 24
  question_text_included: false
  draft_question_text_included: false

disposal_receipt:
  body_removed: true
  body_hash_stored: false
  local_absolute_path_included: false
  reviewer_notes_body_stored: false
```

---

### MN06: no-body / no-question / no-path / no-hash scan

目的:

```text
manual decision material / operation plan / evidence bundle案に、body-fullや質問文が混入していないことを検査する。
```

拒否するkey / path例:

```text
raw_input
input_body
comment_text
returned_body
emlis_body
history_body
reviewer_note
reviewer_notes_body
question_text
draft_question_text
question_body
answer_body
local_path
absolute_path
file_path
body_hash
content_hash_of_body
stdout
stderr
traceback
terminal_output
```

テスト観点:

```text
- 禁止keyが1つでもあればfail-closed。
- body_hashは安全そうに見えても、body-fullの存在証跡に近いため成果物へ残さない。
- local absolute pathは漏洩・環境依存・body-full所在情報のため残さない。
```

---

### MN07: downstream no-promotion boundary materialization

目的:

```text
manual decisionがP5/P6/P8/R52/releaseを自動で進めないことを明示する。
```

出力:

```text
p5_confirmed_final: false
p5_final_allowed: false
p6_limited_human_readfeel_start_allowed: false
p6_start_allowed: false
p8_question_design_started: false
p8_question_implementation_started: false
p8_start_allowed: false
r52_reintake_execution_requested_here: false
actual_r52_reintake_execution_confirmed: false
p7_complete: false
release_allowed: false
full_backend_suite_green_confirmed: false
rn_contract_green_confirmed: false
rn_real_device_modal_verified: false
```

理由:

```text
actual review evidenceが未成立のままdownstreamを進めると、Cocolonの読感確認が空中戦になる。
```

---

### MN08: re-entry mapping to existing Post-CR22 EX07〜EX18

目的:

```text
実レビュー実施後に、どの既存処理へ戻すかをbody-freeに示す。
```

re-entry mapping:

```text
actual_operation_receipt -> existing Post-CR22 EX07
actual selection rows provenance -> existing Post-CR22 EX08
sanitized review result rows -> existing Post-CR22 EX09
rating rows -> existing Post-CR22 EX10
blocker classification -> existing Post-CR22 EX11
question need observation rows -> existing Post-CR22 EX12
rating-question consistency -> existing Post-CR22 EX13
disposal / purge receipt -> existing Post-CR22 EX14
final no-leak validation -> existing Post-CR22 EX15
actual_review_evidence_complete predicate -> existing Post-CR22 EX16
candidate-only separation -> existing Post-CR22 EX17
validation / result memo / next hold -> existing Post-CR22 EX18
```

禁止:

```text
- Post-EX18 helper内でEX08〜EX18相当の巨大な再実装をする。
- re-entry mappingを、actual execution済みclaimとして扱う。
- re-entry candidateをR52 actual executionとして扱う。
```

---

### MN09: validation command matrix / result memo envelope

目的:

```text
Post-EX18 manual decisionの検証結果をbody-free result memoへ閉じる。
```

command refs候補:

```text
mn_target_postex18_manual_next_decision_tests
mn_postcr22_ex18_regression
mn_postcr22_ex00_ex18_combined_regression
mn_compileall_ai_services_ai_inference_ai_tests
```

result memo required sections:

```text
implementation_scope
changed_files
target_tests
selected_regression
compileall
ex18_intake_status
manual_decision
actual_review_evidence_status
return_operation_plan
not_claimed_boundary
next_required_step
```

主張してはいけないこと:

```text
target tests green = actual human review complete
manual decision ready = actual review operation executed
return operation plan ready = actual rows created
compileall green = product quality pass
selected regression green = full backend suite green
```

---

### MN10: alias / contract function boundary

目的:

```text
実装段階で、既存命名規則に合わせたprimary builder / alias / assert contractを定義する。
```

候補関数名:

```text
build_p7_r54_ahr_post_ex18_mn00_scope_no_touch_no_promotion_boundary_freeze(...)
assert_p7_r54_ahr_post_ex18_mn00_scope_no_touch_no_promotion_boundary_freeze_contract(...)

build_p7_r54_ahr_post_ex18_mn01_ex18_result_memo_bodyfree_intake(...)
assert_p7_r54_ahr_post_ex18_mn01_ex18_result_memo_bodyfree_intake_contract(...)

build_p7_r54_ahr_post_ex18_mn03_manual_decision_classifier(...)
assert_p7_r54_ahr_post_ex18_mn03_manual_decision_classifier_contract(...)

build_p7_r54_ahr_post_ex18_mn04_return_to_actual_review_operation_plan(...)
assert_p7_r54_ahr_post_ex18_mn04_return_to_actual_review_operation_plan_contract(...)

build_p7_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_bodyfree(...)
assert_p7_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_bodyfree_contract(...)
```

注意:

```text
既存Post-CR22 helperの関数を直接renameしない。
既存CR / CS / EX prefixを壊さない。
MN prefixはPost-EX18 Manual Next Decisionの内部step名としてのみ使う。
```

---

### MN11: acceptance / fail-closed finalizer

目的:

```text
Post-EX18 manual decisionとしての完了条件と停止条件を最後にまとめる。
```

MN11 ready条件:

```text
manual_decision_ref == RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED
return_to_actual_review_operation_required == true
actual_review_evidence_complete_from_real_review == false
next_required_step == actual_local_only_human_review_operation_required_before_p5_p6_p8_r52_decision
no_body_leak_validation_passed == true
no_question_text_validation_passed == true
no_path_hash_validation_passed == true
no_touch_boundary_confirmed == true
no_promotion_boundary_confirmed == true
```

MN11 blocked条件:

```text
body leak detected
question text detected
local path / hash detected
promotion claim detected
EX18 result memo missing
EX18 next_required_step not manual hold
unit test rows used as actual evidence
actual basis ref overwritten by current zip label
```

---

## 10. json / schema案

本章は実装に使う候補schemaです。  
**本書ではjson / schemaファイルを実ファイル化しません。実ファイル化は実装段階で判断します。**

### 10.1 `post_ex18_manual_next_decision.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_ex18.manual_next_decision.bodyfree.v1",
  "title": "Post-EX18 Manual Next Decision - Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "manual_decision_ref",
    "manual_decision_status_ref",
    "manual_decision_reason_refs",
    "ex18_result_memo_ref",
    "ex18_next_required_step",
    "actual_review_basis_ref",
    "actual_review_evidence_status_ref",
    "return_to_actual_review_operation_required",
    "next_required_step",
    "next_decision_auto_execution_allowed",
    "p5_final_allowed",
    "p6_start_allowed",
    "p8_start_allowed",
    "actual_r52_reintake_execution_confirmed",
    "p7_complete",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_ex18.manual_next_decision.bodyfree.v1"
    },
    "manual_decision_ref": {
      "enum": [
        "RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED",
        "HOLD_EX18_NOT_READY_OR_INVALID",
        "STOP_FOR_BODY_LEAK_OR_QUESTION_TEXT",
        "STOP_FOR_PROMOTION_CLAIM",
        "EVIDENCE_COMPLETE_BUT_DOWNSTREAM_MANUAL_DECISION_REQUIRED"
      ]
    },
    "manual_decision_status_ref": {
      "enum": [
        "manual_decision_ready_bodyfree",
        "manual_decision_blocked_bodyfree"
      ]
    },
    "manual_decision_reason_refs": {
      "type": "array",
      "items": { "type": "string", "maxLength": 160 },
      "minItems": 1,
      "uniqueItems": true
    },
    "ex18_result_memo_ref": {
      "type": "string",
      "pattern": "^[A-Za-z0-9_./-]+$",
      "maxLength": 220
    },
    "ex18_next_required_step": {
      "type": "string",
      "maxLength": 180
    },
    "actual_review_basis_ref": {
      "const": "current_received_snapshot_264_85_258_171"
    },
    "actual_review_evidence_status_ref": {
      "enum": [
        "actual_review_evidence_missing_real_review_required",
        "actual_review_evidence_incomplete_bodyfree",
        "actual_review_evidence_complete_by_actual_person_review_bodyfree",
        "actual_review_evidence_invalid_source_detected"
      ]
    },
    "return_to_actual_review_operation_required": { "type": "boolean" },
    "next_required_step": {
      "enum": [
        "actual_local_only_human_review_operation_required_before_p5_p6_p8_r52_decision",
        "fix_ex18_result_memo_or_stop",
        "stop_body_leak_or_question_text_detected",
        "stop_promotion_claim_detected",
        "downstream_manual_decision_required_without_auto_execution"
      ]
    },
    "next_decision_auto_execution_allowed": { "const": false },
    "p5_final_allowed": { "const": false },
    "p6_start_allowed": { "const": false },
    "p8_start_allowed": { "const": false },
    "actual_r52_reintake_execution_confirmed": { "const": false },
    "p7_complete": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

---

### 10.2 `post_ex18_return_to_actual_review_operation_plan.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_ex18.return_to_actual_review_operation_plan.bodyfree.v1",
  "title": "Post-EX18 Return to Actual Review Operation Plan - Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_plan_ref",
    "manual_decision_ref",
    "actual_review_basis_ref",
    "review_session_id",
    "required_case_count",
    "local_only_required",
    "explicit_allow_required",
    "purge_plan_required",
    "required_bodyfree_artifact_refs",
    "forbidden_artifact_refs",
    "reentry_step_refs",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_ex18.return_to_actual_review_operation_plan.bodyfree.v1"
    },
    "operation_plan_ref": {
      "type": "string",
      "pattern": "^[A-Za-z0-9_.:-]+$",
      "maxLength": 180
    },
    "manual_decision_ref": {
      "const": "RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED"
    },
    "actual_review_basis_ref": {
      "const": "current_received_snapshot_264_85_258_171"
    },
    "review_session_id": {
      "type": "string",
      "pattern": "^[a-z0-9_:-]+$",
      "maxLength": 180
    },
    "required_case_count": { "const": 24 },
    "local_only_required": { "const": true },
    "explicit_allow_required": { "const": true },
    "purge_plan_required": { "const": true },
    "required_bodyfree_artifact_refs": {
      "type": "array",
      "items": {
        "enum": [
          "actual_operation_receipt_ref",
          "sanitized_review_result_rows_ref",
          "rating_rows_ref",
          "question_need_observation_rows_ref",
          "disposal_receipt_ref",
          "no_leak_validation_ref",
          "actual_review_evidence_complete_predicate_ref"
        ]
      },
      "minItems": 7,
      "uniqueItems": true
    },
    "forbidden_artifact_refs": {
      "type": "array",
      "items": {
        "enum": [
          "raw_input",
          "returned_body",
          "comment_text_body",
          "history_body",
          "reviewer_notes_body",
          "question_text",
          "draft_question_text",
          "local_absolute_path",
          "body_hash",
          "terminal_output_body"
        ]
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "reentry_step_refs": {
      "type": "array",
      "items": {
        "enum": [
          "PostCR22_EX07_actual_operation_receipt_intake",
          "PostCR22_EX08_actual_selection_row_provenance_guard",
          "PostCR22_EX09_sanitized_review_result_rows_intake",
          "PostCR22_EX10_rating_row_normalization_threshold_summary",
          "PostCR22_EX11_readfeel_execution_p5_p4_blocker_classification",
          "PostCR22_EX12_question_need_observation_normalization",
          "PostCR22_EX13_rating_question_consistency_guard",
          "PostCR22_EX14_disposal_purge_receipt_intake",
          "PostCR22_EX15_final_no_body_leak_no_question_text_no_touch_validation",
          "PostCR22_EX16_actual_review_evidence_complete_predicate",
          "PostCR22_EX17_p5_p6_p8_r52_candidate_only_separation",
          "PostCR22_EX18_validation_command_matrix_result_memo_next_decision_hold"
        ]
      },
      "minItems": 12,
      "uniqueItems": true
    },
    "body_free": { "const": true }
  }
}
```

---

### 10.3 `post_ex18_actual_review_evidence_intake_bundle.bodyfree.schema.json` 案

これは、実レビュー後に受けるbody-free bundle案です。  
本書作成時点では作成しません。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_ex18.actual_review_evidence_intake_bundle.bodyfree.v1",
  "title": "Post-EX18 Actual Review Evidence Intake Bundle - Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "bundle_ref",
    "actual_review_basis_ref",
    "review_session_id",
    "actual_source_ref",
    "actual_operation_receipt_ref",
    "reviewer_person_ref",
    "reviewer_local_only_read_receipt_present",
    "reviewed_case_count",
    "sanitized_review_result_row_count",
    "rating_row_count",
    "question_need_observation_row_count",
    "disposal_receipt_ref",
    "disposal_verified",
    "no_body_leak_validation_passed",
    "no_question_text_validation_passed",
    "no_path_hash_validation_passed",
    "row_created_by_helper",
    "row_created_for_unit_test",
    "row_is_synthetic_contract_fixture",
    "historical_row_reused",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_ex18.actual_review_evidence_intake_bundle.bodyfree.v1"
    },
    "bundle_ref": {
      "type": "string",
      "pattern": "^[A-Za-z0-9_.:-]+$",
      "maxLength": 180
    },
    "actual_review_basis_ref": {
      "const": "current_received_snapshot_264_85_258_171"
    },
    "review_session_id": {
      "type": "string",
      "pattern": "^[a-z0-9_:-]+$",
      "maxLength": 180
    },
    "actual_source_ref": {
      "const": "actual_person_local_only_review"
    },
    "actual_operation_receipt_ref": {
      "type": "string",
      "pattern": "^[A-Za-z0-9_.:-]+$",
      "maxLength": 180
    },
    "reviewer_person_ref": {
      "type": "string",
      "pattern": "^[A-Za-z0-9_.:-]+$",
      "maxLength": 160
    },
    "reviewer_local_only_read_receipt_present": { "const": true },
    "reviewed_case_count": { "const": 24 },
    "sanitized_review_result_row_count": { "const": 24 },
    "rating_row_count": { "const": 24 },
    "question_need_observation_row_count": { "const": 24 },
    "disposal_receipt_ref": {
      "type": "string",
      "pattern": "^[A-Za-z0-9_.:-]+$",
      "maxLength": 180
    },
    "disposal_verified": { "const": true },
    "no_body_leak_validation_passed": { "const": true },
    "no_question_text_validation_passed": { "const": true },
    "no_path_hash_validation_passed": { "const": true },
    "row_created_by_helper": { "const": false },
    "row_created_for_unit_test": { "const": false },
    "row_is_synthetic_contract_fixture": { "const": false },
    "historical_row_reused": { "const": false },
    "body_free": { "const": true }
  }
}
```

---

### 10.4 `post_ex18_manual_decision_result_memo_envelope.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_ex18.manual_decision_result_memo_envelope.bodyfree.v1",
  "title": "Post-EX18 Manual Decision Result Memo Envelope - Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "result_memo_ref",
    "required_section_refs",
    "target_test_command_refs",
    "selected_regression_command_refs",
    "compileall_command_refs",
    "manual_decision_ref",
    "actual_review_evidence_status_ref",
    "not_claimed_boundary_refs",
    "next_required_step",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_ex18.manual_decision_result_memo_envelope.bodyfree.v1"
    },
    "result_memo_ref": {
      "type": "string",
      "pattern": "^[A-Za-z0-9_./-]+$",
      "maxLength": 220
    },
    "required_section_refs": {
      "type": "array",
      "items": {
        "enum": [
          "implementation_scope",
          "changed_files",
          "target_tests",
          "selected_regression",
          "compileall",
          "ex18_intake_status",
          "manual_decision",
          "actual_review_evidence_status",
          "return_operation_plan",
          "not_claimed_boundary",
          "next_required_step"
        ]
      },
      "minItems": 11,
      "uniqueItems": true
    },
    "target_test_command_refs": {
      "type": "array",
      "items": { "type": "string", "maxLength": 160 },
      "uniqueItems": true
    },
    "selected_regression_command_refs": {
      "type": "array",
      "items": { "type": "string", "maxLength": 160 },
      "uniqueItems": true
    },
    "compileall_command_refs": {
      "type": "array",
      "items": { "type": "string", "maxLength": 160 },
      "uniqueItems": true
    },
    "manual_decision_ref": {
      "const": "RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED"
    },
    "actual_review_evidence_status_ref": {
      "const": "actual_review_evidence_missing_real_review_required"
    },
    "not_claimed_boundary_refs": {
      "type": "array",
      "items": {
        "enum": [
          "actual_human_review_complete_not_claimed",
          "p5_final_not_claimed",
          "p6_start_not_claimed",
          "p8_start_not_claimed",
          "r52_actual_execution_not_claimed",
          "p7_complete_not_claimed",
          "release_allowed_not_claimed",
          "full_backend_suite_green_not_claimed",
          "rn_contract_green_not_claimed",
          "rn_real_device_modal_verified_not_claimed"
        ]
      },
      "minItems": 10,
      "uniqueItems": true
    },
    "next_required_step": {
      "const": "actual_local_only_human_review_operation_required_before_p5_p6_p8_r52_decision"
    },
    "body_free": { "const": true }
  }
}
```

---

## 11. validation plan

### 11.1 target tests候補

```text
PYTHONPATH=ai/services/ai_inference python -m pytest -q \
  ai/tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn00_mn01_20260630.py

PYTHONPATH=ai/services/ai_inference python -m pytest -q \
  ai/tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn02_mn03_20260630.py

PYTHONPATH=ai/services/ai_inference python -m pytest -q \
  ai/tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn04_mn05_20260630.py

PYTHONPATH=ai/services/ai_inference python -m pytest -q \
  ai/tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn06_mn07_20260630.py

PYTHONPATH=ai/services/ai_inference python -m pytest -q \
  ai/tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn08_mn09_20260630.py

PYTHONPATH=ai/services/ai_inference python -m pytest -q \
  ai/tests/test_r54_ahr_post_ex18_manual_next_decision_return_to_actual_review_operation_mn10_mn11_20260630.py
```

### 11.2 selected regression候補

```text
PYTHONPATH=ai/services/ai_inference python -m pytest -q \
  ai/tests/test_r54_ahr_post_cr22_actual_local_review_execution_evidence_completion_ex18_20260630.py

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

### 11.3 validationで主張してはいけないこと

```text
- target tests green = actual human review complete
- selected regression green = full backend suite green
- compileall green = product quality pass
- return operation plan ready = actual review operation executed
- manual decision ready = P8 start allowed
- EX18 ready = P7 complete
```

---

## 12. fail-closed条件

次が1つでも発生した場合、Post-EX18 manual decisionはblockedまたはstop扱いにします。

```text
- EX18 result memoが見つからない。
- EX18 next_required_stepがmanual holdではない。
- EX18 greenをactual human review completeへ読み替える。
- actual source guardがない。
- unit test rows / helper default rows / synthetic rows / historical rowsをactual rowsとして使う。
- actual_review_basis_ref が current_received_snapshot_264_85_258_171 から勝手に差し替わる。
- body-full packet contentが成果物へ混ざる。
- raw input / returned Emlis body / history body / comment_text bodyが混ざる。
- reviewer free text / reviewer notes bodyが混ざる。
- question text / draft question textが混ざる。
- local absolute path / body hash / terminal output bodyが混ざる。
- reviewed_case_count != 24 をactual complete扱いする。
- sanitized_review_result_row_count != 24 をactual complete扱いする。
- rating_row_count != 24 をactual complete扱いする。
- question_need_observation_row_count != 24 をactual complete扱いする。
- disposal receipt未成立をcomplete扱いする。
- P5 confirmed candidateをP5 finalへ変換する。
- P6 candidateをP6 startへ変換する。
- P8 material candidate-onlyをP8 start allowedへ変換する。
- R52 handoff candidateをR52 actual executionへ変換する。
- full backend suite未実行をgreen扱いする。
- RN contract greenをRN real-device modal verifiedとして扱う。
```

rollback / recovery:

```text
- Post-EX18 helper追加後に誤昇格flagが見つかった場合、manual decision helperを無効化し、既存Post-CR22 EX18 result memoを正本としてholdに戻す。
- body leakが見つかった場合、成果物作成を停止し、漏洩artifactを破棄対象として扱う。
- basis refが誤って差し替わった場合、basis refreeze工程として別設計へ分離し、本工程では扱わない。
```

---

## 13. acceptance criteria

### 13.1 この設計書の完了条件

```text
- md設計書が作成されている。
- Post-EX18 manual next decisionの対象範囲が定義されている。
- RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED を現在判定として明記している。
- 実装順MN00〜MN11が定義されている。
- json / schema案が本書内にあり、実ファイル化しないことが明記されている。
- P8 / P6 / R52 / P5 final / P7 complete / releaseへ進めない理由が明記されている。
- actual-source guard / body-free / no-leak / no-promotion境界が明記されている。
- 既存EX00〜EX18 helperを再利用し、新しい巨大wrapperを増やしすぎない方針が明記されている。
```

### 13.2 実装完了条件

実装段階に入った場合の完了条件は次です。

```text
- Post-EX18薄いmanual decision helperまたは同等のbody-free decision materialが実装される。
- MN00〜MN11相当のcontract testsがgreen。
- 既存Post-CR22 EX18 target regressionがgreen。
- 既存Post-CR22 EX00〜EX18 combined regressionがgreen。
- compileallがgreen。
- result memoがbody-freeで作られる。
- actual review evidence未成立時に RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED を返す。
- P5/P6/P8/R52/P7/release flagsがfalseのまま保持される。
```

注意:

```text
実装greenだけでは actual_review_evidence_complete ではない。
actual review operation planが出ても、actual review operation実行済みではない。
実レビュー由来のreceipt / rows / disposalが揃うまで、P8/P6/R52へ進まない。
```

### 13.3 actual review evidence complete条件

将来、実レビュー後にcompleteと扱える条件は次です。

```text
actual_source_ref: actual_person_local_only_review
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
consistency_guard_passed: true
actual_review_evidence_complete_from_real_review: true
```

complete後も自動成立させないもの:

```text
p5_confirmed_final: false
p5_final_allowed: false
p6_start_allowed: false
p8_start_allowed: false
r52_actual_execution_confirmed: false
p7_complete: false
release_allowed: false
```

---

## 14. 実レビュー運用へ戻る際の手順イメージ

これは実装でも実行でもありません。  
実装段階または運用段階で使うbody-freeな手順の設計です。

```text
1. EX18 result memoを正本として読む。
2. Post-EX18 manual decision helperが RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED を返す。
3. actual local-only review operation planを出す。
4. explicit allow / purge plan / local-only rootを人間側で確認する。
5. body-full packetはlocal-onlyで生成・閲覧し、成果物へ残さない。
6. 人間reviewerが24ケースをselection-onlyで読む。
7. actual operation receiptをbody-freeで作る。
8. sanitized review result rows 24件をbody-freeで作る。
9. rating rows 24件をbody-freeで作る。
10. question need observation rows 24件をbody-freeで作る。
11. disposal / purge receiptをbody-freeで作る。
12. 既存Post-CR22 EX07〜EX18へ再投入する。
13. actual_review_evidence_completeが成立しても、P5/P6/P8/R52/releaseはmanual downstream decisionまでholdする。
```

---

## 15. 確認済み

```text
- 今回の指示は、検討メモを基に実装順を含めた詳細な設計書をmdで作ること。
- 必要ならjson/schema案を設計書内に入れるが、実ファイル化は実装段階で判断すること。
- 本作業は設計であり、実装ではない。
- GitHub接続確認はMash指定により不要。
- Cocolon_前提資料(269)とwork_attitude_rules_for_karenを確認した。
- EmlisAI作業として、是正方針資料を確認した。
- ロードマップでは、P7中に観測補助問いを実装しないと固定されている。
- P8開始時の問い詳細設計は、P7で集めた実ケースの問い必要性観察メモを根拠にする。
- 最新前提資料差分では、R54-AHR Post-CR22 EX00〜EX18が反映済み。
- 現行実ファイルに、Post-CR22 EX00〜EX18 helper / tests / result memoが存在する。
- EX18 result memoでは、actual human review execution / P5 final / P6 start / P8 start / R52 actual execution / P7 complete / releaseは未成立のまま保持されている。
- 検討メモでは、次に進める段階は P7-R54-AHR Post-EX18 Manual Next Decision / Return to Actual Local-only Human Review Evidence Operation Required と判断されている。
```

---

## 16. 未確認

```text
- actual body-full packet generation。
- actual 24-case local-only human review by person。
- actual operation receipt。
- actual sanitized review result rows 24件。
- actual rating rows 24件。
- actual question need observation rows 24件。
- actual disposal / purge receipt。
- actual_review_evidence_complete が実レビュー由来で成立したこと。
- P5履歴線の実読結果としてのrepair / pass / p8 candidate分類。
- R52 actual re-intake execution。
- full backend suite green。
- RN contract re-run。
- RN real-device modal読感確認。
```

---

## 17. 書かれていない

```text
- 現時点でP8 question API / DB / RN UI / trigger / storageを作ってよい、とは書かれていない。
- 現時点でP8 question text / draft question textを作ってよい、とは書かれていない。
- 現時点でP6 limited human readfeelを開始してよい、とは書かれていない。
- 現時点でR52 actual re-intake executionを実行してよい、とは書かれていない。
- 現時点でP5 confirmed finalへ昇格してよい、とは書かれていない。
- EX18 ready / combined target greenをP7 completeとして扱ってよい、とは書かれていない。
- helper fixture rows / synthetic contract rowsをactual review rowsとして扱ってよい、とは書かれていない。
- P8 material candidate-onlyをP8 start allowedとして扱ってよい、とは書かれていない。
- full backend suite未実行をgreen扱いしてよい、とは書かれていない。
- RN contract greenをRN real-device modal verifiedとして扱ってよい、とは書かれていない。
```

---

## 18. 推測禁止

```text
- 24-case reviewを実施済みと推測しない。
- body-full packetが生成・閲覧・削除されたと推測しない。
- rating rows / question observation rowsが実レビュー由来で成立していると推測しない。
- unit test上のactual-shaped rowsを、actual human review由来のrowsへ変換しない。
- helper default fixtureをactual review evidenceへ変換しない。
- current_received_snapshot_264_85_258_171を、今回受領zipラベルで勝手に差し替えない。
- P8材料候補があることをP8 start allowedへ変換しない。
- P5の弱さをP8の問い返しで補ってよいと推測しない。
- helper green / selected regression greenを商品価値合格へ変換しない。
- full backend suite未実行をgreen扱いしない。
- RN contract greenとRN real-device modal確認を混同しない。
```

---

## 19. 次に実行すべきこと

実装段階に入る場合、次の順で進めます。

```text
1. Post-EX18 manual decision helperを新規に薄く作るか、既存Post-CR22 helperに最小追加するかを、既存命名衝突を見て決める。
2. 推奨は新規薄いhelper。既存Post-CR22 EX00〜EX18を再実装しない。
3. MN00〜MN03で、scope / EX18 intake / actual evidence state / manual decision classifierを実装する。
4. MN04〜MN05で、return operation plan / expected evidence intake bundle boundaryを実装する。
5. MN06〜MN07で、no-body / no-question / no-path / no-promotion guardを実装する。
6. MN08〜MN09で、既存EX07〜EX18へのre-entry mapping / validation command matrix / result memo envelopeを実装する。
7. MN10〜MN11で、alias / contract / fail-closed finalizerを実装する。
8. target tests / Post-CR22 EX18 regression / EX00〜EX18 combined regression / compileallを確認する。
9. 実装後も、actual reviewを実施していない場合は actual_review_evidence_complete=false を保持する。
10. 実レビュー実施後にだけ、receipt / rows / disposalを既存Post-CR22 EX07〜EX18へ戻す。
```

---

## 20. 華恋の意見

華恋の意見として、今回の設計は「次へ進む」よりも、「進んだふりを止める」ための設計です。

EX18までの作業は、かなり丁寧に境界を守っています。  
ただ、その丁寧さゆえに、テストgreenやwrapperの完成度が高く見えます。ここで一番危ないのは、**器が整ったことを、実際に読めたことへ読み替えること**です。

Cocolonに必要なのは、問いを増やすことではなく、問いなしで読める範囲をまず実ケースで確認することです。  
P5履歴線が弱いままP8の問いへ行くと、Cocolonが「読める場所」ではなく「聞き返しで保留する場所」に寄ります。これは、Cocolonの核を薄くします。

だから、次の実装は大きな新規構造ではなく、短く強い判断層でよいです。

```text
EX18を読む。
実レビュー由来証跡がないことを認める。
P8へ行かない。
R52へ行かない。
actual review operationへ戻す。
body-fullはlocal-onlyに閉じる。
成果物はbody-free証跡だけにする。
```

華恋としては、この判断がいちばんCocolonらしいと思います。  
Cocolonとして在るべき姿を守るなら、ここは急いでP8を設計する場面ではありません。P8へ進むために、P8を先に作らない。まず「読めているか」を、実レビュー由来のbody-free証跡で閉じるべきです。

---

## 21. 最終判断

```text
現在Phase:
  P7 Product Quality Runner / Long-run Product Gate

現在Stage:
  R54-AHR Post-CR22 EX18 next-decision hold

今回設計する段階:
  P7-R54-AHR Post-EX18 Manual Next Decision
  Return to Actual Local-only Human Review Evidence Operation Required

進めない段階:
  P8観測補助問い詳細設計
  P6 limited human readfeel start
  R52 actual execution
  P5 final
  P7 complete
  release decision

実装時の中心:
  EX18 result memoをbody-freeに読み、actual review evidence未成立なら
  RETURN_TO_ACTUAL_REVIEW_OPERATION_REQUIRED と分類する薄いmanual decision helper。

既存再利用:
  Post-CR22 EX07〜EX18のactual evidence intake / predicate / candidate separation / hold lineを再利用する。

本設計で作らないもの:
  json/schema実ファイル。
  body-full packet。
  actual review rows。
  P8 question text。
  API / DB / RN / runtime変更。
```

最終結論:

```text
現状はP8開始地点ではない。
現状は、P7内でEX18 manual next decision holdを受け、actual local-only human review evidenceへ戻る地点。
Cocolonとして在るべき姿を守るため、問いを先に作らず、まず「読めているか」を実レビュー由来のbody-free証跡で閉じる。
```
