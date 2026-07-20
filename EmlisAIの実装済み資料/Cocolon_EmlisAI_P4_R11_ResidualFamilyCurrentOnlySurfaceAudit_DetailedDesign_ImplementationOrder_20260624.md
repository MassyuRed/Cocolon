# Cocolon / EmlisAI P4-R11 Residual Family Current-only Surface Audit 詳細設計書・実装順

作成日: 2026-06-24 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書 / 実装順 / body-free schema案内包  
対象: Cocolon / EmlisAI / `/emotion/submit` immediate observation / `Emlisの観測` / Product Read Feel / P4 Family別商品チューニング / current-only surface specificity  
基準検討メモ: `Cocolon_EmlisAI_P4_R11_ResidualFamilySurfaceAudit_PreDesignMemo_20260624.md`  
作業基準: ローカル添付snapshotのみ  
GitHub接続確認: Mash指定により不要。未実施。  
コード変更: なし  
DB変更: なし  
RN変更: なし  
API route / request key / response key変更: なし  
json / schema実ファイル化: なし  

---

## 0. 本資料の結論

今回設計する対象は、**P4-R11 Residual Family Current-only Surface Audit** です。

これはP5 / P6 / P8へ進むための実装ではありません。  
これはR54 actual local-only human reviewを置き換える工程でもありません。  
これはrelease readinessでもありません。

今回のP4-R11で行うことは、P4-H/I/Jで閉じたH future-direction redと同じ壊れ方、つまり次の壊れ方が残familyにも残っていないかを、**body-free audit / triage** として確認することです。

```text
壊れ方:
  current inputの材料は見えている。
  public response shapeも壊れていない。
  observation_status == passed も成立している。
  しかし、visible surfaceで入力核がgeneric category / emotion / action surfaceへ潰れる。
```

P4-R11の正式対象名は次で固定します。

```text
P4-R11:
  Residual Family Current-only Surface Audit
  / Product Read Feel Surface Specificity Triage
```

今回の設計で最も大事な判断は次です。

```text
- R10でH/I/J redは閉じた。
- ただし、それはP4全family完了ではない。
- R55はP8開始許可ではなく、R54 actual reviewへ戻す判断材料である。
- しかし、R54へ戻る前に、current-only surfaceの残blockerを軽くauditする必要がある。
- P4-R11でcurrent-only blockerがなければR54へ戻る。
- P4-R11でblockerがあればP4 targeted repairへ進む。
```

P4-R11で絶対にtrue化しないもの:

```text
p5_human_blind_qa_confirmed = false
p5_human_blind_qa_confirmed_final = false
p6_limited_human_readfeel_start_allowed = false
p8_start_allowed = false
p7_complete = false
release_allowed = false
question_implementation_started_here = false
api_db_rn_response_key_changed_here = false
runtime_changed_here = false
```

P4-R11で絶対に作らないもの:

```text
body-full review packet
reviewer free text
reviewer rating actual rows
question need observation actual rows
question text / draft question text
P8 question trigger logic
API route
DB schema / migration
RN UI / RN表示条件
public response top-level key
Emlis runtime本文差分
User Label Connection runtime差分
Gate threshold差分
```

---

## 1. なぜこの作業を行うのか

CocolonのEmlisAIは、ユーザーが残した言葉をただ分類して返すものではありません。  
入力直後に、その人が置いた感情・カテゴリ・行動・思考・時点が、**読まれた形** として返ることが中核です。

R10で閉じたH future-direction redは、表示到達の赤ではありませんでした。  
`passed + comment_text` は成立していて、public meta boundaryも壊れていませんでした。  
それでも、current inputの核がvisible surfaceでgeneric化していたため、商品読感として危険でした。

この種類の赤は、通常のcontract greenでは見落としやすいです。

```text
contract上は返っている。
文も壊れていない。
でも、ユーザーの言葉ではなく、分類された結果が返っているように見える。
```

Cocolonとして怖いのは、ここです。  
Emlisが返っているのに、ユーザーが「自分の言葉が読まれた」のではなく、「生活・平穏・次の扱い方のような汎用分類にされた」と感じることです。

P5履歴線は強い価値ですが、current inputの弱さを覆うために使ってはいけません。  
P8観測補助問いも、Emlis本体の読感不足を補う逃げ道にしてはいけません。

そのため、P4-R11では次を確認します。

```text
P5 / P8で補う前に、
現在入力だけで読まれるべき核が、visible surfaceへ残っているか。
```

華恋の判断では、ここを挟むことがCocolonとして正しい順序です。

---

## 2. 作業種別と守る境界

### 2.1 今回の作業種別

```text
作業種別:
  設計

成果物:
  md設計書

今回しないこと:
  コード変更
  patch作成
  実装zip作成
  DB変更
  RN変更
  API route変更
  request key変更
  response key変更
  public meta key追加
  json/schema実ファイル追加
  fixture実ファイル追加
```

本資料内に json / schema 案を含めます。  
ただし、実ファイル化は実装段階で、既存module配置・既存test配置・既存meta boundary・raw text混入リスクを確認してから判断します。

### 2.2 今回変更してはいけないcontract

```text
RN:
  - RN production UI
  - RN表示タイトル `Emlisの観測`
  - RN表示条件 `observation_status == passed && comment_text non-empty`

API:
  - `/emotion/submit` route
  - request key
  - public response top-level key
  - `input_feedback.comment_text` visible body契約
  - `input_feedback.emlis_ai` public meta契約

DB:
  - DB physical schema
  - write path
  - existing row insert path

EmlisAI boundary:
  - Display Gate
  - Runtime Surface Pre-Return Gate
  - Visible Surface Acceptance Gate
  - Grounding / Reader / Template / Safety Gate threshold
  - public meta sanitizer
  - Free / Plus / Premium history boundary
```

### 2.3 今回してはいけないこと

```text
- case_id専用分岐を追加する。
- family専用の完成文を追加する。
- expected exact comment_text一致を成功条件にする。
- 良い例文をruntime固定文として持つ。
- 入力本文の語句を直接見て完成文へ分岐する。
- Gateを緩める。
- material_qualityを雑にeligibleへ上げる。
- low_information / limited_grounding分類を都合よく変更する。
- daily_positiveを重い構造分析へ寄せる。
- relationship / gratitude / recoveryを相手評価や関係断定へ寄せる。
- long_meaning_arcを短い要約へ潰す。
- structure_questionを慰めだけで逃がす。
- self_denialを本人の事実として扱う。
- P5 User Label Connectionを使ってcurrent inputの弱さを隠す。
- P8観測補助問いでcurrent-only読感不足を補う。
- public metaへraw input / comment_text body / candidate body / surface textを入れる。
```

---

## 3. 参照・確認範囲

### 3.1 今回受領したローカル資料

```text
/mnt/data/Cocolon_前提資料(252).zip
/mnt/data/EmlisAIの実装済み資料(79).zip
/mnt/data/Cocolon(252).zip
/mnt/data/mashos-api(165).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(11).md
/mnt/data/Cocolon_EmlisAI_P4_R11_ResidualFamilySurfaceAudit_PreDesignMemo_20260624.md
```

### 3.2 作業姿勢として確認した資料

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

確認した作業姿勢上の要点:

```text
- 前提資料は作業用地図。実ファイルが現物。
- 設計と実装を混同しない。
- 見ていないものを見たように扱わない。
- EmlisAIをGateに通ったものだけ表示する許可装置として扱わない。
- pytest green / fixture green / RN contract greenだけを商品成果と呼ばない。
- case専用mode / cue / surface / fixed commentTextで解決しない。
- Cocolonは、人間の言葉を雑に処理しない場所として作る。
```

### 3.3 実装済み資料として確認した資料

```text
EmlisAIの実装済み資料/Cocolon_EmlisAI_P3_ProductReadFeel_Baseline_DetailedDesign_ImplementationOrder_20260609.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P4_FamilyProductTuning_DetailedDesign_ImplementationOrder_20260610.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P4_RuntimeBackfill_HIJ_FutureDirectionSurfaceRepair_DetailedDesign_ImplementationOrder_20260624.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R54_P5HumanBlindQAActualLocalReviewExecution_BodyFreeResultHandoff_DetailedDesign_ImplementationOrder_20260622.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R55_R54EvidenceReconcile_R52ReintakeDecisionMaterialization_DetailedDesign_ImplementationOrder_20260623.md
```

### 3.4 主に確認した実ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_labelled_two_stage_surface_recomposition.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_current_output_inventory.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_target_case_selection.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_material_audit.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_surface_signature_audit.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_ratings_review.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_regression_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization.py
mashos-api/ai/tests/fixtures/emlis_ai_product_readfeel_baseline_cases_20260609.py
mashos-api/ai/tests/Cocolon_EmlisAI_P4_RuntimeBackfill_HIJ_FutureDirectionSurfaceRepair_ImplementationResult_20260624.md
mashos-api/ai/tests/test_emlis_ai_p4_runtime_backfill_hij_future_direction_surface_repair_20260624.py
mashos-api/ai/tests/test_emlis_ai_p4_runtime_backfill_hij_future_direction_surface_audit_20260624.py
mashos-api/ai/tests/test_emlis_ai_p4_runtime_backfill_hij_future_direction_generic_surface_guard_20260624.py
mashos-api/ai/tests/test_emlis_ai_hij_reception_required_regression_p8.py
```

### 3.5 現行snapshotで確認した未存在

現行snapshotでは、P4-R11専用の実装ファイルはまだ存在しません。

```text
未存在:
  services/ai_inference/emlis_ai_product_readfeel_p4_r11_residual_family_surface_audit.py
  tests/test_emlis_ai_product_readfeel_p4_r11_*.py
```

既に存在する関連材料:

```text
- P4-5 surface signature audit
- P4 ratings review
- P4 regression handoff
- H/I/J future-direction runtime backfill tests
- labelled two-stage semantic focus helper
```

読み方:

```text
P4-R11は完全な新思想ではない。
P4-5とR10で作ったbody-free surface specificityの考えを、残familyへ広げるaudit工程である。
```

---

## 4. 現在地の固定

### 4.1 R10後の現在地

R10 result memo上、閉じたものは次です。

```text
closed:
  P4-HIJ-FUTURE-DIRECTION-SURFACE-001

closed by:
  R2/R3 eligible future direction semantic focus + labelled two-stage surface specificity

protected by:
  R0/R1 body-free red ledger / lineage audit
  R4 test-only generic surface guard
  R5 H/I/J E2E
  R6 P0〜P4 surrounding regression
  R7 P3/P4 Product Read Feel regression
  R8 RN contract regression
  R9 compile / collect-only
  R10 result memo / handoff
```

確認済みの結果:

```text
R0/R1 + R2/R3 + R4 targeted:
  5 passed / 1 warning

H/I/J submit E2E:
  3 passed / 1 warning

P0〜P4周辺回帰:
  59 passed / 1 warning

P3 Product Read Feel Regression:
  59 passed

P4 Product Read Feel Regression:
  60 passed

RN Contract Regression:
  36 passed

compileall:
  pass

collect-only:
  5028 tests collected / 1 warning
```

### 4.2 R10後も未確認のもの

```text
- full backend suite green。
- 実機submit。
- 課金plan別実機確認。
- 外部ユーザーreadfeel。
- P4全familyの商品読感完了。
- P5 actual human Blind QA実レビュー完了。
- P6 limited human readfeel開始可能判定。
- P8観測補助問い詳細設計開始可能判定。
- release_allowed true判断。
```

### 4.3 P7-R55の現在地

R55 final summary上の判断は保持します。

```text
r55_decision_ref:
  R55_R52_RETURN_TO_R54_ACTUAL_REVIEW_REQUIRED

next_required_step:
  R54_actual_local_only_human_review_operation_required_before_R52_reintake

actual_review_evidence_complete:
  false

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

読み方:

```text
- R55はP8開始許可ではない。
- R55はR54 actual local-only human reviewへ戻る判断材料である。
- P4-R11はR55を上書きしない。
- P4-R11は、R54へ戻る前のcurrent-only surface blocker確認である。
```

---

## 5. P4-R11の範囲

### 5.1 設計対象

```text
P4-R11 Residual Family Current-only Surface Audit

主目的:
  P4-H/I/Jで見つかった current-only surface specificity red が、
  残familyにも残っていないかを body-free に確認する。

副目的:
  red / yellow / passを分類し、
  redがある場合はP4 targeted repair候補層を特定する。
```

### 5.2 設計しないもの

```text
- runtime修正
- Gate追加
- Gate緩和
- P5履歴線修正
- P6 Structure Insight修正
- P8観測補助問い詳細設計
- API / DB / RN変更
- response key変更
- json / schema実ファイル追加
- release decision
```

### 5.3 成功時の次段階

```text
P4-R11でcurrent-only blockerなし:
  R54 actual local-only human review operationへ戻る。

P4-R11でcurrent-only blockerあり:
  P4-R12以降のtargeted repairへ進む。

P4-R11でyellowのみ:
  blocker性を見て、R54へ戻るかP4軽微repairへ進むかをbody-free decisionに残す。

P4-R11でpublic contract red:
  P4ではなくP1/P2相当のcontract / surface safety redとして別ledger化する。
```

---

## 6. 監査対象family / slice matrix

P4-R11では、既存family名と、新しい読感slice名を混同しません。

重要:

```text
change / future intention / transition は、現行のPRODUCT_READFEEL_REQUIRED_FAMILIES上の単独family定数ではない。
そのため、実装ではfamily renameをしない。
P4-R11では residual_focus_slice_id として扱う。
```

### 6.1 監査対象matrix

| 優先 | audit family id | 既存family / sliceとの対応 | 主な確認理由 |
|---:|---|---|---|
| 1 | `change_future_intention_transition` | `residual_focus_slice_id`。必要に応じて `daily_positive` / `uncertainty` / `self_understanding_follow` / `standard_state_answer` 相当から抽出 | H red隣接。current inputの未来方向・回復・次の頑張り方がgeneric化しやすい |
| 2 | `daily_positive_recovery` | `daily_positive` / `positive_only` / recovery slice | positiveを冷ましすぎない。generic praiseへ潰さない |
| 3 | `relationship_gratitude_recovery` | `relationship_boundary` / `daily_positive` / gratitude / recovery slice | 感謝・回復・人との願いを相手断定やgeneric comfortへ寄せない |
| 4 | `long_meaning_arc` | `long_meaning_arc` | 長文・複数核を短い要約やsurface collapseへ潰さない |
| 5 | `structure_question` | `structure_question` | 慰め逃げ・問い逃げを避け、状態回答として返す |
| 6 | `self_denial_yellow_remainder` | `self_denial` | 自己否定内容を本人の事実として扱わず、過剰肯定にも逃げない |

### 6.2 初期監査件数

P4-R11の初期実装では、各対象に最低4 case refsを目標にします。

```text
6 target groups × 4 case refs = 24 body-free audit rows
```

注意:

```text
- これはR54 / P5 human Blind QAの24 actual review rowsではない。
- P4-R11 audit rowsは、rating rowではない。
- question need observation rowでもない。
- disposal / purge evidenceにもならない。
```

既存public-safe indexやP4 target selectionから該当case refが不足する場合は、ケースを捏造せず、次のように残します。

```text
coverage_status:
  insufficient_public_safe_case_refs

next_needed:
  local_only_case_expansion_design_required
```

### 6.3 対象から外すもの

```text
- low_information_shortを深く読むauditの主対象にしない。
- limited_groundingをeligibleへ上げるauditにしない。
- history-line eligibleをP5価値判定に使わない。
- safety emergency / true infrastructure unavailableをProduct Read Feel current-only redへ混ぜない。
```

ただし、boundary regressionとして次は保持します。

```text
- low_information / limited_groundingへ誤分類していないか。
- history-line eligibleでP5がcurrent input不足を隠していないか。
- safety adjacent self_denialを通常観測・安全な状態回答・緊急境界に分けているか。
```

---

## 7. P4-R11で見る観点

### 7.1 共通観点

```text
- current-onlyで入力核がsurfaceへ残っているか。
- category / emotion / action generic phraseへ潰れていないか。
- family別の温度が合っているか。
- positiveを冷ましすぎていないか。
- structure_questionを慰めで逃がしていないか。
- long_meaning_arcを短く潰していないか。
- self_denialで自己否定内容を本人の事実として扱っていないか。
- low_information / limited_groundingへ誤分類していないか。
- Gate緩和なしで読感改善できる箇所か。
- P5履歴線やP8質問で補うべきではないcurrent-only不足か。
```

### 7.2 family別surface role requirements

P4-R11では、expected exact sentenceではなく、surface role idで見ます。

```text
change_future_intention_transition:
  required_surface_role_ids:
    - current_change_nucleus_visible
    - future_direction_visible
    - recovered_energy_or_transition_visible
    - self_possibility_without_prediction_visible
    - value_preservation_without_advice_visible


daily_positive_recovery:
  required_surface_role_ids:
    - positive_event_or_small_change_visible
    - positive_temperature_kept
    - observation_not_overweighted
    - reception_warmth_present
    - no_generic_praise_only

relationship_gratitude_recovery:
  required_surface_role_ids:
    - relationship_or_gratitude_nucleus_visible
    - user_side_wish_or_reaction_visible
    - no_other_person_intent_claim
    - no_relationship_permanence_claim
    - recovery_or_thanks_temperature_kept

long_meaning_arc:
  required_surface_role_ids:
    - multiple_current_nuclei_visible
    - relation_between_nuclei_visible
    - not_summary_only
    - observation_section_has_structure
    - reception_does_not_crush_complexity

structure_question:
  required_surface_role_ids:
    - question_context_visible
    - state_answer_attempt_visible
    - comfort_not_primary
    - observation_ratio_high_enough
    - no_question_escape

self_denial_yellow_remainder:
  required_surface_role_ids:
    - self_denial_not_accepted_as_fact
    - load_or_pain_behind_denial_visible
    - no_personality_claim
    - no_absolute_personality_praise
    - safety_boundary_if_needed
```

### 7.3 generic surface signature ids

P4-R11では、本文を保存せず、検出結果だけをidとして残します。

```text
generic_signature_ids:
  category_emotion_action_generic
  next_handling_generic
  positive_generic_reception
  generic_praise_only
  relationship_generic_comfort
  relationship_target_judgement
  long_arc_summary_crush
  structure_question_comfort_escape
  question_only_surface
  self_denial_identity_echo
  self_denial_over_praise
  mirror_only_surface
  repeated_closing_signature
  repeated_section_shape_signature
  family_temperature_flattened
```

### 7.4 repair candidate layer ids

P4-R11は修正実装をしません。  
ただし、red / yellow時に次のcandidate layer idを残します。

```text
repair_candidate_layer_ids:
  input_material_bundle
  observation_eligibility_router
  public_surface_requirement
  labelled_two_stage_surface_recomposition
  complete_initial_surface_recomposition
  limited_grounding_reception_surface
  two_stage_section_surface_plan
  state_answer_ratio_policy
  reception_mode_resolver
  complete_surface_realizer
  visible_surface_acceptance_gate
  template_echo_guard
  mirror_only_surface_detector
  product_readfeel_p4_surface_signature_audit
  product_readfeel_p4_ratings_review
```

---

## 8. 判定分類

### 8.1 verdict分類

```text
PASS:
  required_surface_role_idsが満たされている。
  generic_signature_idsが出ていない。
  family温度が大きくずれていない。
  P5/P8で補う必要がない。
  ただしProduct Read Feel v1商品合格ではない。

YELLOW:
  current nucleusは残っているが、温度・厚み・比率に弱さがある。
  ただし、P5/P8で隠してはいけないred blockerではない可能性がある。
  人間読感で確認すべき。

REPAIR_REQUIRED:
  current materialは存在するのに、visible surfaceでgeneric化している。
  missing_surface_role_idsが主要roleに出ている。
  repair candidate layerが特定できる。
  P5/P8へ進む前にP4 targeted repair候補。

RED:
  current-only surface specificity blockerとして扱う。
  例: materialあり / passedあり / comment_textあり / しかし入力核が主surfaceから落ちる。
  またはpublic contract / safety boundary redが混ざる場合は別ledger化する。
```

### 8.2 P5/P8へ逃がしてはいけない判定

次の条件を満たす場合、P5履歴線やP8質問で補ってはいけません。

```text
- current inputだけで見えるsemantic material idsがある。
- surface role requirementsがcurrent-onlyで成立するべき。
- comment_textは返っている。
- 表示到達ではなくvisible surface specificityの問題である。
- 問いを出さなくても観測できる材料がある。
- 履歴を使わなくても現在入力から拾うべき核である。
```

body-free flagとしては次を持ちます。

```text
p5_masking_forbidden: true
p8_question_escape_forbidden: true
current_only_repair_required_before_history_or_question: true
```

---

## 9. 実装設計

### 9.1 実装候補ファイル

初回実装で新規module化する場合の候補:

```text
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_r11_residual_family_surface_audit.py
```

新規test候補:

```text
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_r11_scope_matrix_20260624.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_r11_body_free_schema_20260624.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_r11_residual_family_surface_audit_20260624.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_r11_decision_handoff_20260624.py
```

結果メモ候補:

```text
mashos-api/ai/tests/Cocolon_EmlisAI_P4_R11_ResidualFamilyCurrentOnlySurfaceAudit_ImplementationResult_20260624.md
```

### 9.2 test helper内に留める場合

P4-R11が1回限りのtriageで終わる場合は、新規service moduleを作らず、test helper内のbody-free builderに留めてもよいです。

判断基準:

```text
新規module化する:
  - 複数testで同じbody-free row builderを使う。
  - P4-R12以降のrepair decisionでも同じaudit rowを使う。
  - P4 result memoへpublic-safe summaryを継続的に出す。

新規module化しない:
  - 1回限りのlocal auditで終わる。
  - schema化すると影響範囲が広がる。
  - test helper内のassertで十分。
```

華恋の推奨:

```text
P4-R11は対象familyが複数あり、summary / decision handoffまで必要になる。
そのため、body-free audit moduleは作る価値がある。
ただし、runtime pathへ接続しない。
```

### 9.3 public metaへ入れない値

P4-R11 auditでは、local test内で一時的にcomment_textを読んでも、返却payload / public summary / result materialへは入れません。

```text
禁止:
  raw input
  raw memo
  raw memo_action
  raw history
  raw answer
  comment_text body
  candidate body
  surface text
  expected exact sentence
  reviewer free text
  stdout / stderr / traceback body
  local filesystem path
  DB record id
  raw user id
```

返してよいもの:

```text
case_ref_id
family_id
residual_focus_slice_ids
material_quality
visible_material_slot_ids
semantic_material_ids
semantic_focus_ids
surface_requirement_family
selected_public_candidate_source_kind
route_kind ids
required_surface_role_ids
observed_surface_role_ids
missing_surface_role_ids
generic_surface_signature_ids
repair_candidate_layer_ids
verdict
hold flags
contract false flags
body_boundary false flags
```

---

## 10. JSON / schema 案

この章のschemaは設計案です。  
今回実ファイル化しません。  
実装段階で、既存test helper内に置くか、新規moduleにするか、json fixture化するか、ファイル化せずmd内の実装基準だけに留めるかを判断します。

---

### 10.1 P4-R11 Audit Root Schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.product_readfeel.p4_r11.residual_family_surface_audit.v1",
  "title": "EmlisAI P4-R11 Residual Family Current-only Surface Audit",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "source_phase",
    "run_id",
    "audit_profile",
    "scope",
    "audit_rows",
    "summary",
    "decision_handoff",
    "public_contract_flags",
    "body_boundary"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.product_readfeel.p4_r11.residual_family_surface_audit.v1"
    },
    "source_phase": {
      "const": "P4-R11_ResidualFamilyCurrentOnlySurfaceAudit"
    },
    "run_id": {
      "type": "string",
      "minLength": 1,
      "maxLength": 160
    },
    "audit_profile": {
      "const": "p4_r11_residual_family_current_only_surface_specificity_triage"
    },
    "scope": {
      "$ref": "#/$defs/scope"
    },
    "audit_rows": {
      "type": "array",
      "minItems": 0,
      "items": {
        "$ref": "#/$defs/audit_row"
      }
    },
    "summary": {
      "$ref": "#/$defs/summary"
    },
    "decision_handoff": {
      "$ref": "#/$defs/decision_handoff"
    },
    "public_contract_flags": {
      "$ref": "#/$defs/public_contract_flags"
    },
    "body_boundary": {
      "$ref": "#/$defs/body_boundary"
    }
  },
  "$defs": {
    "scope": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "target_family_ids",
        "target_focus_slice_ids",
        "minimum_target_row_count",
        "not_p5_human_review",
        "not_p8_question_design",
        "not_release_decision"
      ],
      "properties": {
        "target_family_ids": {
          "type": "array",
          "items": {
            "enum": [
              "change_future_intention_transition",
              "daily_positive_recovery",
              "relationship_gratitude_recovery",
              "long_meaning_arc",
              "structure_question",
              "self_denial_yellow_remainder"
            ]
          },
          "uniqueItems": true
        },
        "target_focus_slice_ids": {
          "type": "array",
          "items": {
            "enum": [
              "future_direction",
              "recovered_energy",
              "positive_small_change",
              "relationship_gratitude",
              "relationship_recovery",
              "long_arc_multi_core",
              "structure_question_state_answer",
              "self_denial_non_amplification"
            ]
          },
          "uniqueItems": true
        },
        "minimum_target_row_count": {
          "type": "integer",
          "minimum": 0
        },
        "not_p5_human_review": { "const": true },
        "not_p8_question_design": { "const": true },
        "not_release_decision": { "const": true }
      }
    },
    "audit_row": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "schema_version",
        "case_ref_id",
        "case_origin",
        "residual_family_id",
        "residual_focus_slice_ids",
        "priority_band",
        "material_audit",
        "surface_path_audit",
        "surface_specificity_audit",
        "risk_flags",
        "verdict",
        "repair_candidate_layer_ids",
        "next_action",
        "p5_p8_escape_boundary",
        "public_contract_flags",
        "body_boundary"
      ],
      "properties": {
        "schema_version": {
          "const": "cocolon.emlis.product_readfeel.p4_r11.audit_row.v1"
        },
        "case_ref_id": {
          "type": "string",
          "minLength": 1,
          "maxLength": 160
        },
        "case_origin": {
          "enum": [
            "p3_baseline_public_safe_index",
            "p4_target_selection",
            "p4_runtime_backfill_hij_handoff",
            "local_only_synthetic_case_ref",
            "unknown"
          ]
        },
        "residual_family_id": {
          "enum": [
            "change_future_intention_transition",
            "daily_positive_recovery",
            "relationship_gratitude_recovery",
            "long_meaning_arc",
            "structure_question",
            "self_denial_yellow_remainder",
            "boundary_regression"
          ]
        },
        "residual_focus_slice_ids": {
          "type": "array",
          "items": { "type": "string", "maxLength": 96 },
          "uniqueItems": true
        },
        "priority_band": {
          "enum": ["P0_highest", "P1_high", "P2_medium", "P3_boundary"]
        },
        "material_audit": {
          "$ref": "#/$defs/material_audit"
        },
        "surface_path_audit": {
          "$ref": "#/$defs/surface_path_audit"
        },
        "surface_specificity_audit": {
          "$ref": "#/$defs/surface_specificity_audit"
        },
        "risk_flags": {
          "$ref": "#/$defs/risk_flags"
        },
        "verdict": {
          "enum": ["PASS", "YELLOW", "REPAIR_REQUIRED", "RED"]
        },
        "repair_candidate_layer_ids": {
          "type": "array",
          "items": { "type": "string", "maxLength": 128 },
          "uniqueItems": true
        },
        "next_action": {
          "enum": [
            "no_action_r54_return_candidate",
            "p4_targeted_repair_required",
            "human_readfeel_review_note_only",
            "separate_contract_or_safety_ledger_required",
            "insufficient_coverage_expand_audit_cases"
          ]
        },
        "p5_p8_escape_boundary": {
          "$ref": "#/$defs/p5_p8_escape_boundary"
        },
        "public_contract_flags": {
          "$ref": "#/$defs/public_contract_flags"
        },
        "body_boundary": {
          "$ref": "#/$defs/body_boundary"
        }
      }
    },
    "material_audit": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "material_quality",
        "visible_material_slot_ids",
        "semantic_material_ids",
        "semantic_focus_ids",
        "semantic_material_count",
        "unknown_slot_count",
        "current_only_material_available"
      ],
      "properties": {
        "material_quality": {
          "enum": [
            "eligible",
            "limited_grounding",
            "low_information",
            "safety_triage_required",
            "source_unavailable",
            "unknown"
          ]
        },
        "visible_material_slot_ids": {
          "type": "array",
          "items": { "type": "string", "maxLength": 96 },
          "uniqueItems": true
        },
        "semantic_material_ids": {
          "type": "array",
          "items": { "type": "string", "maxLength": 96 },
          "uniqueItems": true
        },
        "semantic_focus_ids": {
          "type": "array",
          "items": {
            "enum": [
              "future_direction",
              "recovered_energy",
              "positive_small_change",
              "relationship_gratitude",
              "relationship_wish",
              "relationship_recovery",
              "long_arc_multi_core",
              "structure_question_state_answer",
              "self_denial_non_amplification",
              "generic_visible_material"
            ]
          },
          "uniqueItems": true
        },
        "semantic_material_count": {
          "type": "integer",
          "minimum": 0
        },
        "unknown_slot_count": {
          "type": "integer",
          "minimum": 0
        },
        "current_only_material_available": {
          "type": "boolean"
        }
      }
    },
    "surface_path_audit": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "surface_requirement_family",
        "selected_surface_route_kind",
        "selected_public_candidate_source_kind",
        "labelled_two_stage_surface_recomposition_used",
        "complete_initial_surface_recomposition_used",
        "limited_grounding_reception_surface_used",
        "history_line_surface_used"
      ],
      "properties": {
        "surface_requirement_family": {
          "type": "string",
          "maxLength": 128
        },
        "selected_surface_route_kind": {
          "enum": [
            "complete_initial_surface_recomposition",
            "labelled_two_stage_surface_recomposition",
            "limited_grounding_reception_surface",
            "low_information_observation",
            "normal_observation_rebuild",
            "history_line_candidate",
            "unknown"
          ]
        },
        "selected_public_candidate_source_kind": {
          "type": "string",
          "maxLength": 160
        },
        "labelled_two_stage_surface_recomposition_used": { "type": "boolean" },
        "complete_initial_surface_recomposition_used": { "type": "boolean" },
        "limited_grounding_reception_surface_used": { "type": "boolean" },
        "history_line_surface_used": { "const": false }
      }
    },
    "surface_specificity_audit": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "current_only_specificity_required",
        "specificity_met",
        "required_surface_role_ids",
        "observed_surface_role_ids",
        "missing_surface_role_ids",
        "generic_surface_signature_ids",
        "temperature_mismatch_ids",
        "question_escape_detected",
        "mirror_only_detected"
      ],
      "properties": {
        "current_only_specificity_required": { "type": "boolean" },
        "specificity_met": { "type": "boolean" },
        "required_surface_role_ids": {
          "type": "array",
          "items": { "type": "string", "maxLength": 128 },
          "uniqueItems": true
        },
        "observed_surface_role_ids": {
          "type": "array",
          "items": { "type": "string", "maxLength": 128 },
          "uniqueItems": true
        },
        "missing_surface_role_ids": {
          "type": "array",
          "items": { "type": "string", "maxLength": 128 },
          "uniqueItems": true
        },
        "generic_surface_signature_ids": {
          "type": "array",
          "items": { "type": "string", "maxLength": 128 },
          "uniqueItems": true
        },
        "temperature_mismatch_ids": {
          "type": "array",
          "items": { "type": "string", "maxLength": 128 },
          "uniqueItems": true
        },
        "question_escape_detected": { "type": "boolean" },
        "mirror_only_detected": { "type": "boolean" }
      }
    },
    "risk_flags": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "p5_masking_risk",
        "p8_question_escape_risk",
        "self_blame_amplification_risk",
        "overclaim_risk",
        "positive_cooling_risk",
        "long_arc_crush_risk",
        "structure_question_comfort_escape_risk"
      ],
      "properties": {
        "p5_masking_risk": { "type": "boolean" },
        "p8_question_escape_risk": { "type": "boolean" },
        "self_blame_amplification_risk": { "type": "boolean" },
        "overclaim_risk": { "type": "boolean" },
        "positive_cooling_risk": { "type": "boolean" },
        "long_arc_crush_risk": { "type": "boolean" },
        "structure_question_comfort_escape_risk": { "type": "boolean" }
      }
    },
    "p5_p8_escape_boundary": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "p5_masking_forbidden",
        "p8_question_escape_forbidden",
        "current_only_repair_required_before_history_or_question"
      ],
      "properties": {
        "p5_masking_forbidden": { "type": "boolean" },
        "p8_question_escape_forbidden": { "type": "boolean" },
        "current_only_repair_required_before_history_or_question": { "type": "boolean" }
      }
    },
    "summary": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "audited_row_count",
        "target_row_count",
        "coverage_status",
        "family_counts",
        "verdict_counts",
        "red_count",
        "repair_required_count",
        "yellow_count",
        "pass_count",
        "current_only_blocker_count",
        "p4_targeted_repair_required",
        "r54_return_candidate_after_r11",
        "p6_start_allowed",
        "p8_start_allowed",
        "release_allowed"
      ],
      "properties": {
        "audited_row_count": { "type": "integer", "minimum": 0 },
        "target_row_count": { "type": "integer", "minimum": 0 },
        "coverage_status": {
          "enum": ["complete", "partial", "insufficient_public_safe_case_refs"]
        },
        "family_counts": { "type": "object", "additionalProperties": { "type": "integer" } },
        "verdict_counts": { "type": "object", "additionalProperties": { "type": "integer" } },
        "red_count": { "type": "integer", "minimum": 0 },
        "repair_required_count": { "type": "integer", "minimum": 0 },
        "yellow_count": { "type": "integer", "minimum": 0 },
        "pass_count": { "type": "integer", "minimum": 0 },
        "current_only_blocker_count": { "type": "integer", "minimum": 0 },
        "p4_targeted_repair_required": { "type": "boolean" },
        "r54_return_candidate_after_r11": { "type": "boolean" },
        "p6_start_allowed": { "const": false },
        "p8_start_allowed": { "const": false },
        "release_allowed": { "const": false }
      }
    },
    "decision_handoff": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "decision_ref",
        "next_required_step",
        "r55_decision_preserved",
        "p5_human_review_evidence_created_here",
        "question_observation_rows_created_here"
      ],
      "properties": {
        "decision_ref": {
          "enum": [
            "P4_R11_RETURN_TO_R54_ACTUAL_REVIEW_CANDIDATE",
            "P4_R11_TARGETED_REPAIR_REQUIRED_BEFORE_R54",
            "P4_R11_INSUFFICIENT_COVERAGE_EXPAND_AUDIT"
          ]
        },
        "next_required_step": {
          "enum": [
            "R54_actual_local_only_human_review_operation_required_before_R52_reintake",
            "P4_R12_targeted_current_only_surface_repair",
            "P4_R11_case_coverage_expansion"
          ]
        },
        "r55_decision_preserved": { "const": true },
        "p5_human_review_evidence_created_here": { "const": false },
        "question_observation_rows_created_here": { "const": false }
      }
    },
    "public_contract_flags": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "public_response_key_added",
        "response_shape_changed",
        "api_route_changed",
        "db_physical_name_changed",
        "rn_visible_contract_changed",
        "display_gate_relaxed",
        "visible_surface_gate_relaxed",
        "runtime_surface_gate_relaxed",
        "fixed_fallback_used",
        "case_specific_route_used",
        "runtime_changed_here",
        "json_schema_file_materialized"
      ],
      "properties": {
        "public_response_key_added": { "const": false },
        "response_shape_changed": { "const": false },
        "api_route_changed": { "const": false },
        "db_physical_name_changed": { "const": false },
        "rn_visible_contract_changed": { "const": false },
        "display_gate_relaxed": { "const": false },
        "visible_surface_gate_relaxed": { "const": false },
        "runtime_surface_gate_relaxed": { "const": false },
        "fixed_fallback_used": { "const": false },
        "case_specific_route_used": { "const": false },
        "runtime_changed_here": { "const": false },
        "json_schema_file_materialized": { "const": false }
      }
    },
    "body_boundary": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "body_free",
        "raw_input_included",
        "raw_text_included",
        "comment_text_body_included",
        "candidate_body_included",
        "surface_text_included",
        "reviewer_free_text_included",
        "question_text_included"
      ],
      "properties": {
        "body_free": { "const": true },
        "raw_input_included": { "const": false },
        "raw_text_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "candidate_body_included": { "const": false },
        "surface_text_included": { "const": false },
        "reviewer_free_text_included": { "const": false },
        "question_text_included": { "const": false }
      }
    }
  }
}
```

---

### 10.2 body-free row sample案

これは設計説明用のサンプルです。  
実ファイル化しません。

```json
{
  "schema_version": "cocolon.emlis.product_readfeel.p4_r11.audit_row.v1",
  "case_ref_id": "p4_r11_case_ref_001",
  "case_origin": "p3_baseline_public_safe_index",
  "residual_family_id": "change_future_intention_transition",
  "residual_focus_slice_ids": ["future_direction", "recovered_energy"],
  "priority_band": "P0_highest",
  "material_audit": {
    "material_quality": "eligible",
    "visible_material_slot_ids": ["event", "emotion_direction", "value"],
    "semantic_material_ids": ["recovered_energy", "future_intention", "value_preservation"],
    "semantic_focus_ids": ["future_direction", "recovered_energy"],
    "semantic_material_count": 3,
    "unknown_slot_count": 0,
    "current_only_material_available": true
  },
  "surface_path_audit": {
    "surface_requirement_family": "labelled_two_stage",
    "selected_surface_route_kind": "labelled_two_stage_surface_recomposition",
    "selected_public_candidate_source_kind": "labelled_two_stage_surface_recomposition_candidate",
    "labelled_two_stage_surface_recomposition_used": true,
    "complete_initial_surface_recomposition_used": false,
    "limited_grounding_reception_surface_used": false,
    "history_line_surface_used": false
  },
  "surface_specificity_audit": {
    "current_only_specificity_required": true,
    "specificity_met": false,
    "required_surface_role_ids": [
      "current_change_nucleus_visible",
      "future_direction_visible",
      "recovered_energy_or_transition_visible"
    ],
    "observed_surface_role_ids": ["observation_section_present", "reception_section_present"],
    "missing_surface_role_ids": ["future_direction_visible"],
    "generic_surface_signature_ids": ["category_emotion_action_generic"],
    "temperature_mismatch_ids": [],
    "question_escape_detected": false,
    "mirror_only_detected": false
  },
  "risk_flags": {
    "p5_masking_risk": true,
    "p8_question_escape_risk": true,
    "self_blame_amplification_risk": false,
    "overclaim_risk": false,
    "positive_cooling_risk": false,
    "long_arc_crush_risk": false,
    "structure_question_comfort_escape_risk": false
  },
  "verdict": "REPAIR_REQUIRED",
  "repair_candidate_layer_ids": ["labelled_two_stage_surface_recomposition"],
  "next_action": "p4_targeted_repair_required",
  "p5_p8_escape_boundary": {
    "p5_masking_forbidden": true,
    "p8_question_escape_forbidden": true,
    "current_only_repair_required_before_history_or_question": true
  },
  "public_contract_flags": {
    "public_response_key_added": false,
    "response_shape_changed": false,
    "api_route_changed": false,
    "db_physical_name_changed": false,
    "rn_visible_contract_changed": false,
    "display_gate_relaxed": false,
    "visible_surface_gate_relaxed": false,
    "runtime_surface_gate_relaxed": false,
    "fixed_fallback_used": false,
    "case_specific_route_used": false,
    "runtime_changed_here": false,
    "json_schema_file_materialized": false
  },
  "body_boundary": {
    "body_free": true,
    "raw_input_included": false,
    "raw_text_included": false,
    "comment_text_body_included": false,
    "candidate_body_included": false,
    "surface_text_included": false,
    "reviewer_free_text_included": false,
    "question_text_included": false
  }
}
```

---

## 11. 実装順

---

## R11-0: Contract Freeze / R10・R55位置固定

### 目的

P4-R11が、R10結果とR55 hold判断を壊さないことを最初に固定します。

### 対象

```text
参照:
  tests/Cocolon_EmlisAI_P4_RuntimeBackfill_HIJ_FutureDirectionSurfaceRepair_ImplementationResult_20260624.md
  services/ai_inference/emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization.py

新規test候補:
  tests/test_emlis_ai_product_readfeel_p4_r11_scope_matrix_20260624.py
```

### 実装内容候補

```text
- P4-R11のroot summaryで次を固定する。
  - p6_start_allowed false
  - p8_start_allowed false
  - release_allowed false
  - p5_human_review_evidence_created_here false
  - question_observation_rows_created_here false
  - runtime_changed_here false

- R55 decisionを上書きしない。
- R10 closed redを再openしない。
```

### 完了条件

```text
- P4-R11がP5/P6/P8/releaseをtrue化しない。
- R55 decisionを保持する。
- P4-R11のdecisionはR55の代替ではなく、P4内のcurrent-only blocker確認として扱われる。
```

---

## R11-1: Residual Family Scope Matrix Freeze

### 目的

P4-R11の対象family / sliceをbody-freeに固定します。

### 対象

```text
services/ai_inference/emlis_ai_product_readfeel_current_output_inventory.py
services/ai_inference/emlis_ai_product_readfeel_p4_target_case_selection.py
tests/fixtures/emlis_ai_product_readfeel_baseline_cases_20260609.py
```

### 実装内容候補

```text
- target matrixを作る。
- existing family constantとresidual focus sliceを分ける。
- 各target groupのminimum case refsを4にする。
- 不足時はcoverage_statusへ残す。
```

### 完了条件

```text
- 6 target groupsが固定されている。
- target_row_countは24を目標にする。
- 24 rowsをR54 actual review evidenceと混同していない。
- change/futureを無理に新しいruntime familyへrenameしていない。
```

---

## R11-2: Body-free Audit Row / Meta-only Guard

### 目的

P4-R11の監査rowがraw bodyを持てないことを、最初に実装します。

### 実装対象候補

```text
services/ai_inference/emlis_ai_product_readfeel_p4_r11_residual_family_surface_audit.py
```

### 関数案

```python
PRODUCT_READFEEL_P4_R11_RESIDUAL_SURFACE_AUDIT_VERSION_20260624 = (
    "cocolon.emlis.product_readfeel.p4_r11.residual_family_surface_audit.v1"
)


def assert_product_readfeel_p4_r11_residual_surface_audit_meta_only_20260624(payload, *, source="p4_r11") -> None:
    ...


def build_product_readfeel_p4_r11_audit_row_20260624(...):
    ...


def build_product_readfeel_p4_r11_residual_surface_audit_20260624(...):
    ...


def build_product_readfeel_p4_r11_public_summary_20260624(payload):
    ...
```

### meta-only guardで拒否するkey

```text
raw_input
raw_text
source_text
input
input_text
user_input
current_input
memo
memo_text
memo_action
comment_text
commentText
comment_text_body
candidate_body
reply_text
surface_text
display_text
visible_text
reviewer_note
question_text
draft_question_text
stdout
stderr
traceback_body
body
text
```

### 完了条件

```text
- raw body keyを含むpayloadがValueErrorになる。
- forbidden true flagsがtrueならValueErrorになる。
- schema案はmd内に留まり、json/schema実ファイル化しない。
```

---

## R11-3: Case Ref Selection / Coverage Audit

### 目的

実入力本文ではなく、case_ref_idとbody-free metadataだけで監査対象を選びます。

### 対象

```text
tests/fixtures/emlis_ai_product_readfeel_baseline_cases_20260609.py
services/ai_inference/emlis_ai_product_readfeel_p4_target_case_selection.py
```

### 実装内容候補

```text
- P3 baseline public-safe indexからcase_ref_id / family / coverage_slicesを取る。
- P4 target selectionから既存selection groupsを参照する。
- R10 H/I/J resultは参考にするが、H case専用routeとして扱わない。
- 6 target groups × 4 refs を目標にする。
- 不足分はcoverage_statusで明示する。
```

### 完了条件

```text
- audit rowはcase_ref_idだけを持つ。
- raw input / local synthetic bodyをsummaryへ持ち込まない。
- caseが不足している場合に補完で捏造しない。
```

---

## R11-4: Material Route Audit

### 目的

各case refについて、current-only materialがあるかをbody-freeに確認します。

### 確認する値

```text
material_quality
visible_material_slot_ids
semantic_material_ids
semantic_focus_ids
semantic_material_count
unknown_slot_count
current_only_material_available
```

### 実装内容候補

```text
- material route summaryをaudit rowへ正規化する。
- semantic_material_idsはidのみ保持する。
- raw memo / raw actionは保持しない。
- low_information / limited_groundingの場合は、無理にeligibleへ上げない。
```

### 完了条件

```text
- materialがあるredと、materialがないlow-infoを分けられる。
- visible surface issueとmaterial absenceを混同しない。
```

---

## R11-5: Surface Path Audit

### 目的

visible surfaceがどのlaneで作られたかをbody-freeに見る。

### 確認する値

```text
surface_requirement_family
selected_surface_route_kind
selected_public_candidate_source_kind
labelled_two_stage_surface_recomposition_used
complete_initial_surface_recomposition_used
limited_grounding_reception_surface_used
history_line_surface_used
```

### 実装内容候補

```text
- runtime候補本文を保存しない。
- candidate source kind / route kindだけを保存する。
- history_line_surface_usedはP4-R11ではfalseで固定する。
- P5履歴線が混ざった場合は current-only audit 不成立として扱う。
```

### 完了条件

```text
- surface dropがどのlaneで起きたかを分類できる。
- P5 history lineがcurrent-only auditに混ざらない。
```

---

## R11-6: Surface Specificity Role Audit

### 目的

comment_text bodyを保存せず、surface role id / generic signature idへ正規化します。

### 実装内容候補

```text
- local test内で一時的にvisible bodyを読むことは許容する。
- ただし返却値はrole id / signature idだけにする。
- detector結果にcomment_text fragmentを含めない。
```

### local-only helper案

```python
# 説明用案。実装段階で配置判断する。

def normalize_local_surface_probe_to_p4_r11_observation_ids(
    *,
    local_comment_text: str,
    residual_family_id: str,
    residual_focus_slice_ids: Sequence[str],
) -> dict[str, Any]:
    """Convert a local-only surface body into body-free role/signature ids.

    The returned mapping must not include local_comment_text or exact fragments.
    """
    return {
        "observed_surface_role_ids": (...),
        "generic_surface_signature_ids": (...),
        "temperature_mismatch_ids": (...),
        "question_escape_detected": False,
        "mirror_only_detected": False,
    }
```

### 完了条件

```text
- role id / signature idだけがaudit rowへ入る。
- local_comment_textはpayload / dumped json / public summaryに含まれない。
- exact sentence一致を要求しない。
```

---

## R11-7: Verdict / Repair Candidate Classification

### 目的

各rowをPASS / YELLOW / REPAIR_REQUIRED / REDに分類します。

### 分類ルール案

```text
RED:
  public contract red または severe current-only specificity blocker。

REPAIR_REQUIRED:
  current_only_material_available true
  current_only_specificity_required true
  missing_surface_role_ids not empty
  または generic_surface_signature_ids not empty

YELLOW:
  specificityは最低限あるが温度・厚み・比率が弱い。
  人間読感確認が必要。

PASS:
  required roleが残っている。
  generic signatureなし。
  current-only blockerなし。
```

### repair layer mapping案

```text
future_direction / recovered_energy generic化:
  labelled_two_stage_surface_recomposition
  complete_initial_surface_recomposition
  product_readfeel_p4_surface_signature_audit

daily_positive冷却:
  state_answer_ratio_policy
  two_stage_section_surface_plan
  complete_surface_realizer

relationship/gratitude generic化:
  reception_mode_resolver
  state_answer_ratio_policy
  two_stage_section_surface_plan
  visible_surface_acceptance_gate

long arc crush:
  complete_surface_realizer
  two_stage_section_surface_plan
  product_readfeel_p4_ratings_review

structure question comfort escape:
  state_answer_ratio_policy
  structure_insight_p6_surface_role_plan は参照のみ。P6実装へ進めない。

self_denial identity echo:
  visible_surface_acceptance_gate
  state_answer_ratio_policy
  self_denial_safe_state_answer相当の既存層
```

### 完了条件

```text
- rowごとにnext_actionが決まる。
- repair対象がP4内か、P1/P2 contract/safetyか、R54 review noteか分かれる。
- P5/P8へ逃がしてよい判定は出さない。
```

---

## R11-8: Summary / Decision Handoff

### 目的

P4-R11の結果から、次にR54へ戻るか、P4 targeted repairへ進むかを決めるbody-free材料を作ります。

### decision_ref案

```text
P4_R11_RETURN_TO_R54_ACTUAL_REVIEW_CANDIDATE:
  current-only blockerがない。
  coverageが最低条件を満たす。
  ただしR54 actual reviewは別途必要。

P4_R11_TARGETED_REPAIR_REQUIRED_BEFORE_R54:
  current-only surface blockerがある。
  P5/P8へ進む前にP4 targeted repairが必要。

P4_R11_INSUFFICIENT_COVERAGE_EXPAND_AUDIT:
  case refs不足で判断できない。
  追加case selection設計が必要。
```

### 完了条件

```text
- next_required_stepが明確。
- R55 decisionは保持。
- p6_start_allowed / p8_start_allowed / release_allowed はfalse。
```

---

## R11-9: Targeted Tests

### 目的

P4-R11 auditがbody-freeであり、decisionが正しく分かれることを確認します。

### 新規test候補

```text
tests/test_emlis_ai_product_readfeel_p4_r11_scope_matrix_20260624.py
tests/test_emlis_ai_product_readfeel_p4_r11_body_free_schema_20260624.py
tests/test_emlis_ai_product_readfeel_p4_r11_residual_family_surface_audit_20260624.py
tests/test_emlis_ai_product_readfeel_p4_r11_decision_handoff_20260624.py
```

### target command案

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_product_readfeel_p4_r11_scope_matrix_20260624.py \
  tests/test_emlis_ai_product_readfeel_p4_r11_body_free_schema_20260624.py \
  tests/test_emlis_ai_product_readfeel_p4_r11_residual_family_surface_audit_20260624.py \
  tests/test_emlis_ai_product_readfeel_p4_r11_decision_handoff_20260624.py \
  --tb=short
```

### 完了条件

```text
- target tests green。
- body-bearing payload rejection test green。
- PASS / YELLOW / REPAIR_REQUIRED / RED分類の代表ケースがbody-freeで通る。
- decision handoffがP5/P8/releaseをtrue化しない。
```

---

## R11-10: P4 Existing Regression

### 目的

P4-R11 audit追加で既存P4測定器を壊していないことを確認します。

### command案

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
 tests/test_emlis_ai_product_readfeel_p4_connection_freeze_20260610.py \
 tests/test_emlis_ai_product_readfeel_p4_target_case_selection_20260610.py \
 tests/test_emlis_ai_product_readfeel_p4_material_audit_20260610.py \
 tests/test_emlis_ai_product_readfeel_p4_surface_requirement_boundary_20260610.py \
 tests/test_emlis_ai_product_readfeel_p4_family_tuning_policy_20260610.py \
 tests/test_emlis_ai_product_readfeel_p4_surface_signature_audit_20260610.py \
 tests/test_emlis_ai_product_readfeel_p4_daily_unpleasant_family_tuning_20260610.py \
 tests/test_emlis_ai_product_readfeel_p4_structure_question_family_tuning_20260610.py \
 tests/test_emlis_ai_product_readfeel_p4_self_denial_yellow_review_20260610.py \
 tests/test_emlis_ai_product_readfeel_p4_ratings_review_20260610.py \
 tests/test_emlis_ai_product_readfeel_p4_regression_handoff_20260610.py \
 --tb=short
```

### 完了条件

```text
- 既存P4 60 tests green維持。
- P4-R11追加でP4-0〜P4-10の意味を上書きしない。
```

---

## R11-11: H/I/J Runtime Backfill Regression

### 目的

R10で閉じたH redを再発させていないことを確認します。

### command案

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p4_runtime_backfill_hij_future_direction_surface_audit_20260624.py \
  tests/test_emlis_ai_p4_runtime_backfill_hij_future_direction_surface_repair_20260624.py \
  tests/test_emlis_ai_p4_runtime_backfill_hij_future_direction_generic_surface_guard_20260624.py \
  tests/test_emlis_ai_hij_reception_required_regression_p8.py \
  --tb=short
```

### 完了条件

```text
- R10 targeted 5 tests相当 green維持。
- H/I/J submit E2E 3 tests green維持。
- H redを再openしない。
```

---

## R11-12: P3 Product Read Feel Regression

### 目的

P4-R11がP3 baseline / inventory / verdict split / connection decisionを壊していないことを確認します。

### command案

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
 tests/test_emlis_ai_product_readfeel_p3_contract_freeze_20260609.py \
 tests/test_emlis_ai_product_readfeel_baseline_case_matrix_20260609.py \
 tests/test_emlis_ai_product_readfeel_p3_local_output_capture_20260609.py \
 tests/test_emlis_ai_product_readfeel_p3_inventory_connection_20260609.py \
 tests/test_emlis_ai_product_readfeel_p3_verdict_split_20260609.py \
 tests/test_emlis_ai_product_readfeel_p3_blind_qa_ratings_review_20260609.py \
 tests/test_emlis_ai_product_readfeel_p3_repair_priority_ledger_20260609.py \
 tests/test_emlis_ai_product_readfeel_p3_first_repair_design_20260609.py \
 tests/test_emlis_ai_product_readfeel_p3_regression_20260609.py \
 tests/test_emlis_ai_product_readfeel_p3_p4_p5_connection_decision_20260609.py \
 --tb=short
```

### 完了条件

```text
- P3 59 tests green維持。
- P3/P4 greenをProduct Read Feel v1合格とは扱わない。
```

---

## R11-13: R54/R55 Hold Boundary Regression

### 目的

P4-R11がR55のP8 hold / release hold判断を壊していないことを確認します。

### command案

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
 tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_r*_2026062*.py \
 tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r*_2026062*.py \
 --tb=short
```

実装時にshellのglob展開が環境で不安定な場合は、既存のR54/R55 test listを明示列挙します。

### 完了条件

```text
- R54/R55 target green維持。
- R55_R52_RETURN_TO_R54_ACTUAL_REVIEW_REQUIRED を保持。
- p8_start_allowed falseを保持。
- release_allowed falseを保持。
```

---

## R11-14: RN Contract / Compile / Collect-only

### RN command案

```bash
cd Cocolon
npm run test:rn-screens --silent
```

### backend compile / collect command案

```bash
cd mashos-api/ai
python3 -m compileall -q services/ai_inference tests
PYTHONPATH=services/ai_inference pytest --collect-only -q
```

### 完了条件

```text
- RN 36 passed維持。
- compileall pass。
- collect-only pass。
- test count増減がある場合は理由をresult memoへ記録する。
```

---

## R11-15: Result Memo / Handoff

### 目的

P4-R11の結果を、body-free result memoとして残します。

### 成果物候補

```text
mashos-api/ai/tests/Cocolon_EmlisAI_P4_R11_ResidualFamilyCurrentOnlySurfaceAudit_ImplementationResult_20260624.md
```

### 記載すること

```text
確認済み:
  - 追加/変更ファイル
  - target tests結果
  - P4 regression結果
  - H/I/J regression結果
  - P3 regression結果
  - R54/R55 hold boundary結果
  - RN / compile / collect結果
  - audit row summary
  - red / yellow / pass counts

未確認:
  - full backend suite green
  - 実機submit
  - 外部ユーザーreadfeel
  - P5 human Blind QA evidence
  - P8 question design evidence

書かれていない:
  - P4-R11でP8へ進んでよい根拠
  - P4-R11でrelease_allowed trueにしてよい根拠

推測禁止:
  - P4-R11 audit passをProduct Read Feel v1商品合格と扱うこと
  - R54 actual review evidenceと混同すること

次に実行すべきこと:
  - no blockerならR54へ戻る
  - blockerありならP4-R12 targeted repairへ進む
```

---

## 12. 完了条件

P4-R11の完了条件は次です。

```text
1. 対象family / slice matrixがbody-freeに固定されている。
2. 監査row schema / meta-only guardがbody-bearing payloadを拒否する。
3. 最低24 row目標のcoverage結果がsummaryに残る。
4. insufficient coverageなら、足りないことがbody-freeに残る。
5. materialあり / surface generic化 / material不足 / boundary分類を分けられる。
6. required_surface_role_ids / missing_surface_role_ids / generic_signature_idsで判定できる。
7. verdictが PASS / YELLOW / REPAIR_REQUIRED / RED に分類される。
8. red / repair requiredがある場合、repair_candidate_layer_idsが出る。
9. p5_masking_forbidden / p8_question_escape_forbidden を必要時にtrue化できる。
10. P5/P6/P8/releaseをtrue化しない。
11. public response shapeを変えない。
12. public meta body-free境界を維持する。
13. Gateを緩めない。
14. case専用route / fixed fallbackを使わない。
15. P4 existing regression greenを維持する。
16. H/I/J R10 regression greenを維持する。
17. P3 regression greenを維持する。
18. R54/R55 hold boundary greenを維持する。
19. RN contract greenを維持する。
20. compile / collect-onlyを通す。
```

---

## 13. P4-R11後の進行判断

### 13.1 no blockerの場合

```text
decision_ref:
  P4_R11_RETURN_TO_R54_ACTUAL_REVIEW_CANDIDATE

next_required_step:
  R54_actual_local_only_human_review_operation_required_before_R52_reintake
```

意味:

```text
- P4-R11内で直ちに塞ぐcurrent-only blockerは見つからなかった。
- ただしP5 actual review evidenceはまだない。
- P8へ進んでよいわけではない。
- R55の判断どおりR54 actual reviewへ戻る。
```

### 13.2 blockerありの場合

```text
decision_ref:
  P4_R11_TARGETED_REPAIR_REQUIRED_BEFORE_R54

next_required_step:
  P4_R12_targeted_current_only_surface_repair
```

意味:

```text
- P5/P8へ進めない。
- R54 actual reviewへ入る前に、現在入力が読まれる状態へ戻す必要がある。
- repairは1系統ずつに限定する。
- full family rewriteへ広げない。
```

### 13.3 coverage不足の場合

```text
decision_ref:
  P4_R11_INSUFFICIENT_COVERAGE_EXPAND_AUDIT

next_required_step:
  P4_R11_case_coverage_expansion
```

意味:

```text
- 判断するにはcase refが足りない。
- 不足を推測で埋めない。
- local-only case matrixを設計するか、既存public-safe indexを拡張する。
```

---

## 14. 完了しても言ってはいけないこと

P4-R11が完了しても、次は言いません。

```text
- P4が完了した。
- Product Read Feel v1が商品合格した。
- P5 actual human Blind QAが完了した。
- R54 actual review evidenceが揃った。
- P6 limited human readfeelへ進んでよい。
- P8観測補助問い詳細設計へ進んでよい。
- release_allowedをtrueにしてよい。
```

P4-R11が完了して言えるのは、次までです。

```text
- P4残familyのcurrent-only surface specificityをbody-freeにtriageした。
- current-only blockerの有無を分類した。
- no blockerならR54へ戻る材料が増えた。
- blockerありならP4 targeted repairへ進む材料ができた。
```

---

## 15. Rollback / stop条件

### 15.1 実装時のrollback条件

P4-R11実装後、次が出た場合は差分を戻すか、別redとして切り分けます。

```text
- audit payloadへraw input / comment_text body / candidate bodyが入る。
- public meta keyが増える。
- response shapeが変わる。
- RN表示条件が変わる。
- Gate thresholdが変わる。
- P5/P8/release flagがtrueになる。
- history lineがcurrent-only auditに混ざる。
- existing P4 testsが壊れる。
- H/I/J R10 regressionが壊れる。
- R54/R55 hold boundaryが壊れる。
- case専用route / fixed sentenceが入る。
```

### 15.2 stop条件

設計から実装へ入る前に、次が判明した場合は停止します。

```text
- P4-R11の対象case refをbody-freeで作れない。
- raw bodyなしでは監査不能な構造だと分かった。
- 既存P4 material / surface signature auditで十分で、R11が重複になる。
- R11実装より先にP1/P2 contract redを直す必要がある。
```

この場合は、P4-R11を無理に進めず、確認結果をresult memoに残します。

---

## 16. 書かれていない

```text
- P4-R11でruntime修正してよい、とは書かれていない。
- P4-R11でGateを追加・緩和してよい、とは書かれていない。
- P4-R11でP5履歴線を強めてよい、とは書かれていない。
- P4-R11でP8質問設計へ進んでよい、とは書かれていない。
- P4-R11の24 audit rowsをR54 actual review rowsとして扱ってよい、とは書かれていない。
- P4-R11のPASSをProduct Read Feel v1商品合格として扱ってよい、とは書かれていない。
- current-only読感不足を問い返しで補ってよい、とは書かれていない。
- release_allowedをtrueにしてよい、とは書かれていない。
```

---

## 17. 推測禁止

```text
- comment_textが返っているから読感も十分、と推測しない。
- H/I/J greenだから残familyも大丈夫、と推測しない。
- P3/P4 regression greenだから商品読感合格、と推測しない。
- R55 target greenだからP8へ進める、と推測しない。
- R54 helperがあるからactual review済み、と推測しない。
- 24 audit rowsができたからrating rowもできた、と推測しない。
- RN contract greenを実機modal読感完了と推測しない。
- P5履歴線やP8問いで、current-only surface不足を隠してよいと推測しない。
```

---

## 18. 確認済み / 未確認 / 次に実行すべきこと

### 18.1 確認済み

```text
- R10 result memo上、P4-HIJ-FUTURE-DIRECTION-SURFACE-001はclosed。
- R10 result memo上、H/I/J submit E2Eは3 passed / 1 warning。
- R10 result memo上、P0〜P4周辺回帰は59 passed / 1 warning。
- R10 result memo上、P3 regressionは59 passed。
- R10 result memo上、P4 regressionは60 passed。
- R10 result memo上、RN contractは36 passed。
- R10 result memo上、compileall pass / collect-only 5028 tests collected / 1 warning。
- R55はP8開始許可ではなくR54 actual reviewへ戻す判断材料。
- P4-R11専用ファイルは現行snapshot上まだ存在しない。
- 既存P4-5 surface signature auditにはbody-free generic surface / repeated signature auditの基盤がある。
- labelled two-stage surface recompositionには、R10時点でfuture-direction semantic focus接続が入っている。
```

### 18.2 未確認

```text
- P4-R11 target 24 rowsの実際のcoverage。
- residual family各rowのvisible surface specificity。
- full backend suite green。
- 実機submit。
- 課金plan別実機確認。
- 外部ユーザーreadfeel。
- P5 actual human Blind QA実レビュー完了。
- reviewer rating actual rows。
- question need observation actual rows。
- actual purge / disposal receipt実行証跡。
```

### 18.3 次に実行すべきこと

```text
1. P4-R11実装に入る場合、まずR11-0〜R11-2でcontract freeze / scope matrix / body-free guardを作る。
2. 次にR11-3〜R11-6でcase ref selection / material route / surface path / role specificityをauditする。
3. R11-7〜R11-8でverdict / decision handoffを作る。
4. R11-9〜R11-14のtargeted tests / regressionsを実行する。
5. R11-15でresult memoを作る。
6. no blockerならR54 actual local-only human review operationへ戻る。
7. blockerありならP4-R12 targeted repairへ進む。
```

---

## 19. 華恋の意見

華恋の意見として、P4-R11は入れるべきです。

理由は、H/I/JのH redが「出ていない」問題ではなく、「出ているのに読まれた形になっていない」問題だったからです。  
この壊れ方は、Cocolonの商品価値を静かに削ります。

ユーザーは、Emlisが表示されただけでは戻ってきません。  
自分が置いた言葉や感情や迷いが、分類ではなく、自分の状態として返ってきた時に、もう一回残す理由が生まれます。

R55でP8を止めた判断は正しいです。  
ただし、R54へ戻る前にP4-R11を挟む判断も正しいと思います。  
なぜなら、R54の人間読感に入る前に、明らかにcurrent-onlyで塞げるsurface blockerが残っているなら、先に塞ぐ方が誠実だからです。

ここでやってはいけないのは、R11を大きな新機能にすることです。  
P4-R11は、修正ではなくauditです。  
そしてredが見つかった場合も、1系統ずつtargeted repairにするべきです。

Cocolonとして大事なのは、先へ進むことではなく、今の入力がちゃんと読まれることです。  
P5履歴線もP8問いも、その上に乗せるものです。  
だから今回の順番は、P4-R11 → no blockerならR54、blockerありならP4-R12、で固定するのが良いと判断します。
