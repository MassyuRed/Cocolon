---
title: "Cocolon / EmlisAI P7-R54-AHR Post-PNT Closed Material Next Boundary Confirmation 詳細設計書・実装順"
created_at: "2026-07-07 JST"
author: "華恋"
work_mode: "共鳴構造モード"
work_type: "詳細設計書 / 実装順 / json・schema案内包"
source_mode: "local_received_zip_only"
github_connection_check: "Mash様指示により不要 / 未実施"
base_pre_design_memo: "Cocolon_EmlisAI_P7_R54AHR_PostPNT_NextBoundarySelection_PreDesignMemo_20260707.md"
selected_roadmap_phase: "P7 Product Quality Runner / Long-run Product Gate 継続"
selected_design_target: "P7-R54-AHR Post-PNT Closed Material Next Boundary Confirmation / next design candidate only"
recommended_boundary_prefix: "PCM-OP00〜PCM-OP08"
recommended_prefix_meaning: "PCM = Post-PNT Closed Material confirmation"
artifact_scope: "md design only"
code_change: "none"
test_change: "none"
json_schema_file_creation: "none"
api_change: "none"
db_change: "none"
rn_change: "none"
runtime_change: "none"
response_key_change: "none"
pnt_builder_call: "none"
pnt_op08_material_synthesis: "none"
selected_post_nci_next_boundary_execution: "none"
dhr_op05_call: "none"
dhr_op05_builder_call: "none"
dhr_op06_call: "none"
dhr_op07_materialization: "none"
dmd_execution: "none"
r52_actual_execution: "none"
actual_review_start: "none"
actual_rows_creation: "none"
question_need_observation_rows_creation: "none"
p8_start: "none"
p8_question_design: "none"
question_text_materialization: "none"
p7_complete: "none"
release_decision: "none"
current_expected_next_required_step_after_design: "implement_thin_pcm_explicit_closed_material_helper_and_targets_then_stop_at_candidate_hold_or_stop_closure"
---

# Cocolon / EmlisAI P7-R54-AHR Post-PNT Closed Material Next Boundary Confirmation 詳細設計書・実装順

対象: Cocolon / EmlisAI / P7 Product Quality Runner / R54-AHR / PNT-OP08後の closed material next boundary confirmation 境界  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
実装扱い: 本書は設計書です。コード変更、テスト変更、json/schema実ファイル化、DHR-OP05呼び出し、DHR-OP06以降、DMD/R52、actual review、actual rows、P8問いシステム、API/DB/RN/runtime/response key変更、P7完了、release判断は行いません。  
json / schema実ファイル化: なし。本書内の案のみです。実ファイル化は実装段階で、既存helper、既存schema配置、既存guard、既存test結果を確認して判断します。  
GitHub接続確認: Mash様指定により不要。ローカル受領zip基準。  

---

## 0. 結論

今回の詳細設計対象は、次で固定します。

```text
P7-R54-AHR Post-PNT Closed Material Next Boundary Confirmation
/ next design candidate only
```

推奨する境界prefixは次です。

```text
PCM-OP00〜PCM-OP08
PCM = Post-PNT Closed Material confirmation
```

PCMの責務は、PNT-OP08 / R11で成立した **全lane対応のPNT boundary green** を、現在laneや実行許可に読み替えないために、**明示的に渡された1件のclosed PNT-OP08 material** だけを読み、次を判定して止めることです。

```text
- next_design_candidate
- wait_hold
- stop
```

PCMは、次を行いません。

```text
- PNT-OP08 materialの無入力合成
- PNT helper default builder呼び出し
- all-lane decision tableからcurrent laneを推測
- DHR-OP05呼び出し
- DHR-OP05 builder呼び出し
- DHR-OP06 / DHR-OP07 / DMD / R52実行
- actual review start
- actual rows / question need observation rows作成
- P8問いシステム設計 / 実装
- question_text / draft_question_text / answer_text materialization
- API / DB / RN / runtime / response key変更
- P7 complete / release allowed claim
```

現時点で設計対象をDHR-OP05本設計へ直行しない理由は明確です。PNT R11は、DHR-OP05 laneが選ばれた場合の次設計候補を示していますが、**PNT target / selected regression / compileallのgreenから現在laneを1つ確定していません**。したがって、今回の設計はDHR-OP05 Manual Handoff Boundary自体ではなく、その前に置く薄い確認境界です。

PCM-OP08の最終出力で、明示closed materialがDHR-OP05 laneであることが確認された場合だけ、次設計候補として以下を記録できます。

```text
P7-R54-AHR Post-NCI DHR-OP05 Manual Handoff Boundary
/ Preflight Re-entry Design Candidate
```

ただし、この記録はDHR-OP05を呼ぶ許可ではありません。次設計候補の記録だけです。

---

## 1. なぜこの設計を行うのか

Cocolon / EmlisAIで守るべき核は、ユーザーの言葉を雑に処理しないことです。これはプロダクト応答だけの話ではなく、開発工程でも同じです。

PNT-OP00〜OP08とR7〜R11により、Post-NCI selected handoff-or-stop decision triage boundary はlocal target上で閉じています。ですが、PNTが閉じたことは、次工程を実行してよいことではありません。

今回防ぐ短絡は次です。

```text
PNT target green
  -> PNTは6 laneを閉じられる
  -> DHR-OP05 laneもテストにある
  -> だからDHR-OP05へ進める
  -> だからactual review / P8 / releaseへ近づいた
```

この読みは危険です。6 laneを閉じられるhelperが存在することと、現在のclosed materialがどのlaneを選んでいるかは別です。

PCMは、次の区別を明文化するための設計です。

```text
validated helper capability ≠ current selected lane
closed material ref ≠ downstream execution permission
next design candidate ≠ DHR-OP05 call permission
question need observation material ≠ P8 question implementation
PNT green ≠ product read-feel completion
```

Cocolonとして在るべき姿は、「分かったように見える構造」を増やすことではなく、確認できていないものを確認済みにしないことです。PCMはそのための、薄く、明示入力だけを扱う境界です。

---

## 2. 参照・確認範囲

### 2.1 ローカル受領zip / file

本設計の基準は、今回ローカルで受領した次の材料です。

```text
/mnt/data/Cocolon_前提資料(297).zip
/mnt/data/EmlisAIの実装済み資料(102).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_system_update_20260706(3).zip
/mnt/data/Cocolon(275).zip
/mnt/data/mashos-api(188).zip
/mnt/data/Cocolon_EmlisAI_P7_R54AHR_PostPNT_NextBoundarySelection_PreDesignMemo_20260707.md
```

GitHub接続確認は、Mash様指定により行いません。

### 2.2 必読前提・作業姿勢

本設計では、次を確認済み前提として扱います。

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/07_latest_snapshot_diff.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
```

固定する作業姿勢は次です。

```text
- 見ていないものを見たと言わない。
- 設計と実装を混同しない。
- 前提資料だけで理解したふりをせず、実ファイル・result memo・テスト記録も見る。
- all-lane target greenをcurrent laneへ変換しない。
- PNT R11のnext design candidateをDHR-OP05 execution permissionへ変換しない。
- P8問いシステムをP7内で実装しない。
- Emlis本体の読感不足を、問い候補で隠さない。
- public contract / DB / RN / response keyを指示なく変えない。
- raw body / comment_text / question_text / reviewer free text / local path / hash / stdout / stderr / traceback をresult memoへ持ち込まない。
```

### 2.3 直接接続する既存資料

```text
EmlisAIの実装済み資料/
  Cocolon_EmlisAI_P7_R54AHR_PostNCI_SelectedHandoffOrStopDecisionTriage_NextBoundarySelection_DetailedDesign_ImplementationOrder_20260707.md

mashos-api/ai/tests/
  R54_AHR_PostNCI_SelectedHandoffOrStopDecisionTriage_PNT_OP00_OP08_Result_20260707.md
  R54_AHR_PostNCI_SelectedHandoffOrStopDecisionTriage_PNT_R10_ResultMemoClosure_20260707.md
  R54_AHR_PostNCI_SelectedHandoffOrStopDecisionTriage_PNT_R11_NextWorkDecision_20260707.md
```

### 2.4 直接接続する既存実ファイル

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_20260707.py
  emlis_ai_p7_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_20260706.py
  emlis_ai_p7_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_20260705.py
  emlis_ai_p7_r54_ahr_post_dri_dhr_op04_manual_reintake_20260705.py
  emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py
```

---

## 3. 現在地の固定

### 3.1 確認済み

```text
- 現在PhaseはP7 Product Quality Runner / Long-run Product Gate継続。
- PNT-OP00〜PNT-OP08 / R7〜R11 result memo closureはローカル受領状態に存在する。
- PNT targetは122 passedとしてR10/R11および検討メモで記録されている。
- selected regressionは304 passedとしてR10/R11および検討メモで記録されている。
- compileallはpassedとしてR10/R11および検討メモで記録されている。
- PNT R11はsafe next work classを next_design_candidate_only_when_a_closed_PNT_OP08_material_selects_a_next_design_candidate_lane としている。
- PNT R11のcurrent execution allowanceはnone。
- PNT R11はDHR-OP05 lane時の次設計候補を示すが、DHR-OP05呼び出し許可とはしていない。
- P8 start / P8 question design / question_text materializationは成立していない。
- API / DB / RN / runtime / response key変更は成立していない。
- P7 complete / release allowedは成立していない。
```

### 3.2 未確認

```text
- full backend suite green。
- RN contract green。
- RN real-device modal verified。
- actual local-only human review execution completion。
- actual body-full packet generation。
- actual rows / question need observation rows creation。
- DHR-OP05 / DHR-OP06 / DHR-OP07 execution。
- DMD / R52 execution。
- 明示的な単一closed PNT-OP08 materialが、現時点でDHR-OP05 laneとして別ファイルに固定されていること。
- PCM helper / tests / result memoの存在。
```

### 3.3 書かれていない

```text
- PNT target greenをcurrent lane確定として扱ってよいとは書かれていない。
- PNT R11 decision tableを、1件のclosed selected materialとして扱ってよいとは書かれていない。
- DHR-OP05 design candidateをDHR-OP05 call permissionとして扱ってよいとは書かれていない。
- Post-PNTの次にP8 question designへ進んでよいとは書かれていない。
- PCMでjson/schemaファイルを作成しなければならないとは書かれていない。
```

### 3.4 推測禁止

```text
- all-lane test green = current lane確定、と読まない。
- R11 table = selected closed material、と読まない。
- next_design_document_allowed = downstream execution allowed、と読まない。
- DHR-OP05 lane candidate = DHR-OP05 builder call allowed、と読まない。
- question need material = P8 question_text materialization、と読まない。
- PNT closure = P7 complete / release ready、と読まない。
```

---

## 4. 設計スコープ

### 4.1 扱うこと

PCMで扱うのは、次です。

```text
- PCM-OP00〜PCM-OP08の薄いbody-free helper設計。
- explicit closed PNT-OP08 material intake。
- PNT-OP08 closed materialであることのcontract確認。
- all-lane decision table / target green / result memo summaryを単一laneとして扱わないguard。
- selected_pnt_lane_refの単一性確認。
- selected_post_nci_outcome_group_ref / selected_post_nci_next_boundary_ref / next_design_document_candidate_refの整合確認。
- next_design_candidate / wait_hold / stop の分類。
- DHR-OP05 lane時の次設計候補記録。
- retry/start / repair lane時の次設計候補記録。
- wait / unresolved / blocked時のhold / stop記録。
- body-free / no-touch / no-promotion / no-auto-execution guard。
- target tests / selected regression / compileall validation plan。
- result memo closure。
- json / schema案。ただし実ファイル化しない。
```

### 4.2 扱わないこと

PCMでは次を扱いません。

```text
- PNT helper default builderによるPNT-OP08 material生成。
- 全lane tableから現在laneを推定すること。
- DHR-OP05 call / builder call / preflight scan execution。
- DHR-OP06 / DHR-OP07 execution。
- DMD / R52 execution。
- actual review start。
- actual rows / question need observation rows creation。
- question_text / draft_question_text / answer_text creation。
- P8 question trigger / answer storage / plan guard implementation。
- API / DB / RN / runtime / response key変更。
- full backend / RN / real-device green claim。
- P5 final / P6 start / P8 start / P7 complete / release decision。
```

### 4.3 実装段階での候補ファイル

#### helper候補

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_20260707.py
```

#### test候補

```text
mashos-api/ai/tests/
  test_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_pcm_op00_op01_20260707.py
  test_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_pcm_op02_op03_20260707.py
  test_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_pcm_op04_op05_20260707.py
  test_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_pcm_op06_op07_20260707.py
  test_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_pcm_op08_result_20260707.py
```

#### result memo候補

```text
mashos-api/ai/tests/
  R54_AHR_PostPNT_ClosedMaterialNextBoundaryConfirmation_PCM_OP00_OP01_Result_20260707.md
  R54_AHR_PostPNT_ClosedMaterialNextBoundaryConfirmation_PCM_OP00_OP03_Result_20260707.md
  R54_AHR_PostPNT_ClosedMaterialNextBoundaryConfirmation_PCM_OP00_OP05_Result_20260707.md
  R54_AHR_PostPNT_ClosedMaterialNextBoundaryConfirmation_PCM_OP00_OP07_Result_20260707.md
  R54_AHR_PostPNT_ClosedMaterialNextBoundaryConfirmation_PCM_OP00_OP08_Result_20260707.md
  R54_AHR_PostPNT_ClosedMaterialNextBoundaryConfirmation_PCM_R7_TargetValidation_Result_20260707.md
  R54_AHR_PostPNT_ClosedMaterialNextBoundaryConfirmation_PCM_R8_SelectedRegression_Result_20260707.md
  R54_AHR_PostPNT_ClosedMaterialNextBoundaryConfirmation_PCM_R9_Compileall_Result_20260707.md
  R54_AHR_PostPNT_ClosedMaterialNextBoundaryConfirmation_PCM_R10_ResultMemoClosure_20260707.md
  R54_AHR_PostPNT_ClosedMaterialNextBoundaryConfirmation_PCM_R11_NextWorkDecision_20260707.md
```

#### schema file候補

実装段階では、まずPython内定数 + assert contractで開始します。schema実ファイル化は行いません。将来、schema実ファイル化が必要になった場合のみ、次を候補にします。

```text
mashos-api/ai/schemas/
  p7_r54_ahr_post_pnt_pcm_closed_pnt_op08_material_intake.bodyfree.schema.json
  p7_r54_ahr_post_pnt_pcm_single_lane_confirmation.bodyfree.schema.json
  p7_r54_ahr_post_pnt_pcm_next_work_class_selection.bodyfree.schema.json
  p7_r54_ahr_post_pnt_pcm_result_memo_closure.bodyfree.schema.json
```

---

## 5. 入力materialの定義

### 5.1 PCMが読むもの

PCMは、必ず **1件の明示closed PNT-OP08 material** を入力として受けます。

必須候補keyは次です。

```text
schema_version
operation_step_ref
body_free
pnt_op08_status_ref
pnt_op08_closed_bodyfree_stopped
selected_pnt_status_ref
selected_pnt_lane_ref
selected_post_nci_outcome_group_ref
selected_post_nci_next_boundary_ref
selected_post_nci_next_boundary_kind_ref
selected_post_nci_next_boundary_not_executed
selected_handoff_or_stop_ref
selected_handoff_or_stop_kind_ref
selected_handoff_or_stop_not_executed
next_design_document_candidate_ref
next_design_document_allowed
manual_wait_required
manual_stop_required
repair_design_candidate
target_test_result_status_ref
selected_regression_result_status_ref
compileall_result_status_ref
full_backend_suite_green_confirmed
rn_contract_green_confirmed
rn_real_device_modal_verified_claimed_here
dhr_op05_not_called
dhr_op06_not_called
dmd_r52_not_executed
p5_p6_p8_p7_release_not_started
p8_question_design_not_started
p8_question_implementation_not_started
api_db_rn_runtime_response_key_not_changed
```

### 5.2 PCMが読んではいけないもの

次は、PCMの単一closed materialとして扱いません。

```text
- PNT R11のdecision table全体。
- PNT-OP08 result memoのsix outcome closure summary全体。
- PNT target testの全lane fixture一覧。
- PNT helper default builder output。
- selected_pnt_lane_refが欠落したmaterial。
- selected_pnt_lane_refが複数あるmaterial。
- next_design_document_candidate_refだけがあり、laneがないmaterial。
- DHR-OP05文字列だけを含む説明文。
- raw evidence / body-full packet / reviewer text / question_textを含むmaterial。
```

この制限がPCMの中心です。PCMは「現在laneを作るhelper」ではなく、「渡されたclosed materialが何を選んでいるかを確認するhelper」です。

### 5.3 explicit input required

実装段階では、次を固定します。

```text
explicit_pnt_op08_closed_material_required: true
pnt_op08_default_builder_call_allowed: false
pnt_op08_default_material_synthesis_allowed: false
pnt_op08_decision_table_as_single_lane_allowed: false
pnt_op08_test_fixture_generation_allowed_only_inside_tests: true
```

tests内では、各laneのfixtureを作るためにPNT helperやfixture builderを参照してよい可能性があります。ただし、PCM helper本体は、入力がない場合にPNT builderを呼んでmaterialを作ってはいけません。

### 5.4 body-free safe refs only

PCMでは、body-free safe refsだけを扱います。拒否する代表key / tokenは次です。

```text
raw_input
raw_answer
raw_evidence
body
body_full_packet
comment_text
reviewer_comment
reviewer_free_text
question_text
draft_question_text
answer_text
local_path
absolute_path
hash
sha256
stdout
stderr
traceback
api_changed
db_changed
rn_changed
runtime_changed
response_key_changed
p8_question_design_started
p8_question_implementation_started
dhr_op05_called_here
dhr_op05_builder_called_here
dhr_op06_called_here
dhr_op07_materialized_here
dmd_execution_started_here
r52_actual_execution_started_here
actual_review_started_here
release_allowed
p8_start_allowed
p7_complete
```

---

## 6. lane分類と次作業class

PCMで許可するlaneは、PNTで固定された6系統に限定します。

| selected_pnt_lane_ref | selected_post_nci_outcome_group_ref | PCM next work class | 記録してよい次候補 | 実行禁止 |
|---|---|---|---|---|
| `dhr_op05_manual_handoff_boundary_design_candidate` | `next_design_candidate` | `next_design_candidate` | `P7-R54-AHR Post-NCI DHR-OP05 Manual Handoff Boundary / Preflight Re-entry Design Candidate` | DHR-OP05 call / builder call |
| `retry_or_start_actual_local_only_review_route_candidate` | `next_design_candidate` | `next_design_candidate` | `P7-R54-AHR Post-NCI Actual Local-Only Review Retry/Start Boundary Selection Candidate` | actual review start |
| `wait_external_bodyfree_claim_reintake_candidate` | `wait_hold` | `wait_hold` | hold / wait only | raw evidence request |
| `repair_rdb_candidate_or_upstream_result_candidate` | `next_design_candidate` | `next_design_candidate` | `P7-R54-AHR Post-NCI RDB/Upstream Result Repair Boundary Candidate` | repair execution |
| `manual_hold_unresolved_post_rdb08_candidate` | `stop` | `stop` | no next design promotion | promotion |
| `blocked_bodyfree_leak_promotion_or_autorun_candidate` | `stop` | `stop` | no next design promotion | body leak / autorun / promotion |

### 6.1 DHR-OP05 laneの扱い

DHR-OP05 laneで言ってよいことは次です。

```text
- 明示closed PNT-OP08 materialがDHR-OP05 design candidate laneを選んでいる。
- 次の設計書候補は DHR-OP05 Manual Handoff Boundary / Preflight Re-entry Design Candidate である。
- DHR-OP05へ進む前の設計を作る材料として扱える。
```

DHR-OP05 laneで言ってはいけないことは次です。

```text
- DHR-OP05を実行する。
- DHR-OP05 builderを呼ぶ。
- DHR-OP06へ進む。
- DMD / R52 / actual reviewへ進む。
- P8へ進む。
- P7 complete / release ready。
```

### 6.2 DHR-OP05以外のlaneの扱い

```text
retry/start:
  retry/start boundary design candidateとして記録する。
  actual reviewは開始しない。

wait external body-free claim:
  wait_holdとして閉じる。
  raw evidence、body-full packet、local path、hashを要求しない。

repair:
  repair boundary design candidateとして記録する。
  repairは実行しない。

manual hold unresolved:
  stopとして閉じる。
  次設計へpromoteしない。

blocked:
  stopとして閉じる。
  body-free leak / promotion / autorun claimを含む処理へ進めない。
```

---

## 7. PCM-OP00〜OP08 詳細設計

### PCM-OP00: scope / explicit closed material / no-execution refreeze

#### 目的

Post-PNTのclosed material確認境界であることを宣言し、PCMが実行境界ではないことを固定します。

#### 入力

```text
review_session_id: optional safe id
```

#### 出力主要refs

```text
schema_version
operation_step_ref = PCM-OP00_scope_explicit_closed_material_no_execution_refreeze_after_PNT_OP08
pcm_scope_refrozen = true
explicit_pnt_op08_closed_material_required = true
pnt_op08_default_builder_call_allowed = false
pnt_op08_default_material_synthesis_allowed = false
pnt_op08_decision_table_as_single_lane_allowed = false
selected_post_nci_next_boundary_execution_allowed_here = false
dhr_op05_call_allowed_here = false
p8_question_design_allowed_here = false
api_db_rn_response_key_change_allowed_here = false
next_required_step = PCM-OP01
body_free = true
```

#### forbidden

```text
- PNT-OP08 materialを合成しない。
- PNT R11 tableを単一lane扱いしない。
- DHR-OP05 / P8 / releaseを開始しない。
- API / DB / RN / response key変更を含めない。
```

#### target test観点

```text
- OP00がscope / explicit closed material required / no-executionを固定する。
- OP00がPNT-OP08 builderを呼ばない。
- OP00がdecision table single-lane扱いを禁止する。
- OP00がpublic contract mutationを拒否する。
```

---

### PCM-OP01: explicit closed PNT-OP08 material intake

#### 目的

明示的に渡されたclosed PNT-OP08 materialをbody-freeに取り込みます。この段階では、next work classをまだ確定しません。

#### 入力

```text
pnt_op08_bodyfree_result_memo_closure_material: explicit Mapping
```

#### 分岐

```text
valid closed PNT-OP08 material present:
  PCM_STATUS_PNT_OP08_CLOSED_MATERIAL_INTAKE_READY_FOR_CONTRACT_VALIDATION
  next_required_step = PCM-OP02

missing PNT-OP08 material:
  PCM_STATUS_WAITING_FOR_EXPLICIT_PNT_OP08_CLOSED_MATERIAL
  next_required_step = wait_for_explicit_pnt_op08_closed_material

PNT-OP08 not closed:
  PCM_STATUS_WAITING_FOR_PNT_OP08_TO_CLOSE
  next_required_step = wait_for_pnt_op08_closure_before_post_pnt_confirmation

PNT-OP08 repair / invalid:
  PCM_STATUS_REPAIR_REQUIRED_FOR_PNT_OP08_CLOSED_MATERIAL
  next_required_step = repair_pnt_op08_material_without_downstream_promotion

PNT-OP08 blocked / forbidden payload / promotion claim:
  PCM_STATUS_BLOCKED_PNT_OP08_BODYFREE_LEAK_PROMOTION_OR_AUTORUN
  next_required_step = blocked_post_pnt_confirmation_due_to_pnt_op08_block
```

#### 必須検査

```text
- operation_step_refがPNT-OP08 closureである。
- pnt_op08_status_refがclosed stopped系である。
- body_free == true。
- selected_post_nci_next_boundary_not_executed == true。
- selected_handoff_or_stop_not_executed == true。
- dhr_op05_not_called == true。
- dhr_op06_not_called == true。
- dmd_r52_not_executed == true。
- p8_question_design_not_started == true。
- api_db_rn_runtime_response_key_not_changed == true。
- forbidden payload / no-touch mutation / promotion claimがない。
```

#### target test観点

```text
- explicit closed PNT-OP08 materialを受け、OP02 readyになる。
- missing materialならwaiting。
- non-closed PNT materialならwaitingまたはrepair。
- body-like / question_text / raw evidence keyを含む入力をblockedする。
- OP01はnext work classをまだ確定しない。
```

---

### PCM-OP02: closed material contract validation

#### 目的

OP01で取り込んだmaterialが、PNT-OP08 closureとして扱えるcontractを満たしているか確認します。

#### 検査対象

```text
pnt_op08_status_ref
selected_pnt_status_ref
selected_pnt_lane_ref
selected_post_nci_outcome_group_ref
selected_post_nci_next_boundary_ref
selected_post_nci_next_boundary_kind_ref
selected_post_nci_next_boundary_not_executed
selected_handoff_or_stop_ref
selected_handoff_or_stop_kind_ref
selected_handoff_or_stop_not_executed
next_design_document_candidate_ref
next_design_document_allowed
manual_wait_required
manual_stop_required
repair_design_candidate
```

#### 分岐

```text
contract valid:
  PCM_STATUS_CLOSED_PNT_OP08_MATERIAL_CONTRACT_VALID_STOPPED
  next_required_step = PCM-OP03

missing / unknown selected_pnt_lane_ref:
  PCM_STATUS_REPAIR_REQUIRED_FOR_CLOSED_PNT_OP08_MATERIAL_CONTRACT
  next_required_step = repair_closed_pnt_op08_material_contract_without_promotion

not_executed false / promotion claim / body leak:
  PCM_STATUS_BLOCKED_CLOSED_PNT_OP08_MATERIAL_LEAK_PROMOTION_OR_AUTORUN
  next_required_step = blocked_closed_pnt_op08_material_leak_promotion_or_autorun
```

#### target test観点

```text
- 全6laneのclosed material contractをvalidにする。
- selected_pnt_lane_ref missingをrepairにする。
- unknown lane / unknown outcome groupをrepairにする。
- selected_post_nci_next_boundary_not_executed != trueをblockedにする。
- selected_handoff_or_stop_not_executed != trueをblockedにする。
- DHR/P8/release/API/DB/RN mutation claimをblockedする。
```

---

### PCM-OP03: single selected lane confirmation

#### 目的

materialが「1件のclosed selection」であり、decision tableやall-lane summaryではないことを確認します。

#### 単一lane条件

```text
- selected_pnt_lane_ref が1つだけ存在する。
- selected_post_nci_outcome_group_ref が1つだけ存在する。
- selected_post_nci_next_boundary_ref が1つだけ存在する。
- next_design_document_candidate_ref はlaneと整合する。
- 6 lane flagを使う場合、trueは最大1つ。
- all_outcomes / decision_table / six_outcome_summary / supported_outcomes のような多lane materialを単一lane扱いしない。
```

#### status

```text
PCM_STATUS_SINGLE_SELECTED_PNT_LANE_CONFIRMED_STOPPED
PCM_STATUS_WAITING_FOR_SINGLE_SELECTED_PNT_LANE_MATERIAL
PCM_STATUS_REPAIR_REQUIRED_FOR_MULTI_OR_AMBIGUOUS_PNT_LANE_MATERIAL
PCM_STATUS_BLOCKED_SINGLE_LANE_CONFIRMATION_PROMOTION_OR_AUTORUN
```

#### target test観点

```text
- DHR-OP05 lane単体をsingle laneとして確認する。
- retry/start lane単体をsingle laneとして確認する。
- wait / repair / unresolved / blocked lane単体を確認する。
- PNT R11 decision table全体をambiguousとしてrepairまたはwaitingにする。
- six outcome summary全体をambiguousとしてrepairまたはwaitingにする。
- 複数lane trueをrepairにする。
```

---

### PCM-OP04: next work class resolver

#### 目的

OP03で確認された単一laneを、PCMのnext work classへ解決します。ここで作るのは実行指示ではなく、次設計候補、待機、停止のいずれかです。

#### next work class

```text
next_design_candidate:
  DHR-OP05 manual handoff boundary preflight design candidate
  retry/start route boundary design candidate
  repair boundary design candidate

wait_hold:
  wait external body-free claim

stop:
  manual hold unresolved
  blocked
```

#### 出力主要refs

```text
selected_pcm_status_ref
selected_pcm_lane_ref
selected_pcm_next_work_class_ref
selected_pcm_next_boundary_ref
selected_pcm_next_boundary_kind_ref
selected_pcm_next_boundary_not_executed = true
next_design_document_candidate_ref
next_design_document_allowed
manual_wait_required
manual_stop_required
repair_design_candidate
execution_allowed_here = false
```

#### target test観点

```text
- DHR-OP05 laneをnext_design_candidateへ解決する。
- retry/start laneをnext_design_candidateへ解決する。
- repair laneをnext_design_candidateへ解決する。
- wait laneをwait_holdへ解決する。
- unresolved / blockedをstopへ解決する。
- いずれのlaneでもexecution_allowed_hereをfalseにする。
```

---

### PCM-OP05: next design candidate envelope materialization

#### 目的

OP04のnext work classを、body-freeな次設計候補envelope、待機envelope、停止envelopeとして記録します。

#### 分類別material

```text
DHR-OP05 design candidate:
  selected_pcm_next_boundary_ref = prepare_post_pnt_dhr_op05_manual_handoff_boundary_preflight_design_without_call
  next_design_document_candidate_ref = P7-R54-AHR Post-NCI DHR-OP05 Manual Handoff Boundary / Preflight Re-entry Design Candidate
  next_design_document_allowed = true
  dhr_op05_call_allowed_here = false
  dhr_op05_builder_call_allowed_here = false

retry/start candidate:
  selected_pcm_next_boundary_ref = prepare_post_pnt_actual_local_only_review_retry_start_boundary_design_without_execution
  next_design_document_candidate_ref = P7-R54-AHR Post-NCI Actual Local-Only Review Retry/Start Boundary Selection Candidate
  next_design_document_allowed = true
  actual_review_start_allowed_here = false

repair candidate:
  selected_pcm_next_boundary_ref = prepare_post_pnt_rdb_or_upstream_repair_boundary_design_without_execution
  next_design_document_candidate_ref = P7-R54-AHR Post-NCI RDB/Upstream Result Repair Boundary Candidate
  next_design_document_allowed = true
  repair_execution_allowed_here = false

wait external claim:
  selected_pcm_next_boundary_ref = hold_for_external_bodyfree_claim_reintake_without_raw_evidence
  next_design_document_allowed = false
  manual_wait_required = true
  raw_evidence_request_allowed_here = false

unresolved hold:
  selected_pcm_next_boundary_ref = stop_manual_hold_unresolved_without_next_design_promotion
  next_design_document_allowed = false
  manual_stop_required = true

blocked:
  selected_pcm_next_boundary_ref = stop_blocked_bodyfree_leak_promotion_or_autorun_without_next_design_promotion
  next_design_document_allowed = false
  manual_stop_required = true
```

#### target test観点

```text
- DHR-OP05 laneでDHR-OP05設計候補を作るがDHR-OP05を呼ばない。
- retry/start laneでretry/start設計候補を作るがactual reviewを開始しない。
- repair laneでrepair設計候補を作るがrepairを実行しない。
- wait laneでholdを作るがraw evidenceを要求しない。
- unresolved/blocked laneでstopを作る。
- OP05 outputをP8 question design candidateに変換しない。
```

---

### PCM-OP06: body-free / no-touch / no-promotion / no-auto-execution guard

#### 目的

PCM-OP00〜OP05と入力closed PNT-OP08 materialが、body-free / no-touch / no-promotion / no-auto-executionを維持しているか検査します。

#### guardで必ずfalseにするもの

```text
pnt_op08_builder_called_here
pnt_op08_material_synthesized_here
selected_post_nci_next_boundary_executed_here
selected_pcm_next_boundary_executed_here
dhr_op05_called_here
dhr_op05_builder_called_here
dhr_op06_called_here
dhr_op07_materialized_here
dmd_execution_started_here
r52_actual_execution_started_here
actual_review_started_here
actual_body_full_packet_generated_here
actual_rows_created_here
actual_question_need_observation_rows_created_here
actual_disposal_or_purge_executed_here
p8_start_allowed
p8_question_design_started
p8_question_implementation_started
question_text_materialized
api_changed
db_changed
rn_changed
runtime_changed
response_key_changed
p7_complete
release_allowed
```

#### status

```text
PCM_STATUS_BODYFREE_NO_TOUCH_NO_PROMOTION_NO_AUTO_EXECUTION_GUARD_PASSED
PCM_STATUS_REPAIR_REQUIRED_FOR_BODYFREE_NO_TOUCH_NO_PROMOTION_GUARD_INPUTS
PCM_STATUS_BLOCKED_BODYFREE_NO_TOUCH_NO_PROMOTION_NO_AUTO_EXECUTION_GUARD
```

#### target test観点

```text
- all valid laneでguard passする。
- PNT builder call / material synthesis claimをblockedする。
- DHR-OP05 / DHR-OP06 / DMD / R52 / P8 / release promotion flagをblockedする。
- API / DB / RN / response key changed tokenをblockedする。
- body-like / question_text / raw evidence / local path / hash / stdout tokenをblockedする。
```

---

### PCM-OP07: validation plan / result memo draft material

#### 目的

PCM target tests、selected regression、compileallの計画refsを記録し、OP08 closureへ渡すbody-free result memo draftを作ります。OP07はテストを実行しません。実装時に外部コマンドで実行した結果をresult memoへ記録します。

#### 出力主要refs

```text
pcm_op07_status_ref
post_pnt_closed_material_confirmation_result_memo_draft_ref
post_pnt_closed_material_confirmation_result_memo_draft_bodyfree = true
selected_pcm_next_work_class_ref
selected_pcm_next_boundary_ref
selected_pcm_next_boundary_not_executed
next_design_document_candidate_ref
next_design_document_allowed
manual_wait_required
manual_stop_required
validation_command_summary_refs
pcm_op07_ready_for_op08
```

#### status

```text
PCM_STATUS_RESULT_MEMO_DRAFT_MATERIALIZED_STOPPED
PCM_STATUS_WAIT_OR_STOP_RESULT_MEMO_DRAFT_MATERIALIZED_STOPPED
PCM_STATUS_REPAIR_REQUIRED_FOR_RESULT_MEMO_DRAFT_INPUTS
PCM_STATUS_BLOCKED_RESULT_MEMO_DRAFT_BODYFREE_LEAK_PROMOTION_OR_AUTORUN
```

#### target test観点

```text
- OP07 creates result memo draft for all valid outcomes without execution。
- OP07 records validation plan refs without running pytest/compileall internally。
- OP07 creates wait/stop draft for wait/unresolved/blocked lanes。
- OP07 stops when OP06 guard invalid。
- OP07 does not materialize P8 question design spec。
```

---

### PCM-OP08: body-free result memo closure with next design candidate / hold / stop

#### 目的

PCM-OP00〜OP07をbody-free result memoとして閉じ、最終的な `selected_pcm_next_boundary_ref` と `selected_pcm_next_work_class_ref` を記録して停止します。

#### status

```text
PCM_OP08_BODYFREE_POST_PNT_CLOSED_MATERIAL_CONFIRMATION_CLOSED_STOPPED
PCM_OP08_WAITING_FOR_EXPLICIT_PNT_OP08_CLOSED_MATERIAL
PCM_OP08_REPAIR_REQUIRED_FOR_POST_PNT_CONFIRMATION_INPUTS
PCM_OP08_BLOCKED_BODYFREE_LEAK_PROMOTION_OR_AUTORUN
```

#### 出力主要refs

```text
schema_version
operation_step_ref = PCM-OP08_bodyfree_post_pnt_closed_material_next_boundary_confirmation_closure
pcm_op08_status_ref
selected_pnt_lane_ref
selected_post_nci_outcome_group_ref
selected_post_nci_next_boundary_ref
selected_post_nci_next_boundary_not_executed
selected_pcm_next_work_class_ref
selected_pcm_next_boundary_ref
selected_pcm_next_boundary_kind_ref
selected_pcm_next_boundary_not_executed
next_design_document_candidate_ref
next_design_document_allowed
manual_wait_required
manual_stop_required
repair_design_candidate
target_test_result_status_ref
selected_regression_result_status_ref
compileall_result_status_ref
full_backend_suite_green_confirmed = false
rn_contract_green_confirmed = false
rn_real_device_modal_verified_claimed_here = false
pnt_op08_builder_not_called = true
pnt_op08_material_not_synthesized = true
dhr_op05_not_called = true
dhr_op06_not_called = true
dmd_r52_not_executed = true
actual_review_not_started = true
p5_p6_p8_p7_release_not_started = true
p8_question_design_not_started = true
p8_question_implementation_not_started = true
api_db_rn_runtime_response_key_not_changed = true
body_free = true
```

#### 完了時の意味

```text
PCM-OP08 records the next design candidate, wait hold, or stop outcome from one explicit closed PNT-OP08 material.
It does not execute the selected boundary.
It does not call DHR-OP05.
It does not start downstream builders.
```

#### target test観点

```text
- OP08 closes DHR-OP05 / retry-start / repair next_design_candidate outcomes body-free。
- OP08 closes wait_hold / stop outcomes body-free。
- OP08 records selected_pcm_next_boundary_ref but does not execute it。
- OP08 rejects PNT builder call / material synthesis claim。
- OP08 rejects DHR-OP05 call claim。
- OP08 rejects P8 question design/start claim。
- OP08 rejects release/full backend/RN green claim mutation。
- OP08 waits when explicit PNT-OP08 material is missing。
- OP08 repairs ambiguous/multi-lane material。
- OP08 blocks body-like result memo / promotion claim。
```

---

## 8. 実装順

実装段階に入る場合の推奨順は次です。ここでは実装を行いません。

### R0: 作業前固定

```text
- GitHub接続確認は不要 / 未実施のまま固定。
- 対象はP7継続、P8未開始、DHR-OP05未実行で固定。
- 変更対象は新規helper / 新規tests / 新規result memoに限定する。
- API / DB / RN / runtime / response keyはno-touch。
- PCM helperはexplicit closed PNT-OP08 material requiredにする。
- PCM helperはPNT-OP08 materialを合成しない。
```

### R1: helper skeleton / constants

```text
- emlis_ai_p7_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_20260707.py を追加する。
- PCM prefix / schema_version / operation_step_ref / allowed status / allowed lane / forbidden tokenを定義する。
- 既存PNT moduleから参照するのは、必要なpublic constants / assert contract中心にする。
- PCM helper本体ではPNT-OP08 builderを無入力で呼ばない。
- all-lane decision tableをsingle closed materialとして扱わないguardをconstantsに含める。
```

### R2: PCM-OP00 / OP01 実装 + tests

```text
- OP00: scope / explicit closed material / no-execution refreeze。
- OP01: explicit closed PNT-OP08 material intake。
- tests: missing input waiting、valid closure intake、non-closed PNT material waiting/repair、body leak block、PNT builder non-call。
- result memo: PCM_OP00_OP01。
```

### R3: PCM-OP02 / OP03 実装 + tests

```text
- OP02: closed PNT-OP08 material contract validation。
- OP03: single selected lane confirmation。
- tests: 6 lane contract valid、missing lane repair、unknown lane repair、multi-lane table ambiguous、six outcome summary ambiguous、not_executed false block。
- result memo: PCM_OP00_OP03。
```

### R4: PCM-OP04 / OP05 実装 + tests

```text
- OP04: next work class resolver。
- OP05: next design candidate / hold / stop envelope materialization。
- tests: DHR-OP05 design candidate、retry/start candidate、repair candidate、wait hold、unresolved stop、blocked stop。
- tests: DHR/P8/release/API/DB/RN/body payload block。
- result memo: PCM_OP00_OP05。
```

### R5: PCM-OP06 / OP07 実装 + tests

```text
- OP06: body-free / no-touch / no-promotion / no-auto-execution guard。
- OP07: validation plan / result memo draft material。
- tests: guard pass for valid outcomes、promotion block、validation refs recorded、no full backend/RN/real-device claim、draft ready/wait/stop/repair/block branches。
- result memo: PCM_OP00_OP07。
```

### R6: PCM-OP08 実装 + tests

```text
- OP08: body-free result memo closure with next design candidate / hold / stop。
- tests: all outcomes closure、selected_pcm_next_boundary_not_executed、missing input wait、ambiguous multi-lane repair、promotion mutation rejection、full-title alias。
- result memo: PCM_OP00_OP08。
```

### R7: target validation

```bash
cd mashos-api/ai

PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference pytest -q --assert=plain \
  tests/test_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_pcm_op00_op01_20260707.py \
  tests/test_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_pcm_op02_op03_20260707.py \
  tests/test_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_pcm_op04_op05_20260707.py \
  tests/test_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_pcm_op06_op07_20260707.py \
  tests/test_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_pcm_op08_result_20260707.py \
  -p no:cacheprovider
```

結果は実装段階で記録します。設計段階ではpass数を主張しません。

### R8: selected regression

```bash
cd mashos-api/ai

PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference pytest -q --assert=plain \
  tests/test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op00_op01_20260707.py \
  tests/test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op02_op03_20260707.py \
  tests/test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op04_op05_20260707.py \
  tests/test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op06_op07_20260707.py \
  tests/test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op08_result_20260707.py \
  tests/test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op00_op01_20260706.py \
  tests/test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op02_op03_20260706.py \
  tests/test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op04_op05_20260706.py \
  tests/test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op06_op07_20260706.py \
  tests/test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op08_result_20260706.py \
  tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op00_op01_20260705.py \
  tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op02_op03_20260705.py \
  tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op04_op05_20260705.py \
  tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op06_op07_20260705.py \
  tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op08_result_20260705.py \
  tests/test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op06_op07_20260705.py \
  tests/test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op08_result_20260705.py \
  tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op04_op05_20260704.py \
  tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op06_op07_20260704.py \
  -p no:cacheprovider
```

結果は実装段階で記録します。既存のPNT 122 passed / selected regression 304 passedを、PCM実装後の結果として自動継承して主張しません。

### R9: compileall

```bash
cd mashos-api/ai

PYTHONPATH=services/ai_inference python -m compileall -q \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_20260707.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_20260707.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_20260706.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_20260705.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_dri_dhr_op04_manual_reintake_20260705.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py
```

### R10: result memo closure

```text
- PCM_OP00_OP08 result memoを作成する。
- 実行したtarget / selected regression / compileallだけを記録する。
- full backend suite green / RN contract green / RN real-device verifiedは、実行していなければfalse / not claimedにする。
- PNT material synthesis / DHR-OP05 / P8 / release非実行を明記する。
```

### R11: next work decision

PCM-OP08結果により、次のみに分けます。

```text
DHR-OP05 design candidate:
  次の設計書候補 = P7-R54-AHR Post-NCI DHR-OP05 Manual Handoff Boundary / Preflight Re-entry Design Candidate
  DHR-OP05実行はまだ不可。

retry/start candidate:
  次の設計書候補 = Actual Local-Only Review Retry/Start Boundary Selection Candidate
  actual review実行はまだ不可。

repair candidate:
  次の設計書候補 = RDB/Upstream Result Repair Boundary Candidate
  repair実行はまだ不可。

wait external claim:
  hold / wait。raw evidence requestなし。

unresolved / blocked:
  stop。次設計へpromoteしない。
```

---

## 9. 実装時の関数・定数命名案

### 9.1 step refs

```python
P7_R54_AHR_POST_PNT_PCM_OP00_STEP_REF = "PCM-OP00_scope_explicit_closed_material_no_execution_refreeze_after_PNT_OP08"
P7_R54_AHR_POST_PNT_PCM_OP01_STEP_REF = "PCM-OP01_explicit_closed_PNT_OP08_material_intake"
P7_R54_AHR_POST_PNT_PCM_OP02_STEP_REF = "PCM-OP02_closed_material_contract_validation"
P7_R54_AHR_POST_PNT_PCM_OP03_STEP_REF = "PCM-OP03_single_selected_lane_confirmation"
P7_R54_AHR_POST_PNT_PCM_OP04_STEP_REF = "PCM-OP04_next_work_class_resolver"
P7_R54_AHR_POST_PNT_PCM_OP05_STEP_REF = "PCM-OP05_next_design_candidate_envelope_materialization"
P7_R54_AHR_POST_PNT_PCM_OP06_STEP_REF = "PCM-OP06_bodyfree_no_touch_no_promotion_no_auto_execution_guard"
P7_R54_AHR_POST_PNT_PCM_OP07_STEP_REF = "PCM-OP07_validation_plan_result_memo_draft_material"
P7_R54_AHR_POST_PNT_PCM_OP08_STEP_REF = "PCM-OP08_bodyfree_post_pnt_closed_material_next_boundary_confirmation_closure"
```

### 9.2 builder / assert names

```python
build_p7_r54_ahr_post_pnt_pcm_op00_scope_explicit_closed_material_no_execution_refreeze_after_pnt_op08
assert_p7_r54_ahr_post_pnt_pcm_op00_scope_explicit_closed_material_no_execution_refreeze_after_pnt_op08_contract

build_p7_r54_ahr_post_pnt_pcm_op01_explicit_closed_pnt_op08_material_intake
assert_p7_r54_ahr_post_pnt_pcm_op01_explicit_closed_pnt_op08_material_intake_contract

build_p7_r54_ahr_post_pnt_pcm_op02_closed_material_contract_validation
assert_p7_r54_ahr_post_pnt_pcm_op02_closed_material_contract_validation_contract

build_p7_r54_ahr_post_pnt_pcm_op03_single_selected_lane_confirmation
assert_p7_r54_ahr_post_pnt_pcm_op03_single_selected_lane_confirmation_contract

build_p7_r54_ahr_post_pnt_pcm_op04_next_work_class_resolver
assert_p7_r54_ahr_post_pnt_pcm_op04_next_work_class_resolver_contract

build_p7_r54_ahr_post_pnt_pcm_op05_next_design_candidate_envelope_materialization
assert_p7_r54_ahr_post_pnt_pcm_op05_next_design_candidate_envelope_materialization_contract

build_p7_r54_ahr_post_pnt_pcm_op06_bodyfree_no_touch_no_promotion_no_auto_execution_guard
assert_p7_r54_ahr_post_pnt_pcm_op06_bodyfree_no_touch_no_promotion_no_auto_execution_guard_contract

build_p7_r54_ahr_post_pnt_pcm_op07_validation_plan_result_memo_draft_material
assert_p7_r54_ahr_post_pnt_pcm_op07_validation_plan_result_memo_draft_material_contract

build_p7_r54_ahr_post_pnt_pcm_op08_bodyfree_post_pnt_closed_material_next_boundary_confirmation_closure
assert_p7_r54_ahr_post_pnt_pcm_op08_bodyfree_post_pnt_closed_material_next_boundary_confirmation_closure_contract
```

### 9.3 full-title aliases

既存R54系のtest可読性に合わせて、full-title aliasを用意します。

```python
build_p7_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_pcm_op08_bodyfree_closure = (
    build_p7_r54_ahr_post_pnt_pcm_op08_bodyfree_post_pnt_closed_material_next_boundary_confirmation_closure
)

assert_p7_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_pcm_op08_bodyfree_closure_contract = (
    assert_p7_r54_ahr_post_pnt_pcm_op08_bodyfree_post_pnt_closed_material_next_boundary_confirmation_closure_contract
)
```

---

## 10. json / schema案

本章のjson/schemaは設計案です。実ファイル化は行いません。実装段階では、まずPython内定数 + assert contractで安全に閉じる方針を推奨します。

### 10.1 PCM-OP01 closed PNT-OP08 material intake schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_pnt.pcm.closed_pnt_op08_material_intake.bodyfree.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "body_free",
    "explicit_pnt_op08_closed_material_required",
    "pnt_op08_material_present",
    "pnt_op08_contract_valid",
    "pnt_op08_status_ref",
    "pnt_op08_closed_bodyfree_stopped",
    "selected_pnt_lane_ref_present",
    "selected_post_nci_next_boundary_not_executed_present",
    "pcm_op01_status_ref",
    "next_required_step"
  ],
  "properties": {
    "schema_version": {
      "const": "p7_r54_ahr_post_pnt_pcm_op01_closed_pnt_op08_material_intake.bodyfree.v1"
    },
    "operation_step_ref": {
      "const": "PCM-OP01_explicit_closed_PNT_OP08_material_intake"
    },
    "body_free": { "const": true },
    "explicit_pnt_op08_closed_material_required": { "const": true },
    "pnt_op08_default_builder_call_allowed": { "const": false },
    "pnt_op08_default_material_synthesis_allowed": { "const": false },
    "pnt_op08_decision_table_as_single_lane_allowed": { "const": false },
    "pnt_op08_material_present": { "type": "boolean" },
    "pnt_op08_contract_valid": { "type": "boolean" },
    "pnt_op08_status_ref": { "type": "string", "maxLength": 260 },
    "pnt_op08_closed_bodyfree_stopped": { "type": "boolean" },
    "selected_pnt_lane_ref_present": { "type": "boolean" },
    "selected_post_nci_next_boundary_not_executed_present": { "type": "boolean" },
    "pcm_op01_status_ref": {
      "enum": [
        "PCM_STATUS_PNT_OP08_CLOSED_MATERIAL_INTAKE_READY_FOR_CONTRACT_VALIDATION",
        "PCM_STATUS_WAITING_FOR_EXPLICIT_PNT_OP08_CLOSED_MATERIAL",
        "PCM_STATUS_WAITING_FOR_PNT_OP08_TO_CLOSE",
        "PCM_STATUS_REPAIR_REQUIRED_FOR_PNT_OP08_CLOSED_MATERIAL",
        "PCM_STATUS_BLOCKED_PNT_OP08_BODYFREE_LEAK_PROMOTION_OR_AUTORUN"
      ]
    },
    "next_required_step": { "type": "string", "maxLength": 360 }
  }
}
```

### 10.2 PCM-OP03 single lane confirmation schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_pnt.pcm.single_lane_confirmation.bodyfree.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "body_free",
    "selected_pnt_lane_ref",
    "selected_post_nci_outcome_group_ref",
    "selected_post_nci_next_boundary_ref",
    "single_lane_confirmed",
    "decision_table_material_rejected",
    "multi_lane_material_rejected",
    "pcm_op03_status_ref",
    "next_required_step"
  ],
  "properties": {
    "schema_version": {
      "const": "p7_r54_ahr_post_pnt_pcm_op03_single_lane_confirmation.bodyfree.v1"
    },
    "operation_step_ref": {
      "const": "PCM-OP03_single_selected_lane_confirmation"
    },
    "body_free": { "const": true },
    "selected_pnt_lane_ref": {
      "enum": [
        "dhr_op05_manual_handoff_boundary_design_candidate",
        "retry_or_start_actual_local_only_review_route_candidate",
        "wait_external_bodyfree_claim_reintake_candidate",
        "repair_rdb_candidate_or_upstream_result_candidate",
        "manual_hold_unresolved_post_rdb08_candidate",
        "blocked_bodyfree_leak_promotion_or_autorun_candidate"
      ]
    },
    "selected_post_nci_outcome_group_ref": {
      "enum": ["next_design_candidate", "wait_hold", "stop"]
    },
    "selected_post_nci_next_boundary_ref": { "type": "string", "maxLength": 420 },
    "single_lane_confirmed": { "type": "boolean" },
    "decision_table_material_rejected": { "type": "boolean" },
    "multi_lane_material_rejected": { "type": "boolean" },
    "pcm_op03_status_ref": {
      "enum": [
        "PCM_STATUS_SINGLE_SELECTED_PNT_LANE_CONFIRMED_STOPPED",
        "PCM_STATUS_WAITING_FOR_SINGLE_SELECTED_PNT_LANE_MATERIAL",
        "PCM_STATUS_REPAIR_REQUIRED_FOR_MULTI_OR_AMBIGUOUS_PNT_LANE_MATERIAL",
        "PCM_STATUS_BLOCKED_SINGLE_LANE_CONFIRMATION_PROMOTION_OR_AUTORUN"
      ]
    },
    "next_required_step": { "type": "string", "maxLength": 360 }
  }
}
```

### 10.3 PCM-OP05 next design candidate / hold / stop schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_pnt.pcm.next_work_class_selection.bodyfree.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "body_free",
    "selected_pcm_next_work_class_ref",
    "selected_pcm_next_boundary_ref",
    "selected_pcm_next_boundary_kind_ref",
    "selected_pcm_next_boundary_not_executed",
    "next_design_document_candidate_ref",
    "next_design_document_allowed",
    "manual_wait_required",
    "manual_stop_required",
    "repair_design_candidate",
    "execution_allowed_here",
    "pcm_op05_status_ref",
    "next_required_step"
  ],
  "properties": {
    "schema_version": {
      "const": "p7_r54_ahr_post_pnt_pcm_op05_next_design_candidate_envelope.bodyfree.v1"
    },
    "operation_step_ref": {
      "const": "PCM-OP05_next_design_candidate_envelope_materialization"
    },
    "body_free": { "const": true },
    "selected_pcm_next_work_class_ref": {
      "enum": ["next_design_candidate", "wait_hold", "stop"]
    },
    "selected_pcm_next_boundary_ref": { "type": "string", "maxLength": 420 },
    "selected_pcm_next_boundary_kind_ref": { "type": "string", "maxLength": 420 },
    "selected_pcm_next_boundary_not_executed": { "const": true },
    "next_design_document_candidate_ref": { "type": "string", "maxLength": 420 },
    "next_design_document_allowed": { "type": "boolean" },
    "manual_wait_required": { "type": "boolean" },
    "manual_stop_required": { "type": "boolean" },
    "repair_design_candidate": { "type": "boolean" },
    "execution_allowed_here": { "const": false },
    "dhr_op05_call_allowed_here": { "const": false },
    "actual_review_start_allowed_here": { "const": false },
    "repair_execution_allowed_here": { "const": false },
    "p8_question_design_allowed_here": { "const": false },
    "pcm_op05_status_ref": {
      "enum": [
        "PCM_STATUS_NEXT_DESIGN_CANDIDATE_ENVELOPE_MATERIALIZED_STOPPED",
        "PCM_STATUS_WAIT_HOLD_ENVELOPE_MATERIALIZED_STOPPED",
        "PCM_STATUS_STOP_ENVELOPE_MATERIALIZED_STOPPED",
        "PCM_STATUS_REPAIR_REQUIRED_FOR_NEXT_WORK_CLASS_INPUTS",
        "PCM_STATUS_BLOCKED_NEXT_WORK_CLASS_PROMOTION_AUTORUN"
      ]
    },
    "next_required_step": { "type": "string", "maxLength": 420 }
  }
}
```

### 10.4 PCM-OP08 closure schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_pnt.pcm.result_memo_closure.bodyfree.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "body_free",
    "pcm_op08_status_ref",
    "selected_pnt_lane_ref",
    "selected_post_nci_outcome_group_ref",
    "selected_post_nci_next_boundary_ref",
    "selected_post_nci_next_boundary_not_executed",
    "selected_pcm_next_work_class_ref",
    "selected_pcm_next_boundary_ref",
    "selected_pcm_next_boundary_not_executed",
    "next_design_document_candidate_ref",
    "next_design_document_allowed",
    "manual_wait_required",
    "manual_stop_required",
    "repair_design_candidate",
    "target_test_result_status_ref",
    "selected_regression_result_status_ref",
    "compileall_result_status_ref",
    "full_backend_suite_green_confirmed",
    "rn_contract_green_confirmed",
    "rn_real_device_modal_verified_claimed_here",
    "pnt_op08_builder_not_called",
    "pnt_op08_material_not_synthesized",
    "dhr_op05_not_called",
    "dhr_op06_not_called",
    "dmd_r52_not_executed",
    "actual_review_not_started",
    "p5_p6_p8_p7_release_not_started",
    "p8_question_design_not_started",
    "api_db_rn_runtime_response_key_not_changed",
    "next_required_step"
  ],
  "properties": {
    "schema_version": {
      "const": "p7_r54_ahr_post_pnt_pcm_op08_result_memo_closure.bodyfree.v1"
    },
    "operation_step_ref": {
      "const": "PCM-OP08_bodyfree_post_pnt_closed_material_next_boundary_confirmation_closure"
    },
    "body_free": { "const": true },
    "pcm_op08_status_ref": {
      "enum": [
        "PCM_OP08_BODYFREE_POST_PNT_CLOSED_MATERIAL_CONFIRMATION_CLOSED_STOPPED",
        "PCM_OP08_WAITING_FOR_EXPLICIT_PNT_OP08_CLOSED_MATERIAL",
        "PCM_OP08_REPAIR_REQUIRED_FOR_POST_PNT_CONFIRMATION_INPUTS",
        "PCM_OP08_BLOCKED_BODYFREE_LEAK_PROMOTION_OR_AUTORUN"
      ]
    },
    "selected_pnt_lane_ref": { "type": "string", "maxLength": 260 },
    "selected_post_nci_outcome_group_ref": {
      "enum": ["next_design_candidate", "wait_hold", "stop"]
    },
    "selected_post_nci_next_boundary_ref": { "type": "string", "maxLength": 420 },
    "selected_post_nci_next_boundary_not_executed": { "const": true },
    "selected_pcm_next_work_class_ref": {
      "enum": ["next_design_candidate", "wait_hold", "stop"]
    },
    "selected_pcm_next_boundary_ref": { "type": "string", "maxLength": 420 },
    "selected_pcm_next_boundary_not_executed": { "const": true },
    "next_design_document_candidate_ref": { "type": "string", "maxLength": 420 },
    "next_design_document_allowed": { "type": "boolean" },
    "manual_wait_required": { "type": "boolean" },
    "manual_stop_required": { "type": "boolean" },
    "repair_design_candidate": { "type": "boolean" },
    "target_test_result_status_ref": { "type": "string", "maxLength": 80 },
    "selected_regression_result_status_ref": { "type": "string", "maxLength": 80 },
    "compileall_result_status_ref": { "type": "string", "maxLength": 80 },
    "full_backend_suite_green_confirmed": { "const": false },
    "rn_contract_green_confirmed": { "const": false },
    "rn_real_device_modal_verified_claimed_here": { "const": false },
    "pnt_op08_builder_not_called": { "const": true },
    "pnt_op08_material_not_synthesized": { "const": true },
    "dhr_op05_not_called": { "const": true },
    "dhr_op06_not_called": { "const": true },
    "dmd_r52_not_executed": { "const": true },
    "actual_review_not_started": { "const": true },
    "p5_p6_p8_p7_release_not_started": { "const": true },
    "p8_question_design_not_started": { "const": true },
    "api_db_rn_runtime_response_key_not_changed": { "const": true },
    "next_required_step": { "type": "string", "maxLength": 420 }
  }
}
```

---

## 11. validation plan案

### 11.1 PCM-OP00 / OP01 tests

```text
- OP00 refreeze normal。
- OP00 requires explicit closed PNT-OP08 material。
- OP00 does not call PNT-OP08 default builder。
- OP00 rejects PNT R11 decision table as a single lane。
- OP00 rejects public contract mutation。
- OP01 accepts valid explicit closed PNT-OP08 material without downstream execution。
- OP01 waits when PNT-OP08 material is missing。
- OP01 waits/repairs when PNT-OP08 material is not closed。
- OP01 blocks body-like/promotion/no-touch claims。
- OP01 does not classify next work class yet。
```

### 11.2 PCM-OP02 / OP03 tests

```text
- OP02 validates all allowed selected_pnt_lane_ref values。
- OP02 rejects missing selected_pnt_lane_ref。
- OP02 rejects unknown selected_pnt_lane_ref。
- OP02 rejects selected_post_nci_next_boundary_not_executed != true。
- OP02 rejects selected_handoff_or_stop_not_executed != true。
- OP03 confirms DHR-OP05 lane as single selected lane。
- OP03 confirms retry/start / wait / repair / unresolved / blocked lanes as single selected lane。
- OP03 rejects six outcome summary as ambiguous。
- OP03 rejects decision table material as ambiguous。
- OP03 rejects multiple lane flags true。
```

### 11.3 PCM-OP04 / OP05 tests

```text
- OP04 resolves DHR-OP05 lane to next_design_candidate。
- OP04 resolves retry/start lane to next_design_candidate。
- OP04 resolves repair lane to next_design_candidate。
- OP04 resolves wait lane to wait_hold。
- OP04 resolves unresolved / blocked lanes to stop。
- OP05 materializes DHR-OP05 design candidate without call。
- OP05 materializes retry/start design candidate without actual review start。
- OP05 materializes repair design candidate without repair execution。
- OP05 materializes wait hold without raw evidence request。
- OP05 materializes stop without next design promotion。
```

### 11.4 PCM-OP06 / OP07 tests

```text
- OP06 passes bodyfree/no-touch/no-promotion guard for all valid outcomes。
- OP06 blocks PNT builder call / material synthesis claims。
- OP06 blocks DHR/P8/release promotion flags。
- OP06 blocks API/DB/RN/response key changed tokens。
- OP06 blocks body-like / question_text / raw evidence / local path / hash / stdout tokens。
- OP07 records target tests / selected regression / compileall refs。
- OP07 does not claim full backend / RN / real-device green。
- OP07 creates result memo draft for next_design_candidate / wait_hold / stop without execution。
```

### 11.5 PCM-OP08 tests

```text
- OP08 closes DHR-OP05 next design candidate body-free。
- OP08 closes retry/start next design candidate body-free。
- OP08 closes repair next design candidate body-free。
- OP08 closes wait hold body-free。
- OP08 closes unresolved / blocked stop body-free。
- OP08 records selected_pcm_next_boundary_ref but does not execute it。
- OP08 rejects PNT builder call / material synthesis claim。
- OP08 rejects DHR-OP05 call claim。
- OP08 rejects P8 question design/start claim。
- OP08 rejects release/full backend/RN green claim mutation。
- OP08 waits when explicit PNT-OP08 material is missing。
- OP08 repairs ambiguous/multi-lane material。
- OP08 blocks body-like result memo / promotion claim。
- OP08 full-title aliases match short builders/asserts。
```

### 11.6 検証結果の読み方

PCM target / selected regression / compileallがgreenになっても、言えるのは次までです。

```text
PCM helper / target tests / selected regression / compileallが、Post-PNT closed material confirmation contractを満たした。
```

言ってはいけないことは次です。

```text
full backend suite green
RN contract green
RN real-device modal verified
actual review execution
actual rows creation
DHR-OP05 execution
P8 question design started
P5 final
P6 start
P8 start
P7 complete
release ready
```

---

## 12. 完了条件

実装段階でPCMを完了扱いにできる条件は次です。

```text
- PCM-OP00〜OP08 helper / assert contractが存在する。
- PCM-OP01が explicit closed PNT-OP08 material required を守り、無入力PNT builderを呼ばない。
- PCM-OP03がsingle selected lane確認を行い、decision table / six outcome summaryをcurrent laneとして扱わない。
- selected_pnt_lane_refを、next_design_candidate / wait_hold / stopへ分類できる。
- どの分類でも、下流builderを呼ばない。
- DHR-OP05 / actual review / repair / P8 question design / releaseを開始しない。
- API / DB / RN / runtime / response keyを変更しない。
- result memoに、次設計候補・待機・停止候補だけをbody-freeで記録する。
- target testsが実行され、結果がresult memoへ記録されている。
- selected regressionが実行され、結果がresult memoへ記録されている。
- compileallが実行され、結果がresult memoへ記録されている。
- full backend / RN / real-device / release claimをしない。
```

---

## 13. rollback / fail-closed条件

### 13.1 fail-closed条件

次を検出した場合、PCMはfail-closedにします。

```text
- explicit closed PNT-OP08 materialがない。
- PNT-OP08 statusがclosedではない。
- selected_pnt_lane_refがmissing。
- selected_pnt_lane_refが複数ある。
- decision table / six outcome summaryを単一laneとして渡している。
- selected_post_nci_next_boundary_not_executed != true。
- selected_handoff_or_stop_not_executed != true。
- next_design_document_allowedとoutcome groupが矛盾している。
- forbidden body payload / question_text / raw answer / comment_text / local path / hash / stdout / stderr / tracebackを含む。
- DHR-OP05 / DHR-OP06 / DMD / R52 / actual review / P8 / release promotion claimを含む。
- API / DB / RN / response key変更が混入する。
- PNT-OP08 helper default materialをPCM helper本体が無入力生成している。
```

### 13.2 rollback方針

実装段階でPCMに問題が出た場合のrollbackは次です。

```text
- 新規PCM helper / PCM tests / PCM result memoのみを取り下げる。
- 既存PNT / NCI / RDB / MRB / DHR helperへ影響を出さない。
- API / DB / RN / response keyに触っていないため、runtime rollbackは不要であるべき。
- PCMが止まった場合、PNT R11 decision boundary時点へ戻す。
```

---

## 14. DHR-OP05との境界

PCMでDHR-OP05 laneが確認された場合でも、DHR-OP05を実行しません。

許可される次段階は、最大でも次です。

```text
P7-R54-AHR Post-NCI DHR-OP05 Manual Handoff Boundary
/ Preflight Re-entry Design Candidate
```

この段階も、まず設計書です。DHR-OP05 builder call / scan / DHR-OP06以降実行は、その設計内で明示的に許可条件を定義し、Mash様の実装指示が出た場合にだけ検討します。

PCMからDHR-OP05へ直行しない理由は次です。

```text
- PNT R11のcurrent execution allowanceはnone。
- PNT R11はcurrent laneをall-lane greenから確定していない。
- PCMはclosed material確認境界であり、DHR-OP05実行境界ではない。
- DHR-OP05 candidateは、実行許可ではなく設計候補である。
```

---

## 15. P8問いシステムとの境界

問いシステムはCocolonにとって重要です。ですが、PCMはP8問いシステム詳細設計ではありません。

PCMで守ることは次です。

```text
- P8問いUXへ進む許可を出さない。
- question_text / draft_question_text / answer_textを作らない。
- question trigger / answer storage / plan guardを作らない。
- question need observation materialをP8 question specificationへ昇格しない。
- 問い候補を、Emlis本体の読感不足を隠す免罪符にしない。
```

PCMがP8に対して持つ意味は、次だけです。

```text
P8へ雑に進まないための境界。
P7のbody-free材料とP8設計開始を混同しないための停止線。
```

---

## 16. 華恋の意見

私は、今回の次設計をDHR-OP05本設計に直行させず、PCMとして一段挟む判断が安全だと考えます。

理由は、PNT R11がかなり慎重な書き方になっているからです。R11はDHR-OP05 laneの次設計候補を示していますが、同時に「closed PNT-OP08 materialがそのlaneを選んでいる場合だけ」と条件を置いています。つまり、PNT helperが6 laneを閉じられることと、今回のclosed materialがDHR-OP05であることは、まだ分けて読む必要があります。

ただし、PCMを大きくしすぎるのも良くありません。R54-AHR系は境界補強が長く続いています。境界を守ることは大事ですが、境界だけが増えて商品読感へ戻る出口が遠くなるのは、Cocolonにとって良くありません。

なので、PCMは次の性質に限定するのがよいです。

```text
- 薄い。
- explicit closed PNT-OP08 materialだけを見る。
- current laneを合成しない。
- decision tableをcurrent laneにしない。
- next_design_candidate / wait_hold / stopだけを出す。
- 実行しない。
- DHR-OP05 laneが明示されたら、次のDHR-OP05 Preflight Re-entry設計へ進む材料にする。
- それ以外はlane通りに待つ、止める、または別設計候補へ分ける。
```

Cocolonとして大事なのは、早く次へ行ったように見せることではなく、人間の言葉を雑に処理しない場所へ近づけることです。開発工程でも同じで、見えているcandidateを実行許可として雑に扱わないことが、Cocolonらしさを守る作業だと思います。

---

## 17. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- ローカル受領zipのみで確認した。
- GitHub接続確認はMash様指示により不要であり、実施していない。
- Cocolon_前提資料と作業姿勢ルールを確認した。
- emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.mdを確認した。
- 検討メモは、次設計対象をPost-PNT closed material next boundary confirmation / next design candidate onlyとしている。
- PNT-OP00〜PNT-OP08 / R7〜R11 result memo closureはローカル受領状態で成立している。
- PNT target 122 passed、selected regression 304 passed、compileall passedは記録されている。
- PNT R11のsafe next work classは、closed PNT-OP08 materialがnext_design_candidate laneを選んだ場合のみ次設計候補へ進む、という条件付きである。
- PNT R11はcurrent execution allowanceをnoneとしている。
- DHR-OP05 / P8 / releaseはいずれも未実行・未開始・未許可である。
```

### 未確認

```text
- PCM helper / tests / result memoはまだ存在しない。
- explicit single closed PNT-OP08 materialが、DHR-OP05 laneとして別途固定されていること。
- PCM target tests green。
- PCM selected regression green。
- PCM compileall passed。
- full backend suite green。
- RN contract green。
- RN real-device modal verified。
- actual review execution。
- actual rating / blocker / question need observation rows。
- DHR-OP05以降の実行。
- P5 final / P6 start / P8 start / P7 complete / release。
```

### 書かれていない

```text
- PNT target greenをcurrent lane確定として扱ってよいとは書かれていない。
- PNT R11 decision tableを単一closed materialとして扱ってよいとは書かれていない。
- DHR-OP05 design candidateをDHR-OP05 call permissionとして扱ってよいとは書かれていない。
- Post-PNTでP8 question designへ進んでよいとは書かれていない。
- PCMでjson/schemaファイルを実ファイル化しなければならないとは書かれていない。
```

### 推測禁止

```text
- all-lane test greenをcurrent lane確定として扱わない。
- helper default builder出力をcurrent closed materialとして扱わない。
- DHR-OP05 candidateをDHR-OP05実行許可として扱わない。
- next_design_document_allowedをdownstream execution allowedとして扱わない。
- P8正式候補仕様をP8開始許可として扱わない。
- helper greenを商品読感合格として扱わない。
- P5 surface / Gate / Emlis本文の弱さを問い候補で隠さない。
```

### 次に実行すべきこと

実装段階に進むなら、次を実装します。

```text
P7-R54-AHR Post-PNT Closed Material Next Boundary Confirmation
PCM-OP00〜PCM-OP08
```

最初に実装すべき最小単位は次です。

```text
R0: scope / explicit closed material / no-execution refreeze
R1: helper skeleton / constants
R2: PCM-OP00 / OP01 + tests
```

その時点で必ず守ることは次です。

```text
- PCM helper本体は、PNT-OP08 default builderを無入力で呼ばない。
- explicit closed PNT-OP08 materialがない場合はwaitingにする。
- PNT R11 tableやsix outcome summaryをcurrent laneとして扱わない。
- DHR-OP05 / P8 / releaseへ進めない。
- API / DB / RN / response keyへ触らない。
```
