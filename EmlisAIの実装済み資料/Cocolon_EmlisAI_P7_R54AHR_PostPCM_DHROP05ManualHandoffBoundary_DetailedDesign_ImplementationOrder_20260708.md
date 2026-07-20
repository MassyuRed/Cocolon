---
title: "Cocolon / EmlisAI P7-R54-AHR Post-PCM DHR-OP05 Manual Handoff Boundary / Preflight Re-entry 詳細設計書・実装順"
created_at: "2026-07-08 JST"
author: "華恋"
work_mode: "共鳴構造モード"
work_type: "詳細設計書 / 実装順 / json・schema案内包"
source_mode: "local_received_zip_only"
github_connection_check: "Mash様指示により不要 / 未実施"
base_pre_design_memo: "Cocolon_EmlisAI_P7_R54AHR_PostPCM_DHROP05ManualHandoffBoundary_PreDesignMemo_20260708.md"
selected_roadmap_phase: "P7 Product Quality Runner / Long-run Product Gate 継続"
selected_design_target: "P7-R54-AHR Post-PCM DHR-OP05 Manual Handoff Boundary / Preflight Re-entry"
recommended_boundary_prefix: "DHB-OP00〜DHB-OP08"
recommended_prefix_meaning: "DHB = DHR-OP05 Manual Handoff Boundary"
recommended_helper_shape: "thin body-free manual handoff boundary before existing DHR-OP05 preflight scan; no DHR-OP05 builder call in this boundary"
artifact_scope: "md design only"
code_change: "none"
test_change: "none"
json_schema_file_creation: "none"
api_change: "none"
db_change: "none"
rn_change: "none"
runtime_change: "none"
response_key_change: "none"
pcm_op08_material_synthesis: "none"
pcm_builder_call: "none"
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
current_expected_next_required_step_after_design: "implement_thin_dhb_explicit_pcm_op08_dhr_lane_handoff_boundary_and_targets_then_stop_before_dhr_op05_call"
---

# Cocolon / EmlisAI P7-R54-AHR Post-PCM DHR-OP05 Manual Handoff Boundary / Preflight Re-entry 詳細設計書・実装順

対象: Cocolon / EmlisAI / P7 Product Quality Runner / R54-AHR / PCM R11後 / DHR-OP05 Manual Handoff Boundary / Preflight Re-entry  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
実装扱い: 本書は設計書です。コード変更、テスト変更、json/schema実ファイル化、DHR-OP05呼び出し、DHR-OP05 builder呼び出し、DHR-OP06以降、DMD/R52、actual review、actual rows、question need observation rows、P8問いシステム、API/DB/RN/runtime/response key変更、P7完了、release判断は行いません。  
json / schema実ファイル化: なし。本書内の案のみです。実ファイル化は実装段階で、既存helper、既存schema配置、既存guard、既存test結果を確認して判断します。  
GitHub接続確認: Mash様指定により不要。ローカル受領zip基準。  

---

## 0. 結論

今回の詳細設計対象は、次で固定します。

```text
P7-R54-AHR Post-PCM
DHR-OP05 Manual Handoff Boundary / Preflight Re-entry
```

推奨する境界prefixは次です。

```text
DHB-OP00〜DHB-OP08
DHB = DHR-OP05 Manual Handoff Boundary
```

DHBの責務は、PCM R11で示された次設計候補を、DHR-OP05実行許可へ雑に変換しないために、**明示的に渡された1件のPCM-OP08 closed material** が本当にDHR-OP05 laneを選んでいるかを検査し、既存DHR-OP05 preflight scanへ渡せる候補 envelope をbody-freeで作って、そこで止めることです。

DHBが到達してよい状態は次だけです。

```text
1. explicit PCM-OP08 DHR-OP05 lane confirmed, DHR-OP05 manual handoff envelope materialized, then stopped
2. explicit PCM-OP08 material exists but not DHR-OP05 lane, lane route preserved, then stopped
3. explicit PCM-OP08 material missing, wait / hold, then stopped
4. PCM-OP08 material invalid or ambiguous, repair required, then stopped
5. body-like payload / promotion claim / no-touch mutation / auto-run claim detected, blocked, then stopped
```

DHBが行ってはいけないことは次です。

```text
- PCM-OP08 materialを合成する
- PCM builder / PCM default material builderを呼ぶ
- PCM R11のdecision tableやtarget greenからcurrent laneを推定する
- 既存DHR-OP05 builderを呼ぶ
- DHR-OP05 preflight scanをこの境界内で実行する
- DHR-OP06 / DHR-OP07 / DMD / R52を実行する
- actual reviewを開始する
- actual rows / question need observation rowsを作る
- P8問い設計やquestion_textを作る
- API / DB / RN / runtime / response keyを変更する
- full backend suite / RN contract / real-device greenを確認済みにする
- P7 complete / release readinessを主張する
```

この設計の中心は、DHR-OP05へ進むことではありません。  
**DHR-OP05へ進める証拠と、進めない停止条件を分けること**です。

---

## 1. なぜこの設計を行うのか

Cocolon / EmlisAIで守るべき核は、ユーザーの言葉を雑に処理しないことです。これはプロダクト応答だけではなく、開発工程にもそのまま適用されます。

PCM R11では、PCM target validation、selected regression、compileallのgreenが記録されています。ただし、R11は同時に次を明確に分けています。

```text
PCM helperが全laneを閉じられること
  ≠ 現在laneがDHR-OP05であること

next design candidateが記録されていること
  ≠ DHR-OP05を呼んでよいこと

local validation green
  ≠ full backend suite / RN contract / real-device / P7 complete / release ready
```

ここを混ぜると、開発工程が「読めたふり」をします。Cocolonがユーザーの言葉に対して避けたいことを、Cocolon自身の開発で行うことになります。

DHBは、その短絡を防ぐための薄い手動境界です。DHR-OP05へ進みたい気持ちを否定する境界ではありません。むしろ、DHR-OP05へ進む時に、何を根拠にしてよいかを丁寧に固定するための境界です。

---

## 2. 参照・確認範囲

### 2.1 ローカル受領zip / file

本設計の基準は、今回ローカルで受領した次の材料です。

```text
/mnt/data/Cocolon_前提資料(300).zip
/mnt/data/EmlisAIの実装済み資料(104).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_system_update_20260706(4).zip
/mnt/data/Cocolon(276).zip
/mnt/data/mashos-api(192).zip
/mnt/data/Cocolon_EmlisAI_P7_R54AHR_PostPCM_DHROP05ManualHandoffBoundary_PreDesignMemo_20260708.md
```

GitHub接続確認は、Mash様指定により行いません。

### 2.2 必読前提・作業姿勢

本設計では、次を確認済み前提として扱います。

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/04_forbidden_mixing_design_and_implementation.txt
Cocolon_前提資料/work_attitude_rules_for_karen/08_artifact_delivery_rules.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/11_cocolon_area_specific_do_not_break.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md
Cocolon_EmlisAI_P7_R54AHR_PostPCM_DHROP05ManualHandoffBoundary_PreDesignMemo_20260708.md
```

固定する作業姿勢は次です。

```text
- 見ていないものを見たと言わない。
- 設計と実装を混ぜない。
- 前提資料だけで理解したふりをせず、実ファイル・result memo・テスト記録も見る。
- target / regression / compileall greenをcurrent laneへ変換しない。
- PCM R11のnext design candidateをDHR-OP05 execution permissionへ変換しない。
- P8問いシステムをP7内で実装しない。
- Emlis本体の読感不足を、問い候補で隠さない。
- public contract / DB / RN / response keyを指示なく変えない。
- raw body / comment_text / question_text / reviewer free text / local path / hash / stdout / stderr / tracebackをresult memoへ持ち込まない。
```

### 2.3 直接接続する既存設計資料

```text
EmlisAIの実装済み資料/
  Cocolon_EmlisAI_P7_R54AHR_PostPNT_ClosedMaterialNextBoundaryConfirmation_DetailedDesign_ImplementationOrder_20260707.md
  Cocolon_EmlisAI_P7_R54AHR_PostNCI_SelectedHandoffOrStopDecisionTriage_NextBoundarySelection_DetailedDesign_ImplementationOrder_20260707.md
  Cocolon_EmlisAI_P7_R54AHR_PostELR19_DownstreamManualDecision_HandoffOrRetry_DetailedDesign_ImplementationOrder_20260704.md
  Cocolon_EmlisAI_P7_R54AHR_PostDRI_DHR_OP04ManualReintake_DetailedDesign_ImplementationOrder_20260705.md
```

### 2.4 直接接続する既存実ファイル

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_20260707.py
  emlis_ai_p7_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_20260707.py
  emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py
  emlis_ai_p7_r54_ahr_post_dri_dhr_op04_manual_reintake_20260705.py
  emlis_ai_p7_contracts.py
```

既存DHR-OP05の実体は、Post-ELR19 helper内の次です。

```text
build_p7_r54_ahr_post_elr19_dhr_op05_bodyfree_leak_promotion_claim_dmd_compatibility_preflight_scan
assert_p7_r54_ahr_post_elr19_dhr_op05_bodyfree_leak_promotion_claim_dmd_compatibility_preflight_scan_contract
```

ただし、DHBではこのbuilder / assertを**呼びません**。実装段階でimportを使う場合も、原則は定数・ref確認に留め、builder実行は別許可に分けます。

### 2.5 直接接続する既存result memo

```text
mashos-api/ai/tests/
  R54_AHR_PostPNT_ClosedMaterialNextBoundaryConfirmation_PCM_OP00_OP08_Result_20260707.md
  R54_AHR_PostPNT_ClosedMaterialNextBoundaryConfirmation_PCM_R10_ResultMemoClosure_20260707.md
  R54_AHR_PostPNT_ClosedMaterialNextBoundaryConfirmation_PCM_R11_NextWorkDecision_20260707.md
  R54_AHR_PostNCI_SelectedHandoffOrStopDecisionTriage_PNT_R11_NextWorkDecision_20260707.md
```

---

## 3. 現在地の固定

### 3.1 確認済み

```text
- 現在PhaseはP7 Product Quality Runner / Long-run Product Gate継続。
- ロードマップ上、P7では問いシステムを実装しない。
- P7では問いシステム必要性をbody-free materialとして観察するに留める。
- P7中に、問いシステムのAPI / DB / RN UI / response key / plan guard / 問い発生ロジックを確定しない。
- PCM R11は、downstream executionなしのnext work decision boundaryである。
- PCM R11は、current execution allowanceをnoneとしている。
- PCM R11は、target / regression / compileall greenからcurrent selected laneを推定していない。
- PCM R11は、DHR-OP05 laneが明示確認された場合のnext design candidateとして、DHR-OP05 Manual Handoff Boundary / Preflight Re-entryを記録している。
- 既存Post-ELR19 helperにはDHR-OP05 preflight scan builder / assertが存在する。
```

### 3.2 今回の設計作成中には実行していないこと

```text
- GitHub main同期確認
- 新規test実行
- PCM target validation再実行
- selected regression再実行
- compileall再実行
- full backend suite
- RN contract
- RN real-device確認
- DHR-OP05 builder call
- DHR-OP06 / DHR-OP07 / DMD / R52
- actual review start
- P8問い設計
```

### 3.3 書かれていないこと

```text
- PCM target validation greenならDHR-OP05を呼んでよい。
- selected regression / compileall greenならDHR-OP05を呼んでよい。
- PCM R11 result memoがあれば、explicit PCM-OP08 materialが不要になる。
- PCM R11 decision tableをDHR-OP05 lane selected materialとして扱ってよい。
- DHR-OP05 Manual Handoff Boundaryを設計すれば、DHR-OP06 / DMD / R52へ進める。
- DHR-OP05 preflight scan clearをrelease readinessとして扱ってよい。
- P8問いシステムへ進んでよい。
```

### 3.4 推測禁止

```text
- all-lane green = current lane確定
- next design candidate = DHR-OP05 call permission
- PCM R11 decision table = explicit PCM-OP08 closed material
- DHR-OP05 handoff envelope = DHR-OP05実行結果
- DHR-OP05 preflight = DHR-OP06 / DMD / R52実行許可
- question need material = P8 question_text
- local validation green = release readiness
```

---

## 4. 設計対象と非対象

### 4.1 設計対象

```text
- explicit PCM-OP08 closed material intake
- PCM-OP08 DHR-OP05 lane exact confirmation
- non-DHR lane preservation and stop
- DHR-OP05 manual handoff envelope materialization without DHR-OP05 call
- existing DHR-OP05 preflight scanとのcompatibility field mapping案
- no DHR-OP05 builder call guard
- no DHR-OP06 / DMD / R52 / actual review / P8 / release guard
- body-free / no raw / no promotion / no auto execution scan
- validation plan / result memo draft material
- OP08 closure and next required step decision
```

### 4.2 非対象

```text
- DHR-OP05本体実行
- DHR-OP05 builder / assert call
- DHR-OP06 branch resolver実行
- DHR-OP07 materialization
- DMD / R52実行
- actual local-only human review開始
- actual rows / question need observation rows作成
- raw evidence request
- P8問いシステム詳細設計
- question_text / draft_question_text / answer_text materialization
- API / DB / RN / runtime / response key変更
- subscription / entitlement変更
- release判定
```

---

## 5. 推奨ファイル構成

### 5.1 実装段階で追加候補のhelper

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_20260708.py
```

このhelperは、既存PCM helperや既存DHR-OP05 helperを大きく書き換えません。  
役割は、explicit PCM-OP08 materialを受け、DHR-OP05 laneかどうかを確認し、DHR-OP05へ渡せるbody-free handoff envelope候補を作って止めることです。

### 5.2 実装段階で追加候補のtarget tests

```text
mashos-api/ai/tests/
  test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op00_op01_20260708.py
  test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op02_op03_20260708.py
  test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op04_op05_20260708.py
  test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op06_op07_20260708.py
  test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op08_result_20260708.py
```

### 5.3 実装段階で追加候補のresult memo

```text
mashos-api/ai/tests/
  R54_AHR_PostPCM_DHROP05ManualHandoffBoundary_DHB_OP00_OP01_Result_20260708.md
  R54_AHR_PostPCM_DHROP05ManualHandoffBoundary_DHB_OP00_OP03_Result_20260708.md
  R54_AHR_PostPCM_DHROP05ManualHandoffBoundary_DHB_OP00_OP05_Result_20260708.md
  R54_AHR_PostPCM_DHROP05ManualHandoffBoundary_DHB_OP00_OP07_Result_20260708.md
  R54_AHR_PostPCM_DHROP05ManualHandoffBoundary_DHB_OP00_OP08_Result_20260708.md
  R54_AHR_PostPCM_DHROP05ManualHandoffBoundary_DHB_R7_TargetValidation_Result_20260708.md
  R54_AHR_PostPCM_DHROP05ManualHandoffBoundary_DHB_R8_SelectedRegression_Result_20260708.md
  R54_AHR_PostPCM_DHROP05ManualHandoffBoundary_DHB_R9_Compileall_Result_20260708.md
  R54_AHR_PostPCM_DHROP05ManualHandoffBoundary_DHB_R10_ResultMemoClosure_20260708.md
  R54_AHR_PostPCM_DHROP05ManualHandoffBoundary_DHB_R11_NextWorkDecision_20260708.md
```

---

## 6. DHB-OP00〜OP08 詳細設計

### 6.1 DHB-OP00: scope / no-execution refreeze

目的:

```text
- Post-PCM DHR-OP05 Manual Handoff Boundaryのscopeを固定する。
- DHR-OP05実行ではなく、DHR-OP05 call前の境界であることを明示する。
- PCM-OP08 material合成、PCM builder call、DHR-OP05 builder call、P8、releaseを全て禁止する。
```

入力:

```text
なし、またはreview_session_idのみ。
```

出力:

```text
- operation_step_ref = DHB-OP00_scope_no_execution_refreeze_after_PCM_R11
- source_mode = local_received_zip_only
- body_free = true
- pcm_op08_explicit_closed_material_required = true
- pcm_op08_synthesis_allowed_here = false
- dhr_op05_call_allowed_here = false
- dhr_op05_builder_call_allowed_here = false
- api_db_rn_runtime_response_key_change_allowed_here = false
- p8_question_design_allowed_here = false
- release_decision_allowed_here = false
```

停止条件:

```text
OP00は常に停止境界であり、下流実行を行わない。
```

---

### 6.2 DHB-OP01: explicit PCM-OP08 closed material intake

目的:

```text
- 明示的に渡されたPCM-OP08 closed materialのみを受ける。
- PCM R11 memo、target result、selected regression result、compileall result、decision table、multi-lane summaryを単独入力として扱わない。
- PCM-OP08 materialがない場合は待つ。
```

入力:

```text
explicit_pcm_op08_closed_material: Mapping | None
op00_scope_refreeze: Mapping | None
```

許可する入力:

```text
- schema_versionがPCM-OP08系であること
- operation_step_refがPCM-OP08 closureであること
- body_free = true
- selected_pcm_next_boundary_not_executed = true
- dhr_op05_call_allowed_here = false
- dhr_op05_builder_call_allowed_here = false
```

拒否する入力:

```text
- PCM R11 result memoだけ
- PCM target validation resultだけ
- selected regression resultだけ
- compileall resultだけ
- decision_table / all_lane_summary / six_outcome_summary
- raw input / body / comment_text / question_text / answer_text
- local path / hash / stdout / stderr / traceback
- dhr_op05_called_here = true
- p8_question_design_started = true
- release_allowed = true
```

主なstatus:

```text
DHB_STATUS_PCM_OP08_MATERIAL_INTAKE_READY_FOR_CONTRACT_VALIDATION
DHB_STATUS_WAITING_FOR_EXPLICIT_PCM_OP08_CLOSED_MATERIAL
DHB_STATUS_REPAIR_REQUIRED_FOR_PCM_OP08_MATERIAL_INTAKE
DHB_STATUS_BLOCKED_PCM_OP08_MATERIAL_LEAK_PROMOTION_OR_AUTORUN
```

---

### 6.3 DHB-OP02: PCM-OP08 contract validation

目的:

```text
- PCM-OP08 materialのfield setとbody-free / no-execution contractを検証する。
- upstream PCM closureがDHBに必要な最低fieldを持つか確認する。
- DHR-OP05 lane判定はOP03で行う。
```

必須field案:

```text
schema_version
operation_step_ref
body_free
selected_pnt_lane_ref
selected_pcm_next_work_class_ref
selected_pcm_next_boundary_ref
selected_pcm_next_boundary_kind_ref
selected_pcm_next_boundary_not_executed
next_design_document_candidate_ref
next_design_document_allowed
dhr_op05_call_allowed_here
dhr_op05_builder_call_allowed_here
dhr_op06_call_allowed_here
dmd_r52_execution_allowed_here
actual_review_start_allowed_here
p8_question_design_allowed_here
api_db_rn_runtime_response_key_change_allowed_here
p7_complete
release_allowed
```

主なstatus:

```text
DHB_STATUS_PCM_OP08_CONTRACT_VALID_STOPPED
DHB_STATUS_REPAIR_REQUIRED_FOR_PCM_OP08_CONTRACT
DHB_STATUS_BLOCKED_PCM_OP08_CONTRACT_LEAK_PROMOTION_OR_AUTORUN
```

---

### 6.4 DHB-OP03: DHR-OP05 lane exact confirmation / non-DHR preservation

目的:

```text
- selected_pnt_lane_refがDHR-OP05 laneであるかだけを確認する。
- DHR laneでなければ、DHB内で別laneへ自動処理せず、routeを保存して止める。
- DHR laneであっても、DHR-OP05 call permissionにはしない。
```

DHR-OP05 laneとして認める値:

```text
dhr_op05_manual_handoff_boundary_design_candidate
```

DHR-OP05 laneである時に必要な整合:

```text
selected_pcm_next_work_class_ref = next_design_candidate
selected_pcm_next_boundary_ref = prepare_post_pnt_dhr_op05_manual_handoff_boundary_preflight_design_without_call
selected_pcm_next_boundary_kind_ref = pcm_next_design_candidate_boundary_without_execution
next_design_document_candidate_ref = P7-R54-AHR Post-NCI DHR-OP05 Manual Handoff Boundary / Preflight Re-entry Design Candidate
next_design_document_allowed = true
selected_pcm_next_boundary_not_executed = true
dhr_op05_call_allowed_here = false
dhr_op05_builder_call_allowed_here = false
```

DHR-OP05以外のlane:

```text
retry_or_start_actual_local_only_review_route_candidate
wait_external_bodyfree_claim_reintake_candidate
repair_rdb_candidate_or_upstream_result_candidate
manual_hold_unresolved_post_rdb08_candidate
blocked_bodyfree_leak_promotion_or_autorun_candidate
```

DHR-OP05以外のlaneを受けた場合:

```text
- selected lane refを保存する。
- PCM decision table上のrouteを保存する。
- DHBではDHR-OP05 handoff envelopeを作らない。
- next_required_stepはfollow_pcm_r11_lane_specific_decision_table_outside_dhb_without_executionにする。
```

主なstatus:

```text
DHB_STATUS_DHR_OP05_LANE_CONFIRMED_STOPPED
DHB_STATUS_NOT_DHR_OP05_LANE_ROUTE_PRESERVED_STOPPED
DHB_STATUS_REPAIR_REQUIRED_FOR_DHR_OP05_LANE_CONFIRMATION
DHB_STATUS_BLOCKED_DHR_OP05_LANE_CONFIRMATION_PROMOTION_OR_AUTORUN
```

---

### 6.5 DHB-OP04: DHR-OP05 manual handoff envelope materialization without call

目的:

```text
- OP03でDHR-OP05 laneが確認された時だけ、DHR-OP05へ渡す前のmanual handoff envelopeを作る。
- envelopeはDHR-OP05 builder inputではなく、DHR-OP05 builderを呼ぶ前の確認materialである。
- 既存DHR-OP05 helperの期待する概念と、PCM由来のmaterialをどう接続するかをbody-freeで固定する。
```

出力する主なfield案:

```text
schema_version
operation_step_ref
source_mode
body_free
pcm_op08_material_ref
pcm_op08_contract_valid
selected_pnt_lane_ref
selected_pcm_next_boundary_ref
selected_pcm_next_boundary_not_executed
existing_dhr_op05_builder_ref
existing_dhr_op05_builder_call_allowed_here
existing_dhr_op05_builder_called_here
dhr_op05_manual_handoff_envelope_ready
dhr_op05_preflight_reentry_candidate_allowed
dhr_op05_call_still_requires_separate_explicit_instruction
op04_does_not_call_dhr_op05
op04_does_not_call_dhr_op06
op04_does_not_execute_dmd_r52
op04_does_not_start_actual_review
op04_does_not_start_p8_question_design
op04_does_not_change_api_db_rn_runtime_response_key
```

重要な値:

```text
existing_dhr_op05_builder_ref:
  build_p7_r54_ahr_post_elr19_dhr_op05_bodyfree_leak_promotion_claim_dmd_compatibility_preflight_scan

existing_dhr_op05_assert_ref:
  assert_p7_r54_ahr_post_elr19_dhr_op05_bodyfree_leak_promotion_claim_dmd_compatibility_preflight_scan_contract

existing_dhr_op05_builder_call_allowed_here:
  false

existing_dhr_op05_builder_called_here:
  false
```

主なstatus:

```text
DHB_STATUS_DHR_OP05_MANUAL_HANDOFF_ENVELOPE_MATERIALIZED_STOPPED
DHB_STATUS_NOT_DHR_OP05_LANE_NO_HANDOFF_ENVELOPE_STOPPED
DHB_STATUS_REPAIR_REQUIRED_FOR_DHR_OP05_HANDOFF_ENVELOPE_INPUTS
DHB_STATUS_BLOCKED_DHR_OP05_HANDOFF_ENVELOPE_PROMOTION_OR_AUTORUN
```

---

### 6.6 DHB-OP05: existing DHR-OP05 compatibility crosswalk without builder call

目的:

```text
- 既存DHR-OP05 preflight scanへ将来手動接続する場合のcompatibilityを、実行なしで確認する。
- 既存DHR-OP05のstatusやno-promotion境界をDHB側に写像する。
- DHR-OP05 builderを呼ばない。
```

確認するcompatibility:

```text
- DHR-OP05はbody-free preflight scanである。
- DHR-OP05はDMD direct callをsafeとは扱わない。
- DHR-OP05はbody-like payload / promotion claim / invalid source kindをrepairへ送る。
- DHR-OP05はbody-full packet生成、actual review、DMD/R52、P8、releaseを行わない。
- DHR-OP05 clearでもDHR-OP06以降は別境界であり、自動実行ではない。
```

DHB側で保持する既存DHR-OP05 status ref:

```text
DHR_PREFLIGHT_SCAN_CLEAR_BODYFREE
DHR_PREFLIGHT_SCAN_REPAIR_REQUIRED
DHR_PREFLIGHT_SCAN_WAITING_OR_INCOMPLETE
```

DHBでの扱い:

```text
- これらは互換参照として保持する。
- DHB内で実際のDHR-OP05 statusを生成しない。
- DHR-OP05実行結果として扱わない。
```

主なstatus:

```text
DHB_STATUS_DHR_OP05_COMPATIBILITY_CROSSWALK_RECORDED_WITHOUT_CALL
DHB_STATUS_DHR_OP05_COMPATIBILITY_REPAIR_REQUIRED
DHB_STATUS_DHR_OP05_COMPATIBILITY_BLOCKED_PROMOTION_OR_AUTORUN
```

---

### 6.7 DHB-OP06: body-free / no-touch / no-promotion / no-auto-execution guard

目的:

```text
- OP00〜OP05のmaterial全体を走査し、body-like payload、promotion claim、no-touch mutation、auto execution claimを遮断する。
- raw bodyやquestion_textが紛れた時点でblockedにする。
- DHR-OP05 call / builder call / downstream execution claimをblockedにする。
```

禁止payload key案:

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
question_answer_body
local_path
absolute_path
hash
sha256
stdout
stderr
traceback
```

禁止promotion / execution claim案:

```text
dhr_op05_called_here
dhr_op05_builder_called_here
dhr_op06_called_here
dhr_op07_materialized_here
dmd_execution_started_here
r52_actual_execution_started_here
actual_review_started_here
actual_rows_created_here
question_need_observation_rows_created_here
p8_question_design_started
p8_question_implementation_started
api_changed
db_changed
rn_changed
runtime_changed
response_key_changed
p7_complete
release_allowed
full_backend_suite_green_claimed_here
rn_contract_green_claimed_here
rn_real_device_modal_verified_claimed_here
```

主なstatus:

```text
DHB_STATUS_BODYFREE_NO_TOUCH_NO_PROMOTION_NO_AUTO_EXECUTION_GUARD_PASSED
DHB_STATUS_REPAIR_REQUIRED_FOR_BODYFREE_NO_TOUCH_GUARD_INPUTS
DHB_STATUS_BLOCKED_BODYFREE_NO_TOUCH_NO_PROMOTION_NO_AUTO_EXECUTION_GUARD
```

---

### 6.8 DHB-OP07: validation plan / result memo draft material

目的:

```text
- 実装後にどう検証するかをbody-freeで記録する。
- target / selected regression / compileallの予定を作る。
- full backend suite / RN contract / RN real-deviceは未確認扱いで固定する。
```

出力:

```text
- target_validation_command_refs
- selected_regression_command_refs
- compileall_command_refs
- result_memo_expected_files
- full_backend_suite_green_confirmed = false
- rn_contract_green_confirmed = false
- rn_real_device_modal_verified_claimed_here = false
- dhr_op05_not_called = true
- p8_question_design_not_started = true
- release_decision_not_made = true
```

主なstatus:

```text
DHB_STATUS_VALIDATION_PLAN_RESULT_MEMO_DRAFT_MATERIALIZED_STOPPED
DHB_STATUS_WAIT_OR_STOP_RESULT_MEMO_DRAFT_MATERIALIZED_STOPPED
DHB_STATUS_REPAIR_REQUIRED_FOR_RESULT_MEMO_DRAFT_INPUTS
DHB_STATUS_BLOCKED_RESULT_MEMO_DRAFT_BODYFREE_LEAK_PROMOTION_OR_AUTORUN
```

---

### 6.9 DHB-OP08: body-free closure / next required step decision

目的:

```text
- OP00〜OP07を閉じ、DHBとしての最終状態を記録する。
- DHR-OP05 call permissionを出さない。
- next required stepを、manual explicit instruction required / stop / wait / repairに分ける。
```

最終status:

```text
DHB_OP08_DHR_OP05_MANUAL_HANDOFF_BOUNDARY_CLOSED_STOPPED
DHB_OP08_NOT_DHR_OP05_LANE_ROUTE_PRESERVED_STOPPED
DHB_OP08_WAITING_FOR_EXPLICIT_PCM_OP08_DHR_LANE
DHB_OP08_REPAIR_REQUIRED_FOR_DHR_OP05_HANDOFF_BOUNDARY_INPUTS
DHB_OP08_BLOCKED_BODYFREE_LEAK_PROMOTION_OR_AUTORUN
```

DHR-OP05 lane confirmedの場合のnext_required_step:

```text
stop_before_dhr_op05_call_and_require_separate_explicit_manual_execution_instruction
```

DHR-OP05以外のlaneの場合のnext_required_step:

```text
follow_pcm_r11_lane_specific_decision_table_outside_dhb_without_execution
```

missing / waitの場合:

```text
wait_for_one_explicit_pcm_op08_closed_material_selecting_dhr_op05_lane
```

repairの場合:

```text
repair_pcm_op08_or_dhb_bodyfree_handoff_inputs_before_any_dhr_op05_call
```

blockedの場合:

```text
stop_blocked_bodyfree_leak_promotion_or_autorun_without_next_design_promotion
```

---

## 7. 実装順

### R0: 設計反映前freeze

作業:

```text
- 本設計書のscopeと非対象を再確認する。
- 既存PCM helper / existing DHR-OP05 helperの位置を確認する。
- 実装対象ファイル名とtest名を固定する。
```

完了条件:

```text
- コード変更前に、DHR-OP05 builder callをしない方針が固定されている。
- PCM-OP08 material合成禁止が固定されている。
```

### R1: helper skeleton / constants

追加候補:

```text
emlis_ai_p7_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_20260708.py
```

実装内容:

```text
- phase / source_mode / step / scope / policy_kind constants
- DHB-OP00〜OP08 step refs
- allowed status refs
- forbidden payload keys
- no-touch contract keys
- no-promotion refs
- existing DHR-OP05 builder ref string
- build/assert for R1 helper skeleton constants summary
```

テスト:

```text
- skeleton constantsがbody-freeである
- DHR-OP05 call / builder call allowedがfalse
- API / DB / RN / runtime / response key変更allowedがfalse
- P8 / release allowedがfalse
```

### R2: DHB-OP00 / OP01

実装内容:

```text
- build/assert DHB-OP00
- build/assert DHB-OP01
- explicit PCM-OP08 material intake
- missing material wait
- decision_table / R11 memo / target green単独入力の拒否
- body-like payload / promotion claim blocked
```

テスト:

```text
- OP00 freezes no-execution scope
- OP01 waits when explicit PCM-OP08 material is missing
- OP01 accepts explicit PCM-OP08 shaped material only
- OP01 rejects PCM R11 decision table as selected material
- OP01 blocks raw body / question_text / dhr_op05_called_here
```

### R3: DHB-OP02 / OP03

実装内容:

```text
- build/assert DHB-OP02 contract validation
- build/assert DHB-OP03 DHR lane confirmation
- non-DHR lane route preservation
- DHR lane exact value / next boundary / next design document consistency
```

テスト:

```text
- OP02 validates required field set
- OP02 repairs invalid / ambiguous PCM material
- OP03 confirms dhr_op05_manual_handoff_boundary_design_candidate
- OP03 preserves retry/start lane without DHR envelope
- OP03 preserves wait / repair / unresolved / blocked lanes without DHR envelope
- OP03 blocks DHR-OP05 call claim and release promotion claim
```

### R4: DHB-OP04 / OP05

実装内容:

```text
- build/assert DHB-OP04 manual handoff envelope without call
- build/assert DHB-OP05 compatibility crosswalk without DHR builder call
- existing DHR-OP05 builder / assert refs are recorded as refs only
- DHR-OP05 status refs are recorded as compatibility refs only
```

テスト:

```text
- OP04 materializes handoff envelope only for DHR lane
- OP04 does not call existing DHR-OP05 builder
- OP04 records dhr_op05_call_still_requires_separate_explicit_instruction
- OP05 records compatibility refs without generating DHR-OP05 result
- OP05 blocks fake DHR-OP05 clear / DMD / R52 / release claim
```

### R5: DHB-OP06 / OP07

実装内容:

```text
- build/assert DHB-OP06 body-free no-touch guard
- build/assert DHB-OP07 validation plan / result memo draft
- blocked status for body-like payload, promotion claim, mutation claim, test green promotion claim
```

テスト:

```text
- OP06 passes clean body-free materials
- OP06 blocks raw_input / comment_text / question_text / stdout / hash
- OP06 blocks DHR-OP05 builder called / DHR-OP06 called / DMD executed / P8 started / release allowed
- OP07 records target / regression / compileall plan without claiming green
- OP07 keeps full backend / RN / real-device unconfirmed
```

### R6: DHB-OP08 closure

実装内容:

```text
- build/assert DHB-OP08 closure
- final status branch: closed / non-DHR route preserved / wait / repair / blocked
- next_required_step mapping
- result memo alias helpers if existing convention requires long aliases
```

テスト:

```text
- OP08 closes DHR lane as stopped, not executed
- OP08 closes non-DHR lanes as route preserved, not executed
- OP08 waits without explicit PCM material
- OP08 repairs invalid PCM material
- OP08 blocks body leak / promotion / autorun
- OP08 never allows DHR-OP05 call or builder call
```

### R7: target validation

実行候補:

```bash
cd mashos-api/ai
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference pytest -q --assert=plain \
  tests/test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op00_op01_20260708.py \
  tests/test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op02_op03_20260708.py \
  tests/test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op04_op05_20260708.py \
  tests/test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op06_op07_20260708.py \
  tests/test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op08_result_20260708.py \
  -p no:cacheprovider
```

結果memo候補:

```text
R54_AHR_PostPCM_DHROP05ManualHandoffBoundary_DHB_R7_TargetValidation_Result_20260708.md
```

注意:

```text
この時点のpassed数は実装後に確定する。本設計ではpassed数を先取りしない。
```

### R8: selected regression

実行候補:

```bash
cd mashos-api/ai
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference pytest -q --assert=plain \
  tests/test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op00_op01_20260708.py \
  tests/test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op02_op03_20260708.py \
  tests/test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op04_op05_20260708.py \
  tests/test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op06_op07_20260708.py \
  tests/test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op08_result_20260708.py \
  tests/test_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_pcm_op00_op01_20260707.py \
  tests/test_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_pcm_op02_op03_20260707.py \
  tests/test_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_pcm_op04_op05_20260707.py \
  tests/test_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_pcm_op06_op07_20260707.py \
  tests/test_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_pcm_op08_result_20260707.py \
  tests/test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op00_op01_20260707.py \
  tests/test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op02_op03_20260707.py \
  tests/test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op04_op05_20260707.py \
  tests/test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op06_op07_20260707.py \
  tests/test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op08_result_20260707.py \
  tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op04_op05_20260704.py \
  tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op06_op07_20260704.py \
  -p no:cacheprovider
```

選定理由:

```text
- 新規DHB target
- 直前PCM boundary
- upstream PNT lane selection boundary
- 既存DHR-OP05が属するPost-ELR19 DHR-OP04/OP05近傍
```

注意:

```text
selected regressionはfull backend suiteではない。
RN contract / real-device確認ではない。
passed数は実装後に確定する。
```

### R9: compileall

実行候補:

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference python -m compileall -q \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_20260708.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_20260707.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_20260707.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py
```

注意:

```text
compileall passedは、runtime実行許可やrelease判断ではない。
```

### R10: result memo closure

作成候補:

```text
R54_AHR_PostPCM_DHROP05ManualHandoffBoundary_DHB_R10_ResultMemoClosure_20260708.md
```

記録する内容:

```text
- R7 target result
- R8 selected regression result
- R9 compileall result
- DHR-OP05 call: none
- DHR-OP05 builder call: none
- DHR-OP06 / DMD / R52: none
- actual review start: none
- P8 question design: none
- API / DB / RN / response key change: none
- full backend suite / RN / real-device: not claimed
- P7 complete / release decision: none
```

### R11: next work decision

作成候補:

```text
R54_AHR_PostPCM_DHROP05ManualHandoffBoundary_DHB_R11_NextWorkDecision_20260708.md
```

R11で許可してよい判断:

```text
DHB closed and DHR lane handoff envelope ready:
  next work candidate = DHR-OP05 manual call / existing DHR-OP05 preflight scan execution consideration
  execution allowance = none until separate explicit instruction

DHB closed but non-DHR lane:
  next work candidate = follow PCM R11 lane-specific decision table outside DHB
  execution allowance = none

waiting:
  hold until explicit PCM-OP08 DHR lane material exists

repair:
  repair upstream PCM/DHB body-free handoff inputs

blocked:
  stop without next design promotion
```

R11で許可してはいけない判断:

```text
- DHR-OP05 called
- DHR-OP05 builder called
- DHR-OP06 started
- DMD/R52 started
- actual review started
- P8 question design started
- P7 complete
- release ready
```

---

## 8. 関数・定数設計案

### 8.1 module constants案

```python
P7_R54_AHR_POST_PCM_DHB_PHASE = "P7"
P7_R54_AHR_POST_PCM_DHB_SOURCE_MODE = "local_received_zip_only"
P7_R54_AHR_POST_PCM_DHB_STEP = "R54-AHR-PostPCM_DHROP05ManualHandoffBoundary_20260708"
P7_R54_AHR_POST_PCM_DHB_SCOPE = "p7_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary"
P7_R54_AHR_POST_PCM_DHB_POLICY_KIND = "r54_ahr_post_pcm_explicit_dhr_op05_lane_manual_handoff_bodyfree_boundary"
P7_R54_AHR_POST_PCM_DHB_BOUNDARY_PREFIX_REF = "DHB"
P7_R54_AHR_POST_PCM_DHB_EXPLICIT_PCM_OP08_CLOSED_MATERIAL_REQUIRED = True
P7_R54_AHR_POST_PCM_DHB_PCM_OP08_MATERIAL_SYNTHESIS_ALLOWED = False
P7_R54_AHR_POST_PCM_DHB_PCM_BUILDER_CALL_ALLOWED_HERE = False
P7_R54_AHR_POST_PCM_DHB_DHR_OP05_CALL_ALLOWED_HERE = False
P7_R54_AHR_POST_PCM_DHB_DHR_OP05_BUILDER_CALL_ALLOWED_HERE = False
P7_R54_AHR_POST_PCM_DHB_BODY_FREE = True
```

### 8.2 builder / assert案

```python
build_p7_r54_ahr_post_pcm_dhb_r1_helper_skeleton_constants_summary(...)
assert_p7_r54_ahr_post_pcm_dhb_r1_helper_skeleton_constants_summary_contract(...)

build_p7_r54_ahr_post_pcm_dhb_op00_scope_no_execution_refreeze_after_pcm_r11(...)
assert_p7_r54_ahr_post_pcm_dhb_op00_scope_no_execution_refreeze_after_pcm_r11_contract(...)

build_p7_r54_ahr_post_pcm_dhb_op01_explicit_pcm_op08_closed_material_intake(...)
assert_p7_r54_ahr_post_pcm_dhb_op01_explicit_pcm_op08_closed_material_intake_contract(...)

build_p7_r54_ahr_post_pcm_dhb_op02_pcm_op08_contract_validation(...)
assert_p7_r54_ahr_post_pcm_dhb_op02_pcm_op08_contract_validation_contract(...)

build_p7_r54_ahr_post_pcm_dhb_op03_dhr_op05_lane_exact_confirmation(...)
assert_p7_r54_ahr_post_pcm_dhb_op03_dhr_op05_lane_exact_confirmation_contract(...)

build_p7_r54_ahr_post_pcm_dhb_op04_dhr_op05_manual_handoff_envelope_without_call(...)
assert_p7_r54_ahr_post_pcm_dhb_op04_dhr_op05_manual_handoff_envelope_without_call_contract(...)

build_p7_r54_ahr_post_pcm_dhb_op05_existing_dhr_op05_compatibility_crosswalk_without_call(...)
assert_p7_r54_ahr_post_pcm_dhb_op05_existing_dhr_op05_compatibility_crosswalk_without_call_contract(...)

build_p7_r54_ahr_post_pcm_dhb_op06_bodyfree_no_touch_no_promotion_no_auto_execution_guard(...)
assert_p7_r54_ahr_post_pcm_dhb_op06_bodyfree_no_touch_no_promotion_no_auto_execution_guard_contract(...)

build_p7_r54_ahr_post_pcm_dhb_op07_validation_plan_result_memo_draft_material(...)
assert_p7_r54_ahr_post_pcm_dhb_op07_validation_plan_result_memo_draft_material_contract(...)

build_p7_r54_ahr_post_pcm_dhb_op08_bodyfree_dhr_op05_manual_handoff_boundary_closure(...)
assert_p7_r54_ahr_post_pcm_dhb_op08_bodyfree_dhr_op05_manual_handoff_boundary_closure_contract(...)
```

### 8.3 internal helper案

```python
_safe_review_session_id(...)
_clean_ref(...)
_dedupe_clean_refs(...)
_no_touch_contract(...)
_body_free_markers(...)
_not_claimed_boundary(...)
_required_fields_present(...)
_scan_forbidden_payload_key_paths(...)
_scan_body_like_value_paths(...)
_scan_promotion_claim_refs(...)
_scan_no_touch_mutation_paths(...)
_scan_multi_lane_material_key_paths(...)
_assert_base_bodyfree_boundary(...)
_pcm_op08_contract_valid(...)
_dhb_op03_is_dhr_op05_lane(...)
_dhb_op08_next_required_step(...)
```

既存PCM helperに同等helperがある場合、実装時に重複を避けるか、DHB内で最小複製するかを現物確認で判断します。DHBは薄い境界なので、既存helperを大きく変更して共通化するより、DHB内で必要最小のbody-free scanを持つ方が安全です。

---

## 9. JSON / schema案

本節は設計案です。実ファイル化は実装段階で判断します。

### 9.1 DHB-OP01 explicit PCM-OP08 closed material intake JSON案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.post_pcm.dhb.op01_explicit_pcm_op08_closed_material_intake.bodyfree.v1",
  "phase": "P7",
  "operation_step_ref": "DHB-OP01_explicit_PCM_OP08_closed_material_intake",
  "source_mode": "local_received_zip_only",
  "body_free": true,
  "review_session_id": "p7_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_20260708",
  "explicit_pcm_op08_material_present": true,
  "explicit_pcm_op08_material_ref": "p7_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_pcm_op08_bodyfree_closure_material_ref",
  "pcm_r11_memo_used_as_material": false,
  "pcm_target_green_used_as_current_lane": false,
  "pcm_decision_table_used_as_single_lane": false,
  "pcm_op08_material_synthesized_here": false,
  "pcm_builder_called_here": false,
  "dhr_op05_called_here": false,
  "dhr_op05_builder_called_here": false,
  "p8_question_design_started": false,
  "api_db_rn_runtime_response_key_changed": false,
  "release_allowed": false,
  "dhb_op01_status_ref": "DHB_STATUS_PCM_OP08_MATERIAL_INTAKE_READY_FOR_CONTRACT_VALIDATION",
  "next_required_step": "DHB-OP02_PCM_OP08_contract_validation"
}
```

### 9.2 DHB-OP03 DHR-OP05 lane confirmation JSON案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.post_pcm.dhb.op03_dhr_op05_lane_exact_confirmation.bodyfree.v1",
  "phase": "P7",
  "operation_step_ref": "DHB-OP03_DHR_OP05_lane_exact_confirmation",
  "source_mode": "local_received_zip_only",
  "body_free": true,
  "pcm_op08_contract_valid": true,
  "selected_pnt_lane_ref": "dhr_op05_manual_handoff_boundary_design_candidate",
  "selected_pcm_next_work_class_ref": "next_design_candidate",
  "selected_pcm_next_boundary_ref": "prepare_post_pnt_dhr_op05_manual_handoff_boundary_preflight_design_without_call",
  "selected_pcm_next_boundary_kind_ref": "pcm_next_design_candidate_boundary_without_execution",
  "next_design_document_candidate_ref": "P7-R54-AHR Post-NCI DHR-OP05 Manual Handoff Boundary / Preflight Re-entry Design Candidate",
  "dhr_op05_lane_confirmed": true,
  "non_dhr_lane_route_preserved": false,
  "selected_pcm_next_boundary_not_executed": true,
  "dhr_op05_call_allowed_here": false,
  "dhr_op05_builder_call_allowed_here": false,
  "dhb_op03_status_ref": "DHB_STATUS_DHR_OP05_LANE_CONFIRMED_STOPPED",
  "next_required_step": "DHB-OP04_DHR_OP05_manual_handoff_envelope_without_call"
}
```

### 9.3 DHB-OP04 manual handoff envelope JSON案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.post_pcm.dhb.op04_dhr_op05_manual_handoff_envelope_without_call.bodyfree.v1",
  "phase": "P7",
  "operation_step_ref": "DHB-OP04_DHR_OP05_manual_handoff_envelope_without_call",
  "source_mode": "local_received_zip_only",
  "body_free": true,
  "pcm_op08_material_ref": "p7_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_pcm_op08_bodyfree_closure_material_ref",
  "pcm_op08_contract_valid": true,
  "dhr_op05_lane_confirmed": true,
  "existing_dhr_op05_builder_ref": "build_p7_r54_ahr_post_elr19_dhr_op05_bodyfree_leak_promotion_claim_dmd_compatibility_preflight_scan",
  "existing_dhr_op05_assert_ref": "assert_p7_r54_ahr_post_elr19_dhr_op05_bodyfree_leak_promotion_claim_dmd_compatibility_preflight_scan_contract",
  "existing_dhr_op05_schema_version_ref": "cocolon.emlis.p7_r54.ahr.post_elr19.dhr.op05_bodyfree_leak_promotion_claim_dmd_compatibility_preflight_scan.bodyfree.v1",
  "existing_dhr_op05_builder_call_allowed_here": false,
  "existing_dhr_op05_builder_called_here": false,
  "dhr_op05_manual_handoff_envelope_ready": true,
  "dhr_op05_preflight_reentry_candidate_allowed": true,
  "dhr_op05_call_still_requires_separate_explicit_instruction": true,
  "selected_pcm_next_boundary_not_executed": true,
  "dhr_op06_call_allowed_here": false,
  "dmd_r52_execution_allowed_here": false,
  "actual_review_start_allowed_here": false,
  "p8_question_design_allowed_here": false,
  "api_db_rn_runtime_response_key_change_allowed_here": false,
  "release_decision_allowed_here": false,
  "dhb_op04_status_ref": "DHB_STATUS_DHR_OP05_MANUAL_HANDOFF_ENVELOPE_MATERIALIZED_STOPPED",
  "next_required_step": "DHB-OP05_existing_DHR_OP05_compatibility_crosswalk_without_call"
}
```

### 9.4 DHB-OP08 closure JSON案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.post_pcm.dhb.op08_bodyfree_dhr_op05_manual_handoff_boundary_closure.bodyfree.v1",
  "phase": "P7",
  "operation_step_ref": "DHB-OP08_bodyfree_DHR_OP05_manual_handoff_boundary_closure",
  "source_mode": "local_received_zip_only",
  "body_free": true,
  "dhb_op08_status_ref": "DHB_OP08_DHR_OP05_MANUAL_HANDOFF_BOUNDARY_CLOSED_STOPPED",
  "explicit_pcm_op08_dhr_lane_confirmed": true,
  "dhr_op05_manual_handoff_envelope_materialized": true,
  "dhr_op05_call_allowed_here": false,
  "dhr_op05_builder_call_allowed_here": false,
  "dhr_op05_called_here": false,
  "dhr_op05_builder_called_here": false,
  "dhr_op06_called_here": false,
  "dmd_r52_executed_here": false,
  "actual_review_started_here": false,
  "actual_rows_created_here": false,
  "question_need_observation_rows_created_here": false,
  "p8_question_design_started": false,
  "api_db_rn_runtime_response_key_changed": false,
  "full_backend_suite_green_claimed_here": false,
  "rn_contract_green_claimed_here": false,
  "rn_real_device_modal_verified_claimed_here": false,
  "p7_complete": false,
  "release_allowed": false,
  "next_required_step": "stop_before_dhr_op05_call_and_require_separate_explicit_manual_execution_instruction"
}
```

### 9.5 JSON Schema案: DHB-OP04 handoff envelope

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_pcm.dhb.op04_dhr_op05_manual_handoff_envelope_without_call.bodyfree.v1.schema.json",
  "title": "DHB OP04 DHR-OP05 Manual Handoff Envelope Without Call",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "phase",
    "operation_step_ref",
    "source_mode",
    "body_free",
    "pcm_op08_material_ref",
    "pcm_op08_contract_valid",
    "dhr_op05_lane_confirmed",
    "existing_dhr_op05_builder_ref",
    "existing_dhr_op05_assert_ref",
    "existing_dhr_op05_builder_call_allowed_here",
    "existing_dhr_op05_builder_called_here",
    "dhr_op05_manual_handoff_envelope_ready",
    "dhr_op05_preflight_reentry_candidate_allowed",
    "dhr_op05_call_still_requires_separate_explicit_instruction",
    "selected_pcm_next_boundary_not_executed",
    "dhr_op06_call_allowed_here",
    "dmd_r52_execution_allowed_here",
    "actual_review_start_allowed_here",
    "p8_question_design_allowed_here",
    "api_db_rn_runtime_response_key_change_allowed_here",
    "release_decision_allowed_here",
    "dhb_op04_status_ref",
    "next_required_step"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_pcm.dhb.op04_dhr_op05_manual_handoff_envelope_without_call.bodyfree.v1"
    },
    "phase": {
      "const": "P7"
    },
    "operation_step_ref": {
      "const": "DHB-OP04_DHR_OP05_manual_handoff_envelope_without_call"
    },
    "source_mode": {
      "const": "local_received_zip_only"
    },
    "body_free": {
      "const": true
    },
    "pcm_op08_material_ref": {
      "type": "string",
      "minLength": 1,
      "maxLength": 260
    },
    "pcm_op08_contract_valid": {
      "const": true
    },
    "dhr_op05_lane_confirmed": {
      "const": true
    },
    "existing_dhr_op05_builder_ref": {
      "const": "build_p7_r54_ahr_post_elr19_dhr_op05_bodyfree_leak_promotion_claim_dmd_compatibility_preflight_scan"
    },
    "existing_dhr_op05_assert_ref": {
      "const": "assert_p7_r54_ahr_post_elr19_dhr_op05_bodyfree_leak_promotion_claim_dmd_compatibility_preflight_scan_contract"
    },
    "existing_dhr_op05_builder_call_allowed_here": {
      "const": false
    },
    "existing_dhr_op05_builder_called_here": {
      "const": false
    },
    "dhr_op05_manual_handoff_envelope_ready": {
      "const": true
    },
    "dhr_op05_preflight_reentry_candidate_allowed": {
      "const": true
    },
    "dhr_op05_call_still_requires_separate_explicit_instruction": {
      "const": true
    },
    "selected_pcm_next_boundary_not_executed": {
      "const": true
    },
    "dhr_op06_call_allowed_here": {
      "const": false
    },
    "dmd_r52_execution_allowed_here": {
      "const": false
    },
    "actual_review_start_allowed_here": {
      "const": false
    },
    "p8_question_design_allowed_here": {
      "const": false
    },
    "api_db_rn_runtime_response_key_change_allowed_here": {
      "const": false
    },
    "release_decision_allowed_here": {
      "const": false
    },
    "dhb_op04_status_ref": {
      "enum": [
        "DHB_STATUS_DHR_OP05_MANUAL_HANDOFF_ENVELOPE_MATERIALIZED_STOPPED",
        "DHB_STATUS_NOT_DHR_OP05_LANE_NO_HANDOFF_ENVELOPE_STOPPED",
        "DHB_STATUS_REPAIR_REQUIRED_FOR_DHR_OP05_HANDOFF_ENVELOPE_INPUTS",
        "DHB_STATUS_BLOCKED_DHR_OP05_HANDOFF_ENVELOPE_PROMOTION_OR_AUTORUN"
      ]
    },
    "next_required_step": {
      "type": "string",
      "minLength": 1,
      "maxLength": 260
    }
  }
}
```

---

## 10. テスト設計

### 10.1 必須target coverage

```text
OP00:
  - no-execution scopeが固定される
  - DHR-OP05 call / builder call allowedがfalse

OP01:
  - explicit PCM-OP08 materialがあればintake ready
  - missingならwaiting
  - R11 memo / decision table / target green単独ならrepairまたはblocked
  - raw body / question_text / stdout / release claimならblocked

OP02:
  - PCM-OP08 required fieldsを検証する
  - selected boundary executed claimをblockedする
  - DHR-OP05 call claimをblockedする

OP03:
  - DHR-OP05 laneをexact確認する
  - retry/start laneをDHRへ潰さずroute preservedにする
  - wait laneをraw evidence requestへ進めない
  - repair laneをrepair executionへ進めない
  - manual hold / blocked laneをnext design promotionしない

OP04:
  - DHR laneだけmanual handoff envelopeを作る
  - non-DHR laneではenvelopeを作らない
  - existing DHR-OP05 builder refは記録するが呼ばない

OP05:
  - existing DHR-OP05 compatibility refsを記録する
  - DHR-OP05 resultを生成しない
  - DMD direct call / DMH fake finalizer / DHR-OP06 auto callを禁止する

OP06:
  - body-free no-touch guardがclean materialをpassする
  - raw / body / question / terminal / hash / promotion / mutationをblockedする

OP07:
  - validation plan / result memo draftを作る
  - full backend / RN / real-device greenをclaimしない

OP08:
  - closed / non-DHR route preserved / waiting / repair / blockedを閉じる
  - DHR-OP05 call permissionを出さない
  - next_required_stepがstatusごとに正しい
```

### 10.2 禁止系テスト

必ず赤にしてから閉じるべき禁止系は次です。

```text
- PCM R11 decision tableからDHR laneを推測してenvelopeが出る
- PCM target greenだけでDHR lane confirmedになる
- explicit PCM-OP08 materialなしでDHB-OP04 envelopeが出る
- DHR-OP05 builderがmockなしに呼ばれる
- existing DHR-OP05 status clearをDHBが生成する
- DHR-OP05 handoff envelopeがDHR-OP06 next stepを許可する
- question_textが入ってもguardを通る
- release_allowed = trueが入ってもguardを通る
- full_backend_suite_green_claimed_here = trueが入ってもguardを通る
- RN real device verified claimが入ってもguardを通る
```

### 10.3 既存contractへの影響

```text
API:
  変更なし

DB:
  変更なし

RN:
  変更なし

runtime:
  変更なし

response key:
  変更なし

public meta:
  変更なし

subscription / plan guard:
  変更なし
```

DHBはbackend internal-only / body-free result helperです。public response contractへは出しません。

---

## 11. result memo設計

DHB実装時のresult memoには、最低限次を入れます。

```text
front matter:
  code_change
  test_change
  result_memo_added
  api_change: none
  db_change: none
  rn_change: none
  runtime_change: none
  response_key_change: none
  pcm_op08_material_synthesis: none
  pcm_builder_call: none
  dhr_op05_call: none
  dhr_op05_builder_call: none
  dhr_op06_call: none
  dmd_execution: none
  r52_actual_execution: none
  actual_review_start: none
  actual_rows_creation: none
  question_need_observation_rows_creation: none
  p8_start: none
  p8_question_design: none
  question_text_materialization: none
  p7_complete: none
  release_decision: none
  body_free: true
```

本文では次を分けます。

```text
確認済み:
  実装したOP範囲、target result、selected regression result、compileall result

未確認:
  full backend suite、RN contract、RN real-device、DHR-OP05実行、actual review、P8、release

書かれていない:
  greenからexecution permissionへ変換できること

推測禁止:
  DHR handoff envelope = DHR execution result

次に実行すべきこと:
  OP08 closure後のR11 decisionに従う
```

---

## 12. 停止条件

DHBは、次のいずれかがあれば必ず止めます。

```text
- explicit PCM-OP08 materialがない
- PCM-OP08ではなくPCM R11 memo / target result / regression result / compileall resultだけである
- selected_pnt_lane_refが複数ある
- decision_table / all_lane_summary / six_outcome_summaryがsingle materialとして渡されている
- selected_pnt_lane_refがDHR-OP05 laneではない
- selected_pcm_next_boundary_refがDHR-OP05 preflight design without callではない
- selected_pcm_next_boundary_not_executedがtrueではない
- dhr_op05_call_allowed_hereがfalseではない
- dhr_op05_builder_call_allowed_hereがfalseではない
- raw/body/comment_text/question_text/answer_textが混入している
- stdout/stderr/traceback/local_path/hashが混入している
- DHR-OP05実行済みclaimが混入している
- DHR-OP06 / DMD / R52 / actual review / P8 / release claimが混入している
- API / DB / RN / runtime / response key mutation claimが混入している
- full backend suite / RN contract / real-device green claimが混入している
```

---

## 13. Cocolonとして在るべき姿との整合

Cocolonは、ユーザーの言葉をただ保存する場所でも、AIが賢そうにまとめる場所でもありません。入力直後に、ユーザーが「読まれた」と感じ、自分の状態や言葉の置かれ方を見返せる場所を目指しています。

そのために必要なのは、速く次工程へ進むことだけではありません。まだ確認できていないものを、確認済みのように扱わないことです。

DHBは、商品体験から遠い境界作業に見えます。ただ、ここでDHR-OP05 laneを雑に確定したり、DHR-OP05 callを実行済みに見せたりすると、P7のactual review / product read feelへ戻る材料が汚れます。材料が汚れたままP8問いシステムへ行くと、Emlis本体の読感不足を問い返しで隠す設計になりやすいです。

DHBは、その事故を避けるために置く境界です。

```text
問いで逃げない。
実行済みでないものを実行済みにしない。
DHR-OP05へ行く前に、DHR-OP05へ渡してよい材料かを確認する。
```

この順番を守ることが、Cocolonの「人間の言葉を雑に処理しない」姿勢と一致します。

---

## 14. 華恋の意見

華恋としては、次の実装はDHR-OP05本体ではなく、DHBの薄い手動境界から入るのが良いと思います。

理由は、DHR-OP05 helper自体は既にPost-ELR19側に存在していますが、今の問題は「DHR-OP05が存在するか」ではなく、「今のclosed materialをDHR-OP05へ渡してよいと確認できているか」だからです。

ここで既存DHR-OP05 builderを呼ぶ実装にすると、PCM R11で慎重に分けた境界が崩れます。逆にDHBで止めすぎると、R54-AHR系の境界補強が目的化します。だから、DHBの出口は必ず次の形にした方が良いです。

```text
DHBはDHR-OP05へ進める証拠を整える。
DHBはDHR-OP05を呼ばない。
DHB closure後、DHR-OP05 manual callを行うかは別指示・別境界に分ける。
DHR-OP05側が閉じたら、P8へ飛ばず、P7 Product Read Feel / actual review / release decision materialへ戻る出口を確認する。
```

Cocolonとして一番避けたいのは、作業が進んだように見えるけれど、商品読感へ戻る線が薄くなることです。DHBは、その線を消さずに次へ進むための設計にします。

---

## 15. 最終整理

### 15.1 この設計で作るもの

```text
- DHB-OP00〜OP08のbody-free helper設計
- explicit PCM-OP08 DHR lane intake / validation / stop boundary
- DHR-OP05 manual handoff envelope without call
- existing DHR-OP05 compatibility crosswalk without builder call
- no-touch / no-promotion / no-auto-execution guard
- validation plan / result memo draft
- closure and next required step decision
```

### 15.2 この設計で作らないもの

```text
- DHR-OP05実行結果
- DHR-OP06 / DHR-OP07 / DMD / R52結果
- actual review結果
- actual rows / question need observation rows
- P8問い設計
- question_text
- API / DB / RN / runtime / response key変更
- release判断
```

### 15.3 実装段階の最初の一手

実装段階の最初の一手は、次です。

```text
R1: emlis_ai_p7_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_20260708.py を追加し、
    DHB constants / allowed status / forbidden refs / no-execution flagsだけを実装する。
```

この時点では、PCM helperもDHR-OP05 helperも呼びません。  
まず、DHBが「何をしない境界なのか」をコード上で固定します。

### 15.4 実装段階の最終停止点

DHB実装の最終停止点は次です。

```text
DHB-OP08 closure + R10 result memo + R11 next work decision
```

DHB R11でDHR-OP05 lane handoff envelope readyになっても、次はまだDHR-OP05実行ではありません。

```text
next work candidate:
  DHR-OP05 manual call / existing DHR-OP05 preflight scan execution consideration

execution allowance:
  none until separate explicit instruction
```

---
