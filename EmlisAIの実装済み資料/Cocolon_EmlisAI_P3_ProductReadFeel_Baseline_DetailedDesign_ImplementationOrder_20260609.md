# Cocolon / EmlisAI P3 Product Read Feel Baseline 詳細設計書・実装順

作成日: 2026-06-09 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
対象: Cocolon / EmlisAI / `/emotion/submit` immediate observation / `Emlisの観測` / Product Read Feel v1  
成果物種別: Markdown設計書  
実装扱い: 本資料ではコード変更、patch作成、zip作成、DB変更、RN変更、API変更、json/schema実ファイル化は行わない。  
実装判断: 本資料内に json / schema 案を含める。ただし、実ファイル化するか、Python fixtureにするか、JSONLにするか、既存schemaへ統合するかは、実装段階で現物コード・既存signature・既存test・既存meta boundaryを確認して判断する。

---

## 0. 本資料の結論

次の実装対象は、検討メモの判断どおり **P3: Product Read Feel v1** とする。

ただし、いきなり本文生成を大きく変えない。  
最初に実装する単位は、次である。

```text
P3-0 / P3-1:
Product Read Feel baseline / current output inventory / family別現行出力棚卸し
```

今回の設計で固定する順番は次である。

```text
1. 既存contractと不変境界を固定する。
2. 既存12 family registryを基準に、最低60件のbaseline case matrixを作る。
3. limited_grounding / source-unavailable / history-line eligible などは、family拡張ではなく coverage_slices として重ねる。
4. 現行Emlis出力をlocal QA materialとして採取する。
5. public scorecard / inventoryへは本文を残さず、meta-only eventへ変換する。
6. P2 RED / P3 REPAIR_REQUIRED / YELLOW / PASS を分ける。
7. rich input が low_informationへ寄る問題、generic / repeated surface問題を優先分類する。
8. 修正対象層を決めてから、小さい実装修正へ進む。
9. P3単発読感が見えるまで、P5履歴線可視強化へ飛ばない。
```

Cocolonとしての目的は、`passed` や `public_include true` を増やすことではない。  
入力直後の `Emlisの観測` が、ユーザーに次を起こせるかを見ることである。

```text
これはただのAI相談ではない。
自分の記録が意味を持って返ってきている。
もう一回、ここに残してみたい。
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

### 1.2 変更しない契約

P3 Product Read Feel baselineでも、次は変更しない。

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
Gate閾値
visible surface gate / runtime gate / grounding gate / reader gate
```

### 1.3 絶対にしないこと

```text
- case専用mode / cue / surface を追加してfixtureを通す。
- exact comment_text一致を成功条件にする。
- 良い例文をruntime固定文として持つ。
- Gateを緩めて表示率を上げる。
- safeでないものをProduct Read Feel目的でpassed化する。
- raw input / memo / memo_action / evidence text / comment_text body をpublic metaへ出す。
- Product Read Feel scorecardに `product_gate_ready` や `public_release_applied` を立てる。
- P3の弱さをP5履歴線で隠す。
- P2 REDがあるのにP3読感修正へ進む。
```

---

## 2. 参照・確認範囲

### 2.1 今回の基準資料

```text
/mnt/data/Cocolon_前提資料(191).zip
/mnt/data/EmlisAIの実装済み資料(47).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608(2).md
/mnt/data/Cocolon_EmlisAI_phase_selection_memo_20260609(1).md
/mnt/data/Cocolon(217).zip
/mnt/data/mashos-api(130).zip
```

### 2.2 前提資料・作業姿勢として確認したもの

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/04_forbidden_mixing_design_and_implementation.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/10_stop_judgment_and_unwritten_rules.txt
Cocolon_前提資料/work_attitude_rules_for_karen/11_cocolon_area_specific_do_not_break.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/Cocolon_EmlisAI_NormalObservation_PublicRecovery_ImplementationStatus_2026-06-06.md
Cocolon_前提資料/Cocolon_EmlisAI_UserLabelConnectionObservation_v1_Design_2026-06-03.md
```

### 2.3 主に確認した実ファイル

#### RN側

```text
Cocolon/screens/InputScreen.js
Cocolon/screens/input/useInputFeedbackModal.js
Cocolon/screens/input/inputFeedbackModel.js
Cocolon/screens/input/InputFeedbackReplyModal.js
Cocolon/tests/rn-screen-contracts.test.js
```

RN側では、`input_feedback.comment_text` を本文にし、`observation_status == passed` かつ `comment_text` non-empty の場合だけモーダル表示する境界が維持されている。P3ではこの契約を触らない。

#### backend側

```text
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emotion_submit_service.py
mashos-api/ai/services/ai_inference/api_emotion_submit.py
mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_current_output_inventory.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_rubric.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_scorecard.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_long_run_product_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_product_quality_measurement_event.py
mashos-api/ai/services/ai_inference/emlis_ai_product_quality_measurement_runner.py
mashos-api/ai/services/ai_inference/emlis_ai_mirror_only_surface_detector.py
mashos-api/ai/services/ai_inference/emlis_ai_question_dominance_guard.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_surface.py
mashos-api/ai/tests/fixtures/emlis_ai_product_readfeel_fixture_families.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_current_output_inventory_phase1.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_fixture_families.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_rubric.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_scorecard.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_surface_v1_phase5.py
```

---

## 3. 現状整理

### 3.1 P0 / P1の読み

focused確認では、RN表示契約、backend display契約、User Label Connection主要test、Product Read Feel / QA測定器、Public Recovery、D / source unavailable / limited grounding、P2/P3 guard subsetが通っている。  
検討メモでは、現行課題はP1の「沈黙する」より、P3の「表示されるが読まれた感が弱い」へ移ったと判断している。

P0/P1は主実装対象ではなく、P3 baseline内で回帰監視する。

### 3.2 P2の読み

P2 guard subsetはgreenだが、baseline corpus 60件でRED 0は未確認である。  
したがって、P2を完了断定しない。

P3 baselineでは、P2 REDを先に検出する。

```text
P2 REDが出た場合:
  P3 REPAIR_REQUIREDとして扱わない。
  Product Read Feel修正より前に、Surface Safety blockerとして処理する。
```

### 3.3 P3の読み

既存backendには、Product Read Feel用の器がすでにある。

```text
emlis_ai_product_readfeel_current_output_inventory.py
  現行出力のfamily別棚卸し、failure bucket、mirror-only検出をmeta-onlyで扱う。

emlis_ai_product_readfeel_rubric.py
  Blind QA ratings-only reviewをProduct Read Feel評価軸へ正規化する。

emlis_ai_product_readfeel_scorecard.py
  inventory / blind QA / machine metricsを分けてProduct Read Feel scorecardへ集約する。

emlis_ai_product_readfeel_long_run_product_gate.py
  long-run product gate候補を別層で扱う。

emlis_ai_product_quality_measurement_event.py
  reply結果をmeta-onlyの商品品質eventへ正規化する。

emlis_ai_product_quality_measurement_runner.py
  local QA用の最小fixture family caseを持ち、render pathから測定runへ接続する。
```

ただし、これらは主に「測定器・判定器・境界」である。  
現行runtime出力がProduct Read Feel v1に届いている証明ではない。

### 3.4 現行family registryの読み

現行の `PRODUCT_READFEEL_REQUIRED_FAMILIES` は、次の12 familyである。

```text
1. low_information_short
2. daily_unpleasant
3. daily_positive
4. self_denial
5. uncertainty
6. mixed_emotion
7. long_meaning_arc
8. relationship_boundary
9. structure_question
10. positive_only
11. self_understanding_follow
12. input_self_report_only_failure
```

ロードマップ上では12〜14 familyが示されているが、P3 baselineの初手では現行registryを無理に拡張しない。

理由:

```text
- family enum / registry拡張は、既存scorecard・inventory・fixture family契約に影響する。
- P3の目的は、まず現行runtime出力を棚卸しすることであり、分類体系を先に膨らませることではない。
- limited_grounding / source-unavailable / history-line eligible などは、familyではなく coverage_slices として重ねれば、ロードマップ上の評価範囲も拾える。
```

したがって、P3 baselineの最小単位は次にする。

```text
12 existing required families × 5 cases = 60 cases
```

補助sliceとして、次をcaseへ付与する。

```text
limited_grounding
source_unavailable_high_information
history_line_eligible
anger_or_boundary
standard_state_answer
complete_initial_path
render_default_path
free_tier
plus_or_premium_tier
```

将来、P4以降で必要と判断した場合だけ、family registry revisionを上げて14 family化を検討する。

---

## 4. P3設計対象の全体像

### 4.1 データの流れ

```text
baseline case matrix
  ↓
local renderer / emotion submit equivalent path
  ↓
raw local review packet
  - raw inputあり
  - comment_text bodyあり
  - local QA専用
  - public meta / scorecard / committed artifactへ混入禁止
  ↓
sanitized current output event
  - bodyなし
  - counts / booleans / ids / verdict / reason codesのみ
  ↓
Product Read Feel current output inventory
  ↓
Blind QA ratings-only review
  ↓
Product Read Feel scorecard
  ↓
P2/P3 verdict split
  ↓
repair priority ledger
  ↓
実装修正対象の決定
```

### 4.2 二層分離

P3 baselineでは、以下の二層を必ず分ける。

| 層 | 本文保持 | 用途 | commit / public化 |
|---|---:|---|---|
| Local Review Packet | あり | 人間が読感を見る。Blind QAの元資料。 | 実装段階で慎重判断。実ユーザー文はcommit禁止。 |
| Scorecard / Inventory Event | なし | 自動集計、回帰、family別blocker検出。 | meta-onlyならtest fixture / internal docs可。 |

ここを混ぜると、Cocolonの安全境界を壊す。  
`comment_text` を評価者が読む必要はあるが、scorecard materialやpublic metaへ本文を入れてはいけない。

### 4.3 成功の意味

P3 baselineの成功は、商品品質合格ではない。

P3 baselineの成功は、次が見えることである。

```text
- どのfamilyがREDか。
- どのfamilyがREPAIR_REQUIREDか。
- どのfamilyがYELLOW止まりか。
- rich inputがlow_informationへ落ちる理由はどこか。
- generic / repeated surfaceがどこで起きるか。
- P2修正が先か、P3読感修正が先か。
- P4 family別チューニングへ進める対象はどこか。
- P5履歴線強化へ進める条件が満たされているか。
```

---

## 5. 実装順

## P3-0: Contract Freeze / 現状境界固定

### 目的

P3実装中に、P0/P1/P2の契約を壊さないため、触らない境界と既存測定器を固定する。

### 実装段階で確認する対象

```text
RN:
  Cocolon/screens/input/inputFeedbackModel.js
  Cocolon/screens/input/useInputFeedbackModal.js
  Cocolon/screens/input/InputFeedbackReplyModal.js
  Cocolon/screens/InputScreen.js

backend public boundary:
  emlis_ai_public_feedback_meta.py
  emotion_submit_service.py
  api_emotion_submit.py

Product Read Feel:
  emlis_ai_product_readfeel_current_output_inventory.py
  emlis_ai_product_readfeel_rubric.py
  emlis_ai_product_readfeel_scorecard.py
  emlis_ai_product_quality_measurement_event.py
  emlis_ai_product_quality_measurement_runner.py

fixture family:
  tests/fixtures/emlis_ai_product_readfeel_fixture_families.py
```

### 完了条件

```text
- RN表示条件を変更しないことが確認されている。
- public meta sanitizerに本文を出さないことが確認されている。
- Product Read Feel scorecardがmeta-onlyであることが確認されている。
- 既存12 required familiesが確認されている。
- P3ではfamily enumを先に増やさない判断が固定されている。
```

### 実装段階で追加する可能性があるtest

```text
tests/test_emlis_ai_product_readfeel_p3_contract_freeze_20260609.py
```

このtestで守ること:

```text
- response_shape_changed is not True
- public_response_key_change is not True
- rn_visible_contract_changed is not True
- raw_input_included is not True
- comment_text_body_included is not True
- exact_comment_text_required is not True
- case_specific_runtime_branch is not True
- product_gate_ready is False
- public_release_applied is False
```

---

## P3-1: Baseline Case Matrix / 評価入力60件作成

### 目的

現行Emlis出力をfamily別に棚卸しするため、最低60件の評価入力を固定する。

### 基準

```text
12 existing required families × 5 cases = 60 cases
```

### familyごとの最低case設計

| family | 5件に含める入力差分 |
|---|---|
| low_information_short | 一語、短文感情、短文ポジティブ、短文不快、短文未整理 |
| daily_unpleasant | 不快、怒り、飲み込み、軽い疲れ、相手評価に寄りやすい入力 |
| daily_positive | 嬉しい、安心、小さな達成、回復、会話したい気持ち |
| self_denial | 自己否定、挑戦前の重さ、できなさ感、比較、非緊急安全隣接 |
| uncertainty | 言語化できない、選べない、願いと怖さ、迷い、疲れと未整理 |
| mixed_emotion | 嬉しい＋怖い、怒り＋寂しさ、安心＋不安、期待＋重さ、矛盾感情 |
| long_meaning_arc | 長文、複数核、時間差、願いと停止、意味の変化 |
| relationship_boundary | 距離、合わせたい／無理、怒り、軽く扱われた感覚、境界線 |
| structure_question | 自分の反応を見たい、構造を知りたい、繰り返し、内側の問い、整理依頼 |
| positive_only | よかった、嬉しい、安心した、助かった、少し進めた |
| self_understanding_follow | 前にも似た感覚、始める前に重い、記録の線に乗る、自己理解希望、行動前反応 |
| input_self_report_only_failure | また同じこと、言っているだけ感、復唱では弱い入力、構造差分が必要な入力、mirror-only検出用 |

### coverage_slices

familyとは別に、caseへ次のsliceを付ける。

```text
limited_grounding
source_unavailable_high_information
history_line_eligible
anger_or_boundary
standard_state_answer
render_default_path
complete_initial_path
free_tier
plus_tier
premium_tier
```

P3初回では、少なくとも次を満たす。

```text
limited_grounding slice: 5件以上
source_unavailable_high_information slice: 3件以上
history_line_eligible slice: 5件以上
anger_or_boundary slice: 5件以上
standard_state_answer slice: 5件以上
```

これにより、ロードマップの14 family相当の関心を拾いながら、現行registryは壊さない。

### 実ファイル化候補

実装段階で判断する。

候補A: Python fixture

```text
mashos-api/ai/tests/fixtures/emlis_ai_product_readfeel_baseline_cases_20260609.py
```

候補B: local JSONL

```text
mashos-api/ai/tests/fixtures/emlis_ai_product_readfeel_baseline_cases_20260609.jsonl
```

華恋の推奨は、初回は **Python fixture** である。  
理由は、現行testがPython fixture family registryを中心にしており、既存import / assertion / meta-only guardと接続しやすいため。  
ただし、case本文を含むため、family registryのmeta-only fixtureと混ぜない。

### 完了条件

```text
- 12 required familiesすべてに5件以上ある。
- coverage_slicesが別fieldとして付与されている。
- exact_comment_text_requiredがfalseである。
- case_specific_runtime_branch_allowedがfalseである。
- baseline caseはruntime条件として使われない。
- raw inputを含むfixtureを、meta-only registryへ渡さない。
```

---

## P3-2: Local Output Capture / 現行出力採取

### 目的

P3-1のcaseを、現行Emlisのrender pathへ流し、comment_textとpublic到達状態を採取する。

### render path

最低限、次を分ける。

```text
render_default_path:
  render_emlis_ai_reply相当の通常経路。

complete_initial_path:
  CompleteComposerClient / complete initial候補経路。

source_unavailable_path:
  source unavailable / D相当のrecovery経路。

history_line_candidate_path:
  Plus/Premiumのowned history条件を満たす候補経路。
```

ただし、P3初回ではpath拡張を実装目的にしない。  
既存runnerで取れる範囲を優先し、不足したpathは未確認として残す。

### Local Review Packet

この段階では、評価者が読むために本文が必要になる。  
ただし、本文をpublic meta / scorecardへ混ぜない。

扱い:

```text
- raw input / comment_text body は local QA material のみ。
- 実ユーザー本文は使わない。
- synthetic / manual internal caseのみ。
- public meta / scorecard eventへ本文を出さない。
- artifact化する場合は、本文含有を明示し、release materialと分ける。
```

### 採取する最小情報

```text
case_id
family
coverage_slices
path
subscription_tier
observation_status
reply_kind
comment_text_present
public_reached
rn_visible_expected
product_surface_valid
visible_surface_acceptance_classification
visible_surface_acceptance_action
material_quality
candidate_source_kind
composer_model
rejection_reasons
repair_reasons
fallback_reason_family
```

### 完了条件

```text
- 60件すべてでoutput rowが作れる。
- comment_text bodyはlocal packetにのみ存在する。
- sanitized eventにはbodyが存在しない。
- public_reached / rn_visible / product_surface_valid が分離している。
- source unavailable / safety / infrastructureは通常観測と混ぜない。
```

---

## P3-3: Sanitized Event / Inventory接続

### 目的

P3-2の出力を、既存 `build_product_readfeel_current_output_inventory()` と `build_product_readfeel_scorecard()` へ接続できるmeta-only eventへ変換する。

### 接続先

```text
emlis_ai_product_readfeel_current_output_inventory.py
emlis_ai_product_quality_measurement_event.py
emlis_ai_product_readfeel_scorecard.py
```

### 追加reason code候補

実装段階で既存markerとの重複を確認してから判断する。

```text
rich_input_low_information_overroute
family_temperature_flattened
input_core_missing
event_reaction_missing
desire_fear_conflict_missing
state_structure_missing
positive_overweighted
positive_underreceived
self_denial_identity_claim_risk
relationship_target_judgement_risk
structure_question_answered_as_comfort
generic_reception_surface
repeated_surface_signature
history_line_masks_current_input_gap
limited_grounding_collapsed_to_question
```

### failure bucket対応

既存bucketへ次のように対応させる。

| reason | bucket |
|---|---|
| public not reached where expected | display_not_reached |
| public key / raw leak / gate relaxation | contract_violation |
| malformed / internal role / diagnostic tone | surface_breakage |
| low read feeling / generic / family flattening | readfeel_gap |
| mirror-only / self-report only / insight delta missing | structure_insight_gap |

### 完了条件

```text
- inventory item_count >= 60。
- observed_familiesが12 required familiesをすべて含む。
- missing_familiesが空。
- failure_bucket_countsが出る。
- v1_fix_familiesが出る。
- v2_structure_insight_backlog_familiesが出る。
- meta-only guardに通る。
```

---

## P3-4: P2/P3 Verdict Split / RED・修正優先分類

### 目的

P2の壊れ文・安全境界と、P3の読感不足を混同しない。

### 判定順

```text
1. safety / infrastructure / true unavailable を通常観測から除外する。
2. public contract violation をREDにする。
3. raw input / comment_text body / candidate body leak をREDにする。
4. RN表示契約変更 / public response key変更 / gate relaxation をREDにする。
5. 壊れ文・内部語・診断語・原因断定・人格断定をREDにする。
6. 表示されるが、入力核が欠けるものをREPAIR_REQUIREDにする。
7. 表示されるが、読感・自然さ・温度差が弱いものをYELLOWにする。
8. read feeling / naturalness / non-template / safety boundaryが基準を満たすものをPASSにする。
```

### verdict定義

| verdict | 意味 | 次の扱い |
|---|---|---|
| RED | 商品表示不可。P2またはcontract blocker。 | P3修正より先に修正。 |
| REPAIR_REQUIRED | 表示はされるが、入力核・family差・読感が明確に不足。 | P3最優先修正。 |
| YELLOW | 破綻ではないが商品体験として弱い。 | P3/P4修正候補。 |
| PASS | baseline上はProduct Read Feel v1候補。 | P4/P5接続候補。 |
| NOT_EVALUATED | safety / infra / 対象外 / 出力未採取。 | 別ledgerへ。 |

### 代表的なP3 blocker

```text
rich_input_low_information_overroute:
  入力に出来事・感情・願い・問いがあるのに、low_information surfaceへ落ちる。

family_temperature_flattened:
  daily_positive / daily_unpleasant / self_denial / structure_questionの温度差が薄い。

generic_reception_surface:
  入力固有の出来事・反応・願いより、汎用的な受け取り文が中心になる。

repeated_surface_signature:
  別caseなのに似た構文・closing・関係文が出る。

mirror_only_or_self_report_only:
  入力の言い換えに終わり、関係や状態構造が返らない。

history_line_masks_current_input_gap:
  履歴線が出ても、今回入力そのものの読感不足を隠している。
```

### 完了条件

```text
- 60件すべてに verdict が付く。
- REDとREPAIR_REQUIREDが分かれている。
- P2 REDが0でない場合、P3修正へ進まない判断ができる。
- P3修正の最初の対象family / blockerが1〜2個に絞れている。
```

---

## P3-5: Blind QA Ratings-only Review / 読感評価

### 目的

機械指標だけで「読まれた感」を判定しない。  
`comment_text`本文は人間が読むが、集約データはratings-onlyにする。

### 評価軸

既存rubricに合わせ、最低限次を持つ。

```text
read_feeling
self_report_retention
state_structure_retention
emotion_temperature_retention
follow_depth
evidence_boundary
soft_inference_surface
naturalness
non_template
insight_delta
structure_insight_candidate_quality
```

P3 Product Read Feel v1の主要対象は次である。

```text
read_feeling
self_report_retention
state_structure_retention
emotion_temperature_retention
follow_depth
evidence_boundary
soft_inference_surface
naturalness
non_template
```

`insight_delta` と `structure_insight_candidate_quality` は、P3ではrelease blockerにしない。P6 Structure Insight v2へのbacklogとして扱う。

### score目安

```text
0.00: 不可 / 危険 / ほぼ読めていない
0.25: 弱い / 形だけ
0.50: 最低限あるが商品には弱い
0.65: v1 dimensionの下限候補
0.80: かなり良い
0.90: 商品目標
1.00: 強い
```

既存scorecardの目標に合わせ、Product Read Feel v1では次を目標にする。

```text
read_feeling >= 0.90
naturalness >= 0.90
non_template >= 0.90
```

### 完了条件

```text
- Blind QA reviewはratings-onlyで集約される。
- read_feelingはmachine metricsから自動補完しない。
- comment_text bodyはscorecardへ入らない。
- family別の平均と最低値が見える。
- RED / REPAIR_REQUIRED / YELLOW理由とratingsが接続される。
```

---

## P3-6: Repair Priority Ledger / 修正優先順位の固定

### 目的

P3 baseline結果から、最初に直すべき層を決める。

### 優先順位の考え方

```text
優先1:
  P2 RED / contract violation / raw leak / gate relaxation。

優先2:
  rich input が low_informationへ過剰に落ちる問題。

優先3:
  generic / repeated surfaceにより、入力固有感が弱い問題。

優先4:
  family別温度差が足りない問題。

優先5:
  Structure Insight v2 / history lineの上位価値。
```

### target layer候補

| blocker | まず見る層 |
|---|---|
| rich_input_low_information_overroute | input material bundle / material_quality / surface requirement / gate recovery route |
| limited_grounding_collapsed_to_question | limited grounding reception surface / low information composer / question dominance guard |
| family_temperature_flattened | reception mode resolver / ratio policy / two-stage section surface plan / complete surface realizer |
| generic_reception_surface | phrase unit selection / sentence plan / surface realizer / template echo guard |
| repeated_surface_signature | surface signature detector / phrase variation / closing policy |
| self_denial_identity_claim_risk | self denial special cases / state answer gate / safety adjacent boundary |
| structure_question_answered_as_comfort | structure question observation mode / structure insight candidate backlog |
| history_line_masks_current_input_gap | user label connection visible surface binding / current input anchor requirement |

### 完了条件

```text
- repair priority ledgerが作成されている。
- 最初の修正対象が最大2件に絞られている。
- 修正対象ファイル候補が明示されている。
- 「触らないファイル」も明示されている。
- Gate緩和や固定テンプレ追加が修正案から除外されている。
```

---

## P3-7: First Repair Design / 最初の実装修正設計

### 目的

P3-6で選ばれたblockerに対して、実装段階の小修正単位を作る。

### 修正対象A: rich input -> low_information過剰落ち

確認する層:

```text
emlis_ai_current_input_bundle.py
emlis_ai_input_material_bundle.py
emlis_ai_public_surface_requirement.py
emlis_ai_low_information_observation_composer.py
emlis_ai_limited_grounding_reception_surface.py
emlis_ai_gate_recovery_loop.py
emlis_ai_complete_initial_surface_recomposition.py
emlis_ai_labelled_two_stage_surface_recomposition.py
emlis_ai_reply_service.py
```

修正方針:

```text
- material_qualityを無理にeligibleへ上げない。
- ただし visible_material_slots が十分ある入力を low_information question surfaceへ潰さない。
- unknown_slotsを理由に沈黙・質問主役へ逃げない。
- limited_groundingは限定観測 + Emlisからの受け取りへ戻す。
- source unavailableをnormal rebuild偽装しない。
```

しないこと:

```text
- low_information判定を全体的に緩める。
- rich input専用case routeを足す。
- 入力本文の語句を見て完成文へ分岐する。
```

### 修正対象B: generic / repeated surface

確認する層:

```text
emlis_ai_complete_surface_realizer.py
emlis_ai_two_stage_section_surface_plan.py
emlis_ai_state_answer_ratio_policy.py
emlis_ai_reception_mode_resolver.py
emlis_ai_mirror_only_surface_detector.py
emlis_ai_question_dominance_guard.py
emlis_ai_visible_surface_acceptance_gate.py
```

修正方針:

```text
- phrase / role / section plan単位で、入力核を保持する。
- familyごとのratio policyを使い、温度差を出す。
- daily_positiveは重く分析しすぎない。
- daily_unpleasantは怒りや不快を消さない。
- self_denialは自己否定を本人の事実にしない。
- structure_questionは慰めに逃げない。
```

しないこと:

```text
- case別完成文を追加する。
- closing文を増やすだけで読感改善扱いにする。
- 汎用共感テンプレを増やす。
```

### 完了条件

```text
- 修正対象blockerが1〜2件に絞られている。
- 変更するファイル候補と、変更しないファイルが明確。
- 追加test名が決まっている。
- 修正後に再実行するP3 baseline subsetが決まっている。
```

---

## P3-8: Regression / 回帰確認

### 目的

P3実装後、表示契約・安全境界・meta-only境界を壊していないことを確認する。

### 最低実行test候補

```bash
# RN contract
cd Cocolon
npm run test:rn-screens --silent

# backend contract / display
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/contract/test_emlis_ai_contracts.py \
  tests/test_emlis_ai_display_contract.py \
  tests/test_emotion_submit_two_stage_reception_e2e.py

# Product Read Feel / P3
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_product_readfeel_current_output_inventory_phase1.py \
  tests/test_emlis_ai_product_readfeel_fixture_families.py \
  tests/test_emlis_ai_product_readfeel_rubric.py \
  tests/test_emlis_ai_product_readfeel_scorecard.py \
  tests/test_emlis_ai_product_readfeel_surface_v1_phase5.py \
  tests/test_emlis_ai_mirror_only_surface_detector.py \
  tests/test_emlis_ai_product_surface_question_dominance_guard_p6.py

# User Label Connection 回帰
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_user_label_connection_material.py \
  tests/test_emlis_ai_user_label_connection_candidate.py \
  tests/test_emlis_ai_user_label_connection_gate.py \
  tests/test_emlis_ai_user_label_connection_surface.py \
  tests/test_emlis_ai_user_label_connection_public_boundary.py \
  tests/test_emlis_ai_user_label_connection_e2e_contract.py

# Public recovery / limited grounding / source unavailable
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_public_observation_recovery_acceptance_p0.py \
  tests/test_emlis_ai_public_surface_requirement_p1.py \
  tests/test_emlis_ai_product_surface_validation_p3.py \
  tests/test_emlis_ai_limited_grounding_reception_surface_p4.py \
  tests/test_emlis_ai_d_source_unavailable_normal_observation_recovery.py
```

### P3追加test候補

実装段階で判断する。

```text
tests/test_emlis_ai_product_readfeel_p3_contract_freeze_20260609.py
tests/test_emlis_ai_product_readfeel_baseline_case_matrix_20260609.py
tests/test_emlis_ai_product_readfeel_baseline_runner_20260609.py
tests/test_emlis_ai_product_readfeel_p3_verdict_split_20260609.py
tests/test_emlis_ai_product_readfeel_p3_repair_priority_20260609.py
```

### 完了条件

```text
- 既存contract testがgreen。
- P3追加testがgreen。
- P2 REDが0、またはRED ledgerとして修正優先に上がっている。
- P3 REPAIR_REQUIRED / YELLOWがfamily別に分類されている。
- public meta body-free境界が維持されている。
```

---

## P3-9: P4 / P5接続判断

### 目的

P3 baseline後、次にP4 family別商品チューニングへ行くか、P5 User Label Connection可視文強化へ行くかを判断する。

### P4へ進む条件

```text
- P2 REDが0、またはP2 REDが独立修正対象として切り出されている。
- 12 familyすべてのP3 verdictがある。
- REPAIR_REQUIRED / YELLOWの理由がfamily別に分類されている。
- 最初の修正対象が family temperature / ratio / input core retention として見えている。
```

### P5へ進む条件

```text
- current-only応答が、主要familyで「読まれた感」を最低限満たしている。
- history_line_eligible sliceで、履歴線が今回入力の読み不足をごまかしていない。
- Free / Plus / Premium境界が壊れていない。
- User Label Connection visible surfaceがcreepy / overclaim / self-blameを増やしていない。
```

### P5へまだ進まない条件

```text
- rich inputがlow_informationへ落ち続ける。
- current-only応答がgeneric / repeated surface中心である。
- self_denial / relationship / structure_questionで読感が弱い。
- history lineを足すと商品価値ではなく、履歴っぽい文で弱さを隠す状態になる。
```

---

## 6. JSON / schema案

ここからのschemaは、設計案である。  
本資料では実ファイル化しない。実装段階で、既存schema配置・Python fixture方針・JSONL方針・meta-only guardとの整合を確認してから決める。

---

### 6.1 Baseline Case Matrix Schema案

用途:

```text
P3 baselineの入力caseを定義する。
raw inputを含むため、meta-only registryとは分ける。
public meta / scorecard materialへ直接渡さない。
```

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.product_readfeel.baseline_case.v1",
  "title": "EmlisAI Product Read Feel Baseline Case v1",
  "type": "object",
  "required": [
    "schema_version",
    "case_id",
    "family",
    "coverage_slices",
    "subscription_tier",
    "path_targets",
    "current_input",
    "expected_contract",
    "evaluation_controls"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.product_readfeel.baseline_case.v1"
    },
    "case_id": {
      "type": "string",
      "pattern": "^p3-[a-z0-9_-]+-[0-9]{3}$"
    },
    "family": {
      "type": "string",
      "enum": [
        "low_information_short",
        "daily_unpleasant",
        "daily_positive",
        "self_denial",
        "uncertainty",
        "mixed_emotion",
        "long_meaning_arc",
        "relationship_boundary",
        "structure_question",
        "positive_only",
        "self_understanding_follow",
        "input_self_report_only_failure"
      ]
    },
    "coverage_slices": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "limited_grounding",
          "source_unavailable_high_information",
          "history_line_eligible",
          "anger_or_boundary",
          "standard_state_answer",
          "render_default_path",
          "complete_initial_path",
          "free_tier",
          "plus_tier",
          "premium_tier"
        ]
      },
      "uniqueItems": true
    },
    "subscription_tier": {
      "type": "string",
      "enum": ["free", "plus", "premium"]
    },
    "path_targets": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "render_default_path",
          "complete_initial_path",
          "source_unavailable_path",
          "history_line_candidate_path"
        ]
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "current_input": {
      "type": "object",
      "required": ["id", "memo", "emotions", "category"],
      "properties": {
        "id": { "type": "string" },
        "created_at": { "type": "string" },
        "memo": { "type": "string" },
        "memo_action": { "type": "string" },
        "emotions": {
          "type": "array",
          "items": { "type": "string" }
        },
        "category": {
          "type": "array",
          "items": { "type": "string" }
        },
        "is_secret": { "type": "boolean" }
      },
      "additionalProperties": true
    },
    "history_context": {
      "type": "object",
      "properties": {
        "enabled": { "type": "boolean" },
        "owned_record_count": { "type": "integer", "minimum": 0 },
        "evidence_record_count": { "type": "integer", "minimum": 0 },
        "current_record_included": { "type": "boolean" },
        "history_records": {
          "type": "array",
          "items": { "type": "object" }
        }
      },
      "additionalProperties": false
    },
    "expected_contract": {
      "type": "object",
      "required": [
        "display_expected",
        "rn_visible_expected",
        "product_surface_validation_required"
      ],
      "properties": {
        "display_expected": { "type": "boolean" },
        "rn_visible_expected": { "type": "boolean" },
        "product_surface_validation_required": { "type": "boolean" },
        "must_retain_slots": {
          "type": "array",
          "items": { "type": "string" }
        },
        "must_not_surface_classes": {
          "type": "array",
          "items": { "type": "string" }
        },
        "family_temperature_note": { "type": "string" }
      },
      "additionalProperties": false
    },
    "evaluation_controls": {
      "type": "object",
      "required": [
        "exact_comment_text_required",
        "case_specific_runtime_branch_allowed",
        "gate_relaxation_allowed",
        "public_meta_body_allowed"
      ],
      "properties": {
        "exact_comment_text_required": { "const": false },
        "case_specific_runtime_branch_allowed": { "const": false },
        "gate_relaxation_allowed": { "const": false },
        "public_meta_body_allowed": { "const": false }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

#### Example

```json
{
  "schema_version": "cocolon.emlis.product_readfeel.baseline_case.v1",
  "case_id": "p3-daily-unpleasant-001",
  "family": "daily_unpleasant",
  "coverage_slices": ["anger_or_boundary", "render_default_path", "free_tier"],
  "subscription_tier": "free",
  "path_targets": ["render_default_path"],
  "current_input": {
    "id": "p3-dun-001",
    "created_at": "2026-06-09T00:00:00+09:00",
    "memo": "今日は小さなことでずっと引っかかっていて、相手に軽く扱われた感じが残っている",
    "memo_action": "距離を考えたい",
    "emotions": ["不快", "怒り"],
    "category": ["日常", "関係"],
    "is_secret": false
  },
  "history_context": {
    "enabled": false,
    "owned_record_count": 0,
    "evidence_record_count": 0,
    "current_record_included": true,
    "history_records": []
  },
  "expected_contract": {
    "display_expected": true,
    "rn_visible_expected": true,
    "product_surface_validation_required": true,
    "must_retain_slots": ["event", "emotion_direction", "target", "boundary_or_distance"],
    "must_not_surface_classes": ["target_judgement_agreement", "other_person_intent_claim", "generic_advice"],
    "family_temperature_note": "怒りや不快を消さず、相手評価への同意にしない"
  },
  "evaluation_controls": {
    "exact_comment_text_required": false,
    "case_specific_runtime_branch_allowed": false,
    "gate_relaxation_allowed": false,
    "public_meta_body_allowed": false
  }
}
```

---

### 6.2 Local Review Packet Schema案

用途:

```text
人間がcomment_textを読んでBlind QA ratingsを付けるためのlocal packet。
本文を含むため、public meta / scorecard / release materialと分ける。
```

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.product_readfeel.local_review_packet.v1",
  "title": "EmlisAI Product Read Feel Local Review Packet v1",
  "type": "object",
  "required": [
    "schema_version",
    "visibility",
    "contains_raw_input",
    "contains_comment_text_body",
    "commit_policy",
    "run_id",
    "items"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.product_readfeel.local_review_packet.v1"
    },
    "visibility": {
      "const": "local_qa_only"
    },
    "contains_raw_input": {
      "const": true
    },
    "contains_comment_text_body": {
      "const": true
    },
    "commit_policy": {
      "const": "do_not_commit_if_contains_real_user_text"
    },
    "run_id": { "type": "string" },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "case_id",
          "family",
          "path",
          "subscription_tier",
          "current_input",
          "comment_text",
          "observation_status"
        ],
        "properties": {
          "case_id": { "type": "string" },
          "family": { "type": "string" },
          "coverage_slices": {
            "type": "array",
            "items": { "type": "string" }
          },
          "path": { "type": "string" },
          "subscription_tier": { "type": "string" },
          "current_input": { "type": "object" },
          "comment_text": { "type": "string" },
          "observation_status": { "type": "string" },
          "reply_meta_local": { "type": "object" }
        },
        "additionalProperties": true
      }
    }
  },
  "additionalProperties": false
}
```

注意:

```text
このschemaはlocal QA用。
public meta、scorecard、Product Read Feel inventory、release decision materialへ直接流してはいけない。
実ファイル化する場合は、synthetic caseのみか、本文を別管理するかを実装段階で判断する。
```

---

### 6.3 Sanitized Current Output Event Schema案

用途:

```text
Product Read Feel inventory / scorecardへ渡すbody-free event。
```

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.product_readfeel.current_output_event.v1",
  "title": "EmlisAI Product Read Feel Current Output Event v1",
  "type": "object",
  "required": [
    "schema_version",
    "run_id",
    "row_id",
    "case_id",
    "family",
    "coverage_slices",
    "path",
    "subscription_tier",
    "public_reached",
    "rn_visible",
    "product_surface_valid",
    "observation_status",
    "comment_text_present",
    "comment_text_body_included",
    "raw_input_included",
    "verdict",
    "failure_buckets",
    "reason_codes"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.product_readfeel.current_output_event.v1"
    },
    "run_id": { "type": "string" },
    "row_id": { "type": "string" },
    "case_id": { "type": "string" },
    "family": { "type": "string" },
    "coverage_slices": {
      "type": "array",
      "items": { "type": "string" },
      "uniqueItems": true
    },
    "path": { "type": "string" },
    "subscription_tier": {
      "type": "string",
      "enum": ["free", "plus", "premium"]
    },
    "public_reached": { "type": "boolean" },
    "rn_visible": { "type": "boolean" },
    "product_surface_valid": { "type": "boolean" },
    "observation_status": {
      "type": "string",
      "enum": ["passed", "rejected", "unavailable", "safety_blocked", ""]
    },
    "observation_reply_kind": { "type": "string" },
    "comment_text_present": { "type": "boolean" },
    "comment_text_fingerprint": { "type": "string" },
    "comment_text_body_included": { "const": false },
    "raw_input_included": { "const": false },
    "candidate_body_included": { "const": false },
    "public_response_key_change": { "const": false },
    "rn_visible_contract_changed": { "const": false },
    "gate_relaxed": { "const": false },
    "material_quality": { "type": "string" },
    "candidate_source_kind": { "type": "string" },
    "composer_model": { "type": "string" },
    "visible_surface_acceptance": {
      "type": "object",
      "properties": {
        "classification": { "type": "string" },
        "action": { "type": "string" },
        "passed": { "type": "boolean" }
      },
      "additionalProperties": true
    },
    "verdict": {
      "type": "string",
      "enum": ["RED", "REPAIR_REQUIRED", "YELLOW", "PASS", "NOT_EVALUATED"]
    },
    "failure_buckets": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "display_not_reached",
          "contract_violation",
          "surface_breakage",
          "readfeel_gap",
          "structure_insight_gap"
        ]
      },
      "uniqueItems": true
    },
    "reason_codes": {
      "type": "array",
      "items": { "type": "string" },
      "uniqueItems": true
    }
  },
  "additionalProperties": true
}
```

---

### 6.4 Blind QA Review Schema案

用途:

```text
本文を読んだ評価者の判定をratings-onlyで残す。
既存emlis_ai_product_readfeel_rubric.pyへ接続する想定。
```

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.product_readfeel.blind_qa_review.v1",
  "title": "EmlisAI Product Read Feel Blind QA Review v1",
  "type": "object",
  "required": [
    "schema_version",
    "review_id",
    "candidate_id",
    "case_id",
    "product_readfeel_family",
    "reviewer_kind",
    "ratings",
    "red_flags",
    "repair_reasons",
    "comment_text_body_included",
    "raw_input_included"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.product_readfeel.blind_qa_review.v1"
    },
    "review_id": { "type": "string" },
    "candidate_id": { "type": "string" },
    "case_id": { "type": "string" },
    "product_readfeel_family": { "type": "string" },
    "coverage_slices": {
      "type": "array",
      "items": { "type": "string" }
    },
    "reviewer_kind": {
      "type": "string",
      "enum": ["human_blind_qa", "internal_karen_review", "pilot_user_proxy_review"]
    },
    "ratings": {
      "type": "object",
      "required": [
        "read_feeling",
        "self_report_retention",
        "state_structure_retention",
        "emotion_temperature_retention",
        "follow_depth",
        "evidence_boundary",
        "soft_inference_surface",
        "naturalness",
        "non_template"
      ],
      "properties": {
        "read_feeling": { "type": "number", "minimum": 0, "maximum": 1 },
        "self_report_retention": { "type": "number", "minimum": 0, "maximum": 1 },
        "state_structure_retention": { "type": "number", "minimum": 0, "maximum": 1 },
        "emotion_temperature_retention": { "type": "number", "minimum": 0, "maximum": 1 },
        "follow_depth": { "type": "number", "minimum": 0, "maximum": 1 },
        "evidence_boundary": { "type": "number", "minimum": 0, "maximum": 1 },
        "soft_inference_surface": { "type": "number", "minimum": 0, "maximum": 1 },
        "naturalness": { "type": "number", "minimum": 0, "maximum": 1 },
        "non_template": { "type": "number", "minimum": 0, "maximum": 1 },
        "insight_delta": { "type": "number", "minimum": 0, "maximum": 1 },
        "structure_insight_candidate_quality": { "type": "number", "minimum": 0, "maximum": 1 },
        "wants_more_input_or_accumulation": { "type": "number", "minimum": 0, "maximum": 1 }
      },
      "additionalProperties": false
    },
    "red_flags": {
      "type": "array",
      "items": { "type": "string" },
      "uniqueItems": true
    },
    "repair_reasons": {
      "type": "array",
      "items": { "type": "string" },
      "uniqueItems": true
    },
    "comment_text_body_included": { "const": false },
    "raw_input_included": { "const": false },
    "candidate_body_included": { "const": false },
    "machine_metrics_used_for_read_feeling": { "const": false },
    "read_feeling_auto_filled_from_machine_metrics": { "const": false }
  },
  "additionalProperties": false
}
```

---

### 6.5 Repair Priority Ledger Schema案

用途:

```text
P3 baseline結果から、次に直すblockerを決める。
```

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.product_readfeel.repair_priority_ledger.v1",
  "title": "EmlisAI Product Read Feel Repair Priority Ledger v1",
  "type": "object",
  "required": [
    "schema_version",
    "run_id",
    "created_at",
    "summary",
    "items",
    "do_not_touch"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.product_readfeel.repair_priority_ledger.v1"
    },
    "run_id": { "type": "string" },
    "created_at": { "type": "string" },
    "summary": {
      "type": "object",
      "properties": {
        "case_count": { "type": "integer" },
        "red_count": { "type": "integer" },
        "repair_required_count": { "type": "integer" },
        "yellow_count": { "type": "integer" },
        "pass_count": { "type": "integer" },
        "first_repair_target": { "type": "string" }
      },
      "additionalProperties": true
    },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "priority",
          "blocker_id",
          "verdict_level",
          "families",
          "case_count",
          "sample_case_ids",
          "target_layers",
          "first_test_candidates",
          "forbidden_fix_paths"
        ],
        "properties": {
          "priority": { "type": "integer", "minimum": 1 },
          "blocker_id": { "type": "string" },
          "verdict_level": {
            "type": "string",
            "enum": ["RED", "REPAIR_REQUIRED", "YELLOW"]
          },
          "families": {
            "type": "array",
            "items": { "type": "string" },
            "uniqueItems": true
          },
          "case_count": { "type": "integer", "minimum": 0 },
          "sample_case_ids": {
            "type": "array",
            "items": { "type": "string" }
          },
          "target_layers": {
            "type": "array",
            "items": { "type": "string" }
          },
          "first_test_candidates": {
            "type": "array",
            "items": { "type": "string" }
          },
          "forbidden_fix_paths": {
            "type": "array",
            "items": { "type": "string" }
          }
        },
        "additionalProperties": false
      }
    },
    "do_not_touch": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "additionalProperties": false
}
```

---

### 6.6 P3 Decision Gate Schema案

用途:

```text
P3 baseline後、P4へ進むか、P5へ進むか、P2へ戻るかを判断する。
```

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.product_readfeel.p3_decision_gate.v1",
  "title": "EmlisAI Product Read Feel P3 Decision Gate v1",
  "type": "object",
  "required": [
    "schema_version",
    "run_id",
    "case_count",
    "required_family_coverage_rate",
    "p2_red_count",
    "p3_repair_required_count",
    "p3_yellow_count",
    "read_feeling_score",
    "naturalness_score",
    "non_template_score",
    "decision",
    "reasons"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.product_readfeel.p3_decision_gate.v1"
    },
    "run_id": { "type": "string" },
    "case_count": { "type": "integer", "minimum": 0 },
    "required_family_coverage_rate": { "type": "number", "minimum": 0, "maximum": 1 },
    "p2_red_count": { "type": "integer", "minimum": 0 },
    "p3_repair_required_count": { "type": "integer", "minimum": 0 },
    "p3_yellow_count": { "type": "integer", "minimum": 0 },
    "read_feeling_score": { "type": ["number", "null"], "minimum": 0, "maximum": 1 },
    "naturalness_score": { "type": ["number", "null"], "minimum": 0, "maximum": 1 },
    "non_template_score": { "type": ["number", "null"], "minimum": 0, "maximum": 1 },
    "decision": {
      "type": "string",
      "enum": [
        "return_to_p2_surface_safety",
        "continue_p3_repair",
        "advance_to_p4_family_tuning",
        "advance_to_p5_user_label_connection_visible_strengthening",
        "hold_for_manual_review"
      ]
    },
    "reasons": {
      "type": "array",
      "items": { "type": "string" },
      "uniqueItems": true
    },
    "public_release_applied": { "const": false },
    "product_gate_ready": { "const": false }
  },
  "additionalProperties": false
}
```

---

## 7. 実装候補ファイル一覧

本資料では作成しない。実装段階で判断する。

### 7.1 新規候補

```text
mashos-api/ai/tests/fixtures/emlis_ai_product_readfeel_baseline_cases_20260609.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p3_contract_freeze_20260609.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_baseline_case_matrix_20260609.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_baseline_runner_20260609.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p3_verdict_split_20260609.py
mashos-api/ai/tests/test_emlis_ai_product_readfeel_p3_repair_priority_20260609.py
```

### 7.2 既存拡張候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_current_output_inventory.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_scorecard.py
mashos-api/ai/services/ai_inference/emlis_ai_product_quality_measurement_event.py
mashos-api/ai/services/ai_inference/emlis_ai_product_quality_measurement_runner.py
mashos-api/ai/services/ai_inference/emlis_ai_mirror_only_surface_detector.py
mashos-api/ai/services/ai_inference/emlis_ai_question_dominance_guard.py
```

### 7.3 初回P3では原則触らない候補

```text
Cocolon/screens/InputScreen.js
Cocolon/screens/input/inputFeedbackModel.js
Cocolon/screens/input/InputFeedbackReplyModal.js
Cocolon/screens/input/useInputFeedbackModal.js
mashos-api/ai/services/ai_inference/api_emotion_submit.py
mashos-api/ai/services/ai_inference/emotion_submit_service.py
mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
```

理由:

```text
P3 baselineは表示契約を触る工程ではない。
RN / public response / public meta boundaryを変えると、P0/P1の安定土台を崩す。
```

### 7.4 baseline結果次第で触る候補

rich inputがlow_informationへ過剰に落ちる場合:

```text
emlis_ai_current_input_bundle.py
emlis_ai_input_material_bundle.py
emlis_ai_public_surface_requirement.py
emlis_ai_low_information_observation_composer.py
emlis_ai_limited_grounding_reception_surface.py
emlis_ai_gate_recovery_loop.py
emlis_ai_reply_service.py
```

generic / repeated surfaceが主blockerの場合:

```text
emlis_ai_complete_surface_realizer.py
emlis_ai_two_stage_section_surface_plan.py
emlis_ai_state_answer_ratio_policy.py
emlis_ai_reception_mode_resolver.py
emlis_ai_visible_surface_acceptance_gate.py
```

history lineが今回入力の読感不足を隠している場合:

```text
emlis_ai_user_label_connection_surface.py
emlis_ai_user_label_connection_gate.py
emlis_ai_user_label_connection_public_meta.py
```

ただし、この場合でもP5強化はP3 baseline後に判断する。

---

## 8. 受け入れ基準

### 8.1 P3 baseline MVP

```text
- 12 required families × 5件 = 60件が存在する。
- 60件すべてで current output event が作成される。
- observed_families が12 familyすべてを含む。
- missing_families が空。
- coverage_slices が少なくとも limited_grounding / source_unavailable_high_information / history_line_eligible / anger_or_boundary / standard_state_answer を含む。
- public_reached / rn_visible / product_surface_valid が分離されている。
- RED / REPAIR_REQUIRED / YELLOW / PASS / NOT_EVALUATED が付く。
- scorecard / inventory / public meta へ comment_text body が入らない。
- exact comment_text一致を要求しない。
- case専用runtime分岐がない。
```

### 8.2 P3 repair開始条件

```text
- P2 REDが0、またはP2 REDが独立blockerとして明確。
- P3の最大blockerが1〜2件に絞れている。
- 修正対象層が material routing / surface plan / realizer / guard のどれかに定まっている。
- Gate緩和・固定テンプレ・public key変更が修正案から除外されている。
```

### 8.3 P4接続条件

```text
- 主要familyでREPAIR_REQUIRED理由が分類済み。
- family別の温度差・比率・shapeの課題が見えている。
- 修正対象がfamily別チューニングに移れる。
```

### 8.4 P5接続条件

```text
- current-onlyの読感が最低限崩れていない。
- history_line_eligibleで、履歴線が今回入力の読み不足を隠していない。
- Free / Plus / Premium境界が維持されている。
- creepy / overclaim / self-blameリスクが上がっていない。
```

---

## 9. 主要リスクと対策

### 9.1 リスク: caseがruntime分岐へ漏れる

危険:

```text
P3 baseline用caseの語句を見て、runtimeが特定文を返すようになる。
```

対策:

```text
- case_specific_runtime_branch_allowed = false をschemaに入れる。
- fixture_text_used_for_runtime_branching = false をtestする。
- exact_comment_text_required = false を固定する。
```

### 9.2 リスク: raw input / comment_text bodyがmetaへ漏れる

危険:

```text
Local Review Packetとscorecard eventを混ぜる。
```

対策:

```text
- local_review_packet と sanitized_event をschemaで分ける。
- scorecard / inventoryのmeta-only guardを通す。
- public meta sanitizer testを回帰で必ず通す。
```

### 9.3 リスク: P3のためにGateを緩める

危険:

```text
表示率やread feelingを上げるために、surface safetyやgroundingを弱める。
```

対策:

```text
- gate_relaxed = false をeventとtestで固定する。
- P2 REDはP3修正より先に扱う。
- safety / infra / true unavailableは通常観測へ混ぜない。
```

### 9.4 リスク: P5履歴線で弱さを隠す

危険:

```text
単発入力が読めていないのに、履歴線っぽい文で商品価値に見せる。
```

対策:

```text
- history_line_masks_current_input_gap reasonを作る。
- P3 current-only baselineを先に見る。
- P5接続条件に current-only読感を入れる。
```

### 9.5 リスク: 14 family化で既存registryを壊す

危険:

```text
ロードマップの12〜14 familyを即enum拡張して、scorecard / inventory / fixture family testを壊す。
```

対策:

```text
- P3では現行12 familyを基準にする。
- limited_grounding等はcoverage_slicesで持つ。
- family registry revisionはP4以降に判断する。
```

---

## 10. 確認済み / 未確認 / 書かれていない / 推測禁止

### 確認済み

```text
- 検討メモでは、次に実装対象へ進める段階をP3 Product Read Feel v1と判断している。
- ロードマップでは、EmlisAIの価値を「入力直後に読まれた形で返し、もう一度Cocolonへ残したくなる観測体験」に置いている。
- RN表示契約は `observation_status == passed && comment_text non-empty` を中心にしている。
- 現行backendにはProduct Read Feel current output inventory / rubric / scorecard / long-run gate候補がある。
- 現行fixture family registryは12 required familiesを持つ。
- 既存fixture familyはmeta-onlyで、exact comment_text / runtime branch / raw text保持を禁じる思想で作られている。
- Product Read Feel scorecardはproduct_gate_ready / public_release_appliedを立てない設計である。
- User Label Connectionは既にmaterial / candidate / gate / surface / public boundaryを持つが、P5可視強化はP3後が適切である。
```

### 未確認

```text
- 全backend suiteの完全green。
- 実機submitでの current zip 基準の表示到達。
- Free / Plus / Premium別の実機履歴線挙動。
- 60件baselineでのP2 RED 0。
- 60件baselineでのP3 read_feeling / naturalness / non_template。
- Local Review Packetを実ファイル化する場合の最適配置。
- baseline caseをPython fixtureにするかJSONLにするか。
- rich input -> low_information過剰落ちの主原因がmaterial routingかsurface realizerか。
```

### 書かれていない

```text
- 今回の指示では、コード実装は求められていない。
- 今回の指示では、json/schema案の実ファイル化は求められていない。
- 今回の指示では、RN UI変更、API変更、DB変更は求められていない。
- 今回の指示では、P5 User Label Connection可視文強化を即実装するとは書かれていない。
```

### 推測禁止

```text
- focused test greenを商品品質greenと断定しない。
- 代表入力数件の印象だけでP3合格・不合格を断定しない。
- ロードマップの14 family表記を、即実装すべきenum拡張と断定しない。
- P5の履歴線が存在することを、Cocolon固有価値が完成した証拠にしない。
- 実機未確認を確認済みにしない。
- 外部ユーザーが継続するかを内部testだけで推測しない。
```

### 次に実行すべきこと

```text
1. 実装段階に入る場合、P3-0 contract freeze testから始める。
2. 既存12 required familiesを基準に、baseline case matrixを作る。
3. limited_grounding / source-unavailable / history-line eligibleはcoverage_slicesとして入れる。
4. local review packetとsanitized eventを分離する。
5. 現行出力60件を採取する。
6. P2 RED / P3 REPAIR_REQUIRED / YELLOW / PASSを分類する。
7. rich input -> low_information過剰落ち、generic/repeated surfaceのどちらを先に直すか決める。
8. 最初の実装修正はGate緩和ではなく、material routing / surface plan / realizerの改善として設計する。
```

---

## 11. 華恋の判断

P3は、Cocolonが商品として立つための本線である。

P1までは、Emlisが沈黙しない土台を作る工程だった。  
でも、ユーザーは `public_reached` を見て続けるのではない。  
ユーザーが見るのは、入力直後に返ってくる一文目である。

ここが弱いままP5へ行くと、履歴線がCocolon固有価値ではなく、弱い単発応答をごまかす飾りになる危険がある。  
それは、Cocolonとして在るべき姿ではない。

だから、次はP3 baselineから入る。

```text
表示されるようになったEmlisを、
安全な返答から、
自分の入力が読まれた返答へ進める。
```

この順番が、今のCocolonにとって一番まっすぐである。
