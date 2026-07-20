# Cocolon / EmlisAI P6 Structure Insight v2 詳細設計書・実装順

作成日: 2026-06-11 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書  
基準: ローカル受領ファイル / `Cocolon_EmlisAI_P6_StructureInsight_PreDesignMemo_20260611.md` / `Cocolon_EmlisAI_longterm_roadmap_20260608`  
対象: Cocolon / EmlisAI / `/emotion/submit` immediate observation / `Emlisの観測` / Product Read Feel / User Label Connection / Structure Insight v2  
GitHub接続確認: なし（ローカル作業指定）  
コード変更: なし  
DB変更: なし  
RN変更: なし  
API route / request key / response top-level key変更: なし  
json / schema 実ファイル化: なし  

---

## 0. 本資料の結論

次の実装対象は、ロードマップ上の **P6: Structure Insight v2** とする。

ただし、P6を「深い分析文を本文へ増やす工程」として扱わない。  
P6の目的は、次である。

```text
ユーザーが現在入力で置いた出来事・感情・願い・詰まり・負荷・残り方の関係を、
断定せず、診断せず、行動指示にせず、
Emlisの観測の中で「関係が見える」形へ限定的に返す。
```

P6で守る順序は次で固定する。

```text
1. P4 current-only読感を壊さない。
2. P5履歴線が現在入力を隠していないことを確認する。
3. P6対象familyを限定する。
4. relation familyごとの危険度を固定する。
5. Structure Insight Gateを強める。
6. structure_questionから限定surface roleを接続する。
7. long_meaning_arc / self_understanding_followを別枠で確認する。
8. ratings-only QAで読感と安全性を見る。
9. P7へ進むか、P6継続か、P5/P4へ戻すかをbody-freeで判断する。
```

今回の詳細設計で固定する実装順は次である。

```text
P6-0: P5-7 handoff / P6 entry freeze
P6-1: existing Structure Insight inventory
P6-2: target family / no-connect family boundary
P6-3: relation family initial set / risk classification
P6-4: insight candidate quality rubric
P6-5: gate hardening / soft expression boundary
P6-6: limited surface role plan for structure_question
P6-7: long_meaning_arc / self_understanding_follow review
P6-8: ratings-only Product QA / Blind QA material
P6-9: regression / P7 hold decision
```

P6の完了は、release readyではない。  
P6の完了は、P7 Product Quality Runner / Long-run Gateへ渡してよい **body-freeな構造気づき評価材料** が揃うことである。

---

## 1. 作業種別と守る境界

### 1.1 今回の作業種別

```text
作業種別: 設計
成果物: md設計書
コード変更: しない
patch作成: しない
実装zip作成: しない
DB変更: しない
RN変更: しない
API route変更: しない
request / response key変更: しない
json/schema実ファイル追加: しない
fixture実ファイル追加: しない
```

本資料内にjson / schema案を含める。  
ただし、実装段階で次を確認してから、Python module内のcontractにするか、JSON schemaへ分離するか、fixtureにするか、または実ファイル化しないかを判断する。

```text
- 既存module signature
- 既存fixture配置
- 既存meta-only guard
- 既存test import path
- raw input / comment_text bodyを含む可能性
- public meta / scorecardへ渡してよいmaterialかどうか
- P5-7 handoff summaryとの整合
- P7 long-run product gateへ渡すfield名の整合
```

### 1.2 P6で変更しないもの

```text
RN production UI
RN表示タイトル `Emlisの観測`
RN表示条件 `observation_status == passed && comment_text non-empty`
/emotion/submit route
request key
public response top-level key
DB physical schema
DB write path
account delete / access policy
subscription entitlement判定
public meta sanitizerのbody-free方針
input_feedback.comment_text が唯一のpublic visible bodyである境界
Display / Runtime / Visible / Grounding / Reader / Template / Safety Gate の既存閾値
User Label Connection P5のFree / Plus / Premium境界
P5 limited visible connectionの安全境界
```

P6で変更してよい候補はbackend internalのみである。

```text
P6 entry freeze summary
P6 Structure Insight inventory summary
P6 family boundary
P6 relation policy
P6 quality rubric
P6 gate hardening summary
P6 limited surface role plan
P6 ratings-only review
P6 regression / P7 hold decision
```

### 1.3 P6で絶対にしないこと

```text
- `structure_insight_text` / `insight_text` などのpublic visible body keyを増やす。
- RN側で `見えたこと` / `Emlisから` をparseして分岐する。
- `input_feedback.comment_text` 以外をRN visible bodyにする。
- Structure Insight Gate / Visible Surface Gate / Display Gateを緩める。
- 良い例文をruntime固定文として追加する。
- case専用mode / cue / surfaceを追加する。
- P4 current-only読感不足をP6 insightで覆う。
- P5履歴線の弱さをP6 insightで覆う。
- P6 insightをP5 history lineの代替として使う。
- daily / low-information / positive-onlyへ深いinsightを強制する。
- safety adjacent / emergency safetyを通常観測としてpassed化する。
- 1件の入力から期間傾向や人格傾向を作る。
- user dictionary / historyを事実断定に使う。
- 診断、人格分類、原因断定、相手意図断定、未来予測、行動指示へ寄せる。
- raw input / memo / memo_action / emotion_details / evidence text / comment_text body / candidate body / surface bodyをpublic metaやscorecardへ入れる。
- Machine metricsでread_feeling / insight_deltaを自動補完する。
- P6完了をrelease_allowedに変換する。
```

---

## 2. 参照・確認範囲

### 2.1 参照したローカル添付

```text
Cocolon_EmlisAI_P6_StructureInsight_PreDesignMemo_20260611(1).md
```

### 2.2 作業姿勢として確認した資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
```

### 2.3 判断に直接関係して確認した資料

```text
Cocolon_EmlisAI_longterm_roadmap_20260608
EmlisAIの実装済み資料/Cocolon_EmlisAI_P5_UserLabelConnection_DetailedDesign_ImplementationOrder_20260611.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P4_FamilyProductTuning_DetailedDesign_ImplementationOrder_20260610.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_商品読感評価基準_構造気づき到達点_詳細設計書_実装順_華恋用_2026-06-01.md
Cocolon_前提資料/07_latest_snapshot_diff.md
Cocolon_前提資料/01_cocolon_overall_structure.md
Cocolon_前提資料/02_cocolon_national_system.md
```

### 2.4 主に確認した実ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_p5_regression_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_candidate.py
mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_surface.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_long_run_product_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py
mashos-api/ai/services/ai_inference/emlis_ai_two_stage_section_surface_plan.py
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
Cocolon/screens/input/inputFeedbackModel.js
Cocolon/tests/rn-screen-contracts.test.js
```

### 2.5 未確認として残すもの

今回の環境では、`pytest` が見つからなかったため、最新zipに対する実測greenは確認していない。  
したがって、本設計書では「最新実測で通った」とは書かない。

未確認:

```text
P5-7 regression handoffの最新実測green
Structure Insight candidate / gate / surface の最新実測green
RN contractの最新実測green
実機submitでのP5履歴線表示後の読感
P6対象familyでの実際のcomment_text読感
P6導入後にdaily / low-infoへ深いinsightが漏れないこと
```

---

## 3. 現在地の読み

### 3.1 P6へ進む理由

検討メモの判断どおり、次に進める段階はP6である。

理由:

```text
- P0/P1の主眼である表示到達性は、複数の回復・public feedback arrival工程で前提資料に反映済み。
- P3/P4の主眼であるcurrent-only Product Read Feelとfamily tuningは、P4-0〜P4-10として前提資料に反映済み。
- P5 User Label Connectionは、P5-0〜P5-7としてbackend内部へ反映済み。
- P5-7にはP6 ready / P6 hold / P5 continue / P4 returnの判断境界がある。
- ロードマップ上、P6は復唱を超えた安全な気づきを返す段階である。
```

ただし、P6の開始は「既存Structure Insight surfaceがあるから完了」ではない。  
既存Phase7/9/10は内部材料・Gate・限定surfaceの土台であり、P6では商品体験としての接続条件を再固定する。

### 3.2 P6で扱う価値

P6の価値は、深い言葉そのものではない。  
P6の価値は、ユーザーが書いた材料同士の関係を外側から見られることにある。

P6で返したいもの:

```text
出来事と反応の結びつき
願いと停滞の衝突
努力と残った疲れの関係
怒りの奥にある大事な線
不安と行動できなさの重なり
長文に含まれる複数核の位置関係
自己理解しようとしている動きと、言い切れなさの同居
```

P6で返してはいけないもの:

```text
診断
人格分類
原因特定
相手意図の断定
未来予測
行動指示
期間傾向
「あなたはいつも」
「本当は」
「原因は」
```

### 3.3 P6とP5の違い

P5:

```text
current input + owned history から、記録の線を安全に返す。
```

P6:

```text
current inputの材料同士の関係から、安全な気づき候補を返す。
```

P6はP5を置換しない。  
P5の履歴線が弱いからP6で深く見せる、という使い方は禁止する。

### 3.4 P6とProduct Read Feel v1の違い

Product Read Feel v1:

```text
ユーザーが入力した材料が漏れなく読まれ、温度を持って返る。
```

Structure Insight v2:

```text
入力材料同士の関係が、断定されず、安全な気づきとして返る。
```

P6はv1の上に乗る。  
v1の読感不足をv2で隠してはいけない。

---

## 4. P6全体アーキテクチャ

P6は、既存のEmlisAI immediate reply flowを変えず、backend内部に以下の評価・接続境界を置く。

```text
P5-7 handoff / P4-P5 preservation
  -> P6 entry freeze
  -> Existing Structure Insight inventory
  -> Target family boundary
  -> Relation family policy
  -> Insight candidate quality rubric
  -> Gate hardening
  -> Limited surface role plan
  -> Ratings-only QA
  -> Regression / P7 hold decision
```

visible surfaceへ入る場合も、既存 `input_feedback.comment_text` の中に、既存二段構造の一部として入る。  
新しいpublic response keyは作らない。

### 4.1 実装候補ファイル

実装段階では、差分が小さい方を選ぶ。  
新規module候補は次である。

```text
mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_p6_entry_freeze.py
mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_p6_inventory.py
mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_p6_family_boundary.py
mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_p6_relation_policy.py
mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_p6_quality_rubric.py
mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_p6_gate_hardening.py
mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_p6_surface_role_plan.py
mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_p6_product_quality_review.py
mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_p6_regression_handoff.py
```

既存moduleへ統合する場合の候補:

```text
emlis_ai_structure_insight_candidate.py
emlis_ai_structure_insight_gate.py
emlis_ai_structure_insight_surface.py
emlis_ai_complete_surface_realizer.py
emlis_ai_two_stage_section_surface_plan.py
emlis_ai_product_readfeel_long_run_product_gate.py
emlis_ai_runtime_surface_blind_qa_long_run.py
```

test候補:

```text
mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_entry_freeze_20260611.py
mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_inventory_20260611.py
mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_family_boundary_20260611.py
mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_relation_policy_20260611.py
mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_quality_rubric_20260611.py
mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_gate_hardening_20260611.py
mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_surface_role_plan_20260611.py
mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_product_quality_review_20260611.py
mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_regression_handoff_20260611.py
```

fixture候補:

```text
mashos-api/ai/tests/fixtures/emlis_ai_structure_insight_p6_cases_20260611.py
mashos-api/ai/tests/fixtures/emlis_ai_structure_insight_p6_ratings_review_20260611.py
```

fixtureを実ファイル化するかは、実装段階でbody-free性と既存fixture配置を見て判断する。

---

## 5. P6実装順

### P6-0: P5-7 handoff / P6 entry freeze

#### 目的

P5-7 handoffを受け、P6に進めるかをbody-freeで固定する。  
この段階では、Structure Insightの新しいsurfaceを作らない。

#### 入力材料

```text
P5-7 regression handoff summary
P4 regression handoff summary
P5 limited visible connection summary
P5 product quality review summary
P5 safety guard summary
P6 candidate family scope
required regression suite statuses
```

#### 実装候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_p6_entry_freeze.py
mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_entry_freeze_20260611.py
```

既存moduleへ寄せる場合:

```text
emlis_ai_user_label_connection_p5_regression_handoff.py
```

#### 判定

```text
p6_entry_allowed
p6_entry_hold
p5_return_required
p4_return_required
```

P6 entry allowed条件:

```text
- P5-7 handoff decision == p6_ready
- P5 limited visible connection ready
- current_input_not_masked_by_history == true
- creepy / overclaim / self-blame risk not increased
- P6 target family scope is limited
- required regression statuses are green or explicitly carried as not-yet-executed hold
- raw text payloadなし
- public contract mutationなし
```

P6 hold条件:

```text
- P5は保たれているが、P6 target familyが未固定
- required regressionが未実行
- Structure Insight inventory未確認
- P6 relation policy未固定
```

P5 return条件:

```text
- P5 limited visible connection not ready
- current input masked by history
- creepy / overclaim / self-blame risk increased
- P5がdeep insight substituteとして使われている
```

P4 return条件:

```text
- P4 current-only readfeel regression not preserved
- Product Read Feel P4 required regression not green
```

#### 完了条件

```text
- P6 entry allowed / hold / P5 return / P4 returnを分類できる。
- release_allowedを立てない。
- public response keyを増やさない。
- raw input / comment_text body / candidate bodyを含まない。
```

---

### P6-1: existing Structure Insight inventory

#### 目的

既存Structure Insight系moduleを、ロードマップP6の観点で棚卸しする。  
既存Phase7/9/10とロードマップP6を混同しない。

#### 対象

```text
emlis_ai_structure_insight_candidate.py
emlis_ai_structure_insight_gate.py
emlis_ai_structure_insight_surface.py
emlis_ai_complete_surface_realizer.py
emlis_ai_two_stage_section_surface_plan.py
emlis_ai_product_readfeel_long_run_product_gate.py
emlis_ai_runtime_surface_blind_qa_long_run.py
emlis_ai_mirror_only_surface_detector.py
```

#### 実装候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_p6_inventory.py
mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_inventory_20260611.py
```

#### 棚卸し観点

```text
- candidate materialはmeta-onlyか。
- Gateはsoft expression / diagnosis / personality / cause / advice / target judgementを止めるか。
- limited surfaceは対象familyを限定しているか。
- daily / low-infoへのdeep insight suppressionがあるか。
- complete realizerが新しいpublic response keyを書かないか。
- long-run product gateがv1 Product Pass候補とv2 Structure Insight Readyを分けるか。
- release_allowedを立てないか。
```

#### 完了条件

```text
- 既存moduleの流用範囲と拡張範囲を分類できる。
- 新規moduleが必要な箇所と既存拡張で足りる箇所を分けられる。
- body-free inventory summaryを作れる。
```

---

### P6-2: target family / no-connect family boundary

#### 目的

P6を出してよいfamilyと、出してはいけないfamilyを固定する。  
この段階でdaily / low-info / safetyへの漏れを止める。

#### 初期接続対象

```text
structure_question
long_meaning_arc
self_understanding_follow
```

#### 初期接続しない対象

```text
daily_unpleasant
daily_positive
positive_only
low_information
limited_grounding
safety_triage_required
emergency_safety
target_judgement
self_denial_safety_adjacent
anger_attack_or_target_blame
source_unavailable
```

#### 実装候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_p6_family_boundary.py
mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_family_boundary_20260611.py
```

#### 判定

```text
allow_limited_surface
meta_only
hold
block
```

allow条件:

```text
- family in {structure_question, long_meaning_arc, self_understanding_follow}
- material_quality == eligible
- current input grounded
- observation_status passed candidateへ接続可能
- Gate通過前に本文生成しない
```

block条件:

```text
- low_information
- safety_triage_required
- emergency safety
- target judgement
- daily / positive only
- user dictionary fact assertion required
- current input evidence不足
```

#### 完了条件

```text
- P6対象familyだけallow候補になる。
- daily / low-info / positive-only / safety adjacentはdeep insight blockedになる。
- block理由をsafe identifierで返せる。
- raw inputや本文をsummaryへ含めない。
```

---

### P6-3: relation family initial set / risk classification

#### 目的

P6で扱うrelation familyの初期セットと危険度を固定する。  
relation familyを増やしすぎず、安全に接続できるものから始める。

#### 初期allow候補

```text
desire_blockage_conflict
effort_residue
mixed_emotion_coexistence
long_arc_multiple_core
uncertainty_effort_pair
```

#### review候補

```text
value_line_crossed
self_denial_identity_split
fear_load_pair
event_reaction_link
positive_change_recovery
```

#### 初期visibleではblock / meta-only候補

```text
low_information_unspecified_weight
target_judgement_agreement
history_fact_line_as_insight
period_tendency_from_single_record
user_dictionary_fact_claim
```

#### 実装候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_p6_relation_policy.py
mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_relation_policy_20260611.py
```

#### risk classification

```text
low:
  desire_blockage_conflict
  effort_residue
  mixed_emotion_coexistence
  long_arc_multiple_core
  uncertainty_effort_pair

medium:
  event_reaction_link
  positive_change_recovery
  fear_load_pair

high:
  value_line_crossed
  self_denial_identity_split

blocked:
  low_information_unspecified_weight
  target_judgement_agreement
  period_tendency_from_single_record
  user_dictionary_fact_claim
```

#### 完了条件

```text
- relation familyごとにallow / review / blockを返せる。
- high risk relationはP6-6で自動visibleにしない。
- target judgement / self-denial / low-info overreadを別理由で止められる。
```

---

### P6-4: insight candidate quality rubric

#### 目的

P6候補が「入力の関係を見せているか」をratings-onlyで評価するrubricを固定する。  
machine metricsでread_feelingやinsight_deltaを自動補完しない。

#### 実装候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_p6_quality_rubric.py
mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_quality_rubric_20260611.py
```

#### 評価軸

```text
structure_insight_candidate_quality
insight_delta
current_input_grounded
relation_visibility
read_feeling
non_template
naturalness
soft_expression_quality
overclaim_absence
diagnosis_absence
personality_claim_absence
cause_claim_absence
advice_absence
future_prediction_absence
target_judgement_absence
self_blame_non_amplification
mirror_only_reduction
creepy_absence
wants_more_input_or_accumulation
```

#### 目標値

```text
structure_insight_candidate_quality >= 0.90
insight_delta >= 0.85
current_input_grounded >= 0.95
relation_visibility >= 0.90
read_feeling >= 0.90
non_template >= 0.90
naturalness >= 0.90
soft_expression_quality >= 0.95
overclaim_absence >= 0.95
diagnosis_absence == 1.0
personality_claim_absence == 1.0
cause_claim_absence == 1.0
advice_absence == 1.0
future_prediction_absence == 1.0
target_judgement_absence == 1.0
self_blame_non_amplification >= 0.95
creepy_absence >= 0.95
wants_more_input_or_accumulation >= 0.85
```

#### verdict

```text
RED:
  unsafe claim / diagnosis / personality / cause / advice / target judgement / raw text leak

REPAIR_REQUIRED:
  soft marker missing / insight too shallow / mirror-only / family mismatch

YELLOW:
  safeだが商品価値が弱い / insight_delta不足 / naturalness不足

PASS:
  safeでP6候補として成立

STRUCTURE_INSIGHT_READY:
  P6候補として複数条件を満たし、P7 long-runへ渡せる
```

#### 完了条件

```text
- ratings-only rowを作れる。
- raw text / comment_text body / candidate bodyを含めない。
- machine metricsによるread_feeling自動補完を禁止できる。
```

---

### P6-5: gate hardening / soft expression boundary

#### 目的

既存Structure Insight Gateを、P6の商品接続前提として強化する。  
Gateは表示率を上げるために緩めない。

#### 実装候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_p6_gate_hardening.py
mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_gate_hardening_20260611.py
```

既存moduleへ寄せる場合:

```text
emlis_ai_structure_insight_gate.py
```

#### 必須block

```text
soft_expression_missing
diagnosis_surface
personality_claim_surface
cause_claim_without_evidence_surface
advice_surface
future_prediction_surface
period_tendency_from_single_record_surface
target_judgement_agreement_surface
target_intent_assertion_surface
self_denial_identity_claim_as_fact_surface
low_information_overread_surface
user_dictionary_fact_claim_blocked
history_fact_assertion_surface
raw_text_payload_detected
comment_text_body_in_meta_detected
public_contract_mutation_detected
gate_relaxation_detected
```

#### soft expression

P6 visible候補には、soft markerを必須にする。

許容方向:

```text
ように見えます
かもしれません
ではないでしょうか
重なっているように見えます
残っているのかもしれません
```

ただし、soft markerだけでは合格にしない。  
soft markerがあっても、診断・原因・人格・相手意図・行動指示があればblockする。

#### 完了条件

```text
- unsafe insight surfaceをblockできる。
- soft expressionなしをblockできる。
- daily / low-info / safety adjacentをdeep insightへ昇格しない。
- Gateがcomment_textを書かない。
- Gateがpublic response keyを増やさない。
```

---

### P6-6: limited surface role plan for structure_question

#### 目的

最初のvisible接続対象を `structure_question` に絞り、P6 surface role planを固定する。  
ここで初めて、限定surfaceを本文接続候補として扱う。

#### 実装候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_p6_surface_role_plan.py
mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_surface_role_plan_20260611.py
```

既存moduleへ寄せる場合:

```text
emlis_ai_structure_insight_surface.py
emlis_ai_complete_surface_realizer.py
emlis_ai_two_stage_section_surface_plan.py
```

#### surface role

```text
observation_insight_seed
structure_insight_temperature_support
soft_inference_surface_required
current_input_grounded_relation
not_personality_boundary
not_cause_boundary
```

#### section placement

原則:

```text
見えたこと:
  P6 insight seedを1つまで入れてよい。

Emlisから:
  insightを押しつけず、受け取り温度・安全境界を返す。
```

P6 insight seedは、観測全体の主役にしない。  
既存の状態回答と人間的フォローを壊さず、観測内に一段だけ関係を見せる。

#### structure_questionで許容する関係

```text
desire_blockage_conflict
effort_residue
mixed_emotion_coexistence
uncertainty_effort_pair
```

#### structure_questionで初期blockする関係

```text
self_denial_identity_split
value_line_crossed with target judgement risk
low_information_unspecified_weight
period_tendency_from_single_record
history_fact_line_as_insight
```

#### 完了条件

```text
- structure_questionだけにlimited surface role planを接続できる。
- observation sectionにinsight seed 1件まで。
- reception sectionで押しつけを緩める。
- fixed sentence templateを増やさない。
- Gateを通らないsurfaceは本文へ出ない。
```

---

### P6-7: long_meaning_arc / self_understanding_follow review

#### 目的

`structure_question` でP6 surface role planを固定した後、`long_meaning_arc` と `self_understanding_follow` を別枠で評価する。

#### 実装候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_p6_family_review.py
mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_family_review_20260611.py
```

または、P6-6のsurface role planへfamily reviewを統合する。

#### long_meaning_arc

扱うもの:

```text
複数核
願いと詰まり
行動と反応の時間差
回復と不安の同居
言葉にしようとしている自己理解の流れ
```

注意:

```text
長文を要約しすぎない。
全文整理をP6 insightと呼ばない。
複数核を人格傾向にしない。
```

#### self_understanding_follow

扱うもの:

```text
わからないと言いながら見ようとしている動き
言い切れなさと観測意欲の同居
自己理解要求と不安の関係
```

注意:

```text
self_denial_identity_splitは初期visibleでは慎重に扱う。
自己否定を本人の事実にしない。
「本当はあなたは」と言わない。
```

#### 完了条件

```text
- long_meaning_arc / self_understanding_followのallow / hold / blockを分類できる。
- high risk relationはreviewに残せる。
- structure_questionでできたsurface planを雑に横展開しない。
```

---

### P6-8: ratings-only Product QA / Blind QA material

#### 目的

P6候補をratings-onlyで評価し、P7へ渡せるbody-free材料にする。  
ここでは実ユーザー本文やcomment_text bodyを保存しない。

#### 実装候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_p6_product_quality_review.py
mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_product_quality_review_20260611.py
```

fixture候補:

```text
mashos-api/ai/tests/fixtures/emlis_ai_structure_insight_p6_ratings_review_20260611.py
```

#### review対象

```text
structure_question
long_meaning_arc
self_understanding_follow
no-connect family regression
high-risk relation hold cases
```

#### ratings-only row

rowに含めてよいもの:

```text
case_id
family
relation_family
surface_role
verdict
rating numbers
safe reason codes
body-free flags
public contract flags
```

rowに含めてはいけないもの:

```text
raw input
memo
memo_action
emotion_details raw body
comment_text
surface text
candidate body
reviewer free text
terminal output
```

#### 完了条件

```text
- P6 ratings-only review summaryを作れる。
- unsafe / weak / ready を分けられる。
- P7 long-runへ渡すfield候補をbody-freeで作れる。
- release_allowedを立てない。
```

---

### P6-9: regression / P7 hold decision

#### 目的

P6がP4/P5/RN/public contractを壊していないことを確認し、P7へ進めるか、P6を続けるか、P5/P4へ戻すかを判断する。

#### 実装候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_p6_regression_handoff.py
mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_regression_handoff_20260611.py
```

#### 必須regression候補

```text
P6 new tests
Structure Insight existing tests
P5 regression handoff tests
P5 limited visible connection tests
P5 Product Quality review tests
P4 regression handoff tests
Product Read Feel P4 tests
Public feedback meta tests
Display contract tests
Two-stage reception E2E
RN contract tests
Free tier boundary tests
Low information boundary tests
No raw text meta tests
```

#### 判定

```text
p7_ready
p7_hold
p6_continue
p5_return
p4_return
```

P7 ready条件:

```text
- P6 target family boundary green
- P6 relation policy green
- P6 gate hardening green
- P6 structure_question limited surface role plan green
- P6 ratings-only QA has STRUCTURE_INSIGHT_READY candidates
- no-connect family regression green
- unsafe insight count == 0
- public contract unchanged
- body-free summary
- release_allowed == false
```

P7 hold条件:

```text
- P6は安全だがratings件数不足
- long_meaning_arc / self_understanding_follow未評価
- long-run sequence未評価
- manual read-feel未確認
```

P6 continue条件:

```text
- insight_delta不足
- mirror-only reduction不足
- soft expressionはあるが読感が弱い
- allowed familyでYELLOWが多い
```

P5 return条件:

```text
- P6がP5履歴線を覆っている
- current inputがhistory/insightで隠れている
- creepy riskが増えている
```

P4 return条件:

```text
- current-only readfeel regression
- family tuningの読感が崩れた
- no-connect familyへdeep insightが漏れた
```

#### 完了条件

```text
- P7 ready / hold / P6 continue / P5 return / P4 returnをbody-freeで判断できる。
- Product Pass候補とRelease Readyを混同しない。
- release_allowedを立てない。
```

---

## 6. json / schema案

この章のschema案は、実装段階で実ファイル化するかを判断する。  
現時点ではmd内の設計案であり、json/schemaファイルは作成しない。

### 6.1 `cocolon.emlis.structure_insight.p6_entry_freeze.v1`

```json
{
  "$id": "cocolon.emlis.structure_insight.p6_entry_freeze.v1",
  "type": "object",
  "required": [
    "schema_version",
    "step",
    "source",
    "p6_entry_allowed",
    "p6_entry_hold",
    "p5_return_required",
    "p4_return_required",
    "decision_reason_codes",
    "public_contract",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.structure_insight.p6_entry_freeze.v1"
    },
    "step": {
      "const": "P6-0_P5Handoff_P6EntryFreeze"
    },
    "source": {
      "type": "string"
    },
    "p5_7_handoff_decision": {
      "enum": ["p6_ready", "p6_hold", "p5_continue", "p4_return", "unknown"]
    },
    "p5_limited_visible_connection_ready": {
      "type": "boolean"
    },
    "current_input_not_masked_by_history": {
      "type": "boolean"
    },
    "creepy_overclaim_self_blame_risk_not_increased": {
      "type": "boolean"
    },
    "p6_target_family_scope_limited": {
      "type": "boolean"
    },
    "all_required_regression_green": {
      "type": "boolean"
    },
    "p6_entry_allowed": {
      "type": "boolean"
    },
    "p6_entry_hold": {
      "type": "boolean"
    },
    "p5_return_required": {
      "type": "boolean"
    },
    "p4_return_required": {
      "type": "boolean"
    },
    "decision_reason_codes": {
      "type": "array",
      "items": { "type": "string" }
    },
    "public_contract": {
      "type": "object",
      "required": [
        "rn_visible_contract_changed",
        "response_shape_changed",
        "public_response_key_added",
        "db_schema_changed",
        "release_allowed"
      ],
      "properties": {
        "rn_visible_contract_changed": { "const": false },
        "response_shape_changed": { "const": false },
        "public_response_key_added": { "const": false },
        "db_schema_changed": { "const": false },
        "release_allowed": { "const": false }
      }
    },
    "body_free": {
      "type": "object",
      "required": [
        "raw_input_included",
        "raw_text_included",
        "comment_text_body_included",
        "candidate_body_included",
        "surface_body_included",
        "history_raw_text_included"
      ],
      "properties": {
        "raw_input_included": { "const": false },
        "raw_text_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "candidate_body_included": { "const": false },
        "surface_body_included": { "const": false },
        "history_raw_text_included": { "const": false }
      }
    }
  }
}
```

### 6.2 `cocolon.emlis.structure_insight.p6_family_boundary.v1`

```json
{
  "$id": "cocolon.emlis.structure_insight.p6_family_boundary.v1",
  "type": "object",
  "required": [
    "schema_version",
    "step",
    "family",
    "decision",
    "allowed_target_family",
    "no_connect_reason_codes",
    "public_contract",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.structure_insight.p6_family_boundary.v1"
    },
    "step": {
      "const": "P6-2_TargetFamilyNoConnectBoundary"
    },
    "family": {
      "type": "string"
    },
    "decision": {
      "enum": ["allow_limited_surface", "meta_only", "hold", "block"]
    },
    "allowed_target_family": {
      "type": "boolean"
    },
    "allowed_families": {
      "type": "array",
      "items": {
        "enum": ["structure_question", "long_meaning_arc", "self_understanding_follow"]
      }
    },
    "no_connect_reason_codes": {
      "type": "array",
      "items": { "type": "string" }
    },
    "no_deep_insight_for_daily": {
      "const": true
    },
    "no_deep_insight_for_low_information": {
      "const": true
    },
    "no_deep_insight_for_safety_adjacent": {
      "const": true
    },
    "public_contract": {
      "type": "object",
      "properties": {
        "public_response_key_added": { "const": false },
        "rn_visible_contract_changed": { "const": false },
        "response_shape_changed": { "const": false }
      }
    },
    "body_free": {
      "type": "object",
      "properties": {
        "raw_text_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "surface_body_included": { "const": false }
      }
    }
  }
}
```

### 6.3 `cocolon.emlis.structure_insight.p6_relation_policy.v1`

```json
{
  "$id": "cocolon.emlis.structure_insight.p6_relation_policy.v1",
  "type": "object",
  "required": [
    "schema_version",
    "step",
    "relation_family",
    "risk_level",
    "visibility_decision",
    "gate_required",
    "forbidden_claims",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.structure_insight.p6_relation_policy.v1"
    },
    "step": {
      "const": "P6-3_RelationFamilyInitialSetRiskClassification"
    },
    "relation_family": {
      "type": "string"
    },
    "risk_level": {
      "enum": ["low", "medium", "high", "blocked"]
    },
    "visibility_decision": {
      "enum": ["allow_initial_visible", "review_required", "meta_only", "blocked"]
    },
    "gate_required": {
      "type": "array",
      "items": { "type": "string" }
    },
    "forbidden_claims": {
      "type": "array",
      "items": {
        "enum": [
          "diagnosis",
          "personality_claim",
          "cause_claim_without_evidence",
          "advice",
          "future_prediction",
          "target_judgement_agreement",
          "period_tendency_from_single_record",
          "user_dictionary_fact_claim"
        ]
      }
    },
    "body_free": {
      "type": "object",
      "properties": {
        "raw_input_included": { "const": false },
        "raw_text_included": { "const": false },
        "candidate_body_included": { "const": false },
        "surface_body_included": { "const": false }
      }
    }
  }
}
```

### 6.4 `cocolon.emlis.structure_insight.p6_quality_rubric.v1`

```json
{
  "$id": "cocolon.emlis.structure_insight.p6_quality_rubric.v1",
  "type": "object",
  "required": [
    "schema_version",
    "step",
    "ratings_only",
    "dimension_targets",
    "verdict_policy",
    "machine_metrics_do_not_fill_read_feeling",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.structure_insight.p6_quality_rubric.v1"
    },
    "step": {
      "const": "P6-4_InsightCandidateQualityRubric"
    },
    "ratings_only": {
      "const": true
    },
    "dimension_targets": {
      "type": "object",
      "properties": {
        "structure_insight_candidate_quality": { "type": "number" },
        "insight_delta": { "type": "number" },
        "current_input_grounded": { "type": "number" },
        "relation_visibility": { "type": "number" },
        "read_feeling": { "type": "number" },
        "non_template": { "type": "number" },
        "naturalness": { "type": "number" },
        "soft_expression_quality": { "type": "number" },
        "overclaim_absence": { "type": "number" },
        "diagnosis_absence": { "type": "number" },
        "personality_claim_absence": { "type": "number" },
        "cause_claim_absence": { "type": "number" },
        "advice_absence": { "type": "number" },
        "future_prediction_absence": { "type": "number" },
        "target_judgement_absence": { "type": "number" },
        "self_blame_non_amplification": { "type": "number" },
        "mirror_only_reduction": { "type": "number" },
        "creepy_absence": { "type": "number" },
        "wants_more_input_or_accumulation": { "type": "number" }
      }
    },
    "verdict_policy": {
      "type": "object",
      "properties": {
        "red_on_unsafe_claim": { "const": true },
        "repair_required_on_soft_marker_missing": { "const": true },
        "yellow_allowed_without_product_pass": { "const": true },
        "structure_insight_ready_is_not_release_ready": { "const": true }
      }
    },
    "machine_metrics_do_not_fill_read_feeling": {
      "const": true
    },
    "body_free": {
      "type": "object",
      "properties": {
        "raw_text_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "reviewer_free_text_included": { "const": false }
      }
    }
  }
}
```

### 6.5 `cocolon.emlis.structure_insight.p6_surface_role_plan.v1`

```json
{
  "$id": "cocolon.emlis.structure_insight.p6_surface_role_plan.v1",
  "type": "object",
  "required": [
    "schema_version",
    "step",
    "family",
    "surface_plan_kind",
    "section_order",
    "max_insight_seed_count",
    "must_include_roles",
    "must_not_include_roles",
    "public_contract",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.structure_insight.p6_surface_role_plan.v1"
    },
    "step": {
      "const": "P6-6_LimitedSurfaceRolePlanForStructureQuestion"
    },
    "family": {
      "enum": ["structure_question", "long_meaning_arc", "self_understanding_follow"]
    },
    "surface_plan_kind": {
      "enum": ["limited_structure_insight_seed", "meta_only", "blocked"]
    },
    "section_order": {
      "type": "array",
      "items": {
        "enum": ["current_observation", "structure_insight_seed", "human_reception", "safety_boundary"]
      }
    },
    "max_insight_seed_count": {
      "const": 1
    },
    "must_include_roles": {
      "type": "array",
      "items": { "type": "string" }
    },
    "must_not_include_roles": {
      "type": "array",
      "items": {
        "enum": [
          "diagnosis",
          "personality_label",
          "cause_answer",
          "advice",
          "future_prediction",
          "target_judgement",
          "history_fact_assertion"
        ]
      }
    },
    "public_contract": {
      "type": "object",
      "properties": {
        "public_response_key_added": { "const": false },
        "rn_visible_contract_changed": { "const": false },
        "fixed_sentence_template_added": { "const": false }
      }
    },
    "body_free": {
      "type": "object",
      "properties": {
        "surface_body_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "candidate_body_included": { "const": false },
        "raw_text_included": { "const": false }
      }
    }
  }
}
```

### 6.6 `cocolon.emlis.structure_insight.p6_product_quality_review.v1`

```json
{
  "$id": "cocolon.emlis.structure_insight.p6_product_quality_review.v1",
  "type": "object",
  "required": [
    "schema_version",
    "step",
    "ratings_only",
    "review_count",
    "dimension_averages",
    "verdict_counts",
    "structure_insight_ready_candidate_count",
    "blocker_reason_codes",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.structure_insight.p6_product_quality_review.v1"
    },
    "step": {
      "const": "P6-8_RatingsOnlyProductQABlindQAMaterial"
    },
    "ratings_only": {
      "const": true
    },
    "review_count": {
      "type": "integer",
      "minimum": 0
    },
    "dimension_averages": {
      "type": "object"
    },
    "verdict_counts": {
      "type": "object",
      "properties": {
        "RED": { "type": "integer" },
        "REPAIR_REQUIRED": { "type": "integer" },
        "YELLOW": { "type": "integer" },
        "PASS": { "type": "integer" },
        "STRUCTURE_INSIGHT_READY": { "type": "integer" }
      }
    },
    "structure_insight_ready_candidate_count": {
      "type": "integer",
      "minimum": 0
    },
    "blocker_reason_codes": {
      "type": "array",
      "items": { "type": "string" }
    },
    "body_free": {
      "type": "object",
      "properties": {
        "raw_input_included": { "const": false },
        "raw_text_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "candidate_body_included": { "const": false },
        "surface_body_included": { "const": false },
        "reviewer_free_text_included": { "const": false }
      }
    }
  }
}
```

### 6.7 `cocolon.emlis.structure_insight.p6_regression_handoff.v1`

```json
{
  "$id": "cocolon.emlis.structure_insight.p6_regression_handoff.v1",
  "type": "object",
  "required": [
    "schema_version",
    "step",
    "handoff_decision",
    "p7_ready",
    "p7_hold",
    "p6_continue",
    "p5_return",
    "p4_return",
    "decision_reason_codes",
    "required_regression_summary",
    "public_contract",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.structure_insight.p6_regression_handoff.v1"
    },
    "step": {
      "const": "P6-9_RegressionP7HoldDecision"
    },
    "handoff_decision": {
      "enum": ["p7_ready", "p7_hold", "p6_continue", "p5_return", "p4_return"]
    },
    "p7_ready": { "type": "boolean" },
    "p7_hold": { "type": "boolean" },
    "p6_continue": { "type": "boolean" },
    "p5_return": { "type": "boolean" },
    "p4_return": { "type": "boolean" },
    "decision_reason_codes": {
      "type": "array",
      "items": { "type": "string" }
    },
    "required_regression_summary": {
      "type": "object"
    },
    "public_contract": {
      "type": "object",
      "properties": {
        "public_response_key_added": { "const": false },
        "response_shape_changed": { "const": false },
        "rn_visible_contract_changed": { "const": false },
        "db_schema_changed": { "const": false },
        "release_allowed": { "const": false },
        "public_release_applied": { "const": false }
      }
    },
    "body_free": {
      "type": "object",
      "properties": {
        "raw_input_included": { "const": false },
        "raw_text_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "candidate_body_included": { "const": false },
        "surface_body_included": { "const": false },
        "terminal_output_included": { "const": false }
      }
    }
  }
}
```

---

## 7. test plan

実装段階でのfocused test候補は次である。

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_structure_insight_p6_entry_freeze_20260611.py \
  tests/test_emlis_ai_structure_insight_p6_inventory_20260611.py \
  tests/test_emlis_ai_structure_insight_p6_family_boundary_20260611.py \
  tests/test_emlis_ai_structure_insight_p6_relation_policy_20260611.py \
  tests/test_emlis_ai_structure_insight_p6_quality_rubric_20260611.py \
  tests/test_emlis_ai_structure_insight_p6_gate_hardening_20260611.py \
  tests/test_emlis_ai_structure_insight_p6_surface_role_plan_20260611.py \
  tests/test_emlis_ai_structure_insight_p6_product_quality_review_20260611.py \
  tests/test_emlis_ai_structure_insight_p6_regression_handoff_20260611.py
```

既存回帰候補:

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_structure_insight_candidate.py \
  tests/test_emlis_ai_structure_insight_gate.py \
  tests/test_emlis_ai_structure_insight_surface_phase10.py \
  tests/test_emlis_ai_product_readfeel_phase11_long_run_product_gate.py \
  tests/test_emlis_ai_user_label_connection_p5_regression_handoff_20260611.py \
  tests/test_emlis_ai_user_label_connection_p5_limited_visible_connection_20260611.py \
  tests/test_emlis_ai_user_label_connection_p5_product_quality_review_20260611.py \
  tests/test_emlis_ai_product_readfeel_p4_regression_handoff_20260610.py
```

RN contract候補:

```bash
cd Cocolon
npm run test:rn-screens --silent
```

注意:

```text
今回の設計時点ではpytest実測greenを確認していない。
実装段階では、環境にpytestがない場合、未実行として記録し、green扱いしない。
```

---

## 8. acceptance criteria

### 8.1 P6-0 acceptance

```text
- P5-7 handoffからP6 entry allowed / hold / P5 return / P4 returnを分類できる。
- P6 entry freeze summaryはbody-free。
- release_allowedを立てない。
```

### 8.2 P6-1 acceptance

```text
- 既存Structure Insight moduleの流用範囲を分類できる。
- 既存Phase7/9/10とロードマップP6の混同を避けられる。
- public contract mutationがない。
```

### 8.3 P6-2 acceptance

```text
- structure_question / long_meaning_arc / self_understanding_followのみallow候補。
- daily / low-info / positive-only / safety adjacentはdeep insight blocked。
- block理由はsafe identifierのみ。
```

### 8.4 P6-3 acceptance

```text
- relation familyをlow / medium / high / blockedに分類できる。
- high risk relationは自動visibleにしない。
- low_information_unspecified_weightはP6 visibleにしない。
```

### 8.5 P6-4 acceptance

```text
- P6 quality rubricがratings-onlyで作れる。
- read_feeling / insight_deltaをmachine metricsで自動補完しない。
- RED / REPAIR_REQUIRED / YELLOW / PASS / STRUCTURE_INSIGHT_READYを分けられる。
```

### 8.6 P6-5 acceptance

```text
- soft expressionなしをblock。
- diagnosis / personality / cause / advice / future prediction / target judgementをblock。
- self-denial identity claim as factをblock。
- Gateはcomment_textを書かない。
```

### 8.7 P6-6 acceptance

```text
- structure_questionへlimited surface role planを接続できる。
- insight seedはobservation sectionに1件まで。
- reception sectionで押しつけを緩める。
- fixed sentence templateを追加しない。
```

### 8.8 P6-7 acceptance

```text
- long_meaning_arc / self_understanding_followを別枠評価できる。
- self_denial_identity_splitを初期自動visibleにしない。
- long_meaning_arcを要約だけで終わらせない。
```

### 8.9 P6-8 acceptance

```text
- ratings-only review summaryを作れる。
- structure_insight_ready_candidate_countをbody-freeで集計できる。
- raw text / comment_text body / reviewer free textを含めない。
```

### 8.10 P6-9 acceptance

```text
- P7 ready / hold / P6 continue / P5 return / P4 returnを判断できる。
- P6がP4/P5/RN/public contractを壊していない。
- release_allowedを立てない。
```

---

## 9. rollout / handoff

P6実装後のhandoffは、次の形にする。

```text
確認済み:
  P6 focused tests / required regression / RN contract / body-free boundary

未確認:
  実機読感 / long-run sequence / external pilot / manual Blind QA未実施分

書かれていない:
  P6完了をrelease readyとして扱ってよい、とは書かれていない

推測禁止:
  P6で再入力意欲が上がったと断定しない

次に実行すべきこと:
  P7 Product Quality Runner / Long-run Gateへ進むか、P6継続修正かを判断する
```

P7へ渡す場合の必須材料:

```text
P6 regression handoff summary
P6 ratings-only review summary
P6 family boundary summary
P6 relation policy summary
P6 no-connect family regression summary
P6 body-free ProductQuality fields
```

---

## 10. Cocolonとしての判断

P6は、Cocolonの価値に近い工程である。  
なぜなら、Cocolonが目指すのは、ユーザーの入力をただ受け取ることではなく、ユーザーが自分の言葉を外側から見られるようにすることだからである。

ただし、P6は一番雑に扱ってはいけない。  
深い文は、正しく扱えば「自分の構造が見えた」になる。  
間違えると、「決めつけられた」「見抜かれて気持ち悪い」「診断された」になる。

だからP6は、次の姿勢で実装する。

```text
深くするのではなく、関係を見せる。
強く言うのではなく、根拠範囲を示す。
当てに行くのではなく、ユーザーが受け取れる観測候補として返す。
```

この設計は、Cocolonを「普通のAI相談」へ寄せるためではない。  
ユーザーがCocolonに残した言葉を、ただ処理せず、自己情報として戻すための設計である。

---

## 11. 次に実行すべきこと

実装段階では、次の順で進める。

```text
1. P6-0 entry freezeを作り、P5-7 handoffからP6へ進める条件を固定する。
2. P6-1 inventoryで既存Structure Insight moduleの流用範囲を固定する。
3. P6-2 family boundaryでallow / meta_only / hold / blockを固定する。
4. P6-3 relation policyでrisk classificationを作る。
5. P6-4 quality rubricでratings-only評価軸を固定する。
6. P6-5 gate hardeningでunsafe insightを止める。
7. P6-6 structure_question限定surface role planを作る。
8. P6-7 long_meaning_arc / self_understanding_followをreviewする。
9. P6-8 ratings-only Product QAを作る。
10. P6-9 regression / P7 hold decisionを作る。
```

最初の実装で作る候補は次である。

```text
emlis_ai_structure_insight_p6_entry_freeze.py
emlis_ai_structure_insight_p6_inventory.py
emlis_ai_structure_insight_p6_family_boundary.py
emlis_ai_structure_insight_p6_relation_policy.py
emlis_ai_structure_insight_p6_quality_rubric.py
emlis_ai_structure_insight_p6_gate_hardening.py
emlis_ai_structure_insight_p6_surface_role_plan.py
emlis_ai_structure_insight_p6_product_quality_review.py
emlis_ai_structure_insight_p6_regression_handoff.py
```

ただし、実装時に既存moduleへ入れた方が差分が小さい場合は、既存moduleへ統合する。  
判断基準は次である。

```text
- 既存moduleの責務と一致するか。
- 新規moduleの方がP6境界を読みやすいか。
- 既存test import pathを壊さないか。
- body-free / public contract guardを明確に保てるか。
```

---

## 12. この設計で行わないこと

```text
コード変更
DB変更
RN変更
API変更
json/schema実ファイル化
fixture実ファイル化
実機確認
P7 Product Quality Runner実装
P8 Derived User Model実装
release decision実装
```

本資料は、P6実装に入る前の詳細設計書である。  
P6をCocolonの商品価値へ接続するために、実装順・境界・QA・handoffを固定する。
