# Cocolon / EmlisAI P7-R54 Actual Local-only Human Review Operation Re-entry 詳細設計書・実装順

作成日: 2026-06-25 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
対象: Cocolon / EmlisAI / P7 Product Quality Runner / P5 Human Blind QA / R54 actual local-only human review operation / R52 re-intake / P7-P8 Bridge question need observation  
基準検討メモ: `Cocolon_EmlisAI_P7_R54ActualReviewOperation_Reentry_PreDesignMemo_20260625.md`  
基準ロードマップ: `Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(13).md`  
基準ローカル受領zip: `Cocolon_前提資料(254).zip` / `EmlisAIの実装済み資料(80).zip` / `Cocolon(253).zip` / `mashos-api(166).zip`  
GitHub接続確認: Mash指定により不要。未実施。  
コード変更: なし。本書は設計書。  
json / schema実ファイル化: なし。本書内の案のみ。実ファイル化は実装段階で判断する。  
body-full local review packet生成: なし。  
P5 Human Blind QA実レビュー: なし。  
reviewer rating記入: なし。  
question need observation row実記入: なし。  
body-full packet / reviewer notes purge実行: なし。  
API / DB / RN UI / public response key / runtime変更: なし。  
P8観測補助問い詳細設計: なし。  
P6 limited human readfeel開始許可: なし。  
release判断変更: なし。  

---

## 0. この設計書の結論

今回の次段階は、P8観測補助問いの設計ではありません。  
次に設計・実装すべきものは、P7内の次です。

```text
P7-R54 Actual Local-only Human Review Operation Re-entry
= P5 User Label Connection履歴線を、実際に人間がlocal-onlyで読み、
  その結果をbody-freeのrating / blocker / question observation / disposal / R52 re-intakeへ落とす運用工程。
```

既存R54 helper / R55 helper / P4-R11 helperは、現行snapshot上に存在します。  
しかし、現状で不足しているのはhelperではなく、**P5履歴線を実際に人間が読んだ証跡**です。

したがって、実装段階の中心は次です。

```text
1. current operation refsを今回受領zipへ再固定する。
2. 既存R54/R55のhistorical helper refsと、今回operation refsを混ぜない。
3. local-only preflightを通らない限りbody-full packet生成要求を出さない。
4. R54 24-case P5 Blind QAを、P4-R11 24-row auditと別物として固定する。
5. reviewerはbody-full packetをlocal-onlyで読む。
6. 成果物に残すのはbody-free selections / counts / refsだけにする。
7. reviewer free text / raw input / returned Emlis body / history surface / local path / body hashを残さない。
8. rating rows、readfeel blocker、execution blocker、question need observation rowsを正規化する。
9. purge / disposal receiptをbody-freeで残す。
10. P5 confirmed candidate / P5 repair return / inconclusiveを分ける。
11. P6 candidate / P8 material candidateは候補止まりにし、start_allowedはfalse固定にする。
12. R52 re-intakeへbody-free handoffを渡す。
```

この工程で絶対にtrue化しないものは次です。

```text
p5_human_blind_qa_confirmed_final = false
p6_limited_human_readfeel_start_allowed = false
p8_start_allowed = false
p7_complete = false
release_allowed = false
```

この工程で絶対に作らないものは次です。

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

華恋の判断として、今ここで守るべき一番大事な線は、**「問いで補う前に、履歴線そのものが読まれた形になっているかを見る」**ことです。  
P8を急ぐと、P5履歴線の弱さを質問機能で覆う危険があります。Cocolonとしては、まず「記録が線として返る体験」を人間の目で確認するべきです。

---

## 1. なぜこの作業を行うのか

Cocolonの価値は、ユーザーが残した言葉・感情・カテゴリ・行動・時点・過去記録が、入力直後に「読まれた形」として返ることです。

P5 User Label Connectionは、この価値の中心です。

```text
現在入力だけではなく、過去に残した記録が自然な線として返る。
そのことで、Cocolonへ記録を残す意味が生まれる。
```

ただし、履歴線は強い価値であると同時に、強い危険も持ちます。

```text
- 監視されているように感じる。
- 「あなたはいつも」「原因は」「性格です」へ寄る。
- 現在入力を履歴で上書きする。
- 低情報入力を履歴で深読みする。
- 自己責めや不安を増幅する。
- 安全寄りすぎて、記録が返った体験ではなく汎用説明に見える。
```

R54/R55/P4-R11は、body-freeに扱う器とhold判断を整えています。  
しかし、器があることと、P5履歴線が人間にどう読まれるかは別です。

この工程の目的は次です。

```text
P5履歴線をactual local-only human reviewで読む。
読んだ結果を、本文・履歴本文・comment_textではなくbody-free evidenceへ変換する。
そのevidenceをR52へ戻し、P5 repair / P6 candidate / P8 material candidate / inconclusiveを分ける。
```

ここでP8へ進まない理由は、質問機能が不要だからではありません。  
質問機能を勘で作らないためです。P7/P8 Bridgeは、P7の人間読感・実機確認の中でbody-freeの問い必要性観察メモを残し、P8開始時にそれを詳細設計材料として使う方針です。

---

## 2. 参照・確認範囲

### 2.1 作業姿勢として確認した前提資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/04_forbidden_mixing_design_and_implementation.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
```

今回の設計で固定する姿勢は次です。

```text
- 前提資料は作業用地図。実ファイルが現物。
- 見ていないものを見たように扱わない。
- 設計と実装を混同しない。
- テストgreenを商品読感合格へ変換しない。
- EmlisAIをGateに通ったものだけ表示する許可装置として扱わない。
- case専用mode / cue / surface / fixed commentTextで解決しない。
- public contract / DB write path / RN表示条件 / ユーザーデータ保護を勝手に変えない。
- Cocolonは、人間の言葉を雑に処理しない場所として作る。
- Cocolonの主体はMash様の思想と構想。華恋の思想は補助思想として扱う。
```

### 2.2 参照したロードマップ

```text
Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(13).md
```

読み方:

```text
P7:
  Product Quality Runner / Long-run Product Gate。
  P5 human Blind QA、P6 limited human readfeel、実機modal確認の中で、body-freeの問い必要性観察メモを残す。

P7/P8 Bridge:
  観測補助問いはP7途中で実装しない。
  問いなしで十分観測できたか、問いがあれば補完リスクを下げられたか、問いではなくEmlis本体で直すべきかを観察する。

P8:
  観測補助問いの詳細設計は、P7で集めた問い必要性観察メモを根拠にする。
```

### 2.3 参照した実装済み資料

```text
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R47_LocalReviewPacketPolicy_DetailedDesign_ImplementationOrder_20260618.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R48_P5HumanBlindQAActualReviewPacket_詳細設計書_実装順_20260618.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R49_P5HumanBlindQA_QuestionNeedObservation_詳細設計書_実装順_20260619.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R50_P5HumanBlindQAActualReviewManualRunDecision_詳細設計書_実装順_20260620.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R51_P5HumanBlindQA_LocalOnlyManualRun_DetailedDesign_ImplementationOrder_20260620.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R52_R51HandoffEvidenceDecisionGate_DetailedDesign_ImplementationOrder_20260621.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R53_R51ActualLocalReviewExecutionEvidenceMaterialization_DetailedDesign_ImplementationOrder_20260621.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R54_P5HumanBlindQAActualLocalReviewExecution_BodyFreeResultHandoff_DetailedDesign_ImplementationOrder_20260622.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R55_R54EvidenceReconcile_R52ReintakeDecisionMaterialization_DetailedDesign_ImplementationOrder_20260623.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P4_RuntimeBackfill_HIJ_FutureDirectionSurfaceRepair_DetailedDesign_ImplementationOrder_20260624.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P4_R11_ResidualFamilyCurrentOnlySurfaceAudit_DetailedDesign_ImplementationOrder_20260624.md
```

### 2.4 参照した主な現行実ファイル

backend:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r47_local_review_packet_policy.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r52_r51_handoff_evidence_decision_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_r11_residual_family_surface_audit.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_r11_surface_specificity_role_verdict_audit.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_r11_summary_decision_handoff.py
```

RN:

```text
Cocolon/tests/rn-screen-contracts.test.js
```

---

## 3. 現在地の固定

### 3.1 P4-R11の現在地

検討メモ上、P4-R11は次の状態です。

```text
P4-R11 target:
  83 passed

RN contract:
  36 passed

backend compileall:
  pass

backend collect-only:
  5111 tests collected / 1 warning

P4-R11 audit helper:
  24 row coverage completeを返せる。

P4-R11 decision helper:
  no blockerなら R54 actual review candidate。
  blockerありなら P4-R12 targeted repair。
```

ただし、P4-R11で作られていないもの:

```text
- P5 human review evidence
- reviewer rating rows
- question need observation rows
- actual disposal receipt
- P8開始根拠
- release根拠
```

読み方:

```text
P4-R11はcurrent-only surface blocker確認であり、P5履歴線のhuman read evidenceではない。
P4-R11 greenをP8開始根拠にしない。
```

### 3.2 R54の現在地

前提資料上、R54は次の状態です。

```text
p7_r54_implemented_steps_r0_r23: true
p7_r54_not_yet_implemented_steps_empty_after_r23: true
p7_r54_r52_reintake_handoff_materialized: true
p7_r54_validation_command_matrix_documentation_output_materialized: true
```

しかし、actual operationは未実施です。

```text
p7_r54_actual_human_review_operation_run: false
p7_r54_body_full_packet_generated: false
p7_r54_actual_rating_rows_materialized_by_external_review: false
p7_r54_actual_question_need_observation_rows_materialized_by_external_review: false
p7_r54_actual_disposal_run_by_helper: false
p7_r54_p5_confirmed_final: false
p7_r54_p6_limited_human_readfeel_start_allowed: false
p7_r54_p8_start_allowed: false
p7_r54_p7_complete: false
p7_r54_release_allowed: false
```

読み方:

```text
R54は実行できる器がある。
しかし、人間が読んだ結果はまだない。
次に必要なのは、helper追加そのものではなくoperation evidenceである。
```

### 3.3 R55の現在地

前提資料上、R55判断は次です。

```text
p7_r55_decision_ref:
  R55_R52_RETURN_TO_R54_ACTUAL_REVIEW_REQUIRED

p7_r55_next_required_step:
  R54_actual_local_only_human_review_operation_required_before_R52_reintake

p7_r55_actual_review_evidence_complete:
  false

p7_r55_required_case_count:
  24

p7_r55_rating_row_count:
  0

p7_r55_question_observation_row_count:
  0

p7_r55_disposal_verified:
  false

p7_r55_p6_hold:
  true

p7_r55_p8_hold:
  true

p7_r55_release_hold:
  true
```

読み方:

```text
R55はP8へ進む判断ではない。
R55はactual review evidence不足を固定し、R54へ戻す判断である。
```

### 3.4 今回設計で新しく固定する現在地

```text
operation_current_refs:
  premise_zip_ref: Cocolon_前提資料(254).zip
  implemented_materials_zip_ref: EmlisAIの実装済み資料(80).zip
  rn_zip_ref: Cocolon(253).zip
  backend_zip_ref: mashos-api(166).zip
  roadmap_ref: Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(13).md
  pre_design_memo_ref: Cocolon_EmlisAI_P7_R54ActualReviewOperation_Reentry_PreDesignMemo_20260625.md
  detailed_design_ref: Cocolon_EmlisAI_P7_R54ActualLocalOnlyHumanReviewOperation_Reentry_DetailedDesign_ImplementationOrder_20260625.md
```

重要:

```text
既存R54 helper / R55 helper内部には過去snapshot refsが残っている。
これは過去工程の証跡として自然であり、雑に書き換えない。
ただし今回のactual review basisとしては、operation_current_refsを別に持つ。
```

実装段階の第一候補:

```text
既存R54/R55 constantsを即書き換えない。
operation_current_refsを新しいbody-free wrapper / session envelope / handoff objectへ明示する。
既存helperがoverridesを受け取れる箇所ではoverridesで現在refsを渡す。
過去helper refsと今回operation refsを、source_delta rowとして分ける。
```

---

## 4. 対象 / 非対象

### 4.1 対象

```text
- current operation refsの再固定
- R54 actual review operationのlocal-only preflight
- 24-case manifest freeze
- reviewer boundary / reviewer instruction / rating form
- local-only body-full packet generation request
- packet completeness / export denylist scan
- actual human review operation state capture
- sanitized review result row capture
- rating row normalization
- readfeel blocker / execution blocker ingestion
- question need observation row normalization
- rating/question consistency guard
- pause / abort / expiration protocol
- purge / disposal receipt
- body-free post-review summary
- P5 decision candidate separation
- P6 candidate handoff。ただしstart_allowed=false
- P8 material candidate handoff。ただしp8_start_allowed=false
- final no-body-leak / no-question-text / no-touch validation
- R52 re-intake handoff
- validation command matrix / documentation output
```

### 4.2 非対象

```text
- P8観測補助問いの詳細設計
- P8 question text / draft question text
- question trigger logic
- question answer persistence
- question plan guard
- API route追加
- DB schema / migration追加
- RN UI追加
- public response top-level key追加
- Emlis runtime本文生成変更
- User Label Connection runtime変更
- Gate閾値変更
- fixed commentText / case専用surface / case専用mode追加
- full backend suite green主張
- 実機modal読感完了主張
- release_allowed true化
```

---

## 5. 基本設計

### 5.1 R54 re-entryで扱う九層

```text
Layer 1: Operation Current Snapshot Refreeze
  今回受領zipをactual review basisとして固定する。

Layer 2: Local-only Preflight
  local root / explicit allow / purge plan / retention / export denylistを確認する。

Layer 3: 24-case Manifest
  R54 P5 Blind QA 24件を固定する。P4-R11 24 rowsとは混同しない。

Layer 4: Local Body-full Packet Handling
  reviewerが読むためだけにbody-full packetをlocal-onlyで生成・保持する。

Layer 5: Reviewer Boundary
  reviewerは人間。華恋の内部読解だけをactual human review完了へ変換しない。

Layer 6: Body-free Result Capture
  reviewer selectionsだけをbody-free rowへ変換する。

Layer 7: Question Need Observation
  P7/P8 Bridge材料としてbody-free観察rowを残す。問い文は作らない。

Layer 8: Disposal / Retention
  body-full packet / reviewer notes / temporary formをpurgeし、receiptをbody-freeで残す。

Layer 9: R52 Re-intake Handoff
  P5 decision candidate / P6 candidate / P8 material candidate / blocker / disposal状態をR52へ渡す。
```

### 5.2 status enum案

```text
NOT_STARTED
PREFLIGHT_BLOCKED
PREFLIGHT_READY
PACKET_GENERATION_REQUESTED_BODYFREE
PACKET_GENERATED_LOCAL_ONLY_UNVERIFIED
PACKET_SCAN_READY
REVIEW_IN_PROGRESS_LOCAL_ONLY
REVIEW_PAUSED
REVIEW_ABORTED
REVIEW_EXPIRED
REVIEW_COMPLETED_SELECTIONS_CAPTURED
RATING_ROWS_NORMALIZED
QUESTION_OBSERVATION_ROWS_NORMALIZED
DISPOSAL_PENDING
DISPOSAL_VERIFIED
BODYFREE_SUMMARY_READY
R52_REINTAKE_HANDOFF_READY
BLOCKED_BY_BODY_LEAK_OR_QUESTION_TEXT
BLOCKED_BY_NO_TOUCH_VIOLATION
INCONCLUSIVE
```

### 5.3 decision enum案

```text
P5_CONFIRMED_CANDIDATE
P5_REPAIR_RETURN
P4_R12_TARGETED_CURRENT_ONLY_SURFACE_REPAIR
R54_OPERATION_INCONCLUSIVE
R54_OPERATION_BLOCKED_PREFLIGHT
R54_OPERATION_BLOCKED_DISPOSAL
R54_OPERATION_BLOCKED_BODY_LEAK_OR_QUESTION_TEXT
R54_OPERATION_ABORTED_OR_EXPIRED
R52_REINTAKE_REQUIRED
```

注意:

```text
P5_CONFIRMED_CANDIDATE は final confirmation ではない。
P5_CONFIRMED_CANDIDATE は P6 start allowed ではない。
P5_CONFIRMED_CANDIDATE は P8 start allowed ではない。
P5_CONFIRMED_CANDIDATE は release allowed ではない。
```

### 5.4 body-freeに残してよいもの

```text
- schema_version
- material_id
- review_session_id
- operation_current_refs
- historical_helper_refs
- source_delta_refs
- status refs
- decision refs
- case_ref_id
- blind_case_id
- packet_ref_id
- family ref
- case_role ref
- reviewer_ref pseudonymous id
- reviewed_at coarse timestamp / run_id ref
- axis_scores numeric values
- verdict enum
- sanitized_reason_ids
- blocker_ids
- execution_blocker_ids
- question_need_primary_class
- ambiguity_kind_refs
- one_question_fit_ref
- repair_required_refs
- plan_candidate_flags
- counts / booleans
- disposal status refs
- validation command refs
```

### 5.5 body-freeに残してはいけないもの

```text
- raw input
- raw memo
- raw action
- comment_text body
- returned Emlis body
- bounded history surface body
- reviewer free text
- reviewer notes body
- local file path
- local directory path
- body hash
- body-full packet content
- raw answer
- question text
- draft question text
- private user dictionary text
- evidence text
- candidate body
- terminal output containing body
```

---

## 6. local-only preflight設計

### 6.1 preflight必須条件

body-full packet生成要求前に、次を満たす必要があります。

```text
- `COCOLON_EMLIS_LOCAL_REVIEW_ROOT` 相当のlocal review rootが明示されている。
- local review rootがrepo / docs / tests / services / release / public_meta / 前提資料配下ではない。
- explicit allow tokenがある。
- purge planがある。
- retention policyがある。
- export denylistがある。
- reviewer notesを成果物へ出さない方針がある。
- body-full packetを成果物・release material・public metaへ出さない方針がある。
```

既存R47方針として確認した値を、実装時の初期値候補にします。

```text
local_review_root_env_var:
  COCOLON_EMLIS_LOCAL_REVIEW_ROOT

body_full_packet_retention_hours:
  72

reviewer_notes_retention_after_rating_hours:
  24

delete_trigger_refs:
  rating_rows_finalized
  blocker_rows_finalized
  review_session_cancelled
  retention_deadline_reached

export_denylist_patterns:
  .local_review_packets/
  body_full_packets.local_only/
  reviewer_notes.local_only/
  *.local_review_packet.json
  *.reviewer_notes.json
  *.local_only.json
  Cocolon_EmlisAI_*_LocalReviewPacket_*_body_full*
```

### 6.2 explicit allow token案

実装段階では、body-full packet生成要求に以下のようなbody-free tokenを要求します。

```text
explicit_allow_token_ref:
  R54_ACTUAL_LOCAL_REVIEW_BODY_FULL_PACKET_GENERATION_ALLOWED_20260625

allowed_scope:
  p5_human_blind_qa_actual_local_review_only

allowed_output:
  local_only_body_full_packet

forbidden_output:
  artifact
  release_material
  public_meta
  repo_docs
  test_fixture
```

### 6.3 preflight fail時

preflightを満たさない場合は、operationを開始しません。

```text
review_status:
  PREFLIGHT_BLOCKED

p5_decision_candidate:
  R54_OPERATION_INCONCLUSIVE

next_required_step:
  local_only_preflight_repair

p6_limited_human_readfeel_start_allowed:
  false

p8_start_allowed:
  false

release_allowed:
  false
```

---

## 7. 24-case actual review設計

### 7.1 case distribution

R54設計の24-case distributionを維持します。

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

重要:

```text
P4-R11 24 rows:
  current-only surface specificity audit。

R54 24 rows:
  P5履歴線のactual human Blind QA。
```

この2つを混同しません。

### 7.2 reviewer blind policy

reviewerへ見せるもの:

```text
- current input body
- Emlis returned body
- P5 history line / bounded history surface body
- plan tier context needed for review
- case role / familyの必要最小限説明
- rating axis説明
- selection form
```

reviewerへ見せない、または成果物に残さないもの:

```text
- internal builder name
- gate internal material
- raw DB row id
- user id
- exact local path
- body hash
- previous helper code refs
- reviewer free text export欄
```

### 7.3 reviewer boundary

```text
華恋の内部読解:
  設計補助・懸念抽出には使える。
  actual human Blind QA完了には変換しない。

actual human review:
  人間reviewerがbody-full local packetを読み、
  body-free selection formへrating / verdict / blocker / question observationを記入する。

reviewer identity:
  reviewer_refはpseudonymous idのみ。
  氏名・メール・アカウント・個人情報は成果物へ残さない。
```

人間reviewerを置けない場合は、P5 human Blind QAは未完です。  
その場合、次の扱いにします。

```text
review_status:
  NOT_STARTED または INCONCLUSIVE

actual_review_evidence_complete:
  false

next_required_step:
  actual_human_reviewer_assignment_or_operation_retry
```

### 7.4 rating axes / target thresholds

既存P5 Human Blind QA axesを維持します。

```text
history_connection_naturalness:       target >= 0.90
creepy_absence:                       target >= 0.95
overclaim_absence:                    target >= 0.95
self_blame_non_amplification:         target >= 0.95
wants_more_input_or_accumulation:     target >= 0.85
non_shallow_repeat:                   target >= 0.90
```

score:

```text
0.00 <= axis_score <= 1.00
```

実レビューformでは、ゆらぎを減らすため、次の固定選択値を第一候補にします。

```text
0.00
0.25
0.50
0.75
1.00
```

ただし、既存helperがfloatを受けるため、実装段階では既存normalizerに合わせます。

### 7.5 verdict enum

```text
PASS
YELLOW
REPAIR_REQUIRED
RED
```

読み方:

```text
PASS:
  そのcaseの履歴線が自然で、怖さ・過剰断定・自己責め増幅がなく、記録が返ってきた体験として機能している。

YELLOW:
  即repairではないが、人間判断が残る。P5 confirmed candidateには直行しない。

REPAIR_REQUIRED:
  P5 surface / Emlis本体 / Gate boundaryのいずれかへ戻す必要がある。

RED:
  商品表示不可に近い読感事故。P5 repair returnまたはP4/P5 targeted repairへ戻す。
```

---

## 8. question need observation設計

### 8.1 目的

R54では、P8観測補助問いを作りません。  
ただし、P8を勘で設計しないため、各caseで問い必要性をbody-freeに観察します。

記録する観点:

```text
- 問いなしで十分観測できたか。
- 問いがあれば補完リスクを下げられたか。
- 1問で足りる曖昧さか。
- 問いを出すと入力直後の観測体験が重くならないか。
- 問いではなくEmlis本体・P5 surface・Gate boundaryで直すべきか。
- Plus向け1問候補か、Premium深掘り候補か。
```

### 8.2 primary class refs案

既存R49 refsを維持します。

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

### 8.3 ambiguity kind refs案

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

### 8.4 one question fit refs案

```text
not_needed
fits_one_question
needs_more_than_one_question_not_p7
would_delay_immediate_observation
unsafe_or_boundary_not_question
repair_required_not_question
insufficient_material
```

### 8.5 repair required refs案

```text
emlis_readfeel_repair_required
p5_surface_repair_required
gate_boundary_repair_required
no_repair_required
```

### 8.6 plan candidate flags案

```text
plus_single_question_candidate_later
premium_deep_dive_candidate_later
p8_design_material_candidate
p8_implementation_spec_finalized_here = false 固定
```

### 8.7 禁止

```text
- question textを作らない。
- draft question textを作らない。
- question trigger logicを作らない。
- question answer persistenceを作らない。
- API / DB / RN UI / public response keyを変更しない。
- P5 surface repairすべきものをP8材料にしない。
- Emlis本体の読感不足を問い返しで補う扱いにしない。
```

---

## 9. reviewer selection form設計

### 9.1 reviewerが記入するもの

reviewerはfree textではなく、選択式で記入します。

```text
case_ref_id:
  controller側で保持。

blind_case_id:
  reviewer-facing id。

reviewer_ref:
  pseudonymous id。

axis_scores:
  history_connection_naturalness
  creepy_absence
  overclaim_absence
  self_blame_non_amplification
  wants_more_input_or_accumulation
  non_shallow_repeat

verdict:
  PASS / YELLOW / REPAIR_REQUIRED / RED

blocker_ids:
  0件以上。

sanitized_reason_ids:
  fixed idsのみ。

question_need_primary_class:
  fixed enum。

ambiguity_kind_refs:
  fixed enumから0件以上。

one_question_fit_ref:
  fixed enum。

repair_required_refs:
  fixed enumから1件以上。

plan_candidate_flags:
  fixed bool map。
```

### 9.2 readfeel blocker ids案

既存R48のP5 readfeel blocker idsを維持します。

```text
p5_history_connection_too_generic
p5_history_scope_overclaim
p5_history_creepy_or_surveillance_feeling
p5_history_line_self_blame_amplification
p5_history_line_shallow_repeat
p5_history_line_wants_more_input_low
p5_free_tier_history_boundary_violation
p5_low_information_history_overread
p5_current_input_overridden_by_history
p5_boundary_history_line_leak_suspected
p5_review_not_enough_context
```

### 9.3 execution blocker例

```text
review_packet_generation_blocked_missing_local_root
review_packet_generation_blocked_missing_explicit_allow
review_case_material_missing
review_case_matrix_minimum_not_met
reviewer_not_assigned
review_timeout_unclassified
rating_row_incomplete
question_observation_row_incomplete
body_purge_failed
body_purge_not_verified
body_free_validation_failed
question_text_leak_detected
no_touch_violation_detected
```

execution blockerは、readfeel verdictへ混ぜません。  
たとえばlocal root不足は「読感RED」ではなく、実行blockerです。

---

## 10. 実装方針

### 10.1 実装段階の第一候補

今回の設計では、既存R54/R55 helperを無理に作り替えません。  
実装段階の第一候補は、薄いoperation wrapperを追加することです。

候補:

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_actual_local_review_operation_reentry_20260625.py
```

役割:

```text
- operation_current_refsを今回受領zipへ固定する。
- 既存R54 helperをimportし、必要に応じてoverridesでcurrent refsを渡す。
- actual operation状態をbody-freeにまとめる。
- R54 helper内部historical refsを上書きせず、source_deltaとして保持する。
- no-body-leak / no-question-text / no-touchを最終確認する。
```

このwrapperを作るかどうかは、実装段階で現行helperの既存関数だけで十分にoperation handoffを作れるか確認して決めます。

### 10.2 既存helperのみで足りる場合

既存R54 helperに以下が揃っているため、追加moduleなしでoperation objectを生成できる可能性があります。

```text
build_p7_r54_current_received_snapshot_refreeze
build_p7_r54_local_only_actual_review_preflight_bodyfree
build_p7_r54_actual_review_session_envelope_bodyfree
build_p7_r54_24_case_manifest_freeze_bodyfree
build_p7_r54_local_only_body_full_packet_generation_request_bodyfree
build_p7_r54_packet_completeness_export_denylist_scan_bodyfree
build_p7_r54_reviewer_instruction_rating_form_freeze_bodyfree
build_p7_r54_actual_human_review_operation_state_capture_bodyfree
build_p7_r54_sanitized_actual_review_result_capture_bodyfree
build_p7_r54_rating_row_normalization_bodyfree
build_p7_r54_readfeel_blocker_execution_blocker_ingestion_bodyfree
build_p7_r54_question_need_observation_row_normalization_bodyfree
build_p7_r54_rating_question_observation_consistency_guard_bodyfree
build_p7_r54_purge_disposal_receipt_bodyfree
build_p7_r54_body_free_post_review_summary_bodyfree
build_p7_r54_p5_decision_candidate_separation_bodyfree
build_p7_r54_p6_limited_human_readfeel_candidate_handoff_bodyfree
build_p7_r54_p8_question_design_material_candidate_handoff_bodyfree
build_p7_r54_final_no_body_leak_no_question_text_no_touch_validation_bodyfree
build_p7_r54_r52_reintake_handoff_bodyfree
```

ただし、current refsが古い定数に固定される部分があれば、operation wrapperで上書き可能か確認します。

### 10.3 触らないproduction file

明示的な実装判断なしに、次は触りません。

```text
- emotion_submit_service.py
- api_emotion_submit.py
- emlis_ai_reply_service.py
- emlis_ai_user_label_connection_material.py
- emlis_ai_user_label_connection_candidate.py
- emlis_ai_user_label_connection_gate.py
- emlis_ai_user_label_connection_surface.py
- emlis_ai_public_feedback_meta.py
- RN production UI
- RN表示条件
- DB migration / model / write path
- subscription / account / access policy
```

---

## 11. 実装順詳細

### R54-OP-00: scope / no-touch boundary freeze

目的:

```text
この実装がactual review operation re-entryであり、P8設計・API/DB/RN/runtime変更ではないことを固定する。
```

実装候補:

```text
- wrapper moduleを作る場合は、module docstringでno-touchを明記する。
- 既存helperのみで行く場合は、documentation outputにno-touch flagsを持たせる。
```

完了条件:

```text
api_changed = false
db_changed = false
rn_changed = false
runtime_changed = false
question_implementation_started_here = false
release_allowed = false
```

### R54-OP-01: operation current snapshot refs refreeze

目的:

```text
今回受領zipをactual review basisとして固定する。
```

出力:

```text
p7_r54_operation_current_snapshot_refreeze.bodyfree
```

必須:

```text
- operation_current_refsが今回zipを指す。
- historical_helper_refsと分離される。
- current_ref_only が actual_review_basis として明示される。
```

### R54-OP-02: historical helper source delta reconcile

目的:

```text
既存R54/R55 helperの過去refsを、今回operation refsと混ぜない。
```

出力:

```text
source_delta_rows:
  r54_helper_refs_vs_operation_current_refs
  r55_helper_refs_vs_operation_current_refs
```

fail条件:

```text
- 過去helper refsをcurrent operation basisとして使っている。
- current refs差分がbody-free handoffに明示されない。
```

### R54-OP-03: R55 hold intake

目的:

```text
R55 decisionが R54 actual local-only human review required であることをoperationの前提として取り込む。
```

保持するもの:

```text
r55_decision_ref:
  R55_R52_RETURN_TO_R54_ACTUAL_REVIEW_REQUIRED

required_case_count:
  24

rating_row_count:
  0

question_observation_row_count:
  0

disposal_verified:
  false

p6_hold / p8_hold / release_hold:
  true
```

### R54-OP-04: local-only preflight

目的:

```text
body-full packet生成前に、local-only安全条件を確認する。
```

入力:

```text
operation_current_refs
explicit_allow_token_ref
local_review_root_presence_ref
purge_plan_ref
retention_policy_ref
export_denylist_policy_ref
```

出力:

```text
preflight_status:
  PREFLIGHT_READY または PREFLIGHT_BLOCKED
```

fail時:

```text
actual_human_review_run = false
p5_decision_candidate = R54_OPERATION_INCONCLUSIVE
next_required_step = local_only_preflight_repair
```

### R54-OP-05: 24-case manifest freeze

目的:

```text
R54 P5 Human Blind QAの24-case manifestを固定する。
```

必須:

```text
- total_case_count = 24
- distributionがR48/R54設計と一致する。
- case_ref_idとblind_case_idが一意。
- controller manifestとreviewer-facing indexを分ける。
```

### R54-OP-06: local-only body-full packet generation request

目的:

```text
reviewerが読むためのbody-full packet生成を、body-free requestとして作る。
```

注意:

```text
この段階の成果物はpacket本体ではない。
成果物に残すのは、packet generation requestのbody-free refsだけ。
```

### R54-OP-07: packet generation local operation

目的:

```text
body-full packetをlocal-only root配下に生成する。
```

扱い:

```text
- これはlocal operation。
- 本書では実行しない。
- 実装成果物zip / md成果物 / public meta / release materialへpacket本体を入れない。
```

fail時:

```text
execution_blocker_id = review_packet_generation_blocked_*
status = INCONCLUSIVE
```

### R54-OP-08: packet completeness / export denylist scan

目的:

```text
packetがreviewに必要な最低項目を持ち、export対象へ漏れていないことをbody-freeで確認する。
```

出力:

```text
packet_scan_summary:
  total_case_count
  packet_present_count
  required_fields_present_count
  export_denylist_violation_count
  body_full_packet_export_candidate_count
```

fail時:

```text
BLOCKED_BY_BODY_LEAK_OR_QUESTION_TEXT
```

### R54-OP-09: reviewer instruction / rating form freeze

目的:

```text
reviewerが見る軸と記入形式を固定する。
```

必須:

```text
- reviewer free text exportなし。
- axis scores / verdict / blocker ids / question observationだけ。
- question text欄なし。
- raw bodyをcopyできる欄なし。
```

### R54-OP-10: actual human review operation state capture

目的:

```text
reviewが開始・中断・完了した状態をbody-freeで残す。
```

状態:

```text
NOT_STARTED
REVIEW_IN_PROGRESS_LOCAL_ONLY
REVIEW_PAUSED
REVIEW_ABORTED
REVIEW_EXPIRED
REVIEW_COMPLETED_SELECTIONS_CAPTURED
```

注意:

```text
華恋の内部読解だけではREVIEW_COMPLETEDにしない。
```

### R54-OP-11: sanitized review result capture

目的:

```text
reviewer selectionsをbody-free rowとして取り込む。
```

必須:

```text
- 24 rows。
- raw bodyなし。
- reviewer free textなし。
- question textなし。
- local pathなし。
- body hashなし。
```

### R54-OP-12: rating row normalization

目的:

```text
sanitized review result rowsをrating rowsへ正規化する。
```

必須:

```text
- score範囲 0.00〜1.00。
- axesが6件揃っている。
- verdictとblocker整合がある。
- PASSなのにblockerあり、REDなのにreasonなし等を弾く。
```

### R54-OP-13: readfeel blocker / execution blocker ingestion

目的:

```text
読感blockerと実行blockerを分ける。
```

readfeel blocker:

```text
p5_history_connection_too_generic
p5_history_scope_overclaim
p5_history_creepy_or_surveillance_feeling
...
```

execution blocker:

```text
local root不足、reviewer未割当、packet生成失敗、purge失敗など。
```

### R54-OP-14: question need observation normalization

目的:

```text
各caseの問い必要性観察rowをbody-freeに正規化する。
```

必須:

```text
- question_observation_row_count = 24
- primary class refsが固定enum内。
- question textなし。
- draft question textなし。
- p8_implementation_spec_finalized_here = false
```

### R54-OP-15: rating / question consistency guard

目的:

```text
rating結果とquestion observation結果が矛盾していないかを見る。
```

例:

```text
- P5 surface repair requiredなのにP8 design material candidateへ上げていないか。
- RED / REPAIR_REQUIREDなのに no_question_needed としていないか。
- insufficient materialなのに PASS にしていないか。
```

### R54-OP-16: pause / abort / expiration protocol

目的:

```text
review中断・期限切れ・abort時に、body-fullが残り続けないようにする。
```

必須:

```text
- review_session_cancelled はpurge trigger。
- retention_deadline_reached はpurge trigger。
- abort時はP5 inconclusive。
```

### R54-OP-17: purge / disposal receipt

目的:

```text
body-full packet / reviewer notes / temporary formを削除し、body-free receiptを残す。
```

必須:

```text
body_removed = true
reviewer_notes_removed = true
temporary_form_removed = true
local_packet_exported = false
content_hash_of_body_stored = false
disposal_verified = true
```

fail時:

```text
R54_OPERATION_BLOCKED_DISPOSAL
p6_start_allowed = false
p8_start_allowed = false
release_allowed = false
```

### R54-OP-18: body-free post-review summary

目的:

```text
rating / blocker / question / disposalをbody-free count summaryにする。
```

summaryに含めるもの:

```text
- required_case_count
- reviewed_case_count
- rating_row_count
- question_observation_row_count
- verdict_counts
- axis_score_averages
- open_readfeel_blocker_count
- open_execution_blocker_count
- primary_class_counts
- ambiguity_kind_counts
- one_question_fit_counts
- repair_required_counts
- disposal_verified
- no_body_leak_validation_passed
- no_question_text_validation_passed
- no_touch_validation_passed
```

### R54-OP-19: P5 decision candidate separation

目的:

```text
P5 confirmed candidate / P5 repair return / inconclusiveを分ける。
```

詳細条件は本書「13. decision criteria」で固定します。

### R54-OP-20: P6 candidate handoff

目的:

```text
P5が十分強い場合に、P6 limited human readfeel候補だけを作る。
```

固定:

```text
p6_limited_human_readfeel_candidate = 条件次第でtrue
p6_limited_human_readfeel_start_allowed = false
```

### R54-OP-21: P8 material candidate handoff

目的:

```text
question need observation rowsをP8設計材料候補として集約する。
```

固定:

```text
p8_question_design_material_candidate = 条件次第でtrue
p8_start_allowed = false
question_implementation_started_here = false
p8_implementation_spec_finalized_here = false
```

### R54-OP-22: final no-body-leak / no-question-text / no-touch validation

目的:

```text
成果物へbody-full / question text / contract mutationが混入していないかを最終確認する。
```

fail時:

```text
R54_OPERATION_BLOCKED_BODY_LEAK_OR_QUESTION_TEXT
または
BLOCKED_BY_NO_TOUCH_VIOLATION
```

### R54-OP-23: R52 re-intake handoff

目的:

```text
R52へ、body-free actual review evidenceとして戻す。
```

handoff status:

```text
R54_R52_REINTAKE_HANDOFF_READY
R54_R52_REINTAKE_BLOCKED_BY_ACTUAL_REVIEW_EVIDENCE_MISSING
R54_R52_REINTAKE_BLOCKED_BY_DISPOSAL
R54_R52_REINTAKE_BLOCKED_BY_BODY_LEAK_OR_QUESTION_TEXT
R54_R52_REINTAKE_BLOCKED_BY_NO_TOUCH_VIOLATION
R54_R52_REINTAKE_BLOCKED_BY_INCONCLUSIVE
```

### R54-OP-24: validation command matrix / documentation output

目的:

```text
実装時に実行したコマンド、未実行、green主張範囲をbody-freeに残す。
```

注意:

```text
collect-onlyをfull suite greenへ変換しない。
RN contract greenを実機modal確認済みへ変換しない。
R54 helper greenをactual human review完了へ変換しない。
```

---

## 12. JSON / schema案

本章のschemaは、設計書内の案です。  
実ファイル化は実装段階で判断します。

### 12.1 `p7_r54_operation_current_snapshot_refreeze.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.operation_current_snapshot_refreeze.bodyfree.v1",
  "type": "object",
  "required": [
    "schema_version",
    "phase",
    "step",
    "scope",
    "material_id",
    "review_session_id",
    "operation_current_refs",
    "historical_helper_refs_separated",
    "actual_review_basis_ref",
    "body_free",
    "api_changed",
    "db_changed",
    "rn_changed",
    "runtime_changed",
    "release_allowed"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.operation_current_snapshot_refreeze.bodyfree.v1" },
    "phase": { "const": "P7" },
    "step": { "const": "R54_actual_local_only_human_review_operation_reentry_20260625" },
    "scope": { "const": "p5_human_blind_qa_actual_local_review_operation_reentry" },
    "material_id": { "type": "string" },
    "review_session_id": { "type": "string" },
    "operation_current_refs": {
      "type": "object",
      "required": [
        "premise_zip_ref",
        "implemented_materials_zip_ref",
        "rn_zip_ref",
        "backend_zip_ref",
        "roadmap_ref",
        "pre_design_memo_ref",
        "detailed_design_ref"
      ],
      "additionalProperties": { "type": "string" }
    },
    "historical_helper_refs_separated": { "const": true },
    "actual_review_basis_ref": { "const": "operation_current_refs_only" },
    "source_delta_rows_required": { "type": "boolean" },
    "body_free": { "const": true },
    "api_changed": { "const": false },
    "db_changed": { "const": false },
    "rn_changed": { "const": false },
    "runtime_changed": { "const": false },
    "release_allowed": { "const": false }
  },
  "additionalProperties": true
}
```

### 12.2 `p7_r54_operation_preflight.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.operation_preflight.bodyfree.v1",
  "type": "object",
  "required": [
    "schema_version",
    "review_session_id",
    "preflight_status",
    "local_review_root_declared",
    "explicit_allow_present",
    "purge_plan_present",
    "retention_policy_present",
    "export_denylist_present",
    "body_full_packet_generation_allowed_by_preflight",
    "blocked_reason_refs",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.operation_preflight.bodyfree.v1" },
    "review_session_id": { "type": "string" },
    "preflight_status": {
      "enum": ["PREFLIGHT_READY", "PREFLIGHT_BLOCKED"]
    },
    "local_review_root_declared": { "type": "boolean" },
    "explicit_allow_present": { "type": "boolean" },
    "purge_plan_present": { "type": "boolean" },
    "retention_policy_present": { "type": "boolean" },
    "export_denylist_present": { "type": "boolean" },
    "body_full_packet_generation_allowed_by_preflight": { "type": "boolean" },
    "blocked_reason_refs": {
      "type": "array",
      "items": { "type": "string" }
    },
    "body_free": { "const": true },
    "local_path_included": { "const": false },
    "raw_body_included": { "const": false },
    "question_text_included": { "const": false }
  },
  "additionalProperties": true
}
```

### 12.3 `p7_r54_operation_case_manifest.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.operation_case_manifest.bodyfree.v1",
  "type": "object",
  "required": [
    "schema_version",
    "review_session_id",
    "required_case_count",
    "case_distribution",
    "controller_manifest_rows",
    "reviewer_facing_case_index_rows",
    "p4_r11_rows_mixed_in",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.operation_case_manifest.bodyfree.v1" },
    "review_session_id": { "type": "string" },
    "required_case_count": { "const": 24 },
    "case_distribution": {
      "type": "object",
      "properties": {
        "history_line_eligible_input": { "const": 4 },
        "standard_state_answer_owned_history": { "const": 4 },
        "self_understanding_owned_history": { "const": 3 },
        "uncertainty_support_owned_history": { "const": 3 },
        "change_future_intention_owned_history": { "const": 3 },
        "relationship_gratitude_recovery_owned_history": { "const": 3 },
        "low_information_history_not_eligible": { "const": 2 },
        "free_tier_history_present_not_allowed": { "const": 2 }
      }
    },
    "controller_manifest_rows": {
      "type": "array",
      "minItems": 24,
      "maxItems": 24,
      "items": {
        "type": "object",
        "required": ["case_ref_id", "blind_case_id", "family", "case_role"]
      }
    },
    "reviewer_facing_case_index_rows": {
      "type": "array",
      "minItems": 24,
      "maxItems": 24
    },
    "p4_r11_rows_mixed_in": { "const": false },
    "body_free": { "const": true }
  },
  "additionalProperties": true
}
```

### 12.4 `p7_r54_operation_sanitized_review_result_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.operation_sanitized_review_result_row.bodyfree.v1",
  "type": "object",
  "required": [
    "schema_version",
    "review_session_id",
    "packet_ref_id",
    "blind_case_id",
    "case_ref_id",
    "family",
    "case_role",
    "reviewer_ref",
    "reviewed_at_ref",
    "axis_scores",
    "verdict",
    "sanitized_reason_ids",
    "blocker_ids",
    "reviewer_free_text_included",
    "raw_body_included",
    "question_text_included",
    "body_removed",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.operation_sanitized_review_result_row.bodyfree.v1" },
    "review_session_id": { "type": "string" },
    "packet_ref_id": { "type": "string" },
    "blind_case_id": { "type": "string" },
    "case_ref_id": { "type": "string" },
    "family": { "type": "string" },
    "case_role": { "type": "string" },
    "reviewer_ref": { "type": "string" },
    "reviewed_at_ref": { "type": "string" },
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
      "additionalProperties": {
        "type": "number",
        "minimum": 0,
        "maximum": 1
      }
    },
    "verdict": { "enum": ["PASS", "YELLOW", "REPAIR_REQUIRED", "RED"] },
    "sanitized_reason_ids": { "type": "array", "items": { "type": "string" } },
    "blocker_ids": { "type": "array", "items": { "type": "string" } },
    "reviewer_free_text_included": { "const": false },
    "raw_body_included": { "const": false },
    "question_text_included": { "const": false },
    "local_path_included": { "const": false },
    "body_hash_included": { "const": false },
    "body_removed": { "type": "boolean" },
    "body_free": { "const": true }
  },
  "additionalProperties": false
}
```

### 12.5 `p7_r54_operation_question_need_observation_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.operation_question_need_observation_row.bodyfree.v1",
  "type": "object",
  "required": [
    "schema_version",
    "review_session_id",
    "packet_ref_id",
    "blind_case_id",
    "case_ref_id",
    "question_need_primary_class",
    "ambiguity_kind_refs",
    "one_question_fit_ref",
    "repair_required_refs",
    "plan_candidate_flags",
    "question_text_included",
    "draft_question_text_included",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.operation_question_need_observation_row.bodyfree.v1" },
    "review_session_id": { "type": "string" },
    "packet_ref_id": { "type": "string" },
    "blind_case_id": { "type": "string" },
    "case_ref_id": { "type": "string" },
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
    "ambiguity_kind_refs": { "type": "array", "items": { "type": "string" } },
    "one_question_fit_ref": { "type": "string" },
    "repair_required_refs": { "type": "array", "items": { "type": "string" } },
    "plan_candidate_flags": {
      "type": "object",
      "required": [
        "plus_single_question_candidate_later",
        "premium_deep_dive_candidate_later",
        "p8_design_material_candidate",
        "p8_implementation_spec_finalized_here"
      ],
      "properties": {
        "plus_single_question_candidate_later": { "type": "boolean" },
        "premium_deep_dive_candidate_later": { "type": "boolean" },
        "p8_design_material_candidate": { "type": "boolean" },
        "p8_implementation_spec_finalized_here": { "const": false }
      }
    },
    "question_text_included": { "const": false },
    "draft_question_text_included": { "const": false },
    "reviewer_free_text_included": { "const": false },
    "raw_body_included": { "const": false },
    "body_free": { "const": true }
  },
  "additionalProperties": false
}
```

### 12.6 `p7_r54_operation_disposal_receipt.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.operation_disposal_receipt.bodyfree.v1",
  "type": "object",
  "required": [
    "schema_version",
    "review_session_id",
    "disposal_status",
    "body_removed",
    "reviewer_notes_removed",
    "temporary_form_removed",
    "local_packet_exported",
    "content_hash_of_body_stored",
    "disposal_verified",
    "blocked_reason_refs",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.operation_disposal_receipt.bodyfree.v1" },
    "review_session_id": { "type": "string" },
    "disposal_status": {
      "enum": ["NOT_STARTED", "PENDING", "VERIFIED", "FAILED", "ABORTED"]
    },
    "body_removed": { "type": "boolean" },
    "reviewer_notes_removed": { "type": "boolean" },
    "temporary_form_removed": { "type": "boolean" },
    "local_packet_exported": { "const": false },
    "content_hash_of_body_stored": { "const": false },
    "disposal_verified": { "type": "boolean" },
    "blocked_reason_refs": { "type": "array", "items": { "type": "string" } },
    "body_free": { "const": true },
    "raw_body_included": { "const": false },
    "local_path_included": { "const": false }
  },
  "additionalProperties": true
}
```

### 12.7 `p7_r54_operation_post_review_summary.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.operation_post_review_summary.bodyfree.v1",
  "type": "object",
  "required": [
    "schema_version",
    "review_session_id",
    "required_case_count",
    "reviewed_case_count",
    "rating_row_count",
    "question_observation_row_count",
    "verdict_counts",
    "axis_score_averages",
    "open_readfeel_blocker_count",
    "open_execution_blocker_count",
    "disposal_verified",
    "p5_decision_candidate",
    "p6_limited_human_readfeel_start_allowed",
    "p8_start_allowed",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.operation_post_review_summary.bodyfree.v1" },
    "review_session_id": { "type": "string" },
    "required_case_count": { "const": 24 },
    "reviewed_case_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "rating_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "question_observation_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "verdict_counts": { "type": "object" },
    "axis_score_averages": { "type": "object" },
    "open_readfeel_blocker_count": { "type": "integer", "minimum": 0 },
    "open_execution_blocker_count": { "type": "integer", "minimum": 0 },
    "disposal_verified": { "type": "boolean" },
    "p5_decision_candidate": {
      "enum": [
        "P5_CONFIRMED_CANDIDATE",
        "P5_REPAIR_RETURN",
        "P4_R12_TARGETED_CURRENT_ONLY_SURFACE_REPAIR",
        "R54_OPERATION_INCONCLUSIVE",
        "R54_OPERATION_BLOCKED_PREFLIGHT",
        "R54_OPERATION_BLOCKED_DISPOSAL",
        "R54_OPERATION_BLOCKED_BODY_LEAK_OR_QUESTION_TEXT",
        "R54_OPERATION_ABORTED_OR_EXPIRED"
      ]
    },
    "p6_limited_human_readfeel_start_allowed": { "const": false },
    "p8_start_allowed": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  },
  "additionalProperties": true
}
```

### 12.8 `p7_r54_operation_r52_reintake_handoff.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.operation_r52_reintake_handoff.bodyfree.v1",
  "type": "object",
  "required": [
    "schema_version",
    "review_session_id",
    "handoff_status",
    "actual_review_evidence_complete",
    "rating_row_count",
    "question_observation_row_count",
    "disposal_verified",
    "p5_decision_candidate",
    "p6_candidate_only",
    "p8_material_candidate_only",
    "p6_limited_human_readfeel_start_allowed",
    "p8_start_allowed",
    "release_allowed",
    "next_required_step",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.operation_r52_reintake_handoff.bodyfree.v1" },
    "review_session_id": { "type": "string" },
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
    "actual_review_evidence_complete": { "type": "boolean" },
    "rating_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "question_observation_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "disposal_verified": { "type": "boolean" },
    "p5_decision_candidate": { "type": "string" },
    "p6_candidate_only": { "type": "boolean" },
    "p8_material_candidate_only": { "type": "boolean" },
    "p6_limited_human_readfeel_start_allowed": { "const": false },
    "p8_start_allowed": { "const": false },
    "release_allowed": { "const": false },
    "next_required_step": { "type": "string" },
    "body_free": { "const": true },
    "raw_body_included": { "const": false },
    "question_text_included": { "const": false },
    "api_changed": { "const": false },
    "db_changed": { "const": false },
    "rn_changed": { "const": false },
    "runtime_changed": { "const": false }
  },
  "additionalProperties": true
}
```

### 12.9 local-only private packet schema案

これは成果物・public meta・release materialへ出してはいけないprivate案です。  
実ファイル化する場合もlocal root内限定にします。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.local_only_private_review_packet.v1",
  "type": "object",
  "x-cocolon-storage": "local-only-private-do-not-export",
  "required": [
    "packet_kind",
    "review_session_id",
    "blind_case_id",
    "case_ref_id",
    "reviewer_visible_body",
    "rating_form_refs",
    "export_forbidden"
  ],
  "properties": {
    "packet_kind": { "const": "p5_human_blind_qa_local_review_packet" },
    "review_session_id": { "type": "string" },
    "blind_case_id": { "type": "string" },
    "case_ref_id": { "type": "string" },
    "reviewer_visible_body": {
      "type": "object",
      "description": "raw input / returned Emlis / bounded history surfaceを含むためlocal-only"
    },
    "rating_form_refs": { "type": "object" },
    "export_forbidden": { "const": true }
  },
  "additionalProperties": true
}
```

注意:

```text
このprivate schema案は、body-full packetの構造を説明するためだけのもの。
本書ではpacket実体を作らない。
実装段階でも成果物へ含めない。
```

---

## 13. decision criteria

### 13.1 P5 confirmed candidate条件

次をすべて満たす場合だけ、P5 confirmed candidate候補にします。

```text
required_case_count = 24
all_24_cases_reviewed = true
rating_row_count = 24
question_observation_row_count = 24
open_execution_blocker_count = 0
open_readfeel_blocker_count = 0
disposal_verified = true
body_removed = true
reviewer_notes_removed = true
temporary_form_removed = true
local_packet_exported = false
content_hash_of_body_stored = false
RED = 0
REPAIR_REQUIRED = 0
YELLOW = 0
critical_repair_blocker_count = 0
not_question_*_repair_required_count = 0
history_connection_naturalness平均 >= 0.90
creepy_absence平均 >= 0.95
overclaim_absence平均 >= 0.95
self_blame_non_amplification平均 >= 0.95
wants_more_input_or_accumulation平均 >= 0.85
non_shallow_repeat平均 >= 0.90
no_body_leak_validation_passed = true
no_question_text_validation_passed = true
no_touch_validation_passed = true
```

ただし:

```text
p5_human_blind_qa_confirmed_final = false
p6_limited_human_readfeel_start_allowed = false
p8_start_allowed = false
release_allowed = false
```

### 13.2 P5 repair return条件

次のいずれかがあれば、P5 repair return候補にします。

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

戻り先分類:

```text
P5 surface repair:
  history line文が汎用、薄い、怖い、過剰。

Emlis本体 repair:
  現在入力を読めていない、浅い復唱、テンプレ共感、観測不足。

Gate boundary repair:
  low_information / free_tier / safety adjacent / overclaim guardが緩い。
```

### 13.3 P4-R12 targeted repair条件

actual review中に、P5履歴線以前のcurrent-only blockerが見えた場合はP4へ戻します。

例:

```text
- 現在入力だけで読めるべき出来事・願い・詰まりを拾えていない。
- current-only surfaceがgenericすぎる。
- current-only surfaceが将来方向・変化意図・関係回復を潰している。
- P5履歴線の問題ではなく、P4 current surfaceが土台として弱い。
```

この場合:

```text
p5_decision_candidate = P4_R12_TARGETED_CURRENT_ONLY_SURFACE_REPAIR
p8_start_allowed = false
```

### 13.4 inconclusive条件

```text
- preflight blockerがある。
- body-full packet生成が未実施。
- actual review rowsが24件揃っていない。
- rating rowsが不完全。
- question observation rowsが不完全。
- rating/question consistency issueが残る。
- disposal receiptが未作成。
- disposal verificationが未完。
- YELLOWが残り、人間判断待ち。
- reviewer_refが不明。
- 華恋内部読解だけでhuman review扱いにしようとしている。
- timeout / collect-onlyをgreenに変換している。
```

---

## 14. validation / test matrix案

本書作成時点ではコード変更がないため、validation commandは実行していません。  
実装段階では、実装差分に応じて以下を実行候補にします。

### 14.1 Python syntax / import

```bash
cd mashos-api/ai
python3 -m compileall -q services/ai_inference tests
```

### 14.2 R54 target split

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r0_r1_20260622.py \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r2_r3_20260622.py \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r4_r5_20260622.py \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r6_r7_20260622.py \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r8_r9_20260622.py \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r10_r11_20260622.py \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r12_r13_20260623.py \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r14_r15_20260623.py \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r16_r17_20260623.py \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r18_r19_20260623.py \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r20_r21_20260623.py \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r22_r23_20260623.py \
  --tb=short
```

### 14.3 R55 hold boundary regression

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r0_r1_20260623.py \
  tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r2_r3_20260623.py \
  tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r4_r5_20260623.py \
  tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r6_r7_20260623.py \
  tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r8_r9_20260623.py \
  tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r10_20260624.py \
  --tb=short
```

### 14.4 P4-R11 regression

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_product_readfeel_p4_r11_scope_matrix_20260624.py \
  tests/test_emlis_ai_product_readfeel_p4_r11_body_free_schema_20260624.py \
  tests/test_emlis_ai_product_readfeel_p4_r11_case_ref_selection_coverage_20260624.py \
  tests/test_emlis_ai_product_readfeel_p4_r11_material_route_audit_20260624.py \
  tests/test_emlis_ai_product_readfeel_p4_r11_surface_path_audit_20260624.py \
  tests/test_emlis_ai_product_readfeel_p4_r11_surface_specificity_role_audit_20260624.py \
  tests/test_emlis_ai_product_readfeel_p4_r11_verdict_repair_candidate_classification_20260624.py \
  tests/test_emlis_ai_product_readfeel_p4_r11_summary_decision_handoff_20260624.py \
  tests/test_emlis_ai_product_readfeel_p4_r11_decision_handoff_20260624.py \
  tests/test_emlis_ai_product_readfeel_p4_r11_targeted_tests_20260624.py \
  --tb=short
```

### 14.5 backend collect-only

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest --collect-only -q
```

### 14.6 RN no-touch confirmation

```bash
cd Cocolon
npm run test:rn-screens --silent
```

### 14.7 実装時に新規testを追加する場合の候補

wrapper moduleを追加する場合のみ、以下を候補にします。

```text
mashos-api/ai/tests/test_emlis_ai_p7_r54_actual_local_review_operation_reentry_20260625.py
```

テスト観点:

```text
- operation_current_refsが今回zip refsを保持する。
- historical helper refsをcurrent basisにしない。
- preflight blockedではpacket generation requestを許可しない。
- 24-case manifestがP4-R11 rowsと混ざらない。
- sanitized review result rowがraw body / question text / local pathを拒否する。
- question need observation rowがquestion text / draft question textを拒否する。
- P5 repair required rowsをP8 material candidateに昇格しない。
- disposal未完ではR52 handoff readyにならない。
- p6_start_allowed / p8_start_allowed / release_allowedが常にfalse。
- API / DB / RN / runtime変更flagが常にfalse。
```

---

## 15. no-touch boundary

今回の設計・実装候補で触ってはいけないもの:

```text
API:
  /emotion/submit route
  request key
  response top-level key
  public feedback contract

DB:
  migration
  physical table/column rename
  write path
  retention policy outside local review packet

RN:
  InputScreen
  useInputFeedbackModal
  inputFeedbackModel
  InputFeedbackReplyModal
  RN表示タイトル `Emlisの観測`
  RN表示条件

Runtime:
  Emlis visible surface generation
  User Label Connection candidate/gate/surface runtime
  Gate threshold
  plan guard

P8:
  question text
  question trigger logic
  question UI
  question answer persistence
```

---

## 16. acceptance criteria

### 16.1 本設計書としての完了条件

```text
- R54 actual operation re-entryの目的がP8設計ではないと明記されている。
- current operation refsが今回受領zipへ固定されている。
- historical helper refsとoperation refsの分離が設計されている。
- local-only preflightがbody-full前の必須条件として設計されている。
- 24-case manifest distributionが固定されている。
- reviewer boundaryが固定されている。
- body-freeに残すもの / 残さないものが分けられている。
- question need observationがP8材料候補であり、P8実装ではないと明記されている。
- disposal / purge / receiptが設計されている。
- decision criteriaがP5 / P4 / P6 / P8 / inconclusiveに分離されている。
- json / schema案が設計書内にあり、実ファイル化していない。
- no-touch boundaryが明記されている。
```

### 16.2 実装後の完了条件候補

```text
- 必要なbody-free wrapperまたは既存helper利用が実装されている。
- code変更がある場合、該当testが追加されている。
- R54/R55/P4-R11 regressionが通る。
- compileallが通る。
- collect-onlyで破綻しない。
- RN no-touchならRN contractが維持される。
- json / schema実ファイル化した場合、body-free guardがある。
- actual review未実施ならactual_review_evidence_complete=falseを保持する。
```

### 16.3 actual review operation後の完了条件候補

```text
- 24 cases reviewed。
- 24 rating rows。
- 24 question need observation rows。
- readfeel blocker / execution blocker rowsが分離されている。
- disposal verified。
- body-free post-review summaryがある。
- no body leak validation passed。
- no question text validation passed。
- no touch validation passed。
- R52 re-intake handoffが作られている。
- p6_start_allowed / p8_start_allowed / release_allowed はfalseのまま。
```

---

## 17. fail-closed / blocker判断

### 17.1 preflight fail

```text
status = PREFLIGHT_BLOCKED
p5_decision_candidate = R54_OPERATION_BLOCKED_PREFLIGHT
next_required_step = local_only_preflight_repair
```

### 17.2 packet scan fail

```text
status = BLOCKED_BY_BODY_LEAK_OR_QUESTION_TEXT
next_required_step = packet_generation_export_boundary_repair_or_abort
```

### 17.3 review rows incomplete

```text
status = INCONCLUSIVE
p5_decision_candidate = R54_OPERATION_INCONCLUSIVE
next_required_step = actual_review_completion_or_session_retry
```

### 17.4 RED / REPAIR_REQUIRED

```text
status = BODYFREE_SUMMARY_READY
p5_decision_candidate = P5_REPAIR_RETURN or P4_R12_TARGETED_CURRENT_ONLY_SURFACE_REPAIR
next_required_step = targeted_repair_decision
```

### 17.5 disposal fail

```text
status = R54_OPERATION_BLOCKED_DISPOSAL
next_required_step = purge_retry_or_abort
p6_start_allowed = false
p8_start_allowed = false
release_allowed = false
```

### 17.6 question text leak

```text
status = BLOCKED_BY_BODY_LEAK_OR_QUESTION_TEXT
next_required_step = question_text_leak_repair
p8_material_candidate = false
```

---

## 18. 華恋の意見

華恋の意見として、次の実装は「R54 helperをさらに厚くする」より、**実運用に入れるための薄いoperation layer**がよいです。

理由は、既存R54はR0〜R23の器がかなり大きく、既にbody-free handoffまで持っています。ここへさらに同じ種類のhelperを重ねると、また「器が増えたが実読感がない」状態になりやすいです。

一方で、今回受領zipと既存helper内部refsにはズレがあります。これを無視してactual reviewへ入ると、Mash様が渡した現在snapshotを読んだのか、過去helperの想定を読んだのかが混ざります。なので、実装するなら次がいちばん安全だと思います。

```text
1. operation_current_refsだけを新しく固定する。
2. 既存R54 helperは可能な限り再利用する。
3. 過去helper refsはhistorical evidenceとして残す。
4. actual review sessionだけをcurrent refs基準で動かす。
5. body-full packetはlocal-only、成果物はbody-freeだけにする。
```

Cocolonとしては、ここでP8へ急ぐより、P5履歴線を人間に読ませる方が誠実です。  
問いは便利です。でも、問いで補う前に、Cocolonが入力直後に返す「記録が線として返る体験」が本当に成立しているかを見ないと、質問機能がCocolonの核を弱くする逃げ道になりかねません。

---

## 19. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- 今回の指示は詳細設計書作成であり、実装指示ではない。
- json / schema案は設計書内に入れてよいが、実ファイル化は実装段階で判断する指示である。
- P7/P8 Bridgeでは、P7途中で観測補助問いを実装しない。
- P8開始時は、P7で集めた問い必要性観察メモを根拠にする。
- R54 helper / testsは存在する。
- R54はR0〜R23の器があるが、actual human review operationは未実施である。
- R55 decisionは R54 actual local-only human review operation required である。
- R55上、rating row count / question observation row count は0、disposal verifiedはfalseである。
- P4-R11はcurrent-only surface blocker確認であり、P5 human review evidenceではない。
- 既存R54/R55 helper内部refsは今回受領zipより古い。
- 今回operationではoperation_current_refsをcurrent basisとして分ける必要がある。
```

### 未確認

```text
- full backend suite一括green。
- R54/R55全targetの今回再実行。
- 実機submit。
- RN実機modal読感。
- 課金plan別実機確認。
- 外部ユーザーreadfeel。
- actual human reviewerによる24-case P5 Blind QA。
- body-full packet生成とpurgeの実運用。
- actual sanitized rating rows。
- actual question need observation rows。
- actual disposal receipt。
```

### 書かれていない

```text
- P4-R11完了だけでP8へ進んでよい、とは書かれていない。
- R54 helper実装完了だけでactual human review完了としてよい、とは書かれていない。
- 華恋の内部読解だけでhuman Blind QA完了としてよい、とは書かれていない。
- question need observation rowなしでP8観測補助問い詳細設計を始めてよい、とは書かれていない。
- release_allowedをtrueにしてよい根拠はない。
```

### 推測禁止

```text
- target tests greenを商品読感合格と推測しない。
- collect-only passをfull backend suite greenと推測しない。
- RN contract greenを実機modal確認済みと推測しない。
- R54 helper greenをactual human review完了と推測しない。
- R55 holdをP4-R11 greenで上書きしない。
- P5履歴線の弱さをP8問いで隠してよいと推測しない。
- P8設計に進む理由を「次に進みたい」から作らない。
```

### 次に実行すべきこと

```text
1. 本設計書を確認する。
2. 実装段階に入る場合、既存R54 helperだけでoperation_current_refsを扱えるかを先に確認する。
3. 既存helperで足りない場合だけ、薄いoperation wrapper moduleを追加する。
4. local-only preflight / explicit allow / purge plan / export denylist / retentionを最初に実装・確認する。
5. body-full packet生成はlocal-onlyで行い、成果物には出さない。
6. reviewer boundaryを固定し、華恋の内部読解をhuman review完了に変換しない。
7. actual review後、rating / blocker / question observation / disposal / R52 re-intakeをbody-freeで残す。
8. P8観測補助問い詳細設計は、actual question need observation rowsが揃うまで開始しない。
```

---

## 20. 最終判断

本設計の結論は次です。

```text
次実装候補:
  P7-R54 Actual Local-only Human Review Operation Re-entry

実装の中心:
  current operation refsの再固定
  local-only preflight
  24-case actual review operation
  body-free rating / blocker / question observation / disposal / R52 handoff

実装しないもの:
  P8 question design
  API / DB / RN / runtime差分
  release判断
```

Cocolonとして在るべき姿に照らすと、ここで必要なのは「質問機能を作ること」ではなく、**ユーザーの記録が、本当に読まれた形として返っているかを見届けること**です。  
R54 actual local-only human review operationは、そのための工程です。
