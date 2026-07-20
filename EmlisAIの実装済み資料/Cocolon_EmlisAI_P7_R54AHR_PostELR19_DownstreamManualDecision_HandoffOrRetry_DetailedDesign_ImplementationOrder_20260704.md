---
title: "Cocolon / EmlisAI P7-R54-AHR Post-ELR19 Downstream Manual Decision Handoff-or-Retry 詳細設計書・実装順"
created_at: "2026-07-04 JST"
author: "華恋"
work_mode: "共鳴構造モード"
work_type: "詳細設計書 / 実装順 / json・schema案内包"
source_mode: "local_received_zip_only"
github_connection_check: "not_required_by_mash_instruction / not_performed"
base_pre_design_memo: "Cocolon_EmlisAI_P7_R54AHR_PostELR19_DownstreamManualDecision_HandoffOrRetry_PreDesignMemo_20260704.md"
selected_design_target: "P7-R54-AHR Post-ELR19 Downstream Manual Decision Handoff-or-Retry"
recommended_boundary_prefix: "DHR-OP00〜DHR-OP09"
recommended_helper_shape: "thin_post_elr19_preflight_adapter_not_large_new_dmd"
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
---

# Cocolon / EmlisAI P7-R54-AHR Post-ELR19 Downstream Manual Decision Handoff-or-Retry 詳細設計書・実装順

対象: Cocolon / EmlisAI / P7 Product Quality Runner / R54-AHR / Post-ELR19 / downstream manual decision handoff-or-retry  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
実装扱い: 本書は設計書です。コード変更・json/schema実ファイル化・actual review実行・DMD実行・R52実行・P5/P6/P8/P7/release昇格は行いません。  
json / schema実ファイル化: なし。本書内の案のみ。実ファイル化は実装段階で、既存helper・既存schema配置・既存Guard・既存test結果を確認して判断します。  
GitHub接続確認: Mash指定により不要。ローカル受領zip基準。  

---

## 0. 結論

次に設計する対象は、P8 question design ではありません。  
次に設計する対象は、次です。

```text
P7-R54-AHR Post-ELR19
Downstream Manual Decision Handoff-or-Retry
```

本設計で作るべきものは、新しい大きなDMDではありません。  
本設計で作るべきものは、**ELR-OP19で閉じられたbody-free closureと、ELR-OP17のDMD-compatible receipt candidateを、既存DMDへ渡せるのか、retry/startへ戻すのか、repairするのか、manual holdのまま止めるのかを判定する薄いDHR境界**です。

ここでの DHR は、次の意味で使います。

```text
DHR = Downstream Handoff-or-Retry
```

推奨する実装単位は次です。

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py
```

step prefix案:

```text
DHR-OP00〜DHR-OP09
```

ただし、実装段階で既存DMDへ最小改修だけで接続できると確認できる場合は、新規helperをさらに薄くしてよいです。  
逆に、既存DMDをそのまま呼ぶだけでは、ELR-OP19後の事実境界を守れない場合は、DHR helperを小さく追加します。

本書の実装判断は次です。

```text
- 既存DMDを再発明しない。
- ELR-OP17のreceipt candidateだけでdownstream実行済みにしない。
- shape-validなDMD receiptを、actual review実行の事実として扱わない。
- DMD direct call / DMD handoff plan / retry-start / repair / hold をbody-freeで分岐する。
- どの分岐でも自動昇格しない。
```

現時点で確認済みの資料・検討メモを基準にした expected default branch は次です。

```text
DHR_BRANCH_RETRY_OR_START_REQUIRED_BEFORE_DOWNSTREAM_HANDOFF
```

理由は、ELR-OP19 closure と DMD-compatible receipt candidate は存在しても、今回確認済みの範囲では、actual body-full packet generation、actual local-only human review execution、actual operation receipt実作成、actual rows実作成、actual disposal / purge実実行が未確認であり、helper green / result memo greenを actual review complete と読めないためです。

ただし、実装後に、外部のbody-free actual evidence receiptが本当に local-only human review by person 由来として提示され、DHR-OP04〜OP06を通過する場合だけ、次の branch を materialize できます。

```text
DHR_BRANCH_DMD_HANDOFF_READY_MANUAL_DECISION_REQUIRED_NO_AUTO_EXECUTION
```

この場合でも、DHRはDMDを自動実行しません。  
DHRが作るのは、手動判断に渡すための body-free handoff plan までです。

---

## 1. なぜこの設計を行うのか

Cocolon / EmlisAIの目的は、helper greenを増やすことではありません。  
Cocolonが目指しているのは、ユーザーが置いた言葉を、テンプレ共感・短縮要約・診断ラベル・固定分類で処理済みにせず、「読まれた」と感じられる形へ近づけることです。

P7の目的は、EmlisAIが実ケースで本当に読めているかを確認することです。  
P7/P8 Bridgeで question need observation を残すことは許されていますが、それはP8質問仕様の開始ではありません。  
質問は、EmlisAI本体の読めていなさを覆うための逃げ道にしてはいけません。

ELR-OP19は、ALR-OP12後の explicit local-only review start/retry 境界を、DMD-compatible receipt candidate と downstream manual decision hold まで body-free で閉じました。  
しかし、ELR-OP19 closure は次を意味しません。

```text
- actual reviewが実行された。
- actual rowsが作られた。
- purgeが実行された。
- DMDが再実行された。
- R52へ進んだ。
- P5/P6/P8/P7/releaseへ進める。
```

そのため、ELR-OP19後に必要なのは、P8 question design ではなく、**downstream handoff と retry/start の境界を、もう一度 body-free / no-promotion で切り分けること**です。

この設計は、作業を遅らせるためではありません。  
「読めたかもしれない」を「読めた」にしないためです。  
Cocolonとして在るべき姿は、未確認の実レビューを成果扱いしないこと、そして必要なら実レビューへ戻すことです。

---

## 2. 参照資料・確認範囲

### 2.1 受領ローカル資料

今回の基準は、ローカル受領zipと、アップロードされた検討メモです。GitHub接続確認は行いません。

```text
/mnt/data/Cocolon_前提資料(282).zip
/mnt/data/EmlisAIの実装済み資料(94).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(13).zip
/mnt/data/Cocolon(267).zip
/mnt/data/mashos-api(180).zip
/mnt/data/Cocolon_EmlisAI_P7_R54AHR_PostELR19_DownstreamManualDecision_HandoffOrRetry_PreDesignMemo_20260704.md
```

### 2.2 必読前提・作業姿勢

本設計では、次を確認対象として扱います。

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
- helper greenをactual evidenceへ読み替えない。
- 見ていないactual reviewを存在するものとして扱わない。
- Mashが見えにくい場所ほど、body-free / no-touch / no-promotionを厳格にする。
- 指示されていないAPI / DB / RN / runtime / response key / P8 / release導線を追加しない。
```

### 2.3 ロードマップ

```text
Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md
```

本設計で固定する読み方:

```text
- 現在はP7 Product Quality Runner / Long-run Product Gateの途中である。
- P7/P8 Bridgeで扱うquestion need observationは、P8実装ではない。
- P8 question design / implementationへは進まない。
- P7の実ケース確認不足をP8質問で補った扱いにしない。
```

### 2.4 実装済み資料・既存helper

主に確認対象にする資料と実ファイル:

```text
EmlisAIの実装済み資料/
  Cocolon_EmlisAI_P7_R54AHR_PostDMH18_DownstreamManualDecision_ActualEvidenceStatusTriage_DetailedDesign_ImplementationOrder_20260703.md
  Cocolon_EmlisAI_P7_R54AHR_PostDMD08_ContinueRetryActualLocalOnlyHumanReviewOperation_DetailedDesign_ImplementationOrder_20260703.md
  Cocolon_EmlisAI_P7_R54AHR_PostALR12_ExplicitLocalOnlyReviewStartRetry_DetailedDesign_ImplementationOrder_20260703.md

mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_dmh18_downstream_manual_decision_triage_20260703.py
  emlis_ai_p7_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_20260703.py
  emlis_ai_p7_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_20260703.py

mashos-api/ai/tests/
  R54_AHR_PostALR12_ExplicitLocalOnlyReviewStartRetryOperation_ELR_OP00_OP19_Result_20260704.md
  test_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_elr_op16_op17_20260703.py
  test_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_elr_op18_op19_20260703.py
  test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op00_op01_20260703.py
  ... DMD OP02〜OP08 tests
```

---

## 3. 現在地の整理

### 3.1 ELR-OP19後の状態

現在の明示holdは次です。

```text
current_hold_after_elr_op19:
  downstream_non_promotion_manual_decision_required

current_default_next_required_step:
  decide_downstream_manual_handoff_or_retry_without_auto_promotion
```

ELR-OP19は、result memo validation closureをbody-freeで閉じます。  
ELR-OP18は、downstream non-promotion manual decision holdを置きます。  
ELR-OP17は、DMD-compatible actual_operation_evidence_receipt candidateを作ります。

ただし、ELR-OP17〜OP19は次をしません。

```text
- DMD再実行
- R52 actual execution
- P5 finalization
- P6 start
- P8 start
- P7 complete
- release decision
```

### 3.2 ELR-OP17 receipt candidate の意味

ELR-OP17のDMD-compatible receipt candidateは、DMD側の actual_operation_evidence_receipt schema に近い body-free shape です。

必要な主な内容:

```text
schema_version:
  cocolon.emlis.p7_r54.ahr.post_dmh18.actual_operation_evidence_receipt.bodyfree.optional.v1
source_kind_ref:
  actual_local_only_human_review_by_person
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
```

ただし、ここで重要なのは、**shapeとしてDMD-compatibleであることと、今回の作業でactual review実行が確認されたことは別**という点です。

DHRは、この差を潰してはいけません。  
`created_from_real_operation: true` を含むcandidateがあっても、それを helper が作った body-free candidate としてしか確認できない場合、DHRは downstreamへ手渡しする前に、actual evidence source claim を分離します。

### 3.3 既存DMDとの直接互換性

既存DMDは、Post-DMH18 downstream manual decision / actual evidence status triage として実装済みです。  
DMD-OP00〜OP08は、次を担当します。

```text
- scope / no-touch / no-promotion refreeze
- DMH-OP18 finalizer intake
- candidate vs real-operation evidence claim separation
- actual evidence receipt completeness inventory
- body-free leak / invalid source scan
- downstream promotion claim scan
- deterministic branch resolver
- manual decision materialization
- body-free result memo / target tests / regression closure
```

ただし、既存DMDのOP01は、DMH-OP18 finalizer contractを前提にしています。  
ELR-OP18 / ELR-OP19は、意味は近いものの、DMH-OP18 finalizerそのものではありません。  
そのため、**ELR-OP19を既存DMDへ直接渡すだけでは、DMD OP01の前提とずれる可能性があります**。

このため、本設計では次を採用します。

```text
- 既存DMDを大きく作り直さない。
- ELR-OP19から既存DMDへ直結できると決め打ちしない。
- DHRで、ELR closure / ELR manual hold / ELR receipt candidate / actual source claim をpreflightする。
- 実装段階で必要なら、DMD側に alternate post_elr19 intake を最小追加する。
- DMH-OP18 finalizerを偽装生成しない。
```

華恋の判断では、ここが一番大事です。  
DMD-compatible receipt candidate があるからといって、「DMDに渡せる」「downstreamへ進める」「actual review済み」と一気に読んでしまうと、Cocolonの慎重さが崩れます。

---

## 4. 本設計の対象範囲 / 非対象範囲

### 4.1 対象範囲

本設計の対象は次です。

```text
1. ELR-OP19 result memo validation closureのintake。
2. ELR-OP18 downstream non-promotion manual decision holdのintake。
3. ELR-OP17 DMD-compatible receipt candidateのintake。
4. ELR closureとreceipt candidateのbody-free / no-touch / no-promotion再検査。
5. actual source claimとhelper/candidate shapeの分離。
6. DMD direct handoff可能性の判定。
7. retry/start actual local-only human reviewへ戻す判定。
8. body-free repair required判定。
9. wait/manual hold継続判定。
10. DMD handoff plan candidateのbody-free materialization。
11. result memo / target test / selected regression closure。
```

### 4.2 非対象範囲

本設計では、以下を行いません。

```text
- body-full packet生成。
- actual local-only human review実行。
- actual operation receipt作成。
- sanitized review result rows作成。
- rating rows作成。
- question need observation rows作成。
- disposal / purge実行。
- DMD自動実行。
- R52 actual execution。
- PostCR22 EX reentry実行。
- P5 finalization。
- P6 start。
- P8 question design。
- P8 question implementation。
- question text / draft question text生成。
- API route変更。
- DB migration。
- RN production UI変更。
- response key変更。
- runtime generation変更。
- P7 complete。
- release decision。
```

### 4.3 禁止する読み替え

```text
ELR-OP19 closed = actual review完了
ELR-OP17 receipt candidate ready = DMD実行済み
DMD-compatible schema = downstream handoff許可
created_from_real_operation flag = 今回実レビュー実行を華恋が確認した事実
question_need_observation_rows = P8質問仕様
manual decision hold = downstream実行結果
helper green = product readfeel確認完了
pytest passed = Cocolon体験品質の証明
```

---

## 5. 設計方針

### 5.1 DHRは薄い境界にする

DHRは、ELR後に新しい大きなmanual decision systemを作るためのものではありません。  
DHRの責務は、次の5分岐を安全に materialize することです。

```text
1. DMDへ渡す準備が整っている。ただし手動判断必須。
2. actual review evidence が未完成なので retry/startへ戻す。
3. body-free証跡やsource_kindが壊れているので repairへ止める。
4. ELR側のclosure / hold / receiptがまだ揃っていないので waitする。
5. 判断不能なので manual decision holdを維持する。
```

DHRは、branchを出します。  
DHRは、branch先を自動実行しません。

### 5.2 DMDを再発明しない

DMD-OP00〜OP08には、既に actual evidence status triage の責務があります。  
DHRが同じ検査を全部再実装すると、次の問題が起きます。

```text
- DMDとDHRの判定がズレる。
- helper層が増え、何を信じればよいか分かりにくくなる。
- greenが増えるほどactual evidenceから遠ざかる。
```

したがって、DHRは次に限定します。

```text
- ELR固有のclosure / receipt candidate / source claim境界をpreflightする。
- DMDへ渡す場合は、DMD handoff planだけを作る。
- DMD実行は明示的な次工程にする。
- 既存DMDのbranch名・receipt schema・source_kindルールを流用する。
```

### 5.3 DMD direct call は原則しない

DHR内でDMDを直接呼んで OP00〜OP08 resultを作る実装は、第一候補にしません。

理由:

```text
- DMD-OP01はDMH-OP18 finalizer contractを前提にしている。
- ELR-OP18/OP19はDMH-OP18そのものではない。
- DMD実行がDHR内に入ると、manual decision holdが自動実行に見える。
- DMD result memoが作られると、downstream decision済みと誤読されやすい。
```

DHRが作るのは、次のどちらかです。

```text
branch_readyの場合:
  DMD handoff plan body-free candidate
  manual operator must explicitly run/decide DMD handoff

branch_not_readyの場合:
  retry/start / repair / wait / hold material
```

### 5.4 DMH-OP18 finalizerを偽装しない

実装段階で既存DMDがELR材料を直接受けられない場合、安易に「DMH-OP18互換の偽物」を作ってDMD contractを通すのは避けます。

許容する方向は次です。

```text
preferred:
  DMD側に post_elr19 alternate intake を小さく追加する。
  または DHR側で DMD handoff plan を作り、次工程でDMD実行判断する。

avoid:
  ELR-OP18をDMH-OP18 finalizer schemaへ無理に変換し、DMH由来であるかのように扱う。
```

この判断は、Cocolonの「わかったふりをしない」思想と同じです。  
schemaを通すために意味を偽装してはいけません。

### 5.5 actual source claim を分離する

DHRで最も重要な判定は次です。

```text
shape-validなreceipt candidateか。
actual local-only human review by person 由来だと、今回のmanual boundaryで主張してよいか。
```

この2つは分けます。

```text
receipt_shape_valid: true
actual_source_claim_confirmed_for_downstream_handoff: false
```

この状態なら、DHRは downstream handoff ready にしません。  
retry/start または manual hold継続へ戻します。

### 5.6 question need observation をP8へ変換しない

DHRは、question need observation rows をP8質問仕様へ変換しません。  
DHRが扱うのは、row count / schema / body-free / source_kind / no question text だけです。

禁止:

```text
question_text
question_prompt
draft_question_text
question_trigger_logic
question_answer_storage
p8_question_schema
p8_start_allowed: true
```

---

## 6. branch設計

### 6.1 branch refs

DHRで固定するbranch refs案です。

```text
DHR_BRANCH_DMD_HANDOFF_READY_MANUAL_DECISION_REQUIRED_NO_AUTO_EXECUTION
DHR_BRANCH_RETRY_OR_START_REQUIRED_BEFORE_DOWNSTREAM_HANDOFF
DHR_BRANCH_BODYFREE_EVIDENCE_REPAIR_REQUIRED
DHR_BRANCH_WAIT_FOR_ELR_COMPLETE_EVIDENCE_OR_MANUAL_HOLD
DHR_BRANCH_MANUAL_DECISION_HOLD_CONTINUES_UNRESOLVED
```

### 6.2 branch優先順位

branch resolverは、次の順で決めます。

```text
priority_1:
  repair_required

priority_2:
  elr_op19_not_closed_or_elr_op18_waiting

priority_3:
  actual_source_claim_not_confirmed_or_evidence_incomplete

priority_4:
  dmd_handoff_ready_manual_decision_required

priority_5:
  unresolved_manual_hold
```

repairが最優先です。  
body leak、forbidden key、invalid source_kind、promotion claimがあれば、handoff readyへ進めません。

### 6.3 branch別 next_required_step

```text
DHR_BRANCH_DMD_HANDOFF_READY_MANUAL_DECISION_REQUIRED_NO_AUTO_EXECUTION:
  next_required_step:
    manual_decision_execute_or_decline_dmd_handoff_without_auto_promotion

DHR_BRANCH_RETRY_OR_START_REQUIRED_BEFORE_DOWNSTREAM_HANDOFF:
  next_required_step:
    retry_or_start_actual_local_only_human_review_operation_with_explicit_local_only_allow

DHR_BRANCH_BODYFREE_EVIDENCE_REPAIR_REQUIRED:
  next_required_step:
    stop_and_repair_post_elr19_bodyfree_evidence_boundary

DHR_BRANCH_WAIT_FOR_ELR_COMPLETE_EVIDENCE_OR_MANUAL_HOLD:
  next_required_step:
    wait_for_elr_complete_evidence_or_manual_hold_material

DHR_BRANCH_MANUAL_DECISION_HOLD_CONTINUES_UNRESOLVED:
  next_required_step:
    keep_downstream_manual_decision_hold_without_promotion
```

### 6.4 現在確認済み材料に対するexpected branch

今回の検討メモと最新確認済み材料だけを基準にすると、expected branchは次です。

```text
DHR_BRANCH_RETRY_OR_START_REQUIRED_BEFORE_DOWNSTREAM_HANDOFF
```

理由:

```text
- ELR-OP19 closureはbody-free result memo closureであり、actual review実行証跡そのものではない。
- ELR-OP17 receipt candidateはDMD-compatible shapeだが、今回の作業でactual operationを実行した証明ではない。
- actual body-full packet generationは未確認。
- actual local-only human review executionは未確認。
- actual operation receipt実作成は未確認。
- actual sanitized rows / rating rows / question need rows実作成は未確認。
- actual disposal / purge実実行は未確認。
```

ただし、実装段階で外部actual evidence receiptが追加で入力され、それがDHR-OP04〜OP06を通過した場合だけ、handoff ready branchへ進めます。

---

## 7. 推奨ファイル構成

### 7.1 実装候補helper

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py
```

責務:

```text
- ELR-OP19 closure intake
- ELR-OP18 manual hold intake
- ELR-OP17 receipt candidate intake
- ELR固有のbody-free / no-promotion再検査
- actual source claim separation
- DMD handoff readiness preflight
- retry/start / repair / wait / hold分岐
- DMD handoff plan body-free candidate materialization
- result memo closure
```

### 7.2 変更しないファイル

原則、次は変更しません。

```text
mashos-api/ai/services/ai_inference/api_emotion_submit.py
mashos-api/ai/services/ai_inference/emotion_submit_service.py
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_dmd08_continue_retry_actual_local_review_operation_20260703.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_dmh18_downstream_manual_decision_triage_20260703.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_20260703.py
Cocolon/screens/InputScreen.js
Cocolon/screens/input/useInputFeedbackModal.js
Cocolon/screens/input/InputFeedbackReplyModal.js
DB migration files
```

例外:

```text
既存DMDに alternate post_elr19 intake を足す方が、DHRで変換を作るより意味的に安全だと実装段階で確認できた場合のみ、DMD helperへ小さな追加を検討する。
```

ただし、その場合でも既存DMDのbranch resolver本体を大きく変更しません。

### 7.3 test module候補

```text
mashos-api/ai/tests/
  test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op00_op01_20260704.py
  test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op02_op03_20260704.py
  test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op04_op05_20260704.py
  test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op06_op07_20260704.py
  test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op08_op09_result_20260704.py
```

### 7.4 result memo候補

```text
mashos-api/ai/tests/
  R54_AHR_PostELR19_DownstreamManualDecision_HandoffOrRetry_DHR_OP00_OP09_Result_20260704.md
```

---

## 8. 実装順

### 8.1 全体依存順

```text
DHR-OP00: scope / no-touch / no-promotion refreeze after ELR-OP19
DHR-OP01: ELR-OP19 result memo validation closure intake
DHR-OP02: ELR-OP18 downstream manual decision hold intake
DHR-OP03: ELR-OP17 DMD-compatible receipt candidate extraction
DHR-OP04: actual source claim separation / invalid source classification
DHR-OP05: body-free leak / promotion claim / direct DMD compatibility preflight scan
DHR-OP06: handoff-or-retry deterministic branch resolver
DHR-OP07: manual decision materialization
DHR-OP08: DMD handoff plan candidate materialization without execution
DHR-OP09: body-free result memo / target tests / selected regression closure
```

---

### DHR-OP00: scope / no-touch / no-promotion refreeze after ELR-OP19

目的:

```text
Post-ELR19 DHR層の責務を固定する。
ELR-OP19 closureをdownstream実行やP8開始へ読み替えない。
```

実装内容:

```text
- DHR phase / step / scope / policy_kind constantsを定義する。
- DHR-OP00 schema_versionを定義する。
- source_mode = local_received_zip_only を固定する。
- git_connection_required = false / git_checked = false を固定する。
- no-touch contractを定義する。
- not-claimed boundaryを定義する。
- selected_stage_refを固定する。
- not_stage_refsに P8 / P5 / P6 / R52 / P7 complete / release を入れる。
```

acceptance:

```text
body_free: true
api_route_changed: false
db_schema_changed: false
rn_production_ui_changed: false
runtime_generation_changed: false
response_key_changed: false
dmd_execution_started_here: false
r52_actual_execution_started_here: false
p5_final_allowed: false
p6_start_allowed: false
p8_start_allowed: false
p8_question_design_started: false
p8_question_implementation_started: false
p7_complete: false
release_allowed: false
manual_decision_auto_executes_downstream: false
next_required_step: DHR-OP01
```

---

### DHR-OP01: ELR-OP19 result memo validation closure intake

目的:

```text
ELR-OP19 closureをbody-freeに受け、closed / waiting / repair を判定する。
```

実装内容:

```text
- ELR OP19 contract assertを呼ぶ。
- result_memo_validation_closure_status_refを読む。
- result_memo_bodyfree_closedを読む。
- op18_downstream_manual_decision_hold_readyを読む。
- target/regression/compileall summaryをcount-onlyで取り込む。
- forbidden payload key / body-like value / promotion claimを再scanする。
```

status refs案:

```text
DHR_ELR_OP19_INTAKE_CLOSED_BODYFREE
DHR_ELR_OP19_INTAKE_WAITING_FOR_MANUAL_HOLD
DHR_ELR_OP19_INTAKE_REPAIR_REQUIRED
DHR_ELR_OP19_INTAKE_MISSING_OR_INVALID
```

acceptance:

```text
elr_op19_result_memo_present: true
elr_op19_contract_valid: true  # closed path only
elr_op19_closed_bodyfree: true  # closed path only
elr_op19_forbidden_payload_key_path_count: 0
elr_op19_body_like_value_path_count: 0
elr_op19_promotion_claim_ref_count: 0
actual_review_execution_claimed_by_dhr_op01: false
dmd_execution_started_here: false
next_required_step:
  DHR-OP02 if closed
  wait_for_elr_op19_closure if waiting
  repair_post_elr19_result_memo_boundary if repair/missing/invalid
```

---

### DHR-OP02: ELR-OP18 downstream manual decision hold intake

目的:

```text
ELR-OP18 manual holdをbody-freeに受け、downstream non-promotion holdが成立しているかを確認する。
```

実装内容:

```text
- ELR OP18 contract assertを呼ぶ。
- downstream_manual_decision_hold_status_refを読む。
- downstream_manual_decision_required_without_auto_executionを読む。
- complete_candidate_held_without_downstream_executionを読む。
- dmd_reexecution_started_here / r52_actual_execution_started_here / p8_start_allowed / release_allowed がfalseであることを再確認する。
- OP18がwaitingなら DHR branchをwaitへ寄せる。
- OP18がrepairなら repairへ寄せる。
```

status refs案:

```text
DHR_ELR_OP18_MANUAL_HOLD_ACCEPTED_BODYFREE
DHR_ELR_OP18_MANUAL_HOLD_WAITING_FOR_HANDOFF
DHR_ELR_OP18_MANUAL_HOLD_REPAIR_REQUIRED
DHR_ELR_OP18_MANUAL_HOLD_MISSING_OR_INVALID
```

acceptance:

```text
elr_op18_manual_hold_present: true
elr_op18_contract_valid: true
elr_op18_downstream_manual_decision_required_without_auto_execution: true
elr_op18_manual_decision_auto_executes_downstream: false
elr_op18_dmd_reexecution_started_here: false
elr_op18_r52_actual_execution_started_here: false
next_required_step:
  DHR-OP03 if hold accepted
  wait_for_elr_handoff_candidate if waiting
  repair_elr_op18_manual_hold if repair/missing/invalid
```

---

### DHR-OP03: ELR-OP17 DMD-compatible receipt candidate extraction

目的:

```text
ELR-OP17 receipt candidateを取り出し、DMD receipt schema shapeとして検査する。
```

実装内容:

```text
- ELR OP17 contract assertを呼ぶ。
- dmd_compatible_receipt_adapter_status_refを読む。
- dmd_compatible_receipt_handoff_candidate_readyを読む。
- dmd_compatible_actual_operation_evidence_receipt_bodyfreeを取り出す。
- DMD receipt schema_version / source_kind / counts / true guardsを検査する。
- receiptが空なら waiting/incompleteへ寄せる。
- forbidden payload keyがあれば repairへ寄せる。
```

status refs案:

```text
DHR_ELR_OP17_RECEIPT_CANDIDATE_SHAPE_VALID_BODYFREE
DHR_ELR_OP17_RECEIPT_CANDIDATE_WAITING_FOR_COMPLETE_EVIDENCE
DHR_ELR_OP17_RECEIPT_CANDIDATE_REPAIR_REQUIRED
DHR_ELR_OP17_RECEIPT_CANDIDATE_MISSING_OR_INVALID
```

acceptance:

```text
receipt_shape_valid: true  # valid path
receipt_schema_version_matches_dmd: true
receipt_source_kind_ref: actual_local_only_human_review_by_person
receipt_count_fields_are_24: true
receipt_required_true_fields_passed: true
receipt_forbidden_payload_key_path_count: 0
receipt_body_free: true
receipt_claimed_as_actual_execution_by_dhr_op03: false
next_required_step: DHR-OP04
```

注意:

```text
DHR-OP03は、receipt shapeを検査するだけである。
ここで actual_source_claim_confirmed_for_downstream_handoff を true にしない。
```

---

### DHR-OP04: actual source claim separation / invalid source classification

目的:

```text
receipt candidateのshape-validと、actual review by person由来としてdownstreamへ渡してよいかを分離する。
```

実装内容:

```text
- source_kind_refを検査する。
- invalid source_kind refsを固定する。
- helper green / target green / result memo green / fixture / synthetic / historical reuse / unknown をactual sourceから除外する。
- external_actual_operation_evidence_claim_optionalを受ける設計にする。
- actual source claimがDHRで確認できない場合は、retry/start branchへ寄せる。
```

invalid source_kind refs案:

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

status refs案:

```text
DHR_ACTUAL_SOURCE_CLAIM_CONFIRMED_BODYFREE
DHR_ACTUAL_SOURCE_CLAIM_NOT_CONFIRMED_RETRY_OR_START_REQUIRED
DHR_ACTUAL_SOURCE_INVALID_REPAIR_REQUIRED
DHR_ACTUAL_SOURCE_WAITING_FOR_EXTERNAL_BODYFREE_CLAIM
```

acceptance:

```text
receipt_shape_valid: true
actual_source_claim_confirmed_for_downstream_handoff: false  # current confirmed default
helper_green_promoted_to_actual_source: false
target_green_promoted_to_actual_source: false
result_memo_green_promoted_to_actual_source: false
fixture_promoted_to_actual_source: false
historical_reuse_promoted_to_actual_source: false
```

handoff-ready pathでのみ必要:

```text
actual_source_claim_confirmed_for_downstream_handoff: true
actual_source_claim_bodyfree: true
actual_source_claim_origin_ref: external_local_only_human_review_receipt_or_manual_evidence_confirmation
actual_local_only_human_review_by_person_confirmed: true
actual_operation_receipt_created_by_helper_here: false
actual_rows_created_by_helper_here: false
```

---

### DHR-OP05: body-free leak / promotion claim / direct DMD compatibility preflight scan

目的:

```text
ELR-OP19 / OP18 / OP17 / receipt / actual source claim / optional manual materialをまとめてscanし、repair対象を優先的に止める。
```

実装内容:

```text
- forbidden payload key scan。
- raw body / comment_text / question_text / draft_question_text / local_path / body_hash / terminal output body shape scan。
- p5_final_allowed / p6_start_allowed / p8_start_allowed / p7_complete / release_allowed / r52_actual_execution_started_here / dmd_execution_started_here をscanする。
- source_kind invalid scan。
- DMD direct call可能性を判定する。
```

DMD direct compatibility preflight:

```text
dmd_direct_call_safe: false  # default
reason:
  existing_dmd_op01_requires_dmh_op18_finalizer_contract

alternative:
  dmd_handoff_plan_candidate_allowed: true  # if no repair and source claim confirmed
```

status refs案:

```text
DHR_PREFLIGHT_SCAN_CLEAR_BODYFREE
DHR_PREFLIGHT_SCAN_REPAIR_REQUIRED
DHR_PREFLIGHT_SCAN_WAITING_OR_INCOMPLETE
```

acceptance:

```text
forbidden_payload_key_path_count: 0
body_like_value_path_count: 0
promotion_claim_ref_count: 0
invalid_source_kind_ref_count: 0
dmd_direct_call_safe_without_adapter: false
dmh_op18_finalizer_fake_generation_allowed: false
dmd_handoff_plan_candidate_allowed: true or false depending on branch
```

---

### DHR-OP06: handoff-or-retry deterministic branch resolver

目的:

```text
DHR-OP01〜OP05の結果から、handoff / retry-start / repair / wait / hold を決定する。
```

実装内容:

```text
- repair blockersがあれば repair branch。
- ELR-OP19 not closed / OP18 waiting / OP17 waitingなら wait branch。
- receipt shape invalidなら repair branch。
- actual source claim not confirmedなら retry/start branch。
- source claim confirmed + scan clear + manual hold readyなら handoff-ready branch。
- 判定不能なら unresolved manual hold branch。
```

resolver priority:

```text
1. repair
2. wait
3. retry_or_start_due_to_actual_source_not_confirmed
4. handoff_ready_manual_decision_required
5. unresolved_manual_hold
```

status refs案:

```text
DHR_OP06_BRANCH_RESOLVED_REPAIR_REQUIRED
DHR_OP06_BRANCH_RESOLVED_WAITING
DHR_OP06_BRANCH_RESOLVED_RETRY_OR_START_REQUIRED
DHR_OP06_BRANCH_RESOLVED_DMD_HANDOFF_READY_MANUAL_DECISION_REQUIRED
DHR_OP06_BRANCH_RESOLVED_MANUAL_HOLD_UNRESOLVED
```

acceptance:

```text
branch_ref in DHR_BRANCH_REFS
branch_resolver_ready: true
manual_decision_auto_executes_downstream: false
dmd_execution_started_here: false
r52_actual_execution_started_here: false
p8_start_allowed: false
release_allowed: false
```

current expected:

```text
branch_ref:
  DHR_BRANCH_RETRY_OR_START_REQUIRED_BEFORE_DOWNSTREAM_HANDOFF
next_required_step:
  retry_or_start_actual_local_only_human_review_operation_with_explicit_local_only_allow
```

---

### DHR-OP07: manual decision materialization

目的:

```text
resolver branchを、人間が読めるbody-free manual decision materialへ固定する。
```

実装内容:

```text
- selected_branch_refを記録する。
- branch_reason_refs / branch_blocker_refsをbody-freeで記録する。
- handoff / retry / repair / wait / hold の recommended_next_step_ref を記録する。
- ただし、自動実行フラグはすべてfalseにする。
```

manual material fields案:

```text
manual_decision_materialized: true
manual_decision_required: true
manual_decision_auto_executes_downstream: false
selected_branch_ref: <DHR_BRANCH_*>
recommended_next_step_ref: <...>
operator_action_required: true
dmd_handoff_allowed_as_manual_decision_candidate: bool
retry_or_start_required: bool
repair_required: bool
waiting_required: bool
hold_continues: bool
```

acceptance:

```text
manual_decision_materialized_bodyfree: true
manual_decision_required_without_auto_execution: true
auto_executes_dmd: false
auto_executes_r52: false
auto_starts_actual_review: false
auto_starts_p8: false
release_allowed: false
```

---

### DHR-OP08: DMD handoff plan candidate materialization without execution

目的:

```text
handoff-ready branchの場合のみ、既存DMDへ渡すためのbody-free handoff plan candidateを作る。
```

実装内容:

```text
- DMD helper refを固定する。
- DMD actual_operation_evidence_receipt schema_versionを固定する。
- ELR-OP17 receipt candidateからsafe receiptをコピーする。
- DMD OP01 direct compatibilityがfalseである場合は、その理由を明記する。
- DMD alternate intakeが必要な場合は、implementation-time decisionとして残す。
- DMDを実行しない。
```

DMD handoff plan fields案:

```text
dmd_handoff_plan_materialized: true
dmd_handoff_plan_bodyfree: true
dmd_handoff_ready_manual_decision_required: true
dmd_execution_started_here: false
dmd_auto_execution_allowed: false
dmd_direct_call_safe_without_adapter: false
dmd_alternate_post_elr19_intake_may_be_required: true
dmh_op18_finalizer_fake_generation_allowed: false
actual_operation_evidence_receipt_bodyfree: {...}
```

branch別挙動:

```text
handoff-ready branch:
  DMD handoff planを作る。

retry / repair / wait / hold branch:
  DMD handoff planは空、または not_materialized とする。
```

acceptance:

```text
if selected_branch_ref == DHR_BRANCH_DMD_HANDOFF_READY_MANUAL_DECISION_REQUIRED_NO_AUTO_EXECUTION:
  dmd_handoff_plan_materialized: true
  actual_operation_evidence_receipt_bodyfree_present: true
  dmd_execution_started_here: false
  manual_operator_must_confirm_dmd_handoff: true
else:
  dmd_handoff_plan_materialized: false
  actual_operation_evidence_receipt_bodyfree_present: false or carried_as_non_handoff_candidate_only
```

---

### DHR-OP09: body-free result memo / target tests / selected regression closure

目的:

```text
DHR-OP00〜OP08の結果を、body-free result memoとして閉じる。
```

実装内容:

```text
- status_mapをcount-onlyでまとめる。
- selected branchを記録する。
- target tests summaryを記録する。
- selected regression summaryを記録する。
- compileall summaryを記録する。
- unverified項目を明記する。
- P8 / release / DMD / R52 / actual reviewを実行していないことを固定する。
```

acceptance:

```text
result_memo_bodyfree_closed: true
result_memo_forbidden_payload_key_path_count: 0
result_memo_body_like_value_path_count: 0
result_memo_promotion_claim_ref_count: 0
selected_branch_ref: <DHR_BRANCH_*>
actual_local_human_review_execution_verified_here: false
actual_rows_created_verified_here: false
actual_disposal_purge_execution_verified_here: false
dmd_execution_started_here: false
r52_actual_execution_started_here: false
p5_final_allowed: false
p6_start_allowed: false
p8_start_allowed: false
p8_question_design_started: false
p8_question_implementation_started: false
p7_complete: false
release_allowed: false
next_required_step: <branch dependent>
```

---

## 9. json / schema案

本章のjson / schemaは設計案です。  
実ファイル化は行いません。  
実装段階で、既存schema配置、既存helperの定数、test方針を確認してから判断します。

### 9.1 `post_elr19_dhr_elr_closure_intake.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_elr19.dhr.elr_closure_intake.bodyfree.schema.json",
  "title": "Post-ELR19 DHR ELR closure intake body-free schema",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "phase",
    "operation_step_ref",
    "review_session_id",
    "source_mode",
    "git_connection_required",
    "git_checked",
    "elr_op19_material_ref",
    "elr_op19_contract_valid",
    "elr_op19_status_ref",
    "elr_op19_bodyfree_closed",
    "elr_op19_next_required_step",
    "forbidden_payload_key_path_refs",
    "forbidden_payload_key_path_count",
    "promotion_claim_refs",
    "promotion_claim_ref_count",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_elr19.dhr.elr_closure_intake.bodyfree.v1"
    },
    "phase": { "const": "P7" },
    "operation_step_ref": { "const": "DHR-OP01" },
    "review_session_id": {
      "type": "string",
      "minLength": 1,
      "maxLength": 220,
      "pattern": "^[A-Za-z0-9_.:-]+$"
    },
    "source_mode": { "const": "local_received_zip_only" },
    "git_connection_required": { "const": false },
    "git_checked": { "const": false },
    "elr_op19_material_ref": { "type": "string", "maxLength": 260 },
    "elr_op19_contract_valid": { "type": "boolean" },
    "elr_op19_status_ref": {
      "enum": [
        "ELR_OP19_RESULT_MEMO_VALIDATION_CLOSED_BODYFREE",
        "ELR_OP19_RESULT_MEMO_WAITING_FOR_MANUAL_HOLD",
        "ELR_OP19_RESULT_MEMO_REPAIR_REQUIRED",
        "elr_op19_missing_or_invalid"
      ]
    },
    "elr_op19_bodyfree_closed": { "type": "boolean" },
    "elr_op19_next_required_step": { "type": "string", "maxLength": 260 },
    "forbidden_payload_key_path_refs": {
      "type": "array",
      "items": { "type": "string", "maxLength": 280 }
    },
    "forbidden_payload_key_path_count": { "type": "integer", "minimum": 0 },
    "promotion_claim_refs": {
      "type": "array",
      "items": { "type": "string", "maxLength": 240 }
    },
    "promotion_claim_ref_count": { "type": "integer", "minimum": 0 },
    "body_free": { "const": true }
  }
}
```

### 9.2 `post_elr19_dhr_actual_source_claim_separation.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_elr19.dhr.actual_source_claim_separation.bodyfree.schema.json",
  "title": "Post-ELR19 DHR actual source claim separation body-free schema",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "review_session_id",
    "receipt_shape_valid",
    "receipt_source_kind_ref",
    "receipt_count_fields_are_24",
    "receipt_required_true_fields_passed",
    "actual_source_claim_status_ref",
    "actual_source_claim_confirmed_for_downstream_handoff",
    "invalid_source_kind_refs",
    "invalid_source_kind_ref_count",
    "helper_green_promoted_to_actual_source",
    "target_green_promoted_to_actual_source",
    "result_memo_green_promoted_to_actual_source",
    "fixture_promoted_to_actual_source",
    "historical_reuse_promoted_to_actual_source",
    "actual_operation_receipt_created_by_helper_here",
    "actual_rows_created_by_helper_here",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_elr19.dhr.actual_source_claim_separation.bodyfree.v1"
    },
    "operation_step_ref": { "const": "DHR-OP04" },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 220 },
    "receipt_shape_valid": { "type": "boolean" },
    "receipt_source_kind_ref": {
      "type": "string",
      "maxLength": 180
    },
    "receipt_count_fields_are_24": { "type": "boolean" },
    "receipt_required_true_fields_passed": { "type": "boolean" },
    "actual_source_claim_status_ref": {
      "enum": [
        "DHR_ACTUAL_SOURCE_CLAIM_CONFIRMED_BODYFREE",
        "DHR_ACTUAL_SOURCE_CLAIM_NOT_CONFIRMED_RETRY_OR_START_REQUIRED",
        "DHR_ACTUAL_SOURCE_INVALID_REPAIR_REQUIRED",
        "DHR_ACTUAL_SOURCE_WAITING_FOR_EXTERNAL_BODYFREE_CLAIM"
      ]
    },
    "actual_source_claim_confirmed_for_downstream_handoff": { "type": "boolean" },
    "actual_source_claim_origin_ref": {
      "type": "string",
      "maxLength": 220,
      "default": "actual_source_claim_origin_missing_or_not_confirmed"
    },
    "invalid_source_kind_refs": {
      "type": "array",
      "items": {
        "enum": [
          "unit_test_fixture",
          "helper_green",
          "target_green",
          "result_memo_green",
          "synthetic",
          "historical_reuse_only",
          "unknown",
          "candidate_shape_only"
        ]
      }
    },
    "invalid_source_kind_ref_count": { "type": "integer", "minimum": 0 },
    "helper_green_promoted_to_actual_source": { "const": false },
    "target_green_promoted_to_actual_source": { "const": false },
    "result_memo_green_promoted_to_actual_source": { "const": false },
    "fixture_promoted_to_actual_source": { "const": false },
    "historical_reuse_promoted_to_actual_source": { "const": false },
    "actual_operation_receipt_created_by_helper_here": { "const": false },
    "actual_rows_created_by_helper_here": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 9.3 `post_elr19_dhr_branch_decision.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_elr19.dhr.branch_decision.bodyfree.schema.json",
  "title": "Post-ELR19 DHR branch decision body-free schema",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "review_session_id",
    "branch_ref",
    "branch_reason_refs",
    "branch_reason_ref_count",
    "branch_blocker_refs",
    "branch_blocker_ref_count",
    "next_required_step",
    "manual_decision_required_without_auto_execution",
    "dmd_execution_started_here",
    "r52_actual_execution_started_here",
    "p5_final_allowed",
    "p6_start_allowed",
    "p8_start_allowed",
    "p8_question_design_started",
    "p8_question_implementation_started",
    "p7_complete",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_elr19.dhr.branch_decision.bodyfree.v1"
    },
    "operation_step_ref": { "const": "DHR-OP06" },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 220 },
    "branch_ref": {
      "enum": [
        "DHR_BRANCH_DMD_HANDOFF_READY_MANUAL_DECISION_REQUIRED_NO_AUTO_EXECUTION",
        "DHR_BRANCH_RETRY_OR_START_REQUIRED_BEFORE_DOWNSTREAM_HANDOFF",
        "DHR_BRANCH_BODYFREE_EVIDENCE_REPAIR_REQUIRED",
        "DHR_BRANCH_WAIT_FOR_ELR_COMPLETE_EVIDENCE_OR_MANUAL_HOLD",
        "DHR_BRANCH_MANUAL_DECISION_HOLD_CONTINUES_UNRESOLVED"
      ]
    },
    "branch_reason_refs": {
      "type": "array",
      "items": { "type": "string", "maxLength": 220 }
    },
    "branch_reason_ref_count": { "type": "integer", "minimum": 0 },
    "branch_blocker_refs": {
      "type": "array",
      "items": { "type": "string", "maxLength": 220 }
    },
    "branch_blocker_ref_count": { "type": "integer", "minimum": 0 },
    "next_required_step": { "type": "string", "maxLength": 260 },
    "manual_decision_required_without_auto_execution": { "const": true },
    "dmd_execution_started_here": { "const": false },
    "r52_actual_execution_started_here": { "const": false },
    "p5_final_allowed": { "const": false },
    "p6_start_allowed": { "const": false },
    "p8_start_allowed": { "const": false },
    "p8_question_design_started": { "const": false },
    "p8_question_implementation_started": { "const": false },
    "p7_complete": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 9.4 `post_elr19_dhr_dmd_handoff_plan.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_elr19.dhr.dmd_handoff_plan.bodyfree.schema.json",
  "title": "Post-ELR19 DHR DMD handoff plan body-free schema",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "review_session_id",
    "selected_branch_ref",
    "dmd_handoff_plan_materialized",
    "dmd_handoff_ready_manual_decision_required",
    "dmd_target_helper_ref",
    "dmd_receipt_schema_version",
    "actual_operation_evidence_receipt_bodyfree",
    "dmd_direct_call_safe_without_adapter",
    "dmd_alternate_post_elr19_intake_may_be_required",
    "dmh_op18_finalizer_fake_generation_allowed",
    "dmd_auto_execution_allowed",
    "dmd_execution_started_here",
    "manual_operator_must_confirm_dmd_handoff",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_elr19.dhr.dmd_handoff_plan.bodyfree.v1"
    },
    "operation_step_ref": { "const": "DHR-OP08" },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 220 },
    "selected_branch_ref": {
      "enum": [
        "DHR_BRANCH_DMD_HANDOFF_READY_MANUAL_DECISION_REQUIRED_NO_AUTO_EXECUTION",
        "DHR_BRANCH_RETRY_OR_START_REQUIRED_BEFORE_DOWNSTREAM_HANDOFF",
        "DHR_BRANCH_BODYFREE_EVIDENCE_REPAIR_REQUIRED",
        "DHR_BRANCH_WAIT_FOR_ELR_COMPLETE_EVIDENCE_OR_MANUAL_HOLD",
        "DHR_BRANCH_MANUAL_DECISION_HOLD_CONTINUES_UNRESOLVED"
      ]
    },
    "dmd_handoff_plan_materialized": { "type": "boolean" },
    "dmd_handoff_ready_manual_decision_required": { "type": "boolean" },
    "dmd_target_helper_ref": {
      "const": "emlis_ai_p7_r54_ahr_post_dmh18_downstream_manual_decision_triage_20260703"
    },
    "dmd_receipt_schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dmh18.actual_operation_evidence_receipt.bodyfree.optional.v1"
    },
    "actual_operation_evidence_receipt_bodyfree": {
      "type": "object"
    },
    "dmd_direct_call_safe_without_adapter": { "const": false },
    "dmd_alternate_post_elr19_intake_may_be_required": { "type": "boolean" },
    "dmh_op18_finalizer_fake_generation_allowed": { "const": false },
    "dmd_auto_execution_allowed": { "const": false },
    "dmd_execution_started_here": { "const": false },
    "manual_operator_must_confirm_dmd_handoff": { "const": true },
    "body_free": { "const": true }
  }
}
```

### 9.5 `post_elr19_dhr_result_memo.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_elr19.dhr.result_memo.bodyfree.schema.json",
  "title": "Post-ELR19 DHR result memo body-free schema",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "review_session_id",
    "result_memo_bodyfree_closed",
    "selected_branch_ref",
    "target_tests_summary_bodyfree",
    "selected_regression_summary_bodyfree",
    "compileall_summary_bodyfree",
    "actual_local_human_review_execution_verified_here",
    "actual_rows_created_verified_here",
    "actual_disposal_purge_execution_verified_here",
    "dmd_execution_started_here",
    "r52_actual_execution_started_here",
    "p8_start_allowed",
    "release_allowed",
    "next_required_step",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_elr19.dhr.result_memo.bodyfree.v1"
    },
    "operation_step_ref": { "const": "DHR-OP09" },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 220 },
    "result_memo_bodyfree_closed": { "const": true },
    "selected_branch_ref": { "type": "string", "maxLength": 220 },
    "target_tests_summary_bodyfree": {
      "type": "object",
      "required": ["status_ref", "passed_count", "failed_count", "timed_out"],
      "additionalProperties": false,
      "properties": {
        "status_ref": { "type": "string", "maxLength": 160 },
        "passed_count": { "type": "integer", "minimum": 0 },
        "failed_count": { "type": "integer", "minimum": 0 },
        "timed_out": { "type": "boolean" }
      }
    },
    "selected_regression_summary_bodyfree": { "type": "object" },
    "compileall_summary_bodyfree": { "type": "object" },
    "actual_local_human_review_execution_verified_here": { "const": false },
    "actual_rows_created_verified_here": { "const": false },
    "actual_disposal_purge_execution_verified_here": { "const": false },
    "dmd_execution_started_here": { "const": false },
    "r52_actual_execution_started_here": { "const": false },
    "p8_start_allowed": { "const": false },
    "release_allowed": { "const": false },
    "next_required_step": { "type": "string", "maxLength": 260 },
    "body_free": { "const": true }
  }
}
```

---

## 10. テスト設計

### 10.1 target test案

```text
tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op00_op01_20260704.py
```

確認:

```text
- DHR-OP00がscope/no-touch/no-promotionを固定する。
- DHR-OP00がP8/P5/P6/R52/P7/releaseをfalse固定する。
- DHR-OP01がELR-OP19 closedをacceptedする。
- DHR-OP01がELR-OP19 waitingをwait branchへ寄せる。
- DHR-OP01がELR-OP19 repair/missing/invalidをrepairへ寄せる。
- DHR-OP01がpromotion mutationを拒否する。
```

```text
tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op02_op03_20260704.py
```

確認:

```text
- DHR-OP02がELR-OP18 manual hold acceptedを受ける。
- DHR-OP02がELR-OP18 waitingをwait branchへ寄せる。
- DHR-OP02がELR-OP18 repair/mutationをrepairへ寄せる。
- DHR-OP03がELR-OP17 DMD-compatible receipt shapeを検査する。
- DHR-OP03がreceipt emptyをwaiting/incompleteにする。
- DHR-OP03がinvalid source/count/guard/body keyをrepairへ寄せる。
```

```text
tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op04_op05_20260704.py
```

確認:

```text
- DHR-OP04がshape-valid receiptだけではactual_source_claim_confirmedにしない。
- helper_green / target_green / result_memo_green / fixture / synthetic / historical_reuse / unknown をactual sourceにしない。
- external actual evidence claimがない場合はretry/start branchへ寄せる。
- source_kind invalidならrepairへ寄せる。
- DHR-OP05がraw_input/comment_text/question_text/local_path/body_hash/terminal_output_bodyを検出してrepairへ寄せる。
- DHR-OP05がp8_start_allowed/release_allowed/r52_actual_execution_started_here等のpromotion claimを拒否する。
- DHR-OP05がDMD direct call safeをdefault falseにする。
```

```text
tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op06_op07_20260704.py
```

確認:

```text
- branch priorityが repair > wait > retry/start > handoff-ready > unresolved である。
- current confirmed material defaultが retry/start branchになる。
- external actual source confirmed + scan clear + hold readyの場合のみ handoff-ready branchになる。
- DHR-OP07がmanual decision materialをbody-freeで出す。
- DHR-OP07が自動DMD/R52/P8/releaseを拒否する。
```

```text
tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op08_op09_result_20260704.py
```

確認:

```text
- handoff-ready branchでのみDMD handoff plan candidateがmaterializeされる。
- DMD handoff planはDMDを実行しない。
- DMH-OP18 finalizer fake generation allowedがfalseである。
- DMD direct call without adapterがfalseである。
- retry/repair/wait branchではDMD handoff planがmaterializeされない。
- DHR-OP09 result memoがbody-freeで閉じる。
- result memoにraw body / comment_text / question_text / local_path / hash / terminal outputが出ない。
- result memoがP8/releaseを許可しない。
```

### 10.2 selected regression案

DHR targetの後に、最低限次を回します。

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_elr_op16_op17_20260703.py \
  tests/test_r54_ahr_post_alr12_explicit_local_only_review_start_retry_operation_elr_op18_op19_20260703.py
```

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op00_op01_20260703.py \
  tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op02_op03_20260703.py \
  tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op04_op05_20260703.py \
  tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op06_op07_20260703.py \
  tests/test_r54_ahr_post_dmh18_downstream_manual_decision_triage_dmd_op08_result_20260703.py
```

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

compile:

```bash
PYTHONPATH=services/ai_inference python -m compileall -q services/ai_inference
```

### 10.3 実装完了時のresult memoに書くべきこと

```text
- DHR-OP00〜OP09 implemented
- selected branch
- expected current default branch
- DMD handoff plan materialized: true/false
- DMD execution: not performed
- R52 actual execution: not started
- actual body-full packet generation: not performed here
- actual local-only human review execution: not performed here
- actual rows creation: not performed here
- actual disposal / purge execution: not performed here
- P8 question design: not started
- P8 question implementation: not started
- P5/P6/P8/R52/P7/release auto-promotion: blocked
- release_allowed: false
```

---

## 11. 実装時の関数構成案

### 11.1 constants

```python
P7_R54_AHR_POST_ELR19_DHR_PHASE = "P7"
P7_R54_AHR_POST_ELR19_DHR_STEP = "R54-AHR-PostELR19-DHR"
P7_R54_AHR_POST_ELR19_DHR_SCOPE = "backend_internal_only_bodyfree_no_touch_no_promotion"
P7_R54_AHR_POST_ELR19_DHR_SOURCE_MODE = "local_received_zip_only"

P7_R54_AHR_POST_ELR19_DHR_STEP_REFS = (
    "DHR-OP00_scope_no_touch_no_promotion_refreeze_after_elr_op19",
    "DHR-OP01_elr_op19_result_memo_validation_closure_intake",
    "DHR-OP02_elr_op18_downstream_manual_decision_hold_intake",
    "DHR-OP03_elr_op17_dmd_compatible_receipt_candidate_extraction",
    "DHR-OP04_actual_source_claim_separation_invalid_source_classification",
    "DHR-OP05_bodyfree_leak_promotion_claim_dmd_compatibility_preflight_scan",
    "DHR-OP06_handoff_or_retry_deterministic_branch_resolver",
    "DHR-OP07_manual_decision_materialization",
    "DHR-OP08_dmd_handoff_plan_candidate_materialization_without_execution",
    "DHR-OP09_bodyfree_result_memo_target_tests_regression_closure",
)
```

### 11.2 build/assert function names

```python
def build_p7_r54_ahr_post_elr19_dhr_op00_scope_no_touch_no_promotion_refreeze(...): ...
def assert_p7_r54_ahr_post_elr19_dhr_op00_scope_no_touch_no_promotion_refreeze_contract(data): ...

def build_p7_r54_ahr_post_elr19_dhr_op01_elr_op19_result_memo_validation_closure_intake(...): ...
def assert_p7_r54_ahr_post_elr19_dhr_op01_elr_op19_result_memo_validation_closure_intake_contract(data): ...

def build_p7_r54_ahr_post_elr19_dhr_op02_elr_op18_downstream_manual_decision_hold_intake(...): ...
def assert_p7_r54_ahr_post_elr19_dhr_op02_elr_op18_downstream_manual_decision_hold_intake_contract(data): ...

def build_p7_r54_ahr_post_elr19_dhr_op03_elr_op17_dmd_compatible_receipt_candidate_extraction(...): ...
def assert_p7_r54_ahr_post_elr19_dhr_op03_elr_op17_dmd_compatible_receipt_candidate_extraction_contract(data): ...

def build_p7_r54_ahr_post_elr19_dhr_op04_actual_source_claim_separation(...): ...
def assert_p7_r54_ahr_post_elr19_dhr_op04_actual_source_claim_separation_contract(data): ...

def build_p7_r54_ahr_post_elr19_dhr_op05_bodyfree_leak_promotion_claim_dmd_compatibility_preflight_scan(...): ...
def assert_p7_r54_ahr_post_elr19_dhr_op05_bodyfree_leak_promotion_claim_dmd_compatibility_preflight_scan_contract(data): ...

def build_p7_r54_ahr_post_elr19_dhr_op06_handoff_or_retry_deterministic_branch_resolver(...): ...
def assert_p7_r54_ahr_post_elr19_dhr_op06_handoff_or_retry_deterministic_branch_resolver_contract(data): ...

def build_p7_r54_ahr_post_elr19_dhr_op07_manual_decision_materialization(...): ...
def assert_p7_r54_ahr_post_elr19_dhr_op07_manual_decision_materialization_contract(data): ...

def build_p7_r54_ahr_post_elr19_dhr_op08_dmd_handoff_plan_candidate_materialization_without_execution(...): ...
def assert_p7_r54_ahr_post_elr19_dhr_op08_dmd_handoff_plan_candidate_materialization_without_execution_contract(data): ...

def build_p7_r54_ahr_post_elr19_dhr_op09_bodyfree_result_memo_target_tests_regression_closure(...): ...
def assert_p7_r54_ahr_post_elr19_dhr_op09_bodyfree_result_memo_target_tests_regression_closure_contract(data): ...
```

### 11.3 alias方針

既存の命名スタイルに合わせて、canonical関数とfull operation aliasを両方置く場合があります。

```python
build_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op06_handoff_or_retry_deterministic_branch_resolver = (
    build_p7_r54_ahr_post_elr19_dhr_op06_handoff_or_retry_deterministic_branch_resolver
)
```

aliasは便利ですが、乱用しません。  
testでは、canonical functionとaliasが同じ結果を返すことを1本だけ確認します。

---

## 12. no-touch / no-promotion contract

DHR全OPで、次はfalse固定です。

```text
api_route_changed
api_response_key_changed
db_schema_changed
db_write_path_changed
rn_production_ui_changed
runtime_generation_changed
response_key_changed
subscription_entitlement_changed
external_ai_call_added
body_full_packet_generated_here
actual_local_human_review_executed_here
actual_operation_receipt_created_here
sanitized_review_result_rows_created_here
rating_rows_created_here
question_need_observation_rows_created_here
disposal_purge_executed_here
dmd_execution_started_here
r52_actual_execution_started_here
p5_final_allowed
p6_start_allowed
p8_start_allowed
p8_question_design_started
p8_question_implementation_started
p7_complete
release_allowed
manual_decision_auto_executes_downstream
```

DHR全OPで、次はtrue固定です。

```text
body_free
source_mode_is_local_received_zip_only
git_connection_required_is_false
git_checked_is_false
no_touch_boundary_confirmed
no_promotion_boundary_confirmed
manual_decision_required_without_auto_execution
```

ただし、`manual_decision_required_without_auto_execution` は、DHR-OP00から固定してよいです。  
DHR自体が「自動実行しないためのmanual boundary」だからです。

---

## 13. 既存DMDに対する実装時判断

実装段階で、最初に確認すべきことは次です。

```text
既存DMDが、ELR-OP19 / ELR-OP18 / ELR-OP17 receipt candidate を、意味を偽装せずに受けられるか。
```

判定:

### 13.1 既存DMDをそのまま使える場合

条件:

```text
- DMD側に、DMH-OP18 finalizer以外のpost_elr19 alternate intakeが既に存在する。
- またはDMD OP02以降へ、DMD OP01を意味的に偽装せずに接続できる。
- DMD resultをDHR内で自動作成しない設計にできる。
```

この場合:

```text
- DHRはDMD handoff planだけを作る。
- 新規DHR helperはOP00〜OP07程度に縮小してよい。
- DMD側への改修は不要。
```

### 13.2 既存DMDをそのまま使えない場合

現在の実ファイルを見る限り、この可能性が高いです。  
理由は、DMD OP01がDMH-OP18 finalizer contractを前提にしているためです。

この場合の推奨:

```text
- DHRで無理にDMH-OP18 finalizer shapeを偽装しない。
- DMDへ小さな alternate post_elr19 intake を足すか、DHR handoff planを次工程のmanual decision材料にする。
- 既存DMD branch resolverのロジックを複製しない。
```

DMD側へ足す場合の候補:

```python
def build_p7_r54_ahr_post_dmh18_dmd_op01b_post_elr19_manual_hold_intake(...): ...
```

ただし、これは実装段階で判断します。  
本書では実ファイル化しません。

### 13.3 絶対に避けること

```text
- ELR-OP18をDMH-OP18 finalizerとして偽装する。
- DHRでDMD OP00〜OP08を丸ごと再実装する。
- receipt candidateのshape-validだけでDMD complete branchへ進める。
- DMD result memoをDHR内で作ってdownstream decision済みに見せる。
```

---

## 14. 実装時の注意

### 14.1 「candidate」と「confirmed」を混同しない

```text
candidate:
  形として後段に渡せる可能性がある。

confirmed:
  現在のmanual boundaryで、actual sourceとして主張してよい確認が取れている。
```

DHRでは、candidateだけでは handoff-ready にしません。

### 14.2 current defaultをhandoff-readyにしない

現在の確認済み材料では、actual review実行が未確認です。  
そのため、DHR implementation resultでcurrent default branchを次にしてはいけません。

```text
DHR_BRANCH_DMD_HANDOFF_READY_MANUAL_DECISION_REQUIRED_NO_AUTO_EXECUTION
```

現在defaultとして自然なのは次です。

```text
DHR_BRANCH_RETRY_OR_START_REQUIRED_BEFORE_DOWNSTREAM_HANDOFF
```

または、実装時に「actual source claimが外部から提示されていないが、ELR materialはclosed」という状態をより慎重に扱うなら、次でもよいです。

```text
DHR_BRANCH_MANUAL_DECISION_HOLD_CONTINUES_UNRESOLVED
```

ただし、華恋の判断では、次工程を明確にするためには retry/start required を第一候補にする方がよいです。  
理由は、manual holdを続けるだけだと、またhelper greenを積んで実レビューへ進まない危険があるためです。

### 14.3 P8へ進めない

DHR result memoに question need observation rows のcountやstatusが出ても、それはP8設計開始ではありません。

```text
p8_start_allowed: false
p8_question_design_started: false
p8_question_implementation_started: false
```

### 14.4 API / DB / RNに触れない

本件はbackend internal-only helper / tests / result memoの範囲です。  
Cocolon app側、API route、DB、response keyは触りません。

---

## 15. acceptance summary

実装完了とみなせる条件:

```text
- DHR-OP00〜OP09 target tests green。
- ELR OP16〜OP19 selected regression green。
- DMD OP00〜OP08 selected regression green。
- ALR OP00〜OP12 selected regression green。
- compileall green。
- result memo body-free closure作成。
- current selected branchが確認済み材料に対して妥当。
- P8 / P5 / P6 / R52 / P7 complete / release がfalseのまま。
- DMD executionがnot performedのまま。
- actual review executionがnot performed hereのまま。
```

実装完了とみなしてはいけない条件:

```text
- full backend suite未確認なのにfull green扱いする。
- RN contract未確認なのにRN green扱いする。
- RN実機未確認なのにreal device verified扱いする。
- actual review未実行なのにreadfeel complete扱いする。
- DMD handoff planをDMD実行済みにする。
- P8質問設計へ進める。
```

---

## 16. 華恋の意見

華恋としては、今回の設計で一番危ないのは、**DMD-compatible receipt candidate があるから、もうdownstreamに渡してよい**と読んでしまうことです。

ELR-OP17のreceipt shapeはかなり強く見えます。  
`source_kind_ref` も actual local-only human review by person で、countも24、guardもtrueにできます。  
でも、今回の確認範囲では、actual reviewそのものを華恋が確認したわけではありません。  
ここを雑に進めると、Cocolonが「読めているか」を確認する前に、構造上だけ「読めたことにする」流れになります。

だから、DHRでは一度止めた方がいいです。  
ただし、止めるだけではなく、次に進む道も明確にします。

```text
- actual evidence claimが本当に揃っているなら、DMD handoff planへ。
- 揃っていないなら、retry/start actual local-only human reviewへ。
- 壊れているなら、repairへ。
- 判断不能なら、manual hold継続へ。
```

私の意見では、現時点のdefaultは retry/start required に寄せるのがよいです。  
理由は、manual holdを続けるだけだと、P7の目的である「実ケースで読めているか」へ近づかず、helper層だけが増えるからです。

ただし、新しいhelperを大きくしすぎるのも危険です。  
実装するなら、DHRはあくまで薄く、DMDを再発明せず、既存DMDに手渡す前のpreflightとして作るのがよいです。

---

## 17. 確認済み

```text
- 本作業は設計書作成であり、コード変更ではない。
- GitHub接続確認はMash指定により不要。
- Cocolon前提資料と作業姿勢資料を確認対象にした。
- ロードマップ上、P7/P8 Bridgeはobservation memoであり、P8 question design / implementationではない。
- ELR-OP00〜OP19は既存実装済みとして扱われている。
- ELR-OP19後のholdは downstream_non_promotion_manual_decision_required として扱われている。
- 次の既定ステップは decide_downstream_manual_handoff_or_retry_without_auto_promotion として扱われている。
- 既存DMD OP00〜OP08はdownstream manual decision / actual evidence status triageを担当している。
- 既存DMD OP01はDMH-OP18 finalizer contractを前提にしているため、ELR-OP19を直結できるとは断定しない。
- ELR-OP17 receipt candidateのshapeとactual review実行確認は分ける必要がある。
```

---

## 18. 未確認

```text
- full backend suite green。
- RN contract green。
- RN実機 modal 確認。
- actual body-full packet generationの実実行。
- actual local-only human reviewの実実行。
- actual operation receiptの実作成。
- sanitized review result rowsの実作成。
- rating rowsの実作成。
- question need observation rowsの実作成。
- disposal / purgeの実実行。
- DMD handoffのmanual decision結果。
- release readiness。
```

---

## 19. 書かれていない

```text
- P8を開始してよいとは書かれていない。
- P8質問仕様を設計してよいとは書かれていない。
- ELR-OP19通過をもって、actual reviewが完了したとは書かれていない。
- helper greenをactual evidenceとして扱ってよいとは書かれていない。
- DMD-compatible receipt candidateだけでdownstreamへ自動実行してよいとは書かれていない。
- DMD handoff planをDMD実行済みとして扱ってよいとは書かれていない。
- P5/P6/P7/releaseをtrueにしてよいとは書かれていない。
```

---

## 20. 推測禁止

```text
- ELRが通ったからP8へ進める、と推測しない。
- receipt candidateがあるからactual review済み、と推測しない。
- DMD-compatibleだからDMD実行済み、と推測しない。
- source_kindがactualだから、今回華恋がactual operationを確認した、と推測しない。
- helper greenが増えたからCocolon体験品質が上がった、と推測しない。
- question need observation rowsをP8質問仕様へ読み替えない。
- ローカル資料にない実機確認・実レビュー・release readinessを完了扱いしない。
```

---

## 21. 次に実行すべきこと

次に行うべきことは、実装段階での最小確認からです。

実装時の最初の順番:

```text
1. 既存DMDがELR-OP19/OP18/OP17を意味的に直接受けられるか、実コードで確認する。
2. 直接受けられない場合、DMH-OP18 finalizer偽装はしない。
3. DHR helperを薄く追加する。
4. DHR-OP00〜OP03でELR closure / hold / receipt candidateを受ける。
5. DHR-OP04でactual source claim separationを入れる。
6. DHR-OP05でbody-free leak / invalid source / promotion claimをscanする。
7. DHR-OP06〜OP07でbranchとmanual decision materialを閉じる。
8. handoff-ready branchだけDHR-OP08 handoff planを作る。ただしDMDは実行しない。
9. DHR-OP09 result memoをbody-freeで閉じる。
10. target tests、ELR selected regression、DMD selected regression、ALR selected regression、compileallを確認する。
```

本設計は、P8開始ではありません。  
本設計は、ELR-OP19後に「downstreamへ渡してよいのか、retry/startへ戻すべきか」を、body-freeかつ自動昇格なしで決めるための設計です。
