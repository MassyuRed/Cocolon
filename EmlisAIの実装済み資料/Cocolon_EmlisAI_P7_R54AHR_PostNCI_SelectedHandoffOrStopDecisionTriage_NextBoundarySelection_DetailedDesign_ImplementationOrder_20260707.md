---
title: "Cocolon / EmlisAI P7-R54-AHR Post-NCI Selected Handoff-or-Stop Decision Triage / Next Boundary Selection 詳細設計書・実装順"
created_at: "2026-07-07 JST"
author: "華恋"
work_mode: "共鳴構造モード"
work_type: "詳細設計書 / 実装順 / json・schema案内包"
source_mode: "local_received_zip_only"
github_connection_check: "Mash様指示により不要 / 未実施"
base_pre_design_memo: "Cocolon_EmlisAI_P7_PostNCI_NextStageSelection_PreDesignMemo_20260707.md"
selected_roadmap_phase: "P7 Product Quality Runner / Long-run Product Gate 継続"
selected_design_target: "P7-R54-AHR Post-NCI Selected Handoff-or-Stop Decision Triage / Next Boundary Selection"
recommended_boundary_prefix: "PNT-OP00〜PNT-OP08"
recommended_prefix_meaning: "PNT = Post-NCI Triage"
recommended_helper_shape: "thin explicit-input body-free triage / next boundary selection helper after NCI-OP08; no handoff execution"
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
selected_handoff_or_stop_execution: "none"
dhr_op05_call: "none"
dhr_op05_builder_call: "none"
dhr_op06_call: "none"
dhr_op07_materialization: "none"
dmd_execution: "none"
r52_actual_execution: "none"
p5_finalization: "none"
p6_start: "none"
p8_start: "none"
p8_question_design: "none"
p8_question_implementation: "none"
question_text_materialization: "none"
p7_complete: "none"
release_decision: "none"
current_expected_next_required_step_after_design: "implement_thin_pnt_boundary_and_targets_then_stop_at_next_boundary_selection"
---

# Cocolon / EmlisAI P7-R54-AHR Post-NCI Selected Handoff-or-Stop Decision Triage / Next Boundary Selection 詳細設計書・実装順

対象: Cocolon / EmlisAI / P7 Product Quality Runner / R54-AHR / NCI-OP08後の selected handoff-or-stop decision triage / next boundary selection 境界  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
実装扱い: 本書は設計書です。コード変更・json/schema実ファイル化・actual review実行・DHR-OP05実行・DHR-OP06以降実行・DMD実行・R52実行・P5/P6/P8/P7/release昇格は行いません。  
json / schema実ファイル化: なし。本書内の案のみです。実ファイル化は実装段階で、既存helper・既存schema配置・既存guard・既存test結果を確認して判断します。  
GitHub接続確認: Mash様指定により不要。ローカル受領zip基準。  

---

## 0. 結論

今回の詳細設計対象は、次で固定します。

```text
P7-R54-AHR Post-NCI Selected Handoff-or-Stop Decision Triage / Next Boundary Selection
```

推奨する境界prefixは次です。

```text
PNT-OP00〜PNT-OP08
PNT = Post-NCI Triage
```

PNTの責務は、NCI-OP08で閉じられた `selected_handoff_or_stop_ref` を **実行せずに再読解し、次に設計へ進める候補か、停止・待機・修復へ戻す候補かをbody-freeに選別すること** です。

NCI-OP08は、RDB-OP08で止めた `selected_next_stage_candidate` を実行せず、`selected_handoff_or_stop_ref` として記録して停止する境界です。PNTはその後続ですが、PNT自身も下流実行を開始しません。

本設計で到達してよい状態は、次だけです。

```text
- DHR-OP05 manual handoff boundaryを、次の「設計候補」として選定する。DHR-OP05は呼ばない。
- retry/start routeを、actual local-only review retry/start routeへ戻る「設計候補」として選定する。actual reviewは開始しない。
- waiting external claimを、body-free external claim待機として選定する。raw evidence / body-full packetは要求しない。
- repair routeを、RDB / MRB / DHR upstream result repair境界候補として選定する。repairは実行しない。
- unresolved manual holdを、manual hold / result memo再確認として停止する。
- blockedを、body-free leak / promotion / autorun claim blockとして停止する。
```

本設計で到達してはいけない状態は次です。

```text
- selected_handoff_or_stop_ref の実行
- handoff_or_stop_envelope execution
- DHR-OP05 call / builder call / preflight scan execution
- DHR-OP06 call
- DHR-OP07 materialization
- DMD execution
- R52 actual execution
- actual review start
- actual body-full packet generation
- actual operation receipt / rows / question need observation rows / disposal creation
- P5 finalization
- P6 start
- P8 start
- P8 question design / implementation
- question_text / draft_question_text / answer_text materialization
- API / DB / RN / runtime / response key change
- P7 complete
- release decision
```

重要な分離は次です。

```text
NCI-OP08 closed body-free stopped
  = selected handoff-or-stop envelopeを記録した
  ≠ handoffを実行した
  ≠ DHR-OP05へ進んでよい
  ≠ retry/startへ戻ってよい
  ≠ P8へ進んでよい
  ≠ P7 complete
  ≠ release ready

PNTでDHR-OP05 design candidateが選ばれる
  = 次にDHR-OP05 Manual Handoff Boundary設計を作る候補になり得る
  ≠ DHR-OP05 builder call許可
  ≠ DHR-OP06 / DMD / R52 / P8 / release promotion
```

PNTの最重要ルールは、**NCI-OP08 materialを明示入力として受けること** です。実装段階では、NCI helperのdefault builderを無入力で呼び出して「それらしいNCI-OP08 material」を合成してはいけません。PNTは現在laneを作る境界ではなく、NCI-OP08で実際に閉じられたmaterialを読む境界です。

---

## 1. なぜこの設計を行うのか

Cocolonとして大事なのは、次工程へ進む速度ではありません。ユーザーが置いた言葉を、EmlisAIが「分かったふり」で処理せず、入力直後に読まれた形として返すことです。

この姿勢は、開発工程にも同じように必要です。NCI-OP08で `selected_handoff_or_stop_ref` が見えたからといって、そのrefを実行命令として扱うと、開発工程側が「まだ読んでいないものを読めたことにする」状態になります。

PNTが防ぐ短絡は次です。

```text
NCI-OP08 green
  -> selected_handoff_or_stop_refがある
  -> 次工程を実行してよい
  -> DHR-OP05へ進める
  -> P8に近い
  -> releaseに近い
```

これは危険です。NCIのテストは複数laneを網羅しますが、網羅テストそのものは「現在の実行分岐がどれか」を確定する証拠ではありません。DHR-OP05 / retry-start / waiting / repair / unresolved / blocked の各laneを、現在laneとして雑に読み替えないために、PNTを挟みます。

この設計は境界補強をさらに増やすためではありません。むしろ、R54系で長く続いた境界補強を、どこで止め、どこから商品読感確認へ戻すかを決めるための整理です。

---

## 2. 参照・確認範囲

### 2.1 ローカル受領zip

本設計の基準は、ローカル受領zipと検討メモです。

```text
/mnt/data/Cocolon_前提資料(295).zip
/mnt/data/EmlisAIの実装済み資料(101).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_system_update_20260706(2).zip
/mnt/data/Cocolon(274).zip
/mnt/data/mashos-api(187).zip
/mnt/data/Cocolon_EmlisAI_P7_PostNCI_NextStageSelection_PreDesignMemo_20260707.md
```

GitHub接続確認は、Mash様指定により行いません。

### 2.2 必読前提・作業姿勢

本設計では、次を確認済み前提として扱います。

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/07_latest_snapshot_diff.md
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/work_attitude_rules_for_karen/manifest.json
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
```

固定する作業姿勢は次です。

```text
- 設計と実装を混ぜない。
- 前提資料だけで理解したふりをしない。実ファイル・result memo・テスト結果も見る。
- 見ていないDHR-OP05実行を確認済みにしない。
- NCI-OP08 closureをP7 complete / P8 start / release readyとして扱わない。
- selected_handoff_or_stop_refを自動実行許可として扱わない。
- question need observation materialをP8 question_textへ変換しない。
- public contract / DB / RN / response keyを指示なく変えない。
- body-full / raw input / comment_text / reviewer free text / question_text / local path / hash / terminal bodyをresult memoやpublic metaへ出さない。
```

### 2.3 ロードマップ確認

ロードマップ上、P7はProduct Quality Runner / Long-run Product Gateです。P7/P8 Bridgeでは、P7中に問いシステムを実装せず、P8で勘に頼らないためのbody-free「問いシステム必要性観察メモ」を残す方針が固定されています。

2026-07-06差分では、問いシステムは **EmlisAI core quality gate** と **P8問いUX / サブスク体験** の2層に再配置されています。ただし、その差分でもP7完了条件は緩めず、P7では実装せず観察メモのみ、P8ではcore gateと問いUXを分けて詳細設計する扱いです。

したがって、PNTはP8 question designではありません。

### 2.4 直接接続する実装済み資料

```text
EmlisAIの実装済み資料/
  Cocolon_EmlisAI_P7_R54AHR_PostRDB08_SelectedNextStageCandidateIntake_ManualLaneConfirmation_DetailedDesign_ImplementationOrder_20260706.md

mashos-api/ai/tests/
  R54_AHR_PostRDB08_SelectedNextStageCandidateIntake_NCI_OP00_OP08_Result_20260706.md
```

### 2.5 直接確認した実ファイル

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_20260706.py
  emlis_ai_p7_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_20260705.py
  emlis_ai_p7_r54_ahr_post_dri_dhr_op04_manual_reintake_20260705.py
  emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py

mashos-api/ai/tests/
  test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op00_op01_20260706.py
  test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op02_op03_20260706.py
  test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op04_op05_20260706.py
  test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op06_op07_20260706.py
  test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op08_result_20260706.py
```

---

## 3. 現在地の固定

### 3.1 確認済み

```text
- 現在PhaseはP7 Product Quality Runner / Long-run Product Gate継続。
- 最新基準面では、R54-AHR Post-RDB08 NCI-OP00〜OP08が存在する。
- NCI-OP08は、NCI-OP00〜OP07をbody-free result memoとして閉じ、OP07のhandoff-or-stop envelopeを selected_handoff_or_stop_ref として記録して停止する。
- NCI-OP08は selected_next_stage_candidate を実行しない。
- NCI-OP08は DHR-OP05 / DHR-OP06 / DMD / R52 / P8 / releaseへ進めない。
- NCI target 137 passed、selected regression 167 passed、compileall passedがresult memoと前提資料差分に記録されている。
- P7では問いシステムを実装せず、body-free必要性観察メモに留める。
```

### 3.2 未確認

```text
- full backend suite green。
- RN contract green。
- RN real-device modal verified。
- actual local-only human review execution。
- actual rating rows / blocker rows / question need observation rows / disposal receipt の新規実体。
- NCI-OP08後の現在実行分岐が、DHR-OP05 / retry-start / waiting / repair / unresolved / blocked のどれとして実行材料化されているか。
- DHR-OP05 / DHR-OP06 / DHR-OP07 execution。
- DMD execution。
- R52 actual execution。
- P5 final。
- P6 start。
- P8 start。
- P7 complete。
- release allowed。
```

### 3.3 書かれていない

```text
- NCI-OP08後にP8 question designへ進んでよいとは書かれていない。
- NCI-OP08後にDHR-OP05を呼んでよいとは書かれていない。
- selected_handoff_or_stop_refを実行命令として扱ってよいとは書かれていない。
- 問い必要性観察メモを質問本文へ変換してよいとは書かれていない。
- P7完了条件を緩めてP8開始へ進んでよいとは書かれていない。
```

### 3.4 推測禁止

```text
- all-lane test greenを現在lane確定として扱わない。
- DHR-OP05 candidateをDHR-OP05実行許可として扱わない。
- P8正式候補仕様をP8開始許可として扱わない。
- helper greenを商品読感合格として扱わない。
- P5 surface / Gate / Emlis本文の弱さを問い候補で隠さない。
```

---

## 4. 設計スコープ

### 4.1 扱うこと

PNTで扱うのは、次です。

```text
- PNT-OP00〜PNT-OP08の薄いbody-free helper設計。
- NCI-OP08 body-free result memo closure intake。
- selected_handoff_or_stop_ref / selected_handoff_or_stop_kind_ref / selected_handoff_or_stop_not_executed のshape validation。
- selected_nci_lane_ref と selected_handoff_or_stop_ref の整合確認。
- DHR-OP05 / retry-start / waiting / repair / unresolved / blocked へのPost-NCI triage分類。
- 次設計候補 / 停止候補の分離。
- body-free / no-touch / no-promotion / no-auto-execution guard。
- target tests / selected regression / compileall validation plan。
- result memo closure。
- json / schema案。ただし実ファイル化しない。
```

### 4.2 扱わないこと

PNTでは次を扱いません。

```text
- selected_handoff_or_stop_ref の実行。
- NCI helperの無入力default builderによるOP08合成。
- DHR-OP05 call / builder call / preflight scan。
- DHR-OP06 / DHR-OP07実行。
- DMD execution。
- R52 actual execution。
- actual review start。
- actual rows creation。
- question text / draft_question_text / answer_text / question schema実ファイル化。
- P8 question trigger / answer storage / plan guard実装。
- API / DB / RN / runtime / response key変更。
- full backend / RN / real-device green claim。
- P5 final / P6 start / P8 start / P7 complete / release decision。
```

### 4.3 実装段階での候補ファイル

#### helper候補

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_20260707.py
```

#### test候補

```text
mashos-api/ai/tests/
  test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op00_op01_20260707.py
  test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op02_op03_20260707.py
  test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op04_op05_20260707.py
  test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op06_op07_20260707.py
  test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op08_result_20260707.py
```

#### result memo候補

```text
mashos-api/ai/tests/
  R54_AHR_PostNCI_SelectedHandoffOrStopDecisionTriage_PNT_OP00_OP01_Result_20260707.md
  R54_AHR_PostNCI_SelectedHandoffOrStopDecisionTriage_PNT_OP00_OP03_Result_20260707.md
  R54_AHR_PostNCI_SelectedHandoffOrStopDecisionTriage_PNT_OP00_OP05_Result_20260707.md
  R54_AHR_PostNCI_SelectedHandoffOrStopDecisionTriage_PNT_OP00_OP07_Result_20260707.md
  R54_AHR_PostNCI_SelectedHandoffOrStopDecisionTriage_PNT_OP00_OP08_Result_20260707.md
```

#### schema file候補

実装段階では、まずPython内定数 + assert contractで開始します。schema実ファイル化は行いません。将来、schema実ファイル化が必要になった場合のみ、次を候補にします。

```text
mashos-api/ai/schemas/
  p7_r54_ahr_post_nci_pnt_nci_op08_closure_intake.bodyfree.schema.json
  p7_r54_ahr_post_nci_pnt_selected_handoff_or_stop_shape.bodyfree.schema.json
  p7_r54_ahr_post_nci_pnt_next_boundary_selection.bodyfree.schema.json
  p7_r54_ahr_post_nci_pnt_result_memo_closure.bodyfree.schema.json
```

実装段階で上記schema fileを作る場合も、Mash様の明示指示または実装中の必要性確認なしに追加しません。

---

## 5. Post-NCI入力materialの定義

### 5.1 PNTが読むNCI-OP08 key refs

PNTは、原則としてNCI-OP08 closure materialを **明示入力** として受けます。

必須候補keyは次です。

```text
schema_version
operation_step_ref
nci_op08_status_ref
bodyfree_selected_candidate_intake_closure_status_ref
nci_op08_closed_bodyfree_stopped
selected_nci_status_ref
selected_nci_lane_ref
selected_handoff_or_stop_ref
selected_handoff_or_stop_kind_ref
selected_handoff_or_stop_not_executed
selected_next_design_or_stop_ref
selected_next_design_or_stop_kind_ref
selected_next_design_or_stop_not_executed
rdb08_selected_next_stage_candidate_ref
rdb08_selected_next_stage_candidate_kind_ref
rdb08_selected_next_stage_candidate_not_executed
op07_handoff_or_stop_envelope_ref
op07_handoff_or_stop_envelope_kind_ref
op07_handoff_or_stop_envelope_bodyfree
op07_handoff_envelope_present
op07_stop_envelope_present
validation_command_summary_refs
target_test_result_status_ref
selected_regression_result_status_ref
compileall_result_status_ref
full_backend_suite_green_confirmed
rn_contract_green_confirmed
rn_real_device_modal_verified_claimed_here
nci_op08_does_not_execute_handoff_or_stop_envelope
nci_op08_does_not_execute_selected_next_stage_candidate
nci_op08_does_not_call_dhr_op05
nci_op08_does_not_call_dhr_op06
nci_op08_does_not_execute_dmd_r52_or_release
nci_op08_does_not_start_actual_review
nci_op08_does_not_request_raw_evidence
nci_op08_does_not_execute_repair
nci_op08_does_not_start_p5_p6_p8_p7_or_release
nci_op08_does_not_materialize_p8_question_spec
nci_op08_does_not_change_api_db_rn_runtime_response_key
p8_question_substitution_allowed
p8_start_allowed
release_allowed
question_text_materialized
body_free
```

### 5.2 explicit input required

PNT実装では、次を固定します。

```text
explicit_nci_op08_material_required: true
nci_op08_default_builder_call_allowed: false
nci_op08_default_material_synthesis_allowed: false
nci_op08_test_fixture_generation_allowed_only_inside_tests: true
```

理由は、NCI helperにはテスト用にdefault builder chainが存在し得るためです。PNTが無入力でNCI builderを呼ぶと、現在のNCI-OP08 result memoではなく、helper defaultのlaneを現在laneのように扱う危険があります。

PNTのOP01は、次の方針にします。

```text
- 明示入力のNCI-OP08 materialがなければ waiting。
- NCI-OP08 builderを無入力で呼んでmaterialを合成しない。
- testsではfixture生成のためにNCI builderを使ってよいが、PNT helper本体は「入力がないなら待つ」。
```

### 5.3 body-free safe refs only

PNTでは、NCI-OP08 closureのbody-free safe refsのみを扱います。raw body、comment_text、question_text、reviewer free text、local path、hash、stdout/stderr/tracebackは扱いません。

拒否する代表key / tokenは次です。

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
response_key_changed
p8_question_design_started
p8_question_implementation_started
dhr_op05_called_here
dhr_op05_builder_called_here
dhr_op06_called_here
dhr_op07_materialized_here
dmd_execution_started_here
r52_actual_execution_started_here
release_allowed
p8_start_allowed
```

hashについては、これまでのR54系body-free境界に合わせて、local evidenceや実体bodyへ近づく値としてPNT result memoには持ち込まない方針にします。

---

## 6. selected_handoff_or_stop分類

### 6.1 許可lane

PNTが扱うlaneは、NCIで固定された6系統に限定します。

| PNT分類 | NCI lane ref | NCI selected_handoff_or_stop_ref | PNT outcome |
|---|---|---|---|
| DHR-OP05 design candidate | `dhr_op05_manual_handoff_boundary_design_candidate` | `prepare_post_nci_dhr_op05_manual_handoff_boundary_design_without_call` | 次のDHR-OP05 Manual Handoff Boundary設計候補。実行しない。 |
| retry/start route candidate | `retry_or_start_actual_local_only_review_route_candidate` | `return_to_actual_local_only_review_retry_start_boundary_without_execution` | retry/start route設計候補。actual reviewは開始しない。 |
| wait external claim | `wait_external_bodyfree_claim_reintake_candidate` | `wait_for_external_bodyfree_claim_reintake_without_raw_evidence` | body-free external claim待機。raw evidence要求はしない。 |
| repair candidate | `repair_rdb_candidate_or_upstream_result_candidate` | `repair_rdb_candidate_or_upstream_result_boundary_without_promotion` | repair境界候補。repairは実行しない。 |
| unresolved hold | `manual_hold_unresolved_post_rdb08_candidate` | `manual_hold_post_rdb08_unresolved_without_promotion` | manual hold / result memo再確認停止。 |
| blocked | `blocked_bodyfree_leak_promotion_or_autorun_candidate` | `blocked_post_rdb08_candidate_intake_bodyfree_leak_or_promotion` | block停止。次設計へ進めない。 |

### 6.2 envelope kind整合

PNTでは、`selected_handoff_or_stop_kind_ref` も検査します。

```text
handoff envelope:
  bodyfree_handoff_envelope_draft_without_execution
  許可lane:
    DHR-OP05 design candidate
    retry/start route candidate
    wait external claim candidate
    repair candidate

stop envelope:
  bodyfree_stop_envelope_draft_without_promotion
  許可lane:
    unresolved hold
    blocked
```

次はrepair扱いまたはblocked扱いにします。

```text
- DHR-OP05 / retry / wait / repair laneなのにstop envelopeになっている。
- unresolved / blocked laneなのにhandoff envelopeになっている。
- selected_handoff_or_stop_ref と selected_next_design_or_stop_ref が異なる。
- selected_handoff_or_stop_kind_ref と selected_next_design_or_stop_kind_ref が矛盾する。
- selected_handoff_or_stop_not_executed != true。
- rdb08_selected_next_stage_candidate_not_executed != true。
```

### 6.3 DHR-OP05 candidateの扱い

DHR-OP05 candidateは、最も誤読しやすい候補です。

PNTで言ってよいこと:

```text
DHR-OP05 manual handoff boundaryを次に設計検討してよい候補。
DHR-OP05既存operation refを確認するためのbody-free material。
DHR-OP05を呼ばないPost-NCI selection result。
```

PNTで言ってはいけないこと:

```text
DHR-OP05を実行する。
DHR-OP05 preflight scanを呼ぶ。
DHR-OP06へ進める。
DMDへ進める。
R52へ進める。
P8へ進める。
P7 complete / release ready。
```

### 6.4 DHR-OP05以外の扱い

DHR-OP05 candidate以外は、すべて「DHR-OP05へ直行しない」根拠として扱います。

```text
retry/start route:
  actual local-only review retry/start routeへ戻す候補。
  ただしactual reviewは開始しない。
  既存ALR/ELR/DMD系の境界と重複しないか、次設計時に確認する。

wait external claim:
  body-free external claim待機。
  raw evidence / body-full packet / local path / hash を要求しない。

repair route:
  RDB candidate / MRB08 / DHR upstream resultのrepair境界候補。
  repairは実行しない。

unresolved hold:
  manual hold / result memo再確認。
  次設計へ進めない。

blocked:
  body-free leak / promotion / autorun claim block。
  次設計へ進めない。
```

---

## 7. PNT-OP00〜OP08 詳細設計

### PNT-OP00: scope / explicit-input / no-execution refreeze after NCI-OP08

#### 目的

NCI-OP08後のPNT境界であることを宣言し、PNTがhandoff-or-stopを実行しない境界であることを固定します。

#### 入力

```text
review_session_id: optional safe id
```

#### 出力主要refs

```text
schema_version
operation_step_ref = PNT-OP00_scope_explicit_input_no_execution_refreeze_after_NCI_OP08
pnt_scope_refrozen = true
explicit_nci_op08_material_required = true
nci_op08_default_builder_call_allowed = false
selected_handoff_or_stop_execution_allowed_here = false
dhr_op05_call_allowed_here = false
p8_question_design_allowed_here = false
api_db_rn_response_key_change_allowed_here = false
next_required_step = PNT-OP01
body_free = true
```

#### forbidden

```text
- NCI-OP08 materialを合成しない。
- DHR-OP05 / P8 / releaseを開始しない。
- API / DB / RN / response key変更を含めない。
```

#### target test観点

```text
- OP00がscope / explicit input required / no-executionを固定する。
- OP00がNCI-OP08 builderを呼ばない。
- OP00がpublic contract mutationを拒否する。
- OP00がbody-like top-level keyを拒否する。
```

---

### PNT-OP01: explicit NCI-OP08 body-free result memo closure intake

#### 目的

NCI-OP08 result memo closureをbody-freeに取り込み、closureとして読めるかだけを確認します。この段階では次boundaryを選定しません。

#### 入力

```text
nci_op08_bodyfree_selected_candidate_intake_result_memo_closure: explicit Mapping
```

#### 分岐

```text
valid closed NCI-OP08:
  PNT_STATUS_NCI_OP08_CLOSURE_INTAKE_READY_FOR_HANDOFF_OR_STOP_SHAPE
  next_required_step = PNT-OP02

missing NCI-OP08 material:
  PNT_STATUS_WAITING_FOR_EXPLICIT_NCI_OP08_CLOSURE
  next_required_step = wait_for_explicit_nci_op08_bodyfree_result_memo_closure

NCI-OP08 waiting:
  PNT_STATUS_WAITING_FOR_NCI_OP08_TO_CLOSE
  next_required_step = wait_for_nci_op08_closure_before_post_nci_triage

NCI-OP08 repair:
  PNT_STATUS_REPAIR_REQUIRED_FOR_NCI_OP08_BEFORE_POST_NCI_TRIAGE
  next_required_step = repair_nci_op08_closure_before_post_nci_triage

NCI-OP08 blocked / forbidden payload / promotion claim:
  PNT_STATUS_BLOCKED_NCI_OP08_BODYFREE_LEAK_PROMOTION_OR_AUTORUN
  next_required_step = blocked_post_nci_triage_due_to_nci_op08_block
```

#### 必須検査

```text
- operation_step_ref が NCI-OP08 closureである。
- nci_op08_closed_bodyfree_stopped == true の場合だけOP02へ進む。
- selected_handoff_or_stop_not_executed == true はOP02で本格検査するが、OP01でも存在を確認する。
- body_free == true。
- full_backend_suite_green_confirmed / rn_contract_green_confirmed / rn_real_device_modal_verified_claimed_here は false。
- p8_start_allowed / release_allowed / question_text_materialized は false。
- forbidden payload / no-touch mutation / promotion claimがない。
```

#### target test観点

```text
- explicit NCI-OP08 closureを受け、OP02 readyになる。
- NCI-OP08 material missingならwaiting。
- NCI-OP08 waiting / repair / blocked statusを下流実行へ変換しない。
- body-like / question_text / raw evidence keyを含む入力をblockedする。
- OP01はnext boundaryをまだ選定しない。
```

---

### PNT-OP02: selected_handoff_or_stop shape validation

#### 目的

NCI-OP08から取り込んだ `selected_handoff_or_stop_ref` の形状を検査します。selected ref / kind / not_executed / lane / envelope kindが許可された形かを確認します。

#### 入力

```text
PNT-OP01 intake material
```

#### 検査対象

```text
selected_nci_lane_ref
selected_handoff_or_stop_ref
selected_handoff_or_stop_kind_ref
selected_handoff_or_stop_not_executed
selected_next_design_or_stop_ref
selected_next_design_or_stop_kind_ref
selected_next_design_or_stop_not_executed
rdb08_selected_next_stage_candidate_ref
rdb08_selected_next_stage_candidate_kind_ref
rdb08_selected_next_stage_candidate_not_executed
op07_handoff_or_stop_envelope_kind_ref
op07_handoff_or_stop_envelope_bodyfree
```

#### 分岐

```text
shape valid:
  PNT_STATUS_SELECTED_HANDOFF_OR_STOP_SHAPE_VALID_STOPPED
  next_required_step = PNT-OP03

missing / unknown selected_handoff_or_stop_ref:
  PNT_STATUS_REPAIR_REQUIRED_FOR_SELECTED_HANDOFF_OR_STOP_SHAPE
  next_required_step = repair_selected_handoff_or_stop_shape_without_downstream_promotion

not_executed false / promotion claim / body leak:
  PNT_STATUS_BLOCKED_SELECTED_HANDOFF_OR_STOP_BODYFREE_LEAK_PROMOTION_OR_AUTORUN
  next_required_step = blocked_selected_handoff_or_stop_shape_leak_promotion_or_autorun
```

#### target test観点

```text
- 全6分類のselected_handoff_or_stop_refをshape validにする。
- missing selected_handoff_or_stop_refをrepairにする。
- unknown ref / unknown kindをrepairにする。
- selected_handoff_or_stop_not_executed != trueをblockedにする。
- selected_handoff_or_stop_ref と selected_next_design_or_stop_ref の不一致をrepairにする。
- handoff / stop envelope kind mismatchをrepairにする。
- question_text / raw_input / local_path / hash / stdout tokenをblockedする。
```

---

### PNT-OP03: selected handoff-or-stop lane consistency resolver

#### 目的

OP02でshape validになったmaterialを、PNT分類へ解決します。ここで初めて、DHR-OP05 / retry-start / waiting / repair / unresolved / blocked のどれかをPNTとして選びます。

#### 分類status

```text
PNT_STATUS_DHR_OP05_MANUAL_HANDOFF_BOUNDARY_DESIGN_CANDIDATE_STOPPED
PNT_STATUS_RETRY_START_ROUTE_BOUNDARY_DESIGN_CANDIDATE_STOPPED
PNT_STATUS_WAIT_EXTERNAL_BODYFREE_CLAIM_HOLD_STOPPED
PNT_STATUS_REPAIR_BOUNDARY_DESIGN_CANDIDATE_STOPPED
PNT_STATUS_MANUAL_HOLD_UNRESOLVED_STOPPED
PNT_STATUS_BLOCKED_BODYFREE_LEAK_PROMOTION_OR_AUTORUN_STOPPED
```

#### 出力主要refs

```text
selected_pnt_status_ref
selected_pnt_lane_ref
selected_pnt_triage_kind_ref
selected_pnt_outcome_group_ref
selected_handoff_or_stop_ref
selected_handoff_or_stop_kind_ref
selected_handoff_or_stop_not_executed
selected_post_nci_next_boundary_candidate_ref
selected_post_nci_next_boundary_candidate_kind_ref
selected_post_nci_next_boundary_not_executed = true
```

#### lane flag

次のうち、必ず1つだけtrueにします。

```text
dhr_op05_manual_handoff_boundary_design_candidate_present
retry_start_route_boundary_candidate_present
wait_external_bodyfree_claim_hold_present
repair_boundary_candidate_present
manual_hold_unresolved_stop_present
blocked_bodyfree_promotion_autorun_stop_present
```

#### target test観点

```text
- DHR-OP05 laneをDHR-OP05 design candidateとして解決するがDHR-OP05を呼ばない。
- retry/start laneをretry/start boundary candidateとして解決するがactual reviewを開始しない。
- waiting laneをexternal body-free claim holdとして解決するがraw evidenceを要求しない。
- repair laneをrepair boundary candidateとして解決するがrepairを実行しない。
- unresolved laneをmanual hold stopとして解決する。
- blocked laneをblocked stopとして解決する。
- 6つのlane flagのうち1つだけtrueである。
```

---

### PNT-OP04: next boundary selection materialization

#### 目的

OP03で解決したPNT分類を、次に扱えるbody-free selection materialへ変換します。ここで作るのは **実行指示** ではなく、次の設計候補または停止候補です。

#### outcome group

```text
next_design_candidate:
  DHR-OP05 manual handoff boundary
  retry/start route boundary
  repair boundary

wait_hold:
  wait external body-free claim

stop:
  unresolved manual hold
  blocked
```

#### 出力主要refs

```text
pnt_op04_status_ref
selected_post_nci_outcome_group_ref
selected_post_nci_next_boundary_ref
selected_post_nci_next_boundary_kind_ref
selected_post_nci_next_boundary_not_executed = true
selected_post_nci_next_boundary_execution_allowed_here = false
next_design_document_candidate_ref
next_design_document_allowed = boolean
manual_wait_required = boolean
manual_stop_required = boolean
repair_design_candidate = boolean
```

#### 分類別material

```text
DHR-OP05 design candidate:
  selected_post_nci_next_boundary_ref = prepare_post_nci_dhr_op05_manual_handoff_boundary_design_without_call
  next_design_document_candidate_ref = P7-R54-AHR Post-NCI DHR-OP05 Manual Handoff Boundary / Preflight Re-entry Design Candidate
  next_design_document_allowed = true
  dhr_op05_call_allowed_here = false

retry/start candidate:
  selected_post_nci_next_boundary_ref = return_to_actual_local_only_review_retry_start_boundary_without_execution
  next_design_document_candidate_ref = P7-R54-AHR Post-NCI Actual Local-Only Review Retry/Start Boundary Selection Candidate
  next_design_document_allowed = true
  actual_review_start_allowed_here = false

waiting external claim:
  selected_post_nci_next_boundary_ref = wait_for_external_bodyfree_claim_reintake_without_raw_evidence
  next_design_document_allowed = false unless a separate wait/reintake design is explicitly requested
  manual_wait_required = true
  raw_evidence_request_allowed_here = false

repair candidate:
  selected_post_nci_next_boundary_ref = repair_rdb_candidate_or_upstream_result_boundary_without_promotion
  next_design_document_candidate_ref = P7-R54-AHR Post-NCI RDB/Upstream Result Repair Boundary Candidate
  next_design_document_allowed = true
  repair_execution_allowed_here = false

unresolved hold:
  selected_post_nci_next_boundary_ref = manual_hold_post_rdb08_unresolved_without_promotion
  next_design_document_allowed = false
  manual_stop_required = true

blocked:
  selected_post_nci_next_boundary_ref = blocked_post_rdb08_candidate_intake_bodyfree_leak_or_promotion
  next_design_document_allowed = false
  manual_stop_required = true
```

#### target test観点

```text
- DHR-OP05 laneでDHR-OP05 design document candidateを作るがbuilderを呼ばない。
- retry/start laneでretry/start design candidateを作るがactual reviewを開始しない。
- waiting laneでmanual wait materialを作るがraw evidenceを要求しない。
- repair laneでrepair design candidateを作るがrepairを実行しない。
- unresolved/blocked laneでstop materialを作る。
- OP04 outputをP8 question design candidateに変換しない。
```

---

### PNT-OP05: body-free / no-touch / no-promotion / no-auto-execution guard

#### 目的

PNT-OP00〜OP04とNCI-OP08 inputが、body-free / no-touch / no-promotion / no-auto-executionを維持しているかを検査します。

#### guard対象

```text
PNT-OP00 material
PNT-OP01 NCI-OP08 intake
PNT-OP02 selected_handoff_or_stop shape
PNT-OP03 triage resolver
PNT-OP04 next boundary selection
```

#### forbidden scan

```text
forbidden payload key paths
body-like value paths
promotion claim refs
no-touch mutation paths
```

#### status

```text
PNT_STATUS_BODYFREE_NO_TOUCH_NO_PROMOTION_NO_AUTO_EXECUTION_GUARD_PASSED
PNT_STATUS_REPAIR_REQUIRED_FOR_BODYFREE_NO_TOUCH_NO_PROMOTION_GUARD_INPUTS
PNT_STATUS_BLOCKED_BODYFREE_NO_TOUCH_NO_PROMOTION_NO_AUTO_EXECUTION_GUARD
```

#### guardで必ずfalseにするもの

```text
selected_handoff_or_stop_executed_here
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

#### target test観点

```text
- all valid laneでguard passする。
- selected_handoff_or_stop execution claimをblockedする。
- DHR-OP05 / DHR-OP06 / DMD / R52 / P8 / release promotion flagをblockedする。
- API / DB / RN / response key changed tokenをblockedする。
- body-like / question_text / raw evidence / local path / hash / stdout tokenをblockedする。
```

---

### PNT-OP06: selected regression / compileall validation plan

#### 目的

PNT target tests、NCI selected regression、compileallの計画refsを記録します。OP06はテストを実行しません。実装時にresult memoへ実行結果を記録します。

#### target refs候補

```text
tests/test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op00_op01_20260707.py
tests/test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op02_op03_20260707.py
tests/test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op04_op05_20260707.py
tests/test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op06_op07_20260707.py
tests/test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op08_result_20260707.py
```

#### selected regression refs候補

```text
tests/test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op00_op01_20260706.py
tests/test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op02_op03_20260706.py
tests/test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op04_op05_20260706.py
tests/test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op06_op07_20260706.py
tests/test_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_nci_op08_result_20260706.py
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

#### compileall refs候補

```text
services/ai_inference/emlis_ai_p7_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_20260707.py
services/ai_inference/emlis_ai_p7_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_20260706.py
services/ai_inference/emlis_ai_p7_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_20260705.py
services/ai_inference/emlis_ai_p7_r54_ahr_post_dri_dhr_op04_manual_reintake_20260705.py
services/ai_inference/emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py
```

#### status

```text
PNT_STATUS_SELECTED_REGRESSION_COMPILEALL_VALIDATION_PLAN_RECORDED
PNT_STATUS_WAITING_FOR_OP05_GUARD_BEFORE_VALIDATION_PLAN
PNT_STATUS_REPAIR_REQUIRED_FOR_VALIDATION_PLAN_INPUTS
PNT_STATUS_BLOCKED_VALIDATION_PLAN_BODYFREE_LEAK_PROMOTION_OR_AUTORUN
```

#### target test観点

```text
- OP06 records PNT target tests / selected regression / compileall refs。
- OP06 does not execute pytest。
- OP06 does not claim full backend / RN / real-device green。
- OP05 guardがpassしていない場合、OP08へ進めない。
```

---

### PNT-OP07: post-NCI triage result memo draft material

#### 目的

OP04のnext boundary selectionとOP05/OP06のguard・validation planを統合し、OP08 closureへ渡すbody-free result memo draftを作ります。

#### status

```text
PNT_STATUS_RESULT_MEMO_DRAFT_MATERIALIZED_STOPPED
PNT_STATUS_STOP_RESULT_MEMO_DRAFT_MATERIALIZED_STOPPED
PNT_STATUS_REPAIR_REQUIRED_FOR_RESULT_MEMO_DRAFT_INPUTS
PNT_STATUS_BLOCKED_RESULT_MEMO_DRAFT_BODYFREE_LEAK_PROMOTION_OR_AUTORUN
```

#### 出力主要refs

```text
pnt_op07_status_ref
post_nci_triage_result_memo_draft_ref
post_nci_triage_result_memo_draft_bodyfree = true
selected_post_nci_outcome_group_ref
selected_post_nci_next_boundary_ref
selected_post_nci_next_boundary_kind_ref
selected_post_nci_next_boundary_not_executed
next_design_document_candidate_ref
next_design_document_allowed
manual_wait_required
manual_stop_required
validation_command_summary_refs
pnt_op07_ready_for_op08
```

#### target test観点

```text
- OP07 creates result memo draft for all valid selection outcomes without execution。
- OP07 creates stop draft for unresolved/blocked lanes。
- OP07 stops when guard invalid or validation plan invalid。
- OP07 does not materialize P8 question design spec。
```

---

### PNT-OP08: body-free result memo closure with next boundary selection

#### 目的

PNT-OP00〜OP07をbody-free result memoとして閉じ、最終的な `selected_post_nci_next_boundary_ref` を記録して停止します。

#### status

```text
PNT_OP08_BODYFREE_POST_NCI_TRIAGE_CLOSED_STOPPED
PNT_OP08_WAITING_FOR_NCI_OP08_OR_PNT_INPUT_REFS
PNT_OP08_REPAIR_REQUIRED_FOR_POST_NCI_TRIAGE_INPUTS
PNT_OP08_BLOCKED_BODYFREE_LEAK_PROMOTION_OR_AUTORUN
```

#### 出力主要refs

```text
schema_version
operation_step_ref = PNT-OP08_bodyfree_post_nci_triage_result_memo_closure
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
nci_op08_status_ref
nci_op08_material_ref
nci_op08_contract_valid
next_design_document_candidate_ref
next_design_document_allowed
manual_wait_required
manual_stop_required
repair_design_candidate
validation_command_summary_refs
target_test_result_status_ref
selected_regression_result_status_ref
compileall_result_status_ref
full_backend_suite_green_confirmed = false
rn_contract_green_confirmed = false
rn_real_device_modal_verified_claimed_here = false
dhr_op05_not_called = true
dhr_op06_not_called = true
dmd_r52_not_executed = true
p5_p6_p8_p7_release_not_started = true
p8_question_design_not_started = true
p8_question_implementation_not_started = true
api_db_rn_runtime_response_key_not_changed = true
body_free = true
```

#### 完了時の意味

```text
PNT-OP08 records the selected next boundary or stop outcome after NCI-OP08.
It does not execute the selected handoff-or-stop.
It does not start downstream builders.
```

#### target test観点

```text
- OP08 closes all valid outcomes body-free。
- OP08 records selected_post_nci_next_boundary_ref but does not execute it。
- OP08 rejects DHR-OP05 call claim。
- OP08 rejects P8 question design/start claim。
- OP08 rejects release/full backend/RN green claim mutation。
- OP08 waits when required OP refs are missing。
- OP08 repairs invalid OP07 result memo draft。
- OP08 blocks body-like result memo / promotion claim。
- OP08 full-title aliases match short builders/asserts。
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
- NCI-OP08 materialはexplicit input requiredにする。
```

### R1: helper skeleton / constants

```text
- emlis_ai_p7_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_20260707.py を追加する。
- PNT prefix / schema_version / operation_step_ref / allowed status / allowed lane / allowed selected ref / forbidden tokenを定義する。
- 既存NCI moduleから参照するのは、必要なpublic constants / assert contract中心にする。
- PNT helper本体ではNCI-OP08 builderを無入力で呼ばない。
```

### R2: OP00 / OP01 実装 + tests

```text
- OP00: scope / explicit-input / no-execution refreeze。
- OP01: explicit NCI-OP08 closure intake。
- tests: missing input waiting、valid closure intake、NCI waiting/repair/blockedの非昇格、body leak block。
- result memo: PNT_OP00_OP01。
```

### R3: OP02 / OP03 実装 + tests

```text
- OP02: selected_handoff_or_stop shape validation。
- OP03: lane consistency resolver。
- tests: 6 lane mapping、not_executed false block、ref/kind mismatch repair、envelope kind mismatch repair。
- result memo: PNT_OP00_OP03。
```

### R4: OP04 / OP05 実装 + tests

```text
- OP04: next boundary selection materialization。
- OP05: body-free / no-touch / no-promotion / no-auto-execution guard。
- tests: design candidate / wait / stop materialization、DHR/P8/release/API/DB/RN/body payload block。
- result memo: PNT_OP00_OP05。
```

### R5: OP06 / OP07 実装 + tests

```text
- OP06: validation plan refs。
- OP07: result memo draft material。
- tests: validation refs recorded、no full backend/RN/real-device claim、OP07 ready/stop/repair/block branches。
- result memo: PNT_OP00_OP07。
```

### R6: OP08 実装 + tests

```text
- OP08: body-free result memo closure with next boundary selection。
- tests: all outcomes closure、selected_next_boundary_not_executed、non-closed input handling、promotion mutation rejection、full-title alias。
- result memo: PNT_OP00_OP08。
```

### R7: target validation

```bash
cd mashos-api/ai

PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference pytest -q --assert=plain \
  tests/test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op00_op01_20260707.py \
  tests/test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op02_op03_20260707.py \
  tests/test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op04_op05_20260707.py \
  tests/test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op06_op07_20260707.py \
  tests/test_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op08_result_20260707.py \
  -p no:cacheprovider
```

結果は実装段階で記録します。設計段階ではpass数を主張しません。

### R8: selected regression

```bash
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 PYTHONPATH=services/ai_inference pytest -q --assert=plain \
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

結果は実装段階で記録します。既存の167 passedを自動継承して主張しません。

### R9: compileall

```bash
PYTHONPATH=services/ai_inference python -m compileall -q \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_20260707.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_rdb08_selected_next_stage_candidate_intake_20260706.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_20260705.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_dri_dhr_op04_manual_reintake_20260705.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py
```

### R10: result memo closure

```text
- PNT_OP00_OP08 result memoを作成する。
- 実行したtarget / selected regression / compileallだけを記録する。
- full backend suite green / RN contract green / RN real-device verifiedは、実行していなければfalse / not claimedにする。
- DHR-OP05 / P8 / release非実行を明記する。
```

### R11: 次作業判断

PNT-OP08結果により、次のみに分けます。

```text
DHR-OP05 design candidate:
  次の設計書候補 = P7-R54-AHR Post-NCI DHR-OP05 Manual Handoff Boundary / Preflight Re-entry Design Candidate
  DHR-OP05実行はまだ不可。

retry/start candidate:
  次の設計書候補 = Actual Local-Only Review Retry/Start Boundary Selection Candidate
  既存ALR/ELR/DMD系との重複を確認してから設計。
  actual review実行はまだ不可。

wait external claim:
  設計へ進めず、body-free external claim待機。

repair candidate:
  次の設計書候補 = RDB/Upstream Result Repair Boundary Candidate
  repair実行はまだ不可。

unresolved / blocked:
  停止。次設計へ進めない。
```

---

## 9. 実装時の関数・定数命名案

### 9.1 step refs

```python
P7_R54_AHR_POST_NCI_PNT_OP00_STEP_REF = "PNT-OP00_scope_explicit_input_no_execution_refreeze_after_NCI_OP08"
P7_R54_AHR_POST_NCI_PNT_OP01_STEP_REF = "PNT-OP01_explicit_NCI_OP08_bodyfree_result_memo_closure_intake"
P7_R54_AHR_POST_NCI_PNT_OP02_STEP_REF = "PNT-OP02_selected_handoff_or_stop_shape_validation"
P7_R54_AHR_POST_NCI_PNT_OP03_STEP_REF = "PNT-OP03_selected_handoff_or_stop_lane_consistency_resolver"
P7_R54_AHR_POST_NCI_PNT_OP04_STEP_REF = "PNT-OP04_next_boundary_selection_materialization"
P7_R54_AHR_POST_NCI_PNT_OP05_STEP_REF = "PNT-OP05_bodyfree_no_touch_no_promotion_no_auto_execution_guard"
P7_R54_AHR_POST_NCI_PNT_OP06_STEP_REF = "PNT-OP06_selected_regression_compileall_validation_plan"
P7_R54_AHR_POST_NCI_PNT_OP07_STEP_REF = "PNT-OP07_post_nci_triage_result_memo_draft_material"
P7_R54_AHR_POST_NCI_PNT_OP08_STEP_REF = "PNT-OP08_bodyfree_post_nci_triage_result_memo_closure"
```

### 9.2 builder / assert names

```python
build_p7_r54_ahr_post_nci_pnt_op00_scope_explicit_input_no_execution_refreeze_after_nci_op08
assert_p7_r54_ahr_post_nci_pnt_op00_scope_explicit_input_no_execution_refreeze_after_nci_op08_contract

build_p7_r54_ahr_post_nci_pnt_op01_explicit_nci_op08_bodyfree_result_memo_closure_intake
assert_p7_r54_ahr_post_nci_pnt_op01_explicit_nci_op08_bodyfree_result_memo_closure_intake_contract

build_p7_r54_ahr_post_nci_pnt_op02_selected_handoff_or_stop_shape_validation
assert_p7_r54_ahr_post_nci_pnt_op02_selected_handoff_or_stop_shape_validation_contract

build_p7_r54_ahr_post_nci_pnt_op03_selected_handoff_or_stop_lane_consistency_resolver
assert_p7_r54_ahr_post_nci_pnt_op03_selected_handoff_or_stop_lane_consistency_resolver_contract

build_p7_r54_ahr_post_nci_pnt_op04_next_boundary_selection_materialization
assert_p7_r54_ahr_post_nci_pnt_op04_next_boundary_selection_materialization_contract

build_p7_r54_ahr_post_nci_pnt_op05_bodyfree_no_touch_no_promotion_no_auto_execution_guard
assert_p7_r54_ahr_post_nci_pnt_op05_bodyfree_no_touch_no_promotion_no_auto_execution_guard_contract

build_p7_r54_ahr_post_nci_pnt_op06_selected_regression_compileall_validation_plan
assert_p7_r54_ahr_post_nci_pnt_op06_selected_regression_compileall_validation_plan_contract

build_p7_r54_ahr_post_nci_pnt_op07_post_nci_triage_result_memo_draft_material
assert_p7_r54_ahr_post_nci_pnt_op07_post_nci_triage_result_memo_draft_material_contract

build_p7_r54_ahr_post_nci_pnt_op08_bodyfree_post_nci_triage_result_memo_closure
assert_p7_r54_ahr_post_nci_pnt_op08_bodyfree_post_nci_triage_result_memo_closure_contract
```

### 9.3 full-title aliases

既存NCIのtest可読性に合わせて、full-title aliasを用意します。

```python
build_p7_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op08_bodyfree_post_nci_triage_result_memo_closure = (
    build_p7_r54_ahr_post_nci_pnt_op08_bodyfree_post_nci_triage_result_memo_closure
)

assert_p7_r54_ahr_post_nci_selected_handoff_or_stop_decision_triage_pnt_op08_bodyfree_post_nci_triage_result_memo_closure_contract = (
    assert_p7_r54_ahr_post_nci_pnt_op08_bodyfree_post_nci_triage_result_memo_closure_contract
)
```

---

## 10. json / schema案

本章のjson/schemaは設計案です。実ファイル化は行いません。実装段階では、既存RDB/NCI helperと同じく、まずPython内定数 + assert contractで安全に閉じる方針を推奨します。

### 10.1 PNT-OP01 NCI-OP08 closure intake schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_nci.pnt.nci_op08_closure_intake.bodyfree.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "body_free",
    "explicit_nci_op08_material_required",
    "nci_op08_material_present",
    "nci_op08_contract_valid",
    "nci_op08_status_ref",
    "nci_op08_closed_bodyfree_stopped",
    "selected_handoff_or_stop_ref_present",
    "selected_handoff_or_stop_not_executed_present",
    "pnt_op01_status_ref",
    "next_required_step"
  ],
  "properties": {
    "schema_version": {
      "const": "p7_r54_ahr_post_nci_pnt_op01_nci_op08_closure_intake.bodyfree.v1"
    },
    "operation_step_ref": {
      "const": "PNT-OP01_explicit_NCI_OP08_bodyfree_result_memo_closure_intake"
    },
    "body_free": { "const": true },
    "explicit_nci_op08_material_required": { "const": true },
    "nci_op08_default_builder_call_allowed": { "const": false },
    "nci_op08_material_present": { "type": "boolean" },
    "nci_op08_contract_valid": { "type": "boolean" },
    "nci_op08_status_ref": { "type": "string", "maxLength": 260 },
    "nci_op08_closed_bodyfree_stopped": { "type": "boolean" },
    "selected_handoff_or_stop_ref_present": { "type": "boolean" },
    "selected_handoff_or_stop_not_executed_present": { "type": "boolean" },
    "pnt_op01_status_ref": {
      "enum": [
        "PNT_STATUS_NCI_OP08_CLOSURE_INTAKE_READY_FOR_HANDOFF_OR_STOP_SHAPE",
        "PNT_STATUS_WAITING_FOR_EXPLICIT_NCI_OP08_CLOSURE",
        "PNT_STATUS_WAITING_FOR_NCI_OP08_TO_CLOSE",
        "PNT_STATUS_REPAIR_REQUIRED_FOR_NCI_OP08_BEFORE_POST_NCI_TRIAGE",
        "PNT_STATUS_BLOCKED_NCI_OP08_BODYFREE_LEAK_PROMOTION_OR_AUTORUN"
      ]
    },
    "next_required_step": { "type": "string", "maxLength": 360 }
  }
}
```

### 10.2 PNT-OP02 selected handoff-or-stop shape schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_nci.pnt.selected_handoff_or_stop_shape.bodyfree.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "body_free",
    "selected_nci_lane_ref",
    "selected_handoff_or_stop_ref",
    "selected_handoff_or_stop_kind_ref",
    "selected_handoff_or_stop_not_executed",
    "selected_next_design_or_stop_ref",
    "selected_next_design_or_stop_kind_ref",
    "selected_next_design_or_stop_not_executed",
    "rdb08_selected_next_stage_candidate_not_executed",
    "handoff_or_stop_envelope_kind_consistent",
    "pnt_op02_status_ref",
    "next_required_step"
  ],
  "properties": {
    "schema_version": {
      "const": "p7_r54_ahr_post_nci_pnt_op02_selected_handoff_or_stop_shape.bodyfree.v1"
    },
    "operation_step_ref": {
      "const": "PNT-OP02_selected_handoff_or_stop_shape_validation"
    },
    "body_free": { "const": true },
    "selected_nci_lane_ref": {
      "enum": [
        "dhr_op05_manual_handoff_boundary_design_candidate",
        "retry_or_start_actual_local_only_review_route_candidate",
        "wait_external_bodyfree_claim_reintake_candidate",
        "repair_rdb_candidate_or_upstream_result_candidate",
        "manual_hold_unresolved_post_rdb08_candidate",
        "blocked_bodyfree_leak_promotion_or_autorun_candidate"
      ]
    },
    "selected_handoff_or_stop_ref": { "type": "string", "maxLength": 360 },
    "selected_handoff_or_stop_kind_ref": {
      "enum": [
        "bodyfree_handoff_envelope_draft_without_execution",
        "bodyfree_stop_envelope_draft_without_promotion"
      ]
    },
    "selected_handoff_or_stop_not_executed": { "const": true },
    "selected_next_design_or_stop_ref": { "type": "string", "maxLength": 360 },
    "selected_next_design_or_stop_kind_ref": { "type": "string", "maxLength": 360 },
    "selected_next_design_or_stop_not_executed": { "const": true },
    "rdb08_selected_next_stage_candidate_not_executed": { "const": true },
    "handoff_or_stop_envelope_kind_consistent": { "type": "boolean" },
    "pnt_op02_status_ref": {
      "enum": [
        "PNT_STATUS_SELECTED_HANDOFF_OR_STOP_SHAPE_VALID_STOPPED",
        "PNT_STATUS_REPAIR_REQUIRED_FOR_SELECTED_HANDOFF_OR_STOP_SHAPE",
        "PNT_STATUS_BLOCKED_SELECTED_HANDOFF_OR_STOP_BODYFREE_LEAK_PROMOTION_OR_AUTORUN"
      ]
    },
    "next_required_step": { "type": "string", "maxLength": 360 }
  }
}
```

### 10.3 PNT-OP04 next boundary selection schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_nci.pnt.next_boundary_selection.bodyfree.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "body_free",
    "selected_pnt_status_ref",
    "selected_pnt_lane_ref",
    "selected_post_nci_outcome_group_ref",
    "selected_post_nci_next_boundary_ref",
    "selected_post_nci_next_boundary_kind_ref",
    "selected_post_nci_next_boundary_not_executed",
    "next_design_document_candidate_ref",
    "next_design_document_allowed",
    "manual_wait_required",
    "manual_stop_required",
    "repair_design_candidate",
    "pnt_op04_status_ref",
    "next_required_step"
  ],
  "properties": {
    "schema_version": {
      "const": "p7_r54_ahr_post_nci_pnt_op04_next_boundary_selection.bodyfree.v1"
    },
    "operation_step_ref": {
      "const": "PNT-OP04_next_boundary_selection_materialization"
    },
    "body_free": { "const": true },
    "selected_pnt_status_ref": { "type": "string", "maxLength": 260 },
    "selected_pnt_lane_ref": { "type": "string", "maxLength": 260 },
    "selected_post_nci_outcome_group_ref": {
      "enum": [
        "next_design_candidate",
        "wait_hold",
        "stop"
      ]
    },
    "selected_post_nci_next_boundary_ref": { "type": "string", "maxLength": 420 },
    "selected_post_nci_next_boundary_kind_ref": { "type": "string", "maxLength": 420 },
    "selected_post_nci_next_boundary_not_executed": { "const": true },
    "selected_post_nci_next_boundary_execution_allowed_here": { "const": false },
    "next_design_document_candidate_ref": { "type": "string", "maxLength": 420 },
    "next_design_document_allowed": { "type": "boolean" },
    "manual_wait_required": { "type": "boolean" },
    "manual_stop_required": { "type": "boolean" },
    "repair_design_candidate": { "type": "boolean" },
    "pnt_op04_status_ref": {
      "enum": [
        "PNT_STATUS_NEXT_BOUNDARY_SELECTION_MATERIALIZED_STOPPED",
        "PNT_STATUS_STOP_SELECTION_MATERIALIZED_STOPPED",
        "PNT_STATUS_REPAIR_REQUIRED_FOR_BOUNDARY_SELECTION_INPUTS",
        "PNT_STATUS_BLOCKED_BOUNDARY_SELECTION_PROMOTION_AUTORUN"
      ]
    },
    "next_required_step": { "type": "string", "maxLength": 360 }
  }
}
```

### 10.4 PNT-OP08 closure schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_nci.pnt.result_memo_closure.bodyfree.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "body_free",
    "pnt_op08_status_ref",
    "selected_pnt_status_ref",
    "selected_pnt_lane_ref",
    "selected_post_nci_outcome_group_ref",
    "selected_post_nci_next_boundary_ref",
    "selected_post_nci_next_boundary_kind_ref",
    "selected_post_nci_next_boundary_not_executed",
    "selected_handoff_or_stop_ref",
    "selected_handoff_or_stop_kind_ref",
    "selected_handoff_or_stop_not_executed",
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
    "dhr_op05_not_called",
    "dhr_op06_not_called",
    "dmd_r52_not_executed",
    "p5_p6_p8_p7_release_not_started",
    "p8_question_design_not_started",
    "p8_question_implementation_not_started",
    "api_db_rn_runtime_response_key_not_changed",
    "next_required_step"
  ],
  "properties": {
    "schema_version": {
      "const": "p7_r54_ahr_post_nci_pnt_op08_result_memo_closure.bodyfree.v1"
    },
    "operation_step_ref": {
      "const": "PNT-OP08_bodyfree_post_nci_triage_result_memo_closure"
    },
    "body_free": { "const": true },
    "pnt_op08_status_ref": {
      "enum": [
        "PNT_OP08_BODYFREE_POST_NCI_TRIAGE_CLOSED_STOPPED",
        "PNT_OP08_WAITING_FOR_NCI_OP08_OR_PNT_INPUT_REFS",
        "PNT_OP08_REPAIR_REQUIRED_FOR_POST_NCI_TRIAGE_INPUTS",
        "PNT_OP08_BLOCKED_BODYFREE_LEAK_PROMOTION_OR_AUTORUN"
      ]
    },
    "selected_pnt_status_ref": { "type": "string", "maxLength": 260 },
    "selected_pnt_lane_ref": { "type": "string", "maxLength": 260 },
    "selected_post_nci_outcome_group_ref": {
      "enum": ["next_design_candidate", "wait_hold", "stop"]
    },
    "selected_post_nci_next_boundary_ref": { "type": "string", "maxLength": 420 },
    "selected_post_nci_next_boundary_kind_ref": { "type": "string", "maxLength": 420 },
    "selected_post_nci_next_boundary_not_executed": { "type": "boolean" },
    "selected_handoff_or_stop_ref": { "type": "string", "maxLength": 420 },
    "selected_handoff_or_stop_kind_ref": { "type": "string", "maxLength": 420 },
    "selected_handoff_or_stop_not_executed": { "type": "boolean" },
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
    "dhr_op05_not_called": { "const": true },
    "dhr_op06_not_called": { "const": true },
    "dmd_r52_not_executed": { "const": true },
    "p5_p6_p8_p7_release_not_started": { "const": true },
    "p8_question_design_not_started": { "const": true },
    "p8_question_implementation_not_started": { "const": true },
    "api_db_rn_runtime_response_key_not_changed": { "const": true },
    "next_required_step": { "type": "string", "maxLength": 420 }
  }
}
```

---

## 11. validation plan案

### 11.1 PNT-OP00 / OP01 tests

```text
- OP00 refreeze normal。
- OP00 requires explicit NCI-OP08 input。
- OP00 does not call NCI-OP08 default builder。
- OP00 rejects public contract mutation。
- OP00 rejects forbidden body payload key。
- OP01 accepts valid explicit NCI-OP08 bodyfree closure without handoff execution。
- OP01 waits when NCI-OP08 material is missing。
- OP01 waits when NCI-OP08 status is waiting。
- OP01 repairs when NCI-OP08 status is repair。
- OP01 blocks when NCI-OP08 status is blocked or contains body-like/promotion/no-touch claims。
- OP01 does not classify next boundary yet。
```

### 11.2 PNT-OP02 / OP03 tests

```text
- OP02 validates all allowed selected_handoff_or_stop refs。
- OP02 rejects missing selected_handoff_or_stop_ref。
- OP02 rejects unknown selected_handoff_or_stop_ref。
- OP02 rejects selected_handoff_or_stop_not_executed != true。
- OP02 rejects selected_handoff_or_stop_ref / selected_next_design_or_stop_ref mismatch。
- OP02 rejects handoff / stop envelope kind mismatch。
- OP03 resolves DHR-OP05 lane without calling DHR-OP05。
- OP03 resolves retry/start lane without actual review start。
- OP03 resolves waiting external claim lane without raw evidence request。
- OP03 resolves repair lane without repair execution。
- OP03 resolves unresolved lane as manual hold stop。
- OP03 resolves blocked lane as stop。
```

### 11.3 PNT-OP04 / OP05 tests

```text
- OP04 materializes DHR-OP05 next design document candidate without call。
- OP04 materializes retry/start route design candidate without actual review execution。
- OP04 materializes waiting claim hold without raw evidence/body-full packet。
- OP04 materializes repair candidate without repair execution。
- OP04 materializes unresolved/blocked stop material。
- OP05 passes bodyfree/no-touch/no-promotion guard for all valid outcomes。
- OP05 blocks question_text/raw_input/local_path/hash/stdout tokens。
- OP05 blocks DHR/P8/release promotion flags。
- OP05 blocks API/DB/RN/response key changed-file tokens。
```

### 11.4 PNT-OP06 / OP07 tests

```text
- OP06 records target tests / selected regression / compileall refs。
- OP06 does not claim full backend / RN / real-device green。
- OP06 waits when OP05 guard is not ready。
- OP07 creates result memo draft for all valid outcomes without execution。
- OP07 creates stop draft for unresolved / blocked lanes。
- OP07 stops when guard invalid or validation plan invalid。
```

### 11.5 PNT-OP08 tests

```text
- OP08 closes all valid next design candidate outcomes body-free。
- OP08 closes waiting / stop outcomes body-free。
- OP08 records selected_post_nci_next_boundary_ref but does not execute it。
- OP08 rejects DHR-OP05 call claim。
- OP08 rejects P8 question design/start claim。
- OP08 rejects release/full backend/RN green claim mutation。
- OP08 waits when required OP refs are missing。
- OP08 repairs invalid OP07 result memo draft。
- OP08 blocks body-like result memo / promotion claim。
- OP08 full-title aliases match short builders/asserts。
```

### 11.6 検証結果の読み方

PNT target / selected regression / compileallがgreenになっても、言えるのは次までです。

```text
PNT helper / target tests / selected regression / compileallが、PNT境界のbody-free selection contractを満たした。
```

言ってはいけないことは次です。

```text
full backend suite green
RN contract green
RN real-device modal verified
actual review execution
actual rows creation
DHR-OP05 execution
P5 final
P6 start
P8 start
P7 complete
release ready
```

---

## 12. 完了条件

実装段階でPNTを完了扱いにできる条件は次です。

```text
- PNT-OP00〜OP08 helper / assert contractが存在する。
- PNT-OP01が explicit NCI-OP08 material required を守り、無入力default NCI builderを呼ばない。
- NCI-OP08 materialをbody-freeでintakeできる。
- selected_handoff_or_stop_refを、DHR-OP05 / retry-start / waiting / repair / unresolved / blockedへ分類できる。
- どの分類でも、下流builderを呼ばない。
- P8 question design / implementationを開始しない。
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

次を検出した場合、PNTはfail-closedにします。

```text
- explicit NCI-OP08 materialがない。
- NCI-OP08 contract invalid。
- NCI-OP08 statusがclosedではない。
- selected_handoff_or_stop_refがmissing。
- selected_handoff_or_stop_not_executed != true。
- selected_handoff_or_stop_ref / selected_next_design_or_stop_ref mismatch。
- handoff / stop envelope kind mismatch。
- forbidden body payload / question_text / raw answer / comment_text / local path / hash / stdout / stderr / tracebackを含む。
- DHR-OP05 / DHR-OP06 / DMD / R52 / P8 / release promotion claimを含む。
- API / DB / RN / response key変更が混入する。
- P8 question design / implementation開始扱いへ寄る。
- NCI-OP08 helper default materialをPNT helper本体が無入力生成している。
```

### 13.2 rollback方針

実装段階でPNTに問題が出た場合のrollbackは次です。

```text
- 新規PNT helper / PNT tests / PNT result memoのみを取り下げる。
- 既存NCI / RDB / MRB / DHR helperへ影響を出さない。
- API / DB / RN / response keyに触っていないため、runtime rollbackは不要であるべき。
- PNTが止まった場合、次へ進めずNCI-OP08 closure時点へ戻す。
```

---

## 14. P8問いシステムとの境界

問いシステムは重要です。Cocolonの差別化にも関係します。ですが、PNTはP8問いシステム詳細設計ではありません。

PNTで守ることは次です。

```text
- P8問いUXへ進む許可を出さない。
- question_text / draft_question_text / answer_textを作らない。
- question trigger / answer storage / plan guardを作らない。
- question need observation materialをP8 question specificationへ昇格しない。
- 問い候補を、Emlis本体の読感不足を隠す免罪符にしない。
```

PNTがP8に対して持つ意味は、次だけです。

```text
P8へ雑に進まないための境界。
P7のbody-free材料とP8設計開始を混同しないための停止線。
```

---

## 15. DHR-OP05との境界

PNTでDHR-OP05 design candidateが選ばれた場合でも、DHR-OP05を実行しません。

許可される次段階は、最大でも次です。

```text
P7-R54-AHR Post-NCI DHR-OP05 Manual Handoff Boundary / Preflight Re-entry Design Candidate
```

この段階も、まず設計書です。DHR-OP05 builder call / scan / DHR-OP06以降実行は、その設計内で明示的に許可条件を定義し、Mash様の実装指示が出た場合にだけ検討します。

PNTからDHR-OP05へ直行しない理由は次です。

```text
- NCI-OP08はDHR-OP05を呼ばない境界だった。
- PNTはNCI-OP08後の選定境界であって、DHR-OP05実行境界ではない。
- DHR-OP05 candidateは、実行許可ではなく設計候補である。
```

---

## 16. 華恋の意見

私は、PNTを挟む判断は必要だと思います。

理由は、NCI-OP08後の `selected_handoff_or_stop_ref` は、名前だけ見ると「次に進むためのref」に見えやすいからです。でも、NCIが守ったのは「実行せずに閉じる」ことです。ここでDHR-OP05へ直行すると、NCIを置いた意味が薄れます。

一方で、PNTを大きくしすぎるのも良くありません。R54系の境界補強は、必要だった一方でかなり長くなっています。PNTは、さらに複雑な境界を積むためではなく、次に本当に設計すべきものと、止めるものを分けるための薄い境界にするべきです。

特に大事なのは、PNT-OP01で **explicit input required** を固定することです。無入力でNCI builderを呼んでしまうと、helperが作ったdefault materialを現在laneと誤読する危険があります。ここは、今回の設計で一番強く守るべきところです。

私の判断は次です。

```text
- PNTは作ってよい。
- ただし、薄く作る。
- PNT helper本体はNCI-OP08 materialを合成しない。
- PNTはDHR-OP05 / retry / wait / repair / hold / blockedを分類する。
- 分類後も実行しない。
- DHR-OP05 design candidateが明確に確認できた場合だけ、次のDHR-OP05 Manual Handoff Boundary設計へ進む。
- それ以外はretry / wait / repair / hold / blockedとして止める。
- P8問いシステムへはまだ進まない。
```

---

## 17. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- ローカル受領zipのみで確認した。
- GitHub接続確認はMash様指示により不要であり、実施していない。
- Cocolon_前提資料と作業姿勢ルールを確認した。
- emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.mdを確認した。
- 対象ロードマップは、問いシステムをEmlisAI core quality gateとP8問いUXへ二層化している。
- 対象ロードマップは、P7で問いシステムを実装せず、body-free必要性観察メモに留める。
- 最新前提資料は、R54-AHR Post-RDB08 NCI-OP00〜OP08までを反映している。
- NCI-OP08 result memoは、selected_handoff_or_stop_refを記録して停止し、DHR-OP05 / P8 / releaseへ進めないと明記している。
- 検討メモは、次の設計対象を Post-NCI Selected Handoff-or-Stop Decision Triage / Next Boundary Selection として採用している。
```

### 未確認

```text
- PNT helper / tests / result memoはまだ存在しない。
- PNT target tests green。
- PNT selected regression green。
- PNT compileall passed。
- full backend suite green。
- RN contract green。
- RN real-device modal verified。
- actual review execution。
- actual rating / blocker / question need observation rows。
- disposal receipt actual generation。
- DHR-OP05以降の実行。
- P5 final / P6 start / P8 start / P7 complete / release。
```

### 書かれていない

```text
- NCI-OP08後にP8 question designへ進んでよいとは書かれていない。
- NCI-OP08後にDHR-OP05を呼んでよいとは書かれていない。
- selected_handoff_or_stop_refを実行命令として扱ってよいとは書かれていない。
- PNTがNCI-OP08 materialを無入力合成してよいとは書かれていない。
- 問い必要性観察メモを質問本文へ変換してよいとは書かれていない。
```

### 推測禁止

```text
- all-lane test greenを現在lane確定として扱わない。
- helper default builder出力を現在laneとして扱わない。
- DHR-OP05 candidateをDHR-OP05実行許可として扱わない。
- P8正式候補仕様をP8開始許可として扱わない。
- helper greenを商品読感合格として扱わない。
- P5 surface / Gate / Emlis本文の弱さを問い候補で隠さない。
```

### 次に実行すべきこと

実装段階に進むなら、次を実装します。

```text
P7-R54-AHR Post-NCI Selected Handoff-or-Stop Decision Triage / Next Boundary Selection
PNT-OP00〜PNT-OP08
```

最初に実装すべき最小単位は次です。

```text
R0: scope / explicit-input / no-execution refreeze
R1: helper skeleton / constants
R2: PNT-OP00 / OP01 + tests
```

その時点で必ず守ることは次です。

```text
- PNT helper本体は、NCI-OP08 default builderを無入力で呼ばない。
- explicit NCI-OP08 materialがない場合はwaitingにする。
- DHR-OP05 / P8 / releaseへ進めない。
- API / DB / RN / response keyへ触らない。
```
