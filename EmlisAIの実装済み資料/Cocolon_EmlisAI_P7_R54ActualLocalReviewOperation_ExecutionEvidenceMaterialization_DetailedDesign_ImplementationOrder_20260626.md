# Cocolon / EmlisAI P7-R54 Actual Local-only Human Review Operation 実行証跡化 詳細設計書・実装順

作成日: 2026-06-26 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
対象: Cocolon / EmlisAI / P7 Product Quality Runner / P5 Human Blind QA / R54 Actual Local-only Human Review Operation / R52 re-intake / P7-P8 Bridge question need observation  
基準検討メモ: `Cocolon_EmlisAI_RoadmapStageDecision_PreDesignMemo_20260626.md`  
基準ロードマップ: `Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md`  
基準ローカル受領zip: `Cocolon_前提資料(256).zip` / `EmlisAIの実装済み資料(81).zip` / `Cocolon(254).zip` / `mashos-api(167).zip`  
GitHub接続確認: Mash指定により不要。未実施。  
コード変更: なし。本書は設計書。  
json / schema実ファイル化: なし。本書内の案のみ。実ファイル化は実装段階で判断する。  
body-full packet生成: なし。  
actual human review実行: なし。  
rating row実記入: なし。  
question need observation row実記入: なし。  
disposal / purge実行: なし。  
API / DB / RN UI / public response key / Emlis runtime変更: なし。  
P8観測補助問い詳細設計: なし。  
P6 limited human readfeel開始許可: なし。  
release判断変更: なし。  

---

## 0. 結論

次に設計対象へ固定する段階は、次です。

```text
P7-R54 Actual Local-only Human Review Operation 実行証跡化
```

この作業は、P8の問い設計ではありません。  
P5 User Label Connection履歴線が、実際に人間に読まれたとき、Cocolonの商品体験として「記録が線として返った」と言えるかを、local-only / body-free evidenceとして残すための工程です。

今回の設計で扱う中心は次です。

```text
- 今回受領snapshotをactual review basisとして再固定する。
- 既存R54-OP00〜OP24 helperを再実装せず、使えるものは使う。
- 既存helper内部のhistorical refsと、今回operation current refsを混ぜない。
- body-full packet生成はlocal-onlyに閉じる。
- 成果物へ残すのはselection-only / body-freeの証跡だけにする。
- 24 rating rowsをbody-freeで残せる構造にする。
- 24 question need observation rowsをbody-freeで残せる構造にする。
- readfeel blockerとexecution blockerを分ける。
- disposal receiptをbody-freeで残す。
- R52 re-intakeへ渡すbody-free handoffを作る。
```

この段階でも、次はtrue化しません。

```text
p5_human_blind_qa_confirmed_final = false
p6_limited_human_readfeel_start_allowed = false
p8_start_allowed = false
p7_complete = false
release_allowed = false
```

華恋の判断として、ここで一番避けるべきことは、**R54-OP helperがあることを、actual human reviewが終わったことに変換してしまうこと**です。  
R54-OPは器です。今回設計するのは、その器を使って、実際の人間読感をbody-free証跡へ落とすための運用・実装順です。

---

## 1. なぜこの作業を行うのか

Cocolonの商品価値は、入力直後に「それっぽいAI文」が返ることではなく、ユーザーが残した言葉や記録が、次の自分にとって意味のある線として返ってくることにあります。

P5 User Label Connectionは、その中核です。  
P5が弱いままP8の観測補助問いへ進むと、Cocolonは「記録が線として返るアプリ」ではなく、「AIに追加質問されるアプリ」へ寄ってしまいます。

質問が不要という意味ではありません。  
問いを勘で作らないために、まずP5履歴線が問いなしでどこまで読めているかを人間の読感で確認し、問いが必要だったケースだけをbody-free観察rowとして残します。

この作業の目的は、次の一点です。

```text
P5履歴線が、ユーザー本人の記録として自然に返っているかを、actual local-only human reviewで確認し、
その結果を raw body ではなく body-free evidence としてR52へ渡す。
```

---

## 2. 参照・確認範囲

### 2.1 作業姿勢として確認した前提資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
```

作業姿勢上の固定:

```text
- Cocolonは商品であり、test greenだけを成果にしない。
- 前提資料だけで断定せず、実ファイルを見る。
- 設計と実装を混ぜない。
- 指示されていないAPI / DB / RN / response key / runtime変更をしない。
- EmlisAIをテンプレ共感文や外部AI任せへ逃がさない。
- P8問いでP5の弱さを隠さない。
- 成果物は指示された形式だけにする。
```

### 2.2 基準検討メモ

```text
Cocolon_EmlisAI_RoadmapStageDecision_PreDesignMemo_20260626.md
```

基準メモから固定する判断:

```text
- 次段階はP8ではなく、P7-R54 Actual Local-only Human Review Operation 実行証跡化。
- R54-OP helper / testsは器であり、actual human reviewは未実施。
- 24 rating rows / 24 question need observation rows / disposal receipt / R52 re-intake handoffが未成立。
- body-full packetはlocal-onlyに閉じ、成果物へ入れない。
- reviewer free text / raw input / returned body / history surface / question text / local path / body hashを残さない。
- actual reviewでP5履歴線が弱い場合はP5 repairへ戻し、P8問いで補わない。
- actual reviewでcurrent-only blockerが出た場合はP4-R12 targeted repairへ戻す。
- P8詳細設計は、actual question need observation rowsとR52 re-intake判断が揃うまで開始しない。
```

### 2.3 指定ロードマップ

```text
Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md
```

読み方:

```text
P7:
  Product Quality Runner / Long-run Product Gate。
  P5 human Blind QA、P6 limited human readfeel、実機modal確認中にbody-freeの問い必要性観察メモを残す。

P7/P8 Bridge:
  観測補助問いはP7中に実装しない。
  P8で勘の設計にしないための観察メモだけを残す。

P8:
  Personal Continuity / Derived User Model。
  P7で集めた観察メモを参照して、P8開始時に問い詳細設計を作る。
```

### 2.4 参照した実装済み資料

```text
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R48_P5HumanBlindQAActualReviewPacket_詳細設計書_実装順_20260618.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R49_P5HumanBlindQA_QuestionNeedObservation_詳細設計書_実装順_20260619.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R52_R51HandoffEvidenceDecisionGate_DetailedDesign_ImplementationOrder_20260621.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R53_R51ActualLocalReviewExecutionEvidenceMaterialization_DetailedDesign_ImplementationOrder_20260621.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R54_P5HumanBlindQAActualLocalReviewExecution_BodyFreeResultHandoff_DetailedDesign_ImplementationOrder_20260622.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R54ActualLocalOnlyHumanReviewOperation_Reentry_DetailedDesign_ImplementationOrder_20260625.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R55_R54EvidenceReconcile_R52ReintakeDecisionMaterialization_DetailedDesign_ImplementationOrder_20260623.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P4_R11_ResidualFamilyCurrentOnlySurfaceAudit_DetailedDesign_ImplementationOrder_20260624.md
```

### 2.5 参照した主な現行実ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_actual_local_review_operation_reentry_20260625.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_r11_residual_family_surface_audit.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_r11_summary_decision_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_r11_surface_specificity_role_verdict_audit.py
Cocolon/tests/rn-screen-contracts.test.js
```

---

## 3. 現在地の固定

### 3.1 R54-OPの現在地

現行backendには、R54 actual local-only human review operation re-entry helperが存在します。  
`emlis_ai_p7_r54_actual_local_review_operation_reentry_20260625.py` には、OP00〜OP24のbuild/assert helperが存在します。

主な既存器:

```text
OP00 scope / no-touch boundary freeze
OP01 operation current snapshot refs refreeze
OP02 historical helper source delta reconcile
OP03 R55 hold intake
OP04 local-only preflight
OP05 24-case manifest freeze
OP06 local-only body-full packet generation request
OP07 packet generation local operation boundary
OP08 packet completeness / export denylist scan
OP09 reviewer instruction / rating form freeze
OP10 actual human review operation state capture
OP11 sanitized review result capture
OP12 rating row normalization
OP13 readfeel blocker / execution blocker ingestion
OP14 question need observation normalization
OP15 rating / question consistency guard
OP16 pause / abort / expiration protocol
OP17 purge / disposal receipt
OP18 body-free post-review summary
OP19 P5 decision candidate separation
OP20 P6 candidate handoff
OP21 P8 material candidate handoff
OP22 final no-body-leak / no-question-text / no-touch validation
OP23 R52 re-intake handoff
OP24 validation command matrix / documentation output
```

ただし、これはactual reviewが完了した意味ではありません。

```text
body-full packet生成: 未実施
actual human review: 未実施
actual rating rows: 未作成
actual question need observation rows: 未作成
actual disposal receipt: 未作成
actual R52 re-intake handoff: 未成立
```

### 3.2 helper refsと今回current refsのズレ

既存R54-OP helper内部には、2026-06-25時点のoperation refsが残っています。

```text
既存helper内の例:
  Cocolon_前提資料(254).zip
  EmlisAIの実装済み資料(80).zip
  Cocolon(253).zip
  mashos-api(166).zip
  20260625 design refs
```

今回のactual review basisは、Mashから今回受領したsnapshotです。

```text
今回operation_current_refs:
  premise_zip_ref: Cocolon_前提資料(256).zip
  implemented_materials_zip_ref: EmlisAIの実装済み資料(81).zip
  rn_zip_ref: Cocolon(254).zip
  backend_zip_ref: mashos-api(167).zip
  roadmap_ref: Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md
  pre_design_memo_ref: Cocolon_EmlisAI_RoadmapStageDecision_PreDesignMemo_20260626.md
  detailed_design_ref: Cocolon_EmlisAI_P7_R54ActualLocalReviewOperation_ExecutionEvidenceMaterialization_DetailedDesign_ImplementationOrder_20260626.md
```

設計上の固定:

```text
- 既存helper refsはhistorical helper refsとして扱う。
- 今回actual review basisはoperation_current_refsだけにする。
- 過去helper refsをactual review basisへ混ぜない。
- 既存helperを再利用する場合も、handoff summary上でcurrent refs override / wrapper / session envelopeのいずれかを明示する。
```

### 3.3 R55の現在地

R55は、R54 actual review evidence不足を固定し、R54 actual local-only human review operationへ戻す判断です。

```text
r55_decision_ref:
  R55_R52_RETURN_TO_R54_ACTUAL_REVIEW_REQUIRED

next_required_step:
  R54_actual_local_only_human_review_operation_required_before_R52_reintake

required_case_count:
  24

rating_row_count:
  0

question_observation_row_count:
  0

disposal_verified:
  false

p6_hold:
  true

p8_hold:
  true

release_hold:
  true
```

R55はP8開始判断ではありません。  
R55を、P8へ進む根拠に変換してはいけません。

### 3.4 P4-R11の現在地

P4-R11は、current-only surface auditです。  
P5履歴線のhuman review evidenceではありません。

```text
P4-R11:
  current-only surface specificity / role verdict audit。
  actual blockerが出た場合、P4-R12 targeted current-only surface repairへ戻す材料。

R54:
  P5 User Label Connection履歴線のactual human Blind QA。
```

したがって、P4-R11 greenを、P5 human review合格・P8開始・release根拠にしません。

---

## 4. 対象 / 非対象

### 4.1 対象

本設計で対象にするもの:

```text
- operation_current_refsの今回snapshot再固定
- historical helper refsとoperation current refsの分離
- R55 hold intake
- local-only preflight
- explicit allow / purge plan / retention / export denylist
- 24-case manifest freeze
- body-full packet生成requestのbody-free化
- body-full packet本体をlocal-onlyに閉じる運用境界
- reviewer selection-only form
- sanitized review result capture
- 24 rating rows normalization
- readfeel blocker / execution blocker classification
- 24 question need observation rows normalization
- rating / question consistency guard
- pause / abort / expiration protocol
- disposal receipt
- body-free post-review summary
- P5 decision candidate separation
- P6 candidate-only handoff
- P8 material candidate-only handoff
- final no-body-leak / no-question-text / no-touch validation
- R52 re-intake handoff
- implementation order / validation command matrix
```

### 4.2 非対象

本設計で対象にしないもの:

```text
- P8観測補助問いの詳細設計
- question text / draft question text
- question trigger logic
- question answer persistence
- question plan guard
- API route変更
- request / response key変更
- public response top-level key追加
- DB schema / migration / write path変更
- RN UI / modal / 表示条件変更
- Emlis runtime本文生成変更
- User Label Connection runtime変更
- Gate threshold変更
- subscription / account / access policy変更
- full backend suite green主張
- 実機modal確認完了主張
- P6開始許可
- P8開始許可
- release_allowed true化
```

---

## 5. 基本設計

### 5.1 実行証跡化の十層

```text
Layer 1: Current Snapshot Refreeze
  今回受領zipをactual review basisとして固定する。

Layer 2: Historical Helper Delta
  既存R54/R55 helper refsをhistorical contextとして分離する。

Layer 3: Local-only Preflight
  local root / explicit allow / purge plan / retention / export denylistを確認する。

Layer 4: 24-case Manifest
  R54 P5 Human Blind QAの24件を固定する。P4-R11 24 rowsとは混同しない。

Layer 5: Body-full Packet Local Boundary
  reviewerが読むためのpacketだけをlocal-onlyに生成し、成果物へ出さない。

Layer 6: Human Reviewer Selection
  reviewerは人間。free textではなくselection-onlyでrating / blocker / question observationを記入する。

Layer 7: Body-free Evidence Normalization
  24 rating rows / blocker rows / question observation rowsへ正規化する。

Layer 8: Consistency / Fail-closed
  P5 repair対象をP8材料へ逃がさない。body leak / question text / no-touch違反をfail-closedにする。

Layer 9: Disposal Receipt
  body-full packet / reviewer notes / temporary formをpurgeし、body-free receiptだけを残す。

Layer 10: R52 Re-intake Handoff
  P5 candidate / P5 repair / P4-R12 repair / inconclusive / P6 candidate / P8 material candidateを分離してR52へ渡す。
```

### 5.2 body-freeに残してよいもの

```text
- schema_version
- material_id
- review_session_id
- operation_current_refs
- historical_helper_refs_separated
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
- readfeel_blocker_ids
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

### 5.3 body-freeに残してはいけないもの

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

### 5.4 fixed false flags

実装・運用のすべてのbody-free成果物で、次はfalseを維持します。

```text
api_changed = false
db_changed = false
rn_changed = false
runtime_changed = false
api_route_changed = false
db_schema_changed = false
db_migration_changed = false
rn_visible_contract_changed = false
public_response_top_level_key_added = false
public_response_key_changed = false
question_api_implemented = false
question_db_schema_implemented = false
question_rn_ui_implemented = false
question_response_key_implemented = false
question_trigger_logic_implemented = false
question_storage_schema_implemented = false
question_answer_persistence_implemented = false
question_plan_guard_implemented = false
question_implementation_started_here = false
p8_question_implementation_spec_finalized_here = false
p5_human_blind_qa_confirmed_final = false
p6_limited_human_readfeel_start_allowed = false
p8_start_allowed = false
p7_complete = false
release_allowed = false
body_full_packet_export_allowed = false
reviewer_notes_export_allowed = false
body_full_packet_zip_inclusion_allowed = false
local_absolute_path_materialized_here = false
body_content_hash_materialized_here = false
packet_content_hash_materialized_here = false
terminal_output_stored_here = false
```

---

## 6. local-only preflight設計

### 6.1 preflight必須条件

body-full packet生成要求前に、次を満たす必要があります。

```text
- COCOLON_EMLIS_LOCAL_REVIEW_ROOT 相当のlocal review rootが明示されている。
- local review rootがrepo / docs / tests / services / release / public_meta / 前提資料 / 実装済み資料 / 成果物配下ではない。
- explicit allow tokenがある。
- purge planがある。
- retention policyがある。
- export denylistがある。
- reviewer notesを成果物へ出さない方針がある。
- body-full packetを成果物・release material・public metaへ出さない方針がある。
```

### 6.2 local root policy案

```text
local_review_root_env_var:
  COCOLON_EMLIS_LOCAL_REVIEW_ROOT

storage_mode:
  external_local_only

repo_local_storage_allowed:
  false

body_full_packet_retention_max_hours:
  72

reviewer_notes_retention_after_rating_finalized_max_hours:
  24

delete_trigger_refs:
  rating_rows_finalized
  blocker_rows_finalized
  question_observation_rows_finalized
  review_session_cancelled
  review_session_aborted
  retention_deadline_reached
```

### 6.3 export denylist案

```text
.local_review_packets/
body_full_packets.local_only/
reviewer_notes.local_only/
temporary_review_forms.local_only/
*.local_review_packet.json
*.reviewer_notes.json
*.local_only.json
Cocolon_EmlisAI_*_LocalReviewPacket_*_body_full*
```

### 6.4 explicit allow token案

```text
explicit_allow_token_ref:
  R54_ACTUAL_LOCAL_REVIEW_BODY_FULL_PACKET_GENERATION_ALLOWED_20260626

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
  前提資料
  実装済み資料
```

### 6.5 preflight fail時

```text
review_status:
  PREFLIGHT_BLOCKED

p5_decision_candidate:
  R54_OPERATION_BLOCKED_PREFLIGHT

actual_human_review_run:
  false

actual_review_evidence_complete:
  false

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

R54 P5 Human Blind QAでは、24-case distributionを維持します。

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
  P5 User Label Connection履歴線のactual human Blind QA。
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

reviewerへ見せても成果物へ残してはいけないもの:

```text
- current input body
- returned Emlis body
- P5 history line / bounded history surface body
- reviewer notes
```

reviewerへ見せないもの:

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

reviewer_ref:
  pseudonymous idのみ。
  氏名・メール・アカウント・個人情報は成果物へ残さない。
```

人間reviewerを置けない場合:

```text
review_status:
  NOT_STARTED or INCONCLUSIVE

actual_review_evidence_complete:
  false

next_required_step:
  actual_human_reviewer_assignment_or_operation_retry
```

---

## 8. rating / blocker設計

### 8.1 rating axes

```text
history_connection_naturalness:       target >= 0.90
creepy_absence:                       target >= 0.95
overclaim_absence:                    target >= 0.95
self_blame_non_amplification:         target >= 0.95
wants_more_input_or_accumulation:     target >= 0.85
non_shallow_repeat:                   target >= 0.90
```

score範囲:

```text
0.00 <= axis_score <= 1.00
```

reviewer formでは、ゆらぎを減らすため、固定選択値を第一候補にします。

```text
0.00
0.25
0.50
0.75
1.00
```

### 8.2 verdict enum

```text
PASS
YELLOW
REPAIR_REQUIRED
RED
NOT_REVIEWABLE
```

読み方:

```text
PASS:
  履歴線が自然で、怖さ・過剰断定・自己責め増幅がなく、記録が返ってきた体験として機能している。

YELLOW:
  致命ではないが、人間判断が残る。P5 confirmed candidateには直行しない。

REPAIR_REQUIRED:
  P5 surface / Emlis本体 / Gate boundaryのいずれかへ戻す必要がある。

RED:
  商品表示不可に近い読感事故。P5 repair returnまたはP4/P5 targeted repairへ戻す。

NOT_REVIEWABLE:
  材料不足・実行不備などで読感判定不能。readfeel REDとは分ける。
```

### 8.3 readfeel blocker ids案

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

### 8.4 execution blocker ids案

```text
review_packet_generation_blocked_missing_local_root
review_packet_generation_blocked_invalid_local_root
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
body_payload_leak_detected
local_path_leak_detected
body_hash_leak_detected
no_touch_violation_detected
```

execution blockerはreadfeel verdictへ混ぜません。  
local root不足やpurge失敗は「読感RED」ではなく、実行blockerです。

---

## 9. question need observation設計

### 9.1 目的

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

### 9.2 primary class refs案

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

### 9.3 ambiguity kind refs案

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

### 9.4 one question fit refs案

```text
not_needed
fits_one_question
needs_more_than_one_question_not_p7
would_delay_immediate_observation
unsafe_or_boundary_not_question
repair_required_not_question
insufficient_material
```

### 9.5 repair required refs案

```text
no_repair_required
emlis_readfeel_repair_required
p5_surface_repair_required
gate_boundary_repair_required
p4_current_surface_repair_required
```

### 9.6 plan candidate flags案

```text
plus_single_question_candidate_later: boolean
premium_deep_dive_candidate_later: boolean
p8_design_material_candidate: boolean
p8_implementation_spec_finalized_here: false
```

### 9.7 禁止

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

## 10. operation workflow

### 10.1 正常系

```text
1. operation_current_refsを20260626 snapshotへ固定する。
2. historical helper refsとの差分をbody-free rowにする。
3. R55 hold intakeを取り込む。
4. local-only preflightを通す。
5. 24-case manifestを固定する。
6. body-full packet generation requestをbody-freeで作る。
7. local-only rootにbody-full packetを生成する。
8. packet completeness / export denylist scanをbody-freeで残す。
9. reviewer instruction / rating formを固定する。
10. actual human review状態をcaptureする。
11. reviewer selectionsをbody-free rowへ取り込む。
12. 24 rating rowsへ正規化する。
13. readfeel blocker / execution blockerを分ける。
14. 24 question need observation rowsへ正規化する。
15. rating / question consistency guardを通す。
16. pause / abort / expiration protocolを通す。
17. body-full packet / notes / temporary formをpurgeする。
18. disposal receiptをbody-freeで残す。
19. body-free post-review summaryを作る。
20. P5 decision candidateを分離する。
21. P6 candidate-only handoffを作る。start_allowedはfalse。
22. P8 material candidate-only handoffを作る。p8_start_allowedはfalse。
23. final no-body-leak / no-question-text / no-touch validationを通す。
24. R52 re-intake handoffを作る。
25. validation command matrix / documentation outputを残す。
```

### 10.2 fail-closed系

```text
preflight fail:
  R54_OPERATION_BLOCKED_PREFLIGHT
  next_required_step = local_only_preflight_repair

body leak / question text leak / local path leak:
  R54_OPERATION_BLOCKED_BODY_LEAK_OR_QUESTION_TEXT
  next_required_step = leak_repair_before_r52_handoff

review rows incomplete:
  R54_OPERATION_INCONCLUSIVE
  next_required_step = actual_review_completion_or_retry

P5 readfeel blocker:
  P5_REPAIR_RETURN
  next_required_step = p5_repair_return_required

current-only surface blocker:
  P4_R12_TARGETED_CURRENT_ONLY_SURFACE_REPAIR
  next_required_step = p4_r12_targeted_current_only_surface_repair

disposal fail:
  R54_OPERATION_BLOCKED_DISPOSAL
  next_required_step = purge_retry_or_abort

no-touch violation:
  R54_OPERATION_BLOCKED_NO_TOUCH_VIOLATION
  next_required_step = no_touch_violation_repair
```

---

## 11. 実装方針

### 11.1 第一方針: 既存helperを最大限再利用する

既存の `emlis_ai_p7_r54_actual_local_review_operation_reentry_20260625.py` は、OP00〜OP24の器を既に持っています。  
したがって、実装段階ではまず、既存helperだけで今回必要なbody-free execution evidenceを作れるか確認します。

確認対象:

```text
- operation_current_refsを今回snapshotへoverrideできるか。
- helper内部historical refsをactual review basisとして使わずに済むか。
- OP04 preflightからOP23 R52 handoffまで、actual selection rowsを受け取れるか。
- OP11/OP12/OP14/OP17/OP18/OP23のbody-free contractが、今回の成果物境界に合うか。
```

既存helperだけで足りる場合:

```text
新規production moduleは作らない。
必要ならresult memo / local operation instruction / testsだけを追加候補にする。
```

### 11.2 第二方針: 足りない場合だけ薄いwrapperを追加する

既存helperが今回current refsを安全に扱えない場合のみ、薄いoperation wrapperを追加候補にします。

候補file:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_actual_review_execution_evidence_materialization_20260626.py
```

役割:

```text
- operation_current_refsを20260626 snapshotへ固定する。
- 既存R54-OP helperをimportして再利用する。
- historical helper refsをactual review basisへ混ぜない。
- reviewer selection rowsをbody-free evidenceへ流す。
- body-free summary / R52 handoffを組み立てる。
- no-body-leak / no-question-text / no-touchを最終確認する。
```

wrapperがしてはいけないこと:

```text
- body-full packet本体を成果物へ書き出す。
- local path / body hashをbody-free evidenceへ残す。
- question text / draft question textを作る。
- P8 logicを実装する。
- API / DB / RN / runtimeへ触る。
- P6/P8/release allowedをtrueにする。
```

### 11.3 第三方針: result memo / local operation instructionを分ける

actual reviewはlocal-only運用を含みます。  
実装段階では、次を分けるのが安全です。

```text
設計 / code helper:
  body-free schema / normalizer / validator / handoff。

local operation instruction:
  Mashのローカル環境でbody-full packetをどう扱うか。
  ただし成果物へbody-fullを含めない。

result memo:
  body-free counts / decision / blocker / disposal / R52 handoffだけを記録。
```

候補result memo:

```text
mashos-api/ai/tests/Cocolon_EmlisAI_P7_R54ActualLocalReviewOperation_ExecutionEvidenceMaterialization_ImplementationResult_20260626.md
```

---

## 12. 実装順詳細

### R54-EV-00: scope / no-touch boundary確認

目的:

```text
今回の実装が、actual review実行証跡化であり、P8設計・API/DB/RN/runtime変更ではないことを固定する。
```

確認:

```text
api_changed = false
db_changed = false
rn_changed = false
runtime_changed = false
question_implementation_started_here = false
release_allowed = false
```

成果物候補:

```text
scope_no_touch_boundary.bodyfree
```

### R54-EV-01: existing helper capability inspection

目的:

```text
既存R54-OP helperだけで今回の実行証跡化ができるか確認する。
```

確認する関数群:

```text
build_p7_r54_op01_operation_current_snapshot_refs_refreeze
build_p7_r54_op04_local_only_preflight
build_p7_r54_op05_24_case_manifest_freeze
build_p7_r54_op06_local_only_body_full_packet_generation_request
build_p7_r54_op10_actual_human_review_operation_state_capture
build_p7_r54_op11_sanitized_review_result_capture
build_p7_r54_op12_rating_row_normalization
build_p7_r54_op13_readfeel_blocker_execution_blocker_ingestion
build_p7_r54_op14_question_need_observation_normalization
build_p7_r54_op15_rating_question_consistency_guard
build_p7_r54_op17_purge_disposal_receipt
build_p7_r54_op18_bodyfree_post_review_summary
build_p7_r54_op19_p5_decision_candidate_separation
build_p7_r54_op21_p8_material_candidate_handoff
build_p7_r54_op22_final_no_body_leak_no_question_text_no_touch_validation
build_p7_r54_op23_r52_reintake_handoff
```

判断:

```text
A. 既存helperだけでcurrent refs override / body-free handoffが可能
   -> wrapper追加なし。

B. existing helper内current refsが固定でoverride不可
   -> thin wrapper候補へ進む。

C. actual selection rowsの受け口が不足
   -> row intake helper追加候補へ進む。
```

### R54-EV-02: operation_current_refs 20260626 refreeze

目的:

```text
今回actual review basisを20260626受領snapshotへ固定する。
```

必須refs:

```text
premise_zip_ref = Cocolon_前提資料(256).zip
implemented_materials_zip_ref = EmlisAIの実装済み資料(81).zip
rn_zip_ref = Cocolon(254).zip
backend_zip_ref = mashos-api(167).zip
roadmap_ref = Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md
pre_design_memo_ref = Cocolon_EmlisAI_RoadmapStageDecision_PreDesignMemo_20260626.md
detailed_design_ref = Cocolon_EmlisAI_P7_R54ActualLocalReviewOperation_ExecutionEvidenceMaterialization_DetailedDesign_ImplementationOrder_20260626.md
```

fail条件:

```text
- 20260625 helper refsを今回actual review basisにしている。
- historical helper refsとoperation current refsを分離していない。
```

### R54-EV-03: R55 hold intake再固定

目的:

```text
R55がR54 actual review requiredを要求していることを、実行開始前提にする。
```

固定:

```text
required_case_count = 24
rating_row_count_before_review = 0
question_observation_row_count_before_review = 0
disposal_verified_before_review = false
p6_hold = true
p8_hold = true
release_hold = true
```

### R54-EV-04: local-only preflight実装確認

目的:

```text
body-full packet生成の前に、安全条件を満たすかbody-freeで判定する。
```

実装候補:

```text
既存OP04を利用。
不足があればwrapperで20260626 allow token / refsを渡す。
```

完了条件:

```text
preflight_status = PREFLIGHT_READY or PREFLIGHT_BLOCKED
body_full_packet_generation_allowed_by_preflight = boolean
local_path_included = false
raw_body_included = false
question_text_included = false
```

### R54-EV-05: 24-case manifest再固定

目的:

```text
R54 P5 Human Blind QAの24件を固定し、P4-R11 rowsと混ぜない。
```

完了条件:

```text
required_case_count = 24
controller_manifest_rows = 24
reviewer_facing_case_index_rows = 24
p4_r11_rows_mixed_in = false
case_ref_id unique = true
blind_case_id unique = true
```

### R54-EV-06: body-full packet generation request body-free化

目的:

```text
body-full packet本体ではなく、生成要求のbody-free証跡だけを作る。
```

成果物へ残すもの:

```text
packet_request_count
packet_ref_ids
allowed_output_ref = local_only_body_full_packet
forbidden_output_refs
export_denylist_refs
```

成果物へ残さないもの:

```text
packet content
local path
body hash
raw input
returned body
history surface
```

### R54-EV-07: local operation boundary instruction

目的:

```text
Mashがローカルで作業する際、body-full packetが成果物へ混ざらないよう、操作境界を固定する。
```

本設計で実行しないもの:

```text
body-full packet生成
actual review
purge
```

実装段階で作る可能性があるもの:

```text
local operation README / body-free instruction section
```

ただし、これも実装段階で判断します。

### R54-EV-08: reviewer selection form固定

目的:

```text
reviewerがfree textではなく、選択式で記入する形式を固定する。
```

記入欄:

```text
- axis_scores
- verdict
- sanitized_reason_ids
- readfeel_blocker_ids
- execution_blocker_ids
- question_need_primary_class
- ambiguity_kind_refs
- one_question_fit_ref
- repair_required_refs
- plan_candidate_flags
```

禁止欄:

```text
- reviewer free text export欄
- question text欄
- raw body copy欄
- local path欄
- hash欄
```

### R54-EV-09: sanitized review result row intake

目的:

```text
reviewer selectionsをbody-free rowとして取り込む。
```

完了条件:

```text
sanitized_review_result_row_count = 24
reviewer_free_text_included = false
raw_body_included = false
question_text_included = false
local_path_included = false
body_hash_included = false
```

### R54-EV-10: rating row normalization

目的:

```text
sanitized review resultsを24 rating rowsへ正規化する。
```

完了条件:

```text
rating_row_count = 24
all_axes_present = true
axis_score_range_valid = true
verdict_allowed = true
rating_consistency_issue_count = 0
```

### R54-EV-11: blocker ingestion

目的:

```text
readfeel blockerとexecution blockerを分ける。
```

完了条件:

```text
readfeel_blocker_rows_normalized = true
execution_blocker_rows_normalized = true
execution_blocker_not_mixed_into_readfeel_verdict = true
```

### R54-EV-12: question need observation row normalization

目的:

```text
24件分の問い必要性観察をbody-free rowにする。
```

完了条件:

```text
question_observation_row_count = 24
question_need_primary_class_allowed = true
ambiguity_kind_refs_allowed = true
one_question_fit_ref_allowed = true
question_text_included = false
draft_question_text_included = false
p8_implementation_spec_finalized_here = false
```

### R54-EV-13: rating / question consistency guard

目的:

```text
P5修正対象をP8材料へ逃がしていないか確認する。
```

検出する矛盾:

```text
- RED / REPAIR_REQUIREDなのに no_question_needed としている。
- P5 surface repair requiredなのにP8 design material candidateへ昇格している。
- insufficient materialなのにPASS扱いしている。
- not_question_*_repair_required があるのにP5 confirmed candidateへ進んでいる。
```

### R54-EV-14: pause / abort / expiration protocol

目的:

```text
中断・期限切れ・abort時に、body-full materialが残り続けないようにする。
```

状態:

```text
READY_FOR_PURGE_DISPOSAL_RECEIPT
PAUSED_NO_HANDOFF_LOCAL_ONLY
ABORTED_PURGE_REQUIRED
EXPIRED_PURGE_REQUIRED
RATING_INCOMPLETE_PURGE_REQUIRED
BLOCKED_BY_CONSISTENCY_GUARD
```

### R54-EV-15: purge / disposal receipt

目的:

```text
body-full packet / reviewer notes / temporary formを削除し、body-free receiptだけを残す。
```

完了条件:

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
p5_decision_candidate = R54_OPERATION_BLOCKED_DISPOSAL
p6_limited_human_readfeel_start_allowed = false
p8_start_allowed = false
release_allowed = false
```

### R54-EV-16: body-free post-review summary

目的:

```text
rating / blocker / question / disposalをbody-free count summaryにする。
```

含めるもの:

```text
required_case_count
reviewed_case_count
rating_row_count
question_observation_row_count
verdict_counts
axis_score_averages
open_readfeel_blocker_count
open_execution_blocker_count
primary_class_counts
ambiguity_kind_counts
one_question_fit_counts
repair_required_counts
disposal_verified
no_body_leak_validation_passed
no_question_text_validation_passed
no_touch_validation_passed
```

含めないもの:

```text
raw input
returned Emlis body
history surface
reviewer free text
question text
local path
body hash
terminal output body
```

### R54-EV-17: P5 decision candidate separation

目的:

```text
actual review結果から、P5 confirmed candidate / P5 repair return / P4-R12 repair / inconclusiveを分ける。
```

候補:

```text
P5_CONFIRMED_CANDIDATE
P5_REPAIR_RETURN
P4_R12_TARGETED_CURRENT_ONLY_SURFACE_REPAIR
R54_OPERATION_INCONCLUSIVE
R54_OPERATION_BLOCKED_PREFLIGHT
R54_OPERATION_BLOCKED_DISPOSAL
R54_OPERATION_BLOCKED_BODY_LEAK_OR_QUESTION_TEXT
R54_OPERATION_BLOCKED_NO_TOUCH_VIOLATION
```

注意:

```text
P5_CONFIRMED_CANDIDATE は final confirmation ではない。
P5_CONFIRMED_CANDIDATE は P6 start allowed ではない。
P5_CONFIRMED_CANDIDATE は P8 start allowed ではない。
P5_CONFIRMED_CANDIDATE は release allowed ではない。
```

### R54-EV-18: P6 candidate-only handoff

目的:

```text
P5が十分強い場合だけ、P6 limited human readfeel候補を作る。
```

固定:

```text
p6_limited_human_readfeel_candidate = 条件次第でtrue
p6_limited_human_readfeel_start_allowed = false
```

### R54-EV-19: P8 material candidate-only handoff

目的:

```text
question need observation rowsをP8詳細設計材料候補として集約する。
```

固定:

```text
p8_question_design_material_candidate = 条件次第でtrue
p8_start_allowed = false
question_implementation_started_here = false
p8_implementation_spec_finalized_here = false
```

### R54-EV-20: final no-body-leak / no-question-text / no-touch validation

目的:

```text
成果物へbody-full / question text / contract mutationが混入していないかを最終確認する。
```

fail時:

```text
R54_OPERATION_BLOCKED_BODY_LEAK_OR_QUESTION_TEXT
または
R54_OPERATION_BLOCKED_NO_TOUCH_VIOLATION
```

### R54-EV-21: R52 re-intake handoff

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

### R54-EV-22: validation command matrix / documentation output

目的:

```text
実装時に実行したコマンド、未実行、green主張範囲をbody-freeに残す。
```

禁止:

```text
- collect-onlyをfull suite greenへ変換しない。
- RN contract greenを実機modal確認済みへ変換しない。
- R54 helper greenをactual human review完了へ変換しない。
- terminal output bodyを成果物へ保存しない。
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
NOT_REVIEWABLE = 0
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

ただし、候補止まりです。

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
- YELLOWが残り、人間判断が必要。
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

### 13.4 P8 material candidate条件

P8材料候補にしてよいのは、次に限ります。

```text
- question_may_reduce_overread_risk があり、P5修正対象ではない。
- question_would_make_immediate_observation_heavy があり、問い抑制材料として使える。
- plus_single_question_candidate_later / premium_deep_dive_candidate_later がある。
- no_question_needed_emlis_can_observe があり、問い不要根拠として使える。
```

P8材料候補にしてはいけないもの:

```text
- not_question_emlis_readfeel_repair_required
- not_question_p5_surface_repair_required
- not_question_gate_boundary_required
- insufficient_material_execution_blocker
- RED / REPAIR_REQUIRED / YELLOW未解消case
- body leak / disposal fail / no-touch violationがあるsession
```

### 13.5 inconclusive条件

```text
- preflight blockerがある。
- body-full packet生成が未実施。
- actual review rowsが24件揃っていない。
- rating rowsが不完全。
- question observation rowsが不完全。
- rating/question consistency issueが残る。
- disposal receiptが未作成。
- disposal verificationが未完。
- reviewer_refが不明。
- 華恋内部読解だけでhuman review扱いにしようとしている。
- timeout / collect-only / target greenを商品読感合格へ変換している。
```

---

## 14. JSON / schema案

本章のschemaは、設計書内の案です。  
実ファイル化は実装段階で判断します。

### 14.1 `p7_r54_ev_operation_current_refs.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ev_operation_current_refs.bodyfree.v1",
  "type": "object",
  "required": [
    "schema_version",
    "phase",
    "scope",
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
    "schema_version": { "const": "cocolon.emlis.p7_r54.ev_operation_current_refs.bodyfree.v1" },
    "phase": { "const": "P7" },
    "scope": { "const": "p7_r54_actual_local_review_execution_evidence_materialization" },
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
      "properties": {
        "premise_zip_ref": { "const": "Cocolon_前提資料(256).zip" },
        "implemented_materials_zip_ref": { "const": "EmlisAIの実装済み資料(81).zip" },
        "rn_zip_ref": { "const": "Cocolon(254).zip" },
        "backend_zip_ref": { "const": "mashos-api(167).zip" },
        "roadmap_ref": { "type": "string" },
        "pre_design_memo_ref": { "type": "string" },
        "detailed_design_ref": { "type": "string" }
      },
      "additionalProperties": false
    },
    "historical_helper_refs_separated": { "const": true },
    "actual_review_basis_ref": { "const": "operation_current_refs_only" },
    "body_free": { "const": true },
    "api_changed": { "const": false },
    "db_changed": { "const": false },
    "rn_changed": { "const": false },
    "runtime_changed": { "const": false },
    "release_allowed": { "const": false }
  },
  "additionalProperties": false
}
```

### 14.2 `p7_r54_ev_preflight.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ev_preflight.bodyfree.v1",
  "type": "object",
  "required": [
    "schema_version",
    "review_session_id",
    "preflight_status",
    "local_review_root_declared",
    "local_review_root_valid_ref",
    "explicit_allow_present",
    "purge_plan_present",
    "retention_policy_present",
    "export_denylist_present",
    "body_full_packet_generation_allowed_by_preflight",
    "blocked_reason_refs",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.ev_preflight.bodyfree.v1" },
    "review_session_id": { "type": "string" },
    "preflight_status": { "enum": ["PREFLIGHT_READY", "PREFLIGHT_BLOCKED"] },
    "local_review_root_declared": { "type": "boolean" },
    "local_review_root_valid_ref": { "enum": ["external_local_only", "invalid_or_missing"] },
    "explicit_allow_present": { "type": "boolean" },
    "purge_plan_present": { "type": "boolean" },
    "retention_policy_present": { "type": "boolean" },
    "export_denylist_present": { "type": "boolean" },
    "body_full_packet_generation_allowed_by_preflight": { "type": "boolean" },
    "blocked_reason_refs": { "type": "array", "items": { "type": "string" } },
    "body_free": { "const": true },
    "local_path_included": { "const": false },
    "raw_body_included": { "const": false },
    "question_text_included": { "const": false }
  },
  "additionalProperties": false
}
```

### 14.3 `p7_r54_ev_case_manifest.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ev_case_manifest.bodyfree.v1",
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
    "schema_version": { "const": "cocolon.emlis.p7_r54.ev_case_manifest.bodyfree.v1" },
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
      },
      "additionalProperties": false
    },
    "controller_manifest_rows": {
      "type": "array",
      "minItems": 24,
      "maxItems": 24,
      "items": {
        "type": "object",
        "required": ["case_ref_id", "blind_case_id", "family", "case_role"],
        "properties": {
          "case_ref_id": { "type": "string" },
          "blind_case_id": { "type": "string" },
          "family": { "type": "string" },
          "case_role": { "type": "string" }
        },
        "additionalProperties": false
      }
    },
    "reviewer_facing_case_index_rows": { "type": "array", "minItems": 24, "maxItems": 24 },
    "p4_r11_rows_mixed_in": { "const": false },
    "body_free": { "const": true }
  },
  "additionalProperties": false
}
```

### 14.4 `p7_r54_ev_reviewer_selection_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ev_reviewer_selection_row.bodyfree.v1",
  "type": "object",
  "required": [
    "schema_version",
    "review_session_id",
    "case_ref_id",
    "blind_case_id",
    "packet_ref_id",
    "reviewer_ref",
    "axis_scores",
    "verdict",
    "sanitized_reason_ids",
    "readfeel_blocker_ids",
    "execution_blocker_ids",
    "question_need_primary_class",
    "ambiguity_kind_refs",
    "one_question_fit_ref",
    "repair_required_refs",
    "plan_candidate_flags",
    "body_free",
    "reviewer_free_text_included",
    "raw_body_included",
    "question_text_included",
    "local_path_included",
    "body_hash_included"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.ev_reviewer_selection_row.bodyfree.v1" },
    "review_session_id": { "type": "string" },
    "case_ref_id": { "type": "string" },
    "blind_case_id": { "type": "string" },
    "packet_ref_id": { "type": "string" },
    "reviewer_ref": { "type": "string" },
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
    "verdict": { "enum": ["PASS", "YELLOW", "REPAIR_REQUIRED", "RED", "NOT_REVIEWABLE"] },
    "sanitized_reason_ids": { "type": "array", "items": { "type": "string" } },
    "readfeel_blocker_ids": { "type": "array", "items": { "type": "string" } },
    "execution_blocker_ids": { "type": "array", "items": { "type": "string" } },
    "question_need_primary_class": { "type": "string" },
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
      },
      "additionalProperties": false
    },
    "body_free": { "const": true },
    "reviewer_free_text_included": { "const": false },
    "raw_body_included": { "const": false },
    "question_text_included": { "const": false },
    "local_path_included": { "const": false },
    "body_hash_included": { "const": false }
  },
  "additionalProperties": false
}
```

### 14.5 `p7_r54_ev_question_need_observation_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ev_question_need_observation_row.bodyfree.v1",
  "type": "object",
  "required": [
    "schema_version",
    "review_session_id",
    "case_ref_id",
    "blind_case_id",
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
    "schema_version": { "const": "cocolon.emlis.p7_r54.ev_question_need_observation_row.bodyfree.v1" },
    "review_session_id": { "type": "string" },
    "case_ref_id": { "type": "string" },
    "blind_case_id": { "type": "string" },
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
    "ambiguity_kind_refs": {
      "type": "array",
      "items": {
        "enum": [
          "no_material_ambiguity",
          "missing_target",
          "missing_time_scope",
          "missing_emotion_intensity",
          "missing_relation_context",
          "missing_action_intention",
          "conflicting_current_and_history_signal",
          "low_information_current_input",
          "boundary_or_tier_unclear",
          "history_connection_basis_unclear",
          "self_blame_or_safety_boundary_unclear"
        ]
      }
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
    "repair_required_refs": {
      "type": "array",
      "items": {
        "enum": [
          "no_repair_required",
          "emlis_readfeel_repair_required",
          "p5_surface_repair_required",
          "gate_boundary_repair_required",
          "p4_current_surface_repair_required"
        ]
      }
    },
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
      },
      "additionalProperties": false
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

### 14.6 `p7_r54_ev_disposal_receipt.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ev_disposal_receipt.bodyfree.v1",
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
    "schema_version": { "const": "cocolon.emlis.p7_r54.ev_disposal_receipt.bodyfree.v1" },
    "review_session_id": { "type": "string" },
    "disposal_status": { "enum": ["NOT_STARTED", "PENDING", "VERIFIED", "FAILED", "ABORTED", "EXPIRED_PURGED"] },
    "body_removed": { "type": "boolean" },
    "reviewer_notes_removed": { "type": "boolean" },
    "temporary_form_removed": { "type": "boolean" },
    "local_packet_exported": { "const": false },
    "content_hash_of_body_stored": { "const": false },
    "disposal_verified": { "type": "boolean" },
    "blocked_reason_refs": { "type": "array", "items": { "type": "string" } },
    "body_free": { "const": true },
    "raw_body_included": { "const": false },
    "local_path_included": { "const": false },
    "body_hash_included": { "const": false }
  },
  "additionalProperties": false
}
```

### 14.7 `p7_r54_ev_post_review_summary.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ev_post_review_summary.bodyfree.v1",
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
    "primary_class_counts",
    "disposal_verified",
    "no_body_leak_validation_passed",
    "no_question_text_validation_passed",
    "no_touch_validation_passed",
    "p5_decision_candidate",
    "p6_limited_human_readfeel_start_allowed",
    "p8_start_allowed",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r54.ev_post_review_summary.bodyfree.v1" },
    "review_session_id": { "type": "string" },
    "required_case_count": { "const": 24 },
    "reviewed_case_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "rating_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "question_observation_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "verdict_counts": { "type": "object" },
    "axis_score_averages": { "type": "object" },
    "open_readfeel_blocker_count": { "type": "integer", "minimum": 0 },
    "open_execution_blocker_count": { "type": "integer", "minimum": 0 },
    "primary_class_counts": { "type": "object" },
    "disposal_verified": { "type": "boolean" },
    "no_body_leak_validation_passed": { "type": "boolean" },
    "no_question_text_validation_passed": { "type": "boolean" },
    "no_touch_validation_passed": { "type": "boolean" },
    "p5_decision_candidate": { "type": "string" },
    "p6_limited_human_readfeel_start_allowed": { "const": false },
    "p8_start_allowed": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true },
    "raw_body_included": { "const": false },
    "question_text_included": { "const": false }
  },
  "additionalProperties": false
}
```

### 14.8 `p7_r54_ev_r52_reintake_handoff.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ev_r52_reintake_handoff.bodyfree.v1",
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
    "schema_version": { "const": "cocolon.emlis.p7_r54.ev_r52_reintake_handoff.bodyfree.v1" },
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
  "additionalProperties": false
}
```

### 14.9 local-only private packet schema案

これは成果物・public meta・release materialへ出してはいけないprivate案です。  
実ファイル化する場合もlocal root内限定です。

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

## 15. validation / test matrix案

本書作成時点ではコード変更がないため、validation commandは実行していません。  
実装段階では、実装差分に応じて以下を実行候補にします。

### 15.1 Python syntax / import

```bash
cd mashos-api/ai
python3 -m compileall -q services/ai_inference tests
```

### 15.2 R54-OP re-entry target

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r54_actual_local_review_operation_reentry_op*.py \
  --tb=short
```

### 15.3 R54 result handoff target

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_*.py \
  --tb=short
```

### 15.4 R55 hold boundary regression

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_*.py \
  --tb=short
```

### 15.5 P4-R11 regression

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_product_readfeel_p4_r11_*.py \
  --tb=short
```

### 15.6 backend collect-only

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest --collect-only -q
```

### 15.7 RN no-touch confirmation

```bash
cd Cocolon
npm run test:rn-screens --silent
```

### 15.8 追加test候補

thin wrapperを追加する場合のみ、以下を候補にします。

```text
mashos-api/ai/tests/test_emlis_ai_p7_r54_actual_review_execution_evidence_materialization_20260626.py
```

観点:

```text
- operation_current_refsが20260626 snapshotを保持する。
- historical helper refsをactual review basisにしない。
- preflight blockedではpacket generation requestを許可しない。
- 24-case manifestがP4-R11 rowsと混ざらない。
- reviewer selection rowがraw body / question text / local path / hashを拒否する。
- question observation rowがquestion text / draft question textを拒否する。
- P5 repair required rowsをP8 material candidateに昇格しない。
- disposal未完ではR52 handoff readyにならない。
- p6_start_allowed / p8_start_allowed / release_allowedが常にfalse。
- API / DB / RN / runtime変更flagが常にfalse。
```

---

## 16. no-touch boundary

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

## 17. acceptance criteria

### 17.1 本設計書としての完了条件

```text
- 次段階がP7-R54 actual local-only human review operation実行証跡化であると固定されている。
- P8詳細設計ではないと明記されている。
- current operation refsが20260626受領snapshotへ固定されている。
- historical helper refsとoperation refsの分離が設計されている。
- local-only preflightがbody-full前の必須条件として設計されている。
- 24-case manifest distributionが固定されている。
- reviewer boundaryが固定されている。
- body-freeに残すもの / 残さないものが分けられている。
- rating / blocker / question observation / disposal / R52 handoffのschema案がある。
- json / schema案が設計書内にあり、実ファイル化していない。
- no-touch boundaryが明記されている。
- 実装順がR54-EV-00〜EV-22で整理されている。
```

### 17.2 実装後の完了条件候補

```text
- 既存helperのみで足りるか、thin wrapperが必要か判断済み。
- 必要なbody-free wrapperまたは既存helper利用が実装されている。
- code変更がある場合、該当testが追加されている。
- R54/R55/P4-R11 regressionが通る。
- compileallが通る。
- collect-onlyで破綻しない。
- RN no-touchならRN contractが維持される。
- json / schema実ファイル化した場合、body-free guardがある。
- actual review未実施ならactual_review_evidence_complete=falseを保持する。
```

### 17.3 actual review operation後の完了条件候補

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

## 18. fail-closed / blocker判断

### 18.1 preflight fail

```text
status = PREFLIGHT_BLOCKED
p5_decision_candidate = R54_OPERATION_BLOCKED_PREFLIGHT
next_required_step = local_only_preflight_repair
```

### 18.2 packet scan fail

```text
status = R54_OPERATION_BLOCKED_BODY_LEAK_OR_QUESTION_TEXT
next_required_step = packet_generation_export_boundary_repair_or_abort
```

### 18.3 review rows incomplete

```text
status = R54_OPERATION_INCONCLUSIVE
p5_decision_candidate = R54_OPERATION_INCONCLUSIVE
next_required_step = actual_review_completion_or_session_retry
```

### 18.4 RED / REPAIR_REQUIRED / YELLOW unresolved

```text
status = BODYFREE_SUMMARY_READY
p5_decision_candidate = P5_REPAIR_RETURN or P4_R12_TARGETED_CURRENT_ONLY_SURFACE_REPAIR
next_required_step = targeted_repair_decision
```

### 18.5 disposal fail

```text
status = R54_OPERATION_BLOCKED_DISPOSAL
next_required_step = purge_retry_or_abort
p6_start_allowed = false
p8_start_allowed = false
release_allowed = false
```

### 18.6 question text leak

```text
status = R54_OPERATION_BLOCKED_BODY_LEAK_OR_QUESTION_TEXT
next_required_step = question_text_leak_repair
p8_material_candidate = false
```

### 18.7 no-touch violation

```text
status = R54_OPERATION_BLOCKED_NO_TOUCH_VIOLATION
next_required_step = revert_or_repair_contract_mutation
api_changed / db_changed / rn_changed / runtime_changed = falseへ戻すまでhandoff不可
```

---

## 19. 実装時の成果物候補

実装段階で必要になった場合のみ、以下を候補にします。

### 19.1 既存helperだけで足りる場合

```text
追加production file:
  なし

追加test:
  必要に応じて既存R54-OP testsへcurrent refs / row intake観点を追加

result memo:
  mashos-api/ai/tests/Cocolon_EmlisAI_P7_R54ActualLocalReviewOperation_ExecutionEvidenceMaterialization_ImplementationResult_20260626.md
```

### 19.2 thin wrapperが必要な場合

```text
追加production file候補:
  mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_actual_review_execution_evidence_materialization_20260626.py

追加test候補:
  mashos-api/ai/tests/test_emlis_ai_p7_r54_actual_review_execution_evidence_materialization_20260626.py

result memo候補:
  mashos-api/ai/tests/Cocolon_EmlisAI_P7_R54ActualLocalReviewOperation_ExecutionEvidenceMaterialization_ImplementationResult_20260626.md
```

### 19.3 実装してはいけない成果物

```text
- local-only body-full packetを含むzip
- raw review packet md
- reviewer free textを含むresult memo
- question text案
- P8 API / DB / RN設計書
- release readiness doc
```

---

## 20. 華恋の意見

華恋の意見として、次の実装は、R54-OP helperをさらに厚くするより、**既存helperを使ってactual operation evidenceを通す薄い層**にした方がよいです。

理由は、既にOP00〜OP24という器はあります。ここでまた器を増やしすぎると、Cocolonとして本当に見たい「人間が読んだときに記録が線として返っているか」が、また後ろへ逃げます。

ただし、既存helper内部refsが今回受領snapshotより古い点は見過ごせません。  
ここを曖昧にすると、Mashが今回渡した現在のCocolonを読んだのか、過去helperが想定していたCocolonを読んだのかが混ざります。

なので、実装時の優先順位は次が安全だと思います。

```text
1. 20260626 operation_current_refsを固定する。
2. 既存R54-OP helperを可能な限り再利用する。
3. historical helper refsはregression contextとして分離する。
4. 足りない場合だけthin wrapperを追加する。
5. body-full packetはlocal-only、成果物はbody-freeだけにする。
6. P5 repair対象をP8材料へ逃がさない。
```

Cocolonとして在るべき姿を考えると、今必要なのは「質問機能を作ること」ではなく、**Cocolonが持っている記録の線が、人間に読まれたときに本当に意味を持って返っているかを見届けること**です。

この工程を通ることで、P8の問いは「Cocolonの弱さを隠す問い」ではなく、「本当に必要だった曖昧さだけを補う問い」にできます。  
それが、Cocolonを雑なAI会話アプリへ寄せないために必要な順番だと判断します。

---

## 21. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- 今回の指示は詳細設計書作成であり、実装指示ではない。
- json / schema案は設計書内に入れてよいが、実ファイル化は実装段階で判断する指示である。
- 次段階はP7-R54 Actual Local-only Human Review Operation 実行証跡化である。
- P8観測補助問い詳細設計ではない。
- R54-OP00〜OP24 helper / testsは現行backendに存在する。
- R54-OPはactual operationの器であり、actual human review実行済みではない。
- R55は R54 actual local-only human review operation required と判断している。
- R55上、rating row count / question observation row count は0、disposal verifiedはfalseである。
- P4-R11はcurrent-only surface auditであり、P5 human review evidenceではない。
- 既存R54 helper内部refsは今回受領zipより古い。
- 今回operationではoperation_current_refsを20260626 snapshot基準として分ける必要がある。
```

### 未確認

```text
- full backend suite一括green。
- 実装段階で既存helperのみで足りるか。
- thin wrapperが必要か。
- 実機submit。
- RN実機modal読感。
- 課金plan別実機確認。
- 外部ユーザーreadfeel。
- actual human reviewerによる24-case P5 Blind QA。
- body-full packet生成とpurgeの実運用。
- actual sanitized rating rows。
- actual question need observation rows。
- actual disposal receipt。
- actual R52 re-intake handoff。
```

### 書かれていない

```text
- R54-OP helper実装完了だけでactual human review完了としてよい、とは書かれていない。
- P4-R11 greenだけでP5 human review evidenceとしてよい、とは書かれていない。
- P4-R11 greenだけでP8へ進んでよい、とは書かれていない。
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
2. 実装段階に入る場合、既存R54-OP helperだけで20260626 operation_current_refsとactual evidence handoffを扱えるか先に確認する。
3. 既存helperで足りない場合だけ、薄いoperation wrapperを追加する。
4. local-only preflight / explicit allow / purge plan / export denylist / retentionを最初に実装・確認する。
5. body-full packet生成はlocal-onlyで行い、成果物には出さない。
6. reviewer boundaryを固定し、華恋の内部読解をhuman review完了に変換しない。
7. actual review後、rating / blocker / question observation / disposal / R52 re-intakeをbody-freeで残す。
8. P8観測補助問い詳細設計は、actual question need observation rowsとR52 re-intake判断が揃うまで開始しない。
```

---

## 22. 最終判断

本設計の結論は次です。

```text
次実装候補:
  P7-R54 Actual Local-only Human Review Operation 実行証跡化

実装の中心:
  20260626 operation_current_refs再固定
  existing R54-OP helper capability確認
  local-only preflight
  24-case actual review operation evidence
  body-free rating / blocker / question observation / disposal / R52 handoff

実装しないもの:
  P8 question design
  API / DB / RN / runtime差分
  release判断
```

Cocolonとして在るべき姿に照らすと、ここで必要なのは「質問機能を作ること」ではなく、**ユーザーの記録が、本当に読まれた形として返っているかを見届けること**です。  
R54 actual local-only human review operation実行証跡化は、そのための工程です。
