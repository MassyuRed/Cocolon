---
title: "Cocolon / EmlisAI P7-R54-AHR Post-ALR12 Explicit Local-only Review Start/Retry Operation 詳細設計書・実装順"
created_at: "2026-07-03 JST"
author: "華恋"
work_mode: "共鳴構造モード"
work_type: "詳細設計書 / 実装順 / json・schema案内包"
source_mode: "local_received_zip_only"
github_connection_check: "not_required_by_mash_instruction / not_performed"
base_pre_design_memo: "Cocolon_EmlisAI_P7_R54AHR_PostALR12_ExplicitLocalOnlyReviewStartRetry_PreDesignMemo_20260703.md"
selected_design_target: "P7-R54-AHR Post-ALR12 Explicit Local-only Review Start/Retry Operation"
artifact_scope: "md design only"
code_change: "none"
json_schema_file_creation: "none"
actual_body_full_packet_generation: "none"
actual_local_human_review_execution: "none"
actual_rows_creation: "none"
actual_disposal_purge_execution: "none"
p8_question_design: "none"
p8_question_implementation: "none"
p5_finalization: "none"
p6_start: "none"
p7_complete: "none"
release_decision: "none"
---

# Cocolon / EmlisAI P7-R54-AHR Post-ALR12 Explicit Local-only Review Start/Retry Operation 詳細設計書・実装順

対象: Cocolon / EmlisAI / P7 Product Quality Runner / R54-AHR / Post-DMD08 ALR-OP12後 / explicit local-only allow / actual local-only human review start-retry entry  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
実装扱い: 本書は設計書です。コード変更、json実ファイル化、schema実ファイル化、body-full packet生成、actual local-only human review実行、rows作成、purge実行は行いません。  
json / schema実ファイル化: なし。本書内の案のみ。実ファイル化は実装段階で、現物コード、既存schema配置、既存Guard、既存test結果を見て判断します。  
GitHub接続確認: Mash様指示により不要。今回受領したローカルzip基準。  

---

## 0. 結論

次に設計・実装対象として進めるべき段階は、次です。

```text
P7-R54-AHR Post-ALR12
Explicit Local-only Review Start/Retry Operation
```

日本語で固定すると、次です。

```text
ALR-OP12で retry_or_start_required と判定された後、
actual local-only human review を、
明示local-only許可、body-full局所扱い、selection-only review、body-free証跡、purge、no-leak、no-promotionで、
実レビュー証跡へ進めるための開始/再試行入口を作る段階。
```

本書の結論は次です。

```text
- P8観測補助問い設計へは進まない。
- R52 actual executionへも戻らない。
- ALR helperをさらに増築すること自体を成果にしない。
- Post-ALR12専用の薄い入口層を作り、actual local-only reviewへ入るための明示許可・session・receipt・rows・purge・DMD-compatible handoffを設計する。
- ただし、本書では実レビュー、body-full packet生成、rows作成、purge実行は行わない。
```

実装段階で追加するなら、ALR helper本体へ責務を重ねるより、次の専用helperを第一候補にします。

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_20260703.py
```

step prefix案は次です。

```text
ELR-OP00〜ELR-OP19
```

ELRは、ここでは **Explicit Local-only Review** の略として扱います。  
ALRはDMD後のaction resolver / expected schema guardまでを閉じた層です。ELRは、ALR-OP12の `ALR_ACTION_RETRY_OR_START_LOCAL_ONLY_REVIEW_REQUIRED` を受け、actual operationの開始/再試行入口へ進める層として分けます。

---

## 1. なぜこの設計を行うのか

Cocolon / EmlisAIの目的は、helperをgreenにすることではありません。  
Cocolonが目指しているのは、ユーザーが残した言葉が、入力直後に「読まれた形」として返ることです。

P7では、EmlisAIの商品品質を、単発fixtureやunit test greenではなく、実ケースに対する読感・自然さ・履歴接続・過剰読解のなさ・もう一度入力したくなるかで測る必要があります。  
ロードマップ上、P7/P8 Bridgeでは、P7の人間読感・実機確認中に、body-freeの「問い必要性観察メモ」を残すことが定義されています。ただし、P7途中でP8質問機能を作ることは禁じられています。

現在、ALR-OP12は次を閉じています。

```text
- DMD branch intake
- existing operation material inventory
- body-free leak / invalid source / promotion scan
- continue / retry / repair / complete action resolver
- operation state machine
- explicit local-only allow requirement boundary
- body-full packet request body-free envelope
- expected operation receipt / rows / disposal schema guard
- downstream non-promotion hold
- result memo / target tests / selected regression closure
```

一方で、ALR-OP12は次を実行していません。

```text
- actual body-full packet generation
- actual local-only human review execution
- actual operation receipt creation
- actual sanitized review result rows creation
- actual rating rows creation
- actual question need observation rows creation
- actual disposal / purge execution
```

したがって、ここでP8質問設計へ進むと、P7で実ケースを読んだ根拠がないまま、質問機能で読感不足を補った扱いになり得ます。  
これは、Cocolonとして「人間の言葉を雑に処理しない」方向ではありません。

本設計の目的は、**質問へ逃げる前に、Cocolon / EmlisAIが実ケースをどう読めているかを、人間実読由来のbody-free証跡で確認する入口を作ること**です。

---

## 2. 参照資料・確認範囲

### 2.1 今回受領したローカルzip

```text
/mnt/data/Cocolon_前提資料(280).zip
/mnt/data/EmlisAIの実装済み資料(93).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(12).zip
/mnt/data/Cocolon(266).zip
/mnt/data/mashos-api(179).zip
```

内部資料に書かれた過去zip番号と、今回受領した外側zip番号が一致しない箇所があります。  
本書では、今回 `/mnt/data` に受領したローカルzipの実体を基準にします。

### 2.2 作業姿勢・Cocolon前提

主に確認した資料:

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/01_cocolon_overall_structure.md
Cocolon_前提資料/02_cocolon_national_system.md
Cocolon_前提資料/02C_cocolon_contract_boundary_validation.md
Cocolon_前提資料/07_latest_snapshot_diff.md
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
```

作業姿勢として固定すること:

```text
- 設計ならコード変更禁止。
- 見ていないファイルを見たように言わない。
- 前提資料だけで理解したふりをしない。実ファイルも確認する。
- Cocolonをメンタル問題ではなく、商品品質・生活成立の問題として扱う。
- EmlisAIをGate通過装置、テンプレ共感、case専用route、固定surfaceへ逃がさない。
- pytest green、fixture green、RN contract greenだけを成果と呼ばない。
- Mash様がコードを完全に検証できないことを、確認不足の逃げ道にしない。
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
21.1 更新記録: 2026-06-19 JST / 観測補助問い P7-P8 Bridge追記
```

ロードマップから固定すること:

```text
- P7では観測補助問いを実装しない。
- P7では実ケースごとのbody-free問い必要性観察メモを残す。
- P8開始時に、P7で集めた実ケース観察メモを根拠として問い設計する。
- P7完了条件を問い機能で緩めない。
- Emlis本体の読感不足を問い返しで補った扱いにしない。
```

### 2.4 検討メモ

```text
Cocolon_EmlisAI_P7_R54AHR_PostALR12_ExplicitLocalOnlyReviewStartRetry_PreDesignMemo_20260703.md
```

検討メモで固定された判断:

```text
- 現状はP7途中。
- P8開始はまだ許可されていない。
- ALR-OP12 target greenはactual review実行済みの証明ではない。
- 次はP8質問設計ではなく、actual local-only review start/retry入口の設計。
- ALR-OP12後のcurrent default selected actionは ALR_ACTION_RETRY_OR_START_LOCAL_ONLY_REVIEW_REQUIRED。
- ALR-OP12後のnext required stepは start_or_retry_actual_local_only_human_review_operation_with_explicit_local_only_allow。
```

### 2.5 実装済み資料

主に確認した資料:

```text
Cocolon_EmlisAI_P7_R54AHR_PostDMD08_ContinueRetryActualLocalOnlyHumanReviewOperation_DetailedDesign_ImplementationOrder_20260703.md
Cocolon_EmlisAI_P7_R54AHR_PostDMH18_DownstreamManualDecision_ActualEvidenceStatusTriage_DetailedDesign_ImplementationOrder_20260703.md
Cocolon_EmlisAI_P7_R54AHR_PostPMN_OP23_DownstreamManualDecisionHold_ActualLocalOnlyHumanReviewOperation_EvidenceIntake_DetailedDesign_ImplementationOrder_20260701.md
Cocolon_EmlisAI_P7_R54AHR_PostMN11_ActualLocalOnlyHumanReviewOperation_DetailedDesign_ImplementationOrder_20260630.md
Cocolon_EmlisAI_P7_R54AHR_PostCR22_ActualLocalOnlyHumanReviewExecution_EvidenceCompletion_DetailedDesign_ImplementationOrder_20260629.md
Cocolon_EmlisAI_P7_R54ActualHumanReviewExecution_BodyFreeEvidenceIntake_DetailedDesign_ImplementationOrder_20260627.md
```

### 2.6 実ファイル

主に確認した実ファイル:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_20260703.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_dmh18_downstream_manual_decision_triage_20260703.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_20260701.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_current_received_snapshot_actual_local_review_operation_20260628.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_actual_human_review_execution_bodyfree_intake_20260627.py
mashos-api/ai/tests/R54_AHR_PostDMD08_ContinueRetryActualLocalOnlyHumanReviewOperation_ALR_OP00_OP12_Result_20260703.md
```

---

## 3. 現在地固定

### 3.1 ALR-OP12の現在default path

ALR-OP12 result memo上の現在default pathは次です。

```text
selected_action_ref: ALR_ACTION_RETRY_OR_START_LOCAL_ONLY_REVIEW_REQUIRED
alr_op11_status_ref: ALR_DOWNSTREAM_NON_PROMOTION_HOLD_ACTUAL_REVIEW_CONTINUE_OR_RETRY_REQUIRED
next_required_step: start_or_retry_actual_local_only_human_review_operation_with_explicit_local_only_allow
```

この意味は次です。

```text
ALR helper closureは完了した。
ただし、actual local-only human reviewは未実行。
したがって、次は explicit local-only allow付きで、actual review operationをstart/retryする入口へ進む。
```

### 3.2 ALR-OP12で確認されたgreen

検討メモ作成時点で確認されたローカル結果:

```text
ALR-OP00〜OP12 target: 97 passed
DMD-OP00〜OP08 regression: 74 passed
selected PMN / DMH / MN regression: 158 passed
compileall services/ai_inference: passed
```

この結果から言えること:

```text
- ALR-OP00〜OP12のbody-free helper lineは閉じている。
- DMD/DMH/PMN/MN周辺の選択regressionは対象範囲で崩れていない。
- services/ai_inferenceはcompileできる。
```

この結果から言えないこと:

```text
- full backend suite green。
- RN contract green。
- RN real-device modal verified。
- actual body-full packet generation済み。
- actual local-only human review実行済み。
- actual rows作成済み。
- actual purge済み。
- P8開始許可。
- release許可。
```

### 3.3 Post-ALR12で引き継ぐnot claimed boundary

Post-ALR12設計では、次をfalseのまま引き継ぎます。

```text
actual_body_full_packet_generation: false
actual_local_human_review_execution: false
actual_operation_receipt_creation: false
actual_rows_creation: false
actual_sanitized_review_result_rows_from_real_operation: false
actual_rating_rows_from_real_operation: false
actual_question_need_observation_rows_from_real_operation: false
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

Post-ALR12実装が完了しても、actual reviewを別途実行しない限り、上記はtrueにしません。  
actual review実行後にtrueへできるものがある場合も、body-free receiptとguardを通したものだけに限定します。

---

## 4. 本設計の対象範囲 / 非対象範囲

### 4.1 対象範囲

本設計の対象は次です。

```text
1. ALR-OP12 result memoのbody-free intake。
2. selected_action_ref = ALR_ACTION_RETRY_OR_START_LOCAL_ONLY_REVIEW_REQUIRED の確認。
3. explicit local-only allow receiptの必須条件。
4. local-only review session envelope。
5. 24-case manifest / body-full packet request / packet generation receiptの境界。
6. reviewer person boundary / selection-only form。
7. actual review lifecycleのbody-free state capture。
8. actual operation receipt intake。
9. sanitized review result rows / rating rows / question need observation rowsのbody-free intake。
10. disposal / purge receipt。
11. no-body / no-question / no-path / no-hash / no-terminal-output / no-touch validation。
12. actual_review_evidence_complete predicate。
13. DMD-compatible actual_operation_evidence_receipt adapter。
14. downstream manual decision hold。
15. result memo / validation closure。
```

### 4.2 非対象範囲

本設計では、以下を行いません。

```text
- body-full packet本体の生成。
- actual local-only human review実行。
- actual operation receipt作成。
- actual sanitized review result rows作成。
- actual rating rows作成。
- actual question need observation rows作成。
- disposal / purge実行。
- P8 question API / DB / RN UI / trigger / response key / plan guardの設計・実装。
- question text / draft question textの作成。
- production API route変更。
- DB migration。
- RN production UI変更。
- public response key変更。
- user dictionary / derived model write path変更。
- subscription / entitlement / plan guard変更。
- R52 actual execution。
- P5 finalization。
- P6 start。
- P7 complete。
- release decision。
```

### 4.3 禁止する読み替え

```text
ALR-OP12 target green = actual review実行済み
explicit local-only allow required = allow granted
body-full packet request envelope = body-full packet生成済み
operation receipt expected schema = actual operation receipt作成済み
rows expected schema = actual rows作成済み
question need observation row schema = P8質問仕様
DMD-compatible receipt adapter = downstream execution許可
actual_review_evidence_complete candidate = P5/P6/P8/R52/P7/release自動許可
```

---

## 5. 用語定義

### 5.1 body-full

本書でのbody-fullは、raw input、comment_text、returned Emlis body、history surface body、reviewer note body、question text、draft question text、answer text、local absolute path、body hash、terminal output bodyなど、成果物へ出してはいけない情報を含み得るreview用実体です。

```text
body-fullは、actual review中にlocal-onlyで扱われる可能性がある。
body-fullは、設計書、result memo、public meta、schema example、test outputへ残さない。
```

### 5.2 body-free

body-freeは、safe ref、count、boolean、status ref、bucket ref、enum refだけで構成される証跡です。

```text
body-freeは、実ケースを読んだ事実や判定結果を、本文なしで後段へ渡すための形式。
```

### 5.3 explicit local-only allow

actual reviewに入る前に必要な明示許可です。  
この許可は、body-full packet generation、local-only review session、selection-only recording、body-free receipt、purgeまでの範囲を、body-freeに承認したことを示します。

重要:

```text
allow required は allow granted ではない。
allow receipt がない場合、body-full packet generationもactual review executionも開始しない。
```

### 5.4 actual local-only human review

fixture、unit test、helper default、synthetic rows、過去資料の再利用ではなく、person reviewerがlocal-onlyで24ケースを実際に読んだreviewです。

actual local-only human reviewとしてclaimできる条件:

```text
- reviewer_is_person_confirmed: true
- local_only_operation_confirmed: true
- selection_only_form_used: true
- reviewed_case_count: 24
- operation receipt accepted
- rows / rating / question need observationがactual review由来
- purge receipt accepted
- no-leak validation passed
```

### 5.5 question need observation

P7/P8 Bridgeで残す観察メモです。  
これは、問い本文ではありません。問い設計でもありません。P8開始許可でもありません。

```text
question need observation = 問いが必要そうか、問いに逃げるべきでないかをbody-free分類で残す観察行。
```

---

## 6. 設計方針

### 6.1 ALR helperをさらに太らせない

ALR-OP00〜OP12は、DMD後のcontinue/retry/repair/complete decisionとexpected schema guardを閉じるための層です。  
ここへactual operation lifecycleをさらに入れると、ALRの意味が「実行前decision」から「実行・証跡・下流adapter」まで広がりすぎます。

したがって、Post-ALR12では専用の薄いELR層を作る方針にします。

```text
ALR: action resolver / expected schema guard / non-promotion hold
ELR: explicit local-only allow後のstart/retry operation入口 / actual evidence intake / DMD-compatible handoff
```

### 6.2 実レビューそのものはhelperで偽装しない

ELR helperは、actual reviewを実行したことにしません。  
helperが行うのは、次です。

```text
- 実レビューへ入るためのbody-free条件をassertする。
- 実レビュー後に受けるreceipt / rows / purgeがbody-freeか検査する。
- fixture / helper / synthetic / historical reuseをactual sourceから除外する。
- 条件が揃えばDMD-compatible receiptへadapterする。
- 条件が揃わなければwaiting / repair / manual holdに止める。
```

### 6.3 P8質問へ逃がさない

ELRでquestion need observation rowsを扱う理由は、P8質問を作るためではありません。  
P7/P8 Bridgeの観察材料を、actual review由来でbody-freeに残すためです。

禁止:

```text
- question textを作る。
- draft question textを作る。
- response keyへquestionを足す。
- RN UIへ問い導線を作る。
- 問いで読感不足を補った扱いにする。
```

### 6.4 完了しても自動昇格しない

actual review evidenceがcomplete candidateになっても、次へ自動昇格しません。

```text
p5_final_allowed: false
p6_start_allowed: false
p8_start_allowed: false
r52_actual_execution_started_here: false
p7_complete: false
release_allowed: false
```

次段階へ進むには、別のmanual decisionが必要です。

---

## 7. 推奨ファイル構成

### 7.1 実装候補helper

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_20260703.py
```

責務:

```text
- ALR-OP12 intake
- explicit local-only allow receipt guard
- review session envelope guard
- body-full packet generation receipt intake guard
- actual operation receipt / rows / rating / question observation / purge receipt guard
- final no-leak validation
- actual_review_evidence_complete predicate
- DMD-compatible actual_operation_evidence_receipt adapter
- downstream non-promotion hold
```

### 7.2 変更しないファイル

```text
mashos-api/ai/services/ai_inference/api_emotion_submit.py
mashos-api/ai/services/ai_inference/emotion_submit_service.py
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_20260703.py  # 原則変更しない
Cocolon/screens/InputScreen.js
Cocolon/screens/input/useInputFeedbackModal.js
Cocolon/screens/input/InputFeedbackReplyModal.js
DB migration files
```

ALR helperにadapterを追加した方が明らかに安全な場合のみ、実装段階で再検討します。  
ただし、第一候補はPost-ALR12専用helper追加です。

### 7.3 test module候補

```text
mashos-api/ai/tests/
  test_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_elr_op00_op02_20260703.py
  test_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_elr_op03_op05_20260703.py
  test_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_elr_op06_op08_20260703.py
  test_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_elr_op09_op11_20260703.py
  test_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_elr_op12_op14_20260703.py
  test_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_elr_op15_op17_20260703.py
  test_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_elr_op18_op19_result_20260703.py
```

### 7.4 result memo候補

```text
mashos-api/ai/tests/
  R54_AHR_PostALR12_ExplicitLocalOnlyReviewStartRetryOperation_ELR_OP00_OP19_Result_20260703.md
```

---

## 8. 実装順

### 8.1 全体依存順

```text
ELR-OP00: scope / no-touch / no-promotion re-freeze after ALR-OP12
ELR-OP01: ALR-OP12 result memo / selected action intake
ELR-OP02: explicit local-only allow receipt acceptance gate
ELR-OP03: local-only review session envelope / role boundary
ELR-OP04: 24-case manifest / body-full packet request boundary
ELR-OP05: body-full packet generation local receipt intake boundary
ELR-OP06: packet completeness / export denylist scan receipt
ELR-OP07: reviewer person boundary / selection-only form freeze
ELR-OP08: actual review operation lifecycle state capture
ELR-OP09: actual operation receipt intake
ELR-OP10: sanitized review result rows intake / provenance guard
ELR-OP11: rating rows normalization / threshold summary
ELR-OP12: question need observation rows normalization
ELR-OP13: rating-question consistency / blocker separation
ELR-OP14: disposal / purge receipt intake
ELR-OP15: final no-body / no-question / no-path / no-hash / no-terminal / no-touch validation
ELR-OP16: actual_review_evidence_complete predicate
ELR-OP17: DMD-compatible actual_operation_evidence_receipt adapter / handoff candidate
ELR-OP18: downstream non-promotion manual decision hold
ELR-OP19: result memo / validation closure
```

### ELR-OP00: scope / no-touch / no-promotion re-freeze after ALR-OP12

目的:

```text
Post-ALR12 ELR層の責務を固定する。
ALR-OP12 greenをactual review completeへ昇格しない。
API / DB / RN / runtime / response key / P8 / R52 / P5 / P6 / P7 / releaseに触れない境界を固定する。
```

実装内容:

```text
- phase / step / scope / policy_kind constantsを定義。
- ELR-OP00 schema_versionを定義。
- source_mode = local_received_zip_only を固定。
- git_connection_required = false / git_checked = false を固定。
- no-touch contractを定義。
- not-claimed boundaryをALR-OP12から引き継ぐ。
- selected design targetを定義。
```

acceptance:

```text
body_free: true
api_route_changed: false
db_schema_changed: false
rn_production_ui_changed: false
runtime_generation_changed: false
response_key_changed: false
p8_question_api_created: false
p8_start_allowed: false
release_allowed: false
next_required_step: ELR-OP01_ALR_OP12_result_memo_selected_action_intake
```

### ELR-OP01: ALR-OP12 result memo / selected action intake

目的:

```text
ALR-OP12 result memoをbody-freeに受け、現在defaultがstart/retry対象かを確認する。
```

実装内容:

```text
- ALR-OP12 material contractをassertする。
- selected_action_refを取り込む。
- next_required_stepを取り込む。
- not_executed_boundaryを取り込む。
- selected_action_refがretry/startでなければ、対応するhold / repair / downstream manual decisionへ分岐する。
- retry/start branchの場合のみ、explicit local-only allow gateへ進める。
```

acceptance:

```text
alr_op12_intake_status_ref in:
  ELR_ALR12_INTAKE_ACCEPTED_RETRY_OR_START_REQUIRED
  ELR_ALR12_INTAKE_ACCEPTED_CONTINUE_EXISTING_ALLOWED
  ELR_ALR12_INTAKE_ACCEPTED_REPAIR_STOP_REQUIRED
  ELR_ALR12_INTAKE_ACCEPTED_COMPLETE_RECEIPT_MANUAL_DECISION_REQUIRED
  ELR_ALR12_INTAKE_INVALID_OR_MISSING

current_default_expected:
  selected_action_ref: ALR_ACTION_RETRY_OR_START_LOCAL_ONLY_REVIEW_REQUIRED
  next_required_step: start_or_retry_actual_local_only_human_review_operation_with_explicit_local_only_allow
```

### ELR-OP02: explicit local-only allow receipt acceptance gate

目的:

```text
actual review operation開始前に、明示local-only許可receiptが存在し、body-freeで検査できることを保証する。
```

実装内容:

```text
- explicit_local_only_allow_receipt_optional を受け取れるようにする。
- receiptがmissingなら、start/retryは実行せず waiting_for_explicit_allow に止める。
- receiptがinvalidなら repair_required に止める。
- receiptがacceptedの場合のみ、session envelopeへ進める。
- receiptにbody-full、raw input、local path、hash、terminal output bodyが含まれないことを検査する。
- allow scopeが24-case local-only review / selection-only / purgeまで含むことを検査する。
```

acceptance:

```text
explicit_local_only_allow_required: true
explicit_local_only_allow_receipt_created_here: false
explicit_local_only_allow_granted_by_helper: false
allow_receipt_status_ref in:
  ELR_EXPLICIT_LOCAL_ONLY_ALLOW_RECEIPT_MISSING_WAITING
  ELR_EXPLICIT_LOCAL_ONLY_ALLOW_RECEIPT_ACCEPTED_BODYFREE
  ELR_EXPLICIT_LOCAL_ONLY_ALLOW_RECEIPT_INVALID_REPAIR_REQUIRED
body_full_packet_generation_allowed_without_allow: false
actual_review_execution_allowed_without_allow: false
```

### ELR-OP03: local-only review session envelope / role boundary

目的:

```text
explicit allowを受けた後、review sessionをbody-free refsだけで固定する。
```

実装内容:

```text
- review_session_idを固定または外部指定からsafe ref化する。
- operator_ref / reviewer_person_refをbody-free refで扱う。
- reviewer_is_person_confirmedを必須にする。
- local_only_operation_confirmedを必須にする。
- external_export_allowed = false を固定する。
- session stateを waiting_for_packet_generation / packet_ready / review_in_progress / receipt_waiting / rows_waiting / purge_waiting / complete_candidate / repair_required で扱う。
```

acceptance:

```text
review_session_envelope_status_ref in:
  ELR_REVIEW_SESSION_ENVELOPE_READY_BODYFREE
  ELR_REVIEW_SESSION_ENVELOPE_WAITING_FOR_ALLOW
  ELR_REVIEW_SESSION_ENVELOPE_REPAIR_REQUIRED
reviewer_person_ref_present: true  # accepted path only
reviewer_is_person_confirmed: true # accepted path only
local_only_operation_confirmed: true # accepted path only
```

### ELR-OP04: 24-case manifest / body-full packet request boundary

目的:

```text
actual review対象が24ケースであり、body-full packet requestはbody-free envelopeとしてのみ扱われることを固定する。
```

実装内容:

```text
- expected_case_count = 24 を固定。
- case_ref listはsafe refのみ。
- packet_request_refをbody-freeで作る。
- body-full packet本体は生成しない。
- raw input / comment_text / returned body / path / hash / terminal outputを含めない。
- manifest completenessとduplicateを検査する。
```

acceptance:

```text
manifest_status_ref in:
  ELR_24_CASE_MANIFEST_READY_BODYFREE
  ELR_24_CASE_MANIFEST_MISSING_OR_INCOMPLETE
  ELR_24_CASE_MANIFEST_REPAIR_REQUIRED
expected_case_count: 24
body_full_packet_generated_here: false
body_full_packet_body_included: false
```

### ELR-OP05: body-full packet generation local receipt intake boundary

目的:

```text
body-full packet生成そのものではなく、生成がlocal-onlyで行われたことを示すbody-free receiptを受ける境界を作る。
```

実装内容:

```text
- packet_generation_receipt_optionalを受ける。
- receipt missingなら waiting_for_packet_generation_receipt に止める。
- receipt acceptedなら packet completeness scanへ進む。
- receiptにはpacket body、raw input、local absolute path、hash、terminal output bodyを含めない。
- packet_case_count == 24 を必須にする。
- generated_local_only == true を必須にする。
- external_export_performed == false を必須にする。
```

acceptance:

```text
packet_generation_receipt_status_ref in:
  ELR_PACKET_GENERATION_RECEIPT_MISSING_WAITING
  ELR_PACKET_GENERATION_RECEIPT_ACCEPTED_BODYFREE
  ELR_PACKET_GENERATION_RECEIPT_INVALID_REPAIR_REQUIRED
packet_case_count: 24 # accepted path only
body_full_packet_body_included: false
local_path_included: false
body_hash_included: false
```

### ELR-OP06: packet completeness / export denylist scan receipt

目的:

```text
reviewへ進む前に、packet completenessとexport denylistをbody-free receiptで検査する。
```

実装内容:

```text
- packet_scan_receipt_optionalを受ける。
- packet_case_count == 24 を確認。
- packet_manifest_case_refs_match == true を確認。
- export denylist violation count == 0 を確認。
- body-full / raw input / question text / reviewer note / path / hash / terminal output bodyがreceiptに含まれないことをscanする。
```

acceptance:

```text
packet_scan_status_ref in:
  ELR_PACKET_COMPLETENESS_EXPORT_SCAN_PASSED
  ELR_PACKET_COMPLETENESS_EXPORT_SCAN_WAITING
  ELR_PACKET_COMPLETENESS_EXPORT_SCAN_REPAIR_REQUIRED
packet_review_ready: true # passed path only
```

### ELR-OP07: reviewer person boundary / selection-only form freeze

目的:

```text
reviewerがpersonであり、review formがselection-onlyで固定されていることを確認する。
```

実装内容:

```text
- reviewer_person_refを確認。
- reviewer_is_person_confirmed == true を必須にする。
- reviewer_form_kind_ref = selection_only_bodyfree_result_form を固定。
- free text / reviewer notes body / question text / draft question textを禁止する。
- verdict options / rating axis / question need optionsは既存AHR09/CR10系option refsを再利用する。
```

acceptance:

```text
reviewer_form_status_ref in:
  ELR_REVIEWER_SELECTION_FORM_READY_BODYFREE
  ELR_REVIEWER_SELECTION_FORM_WAITING
  ELR_REVIEWER_SELECTION_FORM_REPAIR_REQUIRED
reviewer_free_text_allowed: false
question_text_allowed: false
selection_only: true # ready path only
```

### ELR-OP08: actual review operation lifecycle state capture

目的:

```text
actual reviewを実行済みと偽装せず、local-only manual operationの状態をbody-freeで記録する。
```

実装内容:

```text
- operation_lifecycle_material_optionalを受ける。
- state refsを定義する。
- not_started / waiting / in_progress / paused / aborted / completed_receipt_waiting / repair_required を扱う。
- completed claimにはoperation receiptが必要であることを固定する。
- helper自身はactual reviewを実行しない。
```

acceptance:

```text
operation_lifecycle_status_ref in:
  ELR_REVIEW_OPERATION_NOT_STARTED_OR_WAITING
  ELR_REVIEW_OPERATION_IN_PROGRESS_BODYFREE_TRACKED
  ELR_REVIEW_OPERATION_PAUSED_BODYFREE_TRACKED
  ELR_REVIEW_OPERATION_COMPLETED_RECEIPT_WAITING
  ELR_REVIEW_OPERATION_ABORTED_OR_REPAIR_REQUIRED
helper_executes_actual_review: false
```

### ELR-OP09: actual operation receipt intake

目的:

```text
person reviewerがlocal-onlyで24ケースを実読したことを、body-free actual operation receiptとして受ける。
```

実装内容:

```text
- actual_operation_receipt_optionalを受ける。
- receipt missingなら waiting に止める。
- schema_version / operation_receipt_ref / review_session_id / source_kind_refを検査する。
- source_kind_ref = actual_local_only_human_review_by_person を必須にする。
- created_from_real_operation == true を必須にする。
- actual_human_review_executed_by_person == true を必須にする。
- reviewed_case_count == 24 を必須にする。
- selection_row_count == 24 を必須にする。
- local_only / selection_only / no export guardを必須にする。
```

acceptance:

```text
actual_operation_receipt_status_ref in:
  ELR_ACTUAL_OPERATION_RECEIPT_MISSING_WAITING
  ELR_ACTUAL_OPERATION_RECEIPT_ACCEPTED_BODYFREE
  ELR_ACTUAL_OPERATION_RECEIPT_INVALID_OR_INCOMPLETE
  ELR_ACTUAL_OPERATION_RECEIPT_REPAIR_REQUIRED
```

### ELR-OP10: sanitized review result rows intake / provenance guard

目的:

```text
actual review由来のselection-only rowsをbody-freeに受ける。
```

実装内容:

```text
- sanitized_review_result_rows_optionalを受ける。
- row count == 24 を必須にする。
- case refsがmanifestと一致することを検査する。
- operation_receipt_ref / review_session_id / reviewer_person_ref consistencyを検査する。
- source_kind_ref = actual_local_only_human_review_by_person を必須にする。
- fixture / helper / synthetic / historical_reuse_onlyをinvalid sourceにする。
- raw input / comment_text / returned body / reviewer free text / question text / path / hash / terminal bodyを禁止する。
```

acceptance:

```text
sanitized_rows_status_ref in:
  ELR_SANITIZED_REVIEW_RESULT_ROWS_MISSING_WAITING
  ELR_SANITIZED_REVIEW_RESULT_ROWS_ACCEPTED_BODYFREE
  ELR_SANITIZED_REVIEW_RESULT_ROWS_INVALID_OR_REPAIR_REQUIRED
sanitized_review_result_row_count: 24 # accepted path only
```

### ELR-OP11: rating rows normalization / threshold summary

目的:

```text
sanitized review result rowsから、body-free rating rowsを正規化し、商品読感評価の集計へつなげる。
```

実装内容:

```text
- rating row count == 24 を必須にする。
- rating axis refsは既存AHR09/CR10/CR11系を再利用する。
- score optionsは既存score optionsに合わせる。
- verdict refsは既存verdict optionsに合わせる。
- below target axis / readfeel blockers / execution blockersをbody-free refで集計する。
- actual_rating_rows_materialized_here は、実レビュー由来rowsを受けて正規化した場合のみtrueにできる。
```

acceptance:

```text
rating_rows_status_ref in:
  ELR_RATING_ROWS_MISSING_WAITING
  ELR_RATING_ROWS_NORMALIZED_BODYFREE
  ELR_RATING_ROWS_INVALID_OR_REPAIR_REQUIRED
rating_row_count: 24 # accepted path only
```

### ELR-OP12: question need observation rows normalization

目的:

```text
P7/P8 Bridge用の問い必要性観察行を、actual review由来のbody-free分類として残す。
```

実装内容:

```text
- question_need_observation_rows_optionalを受ける。
- row count == 24 を必須にする。
- case refsがmanifest / rating rowsと一致することを検査する。
- question_need_primary_classは既存AHR09 option refsを再利用する。
- ambiguity_kind_refs / one_question_fit_ref / repair_required_refsをbody-free refsで扱う。
- question_text / draft_question_text / answer_text / reviewer free textを禁止する。
- p8_question_spec_created = false を固定する。
```

acceptance:

```text
question_need_rows_status_ref in:
  ELR_QUESTION_NEED_OBSERVATION_ROWS_MISSING_WAITING
  ELR_QUESTION_NEED_OBSERVATION_ROWS_NORMALIZED_BODYFREE
  ELR_QUESTION_NEED_OBSERVATION_ROWS_INVALID_OR_REPAIR_REQUIRED
question_need_observation_row_count: 24 # accepted path only
p8_question_spec_created: false
```

### ELR-OP13: rating-question consistency / blocker separation

目的:

```text
rating resultとquestion need observationが矛盾せず、問いへ逃げるケースとEmlis本体修復ケースを分離する。
```

実装内容:

```text
- rating row refsとquestion need row refsをcase_ref単位で照合する。
- low rating + question_needed を無条件にP8候補扱いしない。
- not_question_emlis_readfeel_repair_required / p5_surface_repair_required / gate_boundary_required を修復候補として分ける。
- plus/premium candidate refsはP8 design material candidateに止める。
```

acceptance:

```text
rating_question_consistency_status_ref in:
  ELR_RATING_QUESTION_CONSISTENCY_PASSED
  ELR_RATING_QUESTION_CONSISTENCY_WAITING
  ELR_RATING_QUESTION_CONSISTENCY_REPAIR_REQUIRED
p8_start_allowed: false
p8_question_implementation_allowed: false
```

### ELR-OP14: disposal / purge receipt intake

目的:

```text
body-full一時材料が、local-only review後に保持されていないことをbody-free receiptで確認する。
```

実装内容:

```text
- disposal_purge_receipt_optionalを受ける。
- receipt missingなら evidence complete candidate に進めない。
- body_full_packet_retained == false を必須にする。
- raw_input_retained == false を必須にする。
- reviewer_note_body_retained == false を必須にする。
- question_text_retained == false を必須にする。
- local_path_included / hash_included / terminal_output_body_included == false を必須にする。
- disposal_purge_receipt_accepted == true を必須にする。
```

acceptance:

```text
disposal_purge_receipt_status_ref in:
  ELR_DISPOSAL_PURGE_RECEIPT_MISSING_WAITING
  ELR_DISPOSAL_PURGE_RECEIPT_ACCEPTED_BODYFREE
  ELR_DISPOSAL_PURGE_RECEIPT_INVALID_OR_REPAIR_REQUIRED
disposal_purge_receipt_accepted: true # accepted path only
```

### ELR-OP15: final no-body / no-question / no-path / no-hash / no-terminal / no-touch validation

目的:

```text
ELR-OP00〜OP14のbody-free artifactsを横断し、漏洩・promotion・no-touch違反がないことを確認する。
```

実装内容:

```text
- forbidden payload key pathsを横断scanする。
- raw body / question text / reviewer note / path / hash / terminal output bodyをscanする。
- API / DB / RN / runtime / response key変更フラグをscanする。
- P8 / R52 / P5 / P6 / P7 / release promotion claimをscanする。
```

acceptance:

```text
final_validation_status_ref in:
  ELR_FINAL_NO_LEAK_NO_TOUCH_VALIDATION_PASSED
  ELR_FINAL_NO_LEAK_NO_TOUCH_VALIDATION_REPAIR_REQUIRED
forbidden_payload_key_path_count: 0 # passed path
promotion_claim_path_count: 0 # passed path
no_touch_violation_count: 0 # passed path
```

### ELR-OP16: actual_review_evidence_complete predicate

目的:

```text
actual review evidenceがcomplete candidateと言えるかを、実レビュー由来のreceipt / rows / purge / validationだけで判定する。
```

complete条件:

```text
- explicit local-only allow receipt accepted。
- review session envelope ready。
- 24-case manifest ready。
- packet generation local receipt accepted。
- packet completeness / export scan passed。
- reviewer person / selection-only form ready。
- actual operation receipt accepted。
- sanitized review result rows 24 accepted。
- rating rows 24 normalized。
- question need observation rows 24 normalized。
- rating-question consistency passed。
- disposal / purge receipt accepted。
- final no-leak / no-touch validation passed。
```

acceptance:

```text
actual_review_evidence_complete: true only if all complete conditions pass
actual_review_evidence_complete_candidate: true only if source_kind is actual_local_only_human_review_by_person
helper_green_promoted_to_actual_review_complete: false
```

### ELR-OP17: DMD-compatible actual_operation_evidence_receipt adapter / handoff candidate

目的:

```text
ELRでcompleteになった証跡を、DMD-OP02/OP03が期待するactual_operation_evidence_receipt schemaへ変換できるようにする。
```

実装内容:

```text
- DMD-compatible schema_versionを使う。
- source_kind_ref = actual_local_only_human_review_by_person を固定。
- reviewed_case_count / selection_row_count / sanitized_review_result_row_count / rating_row_count / question_need_observation_row_count を24にする。
- required true guard fieldsをtrueにする。
- receipt body-free scanを通す。
- handoff candidateであり、DMD再実行やR52実行をここで開始しない。
```

acceptance:

```text
dmd_compatible_receipt_adapter_status_ref in:
  ELR_DMD_COMPATIBLE_RECEIPT_READY_BODYFREE
  ELR_DMD_COMPATIBLE_RECEIPT_WAITING_FOR_COMPLETE_EVIDENCE
  ELR_DMD_COMPATIBLE_RECEIPT_REPAIR_REQUIRED
r52_actual_execution_started_here: false
```

### ELR-OP18: downstream non-promotion manual decision hold

目的:

```text
complete candidateになっても、P5/P6/P8/R52/P7/releaseへ自動昇格しないことを固定する。
```

実装内容:

```text
- evidence complete branchでも downstream_manual_decision_required に止める。
- incomplete branchなら continue_or_retry / waiting に止める。
- repair branchなら stop_and_repair に止める。
- p5_final_allowed / p6_start_allowed / p8_start_allowed / release_allowedをfalse固定する。
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

### ELR-OP19: result memo / validation closure

目的:

```text
ELR-OP00〜OP19の実装結果をbody-free result memoとして閉じる。
```

実装内容:

```text
- target test summaryをbody-free count/statusで記録。
- selected regression summaryをbody-free count/statusで記録。
- compileall summaryをbody-free count/statusで記録。
- ALR-OP12 intake statusを記録。
- explicit allow / operation evidence / rows / purgeのstatusを記録。
- not executed / not claimed / unverified boundaryを記録。
- actual review未実行なら未実行と書く。
- actual review実行済みなら、body-free receiptを通った範囲だけを書く。
```

acceptance:

```text
result_memo_bodyfree_closed: true
raw_body_included: false
question_text_included: false
local_path_included: false
body_hash_included: false
terminal_output_body_included: false
release_allowed: false
```

---

## 9. operation state machine案

### 9.1 state refs

```text
ELR_STATE_ALR12_RETRY_OR_START_REQUIRED
ELR_STATE_WAITING_FOR_EXPLICIT_LOCAL_ONLY_ALLOW
ELR_STATE_EXPLICIT_LOCAL_ONLY_ALLOW_ACCEPTED
ELR_STATE_WAITING_FOR_PACKET_GENERATION_RECEIPT
ELR_STATE_PACKET_GENERATED_LOCAL_ONLY_BODYFREE_RECEIPT_ACCEPTED
ELR_STATE_PACKET_SCAN_PASSED_REVIEW_READY
ELR_STATE_REVIEWER_SELECTION_FORM_READY
ELR_STATE_REVIEW_OPERATION_NOT_STARTED
ELR_STATE_REVIEW_OPERATION_IN_PROGRESS_BODYFREE_TRACKED
ELR_STATE_REVIEW_OPERATION_PAUSED_BODYFREE_TRACKED
ELR_STATE_REVIEW_OPERATION_COMPLETED_RECEIPT_WAITING
ELR_STATE_OPERATION_RECEIPT_ACCEPTED_ROWS_WAITING
ELR_STATE_ROWS_ACCEPTED_RATING_WAITING
ELR_STATE_RATING_ROWS_NORMALIZED_QUESTION_NEED_WAITING
ELR_STATE_QUESTION_NEED_ROWS_NORMALIZED_PURGE_WAITING
ELR_STATE_PURGE_RECEIPT_ACCEPTED_FINAL_VALIDATION_WAITING
ELR_STATE_EVIDENCE_COMPLETE_CANDIDATE
ELR_STATE_DOWNSTREAM_MANUAL_DECISION_REQUIRED
ELR_STATE_REPAIR_REQUIRED
```

### 9.2 allowed transitions

```text
ALR12_RETRY_OR_START_REQUIRED
  -> WAITING_FOR_EXPLICIT_LOCAL_ONLY_ALLOW
  -> EXPLICIT_LOCAL_ONLY_ALLOW_ACCEPTED
  -> WAITING_FOR_PACKET_GENERATION_RECEIPT
  -> PACKET_GENERATED_LOCAL_ONLY_BODYFREE_RECEIPT_ACCEPTED
  -> PACKET_SCAN_PASSED_REVIEW_READY
  -> REVIEWER_SELECTION_FORM_READY
  -> REVIEW_OPERATION_NOT_STARTED
  -> REVIEW_OPERATION_IN_PROGRESS_BODYFREE_TRACKED
  -> REVIEW_OPERATION_PAUSED_BODYFREE_TRACKED
  -> REVIEW_OPERATION_IN_PROGRESS_BODYFREE_TRACKED
  -> REVIEW_OPERATION_COMPLETED_RECEIPT_WAITING
  -> OPERATION_RECEIPT_ACCEPTED_ROWS_WAITING
  -> ROWS_ACCEPTED_RATING_WAITING
  -> RATING_ROWS_NORMALIZED_QUESTION_NEED_WAITING
  -> QUESTION_NEED_ROWS_NORMALIZED_PURGE_WAITING
  -> PURGE_RECEIPT_ACCEPTED_FINAL_VALIDATION_WAITING
  -> EVIDENCE_COMPLETE_CANDIDATE
  -> DOWNSTREAM_MANUAL_DECISION_REQUIRED
```

### 9.3 forbidden transitions

```text
ALR12_RETRY_OR_START_REQUIRED -> P8_START
ALR12_RETRY_OR_START_REQUIRED -> R52_ACTUAL_EXECUTION
WAITING_FOR_EXPLICIT_LOCAL_ONLY_ALLOW -> BODY_FULL_PACKET_GENERATED_WITHOUT_ALLOW
WAITING_FOR_EXPLICIT_LOCAL_ONLY_ALLOW -> REVIEW_OPERATION_IN_PROGRESS
PACKET_REQUEST_READY -> BODY_FULL_PACKET_EXPORTED
REVIEW_OPERATION_IN_PROGRESS -> QUESTION_TEXT_CREATED
EVIDENCE_COMPLETE_CANDIDATE -> P5_FINAL
EVIDENCE_COMPLETE_CANDIDATE -> P6_START
EVIDENCE_COMPLETE_CANDIDATE -> P8_START
EVIDENCE_COMPLETE_CANDIDATE -> R52_ACTUAL_EXECUTION
EVIDENCE_COMPLETE_CANDIDATE -> P7_COMPLETE
EVIDENCE_COMPLETE_CANDIDATE -> RELEASE_ALLOWED
REPAIR_REQUIRED -> ACTUAL_REVIEW_EXECUTION
```

---

## 10. manual operation protocol案

ELR実装でhelperを作っても、actual reviewそのものは自動実行しません。  
実運用へ入る場合は、次のmanual operation protocolが必要です。

### 10.1 実行前

```text
1. explicit local-only allow receiptを作成する。
2. review_session_idを固定する。
3. reviewer person refを固定する。
4. 24-case manifestがbody-freeで揃っていることを確認する。
5. body-full packet generationのlocal-only許可範囲を確認する。
6. 成果物へbody-fullを残さないことを確認する。
```

### 10.2 実行中

```text
1. body-full packetはlocal-onlyでのみ開く。
2. reviewerは24ケースを実読する。
3. reviewerはselection-only formへ記録する。
4. free text / memo body / question text / draft question textは記録しない。
5. 問い必要性は本文ではなく分類refで記録する。
6. 中断・再開はstate refだけで記録する。
```

### 10.3 実行後

```text
1. actual operation receiptをbody-freeで作る。
2. sanitized review result rows 24件をbody-freeで作る。
3. rating rows 24件をbody-freeで作る。
4. question need observation rows 24件をbody-freeで作る。
5. disposal / purge receiptをbody-freeで作る。
6. final no-leak validationを通す。
7. DMD-compatible receipt candidateを作る。
8. downstream manual decision holdに止める。
```

### 10.4 manual operation中に残してはいけないもの

```text
raw input
comment_text body
returned Emlis body
history surface body
reviewer free text
reviewer notes body
question text
draft question text
answer text
local absolute path
body hash
terminal output body
body-full packet content
```

---

## 11. json / schema案

以下は設計書内の案です。実ファイル化は実装段階で判断します。

### 11.1 `post_alr12_elr_alr12_intake.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_alr12.elr.alr12_intake.bodyfree.v1",
  "title": "Post-ALR12 ELR ALR-OP12 Intake Body-Free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "phase",
    "scope",
    "operation_step_ref",
    "source_mode",
    "alr_op12_result_memo_ref",
    "selected_action_ref",
    "next_required_step",
    "retry_or_start_required",
    "p8_start_allowed",
    "release_allowed",
    "body_free",
    "body_free_markers"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_alr12.elr.alr12_intake.bodyfree.v1"
    },
    "phase": { "const": "P7" },
    "scope": { "const": "p7_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation" },
    "operation_step_ref": { "const": "ELR-OP01_ALR_OP12_result_memo_selected_action_intake" },
    "source_mode": { "const": "local_received_zip_only" },
    "alr_op12_result_memo_ref": { "type": "string", "maxLength": 240 },
    "selected_action_ref": {
      "enum": [
        "ALR_ACTION_CONTINUE_EXISTING_LOCAL_ONLY_REVIEW_ALLOWED",
        "ALR_ACTION_RETRY_OR_START_LOCAL_ONLY_REVIEW_REQUIRED",
        "ALR_ACTION_REPAIR_STOP_REQUIRED",
        "ALR_ACTION_COMPLETE_RECEIPT_DOWNSTREAM_MANUAL_DECISION_REQUIRED"
      ]
    },
    "next_required_step": { "type": "string", "maxLength": 260 },
    "retry_or_start_required": { "type": "boolean" },
    "p8_start_allowed": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true },
    "body_free_markers": { "$ref": "#/$defs/body_free_markers" }
  },
  "$defs": {
    "body_free_markers": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "raw_input_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "reviewer_note_body_included": { "const": false },
        "question_text_included": { "const": false },
        "draft_question_text_included": { "const": false },
        "local_path_included": { "const": false },
        "body_hash_included": { "const": false },
        "terminal_output_body_included": { "const": false }
      }
    }
  }
}
```

### 11.2 `post_alr12_elr_explicit_local_only_allow_receipt.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_alr12.elr.explicit_local_only_allow_receipt.bodyfree.v1",
  "title": "Post-ALR12 ELR Explicit Local-only Allow Receipt Body-Free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "allow_receipt_ref",
    "review_session_id",
    "allow_scope_ref",
    "allowed_case_count",
    "allow_body_full_packet_generation_local_only",
    "allow_actual_local_only_human_review",
    "allow_selection_only_recording",
    "allow_bodyfree_evidence_creation",
    "allow_disposal_purge_required",
    "external_export_allowed",
    "raw_body_persistence_allowed",
    "question_text_persistence_allowed",
    "local_path_persistence_allowed",
    "hash_persistence_allowed",
    "terminal_body_persistence_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_alr12.elr.explicit_local_only_allow_receipt.bodyfree.v1"
    },
    "allow_receipt_ref": { "type": "string", "maxLength": 220 },
    "review_session_id": { "type": "string", "maxLength": 220 },
    "allow_scope_ref": { "const": "explicit_local_only_allow_for_24_case_actual_review_start_retry_with_purge" },
    "allowed_case_count": { "const": 24 },
    "allow_body_full_packet_generation_local_only": { "const": true },
    "allow_actual_local_only_human_review": { "const": true },
    "allow_selection_only_recording": { "const": true },
    "allow_bodyfree_evidence_creation": { "const": true },
    "allow_disposal_purge_required": { "const": true },
    "external_export_allowed": { "const": false },
    "raw_body_persistence_allowed": { "const": false },
    "question_text_persistence_allowed": { "const": false },
    "local_path_persistence_allowed": { "const": false },
    "hash_persistence_allowed": { "const": false },
    "terminal_body_persistence_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 11.3 `post_alr12_elr_review_session_envelope.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_alr12.elr.review_session_envelope.bodyfree.v1",
  "title": "Post-ALR12 ELR Review Session Envelope Body-Free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "allow_receipt_ref",
    "operator_ref",
    "reviewer_person_ref",
    "reviewer_is_person_confirmed",
    "local_only_operation_confirmed",
    "expected_case_count",
    "reviewer_form_kind_ref",
    "external_export_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_alr12.elr.review_session_envelope.bodyfree.v1"
    },
    "review_session_id": { "type": "string", "maxLength": 220 },
    "allow_receipt_ref": { "type": "string", "maxLength": 220 },
    "operator_ref": { "type": "string", "maxLength": 180 },
    "reviewer_person_ref": { "type": "string", "maxLength": 180 },
    "reviewer_is_person_confirmed": { "const": true },
    "local_only_operation_confirmed": { "const": true },
    "expected_case_count": { "const": 24 },
    "reviewer_form_kind_ref": { "const": "selection_only_bodyfree_result_form" },
    "external_export_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 11.4 `post_alr12_elr_packet_generation_receipt.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_alr12.elr.packet_generation_receipt.bodyfree.v1",
  "title": "Post-ALR12 ELR Body-full Packet Generation Receipt Body-Free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "packet_generation_receipt_ref",
    "review_session_id",
    "packet_request_ref",
    "generated_local_only",
    "packet_case_count",
    "manifest_case_refs_match",
    "external_export_performed",
    "packet_body_included",
    "raw_input_included",
    "comment_text_body_included",
    "local_path_included",
    "body_hash_included",
    "terminal_output_body_included",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_alr12.elr.packet_generation_receipt.bodyfree.v1"
    },
    "packet_generation_receipt_ref": { "type": "string", "maxLength": 220 },
    "review_session_id": { "type": "string", "maxLength": 220 },
    "packet_request_ref": { "type": "string", "maxLength": 220 },
    "generated_local_only": { "const": true },
    "packet_case_count": { "const": 24 },
    "manifest_case_refs_match": { "const": true },
    "external_export_performed": { "const": false },
    "packet_body_included": { "const": false },
    "raw_input_included": { "const": false },
    "comment_text_body_included": { "const": false },
    "local_path_included": { "const": false },
    "body_hash_included": { "const": false },
    "terminal_output_body_included": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 11.5 `post_alr12_elr_actual_operation_receipt.bodyfree.schema.json` 案

このschemaは、ELR内部receiptとして使う案です。  
DMDへ戻すときは、11.10のDMD-compatible receiptへadapterします。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_alr12.elr.actual_operation_receipt.bodyfree.v1",
  "title": "Post-ALR12 ELR Actual Operation Receipt Body-Free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_receipt_ref",
    "review_session_id",
    "source_kind_ref",
    "created_from_real_operation",
    "actual_human_review_executed_by_person",
    "reviewer_person_ref",
    "reviewed_case_count",
    "selection_row_count",
    "local_only_operation_confirmed",
    "selection_only_form_used",
    "external_export_performed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_alr12.elr.actual_operation_receipt.bodyfree.v1"
    },
    "operation_receipt_ref": { "type": "string", "maxLength": 220 },
    "review_session_id": { "type": "string", "maxLength": 220 },
    "source_kind_ref": { "const": "actual_local_only_human_review_by_person" },
    "created_from_real_operation": { "const": true },
    "actual_human_review_executed_by_person": { "const": true },
    "reviewer_person_ref": { "type": "string", "maxLength": 180 },
    "reviewed_case_count": { "const": 24 },
    "selection_row_count": { "const": 24 },
    "local_only_operation_confirmed": { "const": true },
    "selection_only_form_used": { "const": true },
    "external_export_performed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 11.6 `post_alr12_elr_sanitized_review_result_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_alr12.elr.sanitized_review_result_row.bodyfree.v1",
  "title": "Post-ALR12 ELR Sanitized Review Result Row Body-Free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "operation_receipt_ref",
    "case_ref",
    "reviewer_person_ref",
    "source_kind_ref",
    "verdict_ref",
    "axis_score_refs",
    "sanitized_reason_id_refs",
    "readfeel_blocker_id_refs",
    "execution_blocker_id_refs",
    "question_need_primary_class_ref",
    "ambiguity_kind_refs",
    "one_question_fit_ref",
    "repair_required_refs",
    "selection_only",
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
      "const": "cocolon.emlis.p7_r54.ahr.post_alr12.elr.sanitized_review_result_row.bodyfree.v1"
    },
    "review_session_id": { "type": "string", "maxLength": 220 },
    "operation_receipt_ref": { "type": "string", "maxLength": 220 },
    "case_ref": { "type": "string", "maxLength": 180 },
    "reviewer_person_ref": { "type": "string", "maxLength": 180 },
    "source_kind_ref": { "const": "actual_local_only_human_review_by_person" },
    "verdict_ref": {
      "enum": ["PASS", "YELLOW", "REPAIR_REQUIRED", "RED", "BLOCKED", "NOT_REVIEWABLE"]
    },
    "axis_score_refs": { "type": "object" },
    "sanitized_reason_id_refs": { "type": "array", "items": { "type": "string", "maxLength": 160 } },
    "readfeel_blocker_id_refs": { "type": "array", "items": { "type": "string", "maxLength": 160 } },
    "execution_blocker_id_refs": { "type": "array", "items": { "type": "string", "maxLength": 160 } },
    "question_need_primary_class_ref": { "type": "string", "maxLength": 180 },
    "ambiguity_kind_refs": { "type": "array", "items": { "type": "string", "maxLength": 160 } },
    "one_question_fit_ref": { "type": "string", "maxLength": 180 },
    "repair_required_refs": { "type": "array", "items": { "type": "string", "maxLength": 160 } },
    "selection_only": { "const": true },
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

### 11.7 `post_alr12_elr_rating_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_alr12.elr.rating_row.bodyfree.v1",
  "title": "Post-ALR12 ELR Rating Row Body-Free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "rating_row_ref",
    "source_sanitized_review_result_row_ref",
    "review_session_id",
    "case_ref",
    "verdict_ref",
    "axis_score_refs",
    "below_target_axis_refs",
    "readfeel_blocker_id_refs",
    "execution_blocker_id_refs",
    "repair_required_refs",
    "actual_rating_row_from_real_operation",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_alr12.elr.rating_row.bodyfree.v1"
    },
    "rating_row_ref": { "type": "string", "maxLength": 220 },
    "source_sanitized_review_result_row_ref": { "type": "string", "maxLength": 220 },
    "review_session_id": { "type": "string", "maxLength": 220 },
    "case_ref": { "type": "string", "maxLength": 180 },
    "verdict_ref": {
      "enum": ["PASS", "YELLOW", "REPAIR_REQUIRED", "RED", "BLOCKED", "NOT_REVIEWABLE"]
    },
    "axis_score_refs": { "type": "object" },
    "below_target_axis_refs": { "type": "array", "items": { "type": "string", "maxLength": 160 } },
    "readfeel_blocker_id_refs": { "type": "array", "items": { "type": "string", "maxLength": 160 } },
    "execution_blocker_id_refs": { "type": "array", "items": { "type": "string", "maxLength": 160 } },
    "repair_required_refs": { "type": "array", "items": { "type": "string", "maxLength": 160 } },
    "actual_rating_row_from_real_operation": { "const": true },
    "body_free": { "const": true }
  }
}
```

### 11.8 `post_alr12_elr_question_need_observation_row.bodyfree.schema.json` 案

既存AHR09 option refsを前提にする案です。  
このrowはP8質問仕様ではありません。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_alr12.elr.question_need_observation_row.bodyfree.v1",
  "title": "Post-ALR12 ELR Question Need Observation Row Body-Free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "question_need_observation_row_ref",
    "review_session_id",
    "case_ref",
    "source_rating_row_ref",
    "question_need_primary_class_ref",
    "ambiguity_kind_refs",
    "one_question_fit_ref",
    "repair_required_refs",
    "plan_candidate_flag_refs",
    "question_text_included",
    "draft_question_text_included",
    "answer_text_included",
    "reviewer_free_text_included",
    "raw_input_included",
    "comment_text_body_included",
    "returned_surface_body_included",
    "p8_question_spec_created",
    "p8_start_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_alr12.elr.question_need_observation_row.bodyfree.v1"
    },
    "question_need_observation_row_ref": { "type": "string", "maxLength": 220 },
    "review_session_id": { "type": "string", "maxLength": 220 },
    "case_ref": { "type": "string", "maxLength": 180 },
    "source_rating_row_ref": { "type": "string", "maxLength": 220 },
    "question_need_primary_class_ref": {
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
    "ambiguity_kind_refs": { "type": "array", "items": { "type": "string", "maxLength": 160 } },
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
    "repair_required_refs": { "type": "array", "items": { "type": "string", "maxLength": 160 } },
    "plan_candidate_flag_refs": { "type": "array", "items": { "type": "string", "maxLength": 160 } },
    "question_text_included": { "const": false },
    "draft_question_text_included": { "const": false },
    "answer_text_included": { "const": false },
    "reviewer_free_text_included": { "const": false },
    "raw_input_included": { "const": false },
    "comment_text_body_included": { "const": false },
    "returned_surface_body_included": { "const": false },
    "p8_question_spec_created": { "const": false },
    "p8_start_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 11.9 `post_alr12_elr_disposal_purge_receipt.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_alr12.elr.disposal_purge_receipt.bodyfree.v1",
  "title": "Post-ALR12 ELR Disposal Purge Receipt Body-Free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "disposal_purge_receipt_ref",
    "review_session_id",
    "purge_scope_ref",
    "body_full_packet_retained",
    "raw_input_retained",
    "comment_text_body_retained",
    "reviewer_note_body_retained",
    "question_text_retained",
    "draft_question_text_retained",
    "answer_text_retained",
    "local_path_included",
    "hash_included",
    "terminal_output_body_included",
    "disposal_purge_receipt_accepted",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_alr12.elr.disposal_purge_receipt.bodyfree.v1"
    },
    "disposal_purge_receipt_ref": { "type": "string", "maxLength": 220 },
    "review_session_id": { "type": "string", "maxLength": 220 },
    "purge_scope_ref": { "const": "post_alr12_elr_bodyfull_local_temp_materials_purged_bodyfree_ref" },
    "body_full_packet_retained": { "const": false },
    "raw_input_retained": { "const": false },
    "comment_text_body_retained": { "const": false },
    "reviewer_note_body_retained": { "const": false },
    "question_text_retained": { "const": false },
    "draft_question_text_retained": { "const": false },
    "answer_text_retained": { "const": false },
    "local_path_included": { "const": false },
    "hash_included": { "const": false },
    "terminal_output_body_included": { "const": false },
    "disposal_purge_receipt_accepted": { "const": true },
    "body_free": { "const": true }
  }
}
```

### 11.10 DMD-compatible `actual_operation_evidence_receipt.bodyfree.optional.v1` adapter案

DMD-OP02/OP03へ再投入する場合は、DMD helperが期待しているschemaに合わせます。

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

### 11.11 `post_alr12_elr_evidence_bundle.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_alr12.elr.evidence_bundle.bodyfree.v1",
  "title": "Post-ALR12 ELR Evidence Bundle Body-Free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "allow_receipt_status_ref",
    "packet_generation_receipt_status_ref",
    "actual_operation_receipt_status_ref",
    "sanitized_review_result_row_count",
    "rating_row_count",
    "question_need_observation_row_count",
    "disposal_purge_receipt_status_ref",
    "final_validation_status_ref",
    "actual_review_evidence_complete",
    "dmd_compatible_receipt_ready",
    "p8_start_allowed",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_alr12.elr.evidence_bundle.bodyfree.v1"
    },
    "review_session_id": { "type": "string", "maxLength": 220 },
    "allow_receipt_status_ref": { "type": "string", "maxLength": 180 },
    "packet_generation_receipt_status_ref": { "type": "string", "maxLength": 180 },
    "actual_operation_receipt_status_ref": { "type": "string", "maxLength": 180 },
    "sanitized_review_result_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "rating_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "question_need_observation_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "disposal_purge_receipt_status_ref": { "type": "string", "maxLength": 180 },
    "final_validation_status_ref": { "type": "string", "maxLength": 180 },
    "actual_review_evidence_complete": { "type": "boolean" },
    "dmd_compatible_receipt_ready": { "type": "boolean" },
    "p8_start_allowed": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

---

## 12. test設計

### 12.1 target test候補

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_elr_op00_op02_20260703.py \
  tests/test_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_elr_op03_op05_20260703.py \
  tests/test_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_elr_op06_op08_20260703.py \
  tests/test_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_elr_op09_op11_20260703.py \
  tests/test_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_elr_op12_op14_20260703.py \
  tests/test_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_elr_op15_op17_20260703.py \
  tests/test_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_elr_op18_op19_result_20260703.py
```

### 12.2 selected regression候補

ALR regression:

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op00_op01_20260703.py \
  tests/test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op02_op03_20260703.py \
  tests/test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op04_op05_20260703.py \
  tests/test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op06_op07_20260703.py \
  tests/test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op08_op09_20260703.py \
  tests/test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op10_op11_20260703.py \
  tests/test_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_alr_op12_result_20260703.py
```

DMD regression:

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op00_op01_20260703.py \
  tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op02_op03_20260703.py \
  tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op04_op05_20260703.py \
  tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op06_op07_20260703.py \
  tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op08_result_20260703.py
```

selected PMN / DMH / MN regression:

```bash
PYTHONPATH=services/ai_inference pytest -q --assert=plain \
  tests/test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op16_op17_20260702.py \
  tests/test_r54_ahr_post_pmn23_downstream_manual_decision_hold_evidence_intake_dmh_op18_20260702.py \
  tests/test_r54_ahr_post_mn11_actual_local_only_human_review_operation_pmn_op22_op23_contract_20260630.py
```

compileall:

```bash
python -m compileall -q services/ai_inference
```

### 12.3 必須test case

```text
1. ELR-OP00でAPI / DB / RN / runtime / response keyが変更不可として固定される。
2. ELR-OP01でALR-OP12 selected_action_refがretry/startの場合だけexplicit allowへ進む。
3. ALR-OP12 greenをactual review completeへ昇格しない。
4. explicit allow receipt missingならbody-full packet generationへ進まない。
5. explicit allow receiptにbody/path/hash/terminal outputが混入したらrepair_requiredになる。
6. allow acceptedでもhelper自身はbody-full packetを生成しない。
7. packet generation receipt missingならreview readyにならない。
8. packet receiptが24件未満ならreview readyにならない。
9. reviewer person未確認ならselection form readyにならない。
10. selection-only以外のformはrepair_requiredになる。
11. actual operation receipt missingならrows intakeへ進まない。
12. source_kind_refがfixture/helper/synthetic/historical_reuse_onlyならactual receipt rejectedになる。
13. sanitized rowsが24件でなければacceptedにならない。
14. rating rowsが24件でなければnormalizedにならない。
15. question need observation rowsが24件でなければnormalizedにならない。
16. question text / draft question text / answer text / reviewer free textが混入したらrepair_requiredになる。
17. purge receipt missingならactual_review_evidence_completeにならない。
18. final no-leak validationがfailならactual_review_evidence_completeにならない。
19. complete candidateでもP5/P6/P8/R52/P7/release flagsはfalseのまま。
20. DMD-compatible receipt adapterはDMD schema_versionとrequired true/count fieldsに一致する。
21. result memoはbody-free summaryだけを記録する。
```

### 12.4 このtestで主張しないこと

```text
- actual human reviewを実行した。
- body-full packetを生成した。
- real rowsを作った。
- purgeを実行した。
- full backend suite green。
- RN contract green。
- RN real-device modal verified。
- P8質問設計開始許可。
- release許可。
```

---

## 13. result memo設計

候補result memo:

```text
R54_AHR_PostALR12_ExplicitLocalOnlyReviewStartRetryOperation_ELR_OP00_OP19_Result_20260703.md
```

記載セクション案:

```text
# R54-AHR Post-ALR12 Explicit Local-only Review Start/Retry Operation ELR-OP00〜OP19 Result

created_at
source_mode
github_connection_check
body_free_result_memo
implementation_scope
changed_files
elr_op19_status
alr_op12_intake_status
explicit_local_only_allow_status
review_session_status
packet_generation_receipt_status
packet_scan_status
reviewer_form_status
actual_operation_receipt_status
sanitized_review_result_rows_status
rating_rows_status
question_need_observation_rows_status
disposal_purge_receipt_status
final_validation_status
actual_review_evidence_complete_status
dmd_compatible_receipt_adapter_status
downstream_non_promotion_hold_status
target_tests
selected_regression
not_claimed_boundary
not_executed_boundary
unverified_boundary
next_required_step
```

current defaultで、まだactual reviewを実行していない実装結果なら、次のように書くべきです。

```text
actual_body_full_packet_generation: false
actual_local_human_review_execution: false
actual_operation_receipt_creation: false
actual_rows_creation: false
actual_disposal_purge_execution: false
explicit_local_only_allow_receipt_created_here: false
actual_review_evidence_complete: false
next_required_step: create_explicit_local_only_allow_receipt_before_actual_review_operation
```

実レビューまで実行した別作業の後に閉じる場合だけ、receipt/rows/purgeのaccepted statusをbody-freeで記録します。  
その場合でも、P5/P6/P8/R52/P7/releaseは自動許可しません。

---

## 14. fail-closed条件

次の場合は、必ずrepair / waiting / manual holdに止めます。

```text
- ALR-OP12 result memo missing。
- ALR-OP12 selected_action_refが不明またはcontract invalid。
- selected_action_refがrepair_stop_required。
- explicit local-only allow receipt missing。
- explicit local-only allow receipt invalid。
- allow scopeが24-case local-only review / selection-only / purgeを含まない。
- body-full packet receipt missing。
- packet countが24ではない。
- packet receiptにbody/path/hash/terminal outputが含まれる。
- reviewer person ref missing。
- reviewer_is_person_confirmedがtrueではない。
- selection-only formではない。
- actual operation receipt missing。
- source_kind_refがactual_local_only_human_review_by_personではない。
- reviewed_case_count / selection_row_countが24ではない。
- sanitized review result rowsが24件ではない。
- rating rowsが24件ではない。
- question need observation rowsが24件ではない。
- question text / draft question text / answer textが混入している。
- reviewer free textが混入している。
- disposal / purge receipt missing。
- purge acceptedではない。
- final no-leak validation failed。
- no-touch contract violation。
- P8 / R52 / P5 / P6 / P7 / release promotion claimがある。
```

---

## 15. acceptance criteria

本設計を実装へ渡せる条件:

```text
- Post-ALR12 ELRの責務がALRと分離されている。
- 実装順ELR-OP00〜OP19が定義されている。
- ALR-OP12 intakeからexplicit local-only allowへ進む条件が定義されている。
- explicit allow receipt missing時にoperationを開始しない設計になっている。
- body-full packet generationをhelperが勝手に実行しない設計になっている。
- actual review実行済みclaimに必要なreceipt / rows / purge / validation条件が定義されている。
- sanitized rows / rating rows / question need rowsの24件条件が定義されている。
- question need observationがP8質問仕様へ昇格しない設計になっている。
- disposal / purge receiptがcomplete条件に含まれている。
- DMD-compatible receipt adapterのschema互換が定義されている。
- complete candidateでもP5/P6/P8/R52/P7/releaseへ自動昇格しない。
- json / schema案は本書内案であり、実ファイル化は実装段階判断と明記されている。
```

実装完了の候補条件:

```text
- ELR-OP00〜OP19 target testsがgreen。
- ALR-OP00〜OP12 selected regressionがgreen。
- DMD-OP00〜OP08 selected regressionがgreen。
- selected PMN / DMH / MN regressionがgreen。
- compileall services/ai_inference passed。
- result memoがbody-freeで閉じている。
```

ただし、これだけではactual review実行済みとは主張しません。  
actual review実行済みは、actual operation receipt / rows / purge receiptがbody-freeでacceptedになった場合だけです。

---

## 16. 実装時の注意

### 16.1 既存option refsの再利用

question needやratingのoption refsは、既存AHR09/CR10/CR11系を第一候補として再利用します。

既存で確認したoption例:

```text
verdict:
  PASS
  YELLOW
  REPAIR_REQUIRED
  RED
  BLOCKED
  NOT_REVIEWABLE

question_need_primary_class:
  no_question_needed_emlis_can_observe
  question_may_reduce_overread_risk
  question_would_make_immediate_observation_heavy
  not_question_emlis_readfeel_repair_required
  not_question_p5_surface_repair_required
  not_question_gate_boundary_required
  plus_single_question_candidate_later
  premium_deep_dive_candidate_later
  insufficient_material_execution_blocker

one_question_fit:
  not_needed
  fits_one_question
  needs_more_than_one_question_not_p7
  would_delay_immediate_observation
  unsafe_or_boundary_not_question
  repair_required_not_question
  insufficient_material
```

新しいenumを増やす前に、既存optionで足りるかを確認します。

### 16.2 DMD互換を壊さない

DMD helperは、actual_operation_evidence_receiptとして次を期待しています。

```text
schema_version: cocolon.emlis.p7_r54.ahr.post_dmh18.actual_operation_evidence_receipt.bodyfree.optional.v1
source_kind_ref: actual_local_only_human_review_by_person
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
```

ELR内部schemaを作る場合でも、DMD-compatible adapterを必ず持たせます。

### 16.3 実レビューを始めたかどうかを曖昧にしない

実装結果memoでは、次を必ず分けます。

```text
- helper implemented
- target tests green
- explicit allow receipt accepted
- body-full packet generation receipt accepted
- actual local-only human review executed
- actual operation receipt accepted
- actual rows accepted
- purge accepted
- DMD-compatible receipt ready
```

この区分を混ぜると、また「helper greenだがactual review未完了」の状態になります。

---

## 17. Cocolon思想との接続

この設計は、ユーザーへ質問を返す機能を早く作るためのものではありません。  
むしろ、質問へ逃げる前に、Cocolon / EmlisAIがユーザーの言葉をどこまで読めているかを確認するための設計です。

Cocolonが目指しているのは、次です。

```text
- ユーザーが残した言葉が、ただ保存されるだけで終わらない。
- 入力直後に、自分の状態や言葉の箱詰めが「読まれた形」で返る。
- 毎回説明し直さなくても、記録が意味を持って戻ってくる。
- もう一度Cocolonへ残したいと思える。
```

そのためには、Emlis本体で読むべき不足と、問いで補助し得る曖昧さを分けなければいけません。  
ELRは、その分離のために実ケースを読みに行く入口です。

---

## 18. 華恋の意見

華恋の意見として、次の実装段階では、**ELR-OP00〜OP19の全てを一度に「actual review complete」へ持っていく実装を目標にしない方が安全**です。

理由は、今回の段階で危険なのは、helper不足よりも「実レビューしたことに見えてしまう証跡」を作ることだからです。

実装順としては、まず次を小さく閉じるのがよいと思います。

```text
第一実装単位:
  ELR-OP00〜OP04
  ALR-OP12 intake / explicit allow receipt gate / session envelope / manifest boundary

第二実装単位:
  ELR-OP05〜OP08
  packet generation receipt / packet scan / reviewer form / operation lifecycle waiting state

第三実装単位:
  ELR-OP09〜OP14
  actual receipt / rows / rating / question need / purge intake guard

第四実装単位:
  ELR-OP15〜OP19
  final validation / evidence complete predicate / DMD-compatible adapter / manual hold / result memo
```

ただし、第一実装単位だけで止める場合でも、result memoには必ず次を明記するべきです。

```text
actual_body_full_packet_generation: false
actual_local_human_review_execution: false
actual_rows_creation: false
actual_disposal_purge_execution: false
```

Cocolonとして一番避けたいのは、P8質問設計へ早く進むことではなく、**読んでいないものを読んだことにすること**です。  
ここは慎重でよいです。ただし、慎重さを理由に、またhelperだけを増やして実ケースを読まない状態に戻るのも違います。

華恋としては、ELRは「安全に止めるための層」ではなく、**安全に読みに行くための層**として実装するのが正しいと思います。

---

## 19. 確認済み

```text
- 今回の指示は、検討メモを基に実装順を含めた詳細設計書をmdで作ること。
- json / schema案は必要なら設計書内に入れること。
- 実ファイル化は実装段階で判断すること。
- GitHub接続確認は今回不要。
- Cocolon_前提資料と作業姿勢ルールを確認した。
- EmlisAI是正方針を確認した。
- P7/P8 Bridge追記済みロードマップを確認した。
- ALR-OP12 result memoを確認した。
- ALR-OP12 current default selected actionは ALR_ACTION_RETRY_OR_START_LOCAL_ONLY_REVIEW_REQUIRED。
- ALR-OP12 current default next required stepは start_or_retry_actual_local_only_human_review_operation_with_explicit_local_only_allow。
- ALR-OP12はactual body-full packet generation / actual local human review / actual rows / purgeを実行していない。
- DMD-compatible actual_operation_evidence_receipt schema_versionは cocolon.emlis.p7_r54.ahr.post_dmh18.actual_operation_evidence_receipt.bodyfree.optional.v1。
- DMD-compatible source_kind_refは actual_local_only_human_review_by_person。
- P8開始はまだ許可されていない。
```

---

## 20. 未確認

```text
- full backend suite green。
- RN contract green。
- RN real-device modal verified。
- explicit local-only allow receipt creation。
- actual body-full packet generation。
- actual body-full packet generation receipt creation。
- actual local-only human review execution。
- actual operation receipt creation。
- actual sanitized review result rows creation。
- actual rating rows creation。
- actual question need observation rows creation。
- disposal / purge execution。
- DMD再投入。
- PostCR22 actual re-entry。
- R52 actual execution。
- P5 finalization。
- P6 limited human readfeel start。
- P8 start。
- P8 question design / implementation。
- P7 complete。
- release decision。
```

---

## 21. 書かれていない

```text
- ALR-OP12がgreenならP8へ進んでよい、とは書かれていない。
- retry_or_start_requiredをactual review開始済みとして扱ってよい、とは書かれていない。
- explicit local-only allow requiredをallow grantedとして扱ってよい、とは書かれていない。
- body-full packet request envelopeをbody-full packet生成済みとして扱ってよい、とは書かれていない。
- expected schema guardをactual receipt / rows / purge作成済みとして扱ってよい、とは書かれていない。
- question need observation rowsをP8質問仕様として扱ってよい、とは書かれていない。
- actual_review_evidence_complete candidateからP5/P6/P8/R52/P7/releaseへ自動昇格してよい、とは書かれていない。
```

---

## 22. 推測禁止

```text
- target greenを商品読感合格へ変換しない。
- helper greenをactual review completeへ変換しない。
- allow requiredをallow grantedへ変換しない。
- packet requestをpacket generatedへ変換しない。
- schema guard readyをactual evidence readyへ変換しない。
- question need observationをquestion textへ変換しない。
- P8開始条件を現状の都合で緩めない。
- 未実行のbody-full packet generation / review / rows / purgeを実行済みとして書かない。
```

---

## 23. 次に実行すべきこと

実装へ進む場合は、次の順番を推奨します。

```text
1. Post-ALR12専用helperを追加するか、既存ALR helper内に最小adapterを追加するかを実装前に最終判断する。
2. 第一候補として、Post-ALR12専用helperを追加する。
3. ELR-OP00〜OP04を第一実装単位として作る。
4. target testsを同時に作り、ALR-OP12 intake / explicit allow missing / no-promotion / no-touchを確認する。
5. ALR-OP00〜OP12 regression、DMD regression、selected PMN/DMH/MN regression、compileallを確認する。
6. result memoをbody-freeで作る。
7. actual review未実行なら、未実行と明記して次required stepを explicit local-only allow receipt creation に置く。
```

実レビュー運用へ入る場合は、設計・実装・manual operation・evidence intake・downstream decisionを混ぜず、別の作業単位として扱います。

---

## 24. 最終判断

最終判断:

```text
次に作る設計・実装対象は、P7-R54-AHR Post-ALR12 Explicit Local-only Review Start/Retry Operation。
実装prefix案はELR-OP00〜OP19。
P8質問設計ではない。
R52 actual executionでもない。
release判断でもない。
```

理由:

```text
ALR-OP12は、retry_or_start_required と explicit local-only allow required を閉じた。
しかし、actual review execution / actual rows / question need observation rows / purgeは未実行。
P8質問設計の根拠になる実ケース観察メモも、actual review由来ではまだ揃っていない。
```

Cocolonとしての意味:

```text
質問を作る前に、まずEmlisAIがユーザーの言葉をどこまで読めているかを、実ケースで確認する。
そのために、body-fullをlocal-onlyで扱い、成果物はbody-freeに閉じ、purgeまで含めて安全にactual reviewへ入る。
```

華恋の意見:

```text
ELRは、止めるための安全helperではなく、安全に読みに行くための入口として作るべきです。
ここで実レビューを偽装せず、でもP8へ逃げず、実ケース読感のbody-free証跡へ進めることが、Cocolonとして一番まっすぐだと思います。
```
