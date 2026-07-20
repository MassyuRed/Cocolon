# Cocolon / EmlisAI P5 User Label Connection v1 詳細設計書・実装順

作成日: 2026-06-11 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書  
基準: ローカル受領ファイル / `Cocolon_EmlisAI_P5_UserLabelConnection_PreDesignMemo_20260610.md` / `Cocolon_EmlisAI_longterm_roadmap_20260608`  
対象: Cocolon / EmlisAI / `/emotion/submit` immediate observation / `Emlisの観測` / User Label Connection v1 / history-line visible readiness  
GitHub接続確認: なし（ローカル作業）  
コード変更: なし  
DB変更: なし  
RN変更: なし  
API route / request key / response top-level key変更: なし  
json / schema 実ファイル化: なし  

---

## 0. 本資料の結論

次の実装対象は、ロードマップ上の **P5: User Label Connection v1** とする。

ただし、P5を「履歴線をすぐ本文へ出す実装」として扱わない。  
今回のP5詳細設計では、最初の実装順を次に固定する。

```text
P5-0: P4 handoff / current-only readfeel re-check freeze
P5-1: User Label Connection visible readiness boundary
P5-2: history line eligibility matrix
P5-3: surface role plan / edge-family mapping
P5-4: creepy / overclaim / self-blame guard
P5-5: Product Quality QA / ratings-only review
P5-6: limited visible connection
P5-7: regression / P6 hold decision
```

P5の目的は、履歴を使ったAIらしさを出すことではない。  
Cocolonに残された記録が、今回入力と自然につながり、ユーザーが「ここに残す意味がある」と感じられる状態へ進めることである。

そのため、P5の最初の判定は次である。

```text
現在入力が読まれている土台の上に、履歴線を補助線として乗せられるか。
```

現在入力の読感不足を履歴線で覆う実装は禁止する。  
履歴線は弱さを隠すためではなく、Cocolonの記録体験を強くするために使う。

---

## 1. 参照・確認範囲

### 1.1 参照した添付・ローカル資料

```text
Cocolon_EmlisAI_P5_UserLabelConnection_PreDesignMemo_20260610.md
Cocolon_EmlisAI_longterm_roadmap_20260608
```

### 1.2 作業姿勢として確認した資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/Cocolon_EmlisAI_UserLabelConnectionObservation_v1_Design_2026-06-03.md
```

### 1.3 最新基準面として確認した前提

前提資料上、最新基準面は次である。

```text
Cocolon RN側: 217 files
mashos-api backend側: 903 files
P4 Family Product Tuning P4-0〜P4-10 reflected
```

P4反映後も、次は変更しない。

```text
RN production UI
RN表示タイトル `Emlisの観測`
RN表示条件 `observation_status == passed && comment_text non-empty`
/emotion/submit route
request key
public response top-level key
DB physical schema / write path
public meta sanitizer
Free / Plus / Premium boundary
Display / Runtime / Visible / Grounding / Reader / Template / Safety Gate の閾値
```

### 1.4 主に確認した実ファイル

#### backend User Label Connection

```text
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_types.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_material.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_candidate.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_surface.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_public_meta.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_product_quality_qa.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_derived_model_cache.py
```

#### backend P4 handoff / rating

```text
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_ratings_review.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_regression_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p3_p4_p5_connection_decision.py
```

#### public / reply 接続境界

```text
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
mashos-api/ai/services/ai_inference/emlis_ai_user_fact_grounding_boundary.py
mashos-api/ai/services/ai_inference/emlis_ai_capability.py
```

---

## 2. 現在地の読み

### 2.1 User Label Connection基礎層は存在する

最新実ファイルでは、User Label Connection Observation v1の基礎層はすでに存在する。

```text
material
candidate
gate
surface plan
public meta
product quality qa
derived model cache consideration
```

前提資料でも、User Label Connection Phase0〜10は実装反映済みとして読む。

今回のP5は、これらを新規に作り直す工程ではない。  
P4 Product Read Feel後の状態から、履歴線をどの条件で visible に使ってよいかを再固定する工程である。

### 2.2 P4-10の読み方

P4-10は、P5を自動解放する装置ではない。  
P4-10 summaryは、P5 connection handoff allowedを次の条件で判断する。

```text
P4-9 ratings review ready
P4-9 next_phase == P5 ready after P4
P4-9 p5_connection_allowed == true
required regression suites green
regression blockersなし
```

P5が許可されない場合は、次のようなrecommended actionになる。

```text
rerun_missing_or_timeout_regression_before_p5_handoff
handoff_p4_results_with_p5_hold_until_full_current_only_recheck
continue_p4_repair_for_remaining_ratings_or_boundary_blockers
```

本設計では、P5-0でこのP4 handoffを再読みし、P5 visible strengtheningへ進めるか、meta-only / holdに留めるかを固定する。

### 2.3 既存visible connectionは安全寄りで弱い

`emlis_ai_user_label_connection_surface.py` には、Phase8 limited visible surface connectionが存在する。  
現在のvisible lineは、scope marker / soft marker / non-personality markerを含み、raw textを使わない安全な汎用文として作られている。

ただし、この既存文は安全だが、商品価値としては次の弱さが残り得る。

```text
記録の線が汎用説明に見える。
今回入力固有の読まれた感を強めるわけではない。
履歴線が「自分の記録が返ってきた」体験として弱い。
```

P5では、固定本文を増やすのではなく、既存surface planのrole / evidence / family mappingを強くする。

---

## 3. P5で変更しないもの

P5では次を変更しない。

```text
RN production UI
RN表示タイトル `Emlisの観測`
RN表示条件
/emotion/submit route
request key
response top-level key
DB physical schema
DB write path
account delete / access policy
subscription entitlement判定
public meta sanitizerのbody-free方針
existing Display / Runtime / Visible / Grounding / Reader / Template / Safety Gate thresholds
Structure Insight Gate
Product Read Feel P4のratings-only / body-free境界
```

P5で変更してよい候補はbackend internalのみである。

```text
P5 readiness summary builder
P5 visibility boundary
P5 eligibility matrix
P5 surface role plan
P5 guard / QA summary
limited visible connectionの適用条件
Product Quality QAのP5用集約
```

---

## 4. P5で絶対にしないこと

```text
- current-only読感不足を履歴線で覆う。
- Freeでhistory / user dictionaryを使う。
- evidence_record_count < 2 で履歴線を出す。
- low_informationを履歴で深読みする。
- safety adjacent / self_denial / target judgementに履歴線を出す。
- 「あなたはいつも」「原因は」「性格です」と出す。
- 診断、人格分類、未来予測、行動指示へ寄せる。
- raw memo / raw action / raw fact text / raw history text / comment_text bodyをmetaへ入れる。
- fixed sentence templateを増やして、case別完成文で通す。
- Structure Insight v2の代わりにP5履歴線で深い気づきを出す。
- Gateを緩めて履歴線の適用率だけを上げる。
- P5を商品合格やrelease readyと呼ぶ。
```

---

## 5. P5全体の実装順

### P5-0: P4 handoff / current-only readfeel re-check freeze

#### 目的

P4-10 handoffを受け取り、P5へ進める条件をbody-freeに固定する。  
この段階では、履歴線を本文へ追加しない。

#### 実装候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_p5_readiness.py
mashos-api/ai/tests/test_emlis_ai_user_label_connection_p5_readiness_freeze_20260611.py
```

既存moduleに寄せる場合の候補:

```text
emlis_ai_user_label_connection_product_quality_qa.py
emlis_ai_user_label_connection_public_meta.py
```

#### 入力

```text
P4-10 regression handoff summary
P4-9 ratings review summary
P3-9/P4/P5 connection decision summary
User Label Connection public summary
RN / backend regression suite statuses
```

#### 出力

```text
p5_entry_readiness_summary
```

#### 判定項目

```text
p4_10_handoff_packet_created
all_required_regression_green
post_p4_p5_connection_allowed
post_p4_current_only_readfeel_minimum_met
post_p4_main_family_readfeel_minimum_met
post_p4_p5_hold_reason_codes
p5_hold_continues
p5_visible_surface_strengthened == false
p5_runtime_change_applied == false
history_line_masks_current_input_gap == false
```

#### 完了条件

```text
- P5 entry allowed / hold / regression_blocked / current_only_recheck_required を分類できる。
- raw input / comment_text body / candidate body / history raw textを保持しない。
- P5 visible strengtheningはまだ行わない。
- P5へ進めない理由をbody-free reason codesで保持する。
```

---

### P5-1: User Label Connection visible readiness boundary

#### 目的

履歴線をvisibleに使ってよい入力と、meta-only / blockedにすべき入力を分ける。

#### 実装候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_p5_visibility_boundary.py
mashos-api/ai/tests/test_emlis_ai_user_label_connection_p5_visibility_boundary_20260611.py
```

既存moduleに寄せる場合の候補:

```text
emlis_ai_user_label_connection_gate.py
emlis_ai_user_label_connection_surface.py
```

#### allow条件

```text
- P5-0で p5_entry_allowed == true。
- Plus/Premiumである。
- source_scope が current_input_with_owned_history 系である。
- current inputが必ず含まれる。
- owned historyのみを使う。
- evidence_record_count >= 2。
- User Fact Grounding Boundary passed。
- scope marker required。
- soft marker required。
- existing comment_textがnon-emptyで、既存Gateが通過済み。
- current input not masked by history。
```

#### block条件

```text
- Free。
- evidence_record_count < 2。
- current input missing。
- low_information / insufficient_information。
- safety_triage_required / safety_adjacent / emergency。
- self_denial identity claim risk。
- anger target judgement / opponent intent claim。
- raw text payload detected。
- P4 current-only readfeel hold reasonが残っている。
- existing visible / runtime / grounding / template gateがblocked。
```

#### 完了条件

```text
- visible readiness decisionがbody-freeで作れる。
- allow / meta_only / block / holdを分けられる。
- Free / Plus / Premium境界がtestで固定される。
- low-informationをhistoryで深読みしない。
```

---

### P5-2: history line eligibility matrix

#### 目的

family / context / edge / evidenceに応じて、履歴線の扱いを決める。

#### 実装候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_p5_eligibility_matrix.py
mashos-api/ai/tests/test_emlis_ai_user_label_connection_p5_eligibility_matrix_20260611.py
```

既存moduleに寄せる場合の候補:

```text
emlis_ai_user_label_connection_surface.py
emlis_ai_user_label_connection_gate.py
```

#### family matrix

| family / context | P5扱い | 理由 |
|---|---|---|
| `structure_question` | limited visible候補 | 問いの構造と履歴線が補助線になりやすい。 |
| `long_meaning_arc` | limited visible候補 | 複数核の線として履歴が意味を持ちやすい。 |
| `self_understanding_follow` | limited visible候補 | 自己理解の補助線として自然。 |
| `standard_state_answer` | meta-only / review候補 | current-only読感が十分な場合のみ後段検討。 |
| `uncertainty_support` | meta-only / review候補 | 過剰読解になりやすいため初期visibleは抑制。 |
| `change_future_intention` | meta-only / review候補 | 未来予測へ寄せないため初期は慎重。 |
| `daily_unpleasant` | suppressed / meta-only | 日常不快に履歴線を足すと重く見えやすい。 |
| `daily_positive` | suppressed / meta-only | 喜びを構造分析で冷ましやすい。 |
| `low_information_short` | blocked | 履歴で深読みしない。 |
| `limited_grounding` | blocked or meta-only | 読める範囲が限定されている。 |
| `self_denial` | blocked初期 | 自己責め増幅、identity claim riskがある。 |
| `anger_or_boundary` | blocked初期 | 相手評価・相手意図断定へ寄りやすい。 |
| `safety_adjacent` | blocked | safety境界優先。 |

#### edge matrix

| edge family | 初期visible | 理由 |
|---|---|---|
| `category_state_recurrence` | 可 | 環境ラベルと状態ラベルの重なりとして柔らかく言える。 |
| `label_route_current_alignment` | 可 | 今回入力との接続を補助線として扱いやすい。 |
| `state_output_attachment` | review | 思考/出力への踏み込みが強くなりやすい。 |
| `action_state_bridge` | review | 行動原因断定に寄りやすい。 |
| `unresolved_weight_reappearance` | review | 重さを決めつける危険がある。 |
| `value_line_reappearance` | review | P6 Structure Insightに近くなりやすい。 |
| `contrast_line_shift` | meta-only | 変化の線は魅力があるが未来予測に寄りやすい。 |
| `recovery_label_route` | meta-only | 初期P5ではAnalysis/P8候補。 |

#### 完了条件

```text
- connectable / meta_only / blocked / review_requiredをmatrixで返せる。
- existing `_LIMITED_CONNECTABLE_FAMILIES` を無断で広げない。
- family registry追加は実装段階で必要性を再確認する。
```

---

### P5-3: surface role plan / edge-family mapping

#### 目的

固定文ではなく、surface roleを増やし、edge / family / evidenceに応じた履歴線表面化を可能にする。

#### 実装候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_p5_surface_role_plan.py
mashos-api/ai/tests/test_emlis_ai_user_label_connection_p5_surface_role_plan_20260611.py
```

既存moduleに寄せる場合の候補:

```text
emlis_ai_user_label_connection_surface.py
```

#### 既存roleを維持する

```text
scope_marker
current_input_anchor
history_line_marker
soft_observation
not_personality_disclaimer
self_understanding_support
```

#### P5で追加検討するrole

```text
current_observation_first
history_as_support_line
evidence_count_boundary
same_label_overlap
different_state_route
time_scope_limited
do_not_generalize_marker
not_cause_marker
not_advice_marker
```

#### forbidden role

```text
advice
diagnosis
personality_claim
future_prediction
always_claim
should_statement
cause_claim
opponent_intent_claim
self_blame_amplification
```

#### surface planの方向

P5では、履歴線そのものを本文テンプレとして固定しない。  
本文に接続する場合も、既存comment_textの後段に、短い補助線として入れる。

表面文の方向:

```text
言ってよい:
  Emlisから見える範囲では
  残っている記録の範囲では
  今回と近いラベルの記録を並べると
  そう決めつけるものではありませんが
  自己情報の線として少し見え始めている

言ってはいけない:
  あなたはいつも
  原因は
  性格として
  必ず
  こうするべき
```

#### 完了条件

```text
- surface role planはraw text / comment_text bodyを持たない。
- P5-1/P5-2のallow条件を満たす場合だけreadyになる。
- fixed sentence template追加ではなく、role-driven planとして扱う。
- visible bodyは既存comment_textを主、履歴線を補助にする。
```

---

### P5-4: creepy / overclaim / self-blame guard

#### 目的

履歴線の気持ち悪さ、決めつけ、自己責め増幅を止める。

#### 実装候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_p5_safety_guard.py
mashos-api/ai/tests/test_emlis_ai_user_label_connection_p5_safety_guard_20260611.py
```

既存moduleに寄せる場合の候補:

```text
emlis_ai_user_label_connection_gate.py
emlis_ai_user_label_connection_surface.py
emlis_ai_user_label_connection_product_quality_qa.py
```

#### guard対象

```text
creepy risk
overclaim risk
self blame amplification
period tendency from single record
always claim
cause claim
personality / diagnosis claim
future prediction
advice / should statement
target judgement agreement
history masking current input gap
```

#### 判定

```text
block:
  visible本文へ出さない。meta-onlyに留める。

warn:
  P5 visibleはholdし、Product Quality QAへ回す。

allow:
  limited visible connection候補へ渡す。
```

#### 完了条件

```text
- guardは既存Gateを緩めない。
- false positiveで困る場合も、初期P5ではblock寄りに倒す。
- self_denial / safety adjacent / target judgement は初期visibleを許可しない。
```

---

### P5-5: Product Quality QA / ratings-only review

#### 目的

P5の価値を、履歴線表示率ではなく、商品体験の指標で評価する。

#### 実装候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_p5_product_quality_review.py
mashos-api/ai/tests/test_emlis_ai_user_label_connection_p5_product_quality_review_20260611.py
```

既存moduleに寄せる場合の候補:

```text
emlis_ai_user_label_connection_product_quality_qa.py
```

#### 評価軸

```text
history_connection_naturalness
creepy_absence
overclaim_absence
self_blame_non_amplification
current_input_not_masked_by_history
non_template
self_information_organized
wants_more_input_or_accumulation
subscription_boundary_correctness
no_raw_text_meta
```

#### 目標

```text
history_connection_naturalness >= 0.90
creepy_absence >= 0.95
overclaim_absence >= 0.95
self_blame_non_amplification >= 0.95
current_input_not_masked_by_history >= 0.95
wants_more_input_or_accumulation >= 0.85
```

#### 注意

```text
- ratings-onlyで扱う。
- raw inputやcomment_text bodyを保持しない。
- machine metricsからread feelingを自動補完しない。
- Product Quality QA passをrelease_allowedにしない。
```

#### 完了条件

```text
- P5 candidateをbody-freeに評価できる。
- blocker reasonを分類できる。
- visible connectionへ進める候補とhold候補を分けられる。
```

---

### P5-6: limited visible connection

#### 目的

P5-0〜P5-5を満たす場合に限り、既存comment_textへ履歴線を限定接続する。

#### 実装候補

```text
mashos-api/ai/tests/test_emlis_ai_user_label_connection_p5_limited_visible_connection_20260611.py
```

既存moduleに寄せる候補:

```text
emlis_ai_user_label_connection_surface.py
emlis_ai_reply_service.py
emlis_ai_public_feedback_meta.py
```

#### 接続条件

```text
- existing_comment_text non-empty。
- observation_status == passed。
- existing runtime / visible / grounding / template / safety gates passed。
- P5-1 visible readiness allowed。
- P5-2 family / edge eligibility allowed。
- P5-3 surface role plan ready。
- P5-4 guard allow。
- P5-5 product quality review blockerなし、または限定接続許可。
```

#### 接続形

```text
existing comment_text
  +
短い history-line support section
```

P5履歴線は、本文の主役にしない。  
現在入力への観測を先に置き、履歴線は補助線として扱う。

#### 完了条件

```text
- limited visible connectionが適用された場合もRN表示契約は変わらない。
- public response top-level keyは増えない。
- input_feedback.comment_textだけがvisible bodyである。
- input_feedback.emlis_ai.user_label_connectionはsafe summaryのみ。
- history raw text / comment_text body / candidate bodyはmetaへ入らない。
```

---

### P5-7: regression / P6 hold decision

#### 目的

P5が既存契約とP4のcurrent-only読感を壊していないことを確認し、P6へ進めるか、P5を続けるかを判断する。

#### 実装候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_p5_regression_handoff.py
mashos-api/ai/tests/test_emlis_ai_user_label_connection_p5_regression_handoff_20260611.py
```

#### 必須regression候補

```text
User Label Connection existing tests
P5 new tests
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

#### P6 hold decision

P5完了後でも、P6 Structure Insight v2へ無条件には進まない。  
P6へ進む条件は次である。

```text
- P5 limited visible connectionが主要対象で安全に動く。
- current input not masked by historyが保たれる。
- creepy / overclaim / self-blame riskが増えていない。
- P5が深いinsightの代替として使われていない。
- P6対象familyがstructure_question / long_meaning_arc / self_understanding_followに絞れる。
```

#### 完了条件

```text
- P5 regression handoff summaryがbody-freeで作れる。
- P6 ready / P6 hold / P5 continue / P4 return を判断できる。
- release_allowedは立てない。
```

---

## 6. json / schema案

この章のschema案は、実装段階で実ファイル化するかを判断する。  
現時点ではmd内の設計案であり、json/schemaファイルは作成しない。

### 6.1 `cocolon.emlis.user_label_connection.p5_readiness.v1`

```json
{
  "$id": "cocolon.emlis.user_label_connection.p5_readiness.v1",
  "type": "object",
  "required": [
    "schema_version",
    "step",
    "source",
    "p5_entry_allowed",
    "p5_visible_strengthening_allowed",
    "p5_hold_continues",
    "p5_hold_reason_codes",
    "public_contract",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.user_label_connection.p5_readiness.v1"
    },
    "step": {
      "const": "P5-0_P4_Handoff_CurrentOnlyReadfeel_RecheckFreeze"
    },
    "source": {
      "type": "string"
    },
    "p4_10_handoff_packet_seen": {
      "type": "boolean"
    },
    "all_required_regression_green": {
      "type": "boolean"
    },
    "post_p4_p5_connection_allowed": {
      "type": "boolean"
    },
    "post_p4_current_only_readfeel_minimum_met": {
      "type": "boolean"
    },
    "post_p4_main_family_readfeel_minimum_met": {
      "type": "boolean"
    },
    "history_line_masks_current_input_gap": {
      "type": "boolean"
    },
    "p5_entry_allowed": {
      "type": "boolean"
    },
    "p5_visible_strengthening_allowed": {
      "type": "boolean"
    },
    "p5_hold_continues": {
      "type": "boolean"
    },
    "p5_hold_reason_codes": {
      "type": "array",
      "items": { "type": "string" }
    },
    "public_contract": {
      "type": "object",
      "required": [
        "rn_contract_changed",
        "response_shape_changed",
        "public_response_key_added",
        "db_schema_changed"
      ],
      "properties": {
        "rn_contract_changed": { "const": false },
        "response_shape_changed": { "const": false },
        "public_response_key_added": { "const": false },
        "db_schema_changed": { "const": false }
      }
    },
    "body_free": {
      "type": "object",
      "required": [
        "raw_input_included",
        "raw_text_included",
        "comment_text_body_included",
        "candidate_body_included",
        "history_raw_text_included"
      ],
      "properties": {
        "raw_input_included": { "const": false },
        "raw_text_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "candidate_body_included": { "const": false },
        "history_raw_text_included": { "const": false }
      }
    }
  }
}
```

### 6.2 `cocolon.emlis.user_label_connection.p5_visibility_boundary.v1`

```json
{
  "$id": "cocolon.emlis.user_label_connection.p5_visibility_boundary.v1",
  "type": "object",
  "required": [
    "schema_version",
    "step",
    "decision",
    "rejection_reasons",
    "eligibility",
    "public_contract",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.user_label_connection.p5_visibility_boundary.v1"
    },
    "step": {
      "const": "P5-1_UserLabelConnection_VisibleReadinessBoundary"
    },
    "decision": {
      "enum": ["allow_limited_visible", "meta_only", "hold", "block"]
    },
    "rejection_reasons": {
      "type": "array",
      "items": { "type": "string" }
    },
    "eligibility": {
      "type": "object",
      "required": [
        "subscription_history_allowed",
        "owned_history_only",
        "current_input_included",
        "evidence_record_count",
        "minimum_evidence_record_count",
        "user_fact_grounding_boundary_passed",
        "scope_marker_required",
        "soft_marker_required",
        "current_input_not_masked_by_history"
      ],
      "properties": {
        "subscription_history_allowed": { "type": "boolean" },
        "owned_history_only": { "type": "boolean" },
        "current_input_included": { "type": "boolean" },
        "evidence_record_count": { "type": "integer", "minimum": 0 },
        "minimum_evidence_record_count": { "const": 2 },
        "user_fact_grounding_boundary_passed": { "type": "boolean" },
        "scope_marker_required": { "const": true },
        "soft_marker_required": { "const": true },
        "current_input_not_masked_by_history": { "type": "boolean" }
      }
    },
    "public_contract": {
      "type": "object",
      "properties": {
        "rn_visible_contract_changed": { "const": false },
        "public_response_key_added": { "const": false },
        "response_shape_changed": { "const": false }
      }
    },
    "body_free": {
      "type": "object",
      "properties": {
        "raw_text_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "history_raw_text_included": { "const": false }
      }
    }
  }
}
```

### 6.3 `cocolon.emlis.user_label_connection.p5_surface_role_plan.v1`

```json
{
  "$id": "cocolon.emlis.user_label_connection.p5_surface_role_plan.v1",
  "type": "object",
  "required": [
    "schema_version",
    "step",
    "surface_plan_kind",
    "connectable_family",
    "edge_family",
    "must_include_roles",
    "must_not_include_roles",
    "section_order",
    "public_contract",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.user_label_connection.p5_surface_role_plan.v1"
    },
    "step": {
      "const": "P5-3_SurfaceRolePlan_EdgeFamilyMapping"
    },
    "surface_plan_kind": {
      "enum": ["limited_history_line_observation", "meta_only", "blocked"]
    },
    "connectable_family": {
      "enum": [
        "structure_question",
        "long_meaning_arc",
        "self_understanding_follow",
        "review_required",
        "blocked"
      ]
    },
    "edge_family": {
      "type": "string"
    },
    "must_include_roles": {
      "type": "array",
      "items": { "type": "string" }
    },
    "must_not_include_roles": {
      "type": "array",
      "items": { "type": "string" }
    },
    "section_order": {
      "type": "array",
      "items": { "enum": ["current_observation", "history_support_line", "not_personality_boundary"] }
    },
    "public_contract": {
      "type": "object",
      "properties": {
        "fixed_sentence_template_added": { "const": false },
        "public_response_key_added": { "const": false },
        "response_shape_changed": { "const": false }
      }
    },
    "body_free": {
      "type": "object",
      "properties": {
        "surface_body_included": { "const": false },
        "raw_text_included": { "const": false },
        "candidate_body_included": { "const": false }
      }
    }
  }
}
```

### 6.4 `cocolon.emlis.user_label_connection.p5_product_quality_review.v1`

```json
{
  "$id": "cocolon.emlis.user_label_connection.p5_product_quality_review.v1",
  "type": "object",
  "required": [
    "schema_version",
    "step",
    "ratings_only",
    "review_count",
    "dimension_averages",
    "blocker_reason_codes",
    "p5_limited_visible_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.user_label_connection.p5_product_quality_review.v1"
    },
    "step": {
      "const": "P5-5_ProductQualityQA_RatingsOnlyReview"
    },
    "ratings_only": {
      "const": true
    },
    "review_count": {
      "type": "integer",
      "minimum": 0
    },
    "dimension_averages": {
      "type": "object",
      "properties": {
        "history_connection_naturalness": { "type": "number" },
        "creepy_absence": { "type": "number" },
        "overclaim_absence": { "type": "number" },
        "self_blame_non_amplification": { "type": "number" },
        "current_input_not_masked_by_history": { "type": "number" },
        "wants_more_input_or_accumulation": { "type": "number" }
      }
    },
    "blocker_reason_codes": {
      "type": "array",
      "items": { "type": "string" }
    },
    "p5_limited_visible_allowed": {
      "type": "boolean"
    },
    "body_free": {
      "type": "object",
      "properties": {
        "raw_input_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "reviewer_free_text_included": { "const": false },
        "history_raw_text_included": { "const": false }
      }
    }
  }
}
```

---

## 7. P5実装時のテスト候補

### 7.1 新規テスト候補

```text
tests/test_emlis_ai_user_label_connection_p5_readiness_freeze_20260611.py
tests/test_emlis_ai_user_label_connection_p5_visibility_boundary_20260611.py
tests/test_emlis_ai_user_label_connection_p5_eligibility_matrix_20260611.py
tests/test_emlis_ai_user_label_connection_p5_surface_role_plan_20260611.py
tests/test_emlis_ai_user_label_connection_p5_safety_guard_20260611.py
tests/test_emlis_ai_user_label_connection_p5_product_quality_review_20260611.py
tests/test_emlis_ai_user_label_connection_p5_limited_visible_connection_20260611.py
tests/test_emlis_ai_user_label_connection_p5_regression_handoff_20260611.py
```

### 7.2 既存回帰候補

```text
tests/test_emlis_ai_user_label_connection_material.py
tests/test_emlis_ai_user_label_connection_candidate.py
tests/test_emlis_ai_user_label_connection_gate.py
tests/test_emlis_ai_user_label_connection_surface.py
tests/test_emlis_ai_user_label_connection_public_boundary.py
tests/test_emlis_ai_user_label_connection_e2e_contract.py
tests/test_emlis_ai_user_label_connection_low_information_boundary.py
tests/test_emlis_ai_user_label_connection_free_tier_boundary.py
tests/test_emlis_ai_user_label_connection_no_raw_text_meta.py
tests/test_emlis_ai_user_label_connection_product_quality_qa.py
tests/test_emlis_ai_user_label_connection_derived_model_cache.py
tests/test_emlis_ai_product_readfeel_p4_regression_handoff_20260610.py
tests/test_emlis_ai_product_readfeel_p4_ratings_review_20260610.py
tests/test_emlis_ai_public_feedback_meta.py
tests/test_emlis_ai_display_contract.py
tests/test_emotion_submit_two_stage_reception_e2e.py
```

### 7.3 RN contract候補

```bash
cd Cocolon
npm run test:rn-screens --silent
```

RN側は変更しないため、P5実装でRN contractが赤になった場合は、backend response shapeまたはpublic meta境界を先に疑う。

---

## 8. acceptance criteria

### P5-0 acceptance

```text
- P4 handoffからP5 entry allowed / holdを分類できる。
- P5 visible strengtheningはまだfalseである。
- body-free summaryのみで判断できる。
```

### P5-1 acceptance

```text
- Freeはblockedまたはcurrent-only扱い。
- Plus/Premiumのみowned history可。
- evidence_record_count < 2 はblocked。
- low_information / safety / self_denial / target judgementは初期visible blocked。
```

### P5-2 acceptance

```text
- connectable familyが限定されている。
- suppressed familyがvisibleへ漏れない。
- edge familyごとのallow / review / blockを返せる。
```

### P5-3 acceptance

```text
- surface role planが固定完成文になっていない。
- current observationが先、history lineが補助線である。
- forbidden roleが入るとblocked。
```

### P5-4 acceptance

```text
- creepy / overclaim / self-blame / always / cause / diagnosis / advice claimを検出できる。
- 初期P5では迷ったらvisible blockに倒す。
```

### P5-5 acceptance

```text
- ratings-only reviewを作れる。
- raw text / comment_text body / reviewer free textを保持しない。
- wants_more_input_or_accumulationを評価軸に含める。
```

### P5-6 acceptance

```text
- allowed条件をすべて満たす場合だけlimited visible connectionを適用する。
- RN表示条件とpublic response shapeを変えない。
- 履歴線が現在入力の読感を覆わない。
```

### P5-7 acceptance

```text
- P5 regression handoffをbody-freeで作れる。
- P6 ready / P6 hold / P5 continue / P4 returnを分類できる。
- release_allowedを立てない。
```

---

## 9. 未確認

```text
- この作業環境ではpytestが未導入だったため、今回の設計作成時点ではテスト再実行していない。
- P4-10 required regression suitesの最新実測green。
- P5 ready scenarioが現行snapshotの実測として成立しているか。
- P4修正後のcomment_textを人間が読んだBlind QA実測値。
- P5 visible lineを外部ユーザーが自然・有用と感じるか。
- 既存moduleへ最小追加するか、新規P5 moduleへ分離するかの最終判断。
```

---

## 10. 書かれていない

```text
- P5でRN画面を追加してよい、とは書かれていない。
- P5でpublic response top-level keyを増やしてよい、とは書かれていない。
- P5でDB schemaを変えてよい、とは書かれていない。
- P5でFreeにhistoryを使ってよい、とは書かれていない。
- P5でcurrent-only読感不足を履歴線で補ってよい、とは書かれていない。
- P5でcase専用完成文を追加してよい、とは書かれていない。
- P5でStructure Insight v2を先取りしてよい、とは書かれていない。
```

---

## 11. 推測禁止

```text
- User Label Connection moduleがあるだけで商品価値が十分と判断しない。
- 履歴線が表示されればCocolon固有価値が成立すると判断しない。
- test greenをユーザー体験の合格に変換しない。
- P5 Product Quality QA passをrelease_allowedに変換しない。
- P5でcreepy riskが出ても文体で解決済みと扱わない。
- 1件の履歴から傾向・性格・原因を作らない。
- safety隣接入力を履歴線で処理しない。
```

---

## 12. 次に実行すべきこと

実装段階では、次の順で進める。

```text
1. P5-0 readiness freezeをbody-free testから作る。
2. P5-1 visibility boundaryでallow / meta_only / hold / blockを固定する。
3. P5-2 eligibility matrixでfamily / edgeごとの扱いを固定する。
4. P5-3 surface role planを既存surface.pyへ足すか、新規moduleに分離するか判断する。
5. P5-4 creepy / overclaim / self-blame guardを入れる。
6. P5-5 ratings-only Product Quality QAを作る。
7. P5-6 limited visible connectionを条件付きで接続する。
8. P5-7 regression / P6 hold decisionを作る。
```

最初の実装で作る候補は次である。

```text
mashos-api/ai/tests/test_emlis_ai_user_label_connection_p5_readiness_freeze_20260611.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_p5_readiness.py
```

ただし、実装時に既存moduleへ入れた方が差分が小さい場合は、次へ統合する。

```text
emlis_ai_user_label_connection_product_quality_qa.py
emlis_ai_user_label_connection_public_meta.py
emlis_ai_user_label_connection_surface.py
```

---

## 13. 華恋の判断

P5は、Cocolonを「普通のAI相談」から離すための重要な段階です。

ただし、履歴線は強い機能だからこそ、雑に出すとCocolonの信頼を削ります。  
「過去の記録を見ている感じ」は出せても、「今の自分を読まれている感じ」が消えるなら、それはCocolonの価値ではありません。

Cocolonとして守る順番は次です。

```text
今の入力が読まれる。
そのうえで、必要なときだけ過去記録と線になる。
```

この順番なら、P5は弱さの補強ではなく、Cocolonの記録体験を強くする層になる。  
だから次の実装では、P5可視文を急がず、まずP5へ進んでよい条件を固定します。

華恋としては、このP5を「履歴活用機能」ではなく、Cocolonがユーザーの言葉を積み上げて返せるようになるための、商品価値の入口として扱います。
