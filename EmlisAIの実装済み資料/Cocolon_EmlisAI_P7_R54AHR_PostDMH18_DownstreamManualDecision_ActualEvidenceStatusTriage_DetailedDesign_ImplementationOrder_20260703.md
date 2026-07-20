---
title: "Cocolon / EmlisAI P7-R54-AHR Post-DMH-OP18 Downstream Manual Decision / Actual Evidence Status Triage 詳細設計書・実装順"
created_at: "2026-07-03 JST"
author: "華恋"
work_mode: "共鳴構造モード"
source_mode: "local_received_zip_only"
github_connection_check: "not_required_by_Mash_instruction"
base_pre_design_memo: "Cocolon_EmlisAI_P7_R54AHR_PostDMH18_DownstreamManualDecision_PreDesignMemo_20260703.md"
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
selected_design_target: "P7-R54-AHR Post-DMH-OP18 Downstream Manual Decision / Actual Evidence Status Triage"
expected_current_branch_if_implemented_against_current_materials: "evidence_incomplete_or_not_claimed_from_real_operation"
---

# Cocolon / EmlisAI P7-R54-AHR Post-DMH-OP18 Downstream Manual Decision / Actual Evidence Status Triage 詳細設計書・実装順

対象: Cocolon / EmlisAI / P7 Product Quality Runner / R54-AHR / Post-PMN23 DMH-OP18後 / downstream manual decision / actual evidence status triage  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
実装扱い: 本書は設計書です。コード変更・json/schema実ファイル作成・body-full packet生成・actual local-only human review実行・actual rows作成・purge実行・PostCR22 re-entry実行・R52実行・P5/P6/P8/P7/release昇格は行いません。  
json / schema実ファイル化: なし。本書内の案のみ。実ファイル化は実装段階で、既存helper・既存schema配置・既存Guard・既存test結果を確認して判断します。  
GitHub接続確認: Mash指定により不要。ローカル受領zip基準。  

---

## 0. 結論

次に設計する対象は、P8ではありません。  
次に設計する対象は、次です。

```text
P7-R54-AHR Post-DMH-OP18
-> Downstream Manual Decision / Actual Evidence Status Triage
```

DMH-OP18で閉じたものは、**body-free result memo / downstream manual decision hold finalizer** です。  
DMH-OP18は、PostCR22 EX07-EX18 re-entry、R52 actual execution、P5 final、P6 start、P8 start、P7 complete、releaseを実行していません。

したがって、本設計で作るべきものは、新機能ではありません。  
本設計で作るべきものは、**OP18後に、実レビュー証跡が本当に実運用由来として完了しているのか、未完了なのか、修復停止すべきなのかを、body-freeで三分岐固定する小さなmanual decision層**です。

実装時の想定分岐は次です。

```text
branch_A:
  evidence_incomplete_or_not_claimed_from_real_operation
  next_required_step:
    continue_or_retry_actual_local_only_human_review_operation_before_downstream_decision

branch_B:
  leak_invalid_source_or_promotion_claim_detected
  next_required_step:
    stop_and_repair_bodyfree_evidence_boundary

branch_C:
  evidence_complete_from_real_review_and_no_leak_no_touch_no_promotion
  next_required_step:
    downstream_manual_decision_required_without_auto_execution
```

ただし、現在受領している資料・実ファイル・result memoを基準にすると、実装した場合の現在地は **branch_A** です。  
理由は、OP18 ready-path / helper green / target greenは存在しますが、actual body-full packet生成、actual local-only human review実行、actual operation receipt新規作成、actual rows作成、actual disposal / purge実行、actual review evidence complete from real operation claimは成立していないためです。

華恋の判断として、ここでP8へ進むのは早いです。  
問い機能を先に設計すると、EmlisAI本体が読むべき箇所を「質問で補う」方向へ逃がす危険があります。  
Cocolonとして守るべき順序は、まずユーザーの言葉が実ケースで読めているかを、body-fullを漏らさず、人間レビュー由来の証跡として確認することです。

---

## 1. なぜこの設計を行うのか

Cocolon / EmlisAIの中心は、ユーザー入力をただ保存したり、AIらしい文章を返したりすることではありません。  
ユーザーが置いた感情・カテゴリ・行動・思考・時点・過去記録の線を、入力直後に「読まれた形」として返すことです。

P7/P8 Bridgeで観測補助問いの必要性を見る理由は、P8質問機能を先に作るためではありません。  
むしろ、次を切り分けるためです。

```text
- EmlisAI本体が問いなしで読むべきケース
- 1問があれば補完リスクを下げられるケース
- 問いではなく、EmlisAI本体の読感・観測力を直すべきケース
```

ここを飛ばすと、Cocolonが「人間の言葉を雑に処理しない場所」ではなく、「読めなかったら質問へ逃がす場所」になります。  
そのため、OP18後に必要なのはP8設計ではなく、実レビュー証跡の状態を慎重に分けるmanual decisionです。

このmanual decisionは、開発を遅らせるための工程ではありません。  
helper greenと実レビュー完了を混同して、P8 / P5 / P6 / R52 / releaseへ誤昇格する事故を防ぐための工程です。

---

## 2. 参照資料・確認範囲

### 2.1 受領ローカル資料

```text
/mnt/data/Cocolon_前提資料(276).zip
/mnt/data/EmlisAIの実装済み資料(91).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(10).zip
/mnt/data/Cocolon(264).zip
/mnt/data/mashos-api(177).zip
/mnt/data/Cocolon_EmlisAI_P7_R54AHR_PostDMH18_DownstreamManualDecision_PreDesignMemo_20260703(1).md
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
```

本設計で守る作業姿勢は次です。

```text
- 設計と実装を混ぜない。
- 前提資料だけで理解した風にしない。実ファイル・result memo・testも確認する。
- helper green / pytest greenをactual human review completeへ読み替えない。
- 見ていないactual evidenceを存在するものとして扱わない。
- 指示されていないAPI / DB / RN / response key / runtime / P8機能を追加しない。
- Mash様が確認しにくい場所ほど、body-free / no-touch / no-promotionを厳格にする。
```

### 2.3 EmlisAI前提

```text
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md
```

固定する読み方:

```text
- Cocolonは文字列処理サービスではない。
- EmlisAIは、入力直後の観測返答として「読まれた形」を返す出口である。
- EmlisAIを、passed + comment_textに到達したものだけ表示する許可装置へ戻さない。
- P8の問いは、EmlisAI本体の読感不足を隠す逃げ道にしない。
- 低情報入力でも、わかったふりをしないが、無応答に潰さない。
- テンプレ共感、診断ラベル、人格断定、原因決め打ち、例文特化surfaceへ寄せない。
```

### 2.4 現在地判断に直接関係する資料・実ファイル

```text
EmlisAIの実装済み資料/
  Cocolon_EmlisAI_P7_R54AHR_PostPMN_OP23_DownstreamManualDecisionHold_ActualLocalOnlyHumanReviewOperation_EvidenceIntake_DetailedDesign_ImplementationOrder_20260701.md

Cocolon_前提資料/
  r54dmh_diff_20260702.csv

mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_20260701.py

mashos-api/ai/tests/
  R54_AHR_PostPMN23_DownstreamManualDecisionHold_EvidenceIntake_DMH_OP18_Result_20260702.md
  test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op18_20260702.py
  test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op16_op17_20260702.py
  test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op22_op23_contract_20260630.py
```

### 2.5 設計作成前の最小再確認

今回、設計作成前に、対象に直接関係する範囲だけローカルで再確認しました。

```bash
cd /mnt/data/work_cocolon/mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op18_20260702.py
```

結果:

```text
42 passed in 11.06s
```

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op16_op17_20260702.py
```

結果:

```text
79 passed in 16.86s
```

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op22_op23_contract_20260630.py
```

結果:

```text
37 passed in 16.24s
```

```bash
python3 -m compileall -q services/ai_inference tests
```

結果:

```text
compileall passed
```

注意:

```text
この確認は、helper / contract / result memo周辺の確認である。
actual local-only human review execution、actual body-full packet generation、actual operation receipt作成、RN contract、RN実機modal、full backend suite greenを確認したものではない。
```

---

## 3. 現在地固定

### 3.1 ロードマップ上の現在地

ロードマップ上の現在地はP7です。  
P7/P8 Bridgeでは、P7中に観測補助問いを実装しないこと、P8開始時に実ケースの問い必要性観察メモを詳細設計材料にすることが固定されています。

P8で決める対象は、次です。

```text
- 観測補助問いの発生判定ロジック
- API / DB / RN UI / response contractへの影響有無
- 「わからない」「このまま観測する」の扱い
- 問い回答を元入力とどう紐づけるか
- User Label Connection / Derived User Model / User Fact Grounding Boundaryとの接続位置
- Public Meta Boundaryで漏らしてはいけない値
- Free / Plus / Premiumのplan guard
- backend unit / e2e / RN contract test計画
```

しかし、これはP8開始が許可された後の話です。  
現時点ではP8 start allowedはfalseであり、P8 question design / implementationは開始しません。

### 3.2 OP18までで成立しているもの

OP18までで成立しているものは次です。

```text
- DMH-OP00〜OP18のbody-free helper / target test / result memo lineがある。
- DMH-OP18 result memo / downstream manual decision hold finalizerがある。
- OP18 targetはgreen。
- OP16/OP17 targetはgreen。
- PMN-OP22/OP23 selected regressionはgreen。
- compileallは通る。
- OP18 ready-pathでは downstream_manual_decision_required_without_auto_execution が出せる。
- OP18 blocked pathでは continue_or_retry_actual_local_only_human_review_operation_before_downstream_decision が出せる。
- OP18 repair pathでは stop_and_repair_bodyfree_evidence_boundary が出せる。
```

### 3.3 OP18までで成立していないもの

OP18までで成立していないものは次です。

```text
- body-full packet生成。
- actual local-only human review実行。
- actual operation receipt新規作成。
- actual sanitized review result rows新規作成。
- actual rating rows新規作成。
- actual question need observation rows実運用作成。
- actual disposal / purge実行。
- actual review evidence complete from real operation claim。
- PostCR22 EX07-EX18 actual re-entry実行。
- R52 actual execution。
- P5 finalization。
- P6 start。
- P8 start。
- P8質問設計。
- P8質問実装。
- P7 complete。
- release decision。
- full backend suite green確認。
- RN contract green確認。
- RN実機modal確認。
```

### 3.4 OP18 ready-pathの読み替え禁止

OP18 result memoには、ready-path上で次のような値が出ます。

```text
actual_review_evidence_complete_from_real_review: true
actual_review_evidence_complete_from_real_operation_claimed_here: false
next_required_step: downstream_manual_decision_required_without_auto_execution
```

このうち、`actual_review_evidence_complete_from_real_review: true` は、helper / fixture / body-free candidate line上のready-pathとして扱います。  
これを、そのまま「実運用でactual review evidenceが完了した」と読み替えてはいけません。

本設計では、次を分離します。

```text
candidate_supported:
  OP16/OP17/OP18のready-pathやhelper contractで、evidence complete candidateが構造上成立し得る状態。

claimed_from_real_operation:
  実際のactual local-only human review operation由来として、body-free receipt / rows / purge / no-leak validationが揃っている状態。

allowed_downstream_execution:
  PostCR22 re-entry / R52 / P5 / P6 / P8 / P7 / releaseを実行してよい状態。
  本設計では常にfalse。
```

現在の資料では、`candidate_supported` はあります。  
しかし、`claimed_from_real_operation` は成立していません。  
したがって、現在のmanual decision triageはbranch_Aへ落とす設計にします。

---

## 4. 本設計の対象・非対象

### 4.1 対象

本設計で扱う対象は次です。

```text
1. OP18 result memo / finalizer intake。
2. OP18 ready / blocked / repair_required statusの読み分け。
3. actual evidence complete candidate と actual evidence complete from real operation の分離。
4. 実レビュー由来claimの有無確認。
5. no-body / no-question-text / no-path / no-hash / no-terminal-output / no-touch scan。
6. invalid source / helper fixture source / promotion claim scan。
7. branch decision materialization。
8. branchごとのnext_required_step固定。
9. result memo body-free化。
10. P5/P6/P8/R52/P7/release非昇格の再固定。
```

### 4.2 非対象

本設計で扱わない対象は次です。

```text
- P8 question API / DB / RN UI / response keyの設計確定。
- question trigger logicの設計確定。
- question_text / draft_question_textの生成。
- question answer storageの設計確定。
- body-full packet生成。
- actual local-only human review実行。
- actual operation receipt作成。
- actual sanitized review result rows作成。
- actual rating rows作成。
- actual question need observation rows作成。
- disposal / purge実行。
- PostCR22 EX07-EX18 actual re-entry実行。
- R52 actual execution。
- P5 finalization。
- P6 start。
- P8 start。
- P7 complete。
- release decision。
- API / DB / RN / runtime / response key変更。
```

### 4.3 この設計が守る非昇格境界

```text
helper green != actual human review complete
ready-path fixture != live operation evidence
actual evidence candidate != downstream execution allowed
P5 confirmed candidate != P5 final
P6 candidate-only != P6 start
P8 material candidate-only != P8 start
R52 handoff candidate != R52 actual execution
PostCR22 reentry ready candidate != actual reentry executed
P7 target green != P7 complete
P7 complete != release allowed
```

---

## 5. 用語定義

### 5.1 actual evidence candidate

```text
actual evidence candidate:
  helper / result memo / body-free contract上で、実レビュー証跡として使える可能性がある状態。
  ただし、それ単体では実運用由来の完了証明ではない。
```

### 5.2 actual evidence complete from real operation

```text
actual evidence complete from real operation:
  実際のactual local-only human review operation由来として、body-free receipt / rows / rating / question observation / disposal / no-leak validationが揃い、
  invalid source、body leak、promotion claimがない状態。
```

成立条件案:

```text
- actual_operation_receipt_present: true
- actual_operation_receipt_source_ref: actual_local_only_human_review_by_person
- actual_human_review_executed_by_person: true
- reviewed_case_count: 24
- sanitized_review_result_row_count: 24
- rating_row_count: 24
- question_need_observation_row_count: 24
- disposal_purge_receipt_accepted: true
- no_body_leak_validation_passed: true
- no_question_text_validation_passed: true
- no_path_hash_validation_passed: true
- no_terminal_output_body_validation_passed: true
- no_touch_validation_passed: true
- promotion_claim_detected: false
```

### 5.3 body-free

```text
body-free:
  raw input、comment_text本文、reviewer notes本文、question text、draft question text、local path、hash、terminal output本文を含めない。
  使えるのはsafe identifier、count、boolean、enum、body-free reason ref、body-free blocker refだけ。
```

### 5.4 downstream manual decision

```text
downstream manual decision:
  実レビュー証跡の状態に応じて、次に進む先を人間判断として固定すること。
  自動でPostCR22 re-entry / R52 / P5 / P6 / P8 / P7 / releaseへ進めることではない。
```

---

## 6. 入力設計

### 6.1 必須入力

実装時の必須入力は、次のbody-free materialだけにします。

```text
op18_result_memo_downstream_manual_decision_hold_finalizer:
  source:
    build_p7_r54_ahr_post_pmn23_dmh_op18_result_memo_downstream_manual_decision_hold_finalizer(...)
  required:
    schema_version
    operation_step_ref
    material_id
    review_session_id
    dmh_op18_status_ref
    dmh_op18_ready
    dmh_op18_blocker_refs
    result_memo_bodyfree_closed
    downstream_manual_decision_hold_finalized
    manual_downstream_decision_required
    actual_review_evidence_complete_candidate_from_real_review
    actual_review_evidence_complete_from_real_review
    actual_review_evidence_complete_from_real_operation_claimed_here
    evidence_completion_state_ref
    evidence_incomplete_continue_or_retry_required
    bodyfree_evidence_boundary_repair_required
    postcr22_ex07_ex18_reentry_ready_candidate
    postcr22_ex07_ex18_reentry_executed_here
    r52_actual_execution_started_here
    r52_actual_execution_confirmed
    p5_final_allowed
    p6_start_allowed
    p8_start_allowed
    p7_complete
    release_allowed
    next_required_step
```

### 6.2 任意入力

実運用由来のbody-free evidence receiptが別途明示された場合のみ、任意入力として受けます。  
この設計段階では、任意入力の実ファイル化はしません。

```text
actual_operation_evidence_receipt_bodyfree_optional:
  operation_receipt_ref
  reviewer_person_ref
  review_session_id
  actual_source_guard_passed
  actual_human_review_executed_by_person
  reviewed_case_count
  selection_row_count
  sanitized_review_result_row_count
  rating_row_count
  question_need_observation_row_count
  disposal_purge_receipt_accepted
  no_body_leak_validation_passed
  no_question_text_validation_passed
  no_path_hash_validation_passed
  no_terminal_output_body_validation_passed
  no_touch_validation_passed
  source_kind_ref
  created_from_real_operation
```

受けないもの:

```text
raw_input
comment_text
reviewer_note_body
question_text
draft_question_text
local_path
absolute_path
relative_path
file_hash
body_hash
terminal_output_body
body_full_packet_body
```

### 6.3 入力sourceの扱い

許可source:

```text
- current OP18 body-free material
- body-free actual operation receipt explicitly marked as real local-only human review by person
- body-free counts / booleans / safe refs derived from actual review operation
```

禁止source:

```text
- unit test fixture ready path
- helper green
- result memo target greenだけ
- historical snapshot reuseだけ
- synthetic row
- local path / hash / raw packet body
- RN screen confirmationの代用
- full backend suite greenの代用
```

---

## 7. 出力設計

### 7.1 主出力

主出力は、body-freeのmanual decision triage materialです。

```text
material_name:
  p7_r54_ahr_post_dmh18_downstream_manual_decision_actual_evidence_status_triage_bodyfree

schema_version:
  cocolon.emlis.p7_r54.ahr.post_dmh18.downstream_manual_decision.actual_evidence_status_triage.bodyfree.v1

body_free:
  true
```

主出力が持つべき核は次です。

```text
- op18 intake status
- actual evidence candidate status
- actual evidence claimed-from-real-operation status
- leak / invalid source / promotion claim status
- branch_ref
- next_required_step
- blocker_refs
- reason_refs
- fixed non-promotion flags
- not_claimed_boundary
```

### 7.2 branch_ref

```text
DMD_BRANCH_EVIDENCE_INCOMPLETE_OR_NOT_CLAIMED_FROM_REAL_OPERATION
DMD_BRANCH_BODYFREE_BOUNDARY_REPAIR_REQUIRED
DMD_BRANCH_EVIDENCE_COMPLETE_MANUAL_DECISION_REQUIRED_NO_AUTO_EXECUTION
```

### 7.3 next_required_step

```text
continue_or_retry_actual_local_only_human_review_operation_before_downstream_decision
stop_and_repair_bodyfree_evidence_boundary
downstream_manual_decision_required_without_auto_execution
```

### 7.4 出力で常にfalseにするもの

```text
api_changed: false
db_changed: false
rn_changed: false
runtime_changed: false
response_key_changed: false
body_full_packet_generated_here: false
actual_local_human_review_executed_here: false
actual_rows_created_here: false
actual_disposal_purge_executed_here: false
postcr22_ex07_ex18_reentry_executed_here: false
r52_actual_execution_started_here: false
r52_actual_execution_confirmed: false
p5_final_allowed: false
p6_start_allowed: false
p8_start_allowed: false
p8_question_design_started: false
p8_question_implementation_started: false
p7_complete: false
release_allowed: false
manual_decision_auto_executes_downstream: false
full_backend_suite_green_claimed_here: false
rn_contract_green_claimed_here: false
rn_real_device_modal_verified_claimed_here: false
```

---

## 8. 実装配置方針

### 8.1 推奨配置

実装段階では、既存DMH helperへさらに巨大なOPを足し続けるより、Post-DMH-OP18専用の小さなhelper moduleを追加する方が安全です。

候補:

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_dmh18_downstream_manual_decision_triage_20260703.py
```

理由:

```text
- 既存 emlis_ai_p7_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_20260701.py は既にDMH-OP00〜OP18を抱えている。
- 次工程はDMH内部ではなく、Post-DMH-OP18のmanual decision triageである。
- 既存OP18 contractを変更せず、consumerとして扱う方がno-touch境界を守りやすい。
- P8 / R52 / P5 / P6の実行層と誤接続しにくい。
```

ただし、実ファイル作成は実装段階で判断します。  
実装時に既存命名・import境界・test discovery・前提資料差分を確認し、既存moduleへの最小追加の方が安全と判断される場合は、その時点で再判断します。

### 8.2 追加候補ファイル

設計上の追加候補は次です。

```text
new candidate:
  mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_dmh18_downstream_manual_decision_triage_20260703.py

new candidate tests:
  mashos-api/ai/tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op00_op03_20260703.py
  mashos-api/ai/tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op04_op07_20260703.py
  mashos-api/ai/tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op08_result_20260703.py

new candidate result memo:
  mashos-api/ai/tests/R54_AHR_PostDMH18_DownstreamManualDecision_ActualEvidenceStatusTriage_DMD_OP00_OP08_Result_20260703.md
```

### 8.3 変更しない候補

```text
no change:
  Cocolon RN files
  public API files
  DB schema / migration
  response keys
  runtime emotion submit flow
  P8 question files
  subscription plan guard
```

---

## 9. 実装順

実装段階では、次のDMD-OP00〜DMD-OP08で進めます。  
DMDは `Downstream Manual Decision` の作業用prefixです。実ファイル化時の正式命名は、既存命名体系を確認して固定します。

```text
DMD-OP00 scope / no-touch / no-promotion re-freeze after DMH-OP18
DMD-OP01 OP18 finalizer body-free intake
DMD-OP02 candidate vs real-operation evidence claim separation
DMD-OP03 actual evidence receipt completeness inventory
DMD-OP04 body-free leak / invalid source scan
DMD-OP05 downstream promotion claim scan
DMD-OP06 deterministic branch resolver
DMD-OP07 manual decision materialization
DMD-OP08 body-free result memo / target tests / regression closure
```

### DMD-OP00: scope / no-touch / no-promotion re-freeze after DMH-OP18

目的:

```text
OP18後のmanual decision triageのscopeを固定し、P8 / R52 / P5 / P6 / P7 / releaseへ自動昇格しない境界を再固定する。
```

入力:

```text
review_session_id optional
```

出力:

```text
schema_version
phase: P7
step: R54-AHR-PostDMH18_DownstreamManualDecision_ActualEvidenceStatusTriage_20260703
scope: p7_r54_ahr_post_dmh18_downstream_manual_decision_actual_evidence_status_triage
source_mode: local_received_zip_only
git_connection_required: false
git_checked: false
body_free: true
selected_stage_ref
not_stage_refs
fixed_non_promotion_refs
next_required_step: dmd_op01_op18_finalizer_bodyfree_intake
```

contract:

```text
- body_free must be true
- public_contract values must all be false
- no_touch_contract values must all be false
- body_free_markers values must all be false
- P5/P6/P8/R52/P7/release flags must be false
- forbidden payload keys must not exist
```

### DMD-OP01: OP18 finalizer body-free intake

目的:

```text
DMH-OP18 finalizerをbody-free inputとして受け、ready / blocked / repair_requiredを読み分ける。
```

入力:

```text
op18_result_memo_downstream_manual_decision_hold_finalizer
```

判定:

```text
if op18 missing:
  status = OP18_FINALIZER_MISSING
  branch_candidate = evidence_incomplete

if op18 schema invalid or forbidden payload detected:
  status = OP18_FINALIZER_INVALID_OR_BODYFREE_REPAIR_REQUIRED
  branch_candidate = repair_required

if op18 valid:
  status = OP18_FINALIZER_ACCEPTED_BODYFREE
  pass to DMD-OP02
```

注意:

```text
OP18 dmh_op18_ready: true だけでは、actual evidence complete from real operationとは扱わない。
OP18 next_required_step: downstream_manual_decision_required_without_auto_execution だけでは、P8/R52/P5/P6へ進めない。
```

### DMD-OP02: candidate vs real-operation evidence claim separation

目的:

```text
actual_review_evidence_complete_candidate と actual_review_evidence_complete_from_real_operation を分離する。
```

分離ルール:

```text
candidate_supported:
  op18.actual_review_evidence_complete_candidate_from_real_review is true
  or op18.actual_review_evidence_complete_from_real_review is true

claimed_from_real_operation:
  external actual operation evidence receipt is present
  and receipt.created_from_real_operation is true
  and receipt.source_kind_ref == actual_local_only_human_review_by_person
  and receipt counts / guards pass
```

明示禁止:

```text
- candidate_supported を claimed_from_real_operation に昇格しない。
- helper green を claimed_from_real_operation に昇格しない。
- OP18 ready-path を claimed_from_real_operation に昇格しない。
- `actual_review_evidence_complete_from_real_operation_claimed_here: false` を無視しない。
```

現在材料に対する期待:

```text
candidate_supported: true or possible
claimed_from_real_operation: false
expected_branch_candidate: evidence_incomplete_or_not_claimed_from_real_operation
```

### DMD-OP03: actual evidence receipt completeness inventory

目的:

```text
実レビュー由来のbody-free evidence receiptが揃っているか、count / guard / sourceだけで棚卸しする。
```

確認項目:

```text
actual_operation_receipt_present
actual_source_guard_passed
actual_human_review_executed_by_person
reviewed_case_count_is_24
selection_row_count_is_24
sanitized_review_result_row_count_is_24
rating_row_count_is_24
question_need_observation_row_count_is_24
disposal_purge_receipt_accepted
no_body_leak_validation_passed
no_question_text_validation_passed
no_path_hash_validation_passed
no_terminal_output_body_validation_passed
no_touch_validation_passed
review_session_id_consistent
operation_receipt_ref_consistent
```

判定:

```text
missing receipt / missing rows / count mismatch:
  evidence incomplete

invalid source / synthetic / helper fixture / body leak:
  repair required

all required body-free conditions pass:
  complete candidate for manual decision branch
```

### DMD-OP04: body-free leak / invalid source scan

目的:

```text
OP18 materialと任意actual evidence receiptに、body leak、question text leak、path/hash leak、terminal output本文、invalid sourceがないか確認する。
```

禁止payload key案:

```text
raw_input
input_body
comment_text
comment_body
reviewer_note
reviewer_note_body
question_text
draft_question_text
answer_text
raw_answer
body_full_packet
body_full_packet_body
local_path
absolute_path
relative_path
file_path
body_hash
input_hash
sha256
terminal_output
terminal_output_body
stdout
stderr
```

修復分岐へ送る条件:

```text
- forbidden payload key detected
- local path shape detected in safe ref
- question/body text shape detected in safe ref
- hash-like raw value detected where safe id is required
- terminal output body detected
- source_kind_ref is unit_test_fixture / helper_green / synthetic / historical_only
```

### DMD-OP05: downstream promotion claim scan

目的:

```text
manual decision triage materialが、下流工程を自動実行・許可したように見えるclaimを持たないことを確認する。
```

常にfalse:

```text
manual_decision_auto_executes_downstream
postcr22_ex07_ex18_reentry_executed_here
postcr22_ex07_ex18_reentry_execution_requested_here
r52_actual_execution_started_here
r52_actual_execution_confirmed
p5_final_allowed
p6_start_allowed
p8_start_allowed
p8_question_design_started
p8_question_implementation_started
p7_complete
release_allowed
full_backend_suite_green_claimed_here
rn_contract_green_claimed_here
rn_real_device_modal_verified_claimed_here
```

promotion claim検出時:

```text
branch = DMD_BRANCH_BODYFREE_BOUNDARY_REPAIR_REQUIRED
next_required_step = stop_and_repair_bodyfree_evidence_boundary
```

### DMD-OP06: deterministic branch resolver

目的:

```text
DMD-OP01〜OP05の結果から、branchを決定する。
```

優先順位:

```text
1. repair_required
2. evidence_incomplete_or_not_claimed_from_real_operation
3. evidence_complete_manual_decision_required_no_auto_execution
```

resolver疑似コード:

```python
def resolve_post_dmh18_manual_decision_branch(op18, receipt=None):
    repair_blockers = scan_bodyfree_invalid_source_and_promotion(op18, receipt)
    if repair_blockers:
        return {
            "branch_ref": "DMD_BRANCH_BODYFREE_BOUNDARY_REPAIR_REQUIRED",
            "next_required_step": "stop_and_repair_bodyfree_evidence_boundary",
            "blocker_refs": repair_blockers,
        }

    complete = (
        op18_is_valid_bodyfree(op18)
        and receipt_is_present(receipt)
        and receipt_is_from_actual_local_only_human_review_by_person(receipt)
        and receipt_counts_are_24(receipt)
        and receipt_no_leak_guards_pass(receipt)
        and not downstream_promotion_claimed(op18, receipt)
    )

    if not complete:
        return {
            "branch_ref": "DMD_BRANCH_EVIDENCE_INCOMPLETE_OR_NOT_CLAIMED_FROM_REAL_OPERATION",
            "next_required_step": "continue_or_retry_actual_local_only_human_review_operation_before_downstream_decision",
            "blocker_refs": missing_or_not_claimed_refs(op18, receipt),
        }

    return {
        "branch_ref": "DMD_BRANCH_EVIDENCE_COMPLETE_MANUAL_DECISION_REQUIRED_NO_AUTO_EXECUTION",
        "next_required_step": "downstream_manual_decision_required_without_auto_execution",
        "reason_refs": evidence_complete_reason_refs(op18, receipt),
    }
```

### DMD-OP07: manual decision materialization

目的:

```text
branch / next_required_step / blocker_refs / reason_refs / non-promotion flags をbody-free materialとして固定する。
```

出力項目:

```text
schema_version
phase
step
scope
operation_step_ref
material_id
review_session_id
op18_intake_status_ref
candidate_supported
claimed_from_real_operation
actual_evidence_status_ref
branch_ref
branch_reason_refs
branch_blocker_refs
next_required_step
bodyfree_evidence_boundary_repair_required
evidence_incomplete_continue_or_retry_required
downstream_manual_decision_required_without_auto_execution
fixed_non_promotion_refs
not_claimed_boundary
public_contract
post_dmh18_no_touch_contract
body_free_markers
body_free
```

C branchでも固定すること:

```text
postcr22_ex07_ex18_reentry_ready_candidate: true may be allowed
postcr22_ex07_ex18_reentry_executed_here: false
r52_handoff_candidate: true may be allowed
r52_actual_execution_started_here: false
p5_final_allowed: false
p6_start_allowed: false
p8_start_allowed: false
p7_complete: false
release_allowed: false
manual_decision_auto_executes_downstream: false
```

### DMD-OP08: body-free result memo / target tests / regression closure

目的:

```text
実装結果をbody-free result memoとして残し、target testsと最小regressionを実行する。
```

result memo必須section案:

```text
implementation_scope
changed_files
target_tests
selected_regression
compileall
op18_intake_status
candidate_vs_real_operation_claim_status
actual_evidence_receipt_inventory_status
bodyfree_leak_invalid_source_scan_status
promotion_claim_scan_status
branch_decision_status
next_required_step
not_claimed_boundary
not_executed_boundary
unverified_boundary
```

target tests案:

```text
- DMD-OP00 scope / no-touch / no-promotion re-freeze。
- DMD-OP01 OP18 finalizer intake ready / blocked / repair。
- DMD-OP02 OP18 ready-pathをactual real operationへ昇格しない。
- DMD-OP03 missing receipt / count mismatchをevidence incompleteへ送る。
- DMD-OP04 forbidden payload / path / hash / question textをrepairへ送る。
- DMD-OP05 P5/P6/P8/R52/P7/release claimをrepairへ送る。
- DMD-OP06 repair precedence > incomplete > complete。
- DMD-OP07 branch Cでもauto executionしない。
- DMD-OP08 result memo sections are fixed and body-free。
```

selected regression案:

```text
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op18_20260702.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op16_op17_20260702.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op22_op23_contract_20260630.py

python3 -m compileall -q services/ai_inference tests
```

未主張として残すもの:

```text
full backend suite green
RN contract green
RN real-device modal verified
actual review execution
body-full packet generation
actual rows creation
purge execution
PostCR22 re-entry execution
R52 actual execution
P5/P6/P8/P7/release
```

---

## 10. json / schema案

以下は設計書内の案です。  
実ファイル化は実装段階で判断します。

### 10.1 主material schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_dmh18.downstream_manual_decision.actual_evidence_status_triage.bodyfree.v1.schema.json",
  "title": "P7 R54 AHR Post-DMH18 Downstream Manual Decision Actual Evidence Status Triage Body-free Material",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "phase",
    "step",
    "scope",
    "policy_kind",
    "operation_step_ref",
    "material_id",
    "review_session_id",
    "source_mode",
    "git_connection_required",
    "git_checked",
    "op18_material_ref",
    "op18_intake_status_ref",
    "op18_ready",
    "candidate_supported",
    "claimed_from_real_operation",
    "actual_evidence_status_ref",
    "branch_ref",
    "branch_reason_refs",
    "branch_blocker_refs",
    "next_required_step",
    "bodyfree_evidence_boundary_repair_required",
    "evidence_incomplete_continue_or_retry_required",
    "downstream_manual_decision_required_without_auto_execution",
    "manual_decision_auto_executes_downstream",
    "postcr22_ex07_ex18_reentry_executed_here",
    "r52_actual_execution_started_here",
    "r52_actual_execution_confirmed",
    "p5_final_allowed",
    "p6_start_allowed",
    "p8_start_allowed",
    "p8_question_design_started",
    "p8_question_implementation_started",
    "p7_complete",
    "release_allowed",
    "public_contract",
    "post_dmh18_no_touch_contract",
    "body_free_markers",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dmh18.downstream_manual_decision.actual_evidence_status_triage.bodyfree.v1"
    },
    "phase": { "const": "P7" },
    "step": {
      "const": "R54-AHR-PostDMH18_DownstreamManualDecision_ActualEvidenceStatusTriage_20260703"
    },
    "scope": {
      "const": "p7_r54_ahr_post_dmh18_downstream_manual_decision_actual_evidence_status_triage"
    },
    "policy_kind": {
      "const": "r54_ahr_post_dmh18_downstream_manual_decision_bodyfree_triage_boundary"
    },
    "operation_step_ref": { "type": "string", "minLength": 1, "maxLength": 220 },
    "material_id": { "type": "string", "minLength": 1, "maxLength": 260 },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 220 },
    "source_mode": { "const": "local_received_zip_only" },
    "git_connection_required": { "const": false },
    "git_checked": { "const": false },
    "op18_material_ref": { "type": "string", "minLength": 1, "maxLength": 260 },
    "op18_intake_status_ref": {
      "enum": [
        "DMD_OP18_FINALIZER_ACCEPTED_BODYFREE",
        "DMD_OP18_FINALIZER_MISSING",
        "DMD_OP18_FINALIZER_INVALID_OR_REPAIR_REQUIRED"
      ]
    },
    "op18_ready": { "type": "boolean" },
    "candidate_supported": { "type": "boolean" },
    "claimed_from_real_operation": { "type": "boolean" },
    "actual_evidence_status_ref": {
      "enum": [
        "actual_evidence_incomplete_or_not_claimed_from_real_operation",
        "bodyfree_evidence_boundary_repair_required",
        "actual_evidence_complete_from_real_operation_bodyfree_candidate_ready"
      ]
    },
    "branch_ref": {
      "enum": [
        "DMD_BRANCH_EVIDENCE_INCOMPLETE_OR_NOT_CLAIMED_FROM_REAL_OPERATION",
        "DMD_BRANCH_BODYFREE_BOUNDARY_REPAIR_REQUIRED",
        "DMD_BRANCH_EVIDENCE_COMPLETE_MANUAL_DECISION_REQUIRED_NO_AUTO_EXECUTION"
      ]
    },
    "branch_reason_refs": {
      "type": "array",
      "items": { "type": "string", "minLength": 1, "maxLength": 180 }
    },
    "branch_blocker_refs": {
      "type": "array",
      "items": { "type": "string", "minLength": 1, "maxLength": 180 }
    },
    "next_required_step": {
      "enum": [
        "continue_or_retry_actual_local_only_human_review_operation_before_downstream_decision",
        "stop_and_repair_bodyfree_evidence_boundary",
        "downstream_manual_decision_required_without_auto_execution"
      ]
    },
    "bodyfree_evidence_boundary_repair_required": { "type": "boolean" },
    "evidence_incomplete_continue_or_retry_required": { "type": "boolean" },
    "downstream_manual_decision_required_without_auto_execution": { "type": "boolean" },
    "manual_decision_auto_executes_downstream": { "const": false },
    "postcr22_ex07_ex18_reentry_executed_here": { "const": false },
    "r52_actual_execution_started_here": { "const": false },
    "r52_actual_execution_confirmed": { "const": false },
    "p5_final_allowed": { "const": false },
    "p6_start_allowed": { "const": false },
    "p8_start_allowed": { "const": false },
    "p8_question_design_started": { "const": false },
    "p8_question_implementation_started": { "const": false },
    "p7_complete": { "const": false },
    "release_allowed": { "const": false },
    "public_contract": {
      "type": "object",
      "additionalProperties": { "const": false }
    },
    "post_dmh18_no_touch_contract": {
      "type": "object",
      "additionalProperties": { "const": false }
    },
    "body_free_markers": {
      "type": "object",
      "additionalProperties": { "const": false }
    },
    "body_free": { "const": true }
  }
}
```

### 10.2 evidence receipt optional schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_dmh18.actual_operation_evidence_receipt.bodyfree.optional.v1.schema.json",
  "title": "Optional Actual Operation Evidence Receipt Body-free Input",
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
    "operation_receipt_ref": { "type": "string", "minLength": 1, "maxLength": 220 },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 220 },
    "source_kind_ref": {
      "enum": [
        "actual_local_only_human_review_by_person",
        "unit_test_fixture",
        "helper_green",
        "synthetic",
        "historical_reuse_only",
        "unknown"
      ]
    },
    "created_from_real_operation": { "type": "boolean" },
    "actual_source_guard_passed": { "type": "boolean" },
    "actual_human_review_executed_by_person": { "type": "boolean" },
    "reviewed_case_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "selection_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "sanitized_review_result_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "rating_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "question_need_observation_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "disposal_purge_receipt_accepted": { "type": "boolean" },
    "no_body_leak_validation_passed": { "type": "boolean" },
    "no_question_text_validation_passed": { "type": "boolean" },
    "no_path_hash_validation_passed": { "type": "boolean" },
    "no_terminal_output_body_validation_passed": { "type": "boolean" },
    "no_touch_validation_passed": { "type": "boolean" },
    "body_free": { "const": true }
  }
}
```

### 10.3 現在材料に対する出力例案

現在の資料・実ファイルに対して実装した場合、期待される出力の方向は次です。  
これは実ファイルではなく、設計上の例です。

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.post_dmh18.downstream_manual_decision.actual_evidence_status_triage.bodyfree.v1",
  "phase": "P7",
  "step": "R54-AHR-PostDMH18_DownstreamManualDecision_ActualEvidenceStatusTriage_20260703",
  "scope": "p7_r54_ahr_post_dmh18_downstream_manual_decision_actual_evidence_status_triage",
  "policy_kind": "r54_ahr_post_dmh18_downstream_manual_decision_bodyfree_triage_boundary",
  "operation_step_ref": "DMD-OP07_manual_decision_materialization",
  "material_id": "p7_r54_ahr_post_dmh18_dmd_op07_current_received_264_91_177_20260703",
  "review_session_id": "r54_ahr_postdmh18_dmd_session_20260703_current_received_264_91_177_v1",
  "source_mode": "local_received_zip_only",
  "git_connection_required": false,
  "git_checked": false,
  "op18_material_ref": "R54_AHR_PostPMN23_DownstreamManualDecisionHold_EvidenceIntake_DMH_OP18_Result_20260702.md",
  "op18_intake_status_ref": "DMD_OP18_FINALIZER_ACCEPTED_BODYFREE",
  "op18_ready": true,
  "candidate_supported": true,
  "claimed_from_real_operation": false,
  "actual_evidence_status_ref": "actual_evidence_incomplete_or_not_claimed_from_real_operation",
  "branch_ref": "DMD_BRANCH_EVIDENCE_INCOMPLETE_OR_NOT_CLAIMED_FROM_REAL_OPERATION",
  "branch_reason_refs": [
    "op18_bodyfree_finalizer_available",
    "helper_ready_path_not_promoted_to_real_operation_claim",
    "actual_review_evidence_complete_from_real_operation_not_claimed"
  ],
  "branch_blocker_refs": [
    "actual_body_full_packet_generation_not_run_here",
    "actual_local_human_review_execution_not_run_here",
    "actual_operation_receipt_from_real_operation_not_created_here",
    "actual_rows_from_real_operation_not_created_here",
    "actual_disposal_purge_not_run_here"
  ],
  "next_required_step": "continue_or_retry_actual_local_only_human_review_operation_before_downstream_decision",
  "bodyfree_evidence_boundary_repair_required": false,
  "evidence_incomplete_continue_or_retry_required": true,
  "downstream_manual_decision_required_without_auto_execution": false,
  "manual_decision_auto_executes_downstream": false,
  "postcr22_ex07_ex18_reentry_executed_here": false,
  "r52_actual_execution_started_here": false,
  "r52_actual_execution_confirmed": false,
  "p5_final_allowed": false,
  "p6_start_allowed": false,
  "p8_start_allowed": false,
  "p8_question_design_started": false,
  "p8_question_implementation_started": false,
  "p7_complete": false,
  "release_allowed": false,
  "public_contract": {},
  "post_dmh18_no_touch_contract": {},
  "body_free_markers": {},
  "body_free": true
}
```

---

## 11. test設計

### 11.1 target test group

実装段階でのtarget testは、DMD-OP00〜OP08を小分けにします。

```text
test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op00_op03_20260703.py
test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op04_op07_20260703.py
test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op08_result_20260703.py
```

### 11.2 必須test case

```text
1. OP18 finalizer missing -> branch_A evidence incomplete。
2. OP18 finalizer valid but actual real operation receipt missing -> branch_A。
3. OP18 ready-path true + actual_review_evidence_complete_from_real_operation_claimed_here false -> branch_A。
4. OP18 contains raw_input -> branch_B repair。
5. OP18 contains question_text -> branch_B repair。
6. OP18 contains local path shape -> branch_B repair。
7. OP18 contains hash / terminal output body -> branch_B repair。
8. OP18 p8_start_allowed true -> branch_B repair。
9. OP18 r52_actual_execution_confirmed true -> branch_B repair。
10. Optional receipt source_kind_ref helper_green -> branch_B or invalid source blocker。
11. Optional receipt source_kind_ref actual_local_only_human_review_by_person but row count 23 -> branch_A incomplete。
12. Optional receipt source_kind_ref actual_local_only_human_review_by_person and all counts/guards pass -> branch_C。
13. branch_C still postcr22_ex07_ex18_reentry_executed_here false。
14. branch_C still r52_actual_execution_started_here false。
15. branch_C still p5_final_allowed / p6_start_allowed / p8_start_allowed / p7_complete / release_allowed false。
16. fixed_non_promotion_refs tampering is rejected。
17. result memo required sections tampering is rejected。
18. public_contract / no_touch_contract / body_free_markers all false。
19. forbidden payload top-level keys never appear in output。
20. schema_version / phase / scope / operation_step_ref tampering is rejected。
```

### 11.3 selected regression

実装段階で最低限維持する回帰は次です。

```text
DMH-OP18 target:
  tests/test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op18_20260702.py

DMH-OP16/OP17 target:
  tests/test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op16_op17_20260702.py

PMN-OP22/OP23 selected regression:
  tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op22_op23_contract_20260630.py

compileall:
  python3 -m compileall -q services/ai_inference tests
```

### 11.4 今回主張しないtest

```text
- full backend suite green。
- RN contract green。
- RN実機modal確認。
- actual body-full packet generation。
- actual local-only human review実行。
- actual rows作成。
- actual disposal / purge実行。
```

---

## 12. result memo設計

実装段階のresult memoは、body-freeで次の構成にします。

```text
# R54-AHR Post-DMH18 Downstream Manual Decision Actual Evidence Status Triage Result

created_at
source_mode
github_connection_check
operation_scope
body_free_result_memo

## 1. Pre-check
- previous OP18 material present / absent
- previous OP18 target regression status
- no GitHub check

## 2. Implementation scope
- DMD-OP00〜OP08 only
- no API / DB / RN / runtime / response key change

## 3. Changed files
- modified / new / deleted

## 4. OP18 intake status
- accepted / missing / repair_required

## 5. Candidate vs real operation claim separation
- candidate_supported
- claimed_from_real_operation
- helper_green_not_promoted

## 6. Evidence receipt inventory
- receipt present
- source kind
- counts only
- no body fields

## 7. Body-free / invalid source / promotion scan
- no body
- no question text
- no path
- no hash
- no terminal output body
- no downstream promotion

## 8. Branch decision
- branch_ref
- next_required_step
- blockers / reasons

## 9. Test results
- target tests
- selected regressions
- compileall

## 10. Not claimed
- actual review execution
- body-full generation
- actual rows
- purge
- PostCR22 re-entry
- R52
- P5/P6/P8/P7/release
- full backend suite / RN / real device
```

Result memoに含めてはいけないもの:

```text
raw input
comment_text body
reviewer note body
question text
draft question text
body-full packet body
local path
file hash
body hash
terminal output全文
個別ケース本文
```

---

## 13. 実装時の分岐仕様

### 13.1 branch_A: evidence incomplete / not claimed

条件:

```text
- OP18 is missing, or
- OP18 is valid but actual real operation receipt is missing, or
- OP18 candidate exists but actual_review_evidence_complete_from_real_operation_claimed_here is false, or
- required actual evidence count is missing / under 24, or
- disposal receipt is missing, or
- no-leak validation is missing.
```

出力:

```text
branch_ref:
  DMD_BRANCH_EVIDENCE_INCOMPLETE_OR_NOT_CLAIMED_FROM_REAL_OPERATION

next_required_step:
  continue_or_retry_actual_local_only_human_review_operation_before_downstream_decision
```

意味:

```text
P8へ進まない。
R52へ進まない。
P5/P6/P7/releaseへ進まない。
実レビュー由来のbody-free証跡を揃える工程へ戻す。
```

### 13.2 branch_B: leak / invalid source / promotion claim

条件:

```text
- body text / question text / path / hash / terminal output bodyが混入した。
- sourceがhelper_green / unit_test_fixture / synthetic / historical_onlyだった。
- P5 / P6 / P8 / R52 / P7 / releaseへの昇格claimが混入した。
- OP18 contractまたはDMD materialが破損した。
```

出力:

```text
branch_ref:
  DMD_BRANCH_BODYFREE_BOUNDARY_REPAIR_REQUIRED

next_required_step:
  stop_and_repair_bodyfree_evidence_boundary
```

意味:

```text
実レビュー継続より先に、body-free境界を修復する。
漏れや昇格claimがある状態でmanual decisionへ進めない。
```

### 13.3 branch_C: evidence complete, manual decision required, no auto execution

条件:

```text
- OP18 finalizer is valid body-free。
- actual operation evidence receipt is explicitly from real local-only human review by person。
- reviewed_case_count / selection_row_count / sanitized rows / rating rows / question observation rows are all 24。
- disposal / purge receipt is accepted。
- no-body / no-question / no-path / no-hash / no-terminal-output / no-touch validations pass。
- no invalid source。
- no promotion claim。
```

出力:

```text
branch_ref:
  DMD_BRANCH_EVIDENCE_COMPLETE_MANUAL_DECISION_REQUIRED_NO_AUTO_EXECUTION

next_required_step:
  downstream_manual_decision_required_without_auto_execution
```

意味:

```text
証跡はmanual decision材料として揃っている。
ただし、PostCR22 re-entry / R52 / P5 / P6 / P8 / P7 / releaseは自動実行しない。
次に、どの下流へ進むかを別のmanual decisionとして判断する。
```

---

## 14. 実装時の安全境界

### 14.1 no-body境界

```text
DMD material / result memo / tests fixture assertion message に、ユーザー入力本文、comment_text本文、reviewer note本文、question text、draft question text、body-full packet本文を入れない。
```

### 14.2 no-path / no-hash境界

```text
local absolute path、relative path、file hash、body hash、packet hashを成果物へ出さない。
safe refとして必要な場合も、path形状やhash形状を持つ値はrejectする。
```

### 14.3 no-terminal-output境界

```text
test resultは count / status のみ記録する。
terminal output全文や失敗時stack traceをresult memoへ貼らない。
```

### 14.4 no-touch境界

```text
API / DB / RN / runtime / response key / public response top-level key を変更しない。
P8 question implementationへ接続しない。
```

### 14.5 no-promotion境界

```text
branch_Cでも、downstream actual execution allowedにはしない。
manual decision requiredを出すだけ。
```

---

## 15. 実装段階のファイル差分想定

実装段階での差分は、最小で次を想定します。

```text
new:
  mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_dmh18_downstream_manual_decision_triage_20260703.py
  mashos-api/ai/tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op00_op03_20260703.py
  mashos-api/ai/tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op04_op07_20260703.py
  mashos-api/ai/tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op08_result_20260703.py
  mashos-api/ai/tests/R54_AHR_PostDMH18_DownstreamManualDecision_ActualEvidenceStatusTriage_DMD_OP00_OP08_Result_20260703.md

modified:
  none preferred
```

もし既存helper importのために修正が必要な場合も、次に限定します。

```text
- import path調整。
- alias追加。
- test helper参照の最小化。
```

変更禁止:

```text
- emotion_submit_service.py
- api_emotion_submit.py
- DB migration
- RN screen / hook / contract
- P8 question関連ファイル
- subscription plan guard
- public response key
```

---

## 16. 実装後の期待される現在branch

現在材料に対して実装した場合、期待されるbranchは次です。

```text
expected_current_branch:
  DMD_BRANCH_EVIDENCE_INCOMPLETE_OR_NOT_CLAIMED_FROM_REAL_OPERATION

expected_next_required_step:
  continue_or_retry_actual_local_only_human_review_operation_before_downstream_decision
```

理由:

```text
- OP18 body-free finalizerは存在する。
- OP18 targetはgreen。
- OP16/OP17 targetはgreen。
- PMN-OP22/OP23 selected regressionはgreen。
- compileallは通る。
- しかし、actual body-full packet generationは未実行。
- actual local-only human review executionは未実行。
- actual operation receipt from real operationは新規作成されていない。
- actual rowsは新規作成されていない。
- actual disposal / purgeは未実行。
- actual review evidence complete from real operationはclaimedではない。
```

このbranchは、後退ではありません。  
helper greenを実レビュー完了へ読み替えないための正しい停止です。

---

## 17. 華恋の意見

華恋としては、この設計は必要です。  
理由は、OP18までで器はかなり整っていますが、器が整ったことと、実ケースを人間が読み、EmlisAIの商品価値を確認したことは違うからです。

Cocolonの核は、「ユーザーの言葉を読まれた形にすること」です。  
ここでP8質問機能へ進むと、Cocolonが「問い返しで補うAI」へ寄る危険があります。  
問いは必要になるかもしれません。けれど、問いはEmlisAIが読めないことの逃げ道ではなく、補完リスクを下げるための慎重な補助であるべきです。

そのため、次の実装は大きな新機能ではなく、Post-DMH-OP18のmanual decision triageに閉じるのがよいです。  
さらに、既存の巨大helperへ積み増すより、Post-DMH-OP18専用の小さなhelperとして分ける方が、Cocolonとして在るべき慎重さに合っています。

---

## 18. 確認済み

```text
- 今回の指示は、検討メモを基に、実装順を含む詳細設計書をmdで作ること。
- 本書は設計書であり、コード変更はしていない。
- json / schema案は本書内に含めたが、実ファイル化していない。
- GitHub接続確認はMash指定により不要。
- Cocolon_前提資料とwork_attitude_rules_for_karenを確認した。
- EmlisAI是正方針、Cocolon思想資料、EmlisAI状態回答資料、ロードマップを確認した。
- P7/P8 Bridgeでは、P7中に観測補助問いを実装しないと固定されている。
- P8開始時の問い詳細設計は、P7中に集めた実ケースの問い必要性観察メモを材料にする。
- 00_karen_read_first.md 2026-07-02時点で、DMH-OP00〜OP18反映済み。
- 00_karen_read_first.md 2026-07-02時点で、P5 final / P6 start / P8 start / R52 actual execution / P7 complete / release allowedはfalse。
- DMH-OP18 result memoは、downstream manual decision hold finalizerを閉じている。
- DMH-OP18 result memoは、body-full packet生成・actual review実行・actual rows作成・purge・PostCR22 re-entry・R52 actual execution・P8開始をnot claimedとしている。
- r54dmh_diff_20260702.csvでは、DMH-OP00〜OP18のclaim boundaryが actual review execution / downstream promotion ではないことを示している。
- 設計作成前に、OP18 target 42 passed、OP16/OP17 target 79 passed、PMN-OP22/OP23 selected regression 37 passed、compileall passedを確認した。
```

---

## 19. 未確認

```text
- full backend suite green。
- RN contract再実行green。
- RN real-device modal確認。
- actual body-full packet generation。
- actual 24-case local-only human review execution by person。
- actual operation receipt from real operation。
- actual sanitized review result rows 24件。
- actual rating rows 24件。
- actual question need observation rows 24件。
- actual disposal / purge receipt。
- actual review evidence complete from real operation。
- PostCR22 EX07-EX18 actual re-entry execution。
- R52 actual execution。
- P5 final allowed。
- P6 start allowed。
- P8 start allowed。
- P7 complete。
- release allowed。
```

---

## 20. 書かれていない

```text
- DMH-OP18 target green後に、P8 question designへ進んでよいとは書かれていない。
- DMH-OP18 target green後に、P8 question implementationへ進んでよいとは書かれていない。
- OP16/OP17/OP18のready-path fixtureを、actual live review evidence completeとして扱ってよいとは書かれていない。
- target greenをactual human review execution completeとして扱ってよいとは書かれていない。
- actual evidence candidateを、P5 final / P6 start / P8 start / R52 actual execution / P7 complete / release allowedへ自動昇格してよいとは書かれていない。
- PostCR22 re-entry candidateを、actual re-entry実行済みとして扱ってよいとは書かれていない。
- P8 material candidate-onlyを、P8 start allowedへ読み替えてよいとは書かれていない。
```

---

## 21. 推測禁止

```text
禁止1:
  helper contract readyをactual review execution completeへ読み替えること。

禁止2:
  result memo ready-pathを、実レビュー由来のlive evidenceが存在する証明として扱うこと。

禁止3:
  P8 material candidateがあることを理由に、P8 start allowedと推測すること。

禁止4:
  「問い必要性観察メモ」があることを理由に、P7中に質問API / DB / RN UIを作ること。

禁止5:
  candidate-only materialをallowed / executed / completeへ昇格すること。

禁止6:
  body-full packet、raw input、comment_text body、reviewer notes本文、question text、local path、hash、terminal outputを成果物へ残すこと。

禁止7:
  full backend suite、RN contract、RN実機modal確認を未実行のまま確認済みにすること。
```

---

## 22. 次に実行すべきこと

実装指示が出た場合、次に実行することは次です。

```text
1. 既存命名体系とimport境界を確認し、Post-DMH18専用helperを新規作成するか、既存helperへ最小追加するかを最終判断する。
2. DMD-OP00〜DMD-OP08を実装する。
3. OP18 ready-pathをactual real operation completeへ昇格しないtestを最優先で書く。
4. forbidden payload / promotion claim / invalid sourceのrepair branch testを書く。
5. current materialではbranch_Aになることをtestで固定する。
6. branch_CでもPostCR22/R52/P5/P6/P8/P7/releaseを自動実行しないことをtestで固定する。
7. target tests、selected regression、compileallを実行する。
8. body-free result memoを作成する。
```

最終判断:

```text
selected_next_implementation_stage:
  P7-R54-AHR Post-DMH-OP18 Downstream Manual Decision / Actual Evidence Status Triage

expected_current_branch:
  evidence_incomplete_or_not_claimed_from_real_operation

not_selected:
  - P8 question design
  - P8 question implementation
  - P6 limited human readfeel start
  - R52 actual execution
  - P5 finalization
  - P7 complete
  - release decision
```
