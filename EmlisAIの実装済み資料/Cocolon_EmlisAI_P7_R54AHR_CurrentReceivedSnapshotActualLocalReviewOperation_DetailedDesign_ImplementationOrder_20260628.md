---
title: Cocolon / EmlisAI P7-R54-AHR Current Received Snapshot Actual Local-only Human Review Operation 詳細設計書・実装順
created_at: 2026-06-28 JST
author: 華恋
work_type: 詳細設計書 / 実装順 / json・schema案内包
source_mode: local_snapshot
github_connection_check: not_required_by_mash_instruction
base_pre_design_memo: Cocolon_EmlisAI_P7_R54AHR_CurrentReceivedSnapshotActualReview_PreDesignMemo_20260628.md
artifact_scope: md design only
code_change: none
json_schema_file_creation: none
body_full_packet_generation: none
actual_human_review_execution: none
p8_question_design: none
p8_question_implementation: none
r52_actual_reintake_execution: none
p5_finalization: none
p6_start: none
p7_complete: none
release_decision: none
---

# Cocolon / EmlisAI P7-R54-AHR Current Received Snapshot Actual Local-only Human Review Operation 詳細設計書・実装順

対象: Cocolon / EmlisAI / P7 Product Quality Runner / P5 User Label Connection / R54-AHR / current received snapshot actual local-only human review / P7-P8 Bridge / R52 handoff candidate  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
実装扱い: 本書は設計書です。コード変更・json実ファイル化・schema実ファイル化・body-full packet生成・actual human review実行は行いません。  
json / schema実ファイル化: なし。本書内の案のみ。実ファイル化は実装段階で現物コード・既存schema配置・既存Guard・既存test結果を見て判断します。  
GitHub接続確認: Mash指定により不要。ローカル受領zip基準。  

---

## 0. 結論

次に進める段階は、**P7-R54-AHR Current Received Snapshot Actual Local-only Human Review Operation** です。

```text
P7-R54-AHR Current Received Snapshot Actual Local-only Human Review Operation
= 今回受領した current snapshot 264/85/258/171 をactual review basisとしてbody-freeに再固定し、
  P5 User Label Connection履歴線を人間がlocal-onlyで実読できるようにし、
  actual review由来の 24 rating rows / 24 question need observation rows / disposal receipt / R52 handoff candidate を、
  body-free evidenceとして成立させるための工程。
```

ただし、本書で行うのは設計です。次は実行しません。

```text
- body-full packet生成
- actual 24-case human review実行
- rating rowsの実ファイル作成
- question need observation rowsの実ファイル作成
- disposal / purge実行
- R52 actual re-intake execution
- P5 final
- P6 start
- P8 start
- P7 complete
- release decision
```

本設計の中心は、次です。

```text
1. current received basis 264/85/258/171 をactual review basisとして再固定する。
2. 既存CS18 basis 262/84/257/170 と既存AHR basis 260/83/256/169 をhistorical / structural / regression refsへ分離する。
3. 24-case manifestをcurrent basisに紐づけて再固定する。
4. local-only preflight / explicit allow / retention / disposal / export denylistを、body-full packetより先に固定する。
5. reviewer person boundaryとselection-only formを固定する。
6. actual review由来のbody-free receipt / sanitized rows / rating rows / question need observation rowsだけを成果物へ残す。
7. P5 repair / P4 current-only repair / operation blocker / P8 material candidate-only を混同しない。
8. evidence completeになった場合だけ、R52 handoff candidate envelopeへ進む。ただしR52実行はしない。
```

設計上の短い判断は次です。

```text
P8へ進むために、P8を先に作らない。
P5履歴線が本当に読まれたかを、current received basisのactual review evidenceとして先に成立させる。
```

---

## 1. なぜこの作業を行うのか

P5 User Label Connectionは、CocolonをただのAI相談にしないための中核です。  
ユーザーの記録が、次の入力に対して「線」として返ってくることが、Cocolon固有価値の中心にあります。

ただし、現状では次が未成立です。

```text
actual_human_review_complete: false
actual rating rows 24件: 未成立
actual question need observation rows 24件: 未成立
disposal receipt: 未成立
P5 final: false
P6 start: false
P8 start: false
P7 complete: false
release_allowed: false
```

CS18までで、helper / target tests / claim boundary はかなり閉じています。  
しかし、helper greenは「人間が読んだ」証拠ではありません。selected regression greenも商品合格ではありません。

このままP8観測補助問いへ進むと、P5履歴線の弱さを「問い返し」で覆う危険があります。  
それはCocolonとして違います。P8の問いは、P5の弱さを隠すためではなく、実ケースで「一問だけ補うと過読リスクが下がる」と確認できた場合の補助であるべきです。

そのため、次はP8設計ではなく、**問いなしでP5履歴線がどこまで自然に返っているかを、人間実読のbody-free証跡へ変える工程**です。

---

## 2. 確認した資料・実ファイル

今回の確認はローカル受領zipを基準にしました。

### 2.1 受領zip

```text
Cocolon_前提資料(264).zip
EmlisAIの実装済み資料(85).zip
Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(4).zip
Cocolon(258).zip
mashos-api(171).zip
```

zip内件数の確認結果は次です。

```text
Cocolon_前提資料(264).zip: 81 entries
EmlisAIの実装済み資料(85).zip: 36 entries
Cocolon(258).zip: 246 entries
mashos-api(171).zip: 1348 entries
roadmap(4).zip: 1 entry
```

この数はzip entry数であり、前提資料manifest上の「Cocolon 217 / mashos-api 1303 / total 1520」とは粒度が違います。  
設計上は、outer received zip labelと内部manifest / READ_FIRSTのsource lineageを混同しません。

### 2.2 作業姿勢・前提資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/manifest.json
```

作業姿勢として特に固定すること:

```text
- 設計ならコード変更禁止。
- 前提資料だけで理解したふりをしない。実ファイルも確認する。
- 書かれていないことを仮説で埋めない。
- EmlisAIをテンプレ共感・case専用route・固定surfaceへ逃がさない。
- pytest green / fixture green / RN contract greenだけを商品成果にしない。
- Cocolonを人間の言葉を雑に処理しない場所として扱う。
```

### 2.3 ロードマップ

```text
Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md
```

確認した主な箇所:

```text
12. P7: Product Quality Runner / Long-run Product Gate
12.5 P7/P8 Bridge: 観測補助問い必要性メモ
13. P8: Personal Continuity / Derived User Model
13.4 P8開始時の観測補助問い 詳細設計材料
20. 華恋の判断
21.1 更新記録: 2026-06-19 JST / 観測補助問い P7-P8 Bridge追記
```

ロードマップ上の重要固定:

```text
- P7のP5 human Blind QA / P6 limited human readfeel / 実機modal確認では、観測補助問いを実装しない。
- P7ではbody-freeの問い必要性観察メモを残す。
- P8開始時に、P7で集めた実ケースの問い必要性観察メモを根拠に詳細設計する。
- この段階でP8 question API / DB / RN UI / trigger / storageを作らない。
```

### 2.4 実装済み資料

```text
Cocolon_EmlisAI_P7_R54AHR_CurrentSnapshotActualReview_Reentry_DetailedDesign_ImplementationOrder_20260628.md
Cocolon_EmlisAI_P7_R54ActualHumanReviewExecution_BodyFreeEvidenceIntake_DetailedDesign_ImplementationOrder_20260627.md
Cocolon_EmlisAI_P7_R54ActualLocalReviewOperation_CurrentSnapshotLocalRun_DetailedDesign_ImplementationOrder_20260627.md
Cocolon_EmlisAI_P7_R54ActualLocalReviewOperation_ExecutionEvidenceMaterialization_DetailedDesign_ImplementationOrder_20260626.md
Cocolon_EmlisAI_P7_R55_R54EvidenceReconcile_R52ReintakeDecisionMaterialization_DetailedDesign_ImplementationOrder_20260623.md
Cocolon_EmlisAI_P7_R52_R51HandoffEvidenceDecisionGate_DetailedDesign_ImplementationOrder_20260621.md
Cocolon_EmlisAI_P7_R47_LocalReviewPacketPolicy_DetailedDesign_ImplementationOrder_20260618.md
```

### 2.5 backend実ファイル・結果メモ

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_current_snapshot_actual_review_reentry_20260628.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_actual_human_review_execution_bodyfree_intake_20260627.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_current_snapshot_local_review_run_20260627.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate.py
mashos-api/ai/tests/R54_AHR_CS18_CurrentSnapshotActualReviewReentry_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CS16_CS17_CurrentSnapshotActualReviewReentry_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CS14_CS15_CurrentSnapshotActualReviewReentry_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CS12_CS13_CurrentSnapshotActualReviewReentry_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CS10_CS11_CurrentSnapshotActualReviewReentry_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CS08_CS09_CurrentSnapshotActualReviewReentry_Result_20260628.md
```

---

## 3. 現在地の固定

現在地は、P7 Product Quality Runner / Long-run Product Gate 内です。

CS18 result memoで確認された結果は次です。

```text
CS18 target: 34 passed
CS00〜CS18 combined: 450 passed
existing AHR00〜AHR24 split regression: 499 passed
R55 selected regression: 613 passed
R52 selected regression: 219 passed
compileall services/ai_inference tests: passed
```

ただし、CS18では次を未成立のまま保持しています。

```text
actual_human_review_run_here: false
actual_human_review_complete: false
p5_human_blind_qa_confirmed_final: false
p5_confirmed_final: false
p5_final_allowed: false
p6_limited_human_readfeel_start_allowed: false
p6_start_allowed: false
p8_start_allowed: false
p8_question_text_generation: false
r52_reintake_execution_requested_here: false
actual_r52_reintake_execution_confirmed: false
p7_complete: false
release_allowed: false
full_backend_suite_green_confirmed: false
rn_contract_green_confirmed: false
rn_real_device_modal_verified: false
```

CS18で固定されたclaim boundaryは次です。

```text
CS_helper_green_is_not_actual_human_review_complete
existing_AHR_helper_green_is_not_current_actual_review_complete
selected_regression_green_is_not_full_backend_suite_green
RN_contract_green_is_not_RN_real_device_modal_verified
R52_handoff_ready_is_not_R52_reintake_executed
P8_material_candidate_only_is_not_P8_start_allowed
P5_confirmed_candidate_is_not_P5_final
```

この設計で守る読み替え禁止は次です。

```text
helper green != actual human review complete
selected regression green != full backend suite green
P8 material candidate-only != P8 start allowed
P5 confirmed candidate != P5 final
R52 handoff ready != R52 actual re-intake executed
```

---

## 4. 本設計の対象範囲

本設計の対象は次です。

```text
1. current received snapshot 264/85/258/171 のbasis envelope設計。
2. 既存CS18 basis 262/84/257/170 と既存AHR basis 260/83/256/169 のhistorical separation。
3. current basis impact assessment / direct diff unavailable時の扱い。
4. 24-case manifest refreeze。
5. local-only preflight / explicit allow / retention / disposal boundary。
6. body-full packet request / generation receipt / completeness scan / export denylist scanのbody-free記録。
7. reviewer person boundary / selection-only form。
8. actual local-only human review operation receipt intake。
9. sanitized review result row intake。
10. rating row normalization。
11. readfeel blocker / execution blocker normalization。
12. question need observation normalization。
13. rating-question consistency guard。
14. pause / abort / expiration / disposal receipt。
15. post-review summary / evidence complete predicate。
16. P5 confirmed candidate / P5 repair / P4 current-only repair / operation blocked / inconclusive separation。
17. P6 candidate-only / P8 material candidate-only / R52 handoff candidate envelope。
18. final no-body-leak / no-question-text / no-touch validation。
19. validation command matrix / result memo方針。
```

---

## 5. 本設計の非対象範囲

本設計では次を行いません。

```text
- API route変更
- request key / response key変更
- public response top-level key追加
- DB schema変更
- DB migration追加
- DB physical schema変更
- RN production UI変更
- RN表示条件変更
- User Label Connection runtime変更
- runtime generation変更
- Gate threshold変更
- P8 question API作成
- P8 question DB schema作成
- P8 question RN UI作成
- P8 question trigger logic作成
- question answer persistence作成
- question text / draft question text生成
- P6 limited human readfeel start
- R52 actual re-intake execution
- P5 final
- P7 complete
- release decision
- full backend suite green主張
- RN real-device modal確認済み主張
```

この設計は、**body-free evidence intake / operation boundary / implementation order** の設計であり、P8実装設計ではありません。

---

## 6. current basis refreeze設計

### 6.1 今回のactual review basis

本設計では、次をactual review basis候補として再固定します。

```text
actual_review_basis_ref: current_received_snapshot_264_85_258_171
actual_review_basis_allowed_ref: current_received_snapshot_264_85_258_171_only
```

basis refs案:

```text
premise_zip_ref: Cocolon_前提資料(264).zip
implemented_materials_zip_ref: EmlisAIの実装済み資料(85).zip
roadmap_zip_ref: Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(4).zip
rn_zip_ref: Cocolon(258).zip
backend_zip_ref: mashos-api(171).zip
pre_design_memo_ref: Cocolon_EmlisAI_P7_R54AHR_CurrentReceivedSnapshotActualReview_PreDesignMemo_20260628.md
detailed_design_ref: Cocolon_EmlisAI_P7_R54AHR_CurrentReceivedSnapshotActualLocalReviewOperation_DetailedDesign_ImplementationOrder_20260628.md
```

### 6.2 outer zip labelとinternal source lineageを混ぜない

今回のouter受領zipラベルは 264/85/258/171 です。  
一方、前提資料内部のREAD_FIRSTやmanifestには、資料作成時点のsource_snapshot / lineageが別途記載されています。

そのため、実装では次を分けます。

```text
outer_received_zip_refs:
  今回Mashから受領したzipラベルとファイル名。

internal_source_lineage_refs:
  前提資料内部に書かれているsource_snapshot / file_counts / manifest lineage。
```

これらを同一視してはいけません。  
actual review evidenceとして紐づけるのは、今回の作業対象であるouter received basisです。内部source lineageは補助証跡として保持するだけです。

### 6.3 既存CS / AHR basisの扱い

既存のCS18文脈では次が固定されています。

```text
CS current basis: current_received_snapshot_262_84_257_170
```

既存AHR helperでは次が固定されています。

```text
AHR execution basis: current_received_snapshot_260_83_256_169
```

本設計では、これらを次のように扱います。

```text
allowed:
  - historical refs
  - structural refs
  - regression refs
  - body-free helper設計参考
  - no-leak / no-question / no-touch test設計参考

not allowed:
  - current_received_snapshot_264_85_258_171 のactual review basisとして採用すること
  - current actual human review evidenceとして読み替えること
  - actual rating rows / question observation rowsとして昇格すること
  - P5 final / P6 start / P8 start / release判断の直接根拠にすること
```

### 6.4 direct diffができない場合

264/85/258/171 と 262/84/257/170 のdirect diffが取れない場合、次を守ります。

```text
- diff unavailable != no impact
- old manifest unconditional adoption禁止
- old packet boundary unconditional adoption禁止
- old evidence rows current adoption禁止
- current manifest refreeze required
```

つまり、直接diffができなくても止めるだけではなく、current basis上でmanifestを再固定して前へ進めます。  
ただし、「差分影響なし」とは言いません。

---

## 7. no-touch boundary

本工程は、operation証跡を作るための工程です。既存product runtimeを変えません。

### 7.1 no-touch項目

```text
api_changed: false
db_changed: false
rn_changed: false
runtime_changed: false
api_route_changed: false
request_key_changed: false
response_key_changed: false
response_shape_changed: false
db_schema_changed: false
db_migration_added: false
db_physical_schema_changed: false
rn_ui_changed: false
rn_visible_contract_changed: false
public_response_key_changed: false
public_response_top_level_key_added: false
runtime_gate_threshold_changed: false
user_label_connection_runtime_changed: false
emlis_visible_output_generation_changed: false
subscription_or_plan_access_policy_changed: false
```

### 7.2 P8 / P6 / R52 / release false固定

```text
question_implementation_started_here: false
question_trigger_logic_implemented: false
question_api_implemented: false
question_db_schema_implemented: false
question_rn_ui_implemented: false
question_answer_persistence_implemented: false
p8_question_implementation_spec_finalized_here: false
question_text_materialized_here: false
draft_question_text_materialized_here: false
p5_human_blind_qa_confirmed_final: false
p5_confirmed_final: false
p5_final_allowed: false
p6_limited_human_readfeel_start_allowed: false
p6_start_allowed: false
p8_start_allowed: false
r52_reintake_execution_requested_here: false
actual_r52_reintake_execution_confirmed: false
p7_complete: false
release_allowed: false
```

### 7.3 body / path / hash / terminal leak false固定

```text
raw_input_included: false
raw_body_included: false
returned_emlis_body_included: false
history_surface_included: false
comment_text_included: false
reviewer_free_text_included: false
reviewer_notes_body_included: false
question_text_included: false
draft_question_text_included: false
local_path_included: false
local_absolute_path_included: false
body_hash_included: false
packet_content_included: false
terminal_output_body_included: false
stdout_body_included: false
stderr_body_included: false
traceback_body_included: false
body_free: true
```

---

## 8. local-only operation boundary

actual reviewでは、reviewerが読むためにbody-full packetを一時的に扱う可能性があります。  
ただし、それはlocal-onlyであり、成果物・git・release material・public metaへ出してはいけません。

### 8.1 local-onlyでのみ扱えるもの

```text
- raw input
- returned Emlis body
- visible surface body
- owned history surface for reviewer
- reviewer-facing packet content
- reviewer local notes if any
- local-only body-full packet
```

### 8.2 body-free成果物に残せるもの

```text
- review_session_id
- actual_review_basis_ref
- case_ref_id
- blind_case_id
- packet_ref_id
- reviewer_person_ref
- operation_receipt_ref
- packet_generation_request_ref
- packet_generation_receipt_ref
- packet_completeness_scan_ref
- export_denylist_scan_ref
- reviewed_case_count
- selection_row_count
- rating_row_count
- question_need_observation_row_count
- disposal_receipt_ref
- no_body_leak_validation_passed
- no_question_text_validation_passed
- no_touch_validation_passed
- decision refs / blocker ids / candidate refs
```

### 8.3 成果物へ残してはいけないもの

```text
raw input
raw body
returned Emlis body
history surface
comment_text body
reviewer free text
reviewer notes body
question text
draft question text
body-full packet content
local absolute path
body hash
terminal output body
stdout / stderr / traceback body
```

### 8.4 explicit allow

body-full packet generationは、明示許可がなければblockedにします。

実装段階での候補:

```text
explicit_allow_ref: R54_AHR_CURRENT_RECEIVED_264_85_258_171_LOCAL_ONLY_REVIEW_ALLOWED
local_review_root_ref: sanitized ref only。local absolute pathはbody-free成果物へ出さない。
retention_policy_ref: local_body_full_packet_max_72h_or_shorter
export_policy_ref: body_full_packet_never_exported_to_repo_docs_release_public_meta
```

明示許可がない場合の挙動:

```text
preflight_status_ref: BLOCKED_EXPLICIT_ALLOW_MISSING
body_full_packet_generation_allowed: false
actual_review_operation_allowed: false
next_required_step: explicit_allow_or_stop
```

これはMashに負担を押しつけるためではありません。  
「人間が読んだ」と言える工程と、AIが勝手に完了扱いしてはいけない工程を分けるためです。

---

## 9. 24-case manifest再固定

### 9.1 case count

manifestは24件固定です。

```text
required_case_count: 24
case_row_count: 24
case_rows_bodyfree_only: true
case_ref_ids_unique: true
blind_case_ids_unique: true
packet_ref_ids_unique: true
blind_case_id_case_ref_separated: true
blind_case_id_packet_ref_separated: true
case_ref_id_packet_ref_separated: true
```

### 9.2 既存AHR manifest distribution参考

既存AHR helperでは、24件のdistributionは次です。  
本実装でそのまま採用する場合も、current 264/85/258/171 basis上で再固定が必要です。

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

role counts参考:

```text
positive_history_line: 4
positive_owned_history: 16
boundary_no_history_line: 4
```

tier / history policy参考:

```text
paid_owned_history_context_ref: 20
tier_hidden_current_only_boundary: 2
free_tier_history_present_not_allowed_boundary: 2

bounded_owned_history_local_only: 20
history_not_eligible_current_only_boundary: 2
owned_history_present_but_not_allowed_by_tier_boundary: 2
```

### 9.3 case row最小項目

```json
{
  "case_index": 1,
  "case_ref_id": "cral_case_ref_001",
  "blind_case_id": "cral_blind_case_001",
  "packet_ref_id": "cral_packet_ref_001",
  "family_ref": "history_line_eligible_input",
  "case_role_ref": "positive_history_line",
  "subscription_tier_ref": "paid_owned_history_context_ref",
  "history_evidence_policy_ref": "bounded_owned_history_local_only",
  "review_axis_profile_ref": "r54_ahr_p5_history_line_existing_6_axis_profile_current_received_20260628",
  "reviewer_facing_family_exposed": false,
  "reviewer_facing_tier_exposed": false,
  "requires_history_line_review": true,
  "current_only_boundary_case": false,
  "body_full_packet_materialized_here": false,
  "local_reviewer_payload_materialized_here": false,
  "body_free": true
}
```

`family_ref` や `case_role_ref` はbody-free識別子です。入力本文・返答本文・履歴本文を含めません。

---

## 10. reviewer boundary

### 10.1 reviewer person boundary

actual human reviewを成立させるには、次が必要です。

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

次は禁止です。

```text
- 華恋の内部読解をhuman review完了へ変換する。
- pytestのfixture rowをactual review rowへ変換する。
- reviewer free textを成果物へ残す。
- reviewer notes bodyを成果物へ残す。
- question text / draft question textを成果物へ残す。
- 24件未満をcomplete扱いする。
```

### 10.2 selection-only form

reviewerは自由記述ではなく、selection-onlyで評価します。

評価軸は既存AHR lineに合わせます。

```text
history_connection_naturalness: target 0.90
creepy_absence: target 0.95
overclaim_absence: target 0.95
self_blame_non_amplification: target 0.95
wants_more_input_or_accumulation: target 0.85
non_shallow_repeat: target 0.90
```

question need primary class options:

```text
no_question_needed_emlis_can_observe
question_may_reduce_overread_risk
question_would_make_immediate_observation_heavy
not_question_emlis_readfeel_repair_required
not_question_p5_surface_repair_required
not_question_gate_boundary_required
plus_single_question_candidate_later
premium_deep_dive_candidate_later
insufficient_material_execution_blocker
```

one question fit options:

```text
not_needed
fits_one_question
needs_more_than_one_question_not_p7
would_delay_immediate_observation
unsafe_or_boundary_not_question
repair_required_not_question
insufficient_material
```

ここで作るのは「問い文」ではありません。  
P8のためのbody-free観察分類だけです。

---

## 11. 実装時の候補ファイル構成

本書では実ファイル化しません。実装段階で現物コード・既存schema配置・既存Guard・テスト結果を見て判断します。

### 11.1 推奨候補: 新規薄いoperation helper

既存AHR / CS helperを直接書き換えない方針です。

候補:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_current_received_snapshot_actual_local_review_operation_20260628.py
```

役割:

```text
- current received 264/85/258/171 basisをfirst-class actual review basisとして持つ。
- 既存AHR / CS / CLR / OP / EV / R55 / R52 refsをhistorical / structural / regression refsへ分離する。
- 24-case manifest / local-only preflight / packet request / reviewer selection / operation receipt / rows / disposal / R52 handoff candidateをbody-freeで扱う。
- P5 final / P6 start / P8 start / R52 actual execution / releaseをfalseに保つ。
```

### 11.2 非推奨候補: 既存AHR / CS helperのbasis直接差し替え

禁止に近い非推奨です。

```text
emlis_ai_p7_r54_actual_human_review_execution_bodyfree_intake_20260627.py の
P7_R54_AHR_ACTUAL_EXECUTION_BASIS_REF を 264/85/258/171 へ直接差し替える。

emlis_ai_p7_r54_ahr_current_snapshot_actual_review_reentry_20260628.py の
CS basis 262/84/257/170 を 264/85/258/171 へ直接差し替える。
```

理由:

```text
- 既存greenの意味が変わる。
- どのsnapshotを読んだ証跡なのかが濁る。
- 過去helperのhistorical / regression価値が壊れる。
- actual review evidenceとhelper greenの境界が崩れる。
```

### 11.3 候補test module

`CR` は Current Received の仮prefixです。実装時に既存命名衝突を見て確定します。

```text
mashos-api/ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr00_cr01_20260628.py
mashos-api/ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr02_cr03_20260628.py
mashos-api/ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr04_cr05_20260628.py
mashos-api/ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr06_cr07_20260628.py
mashos-api/ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr08_cr09_20260628.py
mashos-api/ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr10_cr11_20260628.py
mashos-api/ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr12_cr13_20260628.py
mashos-api/ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr14_cr15_20260628.py
mashos-api/ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr16_cr17_20260628.py
mashos-api/ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr18_cr19_20260628.py
mashos-api/ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr20_cr21_20260628.py
mashos-api/ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr22_20260628.py
```

### 11.4 候補result memo

```text
mashos-api/ai/tests/R54_AHR_CR00_CR01_CurrentReceivedActualLocalReviewOperation_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CR02_CR03_CurrentReceivedActualLocalReviewOperation_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CR04_CR05_CurrentReceivedActualLocalReviewOperation_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CR06_CR07_CurrentReceivedActualLocalReviewOperation_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CR08_CR09_CurrentReceivedActualLocalReviewOperation_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CR10_CR11_CurrentReceivedActualLocalReviewOperation_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CR12_CR13_CurrentReceivedActualLocalReviewOperation_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CR14_CR15_CurrentReceivedActualLocalReviewOperation_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CR16_CR17_CurrentReceivedActualLocalReviewOperation_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CR18_CR19_CurrentReceivedActualLocalReviewOperation_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CR20_CR21_CurrentReceivedActualLocalReviewOperation_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CR22_CurrentReceivedActualLocalReviewOperation_Result_20260628.md
```

### 11.5 実装段階で触らない候補

```text
mashos-api/ai/routes/*
mashos-api/ai/db/*
mashos-api/ai/migrations/*
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_*.py
Cocolon/App.js
Cocolon/components/*
Cocolon/screens/*
Cocolon/tests/rn-screen-contracts.test.js
```

RN contract testは必要なら再実行対象ですが、RN production UIを変更する対象ではありません。

---

## 12. 実装順

### 全体依存順

```text
CR00 scope / no-touch boundary freeze
CR01 current received 264/85/258/171 basis envelope
CR02 historical helper refs separation: 260/83/256/169 and 262/84/257/170
CR03 basis impact assessment / direct diff unavailable handling
CR04 current 24-case manifest refreeze
CR05 local-only preflight / explicit allow / retention policy
CR06 body-full packet generation request bridge
CR07 local packet generation receipt / completeness / export denylist scan
CR08 reviewer selection-only form / person boundary
CR09 actual local-only human review operation receipt intake
CR10 sanitized selection-only result rows intake
CR11 rating row normalization
CR12 readfeel blocker / execution blocker normalization
CR13 question need observation normalization
CR14 rating-question consistency guard
CR15 pause / abort / expiration / disposal receipt
CR16 post-review summary / actual review evidence complete predicate
CR17 P5 decision candidate / repair separation
CR18 P6 candidate-only handoff
CR19 P8 material candidate-only handoff
CR20 R52 handoff candidate envelope
CR21 final no-body-leak / no-question-text / no-touch validation
CR22 validation command matrix / documentation output
```

---

### CR00: scope / no-touch boundary freeze

目的:

```text
この工程が、P7-R54-AHR current received actual local-only human review operationであることを固定する。
API / DB / RN / runtime / public response / P8 question / P6 / R52 actual execution / releaseへ触らない境界を固定する。
```

実装候補:

```text
build_p7_r54_ahr_cr00_scope_no_touch_boundary_freeze()
assert_p7_r54_ahr_cr00_scope_no_touch_boundary_freeze_contract()
```

必須確認:

```text
scope_boundary_confirmed: true
no_touch_boundary_confirmed: true
current_received_actual_local_review_operation_selected: true
p8_question_design_out_of_scope: true
p8_question_implementation_out_of_scope: true
p5_finalization_blocked_here: true
p6_p8_release_promotion_blocked_here: true
r52_actual_execution_blocked_here: true
body_full_generation_blocked_until_preflight: true
body_free: true
```

fail-closed:

```text
- no-touch項目がtrueになる。
- P8 question / P6 start / R52 execution / releaseのどれかを進める。
- raw body / question text / path / hashを含む。
```

---

### CR01: current received basis envelope

目的:

```text
current_received_snapshot_264_85_258_171 をactual review basisとしてbody-freeに固定する。
```

実装候補:

```text
build_p7_r54_ahr_cr01_current_received_basis_refreeze(cr00_material)
assert_p7_r54_ahr_cr01_current_received_basis_refreeze_contract()
```

必須項目:

```text
actual_review_basis_ref: current_received_snapshot_264_85_258_171
actual_review_basis_allowed_ref: current_received_snapshot_264_85_258_171_only
outer_received_zip_refs_present: true
internal_source_lineage_refs_separated: true
all_required_current_received_refs_present: true
current_basis_refrozen_for_actual_review_operation: true
actual_human_review_complete: false
```

fail-closed:

```text
- 264/85/258/171の必須refsが欠ける。
- internal lineageをouter received zip refsと同一視する。
- current basis refreezeだけでactual review completeにする。
```

---

### CR02: historical helper refs separation

目的:

```text
260/83/256/169 AHR line と 262/84/257/170 CS lineを、historical / structural / regression refsとして分離する。
```

実装候補:

```text
build_p7_r54_ahr_cr02_historical_helper_refs_separation(cr01_material)
assert_p7_r54_ahr_cr02_historical_helper_refs_separation_contract()
```

分離対象:

```text
r54_ahr_20260627_basis: current_received_snapshot_260_83_256_169
r54_ahr_cs_20260628_basis: current_received_snapshot_262_84_257_170
r54_clr_refs: historical_structural_ref
r54_op_refs: historical_structural_ref
r54_ev_refs: historical_structural_ref
r55_refs: historical_handoff_ref
r52_refs: historical_decision_gate_ref
```

禁止:

```text
existing_ahr_used_as_current_actual_review_evidence: false
existing_cs_used_as_current_actual_review_evidence: false
historical_helper_green_claimed_as_actual_review_complete: false
synthetic_contract_rows_used_as_actual_review_rows: false
```

---

### CR03: basis impact assessment

目的:

```text
262/84/257/170 -> 264/85/258/171 の直接diff有無をbody-freeに記録し、diff不可の場合の前進方法を固定する。
```

実装候補:

```text
build_p7_r54_ahr_cr03_basis_impact_assessment(cr02_material)
assert_p7_r54_ahr_cr03_basis_impact_assessment_contract()
```

分岐:

```text
if direct_diff_available:
  diff_executed: true
  diff_body_included: false
  impact_summary_refs: body-free only
  current_manifest_refreeze_required: true

if direct_diff_unavailable:
  direct_diff_unavailable_reason_ref: explicit_ref
  diff_unavailable_does_not_equal_no_impact: true
  current_manifest_refreeze_required: true
```

fail-closed:

```text
- raw diff body / local path / terminal bodyを成果物へ含める。
- diff unavailableをno impactへ読み替える。
- old manifestを無条件採用する。
```

---

### CR04: current 24-case manifest refreeze

目的:

```text
current received basis上で、24-case manifestをbody-freeに再固定する。
```

実装候補:

```text
build_p7_r54_ahr_cr04_current_24_case_manifest_refreeze(cr03_material, case_rows=None)
assert_p7_r54_ahr_cr04_current_24_case_manifest_refreeze_contract()
```

必須条件:

```text
required_case_count: 24
case_row_count: 24
case_ref_ids_unique: true
blind_case_ids_unique: true
packet_ref_ids_unique: true
case_rows_bodyfree_only: true
reviewer_facing_family_exposed: false
reviewer_facing_tier_exposed: false
body_full_packet_materialized_here: false
local_reviewer_payload_materialized_here: false
actual_human_review_run_here: false
```

fail-closed:

```text
- 24件未満または25件以上。
- raw input / comment_text / surface body / history bodyが混ざる。
- reviewerにfamily/tierを露出する設計に変わる。
- current basis refsが欠ける。
```

---

### CR05: local-only preflight / explicit allow / retention

目的:

```text
body-full packetを扱う前に、local-only root / explicit allow / retention / disposal / export denylistを固定する。
```

実装候補:

```text
build_p7_r54_ahr_cr05_local_only_preflight(cr04_manifest, explicit_allow_ref="")
assert_p7_r54_ahr_cr05_local_only_preflight_contract()
```

preflight ready条件:

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

blocked条件:

```text
- local root refなし
- explicit allowなし
- retention / disposal policyなし
- body-full packet exportを許可している
- local absolute pathをbody-free materialへ出す
```

---

### CR06: body-full packet generation request bridge

目的:

```text
body-full packet generationを、body-free request / receipt refsだけで追跡する。
```

実装候補:

```text
build_p7_r54_ahr_cr06_packet_generation_request_bridge(cr05_preflight)
assert_p7_r54_ahr_cr06_packet_generation_request_bridge_contract()
```

注意:

```text
CR06 helperはpacket bodyを生成しない。
CR06は、実装段階でpacket generationが許可される条件と、request / receiptのbody-free形を固定する。
```

必須項目:

```text
packet_generation_request_ref
packet_generation_allowed_by_preflight
packet_generation_started_here: false by default
body_full_packet_content_included: false
local_absolute_path_included: false
body_hash_included: false
```

actual operation時のみ許容される変化:

```text
body_full_packet_generation_started_here: true may be allowed only in local-only execution receipt.
body_full_packet_generated_here: true may be allowed only if packet body never enters body-free artifact.
```

---

### CR07: packet generation receipt / completeness / export denylist scan

目的:

```text
local-only packet生成が行われた場合でも、成果物にはbody-free receipt / counts / scan refsだけを残す。
```

実装候補:

```text
build_p7_r54_ahr_cr07_packet_generation_receipt_and_scan(cr06_request, receipt_input=None)
assert_p7_r54_ahr_cr07_packet_generation_receipt_and_scan_contract()
```

必須条件:

```text
packet_generation_receipt_ref_present: true
packet_case_count: 24
packet_completeness_scan_ref_present: true
export_denylist_scan_ref_present: true
packet_completeness_passed: true
export_denylist_scan_passed: true
body_full_packet_content_included: false
local_absolute_path_included: false
body_hash_included: false
```

fail-closed:

```text
- packet count != 24
- completeness scanなし
- export denylist scanなし
- packet body / path / hashがbody-free成果物へ混入
```

---

### CR08: reviewer selection-only form / person boundary

目的:

```text
reviewerがpersonであり、selection-onlyで24件を評価するformをbody-freeに固定する。
```

実装候補:

```text
build_p7_r54_ahr_cr08_reviewer_selection_form(cr07_receipt)
assert_p7_r54_ahr_cr08_reviewer_selection_form_contract()
```

form固定:

```text
rating_axis_refs: six axes
question_need_primary_class_options: nine options
one_question_fit_option_refs: seven options
free_text_allowed: false
reviewer_notes_export_allowed: false
question_text_allowed: false
selection_row_count_required: 24
```

fail-closed:

```text
- free text欄を成果物へ残す。
- question text / draft question text欄を作る。
- reviewer person確認を省く。
- 24件未満を許す。
```

---

### CR09: actual local-only human review operation receipt intake

目的:

```text
人間reviewerがlocal-onlyで24件を実読したことを、body-free receiptとして受ける。
```

実装候補:

```text
build_p7_r54_ahr_cr09_actual_local_human_review_operation_receipt(
    cr08_form,
    operation_receipt_input,
)
assert_p7_r54_ahr_cr09_actual_local_human_review_operation_receipt_contract()
```

completeに近づくための最低条件:

```text
actual_human_review_executed_by_person: true
reviewer_is_person: true
reviewer_person_confirmed: true
reviewer_local_only_read_receipt_present: true
operation_receipt_ref_present: true
review_started_at_bucket_ref_present: true
review_completed_at_bucket_ref_present: true
reviewed_case_count: 24
selection_row_count: 24
local_only: true
must_not_export: true
selection_only: true
```

この段階でtrueにしてよい可能性があるもの:

```text
actual_human_review_run_here: true
actual_human_review_executed_by_person: true
```

この段階でもまだtrueにしないもの:

```text
actual_review_evidence_complete: false
p5_human_blind_qa_confirmed_final: false
p6_start_allowed: false
p8_start_allowed: false
r52_reintake_execution_requested_here: false
release_allowed: false
```

fail-closed:

```text
- reviewerがpersonでない。
- local-only読了receiptなし。
- operation_receipt_refなし。
- reviewed_case_count != 24。
- selection_row_count != 24。
- raw body / question text / local path / hash混入。
```

---

### CR10: sanitized selection-only result rows intake

目的:

```text
reviewerのselection-only結果24件を、body-free sanitized rowsとして受ける。
```

実装候補:

```text
build_p7_r54_ahr_cr10_sanitized_review_result_row_intake(
    cr09_operation_receipt,
    raw_selection_rows,
)
assert_p7_r54_ahr_cr10_sanitized_review_result_row_intake_contract()
```

row必須:

```text
row_count: 24
case_ref_id matches manifest
blind_case_id matches manifest
packet_ref_id matches manifest
axis_scores contains exactly six axes
question_need_primary_class in allowed options
one_question_fit_ref in allowed options
selection_only: true
body_free: true
```

fail-closed:

```text
- 24 rowsでない。
- manifest外case_ref_idがある。
- blind_case_id / packet_ref_id不一致。
- axis欠落。
- free text / body / question text / path / hash混入。
```

---

### CR11: rating row normalization

目的:

```text
sanitized rowsから、P5評価用のbody-free rating rowsを正規化する。
```

実装候補:

```text
build_p7_r54_ahr_cr11_rating_row_normalization(cr10_sanitized_rows)
assert_p7_r54_ahr_cr11_rating_row_normalization_contract()
```

出力:

```text
rating_row_count: 24
axis_refs: six axes
axis_score_count_per_row: 6
axis_target_thresholds present
below_target_axis_refs per row
average_axis_scores
axis_pass_flags
```

rating rowは、本文ではなく評価数値とrefsだけです。

---

### CR12: readfeel blocker / execution blocker normalization

目的:

```text
P5 repair / P4 current-only repair / operation blockerを、body-free blocker rowsへ分離する。
```

実装候補:

```text
build_p7_r54_ahr_cr12_blocker_row_normalization(cr11_rating_rows)
assert_p7_r54_ahr_cr12_blocker_row_normalization_contract()
```

blocker分類:

```text
p5_readfeel_repair_required
p5_history_connection_weak
p5_creepy_or_overclaim_risk
p5_self_blame_amplification_risk
p4_current_only_surface_repair_required
operation_blocked_missing_receipt
operation_blocked_body_leak
operation_blocked_question_text
operation_blocked_disposal_missing
inconclusive_insufficient_material
```

禁止:

```text
P5 repair required caseをP8 material candidateへ逃がさない。
P4 current-only repair required caseをP8 material candidateへ逃がさない。
execution blocker caseをP8 material candidateへ逃がさない。
readfeel blocker caseをP8 material candidateへ逃がさない。
```

---

### CR13: question need observation normalization

目的:

```text
P8詳細設計の根拠になるbody-free question need observation rowsを作る。
問い文・draft問い文は作らない。
```

実装候補:

```text
build_p7_r54_ahr_cr13_question_need_observation_normalization(
    cr10_sanitized_rows,
    cr11_rating_rows,
    cr12_blockers,
)
assert_p7_r54_ahr_cr13_question_need_observation_normalization_contract()
```

必須:

```text
question_need_observation_row_count: 24
question_text_materialized_here: false
draft_question_text_materialized_here: false
p8_question_implementation_spec_finalized_here: false
p8_start_allowed: false
```

P8 material candidateになり得る条件:

```text
- primary classが question_may_reduce_overread_risk / plus_single_question_candidate_later / premium_deep_dive_candidate_later に寄っている。
- one_question_fit_ref == fits_one_question。
- ただし、P5 repair / P4 repair / execution blocker / readfeel blockerではない。
- 問いを出すと入力直後の観測体験が重くなるcaseではない。
```

---

### CR14: rating-question consistency guard

目的:

```text
rating結果とquestion observationが矛盾していないかを検査し、P5 repair / P8 material candidateの逃げを防ぐ。
```

実装候補:

```text
build_p7_r54_ahr_cr14_rating_question_consistency_guard(
    cr11_rating_rows,
    cr12_blockers,
    cr13_question_observations,
)
assert_p7_r54_ahr_cr14_rating_question_consistency_guard_contract()
```

検出例:

```text
- ratingがtarget未満なのにP8 candidateへ逃がしている。
- creepy / overclaim riskがあるのに問いで補う扱いにしている。
- self_blame riskがあるのに質問候補へしている。
- question_would_make_immediate_observation_heavyなのにP8 candidateへしている。
- insufficient_material_execution_blockerなのにP8 candidateへしている。
```

fail-closed:

```text
consistency_issue_row_count > 0 の場合、actual_review_evidence_completeへ進まない。
```

---

### CR15: pause / abort / expiration / disposal receipt

目的:

```text
local-only body-full packet lifecycleを曖昧に残さず、pause / abort / expiration / disposalをbody-free receiptで閉じる。
```

実装候補:

```text
build_p7_r54_ahr_cr15_disposal_receipt(
    cr14_consistency_guard,
    disposal_receipt_input,
)
assert_p7_r54_ahr_cr15_disposal_receipt_contract()
```

必須:

```text
disposal_receipt_ref_present: true
disposal_status_ref in [BODY_PURGED, LOCAL_ONLY_PACKET_NOT_MATERIALIZED, DISPOSAL_FAILED]
body_removed: true if packet materialized
content_hash_of_body_stored: false
local_absolute_path_included: false
body_free: true
```

fail-closed:

```text
- disposal receiptなし。
- packet materializedなのにbody_removed trueなし。
- body hash保存。
- local path保存。
- reviewer notes body保存。
```

---

### CR16: post-review summary / evidence complete predicate

目的:

```text
actual review evidence completeを、rows / disposal / no-leak / no-question / no-touchが揃った場合にだけtrueにする。
```

実装候補:

```text
build_p7_r54_ahr_cr16_bodyfree_post_review_summary(
    cr09_receipt,
    cr10_rows,
    cr11_ratings,
    cr12_blockers,
    cr13_questions,
    cr14_guard,
    cr15_disposal,
)
assert_p7_r54_ahr_cr16_bodyfree_post_review_summary_contract()
```

complete条件:

```text
actual_human_review_executed_by_person: true
reviewed_case_count: 24
sanitized_review_result_row_count: 24
rating_row_count: 24
question_need_observation_row_count: 24
disposal_verified: true
no_body_leak_validation_passed: true
no_question_text_validation_passed: true
no_touch_validation_passed: true
consistency_guard_passed: true
actual_review_evidence_complete: true
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

---

### CR17: P5 decision candidate / repair separation

目的:

```text
P5 confirmed candidate / P5 repair / P4 current-only repair / operation blocked / inconclusiveを分ける。
P5 finalにはしない。
```

実装候補:

```text
build_p7_r54_ahr_cr17_p5_decision_candidate_separation(cr16_summary)
assert_p7_r54_ahr_cr17_p5_decision_candidate_separation_contract()
```

decision refs案:

```text
P5_CONFIRMED_CANDIDATE_BODYFREE_ONLY
P5_REPAIR_REQUIRED_BEFORE_R52_REINTAKE
P4_CURRENT_ONLY_REPAIR_REQUIRED_BEFORE_R52_REINTAKE
R54_OPERATION_BLOCKED_BODY_LEAK_OR_QUESTION_TEXT
R54_OPERATION_BLOCKED_DISPOSAL_NOT_VERIFIED
R54_OPERATION_INCONCLUSIVE_INSUFFICIENT_MATERIAL
```

注意:

```text
P5_CONFIRMED_CANDIDATE != P5 final
P5_REPAIR_REQUIRED != P8 material candidate
```

---

### CR18: P6 candidate-only handoff

目的:

```text
P5 decision candidateが成立した場合のみ、P6 limited human readfeel candidate-onlyへ材料を渡す。
P6 startはしない。
```

実装候補:

```text
build_p7_r54_ahr_cr18_p6_candidate_only_handoff(cr17_p5_decision)
assert_p7_r54_ahr_cr18_p6_candidate_only_handoff_contract()
```

固定:

```text
p6_candidate_only_handoff_materialized: true/false
p6_limited_human_readfeel_start_allowed: false
p6_start_allowed: false
```

---

### CR19: P8 material candidate-only handoff

目的:

```text
actual review由来のquestion need observation rowsから、P8詳細設計用の材料候補だけをbody-freeに渡す。
```

実装候補:

```text
build_p7_r54_ahr_cr19_p8_material_candidate_only_handoff(
    cr13_question_observations,
    cr14_consistency_guard,
    cr17_p5_decision,
)
assert_p7_r54_ahr_cr19_p8_material_candidate_only_handoff_contract()
```

固定:

```text
p8_material_candidate_only: true/false
p8_question_text_generation: false
p8_question_api_implemented: false
p8_question_db_schema_implemented: false
p8_question_rn_ui_implemented: false
p8_question_trigger_logic_implemented: false
p8_start_allowed: false
```

P8 candidate rowに入れてよいもの:

```text
case_ref_id
blind_case_id
question_need_primary_class
one_question_fit_ref
p8_candidate_reason_ref
plus_or_premium_candidate_ref
body_free: true
```

入れてはいけないもの:

```text
question text
draft question text
raw input
answer body
comment_text
history body
reviewer notes
```

---

### CR20: R52 handoff candidate envelope

目的:

```text
actual review evidence complete後、R52 re-intakeに渡せるbody-free envelopeを作る。
ただしR52 actual executionはしない。
```

実装候補:

```text
build_p7_r54_ahr_cr20_r52_handoff_candidate_envelope(
    cr16_summary,
    cr17_p5_decision,
    cr18_p6_candidate,
    cr19_p8_candidate,
)
assert_p7_r54_ahr_cr20_r52_handoff_candidate_envelope_contract()
```

固定:

```text
r52_reintake_handoff_ready: true/false
r52_reintake_handoff_envelope_materialized_here: true/false
r52_reintake_execution_allowed_here: false
r52_reintake_execution_started_here: false
r52_reintake_execution_completed_here: false
actual_r52_reintake_execution_confirmed: false
```

claim boundary:

```text
R52 handoff ready != R52 re-intake executed
```

---

### CR21: final no-body-leak / no-question-text / no-touch validation

目的:

```text
CR00〜CR20のbody-free artifactsを横断し、body / question / path / hash / no-touch違反がないことを確認する。
```

実装候補:

```text
build_p7_r54_ahr_cr21_final_no_body_leak_no_question_text_no_touch_validation(materials)
assert_p7_r54_ahr_cr21_final_no_body_leak_no_question_text_no_touch_validation_contract()
```

validation target:

```text
CR00 scope
CR01 basis
CR02 historical separation
CR03 impact
CR04 manifest
CR05 preflight
CR06 request
CR07 packet receipt / scan
CR08 reviewer form
CR09 operation receipt
CR10 sanitized rows
CR11 rating rows
CR12 blocker rows
CR13 question observation rows
CR14 consistency guard
CR15 disposal receipt
CR16 summary
CR17 P5 decision
CR18 P6 candidate
CR19 P8 candidate
CR20 R52 handoff envelope
```

passed条件:

```text
no_body_leak_validation_passed: true
no_question_text_validation_passed: true
no_touch_validation_passed: true
forbidden_key_refs_detected: []
body_or_question_leak_refs: []
path_or_hash_leak_refs: []
contract_mutation_refs: []
```

---

### CR22: validation command matrix / documentation output

目的:

```text
実装時のtarget tests / selected regression / compileall / result memo / claim boundaryをdocumentationとして閉じる。
```

実装候補:

```text
build_p7_r54_ahr_cr22_validation_command_matrix_documentation_output(
    cr21_validation,
    command_rows,
)
assert_p7_r54_ahr_cr22_validation_command_matrix_documentation_output_contract()
```

must remain unclaimed:

```text
actual human review complete unless CR16 actual evidence predicate passed with real operation receipt
full backend suite green
RN contract green unless actually run
RN real-device modal verified
P5 final
P6 start
P8 start
R52 actual execution
P7 complete
release allowed
```

---

## 13. json / schema案

本章は実装に使う候補schemaです。  
**本書ではjson / schemaファイルを実ファイル化しません。実ファイル化は実装段階で判断します。**

### 13.1 `current_received_basis_envelope.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.current_received_actual_local_review.current_received_basis_envelope.bodyfree.v1",
  "title": "Cocolon EmlisAI P7-R54-AHR Current Received Basis Envelope - Body-free",
  "type": "object",
  "required": [
    "schema_version",
    "material_id",
    "actual_review_basis_ref",
    "actual_review_basis_allowed_ref",
    "outer_received_zip_refs",
    "historical_basis_refs",
    "historical_refs_used_as_current_actual_review_evidence",
    "body_free",
    "p8_start_allowed",
    "release_allowed"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.current_received_actual_local_review.current_received_basis_envelope.bodyfree.v1"
    },
    "material_id": { "type": "string", "minLength": 1 },
    "actual_review_basis_ref": { "const": "current_received_snapshot_264_85_258_171" },
    "actual_review_basis_allowed_ref": { "const": "current_received_snapshot_264_85_258_171_only" },
    "outer_received_zip_refs": {
      "type": "object",
      "required": [
        "premise_zip_ref",
        "implemented_materials_zip_ref",
        "roadmap_zip_ref",
        "rn_zip_ref",
        "backend_zip_ref"
      ],
      "additionalProperties": { "type": "string" }
    },
    "internal_source_lineage_refs_separated": { "const": true },
    "historical_basis_refs": {
      "type": "array",
      "items": { "type": "string" }
    },
    "historical_refs_used_as_current_actual_review_evidence": { "const": false },
    "actual_human_review_complete": { "const": false },
    "body_free": { "const": true },
    "p8_start_allowed": { "const": false },
    "release_allowed": { "const": false }
  },
  "additionalProperties": true
}
```

### 13.2 `body_free_24_case_manifest.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.current_received_actual_local_review.body_free_24_case_manifest.v1",
  "title": "Cocolon EmlisAI P7-R54-AHR Current Received 24 Case Manifest - Body-free",
  "type": "object",
  "required": [
    "schema_version",
    "actual_review_basis_ref",
    "required_case_count",
    "case_row_count",
    "case_rows",
    "case_rows_bodyfree_only",
    "body_full_packet_materialized_here",
    "actual_human_review_run_here",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.current_received_actual_local_review.body_free_24_case_manifest.v1"
    },
    "actual_review_basis_ref": { "const": "current_received_snapshot_264_85_258_171" },
    "required_case_count": { "const": 24 },
    "case_row_count": { "const": 24 },
    "case_rows_bodyfree_only": { "const": true },
    "case_rows": {
      "type": "array",
      "minItems": 24,
      "maxItems": 24,
      "items": {
        "type": "object",
        "required": [
          "case_index",
          "case_ref_id",
          "blind_case_id",
          "packet_ref_id",
          "family_ref",
          "case_role_ref",
          "subscription_tier_ref",
          "history_evidence_policy_ref",
          "review_axis_profile_ref",
          "reviewer_facing_family_exposed",
          "reviewer_facing_tier_exposed",
          "body_free"
        ],
        "properties": {
          "case_index": { "type": "integer", "minimum": 1, "maximum": 24 },
          "case_ref_id": { "type": "string", "minLength": 1 },
          "blind_case_id": { "type": "string", "minLength": 1 },
          "packet_ref_id": { "type": "string", "minLength": 1 },
          "family_ref": { "type": "string", "minLength": 1 },
          "case_role_ref": { "type": "string", "minLength": 1 },
          "subscription_tier_ref": { "type": "string", "minLength": 1 },
          "history_evidence_policy_ref": { "type": "string", "minLength": 1 },
          "review_axis_profile_ref": { "type": "string", "minLength": 1 },
          "reviewer_facing_family_exposed": { "const": false },
          "reviewer_facing_tier_exposed": { "const": false },
          "body_free": { "const": true }
        },
        "additionalProperties": false
      }
    },
    "body_full_packet_materialized_here": { "const": false },
    "actual_human_review_run_here": { "const": false },
    "body_free": { "const": true }
  },
  "additionalProperties": true
}
```

### 13.3 `local_only_body_full_packet_receipt.bodyfree.schema.json` 案

これはbody-free receipt schemaです。body-full packet schemaではありません。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.current_received_actual_local_review.local_only_body_full_packet_receipt.bodyfree.v1",
  "title": "Local-only Body-full Packet Generation Receipt - Body-free",
  "type": "object",
  "required": [
    "schema_version",
    "actual_review_basis_ref",
    "packet_generation_request_ref",
    "packet_generation_receipt_ref",
    "packet_case_count",
    "packet_completeness_scan_ref",
    "export_denylist_scan_ref",
    "body_full_packet_content_included",
    "local_absolute_path_included",
    "body_hash_included",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.current_received_actual_local_review.local_only_body_full_packet_receipt.bodyfree.v1"
    },
    "actual_review_basis_ref": { "const": "current_received_snapshot_264_85_258_171" },
    "packet_generation_request_ref": { "type": "string", "minLength": 1 },
    "packet_generation_receipt_ref": { "type": "string", "minLength": 1 },
    "packet_case_count": { "const": 24 },
    "packet_completeness_scan_ref": { "type": "string", "minLength": 1 },
    "export_denylist_scan_ref": { "type": "string", "minLength": 1 },
    "packet_completeness_passed": { "type": "boolean" },
    "export_denylist_scan_passed": { "type": "boolean" },
    "body_full_packet_content_included": { "const": false },
    "raw_input_included": { "const": false },
    "returned_emlis_body_included": { "const": false },
    "history_surface_included": { "const": false },
    "comment_text_included": { "const": false },
    "local_absolute_path_included": { "const": false },
    "body_hash_included": { "const": false },
    "terminal_output_body_included": { "const": false },
    "body_free": { "const": true }
  },
  "additionalProperties": false
}
```

### 13.4 `reviewer_selection_form.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.current_received_actual_local_review.reviewer_selection_form.bodyfree.v1",
  "title": "Reviewer Selection-only Form - Body-free",
  "type": "object",
  "required": [
    "schema_version",
    "actual_review_basis_ref",
    "selection_form_status_ref",
    "rating_axis_refs",
    "rating_axis_target_thresholds",
    "question_need_primary_class_options",
    "one_question_fit_option_refs",
    "free_text_allowed",
    "question_text_allowed",
    "selection_row_count_required",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.current_received_actual_local_review.reviewer_selection_form.bodyfree.v1"
    },
    "actual_review_basis_ref": { "const": "current_received_snapshot_264_85_258_171" },
    "selection_form_status_ref": { "type": "string", "minLength": 1 },
    "rating_axis_refs": {
      "type": "array",
      "prefixItems": [
        { "const": "history_connection_naturalness" },
        { "const": "creepy_absence" },
        { "const": "overclaim_absence" },
        { "const": "self_blame_non_amplification" },
        { "const": "wants_more_input_or_accumulation" },
        { "const": "non_shallow_repeat" }
      ],
      "minItems": 6,
      "maxItems": 6
    },
    "rating_axis_target_thresholds": {
      "type": "object",
      "required": [
        "history_connection_naturalness",
        "creepy_absence",
        "overclaim_absence",
        "self_blame_non_amplification",
        "wants_more_input_or_accumulation",
        "non_shallow_repeat"
      ],
      "properties": {
        "history_connection_naturalness": { "const": 0.9 },
        "creepy_absence": { "const": 0.95 },
        "overclaim_absence": { "const": 0.95 },
        "self_blame_non_amplification": { "const": 0.95 },
        "wants_more_input_or_accumulation": { "const": 0.85 },
        "non_shallow_repeat": { "const": 0.9 }
      },
      "additionalProperties": false
    },
    "question_need_primary_class_options": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 9,
      "maxItems": 9
    },
    "one_question_fit_option_refs": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 7,
      "maxItems": 7
    },
    "free_text_allowed": { "const": false },
    "reviewer_notes_export_allowed": { "const": false },
    "question_text_allowed": { "const": false },
    "selection_row_count_required": { "const": 24 },
    "body_free": { "const": true }
  },
  "additionalProperties": true
}
```

### 13.5 `actual_local_human_review_operation_receipt.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.current_received_actual_local_review.actual_local_human_review_operation_receipt.bodyfree.v1",
  "title": "Actual Local-only Human Review Operation Receipt - Body-free",
  "type": "object",
  "required": [
    "schema_version",
    "review_session_id",
    "actual_review_basis_ref",
    "operation_receipt_ref",
    "reviewer_person_ref",
    "reviewer_is_person",
    "reviewer_person_confirmed",
    "reviewer_local_only_read_receipt_present",
    "actual_human_review_executed_by_person",
    "reviewed_case_count",
    "selection_row_count",
    "local_only",
    "must_not_export",
    "selection_only",
    "body_full_packet_content_included",
    "question_text_included",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.current_received_actual_local_review.actual_local_human_review_operation_receipt.bodyfree.v1"
    },
    "review_session_id": { "type": "string", "minLength": 1 },
    "actual_review_basis_ref": { "const": "current_received_snapshot_264_85_258_171" },
    "operation_receipt_ref": { "type": "string", "minLength": 1 },
    "reviewer_person_ref": { "type": "string", "minLength": 1 },
    "reviewer_is_person": { "const": true },
    "reviewer_person_confirmed": { "const": true },
    "reviewer_local_only_read_receipt_present": { "const": true },
    "actual_human_review_executed_by_person": { "const": true },
    "review_started_at_bucket_ref": { "type": "string" },
    "review_completed_at_bucket_ref": { "type": "string" },
    "reviewed_case_count": { "const": 24 },
    "selection_row_count": { "const": 24 },
    "local_only": { "const": true },
    "must_not_export": { "const": true },
    "selection_only": { "const": true },
    "body_full_packet_content_included": { "const": false },
    "raw_input_included": { "const": false },
    "returned_emlis_body_included": { "const": false },
    "history_surface_included": { "const": false },
    "reviewer_free_text_included": { "const": false },
    "reviewer_notes_body_included": { "const": false },
    "question_text_included": { "const": false },
    "draft_question_text_included": { "const": false },
    "local_absolute_path_included": { "const": false },
    "body_hash_included": { "const": false },
    "terminal_output_body_included": { "const": false },
    "body_free": { "const": true }
  },
  "additionalProperties": false
}
```

### 13.6 `sanitized_review_result_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.current_received_actual_local_review.sanitized_review_result_row.bodyfree.v1",
  "title": "Sanitized Selection-only Review Result Row - Body-free",
  "type": "object",
  "required": [
    "schema_version",
    "review_session_id",
    "case_ref_id",
    "blind_case_id",
    "packet_ref_id",
    "axis_scores",
    "question_need_primary_class",
    "one_question_fit_ref",
    "selection_only",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.current_received_actual_local_review.sanitized_review_result_row.bodyfree.v1"
    },
    "review_session_id": { "type": "string", "minLength": 1 },
    "case_ref_id": { "type": "string", "minLength": 1 },
    "blind_case_id": { "type": "string", "minLength": 1 },
    "packet_ref_id": { "type": "string", "minLength": 1 },
    "axis_scores": {
      "type": "object",
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
      },
      "additionalProperties": false
    },
    "question_need_primary_class": {
      "enum": [
        "no_question_needed_emlis_can_observe",
        "question_may_reduce_overread_risk",
        "question_would_make_immediate_observation_heavy",
        "not_question_emlis_readfeel_repair_required",
        "not_question_p5_surface_repair_required",
        "not_question_gate_boundary_required",
        "plus_single_question_candidate_later",
        "premium_deep_dive_candidate_later",
        "insufficient_material_execution_blocker"
      ]
    },
    "one_question_fit_ref": {
      "enum": [
        "not_needed",
        "fits_one_question",
        "needs_more_than_one_question_not_p7",
        "would_delay_immediate_observation",
        "unsafe_or_boundary_not_question",
        "repair_required_not_question",
        "insufficient_material"
      ]
    },
    "selection_only": { "const": true },
    "raw_input_included": { "const": false },
    "comment_text_included": { "const": false },
    "reviewer_free_text_included": { "const": false },
    "question_text_included": { "const": false },
    "body_free": { "const": true }
  },
  "additionalProperties": false
}
```

### 13.7 `question_need_observation_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.current_received_actual_local_review.question_need_observation_row.bodyfree.v1",
  "title": "Question Need Observation Row - Body-free / No Question Text",
  "type": "object",
  "required": [
    "schema_version",
    "case_ref_id",
    "blind_case_id",
    "question_need_primary_class",
    "one_question_fit_ref",
    "p8_material_candidate_only",
    "question_text_materialized_here",
    "draft_question_text_materialized_here",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.current_received_actual_local_review.question_need_observation_row.bodyfree.v1"
    },
    "case_ref_id": { "type": "string", "minLength": 1 },
    "blind_case_id": { "type": "string", "minLength": 1 },
    "question_need_primary_class": { "type": "string", "minLength": 1 },
    "one_question_fit_ref": { "type": "string", "minLength": 1 },
    "p8_material_candidate_only": { "type": "boolean" },
    "p5_repair_required": { "type": "boolean" },
    "p4_current_only_repair_required": { "type": "boolean" },
    "execution_blocked": { "type": "boolean" },
    "readfeel_blocked": { "type": "boolean" },
    "question_text_materialized_here": { "const": false },
    "draft_question_text_materialized_here": { "const": false },
    "question_api_implemented": { "const": false },
    "question_db_schema_implemented": { "const": false },
    "question_rn_ui_implemented": { "const": false },
    "p8_start_allowed": { "const": false },
    "raw_input_included": { "const": false },
    "comment_text_included": { "const": false },
    "body_free": { "const": true }
  },
  "additionalProperties": false
}
```

### 13.8 `disposal_receipt.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.current_received_actual_local_review.disposal_receipt.bodyfree.v1",
  "title": "Body-free Disposal / Purge Receipt",
  "type": "object",
  "required": [
    "schema_version",
    "review_session_id",
    "actual_review_basis_ref",
    "disposal_receipt_ref",
    "disposal_status_ref",
    "body_removed",
    "content_hash_of_body_stored",
    "local_absolute_path_included",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.current_received_actual_local_review.disposal_receipt.bodyfree.v1"
    },
    "review_session_id": { "type": "string", "minLength": 1 },
    "actual_review_basis_ref": { "const": "current_received_snapshot_264_85_258_171" },
    "disposal_receipt_ref": { "type": "string", "minLength": 1 },
    "disposal_status_ref": {
      "enum": [
        "BODY_PURGED",
        "LOCAL_ONLY_PACKET_NOT_MATERIALIZED",
        "DISPOSAL_FAILED",
        "DISPOSAL_NOT_VERIFIED"
      ]
    },
    "body_removed": { "type": "boolean" },
    "content_hash_of_body_stored": { "const": false },
    "local_absolute_path_included": { "const": false },
    "body_full_packet_content_included": { "const": false },
    "reviewer_notes_body_included": { "const": false },
    "body_free": { "const": true }
  },
  "additionalProperties": false
}
```

### 13.9 `post_review_summary.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.current_received_actual_local_review.post_review_summary.bodyfree.v1",
  "title": "Post-review Summary / Actual Evidence Complete Predicate - Body-free",
  "type": "object",
  "required": [
    "schema_version",
    "review_session_id",
    "actual_review_basis_ref",
    "actual_human_review_executed_by_person",
    "reviewed_case_count",
    "sanitized_review_result_row_count",
    "rating_row_count",
    "question_need_observation_row_count",
    "disposal_verified",
    "no_body_leak_validation_passed",
    "no_question_text_validation_passed",
    "no_touch_validation_passed",
    "actual_review_evidence_complete",
    "p5_confirmed_final",
    "p6_start_allowed",
    "p8_start_allowed",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.current_received_actual_local_review.post_review_summary.bodyfree.v1"
    },
    "review_session_id": { "type": "string", "minLength": 1 },
    "actual_review_basis_ref": { "const": "current_received_snapshot_264_85_258_171" },
    "actual_human_review_executed_by_person": { "type": "boolean" },
    "reviewed_case_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "sanitized_review_result_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "rating_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "question_need_observation_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "disposal_verified": { "type": "boolean" },
    "no_body_leak_validation_passed": { "type": "boolean" },
    "no_question_text_validation_passed": { "type": "boolean" },
    "no_touch_validation_passed": { "type": "boolean" },
    "actual_review_evidence_complete": { "type": "boolean" },
    "p5_human_blind_qa_confirmed_candidate": { "type": "boolean" },
    "p5_human_blind_qa_confirmed_final": { "const": false },
    "p5_confirmed_final": { "const": false },
    "p5_final_allowed": { "const": false },
    "p6_start_allowed": { "const": false },
    "p8_start_allowed": { "const": false },
    "actual_r52_reintake_execution_confirmed": { "const": false },
    "p7_complete": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  },
  "additionalProperties": true
}
```

---

## 14. validation plan

### 14.1 target tests

実装段階では、CR00〜CR22を小分けにします。

```text
python -m pytest ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr00_cr01_20260628.py -q
python -m pytest ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr02_cr03_20260628.py -q
python -m pytest ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr04_cr05_20260628.py -q
python -m pytest ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr06_cr07_20260628.py -q
python -m pytest ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr08_cr09_20260628.py -q
python -m pytest ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr10_cr11_20260628.py -q
python -m pytest ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr12_cr13_20260628.py -q
python -m pytest ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr14_cr15_20260628.py -q
python -m pytest ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr16_cr17_20260628.py -q
python -m pytest ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr18_cr19_20260628.py -q
python -m pytest ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr20_cr21_20260628.py -q
python -m pytest ai/tests/test_r54_ahr_current_received_actual_local_review_operation_cr22_20260628.py -q
```

### 14.2 selected regression

実装後の候補:

```text
python -m pytest ai/tests/test_r54_ahr_current_snapshot_actual_review_reentry_cs00_cs18_20260628.py -q  # 実ファイル名は既存分割に合わせる
python -m pytest ai/tests/test_r54_actual_human_review_execution_bodyfree_intake_*.py -q       # 既存AHR分割に合わせる
python -m pytest ai/tests/test_r55_r54_evidence_reconcile_r52_reintake_decision_materialization*.py -q
python -m pytest ai/tests/test_r52_r51_handoff_p6_p8_start_decision_gate*.py -q
python -m compileall ai/services/ai_inference ai/tests
```

既存CS18結果では、selected regression greenはfull backend suite greenではないと固定されています。  
本実装でも同じです。

### 14.3 full backend / RN

本工程の主blockerはactual review rows未成立です。  
ただしP7完了やrelease判断の前には別途必要です。

```text
full_backend_suite_green_confirmed: 実行した場合のみtrue候補。未実行ならfalse。
rn_contract_green_confirmed: 実行した場合のみtrue候補。未実行ならfalse。
rn_real_device_modal_verified: 実機で確認した場合のみtrue候補。RN contract greenとは別。
```

---

## 15. fail-closed条件

次が1つでも発生した場合、actual review evidence completeへ進めません。

```text
- current received basis 264/85/258/171 を固定できない。
- 既存CS18 basis 262/84/257/170を今回actual review evidenceとして無条件採用している。
- 既存AHR basis 260/83/256/169を今回actual review evidenceとして無条件採用している。
- direct diff unavailableをno impactとして扱う。
- 24-case manifestが24件でない。
- case_ref_id / blind_case_id / packet_ref_id が重複する。
- local-only preflightなしにpacket generationへ進む。
- explicit allowなしにbody-full packet generationへ進む。
- body-full packet contentが成果物へ混ざる。
- raw input / returned Emlis body / history surface / comment_text bodyが成果物へ混ざる。
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
- no_body_leak / no_question_text / no_touch validationが通っていない。
- P5 repair required caseをP8 material candidateへ逃がしている。
- P4 current-only repair required caseをP8 material candidateへ逃がしている。
- execution blocker caseをP8 material candidateへ逃がしている。
- readfeel blocker caseをP8 material candidateへ逃がしている。
- helper greenをactual human review completeへ変換している。
- P8 material candidate-onlyをP8 start allowedへ変換している。
- P5 confirmed candidateをP5 finalへ変換している。
- R52 handoff readyをR52 actual execution済みへ変換している。
- full backend suite未実行をgreen扱いしている。
- RN contract greenをRN実機modal確認として扱っている。
```

---

## 16. acceptance criteria

### 16.1 この設計書の完了条件

```text
- md設計書が作成されている。
- 実装順がCR00〜CR22として定義されている。
- current basis 264/85/258/171 と historical refs 262/84/257/170 / 260/83/256/169 の分離が明記されている。
- local-only / body-free / no-touch / no-question-text / no-path-hash boundaryが明記されている。
- json / schema案が本書内にあり、実ファイル化しないことが明記されている。
- P8 / P6 / R52 actual execution / P5 final / releaseを進めないことが明記されている。
```

### 16.2 実装完了条件

```text
- 新規helperまたは既存方針に沿った薄いoperation layerが実装される。
- 既存AHR / CS helperは直接basis差し替えされない。
- CR00〜CR22 target testsがgreen。
- selected regressionが必要範囲でgreen。
- compileallがgreen。
- result memoがbody-freeで作られる。
- code変更範囲がP7-R54-AHR operation boundaryに閉じている。
```

### 16.3 actual review evidence complete条件

実装greenだけでは不十分です。actual review evidence completeには次が必要です。

```text
actual_human_review_executed_by_person: true
reviewed_case_count: 24
sanitized_review_result_row_count: 24
rating_row_count: 24
question_need_observation_row_count: 24
disposal_verified: true
no_body_leak_validation_passed: true
no_question_text_validation_passed: true
no_touch_validation_passed: true
actual_review_evidence_complete: true
```

### 16.4 complete後も未成立のまま保持するもの

actual review evidence completeになっても、次は別判断です。

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

## 17. result memo方針

実装時のresult memoには、最低限次を残します。

```text
1. 実装範囲
2. 変更ファイル
3. current received basis refs
4. historical refs separation
5. target test結果
6. selected regression結果
7. actual human review実行有無
8. actual rows成立有無
9. disposal receipt成立有無
10. no-touch確認
11. claim boundary
12. 未成立のまま保持するもの
13. 華恋メモ
```

result memoに書いてはいけないもの:

```text
- raw input
- returned body
- comment_text body
- history body
- reviewer notes body
- question text / draft question text
- local path
- body hash
- terminal output body
```

---

## 18. 確認済み

```text
- 今回のユーザー指示は、検討メモを基に実装順を含めた詳細設計書をmdで作ること。
- 本作業は設計であり、実装ではない。
- GitHub接続確認はMash指定により不要。
- 対象ロードマップでは、P7/P8 Bridgeの観測補助問いはP7中に実装しないと固定されている。
- P8開始時の問い詳細設計は、P7で集めた実ケースの問い必要性観察メモを根拠にする。
- R54-AHR-CS18までのbody-free helper / target tests / result memosは存在する。
- CS18 result memoでは、actual human review run / actual human review complete はfalseである。
- CS18 result memoでは、P5 final / P6 start / P8 start / P7 complete / release_allowed はfalseである。
- 既存AHR helperには、24-case manifest / operation receipt / sanitized rows / rating rows / question need observation / disposal / R52 handoffのbody-free構造がある。
- 既存AHR helperのbasisは260/83/256/169であり、今回current received basisとは一致しない。
- 既存CS helperのbasisは262/84/257/170であり、今回current received basisとは一致しない。
- 今回受領zip labelは264/85/258/171である。
```

---

## 19. 未確認

```text
- 264/85/258/171 と 262/84/257/170 の直接diff。
- current received basis上でのactual 24-case manifest再固定実装。
- actual body-full packet generation。
- actual 24-case local-only human review by person。
- actual sanitized review result rows 24件。
- actual rating rows 24件。
- actual question need observation rows 24件。
- actual disposal / purge receipt。
- actual R52 re-intake execution。
- full backend suite green。
- RN contract re-run。
- RN real-device modal読感確認。
```

---

## 20. 書かれていない

```text
- 現時点でP8 question API / DB / RN UI / trigger / storageを作ってよい、とは書かれていない。
- 現時点でP8 question text / draft question textを作ってよい、とは書かれていない。
- 現時点でP6 limited human readfeelを開始してよい、とは書かれていない。
- 現時点でR52 re-intake actual executionを実行してよい、とは書かれていない。
- 現時点でP5 confirmed finalへ昇格してよい、とは書かれていない。
- R54-AHR-CS18 helper greenをactual human review completeとして扱ってよい、とは書かれていない。
- 既存AHR 260/83/256/169 rowsをcurrent received 264/85/258/171 actual review rowsとして扱ってよい、とは書かれていない。
- P8 material candidate-onlyをP8 start allowedとして扱ってよい、とは書かれていない。
- full backend suite未実行をgreen扱いしてよい、とは書かれていない。
- RN contract greenをRN実機modal確認として扱ってよい、とは書かれていない。
```

---

## 21. 推測禁止

```text
- 24-case reviewを実施済みと推測しない。
- body-full packetが生成・閲覧・削除されたと推測しない。
- rating rows / question observation rowsが実レビュー由来で成立していると推測しない。
- synthetic body-free rowsをactual review rowsへ変換しない。
- 既存CS18 basisを今回受領basisのactual review evidenceへ読み替えない。
- 既存AHR basisを今回受領basisのactual review evidenceへ読み替えない。
- P8材料候補があることをP8 start allowedへ変換しない。
- P5の弱さをP8の問い返しで補ってよいと推測しない。
- helper green / selected regression greenを商品価値合格へ変換しない。
- full backend suite未実行をgreen扱いしない。
- RN contract greenとRN実機modal確認を混同しない。
```

---

## 22. 次に実行すべきこと

実装段階に入る場合、次の順に進めます。

```text
1. 新規operation helper名とCR prefixを、既存命名衝突がないか確認して確定する。
2. CR00〜CR03で、scope / no-touch / current basis / historical separation / impact assessmentを実装する。
3. CR04〜CR08で、manifest / preflight / packet request / receipt scan / reviewer formを実装する。
4. CR09〜CR16で、actual operation receipt / rows / ratings / blockers / question observations / disposal / summaryを実装する。
5. CR17〜CR20で、P5 decision candidate / P6 candidate-only / P8 material candidate-only / R52 handoff candidateを実装する。
6. CR21〜CR22で、final validation / command matrix / result memoを実装する。
7. 実装後も、actual reviewを実施していない場合は actual_human_review_complete=false を保持する。
8. actual reviewを実施する場合は、body-full packetをlocal-onlyで扱い、成果物にはbody-free receipt / rows / disposalだけを残す。
```

---

## 23. 華恋の意見

華恋の意見として、この工程は「コードを増やすこと」よりも「証跡の意味を濁らせないこと」が大事です。

CocolonにとってP5は、履歴がただ保存されているだけではなく、次の入力に対して読まれた形で返るための中核です。  
ここで人間実読をせずにP8へ進むと、問い返しがCocolonの価値を強めるのではなく、P5の弱さを隠す道具になります。

だから、次に必要なのは派手な機能追加ではありません。  
今回のcurrent received snapshotで、P5履歴線がどこまで自然に読まれるのかを、24件のactual local-only review evidenceへ落とすことです。

設計としては、新規薄いoperation helperを作る方が安全です。  
既存AHR / CS helperを直接差し替えると、過去greenの意味が変わり、どのsnapshotを読んだ証拠なのかが濁ります。  
Cocolonとして在るべき姿を考えるなら、ここは面倒でもbasisを分けるべきです。

---

## 24. 最終判断

```text
現在Phase:
  P7 Product Quality Runner / Long-run Product Gate 内。

直前に成立した段階:
  R54-AHR-CS18 Current Snapshot Actual Review Re-entry documentation boundary。

次に進める段階:
  P7-R54-AHR Current Received Snapshot Actual Local-only Human Review Operation。

actual review basis:
  current_received_snapshot_264_85_258_171。

historical / structural / regression refs:
  current_received_snapshot_262_84_257_170。
  current_received_snapshot_260_83_256_169。

実装推奨:
  既存AHR / CS helperを直接書き換えず、新規薄いoperation helperでCR00〜CR22を作る。

本設計で作らないもの:
  P8 question API / DB / RN UI / trigger / storage。
  question text / draft question text。
  P6 start。
  R52 actual execution。
  P5 final。
  P7 complete。
  release decision。

本設計の完了判断:
  実装順・boundary・json/schema案をmdに固定するところまで。
```

最終結論:

```text
P8へ進むために、P8を先に作らない。
current received snapshot 264/85/258/171で、P5履歴線が本当に読まれた証跡を先に成立させる。
```
