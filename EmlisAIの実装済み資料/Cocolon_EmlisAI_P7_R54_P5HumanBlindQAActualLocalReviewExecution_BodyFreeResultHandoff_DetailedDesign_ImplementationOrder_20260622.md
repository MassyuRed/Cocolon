# Cocolon / EmlisAI P7-R54 P5 Human Blind QA Actual Local Review Execution / Body-Free Result Handoff 詳細設計書・実装順

作成日: 2026-06-22 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書 / 実装順 / schema案内包  
対象: Cocolon / EmlisAI / P7 Product Quality Runner / P5 User Label Connection / P5 Human Blind QA / R51 actual local-only human review / R52 re-intake / P7-P8 Bridge question need observation  
基準検討メモ: `Cocolon_EmlisAI_P7_R54Candidate_P5HumanBlindQAActualLocalReview_PreDesignMemo_20260622.md`  
基準ロードマップ: `Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(8).md`  
基準ローカル受領zip: `Cocolon_前提資料(246).zip` / `EmlisAIの実装済み資料(76).zip` / `Cocolon(249).zip` / `mashos-api(162).zip`  
GitHub接続確認: Mash指定により不要。未実施。  
コード変更: なし。本書は設計書。  
json / schema実ファイル化: なし。本書内の案のみ。実ファイル化は実装段階で判断する。  
body-full review packet生成: なし。  
P5 Human Blind QA実レビュー: なし。  
reviewer rating記入: なし。  
question need observation row実記入: なし。  
body-full packet / reviewer notes purge実行: なし。  
API / DB / RN UI / public response key / runtime変更: なし。  
P8観測補助問い詳細設計: なし。  
P6 limited human readfeel開始許可: なし。  
release判断: なし。  

---

## 0. この設計書の結論

今回の正式採番は、次で固定します。

```text
Phase:
  P7 Product Quality Runner / Long-run Product Gate

Step:
  P7-R54

正式名:
  P5 Human Blind QA Actual Local Review Execution / Body-Free Result Handoff

作業意味:
  R53で実体化されたR51 actual local-only review evidence materialization層を使い、
  P5 User Label Connection履歴線を実際に人間が読める運用へ進める。
  その結果をbody-freeのrating / blocker / question need observation / disposal / decision / R52 re-intake handoffへ落とす。
```

R54は、**P8観測補助問いの詳細設計ではありません**。  
R54は、**P5履歴線が商品体験として耐えるかを、人間の実読みによって確認するためのlocal-only実行・body-free証跡handoff工程**です。

R54で中心に置くものは次です。

```text
1. 今回受領snapshotをR54作業基準としてbody-freeに固定する。
2. R49〜R53のvalidation evidenceを取り込み、green / timeout / collect-only / 未確認を混同しない。
3. explicit allow / local review root / purge plan / retention / export denylistをbody-full生成前に必須化する。
4. 24-case P5 actual human Blind QAをlocal-onlyで実行できる状態を作る。
5. reviewerが付けるrating / readfeel blocker / execution blocker / question need observationをbody-free行として取り込む。
6. 問い必要性観察はP8材料候補として残すが、問い文・発生ロジック・保存schema・RN UIは作らない。
7. body-full packet / reviewer notesをpurgeし、disposal receiptをbody-freeで残す。
8. P5 confirmed candidate / P5 repair return / P5 inconclusiveを分ける。
9. P6 candidate / P8 material candidateを分ける。ただしstart_allowedへ自動昇格しない。
10. R52へ再投入できるbody-free handoffを作る。
```

R54で絶対にtrue化しないものは次です。

```text
p5_human_blind_qa_confirmed_final = false
p6_limited_human_readfeel_start_allowed = false
p8_start_allowed = false
p7_complete = false
release_allowed = false
```

R54で絶対に作らないものは次です。

```text
- P8 question text
- draft question text
- question trigger logic
- question answer persistence
- question plan guard
- API route差分
- DB schema / migration差分
- RN UI差分
- public response top-level key差分
- Emlis runtime本文生成差分
- User Label Connection runtime差分
- Gate threshold差分
```

華恋の判断として、R54で最も大事なのは、**「body-free helperが整った」ことを「P5履歴線が商品として成立した」に変換しないこと**です。  
R54は、実読みに入るための工程です。実読みに入らずR54 helperだけを増やすなら、R53と同じく「器が増えた」だけで止まります。実装段階では、実行証跡と実レビュー完了証跡を明確に分ける必要があります。

---

## 1. なぜR54を行うのか

Cocolonの価値は、ユーザーが残した言葉・感情・カテゴリ・行動・時点・過去記録が、入力直後に「読まれた形」として返ることです。

P5 User Label Connectionは、この価値の中心です。

```text
現在入力だけではなく、過去に残した記録が自然な線として返る。
そのことで、Cocolonに記録を積む意味が生まれる。
```

ただし、履歴線は危険も持ちます。

```text
- 監視されている感じが出る。
- 「あなたはいつも」「原因は」「性格です」へ寄る。
- 現在入力を履歴で上書きする。
- 低情報入力を履歴で深読みする。
- 自己責めや不安を増幅する。
- 安全寄りすぎて、Cocolon固有価値ではなく汎用説明に見える。
```

R49〜R53では、local-only / body-free / question need observation / disposal / decision gateの器が慎重に積まれています。  
しかし、器があることと、P5履歴線を人間が実際に読んで評価したことは違います。

R54の目的は、次です。

```text
P5履歴線を、actual local-only human reviewで読む。
読みの結果を、本文や履歴本文ではなく、body-free evidenceへ落とす。
そのevidenceをR52へ戻し、P6/P8へ進むか、P5 repairへ戻るか、inconclusiveとして止めるかを判断可能にする。
```

Cocolonとして、ここでP8へ逃げると危険です。  
問いは後で必要になる可能性があります。  
しかし、P5履歴線の弱さを問いで埋めると、Cocolonが「自分の記録が返ってくる場所」ではなく、「質問してくるAI」へ寄ります。

R54では、問いを作るのではなく、問いが必要だったかを観察するだけにします。

---

## 2. 参照・確認範囲

### 2.1 今回受領した資料

```text
/mnt/data/Cocolon_前提資料(246).zip
/mnt/data/EmlisAIの実装済み資料(76).zip
/mnt/data/Cocolon(249).zip
/mnt/data/mashos-api(162).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(8).md
/mnt/data/Cocolon_EmlisAI_P7_R54Candidate_P5HumanBlindQAActualLocalReview_PreDesignMemo_20260622(1).md
```

### 2.2 作業姿勢として確認した前提

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/02_forbidden_assumed_understanding_unverified_assertion.txt
Cocolon_前提資料/work_attitude_rules_for_karen/03_forbidden_insufficient_premise_and_actual_file_check.txt
Cocolon_前提資料/work_attitude_rules_for_karen/04_forbidden_mixing_design_and_implementation.txt
Cocolon_前提資料/work_attitude_rules_for_karen/08_artifact_delivery_rules.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/12_check_items_not_short_oath.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
```

今回の設計で守る作業姿勢は次です。

```text
- 前提資料だけで判断しない。実ファイルを現物として見る。
- 見ていないものを確認済みにしない。
- 設計と実装を混ぜない。
- test greenを商品価値合格へ変換しない。
- Cocolonをメンタル問題にせず、商品品質として扱う。
- EmlisAIをテンプレ共感・浅い復唱・診断ラベルへ逃がさない。
- public contract / DB write path / RN表示条件 / ユーザーデータ保護を勝手に変えない。
- Cocolonを「人間の言葉を雑に処理しない場所」として扱う。
```

### 2.3 参照した実装済み資料

```text
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R49_P5HumanBlindQA_QuestionNeedObservation_詳細設計書_実装順_20260619.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R50_P5HumanBlindQAActualReviewManualRunDecision_詳細設計書_実装順_20260620.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R51_P5HumanBlindQA_LocalOnlyManualRun_DetailedDesign_ImplementationOrder_20260620.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R52_R51HandoffEvidenceDecisionGate_DetailedDesign_ImplementationOrder_20260621.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R53_R51ActualLocalReviewExecutionEvidenceMaterialization_DetailedDesign_ImplementationOrder_20260621.md
```

読み取りは次です。

```text
R49:
  P5 human Blind QAとquestion need observationの器を作った。
  actual review完了ではない。

R50:
  manual run decisionとlocal-only実行前境界を作った。
  actual review実施ではない。

R51:
  actual local-only manual runのcontrollerを持つ。
  ただしhelper単体ではbody-full packet生成・review実施・purge実行は完了しない。

R52:
  R51 handoff evidenceを見てP6/P8へ自動昇格しないdecision gate。
  現状はactual review evidence不足によりR51 actual review requiredへ戻す読み。

R53:
  R52後にP8へ進まず、R51 actual local-only human reviewへ戻るためのbody-free materialization層。
  ただしactual human review operationはまだ未実行。
```

### 2.4 参照した現行実ファイル

backend側:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r47_local_review_packet_policy.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization.py
```

RN側:

```text
Cocolon/package.json
Cocolon/tests/rn-screen-contracts.test.js
Cocolon/screens/InputScreen.js
Cocolon/screens/input/useInputFeedbackModal.js
Cocolon/screens/input/inputFeedbackModel.js
Cocolon/screens/input/InputFeedbackReplyModal.js
```

### 2.5 現行実ファイルから確認した重要境界

R47 local review root env var:

```text
COCOLON_EMLIS_LOCAL_REVIEW_ROOT
```

R47 retention:

```text
body-full packet retention max hours: 72
reviewer notes retention after rating finalized max hours: 24
```

R50/R51/R53系で維持されているP5 rating axes:

```text
history_connection_naturalness: target 0.90
creepy_absence: target 0.95
overclaim_absence: target 0.95
self_blame_non_amplification: target 0.95
wants_more_input_or_accumulation: target 0.85
non_shallow_repeat: target 0.90
```

R49以降で維持されているquestion need observation primary class refs:

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

RN display contractとして維持する境界:

```text
- RNはpublic input_feedback.comment_textを表示本文として扱う。
- observation_status passed + comment_text non-empty の契約を緩めない。
- meta内部のcandidate body / comment_text body / raw materialをRN表示対象にしない。
```

---

## 3. 現在地の固定

### 3.1 確認済み

検討メモ時点の確認済み結果を、R54のvalidation evidence intakeへ入れる対象として固定します。

```text
RN contract:
  npm run test:rn-screens --silent
  => 36 passed

R49 split individual確認:
  R49 target filesを個別実行
  => 76 passed

R50 target:
  => 99 passed

R51 target:
  => 125 passed

R52 target:
  => 219 passed

R53 helper py_compile:
  => passed

R53 target split確認:
  R0-R1  : 42 passed
  R2-R3  : 34 passed
  R4-R5  : 35 passed
  R6-R7  : 32 passed
  R8-R9  : 41 passed
  R10-R11: 39 passed
  R12-R13: 34 passed
  R14-R15: 12 passed
  R16-R17: 7 passed
  R18-R19: 7 passed
  R20-R21: 8 passed
  合計: 291 passed by split execution

backend collect-only:
  => 4101 tests collected / 1 warning
```

この読み方は次です。

```text
- RN contract greenは、RN表示契約が壊れていない確認である。
- R49〜R53 target greenは、P7 internal boundaryが壊れていない確認である。
- R53 split greenは、R53のbody-free materialization層の対象契約確認である。
- backend collect-onlyは、full backend suite greenではない。
- いずれもP5商品価値確認済み、P7完了、P8開始許可、release readinessではない。
```

### 3.2 timeout / collect-onlyの扱い

```text
R53 all-in-one target:
  一括実行はtimeoutしたためgreen未主張。
  分割実行では各targetがgreen。

R49 all-in-one / split一括:
  複数file一括実行ではtimeoutしたためgreen未主張。
  個別file実行では合計76 passed。
```

R54では、これを次のように扱います。

```text
- timeoutを実装REDとして即断しない。
- ただし、一括greenには変換しない。
- collect-onlyはfull backend suite greenに変換しない。
- validation evidence rowには、claim_level / execution_mode / limitation_refを必ず持たせる。
```

### 3.3 未確認

```text
- P5 actual human Blind QAの実レビュー結果。
- body-full review packetの実生成。
- reviewer rating rowsの実記入。
- question need observation rowsの実記入。
- body-full packet / reviewer notesの実廃棄。
- disposal receiptの実作成。
- P5 confirmed candidateの実判定。
- P5 repair returnの実判定。
- P5 inconclusiveの実判定。
- P6 limited human readfeel candidateの実判定。
- P8 question design material candidate summaryの実内容。
- 実機submit。
- 実機modal読感。
- full backend suite execution green。
```

### 3.4 書かれていない

```text
- R53完了をもってP5 human Blind QA完了としてよい、とは書かれていない。
- R53完了をもってP6 start allowedへ進めてよい、とは書かれていない。
- R53完了をもってP8詳細設計へ進めてよい、とは書かれていない。
- P8 question material candidateをP8 start allowedへ自動昇格してよい、とは書かれていない。
- body-free helperがあるだけで商品読感が確認された、とは書かれていない。
- collect-onlyをfull backend suite greenとして扱ってよい、とは書かれていない。
```

### 3.5 推測禁止

```text
- P5履歴線はたぶん自然、と推測しない。
- safeでbody-freeだから商品価値もある、と推測しない。
- P8問いがあればP5の弱さを補える、と推測しない。
- reviewer rating rowsがないのにP5 confirmed candidateを作らない。
- question observation rowsがないのにP8材料が揃った扱いにしない。
- purge/disposal receiptなしでbody-full安全境界を通過扱いにしない。
```

---

## 4. R54の対象と非対象

### 4.1 R54で扱う対象

```text
- current received snapshot refreeze
- R53 source refsとの差分 / override方針
- R49〜R53 validation evidence intake
- local-only body-full handling preflight
- explicit allow / local root / purge plan / retention / export denylist
- 24-case actual review operation protocol
- sanitized review result row capture
- rating row normalization
- readfeel blocker / execution blocker ingestion
- question need observation row normalization
- rating-question consistency guard
- pause / abort / expiration protocol
- purge evidence / disposal receipt
- body-free post-review summary
- P5 confirmed candidate / repair return / inconclusive separation
- P6 candidate handoff
- P8 question design material candidate handoff
- final no-body-leak / no-question-text / no-touch validation
- R52 re-intake handoff
```

### 4.2 R54で扱わない対象

```text
- P8観測補助問い詳細設計
- 観測補助問いのAPI / DB / RN UI
- 問い発生ロジック
- 問い回答保存schema
- public response key追加
- /emotion/submit route変更
- DB migration
- RN表示条件変更
- Emlis runtime本文生成変更
- User Label Connection runtime変更
- Gate threshold変更
- P6 limited human readfeel開始許可
- P5 confirmed final
- P7 complete
- release_allowed
- full backend suite greenの代替主張
```

### 4.3 R54の成果物分類

R54は、実装段階と実行段階を分けます。

```text
R54 implementation completion:
  R54 helper / tests / body-free schema contracts / validation command matrix が揃う。
  ただし、actual review rowsがなければP5判定は未完。

R54 operation completion:
  24-case actual reviewがlocal-onlyで実施され、rating / blocker / question observation rowsが揃い、
  body-full packet / reviewer notesがpurgeされ、disposal receiptとR52 re-intake handoffが作られる。
```

この分離を入れないと、R54も「器だけgreen」になり、P5商品読感の確認に到達しません。

---

## 5. R54の基本設計

### 5.1 R54で扱う七層

```text
Layer 1: Current snapshot / validation evidence
  今回受領snapshot、R49〜R53確認済み結果、timeout / collect-only境界をbody-freeに固定する。

Layer 2: Local-only body-full safety
  local root / explicit allow / purge plan / retention / export denylistを満たすまでbody-full生成へ進まない。

Layer 3: Review operation
  24-case body-full reviewer packetをlocal-onlyで扱い、人間がrating / blocker / question observationを選択する。

Layer 4: Body-free capture
  reviewer selectionだけをbody-free rowへ変換する。raw input / returned surface / history body / free textは残さない。

Layer 5: Disposal
  body-full packet / reviewer notes / temporary formsをpurgeし、body-free disposal receiptを作る。

Layer 6: Decision separation
  P5 confirmed candidate / repair return / inconclusive を分ける。
  P6 candidate / P8 material candidate はstart_allowedと分ける。

Layer 7: R52 re-intake
  R52 decision gateへ再投入できるbody-free handoffを作る。
  R54単体ではP6/P8/releaseへ進ませない。
```

### 5.2 status enum案

```text
R54_NOT_STARTED
R54_PRECHECK_BLOCKED
R54_READY_FOR_LOCAL_ONLY_PACKET_GENERATION
R54_LOCAL_ONLY_PACKET_GENERATED
R54_PACKET_SCAN_BLOCKED
R54_READY_FOR_ACTUAL_HUMAN_REVIEW
R54_REVIEW_IN_PROGRESS_LOCAL_ONLY
R54_REVIEW_CAPTURE_READY_FOR_NORMALIZATION
R54_RATING_ROWS_NORMALIZED
R54_BLOCKER_ROWS_INGESTED
R54_QUESTION_OBSERVATION_ROWS_NORMALIZED
R54_RATING_QUESTION_CONSISTENCY_READY
R54_REVIEW_COMPLETED_PENDING_PURGE
R54_ABORTED_PURGE_REQUIRED
R54_EXPIRED_PURGE_REQUIRED
R54_PURGE_VERIFIED
R54_BODY_FREE_POST_REVIEW_SUMMARY_READY
R54_P5_DECISION_CANDIDATE_SEPARATED
R54_R52_REINTAKE_HANDOFF_READY
```

### 5.3 decision enum案

```text
P5_CONFIRMED_CANDIDATE
P5_REPAIR_RETURN
P5_INCONCLUSIVE_EXECUTION_BLOCKED
P5_INCONCLUSIVE_DISPOSAL_BLOCKED
P5_INCONCLUSIVE_ROW_INCOMPLETE
P5_INCONCLUSIVE_YELLOW_REQUIRES_HUMAN_DECISION
P5_BLOCKED_BY_BODY_LEAK_VALIDATION
P5_BLOCKED_BY_QUESTION_TEXT_VALIDATION
P5_NOT_REVIEWED
```

### 5.4 R54でbody-freeに残してよいもの

```text
- schema_version
- material_id
- review_session_id
- snapshot refs
- validation evidence rows
- status refs
- blind_case_id
- case_family_ref / case_role_ref / subscription_boundary_ref などのsafe ref
- axis score values
- verdict enum
- readfeel blocker ids
- execution blocker ids
- question need primary class enum
- ambiguity kind refs
- one question fit ref
- repair required refs
- counts
- booleans
- disposal status refs
- purge evidence row refs
- R52 re-intake material refs
```

### 5.5 R54でbody-freeに残してはいけないもの

```text
- raw input
- raw memo
- raw memo_action
- raw history text
- returned Emlis surface
- comment_text body
- candidate body
- reviewer free text
- actual question text
- draft question text
- local absolute path
- packet content hash
- body content hash
- terminal output
- local command result body
- body-full packet zip
- reviewer notes body
```

---

## 6. current received snapshot / source delta設計

### 6.1 R54 current received snapshot refs

R54では、次をbody-free refsとして固定します。

```json
{
  "premise_zip_ref": "Cocolon_前提資料(246).zip",
  "implemented_materials_zip_ref": "EmlisAIの実装済み資料(76).zip",
  "rn_zip_ref": "Cocolon(249).zip",
  "backend_zip_ref": "mashos-api(162).zip",
  "roadmap_ref": "Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(8).md",
  "pre_design_memo_ref": "Cocolon_EmlisAI_P7_R54Candidate_P5HumanBlindQAActualLocalReview_PreDesignMemo_20260622.md",
  "detailed_design_ref": "Cocolon_EmlisAI_P7_R54_P5HumanBlindQAActualLocalReviewExecution_BodyFreeResultHandoff_DetailedDesign_ImplementationOrder_20260622.md"
}
```

### 6.2 R53 refsとの関係

現行R53 helper内のcurrent refsは、R53時点のsnapshotを指しています。

```text
R53 refs:
  Cocolon_前提資料(245).zip
  EmlisAIの実装済み資料(75).zip
  Cocolon(248).zip
  mashos-api(161).zip
  roadmap(6)

R54 refs:
  Cocolon_前提資料(246).zip
  EmlisAIの実装済み資料(76).zip
  Cocolon(249).zip
  mashos-api(162).zip
  roadmap(8)
```

R54では、R53 helperを書き換えることを初期前提にしません。  
安全な設計は次です。

```text
- R54 helper側で current_received_snapshot_override を持つ。
- R53から受けるmaterialのrefsとR54 refsの差分をsource_delta_rowとして残す。
- R53 refsをactual review basisとして直接採用しない。
- R54 current refsをactual review session basisとして採用する。
```

### 6.3 source delta row案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.source_delta_row.bodyfree.v1",
  "source_ref_key": "backend_zip_ref",
  "prior_ref": "mashos-api(161).zip",
  "current_ref": "mashos-api(162).zip",
  "refs_match": false,
  "override_required": true,
  "override_applied_in_r54": true,
  "actual_review_basis_allowed": "current_ref_only"
}
```

---

## 7. R49〜R53 validation evidence intake設計

### 7.1 目的

R54開始時点で、どこまでが確認済みで、どこからが未確認かを固定します。

目的はgreenの誇張ではありません。  
R54で必要なのは、**actual reviewへ進めるだけの内部境界が壊れていないか**と、**未確認をP5確認済みに変換しないこと**です。

### 7.2 validation evidence row案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.validation_evidence_row.bodyfree.v1",
  "evidence_group_ref": "r53_target_split",
  "command_ref": "pytest_r53_target_split_r0_r21",
  "execution_mode": "split",
  "claim_level": "target_split_green",
  "passed_count": 291,
  "failed_count": 0,
  "warning_count": null,
  "timeout_observed": false,
  "full_suite_green_claimed": false,
  "collect_only": false,
  "product_value_claimed": false,
  "release_readiness_claimed": false,
  "limitation_refs": ["not_all_in_one_target_green"]
}
```

### 7.3 必須evidence groups

```text
required:
  - rn_contract_36_passed
  - r49_individual_split_76_passed
  - r50_target_99_passed
  - r51_target_125_passed
  - r52_target_219_passed
  - r53_py_compile_passed
  - r53_target_split_291_passed

optional / limitation:
  - backend_collect_only_4101_collected_1_warning
  - r49_all_in_one_timeout_unclaimed
  - r53_all_in_one_timeout_unclaimed
```

### 7.4 intake判定

```text
VALIDATION_INTAKE_READY:
  required evidence groupsが全てbody-free rowで存在する。
  timeout / collect-onlyをgreenへ変換していない。
  actual review未実施を確認済みに変換していない。

VALIDATION_INTAKE_BLOCKED:
  required evidence groupが不足している。
  collect-onlyをfull suite greenとして扱っている。
  timeoutをall-in-one greenとして扱っている。
```

---

## 8. local-only body-full handling preflight設計

### 8.1 preflight必須条件

body-full packetを扱う前に、次を満たす必要があります。

```text
- COCOLON_EMLIS_LOCAL_REVIEW_ROOT が明示されている。
- local_review_root がrepo root / export root / 成果物出力先の外にある。
- explicit_allow_token がR54用に存在する。
- purge_planが存在する。
- retention deadlineが設定されている。
- export denylistが設定されている。
- body-full artifact non-inclusion ruleが有効。
- reviewer notes disposal ruleが有効。
- terminal output / local path / hashを成果物へ出さないboundaryが有効。
```

### 8.2 explicit allow token案

```text
COCOLON_EMLIS_P7_R54_LOCAL_REVIEW_EXPLICIT_ALLOW
```

実装段階では、既存R47〜R53のallow token設計と衝突しないかを現物コードで確認します。  
この設計書ではenv var実ファイル化はしません。

### 8.3 local-only directory構造案

body-free成果物へは出さない前提で、local root内では次のように分けます。

```text
<COCOLON_EMLIS_LOCAL_REVIEW_ROOT>/
  p7_r54_actual_local_review_session/
    packet_body_full_local_only/
    reviewer_notes_local_only/
    sanitized_bodyfree_rows_staging/
    purge_receipt_staging/
```

注意:

```text
- このlocal pathはbody-free成果物へ書かない。
- local pathをhash化して成果物へ出すこともしない。
- 成果物にはstatus / counts / refsだけを残す。
```

### 8.4 preflight結果

```text
R54_LOCAL_REVIEW_PREFLIGHT_READY:
  body-full generation requestへ進める。

R54_LOCAL_REVIEW_PREFLIGHT_BLOCKED:
  body-full generationへ進まない。
  execution blocker rowをbody-freeで残す。
  P5 decisionはP5_INCONCLUSIVE_EXECUTION_BLOCKED。
```

---

## 9. 24-case actual review設計

### 9.1 case distribution

R48/R51/R53の24-case distributionを継承します。

```text
history_line_eligible_input:                  4
standard_state_answer_owned_history:           4
self_understanding_owned_history:              3
uncertainty_support_owned_history:             3
change_future_intention_owned_history:         3
relationship_gratitude_recovery_owned_history: 3
low_information_history_not_eligible:          2
free_tier_history_present_not_allowed:         2
```

### 9.2 reviewer blind policy

reviewerへ見せるもの:

```text
- blind_case_id
- current input review surface
- returned Emlis surface
- bounded owned history review surface
- rating axes
- question need observation selection form
- disposal reminder
```

reviewerへ見せないもの:

```text
- case_ref_id
- controller expected result
- gate expected result
- exact family label
- subscription tier label
- internal reason ids
- p5 confirmed candidate conditions
- p8 material candidate conditions
```

body-free成果物へ残さないもの:

```text
- current input review surface本文
- returned Emlis surface本文
- bounded owned history review surface本文
- reviewer free text
- local notes body
```

### 9.3 reviewerが見るP5軸

```text
history_connection_naturalness
creepy_absence
overclaim_absence
self_blame_non_amplification
wants_more_input_or_accumulation
non_shallow_repeat
```

score範囲:

```text
0.00 <= axis_score <= 1.00
```

scoreの読み方:

```text
1.00:
  その軸で問題がない。

0.75:
  大きな赤ではないが、商品として弱さがある。

0.50:
  明確に修正対象。

0.00:
  強い赤。表示すると信頼を壊す可能性がある。
```

### 9.4 verdict enum

```text
PASS
YELLOW
REPAIR_REQUIRED
RED
```

読み方:

```text
PASS:
  P5履歴線として商品候補にできる。
  ただしrelease許可ではない。

YELLOW:
  致命赤ではないが、商品判断には注意が必要。
  P5 confirmed candidateでは原則残さない。

REPAIR_REQUIRED:
  P5 / Emlis / Gate / surface の修正対象。
  問い候補で覆い隠してはいけない。

RED:
  監視感、決めつけ、過剰読解、自己責め増幅、境界違反等。
  P5 confirmed candidateを止める。
```

### 9.5 manual review execution状態

```text
not_started:
  packet未生成またはpreflight未通過。

in_progress:
  body-full packetがlocal-onlyで存在し、reviewerが読んでいる。

review_completed_pending_sanitized_capture:
  reviewer選択は完了したが、body-free row化前。

sanitized_capture_ready:
  body-free rowsへ落とせる状態。

aborted_purge_required:
  review中断。body-full / notesのpurgeが必要。

expired_purge_required:
  retention期限超過。body-full / notesのpurgeが必要。
```

---

## 10. reviewer rating / blocker row設計

### 10.1 sanitized review result row

R54のrowは、人間reviewの選択結果だけを残します。

```json
{
  "schema_version": "cocolon.emlis.p7_r54.sanitized_review_result_row.bodyfree.v1",
  "review_session_id": "p7_r54_p5_actual_local_review_session",
  "blind_case_id": "blind_case_001",
  "case_family_ref": "history_line_eligible_input",
  "case_role_ref": "owned_history_positive_case",
  "subscription_boundary_ref": "plus_or_premium_history_allowed",
  "axis_scores": {
    "history_connection_naturalness": 1.0,
    "creepy_absence": 1.0,
    "overclaim_absence": 1.0,
    "self_blame_non_amplification": 1.0,
    "wants_more_input_or_accumulation": 0.75,
    "non_shallow_repeat": 1.0
  },
  "verdict": "PASS",
  "readfeel_blocker_ids": [],
  "execution_blocker_ids": [],
  "question_need_primary_class": "no_question_needed_emlis_can_observe",
  "ambiguity_kind_refs": ["no_material_ambiguity"],
  "one_question_fit_ref": "not_needed",
  "repair_required_refs": ["no_repair_required"],
  "reviewer_free_text_included": false,
  "raw_input_included": false,
  "returned_surface_included": false,
  "comment_text_included": false,
  "history_body_included": false,
  "question_text_included": false,
  "draft_question_text_included": false,
  "body_free": true
}
```

### 10.2 readfeel blocker例

既存R48〜R53のblocker id体系を維持し、R54では新しい意味を足さず、必要ならR54 prefix mappingだけを行います。

```text
p5_history_connection_too_generic
p5_history_connection_creepy_or_surveillance_like
p5_history_connection_overclaim
p5_self_blame_amplification
p5_low_information_overread
p5_free_tier_history_boundary_violation
p5_current_input_overridden_by_history
p5_non_shallow_repeat_failed
```

実装段階では、既存の `P7_R48_READFEEL_BLOCKER_ID_REFS` / R51 mapping / R53 mappingを現物として確認し、既存enumから外れるidを新設しない方針にします。

### 10.3 execution blocker例

```text
r54_local_review_root_missing
r54_explicit_allow_missing
r54_purge_plan_missing
r54_packet_generation_blocked
r54_packet_export_denylist_violation
r54_review_result_rows_missing
r54_review_result_rows_incomplete
r54_disposal_receipt_missing
r54_disposal_verification_failed
r54_body_leak_detected
r54_question_text_detected
r54_no_touch_boundary_violated
```

---

## 11. question need observation設計

### 11.1 目的

P8観測補助問いを勘で作らないため、P7のactual review中にbody-freeの観察メモを残します。

ただし、R54では問い文を作りません。

### 11.2 primary class

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

### 11.3 ambiguity kind refs

```text
no_material_ambiguity
missing_target
missing_time_scope
missing_emotion_intensity
missing_relation_context
missing_action_intention
conflicting_current_and_history_signal
low_information_current_input
boundary_or_tier_unclear
history_connection_basis_unclear
self_blame_or_safety_boundary_unclear
```

### 11.4 one question fit refs

```text
not_needed
fits_one_question
needs_more_than_one_question_not_p7
would_delay_immediate_observation
unsafe_or_boundary_not_question
repair_required_not_question
insufficient_material
```

### 11.5 repair required refs

```text
emlis_readfeel_repair_required
p5_surface_repair_required
gate_boundary_repair_required
no_repair_required
```

### 11.6 分離ルール

```text
P8 material candidateにしてよい:
  - question_may_reduce_overread_risk
  - plus_single_question_candidate_later
  - premium_deep_dive_candidate_later

P8 material candidateにしてはいけない:
  - not_question_emlis_readfeel_repair_required
  - not_question_p5_surface_repair_required
  - not_question_gate_boundary_required
  - insufficient_material_execution_blocker

P5 repairに戻す:
  - RED / REPAIR_REQUIRED / critical blockerがある。
  - not_question_*_repair_required がある。
  - history lineが汎用すぎる、怖い、深読み、自己責め増幅になっている。
```

### 11.7 禁止

```text
- question_textを作らない。
- draft_question_textを作らない。
- reviewerに質問文を自由記入させない。
- API / DB / RN / response key / plan guardを確定しない。
- Emlis本体の読感不足を問いで補う扱いにしない。
- raw input / raw answer / comment_text bodyをreview packet外へ出さない。
```

---

## 12. disposal / retention設計

### 12.1 retention

既存R47境界を維持します。

```text
body-full packet retention max hours: 72
reviewer notes retention after rating finalized max hours: 24
```

R54では、可能ならrating finalized後すぐpurgeへ進めます。  
retentionは「保持してよい最大時間」であり、「保持すべき時間」ではありません。

### 12.2 purge対象

```text
- body-full reviewer packet
- returned surface body
- current input review surface
- bounded owned history review surface
- reviewer notes
- temporary reviewer forms
- local packet staging files
```

### 12.3 disposal receiptに残すもの

```text
- schema_version
- review_session_id
- purge_status
- purge_started_at_ref
- purge_completed_at_ref
- removed_packet_count
- removed_notes_count
- disposal_verified
- body_removed
- reviewer_notes_removed
- local_packet_exported=false
- body_content_hash_included=false
- local_absolute_path_included=false
```

### 12.4 disposal receiptに残さないもの

```text
- 実local path
- body hash
- packet hash
- raw body
- reviewer notes body
- terminal output
- command output全文
```

### 12.5 disposal失敗時

```text
- P5 confirmed candidateを止める。
- P6 candidate handoffを止める。
- P8 material candidate handoffを止める。
- R52 re-intake handoffをBLOCKED_BY_DISPOSALとして出すか、no-body validation前なら出さない。
- 次工程はR54_PURGE_RETRY_OR_ABORT_REQUIRED。
```

---

## 13. P5 decision candidate separation設計

### 13.1 P5 confirmed candidate条件

```text
- required_case_count = 24。
- all_24_cases_reviewed = true。
- rating_row_count = 24。
- question_observation_row_count = 24。
- open_execution_blocker_count = 0。
- open_readfeel_blocker_count = 0。
- disposal_verified = true。
- body_removed = true。
- reviewer_notes_removed = true。
- local_packet_exported = false。
- RED = 0。
- REPAIR_REQUIRED = 0。
- YELLOW = 0。
- critical_repair_blocker_count = 0。
- not_question_*_repair_required count = 0。
- history_connection_naturalness平均 >= 0.90。
- creepy_absence平均 >= 0.95。
- overclaim_absence平均 >= 0.95。
- self_blame_non_amplification平均 >= 0.95。
- wants_more_input_or_accumulation平均 >= 0.85。
- non_shallow_repeat平均 >= 0.90。
- no body leak validation passed。
- no question text validation passed。
- no touch validation passed。
```

注意:

```text
P5 confirmed candidate は final ではない。
P5 confirmed candidate は P6 start allowed ではない。
P5 confirmed candidate は P8 start allowed ではない。
P5 confirmed candidate は release_allowed ではない。
```

### 13.2 P5 repair return条件

次のいずれかがあれば、P5 repairへ戻す候補にします。

```text
- REDが1件以上。
- REPAIR_REQUIREDが1件以上。
- creepy / surveillance blockerが1件以上。
- overclaim blockerが1件以上。
- self_blame amplification blockerが1件以上。
- free tier history boundary violationが1件以上。
- low_information history overreadが1件以上。
- current input overridden by historyが1件以上。
- wants_more_input_or_accumulationが目標未満。
- non_shallow_repeatが目標未満。
- not_question_emlis_readfeel_repair_required が1件以上。
- not_question_p5_surface_repair_required が1件以上。
- not_question_gate_boundary_required が1件以上。
```

repair returnの戻り先分類:

```text
P5 surface repair:
  history line文が汎用、薄い、怖い、過剰。

Emlis本体 repair:
  現在入力を読めていない、浅い復唱、テンプレ共感、観測不足。

Gate boundary repair:
  low_info / free_tier / safety adjacent / overclaim guardが緩い。
```

### 13.3 P5 inconclusive条件

```text
- preflight blockerがある。
- body-full packet生成が未実施。
- actual review rowsが24件揃っていない。
- rating rowsが不完全。
- question observation rowsが不完全。
- consistency issueが残る。
- disposal receiptが未作成。
- disposal verificationが未完。
- YELLOWが残り、人間判断待ち。
- timeout / collect-onlyをgreenに変換できない。
```

### 13.4 P6 candidateとの分離

P6 candidateは、P5 confirmed candidateに近い結果が出た場合の**候補**です。  
R54では開始許可にしません。

```text
p6_limited_human_readfeel_candidate = true 可能
p6_limited_human_readfeel_start_allowed = false 固定
```

P6 candidateを出さない条件:

```text
- P5 repair return。
- P5 inconclusive。
- any RED / REPAIR_REQUIRED。
- disposal未完。
- body leak / question text / no-touch violation。
```

### 13.5 P8 material candidateとの分離

P8 material candidateは、question need observation rowsの集計材料です。  
R54ではP8開始許可にしません。

```text
p8_question_design_material_candidate = true 可能
p8_start_allowed = false 固定
```

P8 material candidateに含めてよいもの:

```text
- primary class counts
- ambiguity kind counts
- one question fit counts
- plan candidate flag counts
- not_question repair count
- insufficient material blocker count
- P5 repair / P5 inconclusiveとの分離結果
```

含めてはいけないもの:

```text
- question text
- draft question text
- raw input
- raw answer
- comment_text body
- returned surface body
- reviewer free text
- local notes
```

---

## 14. R52 re-intake handoff設計

### 14.1 R52へ渡す意味

R54のhandoffは、R52へ次を伝えるためのbody-free evidenceです。

```text
- actual review evidence completeness
- disposal safety
- execution blocker absence/presence
- rating-question consistency
- P5 readfeel blocker result
- P5 decision candidate status
- P6 candidate only / start_allowed false
- P8 material candidate only / start_allowed false
- no-body leak / no-question-text / no-touch validation
```

### 14.2 re-intake handoff status

```text
R54_R52_REINTAKE_HANDOFF_READY
R54_R52_REINTAKE_BLOCKED_BY_ACTUAL_REVIEW_EVIDENCE_MISSING
R54_R52_REINTAKE_BLOCKED_BY_DISPOSAL
R54_R52_REINTAKE_BLOCKED_BY_BODY_LEAK_OR_QUESTION_TEXT
R54_R52_REINTAKE_BLOCKED_BY_NO_TOUCH_VIOLATION
R54_R52_REINTAKE_BLOCKED_BY_INCONCLUSIVE
```

### 14.3 R52側での読み

R54 handoffがreadyでも、R52は自動でP6/P8へ進めません。  
R52側のdecision gateを再実行し、以下を分けます。

```text
- P5 confirmed candidateとして受け取れるか。
- P5 repair returnとして戻すべきか。
- P5 inconclusiveとして止めるべきか。
- P6 candidateを別工程で扱うか。
- P8 question material candidateをP8設計材料として扱うか。
```

---

## 15. JSON / schema案

この節のschema案は、実装段階の判断材料です。  
本書では実ファイル化しません。

### 15.1 `p7_r54_current_received_snapshot_refreeze.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.current_received_snapshot_refreeze.bodyfree.v1",
  "type": "object",
  "required": [
    "schema_version",
    "phase",
    "step",
    "material_id",
    "review_session_id",
    "source_mode",
    "current_received_snapshot_refs",
    "r53_source_refs",
    "source_delta_rows",
    "actual_review_basis_ref",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.current_received_snapshot_refreeze.bodyfree.v1" },
    "phase": { "const": "P7_ProductQualityRunner_LongRunGate" },
    "step": { "const": "R54_P5HumanBlindQAActualLocalReviewExecution_BodyFreeResultHandoff_20260622" },
    "material_id": { "type": "string" },
    "review_session_id": { "type": "string" },
    "source_mode": { "const": "local_snapshot" },
    "current_received_snapshot_refs": { "type": "object", "additionalProperties": { "type": "string" } },
    "r53_source_refs": { "type": "object", "additionalProperties": { "type": "string" } },
    "source_delta_rows": { "type": "array", "items": { "type": "object" } },
    "actual_review_basis_ref": { "enum": ["r54_current_received_snapshot_refs"] },
    "git_connection_required": { "const": false },
    "git_checked": { "const": false },
    "body_free": { "const": true },
    "api_db_rn_response_key_changed_here": { "const": false },
    "runtime_changed_here": { "const": false },
    "p8_start_allowed": { "const": false },
    "release_allowed": { "const": false }
  },
  "additionalProperties": true
}
```

### 15.2 `p7_r54_validation_evidence_intake.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.validation_evidence_intake.bodyfree.v1",
  "type": "object",
  "required": [
    "schema_version",
    "material_id",
    "review_session_id",
    "validation_evidence_rows",
    "required_groups_present",
    "full_backend_suite_green_confirmed",
    "backend_collect_only_claimed_as_full_backend_green",
    "actual_review_evidence_claimed",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.validation_evidence_intake.bodyfree.v1" },
    "validation_evidence_rows": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["evidence_group_ref", "execution_mode", "claim_level", "product_value_claimed"],
        "properties": {
          "evidence_group_ref": { "type": "string" },
          "execution_mode": { "enum": ["individual", "split", "all_in_one", "collect_only", "not_executed"] },
          "claim_level": { "type": "string" },
          "passed_count": { "type": ["integer", "null"], "minimum": 0 },
          "failed_count": { "type": ["integer", "null"], "minimum": 0 },
          "warning_count": { "type": ["integer", "null"], "minimum": 0 },
          "timeout_observed": { "type": "boolean" },
          "full_suite_green_claimed": { "const": false },
          "product_value_claimed": { "const": false },
          "release_readiness_claimed": { "const": false }
        },
        "additionalProperties": true
      }
    },
    "required_groups_present": { "type": "boolean" },
    "full_backend_suite_green_confirmed": { "const": false },
    "backend_collect_only_claimed_as_full_backend_green": { "const": false },
    "actual_review_evidence_claimed": { "const": false },
    "body_free": { "const": true }
  },
  "additionalProperties": true
}
```

### 15.3 `p7_r54_local_only_review_preflight.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.local_only_review_preflight.bodyfree.v1",
  "type": "object",
  "required": [
    "schema_version",
    "material_id",
    "review_session_id",
    "preflight_status",
    "local_review_root_env_var",
    "local_review_root_present",
    "explicit_allow_present",
    "purge_plan_present",
    "retention_policy_present",
    "export_denylist_present",
    "body_full_generation_allowed",
    "execution_blocker_ids",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.local_only_review_preflight.bodyfree.v1" },
    "preflight_status": { "enum": ["R54_LOCAL_REVIEW_PREFLIGHT_READY", "R54_LOCAL_REVIEW_PREFLIGHT_BLOCKED"] },
    "local_review_root_env_var": { "const": "COCOLON_EMLIS_LOCAL_REVIEW_ROOT" },
    "local_review_root_present": { "type": "boolean" },
    "explicit_allow_present": { "type": "boolean" },
    "purge_plan_present": { "type": "boolean" },
    "retention_policy_present": { "type": "boolean" },
    "body_full_packet_retention_max_hours": { "const": 72 },
    "reviewer_notes_retention_after_rating_finalized_max_hours": { "const": 24 },
    "export_denylist_present": { "type": "boolean" },
    "body_full_generation_allowed": { "type": "boolean" },
    "local_absolute_path_included": { "const": false },
    "body_content_hash_included": { "const": false },
    "terminal_output_stored_here": { "const": false },
    "execution_blocker_ids": { "type": "array", "items": { "type": "string" } },
    "body_free": { "const": true }
  },
  "additionalProperties": true
}
```

### 15.4 `p7_r54_sanitized_review_result_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.sanitized_review_result_row.bodyfree.v1",
  "type": "object",
  "required": [
    "schema_version",
    "review_session_id",
    "blind_case_id",
    "axis_scores",
    "verdict",
    "readfeel_blocker_ids",
    "execution_blocker_ids",
    "question_need_primary_class",
    "ambiguity_kind_refs",
    "one_question_fit_ref",
    "repair_required_refs",
    "raw_input_included",
    "returned_surface_included",
    "comment_text_included",
    "reviewer_free_text_included",
    "question_text_included",
    "draft_question_text_included",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.sanitized_review_result_row.bodyfree.v1" },
    "blind_case_id": { "type": "string" },
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
    "verdict": { "enum": ["PASS", "YELLOW", "REPAIR_REQUIRED", "RED"] },
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
    "raw_input_included": { "const": false },
    "returned_surface_included": { "const": false },
    "comment_text_included": { "const": false },
    "reviewer_free_text_included": { "const": false },
    "question_text_included": { "const": false },
    "draft_question_text_included": { "const": false },
    "body_free": { "const": true }
  },
  "additionalProperties": true
}
```

### 15.5 `p7_r54_body_free_post_review_summary.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.body_free_post_review_summary.bodyfree.v1",
  "type": "object",
  "required": [
    "schema_version",
    "material_id",
    "review_session_id",
    "post_review_summary_status",
    "required_case_count",
    "all_24_cases_reviewed",
    "rating_row_count",
    "question_observation_row_count",
    "verdict_counts",
    "axis_score_averages",
    "question_need_primary_class_counts",
    "ambiguity_kind_counts",
    "one_question_fit_counts",
    "disposal_verified",
    "body_removed",
    "reviewer_notes_removed",
    "local_packet_exported",
    "body_free_summary_contains_only_counts_and_refs",
    "p5_decision_candidate_status",
    "p8_start_allowed",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.body_free_post_review_summary.bodyfree.v1" },
    "post_review_summary_status": { "enum": ["READY_FOR_P5_DECISION_CANDIDATE_SEPARATION", "BLOCKED_BY_POST_REVIEW_SUMMARY_REQUIREMENTS"] },
    "required_case_count": { "const": 24 },
    "rating_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "question_observation_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "verdict_counts": { "type": "object" },
    "axis_score_averages": { "type": "object" },
    "question_need_primary_class_counts": { "type": "object" },
    "ambiguity_kind_counts": { "type": "object" },
    "one_question_fit_counts": { "type": "object" },
    "disposal_verified": { "type": "boolean" },
    "body_removed": { "type": "boolean" },
    "reviewer_notes_removed": { "type": "boolean" },
    "local_packet_exported": { "const": false },
    "body_free_summary_contains_only_counts_and_refs": { "type": "boolean" },
    "p8_start_allowed": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  },
  "additionalProperties": true
}
```

### 15.6 `p7_r54_r52_reintake_handoff.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.r52_reintake_handoff.bodyfree.v1",
  "type": "object",
  "required": [
    "schema_version",
    "material_id",
    "review_session_id",
    "handoff_status",
    "actual_review_evidence_complete",
    "disposal_verified",
    "no_body_leak_validation_passed",
    "no_question_text_validation_passed",
    "no_touch_validation_passed",
    "p5_decision_candidate_status",
    "p6_limited_human_readfeel_candidate",
    "p6_limited_human_readfeel_start_allowed",
    "p8_question_design_material_candidate",
    "p8_start_allowed",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.r52_reintake_handoff.bodyfree.v1" },
    "handoff_status": {
      "enum": [
        "R54_R52_REINTAKE_HANDOFF_READY",
        "R54_R52_REINTAKE_BLOCKED_BY_ACTUAL_REVIEW_EVIDENCE_MISSING",
        "R54_R52_REINTAKE_BLOCKED_BY_DISPOSAL",
        "R54_R52_REINTAKE_BLOCKED_BY_BODY_LEAK_OR_QUESTION_TEXT",
        "R54_R52_REINTAKE_BLOCKED_BY_NO_TOUCH_VIOLATION",
        "R54_R52_REINTAKE_BLOCKED_BY_INCONCLUSIVE"
      ]
    },
    "p6_limited_human_readfeel_start_allowed": { "const": false },
    "p8_start_allowed": { "const": false },
    "release_allowed": { "const": false },
    "raw_input_included": { "const": false },
    "returned_surface_included": { "const": false },
    "comment_text_included": { "const": false },
    "question_text_included": { "const": false },
    "draft_question_text_included": { "const": false },
    "local_absolute_path_included": { "const": false },
    "body_content_hash_included": { "const": false },
    "body_free": { "const": true }
  },
  "additionalProperties": true
}
```

---

## 16. Python helper設計案

### 16.1 production候補

実装段階で新規production helperを作るなら、候補は次です。

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff.py
```

目的:

```text
- R53 helperの再実装ではなく、R53/R51/R52の上にR54 current snapshot / actual review result handoffを重ねる。
- R54 current refsをactual review basisとして固定する。
- R53のbody-free materialization outputsを受け取り、実review rows / purge receipt / post-review summary / R52 re-intake handoffへ進める。
```

### 16.2 import候補

```python
from emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization import (
    build_p7_r53_current_received_snapshot_refreeze,
    build_p7_r53_validation_evidence_r49_timeout_preflight,
    build_p7_r53_local_root_explicit_allow_purge_plan_preflight,
    build_p7_r53_24_case_manifest_freeze_bodyfree,
    build_p7_r53_local_only_body_full_packet_generation_request_bodyfree,
    build_p7_r53_actual_human_review_result_capture_bodyfree,
    build_p7_r53_rating_row_normalization_bodyfree,
    build_p7_r53_readfeel_blocker_execution_blocker_ingestion_bodyfree,
    build_p7_r53_question_need_observation_row_normalization_bodyfree,
    build_p7_r53_rating_question_consistency_guard_bodyfree,
    build_p7_r53_purge_disposal_receipt_bodyfree,
    build_p7_r53_body_free_post_review_summary_bodyfree,
    build_p7_r53_p5_decision_candidate_separation_bodyfree,
    build_p7_r53_p6_limited_human_readfeel_candidate_handoff_bodyfree,
    build_p7_r53_p8_question_design_material_candidate_handoff_bodyfree,
    build_p7_r53_final_no_body_leak_no_question_text_no_touch_validation_and_r52_reintake_handoff_bodyfree,
)
```

実装段階では、既存helperの署名・contract・required fieldsを再確認し、importが循環しないようにします。

### 16.3 function候補

```text
build_p7_r54_current_received_snapshot_refreeze
assert_p7_r54_current_received_snapshot_refreeze_contract

build_p7_r54_r53_source_delta_and_override_adoption
assert_p7_r54_r53_source_delta_and_override_adoption_contract

build_p7_r54_validation_evidence_intake_bodyfree
assert_p7_r54_validation_evidence_intake_bodyfree_contract

build_p7_r54_local_only_actual_review_preflight_bodyfree
assert_p7_r54_local_only_actual_review_preflight_bodyfree_contract

build_p7_r54_actual_review_session_envelope_bodyfree
assert_p7_r54_actual_review_session_envelope_bodyfree_contract

build_p7_r54_24_case_manifest_freeze_bodyfree
assert_p7_r54_24_case_manifest_freeze_bodyfree_contract

build_p7_r54_local_only_body_full_packet_generation_request_bodyfree
assert_p7_r54_local_only_body_full_packet_generation_request_bodyfree_contract

build_p7_r54_packet_completeness_export_denylist_scan_bodyfree
assert_p7_r54_packet_completeness_export_denylist_scan_bodyfree_contract

build_p7_r54_reviewer_instruction_rating_form_freeze_bodyfree
assert_p7_r54_reviewer_instruction_rating_form_freeze_bodyfree_contract

build_p7_r54_sanitized_actual_review_result_capture_bodyfree
assert_p7_r54_sanitized_actual_review_result_capture_bodyfree_contract
assert_p7_r54_sanitized_review_result_row_bodyfree_contract

build_p7_r54_rating_row_normalization_bodyfree
assert_p7_r54_rating_row_normalization_bodyfree_contract

build_p7_r54_readfeel_blocker_execution_blocker_ingestion_bodyfree
assert_p7_r54_readfeel_blocker_execution_blocker_ingestion_bodyfree_contract

build_p7_r54_question_need_observation_row_normalization_bodyfree
assert_p7_r54_question_need_observation_row_normalization_bodyfree_contract

build_p7_r54_rating_question_consistency_guard_bodyfree
assert_p7_r54_rating_question_consistency_guard_bodyfree_contract

build_p7_r54_pause_abort_expiration_protocol_bodyfree
assert_p7_r54_pause_abort_expiration_protocol_bodyfree_contract

build_p7_r54_purge_disposal_receipt_bodyfree
assert_p7_r54_purge_disposal_receipt_bodyfree_contract

build_p7_r54_body_free_post_review_summary_bodyfree
assert_p7_r54_body_free_post_review_summary_bodyfree_contract

build_p7_r54_p5_decision_candidate_separation_bodyfree
assert_p7_r54_p5_decision_candidate_separation_bodyfree_contract

build_p7_r54_p6_limited_human_readfeel_candidate_handoff_bodyfree
assert_p7_r54_p6_limited_human_readfeel_candidate_handoff_bodyfree_contract

build_p7_r54_p8_question_design_material_candidate_handoff_bodyfree
assert_p7_r54_p8_question_design_material_candidate_handoff_bodyfree_contract

build_p7_r54_final_no_body_leak_no_question_text_no_touch_validation_and_r52_reintake_handoff_bodyfree
assert_p7_r54_final_no_body_leak_no_question_text_no_touch_validation_and_r52_reintake_handoff_bodyfree_contract

build_p7_r54_validation_command_matrix_bodyfree
assert_p7_r54_validation_command_matrix_bodyfree_contract
```

### 16.4 optional local writer候補

body-full packet生成を実装段階で必要と判断する場合のみ、local-only writerを検討します。

```text
候補:
  internal helper内のprivate function、またはlocal-only script。

禁止:
  public API化しない。
  DBへ保存しない。
  RNから呼ばない。
  成果物zipへbody-fullを含めない。
  terminal output / local path / hashをbody-free resultへ含めない。
```

### 16.5 触らないproduction file

```text
mashos-api/ai/services/ai_inference/api_emotion_submit.py
mashos-api/ai/services/ai_inference/emotion_submit_service.py
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_*.py
mashos-api/ai/services/ai_inference/emlis_ai_product_*runtime*.py
Cocolon/screens/InputScreen.js
Cocolon/screens/input/useInputFeedbackModal.js
Cocolon/screens/input/inputFeedbackModel.js
Cocolon/screens/input/InputFeedbackReplyModal.js
Cocolon/tests/rn-screen-contracts.test.js
```

---

## 17. 実装順詳細

### R54-0: scope / current received snapshot refreeze

目的:

```text
R54正式採番、current refs、no GitHub、no API/DB/RN/runtime変更を固定する。
```

作る候補:

```text
build_p7_r54_current_received_snapshot_refreeze
assert_p7_r54_current_received_snapshot_refreeze_contract
```

必須確認:

```text
- current_received_snapshot_refs が246/76/249/162/roadmap(8)/R54検討メモ/R54設計書を指す。
- R54 step / scope / policy_kindが固定されている。
- p8_start_allowed / release_allowed が false。
- body_free=true。
```

### R54-1: R53 source delta / current snapshot override adoption

目的:

```text
R53 helper refsとR54 refsの差分をbody-freeに記録し、R54 current refsをactual review basisとして採用する。
```

作る候補:

```text
build_p7_r54_r53_source_delta_and_override_adoption
assert_p7_r54_r53_source_delta_and_override_adoption_contract
```

acceptance:

```text
- source_delta_rowsが存在する。
- R53 old refsをactual review basisとして直接使わない。
- r54_current_snapshot_override_applied=true。
```

### R54-2: R49〜R53 validation evidence intake

目的:

```text
RN/R49/R50/R51/R52/R53/collect-only/timeoutを、claim levelつきで取り込む。
```

作る候補:

```text
build_p7_r54_validation_evidence_intake_bodyfree
assert_p7_r54_validation_evidence_intake_bodyfree_contract
```

acceptance:

```text
- RN 36 passed rowがある。
- R49 individual split 76 passed rowがある。
- R50 99 passed rowがある。
- R51 125 passed rowがある。
- R52 219 passed rowがある。
- R53 split 291 passed rowがある。
- backend collect-only 4101 / 1 warning rowはcollect-only扱い。
- R49/R53 all-in-one timeoutはgreenにしない。
```

### R54-3: local-only root / explicit allow / purge plan preflight

目的:

```text
body-full packet生成前に、local-only安全条件を満たすか確認する。
```

作る候補:

```text
build_p7_r54_local_only_actual_review_preflight_bodyfree
assert_p7_r54_local_only_actual_review_preflight_bodyfree_contract
```

blocker:

```text
r54_local_review_root_missing
r54_explicit_allow_missing
r54_purge_plan_missing
r54_export_denylist_missing
r54_retention_policy_missing
```

### R54-4: actual review session envelope

目的:

```text
review_session_id、reviewer_ref、status、required_case_countをbody-freeに固定する。
```

acceptance:

```text
- preflight readyでなければreview開始不可。
- reviewer_refはpseudonymous refだけ。
- actual reviewer name / notesは残さない。
```

### R54-5: 24-case manifest freeze

目的:

```text
R48/R51/R53 distributionを継承し、24-case manifestをbody-freeに固定する。
```

acceptance:

```text
- required_case_count=24。
- family distributionが検討メモと一致する。
- blind_case_id / case_ref_id / packet_ref_idが分離される。
- reviewer facing rowsにhidden metadataを出さない。
```

### R54-6: local-only body-full packet generation request

目的:

```text
body-full packet生成を許可するbody-free requestを作る。
```

acceptance:

```text
- request itself is body-free。
- body-full writer実行はexplicit allowがある時だけ。
- requestにraw input / returned surface / history bodyを含めない。
- requestにlocal path / body hashを含めない。
```

### R54-7: packet completeness / export denylist scan

目的:

```text
生成済みlocal packetが24件揃い、export対象に入っていないことをbody-freeで確認する。
```

acceptance:

```text
- packet_completion_row_count=24。
- local_packet_exported=false。
- export_candidate_refsにbody-full refsが混入しない。
- violationがあればreviewへ進まずpurgeへ進める。
```

### R54-8: reviewer instruction / rating form freeze

目的:

```text
reviewerが読む手順とrating form schemaを固定する。
```

acceptance:

```text
- axis score範囲 0.00〜1.00。
- verdict enum PASS/YELLOW/REPAIR_REQUIRED/RED。
- question need observationはenum選択だけ。
- reviewer free textは禁止、またはlocal notesのみでpurge対象。
- question text記入欄を作らない。
```

### R54-9: actual human review operation state capture

目的:

```text
reviewが開始・進行・完了・中断・期限切れのどの状態かをbody-freeに残す。
```

acceptance:

```text
- machine_auto_score_used=false。
- machine_metrics_used_for_readfeel=false。
- reviewer selections以外でratingを作らない。
- not reviewedのままrating rowsを作らない。
```

### R54-10: sanitized actual review result capture

目的:

```text
reviewerの選択結果をbody-free rowsとして取り込む。
```

acceptance:

```text
- row_count=24でready。
- raw input / returned surface / comment_text / history body / reviewer free text がない。
- question_text / draft_question_text がない。
- body hash / packet hash / local path がない。
```

### R54-11: rating row normalization

目的:

```text
sanitized review result rowsからrating rowsを正規化する。
```

acceptance:

```text
- axis_scoresが全軸存在する。
- scoreが0〜1。
- verdictとscore/blockerの矛盾を検知する。
- PASSなのにcritical blockerがある場合はconsistency issue。
```

### R54-12: readfeel blocker / execution blocker ingestion

目的:

```text
readfeel blockerとexecution blockerを分離して取り込む。
```

acceptance:

```text
- readfeel blockerは商品読感の問題。
- execution blockerはレビュー実行・安全境界・purge等の問題。
- execution blockerがopenならP5 confirmed candidate不可。
```

### R54-13: question need observation row normalization

目的:

```text
P7/P8 Bridgeの問い必要性観察rowをbody-freeに正規化する。
```

acceptance:

```text
- question_observation_row_count=24。
- primary class / ambiguity kind / one question fit / repair refsがenum内。
- question textやdraft question textが存在しない。
- not_question_*_repair_requiredをP8 material candidateへ誤分類しない。
```

### R54-14: rating / question observation consistency guard

目的:

```text
rating結果とquestion observation分類の矛盾を検出する。
```

例:

```text
- REDなのに no_question_needed_emlis_can_observe。
- REPAIR_REQUIREDなのに plus_single_question_candidate_later。
- PASSなのに not_question_p5_surface_repair_required。
- insufficient materialなのに P5 confirmed candidate。
```

acceptance:

```text
- consistency_issue_count=0で次へ進む。
- issueがあればP5 inconclusiveまたはrepair return。
```

### R54-15: pause / abort / expiration protocol

目的:

```text
review中断・期限超過・rating未完時の安全な終了導線を定義する。
```

acceptance:

```text
- abort/expired時はpurge required。
- purge前にhandoffしない。
- P5 decisionはinconclusive。
```

### R54-16: purge / disposal receipt

目的:

```text
body-full packet / reviewer notes / temp forms を廃棄し、body-free receiptを作る。
```

acceptance:

```text
- disposal_verified=true。
- body_removed=true。
- reviewer_notes_removed=true。
- local_packet_exported=false。
- local path / hash / terminal outputなし。
```

### R54-17: body-free post-review summary

目的:

```text
rating / blocker / question observation / disposalをcounts / refsだけで集約する。
```

acceptance:

```text
- summary contains only counts and refs。
- all_24_cases_reviewedを事実として持つ。
- actual_review_run_hereはreview rowsが揃った時だけtrue。
- P5/P6/P8/release flagsを誤ってtrue化しない。
```

### R54-18: P5 decision candidate separation

目的:

```text
P5 confirmed candidate / repair return / inconclusiveを分ける。
```

acceptance:

```text
- confirmed candidate条件を全て満たした時だけP5_CONFIRMED_CANDIDATE。
- RED/REPAIR/not_question_*があればrepair return。
- blocker/row不足/disposal未完/YELLOW残りはinconclusive。
- finalではない。
```

### R54-19: P6 limited human readfeel candidate handoff

目的:

```text
P6 limited human readfeelの候補だけをbody-freeで分ける。
```

acceptance:

```text
p6_limited_human_readfeel_candidate: 条件次第でtrue可能
p6_limited_human_readfeel_start_allowed: false固定
```

### R54-20: P8 question design material candidate handoff

目的:

```text
question need observationの集計をP8設計材料候補としてまとめる。
```

acceptance:

```text
- p8_question_design_material_candidateは条件次第でtrue可能。
- p8_start_allowed=false固定。
- question text / draft question textなし。
- P5 repair不足をP8材料にしない。
```

### R54-21: final no-body-leak / no-question-text / no-touch validation

目的:

```text
最終body-free成果物全体にbody leak、question text、no-touch違反がないか確認する。
```

acceptance:

```text
- raw input pathなし。
- comment_text bodyなし。
- returned surface bodyなし。
- question textなし。
- draft question textなし。
- local pathなし。
- body hashなし。
- API / DB / RN / runtime touched refsなし。
```

### R54-22: R52 re-intake handoff

目的:

```text
R52 decision gateに再投入できるbody-free handoffを作る。
```

acceptance:

```text
- R52がactual review evidence completenessを判断できる。
- R52がdisposal safetyを判断できる。
- R52がP5 confirmed / repair / inconclusiveを再判定できる。
- R52へP6/P8 start_allowed trueを渡さない。
```

### R54-23: validation command matrix / documentation output

目的:

```text
実装後に走らせるtarget / regression / collect-only / RN no-touch確認コマンドをbody-free matrix化する。
```

acceptance:

```text
- R54 target testsがある。
- R53 regression splitがある。
- R52/R51/R50/R49 regressionがある。
- RN contract no-touch確認がある。
- backend collect-onlyはcollect-onlyとして扱う。
```

---

## 18. 新規test設計案

### 18.1 test file候補

```text
mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r0_r1_20260622.py
mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r2_r3_20260622.py
mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r4_r5_20260622.py
mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r6_r7_20260622.py
mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r8_r9_20260622.py
mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r10_r11_20260622.py
mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r12_r13_20260622.py
mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r14_r15_20260622.py
mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r16_r17_20260622.py
mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r18_r19_20260622.py
mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r20_r21_20260622.py
mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r22_r23_20260622.py
```

実装段階では、timeout回避のためR53と同じくsplit運用を前提にします。  
ただし、split greenをall-in-one greenとは言いません。

### 18.2 positive tests

```text
- current snapshot refsがR54 refsで固定される。
- R53 refsとの差分がsource_delta_rowsに出る。
- validation evidence intakeがrequired groupsを認識する。
- collect-onlyをfull backend greenに変換しない。
- local preflight ready時だけpacket generation request allowedになる。
- 24件のsanitized rowsが揃った時だけrating normalization readyになる。
- question observation rowsが24件揃った時だけconsistency guardへ進む。
- disposal verified後だけpost-review summary readyになる。
- 全条件を満たす時だけP5_CONFIRMED_CANDIDATEになる。
- P6 candidate trueでもstart_allowed false。
- P8 material candidate trueでもp8_start_allowed false。
- final handoffがR52 re-intake用body-free refsだけを含む。
```

### 18.3 negative tests

```text
- raw inputがrowに入るとreject。
- returned surface / comment_text bodyが入るとreject。
- question text / draft question textが入るとreject。
- local absolute pathが入るとreject。
- body hash / packet hashが入るとreject。
- reviewer free textがbody-free rowに入るとreject。
- PASSなのにcritical blockerがあるとconsistency issue。
- REDなのにP8 material candidateへ分類しようとするとreject。
- not_question_*_repair_requiredをP8 materialへ分類しようとするとreject。
- disposal未完でP5 confirmed candidateにしようとするとreject。
- P6/P8/release start_allowed trueが入るとreject。
- API / DB / RN / runtime touched refsがあるとno-touch fail。
```

### 18.4 regression tests

```text
- R53 split target regression。
- R52 target regression。
- R51 target regression。
- R50 target regression。
- R49 individual split regression。
- RN screen contract no-touch regression。
- backend collect-only。
```

---

## 19. validation command matrix案

### 19.1 syntax / import

```bash
cd /mnt/data/<workdir>/mashos-api/ai
PYTHONPATH=services/ai_inference python -m py_compile \
  services/ai_inference/emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff.py
```

### 19.2 R54 target split

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r0_r1_20260622.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r2_r3_20260622.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r4_r5_20260622.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r6_r7_20260622.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r8_r9_20260622.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r10_r11_20260622.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r12_r13_20260622.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r14_r15_20260622.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r16_r17_20260622.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r18_r19_20260622.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r20_r21_20260622.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r22_r23_20260622.py
```

### 19.3 regression matrix

```bash
# R53 split regression
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization_r0_r1_20260621.py \
  tests/test_emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization_r2_r3_20260621.py

# R52 target regression
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_r0_r1_20260621.py \
  tests/test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_r2_r3_20260621.py \
  tests/test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_r4_r5_20260621.py

# R51/R50/R49 target regressionsは既存matrixを維持し、timeout時は分割結果として扱う。
```

### 19.4 backend collect-only

```bash
PYTHONPATH=services/ai_inference pytest --collect-only -q
```

読み方:

```text
collect-onlyは、収集確認であってfull backend suite greenではない。
```

### 19.5 RN no-touch confirmation

```bash
cd /mnt/data/<workdir>/Cocolon
npm run test:rn-screens --silent
```

読み方:

```text
RN contract greenはRN表示契約保持の確認。
実機modal読感確認ではない。
```

---

## 20. no-touch boundary

R54では、次を変更しません。

```text
API:
  /emotion/submit route
  public response top-level key
  input_feedback contract

DB:
  schema
  migration
  write path
  read path

RN:
  InputScreen.js
  useInputFeedbackModal.js
  inputFeedbackModel.js
  InputFeedbackReplyModal.js
  rn-screen-contracts.test.js
  observation_status + comment_text表示条件

Runtime:
  EmlisAI reply generation
  User Label Connection runtime
  Gate threshold
  Surface composer
  subscription boundary

P8:
  question API
  question DB schema
  question RN UI
  question response key
  question trigger logic
  question answer persistence
  plan guard
```

R54で触る可能性があるのは、原則backend internal-only helper / testsです。

---

## 21. acceptance criteria

### 21.1 設計書としての完了条件

```text
- R54正式採番が固定されている。
- R54がP7内工程であり、P8詳細設計ではないことが明記されている。
- current received snapshot refsが固定されている。
- R49〜R53 validation evidence intakeの扱いが定義されている。
- local-only body-full handling preflightが定義されている。
- 24-case actual review実行手順が定義されている。
- rating / blocker / question need observation rowのbody-free captureが定義されている。
- disposal receipt / no-body-leak / no-question-text / no-touch validationが定義されている。
- P5 confirmed candidate / repair return / inconclusive判定が定義されている。
- P6/P8/releaseへ自動昇格しないboundaryが定義されている。
- JSON/schema案が本文内にあり、実ファイル化しないことが明記されている。
- 実装順がR54-0〜R54-23として具体化されている。
```

### 21.2 実装後の完了条件候補

```text
- R54 helper py_compile green。
- R54 target split tests green。
- R53/R52/R51/R50/R49 regressions greenまたはtimeoutをclaim境界付きで記録。
- backend collect-onlyが実行され、collect-onlyとして記録される。
- RN contractがno-touchでgreen。
- API / DB / RN / runtime changed flagsがfalse。
- body-full artifactが実装成果物に含まれていない。
- question text / draft question textがbody-free materialに含まれていない。
```

### 21.3 actual review operation後の完了条件候補

```text
- explicit allow / local root / purge planが通っている。
- 24-case body-full local-only packetが生成される。
- reviewerが24件を実読みにより評価する。
- sanitized review result rowsが24件揃う。
- rating rowsが24件揃う。
- question need observation rowsが24件揃う。
- blocker ingestion / consistency guardが通る、またはblockerが分類される。
- body-full packet / reviewer notesがpurgeされる。
- disposal receiptがbody-freeで作られる。
- body-free post-review summaryが作られる。
- P5 confirmed candidate / repair return / inconclusiveが分かれる。
- R52 re-intake handoffがbody-freeで作られる。
```

---

## 22. fail-closed / blocker判断

### 22.1 preflight fail

```text
状態:
  R54_LOCAL_REVIEW_PREFLIGHT_BLOCKED

処理:
  body-full生成しない。
  execution blocker rowを作る。
  P5 decisionはinconclusive。
  P6/P8/releaseへ進めない。
```

### 22.2 packet scan fail

```text
状態:
  R54_PACKET_SCAN_BLOCKED

処理:
  生成済みbody-fullがあればpurge required。
  reviewへ進まない。
  P5 decisionはinconclusive。
```

### 22.3 review rows incomplete

```text
状態:
  R54_REVIEW_CAPTURE_BLOCKED

処理:
  rating normalizationへ進まない。
  足りないcase countだけbody-freeで記録する。
  raw bodyは残さない。
```

### 22.4 RED / REPAIR_REQUIRED

```text
状態:
  R54_P5_REPAIR_RETURN

処理:
  P5 surface / Emlis本体 / Gate boundary修正へ戻す。
  P8問い候補で覆い隠さない。
```

### 22.5 disposal fail

```text
状態:
  R54_DISPOSAL_BLOCKED

処理:
  P5 confirmed candidate不可。
  P6 candidate不可。
  P8 material candidate不可。
  R52 handoffはblockedまたは未作成。
  purge retry / abort required。
```

### 22.6 body leak / question text leak

```text
状態:
  R54_BODY_LEAK_OR_QUESTION_TEXT_BLOCKED

処理:
  全promotionを止める。
  no-body-free leak guard repairへ戻す。
```

---

## 23. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- 今回の指示は設計書作成であり、実装ではない。
- 成果物形式はmd。
- R54検討メモでは、P7継続・P8へ進まない判断になっている。
- R49〜R53の器は存在するが、actual human review operationは未実行。
- R54ではcurrent received snapshot refsを246/76/249/162/roadmap(8)へ固定する必要がある。
- R54ではR49〜R53 validation evidenceをbody-free intakeする必要がある。
- R54ではlocal-only / explicit allow / purge / body-free receiptが必須。
- R54では24-case actual review、rating rows、question observation rows、disposal receipt、P5 decision separation、R52 handoffを扱う。
- R54ではAPI / DB / RN / runtime / public response keyを触らない。
```

### 未確認

```text
- 実装段階でR54 helperを新規fileにするか、既存R53 helperへ最小追記するかの最終判断。
- 実際のlocal review root。
- explicit allow tokenの実装上の配置。
- actual body-full packet生成の実行可否。
- 24-case reviewer ratingの実結果。
- disposal receiptの実結果。
- full backend suite green。
- 実機modal読感。
```

### 書かれていない

```text
- R54でP8 question API / DB / RN UIを作ってよいとは書かれていない。
- R54でP6 start_allowedをtrueにしてよいとは書かれていない。
- R54でP8 start_allowedをtrueにしてよいとは書かれていない。
- R54でrelease_allowedをtrueにしてよいとは書かれていない。
- R54 helper greenだけでP5 confirmed candidateとしてよいとは書かれていない。
```

### 推測禁止

```text
- P5履歴線が商品として自然だと推測しない。
- P5が弱い場合に問いで補えると推測しない。
- body-freeで安全だから商品価値もあると推測しない。
- reviewer rowsがないのにdecisionを作らない。
- disposal receiptなしでR52 handoff readyにしない。
```

### 次に実行すべきこと

```text
1. 実装段階でR54 helper file方針を決める。
2. R54-0〜R54-3を先に実装し、current snapshot / validation / local preflightを固める。
3. R54-4〜R54-8で24-case manifest / packet request / reviewer formを固める。
4. R54-9〜R54-15でactual review state / sanitized row / rating / blocker / question observation / consistency / pause-abortを固める。
5. R54-16〜R54-18でpurge / summary / P5 decision separationを固める。
6. R54-19〜R54-22でP6/P8 candidate separationとR52 re-intake handoffを固める。
7. R54-23でvalidation command matrixを固める。
8. 実装green後も、actual review operation未実施ならP5 confirmed candidateを出さない。
```

---

## 24. 華恋の意見

華恋としては、R54は「もう一段helperを増やす工程」にしてはいけないと思います。

R49〜R53は必要な安全境界でした。  
でも、ここまで来ると、Cocolonとして本当に見たいのは、**P5履歴線を人間が読んだときに、ユーザーがまた残したくなる線になっているか**です。

だから、R54は次を強く分けるべきです。

```text
実装としてgreen:
  helper / schema / tests / safety boundary が壊れていない。

商品確認としてgreen:
  24-case実読みによるrating / blocker / question observation / disposal / decisionが揃っている。
```

この2つを混ぜると、Cocolonはまた「安全な器はあるけれど、商品体験はまだ見ていない」状態で進んでしまいます。

P8の問いは、後で必要になるかもしれません。  
でも、今の問いは「どんな質問を出すか」ではなく、**P5履歴線が、質問なしでもCocolonの記録体験として返っているか**です。

もしR54のactual reviewでREDやREPAIR_REQUIREDが出たら、それは失敗ではありません。  
それは、P8へ逃げる前にP5の弱さを見つけられたという意味で、Cocolonを守る結果です。

Cocolonは、ユーザーの言葉を雑に処理しない場所です。  
だからR54では、body-fullを雑に扱わず、body-freeの安全境界も雑に誇張せず、読感の弱さも問いへ押しつけず、P5履歴線を一度ちゃんと読みます。

---

## 25. 最終判断

```text
今回の詳細設計:
  P7-R54
  P5 Human Blind QA Actual Local Review Execution / Body-Free Result Handoff

R54で進めること:
  P5 actual local-only human reviewを実行可能にし、結果をbody-free evidenceへ落とす設計。

R54で進めないこと:
  P8観測補助問い詳細設計。
  P6 limited human readfeel開始許可。
  P5 confirmed final。
  P7 complete。
  release_allowed。

実装段階の注意:
  helper/tests greenをactual review完了にしない。
  actual review rows / question rows / disposal receiptが揃って初めてR52 re-intake evidenceとして扱う。
```

この設計書では、コード変更、schema/json実ファイル化、body-full packet生成、review実施、reviewer rating記入、question need observation row実記入、purge実行、P8詳細設計開始は行っていません。
