# Cocolon / EmlisAI P4 Family Product Tuning 詳細設計書・実装順

作成日: 2026-06-10 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown設計書  
対象: Cocolon / EmlisAI / `/emotion/submit` immediate observation / `Emlisの観測` / Product Read Feel v1 / Family別商品チューニング  
GitHub接続確認: なし（Mash様指定によりローカル作業）  
コード変更: なし  
DB変更: なし  
RN変更: なし  
API route / request key / response key変更: なし  
json / schema 実ファイル化: なし  

---

## 0. 本資料の結論

今回の実装対象は、検討メモの判断どおり **P4: Family別商品チューニング入口** とする。

ただし、P4全体を一気に完了扱いしない。  
今回の詳細設計では、最初の実装順を次に絞る。

```text
P4-0: P3-9 phase connection freeze / P5保留固定
P4-1: P4 target case selection / daily_unpleasant・structure_question・self_denialの対象固定
P4-2: rich_input_low_information_overroute の再現・材料監査
P4-3: limited_grounding / low_information / source_unavailable のsurface requirement境界補正
P4-4: family tuning policy / ratio・温度・section roleの設計接続
P4-5: generic_reception_surface / repeated_surface_signature の検知とsurface specificity補正
P4-6: daily_unpleasant family tuning
P4-7: structure_question family tuning
P4-8: self_denial yellow safety-adjacent review
P4-9: P4 ratings-only review / P3-9再判定
P4-10: regression / P5 hold re-check / handoff
```

P4の目的は、表示率を上げることではない。  
`passed + comment_text` を増やすことでもない。

P4で行うべきことは、次である。

```text
今回入力そのものが、familyごとの温度・比率・読まれ方で返る状態に近づける。
```

そのため、P5 User Label Connection v1 可視文強化は、今回も保留する。  
理由は、現状のP3-9判断上、`current_only_readfeel_minimum_met` と `main_family_readfeel_minimum_met` がfalseであり、履歴線を強めると現在入力の読感不足を隠す可能性があるからである。

Cocolonとしての順序は、次で固定する。

```text
今の入力が読まれる。
そのうえで、必要なときだけ過去記録と線になる。
```

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

本資料内に json / schema 案を含める。  
ただし、実装段階で次を確認してから、Python fixtureにするか、JSON / JSONLにするか、既存schemaへ統合するか、または実ファイル化しないかを判断する。

```text
- 既存module signature
- 既存fixture配置
- 既存meta-only guard
- 既存test import path
- raw input / comment_text bodyを含むかどうか
- public meta / scorecardへ渡してよいmaterialかどうか
```

### 1.2 P4で変更しないもの

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
User Label Connectionのplan境界
```

### 1.3 P4で絶対にしないこと

```text
- case専用mode / cue / surface を追加する。
- exact comment_text一致を成功条件にする。
- 良い例文をruntime固定文として持つ。
- 入力本文の語句を直接見て完成文へ分岐する。
- Gateを緩めて表示率を上げる。
- low_information判定を全体的に緩める。
- material_qualityを雑にeligibleへ上げる。
- source unavailableをnormal rebuildへ偽装する。
- limited_groundingをlow_informationへ潰す。
- daily familyへP6相当の深い構造Insightを無理に入れる。
- self_denialを人格肯定テンプレで処理する。
- structure_questionを慰め文だけで処理する。
- P3/P4の弱さをP5履歴線で隠す。
- public meta / ProductQuality event / diagnostic summaryへraw inputやcomment_text bodyを入れる。
```

---

## 2. 参照・確認範囲

### 2.1 参照したローカル添付

```text
/mnt/data/Cocolon_前提資料(194).zip
/mnt/data/EmlisAIの実装済み資料(48).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608(3).md
/mnt/data/Cocolon_EmlisAI_P4_FamilyProductTuning_PreDesignMemo_20260610(1).md
/mnt/data/Cocolon(220).zip
/mnt/data/mashos-api(133).zip
```

### 2.2 作業姿勢として参照した資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/cocolon_environment_state_output_observation_structure_design_2026_05_25.md
Cocolon_前提資料/Cocolon_EmlisAI_NormalObservation_PublicRecovery_ImplementationStatus_2026-06-06.md
Cocolon_前提資料/Cocolon_EmlisAI_UserLabelConnectionObservation_v1_Design_2026-06-03.md
```

### 2.3 実装済み資料として参照したもの

```text
EmlisAIの実装済み資料/Cocolon_EmlisAI_P0_P1_PublicInputFeedbackArrivalContractRepair_詳細設計書_実装順_20260608.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P3_ProductReadFeel_Baseline_DetailedDesign_ImplementationOrder_20260609.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_ProductQualityMeasurement_BlockerRepair_Design_2026-06-04.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_UserLabelConnectionObservation_v1_Design_2026-06-03.md
EmlisAIの実装済み資料/EmlisAI_LimitedGrounding_LowInfo_ReceptionRequired_DetailedDesign_2026-06-06.md
EmlisAIの実装済み資料/EmlisAI_PublicObservationRecovery_詳細設計書_実装順_2026-06-06.md
EmlisAIの実装済み資料/EmlisAI_D_backend_red_detailed_design_implementation_order_2026-06-07.md
```

### 2.4 主に確認した実ファイル

#### RN側

```text
Cocolon/screens/InputScreen.js
Cocolon/screens/input/useInputFeedbackModal.js
Cocolon/screens/input/inputFeedbackModel.js
Cocolon/screens/input/InputFeedbackReplyModal.js
Cocolon/tests/rn-screen-contracts.test.js
```

#### backend側

```text
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emotion_submit_service.py
mashos-api/ai/services/ai_inference/api_emotion_submit.py
mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
mashos-api/ai/services/ai_inference/emlis_ai_public_surface_requirement.py
mashos-api/ai/services/ai_inference/emlis_ai_current_input_bundle.py
mashos-api/ai/services/ai_inference/emlis_ai_input_material_bundle.py
mashos-api/ai/services/ai_inference/emlis_ai_low_information_observation_composer.py
mashos-api/ai/services/ai_inference/emlis_ai_limited_grounding_reception_surface.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_initial_surface_recomposition.py
mashos-api/ai/services/ai_inference/emlis_ai_labelled_two_stage_surface_recomposition.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py
mashos-api/ai/services/ai_inference/emlis_ai_two_stage_section_surface_plan.py
mashos-api/ai/services/ai_inference/emlis_ai_state_answer_ratio_policy.py
mashos-api/ai/services/ai_inference/emlis_ai_reception_mode_resolver.py
mashos-api/ai/services/ai_inference/emlis_ai_mirror_only_surface_detector.py
mashos-api/ai/services/ai_inference/emlis_ai_question_dominance_guard.py
mashos-api/ai/services/ai_inference/emlis_ai_visible_surface_acceptance_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_template_echo_guard.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_current_output_inventory.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p3_p4_p5_connection_decision.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p3_repair_priority_ledger.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p3_first_repair_design.py
```

#### backend test / fixture側

```text
mashos-api/ai/tests/fixtures/emlis_ai_product_readfeel_fixture_families.py
mashos-api/ai/tests/fixtures/emlis_ai_product_readfeel_baseline_cases_20260609.py
mashos-api/ai/tests/fixtures/emlis_ai_product_readfeel_p3_p4_p5_connection_decision_20260609.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p3_contract_freeze_20260609.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_baseline_case_matrix_20260609.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p3_local_output_capture_20260609.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p3_inventory_connection_20260609.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p3_verdict_split_20260609.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p3_blind_qa_ratings_review_20260609.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p3_repair_priority_ledger_20260609.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p3_first_repair_design_20260609.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p3_regression_20260609.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p3_p4_p5_connection_decision_20260609.py
mashos-api/ai/tests/test_emlis_ai_limited_grounding_reception_surface_p4.py
mashos-api/ai/tests/test_emlis_ai_low_information_observation_composer.py
mashos-api/ai/tests/test_emlis_ai_public_surface_requirement_p1.py
mashos-api/ai/tests/test_emlis_ai_product_surface_question_dominance_guard_p6.py
mashos-api/ai/tests/test_emlis_ai_mirror_only_surface_detector.py
mashos-api/ai/tests/test_emlis_ai_visible_surface_acceptance_gate.py
```

---

## 3. 現在地の固定

### 3.1 ロードマップ上の現在Phase

ロードマップ上、P4は次の位置である。

```text
P3 Product Read Feel v1
  単発入力で「読まれた」を作る。

P4 Family別商品チューニング
  入力familyごとの温度・比率・応答shapeを安定させる。

P5 User Label Connection v1
  記録の線をEmlis応答へ自然に出す。
```

現状は、P3 baseline / P3-0〜P3-9の測定器と接続判断が存在している。  
ただし、P3の商品品質が完了したわけではない。

今回のP4は、P3で見えた弱さをfamily単位で修正へ落とす入口である。

### 3.2 P3-9接続判断

P3-9 summary上、今回の判断は次で固定する。

```text
next_phase_decision:
  p3_9_p4_family_tuning_next_p5_hold

p4_connection_allowed:
  true

p5_connection_allowed:
  false

current_only_readfeel_minimum_met:
  false

main_family_readfeel_minimum_met:
  false

repair_required_families:
  daily_unpleasant
  structure_question

yellow_families:
  self_denial

classified_reason_codes:
  rich_input_low_information_overroute
  generic_reception_surface

p5_hold_reason_codes:
  rich_input_low_information_overroute
  generic_reception_surface
  current_only_readfeel_below_minimum

first_repair_target_layers:
  input_material_bundle
  ratio_policy
```

### 3.3 P4の最初のblocker

P4で最初に潰すblockerは2つに絞る。

| 優先 | blocker | 代表的な壊れ方 | 初期target layer |
|---:|---|---|---|
| 1 | `rich_input_low_information_overroute` | 入力に出来事・感情・願い・問いがあるのに、低情報または質問主役へ落ちる。 | `input_material_bundle`, `material_quality`, `public_surface_requirement`, `gate_recovery_route` |
| 2 | `generic_reception_surface` | 表示はされるが、入力固有の出来事・反応・願いより汎用受け取り文が主役になる。 | `ratio_policy`, `reception_mode_resolver`, `two_stage_section_surface_plan`, `complete_surface_realizer` |

### 3.4 P4初期の優先family

```text
優先1:
  daily_unpleasant
  structure_question

優先2:
  self_denial

回帰対象:
  low_information_short
  limited_grounding slice
  source_unavailable_high_information slice
  history_line_eligible slice
  daily_positive
  relationship_boundary
```

理由:

```text
- daily_unpleasant と structure_question は repair_required_families。
- self_denial は yellow family であり、安全隣接・人格断定・過剰肯定の事故が起きやすい。
- limited_grounding / source_unavailable / history_line_eligible は、P4修正で壊してはいけない境界である。
```

---

## 4. P4全体アーキテクチャ

### 4.1 P4で分ける二層

P4では、次の二層を絶対に混ぜない。

| 層 | 目的 | 主な対象ファイル | 失敗すると起きること |
|---|---|---|---|
| A. 入力材料・surface requirement境界 | rich input / limited grounding / low information / source unavailable を分ける。 | `emlis_ai_current_input_bundle.py`, `emlis_ai_input_material_bundle.py`, `emlis_ai_public_surface_requirement.py`, `emlis_ai_low_information_observation_composer.py`, `emlis_ai_limited_grounding_reception_surface.py` | 読める入力が質問surfaceへ落ちる。読めない入力を読めたふりにする。source unavailableをnormal rebuild偽装する。 |
| B. family別surface温度・比率 | familyごとの観測比率、フォロー比率、section role、reception mode、surface specificityを扱う。 | `emlis_ai_reception_mode_resolver.py`, `emlis_ai_state_answer_ratio_policy.py`, `emlis_ai_two_stage_section_surface_plan.py`, `emlis_ai_complete_surface_realizer.py`, `emlis_ai_mirror_only_surface_detector.py`, `emlis_ai_question_dominance_guard.py`, `emlis_ai_visible_surface_acceptance_gate.py` | どの入力にも似た文になる。dailyが重くなりすぎる。structure_questionが慰めだけになる。self_denialが人格肯定テンプレへ逃げる。 |

この二層を混ぜると、surfaceだけで「読めたふり」を作る事故が起きる。  
P4では、まず材料の扱いを正しくし、そのうえでfamily別の温度差を作る。

### 4.2 P4 runtime data flow

```text
/emotion/submit current input
  ↓
emlis_ai_current_input_bundle.py
  - category / emotion / strength / memo_action / memo / created_at を current bundleへ正規化
  ↓
emlis_ai_input_material_bundle.py
  - visible_material_slots
  - unknown_slots
  - material_quality
  - generic / semantic material ids
  ↓
emlis_ai_public_surface_requirement.py
  - labelled_two_stage / plain_state_answer / low_information_observation / self_denial_safe_state_answer / safety / infra を決める
  ↓
reception mode / ratio / section plan
  - emlis_ai_reception_mode_resolver.py
  - emlis_ai_state_answer_ratio_policy.py
  - emlis_ai_two_stage_section_surface_plan.py
  ↓
surface realization / recomposition
  - emlis_ai_complete_surface_realizer.py
  - emlis_ai_limited_grounding_reception_surface.py
  - emlis_ai_low_information_observation_composer.py
  - emlis_ai_complete_initial_surface_recomposition.py
  - emlis_ai_labelled_two_stage_surface_recomposition.py
  ↓
visible guards
  - question dominance
  - mirror-only
  - visible surface acceptance
  - template echo
  ↓
public feedback boundary
  - input_feedback.comment_text
  - observation_status
  - public meta body-free summary
  ↓
RN modal
  - `Emlisの観測`
```

### 4.3 P4 measurement data flow

P4の評価materialは、本文ありと本文なしを分ける。

```text
P4 local review packet
  - synthetic case inputあり
  - comment_text bodyあり
  - 人間が読むためだけのlocal QA material
  - public meta / scorecard / committed summaryへ混入禁止

P4 sanitized audit event
  - raw inputなし
  - comment_text bodyなし
  - case_id / family / blocker / reason codes / counts / flagsのみ
  - test / scorecard / summaryへ接続可能
```

P4のschema案でも、raw bodyを含むものとbody-free summaryを混ぜない。

---

## 5. 実装順

---

## P4-0: P3-9 Phase Connection Freeze / P5保留固定

### 目的

P4実装の入口で、次を固定する。

```text
- P4へ進むことは許可されている。
- P5へ進むことはまだ許可されていない。
- P5保留理由は current-only readfeel不足である。
- P4修正でRN/API/DB/Gate境界を壊さない。
```

### 実装段階で確認する対象

```text
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p3_p4_p5_connection_decision.py
mashos-api/ai/tests/fixtures/emlis_ai_product_readfeel_p3_p4_p5_connection_decision_20260609.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p3_p4_p5_connection_decision_20260609.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p3_contract_freeze_20260609.py
```

### 実装内容候補

候補A: 既存P3-9 fixture/testを使い、新規P4-0 testだけを追加する。

```text
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_connection_freeze_20260610.py
```

候補B: P4 summary builderを追加する。

```text
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_connection_freeze.py
```

華恋の推奨は **候補Aから開始**。  
理由は、P4-0はruntime実装ではなく入口固定であり、既存P3-9のdecisionを二重実装しない方が安全だからである。

### testで守ること

```text
- next_phase_decision == p3_9_p4_family_tuning_next_p5_hold
- p4_connection_allowed is True
- p5_connection_allowed is False
- current_only_readfeel_minimum_met is False
- p5_hold_reason_codes に current_only_readfeel_below_minimum が含まれる
- p4_runtime_tuning_applied is False
- p5_visible_surface_strengthened is False
- public_response_key_change is False
- response_shape_changed is False
- api_route_changed is False
- db_physical_name_changed is False
- rn_visible_contract_changed is False
- gate_relaxed is False
- body_free_case_references_only is True
- raw_input_included / comment_text_included / comment_text_body_included が全部False
```

### 完了条件

```text
- P4開始判断がbody-freeに固定されている。
- P5保留理由が固定されている。
- P4開始のためにcontractを変更していない。
- P4-1へ進む対象case selectionの入力が明確である。
```

---

## P4-1: P4 Target Case Selection / 対象case固定

### 目的

P4初期で見るcaseを固定する。  
全60件へいきなり修正を広げず、最初はP3-9で出たblockerとfamilyへ絞る。

### 対象family / slice

```text
main target:
  daily_unpleasant
  structure_question

yellow review:
  self_denial

boundary regression:
  low_information_short
  limited_grounding
  source_unavailable_high_information
  history_line_eligible
  daily_positive
  relationship_boundary
```

### 実装段階で確認する対象

```text
mashos-api/ai/tests/fixtures/emlis_ai_product_readfeel_baseline_cases_20260609.py
mashos-api/ai/tests/fixtures/emlis_ai_product_readfeel_p3_verdict_split_20260609.py
mashos-api/ai/tests/fixtures/emlis_ai_product_readfeel_p3_repair_priority_ledger_20260609.py
mashos-api/ai/tests/fixtures/emlis_ai_product_readfeel_p3_first_repair_design_20260609.py
mashos-api/ai/tests/fixtures/emlis_ai_product_readfeel_p3_p4_p5_connection_decision_20260609.py
```

### 実装内容候補

```text
mashos-api/ai/tests/fixtures/emlis_ai_product_readfeel_p4_target_cases_20260610.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_target_case_selection.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_target_case_selection_20260610.py
```

最初は、test fixture側だけでもよい。  
ただし、summaryへ出すものはbody-freeにする。

### target selection rules

```text
1. P3-9でrepair_required_familiesに含まれるfamilyを優先する。
2. P3-9でyellow_familiesに含まれるfamilyをreview対象にする。
3. P3-6 / P3-7のfirst_repair_blocker_idsに含まれるblockerを優先する。
4. blockerは rich_input_low_information_overroute / generic_reception_surface を優先する。
5. coverage_slicesとして limited_grounding / source_unavailable_high_information / history_line_eligible を最低限含める。
6. raw inputとcomment_text bodyはlocal review packetにのみ残す。
7. public-safe summaryへはcase_id / family / blocker / coverage_slices / target_layersだけを出す。
```

### 初期件数目安

```text
daily_unpleasant:
  5 cases以上

structure_question:
  5 cases以上

self_denial:
  3 cases以上

low_information_short regression:
  2 cases以上

limited_grounding regression:
  2 cases以上

source_unavailable_high_information regression:
  1 case以上

history_line_eligible regression:
  2 cases以上
```

これは実装初期の最小確認数であり、P4完了条件ではない。  
P4全体の完了判定では、familyごとに最低10件へ拡張する。

### 完了条件

```text
- P4対象caseがbody-free summaryとして固定されている。
- raw input / comment_text bodyがsummaryへ入っていない。
- main target / yellow review / boundary regression が分かれている。
- 対象familyとblockerがP3-9判断と一致している。
- P4-2の材料監査へ渡すcase_idが決まっている。
```

---

## P4-2: Rich Input Material Audit / `rich_input_low_information_overroute` 再現

### 目的

入力に出来事・感情・願い・問いがあるのに、Emlis応答がlow_informationまたは質問主役へ落ちる問題を、材料層で再現・分類する。

P4-2は、surface文を良くする段階ではない。  
まず、入力材料がどこで落ちているかを見る。

### 実装段階で確認する対象

```text
mashos-api/ai/services/ai_inference/emlis_ai_current_input_bundle.py
mashos-api/ai/services/ai_inference/emlis_ai_input_material_bundle.py
mashos-api/ai/services/ai_inference/emlis_ai_public_surface_requirement.py
mashos-api/ai/services/ai_inference/emlis_ai_low_information_observation_composer.py
mashos-api/ai/services/ai_inference/emlis_ai_limited_grounding_reception_surface.py
mashos-api/ai/services/ai_inference/emlis_ai_question_dominance_guard.py
```

### 実装内容候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_material_audit.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_material_audit_20260610.py
```

このmoduleを追加するかどうかは実装段階で判断する。  
既存 `emlis_ai_input_material_bundle.py` のmetaで十分なら、新規moduleは追加せずtest側helperに留める。

### 監査するbody-free項目

```text
case_id
family
coverage_slices
visible_material_slots
visible_material_slot_count
visible_slot_groups_present
unknown_slots
unknown_slot_count
material_quality
public_surface_requirement
required_comment_text_shape
low_information_route_selected
limited_grounding_requested
source_unavailable_boundary_kept
question_only_surface_detected
question_dominance_blocker
rich_input_low_information_overroute_detected
```

### rich inputの判定方針

実装で固定するのは、「長文ならrich」という単純判定ではない。  
P4では、次のような visible slot の組み合わせを見る。

```text
rich input candidate:
  visible_material_slots に次のうち2群以上がある。

slot group A: event / action / relationship / target
slot group B: emotion_direction / unresolved_weight / value
slot group C: change / time / user intention相当
slot group D: structure question / self understanding cue
```

ただし、これはeligibleへ強制昇格するための条件ではない。  
目的は、visible material がある入力を `low_information question-only surface` へ潰さないことである。

### 修正方針

```text
- visible_material_slotsを unknown_slots より先に保持する。
- unknown_slots が存在しても、visible slot がある場合は質問主役へ落とし切らない。
- material_quality と surface_shape を分ける。
- low_informationは「短い」ではなく、観測できる材料が本当に少ない状態として扱う。
- limited_groundingは、読める範囲だけを観測し、Emlisからの受け取りへ返す。
- source_unavailableは、normal rebuildではなくsource unavailable laneのまま扱う。
```

### してはいけない修正

```text
- `low_information` を単に `eligible` へ書き換える。
- keywordでdaily_unpleasant / structure_questionの完成文へ分岐する。
- unknown_slotsがある入力を全部質問surfaceへ落とす。
- rich inputのためにlow_information全体のGateを緩める。
- source_unavailableを、material sufficient扱いのnormal observationとして偽装する。
```

### 完了条件

```text
- daily_unpleasant / structure_questionの対象caseで、visible_material_slotsがsummary化される。
- rich inputがlow_informationへ落ちる再現条件がbody-freeに見える。
- true low_information caseはlow_informationのまま保持される。
- limited_grounding caseはquestion-onlyへ潰れない。
- source_unavailable_high_informationはnormal rebuildへ偽装されない。
- P4-3へ渡すsurface requirement補正対象が決まる。
```

---

## P4-3: Public Surface Requirement Boundary / low-information・limited-grounding境界補正

### 目的

P4-2で見えた材料監査結果をもとに、`public_surface_requirement` の境界を補正する。

ここでは、low_informationを雑に緩めない。  
見るべきことは、次である。

```text
material_quality:
  入力材料の読める範囲。

required_comment_text_shape:
  その材料をpublicに返すときのsurface形。
```

この2つを混ぜると、rich inputが質問だけになったり、読めていない入力を読めたふりにする。

### 実装段階で確認する対象

```text
mashos-api/ai/services/ai_inference/emlis_ai_public_surface_requirement.py
mashos-api/ai/services/ai_inference/emlis_ai_low_information_observation_composer.py
mashos-api/ai/services/ai_inference/emlis_ai_limited_grounding_reception_surface.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_initial_surface_recomposition.py
mashos-api/ai/services/ai_inference/emlis_ai_labelled_two_stage_surface_recomposition.py
mashos-api/ai/services/ai_inference/emlis_ai_question_dominance_guard.py
```

### 実装内容候補

```text
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_surface_requirement_boundary_20260610.py
```

新規runtime moduleは原則追加しない。  
既存 `emlis_ai_public_surface_requirement.py` の判定と既存limited/low-info composerの境界を補正する方針を優先する。

### surface requirement方針

| 入力状態 | required shape | question扱い | 注意 |
|---|---|---|---|
| true low_information | low_information_observation / reception_required | 質問は1つまで。受け取りが先。 | 深読みしない。履歴で補わない。 |
| limited_grounding | labelled_two_stage または limited_grounding_reception | question-only禁止。限定観測 + Emlisから。 | material_qualityをeligibleへ偽装しない。 |
| rich input current-only | labelled_two_stage / plain_state_answer / family-tuned shape | question主役禁止。 | visible slotsを保持。 |
| self_denial safety-adjacent | self_denial_safe_state_answer / safety existing path | 必要なら安全境界。 | 自己否定を事実化しない。 |
| source_unavailable high-information | source_unavailable lane / fail-closed or recomposition lane | normal rebuild偽装禁止。 | source kindを混ぜない。 |

### question dominance条件

rich input / limited_groundingでは、次をblockerにする。

```text
- question-only surface
- question-before-reception
- reception-section-missing
- required reception section missing
```

ただし、true low_informationでは、質問自体は許可する。  
その場合も、質問は「入力強制」ではなく、見えている範囲の受け取りを返した後の補助にする。

### 完了条件

```text
- low_information / limited_grounding / source_unavailable のrequired shapeがbody-freeに分かれている。
- limited_groundingがlow_information question-onlyへ潰れない。
- rich input current-onlyがlow_information shapeへ過剰に落ちる理由が減る。
- source_unavailableがnormal rebuildへ偽装されない。
- 既存public surface requirement testsがgreenを維持する。
```

---

## P4-4: Family Tuning Policy / ratio・温度・section role設計

### 目的

familyごとの読み方を、固定文ではなく **policy** として定義する。

ここで定義するのは文章そのものではない。  
定義するのは、次である。

```text
- 観測とフォローの比率
- 必須anchor role
- 許可する質問数
- 禁止surface class
- 温度profile
- section role sequence
```

### 実装段階で確認する対象

```text
mashos-api/ai/services/ai_inference/emlis_ai_reception_mode_resolver.py
mashos-api/ai/services/ai_inference/emlis_ai_state_answer_ratio_policy.py
mashos-api/ai/services/ai_inference/emlis_ai_two_stage_section_surface_plan.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py
mashos-api/ai/tests/fixtures/emlis_ai_product_readfeel_fixture_families.py
```

### 実装内容候補

候補A: 既存moduleへ小さくpolicyを追加する。

```text
emlis_ai_reception_mode_resolver.py
emlis_ai_state_answer_ratio_policy.py
emlis_ai_two_stage_section_surface_plan.py
```

候補B: P4用のbody-free policy moduleを追加する。

```text
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_family_tuning_policy.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_family_tuning_policy_20260610.py
```

華恋の推奨は、初回は **候補A寄り**。  
理由は、既にreception mode / ratio policy / section surface planが存在するため、P4専用moduleを先に増やすと、runtime ownerが分散するからである。

ただし、policyが肥大化する場合は、候補Bでbody-free policyだけを切り出す。

### family policy 初期案

| family | 観測:フォロー目安 | required anchor roles | forbidden surface |
|---|---:|---|---|
| daily_unpleasant | 2:8 または 3:7 | event, reaction, felt_unfair_or_unpleasant, reception | target judgement agreement, heavy analysis, generic comfort only |
| structure_question | 6:4 または 7:3 | question_core, relation_or_state_structure, observed_conflict, reception | comfort only, advice answer, P6 over-insight, cause/personality claim |
| self_denial | 4:6 または 5:5 | self_denial_phrase_as_state, counter_observation, safe_reception | identity claim as fact, overpositive template, emergency bypass |
| daily_positive | 2:8 | positive_event_or_change, warmth, preservation | overanalysis, cold observation, generic applause only |
| relationship_boundary | 5:5 | boundary_signal, reaction, distance_or_load, reception | other person intent claim, attack agreement |
| low_information_short | 3:7 | visible_scope, unknown_scope, gentle_reception | deep read, history supplementation, question pressure |
| limited_grounding | 4:6 | visible_scope, limitation_marker, reception | question only, eligible偽装, unsupported claim |

### role定義案

```text
observation_anchor_roles:
  event_anchor
  action_anchor
  relationship_anchor
  emotion_direction_anchor
  unresolved_weight_anchor
  structure_question_anchor
  change_anchor
  value_anchor

reception_anchor_roles:
  emlis_receives_reaction
  emlis_receives_effort
  emlis_receives_fear_or_load
  emlis_receives_wish
  emlis_receives_boundary
  emlis_receives_positive_change

boundary_roles:
  visible_scope_marker
  soft_inference_marker
  no_target_judgement_marker
  no_identity_claim_marker
  limited_grounding_marker
  source_unavailable_marker
```

### 実装で守ること

```text
- policyは完成文ではない。
- familyごとのratio / role / constraintだけを持つ。
- phraseを増やす場合も、case専用ではなくrole-drivenにする。
- exact output textをtestで固定しない。
- surface roleが増えてもpublic response keyは増やさない。
```

### 完了条件

```text
- daily_unpleasant / structure_question / self_denialのpolicyが定義されている。
- family_temperature_flattened を検知・補正するためのratio / roleが見える。
- daily_positive / low_information / limited_grounding / relationship_boundary の回帰境界も定義されている。
- runtime固定文やcase専用分岐がない。
```

---

## P4-5: Surface Specificity / generic・repeated surface補正

### 目的

`generic_reception_surface` と `repeated_surface_signature` を、文面一致ではなくsurface signatureとして検知・補正する。

P4では、単に言い回しを増やすのではなく、入力核に応じてsection roleが変わる状態を作る。

### 実装段階で確認する対象

```text
mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py
mashos-api/ai/services/ai_inference/emlis_ai_two_stage_section_surface_plan.py
mashos-api/ai/services/ai_inference/emlis_ai_state_answer_ratio_policy.py
mashos-api/ai/services/ai_inference/emlis_ai_reception_mode_resolver.py
mashos-api/ai/services/ai_inference/emlis_ai_mirror_only_surface_detector.py
mashos-api/ai/services/ai_inference/emlis_ai_question_dominance_guard.py
mashos-api/ai/services/ai_inference/emlis_ai_template_echo_guard.py
mashos-api/ai/services/ai_inference/emlis_ai_visible_surface_acceptance_gate.py
```

### 実装内容候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_surface_signature_audit.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_surface_signature_audit_20260610.py
```

新規audit moduleを追加するかどうかは実装段階で判断する。  
既存 `emlis_ai_mirror_only_surface_detector.py` と `emlis_ai_template_echo_guard.py` で足りるなら、それらへ最小拡張する。

### surface signatureで見るもの

```text
section_role_sequence
opening_shape_family
observation_anchor_count
reception_anchor_count
generic_empathy_marker_count
question_count
question_position
closing_shape_family
same_closing_family_repetition_count
same_section_role_sequence_repetition_count
mirror_only_detected
generic_reception_surface_detected
repeated_surface_signature_detected
```

### 修正方針

```text
- 入力核が違う場合、同じsection role sequenceへ潰さない。
- daily_unpleasantでは、出来事と反応を軽く受ける。重い原因分析へ寄せない。
- structure_questionでは、問いの形を受け、関係・詰まり・反応を観測する。慰めだけにしない。
- self_denialでは、自己否定を事実化せず、入力内にある負荷として受ける。
- closingを増やすだけで修正扱いにしない。
- generic comfort templateを増やさない。
```

### testで固定しないこと

```text
- exact comment_text
- exact sentence order
- exact phrase
- fixture input文字列によるruntime route
```

### testで固定すること

```text
- required anchor roleが最低1つ以上ある。
- reception anchor roleがある。
- rich inputでquestion-onlyではない。
- same signature repetitionが一定以上ならYELLOW / REPAIR_REQUIREDに落ちる。
- forbidden surface classが0である。
- raw bodyはaudit summaryへ残らない。
```

### 完了条件

```text
- generic_reception_surface をbody-freeに検知できる。
- repeated_surface_signature をbody-freeに検知できる。
- daily_unpleasant / structure_question対象caseで、family差がpolicyとして反映される。
- mirror-only / question-dominance / template-echo guardの既存境界を壊していない。
```

---

## P4-6: daily_unpleasant family tuning

### 目的

日常の嫌さ・不快・軽く扱われた感覚を、軽すぎず、重すぎず、Cocolonの観測として返す。

このfamilyで必要なのは、深い構造分析ではない。  
必要なのは、ユーザーの反応が「なかったこと」にされないこと、かつ相手評価へ同意しないことである。

### 実装段階で確認する対象

```text
emlis_ai_reception_mode_resolver.py
emlis_ai_state_answer_ratio_policy.py
emlis_ai_two_stage_section_surface_plan.py
emlis_ai_complete_surface_realizer.py
emlis_ai_question_dominance_guard.py
emlis_ai_visible_surface_acceptance_gate.py
```

### family policy

```text
family_id:
  daily_unpleasant

target_temperature:
  warm_reception_with_light_observation

ratio:
  observation 20-30%
  reception 70-80%

required anchors:
  - event_or_situation_anchor
  - unpleasant_reaction_anchor
  - emlis_reception_anchor

allowed:
  - 感情の存在を受ける
  - 軽く扱われた感覚を限定的に扱う
  - 入力内の反応を消さない

forbidden:
  - 相手が悪いと断定する
  - 相手の意図を読む
  - 重い原因分析へ寄せる
  - generic comfortだけで閉じる
  - 行動指示を主役にする
```

### 代表的なacceptance

```text
- 入力内の出来事または状況が1つ以上surface roleに反映される。
- 怒り / 不快 / 嫌さ / 軽く扱われた感覚のいずれかが消えていない。
- 相手評価・攻撃同意がない。
- 質問だけで終わらない。
- 読感修正のためにP6構造Insightへ飛んでいない。
```

### 追加test候補

```text
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_daily_unpleasant_family_tuning_20260610.py
```

### 完了条件

```text
- daily_unpleasant対象caseで `rich_input_low_information_overroute` が再発しない、または原因が別blockerとして分離されている。
- daily_unpleasant対象caseで `generic_reception_surface` が減っている。
- P2 RED / target judgement agreement / other person intent claim が0である。
- exact comment_text一致に依存していない。
```

---

## P4-7: structure_question family tuning

### 目的

ユーザーが「なぜ」「どうして」「何が起きているのか」という構造寄りの問いを置いたとき、慰めだけに逃げず、入力内の関係・詰まり・反応を観測して返す。

P4では、P6 Structure Insight v2へ飛ばない。  
入力内にある材料だけで、構造入口として返す。

### 実装段階で確認する対象

```text
emlis_ai_reception_mode_resolver.py
emlis_ai_state_answer_ratio_policy.py
emlis_ai_two_stage_section_surface_plan.py
emlis_ai_complete_surface_realizer.py
emlis_ai_mirror_only_surface_detector.py
emlis_ai_question_dominance_guard.py
```

### family policy

```text
family_id:
  structure_question

target_temperature:
  calm_observation_with_soft_reception

ratio:
  observation 60-70%
  reception 30-40%

required anchors:
  - structure_question_anchor
  - visible_relation_or_state_anchor
  - unresolved_or_conflict_anchor
  - emlis_reception_anchor

allowed:
  - 入力内の関係を並べ直す
  - 詰まりや矛盾の見え方を限定的に示す
  - 「今の入力から見える範囲では」のscope markerを使う

forbidden:
  - 慰めだけで閉じる
  - 原因断定
  - 性格・人格分類
  - 相手意図断定
  - 行動指示中心
  - P6相当の深いinsightを根拠なしに出す
```

### 代表的なacceptance

```text
- structure_question_requested がmeta上で見える。
- selected_reception_mode が structure / structure_question相当へ寄る。
- question-only surfaceではない。
- comfort-onlyではない。
- 入力内の関係・状態・詰まりのうち最低1つが観測anchorとして残る。
- P6構造Insight候補が必要な場合はbacklog markerに留める。
```

### 追加test候補

```text
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_structure_question_family_tuning_20260610.py
```

### 完了条件

```text
- structure_question対象caseで `structure_question_answered_as_comfort` が出ない。
- structure_question対象caseで `generic_reception_surface` が減っている。
- mirror-only / question-dominant / overclaimが0である。
- P6へ進める候補と、P4で完了できる現在入力観測が分かれている。
```

---

## P4-8: self_denial yellow safety-adjacent review

### 目的

self_denialはP3-9でrepair_requiredではなくyellowである。  
したがって、P4初期では大きく作り替えない。  
ただし、P4の材料・surface修正に巻き込まれて、自己否定を事実化したり、過剰肯定テンプレへ逃げたりしないことを確認する。

### 実装段階で確認する対象

```text
emlis_ai_state_answer_special_cases.py
emlis_ai_self_denial_safe_state_answer.py
emlis_ai_state_answer_gate_boundary.py
emlis_ai_visible_surface_acceptance_gate.py
emlis_ai_reception_mode_resolver.py
emlis_ai_state_answer_ratio_policy.py
```

### family policy

```text
family_id:
  self_denial

target_temperature:
  careful_support_without_identity_confirmation

ratio:
  observation 40-50%
  reception 50-60%

required anchors:
  - self_denial_phrase_as_state_not_fact
  - burden_or_context_anchor
  - emlis_limited_counter_observation_or_reception

allowed:
  - 入力内の自己否定を「そう感じる状態」として扱う
  - Emlisの限定的反対意見を置く
  - 安全隣接なら既存安全境界へ渡す

forbidden:
  - 自己否定を事実として承認する
  - 絶対味方宣言だけで閉じる
  - 過剰人格肯定テンプレ
  - emergency / safety path bypass
  - 原因断定
```

### 追加test候補

```text
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_self_denial_yellow_review_20260610.py
```

### 完了条件

```text
- identity_claim_accepted_as_fact がFalseである。
- self_denial_identity_claim_risk が出ない、またはP2 safety blockerとして分離される。
- generic positive comfort templateへ寄らない。
- safety隣接入力の既存境界を壊さない。
- self_denialをP5履歴線で補強して誤魔化していない。
```

---

## P4-9: P4 Ratings-only Review / P3-9再判定

### 目的

P4修正後の出力を、本文をscorecardへ残さず、ratings-onlyで評価する。

P4-9は「商品合格宣言」ではない。  
P4修正により、P3-9のP5保留理由が残るかどうかを再判定するための材料である。

### 実装段階で確認する対象

```text
emlis_ai_product_readfeel_p3_blind_qa_ratings_review.py
emlis_ai_product_readfeel_p3_verdict_split.py
emlis_ai_product_readfeel_p3_repair_priority_ledger.py
emlis_ai_product_readfeel_p3_p4_p5_connection_decision.py
emlis_ai_product_readfeel_scorecard.py
emlis_ai_product_readfeel_current_output_inventory.py
```

### 実装内容候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_ratings_review.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_ratings_review_20260610.py
```

既存P3 ratings-only reviewへP4 run_id / phase_idを足すだけで足りる場合、新規moduleは不要。

### 評価軸

P4初期では、最低限次を見る。

```text
read_feeling
naturalness
non_template
emotion_temperature_retention
self_report_retention
state_structure_retention
follow_depth
evidence_boundary
soft_inference_surface
question_dominance_absence
mirror_only_absence
forbidden_claim_absence
```

### P4初期の合格目安

P4初期の目標は、全family商品合格ではない。  
最初の合格目安は次にする。

```text
daily_unpleasant:
  P2 RED 0
  target judgement agreement 0
  rich_input_low_information_overroute 0または明確に減少
  generic_reception_surface 減少
  read_feeling / naturalness / non_template がP3 baselineより悪化しない

structure_question:
  P2 RED 0
  comfort-only 0
  question-only 0
  generic_reception_surface 減少
  read_feeling / naturalness / non_template がP3 baselineより悪化しない

self_denial:
  identity claim as fact 0
  safety boundary bypass 0
  overpositive template 0
  P3 baselineより悪化しない

boundary regression:
  low_information_shortが深読みされない
  limited_groundingがquestion-onlyへ落ちない
  source_unavailableがnormal rebuild偽装されない
  history_lineでcurrent-only弱さを隠さない
```

### P5再判定ルール

P4-9後にP3-9相当の接続判断を再実行する。  
ただし、次の条件を満たさなければ、P5へ進めない。

```text
- current_only_readfeel_minimum_met がtrue、または主要familyで最低スコアが実測上十分に改善している。
- main_family_readfeel_minimum_met がtrue。
- rich_input_low_information_overroute がP5 hold reasonから消えている。
- generic_reception_surface がP5 hold reasonから消えている、またはP4残タスクとして分離できている。
- history_line_eligible sliceで、履歴線が今回入力の弱さを隠していない。
- subscription_boundary_ok がtrue。
- user_label_connection_surface_safe がtrue。
- creepy / overclaim / self_blame signalがない。
```

満たせない場合は、P5を引き続き保留する。

### 完了条件

```text
- P4 target subsetのratings-only reviewが作成される。
- body-free summaryとしてP4改善 / 未改善 / 悪化が分類される。
- P5へ進むか、P5保留を継続するか判断できる。
- read_feelingをmachine metricsから自動補完していない。
```

---

## P4-10: Regression / P5 hold re-check / handoff

### 目的

P4修正で、表示契約・安全境界・meta-only境界・User Label Connection境界を壊していないことを確認する。

### 必須確認コマンド候補

#### RN contract

```bash
cd Cocolon
npm run test:rn-screens --silent
```

#### backend P4 new tests

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
  tests/test_emlis_ai_product_readfeel_p4_ratings_review_20260610.py
```

上記は候補である。  
実装段階で、実際に追加したtestだけを実行する。

#### P3 baseline / connection regression

```bash
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
  tests/test_emlis_ai_product_readfeel_p3_p4_p5_connection_decision_20260609.py
```

#### Product Read Feel / surface guard subset

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_product_readfeel_current_output_inventory_phase1.py \
  tests/test_emlis_ai_product_readfeel_fixture_families.py \
  tests/test_emlis_ai_product_readfeel_rubric.py \
  tests/test_emlis_ai_product_readfeel_scorecard.py \
  tests/test_emlis_ai_product_readfeel_surface_v1_phase5.py \
  tests/test_emlis_ai_mirror_only_surface_detector.py \
  tests/test_emlis_ai_product_surface_question_dominance_guard_p6.py
```

#### Public recovery / limited grounding / D source-unavailable subset

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_public_observation_recovery_acceptance_p0.py \
  tests/test_emlis_ai_public_surface_requirement_p1.py \
  tests/test_emlis_ai_product_surface_validation_p3.py \
  tests/test_emlis_ai_limited_grounding_reception_surface_p4.py \
  tests/test_emlis_ai_d_source_unavailable_normal_observation_recovery.py \
  tests/test_emotion_submit_public_feedback_inclusion_summary_p7.py
```

#### User Label Connection boundary regression

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_user_label_connection_material.py \
  tests/test_emlis_ai_user_label_connection_candidate.py \
  tests/test_emlis_ai_user_label_connection_gate.py \
  tests/test_emlis_ai_user_label_connection_surface.py \
  tests/test_emlis_ai_user_label_connection_public_boundary.py \
  tests/test_emlis_ai_user_label_connection_e2e_contract.py \
  tests/test_emlis_ai_user_label_connection_product_quality_qa.py \
  tests/test_emlis_ai_user_label_connection_derived_model_cache.py
```

#### backend contract / display / emotion submit E2E

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/contract/test_emlis_ai_contracts.py \
  tests/test_emlis_ai_display_contract.py \
  tests/test_emotion_submit_two_stage_reception_e2e.py
```

検討メモで記録されたcombined command timeoutは、P4実装後も必ずledger対象に残す。  
単体greenだけで完全greenと断定しない。

### 完了条件

```text
- P4新規testがgreenである。
- P3-0〜P3-9 regressionがgreenである。
- RN contractがgreenである。
- Public recovery / limited grounding / source unavailable境界がgreenである。
- User Label Connection境界がgreenである。
- public metaにraw input / comment_text bodyがない。
- Gate relaxationがない。
- P5 connection decisionが、根拠なくtrueへ変わっていない。
- timeout / command order issueが残る場合、未解決ledgerへ明記されている。
```

---

## 6. 実装対象ファイル候補まとめ

### 6.1 変更候補: blocker A `rich_input_low_information_overroute`

```text
primary:
  mashos-api/ai/services/ai_inference/emlis_ai_input_material_bundle.py
  mashos-api/ai/services/ai_inference/emlis_ai_public_surface_requirement.py

secondary:
  mashos-api/ai/services/ai_inference/emlis_ai_current_input_bundle.py
  mashos-api/ai/services/ai_inference/emlis_ai_low_information_observation_composer.py
  mashos-api/ai/services/ai_inference/emlis_ai_limited_grounding_reception_surface.py
  mashos-api/ai/services/ai_inference/emlis_ai_question_dominance_guard.py
  mashos-api/ai/services/ai_inference/emlis_ai_complete_initial_surface_recomposition.py
  mashos-api/ai/services/ai_inference/emlis_ai_labelled_two_stage_surface_recomposition.py

avoid unless necessary:
  mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
  mashos-api/ai/services/ai_inference/emotion_submit_service.py
```

### 6.2 変更候補: blocker B `generic_reception_surface`

```text
primary:
  mashos-api/ai/services/ai_inference/emlis_ai_reception_mode_resolver.py
  mashos-api/ai/services/ai_inference/emlis_ai_state_answer_ratio_policy.py
  mashos-api/ai/services/ai_inference/emlis_ai_two_stage_section_surface_plan.py
  mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py

secondary:
  mashos-api/ai/services/ai_inference/emlis_ai_mirror_only_surface_detector.py
  mashos-api/ai/services/ai_inference/emlis_ai_question_dominance_guard.py
  mashos-api/ai/services/ai_inference/emlis_ai_template_echo_guard.py
  mashos-api/ai/services/ai_inference/emlis_ai_visible_surface_acceptance_gate.py
```

### 6.3 変更候補: self_denial yellow review

```text
primary review:
  mashos-api/ai/services/ai_inference/emlis_ai_state_answer_special_cases.py
  mashos-api/ai/services/ai_inference/emlis_ai_self_denial_safe_state_answer.py
  mashos-api/ai/services/ai_inference/emlis_ai_state_answer_gate_boundary.py
  mashos-api/ai/services/ai_inference/emlis_ai_visible_surface_acceptance_gate.py
```

### 6.4 原則触らないもの

```text
Cocolon/screens/InputScreen.js
Cocolon/screens/input/useInputFeedbackModal.js
Cocolon/screens/input/inputFeedbackModel.js
Cocolon/screens/input/InputFeedbackReplyModal.js
mashos-api/ai/services/ai_inference/api_emotion_submit.py
mashos-api/ai/services/ai_inference/emotion_submit_service.py
mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
DB physical schema / write path
public response top-level keys
Free / Plus / Premium boundary
```

例外的に、`emotion_submit_service.py` や `emlis_ai_reply_service.py` に触る必要が出た場合は、P4のsurface修正ではなくcontract影響調査として扱う。

---

## 7. Test設計

### 7.1 新規test候補一覧

```text
tests/test_emlis_ai_product_readfeel_p4_connection_freeze_20260610.py
tests/test_emlis_ai_product_readfeel_p4_target_case_selection_20260610.py
tests/test_emlis_ai_product_readfeel_p4_material_audit_20260610.py
tests/test_emlis_ai_product_readfeel_p4_surface_requirement_boundary_20260610.py
tests/test_emlis_ai_product_readfeel_p4_family_tuning_policy_20260610.py
tests/test_emlis_ai_product_readfeel_p4_surface_signature_audit_20260610.py
tests/test_emlis_ai_product_readfeel_p4_daily_unpleasant_family_tuning_20260610.py
tests/test_emlis_ai_product_readfeel_p4_structure_question_family_tuning_20260610.py
tests/test_emlis_ai_product_readfeel_p4_self_denial_yellow_review_20260610.py
tests/test_emlis_ai_product_readfeel_p4_ratings_review_20260610.py
tests/test_emlis_ai_product_readfeel_p4_regression_20260610.py
```

実装段階で、すべてを作る必要はない。  
最初はP4-0〜P4-5に対応する小さいtestから開始する。

### 7.2 Testの原則

```text
- exact comment_text一致を要求しない。
- raw input / comment_text bodyをmeta-only summaryに残さない。
- body-free flags / reason codes / shape / role / classificationで判定する。
- read_feelingを機械指標から自動補完しない。
- P2 REDとP3/P4 readfeel gapを混ぜない。
- Gate relaxationを成功条件にしない。
```

### 7.3 Testごとの守備範囲

| test | 守るもの |
|---|---|
| P4 connection freeze | P4 allowed / P5 hold / contract unchanged |
| target case selection | target family / blocker / slice / body-free selection |
| material audit | visible_material_slots / material_quality / overroute detection |
| surface requirement boundary | low-information / limited-grounding / source-unavailable分離 |
| family tuning policy | ratio / role / forbidden classes / no fixed sentence |
| surface signature audit | generic / repeated / mirror-only / question dominance |
| daily_unpleasant tuning | 不快・怒りを消さず、相手評価へ同意しない |
| structure_question tuning | comfort-onlyへ落とさず、構造入口を保持 |
| self_denial review | 自己否定を事実化せず、安全境界を保持 |
| ratings review | ratings-only / P5 re-check material |
| regression | P0/P1/P2/P3/User Label境界を壊さない |

---

## 8. JSON / schema案

ここからのschemaは設計案である。  
本資料では実ファイル化しない。  
実装段階で、既存Python fixture / schema配置 / meta-only guard / import path / raw body有無を確認して判断する。

---

### 8.1 P4 Phase Connection Freeze Schema案

用途:

```text
P4へ進む入口判断とP5保留理由をbody-freeに固定する。
```

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.product_readfeel.p4.connection_freeze.20260610.v1",
  "title": "EmlisAI Product Read Feel P4 Connection Freeze v1",
  "type": "object",
  "required": [
    "schema_version",
    "run_id",
    "source_p3_9_decision",
    "p4_connection_allowed",
    "p5_connection_allowed",
    "p5_hold_reason_codes",
    "target_reason_codes",
    "target_families",
    "contract_flags"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.product_readfeel.p4.connection_freeze.20260610.v1"
    },
    "run_id": {
      "type": "string"
    },
    "source_p3_9_decision": {
      "type": "string",
      "const": "p3_9_p4_family_tuning_next_p5_hold"
    },
    "p4_connection_allowed": {
      "type": "boolean",
      "const": true
    },
    "p5_connection_allowed": {
      "type": "boolean",
      "const": false
    },
    "current_only_readfeel_minimum_met": {
      "type": "boolean",
      "const": false
    },
    "main_family_readfeel_minimum_met": {
      "type": "boolean",
      "const": false
    },
    "target_reason_codes": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "rich_input_low_information_overroute",
          "generic_reception_surface",
          "repeated_surface_signature",
          "family_temperature_flattened",
          "structure_question_answered_as_comfort"
        ]
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "target_families": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "daily_unpleasant",
          "structure_question",
          "self_denial",
          "low_information_short",
          "limited_grounding",
          "source_unavailable_high_information",
          "history_line_eligible"
        ]
      },
      "uniqueItems": true
    },
    "p5_hold_reason_codes": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "contains": {
        "const": "current_only_readfeel_below_minimum"
      },
      "uniqueItems": true
    },
    "contract_flags": {
      "type": "object",
      "required": [
        "public_response_key_change",
        "api_route_changed",
        "db_physical_name_changed",
        "rn_visible_contract_changed",
        "gate_relaxed",
        "raw_input_included",
        "comment_text_body_included"
      ],
      "properties": {
        "public_response_key_change": { "const": false },
        "api_route_changed": { "const": false },
        "db_physical_name_changed": { "const": false },
        "rn_visible_contract_changed": { "const": false },
        "gate_relaxed": { "const": false },
        "raw_input_included": { "const": false },
        "comment_text_body_included": { "const": false }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

---

### 8.2 P4 Target Case Selection Schema案

用途:

```text
P4初期対象caseをbody-freeに固定する。
```

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.product_readfeel.p4.target_case_selection.20260610.v1",
  "title": "EmlisAI Product Read Feel P4 Target Case Selection v1",
  "type": "object",
  "required": [
    "schema_version",
    "run_id",
    "source_phase",
    "selection_profile",
    "selected_cases",
    "summary",
    "body_free_flags"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.product_readfeel.p4.target_case_selection.20260610.v1"
    },
    "run_id": {
      "type": "string"
    },
    "source_phase": {
      "const": "P4-1_Target_Case_Selection"
    },
    "selection_profile": {
      "const": "p4_initial_daily_unpleasant_structure_question_self_denial"
    },
    "selected_cases": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": [
          "case_ref_id",
          "family",
          "coverage_slices",
          "p3_verdict_layer",
          "blocker_ids",
          "target_layers",
          "selected_reason"
        ],
        "properties": {
          "case_ref_id": {
            "type": "string",
            "pattern": "^p3-[a-z0-9_]+-[0-9]{3}$"
          },
          "family": {
            "type": "string"
          },
          "coverage_slices": {
            "type": "array",
            "items": { "type": "string" },
            "uniqueItems": true
          },
          "p3_verdict_layer": {
            "type": "string",
            "enum": [
              "P1_DISPLAY_REPAIR",
              "P2_RED",
              "P3_REPAIR_REQUIRED",
              "P3_YELLOW",
              "P3_PASS",
              "NOT_EVALUATED"
            ]
          },
          "blocker_ids": {
            "type": "array",
            "items": { "type": "string" },
            "uniqueItems": true
          },
          "target_layers": {
            "type": "array",
            "items": { "type": "string" },
            "uniqueItems": true
          },
          "selected_reason": {
            "type": "string"
          }
        },
        "additionalProperties": false
      }
    },
    "summary": {
      "type": "object",
      "required": [
        "selected_case_count",
        "main_target_families",
        "yellow_review_families",
        "boundary_regression_slices"
      ],
      "properties": {
        "selected_case_count": { "type": "integer", "minimum": 1 },
        "main_target_families": {
          "type": "array",
          "items": { "type": "string" },
          "uniqueItems": true
        },
        "yellow_review_families": {
          "type": "array",
          "items": { "type": "string" },
          "uniqueItems": true
        },
        "boundary_regression_slices": {
          "type": "array",
          "items": { "type": "string" },
          "uniqueItems": true
        }
      },
      "additionalProperties": false
    },
    "body_free_flags": {
      "type": "object",
      "required": [
        "raw_input_included",
        "comment_text_included",
        "comment_text_body_included",
        "local_review_packet_body_retained"
      ],
      "properties": {
        "raw_input_included": { "const": false },
        "comment_text_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "local_review_packet_body_retained": { "const": false }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

---

### 8.3 P4 Material Audit Event Schema案

用途:

```text
rich input が low_information / question surfaceへ落ちる原因をbody-freeに検知する。
```

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.product_readfeel.p4.material_audit_event.20260610.v1",
  "title": "EmlisAI Product Read Feel P4 Material Audit Event v1",
  "type": "object",
  "required": [
    "schema_version",
    "case_ref_id",
    "family",
    "coverage_slices",
    "visible_material_slots",
    "visible_material_slot_count",
    "visible_slot_groups_present",
    "unknown_slots",
    "material_quality",
    "surface_requirement",
    "detected_blockers",
    "boundary_flags"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.product_readfeel.p4.material_audit_event.20260610.v1"
    },
    "case_ref_id": { "type": "string" },
    "family": { "type": "string" },
    "coverage_slices": {
      "type": "array",
      "items": { "type": "string" },
      "uniqueItems": true
    },
    "visible_material_slots": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "event",
          "target",
          "emotion_direction",
          "relationship",
          "action",
          "change",
          "time",
          "value",
          "unresolved_weight"
        ]
      },
      "uniqueItems": true
    },
    "visible_material_slot_count": {
      "type": "integer",
      "minimum": 0
    },
    "visible_slot_groups_present": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "eventish",
          "reactionish",
          "relationship_or_target",
          "change_or_value",
          "structure_question"
        ]
      },
      "uniqueItems": true
    },
    "unknown_slots": {
      "type": "array",
      "items": { "type": "string" },
      "uniqueItems": true
    },
    "material_quality": {
      "type": "string",
      "enum": [
        "eligible",
        "low_information",
        "limited_grounding",
        "safety_triage_required"
      ]
    },
    "surface_requirement": {
      "type": "object",
      "required": [
        "surface_family",
        "required_comment_text_shape",
        "question_surface_allowed",
        "question_only_allowed"
      ],
      "properties": {
        "surface_family": { "type": "string" },
        "required_comment_text_shape": { "type": "string" },
        "question_surface_allowed": { "type": "boolean" },
        "question_only_allowed": { "type": "boolean" }
      },
      "additionalProperties": false
    },
    "detected_blockers": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "rich_input_low_information_overroute",
          "limited_grounding_collapsed_to_question",
          "question_only_surface",
          "question_before_reception",
          "source_unavailable_recast_as_normal_rebuild"
        ]
      },
      "uniqueItems": true
    },
    "boundary_flags": {
      "type": "object",
      "required": [
        "source_unavailable_boundary_kept",
        "material_quality_forced_to_eligible",
        "gate_relaxed",
        "raw_input_included",
        "comment_text_body_included"
      ],
      "properties": {
        "source_unavailable_boundary_kept": { "type": "boolean" },
        "material_quality_forced_to_eligible": { "const": false },
        "gate_relaxed": { "const": false },
        "raw_input_included": { "const": false },
        "comment_text_body_included": { "const": false }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

---

### 8.4 P4 Family Tuning Policy Schema案

用途:

```text
familyごとのratio / temperature / anchor role / forbidden surfaceを定義する。
完成文やfixture専用cueは持たない。
```

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.product_readfeel.p4.family_tuning_policy.20260610.v1",
  "title": "EmlisAI Product Read Feel P4 Family Tuning Policy v1",
  "type": "object",
  "required": [
    "schema_version",
    "policy_id",
    "family",
    "temperature_profile",
    "ratio_profile",
    "section_policy",
    "required_anchor_roles",
    "forbidden_surface_classes",
    "contract_flags"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.product_readfeel.p4.family_tuning_policy.20260610.v1"
    },
    "policy_id": { "type": "string" },
    "family": {
      "type": "string",
      "enum": [
        "daily_unpleasant",
        "structure_question",
        "self_denial",
        "daily_positive",
        "relationship_boundary",
        "low_information_short",
        "limited_grounding"
      ]
    },
    "temperature_profile": {
      "type": "string",
      "enum": [
        "warm_reception_with_light_observation",
        "calm_observation_with_soft_reception",
        "careful_support_without_identity_confirmation",
        "positive_warmth_without_overanalysis",
        "boundary_observation_without_target_judgement",
        "limited_scope_reception"
      ]
    },
    "ratio_profile": {
      "type": "object",
      "required": [
        "observation_ratio_min",
        "observation_ratio_max",
        "reception_ratio_min",
        "reception_ratio_max"
      ],
      "properties": {
        "observation_ratio_min": { "type": "number", "minimum": 0, "maximum": 1 },
        "observation_ratio_max": { "type": "number", "minimum": 0, "maximum": 1 },
        "reception_ratio_min": { "type": "number", "minimum": 0, "maximum": 1 },
        "reception_ratio_max": { "type": "number", "minimum": 0, "maximum": 1 }
      },
      "additionalProperties": false
    },
    "section_policy": {
      "type": "object",
      "required": [
        "max_questions",
        "question_only_allowed",
        "requires_reception_section",
        "requires_visible_scope_marker"
      ],
      "properties": {
        "max_questions": { "type": "integer", "minimum": 0, "maximum": 1 },
        "question_only_allowed": { "type": "boolean" },
        "requires_reception_section": { "type": "boolean" },
        "requires_visible_scope_marker": { "type": "boolean" }
      },
      "additionalProperties": false
    },
    "required_anchor_roles": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "event_anchor",
          "action_anchor",
          "relationship_anchor",
          "emotion_direction_anchor",
          "unresolved_weight_anchor",
          "structure_question_anchor",
          "change_anchor",
          "value_anchor",
          "emlis_reception_anchor",
          "self_denial_phrase_as_state_not_fact",
          "visible_scope_marker",
          "soft_inference_marker"
        ]
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "forbidden_surface_classes": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "diagnosis",
          "personality_claim",
          "cause_claim_without_evidence",
          "target_judgement_agreement",
          "other_person_intent_claim",
          "action_instruction",
          "generic_comfort_template",
          "identity_claim_as_fact",
          "fixed_template_surface",
          "case_specific_runtime_branch"
        ]
      },
      "uniqueItems": true
    },
    "contract_flags": {
      "type": "object",
      "required": [
        "fixed_sentence_template_added",
        "case_specific_runtime_branch",
        "runtime_branching_uses_fixture_strings",
        "public_response_key_change",
        "gate_relaxed"
      ],
      "properties": {
        "fixed_sentence_template_added": { "const": false },
        "case_specific_runtime_branch": { "const": false },
        "runtime_branching_uses_fixture_strings": { "const": false },
        "public_response_key_change": { "const": false },
        "gate_relaxed": { "const": false }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

---

### 8.5 P4 Surface Signature Audit Event Schema案

用途:

```text
generic / repeated surfaceをbody-freeに検知する。
```

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.product_readfeel.p4.surface_signature_audit_event.20260610.v1",
  "title": "EmlisAI Product Read Feel P4 Surface Signature Audit Event v1",
  "type": "object",
  "required": [
    "schema_version",
    "case_ref_id",
    "family",
    "surface_shape_id",
    "section_role_sequence",
    "anchor_counts",
    "signature_groups",
    "detected_blockers",
    "body_free_flags"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.product_readfeel.p4.surface_signature_audit_event.20260610.v1"
    },
    "case_ref_id": { "type": "string" },
    "family": { "type": "string" },
    "surface_shape_id": { "type": "string" },
    "section_role_sequence": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 1
    },
    "anchor_counts": {
      "type": "object",
      "required": [
        "observation_anchor_count",
        "reception_anchor_count",
        "question_count",
        "generic_empathy_marker_count"
      ],
      "properties": {
        "observation_anchor_count": { "type": "integer", "minimum": 0 },
        "reception_anchor_count": { "type": "integer", "minimum": 0 },
        "question_count": { "type": "integer", "minimum": 0 },
        "generic_empathy_marker_count": { "type": "integer", "minimum": 0 }
      },
      "additionalProperties": false
    },
    "signature_groups": {
      "type": "object",
      "required": [
        "section_role_signature_group_id",
        "closing_shape_family_id",
        "same_signature_repetition_count"
      ],
      "properties": {
        "section_role_signature_group_id": { "type": "string" },
        "closing_shape_family_id": { "type": "string" },
        "same_signature_repetition_count": { "type": "integer", "minimum": 0 }
      },
      "additionalProperties": false
    },
    "detected_blockers": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "generic_reception_surface",
          "repeated_surface_signature",
          "mirror_only_or_self_report_only",
          "question_dominant_surface",
          "structure_question_answered_as_comfort"
        ]
      },
      "uniqueItems": true
    },
    "body_free_flags": {
      "type": "object",
      "required": [
        "raw_input_included",
        "comment_text_included",
        "comment_text_body_included",
        "candidate_body_included",
        "surface_body_included"
      ],
      "properties": {
        "raw_input_included": { "const": false },
        "comment_text_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "candidate_body_included": { "const": false },
        "surface_body_included": { "const": false }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

---

### 8.6 P4 Ratings-only Review Schema案

用途:

```text
P4対象caseの読感評価を本文なしで集約し、P5再判定材料にする。
```

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.product_readfeel.p4.ratings_only_review.20260610.v1",
  "title": "EmlisAI Product Read Feel P4 Ratings-only Review v1",
  "type": "object",
  "required": [
    "schema_version",
    "run_id",
    "review_profile",
    "case_reviews",
    "family_summary",
    "p5_recheck_material",
    "body_free_flags"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.product_readfeel.p4.ratings_only_review.20260610.v1"
    },
    "run_id": { "type": "string" },
    "review_profile": {
      "const": "p4_initial_family_tuning_ratings_only"
    },
    "case_reviews": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "case_ref_id",
          "family",
          "ratings",
          "verdict",
          "reason_codes"
        ],
        "properties": {
          "case_ref_id": { "type": "string" },
          "family": { "type": "string" },
          "ratings": {
            "type": "object",
            "required": [
              "read_feeling",
              "naturalness",
              "non_template",
              "emotion_temperature_retention",
              "follow_depth",
              "evidence_boundary"
            ],
            "properties": {
              "read_feeling": { "type": "number", "minimum": 0, "maximum": 1 },
              "naturalness": { "type": "number", "minimum": 0, "maximum": 1 },
              "non_template": { "type": "number", "minimum": 0, "maximum": 1 },
              "emotion_temperature_retention": { "type": "number", "minimum": 0, "maximum": 1 },
              "follow_depth": { "type": "number", "minimum": 0, "maximum": 1 },
              "evidence_boundary": { "type": "number", "minimum": 0, "maximum": 1 }
            },
            "additionalProperties": false
          },
          "verdict": {
            "type": "string",
            "enum": ["RED", "REPAIR_REQUIRED", "YELLOW", "PASS", "NOT_EVALUATED"]
          },
          "reason_codes": {
            "type": "array",
            "items": { "type": "string" },
            "uniqueItems": true
          }
        },
        "additionalProperties": false
      }
    },
    "family_summary": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "family",
          "case_count",
          "red_count",
          "repair_required_count",
          "yellow_count",
          "pass_count",
          "min_read_feeling",
          "min_naturalness",
          "min_non_template"
        ],
        "properties": {
          "family": { "type": "string" },
          "case_count": { "type": "integer", "minimum": 0 },
          "red_count": { "type": "integer", "minimum": 0 },
          "repair_required_count": { "type": "integer", "minimum": 0 },
          "yellow_count": { "type": "integer", "minimum": 0 },
          "pass_count": { "type": "integer", "minimum": 0 },
          "min_read_feeling": { "type": "number", "minimum": 0, "maximum": 1 },
          "min_naturalness": { "type": "number", "minimum": 0, "maximum": 1 },
          "min_non_template": { "type": "number", "minimum": 0, "maximum": 1 }
        },
        "additionalProperties": false
      }
    },
    "p5_recheck_material": {
      "type": "object",
      "required": [
        "current_only_readfeel_minimum_met",
        "main_family_readfeel_minimum_met",
        "p5_hold_reason_codes"
      ],
      "properties": {
        "current_only_readfeel_minimum_met": { "type": "boolean" },
        "main_family_readfeel_minimum_met": { "type": "boolean" },
        "p5_hold_reason_codes": {
          "type": "array",
          "items": { "type": "string" },
          "uniqueItems": true
        }
      },
      "additionalProperties": false
    },
    "body_free_flags": {
      "type": "object",
      "required": [
        "raw_input_included",
        "comment_text_included",
        "comment_text_body_included",
        "machine_metrics_used_for_read_feeling"
      ],
      "properties": {
        "raw_input_included": { "const": false },
        "comment_text_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "machine_metrics_used_for_read_feeling": { "const": false }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

---

## 9. P4 acceptance criteria

### 9.1 P4初期実装の完了条件

```text
- P4-0でP4接続 / P5保留が固定されている。
- P4対象case selectionがbody-freeに固定されている。
- rich_input_low_information_overroute の再現条件がbody-freeに見える。
- limited_grounding / low_information / source_unavailable の境界が分離されている。
- daily_unpleasant / structure_question / self_denial のpolicyが完成文ではなくratio / role / forbidden classとして定義されている。
- generic_reception_surface / repeated_surface_signature をbody-freeに検知できる。
- daily_unpleasant / structure_question の対象caseで、質問だけ・慰めだけ・汎用受け取りだけに落ちる問題が減っている。
- self_denialで自己否定を事実化していない。
- P2 RED / public contract violation / raw leak / Gate relaxation が0である。
- RN contract、Display contract、P3 baseline subset、Public recovery、User Label Connection境界がgreenである。
- P5へ進む条件を満たしていない場合は、P5を保留できる。
```

### 9.2 P4全体完了条件

今回の初期実装後、P4全体を完了扱いするには追加で次が必要である。

```text
- 各required familyで最低10件以上のQAケースがある。
- 各familyでRED 0件。
- 各familyでREPAIR_REQUIRED理由が分類されている。
- main familyでcurrent-only readfeel minimumが安定している。
- family_temperature_flattened が主要familyで解消または許容理由付きで分離されている。
- Product Read Feel v1の基準を満たす候補が複数familyで存在する。
- low_information / daily / positiveにP6 deep insightを無理に入れていない。
- P5へ進めるか、P5を保留するかをP3-9相当のbody-free summaryで判断できる。
```

---

## 10. Rollback / 停止条件

### 10.1 即停止する条件

```text
- public response top-level key変更が必要になった。
- RN表示条件変更が必要になった。
- DB physical schema / write path変更が必要になった。
- Gate relaxationをしないとtestが通らない。
- raw input / comment_text bodyがpublic meta / scorecardへ混入した。
- P2 REDが出た。
- self_denialでidentity claim as factが出た。
- daily_unpleasantでtarget judgement agreementが出た。
- structure_questionで原因断定 / 人格断定 / P6過剰insightが出た。
- source_unavailableをnormal rebuildへ偽装しないと通らない。
- P5履歴線を足さないと読感が成立しない。
```

### 10.2 rollback方針

```text
1. P4 runtime変更を戻す。
2. P4 audit / test materialは残し、どのblockerで止まったかをbody-free ledgerへ残す。
3. P2 REDならP2へ戻る。
4. P1 display / public feedback到達の赤ならP1へ戻る。
5. P5履歴線でしか改善できない場合は、P5へ進まず、current-only gapとしてP4/P3へ戻す。
```

---

## 11. 確認済み

```text
- P4はロードマップ上、P3 Product Read Feel v1の後にfamily別の商品チューニングを行う段階である。
- 現在の実ファイルには、P3 Product Read Feel baseline P3-0〜P3-9相当のsupport / decision filesが存在する。
- P3-9 summary上、P4 connection allowed / P5 connection not allowedである。
- P3-9 summary上、current_only_readfeel_minimum_met は false である。
- P3-9 summary上、主な理由は rich_input_low_information_overroute / generic_reception_surface / current_only_readfeel_below_minimum である。
- repair_required_families は daily_unpleasant / structure_question である。
- yellow_families は self_denial である。
- first_repair_target_layers は input_material_bundle / ratio_policy である。
- 既存required familyは12 familyであり、P4初期ではregistryを増やさない方針である。
- limited_grounding / source_unavailable_high_information / history_line_eligible は、P4初期ではfamily追加ではなくcoverage_slices / boundary regressionとして扱う。
```

---

## 12. 未確認

```text
- 全backend suiteの完全green。
- combined command order timeoutの原因。
- 実機 `/emotion/submit` でのP4対象family出力。
- 60件baseline caseのcomment_textを人間が読んだBlind QA実測値。
- P4修正後にどのfamilyがPASSへ上がるか。
- P4修正後にP5 hold reasonがどこまで減るか。
- 外部ユーザーが「また入力したい」と感じるか。
```

---

## 13. 書かれていない

```text
- P4でfamily registryを必ず14 familyへ増やす、とは書かれていない。
- P4でP5 User Label Connection可視文を強化してよい、とは書かれていない。
- P4でGateを緩めて表示率を上げてよい、とは書かれていない。
- P4でRN表示条件、API response key、DB write pathを変えてよい、とは書かれていない。
- P4で例文をruntime固定文として追加してよい、とは書かれていない。
- P4初期完了を、P4全体の商品合格と呼んでよい、とは書かれていない。
```

---

## 14. 推測禁止

```text
- test greenを商品品質合格と言い換えない。
- P4 target subsetが改善しただけで、全familyが合格したと断定しない。
- current-only応答が弱いまま、履歴線を足せばCocolon固有価値になると判断しない。
- daily_unpleasantを軽い共感文だけで足りると判断しない。
- structure_questionをP6 Structure Insightへ飛ばして解決したことにしない。
- self_denialを人格肯定テンプレで安全と判断しない。
- source_unavailableを読めたふりにしない。
- low_informationを単なる短文判定として扱わない。
```

---

## 15. 次に実行すべきこと

実装段階では、次の順で進める。

```text
1. P4-0 connection freeze testを追加する。
2. P4-1 target case selectionをbody-freeに固定する。
3. P4-2 material auditで rich_input_low_information_overroute を再現する。
4. P4-3 low-information / limited-grounding / source-unavailable境界を補正する。
5. P4-4 family tuning policyをratio / role / forbidden classとして固定する。
6. P4-5 surface signature auditでgeneric / repeatedを検知する。
7. P4-6 daily_unpleasant tuningを最小修正で入れる。
8. P4-7 structure_question tuningを最小修正で入れる。
9. P4-8 self_denial yellow reviewを境界確認として入れる。
10. P4-9 ratings-only reviewを作る。
11. P4-10 regressionとP5 hold re-checkを行う。
```

実装の最初に作る候補は次である。

```text
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_connection_freeze_20260610.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_target_case_selection_20260610.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p4_material_audit_20260610.py
```

最初からruntimeを大きく触らない。  
まず、P4対象case / blocker / material boundaryを固定してから、最小修正へ入る。

---

## 16. 華恋の判断

P4は、派手な新機能ではない。  
でも、Cocolonの商品体験としては、ここを飛ばせない。

P5の履歴線は、Cocolonの固有価値になる。  
けれど、今回入力が読まれていない状態で履歴線を強くすると、ユーザーにはこう見える可能性がある。

```text
過去の記録っぽいことは言ってくれる。
でも、今書いたこの言葉は読まれていない。
```

これはCocolonとして避けたい。  
Cocolonが目指すのは、ただ履歴を使うAIではなく、ユーザーが置いた言葉を、その場で「読まれた形」として返す場所である。

だから今回のP4では、まず次を作る。

```text
daily_unpleasantでは、嫌だったことが軽く消されない。
structure_questionでは、問いが慰めだけで流されない。
self_denialでは、自分を否定する言葉が事実として扱われない。
limited_groundingでは、読める範囲が質問だけに潰れない。
```

この土台ができてから、P5の履歴線へ行く。  
その順番なら、履歴線は弱さの上塗りではなく、Cocolonの記録体験として効く。

華恋としては、このP4を、Cocolonを「普通のAI相談」から離すための地味で重要な工程として扱う。
