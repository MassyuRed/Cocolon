---
title: "Cocolon / EmlisAI P7-R54-AHR Post-RSR16 DHR Actual Source Claim Re-intake 詳細設計書・実装順"
created_at: "2026-07-05 JST"
author: "華恋"
work_mode: "共鳴構造モード"
work_type: "詳細設計書 / 実装順 / json・schema案内包"
source_mode: "local_snapshot_only"
github_connection_check: "not_required_by_mash_instruction / not_performed"
base_pre_design_memo: "Cocolon_EmlisAI_P7_R54AHR_PostRSR16_DHRActualSourceClaimReintake_PreDesignMemo_20260705.md"
selected_roadmap_phase: "P7 Product Quality Runner / Long-run Product Gate 継続"
selected_design_target: "P7-R54-AHR Post-RSR16 DHR Actual Source Claim Re-intake Boundary"
recommended_boundary_prefix: "DRI-OP00〜DRI-OP12"
recommended_prefix_meaning: "DRI = DHR Re-Intake"
recommended_helper_shape: "rsr_complete_candidate_and_supplied_receipts_bodyfree_reintake_adapter_not_dhr_execution"
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
dhr_reintake_execution: "none"
dmd_execution: "none"
r52_actual_execution: "none"
p5_finalization: "none"
p6_start: "none"
p8_start: "none"
p8_question_design: "none"
p8_question_implementation: "none"
p7_complete: "none"
release_decision: "none"
current_expected_default_from_confirmed_materials: "RSR-OP16 closed body-free / OP15 complete candidate may return to DHR actual source claim re-intake material only"
current_expected_default_next_required_step: "provide_dri_bodyfree_actual_source_claim_adapter_material_to_dhr_op04_without_auto_execution_or_wait_repair_block"
---

# Cocolon / EmlisAI P7-R54-AHR Post-RSR16 DHR Actual Source Claim Re-intake 詳細設計書・実装順

対象: Cocolon / EmlisAI / P7 Product Quality Runner / R54-AHR / Post-RSR16 / DHR actual source claim re-intake boundary  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
実装扱い: 本書は設計書です。コード変更・json/schema実ファイル化・actual review実行・DHR re-intake実行・DMD実行・R52実行・P5/P6/P8/P7/release昇格は行いません。  
json / schema実ファイル化: なし。本書内の案のみです。実ファイル化は実装段階で、既存helper・既存schema配置・既存guard・既存test結果を確認して判断します。  
GitHub接続確認: Mash指定により不要。ローカル受領zip基準。  

---

## 0. 結論

次に設計する対象は、P8 question design ではありません。  
次に設計する対象は、次です。

```text
P7-R54-AHR Post-RSR16
DHR Actual Source Claim Re-intake Boundary
```

推奨する境界prefixは次です。

```text
DRI-OP00〜DRI-OP12
DRI = DHR Re-Intake
```

推奨する実装単位は次です。

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_20260705.py
```

ただし、このhelperは **DHR re-intakeを実行するhelperではありません**。  
このhelperの役割は、RSR-OP16で閉じたbody-free result memoとRSR-OP15 selected branch、さらにsupplied body-free receipts / rows / purge receiptを再検査し、DHR-OP04へ渡せる **body-free external actual source claim adapter candidate** を作れるかどうかを判定することです。

本設計で作成してよいものは次です。

```text
- RSR-OP16 result memo intake material
- OP15 selected branch / next_required_step intake material
- supplied receipts / rows / purge receipt のbody-free再検査material
- DHR-OP04向け external_actual_operation_evidence_claim_bodyfree_optional candidate
- wait / repair / blocked / re-intake-material-ready branch
- no auto execution / no promotion result memo
- target tests / selected regression closure
```

本設計で作成してはいけないものは次です。

```text
- actual body-full packet
- actual local-only human review execution
- actual operation receipt real creation
- sanitized review result rows real creation
- rating rows real creation
- question need observation rows real creation
- disposal / purge real execution
- DHR re-intake execution
- DHR-OP04 actual call / DHR-OP05 actual call / DHR-OP06 actual call
- DMD execution
- R52 actual execution
- P5 finalization
- P6 start
- P8 start
- P8 question design / implementation
- P7 complete
- release decision
- API / DB / RN / runtime / response key変更
```

本設計の中心は、complete candidateを「実レビュー完了」に読み替えることではありません。  
**actual review evidenceとしてclaimしてよい材料かを、DHRへ戻す前にもう一段body-freeで再検査し、足りない場合はwait/repair/blockへ戻すこと**です。

---

## 1. なぜこの設計を行うのか

Cocolon / EmlisAIが目指す姿は、ユーザーの入力をテンプレ共感・短縮要約・一般感情ラベル・問い返し量産に潰さず、入力直後に「読まれた形」として返すことです。

P7は Product Quality Runner / Long-run Product Gate です。  
P7で必要なのは、helper greenやtarget greenを積み上げて安心することではなく、EmlisAIが本当に商品品質へ近づいているかを、人間の読感に近い証跡で測ることです。

RSR-OP00〜OP16は、DHR-OP09後の retry/start decision boundary を閉じました。  
しかし、RSR-OP16 result memo closure は次を意味しません。

```text
- actual local-only human review execution済み
- actual evidence complete済み
- DHR actual source claim re-intake実行済み
- DMD / R52 / P5 / P6 / P8 / P7 / release許可済み
```

したがって、次の設計では、RSR-OP16をP8開始の根拠にせず、RSR-OP15のcomplete candidateをDHR側のactual source claim re-intake材料として受け直せるかを確認します。

ここでP8質問設計へ進むと、EmlisAIが読めていないものを質問で補う構造へ寄る危険があります。  
Cocolonとしては、問いを増やす前に、P7内のactual review系証跡境界を、偽装できない形で閉じる方が先です。

---

## 2. 参照・確認範囲

### 2.1 ローカル受領zip

本設計の基準は、ローカル受領zipと直前の検討メモです。

```text
/mnt/data/Cocolon_前提資料(286).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(15).zip
/mnt/data/EmlisAIの実装済み資料(96).zip
/mnt/data/Cocolon(269).zip
/mnt/data/mashos-api(182).zip
/mnt/data/Cocolon_EmlisAI_P7_R54AHR_PostRSR16_DHRActualSourceClaimReintake_PreDesignMemo_20260705.md
```

GitHub接続確認は、Mash指定により行いません。

### 2.2 必読前提・作業姿勢

本設計では、次を確認済み前提として扱います。

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/10_cocolon_joint_development_karen_thought_boundary_2026_05_24.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/01_cocolon_overall_structure.md
Cocolon_前提資料/02_cocolon_national_system.md
Cocolon_前提資料/02C_cocolon_contract_boundary_validation.md
Cocolon_前提資料/05_cocolon_rule_file_index.md
```

固定する作業姿勢:

```text
- 設計と実装を混ぜない。
- 前提資料だけで理解したふりをしない。実ファイルも見る。
- 見ていないactual reviewを存在するものとして扱わない。
- helper greenをactual evidenceへ読み替えない。
- RSR complete candidateをDHR re-intake実行済みとして扱わない。
- P8質問設計を、P7の実レビュー不足の逃げ道にしない。
- public contract / DB / RN / response keyを指示なく変えない。
- body-full / raw input / reviewer free text / question_text / local path / hash / terminal bodyをresult memoやpublic metaへ出さない。
```

### 2.3 主な既存実装・設計

主に接続する既存helper / 設計資料は次です。

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_20260704.py
  emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py
  emlis_ai_p7_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_20260703.py
  emlis_ai_p7_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_20260703.py
  emlis_ai_p7_r54_ahr_post_dmh18_downstream_manual_decision_triage_20260703.py

mashos-api/ai/tests/
  R54_AHR_PostDHR09_ActualLocalReview_RetryStartDecision_RSR_OP00_OP16_Result_20260704.md
```

接続関係:

```text
DHR-OP09:
  Post-ELR19 downstream manual decision handoff-or-retry closure。
  default branchは retry/start required before downstream handoff。

RSR-OP00〜OP16:
  DHR-OP09後に、actual local-only reviewの開始/再試行・receipt/rows/purge intake・complete candidate resolverまでをbody-freeで閉じる。

DRI-OP00〜OP12:
  RSR-OP16後に、OP15 complete candidateとsupplied receipts/rows/purgeをDHR actual source claim re-intake材料として受け直せるかを判定する。
```

---

## 3. 現在地の整理

### 3.1 確認済み

直前検討メモと実ファイルから、次は確認済みです。

```text
- 現在の大枠はP7 Product Quality Runner / Long-run Product Gate継続。
- P8 question design / implementationへ進む段階ではない。
- RSR-OP00〜RSR-OP16は実装済み。
- RSR-OP16 result memo / target tests / selected regression closureはbody-freeで閉じている。
- RSR default next required stepは、DHR actual source claim re-intakeへ戻すこと。ただし自動実行ではない。
- RSR-OP15 complete candidateは、DHR re-intake実行ではなく、DHRへ戻す候補材料である。
- RSR-OP16 target greenはactual review完了ではない。
- RSR+DHR selected target greenはP7 completeでもrelease readyでもない。
```

直前検討メモで記録されたローカル確認結果:

```text
RSR-OP00〜OP16 target:
  338 passed

RSR-OP00〜OP16 + DHR-OP00〜OP09:
  477 passed

Post-ALR12 / ELR-OP00〜OP19:
  350 passed

Post-DMD08 / ALR-OP00〜OP12:
  97 passed

Post-DMH18 / DMD-OP00〜OP08:
  74 passed

RSR helper compileall:
  passed
```

### 3.2 未確認

本設計時点で、次は未確認のまま扱います。

```text
- full backend suite green
- RN実機modal確認
- 課金plan別実機確認
- actual body-full packet generation
- actual local-only human review execution
- actual operation receipt real creation
- sanitized review result rows real creation
- rating rows real creation
- question need observation rows real creation
- disposal / purge real execution
- DHR actual source claim re-intake execution
- DMD execution
- R52 actual execution
- P5 finalization
- P6 start
- P8 start
- P8 question design / implementation
- P7 complete
- release decision
```

### 3.3 書かれていない

次は書かれていません。

```text
- RSR-OP16 target green後にP8へ進んでよい。
- RSR-OP16 result memo closureをactual review完了としてよい。
- OP15 complete candidateをDHR / DMD / R52 / P5 / P6 / P8 / P7 / releaseへ自動実行してよい。
- question need observation rowsをP8 question spec / question_textへ変換してよい。
- body-full packet / raw input / reviewer free text / path / hashをresult memoやpublic metaへ残してよい。
```

### 3.4 推測禁止

```text
- helper green = actual review完了 と推測しない。
- result memo closure = DHR re-intake ready と推測しない。
- complete candidate = DHR re-intake executed と推測しない。
- supplied receipts候補 = actual source evidence confirmed と推測しない。
- DHR-compatible adapter candidate = DHR-OP04 confirmed と推測しない。
- DHR-OP04 confirmed = DMD/R52/P5/P6/P8/P7/release ready と推測しない。
```

---

## 4. DRIの責務境界

### 4.1 DRIが扱うもの

DRIは、RSR-OP16後のbody-free再投入境界です。  
扱う対象は次です。

```text
1. RSR-OP16 result memo intake
2. RSR-OP15 selected branch / next_required_step intake
3. RSR-OP14 final no-leak / no-promotion / source-kind validation result intake
4. RSR-OP10 actual operation receipt intake resultの再検査
5. RSR-OP11 sanitized review result rows / rating rows intake resultの再検査
6. RSR-OP12 question need observation rows intake resultの再検査
7. RSR-OP13 disposal / purge receipt intake resultの再検査
8. source_kind_ref = actual_local_only_human_review_by_person とclaimできる条件の再検査
9. body-free / no-path / no-hash / no-question-text / no-reviewer-free-text rescan
10. DHR-OP04へ渡せる external_actual_operation_evidence_claim_bodyfree_optional candidate の作成
11. wait / repair / blocked / material-ready branchの決定
12. DHR/DMD/R52/P5/P6/P8/P7/release自動実行禁止の再固定
```

### 4.2 DRIが扱わないもの

DRIは次を行いません。

```text
- actual reviewを開始しない。
- body-full packetを生成しない。
- reviewer formを表示しない。
- actual receipt / actual rows / purge receiptを作らない。
- DHR-OP04を呼び出さない。
- DHR-OP05以降を呼び出さない。
- DMDを呼び出さない。
- R52を呼び出さない。
- P5/P6/P8/P7/releaseへ進めない。
- API / DB / RN / runtime / response keyを変更しない。
```

### 4.3 DRIとDHR-OP04の関係

DHR-OP04は、外部actual source claimを受けてactual source claim separation / invalid source classificationを行う既存境界です。  
DRIは、DHR-OP04を実行せず、DHR-OP04へ渡せる候補payloadを作るところまでです。

```text
DRI output:
  external_actual_operation_evidence_claim_bodyfree_optional candidate

DHR-OP04 input candidate:
  external_actual_operation_evidence_claim_bodyfree_optional

DRIがしないこと:
  build_p7_r54_ahr_post_elr19_dhr_op04_actual_source_claim_separation_invalid_source_classification(...) の自動呼び出し
```

したがって、DRI material ready は、DHR actual source claim confirmed ではありません。  
DRI material ready は、**DHR-OP04へ渡す候補がbody-freeで揃った** という意味に限定します。

---

## 5. 推奨ファイル構成

### 5.1 helper候補

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_20260705.py
```

このhelperは新規追加を推奨します。  
既存のRSR helperへさらに追加して肥大化させるより、Post-RSR16の責務を別helperに分けた方が、DHR re-intake実行との混同を防ぎやすいためです。

### 5.2 tests候補

```text
mashos-api/ai/tests/
  test_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_dri_op00_op01_20260705.py
  test_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_dri_op02_op03_20260705.py
  test_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_dri_op04_op05_20260705.py
  test_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_dri_op06_op07_20260705.py
  test_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_dri_op08_op09_20260705.py
  test_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_dri_op10_op11_20260705.py
  test_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_dri_op12_result_20260705.py
```

### 5.3 result memo候補

```text
mashos-api/ai/tests/
  R54_AHR_PostRSR16_DHRActualSourceClaimReintake_DRI_OP00_OP12_Result_20260705.md
```

### 5.4 実ファイル化しないschema候補

実装段階で必要と判断した場合のみ、次のようなschema file化を検討します。  
本設計段階では実ファイル化しません。

```text
mashos-api/ai/schemas/
  p7_r54_ahr_post_rsr16_dri_external_actual_operation_evidence_claim_bodyfree.schema.json
  p7_r54_ahr_post_rsr16_dri_reintake_branch_result.bodyfree.schema.json
```

ただし、現状の既存helper群はPython定数 + assert contractでschema相当を固定しているため、まずは既存方針に合わせて **Python内のschema_version / required field refs / assert contract** で開始する方が自然です。

---

## 6. DRI全体データフロー

```text
[RSR-OP16 result memo]
        |
        v
DRI-OP00 scope / no-touch / no-promotion refreeze
        |
        v
DRI-OP01 RSR-OP16 body-free result memo intake
        |
        v
DRI-OP02 OP15 branch / next_required_step alignment
        |
        v
DRI-OP03 complete candidate prerequisites / supplied material inventory
        |
        +--> wait: OP15未ready / OP16未closed / supplied material不足
        +--> repair: status mismatch / count mismatch / invalid schema
        +--> blocked: body leak / promotion claim / invalid source kind
        |
        v
DRI-OP04 actual operation receipt revalidation
        |
        v
DRI-OP05 sanitized review result rows + rating rows revalidation
        |
        v
DRI-OP06 question need observation rows bridge-only revalidation
        |
        v
DRI-OP07 disposal / purge receipt revalidation
        |
        v
DRI-OP08 final body-free / no-promotion / source-kind rescan
        |
        v
DRI-OP09 DHR-OP04 external actual source claim adapter candidate materialization
        |
        v
DRI-OP10 deterministic branch resolver
        |
        +--> ready: provide candidate to DHR-OP04 manually / no auto execution
        +--> wait: missing supplied receipts / rows / purge
        +--> repair: malformed material
        +--> blocked: leak / promotion / invalid source kind
        +--> manual hold: unexpected branch
        |
        v
DRI-OP11 no-touch selected regression guard
        |
        v
DRI-OP12 result memo / target tests / selected regression closure
```

---

## 7. DRI status / branch / next_required_step設計

### 7.1 allowed status refs

```text
DRI_STATUS_READY_FOR_DHR_ACTUAL_SOURCE_CLAIM_REINTAKE_MATERIAL_NO_AUTO_EXECUTION
DRI_STATUS_WAITING_FOR_RSR_COMPLETE_CANDIDATE_OR_SUPPLIED_RECEIPTS
DRI_STATUS_REPAIR_REQUIRED_BEFORE_DHR_REINTAKE_MATERIAL
DRI_STATUS_BODYFREE_LEAK_OR_PROMOTION_BLOCKED
DRI_STATUS_MANUAL_HOLD_UNRESOLVED_NO_PROMOTION
```

### 7.2 next_required_step refs

```text
provide_dri_bodyfree_actual_source_claim_adapter_material_to_dhr_op04_without_auto_execution
wait_for_rsr_op15_complete_candidate_or_supplied_bodyfree_receipts
repair_dri_reintake_material_before_dhr_op04_adapter
blocked_dri_bodyfree_leak_promotion_or_invalid_source_kind
manual_hold_after_dri_without_downstream_promotion
```

### 7.3 ready branch成立条件

ready branchは、次をすべて満たす場合だけ成立します。

```text
- RSR-OP16 contract valid
- RSR-OP16 status = RSR_RESULT_MEMO_TESTS_SELECTED_REGRESSION_CLOSED_BODYFREE
- RSR-OP16 result_memo_bodyfree_closed = true
- RSR-OP15 contract valid
- RSR-OP15 branch = RSR_BRANCH_ACTUAL_REVIEW_EVIDENCE_READY_FOR_DHR_REINTAKE_NO_AUTO_EXECUTION
- RSR-OP15 next_required_step = return_to_dhr_actual_source_claim_reintake_without_auto_execution
- complete_candidate_prerequisite_missing_refs = []
- explicit_allow_accepted = true
- readiness_blocker_count_zero = true
- reviewer_person_confirmed = true
- packet_generation_receipt_accepted = true
- actual_operation_receipt_accepted = true
- sanitized_review_result_rows_accepted = true
- rating_rows_accepted = true
- question_need_observation_rows_accepted = true
- disposal_purge_receipt_accepted = true
- final_no_leak_validation_passed = true
- source_kind_ref = actual_local_only_human_review_by_person
- row count = 24 / rating count = 24 / expected case count = 24
- question need observation rows are bridge material only and contain no question_text
- purge receipt is body-free and carries no local path / hash / retained body
- no forbidden payload key path refs
- no body-like value path refs
- no promotion claim refs
```

### 7.4 wait branch

wait branchは、材料が未提出またはRSR branchがまだcomplete candidateでない場合です。

```text
例:
- RSR-OP16がwaiting_for_op15
- RSR-OP15がready_to_start_actual_local_only_review
- RSR-OP15がreview_in_progress_or_paused
- actual operation receipt intakeが未提出
- sanitized/rating rowsが未提出
- question need observation rowsが未提出
- purge receiptが未提出
```

wait branchではrepair扱いにしません。  
まだ必要な材料が揃っていないだけで、壊れているとは限らないためです。

### 7.5 repair branch

repair branchは、提出材料に不整合がある場合です。

```text
例:
- schema_version mismatch
- material_id missing
- review_session_id mismatch
- expected case count mismatch
- row count mismatch
- rating axis mismatch
- accepted flagとcountが矛盾
- purge receiptのrequired true fieldが欠けている
- OP15 branchとnext_required_stepが矛盾
- OP16 closedなのにverification summary missing/non-greenが残る
```

### 7.6 blocked branch

blocked branchは、Cocolonの安全境界に触れる場合です。

```text
例:
- raw_input / input_body / comment_text bodyが混入
- returned_surface_bodyが混入
- reviewer_free_text / reviewer_note_bodyが混入
- question_text / draft_question_textが混入
- body-full packet bodyが混入
- local_path / absolute_path / relative_path / file_pathが混入
- input_hash / body_hash / sha256が混入
- terminal output body / stdout / stderr / tracebackが混入
- helper_green / target_green / result_memo_green / fixture / synthetic / historical_reuse_only / candidate_shape_only をactual sourceとしてclaim
- DHR/DMD/R52/P5/P6/P8/P7/release promotion flagがtrue
```

---

## 8. 実装順

### DRI-OP00: scope / no-touch / no-promotion refreeze

目的:

```text
Post-RSR16の作業範囲を固定し、DRIがactual review・DHR execution・DMD/R52/P5/P6/P8/P7/releaseを実行しないことを最初に固定する。
```

入力候補:

```text
- review_session_id optional
- source refs only
```

出力:

```text
schema_version: cocolon.emlis.p7_r54.ahr.post_rsr16.dri.op00_scope_no_touch_no_promotion_refreeze.bodyfree.v1
operation_step_ref: DRI-OP00_scope_no_touch_no_promotion_refreeze_after_RSR_OP16
body_free: true
api_changed: false
db_changed: false
rn_changed: false
runtime_changed: false
response_key_changed: false
actual_local_human_review_executed_here: false
dhr_actual_source_claim_reintake_executed_here: false
dhr_op04_called_here: false
dmd_execution_started_here: false
r52_actual_execution_started_here: false
p5_final_allowed: false
p6_start_allowed: false
p8_start_allowed: false
p8_question_design_started: false
p8_question_implementation_started: false
p7_complete: false
release_allowed: false
```

実装注意:

```text
- 既存RSR helperの _false_flags / _body_free_markers / _no_touch_contract の思想を踏襲する。
- DHR-OP04 adapter candidateを作る前から no auto execution を固定する。
```

テスト観点:

```text
- field setが固定されている。
- public contract flagsが既存値から変わらない。
- no-touch / no-promotion false flagsがすべてfalse。
- body_free markersがすべてfalse。
```

---

### DRI-OP01: RSR-OP16 result memo intake

目的:

```text
RSR-OP16 result memoをbody-free materialとして受ける。
OP16 closureをactual review完了として読まない。
```

入力候補:

```text
rsr_op16_result_memo: Mapping[str, Any] | None
```

判定:

```text
- assert_p7_r54_ahr_post_dhr09_rsr_op16_result_memo_tests_selected_regression_closure_contract が通るか。
- rsr_op16_status_ref が allowed statusか。
- closed branchの場合、result_memo_bodyfree_closed = true か。
- result memo内に forbidden payload / body-like / promotion claim がないか。
```

出力status:

```text
DRI_OP01_RSR_OP16_CLOSED_BODYFREE_INTAKE_READY
DRI_OP01_WAITING_FOR_RSR_OP16_CLOSURE
DRI_OP01_REPAIR_RSR_OP16_RESULT_MEMO
DRI_OP01_BLOCKED_RSR_OP16_BODY_LEAK_OR_PROMOTION
```

テスト観点:

```text
- OP16 closed + valid contractでready。
- OP16 waitingならwait。
- OP16 repair_requiredならrepair。
- OP16 body leak / promotionならblocked。
- OP16 target greenをactual review completeへ昇格しない。
```

---

### DRI-OP02: OP15 selected branch / next_required_step alignment

目的:

```text
RSR-OP15のselected branchとnext_required_stepを再確認し、DHR re-intake materialへ進める候補かどうかを判定する。
```

入力候補:

```text
rsr_op15_branch_resolver: Mapping[str, Any] | None
rsr_op16_result_memo: Mapping[str, Any] | None
```

accepted branch:

```text
RSR_BRANCH_ACTUAL_REVIEW_EVIDENCE_READY_FOR_DHR_REINTAKE_NO_AUTO_EXECUTION
```

accepted next_required_step:

```text
return_to_dhr_actual_source_claim_reintake_without_auto_execution
return_to_dhr_actual_source_claim_reintake_without_auto_execution_or_wait_repair_block_by_supplied_receipts
```

出力status:

```text
DRI_OP02_RSR_OP15_DHR_REINTAKE_BRANCH_ALIGNED
DRI_OP02_WAIT_FOR_RSR_OP15_COMPLETE_CANDIDATE
DRI_OP02_REPAIR_RSR_OP15_BRANCH_NEXT_STEP_MISMATCH
DRI_OP02_MANUAL_HOLD_UNEXPECTED_RSR_OP15_BRANCH
DRI_OP02_BLOCKED_RSR_OP15_BODYFREE_LEAK_OR_PROMOTION
```

実装注意:

```text
- OP15 complete candidateをDHR re-intake executionへ変換しない。
- OP15 branchがready_to_start / in_progress / abortedの場合は、DRIで進めずRSR側へ戻す。
- OP15 manual holdは手動判断材料であり、DHRへ自動投入しない。
```

テスト観点:

```text
- accepted branch + accepted next stepでaligned。
- wait/retry branchでwait。
- next step mismatchでrepair。
- body leak / source claim blockedでblocked。
```

---

### DRI-OP03: complete candidate prerequisites / supplied material inventory

目的:

```text
RSR-OP14/OP15でcomplete candidateの前提になったsupplied receipts / rows / purge材料が、DRI再投入のinventoryとして揃っているか確認する。
```

必要prerequisites:

```text
explicit_allow_accepted
readiness_blocker_count_zero
reviewer_person_confirmed
packet_generation_receipt_accepted
actual_operation_receipt_accepted
sanitized_review_result_rows_accepted
rating_rows_accepted
question_need_observation_rows_accepted
disposal_purge_receipt_accepted
final_no_leak_validation_passed
```

出力:

```text
complete_candidate_prerequisite_refs
complete_candidate_prerequisite_satisfied_refs
complete_candidate_prerequisite_missing_refs
supplied_material_inventory_refs
supplied_material_missing_refs
```

実装注意:

```text
- OP15 candidate_refだけでactual evidence readyにしない。
- 可能ならRSR-OP10〜OP14のintake結果を直接受け、count / accepted flags / blocker refsを再検査する。
- OP15に残る bodyfree ref だけではDHR adapter candidateを作らず、supplied material不足としてwaitにする選択肢を残す。
```

テスト観点:

```text
- missing prerequisitesがある場合はwaitまたはrepair。
- accepted flag trueでもcount mismatchならrepair。
- candidate_refだけでreadyにしない。
```

---

### DRI-OP04: actual operation receipt revalidation

目的:

```text
RSR-OP10でintake済みのactual operation receipt materialを、DHR re-intake向けに再検査する。
```

要求:

```text
- schema_version matches expected RSR actual operation receipt body-free schema
- source_kind_ref = actual_local_only_human_review_by_person
- body_free = true
- actual_human_review_executed_by_person = true または同等のperson-confirmation flag
- expected_case_count = 24
- reviewed_case_count = 24
- selection_row_count = 24
- helperがreceiptを作ったclaimがない
- raw body / path / hash / terminal outputがない
```

出力status:

```text
DRI_OP04_ACTUAL_OPERATION_RECEIPT_REVALIDATED_BODYFREE
DRI_OP04_WAIT_FOR_ACTUAL_OPERATION_RECEIPT
DRI_OP04_REPAIR_ACTUAL_OPERATION_RECEIPT
DRI_OP04_BLOCKED_RECEIPT_BODY_LEAK_OR_SOURCE_CLAIM
```

テスト観点:

```text
- valid receiptでrevalidated。
- missing receiptでwait。
- invalid source_kindでrepairまたはblocked。
- helper_green / fixture / synthetic sourceでblocked。
- local path / hash混入でblocked。
```

---

### DRI-OP05: sanitized review result rows / rating rows revalidation

目的:

```text
RSR-OP11でintake済みのsanitized review result rows / rating rowsを、DHR re-intake向けactual source claim材料として再検査する。
```

要求:

```text
- sanitized_review_result_row_count = 24
- rating_row_count = 24
- rows and ratings share review_session_id
- source_kind_ref = actual_local_only_human_review_by_person
- body_free = true
- selection-only values only
- reviewer free textを含まない
- returned surface bodyを含まない
- comment_text bodyを含まない
- question_textを含まない
- rating axis / score optionがRSR-OP08 contractと整合
```

出力status:

```text
DRI_OP05_ROWS_AND_RATINGS_REVALIDATED_BODYFREE
DRI_OP05_WAIT_FOR_ROWS_AND_RATINGS
DRI_OP05_REPAIR_ROWS_AND_RATINGS
DRI_OP05_BLOCKED_ROWS_BODY_LEAK_OR_SOURCE_CLAIM
```

テスト観点:

```text
- rows/rating counts 24/24でready。
- row_count mismatchでrepair。
- reviewer_free_text混入でblocked。
- question_text混入でblocked。
- source_kind invalidでblocked。
```

---

### DRI-OP06: question need observation rows bridge-only revalidation

目的:

```text
RSR-OP12でintake済みのquestion need observation rowsを、P7/P8 Bridge material onlyとして再検査する。
```

要求:

```text
- question_need_observation_row_count = 24
- row source_kind_ref = actual_local_only_human_review_by_person
- body_free = true
- P7/P8 Bridge material only
- question_text / draft_question_text / actual promptは含まない
- P8 question spec / implementationへ変換しない
```

出力status:

```text
DRI_OP06_QUESTION_NEED_ROWS_REVALIDATED_BRIDGE_ONLY
DRI_OP06_WAIT_FOR_QUESTION_NEED_ROWS
DRI_OP06_REPAIR_QUESTION_NEED_ROWS
DRI_OP06_BLOCKED_QUESTION_TEXT_OR_P8_MATERIALIZATION
```

テスト観点:

```text
- observation class / need level / reason refsのみでbody-free。
- question_textがある場合はblocked。
- p8_question_design_started trueならblocked。
- P8 schema candidateを出さない。
```

---

### DRI-OP07: disposal / purge receipt revalidation

目的:

```text
RSR-OP13でintake済みのdisposal / purge receiptを、DHR re-intake前の保持境界として再検査する。
```

要求:

```text
- disposal_purge_receipt accepted
- body_free = true
- body-full packet disposed / purged claimがbody-free refで示される
- retained_body_count = 0 または equivalent safe false/zero
- local path / hash / terminal outputを含まない
- helperがpurgeを実行したclaimがない
```

出力status:

```text
DRI_OP07_DISPOSAL_PURGE_RECEIPT_REVALIDATED_BODYFREE
DRI_OP07_WAIT_FOR_DISPOSAL_PURGE_RECEIPT
DRI_OP07_REPAIR_DISPOSAL_PURGE_RECEIPT
DRI_OP07_BLOCKED_PURGE_RECEIPT_BODY_LEAK_OR_RETENTION
```

テスト観点:

```text
- accepted purge receiptでready。
- missingでwait。
- retained body / path / hash混入でblocked。
- purge executed by helper here trueでblocked。
```

---

### DRI-OP08: final body-free / no-promotion / source-kind rescan

目的:

```text
DRI材料全体を最終scanし、DHR-OP04 adapter candidateを作る前にbody leak / promotion / invalid source kindを止める。
```

scan対象:

```text
- DRI-OP01 output
- DRI-OP02 output
- DRI-OP03 output
- DRI-OP04 output
- DRI-OP05 output
- DRI-OP06 output
- DRI-OP07 output
- supplied receipt / row / purge material refs
```

forbidden key refs:

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
absolute_path
relative_path
file_path
local_path
input_hash
body_hash
sha256
terminal_output_body
terminal_output
stdout
stderr
traceback
```

invalid source kind refs:

```text
unit_test_fixture
helper_green
target_green
result_memo_green
synthetic
historical_reuse_only
unknown
candidate_shape_only
```

promotion claim refs:

```text
actual_review_evidence_complete_here
dhr_actual_source_claim_reintake_executed_here
dhr_op04_called_here
dhr_op05_called_here
dmd_execution_started_here
r52_actual_execution_started_here
p5_final_allowed
p6_start_allowed
p8_start_allowed
p8_question_design_started
p8_question_implementation_started
p7_complete
release_allowed
full_backend_suite_green_claimed_here
rn_real_device_modal_verified_claimed_here
```

出力status:

```text
DRI_OP08_FINAL_SCAN_CLEAR_BODYFREE
DRI_OP08_FINAL_SCAN_REPAIR_REQUIRED
DRI_OP08_FINAL_SCAN_BODY_LEAK_OR_PROMOTION_BLOCKED
```

テスト観点:

```text
- no forbidden refsでclear。
- any forbidden key/valueでblocked。
- invalid source kindでblocked。
- promotion claim trueでblocked。
```

---

### DRI-OP09: DHR-OP04 external actual source claim adapter candidate materialization

目的:

```text
DHR-OP04へ手動で渡せるbody-free external actual source claim adapter candidateを作る。
ただし、DHR-OP04は呼び出さない。
```

出力候補名:

```text
external_actual_operation_evidence_claim_bodyfree_optional
```

adapter candidate最小形:

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.post_rsr16.dri.external_actual_operation_evidence_claim.bodyfree.v1",
  "material_kind": "dhr_op04_external_actual_operation_evidence_claim_candidate",
  "review_session_id": "r54_ahr_postdhr09_rsr_session_20260704_current_received_284_95_268_181_v1",
  "source_kind_ref": "actual_local_only_human_review_by_person",
  "actual_source_claim_source_kind_ref": "actual_local_only_human_review_by_person",
  "actual_source_claim_origin_ref": "external_local_only_human_review_receipt_or_manual_evidence_confirmation",
  "actual_source_claim_bodyfree": true,
  "actual_local_only_human_review_by_person_confirmed": true,
  "actual_human_review_executed_by_person": true,
  "operation_receipt_bodyfree_ref": "operation_receipt_bodyfree_ref_accepted_upstream",
  "sanitized_review_result_row_count": 24,
  "rating_row_count": 24,
  "question_need_observation_row_count": 24,
  "disposal_purge_receipt_bodyfree_ref": "disposal_purge_receipt_bodyfree_ref_accepted_upstream",
  "rsr_op15_branch_ref": "RSR_BRANCH_ACTUAL_REVIEW_EVIDENCE_READY_FOR_DHR_REINTAKE_NO_AUTO_EXECUTION",
  "rsr_op16_status_ref": "RSR_RESULT_MEMO_TESTS_SELECTED_REGRESSION_CLOSED_BODYFREE",
  "body_free": true,
  "dhr_op04_called_here": false,
  "dhr_actual_source_claim_reintake_executed_here": false,
  "dmd_execution_started_here": false,
  "r52_actual_execution_started_here": false,
  "p5_final_allowed": false,
  "p6_start_allowed": false,
  "p8_start_allowed": false,
  "p8_question_design_started": false,
  "p8_question_implementation_started": false,
  "p7_complete": false,
  "release_allowed": false
}
```

実装注意:

```text
- このcandidateはDHR-OP04 input candidateであり、DHR confirmed resultではない。
- actual_source_claim_confirmed_for_downstream_handoff はDRIでtrueにしない方が安全。
- DHR-OP04が既存ロジックで確認すべき字段をcandidateへ渡すだけにする。
- DHR-OP04が読めるkey名として source_kind_ref / actual_source_claim_source_kind_ref / actual_source_claim_origin_ref / actual_source_claim_bodyfree / actual_local_only_human_review_by_person_confirmed を含める。
- helperがactual receipt/rows/purgeを作ったclaimは含めない。
```

テスト観点:

```text
- ready inputでadapter candidateが作られる。
- candidateはbody_free true。
- candidateにraw input / question_text / path / hashがない。
- DHR/DMD/R52/P5/P6/P8/P7/release flagsはfalse。
- DHR-OP04 called flagはfalse。
```

---

### DRI-OP10: deterministic branch resolver

目的:

```text
DRI全体のbranchを一つだけ選ぶ。
```

branch決定順:

```text
1. body leak / promotion / invalid source kindがあれば blocked
2. OP01 / OP02 / OP04〜OP07のcontract破損があれば repair
3. OP16 / OP15 / supplied material不足があれば wait
4. accepted branch + complete prerequisites + final scan clear + adapter candidate materializedなら ready
5. どれにも入らない場合は manual hold
```

出力:

```text
dri_branch_ref
next_required_step
branch_reason_refs
branch_blocker_refs
ready_for_dhr_actual_source_claim_reintake_material_no_auto_execution
waiting_for_supplied_receipts_or_complete_candidate
repair_required_before_dhr_reintake_material
bodyfree_leak_or_promotion_blocked
manual_hold_unresolved_no_promotion
```

テスト観点:

```text
- exactly one branch flag is true。
- ready branchでも downstream_auto_execution_allowed = false。
- wait/repair/blocked/manual holdでadapter candidateをDHRへ渡すready flagがfalse。
```

---

### DRI-OP11: no-touch selected regression guard

目的:

```text
DRI実装でAPI / DB / RN / runtime / response key / public top-level key / P8 question surfaceを触っていないことを、result memo前に固定する。
```

確認対象:

```text
- changed file refs are helper/tests/result memo only
- Cocolon RN側にDRI / PostRSR16 / DHRActualSourceClaimReintake direct referenceを追加しない
- public response key追加なし
- db schema / db write path変更なし
- runtime generation変更なし
- P8 question trigger追加なし
```

出力:

```text
api_change_allowed_here: false
db_change_allowed_here: false
rn_change_allowed_here: false
runtime_change_allowed_here: false
response_key_change_allowed_here: false
p8_question_surface_change_allowed_here: false
selected_regression_required: true
```

テスト観点:

```text
- no-touch contractがすべてfalse/trueの期待通り。
- changed file refsが新helper / test / result memo範囲を超える場合はrepair。
- P8 question route/schema/ui/triggerが含まれたらblocked。
```

---

### DRI-OP12: result memo / target tests / selected regression closure

目的:

```text
DRI-OP00〜OP11の実装結果を、body-free result memo / target tests / selected regression closureとして閉じる。
```

result memoに記録するもの:

```text
- DRI implemented steps
- DRI selected branch
- DRI next_required_step
- RSR-OP16 intake status
- RSR-OP15 branch alignment status
- supplied material inventory status
- final scan status
- adapter candidate materialized or not
- target tests summary
- selected regression summary
- compileall summary
- changed file refs
- unverified boundary refs
- no-promotion refs
```

result memoに記録しないもの:

```text
- body-full packet
- raw input
- returned surface body
- reviewer free text
- question_text / draft_question_text
- local path / path hash / body hash
- terminal output body
```

テスト観点:

```text
- OP12 closed branchは、OP10 branch valid + target summary green + compileall okが条件。
- OP12 closedでもDHR re-intake executionはfalse。
- OP12 closedでもP8 start / P8 question designはfalse。
- OP12 closedでもP7 complete / release_allowedはfalse。
```

---

## 9. helper API案

### 9.1 import方針

新helperは、最低限次をimportします。

```python
from collections.abc import Mapping, Sequence
from typing import Any, Final

from emlis_ai_p7_contracts import clean_identifier, public_contract_flags
import emlis_ai_p7_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_20260704 as rsr
import emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704 as dhr
import emlis_ai_p7_r54_ahr_post_dmh18_downstream_manual_decision_triage_20260703 as dmd
```

DHR moduleは参照・定数・assert contract確認用に留めます。  
DHR-OP04 build functionをDRIから自動実行する設計にはしません。

### 9.2 build / assert関数命名案

```python
build_p7_r54_ahr_post_rsr16_dri_op00_scope_no_touch_no_promotion_refreeze_after_rsr_op16(...)
assert_p7_r54_ahr_post_rsr16_dri_op00_scope_no_touch_no_promotion_refreeze_after_rsr_op16_contract(data)

build_p7_r54_ahr_post_rsr16_dri_op01_rsr_op16_result_memo_intake(...)
assert_p7_r54_ahr_post_rsr16_dri_op01_rsr_op16_result_memo_intake_contract(data)

build_p7_r54_ahr_post_rsr16_dri_op02_rsr_op15_branch_next_step_alignment(...)
assert_p7_r54_ahr_post_rsr16_dri_op02_rsr_op15_branch_next_step_alignment_contract(data)

build_p7_r54_ahr_post_rsr16_dri_op03_complete_candidate_supplied_material_inventory(...)
assert_p7_r54_ahr_post_rsr16_dri_op03_complete_candidate_supplied_material_inventory_contract(data)

build_p7_r54_ahr_post_rsr16_dri_op04_actual_operation_receipt_revalidation(...)
assert_p7_r54_ahr_post_rsr16_dri_op04_actual_operation_receipt_revalidation_contract(data)

build_p7_r54_ahr_post_rsr16_dri_op05_sanitized_rows_rating_rows_revalidation(...)
assert_p7_r54_ahr_post_rsr16_dri_op05_sanitized_rows_rating_rows_revalidation_contract(data)

build_p7_r54_ahr_post_rsr16_dri_op06_question_need_rows_bridge_only_revalidation(...)
assert_p7_r54_ahr_post_rsr16_dri_op06_question_need_rows_bridge_only_revalidation_contract(data)

build_p7_r54_ahr_post_rsr16_dri_op07_disposal_purge_receipt_revalidation(...)
assert_p7_r54_ahr_post_rsr16_dri_op07_disposal_purge_receipt_revalidation_contract(data)

build_p7_r54_ahr_post_rsr16_dri_op08_final_bodyfree_no_promotion_source_kind_rescan(...)
assert_p7_r54_ahr_post_rsr16_dri_op08_final_bodyfree_no_promotion_source_kind_rescan_contract(data)

build_p7_r54_ahr_post_rsr16_dri_op09_dhr_op04_external_actual_source_claim_adapter_candidate(...)
assert_p7_r54_ahr_post_rsr16_dri_op09_dhr_op04_external_actual_source_claim_adapter_candidate_contract(data)

build_p7_r54_ahr_post_rsr16_dri_op10_deterministic_branch_resolver(...)
assert_p7_r54_ahr_post_rsr16_dri_op10_deterministic_branch_resolver_contract(data)

build_p7_r54_ahr_post_rsr16_dri_op11_no_touch_selected_regression_guard(...)
assert_p7_r54_ahr_post_rsr16_dri_op11_no_touch_selected_regression_guard_contract(data)

build_p7_r54_ahr_post_rsr16_dri_op12_result_memo_tests_selected_regression_closure(...)
assert_p7_r54_ahr_post_rsr16_dri_op12_result_memo_tests_selected_regression_closure_contract(data)
```

### 9.3 受け取り引数案

```python
def build_p7_r54_ahr_post_rsr16_dri_op10_deterministic_branch_resolver(
    *,
    rsr_op16_result_memo: Mapping[str, Any] | None = None,
    rsr_op15_branch_resolver: Mapping[str, Any] | None = None,
    rsr_op14_final_validation: Mapping[str, Any] | None = None,
    rsr_op10_actual_operation_receipt_intake: Mapping[str, Any] | None = None,
    rsr_op11_review_rows_rating_rows_intake: Mapping[str, Any] | None = None,
    rsr_op12_question_need_observation_rows_intake: Mapping[str, Any] | None = None,
    rsr_op13_disposal_purge_receipt_intake: Mapping[str, Any] | None = None,
    review_session_id: Any = None,
) -> dict[str, Any]:
    ...
```

実装段階で、OPごとに必要な引数を分けるか、OP10/OP12に集約するかを判断します。  
ただし、設計上は **candidate_refだけでreadyにしない** ため、OP10〜OP13相当のsupplied materialを受けられる形を残します。

---

## 10. json / schema案

本節のjson/schemaは設計案です。  
この段階では実ファイル化しません。

### 10.1 DRI external actual source claim adapter candidate schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_rsr16.dri.external_actual_operation_evidence_claim.bodyfree.v1",
  "title": "P7 R54 AHR Post-RSR16 DRI External Actual Operation Evidence Claim Body-free Candidate",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "material_kind",
    "review_session_id",
    "source_kind_ref",
    "actual_source_claim_source_kind_ref",
    "actual_source_claim_origin_ref",
    "actual_source_claim_bodyfree",
    "actual_local_only_human_review_by_person_confirmed",
    "actual_human_review_executed_by_person",
    "operation_receipt_bodyfree_ref",
    "sanitized_review_result_row_count",
    "rating_row_count",
    "question_need_observation_row_count",
    "disposal_purge_receipt_bodyfree_ref",
    "rsr_op15_branch_ref",
    "rsr_op16_status_ref",
    "body_free",
    "dhr_op04_called_here",
    "dhr_actual_source_claim_reintake_executed_here",
    "dmd_execution_started_here",
    "r52_actual_execution_started_here",
    "p5_final_allowed",
    "p6_start_allowed",
    "p8_start_allowed",
    "p8_question_design_started",
    "p8_question_implementation_started",
    "p7_complete",
    "release_allowed"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_rsr16.dri.external_actual_operation_evidence_claim.bodyfree.v1"
    },
    "material_kind": {
      "const": "dhr_op04_external_actual_operation_evidence_claim_candidate"
    },
    "review_session_id": {
      "type": "string",
      "minLength": 1,
      "maxLength": 180,
      "not": { "pattern": "[/\\\\]|sha256|stdout|stderr|traceback" }
    },
    "source_kind_ref": {
      "const": "actual_local_only_human_review_by_person"
    },
    "actual_source_claim_source_kind_ref": {
      "const": "actual_local_only_human_review_by_person"
    },
    "actual_source_claim_origin_ref": {
      "const": "external_local_only_human_review_receipt_or_manual_evidence_confirmation"
    },
    "actual_source_claim_bodyfree": { "const": true },
    "actual_local_only_human_review_by_person_confirmed": { "const": true },
    "actual_human_review_executed_by_person": { "const": true },
    "operation_receipt_bodyfree_ref": {
      "type": "string",
      "minLength": 1,
      "maxLength": 220
    },
    "sanitized_review_result_row_count": { "const": 24 },
    "rating_row_count": { "const": 24 },
    "question_need_observation_row_count": { "const": 24 },
    "disposal_purge_receipt_bodyfree_ref": {
      "type": "string",
      "minLength": 1,
      "maxLength": 220
    },
    "rsr_op15_branch_ref": {
      "const": "RSR_BRANCH_ACTUAL_REVIEW_EVIDENCE_READY_FOR_DHR_REINTAKE_NO_AUTO_EXECUTION"
    },
    "rsr_op16_status_ref": {
      "const": "RSR_RESULT_MEMO_TESTS_SELECTED_REGRESSION_CLOSED_BODYFREE"
    },
    "body_free": { "const": true },
    "dhr_op04_called_here": { "const": false },
    "dhr_actual_source_claim_reintake_executed_here": { "const": false },
    "dmd_execution_started_here": { "const": false },
    "r52_actual_execution_started_here": { "const": false },
    "p5_final_allowed": { "const": false },
    "p6_start_allowed": { "const": false },
    "p8_start_allowed": { "const": false },
    "p8_question_design_started": { "const": false },
    "p8_question_implementation_started": { "const": false },
    "p7_complete": { "const": false },
    "release_allowed": { "const": false }
  }
}
```

### 10.2 DRI branch result schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_rsr16.dri.branch_result.bodyfree.v1",
  "title": "P7 R54 AHR Post-RSR16 DRI Branch Result Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "review_session_id",
    "dri_branch_ref",
    "dri_allowed_branch_refs",
    "next_required_step",
    "ready_for_dhr_actual_source_claim_reintake_material_no_auto_execution",
    "waiting_for_supplied_receipts_or_complete_candidate",
    "repair_required_before_dhr_reintake_material",
    "bodyfree_leak_or_promotion_blocked",
    "manual_hold_unresolved_no_promotion",
    "branch_reason_refs",
    "branch_blocker_refs",
    "adapter_candidate_materialized",
    "dhr_op04_called_here",
    "dhr_actual_source_claim_reintake_executed_here",
    "downstream_auto_execution_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_rsr16.dri.branch_result.bodyfree.v1"
    },
    "operation_step_ref": {
      "const": "DRI-OP10_deterministic_branch_resolver"
    },
    "review_session_id": {
      "type": "string",
      "minLength": 1,
      "maxLength": 180
    },
    "dri_branch_ref": {
      "enum": [
        "DRI_STATUS_READY_FOR_DHR_ACTUAL_SOURCE_CLAIM_REINTAKE_MATERIAL_NO_AUTO_EXECUTION",
        "DRI_STATUS_WAITING_FOR_RSR_COMPLETE_CANDIDATE_OR_SUPPLIED_RECEIPTS",
        "DRI_STATUS_REPAIR_REQUIRED_BEFORE_DHR_REINTAKE_MATERIAL",
        "DRI_STATUS_BODYFREE_LEAK_OR_PROMOTION_BLOCKED",
        "DRI_STATUS_MANUAL_HOLD_UNRESOLVED_NO_PROMOTION"
      ]
    },
    "dri_allowed_branch_refs": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 5,
      "maxItems": 5
    },
    "next_required_step": {
      "enum": [
        "provide_dri_bodyfree_actual_source_claim_adapter_material_to_dhr_op04_without_auto_execution",
        "wait_for_rsr_op15_complete_candidate_or_supplied_bodyfree_receipts",
        "repair_dri_reintake_material_before_dhr_op04_adapter",
        "blocked_dri_bodyfree_leak_promotion_or_invalid_source_kind",
        "manual_hold_after_dri_without_downstream_promotion"
      ]
    },
    "ready_for_dhr_actual_source_claim_reintake_material_no_auto_execution": { "type": "boolean" },
    "waiting_for_supplied_receipts_or_complete_candidate": { "type": "boolean" },
    "repair_required_before_dhr_reintake_material": { "type": "boolean" },
    "bodyfree_leak_or_promotion_blocked": { "type": "boolean" },
    "manual_hold_unresolved_no_promotion": { "type": "boolean" },
    "branch_reason_refs": {
      "type": "array",
      "items": { "type": "string", "maxLength": 220 }
    },
    "branch_blocker_refs": {
      "type": "array",
      "items": { "type": "string", "maxLength": 220 }
    },
    "adapter_candidate_materialized": { "type": "boolean" },
    "dhr_op04_called_here": { "const": false },
    "dhr_actual_source_claim_reintake_executed_here": { "const": false },
    "downstream_auto_execution_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 10.3 wait branch example

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.post_rsr16.dri.branch_result.bodyfree.v1",
  "operation_step_ref": "DRI-OP10_deterministic_branch_resolver",
  "review_session_id": "r54_ahr_postdhr09_rsr_session_20260704_current_received_284_95_268_181_v1",
  "dri_branch_ref": "DRI_STATUS_WAITING_FOR_RSR_COMPLETE_CANDIDATE_OR_SUPPLIED_RECEIPTS",
  "dri_allowed_branch_refs": [
    "DRI_STATUS_READY_FOR_DHR_ACTUAL_SOURCE_CLAIM_REINTAKE_MATERIAL_NO_AUTO_EXECUTION",
    "DRI_STATUS_WAITING_FOR_RSR_COMPLETE_CANDIDATE_OR_SUPPLIED_RECEIPTS",
    "DRI_STATUS_REPAIR_REQUIRED_BEFORE_DHR_REINTAKE_MATERIAL",
    "DRI_STATUS_BODYFREE_LEAK_OR_PROMOTION_BLOCKED",
    "DRI_STATUS_MANUAL_HOLD_UNRESOLVED_NO_PROMOTION"
  ],
  "next_required_step": "wait_for_rsr_op15_complete_candidate_or_supplied_bodyfree_receipts",
  "ready_for_dhr_actual_source_claim_reintake_material_no_auto_execution": false,
  "waiting_for_supplied_receipts_or_complete_candidate": true,
  "repair_required_before_dhr_reintake_material": false,
  "bodyfree_leak_or_promotion_blocked": false,
  "manual_hold_unresolved_no_promotion": false,
  "branch_reason_refs": [
    "dri_waits_because_supplied_bodyfree_receipts_or_rows_are_missing"
  ],
  "branch_blocker_refs": [],
  "adapter_candidate_materialized": false,
  "dhr_op04_called_here": false,
  "dhr_actual_source_claim_reintake_executed_here": false,
  "downstream_auto_execution_allowed": false,
  "body_free": true
}
```

### 10.4 blocked branch example

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.post_rsr16.dri.branch_result.bodyfree.v1",
  "operation_step_ref": "DRI-OP10_deterministic_branch_resolver",
  "review_session_id": "r54_ahr_postdhr09_rsr_session_20260704_current_received_284_95_268_181_v1",
  "dri_branch_ref": "DRI_STATUS_BODYFREE_LEAK_OR_PROMOTION_BLOCKED",
  "dri_allowed_branch_refs": [
    "DRI_STATUS_READY_FOR_DHR_ACTUAL_SOURCE_CLAIM_REINTAKE_MATERIAL_NO_AUTO_EXECUTION",
    "DRI_STATUS_WAITING_FOR_RSR_COMPLETE_CANDIDATE_OR_SUPPLIED_RECEIPTS",
    "DRI_STATUS_REPAIR_REQUIRED_BEFORE_DHR_REINTAKE_MATERIAL",
    "DRI_STATUS_BODYFREE_LEAK_OR_PROMOTION_BLOCKED",
    "DRI_STATUS_MANUAL_HOLD_UNRESOLVED_NO_PROMOTION"
  ],
  "next_required_step": "blocked_dri_bodyfree_leak_promotion_or_invalid_source_kind",
  "ready_for_dhr_actual_source_claim_reintake_material_no_auto_execution": false,
  "waiting_for_supplied_receipts_or_complete_candidate": false,
  "repair_required_before_dhr_reintake_material": false,
  "bodyfree_leak_or_promotion_blocked": true,
  "manual_hold_unresolved_no_promotion": false,
  "branch_reason_refs": [
    "dri_blocks_before_dhr_adapter_because_bodyfree_or_promotion_boundary_failed"
  ],
  "branch_blocker_refs": [
    "dri_forbidden_payload_key_detected_before_dhr_op04_adapter"
  ],
  "adapter_candidate_materialized": false,
  "dhr_op04_called_here": false,
  "dhr_actual_source_claim_reintake_executed_here": false,
  "downstream_auto_execution_allowed": false,
  "body_free": true
}
```

---

## 11. target test設計

### 11.1 DRI-OP00 / OP01 tests

```text
test_dri_op00_refreezes_scope_no_touch_no_promotion
test_dri_op00_does_not_change_api_db_rn_runtime_response_key
test_dri_op01_accepts_valid_rsr_op16_closed_bodyfree
test_dri_op01_waits_when_rsr_op16_waiting_for_op15
test_dri_op01_repairs_when_rsr_op16_tests_or_regression_required
test_dri_op01_blocks_when_rsr_op16_body_leak_or_promotion
```

### 11.2 DRI-OP02 / OP03 tests

```text
test_dri_op02_aligns_rsr_op15_complete_candidate_branch_and_next_step
test_dri_op02_waits_for_retry_or_in_progress_branch
test_dri_op02_repairs_next_step_mismatch
test_dri_op02_manual_holds_unexpected_branch_without_promotion
test_dri_op03_requires_all_complete_candidate_prerequisites
test_dri_op03_does_not_use_candidate_ref_only_as_actual_evidence
test_dri_op03_inventory_counts_supplied_materials_bodyfree_only
```

### 11.3 DRI-OP04 / OP05 tests

```text
test_dri_op04_revalidates_actual_operation_receipt_bodyfree_source_kind_person
test_dri_op04_waits_for_missing_actual_operation_receipt
test_dri_op04_blocks_helper_green_or_fixture_source_kind
test_dri_op04_blocks_local_path_hash_or_terminal_body
test_dri_op05_revalidates_24_sanitized_rows_and_24_rating_rows
test_dri_op05_repairs_count_or_session_mismatch
test_dri_op05_blocks_reviewer_free_text_or_returned_surface_body
```

### 11.4 DRI-OP06 / OP07 tests

```text
test_dri_op06_revalidates_question_need_rows_as_p7_p8_bridge_material_only
test_dri_op06_blocks_question_text_or_p8_question_spec_materialization
test_dri_op07_revalidates_disposal_purge_receipt_bodyfree
test_dri_op07_waits_for_missing_purge_receipt
test_dri_op07_blocks_retained_body_local_path_or_hash
```

### 11.5 DRI-OP08 / OP09 tests

```text
test_dri_op08_final_scan_clear_when_no_body_no_promotion_no_invalid_source
test_dri_op08_blocks_forbidden_payload_key_anywhere
test_dri_op08_blocks_promotion_claim_anywhere
test_dri_op09_materializes_dhr_op04_adapter_candidate_only_when_ready
test_dri_op09_candidate_has_dhr_op04_readable_keys
test_dri_op09_candidate_does_not_call_dhr_op04
test_dri_op09_candidate_does_not_confirm_dhr_downstream_handoff
```

### 11.6 DRI-OP10 / OP11 tests

```text
test_dri_op10_selects_exactly_one_branch
test_dri_op10_ready_branch_requires_adapter_candidate_and_final_scan_clear
test_dri_op10_wait_branch_when_supplied_receipts_missing
test_dri_op10_repair_branch_when_contract_malformed
test_dri_op10_blocked_branch_when_leak_or_promotion
test_dri_op10_manual_hold_without_promotion_for_unexpected_state
test_dri_op11_changed_file_refs_limited_to_helper_tests_result_memo
test_dri_op11_no_api_db_rn_runtime_response_key_p8_question_change
```

### 11.7 DRI-OP12 result tests

```text
test_dri_op12_closes_result_memo_target_tests_selected_regression_bodyfree
test_dri_op12_records_ready_or_wait_repair_block_without_auto_execution
test_dri_op12_does_not_claim_actual_review_execution_or_dhr_reintake_execution
test_dri_op12_does_not_start_p8_question_design_p7_complete_or_release
test_dri_op12_result_memo_contains_no_body_full_raw_question_text_path_hash_terminal_body
```

---

## 12. 実装段階のvalidation command案

本設計段階では実行しません。  
実装段階での候補です。

### 12.1 新規DRI target

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_dri_op00_op01_20260705.py \
  tests/test_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_dri_op02_op03_20260705.py \
  tests/test_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_dri_op04_op05_20260705.py \
  tests/test_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_dri_op06_op07_20260705.py \
  tests/test_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_dri_op08_op09_20260705.py \
  tests/test_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_dri_op10_op11_20260705.py \
  tests/test_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_dri_op12_result_20260705.py
```

### 12.2 既存RSR regression

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_*.py
```

### 12.3 既存DHR selected regression

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_*.py
```

### 12.4 DRI + RSR + DHR combined selected regression

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_*.py \
  tests/test_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_*.py \
  tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_*.py
```

### 12.5 compileall

```bash
PYTHONPATH=services/ai_inference python -m compileall -q services/ai_inference
```

### 12.6 RN no-touch grep

```bash
grep -R "post_rsr16\|dhr_actual_source_claim_reintake\|DRI-OP" -n Cocolon || true
```

期待:

```text
RN側には直接参照なし。
```

---

## 13. result memoに残すべきvalidation summary

DRI-OP12 result memoには、最低限次を残します。

```text
DRI target:
  <N> passed

RSR selected regression:
  338 passed expected baseline, or updated count if test count changes with explicit reason

DHR selected regression:
  139 passed expected baseline, or updated count if test count changes with explicit reason

DRI + RSR + DHR combined selected regression:
  <N> passed

services/ai_inference compileall:
  passed

RN no-touch grep:
  no direct references expected
```

注意:

```text
- DRI target greenはDHR re-intake executionではない。
- DRI + RSR + DHR greenはfull backend suite greenではない。
- compileall passedはrelease readyではない。
- RN no-touch grepはRN実機確認ではない。
```

---

## 14. 実装時の禁止事項

```text
- DRI helperからDHR-OP04 build functionを自動呼び出ししない。
- DRI helperからDMD / R52 helperを呼ばない。
- DRI helper内でactual receipt / actual rows / purge receiptを生成しない。
- RSR candidate_refだけでactual evidence confirmedにしない。
- target green / result memo green / fixture / historical reuseをactual sourceにしない。
- question_need_observation_rowsからquestion_textを作らない。
- P8 question schema / trigger / RN UIを作らない。
- public response top-level keyを足さない。
- DB schema / write pathを変えない。
- RN display conditionを変えない。
- local path / hash / terminal output bodyをresult memoに入れない。
- body-full packet内容をadapter candidateへ入れない。
```

---

## 15. 実装時の完了条件

DRI実装完了と言える条件は、次に限定します。

```text
- DRI-OP00〜OP12 helper / assert contractが追加されている。
- DRI target testsがgreen。
- 既存RSR selected regressionがgreen。
- 既存DHR selected regressionがgreen。
- DRI + RSR + DHR combined selected regressionがgreen。
- services/ai_inference compileallがpassed。
- result memoがbody-freeで作成されている。
- changed filesがhelper / tests / result memoに限定されている。
- API / DB / RN / runtime / response key変更がない。
- DHR re-intake / DMD / R52 / P5 / P6 / P8 / P7 / releaseが未実行・未許可として記録されている。
```

DRI実装完了と言っても、次は言えません。

```text
- actual reviewが実行された。
- DHR actual source claimがconfirmedされた。
- DHR re-intakeが実行された。
- DMD/R52へ進めてよい。
- P8質問設計へ進めてよい。
- P7 complete。
- release ready。
```

---

## 16. DRI後の次工程候補

DRI-OP12でready branchが閉じた場合、次工程候補は次です。

```text
DHR-OP04 actual_source_claim_separation_invalid_source_classification への手動re-intake設計
```

ただし、これはDRI実装とは別工程です。  
DRIの結果を受けてDHR-OP04をどう呼ぶか、DHR-OP05/OP06へどう戻すかを、次の設計で改めて扱います。

DRI-OP12でwait/repair/blocked/manual holdの場合は、次工程候補はそれぞれ次です。

```text
wait:
  RSR側へ戻り、missing supplied body-free receipts / rows / purge receiptを揃える。

repair:
  malformed material / mismatch / count inconsistencyを修正する。

blocked:
  body leak / promotion / invalid source kindを除去し、result memoへbody-full等が残っていないか再確認する。

manual hold:
  OP15 branch / OP16 status / DRI branchのどこが未解決か、人間が判断する。
```

---

## 17. Cocolonとしての判断

この設計は、機能を増やすための設計ではありません。  
ユーザーからは見えない、P7内部の証跡境界を締める設計です。

Cocolonにとって重要なのは、EmlisAIが「それっぽく質問するAI」になることではありません。  
ユーザーが置いた言葉を、入力直後に「読まれた形」として返せているかを、商品品質として確認し続けることです。

DRIは地味ですが、Cocolonを守るためには必要です。  
RSR-OP16で閉じたcomplete candidateを雑にDHRへ投げるのではなく、もう一度body-free / no-promotion / actual-source-kind境界で締めることで、P7の証跡が「見た目だけのgreen」にならないようにします。

---

## 18. 華恋の意見

華恋の意見としては、DRIを新規helperとして分けるのがよいです。

理由は、RSR helperへさらに足すと、retry/start decision と DHR re-intake adapter の責務が混ざり、将来「RSR complete = DHR re-intake ready」と誤読されやすくなるためです。  
Cocolonの今の危険は、足りない確認をgreenで覆ってしまうことです。ここは一段分けた方が安全です。

また、DRI ready branchでもDHR-OP04を呼ばない設計にするべきです。  
自動で呼ぶと、DRIのtarget greenがDHR actual source confirmedへ見えてしまいます。Cocolonとしては、manual boundaryを一段残し、DHR-OP04 re-intakeは次工程で明示的に扱う方が、証跡として強いです。

P8へ進むより遅く見えますが、ここを丁寧に閉じることが、最終的にはCocolonの商品品質を守る近道だと思います。

---

## 19. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- 直前検討メモでは、P7継続 / Post-RSR16 DHR Actual Source Claim Re-intake Boundaryが次段階として選定されている。
- RSR-OP00〜OP16はbody-free helper boundaryとして閉じている。
- RSR-OP16 closureはactual review完了ではない。
- RSR-OP15 complete candidateはDHR re-intake実行ではない。
- P8 question design / implementation、P7 complete、release decisionは未許可。
```

### 未確認

```text
- DRI実装後のtarget test count。
- DRI helper追加後のcompileall。
- DRI + RSR + DHR combined selected regression。
- full backend suite green。
- RN実機確認。
- actual local-only human review execution。
- DHR re-intake execution。
```

### 書かれていない

```text
- DRI ready branchでDHR-OP04を自動呼び出してよいとは書かれていない。
- RSR candidate_refのみでDHR actual source claimをconfirmedしてよいとは書かれていない。
- question need observation rowsをP8 question specへ変換してよいとは書かれていない。
```

### 推測禁止

```text
- DRI adapter candidate = DHR actual source confirmed と推測しない。
- DRI target green = DHR re-intake executed と推測しない。
- DRI result memo closure = DMD/R52/P5/P6/P8/P7/release ready と推測しない。
```

### 次に実行すべきこと

実装段階へ進む場合は、次を順番に行います。

```text
1. 新規helper fileを追加する。
2. DRI-OP00 / OP01 testsを先に作り、scope / OP16 intakeを固定する。
3. DRI-OP02 / OP03 testsでOP15 branchとsupplied material inventoryを固定する。
4. DRI-OP04〜OP07 testsでreceipt / rows / question need / purge再検査を固定する。
5. DRI-OP08 / OP09 testsでfinal scanとDHR-OP04 adapter candidateを固定する。
6. DRI-OP10 / OP11 testsでbranch resolverとno-touch guardを固定する。
7. DRI-OP12 result memo testとresult memo mdを追加する。
8. DRI target → RSR regression → DHR regression → combined selected regression → compileall を確認する。
9. result memoに、未実行・未許可の境界を明記する。
```

この実装段階でも、actual review execution / DHR re-intake execution / P8 question design / release decisionへは進めません。
