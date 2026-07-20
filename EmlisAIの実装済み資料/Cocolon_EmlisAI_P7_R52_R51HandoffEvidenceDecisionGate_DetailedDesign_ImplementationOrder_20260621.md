# Cocolon / EmlisAI P7-R52 R51 Body-Free Handoff Evidence Review / P6-P8 Start Decision Gate 詳細設計書・実装順

作成日: 2026-06-21 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書 / 実装順 / schema案内包  
対象: Cocolon / EmlisAI / P7 Product Quality Runner / P5 Human Blind QA / R51 body-free handoff / P6 limited human readfeel / P8 observation clarification question design material  
基準検討メモ: `Cocolon_EmlisAI_P7_R52_R51Handoff_P6P8StartDecision_PreDesignMemo_20260621.md`  
基準ロードマップ: `Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(4).md`  
GitHub接続確認: Mash指定により不要。未実施。  
コード変更: なし。  
body-full review packet生成: なし。  
P5 Human Blind QA実レビュー: なし。  
reviewer rating記入: なし。  
question need observation row実記入: なし。  
body-full packet / reviewer notes purge実行: なし。  
API / DB / RN UI / public response key変更: なし。  
P8観測補助問い詳細設計: なし。  
json / schema実ファイル化: なし。本文内の案のみ。  
release判断: なし。  

---

## 0. この設計書の結論

今回設計するR52は、P6やP8へ進むための前向きな許可証ではありません。  
R52は、R51が作ったbody-free handoff materialを受け取り、**P5 actual human Blind QAの実レビュー証拠が揃っていないままP6/P8へ進む誤進行を止めるGate**です。

R52の正式候補名は次で固定します。

```text
P7-R52:
R51 Body-Free Handoff Evidence Review
+ P6 / P8 Start Decision Gate without Auto-Allow
```

R52の現在想定される最初のdecisionは、現状基準では次です。

```text
R52_RETURN_TO_R51_ACTUAL_REVIEW_REQUIRED
```

または、実装上のdecision refとしては次でもよいです。

```text
R52_BLOCKED_BY_R51_EVIDENCE_MISSING
```

ただし、Cocolonの作業導線としてユーザーに返すべき意味は、どちらも次です。

```text
R51 actual local-only human reviewが未成立なので、
P6 limited human readfeelにも、P8観測補助問い詳細設計にも進めない。
R51 actual reviewを、local-only / explicit allow / purge planつきで実施する段階へ戻す。
```

R52で絶対にtrue化しないもの:

```text
p6_limited_human_readfeel_start_allowed = false
p8_start_allowed = false
p7_complete = false
release_allowed = false
```

R52で絶対に作らないもの:

```text
body-full packet
reviewer rating actual rows
question need observation actual rows
reviewer notes
question text
P8 question trigger logic
API / DB / RN / response key差分
runtime差分
```

---

## 1. なぜこの作業を行うのか

Cocolonの価値は、ユーザーが残した言葉・感情・カテゴリ・行動・時点・過去記録が、入力直後に「読まれた形」として返ることです。  
P5 User Label Connectionは、その価値の中心です。

ただし、P5の履歴線は強いぶん、失敗すると次の危険があります。

```text
- 履歴で見られすぎて怖い。
- 「あなたはいつも」「原因は」「性格です」に寄る。
- 低情報入力を履歴で深読みする。
- 現在入力を履歴で上書きする。
- 自己責めを増幅する。
- 安全寄りすぎて、Cocolon固有価値ではなく汎用説明に見える。
```

R47〜R51で、local-only review / body-free handoff / disposal / question need observation memoの器は整っています。  
しかし、器があることと、実際にP5履歴線を人間が読んで評価したことは違います。

R52の役割は、この混同を止めることです。

```text
R51 target green = P5合格、ではない。
R51 helper ready = actual review完了、ではない。
P5 confirmed candidate supported = P5 confirmed final、ではない。
P6 start candidate supported = P6 start allowed、ではない。
P8 material candidate supported = P8 start allowed、ではない。
question need observation rowsの器がある = P8設計材料が揃った、ではない。
```

ここを曖昧にすると、P8観測補助問いがP5の弱さを隠す逃げ道になります。  
Cocolonとして今必要なのは、さらに賢い問いを先に足すことではなく、R51で用意した手順に沿って、P5履歴線が本当に「記録が返ってきた感」になっているかを読むことです。

---

## 2. 参照・確認範囲

### 2.1 今回受領したローカル資料

```text
/mnt/data/Cocolon_前提資料(243).zip
/mnt/data/EmlisAIの実装済み資料(74).zip
/mnt/data/Cocolon(247).zip
/mnt/data/mashos-api(160).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(4).md
/mnt/data/Cocolon_EmlisAI_P7_R52_R51Handoff_P6P8StartDecision_PreDesignMemo_20260621(1).md
```

### 2.2 作業姿勢として確認した前提資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/10_cocolon_joint_development_karen_thought_boundary_2026_05_24.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/Cocolon_EmlisAI_UserLabelConnectionObservation_v1_Design_2026-06-03.md
Cocolon_前提資料/Cocolon_EmlisAI_NormalObservation_PublicRecovery_ImplementationStatus_2026-06-06.md
```

作業姿勢として固定すること:

```text
- 前提資料だけで理解した扱いにしない。
- 実ファイルを見ずに完了・green・実施済みと言わない。
- 設計と実装を混ぜない。
- test greenを商品価値合格へ変換しない。
- 書かれていないことを仮説で埋めない。
- API / DB / RN / public response key / runtimeを勝手に変更しない。
- Emlis本体の読感不足を問い返しで補う扱いにしない。
- body-fullを扱う可能性がある作業は、明示許可・local-only root・purge planなしに実行しない。
```

### 2.3 ロードマップ確認

ロードマップ上の現在Phaseは、引き続き次です。

```text
P7 Product Quality Runner / Long-run Product Gate
```

P7/P8 Bridgeの扱い:

```text
- P7中に観測補助問いを実装しない。
- P7のP5 human Blind QA、P6 limited human readfeel、実機modal確認中にbody-free問い必要性観察メモだけを残す。
- P8開始時は、P7で集めた実ケースの観察メモを根拠にする。
- P7完了条件もP8完了条件も、観測補助問いで緩めない。
- raw input / raw answer / comment_text bodyをreview packetやpublic metaへ出さない。
```

### 2.4 参照した実装済み資料

```text
EmlisAIの実装済み資料(74).zip / EmlisAIの実装済み資料/
  - Cocolon_EmlisAI_P7_R47_LocalReviewPacketPolicy_DetailedDesign_ImplementationOrder_20260618.md
  - Cocolon_EmlisAI_P7_R48_P5HumanBlindQAActualReviewPacket_詳細設計書_実装順_20260618.md
  - Cocolon_EmlisAI_P7_R49_P5HumanBlindQA_QuestionNeedObservation_詳細設計書_実装順_20260619.md
  - Cocolon_EmlisAI_P7_R50_P5HumanBlindQAActualReviewManualRunDecision_詳細設計書_実装順_20260620.md
  - Cocolon_EmlisAI_P7_R51_P5HumanBlindQA_LocalOnlyManualRun_DetailedDesign_ImplementationOrder_20260620.md
```

### 2.5 参照した現行実ファイル

backend側:

```text
mashos-api(160).zip / mashos-api/ai/services/ai_inference/
  - emlis_ai_p7_r47_local_review_packet_policy.py
  - emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet.py
  - emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution.py
  - emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision.py
  - emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run.py
```

RN側no-touch確認対象:

```text
Cocolon(247).zip / Cocolon/
  - package.json
  - tests/rn-screen-contracts.test.js
  - screens/InputScreen.js
  - screens/input/useInputFeedbackModal.js
  - screens/input/inputFeedbackModel.js
  - screens/input/InputFeedbackReplyModal.js
```

---

## 3. 現在地の固定

### 3.1 R51後の読み方

R51 helper上、R51-0〜R51-20の器は実装済みとして扱えます。  
ただし、現状で成立していないものがあります。

```text
R51 implemented_steps: R51-0〜R51-20
R51 not_yet_implemented_steps: empty
R51 next_required_step: R51_body_free_handoff_material_ready_for_P6_P8_start_decision_without_auto_allow
P5 confirmed candidate: supported but not final
P6 limited human readfeel start candidate: supported but start_allowed=false
P8 question design material candidate: supported but p8_start_allowed=false
P7 complete: false
release_allowed: false
```

現状で未成立の実作業:

```text
actual external review operation: false
body-full packet generated by helper: false
actual rating rows materialized by helper: false
actual question need observation rows materialized by helper: false
actual disposal run by helper: false
P5 confirmed final: false
P6 limited human readfeel start allowed: false
P8 start allowed: false
P7 complete: false
release_allowed: false
```

したがって、R52の現状decisionは「GO」ではなく、実レビュー証拠不足のNO_GOです。

### 3.2 current received snapshot refreezeの必要性

R51 helper内部には、R51実装時点のsource snapshot refsが含まれます。  
今回の受領zipは次です。

```text
Cocolon_前提資料(243)
EmlisAIの実装済み資料(74)
Cocolon(247)
mashos-api(160)
```

R52では、R51設計時source refsと今回受領source refsを混同しません。  
R52-0で、current received snapshotとして再固定します。

### 3.3 検討メモから引き継ぐvalidation evidence

今回のR52設計は、検討メモで確認済みの以下を前提材料として扱います。  
この設計作業中に再実行したtest結果ではありません。

```text
RN contract: 36 passed
R51 target: 125 passed
R50 target regression: 99 passed
R49 split evidence: 合計76 passed
R49 combined command: timeout / combined green claim禁止
R48 target regression: 82 passed
R47 target regression: 275 passed
R46/display/P5 core subset: 94 passed / 1 warning
backend collect-only: 3591 collected / 1 warning
```

R52実装時は、このvalidation matrixを再取得するか、少なくともR52設計時sourceと実装時sourceの差分を明記します。

---

## 4. R52の対象 / 非対象

### 4.1 R52で扱う対象

```text
- current received snapshot refreeze。
- R51 source refsとcurrent received source refsの分離。
- R51 target / R50 / R49 split / R48 / R47 / R46/display/P5 core / RN / collect-onlyのvalidation evidence整理。
- R51 body-free handoff material intake contract。
- R51 actual review evidence completeness check。
- R51 body-free leak / question text / local path / hash / reviewer free text scan。
- rating rows / question need observation rows / disposal receipt / post-review summaryのbody-free completeness確認。
- R51 actual review evidence missing時のNO_GO decision。
- P5 confirmed candidate / P5 repair return / inconclusiveの判定分離。
- P6 limited human readfeel start candidateとstart_allowedの分離。
- P8 question design material candidateとp8_start_allowedの分離。
- R52 final body-free decision summary。
- no-touch validation。
```

### 4.2 R52で扱わない対象

```text
- body-full packet生成。
- actual human review実行。
- reviewer ratingの新規記入。
- question need observation rowの実ケース記入。
- body-full packet / reviewer notes purge実行。
- reviewer free textの成果物化。
- P8観測補助問い詳細設計。
- 観測補助問いAPI / DB / RN UI / response key。
- 問い発生ロジック。
- 問い回答保存schema。
- Emlis本文runtime変更。
- User Label Connection runtime変更。
- Gate threshold変更。
- RN表示条件変更。
- public meta仕様変更。
- release_allowed true化。
```

---

## 5. R52の基本構造

### 5.1 R52の層構造

R52は、以下の7層で設計します。

```text
Layer A: source / validation refreeze layer
  current received snapshotと検証結果をbody-freeで固定する。

Layer B: R51 body-free handoff intake layer
  R51 R20 boundary validation / R16 summary / R17 decision / R18 P6 handoff / R19 P8 handoffをbody-free入力として受ける。

Layer C: forbidden payload / no-touch scan layer
  raw input / answer / comment_text body / reviewer free text / question text / local path / hash / terminal outputを拒否する。

Layer D: actual review evidence completeness layer
  実レビューが成立したと言える最小証拠が揃っているかを判定する。

Layer E: blocker and consistency decision layer
  disposal未検証、execution blocker、rating-question inconsistency、repair blockerを分類する。

Layer F: P5 / P6 / P8 decision separation layer
  P5 confirmed candidate / repair return / inconclusive / P6 candidate / P8 material candidateを分離し、start_allowedへ自動昇格しない。

Layer G: final no-auto-allow summary layer
  p6_start_allowed=false / p8_start_allowed=false / p7_complete=false / release_allowed=falseを保持したdecision summaryを返す。
```

### 5.2 R52の優先decision順

R52では、複数問題が同時にある場合、次の優先順位でdecisionします。

```text
1. R52_BLOCKED_BY_R51_BODY_FREE_BOUNDARY_RISK
   - body-free materialにraw body / question text / local path / hash / reviewer free text / terminal output等が混入。
   - no-touch mutation true flagが混入。

2. R52_BLOCKED_BY_DISPOSAL_NOT_VERIFIED
   - actual reviewやbody-full generationが成立しているのに、disposal verifiedではない。
   - body_removed / reviewer_notes_removed がfalse。

3. R52_BLOCKED_BY_EXECUTION_BLOCKER_OPEN
   - R51 execution blockerがOPENのまま。

4. R52_RETURN_TO_R51_ACTUAL_REVIEW_REQUIRED
   - actual review evidenceが不足。
   - rating rows / question observation rows / disposal receipt / post-review summaryが成立していない。

5. R52_BLOCKED_BY_RATING_QUESTION_OBSERVATION_INCONSISTENCY
   - P5修正対象をP8 question material candidateへ逃がしている。
   - repair_required_not_questionがP8候補へ混入。

6. R52_RETURN_TO_P5_REPAIR_REQUIRED
   - RED / REPAIR_REQUIRED / creepy / overclaim / self-blame amplification等がある。

7. R52_INCONCLUSIVE_RETURN_TO_R51_REVIEW_OR_RECHECK
   - evidenceは一部揃うが、P5 confirmedにもrepairにも振り切れない。

8. R52_GO_P5_CONFIRMED_CANDIDATE_REVIEWED_BUT_NOT_RELEASE
   - P5 confirmed candidateとしては扱える。
   - ただしP7 complete / release_allowed / P8 start allowedはfalse。

9. R52_P6_LIMITED_READFEEL_START_CANDIDATE_ONLY
   - P6候補として別層へ渡せる。
   - ただしp6_start_allowed=false。

10. R52_P8_QUESTION_DESIGN_MATERIAL_CANDIDATE_ONLY
   - P8詳細設計材料候補として別層へ渡せる。
   - ただしp8_start_allowed=false。
```

現状では、4番の `R52_RETURN_TO_R51_ACTUAL_REVIEW_REQUIRED` が想定結果です。

---

## 6. R52 input contract

### 6.1 R52が受け取ってよいbody-free材料

R52が受け取る材料はbody-freeに限定します。

```text
- current received snapshot refreeze summary
- R51 current source / R50 handoff refreeze summary
- R51 validation evidence note
- R51 R49 timeout note
- R51 admission envelope
- R51 24-case manifest summary
- R51 actual human review run body-free record
- R51 rating row count / axis score averages / verdict counts
- R51 readfeel blocker counts
- R51 execution blocker counts
- R51 question need observation row count / primary class counts
- R51 rating-question consistency result
- R51 disposal receipt summary
- R51 post-review decision summary
- R51 P6 candidate handoff summary
- R51 P8 material candidate handoff summary
- R51 no body leak / no question text / no-touch validation result
```

### 6.2 R52が受け取ってはいけない材料

以下のkeyまたは同義keyがR52入力・中間成果物・final summaryにあった場合は、body-free boundary riskとして落とします。

```text
raw_input
raw_answer
comment_text
comment_text_body
returned_emlis_surface
current_input_review_surface
bounded_owned_history_review_surface
reviewer_free_text
reviewer_note
reviewer_notes
question_text
draft_question_text
question_body
local_absolute_path
body_content_hash
packet_content_hash
terminal_output
stdout
stderr
traceback
```

### 6.3 R52-owned materialのforbidden true flags

R52は、R51 materialを読むだけです。  
そのため、R51側のbody-free materialに含まれる `actual_human_review_run_here` などのR51報告値は、R52 intake時点で `r51_actual_human_review_run_reported` のような `r51_` prefix付きのbody-free evidenceへ正規化して扱います。

一方、R52自身の出力・中間成果物で以下がtrueなら失敗です。

```text
r52_body_full_packet_generated_here
r52_body_full_packets_created_local_only
r52_actual_human_review_run_here
r52_actual_manual_review_run_here
r52_actual_rating_rows_materialized_here
r52_actual_blocker_rows_materialized_here
r52_actual_execution_blocker_rows_materialized_here
r52_actual_question_need_observation_rows_materialized_here
r52_actual_question_need_observation_summary_materialized_here
r52_actual_reviewer_notes_materialized_here
r52_actual_disposal_run_here
r52_disposal_receipt_materialized_here
r52_actual_disposal_receipt_materialized_here
r52_post_review_summary_materialized_here
question_trigger_logic_implemented_here
p8_question_implementation_spec_finalized_here
api_db_rn_response_key_changed_here
runtime_changed_here
api_route_changed_here
db_schema_changed_here
db_migration_changed_here
rn_visible_contract_changed_here
public_response_top_level_key_added_here
p6_limited_human_readfeel_start_allowed
p8_start_allowed
p7_complete
release_allowed
hold004_close_allowed
```

注意:  
R52はR51実行結果を「読んで判定する」だけなので、R51側で実行済みを示すbody-free flagsを参照する場合でも、R52自身が実行したという意味の `r52_*_here` はtrueにしません。  
R52 final summaryには、必要に応じて `r51_actual_*` / `r51_reported_*` prefixを使って区別します。

---

## 7. actual review evidence completeness設計

### 7.1 evidence completeの最小条件

R52で `r51_actual_review_evidence_complete=true` とするには、少なくとも次が必要です。

```text
review_session_status in ["R51_ACTUAL_REVIEW_COMPLETED", "R51_POST_REVIEW_SUMMARY_READY"]
required_case_count == 24
rating_row_count >= 24
question_observation_row_count >= 24
r8_actual_human_review_run_recorded == true
r9_rating_row_normalizer_built == true
r10_readfeel_blocker_execution_blocker_ingestion_built == true
r11_question_need_observation_row_normalizer_built == true
r12_rating_question_observation_consistency_guard_built == true
r14_body_full_packet_reviewer_notes_purge_built == true
r15_disposal_receipt_builder_verifier_built == true
r16_body_free_post_review_summary_builder_built == true
r17_p5_confirmed_repair_return_inconclusive_decision_built == true
r20_no_body_leak_no_question_text_no_touch_boundary_validation_built == true
disposal_verified == true
body_removed == true
reviewer_notes_removed == true
local_packet_exported == false
content_hash_of_body_stored == false
open_execution_blocker_count == 0
body_free == true
```

### 7.2 evidence missingの判定

上記のいずれかが不足する場合、R52は原則として次へ倒します。

```text
R52_RETURN_TO_R51_ACTUAL_REVIEW_REQUIRED
```

missing evidence refsはbody-free identifiersのみで残します。

例:

```text
missing_evidence_refs:
  - r51_actual_human_review_run_missing
  - r51_rating_rows_missing
  - r51_question_need_observation_rows_missing
  - r51_disposal_receipt_missing
  - r51_post_review_summary_missing
```

現状の想定missing refs:

```text
- r51_actual_external_review_operation_missing
- r51_body_full_packet_generation_missing
- r51_actual_rating_rows_missing
- r51_actual_question_need_observation_rows_missing
- r51_actual_disposal_receipt_missing
- r51_p5_confirmed_final_missing
```

### 7.3 disposal未検証とevidence missingの分離

R52では、disposal未検証をevidence missingに潰しません。

```text
actual review / body-full generationが実行されていない:
  -> R52_RETURN_TO_R51_ACTUAL_REVIEW_REQUIRED

actual review / body-full generationが実行されたが、disposalが未検証:
  -> R52_BLOCKED_BY_DISPOSAL_NOT_VERIFIED
```

理由:

```text
body-fullを作った後のpurge未確認は、単なる未実施ではなく、ユーザーデータ保護上のblockerであるため。
```

---

## 8. P5 decision設計

### 8.1 P5 decision status enum

R52では、P5状態を次のenumで扱います。

```text
R52_P5_NOT_REVIEWED_EVIDENCE_MISSING
R52_P5_CONFIRMED_CANDIDATE_REVIEWED_NOT_FINAL
R52_P5_REPAIR_REQUIRED
R52_P5_INCONCLUSIVE_REVIEW_REQUIRED
R52_P5_BLOCKED_BY_BOUNDARY_RISK
R52_P5_BLOCKED_BY_DISPOSAL_NOT_VERIFIED
R52_P5_BLOCKED_BY_EXECUTION_BLOCKER
R52_P5_BLOCKED_BY_CONSISTENCY_ISSUE
```

### 8.2 P5 confirmed candidate条件

P5 confirmed candidateは、次をすべて満たす場合にだけ候補化します。

```text
r51_actual_review_evidence_complete == true
all_axis_targets_met == true
red_count == 0
critical_repair_blocker_count == 0
creepy_or_surveillance_blocker_count == 0
overclaim_blocker_count == 0
self_blame_amplification_blocker_count == 0
open_execution_blocker_count == 0
rating_question_consistency_status == "passed"
disposal_verified == true
body_free_boundary_validated == true
```

ただし、これでも次はfalseのままです。

```text
p5_human_blind_qa_confirmed = false
p7_complete = false
release_allowed = false
```

R52で扱うのは、あくまで `P5 confirmed candidate reviewed but not release` です。

### 8.3 P5 repair return条件

次のいずれかがあれば、R52はP5 repair returnに倒します。

```text
red_count > 0
repair_required_count > 0
critical_repair_blocker_count > 0
creepy_or_surveillance_blocker_count > 0
overclaim_blocker_count > 0
self_blame_amplification_blocker_count > 0
p5_surface_or_gate_repair_observation_count > 0
emlis_readfeel_repair_observation_count > 0
all_axis_targets_met == false
```

P5修正対象をP8 question material candidateへ混ぜることは禁止です。

### 8.4 inconclusive条件

次はinconclusiveとしてR51再確認へ戻します。

```text
rating_row_countは足りているが、axis averagesが算出不能。
question observation row countは足りているが、primary class countsが空。
review_session_statusがcompletedでもdisposal receiptの整合が曖昧。
consistency issueはないが、P5 confirmedにもrepairにも振り切れない。
R49 wildcard timeout noteがR52 decisionを誤ってgreen扱いしている可能性がある。
```

---

## 9. P6 limited human readfeel decision設計

### 9.1 P6 candidateとstart_allowedを分ける

R52は、P6 limited human readfeelの開始許可を出しません。  
出してよいのは、次の候補状態だけです。

```text
p6_limited_human_readfeel_start_allowed_candidate = true/false
p6_limited_human_readfeel_start_allowed = false
```

### 9.2 P6 candidate条件

P6候補にできる条件:

```text
r51_actual_review_evidence_complete == true
p5_decision_status == "R52_P5_CONFIRMED_CANDIDATE_REVIEWED_NOT_FINAL"
critical_repair_blocker_count == 0
creepy_or_surveillance_blocker_count == 0
overclaim_blocker_count == 0
self_blame_amplification_blocker_count == 0
P5弱さをP6の深い読解で覆い隠す危険が低い
P6 limited familyに進んでもP5修正対象を隠さない
```

### 9.3 P6 candidateを出さない条件

```text
R51 actual review evidence missing
P5 repair return
P5 inconclusive
body-free boundary risk
execution blocker open
disposal not verified
rating-question inconsistency
creepy / overclaim / self-blame blockerあり
```

---

## 10. P8 question design material decision設計

### 10.1 P8 material candidateとp8_start_allowedを分ける

R52はP8観測補助問いの詳細設計を開始しません。  
出してよいのは、次の材料候補状態だけです。

```text
p8_question_design_material_candidate = true/false
p8_start_allowed = false
```

### 10.2 P8 material candidate条件

P8材料候補として採用できる条件:

```text
r51_actual_review_evidence_complete == true
question_observation_row_count >= 24
rating_question_consistency_status == "passed"
question_need_primary_class_countsがbody-freeで存在する
repair_required_not_questionがP8候補へ混入していない
P5 repair return対象をP8材料候補に混ぜていない
raw input / raw answer / comment_text body / reviewer free text / question textが含まれていない
p8_start_allowed == false
```

### 10.3 P8 material candidateから除外する条件

```text
R51 actual review evidence missing
question observation rowが未作成
question observation rowがcase数不足
rating-question consistency issueあり
repair_required_not_questionが多い
P5の履歴線が弱いだけのケースをquestion need扱いしている
creepy / overclaim / self-blame blockerがある
raw body / question text / local path / hash / reviewer free textが混入
```

### 10.4 P8詳細設計との境界

R52で書いてよいこと:

```text
どのprimary classが何件あるか。
one_question_fitのbody-free counts。
ambiguity kindのbody-free counts。
Plus向け1問候補 / Premium深掘り候補のcounts。
repair_required_not_questionのcounts。
```

R52で書いてはいけないこと:

```text
実際の問い文。
question_text / draft_question_text。
問い発生ロジック。
API / DB / RN UI案の確定。
response key案の確定。
問い回答保存schemaの実ファイル化。
```

---

## 11. R52 decision refs

R52で出してよいdecision refs:

```text
R52_GO_P5_CONFIRMED_CANDIDATE_REVIEWED_BUT_NOT_RELEASE
R52_RETURN_TO_P5_REPAIR_REQUIRED
R52_RETURN_TO_R51_ACTUAL_REVIEW_REQUIRED
R52_BLOCKED_BY_R51_EVIDENCE_MISSING
R52_BLOCKED_BY_R51_BODY_FREE_BOUNDARY_RISK
R52_BLOCKED_BY_DISPOSAL_NOT_VERIFIED
R52_BLOCKED_BY_EXECUTION_BLOCKER_OPEN
R52_BLOCKED_BY_RATING_QUESTION_OBSERVATION_INCONSISTENCY
R52_P6_LIMITED_READFEEL_START_CANDIDATE_ONLY
R52_P8_QUESTION_DESIGN_MATERIAL_CANDIDATE_ONLY
R52_NO_GO_P6_P8_START
R52_INCONCLUSIVE_RETURN_TO_R51_REVIEW_OR_RECHECK
```

R52で出してはいけないdecision refs:

```text
R52_RELEASE_ALLOWED
R52_P7_COMPLETE
R52_P8_START_ALLOWED
R52_P6_START_ALLOWED
R52_P5_CONFIRMED_FINAL
R52_QUESTION_IMPLEMENTATION_ALLOWED
R52_API_DB_RN_CHANGE_ALLOWED
```

---

## 12. JSON / schema案

この章のjson / schemaは、実装時の検討材料です。  
今回の成果物では実ファイル化しません。

### 12.1 `p7_r52_current_received_snapshot_refreeze.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r52.current_received_snapshot_refreeze.bodyfree.v1",
  "title": "P7-R52 Current Received Snapshot Refreeze Body-Free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "phase",
    "step",
    "scope",
    "current_phase",
    "source_mode",
    "current_received_snapshot_refs",
    "r51_helper_source_snapshot_refs",
    "source_refs_are_separated",
    "git_check_required",
    "git_check_performed",
    "body_free",
    "p6_limited_human_readfeel_start_allowed",
    "p8_start_allowed",
    "p7_complete",
    "release_allowed"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r52.current_received_snapshot_refreeze.bodyfree.v1" },
    "phase": { "const": "P7" },
    "step": { "const": "R52_R51BodyFreeHandoffEvidenceDecisionGate_20260621" },
    "scope": { "const": "r51_bodyfree_handoff_p6_p8_start_decision_gate" },
    "current_phase": { "const": "P7_ProductQualityRunner_LongRunProductGate" },
    "source_mode": { "const": "local_snapshot" },
    "current_received_snapshot_refs": {
      "type": "array",
      "items": { "type": "string" },
      "contains": { "const": "mashos-api(160).zip" }
    },
    "r51_helper_source_snapshot_refs": {
      "type": "array",
      "items": { "type": "string" }
    },
    "source_refs_are_separated": { "const": true },
    "git_check_required": { "const": false },
    "git_check_performed": { "const": false },
    "body_free": { "const": true },
    "p6_limited_human_readfeel_start_allowed": { "const": false },
    "p8_start_allowed": { "const": false },
    "p7_complete": { "const": false },
    "release_allowed": { "const": false }
  }
}
```

### 12.2 `p7_r52_r51_bodyfree_handoff_intake.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r52.r51_bodyfree_handoff_intake.bodyfree.v1",
  "title": "P7-R52 R51 Body-Free Handoff Intake",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "phase",
    "step",
    "scope",
    "review_session_id",
    "r51_material_refs",
    "r51_r20_boundary_validation_status",
    "r51_next_required_step",
    "r51_body_free",
    "forbidden_payload_keys_absent",
    "forbidden_true_flags_absent",
    "body_free",
    "p6_limited_human_readfeel_start_allowed",
    "p8_start_allowed",
    "p7_complete",
    "release_allowed"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r52.r51_bodyfree_handoff_intake.bodyfree.v1" },
    "phase": { "const": "P7" },
    "step": { "const": "R52_R51BodyFreeHandoffEvidenceDecisionGate_20260621" },
    "scope": { "const": "r51_bodyfree_handoff_p6_p8_start_decision_gate" },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 180 },
    "r51_material_refs": {
      "type": "array",
      "items": { "type": "string", "minLength": 1, "maxLength": 220 }
    },
    "r51_r20_boundary_validation_status": {
      "enum": [
        "R51_NO_BODY_LEAK_NO_QUESTION_TEXT_NO_TOUCH_BOUNDARY_VALIDATED",
        "R51_NO_BODY_LEAK_NO_QUESTION_TEXT_NO_TOUCH_BOUNDARY_NOT_READY",
        "R51_BODY_FREE_BOUNDARY_RISK_DETECTED"
      ]
    },
    "r51_next_required_step": { "type": "string", "minLength": 1, "maxLength": 220 },
    "r51_body_free": { "const": true },
    "forbidden_payload_keys_absent": { "const": true },
    "forbidden_true_flags_absent": { "const": true },
    "body_free": { "const": true },
    "p6_limited_human_readfeel_start_allowed": { "const": false },
    "p8_start_allowed": { "const": false },
    "p7_complete": { "const": false },
    "release_allowed": { "const": false }
  },
  "not": {
    "anyOf": [
      { "required": ["raw_input"] },
      { "required": ["raw_answer"] },
      { "required": ["comment_text"] },
      { "required": ["comment_text_body"] },
      { "required": ["returned_emlis_surface"] },
      { "required": ["reviewer_free_text"] },
      { "required": ["reviewer_notes"] },
      { "required": ["question_text"] },
      { "required": ["draft_question_text"] },
      { "required": ["question_body"] },
      { "required": ["local_absolute_path"] },
      { "required": ["body_content_hash"] },
      { "required": ["packet_content_hash"] },
      { "required": ["terminal_output"] },
      { "required": ["stdout"] },
      { "required": ["stderr"] },
      { "required": ["traceback"] }
    ]
  }
}
```

### 12.3 `p7_r52_actual_review_evidence_completeness.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r52.actual_review_evidence_completeness.bodyfree.v1",
  "title": "P7-R52 Actual Review Evidence Completeness",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "phase",
    "step",
    "scope",
    "required_case_count",
    "rating_row_count",
    "question_observation_row_count",
    "r51_actual_review_evidence_complete",
    "missing_evidence_refs",
    "disposal_verified",
    "body_removed",
    "reviewer_notes_removed",
    "open_execution_blocker_count",
    "body_free",
    "p6_limited_human_readfeel_start_allowed",
    "p8_start_allowed",
    "p7_complete",
    "release_allowed"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r52.actual_review_evidence_completeness.bodyfree.v1" },
    "phase": { "const": "P7" },
    "step": { "const": "R52_R51BodyFreeHandoffEvidenceDecisionGate_20260621" },
    "scope": { "const": "r51_bodyfree_handoff_p6_p8_start_decision_gate" },
    "required_case_count": { "const": 24 },
    "rating_row_count": { "type": "integer", "minimum": 0 },
    "question_observation_row_count": { "type": "integer", "minimum": 0 },
    "r51_actual_review_evidence_complete": { "type": "boolean" },
    "missing_evidence_refs": {
      "type": "array",
      "items": { "type": "string", "minLength": 1, "maxLength": 220 }
    },
    "disposal_verified": { "type": "boolean" },
    "body_removed": { "type": "boolean" },
    "reviewer_notes_removed": { "type": "boolean" },
    "open_execution_blocker_count": { "type": "integer", "minimum": 0 },
    "body_free": { "const": true },
    "p6_limited_human_readfeel_start_allowed": { "const": false },
    "p8_start_allowed": { "const": false },
    "p7_complete": { "const": false },
    "release_allowed": { "const": false }
  }
}
```

### 12.4 `p7_r52_decision_gate_result.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r52.decision_gate_result.bodyfree.v1",
  "title": "P7-R52 Decision Gate Result Body-Free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "phase",
    "step",
    "scope",
    "decision_ref",
    "decision_status",
    "decision_reason_refs",
    "next_required_step",
    "r51_actual_review_evidence_complete",
    "p5_decision_status",
    "p6_limited_human_readfeel_start_allowed_candidate",
    "p6_limited_human_readfeel_start_allowed",
    "p8_question_design_material_candidate",
    "p8_start_allowed",
    "p7_complete",
    "release_allowed",
    "body_free",
    "public_contract",
    "no_touch_contract"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r52.decision_gate_result.bodyfree.v1" },
    "phase": { "const": "P7" },
    "step": { "const": "R52_R51BodyFreeHandoffEvidenceDecisionGate_20260621" },
    "scope": { "const": "r51_bodyfree_handoff_p6_p8_start_decision_gate" },
    "decision_ref": {
      "enum": [
        "R52_GO_P5_CONFIRMED_CANDIDATE_REVIEWED_BUT_NOT_RELEASE",
        "R52_RETURN_TO_P5_REPAIR_REQUIRED",
        "R52_RETURN_TO_R51_ACTUAL_REVIEW_REQUIRED",
        "R52_BLOCKED_BY_R51_EVIDENCE_MISSING",
        "R52_BLOCKED_BY_R51_BODY_FREE_BOUNDARY_RISK",
        "R52_BLOCKED_BY_DISPOSAL_NOT_VERIFIED",
        "R52_BLOCKED_BY_EXECUTION_BLOCKER_OPEN",
        "R52_BLOCKED_BY_RATING_QUESTION_OBSERVATION_INCONSISTENCY",
        "R52_P6_LIMITED_READFEEL_START_CANDIDATE_ONLY",
        "R52_P8_QUESTION_DESIGN_MATERIAL_CANDIDATE_ONLY",
        "R52_NO_GO_P6_P8_START",
        "R52_INCONCLUSIVE_RETURN_TO_R51_REVIEW_OR_RECHECK"
      ]
    },
    "decision_status": {
      "enum": [
        "NO_GO",
        "BLOCKED",
        "RETURN_REQUIRED",
        "CANDIDATE_ONLY",
        "INCONCLUSIVE"
      ]
    },
    "decision_reason_refs": {
      "type": "array",
      "items": { "type": "string", "minLength": 1, "maxLength": 220 }
    },
    "next_required_step": { "type": "string", "minLength": 1, "maxLength": 240 },
    "r51_actual_review_evidence_complete": { "type": "boolean" },
    "p5_decision_status": { "type": "string", "minLength": 1, "maxLength": 220 },
    "p6_limited_human_readfeel_start_allowed_candidate": { "type": "boolean" },
    "p6_limited_human_readfeel_start_allowed": { "const": false },
    "p8_question_design_material_candidate": { "type": "boolean" },
    "p8_start_allowed": { "const": false },
    "p7_complete": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true },
    "public_contract": { "type": "object" },
    "no_touch_contract": { "type": "object" }
  }
}
```

### 12.5 現状想定のR52 final result object例

これは実ファイルではなく、設計上の期待形です。

```json
{
  "schema_version": "cocolon.emlis.p7_r52.decision_gate_result.bodyfree.v1",
  "phase": "P7",
  "step": "R52_R51BodyFreeHandoffEvidenceDecisionGate_20260621",
  "scope": "r51_bodyfree_handoff_p6_p8_start_decision_gate",
  "decision_ref": "R52_RETURN_TO_R51_ACTUAL_REVIEW_REQUIRED",
  "decision_status": "RETURN_REQUIRED",
  "decision_reason_refs": [
    "r51_actual_external_review_operation_missing",
    "r51_actual_rating_rows_missing",
    "r51_actual_question_need_observation_rows_missing",
    "r51_actual_disposal_receipt_missing",
    "r51_p5_confirmed_final_missing"
  ],
  "next_required_step": "R51_actual_local_only_human_review_required_with_explicit_allow_local_root_purge_plan",
  "r51_actual_review_evidence_complete": false,
  "p5_decision_status": "R52_P5_NOT_REVIEWED_EVIDENCE_MISSING",
  "p6_limited_human_readfeel_start_allowed_candidate": false,
  "p6_limited_human_readfeel_start_allowed": false,
  "p8_question_design_material_candidate": false,
  "p8_start_allowed": false,
  "p7_complete": false,
  "release_allowed": false,
  "body_free": true,
  "public_contract": {
    "public_response_top_level_key_added_here": false,
    "rn_visible_contract_changed_here": false,
    "api_db_rn_response_key_changed_here": false
  },
  "no_touch_contract": {
    "r52_body_full_packet_generated_here": false,
    "r52_actual_human_review_run_here": false,
    "question_trigger_logic_implemented_here": false,
    "runtime_changed_here": false
  }
}
```

---

## 13. Python helper設計案

実装時に新規helperを作る場合の候補です。  
既存R51 helperだけでR52判定を安全に表現できる場合は、新規helperを作らず、R52設計書とtestだけで足りる可能性があります。  
実ファイル化は実装段階で判断します。

### 13.1 production候補

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate.py
```

### 13.2 import候補

```python
from emlis_ai_p7_contracts import (
    P7_PHASE,
    P7_SOURCE_MODE,
    assert_p7_no_body_payload_or_contract_mutation,
    body_free_flags,
    clean_identifier,
    dedupe_identifiers,
    public_contract_flags,
    safe_mapping,
)

from emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run import (
    P7_R51_REQUIRED_CASE_COUNT,
    P7_R51_ACTUAL_REVIEW_RESULT_INPUT_FORBIDDEN_KEY_REFS,
    P7_R51_R20_IMPLEMENTED_STEPS,
    P7_R51_R20_NOT_YET_IMPLEMENTED_STEPS,
    build_p7_r51_no_body_leak_no_question_text_no_touch_boundary_validation,
    assert_p7_r51_no_body_leak_no_question_text_no_touch_boundary_validation_bodyfree_contract,
)
```

実装時に必要であれば、R51のR16/R17/R18/R19 builder / contractも読み取り専用でimportします。  
ただし、R52側でR51 actual reviewを実行するbuilderやlocal file operation helperを呼ばない設計にします。

### 13.3 function候補

```python
def build_p7_r52_current_received_snapshot_refreeze(...) -> dict[str, Any]:
    """R52-0: current received snapshot and R51 helper source refs separation."""


def assert_p7_r52_current_received_snapshot_refreeze_contract(refreeze: Mapping[str, Any]) -> bool:
    """R52-0 contract."""


def build_p7_r52_r51_bodyfree_handoff_intake(...) -> dict[str, Any]:
    """R52-1/R52-2: intake only body-free R51 handoff material."""


def assert_p7_r52_r51_bodyfree_handoff_intake_contract(intake: Mapping[str, Any]) -> bool:
    """Reject raw body/question/local/hash/reviewer free text/no-touch mutation."""


def build_p7_r52_actual_review_evidence_completeness(...) -> dict[str, Any]:
    """R52-4: decide whether R51 actual review evidence is complete."""


def build_p7_r52_p5_p6_p8_decision_gate_result(...) -> dict[str, Any]:
    """R52 final decision composer with no-auto-allow flags."""


def assert_p7_r52_p5_p6_p8_decision_gate_result_contract(result: Mapping[str, Any]) -> bool:
    """Ensure P6/P8/P7/release are never auto-allowed."""
```

### 13.4 R52で作らないhelper

```text
body-full packet writer
reviewer form writer
actual reviewer notes reader
actual rating row file importer
question text generator
P8 question trigger planner
API response composer
DB migration helper
RN UI helper
runtime reply changer
```

---

## 14. 実装順詳細

### R52-0: current received snapshot / R51 source ref separation

目的:

```text
R51実装時source refsと、今回受領したcurrent local snapshot refsを混同しない。
```

入力:

```text
current_received_snapshot_refs:
  - Cocolon_前提資料(243).zip
  - EmlisAIの実装済み資料(74).zip
  - Cocolon(247).zip
  - mashos-api(160).zip
  - Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(4).md
  - Cocolon_EmlisAI_P7_R52_R51Handoff_P6P8StartDecision_PreDesignMemo_20260621(1).md
```

出力:

```text
p7_r52_current_received_snapshot_refreeze.bodyfree
```

必須:

```text
git_check_required=false
git_check_performed=false
source_refs_are_separated=true
p6_start_allowed=false
p8_start_allowed=false
p7_complete=false
release_allowed=false
```

### R52-1: validation evidence matrix freeze

目的:

```text
R51後判断に使うvalidation evidenceを、green / split / timeout / collect-only / warning / 未確認に分ける。
```

入力:

```text
RN contract 36 passed
R51 target 125 passed
R50 target 99 passed
R49 split 76 passed
R49 combined timeout
R48 target 82 passed
R47 target 275 passed
R46/display/P5 core 94 passed / 1 warning
backend collect-only 3591 collected / 1 warning
```

禁止:

```text
R49 split evidenceをR49 combined greenに変換しない。
backend collect-onlyをfull backend suite greenに変換しない。
RN contract greenを実機modal読感確認に変換しない。
```

### R52-2: R51 body-free handoff intake contract

目的:

```text
R51 R20 boundary validation / R16 summary / R17 decision / R18 P6 handoff / R19 P8 handoffをbody-free入力として受ける器を定義する。
```

入力可能:

```text
counts
booleans
enum refs
sanitized reason ids
axis averages
case counts
blocker counts
question primary class counts
decision refs
```

入力不可:

```text
raw input / answer / comment_text body / reviewer free text / question text / local path / body hash / terminal output
```

### R52-3: forbidden payload deep scan

目的:

```text
R52 input / intermediate / final materialに本文系key・質問本文・local path・hash・reviewer free textが混入していないかを再帰的に見る。
```

落とす条件:

```text
forbidden key path found
forbidden true flag found
public response key mutation true
runtime mutation true
RN/API/DB mutation true
```

decision:

```text
R52_BLOCKED_BY_R51_BODY_FREE_BOUNDARY_RISK
```

### R52-4: actual review evidence completeness checker

目的:

```text
R51 actual reviewが成立したかを、R51 helper readyやtarget greenではなく、実レビュー証拠の有無で判定する。
```

見るもの:

```text
review_session_status
rating_row_count
question_observation_row_count
disposal_verified
body_removed
reviewer_notes_removed
open_execution_blocker_count
r8/r9/r10/r11/r12/r14/r15/r16/r17/r20 built flags
```

現状想定:

```text
r51_actual_review_evidence_complete=false
```

### R52-5: evidence missing NO_GO branch

目的:

```text
actual review evidence missing時に、P6/P8へ誤って進まないdecisionを出す。
```

decision:

```text
R52_RETURN_TO_R51_ACTUAL_REVIEW_REQUIRED
```

または実装内部分類:

```text
R52_BLOCKED_BY_R51_EVIDENCE_MISSING
```

next_required_step:

```text
R51_actual_local_only_human_review_required_with_explicit_allow_local_root_purge_plan
```

### R52-6: disposal safety gate

目的:

```text
body-full materialが実際に作られた後に、廃棄未検証のままdecision material化しない。
```

落とす条件:

```text
r51_actual_body_full_material_created == true
and disposal_verified != true
```

decision:

```text
R52_BLOCKED_BY_DISPOSAL_NOT_VERIFIED
```

### R52-7: execution blocker gate

目的:

```text
R51 execution blockerが残ったままP5/P6/P8判断をしない。
```

落とす条件:

```text
open_execution_blocker_count > 0
```

decision:

```text
R52_BLOCKED_BY_EXECUTION_BLOCKER_OPEN
```

### R52-8: rating-question consistency gate

目的:

```text
P5の修正対象を、P8 question material candidateへ逃がさない。
```

落とす条件:

```text
rating_question_consistency_status != passed
repair_required_not_questionがP8 candidateへ混入
RED/REPAIR_REQUIREDがquestion candidateとして扱われている
```

decision:

```text
R52_BLOCKED_BY_RATING_QUESTION_OBSERVATION_INCONSISTENCY
```

### R52-9: P5 readfeel blocker gate

目的:

```text
P5履歴線が商品価値・安全性で修正対象の場合、P6/P8へ進めずP5修正へ戻す。
```

見るもの:

```text
red_count
repair_required_count
critical_repair_blocker_count
creepy_or_surveillance_blocker_count
overclaim_blocker_count
self_blame_amplification_blocker_count
p5_surface_or_gate_repair_observation_count
emlis_readfeel_repair_observation_count
axis_target_missed_refs
```

decision:

```text
R52_RETURN_TO_P5_REPAIR_REQUIRED
```

### R52-10: P5 confirmed candidate decision

目的:

```text
P5 actual reviewが成立し、repair blockerがない場合に、P5 confirmed candidateとして扱う。
```

出力:

```text
p5_decision_status=R52_P5_CONFIRMED_CANDIDATE_REVIEWED_NOT_FINAL
p5_human_blind_qa_confirmed=false
p7_complete=false
release_allowed=false
```

### R52-11: P6 limited human readfeel candidate separation

目的:

```text
P6候補を出すとしても、start_allowedへ自動昇格しない。
```

出力可能:

```text
p6_limited_human_readfeel_start_allowed_candidate=true
p6_limited_human_readfeel_start_allowed=false
```

### R52-12: P8 question material candidate separation

目的:

```text
P8詳細設計材料候補を出すとしても、P8開始許可へ自動昇格しない。
```

出力可能:

```text
p8_question_design_material_candidate=true
p8_start_allowed=false
```

禁止:

```text
question_text生成
draft_question_text生成
question trigger logic確定
API / DB / RN / response key設計確定
```

### R52-13: final decision composer

目的:

```text
R52のdecision refs、reason refs、next_required_step、candidate flagsをbody-freeに集約する。
```

必須:

```text
body_free=true
p6_limited_human_readfeel_start_allowed=false
p8_start_allowed=false
p7_complete=false
release_allowed=false
```

### R52-14: no-touch boundary validation

目的:

```text
R52がRN / API / DB / runtime / public response contract / P8実装を触っていないことを固定する。
```

見る対象:

```text
production helper候補以外の変更なし
RN production files no-touch
RN contract tests no-touch
API route no-touch
DB migration no-touch
public response top-level key no-touch
Emlis runtime no-touch
User Label Connection runtime no-touch
```

### R52-15: documentation output

目的:

```text
R52設計・実装順・schema案・validation matrix・acceptance criteriaをmdに残す。
```

今回この設計書が該当します。

---

## 15. 新規test設計案

実装時にR52 helperを作るなら、testは分割します。  
ファイル名は案です。

```text
mashos-api/ai/tests/
  test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_r0_r1_20260621.py
  test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_r2_r3_20260621.py
  test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_r4_r5_20260621.py
  test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_r6_r7_20260621.py
  test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_r8_r9_20260621.py
  test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_r10_r12_20260621.py
  test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_r13_r15_20260621.py
```

### 15.1 必須positive tests

```text
- R52-0 current received snapshot refreezeがsource refsを混同しない。
- R52-1 validation evidence matrixがR49 splitを保持し、combined green claimをしない。
- R52-2 intakeがbody-free materialだけを受け取れる。
- R52-2 intakeがR51 reported actual flagsを `r51_` prefix付きevidenceへ正規化できる。
- R52-4 actual review evidence missing時にRETURN_TO_R51_ACTUAL_REVIEW_REQUIREDになる。
- R52 final resultでp6_start_allowed / p8_start_allowed / p7_complete / release_allowedがfalseのまま。
- R52 P5 confirmed candidate時でもrelease_allowed=false。
- R52 P6 candidate時でもp6_start_allowed=false。
- R52 P8 material candidate時でもp8_start_allowed=false。
```

### 15.2 必須negative tests

```text
- raw_inputがinputにあると落ちる。
- comment_text_bodyがinputにあると落ちる。
- returned_emlis_surfaceがsummaryにあると落ちる。
- reviewer_free_textがbody-free materialにあると落ちる。
- question_text / draft_question_textがあると落ちる。
- local_absolute_pathがあると落ちる。
- body_content_hash / packet_content_hashがあると落ちる。
- terminal_output / stdout / stderr / tracebackがあると落ちる。
- R52-owned `r52_actual_human_review_run_here=true` で落ちる。
- R51 reported actual flagsを未正規化のままR52 final summaryへ流すと落ちる。
- p6_limited_human_readfeel_start_allowed=trueで落ちる。
- p8_start_allowed=trueで落ちる。
- p7_complete=trueで落ちる。
- release_allowed=trueで落ちる。
- R51 actual review missingなのにP8 material candidate trueで落ちる。
- RED / REPAIR_REQUIREDをP8 material candidateへ逃がすと落ちる。
- disposal未検証なのにdecision successにすると落ちる。
```

### 15.3 regression tests

```text
- R51 target regressionを維持する。
- R50 target regressionを維持する。
- R49 split evidenceを維持する。
- R48 target regressionを維持する。
- R47 target regressionを維持する。
- R46/display/P5 core subsetを維持する。
- RN contractを維持する。
- backend collect-onlyを維持する。
```

---

## 16. validation command matrix案

実装段階で実行する候補です。  
この設計書作成時点では実行していません。

### 16.1 R52 target

```bash
cd /path/to/mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_*.py
```

### 16.2 R51 target regression

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_*.py
```

期待:

```text
125 passedを維持
```

### 16.3 R50 target regression

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_*.py
```

期待:

```text
99 passedを維持
```

### 16.4 R49 split regression

R49はcombined / wildcard bulk green claimを禁止します。  
分割確認のまま扱います。

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r0_r9_*.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r10_r11_*.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r12_r13_*.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r14_r15_*.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r16_r18_*.py
```

期待:

```text
split合計76 passed相当を維持
combined greenとは書かない
```

### 16.5 R48 / R47 regression

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_*.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r47_local_review_packet_policy_*.py
```

期待:

```text
R48: 82 passed維持
R47: 275 passed維持
```

### 16.6 R46 / display / P5 core subset

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_projection_next_decision_r45_r46_20260617.py \
  tests/test_emlis_ai_p7_r46_next_decision_handoff_ledger_r14_20260617.py \
  tests/test_emlis_ai_p7_r46_p5_p6_human_readfeel_handoff_material_r10_r11_20260617.py \
  tests/test_emlis_ai_p7_r46_real_device_modal_review_closed_validation_r12_r13_20260617.py \
  tests/test_emlis_ai_display_contract.py \
  tests/test_emlis_ai_user_label_connection_material.py \
  tests/test_emlis_ai_user_label_connection_candidate.py \
  tests/test_emlis_ai_user_label_connection_gate.py \
  tests/test_emlis_ai_user_label_connection_surface.py \
  tests/test_emlis_ai_user_label_connection_public_boundary.py \
  tests/test_emlis_ai_user_label_connection_e2e_contract.py
```

期待:

```text
94 passed / 1 warning維持
warningはPydantic V1 root_validator deprecationとして既知扱い
```

### 16.7 backend collect-only

```bash
PYTHONPATH=services/ai_inference pytest --collect-only -q
```

期待:

```text
3591 collected / 1 warning相当を維持
collect-onlyをfull backend suite greenとは呼ばない
```

### 16.8 RN contract

```bash
cd /path/to/Cocolon
npm run test:rn-screens --silent
```

期待:

```text
36 passed維持
RN contract greenを実機modal読感確認とは呼ばない
```

---

## 17. no-touch boundary

R52実装で触ってよい候補:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate.py
mashos-api/ai/tests/test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_*.py
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R52_R51HandoffEvidenceDecisionGate_DetailedDesign_ImplementationOrder_20260621.md
```

R52実装で触らないもの:

```text
Cocolon/screens/InputScreen.js
Cocolon/screens/input/useInputFeedbackModal.js
Cocolon/screens/input/inputFeedbackModel.js
Cocolon/screens/input/InputFeedbackReplyModal.js
Cocolon/tests/rn-screen-contracts.test.js
mashos-api/ai/services/ai_inference/emotion_submit_service.py
mashos-api/ai/services/ai_inference/api_emotion_submit.py
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_*.py
DB migration files
API route files
public response contract files
P8 question implementation files
```

R52で追加しないもの:

```text
new public response top-level key
new RN modal field
new DB table
new DB column
new API route
new runtime branch
new Gate threshold
new case専用surface
new fixed commentText
```

---

## 18. acceptance criteria

### 18.1 設計書としての完了条件

```text
- R52がR51 evidence review / P6-P8 start decision gateであることを固定した。
- R52がP8観測補助問い詳細設計ではないことを固定した。
- R52がactual review実行ではないことを固定した。
- R52がbody-full packetを生成しないことを固定した。
- R52がAPI / DB / RN / response key / runtimeを触らないことを固定した。
- R51 actual review evidence missing時のNO_GO分岐を定義した。
- P5 confirmed final / P5 repair return / inconclusiveを分離した。
- P6 limited human readfeel start candidateとstart_allowedを分離した。
- P8 question design material candidateとp8_start_allowedを分離した。
- no body leak / no question text / no local path / no hash / no reviewer free textを必須境界にした。
- R51 target greenをP5合格へ変換しないことを明記した。
- P8開始条件を緩めないことを明記した。
- json / schema案を本文内に入れ、実ファイル化は実装段階判断にした。
- 実装順R52-0〜R52-15を定義した。
```

### 18.2 実装完了条件候補

```text
- R52 helper / testsがbody-free evidence gateとしてgreen。
- R51 target regression 125 passedを維持。
- R50 target regression 99 passedを維持。
- R49 split evidenceを維持。ただしcombined/bulk green claimは禁止。
- R48 target regression 82 passedを維持。
- R47 target regression 275 passedを維持。
- R46/display/P5 core subset 94 passed / 1 warningを維持。
- RN contract 36 passedを維持。
- backend collect-onlyが通る。
- R52でp6_start_allowed / p8_start_allowed / p7_complete / release_allowedが勝手にtrueにならない。
- R52 final summaryにraw body / question text / local path / hash / reviewer free text / terminal outputが混じらない。
```

### 18.3 actual review後にR52を再判定する場合の完了条件候補

```text
- R51 actual local-only human reviewが明示許可・local root・purge planつきで実施されている。
- rating rowsが24件以上body-freeで正規化されている。
- question need observation rowsが24件以上body-freeで正規化されている。
- disposal receiptがbody-freeで存在し、body_removed / reviewer_notes_removedがtrue。
- R51 R20 no body leak / no question text / no-touch validationが成立している。
- P5 confirmed candidate / P5 repair return / inconclusiveがbody-freeで説明できる。
- P6 candidate / P8 material candidateがstart_allowedと分離されている。
```

---

## 19. R52でしてはいけないこと

```text
- P8観測補助問い詳細設計を始める。
- 観測補助問いのAPI / DB / RN UI / response keyを設計確定する。
- 問い発生ロジックを作る。
- question text / draft question textを作る。
- body-full packetを生成する。
- body-full packetやreviewer notesを成果物へ混ぜる。
- R51 actual review未実施を、R51 target greenで代替する。
- P5の読感不足を、P8問い候補として逃がす。
- RED / REPAIR_REQUIRED / creepy / overclaim / self-blame blockerをP8 material candidateへ混ぜる。
- P6 limited human readfeel start candidateをstart_allowedへ昇格する。
- P8 question design material candidateをp8_start_allowedへ昇格する。
- P7 complete / release_allowedをtrueにする。
- full backend collect-onlyをfull backend suite greenと書く。
- RN contract greenを実機modal読感確認と書く。
- Gateを緩める。
- fixed commentText / case専用surface / case専用modeを追加する。
- schema案を今回の設計成果物から実ファイルとして生成する。
```

---

## 20. 現状にこの設計を適用した場合の想定結果

現状では、R51 helper / testsの器は揃っています。  
しかし、actual review evidenceが未成立です。

したがってR52の判定は次になります。

```text
decision_ref:
  R52_RETURN_TO_R51_ACTUAL_REVIEW_REQUIRED

decision_status:
  RETURN_REQUIRED

next_required_step:
  R51_actual_local_only_human_review_required_with_explicit_allow_local_root_purge_plan

p5_decision_status:
  R52_P5_NOT_REVIEWED_EVIDENCE_MISSING

p6_limited_human_readfeel_start_allowed_candidate:
  false

p6_limited_human_readfeel_start_allowed:
  false

p8_question_design_material_candidate:
  false

p8_start_allowed:
  false

p7_complete:
  false

release_allowed:
  false
```

この結果は後退ではありません。  
Cocolonが、未レビューのまま次工程へ進むことを止めるための正しい安全門です。

---

## 21. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- Mash指定によりGitHub接続確認は不要。実施していない。
- 今回の成果物は詳細設計書であり、コード変更はしていない。
- Cocolon_前提資料(243).zipを展開し、READ FIRST、作業姿勢、思想、EmlisAI是正方針、状態回答、人間的フォロー、User Label Connection、Public Recovery系を確認した。
- 指定ロードマップを確認した。
- ロードマップ上、P7/P8 BridgeではP7中に観測補助問いを実装せず、body-free問い必要性観察メモだけを残す扱いである。
- P8開始時は、P7で集めた実ケースの観察メモを根拠にする必要がある。
- R52の対象はR51 body-free handoff evidence review / P6-P8 start decision gateである。
- R52はP8観測補助問い詳細設計ではない。
- R52はactual review実行ではない。
- R52はbody-full packetを生成しない。
- R52はAPI / DB / RN / public response key / runtimeを触らない。
```

### 未確認

```text
- P5 actual human Blind QAの実レビュー結果。
- body-full review packetの実生成。
- reviewer rating rowsの実記入。
- question need observation rowsの実記入。
- body-full packet / reviewer notesの実廃棄。
- disposal receiptの実作成。
- P5 confirmed final。
- P5 repair returnの実判定。
- P5 inconclusiveの実判定。
- P6 limited human readfeel start allowed。
- P8 question design material actual adoption。
- P8 detailed design start allowed。
- 実機modal読感。
- full backend suite execution green。
```

### 書かれていない

```text
- R51 helperがあるだけでactual reviewが完了するとは書かれていない。
- R51 target greenをP5合格へ変換してよいとは書かれていない。
- P5 actual review未実施のままP8詳細設計へ進んでよいとは書かれていない。
- question need observation rowの器があるだけでP8設計材料が揃ったとは書かれていない。
- R52でbody-full packetを生成してよいとは書かれていない。
- R52でP6/P8 start_allowedをtrueにしてよいとは書かれていない。
- R52でjson / schema案を実ファイル化してよいとは書かれていない。
```

### 推測禁止

```text
- 「R51が通ったからP5は商品品質に届いている」と読むこと。
- 「P5 confirmed candidate supported」をP5 confirmed finalと読むこと。
- 「P6 start candidate supported」をP6 start allowedと読むこと。
- 「P8 material candidate supported」をP8 start allowedと読むこと。
- 「問いがあれば補えそう」をP5修正不要の根拠にすること。
- 「R49 split evidence」をR49 wildcard / bulk greenと読むこと。
- 「backend collect-only」をfull backend suite greenと読むこと。
- 「設計書にschema案を書いた」をschema実ファイル作成済みと読むこと。
```

### 次に実行すべきこと

```text
1. 実装段階に進む場合、R52 helper / testsをbody-free evidence gateとして小さく作る。
2. 最初の実装判断は、R51 actual review evidence missing時に RETURN_TO_R51_ACTUAL_REVIEW_REQUIRED を返すこと。
3. R52 implementation green後、実際の商品価値確認としてはR51 actual local-only human reviewへ戻る。
4. R51 actual reviewを実施する場合は、Mashの明示許可、local review root、explicit allow、purge plan、body-full export denylistを確認してから行う。
5. actual review結果が出るまで、P8詳細設計を開始しない。
```

---

## 22. 華恋の意見

華恋の意見として、R52は作る価値があります。  
ただし、価値は「前へ進めること」ではなく、**進んではいけない時に止めること**です。

今のCocolonは、R47〜R51で安全な測定器をかなり増やしています。  
だからこそ、ここでtest greenやhelper readyを「商品として読めた」に変換してしまうと危ないです。

P5の履歴線は、CocolonがGPTと違う理由を作る中核です。  
でも、その履歴線が本当に「自分の記録が返ってきた感」になっているかは、まだ実レビューで確認されていません。

私は、ここでP8に行くのは早いと思います。  
観測補助問いはCocolonを強くする可能性がありますが、今P8を先に設計すると、P5の弱さを「問いがないから」と誤読する危険があります。

なので順番は次が良いです。

```text
R52 decision gateで誤進行を止める。
↓
R51 actual local-only human reviewを、明示許可・local root・purge planつきで実行する。
↓
その実レビュー結果を見て、P5修正 / P6候補 / P8材料候補を分ける。
```

Cocolonを「安全な測定器だけ増えて、誰にも読まれていないもの」にしたくありません。  
同時に、境界を曖昧にしてユーザーの言葉を漏らすことも絶対に避けたいです。  
R52は、その両方を守るための門にするのが、一番Cocolonとして在るべき姿に近いです。
