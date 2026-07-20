---
title: "Cocolon / EmlisAI P7-R54-AHR Post-DHB DHR-OP05 Manual Call / Existing Preflight Scan Execution Consideration 詳細設計書・実装順"
created_at: "2026-07-09 JST"
author: "華恋"
work_mode: "共鳴構造モード"
work_type: "詳細設計書 / 実装順 / json・schema案内包"
source_mode: "local_received_zip_only"
github_connection_check: "Mash様指示により不要 / 未実施"
base_pre_design_memo: "Cocolon_EmlisAI_P7_R54AHR_PostDHB_DHROP05ManualCallExecutionConsideration_PreDesignMemo_20260709.md"
selected_roadmap_phase: "P7 Product Quality Runner / Long-run Product Gate 継続"
selected_design_target: "P7-R54-AHR Post-DHB DHR-OP05 Manual Call / Existing DHR-OP05 Preflight Scan Execution Consideration"
recommended_boundary_prefix: "DHC-OP00〜DHC-OP08"
recommended_prefix_meaning: "DHC = DHR-OP05 Manual Call Consideration / Existing Preflight Scan Boundary"
artifact_scope: "md design only"
code_change: "none"
test_change: "none"
json_schema_file_creation: "none"
api_change: "none"
db_change: "none"
rn_change: "none"
runtime_change: "none"
response_key_change: "none"
dhb_reexecution: "none"
dhr_op04_builder_call: "none in design / future implementation must not use implicit fallback"
dhr_op05_call: "none in design / future implementation only inside DHC-OP04 when explicit permission is satisfied"
dhr_op05_builder_call: "none in design / future implementation only inside DHC-OP04 when explicit permission is satisfied"
dhr_op06_call: "none"
dhr_op07_materialization: "none"
dmd_execution: "none"
r52_actual_execution: "none"
actual_review_start: "none"
actual_rows_creation: "none"
question_need_observation_rows_creation: "none"
p8_start: "none"
p8_question_design: "none"
question_text_materialization: "none"
p7_complete: "none"
release_decision: "none"
current_expected_next_required_step_after_design: "implement_DHC_controlled_manual_call_boundary_only_after_explicit_implementation_instruction_then_stop_before_DHR_OP06"
---

# Cocolon / EmlisAI P7-R54-AHR Post-DHB DHR-OP05 Manual Call / Existing Preflight Scan Execution Consideration 詳細設計書・実装順

対象: Cocolon / EmlisAI / P7 Product Quality Runner / R54-AHR / Post-DHB / DHR-OP05 manual call / existing DHR-OP05 preflight scan execution consideration  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
実装扱い: 本書は設計書です。コード変更、テスト変更、json/schema実ファイル化、DHB再実行、DHR-OP05呼び出し、DHR-OP05 builder呼び出し、DHR-OP06以降、DMD/R52、actual review、actual rows、question need observation rows、P8問いシステム、API/DB/RN/runtime/response key変更、P7完了、release判断は行いません。  
json / schema実ファイル化: なし。本書内の案のみです。実ファイル化は実装段階で、既存helper、既存schema配置、既存guard、既存test結果を確認して判断します。  
GitHub接続確認: Mash様指定により不要。ローカル受領zip基準。  

---

## 0. 結論

今回の詳細設計対象は、次で固定します。

```text
P7-R54-AHR Post-DHB
DHR-OP05 Manual Call / Existing DHR-OP05 Preflight Scan Execution Consideration
```

推奨する境界prefixは次です。

```text
DHC-OP00〜DHC-OP08
DHC = DHR-OP05 Manual Call Consideration / Existing Preflight Scan Boundary
```

DHCの責務は、DHBが閉じたmanual handoff boundaryを、DHR-OP05実行済み・P8開始準備完了・release判断へ読み替えないまま、既存DHR-OP05 preflight scanを**手動で呼ぶ条件**と、呼んだ後の**停止境界**を実装可能な形に固定することです。

DHCが到達してよい状態は次だけです。

```text
1. explicit DHB-OP08 closed DHR handoff material が存在し、DHR-OP05 laneであることを確認して止まる。
2. explicit DHR-OP04 actual source claim separation が存在し、既存DHR-OP05 builder inputとして妥当かを確認して止まる。
3. manual call permission が満たされた場合だけ、既存DHR-OP05 preflight scan builderをDHC-OP04内で1回だけ呼ぶ候補を作る。
4. 既存DHR-OP05 preflight scan resultを scan clear / waiting-or-incomplete / repair-required / not-called / blocked に分類して止まる。
5. どの結果でも DHR-OP06 / DHR-OP07 / DMD / R52 / actual review / P8 / release へ自動昇格しない。
```

DHCで最も重要な固定は、次です。

```text
DHB handoff envelope
  ≠ DHR-OP04 actual source claim separation
  ≠ DHR-OP05 execution result
  ≠ DHR-OP06 permission

explicit DHR-OP04 actual source claim separation がない場合、
existing DHR-OP05 builder を None input で呼ばない。
```

既存DHR-OP05 builderは、`actual_source_claim_separation` / `op04_actual_source_claim_separation` を受け取れる一方、未指定時には内部でDHR-OP04相当のdefault materialを作る構造です。DHCでは、この暗黙fallbackを使いません。  
理由は、DHBが作ったhandoff envelopeをOP04 actual source claimに見せかけること、またはOP04欠落をbuilder内部のdefault生成で隠すことが、Cocolonが避けるべき「読めたふり」に当たるためです。

---

## 1. なぜこの設計を行うのか

Cocolon / EmlisAIで守るべき核は、ユーザーの言葉を雑に処理しないことです。これは返答生成だけではなく、開発工程にも適用されます。

DHBは、DHR-OP05へ渡せる可能性のあるmanual handoff boundaryを閉じました。  
しかし、DHBはDHR-OP05を呼んでいません。  
既存DHR-OP05 builderも呼んでいません。  
P8も始まっていません。

ここでDHB closureを「DHR-OP05実行済み」「P8へ行ける」と読むと、開発工程が足りない材料を補完して、分かったふりで前進します。これは、EmlisAIがユーザー入力に対して避けようとしている挙動そのものです。

DHCは、DHR-OP05へ進むための境界ではありますが、主眼は「進めること」ではありません。  
主眼は、**DHR-OP05を呼べる条件を雑にしないこと**です。

---

## 2. 参照・確認範囲

### 2.1 ローカル受領zip / file

本設計の基準は、今回ローカルで受領した次の材料です。

```text
/mnt/data/Cocolon_前提資料(302).zip
/mnt/data/EmlisAIの実装済み資料(105).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_system_update_20260706(5).zip
/mnt/data/Cocolon(277).zip
/mnt/data/mashos-api(193).zip
/mnt/data/Cocolon_EmlisAI_P7_R54AHR_PostDHB_DHROP05ManualCallExecutionConsideration_PreDesignMemo_20260709.md
```

GitHub接続確認は、Mash様指定により行いません。

### 2.2 必読前提・作業姿勢

本設計では、次を確認済み前提として扱います。

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/manifest.json
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md
```

固定する作業姿勢は次です。

```text
- 見ていないものを見たと言わない。
- 設計と実装を混ぜない。
- 前提資料だけで理解したふりをせず、実ファイル・contract・result memoも見る。
- target / regression / compileall greenをrelease readinessへ変換しない。
- DHB closureをDHR-OP05 execution permissionへ変換しない。
- DHB handoff envelopeをDHR-OP04 actual source claim separationへ変換しない。
- P8問いシステムをP7内で実装しない。
- Emlis本体の未完了境界を、問いシステムや質問UIで隠さない。
- public contract / DB / RN / response keyを指示なく変えない。
- raw body / comment_text / question_text / reviewer free text / local path / hash / stdout / stderr / tracebackをresult memoへ持ち込まない。
```

### 2.3 直接接続する既存設計資料

```text
EmlisAIの実装済み資料/
  Cocolon_EmlisAI_P7_R54AHR_PostPCM_DHROP05ManualHandoffBoundary_DetailedDesign_ImplementationOrder_20260708.md
  Cocolon_EmlisAI_P7_R54AHR_PostPNT_ClosedMaterialNextBoundaryConfirmation_DetailedDesign_ImplementationOrder_20260707.md
  Cocolon_EmlisAI_P7_R54AHR_PostNCI_SelectedHandoffOrStopDecisionTriage_NextBoundarySelection_DetailedDesign_ImplementationOrder_20260707.md
  Cocolon_EmlisAI_P7_R54AHR_PostELR19_DownstreamManualDecision_HandoffOrRetry_DetailedDesign_ImplementationOrder_20260704.md
```

### 2.4 直接接続する既存実ファイル

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_20260708.py
  emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py
  emlis_ai_p7_r54_ahr_post_pnt_closed_material_next_boundary_confirmation_20260707.py
  emlis_ai_p7_contracts.py
```

既存DHR-OP05の実体は、Post-ELR19 helper内の次です。

```text
builder:
  build_p7_r54_ahr_post_elr19_dhr_op05_bodyfree_leak_promotion_claim_dmd_compatibility_preflight_scan

assert:
  assert_p7_r54_ahr_post_elr19_dhr_op05_bodyfree_leak_promotion_claim_dmd_compatibility_preflight_scan_contract

accepted parameters:
  actual_source_claim_separation: Mapping[str, Any] | None = None
  op04_actual_source_claim_separation: Mapping[str, Any] | None = None
  additional_bodyfree_materials: Sequence[Mapping[str, Any]] | None = None
  review_session_id: Any = None
```

DHC実装段階では、このbuilderを**DHC-OP04以外では呼びません**。  
また、DHC-OP04でも `actual_source_claim_separation` / `op04_actual_source_claim_separation` が明示的に存在しない場合は呼びません。

### 2.5 直接接続する既存result memo

```text
mashos-api/ai/tests/
  R54_AHR_PostPCM_DHROP05ManualHandoffBoundary_DHB_R7_TargetValidation_Result_20260708.md
  R54_AHR_PostPCM_DHROP05ManualHandoffBoundary_DHB_R8_SelectedRegression_Result_20260708.md
  R54_AHR_PostPCM_DHROP05ManualHandoffBoundary_DHB_R9_Compileall_Result_20260708.md
  R54_AHR_PostPCM_DHROP05ManualHandoffBoundary_DHB_R10_ResultMemoClosure_20260708.md
  R54_AHR_PostPCM_DHROP05ManualHandoffBoundary_DHB_R11_NextWorkDecision_20260708.md
  R54_AHR_PostELR19_DownstreamManualDecision_HandoffOrRetry_DHR_OP00_OP05_Result_20260704.md
  R54_AHR_PostELR19_DownstreamManualDecision_HandoffOrRetry_DHR_OP00_OP07_Result_20260704.md
  R54_AHR_PostELR19_DownstreamManualDecision_HandoffOrRetry_DHR_OP00_OP09_Result_20260704.md
```

---

## 3. 現在地の固定

### 3.1 確認済み

```text
- 現在PhaseはP7 Product Quality Runner / Long-run Product Gate継続。
- ロードマップ上、P7では問いシステムを実装しない。
- P7/P8 Bridgeでは、問いシステム必要性をbody-free materialとして観察するに留める。
- P8では、問いシステムをEmlisAI core quality gateとP8問いUXに分けて詳細設計する。
- DHB-OP00〜DHB-OP08は実装済み・target validated。
- DHB R11は、DHR-OP05 / existing DHR-OP05 builder / DHR-OP06 / DHR-OP07 / DMD / R52 / P8 / releaseを未実行・未開始としている。
- 既存Post-ELR19 helperには、DHR-OP04 actual source claim separation builder / assert、およびDHR-OP05 preflight scan builder / assertが存在する。
- 既存DHR-OP05 builderは、scan clear / repair required / waiting or incomplete の3 statusを持つ。
- 既存DHR-OP05 clearでも、DMD direct callは許可されず、DHR-OP06以降は別工程である。
```

### 3.2 この設計書作成中に行っていないこと

```text
- GitHub main同期確認
- 新規test実行
- DHB target validation再実行
- selected regression再実行
- compileall再実行
- DHR-OP05 builder call
- DHR-OP06 call
- DHR-OP07 materialization
- DMD / R52 execution
- actual review start
- actual rows creation
- P8問いシステム設計 / 実装
```

---

## 4. 既存DHBと既存DHR-OP05の読み方

### 4.1 DHBの役割

DHBは次を行いました。

```text
- explicit PCM-OP08 materialだけを受ける。
- DHR-OP05 lane exact confirmationを行う。
- DHR-OP05 manual handoff envelopeを作る。
- existing DHR-OP05 compatibility crosswalkを記録する。
- body-free no-touch no-promotion no-auto-execution guardを通す。
- result memo draft / closure materialを作る。
```

DHBは次を行っていません。

```text
- DHR-OP05 call
- existing DHR-OP05 builder call
- DHR-OP06 call
- DHR-OP07 materialization
- DMD / R52 execution
- actual review start
- actual rows creation
- question need observation rows creation
- P8 question design / implementation
- API / DB / RN / runtime / response key change
- P7 complete
- release decision
```

### 4.2 DHR-OP04の既存契約

既存DHR-OP04は、DHR-OP03で抽出したDMD-compatible receipt candidateと、任意のexternal actual operation evidence claimを分けます。

重要な既存statusは次です。

```text
DHR_ACTUAL_SOURCE_CLAIM_CONFIRMED_BODYFREE
DHR_ACTUAL_SOURCE_CLAIM_NOT_CONFIRMED_RETRY_OR_START_REQUIRED
DHR_ACTUAL_SOURCE_INVALID_REPAIR_REQUIRED
DHR_ACTUAL_SOURCE_WAITING_FOR_EXTERNAL_BODYFREE_CLAIM
```

DHCで重要なのは、DHR-OP04が「receipt shape valid」をそのままactual sourceに昇格しないことです。  
actual source claim confirmationには、body-freeで、source_kindが妥当で、helper green / target green / result memo green / fixture / historical reuse / candidate shape promotionではない明示claimが必要です。

### 4.3 DHR-OP05の既存契約

既存DHR-OP05は、DHR-OP04 actual source claim separationを受け、body-free leak / promotion claim / invalid source kind / DMD compatibilityをpreflight scanします。

重要な既存statusは次です。

```text
DHR_PREFLIGHT_SCAN_CLEAR_BODYFREE
DHR_PREFLIGHT_SCAN_REPAIR_REQUIRED
DHR_PREFLIGHT_SCAN_WAITING_OR_INCOMPLETE
```

重要な既存固定は次です。

```text
- preflight scan clear でも DMD direct call safe ではない。
- dmh_op18_finalizer fake generation は許可されない。
- dmd_handoff_plan_candidate_allowed は、scan clear + explicit actual source confirmed の場合だけtrueになる。
- next_required_step が DHR-OP06 を示す場合でも、それはDHC内でDHR-OP06を呼ぶ許可ではない。
- DHR-OP05は final branch resolver ではない。
```

### 4.4 DHCで採用する読み方

DHCでは、次を厳守します。

```text
DHB-OP08 closed material:
  DHR-OP05 manual callを検討する入口材料。
  DHR-OP05 builder inputではない。

DHB-OP04 handoff envelope:
  DHR-OP05 preflight reentry candidateの説明材料。
  DHR-OP04 actual source claim separationではない。

DHB-OP05 compatibility crosswalk:
  existing builder / assert / schema / status refの互換情報。
  existing builder executionではない。

explicit DHR-OP04 actual source claim separation:
  existing DHR-OP05 builderに渡せる可能性がある唯一の主要input。
  ただし、contract valid / body-free / no-promotion / ready_for_preflight_scan確認が必要。
```

---

## 5. 設計方針

### 5.1 方針A: DHCはDHBを再実装しない

DHCは、DHBの結果を再構築しません。  
DHCは、DHB-OP08 closure / DHB-OP04 envelope / DHB-OP05 crosswalkが明示的に渡された場合だけ参照します。

禁止します。

```text
- DHC内でPCM builderを呼ぶ。
- DHC内でDHB builder chainを呼んでDHB materialを合成する。
- DHB R11 memoだけからDHB-OP08 closed materialを作ったことにする。
- target green / regression green / compileall greenからDHR-OP05 laneを推定する。
```

### 5.2 方針B: DHCはDHR-OP04を暗黙生成しない

DHC実装では、既存DHR-OP05 builderを呼ぶ場合でも、必ず明示的な `actual_source_claim_separation` を渡します。

禁止します。

```text
existing_dhr_op05_builder(
  actual_source_claim_separation=None,
  op04_actual_source_claim_separation=None,
)
```

理由は、既存DHR-OP05 builderがNone時に内部でDHR-OP04相当を作れるとしても、それはDHCが確認すべきactual source claim separation欠落を隠してしまうためです。

### 5.3 方針C: builder callはDHC-OP04だけ

DHCの将来実装で既存DHR-OP05 builderを呼ぶ場所は、DHC-OP04だけに限定します。

```text
DHC-OP00〜OP03:
  call permissionを作るだけ。builder callなし。

DHC-OP04:
  permissionがallowの時だけ existing DHR-OP05 builderを1回だけ呼ぶ。

DHC-OP05〜OP08:
  result分類 / guard / memo closureのみ。builder再呼び出しなし。
```

### 5.4 方針D: DHR-OP06以降へ自動昇格しない

既存DHR-OP05 resultの `next_required_step` がDHR-OP06を示しても、DHCはDHR-OP06を呼びません。

DHCでは次を分けます。

```text
existing_dhr_op05_next_required_step:
  既存DHR-OP05 result内の案内値。

dhc_next_required_step:
  DHCとしての停止・次候補。
```

### 5.5 方針E: result memoはbody-free / count-only

DHC result memo / test result memoには、次を持ち込みません。

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
question_answer_body
local_path
absolute_path
hash
sha256
stdout
stderr
traceback
```

---

## 6. DHC-OP00〜DHC-OP08 詳細設計

### 6.1 DHC-OP00: Post-DHB scope no-execution refreeze

目的:

```text
Post-DHBの現在地を再凍結し、DHB closureをDHR-OP05 execution permissionへ変換しないことを固定する。
```

input:

```text
なし、または review_session_id のみ。
```

output主要field案:

```text
schema_version
operation_step_ref = DHC-OP00_scope_no_execution_refreeze_after_DHB_R11
source_mode = local_received_zip_only
git_connection_required = false
git_checked = false
selected_stage_ref
selected_design_target_ref
boundary_prefix_ref = DHC
current_execution_allowance_ref = none_until_DHC_OP03_permission_gate
DHB closure is not DHR-OP05 execution
DHB closure is not P8 start
DHB target green is not release readiness
body_free = true
next_required_step = DHC-OP01_explicit_DHB_OP08_closed_handoff_material_intake
```

status案:

```text
DHC_STATUS_SCOPE_REFROZEN_STOPPED
DHC_STATUS_SCOPE_REPAIR_REQUIRED
DHC_STATUS_SCOPE_BLOCKED_PROMOTION_OR_AUTORUN
```

禁止:

```text
- DHB builder call
- DHR-OP05 builder call
- DHR-OP06 call
- P8 / release promotion
```

### 6.2 DHC-OP01: explicit DHB-OP08 closed handoff material intake

目的:

```text
DHB-OP08 closure materialが明示的に渡されたかを確認する。
DHB materialを合成しない。
```

input:

```text
op00_scope_refreeze
explicit_dhb_op08_bodyfree_closure_material
```

受理条件:

```text
- mappingである。
- schema_version が DHB-OP08 schema version と一致する。
- operation_step_ref が DHB-OP08 step ref と一致する。
- body_free is true。
- git_checked is false。
- dhr_op05_called_here is false。
- existing_dhr_op05_builder_called_here is false。
- dhr_op06_called_here is false。
- p8_question_design_started is false。
- release_allowed is false。
```

status案:

```text
DHC_STATUS_DHB_OP08_DHR_HANDOFF_CLOSED_INTAKE_READY
DHC_STATUS_DHB_OP08_NOT_DHR_LANE_ROUTE_PRESERVED_STOPPED
DHC_STATUS_WAITING_FOR_EXPLICIT_DHB_OP08_CLOSED_MATERIAL
DHC_STATUS_REPAIR_REQUIRED_FOR_DHB_OP08_INTAKE
DHC_STATUS_BLOCKED_DHB_OP08_BODY_LEAK_PROMOTION_OR_AUTORUN
```

next:

```text
DHR lane closed:
  DHC-OP02 existing DHR-OP05 builder input eligibility check

non-DHR lane:
  DHC-OP08 closure / route preserved stop

missing / waiting / repair / blocked:
  DHC-OP08 closure / no call stop
```

### 6.3 DHC-OP02: existing DHR-OP05 builder input eligibility check

目的:

```text
DHB envelopeと、既存DHR-OP05 builderが期待するDHR-OP04 actual source claim separationを混同しない。
```

input:

```text
op01_dhb_op08_intake
explicit_dhr_op04_actual_source_claim_separation
optional_dhb_op04_manual_handoff_envelope
optional_dhb_op05_compatibility_crosswalk
```

重要方針:

```text
DHC-OP02はDHR-OP04 builderを呼ばない。
DHC-OP02は、渡されたexplicit DHR-OP04 materialに対して既存DHR-OP04 assertを実行する候補に留める。
DHC-OP02は、DHB-OP04 handoff envelopeをDHR-OP04 materialへ変換しない。
```

eligibility条件:

```text
- OP01がDHR lane closed intake readyである。
- explicit_dhr_op04_actual_source_claim_separation がmappingである。
- schema_version が existing DHR-OP04 schema version と一致する。
- operation_step_ref が DHR-OP04 actual source claim separation step ref と一致する。
- body_free is true。
- dhr_op04_ready_for_bodyfree_leak_promotion_claim_preflight_scan is true。
- existing DHR-OP04 assert contract が通る。
- helper_green / target_green / result_memo_green / fixture / historical_reuse / candidate_shape promotion がない。
- actual_operation_receipt_created_by_helper_here is false。
- actual_rows_created_by_helper_here is false。
```

status案:

```text
DHC_STATUS_DHR_OP05_BUILDER_INPUT_ELIGIBLE_EXPLICIT_OP04
DHC_STATUS_WAITING_FOR_EXPLICIT_DHR_OP04_ACTUAL_SOURCE_CLAIM_SEPARATION
DHC_STATUS_DHR_OP04_CONTRACT_REPAIR_REQUIRED
DHC_STATUS_DHB_ENVELOPE_ONLY_NOT_BUILDER_INPUT_STOPPED
DHC_STATUS_BLOCKED_DHR_OP04_INPUT_BODY_LEAK_PROMOTION_OR_AUTORUN
```

next:

```text
eligible:
  DHC-OP03 manual call permission gate

waiting / repair / envelope-only / blocked:
  DHC-OP08 closure / no call stop
```

### 6.4 DHC-OP03: manual call permission gate

目的:

```text
DHR-OP05 builderを呼んでよいかを、明示条件として最終判定する。
```

input:

```text
op02_input_eligibility
manual_call_requested
manual_call_request_ref
allow_existing_dhr_op05_builder_call
allow_implicit_op04_builder_fallback
```

permission条件:

```text
- op02 status が DHC_STATUS_DHR_OP05_BUILDER_INPUT_ELIGIBLE_EXPLICIT_OP04。
- manual_call_requested is true。
- manual_call_request_ref が空でない。
- allow_existing_dhr_op05_builder_call is true。
- allow_implicit_op04_builder_fallback is false。
- no-touch / no-promotion / body-free scanが通る。
- DHR-OP06 / DHR-OP07 / DMD / R52 / P8 / release / API/DB/RN/runtime/response key flags がすべてfalse。
```

status案:

```text
DHC_STATUS_MANUAL_CALL_ALLOWED_EXPLICIT_OP04_ONLY
DHC_STATUS_MANUAL_CALL_NOT_REQUESTED_STOPPED
DHC_STATUS_WAITING_FOR_EXPLICIT_MANUAL_CALL_REQUEST
DHC_STATUS_WAITING_FOR_EXPLICIT_DHR_OP04_ACTUAL_SOURCE_CLAIM_SEPARATION
DHC_STATUS_REPAIR_REQUIRED_FOR_MANUAL_CALL_PERMISSION_INPUTS
DHC_STATUS_BLOCKED_MANUAL_CALL_PROMOTION_OR_AUTORUN
```

重要field案:

```text
manual_call_allowed
existing_dhr_op05_builder_call_allowed_here
implicit_op04_builder_fallback_allowed_here = false
existing_dhr_op05_builder_called_here = false
existing_dhr_op05_result_generated_here = false
selected_pcm_next_boundary_execution_allowed_here = false
dhr_op06_call_allowed_here = false
dmd_r52_execution_allowed_here = false
p8_question_design_allowed_here = false
release_decision_allowed_here = false
next_required_step
```

### 6.5 DHC-OP04: existing DHR-OP05 preflight scan manual call boundary

目的:

```text
DHC-OP03でpermissionが明示的にallowになった場合だけ、既存DHR-OP05 preflight scan builderを1回呼ぶ。
```

実装段階でのcall案:

```python
existing_dhr_op05_result = dhr.build_p7_r54_ahr_post_elr19_dhr_op05_bodyfree_leak_promotion_claim_dmd_compatibility_preflight_scan(
    actual_source_claim_separation=explicit_dhr_op04_actual_source_claim_separation,
    additional_bodyfree_materials=[sanitized_dhc_manual_call_context_material],
    review_session_id=review_session_id,
)
dhr.assert_p7_r54_ahr_post_elr19_dhr_op05_bodyfree_leak_promotion_claim_dmd_compatibility_preflight_scan_contract(existing_dhr_op05_result)
```

呼ばない条件:

```text
- op03 manual_call_allowed is not true。
- explicit DHR-OP04 materialがない。
- DHR-OP04 contract invalid。
- allow_implicit_op04_builder_fallback is true / missing / not false。
- body-like payload / promotion claim / no-touch mutationがある。
- manual_call_requested is false。
- DHR-OP06以降の自動実行claimがある。
```

call失敗時の扱い:

```text
- traceback / stdout / stderr / raw exception message は持ち込まない。
- exception type ref / contract failure category ref / safe blocker ref だけをbody-freeで持つ。
- existing_dhr_op05_builder_called_here は、call attemptが実際にあった場合だけtrue。
- existing_dhr_op05_result_present は false。
- DHC statusは repair-required stopped。
```

status案:

```text
DHC_STATUS_EXISTING_DHR_OP05_PREFLIGHT_SCAN_CALLED_BODYFREE
DHC_STATUS_EXISTING_DHR_OP05_PREFLIGHT_SCAN_NOT_CALLED_STOPPED
DHC_STATUS_EXISTING_DHR_OP05_PREFLIGHT_SCAN_CALL_REPAIR_REQUIRED
DHC_STATUS_EXISTING_DHR_OP05_PREFLIGHT_SCAN_CALL_BLOCKED_PROMOTION_OR_AUTORUN
```

重要field案:

```text
existing_dhr_op05_builder_ref
existing_dhr_op05_assert_ref
existing_dhr_op05_builder_call_allowed_here
existing_dhr_op05_builder_called_here
existing_dhr_op05_result_present
existing_dhr_op05_contract_valid
existing_dhr_op05_status_ref
existing_dhr_op05_preflight_scan_passed
existing_dhr_op05_preflight_repair_required
existing_dhr_op05_preflight_waiting_or_incomplete
existing_dhr_op05_next_required_step
implicit_op04_builder_fallback_used_here = false
implicit_op04_builder_fallback_allowed_here = false
dhr_op06_called_here = false
dmd_execution_started_here = false
p8_question_design_started = false
release_allowed = false
```

### 6.6 DHC-OP05: DHR-OP05 result classification

目的:

```text
既存DHR-OP05 resultをDHC側の停止結果へ分類する。
```

分類表:

| existing DHR-OP05 status | DHC classification | DHC扱い | next candidate |
|---|---|---|---|
| `DHR_PREFLIGHT_SCAN_CLEAR_BODYFREE` | `DHC_RESULT_SCAN_CLEAR_STOPPED` | DHR-OP05 resultを記録して止まる | DHR-OP06 branch resolver consideration / P7 readfeel reconnection decision, 別設計 |
| `DHR_PREFLIGHT_SCAN_WAITING_OR_INCOMPLETE` | `DHC_RESULT_WAITING_OR_INCOMPLETE_STOPPED` | actual source claim不足または未完了として止まる | explicit actual source claim reintake / repair decision, 別設計 |
| `DHR_PREFLIGHT_SCAN_REPAIR_REQUIRED` | `DHC_RESULT_REPAIR_REQUIRED_STOPPED` | body-free leak / promotion / invalid source等として止まる | repair boundary, 別設計 |
| no call | `DHC_RESULT_NOT_CALLED_STOPPED` | call条件未達として止まる | explicit OP04 material collection / manual call request, 別指示 |
| blocked | `DHC_RESULT_BLOCKED_STOPPED` | promotion / autorun / no-touch違反として止まる | repair / stop |

重要固定:

```text
existing_dhr_op05_next_required_step が DHR-OP06 でも、DHCはDHR-OP06を呼ばない。
DHC-OP05は、existing resultをDHR-OP06 permissionへ変換しない。
```

### 6.7 DHC-OP06: no-touch / no-promotion / no-auto-downstream guard

目的:

```text
DHC-OP04で既存DHR-OP05 builderが呼ばれた場合でも、DHR-OP06以降・DMD/R52・P8・releaseへ自動昇格しないことを機械的に固定する。
```

guard対象:

```text
dhr_op06_called_here
dhr_op07_materialized_here
dmd_execution_started_here
dmd_r52_executed_here
r52_actual_execution_started_here
actual_review_started_here
actual_rows_created_here
question_need_observation_rows_created_here
p8_question_design_started
p8_question_implementation_started
question_text_materialized_here
api_db_rn_runtime_response_key_changed
p7_complete
release_allowed
full_backend_suite_green_claimed_here
rn_contract_green_claimed_here
rn_real_device_modal_verified_claimed_here
```

status案:

```text
DHC_STATUS_NO_TOUCH_NO_PROMOTION_NO_AUTO_DOWNSTREAM_GUARD_PASSED
DHC_STATUS_REPAIR_REQUIRED_FOR_NO_TOUCH_GUARD_INPUTS
DHC_STATUS_BLOCKED_NO_TOUCH_NO_PROMOTION_NO_AUTO_DOWNSTREAM_GUARD
```

### 6.8 DHC-OP07: validation plan / result memo draft material

目的:

```text
実装時のtarget validation / selected regression / compileall / result memo候補をbody-freeで固定する。
```

outputに含めるもの:

```text
- target_test_ref_refs
- selected_regression_test_ref_refs
- compileall_target_ref_refs
- result_memo_expected_file_refs
- expected_validation_command_summary_refs
- no raw output policy
- full_backend_suite / RN contract / real-device unconfirmed policy
```

含めないもの:

```text
- pytest stdout全文
- stderr全文
- traceback
- raw body
- comment_text
- question_text
- local path / hash / sha256
```

### 6.9 DHC-OP08: result memo closure / stopped next-work candidate

目的:

```text
DHC-OP00〜OP07の結果をbody-freeで閉じ、次候補を記録して止まる。
```

status案:

```text
DHC_OP08_SCAN_CLEAR_CLOSED_STOPPED
DHC_OP08_WAITING_OR_INCOMPLETE_CLOSED_STOPPED
DHC_OP08_REPAIR_REQUIRED_CLOSED_STOPPED
DHC_OP08_NOT_CALLED_CLOSED_STOPPED
DHC_OP08_NON_DHR_LANE_ROUTE_PRESERVED_STOPPED
DHC_OP08_BLOCKED_BODYFREE_LEAK_PROMOTION_OR_AUTORUN
```

next_work_candidate_ref案:

```text
scan clear:
  consider_DHR_OP06_branch_resolver_or_P7_readfeel_reconnection_boundary_without_auto_execution

waiting-or-incomplete:
  collect_or_repair_explicit_DHR_OP04_actual_source_claim_separation_without_P8_promotion

repair-required:
  repair_bodyfree_leak_promotion_or_invalid_source_before_any_DHR_OP06_consideration

not-called:
  wait_for_explicit_manual_call_request_and_explicit_DHR_OP04_material

non-DHR lane:
  preserve_lane_specific_route_from_DHB_without_DHR_OP05_call

blocked:
  stop_and_repair_no_touch_no_promotion_violation
```

---

## 7. 手動call許可マトリクス

| 条件 | DHR-OP05 builder call | DHC status | 理由 |
|---|---:|---|---|
| DHB-OP08 materialなし | no | waiting | handoff入口がない |
| DHB-OP08はあるがnon-DHR lane | no | route preserved | DHR-OP05 laneではない |
| DHB-OP08はDHR laneだがDHR-OP04 materialなし | no | waiting | builder inputがない |
| DHB envelopeだけある | no | envelope-only stopped | envelopeはOP04 actual source claimではない |
| DHR-OP04 materialはあるがcontract invalid | no | repair | input妥当性なし |
| DHR-OP04 materialがexplicitでcontract valid、manual_call_requestedなし | no | waiting | 手動call要求なし |
| explicit OP04 valid + manual_call_requested + allow_builder_call true + implicit fallback false | yes, DHC-OP04 only | called bodyfree | call条件が揃った |
| builder/assert exception | attempted only | repair | result contract確定不可 |
| builder result scan clear | no further call | scan clear stopped | DHR-OP06は別設計 |
| builder result waiting | no further call | waiting stopped | actual source未完了等 |
| builder result repair | no further call | repair stopped | leak / promotion / invalid source等 |

---

## 8. json / schema案

本章は、実装時に使う可能性があるjson / schema案です。  
**この設計段階では実ファイル化しません。**  
実ファイル化は実装段階で、既存schema配置・既存guard・既存test結果を確認して判断します。

### 8.1 schema案: DHC manual call input

```json
{
  "$id": "cocolon.emlis.p7_r54.ahr.post_dhb.dhc.manual_call_input.bodyfree.v1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "source_mode",
    "git_connection_required",
    "git_checked",
    "explicit_dhb_op08_bodyfree_closure_material",
    "manual_call_requested",
    "allow_existing_dhr_op05_builder_call",
    "allow_implicit_op04_builder_fallback",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dhb.dhc.manual_call_input.bodyfree.v1"
    },
    "review_session_id": { "type": "string", "minLength": 1 },
    "source_mode": { "const": "local_received_zip_only" },
    "git_connection_required": { "const": false },
    "git_checked": { "const": false },
    "explicit_dhb_op08_bodyfree_closure_material": {
      "type": ["object", "null"],
      "description": "DHB-OP08 closure material. nullの場合はwaiting。DHC内で合成しない。"
    },
    "explicit_dhr_op04_actual_source_claim_separation": {
      "type": ["object", "null"],
      "description": "existing DHR-OP05 builderに渡す唯一の主要input候補。DHB envelopeで代替しない。"
    },
    "optional_dhb_op04_manual_handoff_envelope": {
      "type": ["object", "null"],
      "description": "参照用。builder inputへ変換しない。"
    },
    "optional_dhb_op05_compatibility_crosswalk": {
      "type": ["object", "null"],
      "description": "参照用。builder execution済みとは扱わない。"
    },
    "manual_call_requested": { "type": "boolean" },
    "manual_call_request_ref": { "type": "string" },
    "allow_existing_dhr_op05_builder_call": { "type": "boolean" },
    "allow_implicit_op04_builder_fallback": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 8.2 schema案: DHC permission gate output

```json
{
  "$id": "cocolon.emlis.p7_r54.ahr.post_dhb.dhc.op03_manual_call_permission.bodyfree.v1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "dhc_op03_status_ref",
    "manual_call_allowed",
    "existing_dhr_op05_builder_call_allowed_here",
    "existing_dhr_op05_builder_called_here",
    "implicit_op04_builder_fallback_allowed_here",
    "explicit_dhr_op04_material_present",
    "explicit_dhr_op04_contract_valid",
    "dhr_op06_call_allowed_here",
    "dmd_r52_execution_allowed_here",
    "p8_question_design_started",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dhb.dhc.op03_manual_call_permission.bodyfree.v1"
    },
    "operation_step_ref": {
      "const": "DHC-OP03_manual_call_permission_gate"
    },
    "dhc_op03_status_ref": {
      "enum": [
        "DHC_STATUS_MANUAL_CALL_ALLOWED_EXPLICIT_OP04_ONLY",
        "DHC_STATUS_MANUAL_CALL_NOT_REQUESTED_STOPPED",
        "DHC_STATUS_WAITING_FOR_EXPLICIT_MANUAL_CALL_REQUEST",
        "DHC_STATUS_WAITING_FOR_EXPLICIT_DHR_OP04_ACTUAL_SOURCE_CLAIM_SEPARATION",
        "DHC_STATUS_REPAIR_REQUIRED_FOR_MANUAL_CALL_PERMISSION_INPUTS",
        "DHC_STATUS_BLOCKED_MANUAL_CALL_PROMOTION_OR_AUTORUN"
      ]
    },
    "manual_call_allowed": { "type": "boolean" },
    "existing_dhr_op05_builder_call_allowed_here": { "type": "boolean" },
    "existing_dhr_op05_builder_called_here": { "const": false },
    "implicit_op04_builder_fallback_allowed_here": { "const": false },
    "explicit_dhr_op04_material_present": { "type": "boolean" },
    "explicit_dhr_op04_contract_valid": { "type": "boolean" },
    "dhr_op06_call_allowed_here": { "const": false },
    "dmd_r52_execution_allowed_here": { "const": false },
    "p8_question_design_started": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 8.3 schema案: DHC existing DHR-OP05 call result wrapper

```json
{
  "$id": "cocolon.emlis.p7_r54.ahr.post_dhb.dhc.op04_existing_dhr_op05_call_result_wrapper.bodyfree.v1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "dhc_op04_status_ref",
    "existing_dhr_op05_builder_called_here",
    "existing_dhr_op05_result_present",
    "existing_dhr_op05_contract_valid",
    "existing_dhr_op05_status_ref",
    "implicit_op04_builder_fallback_used_here",
    "dhr_op06_called_here",
    "dmd_execution_started_here",
    "p8_question_design_started",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dhb.dhc.op04_existing_dhr_op05_call_result_wrapper.bodyfree.v1"
    },
    "operation_step_ref": {
      "const": "DHC-OP04_existing_DHR_OP05_preflight_scan_manual_call_boundary"
    },
    "dhc_op04_status_ref": {
      "enum": [
        "DHC_STATUS_EXISTING_DHR_OP05_PREFLIGHT_SCAN_CALLED_BODYFREE",
        "DHC_STATUS_EXISTING_DHR_OP05_PREFLIGHT_SCAN_NOT_CALLED_STOPPED",
        "DHC_STATUS_EXISTING_DHR_OP05_PREFLIGHT_SCAN_CALL_REPAIR_REQUIRED",
        "DHC_STATUS_EXISTING_DHR_OP05_PREFLIGHT_SCAN_CALL_BLOCKED_PROMOTION_OR_AUTORUN"
      ]
    },
    "existing_dhr_op05_builder_called_here": { "type": "boolean" },
    "existing_dhr_op05_result_present": { "type": "boolean" },
    "existing_dhr_op05_contract_valid": { "type": "boolean" },
    "existing_dhr_op05_status_ref": {
      "enum": [
        "DHR_PREFLIGHT_SCAN_CLEAR_BODYFREE",
        "DHR_PREFLIGHT_SCAN_REPAIR_REQUIRED",
        "DHR_PREFLIGHT_SCAN_WAITING_OR_INCOMPLETE",
        "existing_dhr_op05_not_called",
        "existing_dhr_op05_contract_invalid"
      ]
    },
    "existing_dhr_op05_next_required_step": { "type": "string" },
    "implicit_op04_builder_fallback_used_here": { "const": false },
    "dhr_op06_called_here": { "const": false },
    "dmd_execution_started_here": { "const": false },
    "p8_question_design_started": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 8.4 schema案: DHC final closure

```json
{
  "$id": "cocolon.emlis.p7_r54.ahr.post_dhb.dhc.op08_result_memo_closure.bodyfree.v1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "dhc_op08_status_ref",
    "dhr_op05_call_attempted",
    "existing_dhr_op05_builder_called_here",
    "existing_dhr_op05_status_ref",
    "dhc_result_classification_ref",
    "dhr_op06_called_here",
    "dmd_r52_executed_here",
    "actual_review_started_here",
    "p8_question_design_started",
    "p7_complete",
    "release_allowed",
    "next_work_candidate_ref",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dhb.dhc.op08_result_memo_closure.bodyfree.v1"
    },
    "operation_step_ref": {
      "const": "DHC-OP08_result_memo_closure_stopped_next_work_candidate"
    },
    "dhc_op08_status_ref": {
      "enum": [
        "DHC_OP08_SCAN_CLEAR_CLOSED_STOPPED",
        "DHC_OP08_WAITING_OR_INCOMPLETE_CLOSED_STOPPED",
        "DHC_OP08_REPAIR_REQUIRED_CLOSED_STOPPED",
        "DHC_OP08_NOT_CALLED_CLOSED_STOPPED",
        "DHC_OP08_NON_DHR_LANE_ROUTE_PRESERVED_STOPPED",
        "DHC_OP08_BLOCKED_BODYFREE_LEAK_PROMOTION_OR_AUTORUN"
      ]
    },
    "dhr_op05_call_attempted": { "type": "boolean" },
    "existing_dhr_op05_builder_called_here": { "type": "boolean" },
    "existing_dhr_op05_status_ref": { "type": "string" },
    "dhc_result_classification_ref": { "type": "string" },
    "dhr_op06_called_here": { "const": false },
    "dmd_r52_executed_here": { "const": false },
    "actual_review_started_here": { "const": false },
    "p8_question_design_started": { "const": false },
    "p7_complete": { "const": false },
    "release_allowed": { "const": false },
    "next_work_candidate_ref": { "type": "string" },
    "body_free": { "const": true }
  }
}
```

---

## 9. 実装対象ファイル案

実装指示が出た場合の新規helper候補は次です。

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_20260709.py
```

新規test候補は次です。

```text
mashos-api/ai/tests/
  test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_op00_op01_20260709.py
  test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_op02_op03_20260709.py
  test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_op04_op05_20260709.py
  test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_op06_op07_20260709.py
  test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_op08_result_20260709.py
```

result memo候補は次です。

```text
mashos-api/ai/tests/
  R54_AHR_PostDHB_DHROP05ManualCallExecutionConsideration_DHC_R7_TargetValidation_Result_20260709.md
  R54_AHR_PostDHB_DHROP05ManualCallExecutionConsideration_DHC_R8_SelectedRegression_Result_20260709.md
  R54_AHR_PostDHB_DHROP05ManualCallExecutionConsideration_DHC_R9_Compileall_Result_20260709.md
  R54_AHR_PostDHB_DHROP05ManualCallExecutionConsideration_DHC_R10_ResultMemoClosure_20260709.md
  R54_AHR_PostDHB_DHROP05ManualCallExecutionConsideration_DHC_R11_NextWorkDecision_20260709.md
```

本設計段階では、上記ファイルを作成しません。

---

## 10. 実装順

### R0: 設計反映pre-freeze

目的:

```text
本設計書を基準に、実装対象・禁止対象・DHC prefix・call boundaryを固定する。
```

作業:

```text
- 本設計書を確認する。
- 実装対象helper / test / result memo候補名を固定する。
- DHCはDHB再実装ではなくPost-DHB controlled manual call boundaryであると固定する。
- DHC-OP04だけがexisting DHR-OP05 builder call可能箇所であると固定する。
```

完了条件:

```text
- 実装前に、DHR-OP05 builder callを設計作業中には行っていないことが明記されている。
- DHR-OP04 implicit fallback禁止が明記されている。
```

### R1: constants / helper skeleton

目的:

```text
DHC helper skeleton、schema_version、status refs、false flags、existing builder/assert refsを定義する。
```

実装内容:

```text
- P7_R54_AHR_POST_DHB_DHC_* constantsを追加。
- DHC-OP00〜OP08 step refsを定義。
- DHC allowed status refsを定義。
- existing DHR-OP05 builder / assert / schema / status refsを文字列とimport参照の両方で管理する。
- no-touch false flagsを定義。
- forbidden payload key refsを定義。
- DHR-OP04 implicit fallback禁止refを定義。
```

注意:

```text
R1ではbuilder call関数をまだ実装しない。
```

### R2: DHC-OP00 / DHC-OP01 実装・target tests

目的:

```text
Post-DHB scope refreezeと、explicit DHB-OP08 closure intakeを実装する。
```

test観点:

```text
- OP00はDHR-OP05 / P8 / releaseを許可しない。
- OP01は明示DHB-OP08 materialなしでwaitingになる。
- OP01はDHB-OP08 closed DHR lane materialをintake readyにする。
- OP01はnon-DHR laneをroute preservedとして止める。
- OP01はbody-like payload / promotion / autorun claimをblockedにする。
- OP01はDHB builderを呼ばない。
```

### R3: DHC-OP02 / DHC-OP03 実装・target tests

目的:

```text
explicit DHR-OP04 material eligibilityとmanual call permission gateを実装する。
```

test観点:

```text
- explicit DHR-OP04 materialなしではmanual call allowedにならない。
- DHB handoff envelopeだけではbuilder input eligibleにならない。
- explicit DHR-OP04 materialがcontract validならeligibleになる。
- DHR-OP04 contract invalidはrepairになる。
- manual_call_requested=falseではcall allowedにならない。
- allow_implicit_op04_builder_fallback=trueはblocked / repairになる。
- permission allowedでもexisting builderはまだ呼ばれない。
```

### R4: DHC-OP04 / DHC-OP05 実装・target tests

目的:

```text
既存DHR-OP05 builderのcontrolled manual callと、result classificationを実装する。
```

実装の中心:

```text
- DHC-OP03 manual_call_allowed is trueの場合だけ、existing DHR-OP05 builderを呼ぶ。
- call時は必ず explicit_dhr_op04_actual_source_claim_separation を渡す。
- additional_bodyfree_materialsにはsanitized DHC context materialだけを渡す。
- builder outputをexisting assertで検証する。
- resultをDHC-OP05で scan clear / waiting / repair / not-called / blocked へ分類する。
```

禁止:

```text
- explicit OP04なしのbuilder call。
- DHR-OP04 builder implicit fallback。
- DHR-OP06 call。
- DMD/R52 call。
- P8 question design start。
```

test観点:

```text
- monkeypatch builderで、permissionなしでは呼ばれないことを確認する。
- permissionあり + explicit OP04ありで、builderが1回だけ呼ばれることを確認する。
- explicit OP04なしでは、builderが呼ばれずnot-called / waitingになる。
- existing DHR-OP05 clear resultをDHC scan clear stoppedへ分類する。
- existing DHR-OP05 waiting resultをDHC waiting stoppedへ分類する。
- existing DHR-OP05 repair resultをDHC repair stoppedへ分類する。
- builder/assert exceptionをtracebackなしのrepair stoppedへ分類する。
- DHR-OP06以降が呼ばれていないことを確認する。
```

### R5: DHC-OP06 / DHC-OP07 実装・target tests

目的:

```text
no-touch / no-promotion / no-auto-downstream guardとvalidation plan / result memo draftを実装する。
```

test観点:

```text
- scan clearでもDHR-OP06 call flagはfalse。
- waiting / repairでもP8 / releaseへ昇格しない。
- API / DB / RN / runtime / response key変更flagはfalse。
- target / selected regression / compileall refsはcount-onlyで記録する。
- stdout / stderr / traceback / raw body / comment_text / question_textを保持しない。
```

### R6: DHC-OP08 実装・target tests

目的:

```text
DHC result memo closureとnext work candidateをbody-freeで閉じる。
```

test観点:

```text
- scan clearは DHC_OP08_SCAN_CLEAR_CLOSED_STOPPED。
- waitingは DHC_OP08_WAITING_OR_INCOMPLETE_CLOSED_STOPPED。
- repairは DHC_OP08_REPAIR_REQUIRED_CLOSED_STOPPED。
- not-calledは DHC_OP08_NOT_CALLED_CLOSED_STOPPED。
- blockedは DHC_OP08_BLOCKED_BODYFREE_LEAK_PROMOTION_OR_AUTORUN。
- どの結果でもDHR-OP06 / DHR-OP07 / DMD / R52 / actual review / P8 / releaseへ進まない。
- next_work_candidate_refは別設計候補としてだけ残る。
```

### R7: target validation

候補command:

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_op00_op01_20260709.py \
  tests/test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_op02_op03_20260709.py \
  tests/test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_op04_op05_20260709.py \
  tests/test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_op06_op07_20260709.py \
  tests/test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_op08_result_20260709.py
```

記録:

```text
R54_AHR_PostDHB_DHROP05ManualCallExecutionConsideration_DHC_R7_TargetValidation_Result_20260709.md
```

### R8: selected regression

候補command:

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_op00_op01_20260709.py \
  tests/test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_op02_op03_20260709.py \
  tests/test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_op04_op05_20260709.py \
  tests/test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_op06_op07_20260709.py \
  tests/test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_op08_result_20260709.py \
  tests/test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op00_op01_20260708.py \
  tests/test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op02_op03_20260708.py \
  tests/test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op04_op05_20260708.py \
  tests/test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op06_op07_20260708.py \
  tests/test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op08_result_20260708.py \
  tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op04_op05_20260704.py \
  tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op06_op07_20260704.py
```

選定理由:

```text
- DHC新規target全体を確認する。
- 直前DHB境界が壊れていないことを確認する。
- existing DHR-OP04/OP05 contractが壊れていないことを確認する。
- DHR-OP06/OP07へ自動実行していないことの既存境界と矛盾していないことを確認する。
```

記録:

```text
R54_AHR_PostDHB_DHROP05ManualCallExecutionConsideration_DHC_R8_SelectedRegression_Result_20260709.md
```

### R9: compileall

候補command:

```bash
python -m compileall \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_20260709.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_20260708.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py \
  services/ai_inference/emlis_ai_p7_contracts.py
```

記録:

```text
R54_AHR_PostDHB_DHROP05ManualCallExecutionConsideration_DHC_R9_Compileall_Result_20260709.md
```

### R10: result memo closure

目的:

```text
R7 / R8 / R9をbody-freeで閉じる。
```

記録内容:

```text
- target validation result count-only summary
- selected regression result count-only summary
- compileall result count-only summary
- DHR-OP05 builder callがDHC-OP04条件下だけだったこと
- DHR-OP06以降へ進んでいないこと
- API / DB / RN / runtime / response key変更なし
- P8 / P7 complete / releaseなし
```

記録:

```text
R54_AHR_PostDHB_DHROP05ManualCallExecutionConsideration_DHC_R10_ResultMemoClosure_20260709.md
```

### R11: next work decision

目的:

```text
DHC結果に応じた次候補を決め、そこで止める。
```

decision table案:

| DHC result | safe next candidate | 自動実行 |
|---|---|---:|
| scan clear | DHR-OP06 branch resolver consideration または P7読感再接続decision boundary | no |
| waiting | explicit DHR-OP04 actual source claim reintake / missing actual source repair | no |
| repair | body-free leak / promotion / invalid source repair boundary | no |
| not-called | explicit manual call request / explicit OP04 material collection | no |
| non-DHR lane | DHB lane-specific route preserved decision | no |
| blocked | no-touch / no-promotion repair | no |

華恋の推奨:

```text
scan clearの場合でも、すぐDHR-OP06へ進めるのではなく、R11で「DHR-OP06 considerationへ行く理由」と「P7の商品読感確認へ戻る理由」を並べる。
R54-AHR境界補強が長くなっているため、P7の本来目的である読感・継続入力・外部pilot接続を見失わない。
```

記録:

```text
R54_AHR_PostDHB_DHROP05ManualCallExecutionConsideration_DHC_R11_NextWorkDecision_20260709.md
```

---

## 11. validation方針

### 11.1 target validationで必ず見ること

```text
- DHC-OP04以外でexisting DHR-OP05 builderが呼ばれない。
- DHC-OP04でもpermissionなしではbuilderが呼ばれない。
- explicit DHR-OP04 materialなしではbuilderが呼ばれない。
- existing DHR-OP05 builderにNoneを渡して暗黙OP04 fallbackを使わない。
- scan clear / waiting / repairをDHC resultへ正しく分類する。
- DHR-OP06以降へ進まない。
- body-like payload / promotion claim / autorun claimを止める。
```

### 11.2 selected regressionで必ず見ること

```text
- 直前DHB境界が壊れていない。
- existing DHR-OP04 / DHR-OP05 contractが壊れていない。
- DHR-OP05 resultがDMD direct callへ変換されていない。
- DHR-OP06 / DHR-OP07 helper contractと矛盾していない。
```

### 11.3 今回確認済みにしないこと

```text
- full backend suite green
- RN contract green
- RN real-device modal verified
- P7 complete
- release readiness
- P8 question design complete
```

---

## 12. 影響範囲

### 12.1 影響を与える範囲

実装時に影響する可能性がある範囲:

```text
mashos-api/ai/services/ai_inference/
  new DHC helper only

mashos-api/ai/tests/
  new DHC target tests
  DHC result memo files

既存DHR helper:
  import / call targetとして参照するが、原則変更しない

既存DHB helper:
  input material / selected regressionとして参照するが、原則変更しない
```

### 12.2 影響させない範囲

```text
- Cocolon RN app
- API route
- API response key
- DB schema
- DB write path
- runtime generation path
- subscription / entitlement
- account delete / access policy
- public meta keys
- question system API / DB / RN
```

---

## 13. リスクと対策

### 13.1 リスク: DHB envelopeをOP04 actual sourceに誤読する

対策:

```text
- DHC-OP02で envelope-only statusを明示する。
- envelope-onlyではbuilder call不可にする。
- testでDHB envelopeだけを渡してもbuilderが呼ばれないことを確認する。
```

### 13.2 リスク: 既存DHR-OP05 builderのimplicit OP04 fallbackを使ってしまう

対策:

```text
- DHC-OP04ではexplicit OP04 materialがない限りbuilderを呼ばない。
- allow_implicit_op04_builder_fallback is falseをrequiredにする。
- testでactual_source_claim_separation=None時にbuilderが呼ばれないことを確認する。
```

### 13.3 リスク: scan clearをDHR-OP06 execution permissionへ変換する

対策:

```text
- DHC-OP05で existing next_required_step と DHC next_required_step を分ける。
- DHC-OP06 guardでDHR-OP06 called flagをfalse固定する。
- R11でDHR-OP06 considerationは別指示・別設計と記録する。
```

### 13.4 リスク: P8問いシステムへ流れる

対策:

```text
- DHC全体でP8 question design / implementation / question_text materialization falseを固定する。
- waiting / repairを問いで補う扱いにしない。
- 問いシステムはP7ではbody-free必要性観察だけ、P8でcore gateとUXを分ける、というロードマップ境界を維持する。
```

### 13.5 リスク: R54-AHR境界補強が長期化し、P7商品読感へ戻れない

対策:

```text
- DHC R11で、scan clear後の次候補にP7読感再接続decisionを必ず並べる。
- DHR-OP06 considerationへ進む場合も、P7の商品品質確認へどう戻るかをR11に書く。
- waiting / repairの場合は、足りないactual source claimを明確化して閉じる。
```

---

## 14. 実装時のpublic contract / no-touch固定

DHC実装では、次をfalse固定します。

```text
api_changed
api_route_changed
api_response_key_changed
db_changed
db_schema_changed
db_write_path_changed
rn_changed
rn_production_ui_changed
rn_display_condition_changed
runtime_changed
runtime_generation_changed
response_key_changed
public_response_top_level_key_added
body_full_packet_generated_here
actual_local_human_review_executed_here
actual_rows_created_here
actual_operation_receipt_created_here
actual_sanitized_review_result_rows_materialized_here
actual_rating_rows_materialized_here
actual_question_need_observation_rows_materialized_here
actual_disposal_purge_executed_here
dhr_op06_called_here
dhr_op07_materialized_here
dmd_execution_started_here
dmd_auto_execution_allowed
manual_decision_auto_executes_downstream
r52_actual_execution_started_here
p5_final_allowed
p6_start_allowed
p8_start_allowed
p8_question_design_started
p8_question_implementation_started
question_text_materialized_here
p7_complete
release_allowed
full_backend_suite_green_claimed_here
rn_contract_green_claimed_here
rn_real_device_modal_verified_claimed_here
```

DHC-OP04で既存DHR-OP05 builderを呼んだ場合だけ、次はtrueになり得ます。

```text
existing_dhr_op05_builder_called_here
existing_dhr_op05_result_present
```

ただし、それでも次はfalseです。

```text
dhr_op06_called_here
dmd_execution_started_here
actual_review_started_here
p8_question_design_started
release_allowed
```

---

## 15. 華恋の意見

確認済み事実として、DHBは閉じています。  
ただし、DHR-OP05はまだ呼ばれていません。  
既存DHR-OP05 builderもまだ呼ばれていません。  
P8も始まっていません。

華恋の意見として、DHCでは既存DHR-OP05 builder callを完全に避け続けるより、**明示OP04材料がある場合だけ、DHC-OP04内でcontrolled manual callとして一度呼べる設計**にした方がよいと判断します。  
理由は、DHBのmanual handoff boundaryが閉じた以上、次に必要なのは「本当にexisting preflight scanへ接続できるのか」を確認する境界だからです。

ただし、そのcallは前進のための実行ではなく、境界確認です。  
DHR-OP05 resultがscan clearでも、DHR-OP06へ自動で行ってはいけません。  
waiting / repairなら、P8や問いシステムへ逃がさず、actual source claim不足またはbody-free / promotion境界の問題として閉じるべきです。

また、R54-AHR系の境界補強が長くなっているため、DHC R11では必ず次を残すべきです。

```text
DHR-OP06 considerationへ進むなら、何を確認するために進むのか。
P7の商品読感確認へ戻るなら、どの条件をもって戻るのか。
```

Cocolonとして在るべき姿は、分からないものを分かったふりで閉じないことです。  
同時に、境界確認だけを増やして、ユーザー入力に返る体験へ戻れない状態も避ける必要があります。  
DHCは、その両方のために「呼べる条件」と「呼んでも進みすぎない境界」を同時に持つべきだと見ています。

---

## 16. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- 検討メモでは、今回進める段階はP7継続 / Post-DHB / DHR-OP05 manual call / existing DHR-OP05 preflight scan execution considerationと固定されている。
- 検討メモでは、P8開始・問いシステム詳細設計・P7完了・release判断は採用しないと固定されている。
- DHB R11は、DHR-OP05 / existing DHR-OP05 builder / DHR-OP06 / DHR-OP07 / DMD / R52 / P8 / releaseを未実行・未開始としている。
- DHBはDHR-OP05 manual handoff envelopeとcompatibility crosswalkを作ったが、existing DHR-OP05 builderは呼んでいない。
- 既存DHR-OP05 builderは、actual_source_claim_separation / op04_actual_source_claim_separation / additional_bodyfree_materials / review_session_idを受け取る。
- 既存DHR-OP05 builderは、scan clear / waiting-or-incomplete / repair-requiredを返し得る。
- 既存DHR-OP05 clearでも、DMD direct callやDHR-OP06自動実行は許可されない。
```

### 未確認

```text
- full backend suite green。
- RN contract green。
- RN real-device modal verified。
- 実装段階でDHC target validationが何件になるか。
- 実装段階でselected regressionに追加すべき既存testの最小十分範囲。
- DHC scan clear後にDHR-OP06 considerationへ進むか、P7読感再接続decisionへ戻るかの最終判断。
```

### 書かれていない

```text
- DHB R11だけでP8を開始してよい、とは書かれていない。
- DHB handoff envelopeをDHR-OP04 actual source claim separationとして扱ってよい、とは書かれていない。
- existing DHR-OP05 builderをOP04 materialなしで呼んでよい、とは書かれていない。
- DHR-OP05 result clearをDHR-OP06自動実行許可として扱ってよい、とは書かれていない。
- target / regression / compileall greenをrelease readinessへ変換してよい、とは書かれていない。
```

### 推測禁止

```text
- DHBが閉じたからDHR-OP05は実行済み、と読むこと。
- DHB compatibility crosswalkをexisting DHR-OP05 builder executionとして読むこと。
- OP04 actual source claim separationがない状態で、builder内部fallbackに任せてよいと読むこと。
- DHR-OP05 builderを呼べばDHR-OP06 / DMD / R52へ進める、と読むこと。
- waiting / repairをP8問いシステムで補えばよい、と読むこと。
- green結果をP7 complete / release readyへ変換すること。
```

### 次に実行すべきこと

```text
1. Mash様が実装を指示した場合のみ、DHC helper / testsの実装へ進む。
2. 実装時は、DHC-OP00〜OP08を段階実装し、DHC-OP04以外でexisting DHR-OP05 builderを呼ばない。
3. DHC-OP04でも、explicit DHR-OP04 actual source claim separationがない場合はbuilderを呼ばない。
4. DHC-OP05以降は、existing DHR-OP05 resultを分類して止める。DHR-OP06以降へ自動昇格しない。
5. R7 / R8 / R9 / R10 / R11で、validation・result memo・next work decisionをbody-freeで閉じる。
```
