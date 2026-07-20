---
title: "Cocolon / EmlisAI P7-R54-AHR Post-DHR09 Actual Local-Only Human Review Retry/Start Decision 詳細設計書・実装順"
created_at: "2026-07-04 JST"
author: "華恋"
work_mode: "共鳴構造モード"
work_type: "詳細設計書 / 実装順 / json・schema案内包"
source_mode: "local_received_zip_only"
github_connection_check: "not_required_by_mash_instruction / not_performed"
base_pre_design_memo: "Cocolon_EmlisAI_P7_R54AHR_PostDHR09_RetryStart_PreDesignMemo_20260704.md"
selected_design_target: "P7-R54-AHR Post-DHR09 Actual Local-Only Human Review Retry/Start Decision"
recommended_boundary_prefix: "RSR-OP00〜RSR-OP16"
recommended_prefix_meaning: "RSR = Retry/Start Review"
recommended_helper_shape: "thin_actual_operation_entry_and_receipt_validator_plus_runbook_boundary_not_actual_review_simulator"
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
actual_rows_creation: "none"
actual_disposal_purge_execution: "none"
dmd_execution: "none"
r52_actual_execution: "none"
p5_finalization: "none"
p6_start: "none"
p8_start: "none"
p8_question_design: "none"
p8_question_implementation: "none"
p7_complete: "none"
release_decision: "none"
current_expected_default_branch_from_confirmed_materials: "DHR_BRANCH_RETRY_OR_START_REQUIRED_BEFORE_DOWNSTREAM_HANDOFF"
current_expected_default_next_required_step: "retry_or_start_actual_local_only_human_review_operation_with_explicit_local_only_allow"
---

# Cocolon / EmlisAI P7-R54-AHR Post-DHR09 Actual Local-Only Human Review Retry/Start Decision 詳細設計書・実装順

対象: Cocolon / EmlisAI / P7 Product Quality Runner / R54-AHR / Post-DHR09 / actual local-only human review retry/start decision  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
実装扱い: 本書は設計書です。コード変更・json/schema実ファイル化・actual review実行・DMD実行・R52実行・P5/P6/P8/P7/release昇格は行いません。  
json / schema実ファイル化: なし。本書内の案のみです。実ファイル化は実装段階で、既存helper・既存schema配置・既存guard・既存test結果を確認して判断します。  
GitHub接続確認: Mash指定により不要。ローカル受領zip基準。  

---

## 0. 結論

次に設計する対象は、P8 question design ではありません。  
次に設計する対象は、次です。

```text
P7-R54-AHR Post-DHR09
Actual Local-Only Human Review Retry/Start Decision
```

DHR-OP09のcurrent default branchは次です。

```text
DHR_BRANCH_RETRY_OR_START_REQUIRED_BEFORE_DOWNSTREAM_HANDOFF
```

DHR-OP09のcurrent default next required stepは次です。

```text
retry_or_start_actual_local_only_human_review_operation_with_explicit_local_only_allow
```

したがって、本設計で作るべきものは、P8質問仕様でも、DMD自動実行でも、R52実行でもありません。  
本設計で作るべきものは、**actual local-only human review を本当に開始/再試行するための入口・停止条件・local-only body-full一時扱い・body-free証跡化・破棄境界・次工程再投入境界**です。

推奨する境界prefixは次です。

```text
RSR-OP00〜RSR-OP16
RSR = Retry/Start Review
```

推奨する実装単位は次です。

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_20260704.py
```

ただし、このhelperは「actual reviewをしたことにするhelper」ではありません。  
役割は、次に限定します。

```text
- DHR-OP09がretry/start requiredで閉じたことを受ける。
- explicit local-only allowがない限りactual reviewへ入れないようにする。
- actual review実行時のbody-full transient境界をrunbookとして固定する。
- 実レビュー後に提出されるbody-free receipt / rows / purge receiptを検査する。
- helper生成candidate、unit test fixture、synthetic row、過去資料再利用をactual evidenceへ昇格しない。
- 完了候補になってもDMD/R52/P5/P6/P8/P7/releaseへ自動昇格しない。
- 完了候補だけを、DHR再投入または別manual decisionへ渡せるbody-free bundleとしてmaterializeする。
```

本設計の中心は、helper greenを増やすことではありません。  
**P7で本当に読感評価へ戻るために、実レビューの開始/再試行を偽装できない構造にすること**です。

---

## 1. なぜこの設計を行うのか

Cocolon / EmlisAIが目指すべき姿は、ユーザーが置いた言葉を、テンプレ共感・短縮要約・診断ラベル・固定分類で処理済みにせず、入力直後に「読まれた形」として返すことです。

P7は Product Quality Runner / Long-run Product Gate です。  
ここで必要なのは、EmlisAIが実ケースを読めているか、どこで浅い反復・不自然な履歴接続・過剰読み・問いへの逃げが起きるかを、実ケースで確認することです。

DHR-OP00〜OP09は、Post-ELR19 downstream manual decision handoff-or-retry境界を閉じました。  
ただし、DHR-OP09 closureは次を意味しません。

```text
- actual body-full packet generation済み
- actual local-only human review実行済み
- actual operation receipt作成済み
- sanitized review result rows作成済み
- rating rows作成済み
- question need observation rows作成済み
- disposal / purge実行済み
- DMD実行許可
- R52実行許可
- P5/P6/P8/P7/release昇格許可
```

このため、本設計では、DHR-OP09で見えた「retry/start required」を、実レビューへ戻る入口として扱います。  
問い返し設計へ逃げず、実レビューをしたことに見えるhelperを増やさず、actual local-only human reviewの材料・許可・証跡・破棄を正面から扱います。

---

## 2. 参照・確認範囲

### 2.1 ローカル受領zip

本設計の基準は、ローカル受領zipと、直前の検討メモです。

```text
/mnt/data/Cocolon_前提資料(284).zip
/mnt/data/EmlisAIの実装済み資料(95).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(14).zip
/mnt/data/Cocolon(268).zip
/mnt/data/mashos-api(181).zip
/mnt/data/Cocolon_EmlisAI_P7_R54AHR_PostDHR09_RetryStart_PreDesignMemo_20260704.md
```

GitHub接続確認は、Mash指定により行いません。

### 2.2 必読前提・作業姿勢

本設計では、次を確認済み前提として扱います。

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
```

固定する作業姿勢:

```text
- 設計と実装を混ぜない。
- 前提資料だけで理解したふりをしない。実ファイルも見る。
- 見ていないactual reviewを存在するものとして扱わない。
- helper greenをactual evidenceへ読み替えない。
- P8質問設計を、P7の実レビュー不足の逃げ道にしない。
- public contract / DB / RN / response keyを指示なく変えない。
- Mashから見えにくい箇所ほど、body-free / no-touch / no-promotionを厳格にする。
```

### 2.3 ロードマップ読み

```text
Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md
```

本設計で固定する読み方:

```text
- 現在の大枠はP7 Product Quality Runner / Long-run Product Gateである。
- P7/P8 Bridgeのquestion need observationは、P8質問実装ではなく観察メモである。
- P8の観測補助問い詳細設計は、P7で集めた問い必要性観察メモを材料にする。
- P7完了条件を緩めてP8へ進まない。
- Product Pass候補とRelease Readyを混同しない。
```

### 2.4 既存実装・設計との関係

主に接続する既存helper / 設計資料は次です。

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_20260703.py
  emlis_ai_p7_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_20260703.py
  emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py
  emlis_ai_p7_r54_ahr_post_dmh18_downstream_manual_decision_triage_20260703.py

EmlisAIの実装済み資料/
  Cocolon_EmlisAI_P7_R54AHR_PostDMD08_ContinueRetryActualLocalOnlyHumanReviewOperation_DetailedDesign_ImplementationOrder_20260703.md
  Cocolon_EmlisAI_P7_R54AHR_PostALR12_ExplicitLocalOnlyReviewStartRetry_DetailedDesign_ImplementationOrder_20260703.md
  Cocolon_EmlisAI_P7_R54AHR_PostELR19_DownstreamManualDecision_HandoffOrRetry_DetailedDesign_ImplementationOrder_20260704.md
```

接続関係:

```text
DMD-OP08:
  downstream manual decision triage / retry or continue decision の前段。

ALR-OP12:
  continue/retry actual local review operation の expected schema guard と selected action closure。

ELR-OP19:
  explicit local-only review start/retry operation の body-free closure。

DHR-OP09:
  ELR-OP19後の downstream handoff-or-retry closure。
  current default branch は retry/start required before downstream handoff。

RSR-OP00〜OP16:
  DHR-OP09後に、actual local-only reviewへ戻る入口・停止条件・実行証跡検査・再投入境界を固定する。
```

---

## 3. 現在地の整理

### 3.1 確認済み

直前検討メモの時点で確認済みの事実は次です。

```text
- DHR-OP00〜OP09は反映済み。
- DHR current default branchは DHR_BRANCH_RETRY_OR_START_REQUIRED_BEFORE_DOWNSTREAM_HANDOFF。
- DHR current default next required stepは retry_or_start_actual_local_only_human_review_operation_with_explicit_local_only_allow。
- current defaultではDMD handoff plan candidateはmaterializeしていない。
- RN contractは 36 passed。
- DHR-OP00〜OP09 combined targetは 139 passed。
- ELR / DMD / ALR selected regressionは 251 passed。
- services/ai_inference compileallは ok。
```

### 3.2 未確認

上記のgreenでは、次は未確認のままです。

```text
- full backend suite green
- RN実機 modal 確認
- actual body-full packet generation の実実行
- actual local-only human review の実実行
- actual operation receipt の実作成
- sanitized review result rows の実作成
- rating rows の実作成
- question need observation rows の実作成
- disposal / purge の実実行
- DMD execution
- R52 actual execution
- P5 finalization
- P6 start
- P8 question design / implementation
- P7 complete
- release readiness
```

### 3.3 RSRが扱う未確認の核心

RSRが扱うべき核心は次です。

```text
- explicit local-only allow は実際に与えられているか。
- actual reviewに必要な24ケース材料は存在するか。
- body-full materialはlocal-only transientとして扱えるか。
- 実レビューをするperson reviewerは明確か。
- reviewerの記録はselection-only / body-freeに限定できるか。
- actual operation receipt / rows / rating / question need observation / purge receiptは実レビュー由来か。
- helperやtest fixtureがactual evidenceへ昇格していないか。
- 完了後に何へ戻すか。DHR再投入か、DMD manual decisionか。自動実行ではない。
```

---

## 4. 本設計の対象範囲 / 非対象範囲

### 4.1 対象範囲

本設計の対象は次です。

```text
1. DHR-OP09 result memo closure / branch / next step のbody-free intake。
2. ALR-OP12 / ELR-OP19 / DHR-OP09 / DMD-OP08 の関係再確認。
3. explicit local-only allow receipt の必須条件。
4. local-only actual review runbook boundary。
5. body-full packet の transient / local-only / no-persistence 方針。
6. body-free review session envelope。
7. person reviewer / selection-only form boundary。
8. actual operation receipt のbody-free schema。
9. sanitized review result rows / rating rows / question need observation rows のbody-free schema。
10. disposal / purge receipt のbody-free schema。
11. no-body / no-question / no-path / no-hash / no-terminal-output / no-touch scan。
12. source_kind_ref = actual_local_only_human_review_by_person をclaimできる条件。
13. helper-generated candidate / unit test fixture / synthetic row / historical reuse の排除。
14. actual evidence complete candidate の判定。
15. DHR re-intake / downstream manual decision materialization candidate。
16. result memo / target tests / selected regression closure。
```

### 4.2 非対象範囲

本設計では、以下を行いません。

```text
- 実際のbody-full packet生成。
- actual local-only human reviewの実行。
- actual operation receiptの実作成。
- sanitized review result rowsの実作成。
- rating rowsの実作成。
- question need observation rowsの実作成。
- disposal / purgeの実行。
- P8 question API / DB / RN UI / trigger / response key の設計・実装。
- question_text / draft_question_text の生成。
- production API route変更。
- DB migration。
- RN production UI変更。
- public response key変更。
- DMD自動実行。
- R52 actual execution。
- P5 finalization。
- P6 start。
- P7 complete。
- release decision。
```

### 4.3 禁止する読み替え

```text
DHR-OP09 closure = actual review実行済み
DHR_BRANCH_RETRY_OR_START_REQUIRED_BEFORE_DOWNSTREAM_HANDOFF = explicit allow付与済み
retry/start required = body-full packet生成許可済み
body-full packet request = body-full packet生成済み
review session envelope = review実行済み
operation receipt expected schema = operation receipt作成済み
selection-only row schema = actual row作成済み
question need observation row = P8質問仕様
actual evidence complete candidate = DMD/R52/P5/P6/P8/P7/release自動許可
```

---

## 5. 設計方針

### 5.1 RSRは「実レビューをするhelper」ではなく「実レビューへ入る境界」

RSR helperはactual reviewを実行しません。  
RSR helperが行うのは、次の境界固定と検査です。

```text
- 入力材料が揃っているか。
- explicit local-only allowが存在するか。
- body-full materialをlocal-only transientとして扱うrunbookがあるか。
- 実レビュー後に提出されたbody-free receipt / rows / purge receiptが安全か。
- source_kind_refが偽装されていないか。
- complete candidateをDHR re-intakeへ渡せるか。
```

actual reviewの実行そのものは、実装段階または運用実行段階で、Mashの明示許可とlocal-only手順に従って行います。

### 5.2 body-fullはlocal-only transient、body-freeだけを残す

actual reviewでは、読感評価のためにbody-full materialを見る可能性があります。  
ただし、body-full materialは成果物・result memo・public meta・test output・schema exampleへ残しません。

残してよいもの:

```text
- review_session_id
- packet_request_ref
- operation_receipt_ref
- disposal_purge_receipt_ref
- case_ref
- count
- status_ref
- verdict_ref
- rating scalar
- axis pass/fail
- reason id
- blocker id
- question need observation class ref
- body-free observation material
```

残してはいけないもの:

```text
- raw input
- raw answer
- comment_text body
- returned surface body
- reviewer free text
- reviewer note body
- question_text
- draft_question_text
- answer_text
- local absolute path
- relative path
- body hash
- input hash
- terminal output body
- stdout / stderr / traceback body
```

### 5.3 source_kindを偽装しない

`actual_local_only_human_review_by_person` を使える条件は、次のすべてを満たす場合だけです。

```text
- reviewer_is_person_confirmed: true
- local_only_operation_confirmed: true
- selection_only_form_used: true
- created_from_real_operation: true
- row_created_by_helper: false
- row_created_for_unit_test: false
- row_is_synthetic_contract_fixture: false
- historical_row_reused: false
- reviewed_case_count: 24
- selection_row_count: 24
- actual_operation_receipt accepted
- sanitized rows accepted
- rating rows accepted
- question need observation rows accepted
- disposal / purge receipt accepted
- final no-leak scan passed
```

helperがcandidateを作っただけ、schemaに形が合っているだけ、テストがgreenだっただけでは、source_kind_refをactual sourceへ昇格しません。

### 5.4 P8 question need observationは観察メモに留める

RSRで扱う question need observation は、P7/P8 Bridge材料です。  
これはP8質問仕様ではありません。

禁止:

```text
- question_text生成
- draft_question_text生成
- question trigger logic実装
- question answer storage設計の確定
- API / DB / RN UI / response key変更
- P8 question design started: true
```

許容:

```text
- question_need_primary_class_ref
- ambiguity_kind_refs
- one_question_fit_ref
- p8_design_material_candidate_only: true
- question_observation_material_only: true
- question_text_materialized: false
- draft_question_text_materialized: false
```

### 5.5 完了候補でも自動昇格しない

actual review evidenceがcomplete candidateになった場合でも、RSRは次を行いません。

```text
DMD execution: false
R52 actual execution: false
P5 finalization: false
P6 start: false
P8 start: false
P8 question design: false
P7 complete: false
release decision: false
```

完了候補後のnext stepは、次のどちらかです。

```text
- return_to_dhr_actual_source_claim_reintake_without_auto_execution
- downstream_manual_decision_required_after_actual_evidence_without_auto_execution
```

---

## 6. 推奨ファイル構成

### 6.1 実装候補helper

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_20260704.py
```

責務:

```text
- DHR-OP09 result memo / branch / next step intake
- explicit local-only allow acceptance gate
- readiness blocker classification
- body-full transient packet runbook envelope
- actual operation receipt intake
- rows / rating / question need observation / purge receipt intake
- no-leak / no-promotion / source-kind guard
- actual evidence complete candidate predicate
- DHR re-intake bundle materialization without DMD execution
- result memo closure
```

### 6.2 変更しないファイル

原則として、次は変更しません。

```text
mashos-api/ai/services/ai_inference/api_emotion_submit.py
mashos-api/ai/services/ai_inference/emotion_submit_service.py
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_dmh18_downstream_manual_decision_triage_20260703.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_20260703.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_20260703.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py
Cocolon/screens/InputScreen.js
Cocolon/screens/input/useInputFeedbackModal.js
Cocolon/screens/input/InputFeedbackReplyModal.js
DB migration files
```

既存ELR/DHR helperへ最小adapterを足す方が安全だと実装段階で確認できる場合だけ、変更対象を再検討します。  
ただし、第一候補は **Post-DHR09専用の薄いRSR helper** です。

### 6.3 test module候補

```text
mashos-api/ai/tests/
  test_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_rsr_op00_op01_20260704.py
  test_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_rsr_op02_op03_20260704.py
  test_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_rsr_op04_op05_20260704.py
  test_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_rsr_op06_op07_20260704.py
  test_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_rsr_op08_op09_20260704.py
  test_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_rsr_op10_op11_20260704.py
  test_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_rsr_op12_op13_20260704.py
  test_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_rsr_op14_op16_result_20260704.py
```

### 6.4 result memo候補

```text
mashos-api/ai/tests/
  R54_AHR_PostDHR09_ActualLocalReview_RetryStartDecision_RSR_OP00_OP16_Result_20260704.md
```

### 6.5 実行時local-only workdir候補

実行段階でactual reviewを行う場合だけ、repo外または明示的にgit除外されたlocal-only一時領域を使います。

```text
<local_only_workdir>/r54_ahr_post_dhr09/<review_session_id>/
  transient_body_full_packet/        # body-full。成果物化禁止。実行後purge。
  selection_only_working_form/       # reviewerが選択に使う一時素材。body-free出力のみ許可。
  bodyfree_receipts_candidate/       # body-free receipt候補。内容検査後に採用判断。
```

実装段階での注意:

```text
- 上記パス文字列そのものをresult memoへ残さない。
- path hash / body hashも残さない。
- packet_ref / receipt_ref / case_refだけを残す。
- raw bodyをgit管理領域へ置かない。
- terminal output bodyを保存しない。
```

---

## 7. 実装順

### 7.1 全体依存順

```text
RSR-OP00: scope / no-touch / no-promotion refreeze after DHR-OP09
RSR-OP01: DHR-OP09 result memo / selected branch / next step intake
RSR-OP02: upstream relationship verification: ALR-OP12 / ELR-OP19 / DHR-OP09 / DMD-OP08
RSR-OP03: explicit local-only allow receipt acceptance gate
RSR-OP04: readiness blocker classifier: environment / material / allow / body leak / source claim
RSR-OP05: local-only review session envelope and reviewer person boundary
RSR-OP06: 24-case body-full packet transient request boundary
RSR-OP07: body-full packet generation receipt and export denylist scan intake
RSR-OP08: selection-only reviewer form / rating axis contract freeze
RSR-OP09: actual local-only review lifecycle state capture
RSR-OP10: actual operation receipt intake
RSR-OP11: sanitized review result rows / rating rows intake
RSR-OP12: question need observation rows intake as P7/P8 Bridge material only
RSR-OP13: disposal / purge receipt intake
RSR-OP14: final no-leak / no-promotion / source-kind validation
RSR-OP15: actual evidence complete candidate and next branch resolver
RSR-OP16: result memo / tests / selected regression closure
```

---

### RSR-OP00: scope / no-touch / no-promotion refreeze after DHR-OP09

目的:

```text
Post-DHR09 RSR層の責務を固定する。
DHR-OP09 closureをactual review completeへ昇格しない。
API / DB / RN / runtime / response key / P8 / DMD / R52 / P5 / P6 / P7 / releaseに触れない境界を固定する。
```

実装内容:

```text
- phase / step / scope / policy_kind constantsを定義。
- RSR-OP00 schema_versionを定義。
- source_mode = local_received_zip_only を固定。
- git_connection_required = false / git_checked = false を固定。
- no-touch contractを定義。
- not-claimed boundaryをDHR-OP09から引き継ぐ。
- selected design targetを固定。
```

acceptance:

```text
- public_contract_flags() が保持される。
- no_touch_contract が全てfalseである。
- actual review / DMD / R52 / P8 / release関連flagがfalseである。
- next_required_step = RSR-OP01。
```

---

### RSR-OP01: DHR-OP09 result memo / selected branch / next step intake

目的:

```text
DHR-OP09がretry/start requiredで閉じたことをbody-freeに受け取る。
DHR-OP09 result memo closureをactual review実行済みにしない。
```

実装内容:

```text
- dhr_op09_result_memo_optionalを入力として受ける。
- op09 status / selected_branch_ref / next_required_step / DMD handoff plan materialized flag を読む。
- branchが DHR_BRANCH_RETRY_OR_START_REQUIRED_BEFORE_DOWNSTREAM_HANDOFF か確認する。
- next_required_step が retry_or_start_actual_local_only_human_review_operation_with_explicit_local_only_allow か確認する。
- DHR handoff planがmaterializedしている場合は、本RSRのデフォルト経路ではなくmanual hold扱いにする。
```

status案:

```text
RSR_DHR09_INTAKE_RETRY_OR_START_REQUIRED
RSR_DHR09_INTAKE_WAITING_OR_INCOMPLETE
RSR_DHR09_INTAKE_REPAIR_REQUIRED
RSR_DHR09_INTAKE_UNEXPECTED_HANDOFF_BRANCH_MANUAL_HOLD
```

acceptance:

```text
- expected defaultでは RSR_DHR09_INTAKE_RETRY_OR_START_REQUIRED。
- DHR-OP09 closureだけでは actual_local_human_review_executed_here = false。
- next_required_step = RSR-OP02。
```

---

### RSR-OP02: upstream relationship verification

目的:

```text
DHR-OP09 / ELR-OP19 / ALR-OP12 / DMD-OP08 の関係を再確認する。
途中のhelper greenをactual evidenceへ読み替えない。
```

実装内容:

```text
- DHR-OP09 summaryを最上位入力にする。
- ELR-OP19 closureが存在すれば body-free closure としてだけ読む。
- ALR-OP12 result memoが存在すれば selected_action と schema guard closure としてだけ読む。
- DMD-OP08 result memoが存在すれば retry/continue decision材料としてだけ読む。
- どの層のgreenもactual review実行済みにはしない。
```

確認する関係:

```text
DMD-OP08 -> ALR-OP12 -> ELR-OP19 -> DHR-OP09 -> RSR-OP00〜
```

blocker案:

```text
rsr_op02_dhr09_missing_or_invalid
rsr_op02_elr19_relation_missing_but_dhr09_closed_bodyfree
rsr_op02_alr12_relation_missing_but_dhr09_closed_bodyfree
rsr_op02_upstream_branch_conflict
rsr_op02_helper_green_promotion_claim_detected
```

acceptance:

```text
- upstream materialの有無をcount/ref/statusで残す。
- raw body / local path / terminal outputは残さない。
- next_required_step = RSR-OP03。
```

---

### RSR-OP03: explicit local-only allow receipt acceptance gate

目的:

```text
actual reviewへ入る前に、明示的なlocal-only許可があるかを判定する。
allow required を allow granted に読み替えない。
```

実装内容:

```text
- explicit_local_only_allow_receipt_optional を入力として受ける。
- allow_receipt_ref / review_session_id / allowed_case_count / allowed_operation_scope を検査する。
- allowed_operation_scope は 24-case actual local-only human review start/retry with purge に限定する。
- allow receiptにbody-full、path、hash、terminal outputが含まれていないかscanする。
```

status案:

```text
RSR_EXPLICIT_ALLOW_ACCEPTED_BODYFREE
RSR_EXPLICIT_ALLOW_MISSING_WAITING
RSR_EXPLICIT_ALLOW_INVALID_REPAIR_REQUIRED
RSR_EXPLICIT_ALLOW_SCOPE_MISMATCH_BLOCKED
```

acceptance:

```text
- allow missingならactual reviewは開始できない。
- allow acceptedでも、helperがactual reviewを実行したことにはしない。
- next_required_step = RSR-OP04。
```

---

### RSR-OP04: readiness blocker classifier

目的:

```text
actual reviewを開始/再試行できるかを、停止理由ごとに分ける。
```

停止理由分類:

```text
RSR_STOP_ENVIRONMENT_MISSING
RSR_STOP_MATERIAL_MISSING
RSR_STOP_EXPLICIT_ALLOW_MISSING
RSR_STOP_BODY_LEAK_RISK
RSR_STOP_SOURCE_CLAIM_INSUFFICIENT
RSR_STOP_REVIEWER_PERSON_NOT_CONFIRMED
RSR_STOP_LOCAL_ONLY_BOUNDARY_NOT_CONFIRMED
RSR_STOP_PURGE_PLAN_MISSING
RSR_STOP_UPSTREAM_REPAIR_REQUIRED
```

実装内容:

```text
- environment_ready_refをbody-free statusで受ける。
- material_manifest_ready_refをbody-free statusで受ける。
- explicit allow acceptedか確認する。
- body leak preflight riskがないか確認する。
- reviewer person boundaryが準備できるか確認する。
- purge planが準備できるか確認する。
```

acceptance:

```text
- blocker_refs / reason_refs / next_required_step を明示する。
- readyでもbody-full packet生成はこのOPでは行わない。
- not readyなら、どの停止理由かを明示して止める。
```

---

### RSR-OP05: local-only review session envelope and reviewer person boundary

目的:

```text
actual review sessionのbody-free envelopeを固定する。
reviewerがpersonであること、helper / unit testではないことを境界化する。
```

実装内容:

```text
- review_session_idを安全なidentifierへ正規化する。
- reviewer_person_refをbody-free refとして受ける。
- reviewer_is_person_confirmedをtrueにできる条件を定義する。
- reviewer roleは selection_only_review_operator に限定する。
- reviewer free text / body noteは禁止する。
```

acceptance:

```text
- reviewer_person_refはbody-free identifierのみ。
- reviewer_name / email / raw note / local pathは残さない。
- reviewer_is_person_confirmedがfalseならactual source claim不可。
```

---

### RSR-OP06: 24-case body-full packet transient request boundary

目的:

```text
body-full packetを生成する前のrequest boundaryをbody-freeで固定する。
request boundaryはpacket生成済みではない。
```

実装内容:

```text
- expected_case_count = 24。
- case_ref_valuesはsafe case_refのみ。
- packet_request_refを発行する。
- body-full packet contentを含めない。
- local path / path hash / body hashを含めない。
- transient_body_full_packet_required = true をbody-freeで残す。
```

acceptance:

```text
- case_ref_count = 24。
- duplicate case_refがない。
- question_text / raw input / returned surface body を含まない。
- packet_request_created_here != packet_generated_here。
```

---

### RSR-OP07: body-full packet generation receipt and export denylist scan intake

目的:

```text
実行段階でbody-full packetがlocal-only transientに生成された場合、そのreceiptだけをbody-freeで受ける。
```

実装内容:

```text
- body_full_packet_generation_receipt_optionalを入力として受ける。
- packet_generated_local_only / external_export_performed=false / persisted_to_repo=false を確認する。
- generated_case_count = 24 を確認する。
- raw bodyやpathがreceiptに混入していないかscanする。
- receiptがない場合はwaitingに止める。
```

status案:

```text
RSR_PACKET_GENERATION_RECEIPT_ACCEPTED_BODYFREE
RSR_PACKET_GENERATION_RECEIPT_MISSING_WAITING
RSR_PACKET_GENERATION_RECEIPT_INVALID_REPAIR_REQUIRED
RSR_PACKET_EXPORT_OR_PERSISTENCE_BLOCKED
```

acceptance:

```text
- receipt acceptedでもactual review実行済みにはしない。
- packet bodyは成果物化しない。
- next_required_step = RSR-OP08。
```

---

### RSR-OP08: selection-only reviewer form / rating axis contract freeze

目的:

```text
reviewerが記録する内容をselection-only / body-freeに固定する。
評価軸とthresholdを既存ELRと一致させる。
```

rating axis:

```text
history_connection_naturalness: 0.90
creepy_absence: 0.95
overclaim_absence: 0.95
self_blame_non_amplification: 0.95
wants_more_input_or_accumulation: 0.85
non_shallow_repeat: 0.90
```

score options:

```text
0.0 / 0.25 / 0.5 / 0.75 / 1.0
```

question need class:

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

acceptance:

```text
- reviewer free textは禁止。
- question_text / draft_question_textは禁止。
- selection-only rowからbody-free rowsへ変換できる。
- P8 design startedはfalse。
```

---

### RSR-OP09: actual local-only review lifecycle state capture

目的:

```text
actual review operationの状態をbody-freeに記録する。
```

lifecycle status案:

```text
RSR_REVIEW_OPERATION_NOT_STARTED
RSR_REVIEW_OPERATION_READY_TO_START
RSR_REVIEW_OPERATION_IN_PROGRESS_LOCAL_ONLY
RSR_REVIEW_OPERATION_PAUSED_LOCAL_ONLY
RSR_REVIEW_OPERATION_COMPLETED_RECEIPT_REQUIRED
RSR_REVIEW_OPERATION_ABORTED_REPAIR_REQUIRED
```

実装内容:

```text
- op03 allow / op04 readiness / op05 session / op07 packet receipt / op08 selection formを前提にする。
- completedになった場合だけactual operation receipt requiredへ進む。
- in_progress / pausedはbody-free stateのみ残す。
- abortedはrepair/stop reasonへ落とす。
```

acceptance:

```text
- helper_executes_actual_review = false。
- lifecycle completedだけではreceipt acceptedにしない。
- next_required_step = RSR-OP10 when completed_receipt_required。
```

---

### RSR-OP10: actual operation receipt intake

目的:

```text
実レビュー完了後に提出されるactual operation receiptをbody-freeで受ける。
```

必須条件:

```text
schema_version present
operation_receipt_ref present
review_session_id matches
packet_request_ref present
source_kind_ref = actual_local_only_human_review_by_person
created_from_real_operation = true
actual_human_review_executed_by_person = true
reviewer_person_ref present
reviewed_case_count = 24
selection_row_count = 24
local_only_operation_confirmed = true
selection_only_form_used = true
external_export_performed = false
body_free = true
```

acceptance:

```text
- source_kind_refの偽装を許さない。
- row作成前でもreceiptだけacceptedにできるが、evidence completeにはしない。
- helperがreceiptを作成した場合はactualとして扱わない。
```

---

### RSR-OP11: sanitized review result rows / rating rows intake

目的:

```text
実レビュー由来のselection-only rowsをbody-freeに受ける。
```

実装内容:

```text
- sanitized_review_result_rows_bodyfreeを受ける。
- rating_rows_bodyfreeを受ける。
- case_refが24件でmanifestと一致するか確認する。
- operation_receipt_refが一致するか確認する。
- axis_score_refs / axis_pass_flagsを確認する。
- row_created_by_helper / row_created_for_unit_test / row_is_synthetic_contract_fixture / historical_row_reused がfalseか確認する。
```

acceptance:

```text
- sanitized rows accepted。
- rating rows accepted。
- count mismatchならrepair。
- body leakがあればrepairではなくblocked。
```

---

### RSR-OP12: question need observation rows intake as P7/P8 Bridge material only

目的:

```text
actual review由来のquestion need observationを、P8質問仕様ではなくP7/P8 Bridge観察メモとして受ける。
```

実装内容:

```text
- question_need_observation_rows_bodyfreeを受ける。
- source_sanitized_review_result_row_ref / source_rating_row_ref / operation_receipt_refを確認する。
- question_text_materialized=false を確認する。
- draft_question_text_materialized=false を確認する。
- p8_question_spec_created=false を確認する。
- p8_design_material_candidate_only=true でも P8 start にはしない。
```

acceptance:

```text
- question need rows accepted。
- question text / draft question textがあればblocked。
- P8 question design startedはfalse。
```

---

### RSR-OP13: disposal / purge receipt intake

目的:

```text
body-full transient materialが破棄されたことをbody-freeで受ける。
```

必須条件:

```text
schema_version present
disposal_purge_receipt_ref present
operation_receipt_ref matches
packet_request_ref matches
source_kind_ref = actual_local_only_human_review_by_person
body_full_packet_retained = false
local_temp_material_retained = false
reviewer_working_form_body_retained = false
external_export_performed = false
purge_completed = true
body_free = true
```

禁止:

```text
- purge対象のlocal pathを残す。
- path hashを残す。
- body hashを残す。
- terminal output bodyを残す。
```

acceptance:

```text
- disposal / purge receipt accepted。
- purge未確認ならevidence complete不可。
- purge receiptにbody/path/hashがあればblocked。
```

---

### RSR-OP14: final no-leak / no-promotion / source-kind validation

目的:

```text
RSRで受けた全materialを最終scanし、body leak・promotion claim・source_kind偽装を止める。
```

scan対象:

```text
- DHR-OP09 intake material
- allow receipt
- readiness material
- session envelope
- packet request
- packet generation receipt
- lifecycle material
- operation receipt
- sanitized rows
- rating rows
- question need observation rows
- disposal / purge receipt
```

検出するもの:

```text
forbidden_payload_key_paths
body_like_value_path_refs
local_path_shape_refs
hash_shape_refs
terminal_output_body_refs
promotion_claim_refs
invalid_source_kind_refs
question_text_materialization_refs
helper_generated_actual_claim_refs
```

acceptance:

```text
- forbidden count = 0。
- promotion claim count = 0。
- invalid source_kind count = 0。
- helper-generated actual claim count = 0。
- body_free = true。
```

---

### RSR-OP15: actual evidence complete candidate and next branch resolver

目的:

```text
actual review evidence complete candidateか、retry/repair/wait/blockedかをdeterministicに分岐する。
```

branch案:

```text
RSR_BRANCH_WAIT_FOR_EXPLICIT_LOCAL_ONLY_ALLOW
RSR_BRANCH_STOP_ENVIRONMENT_OR_MATERIAL_REPAIR_REQUIRED
RSR_BRANCH_READY_TO_START_ACTUAL_LOCAL_ONLY_REVIEW
RSR_BRANCH_REVIEW_IN_PROGRESS_OR_PAUSED_LOCAL_ONLY
RSR_BRANCH_REVIEW_ABORTED_OR_INCOMPLETE_RETRY_REQUIRED
RSR_BRANCH_BODYFREE_LEAK_OR_SOURCE_CLAIM_BLOCKED
RSR_BRANCH_ACTUAL_REVIEW_EVIDENCE_READY_FOR_DHR_REINTAKE_NO_AUTO_EXECUTION
RSR_BRANCH_MANUAL_HOLD_UNRESOLVED_NO_PROMOTION
```

complete candidate条件:

```text
explicit_allow_accepted = true
readiness_blocker_count = 0
reviewer_person_confirmed = true
packet_generation_receipt_accepted = true
actual_operation_receipt_accepted = true
sanitized_review_result_rows_accepted = true
rating_rows_accepted = true
question_need_observation_rows_accepted = true
disposal_purge_receipt_accepted = true
final_no_leak_validation_passed = true
source_kind_ref = actual_local_only_human_review_by_person
created_from_real_operation = true
reviewed_case_count = 24
selection_row_count = 24
```

complete candidate後のnext step:

```text
return_to_dhr_actual_source_claim_reintake_without_auto_execution
```

重要:

```text
complete candidateになっても、DMDは実行しない。
complete candidateになっても、R52/P5/P6/P8/P7/releaseへ進まない。
```

---

### RSR-OP16: result memo / tests / selected regression closure

目的:

```text
RSR-OP00〜OP16をbody-free result memoとして閉じる。
```

result memoに含めるもの:

```text
- selected_branch_ref
- next_required_step
- allowed / ready / waiting / repair / blocked counts
- target tests summary
- selected regression summary
- compileall summary
- changed file refs
- unverified boundary refs
- no-promotion refs
```

result memoに含めないもの:

```text
- body-full packet
- raw input
- returned surface body
- reviewer free text
- question_text / draft_question_text
- local path / path hash / body hash
- terminal output body
```

acceptance:

```text
- result_memo_bodyfree_closed = true。
- actual review executed here = false unless external receipt accepted; helperは実行しない。
- complete candidateはmanual re-intake materialに留める。
- P8/DMD/R52/P5/P6/P7/release flagはfalse。
```

---

## 8. 状態遷移モデル

### 8.1 最小状態図

```text
DHR-OP09 closed
  |
  v
RSR-OP01 DHR09 intake
  |
  v
RSR-OP03 explicit allow gate
  |-- missing --> WAIT_FOR_EXPLICIT_LOCAL_ONLY_ALLOW
  |-- invalid --> REPAIR_REQUIRED
  v
RSR-OP04 readiness classifier
  |-- environment/material/body-leak/source blocker --> STOP/REPAIR/BLOCKED
  v
RSR-OP05〜OP08 session / packet / selection-only form boundary
  |
  v
RSR-OP09 lifecycle
  |-- not started / in progress / paused --> LOCAL_ONLY_CONTINUE
  |-- aborted --> RETRY_OR_REPAIR
  |-- completed --> RECEIPT_REQUIRED
  v
RSR-OP10〜OP13 receipt / rows / purge intake
  |
  v
RSR-OP14 final no-leak / source-kind validation
  |-- fail --> BLOCKED_OR_REPAIR_REQUIRED
  v
RSR-OP15 actual evidence complete candidate
  |
  v
DHR actual source claim re-intake / downstream manual decision materialization
  |
  v
no auto DMD / no auto R52 / no auto P8 / no release
```

### 8.2 branch priority

deterministic resolverの優先順位は次です。

```text
1. body leak / source_kind偽装 / promotion claim detected
2. upstream DHR09 relation invalid
3. explicit local-only allow missing or invalid
4. environment/material/reviewer/purge plan missing
5. review in progress / paused
6. review aborted or incomplete
7. receipt / rows / purge missing or invalid
8. actual evidence complete candidate
9. unresolved manual hold
```

この順序にする理由は、body leak / source_kind偽装がある場合は、repairではなくblockedに近い扱いで止める必要があるためです。

---

## 9. body-full / body-free データフロー

### 9.1 body-full transient material

body-full materialは、actual reviewのためだけにlocal-onlyで一時利用します。

```text
生成: 実行段階のlocal-only operationのみ
保存: 永続保存禁止
共有: 禁止
Git管理: 禁止
result memo記載: 禁止
test output記載: 禁止
schema example記載: 禁止
public meta記載: 禁止
破棄: disposal / purge receiptでbody-free確認
```

### 9.2 body-free evidence

body-free evidenceは、後段判断に渡すための証跡です。

```text
allow_receipt
review_session_envelope
packet_request
packet_generation_receipt
operation_receipt
sanitized_review_result_rows
rating_rows
question_need_observation_rows
disposal_purge_receipt
final_no_leak_validation
actual_evidence_complete_candidate
```

### 9.3 DHR再投入bundle

RSR完了候補は、DHRへ再投入できるbody-free source claim bundleとして残します。

```text
source_claim_ref
source_kind_ref = actual_local_only_human_review_by_person
created_from_real_operation = true
operation_receipt_ref
packet_request_ref
disposal_purge_receipt_ref
reviewed_case_count = 24
selection_row_count = 24
rows_accepted = true
purge_accepted = true
body_free = true
```

ただし、これはDMD実行ではありません。  
DHR再投入またはdownstream manual decisionの材料です。

---

## 10. json / schema案

本章のjson/schemaは設計案です。実ファイル化は行いません。  
実装段階で既存schema配置・既存helper定数・既存testのfield setと照合して、実ファイル化またはhelper内定数化を判断します。

### 10.1 `post_dhr09_rsr_dhr09_intake.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_dhr09.rsr.dhr09_intake.bodyfree.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "operation_step_ref",
    "dhr_op09_status_ref",
    "selected_branch_ref",
    "next_required_step",
    "dmd_handoff_plan_materialized",
    "actual_local_human_review_execution_verified_here",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dhr09.rsr.dhr09_intake.bodyfree.v1"
    },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "operation_step_ref": { "const": "RSR-OP01_DHR_OP09_result_memo_selected_branch_next_step_intake" },
    "dhr_op09_status_ref": { "type": "string", "minLength": 1, "maxLength": 220 },
    "selected_branch_ref": {
      "enum": [
        "DHR_BRANCH_RETRY_OR_START_REQUIRED_BEFORE_DOWNSTREAM_HANDOFF",
        "DHR_BRANCH_DMD_HANDOFF_READY_MANUAL_DECISION_REQUIRED_NO_AUTO_EXECUTION",
        "DHR_BRANCH_BODYFREE_EVIDENCE_REPAIR_REQUIRED",
        "DHR_BRANCH_WAIT_FOR_ELR_COMPLETE_EVIDENCE_OR_MANUAL_HOLD",
        "DHR_BRANCH_MANUAL_DECISION_HOLD_CONTINUES_UNRESOLVED"
      ]
    },
    "next_required_step": { "type": "string", "minLength": 1, "maxLength": 260 },
    "dmd_handoff_plan_materialized": { "type": "boolean" },
    "actual_local_human_review_execution_verified_here": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 10.2 `post_dhr09_rsr_explicit_local_only_allow_receipt.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_dhr09.rsr.explicit_local_only_allow_receipt.bodyfree.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "allow_receipt_ref",
    "review_session_id",
    "allowed_operation_scope_ref",
    "allowed_case_count",
    "local_only_operation_allowed",
    "body_full_transient_review_allowed",
    "external_export_allowed",
    "disposal_purge_required",
    "raw_input_included",
    "comment_text_body_included",
    "local_path_included",
    "body_hash_included",
    "terminal_output_body_included",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dhr09.rsr.explicit_local_only_allow_receipt.bodyfree.v1"
    },
    "allow_receipt_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "allowed_operation_scope_ref": {
      "const": "explicit_local_only_allow_for_24_case_actual_review_start_retry_with_purge"
    },
    "allowed_case_count": { "const": 24 },
    "local_only_operation_allowed": { "const": true },
    "body_full_transient_review_allowed": { "const": true },
    "external_export_allowed": { "const": false },
    "disposal_purge_required": { "const": true },
    "raw_input_included": { "const": false },
    "comment_text_body_included": { "const": false },
    "local_path_included": { "const": false },
    "body_hash_included": { "const": false },
    "terminal_output_body_included": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 10.3 `post_dhr09_rsr_readiness_decision.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_dhr09.rsr.readiness_decision.bodyfree.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "readiness_status_ref",
    "environment_ready",
    "material_manifest_ready",
    "explicit_allow_accepted",
    "reviewer_person_boundary_ready",
    "local_only_boundary_ready",
    "purge_plan_ready",
    "body_leak_preflight_passed",
    "blocker_refs",
    "blocker_ref_count",
    "next_required_step",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dhr09.rsr.readiness_decision.bodyfree.v1"
    },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "readiness_status_ref": {
      "enum": [
        "RSR_READINESS_READY_TO_START_LOCAL_ONLY_REVIEW",
        "RSR_READINESS_WAIT_FOR_EXPLICIT_LOCAL_ONLY_ALLOW",
        "RSR_READINESS_ENVIRONMENT_OR_MATERIAL_REPAIR_REQUIRED",
        "RSR_READINESS_BODY_LEAK_RISK_BLOCKED",
        "RSR_READINESS_SOURCE_CLAIM_INSUFFICIENT"
      ]
    },
    "environment_ready": { "type": "boolean" },
    "material_manifest_ready": { "type": "boolean" },
    "explicit_allow_accepted": { "type": "boolean" },
    "reviewer_person_boundary_ready": { "type": "boolean" },
    "local_only_boundary_ready": { "type": "boolean" },
    "purge_plan_ready": { "type": "boolean" },
    "body_leak_preflight_passed": { "type": "boolean" },
    "blocker_refs": { "type": "array", "items": { "type": "string", "maxLength": 180 } },
    "blocker_ref_count": { "type": "integer", "minimum": 0 },
    "next_required_step": { "type": "string", "minLength": 1, "maxLength": 260 },
    "body_free": { "const": true }
  }
}
```

### 10.4 `post_dhr09_rsr_packet_generation_receipt.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_dhr09.rsr.packet_generation_receipt.bodyfree.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "packet_generation_receipt_ref",
    "packet_request_ref",
    "review_session_id",
    "generated_case_count",
    "generated_local_only",
    "persisted_to_repo",
    "external_export_performed",
    "raw_input_included",
    "comment_text_body_included",
    "returned_surface_body_included",
    "local_path_included",
    "body_hash_included",
    "terminal_output_body_included",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dhr09.rsr.packet_generation_receipt.bodyfree.v1"
    },
    "packet_generation_receipt_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "packet_request_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "generated_case_count": { "const": 24 },
    "generated_local_only": { "const": true },
    "persisted_to_repo": { "const": false },
    "external_export_performed": { "const": false },
    "raw_input_included": { "const": false },
    "comment_text_body_included": { "const": false },
    "returned_surface_body_included": { "const": false },
    "local_path_included": { "const": false },
    "body_hash_included": { "const": false },
    "terminal_output_body_included": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 10.5 `post_dhr09_rsr_actual_operation_receipt.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_dhr09.rsr.actual_operation_receipt.bodyfree.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_receipt_ref",
    "review_session_id",
    "packet_request_ref",
    "source_kind_ref",
    "created_from_real_operation",
    "actual_human_review_executed_by_person",
    "reviewer_person_ref",
    "reviewed_case_count",
    "selection_row_count",
    "local_only_operation_confirmed",
    "selection_only_form_used",
    "external_export_performed",
    "raw_input_included",
    "comment_text_body_included",
    "returned_surface_body_included",
    "reviewer_free_text_included",
    "question_text_included",
    "draft_question_text_included",
    "local_path_included",
    "body_hash_included",
    "terminal_output_body_included",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dhr09.rsr.actual_operation_receipt.bodyfree.v1"
    },
    "operation_receipt_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "packet_request_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "source_kind_ref": { "const": "actual_local_only_human_review_by_person" },
    "created_from_real_operation": { "const": true },
    "actual_human_review_executed_by_person": { "const": true },
    "reviewer_person_ref": { "type": "string", "minLength": 1, "maxLength": 160 },
    "reviewed_case_count": { "const": 24 },
    "selection_row_count": { "const": 24 },
    "local_only_operation_confirmed": { "const": true },
    "selection_only_form_used": { "const": true },
    "external_export_performed": { "const": false },
    "raw_input_included": { "const": false },
    "comment_text_body_included": { "const": false },
    "returned_surface_body_included": { "const": false },
    "reviewer_free_text_included": { "const": false },
    "question_text_included": { "const": false },
    "draft_question_text_included": { "const": false },
    "local_path_included": { "const": false },
    "body_hash_included": { "const": false },
    "terminal_output_body_included": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 10.6 `post_dhr09_rsr_sanitized_review_result_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_dhr09.rsr.sanitized_review_result_row.bodyfree.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "operation_receipt_ref",
    "review_result_row_ref",
    "case_ref",
    "reviewer_person_ref",
    "source_kind_ref",
    "verdict_ref",
    "axis_score_refs",
    "axis_score_count",
    "axis_pass_flags",
    "sanitized_reason_id_refs",
    "readfeel_blocker_id_refs",
    "execution_blocker_id_refs",
    "question_need_primary_class_ref",
    "ambiguity_kind_refs",
    "one_question_fit_ref",
    "repair_required_refs",
    "selection_only",
    "row_created_by_helper",
    "row_created_for_unit_test",
    "row_is_synthetic_contract_fixture",
    "historical_row_reused",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dhr09.rsr.sanitized_review_result_row.bodyfree.v1"
    },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "operation_receipt_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "review_result_row_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "case_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "reviewer_person_ref": { "type": "string", "minLength": 1, "maxLength": 160 },
    "source_kind_ref": { "const": "actual_local_only_human_review_by_person" },
    "verdict_ref": { "enum": ["PASS", "YELLOW", "REPAIR_REQUIRED", "RED", "BLOCKED", "NOT_REVIEWABLE"] },
    "axis_score_refs": { "type": "object" },
    "axis_score_count": { "const": 6 },
    "axis_pass_flags": { "type": "object" },
    "sanitized_reason_id_refs": { "type": "array", "items": { "type": "string", "maxLength": 180 } },
    "readfeel_blocker_id_refs": { "type": "array", "items": { "type": "string", "maxLength": 180 } },
    "execution_blocker_id_refs": { "type": "array", "items": { "type": "string", "maxLength": 180 } },
    "question_need_primary_class_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "ambiguity_kind_refs": { "type": "array", "items": { "type": "string", "maxLength": 180 } },
    "one_question_fit_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "repair_required_refs": { "type": "array", "items": { "type": "string", "maxLength": 180 } },
    "selection_only": { "const": true },
    "row_created_by_helper": { "const": false },
    "row_created_for_unit_test": { "const": false },
    "row_is_synthetic_contract_fixture": { "const": false },
    "historical_row_reused": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 10.7 `post_dhr09_rsr_rating_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_dhr09.rsr.rating_row.bodyfree.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "rating_row_ref",
    "source_sanitized_review_result_row_ref",
    "review_session_id",
    "operation_receipt_ref",
    "case_ref",
    "verdict_ref",
    "axis_score_refs",
    "axis_pass_flags",
    "below_target_axis_refs",
    "readfeel_blocker_id_refs",
    "execution_blocker_id_refs",
    "repair_required_refs",
    "actual_rating_row_from_real_operation",
    "rating_decision_material_only",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dhr09.rsr.rating_row.bodyfree.v1"
    },
    "rating_row_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "source_sanitized_review_result_row_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "operation_receipt_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "case_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "verdict_ref": { "enum": ["PASS", "YELLOW", "REPAIR_REQUIRED", "RED", "BLOCKED", "NOT_REVIEWABLE"] },
    "axis_score_refs": { "type": "object" },
    "axis_pass_flags": { "type": "object" },
    "below_target_axis_refs": { "type": "array", "items": { "type": "string", "maxLength": 180 } },
    "readfeel_blocker_id_refs": { "type": "array", "items": { "type": "string", "maxLength": 180 } },
    "execution_blocker_id_refs": { "type": "array", "items": { "type": "string", "maxLength": 180 } },
    "repair_required_refs": { "type": "array", "items": { "type": "string", "maxLength": 180 } },
    "actual_rating_row_from_real_operation": { "const": true },
    "rating_decision_material_only": { "const": true },
    "body_free": { "const": true }
  }
}
```

### 10.8 `post_dhr09_rsr_question_need_observation_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_dhr09.rsr.question_need_observation_row.bodyfree.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "question_need_observation_row_ref",
    "source_sanitized_review_result_row_ref",
    "source_rating_row_ref",
    "review_session_id",
    "operation_receipt_ref",
    "case_ref",
    "reviewer_person_ref",
    "source_kind_ref",
    "question_need_primary_class_ref",
    "ambiguity_kind_refs",
    "one_question_fit_ref",
    "repair_required_refs",
    "selection_only",
    "actual_question_need_observation_row_from_real_operation",
    "question_observation_material_only",
    "p8_design_material_candidate_only",
    "question_text_materialized",
    "draft_question_text_materialized",
    "p8_question_spec_created",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dhr09.rsr.question_need_observation_row.bodyfree.v1"
    },
    "question_need_observation_row_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "source_sanitized_review_result_row_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "source_rating_row_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "operation_receipt_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "case_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "reviewer_person_ref": { "type": "string", "minLength": 1, "maxLength": 160 },
    "source_kind_ref": { "const": "actual_local_only_human_review_by_person" },
    "question_need_primary_class_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "ambiguity_kind_refs": { "type": "array", "items": { "type": "string", "maxLength": 180 } },
    "one_question_fit_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "repair_required_refs": { "type": "array", "items": { "type": "string", "maxLength": 180 } },
    "selection_only": { "const": true },
    "actual_question_need_observation_row_from_real_operation": { "const": true },
    "question_observation_material_only": { "const": true },
    "p8_design_material_candidate_only": { "type": "boolean" },
    "question_text_materialized": { "const": false },
    "draft_question_text_materialized": { "const": false },
    "p8_question_spec_created": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 10.9 `post_dhr09_rsr_disposal_purge_receipt.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_dhr09.rsr.disposal_purge_receipt.bodyfree.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "disposal_purge_receipt_ref",
    "review_session_id",
    "operation_receipt_ref",
    "packet_request_ref",
    "source_kind_ref",
    "purge_completed",
    "body_full_packet_retained",
    "local_temp_material_retained",
    "reviewer_working_form_body_retained",
    "external_export_performed",
    "local_path_included",
    "body_hash_included",
    "terminal_output_body_included",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dhr09.rsr.disposal_purge_receipt.bodyfree.v1"
    },
    "disposal_purge_receipt_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "operation_receipt_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "packet_request_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "source_kind_ref": { "const": "actual_local_only_human_review_by_person" },
    "purge_completed": { "const": true },
    "body_full_packet_retained": { "const": false },
    "local_temp_material_retained": { "const": false },
    "reviewer_working_form_body_retained": { "const": false },
    "external_export_performed": { "const": false },
    "local_path_included": { "const": false },
    "body_hash_included": { "const": false },
    "terminal_output_body_included": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 10.10 `post_dhr09_rsr_actual_source_claim_for_dhr_reintake.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_dhr09.rsr.actual_source_claim_for_dhr_reintake.bodyfree.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "source_claim_ref",
    "review_session_id",
    "source_kind_ref",
    "created_from_real_operation",
    "operation_receipt_ref",
    "packet_request_ref",
    "disposal_purge_receipt_ref",
    "reviewed_case_count",
    "selection_row_count",
    "sanitized_rows_accepted",
    "rating_rows_accepted",
    "question_need_observation_rows_accepted",
    "disposal_purge_receipt_accepted",
    "final_no_leak_validation_passed",
    "dhr_reintake_candidate_only",
    "dmd_execution_started_here",
    "r52_actual_execution_started_here",
    "p8_question_design_started",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dhr09.rsr.actual_source_claim_for_dhr_reintake.bodyfree.v1"
    },
    "source_claim_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "source_kind_ref": { "const": "actual_local_only_human_review_by_person" },
    "created_from_real_operation": { "const": true },
    "operation_receipt_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "packet_request_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "disposal_purge_receipt_ref": { "type": "string", "minLength": 1, "maxLength": 180 },
    "reviewed_case_count": { "const": 24 },
    "selection_row_count": { "const": 24 },
    "sanitized_rows_accepted": { "const": true },
    "rating_rows_accepted": { "const": true },
    "question_need_observation_rows_accepted": { "const": true },
    "disposal_purge_receipt_accepted": { "const": true },
    "final_no_leak_validation_passed": { "const": true },
    "dhr_reintake_candidate_only": { "const": true },
    "dmd_execution_started_here": { "const": false },
    "r52_actual_execution_started_here": { "const": false },
    "p8_question_design_started": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 10.11 DMD-compatible receipt adapter案

DHR re-intake後にDMD-compatible materialを作る場合は、既存DMD schemaに合わせます。

```text
schema_version:
  cocolon.emlis.p7_r54.ahr.post_dmh18.actual_operation_evidence_receipt.bodyfree.optional.v1

source_kind_ref:
  actual_local_only_human_review_by_person
```

ただし、RSRがDMD-compatible receiptを作る場合でも、それは **DMD execution** ではありません。  
DMD helperへ渡すmanual decision material candidateまでです。

---

## 11. runbook案

実装段階または運用実行段階でactual reviewを行う場合のrunbook案です。  
本書では実行しません。

### 11.1 実行前

```text
1. DHR-OP09 result memoがclosedで、selected_branch_refが retry/start required であることを確認する。
2. explicit local-only allow receiptを作成または受領する。
3. local-only workdirがgit管理外または明示除外であることを確認する。
4. 24-case manifestのcase_refだけを確認する。
5. body-full packetを作る前に、成果物へ残してはいけない情報を再確認する。
6. reviewer person boundaryを確認する。
7. selection-only formの項目だけを確認する。
```

### 11.2 実行中

```text
1. body-full packetはlocal-only transientとしてのみ表示/参照する。
2. reviewerはbody-free selectionだけを記録する。
3. free textは禁止する。
4. question_text / draft_question_textは禁止する。
5. caseごとの評価軸とclass refだけを選択する。
6. reviewが中断した場合はpaused/aborted stateのみbody-freeに残す。
```

### 11.3 実行後

```text
1. actual operation receiptをbody-freeで作成する。
2. sanitized review result rowsをbody-freeで作成する。
3. rating rowsをbody-freeで作成する。
4. question need observation rowsをbody-freeで作成する。
5. body-full transient materialをpurgeする。
6. disposal / purge receiptをbody-freeで作成する。
7. no-leak scanを行う。
8. actual source claim for DHR re-intake candidateを作る。
9. DMD/R52/P5/P6/P8/P7/releaseへ自動昇格しない。
```

---

## 12. target tests / regression plan

### 12.1 RSR target tests

実装段階では、RSR専用targetは段階的に通します。

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_rsr_op00_op01_20260704.py \
  tests/test_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_rsr_op02_op03_20260704.py \
  tests/test_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_rsr_op04_op05_20260704.py \
  tests/test_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_rsr_op06_op07_20260704.py \
  tests/test_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_rsr_op08_op09_20260704.py \
  tests/test_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_rsr_op10_op11_20260704.py \
  tests/test_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_rsr_op12_op13_20260704.py \
  tests/test_r54_ahr_post_dhr09_actual_local_review_retry_start_decision_rsr_op14_op16_result_20260704.py
```

### 12.2 selected regression

既存境界を壊していないか、最低限次を再実行します。

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op00_op01_20260704.py \
  tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op02_op03_20260704.py \
  tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op04_op05_20260704.py \
  tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op06_op07_20260704.py \
  tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op08_op09_result_20260704.py \
  tests/test_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_elr_op16_op17_20260703.py \
  tests/test_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_elr_op18_op19_20260703.py \
  tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op00_op01_20260703.py \
  tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op02_op03_20260703.py \
  tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op04_op05_20260703.py \
  tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op06_op07_20260703.py \
  tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op08_result_20260703.py \
  tests/test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op00_op01_20260703.py \
  tests/test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op02_op03_20260703.py \
  tests/test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op04_op05_20260703.py \
  tests/test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op06_op07_20260703.py \
  tests/test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op08_op09_20260703.py \
  tests/test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op10_op11_20260703.py \
  tests/test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op12_result_20260703.py
```

### 12.3 compileall

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference python -m compileall -q services/ai_inference
```

### 12.4 RN contract

RSRはRNを変更しないため、通常は必須変更対象ではありません。  
ただし、全体確認として次を再確認してよいです。

```bash
cd Cocolon
npm run test:rn-screens --silent
```

### 12.5 full backend suite

本設計ではfull backend suite greenをclaimしません。  
実装後に必要になった段階で別途確認します。

---

## 13. acceptance criteria

RSR実装の受け入れ条件は次です。

```text
1. DHR-OP09 result memo / branch / next step をbody-freeでintakeできる。
2. default branch が retry/start required の場合、DMD handoff planをmaterializeしない。
3. explicit local-only allowがない場合、actual review startへ進まない。
4. body-full packet requestとbody-full packet generationを混同しない。
5. body-full packet本体をhelper output / result memo / test outputへ出さない。
6. actual operation receiptは source_kind_ref = actual_local_only_human_review_by_person を満たす場合だけacceptedになる。
7. created_from_real_operationはhelper/test/fixture/synthetic/reuseではtrueにできない。
8. sanitized rows / rating rows / question need rowsは24 case / operation_receipt_ref一致を検査する。
9. question need observationはP8 design material candidate onlyであり、P8質問仕様ではない。
10. disposal / purge receiptなしではcomplete candidateにならない。
11. no-body / no-question / no-path / no-hash / no-terminal / no-touch scanがある。
12. complete candidateでもDMD/R52/P5/P6/P8/P7/releaseへ自動昇格しない。
13. next_required_stepはDHR re-intakeまたはmanual decision holdであり、自動executionではない。
14. target tests / selected regression / compileall summaryをresult memoにcount-onlyで残す。
15. RN / API / DB / response key / runtime generationを変更しない。
```

---

## 14. 実装時の順序

実装に入る場合、華恋は次の順で進めます。

```text
1. 既存DHR/ELR/ALR/DMD helperのfield setとsource_kind定数を再確認する。
2. RSR helper skeletonを作る。OP00〜OP03だけ実装する。
3. RSR-OP00〜OP03 testsを作る。
4. RSR-OP04 readiness classifierを作る。
5. RSR-OP05〜OP08でrunbook boundary / packet receipt / selection-only form contractを作る。
6. RSR-OP09〜OP10でlifecycle / actual operation receipt intakeを作る。
7. RSR-OP11〜OP13でrows / question observation / purge receipt intakeを作る。
8. RSR-OP14で全material no-leak / no-promotion scanを作る。
9. RSR-OP15でbranch resolverを作る。
10. RSR-OP16 result memo closureを作る。
11. RSR target testsを通す。
12. DHR / ELR / DMD / ALR selected regressionを通す。
13. compileallを通す。
14. 必要に応じてRN contractを再確認する。
15. 実装結果memoを作る。
```

実装段階でも、actual review実行は別判断です。  
helper実装完了とactual review完了を混同しません。

---

## 15. リスクと対策

### 15.1 helper loop化

リスク:

```text
RSR helper green
↓
actual reviewが進んだように見える
↓
しかし実レビューは未実行
↓
DHR/P8/DMDへ進めたくなる
```

対策:

```text
- helperはactual reviewを実行しないと明記する。
- actual_operation_receipt_created_here_by_helper=falseを固定する。
- row_created_by_helper=falseを必須にする。
- result memoに「helper green != actual review complete」を残す。
```

### 15.2 body leak

リスク:

```text
raw input / returned body / question_text / reviewer note / local path / hash / terminal outputがreceiptやresult memoへ混入する。
```

対策:

```text
- forbidden key scan。
- body-like value scan。
- path shape scan。
- hash shape scan。
- terminal output body scan。
- all body_free false markersをrequiredにする。
```

### 15.3 source_kind偽装

リスク:

```text
helper生成candidateやunit test fixtureが actual_local_only_human_review_by_person として扱われる。
```

対策:

```text
- created_from_real_operation=trueだけでは不足にする。
- reviewer_is_person_confirmed / selection_only_form_used / purge_receipt_accepted / no-leak passedを同時必須にする。
- row_created_by_helper / row_created_for_unit_test / row_is_synthetic_contract_fixture / historical_row_reusedを必ずfalseにする。
```

### 15.4 P8質問への逃げ

リスク:

```text
question need observationをP8 question design開始と読み替える。
```

対策:

```text
- question_text_materialized=false。
- draft_question_text_materialized=false。
- p8_question_spec_created=false。
- p8_question_design_started=false。
- p8_start_allowed=false。
```

### 15.5 DMD/R52自動実行への逸脱

リスク:

```text
actual evidence complete candidateをDMD/R52へ自動実行する。
```

対策:

```text
- dmd_execution_started_here=false。
- dmd_auto_execution_allowed=false。
- r52_actual_execution_started_here=false。
- next_required_stepはmanual re-intake / manual decisionのみ。
```

---

## 16. 確認済み / 未確認 / 書かれていない / 推測禁止

### 確認済み

```text
- 次の設計対象は P7-R54-AHR Post-DHR09 Actual Local-Only Human Review Retry/Start Decision。
- DHR current default branchは DHR_BRANCH_RETRY_OR_START_REQUIRED_BEFORE_DOWNSTREAM_HANDOFF。
- DHR current default next required stepは retry_or_start_actual_local_only_human_review_operation_with_explicit_local_only_allow。
- P8 question design / DMD execution / R52 execution / P5 finalization / P6 start / P7 complete / release decisionへは進まない。
- body-fullとbody-freeを分離する必要がある。
- source_kind_ref = actual_local_only_human_review_by_person はhelper candidateでは使えない。
```

### 未確認

```text
- explicit local-only allow receiptの実作成。
- actual body-full packet generationの実実行。
- actual local-only human reviewの実実行。
- actual operation receiptの実作成。
- sanitized review result rowsの実作成。
- rating rowsの実作成。
- question need observation rowsの実作成。
- disposal / purgeの実実行。
- DHR re-intakeの実実行。
- DMD execution。
- R52 actual execution。
- P5/P6/P8/P7/release昇格。
```

### 書かれていない

```text
- RSR target greenがactual review実行完了であるとは書かない。
- RSR complete candidateがDMD実行許可であるとは書かない。
- RSR complete candidateがR52/P8/P7/release許可であるとは書かない。
- question need observationがP8質問仕様であるとは書かない。
```

### 推測禁止

```text
- helper greenをactual evidenceとして読むこと。
- body-full packet requestをbody-full packet生成済みとして読むこと。
- operation receipt schemaをreceipt実作成として読むこと。
- created_from_real_operationを、person review without leak/purge confirmationなしにtrue扱いすること。
- DHR current default branchを無視してDMDへ進むこと。
- P8質問設計でP7の実レビュー不足を補った扱いにすること。
```

---

## 17. 華恋の意見

華恋の判断では、今回の設計は「またhelperを増やす設計」にしてはいけません。  
もちろん、実装上はbody-free guard helperが必要です。けれど、そのhelperの目的はactual reviewをしたように見せることではなく、**actual reviewを偽装できないようにすること**です。

Cocolonとして大事なのは、P8へ早く進むことではありません。  
P8の問いは将来的に必要になるかもしれませんが、実レビュー前に問い仕様へ進むと、Emlis本体の読感不足を質問で埋める方向へ寄ります。  
それは、Cocolonの一発目の「読まれた形」を弱くします。

だから、今回のRSRは次のための設計です。

```text
P7を終わらせたことにする設計ではなく、
P7で本当に読感評価へ戻るための設計。

P8へ進むための設計ではなく、
P8へ進んでよい材料を作るための設計。

helper greenを増やす設計ではなく、
actual local-only human reviewを偽装せず、必要なら本当に開始/再試行するための設計。
```

以上。
